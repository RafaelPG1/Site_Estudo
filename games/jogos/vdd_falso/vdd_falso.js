/* ============================================================
   NEXUS STUDY — games/jogos/vdd_falso/vdd_falso.js  (v3)
   ============================================================ */

import { Shell, Timer, Result, shuffle, lerParams } from '../../template/game-shell.js';
import { VDD_FALSO_DATA }                           from '../../conteudo/vdd_falso/vdd_falso_data.js';
import { DISC_CORES }             from '../../../shared/js/cores.js';
import { aplicarCoresDisciplina } from '../../../shared/js/theme.js';

/* ══════════════════════════════════════════════════════════
   CONFIGURAÇÃO
   ══════════════════════════════════════════════════════════ */

const CONFIG = {
  TEMPO_POR_QUESTAO: 30,
  PONTOS_ACERTO:     10,
  PONTOS_ERRO:        5,
  MAX_QUESTOES:       8,
  DELAY_PROXIMA:   1500,
};

/* ══════════════════════════════════════════════════════════
   ESTADO
   ══════════════════════════════════════════════════════════ */

const estado = {
  perguntas:    [],
  indice:       0,
  pontos:       0,
  acertos:      0,
  erros:        0,
  respondido:   false,
  timer:        null,
  pausado:      false,
  barInterval:  null,   // intervalo próprio para cor da barra
  barInicio:    0,      // timestamp do início da questão
  barPausado:   0,      // tempo já decorrido ao pausar
};

/* ══════════════════════════════════════════════════════════
   ATALHOS DE DOM
   ══════════════════════════════════════════════════════════ */

const $ = id => document.getElementById(id);

const el = {
  screenIntro:    $('screen-intro'),
  screenQuestion: $('screen-question'),
  screenEmpty:    $('screen-empty'),

  btnStart:       $('btn-start'),
  btnTrue:        $('btn-true'),
  btnFalse:       $('btn-false'),

  qCurrent:       $('q-current'),
  qTotal:         $('q-total'),
  qBadge:         $('q-badge'),
  questionText:   $('question-text'),
  questionCard:   $('question-card'),
  progressFill:   $('progress-fill'),

  feedbackArea:   $('feedback-area'),
  feedbackMsg:    $('feedback-msg'),
  feedbackExp:    $('feedback-explicacao'),

  scoreCorrect:   $('score-correct'),
  scoreTotal:     $('score-total'),

  timerBar:       document.querySelector('.game-timer-bar'),
  timerBarFill:   document.querySelector('.game-timer-bar__fill'),
};

/* ══════════════════════════════════════════════════════════
   BARRA DE COR — lógica própria via setInterval
   ══════════════════════════════════════════════════════════ */

function atualizarCorBarra(pct) {
  const bar = el.timerBar;
  if (!bar) return;
  bar.classList.remove('game-timer-bar--green', 'game-timer-bar--mid', 'game-timer-bar--danger');
  if      (pct <= 0.34) bar.classList.add('game-timer-bar--danger'); // vermelho: últimos 34%
  else if (pct <= 0.67) bar.classList.add('game-timer-bar--mid');    // amarelo:  34–67%
  else                  bar.classList.add('game-timer-bar--green');  // verde:    acima de 67%
}

function iniciarBarraInterval() {
  pararBarraInterval();
  estado.barInicio = performance.now() - (estado.barPausado * 1000);

  estado.barInterval = setInterval(() => {
    const decorrido = (performance.now() - estado.barInicio) / 1000;
    const restante  = CONFIG.TEMPO_POR_QUESTAO - decorrido;
    const pct       = Math.max(0, restante / CONFIG.TEMPO_POR_QUESTAO);
    atualizarCorBarra(pct);
    if (restante <= 0) pararBarraInterval();
  }, 100);
}

function pararBarraInterval() {
  if (estado.barInterval) {
    clearInterval(estado.barInterval);
    estado.barInterval = null;
  }
}

function resetarBarra() {
  estado.barPausado = 0;
  atualizarCorBarra(1);
  // Reseta a largura via CSS var (que o Timer usa internamente)
  document.documentElement.style.setProperty('--timer-pct', '100%');
}
/* ══════════════════════════════════════════════════════════
   HELPERS DE TELA
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
   FLUXO DO JOGO
   ══════════════════════════════════════════════════════════ */

function iniciarJogo() {
  estado.indice     = 0;
  estado.pontos     = 0;
  estado.acertos    = 0;
  estado.erros      = 0;
  estado.respondido = false;
  estado.pausado    = false;

  if (el.scoreCorrect) el.scoreCorrect.textContent = 0;

  mostrarTela('question');
  carregarQuestao();
}

