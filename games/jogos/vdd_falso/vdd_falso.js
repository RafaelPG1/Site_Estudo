/* ============================================================
   NEXUS STUDY — games/jogos/vdd_falso/vdd_falso.js  (v6)

   Fluxo v6:
   - Marcar V ou F → gabarito aparece imediatamente
   - Navegação ← Anterior / Próxima → entre questões
   - Pode revisar questões já respondidas (somente leitura)
   - Última questão + todas respondidas: botão "Finalizar"
   - Timer corre por questão; para ao responder
   - Bolinhas de progresso clicáveis por status

   Correções v6.1:
   - [BUG 1] Tempo esgotado (null) não conta mais como erro no
     contador de erros nem desconta pontos — tratado como neutro.
   - [BUG 2] irProxima() não travava mais na última questão quando
     nem todas estavam respondidas — agora avança para a próxima
     questão pendente, ou para a última se não houver pendente.
   - [BUG 3] Race condition em finalizarJogo(): salvarResultadoVF
     agora é aguardado com await antes de carregar o histórico para
     as estatísticas, garantindo que os dados da rodada atual
     estejam salvos antes de exibir.
   ============================================================ */

import { Shell, Timer, Result, shuffle, lerParams } from '../../template/game-shell.js';
import { VDD_FALSO_DATA }                           from '../../../content/game/vdd_falso/vdd_falso_data.js';
import { DISC_CORES }                               from '../../../shared/js/cores.js';
import { aplicarCoresDisciplina }                   from '../../../shared/js/theme.js';
import { carregarHistoricoVF, salvarResultadoVF }  from './storage_vf.js';
import { getUsuario }                              from '../../../src/global.js';

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
   ESTADO
   ══════════════════════════════════════════════════════════ */

const estado = {
  perguntas:  [],
  indice:     0,
  pontos:     0,
  acertos:    0,
  erros:      0,
  // respostas[i] = true | false | null (null = tempo esgotado — neutro)
  // undefined = questão ainda não respondida
  respostas:  [],
  timer:      null,
  pausado:    false,
  usuario:    null,
  discId:     null,
  sem:        null,
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

/* ══════════════════════════════════════════════════════════
   SELEÇÃO PONDERADA
   ══════════════════════════════════════════════════════════ */

function calcularPeso(id, historico) {
  const h = historico[id];
  if (!h || h.tentativas === 0) return CONFIG.PESO_NUNCA_VISTA;
  const taxaErro = h.erros / h.tentativas;
  return Math.round(CONFIG.PESO_MIN + taxaErro * (CONFIG.PESO_MAX - CONFIG.PESO_MIN));
}

function sorteiarPonderado(candidatos, n) {
  const pool = [...candidatos];
  const sel  = [];
  while (sel.length < n && pool.length > 0) {
    const total = pool.reduce((a, c) => a + c.peso, 0);
    if (total <= 0) { const i = Math.floor(Math.random() * pool.length); sel.push(pool[i].item); pool.splice(i, 1); continue; }
    let rand = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
      rand -= pool[i].peso;
      if (rand <= 0) { sel.push(pool[i].item); pool.splice(i, 1); break; }
    }
  }
  return sel;
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
    const cands = porAula[aula].filter(q => !sel.has(q.id)).map(q => ({ item: q, peso: calcularPeso(q.id, historico) }));
    const esc = sorteiarPonderado(cands, 1);
    if (esc[0]) sel.add(esc[0].id);
  }
  const rest = banco.filter(q => !sel.has(q.id)).map(q => ({ item: q, peso: calcularPeso(q.id, historico) }));
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
      atual      ? 'vf-dot--current'  :
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
  el.screenIntro   ?.classList.add('hidden');
  el.screenQuestion?.classList.add('hidden');
  el.screenEmpty   ?.classList.add('hidden');
  if (nome === 'intro')    el.screenIntro   ?.classList.remove('hidden');
  if (nome === 'question') el.screenQuestion?.classList.remove('hidden');
  if (nome === 'empty')    el.screenEmpty   ?.classList.remove('hidden');
}

/* ══════════════════════════════════════════════════════════
   FLUXO
   ══════════════════════════════════════════════════════════ */

function iniciarJogo() {
  estado.indice    = 0;
  estado.pontos    = 0;
  estado.acertos   = 0;
  estado.erros     = 0;
  estado.respostas = new Array(estado.perguntas.length); // tudo undefined
  estado.pausado   = false;
  if (el.scoreCorrect) el.scoreCorrect.textContent = 0;
  atualizarContadores();
  mostrarTela('question');
  renderizarQuestao();
}

