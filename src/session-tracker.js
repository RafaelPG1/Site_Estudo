/* =============================================
   NEXUS STUDY — src/session-tracker.js

   v7 — Lock determinístico de aba única (Camada 1 — FINAL)
   ─────────────────────────────────────────────
   PROBLEMA RESOLVIDO EM v7
   ─────────────────────────────────────────────
   A v6 usava BroadcastChannel como sinalização de
   "quem está contando" — isso é um evento frágil
   (mensagem pode se perder, ordem não é garantida,
   uma aba pode nunca receber o aviso de pausa).
   Resultado possível: duas abas com runStart ativo
   ao mesmo tempo → tempo duplicado.

   v7 substitui o mecanismo por um LOCK GLOBAL escrito
   diretamente no localStorage, com expiração por TTL.
   A pergunta "esta aba pode contar tempo?" deixa de
   depender de eventos recebidos e passa a depender de
   uma ÚNICA leitura síncrona:

       localStorage.getItem(LOCK_ID_KEY) === meuTabId
       &&
       (Date.now() - lockTimestamp) < LOCK_TTL

   Isso é determinístico: mesmo estado de localStorage
   sempre produz a mesma resposta, em qualquer aba, sem
   depender de mensagens já entregues ou timers de espera
   arbitrários para "decidir" quem assumiu primeiro.

   ─────────────────────────────────────────────
   ARQUITETURA v7
   ─────────────────────────────────────────────

   ┌─────────────────────────────────────────────┐
   │  LOCK GLOBAL (localStorage)                 │
   │  · nexus_active_tab_id        (dono atual)  │
   │  · nexus_active_tab_timestamp (heartbeat)   │
   │  → único mecanismo que decide quem conta     │
   ├─────────────────────────────────────────────┤
   │  FONTE DA VERDADE DO TEMPO: localStorage     │
   │  · tempo acumulado entre páginas             │
   │  · timestamps de início / pausa              │
   │  · cálculo: accum + (Date.now() - runStart)  │
   │             — SOMENTE se dono do lock        │
   ├─────────────────────────────────────────────┤
   │  CONTEXTO DA SESSÃO: sessionStorage          │
   │  · sessionId (referência técnica)            │
   │  · startedAt (início da sessão)              │
   ├─────────────────────────────────────────────┤
   │  PERSISTÊNCIA: Firebase                      │
   │  · recebe apenas delta calculado localmente  │
   │  · NÃO participa do cálculo de tempo ativo   │
   │  · NÃO é lido para decidir/ajustar tempo     │
   │  · gravado em heartbeats e no unload         │
   └─────────────────────────────────────────────┘

   GARANTIAS desta versão
   ─────────────────────────────────────────────
   ✔ Apenas 1 aba tem runStart ativo em qualquer
     instante — garantido por leitura do lock, não
     por mensagens de coordenação.
   ✔ O lock expira (TTL) se a aba dona não renovar
     (crash, fechamento sem beforeunload, etc.) —
     outra aba assume automaticamente no próximo
     ciclo de verificação.
   ✔ Fechar a aba ativa libera o lock explicitamente
     (beforeunload) — a próxima aba visível assume
     no ciclo de verificação seguinte, sem espera de
     TTL completo.
   ✔ Reload não duplica tempo: a aba ao recarregar
     gera um novo tabId, mas o accum em localStorage
     pertence à SESSÃO (chave global, não por aba) —
     o tempo continua de onde parou.
   ✔ Offline não quebra nada: todo o cálculo de tempo
     é 100% local. Firebase só recebe o delta quando
     conseguir (heartbeat/flush), sem bloquear ou
     alterar o cálculo.
   ✔ Firestore nunca é lido para decidir quanto tempo
     somar — o delta enviado é sempre
     activeSecondsLocal - ultimoDeltaJaEnviadoLocal,
     ambos lidos do localStorage, nunca do Firestore.

   REMOVIDO em v7 (em relação à v6)
   ─────────────────────────────────────────────
   · BroadcastChannel como mecanismo de decisão
     (mantido apenas como ATALHO opcional de latência,
     nunca como fonte de verdade — ver nota abaixo)
   · leitura de `duracao` salva no Firestore para
     calcular delta (delta agora vem 100% do
     localStorage local, via LS_LAST_SENT_KEY)
   · qualquer estado "isLeader" derivado de mensagens
     recebidas — agora é 100% derivado do lock

   NOTA SOBRE BroadcastChannel
   ─────────────────────────────────────────────
   BroadcastChannel é mantido SOMENTE como notificação
   de "ei, talvez algo mudou, recalcule o lock agora"
   para reduzir a latência de transferência entre abas
   (em vez de esperar o próximo tick do poll de 2s).
   Nenhuma decisão de contagem de tempo é tomada com
   base em uma mensagem recebida — toda decisão sempre
   relê o lock diretamente do localStorage no momento
   da verificação. Se BroadcastChannel não existir no
   navegador, o sistema funciona de forma idêntica,
   apenas com a latência de transferência igual ao
   intervalo de polling (LOCK_POLL_INTERVAL).

   API pública 100% compatível (getStats, subscribe,
   formatTime, formatTimeHuman, carregarEstatisticas)

   ESTRUTURA NO FIRESTORE (inalterada)
   ───────────────────────────────────
   usuarios/{uid}/sessoes/{sessionId}
     startedAt    : number
     endedAt      : number
     duracao      : number  (segundos ativos — calculados localmente)
     paginaInicial: string
     dataKey      : string
     quizEvents   : Array
     pages        : Object
     navigation   : Array
     hourHeatmap  : Object
     deviceType   : string

   usuarios/{uid}/historico_diario/{YYYY-MM-DD}
     data         : string
     tempoTotal   : number
     sessoes      : number
     updatedAt    : number

   usuarios/{uid}
     tempoTotalGeral : number  (monotônico)
     ultimaAtividade : number
     totalSessoes    : number

   MUDANÇA v7.1 — quizEvents agora é logger passivo
   ─────────────────────────────────────────────────
   O listener de nexus:quizFinalizado não interpreta
   mais o payload. Ele armazena o payload BRUTO inteiro
   com um envelope mínimo { tipo, payload, ts }.
   Todo cálculo (acertos, taxa, tempo) pertence
   exclusivamente ao quiz_intelligence.js.
   ============================================= */

