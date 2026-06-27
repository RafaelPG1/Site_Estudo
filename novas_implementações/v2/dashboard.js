/* =============================================
   NEXUS STUDY — dashboard.js
   Dashboard: visão geral, ferramentas pessoais e estatísticas.
   =============================================

   Este arquivo incorpora ao Dashboard a INFRAESTRUTURA já
   utilizada pelo restante do Nexus Study (semestre, disciplina
   atual, áudio, logo, IA/música/Quick Access via script global).
   Nenhum elemento visual, layout ou card do design foi alterado
   — apenas dados antes fixos (mock) passaram a ser carregados
   dinamicamente a partir das mesmas fontes usadas em Resumo e Quiz.

   Esta página NÃO exige login: ao contrário da Área Pessoal,
   o Dashboard não possui Route Guard. Os demais sistemas globais
   (semestre, áudio, IA, Quick Access) funcionam normalmente com
   ou sem usuário autenticado.
   ============================================= */

import {
  setSemestre,
  getDisciplinaAtual,
  getDisciplinasDeSemestre,
  setPagina,
  SEMESTRES,
  getUsuario,
} from '../src/global.js';

import { resolverSemestreDeURL } from '../shared/js/utils/url.js';
import { aplicarCoresDisciplina } from '../shared/js/themes/theme.js';
import { injetarLogo } from '../shared/js/utils/logo.js';

/* ── Áudio ── */
import {
  Sound,
  audio,
  installAudioRecovery,
  playSound,
} from '../shared/js/audio/audio-api.js';

/* ══════════════════════════════════════════════
   ESTADO
══════════════════════════════════════════════ */
const State = {
  semestre:    null,
  disciplinas: [],
  discAtiva:   null,
  DISC_CORES:  {},
};

/* ══════════════════════════════════════════════
   CONTEXTO — semestre / disciplina atuais
   (mesma resolução usada nas páginas de Resumo e Quiz)
══════════════════════════════════════════════ */
function _resolverContexto() {
  const semestre = resolverSemestreDeURL();
  const lista    = getDisciplinasDeSemestre(semestre);

  State.semestre    = semestre;
  State.disciplinas = lista;

  const discId = getDisciplinaAtual();
  const disc   = (discId ? lista.find(d => d.id === discId) : null) ?? lista[0] ?? null;

  State.discAtiva = disc;

  if (disc) {
    aplicarCoresDisciplina(disc.arquivo, State.DISC_CORES);
  }
}

