// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/state/audio-state.js
   Estado global de áudio — fonte única de verdade
   Versão 1.6  ← corrige reset indevido no loginSuccess

   MUDANÇAS v1.5 → v1.6
   ─────────────────────────────────────────────
   PROBLEMA CORRIGIDO:
     nexus:loginSuccess apagava _currentMode, _currentMusicMode e
     volumes ANTES do Firebase responder, chamando:
       _currentMode = DEFAULT_MODE;
       audio.resetToDefaults();      ← RAIZ DO BUG
       _applyToEngine(_currentMode);
       _notify();
     Isso sobrescrevia as escolhas do usuário (LOW, MUTE) com 'normal'
     durante o processo de desbloqueio/login, que pode chegar antes do Firebase.

   FIX:
     - Removidas as três linhas acima do nexus:loginSuccess handler.
     - O estado anterior é PRESERVADO durante o carregamento do Firebase.
     - _applyLoadedState() é chamado apenas APÓS o Firebase responder.
     - audio.resetToDefaults() movido para nexus:logout (onde faz sentido).
     - _applyToEngine agora recebe o musicMode como segundo parâmetro e
       aplica o volume de música RESPEITANDO o modo do botão de música,
       em vez de sobrescrever com _volumes.music cegamente.

   REGRA DE OURO:
     O desbloqueio do AudioContext (nexus:audioUnlocked, clique físico,
     pageshow persisted) NÃO deve alterar nenhuma configuração do usuário.
     Só deve permitir a reprodução de áudio com os volumes JÁ definidos.

   ============================================= */

import audio from '../engine/sfx.js';
import { carregarConfigs, salvarConfigs } from '../../../../src/firebase.js';
import { AUDIO_DEFAULTS } from '../../../../src/global.js';

/* ═══════════════════════════════════════════════
   INSTRUMENTAÇÃO DE PERFORMANCE
═══════════════════════════════════════════════ */
const _perf = window.__audioPerf = {
  moduleLoad:        performance.now(),
  sfxReadyInitial:   null,
  loginSuccessStart: null,
  firebaseStart:     null,
  firebaseEnd:       null,
  sfxReadyTrue:      null,
  flushQueue:        null,
  report() {
    const p = window.__audioPerf;
    const lines = [
      '╔══════════════════════════════════════════',
      '║  AUDIO PERF REPORT',
      '╠══════════════════════════════════════════',
      `║  módulo carregado:         ${p.moduleLoad?.toFixed(2)} ms`,
      `║  sfxReady inicial (true):  ${p.sfxReadyInitial?.toFixed(2)} ms`,
      `║  loginSuccess recebido:    ${p.loginSuccessStart?.toFixed(2)} ms`,
      `║  Firebase read start:      ${p.firebaseStart?.toFixed(2)} ms`,
      `║  Firebase read end:        ${p.firebaseEnd?.toFixed(2)} ms`,
      `║  Firebase RTT:             ${p.firebaseStart != null && p.firebaseEnd != null ? (p.firebaseEnd - p.firebaseStart).toFixed(2) + ' ms' : 'N/A'}`,
      `║  sfxReady = true:          ${p.sfxReadyTrue?.toFixed(2)} ms`,
      `║  flushQueue:               ${p.flushQueue?.toFixed(2)} ms`,
      `║  total login→ready:        ${p.loginSuccessStart != null && p.sfxReadyTrue != null ? (p.sfxReadyTrue - p.loginSuccessStart).toFixed(2) + ' ms' : 'N/A'}`,
      '╚══════════════════════════════════════════',
    ];
    console.log(lines.join('\n'));
  },
};

/* ═══════════════════════════════════════════════
   DEBUG FLAG
═══════════════════════════════════════════════ */
const _DEBUG = false;
const _dbg   = _DEBUG ? (...a) => console.log('[audio-state]', ...a) : () => {};

/* ═══════════════════════════════════════════════
   DEBOUNCE DE PERSISTÊNCIA
═══════════════════════════════════════════════ */
let _persistTimer = null;

