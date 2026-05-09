/* ============================================================
   NEXUS STUDY — games/jogos/vdd_falso/vdd_falso.js  (v6.4)

   Novidades v6.4:
   - [FIX] Import dinâmico de VDD_FALSO_DATA por ano do semestre.
     O arquivo de dados é carregado de:
       content/game/vdd_falso/{ano}/vdd_falso_data.js
     onde {ano} é extraído do semestre (ex: '2026.2' → '2026').
     Isso permite ter um arquivo de dados por ano (2026, 2027…)
     sem precisar alterar o código do jogo.
   - [FIX] Todas as referências diretas a VDD_FALSO_DATA foram
     substituídas por estado.banco (cache carregado no init).

   Novidades v6.3:
   - [FEATURE] Badge de histórico por questão (vf-hist-badge).
   - [FEATURE] estado.historicoVF: cache do histórico em memória.
   ============================================================ */

import { Shell, Timer, Result, shuffle, lerParams } from '../../template/game-shell.js';
import { calcularPeso, sorteiarPonderado }          from '../../template/deck.js';
import { DISC_CORES }                               from '../../../shared/js/cores.js';
import { aplicarCoresDisciplina }                   from '../../../shared/js/theme.js';
import { carregarHistoricoVF, salvarResultadoVF }  from './storage_vf.js';
import { getUsuario, getDisciplinasDeSemestre }    from '../../../src/global.js';

/* ══════════════════════════════════════════════════════════
   CONFIGURAÇÃO
   ══════════════════════════════════════════════════════════ */

const CONFIG = {
  TEMPO_POR_QUESTAO: 30,
  PONTOS_ACERTO:     10,
  PONTOS_ERRO:        5,
  MAX_QUESTOES:       8,
  PESO_NUNCA_VISTA:   3,
  PESO_MIN:           1,
  PESO_MAX:          10,
};

/* ══════════════════════════════════════════════════════════
   SESSÃO PERSISTIDA (Continuar de onde parou)
   ══════════════════════════════════════════════════════════

   Chave: nexus_vf_sessao_{usuario}_{discId}_{sem}
   Estrutura:
   {
     perguntas:   [...],   // deck completo da rodada
     respostas:   [...],   // undefined = não respondida, true/false/null
     tempos:      [...],   // segundos restantes por questão
     indice:      N,
     pontos:      N,
     acertos:     N,
     erros:       N,
     modoRevisao: bool,
     timestamp:   ms,
   }
   A sessão é removida quando o jogo é finalizado ou o usuário
   clica em "Sair" / "Voltar ao início" conscientemente.
══════════════════════════════════════════════════════════ */

const SESSAO_TTL_MS = 24 * 60 * 60 * 1000; // 24 h

function _chaveSessao(usuario, discId, sem) {
  return `nexus_vf_sessao_${usuario}_${discId}_${sem}`;
}

function salvarSessao() {
  try {
    const chave = _chaveSessao(estado.usuario, estado.discId, estado.sem);
    // JSON.stringify converte undefined→null dentro de arrays, perdendo o sentido.
    // Usamos um objeto explícito por posição: { v: true/false/null } ou { v: '__p__' } = pendente.
    const respostasSerializadas = estado.respostas.map(r =>
      r === undefined ? { v: '__p__' } : { v: r }
    );
    const sessao = {
      perguntas:   estado.perguntas,
      respostas:   respostasSerializadas,   // array de { v: true|false|null|'__p__' }
      tempos:      [...estado.tempos],
      indice:      estado.indice,
      pontos:      estado.pontos,
      acertos:     estado.acertos,
      erros:       estado.erros,
      modoRevisao: estado.modoRevisao,
      timestamp:   Date.now(),
    };
    localStorage.setItem(chave, JSON.stringify(sessao));
  } catch (e) {
    console.warn('[vdd_falso] Erro ao salvar sessão:', e);
  }
}

function carregarSessaoSalva(usuario, discId, sem) {
  try {
    const chave = _chaveSessao(usuario, discId, sem);
    const raw   = localStorage.getItem(chave);
    if (!raw) return null;
    const sessao = JSON.parse(raw);
    // Expira após 24 h
    if (Date.now() - (sessao.timestamp ?? 0) > SESSAO_TTL_MS) {
      localStorage.removeItem(chave);
      return null;
    }
    // Reconstitui undefined a partir do sentinel '__p__' (pendente)
    sessao.respostas = sessao.respostas.map(r => {
      // formato novo: { v: true|false|null|'__p__' }
      if (r && typeof r === 'object' && 'v' in r) {
        return r.v === '__p__' ? undefined : r.v;
      }
      // compatibilidade com formato antigo (string '__undef__' ou valor direto)
      if (r === '__undef__' || r === null) return undefined;
      return r;
    });
    return sessao;
  } catch (e) {
    return null;
  }
}

function limparSessao() {
  try {
    const chave = _chaveSessao(estado.usuario, estado.discId, estado.sem);
    localStorage.removeItem(chave);
  } catch (e) { /* silencioso */ }
}

/* ══════════════════════════════════════════════════════════
   ESTADO
   ══════════════════════════════════════════════════════════ */

const estado = {
  perguntas:  [],
  banco:      [],   // ← cache do banco completo da disciplina (substitui VDD_FALSO_DATA global)
  indice:     0,
  pontos:     0,
  acertos:    0,
  erros:      0,
  // respostas[i] = true | false | null (null = tempo esgotado — neutro)
  // undefined = questão ainda não respondida
  respostas:  [],
  // tempos[i] = segundos restantes da questão i (persistido ao navegar)
  tempos:     [],
  timer:      null,
  pausado:    false,
  usuario:    null,
  discId:     null,
  sem:        null,
  // Cache do histórico de desempenho por questão
  historicoVF: {},
  // Modo revisão: joga apenas questões com erros no histórico
  modoRevisao: false,
  // Cache das questões com erro ao entrar no modo revisão
  cardsRevisao: null,
};

/* ══════════════════════════════════════════════════════════
   DOM
   ══════════════════════════════════════════════════════════ */

const $ = id => document.getElementById(id);
const el = {};

/* Texto padrão da info-strip */
const INFO_STRIP_DEFAULT = 'Após sua escolha, a resposta aparecerá automaticamente.';

/* Helper: atualiza a info-strip com explicação ou texto padrão */
function setInfoStrip(texto) {
  const strip     = $('vf-info-strip');
  const stripText = $('vf-info-strip-text');
  const stripIcon = strip ? strip.querySelector('svg') : null;

  if (!stripText) return;

  if (texto) {
    stripText.innerHTML = '<span class="vf-resposta-label">Resposta:</span> ' + texto;
    if (stripIcon) stripIcon.style.display = 'none';
    strip?.classList.add('vf-info-strip--explicacao');
  } else {
    stripText.textContent = INFO_STRIP_DEFAULT;
    if (stripIcon) stripIcon.style.display = '';
    strip?.classList.remove('vf-info-strip--explicacao');
  }
}

