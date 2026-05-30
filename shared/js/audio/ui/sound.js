// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/ui/sound.js
   Sistema de áudio unificado — v2.0
   (integra vol-slider.js — slider pixel-perfect)

   ORIGINADO DE:
     som.js       → modal de configuração de som (DOM + lógica)
     som.html     → estrutura HTML do modal (agora gerada dinamicamente)
     audio-btn.js → botão flutuante de volume global

   ARQUITETURA
   ─────────────────────────────────────────────
   sound.js ←→ sfx.js        (engine de áudio)
   sound.js ←→ audio-state.js (estado global de modo)
   sound.js ←→ vol-slider.js  (módulo de volume refatorado v2)
   sound.js    auto-inicia:   botão flutuante + modal interno

   RESPONSABILIDADES
   ─────────────────────────────────────────────
   ✅ Botão flutuante de volume (.abtn) — cicla entre modos
   ✅ Modal de configuração de som:
       - Sliders de volume (music / sfx) via makeVolumeSlider
       - Cards de categorias (click / hover / select / modal)
       - Variants + preview de cada som
       - Área-chips (por seção do app)
       - Spec panel (overrides por área)
       - BGM tracks (pré-escuta das trilhas)
   ✅ Sincronização com audio-state.js (subscribe)
   ✅ Não duplica lógica de sfx.js nem audio-state.js

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
import { mountAudioBtn, destroyAudioBtn } from './audio-btn.js';

/* ═══════════════════════════════════════════════
   SEÇÃO A — BOTÃO FLUTUANTE DE VOLUME
   Implementação centralizada em ui/audio-btn.js.
   sound.js delega montagem e destruição via API
   exportada, sem duplicar dados visuais nem lógica.
═══════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════
   SEÇÃO B — MODAL DE CONFIGURAÇÃO DE SOM
═══════════════════════════════════════════════ */

/* ── Dados ── */

const _DEFAULT_MUSIC = 50;   // int 0-150 (= 0.50 real)
const _DEFAULT_SFX   = 50;   // int 0-150 (= 0.50 real)

