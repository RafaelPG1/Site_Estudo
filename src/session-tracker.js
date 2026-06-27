/* =============================================
   NEXUS STUDY — src/session-tracker.js
   Rastreamento global de sessão com Firebase

   v5 — Tempo contínuo global (Camada 1)
   ─────────────────────────────────────────────
   FILOSOFIA v5
   ─────────────────────────────────────────────
   Sessões são blocos técnicos de contribuição para
   um tempo global único. O usuário não "abre sessões"
   — ele simplesmente usa o site. Todo o tempo ativo
   é acumulado em tempoTotalGeral de forma monotônica.

   CORREÇÕES v5
   ─────────────────────────────────────────────
   • Proteção contra sessões zumbi: ao iniciar, busca
     sessões com endedAt há mais de ZOMBIE_THRESHOLD ms
     sem delta final e aplica o tempo pendente antes de
     criar nova sessão.
   • Proteção multi-aba: BroadcastChannel garante que
     apenas uma aba por vez conta tempo ativo. As demais
     pausam automaticamente e retomam se a aba principal
     for fechada.
   • tempoTotalGeral monotônico: o flush usa Math.max
     para nunca decrementar o total global.
   • delta calculado a partir do documento Firestore,
     não de estado em memória — evita dupla contagem
     entre abas e entre sessões.

   ESTRUTURA NO FIRESTORE (inalterada)
   ───────────────────────────────────
   usuarios/{uid}/sessoes/{sessionId}
     startedAt    : number
     endedAt      : number
     duracao      : number  (segundos ativos desta sessão)
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
     tempoTotalGeral : number  (monotônico — nunca diminui)
     ultimaAtividade : number
     totalSessoes    : number
   ============================================= */

