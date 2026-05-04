/* ============================================================
   NEXUS STUDY — completar_frase.js

   DEPENDÊNCIAS:
   • DISC_CORES importado de shared/js/cores.js
   • completarFraseData lido de window.completarFraseData
     (exposto pelo <script src="completar_frase_data.js"> que
     já roda antes deste módulo).
   ============================================================ */

/* ── PARAMS DA URL ── */
const _p       = new URLSearchParams(location.search);
const URL_DISC = _p.get('disc') ?? '';
const URL_SEM  = _p.get('sem')  ?? '';

/* ── ACESSO AOS DADOS (expostos como global pelo data.js) ── */
function getDados() {
  return window.completarFraseData ?? {};
}

import { DISC_CORES }                from '../../../shared/js/cores.js';
import { getDisciplinasDeSemestre } from '../../../src/global.js';

function aplicarCorDisc(disc) {
  const cores = DISC_CORES[disc] ?? DISC_CORES._default;
  const r = document.documentElement.style;

  r.setProperty('--cor-tema',       cores.corTema);
  r.setProperty('--cor-tema-rgb',   cores.corTemaRgb);
  r.setProperty('--cor-tema-2',     cores.corTema2);
  r.setProperty('--cor-tema-2-rgb', cores.corTema2Rgb);

  r.setProperty('--disc-tema',      cores.corTema);
  r.setProperty('--disc-tema-rgb',  cores.corTemaRgb);
  r.setProperty('--disc-tema2',     cores.corTema2);
  r.setProperty('--disc-tema2-rgb', cores.corTema2Rgb);

  r.setProperty('--dt-rgb',         cores.corTemaRgb);
  r.setProperty('--dt2-rgb',        cores.corTema2Rgb);

  r.setProperty('--cf-accent',      cores.corTema);
  r.setProperty('--cf-accent-d',    `rgba(${cores.corTemaRgb}, 0.10)`);
  r.setProperty('--cf-accent-g',    `rgba(${cores.corTemaRgb}, 0.22)`);

  document.body.dataset.disc = disc;
}

/* ── SEMESTRES CONHECIDOS ── */
const _SEMESTRES_CONHECIDOS = ['2026.2', '2026.1', '2027.1'];

/* ── METADADOS DA DISCIPLINA ── */
function getDiscMeta(discId) {
  const semestres = [URL_SEM, ..._SEMESTRES_CONHECIDOS.filter(s => s !== URL_SEM)];
  for (const sem of semestres) {
    const lista = getDisciplinasDeSemestre(sem);
    const found = lista.find(d => d.id === discId);
    if (found) return found;
  }
  return { apelido: discId?.toUpperCase() ?? '—', emoji: '' };
}

/* ── TIMER ── */
const TIMER_TOTAL  = 30;
const TIMER_WARN   = 10;
const TIMER_DANGER = 5;

let _timerInterval = null;
let _timerRestante = TIMER_TOTAL;

function timerStart() {
  timerClear();
  _timerRestante = TIMER_TOTAL;
  timerRender(_timerRestante);

  _timerInterval = setInterval(() => {
    _timerRestante--;
    timerRender(_timerRestante);
    if (_timerRestante <= 0) {
      timerClear();
      timerExpirou();
    }
  }, 1000);
}

function timerClear() {
  if (_timerInterval) { clearInterval(_timerInterval); _timerInterval = null; }
}

function timerRender(seg) {
  const fill = document.getElementById('timer-bar-fill');
  const num  = document.getElementById('timer-num');
  if (!fill || !num) return;

  fill.style.width = (seg / TIMER_TOTAL * 100) + '%';
  num.textContent  = seg;

  const warn   = seg <= TIMER_WARN   && seg > TIMER_DANGER;
  const danger = seg <= TIMER_DANGER;

  fill.classList.toggle('timer--warn',   warn);
  fill.classList.toggle('timer--danger', danger);
  num.classList.toggle('timer--warn',    warn);
  num.classList.toggle('timer--danger',  danger);
}