function _schedulePersist() {
  if (_persistTimer) clearTimeout(_persistTimer);
  _persistTimer = setTimeout(() => {
    _persistTimer = null;
    _persistAllToFirebaseNow();
  }, 800);
}

/* ═══════════════════════════════════════════════
   1. DEFINIÇÃO DOS MODOS
═══════════════════════════════════════════════ */

const MODES = {
  normal: { muted: false },
  low:    { muted: false },
  mute:   { muted: true  },
};

const DEFAULT_MODE = AUDIO_DEFAULTS.sfxMode;

const VALID_MODES = Object.keys(MODES);

/* ═══════════════════════════════════════════════
   1b. SFX_MAP
═══════════════════════════════════════════════ */

const DEFAULT_SFX_MAP = AUDIO_DEFAULTS.sfxMap;

let _currentSfxMap = { ...DEFAULT_SFX_MAP };

/* ═══════════════════════════════════════════════
   1c. SFX_AREA_MAP
═══════════════════════════════════════════════ */

let _currentSfxAreaMap = {};

/* ═══════════════════════════════════════════════
   1d. FILA DE SFX
═══════════════════════════════════════════════ */

let _sfxReady = true;
_perf.sfxReadyInitial = performance.now();

let _readyResolve;
let _readyPromise = new Promise(res => { _readyResolve = res; });
_readyResolve(); // visitante: já está pronto

function _resetReadyPromise() {
  _readyPromise = new Promise(res => { _readyResolve = res; });
}

const _sfxQueue = [];

function _flushSfxQueue() {
  if (!_sfxQueue.length) return;

  const deduped = [];
  const hoverSeen = new Set();

  for (let i = _sfxQueue.length - 1; i >= 0; i--) {
    const item = _sfxQueue[i];
    if (item.event === 'hover') {
      const key = item.area ?? '__global__';
      if (!hoverSeen.has(key)) {
        hoverSeen.add(key);
        deduped.unshift(item);
      }
    } else {
      deduped.unshift(item);
    }
  }

  _sfxQueue.length = 0;

  for (const { event, area } of deduped) {
    const variantId = _resolveVariant(event, area);
    if (variantId) {
      audio.sfx[variantId]?.();
    } else {
      _dbg('_flushSfxQueue: evento "' + event + '" não encontrado no SFX_MAP.');
    }
  }
}

/* ═══════════════════════════════════════════════
   1e. RESOLUÇÃO INTERNA DE VARIANTE
═══════════════════════════════════════════════ */

function _resolveVariant(action, area) {
  if (area) {
    const normalizedArea = area.toLowerCase();
    const areaOverride   = _currentSfxAreaMap[normalizedArea]?.[action];
    if (areaOverride) return areaOverride;
  }
  return _currentSfxMap[action];
}

/* ═══════════════════════════════════════════════
   2. ESTADO EM MEMÓRIA
═══════════════════════════════════════════════ */

let _currentMode = (() => {
  try {
    const saved = localStorage.getItem('nexus_sfx_mode');
    return VALID_MODES.includes(saved) ? saved : AUDIO_DEFAULTS.sfxMode;
  } catch { return AUDIO_DEFAULTS.sfxMode; }
})();

const VALID_MUSIC_MODES = ['normal', 'mute', 'low'];
let _currentMusicMode = (() => {
  try { return localStorage.getItem('nexus_music_mode') || AUDIO_DEFAULTS.musicMode; } catch { return AUDIO_DEFAULTS.musicMode; }
})();
if (!VALID_MUSIC_MODES.includes(_currentMusicMode)) _currentMusicMode = AUDIO_DEFAULTS.musicMode;

const _musicModeSubscribers = new Set();

function _notifyMusicMode() {
  for (const fn of _musicModeSubscribers) {
    try { fn(_currentMusicMode); } catch (err) {
      console.warn('[audio-state] musicMode subscriber error:', err);
    }
  }
}

