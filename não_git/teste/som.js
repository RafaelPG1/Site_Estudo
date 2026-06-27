// ================================================
// NEXUS STUDY — som.js
// Protótipo de configuração de som
// ================================================

import audio from '../../shared/js/audio/sfx.js';

// ────────────────────────────────────────────────
// CONFIGURAÇÃO DO RANGE 0 → 2.0
// O slider vai de 0 a 200 (inteiro), onde:
//   0   = silêncio
//   100 = 1.0 (padrão — volume normal)
//   200 = 2.0 (boost máximo)
// ────────────────────────────────────────────────

const SLIDER_MAX   = 200;   // max do input range
const DEFAULT_MASTER = 100; // = 1.0
const DEFAULT_MUSIC  = 100; // = 1.0
const DEFAULT_SFX    = 100; // = 1.0

function sliderToReal(val) {
  return (parseInt(val, 10) / 100).toFixed(2);
}

function isAboveDefault(val) {
  return parseInt(val, 10) > 100;
}

// ────────────────────────────────────────────────
// DADOS DAS CATEGORIAS
// ────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'click',
    name: 'Click Sounds',
    desc: 'Sons ao clicar em botões e elementos.',
    icon: '◉',
    cls: 'sound-card--click',
    areas: ['Game', 'Quiz', 'Perfil', 'Resumos'],
    defaultAreas: ['Game', 'Quiz'],
    defaultVariant: 'click',
    variants: [
      { id: 'click',  label: 'Click 1 — Triangle blip',    fn: () => audio.sfx.click?.() },
      { id: 'click2', label: 'Click 2 — Sine tap',          fn: () => audio.sfx.click2?.() },
      { id: 'click3', label: 'Click 3 — Sawtooth pluck',    fn: () => audio.sfx.click3?.() },
      { id: 'click4', label: 'Click 4 — Double tap',        fn: () => audio.sfx.click4?.() },
      { id: 'click5', label: 'Click 5 — Micro ping',        fn: () => audio.sfx.click5?.() },
      { id: 'click6', label: 'Click 6 — Thud grave',        fn: () => audio.sfx.click6?.() },
    ],
  },
  {
    id: 'hover',
    name: 'Hover Sounds',
    desc: 'Sons ao passar o cursor sobre elementos.',
    icon: '◈',
    cls: 'sound-card--hover',
    areas: ['Game', 'Quiz', 'Perfil', 'Resumos'],
    defaultAreas: ['Game'],
    defaultVariant: 'hover2',
    variants: [
      { id: 'hover',  label: 'Hover 1 — Breath sine',       fn: () => audio.sfx.hover?.() },
      { id: 'hover2', label: 'Hover 2 — Whisper sweep',     fn: () => audio.sfx.hover2?.() },
      { id: 'hover3', label: 'Hover 3 — Drip sine',         fn: () => audio.sfx.hover3?.() },
      { id: 'hover4', label: 'Hover 4 — Tap suave grave',   fn: () => audio.sfx.hover4?.() },
      { id: 'hover5', label: 'Hover 5 — Blip neutro',       fn: () => audio.sfx.hover5?.() },
      { id: 'hover6', label: 'Hover 6 — Glide sci-fi',      fn: () => audio.sfx.hover6?.() },
      { id: 'hover7', label: 'Hover 7 — Tick micro',        fn: () => audio.sfx.hover7?.() },
      { id: 'hover8', label: 'Hover 8 — Hiss premium',      fn: () => audio.sfx.hover8?.() },
    ],
  },
  {
    id: 'select',
    name: 'Select Sounds',
    desc: 'Sons ao selecionar opções e respostas.',
    icon: '⊛',
    cls: 'sound-card--select',
    areas: ['Game', 'Quiz', 'Perfil', 'Resumos'],
    defaultAreas: ['Quiz', 'Game'],
    defaultVariant: 'select',
    variants: [
      { id: 'select',   label: 'Select 1 — Tick ascendente',  fn: () => audio.sfx.select?.() },
      { id: 'select2',  label: 'Select 2 — Pluck triangle',   fn: () => audio.sfx.select2?.() },
      { id: 'select3',  label: 'Select 3 — Beep 8-bit',       fn: () => audio.sfx.select3?.() },
      { id: 'select4',  label: 'Select 4 — Chime 3 notas',    fn: () => audio.sfx.select4?.() },
      { id: 'select5',  label: 'Select 5 — Sweep sci-fi',     fn: () => audio.sfx.select5?.() },
      { id: 'select6',  label: 'Select 6 — Double tap',       fn: () => audio.sfx.select6?.() },
      { id: 'select7',  label: 'Select 7 — Ping cristalino',  fn: () => audio.sfx.select7?.() },
      { id: 'select8',  label: 'Select 8 — Thock mecânico',   fn: () => audio.sfx.select8?.() },
      { id: 'select9',  label: 'Select 9 — Shimmer etéreo',   fn: () => audio.sfx.select9?.() },
      { id: 'select10', label: 'Select 10 — Micro-whoosh',    fn: () => audio.sfx.select10?.() },
    ],
  },
  {
    id: 'modal',
    name: 'Modal Sounds',
    desc: 'Sons ao abrir e fechar modais e painéis.',
    icon: '⊡',
    cls: 'sound-card--modal',
    areas: ['Game', 'Quiz', 'Perfil', 'Resumos'],
    defaultAreas: ['Game', 'Perfil'],
    defaultVariant: 'openModal2',
    variants: [
      { id: 'openModal',   label: 'Open 1 — Chime entrada',      fn: () => audio.sfx.openModal?.() },
      { id: 'openModal2',  label: 'Open 2 — Sweep aéreo',        fn: () => audio.sfx.openModal2?.() },
      { id: 'openModal3',  label: 'Open 3 — Cristalino',         fn: () => audio.sfx.openModal3?.() },
      { id: 'closeModal',  label: 'Close 1 — Sweep descendente', fn: () => audio.sfx.closeModal?.() },
      { id: 'closeModal2', label: 'Close 2 — Collapse sci-fi',   fn: () => audio.sfx.closeModal2?.() },
      { id: 'closeModal3', label: 'Close 3 — Retro dismiss',     fn: () => audio.sfx.closeModal3?.() },
    ],
  },
];

