/* =============================================
   NEXUS STUDY — resumo/resumo.js  (v13 — área 'resumos' em todos os playSound)
   ✦ Toda lógica da v11 preservada
   ✦ Modal substituído por painel lateral deslizante
   ✦ TOC sidebar com scroll spy dentro do painel
   ✦ Barra de progresso de leitura
   ✦ Cards com metadados premium (tempo estimado, nível)
   ✦ Seções colapsáveis com animação fluida
   ============================================= */

import {
  getSemestreAtual,
  getDisciplinaAtual,
  setDisciplina,
  getDisciplinasDeSemestre,
  setPagina,
  setSemestre,
  SEMESTRES,
  parseSemestre,
} from '../src/global.js';

import { resolverSemestreDeURL, sincronizarSemNaURL } from '../shared/js/utils/url.js';
import { criarSemestreSelect, preencherAnos } from '../shared/js/utils/dom.js';
import { aplicarCoresDisciplina } from '../shared/js/themes/theme.js';

import { injetarLogo } from '../shared/js/utils/logo.js';

/* ─────────────────────────────────────────────
   ÁUDIO — sistema centralizado
   Usar sempre playSound(event, 'resumos'). Nunca chamar
   audio.sfx diretamente neste arquivo.
───────────────────────────────────────────── */
import { Sound, playSound } from '../shared/js/audio/audio-api.js';

injetarLogo('#header-logo-wrap');

/* ══════════════════════════════════════════════
   ESTADO
══════════════════════════════════════════════ */
const State = {
  disciplina:      null,
  semestre:        null,
  disciplinas:     [],
  aulas:           [],
  simplificado:    [],
  resumao:         [],
  aulaAberta:      null,
  discVerificadas: new Set(),
  temConteudo:     null,
  modo:            'completo', // 'completo' | 'sintese' | 'resumao'
  DISC_CORES:      {},
  getVideos:       null,
  // Scroll spy cleanup
  _tocObserver:    null,
};

// Expõe State para módulos auxiliares (ex: botões flutuantes)
window.__nexusState = State;

// ── Assistente Nexus ─────────────────────────────────────────
// Carregado imediatamente — sem esperar DOMContentLoaded nem Sound.
// Isso garante que o FAB da IA apareça junto com os botões de áudio.

function _loadScript(src) {
  return new Promise((resolve, reject) => {
    // Verifica se já foi carregado (evita duplicatas em hot-reload)
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`[Nexus IA] Falha ao carregar: ${src}`));
    // Usa document.head: sempre disponível, mesmo antes do <body> ser parseado.
    // document.body pode ainda não existir quando _carregarIA() executa no
    // topo do módulo (antes do DOMContentLoaded).
    (document.head ?? document.documentElement).appendChild(s);
  });
}

function _carregarIA() {
  const BASE = '../shared/js/ia/';
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


/* ══════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  setPagina('RESUMO');
  preencherAnos();

  // Inicializa o sistema de áudio (botão flutuante + modal interno)
  Sound.init();

  // Imports opcionais
  try {
    const mod = await import('../shared/js/themes/cores.js');
    State.DISC_CORES = mod.DISC_CORES ?? {};
  } catch (_) {}

  try {
    const mod = await import('../content/resumo/videos.js');
    State.getVideos = mod.getVideos ?? null;
  } catch (_) {}

  _resolverContexto();

  // Badge de semestre — somente visual (sem dropdown, sem interação)
  _renderSemestreBadge();

  // Listener para mudança de semestre via outro mecanismo (compatibilidade)
  // Não usa criarSemestreSelect pois o badge é somente exibição nesta tela

  _renderSidebar();
  _renderHeader();

  _bindModal();
  _bindMobileDropdown();
  _initProgressBar();
  _carregarConteudo();

  // Botão voltar ao início
  document.getElementById('btn-back')?.addEventListener('mouseenter', () => playSound('hover', 'resumos'));
  document.getElementById('btn-back')?.addEventListener('click',      () => playSound('click', 'resumos'));
});


/* ══════════════════════════════════════════════
   BARRA DE PROGRESSO DE LEITURA
══════════════════════════════════════════════ */
function _initProgressBar() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;
  document.addEventListener('scroll', () => {
    bar.classList.remove('reading-progress--visible');
  });
}

function _updateReadingProgress(scrollEl) {
  const fill = document.getElementById('reader-progress-fill');
  if (!fill || !scrollEl) return;
  const update = () => {
    const { scrollTop, scrollHeight, clientHeight } = scrollEl;
    const total = scrollHeight - clientHeight;
    const pct = total > 0 ? Math.min(100, (scrollTop / total) * 100) : 0;
    fill.style.width = pct + '%';
  };
  scrollEl.addEventListener('scroll', update, { passive: true });
  update();
  return () => {
    scrollEl.removeEventListener('scroll', update);
    if (fill) fill.style.width = '0%';
  };
}


