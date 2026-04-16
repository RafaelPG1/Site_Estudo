/* ============================================================
   NEXUS STUDY — quiz/template/template_init.js
   ============================================================ */

import { setPagina } from '../../global.js';
import Storage       from '../../storage.js';

/* ── EXPÕE NO WINDOW PARA SCRIPTS CLÁSSICOS (quiz_engine.js) ──
   O quiz_engine.js é um script clássico (não módulo ES6), então
   não pode fazer import. Expondo aqui, ele acessa via
   window.NexusStorage.get() em vez de ler o localStorage direto.
   Se o prefixo 'nexus_' mudar um dia, só o storage.js precisa
   ser alterado — o engine continua funcionando sem tocar.
─────────────────────────────────────────────────────────────── */
window.NexusStorage = Storage;

/* ── DISC_MAP ─────────────────────────────────────────────── */
const DISC_MAP = {
  'poo':         { arquivo: 'poo',         nome: 'Programação Orientada a Objetos', emoji: '💻' },
  'redes':       { arquivo: 'redes',       nome: 'Redes de Computadores',           emoji: '🌐' },
  'design':      { arquivo: 'design',      nome: 'Design de Sistemas',              emoji: '🎨' },
  'banco_dados': { arquivo: 'banco_dados', nome: 'Fundamentos de Banco de Dados',   emoji: '🗄️' },
};

/* ── RESOLVE DISCIPLINA E TIPO ────────────────────────────── */
const disc = Storage.get('disciplina', 'poo');
const info = DISC_MAP[disc] || DISC_MAP['poo'];
const tipo = window.TIPO_QUIZ || 'questoes';

/* ── REGISTRA PÁGINA NO GLOBAL ────────────────────────────── */
setPagina('QUIZ');

/* ── ATUALIZA TEXTOS NO DOM ───────────────────────────────── */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

const tipoLabel = tipo === 'ava' ? 'Avaliação AVA' : 'Questões Práticas';

setText('disc-emoji',      info.emoji);
setText('disc-nome',       info.nome);
setText('breadcrumb-disc', disc.toUpperCase().replace('_', ' '));
setText('page-footer',     `Nexus Study · ${info.nome} · ${tipoLabel}`);

/* ── INJETA NAV-FLOAT ─────────────────────────────────────── */
const nav = document.createElement('nav');
nav.className   = 'nav-float';
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

/* ── CARREGA CONTEÚDO → ENGINE ────────────────────────────── */
const s    = document.createElement('script');
s.src      = `../conteudo/${info.arquivo}.js`;
s.onerror  = () => {
  const c = document.getElementById('quiz-container');
  if (c) c.innerHTML = `<div style="padding:2rem;text-align:center;color:#f87171;">⚠️ Arquivo não encontrado: ${info.arquivo}.js</div>`;
};
s.onload = () => {
  const engine = document.createElement('script');
  engine.src   = '../quiz_engine.js';
  document.body.appendChild(engine);
};
document.head.appendChild(s);