const MUSIC_TRACKS = [
  { id: 'music-menu',    name: 'Menu Principal', desc: 'Atmosfera ambient suave',        fn: () => audio.music['music-menu']?.() },
  { id: 'music-game',    name: 'Game',           desc: 'Futurista — arpejo sci-fi',      fn: () => audio.music['music-game']?.() },
  { id: 'music-quiz',    name: 'Quiz',           desc: 'Emocional e acolhedora',         fn: () => audio.music['music-quiz']?.() },
  { id: 'music-results', name: 'Resultados',     desc: 'Lo-fi digital, missão concluída',fn: () => audio.music['music-results']?.() },
  { id: 'music-profile', name: 'Área Pessoal',   desc: 'Jornada do jogador, motivadora', fn: () => audio.music['music-profile']?.() },
];

// ────────────────────────────────────────────────
// STATE
// ────────────────────────────────────────────────

const state = {
  masterEnabled:  true,
  musicEnabled:   true,
  masterSlider:   DEFAULT_MASTER, // int 0–150
  musicSlider:    DEFAULT_MUSIC,
  sfxSlider:      DEFAULT_SFX,
  selectedVariant: {},  // { catId: variantId }
  enabledCats:     {},  // { catId: bool }
  selectedAreas:   {},  // { catId: string[] }
  playingMusic:    null,
};

CATEGORIES.forEach(cat => {
  state.selectedVariant[cat.id] = cat.defaultVariant;
  state.enabledCats[cat.id]     = true;
  state.selectedAreas[cat.id]   = [...cat.areas]; // all areas active by default (no specific overrides)
});

// ────────────────────────────────────────────────
// STATE — área específica
// specificOverrides: { catId: { areaName: variantId | null } }
// null = usa padrão (área geral)
// ────────────────────────────────────────────────

