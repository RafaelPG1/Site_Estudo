// @ts-nocheck
/* ═══════════════════════════════════════════════════════════
   NEXUS STUDY — atlas/atlas.js
   Arquitetura em 3 níveis:

     Nível 1 — Biblioteca   (screen-home)
     Nível 2 — Disciplina   (screen-discipline)
     Nível 3 — Leitura      (reader, com sidebar fixa)

   Descoberta de categorias:
     1. Carrega content/atlas/manifest.js
        (expõe window.__KB_MANIFEST__ = ['python','java',...])
     2. Para cada id no manifesto, injeta
        content/atlas/{id}.js como <script>
     3. Lê window.__nexusatlas após o carregamento
        para extrair title, icon, desc, time, type, secoes
     4. Monta os cards dinamicamente — sem lista fixa no JS

   Para adicionar uma nova categoria:
     • Crie content/atlas/linux.js com window.__nexusatlas = { ... }
     • Adicione 'linux' em content/atlas/manifest.js
     • Pronto. Nenhuma outra mudança necessária aqui.

   Infraestrutura compartilhada utilizada
   (mesmo padrão do Quiz — não duplica nada):
     • shared/js/utils/logo.js   → injetarLogo
     • shared/js/utils/dom.js    → preencherAnos
     • shared/js/audio/audio-api.js → Sound, audio, installAudioRecovery, playSound
     • shared/js/ia/core/fab.js  → injetado via HTML (mesmo padrão do Quiz)
     • shared/js/utils/quick-access.js → injetado via HTML

   NÃO utilizado (exclusivo do Quiz / sistema acadêmico):
     • global.js (getSemestreAtual, getDisciplinasDeSemestre, etc.)
     • shared/js/utils/url.js (sincronizarSemNaURL)
     • shared/js/utils/dom.js → criarSemestreSelect, preencherAnos (só preencherAnos é usado)
     • shared/js/themes/cores.js (DISC_CORES — cores por disciplina acadêmica)
     • shared/css/themes/semestre-picker.css
     • shared/js/ia/resumo/* (IA do sistema de Resumos)
   ═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   IMPORTS — infraestrutura compartilhada
   Apenas o que faz sentido para o Atlas.
══════════════════════════════════════════════ */
import { injetarLogo }                                      from '../shared/js/utils/logo.js';
import { preencherAnos }                                    from '../shared/js/utils/dom.js';
import { Sound, audio, installAudioRecovery, playSound }   from '../shared/js/audio/audio-api.js';

/* ══════════════════════════════════════════════
   IA — contexto neutro (sem vínculo com Resumos)
   Mesmo padrão de carregamento do Quiz, mas sem
   o módulo resumo/search.js e resumo/assistant.js.
   O FAB já foi injetado via fab.js no HTML.
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
  // Apenas o core da IA — sem o sistema de Resumos acadêmicos
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
   CAMINHO BASE DE CONTEÚDO
══════════════════════════════════════════════ */
const KB_CONTENT_BASE = window.__KB_CONTENT_BASE__ ?? '../../content/atlas/';

/* ══════════════════════════════════════════════
   ESTADO GLOBAL DE CATEGORIAS
══════════════════════════════════════════════ */
let CATEGORIES = [];

/* ══════════════════════════════════════════════
   MAPEAMENTO MANUAL DE GRUPOS VISUAIS

   Define como as seções (secoes[i]) de cada disciplina
   são agrupadas visualmente em "Fundamentos / Intermediário /
   Avançado" etc. Puramente visual — não altera nenhum arquivo
   de conteúdo.

   Formato: { [categoryId]: [ { titulo, range: [ini, fim] }, ... ] }
   range é 0-based, inclusivo nos dois lados.

   Categorias sem mapeamento caem automaticamente num único grupo "Conteúdo".
══════════════════════════════════════════════ */
const CHAPTER_GROUPS_MAP = {
  // Exemplo:
  // python: [
  //   { titulo: 'Fundamentos',   range: [0, 2] },
  //   { titulo: 'Intermediário', range: [3, 5] },
  //   { titulo: 'Avançado',      range: [6, 99] },
  // ],
};

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
   TOAST — mesmo padrão do Quiz
   Reutiliza a classe .nexus-toast já existente
   nos estilos globais do projeto.
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
   DESCOBERTA AUTOMÁTICA DE CATEGORIAS
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

