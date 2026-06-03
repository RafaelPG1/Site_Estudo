/* ============================================================
   NEXUS STUDY — quiz/template/template_init.js
   ============================================================ */

import {
  setPagina,
  setDisciplina,
  setSemestre,
  getDisciplinasDeSemestre,
  SEMESTRES,
} from '../../src/global.js';
import Storage from '../../src/storage.js';
import { DISC_CORES } from '../../shared/js/themes/cores.js';
import { sincronizarSemNaURL, propagarSemNosLinks } from '../../shared/js/utils/url.js';
import { setText, setHTML } from '../../shared/js/utils/dom.js';
import { aplicarCoresDisciplina } from '../../shared/js/themes/theme.js';
import { injetarLogo } from '../../shared/js/utils/logo.js';
import { Sound, audio, installAudioRecovery, playSound } from '../../shared/js/audio/audio-api.js'; // ← MIGRADO

import { carregarRespostasQuiz, salvarRespostasQuiz, limparRespostasQuiz } from '../../src/firebase.js';

/* ── EXPÕE NO WINDOW PARA SCRIPTS CLÁSSICOS (quiz_engine.js) ── */
window.NexusStorage = Storage;
/* ── EXPÕE FIREBASE PARA O QUIZ_ENGINE (IIFE sem módulo) ── */
window.NexusFirebase = { salvarRespostasQuiz, carregarRespostasQuiz, limparRespostasQuiz };

/* Expõe playSound para quiz_engine.js (IIFE clássica sem acesso a módulos ES) */
window.__nexusPlaySound = playSound;
/* ── LÊ CONTEXTO DA URL ───────────────────────────────────── */
const params   = new URLSearchParams(location.search);
const disc     = params.get('disc') || 'poo';
const modo     = params.get('modo') || 'questoes';
const semestre = params.get('sem') || SEMESTRES[0];

/* ── EXPÕE CONTEXTO DO QUIZ PARA O ENGINE ─────────────────── */
window.__NEXUS_QUIZ_DISC__     = disc;
window.__NEXUS_QUIZ_MODO__     = modo;
window.__NEXUS_QUIZ_SEMESTRE__ = semestre;
window.TIPO_QUIZ = modo;

/* ── EXTRAI O ANO DO SEMESTRE ─────────────────────────────── */


/* ── ATUALIZA O GLOBAL ────────────────────────────────────── */
setSemestre(semestre);
setDisciplina(disc);
setPagina('QUIZ');

/* ── RESOLVE INFO DE DISPLAY A PARTIR DO GLOBAL ──────────── */
const lista    = getDisciplinasDeSemestre(semestre);
const discInfo = lista.find(d => d.id === disc);

if (!discInfo) {
  console.warn(
    `[template_init] Disciplina "${disc}" não encontrada em ${semestre}.` +
    ` Usando fallback: "${lista[0]?.id ?? 'nenhuma'}".`
  );
}

const info = discInfo ?? lista[0] ?? { id: disc, nome: disc, arquivo: disc, emoji: '📚' };

/* ── CONFIGURAÇÃO DE MODOS ────────────────────────────────── */
const MODOS_CONFIG = {
  ava: {
    breadcrumb: 'AVA',
    h1:         'Avaliação <em>AVA</em>',
    label:      'Avaliação AVA',
    getAccent:  (cores) => ({ accent: cores.corTema, accentRgb: cores.corTemaRgb }),
  },
  questoes: {
    breadcrumb: 'Questões',
    h1:         'Questões <em>Práticas</em>',
    label:      'Questões Práticas',
    getAccent:  (cores) => ({ accent: cores.corTema, accentRgb: cores.corTemaRgb }),
  },
  enade: {
    breadcrumb: 'ENADE',
    h1:         'Questões <em>ENADE</em>',
    label:      'Questões ENADE',
    getAccent:  (cores) => ({ accent: cores.corTema, accentRgb: cores.corTemaRgb }),
  },
  fixacao: {
    breadcrumb: 'Fixação',
    h1:         'Questões de <em>Fixação</em>',
    label:      'Fixação',
    getAccent:  (cores) => ({ accent: cores.corTema, accentRgb: cores.corTemaRgb }),
  },
};

const modoConfig = MODOS_CONFIG[modo] ?? MODOS_CONFIG.questoes;

/* ── APLICA CORES DA DISCIPLINA + ACENTO DO MODO ─────────── */
aplicarCoresDisciplina(info.arquivo, DISC_CORES);

document.addEventListener('DOMContentLoaded', async () => {
injetarLogo('#header-logo-wrap');

  Sound.init();
  installAudioRecovery({ Sound, audio });

  await Sound.waitUntilReady();

  document.querySelector('.back-btn')
    ?.addEventListener('click', () => playSound('click', 'quiz'));
});

const cores = DISC_CORES[info.arquivo];
if (cores) {
  const root   = document.documentElement;
  const accent = modoConfig.getAccent(cores);
  root.style.setProperty('--accent',     accent.accent);
  root.style.setProperty('--accent-rgb', accent.accentRgb);
} else {
  console.warn(`[template_init] Sem cores definidas para "${info.arquivo}"`);
}

