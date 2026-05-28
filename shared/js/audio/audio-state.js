// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/audio-state.js
   Estado global de áudio — fonte única de verdade
   Versão 1.4  ← area-overrides implementados

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
     sfxAreaMap: {                   // ← NOVO: overrides por área
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
   ============================================= */

import audio from './sfx.js';
import { carregarConfigs, salvarConfigs } from '../../../src/firebase.js';

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
   1c. SFX_AREA_MAP — overrides por área/página  ← NOVO
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

/**
 * Fila de eventos de áudio acumulados enquanto _sfxReady === false.
 * Cada item: { event: string, area: string|null }
 * Drenada por _flushSfxQueue() na ordem de chegada (FIFO).
 */
const _sfxQueue = [];

/**
 * Drena todos os eventos enfileirados, tocando cada um com o
 * _currentSfxMap / _currentSfxAreaMap já atualizados.
 * Chamada apenas quando _sfxReady === true.
 */
function _flushSfxQueue() {
  while (_sfxQueue.length) {
    const { event, area } = _sfxQueue.shift();
    const variantId = _resolveVariant(event, area);
    if (variantId) {
      audio.sfx[variantId]?.();
    } else {
      console.warn(`[audio-state] _flushSfxQueue: evento "${event}" não encontrado no SFX_MAP.`);
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
  audio.setMasterVolume(mode.masterVolume);
  if (mode.muted) {
    audio.mute();
  } else {
    audio.unmute();
  }
}

/* ═══════════════════════════════════════════════
   5. PERSISTÊNCIA — Firebase
═══════════════════════════════════════════════ */

async function _fetchFromFirebase(uid) {
  try {
    const configs      = await carregarConfigs(uid);

    // configs é o objeto dentro de snap.data().configs (ver firebase.js)
    const saved        = configs?.audioState;
    const savedSfxMap  = configs?.sfxMap     ?? null;
    const savedAreaMap = configs?.sfxAreaMap ?? null;

    console.log('[audio-state] _fetchFromFirebase: uid="' + uid + '" sfxMap=', savedSfxMap, 'sfxAreaMap=', savedAreaMap);

    return {
      mode:    VALID_MODES.includes(saved) ? saved : null,
      sfxMap:  savedSfxMap  && typeof savedSfxMap  === 'object' ? savedSfxMap  : null,
      areaMap: savedAreaMap && typeof savedAreaMap === 'object' ? savedAreaMap : null,
    };
  } catch (err) {
    console.warn('[audio-state] Erro ao carregar Firebase:', err);
    return { mode: null, sfxMap: null, areaMap: null };
  }
}

/**
 * Persiste o estado completo (modo + sfxMap + sfxAreaMap) no Firebase.
 * Usado por setMode, setSfxMap, setSfxAreaMap e clearSfxAreaOverride.
 */
function _persistAllToFirebase() {
  if (!_currentUid) return;
  const uid = _currentUid;

  // Snapshot imediato — evita closure stale em trocas rápidas de configuração.
  const modeSnap = _currentMode;
  const sfxSnap  = { ..._currentSfxMap };
  const areaSnap = JSON.parse(JSON.stringify(_currentSfxAreaMap));

  import('../../../src/global.js').then(({ getConfigs }) => {
    const configsAtuais = getConfigs();
    // Remove as chaves de áudio do getConfigs() para não pisar nas versões corretas.
    // audio-state.js é dono exclusivo de audioState, sfxMap e sfxAreaMap.
    const { audioState: _d1, sfxMap: _d2, sfxAreaMap: _d3, ...restConfigs } = configsAtuais;

    const payload = {
      ...restConfigs,
      audioState: modeSnap,
      sfxMap:     sfxSnap,
      sfxAreaMap: areaSnap,
    };

    console.log('[audio-state] persistindo → sfxAreaMap:', JSON.stringify(areaSnap), '| sfxMap:', JSON.stringify(sfxSnap));

    salvarConfigs(uid, payload).catch(err => {
      console.warn(`[audio-state] Erro ao salvar Firebase (uid="${uid}"):`, err);
    });
  }).catch(() => {
    const payload = {
      audioState: modeSnap,
      sfxMap:     sfxSnap,
      sfxAreaMap: areaSnap,
    };
    console.log('[audio-state] persistindo (fallback) → sfxAreaMap:', JSON.stringify(areaSnap));
    salvarConfigs(uid, payload).catch(() => {});
  });
}

/* Aliases mantidos por compatibilidade com código existente */
function _persistToFirebase()        { _persistAllToFirebase(); }
function _persistSfxMapToFirebase()  { _persistAllToFirebase(); }

/* ═══════════════════════════════════════════════
   6. LISTENERS DE AUTH
═══════════════════════════════════════════════ */

document.addEventListener('nexus:loginSuccess', async ({ detail }) => {
  const uid = detail?.uid;
  if (!uid) {
    console.warn('[audio-state] nexus:loginSuccess sem uid no detail — ignorado.');
    return;
  }

  _currentUid = uid;
  const token = ++_activeLoadToken;

  // Suspende sons personalizados até o Firebase responder.
  _sfxReady = false;

  _currentMode = DEFAULT_MODE;
  audio.resetToDefaults();
  _applyToEngine(_currentMode);
  _notify();

  const saved = await _fetchFromFirebase(uid);

  if (token !== _activeLoadToken) {
    console.log(`[audio-state] resposta antiga descartada (uid="${uid}", token=${token})`);
    return;
  }

  // Aplica mapa global do usuário.
  _currentMode       = saved.mode ?? DEFAULT_MODE;
  _currentSfxMap     = saved.sfxMap  ? { ...DEFAULT_SFX_MAP, ...saved.sfxMap  } : { ...DEFAULT_SFX_MAP };
  _currentSfxAreaMap = saved.areaMap ? { ...saved.areaMap } : {};   // ← NOVO
  _applyToEngine(_currentMode);
  _notify();

  // Ativa e drena a fila — agora os sons chegam com o mapa correto.
  _sfxReady = true;
  _flushSfxQueue();

  console.log(
    `[audio-state] uid="${uid}" → modo="${_currentMode}"`,
    saved.mode !== null ? '(Firebase)' : '(padrão — primeiro acesso)'
  );
});

document.addEventListener('nexus:logout', () => {
  _currentUid        = null;
  _activeLoadToken++;

  _currentMode       = DEFAULT_MODE;
  _currentSfxMap     = { ...DEFAULT_SFX_MAP };
  _currentSfxAreaMap = {};   // ← NOVO: limpa overrides no logout
  audio.resetToDefaults();
  _applyToEngine(_currentMode);
  _notify();

  _sfxQueue.length = 0;
  _sfxReady = true;

  console.log('[audio-state] Logout → modo resetado para padrão');
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
      console.warn(`[audio-state] setMode: modo inválido "${modeId}". Use: ${VALID_MODES.join(', ')}`);
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
      console.log(`[audio-state] loadFromFirebase descartado (uid="${uid}", token=${token})`);
      return;
    }

    _currentMode       = saved.mode ?? DEFAULT_MODE;
    _currentSfxMap     = saved.sfxMap  ? { ...DEFAULT_SFX_MAP, ...saved.sfxMap  } : { ...DEFAULT_SFX_MAP };
    _currentSfxAreaMap = saved.areaMap ? { ...saved.areaMap } : {};   // ← NOVO
    _applyToEngine(_currentMode);
    _notify();

    _sfxReady = true;
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

  // ── SFX_MAP GLOBAL ──────────────────────────

  getSfxMap() {
    return { ..._currentSfxMap };
  },

  setSfxMap(action, variantId) {
    if (!(action in DEFAULT_SFX_MAP)) {
      console.warn(`[audio-state] setSfxMap: ação desconhecida "${action}". Use: ${Object.keys(DEFAULT_SFX_MAP).join(', ')}`);
      return;
    }
    _currentSfxMap[action] = variantId;
    _persistSfxMapToFirebase();
    _notify();
  },

  // ── SFX_AREA_MAP — overrides por área ─────── ← NOVO

  /**
   * Retorna uma cópia profunda do mapa de overrides por área.
   * Formato: { game: { click: 'click5' }, resumos: { click: 'click3' } }
   *
   * @returns {Object}
   */
  getSfxAreaMap() {
    return JSON.parse(JSON.stringify(_currentSfxAreaMap));
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
      console.warn(`[audio-state] setSfxAreaMap: ação desconhecida "${action}". Use: ${Object.keys(DEFAULT_SFX_MAP).join(', ')}`);
      return;
    }

    const key = area.toLowerCase();

    if (variantId == null) {
      // Remove o override desta área+action
      if (_currentSfxAreaMap[key]) {
        delete _currentSfxAreaMap[key][action];
        if (Object.keys(_currentSfxAreaMap[key]).length === 0) {
          delete _currentSfxAreaMap[key];
        }
      }
      console.log(`[audio-state] setSfxAreaMap: removido override área="${key}" action="${action}" | mapa atual:`, JSON.stringify(_currentSfxAreaMap));
    } else {
      if (!_currentSfxAreaMap[key]) {
        _currentSfxAreaMap[key] = {};
      }
      _currentSfxAreaMap[key][action] = variantId;
      console.log(`[audio-state] setSfxAreaMap: definido área="${key}" action="${action}" variant="${variantId}" | mapa atual:`, JSON.stringify(_currentSfxAreaMap));
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
    return {
      audioState: _currentMode,
      sfxMap:     { ..._currentSfxMap },
      sfxAreaMap: JSON.parse(JSON.stringify(_currentSfxAreaMap)),
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

};

export default audioState;