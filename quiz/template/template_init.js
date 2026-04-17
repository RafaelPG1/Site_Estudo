/* ============================================================
   NEXUS STUDY — quiz/template/template_init.js

   Responsabilidades:
     1. Lê o contexto completo da URL (?disc=&modo=&sem=)
     2. Atualiza o global.js (setSemestre, setDisciplina, setPagina)
     3. Atualiza os textos do DOM
     4. Corrige o back-btn
     5. Expõe window.NEXUS_URL_BACK para o quiz_engine.js
     6. Injeta o nav-float (os binds dos botões ficam todos no quiz_engine.js)
     7. Carrega o arquivo de conteúdo e depois o quiz_engine.js

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
     [FIX 7] window.NEXUS_URL_BACK exposto após calcular o href.
             O quiz_engine.js consome esta variável para o #btn-left,
             eliminando o recálculo independente de ?disc= e ?sem=
             que existia antes nele. Um ponto de verdade, dois botões
             sincronizados. Também adicionado console.warn quando
             ?disc= não é encontrado no semestre (fallback defensivo
             antes era silencioso).
     [ESTRUTURA] Paths de conteúdo e disciplinas agora incluem
             ano e semestre: conteudo/ANO/SEMESTRE/arquivo.js
             e disciplinas/ANO/arquivo.html
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
// Regra: "2026.2" → "2026" | "2027.1" → "2027"
const ano = semestre.split('.')[0];

/* ── ATUALIZA O GLOBAL ────────────────────────────────────── */
setSemestre(semestre);
setDisciplina(disc);
setPagina('QUIZ');

/* ── RESOLVE INFO DE DISPLAY A PARTIR DO GLOBAL ──────────── */
//
// [FIX 4] Fonte única de verdade: global.js → DISCIPLINAS.
// Nenhum DISC_MAP local. Nome, arquivo e emoji vêm todos daqui.
//
const lista    = getDisciplinasDeSemestre(semestre);
const discInfo = lista.find(d => d.id === disc);

// [FIX 7] Avisa quando o disc da URL não existir no semestre
// (antes o fallback era silencioso — o usuário via a disciplina
// errada sem nenhuma indicação no console).
if (!discInfo) {
  console.warn(
    `[template_init] Disciplina "${disc}" não encontrada em ${semestre}.` +
    ` Usando fallback: "${lista[0]?.id ?? 'nenhuma'}".`
  );
}

// Fallback defensivo: usa a primeira disponível ou um objeto mínimo.
const info      = discInfo ?? lista[0] ?? { id: disc, nome: disc, arquivo: disc, emoji: '📚' };

const tipoLabel = modo === 'ava' ? 'Avaliação AVA' : 'Questões Práticas';

/* ── ATUALIZA TEXTOS NO DOM ───────────────────────────────── */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

setText('disc-emoji',      info.emoji);
setText('disc-nome',       info.nome);

// [FIX 2] Usa regex global /_/g para substituir TODOS os underscores,
// não apenas o primeiro. Ex: "banco_dados" → "BANCO DADOS"
setText('breadcrumb-disc', info.id.toUpperCase().replace(/_/g, ' '));

setText('page-footer',     `Nexus Study · ${info.nome} · ${tipoLabel}`);

/* ── CORRIGE BACK-BTN E EXPÕE URL DE VOLTA ───────────────── */
//
// [FIX 5] Único ponto de escrita do href do back-btn.
// [FIX 7] Após calcular a URL, expõe via window.NEXUS_URL_BACK
//         para que o quiz_engine.js reutilize sem recalcular.
// [ESTRUTURA] Path inclui o ano: disciplinas/ANO/arquivo.html
//
const urlBack = `../disciplinas/${ano}/${info.arquivo}.html?sem=${semestre}`;
window.NEXUS_URL_BACK = urlBack;

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
//
// [ESTRUTURA] Path inclui ano e semestre: conteudo/ANO/SEMESTRE/arquivo.js
//
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