setText('disc-emoji',      info.emoji);
setText('disc-nome',       info.nome);
setHTML('page-title-h1',   modoConfig.h1);
setText('page-footer',     `Nexus Study · ${info.nome} · ${modoConfig.label}`);

const semBadge = document.getElementById('header-sem-badge');
if (semBadge) semBadge.textContent = semestre;

document.title = `${modoConfig.breadcrumb} — Nexus Study`;

document.body.dataset.disciplina = info.arquivo;
document.body.dataset.modo       = modo;

/* ── CONFIRMA BACK-BTN E EXPÕE URL DE VOLTA ──────────────── */
const urlBack = `../disciplinas/${ano}/${info.arquivo}.html?sem=${semestre}`;
window.NEXUS_URL_BACK = urlBack;

const earlyHref = window.__NEXUS_BACK_HREF_EARLY__;
if (earlyHref && earlyHref !== urlBack) {
  console.info(
    `[template_init] back-btn corrigido pelo módulo.\n` +
    `  Inline : ${earlyHref}\n` +
    `  Módulo : ${urlBack}`
  );
}

const backBtn = document.querySelector('.back-btn');
if (backBtn) backBtn.href = urlBack;

/* ── INJETA NAV-FLOAT ─────────────────────────────────────── */
const nav = document.createElement('nav');
nav.className = 'nav-float';
nav.setAttribute('aria-label', 'Navegação rápida');
nav.innerHTML = `
  <button id="btn-up"   class="nav-btn" title="Ir ao topo"  type="button"><i class="fas fa-arrow-up"    aria-hidden="true"></i></button>
  <button id="btn-left" class="nav-btn" title="Voltar"      type="button"><i class="fas fa-rotate-left" aria-hidden="true"></i></button>
  <button id="btn-down" class="nav-btn" title="Ir ao final" type="button"><i class="fas fa-arrow-down"  aria-hidden="true"></i></button>
  <div class="nav-divider" aria-hidden="true"></div>
  <button id="restartButton" class="nav-btn" title="Reiniciar"         type="button"><i class="fas fa-rotate-right" aria-hidden="true"></i></button>
  <button id="revealButton"  class="nav-btn" title="Revelar respostas" type="button"><i class="fas fa-eye"          aria-hidden="true"></i></button>
  <div class="nav-divider" aria-hidden="true"></div>
  <button id="btn-toggle-modo" class="nav-btn btn-toggle-modo" title="Modo Step (uma questão por vez)" type="button">
    <i class="fas fa-layer-group" aria-hidden="true"></i>
  </button>
  <div class="nav-divider" aria-hidden="true"></div>
  <button id="btn-legenda" class="nav-btn btn-legenda" title="Informações" type="button">
    <i class="fas fa-circle-info" aria-hidden="true"></i>
  </button>
`;
document.body.appendChild(nav);

/* ── SOM NOS BOTÕES DO NAV-FLOAT ──────────────────────────── */
Sound.waitUntilReady().then(() => {
  [
    'btn-up', 'btn-left', 'btn-down',
    'restartButton', 'revealButton',
    'btn-toggle-modo', 'btn-legenda',
  ].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('mouseenter', () => playSound('hover', 'quiz'));
    btn.addEventListener('click',      () => playSound('click', 'quiz'));
  });
});

/* ── CARREGA CONTEÚDO + UI + FIREBASE EM PARALELO → ENGINE ── */
function _loadScript(src) {
  return new Promise(function (resolve, reject) {
    var s = document.createElement('script');
    s.src     = src;
    s.onload  = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}
const ano     = semestre.split('.')[0];
const _apPart = semestre.includes('-') ? semestre.split('-')[1] : null;
const _period = semestre.includes('-') ? semestre.split('-')[0] : semestre;
const contentSrc = _apPart
  ? `../../content/quiz/${ano}/${_period}/${_apPart}/ques_${info.arquivo}.js`
  : `../../content/quiz/${ano}/${semestre}/ques_${info.arquivo}.js`;

const uiSrc      = '../js/quiz_ui.js';

const usuario = Storage.get('usuario', null);

if (usuario?.uid) {
  Promise.race([
    carregarRespostasQuiz(usuario.uid, semestre, modo, disc)
      .then(data => { window.__NEXUS_FIREBASE_RESPOSTAS__ = data ?? null; })
      .catch(()  => { window.__NEXUS_FIREBASE_RESPOSTAS__ = null; }),
    new Promise(resolve => setTimeout(resolve, 3000)),
  ]);
} else {
  window.__NEXUS_FIREBASE_RESPOSTAS__ = null;
}

Promise.all([
  _loadScript(contentSrc).catch(() => {
    const c = document.getElementById('quiz-container');
    if (c) c.innerHTML =
      `<div style="padding:2rem;text-align:center;color:#f87171;">` +
      `⚠️ Arquivo não encontrado: ${ano}/${semestre}/${info.arquivo}.js</div>`;
    return Promise.reject('content-not-found');
  }),
  _loadScript(uiSrc),
])
.then(() => {
  const engine = document.createElement('script');
  engine.src = '../js/quiz_engine.js';
  document.body.appendChild(engine);
})
.catch(err => {
  if (err !== 'content-not-found') console.error('[template_init] Falha:', err);
});

propagarSemNosLinks(semestre, ['.header__logo[href*="quiz.html"]']);