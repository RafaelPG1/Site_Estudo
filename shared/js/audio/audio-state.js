// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/audio-state.js
   Estado global de áudio — fonte única de verdade
   Versão 1.5  ← gate de inicialização (waitUntilReady)

   RESPONSABILIDADES
   ─────────────────────────────────────────────
   ✅ Este módulo É responsável por:
     - manter o modo de áudio atual (normal / low / mute)
     - aplicar o modo no sfx.js (setMasterVolume, mute, unmute)
     - carregar estado do Firebase por usuário
     - salvar estado no Firebase
     - reagir a login (nexus:loginSuccess) e logout (nexus:logout)
     - notificar subscribers quando o modo muda
     - gerenciar fila de sons pendentes durante carregamento do Firebase
     - manter SFX_MAP global (geral) e overrides por área
     - resolver variante correta dado (action, area)

   ❌ Este módulo NÃO é responsável por:
     - criar DOM ou botões
     - renderizar interface
     - injetar CSS
     - engine de áudio (isso é o sfx.js)
     - consultar o estado global de auth (getUsuario) — usa _currentUid interno

   ARQUITETURA
   ─────────────────────────────────────────────
   audio-state.js ←→ sfx.js        (aplica volume/mute)
   audio-state.js ←→ Firebase      (persiste por usuário)
   audio-state.js ←→ audio-btn.js  (notifica via subscribe)
   audio-state.js ←→ play.js       (isReady / enqueue / resolveVariant)

   SCHEMA FIREBASE (após v1.4)
   ─────────────────────────────────────────────
   {
     audioState: 'normal',          // modo de volume
     sfxMap: {                       // sons globais
       click: 'click2',
       hover: 'hover2',
       openModal: 'openModal2',
       closeModal: 'closeModal',
       select: 'select'
     },
     sfxAreaMap: {                   // overrides por área
       game:    { click: 'click5' },
       resumos: { click: 'click3', hover: 'hover4' },
       quiz:    { select: 'select3' }
     }
   }

   RESOLUÇÃO DE VARIANTE (resolveVariant)
   ─────────────────────────────────────────────
   resolveVariant(action, area?)
     1. Se area for fornecida e _currentSfxAreaMap[area][action] existir
        → usa o override específico da área
     2. Caso contrário, usa _currentSfxMap[action] (geral)
     3. Se nenhum existir → undefined (silêncio)

   MODOS
   ─────────────────────────────────────────────
   'normal'  →  masterVolume 1.0, unmuted
   'low'     →  masterVolume 0.5, unmuted
   'mute'    →  masterVolume 0,   muted

   API PÚBLICA
   ─────────────────────────────────────────────
   audioState.getMode()                      → 'normal' | 'low' | 'mute'
   audioState.setMode(id)                    → aplica + persiste + notifica
   audioState.subscribe(fn)                  → fn(modeId) chamado em cada mudança
   audioState.unsubscribe(fn)                → remove subscriber
   audioState.loadFromFirebase(uid)          → carrega e aplica estado salvo
   audioState.reset()                        → volta ao padrão, sem persistir
   audioState.getSfxMap()                    → cópia do mapa geral atual
   audioState.setSfxMap(action, id)          → atualiza variante geral + persiste
   audioState.getSfxAreaMap()                → cópia do mapa de overrides por área
   audioState.setSfxAreaMap(area, action, id)→ define override de área + persiste
   audioState.clearSfxAreaOverride(area, action) → remove override de área + persiste
   audioState.resolveVariant(action, area?)  → resolve variante final (área → geral)
   audioState.isReady()                      → true se SFX_MAP já foi aplicado
   audioState.enqueue(event, area?)          → enfileira evento para tocar quando pronto
   audioState.waitUntilReady()               → Promise que resolve quando SFX_MAP estiver pronto
   ============================================= */

import audio from './sfx.js';
import { carregarConfigs, salvarConfigs } from '../../../src/firebase.js';

/* ═══════════════════════════════════════════════
   INSTRUMENTAÇÃO DE PERFORMANCE — remover após medir
   Coleta tempos reais do bootstrap com performance.now().
   Resultados ficam em window.__audioPerf (console: window.__audioPerf)
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
      `║  módulo carregado:         ${p.moduleLoad?.toFixed(2)} ms (desde navigationStart)`,
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
   DEBUG FLAG (espelha sfx.js — setar true só em dev)
═══════════════════════════════════════════════ */
const _DEBUG = false;
const _dbg   = _DEBUG ? (...a) => console.log('[audio-state]', ...a) : () => {};