/* ══════════════════════════════════════════════
   CONTEXTO
══════════════════════════════════════════════ */
function _resolverContexto() {
  const semestre = resolverSemestreDeURL();
  const lista       = getDisciplinasDeSemestre(semestre);
  State.semestre    = semestre;
  State.disciplinas = lista;

  if (!lista.length) {
    State.disciplina = null;
    setDisciplina(null);
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const discId = params.get('disc') ?? getDisciplinaAtual();
  const disc   = (discId ? lista.find(d => d.id === discId) : null) ?? lista[0] ?? null;
  State.disciplina = disc;
  if (disc) setDisciplina(disc.id);
  if (disc) aplicarCoresDisciplina(disc.arquivo, State.DISC_CORES);
}

/* ══════════════════════════════════════════════
   STATUS BADGE
══════════════════════════════════════════════ */
function _atualizarStatusBadge() {
  const discBadge   = document.getElementById('disc-badge');
  const statusBadge = document.getElementById('header-status-badge');
  if (!discBadge || !statusBadge) return;

  if (State.disciplinas.length === 0) {
    discBadge.style.display   = 'none';
    discBadge.innerHTML       = '';
    statusBadge.style.display = '';
    statusBadge.innerHTML     = `<span style="flex-shrink:0">📭</span><span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;min-width:0">Vazio</span>`;
    statusBadge.className     = 'status-badge status-badge--empty';
  } else {
    statusBadge.style.display = 'none';
    statusBadge.innerHTML     = '';
  }
}

/* ══════════════════════════════════════════════
   SELETOR DE SEMESTRE — funcional (igual ao Quiz)
══════════════════════════════════════════════ */
function _renderSemestreBadge() {
  const wrap = document.getElementById('semestre-wrap-resumo');
  if (!wrap) return;

  criarSemestreSelect('semestre-wrap-resumo', sem => {
    setSemestre(sem);
    sincronizarSemNaURL(sem);

    // Recarrega disciplinas e conteúdo do novo semestre
    const lista       = getDisciplinasDeSemestre(sem);
    State.semestre    = sem;
    State.disciplinas = lista;
    State.disciplina  = lista[0] ?? null;
    if (State.disciplina) setDisciplina(State.disciplina.id);
    if (State.disciplina) aplicarCoresDisciplina(State.disciplina.arquivo, State.DISC_CORES);

    _renderSidebar();
    _renderHeader();
    _carregarConteudo();

    playSound('select', 'resumos');
    document.dispatchEvent(new CustomEvent('nexus:semestreChanged', { detail: sem }));
  });
}

/* ══════════════════════════════════════════════
   SEÇÃO DE VÍDEOS
══════════════════════════════════════════════ */
function _renderVideosSection() {
  let el = document.getElementById('videos-section');
  if (!el) {
    el = document.createElement('div');
    el.id = 'videos-section';
    el.style.display = 'none';
    const anchor = document.getElementById('mobile-toolbar') ?? document.getElementById('main-content');
    if (anchor) anchor.insertAdjacentElement('beforebegin', el);
    else return;
  }

  const disc = State.disciplina;
  if (!disc || !State.getVideos) { el.style.display = 'none'; return; }

  const videos = State.getVideos(State.semestre, disc.id);
  if (!videos.length) { el.style.display = 'none'; return; }

  const drive = videos.filter(v => v.tipo !== 'youtube');
  const yt    = videos.filter(v => v.tipo === 'youtube');
  const total = videos.length;

const buildChip = (v) => {
  const isGeral = v.label.toLowerCase().includes('geral');
  const isYT    = v.tipo === 'youtube';
  const isPlaylist = v.label.toLowerCase().includes('playlist') || v.label.toLowerCase().includes('curso');

  const cls = ['vchip', isGeral ? 'vchip--geral' : '', isYT ? 'vchip--yt' : '']
                .filter(Boolean).join(' ');

  const playIcon = isYT
    ? `<svg width="12" height="9" viewBox="0 0 20 14" fill="none">
         <rect width="20" height="14" rx="3" fill="rgba(255,60,60,0.65)"/>
         <path d="M8 4l6 3-6 3V4z" fill="white"/>
       </svg>`
    : `<svg width="9" height="10" viewBox="0 0 9 12" fill="currentColor">
         <path d="M0.5 1.5L8 6L0.5 10.5V1.5Z"/>
       </svg>`;

  const badgeClass = isYT ? 'vchip__badge--yt' : 'vchip__badge--drive';
  const badgeText  = isYT ? (isPlaylist ? 'Playlist' : 'YouTube') : 'Drive';

  return `
    <a href="${_esc(v.url)}" target="_blank" rel="noopener noreferrer" class="${cls}">
      <div class="vchip__top">
        <span class="vchip__play">${playIcon}</span>
        <span class="vchip__badge ${badgeClass}">${badgeText}</span>
      </div>
      <span class="vchip__label">${_esc(v.label)}</span>
    </a>`;
};

el.innerHTML = `
  <div class="videos-strip" id="videos-strip-wrap">
    <div class="videos-strip__head" id="videos-strip-toggle">
      <span class="videos-strip__head-icon">
        <svg width="9" height="10" viewBox="0 0 9 12" fill="currentColor"><path d="M0.5 1.5L8 6L0.5 10.5V1.5Z"/></svg>
      </span>
      <span class="videos-strip__head-label">Vídeos das Aulas</span>
      <span class="videos-strip__head-count">${total} vídeo${total !== 1 ? 's' : ''}</span>
      <div class="videos-strip__toggle-btn">
        <span class="videos-strip__toggle-label"></span>
        <svg class="videos-strip__chevron" width="11" height="11" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
    <div class="videos-strip__body">
      <div class="videos-strip__body-inner">
        <div class="videos-strip__row">
          ${drive.map(v => buildChip(v)).join('')}
        </div>
        ${yt.length ? `
          <div class="videos-strip__yt-label">
            <svg width="11" height="8" viewBox="0 0 20 14" fill="none">
              <rect width="20" height="14" rx="3" fill="rgba(255,60,60,0.55)"/>
              <path d="M8 4l6 3-6 3V4z" fill="white"/>
            </svg>
            YouTube
          </div>
          <div class="videos-strip__row">
            ${yt.map(v => buildChip(v)).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  </div>`;

document.getElementById('videos-strip-toggle')?.addEventListener('click', () => {
  playSound('click', 'resumos');
  document.getElementById('videos-strip-wrap')?.classList.toggle('videos-strip--open');
});

  el.style.display = '';
}

/* ══════════════════════════════════════════════
   CARREGAR CONTEÚDO DINÂMICO
══════════════════════════════════════════════ */
function _carregarConteudo() {
  _mostrarEstado('loading');
  _renderVideosSection();
  State.temConteudo  = null;
  State.aulas        = [];
  State.simplificado = [];
  State.resumao      = [];
  _atualizarStatusBadge();
  _removerScriptAnterior();
  window.__nexusConteudo = null;

  const disc = State.disciplina;
  if (!disc) {
    State.temConteudo = false;
    _atualizarStatusBadge();
    _renderHeroStats(0);
    _mostrarEstadoSemConteudo();
    return;
  }

const { ano, periodo, ap } = parseSemestre(State.semestre ?? '2026.1');
const apPath = ap ? `/${ap}` : '';
const src = `../content/resumo/${ano}/${periodo}${apPath}/res_${disc.arquivo}.js`;

  const script = document.createElement('script');
  script.src = src;
  script.id  = 'nexus-conteudo-script';

  script.onload = () => {
    if (State.disciplina?.id !== disc.id) return;

    const dados = _lerDados();
    State.discVerificadas.add(disc.id);
    State.aulas        = dados.aulas;
    State.simplificado = dados.simplificado;
    State.resumao      = dados.resumao;
    State.temConteudo  = dados.aulas.length > 0;
    State.modo         = 'completo';

    _marcarStatusConteudo(disc.id, State.temConteudo);

    if (!State.temConteudo) {
      _renderHeroStats(0);
      _mostrarEstadoSemConteudo();
      return;
    }

    _renderHeroStats(dados.aulas.length);
    _renderGrid();
    _mostrarEstado('grid');
  };

  script.onerror = () => {
    if (State.disciplina?.id !== disc.id) return;
    State.discVerificadas.add(disc.id);
    State.temConteudo = false;
    _marcarStatusConteudo(disc.id, false);
    _renderHeroStats(0);
    _mostrarEstadoSemConteudo();
  };

  document.head.appendChild(script);
}

function _removerScriptAnterior() {
  document.getElementById('nexus-conteudo-script')?.remove();
}

function _lerDados() {
  const raw = window.__nexusConteudo ?? null;
  if (!raw) return { aulas: [], simplificado: [] };

  return {
    aulas:        Array.isArray(raw.aulas)        ? raw.aulas        : [],
    simplificado: Array.isArray(raw.simplificado) ? raw.simplificado : [],
    resumao:      Array.isArray(raw.resumao)       ? raw.resumao      : [],
  };
}

/* ══════════════════════════════════════════════
   TOGGLE DE MODO
══════════════════════════════════════════════ */
function _temSimplificado() { return State.simplificado.length > 0; }
function _temResumao()      { return State.resumao.length > 0; }

function _buildToggleHtml() {
  if (!_temSimplificado() && !_temResumao()) return '';

  const btnCompleto = `<button class="mode-btn${State.modo === 'completo' ? ' mode-btn--active' : ''}" data-modo="completo">Resumo completo</button>`;
  const btnSintese  = _temSimplificado()
    ? `<button class="mode-btn${State.modo === 'sintese'  ? ' mode-btn--active' : ''}" data-modo="sintese">Síntese rápida</button>`
    : '';
  const btnResumao  = _temResumao()
    ? `<button class="mode-btn${State.modo === 'resumao'  ? ' mode-btn--active' : ''}" data-modo="resumao">Resumão</button>`
    : '';

  return `<div class="mode-toggle" id="mode-toggle">${btnCompleto}${btnSintese}${btnResumao}</div>`;
}

function _setModo(modo) {
  if (State.modo === modo) return;
  playSound('select', 'resumos');
  State.modo = modo;
  document.querySelectorAll('[data-modo]').forEach(btn => {
    btn.classList.toggle('mode-btn--active', btn.dataset.modo === modo);
  });
  _renderGrid();
  _mostrarEstado('grid');
}

/* ══════════════════════════════════════════════
   ESTADOS DA UI
══════════════════════════════════════════════ */
function _mostrarEstado(estado) {
  document.getElementById('state-loading').style.display    = estado === 'loading'    ? 'flex' : 'none';
  document.getElementById('state-no-content').style.display = estado === 'no-content' ? 'flex' : 'none';
  document.getElementById('state-empty').style.display      = estado === 'empty'      ? 'flex' : 'none';
  document.getElementById('resumos-grid').style.display     = estado === 'grid'       ? 'grid' : 'none';
}

function _mostrarEstadoSemConteudo() {
  const disc = State.disciplina;
  const eEl  = document.getElementById('state-disc-emoji');
  const nEl  = document.getElementById('state-disc-name');
  if (eEl) eEl.textContent = disc?.emoji ?? '';
  if (nEl) nEl.textContent  = disc?.nome  ?? '';
  _mostrarEstado('no-content');
}

/* ══════════════════════════════════════════════
   HERO STATS
══════════════════════════════════════════════ */
function _renderHeroStats(total) {
  const c    = document.getElementById('hero-stats');
  const sub  = document.getElementById('hero-sub');
  const disc = State.disciplina;
  if (!c) return;

  const toggleHtml = total > 0 ? _buildToggleHtml() : '';
  c.innerHTML = disc
    ? `<div class="stat-pill">${disc.emoji} ${disc.nome}</div>${toggleHtml}`
    : '';

  if (total > 0 && toggleHtml) {
    document.getElementById('mode-toggle')?.addEventListener('click', e => {
      const btn = e.target.closest('[data-modo]');
      if (!btn) return;
      _setModo(btn.dataset.modo);
    });
  }

  if (sub) sub.textContent = total === 0
    ? `Nenhum resumo disponível para ${disc?.nome ?? 'esta disciplina'} ainda.`
    : `${total} aula${total !== 1 ? 's' : ''} disponíve${total !== 1 ? 'is' : 'l'} — ${disc?.nome ?? ''}.`;
}

/* ══════════════════════════════════════════════
   GRID
══════════════════════════════════════════════ */
function _renderGrid() {
  const grid = document.getElementById('resumos-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (State.modo === 'sintese') {
    // Síntese rápida: mostra apenas aulas que têm síntese disponível
    State.aulas.forEach((aula, idx) => {
      const sint = State.simplificado[idx] ?? null;
      const temSint = !!(sint && (sint.ideia_central || (sint.secoes ?? []).length > 0));
      if (!temSint) return; // pula aulas sem síntese
      const card = _criarCardSintese(aula, idx);
      grid.appendChild(card);
    });
  } else if (State.modo === 'resumao') {
    // Resumão: cada entrada de State.resumao é um objeto no formato de aula
    // (com aula, ideia_central, secoes) — um card por entrada
    State.resumao.forEach((res, idx) => {
      if (!res) return;
      const temRes = !!(res.ideia_central || (res.secoes ?? []).length > 0);
      if (!temRes) return;
      const card = _criarCardResumao(res, idx);
      grid.appendChild(card);
    });
  } else {
    State.aulas.forEach((aula, idx) => {
      grid.appendChild(_criarCard(aula, idx));
    });
  }
}

/* ══════════════════════════════════════════════
   UTILITÁRIO: chip de professor
══════════════════════════════════════════════ */
function _profChip(nomeProf) {
  if (!nomeProf) return '';
  const icones = { Bruno: '🧑‍🏫', Wagner: '👨‍💻', Raul: '📐' };
  const icone  = icones[nomeProf] ?? '👤';
  return `<span class="card-prof-chip">${icone} ${_esc(nomeProf)}</span>`;
}

function _estimarTempo(aula) {
  const secoes = aula.secoes ?? [];
  let blocos = 0;
  secoes.forEach(s => { blocos += (s.blocos ?? []).length; });
  const minutos = Math.max(2, Math.round((secoes.length * 1.5 + blocos * 0.5)));
  return `~${minutos} min`;
}

function _nivelAula(secoes) {
  if (secoes >= 5) return { label: 'Avançado', color: 'var(--rose)' };
  if (secoes >= 3) return { label: 'Intermediário', color: 'var(--amber)' };
  return { label: 'Introdutório', color: 'var(--teal)' };
}

/* ══════════════════════════════════════════════
   HOVER NOS CARDS — anti-spam
   Um hover por card: dispara ao entrar no card,
   não repete enquanto o cursor move dentro dele.
══════════════════════════════════════════════ */
function _bindCardHover(card) {
  card.addEventListener('mouseenter', () => playSound('hover', 'resumos'));
}

/* ══════════════════════════════════════════════
   CARDS — Literary Atlas (chapter-mark design)
   Estrutura: stripe superior + header (nº/seta) +
   corpo (aula/título/descrição/meta).
══════════════════════════════════════════════ */
const _ARROW_SVG = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
  </svg>`;

function _criarCard(aula, idx) {
  const secoes  = aula.secoes ?? [];
  const aulaStr = _esc(aula.aula ?? '');
  const m       = aulaStr.match(/^(Aula\s*[\d\/]+)\s*[—–-]\s*(.+)$/i);
  const aulaNum = m ? m[1] : aulaStr;
  const aulaTit = m ? m[2] : '';
  const numPad  = String(idx + 1).padStart(2, '0');

  const card = document.createElement('article');
  card.className = 'resumo-card';
  card.dataset.tipo = 'completo';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Abrir: ${aula.aula}`);
  card.innerHTML = `
    <div class="resumo-card__stripe"></div>
    <div class="resumo-card__head">
      <span class="resumo-card__num">${numPad}</span>
      <span class="resumo-card__arrow">${_ARROW_SVG}</span>
    </div>
    <div class="resumo-card__body">
      <div class="resumo-card__aula">${aulaNum}</div>
      <div class="resumo-card__titulo">${aulaTit || aulaStr}</div>
      ${aula.ideia_central
        ? `<div class="resumo-card__desc">${_parseInline(aula.ideia_central)}</div>`
        : ''}
      <div class="resumo-card__meta">
        <span class="resumo-card__tag">
          <span class="resumo-card__tag-dot"></span>
          ${secoes.length} seç${secoes.length !== 1 ? 'ões' : 'ão'}
        </span>
        ${aula.professor ? `<span class="resumo-card__tag" style="opacity:.6">👤 ${_esc(aula.professor)}</span>` : ''}
      </div>
    </div>`;

  _bindCardHover(card);
  card.addEventListener('click', () => _abrirModal(aula));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _abrirModal(aula); }
  });
  return card;
}

function _criarCardSintese(aula, idx) {
  const aulaStr = _esc(aula.aula ?? '');
  const m       = aulaStr.match(/^(Aula\s*[\d\/]+)\s*[—–-]\s*(.+)$/i);
  const aulaNum = m ? m[1] : aulaStr;
  const aulaTit = m ? m[2] : '';
  const sint    = State.simplificado[idx] ?? null;
  const temSint = !!(sint && (sint.ideia_central || (sint.secoes ?? []).length > 0));
  const preview = sint?.ideia_central ?? null;
  const numSec  = (sint?.secoes ?? []).length;
  const numPad  = String(idx + 1).padStart(2, '0');

  const card = document.createElement('article');
  card.className = 'resumo-card';
  card.dataset.tipo = 'sintese';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Síntese: ${aula.aula}`);
  card.innerHTML = `
    <div class="resumo-card__stripe"></div>
    <div class="resumo-card__head">
      <span class="resumo-card__num">${numPad}</span>
      <span class="resumo-card__arrow">${_ARROW_SVG}</span>
    </div>
    <div class="resumo-card__body">
      <div class="resumo-card__aula">${aulaNum} · Síntese</div>
      <div class="resumo-card__titulo">${aulaTit || aulaStr}</div>
      ${preview
        ? `<div class="resumo-card__desc">${_parseInline(preview)}</div>`
        : `<div class="resumo-card__desc" style="font-style:italic;opacity:0.5">Síntese não disponível ainda.</div>`}
      <div class="resumo-card__meta">
        <span class="resumo-card__tag">
          <span class="resumo-card__tag-dot"></span>
          ${numSec} seç${numSec !== 1 ? 'ões' : 'ão'}
        </span>
      </div>
    </div>`;

  _bindCardHover(card);
  card.addEventListener('click', () => { if (temSint) _abrirModal(sint); });
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (temSint) _abrirModal(sint); }
  });
  return card;
}