import {
  getFirestore,
  doc, getDoc, setDoc, updateDoc, increment,
  collection, query, orderBy, limit, getDocs, where,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { getDb } from './firebase.js';
import { getUsuario } from './global.js';

/* ══════════════════════════════════════════════
   CONSTANTES
══════════════════════════════════════════════ */
const HEARTBEAT_INTERVAL  = 30_000;
const TICK_INTERVAL       = 1_000;
const SESSION_KEY         = 'nexus_session_id';
const SESSION_START_KEY   = 'nexus_session_start';
const BC_CHANNEL_NAME     = 'nexus_tab_sync';
const ZOMBIE_THRESHOLD    = 5 * 60 * 1000; // 5 min sem heartbeat = sessão zumbi

/* ══════════════════════════════════════════════
   ESTADO INTERNO — SESSÃO
══════════════════════════════════════════════ */
let _sessionId       = null;
let _startedAt       = null;
let _activeSeconds   = 0;
let _isRunning       = false;
let _tickTimer       = null;
let _heartbeatTimer  = null;
let _initialized     = false;
let _uid             = null;

/* Controle de delta para flush incremental */
let _lastFlushedSeconds = 0;

/* PERFORMANCE ANALYTICS */
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
   MULTI-ABA — BroadcastChannel
   Garante que apenas uma aba conta tempo por vez.
   A aba "líder" envia heartbeats de liderança a
   cada 5s. Se outra aba não recebe por 8s, assume
   a liderança e retoma o tick.
══════════════════════════════════════════════ */
let _isLeader         = false;
let _bc               = null;
let _leaderPingTimer  = null;
let _leaderCheckTimer = null;
let _lastLeaderPing   = 0;

const LEADER_PING_INTERVAL  = 5_000;
const LEADER_CHECK_INTERVAL = 2_000;
const LEADER_TIMEOUT        = 8_000;

function _initBroadcastChannel() {
  if (!window.BroadcastChannel) {
    /* Sem suporte — esta aba assume liderança incondicionalmente */
    _becomeLeader();
    return;
  }

  _bc = new BroadcastChannel(BC_CHANNEL_NAME);

  _bc.onmessage = (e) => {
    if (!e.data || e.data.uid !== _uid) return;

    if (e.data.type === 'leader_ping') {
      /* Outra aba é líder — pausa esta */
      _lastLeaderPing = Date.now();
      if (_isLeader) _resignLeadership();
    }

    if (e.data.type === 'leader_resign') {
      /* Lider anterior saiu — compete por liderança */
      _lastLeaderPing = 0;
    }
  };

  /* Tenta se tornar líder após breve delay para deixar aba existente pingar */
  setTimeout(() => {
    const tempoDesdeUltimoPing = Date.now() - _lastLeaderPing;
    if (tempoDesdeUltimoPing > LEADER_TIMEOUT) {
      _becomeLeader();
    }
  }, LEADER_CHECK_INTERVAL);

  /* Monitor contínuo: assume liderança se o líder sumiu */
  _leaderCheckTimer = setInterval(() => {
    if (_isLeader) return;
    const tempoDesdeUltimoPing = Date.now() - _lastLeaderPing;
    if (tempoDesdeUltimoPing > LEADER_TIMEOUT) {
      _becomeLeader();
    }
  }, LEADER_CHECK_INTERVAL);
}

function _becomeLeader() {
  if (_isLeader) return;
  _isLeader = true;
  _isRunning = document.visibilityState !== 'hidden';
  console.log('[session-tracker] esta aba assumiu a liderança');

  /* Pinga regularmente para manter liderança */
  _leaderPingTimer = setInterval(() => {
    _bc?.postMessage({ type: 'leader_ping', uid: _uid });
  }, LEADER_PING_INTERVAL);
}

function _resignLeadership() {
  if (!_isLeader) return;
  _isLeader  = false;
  _isRunning = false;
  clearInterval(_leaderPingTimer);
  _leaderPingTimer = null;
  _bc?.postMessage({ type: 'leader_resign', uid: _uid });
  console.log('[session-tracker] liderança cedida a outra aba');
}

function _destroyBroadcastChannel() {
  if (_isLeader) {
    _bc?.postMessage({ type: 'leader_resign', uid: _uid });
  }
  clearInterval(_leaderPingTimer);
  clearInterval(_leaderCheckTimer);
  _leaderPingTimer  = null;
  _leaderCheckTimer = null;
  _isLeader         = false;
  _bc?.close();
  _bc = null;
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
  const payload = getStats();
  _listeners.forEach(fn => { try { fn(payload); } catch (_) {} });
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
function _sessaoRef(uid, sid)      { return doc(getDb(), 'usuarios', uid, 'sessoes', sid); }
function _diarioRef(uid, dateKey)  { return doc(getDb(), 'usuarios', uid, 'historico_diario', dateKey); }
function _usuarioRef(uid)          { return doc(getDb(), 'usuarios', uid); }

/* ══════════════════════════════════════════════
   LIMPEZA DE SESSÕES ZUMBI
   Busca sessões antigas desta aba (pelo sessionId
   guardado em sessionStorage) que não foram
   encerradas corretamente e contabiliza o tempo
   pendente antes de criar uma nova sessão.
══════════════════════════════════════════════ */
async function _resolverSessaoZumbi(uid, sessionId) {
  if (!uid || !sessionId) return 0;
  try {
    const snap = await getDoc(_sessaoRef(uid, sessionId));
    if (!snap.exists()) return 0;

    const data        = snap.data();
    const duracaoSalva = data.duracao ?? 0;
    const endedAt      = data.endedAt ?? 0;
    const agora        = Date.now();

    /* Sessão zumbi: endedAt muito antigo (> ZOMBIE_THRESHOLD ms atrás)
       mas duracao parece incompleto — não houve flush final correto */
    const eraZumbi = (agora - endedAt) > ZOMBIE_THRESHOLD;

    if (eraZumbi) {
      console.warn('[session-tracker] sessão zumbi detectada:', sessionId,
        `| duracao salva: ${duracaoSalva}s | endedAt há ${Math.round((agora - endedAt) / 1000)}s`);

      /* Marca a sessão como encerrada — sem adicionar mais tempo */
      await setDoc(_sessaoRef(uid, sessionId), {
        endedAt: endedAt, /* mantém o último endedAt conhecido */
        _encerradaComoZumbi: true,
      }, { merge: true });
    }

    return duracaoSalva;
  } catch (err) {
    console.warn('[session-tracker] _resolverSessaoZumbi:', err);
    return 0;
  }
}

/* ══════════════════════════════════════════════
   OPERAÇÕES NO FIRESTORE
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

/**
 * Flush incremental: envia apenas o delta de segundos
 * desde o último flush, evitando dupla contagem entre
 * abas e entre chamadas.
 *
 * tempoTotalGeral usa Math.max no Firestore (via leitura
 * prévia) para garantir monotonicidade mesmo que duas abas
 * façam flush simultâneo.
 */
async function _flush() {
  if (!_uid || !_sessionId) return;

  const now     = Date.now();
  const dataKey = _dateKey(_startedAt);

  _finalizarPaginaAtual();

  try {
    /* Lê o estado atual da sessão para calcular delta real */
    const snapSessao   = await getDoc(_sessaoRef(_uid, _sessionId));
    const duracaoSalva = snapSessao.exists() ? (snapSessao.data().duracao ?? 0) : 0;
    const delta        = Math.max(0, _activeSeconds - duracaoSalva);

    /* Atualiza sessão */
    await setDoc(_sessaoRef(_uid, _sessionId), {
      endedAt:    now,
      duracao:    _activeSeconds,
      quizEvents: _quizEvents.length > 0 ? _quizEvents : [],
      pages:      _navPages,
      navigation: _navSequence,
      hourHeatmap: _navHourHeatmap,
      deviceType: _navDeviceType,
    }, { merge: true });

    if (delta > 0) {
      /* Diário */
      await setDoc(_diarioRef(_uid, dataKey), {
        data:       dataKey,
        tempoTotal: increment(delta),
        updatedAt:  now,
      }, { merge: true });

      /* Global — lê o valor atual para garantir monotonicidade */
      const snapUsuario       = await getDoc(_usuarioRef(_uid));
      const totalAtual        = snapUsuario.exists()
        ? (snapUsuario.data().tempoTotalGeral ?? 0)
        : 0;
      const novoTotal         = totalAtual + delta;

      await setDoc(_usuarioRef(_uid), {
        tempoTotalGeral: novoTotal,  /* valor absoluto monotônico */
        ultimaAtividade: now,
      }, { merge: true });

      _lastFlushedSeconds = _activeSeconds;
    }

    console.log(`[session-tracker] flush: ${_activeSeconds}s | delta=${delta}s | apenas líder: ${_isLeader}`);
  } catch (err) {
    console.warn('[session-tracker] _flush:', err);
  }
}

/* ══════════════════════════════════════════════
   TIMER LOCAL
══════════════════════════════════════════════ */
function _startTick() {
  if (_tickTimer) return;
  _tickTimer = setInterval(() => {
    /* Só incrementa se esta aba for a líder E estiver visível */
    if (_isRunning && _isLeader) {
      _activeSeconds++;
      _notify();
    }
  }, TICK_INTERVAL);
}

function _stopTick() {
  clearInterval(_tickTimer);
  _tickTimer = null;
}

function _startHeartbeat() {
  if (_heartbeatTimer) return;
  _heartbeatTimer = setInterval(() => {
    if (_isLeader) _flush();
  }, HEARTBEAT_INTERVAL);
}

function _stopHeartbeat() {
  clearInterval(_heartbeatTimer);
  _heartbeatTimer = null;
}

/* ══════════════════════════════════════════════
   VISIBILIDADE DA ABA
══════════════════════════════════════════════ */
function _onVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    _isRunning = false;
    if (_isLeader) _flush();
  } else {
    /* Só retoma o tick se esta aba for (ou se tornar) líder */
    if (_isLeader) _isRunning = true;
    if (_navCurrentPage !== null) _navPageStart = Date.now();
  }
}

