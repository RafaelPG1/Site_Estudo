// @ts-nocheck
/* ═══════════════════════════════════════════════════════════
   NEXUS STUDY — atlas/atlas.js
   Arquitetura em 3 níveis:

     Nível 1 — Biblioteca   (screen-home)
     Nível 2 — Disciplina   (screen-discipline)
     Nível 3 — Leitura      (reader, com sidebar fixa)

   Descoberta de categorias:
     1. Carrega atlas/manifest.js
        (expõe window.__atlasManifest = [ { id, title, desc,
         type, time, theme, icon, content }, ... ])
     2. Para cada entrada do manifest, o atlas.js monta os
        cards usando APENAS os metadados do manifest.
     3. Quando o usuário abre uma disciplina, carrega o
        arquivo indicado em disciplina.content via <script>.
     4. Une os metadados do manifest com o conteúdo carregado
        (window.__nexusatlas.secoes), mantendo o comportamento
        visual e funcional atual.

   Para adicionar uma nova disciplina:
     • Crie content/atlas/linux.js com window.__nexusatlas = { secoes: [...] }
     • Adicione a entrada completa (com metadados) em atlas/manifest.js
     • Pronto. Nenhuma outra mudança necessária aqui.

   Sistema de temas:
     • O manifest define theme: "indigo" (identificador semântico)
     • O atlas.js aplica data-theme="indigo" nos elementos relevantes
     • Toda a aparência é responsabilidade exclusiva do CSS:
         [data-theme="indigo"] { ... }
         [data-theme="emerald"] { ... }

   Infraestrutura compartilhada utilizada:
     • shared/js/utils/logo.js   → injetarLogo
     • shared/js/utils/dom.js    → preencherAnos
     • shared/js/audio/audio-api.js → Sound, audio, installAudioRecovery, playSound
     • shared/js/ia/core/fab.js  → injetado via HTML
     • shared/js/utils/quick-access.js → injetado via HTML
   ═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   IMPORTS — infraestrutura compartilhada
══════════════════════════════════════════════ */
import { injetarLogo }                                      from '../shared/js/utils/logo.js';
import { preencherAnos }                                    from '../shared/js/utils/dom.js';
import { Sound, audio, installAudioRecovery, playSound }   from '../shared/js/audio/audio-api.js';

/* ══════════════════════════════════════════════
   IA — contexto neutro
══════════════════════════════════════════════ */
window.__NEXUS_CONTEXT__ = { tipos: ['atlas'] };

function _loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src    = src;
    s.onload = resolve;
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
  view:              'home',
  currentCategory:   null,
  currentChapter:    null,
  searchQuery:       '',
  readerOpen:        false,
  sidebarMobileOpen: false,
  _progressCleanup:  null,
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

  screenDiscipline:        $('screen-discipline'),
  disciplineBack:          $('discipline-back'),
  disciplineIcon:          $('discipline-icon'),
  disciplineTitle:         $('discipline-title'),
  disciplineDesc:          $('discipline-desc'),
  disciplineMeta:          $('discipline-meta'),
  disciplineBody:          $('discipline-body'),

  reader:                  $('reader'),
  readerOverlay:           $('reader-overlay'),
  readerPanel:             $('reader-panel'),
  readerClose:             $('reader-close'),
  readerLayout:            $('reader-layout'),
  readerSidebar:           $('reader-sidebar'),
  readerSidebarScrim:      $('reader-sidebar-scrim'),
  readerSidebarToggle:     $('reader-sidebar-toggle'),
  sidebarDisciplines:      $('sidebar-disciplines'),
  sidebarCurrentLabel:     $('sidebar-current-discipline'),
  sidebarChapters:         $('sidebar-chapters'),
  readerBreadcrumbInline:  $('reader-breadcrumb-inline'),
  readerScroll:            $('reader-scroll'),
  readerHeroCategory:      $('reader-hero-category'),
  readerHeroTitle:         $('reader-hero-title'),
  readerHeroDesc:          $('reader-hero-desc'),
  readerHeroChips:         $('reader-hero-chips'),
  readerBody:              $('reader-body'),
  readerChapterNav:        $('reader-chapter-nav'),
  readerTime:              $('reader-time'),
  readerProgressFill:      $('reader-progress-fill'),
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
  t.className    = 'nexus-toast';
  t.textContent  = msg;
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

