/* ============================================================
   NEXUS STUDY — games/jogos/vdd_falso/vdd_falso.js  (v7.0)

   Responsabilidade: orquestração, estado e fluxo do jogo.
   ─────────────────────────────────────────────────────────
   Exporta CONFIG (usado pelo módulo de UI).
   Importa toda a camada visual de ./vdd_falso.ui.js.

   Conteúdo:
     • CONFIG e ESTADO global
     • Helpers de sessão (SessionNav)
     • Seleção/montagem do deck de questões
     • Fluxo: iniciarJogo → responder → navegar → finalizarJogo
     • Init: parâmetros, dados, restauração de sessão
============================================================ */

import { Shell, Timer, shuffle }                           from '../../template/game-shell.js';
import { calcularPeso, sorteiarPonderado }                 from '../../template/deck.js';
import { aplicarCoresDisciplina }                          from '../../../shared/js/theme.js';
import { carregarHistoricoVF, salvarResultadoVF }          from './storage_vf.js';
import { getUsuario, getDisciplinasDeSemestre }            from '../../../src/global.js';
import { SessionNav }                                      from '../../template/session-nav.js';

import {
  $, el, initEl,
  mostrarTela, setInfoStrip, aplicarCorBarra, mostrarFeedback,
  renderDots, renderizarBadgeHistorico, renderizarQuestao,
  atualizarBotoesNav, atualizarContadores,
  atualizarBtnRevisarErros, configurarBtnContinuar,
  setupPausa, registrarAtalhos,
  renderizarResultado, mostrarTelaRevisaoConcluida,
  renderEstatisticasQuestoes,
} from './vdd_falso.ui.js';

/* ══════════════════════════════════════════════════════════
   CONFIGURAÇÃO  (exportada para vdd_falso.ui.js)
══════════════════════════════════════════════════════════ */

export const CONFIG = Object.freeze({
  TEMPO_POR_QUESTAO:   30,
  PONTOS_ACERTO:       10,
  PONTOS_ERRO:          5,
  MAX_QUESTOES:         8,
  PESO_NUNCA_VISTA:     3,
  PESO_MIN:             1,
  PESO_MAX:            10,
  SESSAO_TTL_MS:       24 * 60 * 60 * 1000,  // 24 h
  SESSAO_THROTTLE_MS:  500,
});

/* ══════════════════════════════════════════════════════════
   ESTADO GLOBAL
══════════════════════════════════════════════════════════ */

const estado = {
  perguntas:    [],
  banco:        [],
  indice:       0,
  pontos:       0,
  acertos:      0,
  erros:        0,
  respostas:    [],
  tempos:       [],
  timer:        null,
  pausado:      false,
  usuario:      null,
  discId:       null,
  sem:          null,
  historicoVF:  {},
  modoRevisao:  false,
  cardsRevisao: null,
  tempoInicio:  null,
  _nav:         null,   // instância do SessionNav
};

/* ══════════════════════════════════════════════════════════
   HELPERS DE SESSÃO (delegam ao SessionNav)
══════════════════════════════════════════════════════════ */

function _snapshotEstado(tela = 'question') {
  return {
    perguntas:   estado.perguntas,
    respostas:   estado.respostas,
    tempos:      estado.tempos,
    indice:      estado.indice,
    pontos:      estado.pontos,
    acertos:     estado.acertos,
    erros:       estado.erros,
    modoRevisao: estado.modoRevisao,
    tela,
  };
}

function salvarSessao(tela = 'question') {
  estado._nav?.salvar(_snapshotEstado(tela));
}

function salvarSessaoThrottled() {
  estado._nav?.salvarThrottled(_snapshotEstado('question'));
}

function limparSessao() {
  estado._nav?.limpar();
}

/* ══════════════════════════════════════════════════════════
   LÓGICA DO DECK
══════════════════════════════════════════════════════════ */