function criarTimer() {
  return Timer.criar({
    total:  CONFIG.TEMPO_POR_QUESTAO,
    onTick: (_r, pct) => aplicarCorBarra(pct),
    onEnd:  () => {
      if (estado.respostas[estado.indice] === undefined) {
        registrarResposta(null);
      }
    },
  });
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
    // BUG 1 CORRIGIDO: tempo esgotado (null) exibe mensagem neutra, sem mencionar desconto de pontos
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
    // Reset da info-strip para texto padrão
    setInfoStrip(null);
  }

  // Navegação
  atualizarBotoesNav();
  renderDots();

  // Timer
  estado.timer?.stop();
  if (!jaRespondeu) {
    estado.timer = criarTimer();
    estado.timer.start();
    aplicarCorBarra(100);
  } else {
    // Mantém a barra congelada onde estava — não zera
  }
}

function atualizarBotoesNav() {
  const total         = estado.perguntas.length;
  const ultimo        = estado.indice === total - 1;
  const jaRespondeu   = estado.respostas[estado.indice] !== undefined;
  const todasResp     = estado.respostas.every(r => r !== undefined);

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

  // BUG 1 CORRIGIDO: resp === null (tempo esgotado) é neutro —
  // não conta como acerto nem como erro, não altera pontuação.
  if (resp !== null) {
    if (correto) {
      estado.pontos  += CONFIG.PONTOS_ACERTO;
      estado.acertos += 1;
    } else {
      estado.pontos   = Math.max(0, estado.pontos - CONFIG.PONTOS_ERRO);
      estado.erros   += 1;
    }
  }

  if (el.scoreCorrect) el.scoreCorrect.textContent = estado.acertos;

  renderizarQuestao();
}

/* ══════════════════════════════════════════════════════════
   NAVEGAÇÃO
   ══════════════════════════════════════════════════════════ */

function navegarPara(i) {
  if (i < 0 || i >= estado.perguntas.length) return;
  estado.indice = i;
  renderizarQuestao();
}

function irAnterior() {
  if (estado.indice > 0) navegarPara(estado.indice - 1);
}

// BUG 2 CORRIGIDO: quando está na última questão mas nem todas foram
// respondidas, avança para a primeira questão ainda pendente em vez
// de travar silenciosamente.
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

  // Está na última questão mas existem pendentes anteriores:
  // vai para a primeira questão sem resposta.
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

  const resultados = estado.perguntas.map((p, i) => ({
    id: p.id,
    acertou: estado.respostas[i] === p.resposta,
  }));

  // BUG 3 CORRIGIDO: aguarda o save antes de carregar o histórico,
  // evitando que as estatísticas sejam exibidas com dados desatualizados.
  try {
    await salvarResultadoVF(estado.usuario, estado.discId, estado.sem, resultados);
  } catch (err) {
    console.warn('[vdd_falso] Erro ao salvar:', err);
  }

  const total = estado.perguntas.length;
  const pct   = Math.round((estado.acertos / total) * 100);

  let emoji, titulo, subtitulo;
  if      (pct >= 80) { emoji = '🏆'; titulo = 'Excelente!';     subtitulo = 'Você domina este conteúdo. Continue assim!'; }
  else if (pct >= 50) { emoji = '👍'; titulo = 'Bom trabalho!';  subtitulo = 'Você está no caminho certo. Revise os erros e tente novamente.'; }
  else                { emoji = '📚'; titulo = 'Pode melhorar!'; subtitulo = 'Não desanime — revise o material e tente de novo!'; }

  Result.mostrar({
    emoji, titulo, subtitulo,
    stats: [
      { label: 'Pontos',   valor: estado.pontos  },
      { label: 'Acertos',  valor: estado.acertos },
      { label: 'Erros',    valor: estado.erros   },
      { label: 'Precisão', valor: pct + '%'      },
    ],
    onRejogo: async () => {
      const banco     = VDD_FALSO_DATA[estado.discId] ?? [];
      const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
      estado.perguntas = montarDeck(banco, historico);
      atualizarContadores();
      iniciarJogo();
    },
  });

  const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
  renderEstatisticasQuestoes(historico, estado.perguntas);
}

/* ══════════════════════════════════════════════════════════
   ESTATÍSTICAS POR QUESTÃO
   ══════════════════════════════════════════════════════════ */