import {
  doc, getDoc, setDoc, increment, writeBatch,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { getDb } from './firebase.js';

/* ══════════════════════════════════════════════
   CONSTANTES
══════════════════════════════════════════════ */
const HEARTBEAT_INTERVAL = 30_000;
const NOTIFY_INTERVAL    = 1_000;

const SESSION_KEY        = 'nexus_session_id';
const SESSION_START_KEY  = 'nexus_session_start';

const LS_ACCUM_KEY        = 'nexus_time_accum';
const LS_RUN_START_KEY    = 'nexus_run_start';
const LS_PAUSED_KEY       = 'nexus_paused';
const LS_LAST_SENT_KEY    = 'nexus_time_last_sent';

const LOCK_ID_KEY         = 'nexus_active_tab_id';
const LOCK_TS_KEY         = 'nexus_active_tab_timestamp';
const LOCK_UID_KEY        = 'nexus_active_tab_uid';

const LOCK_TTL            = 7_000;
const LOCK_HEARTBEAT      = 2_000;
const LOCK_POLL_INTERVAL  = 2_000;

const BC_CHANNEL_NAME     = 'nexus_tab_sync';
const ZOMBIE_THRESHOLD    = 5 * 60 * 1000;

/* ══════════════════════════════════════════════
   ESTADO INTERNO — SESSÃO
══════════════════════════════════════════════ */
let _sessionId      = null;
let _startedAt      = null;
let _initialized    = false;
let _uid            = null;
let _notifyTimer    = null;
let _heartbeatTimer = null;

const _tabId = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

let _quizEvents = [];

const _listeners = new Set();

/* ══════════════════════════════════════════════
   ESTADO INTERNO — NAVIGATION ANALYTICS
══════════════════════════════════════════════ */
let _navPages       = {};
let _navSequence    = [];
let _navHourHeatmap = {};
let _navDeviceType  = _detectDevice();
let _navCurrentPage = null;
let _navPageStart   = null;

/* ══════════════════════════════════════════════
   LOCK GLOBAL
══════════════════════════════════════════════ */
let _bc            = null;
let _lockTimer     = null;
let _lockHeartbeat = null;

function _readLock() {
  const rawTs = localStorage.getItem(LOCK_TS_KEY);
  return {
    id:  localStorage.getItem(LOCK_ID_KEY),
    ts:  rawTs === null ? null : Number(rawTs),
    uid: localStorage.getItem(LOCK_UID_KEY),
  };
}

function _isOwner() {
  const { id, uid } = _readLock();
  return id === _tabId && uid === _uid;
}

function _isLockExpired(lock) {
  if (lock.id === null || lock.ts === null) return true;
  return (Date.now() - lock.ts) > LOCK_TTL;
}

function _tryAcquireLock() {
  const lock = _readLock();
  const podeAssumir =
    lock.id === null ||
    lock.uid !== _uid ||
    _isLockExpired(lock) ||
    lock.id === _tabId;
  if (!podeAssumir) return false;
  localStorage.setItem(LOCK_ID_KEY, _tabId);
  localStorage.setItem(LOCK_TS_KEY, String(Date.now()));
  localStorage.setItem(LOCK_UID_KEY, _uid);
  return true;
}

function _renewLock() {
  if (!_isOwner()) return false;
  localStorage.setItem(LOCK_TS_KEY, String(Date.now()));
  return true;
}

function _releaseLock() {
  if (_isOwner()) {
    localStorage.removeItem(LOCK_ID_KEY);
    localStorage.removeItem(LOCK_TS_KEY);
    localStorage.removeItem(LOCK_UID_KEY);
  }
}

function _avaliarPosseDoLock() {
  const visivel = document.visibilityState !== 'hidden';
  if (!visivel) {
    if (_isOwner()) { _pauseLocalTimer(); _releaseLock(); }
    return;
  }
  const eraDona   = _isOwner();
  const agoraDona = _tryAcquireLock();
  if (agoraDona) {
    _resumeLocalTimer();
    if (!eraDona) console.log('[session-tracker] lock adquirido — esta aba agora conta tempo');
  } else if (eraDona) {
    _pauseLocalTimer();
  }
}

function _initLockSystem() {
  _avaliarPosseDoLock();
  _lockTimer     = setInterval(_avaliarPosseDoLock, LOCK_POLL_INTERVAL);
  _lockHeartbeat = setInterval(() => { if (_isOwner()) _renewLock(); }, LOCK_HEARTBEAT);
  if (window.BroadcastChannel) {
    _bc = new BroadcastChannel(BC_CHANNEL_NAME);
    _bc.onmessage = (e) => {
      if (!e.data || e.data.uid !== _uid) return;
      _avaliarPosseDoLock();
    };
  }
  window.addEventListener('storage', (e) => {
    if (e.key === LOCK_ID_KEY || e.key === LOCK_TS_KEY || e.key === LOCK_UID_KEY) {
      _avaliarPosseDoLock();
    }
  });
}

function _destroyLockSystem() {
  clearInterval(_lockTimer);
  clearInterval(_lockHeartbeat);
  _lockTimer     = null;
  _lockHeartbeat = null;
  _releaseLock();
  _bc?.close();
  _bc = null;
}

/* ══════════════════════════════════════════════
   TIMER LOCAL-FIRST
══════════════════════════════════════════════ */
function _calcActiveSeconds() {
  const accum   = _readLSNumber(LS_ACCUM_KEY, 0);
  const paused  = localStorage.getItem(LS_PAUSED_KEY) === '1';
  const running = _hasLSKey(LS_RUN_START_KEY);
  if (paused || !running) return accum;
  const runStart = _readLSNumber(LS_RUN_START_KEY, 0);
  const elapsed  = Math.floor((Date.now() - runStart) / 1000);
  return accum + Math.max(0, elapsed);
}

function _resumeLocalTimer() {
  if (!_isOwner()) return;
  const paused  = localStorage.getItem(LS_PAUSED_KEY) === '1';
  const running = _hasLSKey(LS_RUN_START_KEY);
  if (paused || !running) {
    localStorage.setItem(LS_RUN_START_KEY, String(Date.now()));
    localStorage.removeItem(LS_PAUSED_KEY);
    console.log('[session-tracker] timer local RETOMADO (dona do lock)');
  }
}

function _pauseLocalTimer() {
  const running = _hasLSKey(LS_RUN_START_KEY);
  if (running) {
    const runStart = _readLSNumber(LS_RUN_START_KEY, 0);
    const accum    = _readLSNumber(LS_ACCUM_KEY, 0);
    const elapsed  = Math.floor((Date.now() - runStart) / 1000);
    localStorage.setItem(LS_ACCUM_KEY, String(accum + Math.max(0, elapsed)));
  }
  localStorage.setItem(LS_PAUSED_KEY, '1');
  localStorage.removeItem(LS_RUN_START_KEY);
  console.log('[session-tracker] timer local PAUSADO | acumulado:', localStorage.getItem(LS_ACCUM_KEY) + 's');
}

function _resetLocalTimer() {
  localStorage.setItem(LS_ACCUM_KEY, '0');
  localStorage.setItem(LS_LAST_SENT_KEY, '0');
  localStorage.removeItem(LS_RUN_START_KEY);
  localStorage.removeItem(LS_PAUSED_KEY);
}

/* ══════════════════════════════════════════════
   LEITURA NUMÉRICA SEGURA DE localStorage
══════════════════════════════════════════════ */
function _readLSNumber(key, fallback = 0) {
  const raw = localStorage.getItem(key);
  return raw === null ? fallback : Number(raw);
}

function _hasLSKey(key) {
  return localStorage.getItem(key) !== null;
}

/* ══════════════════════════════════════════════
   UTILITÁRIOS
══════════════════════════════════════════════ */
function _dateKey(ts = Date.now()) {
  const d  = new Date(ts);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function _newSessionId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function _notify() {
  _registrarTempoAtivoNoHeatmap();
  const payload = getStats();
  _listeners.forEach(fn => { try { fn(payload); } catch (_) {} });
}

/* ══════════════════════════════════════════════
   CAMADA 2 — HEATMAP POR TEMPO ATIVO
══════════════════════════════════════════════ */
function _registrarTempoAtivoNoHeatmap() {
  if (!_initialized) return;
  const contandoAgora = _isOwner() && document.visibilityState !== 'hidden';
  if (!contandoAgora) return;
  const hour = String(new Date().getHours());
  _navHourHeatmap[hour] = (_navHourHeatmap[hour] ?? 0) + 1;
}

function _detectDevice() {
  return /Mobile|Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ? 'mobile'
    : 'desktop';
}

function _isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

/* ══════════════════════════════════════════════
   REFS DO FIRESTORE
══════════════════════════════════════════════ */
function _sessaoRef(uid, sid)     { return doc(getDb(), 'usuarios', uid, 'sessoes', sid); }
function _diarioRef(uid, dateKey) { return doc(getDb(), 'usuarios', uid, 'historico_diario', dateKey); }
function _usuarioRef(uid)         { return doc(getDb(), 'usuarios', uid); }

/* ══════════════════════════════════════════════
   CRIAÇÃO DE SESSÃO NO FIRESTORE
══════════════════════════════════════════════ */
async function _criarSessaoFirestore() {
  if (!_uid || !_sessionId) return;
  try {
    const dataKey = _dateKey(_startedAt);
    await setDoc(_sessaoRef(_uid, _sessionId), {
      startedAt:     _startedAt,
      endedAt:       _startedAt,
      duracao:       0,
      paginaInicial: location.pathname,
      dataKey,
      quizEvents:    [],
      pages:         {},
      navigation:    [],
      hourHeatmap:   {},
      deviceType:    _navDeviceType,
    });
    await setDoc(_usuarioRef(_uid), {
      totalSessoes:    increment(1),
      ultimaAtividade: Date.now(),
    }, { merge: true });
    await setDoc(_diarioRef(_uid, dataKey), {
      data:      dataKey,
      sessoes:   increment(1),
      updatedAt: Date.now(),
    }, { merge: true });
  } catch (err) {
    console.warn('[session-tracker] _criarSessaoFirestore:', err);
  }
}

/* ══════════════════════════════════════════════
   FLUSH
══════════════════════════════════════════════ */
async function _flush() {
  if (!_uid || !_sessionId) return;

  const now           = Date.now();
  const dataKey       = _dateKey(_startedAt);
  const activeSeconds = _calcActiveSeconds();
  const lastSent      = _readLSNumber(LS_LAST_SENT_KEY, 0);
  const delta         = Math.max(0, activeSeconds - lastSent);

  _finalizarPaginaAtual();

  try {
    await setDoc(_sessaoRef(_uid, _sessionId), {
      endedAt:     now,
      duracao:     activeSeconds,
      quizEvents:  _quizEvents.length > 0 ? _quizEvents : [],
      pages:       _navPages,
      navigation:  _navSequence,
      hourHeatmap: _navHourHeatmap,
      deviceType:  _navDeviceType,
    }, { merge: true });

    if (delta > 0) {
      const batch = writeBatch(getDb());
      batch.set(_diarioRef(_uid, dataKey), {
        data:       dataKey,
        tempoTotal: increment(delta),
        updatedAt:  now,
      }, { merge: true });
      batch.set(_usuarioRef(_uid), {
        tempoTotalGeral: increment(delta),
        ultimaAtividade: now,
      }, { merge: true });
      await batch.commit();
      localStorage.setItem(LS_LAST_SENT_KEY, String(activeSeconds));
    }

    console.log(`[session-tracker] flush: ${activeSeconds}s local | delta=${delta}s → Firebase`);
  } catch (err) {
    console.warn('[session-tracker] _flush (delta preservado para retry):', err);
  }
}

/* ══════════════════════════════════════════════
   VISIBILIDADE DA ABA
══════════════════════════════════════════════ */
function _onVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    if (_isOwner()) {
      _pauseLocalTimer();
      _releaseLock();
      _flush().catch(() => {});
    }
    _bc?.postMessage({ type: 'reavaliar', uid: _uid });
  } else {
    _avaliarPosseDoLock();
    _bc?.postMessage({ type: 'reavaliar', uid: _uid });
    if (_navCurrentPage !== null) _navPageStart = Date.now();
  }
}

