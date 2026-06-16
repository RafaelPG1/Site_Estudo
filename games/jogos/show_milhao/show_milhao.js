/* ============================================================
   NEXUS STUDY — games/jogos/show_milhao/show_milhao.js  (v4.1)

   PATCH v4.1 — Integração IA (games + resumo)
   ─────────────────────────────────────────────
   Registra window.__NEXUS_GAMES_CTX__ com o banco de questões
   após o carregamento, permitindo que NexusGamesAssistant
   intercepte perguntas do chat sobre o conteúdo do jogo.

   Alterações em relação à v4.0:
     • _registrarContextoIA(banco, disc, disciplina) — novo helper
     • init(): chama _registrarContextoIA após carregar o banco
     • _aoSair() e _aoRejogo(): limpam o ctx ao sair definitivamente
   ============================================================ */

import { Shell, Timer, shuffle }               from '../../template/game-shell.js';
import { calcularPeso, sorteiarPonderado }     from '../../template/deck.js';
import { DISC_CORES }                          from '../../../shared/js/themes/cores.js';
import { aplicarCoresDisciplina }             from '../../../shared/js/themes/theme.js';
import { getUsuario, getDisciplinasDeSemestre } from '../../../src/global.js';
import { SessionNav }                          from '../../template/session-nav.js';

import {
  salvarResultadoSM,
  carregarHistoricoSM,
  salvarPontuacaoSM,
  melhorPontuacaoLocalSM,
  acumuladoLocalSM,
  smLog, smWarn, smError,
} from './storage_sm.js';

import {
  uiInit,
  uiMostrarTela,
  uiRenderizarQuestao,
  uiRenderizarResultado,
  uiMostrarTelaRevisaoConcluida,
  uiConstruirListaPremios,
  uiAtualizarPremios,
  uiAtualizarContadores,
  uiAtualizarTimerUI,
  uiAplicarCorBarra,
  uiConfigurarBtnContinuar,
  uiAtualizarBtnRevisarErros,
  uiSetupPausa,
  uiRegistrarAtalhos,
  uiMostrarTelaVazia,
  uiRenderDots,
} from './show_milhao.ui.js';

/* ══════════════════════════════════════════════════════════
   INTEGRAÇÃO IA — carregamento dinâmico dos scripts
   (mesmo padrão de jogo.js/_carregarIA)
══════════════════════════════════════════════════════════ */

function _loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s   = document.createElement('script');
    s.src     = src;
    s.onload  = resolve;
    s.onerror = () => reject(new Error(`[SM IA] Falha ao carregar: ${src}`));
    document.body.appendChild(s);
  });
}

function _carregarIA() {
  // Resolve raiz do projeto a partir da URL do módulo atual.
  // show_milhao.js está em: games/jogos/show_milhao/show_milhao.js
  // Precisamos subir 3 níveis para chegar à raiz.
  const raiz = new URL('../../../', import.meta.url).href.replace(/\/$/, '');
  const BASE = raiz + '/shared/js/ia/';

  const deps = [
    BASE + 'core/text-utils.js',
    BASE + 'core/loader.js',
    BASE + 'core/worker.js',
    BASE + 'core/ui.js',
    BASE + 'resumo/search.js',
  ];

  Promise.all(deps.map(_loadScript))
    .then(() => _loadScript(BASE + 'resumo/assistant.js'))
    .then(() => _loadScript(BASE + 'games/assistant.js'))
    .then(() => _loadScript(BASE + 'init.js'))
    .catch(err => console.warn('[SM IA]', err.message));
}

_carregarIA();

/* ══════════════════════════════════════════════════════════
   CONFIGURAÇÃO
══════════════════════════════════════════════════════════ */

export const CONFIG = Object.freeze({
  TEMPO_POR_QUESTAO:  30,
  MAX_QUESTOES:       10,
  PESO_NUNCA_VISTO:    3,
  PESO_MIN:            1,
  PESO_MAX:           10,
  SESSAO_TTL_MS:      24 * 60 * 60 * 1000,
  SESSAO_THROTTLE_MS: 500,
});