const _CATEGORIES = [
  {
    id: 'click',
    name: 'Click Sounds',
    desc: 'Sons ao clicar em botões e elementos.',
    icon: '◉',
    cls: 'snd-sound-card--click',
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
    cls: 'snd-sound-card--hover',
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
    cls: 'snd-sound-card--select',
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
    cls: 'snd-sound-card--modal',
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
    cls: 'snd-sound-card--correct',
    areas: ['Quiz', 'Game'],
    defaultVariant: 'correct4',
    variants: [
      { id: 'correct4', label: 'Correct 1 — Ping duplo',        fn: () => audio.sfx.correct4?.() },
      { id: 'correct5', label: 'Correct 2 — Chime 3 notas',     fn: () => audio.sfx.correct5?.() },
      { id: 'correct6', label: 'Correct 3 — Retro 8-bit',       fn: () => audio.sfx.correct6?.() },
      { id: 'correct7', label: 'Correct 4 — Arpejo rápido',     fn: () => audio.sfx.correct7?.() },
      { id: 'correct8', label: 'Correct 5 — Tick shimmer',      fn: () => audio.sfx.correct8?.() },
    ],
  },
  {
    id: 'wrong',
    name: 'Wrong Sounds',
    desc: 'Sons ao errar uma questão.',
    icon: '✕',
    cls: 'snd-sound-card--wrong',
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
    cls: 'snd-sound-card--timeout',
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
    cls: 'snd-sound-card--timerwarning',
    areas: ['Quiz', 'Game'],
    defaultVariant: 'timerWarning1',
    variants: [
      { id: 'timerWarning1', label: 'Warning 1 — Três beeps crescentes',  fn: () => audio.sfx.timerWarning1?.() },
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
    cls: 'snd-sound-card--pause',
    areas: ['Quiz', 'Game'],
    defaultVariant: 'pause1',
    variants: [
      { id: 'pause1', label: 'Pause 1 — Dois tons descendentes', fn: () => audio.sfx.pause1?.() },
      { id: 'pause2', label: 'Pause 2 — Fade out lento',         fn: () => audio.sfx.pause2?.() },
      { id: 'pause3', label: 'Pause 3 — Thud + shimmer',         fn: () => audio.sfx.pause3?.() },
      { id: 'pause4', label: 'Pause 4 — Tock + drone',           fn: () => audio.sfx.pause4?.() },
    ],
  },
];

const _MUSIC_TRACKS = [
  { id: 'music-menu',    name: 'Menu Principal', desc: 'Atmosfera ambient suave',         fn: () => audio.music['music-menu']?.() },
  { id: 'music-game',    name: 'Game',           desc: 'Futurista — arpejo sci-fi',       fn: () => audio.music['music-game']?.() },
  { id: 'music-quiz',    name: 'Quiz',           desc: 'Emocional e acolhedora',          fn: () => audio.music['music-quiz']?.() },
  { id: 'music-results', name: 'Resultados',     desc: 'Lo-fi digital, missão concluída', fn: () => audio.music['music-results']?.() },
  { id: 'music-profile', name: 'Área Pessoal',   desc: 'Jornada do jogador, motivadora',  fn: () => audio.music['music-profile']?.() },
];


/* ── Estado do modal ── */

const _modalState = {
  musicEnabled:    true,
  musicSlider:     _DEFAULT_MUSIC,
  sfxSlider:       _DEFAULT_SFX,
  selectedVariant: {},
  enabledCats:     {},
  selectedAreas:   {},
  playingMusic:    null,
};

const _specificOverrides = {};

function _resetModalState() {
  _modalState.musicEnabled  = true;
  _modalState.musicSlider   = _DEFAULT_MUSIC;
  _modalState.sfxSlider     = _DEFAULT_SFX;
  _modalState.playingMusic  = null;

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


/* ── Variáveis de módulo ── */

let _overlay     = null;
let _wrap        = null;
let _modalEl     = null;
let _specOverlay = null;
let _specPanelEl = null;
let _modalOpen   = false;
let _activePanelCatId = null;

// Instâncias dos sliders de volume (vol-slider.js)
let _musicSlider = null;
let _sfxSlider   = null;


/* ── Criação do DOM do modal ── */

function _buildModalDOM() {
  _overlay = document.createElement('div');
  _overlay.className = 'snd-modal-overlay';

  _wrap = document.createElement('div');
  _wrap.className = 'snd-modal-wrap';

  _modalEl = document.createElement('div');
  _modalEl.className = 'snd-modal';
  _modalEl.setAttribute('role', 'dialog');
  _modalEl.setAttribute('aria-label', 'Configurações de Som');

  _modalEl.innerHTML = `
    <!-- Header -->
    <header class="snd-modal__header">
      <div class="snd-modal__header-left">
        <div class="snd-modal__icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
        </div>
        <div>
          <h1 class="snd-modal__title">Configurações de Som</h1>
          <p class="snd-modal__subtitle">Personalize sons, variantes e onde cada efeito é ativado</p>
        </div>
      </div>
      <div class="snd-modal__header-right">
        <span class="snd-modal__badge">ÁUDIO</span>
        <button class="snd-modal__close" id="snd-close-btn" aria-label="Fechar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Body -->
    <div class="snd-modal__body">

      <!-- SISTEMA -->
      <section class="snd-section">
        <div class="snd-section__label">
          <span class="snd-section__dot"></span>
          SISTEMA
        </div>
        <div class="vol-card">
          <div class="vol-card-inner">

            <!-- Music BGM -->
            <div class="vol-group" data-type="music" id="vol-grp-music">
              <div class="vol-header">
                <div class="vol-label">
                  <span class="vol-label-dot"></span>
                  Música (BGM)
                </div>
                <div class="vol-header-right">
                  <span class="vol-badge" id="snd-musicBadge">0.5×</span>
                  <span class="vol-val" id="snd-musicValDisplay">0.50</span>
                </div>
              </div>
              <div class="vol-track-wrap" id="snd-sliderGroupMusic">
                <div class="vol-track-bg">
                  <div class="vol-track-fill" id="snd-musicFill"></div>
                </div>
                <div class="vol-snap-mark" id="snd-musicMark50"  title="0.5×"></div>
                <div class="vol-snap-mark" id="snd-musicMark100" title="1.0×"></div>
                <div class="vol-snap-mark" id="snd-musicMark150" title="1.5×"></div>
                <input type="range" class="vol-input" id="snd-musicSlider"
                  min="0" max="150" step="1" value="50" aria-label="Volume de Música" />
                <div class="vol-thumb" id="snd-musicThumb"></div>
              </div>
              <div class="vol-scale">
                <span>0</span>
                <span class="def">0.5× padrão</span>
                <span>1.0×</span>
                <span>1.5×</span>
              </div>
            </div>

            <div class="vol-divider"></div>

            <!-- SFX -->
            <div class="vol-group" data-type="sfx" id="vol-grp-sfx">
              <div class="vol-header">
                <div class="vol-label">
                  <span class="vol-label-dot"></span>
                  Efeitos (SFX)
                </div>
                <div class="vol-header-right">
                  <span class="vol-badge" id="snd-sfxBadge">0.5×</span>
                  <span class="vol-val" id="snd-sfxValDisplay">0.50</span>
                </div>
              </div>
              <div class="vol-track-wrap" id="snd-sliderGroupSfx">
                <div class="vol-track-bg">
                  <div class="vol-track-fill" id="snd-sfxFill"></div>
                </div>
                <div class="vol-snap-mark" id="snd-sfxMark50"  title="0.5×"></div>
                <div class="vol-snap-mark" id="snd-sfxMark100" title="1.0×"></div>
                <div class="vol-snap-mark" id="snd-sfxMark150" title="1.5×"></div>
                <input type="range" class="vol-input" id="snd-sfxSlider"
                  min="0" max="150" step="1" value="50" aria-label="Volume de Efeitos" />
                <div class="vol-thumb" id="snd-sfxThumb"></div>
              </div>
              <div class="vol-scale">
                <span>0</span>
                <span class="def">0.5× padrão</span>
                <span>1.0×</span>
                <span>1.5×</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- CATEGORIAS -->
      <section class="snd-section">
        <div class="snd-section__label">
          <span class="snd-section__dot"></span>
          CATEGORIAS DE SOM
        </div>
        <div class="snd-cards-grid" id="snd-cardsGrid"></div>
      </section>

      <!-- BGM -->
      <section class="snd-section">
        <div class="snd-section__label">
          <span class="snd-section__dot snd-section__dot--violet"></span>
          MÚSICA DE FUNDO (BGM)
        </div>
        <div class="snd-music-card">
          <div class="snd-music-card__header">
            <div>
              <span class="snd-music-card__name">Trilhas Sonoras</span>
              <span class="snd-music-card__desc">Música ambiente para cada área do app</span>
            </div>
            <label class="snd-toggle" aria-label="Ativar ou desativar música">
              <input type="checkbox" class="snd-toggle__input snd-toggle__input--violet" id="snd-musicToggle" checked />
              <span class="snd-toggle__track snd-toggle__track--violet">
                <span class="snd-toggle__thumb"></span>
              </span>
            </label>
          </div>
          <div class="snd-music-tracks" id="snd-musicTracks"></div>
        </div>
      </section>

    </div>

    <!-- Footer -->
    <footer class="snd-modal__footer">
      <div class="snd-modal__footer-note">
        <span>NEXUS AUDIO</span>
      </div>
      <div class="snd-modal__footer-actions">
        <button class="snd-btn snd-btn--ghost" id="snd-resetBtn">Resetar</button>
        <button class="snd-btn snd-btn--primary" id="snd-closeBtn2">Fechar</button>
        <button class="snd-btn snd-btn--save" id="snd-saveBtn">Salvar</button>
      </div>
    </footer>
  `;

  _specOverlay = document.createElement('div');
  _specOverlay.className = 'snd-spec-overlay';

  _specPanelEl = document.createElement('div');
  _specPanelEl.className = 'snd-spec-panel';

  _wrap.appendChild(_modalEl);

  document.body.appendChild(_overlay);
  document.body.appendChild(_wrap);
  document.body.appendChild(_specOverlay);
  document.body.appendChild(_specPanelEl);

  _bindModalEvents();
}


/* ── Sync overrides from audio-state ── */

function _syncOverridesFromState() {
  const areaMap = audioState.getSfxAreaMap?.() ?? {};

  console.log('[sound] _syncOverridesFromState: sfxAreaMap do audio-state =', JSON.stringify(areaMap));

  _CATEGORIES.forEach(cat => {
    cat.areas.forEach(area => {
      _specificOverrides[cat.id][area] = null;
    });
  });

  const areaLabelByKey = {};
  _CATEGORIES.forEach(cat => {
    cat.areas.forEach(area => {
      areaLabelByKey[area.toLowerCase()] = area;
    });
  });

  Object.entries(areaMap).forEach(([areaKey, actionMap]) => {
    const areaLabel = areaLabelByKey[areaKey];
    if (!areaLabel) {
      console.warn('[sound] _syncOverridesFromState: chave de área desconhecida "' + areaKey + '" — ignorada');
      return;
    }

    Object.entries(actionMap).forEach(([action, variantId]) => {
      const catId = (action === 'openModal' || action === 'closeModal') ? 'modal' : action;
      if (_specificOverrides[catId] !== undefined) {
        _specificOverrides[catId][areaLabel] = variantId || null;
        console.log(`[sound] _syncOverridesFromState: override aplicado catId="${catId}" area="${areaLabel}" variant="${variantId}"`);
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

  console.log('[sound] _openModal: _specificOverrides após sync =', JSON.stringify(_specificOverrides));

  // 3. Renderiza cards e tracks
  _renderCards();
  _renderMusicTracks();

  // 4. Abre o modal
  _overlay.classList.add('is-open');
  _wrap.classList.add('is-open');

  // 5. Instancia ou reutiliza os sliders de volume
  const volumes = audioState.getVolumes();

  if (_musicSlider) {
    _musicSlider.setValue(volumes.music);
  } else {
    _musicSlider = makeVolumeSlider({
      wrapId:  'snd-sliderGroupMusic',
      inputId: 'snd-musicSlider',
      thumbId: 'snd-musicThumb',
      fillId:  'snd-musicFill',
      valId:   'snd-musicValDisplay',
      badgeId: 'snd-musicBadge',
      markIds: ['snd-musicMark50', 'snd-musicMark100', 'snd-musicMark150'],
      onInput: (v) => {
        _modalState.musicSlider = Math.round(v * 100);
        audioState.setVolume('music', v);
      },
    });
    _musicSlider.setValue(volumes.music);
  }

  if (_sfxSlider) {
    _sfxSlider.setValue(volumes.sfx);
  } else {
    _sfxSlider = makeVolumeSlider({
      wrapId:  'snd-sliderGroupSfx',
      inputId: 'snd-sfxSlider',
      thumbId: 'snd-sfxThumb',
      fillId:  'snd-sfxFill',
      valId:   'snd-sfxValDisplay',
      badgeId: 'snd-sfxBadge',
      markIds: ['snd-sfxMark50', 'snd-sfxMark100', 'snd-sfxMark150'],
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

  _closeSpecPanel();
  _stopMusic();

  _overlay.classList.remove('is-open');
  _wrap.classList.remove('is-open');

  _wrap.removeEventListener('click', _onWrapClick);
  document.removeEventListener('keydown', _onKeyDown);
}

function _onWrapClick(e) {
  if (e.target === _wrap) _closeModal();
}

function _onKeyDown(e) {
  if (e.key === 'Escape') {
    if (_specPanelEl.classList.contains('is-open')) _closeSpecPanel();
    else _closeModal();
  }
}


/* ── Bindings de eventos do modal ── */

function _bindModalEvents() {
  _modalEl.querySelector('#snd-close-btn').addEventListener('click',  _closeModal);
  _modalEl.querySelector('#snd-closeBtn2').addEventListener('click',  _closeModal);
  _modalEl.querySelector('#snd-resetBtn').addEventListener('click',   _resetAll);
  _modalEl.querySelector('#snd-saveBtn').addEventListener('click',    _saveAll);

  _modalEl.querySelector('#snd-musicToggle').addEventListener('change', e => {
    _modalState.musicEnabled = e.target.checked;
    if (!_modalState.musicEnabled) _stopMusic();
  });
}


/* ── Sound Cards ── */

function _renderCards() {
  const grid = document.getElementById('snd-cardsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  _CATEGORIES.forEach((cat, ci) => {
    const card = document.createElement('div');
    card.className = `snd-sound-card ${cat.cls}`;
    card.id = `snd-sc-${cat.id}`;
    card.style.animationDelay = `${ci * 55}ms`;
    if (!_modalState.enabledCats[cat.id]) card.classList.add('is-disabled');

    const head = document.createElement('div');
    head.className = 'snd-sound-card__head';
    head.innerHTML = `
      <div class="snd-sound-card__head-left">
        <div class="snd-sound-card__icon">${cat.icon}</div>
        <div>
          <span class="snd-sound-card__name">${cat.name}</span>
          <span class="snd-sound-card__desc">${cat.desc}</span>
        </div>
      </div>
    `;
    head.appendChild(_buildCatToggle(cat.id));
    card.appendChild(head);

    const secLabel = document.createElement('div');
    secLabel.className = 'snd-sound-card__sec';
    secLabel.textContent = 'Variante ativa';
    card.appendChild(secLabel);

    if (cat.id === 'modal') {
      const openVariants  = cat.variants.filter(v => v.id.startsWith('open')  || v.id.startsWith('Open'));
      const closeVariants = cat.variants.filter(v => v.id.startsWith('close') || v.id.startsWith('Close'));

      const openSec = document.createElement('div');
      openSec.className = 'snd-sound-card__sec snd-sound-card__sec--sub';
      openSec.textContent = 'ABRIR';
      card.appendChild(openSec);

      const openList = document.createElement('div');
      openList.className = 'snd-sound-card__variants';
      openVariants.forEach(v => openList.appendChild(_buildVariantRow(cat, v)));
      card.appendChild(openList);

      const closeSec = document.createElement('div');
      closeSec.className = 'snd-sound-card__sec snd-sound-card__sec--sub';
      closeSec.textContent = 'FECHAR';
      card.appendChild(closeSec);

      const closeList = document.createElement('div');
      closeList.className = 'snd-sound-card__variants';
      closeVariants.forEach(v => closeList.appendChild(_buildVariantRow(cat, v)));
      card.appendChild(closeList);
    } else {
      const varList = document.createElement('div');
      varList.className = 'snd-sound-card__variants';
      cat.variants.forEach(v => varList.appendChild(_buildVariantRow(cat, v)));
      card.appendChild(varList);
    }

    const areaSecLabel = document.createElement('div');
    areaSecLabel.className = 'snd-sound-card__sec';
    areaSecLabel.textContent = 'ÁREA GERAL';
    card.appendChild(areaSecLabel);

    const areasSection = document.createElement('div');
    areasSection.className = 'snd-sound-card__areas-section';
    areasSection.id = `snd-areas-section-${cat.id}`;

    const generalRow = document.createElement('div');
    generalRow.className = 'snd-areas-general';
    generalRow.id = `snd-areas-general-${cat.id}`;
    cat.areas.forEach(area => generalRow.appendChild(_buildGeneralAreaChip(cat.id, area)));
    areasSection.appendChild(generalRow);
    areasSection.appendChild(_buildSpecificBtn(cat));
    card.appendChild(areasSection);

    grid.appendChild(card);
  });
}

function _buildCatToggle(catId) {
  const label = document.createElement('label');
  label.className = 'snd-toggle';
  label.setAttribute('aria-label', `Ativar sons de ${catId}`);
  const checked = _modalState.enabledCats[catId];
  label.innerHTML = `
    <input type="checkbox" class="snd-toggle__input" ${checked ? 'checked' : ''} />
    <span class="snd-toggle__track"><span class="snd-toggle__thumb"></span></span>
  `;
  label.querySelector('input').addEventListener('change', e => {
    _modalState.enabledCats[catId] = e.target.checked;
    document.getElementById(`snd-sc-${catId}`)
      ?.classList.toggle('is-disabled', !e.target.checked);
  });
  return label;
}

function _buildVariantRow(cat, v) {
  const _modalSlot = cat.id === 'modal'
    ? ((v.id.startsWith('open') || v.id.startsWith('Open')) ? 'modal-open' : 'modal-close')
    : cat.id;
  const isActive = _modalState.selectedVariant[_modalSlot] === v.id;
  const row = document.createElement('div');
  row.className = `snd-variant-row${isActive ? ' is-active' : ''}`;
  row.dataset.cat = cat.id;
  row.dataset.var = v.id;
  row.innerHTML = `
    <div class="snd-vr-radio"><div class="snd-vr-radio__dot"></div></div>
    <span class="snd-vr-label">${v.label}</span>
    <button class="snd-vr-preview" aria-label="Preview ${v.label}" title="Ouvir prévia">▶</button>
  `;
  row.addEventListener('click', e => {
    if (e.target.closest('.snd-vr-preview')) return;
    _setActiveVariant(cat.id, v.id);
  });
  row.querySelector('.snd-vr-preview').addEventListener('click', e => {
    e.stopPropagation();
    _triggerPreview(v, e.currentTarget);
  });
  return row;
}

function _setActiveVariant(catId, varId) {
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

  const card = document.getElementById(`snd-sc-${catId}`);
  if (!card) return;
  if (catId === 'modal') {
    const isOpen = varId.startsWith('open') || varId.startsWith('Open');
    card.querySelectorAll('.snd-variant-row').forEach(row => {
      const rowIsOpen = row.dataset.var.startsWith('open') || row.dataset.var.startsWith('Open');
      if (rowIsOpen === isOpen) row.classList.toggle('is-active', row.dataset.var === varId);
    });
  } else {
    card.querySelectorAll('.snd-variant-row').forEach(row => {
      row.classList.toggle('is-active', row.dataset.var === varId);
    });
  }
}

function _triggerPreview(variant, btn) {
  variant.fn();
  btn.classList.add('is-playing');
  setTimeout(() => btn.classList.remove('is-playing'), 500);
}


/* ── General Area Chips ── */

function _buildGeneralAreaChip(catId, area) {
  const isOverridden = _specificOverrides[catId][area] !== null;
  const isOn = _modalState.selectedAreas[catId].includes(area);

  const chip = document.createElement('label');
  chip.className = `snd-area-chip-gen${isOverridden ? ' overridden' : (isOn ? ' on' : '')}`;
  chip.id = `snd-gen-chip-${catId}-${area}`;
  chip.innerHTML = `
    <input type="checkbox" ${isOn && !isOverridden ? 'checked' : ''} ${isOverridden ? 'disabled' : ''} />
    <span class="snd-area-chip-gen__dot"></span>
    ${area}
  `;

  if (!isOverridden) {
    chip.addEventListener('change', () => {
      const areas = _modalState.selectedAreas[catId];
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

function _syncGeneralChips(catId) {
  const cat = _CATEGORIES.find(c => c.id === catId);
  const row = document.getElementById(`snd-areas-general-${catId}`);
  if (!row || !cat) return;
  row.innerHTML = '';
  cat.areas.forEach(area => row.appendChild(_buildGeneralAreaChip(catId, area)));
}


/* ── Spec Button ── */

function _buildSpecificBtn(cat) {
  const btn = document.createElement('button');
  btn.className = 'snd-btn-specific';
  btn.id = `snd-btn-spec-${cat.id}`;
  const n = _countOverrides(cat.id);
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    </svg>
    Configurar áreas específicas
    ${n > 0 ? `<span class="snd-btn-specific__badge">${n}</span>` : ''}
  `;
  if (n > 0) btn.classList.add('has-overrides');

  btn.addEventListener('click', e => {
    e.stopPropagation();
    _openSpecPanel(cat, btn);
  });
  return btn;
}

function _syncSpecBtn(catId) {
  const btn = document.getElementById(`snd-btn-spec-${catId}`);
  if (!btn) return;
  const n = _countOverrides(catId);
  const badge = btn.querySelector('.snd-btn-specific__badge');
  if (n > 0) {
    btn.classList.add('has-overrides');
    if (badge) { badge.textContent = n; }
    else {
      const sp = document.createElement('span');
      sp.className = 'snd-btn-specific__badge';
      sp.textContent = n;
      btn.appendChild(sp);
    }
  } else {
    btn.classList.remove('has-overrides');
    if (badge) badge.remove();
  }
}

function _countOverrides(catId) {
  return Object.values(_specificOverrides[catId]).filter(v => v !== null).length;
}

/**
 * Aplica um override de área no audioState, tratando a categoria 'modal'
 * de forma especial (split em openModal / closeModal).
 *
 * Centraliza a lógica que antes estava duplicada em:
 *   - _buildSpecTableRow (click handler)
 *   - _renderSpecPanel   (botão "Limpar overrides")
 *   - _saveAll
 *   - _resetAll
 *
 * @param {string}      catId     — id da categoria (ex: 'click', 'modal')
 * @param {string}      area      — label da área (ex: 'Game') — normalizado internamente
 * @param {string|null} variantId — id da variante ou null para remover override
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


/* ── Spec Panel ── */

function _openSpecPanel(cat, triggerBtn) {
  if (_activePanelCatId === cat.id && _specPanelEl.classList.contains('is-open')) {
    _closeSpecPanel();
    return;
  }

  _activePanelCatId = cat.id;

  const cardEl = document.getElementById(`snd-sc-${cat.id}`);
  if (cardEl) {
    const style = getComputedStyle(cardEl);
    _specPanelEl.style.setProperty('--c-panel-accent', style.getPropertyValue('--c-accent').trim());
    _specPanelEl.style.setProperty('--c-panel-glow',   style.getPropertyValue('--c-glow').trim());
    _specPanelEl.style.setProperty('--c-bg-on',        style.getPropertyValue('--c-bg-on').trim());
  }

  _renderSpecPanel(cat);
  _positionPanel(triggerBtn);

  _specOverlay.classList.add('is-open');
  _specPanelEl.classList.add('is-open');
  _specOverlay.onclick = _closeSpecPanel;
}

function _closeSpecPanel() {
  if (!_specPanelEl) return;
  _specPanelEl.classList.remove('is-open');
  _specOverlay.classList.remove('is-open');
  _activePanelCatId = null;
}

function _positionPanel(triggerBtn) {
  const rect   = triggerBtn.getBoundingClientRect();
  const panelW = 280;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = rect.left;
  let top  = rect.bottom + 8;

  if (left + panelW > vw - 12) left = vw - panelW - 12;
  if (left < 12) left = 12;
  if (top + 320 > vh - 12) top = rect.top - 8 - Math.min(300, vh * 0.5);
  if (top < 12) top = 12;

  _specPanelEl.style.left = `${left}px`;
  _specPanelEl.style.top  = `${top}px`;
}

function _renderSpecPanel(cat) {
  _specPanelEl.innerHTML = `
    <div class="snd-spec-panel__head">
      <span class="snd-spec-panel__title">
        <span class="snd-spec-panel__title-dot"></span>
        ${cat.name.replace(' Sounds', '')} — Específico
      </span>
      <button class="snd-spec-panel__close" id="snd-specPanelClose" aria-label="Fechar">✕</button>
    </div>
    <div class="snd-spec-panel__body" id="snd-specPanelBody"></div>
    <div class="snd-spec-panel__footer">
      <button class="snd-spec-panel__clear" id="snd-specPanelClear">Limpar overrides</button>
    </div>
  `;

  document.getElementById('snd-specPanelClose').addEventListener('click', _closeSpecPanel);
  document.getElementById('snd-specPanelClear').addEventListener('click', () => {
    cat.areas.forEach(area => {
      _specificOverrides[cat.id][area] = null;
      _applyModalAreaOverride(cat.id, area, null);
    });
    _modalState.selectedAreas[cat.id] = [...cat.areas];
    _renderSpecPanel(cat);
    _syncGeneralChips(cat.id);
    _syncSpecBtn(cat.id);
  });

  const body   = document.getElementById('snd-specPanelBody');
  const nAreas = cat.areas.length;

  const table = document.createElement('div');
  table.className = 'snd-spec-table';
  table.style.setProperty('--spec-cols', nAreas);

  const headerRow = document.createElement('div');
  headerRow.className = 'snd-spec-table__header';

  const labelHeader = document.createElement('div');
  labelHeader.className = 'snd-spec-th snd-spec-th--label';
  labelHeader.textContent = 'Variante';
  headerRow.appendChild(labelHeader);

  const playHeader = document.createElement('div');
  playHeader.className = 'snd-spec-th';
  headerRow.appendChild(playHeader);

  cat.areas.forEach(area => {
    const th = document.createElement('div');
    th.className = 'snd-spec-th snd-spec-th--area';
    const hasOv = _specificOverrides[cat.id][area] !== null;
    th.innerHTML = `
      <span class="snd-spec-th__name">${area}</span>
      ${hasOv
        ? `<span class="snd-spec-th__dot snd-spec-th__dot--override"></span>`
        : `<span class="snd-spec-th__dot"></span>`}
    `;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  table.appendChild(_buildSpecTableRow(cat, null));
  cat.variants.forEach(v => table.appendChild(_buildSpecTableRow(cat, v)));

  body.appendChild(table);
}

function _buildSpecTableRow(cat, variant) {
  const isDefault = variant === null;
  const row = document.createElement('div');
  row.className = `snd-spec-table__row${isDefault ? ' snd-spec-table__row--default' : ''}`;

  const labelCell = document.createElement('div');
  labelCell.className = 'snd-spec-td snd-spec-td--label';
  const shortLabel = isDefault ? '↩ Geral' : variant.label.replace(/\s—.*$/, '');
  const subLabel   = isDefault ? 'padrão'  : variant.label.replace(/^[^—]+—\s*/, '');
  labelCell.innerHTML = `
    <div class="snd-spec-td__text">
      <span class="snd-spec-td__main">${shortLabel}</span>
      <span class="snd-spec-td__sub">${subLabel}</span>
    </div>
  `;
  row.appendChild(labelCell);

  const playCell = document.createElement('div');
  playCell.className = 'snd-spec-td snd-spec-td--play';
  if (!isDefault) {
    const previewBtn = document.createElement('button');
    previewBtn.className = 'snd-spec-preview';
    previewBtn.setAttribute('aria-label', `Ouvir ${shortLabel}`);
    previewBtn.setAttribute('title', 'Ouvir prévia');
    previewBtn.textContent = '▶';
    previewBtn.addEventListener('click', e => {
      e.stopPropagation();
      _triggerPreview(variant, previewBtn);
    });
    playCell.appendChild(previewBtn);
  }
  row.appendChild(playCell);

  cat.areas.forEach(area => {
    const override = _specificOverrides[cat.id][area];
    const isActive = isDefault ? override === null : override === variant.id;

    const cell = document.createElement('div');
    cell.className = `snd-spec-td snd-spec-td--radio${isActive ? ' is-active' : ''}`;
    cell.dataset.area    = area;
    cell.dataset.variant = isDefault ? '__default__' : variant.id;
    cell.innerHTML = `<div class="snd-spec-radio"><div class="snd-spec-radio__dot"></div></div>`;

    cell.addEventListener('click', () => {
      const newOverride = isDefault ? null : variant.id;
      _specificOverrides[cat.id][area] = newOverride;

      const areas = _modalState.selectedAreas[cat.id];
      const idx   = areas.indexOf(area);

      if (newOverride !== null) {
        if (idx > -1) areas.splice(idx, 1);
      } else {
        if (idx === -1) areas.push(area);
      }

      _applyModalAreaOverride(cat.id, area, newOverride);

      _renderSpecPanel(cat);
      _syncGeneralChips(cat.id);
      _syncSpecBtn(cat.id);
    });

    row.appendChild(cell);
  });

  return row;
}


/* ── Music Tracks ── */

function _renderMusicTracks() {
  const container = document.getElementById('snd-musicTracks');
  if (!container) return;
  container.innerHTML = '';

  _MUSIC_TRACKS.forEach(track => {
    const row = document.createElement('div');
    row.className = 'snd-music-track';
    row.id = `snd-mt-${track.id}`;
    row.innerHTML = `
      <div class="snd-mt-radio"></div>
      <div class="snd-mt-info">
        <div class="snd-mt-name">${track.name}</div>
        <div class="snd-mt-desc">${track.desc}</div>
      </div>
      <span class="snd-mt-tag">A TOCAR</span>
      <button class="snd-mt-btn" aria-label="Preview ${track.name}">▶</button>
    `;
    row.addEventListener('click', e => {
      if (e.target.closest('.snd-mt-btn')) return;
      _toggleMusicTrack(track);
    });
    row.querySelector('.snd-mt-btn').addEventListener('click', e => {
      e.stopPropagation();
      _toggleMusicTrack(track);
    });
    container.appendChild(row);
  });
}

function _toggleMusicTrack(track) {
  if (_modalState.playingMusic === track.id) { _stopMusic(); return; }
  if (!_modalState.musicEnabled) return;
  _modalState.playingMusic = track.id;
  track.fn();
  _syncMusicUI();
}

function _stopMusic() {
  _modalState.playingMusic = null;
  audio.music.stop?.();
  _syncMusicUI();
}

function _syncMusicUI() {
  document.querySelectorAll('.snd-music-track').forEach(el => {
    const playing = el.id === `snd-mt-${_modalState.playingMusic}`;
    el.classList.toggle('is-on', playing);
    const btn = el.querySelector('.snd-mt-btn');
    if (btn) btn.textContent = playing ? '■' : '▶';
  });
}


/* ── Save ── */

function _saveAll() {
  audioState.setVolume('music', _modalState.musicSlider / 100);
  audioState.setVolume('sfx',   _modalState.sfxSlider   / 100);

  _CATEGORIES.forEach(cat => {
    cat.areas.forEach(area => {
      const override = _specificOverrides[cat.id]?.[area] ?? null;
      _applyModalAreaOverride(cat.id, area, override);
    });
  });

  const btn = document.getElementById('snd-saveBtn');
  if (btn) {
    const prev = btn.textContent;
    btn.textContent = 'Salvo ✓';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = prev; btn.disabled = false; }, 1400);
  }

  console.log('[sound] _saveAll: configurações salvas', {
    music: _modalState.musicSlider / 100,
    sfx:   _modalState.sfxSlider   / 100,
  });
}


/* ── Reset total ── */

const _DEFAULT_SFX_MAP = {
  click:      'click',
  hover:      'hover2',
  select:     'select',
  openModal:  'openModal2',
  closeModal: 'closeModal',
};

function _resetAll() {
  // 1. Engine de áudio
  audio.setMasterVolume(1.0);
  audio.setMusicVolume(0.5);
  audio.unmute();
  audio.setEnabled(true);

  // 2. Volumes no audioState (antes de setValue nos sliders)
  audioState.setVolume('master', 1.0);
  audioState.setVolume('music', 0.5);
  audioState.setVolume('sfx',   0.5);

  // 3. sfxMap padrão → Firebase
  Object.entries(_DEFAULT_SFX_MAP).forEach(([event, variantId]) => {
    audioState.setSfxMap(event, variantId);
  });

  // 4. Limpa overrides de área → Firebase
  _CATEGORIES.forEach(cat => {
    cat.areas.forEach(area => {
      _applyModalAreaOverride(cat.id, area, null);
    });
  });

  // 5. Estado local do modal
  _resetModalState();

  // 6. DOM
  if (_modalOpen) {
    _closeSpecPanel();
    _stopMusic();
  } else {
    audio.music?.stop?.();
    _modalState.playingMusic = null;
  }

  const musicToggle = document.getElementById('snd-musicToggle');
  if (musicToggle) musicToggle.checked = true;

  // 7. Atualiza sliders via API do vol-slider (sem recriar)
  if (_musicSlider) _musicSlider.setValue(_DEFAULT_MUSIC / 100);
  if (_sfxSlider)   _sfxSlider.setValue(_DEFAULT_SFX   / 100);

  // 8. Recria cards
  if (document.getElementById('snd-cardsGrid')) {
    _renderCards();
  }

  console.log('[sound] _resetAll: reset completo — sfxMap, sfxAreaMap, volumes e estado local restaurados aos padrões.');
}


/* ═══════════════════════════════════════════════
   SEÇÃO C — INICIALIZAÇÃO E API PÚBLICA
═══════════════════════════════════════════════ */

let _initialized = false;
let _modalBuilt  = false;

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

    console.log('[sound] reinit() executado — botão recriado, ctx resume tentado');
  },

  resetCtx() {
    audio.resumeCtx();
  },
};

export default Sound;