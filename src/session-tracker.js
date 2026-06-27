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

   usuarios/{uid}/historico_diario/{YYYY-MM-DD}
     data         : string  ('YYYY-MM-DD')
     tempoTotal   : number  (segundos acumulados no dia)
     sessoes      : number  (quantidade de sessões no dia)
     updatedAt    : number  (timestamp ms)

   usuarios/{uid}   (merge no documento principal)
     tempoTotalGeral : number  (segundos acumulados em todas as sessões)
     ultimaAtividade : number  (timestamp ms)
     totalSessoes    : number  (contador global de sessões)

   COMPORTAMENTO:
   ──────────────
   • Inicia automaticamente ao importar o módulo (ou chamar init())
   • Heartbeat a cada HEARTBEAT_INTERVAL ms enquanto a aba está visível
   • Pausa o timer quando a aba perde foco (visibilitychange hidden)
   • Retoma o timer quando a aba recupera foco (visibilitychange visible)
   • Flush final via beforeunload + sendBeacon (melhor esforço)
   • Funciona em SPA e em múltiplas páginas — sessionId é mantido em
     sessionStorage, garantindo continuidade entre navegações da mesma aba
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
const HEARTBEAT_INTERVAL = 30_000;   // 30 s — grava no Firestore
const TICK_INTERVAL      = 1_000;    // 1 s  — atualiza UI local
const SESSION_KEY        = 'nexus_session_id';
const SESSION_START_KEY  = 'nexus_session_start';

/* ══════════════════════════════════════════════
   ESTADO INTERNO
══════════════════════════════════════════════ */
let _sessionId       = null;
let _startedAt       = null;      // ms — início da sessão (ou retomada)
let _activeSeconds   = 0;         // segundos ativos acumulados desde o início
let _pausedAt        = null;      // ms — momento em que ficou invisible/hidden
let _isRunning       = false;
let _tickTimer       = null;
let _heartbeatTimer  = null;
let _initialized     = false;
let _uid             = null;

/* Callbacks externos (ex: dashboard atualiza UI) */
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

/** Cria o documento da sessão no início. */
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
    });

    // Incrementa contadores globais no documento do usuário
    await setDoc(_usuarioRef(_uid), {
      totalSessoes:    increment(1),
      ultimaAtividade: Date.now(),
    }, { merge: true });

    // Incrementa sessões no histórico diário
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
 * Heartbeat: atualiza endedAt, duracao e tempoTotal no Firestore.
 * Chamado a cada HEARTBEAT_INTERVAL e no unload.
 */
