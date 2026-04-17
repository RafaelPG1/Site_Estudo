/* ============================================================
   NEXUS STUDY — quiz/template/template_init.js

   Responsabilidades:
     1. Lê o contexto completo da URL (?disc=&modo=&sem=)
     2. Atualiza o global.js (setSemestre, setDisciplina, setPagina)
     3. Atualiza os textos do DOM
     4. Confirma o back-btn
     5. Expõe window.NEXUS_URL_BACK para o quiz_engine.js
     6. Injeta o nav-float (binds dos botões ficam no quiz_engine.js)
     7. Carrega o arquivo de conteúdo e depois o quiz_engine.js
   ============================================================ */

import {
  setPagina,
  setDisciplina,
  setSemestre,
  getDisciplinasDeSemestre,
} from '../../global.js';
import Storage from '../../storage.js';

/* ── EXPÕE NO WINDOW PARA SCRIPTS CLÁSSICOS (quiz_engine.js) ── */
window.NexusStorage = Storage;

/* ── LÊ CONTEXTO DA URL ───────────────────────────────────── */
const params   = new URLSearchParams(location.search);
const disc     = params.get('disc') || 'poo';
const modo     = params.get('modo') || 'questoes';
const semestre = params.get('sem')  || '2026.2';

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

const info      = discInfo ?? lista[0] ?? { id: disc, nome: disc, arquivo: disc, emoji: '📚' };
const tipoLabel = modo === 'ava' ? 'Avaliação AVA' : 'Questões Práticas';

/* ── ATUALIZA TEXTOS NO DOM ───────────────────────────────── */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

setText('disc-emoji',      info.emoji);
setText('disc-nome',       info.nome);
setText('breadcrumb-disc', info.id.toUpperCase().replace(/_/g, ' '));
setText('page-footer',     `Nexus Study · ${info.nome} · ${tipoLabel}`);

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
if (backBtn) {
  backBtn.href = urlBack;
}

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

`;
document.body.appendChild(nav);

/* ── CARREGA CONTEÚDO → ENGINE ────────────────────────────── */
const s = document.createElement('script');
s.src   = `../conteudo/${ano}/${semestre}/${info.arquivo}.js`;
s.onerror = () => {
  const c = document.getElementById('quiz-container');
  if (c) c.innerHTML = `<div style="padding:2rem;text-align:center;color:#f87171;">⚠️ Arquivo não encontrado: ${ano}/${semestre}/${info.arquivo}.js</div>`;
};
s.onload = () => {
  const engine = document.createElement('script');
  engine.src   = '../quiz_engine.js';
  document.body.appendChild(engine);
};
document.head.appendChild(s);

/* ── PROPAGA ?sem= NO LOGO ────────────────────────────────── */
const logoLink = document.querySelector('.header__logo[href*="quiz.html"]');
if (logoLink) {
  const u = new URL(logoLink.href, location.href);
  u.searchParams.set('sem', semestre);
  logoLink.href = u.toString();
}