/* ══════════════════════════════════════════════
   SELETOR DE SEMESTRE
   (mesmo componente e comportamento usados em todo o Nexus Study)
══════════════════════════════════════════════ */
function _renderSemestreSelector() {
  const wrap = document.getElementById('semestre-selector-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';

  const select = document.createElement('select');
  select.className = 'semestre-select';
  select.title      = 'Selecionar semestre';
  select.id         = 'semestre-select';

  SEMESTRES.forEach(s => {
    const opt       = document.createElement('option');
    opt.value       = s;
    opt.textContent = s;
    if (s === State.semestre) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener('change', e => {
    playSound('select', 'perfil');
    _trocarSemestre(e.target.value);
  });

  wrap.appendChild(select);

  requestAnimationFrame(() => {
    const sel = wrap.querySelector('select');
    if (sel) sel.addEventListener('mousedown', () => playSound('click', 'perfil'));
  });
}

function _trocarSemestre(novoSemestre) {
  setSemestre(novoSemestre);
  State.semestre    = novoSemestre;
  State.disciplinas = getDisciplinasDeSemestre(novoSemestre);
  State.discAtiva   = State.disciplinas[0] ?? null;

  if (State.discAtiva) {
    aplicarCoresDisciplina(State.discAtiva.arquivo, State.DISC_CORES);
  }

  _renderContexto();
  _renderDisciplinas();
}

/* ══════════════════════════════════════════════
   RENDER — elementos dinâmicos do layout existente
   (nenhum card novo é criado; apenas preenchidos)
══════════════════════════════════════════════ */
function _renderContexto() {
  const semEl = document.getElementById('meta-semestre');
  if (semEl) semEl.textContent = State.semestre ? `Semestre · ${State.semestre}` : '—';

  const discEl = document.getElementById('meta-disciplina');
  if (discEl) {
    discEl.textContent = State.discAtiva
      ? `${State.discAtiva.emoji ? State.discAtiva.emoji + ' ' : ''}${State.discAtiva.nome}`
      : 'Nenhuma disciplina';
  }
}

/**
 * Extrai uma cor utilizável da entrada de DISC_CORES de uma disciplina.
 * O formato exato de DISC_CORES (shared/js/themes/cores.js) não é
 * conhecido por este arquivo, então a busca é defensiva: aceita tanto
 * uma string direta quanto um objeto com chave reconhecível. Se nada
 * for encontrado, retorna null — nenhuma cor é inventada.
 */
function _corDaDisciplina(disc) {
  const entry = disc?.arquivo ? State.DISC_CORES?.[disc.arquivo] : null;
  if (!entry) return null;
  if (typeof entry === 'string') return entry;
  return entry.cor ?? entry.hex ?? entry.primary ?? entry.principal ?? null;
}

/**
 * Renderiza a grade de disciplinas do semestre atual usando
 * exatamente os dados reais (id, nome, emoji, arquivo) vindos de
 * getDisciplinasDeSemestre() — a mesma fonte usada em todo o
 * Nexus Study. Nenhuma disciplina fica fixa no HTML.
 *
 * Não exibe questões/sessões/progresso: essas métricas não têm
 * fonte de dados real disponível neste módulo, então não são
 * inventadas nem substituídas por placeholders.
 */
function _renderDisciplinas() {
  const grid = document.getElementById('disc-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (!State.disciplinas.length) {
    const vazio = document.createElement('div');
    vazio.className = 'disc-empty';
    vazio.textContent = 'Nenhuma disciplina neste semestre.';
    grid.appendChild(vazio);
    return;
  }

  State.disciplinas.forEach(disc => {
    const cor = _corDaDisciplina(disc);

    const item = document.createElement('div');
    item.className = 'disc-item';
    item.dataset.discId = disc.id;

    const colorBar = document.createElement('div');
    colorBar.className = 'disc-color';
    if (cor) colorBar.style.background = cor;

    const nome = document.createElement('div');
    nome.className = 'disc-name';
    nome.textContent = disc.nome;

    const sub = document.createElement('div');
    sub.className = 'disc-sessions';
    sub.textContent = `${disc.emoji ? disc.emoji + ' ' : ''}${disc.apelido ?? disc.id}`;

    item.appendChild(colorBar);
    item.appendChild(nome);
    item.appendChild(sub);
    grid.appendChild(item);
  });
}

function _renderGreeting() {
  const el = document.getElementById('page-greeting');
  if (!el) return;
  const agora = new Date();
  const texto = agora.toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
  el.textContent = `// ${texto}`;
}

function _renderUsuario() {
  const el = document.getElementById('page-user-name');
  if (!el) return;
  const usuario = getUsuario?.();
  const nome    = usuario?.nome || usuario?.displayName || '';
  el.innerHTML = nome ? `, <span class="accent">${_escapeHtml(nome.split(' ')[0])}</span>` : '';
}

function _escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/* ══════════════════════════════════════════════
   BOOT
   (sem Route Guard — esta página não exige login)
══════════════════════════════════════════════ */
async function _bootPagina() {
  setPagina('DASHBOARD');
  Sound.init();
  installAudioRecovery({ Sound, audio });

  injetarLogo({
    destino:  '#header-logo-wrap',
    tamanho:  32,
    layout:   'stacked',
    srcBase:  '../shared/img/logo.png',
    linkHref: '../index.html',
  });

  try {
    const mod = await import('../shared/js/themes/cores.js');
    State.DISC_CORES = mod.DISC_CORES ?? {};
  } catch (_) {}

  _resolverContexto();
  _renderSemestreSelector();
  _renderContexto();
  _renderDisciplinas();
  _renderGreeting();
  _renderUsuario();

  _initSessionTimer();
  _initProgressBarAnimation();
}

document.addEventListener('DOMContentLoaded', async () => {
  await _bootPagina();
});

/* ══════════════════════════════════════════════
   VISUAL DO DASHBOARD (preservado do design original)
══════════════════════════════════════════════ */

/* ── SESSION TIMER ──────────────────────────────────────── */
function _initSessionTimer() {
  let seconds = 48 * 60 + 22;
  const timeEl = document.querySelector('.session-time');
  if (!timeEl) return;

  setInterval(function () {
    seconds++;
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    timeEl.textContent = m + ':' + s;
  }, 1000);
}

/* ── PROGRESS BAR ANIMATION ON LOAD ────────────────────── */
function _initProgressBarAnimation() {
  document.querySelectorAll('.prog-fill').forEach(function (bar) {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';
    setTimeout(function () {
      bar.style.width = targetWidth;
    }, 200);
  });
}