function carregarQuestao() {
  const pergunta = estado.perguntas[estado.indice];
  estado.respondido = false;

  const num = estado.indice + 1;
  if (el.qCurrent)     el.qCurrent.textContent    = num;
  if (el.qBadge)       el.qBadge.textContent       = `Q${num}`;
  if (el.questionText) el.questionText.textContent = pergunta.enunciado;

  // Barra de progresso de questões
  const pct = (estado.indice / estado.perguntas.length) * 100;
  if (el.progressFill) el.progressFill.style.width = pct + '%';

  // Limpa visual anterior
  if (el.questionCard) {
    el.questionCard.className = 'vf-question-card game-card-base';
    void el.questionCard.offsetWidth;
    el.questionCard.classList.add('vf-question-card--enter');
  }

  if (el.btnTrue)  { el.btnTrue.className  = 'vf-btn vf-btn--true';  el.btnTrue.disabled  = false; }
  if (el.btnFalse) { el.btnFalse.className = 'vf-btn vf-btn--false'; el.btnFalse.disabled = false; }
  if (el.feedbackArea) el.feedbackArea.classList.add('hidden');

  // Para timers anteriores
  if (estado.timer) estado.timer.stop();
  pararBarraInterval();
  resetarBarra();

  // Inicia timer do game-shell (controla display 00:30 e largura da barra)
  estado.timer = Timer.criar({
    total: CONFIG.TEMPO_POR_QUESTAO,
    onEnd: () => {
      if (!estado.respondido) processarResposta(null);
    },
  });
  estado.timer.start();

  // Inicia intervalo próprio para controlar COR da barra
  iniciarBarraInterval();
}

function responder(valor) {
  if (estado.respondido || estado.pausado) return;
  estado.timer?.stop();
  pararBarraInterval();
  processarResposta(valor);
}

function processarResposta(resposta) {
  estado.respondido = true;

  const pergunta = estado.perguntas[estado.indice];
  const correto  = resposta === pergunta.resposta;

  if (resposta !== null) {
    const btnSel = resposta ? el.btnTrue : el.btnFalse;
    btnSel?.classList.add(correto ? 'vf-btn--selected-correct' : 'vf-btn--selected-wrong');
  }

  if (!correto) {
    const btnCorreto = pergunta.resposta ? el.btnTrue : el.btnFalse;
    btnCorreto?.classList.add('vf-btn--reveal-correct');
  }

  if (el.btnTrue)  el.btnTrue.disabled  = true;
  if (el.btnFalse) el.btnFalse.disabled = true;

  if (el.questionCard) {
    el.questionCard.classList.add(correto ? 'vf-question-card--correct' : 'vf-question-card--wrong');
    if (!correto) {
      void el.questionCard.offsetWidth;
      el.questionCard.classList.add('vf-question-card--shake');
    }
  }

  const sufTempo = resposta === null ? ' (tempo esgotado)' : '';
  if (el.feedbackMsg) {
    el.feedbackMsg.className = `game-feedback ${correto ? 'game-feedback--correct' : 'game-feedback--wrong'}`;
    el.feedbackMsg.textContent = correto
      ? `✓ Correto! +${CONFIG.PONTOS_ACERTO} pontos`
      : `✗ Incorreto${sufTempo}! -${CONFIG.PONTOS_ERRO} pontos`;
  }
  if (el.feedbackExp) el.feedbackExp.textContent = pergunta.explicacao;
  el.feedbackArea?.classList.remove('hidden');

  if (correto) {
    estado.pontos  += CONFIG.PONTOS_ACERTO;
    estado.acertos += 1;
  } else {
    estado.pontos  -= CONFIG.PONTOS_ERRO;
    estado.erros   += 1;
  }
  if (estado.pontos < 0) estado.pontos = 0;

  if (el.scoreCorrect) el.scoreCorrect.textContent = estado.acertos;

  setTimeout(() => {
    estado.indice++;
    if (estado.indice < estado.perguntas.length) {
      carregarQuestao();
    } else {
      finalizarJogo();
    }
  }, CONFIG.DELAY_PROXIMA);
}

function finalizarJogo() {
  pararBarraInterval();
  const total = estado.perguntas.length;
  const pct   = Math.round((estado.acertos / total) * 100);

  let emoji, titulo, subtitulo;
  if (pct >= 80) {
    emoji = '🏆'; titulo = 'Excelente!';
    subtitulo = 'Você domina este conteúdo. Continue assim!';
  } else if (pct >= 50) {
    emoji = '👍'; titulo = 'Bom trabalho!';
    subtitulo = 'Você está no caminho certo. Revise os erros e tente novamente.';
  } else {
    emoji = '📚'; titulo = 'Pode melhorar!';
    subtitulo = 'Não desanime — revise o material e tente de novo!';
  }

  Result.mostrar({
    emoji, titulo, subtitulo,
    stats: [
      { label: 'Pontos',   valor: estado.pontos  },
      { label: 'Acertos',  valor: estado.acertos },
      { label: 'Erros',    valor: estado.erros   },
      { label: 'Precisão', valor: pct + '%'      },
    ],
    onRejogo: () => {
      const { disc } = lerParams();
      const banco = VDD_FALSO_DATA[disc] ?? [];
      estado.perguntas = shuffle(banco).slice(0, CONFIG.MAX_QUESTOES);
      iniciarJogo();
    },
  });
}

