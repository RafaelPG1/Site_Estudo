/* ============================================================
   NEXUS STUDY — quiz/template/template_init.js

   Responsabilidades:
     1. Lê o contexto completo da URL (?disc=&modo=&sem=)
     2. Atualiza o global.js (setSemestre, setDisciplina, setPagina)
     3. Aplica as cores da disciplina + acento do modo via CSS vars
     4. Atualiza os textos do DOM (título, breadcrumb, footer…)
     5. Confirma o back-btn
     6. Expõe window.NEXUS_URL_BACK para o quiz_engine.js
     7. Injeta o nav-float (binds dos botões ficam no quiz_engine.js)
     8. Carrega o arquivo de conteúdo e depois o quiz_engine.js

   ADICIONAR UM NOVO MODO:
     1. Adicione uma entrada em MODOS_CONFIG abaixo.
     2. Se o acento deve ser diferente das duas cores da disciplina,
        defina accent/accentRgb fixos — caso contrário, use
        corTema ou corTema2 que já vêm do DISC_CORES.
     Só isso. Nenhum outro arquivo precisa mudar.
   ============================================================ */

import {
  setPagina,
  setDisciplina,
  setSemestre,
  getDisciplinasDeSemestre,
} from '../../src/global.js';
import Storage from '../../src/storage.js';
import { DISC_CORES } from '../../shared/js/cores.js';
import { sincronizarSemNaURL, propagarSemNosLinks } from '../../shared/js/url.js';
import { setText, setHTML } from '../../shared/js/dom.js';
import { aplicarCoresDisciplina } from '../../shared/js/theme.js';

import { carregarRespostasQuiz, salvarRespostasQuiz, limparRespostasQuiz } from '../../src/firebase.js';

/* ── EXPÕE NO WINDOW PARA SCRIPTS CLÁSSICOS (quiz_engine.js) ── */
window.NexusStorage = Storage;
/* ── EXPÕE FIREBASE PARA O QUIZ_ENGINE (IIFE sem módulo) ── */
window.NexusFirebase = { salvarRespostasQuiz, carregarRespostasQuiz, limparRespostasQuiz };
/* ── LÊ CONTEXTO DA URL ───────────────────────────────────── */
const params   = new URLSearchParams(location.search);
const disc     = params.get('disc') || 'poo';
const modo     = params.get('modo') || 'questoes';
const semestre = params.get('sem')  || '2026.2';

/* ── EXPÕE CONTEXTO DO QUIZ PARA O ENGINE ─────────────────── */
window.__NEXUS_QUIZ_DISC__     = disc;
window.__NEXUS_QUIZ_MODO__     = modo;
window.__NEXUS_QUIZ_SEMESTRE__ = semestre;
// window.NexusStorage já é exposto logo no início do arquivo ✓
window.TIPO_QUIZ = modo;

/* ── EXTRAI O ANO DO SEMESTRE ─────────────────────────────── */
const ano = semestre.split('.')[0];

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
/*
   Cada modo define:
     breadcrumb  → texto no breadcrumb do header
     h1          → HTML do <h1> (pode conter <em>)
     label       → texto para o footer e <title>
     getAccent   → função que recebe as cores da disciplina
                   e retorna { accent, accentRgb }
                   Use corTema para acento primário (ex: ava)
                   Use corTema2 para acento secundário (ex: questoes)
                   Ou defina uma cor fixa para modos especiais.

   Para adicionar um novo modo, basta adicionar uma entrada aqui.
*/

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

const cores = DISC_CORES[info.arquivo];
if (cores) {
  const root   = document.documentElement;
  const accent = modoConfig.getAccent(cores);

  /* Acento unificado — consumido pelo template.css */
  root.style.setProperty('--accent',     accent.accent);
  root.style.setProperty('--accent-rgb', accent.accentRgb);
} else {
  console.warn(`[template_init] Sem cores definidas para "${info.arquivo}"`);
}



setText('disc-emoji',      info.emoji);
setText('disc-nome',       info.nome);
setText('breadcrumb-disc', info.id.toUpperCase().replace(/_/g, ' '));
setText('breadcrumb-modo', modoConfig.breadcrumb);
setHTML('page-title-h1',   modoConfig.h1);
setText('page-footer',     `Nexus Study · ${info.nome} · ${modoConfig.label}`);

/* Atualiza o <title> da aba */
document.title = `${modoConfig.breadcrumb} — Nexus Study`;

/* Marca o modo no body para eventual uso via CSS ([data-modo="ava"]) */
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

/* ── CARREGA CONTEÚDO → ENGINE ────────────────────────────── */
/* ── CARREGA CONTEÚDO → UI → ENGINE ──────────────────────── */
/*
   Ordem obrigatória:
     1. arquivo de conteúdo (define window.questoes)
     2. quiz_ui.js          (define window.QuizUI)
     3. quiz_engine.js      (usa window.QuizUI)
*/
const s = document.createElement('script');
s.src   = `../../content/quiz/${ano}/${semestre}/ques_${info.arquivo}.js`;
s.onerror = () => {
  const c = document.getElementById('quiz-container');
  if (c) c.innerHTML = `<div style="padding:2rem;text-align:center;color:#f87171;">⚠️ Arquivo não encontrado: ${ano}/${semestre}/${info.arquivo}.js</div>`;
};
s.onload = () => {
  const ui = document.createElement('script');
  ui.src = '../js/quiz_ui.js';

  ui.onload = async () => {
    // Pré-carrega respostas do Firebase ANTES do engine bootar
    const usuario = Storage.get('usuario', null);
    if (usuario?.uid) {
      try {
        const fbDados = await carregarRespostasQuiz(usuario.uid, semestre, modo, disc);
        window.__NEXUS_FIREBASE_RESPOSTAS__ = fbDados ?? null;
        console.log('[template_init] Firebase pré-carga:', fbDados ? 'dados encontrados' : 'sem dados');
      } catch (e) {
        window.__NEXUS_FIREBASE_RESPOSTAS__ = null;
        console.warn('[template_init] Falha na pré-carga Firebase:', e);
      }
    } else {
      window.__NEXUS_FIREBASE_RESPOSTAS__ = null;
      console.log('[template_init] Usuário não logado — Firebase pulado');
    }

    const engine = document.createElement('script');
    engine.src = '../js/quiz_engine.js';
    document.body.appendChild(engine);
  };

  document.head.appendChild(ui);
};
document.head.appendChild(s);

propagarSemNosLinks(semestre, ['.header__logo[href*="quiz.html"]']);