function timerExpirou() {
  if (Estado.respondida) return;

  Estado.respondida        = true;
  Els.inputAnswer.disabled = true;
  Els.btnCheck.disabled    = true;

  const p = Estado.lista[Estado.indice];
  Els.inputAnswer.value = 'null';
  Els.inputAnswer.classList.add('state-err');
  Els.feedbackLine.className = 'feedback-line err show';
  Els.feedbackLine.innerHTML =
    `<span class="feedback-icon">⏱</span> Tempo esgotado — resposta: <span class="fb-answer">${p.resposta}</span>`;

  if (!Estado.historico[Estado.indice]) {
    Estado.erros++;
    Estado.historico[Estado.indice] = { digitado: '', acertou: false };
  }

  atualizarMeta();

  Els.btnNext.innerHTML = Estado.indice >= Estado.lista.length - 1
    ? 'Ver resultado <span class="arrow">→</span>'
    : 'Próxima <span class="arrow">→</span>';
  Els.btnNext.disabled = false;
}


/* ── PAUSA ── */
let _pausado = false;

function pausar() {
  if (_pausado || Estado.respondida) return;
  _pausado = true;
  timerClear();
  const overlay = document.getElementById('pause-overlay');
  const btnPause = document.getElementById('btn-pause');
  if (overlay) overlay.classList.remove('hidden');
  if (btnPause) btnPause.classList.add('btn-icon-ctrl--active');
}

function retomar() {
  if (!_pausado) return;
  _pausado = false;
  const overlay = document.getElementById('pause-overlay');
  const btnPause = document.getElementById('btn-pause');
  if (overlay) overlay.classList.add('hidden');
  if (btnPause) btnPause.classList.remove('btn-icon-ctrl--active');
  // Retoma o timer somente se a questão não foi respondida
  if (!Estado.respondida) {
    // Reconstrói o timer com o tempo que sobrou
    _timerInterval = setInterval(() => {
      _timerRestante--;
      timerRender(_timerRestante);
      if (_timerRestante <= 0) {
        timerClear();
        timerExpirou();
      }
    }, 1000);
  }
}

/* ── ESTADO ── */
const Estado = {
  lista:      [],
  indice:     0,
  acertos:    0,
  erros:      0,
  respondida: false,
  historico:  [],
};

/* ── SELETORES ── */
const $ = id => document.getElementById(id);

const Els = {};

/* ── UTILS ── */
function embaralhar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizar(txt) {
  return txt.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9/]/g, '')
    .trim();
}

/* ── TOPBAR ── */
function iniciarTopbar() {
  if (Els.shellSem)
    Els.shellSem.textContent = URL_SEM || '—';

  if (Els.shellDiscName) {
    const meta = getDiscMeta(URL_DISC);
    Els.shellDiscName.textContent = meta.apelido || URL_DISC.toUpperCase() || '—';
  }

  aplicarCorDisc(URL_DISC);

  const voltar = URL_SEM ? `../../jogo.html?sem=${URL_SEM}` : '../../jogo.html';
  if (Els.backBtn)       Els.backBtn.href      = voltar;
  if (Els.btnBackResult) Els.btnBackResult.href = voltar;
}

/* ── CONSTRUIR LISTA ── */
function construirLista() {
  const dados    = getDados();
  const semData  = dados[URL_SEM]    ?? {};
  const discData = semData[URL_DISC] ?? [];

  const fonte = discData.length
    ? discData
    : Object.values(semData).flat();

  Estado.lista = embaralhar(fonte.length ? fonte : []);
}

/* ── INICIAR ── */
function iniciar() {
  Estado.indice     = 0;
  Estado.acertos    = 0;
  Estado.erros      = 0;
  Estado.respondida = false;
  Estado.historico  = [];
  _pausado = false;

  construirLista();

  Els.screenResult.classList.remove('show');
  if (Els.gameCard) Els.gameCard.style.display = '';

  renderPergunta();
  renderDots();
}

