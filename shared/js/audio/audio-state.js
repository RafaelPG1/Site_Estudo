// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/audio-state.js
   Estado global de áudio — fonte única de verdade
   Versão 1.3

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
   audio-state.js ←→ play.js       (isReady / enqueue para fila de SFX)

   MODOS
   ─────────────────────────────────────────────
   'normal'  →  masterVolume 1.0, unmuted
   'low'     →  masterVolume 0.5, unmuted
   'mute'    →  masterVolume 0,   muted

   FILA DE SFX (_sfxQueue)
   ─────────────────────────────────────────────
   Resolve a race condition entre playSound() e o carregamento
   assíncrono do SFX_MAP do Firebase.

   Ciclo de vida do _sfxReady:
     true  (inicial) → visitante: DEFAULT_SFX_MAP disponível imediatamente
     false           → início do nexus:loginSuccess (antes do await)
     true            → após Firebase responder e _currentSfxMap ser aplicado
     true  (logout)  → volta ao padrão; visitante pode tocar sons

   API PÚBLICA
   ─────────────────────────────────────────────
   audioState.getMode()             → 'normal' | 'low' | 'mute'
   audioState.setMode(id)           → aplica + persiste + notifica
   audioState.subscribe(fn)         → fn(modeId) chamado em cada mudança
   audioState.unsubscribe(fn)       → remove subscriber
   audioState.loadFromFirebase(uid) → carrega e aplica estado salvo
   audioState.reset()               → volta ao padrão, sem persistir
   audioState.getSfxMap()           → cópia do mapa atual
   audioState.setSfxMap(action, id) → atualiza variante + persiste
   audioState.isReady()             → true se SFX_MAP já foi aplicado
   audioState.enqueue(event)        → enfileira evento para tocar quando pronto
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
   1b. SFX_MAP — mapa de sons por ação
═══════════════════════════════════════════════ */

/** Mapa padrão. Usado quando não há dado salvo no Firebase. */
const DEFAULT_SFX_MAP = {
  click:      'click',
  hover:      'hover2',
  openModal:  'openModal2',
  closeModal: 'closeModal',
  select:     'select',
};

/**
 * Mapa atual em memória. Começa com os padrões e é sobrescrito
 * pelo loadFromFirebase após login.
 */
let _currentSfxMap = { ...DEFAULT_SFX_MAP };

/* ═══════════════════════════════════════════════
   1c. FILA DE SFX — controle de prontidão
   ─────────────────────────────────────────────
   Resolve a race condition entre playSound() e o await do Firebase.

   _sfxReady = true  → DEFAULT_SFX_MAP disponível (visitante ou pós-load)
   _sfxReady = false → aguardando Firebase; sons são enfileirados

   A fila é drenada em _flushSfxQueue() assim que _sfxReady volta a true.
   play.js consulta isReady() e chama enqueue() quando necessário —
   nenhum outro arquivo precisa saber desta fila.
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
 * Cada item é uma string de evento (ex: 'click', 'openModal').
 * Drenada por _flushSfxQueue() na ordem de chegada (FIFO).
 */
const _sfxQueue = [];

/**
 * Drena todos os eventos enfileirados, tocando cada um com o
 * _currentSfxMap já atualizado. Chamada apenas quando _sfxReady === true.
 */
function _flushSfxQueue() {
  while (_sfxQueue.length) {
    const event = _sfxQueue.shift();
    const variantId = _currentSfxMap[event];
    if (variantId) {
      audio.sfx[variantId]?.();
    } else {
      console.warn(`[audio-state] _flushSfxQueue: evento "${event}" não encontrado no SFX_MAP.`);
    }
  }
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
    const configs = await carregarConfigs(uid);
    const saved   = configs?.audioState;
    const savedSfxMap = configs?.sfxMap ?? null;
    return {
      mode:   VALID_MODES.includes(saved) ? saved : null,
      sfxMap: savedSfxMap && typeof savedSfxMap === 'object' ? savedSfxMap : null,
    };
  } catch (err) {
    console.warn('[audio-state] Erro ao carregar Firebase:', err);
    return { mode: null, sfxMap: null };
  }
}

