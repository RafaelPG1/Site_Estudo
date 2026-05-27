// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/sound.js
   Sistema de áudio unificado — v1.0

   ORIGINADO DE:
     som.js       → modal de configuração de som (DOM + lógica)
     som.html     → estrutura HTML do modal (agora gerada dinamicamente)
     audio-btn.js → botão flutuante de volume global

   ARQUITETURA
   ─────────────────────────────────────────────
   sound.js ←→ sfx.js        (engine de áudio)
   sound.js ←→ audio-state.js (estado global de modo)
   sound.js    auto-inicia:   botão flutuante + modal interno

   RESPONSABILIDADES
   ─────────────────────────────────────────────
   ✅ Botão flutuante de volume (.abtn) — cicla entre modos
   ✅ Modal de configuração de som:
       - Sliders de volume (master / music / sfx)
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
   // Inicializa tudo (botão + modal):
   import Sound from './shared/js/audio/sound.js';
   Sound.init();

   // Abre o modal programaticamente (ex: botão de config):
   Sound.openModal();

   // Fecha o modal:
   Sound.closeModal();
   ============================================= */

import audio       from './sfx.js';
import audioState  from './audio-state.js';

/* ═══════════════════════════════════════════════
   SEÇÃO A — BOTÃO FLUTUANTE DE VOLUME
   (Migrado de audio-btn.js)
═══════════════════════════════════════════════ */

const _VISUAL_STATES = [
  {
    id:     'normal',
    label:  'Volume ativado',
    stroke: '#00d4ff',
    glow:   'radial-gradient(circle,rgba(0,210,255,.26) 0%,transparent 70%)',
    ro:     'rgba(0,200,255,.18)',
    rm:     'rgba(0,200,255,.26)',
    bg:     'rgba(0,28,52,.88)',
    border: 'rgba(0,200,255,.42)',
    pulse:  'rgba(0,200,255,.3)',
    anim:   true,
    ic:     'iN',
  },
  {
    id:     'mute',
    label:  'Mudo',
    stroke: '#ff4d5e',
    glow:   'radial-gradient(circle,rgba(255,50,80,.2) 0%,transparent 70%)',
    ro:     'rgba(255,60,80,.13)',
    rm:     'rgba(255,60,80,.2)',
    bg:     'rgba(28,4,6,.9)',
    border: 'rgba(255,60,80,.36)',
    pulse:  'rgba(255,60,80,.25)',
    anim:   false,
    ic:     'iM',
  },
  {
    id:     'low',
    label:  'Volume reduzido',
    stroke: '#00e8be',
    glow:   'radial-gradient(circle,rgba(0,240,190,.16) 0%,transparent 70%)',
    ro:     'rgba(0,220,180,.14)',
    rm:     'rgba(0,220,180,.22)',
    bg:     'rgba(0,18,16,.88)',
    border: 'rgba(0,220,180,.34)',
    pulse:  'rgba(0,200,160,.22)',
    anim:   true,
    ic:     'iL',
  },
];

const _CYCLE_ORDER  = ['normal', 'mute', 'low'];
const _visualById   = Object.fromEntries(_VISUAL_STATES.map(s => [s.id, s]));