const specificOverrides = {};
CATEGORIES.forEach(cat => {
  specificOverrides[cat.id] = {};
  cat.areas.forEach(area => {
    specificOverrides[cat.id][area] = null;
  });
});

function hasOverride(catId, area) {
  return specificOverrides[catId][area] !== null;
}

function countOverrides(catId) {
  return Object.values(specificOverrides[catId]).filter(v => v !== null).length;
}

// ────────────────────────────────────────────────
// RENDER — Sound Cards
// ────────────────────────────────────────────────

function renderCards() {
  const grid = document.getElementById('cardsGrid');
  grid.innerHTML = '';

  CATEGORIES.forEach((cat, ci) => {
    const card = document.createElement('div');
    card.className = `sound-card ${cat.cls}`;
    card.id = `sc-${cat.id}`;
    card.style.animationDelay = `${ci * 55}ms`;
    if (!state.enabledCats[cat.id]) card.classList.add('is-disabled');

    // Head
    const head = document.createElement('div');
    head.className = 'sound-card__head';
    head.innerHTML = `
      <div class="sound-card__head-left">
        <div class="sound-card__icon">${cat.icon}</div>
        <div>
          <span class="sound-card__name">${cat.name}</span>
          <span class="sound-card__desc">${cat.desc}</span>
        </div>
      </div>
    `;
    const toggleWrap = buildCatToggle(cat.id);
    head.appendChild(toggleWrap);
    card.appendChild(head);

    // Variant section
    const secLabel = document.createElement('div');
    secLabel.className = 'sound-card__sec';
    secLabel.textContent = 'Variante ativa';
    card.appendChild(secLabel);

    // For 'modal' category, split into Open / Close subsections
    if (cat.id === 'modal') {
      const openVariants  = cat.variants.filter(v => v.id.startsWith('open') || v.id.startsWith('Open'));
      const closeVariants = cat.variants.filter(v => v.id.startsWith('close') || v.id.startsWith('Close'));

      const openSec = document.createElement('div');
      openSec.className = 'sound-card__sec sound-card__sec--sub';
      openSec.textContent = 'ABRIR';
      card.appendChild(openSec);

      const openList = document.createElement('div');
      openList.className = 'sound-card__variants';
      openVariants.forEach(v => openList.appendChild(buildVariantRow(cat, v)));
      card.appendChild(openList);

      const closeSec = document.createElement('div');
      closeSec.className = 'sound-card__sec sound-card__sec--sub';
      closeSec.textContent = 'FECHAR';
      card.appendChild(closeSec);

      const closeList = document.createElement('div');
      closeList.className = 'sound-card__variants';
      closeVariants.forEach(v => closeList.appendChild(buildVariantRow(cat, v)));
      card.appendChild(closeList);
    } else {
      const varList = document.createElement('div');
      varList.className = 'sound-card__variants';
      cat.variants.forEach(v => {
        varList.appendChild(buildVariantRow(cat, v));
      });
      card.appendChild(varList);
    }

    // ── Areas section ──
    const areaSecLabel = document.createElement('div');
    areaSecLabel.className = 'sound-card__sec';
    areaSecLabel.textContent = 'ÁREA GERAL';
    card.appendChild(areaSecLabel);

    const areasSection = document.createElement('div');
    areasSection.className = 'sound-card__areas-section';
    areasSection.id = `areas-section-${cat.id}`;

    const generalRow = document.createElement('div');
    generalRow.className = 'areas-general';
    generalRow.id = `areas-general-${cat.id}`;
    cat.areas.forEach(area => {
      generalRow.appendChild(buildGeneralAreaChip(cat.id, area));
    });
    areasSection.appendChild(generalRow);

    const btnSpec = buildSpecificBtn(cat);
    areasSection.appendChild(btnSpec);

    card.appendChild(areasSection);
    grid.appendChild(card);
  });
}

// ────────────────────────────────────────────────
// BUILD — General area chip
// ────────────────────────────────────────────────

