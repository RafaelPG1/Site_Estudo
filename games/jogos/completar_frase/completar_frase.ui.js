/* ============================================================
   NEXUS STUDY — completar_frase.ui.js  (v4)

   RESPONSABILIDADES DESTE ARQUIVO
   ────────────────────────────────
   • Renderização / atualização do DOM
   • Templates HTML locais (bolinhas, estatísticas, banner)
   • Animações e classes visuais
   • Binding de eventos (recebe callbacks do .js principal)
   • Overlays (pausa)
   • Atualização de barra de progresso, chips, timer

   NÃO está aqui:
   • Estado da partida
   • Lógica de negócio (verificar acerto, construir lista…)
   • Persistência (SessionNav, localStorage)
   • Fluxo do jogo

   CONTRATO
   ────────
   Toda função exportada recebe DADOS (primitivos/objetos) e/ou
   callbacks — nunca lê/grava Estado diretamente.
   ============================================================ */

import { DISC_CORES }               from '../../../shared/js/cores.js';
import { aplicarCoresDisciplina }   from '../../../shared/js/theme.js';
import { getDisciplinasDeSemestre } from '../../../src/global.js';
import { lerParams }                from '../../template/game-shell.js';

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);

function _set(id, texto) {
  const el = $(id);
  if (el) el.textContent = texto;
}

/** Metadados da disciplina a partir do ID. */
const _SEMESTRES_CONHECIDOS = ['2026.2', '2026.1', '2027.1'];

function _getDiscMeta(discId) {
  const { sem: URL_SEM } = lerParams();
  const semestres = [URL_SEM, ..._SEMESTRES_CONHECIDOS.filter(s => s !== URL_SEM)];
  for (const sem of semestres) {
    try {
      const lista  = getDisciplinasDeSemestre(sem);
      const found  = lista.find(d => d.id === discId);
      if (found) return found;
    } catch {}
  }
  return { apelido: discId?.toUpperCase() ?? '—', emoji: '' };
}

/* ══════════════════════════════════════════════════════════
   REFERÊNCIAS DE ELEMENTOS — preenchidas em init()
   ══════════════════════════════════════════════════════════ */
let Els = {};

/* ══════════════════════════════════════════════════════════
   INIT — binds de eventos + cache de elementos DOM
   Chamado UMA VEZ pelo completar_frase.js no DOMContentLoaded.
   ══════════════════════════════════════════════════════════ */