async function _loadManifest() {
  try {
    await _injectScript(`${KB_CONTENT_BASE}manifest.js`, 'manifest');
    const ids = window.__KB_MANIFEST__;
    if (!Array.isArray(ids)) {
      console.warn('[atlas] manifest.js não expõe window.__KB_MANIFEST__ como array.');
      return [];
    }
    return ids;
  } catch (err) {
    console.error('[atlas] Não foi possível carregar manifest.js:', err);
    return [];
  }
}

async function _loadCategoryMeta(id) {
  delete window.__nexusatlas;

  try {
    await _injectScript(`${KB_CONTENT_BASE}${id}.js`, `cat-${id}`);
  } catch {
    console.warn(`[atlas] Arquivo não encontrado: ${KB_CONTENT_BASE}${id}.js — categoria '${id}' ignorada.`);
    return null;
  }

  const data = window.__nexusatlas;
  if (!data || typeof data !== 'object') {
    console.warn(`[atlas] ${id}.js não expõe window.__nexusatlas — ignorado.`);
    return null;
  }

  return {
    id,
    name:     data.title    ?? id,
    icon:     data.icon     ?? '📄',
    desc:     data.desc     ?? '',
    color:    data.color    ?? '#6366f1',
    colorRgb: data.colorRgb ?? '99,102,241',
  };
}

async function _loadAllCategories() {
  const ids = await _loadManifest();
  if (!ids.length) return;

  const results = await Promise.all(ids.map(_loadCategoryMeta));
  CATEGORIES = results.filter(Boolean);
}

/* ══════════════════════════════════════════════
   CARREGAMENTO DE CONTEÚDO (com cache em memória)
══════════════════════════════════════════════ */
async function _loadCategory(categoryId) {
  const alreadyInjected = document.querySelector(`script[data-kb="cat-${categoryId}"]`);

  if (!alreadyInjected) {
    delete window.__nexusatlas;
    try {
      await _injectScript(`${KB_CONTENT_BASE}${categoryId}.js`, `cat-${categoryId}`);
      if (window.__nexusatlas) return window.__nexusatlas;
    } catch (err) {
      console.warn(`[atlas] Falha ao carregar conteúdo de ${categoryId}:`, err);
    }
  } else {
    alreadyInjected.remove();
    delete window.__nexusatlas;
    try {
      await _injectScript(`${KB_CONTENT_BASE}${categoryId}.js`, `cat-${categoryId}`);
      if (window.__nexusatlas) return window.__nexusatlas;
    } catch (err) {
      console.warn(`[atlas] Falha ao carregar conteúdo de ${categoryId}:`, err);
    }
  }

  const cat = CATEGORIES.find(c => c.id === categoryId);
  return {
    title:  cat?.name ?? categoryId,
    icon:   cat?.icon ?? '📄',
    desc:   cat?.desc ?? '',
    time:   0,
    type:   'Documentação',
    secoes: [{
      titulo: 'Em preparação',
      blocos: [{ tipo: 'texto', texto: `O arquivo content/atlas/${categoryId}.js ainda não foi criado ou não expõe window.__nexusatlas.` }],
    }],
  };
}

const _contentCache = new Map();

async function _getCategoryContent(categoryId) {
  if (_contentCache.has(categoryId)) return _contentCache.get(categoryId);
  const data = await _loadCategory(categoryId);
  _contentCache.set(categoryId, data);
  return data;
}

/* ══════════════════════════════════════════════
   ESTATÍSTICAS (header + hero)
══════════════════════════════════════════════ */
function _renderStats() {
  const nCats = CATEGORIES.length;

  if (EL.heroStats) {
    EL.heroStats.innerHTML = `
      <div class="hero-stat">
        <span class="hero-stat__num">${nCats}</span>
        <span class="hero-stat__sep"></span>
        <span>disciplinas</span>
      </div>`;
  }

  // Header stats — mesmo estilo do Quiz (texto compacto no canto direito)
  if (EL.headerStats) {
    EL.headerStats.textContent = `${nCats} disciplina${nCats !== 1 ? 's' : ''}`;
  }

  if (EL.categoriesCount) {
    EL.categoriesCount.textContent = `${nCats} disciplinas`;
  }
}