/* ═══════════════════════════════════════════════
   DEBOUNCE DE PERSISTÊNCIA
   ─────────────────────────────────────────────
   Consolida múltiplas alterações rápidas (ex: mover slider,
   trocar área, resetar) em um único write no Firebase.
   800 ms é conservador o suficiente para capturar rajadas
   de setSfxAreaMap() do _resetAll() e _saveAll() sem perder dados.
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
  normal: { masterVolume: 1.0, muted: false },
  low:    { masterVolume: 0.5, muted: false },
  mute:   { masterVolume: 0,   muted: true  },
};

const DEFAULT_MODE = 'normal';

/** IDs válidos de modo — usados para validação de entrada. */
const VALID_MODES = Object.keys(MODES);

/* ═══════════════════════════════════════════════
   1b. SFX_MAP — mapa de sons globais por ação
═══════════════════════════════════════════════ */

/** Mapa padrão global. Usado quando não há dado salvo no Firebase. */
const DEFAULT_SFX_MAP = {
  click:      'click',
  hover:      'hover2',
  openModal:  'openModal2',
  closeModal: 'closeModal',
  select:     'select',
};

/**
 * Mapa atual global em memória.
 * Começa com os padrões e é sobrescrito pelo loadFromFirebase após login.
 */
let _currentSfxMap = { ...DEFAULT_SFX_MAP };

/* ═══════════════════════════════════════════════
   1c. SFX_AREA_MAP — overrides por área/página
   ─────────────────────────────────────────────
   Estrutura:
   {
     game:    { click: 'click5' },
     resumos: { click: 'click3', hover: 'hover4' },
     quiz:    { select: 'select3' }
   }

   Chaves de área são normalizadas para lowercase (game, quiz, resumos, perfil).
   Cada área contém apenas os actions que têm override definido.
   Actions sem override herdam o valor do _currentSfxMap global.
═══════════════════════════════════════════════ */

/**
 * Mapa de overrides por área em memória.
 * Inicia vazio; é sobrescrito pelo loadFromFirebase após login.
 */
let _currentSfxAreaMap = {};

/* ═══════════════════════════════════════════════
   1d. FILA DE SFX — controle de prontidão
   ─────────────────────────────────────────────
   Resolve a race condition entre playSound() e o await do Firebase.

   _sfxReady = true  → DEFAULT_SFX_MAP disponível (visitante ou pós-load)
   _sfxReady = false → aguardando Firebase; sons são enfileirados

   A fila é drenada em _flushSfxQueue() assim que _sfxReady volta a true.
   play.js consulta isReady() e chama enqueue() quando necessário —
   nenhum outro arquivo precisa saber desta fila.

   A partir de v1.4 cada item da fila carrega também a área:
   { event: 'click', area: 'game' }
═══════════════════════════════════════════════ */

/**
 * Flag de prontidão do SFX_MAP.
 * Inicia true: visitante usa DEFAULT_SFX_MAP imediatamente, sem esperar.
 * Vira false no início de nexus:loginSuccess (antes do await Firebase).
 * Volta a true após Firebase responder com o mapa do usuário.
 */
let _sfxReady = true;
_perf.sfxReadyInitial = performance.now();
// [DIAG] Estado inicial do audio-state no carregamento do módulo
console.log('[DIAG:audio-state] módulo carregado', {
  '_sfxReady inicial': _sfxReady,
  '_currentMode': 'normal (default)',
  'DEFAULT_SFX_MAP': { click: 'click', hover: 'hover2', openModal: 'openModal2', closeModal: 'closeModal', select: 'select' },
  'timestamp': Date.now(),
});

/* ─────────────────────────────────────────────
   GATE DE INICIALIZAÇÃO — waitUntilReady()
   ─────────────────────────────────────────────
   Promise que resolve uma única vez: quando o SFX_MAP estiver
   completamente pronto (visitante: imediato; usuário logado: após Firebase).

   _readyResolve é guardado para ser chamado nos dois pontos onde
   _sfxReady vira true:
     1. visitante           → resolve imediatamente (abaixo)
     2. nexus:loginSuccess  → resolve após _fetchFromFirebase concluir
     3. loadFromFirebase()  → idem

   Se o usuário efetuar novo login após logout, a Promise é recriada
   (_resetReadyPromise) para que novos chamadores de waitUntilReady()
   aguardem o novo ciclo de carregamento.
───────────────────────────────────────────── */
let _readyResolve;
let _readyPromise = new Promise(res => { _readyResolve = res; });
_readyResolve(); // visitante: já está pronto

