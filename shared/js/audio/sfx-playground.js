/* =============================================
   NEXUS STUDY — shared/js/utils/sfx-playground.js
   Playground de áudio — dev only
   Lê o catálogo do sfx.js automaticamente.
   ============================================= */

/**
 * USO:
 *   import { initSfxPlayground } from './shared/js/sfx-playground.js';
 *   initSfxPlayground();
 *
 * Um botão "◈ sfx" aparece no canto inferior esquerdo.
 * Clique para abrir o modal com todos os sons do catálogo.
 *
 * Qualquer som adicionado no sfx.js aparece aqui automaticamente.
 * Remova a importação ao ir para produção.
 */

import audio from './sfx.js';

/* ─────────────────────────────────────────────
   CONFIGURAÇÃO DE CATEGORIAS
   Define label e ordem de exibição.
   Se uma categoria nova aparecer no catálogo,
   ela cai em "outros" automaticamente.
───────────────────────────────────────────── */
const CATEGORY_CONFIG = {
  ui:        { label: '// ui',         order: 0 },
  feedback:  { label: '// feedback',   order: 1 },
  alerts:    { label: '// alertas',    order: 2 },
  music:     { label: '// música',     order: 3 },
  ambient:   { label: '// ambient',    order: 4 },
};

const VARIANT_COLORS = {
  success: { border: '#4dd9b4', text: '#4dd9b4', bg: 'rgba(77,217,180,0.1)' },
  danger:  { border: '#f87171', text: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  warning: { border: '#fbbf24', text: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  info:    { border: '#60a5fa', text: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
};

/* ─────────────────────────────────────────────
   AGRUPAR CATÁLOGO POR CATEGORIA
───────────────────────────────────────────── */
function _groupCatalog() {
  const groups = {};

  audio.catalog.forEach(entry => {
    const cat = entry.category || 'outros';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(entry);
  });

  // Ordena grupos pela config, desconhecidos vão pro final
  return Object.entries(groups).sort(([a], [b]) => {
    const oa = CATEGORY_CONFIG[a]?.order ?? 99;
    const ob = CATEGORY_CONFIG[b]?.order ?? 99;
    return oa - ob;
  });
}

/* ─────────────────────────────────────────────
   RENDER DO BOTÃO DE SOM (sfx)
───────────────────────────────────────────── */
function _renderSfxBtn(entry) {
  const btn = document.createElement('button');
  btn.className    = 'sfxp-btn';
  btn.textContent  = entry.label;
  btn.title        = entry.description || '';

  const colors = VARIANT_COLORS[entry.variant];
  if (colors) {
    btn.style.setProperty('--sfxp-hover-border', colors.border);
    btn.style.setProperty('--sfxp-hover-text',   colors.text);
    btn.style.setProperty('--sfxp-hover-bg',     colors.bg);
    btn.dataset.variant = entry.variant;
  }

  btn.addEventListener('click', () => {
    try {
      entry.fn.call(entry);
    } catch (e) {
      console.error(`[sfx-playground] Erro ao tocar "${entry.id}":`, e);
    }

    // Log
    const log = document.getElementById('sfxp-log');
    if (log) log.textContent = `audio.sfx.${entry.id}()`;

    // Flash
    btn.classList.add('is-playing');
    setTimeout(() => btn.classList.remove('is-playing'), 300);
  });

  return btn;
}

/* ─────────────────────────────────────────────
   RENDER DO PLAYER DE MÚSICA (music)
───────────────────────────────────────────── */
function _renderMusicPlayer(entry) {
  const wrap = document.createElement('div');
  wrap.className = 'sfxp-music-player';
  wrap.dataset.id = entry.id;

  wrap.innerHTML = `
    <div class="sfxp-music-info">
      <span class="sfxp-music-label">${entry.label}</span>
      ${entry.description ? `<span class="sfxp-music-desc">${entry.description}</span>` : ''}
    </div>
    <div class="sfxp-music-controls">
      <button class="sfxp-music-btn sfxp-music-play" aria-label="Play ${entry.label}">▶</button>
      <button class="sfxp-music-btn sfxp-music-stop" aria-label="Stop">■</button>
    </div>
  `;

  const playBtn = wrap.querySelector('.sfxp-music-play');
  const stopBtn = wrap.querySelector('.sfxp-music-stop');

  function _updateState() {
    const isPlaying = audio.music.currentId?.() === entry.id;
    playBtn.textContent = isPlaying ? '❚❚' : '▶';
    wrap.classList.toggle('is-playing', isPlaying);
  }

  playBtn.addEventListener('click', () => {
    const isPlaying = audio.music.currentId?.() === entry.id;
    if (isPlaying) {
      audio.music.stop(0.5);
    } else {
      entry.fn.call(entry);
    }
    const log = document.getElementById('sfxp-log');
    if (log) log.textContent = `audio.music.${entry.label}()`;
    setTimeout(() => {
      _updateState();
      document.querySelectorAll('.sfxp-music-player').forEach(p => {
        const pid = p.dataset.id;
        const pIsPlaying = audio.music.currentId?.() === pid;
        p.querySelector('.sfxp-music-play').textContent = pIsPlaying ? '❚❚' : '▶';
        p.classList.toggle('is-playing', pIsPlaying);
      });
    }, 100);
  });

  stopBtn.addEventListener('click', () => {
    audio.music.stop(0.5);
    setTimeout(() => {
      document.querySelectorAll('.sfxp-music-player').forEach(p => {
        p.querySelector('.sfxp-music-play').textContent = '▶';
        p.classList.remove('is-playing');
      });
      const log = document.getElementById('sfxp-log');
      if (log) log.textContent = 'audio.music.stop()';
    }, 100);
  });

  return wrap;
}

/* ─────────────────────────────────────────────
   RENDER DO MODAL
───────────────────────────────────────────── */
function _buildModal() {
  const overlay = document.createElement('div');
  overlay.id = 'sfx-playground-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'SFX Playground');

  const modal = document.createElement('div');
  modal.id = 'sfx-playground-modal';

  const state = audio.getState();

  modal.innerHTML = `
    <div class="sfxp-header">
      <div class="sfxp-header-left">
        <span class="sfxp-dot"></span>
        <span class="sfxp-title">sfx_playground</span>
      </div>
      <button class="sfxp-close" id="sfxp-close" aria-label="Fechar">✕</button>
    </div>

    <div class="sfxp-volumes">
      <div class="sfxp-vol-row">
        <span class="sfxp-vol-label">master</span>
        <input type="range" id="sfxp-master" min="0" max="1" step="0.05" value="${state.masterVolume}" />
        <span class="sfxp-vol-num" id="sfxp-master-num">${Math.round(state.masterVolume * 100)}%</span>
      </div>
      <div class="sfxp-vol-row">
        <span class="sfxp-vol-label">sfx</span>
        <input type="range" id="sfxp-sfx" min="0" max="1" step="0.05" value="${state.sfxVolume}" />
        <span class="sfxp-vol-num" id="sfxp-sfx-num">${Math.round(state.sfxVolume * 100)}%</span>
      </div>
      <div class="sfxp-vol-row">
        <span class="sfxp-vol-label">music</span>
        <input type="range" id="sfxp-music" min="0" max="1" step="0.05" value="${state.musicVolume}" />
        <span class="sfxp-vol-num" id="sfxp-music-num">${Math.round(state.musicVolume * 100)}%</span>
      </div>
    </div>

    <div class="sfxp-body" id="sfxp-body"></div>

    <div class="sfxp-footer">
      <span class="sfxp-footer-prompt">&gt;</span>
      <span class="sfxp-footer-log" id="sfxp-log">aguardando...</span>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Renderiza grupos automaticamente
  const body = modal.querySelector('#sfxp-body');
  const groups = _groupCatalog();

  groups.forEach(([catKey, entries], gi) => {
    if (gi > 0) {
      const hr = document.createElement('hr');
      hr.className = 'sfxp-divider';
      body.appendChild(hr);
    }

    const section = document.createElement('section');
    const label   = CATEGORY_CONFIG[catKey]?.label ?? `// ${catKey}`;

    const header = document.createElement('p');
    header.className   = 'sfxp-group-label';
    header.textContent = label;
    section.appendChild(header);

    const hasSfx   = entries.some(e => e.type === 'sfx');
    const hasMusic  = entries.some(e => e.type === 'music');

    if (hasSfx) {
      const btnWrap = document.createElement('div');
      btnWrap.className = 'sfxp-group-btns';
      entries
        .filter(e => e.type === 'sfx')
        .forEach(e => btnWrap.appendChild(_renderSfxBtn(e)));
      section.appendChild(btnWrap);
    }

    if (hasMusic) {
      const musicWrap = document.createElement('div');
      musicWrap.className = 'sfxp-music-list';
      entries
        .filter(e => e.type === 'music')
        .forEach(e => musicWrap.appendChild(_renderMusicPlayer(e)));
      section.appendChild(musicWrap);
    }

    body.appendChild(section);
  });

  // Controles de volume
  function _bindVol(id, numId, setter) {
    const el  = modal.querySelector(`#${id}`);
    const num = modal.querySelector(`#${numId}`);
    el.addEventListener('input', () => {
      setter(parseFloat(el.value));
      num.textContent = `${Math.round(parseFloat(el.value) * 100)}%`;
    });
  }

  _bindVol('sfxp-master', 'sfxp-master-num', v => audio.setMasterVolume(v));
  _bindVol('sfxp-sfx',    'sfxp-sfx-num',    v => audio.setSfxVolume(v));
  _bindVol('sfxp-music',  'sfxp-music-num',  v => audio.setMusicVolume(v));

  // Fechar
  modal.querySelector('#sfxp-close').addEventListener('click', _close);
  overlay.addEventListener('click', e => { if (e.target === overlay) _close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') _close(); });

  return overlay;
}

/* ─────────────────────────────────────────────
   ABRIR / FECHAR
───────────────────────────────────────────── */
function _open()  { document.getElementById('sfx-playground-overlay')?.classList.add('is-open'); }
function _close() { document.getElementById('sfx-playground-overlay')?.classList.remove('is-open'); }

/* ─────────────────────────────────────────────
   BOTÃO FLUTUANTE
───────────────────────────────────────────── */
function _buildTrigger() {
  const btn = document.createElement('button');
  btn.id = 'sfx-playground-trigger';
  btn.setAttribute('aria-label', 'Abrir SFX Playground');
  btn.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
    sfx
  `;
  btn.addEventListener('click', _open);
  document.body.appendChild(btn);
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
export function initSfxPlayground() {
  if (document.getElementById('sfx-playground-overlay')) return;
  _buildTrigger();
  _buildModal();
}