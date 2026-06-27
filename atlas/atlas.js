// @ts-nocheck
/* ═══════════════════════════════════════════════════════════
   NEXUS STUDY — atlas/atlas.js
   Arquitetura em 3 níveis:

     Nível 1 — Biblioteca   (screen-home)
     Nível 2 — Disciplina   (screen-discipline)
     Nível 3 — Leitura      (screen--reader)  ← screen oficial, não modal

   O reader é agora uma screen normal do sistema.
   Não existe mais overlay, position fixed, timeout
   de animação ou comportamento de modal.
   A troca para o reader funciona exatamente como
   _showScreen('home') ou _showScreen('discipline').
   ═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   IMPORTS
══════════════════════════════════════════════ */
import { injetarLogo }                                    from '../shared/js/utils/logo.js';
import { preencherAnos }                                  from '../shared/js/utils/dom.js';
import { Sound, audio, installAudioRecovery, playSound } from '../shared/js/audio/audio-api.js';

/* ══════════════════════════════════════════════
   IA — contexto neutro
══════════════════════════════════════════════ */
window.__NEXUS_CONTEXT__ = { tipos: ['atlas'] };

function _loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src     = src;
    s.onload  = resolve;
    s.onerror = () => reject(new Error(`[Nexus IA] Falha: ${src}`));
    document.body.appendChild(s);
  });
}

function _carregarIA() {
  const BASE = '../shared/js/ia/';
  const deps = [
    BASE + 'core/context.js',
    BASE + 'core/text-utils.js',
    BASE + 'core/history.js',
    BASE + 'core/loader.js',
    BASE + 'core/worker.js',
    BASE + 'core/ui.js',
  ];
  Promise.all(deps.map(_loadScript))
    .catch(err => console.warn('[atlas] Falha ao carregar IA (core):', err));
}

/* ══════════════════════════════════════════════
   ESTADO GLOBAL DE CATEGORIAS
══════════════════════════════════════════════ */
let CATEGORIES = [];

/* ══════════════════════════════════════════════
   MAPEAMENTO DE GRUPOS VISUAIS DE CAPÍTULOS
══════════════════════════════════════════════ */
const CHAPTER_GROUPS_MAP = {};
const DEFAULT_GROUP_LABEL = 'Conteúdo';

function _buildChapterGroups(categoryId, secoes) {
  const mapping = CHAPTER_GROUPS_MAP[categoryId];

  if (!mapping || !mapping.length) {
    return [{ titulo: DEFAULT_GROUP_LABEL, secoes: secoes.map((s, i) => ({ ...s, _index: i })) }];
  }

  const used = new Set();
  const groups = mapping.map(g => {
    const [start, end] = g.range;
    const items = [];
    secoes.forEach((s, i) => {
      if (i >= start && i <= end) { items.push({ ...s, _index: i }); used.add(i); }
    });
    return { titulo: g.titulo, secoes: items };
  }).filter(g => g.secoes.length);

  const leftovers = secoes
    .map((s, i) => ({ ...s, _index: i }))
    .filter(s => !used.has(s._index));
  if (leftovers.length) groups.push({ titulo: 'Outros', secoes: leftovers });

  return groups.length
    ? groups
    : [{ titulo: DEFAULT_GROUP_LABEL, secoes: secoes.map((s, i) => ({ ...s, _index: i })) }];
}

/* ══════════════════════════════════════════════
   ESTADO DA UI
══════════════════════════════════════════════ */
const State = {
  // 'home' | 'discipline' | 'materials' | 'reader'
  view:              'home',
  currentCategory:   null,
  currentChapter:    null,
  searchQuery:       '',
  sidebarMobileOpen: false,
  _progressCleanup:  null,
};

/* ══════════════════════════════════════════════
   FAVORITOS
══════════════════════════════════════════════ */
const Favorites = {
  _key:   'nexus_atlas_favorites',
  _limit: 8,

  load() {
    try {
      return new Set(JSON.parse(localStorage.getItem(this._key) ?? '[]'));
    } catch { return new Set(); }
  },

  save(set) {
    localStorage.setItem(this._key, JSON.stringify([...set]));
  },

  toggle(id) {
    const favs = this.load();
    if (favs.has(id)) {
      favs.delete(id);
      this.save(favs);
      return false;
    }
    if (favs.size >= this._limit) {
      return null;
    }
    favs.add(id);
    this.save(favs);
    return true;
  },

  has(id)  { return this.load().has(id); },
  getAll() { return this.load(); },
  isFull() { return this.load().size >= this._limit; },
};

/* ══════════════════════════════════════════════
   SELETORES
══════════════════════════════════════════════ */
const $ = (id) => document.getElementById(id);

const EL = {
  screenHome:              $('screen-home'),
  catGrid:                 $('categories-grid'),
  categoriesCount:         $('categories-count'),
  heroStats:               $('hero-stats'),
  headerStats:             $('header-stats'),
  searchInput:             $('search-input'),
  headerBtnBack:           $('btn-back'),
  // slot esquerdo do header — alterna entre btn-back e breadcrumb
  headerLeftSlot:          $('header-left-slot'),

  screenDiscipline:        $('screen-discipline'),
  disciplineBack:          $('discipline-back'),
  disciplineIcon:          $('discipline-icon'),
  disciplineTitle:         $('discipline-title'),
  disciplineDesc:          $('discipline-desc'),
  disciplineMeta:          $('discipline-meta'),
  disciplineBody:          $('discipline-body'),

  // reader é uma screen normal do sistema (sem modal, sem reader__bar próprio)
  screenReader:            $('reader'),
  readerLayout:            $('reader-layout'),
  readerSidebar:           $('reader-sidebar'),
  readerSidebarScrim:      $('reader-sidebar-scrim'),
  readerSidebarToggle:     $('reader-sidebar-toggle'),   // no header global
  readerProgress:          $('reader-progress'),          // fora da screen, abaixo do header
  readerProgressFill:      $('reader-progress-fill'),
  sidebarCurrentLabel:     $('sidebar-current-discipline'),
  sidebarChapters:         $('sidebar-chapters'),
  readerScroll:            $('reader-scroll'),
  readerHeroCategory:      $('reader-hero-category'),
  readerHeroTitle:         $('reader-hero-title'),
  readerHeroDesc:          $('reader-hero-desc'),
  readerHeroChips:         $('reader-hero-chips'),
  readerBody:              $('reader-body'),
  readerChapterNav:        $('reader-chapter-nav'),
};

/* ══════════════════════════════════════════════
   ESCAPE / HELPERS DE RENDERIZAÇÃO
══════════════════════════════════════════════ */
function _esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function _isSvgIcon(icon) {
  return typeof icon === 'string' && icon.trim().toLowerCase().startsWith('<svg');
}

function _renderIcon(icon, fallback = '📄') {
  const value = icon ?? fallback;
  return _isSvgIcon(value) ? value : _esc(value);
}