/* ══════════════════════════════════════════════
   CARD — Resumão
══════════════════════════════════════════════ */
function _criarCardResumao(res, idx) {
  const aulaStr = _esc(res.aula ?? '');
  const m       = aulaStr.match(/^(Aula\s*[\d\/]+)\s*[—–-]\s*(.+)$/i);
  const aulaNum = m ? m[1] : aulaStr;
  const aulaTit = m ? m[2] : '';
  const preview = res.ideia_central ?? null;
  const numSec  = (res.secoes ?? []).length;
  const numPad  = String(idx + 1).padStart(2, '0');

  const card = document.createElement('article');
  card.className = 'resumo-card';
  card.dataset.tipo = 'resumao';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Resumão: ${res.aula}`);
  card.innerHTML = `
    <div class="resumo-card__stripe"></div>
    <div class="resumo-card__head">
      <span class="resumo-card__num">${numPad}</span>
      <span class="resumo-card__arrow">${_ARROW_SVG}</span>
    </div>
    <div class="resumo-card__body">
      <div class="resumo-card__aula">${aulaNum} · Resumão</div>
      <div class="resumo-card__titulo">${aulaTit || aulaStr}</div>
      ${preview
        ? `<div class="resumo-card__desc">${_parseInline(preview)}</div>`
        : `<div class="resumo-card__desc" style="font-style:italic;opacity:0.5">Resumão não disponível ainda.</div>`}
      <div class="resumo-card__meta">
        <span class="resumo-card__tag">
          <span class="resumo-card__tag-dot"></span>
          ${numSec} seç${numSec !== 1 ? 'ões' : 'ão'}
        </span>
      </div>
    </div>`;

  _bindCardHover(card);
  card.addEventListener('click', () => _abrirModalResumao(res));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _abrirModalResumao(res); }
  });
  return card;
}

/* ══════════════════════════════════════════════
   READER — RESUMÃO
══════════════════════════════════════════════ */
function _abrirModalResumao(res) {
  // res tem o mesmo formato de uma aula: { aula, ideia_central, secoes }
  // reutiliza o reader normal com badge diferente
  playSound('click', 'resumos');
  playSound('openModal', 'resumos');

  const aulaLabel = document.getElementById('rm-aula-label');
  if (aulaLabel) aulaLabel.textContent = res.aula ?? '';

  const badge = document.getElementById('rm-tipo-badge');
  if (badge) {
    badge.textContent = 'Resumão';
    badge.className   = 'reader__bar-badge badge--resumao';
  }

  const body = document.getElementById('rm-body');
  if (body) body.innerHTML = _buildReaderBody(res);

  const _accordionKey = _storageKeyAccordion((res.aula ?? String(Date.now())) + '__resumao');
  _bindReaderAccordion(_accordionKey);

  document.getElementById('read-modal').classList.add('read-modal--open');
  document.body.style.overflow = 'hidden';
  document.getElementById('read-modal-panel')?.focus();
  // Exibe botões flutuantes no modo leitura
  document.querySelector('.float-actions')?.classList.add('float-actions--visible');

  if (_progressCleanup) _progressCleanup();
  const scrollEl = document.getElementById('rm-body-wrapper');
  _progressCleanup = _updateReadingProgress(scrollEl);
}


/* ══════════════════════════════════════════════
   READER — tela cheia com seções colapsáveis
══════════════════════════════════════════════ */
function _bindModal() {
  document.getElementById('read-modal-close')?.addEventListener('click', () => {
    playSound('closeModal', 'resumos');
    _fecharModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      // Só toca se o reader estiver aberto
      if (document.getElementById('read-modal')?.classList.contains('read-modal--open')) {
        playSound('closeModal', 'resumos');
      }
      _fecharModal();
    }
  });
}

let _progressCleanup = null;

function _abrirModal(aula) {
  // Sons de abertura
  playSound('click', 'resumos');
  playSound('openModal', 'resumos');

  // Preenche barra superior
  const aulaLabel = document.getElementById('rm-aula-label');
  if (aulaLabel) aulaLabel.textContent = aula.aula ?? '';

  const badge = document.getElementById('rm-tipo-badge');
  if (badge) {
    const isSintese = State.modo === 'sintese';
    badge.textContent = isSintese ? 'Síntese' : 'Resumo';
    badge.className   = 'reader__bar-badge badge--conceito';
  }

  // Monta conteúdo no reader
  const body = document.getElementById('rm-body');
  if (body) body.innerHTML = _buildReaderBody(aula);

  // Bind dos acordeões
  const _accordionKey = _storageKeyAccordion(aula.aula ?? aula.id ?? String(Date.now()));
  _bindReaderAccordion(_accordionKey);

  // Abre
  document.getElementById('read-modal').classList.add('read-modal--open');
  document.body.style.overflow = 'hidden';
  document.getElementById('read-modal-panel')?.focus();
  // Exibe botões flutuantes no modo leitura
  document.querySelector('.float-actions')?.classList.add('float-actions--visible');

  // Barra de progresso
  if (_progressCleanup) _progressCleanup();
  const scrollEl = document.getElementById('rm-body-wrapper');
  _progressCleanup = _updateReadingProgress(scrollEl);
}

/* ── Chave localStorage por aula + disciplina + semestre ── */
function _storageKeyAccordion(aulaId) {
  const disc = State.disciplina?.id ?? 'unknown';
  const sem  = State.semestre    ?? 'unknown';
  const safe = String(aulaId).replace(/[^a-zA-Z0-9_\-\.]/g, '_');
  return `nexus_accordion__${sem}__${disc}__${safe}`;
}

function _lerEstadoAccordion(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function _salvarEstadoAccordion(key) {
  try {
    const estado = {};
    document.querySelectorAll('.rm-collapse').forEach(sec => {
      const idx = sec.dataset.sec;
      if (idx !== undefined) {
        estado[idx] = sec.classList.contains('rm-collapse--open');
      }
    });
    localStorage.setItem(key, JSON.stringify(estado));
  } catch (_) {}
}

function _restaurarEstadoAccordion(key) {
  const estado = _lerEstadoAccordion(key);
  if (!estado) return;
  document.querySelectorAll('.rm-collapse').forEach(sec => {
    const idx = sec.dataset.sec;
    if (idx !== undefined && estado[idx] !== undefined) {
      sec.classList.toggle('rm-collapse--open', estado[idx]);
      const trigger = sec.querySelector('.rm-collapse__trigger');
      if (trigger) trigger.setAttribute('aria-expanded', String(estado[idx]));
    }
  });
}

function _bindReaderAccordion(storageKey) {
  _restaurarEstadoAccordion(storageKey);

  document.querySelectorAll('.rm-collapse__trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.closest('.rm-collapse');
      if (!section) return;
      const isOpen = section.classList.contains('rm-collapse--open');
      section.classList.toggle('rm-collapse--open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      playSound('select', 'resumos');
      _salvarEstadoAccordion(storageKey);
    });
  });
}

function _buildReaderBody(aula) {
  const secoes  = aula.secoes ?? [];
  const aulaStr = aula.aula ?? '';
  const m       = aulaStr.match(/^(Aula\s*[\d\/]+)\s*[—–-]\s*(.+)$/i);
  const aulaNum = m ? m[1] : aulaStr;
  const aulaTit = m ? m[2] : '';
  const aulaNumero = aulaNum.replace(/\D/g, '');

  let html = `
    <div class="reader__hero">
      ${aulaNumero ? `<div class="reader__hero-number">${_esc(aulaNumero)}</div>` : ''}
      <div class="reader__hero-eyebrow">${_esc(aulaNum)}</div>
      <h1 class="reader__hero-title">${_esc(aulaTit || aulaStr)}</h1>
      <div class="hero-divider"></div>
      <div class="reader__hero-meta">
        <span class="reader__hero-chip">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          ${secoes.length} seç${secoes.length !== 1 ? 'ões' : 'ão'}
        </span>
        ${aula.professor ? `<span class="reader__hero-chip">👤 ${_esc(aula.professor)}</span>` : ''}
      </div>
    </div>`;

  if (aula.ideia_central) {
    html += `<div class="reader__ideia rm-ideia-central">
      <span class="rm-ideia-icon">💡</span>
      <span>${_parseInline(aula.ideia_central)}</span>
    </div>`;
  }

  secoes.forEach((sec, i) => {
    html += `
      <div class="rm-collapse" data-sec="${i}">
        <button class="rm-collapse__trigger" aria-expanded="false">
          <span class="rm-collapse__icon">${String(i + 1).padStart(2,'0')}</span>
          <span style="flex:1;text-align:left;font-size:0.9rem;font-weight:600;color:inherit;line-height:1.35">${_esc(sec.titulo)}</span>
          <svg class="rm-collapse__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="rm-collapse__body">
          <div class="rm-collapse__body-inner">
            <div class="rm-collapse__body-content">
              ${(sec.blocos ?? []).map(b => _renderBloco(b)).join('')}
            </div>
          </div>
        </div>
      </div>`;
  });

  return html;
}

function _fecharModal() {
  document.getElementById('read-modal')?.classList.remove('read-modal--open');
  document.body.style.overflow = '';
  // Oculta botões flutuantes ao sair da leitura
  document.querySelector('.float-actions')?.classList.remove('float-actions--visible');
  if (State._tocObserver) {
    State._tocObserver.disconnect();
    State._tocObserver = null;
  }
  if (_progressCleanup) {
    _progressCleanup();
    _progressCleanup = null;
  }
  const bar = document.getElementById('reading-progress');
  if (bar) { bar.style.width = '0%'; bar.classList.remove('reading-progress--visible'); }
}

/* Mantido para compatibilidade */
function _buildModalBody(aula) { return _buildReaderBody(aula); }
function _bindModalTabs() {}
function _ativarSecao() {}
function _initTocScrollSpy() {}

/* ══════════════════════════════════════════════
   RENDERIZADOR DE BLOCOS
══════════════════════════════════════════════ */
function _imgBase() {
  const { ano, periodo, ap } = parseSemestre(State.semestre ?? '2026.1');
  const apPath = ap ? `/${ap}` : '';
  const disc   = State.disciplina;
  return disc
    ? `../content/resumo/${ano}/${periodo}${apPath}/image/imagens_${disc.arquivo}/`
    : `../content/resumo/${ano}/${periodo}${apPath}/image/`;
}

function _renderBloco(b) {
  switch (b.tipo) {
    case 'topico': {
      const base = _imgBase();
      let html = `<div class="rm-topico">`;
      html += `<div class="rm-topico__titulo">${_parseInline(b.titulo ?? '')}</div>`;
      if (b.texto)  html += `<p class="rm-topico__texto">${_parseInline(b.texto)}</p>`;
      if (b.imagem) html += `
        <figure class="rm-topico__fig">
          <img class="rm-topico__img" src="${_esc(base + b.imagem.src)}" alt="${_esc(b.imagem.alt)}" loading="lazy" />
          <figcaption class="rm-topico__fig-caption">${_esc(b.imagem.alt)}</figcaption>
        </figure>`;
      if (b.lista)  html += `<ul class="rm-lista">${b.lista.map(i => `<li><span>${_parseInline(i)}</span></li>`).join('')}</ul>`;
      if (b.codigo) html += `<pre class="rm-codigo"><code>${_esc(b.codigo)}</code></pre>`;
      html += `</div>`;
      return html;
    }
    case 'imagem': {
      const { ano, periodo, ap } = parseSemestre(State.semestre ?? '2026.1');
      const apPath = ap ? `/${ap}` : '';
      const base = b.pasta
        ? `../content/resumo/${ano}/${periodo}${apPath}/image/${b.pasta}/`
        : _imgBase();
      const num  = b.num ? `<span class="rm-fig__num">Figura ${b.num}</span>` : '';
      return `
        <figure class="rm-fig">
          <img class="rm-fig__img" src="${_esc(base + b.src)}" alt="${_esc(b.alt ?? '')}" loading="lazy" />
          <figcaption class="rm-fig__caption">${num}<span class="rm-fig__caption-text">${_esc(b.alt ?? '')}</span></figcaption>
        </figure>`;
    }
    case 'lista': {
      let html = '';
      if (b.titulo) html += `<p class="rm-lista-titulo">${_parseInline(b.titulo)}</p>`;
      html += `<ul class="rm-lista">${(b.itens ?? []).map(i => `<li><span>${_parseInline(i)}</span></li>`).join('')}</ul>`;
      return html;
    }
    case 'texto':
      return `<p class="rm-topico__texto" style="margin-bottom:0.85rem">${_parseInline(b.texto ?? '')}</p>`;
    case 'subtitulo':
      return `<div class="rm-subtitulo">${_parseInline(b.texto ?? '')}</div>`;
    case 'exemplo':
      return `<div class="rm-exemplo">
        <div class="rm-exemplo__titulo">${_esc(b.titulo ?? '')}</div>
        <p class="rm-exemplo__texto">${_parseInline(b.texto ?? '')}</p>
        ${b.detalhe ? `<span class="rm-exemplo__detalhe">${_parseInline(b.detalhe)}</span>` : ''}
      </div>`;
    case 'tabela': {
      const cols = b.colunas ?? [];
      const rows = b.linhas  ?? [];
      return `
        ${b.titulo ? `<div class="rm-topico__titulo">${_parseInline(b.titulo)}</div>` : ''}
        <div class="rm-tabela-wrap">
          <table class="rm-tabela">
            <thead><tr>${cols.map(c => `<th>${_esc(c)}</th>`).join('')}</tr></thead>
            <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${_parseInline(c)}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>`;
    }
    case 'codigo':
      return `<pre class="rm-codigo"><code>${_esc(b.codigo ?? '')}</code></pre>`;
    case 'destaque':
      return `<div class="rm-destaque">${_parseInline(b.texto ?? '')}</div>`;
    default:
      return '';
  }
}

/* ══════════════════════════════════════════════
   SIDEBAR de disciplinas
══════════════════════════════════════════════ */
function _renderSidebar() {
  const semLabel = document.getElementById('sidebar-semestre');
  if (semLabel) semLabel.textContent = State.semestre ?? '—';

  const list = document.getElementById('disc-list');
  if (!list) return;
  list.innerHTML = '';

  if (!State.disciplinas.length) {
    list.innerHTML = `
      <div style="padding:1.5rem 0.75rem;text-align:center;color:var(--text-3);font-size:0.72rem;letter-spacing:0.06em;line-height:1.7;">
        <div style="font-size:1.4rem;margin-bottom:0.5rem;">📭</div>
        Nenhuma disciplina<br>neste semestre
      </div>`;
    _mostrarEstado('no-content');
    return;
  }

  State.disciplinas.forEach(disc => {
    const isAtivo = disc.id === State.disciplina?.id;
    const item    = document.createElement('button');
    item.className      = `disc-item${isAtivo ? ' disc-item--active' : ''}`;
    item.dataset.discId = disc.id;
    item.setAttribute('aria-current', isAtivo ? 'page' : 'false');
    item.title = disc.nome;
    item.innerHTML = `
      <span class="disc-item__emoji">${disc.emoji}</span>
      <span class="disc-item__info">
        <span class="disc-item__nome">${disc.nome}</span>
      </span>
      <svg class="disc-item__chevron" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>`;
    item.addEventListener('mouseenter', () => playSound('hover', 'resumos'));
    item.addEventListener('click', () => _trocarDisciplina(disc));
    list.appendChild(item);
  });
}

function _atualizarSidebarAtivo(discId) {
  document.querySelectorAll('.disc-item').forEach(el => {
    const a = el.dataset.discId === discId;
    el.classList.toggle('disc-item--active', a);
    el.setAttribute('aria-current', a ? 'page' : 'false');
  });
}

function _marcarStatusConteudo(discId, tem) {
  const el = document.getElementById(`disc-status-${discId}`);
  if (el) {
    el.textContent = tem ? 'Disponível' : 'Sem conteúdo';
    el.className   = `disc-item__status disc-item__status--${tem ? 'ok' : 'empty'}`;
  }
}

function _trocarDisciplina(disc) {
  if (disc.id === State.disciplina?.id) return;
  playSound('click', 'resumos');
  State.disciplina   = disc;
  State.temConteudo  = null;
  State.aulas        = [];
  State.simplificado = [];
  State.resumao      = [];
  State.modo         = 'completo';
  setDisciplina(disc.id);

  sincronizarSemNaURL(State.semestre, 'push');
  const url = new URL(window.location.href);
  url.searchParams.set('disc', disc.id);
  window.history.pushState({}, '', url);

  _atualizarSidebarAtivo(disc.id);
  _renderHeader();
  _fecharMobileDropdown();
  aplicarCoresDisciplina(disc.arquivo, State.DISC_CORES);
  _carregarConteudo();
}

/* ══════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════ */
function _renderHeader() {
  const disc = State.disciplina;

  const bc = document.getElementById('header-breadcrumb');
  if (bc) bc.innerHTML = disc ? `Resumos <span>· ${disc.nome}</span>` : 'Resumos';

  const badge = document.getElementById('disc-badge');
  if (badge) {
    if (disc && State.disciplinas.length > 0) {
      const label = disc.apelido ?? disc.nome;
      badge.style.display = '';
      badge.innerHTML = `
        <span style="flex-shrink:0">${disc.emoji}</span>
        <span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;min-width:0">${label}</span>`;
    } else {
      badge.style.display = 'none';
      badge.innerHTML = '';
    }
  }

  const ey = document.getElementById('hero-eyebrow-text');
  if (ey) ey.textContent = disc?.nome ?? 'Resumos';

  const ml = document.getElementById('mobile-disc-label');
  if (ml) ml.textContent = disc ? `${disc.emoji} ${disc.apelido ?? _nomeCurto(disc.nome, 20)}` : 'Disciplina';

  document.title = disc ? `Resumos — ${disc.nome} · Nexus Study` : 'Resumos · Nexus Study';
  _atualizarStatusBadge();
}