export function init({
  onVerificar,
  onAvancar,
  onAnterior,
  onPausar,
  onRetomar,
  onMostrarDica,
  onBtnStart,
  onBtnRevisarErros,
  onBtnHome,
  onBtnBack,
}) {
  // Cache de elementos
  Els = {
    gameCard:      $('game-card'),
    gameLayout:    $('game-layout'),
    screenIntro:   $('screen-intro'),
    screenResult:  $('screen-result'),
    fraseTexto:    $('frase-texto'),
    letrasCount:   $('letras-count'),
    dicaPanel:     $('dica-panel'),
    btnShowDica:   $('btn-show-dica'),
    discTag:       $('disc-tag'),
    nivelTag:      $('nivel-tag'),
    semTag:        $('sem-tag'),
    questionNum:   $('question-num'),
    inputAnswer:   $('input-answer'),
    btnCheck:      $('btn-check'),
    feedbackLine:  $('feedback-line'),
    btnNext:       $('btn-next'),
    btnPrev:       $('btn-prev'),
    chipOk:        $('chip-ok'),
    chipErr:       $('chip-err'),
    progressFill:  $('progress-fill'),
    progressLabel: $('progress-label'),
    progressPct:   $('progress-pct'),
    resultPct:     $('result-pct'),
    resultTitle:   $('result-title'),
    resultSub:     $('result-sub'),
    resultOk:      $('result-ok'),
    resultErr:     $('result-err'),
    navBar:        $('nav-bar'),
    btnRestart:    $('btn-restart'),
    ringFill:      $('ring-fill'),
    shellDiscName: $('shell-disc-name'),
    shellSem:      $('shell-sem'),
    backBtn:       $('back-btn'),
    btnBackResult: $('btn-back-result'),
    btnHome:       $('btn-home'),
    pauseOverlay:  $('pause-overlay'),
    btnPause:      $('btn-pause'),
    btnResume:     $('btn-resume'),
    timerBarFill:  $('timer-bar-fill'),
    timerNum:      $('timer-num'),
    cfDots:        $('cf-dots'),
  };

  // ── Botão verificar ──────────────────────────────────────
  Els.btnCheck?.addEventListener('click', onVerificar);

  // ── Botão próxima ────────────────────────────────────────
  Els.btnNext?.addEventListener('click', onAvancar);

  // ── Botão anterior ───────────────────────────────────────
  Els.btnPrev?.addEventListener('click', onAnterior);

  // ── Enter no input ───────────────────────────────────────
  Els.inputAnswer?.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    // Se ainda não respondeu → verifica; se respondeu → avança
    const btnCheck = Els.btnCheck;
    if (btnCheck && !btnCheck.disabled) onVerificar();
    else onAvancar();
  });

  // ── Botão dica (toggle abrir/fechar) ─────────────────────
  Els.btnShowDica?.addEventListener('click', () => {
    const aberta = Els.btnShowDica.classList.contains('btn-show-dica--aberta');
    if (aberta) {
      _fecharDica();
    } else {
      onMostrarDica();
      Els.btnShowDica.classList.add('btn-show-dica--aberta');
    }
  });

  // ── Pausa ────────────────────────────────────────────────
  Els.btnPause?.addEventListener('click', onPausar);
  Els.btnResume?.addEventListener('click', onRetomar);

  // ── Botão Start ──────────────────────────────────────────
  $('btn-start')?.addEventListener('click', onBtnStart);

  // ── Botão Revisar erros ──────────────────────────────────
  $('btn-revisar-erros')?.addEventListener('click', onBtnRevisarErros);

  // ── Botão Home ───────────────────────────────────────────
  Els.btnHome?.addEventListener('click', onBtnHome);

  // ── Botão Voltar (header) ────────────────────────────────
  Els.backBtn?.addEventListener('click', onBtnBack);

  // ── Botão Voltar (tela resultado) ────────────────────────
  if (Els.btnBackResult) {
    Els.btnBackResult.removeAttribute('href');
    Els.btnBackResult.addEventListener('click', e => {
      e.preventDefault();
      onBtnHome();
    });
  }
}

/* ══════════════════════════════════════════════════════════
   TIMER
   ══════════════════════════════════════════════════════════ */
export function renderTimer(seg, total, warn, danger) {
  const fill = Els.timerBarFill;
  const num  = Els.timerNum;
  if (!fill || !num) return;

  fill.style.width = (seg / total * 100) + '%';
  num.textContent  = seg;

  const isWarn   = seg <= warn   && seg > danger;
  const isDanger = seg <= danger;

  fill.classList.toggle('timer--warn',   isWarn);
  fill.classList.toggle('timer--danger', isDanger);
  num.classList.toggle('timer--warn',    isWarn);
  num.classList.toggle('timer--danger',  isDanger);
}

/** Exibe estado visual de timeout (input/feedback) sem lógica de negócio. */
export function renderTimerExpirou() {
  if (Els.inputAnswer) {
    Els.inputAnswer.disabled = true;
    Els.inputAnswer.value    = '';
    Els.inputAnswer.classList.add('state-err');
  }
  if (Els.btnCheck) Els.btnCheck.disabled = true;
}

/* ══════════════════════════════════════════════════════════
   PERGUNTA
   ══════════════════════════════════════════════════════════ */
