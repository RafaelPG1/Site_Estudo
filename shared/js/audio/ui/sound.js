// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/ui/sound.js
   Sistema de áudio unificado — v3.0 (redesign)
   (integra vol-slider.js v3 — slider pixel-perfect corrigido)

   O QUE MUDOU NESTA VERSÃO
   ─────────────────────────────────────────────
   Redesign visual completo do modal (ver sound.css v3 e
   vol-slider.css v3). A estrutura passou de "grid de cards
   coloridos" para um layout de duas colunas: um rail de
   navegação à esquerda (Volume + cada categoria) e um painel
   de detalhe à direita. O painel de overrides específicos, que
   antes era um popover posicionado via getBoundingClientRect,
   agora é uma seção inline expansível dentro do próprio painel
   de categoria — mais robusto a resize/DPI e mais simples.

   A API PÚBLICA (Sound.init/openModal/closeModal/waitUntilReady/
   resetAudio/reinit/resetCtx), os dados de _CATEGORIES, o
   contrato com audio-state.js (setVolume/getVolumes/setSfxMap/
   getSfxMap/setSfxAreaMap/getSfxAreaMap) e com audio-btns.js
   (mountAudioBtn/destroyAudioBtn) NÃO mudaram — só a camada de
   apresentação foi reescrita.

   ARQUITETURA
   ─────────────────────────────────────────────
   sound.js ←→ sfx.js        (engine de áudio)
   sound.js ←→ audio-state.js (estado global de modo)
   sound.js ←→ vol-slider.js  (módulo de volume v3)
   sound.js    auto-inicia:   botão flutuante + modal interno

   ❌ NÃO acessa Firebase diretamente
   ❌ NÃO conhece schema de autenticação
   ❌ NÃO gerencia engine de áudio
   ❌ NÃO lê localStorage

   USO
   ─────────────────────────────────────────────
   import Sound from './shared/js/audio/sound.js';
   Sound.init();
   Sound.openModal();
   Sound.closeModal();
   ============================================= */

import audio          from '../engine/sfx.js';
import audioState     from '../state/audio-state.js';
import makeVolumeSlider from './vol-slider.js';
import { mountAudioBtn, destroyAudioBtn } from './audio-btns.js';

/* ═══════════════════════════════════════════════
   SEÇÃO A — BOTÃO FLUTUANTE DE VOLUME
   Implementação centralizada em ui/audio-btns.js.
   sound.js delega montagem e destruição via API exportada.
═══════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════
   SEÇÃO B — MODAL DE CONFIGURAÇÃO DE SOM
═══════════════════════════════════════════════ */

/* ── Dados (inalterados em relação à v2) ── */

const _DEFAULT_SFX = 50;   // int 0-150 (= 0.50 real)