/* ═══════════════════════════════════════════════
   2a-bis. VISIBILIDADE DOS BOTÕES FLUTUANTES (SFX / MÚSICA)
   ─────────────────────────────────────────────
   Controla se o botão flutuante aparece na tela e se o
   canal correspondente fica audível.

   - SFX desativado    → botão some + audio.mute() (via _applyToEngine)
   - Música desativada → botão some + audio.setMusicVolume(0)

   Persistido apenas em localStorage (preferência local de UI,
   não sincronizada via Firebase).
═══════════════════════════════════════════════ */

let _sfxBtnEnabled = (() => {
  try {
    const v = localStorage.getItem('nexus_sfx_btn_enabled');
    return v === null ? AUDIO_DEFAULTS.sfxBtnEnabled : v === 'true';
  } catch { return AUDIO_DEFAULTS.sfxBtnEnabled; }
})();

let _musicBtnEnabled = (() => {
  try {
    const v = localStorage.getItem('nexus_music_btn_enabled');
    return v === null ? AUDIO_DEFAULTS.musicBtnEnabled : v === 'true';
  } catch { return AUDIO_DEFAULTS.musicBtnEnabled; }
})();

const _sfxBtnSubscribers   = new Set();
const _musicBtnSubscribers = new Set();

function _notifySfxBtnEnabled() {
  for (const fn of _sfxBtnSubscribers) {
    try { fn(_sfxBtnEnabled); } catch (err) {
      console.warn('[audio-state] sfxBtnEnabled subscriber error:', err);
    }
  }
}

function _notifyMusicBtnEnabled() {
  for (const fn of _musicBtnSubscribers) {
    try { fn(_musicBtnEnabled); } catch (err) {
      console.warn('[audio-state] musicBtnEnabled subscriber error:', err);
    }
  }
}

let _volumes = { ...AUDIO_DEFAULTS.volumes };

/* ═══════════════════════════════════════════════
   2b. UID INTERNO
═══════════════════════════════════════════════ */

let _currentUid = null;

/* ═══════════════════════════════════════════════
   2c. CONTROLE DE RACE CONDITION
═══════════════════════════════════════════════ */

let _activeLoadToken = 0;

/* ═══════════════════════════════════════════════
   3. SISTEMA DE SUBSCRIBERS
═══════════════════════════════════════════════ */

const _subscribers = new Set();

function _notify() {
  for (const fn of _subscribers) {
    try { fn(_currentMode); } catch (err) {
      console.warn('[audio-state] subscriber error:', err);
    }
  }
}

/* ═══════════════════════════════════════════════
   4. APLICAÇÃO NO sfx.js

   REGRA FUNDAMENTAL:
   _applyToEngine NÃO toca em musicVolume.
   O volume de música é controlado EXCLUSIVAMENTE pelo botão de música
   (audio-btns.js) via _musicApplyToEngine → audio.setMusicVolume().

   Se _applyToEngine sobrescrevesse musicVolume, um loginSuccess ou
   qualquer mudança no modo SFX resetaria o volume da música para
   _volumes.music, ignorando o modo do botão (LOW = 0.25, MUTE = 0).

   Volumes por canal:
     master → controlado pelo modo SFX (normal/low/mute)
     sfx    → controlado pelo slider de SFX no modal
     music  → controlado pelo botão de música (audio-btns.js)
═══════════════════════════════════════════════ */

function _applyToEngine(modeId) {
  const mode = MODES[modeId] ?? MODES[DEFAULT_MODE];
  if (mode.muted || !_sfxBtnEnabled) {
    // mode.muted (botão SFX no ciclo MUTE) OU _sfxBtnEnabled=false
    // (usuário desativou efeitos sonoros nas Configurações) → silencia.
    audio.setMasterVolume(0);
    audio.mute();
  } else {
    audio.unmute();
    audio.setMasterVolume(_volumes.master);
  }
  // SFX volume — controlado pelo slider
  audio.setSfxVolume?.(_volumes.sfx);
  // NOTA: audio.setMusicVolume NÃO é chamado aqui.
  // O botão de música (audio-btns.js) é o único responsável pelo canal music.
  _dbg('_applyToEngine mode:', modeId, '| master:', _volumes.master, '| sfx:', _volumes.sfx, '| sfxBtnEnabled:', _sfxBtnEnabled);
}