/**
 * Renderiza o card da questão atual.
 *
 * @param {object} opts
 * @param {object}   opts.questao          — item do banco
 * @param {number}   opts.indice           — índice atual (0-based)
 * @param {number}   opts.totalQuestoes
 * @param {string}   opts.disc             — ID da disciplina
 * @param {string}   opts.sem
 * @param {object}   opts.historico        — hist[indice] (undefined se não respondida)
 * @param {Function} opts.normalizar
 * @param {Function} opts.contarLetras
 * @param {Function} opts.gerarUnderscores
 */
export function renderPergunta({
  questao: p,
  indice,
  totalQuestoes,
  disc,
  sem,
  historico: hist,
  normalizar,
  contarLetras,
  gerarUnderscores,
}) {
  if (!Els.gameCard) return;

  // Animação de entrada do card
  Els.gameCard.style.animation = 'none';
  void Els.gameCard.offsetWidth;
  Els.gameCard.style.animation = '';

  // Metadados da disciplina
  const meta = _getDiscMeta(disc);

  // Tag da disciplina
  if (Els.discTag) {
    Els.discTag.innerHTML = meta.emoji
      ? `<span class="disc-emoji">${meta.emoji}</span> ${meta.apelido ?? disc}`
      : `<span class="disc-sigla">${meta.apelido?.split(' ')[0]?.toUpperCase() ?? disc.toUpperCase()}</span> ${meta.apelido ?? disc}`;
    Els.discTag.style.color = 'var(--cor-tema)';
  }

  if (Els.semTag)     Els.semTag.textContent   = sem || '—';
  if (Els.questionNum) Els.questionNum.textContent = `QUESTÃO ${String(indice + 1).padStart(2, '0')}`;

  // Nível
  if (Els.nivelTag) {
    const nk = normalizar(p.nivel);
    Els.nivelTag.textContent = p.nivel;
    Els.nivelTag.className   = `nivel-tag ${nk === 'facil' ? 'facil' : nk === 'medio' ? 'medio' : 'dificil'}`;
  }

  // Letras
  if (Els.letrasCount) {
    Els.letrasCount.textContent = contarLetras(p.resposta);
  }

  // Frase com lacuna
  if (Els.fraseTexto) {
    Els.fraseTexto.innerHTML = p.frase.replace(
      '______',
      `<span class="lacuna">${gerarUnderscores(p.resposta)}</span>`,
    );
  }

  // Reset painel de dica
  _fecharDica();
  if (Els.btnShowDica) {
    const temDicas = Array.isArray(p.tips) && p.tips.length > 0;
    Els.btnShowDica.style.display = temDicas ? '' : 'none';
    Els.btnShowDica.classList.remove('btn-show-dica--aberta');
  }

  // Input
  if (Els.inputAnswer) {
    Els.inputAnswer.value     = hist?.digitado ?? '';
    Els.inputAnswer.className = 'input-answer';
    Els.inputAnswer.disabled  = !!hist;
    if (!hist) Els.inputAnswer.focus();
  }

  if (Els.btnCheck) Els.btnCheck.disabled = !!hist;

  // Feedback (questão já respondida)
  if (hist) {
    if (hist.acertou) {
      Els.inputAnswer?.classList.add('state-ok');
      if (Els.feedbackLine) {
        Els.feedbackLine.className = 'feedback-line ok show';
        Els.feedbackLine.innerHTML = `<span class="feedback-icon">✓</span> Resposta correta.`;
      }
    } else {
      Els.inputAnswer?.classList.add('state-err');
      if (Els.feedbackLine) {
        Els.feedbackLine.className = 'feedback-line err show';
        Els.feedbackLine.innerHTML =
          `<span class="feedback-icon">✗</span> Resposta correta: <span class="fb-answer">${p.resposta}</span>`;
      }
    }
  } else {
    if (Els.feedbackLine) Els.feedbackLine.className = 'feedback-line';
  }

  // Botão próxima
  const ultima = indice >= totalQuestoes - 1;
  renderBtnNextLabel(ultima);
  setBtnNextEnabled(!!hist);
  if (Els.btnPrev) Els.btnPrev.disabled = indice === 0;
}