function _onBeforeUnload() {
  if (_isOwner()) {
    _pauseLocalTimer();
    _releaseLock();
    _flush().catch(() => {});
  }
  _bc?.postMessage({ type: 'reavaliar', uid: _uid });
}

/* ══════════════════════════════════════════════
   LIMPEZA DE SESSÕES ZUMBI
══════════════════════════════════════════════ */
async function _resolverSessaoZumbi(uid, sessionId) {
  if (!uid || !sessionId) return;
  try {
    const snap = await getDoc(_sessaoRef(uid, sessionId));
    if (!snap.exists()) return;
    const data   = snap.data();
    const eZumbi = (Date.now() - (data.endedAt ?? 0)) > ZOMBIE_THRESHOLD;
    if (eZumbi) {
      console.warn('[session-tracker] sessão zumbi detectada:', sessionId,
        `| duração salva: ${data.duracao ?? 0}s`);
      await setDoc(_sessaoRef(uid, sessionId), { _encerradaComoZumbi: true }, { merge: true });
    }
  } catch (err) {
    console.warn('[session-tracker] _resolverSessaoZumbi:', err);
  }
}

/* ══════════════════════════════════════════════
   INIT / TEARDOWN PÚBLICO
══════════════════════════════════════════════ */
export async function init(uid) {
  if (!uid) return;
  if (_initialized && _uid === uid) return;
  if (_initialized) await destroy();

  _uid = uid;

  const storedId    = sessionStorage.getItem(SESSION_KEY);
  const storedStart = Number(sessionStorage.getItem(SESSION_START_KEY) || 0);

  if (storedId && storedStart) {
    try {
      const snap = await getDoc(_sessaoRef(uid, storedId));
      if (snap.exists()) {
        const data      = snap.data();
        _sessionId      = storedId;
        _startedAt      = storedStart;
        _quizEvents     = Array.isArray(data.quizEvents) ? data.quizEvents : [];
        _navPages       = _isPlainObject(data.pages)       ? data.pages       : {};
        _navSequence    = Array.isArray(data.navigation)   ? data.navigation  : [];
        _navHourHeatmap = _isPlainObject(data.hourHeatmap) ? data.hourHeatmap : {};
        _navDeviceType  = typeof data.deviceType === 'string' ? data.deviceType : _detectDevice();
        const lsAccum   = _readLSNumber(LS_ACCUM_KEY, 0);
        console.log(`[session-tracker] sessão recuperada: ${_sessionId} | localStorage: ${lsAccum}s`);
      } else {
        await _iniciarNovaSessao();
      }
    } catch (_) {
      await _iniciarNovaSessao();
    }
  } else {
    await _iniciarNovaSessao();
  }

  _initialized = true;
  _initLockSystem();

  _notifyTimer = setInterval(() => { _notify(); }, NOTIFY_INTERVAL);
  _heartbeatTimer = setInterval(() => { if (_isOwner()) _flush(); }, HEARTBEAT_INTERVAL);

  document.addEventListener('visibilitychange', _onVisibilityChange);
  window.addEventListener('beforeunload', _onBeforeUnload);
  _installNavAutoDetect();

  const eNova = !storedId;
  if (eNova) await _criarSessaoFirestore();

  __nexusPageEnter(location.pathname);
  _notify();
}