/* ═══════════════════════════════════════════════
   5. PERSISTÊNCIA — Firebase
═══════════════════════════════════════════════ */

/**
 * Aplica estado carregado do Firebase ao estado em memória e na engine.
 *
 * IMPORTANTE: NÃO chama audio.resetToDefaults().
 * Os volumes e modos são aplicados individualmente para não sobrescrever
 * o estado do canal de música (controlado pelo botão de música).
 */
function _applyLoadedState(saved) {
  _currentMode = saved.mode ?? DEFAULT_MODE;

  if (saved.musicMode && VALID_MUSIC_MODES.includes(saved.musicMode)) {
    _currentMusicMode = saved.musicMode;
    try { localStorage.setItem('nexus_music_mode', _currentMusicMode); } catch { /* noop */ }
    _notifyMusicMode();
  }

  if (saved.sfxMap) {
    const sanitized = {};
    for (const [action, variantId] of Object.entries(saved.sfxMap)) {
      if (audio.sfx[variantId] !== undefined) {
        sanitized[action] = variantId;
      } else {
        console.warn(
          `[audio-state] sfxMap do Firebase ignorado: "${action}" → "${variantId}" ` +
          `não existe no catálogo. Usando padrão: "${DEFAULT_SFX_MAP[action]}".`
        );
      }
    }
    _currentSfxMap = { ...DEFAULT_SFX_MAP, ...sanitized };
  } else {
    _currentSfxMap = { ...DEFAULT_SFX_MAP };
  }

  _currentSfxAreaMap = saved.areaMap ? { ...saved.areaMap } : {};

  if (saved.volumes) {
    _volumes.master = typeof saved.volumes.master === 'number' ? saved.volumes.master : 1.0;
    _volumes.music  = typeof saved.volumes.music  === 'number' ? saved.volumes.music  : 0.5;
    _volumes.sfx    = typeof saved.volumes.sfx    === 'number' ? saved.volumes.sfx    : 0.5;
    _dbg('volumes carregados:', _volumes);
  }

  // Aplica SFX volume diretamente (sem tocar no music — botão de música cuida disso)
  audio.setSfxVolume?.(_volumes.sfx);

  // Restaura visibilidade dos botões flutuantes (SFX / Música) se o Firebase tiver os valores.
  // Sem isso, navegar entre páginas resetava os flags para o default (musicBtnEnabled=false)
  // porque o loginSuccess bootstrap reconstruía o estado sem esses campos.
  if (typeof saved.sfxBtnEnabled === 'boolean') {
    _sfxBtnEnabled = saved.sfxBtnEnabled;
    try { localStorage.setItem('nexus_sfx_btn_enabled', String(_sfxBtnEnabled)); } catch { /* noop */ }
    _notifySfxBtnEnabled();
  }
  if (typeof saved.musicBtnEnabled === 'boolean') {
    _musicBtnEnabled = saved.musicBtnEnabled;
    try { localStorage.setItem('nexus_music_btn_enabled', String(_musicBtnEnabled)); } catch { /* noop */ }
    _notifyMusicBtnEnabled();
  }

  // Aplica o modo SFX (master + mute/unmute) mas NÃO sobrescreve music
  _applyToEngine(_currentMode);
  _notify();

  // O musicMode chega via subscribeMusicMode → _musicApplyToEngine em audio-btns.js
  // _notifyMusicMode() já foi chamado acima quando saved.musicMode existia.
  // Se não havia musicMode salvo, o botão de música mantém o estado atual (localStorage).
}