function questoesComErro(banco, historico) {
  return banco
    .filter(q => {
      const h = historico[q.id];
      // Igual ao flashcard: tem erro E não tem nenhum acerto consecutivo
      // (acertosConsecutivos > 0 significa que a última resposta foi correta)
      return h && h.erros > 0 && (h.acertosConsecutivos ?? 0) === 0;
    })
    .sort((a, b) => {
      const taxaA = historico[a.id].erros / historico[a.id].tentativas;
      const taxaB = historico[b.id].erros / historico[b.id].tentativas;
      return taxaB - taxaA;
    });
}

function montarDeck(banco, historico) {
  const n = Math.min(CONFIG.MAX_QUESTOES, banco.length);
  const porAula = {};
  for (const q of banco) {
    const a = q.aula ?? 0;
    if (!porAula[a]) porAula[a] = [];
    porAula[a].push(q);
  }
  const sel = new Set();
  for (const aula of Object.keys(porAula)) {
    if (sel.size >= n) break;
    const cands = porAula[aula].filter(q => !sel.has(q.id)).map(q => ({ item: q, peso: calcularPeso(q.id, historico, { pesoNuncaVisto: CONFIG.PESO_NUNCA_VISTA, pesoMin: CONFIG.PESO_MIN, pesoMax: CONFIG.PESO_MAX }) }));
    const esc = sorteiarPonderado(cands, 1);
    if (esc[0]) sel.add(esc[0].id);
  }
  const rest = banco.filter(q => !sel.has(q.id)).map(q => ({ item: q, peso: calcularPeso(q.id, historico, { pesoNuncaVisto: CONFIG.PESO_NUNCA_VISTA, pesoMin: CONFIG.PESO_MIN, pesoMax: CONFIG.PESO_MAX }) }));
  sorteiarPonderado(rest, n - sel.size).forEach(q => sel.add(q.id));
  return shuffle(banco.filter(q => sel.has(q.id)));
}

/* ══════════════════════════════════════════════════════════
   BARRA DE TIMER
   ══════════════════════════════════════════════════════════ */

function aplicarCorBarra(pct) {
  const bar = el.timerBar;
  if (!bar) return;
  bar.classList.remove('game-timer-bar--green', 'game-timer-bar--mid', 'game-timer-bar--danger');
  if      (pct <= 34) bar.classList.add('game-timer-bar--danger');
  else if (pct <= 67) bar.classList.add('game-timer-bar--mid');
  else                bar.classList.add('game-timer-bar--green');
}

/* ══════════════════════════════════════════════════════════
   BOLINHAS DE PROGRESSO (clicáveis)
   ══════════════════════════════════════════════════════════ */

