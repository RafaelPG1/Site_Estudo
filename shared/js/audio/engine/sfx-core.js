// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/engine/sfx-core.js
   Núcleo do sistema de áudio
   ─────────────────────────────────────────────
   Responsabilidades:
   ✅ AudioContext (criação, resume, warmup)
   ✅ Gain nodes por canal (master / sfx)
   ✅ Primitivas de som (_tone, _seq)
   ✅ API pública (export default audio)
   ✅ Catálogo via sfx-catalog.js (injetado em init)

   ❌ Catálogo de sons (→ sfx-catalog.js)
   ❌ Estado de modo (→ state/audio-state.js)
   ❌ Persistência Firebase (→ state/audio-state.js)
   ============================================= */

/* ═══════════════════════════════════════════════
   1. ESTADO GLOBAL — somente em memória
═══════════════════════════════════════════════ */

const _DEFAULT_SFX_STATE = {
  enabled:      true,
  muted:        false,
  masterVolume: 1.0,
  sfxVolume:    0.5,
};

const _state = { ..._DEFAULT_SFX_STATE };

/* ═══════════════════════════════════════════════
   1b. DEBUG FLAG
═══════════════════════════════════════════════ */

const DEBUG_AUDIO = false;
const _dbg = DEBUG_AUDIO ? (...a) => console.log('[sfx]', ...a) : () => {};

/* ═══════════════════════════════════════════════
   2. CONTEXTO DE ÁUDIO — EAGER + RESUME POR GESTO
═══════════════════════════════════════════════ */

let _ctx = null;

function _isCtxReady() {
  return !!_ctx && _ctx.state === 'running';
}

// Lista de eventos considerados gestos válidos pelo browser
const _VALID_GESTURE_EVENTS = ['click', 'pointerdown', 'touchstart', 'keydown'];

function _resumeCtx() {
  if (!_ctx || _ctx.state !== 'suspended') return;
  _ctx.resume().then(() => {
    _getGains();
    _syncGains();
    _warmup();
    document.dispatchEvent(new CustomEvent('nexus:audioUnlocked'));
  }).catch(() => {});
}

function _installResumeListener() {
  function _onGesture() {
    _resumeCtx();
    _VALID_GESTURE_EVENTS.forEach(ev =>
      document.removeEventListener(ev, _onGesture, { capture: true })
    );
  }

  _VALID_GESTURE_EVENTS.forEach(ev =>
    document.addEventListener(ev, _onGesture, { capture: true, passive: true })
  );
}

function _warmup() {
  if (!_isCtxReady() || !_masterGain) return;
  try {
    const osc = _ctx.createOscillator();
    const g   = _ctx.createGain();
    g.gain.value = 0;
    osc.connect(g);
    g.connect(_masterGain);
    osc.start(_ctx.currentTime);
    osc.stop(_ctx.currentTime + 0.001);
    _dbg('warmup executado');
  } catch (_) {}
}

/* ═══════════════════════════════════════════════
   3. NÓS DE GANHO (gain nodes por canal)
   IMPORTANTE: declarados ANTES do bloco try abaixo
   para evitar ReferenceError de hoisting com let.
═══════════════════════════════════════════════ */

let _masterGain = null;
let _sfxGain    = null;

function _getGains() {
  if (!_isCtxReady()) return null;

  if (!_masterGain) {
    _masterGain = _ctx.createGain();
    _sfxGain    = _ctx.createGain();

    _sfxGain.connect(_masterGain);
    _masterGain.connect(_ctx.destination);

    _syncGains();
  }

  return { master: _masterGain, sfx: _sfxGain };
}

function _syncGains() {
  if (!_masterGain) return;
  const muted = _state.muted || !_state.enabled;
  _masterGain.gain.value = muted ? 0 : _state.masterVolume;
  _sfxGain.gain.value    = _state.sfxVolume;
}

// Cria o AudioContext imediatamente.
try {
  _ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (_ctx.state === 'running') {
    _getGains();
    _warmup();
    _dbg('AudioContext nasceu running');
  } else {
    _dbg('AudioContext suspended — aguardando gesto para resume()');
    _installResumeListener();
  }
} catch (err) {
  console.error('[sfx] AudioContext não suportado:', err);
}

/* ═══════════════════════════════════════════════
   4. PRIMITIVAS DE SOM — exportadas para sfx-catalog.js
═══════════════════════════════════════════════ */