function _persistToFirebase(modeId) {
  if (!_currentUid) return;

  const uid = _currentUid;

  import('../../../src/global.js').then(({ getConfigs }) => {
    const configsAtuais = getConfigs();
    const payload = { ...configsAtuais, audioState: modeId, sfxMap: _currentSfxMap };
    salvarConfigs(uid, payload).catch(err => {
      console.warn(`[audio-state] Erro ao salvar Firebase (uid="${uid}"):`, err);
    });
  }).catch(err => {
    console.warn('[audio-state] fallback save sem configs completas:', err);
    salvarConfigs(uid, { audioState: modeId, sfxMap: _currentSfxMap }).catch(() => {});
  });
}

function _persistSfxMapToFirebase() {
  if (!_currentUid) return;
  const uid = _currentUid;
  import('../../../src/global.js').then(({ getConfigs }) => {
    const configsAtuais = getConfigs();
    const payload = { ...configsAtuais, audioState: _currentMode, sfxMap: _currentSfxMap };
    salvarConfigs(uid, payload).catch(err => {
      console.warn(`[audio-state] Erro ao salvar sfxMap Firebase (uid="${uid}"):`, err);
    });
  }).catch(err => {
    console.warn('[audio-state] fallback sfxMap save sem configs completas:', err);
    salvarConfigs(uid, { audioState: _currentMode, sfxMap: _currentSfxMap }).catch(() => {});
  });
}

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
  // Qualquer playSound() chamado daqui até o _flushSfxQueue() será enfileirado.
  _sfxReady = false;

  _currentMode = DEFAULT_MODE;
  audio.resetToDefaults();
  _applyToEngine(_currentMode);
  _notify();

  const saved = await _fetchFromFirebase(uid);

  // Guard de race condition: descarta respostas de sessões anteriores.
  if (token !== _activeLoadToken) {
    console.log(`[audio-state] resposta antiga descartada (uid="${uid}", token=${token})`);
    // Garante que _sfxReady não fique preso em false se este era o único load em voo.
    // O token mais recente (logout ou novo login) é responsável por seu próprio _sfxReady.
    return;
  }

  // Aplica o mapa real do usuário.
  _currentMode = saved.mode ?? DEFAULT_MODE;
  _currentSfxMap = saved.sfxMap ? { ...DEFAULT_SFX_MAP, ...saved.sfxMap } : { ...DEFAULT_SFX_MAP };
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
  _currentUid = null;
  _activeLoadToken++;

  _currentMode = DEFAULT_MODE;
  _currentSfxMap = { ...DEFAULT_SFX_MAP };
  audio.resetToDefaults();
  _applyToEngine(_currentMode);
  _notify();

  // Descarta fila do login anterior e libera sons imediatamente
  // (visitante usa DEFAULT_SFX_MAP, não precisa esperar nada).
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
    _persistToFirebase(_currentMode);
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

    // Suspende sons até o mapa deste uid ser aplicado.
    _sfxReady = false;

    const saved = await _fetchFromFirebase(uid);

    if (token !== _activeLoadToken) {
      console.log(`[audio-state] loadFromFirebase descartado (uid="${uid}", token=${token})`);
      return;
    }

    _currentMode = saved.mode ?? DEFAULT_MODE;
    _currentSfxMap = saved.sfxMap ? { ...DEFAULT_SFX_MAP, ...saved.sfxMap } : { ...DEFAULT_SFX_MAP };
    _applyToEngine(_currentMode);
    _notify();

    // Ativa e drena a fila.
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

  /**
   * Indica se o SFX_MAP do Firebase já foi carregado e aplicado.
   *
   * play.js consulta este método antes de executar um som.
   * false → o mapa ainda não chegou do Firebase (janela de login).
   * true  → mapa pronto; pode tocar imediatamente.
   *
   * @returns {boolean}
   */
  isReady() {
    return _sfxReady;
  },

  /**
   * Enfileira um evento de áudio para ser tocado assim que o SFX_MAP
   * estiver pronto. Chamado por play.js quando isReady() === false.
   *
   * Os eventos são drenados em ordem FIFO por _flushSfxQueue(),
   * com o mapa correto do usuário já aplicado.
   *
   * @param {string} event — chave do SFX_MAP (ex: 'click', 'hover')
   */
  enqueue(event) {
    _sfxQueue.push(event);
  },

};

export default audioState;