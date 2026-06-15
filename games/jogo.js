/**
 * NEXUS STUDY — games/jogo.js
 * Módulo ES — importa global.js e shared/
 */

import {
  SEMESTRES,
  getSemestreAtual,
  setSemestre,
  getDisciplinasDeSemestre,
} from '../src/global.js';

import { sincronizarSemNaURL } from '../shared/js/utils/url.js';
import { preencherAnos, criarSemestreSelect } from '../shared/js/utils/dom.js';
import { injetarLogo }         from '../shared/js/utils/logo.js';
import {
  Sound,
  audio,
  installAudioRecovery,
  playSound,
  mountMusicBtn,
  getMusicMode,
} from '../shared/js/audio/audio-api.js';

// ── Assistente Nexus ──────────────────────────────────────────
function _loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`[Nexus IA] Falha ao carregar: ${src}`));
    document.body.appendChild(s);
  });
}
function _carregarIA() {
  const raiz = new URL('../', import.meta.url).href.replace(/\/$/, '');
  const BASE = raiz + '/shared/js/ia/';
  const deps = [
    BASE + 'core/text-utils.js',
    BASE + 'core/loader.js',
    BASE + 'core/worker.js',
    BASE + 'core/ui.js',
    BASE + 'resumo/search.js',
  ];
  Promise.all(deps.map(_loadScript))
    .then(() => _loadScript(BASE + 'resumo/assistant.js'))
    .then(() => _loadScript(BASE + 'init.js'))
    .catch(err => console.error(err));
}
_carregarIA();
// ─────────────────────────────────────────────────────────────

'use strict';

/* ═══════════════════════════════════════════
   1. DATA
═══════════════════════════════════════════ */

const JOGOS = [
  // ── MEMORIZAÇÃO ───────────────────────
  {
    id: 'flashcard',
    nome: 'Flashcard',
    tipo: 'Memorização',
    status: 'disponível',
    icon: '🃏',
    descricao: 'Revise conceitos com cartões frente e verso. Método Spaced Repetition.',
    duracao: '5–15 min',
    dificuldade: '★☆☆',
  },

  // ── PERGUNTA ──────────────────────────
  {
    id: 'verdadeiro-falso',
    nome: 'Verdadeiro ou Falso',
    tipo: 'Pergunta',
    status: 'disponível',
    icon: '⚖️',
    descricao: 'Avalie afirmações sobre a disciplina escolhida e decida se são verdadeiras ou falsas.',
    duracao: '3–5 min',
    dificuldade: '★☆☆',
    // Mapeamento customizado: pasta e arquivo diferem do id
    rota: 'vdd_falso/vdd_falso.html',
  },
  {
    id: 'completar_frase',
    nome: 'Completar Frase',
    tipo: 'Pergunta',
    status: 'disponível',
    icon: '✏️',
    descricao: 'Preencha lacunas em frases para fixar conceitos essenciais da disciplina selecionada.',
    duracao: '4–7 min',
    dificuldade: '★★☆',
  },

    // ── DINÂMICA ──────────────────────────
  {
    id: 'show_milhao',
    nome: 'Show do Milhão',
    tipo: 'Dinâmica',
    status: 'disponível',
    icon: '🏆',
    descricao: 'Responda 15 perguntas com ajudas disponíveis. Chegue ao topo!',
    duracao: '10–20 min',
    dificuldade: '★★★',
  },

    // ── ASSOCIAÇÃO ────────────────────────
  {
    id: 'associacao',
    nome: 'Associação',
    tipo: 'Associação',
    status: 'disponível',
    icon: '🔗',
    descricao: 'Conecte conceitos com suas definições arrastando e soltando os pares corretos.',
    duracao: '4–8 min',
    dificuldade: '★★☆',
  },
  
];



/* ═══════════════════════════════════════════
   2. CORES POR TIPO
═══════════════════════════════════════════ */

