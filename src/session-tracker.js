/* =============================================
   NEXUS STUDY — src/session-tracker.js

   v7 — Lock determinístico de aba única (Camada 1 — FINAL)
   v7.2 — localStorage como buffer de navegação (nav fix)
   v8   — REORGANIZAÇÃO DE PERSISTÊNCIA (aprovada)
          ─────────────────────────────────────────
          1. historico_diario agora é agrupado por MÊS
             (usuarios/{uid}/historico_diario/{YYYY-MM}),
             em vez de um documento por dia. Reduz o
             crescimento da coleção de ~365 para ~12
             documentos por ano.
             COMPATIBILIDADE: carregarEstatisticas() faz
             leitura híbrida — busca primeiro no(s)
             documento(s) mensal(is) novo(s); qualquer dia
             da janela de 30 dias que não exista lá cai em
             fallback de leitura no documento diário antigo
             (usuarios/{uid}/historico_diario/{YYYY-MM-DD}).
             Nenhuma migração de dados antigos é feita.
             Documentos diários antigos não são apagados
             nem alterados — apenas deixam de receber
             gravação nova.

          2. Nova coleção perfil_uso/{semestre} — heatmap
             por hora e deviceType consolidados, POR
             SEMESTRE (não vitalício). O card "Perfil de
             uso" do Dashboard passa a ler exclusivamente
             daqui (ver carregarPerfilUso), em vez de
             depender da última sessão persistida.
             O semestre ativo é informado de fora (mesma
             fonte que o Dashboard já usa — State.semestre)
             via setSemestreAtivo(), pois este módulo roda
             em todas as páginas e não tem acesso direto ao
             State do dashboard.
             O incremento é feito por DELTA de cada hora do
             heatmap da sessão atual desde o último flush,
             para nunca contar a mesma hora duas vezes.

          3. sessoes: removido o campo paginaInicial (nunca
             lido em nenhum ponto do sistema). Adicionado o
             campo semestre (útil para análises futuras).
             hourHeatmap e deviceType da sessão individual
             foram MANTIDOS — perfil_uso é um dado adicional
             consolidado, não um substituto.

          NADA MAIS foi alterado: lock de aba, timer local,
          navegação (pages/sequence), API pública
          (getStats/subscribe/formatTime/etc.) permanecem
          idênticos em contrato e comportamento.
   ============================================= */