function buildGeneralAreaChip(catId, area) {
  const isOverridden = hasOverride(catId, area);
  const isOn = state.selectedAreas[catId].includes(area);

  const chip = document.createElement('label');
  chip.className = `area-chip-gen${isOverridden ? ' overridden' : (isOn ? ' on' : '')}`;
  chip.id = `gen-chip-${catId}-${area}`;
  chip.innerHTML = `
    <input type="checkbox" ${isOn && !isOverridden ? 'checked' : ''} ${isOverridden ? 'disabled' : ''} />
    <span class="area-chip-gen__dot"></span>
    ${area}
  `;

  if (!isOverridden) {
    chip.addEventListener('change', () => {
      const areas = state.selectedAreas[catId];
      const idx = areas.indexOf(area);
      if (idx > -1) {
        areas.splice(idx, 1);
        chip.classList.remove('on');
      } else {
        areas.push(area);
        chip.classList.add('on');
      }
      chip.querySelector('input').checked = areas.includes(area);
    });
  }

  return chip;
}

function syncGeneralChips(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  const row = document.getElementById(`areas-general-${catId}`);
  if (!row) return;
  row.innerHTML = '';
  cat.areas.forEach(area => {
    row.appendChild(buildGeneralAreaChip(catId, area));
  });
}

// ────────────────────────────────────────────────
// BUILD — "Configurar áreas específicas" button
// ────────────────────────────────────────────────