function _nomeCurto(nome, max = 18) {
  return nome.length > max ? nome.slice(0, max - 2) + '…' : nome;
}

/* ══════════════════════════════════════════════
   MOBILE DROPDOWN
══════════════════════════════════════════════ */
function _bindMobileDropdown() {
  document.getElementById('mobile-disc-btn')?.addEventListener('mouseenter', () => playSound('hover', 'resumos'));
  document.getElementById('mobile-disc-btn')?.addEventListener('click', () => {
    playSound('click', 'resumos');
    _abrirMobileDropdown();
  });
  document.getElementById('mobile-dropdown-backdrop')?.addEventListener('click', () => {
    playSound('closeModal', 'resumos');
    _fecharMobileDropdown();
  });
}

function _abrirMobileDropdown() {
  const dd   = document.getElementById('mobile-dropdown');
  const list = document.getElementById('mobile-dropdown-list');
  if (!dd || !list) return;
  list.innerHTML = '';
  State.disciplinas.forEach(disc => {
    const isAtivo = disc.id === State.disciplina?.id;
    const btn = document.createElement('button');
    btn.className = `disc-item${isAtivo ? ' disc-item--active' : ''}`;
    btn.innerHTML = `
      <span class="disc-item__emoji">${disc.emoji}</span>
      <span class="disc-item__info"><span class="disc-item__nome">${disc.nome}</span></span>`;
    btn.addEventListener('mouseenter', () => playSound('hover', 'resumos'));
    btn.addEventListener('click', () => _trocarDisciplina(disc));
    list.appendChild(btn);
  });
  playSound('openModal', 'resumos');
  dd.classList.add('mobile-dropdown--open');
  document.body.style.overflow = 'hidden';
}