export const PREMIOS = [
  { valor: 'R$ 1.000',     marco: false },
  { valor: 'R$ 5.000',     marco: false },
  { valor: 'R$ 10.000',    marco: false },
  { valor: 'R$ 30.000',    marco: true  },
  { valor: 'R$ 50.000',    marco: false },
  { valor: 'R$ 100.000',   marco: false },
  { valor: 'R$ 150.000',   marco: false },
  { valor: 'R$ 300.000',   marco: true  },
  { valor: 'R$ 500.000',   marco: false },
  { valor: 'R$ 1.000.000', marco: false },
];

/* ══════════════════════════════════════════════════════════
   ESTADO — fonte única de verdade
══════════════════════════════════════════════════════════ */

export const estado = {
  perguntas:      [],
  banco:          [],
  indice:         0,
  acertos:        0,
  respostas:      [],   // undefined | null | 'A'|'B'|'C'|'D'
  tempos:         [],
  timer:          null,
  _fallback:      null,
  pausado:        false,
  usuario:        null,
  discId:         null,
  sem:            null,
  historicoSM:    {},
  modoRevisao:    false,
  cardsRevisao:   null,
  tempoInicio:    null,
  temErro:        false,
  indicePendente: null,
  premioPendente: null,
  _nav:           null,
};

/* ══════════════════════════════════════════════════════════
   INTEGRAÇÃO IA — games/assistant.js
══════════════════════════════════════════════════════════ */

/**
 * Registra o contexto do jogo para o NexusGamesAssistant.
 *
 * Chamado após o banco ser carregado com sucesso.
 * O campo `banco` expõe as questões diretamente no ctx, permitindo
 * que games/assistant.js monte o contexto textual sem depender do
 * NexusGamesSearch (o Show do Milhão usa import dinâmico próprio).
 *
 * @param {Array}  banco      — array de questões carregado
 * @param {string} disc       — id da disciplina (ex: 'banco_de_dados')
 * @param {object} disciplina — objeto completo da disciplina (para nome legível)
 */
function _registrarContextoIA(banco, disc, disciplina) {
  window.__NEXUS_GAMES_CTX__ = {
    jogo:     'show_milhao',
    discId:   disc,
    nomeJogo: 'Show do Milhão',
    banco:    banco,
  };

  smLog('Contexto IA registrado: show_milhao / disc=' + disc + ' / banco=' + banco.length + 'q');

  // Aguarda NexusGamesAssistant (carregado dinamicamente por _carregarIA).
  // Limite de 60 tentativas × 100 ms = até 6 s para os scripts carregarem.
  var tentativas = 0;
  var intervalo  = setInterval(function () {
    tentativas++;
    if (typeof window.NexusGamesAssistant !== 'undefined') {
      clearInterval(intervalo);
      window.NexusGamesAssistant.notificarEntradaNoJogo(disc);
      smLog('NexusGamesAssistant pronto — disciplina "' + disc + '" notificada.');
    } else if (tentativas >= 60) {
      clearInterval(intervalo);
      smWarn('NexusGamesAssistant não encontrado após 6 s — integração IA não ativada.');
    }
  }, 100);
}

/**
 * Limpa o contexto de jogo da IA.
 * Chamado ao sair definitivamente do jogo (não em pausas).
 */
function _limparContextoIA() {
  if (typeof window.NexusGamesAssistant !== 'undefined') {
    window.NexusGamesAssistant.purgar();
  } else {
    try { delete window.__NEXUS_GAMES_CTX__; } catch (_) {}
  }
}

/* ══════════════════════════════════════════════════════════
   HELPERS DE SESSÃO (delegam ao SessionNav)
══════════════════════════════════════════════════════════ */

function _snapshotEstado(tela = 'question') {
  return {
    perguntas:      estado.perguntas,
    respostas:      estado.respostas,
    tempos:         estado.tempos,
    indice:         estado.indice,
    acertos:        estado.acertos,
    temErro:        estado.temErro,
    indicePendente: estado.indicePendente,
    premioPendente: estado.premioPendente,
    modoRevisao:    estado.modoRevisao,
    tempoInicio:    estado.tempoInicio,
    tela,
  };
}