/* ── RENDERIZAR PERGUNTA ── */
function renderPergunta() {
  const p    = Estado.lista[Estado.indice];
  const disc = getDiscMeta(URL_DISC);

  Els.gameCard.style.animation = 'none';
  void Els.gameCard.offsetWidth;
  Els.gameCard.style.animation = '';

  Els.discTag.innerHTML =
    `${disc.emoji
      ? `<span class="disc-emoji">${disc.emoji}</span>`
      : `<span class="disc-sigla">${disc.apelido?.split(' ')[0]?.toUpperCase() ?? URL_DISC.toUpperCase()}</span>`}
     ${disc.apelido ?? URL_DISC}`;
  Els.discTag.style.color = 'var(--cor-tema)';

  Els.semTag.textContent = URL_SEM || '—';

  const nk = normalizar(p.nivel);
  Els.nivelTag.textContent = p.nivel;
  Els.nivelTag.className   = `nivel-tag ${nk === 'facil' ? 'facil' : nk === 'medio' ? 'medio' : 'dificil'}`;

  Els.questionNum.textContent = `QUESTÃO ${String(Estado.indice + 1).padStart(2, '0')}`;

  Els.fraseTexto.innerHTML = p.frase.replace(
    '______',
    '<span class="lacuna">______</span>'
  );

  Els.letrasHint.textContent = p.letras;

  if (Els.dicaTexto) {
    Els.dicaTexto.textContent = p.dica ?? '';
    if (Els.dicaWrap) Els.dicaWrap.style.display = p.dica ? '' : 'none';
  }

  Els.inputAnswer.value     = '';
  Els.inputAnswer.className = 'input-answer';
  Els.inputAnswer.disabled  = false;
  Els.inputAnswer.focus();

  Els.btnCheck.disabled      = false;
  Els.feedbackLine.className = 'feedback-line';

  Els.btnNext.disabled = true;
  Els.btnNext.innerHTML = Estado.indice >= Estado.lista.length - 1
    ? 'Ver resultado <span class="arrow">→</span>'
    : 'Próxima <span class="arrow">→</span>';
  if (Els.btnPrev) Els.btnPrev.disabled = Estado.indice === 0;

  const hist = Estado.historico[Estado.indice];

  // FIX: timer só inicia se questão ainda não foi respondida
  if (!hist) {
    timerStart();
  } else {
    timerClear();
    timerRender(0);
  }

  if (hist) {
    Estado.respondida        = true;
    Els.inputAnswer.value    = hist.digitado;
    Els.inputAnswer.disabled = true;
    Els.btnCheck.disabled    = true;
    Els.btnNext.disabled     = false;

    if (hist.acertou) {
      Els.inputAnswer.classList.add('state-ok');
      Els.feedbackLine.className = 'feedback-line ok show';
      Els.feedbackLine.innerHTML = `<span class="feedback-icon">✓</span> Resposta correta.`;
    } else {
      Els.inputAnswer.classList.add('state-err');
      Els.feedbackLine.className = 'feedback-line err show';
      Els.feedbackLine.innerHTML =
        `<span class="feedback-icon">✗</span> Resposta correta: <span class="fb-answer">${p.resposta}</span>`;
    }
  } else {
    Estado.respondida = false;
  }

  atualizarMeta();
}

/* ── VERIFICAR ── */
function verificar() {
  if (Estado.respondida) return;

  const p       = Estado.lista[Estado.indice];
  const digitado = Els.inputAnswer.value.trim();
  if (!digitado) {
    Els.inputAnswer.classList.add('shake');
    Els.inputAnswer.addEventListener('animationend',
      () => Els.inputAnswer.classList.remove('shake'), { once: true });
    return;
  }

  Estado.respondida        = true;
  Els.inputAnswer.disabled = true;
  Els.btnCheck.disabled    = true;

  timerClear();
  const acertou = normalizar(digitado) === normalizar(p.resposta);

  if (!Estado.historico[Estado.indice]) {
    if (acertou) Estado.acertos++;
    else         Estado.erros++;
  }

  if (acertou) {
    Els.inputAnswer.classList.add('state-ok');
    Els.feedbackLine.className = 'feedback-line ok show';
    Els.feedbackLine.innerHTML = `<span class="feedback-icon">✓</span> Resposta correta.`;
  } else {
    Els.inputAnswer.classList.add('state-err');
    Els.feedbackLine.className = 'feedback-line err show';
    Els.feedbackLine.innerHTML =
      `<span class="feedback-icon">✗</span> Resposta correta: <span class="fb-answer">${p.resposta}</span>`;
  }

  Estado.historico[Estado.indice] = { digitado, acertou };

  atualizarMeta();

  const ultima = Estado.indice >= Estado.lista.length - 1;
  Els.btnNext.innerHTML = ultima
    ? 'Ver resultado <span class="arrow">→</span>'
    : 'Próxima <span class="arrow">→</span>';
  Els.btnNext.disabled = false;
}