function renderDots() {
  const container = $('vf-dots');
  if (!container) return;
  container.innerHTML = '';
  estado.perguntas.forEach((p, i) => {
    const resp       = estado.respostas[i];
    const respondida = resp !== undefined;
    const correto    = respondida && resp === p.resposta;
    const atual      = i === estado.indice;

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Questão ${i + 1}`);
    dot.className = 'vf-dot ' + (
      atual       ? 'vf-dot--current'  :
      !respondida ? 'vf-dot--pending'  :
      correto     ? 'vf-dot--correct'  : 'vf-dot--wrong'
    );
    dot.addEventListener('click', () => navegarPara(i));
    container.appendChild(dot);
  });
}

/* ══════════════════════════════════════════════════════════
   TELAS
   ══════════════════════════════════════════════════════════ */

function mostrarTela(nome) {
  // Sempre esconde o loader ao exibir qualquer tela
  const screenLoading = document.getElementById('screen-loading');
  screenLoading?.classList.add('hidden');

  el.screenIntro   ?.classList.add('hidden');
  el.screenQuestion?.classList.add('hidden');
  el.screenEmpty   ?.classList.add('hidden');
  el.screenResult  ?.classList.add('hidden');
  if (nome === 'intro')    el.screenIntro   ?.classList.remove('hidden');
  if (nome === 'question') el.screenQuestion?.classList.remove('hidden');
  if (nome === 'empty')    el.screenEmpty   ?.classList.remove('hidden');
  if (nome === 'result')   el.screenResult  ?.classList.remove('hidden');

  // Aplica/remove tema vermelho de revisão no body e no screen-question
  const emRevisao = !!estado.modoRevisao;
  document.body.classList.toggle('modo-revisao', emRevisao);
  el.screenQuestion?.dataset && (el.screenQuestion.dataset.revisao = emRevisao ? 'true' : 'false');

  // ── Banner de revisão: injeta/remove dentro de .vf-main-area ──
  const mainArea = el.screenQuestion?.querySelector('.vf-main-area');
  if (mainArea) {
    // Remove banner anterior (se existir)
    mainArea.querySelector('.vf-revisao-banner')?.remove();
    if (emRevisao && nome === 'question') {
      const total = estado.perguntas?.length ?? 0;
      const banner = document.createElement('div');
      banner.className = 'vf-revisao-banner';
      banner.setAttribute('role', 'alert');
      banner.setAttribute('aria-label', 'Modo revisão de erros ativo');
      banner.innerHTML = `
        <i class="fas fa-triangle-exclamation vf-revisao-banner__icon" aria-hidden="true"></i>
        <span class="vf-revisao-banner__label">Revisão de erros</span>
        <span class="vf-revisao-banner__count">${total} questão${total !== 1 ? 'ões' : ''}</span>
      `;
      mainArea.insertBefore(banner, mainArea.firstChild);
    }
  }
}

/* ══════════════════════════════════════════════════════════
   FLUXO
   ══════════════════════════════════════════════════════════ */

function iniciarJogo(modoRevisao = false) {
  estado.modoRevisao = modoRevisao;

  // No modo revisão, remonta o deck só com questões com erros.
  // Se cardsRevisao já foi definido pelo caller (botão "Repetir revisão"),
  // respeita o conjunto — não recomputa para não perder o contexto da sessão.
  if (modoRevisao) {
    if (!estado.cardsRevisao || estado.cardsRevisao.length === 0) {
      const erradas = questoesComErro(estado.banco, estado.historicoVF);
      estado.cardsRevisao = erradas;
      estado.perguntas = shuffle(erradas.slice(0, CONFIG.MAX_QUESTOES));
    }
    // se cardsRevisao já foi preenchido pelo caller, estado.perguntas já foi definido lá
  } else {
    // [FIX] Modo normal: limpa qualquer resquício de sessão de revisão anterior
    // e remonta o deck com seleção ponderada normal.
    // Sem isso, se o usuário tinha entrado no modo revisão antes, estado.perguntas
    // poderia conter apenas as questões erradas da revisão ao clicar em "Começar".
    estado.cardsRevisao = null;
    estado.perguntas = montarDeck(estado.banco, estado.historicoVF);
  }

  estado.indice    = 0;
  estado.pontos    = 0;
  estado.acertos   = 0;
  estado.erros     = 0;
  estado.tempoInicio = Date.now();
  estado.respostas = new Array(estado.perguntas.length); // tudo undefined
  // Cada questão começa com o tempo total disponível
  estado.tempos    = new Array(estado.perguntas.length).fill(CONFIG.TEMPO_POR_QUESTAO);
  estado.pausado   = false;
  if (el.scoreCorrect) el.scoreCorrect.textContent = 0;
  atualizarContadores();
  mostrarTela('question');
  renderizarQuestao();
}

function criarTimer(totalInicial) {
  return Timer.criar({
    // O Timer conta regressivamente a partir do tempo restante real da questão.
    total: totalInicial ?? CONFIG.TEMPO_POR_QUESTAO,
    onTick: (restante) => {
      // Persiste o tempo restante a cada tick para que, ao navegar,
      // o valor salvo seja sempre o mais recente possível.
      estado.tempos[estado.indice] = restante;

      // Persiste sessão a cada 5 s (não a cada tick para evitar thrashing)
      if (restante % 5 === 0) salvarSessao();

      // A barra SEMPRE deve refletir restante / tempo_total_fixo (30s).
      const pctReal = (restante / CONFIG.TEMPO_POR_QUESTAO) * 100;
      document.documentElement.style.setProperty('--timer-pct', pctReal + '%');
      aplicarCorBarra(pctReal);
    },
    onEnd:  () => {
      if (estado.respostas[estado.indice] === undefined) {
        estado.tempos[estado.indice] = 0;
        registrarResposta(null);
      }
    },
  });
}

/* ══════════════════════════════════════════════════════════
   BADGE DE HISTÓRICO POR QUESTÃO
   ══════════════════════════════════════════════════════════ */

function renderizarBadgeHistorico(questaoId) {
  const badge    = $('vf-hist-badge');
  const elTent   = $('vf-hist-tentativas');
  const elTaxa   = $('vf-hist-taxa');
  const elStatus = $('vf-hist-status');

  if (!badge) return;

  const h = estado.historicoVF[questaoId];

  // Sem histórico ainda → oculta o badge completamente
  if (!h || h.tentativas === 0) {
    badge.hidden = true;
    badge.className = 'vf-hist-badge';
    return;
  }

  const { tentativas, acertos, erros } = h;
  const taxa = Math.round((acertos / tentativas) * 100);

  let statusMod  = '';
  let statusText = '';

  const maisErrosQueAcertos = erros > acertos;

  if (maisErrosQueAcertos || (tentativas >= 3 && taxa < 50)) {
    statusMod  = 'vf-hist-badge--critico';
    statusText = 'crítico';
  } else if (tentativas >= 3 && taxa >= 80) {
    statusMod  = 'vf-hist-badge--dominado';
    statusText = 'dominado';
  } else if (taxa >= 50) {
    statusMod  = 'vf-hist-badge--ok';
    statusText = 'ok';
  }

  if (elTent)   elTent.textContent   = tentativas;
  if (elTaxa)   elTaxa.textContent   = `${taxa}%`;
  if (elStatus) elStatus.textContent = statusText;

  badge.className = `vf-hist-badge${statusMod ? ' ' + statusMod : ''}`;
  void badge.offsetWidth;
  badge.hidden = false;
}

/* ══════════════════════════════════════════════════════════
   RENDERIZAR QUESTÃO ATUAL
   ══════════════════════════════════════════════════════════ */

function renderizarQuestao() {
  const pergunta    = estado.perguntas[estado.indice];
  const resp        = estado.respostas[estado.indice];
  const jaRespondeu = resp !== undefined;
  const correto     = jaRespondeu && resp === pergunta.resposta;
  const num         = estado.indice + 1;

  renderizarBadgeHistorico(pergunta.id);

  // Texto
  if (el.qCurrent)     el.qCurrent.textContent    = num;
  if (el.qBadge)       el.qBadge.textContent       = `Q${num}`;
  if (el.questionText) el.questionText.textContent = pergunta.enunciado;

  // Barra linear
  if (el.progressFill) el.progressFill.style.width = (num / estado.perguntas.length * 100) + '%';

  // Card
  if (el.questionCard) {
    el.questionCard.className = 'vf-question-card game-card-base';
    void el.questionCard.offsetWidth;
    el.questionCard.classList.add('vf-question-card--enter');
    if (jaRespondeu) el.questionCard.classList.add(correto ? 'vf-question-card--correct' : 'vf-question-card--wrong');
  }

  // Botões V/F
  if (el.btnTrue)  { el.btnTrue.className  = 'vf-btn vf-btn--true';  el.btnTrue.disabled  = jaRespondeu; }
  if (el.btnFalse) { el.btnFalse.className = 'vf-btn vf-btn--false'; el.btnFalse.disabled = jaRespondeu; }

  if (jaRespondeu) {
    // Mostra qual foi marcada (se não foi tempo esgotado)
    if (resp !== null) {
      const btnSel = resp ? el.btnTrue : el.btnFalse;
      btnSel?.classList.add(correto ? 'vf-btn--selected-correct' : 'vf-btn--selected-wrong');
    }
    // Se errou ou tempo esgotado, mostra qual seria a correta
    if (!correto) {
      const btnCerto = pergunta.resposta ? el.btnTrue : el.btnFalse;
      btnCerto?.classList.add('vf-btn--reveal-correct');
    }

    // Feedback
    if (el.feedbackMsg) {
      if (resp === null) {
        el.feedbackMsg.className   = 'game-feedback game-feedback--wrong';
        el.feedbackMsg.textContent = '⏱ Tempo esgotado! Sem pontos.';
      } else {
        el.feedbackMsg.className   = `game-feedback ${correto ? 'game-feedback--correct' : 'game-feedback--wrong'}`;
        el.feedbackMsg.textContent = correto
          ? `✓ Correto! +${CONFIG.PONTOS_ACERTO} pontos`
          : `✗ Incorreto! -${CONFIG.PONTOS_ERRO} pontos`;
      }
    }
    el.feedbackArea?.classList.remove('hidden');

    // ── EXPLICAÇÃO → info-strip ──
    setInfoStrip(pergunta.explicacao ?? '');

    // Shake se errou ou tempo esgotado
    if (!correto && el.questionCard) {
      void el.questionCard.offsetWidth;
      el.questionCard.classList.add('vf-question-card--shake');
    }
  } else {
    el.feedbackArea?.classList.add('hidden');
    setInfoStrip(null);
  }

  // Navegação
  atualizarBotoesNav();
  renderDots();

  // Timer
  if (estado.timer) {
    estado.timer.stop();
    estado.timer = null;
  }

  if (!jaRespondeu) {
    const tempoRestante = estado.tempos[estado.indice] ?? CONFIG.TEMPO_POR_QUESTAO;
    const pctInicial    = (tempoRestante / CONFIG.TEMPO_POR_QUESTAO) * 100;

    estado.timer = criarTimer(tempoRestante);
    estado.timer.start();
    aplicarCorBarra(pctInicial);
    document.documentElement.style.setProperty('--timer-pct', pctInicial + '%');
  }
}

function atualizarBotoesNav() {
  const total       = estado.perguntas.length;
  const ultimo      = estado.indice === total - 1;
  const jaRespondeu = estado.respostas[estado.indice] !== undefined;
  const todasResp   = estado.respostas.every(r => r !== undefined);

  if (el.btnAnterior) {
    el.btnAnterior.disabled = estado.indice === 0;
  }

  if (el.btnProxima) {
    const isFinish = ultimo && todasResp;
    el.btnProxima.disabled = !jaRespondeu;
    el.btnProxima.classList.toggle('vf-nav-btn--finish', isFinish);
    el.btnProxima.innerHTML = isFinish
      ? 'Finalizar <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M2 8l4 4 8-8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : 'Próxima <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M6 3l6 5-6 5V3z"/></svg>';
  }
}

/* ══════════════════════════════════════════════════════════
   RESPONDER
   ══════════════════════════════════════════════════════════ */

function responder(valor) {
  if (estado.pausado) return;
  if (estado.respostas[estado.indice] !== undefined) return;
  estado.timer?.stop();
  registrarResposta(valor);
}

function registrarResposta(resp) {
  const pergunta = estado.perguntas[estado.indice];
  const correto  = resp === pergunta.resposta;

  estado.respostas[estado.indice] = resp;

  // resp === null (tempo esgotado) é neutro —
  // não conta como acerto nem como erro, não altera pontuação.
  if (resp !== null) {
    if (correto) {
      estado.pontos  += CONFIG.PONTOS_ACERTO;
      estado.acertos += 1;
    } else {
      estado.pontos   = Math.max(0, estado.pontos - CONFIG.PONTOS_ERRO);
      estado.erros   += 1;
    }

    // Salva esta questão no histórico imediatamente (sem esperar finalizar),
    // para que erros/acertos já apareçam no "Revisar erros" mesmo ao sair.
    const resultado = [{ id: pergunta.id, resp, acertou: correto }];
    salvarResultadoVF(estado.usuario, estado.discId, estado.sem, resultado)
      .then(() => {
        // Atualiza o cache em memória igual ao finalizarJogo
        const entrada = estado.historicoVF[pergunta.id] ?? {
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
        entrada.ultimaVez = Date.now();
        estado.historicoVF[pergunta.id] = entrada;
      })
      .catch(err => console.warn('[vdd_falso] Erro ao salvar resposta:', err));
  }

  if (el.scoreCorrect) el.scoreCorrect.textContent = estado.acertos;

  renderizarQuestao();
  salvarSessao(); // persiste sessão após cada resposta
}

/* ══════════════════════════════════════════════════════════
   NAVEGAÇÃO
   ══════════════════════════════════════════════════════════ */

function navegarPara(i) {
  if (i < 0 || i >= estado.perguntas.length) return;
  estado.indice = i;
  renderizarQuestao();
  salvarSessao(); // persiste ao navegar (tempo restante atualizado)
}

function irAnterior() {
  if (estado.indice > 0) {
    estado.timer?.stop();
    navegarPara(estado.indice - 1);
  }
}

function irProxima() {
  const ultimo    = estado.indice === estado.perguntas.length - 1;
  const todasResp = estado.respostas.every(r => r !== undefined);

  if (ultimo && todasResp) {
    finalizarJogo();
    return;
  }

  if (estado.indice < estado.perguntas.length - 1) {
    navegarPara(estado.indice + 1);
    return;
  }

  // Está na última questão mas existem pendentes anteriores
  const primeiraPendente = estado.respostas.findIndex(r => r === undefined);
  if (primeiraPendente !== -1) {
    navegarPara(primeiraPendente);
  }
}

/* ══════════════════════════════════════════════════════════
   FINALIZAR
   ══════════════════════════════════════════════════════════ */

async function finalizarJogo() {
  estado.timer?.stop();
  limparSessao(); // rodada concluída — não precisa mais do ponto de retorno

  // O histórico já foi salvo questão a questão em registrarResposta().
  // Aqui não salvamos de novo para evitar duplicar tentativas/acertos/erros.
  // O cache estado.historicoVF também já está atualizado em memória.

  // Apenas garante que timeouts (resp === null) também não são contados
  // (registrarResposta já os ignora, mas confirmamos aqui por segurança).
  const resultados = estado.perguntas
    .map((p, i) => ({
      id:      p.id,
      resp:    estado.respostas[i],
      acertou: estado.respostas[i] === p.resposta,
    }))
    .filter(r => r.resp !== null && r.resp !== undefined);

  const respondidas = estado.respostas.filter(r => r !== null && r !== undefined).length;
  const pct         = respondidas > 0
    ? Math.round((estado.acertos / respondidas) * 100)
    : 0;

  let emoji, titulo;
  if      (pct >= 80) { emoji = '🏆'; titulo = 'Excelente!';     }
  else if (pct >= 50) { emoji = '👍'; titulo = 'Bom trabalho!';  }
  else                { emoji = '📚'; titulo = 'Pode melhorar!'; }

  const elSimb     = document.getElementById('resultado-simbolo');
  const elTitulo   = document.getElementById('resultado-titulo');
  const elPontos   = document.getElementById('resultado-pontos');
  const elAcertos  = document.getElementById('resultado-acertos');
  const elErros    = document.getElementById('resultado-erros');
  const elPrecisao = document.getElementById('resultado-precisao');
  const elTempo    = document.getElementById('resultado-tempo');
  const elSair     = document.getElementById('resultado-btn-sair');
  const elRejogo   = document.getElementById('resultado-btn-rejogo');

  // ── Badge e estilo de revisão na tela de resultado ──
  const resultadoNucleo = document.querySelector('.resultado-nucleo');
  if (resultadoNucleo) {
    // Remove badge anterior
    resultadoNucleo.querySelector('.vf-finish-revisao-badge')?.remove();
    if (estado.modoRevisao) {
      const badge = document.createElement('div');
      badge.className = 'vf-finish-revisao-badge';
      badge.innerHTML = `<i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Revisão de erros`;
      resultadoNucleo.insertBefore(badge, resultadoNucleo.firstChild);
    }
  }

  // Aplica classe ao botão "Jogar novamente" em modo revisão
  if (elRejogo && estado.modoRevisao) {
    elRejogo.classList.add('resultado-btn--repetir-revisao');
  }

  if (elSimb)    elSimb.textContent    = emoji;
  if (elTitulo)  elTitulo.textContent  = titulo;
  if (elPontos)  elPontos.textContent  = estado.pontos;
  if (elAcertos) elAcertos.textContent = estado.acertos;
  if (elErros)   elErros.textContent   = estado.erros;
  if (elPrecisao) elPrecisao.textContent = pct + '%';

  if (elTempo) {
    const totalSeg = Math.round((Date.now() - (estado.tempoInicio ?? Date.now())) / 1000);
    const mm = Math.floor(totalSeg / 60);
    const ss = String(totalSeg % 60).padStart(2, '0');
    elTempo.textContent = `${mm}:${ss}`;
  }

  // Botão Sair → volta para a tela de intro (sem navegar para outra página)
  if (elSair) {
    elSair.removeAttribute('href');
    elSair.style.cursor = 'pointer';
    const novoSair = elSair.cloneNode(true);
    elSair.parentNode.replaceChild(novoSair, elSair);
    novoSair.addEventListener('click', async (e) => {
      e.preventDefault();
      limparSessao(); // usuário voltou ao início conscientemente
      // Oculta o botão Continuar — sessão foi descartada
      document.getElementById('btn-continuar')?.classList.add('hidden');
      // Garante que qualquer rastro de sessão de revisão seja apagado
      // antes de voltar à intro — o usuário vai clicar "Começar" (modo normal).
      estado.modoRevisao  = false;
      estado.cardsRevisao = null;
      // Usa historicoVF ja em memoria (atualizado apos salvar),
      // monta novo deck e atualiza o botao "Revisar erros"
      estado.perguntas = montarDeck(estado.banco, estado.historicoVF);

      atualizarBtnRevisarErros(estado.banco, estado.historicoVF);
      atualizarContadores();
      mostrarTela('intro');
    });
  }

  // Botão jogar novamente — comportamento diferente em modo revisão
  if (elRejogo) {
    const novoRejogo = elRejogo.cloneNode(true);
    elRejogo.parentNode.replaceChild(novoRejogo, elRejogo);

    // Atualiza label do botão em modo revisão com contagem de pendentes
    if (estado.modoRevisao) {
      novoRejogo.textContent = '';
      const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      iconSvg.setAttribute('viewBox', '0 0 16 16');
      iconSvg.setAttribute('fill', 'none');
      iconSvg.setAttribute('stroke', 'currentColor');
      iconSvg.setAttribute('stroke-width', '1.6');
      iconSvg.setAttribute('width', '16');
      iconSvg.setAttribute('height', '16');
      iconSvg.innerHTML = '<path d="M13.5 2.5v3.5h-3.5"/><path d="M13.3 6A6 6 0 1 0 12 12"/>';
      novoRejogo.appendChild(iconSvg);
      novoRejogo.appendChild(document.createTextNode(' Repetir revisão'));
    }

    novoRejogo.addEventListener('click', async () => {
      // Captura o estado da rodada ANTES do await para não perder os dados ao recarregar histórico
      const perguntasRound = [...estado.perguntas];
      const respostasRound = [...estado.respostas];
      // Modo normal: zera qualquer rastro de revisão ANTES de capturar eraRevisao,
      // evitando que uma sessão de revisão anterior contamine esta rodada.
      // eraRevisao captura o valor correto do modo que acabou de terminar.
      const eraRevisao     = estado.modoRevisao;

      const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
      estado.historicoVF = historico;

      if (eraRevisao) {
        // Filtra só as questões que foram erradas OU tempo esgotado nesta rodada específica.
        const erradasAgora = perguntasRound.filter((q, idx) => {
          const resp = respostasRound[idx];
          // Errou (resp existe mas é diferente da resposta correta) ou tempo esgotado (null)
          return resp === null || resp !== q.resposta;
        });

        if (erradasAgora.length === 0) {
          // Acertou tudo nesta rodada — mostra tela de parabéns
          mostrarTelaRevisaoConcluida();
          return;
        }

        estado.cardsRevisao = erradasAgora;
        estado.perguntas = shuffle(erradasAgora.slice(0, CONFIG.MAX_QUESTOES));
        atualizarContadores();
        iniciarJogo(true);
        return;
      }

      // Modo normal: garante limpeza total de qualquer rastro de revisão
      estado.modoRevisao  = false;
      estado.cardsRevisao = null;
      estado.perguntas = montarDeck(estado.banco, historico);
      if (estado.perguntas.length === 0) {
        mostrarTela('empty');
        return;
      }
      atualizarContadores();
      iniciarJogo();
    });
  }

  mostrarTela('result');

  // Usa o historicoVF ja atualizado em memoria (nao recarrega do Firestore
  // para evitar latencia e dados desatualizados).
  renderEstatisticasQuestoes(estado.historicoVF, estado.perguntas, estado.modoRevisao);

  // Atualiza botao "Revisar erros" com base no historico em memoria
  atualizarBtnRevisarErros(estado.banco, estado.historicoVF);
}

/* ══════════════════════════════════════════════════════════
   TELA DE REVISÃO CONCLUÍDA
   ══════════════════════════════════════════════════════════ */

function mostrarTelaRevisaoConcluida() {
  const resultCard = document.querySelector('.resultado-nucleo');
  if (!resultCard) { mostrarTela('intro'); return; }

  resultCard.innerHTML = `
    <div class="vf-finish-revisao-badge">
      <i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Revisão de erros
    </div>
    <div class="resultado-topo">
      <div class="resultado-simbolo">🏆</div>
      <h2 class="resultado-titulo">Revisão concluída!</h2>
    </div>
    <div class="resultado-divisor">
      <span class="resultado-divisor__linha"></span>
      <span class="resultado-divisor__ponto"></span>
      <span class="resultado-divisor__linha"></span>
    </div>
    <p class="vf-revisao-concluida-msg">
      Você superou todos os erros desta sessão de revisão! 🎉
    </p>
    <div class="resultado-acoes">
      <button class="resultado-btn resultado-btn--primario" id="revisao-concluida-voltar">
        Voltar ao início
        <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
          <path d="M5 3l8 5-8 5V3z"/>
        </svg>
      </button>
    </div>
  `;

  mostrarTela('result');

  document.getElementById('revisao-concluida-voltar')?.addEventListener('click', async () => {
    const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
    estado.historicoVF  = historico;
    estado.modoRevisao  = false;
    estado.cardsRevisao = null;
    estado.perguntas    = montarDeck(estado.banco, historico);
    atualizarContadores();
    atualizarBtnRevisarErros(estado.banco, historico);
    mostrarTela('intro');
  });
}

/* ══════════════════════════════════════════════════════════
   ESTATÍSTICAS POR QUESTÃO
   ══════════════════════════════════════════════════════════ */

function renderEstatisticasQuestoes(historico, perguntas, modoRevisao = false) {
  const resultCard = document.querySelector('.game-result__card') ?? document.querySelector('.resultado-nucleo');
  if (!resultCard) return;
  resultCard.querySelector('.vf-stats-questoes')?.remove();
  const temDados = perguntas.some(q => historico[q.id]);
  if (!temDados) return;

  const painel = document.createElement('details');
  painel.className = 'vf-stats-questoes';
  painel.open = true;
  painel.innerHTML = `<summary><span class="vf-sq-summary-icon">📊</span>Progresso por questão<span class="vf-sq-chevron">▾</span></summary>`;

  const lista = document.createElement('div');
  lista.className = 'vf-sq-lista';

  for (const q of perguntas) {
    const h    = historico[q.id];
    const resp = estado.respostas[estado.perguntas.indexOf(q)];
    const acertouAgora = resp !== null && resp !== undefined && resp === q.resposta;
    const errouAgora   = resp !== null && resp !== undefined && resp !== q.resposta;

    const enun = q.enunciado.length > 52 ? q.enunciado.slice(0, 52) + '…' : q.enunciado;

    let rowHtml;
    if (modoRevisao) {
      // Modo revisão: só mostra resultado desta rodada, sem histórico acumulado
      const icone   = acertouAgora ? '✓' : errouAgora ? '✗' : '–';
      const iconCor = acertouAgora ? '#34d399' : errouAgora ? '#f87171' : '#94a3b8';
      const barCls  = acertouAgora ? 'vf-prog-bar--ok' : 'vf-prog-bar--critico';
      const barPct  = acertouAgora ? 100 : 0;
      const label   = acertouAgora ? 'Acertou' : errouAgora ? 'Errou' : '–';
      rowHtml = `
        <div class="vf-sq-meta">
          <span class="vf-sq-icone" style="color:${iconCor}">${icone}</span>
          <span class="vf-sq-enun">${enun}</span>
          ${acertouAgora ? '<span class="vf-sq-superada" title="Acertou nesta rodada">⭐</span>' : ''}
        </div>
        <div class="vf-sq-prog-row">
          <div class="vf-sq-bar-bg"><div class="vf-sq-bar-fill ${barCls}" style="width:${barPct}%"></div></div>
          <span class="vf-sq-stat" style="color:${iconCor}">${label}</span>
        </div>`;
    } else {
      // Modo normal: histórico acumulado
      const acertos    = h ? h.acertos    : 0;
      const tentativas = h ? h.tentativas : 0;
      const taxa       = tentativas > 0 ? Math.round((acertos / tentativas) * 100) : 0;
      const barPct = Math.min(taxa, 100);
      const barCls = taxa >= 70 ? 'vf-prog-bar--ok' : taxa >= 40 ? 'vf-prog-bar--medio' : 'vf-prog-bar--critico';
      const cor    = taxa >= 70 ? '#34d399' : taxa >= 40 ? '#facc15' : '#f87171';
      const icone  = acertouAgora ? '✓' : errouAgora ? '✗' : (taxa >= 70 ? '✓' : taxa >= 40 ? '~' : '✗');
      const iconCor= acertouAgora ? '#34d399' : errouAgora ? '#f87171' : cor;
      rowHtml = `
        <div class="vf-sq-meta">
          <span class="vf-sq-icone" style="color:${iconCor}">${icone}</span>
          <span class="vf-sq-enun">${enun}</span>
        </div>
        <div class="vf-sq-prog-row">
          <div class="vf-sq-bar-bg" title="${acertos}/${tentativas} acertos acumulados (${taxa}%)">
            <div class="vf-sq-bar-fill ${barCls}" style="width:${barPct}%"></div>
          </div>
          <span class="vf-sq-stat" style="color:${cor}">${tentativas > 0 ? acertos+'/'+tentativas : '—'}</span>
        </div>`;
    }

    const row = document.createElement('div');
    row.className = 'vf-sq-row vf-sq-row--prog';
    row.innerHTML = rowHtml;
    lista.appendChild(row);
  }
  painel.appendChild(lista);
  resultCard.appendChild(painel);
}

/* ══════════════════════════════════════════════════════════
   PAUSA
   ══════════════════════════════════════════════════════════ */

function setupPausa() {
  const btnPause       = $('btn-pause');
  const btnVoltarIntro = $('btn-voltar-intro');

  const pauseOverlay = document.createElement('div');
  pauseOverlay.id        = 'pause-overlay';
  pauseOverlay.className = 'vf-pause-overlay hidden';
  pauseOverlay.innerHTML = `
  <div class="vf-pause-card">
    <div class="vf-pause-header">
      <div class="vf-pause-icon-ring">
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
          <rect x="5" y="3" width="4" height="18" rx="2"/>
          <rect x="15" y="3" width="4" height="18" rx="2"/>
        </svg>
      </div>
      <div>
        <p class="vf-pause-title">Jogo pausado</p>
        <p class="vf-pause-hint">O tempo está congelado</p>
      </div>
    </div>
    <div class="vf-pause-divider"></div>
    <div class="vf-pause-tip">
      <span class="vf-pause-tip__icon">💡</span>
      <span>Use o tempo para revisar sua estratégia antes de continuar.</span>
    </div>
    <button class="game-btn vf-pause-resume-btn" id="btn-retomar">
      <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><path d="M5 3l8 5-8 5V3z"/></svg>
      Retomar jogo
    </button>
    <p class="vf-pause-shortcut">ou pressione <kbd>Espaço</kbd></p>
  </div>`;
  document.body.appendChild(pauseOverlay);

  function togglePausa() {
    if (el.screenQuestion?.classList.contains('hidden')) return;
    if (estado.respostas[estado.indice] !== undefined) return;

    estado.pausado = !estado.pausado;
    const btnPauseEl   = $('btn-pause');
    const pauseIconEl  = $('pause-icon');
    const pauseLabelEl = $('pause-label');

    if (estado.pausado) {
      estado.timer?.pause();
      pauseOverlay.classList.remove('hidden');
      btnPauseEl?.classList.add('vf-ctrl-btn--paused');
      if (pauseIconEl) { pauseIconEl.innerHTML = `<path d="M14 8l40 24L14 56V8z"/>`; pauseIconEl.setAttribute('viewBox', '0 0 64 64'); }
      if (pauseLabelEl) pauseLabelEl.textContent = 'Retomar';
    } else {
      estado.timer?.resume();
      pauseOverlay.classList.add('hidden');
      btnPauseEl?.classList.remove('vf-ctrl-btn--paused');
      if (pauseIconEl) { pauseIconEl.innerHTML = `<rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/>`; pauseIconEl.setAttribute('viewBox', '0 0 16 16'); }
      if (pauseLabelEl) pauseLabelEl.textContent = 'Pausar';
    }
  }

  btnPause?.addEventListener('click', togglePausa);
  pauseOverlay.addEventListener('click', e => { if (e.target.closest('#btn-retomar')) togglePausa(); });

  // Botão "Voltar ao início" — SALVA a sessão para permitir "Continuar" depois
  btnVoltarIntro?.addEventListener('click', async () => {
    // Para o timer e persiste o tempo restante atual
    estado.timer?.stop();
    estado.timer   = null;
    estado.pausado = false;

    // Salva a sessão ANTES de qualquer limpeza de UI
    salvarSessao();

    // Lê a sessão recém-salva para configurar o botão Continuar
    const sessaoParaContinuar = carregarSessaoSalva(estado.usuario, estado.discId, estado.sem);

    // Restaura UI de pausa/pause button
    pauseOverlay.classList.add('hidden');
    const btnPauseEl   = $('btn-pause');
    const pauseIconEl  = $('pause-icon');
    const pauseLabelEl = $('pause-label');
    btnPauseEl?.classList.remove('vf-ctrl-btn--paused');
    if (pauseIconEl) { pauseIconEl.innerHTML = `<rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/>`; pauseIconEl.setAttribute('viewBox', '0 0 16 16'); }
    if (pauseLabelEl) pauseLabelEl.textContent = 'Pausar';

    document.documentElement.style.setProperty('--timer-pct', '100%');
    aplicarCorBarra(100);

    const timerDisplay = document.getElementById('shell-timer-display');
    if (timerDisplay) {
      const t  = CONFIG.TEMPO_POR_QUESTAO;
      const mm = String(Math.floor(t / 60)).padStart(2, '0');
      const ss = String(t % 60).padStart(2, '0');
      timerDisplay.textContent = `${mm}:${ss}`;
      timerDisplay.classList.remove('game-timer-display--danger', 'game-timer-display--mid');
    }

    // Reseta estado de revisão para a próxima sessão normal
    estado.modoRevisao  = false;
    estado.cardsRevisao = null;
    estado.tempos       = [];

    const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
    estado.historicoVF = historico;
    estado.perguntas   = montarDeck(estado.banco, historico);

    // Atualiza botão "Revisar erros" com histórico mais recente
    atualizarBtnRevisarErros(estado.banco, historico);

    // Mostra/atualiza botão Continuar se há sessão salva
    if (sessaoParaContinuar && sessaoParaContinuar.perguntas?.length > 0) {
      _configurarBtnContinuar(sessaoParaContinuar);
    }

    if (estado.perguntas.length === 0) {
      mostrarTela('empty');
      return;
    }
    atualizarContadores();
    mostrarTela('intro');
  });

  // Guard contra Space duplo quando #btn-retomar está focado
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !el.screenQuestion?.classList.contains('hidden') &&
        estado.respostas[estado.indice] === undefined) {
      if (document.activeElement?.id === 'btn-retomar') return;
      e.preventDefault();
      togglePausa();
    }
  });
}

/* ══════════════════════════════════════════════════════════
   ATALHOS
   ══════════════════════════════════════════════════════════ */

function registrarAtalhos() {
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (estado.pausado) return;
    if (!el.screenQuestion || el.screenQuestion.classList.contains('hidden')) return;

    const jaResp = estado.respostas[estado.indice] !== undefined;
    switch (e.key) {
      case 'v': case 'V': case '1': if (!jaResp) { e.preventDefault(); responder(true);  } break;
      case 'f': case 'F': case '2': if (!jaResp) { e.preventDefault(); responder(false); } break;
      case 'ArrowRight': case 'Enter': if (jaResp) { e.preventDefault(); irProxima(); } break;
      case 'ArrowLeft':
        e.preventDefault();
        estado.timer?.stop();
        irAnterior();
        break;
    }
  });
}

/* ══════════════════════════════════════════════════════════
   BOTÃO "REVISAR ERROS" — atualiza visibilidade e listener
   Centraliza toda a lógica do botão num único lugar para
   garantir que o listener nunca se perca entre navegações.
   ══════════════════════════════════════════════════════════ */

function atualizarBtnRevisarErros(banco, historico) {
  const btn = el.btnRevisarErros ?? $('btn-revisar-erros');
  if (!btn) return;

  const erradas = questoesComErro(banco, historico);

  if (erradas.length === 0) {
    btn.classList.add('hidden');
    return;
  }

  // Atualiza contador
  const countEl = btn.querySelector('#vf-revisar-count') ?? $('vf-revisar-count');
  if (countEl) countEl.textContent = erradas.length;

  // Recria o listener toda vez (clone elimina duplicatas acumuladas)
  const novo = btn.cloneNode(true);
  btn.parentNode.replaceChild(novo, btn);
  el.btnRevisarErros = novo; // atualiza referência no cache

  novo.classList.remove('hidden');
  novo.addEventListener('click', () => iniciarJogo(true));
}

function atualizarContadores() {
  const n = estado.perguntas.length;
  if (el.scoreTotal) el.scoreTotal.textContent = n;
  if (el.qTotal)     el.qTotal.textContent     = n;
  const introTotal = $('intro-total-questoes');
  if (introTotal)    introTotal.textContent    = n;
}

/* ══════════════════════════════════════════════════════════
   CONTINUAR SESSÃO SALVA
   ══════════════════════════════════════════════════════════ */

function _configurarBtnContinuar(sessao) {
  const btn = document.getElementById('btn-continuar');
  if (!btn) return;

  const respondidas = sessao.respostas.filter(r => r !== undefined).length;
  const total       = sessao.perguntas.length;

  // Clona para evitar listeners duplicados
  const novo = btn.cloneNode(true);
  btn.parentNode.replaceChild(novo, btn);
  novo.classList.remove('hidden');

  const countEl = document.getElementById('continuar-progress');
  if (countEl) countEl.textContent = `${respondidas}/${total}`;

  novo.addEventListener('click', () => continuarSessao(sessao));
}

function continuarSessao(sessao) {
  // Restaura estado completo da rodada salva
  estado.perguntas   = sessao.perguntas;
  estado.respostas   = sessao.respostas;
  estado.indice      = sessao.indice  ?? 0;
  estado.pontos      = sessao.pontos  ?? 0;
  estado.acertos     = sessao.acertos ?? 0;
  estado.erros       = sessao.erros   ?? 0;
  estado.modoRevisao = sessao.modoRevisao ?? false;
  estado.tempoInicio = Date.now();
  estado.pausado     = false;

  // Restaura os tempos salvos, mas reseta o timer da questão atual para o total
  // (o timer parou quando o usuário saiu — recomeça do zero para ser justo)
  const temposRestaurados = sessao.tempos
    ? [...sessao.tempos]
    : new Array(sessao.perguntas.length).fill(CONFIG.TEMPO_POR_QUESTAO);

  // Reseta o tempo da questão onde o usuário parou (se ainda não respondida)
  const indiceAtual = estado.indice;
  if (estado.respostas[indiceAtual] === undefined) {
    temposRestaurados[indiceAtual] = CONFIG.TEMPO_POR_QUESTAO;
  }
  estado.tempos = temposRestaurados;

  if (el.scoreCorrect) el.scoreCorrect.textContent = estado.acertos;
  atualizarContadores();
  mostrarTela('question');
  renderizarQuestao();
}

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */

async function init() {
  Object.assign(el, {
    screenIntro:    $('screen-intro'),
    screenQuestion: $('screen-question'),
    screenEmpty:    $('screen-empty'),
    screenResult:   $('screen-result'),
    btnStart:       $('btn-start'),
    btnRevisarErros:$('btn-revisar-erros'),
    btnTrue:        $('btn-true'),
    btnFalse:       $('btn-false'),
    btnAnterior:    $('btn-anterior'),
    btnProxima:     $('btn-proxima'),
    qCurrent:       $('q-current'),
    qTotal:         $('q-total'),
    qBadge:         $('q-badge'),
    questionText:   $('question-text'),
    questionCard:   $('question-card'),
    progressFill:   $('progress-fill'),
    feedbackArea:   $('feedback-area'),
    feedbackMsg:    $('feedback-msg'),
    feedbackExp:    null,
    scoreCorrect:   $('score-correct'),
    scoreTotal:     $('score-total'),
    timerBar:       document.querySelector('.game-timer-bar'),
  });

  const { disc, sem } = Shell.init({ icon: '⚖️', nome: 'Verdadeiro ou Falso' });

  const _listaDisciplinas = getDisciplinasDeSemestre(sem);
  const disciplina = _listaDisciplinas.find(d => d.id === disc || d.arquivo === disc) ?? null;

  // Preenche header
  const shellDiscEl = document.getElementById('shell-disc-name');
  if (shellDiscEl && disciplina) {
    shellDiscEl.textContent = disciplina.apelido ?? disciplina.nome ?? disc;
  }
  const shellIconEl = document.getElementById('shell-icon');
  if (shellIconEl && disciplina?.emoji) {
    shellIconEl.textContent = disciplina.emoji;
  }

  const discLblPill = document.getElementById('vf-disc-label');
  if (discLblPill && disciplina) {
    discLblPill.textContent = `${disciplina.emoji ?? ''} ${disciplina.apelido ?? disciplina.nome ?? disc}`.trim();
  }

  const discPill = document.getElementById('vf-disc-tag-pill');
  if (discPill) {
    const svg = discPill.querySelector('svg');
    if (svg) svg.remove();
  }

  const introDiscName = document.getElementById('intro-disc-name');
  const introSemLabel = document.getElementById('intro-sem-label');
  if (introDiscName) {
    introDiscName.textContent = disciplina?.apelido ?? disciplina?.nome ?? disc ?? '—';
  }
  if (introSemLabel) {
    introSemLabel.textContent = sem || '—';
  }

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

  /* ── IMPORT DINÂMICO por ano ──────────────────────────────
     sem = '2026.2' → ano = '2026'
     Carrega: content/game/vdd_falso/2026/vdd_falso_data.js
     Se o arquivo não existir → banco vazio → tela empty.
  ─────────────────────────────────────────────────────────── */
  const ano    = sem ? sem.split('.')[0] : null;
  let banco    = [];
  let semDisp  = null;

  if (ano) {
    try {
      const modulo = await import(`../../../content/game/vdd_falso/${ano}/vdd_falso_data.js`);
      semDisp = modulo.VDD_FALSO_DATA?.[sem] ?? null;
      banco   = semDisp?.[disc] ?? [];
    } catch (err) {
      console.warn(`[vdd_falso] Arquivo de dados não encontrado para o ano ${ano}:`, err.message);
    }
  }

  // Persiste o banco no estado para reutilização (rejogo, voltar ao início)
  estado.banco = banco;

  if (banco.length === 0) {
    mostrarTela('empty');
    const btnBack = $('btn-empty-back');
    if (btnBack) btnBack.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;

    const emptyTitle = document.getElementById('empty-title');
    const emptyDesc  = document.getElementById('empty-desc');
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
    return;
  }

  const usuarioObj   = getUsuario();
  estado.usuario     = usuarioObj?.uid ?? 'visitante';
  estado.discId      = disc;
  estado.sem         = sem;

  const historico    = await carregarHistoricoVF(estado.usuario, disc, sem).catch(() => ({}));
  estado.historicoVF = historico;
  estado.perguntas   = montarDeck(banco, historico);

  if (estado.perguntas.length === 0) {
    mostrarTela('empty');
    const btnBack = $('btn-empty-back');
    if (btnBack) btnBack.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;
    return;
  }

  atualizarContadores();
  aplicarCorBarra(100);

  el.btnTrue     ?.addEventListener('click', () => responder(true));
  el.btnFalse    ?.addEventListener('click', () => responder(false));
  el.btnAnterior ?.addEventListener('click', irAnterior);
  el.btnProxima  ?.addEventListener('click', irProxima);

  // Botão "Revisar erros": só aparece se houver questões com erros no histórico
  const erradas = questoesComErro(banco, historico);
  if (erradas.length > 0 && el.btnRevisarErros) {
    el.btnRevisarErros.classList.remove('hidden');
    const countEl = $('vf-revisar-count');
    if (countEl) countEl.textContent = erradas.length;
    el.btnRevisarErros.addEventListener('click', () => iniciarJogo(true));
  }

  setupPausa();
  registrarAtalhos();

  /* ── Botão Voltar do header: limpa sessão antes de navegar ── */
  const shellBackBtn = document.getElementById('shell-back-btn');
  if (shellBackBtn) {
    shellBackBtn.addEventListener('click', () => {
      limparSessao();
    });
  }

  /* ── Botão "Começar": inicia nova partida, descartando sessão salva ── */
  el.btnStart?.addEventListener('click', () => {
    limparSessao();
    document.getElementById('btn-continuar')?.classList.add('hidden');
    iniciarJogo(false);
  });

  /* ── SESSÃO SALVA: verifica se há uma rodada em andamento ── */
  const sessaoSalva = carregarSessaoSalva(estado.usuario, disc, sem);
  if (sessaoSalva && sessaoSalva.perguntas?.length > 0) {
    _configurarBtnContinuar(sessaoSalva);
  }

  mostrarTela('intro');
}

// type="module" é sempre defer — verifica readyState para segurança
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}