export function salvarSessao(tela = 'question') {
  estado._nav?.salvar(_snapshotEstado(tela));
}

export function salvarSessaoThrottled() {
  estado._nav?.salvarThrottled(_snapshotEstado('question'));
}

export function limparSessao() {
  estado._nav?.limpar();
}

/* ══════════════════════════════════════════════════════════
   LÓGICA DO DECK
══════════════════════════════════════════════════════════ */

function montarDeck(banco, historico) {
  const n     = Math.min(CONFIG.MAX_QUESTOES, banco.length);
  const cands = banco.map(q => ({
    item: q,
    peso: calcularPeso(q.id, historico, {
      pesoNuncaVisto: CONFIG.PESO_NUNCA_VISTO,
      pesoMin:        CONFIG.PESO_MIN,
      pesoMax:        CONFIG.PESO_MAX,
    }),
  }));
  return shuffle(sorteiarPonderado(cands, n));
}

export function questoesComErro(banco, historico) {
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

/* ══════════════════════════════════════════════════════════
   TIMER
══════════════════════════════════════════════════════════ */

export function pararTimers() {
  try { estado.timer?.stop(); } catch (_) {}
  if (estado._fallback) { clearInterval(estado._fallback); estado._fallback = null; }
  estado.timer = null;
}

function criarTimer(totalInicial) {
  return Timer.criar({
    total: totalInicial ?? CONFIG.TEMPO_POR_QUESTAO,
    onTick: (restante) => {
      estado.tempos[estado.indice] = restante;
      uiAtualizarTimerUI(restante, CONFIG.TEMPO_POR_QUESTAO);
      salvarSessaoThrottled();
    },
    onEnd: () => {
      if (estado.respostas[estado.indice] === undefined) {
        estado.tempos[estado.indice] = 0;
        smLog(`Q${estado.indice + 1}: TIMEOUT — resposta nula registrada.`);
        registrarResposta(null);
      }
    },
  });
}

function _iniciarTimerQuestao() {
  pararTimers();
  const tempoRestante = estado.tempos[estado.indice] ?? CONFIG.TEMPO_POR_QUESTAO;
  uiAtualizarTimerUI(tempoRestante, CONFIG.TEMPO_POR_QUESTAO);

  try {
    estado.timer = criarTimer(tempoRestante);
    estado.timer.start();
  } catch (_) {
    let t = tempoRestante;
    estado._fallback = setInterval(() => {
      t--;
      estado.tempos[estado.indice] = t;
      uiAtualizarTimerUI(t, CONFIG.TEMPO_POR_QUESTAO);
      salvarSessaoThrottled();
      if (t <= 0) {
        clearInterval(estado._fallback);
        estado._fallback = null;
        if (estado.respostas[estado.indice] === undefined) registrarResposta(null);
      }
    }, 1000);
  }
}

/* ══════════════════════════════════════════════════════════
   FLUXO PRINCIPAL — iniciarJogo
══════════════════════════════════════════════════════════ */

function iniciarJogo(modoRevisao = false) {
  estado.modoRevisao = modoRevisao;

  if (modoRevisao) {
    if (!estado.cardsRevisao || estado.cardsRevisao.length === 0) {
      estado.cardsRevisao = questoesComErro(estado.banco, estado.historicoSM);
    }
    estado.perguntas = shuffle(estado.cardsRevisao.slice(0, CONFIG.MAX_QUESTOES));
  } else {
    estado.cardsRevisao = null;
    estado.perguntas    = montarDeck(estado.banco, estado.historicoSM);
  }

  estado.indice         = 0;
  estado.acertos        = 0;
  estado.tempoInicio    = Date.now();
  estado.respostas      = new Array(estado.perguntas.length);
  estado.tempos         = new Array(estado.perguntas.length).fill(CONFIG.TEMPO_POR_QUESTAO);
  estado.temErro        = false;
  estado.indicePendente = null;
  estado.premioPendente = null;
  estado.pausado        = false;

  smLog(`${modoRevisao ? 'Revisão' : 'Nova partida'} iniciada. Deck: ${estado.perguntas.length} questões.`);

  uiAtualizarContadores(estado.perguntas.length);
  uiConstruirListaPremios(PREMIOS);
  uiMostrarTela('question', modoRevisao, estado.perguntas.length);
  _renderizarQuestaoAtual();
}

/* ══════════════════════════════════════════════════════════
   RENDERIZAR QUESTÃO — orquestração
══════════════════════════════════════════════════════════ */

function _renderizarQuestaoAtual() {
  const pergunta    = estado.perguntas[estado.indice];
  const resp        = estado.respostas[estado.indice];
  const jaRespondeu = resp !== undefined;

  smLog(
    `Renderizando Q${estado.indice + 1}/${estado.perguntas.length}`,
    `| resp: ${resp ?? 'pendente'}`,
    `| acertos: ${estado.acertos}`,
    `| modoRevisao: ${estado.modoRevisao}`,
  );

  const correto     = jaRespondeu && resp === pergunta.correta;
  const histDados   = estado.historicoSM[pergunta.id] ?? null;
  const isUltima    = estado.indice >= estado.perguntas.length - 1;
  const todasResp   = estado.respostas.every(r => r !== undefined);
  const valorAtual  = estado.acertos > 0 ? PREMIOS[estado.acertos - 1]?.valor || 'R$ 0' : 'R$ 0';

  uiRenderizarQuestao({
    pergunta,
    resp,
    correto,
    jaRespondeu,
    isUltima,
    todasResp,
    histDados,
    num:        estado.indice + 1,
    total:      estado.perguntas.length,
    acertos:    estado.acertos,
    valorAtual,
    PREMIOS,
    respostas:  estado.respostas,
    perguntas:  estado.perguntas,
    indice:     estado.indice,
  });

  uiAtualizarPremios(PREMIOS, estado.acertos, estado.indicePendente, estado.temErro);
  uiRenderDots(estado.perguntas, estado.respostas, estado.indice, navegarPara);

  if (jaRespondeu) {
    pararTimers();
    uiAtualizarTimerUI(estado.tempos[estado.indice] ?? 0, CONFIG.TEMPO_POR_QUESTAO);
    uiAplicarCorBarra(0);
  } else {
    _iniciarTimerQuestao();
  }
}

/* ══════════════════════════════════════════════════════════
   RESPONDER
══════════════════════════════════════════════════════════ */

export function responder(letra) {
  if (estado.pausado) return;
  if (estado.respostas[estado.indice] !== undefined) return;

  pararTimers();
  smLog(`Q${estado.indice + 1}: usuário escolheu "${letra}".`);
  registrarResposta(letra);
}

function registrarResposta(resp) {
  const pergunta = estado.perguntas[estado.indice];
  const correto  = resp !== null && resp === pergunta.correta;

  estado.respostas[estado.indice] = resp;

  if (resp === null) {
    smLog(`Q${estado.indice + 1}: TIMEOUT — neutro.`);
  } else if (correto) {
    if (estado.temErro) {
      smLog(`Q${estado.indice + 1}: ACERTO → resolve erro pendente.`);
      estado.temErro        = false;
      estado.indicePendente = null;
      estado.premioPendente = null;
    }
    estado.acertos++;
    smLog(`Q${estado.indice + 1}: ACERTO ✓ | acertos: ${estado.acertos} → ${PREMIOS[estado.acertos - 1]?.valor}`);
  } else {
    if (!estado.temErro) {
      estado.indicePendente = estado.indice;
      estado.premioPendente = estado.indice;
    }
    estado.temErro = true;
    smLog(`Q${estado.indice + 1}: ERRO ✗ | prêmio travado`);
  }

  if (resp !== null) {
    const entrada = estado.historicoSM[pergunta.id] ?? {
      tentativas: 0, acertos: 0, erros: 0, ultimaVez: 0, acertosConsecutivos: 0,
    };
    entrada.tentativas++;
    if (correto) {
      entrada.acertos++;
      entrada.acertosConsecutivos = (entrada.acertosConsecutivos ?? 0) + 1;
    } else {
      entrada.erros++;
      entrada.acertosConsecutivos = 0;
    }
    entrada.ultimaVez               = Date.now();
    estado.historicoSM[pergunta.id] = entrada;
  }

  salvarSessao();
  _renderizarQuestaoAtual();
}

/* ══════════════════════════════════════════════════════════
   NAVEGAÇÃO
══════════════════════════════════════════════════════════ */

export function navegarPara(i) {
  if (i < 0 || i >= estado.perguntas.length) return;
  pararTimers();
  smLog(`Navegando Q${estado.indice + 1} → Q${i + 1}`);
  estado.indice = i;
  salvarSessao();
  _renderizarQuestaoAtual();
}

function irAnterior() {
  if (estado.indice > 0) navegarPara(estado.indice - 1);
}

function irProxima() {
  const ultimo    = estado.indice === estado.perguntas.length - 1;
  const todasResp = estado.respostas.every(r => r !== undefined);

  if (ultimo && todasResp) { finalizarJogo(); return; }
  if (estado.indice < estado.perguntas.length - 1) { navegarPara(estado.indice + 1); return; }

  const primeiraPendente = estado.respostas.findIndex(r => r === undefined);
  if (primeiraPendente !== -1) navegarPara(primeiraPendente);
}

/* ══════════════════════════════════════════════════════════
   FINALIZAR
══════════════════════════════════════════════════════════ */

async function finalizarJogo() {
  pararTimers();
  limparSessao();
  estado._nav?.sairParaRota();

  smLog('Jogo finalizado. Salvando histórico...');

  const resultados = estado.perguntas.map((p, i) => ({
    id:      p.id ?? `q${i}`,
    resp:    estado.respostas[i],
    acertou: estado.respostas[i] === p.correta,
  })).filter(r => r.resp !== null && r.resp !== undefined);

  await salvarResultadoSM(estado.usuario, estado.discId, estado.sem, resultados);

  let dadosPontuacao = null;

  if (!estado.modoRevisao) {
    const totalSeg    = Math.round((Date.now() - (estado.tempoInicio ?? Date.now())) / 1000);
    const mm          = Math.floor(totalSeg / 60);
    const ss          = String(totalSeg % 60).padStart(2, '0');
    const respondidos = estado.respostas.filter(r => r !== null && r !== undefined).length;
    const pct         = respondidos > 0 ? Math.round((estado.acertos / respondidos) * 100) : 0;
    const valorStr    = estado.acertos > 0 ? PREMIOS[estado.acertos - 1].valor : 'R$ 0';
    const valorNum    = parseInt(valorStr.replace(/\D/g, ''), 10) || 0;

    dadosPontuacao = {
      valor: valorStr, valorNum, acertos: estado.acertos,
      erros: respondidos - estado.acertos, precisao: pct,
      tempo: `${mm}:${ss}`, data: Date.now(),
    };

    await salvarPontuacaoSM(estado.usuario, estado.discId, estado.sem, dadosPontuacao);
    smLog(`Pontuação registrada: ${valorStr} | ${estado.acertos} acertos | ${pct}%`);
  }

  const respondidas   = estado.respostas.filter(r => r !== null && r !== undefined).length;
  const pct           = respondidas > 0 ? Math.round((estado.acertos / respondidas) * 100) : 0;
  const valorFinal    = estado.acertos > 0 ? PREMIOS[estado.acertos - 1].valor : 'R$ 0';
  const totalSegFinal = Math.round((Date.now() - (estado.tempoInicio ?? Date.now())) / 1000);
  const melhor        = !estado.modoRevisao
    ? melhorPontuacaoLocalSM(estado.usuario, estado.discId, estado.sem)
    : null;
  const acumDados     = !estado.modoRevisao
    ? acumuladoLocalSM(estado.usuario, estado.discId, estado.sem)
    : null;

  uiRenderizarResultado({
    acertos:       estado.acertos,
    respondidas,
    pct,
    valorFinal,
    totalSeg:      totalSegFinal,
    modoRevisao:   estado.modoRevisao,
    todosCorretos: estado.acertos === estado.perguntas.length,
    melhor,
    acumDados,
    perguntas:     estado.perguntas,
    respostas:     estado.respostas,
    historicoSM:   estado.historicoSM,
    onSair:        _aoSair,
    onRejogo:      _aoRejogo,
    onRevisarErros: _iniciarRevisaoErros,
    erradas:       questoesComErro(estado.banco, estado.historicoSM),
  });

  uiMostrarTela('result', false, estado.perguntas.length);
}

/* ══════════════════════════════════════════════════════════
   CALLBACKS DE FLUXO
══════════════════════════════════════════════════════════ */

function _iniciarRevisaoErros(erradas) {
  estado.cardsRevisao = erradas;
  iniciarJogo(true);
}

async function _aoSair() {
  limparSessao();
  _limparContextoIA();   // ← limpa contexto IA ao sair definitivamente

  estado.modoRevisao  = false;
  estado.cardsRevisao = null;

  const historico = await carregarHistoricoSM(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
  estado.historicoSM = historico;
  estado.perguntas   = montarDeck(estado.banco, historico);

  uiAtualizarContadores(estado.perguntas.length);
  uiAtualizarBtnRevisarErros(
    questoesComErro(estado.banco, estado.historicoSM),
    _iniciarRevisaoErros,
  );
  uiMostrarTela('intro', false, estado.perguntas.length);
}

async function _aoRejogo() {
  const perguntasRound = [...estado.perguntas];
  const respostasRound = [...estado.respostas];
  const eraRevisao     = estado.modoRevisao;

  const historico = await carregarHistoricoSM(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
  estado.historicoSM = historico;

  if (eraRevisao) {
    const erradasAgora = perguntasRound.filter((q, idx) => {
      const resp = respostasRound[idx];
      return resp === null || resp !== q.correta;
    });

    if (erradasAgora.length === 0) {
      uiMostrarTelaRevisaoConcluida(_voltarParaIntro);
      return;
    }

    estado.cardsRevisao = erradasAgora;
    estado.perguntas    = shuffle(erradasAgora.slice(0, CONFIG.MAX_QUESTOES));
    uiAtualizarContadores(estado.perguntas.length);
    iniciarJogo(true);
    return;
  }

  estado.modoRevisao  = false;
  estado.cardsRevisao = null;
  estado.perguntas    = montarDeck(estado.banco, historico);

  if (estado.perguntas.length === 0) { uiMostrarTela('empty', false, 0); return; }

  uiAtualizarContadores(estado.perguntas.length);
  iniciarJogo(false);
}

async function _voltarParaIntro() {
  const historico = await carregarHistoricoSM(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
  estado.historicoSM  = historico;
  estado.modoRevisao  = false;
  estado.cardsRevisao = null;
  estado.perguntas    = montarDeck(estado.banco, historico);

  uiAtualizarContadores(estado.perguntas.length);
  uiAtualizarBtnRevisarErros(
    questoesComErro(estado.banco, estado.historicoSM),
    _iniciarRevisaoErros,
  );
  uiConfigurarBtnContinuar(null, null);
  uiMostrarTela('intro', false, estado.perguntas.length);
}

export async function aoVoltarIntroViaPausa() {
  pararTimers();
  estado.pausado = false;

  salvarSessao('intro');

  const historico = await carregarHistoricoSM(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
  estado.historicoSM = historico;

  uiAtualizarBtnRevisarErros(
    questoesComErro(estado.banco, estado.historicoSM),
    _iniciarRevisaoErros,
  );

  const sessaoSalva = estado._nav?.lerSessao();
  if (sessaoSalva?.perguntas?.length > 0) {
    uiConfigurarBtnContinuar(sessaoSalva, continuarSessao);
  } else {
    uiConfigurarBtnContinuar(null, null);
  }

  uiAtualizarContadores(estado.perguntas.length);
  uiAplicarCorBarra(100);
  uiMostrarTela('intro', false, estado.perguntas.length);
}

/* ══════════════════════════════════════════════════════════
   TOGGLE PAUSA
══════════════════════════════════════════════════════════ */

export function togglePausa() {
  if (estado.respostas[estado.indice] !== undefined) return;

  estado.pausado = !estado.pausado;
  if (estado.pausado) {
    try { estado.timer?.pause(); } catch (_) {}
    smLog('Jogo PAUSADO.');
  } else {
    try { estado.timer?.resume(); } catch (_) {}
    smLog('Jogo RETOMADO.');
  }
  return estado.pausado;
}

/* ══════════════════════════════════════════════════════════
   RESTAURAR SESSÃO (botão Continuar / F5)
══════════════════════════════════════════════════════════ */

function continuarSessao(sessao) {
  estado.perguntas      = sessao.perguntas;
  estado.respostas      = sessao.respostas;
  estado.indice         = sessao.indice         ?? 0;
  estado.acertos        = sessao.acertos        ?? 0;
  estado.modoRevisao    = sessao.modoRevisao    ?? false;
  estado.temErro        = sessao.temErro        ?? false;
  estado.indicePendente = sessao.indicePendente ?? null;
  estado.premioPendente = sessao.premioPendente ?? null;
  estado.tempoInicio    = Date.now();
  estado.pausado        = false;

  estado.tempos = sessao.tempos
    ? [...sessao.tempos]
    : new Array(sessao.perguntas.length).fill(CONFIG.TEMPO_POR_QUESTAO);

  uiAtualizarContadores(estado.perguntas.length);
  uiConstruirListaPremios(PREMIOS);
  uiMostrarTela('question', estado.modoRevisao, estado.perguntas.length);
  _renderizarQuestaoAtual();
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */

async function init() {
  smLog('Inicializando Show do Milhão v4.1...');

  uiInit({
    onResponder:  responder,
    onIrAnterior: irAnterior,
    onIrProxima:  irProxima,
  });

  const { disc, sem } = Shell.init({ icon: '🃏', nome: 'Show do Milhão' });

  document.getElementById('header-controls')?.classList.remove('game-header__controls--visible');

  const _listaDisciplinas = getDisciplinasDeSemestre(sem);
  const disciplina = _listaDisciplinas.find(d => d.id === disc || d.arquivo === disc) ?? null;

  try { aplicarCoresDisciplina(disc, DISC_CORES); } catch (_) {}

  const shellDiscEl = document.getElementById('shell-disc-name');
  if (shellDiscEl && disciplina) shellDiscEl.textContent = disciplina.apelido ?? disciplina.nome ?? disc;

  const introDiscName = document.getElementById('intro-disc-name');
  const introSemLabel = document.getElementById('intro-sem-label');
  if (introDiscName) introDiscName.textContent = disciplina?.apelido ?? disciplina?.nome ?? disc ?? '—';
  if (introSemLabel) introSemLabel.textContent = sem || '—';

  const introDiscChip = document.querySelector('.sm-chip--disc');
  if (introDiscChip && disciplina?.emoji) {
    const chipSvg = introDiscChip.querySelector('svg');
    if (chipSvg) {
      const emojiSpan = document.createElement('span');
      emojiSpan.textContent = disciplina.emoji;
      emojiSpan.style.cssText = 'font-size:13px;line-height:1;display:inline-flex;align-items:center;';
      chipSvg.replaceWith(emojiSpan);
    }
  }

  // ── Import dinâmico de dados ──
  const ano = sem ? sem.split('.')[0] : null;
  let banco   = [];
  let semDisp = null;

  if (ano) {
    try {
      const modulo = await import(`../../../content/games/show_milhao/${ano}/show_milhao_data.js`);
      semDisp = modulo.SHOW_MILHAO_DATA?.[sem] ?? null;
      banco   = semDisp?.[disc] ?? [];
    } catch (err) {
      smWarn(`Arquivo de dados não encontrado para o ano ${ano}:`, err.message);
    }
  }

  estado.banco = banco;
  smLog(`Banco carregado: ${banco.length} questão(ões) para ${disc}/${sem}`);

  if (banco.length === 0) {
    uiMostrarTelaVazia({ semDisp, sem, disc });
    return;
  }

  // ── Registra contexto para a IA ──
  // Feito antes de qualquer interação, para que o chat já esteja pronto
  // quando o usuário abrir o assistente.
  _registrarContextoIA(banco, disc, disciplina);

  // ── Usuário e SessionNav ──
  const usuarioObj = getUsuario();
  estado.usuario   = usuarioObj?.uid ?? 'visitante';
  estado.discId    = disc;
  estado.sem       = sem;

  const nav = SessionNav.criar({
    uid:        estado.usuario,
    discId:     disc,
    sem,
    ttlMs:      CONFIG.SESSAO_TTL_MS,
    throttleMs: CONFIG.SESSAO_THROTTLE_MS,
  });
  estado._nav = nav;

  // ── Histórico e deck inicial ──
  estado.historicoSM = await carregarHistoricoSM(estado.usuario, disc, sem).catch(() => ({}));
  estado.perguntas   = montarDeck(banco, estado.historicoSM);

  uiAtualizarContadores(estado.perguntas.length);
  uiAplicarCorBarra(100);

  // ── Setup UI de eventos ──
  uiSetupPausa({
    onTogglePausa:   togglePausa,
    onVoltarIntro:   aoVoltarIntroViaPausa,
    isPausado:       () => estado.pausado,
    isQuestaoAtiva:  () => estado.respostas[estado.indice] === undefined,
  });

  uiRegistrarAtalhos({
    onResponder:     responder,
    onIrProxima:     irProxima,
    onIrAnterior:    irAnterior,
    onTogglePausa:   togglePausa,
    isPausado:       () => estado.pausado,
    isQuestaoAtiva:  () => estado.respostas[estado.indice] === undefined,
    getIndice:       () => estado.indice,
    getRespostas:    () => estado.respostas,
  });

  // ── Botão Revisar Erros na intro ──
  const erradasInit = questoesComErro(banco, estado.historicoSM);
  if (erradasInit.length > 0) {
    uiAtualizarBtnRevisarErros(erradasInit, _iniciarRevisaoErros);
  }

  document.getElementById('btn-start')?.addEventListener('click', () => {
    limparSessao();
    uiConfigurarBtnContinuar(null, null);
    iniciarJogo(false);
  });

  document.getElementById('shell-back-btn')?.addEventListener('click', () => {
    salvarSessao('intro');
    nav.sairParaRota();
  });

  // ── Restauração de sessão / intro ──
  const sessaoRestauravel = nav.pegarRestauravel();

  if (sessaoRestauravel) {
    continuarSessao(sessaoRestauravel);
    nav.pronto();
  } else {
    const sessaoSalva = nav.lerSessao();
    if (sessaoSalva?.perguntas?.length > 0) {
      uiConfigurarBtnContinuar(sessaoSalva, continuarSessao);
    }
    uiMostrarTela('intro', false, estado.perguntas.length);
    nav.pronto();
  }

  smLog('Init concluído.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Esconde botões ao rolar no mobile
const _headerControls = document.getElementById('header-controls');

function _syncControls() {
  if (window.innerWidth > 600) return;
  const naTela = !document.getElementById('screen-question')?.classList.contains('hidden');
  const noTopo = window.scrollY <= 1;

  if (naTela && noTopo) {
    _headerControls?.style.setProperty('display', 'flex', 'important');
  } else {
    _headerControls?.style.setProperty('display', 'none', 'important');
  }
}

let _rafPending = false;
window.addEventListener('scroll', () => {
  if (window.innerWidth > 600) return;
  if (_rafPending) return;
  _rafPending = true;
  requestAnimationFrame(() => {
    _syncControls();
    _rafPending = false;
  });
}, { passive: true });

window.addEventListener('sm-tela-mudou', _syncControls);