/* ============================================================
   NEXUS STUDY — quiz/template/template_init.js

   Responsabilidades:
     1. Lê o contexto completo da URL (?disc=&modo=&sem=)
     2. Atualiza o global.js (setSemestre, setDisciplina, setPagina)
     3. Atualiza os textos do DOM
     4. Corrige o back-btn
     5. Injeta o nav-float (os binds dos botões ficam todos no quiz_engine.js)
     6. Carrega o arquivo de conteúdo e depois o quiz_engine.js

   CORREÇÕES APLICADAS:
     [FIX 1] Removidos os addEventListener de delegação do nav-float
             (#restartButton → #restart e #revealButton → #reveal).
             O quiz_engine.js já faz o bind direto em ambos os IDs,
             então a delegação causava disparo duplo das funções.
     [FIX 2] replace('_', ' ') → replace(/_/g, ' ')
             Garante que todos os underscores sejam substituídos,
             não apenas o primeiro (ex: eng_soft_1 → ENG SOFT 1).
     [FIX 4] DISC_MAP local removido.
             As disciplinas agora vêm exclusivamente do global.js
             (getDisciplinasDeSemestre). Adicionar uma disciplina nova
             exige alteração em apenas um lugar.
     [FIX 5] back-btn escrito apenas aqui.
             O bloco equivalente foi removido do quiz_engine.js para
             eliminar a escrita dupla do mesmo href.
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

/* ── ATUALIZA O GLOBAL ────────────────────────────────────── */
setSemestre(semestre);
setDisciplina(disc);
setPagina('QUIZ');

/* ── RESOLVE INFO DE DISPLAY A PARTIR DO GLOBAL ──────────── */
//
// [FIX 4] Fonte única de verdade: global.js → DISCIPLINAS.
// Nenhum DISC_MAP local. Nome, arquivo e emoji vêm todos daqui.
//
const lista      = getDisciplinasDeSemestre(semestre);
const discInfo   = lista.find(d => d.id === disc);

// Fallback defensivo: se o disc da URL não existir no semestre,
// usa a primeira disciplina disponível (evita tela em branco).
const info       = discInfo ?? lista[0] ?? { id: disc, nome: disc, arquivo: disc, emoji: '📚' };

const tipoLabel  = modo === 'ava' ? 'Avaliação AVA' : 'Questões Práticas';

/* ── ATUALIZA TEXTOS NO DOM ───────────────────────────────── */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

setText('disc-emoji',      info.emoji);
setText('disc-nome',       info.nome);

// [FIX 2] Usa regex global /_/g para substituir TODOS os underscores,
// não apenas o primeiro. Ex: "banco_dados" → "BANCO DADOS"
setText('breadcrumb-disc', disc.toUpperCase().replace(/_/g, ' '));

setText('page-footer',     `Nexus Study · ${info.nome} · ${tipoLabel}`);

/* ── CORRIGE BACK-BTN ─────────────────────────────────────── */
//
// [FIX 5] Único ponto de escrita do href do back-btn.
// O bloco equivalente foi removido do quiz_engine.js.
//
const backBtn = document.querySelector('.back-btn');
if (backBtn) {
  backBtn.href = `../disciplinas/${disc}.html?sem=${semestre}`;
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
  <button id="btn-step-prev" class="nav-btn" title="Questão anterior" type="button" style="display:none">
    <i class="fas fa-chevron-left" aria-hidden="true"></i>
  </button>
  <button id="btn-step-next" class="nav-btn" title="Próxima questão"  type="button" style="display:none">
    <i class="fas fa-chevron-right" aria-hidden="true"></i>
  </button>
`;
document.body.appendChild(nav);

/*
  [FIX 1] DELEGAÇÃO REMOVIDA INTENCIONALMENTE.
  ─────────────────────────────────────────────
  Os blocos abaixo foram removidos porque o quiz_engine.js já faz o bind
  direto nos IDs 'restart', 'restartButton', 'reveal' e 'revealButton'.
  Manter a delegação aqui causava disparo duplo das funções reiniciar()
  e revelar() a cada clique no nav-float.

  ❌ REMOVIDO:
  nav.querySelector('#restartButton')?.addEventListener('click', () =>
    document.getElementById('restart')?.click()
  );
  nav.querySelector('#revealButton')?.addEventListener('click', () =>
    document.getElementById('reveal')?.click()
  );
*/

/* ── CARREGA CONTEÚDO → ENGINE ────────────────────────────── */
const s = document.createElement('script');
s.src   = `../conteudo/${info.arquivo}.js`;
s.onerror = () => {
  const c = document.getElementById('quiz-container');
  if (c) c.innerHTML = `<div style="padding:2rem;text-align:center;color:#f87171;">⚠️ Arquivo não encontrado: ${info.arquivo}.js</div>`;
};
s.onload = () => {
  const engine = document.createElement('script');
  engine.src   = '../quiz_engine.js';
  document.body.appendChild(engine);
};
document.head.appendChild(s);