/* ══════════════════════════════════════════════
   COR DO ÍCONE
══════════════════════════════════════════════ */
function _hexToRgb(hex) {
  if (typeof hex !== 'string') return null;
  const m = hex.trim().replace('#', '').match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r},${g},${b}`;
}

function _iconStyleAttr(color) {
  const rgb = _hexToRgb(color);
  return rgb ? ` style="--cat-rgb:${rgb}"` : '';
}

/* ══════════════════════════════════════════════
   TEMA
══════════════════════════════════════════════ */
function _themeFor(categoryId) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  return cat?.theme ?? 'indigo';
}

function _applyTheme(el, categoryId) {
  if (!el) return;
  el.setAttribute('data-theme', _themeFor(categoryId));
}

function _applyIconColor(el, categoryId) {
  if (!el) return;
  const cat = CATEGORIES.find(c => c.id === categoryId);
  const rgb = _hexToRgb(cat?.color);
  if (rgb) {
    el.style.setProperty('--cat-rgb', rgb);
  } else {
    el.style.removeProperty('--cat-rgb');
  }
}

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */
function _toast(msg) {
  const OFFSET = 12, DURATION = 2800;
  const existentes = document.querySelectorAll('.nexus-toast');
  let nextBottom = 32;
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

/* ══════════════════════════════════════════════
   INJEÇÃO DE SCRIPTS
══════════════════════════════════════════════ */
function _injectScript(src, dataAttr) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-kb="${dataAttr}"]`);
    if (existing) { resolve(); return; }

    const s = document.createElement('script');
    s.src        = src;
    s.dataset.kb = dataAttr;
    s.onload     = () => resolve();
    s.onerror    = () => reject(new Error(`Falha ao carregar: ${src}`));
    document.head.appendChild(s);
  });
}

/* ══════════════════════════════════════════════
   CARREGAMENTO DO MANIFEST
══════════════════════════════════════════════ */
async function _loadManifest() {
  try {
    await _injectScript('manifest.js', 'manifest');
    const manifest = window.__atlasManifest;
    if (!Array.isArray(manifest)) {
      console.warn('[atlas] manifest.js não expõe window.__atlasManifest como array.');
      return [];
    }
    return manifest;
  } catch (err) {
    console.error('[atlas] Não foi possível carregar manifest.js:', err);
    return [];
  }
}

/* ══════════════════════════════════════════════
   CARREGAMENTO DE TODAS AS CATEGORIAS
══════════════════════════════════════════════ */
async function _loadAllCategories() {
  const manifest = await _loadManifest();
  if (!manifest.length) return;

  CATEGORIES = manifest
    .filter(entry => entry && entry.id && entry.content)
    .map(entry => ({
      id:        entry.id,
      name:      entry.title ?? entry.id,
      title:     entry.title ?? entry.id,
      desc:      entry.desc  ?? '',
      type:      entry.type  ?? 'Documentação',
      time:      entry.time  ?? 0,
      theme:     entry.theme ?? 'indigo',
      color:     entry.color ?? null,
      icon:      entry.icon  ?? '📄',
      content:   entry.content,
      resources: entry.resources ?? [],
    }));
}

/* ══════════════════════════════════════════════
   CARREGAMENTO DE CONTEÚDO (com cache em memória)
══════════════════════════════════════════════ */
async function _loadCategoryContent(cat) {
  const src      = cat.content;
  const dataAttr = `cat-${cat.id}`;

  const existing = document.querySelector(`script[data-kb="${dataAttr}"]`);
  if (existing) existing.remove();

  delete window.__nexusatlas;

  try {
    await _injectScript(src, dataAttr);
  } catch (err) {
    console.warn(`[atlas] Falha ao carregar conteúdo de ${cat.id} (${src}):`, err);
  }

  const raw = window.__nexusatlas;

  return {
    title:     cat.title,
    desc:      cat.desc,
    type:      cat.type,
    time:      cat.time,
    icon:      cat.icon,
    theme:     cat.theme,
    resources: cat.resources ?? [],
    secoes:    Array.isArray(raw?.secoes) ? raw.secoes : [{
      titulo: 'Em preparação',
      blocos: [{
        tipo:  'texto',
        texto: `O arquivo ${src} ainda não foi criado ou não expõe window.__nexusatlas com o campo secoes.`,
      }],
    }],
  };
}

const _contentCache  = new Map();
const _inflightCache = new Map();

async function _getCategoryContent(categoryId) {
  if (_contentCache.has(categoryId))  return _contentCache.get(categoryId);
  if (_inflightCache.has(categoryId)) return _inflightCache.get(categoryId);

  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return null;

  const promise = _loadCategoryContent(cat).then(data => {
    _contentCache.set(categoryId, data);
    _inflightCache.delete(categoryId);
    return data;
  });

  _inflightCache.set(categoryId, promise);
  return promise;
}

/* ══════════════════════════════════════════════
   ESTATÍSTICAS
══════════════════════════════════════════════ */
function _renderStats() {
  const nCats = CATEGORIES.length;

  if (EL.heroStats) {
    EL.heroStats.innerHTML = `
      <div class="library-hero-stat">
        <span class="library-hero-stat__num">${nCats}</span>
        <span class="library-hero-stat__sep"></span>
        <span>disciplinas</span>
      </div>`;
  }

  if (EL.headerStats) {
    EL.headerStats.textContent = `${nCats} disciplina${nCats !== 1 ? 's' : ''}`;
  }

  if (EL.categoriesCount) {
    EL.categoriesCount.textContent = `${nCats} disciplinas`;
  }
}

/* ══════════════════════════════════════════════
   HEADER BREADCRUMB
══════════════════════════════════════════════ */
function _renderBreadcrumb() {
  // Logo fixa no centro do header — sem alteração necessária.
}