function _onBeforeUnload() {
  _isRunning = false;
  if (_isLeader) {
    _bc?.postMessage({ type: 'leader_resign', uid: _uid });
    _flush().catch(() => {});
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
        const data = snap.data();
        _sessionId          = storedId;
        _startedAt          = storedStart;
        _activeSeconds      = data.duracao ?? 0;
        _lastFlushedSeconds = _activeSeconds;
        _quizEvents         = Array.isArray(data.quizEvents) ? data.quizEvents : [];
        _navPages           = _isPlainObject(data.pages)       ? data.pages       : {};
        _navSequence        = Array.isArray(data.navigation)   ? data.navigation  : [];
        _navHourHeatmap     = _isPlainObject(data.hourHeatmap) ? data.hourHeatmap : {};
        _navDeviceType      = typeof data.deviceType === 'string' ? data.deviceType : _detectDevice();
        console.log(`[session-tracker] sessão recuperada: ${_sessionId} (${_activeSeconds}s)`);
      } else {
        /* Sessão não encontrada no Firestore — cria nova */
        await _criarNovaSessaoComAntiZumbi();
      }
    } catch (_) {
      await _criarNovaSessaoComAntiZumbi();
    }
  } else {
    await _criarNovaSessaoComAntiZumbi();
  }

  _initialized = true;

  _startTick();
  _startHeartbeat();
  _initBroadcastChannel();

  document.addEventListener('visibilitychange', _onVisibilityChange);
  window.addEventListener('beforeunload', _onBeforeUnload);

  /* Cria no Firestore apenas se não existia */
  if (!storedId || !(await getDoc(_sessaoRef(uid, _sessionId))).exists()) {
    await _criarSessaoFirestore();
  }

  __nexusPageEnter(location.pathname);
  _notify();
}