function _resetReadyPromise() {
  _readyPromise = new Promise(res => { _readyResolve = res; });
}

/**
 * Fila de eventos de áudio acumulados enquanto _sfxReady === false.
 * Cada item: { event: string, area: string|null }
 * Drenada por _flushSfxQueue() na ordem de chegada (FIFO).
 */
const _sfxQueue = [];

/**
 * Drena a fila de eventos de áudio.
 *
 * Deduplicação de hover: durante login/loading podem acumular vários
 * eventos 'hover' na fila. Tocar todos juntos seria uma explosão de sons.
 * Estratégia: mantém apenas o ÚLTIMO hover de cada área — descarta os anteriores.
 * Outros eventos (click, openModal, etc.) continuam tocando normalmente.
 */
function _flushSfxQueue() {
  if (!_sfxQueue.length) return;

  // Deduplicar: para cada (event=hover, area), manter só a última entrada.
  // Para demais eventos, manter todas em ordem.
  const deduped = [];
  // Rastreia se já existe um hover (por área) mais recente na fila.
  const hoverSeen = new Set();

  // Percorre de trás para frente para identificar o último hover de cada área.
  for (let i = _sfxQueue.length - 1; i >= 0; i--) {
    const item = _sfxQueue[i];
    if (item.event === 'hover') {
      const key = item.area ?? '__global__';
      if (!hoverSeen.has(key)) {
        hoverSeen.add(key);
        deduped.unshift(item); // mantém o mais recente
      }
      // anteriores do mesmo área+hover são descartados silenciosamente
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

/**
 * Resolve a variante final para um dado par (action, area).
 *
 * Prioridade:
 *   1. Override de área: _currentSfxAreaMap[area]?.[action]
 *   2. Global:           _currentSfxMap[action]
 *   3. undefined         (silêncio — tratado pelo chamador)
 *
 * @param {string}      action — chave do SFX_MAP (ex: 'click')
 * @param {string|null} area   — identificador de área (ex: 'game', 'resumos')
 * @returns {string|undefined}
 */
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

let _currentMode = DEFAULT_MODE;

/** Volumes por canal — persistidos no Firebase. */
let _volumes = { master: 1.0, music: 1.0, sfx: 1.0 };

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
═══════════════════════════════════════════════ */

function _applyToEngine(modeId) {
  const mode = MODES[modeId] ?? MODES[DEFAULT_MODE];
  if (mode.muted) {
    audio.setMasterVolume(0);
    audio.mute();
  } else {
    audio.unmute();
    audio.setMasterVolume(_volumes.master);
  }
  audio.setMusicVolume?.(_volumes.music);
  audio.setSfxVolume?.(_volumes.sfx);
  _dbg('mode:', modeId, '| volumes:', _volumes);
}

/* ═══════════════════════════════════════════════
   5. PERSISTÊNCIA — Firebase
═══════════════════════════════════════════════ */

async function _fetchFromFirebase(uid) {
  try {
    _perf.firebaseStart = performance.now();
    const configs      = await carregarConfigs(uid);
    _perf.firebaseEnd  = performance.now();
    const saved        = configs?.audioState;
    const savedSfxMap  = configs?.sfxMap     ?? null;
    const savedAreaMap = configs?.sfxAreaMap ?? null;
    const savedVolumes = configs?.volumes    ?? null;

    _dbg('_fetchFromFirebase: uid="' + uid + '" sfxMap=', savedSfxMap, 'sfxAreaMap=', savedAreaMap);

    return {
      mode:    VALID_MODES.includes(saved) ? saved : null,
      sfxMap:  savedSfxMap  && typeof savedSfxMap  === 'object' ? savedSfxMap  : null,
      areaMap: savedAreaMap && typeof savedAreaMap === 'object' ? savedAreaMap : null,
      volumes: savedVolumes && typeof savedVolumes === 'object' ? savedVolumes : null,
    };
  } catch (err) {
    _dbg('Erro ao carregar Firebase:', err);
    return { mode: null, sfxMap: null, areaMap: null };
  }
}

/**
 * Executa o write imediato no Firebase com o estado atual.
 * NÃO chamar diretamente — usar _persistAllToFirebase() (debounced).
 */
async function _persistAllToFirebaseNow() {
  if (!_currentUid) return;
  const uid = _currentUid;

  // Snapshot síncrono — evita closure stale.
  const modeSnap = _currentMode;
  const sfxSnap  = { ..._currentSfxMap };
  // Cópia rasa de dois níveis — suficiente para o schema { area: { action: variant } }.
  // Evita JSON.parse(JSON.stringify) no hot path mantendo correção.
  const areaSnap = {};
  for (const [k, v] of Object.entries(_currentSfxAreaMap)) areaSnap[k] = { ...v };
  const volSnap  = { ..._volumes };

  try {
    const { getConfigs } = await import('../../../src/global.js');
    const configsAtuais  = getConfigs();
    const { audioState: _d1, sfxMap: _d2, sfxAreaMap: _d3, volumes: _d4, ...restConfigs } = configsAtuais;
    const payload = { ...restConfigs, audioState: modeSnap, sfxMap: sfxSnap, sfxAreaMap: areaSnap, volumes: volSnap };
    _dbg('persistindo →', modeSnap, volSnap);
    await salvarConfigs(uid, payload);
  } catch (_) {
    // fallback sem global.js
    try {
      await salvarConfigs(uid, { audioState: modeSnap, sfxMap: sfxSnap, sfxAreaMap: areaSnap, volumes: volSnap });
    } catch (err) {
      _dbg('Erro ao salvar Firebase:', err);
    }
  }
}

/**
 * Agenda persistência no Firebase com debounce de 800 ms.
 * Múltiplas chamadas rápidas (reset, slider, área) geram apenas 1 write.
 */
function _persistAllToFirebase() {
  _schedulePersist();
}

/* Aliases mantidos por compatibilidade com código existente */
function _persistToFirebase()        { _persistAllToFirebase(); }
function _persistSfxMapToFirebase()  { _persistAllToFirebase(); }

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

  // [DIAG] Momento em que _sfxReady vai para false (sons começam a ser enfileirados)
  console.log('[DIAG:audio-state] nexus:loginSuccess → _sfxReady = false (início do load Firebase)', {
    uid, token, 'timestamp': Date.now(),
  });
  _sfxReady = false;
  _resetReadyPromise();

  _currentMode = DEFAULT_MODE;
  audio.resetToDefaults();
  _applyToEngine(_currentMode);
  _notify();

  // [PERF] Se o index.js já passou configs no detail do evento, usamos diretamente.
  // Isso elimina a segunda consulta ao Firebase (round-trip de 150–2000 ms).
  // Fallback para _fetchFromFirebase mantido para compatibilidade caso o detail
  // não contenha configs (ex: disparos de loginSuccess de outros contextos).
  let saved;
  if (detail?.configs) {
    const c = detail.configs;
    const savedMode    = c?.audioState;
    const savedSfxMap  = c?.sfxMap     ?? null;
    const savedAreaMap = c?.sfxAreaMap ?? null;
    const savedVolumes = c?.volumes    ?? null;
    _dbg('loginSuccess: usando configs do detail (sem round-trip Firebase)', { savedMode, savedSfxMap });
    console.log('[DIAG:audio-state] nexus:loginSuccess → configs recebidas via detail (0ms Firebase)', {
      'timestamp': Date.now(),
    });
    saved = {
      mode:    VALID_MODES.includes(savedMode) ? savedMode : null,
      sfxMap:  savedSfxMap  && typeof savedSfxMap  === 'object' ? savedSfxMap  : null,
      areaMap: savedAreaMap && typeof savedAreaMap === 'object' ? savedAreaMap : null,
      volumes: savedVolumes && typeof savedVolumes === 'object' ? savedVolumes : null,
    };
  } else {
    // Fallback: index.js não incluiu configs no detail — faz a leitura normalmente.
    _dbg('loginSuccess: detail sem configs, fazendo _fetchFromFirebase (fallback)');
    console.warn('[DIAG:audio-state] nexus:loginSuccess → detail sem configs, executando fallback Firebase', {
      'timestamp': Date.now(),
    });
    saved = await _fetchFromFirebase(uid);
  }

  if (token !== _activeLoadToken) {
    _dbg('resposta antiga descartada (uid="' + uid + '", token=' + token + ')');
    return;
  }

  _currentMode       = saved.mode ?? DEFAULT_MODE;
  _currentSfxMap     = saved.sfxMap  ? { ...DEFAULT_SFX_MAP, ...saved.sfxMap  } : { ...DEFAULT_SFX_MAP };
  _currentSfxAreaMap = saved.areaMap ? { ...saved.areaMap } : {};
  if (saved.volumes) {
    _volumes.master = typeof saved.volumes.master === 'number' ? saved.volumes.master : 1.0;
    _volumes.music  = typeof saved.volumes.music  === 'number' ? saved.volumes.music  : 1.0;
    _volumes.sfx    = typeof saved.volumes.sfx    === 'number' ? saved.volumes.sfx    : 1.0;
    _dbg('volumes carregados do Firebase:', _volumes);
  }
  _applyToEngine(_currentMode);
  _notify();

  _sfxReady = true;
  _perf.sfxReadyTrue = performance.now();
  // [DIAG] Firebase carregado, _sfxReady voltou para true
  console.log('[DIAG:audio-state] nexus:loginSuccess → _sfxReady = true (Firebase carregado)', {
    '_currentMode': _currentMode,
    '_currentSfxMap': { ..._currentSfxMap },
    '_sfxQueue restante': _sfxQueue.length,
    'timestamp': Date.now(),
  });
  _readyResolve();
  _perf.flushQueue = performance.now();
  _flushSfxQueue();

  _dbg('uid="' + uid + '" → modo="' + _currentMode + '"', saved.mode !== null ? '(Firebase)' : '(padrão)');
  _dbg('sfxAreaMap hidratado:', _currentSfxAreaMap);
});

document.addEventListener('nexus:logout', () => {
  // Cancela qualquer persist pendente antes de limpar o uid.
  if (_persistTimer) { clearTimeout(_persistTimer); _persistTimer = null; }

  _currentUid        = null;
  _activeLoadToken++;

  _currentMode       = DEFAULT_MODE;
  _currentSfxMap     = { ...DEFAULT_SFX_MAP };
  _currentSfxAreaMap = {};
  audio.resetToDefaults();
  _applyToEngine(_currentMode);
  _notify();

  _sfxQueue.length = 0;
  _sfxReady = true;

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
    if (!VALID_MODES.includes(modeId)) {
      _dbg('setMode: modo inválido "' + modeId + '"');
      return;
    }
    _currentMode = modeId;
    _applyToEngine(_currentMode);
    _persistToFirebase();
    _notify();
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

    _currentMode       = saved.mode ?? DEFAULT_MODE;
    _currentSfxMap     = saved.sfxMap  ? { ...DEFAULT_SFX_MAP, ...saved.sfxMap  } : { ...DEFAULT_SFX_MAP };
    _currentSfxAreaMap = saved.areaMap ? { ...saved.areaMap } : {};
    if (saved.volumes) {
      _volumes.master = typeof saved.volumes.master === 'number' ? saved.volumes.master : 1.0;
      _volumes.music  = typeof saved.volumes.music  === 'number' ? saved.volumes.music  : 1.0;
      _volumes.sfx    = typeof saved.volumes.sfx    === 'number' ? saved.volumes.sfx    : 1.0;
      _dbg('volumes carregados (loadFromFirebase):', _volumes);
    }
    _applyToEngine(_currentMode);
    _notify();

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

  // ── VOLUMES ──────────────────────────────────

  /** Retorna copia dos volumes atuais. */
  getVolumes() {
    return { ..._volumes };
  },

  /**
   * Atualiza o volume de um canal, aplica na engine e persiste no Firebase.
   * @param {'master'|'music'|'sfx'} channel
   * @param {number} value  0.0 a 2.0
   */
  setVolume(channel, value) {
    if (!['master', 'music', 'sfx'].includes(channel)) {
      _dbg('setVolume: canal invalido:', channel);
      return;
    }
    const clamped = Math.max(0, Math.min(2, Number(value) || 0));
    _volumes[channel] = clamped;
    _dbg('volume:', channel, '=', clamped);

    if (channel === 'master') {
      if (clamped === 0) { audio.setMasterVolume(0); audio.mute(); }
      else               { audio.unmute(); audio.setMasterVolume(clamped); }
    } else if (channel === 'music') {
      audio.setMusicVolume?.(clamped);
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
    _persistSfxMapToFirebase();
    _notify();
  },

  // ── SFX_AREA_MAP — overrides por área ───────

  /**
   * Retorna uma cópia profunda do mapa de overrides por área.
   * Formato: { game: { click: 'click5' }, resumos: { click: 'click3' } }
   *
   * @returns {Object}
   */
  getSfxAreaMap() {
    // Cópia rasa de dois níveis — suficiente para o schema { area: { action: variant } }.
    // Evita JSON.parse/stringify no hot path mantendo isolamento correto.
    const copy = {};
    for (const [k, v] of Object.entries(_currentSfxAreaMap)) copy[k] = { ...v };
    return copy;
  },

  /**
   * Define um override de áudio para uma área/página específica.
   * Se variantId for null ou undefined, equivale a clearSfxAreaOverride.
   *
   * @param {string} area      — ex: 'game', 'resumos', 'quiz', 'perfil'
   * @param {string} action    — chave do SFX_MAP (ex: 'click', 'hover')
   * @param {string|null} variantId — ex: 'click5', ou null para remover
   */
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

  /**
   * Remove o override de uma área+action específica.
   * Após a remoção, playSound usará o som global para essa combinação.
   *
   * @param {string} area   — ex: 'game'
   * @param {string} action — ex: 'click'
   */
  clearSfxAreaOverride(area, action) {
    this.setSfxAreaMap(area, action, null);
  },

  /**
   * Remove todos os overrides de uma área inteira.
   *
   * @param {string} area — ex: 'game'
   */
  clearAreaOverrides(area) {
    const key = area.toLowerCase();
    if (_currentSfxAreaMap[key]) {
      delete _currentSfxAreaMap[key];
      _persistAllToFirebase();
      _notify();
    }
  },

  // ── RESOLUÇÃO DE VARIANTE ────────────────────

  /**
   * Resolve a variante final para um dado par (action, area).
   *
   * Prioridade:
   *   1. Override de área:  _currentSfxAreaMap[area]?.[action]
   *   2. Global:            _currentSfxMap[action]
   *   3. undefined          (silêncio — tratado pelo chamador)
   *
   * Exposto na API pública para play.js e outros módulos.
   *
   * @param {string}      action — chave do SFX_MAP (ex: 'click')
   * @param {string|null} [area] — identificador de área (ex: 'game')
   * @returns {string|undefined}
   */
  resolveVariant(action, area) {
    return _resolveVariant(action, area);
  },

  // ── SNAPSHOT DE ÁUDIO PARA PERSISTÊNCIA ─────

  /**
   * Retorna um snapshot dos três campos de áudio que audio-state.js
   * controla, para que global.js possa incluí-los no payload do Firebase
   * sem depender de importação circular ou leitura assíncrona.
   *
   * Usado em setConfigs() do global.js para garantir que sfxAreaMap
   * nunca seja apagado por um save parcial de configs gerais.
   *
   * @returns {{ audioState: string, sfxMap: object, sfxAreaMap: object }}
   */
  getAudioPayload() {
    const areaSnap = {};
    for (const [k, v] of Object.entries(_currentSfxAreaMap)) areaSnap[k] = { ...v };
    return {
      audioState: _currentMode,
      sfxMap:     { ..._currentSfxMap },
      sfxAreaMap: areaSnap,
      volumes:    { ..._volumes },
    };
  },

  // ── FILA DE SFX ─────────────────────────────

  /**
   * Indica se o SFX_MAP do Firebase já foi carregado e aplicado.
   * @returns {boolean}
   */
  isReady() {
    return _sfxReady;
  },

  /**
   * Enfileira um evento de áudio para ser tocado assim que o SFX_MAP
   * estiver pronto. Chamado por play.js quando isReady() === false.
   *
   * A partir de v1.4 aceita um segundo parâmetro opcional `area`,
   * para que o som correto seja tocado quando a fila for drenada.
   *
   * @param {string}      event — chave do SFX_MAP (ex: 'click')
   * @param {string|null} [area] — identificador de área (ex: 'game')
   */
  enqueue(event, area = null) {
    _sfxQueue.push({ event, area });
  },

  /**
   * Retorna a Promise interna de prontidão do SFX_MAP.
   *
   * Resolve quando:
   *   - visitante: imediatamente (DEFAULT_SFX_MAP disponível)
   *   - usuário logado: após Firebase carregar sfxMap + sfxAreaMap
   *
   * Uso:
   *   await audioState.waitUntilReady();
   *   // daqui em diante playSound() usa o mapa correto
   *
   * @returns {Promise<void>}
   */
  waitUntilReady() {
    return _readyPromise;
  },

};

export default audioState;