function buildSpecificBtn(cat) {
  const btn = document.createElement('button');
  btn.className = 'btn-specific';
  btn.id = `btn-spec-${cat.id}`;
  const n = countOverrides(cat.id);
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    </svg>
    Configurar áreas específicas
    ${n > 0 ? `<span class="btn-specific__badge">${n}</span>` : ''}
  `;
  if (n > 0) btn.classList.add('has-overrides');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    openSpecPanel(cat, btn);
  });

  return btn;
}

function syncSpecBtn(catId) {
  const btn = document.getElementById(`btn-spec-${catId}`);
  if (!btn) return;
  const n = countOverrides(catId);
  const badge = btn.querySelector('.btn-specific__badge');
  if (n > 0) {
    btn.classList.add('has-overrides');
    if (badge) { badge.textContent = n; }
    else {
      const sp = document.createElement('span');
      sp.className = 'btn-specific__badge';
      sp.textContent = n;
      btn.appendChild(sp);
    }
  } else {
    btn.classList.remove('has-overrides');
    if (badge) badge.remove();
  }
}

// ────────────────────────────────────────────────
// SPEC PANEL — floating popup
// ────────────────────────────────────────────────

let activePanelCatId = null;

const specOverlay = document.createElement('div');
specOverlay.className = 'spec-overlay';
document.body.appendChild(specOverlay);

const specPanel = document.createElement('div');
specPanel.className = 'spec-panel';
document.body.appendChild(specPanel);

function openSpecPanel(cat, triggerBtn) {
  if (activePanelCatId === cat.id && specPanel.classList.contains('is-open')) {
    closeSpecPanel();
    return;
  }

  activePanelCatId = cat.id;

  const cardEl = document.getElementById(`sc-${cat.id}`);
  const style = getComputedStyle(cardEl);
  specPanel.style.setProperty('--c-panel-accent', style.getPropertyValue('--c-accent').trim());
  specPanel.style.setProperty('--c-panel-glow',   style.getPropertyValue('--c-glow').trim());
  specPanel.style.setProperty('--c-bg-on',        style.getPropertyValue('--c-bg-on').trim());

  renderSpecPanel(cat);
  positionPanel(triggerBtn);

  specOverlay.classList.add('is-open');
  specPanel.classList.add('is-open');

  specOverlay.onclick = closeSpecPanel;
}

function closeSpecPanel() {
  specPanel.classList.remove('is-open');
  specOverlay.classList.remove('is-open');
  activePanelCatId = null;
}

function positionPanel(triggerBtn) {
  const rect = triggerBtn.getBoundingClientRect();
  const panelW = 260;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = rect.left;
  let top  = rect.bottom + 8;

  if (left + panelW > vw - 12) left = vw - panelW - 12;
  if (left < 12) left = 12;
  if (top + 320 > vh - 12) top = rect.top - 8 - Math.min(300, vh * 0.5);
  if (top < 12) top = 12;

  specPanel.style.left = `${left}px`;
  specPanel.style.top  = `${top}px`;
}

function renderSpecPanel(cat) {
  specPanel.innerHTML = `
    <div class="spec-panel__head">
      <span class="spec-panel__title">
        <span class="spec-panel__title-dot"></span>
        ${cat.name.replace(' Sounds','')} — Específico
      </span>
      <button class="spec-panel__close" id="specPanelClose" aria-label="Fechar">✕</button>
    </div>
    <div class="spec-panel__body" id="specPanelBody"></div>
    <div class="spec-panel__footer">
      <button class="spec-panel__clear" id="specPanelClear">Limpar overrides</button>
    </div>
  `;

  document.getElementById('specPanelClose').addEventListener('click', closeSpecPanel);
  document.getElementById('specPanelClear').addEventListener('click', () => {
    const cat2 = CATEGORIES.find(c => c.id === cat.id);
    cat.areas.forEach(area => { specificOverrides[cat.id][area] = null; });
    // Restore selectedAreas to defaultAreas since all areas go back to general
    state.selectedAreas[cat.id] = [...cat2.areas];
    renderSpecPanel(cat);
    syncGeneralChips(cat.id);
    syncSpecBtn(cat.id);
  });

  const body = document.getElementById('specPanelBody');
  const nAreas = cat.areas.length; // 4

  // ── Grid header: variante label col + one col per area ──
  const table = document.createElement('div');
  table.className = 'spec-table';
  table.style.setProperty('--spec-cols', nAreas);

  // Header row
  const headerRow = document.createElement('div');
  headerRow.className = 'spec-table__header';

  const labelHeader = document.createElement('div');
  labelHeader.className = 'spec-th spec-th--label';
  labelHeader.textContent = 'Variante';
  headerRow.appendChild(labelHeader);

  // Empty header for play column
  const playHeader = document.createElement('div');
  playHeader.className = 'spec-th';
  headerRow.appendChild(playHeader);

  cat.areas.forEach(area => {
    const th = document.createElement('div');
    th.className = 'spec-th spec-th--area';
    const hasOv = specificOverrides[cat.id][area] !== null;
    th.innerHTML = `
      <span class="spec-th__name">${area}</span>
      ${hasOv ? `<span class="spec-th__dot spec-th__dot--override"></span>` : `<span class="spec-th__dot"></span>`}
    `;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // "Usar geral" row
  table.appendChild(buildSpecTableRow(cat, null));

  // Variant rows
  cat.variants.forEach(v => {
    table.appendChild(buildSpecTableRow(cat, v));
  });

  body.appendChild(table);
}

// Builds one full row: variant label + radio cell per area
function buildSpecTableRow(cat, variant) {
  const isDefault = variant === null;
  const row = document.createElement('div');
  row.className = `spec-table__row${isDefault ? ' spec-table__row--default' : ''}`;

  // Label cell (text only)
  const labelCell = document.createElement('div');
  labelCell.className = 'spec-td spec-td--label';
  const shortLabel = isDefault
    ? '↩ Geral'
    : variant.label.replace(/\s—.*$/, '');
  const subLabel = isDefault ? 'padrão' : variant.label.replace(/^[^—]+—\s*/, '');
  labelCell.innerHTML = `
    <div class="spec-td__text">
      <span class="spec-td__main">${shortLabel}</span>
      <span class="spec-td__sub">${subLabel}</span>
    </div>
  `;
  row.appendChild(labelCell);

  // Play button cell (always present, empty for default row)
  const playCell = document.createElement('div');
  playCell.className = 'spec-td spec-td--play';
  if (!isDefault) {
    const previewBtn = document.createElement('button');
    previewBtn.className = 'spec-preview';
    previewBtn.setAttribute('aria-label', `Ouvir ${shortLabel}`);
    previewBtn.setAttribute('title', 'Ouvir prévia');
    previewBtn.textContent = '▶';
    previewBtn.addEventListener('click', e => {
      e.stopPropagation();
      triggerPreview(variant, previewBtn);
    });
    playCell.appendChild(previewBtn);
  }
  row.appendChild(playCell);

  // One radio cell per area
  cat.areas.forEach(area => {
    const override = specificOverrides[cat.id][area];
    const isActive = isDefault
      ? override === null
      : override === variant.id;

    const cell = document.createElement('div');
    cell.className = `spec-td spec-td--radio${isActive ? ' is-active' : ''}`;
    cell.dataset.area = area;
    cell.dataset.variant = isDefault ? '__default__' : variant.id;
    cell.innerHTML = `
      <div class="spec-radio">
        <div class="spec-radio__dot"></div>
      </div>
    `;

    cell.addEventListener('click', () => {
      const newOverride = isDefault ? null : variant.id;
      specificOverrides[cat.id][area] = newOverride;

      const areas = state.selectedAreas[cat.id];
      const idx = areas.indexOf(area);

      if (newOverride !== null) {
        // Has specific override → remove from general
        if (idx > -1) areas.splice(idx, 1);
      } else {
        // Chose "↩ Geral" → add back to general if not already there
        if (idx === -1) areas.push(area);
      }

      renderSpecPanel(cat);
      syncGeneralChips(cat.id);
      syncSpecBtn(cat.id);
    });

    row.appendChild(cell);
  });

  return row;
}


// ────────────────────────────────────────────────
// CLOSE MODAL — click outside + ESC
// ────────────────────────────────────────────────

const pageCenter = document.querySelector('.page-center');
pageCenter.addEventListener('click', e => {
  if (e.target === pageCenter) stopMusic();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (specPanel.classList.contains('is-open')) closeSpecPanel();
    else stopMusic();
  }
});

function buildCatToggle(catId) {
  const label = document.createElement('label');
  label.className = 'toggle';
  label.setAttribute('aria-label', `Ativar sons de ${catId}`);
  const checked = state.enabledCats[catId];
  label.innerHTML = `
    <input type="checkbox" class="toggle__input" ${checked ? 'checked' : ''} />
    <span class="toggle__track"><span class="toggle__thumb"></span></span>
  `;
  label.querySelector('input').addEventListener('change', e => {
    state.enabledCats[catId] = e.target.checked;
    document.getElementById(`sc-${catId}`)
      .classList.toggle('is-disabled', !e.target.checked);
  });
  return label;
}

function buildVariantRow(cat, v) {
  const isActive = state.selectedVariant[cat.id] === v.id;
  const row = document.createElement('div');
  row.className = `variant-row${isActive ? ' is-active' : ''}`;
  row.dataset.cat = cat.id;
  row.dataset.var = v.id;

  row.innerHTML = `
    <div class="vr-radio"><div class="vr-radio__dot"></div></div>
    <span class="vr-label">${v.label}</span>
    <button class="vr-preview" aria-label="Preview ${v.label}" title="Ouvir prévia">▶</button>
  `;

  // Select on row click (except preview btn)
  row.addEventListener('click', e => {
    if (e.target.closest('.vr-preview')) return;
    setActiveVariant(cat.id, v.id);
  });

  // Preview
  row.querySelector('.vr-preview').addEventListener('click', e => {
    e.stopPropagation();
    triggerPreview(v, e.currentTarget);
  });

  return row;
}



// ────────────────────────────────────────────────
// RENDER — Music tracks
// ────────────────────────────────────────────────

function renderMusicTracks() {
  const container = document.getElementById('musicTracks');
  container.innerHTML = '';

  MUSIC_TRACKS.forEach(track => {
    const row = document.createElement('div');
    row.className = 'music-track';
    row.id = `mt-${track.id}`;
    row.innerHTML = `
      <div class="mt-radio"></div>
      <div class="mt-info">
        <div class="mt-name">${track.name}</div>
        <div class="mt-desc">${track.desc}</div>
      </div>
      <span class="mt-tag">A TOCAR</span>
      <button class="mt-btn" aria-label="Preview ${track.name}">▶</button>
    `;

    row.addEventListener('click', e => {
      if (e.target.closest('.mt-btn')) return;
      toggleMusicTrack(track);
    });
    row.querySelector('.mt-btn').addEventListener('click', e => {
      e.stopPropagation();
      toggleMusicTrack(track);
    });

    container.appendChild(row);
  });
}

// ────────────────────────────────────────────────
// ACTIONS
// ────────────────────────────────────────────────

function buildVariantChips(cat, variants, groupLabel = null) {
  const wrap = document.createElement('div');
  wrap.className = 'variant-chips';
  wrap.dataset.cat = cat.id;
  if (groupLabel) wrap.dataset.group = groupLabel;

  variants.forEach((v, i) => {
    const chip = document.createElement('button');
    chip.className = 'variant-chip';
    chip.dataset.var = v.id;
    chip.setAttribute('title', v.label);
    chip.setAttribute('aria-label', v.label);
    chip.textContent = i + 1;
    if (state.selectedVariant[cat.id] === v.id) chip.classList.add('is-active');

    chip.addEventListener('click', () => {
      setActiveVariant(cat.id, v.id);
    });

    wrap.appendChild(chip);
  });

  return wrap;
}

function setActiveVariant(catId, varId) {
  state.selectedVariant[catId] = varId;
  const card = document.getElementById(`sc-${catId}`);
  // sync rows
  card.querySelectorAll('.variant-row').forEach(row => {
    row.classList.toggle('is-active', row.dataset.var === varId);
  });
  // sync chips
  card.querySelectorAll('.variant-chip').forEach(chip => {
    chip.classList.toggle('is-active', chip.dataset.var === varId);
  });
}

function triggerPreview(variant, btn) {
  if (!state.masterEnabled) return;
  variant.fn();
  btn.classList.add('is-playing');
  setTimeout(() => btn.classList.remove('is-playing'), 500);
}

function toggleMusicTrack(track) {
  if (state.playingMusic === track.id) {
    stopMusic();
    return;
  }
  if (!state.masterEnabled || !state.musicEnabled) return;
  state.playingMusic = track.id;
  track.fn();
  syncMusicUI();
}

function stopMusic() {
  state.playingMusic = null;
  audio.music.stop?.();
  syncMusicUI();
}

function syncMusicUI() {
  document.querySelectorAll('.music-track').forEach(el => {
    const playing = el.id === `mt-${state.playingMusic}`;
    el.classList.toggle('is-on', playing);
    const btn = el.querySelector('.mt-btn');
    if (btn) btn.textContent = playing ? '■' : '▶';
  });
}

function resetAll() {
  // Audio engine defaults
  audio.setMasterVolume(1.0);
  audio.setMusicVolume(0.4);
  audio.unmute();
  audio.setEnabled(true);

  // State
  state.masterEnabled = true;
  state.musicEnabled  = true;
  state.masterSlider  = DEFAULT_MASTER;
  state.musicSlider   = DEFAULT_MUSIC;
  state.sfxSlider     = DEFAULT_SFX;
  CATEGORIES.forEach(cat => {
    state.selectedVariant[cat.id] = cat.defaultVariant;
    state.enabledCats[cat.id]     = true;
    state.selectedAreas[cat.id]   = [...cat.areas];
    cat.areas.forEach(area => { specificOverrides[cat.id][area] = null; });
  });
  closeSpecPanel();
  stopMusic();

  // UI — toggles
  document.getElementById('masterToggle').checked = true;
  document.getElementById('musicToggle').checked  = true;

  // UI — sliders
  syncSlider('masterSlider', 'masterFill', 'masterValDisplay', 'sliderGroupMaster', DEFAULT_MASTER, 'master');
  syncSlider('musicSlider',  'musicFill',  'musicValDisplay',  'sliderGroupMusic',  DEFAULT_MUSIC,  'music');
  syncSlider('sfxSlider',    'sfxFill',    'sfxValDisplay',    'sliderGroupSfx',    DEFAULT_SFX,    'sfx');

  // UI — re-render cards
  renderCards();
}

// ────────────────────────────────────────────────
// SLIDERS — range 0–200 → real 0.00–2.00
// Snap suave ao 1.0 (100) com zona de ±4
// ────────────────────────────────────────────────

const SNAP_POINT = 100;
const SNAP_ZONE  = 4; // pixels de atração

/**
 * @param {string} sliderId
 * @param {string} fillId
 * @param {string} displayId
 * @param {string} groupId      — the .slider-group element id
 * @param {number} initVal      — integer 0–200
 * @param {'master'|'music'|'sfx'} type
 */
function initSlider(sliderId, fillId, displayId, groupId, initVal, type = 'master') {
  const input = document.getElementById(sliderId);

  // Set initial state
  syncSlider(sliderId, fillId, displayId, groupId, initVal, type);

  input.addEventListener('input', () => {
    let val = parseInt(input.value, 10);

    // Snap suave ao 1.0
    if (Math.abs(val - SNAP_POINT) <= SNAP_ZONE) {
      val = SNAP_POINT;
      input.value = val;
    }

    syncSlider(sliderId, fillId, displayId, groupId, val, type);

    const realVal = val / 100;
    if (type === 'music') {
      state.musicSlider = val;
      audio.setMusicVolume(realVal);
    } else if (type === 'sfx') {
      state.sfxSlider = val;
      audio.setSfxVolume?.(realVal);
    } else {
      state.masterSlider = val;
      audio.setMasterVolume(realVal);
    }
  });
}

function syncSlider(sliderId, fillId, displayId, groupId, val, type = 'master') {
  const input   = document.getElementById(sliderId);
  const fill    = document.getElementById(fillId);
  const display = document.getElementById(displayId);
  const group   = document.getElementById(groupId);
  if (!input) return;

  input.value = val;

  // Fill width — proportional to 0–200
  const pct = (val / SLIDER_MAX) * 100;
  fill.style.width = `${pct}%`;

  // Display value
  display.textContent = (val / 100).toFixed(2);

  // Snap indicator
  group.classList.toggle('is-snapped', val === SNAP_POINT);

  // Above-default class (val > 100)
  const above = val > 100;
  group.classList.toggle('is-above', above);
  group.classList.remove('music-slider', 'sfx-slider');
  if (above && type === 'music') group.classList.add('music-slider');
  if (above && type === 'sfx')   group.classList.add('sfx-slider');
}

// ────────────────────────────────────────────────
// MUSIC TOGGLE
// ────────────────────────────────────────────────

document.getElementById('musicToggle').addEventListener('change', e => {
  state.musicEnabled = e.target.checked;
  if (!state.musicEnabled) stopMusic();
});

// ────────────────────────────────────────────────
// CLOSE & RESET
// ────────────────────────────────────────────────

document.getElementById('closeBtn')?.addEventListener('click',  () => stopMusic());
document.getElementById('closeBtn2')?.addEventListener('click', () => stopMusic());
document.getElementById('resetBtn')?.addEventListener('click',  resetAll);

// ────────────────────────────────────────────────
// INIT
// ────────────────────────────────────────────────

renderCards();
renderMusicTracks();

initSlider('masterSlider', 'masterFill', 'masterValDisplay', 'sliderGroupMaster', DEFAULT_MASTER, 'master');
initSlider('musicSlider',  'musicFill',  'musicValDisplay',  'sliderGroupMusic',  DEFAULT_MUSIC,  'music');
initSlider('sfxSlider',    'sfxFill',    'sfxValDisplay',    'sliderGroupSfx',    DEFAULT_SFX,    'sfx');

audio.setMasterVolume(DEFAULT_MASTER / 100);
audio.setMusicVolume(DEFAULT_MUSIC / 100);
audio.setSfxVolume?.(DEFAULT_SFX / 100);