const _contentCache = new Map();

async function _getCategoryContent(categoryId) {
  if (_contentCache.has(categoryId)) return _contentCache.get(categoryId);
  const cat  = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return null;
  const data = await _loadCategoryContent(cat);
  _contentCache.set(categoryId, data);
  return data;
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
  // O header usa a logo fixa no centro.
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
    card.addEventListener('mouseenter', () => playSound('hover',  'atlas'));
    card.addEventListener('click',      () => {
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
   NAVEGAÇÃO ENTRE TELAS
══════════════════════════════════════════════ */
function _showScreen(view) {
  State.view = view;
  if (EL.screenHome)       EL.screenHome.hidden       = view !== 'home';
  if (EL.screenDiscipline) EL.screenDiscipline.hidden = view !== 'discipline';
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
   Monta o esqueleto de loading da tela de disciplina.
   Gera o layout de 3 colunas com dados básicos do
   manifest (sem secoes ainda) e um spinner na coluna central.
────────────────────────────────────────────── */
function _renderDisciplineLoading(cat) {
  if (!EL.screenDiscipline) return;

  const colorStyle = _iconStyleAttr(cat.color);

  EL.screenDiscipline.innerHTML = `
    ${_buildDisciplineLeftSidebar(cat)}
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

  _bindDisciplineSidebarEvents(cat.id);
}

/* ──────────────────────────────────────────────
   _renderDisciplineScreen
   Renderiza a tela completa com dados carregados.
   Substitui todo o conteúdo de #screen-discipline
   com o layout de 3 colunas: sidebar esquerda +
   área central + sidebar direita.
────────────────────────────────────────────── */
function _renderDisciplineScreen(cat, data) {
  if (!EL.screenDiscipline) return;

  const secoes     = Array.isArray(data?.secoes) ? data.secoes : [];
  const colorStyle = _iconStyleAttr(cat.color);

  /* ── Chips do hero ── */
  const chips = [];
  chips.push(`
    <span class="subject-chip">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
      ${secoes.length} ${secoes.length === 1 ? 'módulo' : 'módulos'}
    </span>`);
  if (data?.time) {
    chips.push(`
      <span class="subject-chip">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        ${data.time} min de leitura
      </span>`);
  }
  if (data?.type) {
    chips.push(`<span class="subject-chip">${_esc(data.type)}</span>`);
  }

  /* ── Lista de módulos ── */
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
    ${_buildDisciplineLeftSidebar(cat)}
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        Navegue pelos módulos ao lado para explorar todos os conteúdos desta disciplina.
      </div>
    </main>
    ${_buildDisciplineRightSidebar(cat, secoes)}
  `;

  /* ── Bind: módulos abrem o reader ── */
  EL.screenDiscipline.querySelectorAll('[data-chapter-index]').forEach(card => {
    const idx = parseInt(card.dataset.chapterIndex, 10);
    card.addEventListener('mouseenter', () => playSound('hover', 'atlas'));
    card.addEventListener('click',      () => { playSound('click', 'atlas'); _abrirReader(cat.id, idx); });
    card.addEventListener('keydown',    (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _abrirReader(cat.id, idx); }
    });
  });

  /* ── Bind: TOC scrolls até o card do módulo ── */
  EL.screenDiscipline.querySelectorAll('[data-toc-index]').forEach(btn => {
    btn.addEventListener('click', () => {
      EL.screenDiscipline.querySelectorAll('[data-toc-index]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const idx  = parseInt(btn.dataset.tocIndex, 10);
      const card = EL.screenDiscipline.querySelector(`[data-chapter-index="${idx}"]`);
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  /* ── Bind: sidebar esquerda ── */
  _bindDisciplineSidebarEvents(cat.id);
}

/* ──────────────────────────────────────────────
   _buildDisciplineLeftSidebar
   Gera o HTML da sidebar esquerda da tela de disciplina.
   Inclui: voltar, nav biblioteca, lista de disciplinas, card PRO.
────────────────────────────────────────────── */
function _buildDisciplineLeftSidebar(activeCat) {
  const navLinks = [
    {
      svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
      label: 'Todas as disciplinas',
      action: 'all',
    },
    {
      svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
      label: 'Favoritos',
      action: 'favorites',
    },
    {
      svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      label: 'Recentes',
      action: 'recent',
    },
  ];

  const discLinks = CATEGORIES.map(c => {
    const isActive = c.id === activeCat.id;
    const colorAttr = _iconStyleAttr(c.color);
    return `
      <button class="subject-left-disc-link${isActive ? ' is-active' : ''}" data-disc-id="${_esc(c.id)}" type="button">
        <span class="subject-left-disc-link__icon"${colorAttr}>${_renderIcon(c.icon)}</span>
        <span class="subject-left-disc-link__name">${_esc(c.name)}</span>
        ${isActive ? `<span class="subject-left-disc-link__close" aria-hidden="true">✕</span>` : ''}
      </button>`;
  }).join('');

  return `
    <aside class="subject-left-sidebar" aria-label="Navegação da disciplina">
      <button class="subject-left-back" id="discipline-back" type="button">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
        </svg>
        Voltar ao Atlas
      </button>

      <div class="subject-left-section">
        <span class="subject-left-section-label">Biblioteca</span>
        ${navLinks.map(l => `
          <button class="subject-left-nav-link" data-nav-action="${_esc(l.action)}" type="button">
            ${l.svg}
            ${_esc(l.label)}
          </button>`).join('')}
      </div>

      <div class="subject-left-section">
        <span class="subject-left-section-label">Minhas disciplinas</span>
        ${discLinks}
      </div>

      <button class="subject-left-see-all" type="button">Ver todas</button>

      <div class="subject-left-spacer"></div>

      <div class="subject-pro-card">
        <div class="subject-pro-card__header">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Nexus Pro
        </div>
        <div class="subject-pro-card__body">Conteúdos exclusivos, recursos avançados e muito mais.</div>
        <button class="subject-pro-card__cta" type="button">
          Conhecer planos
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </aside>`;
}

/* ──────────────────────────────────────────────
   _buildDisciplineRightSidebar
   Gera o HTML da sidebar direita: índice (TOC),
   atalhos rápidos e recursos da disciplina.
────────────────────────────────────────────── */
function _buildDisciplineRightSidebar(cat, secoes) {
  const tocItems = secoes.map((s, i) => `
    <button class="subject-toc-item${i === 0 ? ' is-active' : ''}" data-toc-index="${i}" type="button">
      ${_esc(s.titulo ?? `Módulo ${i + 1}`)}
    </button>`).join('');

  const quickItems = [
    {
      svg: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
      title: 'Buscar na disciplina',
      sub: 'Encontre tópicos e conteúdos',
    },
    {
      svg: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
      title: 'Ver índice completo',
      sub: 'Navegue por toda a estrutura',
    },
    {
      svg: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
      title: 'Downloads',
      sub: 'Materiais complementares',
    },
    {
      svg: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
      title: 'Referências',
      sub: 'Documentação oficial',
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

/* ──────────────────────────────────────────────
   _bindDisciplineSidebarEvents
   Bind dos eventos da sidebar esquerda após cada render.
   Reutiliza _abrirDisciplina e _showScreen existentes.
────────────────────────────────────────────── */
function _bindDisciplineSidebarEvents(activeCatId) {
  const screen = EL.screenDiscipline;
  if (!screen) return;

  /* Botão "Voltar ao Atlas" → volta para Home */
  screen.querySelector('#discipline-back')?.addEventListener('click', () => {
    playSound('click', 'atlas');
    State.currentCategory = null;
    _showScreen('home');
    _renderBreadcrumb();
  });

  /* "Todas as disciplinas" → idem */
  screen.querySelector('[data-nav-action="all"]')?.addEventListener('click', () => {
    playSound('click', 'atlas');
    State.currentCategory = null;
    _showScreen('home');
    _renderBreadcrumb();
  });

  /* Links de disciplinas na sidebar */
  screen.querySelectorAll('[data-disc-id]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.discId;
      if (id && id !== activeCatId) {
        playSound('click', 'atlas');
        _abrirDisciplina(id);
      }
    });
  });
}

/* ══════════════════════════════════════════════
   SIDEBAR DO READER
══════════════════════════════════════════════ */
function _renderSidebar(categoryId, chapterIndex) {
  const cat    = CATEGORIES.find(c => c.id === categoryId);
  const data   = _contentCache.get(categoryId);
  const secoes = Array.isArray(data?.secoes) ? data.secoes : [];

  if (EL.sidebarDisciplines) {
    EL.sidebarDisciplines.innerHTML = CATEGORIES.map(c => `
      <div class="reader-sidebar-discipline-link ${c.id === categoryId ? 'is-active' : ''}" data-cat-id="${_esc(c.id)}">
        <span class="reader-sidebar-discipline-link__icon"${_iconStyleAttr(c.color)} aria-hidden="true">${_renderIcon(c.icon)}</span>
        <span>${_esc(c.name)}</span>
      </div>
    `).join('');

    EL.sidebarDisciplines.querySelectorAll('.reader-sidebar-discipline-link').forEach(link => {
      link.addEventListener('click', async () => {
        const id = link.dataset.catId;
        if (id === categoryId) return;
        playSound('click', 'atlas');
        const newData   = await _getCategoryContent(id);
        const hasSecoes = Array.isArray(newData?.secoes) && newData.secoes.length;
        if (hasSecoes) {
          _abrirReader(id, 0);
        } else {
          _fecharReader({ silent: true });
          _abrirDisciplina(id);
        }
      });
    });
  }

  if (EL.sidebarCurrentLabel && cat) {
    EL.sidebarCurrentLabel.textContent = `Capítulos · ${cat.name}`;
  }

  if (EL.sidebarChapters) {
    const groups = _buildChapterGroups(categoryId, secoes);

    EL.sidebarChapters.innerHTML = groups.map(group => `
      <div class="reader-sidebar-chapter-group">
        ${groups.length > 1 ? `<div class="reader-sidebar-chapter-group__title">${_esc(group.titulo)}</div>` : ''}
        ${group.secoes.map(secao => `
          <div class="reader-sidebar-chapter-link ${secao._index === chapterIndex ? 'is-active' : ''}" data-chapter-index="${secao._index}">
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

/* ══════════════════════════════════════════════
   BREADCRUMB INLINE DO READER
══════════════════════════════════════════════ */
function _renderReaderBreadcrumb(cat, secao) {
  if (!EL.readerBreadcrumbInline) return;
  EL.readerBreadcrumbInline.innerHTML = `
    <span class="crumb crumb--atlas" data-crumb="home">atlas</span>
    <span class="crumb-sep">/</span>
    <span class="crumb crumb--cat" data-crumb="discipline">${_esc(cat.name)}</span>
    <span class="crumb-sep">/</span>
    <span class="crumb crumb--current">${_esc(secao?.titulo ?? '')}</span>
  `;

  EL.readerBreadcrumbInline.querySelector('[data-crumb="discipline"]')?.addEventListener('click', () => {
    playSound('click', 'atlas');
    _fecharReader({ toDiscipline: true });
  });
  EL.readerBreadcrumbInline.querySelector('[data-crumb="home"]')?.addEventListener('click', () => {
    playSound('click', 'atlas');
    _fecharReader({ toHome: true });
  });
}

/* ══════════════════════════════════════════════
   NÍVEL 3 — READER (Leitura)
══════════════════════════════════════════════ */
async function _abrirReader(categoryId, chapterIndex, opts = {}) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return;

  State.currentCategory = categoryId;
  State.currentChapter  = chapterIndex;
  State.readerOpen      = true;

  if (EL.readerBody) EL.readerBody.innerHTML = _buildLoadingBody();
  if (EL.readerChapterNav) EL.readerChapterNav.innerHTML = '';

  if (!EL.reader.classList.contains('reader--open')) {
    playSound('openModal', 'atlas');
    EL.reader.hidden = false;
    requestAnimationFrame(() => {
      EL.reader.classList.add('reader--open');
      document.body.style.overflow = 'hidden';
      EL.readerPanel?.focus();
    });
  }

  const data   = await _getCategoryContent(categoryId);
  if (State.currentCategory !== categoryId || State.currentChapter !== chapterIndex || !State.readerOpen) return;

  const secoes = Array.isArray(data?.secoes) ? data.secoes : [];
  const secao  = secoes[chapterIndex];

  /* Garante que a tela de disciplina esteja renderizada com os dados completos */
  _showScreen('discipline');
  _renderDisciplineScreen(cat, data);

  _renderSidebar(categoryId, chapterIndex);
  _renderReaderBreadcrumb(cat, secao);
  _renderAtlasHero(cat, data, secao);
  _renderAtlasBody(secao, categoryId);
  _renderChapterNav(cat, secoes, chapterIndex);
  _renderBreadcrumb();

  _closeMobileSidebar();
  _cleanupProgress();
  _setupProgress();
  if (EL.readerScroll) EL.readerScroll.scrollTop = 0;
}

function _fecharReader(opts = {}) {
  State.readerOpen  = false;
  const categoryId  = State.currentCategory;

  playSound('closeModal', 'atlas');
  EL.reader.classList.remove('reader--open');
  document.body.style.overflow = '';

  setTimeout(() => {
    EL.reader.hidden = true;
    if (EL.readerScroll)       EL.readerScroll.scrollTop  = 0;
    if (EL.readerProgressFill) EL.readerProgressFill.style.width = '0%';
  }, 420);

  _cleanupProgress();
  _closeMobileSidebar();

  if (opts.toHome) {
    State.currentCategory = null;
    State.currentChapter  = null;
    _showScreen('home');
  } else if (opts.toDiscipline && categoryId) {
    State.currentChapter = null;
    _showScreen('discipline');
  } else if (!opts.silent) {
    State.currentChapter = null;
    _showScreen('discipline');
  }

  _renderBreadcrumb();
}

/* ══════════════════════════════════════════════
   HERO DO READER
══════════════════════════════════════════════ */
function _renderAtlasHero(cat, data, secao) {
  if (EL.readerHeroCategory) {
    EL.readerHeroCategory.innerHTML = `<span style="margin-right:0.4rem;opacity:0.8">${_renderIcon(cat.icon)}</span>${_esc(cat.name)}`;
  }
  if (EL.readerHeroTitle) EL.readerHeroTitle.textContent = secao?.titulo ?? data.title ?? cat.name;
  if (EL.readerHeroDesc)  EL.readerHeroDesc.textContent  = data.desc ?? cat.desc;

  if (EL.readerHeroChips) {
    const chips = [];
    if (data.time) {
      chips.push(`
        <span class="reader__chip">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          ${data.time} min de leitura
        </span>`);
    }
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

  if (EL.readerTime) {
    EL.readerTime.textContent = data.time ? `${data.time} min` : '';
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
  safe = safe.replace(/`([^`]+)`/g,     '<code>$1</code>');
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
      const base  = `../content/atlas/imagens/${categoryId}/`;
      const src   = _esc(bloco.src ?? '');
      const alt   = _esc(bloco.legenda ?? bloco.src ?? '');
      const leg   = bloco.legenda
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
   SIDEBAR MOBILE (drawer)
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
   BUSCA (nível 1)
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
   Nota: discipline-back é gerado dinamicamente pelo
   _buildDisciplineLeftSidebar e rebindado após cada
   render via _bindDisciplineSidebarEvents.
   Aqui ficam apenas os bindings de elementos fixos no HTML.
══════════════════════════════════════════════ */
function _bindEvents() {
  document.querySelector('.btn-back')
    ?.addEventListener('click', () => playSound('click', 'atlas'));

  EL.readerClose?.addEventListener('click',   () => _fecharReader());
  EL.readerOverlay?.addEventListener('click', () => _fecharReader());

  EL.readerSidebarToggle?.addEventListener('click', _toggleMobileSidebar);
  EL.readerSidebarScrim?.addEventListener('click',  _closeMobileSidebar);

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (State.readerOpen) { _fecharReader(); return; }
    if (State.view === 'discipline') {
      State.currentCategory = null;
      _showScreen('home');
      _renderBreadcrumb();
    }
  });

  let searchTimer;
  EL.searchInput?.addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => _handleSearch(e.target.value), 160);
  });

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      EL.searchInput?.focus();
      EL.searchInput?.select();
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
  _bindEvents();

  await _loadAllCategories();

  _renderStats();
  _renderBreadcrumb();
  _renderCategoriesGrid(CATEGORIES);

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