async function _iniciarNovaSessao() {
  const storedId = sessionStorage.getItem(SESSION_KEY);
  if (storedId && _uid) await _resolverSessaoZumbi(_uid, storedId);

  _sessionId      = _newSessionId();
  _startedAt      = Date.now();
  _quizEvents     = [];
  _navPages       = {};
  _navSequence    = [];
  _navHourHeatmap = {};
  _navDeviceType  = _detectDevice();
  _navCurrentPage = null;
  _navPageStart   = null;

  _resetLocalTimer();
  sessionStorage.setItem(SESSION_KEY, _sessionId);
  sessionStorage.setItem(SESSION_START_KEY, String(_startedAt));
}

export async function destroy() {
  if (!_initialized) return;

  clearInterval(_notifyTimer);
  clearInterval(_heartbeatTimer);
  _notifyTimer    = null;
  _heartbeatTimer = null;

  if (_isOwner()) {
    _pauseLocalTimer();
    await _flush();
  }

  _destroyLockSystem();

  document.removeEventListener('visibilitychange', _onVisibilityChange);
  window.removeEventListener('beforeunload', _onBeforeUnload);

  _resetLocalTimer();
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_START_KEY);

  _sessionId      = null;
  _startedAt      = null;
  _uid            = null;
  _initialized    = false;
  _quizEvents     = [];
  _navPages       = {};
  _navSequence    = [];
  _navHourHeatmap = {};
  _navCurrentPage = null;
  _navPageStart   = null;

  _notify();
}