/* ══════════════════════════════════════════════════════════
   INPUT / FEEDBACK
   ══════════════════════════════════════════════════════════ */
export function getInputValue() {
  return Els.inputAnswer?.value ?? '';
}

export function shakeInput() {
  if (!Els.inputAnswer) return;
  Els.inputAnswer.classList.add('shake');
  Els.inputAnswer.addEventListener('animationend',
    () => Els.inputAnswer.classList.remove('shake'), { once: true });
}

export function setInputResultado(digitado, acertou) {
  if (!Els.inputAnswer) return;
  Els.inputAnswer.disabled = true;
  Els.inputAnswer.value    = digitado;
  Els.inputAnswer.classList.add(acertou ? 'state-ok' : 'state-err');
  if (Els.btnCheck) Els.btnCheck.disabled = true;
}

export function renderFeedback(acertou, respostaCorreta) {
  if (!Els.feedbackLine) return;
  if (acertou) {
    Els.feedbackLine.className = 'feedback-line ok show';
    Els.feedbackLine.innerHTML = `<span class="feedback-icon">✓</span> Resposta correta.`;
  } else {
    Els.feedbackLine.className = 'feedback-line err show';
    Els.feedbackLine.innerHTML =
      `<span class="feedback-icon">✗</span> Resposta correta: <span class="fb-answer">${respostaCorreta}</span>`;
  }
}

/* ══════════════════════════════════════════════════════════
   BOTÃO PRÓXIMA
   ══════════════════════════════════════════════════════════ */
export function renderBtnNextLabel(ultima) {
  if (!Els.btnNext) return;
  Els.btnNext.innerHTML = ultima
    ? 'Ver resultado <span class="arrow">→</span>'
    : 'Próxima <span class="arrow">→</span>';
}

export function setBtnNextEnabled(enabled) {
  if (Els.btnNext) Els.btnNext.disabled = !enabled;
}

/* ══════════════════════════════════════════════════════════
   META / PROGRESSO
   ══════════════════════════════════════════════════════════ */
export function renderMeta({ feitas, total, pct, acertos, erros }) {
  if (Els.progressFill)  Els.progressFill.style.width  = pct + '%';
  if (Els.progressLabel) Els.progressLabel.textContent = `${feitas} / ${total}`;
  if (Els.progressPct)   Els.progressPct.textContent   = Math.round(pct) + '%';
  if (Els.chipOk)        Els.chipOk.textContent        = `✓ ${acertos}`;
  if (Els.chipErr)       Els.chipErr.textContent       = `✗ ${erros}`;
}

/* ══════════════════════════════════════════════════════════
   BOLINHAS (dots)
   ══════════════════════════════════════════════════════════ */
export function renderDots(lista, historico, indiceAtual, onClickDot) {
  const container = Els.cfDots;
  if (!container) return;
  container.innerHTML = '';

  lista.forEach((_, i) => {
    const hist      = historico[i];
    const respondida = hist !== undefined;
    const acertou    = respondida && hist.acertou;
    const atual      = i === indiceAtual;

    const dot = document.createElement('button');
    dot.type      = 'button';
    dot.className = 'cf-dot ' + (
      atual       ? 'cf-dot--current' :
      !respondida ? ''                :
      acertou     ? 'cf-dot--correct' : 'cf-dot--wrong'
    );
    dot.setAttribute('aria-label', `Ir para questão ${i + 1}`);
    dot.title = `Questão ${i + 1}`;
    dot.addEventListener('click', () => onClickDot(i));
    container.appendChild(dot);
  });
}

/* ══════════════════════════════════════════════════════════
   DICA
   ══════════════════════════════════════════════════════════ */
export function renderDica(texto) {
  if (!Els.dicaPanel) return;
  Els.dicaPanel.textContent = texto;
  Els.dicaPanel.classList.remove('dica-panel--animando');
  void Els.dicaPanel.offsetWidth; // reflow intencional para re-trigger CSS
  Els.dicaPanel.classList.add('dica-panel--animando');
  Els.dicaPanel.style.display = 'block';
}