export function tone({
  freq,
  freqEnd,
  duration,
  attack  = 0.005,
  decay,
  sustain = 0,
  type    = 'sine',
  volume  = 1,
}) {
  if (!_state.enabled || _state.muted) return;
  if (!_isCtxReady()) return;

  const ctx    = _ctx;
  const gains  = _getGains();
  if (!gains) return;
  const decayT = decay ?? duration * 0.3;
  const t      = ctx.currentTime + 0.005;

  const osc      = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(gains.sfx);

  osc.type            = type;
  osc.frequency.value = freq;

  if (freqEnd !== undefined && freqEnd !== freq) {
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.linearRampToValueAtTime(freqEnd, t + duration);
  }

  gainNode.gain.setValueAtTime(0, t);
  gainNode.gain.linearRampToValueAtTime(volume, t + attack);
  gainNode.gain.linearRampToValueAtTime(sustain * volume, t + attack + decayT);
  gainNode.gain.linearRampToValueAtTime(0, t + duration);

  osc.start(t);
  osc.stop(t + duration + 0.01);
}

export function seq(notes) {
  if (!_state.enabled || _state.muted) return;
  if (!_isCtxReady()) return;
  notes.forEach(({ delay = 0, ...rest }) => {
    setTimeout(() => tone(rest), delay * 1000);
  });
}

export function getCtx()   { return _ctx; }
export function getGains() { return _getGains(); }
export function isCtxReady() { return _isCtxReady(); }
export function getState()   { return _state; }

/* ═══════════════════════════════════════════════
   9. API PRINCIPAL (export default)
   Montada após o catálogo ser registrado via
   audio.init(catalog) — chamado por sfx.js.
═══════════════════════════════════════════════ */

const audio = {

  catalog: [],

  sfx: null,    // Proxy preenchido em init()

  /**
   * Registra o catálogo e constrói os Proxies de acesso.
   * Chamado por sfx.js logo após importar o catálogo.
   * @param {Array} catalog
   */
  init(catalog) {
    this.catalog = catalog;

    // Índice SFX
    const _sfxMap = {};
    catalog.filter(e => e.type === 'sfx').forEach(e => { _sfxMap[e.id] = e; });

    this.sfx = new Proxy({}, {
      get(_, id) {
        const entry = _sfxMap[id];
        if (entry) return () => entry.fn.call(entry);
        return undefined;
      },
    });

    // Índice de eventos
    const _eventMap = {};
    catalog
      .filter(e => e.type === 'sfx' && e.event)
      .forEach(e => {
        if (!_eventMap[e.event]) _eventMap[e.event] = [];
        _eventMap[e.event].push(e);
      });

    this.playEvent = function(eventName, { variant } = {}) {
      const entries = _eventMap[eventName];
      if (!entries || entries.length === 0) {
        console.warn(`[audio] playEvent: evento "${eventName}" não encontrado no catálogo.`);
        return;
      }
      let entry;
      if (variant) {
        entry = entries.find(e => e.id === variant) ?? entries[Math.floor(Math.random() * entries.length)];
      } else {
        entry = entries[Math.floor(Math.random() * entries.length)];
      }
      entry.fn.call(entry);
    };
  },

  playEvent() { console.warn('[sfx] playEvent chamado antes de init()'); },

  setMasterVolume(val) {
    _state.masterVolume = Math.min(1.5, Math.max(0, Number(val) || 0));
    _syncGains();
  },

  setSfxVolume(val) {
    _state.sfxVolume = Math.min(1.5, Math.max(0, Number(val) || 0));
    _syncGains();
  },

  getMasterVolume() { return _state.masterVolume; },
  getSfxVolume()    { return _state.sfxVolume; },

  setEnabled(bool) {
    _state.enabled = !!bool;
    _syncGains();
  },

  isEnabled() { return _state.enabled; },

  mute() {
    _state.muted = true;
    _syncGains();
  },

  unmute() {
    _state.muted = false;
    _syncGains();
  },

  isMuted() { return _state.muted; },

  stopAll() {},

  fadeOut(duration = 1) {
    if (!_masterGain || !_isCtxReady()) return;
    const t = _ctx.currentTime;
    _masterGain.gain.setValueAtTime(_masterGain.gain.value, t);
    _masterGain.gain.linearRampToValueAtTime(0, t + duration);
  },

  fadeIn(duration = 1) {
    if (!_masterGain || !_isCtxReady()) return;
    const t = _ctx.currentTime;
    _masterGain.gain.setValueAtTime(0, t);
    _masterGain.gain.linearRampToValueAtTime(_state.masterVolume, t + duration);
  },

  resetToDefaults() {
    Object.assign(_state, { ..._DEFAULT_SFX_STATE });
    _syncGains();
  },

  getState() { return { ..._state }; },

  isUnlocked() {
    return _isCtxReady();
  },

  /**
   * Tenta resumir o AudioContext suspenso e reinstala o listener de gesto.
   * Chamado pelo audio-recovery.js após restauração do bfcache (pageshow persisted).
   * Não chama ctx.resume() diretamente — apenas recria os gain nodes (se null)
   * e reinstala o listener de gesto válido para que o próximo click/keydown
   * dispare o resume.
   */
  resumeCtx() {
    _masterGain = null;
    _sfxGain    = null;
    _installResumeListener();
  },

};

export default audio;