/* ══════════════════════════════════════════════════════════
   PAUSA
   ══════════════════════════════════════════════════════════ */

function setupPausa() {
  const btnPause       = $('btn-pause');
  const pauseIcon      = $('pause-icon');
  const pauseLabel     = $('pause-label');
  const btnVoltarIntro = $('btn-voltar-intro');

  // Overlay criado dinamicamente
  const pauseOverlay = document.createElement('div');
  pauseOverlay.id        = 'pause-overlay';
  pauseOverlay.className = 'vf-pause-overlay hidden';
  // REMOVA a linha do emoji e coloque um SVG de play diretamente
pauseOverlay.innerHTML = `
  <div class="vf-pause-card">
    <div class="vf-pause-icon">
      <svg viewBox="0 0 64 64" fill="currentColor" width="56" height="56">
        <path d="M14 8l40 24L14 56V8z"/>
      </svg>
    </div>
    <p class="vf-pause-txt">Jogo pausado</p>
    <button class="game-btn" id="btn-retomar">
      Retomar
      <svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 3l8 5-8 5V3z"/></svg>
    </button>
  </div>
`;
  document.body.appendChild(pauseOverlay);

  const ICON_PAUSE = `<rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/>`;
  const ICON_PLAY  = `<path d="M5 3l8 5-8 5V3z"/>`;

  function togglePausa() {
  if (el.screenQuestion?.classList.contains('hidden')) return;
  if (estado.respondido) return;

  estado.pausado = !estado.pausado;

  if (estado.pausado) {
    estado.barPausado = (performance.now() - estado.barInicio) / 1000;
    estado.timer?.stop();
    pararBarraInterval();
    pauseOverlay.classList.remove('hidden');
    // ← REMOVIDO: não muda mais o botão nem o ícone
  } else {
    estado.timer?.start();
    iniciarBarraInterval();
    pauseOverlay.classList.add('hidden');
    // ← REMOVIDO: não muda mais o botão nem o ícone
  }
}

  btnPause?.addEventListener('click', togglePausa);

  // Botão retomar dentro do overlay
  pauseOverlay.addEventListener('click', e => {
    if (e.target.closest('#btn-retomar')) togglePausa();
  });

  // Voltar para intro
btnVoltarIntro?.addEventListener('click', () => {
  estado.timer?.stop();
  estado.timer = null; // ← garante que nenhum callback residual rode
  pararBarraInterval();
  estado.pausado    = false;
  estado.respondido = false;
  pauseOverlay.classList.add('hidden');

  // Reseta display do timer visualmente
  const timerDisplay = document.getElementById('shell-timer-display');
  if (timerDisplay) timerDisplay.textContent = '00:30';

  resetarBarra();
  mostrarTela('intro');
});

  // Atalho: Espaço = pausa/retomar
  document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      if (!el.screenQuestion?.classList.contains('hidden') && !estado.respondido) {
        e.preventDefault();
        togglePausa();
      }
    }
  });
}

/* ══════════════════════════════════════════════════════════
   ATALHOS DE TECLADO — V/F
   ══════════════════════════════════════════════════════════ */

function registrarAtalhos() {
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (estado.respondido || estado.pausado) return;

    switch (e.key) {
      case 'v': case 'V': case '1':
        e.preventDefault(); responder(true);  break;
      case 'f': case 'F': case '2':
        e.preventDefault(); responder(false); break;
    }
  });
}

/* ══════════════════════════════════════════════════════════
   INICIALIZAÇÃO
   ══════════════════════════════════════════════════════════ */

function init() {
  Shell.init({ icon: '⚖️', nome: 'Verdadeiro ou Falso' });

  const { disc } = lerParams();
  aplicarCoresDisciplina(disc, DISC_CORES);

  const banco = VDD_FALSO_DATA[disc] ?? [];

  if (banco.length === 0) {
    mostrarTela('empty');
    const { sem } = lerParams();
    const btnBack = $('btn-empty-back');
    if (btnBack) btnBack.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;
    return;
  }

  estado.perguntas = shuffle(banco).slice(0, CONFIG.MAX_QUESTOES);

  if (el.scoreTotal) el.scoreTotal.textContent = estado.perguntas.length;
  if (el.qTotal)     el.qTotal.textContent     = estado.perguntas.length;

  const introTotal = $('intro-total-questoes');
  if (introTotal) introTotal.textContent = estado.perguntas.length;

  // Inicia barra verde já na intro
  atualizarCorBarra(1);

  el.btnStart?.addEventListener('click', iniciarJogo);
  el.btnTrue ?.addEventListener('click', () => responder(true));
  el.btnFalse?.addEventListener('click', () => responder(false));

  setupPausa();
  registrarAtalhos();
}

document.addEventListener('DOMContentLoaded', init);