/* ── AVANÇAR ── */
function avancar() {
  Estado.indice++;
  Estado.indice >= Estado.lista.length ? mostrarResultado() : renderPergunta();
}

/* ── META ── */
function atualizarMeta() {
  const total  = Estado.lista.length;
  const feitas = Estado.indice + (Estado.respondida ? 1 : 0);
  const pct    = total > 0 ? (feitas / total) * 100 : 0;

  if (Els.progressFill) Els.progressFill.style.width  = pct + '%';
  Els.progressLabel.textContent = `${feitas} / ${total}`;
  Els.progressPct.textContent   = Math.round(pct) + '%';
  Els.chipOk.textContent        = `✓ ${Estado.acertos}`;
  Els.chipErr.textContent       = `✗ ${Estado.erros}`;
  renderDots();
}

/* ── BOLINHAS ── */
function renderDots() {
  const container = document.getElementById('cf-dots');
  if (!container) return;
  container.innerHTML = '';
  Estado.lista.forEach((_, i) => {
    const hist      = Estado.historico[i];
    const respondida = hist !== undefined;
    const acertou   = respondida && hist.acertou;
    const atual     = i === Estado.indice;

    const dot = document.createElement('span');
    dot.className = 'cf-dot ' + (
      atual       ? 'cf-dot--current' :
      !respondida ? ''                :
      acertou     ? 'cf-dot--correct' : 'cf-dot--wrong'
    );
    dot.setAttribute('aria-label', `Questão ${i + 1}`);
    container.appendChild(dot);
  });
}

/* ── RESULTADO ── */
function mostrarResultado() {
  timerClear();
  Els.gameCard.style.display = 'none';
  if (Els.navBar) Els.navBar.classList.add('hidden');
  Els.progressFill.style.width = '100%';

  const total = Estado.lista.length;
  const pct   = total > 0 ? Math.round((Estado.acertos / total) * 100) : 0;

  Els.resultPct.textContent = pct + '%';

  const msgs = [
    [100, 'Domínio completo.',   'Todas as respostas corretas. Excelente performance.'],
    [80,  'Muito bom.',          'Desempenho acima da média. Continue assim.'],
    [60,  'Satisfatório.',       'Revise os conceitos com dificuldade.'],
    [40,  'Em desenvolvimento.', 'Retome o material das disciplinas.'],
    [0,   'Precisa revisar.',    'Dedique mais tempo ao conteúdo estudado.'],
  ];
  const [, titulo, sub] = msgs.find(([min]) => pct >= min);
  Els.resultTitle.textContent = titulo;
  Els.resultSub.textContent   = sub;
  Els.resultOk.textContent    = Estado.acertos;
  Els.resultErr.textContent   = Estado.erros;

  const cor = pct >= 70 ? '#10D9A0' : pct >= 40 ? '#FFC857' : '#FF5F7E';
  const dashOffset = 339.3 * (1 - pct / 100);
  Els.ringFill.style.stroke = cor;
  Els.ringFill.style.filter = `drop-shadow(0 0 8px ${cor})`;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      Els.ringFill.style.strokeDashoffset = dashOffset;
    })
  );

  Els.screenResult.classList.add('show');
}

/* ── TELAS ── */
function mostrarIntro() {
  // FIX: para o timer ao voltar para a intro
  timerClear();

  const screenIntro = $('screen-intro');
  const gameLayout  = $('game-layout');
  if (screenIntro) screenIntro.style.display = '';
  if (gameLayout)  gameLayout.style.display  = 'none';

  const introSem = $('intro-sem-label');
  const meta = getDiscMeta(URL_DISC);

  const chipDisc = document.querySelector('.cf-intro-card__chip--disc');
  if (chipDisc) {
    chipDisc.innerHTML = meta.emoji
      ? `<span style="font-size:1em;line-height:1">${meta.emoji}</span>
         <span id="intro-disc-name">${meta.apelido || URL_DISC.toUpperCase() || '—'}</span>`
      : `<svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" style="opacity:.75">
           <path d="M2 3h12v1H2zm0 3h8v1H2zm0 3h10v1H2zm0 3h6v1H2z"/>
         </svg>
         <span id="intro-disc-name">${meta.apelido || URL_DISC.toUpperCase() || '—'}</span>`;
  }

  if (introSem) introSem.textContent = URL_SEM || '—';

  const totalEl = $('intro-total-questoes');
  if (totalEl) {
    const dados    = getDados();
    const semData  = dados[URL_SEM]    ?? {};
    const discData = semData[URL_DISC] ?? [];
    const fonte = discData.length
      ? discData
      : Object.values(semData).flat();
    totalEl.textContent = fonte.length;
  }
}

