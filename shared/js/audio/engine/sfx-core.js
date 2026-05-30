// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/engine/sfx-core.js
   Núcleo do sistema de áudio
   ─────────────────────────────────────────────
   Responsabilidades:
   ✅ AudioContext (criação, resume, warmup)
   ✅ Gain nodes por canal (master / sfx / music)
   ✅ Primitivas de som (_tone, _seq)
   ✅ BGM engine (_bgmEngine)
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
  musicVolume:  0.5,
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

function _resumeCtx() {
  if (!_ctx || _ctx.state !== 'suspended') return;
  _ctx.resume().then(() => {
    _getGains();
    _syncGains();
    _warmup();
    _dbg('AudioContext resumed por gesto do usuário, state:', _ctx.state);
  }).catch(() => {});
}

function _installResumeListener() {
  const EVENTS = ['click', 'pointerdown', 'touchstart', 'keydown'];

  function _onGesture() {
    _resumeCtx();
    EVENTS.forEach(ev =>
      document.removeEventListener(ev, _onGesture, { capture: true })
    );
  }

  EVENTS.forEach(ev =>
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
let _musicGain  = null;

function _getGains() {
  if (!_isCtxReady()) return null;

  if (!_masterGain) {
    _masterGain = _ctx.createGain();
    _sfxGain    = _ctx.createGain();
    _musicGain  = _ctx.createGain();

    _sfxGain.connect(_masterGain);
    _musicGain.connect(_masterGain);
    _masterGain.connect(_ctx.destination);

    _syncGains();
  }

  return { master: _masterGain, sfx: _sfxGain, music: _musicGain };
}

function _syncGains() {
  if (!_masterGain) return;
  const muted = _state.muted || !_state.enabled;
  _masterGain.gain.value = muted ? 0 : _state.masterVolume;
  _sfxGain.gain.value    = _state.sfxVolume;
  _musicGain.gain.value  = _state.musicVolume;
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
   5. SISTEMA DE MÚSICA / BGM
═══════════════════════════════════════════════ */

let _currentBgm = null;

export const bgmEngine = {
  stop(fadeTime = 0.5) {
    if (!_currentBgm) return;
    const { nodes } = _currentBgm;

    if (fadeTime > 0 && _musicGain && _isCtxReady()) {
      const t = _ctx.currentTime;
      _musicGain.gain.setValueAtTime(_musicGain.gain.value, t);
      _musicGain.gain.linearRampToValueAtTime(0, t + fadeTime);
      setTimeout(() => {
        nodes.forEach(n => { try { n.stop(); } catch (_) {} });
        _musicGain.gain.value = _state.musicVolume;
        _currentBgm = null;
      }, fadeTime * 1000 + 50);
    } else {
      nodes.forEach(n => { try { n.stop(); } catch (_) {} });
      _currentBgm = null;
    }
  },

  play(id, buildFn) {
    if (!_state.enabled || _state.muted) return;
    if (!_isCtxReady()) return;
    if (_currentBgm?.id === id) return;

    this.stop(0.3);

    setTimeout(() => {
      if (!_isCtxReady()) return;
      _getGains();
      const nodes = buildFn(_ctx, _musicGain);
      _currentBgm = { id, nodes: Array.isArray(nodes) ? nodes : [nodes] };
    }, _currentBgm ? 350 : 0);
  },

  playUrl(id, url) {
    if (!_state.enabled || _state.muted) return;
    if (_currentBgm?.id === id) return;

    this.stop(0.3);

    setTimeout(() => {
      const el = new Audio(url);
      el.loop   = true;
      el.volume = _state.musicVolume * _state.masterVolume;
      el.play().catch(() => {});

      _currentBgm = {
        id,
        nodes: [],
        _el: el,
        stop: () => { el.pause(); el.currentTime = 0; },
      };
    }, _currentBgm ? 350 : 0);
  },

  currentId() {
    return _currentBgm?.id ?? null;
  },

  // Expõe _currentBgm para uso interno do catálogo de BGM
  getCurrent() { return _currentBgm; },
};

/* ═══════════════════════════════════════════════
   9. API PRINCIPAL (export default)
   Montada após o catálogo ser registrado via
   audio.init(catalog) — chamado por sfx.js.
═══════════════════════════════════════════════ */

const audio = {

  catalog: [],

  sfx: null,    // Proxy preenchido em init()
  music: null,  // Proxy preenchido em init()

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

    // Índice Music
    const _musicMap = {};
    catalog.filter(e => e.type === 'music').forEach(e => { _musicMap[e.id] = e; });

    this.music = new Proxy({
      stop:      (fade) => bgmEngine.stop(fade),
      currentId: ()     => bgmEngine.currentId(),
    }, {
      get(target, key) {
        if (key in target) return target[key];
        const entry =
          _musicMap[key] ||
          _musicMap[`music-${key}`] ||
          Object.values(_musicMap).find(e => e.label === key);
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

  setMusicVolume(val) {
    _state.musicVolume = Math.min(1.5, Math.max(0, Number(val) || 0));
    _syncGains();
  },

  getMasterVolume() { return _state.masterVolume; },
  getSfxVolume()    { return _state.sfxVolume; },
  getMusicVolume()  { return _state.musicVolume; },

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

  stopAll() { bgmEngine.stop(0); },

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
   */
  resumeCtx() {
    _masterGain = null;
    _sfxGain    = null;
    _musicGain  = null;
    _resumeCtx();
    _installResumeListener();
  },

};

export default audio;