const _CATEGORIES = [
  {
    id: 'click',
    name: 'Click Sounds',
    desc: 'Sons ao clicar em botões e elementos.',
    icon: '◉',
    areas: ['Inicial', 'Game', 'Quiz', 'Perfil', 'Resumos'],
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
    areas: ['Inicial', 'Game', 'Quiz', 'Perfil', 'Resumos'],
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
    areas: ['Inicial', 'Game', 'Quiz', 'Perfil', 'Resumos'],
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
    areas: ['Inicial', 'Game', 'Quiz', 'Perfil', 'Resumos'],
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
  {
    id: 'correct',
    name: 'Correct Sounds',
    desc: 'Sons ao acertar uma questão.',
    icon: '✓',
    areas: ['Quiz', 'Game'],
    defaultVariant: 'correct4',
    variants: [
      { id: 'correct',  label: 'Correct 1 — Ping duplo',        fn: () => audio.sfx.correct?.()  },
      { id: 'correct2', label: 'Correct 2 — Chime 3 notas',     fn: () => audio.sfx.correct2?.() },
      { id: 'correct3', label: 'Correct 3 — Retro 8-bit',       fn: () => audio.sfx.correct3?.() },
      { id: 'correct4', label: 'Correct 4 — Arpejo rápido',     fn: () => audio.sfx.correct4?.() },
      { id: 'correct5', label: 'Correct 5 — Tick shimmer',      fn: () => audio.sfx.correct5?.() },
    ],
  },
  {
    id: 'wrong',
    name: 'Wrong Sounds',
    desc: 'Sons ao errar uma questão.',
    icon: '✕',
    areas: ['Quiz', 'Game'],
    defaultVariant: 'wrong',
    variants: [
      { id: 'wrong',  label: 'Wrong 1 — Buzz descendente',      fn: () => audio.sfx.wrong?.() },
      { id: 'wrong2', label: 'Wrong 2 — Dois pulsos graves',    fn: () => audio.sfx.wrong2?.() },
      { id: 'wrong3', label: 'Wrong 3 — Queda sawtooth',        fn: () => audio.sfx.wrong3?.() },
      { id: 'wrong4', label: 'Wrong 4 — Glitch digital',        fn: () => audio.sfx.wrong4?.() },
      { id: 'wrong5', label: 'Wrong 5 — Choque elétrico',       fn: () => audio.sfx.wrong5?.() },
      { id: 'wrong6', label: 'Wrong 6 — Cascata descendente',   fn: () => audio.sfx.wrong6?.() },
    ],
  },
  {
    id: 'timeout',
    name: 'Timeout Sounds',
    desc: 'Sons ao esgotar o tempo.',
    icon: '⏱',
    areas: ['Quiz', 'Game'],
    defaultVariant: 'timeout',
    variants: [
      { id: 'timeout',  label: 'Timeout 1 — Alarme duplo',      fn: () => audio.sfx.timeout?.() },
      { id: 'timeout2', label: 'Timeout 2 — Três bipes',        fn: () => audio.sfx.timeout2?.() },
      { id: 'timeout3', label: 'Timeout 3 — Triangle suave',    fn: () => audio.sfx.timeout3?.() },
      { id: 'timeout4', label: 'Timeout 4 — Campainha de fim',  fn: () => audio.sfx.timeout4?.() },
    ],
  },
  {
    id: 'timerWarning',
    name: 'Timer Warning Sounds',
    desc: 'Sons de aviso quando o tempo está acabando.',
    icon: '⚠',
    areas: ['Quiz', 'Game'],
    defaultVariant: 'timerWarning',
    variants: [
      { id: 'timerWarning',  label: 'Warning 1 — Três beeps crescentes',  fn: () => audio.sfx.timerWarning?.()  },
      { id: 'timerWarning2', label: 'Warning 2 — Coração acelerado',      fn: () => audio.sfx.timerWarning2?.() },
      { id: 'timerWarning3', label: 'Warning 3 — Duplo alerta nervoso',   fn: () => audio.sfx.timerWarning3?.() },
      { id: 'timerWarning4', label: 'Warning 4 — Conta regressiva',       fn: () => audio.sfx.timerWarning4?.() },
    ],
  },
  {
    id: 'pause',
    name: 'Pause Sounds',
    desc: 'Sons ao pausar o jogo ou questão.',
    icon: '⏸',
    areas: ['Quiz', 'Game'],
    defaultVariant: 'pause',
    variants: [
      { id: 'pause',  label: 'Pause 1 — Dois tons descendentes', fn: () => audio.sfx.pause?.()  },
      { id: 'pause2', label: 'Pause 2 — Fade out lento',         fn: () => audio.sfx.pause2?.() },
      { id: 'pause3', label: 'Pause 3 — Thud + shimmer',         fn: () => audio.sfx.pause3?.() },
      { id: 'pause4', label: 'Pause 4 — Tock + drone',           fn: () => audio.sfx.pause4?.() },
    ],
  },
];


/* ── Estado do modal (inalterado) ── */

const _modalState = {
  sfxSlider:       _DEFAULT_SFX,
  selectedVariant: {},
  enabledCats:     {},
  selectedAreas:   {},
};

const _specificOverrides = {};

function _resetModalState() {
  _modalState.sfxSlider = _DEFAULT_SFX;

  _CATEGORIES.forEach(cat => {
    if (cat.id === 'modal') {
      _modalState.selectedVariant['modal-open']  = 'openModal2';
      _modalState.selectedVariant['modal-close'] = 'closeModal';
    } else {
      _modalState.selectedVariant[cat.id] = cat.defaultVariant;
    }
    _modalState.enabledCats[cat.id]   = true;
    _modalState.selectedAreas[cat.id] = [...cat.areas];
    _specificOverrides[cat.id] = {};
    cat.areas.forEach(area => { _specificOverrides[cat.id][area] = null; });
  });
}

_resetModalState();


/* ── Estado de navegação/UI (novo — só de apresentação) ── */

let _activeSection    = 'volume';           // 'volume' | catId
const _expandedSpecs   = new Set();          // catIds com o painel de overrides aberto


/* ── Variáveis de módulo (DOM) ── */

let _overlay   = null;
let _wrap      = null;
let _modalEl   = null;
let _railEl    = null;
let _contentEl = null;
let _modalOpen = false;

let _sfxSlider = null;


/* ── Ícone de fechar / setas reaproveitáveis (SVG inline) ── */

const _ICON_CLOSE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const _ICON_HEADER = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
const _ICON_CHEVRON = `<svg class="asx-spec-toggle__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
const _ICON_SLIDERS = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`;


/* ── Criação do DOM do modal ── */

function _buildModalDOM() {
  _overlay = document.createElement('div');
  _overlay.className = 'asx-overlay';

  _wrap = document.createElement('div');
  _wrap.className = 'asx-wrap';

  _modalEl = document.createElement('div');
  _modalEl.className = 'asx-modal';
  _modalEl.setAttribute('role', 'dialog');
  _modalEl.setAttribute('aria-label', 'Configurações de Som');
  _modalEl.setAttribute('aria-modal', 'true');

  _modalEl.innerHTML = `
    <header class="asx-header">
      <div class="asx-header__left">
        <div class="asx-header__icon" aria-hidden="true">${_ICON_HEADER}</div>
        <div>
          <h1 class="asx-header__title">Configurações de Som</h1>
          <p class="asx-header__subtitle">Ajuste volume, sons e onde cada efeito toca</p>
        </div>
      </div>
      <button class="asx-header__close" id="asx-close-btn" aria-label="Fechar">${_ICON_CLOSE}</button>
    </header>

    <div class="asx-body">
      <nav class="asx-rail" id="asx-rail" aria-label="Seções de configuração de som"></nav>
      <div class="asx-content">
        <section class="asx-panel" id="asx-panel-volume" data-panel="volume"></section>
        <section class="asx-panel" id="asx-panel-category" data-panel="category"></section>
      </div>
    </div>

    <footer class="asx-footer">
      <div class="asx-footer__note">NEXUS AUDIO</div>
      <div class="asx-footer__actions">
        <button class="asx-btn asx-btn--ghost" id="asx-reset-btn">Resetar</button>
        <button class="asx-btn asx-btn--primary" id="asx-close-btn-2">Fechar</button>
        <button class="asx-btn asx-btn--accent" id="asx-save-btn">Salvar</button>
      </div>
    </footer>
  `;

  _wrap.appendChild(_modalEl);
  document.body.appendChild(_overlay);
  document.body.appendChild(_wrap);

  _railEl    = _modalEl.querySelector('#asx-rail');
  _contentEl = _modalEl.querySelector('.asx-content');

  _renderVolumePanelSkeleton();
  _bindModalEvents();
}


/* ── Sync overrides from audio-state (inalterado) ── */

function _syncOverridesFromState() {
  const areaMap = audioState.getSfxAreaMap?.() ?? {};

  _CATEGORIES.forEach(cat => {
    cat.areas.forEach(area => { _specificOverrides[cat.id][area] = null; });
  });

  const areaLabelByKey = {};
  _CATEGORIES.forEach(cat => {
    cat.areas.forEach(area => { areaLabelByKey[area.toLowerCase()] = area; });
  });

  Object.entries(areaMap).forEach(([areaKey, actionMap]) => {
    const areaLabel = areaLabelByKey[areaKey];
    if (!areaLabel) return;

    Object.entries(actionMap).forEach(([action, variantId]) => {
      const catId = (action === 'openModal' || action === 'closeModal') ? 'modal' : action;
      if (_specificOverrides[catId] !== undefined) {
        _specificOverrides[catId][areaLabel] = variantId || null;
      }
    });
  });

  _CATEGORIES.forEach(cat => {
    _modalState.selectedAreas[cat.id] = cat.areas.filter(
      area => _specificOverrides[cat.id][area] === null
    );
  });
}


/* ── Abertura e fechamento ── */

function _openModal() {
  if (_modalOpen) return;
  _modalOpen = true;

  // 1. Sincroniza variantes com o sfxMap atual
  const currentSfxMap = audioState.getSfxMap();
  if (currentSfxMap.click)      _modalState.selectedVariant['click']       = currentSfxMap.click;
  if (currentSfxMap.hover)      _modalState.selectedVariant['hover']       = currentSfxMap.hover;
  if (currentSfxMap.select)     _modalState.selectedVariant['select']      = currentSfxMap.select;
  if (currentSfxMap.openModal)  _modalState.selectedVariant['modal-open']  = currentSfxMap.openModal;
  if (currentSfxMap.closeModal) _modalState.selectedVariant['modal-close'] = currentSfxMap.closeModal;

  // 2. Sincroniza overrides por área
  _syncOverridesFromState();

  // 3. Renderiza rail + seção ativa
  _activeSection = 'volume';
  _renderRail();
  _renderActivePanel();

  // 4. Abre o modal
  _overlay.classList.add('is-open');
  _wrap.classList.add('is-open');

  // 5. Instancia ou reutiliza o slider de volume
  const volumes = audioState.getVolumes();

  if (_sfxSlider) {
    _sfxSlider.setValue(volumes.sfx);
  } else {
    _sfxSlider = makeVolumeSlider({
      wrapId:  'asx-vol-wrap',
      inputId: 'asx-vol-input',
      thumbId: 'asx-vol-thumb',
      fillId:  'asx-vol-fill',
      valId:   'asx-vol-value',
      badgeId: 'asx-vol-badge',
      markIds: ['asx-vol-mark-50', 'asx-vol-mark-100', 'asx-vol-mark-150'],
      onInput: (v) => {
        _modalState.sfxSlider = Math.round(v * 100);
        audioState.setVolume('sfx', v);
      },
    });
    _sfxSlider.setValue(volumes.sfx);
  }

  _wrap.addEventListener('click', _onWrapClick);
  document.addEventListener('keydown', _onKeyDown);
}

function _closeModal() {
  if (!_modalOpen) return;
  _modalOpen = false;

  _overlay.classList.remove('is-open');
  _wrap.classList.remove('is-open');

  _wrap.removeEventListener('click', _onWrapClick);
  document.removeEventListener('keydown', _onKeyDown);
}

function _onWrapClick(e) {
  if (e.target === _wrap) _closeModal();
}

function _onKeyDown(e) {
  if (e.key === 'Escape') _closeModal();
}


/* ── Bindings de eventos do modal (estáticos, ligados uma vez) ── */

function _bindModalEvents() {
  _modalEl.querySelector('#asx-close-btn').addEventListener('click',   _closeModal);
  _modalEl.querySelector('#asx-close-btn-2').addEventListener('click', _closeModal);
  _modalEl.querySelector('#asx-reset-btn').addEventListener('click',   _resetAll);
  _modalEl.querySelector('#asx-save-btn').addEventListener('click',    _saveAll);
}


/* ═══════════════════════════════════════════════
   RAIL DE NAVEGAÇÃO
═══════════════════════════════════════════════ */

function _renderRail() {
  _railEl.innerHTML = '';

  const groupLabel = document.createElement('div');
  groupLabel.className = 'asx-rail__group-label';
  groupLabel.textContent = 'Sistema';
  _railEl.appendChild(groupLabel);

  _railEl.appendChild(_buildRailItem({
    id: 'volume',
    icon: _ICON_SLIDERS,
    name: 'Volume',
  }));

  const catsLabel = document.createElement('div');
  catsLabel.className = 'asx-rail__group-label';
  catsLabel.textContent = 'Categorias de som';
  _railEl.appendChild(catsLabel);

  _CATEGORIES.forEach(cat => {
    _railEl.appendChild(_buildRailItem({
      id: cat.id,
      icon: cat.icon,
      name: cat.name,
      count: _countOverrides(cat.id),
      disabled: !_modalState.enabledCats[cat.id],
    }));
  });
}

function _buildRailItem({ id, icon, name, count = 0, disabled = false }) {
  const btn = document.createElement('button');
  btn.className = 'asx-rail__item' + (id === _activeSection ? ' is-active' : '') + (disabled ? ' is-disabled' : '');
  btn.id = `asx-rail-item-${id}`;
  btn.type = 'button';

  const isEmoji = /^[◉◈⊛⊡✓✕⏱⚠⏸]$/.test(icon);
  btn.innerHTML = `
    <span class="asx-rail__icon" aria-hidden="true">${isEmoji ? icon : icon}</span>
    <span class="asx-rail__name">${name}</span>
    ${count > 0 ? `<span class="asx-rail__count">${count}</span>` : ''}
    ${disabled ? `<span class="asx-rail__off-dot" title="Categoria desativada"></span>` : ''}
  `;

  btn.addEventListener('click', () => {
    _activeSection = id;
    _railEl.querySelectorAll('.asx-rail__item').forEach(el => el.classList.remove('is-active'));
    btn.classList.add('is-active');
    _renderActivePanel();
  });

  return btn;
}

function _refreshRailBadges() {
  _CATEGORIES.forEach(cat => {
    const item = document.getElementById(`asx-rail-item-${cat.id}`);
    if (!item) return;
    let count = item.querySelector('.asx-rail__count');
    const n = _countOverrides(cat.id);
    if (n > 0) {
      if (!count) {
        count = document.createElement('span');
        count.className = 'asx-rail__count';
        item.insertBefore(count, item.querySelector('.asx-rail__off-dot') || null);
      }
      count.textContent = n;
    } else if (count) {
      count.remove();
    }
    item.classList.toggle('is-disabled', !_modalState.enabledCats[cat.id]);
  });
}


/* ═══════════════════════════════════════════════
   PAINEL ATIVO — roteamento
═══════════════════════════════════════════════ */

function _renderActivePanel() {
  const volPanel = document.getElementById('asx-panel-volume');
  const catPanel = document.getElementById('asx-panel-category');

  if (_activeSection === 'volume') {
    volPanel.classList.add('is-active');
    catPanel.classList.remove('is-active');
    if (_sfxSlider) _sfxSlider.layout();
  } else {
    volPanel.classList.remove('is-active');
    catPanel.classList.add('is-active');
    const cat = _CATEGORIES.find(c => c.id === _activeSection);
    if (cat) _renderCategoryPanel(cat);
  }
}


/* ═══════════════════════════════════════════════
   PAINEL — VOLUME (montado uma única vez)
═══════════════════════════════════════════════ */

function _renderVolumePanelSkeleton() {
  const panel = document.getElementById('asx-panel-volume');
  panel.innerHTML = `
    <div class="asx-panel-head">
      <h2 class="asx-panel-head__title">Volume geral</h2>
      <p class="asx-panel-head__desc">Controla o volume de todos os efeitos sonoros (SFX) do app. Arraste, use as setas do teclado ou o scroll do mouse.</p>
    </div>
    <div class="asx-vol-card">
      <div class="asx-vol">
        <div class="asx-vol__head">
          <div>
            <div class="asx-vol__label">Efeitos (SFX)</div>
            <div class="asx-vol__sub">Padrão: 0.5×</div>
          </div>
          <div class="asx-vol__readout">
            <span class="asx-vol-badge" id="asx-vol-badge">0.5×</span>
            <span class="asx-vol-value" id="asx-vol-value">0.50×</span>
          </div>
        </div>
        <div class="asx-vol-wrap" id="asx-vol-wrap">
          <div class="asx-vol-track">
            <div class="asx-vol-fill" id="asx-vol-fill"></div>
          </div>
          <div class="asx-vol-mark" id="asx-vol-mark-50"  title="0.5×"></div>
          <div class="asx-vol-mark" id="asx-vol-mark-100" title="1.0×"></div>
          <div class="asx-vol-mark" id="asx-vol-mark-150" title="1.5×"></div>
          <input type="range" class="asx-vol-input" id="asx-vol-input"
            min="0" max="150" step="1" value="50" aria-label="Volume de Efeitos" />
          <div class="asx-vol-thumb" id="asx-vol-thumb"></div>
        </div>
        <div class="asx-vol-scale">
          <span>0×</span>
          <span class="is-default">0.5× padrão</span>
          <span>1.0×</span>
          <span>1.5×</span>
        </div>
      </div>
    </div>
  `;
}


/* ═══════════════════════════════════════════════
   PAINEL — CATEGORIA (re-renderizado a cada seleção)
═══════════════════════════════════════════════ */

function _renderCategoryPanel(cat) {
  const panel = document.getElementById('asx-panel-category');
  panel.innerHTML = '';

  /* Header: ícone + nome + descrição + toggle */
  const head = document.createElement('div');
  head.className = 'asx-cat-head';
  head.innerHTML = `
    <div class="asx-cat-head__left">
      <div class="asx-cat-head__icon" aria-hidden="true">${cat.icon}</div>
      <div>
        <div class="asx-cat-head__title">${cat.name}</div>
        <div class="asx-cat-head__desc">${cat.desc}</div>
      </div>
    </div>
  `;
  head.appendChild(_buildCatToggle(cat));
  panel.appendChild(head);

  /* Variantes */
  const varSection = document.createElement('div');
  varSection.className = 'asx-section';

  if (cat.id === 'modal') {
    const openVariants  = cat.variants.filter(v => v.id.startsWith('open')  || v.id.startsWith('Open'));
    const closeVariants = cat.variants.filter(v => v.id.startsWith('close') || v.id.startsWith('Close'));

    const openLabel = document.createElement('div');
    openLabel.className = 'asx-section__label';
    openLabel.textContent = 'Variante ativa — Abrir';
    varSection.appendChild(openLabel);
    varSection.appendChild(_buildVariantList(cat, openVariants));

    const closeLabel = document.createElement('div');
    closeLabel.className = 'asx-section__sub-label';
    closeLabel.textContent = 'FECHAR';
    varSection.appendChild(closeLabel);
    varSection.appendChild(_buildVariantList(cat, closeVariants));
  } else {
    const label = document.createElement('div');
    label.className = 'asx-section__label';
    label.textContent = 'Variante ativa';
    varSection.appendChild(label);
    varSection.appendChild(_buildVariantList(cat, cat.variants));
  }
  panel.appendChild(varSection);

  /* Áreas gerais */
  const areaSection = document.createElement('div');
  areaSection.className = 'asx-section';
  const areaLabel = document.createElement('div');
  areaLabel.className = 'asx-section__label';
  areaLabel.textContent = 'Área geral';
  areaSection.appendChild(areaLabel);

  const chips = document.createElement('div');
  chips.className = 'asx-chips';
  chips.id = `asx-chips-${cat.id}`;
  cat.areas.forEach(area => chips.appendChild(_buildAreaChip(cat, area)));
  areaSection.appendChild(chips);

  /* Overrides específicos (inline, expansível) */
  const specToggle = _buildSpecToggle(cat);
  areaSection.appendChild(specToggle);

  const specPanel = _buildSpecPanel(cat);
  areaSection.appendChild(specPanel);

  panel.appendChild(areaSection);
}

function _buildCatToggle(cat) {
  const label = document.createElement('label');
  label.className = 'asx-toggle';
  label.setAttribute('aria-label', `Ativar sons de ${cat.name}`);
  const checked = _modalState.enabledCats[cat.id];
  label.innerHTML = `
    <input type="checkbox" class="asx-toggle__input" ${checked ? 'checked' : ''} />
    <span class="asx-toggle__track"><span class="asx-toggle__thumb"></span></span>
  `;
  label.querySelector('input').addEventListener('change', e => {
    _modalState.enabledCats[cat.id] = e.target.checked;
    _refreshRailBadges();
  });
  return label;
}

function _buildVariantList(cat, variants) {
  const list = document.createElement('div');
  list.className = 'asx-variants';
  variants.forEach(v => list.appendChild(_buildVariantRow(cat, v)));
  return list;
}

function _buildVariantRow(cat, v) {
  const slot = cat.id === 'modal'
    ? ((v.id.startsWith('open') || v.id.startsWith('Open')) ? 'modal-open' : 'modal-close')
    : cat.id;
  const isActive = _modalState.selectedVariant[slot] === v.id;

  const row = document.createElement('div');
  row.className = 'asx-variant-row' + (isActive ? ' is-active' : '');
  row.tabIndex = 0;
  row.dataset.var = v.id;
  row.innerHTML = `
    <span class="asx-variant-radio"></span>
    <span class="asx-variant-label">${v.label}</span>
    <button class="asx-preview-btn" type="button" aria-label="Ouvir ${v.label}" title="Ouvir prévia">▶</button>
  `;

  const select = () => _setActiveVariant(cat, v.id);
  row.addEventListener('click', e => {
    if (e.target.closest('.asx-preview-btn')) return;
    select();
  });
  row.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); }
  });
  row.querySelector('.asx-preview-btn').addEventListener('click', e => {
    e.stopPropagation();
    _triggerPreview(v, e.currentTarget);
  });
  return row;
}