function iniciarJogo() {
  const screenIntro = $('screen-intro');
  const gameLayout  = $('game-layout');
  if (screenIntro) screenIntro.style.display = 'none';
  if (gameLayout)  gameLayout.style.display  = '';
  iniciar();
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  Object.assign(Els, {
    gameCard:        $('game-card'),
    screenResult:    $('screen-result'),
    fraseTexto:      $('frase-texto'),
    letrasHint:      $('letras-hint'),
    dicaWrap:        $('dica-wrap'),
    dicaTexto:       $('dica-texto'),
    discTag:         $('disc-tag'),
    nivelTag:        $('nivel-tag'),
    semTag:          $('sem-tag'),
    questionNum:     $('question-num'),
    inputAnswer:     $('input-answer'),
    btnCheck:        $('btn-check'),
    feedbackLine:    $('feedback-line'),
    btnNext:         $('btn-next'),
    chipOk:          $('chip-ok'),
    chipErr:         $('chip-err'),
    progressFill:    $('progress-fill'),
    progressLabel:   $('progress-label'),
    progressPct:     $('progress-pct'),
    resultPct:       $('result-pct'),
    resultTitle:     $('result-title'),
    resultSub:       $('result-sub'),
    resultOk:        $('result-ok'),
    resultErr:       $('result-err'),
    btnPrev:         $('btn-prev'),
    navBar:          $('nav-bar'),
    btnRestart:      $('btn-restart'),
    ringFill:        $('ring-fill'),
    shellDiscName:   $('shell-disc-name'),
    shellSem:        $('shell-sem'),
    backBtn:         $('back-btn'),
    btnBackResult:   $('btn-back-result'),
    btnHome:         $('btn-home'),
  });

  iniciarTopbar();
  mostrarIntro();


  // Botão pausar
  const btnPauseEl = $('btn-pause');
  if (btnPauseEl) btnPauseEl.addEventListener('click', pausar);

  // Botão retomar (dentro do modal)
  const btnResumeEl = $('btn-resume');
  if (btnResumeEl) btnResumeEl.addEventListener('click', retomar);

  // Atalho de teclado P / Escape
  document.addEventListener('keydown', e => {
    if (e.key === ' ' && document.activeElement !== Els.inputAnswer) {
      e.preventDefault();
      if (_pausado) retomar(); else pausar();
    }
    if (e.key === 'Escape' && _pausado) retomar();
  });

  // Começar
  const btnStart = $('btn-start');
  if (btnStart) btnStart.addEventListener('click', iniciarJogo);

  // Botão Home — volta para a intro (para o timer, reseta estado)
  if (Els.btnHome) {
    Els.btnHome.addEventListener('click', () => {
      Els.screenResult.classList.remove('show');
      if (Els.navBar) Els.navBar.classList.remove('hidden');
      if (Els.gameCard) Els.gameCard.style.display = '';
      mostrarIntro();
    });
  }

  // Reiniciar (da tela de resultado)
  Els.btnRestart.addEventListener('click', () => {
    Els.screenResult.classList.remove('show');
    if (Els.navBar) Els.navBar.classList.remove('hidden');
    mostrarIntro();
  });

  Els.btnCheck.addEventListener('click', verificar);
  Els.btnNext.addEventListener('click', avancar);

  if (Els.btnPrev) {
    Els.btnPrev.addEventListener('click', () => {
      if (Estado.indice > 0) {
        Estado.indice--;
        renderPergunta();
      }
    });
  }

  Els.inputAnswer.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      if (!Estado.respondida) verificar();
      else avancar();
    }
  });
});