function questoesComErro(banco, historico) {
  return banco
    .filter(q => {
      const h = historico[q.id];
      return h && h.erros > 0 && (h.acertosConsecutivos ?? 0) === 0;
    })
    .sort((a, b) => {
      const taxaA = historico[a.id].erros / historico[a.id].tentativas;
      const taxaB = historico[b.id].erros / historico[b.id].tentativas;
      return taxaB - taxaA;
    });
}

function montarDeck(banco, historico) {
  const n      = Math.min(CONFIG.MAX_QUESTOES, banco.length);
  const porAula = {};
  for (const q of banco) {
    const a = q.aula ?? 0;
    if (!porAula[a]) porAula[a] = [];
    porAula[a].push(q);
  }

  const sel = new Set();
  for (const aula of Object.keys(porAula)) {
    if (sel.size >= n) break;
    const cands = porAula[aula]
      .filter(q => !sel.has(q.id))
      .map(q => ({
        item: q,
        peso: calcularPeso(q.id, historico, {
          pesoNuncaVisto: CONFIG.PESO_NUNCA_VISTA,
          pesoMin:        CONFIG.PESO_MIN,
          pesoMax:        CONFIG.PESO_MAX,
        }),
      }));
    const esc = sorteiarPonderado(cands, 1);
    if (esc[0]) sel.add(esc[0].id);
  }

  const rest = banco
    .filter(q => !sel.has(q.id))
    .map(q => ({
      item: q,
      peso: calcularPeso(q.id, historico, {
        pesoNuncaVisto: CONFIG.PESO_NUNCA_VISTA,
        pesoMin:        CONFIG.PESO_MIN,
        pesoMax:        CONFIG.PESO_MAX,
      }),
    }));
  sorteiarPonderado(rest, n - sel.size).forEach(q => sel.add(q.id));

  return shuffle(banco.filter(q => sel.has(q.id)));
}

/* ══════════════════════════════════════════════════════════
   TIMER — factory
══════════════════════════════════════════════════════════ */

function criarTimer(totalInicial) {
  return Timer.criar({
    total:  totalInicial ?? CONFIG.TEMPO_POR_QUESTAO,
    onTick: (restante) => {
      estado.tempos[estado.indice] = restante;
      salvarSessaoThrottled();

      const pctReal = (restante / CONFIG.TEMPO_POR_QUESTAO) * 100;
      document.documentElement.style.setProperty('--timer-pct', pctReal + '%');
      aplicarCorBarra(pctReal);
    },
    onEnd: () => {
      if (estado.respostas[estado.indice] === undefined) {
        estado.tempos[estado.indice] = 0;
        _registrarResposta(null);
      }
    },
  });
}

/* ══════════════════════════════════════════════════════════
   RENDERIZAÇÃO (delega à UI, passa contexto)
══════════════════════════════════════════════════════════ */

function _renderizarQuestaoAtual() {
  const novoTimer = renderizarQuestao({
    perguntas:   estado.perguntas,
    respostas:   estado.respostas,
    indice:      estado.indice,
    historicoVF: estado.historicoVF,
    timer:       estado.timer,
    criarTimer,
    onNavegar:   _navegarPara,
  });
  // renderizarQuestao já para o timer anterior e devolve o novo (ou null)
  estado.timer = novoTimer;
}

/* ══════════════════════════════════════════════════════════
   FLUXO PRINCIPAL
══════════════════════════════════════════════════════════ */