function _fecharMobileDropdown() {
  document.getElementById('mobile-dropdown')?.classList.remove('mobile-dropdown--open');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════
   UTILITÁRIOS
══════════════════════════════════════════════ */
function _esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function _parseInline(str) {
  if (!str) return '';
  return _esc(str)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

/* ══════════════════════════════════════════════
   BOTÕES FLUTUANTES LATERAIS
   ✦ Scroll to top / Collapse all / Scroll to bottom
══════════════════════════════════════════════ */
(function _initFloatActions() {

  const container = document.createElement('div');
  container.className = 'float-actions';
  container.setAttribute('aria-label', 'Ações rápidas');
  container.innerHTML = `
    <button class="float-btn float-btn--top" id="fab-top" data-tip="Ir ao topo" aria-label="Rolar até o topo">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
    <button class="float-btn float-btn--collapse" id="fab-collapse" data-tip="Recolher seções" aria-label="Recolher todas as seções" style="margin-top:0.75rem;margin-bottom:0.75rem;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="4 14 12 14 12 20"/>
        <polyline points="20 10 12 10 12 4"/>
        <line x1="4" y1="20" x2="12" y2="12"/>
        <line x1="20" y1="4" x2="12" y2="12"/>
      </svg>
    </button>
    <button class="float-btn float-btn--bottom" id="fab-bottom" data-tip="Ir ao final" aria-label="Rolar até o final">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>`;
  document.body.appendChild(container);

  const fabTop      = document.getElementById('fab-top');
  const fabCollapse = document.getElementById('fab-collapse');
  const fabBottom   = document.getElementById('fab-bottom');

  function _getScrollTarget() {
    const reader = document.getElementById('read-modal');
    if (reader && reader.classList.contains('read-modal--open')) {
      return document.getElementById('rm-body-wrapper') ?? window;
    }
    return window;
  }

  fabTop.addEventListener('click', () => {
    playSound('click', 'resumos');
    const target = _getScrollTarget();
    if (target === window) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      target.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  fabBottom.addEventListener('click', () => {
    playSound('click', 'resumos');
    const target = _getScrollTarget();
    if (target === window) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
      target.scrollTo({ top: target.scrollHeight, behavior: 'smooth' });
    }
  });

  fabCollapse.addEventListener('click', () => {
    playSound('select', 'resumos');
    const sections = document.querySelectorAll('.rm-collapse');
    if (!sections.length) return;

    sections.forEach(sec => {
      sec.classList.remove('rm-collapse--open');
      const trigger = sec.querySelector('.rm-collapse__trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });

    const aulaLabel = document.getElementById('rm-aula-label');
    if (aulaLabel && aulaLabel.textContent) {
      const disc = window.__nexusState?.disciplina?.id ?? 'unknown';
      const sem  = window.__nexusState?.semestre       ?? 'unknown';
      const safe = String(aulaLabel.textContent).replace(/[^a-zA-Z0-9_\-\.]/g, '_');
      try {
        const estado = {};
        sections.forEach(sec => { if (sec.dataset.sec !== undefined) estado[sec.dataset.sec] = false; });
        localStorage.setItem(`nexus_accordion__${sem}__${disc}__${safe}`, JSON.stringify(estado));
      } catch (_) {}
    }
  });

  fabTop.classList.remove('float-btn--hidden');
  fabBottom.classList.remove('float-btn--hidden');

})();