async function _fetchFromFirebase(uid) {
  try {
    _perf.firebaseStart = performance.now();
    const configs      = await carregarConfigs(uid);
    _perf.firebaseEnd  = performance.now();
    const saved        = configs?.audioState;
    const savedMusicMode = configs?.musicMode ?? null;
    const savedSfxMap  = configs?.sfxMap     ?? null;
    const savedAreaMap = configs?.sfxAreaMap ?? null;
    const savedVolumes = configs?.volumes    ?? null;
    const savedSfxBtnEnabled   = typeof configs?.sfxBtnEnabled   === 'boolean' ? configs.sfxBtnEnabled   : null;
    const savedMusicBtnEnabled = typeof configs?.musicBtnEnabled === 'boolean' ? configs.musicBtnEnabled : null;

    _dbg('_fetchFromFirebase: uid="' + uid + '" sfxMap=', savedSfxMap, 'sfxAreaMap=', savedAreaMap);

    return {
      mode:            VALID_MODES.includes(saved) ? saved : null,
      musicMode:       VALID_MUSIC_MODES.includes(savedMusicMode) ? savedMusicMode : null,
      sfxMap:          savedSfxMap  && typeof savedSfxMap  === 'object' ? savedSfxMap  : null,
      areaMap:         savedAreaMap && typeof savedAreaMap === 'object' ? savedAreaMap : null,
      volumes:         savedVolumes && typeof savedVolumes === 'object' ? savedVolumes : null,
      sfxBtnEnabled:   savedSfxBtnEnabled,
      musicBtnEnabled: savedMusicBtnEnabled,
    };
  } catch (err) {
    _dbg('Erro ao carregar Firebase:', err);
    return { mode: null, sfxMap: null, areaMap: null, sfxBtnEnabled: null, musicBtnEnabled: null };
  }
}

async function _persistAllToFirebaseNow() {
  if (!_currentUid) return;
  const uid = _currentUid;

  const modeSnap           = _currentMode;
  const musicModeSnap      = _currentMusicMode;
  const sfxSnap            = { ..._currentSfxMap };
  const areaSnap           = {};
  for (const [k, v] of Object.entries(_currentSfxAreaMap)) areaSnap[k] = { ...v };
  const volSnap            = { ..._volumes };
  const sfxBtnEnabledSnap  = _sfxBtnEnabled;
  const musicBtnEnabledSnap = _musicBtnEnabled;

  try {
    const { getConfigs } = await import('../../../../src/global.js');
    const configsAtuais  = getConfigs();
    const { audioState: _d1, sfxMap: _d2, sfxAreaMap: _d3, volumes: _d4, musicMode: _d5, sfxBtnEnabled: _d6, musicBtnEnabled: _d7, ...restConfigs } = configsAtuais;
    const payload = { ...restConfigs, audioState: modeSnap, musicMode: musicModeSnap, sfxMap: sfxSnap, sfxAreaMap: areaSnap, volumes: volSnap, sfxBtnEnabled: sfxBtnEnabledSnap, musicBtnEnabled: musicBtnEnabledSnap };
    _dbg('persistindo →', modeSnap, musicModeSnap, volSnap, 'sfxBtn:', sfxBtnEnabledSnap, 'musicBtn:', musicBtnEnabledSnap);
    await salvarConfigs(uid, payload);
  } catch (_) {
    try {
      await salvarConfigs(uid, { audioState: modeSnap, musicMode: musicModeSnap, sfxMap: sfxSnap, sfxAreaMap: areaSnap, volumes: volSnap, sfxBtnEnabled: sfxBtnEnabledSnap, musicBtnEnabled: musicBtnEnabledSnap });
    } catch (err) {
      _dbg('Erro ao salvar Firebase:', err);
    }
  }
}

function _persistAllToFirebase() {
  _schedulePersist();
}

/* ═══════════════════════════════════════════════
   6. LISTENERS DE AUTH
═══════════════════════════════════════════════ */