/* ══════════════════════════════════════════════
   HEADER BREADCRUMB
   Mantido apenas para compatibilidade interna —
   o centro do header agora é a logo, não o breadcrumb.
   _renderBreadcrumb() é no-op para o header principal.
══════════════════════════════════════════════ */
function _renderBreadcrumb() {
  // O header usa a logo fixa no centro (sem breadcrumb de texto).
  // Esta função existe para não quebrar chamadas internas existentes.
}

/* ══════════════════════════════════════════════
   NÍVEL 1 — GRID DE DISCIPLINAS
══════════════════════════════════════════════ */
// PATCH — _renderCategoriesGrid para o redesign v2
// Cole este bloco no atlas.js substituindo a função _renderCategoriesGrid existente.
// Nenhuma outra parte da lógica foi alterada.

function _renderCategoriesGrid(cats) {
  if (!EL.catGrid) return;

  if (!cats.length) {
    EL.catGrid.innerHTML = `
      <div class="empty-state">
        <span class="empty-state__icon">🔍</span>
        <h3>Nenhuma disciplina encontrada</h3>
        <p>Tente outro termo de busca.</p>
      </div>`;
    return;
  }

  EL.catGrid.innerHTML = cats.map(cat => `
    <article
      class="cat-card"
      data-cat-id="${_esc(cat.id)}"
      style="--cat-rgb:${_esc(cat.colorRgb)}"
      tabindex="0"
      role="button"
      aria-label="Abrir disciplina ${_esc(cat.name)}"
    >
      <div class="cat-card__glow"></div>

      <!-- Corpo: ícone + texto + seta -->
      <div class="cat-card__body-wrap">
        <span class="cat-card__icon" aria-hidden="true">${_renderIcon(cat.icon)}</span>

        <div class="cat-card__text">
          <div class="cat-card__name">${_esc(cat.name)}</div>
          <div class="cat-card__desc">${_esc(cat.desc)}</div>
        </div>

        <span class="cat-card__arrow" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
          </svg>
        </span>
      </div>

      <!-- Footer: contadores (capítulos · blocos estimados) -->
      <div class="cat-card__footer">
        <span class="cat-card__stat">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <!-- Capítulos preenchidos dinamicamente -->
          <span data-stat-chapters="${_esc(cat.id)}">— capítulos</span>
        </span>

        <span class="cat-card__stat-sep" aria-hidden="true"></span>

        <span class="cat-card__stat">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          Documentação completa
        </span>
      </div>
    </article>
  `).join('');

  EL.catGrid.querySelectorAll('.cat-card').forEach(card => {
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

  // Preenche contagem de capítulos de forma assíncrona após carregar o conteúdo
  cats.forEach(async cat => {
    try {
      const data   = await _getCategoryContent(cat.id);
      const nCaps  = Array.isArray(data?.secoes) ? data.secoes.length : 0;
      const el     = EL.catGrid?.querySelector(`[data-stat-chapters="${cat.id}"]`);
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

function _renderDisciplineLoading(cat) {
  if (EL.disciplineIcon)  EL.disciplineIcon.innerHTML   = _renderIcon(cat.icon);
  if (EL.disciplineIcon)  EL.disciplineIcon.style.setProperty('--cat-rgb', cat.colorRgb);
  if (EL.disciplineTitle) EL.disciplineTitle.textContent = cat.name;
  if (EL.disciplineDesc)  EL.disciplineDesc.textContent  = cat.desc;
  if (EL.disciplineMeta)  EL.disciplineMeta.innerHTML    = '';
  if (EL.disciplineBody)  EL.disciplineBody.innerHTML    = `
    <div class="empty-state">
      <span class="empty-state__icon">⏳</span>
      <h3>Carregando conteúdo…</h3>
      <p>Buscando os capítulos desta disciplina.</p>
    </div>`;
}

function _renderDisciplineScreen(cat, data) {
  const secoes = Array.isArray(data?.secoes) ? data.secoes : [];

  if (EL.disciplineIcon)  EL.disciplineIcon.style.setProperty('--cat-rgb', cat.colorRgb);
  if (EL.disciplineTitle) EL.disciplineTitle.textContent = data.title ?? cat.name;
  if (EL.disciplineDesc)  EL.disciplineDesc.textContent  = data.desc  ?? cat.desc;

  if (EL.disciplineMeta) {
    const chips = [];
    chips.push(`
      <span class="reader__chip">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        ${secoes.length} ${secoes.length === 1 ? 'capítulo' : 'capítulos'}
      </span>`);
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
      chips.push(`<span class="reader__chip">${_esc(data.type)}</span>`);
    }
    EL.disciplineMeta.innerHTML = chips.join('');
  }

  if (!EL.disciplineBody) return;

  if (!secoes.length) {
    EL.disciplineBody.innerHTML = `
      <div class="empty-state">
        <span class="empty-state__icon">📭</span>
        <h3>Nenhum conteúdo disponível ainda</h3>
        <p>Esta disciplina ainda não tem capítulos publicados.</p>
      </div>`;
    return;
  }

  const groups = _buildChapterGroups(cat.id, secoes);

  EL.disciplineBody.innerHTML = groups.map(group => `
    <div class="chapter-group" style="--cat-rgb:${_esc(cat.colorRgb)}">
      <div class="chapter-group__header">
        <span class="chapter-group__title">${_esc(group.titulo)}</span>
        <span class="chapter-group__count">${group.secoes.length}</span>
        <span class="chapter-group__line"></span>
      </div>
      <div class="chapter-grid">
        ${group.secoes.map(secao => `
          <article class="chapter-card" data-chapter-index="${secao._index}" tabindex="0" role="button"
                    aria-label="Abrir ${_esc(secao.titulo ?? '')}">
            <span class="chapter-card__index">${String(secao._index + 1).padStart(2, '0')}</span>
            <div class="chapter-card__body">
              <div class="chapter-card__title">${_esc(secao.titulo ?? '')}</div>
              <div class="chapter-card__meta">${(secao.blocos ?? []).length} blocos</div>
            </div>
            <span class="chapter-card__arrow" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
              </svg>
            </span>
          </article>
        `).join('')}
      </div>
    </div>
  `).join('');

  EL.disciplineBody.querySelectorAll('.chapter-card').forEach(card => {
    const idx = parseInt(card.dataset.chapterIndex, 10);
    card.addEventListener('mouseenter', () => playSound('hover', 'atlas'));
    card.addEventListener('click',      () => { playSound('click', 'atlas'); _abrirReader(cat.id, idx); });
    card.addEventListener('keydown',    (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _abrirReader(cat.id, idx); }
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
      <div class="sidebar-discipline-link ${c.id === categoryId ? 'is-active' : ''}" data-cat-id="${_esc(c.id)}">
        <span class="sidebar-discipline-link__icon" aria-hidden="true">${_renderIcon(c.icon)}</span>
        <span>${_esc(c.name)}</span>
      </div>
    `).join('');

    EL.sidebarDisciplines.querySelectorAll('.sidebar-discipline-link').forEach(link => {
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
      <div class="sidebar-chapter-group">
        ${groups.length > 1 ? `<div class="sidebar-chapter-group__title">${_esc(group.titulo)}</div>` : ''}
        ${group.secoes.map(secao => `
          <div class="sidebar-chapter-link ${secao._index === chapterIndex ? 'is-active' : ''}" data-chapter-index="${secao._index}">
            ${_esc(secao.titulo ?? '')}
          </div>
        `).join('')}
      </div>
    `).join('');

    EL.sidebarChapters.querySelectorAll('.sidebar-chapter-link').forEach(link => {
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

  _showScreen('discipline');
  _renderDisciplineScreen(cat, data);

  _renderSidebar(categoryId, chapterIndex);
  _renderReaderBreadcrumb(cat, secao);
  _renderAtlasHero(cat, data, secao);
  _renderAtlasBody(secao);
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
   Tipos suportados: texto, subtitulo, lista,
   tabela, codigo, alerta, destaque
══════════════════════════════════════════════ */
function _renderAtlasBody(secao) {
  if (!EL.readerBody) return;

  if (!secao) {
    EL.readerBody.innerHTML = _buildLoadingBody();
    return;
  }

  EL.readerBody.innerHTML = `
    <section class="kb-section">
      ${(secao.blocos ?? []).map(_renderBloco).join('')}
    </section>
  `;
}

function _escRich(str) {
  let safe = _esc(str ?? '');
  safe = safe.replace(/`([^`]+)`/g,     '<code>$1</code>');
  safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return safe;
}

function _renderBloco(bloco) {
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

    default:
      return '';
  }
}

/* ══════════════════════════════════════════════
   NAVEGAÇÃO ENTRE CAPÍTULOS (Anterior / Próximo)
══════════════════════════════════════════════ */
function _renderChapterNav(cat, secoes, currentIndex) {
  if (!EL.readerChapterNav) return;

  const prev  = secoes[currentIndex - 1];
  const next  = secoes[currentIndex + 1];
  const parts = [];

  if (prev) {
    parts.push(`
      <div class="chapter-nav-link chapter-nav-link--prev" data-nav-index="${currentIndex - 1}">
        <span class="chapter-nav-link__label">← Anterior</span>
        <span class="chapter-nav-link__title">${_esc(prev.titulo ?? '')}</span>
      </div>`);
  } else {
    parts.push('<div></div>');
  }

  if (next) {
    parts.push(`
      <div class="chapter-nav-link chapter-nav-link--next" data-nav-index="${currentIndex + 1}">
        <span class="chapter-nav-link__label">Próximo →</span>
        <span class="chapter-nav-link__title">${_esc(next.titulo ?? '')}</span>
      </div>`);
  } else {
    parts.push('<div></div>');
  }

  EL.readerChapterNav.innerHTML = parts.join('');

  EL.readerChapterNav.querySelectorAll('.chapter-nav-link').forEach(link => {
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
    <div class="empty-state" style="grid-column:1/-1">
      <span class="empty-state__icon">⏳</span>
      <h3>Carregando disciplinas…</h3>
      <p>Lendo manifest.js e os arquivos de conteúdo.</p>
    </div>`;
}

/* ══════════════════════════════════════════════
   BINDINGS DE EVENTOS
══════════════════════════════════════════════ */
function _bindEvents() {
  // Botão de voltar ao início
  document.querySelector('.btn-back')
    ?.addEventListener('click', () => playSound('click', 'atlas'));

  // Reader
  EL.readerClose?.addEventListener('click',   () => _fecharReader());
  EL.readerOverlay?.addEventListener('click', () => _fecharReader());

  // Disciplina nível 2
  EL.disciplineBack?.addEventListener('click', () => {
    playSound('click', 'atlas');
    State.currentCategory = null;
    _showScreen('home');
    _renderBreadcrumb();
  });

  // Sidebar mobile
  EL.readerSidebarToggle?.addEventListener('click', _toggleMobileSidebar);
  EL.readerSidebarScrim?.addEventListener('click',  _closeMobileSidebar);

  // Teclado: ESC fecha reader ou volta para home
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (State.readerOpen) { _fecharReader(); return; }
    if (State.view === 'discipline') {
      State.currentCategory = null;
      _showScreen('home');
      _renderBreadcrumb();
    }
  });

  // Busca com debounce
  let searchTimer;
  EL.searchInput?.addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => _handleSearch(e.target.value), 160);
  });

  // Atalho ⌘K / Ctrl+K
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
  // Áudio — mesmo padrão do Quiz
  Sound.init();
  installAudioRecovery({ Sound, audio });
  await Sound.waitUntilReady();

  // Logo — mesmo utilitário do Quiz
  injetarLogo('#header-logo-wrap');

  // Footer — mesmo utilitário do Quiz
  preencherAnos(['footer-year']);

  // IA (não bloqueia renderização)
  _carregarIA();

  // UI
  _renderBreadcrumb();
  _renderLoadingState();
  _bindEvents();

  await _loadAllCategories();

  _renderStats();
  _renderBreadcrumb();
  _renderCategoriesGrid(CATEGORIES);

  // Deep-links:
  //   ?cat=python           → abre nível 2 (disciplina)
  //   ?cat=python&chapter=2 → abre nível 3 (leitura) direto no capítulo
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