const TYPE_CORES = {
  'Pergunta':    { cor: '#a78bfa', rgb: '167,139,250' },
  'Memorização': { cor: '#34d399', rgb: '52,211,153'  },
  'Dinâmica':    { cor: '#fb923c', rgb: '251,146,60'  },
  'Palavra':     { cor: '#38bdf8', rgb: '56,189,248'  },
  'Associação':  { cor: '#f472b6', rgb: '244,114,182' },
};

/* ═══════════════════════════════════════════
   3. STATE
═══════════════════════════════════════════ */

const state = {
  filterType: 'all',
  sortBy: 'name',
  filteredGames: [...JOGOS],
};

/* ═══════════════════════════════════════════
   4. DOM REFS
═══════════════════════════════════════════ */

const DOM = {
  grid:          () => document.getElementById('game-grid'),
  emptyState:    () => document.getElementById('empty-state'),
  resultsCount:  () => document.getElementById('results-count'),
  statAvailable: () => document.getElementById('stat-available'),
  sortSelect:    () => document.getElementById('sort-select'),
  modalOverlay:  () => document.getElementById('modal-overlay'),
  modal:         () => document.getElementById('modal'),
  modalClose:    () => document.getElementById('modal-close'),
  modalIcon:     () => document.getElementById('modal-icon'),
  modalTitle:    () => document.getElementById('modal-title'),
  modalDesc:     () => document.getElementById('modal-desc'),
  modalBadges:   () => document.getElementById('modal-badges'),
  modalMeta:     () => document.getElementById('modal-meta'),
  modalPlayBtn:  () => document.getElementById('modal-play-btn'),
  modalDiscWrap: () => document.getElementById('modal-disc-wrap'),
  modalDiscSel:  () => document.getElementById('modal-disc-select'),
};

/* ═══════════════════════════════════════════
   5. HELPERS
═══════════════════════════════════════════ */

function typeBadgeClass(tipo) {
  const map = {
    'Pergunta':    'badge--type-pergunta',
    'Memorização': 'badge--type-memorizacao',
    'Dinâmica':    'badge--type-dinamica',
    'Palavra':     'badge--type-palavra',
    'Associação':  'badge--type-associacao',
  };
  return map[tipo] ?? '';
}

function statusInfo(status) {
  const map = {
    'disponível': { cls: 'card__status-badge--available', label: '● Disponível' },
    'em breve':   { cls: 'card__status-badge--soon',      label: '◐ Em breve'  },
    'concluído':  { cls: 'card__status-badge--done',      label: '✓ Concluído' },
  };
  return map[status] ?? { cls: '', label: status };
}

/* ═══════════════════════════════════════════
   6. FILTER & SORT
═══════════════════════════════════════════ */

function applyFilters() {
  let list = [...JOGOS];
  if (state.filterType !== 'all') list = list.filter(g => g.tipo === state.filterType);
  list = sortGames(list, state.sortBy);
  state.filteredGames = list;
  render();
}

function sortGames(list, by) {
  return [...list].sort((a, b) => {
    if (by === 'name')   return a.nome.localeCompare(b.nome, 'pt-BR');
    if (by === 'type')   return a.tipo.localeCompare(b.tipo, 'pt-BR');
    if (by === 'status') return a.status.localeCompare(b.status, 'pt-BR');
    return 0;
  });
}

/* ═══════════════════════════════════════════
   7. RENDER — CARDS
═══════════════════════════════════════════ */