function _fecharDica() {
  if (!Els.dicaPanel) return;
  Els.dicaPanel.style.display = 'none';
  Els.dicaPanel.textContent   = '';
  Els.dicaPanel.classList.remove('dica-panel--animando');
}

/* ══════════════════════════════════════════════════════════
   PAUSA
   ══════════════════════════════════════════════════════════ */
export function mostrarPausa() {
  Els.pauseOverlay?.classList.remove('hidden');
  Els.btnPause?.classList.add('btn-icon-ctrl--active');
}

export function esconderPausa() {
  Els.pauseOverlay?.classList.add('hidden');
  Els.btnPause?.classList.remove('btn-icon-ctrl--active');
}

/* ══════════════════════════════════════════════════════════
   TELAS — visibilidade
   ══════════════════════════════════════════════════════════ */
export function mostrarGameLayout() {
  if (Els.screenIntro)  Els.screenIntro.style.display  = 'none';
  if (Els.gameLayout)   Els.gameLayout.style.display   = '';
  if (Els.gameCard)     Els.gameCard.style.display     = '';
  if (Els.navBar)       Els.navBar.classList.remove('hidden');
  Els.screenResult?.classList.remove('show');
}

export function esconderResultado() {
  Els.screenResult?.classList.remove('show');
  if (Els.gameCard) Els.gameCard.style.display = '';
  Els.navBar?.classList.remove('hidden');
}

/* ══════════════════════════════════════════════════════════
   BANNER DE REVISÃO
   ══════════════════════════════════════════════════════════ */
export function atualizarBannerRevisao(modoRevisao, totalQuestoes) {
  const gameLayout = Els.gameLayout ?? $('game-layout');
  if (!gameLayout) return;

  gameLayout.querySelector('.cf-revisao-banner')?.remove();
  document.body.classList.toggle('modo-revisao', modoRevisao);

  if (!modoRevisao) return;

  const banner = document.createElement('div');
  banner.className = 'cf-revisao-banner';
  banner.setAttribute('role', 'alert');
  banner.innerHTML = `
    <span class="cf-revisao-banner__icon">⚠</span>
    <span class="cf-revisao-banner__label">Revisão de erros</span>
    <span class="cf-revisao-banner__count">${totalQuestoes} questão${totalQuestoes !== 1 ? 'ões' : ''}</span>
  `;

  const card = $('game-card');
  if (card) gameLayout.insertBefore(banner, card);
  else gameLayout.prepend(banner);
}

/* ══════════════════════════════════════════════════════════
   INTRO
   ══════════════════════════════════════════════════════════ */
/**
 * Exibe a tela de introdução e configura seus botões.
 *
 * @param {object} opts
 * @param {string}   opts.disc
 * @param {string}   opts.sem
 * @param {number}   opts.totalQuestoes
 * @param {object}   opts.sessaoSalva    — sessão do localStorage (botão Continuar)
 * @param {number}   opts.errasCount     — quantidade de questões com erro
 * @param {Function} opts.onContinuar    — callback(sessao)
 */
export function mostrarIntro({ disc, sem, totalQuestoes, sessaoSalva, errasCount, onContinuar }) {
  if (Els.screenIntro)  Els.screenIntro.style.display  = '';
  if (Els.gameLayout)   Els.gameLayout.style.display   = 'none';
  Els.gameLayout?.querySelector('.cf-revisao-banner')?.remove();
  document.body.classList.remove('modo-revisao');

  // Semestre
  _set('intro-sem-label', sem || '—');

  // Disciplina (com emoji se disponível)
  const meta     = _getDiscMeta(disc);
  const chipDisc = document.querySelector('.cf-intro-card__chip--disc');
  if (chipDisc) {
    chipDisc.innerHTML = meta.emoji
      ? `<span style="font-size:1em;line-height:1">${meta.emoji}</span>
         <span id="intro-disc-name">${meta.apelido || disc.toUpperCase() || '—'}</span>`
      : `<svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" style="opacity:.75">
           <path d="M2 3h12v1H2zm0 3h8v1H2zm0 3h10v1H2zm0 3h6v1H2z"/>
         </svg>
         <span id="intro-disc-name">${meta.apelido || disc.toUpperCase() || '—'}</span>`;
  }

  // Badge total de questões
  _set('intro-total-questoes', String(totalQuestoes));

  // Botão "Continuar"
  _configurarBtnContinuar(sessaoSalva, onContinuar);

  // Botão "Revisar erros"
  atualizarBtnRevisarErros(errasCount);
}