async function _flush() {
  if (!_uid || !_sessionId) return;
  const now     = Date.now();
  const dataKey = _dateKey(_startedAt);

  try {
    // Calcula delta desde o último flush registrado
    const snapSessao = await getDoc(_sessaoRef(_uid, _sessionId));
    const lastDuracao = snapSessao.exists() ? (snapSessao.data().duracao ?? 0) : 0;
    const delta       = Math.max(0, _activeSeconds - lastDuracao);

    await setDoc(_sessaoRef(_uid, _sessionId), {
      endedAt: now,
      duracao: _activeSeconds,
    }, { merge: true });

    if (delta > 0) {
      // Atualiza histórico diário
      await setDoc(_diarioRef(_uid, dataKey), {
        data:       dataKey,
        tempoTotal: increment(delta),
        updatedAt:  now,
      }, { merge: true });

      // Atualiza total geral no documento do usuário
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
   TIMER LOCAL (tick a cada 1s)
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
    _flush();   // best-effort flush ao perder foco
  } else {
    _isRunning = true;
  }
}

/* ══════════════════════════════════════════════
   UNLOAD — flush final
   Usa sendBeacon para garantir envio mesmo no fechamento.
   O Firestore não suporta sendBeacon nativamente, então
   fazemos o flush assíncrono normal (melhor esforço).
══════════════════════════════════════════════ */
function _onBeforeUnload() {
  _isRunning = false;
  // Tentativa sync — melhor esforço; não bloqueamos o unload
  _flush().catch(() => {});
}

/* ══════════════════════════════════════════════
   INIT / TEARDOWN PÚBLICO
══════════════════════════════════════════════ */

/**
 * Inicializa o tracker para o usuário autenticado.
 * Pode ser chamado novamente quando o usuário fizer login após
 * a página já ter carregado.
 *
 * Se o sessionId já existir no sessionStorage (navegação interna
 * na mesma aba), recupera a sessão existente ao invés de criar
 * uma nova — preservando a continuidade da sessão.
 */
export async function init(uid) {
  if (!uid) return;

  // Se já está rodando para o mesmo usuário, não reinicia
  if (_initialized && _uid === uid) return;

  // Teardown de sessão anterior se for outro usuário
  if (_initialized) await destroy();

  _uid = uid;

  // Recupera ou cria sessionId
  const storedId    = sessionStorage.getItem(SESSION_KEY);
  const storedStart = Number(sessionStorage.getItem(SESSION_START_KEY) || 0);

  if (storedId && storedStart) {
    // Mesma aba, sessão contínua — verifica se o documento existe
    try {
      const snap = await getDoc(_sessaoRef(uid, storedId));
      if (snap.exists()) {
        _sessionId     = storedId;
        _startedAt     = storedStart;
        _activeSeconds = snap.data().duracao ?? 0;
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
  sessionStorage.setItem(SESSION_KEY, _sessionId);
  sessionStorage.setItem(SESSION_START_KEY, String(_startedAt));
}

/**
 * Encerra o tracker (ex: logout).
 * Faz flush final e limpa todos os timers/listeners.
 */
export async function destroy() {
  if (!_initialized) return;

  _isRunning = false;
  _stopTick();
  _stopHeartbeat();

  document.removeEventListener('visibilitychange', _onVisibilityChange);
  window.removeEventListener('beforeunload', _onBeforeUnload);

  await _flush();

  // Limpa sessionStorage para que o próximo login inicie nova sessão
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_START_KEY);

  _sessionId     = null;
  _startedAt     = null;
  _activeSeconds = 0;
  _uid           = null;
  _initialized   = false;

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

/**
 * Inscreve um callback para receber updates de stats a cada segundo.
 * Retorna função de cancelamento.
 */
export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

/**
 * Carrega dados históricos do Firestore para o dashboard.
 * Retorna objeto com métricas derivadas das sessões reais.
 */
export async function carregarEstatisticas(uid) {
  if (!uid) return null;
  try {
    const db = getDb();

    // Documento principal do usuário
    const snapUsuario = await getDoc(doc(db, 'usuarios', uid));
    const dadosUsuario = snapUsuario.exists() ? snapUsuario.data() : {};

    // Histórico dos últimos 30 dias
    const hoje = new Date();
    const historico = {};
    const promises = [];

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

    // Calcula sequência de dias ativos
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(hoje);
      d.setDate(d.getDate() - i);
      const key = _dateKey(d.getTime());
      if (historico[key] && historico[key].tempoTotal > 0) {
        streak++;
      } else if (i > 0) {
        break; // interrupção na sequência
      }
    }

    // Tempo de hoje
    const hojeKey = _dateKey();
    const tempoHoje = historico[hojeKey]?.tempoTotal ?? 0;

    // Últimos 7 dias para gráfico
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
   AUTO-BOOT — reage ao login/logout global
   Permite usar o tracker em qualquer página sem
   código adicional além do import.
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

/* Boot imediato se o usuário já estiver logado ao carregar a página
   (navegação entre páginas — global.js já hidratou o usuário do localStorage) */
;(async () => {
  // Pequeno delay para garantir que global.js já inicializou
  await new Promise(r => setTimeout(r, 50));
  const { getUsuario: _gu } = await import('./global.js').catch(() => ({}));
  const usuario = typeof _gu === 'function' ? _gu() : null;
  if (usuario?.uid) {
    console.log('[session-tracker] boot imediato para', usuario.uid);
    await init(usuario.uid);
  }
})();