/* ══════════════════════════════════════════════
   NÍVEL 1 — GRID DE DISCIPLINAS
══════════════════════════════════════════════ */
function _renderCategoriesGrid(cats) {
  if (!EL.catGrid) return;

  if (!cats.length) {
    EL.catGrid.innerHTML = `
      <div class="library-empty-state">
        <span class="library-empty-state__icon">🔍</span>
        <h3>Nenhuma disciplina encontrada</h3>
        <p>Tente outro termo de busca.</p>
      </div>`;
    return;
  }

  EL.catGrid.innerHTML = cats.map(cat => `
    <article
      class="library-cat-card"
      data-cat-id="${_esc(cat.id)}"
      data-theme="${_esc(cat.theme)}"
      tabindex="0"
      role="button"
      aria-label="Abrir disciplina ${_esc(cat.name)}"
    >
      <div class="library-cat-card__glow"></div>

      <button
        class="library-cat-card__fav ${Favorites.has(cat.id) ? 'is-active' : ''}"
        data-fav-id="${_esc(cat.id)}"
        aria-label="Favoritar ${_esc(cat.name)}"
        title="Favoritar"
        type="button"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </button>

      <div class="library-cat-card__body-wrap">
        <span class="library-cat-card__icon"${_iconStyleAttr(cat.color)} aria-hidden="true">${_renderIcon(cat.icon)}</span>

        <div class="library-cat-card__text">
          <div class="library-cat-card__name">${_esc(cat.name)}</div>
          <div class="library-cat-card__desc">${_esc(cat.desc)}</div>
        </div>

        <span class="library-cat-card__arrow" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
          </svg>
        </span>
      </div>

      <div class="library-cat-card__footer">
        <span class="library-cat-card__stat">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <span data-stat-chapters="${_esc(cat.id)}">— capítulos</span>
        </span>

        <span class="library-cat-card__stat-sep" aria-hidden="true"></span>

        <span class="library-cat-card__stat">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          ${_esc(cat.type ?? 'Documentação')}
        </span>
      </div>
    </article>
  `).join('');

  EL.catGrid.querySelectorAll('.library-cat-card').forEach(card => {
    const id = card.dataset.catId;

    card.querySelector('[data-fav-id]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const favId  = e.currentTarget.dataset.favId;
      const result = Favorites.toggle(favId);

      if (result === null) {
        _toast('Você pode ter no máximo 8 disciplinas favoritas.');
        e.currentTarget.classList.add('fav-limit');
        setTimeout(() => e.currentTarget.classList.remove('fav-limit'), 600);
        return;
      }

      e.currentTarget.classList.toggle('is-active', result);
      _renderAtlasSidebar();
      playSound(result ? 'click' : 'hover', 'atlas');
    });

    card.addEventListener('mouseenter', () => playSound('hover', 'atlas'));
    card.addEventListener('click', () => {
      playSound('click', 'atlas');
      _abrirDisciplina(id);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _abrirDisciplina(id); }
    });
  });

  cats.forEach(async cat => {
    try {
      const data  = await _getCategoryContent(cat.id);
      const nCaps = Array.isArray(data?.secoes) ? data.secoes.length : 0;
      const el    = EL.catGrid?.querySelector(`[data-stat-chapters="${cat.id}"]`);
      if (el) el.textContent = `${nCaps} ${nCaps === 1 ? 'capítulo' : 'capítulos'}`;
    } catch { /* silencioso */ }
  });
}

/* ══════════════════════════════════════════════
   TELA HOME — renderização
══════════════════════════════════════════════ */
function _renderHomeScreen() {
  if (!EL.screenHome) return;

  EL.screenHome.innerHTML = `
    <section class="library-hero" id="hero">
      <div class="library-hero__inner">
        <div class="library-hero__text-block">
          <div class="library-hero__eyebrow">
            <span class="library-hero__eyebrow-dot" aria-hidden="true"></span>
            <span>Biblioteca</span>
          </div>
          <h1 class="library-hero__title">
            <span class="library-hero__title-main">Atlas</span>
          </h1>
          <p class="library-hero__desc">
            Documentações e materiais do Nexus Study<br>
            reunidos em um só lugar.
          </p>
          <div class="library-search-wrap">
            <div class="library-search-box" id="search-box">
              <svg class="library-search-box__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                class="library-search-box__input"
                id="search-input"
                type="search"
                placeholder="Buscar disciplina…"
                autocomplete="off"
                spellcheck="false"
              />
              <div class="library-search-box__kbd-wrap" aria-hidden="true">
                <span class="library-search-box__kbd">⌘</span>
                <span class="library-search-box__kbd">K</span>
              </div>
            </div>
          </div>
          <div class="library-hero__stats" id="hero-stats"></div>
        </div>
        <div class="library-hero__ornament" aria-hidden="true">
          <svg class="library-hero__book" viewBox="0 0 220 190" xmlns="http://www.w3.org/2000/svg">
            <path d="M110 38 C100 28 58 20 26 26 C23 27 22 29 22 32 L22 138 C22 142 24 144 27 143.5
                     C58 137.5 100 148 110 162
                     C120 148 162 137.5 193 143.5 C196 144 198 142 198 138
                     L198 32 C198 29 197 27 194 26 C162 20 120 28 110 38 Z"
                  stroke="rgba(99,102,241,0.22)" stroke-width="1.5" fill="none"/>
            <path d="M110 30 C100 21 62 14 32 20 C29.5 20.5 29 22 29 24.5 L29 130 C29 133 30.5 134.5 33 134
                     C62 128.5 100 138 110 154
                     C120 138 158 128.5 187 134 C189.5 134.5 191 133 191 130
                     L191 24.5 C191 22 190.5 20.5 188 20 C158 14 120 21 110 30 Z"
                  stroke="rgba(99,102,241,0.55)" stroke-width="1.6" fill="none"/>
            <line x1="42" y1="42" x2="100" y2="48" stroke="rgba(99,102,241,0.20)" stroke-width="1"/>
            <line x1="40" y1="58" x2="100" y2="64" stroke="rgba(99,102,241,0.16)" stroke-width="1"/>
            <line x1="38" y1="74" x2="100" y2="80" stroke="rgba(99,102,241,0.12)" stroke-width="1"/>
            <line x1="37" y1="90" x2="100" y2="96" stroke="rgba(99,102,241,0.08)" stroke-width="1"/>
            <line x1="120" y1="48" x2="178" y2="42" stroke="rgba(99,102,241,0.20)" stroke-width="1"/>
            <line x1="120" y1="64" x2="180" y2="58" stroke="rgba(99,102,241,0.16)" stroke-width="1"/>
            <line x1="120" y1="80" x2="182" y2="74" stroke="rgba(99,102,241,0.12)" stroke-width="1"/>
            <line x1="120" y1="96" x2="183" y2="90" stroke="rgba(99,102,241,0.08)" stroke-width="1"/>
            <path d="M110 30 C110 30 110 110 110 154"
                  stroke="rgba(99,102,241,0.9)" stroke-width="2.5" fill="none"
                  filter="url(#glow-spine)"/>
            <circle cx="90"  cy="14" r="1.5" fill="rgba(99,102,241,0.6)"/>
            <circle cx="110" cy="8"  r="2"   fill="rgba(99,102,241,0.8)"/>
            <circle cx="130" cy="14" r="1.5" fill="rgba(99,102,241,0.6)"/>
            <circle cx="72"  cy="20" r="1"   fill="rgba(99,102,241,0.3)"/>
            <circle cx="148" cy="20" r="1"   fill="rgba(99,102,241,0.3)"/>
            <circle cx="55"  cy="40" r="1"   fill="rgba(34,211,238,0.4)"/>
            <circle cx="165" cy="36" r="1.2" fill="rgba(34,211,238,0.5)"/>
            <circle cx="195" cy="65" r="0.8" fill="rgba(99,102,241,0.4)"/>
            <defs>
              <filter id="glow-spine" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </section>

    <section class="library-categories-section" id="categories-section">
      <div class="library-section-header">
        <div class="library-section-header__left">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
               style="color:var(--indigo);opacity:0.8">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
          <div>
            <h2 class="library-section-title">Disciplinas</h2>
            <p class="library-section-subtitle">Explore as disciplinas disponíveis na plataforma</p>
          </div>
        </div>
        <span class="library-section-count" id="categories-count"></span>
      </div>
      <div class="library-categories-grid" id="categories-grid"></div>
    </section>
  `;

  // Reconecta referências dinâmicas
  EL.searchInput     = $('search-input');
  EL.catGrid         = $('categories-grid');
  EL.categoriesCount = $('categories-count');
  EL.heroStats       = $('hero-stats');

  _renderStats();
  _renderCategoriesGrid(CATEGORIES);

  EL.searchInput?.addEventListener('input', e => {
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => _handleSearch(e.target.value), 160);
  });
}