function _configurarBtnContinuar(sessao, onContinuar) {
  const btn = $('btn-continuar');
  if (!btn) return;

  // Sessão pode vir do SessionNav (campo 'perguntas') ou do snapshot direto (campo 'lista')
  const lista = sessao?.lista ?? sessao?.perguntas ?? [];
  if (!lista.length) {
    btn.classList.add('hidden');
    return;
  }

  // 'respostas' é o campo do SessionNav (array paralelo — undefined = não respondida)
  // 'historico' é o campo do snapshot direto
  const respostas = sessao.respostas ?? sessao.historico ?? [];
  const total     = lista.length;

  // respondidas = posições que JÁ têm valor (não undefined)
  const respondidas = respostas.filter(r => r !== undefined).length;
  // pendentes = posições ainda sem resposta
  const pendentes   = total - respondidas;

  // Não exibe se jogo finalizado (0 pendentes) ou sem nenhum progresso
  if (pendentes <= 0 || respondidas === 0) {
    btn.classList.add('hidden');
    return;
  }

  // Clona para remover listeners antigos e atualizar o texto
  const novo = btn.cloneNode(true);
  btn.parentNode.replaceChild(novo, btn);
  novo.classList.remove('hidden');

  // Exibe "X/Y" no chip de progresso do botão
  const progressEl = novo.querySelector('.cf-continuar-progress') ?? $('continuar-progress');
  if (progressEl) progressEl.textContent = `${respondidas}/${total}`;

  novo.addEventListener('click', () => onContinuar(sessao));
}

export function atualizarBtnRevisarErros(count) {
  const btn = $('btn-revisar-erros');
  if (!btn) return;
  if (count === 0) {
    btn.classList.add('hidden');
    return;
  }
  _set('cf-revisar-count', String(count));
  btn.classList.remove('hidden');
}

/* ══════════════════════════════════════════════════════════
   RESULTADO
   ══════════════════════════════════════════════════════════ */
/**
 * Renderiza a tela de resultado.
 *
 * @param {object} opts
 * @param {Array}    opts.lista
 * @param {Array}    opts.historico
 * @param {object}   opts.historicoRevisao
 * @param {number}   opts.acertos
 * @param {number}   opts.erros
 * @param {boolean}  opts.modoRevisao
 * @param {Function} opts.onReiniciar
 * @param {Function} opts.onVoltar
 */