function _setActiveVariant(cat, varId) {
  const catId = cat.id;
  if (catId !== 'modal') {
    _modalState.selectedVariant[catId] = varId;
    audioState.setSfxMap(catId, varId);
  } else {
    if (varId.startsWith('open') || varId.startsWith('Open')) {
      _modalState.selectedVariant['modal-open'] = varId;
      audioState.setSfxMap('openModal', varId);
    } else {
      _modalState.selectedVariant['modal-close'] = varId;
      audioState.setSfxMap('closeModal', varId);
    }
  }
  // Re-renderiza o painel de categoria para refletir a nova seleção
  _renderCategoryPanel(cat);
}

function _triggerPreview(variant, btn) {
  variant.fn();
  btn.classList.add('is-playing');
  setTimeout(() => btn.classList.remove('is-playing'), 480);
}


/* ── Chips de área geral ── */

function _buildAreaChip(cat, area) {
  const isOverridden = _specificOverrides[cat.id][area] !== null;
  const isOn = _modalState.selectedAreas[cat.id].includes(area);

  const chip = document.createElement('label');
  chip.className = 'asx-chip' + (isOverridden ? ' is-overridden' : (isOn ? ' is-on' : ''));
  chip.innerHTML = `
    <input type="checkbox" ${isOn && !isOverridden ? 'checked' : ''} ${isOverridden ? 'disabled' : ''} />
    <span class="asx-chip__dot"></span>
    ${area}
  `;

  if (!isOverridden) {
    chip.addEventListener('change', () => {
      const areas = _modalState.selectedAreas[cat.id];
      const idx = areas.indexOf(area);
      if (idx > -1) { areas.splice(idx, 1); chip.classList.remove('is-on'); }
      else           { areas.push(area);     chip.classList.add('is-on'); }
      chip.querySelector('input').checked = areas.includes(area);
    });
  }
  return chip;
}