/* ══════════════════════════════════════════════
   TELA MATERIAIS — renderização
══════════════════════════════════════════════ */
function _renderMaterialsScreen() {
  if (!EL.screenHome) return;

  EL.screenHome.innerHTML = `
    <section class="library-hero" id="hero">
      <div class="library-hero__inner">
        <div class="library-hero__text-block">
          <div class="library-hero__eyebrow">
            <span class="library-hero__eyebrow-dot" aria-hidden="true"></span>
            <span>Materiais</span>
          </div>
          <h1 class="library-hero__title">
            <span class="library-hero__title-main">Materiais</span>
          </h1>
          <p class="library-hero__desc">
            Referências externas, documentações oficiais<br>
            e recursos de estudo reunidos.
          </p>
        </div>
      </div>
    </section>

    <section class="library-categories-section">
      <div class="library-section-header">
        <div class="library-section-header__left">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
               style="color:var(--indigo);opacity:0.8">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <div>
            <h2 class="library-section-title">Hub de Materiais</h2>
            <p class="library-section-subtitle">Recursos externos organizados por tipo</p>
          </div>
        </div>
      </div>
      <div class="materials-grid">
        ${_buildMaterialsCategories()}
      </div>
    </section>
  `;
}

function _buildMaterialsCategories() {
  const groups = [
    {
      icon:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
      label: 'GitHub',
      color: '139,148,158',
      items: CATEGORIES.flatMap(c => (c.resources ?? []).filter(r => r.url?.includes('github'))),
    },
    {
      icon:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
      label: 'Documentação',
      color: '99,102,241',
      items: CATEGORIES.flatMap(c => (c.resources ?? []).filter(r => !r.url?.includes('github'))),
    },
    {
      icon:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
      label: 'Vídeos',
      color: '239,68,68',
      items: [],
    },
    {
      icon:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
      label: 'Livros',
      color: '245,158,11',
      items: [],
    },
    {
      icon:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
      label: 'Artigos',
      color: '52,211,153',
      items: [],
    },
    {
      icon:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      label: 'Referências',
      color: '168,85,247',
      items: [],
    },
  ];

  return groups.map(g => `
    <div class="materials-group">
      <div class="materials-group__header" style="--mat-rgb:${g.color}">
        <span class="materials-group__icon" style="--mat-rgb:${g.color}">${g.icon}</span>
        <span class="materials-group__label">${_esc(g.label)}</span>
        <span class="materials-group__count">${g.items.length}</span>
      </div>
      <div class="materials-group__body">
        ${g.items.length
          ? g.items.map(r => `
              <a class="materials-item" href="${_esc(r.url ?? '#')}" target="_blank" rel="noopener">
                <span class="materials-item__title">${_esc(r.title ?? r.display ?? r.url ?? '')}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>`).join('')
          : `<div class="materials-group__empty">Nenhum material cadastrado ainda</div>`
        }
      </div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════════
   HEADER BACK / BREADCRUMB
   No reader: o slot esquerdo do header vira
   breadcrumb navegável  (atlas / Disciplina / Capítulo).
   Nas demais telas: volta ao btn-back padrão.
══════════════════════════════════════════════ */
function _renderHeaderBack() {
  const slot = EL.headerLeftSlot;
  if (!slot) return;

  if (State.view === 'reader') {
    // Breadcrumb substitui completamente o btn-back no slot esquerdo
    // (o toggle de sidebar mobile fica na col direita do header)
    const cat   = CATEGORIES.find(c => c.id === State.currentCategory);
    const data  = _contentCache.get(State.currentCategory);
    const secoes = Array.isArray(data?.secoes) ? data.secoes : [];
    const secao  = secoes[State.currentChapter ?? 0];

    slot.innerHTML = `
      <nav class="reader-header-breadcrumb" aria-label="Localização">
        <span class="crumb" data-crumb="home">atlas</span>
        <span class="crumb-sep">/</span>
        <span class="crumb" data-crumb="discipline">${_esc(cat?.name ?? '')}</span>
        <span class="crumb-sep">/</span>
        <span class="crumb crumb--current">${_esc(secao?.titulo ?? '')}</span>
      </nav>`;

    slot.querySelector('[data-crumb="home"]')?.addEventListener('click', () => {
      playSound('click', 'atlas');
      _fecharReader({ toHome: true });
    });
    slot.querySelector('[data-crumb="discipline"]')?.addEventListener('click', () => {
      playSound('click', 'atlas');
      _fecharReader({ toDiscipline: true });
    });

    // Mostra o toggle de sidebar mobile no header
    if (EL.readerSidebarToggle) EL.readerSidebarToggle.hidden = false;

    return;
  }

  // Oculta o toggle de sidebar mobile fora do reader
  if (EL.readerSidebarToggle) EL.readerSidebarToggle.hidden = true;

  if (State.view === 'discipline') {
    slot.innerHTML = `
      <button class="library-btn-back" id="btn-back" type="button" title="Voltar ao Atlas">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
        </svg>
        <span>Voltar ao Atlas</span>
      </button>`;
    slot.querySelector('#btn-back')?.addEventListener('click', () => {
      playSound('click', 'atlas');
      State.currentCategory = null;
      _showScreen('home');
      _renderBreadcrumb();
    });
  } else {
    // home / materials — link para o Início do projeto
    slot.innerHTML = `
      <a href="../index.html" class="library-btn-back" id="btn-back" title="Início">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
        </svg>
        <span>Início</span>
      </a>`;
  }

  // Atualiza a referência ao novo elemento
  EL.headerBtnBack = $('btn-back');
}

/* ══════════════════════════════════════════════
   NAVEGAÇÃO ENTRE TELAS
   _showScreen é o único ponto de troca de tela.
   O reader ('reader') é tratado exatamente igual
   às outras views — sem lógica especial.
══════════════════════════════════════════════ */
function _showScreen(view) {
  State.view = view;

  const screens = {
    home:       EL.screenHome,
    materials:  EL.screenHome,
    discipline: EL.screenDiscipline,
    reader:     EL.screenReader,
  };

  // Esconde todas as screens
  Object.values(screens)
    .filter((el, i, arr) => el && arr.indexOf(el) === i)
    .forEach(el => { el.hidden = true; });

  // Exibe a screen alvo
  const target = screens[view];
  if (target) target.hidden = false;

  // Barra de progresso: visível apenas na leitura
  if (EL.readerProgress) EL.readerProgress.hidden = (view !== 'reader');

  // Renderiza conteúdo específico da tela
  if (view === 'home')      _renderHomeScreen();
  if (view === 'materials') _renderMaterialsScreen();

  document.body.style.overflow = '';

  _renderAtlasSidebar();
  _renderHeaderBack();
}

/* ══════════════════════════════════════════════
   NÍVEL 2 — TELA DE DISCIPLINA
══════════════════════════════════════════════ */
async function _abrirDisciplina(categoryId) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return;

  State.currentCategory = categoryId;
  State.currentChapter  = null;

  _showScreen('discipline');
  _renderBreadcrumb();
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

  _renderDisciplineLoading(cat);

  const data = await _getCategoryContent(categoryId);
  if (State.currentCategory !== categoryId || State.view !== 'discipline') return;

  _renderDisciplineScreen(cat, data);
}

/* ══════════════════════════════════════════════
   ÍCONES DE MÓDULO — fallback por posição
══════════════════════════════════════════════ */
const _MODULE_ICONS = [
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 2 13 9 20 9"/><path d="M20 21H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l7 7v11a2 2 0 0 1-2 2z"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
];

function _moduleIcon(idx) {
  return _MODULE_ICONS[idx % _MODULE_ICONS.length];
}

/* ──────────────────────────────────────────────
   _renderDisciplineLoading
────────────────────────────────────────────── */
function _renderDisciplineLoading(cat) {
  if (!EL.screenDiscipline) return;

  const colorStyle = _iconStyleAttr(cat.color);

  EL.screenDiscipline.innerHTML = `
    <main class="subject-main">
      <div class="subject-hero-banner"${colorStyle}>
        <div class="subject-hero-banner__icon"${colorStyle}>${_renderIcon(cat.icon)}</div>
        <div class="subject-hero-banner__content">
          <h1 class="subject-hero-banner__title">${_esc(cat.name)}</h1>
          <p class="subject-hero-banner__desc">${_esc(cat.desc)}</p>
          <div class="subject-hero-banner__chips"></div>
        </div>
      </div>
      <h2 class="subject-content-header">Conteúdo da disciplina</h2>
      <div class="subject-module-list">
        <div class="subject-empty-state">
          <span class="subject-empty-state__icon">⏳</span>
          <h3>Carregando conteúdo…</h3>
          <p>Buscando os módulos desta disciplina.</p>
        </div>
      </div>
    </main>
    ${_buildDisciplineRightSidebar(cat, [])}
  `;
}

/* ──────────────────────────────────────────────
   _renderDisciplineScreen
────────────────────────────────────────────── */
function _renderDisciplineScreen(cat, data) {
  if (!EL.screenDiscipline) return;

  const secoes     = Array.isArray(data?.secoes) ? data.secoes : [];
  const colorStyle = _iconStyleAttr(cat.color);

  const chips = [];
  chips.push(`
    <span class="subject-chip">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
      ${secoes.length} ${secoes.length === 1 ? 'módulo' : 'módulos'}
    </span>`);

  if (data?.type) {
    chips.push(`<span class="subject-chip">${_esc(data.type)}</span>`);
  }

  const moduleCards = secoes.length
    ? secoes.map((s, i) => `
      <article class="subject-module-card" data-chapter-index="${i}" tabindex="0" role="button" aria-label="Abrir ${_esc(s.titulo ?? '')}">
        <span class="subject-module-card__icon">
          ${s.icone && _isSvgIcon(s.icone) ? s.icone : _moduleIcon(i)}
        </span>
        <div class="subject-module-card__body">
          <div class="subject-module-card__title">${_esc(s.titulo ?? `Módulo ${i + 1}`)}</div>
          <div class="subject-module-card__desc">${_esc(s.desc ?? `${(s.blocos ?? []).length} blocos de conteúdo`)}</div>
        </div>
        <span class="subject-module-card__count">${(s.blocos ?? []).length} ${(s.blocos ?? []).length === 1 ? 'tópico' : 'tópicos'}</span>
        <span class="subject-module-card__arrow" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
          </svg>
        </span>
      </article>`).join('')
    : `<div class="subject-empty-state">
        <span class="subject-empty-state__icon">📭</span>
        <h3>Nenhum conteúdo disponível ainda</h3>
        <p>Esta disciplina ainda não tem módulos publicados.</p>
      </div>`;

  EL.screenDiscipline.innerHTML = `
    <main class="subject-main">
      <div class="subject-hero-banner"${colorStyle}>
        <div class="subject-hero-banner__icon"${colorStyle}>${_renderIcon(cat.icon)}</div>
        <div class="subject-hero-banner__content">
          <h1 class="subject-hero-banner__title">${_esc(data?.title ?? cat.name)}</h1>
          <p class="subject-hero-banner__desc">${_esc(data?.desc ?? cat.desc)}</p>
          <div class="subject-hero-banner__chips">${chips.join('')}</div>
        </div>
      </div>
      <h2 class="subject-content-header">Conteúdo da disciplina</h2>
      <div class="subject-module-list" id="discipline-body">
        ${moduleCards}
      </div>
      <div class="subject-hint-bar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        Navegue pelos módulos ao lado para explorar todos os conteúdos desta disciplina.
      </div>
    </main>
    ${_buildDisciplineRightSidebar(cat, secoes)}
  `;

  EL.screenDiscipline.querySelectorAll('[data-chapter-index]').forEach(card => {
    const idx = parseInt(card.dataset.chapterIndex, 10);
    card.addEventListener('mouseenter', () => playSound('hover', 'atlas'));
    card.addEventListener('click',      () => { playSound('click', 'atlas'); _abrirReader(cat.id, idx); });
    card.addEventListener('keydown',    (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _abrirReader(cat.id, idx); }
    });
  });

  EL.screenDiscipline.querySelectorAll('[data-toc-index]').forEach(btn => {
    btn.addEventListener('click', () => {
      EL.screenDiscipline.querySelectorAll('[data-toc-index]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const idx  = parseInt(btn.dataset.tocIndex, 10);
      const card = EL.screenDiscipline.querySelector(`[data-chapter-index="${idx}"]`);
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

/* ══════════════════════════════════════════════
   SIDEBAR NAV
══════════════════════════════════════════════ */
function _buildAtlasSidebarNav(view) {
  const navLinks = [
    {
      svg:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
      label:  'Biblioteca',
      action: 'all',
    },
    {
      svg:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
      label:  'Materiais',
      action: 'materials',
    },
  ];

  return navLinks.map(l => {
    const isActive = (l.action === 'all'       && (view === 'home' || view === 'reader' || view === 'discipline'))
                  || (l.action === 'materials' && view === 'materials');
    // reader e discipline ficam com "Biblioteca" ativo na sidebar, mantendo contexto
    const activeLib = l.action === 'all'
      && (view === 'home' || view === 'reader' || view === 'discipline');
    const activeMat = l.action === 'materials' && view === 'materials';

    return `
      <button
        class="atlas-sidebar__nav-link${(activeLib || activeMat) ? ' atlas-sidebar__nav-link--active' : ''}"
        data-nav-action="${_esc(l.action)}"
        type="button"
      >
        ${l.svg}
        ${_esc(l.label)}
      </button>`;
  }).join('');
}

/* ══════════════════════════════════════════════
   SIDEBAR — build
══════════════════════════════════════════════ */
function _buildAtlasSidebar(activeCatId) {
  const favIds  = Favorites.getAll();
  const favCats = CATEGORIES.filter(c => favIds.has(c.id));

  const discLinks = favCats.length
    ? favCats.map(c => {
        const isActive  = c.id === activeCatId;
        const colorAttr = _iconStyleAttr(c.color);
        return `
          <button class="atlas-sidebar__disc-link${isActive ? ' is-active' : ''}"
                  data-disc-id="${_esc(c.id)}" type="button">
            <span class="atlas-sidebar__disc-link__icon"${colorAttr}>
              ${_renderIcon(c.icon)}
            </span>
            <span class="atlas-sidebar__disc-link__name">${_esc(c.name)}</span>
            ${isActive ? `<span class="atlas-sidebar__disc-link__close" aria-hidden="true">✕</span>` : ''}
          </button>`;
      }).join('')
    : `<div class="atlas-sidebar__empty">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span>Nenhuma favorita ainda</span>
      </div>`;

  return `
    <aside class="atlas-sidebar" id="atlas-sidebar" aria-label="Navegação do Atlas">
      <div class="atlas-sidebar__section">
        <span class="atlas-sidebar__section-label">Biblioteca</span>
        ${_buildAtlasSidebarNav(State.view)}
      </div>
      <div class="atlas-sidebar__section">
        <span class="atlas-sidebar__section-label">Minhas disciplinas</span>
        ${discLinks}
      </div>
    </aside>`;
}

/* ══════════════════════════════════════════════
   SIDEBAR — render e bind
══════════════════════════════════════════════ */
function _renderAtlasSidebar() {
  const mount = $('atlas-sidebar-mount');
  if (!mount) return;
  mount.innerHTML = _buildAtlasSidebar(State.currentCategory);
  _bindAtlasSidebarEvents();
}

function _bindAtlasSidebarEvents() {
  const mount = $('atlas-sidebar-mount');
  if (!mount) return;

  mount.querySelector('[data-nav-action="all"]')?.addEventListener('click', () => {
    playSound('click', 'atlas');
    State.currentCategory = null;
    State.currentChapter  = null;
    _cleanupProgress();
    _showScreen('home');
    _renderBreadcrumb();
  });

  mount.querySelector('[data-nav-action="materials"]')?.addEventListener('click', () => {
    playSound('click', 'atlas');
    State.currentCategory = null;
    State.currentChapter  = null;
    _cleanupProgress();
    _showScreen('materials');
    _renderBreadcrumb();
  });

  mount.querySelectorAll('[data-disc-id]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.discId;
      if (id && id !== State.currentCategory) {
        playSound('click', 'atlas');
        _cleanupProgress();
        _abrirDisciplina(id);
      }
    });
  });
}

/* ══════════════════════════════════════════════
   SIDEBAR DIREITA DA DISCIPLINA
══════════════════════════════════════════════ */
function _buildDisciplineRightSidebar(cat, secoes) {
  const tocItems = secoes.map((s, i) => `
    <button class="subject-toc-item${i === 0 ? ' is-active' : ''}" data-toc-index="${i}" type="button">
      ${_esc(s.titulo ?? `Módulo ${i + 1}`)}
    </button>`).join('');

  const quickItems = [
    {
      svg:   `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
      title: 'Buscar na disciplina',
      sub:   'Encontre tópicos e conteúdos',
    },
    {
      svg:   `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
      title: 'Ver índice completo',
      sub:   'Navegue por toda a estrutura',
    },
    {
      svg:   `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
      title: 'Downloads',
      sub:   'Materiais complementares',
    },
    {
      svg:   `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
      title: 'Referências',
      sub:   'Documentação oficial',
    },
  ].map(q => `
    <div class="subject-quick-item">
      <span class="subject-quick-item__icon">${q.svg}</span>
      <span class="subject-quick-item__text">
        <span class="subject-quick-item__title">${_esc(q.title)}</span>
        <span class="subject-quick-item__sub">${_esc(q.sub)}</span>
      </span>
    </div>`).join('');

  const catResources = Array.isArray(cat?.resources) && cat.resources.length
    ? cat.resources
    : [
        { title: 'Documentação Oficial', url: '#', display: `docs.${cat.id ?? 'exemplo'}.org` },
        { title: 'Exemplos de Código',   url: '#', display: 'github.com' },
      ];

  const resourceItems = catResources.map(r => `
    <a class="subject-resource-item" href="${_esc(r.url ?? '#')}" target="_blank" rel="noopener">
      <span class="subject-resource-item__icon">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
      </span>
      <span class="subject-resource-item__text">
        <span class="subject-resource-item__title">${_esc(r.title)}</span>
        <span class="subject-resource-item__url">${_esc(r.display ?? r.url ?? '')}</span>
      </span>
      <span class="subject-resource-item__ext" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </span>
    </a>`).join('');

  return `
    <aside class="subject-right-sidebar" aria-label="Atalhos e recursos">
      <div class="subject-right-panel">
        <div class="subject-right-panel__header">Nesta página</div>
        <div class="subject-toc-list">
          ${tocItems || '<div style="padding:0.5rem 1rem;font-size:0.72rem;color:var(--t3)">Nenhum módulo ainda</div>'}
        </div>
      </div>
      <div class="subject-right-panel">
        <div class="subject-right-panel__header">Atalhos rápidos</div>
        <div class="subject-quick-list">${quickItems}</div>
      </div>
      <div class="subject-right-panel">
        <div class="subject-right-panel__header">Recursos da disciplina</div>
        <div class="subject-resource-list">${resourceItems}</div>
      </div>
    </aside>`;
}

/* ══════════════════════════════════════════════
   SIDEBAR DO READER — apenas capítulos
   A seção "Disciplinas" foi removida.
   A navegação entre disciplinas fica na atlas-sidebar.
══════════════════════════════════════════════ */
function _renderSidebar(categoryId, chapterIndex) {
  const cat    = CATEGORIES.find(c => c.id === categoryId);
  const data   = _contentCache.get(categoryId);
  const secoes = Array.isArray(data?.secoes) ? data.secoes : [];

  // Label do grupo de capítulos
  if (EL.sidebarCurrentLabel && cat) {
    EL.sidebarCurrentLabel.textContent = `Capítulos · ${cat.name}`;
  }

  if (EL.sidebarChapters) {
    const groups = _buildChapterGroups(categoryId, secoes);

    EL.sidebarChapters.innerHTML = groups.map(group => `
      <div class="reader-sidebar-chapter-group">
        ${groups.length > 1
          ? `<div class="reader-sidebar-chapter-group__title">${_esc(group.titulo)}</div>`
          : ''}
        ${group.secoes.map(secao => `
          <div class="reader-sidebar-chapter-link ${secao._index === chapterIndex ? 'is-active' : ''}"
               data-chapter-index="${secao._index}">
            ${_esc(secao.titulo ?? '')}
          </div>
        `).join('')}
      </div>
    `).join('');

    EL.sidebarChapters.querySelectorAll('.reader-sidebar-chapter-link').forEach(link => {
      link.addEventListener('click', () => {
        const idx = parseInt(link.dataset.chapterIndex, 10);
        if (idx === chapterIndex) return;
        playSound('click', 'atlas');
        _abrirReader(categoryId, idx, { fromSidebar: true });
      });
    });
  }
}

/* _renderReaderBreadcrumb foi removido.
   O breadcrumb do reader é renderizado por
   _renderHeaderBack() no slot esquerdo do header global. */

/* ══════════════════════════════════════════════
   NÍVEL 3 — READER (screen oficial)

   _abrirReader: troca para a screen 'reader'
   (igual a _showScreen('home')), sem modal,
   sem overlay, sem animação de drawer.
══════════════════════════════════════════════ */
async function _abrirReader(categoryId, chapterIndex, opts = {}) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return;

  State.currentCategory = categoryId;
  State.currentChapter  = chapterIndex;

  // Exibe a screen do reader (troca de tela normal)
  // _showScreen chama _renderHeaderBack que monta o breadcrumb no header
  _showScreen('reader');
  _renderBreadcrumb();

  if (EL.readerBody)       EL.readerBody.innerHTML       = _buildLoadingBody();
  if (EL.readerChapterNav) EL.readerChapterNav.innerHTML = '';
  if (EL.readerScroll)     EL.readerScroll.scrollTop     = 0;

  const data = await _getCategoryContent(categoryId);

  if (State.currentCategory !== categoryId || State.currentChapter !== chapterIndex) return;
  if (State.view !== 'reader') return;

  const secoes = Array.isArray(data?.secoes) ? data.secoes : [];
  const secao  = secoes[chapterIndex];

  _renderSidebar(categoryId, chapterIndex);

  // Atualiza o breadcrumb com o título real do capítulo (disponível após carregar)
  _renderHeaderBack();

  _renderAtlasHero(cat, data, secao);
  _renderAtlasBody(secao, categoryId);
  _renderChapterNav(cat, secoes, chapterIndex);

  _closeMobileSidebar();
  _cleanupProgress();
  _setupProgress();
}

/* ══════════════════════════════════════════════
   _fecharReader
   Navega de volta para a disciplina ou para home.
   Sem setTimeout, sem animação de fechamento —
   é simplesmente uma troca de screen.
══════════════════════════════════════════════ */
function _fecharReader(opts = {}) {
  _cleanupProgress();
  _closeMobileSidebar();

  if (EL.readerProgressFill) EL.readerProgressFill.style.width = '0%';

  if (opts.toHome) {
    State.currentCategory = null;
    State.currentChapter  = null;
    _showScreen('home');
  } else if (opts.toDiscipline) {
    const categoryId      = State.currentCategory;
    State.currentChapter  = null;
    _showScreen('discipline');
    const cat  = CATEGORIES.find(c => c.id === categoryId);
    const data = _contentCache.get(categoryId);
    if (cat && data) _renderDisciplineScreen(cat, data);
    else if (cat)    _renderDisciplineLoading(cat);
  } else if (!opts.silent) {
    const categoryId     = State.currentCategory;
    State.currentChapter = null;
    _showScreen('discipline');
    const cat  = CATEGORIES.find(c => c.id === categoryId);
    const data = _contentCache.get(categoryId);
    if (cat && data) _renderDisciplineScreen(cat, data);
    else if (cat)    _renderDisciplineLoading(cat);
  } else {
    State.currentChapter = null;
    _showScreen('discipline');
  }

  _renderBreadcrumb();
}

/* ══════════════════════════════════════════════
   HERO DO READER — sem tempo de leitura
══════════════════════════════════════════════ */
function _renderAtlasHero(cat, data, secao) {
  if (EL.readerHeroCategory) {
    EL.readerHeroCategory.innerHTML = `<span style="margin-right:0.4rem;opacity:0.8">${_renderIcon(cat.icon)}</span>${_esc(cat.name)}`;
  }
  if (EL.readerHeroTitle) EL.readerHeroTitle.textContent = secao?.titulo ?? data.title ?? cat.name;
  if (EL.readerHeroDesc)  EL.readerHeroDesc.textContent  = data.desc ?? cat.desc;

  if (EL.readerHeroChips) {
    const chips = [];
    // Apenas tipo de conteúdo — tempo removido completamente
    if (data.type) {
      chips.push(`
        <span class="reader__chip">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          ${_esc(data.type)}
        </span>`);
    }
    EL.readerHeroChips.innerHTML = chips.join('');
  }
}

function _buildLoadingBody() {
  return `
    <div class="reader__placeholder">
      <span class="reader__placeholder-icon">⏳</span>
      <h3>Carregando conteúdo…</h3>
      <p>Buscando este capítulo.</p>
    </div>`;
}

/* ══════════════════════════════════════════════
   RENDERIZADOR DE CONTEÚDO
══════════════════════════════════════════════ */
function _renderAtlasBody(secao, categoryId) {
  if (!EL.readerBody) return;

  if (!secao) {
    EL.readerBody.innerHTML = _buildLoadingBody();
    return;
  }

  EL.readerBody.innerHTML = `
    <section class="kb-section">
      ${(secao.blocos ?? []).map(b => _renderBloco(b, categoryId)).join('')}
    </section>
  `;
}

function _escRich(str) {
  let safe = _esc(str ?? '');
  safe = safe.replace(/`([^`]+)`/g,       '<code>$1</code>');
  safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return safe;
}

function _renderBloco(bloco, categoryId) {
  switch (bloco.tipo) {
    case 'texto':
      return `<p class="kb-block-texto">${_escRich(bloco.texto)}</p>`;

    case 'subtitulo':
      return `<h3 class="kb-section__subtitle">${_esc(bloco.texto)}</h3>`;

    case 'lista':
      return `<ul class="kb-block-lista">${(bloco.itens ?? [])
        .map(item => `<li>${_escRich(item)}</li>`).join('')}</ul>`;

    case 'tabela': {
      const cabecalho = bloco.cabecalho ?? [];
      const linhas    = bloco.linhas    ?? [];
      return `
        <table class="kb-block-tabela">
          ${cabecalho.length ? `<thead><tr>${cabecalho.map(h => `<th>${_esc(h)}</th>`).join('')}</tr></thead>` : ''}
          <tbody>
            ${linhas.map(linha => `<tr>${linha.map(c => `<td>${_escRich(c)}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>`;
    }

    case 'codigo':
      return `<pre class="kb-block-codigo"><code>${_esc(bloco.codigo)}</code></pre>`;

    case 'alerta':
      return `<div class="kb-block-alerta">${bloco.icone ?? '⚠️'}&nbsp; ${_escRich(bloco.texto)}</div>`;

    case 'destaque':
      return `<div class="kb-block-destaque">${_escRich(bloco.texto)}</div>`;

    case 'imagem': {
      const base = `../content/atlas/imagens/${categoryId}/`;
      const src  = _esc(bloco.src ?? '');
      const alt  = _esc(bloco.legenda ?? bloco.src ?? '');
      const leg  = bloco.legenda
        ? `<figcaption class="kb-block-imagem__legenda">${_escRich(bloco.legenda)}</figcaption>`
        : '';
      return `
        <figure class="kb-block-imagem">
          <img src="${base}${src}" alt="${alt}" loading="lazy" />
          ${leg}
        </figure>`;
    }

    default:
      return '';
  }
}

/* ══════════════════════════════════════════════
   NAVEGAÇÃO ENTRE CAPÍTULOS
══════════════════════════════════════════════ */
function _renderChapterNav(cat, secoes, currentIndex) {
  if (!EL.readerChapterNav) return;

  const prev  = secoes[currentIndex - 1];
  const next  = secoes[currentIndex + 1];
  const parts = [];

  if (prev) {
    parts.push(`
      <div class="reader-chapter-nav-link reader-chapter-nav-link--prev" data-nav-index="${currentIndex - 1}">
        <span class="reader-chapter-nav-link__label">← Anterior</span>
        <span class="reader-chapter-nav-link__title">${_esc(prev.titulo ?? '')}</span>
      </div>`);
  } else {
    parts.push('<div></div>');
  }

  if (next) {
    parts.push(`
      <div class="reader-chapter-nav-link reader-chapter-nav-link--next" data-nav-index="${currentIndex + 1}">
        <span class="reader-chapter-nav-link__label">Próximo →</span>
        <span class="reader-chapter-nav-link__title">${_esc(next.titulo ?? '')}</span>
      </div>`);
  } else {
    parts.push('<div></div>');
  }

  EL.readerChapterNav.innerHTML = parts.join('');

  EL.readerChapterNav.querySelectorAll('.reader-chapter-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      playSound('click', 'atlas');
      _abrirReader(cat.id, parseInt(link.dataset.navIndex, 10));
    });
  });
}

/* ══════════════════════════════════════════════
   BARRA DE PROGRESSO DE LEITURA
══════════════════════════════════════════════ */
function _setupProgress() {
  const scrollEl = EL.readerScroll;
  const fill     = EL.readerProgressFill;
  if (!scrollEl || !fill) return;

  const handler = () => {
    const { scrollTop, scrollHeight, clientHeight } = scrollEl;
    const total = scrollHeight - clientHeight;
    const pct   = total > 0 ? Math.min(100, (scrollTop / total) * 100) : 0;
    fill.style.width = pct.toFixed(1) + '%';
  };

  scrollEl.addEventListener('scroll', handler, { passive: true });
  handler();
  State._progressCleanup = () => scrollEl.removeEventListener('scroll', handler);
}

function _cleanupProgress() {
  if (State._progressCleanup) {
    State._progressCleanup();
    State._progressCleanup = null;
  }
}

/* ══════════════════════════════════════════════
   SIDEBAR MOBILE DO READER (drawer interno)
══════════════════════════════════════════════ */
function _toggleMobileSidebar() {
  State.sidebarMobileOpen = !State.sidebarMobileOpen;
  EL.readerLayout?.classList.toggle('sidebar-open', State.sidebarMobileOpen);
}

function _closeMobileSidebar() {
  State.sidebarMobileOpen = false;
  EL.readerLayout?.classList.remove('sidebar-open');
}

/* ══════════════════════════════════════════════
   BUSCA
══════════════════════════════════════════════ */
function _handleSearch(query) {
  State.searchQuery = query.trim().toLowerCase();
  const q = State.searchQuery;

  const filtered = q
    ? CATEGORIES.filter(
        c => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
      )
    : CATEGORIES;

  _renderCategoriesGrid(filtered);

  if (EL.categoriesCount) {
    EL.categoriesCount.textContent = q
      ? `${filtered.length} de ${CATEGORIES.length} disciplinas`
      : `${CATEGORIES.length} disciplinas`;
  }
}

/* ══════════════════════════════════════════════
   ESTADO DE CARREGAMENTO INICIAL
══════════════════════════════════════════════ */
function _renderLoadingState() {
  if (!EL.catGrid) return;
  EL.catGrid.innerHTML = `
    <div class="library-empty-state" style="grid-column:1/-1">
      <span class="library-empty-state__icon">⏳</span>
      <h3>Carregando disciplinas…</h3>
      <p>Lendo manifest.js e os arquivos de conteúdo.</p>
    </div>`;
}

/* ══════════════════════════════════════════════
   BINDINGS DE EVENTOS GLOBAIS
══════════════════════════════════════════════ */
function _bindEvents() {
  // Toggle de sidebar mobile do reader (botão no header global)
  EL.readerSidebarToggle?.addEventListener('click', _toggleMobileSidebar);
  EL.readerSidebarScrim?.addEventListener('click',  _closeMobileSidebar);

  // Esc: fecha reader → discipline → home (cascata)
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (State.view === 'reader') {
      _fecharReader({ toDiscipline: true });
      return;
    }
    if (State.view === 'discipline') {
      State.currentCategory = null;
      _cleanupProgress();
      _showScreen('home');
      _renderBreadcrumb();
    }
  });

  // Busca com ⌘K / Ctrl+K
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (State.view !== 'home') {
        State.currentCategory = null;
        _cleanupProgress();
        _showScreen('home');
      }
      setTimeout(() => EL.searchInput?.focus(), 50);
    }
  });
}