export function mostrarResultado({
  lista,
  historico,
  historicoRevisao,
  acertos,
  erros,
  modoRevisao,
  onReiniciar,
  onVoltar,
}) {
  if (Els.gameCard) Els.gameCard.style.display = 'none';
  Els.navBar?.classList.add('hidden');
  if (Els.progressFill) Els.progressFill.style.width = '100%';

  // Remove banner de revisão
  ($('game-layout'))?.querySelector('.cf-revisao-banner')?.remove();

  const total = lista.length;
  const pct   = total > 0 ? Math.round((acertos / total) * 100) : 0;

  if (Els.resultPct) Els.resultPct.textContent = pct + '%';
  if (Els.resultOk)  Els.resultOk.textContent  = acertos;
  if (Els.resultErr) Els.resultErr.textContent = erros;

  // Título / subtítulo
  const msgs = [
    [100, 'Domínio completo.',   'Todas as respostas corretas. Excelente performance.'],
    [80,  'Muito bom.',          'Desempenho acima da média. Continue assim.'],
    [60,  'Satisfatório.',       'Revise os conceitos com dificuldade.'],
    [40,  'Em desenvolvimento.', 'Retome o material das disciplinas.'],
    [0,   'Precisa revisar.',    'Dedique mais tempo ao conteúdo estudado.'],
  ];
  const [, titulo, sub] = msgs.find(([min]) => pct >= min);
  if (Els.resultTitle) Els.resultTitle.textContent = modoRevisao ? 'Revisão concluída' : titulo;
  if (Els.resultSub)   Els.resultSub.textContent   = sub;

  // Anel SVG
  if (Els.ringFill) {
    const cor = pct >= 70 ? '#10D9A0' : pct >= 40 ? '#FFC857' : '#FF5F7E';
    Els.ringFill.style.stroke = cor;
    Els.ringFill.style.filter = `drop-shadow(0 0 8px ${cor})`;
    const dashOffset = 339.3 * (1 - pct / 100);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        Els.ringFill.style.strokeDashoffset = dashOffset;
      }),
    );
  }

  // Badge de revisão no topo
  const resultCard = Els.screenResult?.querySelector('.cf-result-inner') ?? Els.screenResult;
  resultCard?.querySelector('.cf-finish-revisao-badge')?.remove();
  if (modoRevisao && resultCard) {
    const badge = document.createElement('div');
    badge.className = 'cf-finish-revisao-badge';
    badge.innerHTML = `<span>⚠</span> Revisão de erros`;
    resultCard.insertBefore(badge, resultCard.firstChild);
  }

  // Botão "Jogar novamente" / "Repetir revisão"
  if (Els.btnRestart) {
    const novo = Els.btnRestart.cloneNode(true);
    Els.btnRestart.parentNode.replaceChild(novo, Els.btnRestart);
    Els.btnRestart = novo;

    if (modoRevisao) {
      novo.innerHTML = `
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" width="14" height="14">
          <path d="M13.5 2.5v3.5h-3.5"/>
          <path d="M13.3 6A6 6 0 1 0 12 12"/>
        </svg>
        Repetir revisão
      `;
      novo.classList.add('btn-restart--revisao');
    } else {
      novo.innerHTML = '↺ Jogar novamente';
      novo.classList.remove('btn-restart--revisao');
    }

    novo.addEventListener('click', onReiniciar);
  }

  // Painel de estatísticas por questão
  _renderEstatisticasQuestoes(lista, historico, historicoRevisao, modoRevisao);

  Els.screenResult?.classList.add('show');
}

/* ══════════════════════════════════════════════════════════
   REVISÃO CONCLUÍDA
   ══════════════════════════════════════════════════════════ */
export function mostrarRevisaoConcluida(onVoltar) {
  const screenResult = Els.screenResult;
  if (!screenResult) return;

  const inner         = screenResult.querySelector('.cf-result-inner') ?? screenResult;
  const scoreRingWrap = inner.querySelector('.score-ring-wrap');
  const resultActions = inner.querySelector('.result-actions');

  if (scoreRingWrap) {
    scoreRingWrap.innerHTML = `<div class="cf-revisao-concluida-emoji">🏆</div>`;
  }

  const titleEl = inner.querySelector('.result-title');
  const subEl   = inner.querySelector('.result-sub');
  if (titleEl) titleEl.textContent = 'Revisão concluída!';
  if (subEl)   subEl.textContent   = 'Você superou todos os erros desta sessão! 🎉';

  if (resultActions) {
    resultActions.innerHTML = `
      <button class="btn-restart" id="btn-revisao-concluida-voltar">← Voltar ao início</button>
    `;
    $('btn-revisao-concluida-voltar')?.addEventListener('click', onVoltar);
  }

  screenResult.classList.add('show');
}

/* ══════════════════════════════════════════════════════════
   ESTATÍSTICAS POR QUESTÃO (painel na tela de resultado)
   ══════════════════════════════════════════════════════════ */