async function _criarNovaSessaoComAntiZumbi() {
  /* Resolve possível sessão zumbi antes de criar nova */
  const storedId = sessionStorage.getItem(SESSION_KEY);
  if (storedId && _uid) {
    await _resolverSessaoZumbi(_uid, storedId);
  }
  _criarNovaSessao();
}

function _criarNovaSessao() {
  _sessionId          = _newSessionId();
  _startedAt          = Date.now();
  _activeSeconds      = 0;
  _lastFlushedSeconds = 0;
  _quizEvents         = [];
  _navPages           = {};
  _navSequence        = [];
  _navHourHeatmap     = {};
  _navDeviceType      = _detectDevice();
  _navCurrentPage     = null;
  _navPageStart       = null;

  sessionStorage.setItem(SESSION_KEY, _sessionId);
  sessionStorage.setItem(SESSION_START_KEY, String(_startedAt));
}

export async function destroy() {
  if (!_initialized) return;

  _isRunning = false;
  _stopTick();
  _stopHeartbeat();
  _destroyBroadcastChannel();

  document.removeEventListener('visibilitychange', _onVisibilityChange);
  window.removeEventListener('beforeunload', _onBeforeUnload);

  await _flush();

  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_START_KEY);

  _sessionId          = null;
  _startedAt          = null;
  _activeSeconds      = 0;
  _lastFlushedSeconds = 0;
  _uid                = null;
  _initialized        = false;
  _quizEvents         = [];
  _navPages           = {};
  _navSequence        = [];
  _navHourHeatmap     = {};
  _navCurrentPage     = null;
  _navPageStart       = null;

  _notify();
}