function _createAudioBtn() {
  const btn = document.createElement('button');
  btn.className = 'abtn';
  btn.id = 'audio-btn-global';
  btn.setAttribute('aria-label', _visualById['normal'].label);
  btn.innerHTML = `
    <div class="glow"></div>
    <div class="ro"></div>
    <div class="rm"></div>
    <div class="pulse"></div>
    <div class="ripple"></div>
    <div class="body">
      <div class="iw">
        <svg class="ic on" data-ic="iN" width="22" height="22" viewBox="0 0 44 44">
          <path d="M14 17H10a1 1 0 00-1 1v8a1 1 0 001 1h4l7 6V11l-7 6z" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M25 16.5C27.5 18 29 20 29 22s-1.5 5.5-4 6.5"           fill="none" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M28.5 13.5C32.5 16 35 19 35 22s-2.5 6-6.5 8.5"         fill="none" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M32 10.5C37.5 14 41 18 41 22s-3.5 8-9 11.5"            fill="none" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <svg class="ic" data-ic="iM" width="22" height="22" viewBox="0 0 44 44">
          <path d="M14 17H10a1 1 0 00-1 1v8a1 1 0 001 1h4l7 6V11l-7 6z" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="26" y1="17" x2="36" y2="27" stroke-width="2" stroke-linecap="round"/>
          <line x1="36" y1="17" x2="26" y2="27" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <svg class="ic" data-ic="iL" width="22" height="22" viewBox="0 0 44 44">
          <path d="M14 17H10a1 1 0 00-1 1v8a1 1 0 001 1h4l7 6V11l-7 6z" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M25 16.5C27.5 18 29 20 29 22s-1.5 5.5-4 6.5"          fill="none" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
  `;
  return btn;
}

function _initAudioBtnLogic(btn) {
  const glow  = btn.querySelector('.glow');
  const ro    = btn.querySelector('.ro');
  const rm    = btn.querySelector('.rm');
  const bd    = btn.querySelector('.body');
  const pu    = btn.querySelector('.pulse');
  const ri    = btn.querySelector('.ripple');
  const icons = {};
  btn.querySelectorAll('[data-ic]').forEach(el => { icons[el.dataset.ic] = el; });

  let _lastRenderedId = null;

  function _renderMode(modeId) {
    const s = _visualById[modeId] ?? _visualById['normal'];

    if (_lastRenderedId && _lastRenderedId !== modeId) {
      const fromIc = _visualById[_lastRenderedId]?.ic;
      const toIc   = s.ic;
      if (fromIc && fromIc !== toIc) {
        icons[fromIc].classList.remove('on');
        icons[fromIc].classList.add('out');
        setTimeout(() => {
          icons[fromIc].classList.remove('out');
          icons[toIc].classList.add('on');
        }, 170);
      }
    } else if (!_lastRenderedId) {
      icons[s.ic].classList.add('on');
    }

    glow.style.background = s.glow;
    glow.style.opacity    = '1';
    ro.style.borderColor  = s.ro;
    rm.style.borderColor  = s.rm;
    bd.style.background   = s.bg;
    bd.style.borderColor  = s.border;
    Object.values(icons).forEach(el =>
      el.querySelectorAll('path, line').forEach(p => p.style.stroke = s.stroke)
    );
    pu.style.borderColor = s.pulse;
    pu.style.animation   = 'none';
    if (s.anim) { void pu.offsetWidth; pu.style.animation = 'abtn-pulse 1.9s ease-out infinite'; }
    btn.setAttribute('aria-label', s.label);
    btn.dataset.state = s.id;

    _lastRenderedId = modeId;
  }

  _renderMode(audioState.getMode());
  audioState.subscribe(_renderMode);

  btn.addEventListener('click', () => {
    const currentMode = audioState.getMode();
    const currentIdx  = _CYCLE_ORDER.indexOf(currentMode);
    const nextMode    = _CYCLE_ORDER[(currentIdx + 1) % _CYCLE_ORDER.length];

    audioState.setMode(nextMode);

    ri.style.animation = 'none';
    void ri.offsetWidth;
    ri.style.animation = 'abtn-ripple .5s ease-out forwards';
  });
}

function _mountAudioBtn() {
  if (document.getElementById('audio-btn-global')) return;
  const btn = _createAudioBtn();
  _initAudioBtnLogic(btn);
  document.body.appendChild(btn);
}


/* ═══════════════════════════════════════════════
   SEÇÃO B — MODAL DE CONFIGURAÇÃO DE SOM
   (Migrado de som.js + som.html)
═══════════════════════════════════════════════ */

/* ── Dados ── */