document.addEventListener('nexus:loginSuccess', async ({ detail }) => {
  const uid = detail?.uid;
  _dbg('loginSuccess recebido:', uid);
  if (!uid) return;

  _currentUid = uid;
  const token = ++_activeLoadToken;
  _perf.loginSuccessStart = performance.now();

  // FIX v1.6: NÃO resetamos _currentMode nem chamamos audio.resetToDefaults() aqui.
  // O estado do usuário (LOW, MUTE) deve ser PRESERVADO durante o carregamento do Firebase.
  // Se o usuário estava em LOW antes do login, o áudio continua em LOW enquanto o Firebase
  // carrega. _applyLoadedState() aplicará o estado correto quando o Firebase responder.
  _sfxReady = false;
  _resetReadyPromise();

  // FIX v1.6: Sem _currentMode = DEFAULT_MODE, sem audio.resetToDefaults(),
  // sem _applyToEngine, sem _notify aqui. O estado ATUAL é mantido.

  let saved;
  if (detail?.configs) {
    const c = detail.configs;
    const savedMode      = c?.audioState;
    const savedMusicMode = c?.musicMode   ?? null;
    const savedSfxMap    = c?.sfxMap      ?? null;
    const savedAreaMap   = c?.sfxAreaMap  ?? null;
    const savedVolumes   = c?.volumes     ?? null;
    const savedSfxBtnEnabled   = typeof c?.sfxBtnEnabled   === 'boolean' ? c.sfxBtnEnabled   : null;
    const savedMusicBtnEnabled = typeof c?.musicBtnEnabled === 'boolean' ? c.musicBtnEnabled : null;
    _dbg('loginSuccess: usando configs do detail (sem round-trip Firebase)', { savedMode, savedSfxMap });
    saved = {
      mode:            VALID_MODES.includes(savedMode) ? savedMode : null,
      musicMode:       VALID_MUSIC_MODES.includes(savedMusicMode) ? savedMusicMode : null,
      sfxMap:          savedSfxMap  && typeof savedSfxMap  === 'object' ? savedSfxMap  : null,
      areaMap:         savedAreaMap && typeof savedAreaMap === 'object' ? savedAreaMap : null,
      volumes:         savedVolumes && typeof savedVolumes === 'object' ? savedVolumes : null,
      sfxBtnEnabled:   savedSfxBtnEnabled,
      musicBtnEnabled: savedMusicBtnEnabled,
    };
  } else {
    _dbg('loginSuccess: detail sem configs, fazendo _fetchFromFirebase (fallback)');
    saved = await _fetchFromFirebase(uid);
  }

  if (token !== _activeLoadToken) {
    _dbg('resposta antiga descartada (uid="' + uid + '", token=' + token + ')');
    return;
  }

  _applyLoadedState(saved);
  _dbg('volumes carregados do Firebase (loginSuccess):', _volumes);

  _sfxReady = true;
  _perf.sfxReadyTrue = performance.now();
  _readyResolve();
  _perf.flushQueue = performance.now();
  _flushSfxQueue();

  _dbg('uid="' + uid + '" → modo="' + _currentMode + '"', saved.mode !== null ? '(Firebase)' : '(padrão)');
  _dbg('sfxAreaMap hidratado:', _currentSfxAreaMap);
});

document.addEventListener('nexus:logout', () => {
  if (_persistTimer) { clearTimeout(_persistTimer); _persistTimer = null; }

  _currentUid        = null;
  _activeLoadToken++;

  // No logout SIM resetamos — o usuário saiu, estado volta ao padrão
  _currentMode       = AUDIO_DEFAULTS.sfxMode;
  _currentMusicMode  = AUDIO_DEFAULTS.musicMode;
  _currentSfxMap     = { ...DEFAULT_SFX_MAP };
  _currentSfxAreaMap = {};

  // Aqui sim usamos resetToDefaults() porque o usuário saiu explicitamente
  audio.resetToDefaults();
  _applyToEngine(_currentMode);
  _notify();
  _notifyMusicMode();

  _sfxQueue.length = 0;
  _sfxReady = true;

  try { localStorage.setItem('nexus_music_mode', AUDIO_DEFAULTS.musicMode); } catch { /* noop */ }

  _dbg('Logout → modo resetado para padrão');
});

/* ═══════════════════════════════════════════════
   7. API PÚBLICA
═══════════════════════════════════════════════ */