function iniciarJogo(modoRevisao = false) {
  estado.modoRevisao = modoRevisao;

  if (modoRevisao) {
    if (!estado.cardsRevisao || estado.cardsRevisao.length === 0) {
      estado.cardsRevisao = questoesComErro(estado.banco, estado.historicoVF);
    }
    estado.perguntas = shuffle(estado.cardsRevisao.slice(0, CONFIG.MAX_QUESTOES));
  } else {
    estado.cardsRevisao = null;
    estado.perguntas = montarDeck(estado.banco, estado.historicoVF);
  }

  estado.indice      = 0;
  estado.pontos      = 0;
  estado.acertos     = 0;
  estado.erros       = 0;
  estado.tempoInicio = Date.now();
  estado.respostas   = new Array(estado.perguntas.length);
  estado.tempos      = new Array(estado.perguntas.length).fill(CONFIG.TEMPO_POR_QUESTAO);
  estado.pausado     = false;

  if (el.scoreCorrect) el.scoreCorrect.textContent = 0;
  mostrarFeedback(null);
  atualizarContadores(estado.perguntas.length);
  mostrarTela('question', estado.modoRevisao);
  _renderizarQuestaoAtual();
}

/* ──────────────── Resposta ──────────────── */

function responder(valor) {
  if (estado.pausado) return;
  if (estado.respostas[estado.indice] !== undefined) return;
  estado.timer?.stop();
  _registrarResposta(valor);
}

function _registrarResposta(resp) {
  const pergunta = estado.perguntas[estado.indice];
  const correto  = resp === pergunta.resposta;

  estado.respostas[estado.indice] = resp;

  if (resp !== null) {
    if (correto) {
      estado.pontos  += CONFIG.PONTOS_ACERTO;
      estado.acertos += 1;
    } else {
      estado.pontos   = Math.max(0, estado.pontos - CONFIG.PONTOS_ERRO);
      estado.erros   += 1;
    }

    // Persiste resposta e atualiza histórico em memória a partir do retorno do storage
    salvarResultadoVF(estado.usuario, estado.discId, estado.sem, [{ id: pergunta.id, resp, acertou: correto }])
      .then(historicoAtualizado => {
        if (historicoAtualizado) estado.historicoVF = historicoAtualizado;
      })
      .catch(err => console.warn('[vdd_falso] Erro ao salvar resposta:', err));
  }

  if (el.scoreCorrect) el.scoreCorrect.textContent = estado.acertos;
  _renderizarQuestaoAtual();
  salvarSessao(); // salvamento imediato após resposta
}

/* ──────────────── Navegação ──────────────── */

function _navegarPara(i) {
  if (i < 0 || i >= estado.perguntas.length) return;
  estado.indice = i;
  _renderizarQuestaoAtual();
  salvarSessao();
}

function irAnterior() {
  if (estado.indice > 0) {
    estado.timer?.stop();
    _navegarPara(estado.indice - 1);
  }
}

function irProxima() {
  const ultimo    = estado.indice === estado.perguntas.length - 1;
  const todasResp = estado.respostas.every(r => r !== undefined);

  if (ultimo && todasResp) { finalizarJogo(); return; }

  if (estado.indice < estado.perguntas.length - 1) {
    _navegarPara(estado.indice + 1);
    return;
  }

  const primeiraPendente = estado.respostas.findIndex(r => r === undefined);
  if (primeiraPendente !== -1) _navegarPara(primeiraPendente);
}

/* ──────────────── Finalizar ──────────────── */

async function finalizarJogo() {
  estado.timer?.stop();
  limparSessao();

  // sairParaRota() é chamado APÓS mostrarTela para garantir que a tela de
  // resultado seja exibida antes de qualquer efeito colateral de navegação.
  mostrarTela('result', false);
  estado._nav?.sairParaRota();

  renderizarResultado(
    {
      acertos:     estado.acertos,
      erros:       estado.erros,
      pontos:      estado.pontos,
      tempoInicio: estado.tempoInicio,
      modoRevisao: estado.modoRevisao,
    },
    {
      onSair:   _aoSair,
      onRejogo: _aoRejogo,
    },
  );

  renderEstatisticasQuestoes(estado.historicoVF, estado.perguntas, estado.respostas, estado.modoRevisao);
  atualizarBtnRevisarErros(
    questoesComErro(estado.banco, estado.historicoVF),
    () => iniciarJogo(true),
  );
}

