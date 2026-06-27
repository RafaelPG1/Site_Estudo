/* =============================================
   NEXUS STUDY — src/session-tracker.js
   Rastreamento global de sessão com Firebase

   ESTRUTURA NO FIRESTORE:
   ───────────────────────
   usuarios/{uid}/sessoes/{sessionId}
     startedAt    : number  (timestamp ms)
     endedAt      : number  (timestamp ms) — atualizado em heartbeats e no unload
     duracao      : number  (segundos ativos totais)
     paginaInicial: string  (pathname da primeira página)
     dataKey      : string  ('YYYY-MM-DD' — chave do dia no histórico diário)
     quizEvents   : Array   (NOVO — snapshots de performance de quizzes desta sessão)

   usuarios/{uid}/historico_diario/{YYYY-MM-DD}
     data         : string  ('YYYY-MM-DD')
     tempoTotal   : number  (segundos acumulados no dia)
     sessoes      : number  (quantidade de sessões no dia)
     updatedAt    : number  (timestamp ms)

   usuarios/{uid}   (merge no documento principal)
     tempoTotalGeral : number  (segundos acumulados em todas as sessões)
     ultimaAtividade : number  (timestamp ms)
     totalSessoes    : number  (contador global de sessões)
   ============================================= */

import {
  getFirestore,
  doc, getDoc, setDoc, updateDoc, increment,
  collection,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { getDb } from './firebase.js';
import { getUsuario } from './global.js';

/* ══════════════════════════════════════════════
   CONSTANTES
══════════════════════════════════════════════ */
const HEARTBEAT_INTERVAL = 30_000;
const TICK_INTERVAL      = 1_000;
const SESSION_KEY        = 'nexus_session_id';
const SESSION_START_KEY  = 'nexus_session_start';

/* ══════════════════════════════════════════════
   ESTADO INTERNO
══════════════════════════════════════════════ */
let _sessionId       = null;
let _startedAt       = null;
let _activeSeconds   = 0;
let _pausedAt        = null;
let _isRunning       = false;
let _tickTimer       = null;
let _heartbeatTimer  = null;
let _initialized     = false;
let _uid             = null;

/* PERFORMANCE ANALYTICS — eventos de quiz desta sessão */
let _quizEvents      = [];

const _listeners = new Set();

/* ══════════════════════════════════════════════
   UTILITÁRIOS
══════════════════════════════════════════════ */
function _dateKey(ts = Date.now()) {
  const d = new Date(ts);
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

/* ══════════════════════════════════════════════
   REFS DO FIRESTORE
══════════════════════════════════════════════ */
function _sessaoRef(uid, sid) {
  return doc(getDb(), 'usuarios', uid, 'sessoes', sid);
}

function _diarioRef(uid, dateKey) {
  return doc(getDb(), 'usuarios', uid, 'historico_diario', dateKey);
}

function _usuarioRef(uid) {
  return doc(getDb(), 'usuarios', uid);
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
      quizEvents:    [],   /* PERFORMANCE ANALYTICS — inicializa vazio */
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

async function _flush() {
  if (!_uid || !_sessionId) return;
  const now     = Date.now();
  const dataKey = _dateKey(_startedAt);

  try {
    const snapSessao  = await getDoc(_sessaoRef(_uid, _sessionId));
    const lastDuracao = snapSessao.exists() ? (snapSessao.data().duracao ?? 0) : 0;
    const delta       = Math.max(0, _activeSeconds - lastDuracao);

    /* PERFORMANCE ANALYTICS — inclui quizEvents no flush */
    await setDoc(_sessaoRef(_uid, _sessionId), {
      endedAt:    now,
      duracao:    _activeSeconds,
      quizEvents: _quizEvents.length > 0 ? _quizEvents : [],
    }, { merge: true });

    if (delta > 0) {
      await setDoc(_diarioRef(_uid, dataKey), {
        data:       dataKey,
        tempoTotal: increment(delta),
        updatedAt:  now,
      }, { merge: true });

      await setDoc(_usuarioRef(_uid), {
        tempoTotalGeral: increment(delta),
        ultimaAtividade: now,
      }, { merge: true });
    }

    console.log(`[session-tracker] flush: ${_activeSeconds}s ativos, delta=${delta}s`);
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
    if (_isRunning) {
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
  _heartbeatTimer = setInterval(_flush, HEARTBEAT_INTERVAL);
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
    _flush();
  } else {
    _isRunning = true;
  }
}

function _onBeforeUnload() {
  _isRunning = false;
  _flush().catch(() => {});
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
        _sessionId     = storedId;
        _startedAt     = storedStart;
        _activeSeconds = snap.data().duracao ?? 0;
        /* PERFORMANCE ANALYTICS — restaura eventos salvos */
        _quizEvents    = Array.isArray(snap.data().quizEvents) ? snap.data().quizEvents : [];
        console.log(`[session-tracker] sessão recuperada: ${_sessionId} (${_activeSeconds}s)`);
      } else {
        _criarNovaSessao();
      }
    } catch (_) {
      _criarNovaSessao();
    }
  } else {
    _criarNovaSessao();
  }

  _isRunning = document.visibilityState !== 'hidden';
  _initialized = true;

  _startTick();
  _startHeartbeat();

  document.addEventListener('visibilitychange', _onVisibilityChange);
  window.addEventListener('beforeunload', _onBeforeUnload);

  if (!sessionStorage.getItem(SESSION_KEY)) {
    await _criarSessaoFirestore();
  }

  _notify();
}

function _criarNovaSessao() {
  _sessionId     = _newSessionId();
  _startedAt     = Date.now();
  _activeSeconds = 0;
  _quizEvents    = [];   /* PERFORMANCE ANALYTICS — limpa eventos em nova sessão */
  sessionStorage.setItem(SESSION_KEY, _sessionId);
  sessionStorage.setItem(SESSION_START_KEY, String(_startedAt));
}

export async function destroy() {
  if (!_initialized) return;

  _isRunning = false;
  _stopTick();
  _stopHeartbeat();

  document.removeEventListener('visibilitychange', _onVisibilityChange);
  window.removeEventListener('beforeunload', _onBeforeUnload);

  await _flush();

  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_START_KEY);

  _sessionId     = null;
  _startedAt     = null;
  _activeSeconds = 0;
  _uid           = null;
  _initialized   = false;
  _quizEvents    = [];   /* PERFORMANCE ANALYTICS — limpa ao destruir */

  _notify();
}