function buildCard(game) {
  const { cls: statusCls, label: statusLabel } = statusInfo(game.status);
  const isDisabled = game.status === 'em breve';
  const cores = TYPE_CORES[game.tipo] ?? { cor: '#e8c97a', rgb: '232,201,122' };

  const card = document.createElement('article');
  card.className = 'game-card';
  card.setAttribute('data-type-key', game.tipo);
  card.setAttribute('data-id', game.id);
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Jogo: ${game.nome}`);
  card.style.setProperty('--c',  cores.cor);
  card.style.setProperty('--cr', cores.rgb);

  const playLabel = isDisabled ? 'Em breve' : `Jogar ${game.nome}`;

  card.innerHTML = `
    <div class="card__art">
      <div class="card__art-icon">${game.icon}</div>
      <span class="card__type-pill">${game.tipo}</span>
      <span class="card__status ${statusCls}">${statusLabel}</span>
    </div>
    <div class="card__body">
      <div class="card__name">${game.nome}</div>
      <p class="card__desc">${game.descricao}</p>
    </div>
    <div class="card__footer">
      <button class="card__play-btn ${isDisabled ? 'card__play-btn--disabled' : ''}"
              aria-label="${playLabel}"
              ${isDisabled ? 'disabled aria-disabled="true"' : ''}>
        <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        ${isDisabled ? 'Em breve' : 'Jogar'}
      </button>
      <span class="card__badge badge ${typeBadgeClass(game.tipo)}">${game.tipo}</span>
    </div>
  `;

  card.addEventListener('mouseenter', () => playSound('hover', 'jogo'));
  card.addEventListener('click',   (e) => { if (!e.target.closest('.card__play-btn--disabled')) { playSound('click', 'jogo'); openModal(game); } });
  card.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.card__play-btn--disabled')) { playSound('click', 'jogo'); openModal(game); } });

  return card;
}

function render() {
  const grid    = DOM.grid();
  const empty   = DOM.emptyState();
  const countEl = DOM.resultsCount();

  grid.innerHTML = '';

  if (state.filteredGames.length === 0) {
    grid.classList.add('hidden');
    empty.classList.remove('hidden');
    countEl.textContent = '0';
    return;
  }

  grid.classList.remove('hidden');
  empty.classList.add('hidden');
  countEl.textContent = state.filteredGames.length;

  state.filteredGames.forEach((game, i) => {
    const card = buildCard(game);
    card.style.animationDelay = `${i * 45}ms`;
    grid.appendChild(card);
  });
}

/* ═══════════════════════════════════════════
   8. STATS HEADER
═══════════════════════════════════════════ */

function updateHeaderStats() {
  DOM.statAvailable().textContent = JOGOS.filter(g => g.status === 'disponível').length;
}

/* ═══════════════════════════════════════════
   9. MODAL — cor temática por tipo
═══════════════════════════════════════════ */

function openModal(game) {
  playSound('openModal', 'jogo');
  const overlay = DOM.modalOverlay();
  const modal   = DOM.modal();
  const { cls: statusCls, label: statusLabel } = statusInfo(game.status);

  const cores = TYPE_CORES[game.tipo] ?? { cor: '#e8c97a', rgb: '232,201,122' };
  modal.style.setProperty('--modal-c',  cores.cor);
  modal.style.setProperty('--modal-cr', cores.rgb);

  DOM.modalIcon().textContent  = game.icon;
  DOM.modalTitle().textContent = game.nome;
  DOM.modalDesc().textContent  = game.descricao;

  DOM.modalBadges().innerHTML = `
    <span class="badge ${typeBadgeClass(game.tipo)}">${game.tipo}</span>
    <span class="card__status-badge ${statusCls}" style="font-size:9px">${statusLabel}</span>
  `;

  // modal__meta: hidden by CSS — duration and difficulty removed

  // Popula disciplinas do semestre ativo via global.js
  const sel  = DOM.modalDiscSel();
  const wrap = DOM.modalDiscWrap();
  const sem  = getSemestreAtual();
  const discs = getDisciplinasDeSemestre(sem);
  const disciplinas = getDisciplinasDeSemestre(sem);

  if (!disciplinas.length) {
    wrap.innerHTML = `
      <p class="modal-empty">
        Nenhuma disciplina cadastrada para <strong>${sem}</strong> ainda.
      </p>`;
    return;
  }

  sel.innerHTML = '<option value="">— selecione —</option>';
  discs.forEach(d => {
    const opt       = document.createElement('option');
    opt.value       = d.arquivo ?? d.id;
    opt.textContent = `${d.emoji ?? ''} ${d.apelido ?? d.nome}`.trim();
    sel.appendChild(opt);
  });

  const playBtn = DOM.modalPlayBtn();

  if (game.status === 'em breve') {
    wrap.classList.add('hidden');
    playBtn.innerHTML = 'Em breve…';
    playBtn.style.cssText = 'background:rgba(255,255,255,.05);color:var(--text-3);box-shadow:none;cursor:not-allowed;';
    playBtn.disabled = true;
  } else {
    wrap.classList.remove('hidden');
    playBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      Iniciar Jogo
    `;
    playBtn.style.cssText = '';
    playBtn.disabled = false;

    playBtn.onclick = () => {
      playSound('click', 'jogo');
      const discArquivo = sel.value;
      if (!discArquivo) {
        sel.classList.add('modal__disc-select--error');
        sel.focus();
        return;
      }
      sel.classList.remove('modal__disc-select--error');
      handlePlay(game, discArquivo, sem);
    };

    sel.addEventListener('mousedown', () => playSound('click', 'jogo'));
    sel.addEventListener('change', () => { playSound('select', 'jogo'); sel.classList.remove('modal__disc-select--error'); }, { once: false });
  }

  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => (game.status === 'em breve' ? playBtn : sel).focus(), 100);
}