async function _aoSair() {
  limparSessao();
  $('btn-continuar')?.classList.add('hidden');
  estado.modoRevisao  = false;
  estado.cardsRevisao = null;
  estado.perguntas    = montarDeck(estado.banco, estado.historicoVF);
  atualizarBtnRevisarErros(
    questoesComErro(estado.banco, estado.historicoVF),
    () => iniciarJogo(true),
  );
  atualizarContadores(estado.perguntas.length);
  mostrarTela('intro', false);
}

async function _aoRejogo() {
  const perguntasRound = [...estado.perguntas];
  const respostasRound = [...estado.respostas];
  const eraRevisao     = estado.modoRevisao;

  const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
  estado.historicoVF = historico;

  if (eraRevisao) {
    const erradasAgora = perguntasRound.filter((q, idx) => {
      const resp = respostasRound[idx];
      return resp === null || resp !== q.resposta;
    });
    if (erradasAgora.length === 0) {
      mostrarTelaRevisaoConcluida(_voltarParaIntro);
      return;
    }
    estado.cardsRevisao = erradasAgora;
    estado.perguntas    = shuffle(erradasAgora.slice(0, CONFIG.MAX_QUESTOES));
    atualizarContadores(estado.perguntas.length);
    iniciarJogo(true);
    return;
  }

  estado.modoRevisao  = false;
  estado.cardsRevisao = null;
  estado.perguntas    = montarDeck(estado.banco, historico);
  if (estado.perguntas.length === 0) { mostrarTela('empty', false); return; }
  atualizarContadores(estado.perguntas.length);
  iniciarJogo();
}

async function _voltarParaIntro() {
  const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
  estado.historicoVF  = historico;
  estado.modoRevisao  = false;
  estado.cardsRevisao = null;
  estado.perguntas    = montarDeck(estado.banco, historico);
  atualizarContadores(estado.perguntas.length);
  atualizarBtnRevisarErros(
    questoesComErro(estado.banco, historico),
    () => iniciarJogo(true),
  );
  mostrarTela('intro', false);
}

/* ──────────────── Voltar ao início (da pausa) ──────────────── */

async function _aoVoltarIntro() {
  estado.timer   = null;
  estado.pausado = false;

  salvarSessao('intro');

  estado.modoRevisao  = false;
  estado.cardsRevisao = null;
  estado.tempos       = [];

  const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
  estado.historicoVF = historico;
  estado.perguntas   = montarDeck(estado.banco, historico);

  atualizarBtnRevisarErros(
    questoesComErro(estado.banco, historico),
    () => iniciarJogo(true),
  );

  const sessaoParaContinuar = estado._nav?.lerSessao();
  if (sessaoParaContinuar?.perguntas?.length > 0) {
    configurarBtnContinuar(sessaoParaContinuar, continuarSessao);
  }

  if (estado.perguntas.length === 0) { mostrarTela('empty', false); return; }
  atualizarContadores(estado.perguntas.length);
  mostrarTela('intro', false);
}

/* ──────────────── Restaurar sessão ──────────────── */