/* ══════════════════════════════════════════════
   API PÚBLICA
══════════════════════════════════════════════ */
export function getStats() {
  const dono = _isOwner();
  return {
    sessionId:      _sessionId,
    uid:            _uid,
    activeSeconds:  _calcActiveSeconds(),
    isRunning:      dono && document.visibilityState !== 'hidden',
    isLeader:       dono,
    startedAt:      _startedAt,
    initialized:    _initialized,
    quizEvents:     _quizEvents.slice(),
    navPages:       Object.fromEntries(
                      Object.entries(_navPages).map(([k, v]) => [k, { ...v }])
                    ),
    navSequence:    _navSequence.slice(),
    navHourHeatmap: Object.assign({}, _navHourHeatmap),
    navDeviceType:  _navDeviceType,
    navCurrentPage: _navCurrentPage,
  };
}

export function formatTime(seconds) {
  const s   = Math.max(0, Math.floor(seconds));
  const h   = Math.floor(s / 3600);
  const m   = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function formatTimeHuman(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m > 0 ? m + 'm' : ''}`.trim();
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

/* ══════════════════════════════════════════════
   carregarEstatisticas
══════════════════════════════════════════════ */
export async function carregarEstatisticas(uid) {
  if (!uid) return null;
  try {
    const db = getDb();

    const snapUsuario  = await getDoc(doc(db, 'usuarios', uid));
    const dadosUsuario = snapUsuario.exists() ? snapUsuario.data() : {};

    const hoje      = new Date();
    const historico = {};
    const promises  = [];

    for (let i = 0; i < 30; i++) {
      const d = new Date(hoje);
      d.setDate(d.getDate() - i);
      const key = _dateKey(d.getTime());
      promises.push(
        getDoc(doc(db, 'usuarios', uid, 'historico_diario', key))
          .then(snap => { if (snap.exists()) historico[key] = snap.data(); })
          .catch(() => {})
      );
    }

    await Promise.all(promises);

    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(hoje);
      d.setDate(d.getDate() - i);
      const key = _dateKey(d.getTime());
      if (historico[key]?.tempoTotal > 0) streak++;
      else if (i > 0) break;
    }

    const hojeKey   = _dateKey();
    const tempoHoje = historico[hojeKey]?.tempoTotal ?? 0;

    const diasComTempo = Object.values(historico).filter(d => d.tempoTotal > 0);
    const mediaDiaria  = diasComTempo.length > 0
      ? Math.floor(diasComTempo.reduce((a, d) => a + d.tempoTotal, 0) / diasComTempo.length)
      : 0;

    const ultimos7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoje);
      d.setDate(d.getDate() - i);
      const key = _dateKey(d.getTime());
      ultimos7.push({
        key,
        tempoTotal: historico[key]?.tempoTotal ?? 0,
        sessoes:    historico[key]?.sessoes    ?? 0,
      });
    }

    const diasAtivos30 = diasComTempo.length;
    const melhorDia    = diasComTempo.reduce(
      (best, d) => (d.tempoTotal > best.tempo ? { key: d.data, tempo: d.tempoTotal } : best),
      { key: null, tempo: 0 }
    );
    const tempoTotalGeralFinal = dadosUsuario.tempoTotalGeral ?? 0;
    const totalSessoesFinal    = dadosUsuario.totalSessoes    ?? 0;
    const mediaSessao = totalSessoesFinal > 0
      ? Math.floor(tempoTotalGeralFinal / totalSessoesFinal)
      : 0;

    return {
      tempoTotalGeral: tempoTotalGeralFinal,
      totalSessoes:    totalSessoesFinal,
      ultimaAtividade: dadosUsuario.ultimaAtividade ?? null,
      tempoHoje,
      streak,
      diasAtivos30,
      mediaDiaria,
      mediaSessao,
      melhorDia,
      ultimos7,
      historico,
    };
  } catch (err) {
    console.error('[session-tracker] carregarEstatisticas:', err);
    return null;
  }
}

/* ══════════════════════════════════════════════
   NAVIGATION ANALYTICS
══════════════════════════════════════════════ */
function _finalizarPaginaAtual() {
  if (_navCurrentPage === null || _navPageStart === null) return;
  const elapsed = Math.round((Date.now() - _navPageStart) / 1000);
  if (elapsed > 0) {
    if (!_navPages[_navCurrentPage]) _navPages[_navCurrentPage] = { time: 0, visits: 0 };
    _navPages[_navCurrentPage].time += elapsed;
    console.log(`[session-tracker] página finalizada: ${_navCurrentPage} | +${elapsed}s`);
  }
  _navPageStart = null;
}

function __nexusPageEnter(pathname) {
  if (typeof pathname !== 'string' || !pathname) return;
  if (pathname === _navCurrentPage) return;
  _finalizarPaginaAtual();
  _navCurrentPage = pathname;
  _navPageStart   = Date.now();
  if (!_navPages[pathname]) _navPages[pathname] = { time: 0, visits: 0 };
  _navPages[pathname].visits += 1;
  _navSequence.push(pathname);
  console.log('[session-tracker] __nexusPageEnter →', pathname,
    `| visitas: ${_navPages[pathname].visits}`);
  if (_initialized && _uid && _isOwner()) _flush().catch(() => {});
}

window.__nexusPageEnter = __nexusPageEnter;

/* ══════════════════════════════════════════════
   CAMADA 2 — DETECÇÃO AUTOMÁTICA DE NAVEGAÇÃO
══════════════════════════════════════════════ */
let _navAutoDetectInstalled = false;

function _onRotaPodeTerMudado() {
  if (!_initialized) return;
  __nexusPageEnter(location.pathname);
}

function _installNavAutoDetect() {
  if (_navAutoDetectInstalled) return;
  _navAutoDetectInstalled = true;
  window.addEventListener('popstate', _onRotaPodeTerMudado);
  window.addEventListener('hashchange', _onRotaPodeTerMudado);
  const _origPushState    = history.pushState.bind(history);
  const _origReplaceState = history.replaceState.bind(history);
  history.pushState = function (...args) {
    const result = _origPushState(...args);
    _onRotaPodeTerMudado();
    return result;
  };
  history.replaceState = function (...args) {
    const result = _origReplaceState(...args);
    _onRotaPodeTerMudado();
    return result;
  };
}

/* ══════════════════════════════════════════════
   LOGGER PASSIVO DE EVENTOS DE QUIZ
   ─────────────────────────────────────────────
   O session-tracker é um OBSERVADOR. Ele não
   interpreta o payload de quiz — não calcula
   acertos, taxa nem tempo. Armazena o payload
   BRUTO inteiro dentro de um envelope mínimo.

   Todo cálculo pertence exclusivamente ao
   quiz_intelligence.js (Camada 3).

   O envelope gravado em quizEvents é:
     {
       tipo:    'quiz_finalizado',
       payload: <payload bruto do engine>,
       ts:      <timestamp local do registro>
     }

   Consumidores que precisam de acertos/taxa devem
   ler quiz_evolution/* via quiz_intelligence.js,
   nunca derivar esses valores de quizEvents.
══════════════════════════════════════════════ */
window.addEventListener('nexus:quizFinalizado', function (e) {
  if (!_initialized || !e?.detail) return;

  _quizEvents.push({
    tipo:    'quiz_finalizado',
    payload: e.detail,
    ts:      Date.now(),
  });

  console.log('[session-tracker] quiz registrado (bruto):',
    (e.detail.disc ?? '?') + '/' + (e.detail.modo ?? '?'));

  _flush().catch(() => {});
});

/* ══════════════════════════════════════════════
   AUTO-BOOT
══════════════════════════════════════════════ */
document.addEventListener('nexus:loginSuccess', async e => {
  const uid = e?.detail?.uid;
  if (uid) {
    console.log('[session-tracker] nexus:loginSuccess →', uid);
    await init(uid);
  }
});

document.addEventListener('nexus:logout', async () => {
  console.log('[session-tracker] nexus:logout — destruindo sessão');
  await destroy();
});

;(async () => {
  await new Promise(r => setTimeout(r, 50));
  const { getUsuario: _gu } = await import('./global.js').catch(() => ({}));
  const usuario = typeof _gu === 'function' ? _gu() : null;
  if (usuario?.uid) {
    console.log('[session-tracker] boot imediato para', usuario.uid);
    await init(usuario.uid);
  }
})();