function renderEstatisticasQuestoes(historico, perguntas) {
  const resultCard = document.querySelector('.game-result__card');
  if (!resultCard) return;
  resultCard.querySelector('.vf-stats-questoes')?.remove();
  const temDados = perguntas.some(q => historico[q.id]);
  if (!temDados) return;

  const painel = document.createElement('details');
  painel.className = 'vf-stats-questoes';
  painel.innerHTML = `<summary><span class="vf-sq-summary-icon">📊</span>Desempenho por questão<span class="vf-sq-chevron">▾</span></summary>`;

  const lista = document.createElement('div');
  lista.className = 'vf-sq-lista';
  for (const q of perguntas) {
    const h = historico[q.id];
    if (!h) continue;
    const taxa  = h.tentativas > 0 ? Math.round((h.acertos / h.tentativas) * 100) : 0;
    const cor   = taxa >= 70 ? '#34d399' : taxa >= 40 ? '#facc15' : '#f87171';
    const icone = taxa >= 70 ? '✓' : taxa >= 40 ? '~' : '✗';
    const enun  = q.enunciado.length > 58 ? q.enunciado.slice(0, 58) + '…' : q.enunciado;
    const row = document.createElement('div');
    row.className = 'vf-sq-row';
    const si = document.createElement('span'); si.className = 'vf-sq-icone'; si.style.color = cor; si.textContent = icone;
    const se = document.createElement('span'); se.className = 'vf-sq-enun'; se.textContent = enun;
    const ss = document.createElement('span'); ss.className = 'vf-sq-stat'; ss.style.color = cor; ss.textContent = `${h.acertos}/${h.tentativas}`;
    row.append(si, se, ss);
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

  btnVoltarIntro?.addEventListener('click', async () => {
    estado.timer?.stop();
    estado.timer = null; estado.pausado = false;
    pauseOverlay.classList.add('hidden');
    const btnPauseEl = $('btn-pause'); const pauseIconEl = $('pause-icon'); const pauseLabelEl = $('pause-label');
    btnPauseEl?.classList.remove('vf-ctrl-btn--paused');
    if (pauseIconEl) { pauseIconEl.innerHTML = `<rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/>`; pauseIconEl.setAttribute('viewBox', '0 0 16 16'); }
    if (pauseLabelEl) pauseLabelEl.textContent = 'Pausar';
    document.documentElement.style.setProperty('--timer-pct', '100%');
    aplicarCorBarra(100);
    const banco     = VDD_FALSO_DATA[estado.discId] ?? [];
    const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
    estado.perguntas = montarDeck(banco, historico);
    atualizarContadores();
    mostrarTela('intro');
  });

  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !el.screenQuestion?.classList.contains('hidden') &&
        estado.respostas[estado.indice] === undefined) {
      e.preventDefault(); togglePausa();
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
      case 'ArrowLeft': e.preventDefault(); irAnterior(); break;
    }
  });
}

/* ══════════════════════════════════════════════════════════
   CONTADORES
   ══════════════════════════════════════════════════════════ */

function atualizarContadores() {
  const n = estado.perguntas.length;
  if (el.scoreTotal) el.scoreTotal.textContent = n;
  if (el.qTotal)     el.qTotal.textContent     = n;
  const introTotal = $('intro-total-questoes');
  if (introTotal)    introTotal.textContent    = n;
}

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */

async function init() {
  Object.assign(el, {
    screenIntro:    $('screen-intro'),
    screenQuestion: $('screen-question'),
    screenEmpty:    $('screen-empty'),
    btnStart:       $('btn-start'),
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
    feedbackExp:    null, // não usado — explicação vai direto na info-strip
    scoreCorrect:   $('score-correct'),
    scoreTotal:     $('score-total'),
    timerBar:       document.querySelector('.game-timer-bar'),
  });

  const { disc, sem, disciplina } = Shell.init({ icon: '⚖️', nome: 'Verdadeiro ou Falso' });

  // Preenche o pill de disciplina no footer do card com emoji + nome
  const discLblPill = document.getElementById('vf-disc-label');
  if (discLblPill && disciplina) {
    discLblPill.textContent = `${disciplina.emoji ?? ''} ${disciplina.apelido ?? disciplina.nome ?? disc}`.trim();
  }

  // Remove o SVG genérico do pill (substituído pelo emoji da disciplina)
  const discPill = document.getElementById('vf-disc-tag-pill');
  if (discPill) {
    const svg = discPill.querySelector('svg');
    if (svg) svg.remove();
  }
  const banco = VDD_FALSO_DATA[disc] ?? [];

  if (banco.length === 0) {
    mostrarTela('empty');
    const btnBack = $('btn-empty-back');
    if (btnBack) btnBack.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;
    return;
  }

  const usuarioObj   = getUsuario();
  estado.usuario     = usuarioObj?.uid ?? 'visitante';
  estado.discId      = disc;
  estado.sem         = sem;

  const historico  = await carregarHistoricoVF(estado.usuario, disc, sem).catch(() => ({}));
  estado.perguntas = montarDeck(banco, historico);

  atualizarContadores();
  aplicarCorBarra(100);

  el.btnStart    ?.addEventListener('click', iniciarJogo);
  el.btnTrue     ?.addEventListener('click', () => responder(true));
  el.btnFalse    ?.addEventListener('click', () => responder(false));
  el.btnAnterior ?.addEventListener('click', irAnterior);
  el.btnProxima  ?.addEventListener('click', irProxima);

  setupPausa();
  registrarAtalhos();
  mostrarTela('intro');
}

document.addEventListener('DOMContentLoaded', init);