/* ══════════════════════════════════════════════
   INICIALIZAÇÃO
══════════════════════════════════════════════ */
async function init() {
  Sound.init();
  installAudioRecovery({ Sound, audio });
  await Sound.waitUntilReady();

  injetarLogo('#header-logo-wrap');
  preencherAnos(['footer-year']);

  _carregarIA();

  _renderBreadcrumb();
  _renderLoadingState();
  _renderAtlasSidebar();
  _renderHeaderBack();
  _bindEvents();

  await _loadAllCategories();

  _renderStats();
  _renderBreadcrumb();
  _renderCategoriesGrid(CATEGORIES);
  _renderAtlasSidebar();

  // Deep link via query string: ?cat=linux&chapter=2
  const params     = new URLSearchParams(window.location.search);
  const catParam   = params.get('cat');
  const chapterRaw = params.get('chapter');

  if (catParam && CATEGORIES.some(c => c.id === catParam)) {
    if (chapterRaw !== null && !Number.isNaN(parseInt(chapterRaw, 10))) {
      const cat = CATEGORIES.find(c => c.id === catParam);
      State.currentCategory = catParam;
      _showScreen('discipline');
      _renderDisciplineLoading(cat);
      const data = await _getCategoryContent(catParam);
      _renderDisciplineScreen(cat, data);
      _abrirReader(catParam, parseInt(chapterRaw, 10));
    } else {
      _abrirDisciplina(catParam);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}