function continuarSessao(sessao) {
  estado.perguntas   = sessao.perguntas;
  estado.respostas   = sessao.respostas;
  estado.indice      = sessao.indice  ?? 0;
  estado.pontos      = sessao.pontos  ?? 0;
  estado.acertos     = sessao.acertos ?? 0;
  estado.erros       = sessao.erros   ?? 0;
  estado.modoRevisao = sessao.modoRevisao ?? false;
  estado.tempoInicio = Date.now();
  estado.pausado     = false;

  // Restaura tempos — reseta o timer da questão onde parou
  const temposRestaurados = sessao.tempos
    ? [...sessao.tempos]
    : new Array(sessao.perguntas.length).fill(CONFIG.TEMPO_POR_QUESTAO);

  if (estado.respostas[estado.indice] === undefined) {
    temposRestaurados[estado.indice] = CONFIG.TEMPO_POR_QUESTAO;
  }
  estado.tempos = temposRestaurados;

  if (el.scoreCorrect) el.scoreCorrect.textContent = estado.acertos;
  atualizarContadores(estado.perguntas.length);
  mostrarTela('question', estado.modoRevisao);
  _renderizarQuestaoAtual();
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */

async function init() {
  // ── 1. Elementos DOM e Shell ──────────────────────────────
  initEl();
  const { disc, sem } = Shell.init({ icon: '⚖️', nome: 'Verdadeiro ou Falso' });

  // ── 2. Dados da disciplina ────────────────────────────────
  const _listaDisciplinas = getDisciplinasDeSemestre(sem);
  const disciplina = _listaDisciplinas.find(d => d.id === disc || d.arquivo === disc) ?? null;

  _preencherHeaderDisciplina(disc, sem, disciplina);

  // ── 3. Carrega banco de questões ──────────────────────────
  const ano = sem ? sem.split('.')[0] : null;
  let banco   = [];
  let semDisp = null;

  if (ano) {
    try {
      const modulo = await import(`../../../content/game/vdd_falso/${ano}/vdd_falso_data.js`);
      semDisp = modulo.VDD_FALSO_DATA?.[sem] ?? null;
      banco   = semDisp?.[disc] ?? [];
    } catch (err) {
      console.warn(`[vdd_falso] Arquivo de dados não encontrado para o ano ${ano}:`, err.message);
    }
  }

  estado.banco = banco;

  if (banco.length === 0) {
    mostrarTela('empty', false);
    estado._nav?.pronto();
    _configurarTelaVazia(disc, sem, semDisp);
    return;
  }

  // ── 4. Usuário e SessionNav ───────────────────────────────
  const usuarioObj   = getUsuario();
  estado.usuario     = usuarioObj?.uid ?? 'visitante';
  estado.discId      = disc;
  estado.sem         = sem;

  const nav = SessionNav.criar({
    uid:        estado.usuario,
    discId:     disc,
    sem,
    ttlMs:      CONFIG.SESSAO_TTL_MS,
    throttleMs: CONFIG.SESSAO_THROTTLE_MS,
  });
  estado._nav = nav;

  // ── 5. Histórico e deck inicial ───────────────────────────
  const historico    = await carregarHistoricoVF(estado.usuario, disc, sem).catch(() => ({}));
  estado.historicoVF = historico;
  estado.perguntas   = montarDeck(banco, historico);

  if (estado.perguntas.length === 0) {
    mostrarTela('empty', false);
    nav.pronto();
    _configurarTelaVazia(disc, sem, semDisp);
    return;
  }

  atualizarContadores(estado.perguntas.length);
  aplicarCorBarra(100);

  // ── 6. Eventos dos botões de jogo ─────────────────────────
  el.btnTrue    ?.addEventListener('click', () => responder(true));
  el.btnFalse   ?.addEventListener('click', () => responder(false));
  el.btnAnterior?.addEventListener('click', irAnterior);
  el.btnProxima ?.addEventListener('click', irProxima);

  // Botão "Revisar erros"
  const erradas = questoesComErro(banco, historico);
  if (erradas.length > 0 && el.btnRevisarErros) {
    atualizarBtnRevisarErros(erradas, () => iniciarJogo(true));
  }

  // Pausa
  setupPausa({
    getTimer:       () => estado.timer,
    isPausado:      () => estado.pausado,
    setPausado:     v  => { estado.pausado = v; },
    isQuestaoAtual: () => estado.respostas[estado.indice] === undefined,
    onVoltarIntro:  _aoVoltarIntro,
  });

  // Atalhos
  registrarAtalhos({
    isPausado:          () => estado.pausado,
    isQuestaoSemResposta: () => estado.respostas[estado.indice] === undefined,
    onResponder: responder,
    onProxima:   irProxima,
    onAnterior:  irAnterior,
  });

  // Botão Voltar do header
  document.getElementById('shell-back-btn')?.addEventListener('click', () => {
    salvarSessao('intro');
    nav.sairParaRota();
  });

  // Botão "Começar"
  el.btnStart?.addEventListener('click', () => {
    limparSessao();
    $('btn-continuar')?.classList.add('hidden');
    iniciarJogo(false);
  });

  // ── 7. Restauração de sessão / intro ──────────────────────
  const sessaoRestauravel = nav.pegarRestauravel();

  if (sessaoRestauravel) {
    // Reload com sessão válida → restaura direto na questão
    continuarSessao(sessaoRestauravel);
    nav.pronto();
  } else {
    // Navegação nova → intro
    const sessaoSalva = nav.lerSessao();
    if (sessaoSalva?.perguntas?.length > 0) {
      configurarBtnContinuar(sessaoSalva, continuarSessao);
    }
    mostrarTela('intro', false);
    nav.pronto();
  }
}

/* ══════════════════════════════════════════════════════════
   HELPERS INTERNOS DE INIT
══════════════════════════════════════════════════════════ */

function _preencherHeaderDisciplina(disc, sem, disciplina) {
  const shellDiscEl = document.getElementById('shell-disc-name');
  if (shellDiscEl && disciplina) shellDiscEl.textContent = disciplina.apelido ?? disciplina.nome ?? disc;

  const discLblPill = $('vf-disc-label');
  if (discLblPill && disciplina) {
    discLblPill.textContent = `${disciplina.emoji ?? ''} ${disciplina.apelido ?? disciplina.nome ?? disc}`.trim();
  }

  const discPill = $('vf-disc-tag-pill');
  if (discPill) { const svg = discPill.querySelector('svg'); if (svg) svg.remove(); }

  const introDiscName = $('intro-disc-name');
  const introSemLabel = $('intro-sem-label');
  if (introDiscName) introDiscName.textContent = disciplina?.apelido ?? disciplina?.nome ?? disc ?? '—';
  if (introSemLabel) introSemLabel.textContent = sem || '—';

  const introDiscChip = document.querySelector('.vf-intro-card__chip--disc');
  if (introDiscChip) {
    const chipSvg = introDiscChip.querySelector('svg');
    if (chipSvg && disciplina?.emoji) {
      const emojiSpan = document.createElement('span');
      emojiSpan.textContent = disciplina.emoji;
      emojiSpan.style.cssText = 'font-size:13px; line-height:1; display:inline-flex; align-items:center;';
      chipSvg.replaceWith(emojiSpan);
    }
  }
}

function _configurarTelaVazia(disc, sem, semDisp) {
  const btnBack = $('btn-empty-back');
  if (btnBack) btnBack.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;

  const emptyTitle = $('empty-title');
  const emptyDesc  = $('empty-desc');

  if (!semDisp || Object.keys(semDisp).length === 0) {
    if (emptyTitle) emptyTitle.textContent = 'Indisponível neste semestre';
    if (emptyDesc)  emptyDesc.innerHTML =
      `O jogo <strong>Verdadeiro ou Falso</strong> ainda não está disponível para o semestre <strong>${sem || '—'}</strong>.<br>
       Selecione outro semestre ou aguarde novas adições!`;
  } else {
    if (emptyTitle) emptyTitle.textContent = 'Sem perguntas';
    if (emptyDesc)  emptyDesc.innerHTML =
      'Não encontramos questões para esta disciplina ainda.<br>Tente outra ou aguarde novas adições!';
  }
}

/* ══════════════════════════════════════════════════════════
   BOOTSTRAP
══════════════════════════════════════════════════════════ */

// type="module" é sempre defer — verificação de segurança
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}