/* ══════════════════════════════════════════════
   API PÚBLICA
══════════════════════════════════════════════ */
export function getStats() {
  return {
    sessionId:      _sessionId,
    uid:            _uid,
    activeSeconds:  _activeSeconds,
    isRunning:      _isRunning && _isLeader,
    isLeader:       _isLeader,
    startedAt:      _startedAt,
    initialized:    _initialized,
    quizEvents:     _quizEvents.slice(),
    navPages:       Object.assign({}, _navPages),
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
   Retorna visão de tempo GLOBAL contínuo.
   tempoTotalGeral é o número canônico de referência.
   sessões são apenas metadados técnicos.
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

    /* Streak: dias consecutivos com tempoTotal > 0, contando de hoje */
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(hoje);
      d.setDate(d.getDate() - i);
      const key = _dateKey(d.getTime());
      if (historico[key]?.tempoTotal > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    const hojeKey   = _dateKey();
    const tempoHoje = historico[hojeKey]?.tempoTotal ?? 0;

    /* Tempo médio diário (apenas dias com registro nos últimos 30) */
    const diasComTempo  = Object.values(historico).filter(d => d.tempoTotal > 0);
    const mediaDiaria   = diasComTempo.length > 0
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

    /* Dias ativos nos últimos 30 */
    const diasAtivos30 = diasComTempo.length;

    /* Melhor dia nos últimos 30 */
    const melhorDia = diasComTempo.reduce(
      (best, d) => (d.tempoTotal > best.tempo ? { key: d.data, tempo: d.tempoTotal } : best),
      { key: null, tempo: 0 }
    );

    return {
      /* Tempo global contínuo */
      tempoTotalGeral: dadosUsuario.tempoTotalGeral ?? 0,
      totalSessoes:    dadosUsuario.totalSessoes    ?? 0,
      ultimaAtividade: dadosUsuario.ultimaAtividade ?? null,

      /* Hoje */
      tempoHoje,

      /* Sequência e regularidade */
      streak,
      diasAtivos30,
      mediaDiaria,
      melhorDia,

      /* Série temporal */
      ultimos7,
      historico,
    };
  } catch (err) {
    console.error('[session-tracker] carregarEstatisticas:', err);
    return null;
  }
}

/* ══════════════════════════════════════════════
   NAVIGATION ANALYTICS — helpers internos
══════════════════════════════════════════════ */
function _finalizarPaginaAtual() {
  if (_navCurrentPage === null || _navPageStart === null) return;

  const agora   = Date.now();
  const elapsed = Math.round((agora - _navPageStart) / 1000);

  if (elapsed > 0) {
    if (!_navPages[_navCurrentPage]) {
      _navPages[_navCurrentPage] = { time: 0, visits: 0 };
    }
    _navPages[_navCurrentPage].time += elapsed;
    console.log(`[session-tracker] página finalizada: ${_navCurrentPage} | +${elapsed}s`);
  }

  _navPageStart = null;
}

/* ══════════════════════════════════════════════
   NAVIGATION ANALYTICS — API GLOBAL PÚBLICA
══════════════════════════════════════════════ */
function __nexusPageEnter(pathname) {
  if (typeof pathname !== 'string' || !pathname) return;
  if (pathname === _navCurrentPage) return;

  _finalizarPaginaAtual();

  _navCurrentPage = pathname;
  _navPageStart   = Date.now();

  if (!_navPages[pathname]) _navPages[pathname] = { time: 0, visits: 0 };
  _navPages[pathname].visits += 1;

  _navSequence.push(pathname);

  const hour = String(new Date().getHours());
  _navHourHeatmap[hour] = (_navHourHeatmap[hour] ?? 0) + 1;

  console.log('[session-tracker] __nexusPageEnter →', pathname,
    `| visitas: ${_navPages[pathname].visits} | hora: ${hour}h`);

  if (_initialized && _uid && _isLeader) {
    _flush().catch(() => {});
  }
}

window.__nexusPageEnter = __nexusPageEnter;

/* ══════════════════════════════════════════════
   PERFORMANCE ANALYTICS — quiz finalizado
══════════════════════════════════════════════ */
window.addEventListener('nexus:quizFinalizado', function (e) {
  if (!_initialized || !e?.detail) return;

  const p        = e.detail;
  const snapshot = {
    disc:          p.disc          ?? null,
    modo:          p.modo          ?? null,
    semestre:      p.semestre      ?? null,
    totalQuestoes: p.totalQuestoes ?? 0,
    acertos:       p.acertos       ?? 0,
    taxaAcerto:    typeof p.taxaAcerto === 'number' ? p.taxaAcerto : 0,
    tempoGastoSeg: p.tempoGastoSeg ?? 0,
    revealed:      p.revealed      ?? false,
    ts:            Date.now(),
  };

  _quizEvents.push(snapshot);

  console.log('[session-tracker] quiz registrado:',
    snapshot.disc + '/' + snapshot.modo,
    '| taxa:', Math.round(snapshot.taxaAcerto * 100) + '%');

  if (_isLeader) _flush().catch(() => {});
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