function closeModal() {
  playSound('closeModal', 'jogo');
  const overlay = DOM.modalOverlay();
  const modal   = DOM.modal();
  overlay.classList.add('is-closing');
  modal.classList.add('is-closing');
  setTimeout(() => {
    overlay.classList.remove('is-closing');
    modal.classList.remove('is-closing');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }, 220);
}

/**
 * Resolve a rota de navegação para cada jogo.
 * Se o jogo tiver `rota` customizada, usa ela.
 * Caso contrário, usa o padrão: jogos/{id}/{id}.html
 */
function resolverRota(game) {
  return game.rota ?? `${game.id}/${game.id}.html`;
}

function handlePlay(game, disciplinaArquivo, semestre) {
  const rota = resolverRota(game);
  window.location.href = `jogos/${rota}?disc=${disciplinaArquivo}&sem=${semestre}`;
}

/* ═══════════════════════════════════════════
   10. SELETOR DE SEMESTRE — topbar
═══════════════════════════════════════════ */

function setupSemestreSelect() {
  // Lê ?sem= da URL, com fallback ao global.js
  const semParam = new URLSearchParams(location.search).get('sem');
  if (semParam && SEMESTRES.includes(semParam)) setSemestre(semParam);

  sincronizarSemNaURL(getSemestreAtual());

  criarSemestreSelect('semestre-wrap', sem => {
    playSound('select', 'jogo');
    setSemestre(sem);
    sincronizarSemNaURL(sem, 'push');
    // O modal já lê getSemestreAtual() na abertura — nada mais a fazer aqui
  });

  // Som no mousedown do select gerado
  requestAnimationFrame(() => {
    const sel = document.querySelector('#semestre-wrap select');
    if (sel) sel.addEventListener('mousedown', () => playSound('click', 'jogo'));
  });
}

/* ═══════════════════════════════════════════
   11. FILTER PILLS
═══════════════════════════════════════════ */

function setupPills(containerId, filterKey) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    playSound('select', 'jogo');
    container.querySelectorAll('.pill').forEach(p => p.classList.remove('pill--active'));
    btn.classList.add('pill--active');
    state[filterKey] = btn.dataset.value;
    applyFilters();
  });
}

/* ═══════════════════════════════════════════
   12. SORT
═══════════════════════════════════════════ */

function setupSort() {
  const sel = DOM.sortSelect();
  if (!sel) return;
  sel.addEventListener('change', () => {
    playSound('select', 'jogo');
    state.sortBy = sel.value;
    applyFilters();
  });
}

/* ═══════════════════════════════════════════
   13. MODAL CLOSE
═══════════════════════════════════════════ */