/* ══════════════════════════════════════════════
   API PÚBLICA
══════════════════════════════════════════════ */

/** Retorna estatísticas ao vivo da sessão atual. */
export function getStats() {
  return {
    sessionId:     _sessionId,
    uid:           _uid,
    activeSeconds: _activeSeconds,
    isRunning:     _isRunning,
    startedAt:     _startedAt,
    initialized:   _initialized,
    quizEvents:    _quizEvents.slice(),   /* PERFORMANCE ANALYTICS — cópia imutável */
  };
}

/** Formata segundos → 'MM:SS' ou 'HH:MM:SS' se >= 1 hora. */
export function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

/** Formata segundos → string legível ('2h 14m', '45m', etc.) */
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

export async function carregarEstatisticas(uid) {
  if (!uid) return null;
  try {
    const db = getDb();

    const snapUsuario  = await getDoc(doc(db, 'usuarios', uid));
    const dadosUsuario = snapUsuario.exists() ? snapUsuario.data() : {};

    const hoje     = new Date();
    const historico = {};
    const promises  = [];

    for (let i = 0; i < 30; i++) {
      const d = new Date(hoje);
      d.setDate(d.getDate() - i);
      const key = _dateKey(d.getTime());
      promises.push(
        getDoc(doc(db, 'usuarios', uid, 'historico_diario', key))
          .then(snap => {
            if (snap.exists()) historico[key] = snap.data();
          })
          .catch(() => {})
      );
    }

    await Promise.all(promises);

    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(hoje);
      d.setDate(d.getDate() - i);
      const key = _dateKey(d.getTime());
      if (historico[key] && historico[key].tempoTotal > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    const hojeKey   = _dateKey();
    const tempoHoje = historico[hojeKey]?.tempoTotal ?? 0;

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

    return {
      tempoTotalGeral: dadosUsuario.tempoTotalGeral ?? 0,
      totalSessoes:    dadosUsuario.totalSessoes    ?? 0,
      ultimaAtividade: dadosUsuario.ultimaAtividade ?? null,
      tempoHoje,
      streak,
      ultimos7,
      historico,
    };
  } catch (err) {
    console.error('[session-tracker] carregarEstatisticas:', err);
    return null;
  }
}

/* ══════════════════════════════════════════════
   PERFORMANCE ANALYTICS — listener de quiz finalizado
   ──────────────────────────────────────────────
   Escuta 'nexus:quizFinalizado' emitido por quiz_engine.js
   após cada conclusão de quiz (com ou sem revelar).
   Captura um snapshot enxuto e faz flush imediato para
   que o evento não se perca em caso de saída rápida.
══════════════════════════════════════════════ */
window.addEventListener('nexus:quizFinalizado', function (e) {
  if (!_initialized || !e || !e.detail) return;

  const p = e.detail;

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

  console.log(
    '[session-tracker] quiz registrado:',
    snapshot.disc + '/' + snapshot.modo,
    '| taxa:', Math.round(snapshot.taxaAcerto * 100) + '%',
    '| tempo:', snapshot.tempoGastoSeg + 's',
    '| eventos na sessão:', _quizEvents.length
  );

  /* Flush imediato — não espera o próximo heartbeat */
  _flush().catch(function () {});
});

/* ══════════════════════════════════════════════
   AUTO-BOOT — reage ao login/logout global
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