import {
  doc, getDoc, setDoc, increment, writeBatch,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { getDb } from './firebase.js';
import { perfLog, logFirestore } from './perf_logger.js';
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

const LS_NAV_PAGES_KEY    = 'nexus_nav_pages';
const LS_NAV_SEQ_KEY      = 'nexus_nav_sequence';

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
let _booting        = false;
let _initInProgress = false;
let _uid            = null;
let _notifyTimer    = null;
let _heartbeatTimer = null;

const _tabId = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

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
   ESTADO INTERNO — SEMESTRE ATIVO (perfil_uso)
   ─────────────────────────────────────────────
   Não é uma fonte nova de verdade: é apenas um
   "espelho" do State.semestre que o Dashboard já
   controla. Quem chama setSemestreAtivo() é o
   próprio dashboard_data.js, dono do State.
══════════════════════════════════════════════ */
let _semestreAtivo = null;

export function setSemestreAtivo(semestre) {
  _semestreAtivo = semestre || null;
}

/* Espelha, por sessão, o que já foi somado ao perfil_uso
   consolidado — usado para calcular apenas o DELTA de cada
   hora a cada _flush(), evitando dupla contagem via increment(). */
let _perfilUsoSincronizado = {};

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
   NAVEGAÇÃO — PERSISTÊNCIA EM localStorage
   Garante que navPages e navSequence sobrevivam
   a reloads sem depender do Firestore como
   fonte de recuperação.
══════════════════════════════════════════════ */
function _lsNavKey(suffix) {
  return `${suffix}_${_uid ?? 'anon'}`;
}

function _salvarNavLS() {
  try {
    localStorage.setItem(_lsNavKey(LS_NAV_PAGES_KEY), JSON.stringify(_navPages));
    localStorage.setItem(_lsNavKey(LS_NAV_SEQ_KEY),   JSON.stringify(_navSequence));
  } catch (_) {}
}

function _carregarNavLS() {
  try {
    const rawPages = localStorage.getItem(_lsNavKey(LS_NAV_PAGES_KEY));
    const rawSeq   = localStorage.getItem(_lsNavKey(LS_NAV_SEQ_KEY));
    const pages = rawPages ? JSON.parse(rawPages) : null;
    const seq   = rawSeq   ? JSON.parse(rawSeq)   : null;
    return {
      pages: _isPlainObject(pages) ? pages : null,
      seq:   Array.isArray(seq)    ? seq   : null,
    };
  } catch (_) {
    return { pages: null, seq: null };
  }
}

function _limparNavLS() {
  try {
    localStorage.removeItem(_lsNavKey(LS_NAV_PAGES_KEY));
    localStorage.removeItem(_lsNavKey(LS_NAV_SEQ_KEY));
  } catch (_) {}
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

/* Chave mensal usada pela nova estrutura agrupada de
   historico_diario. Mesmo formato de ano/mês de _dateKey,
   sem o dia. */
function _mesKey(ts = Date.now()) {
  const d  = new Date(ts);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${yy}-${mm}`;
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
function _usuarioRef(uid)         { return doc(getDb(), 'usuarios', uid); }

/* Documento diário ANTIGO — mantido apenas para leitura de
   fallback em carregarEstatisticas(). Não recebe mais gravação. */
function _diarioRef(uid, dateKey) { return doc(getDb(), 'usuarios', uid, 'historico_diario', dateKey); }

/* Documento mensal NOVO — fonte de gravação e leitura primária
   de historico_diario a partir da v8. */
function _diarioMensalRef(uid, mesKey) { return doc(getDb(), 'usuarios', uid, 'historico_diario', mesKey); }

/* Documento consolidado de Perfil de Uso, um por semestre. */
function _perfilUsoRef(uid, semestre) { return doc(getDb(), 'usuarios', uid, 'perfil_uso', semestre); }

/* ══════════════════════════════════════════════
   CRIAÇÃO DE SESSÃO NO FIRESTORE
══════════════════════════════════════════════ */
async function _criarSessaoFirestore() {
  if (!_uid || !_sessionId) return;
  try {
    const dataKey = _dateKey(_startedAt);
    const mesKey  = _mesKey(_startedAt);
    const dia     = dataKey.slice(-2);

    await setDoc(_sessaoRef(_uid, _sessionId), {
      startedAt:   _startedAt,
      endedAt:     _startedAt,
      duracao:     0,
      dataKey,
      semestre:    _semestreAtivo,
      pages:       {},
      navigation:  [],
      hourHeatmap: {},
      deviceType:  _navDeviceType,
    });
    await setDoc(_usuarioRef(_uid), {
      totalSessoes:    increment(1),
      ultimaAtividade: Date.now(),
    }, { merge: true });
    await setDoc(_diarioMensalRef(_uid, mesKey), {
      mes: mesKey,
      [`dias.${dia}.sessoes`]: increment(1),
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
  const mesKey        = _mesKey(_startedAt);
  const dia           = dataKey.slice(-2);
  const activeSeconds = _calcActiveSeconds();
  const lastSent      = _readLSNumber(LS_LAST_SENT_KEY, 0);
  const delta         = Math.max(0, activeSeconds - lastSent);

  _finalizarPaginaAtual();

  try {
    await setDoc(_sessaoRef(_uid, _sessionId), {
      endedAt:     now,
      duracao:     activeSeconds,
      pages:       _navPages,
      navigation:  _navSequence,
      hourHeatmap: _navHourHeatmap,
      deviceType:  _navDeviceType,
      semestre:    _semestreAtivo,
    }, { merge: true });

    if (delta > 0) {
      const batch = writeBatch(getDb());
      batch.set(_diarioMensalRef(_uid, mesKey), {
        mes: mesKey,
        [`dias.${dia}.tempoTotal`]: increment(delta),
        updatedAt: now,
      }, { merge: true });
      batch.set(_usuarioRef(_uid), {
        tempoTotalGeral: increment(delta),
        ultimaAtividade: now,
      }, { merge: true });
      await batch.commit();
      localStorage.setItem(LS_LAST_SENT_KEY, String(activeSeconds));
    }

    /* ── perfil_uso/{semestre} ──────────────────────────────
       Incrementa apenas o DELTA de cada hora do heatmap desta
       sessão desde o último flush — nunca o valor absoluto —
       para que increment() não conte a mesma hora duas vezes
       em flushes sucessivos da mesma sessão. Não substitui o
       hourHeatmap gravado por sessão em _sessaoRef acima; é um
       dado consolidado adicional. Sem semestre ativo definido,
       simplesmente não grava (evita registro sem contexto). */
    if (_semestreAtivo) {
      const deltas = {};
      Object.keys(_navHourHeatmap).forEach(h => {
        const diff = (_navHourHeatmap[h] ?? 0) - (_perfilUsoSincronizado[h] ?? 0);
        if (diff > 0) deltas[h] = diff;
      });

      if (Object.keys(deltas).length > 0) {
        const updatePerfil = {
          semestre:   _semestreAtivo,
          deviceType: _navDeviceType,
          updatedAt:  now,
        };
        Object.entries(deltas).forEach(([h, diff]) => {
          updatePerfil[`hourHeatmap.${h}`] = increment(diff);
        });
        await setDoc(_perfilUsoRef(_uid, _semestreAtivo), updatePerfil, { merge: true });
        _perfilUsoSincronizado = { ..._navHourHeatmap };
      }
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
  if (_initInProgress) return;
  if (_initialized) await destroy();

  _initInProgress = true;
  _booting        = true;
  _uid            = uid;

  /* Pode existir uma entrada de página já registrada em memória por uma
     chamada manual de __nexusPageEnter() feita pela própria página (ex.:
     quiz.js / resumo.js no DOMContentLoaded) ANTES deste init() terminar
     a recuperação assíncrona de sessão. Preservamos esse registro para
     poder mesclá-lo de volta depois, em vez de perdê-lo. */
  const paginaJaRegistradaAntesDoInit   = _navCurrentPage;
  const visitaJaRegistradaAntesDoInit   = paginaJaRegistradaAntesDoInit
    ? { ..._navPages[paginaJaRegistradaAntesDoInit] }
    : null;

  const storedId    = sessionStorage.getItem(SESSION_KEY);
  const storedStart = Number(sessionStorage.getItem(SESSION_START_KEY) || 0);

  if (storedId && storedStart) {
    try {
      const snap = await getDoc(_sessaoRef(uid, storedId));
      if (snap.exists()) {
        const data = snap.data();
        _sessionId      = storedId;
        _startedAt      = storedStart;
        _navHourHeatmap = _isPlainObject(data.hourHeatmap) ? data.hourHeatmap : {};
        _navDeviceType  = typeof data.deviceType === 'string' ? data.deviceType : _detectDevice();

        /* localStorage tem prioridade sobre Firestore para navPages/navSequence
           pois é escrito a cada __nexusPageEnter — mais recente que o último flush */
        const navLS  = _carregarNavLS();
        _navPages    = navLS.pages ?? (_isPlainObject(data.pages)     ? data.pages     : {});
        _navSequence = navLS.seq   ?? (Array.isArray(data.navigation) ? data.navigation : []);

        /* Reconstrói o "espelho" do que já havia sido sincronizado com
           perfil_uso nesta sessão recuperada — evita reenviar deltas já
           gravados em flushes anteriores da mesma sessão. Como o próprio
           hourHeatmap recuperado é o estado mais recente conhecido, ele
           serve como baseline seguro (o pior caso é um pequeno recontagem
           após reload, nunca perda de dado). */
        _perfilUsoSincronizado = { ..._navHourHeatmap };

        /* MESCLA — reaplica a visita que ocorreu antes desta recuperação
           terminar, em vez de deixá-la ser sobrescrita silenciosamente. */
        if (paginaJaRegistradaAntesDoInit && visitaJaRegistradaAntesDoInit) {
          const existente = _navPages[paginaJaRegistradaAntesDoInit] ?? { time: 0, visits: 0 };
          _navPages[paginaJaRegistradaAntesDoInit] = {
            time:   existente.time,
            visits: Math.max(existente.visits, visitaJaRegistradaAntesDoInit.visits ?? 0),
          };
          const ultimo = _navSequence[_navSequence.length - 1];
          if (ultimo !== paginaJaRegistradaAntesDoInit) {
            _navSequence.push(paginaJaRegistradaAntesDoInit);
          }
          _navCurrentPage = paginaJaRegistradaAntesDoInit;
          _navPageStart   = Date.now();
          _salvarNavLS();
        }

        const lsAccum = _readLSNumber(LS_ACCUM_KEY, 0);
        console.log(`[session-tracker] sessão recuperada: ${_sessionId} | localStorage: ${lsAccum}s | nav pages: ${Object.keys(_navPages).length}`);
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

  _notifyTimer    = setInterval(() => { _notify(); }, NOTIFY_INTERVAL);
  _heartbeatTimer = setInterval(() => { if (_isOwner()) _flush(); }, HEARTBEAT_INTERVAL);

  document.addEventListener('visibilitychange', _onVisibilityChange);
  window.addEventListener('beforeunload', _onBeforeUnload);
  _installNavAutoDetect();

  const eNova = !storedId;
  if (eNova) await _criarSessaoFirestore();

  /* Força o registro mesmo que _navCurrentPage já aponte para o pathname
     atual (caso de mesclagem acima): zera a guarda de idempotência antes
     de chamar, garantindo que visits/sequence fiquem consistentes mesmo
     se nenhuma mesclagem ocorreu (ex.: sessão nova). */
  if (location.pathname === _navCurrentPage) _navCurrentPage = null;
  __nexusPageEnter(location.pathname);

  _booting        = false;
  _initInProgress = false;
  _notify();
}

async function _iniciarNovaSessao() {
  const storedId = sessionStorage.getItem(SESSION_KEY);
  if (storedId && _uid) await _resolverSessaoZumbi(_uid, storedId);

  _sessionId      = _newSessionId();
  _startedAt      = Date.now();
  _navPages       = {};
  _navSequence    = [];
  _navHourHeatmap = {};
  _navDeviceType  = _detectDevice();
  _navCurrentPage = null;
  _navPageStart   = null;
  _perfilUsoSincronizado = {};

  /* Nova sessão — limpa o buffer de navegação do localStorage */
  _limparNavLS();
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

  _limparNavLS();
  _resetLocalTimer();
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_START_KEY);

  _sessionId      = null;
  _startedAt      = null;
  _uid            = null;
  _initialized    = false;
  _booting        = false;
  _initInProgress = false;
  _navPages       = {};
  _navSequence    = [];
  _navHourHeatmap = {};
  _navCurrentPage = null;
  _navPageStart   = null;
  _perfilUsoSincronizado = {};

  _notify();
}

/* ══════════════════════════════════════════════
   API PÚBLICA
══════════════════════════════════════════════ */
export function getStats() {
  const _t0 = performance.now();
  const dono = _isOwner();
  const resultado = {
    sessionId:      _sessionId,
    uid:            _uid,
    activeSeconds:  _calcActiveSeconds(),
    isRunning:      dono && document.visibilityState !== 'hidden',
    isLeader:       dono,
    startedAt:      _startedAt,
    initialized:    _initialized,
    navPages:       Object.fromEntries(
                      Object.entries(_navPages).map(([k, v]) => [k, { ...v }])
                    ),
    navSequence:    _navSequence.slice(),
    navHourHeatmap: Object.assign({}, _navHourHeatmap),
    navDeviceType:  _navDeviceType,
    navCurrentPage: _navCurrentPage,
  };
  perfLog('Sessão', 'getStats (síncrono)', performance.now() - _t0, { navPages: Object.keys(_navPages).length });
  return resultado;
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
   ─────────────────────────────────────────────
   LEITURA HÍBRIDA (v8):
     1. Determina os meses (YYYY-MM) cobertos pela janela
        de 30 dias e busca os documentos mensais novos
        (historico_diario/{YYYY-MM}).
     2. Para cada dia da janela que NÃO tiver dado no
        documento mensal correspondente (ex.: dias antigos
        gravados antes da migração de estrutura), busca em
        fallback o documento diário antigo
        (historico_diario/{YYYY-MM-DD}).
     3. Monta o mesmo objeto `historico` (chave = dateKey)
        que a função já retornava antes — nenhum consumidor
        (Dashboard) precisa mudar, pois o formato de saída é
        idêntico ao anterior.
   Nenhuma migração de dados é feita — documentos antigos
   apenas deixam de receber gravação nova.
══════════════════════════════════════════════ */
export async function carregarEstatisticas(uid) {
  if (!uid) return null;
  const _tInicio = performance.now();
  try {
    const db = getDb();
    const hoje = new Date();

    const diasJanela = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(hoje);
      d.setDate(d.getDate() - i);
      diasJanela.push({ dateKey: _dateKey(d.getTime()), mesKey: _mesKey(d.getTime()) });
    }
    const mesesUnicos = [...new Set(diasJanela.map(d => d.mesKey))];

    const mapasMensais = {};
    const _tFaseUm = performance.now();
    const [snapUsuario] = await Promise.all([
      (async () => {
        const t0 = performance.now();
        const snap = await getDoc(doc(db, 'usuarios', uid));
        logFirestore('usuarios/{uid}', uid, performance.now() - t0, snap.exists() ? 1 : 0);
        return snap;
      })(),
      ...mesesUnicos.map(async (mesKey) => {
        const t0 = performance.now();
        try {
          const snap = await getDoc(_diarioMensalRef(uid, mesKey));
          mapasMensais[mesKey] = snap.exists() ? (snap.data().dias || {}) : {};
          logFirestore(`historico_diario/${mesKey}`, uid, performance.now() - t0, snap.exists() ? 1 : 0);
        } catch (_) {
          mapasMensais[mesKey] = {};
          logFirestore(`historico_diario/${mesKey} (ERRO)`, uid, performance.now() - t0, 0);
        }
      }),
    ]);
    perfLog('Promise.all', 'carregarEstatisticas :: usuário + meses (paralelo)', performance.now() - _tFaseUm, { meses: mesesUnicos.length });

    const dadosUsuario = snapUsuario.exists() ? snapUsuario.data() : {};

    /* ── NOVO: marcador de histórico legado ──────────────────────
       Já veio "de graça" dentro de snapUsuario acima — custo zero.
       Ver _persistirLegacyCheck() logo abaixo para a explicação
       completa da garantia de permanência. */
    const legacyCheck = dadosUsuario.legacyCheck ?? null;

    const historico = {};
    const diasParaFallback = [];

    diasJanela.forEach(({ dateKey, mesKey }) => {
      const dia   = dateKey.slice(-2);
      const doMes = mapasMensais[mesKey]?.[dia];
      if (doMes) {
        historico[dateKey] = doMes;
        return;
      }

      /* NOVO — usuário já confirmado sem nenhum dado legado:
         o resultado do fallback para esta data já é conhecido
         (vazio) e é permanente. Não consulta o Firestore. */
      if (legacyCheck?.verificado && legacyCheck.possuiDadosLegados === false) {
        return;
      }

      /* NOVO — usuário confirmado COM dado legado em datas
         específicas: só faz fallback para essas datas exatas.
         Qualquer outra data fora da lista já está confirmada
         como vazia, pelo mesmo motivo acima. */
      if (
        legacyCheck?.verificado &&
        Array.isArray(legacyCheck.datasComDados) &&
        !legacyCheck.datasComDados.includes(dateKey)
      ) {
        return;
      }

      diasParaFallback.push(dateKey);
    });

    if (diasParaFallback.length > 0) {
      const _tFallback = performance.now();
      await Promise.all(diasParaFallback.map(dateKey => {
        const t0 = performance.now();
        return getDoc(_diarioRef(uid, dateKey))
          .then(snap => {
            if (snap.exists()) historico[dateKey] = snap.data();
            logFirestore(`historico_diario/${dateKey} (fallback antigo)`, uid, performance.now() - t0, snap.exists() ? 1 : 0);
          })
          .catch(() => {
            logFirestore(`historico_diario/${dateKey} (fallback ERRO)`, uid, performance.now() - t0, 0);
          });
      }));
      perfLog('Promise.all', 'carregarEstatisticas :: fallback diário antigo', performance.now() - _tFallback, { dias: diasParaFallback.length });

      /* NOVO — só grava a conclusão definitiva na PRIMEIRA vez que
         o fallback é executado sem filtro nenhum (legacyCheck ainda
         não existia). Isso garante que a decisão foi tomada com base
         em TODAS as datas realmente consultadas, nunca em um
         subconjunto já filtrado por um resultado anterior. */
      if (!legacyCheck?.verificado) {
        _persistirLegacyCheck(uid, diasParaFallback, historico).catch(() => {});
      }
    } else {
      perfLog(
        legacyCheck?.verificado ? 'Cache' : 'dashboard_data',
        legacyCheck?.verificado
          ? 'carregarEstatisticas :: fallback diário pulado (legacyCheck confirma ausência)'
          : 'carregarEstatisticas :: fallback diário (não necessário)',
        0,
        { dias: 0 }
      );
    }

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

    const entradasComTempo = Object.entries(historico).filter(([, d]) => d.tempoTotal > 0);
    const diasComTempo     = entradasComTempo.map(([, d]) => d);
    const mediaDiaria      = diasComTempo.length > 0
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
    const melhorDia = entradasComTempo.reduce(
      (best, [key, d]) => (d.tempoTotal > best.tempo ? { key, tempo: d.tempoTotal } : best),
      { key: null, tempo: 0 }
    );

    const tempoTotalGeralFinal = dadosUsuario.tempoTotalGeral ?? 0;
    const totalSessoesFinal    = dadosUsuario.totalSessoes    ?? 0;
    const mediaSessao = totalSessoesFinal > 0
      ? Math.floor(tempoTotalGeralFinal / totalSessoesFinal)
      : 0;

    const resultado = {
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

    perfLog('dashboard_data', 'carregarEstatisticas (total)', performance.now() - _tInicio, {
      meses: mesesUnicos.length,
      fallbackDias: diasParaFallback.length,
    });

    return resultado;
  } catch (err) {
    console.error('[session-tracker] carregarEstatisticas:', err);
    perfLog('dashboard_data', 'carregarEstatisticas (ERRO)', performance.now() - _tInicio);
    return null;
  }
}
/* ══════════════════════════════════════════════
   MARCADOR DE HISTÓRICO LEGADO — usuarios/{uid}.legacyCheck
   ─────────────────────────────────────────────
   Grava, uma única vez por usuário, o resultado definitivo do
   fallback de historico_diario/{YYYY-MM-DD} (formato antigo,
   pré-v8). Documentos nesse formato NUNCA MAIS recebem escrita
   (ver _diarioRef — mantido só para leitura), portanto:
     · se uma data não tinha doc legado quando checada, ela
       nunca vai passar a ter;
     · o resultado é válido para sempre, sem necessidade de
       revalidação periódica.
   Não altera o valor de `historico` retornado por
   carregarEstatisticas nesta chamada — apenas evita repetir,
   em TODAS as próximas chamadas, leituras cujo resultado já
   é conhecido.
══════════════════════════════════════════════ */
async function _persistirLegacyCheck(uid, datasVerificadas, historicoResultante) {
  const datasComDados = datasVerificadas.filter(
    dateKey => historicoResultante[dateKey] !== undefined
  );

  const legacyCheck = {
    verificado:         true,
    possuiDadosLegados: datasComDados.length > 0,
    datasComDados,
    verificadoEm:        Date.now(),
  };

  try {
    await setDoc(_usuarioRef(uid), { legacyCheck }, { merge: true });
    console.log('[session-tracker] legacyCheck persistido:', legacyCheck);
  } catch (err) {
    console.warn('[session-tracker] falha ao persistir legacyCheck:', err);
  }
}
/* ══════════════════════════════════════════════
   carregarPerfilUso(uid, semestre)
   ─────────────────────────────────────────────
   Nova função (v8). Lê o documento consolidado
   perfil_uso/{semestre} — heatmap por hora e
   deviceType daquele semestre especificamente.
   Retorna null se não houver uid/semestre ou se
   o documento ainda não existir (ex.: usuário sem
   nenhuma sessão registrada no semestre selecionado).
   Não calcula nada — apenas lê e devolve os campos
   já persistidos por _flush().
══════════════════════════════════════════════ */
export async function carregarPerfilUso(uid, semestre) {
  if (!uid || !semestre) return null;
  const t0 = performance.now();
  try {
    const snap = await getDoc(_perfilUsoRef(uid, semestre));
    if (!snap.exists()) {
      logFirestore(`perfil_uso/${semestre}`, uid, performance.now() - t0, 0);
      return null;
    }
    const data = snap.data();
    logFirestore(`perfil_uso/${semestre}`, uid, performance.now() - t0, 1);
    return {
      hourHeatmap: _isPlainObject(data.hourHeatmap) ? data.hourHeatmap : {},
      deviceType:  typeof data.deviceType === 'string' ? data.deviceType : null,
    };
  } catch (err) {
    console.warn('[session-tracker] carregarPerfilUso:', err);
    logFirestore(`perfil_uso/${semestre} (ERRO)`, uid, performance.now() - t0, 0);
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

  /* Chave de navegação inclui a query string (?disc=, ?modo=, etc.) no
     momento exato da entrada. Isso é o que permite que cada entrada do
     histórico carregue sua própria disciplina/modo, em vez de depender
     do estado em memória da aplicação no momento da exibição. O
     pathname puro continua existindo apenas como parte desta chave —
     nunca é usado isoladamente para decidir o que mostrar depois. */
  const chaveNav = pathname + (location.search || '');

  if (chaveNav === _navCurrentPage) return;
  _finalizarPaginaAtual();
  _navCurrentPage = chaveNav;
  _navPageStart   = Date.now();
  if (!_navPages[chaveNav]) _navPages[chaveNav] = { time: 0, visits: 0 };
  _navPages[chaveNav].visits += 1;

  /* Só adiciona à sequência se diferente da última entrada —
     evita repetição tipo Dashboard → Dashboard → Dashboard */
  const ultimo = _navSequence[_navSequence.length - 1];
  if (ultimo !== chaveNav) _navSequence.push(chaveNav);

  /* Persiste imediatamente no localStorage — sobrevive a reloads
     sem depender do ciclo de heartbeat do Firestore */
  _salvarNavLS();

  console.log('[session-tracker] __nexusPageEnter →', chaveNav,
    `| visitas: ${_navPages[chaveNav].visits} | pages em memória: ${Object.keys(_navPages).length}`);

  if (_initialized && !_booting && _uid && _isOwner()) _flush().catch(() => {});
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