function setupModal() {
  DOM.modalClose()?.addEventListener('click', () => { playSound('click', 'jogo'); closeModal(); });
  DOM.modalOverlay()?.addEventListener('click', (e) => {
    if (e.target === DOM.modalOverlay()) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function setupBtnVoltar() {
  const btn = document.querySelector('#btn-voltar, .btn-voltar, [data-action="back"]');
  if (!btn) return;
  btn.addEventListener('click', () => playSound('click', 'jogo'));
}

/* ═══════════════════════════════════════════
   14. MODAL CONFIG — Jogos (Flashcard SRS)
═══════════════════════════════════════════ */

function _mostrarToastJogos(msg) {
  const OFFSET   = 12;
  const DURATION = 2800;
  const existentes = document.querySelectorAll('.nexus-toast');
  let nextBottom   = 32;
  existentes.forEach(t => { nextBottom += t.offsetHeight + OFFSET; });

  const t = document.createElement('div');
  t.className   = 'nexus-toast';
  t.textContent = msg;
  t.style.bottom = `${nextBottom}px`;
  document.body.appendChild(t);

  requestAnimationFrame(() => t.classList.add('nexus-toast--show'));
  setTimeout(() => {
    t.classList.remove('nexus-toast--show');
    t.addEventListener('transitionend', () => t.remove(), { once: true });
  }, DURATION);
}

function _confirmarJogos(btn, callback) {
  if (btn.dataset.confirmando === 'true') {
    btn.dataset.confirmando = 'false';
    btn.textContent = btn.dataset.textoOriginal;
    btn.classList.remove('modal-btn--danger');
    callback();
    return;
  }
  btn.dataset.textoOriginal = btn.textContent;
  btn.dataset.confirmando   = 'true';
  btn.textContent = 'Tem certeza?';
  btn.classList.add('modal-btn--danger');

  setTimeout(() => {
    if (!document.body.contains(btn)) return;
    if (btn.dataset.confirmando === 'true') {
      btn.dataset.confirmando = 'false';
      btn.textContent = btn.dataset.textoOriginal;
      btn.classList.remove('modal-btn--danger');
    }
  }, 3000);
}

function _abrirModalConfigJogos() {
  playSound('openModal', 'jogo');
  document.querySelector('#jcfg-overlay')?.remove();

  const sem         = getSemestreAtual();
  const disciplinas = getDisciplinasDeSemestre(sem);

  const overlay = document.createElement('div');
  overlay.id        = 'jcfg-overlay';
  overlay.className = 'jcfg-overlay';

  overlay.innerHTML = `
    <div class="jcfg-box" role="dialog" aria-modal="true" aria-labelledby="jcfg-title">

      <div class="jcfg-header">
        <h2 class="jcfg-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06
                     a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09
                     A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83
                     l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09
                     A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83
                     l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09
                     a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83
                     l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09
                     a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Jogos — Configurações
        </h2>
        <button class="jcfg-close" id="jcfg-close" aria-label="Fechar">✕</button>
      </div>

      <div class="jcfg-body">

        <div class="jcfg-section">
          <p class="jcfg-section-title">Flashcard</p>

          <div class="jcfg-row">
            <div class="jcfg-row__label">
              Limpar disciplina
              <small class="jcfg-row__hint">
                Zera o progresso de repetição espaçada de uma disciplina específica.
              </small>
            </div>
            <div class="jcfg-disc-btns" id="jcfg-disc-btns"></div>
          </div>

          <div class="jcfg-row">
            <div class="jcfg-row__label">
              Limpar tudo
              <small class="jcfg-row__hint">
                Zera o SRS de todas as disciplinas do semestre atual.
              </small>
            </div>
            <button class="jcfg-btn jcfg-btn--danger" id="jcfg-btn-limpar-tudo">Limpar tudo</button>
          </div>
        </div>

      </div>

      <div class="jcfg-footer">
        <button class="jcfg-btn jcfg-btn--ghost" id="jcfg-btn-fechar">Fechar</button>
      </div>

    </div>`;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('jcfg--open'));

  /* ── Resetar SRS ── */
  async function _resetarSRS(discId) {
    try {
      const mod = await import('./jogos/flashcard/flashcard.js');
      mod?.invalidarCacheSRS?.(discId ?? null);
    } catch (err) {
      console.warn('[SRS] flashcard.js não encontrado:', err?.message);
    }
  }

  /* ── Botões por disciplina ── */
  const discBtns = overlay.querySelector('#jcfg-disc-btns');
  disciplinas.forEach(disc => {
    const btn = document.createElement('button');
    btn.className   = 'jcfg-btn jcfg-btn--ghost';
    btn.textContent = disc.apelido;
    btn.title       = `Limpar SRS de ${disc.nome}`;
    btn.addEventListener('click', () => {
      _confirmarJogos(btn, async () => {
        await _resetarSRS(disc.id);
        _mostrarToastJogos(`SRS de ${disc.apelido} apagado.`);
      });
    });
    discBtns?.appendChild(btn);
  });

  /* ── Limpar tudo ── */
  overlay.querySelector('#jcfg-btn-limpar-tudo')?.addEventListener('click', function () {
    _confirmarJogos(this, async () => {
      await _resetarSRS(null);
      _mostrarToastJogos('SRS de todas as disciplinas apagado.');
    });
  });

  /* ── Fechar ── */
  function _fechar() {
    playSound('closeModal', 'jogo');
    overlay.classList.add('jcfg--closing');
    overlay.classList.remove('jcfg--open');
    setTimeout(() => overlay.remove(), 220);
  }

  overlay.querySelector('#jcfg-close')?.addEventListener('click', _fechar);
  overlay.querySelector('#jcfg-btn-fechar')?.addEventListener('click', () => {
    playSound('click', 'jogo'); _fechar();
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) _fechar(); });
  document.addEventListener('keydown', function _esc(e) {
    if (e.key === 'Escape') { _fechar(); document.removeEventListener('keydown', _esc); }
  }, { once: true });
}

function _injetarBtnConfigJogos() {
  // Injeta na topbar, ao lado do semestre-wrap
  const topbarRight = document.querySelector('.topbar__right');
  if (!topbarRight) return;

  const btn = document.createElement('button');
  btn.className = 'jogo-cfg-btn';
  btn.id        = 'btn-jogos-config';
  btn.title     = 'Configurações dos Jogos';
  btn.setAttribute('aria-label', 'Configurações dos Jogos');
  btn.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06
               a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09
               A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83
               l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09
               A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83
               l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09
               a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83
               l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09
               a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>`;

  btn.addEventListener('mouseenter', () => playSound('hover', 'jogo'));
  btn.addEventListener('click', () => {
    playSound('click', 'jogo');
    _abrirModalConfigJogos();
  });

  topbarRight.appendChild(btn);
}

/* ═══════════════════════════════════════════
   15. INIT
═══════════════════════════════════════════ */

function init() {
  Sound.init();
  mountMusicBtn();
  installAudioRecovery({ Sound, audio });

  injetarLogo({
    destino:  '#sidebar-logo-wrap',
    tamanho:  36,
    layout:   'stacked',
    srcBase:  '../shared/img/logo.png',
    linkHref: '../index.html',
    playSound,
  });
  setupSemestreSelect();
  updateHeaderStats();
  applyFilters();
  setupPills('filter-type', 'filterType');
  setupSort();
  setupModal();
  setupBtnVoltar();
  _injetarBtnConfigJogos();
  preencherAnos(); // preenche footer-year se existir
}

init();

/* ═══════════════════════════════════════════
   16. PUBLIC API
═══════════════════════════════════════════ */

window.NexusStudy = window.NexusStudy || {};
window.NexusStudy.Jogos = {
  addGame(game)            { JOGOS.push(game); applyFilters(); },
  updateStatus(id, status) { const g = JOGOS.find(j => j.id === id); if (g) { g.status = status; applyFilters(); } },
  getFiltered()            { return [...state.filteredGames]; },
};