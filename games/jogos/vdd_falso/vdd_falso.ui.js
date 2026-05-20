/* ============================================================
   NEXUS STUDY — games/jogos/vdd_falso/vdd_falso.ui.js  (v7.0)

   Responsabilidade: toda a camada de UI/DOM do jogo V/F.
   ─────────────────────────────────────────────────────
   Exporta funções puras de renderização e eventos visuais.
   Não contém lógica de negócio nem estado global — recebe
   dados via parâmetro e comunica ações via callbacks.

   Conteúdo:
     • Cache de elementos DOM  (el, $)
     • Gerenciamento de telas  (mostrarTela)
     • Info-strip              (setInfoStrip)
     • Barra de timer          (aplicarCorBarra)
     • Bolinhas de progresso   (renderDots)
     • Badge de histórico      (renderizarBadgeHistorico)
     • Renderização da questão (renderizarQuestao)
     • Botões de navegação     (atualizarBotoesNav)
     • Contadores              (atualizarContadores)
     • Botão "Revisar erros"   (atualizarBtnRevisarErros)
     • Botão "Continuar"       (configurarBtnContinuar)
     • Pausa / overlay         (setupPausa)
     • Atalhos de teclado      (registrarAtalhos)
     • Tela de resultado       (renderizarResultado)
     • Tela revisão concluída  (mostrarTelaRevisaoConcluida)
     • Estatísticas por questão (renderEstatisticasQuestoes)
============================================================ */

import { Timer } from '../../template/game-shell.js';
import { CONFIG } from './vdd_falso.js';

/* ══════════════════════════════════════════════════════════
   DOM — cache e helper
══════════════════════════════════════════════════════════ */

export const $ = id => document.getElementById(id);

/** Cache populado por initEl() durante o init do jogo. */
export const el = {};

export function initEl() {
  Object.assign(el, {
    screenIntro:     $('screen-intro'),
    screenQuestion:  $('screen-question'),
    screenEmpty:     $('screen-empty'),
    screenResult:    $('screen-result'),
    btnStart:        $('btn-start'),
    btnRevisarErros: $('btn-revisar-erros'),
    btnTrue:         $('btn-true'),
    btnFalse:        $('btn-false'),
    btnAnterior:     $('btn-anterior'),
    btnProxima:      $('btn-proxima'),
    qCurrent:        $('q-current'),
    qTotal:          $('q-total'),
    qBadge:          $('q-badge'),
    questionText:    $('question-text'),
    questionCard:    $('question-card'),
    progressFill:    $('progress-fill'),
    feedbackArea:    $('feedback-area'),
    feedbackMsg:     $('feedback-msg'),
    feedbackExp:     null,
    scoreCorrect:    $('score-correct'),
    scoreTotal:      $('score-total'),
    timerBar:        document.querySelector('.game-timer-bar'),
  });
}

/* ══════════════════════════════════════════════════════════
   TELAS
══════════════════════════════════════════════════════════ */