function _renderEstatisticasQuestoes(lista, historico, historicoRevisao, modoRevisao) {
  const resultCard = Els.screenResult?.querySelector('.cf-result-inner') ?? Els.screenResult;
  if (!resultCard) return;

  resultCard.querySelector('.cf-stats-questoes')?.remove();

  const hist      = historicoRevisao;
  const temDados  = lista.some(q => hist[q.id]);
  if (!temDados && !modoRevisao) return;

  const painel = document.createElement('details');
  painel.className = 'cf-stats-questoes';
  painel.open = true;
  painel.innerHTML = `
    <summary>
      <span class="cf-sq-summary-icon">📊</span>
      <span class="cf-sq-summary-text">Progresso por questão</span>
      <span class="cf-sq-chevron">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M4 6l4 4 4-4"/>
        </svg>
      </span>
    </summary>
  `;

  const lista_el = document.createElement('div');
  lista_el.className = 'cf-sq-lista';

  for (const [idx, q] of lista.entries()) {
    const h             = hist[q.id];
    const histSessao    = historico[idx];
    const acertouAgora  = histSessao?.acertou === true;
    const errouAgora    = histSessao !== undefined && !histSessao.acertou;
    const enun = (q.frase ?? '').replace('______', '___').slice(0, 52) +
                 ((q.frase ?? '').length > 52 ? '…' : '');

    let rowHtml;
    let rowCls = '';

    if (modoRevisao) {
      const icone  = acertouAgora ? '✓' : errouAgora ? '✗' : '–';
      rowCls       = acertouAgora ? 'cf-sq-row--ok' : errouAgora ? 'cf-sq-row--err' : '';
      const barCls = acertouAgora ? 'cf-prog-bar--ok' : 'cf-prog-bar--critico';
      const barPct = acertouAgora ? 100 : 0;
      const label  = acertouAgora ? '100%' : errouAgora ? '0%' : '–';
      rowHtml = `
        <span class="cf-sq-icone">${icone}</span>
        <div class="cf-sq-body">
          <span class="cf-sq-enun">${enun}${acertouAgora ? ' <span class="cf-sq-superada" title="Acertou nesta rodada">⭐</span>' : ''}</span>
          <div class="cf-sq-prog-row">
            <div class="cf-prog-track">
              <div class="cf-prog-bar ${barCls}" style="width:${barPct}%"></div>
            </div>
            <span class="cf-sq-pct">${label}</span>
          </div>
        </div>`;
    } else {
      if (!h) continue;
      const { tentativas, acertos, erros } = h;
      const taxa    = Math.round((acertos / tentativas) * 100);
      const barCls  = taxa >= 80 ? 'cf-prog-bar--ok' : taxa >= 50 ? 'cf-prog-bar--med' : 'cf-prog-bar--critico';
      const icone   = acertouAgora ? '✓' : errouAgora ? '✗' : '–';
      rowCls        = acertouAgora ? 'cf-sq-row--ok' : errouAgora ? 'cf-sq-row--err' : '';
      rowHtml = `
        <span class="cf-sq-icone">${icone}</span>
        <div class="cf-sq-body">
          <span class="cf-sq-enun">${enun}</span>
          <div class="cf-sq-prog-row">
            <div class="cf-prog-track">
              <div class="cf-prog-bar ${barCls}" style="width:${taxa}%"></div>
            </div>
            <span class="cf-sq-pct">${taxa}%</span>
          </div>
          <span class="cf-sq-detalhe">
            ${acertos} acerto${acertos !== 1 ? 's' : ''} / ${tentativas} tentativa${tentativas !== 1 ? 's' : ''}
          </span>
        </div>`;
    }

    const row = document.createElement('div');
    row.className = `cf-sq-row ${rowCls}`.trim();
    row.innerHTML = rowHtml;
    lista_el.appendChild(row);
  }

  painel.appendChild(lista_el);
  resultCard.appendChild(painel);
}