/* ── Overrides específicos por área (inline expansível) ── */

function _buildSpecToggle(cat) {
  const n = _countOverrides(cat.id);
  const expanded = _expandedSpecs.has(cat.id);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'asx-spec-toggle' + (n > 0 ? ' has-overrides' : '') + (expanded ? ' is-expanded' : '');
  btn.id = `asx-spec-toggle-${cat.id}`;
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
    Configurar áreas específicas
    ${n > 0 ? `<span class="asx-spec-toggle__badge">${n}</span>` : ''}
    ${_ICON_CHEVRON}
  `;

  btn.addEventListener('click', () => {
    if (_expandedSpecs.has(cat.id)) _expandedSpecs.delete(cat.id);
    else _expandedSpecs.add(cat.id);
    _renderCategoryPanel(cat);
  });

  return btn;
}

function _buildSpecPanel(cat) {
  const wrap = document.createElement('div');
  wrap.className = 'asx-spec-panel' + (_expandedSpecs.has(cat.id) ? ' is-expanded' : '');
  if (!_expandedSpecs.has(cat.id)) return wrap;

  const scroll = document.createElement('div');
  scroll.className = 'asx-spec-panel__scroll';

  const nAreas = cat.areas.length;
  const table = document.createElement('div');
  table.className = 'asx-spec-table';
  table.style.setProperty('--spec-cols', nAreas);

  const labelHeader = document.createElement('div');
  labelHeader.className = 'asx-spec-th asx-spec-th--label';
  labelHeader.textContent = 'Variante';
  table.appendChild(labelHeader);

  const playHeader = document.createElement('div');
  playHeader.className = 'asx-spec-th';
  table.appendChild(playHeader);

  cat.areas.forEach(area => {
    const th = document.createElement('div');
    th.className = 'asx-spec-th asx-spec-th--area';
    const hasOv = _specificOverrides[cat.id][area] !== null;
    th.innerHTML = `<span>${area}</span><span class="asx-spec-th__dot${hasOv ? ' has-override' : ''}"></span>`;
    table.appendChild(th);
  });

  _appendSpecRow(table, cat, null);
  cat.variants.forEach(v => _appendSpecRow(table, cat, v));

  scroll.appendChild(table);
  wrap.appendChild(scroll);

  const footer = document.createElement('div');
  footer.className = 'asx-spec-panel__footer';
  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'asx-spec-clear';
  clearBtn.textContent = 'Limpar overrides';
  clearBtn.addEventListener('click', () => {
    cat.areas.forEach(area => {
      _specificOverrides[cat.id][area] = null;
      _applyModalAreaOverride(cat.id, area, null);
    });
    _modalState.selectedAreas[cat.id] = [...cat.areas];
    _refreshRailBadges();
    _renderCategoryPanel(cat);
  });
  footer.appendChild(clearBtn);
  wrap.appendChild(footer);

  return wrap;
}

function _appendSpecRow(table, cat, variant) {
  const isDefault = variant === null;

  const labelCell = document.createElement('div');
  labelCell.className = 'asx-spec-td asx-spec-td--label' + (isDefault ? ' asx-spec-row-default' : '');
  const shortLabel = isDefault ? '↩ Geral' : variant.label.replace(/\s—.*$/, '');
  const subLabel   = isDefault ? 'padrão'  : variant.label.replace(/^[^—]+—\s*/, '');
  labelCell.innerHTML = `<span class="asx-spec-td__main">${shortLabel}</span><span class="asx-spec-td__sub">${subLabel}</span>`;
  table.appendChild(labelCell);

  const playCell = document.createElement('div');
  playCell.className = 'asx-spec-td asx-spec-td--play';
  if (!isDefault) {
    const previewBtn = document.createElement('button');
    previewBtn.type = 'button';
    previewBtn.className = 'asx-spec-mini-preview';
    previewBtn.setAttribute('aria-label', `Ouvir ${shortLabel}`);
    previewBtn.textContent = '▶';
    previewBtn.addEventListener('click', e => { e.stopPropagation(); _triggerPreview(variant, previewBtn); });
    playCell.appendChild(previewBtn);
  }
  table.appendChild(playCell);

  cat.areas.forEach(area => {
    const override = _specificOverrides[cat.id][area];
    const isActive = isDefault ? override === null : override === variant.id;

    const cell = document.createElement('div');
    cell.className = 'asx-spec-td asx-spec-td--radio' + (isActive ? ' is-active' : '');
    cell.innerHTML = `<span class="asx-spec-radio"><span class="asx-spec-radio__dot"></span></span>`;

    cell.addEventListener('click', () => {
      const newOverride = isDefault ? null : variant.id;
      _specificOverrides[cat.id][area] = newOverride;

      const areas = _modalState.selectedAreas[cat.id];
      const idx   = areas.indexOf(area);
      if (newOverride !== null) { if (idx > -1) areas.splice(idx, 1); }
      else                       { if (idx === -1) areas.push(area); }

      _applyModalAreaOverride(cat.id, area, newOverride);
      _refreshRailBadges();
      _renderCategoryPanel(cat);
    });

    table.appendChild(cell);
  });
}

function _countOverrides(catId) {
  return Object.values(_specificOverrides[catId]).filter(v => v !== null).length;
}

/**
 * Aplica um override de área no audioState, tratando a categoria 'modal'
 * de forma especial (split em openModal / closeModal). Centraliza a
 * lógica compartilhada por _appendSpecRow, "Limpar overrides", _saveAll
 * e _resetAll.
 */
function _applyModalAreaOverride(catId, area, variantId) {
  const areaKey = area.toLowerCase();
  if (catId !== 'modal') {
    audioState.setSfxAreaMap(areaKey, catId, variantId);
  } else {
    if (variantId === null) {
      audioState.setSfxAreaMap(areaKey, 'openModal',  null);
      audioState.setSfxAreaMap(areaKey, 'closeModal', null);
    } else if (variantId.startsWith('open') || variantId.startsWith('Open')) {
      audioState.setSfxAreaMap(areaKey, 'openModal', variantId);
    } else {
      audioState.setSfxAreaMap(areaKey, 'closeModal', variantId);
    }
  }
}


/* ── Save ── */

function _saveAll() {
  audioState.setVolume('sfx', _modalState.sfxSlider / 100);

  _CATEGORIES.forEach(cat => {
    cat.areas.forEach(area => {
      const override = _specificOverrides[cat.id]?.[area] ?? null;
      _applyModalAreaOverride(cat.id, area, override);
    });
  });

  const btn = document.getElementById('asx-save-btn');
  if (btn) {
    const prev = btn.textContent;
    btn.textContent = 'Salvo ✓';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = prev; btn.disabled = false; }, 1400);
  }
}


/* ── Reset total ── */

const _DEFAULT_SFX_MAP = {
  click:        'click',
  hover:        'hover2',
  select:       'select',
  openModal:    'openModal2',
  closeModal:   'closeModal',
  correct:      'correct',
  wrong:        'wrong6',
  timeout:      'timeout4',
  pause:        'pause',
  timerWarning: 'timerWarning',
};

function _resetAll() {
  // 1. Engine de áudio
  audio.setMasterVolume(1.0);
  audio.unmute();
  audio.setEnabled(true);

  // 2. Volumes no audioState (antes de setValue no slider)
  audioState.setVolume('master', 1.0);
  audioState.setVolume('sfx',   0.5);

  // 3. sfxMap padrão → Firebase
  Object.entries(_DEFAULT_SFX_MAP).forEach(([event, variantId]) => {
    audioState.setSfxMap(event, variantId);
  });

  // 4. Limpa overrides de área → Firebase
  _CATEGORIES.forEach(cat => {
    cat.areas.forEach(area => _applyModalAreaOverride(cat.id, area, null));
  });

  // 5. Estado local do modal
  _resetModalState();
  _expandedSpecs.clear();

  // 6. Atualiza slider via API do vol-slider (sem recriar)
  if (_sfxSlider) _sfxSlider.setValue(_DEFAULT_SFX / 100);

  // 7. Redesenha rail + painel ativo
  if (_railEl) {
    _renderRail();
    _renderActivePanel();
  }
}


/* ═══════════════════════════════════════════════
   SEÇÃO C — INICIALIZAÇÃO E API PÚBLICA
═══════════════════════════════════════════════ */

let _initialized = false;
let _modalBuilt   = false;

const Sound = {

  init() {
    if (_initialized) return;
    _initialized = true;
    mountAudioBtn();
  },

  openModal() {
    if (!_initialized) this.init();
    if (!_modalBuilt) {
      _buildModalDOM();
      _modalBuilt = true;
    }
    _openModal();
  },

  closeModal() {
    _closeModal();
  },

  waitUntilReady() {
    return audioState.waitUntilReady();
  },

  resetAudio() {
    _resetAll();
  },

  reinit() {
    destroyAudioBtn();
    _initialized = false;
    this.init();
    audio.resumeCtx();
  },

  resetCtx() {
    audio.resumeCtx();
  },
};

export default Sound;