export function mostrarTela(nome, modoRevisao = false) {
  $('screen-loading')?.classList.add('hidden');
  el.screenIntro   ?.classList.add('hidden');
  el.screenQuestion?.classList.add('hidden');
  el.screenEmpty   ?.classList.add('hidden');
  el.screenResult  ?.classList.add('hidden');

  if (nome === 'intro')    el.screenIntro   ?.classList.remove('hidden');
  if (nome === 'question') el.screenQuestion?.classList.remove('hidden');
  if (nome === 'empty')    el.screenEmpty   ?.classList.remove('hidden');
  if (nome === 'result')   el.screenResult  ?.classList.remove('hidden');

  document.body.classList.toggle('modo-revisao', !!modoRevisao);
  if (el.screenQuestion?.dataset) {
    el.screenQuestion.dataset.revisao = modoRevisao ? 'true' : 'false';
  }

  // Banner de revisão
  const mainArea = el.screenQuestion?.querySelector('.vf-main-area');
  if (mainArea) {
    mainArea.querySelector('.vf-revisao-banner')?.remove();
    if (modoRevisao && nome === 'question') {
      const total  = el.qTotal ? parseInt(el.qTotal.textContent, 10) : 0;
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
   INFO-STRIP
══════════════════════════════════════════════════════════ */

const INFO_STRIP_DEFAULT = 'Após sua escolha, a resposta aparecerá automaticamente.';

export function setInfoStrip(texto) {
  const strip     = $('vf-info-strip');
  const stripText = $('vf-info-strip-text');
  const stripIcon = strip?.querySelector('svg') ?? null;
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
   FEEDBACK DE ACERTO / ERRO
══════════════════════════════════════════════════════════ */

/**
 * Exibe (ou oculta) o banner de feedback de acerto/erro.
 * @param {'correct'|'wrong'|'timeout'|null} tipo - null para esconder
 */
export function mostrarFeedback(tipo) {
  const area = el.feedbackArea ?? $('feedback-area');
  const msg  = el.feedbackMsg  ?? $('feedback-msg');
  if (!area || !msg) return;

  if (!tipo) {
    area.classList.add('hidden');
    msg.className  = 'game-feedback';
    msg.textContent = '';
    return;
  }

  const configs = {
    correct: { classe: 'game-feedback--correct', texto: '✓ Correto!' },
    wrong:   { classe: 'game-feedback--wrong',   texto: '✗ Incorreto!' },
    timeout: { classe: 'game-feedback--wrong',   texto: '⏱ Tempo esgotado!' },
  };

  const { classe, texto } = configs[tipo] ?? configs.wrong;

  // Força reflow para reativar a animação CSS mesmo na mesma questão
  msg.className   = 'game-feedback';
  void msg.offsetWidth;
  msg.className   = `game-feedback ${classe}`;
  msg.textContent = texto;
  area.classList.remove('hidden');
}

/* ══════════════════════════════════════════════════════════
   BARRA DE TIMER
══════════════════════════════════════════════════════════ */

export function aplicarCorBarra(pct) {
  const bar = el.timerBar;
  if (!bar) return;
  bar.classList.remove('game-timer-bar--green', 'game-timer-bar--mid', 'game-timer-bar--danger');
  if      (pct <= 34) bar.classList.add('game-timer-bar--danger');
  else if (pct <= 67) bar.classList.add('game-timer-bar--mid');
  else                bar.classList.add('game-timer-bar--green');
}

/* ══════════════════════════════════════════════════════════
   BOLINHAS DE PROGRESSO
══════════════════════════════════════════════════════════ */

export function renderDots(perguntas, respostas, indiceAtual, onNavegar) {
  const container = $('vf-dots');
  if (!container) return;
  container.innerHTML = '';

  perguntas.forEach((p, i) => {
    const resp       = respostas[i];
    const respondida = resp !== undefined;
    const correto    = respondida && resp === p.resposta;
    const atual      = i === indiceAtual;

    const dot  = document.createElement('button');
    dot.type   = 'button';
    dot.setAttribute('aria-label', `Questão ${i + 1}`);
    dot.className = 'vf-dot ' + (
      atual       ? 'vf-dot--current' :
      !respondida ? 'vf-dot--pending' :
      correto     ? 'vf-dot--correct' : 'vf-dot--wrong'
    );
    dot.addEventListener('click', () => onNavegar(i));
    container.appendChild(dot);
  });
}

/* ══════════════════════════════════════════════════════════
   BADGE DE HISTÓRICO
══════════════════════════════════════════════════════════ */

export function renderizarBadgeHistorico(questaoId, historicoVF) {
  const badge    = $('vf-hist-badge');
  const elTent   = $('vf-hist-tentativas');
  const elTaxa   = $('vf-hist-taxa');
  const elStatus = $('vf-hist-status');
  if (!badge) return;

  const h = historicoVF[questaoId];
  if (!h || h.tentativas === 0) {
    badge.hidden    = true;
    badge.className = 'vf-hist-badge';
    return;
  }

  const { tentativas, acertos, erros } = h;
  const taxa = Math.round((acertos / tentativas) * 100);
  let statusMod  = '';
  let statusText = '';
  const maisErros = erros > acertos;

  if (maisErros || (tentativas >= 3 && taxa < 50)) {
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
  void badge.offsetWidth; // força reflow para animação CSS
  badge.hidden = false;
}

/* ══════════════════════════════════════════════════════════
   BOTÕES DE NAVEGAÇÃO
══════════════════════════════════════════════════════════ */

export function atualizarBotoesNav(indice, perguntas, respostas) {
  const total      = perguntas.length;
  const ultimo     = indice === total - 1;
  const jaRespondeu = respostas[indice] !== undefined;
  const todasResp  = respostas.every(r => r !== undefined);

  if (el.btnAnterior) el.btnAnterior.disabled = indice === 0;

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
   RENDERIZAR QUESTÃO
══════════════════════════════════════════════════════════ */

/**
 * @param {object} params
 * @param {object[]} params.perguntas
 * @param {any[]}    params.respostas
 * @param {number}   params.indice
 * @param {object}   params.historicoVF
 * @param {object|null} params.timer      - instância atual do timer (pode ser null)
 * @param {function} params.criarTimer    - factory que cria novo Timer
 * @param {function} params.onNavegar     - callback(i) ao clicar nos dots
 */
export function renderizarQuestao({ perguntas, respostas, indice, historicoVF, timer, criarTimer, onNavegar }) {
  const pergunta    = perguntas[indice];
  const jaRespondeu = respostas[indice] !== undefined;
  const resposta    = respostas[indice];
  const correto     = jaRespondeu && resposta === pergunta.resposta;

  if (el.qCurrent) el.qCurrent.textContent = indice + 1;
  if (el.qTotal)   el.qTotal.textContent   = perguntas.length;
  if (el.qBadge)   el.qBadge.textContent   = `Q${indice + 1}`;

  const pct = ((indice + 1) / perguntas.length) * 100;
  if (el.progressFill) el.progressFill.style.width = pct + '%';
  if (el.questionText) el.questionText.textContent  = pergunta.enunciado;

  // Limpa estado visual dos botões
  el.btnTrue ?.classList.remove('vf-btn--selected', 'vf-btn--correct', 'vf-btn--wrong');
  el.btnFalse?.classList.remove('vf-btn--selected', 'vf-btn--correct', 'vf-btn--wrong');

  if (jaRespondeu) {
    const btnResposta = resposta === true ? el.btnTrue : el.btnFalse;
    if (btnResposta) {
      btnResposta.classList.add('vf-btn--selected', correto ? 'vf-btn--correct' : 'vf-btn--wrong');
    }
    const btnCorreto = pergunta.resposta === true ? el.btnTrue : el.btnFalse;
    if (btnCorreto && !correto) btnCorreto.classList.add('vf-btn--correct');
    setInfoStrip(pergunta.explicacao ?? null);

    // Feedback: timeout (resp === null) ou acerto/erro
    if (resposta === null) mostrarFeedback('timeout');
    else                  mostrarFeedback(correto ? 'correct' : 'wrong');
  } else {
    setInfoStrip(null);
    mostrarFeedback(null);
  }

  renderizarBadgeHistorico(pergunta.id, historicoVF);
  atualizarBotoesNav(indice, perguntas, respostas);
  renderDots(perguntas, respostas, indice, onNavegar);

  // Timer: para o atual e inicia novo se questão sem resposta
  if (timer) timer.stop();

  if (!jaRespondeu) {
    const tempoRestante = CONFIG.TEMPO_POR_QUESTAO;
    const pctInicial    = (tempoRestante / CONFIG.TEMPO_POR_QUESTAO) * 100;
    const novoTimer     = criarTimer(tempoRestante);
    novoTimer.start();
    aplicarCorBarra(pctInicial);
    document.documentElement.style.setProperty('--timer-pct', pctInicial + '%');
    return novoTimer; // retorna para que o chamador atualize estado.timer
  }

  return null;
}

/* ══════════════════════════════════════════════════════════
   CONTADORES
══════════════════════════════════════════════════════════ */

export function atualizarContadores(totalPerguntas) {
  if (el.scoreTotal) el.scoreTotal.textContent = totalPerguntas;
  if (el.qTotal)     el.qTotal.textContent     = totalPerguntas;
  const introTotal = $('intro-total-questoes');
  if (introTotal)    introTotal.textContent    = totalPerguntas;
}

/* ══════════════════════════════════════════════════════════
   BOTÃO "REVISAR ERROS"
══════════════════════════════════════════════════════════ */

export function atualizarBtnRevisarErros(erradas, onIniciarRevisao) {
  const btn = el.btnRevisarErros ?? $('btn-revisar-erros');
  if (!btn) return;

  if (erradas.length === 0) { btn.classList.add('hidden'); return; }

  const countEl = btn.querySelector('#vf-revisar-count') ?? $('vf-revisar-count');
  if (countEl) countEl.textContent = erradas.length;

  // Substitui o nó para limpar listeners anteriores
  const novo = btn.cloneNode(true);
  btn.parentNode.replaceChild(novo, btn);
  el.btnRevisarErros = novo;
  novo.classList.remove('hidden');
  novo.addEventListener('click', onIniciarRevisao);
}

/* ══════════════════════════════════════════════════════════
   BOTÃO "CONTINUAR"
══════════════════════════════════════════════════════════ */

export function configurarBtnContinuar(sessao, onContinuar) {
  const btn = $('btn-continuar');
  if (!btn) return;

  const respondidas = sessao.respostas.filter(r => r !== undefined).length;
  const total       = sessao.perguntas.length;
  const pendentes   = sessao.respostas.filter(r => r === undefined).length;

  if (pendentes === 0) { btn.classList.add('hidden'); return; }

  const novo = btn.cloneNode(true);
  btn.parentNode.replaceChild(novo, btn);
  novo.classList.remove('hidden');

  const countEl = $('continuar-progress');
  if (countEl) countEl.textContent = `${respondidas}/${total}`;

  novo.addEventListener('click', () => onContinuar(sessao));
}

/* ══════════════════════════════════════════════════════════
   PAUSA
══════════════════════════════════════════════════════════ */

/**
 * Configura o sistema de pausa e o botão "Voltar ao início".
 *
 * @param {object} callbacks
 * @param {function} callbacks.getTimer        - () => instância atual do timer
 * @param {function} callbacks.isPausado       - () => boolean
 * @param {function} callbacks.setPausado      - (v: boolean) => void
 * @param {function} callbacks.isQuestaoAtual  - () => boolean (true se questão sem resposta)
 * @param {function} callbacks.onVoltarIntro   - async () => void
 */
export function setupPausa({ getTimer, isPausado, setPausado, isQuestaoAtual, onVoltarIntro }) {
  const btnPause = $('btn-pause');

  const pauseOverlay = $('pause-overlay') ?? (() => {
    const overlay    = document.createElement('div');
    overlay.id        = 'pause-overlay';
    overlay.className = 'vf-pause-overlay hidden';
    overlay.innerHTML = `
      <div class="vf-pause-card">
        <div class="vf-pause-header">
          <div class="vf-pause-icon-ring">
            <svg viewBox="0 0 16 16" fill="currentColor" width="22" height="22">
              <rect x="3" y="2" width="3.5" height="12" rx="1"/>
              <rect x="9.5" y="2" width="3.5" height="12" rx="1"/>
            </svg>
          </div>
          <div>
            <p class="vf-pause-title">Jogo pausado</p>
            <p class="vf-pause-hint">O tempo está parado</p>
          </div>
        </div>
        <div class="vf-pause-divider"></div>
        <div class="vf-pause-tip">
          <span class="vf-pause-tip__icon">💡</span>
          <span>Aproveite para revisar o conteúdo antes de continuar. O timer só retoma quando você clicar em <strong>Retomar</strong>.</span>
        </div>
        <button class="game-btn vf-pause-resume-btn" id="btn-retomar">
          <svg viewBox="0 0 64 64" fill="currentColor" width="14" height="14" style="margin-right:6px">
            <path d="M14 8l40 24L14 56V8z"/>
          </svg>
          Retomar
        </button>
        <p class="vf-pause-shortcut">
          Pressione <kbd>Espaço</kbd> ou <kbd>Esc</kbd> para retomar
        </p>
      </div>`;
    document.querySelector('.game-shell')?.appendChild(overlay);
    return overlay;
  })();

  function _aplicarEstadoPausa(pausado) {
    const btnPauseEl   = $('btn-pause');
    const pauseIconEl  = $('pause-icon');
    const pauseLabelEl = $('pause-label');

    if (pausado) {
      pauseOverlay.classList.remove('hidden');
      btnPauseEl?.classList.add('vf-ctrl-btn--paused');
      if (pauseIconEl)  { pauseIconEl.innerHTML = `<path d="M14 8l40 24L14 56V8z"/>`; pauseIconEl.setAttribute('viewBox', '0 0 64 64'); }
      if (pauseLabelEl)   pauseLabelEl.textContent = 'Retomar';
    } else {
      pauseOverlay.classList.add('hidden');
      btnPauseEl?.classList.remove('vf-ctrl-btn--paused');
      if (pauseIconEl)  { pauseIconEl.innerHTML = `<rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/>`; pauseIconEl.setAttribute('viewBox', '0 0 16 16'); }
      if (pauseLabelEl)   pauseLabelEl.textContent = 'Pausar';
    }
  }

  function togglePausa() {
    if (el.screenQuestion?.classList.contains('hidden')) return;
    if (!isQuestaoAtual()) return; // questão já respondida: não pausa

    const novoPausado = !isPausado();
    setPausado(novoPausado);
    if (novoPausado) getTimer()?.pause();
    else             getTimer()?.resume();
    _aplicarEstadoPausa(novoPausado);
  }

  btnPause?.addEventListener('click', togglePausa);
  pauseOverlay.addEventListener('click', e => {
    if (e.target.closest('#btn-retomar')) togglePausa();
  });

  $('btn-voltar-intro')?.addEventListener('click', async () => {
    // Para timer, despauza visualmente e delega lógica ao callback
    getTimer()?.stop();
    setPausado(false);
    _aplicarEstadoPausa(false);

    // Reseta visual da barra de timer
    document.documentElement.style.setProperty('--timer-pct', '100%');
    aplicarCorBarra(100);

    const timerDisplay = $('shell-timer-display');
    if (timerDisplay) {
      const t  = CONFIG.TEMPO_POR_QUESTAO;
      const mm = String(Math.floor(t / 60)).padStart(2, '0');
      const ss = String(t % 60).padStart(2, '0');
      timerDisplay.textContent = `${mm}:${ss}`;
      timerDisplay.classList.remove('game-timer-display--danger', 'game-timer-display--mid');
    }

    await onVoltarIntro();
  });

  // Atalho Espaço ou Esc para pausar/retomar
  document.addEventListener('keydown', e => {
    const isSpace = e.code === 'Space';
    const isEsc   = e.code === 'Escape';

    if (!el.screenQuestion?.classList.contains('hidden') && isQuestaoAtual()) {
      // Esc: só retoma (se estiver pausado), não pausa
      if (isEsc && isPausado()) {
        e.preventDefault();
        togglePausa();
        return;
      }
      // Espaço: alterna pausa/retomar
      if (isSpace) {
        if (document.activeElement?.id === 'btn-retomar') return;
        e.preventDefault();
        togglePausa();
      }
    }
  });
}

/* ══════════════════════════════════════════════════════════
   ATALHOS DE TECLADO
══════════════════════════════════════════════════════════ */

export function registrarAtalhos({ isPausado, isQuestaoSemResposta, onResponder, onProxima, onAnterior }) {
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (isPausado()) return;
    if (!el.screenQuestion || el.screenQuestion.classList.contains('hidden')) return;

    const semResposta = isQuestaoSemResposta();
    switch (e.key) {
      case 'v': case 'V': case '1': if (semResposta) { e.preventDefault(); onResponder(true);  } break;
      case 'f': case 'F': case '2': if (semResposta) { e.preventDefault(); onResponder(false); } break;
      case 'ArrowRight': case 'Enter': if (!semResposta) { e.preventDefault(); onProxima(); } break;
      case 'ArrowLeft':  e.preventDefault(); onAnterior(); break;
    }
  });
}

/* ══════════════════════════════════════════════════════════
   TELA DE RESULTADO
══════════════════════════════════════════════════════════ */

/**
 * Renderiza a tela de resultado após finalizar o jogo.
 *
 * @param {object} dados - { acertos, erros, pontos, tempoInicio, modoRevisao }
 * @param {object} callbacks - { onSair, onRejogo }
 */
export function renderizarResultado({ acertos, erros, pontos, tempoInicio, modoRevisao }, { onSair, onRejogo }) {
  const respondidas = acertos + erros;
  const pct         = respondidas > 0 ? Math.round((acertos / respondidas) * 100) : 0;

  let emoji, titulo;
  if      (pct >= 80) { emoji = '🏆'; titulo = 'Excelente!';     }
  else if (pct >= 50) { emoji = '👍'; titulo = 'Bom trabalho!';  }
  else                { emoji = '📚'; titulo = 'Pode melhorar!'; }

  const resultadoNucleo = document.querySelector('.resultado-nucleo');
  if (resultadoNucleo) {
    resultadoNucleo.querySelector('.vf-finish-revisao-badge')?.remove();
    if (modoRevisao) {
      const badge = document.createElement('div');
      badge.className = 'vf-finish-revisao-badge';
      badge.innerHTML = `<i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Revisão de erros`;
      resultadoNucleo.insertBefore(badge, resultadoNucleo.firstChild);
    }
  }

  const elSimb     = $('resultado-simbolo');
  const elTitulo   = $('resultado-titulo');
  const elPontos   = $('resultado-pontos');
  const elAcertos  = $('resultado-acertos');
  const elErros    = $('resultado-erros');
  const elPrecisao = $('resultado-precisao');
  const elTempo    = $('resultado-tempo');

  if (elSimb)    elSimb.textContent    = emoji;
  if (elTitulo)  elTitulo.textContent  = titulo;
  if (elPontos)  elPontos.textContent  = pontos;
  if (elAcertos) elAcertos.textContent = acertos;
  if (elErros)   elErros.textContent   = erros;
  if (elPrecisao) elPrecisao.textContent = pct + '%';

  if (elTempo) {
    const totalSeg = Math.round((Date.now() - (tempoInicio ?? Date.now())) / 1000);
    const mm = Math.floor(totalSeg / 60);
    const ss = String(totalSeg % 60).padStart(2, '0');
    elTempo.textContent = `${mm}:${ss}`;
  }

  // Botão Sair
  const elSair = $('resultado-btn-sair');
  if (elSair) {
    elSair.removeAttribute('href');
    elSair.style.cursor = 'pointer';
    const novoSair = elSair.cloneNode(true);
    elSair.parentNode.replaceChild(novoSair, elSair);
    novoSair.addEventListener('click', e => { e.preventDefault(); onSair(); });
  }

  // Botão Jogar novamente / Repetir revisão
  const elRejogo = $('resultado-btn-rejogo');
  if (elRejogo) {
    if (modoRevisao) elRejogo.classList.add('resultado-btn--repetir-revisao');

    const novoRejogo = elRejogo.cloneNode(true);
    elRejogo.parentNode.replaceChild(novoRejogo, elRejogo);

    if (modoRevisao) {
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

    novoRejogo.addEventListener('click', onRejogo);
  }
}

/* ══════════════════════════════════════════════════════════
   TELA REVISÃO CONCLUÍDA
══════════════════════════════════════════════════════════ */

export function mostrarTelaRevisaoConcluida(onVoltar) {
  const resultCard = document.querySelector('.resultado-nucleo');
  if (!resultCard) { onVoltar(); return; }

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

  $('revisao-concluida-voltar')?.addEventListener('click', onVoltar);
}

/* ══════════════════════════════════════════════════════════
   ESTATÍSTICAS POR QUESTÃO (painel de resultado)
══════════════════════════════════════════════════════════ */

export function renderEstatisticasQuestoes(historico, perguntas, respostas, modoRevisao) {
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

  for (let i = 0; i < perguntas.length; i++) {
    const q    = perguntas[i];
    const h    = historico[q.id];
    const resp = respostas[i]; // índice direto — evita indexOf por referência que quebra com cópias do array
    const acertouAgora = resp !== null && resp !== undefined && resp === q.resposta;
    const errouAgora   = resp !== null && resp !== undefined && resp !== q.resposta;
    const enun = q.enunciado.length > 52 ? q.enunciado.slice(0, 52) + '…' : q.enunciado;
    let rowHtml;

    if (modoRevisao) {
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
          <div class="vf-prog-bar ${barCls}" style="width:${barPct}%"></div>
          <span class="vf-sq-pct">${label}</span>
        </div>`;
    } else {
      if (!h) continue;
      const { tentativas, acertos, erros: _erros } = h;
      const taxa   = Math.round((acertos / tentativas) * 100);
      const barCls = taxa >= 80 ? 'vf-prog-bar--ok' : taxa >= 50 ? 'vf-prog-bar--med' : 'vf-prog-bar--critico';
      const icone   = acertouAgora ? '✓' : errouAgora ? '✗' : '–';
      const iconCor = acertouAgora ? '#34d399' : errouAgora ? '#f87171' : '#94a3b8';
      rowHtml = `
        <div class="vf-sq-meta">
          <span class="vf-sq-icone" style="color:${iconCor}">${icone}</span>
          <span class="vf-sq-enun">${enun}</span>
          ${acertouAgora && tentativas >= 3 && taxa >= 80 ? '<span class="vf-sq-superada" title="Dominada">⭐</span>' : ''}
        </div>
        <div class="vf-sq-prog-row">
          <div class="vf-prog-bar ${barCls}" style="width:${taxa}%"></div>
          <span class="vf-sq-pct">${taxa}%</span>
        </div>
        <div class="vf-sq-detalhe">${acertos} acerto${acertos !== 1 ? 's' : ''} / ${tentativas} tentativa${tentativas !== 1 ? 's' : ''}</div>`;
    }

    const row = document.createElement('div');
    row.className = 'vf-sq-row';
    row.innerHTML = rowHtml;
    lista.appendChild(row);
  }

  painel.appendChild(lista);
  resultCard.appendChild(painel);
}