const _SLIDER_MAX      = 200;
const _DEFAULT_MASTER  = 100;
const _DEFAULT_MUSIC   = 100;
const _DEFAULT_SFX     = 100;
const _SNAP_POINT      = 100;
const _SNAP_ZONE       = 4;

const _CATEGORIES = [
  {
    id: 'click',
    name: 'Click Sounds',
    desc: 'Sons ao clicar em botões e elementos.',
    icon: '◉',
    cls: 'snd-sound-card--click',
    areas: ['Game', 'Quiz', 'Perfil', 'Resumos'],
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
    areas: ['Game', 'Quiz', 'Perfil', 'Resumos'],
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
    areas: ['Game', 'Quiz', 'Perfil', 'Resumos'],
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
    areas: ['Game', 'Quiz', 'Perfil', 'Resumos'],
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

const _MUSIC_TRACKS = [
  { id: 'music-menu',    name: 'Menu Principal', desc: 'Atmosfera ambient suave',         fn: () => audio.music['music-menu']?.() },
  { id: 'music-game',    name: 'Game',           desc: 'Futurista — arpejo sci-fi',       fn: () => audio.music['music-game']?.() },
  { id: 'music-quiz',    name: 'Quiz',           desc: 'Emocional e acolhedora',          fn: () => audio.music['music-quiz']?.() },
  { id: 'music-results', name: 'Resultados',     desc: 'Lo-fi digital, missão concluída', fn: () => audio.music['music-results']?.() },
  { id: 'music-profile', name: 'Área Pessoal',   desc: 'Jornada do jogador, motivadora',  fn: () => audio.music['music-profile']?.() },
];


/* ── Estado do modal ── */

const _modalState = {
  masterEnabled: true,
  musicEnabled:  true,
  masterSlider:  _DEFAULT_MASTER,
  musicSlider:   _DEFAULT_MUSIC,
  sfxSlider:     _DEFAULT_SFX,
  selectedVariant: {},
  enabledCats:     {},
  selectedAreas:   {},
  playingMusic:    null,
};

const _specificOverrides = {};

function _resetModalState() {
  _modalState.masterEnabled = true;
  _modalState.musicEnabled  = true;
  _modalState.masterSlider  = _DEFAULT_MASTER;
  _modalState.musicSlider   = _DEFAULT_MUSIC;
  _modalState.sfxSlider     = _DEFAULT_SFX;
  _modalState.playingMusic  = null;

  _CATEGORIES.forEach(cat => {
    _modalState.selectedVariant[cat.id] = cat.defaultVariant;
    _modalState.enabledCats[cat.id]     = true;
    _modalState.selectedAreas[cat.id]   = [...cat.areas];
    _specificOverrides[cat.id] = {};
    cat.areas.forEach(area => { _specificOverrides[cat.id][area] = null; });
  });
}

_resetModalState();


/* ── DOM do modal (persistente entre aberturas) ── */

let _overlay      = null;
let _wrap         = null;
let _modalEl      = null;
let _specOverlay  = null;
let _specPanelEl  = null;
let _modalOpen    = false;
let _activePanelCatId = null;


/* ── Criação do DOM do modal ── */

function _buildModalDOM() {
  // Overlay de fundo
  _overlay = document.createElement('div');
  _overlay.className = 'snd-modal-overlay';

  // Wrapper de posicionamento
  _wrap = document.createElement('div');
  _wrap.className = 'snd-modal-wrap';

  // Painel principal
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
        <div class="snd-global-card">
          <div class="snd-sliders">

            <!-- Master -->
            <div class="snd-slider-group" id="snd-sliderGroupMaster">
              <div class="snd-slider-group__label">
                <span>Volume Geral</span>
                <span class="snd-slider-group__value" id="snd-masterValDisplay">1.0</span>
              </div>
              <div class="snd-slider-track-wrap">
                <div class="snd-slider-fill" id="snd-masterFill"></div>
                <div class="snd-slider-mark" id="snd-masterMark" title="Padrão (1.0)"></div>
                <input type="range" class="snd-slider snd-slider--master" id="snd-masterSlider"
                  min="0" max="200" step="1" value="100" aria-label="Volume Geral" />
              </div>
              <div class="snd-slider-scale">
                <span>0</span>
                <span class="snd-slider-scale__default">1.0 <em>padrão</em></span>
                <span>2.0</span>
              </div>
            </div>

            <!-- Music -->
            <div class="snd-slider-group" id="snd-sliderGroupMusic">
              <div class="snd-slider-group__label">
                <span>Música (BGM)</span>
                <span class="snd-slider-group__value snd-slider-group__value--music" id="snd-musicValDisplay">0.4</span>
              </div>
              <div class="snd-slider-track-wrap">
                <div class="snd-slider-fill snd-slider-fill--music" id="snd-musicFill"></div>
                <div class="snd-slider-mark snd-slider-mark--music" id="snd-musicMark" title="Padrão (1.0)"></div>
                <input type="range" class="snd-slider snd-slider--music" id="snd-musicSlider"
                  min="0" max="200" step="1" value="100" aria-label="Volume de Música" />
              </div>
              <div class="snd-slider-scale">
                <span>0</span>
                <span class="snd-slider-scale__default">1.0 <em>padrão</em></span>
                <span>2.0</span>
              </div>
            </div>

            <!-- SFX -->
            <div class="snd-slider-group" id="snd-sliderGroupSfx">
              <div class="snd-slider-group__label">
                <span>Efeitos (SFX)</span>
                <span class="snd-slider-group__value snd-slider-group__value--sfx" id="snd-sfxValDisplay">1.0</span>
              </div>
              <div class="snd-slider-track-wrap">
                <div class="snd-slider-fill snd-slider-fill--sfx" id="snd-sfxFill"></div>
                <div class="snd-slider-mark snd-slider-mark--sfx" id="snd-sfxMark" title="Padrão (1.0)"></div>
                <input type="range" class="snd-slider snd-slider--sfx" id="snd-sfxSlider"
                  min="0" max="200" step="1" value="100" aria-label="Volume de Efeitos" />
              </div>
              <div class="snd-slider-scale">
                <span>0</span>
                <span class="snd-slider-scale__default">1.0 <em>padrão</em></span>
                <span>2.0</span>
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
      <span class="snd-modal__footer-note">Alterações aplicadas em tempo real · Não salvo</span>
      <div class="snd-modal__footer-actions">
        <button class="snd-btn snd-btn--ghost" id="snd-resetBtn">Resetar</button>
        <button class="snd-btn snd-btn--primary" id="snd-closeBtn2">Fechar</button>
      </div>
    </footer>
  `;

  // Spec overlay e panel (portais flutuantes)
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


/* ── Abertura e fechamento ── */

function _openModal() {
  if (_modalOpen) return;
  _modalOpen = true;

  // Sincroniza selectedVariant com o SFX_MAP atual do audio-state
  // para que o modal reflita os sons salvos do usuário.
  const currentSfxMap = audioState.getSfxMap();
  if (currentSfxMap.click)      _modalState.selectedVariant['click']  = currentSfxMap.click;
  if (currentSfxMap.hover)      _modalState.selectedVariant['hover']  = currentSfxMap.hover;
  if (currentSfxMap.select)     _modalState.selectedVariant['select'] = currentSfxMap.select;
  // Para 'modal', openModal e closeModal são controlados pela mesma categoria
  // mas o selectedVariant armazena apenas uma variante ativa por vez.
  // Usa openModal como valor representativo da categoria 'modal'.
  if (currentSfxMap.openModal)  _modalState.selectedVariant['modal']  = currentSfxMap.openModal;

  _renderCards();
  _renderMusicTracks();
  _initSliders();

  _overlay.classList.add('is-open');
  _wrap.classList.add('is-open');

  // Fecha ao clicar no fundo (fora do painel)
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
  _modalEl.querySelector('#snd-close-btn').addEventListener('click',   _closeModal);
  _modalEl.querySelector('#snd-closeBtn2').addEventListener('click',   _closeModal);
  _modalEl.querySelector('#snd-resetBtn').addEventListener('click',    _resetAll);

  _modalEl.querySelector('#snd-musicToggle').addEventListener('change', e => {
    _modalState.musicEnabled = e.target.checked;
    if (!_modalState.musicEnabled) _stopMusic();
  });
}


/* ── Sliders ── */

function _initSliders() {
  _syncSlider('snd-masterSlider', 'snd-masterFill', 'snd-masterValDisplay', 'snd-sliderGroupMaster', _modalState.masterSlider, 'master');
  _syncSlider('snd-musicSlider',  'snd-musicFill',  'snd-musicValDisplay',  'snd-sliderGroupMusic',  _modalState.musicSlider,  'music');
  _syncSlider('snd-sfxSlider',    'snd-sfxFill',    'snd-sfxValDisplay',    'snd-sliderGroupSfx',    _modalState.sfxSlider,    'sfx');

  _attachSlider('snd-masterSlider', 'snd-masterFill', 'snd-masterValDisplay', 'snd-sliderGroupMaster', 'master');
  _attachSlider('snd-musicSlider',  'snd-musicFill',  'snd-musicValDisplay',  'snd-sliderGroupMusic',  'music');
  _attachSlider('snd-sfxSlider',    'snd-sfxFill',    'snd-sfxValDisplay',    'snd-sliderGroupSfx',    'sfx');

  audio.setMasterVolume(_modalState.masterSlider / 100);
  audio.setMusicVolume(_modalState.musicSlider   / 100);
  audio.setSfxVolume?.(_modalState.sfxSlider     / 100);
}

function _attachSlider(sliderId, fillId, displayId, groupId, type) {
  const input = document.getElementById(sliderId);
  if (!input || input.dataset.sndBound === '1') return;
  input.dataset.sndBound = '1';

  input.addEventListener('input', () => {
    let val = parseInt(input.value, 10);
    if (Math.abs(val - _SNAP_POINT) <= _SNAP_ZONE) { val = _SNAP_POINT; input.value = val; }

    _syncSlider(sliderId, fillId, displayId, groupId, val, type);

    const realVal = val / 100;
    if (type === 'music')  { _modalState.musicSlider  = val; audio.setMusicVolume(realVal); }
    else if (type === 'sfx') { _modalState.sfxSlider  = val; audio.setSfxVolume?.(realVal); }
    else                   { _modalState.masterSlider = val; audio.setMasterVolume(realVal); }
  });
}

function _syncSlider(sliderId, fillId, displayId, groupId, val, type = 'master') {
  const input   = document.getElementById(sliderId);
  const fill    = document.getElementById(fillId);
  const display = document.getElementById(displayId);
  const group   = document.getElementById(groupId);
  if (!input) return;

  input.value = val;
  fill.style.width = `${(val / _SLIDER_MAX) * 100}%`;
  display.textContent = (val / 100).toFixed(2);
  group.classList.toggle('is-snapped', val === _SNAP_POINT);

  const above = val > 100;
  group.classList.toggle('is-above', above);
  group.classList.remove('snd-music-slider', 'snd-sfx-slider');
  if (above && type === 'music') group.classList.add('snd-music-slider');
  if (above && type === 'sfx')   group.classList.add('snd-sfx-slider');
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

    // Head
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

    // Variant section label
    const secLabel = document.createElement('div');
    secLabel.className = 'snd-sound-card__sec';
    secLabel.textContent = 'Variante ativa';
    card.appendChild(secLabel);

    // Variants (modal split into Open/Close)
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

    // Areas section
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
  const isActive = _modalState.selectedVariant[cat.id] === v.id;
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
  _modalState.selectedVariant[catId] = varId;

  // Atualiza o SFX_MAP global via audio-state (persiste no Firebase)
  // A categoria 'modal' controla openModal e closeModal separadamente.
  // Para as demais categorias, o id da categoria é a chave do mapa.
  if (catId !== 'modal') {
    audioState.setSfxMap(catId, varId);
  } else {
    // Para modal, a chave do mapa corresponde ao prefixo da variante
    if (varId.startsWith('open') || varId.startsWith('Open')) {
      audioState.setSfxMap('openModal', varId);
    } else {
      audioState.setSfxMap('closeModal', varId);
    }
  }

  const card = document.getElementById(`snd-sc-${catId}`);
  if (!card) return;
  card.querySelectorAll('.snd-variant-row').forEach(row => {
    row.classList.toggle('is-active', row.dataset.var === varId);
  });
}

function _triggerPreview(variant, btn) {
  if (!_modalState.masterEnabled) return;
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
    cat.areas.forEach(area => { _specificOverrides[cat.id][area] = null; });
    _modalState.selectedAreas[cat.id] = [...cat.areas];
    _renderSpecPanel(cat);
    _syncGeneralChips(cat.id);
    _syncSpecBtn(cat.id);
  });

  const body  = document.getElementById('snd-specPanelBody');
  const nAreas = cat.areas.length;

  const table = document.createElement('div');
  table.className = 'snd-spec-table';
  table.style.setProperty('--spec-cols', nAreas);

  // Header row
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

  // Default row + variant rows
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
  if (!_modalState.masterEnabled || !_modalState.musicEnabled) return;
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


/* ── Reset total ── */

function _resetAll() {
  audio.setMasterVolume(1.0);
  audio.setMusicVolume(0.4);
  audio.unmute();
  audio.setEnabled(true);

  _resetModalState();
  _closeSpecPanel();
  _stopMusic();

  const musicToggle = document.getElementById('snd-musicToggle');
  if (musicToggle) musicToggle.checked = true;

  _syncSlider('snd-masterSlider', 'snd-masterFill', 'snd-masterValDisplay', 'snd-sliderGroupMaster', _DEFAULT_MASTER, 'master');
  _syncSlider('snd-musicSlider',  'snd-musicFill',  'snd-musicValDisplay',  'snd-sliderGroupMusic',  _DEFAULT_MUSIC,  'music');
  _syncSlider('snd-sfxSlider',    'snd-sfxFill',    'snd-sfxValDisplay',    'snd-sliderGroupSfx',    _DEFAULT_SFX,    'sfx');

  // Rebind sliders (state reset, need to mark as unbound)
  ['snd-masterSlider', 'snd-musicSlider', 'snd-sfxSlider'].forEach(id => {
    const el = document.getElementById(id);
    if (el) delete el.dataset.sndBound;
  });
  _initSliders();

  _renderCards();
}


/* ═══════════════════════════════════════════════
   SEÇÃO C — INICIALIZAÇÃO E API PÚBLICA
═══════════════════════════════════════════════ */

let _initialized = false;

/**
 * API pública do módulo de som.
 *
 * Sound.init()        — inicializa botão flutuante + constrói DOM do modal
 * Sound.openModal()   — abre o modal de configuração
 * Sound.closeModal()  — fecha o modal
 */
const Sound = {

  /**
   * Inicializa o sistema de áudio:
   * - Monta o botão flutuante de volume (.abtn)
   * - Constrói o DOM do modal (uma única vez)
   *
   * Seguro chamar múltiplas vezes — idempotente.
   */
  init() {
    if (_initialized) return;
    _initialized = true;

    _mountAudioBtn();
    _buildModalDOM();
  },

  /**
   * Abre o modal de configuração de som.
   * Chame isso no onClick do botão de áudio nas configurações do projeto.
   */
  openModal() {
    if (!_initialized) this.init();
    _openModal();
  },

  /**
   * Fecha o modal (para integração externa).
   */
  closeModal() {
    _closeModal();
  },
};

export default Sound;