const audioState = {

  getMode() {
    return _currentMode;
  },

setMode(modeId) {
  if (!VALID_MODES.includes(modeId)) return;
  _currentMode = modeId;
  // adiciona aqui:
  try { localStorage.setItem('nexus_sfx_mode', modeId); } catch {}
  _applyToEngine(_currentMode);
  _notify();
  _schedulePersist();
},

  subscribe(fn) {
    if (typeof fn !== 'function') return;
    _subscribers.add(fn);
  },

  unsubscribe(fn) {
    _subscribers.delete(fn);
  },

  async loadFromFirebase(uid) {
    if (!uid) return;

    _currentUid = uid;
    const token = ++_activeLoadToken;
    _sfxReady = false;

    const saved = await _fetchFromFirebase(uid);

    if (token !== _activeLoadToken) {
      _dbg('loadFromFirebase descartado (uid="' + uid + '", token=' + token + ')');
      return;
    }

    _applyLoadedState(saved);

    _sfxReady = true;
    _readyResolve();
    _flushSfxQueue();
  },

  reset() {
    _currentMode = DEFAULT_MODE;
    audio.resetToDefaults();
    _applyToEngine(_currentMode);
    _notify();
  },

  getModes() {
    return { ...MODES };
  },

  getValidModes() {
    return [...VALID_MODES];
  },

  // ── MODO DE MÚSICA ───────────────────────────

  getMusicMode() {
    return _currentMusicMode;
  },

  setMusicMode(modeId) {
    if (!VALID_MUSIC_MODES.includes(modeId)) return;
    _currentMusicMode = modeId;
    try { localStorage.setItem('nexus_music_mode', modeId); } catch { /* noop */ }
    _persistAllToFirebase();
    _notifyMusicMode();
  },

  subscribeMusicMode(fn) {
    if (typeof fn === 'function') _musicModeSubscribers.add(fn);
  },

  unsubscribeMusicMode(fn) {
    _musicModeSubscribers.delete(fn);
  },

  // ── VOLUMES ──────────────────────────────────

  getVolumes() {
    return { ..._volumes };
  },

  setVolume(channel, value) {
    if (!['master', 'music', 'sfx'].includes(channel)) {
      _dbg('setVolume: canal invalido:', channel);
      return;
    }
    const clamped = Math.max(0, Math.min(1.5, Number(value) || 0));
    _volumes[channel] = clamped;
    _dbg('volume:', channel, '=', clamped);

    if (channel === 'master') {
      if (clamped === 0) { audio.setMasterVolume(0); audio.mute(); }
      else               { audio.unmute(); audio.setMasterVolume(clamped); }
    } else if (channel === 'music') {
      // Atualiza _volumes.music mas NÃO aplica direto na engine aqui.
      // O botão de música é quem controla audio.setMusicVolume().
      // Se o slider de música do modal mudar _volumes.music, o botão de música
      // não perde o controle — a próxima vez que o modo mudar, ele aplica o
      // musicVolume correto do modo (normal=1.0, low=0.25, mute=0).
      // Mas o slider quer aplicar imediatamente para o usuário ouvir.
      // Solução: aplica na engine SOMENTE se o modo de música for 'normal',
      // para não sobrescrever um LOW (0.25) ou MUTE (0) com o valor do slider.
      //
      // Na prática: o slider de música no modal de som ajusta o volume BASE.
      // O botão de música aplica um MULTIPLICADOR sobre esse volume base.
      // Nesta arquitetura simplificada, o botão de música define o volume final.
      // Então o slider altera _volumes.music (persistência) e também aplica
      // se o modo atual permitir (não-mute).
      const musicMode = _currentMusicMode;
      if (musicMode !== 'mute') {
        // Escala pelo modo: normal usa 100% do slider, low usa 50%
        const scale = musicMode === 'low' ? 0.5 : 1.0;
        audio.setMusicVolume?.(clamped * scale);
      }
      // Se musicMode === 'mute', não aplica — respeita o mute do botão de música
    } else {
      audio.setSfxVolume?.(clamped);
    }

    _persistAllToFirebase();
  },

  // ── SFX_MAP GLOBAL ──────────────────────────

  getSfxMap() {
    return { ..._currentSfxMap };
  },

  setSfxMap(action, variantId) {
    if (!(action in DEFAULT_SFX_MAP)) {
      _dbg('setSfxMap: ação desconhecida "' + action + '"');
      return;
    }
    _currentSfxMap[action] = variantId;
    _persistAllToFirebase();
    _notify();
  },

  // ── SFX_AREA_MAP ────────────────────────────

  getSfxAreaMap() {
    const copy = {};
    for (const [k, v] of Object.entries(_currentSfxAreaMap)) copy[k] = { ...v };
    return copy;
  },

  setSfxAreaMap(area, action, variantId) {
    if (!(action in DEFAULT_SFX_MAP)) {
      _dbg('setSfxAreaMap: ação desconhecida "' + action + '"');
      return;
    }

    const key = area.toLowerCase();

    if (variantId == null) {
      if (_currentSfxAreaMap[key]) {
        delete _currentSfxAreaMap[key][action];
        if (Object.keys(_currentSfxAreaMap[key]).length === 0) {
          delete _currentSfxAreaMap[key];
        }
      }
      _dbg('setSfxAreaMap: removido override área="' + key + '" action="' + action + '"');
    } else {
      if (!_currentSfxAreaMap[key]) _currentSfxAreaMap[key] = {};
      _currentSfxAreaMap[key][action] = variantId;
      _dbg('setSfxAreaMap: definido área="' + key + '" action="' + action + '" variant="' + variantId + '"');
    }

    _persistAllToFirebase();
    _notify();
  },

  clearSfxAreaOverride(area, action) {
    this.setSfxAreaMap(area, action, null);
  },

  clearAreaOverrides(area) {
    const key = area.toLowerCase();
    if (_currentSfxAreaMap[key]) {
      delete _currentSfxAreaMap[key];
      _persistAllToFirebase();
      _notify();
    }
  },

  // ── RESOLUÇÃO DE VARIANTE ────────────────────

  resolveVariant(action, area) {
    return _resolveVariant(action, area);
  },

  // ── SNAPSHOT DE ÁUDIO PARA PERSISTÊNCIA ─────

  getAudioPayload() {
    const areaSnap = {};
    for (const [k, v] of Object.entries(_currentSfxAreaMap)) areaSnap[k] = { ...v };
    return {
      audioState:      _currentMode,
      musicMode:       _currentMusicMode,
      sfxMap:          { ..._currentSfxMap },
      sfxAreaMap:      areaSnap,
      volumes:         { ..._volumes },
      sfxBtnEnabled:   _sfxBtnEnabled,
      musicBtnEnabled: _musicBtnEnabled,
    };
  },

  // ── FILA DE SFX ─────────────────────────────

  isReady() {
    return _sfxReady;
  },

  enqueue(event, area = null) {
    _sfxQueue.push({ event, area });
  },

  waitUntilReady() {
    return _readyPromise;
  },

  // ── VISIBILIDADE DOS BOTÕES (SFX / MÚSICA) ──
  // Controla se o botão flutuante aparece e se o canal
  // correspondente fica audível. Ver seção 2a-bis acima.

  getSfxBtnEnabled() {
    return _sfxBtnEnabled;
  },

  setSfxBtnEnabled(enabled) {
    _sfxBtnEnabled = !!enabled;
    try { localStorage.setItem('nexus_sfx_btn_enabled', String(_sfxBtnEnabled)); } catch { /* noop */ }
    _applyToEngine(_currentMode);
    _notifySfxBtnEnabled();
  },

  subscribeSfxBtnEnabled(fn) {
    if (typeof fn === 'function') _sfxBtnSubscribers.add(fn);
  },

  unsubscribeSfxBtnEnabled(fn) {
    _sfxBtnSubscribers.delete(fn);
  },

  getMusicBtnEnabled() {
    return _musicBtnEnabled;
  },

  setMusicBtnEnabled(enabled) {
    _musicBtnEnabled = !!enabled;
    try { localStorage.setItem('nexus_music_btn_enabled', String(_musicBtnEnabled)); } catch { /* noop */ }
    _notifyMusicBtnEnabled();
  },

  subscribeMusicBtnEnabled(fn) {
    if (typeof fn === 'function') _musicBtnSubscribers.add(fn);
  },

  unsubscribeMusicBtnEnabled(fn) {
    _musicBtnSubscribers.delete(fn);
  },

};

export default audioState;