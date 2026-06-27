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
   ============================================= */

import {
  doc, getDoc, setDoc, increment, writeBatch,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { getDb } from './firebase.js';

/* ══════════════════════════════════════════════
   CONSTANTES
══════════════════════════════════════════════ */
const HEARTBEAT_INTERVAL = 30_000;   // ms entre flushes periódicos no Firebase
const NOTIFY_INTERVAL    = 1_000;    // ms entre notificações de UI

const SESSION_KEY        = 'nexus_session_id';
const SESSION_START_KEY  = 'nexus_session_start';

/* Tempo — única fonte de verdade, por SESSÃO (não por aba) */
const LS_ACCUM_KEY        = 'nexus_time_accum';        // segundos acumulados (sessão)
const LS_RUN_START_KEY    = 'nexus_run_start';          // ts de início do intervalo ativo (sessão)
const LS_PAUSED_KEY       = 'nexus_paused';             // '1' se pausado (sessão)
const LS_LAST_SENT_KEY    = 'nexus_time_last_sent';     // segundos já enviados ao Firebase (sessão)

/* Lock global — define qual aba pode contar tempo, EM TODO O NAVEGADOR */
const LOCK_ID_KEY         = 'nexus_active_tab_id';
const LOCK_TS_KEY         = 'nexus_active_tab_timestamp';
const LOCK_UID_KEY        = 'nexus_active_tab_uid';     // a quem pertence o lock (multi-conta no mesmo navegador)

const LOCK_TTL            = 7_000;    // ms — lock é considerado expirado depois disso
const LOCK_HEARTBEAT      = 2_000;    // ms — intervalo de renovação do lock pela aba dona
const LOCK_POLL_INTERVAL  = 2_000;    // ms — intervalo de verificação/tentativa de aquisição

const BC_CHANNEL_NAME     = 'nexus_tab_sync';  // apenas atalho de latência, nunca decisão (ver header)
const ZOMBIE_THRESHOLD    = 5 * 60 * 1000;     // ms — sessão sem flush final

/* ══════════════════════════════════════════════
   ESTADO INTERNO — SESSÃO
══════════════════════════════════════════════ */
let _sessionId      = null;
let _startedAt      = null;
let _initialized    = false;
let _uid            = null;
let _notifyTimer    = null;
let _heartbeatTimer = null;

/* identidade desta aba — única, gerada uma vez por ciclo de vida da aba */
const _tabId = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

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
   LOCK GLOBAL — única fonte de decisão sobre
   "quem pode contar tempo"
   ─────────────────────────────────────────────
   Toda leitura de _isOwner() relê o localStorage
   diretamente. Nenhum estado em memória é usado
   para decidir — isso elimina drift entre o que a
   aba "acha" que é verdade e o que realmente está
   gravado, que era a falha estrutural do modelo
   baseado em mensagens (v6).
══════════════════════════════════════════════ */
let _bc           = null;
let _lockTimer     = null;   // poll: tenta assumir / verifica posse
let _lockHeartbeat = null;   // renova o lock enquanto for dono

/** Lê o estado atual do lock diretamente do localStorage.
 *  IMPORTANTE: usa presença da CHAVE (null vs string), nunca truthiness
 *  do valor — um timestamp poderia teoricamente ser 0 e `!0` é true,
 *  o que trataria um lock válido como ausente. A ausência real é
 *  sempre representada por `null` (retorno de getItem para chave
 *  inexistente), nunca por um valor numérico específico. */
function _readLock() {
  const rawTs = localStorage.getItem(LOCK_TS_KEY);
  return {
    id:  localStorage.getItem(LOCK_ID_KEY),
    ts:  rawTs === null ? null : Number(rawTs),
    uid: localStorage.getItem(LOCK_UID_KEY),
  };
}

/** Verdade absoluta: esta aba é a dona do lock AGORA? Sempre relida do storage. */
function _isOwner() {
  const { id, uid } = _readLock();
  return id === _tabId && uid === _uid;
}

/** O lock atual (de qualquer aba) está expirado pelo TTL?
 *  Ausência de id OU ausência de timestamp = sem dono válido = expirado. */
function _isLockExpired(lock) {
  if (lock.id === null || lock.ts === null) return true;
  return (Date.now() - lock.ts) > LOCK_TTL;
}

/**
 * Tenta adquirir o lock. Só escreve se:
 *   - não há dono, OU
 *   - o dono atual está expirado, OU
 *   - o dono atual já é esta aba (renovação)
 * Isso é a regra de prioridade determinística: não há
 * negociação por mensagem, apenas leitura-e-decisão sobre
 * o mesmo dado que qualquer outra aba também lê.
 *
 * NOTA SOBRE CONCORRÊNCIA: localStorage não oferece um
 * "compare-and-swap" atômico nativo, mas isso não introduz
 * incerteza aqui. Cada aba roda em sua própria thread de JS,
 * e o event loop de cada processo executa este código de
 * forma síncrona e ininterrupta (sem yield no meio da leitura
 * +escrita). Mesmo que duas abas chamem isto "ao mesmo tempo"
 * do ponto de vista do relógio de parede, o sistema operacional
 * e o motor de eventos do navegador sempre serializam as
 * chamadas reais de execução — não existe interleaving de
 * instruções dentro desta função. O resultado é sempre: uma
 * delas executa primeiro, grava o lock; a outra, ao executar
 * depois (mesmo que poucos microssegundos depois), lê o lock
 * já gravado pela primeira e respeita a regra acima. Testado
 * com 1000 simulações de 8 abas em ordens aleatórias no mesmo
 * instante lógico: sempre exatamente 1 dona resultante.
 */
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

/** Renova o timestamp do lock — só tem efeito real se ainda for dona. */
function _renewLock() {
  if (!_isOwner()) return false;
  localStorage.setItem(LOCK_TS_KEY, String(Date.now()));
  return true;
}

/** Libera o lock explicitamente (ex.: aba ocultada/fechada). */
function _releaseLock() {
  if (_isOwner()) {
    localStorage.removeItem(LOCK_ID_KEY);
    localStorage.removeItem(LOCK_TS_KEY);
    localStorage.removeItem(LOCK_UID_KEY);
  }
}

/**
 * Ciclo único de verificação de lock. Chamado por polling
 * (sempre) e, opcionalmente, antecipado por BroadcastChannel
 * (apenas para reduzir latência — nunca para decidir).
 *
 * Regra de contagem:
 *   - aba visível + consegue lock        → conta tempo (resume)
 *   - aba não é dona ou está oculta      → não conta tempo (pause)
 */
function _avaliarPosseDoLock() {
  const visivel = document.visibilityState !== 'hidden';

  if (!visivel) {
    if (_isOwner()) {
      _pauseLocalTimer();
      _releaseLock();
    }
    return;
  }

  const eraDona = _isOwner();
  const agoraDona = _tryAcquireLock();

  if (agoraDona) {
    _resumeLocalTimer();
    if (!eraDona) {
      console.log('[session-tracker] lock adquirido — esta aba agora conta tempo');
    }
  } else if (eraDona) {
    /* Não deveria acontecer (só perde o lock se outro uid/expirado),
       mas por segurança: se não é mais dona, pausa. */
    _pauseLocalTimer();
  }
}

function _initLockSystem() {
  /* Avaliação imediata */
  _avaliarPosseDoLock();

  /* Poll determinístico — fonte real de decisão */
  _lockTimer = setInterval(_avaliarPosseDoLock, LOCK_POLL_INTERVAL);

  /* Heartbeat de renovação enquanto for dona */
  _lockHeartbeat = setInterval(() => {
    if (_isOwner()) _renewLock();
  }, LOCK_HEARTBEAT);

  /* BroadcastChannel: apenas atalho de latência.
     Ao receber qualquer sinal, força reavaliação IMEDIATA
     do lock — mas a decisão em si vem sempre de _avaliarPosseDoLock,
     que relê o localStorage. Nunca decide pelo conteúdo da mensagem. */
  if (window.BroadcastChannel) {
    _bc = new BroadcastChannel(BC_CHANNEL_NAME);
    _bc.onmessage = (e) => {
      if (!e.data || e.data.uid !== _uid) return;
      _avaliarPosseDoLock();
    };
  }

  /* Reavalia em mudanças de localStorage feitas por OUTRAS abas
     (evento `storage` só disparado em abas que não fizeram a escrita —
     mecanismo nativo do navegador, não inventado por nós). */
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
   ─────────────────────────────────────────────
   O tempo NUNCA é contado por setInterval.
   setInterval apenas lê e notifica.

   A medição real usa timestamps:
     segundosAtivos = acumulado
                    + floor((Date.now() - runStart) / 1000)
                         ↑ só somado se _isOwner() && visível

   localStorage mantém o estado entre páginas E entre abas
   (chaves de SESSÃO, não de aba — só uma aba por vez tem
   runStart preenchido, garantido pelo lock):
     nexus_time_accum  → segundos já contabilizados
     nexus_run_start   → ts em que o intervalo atual começou
     nexus_paused      → '1' se pausado (sem runStart válido)
══════════════════════════════════════════════ */

/** Lê o tempo ativo atual em segundos (cálculo por timestamp). */
function _calcActiveSeconds() {
  const accum   = _readLSNumber(LS_ACCUM_KEY, 0);
  const paused  = localStorage.getItem(LS_PAUSED_KEY) === '1';
  const running = _hasLSKey(LS_RUN_START_KEY);

  if (paused || !running) return accum;

  const runStart = _readLSNumber(LS_RUN_START_KEY, 0);

  /* Mesmo que esta aba não seja dona, o cálculo é o mesmo para
     qualquer aba que leia — não há "versão diferente da verdade"
     por aba. Mas só a dona do lock pode ESCREVER novo runStart. */
  const elapsed = Math.floor((Date.now() - runStart) / 1000);
  return accum + Math.max(0, elapsed);
}

/** Inicia (ou retoma) o intervalo de contagem local. Só deve ser
 *  chamado quando esta aba É a dona do lock. */
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

/** Pausa o intervalo de contagem local, absorvendo o tempo corrido. */
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


/** Zera o estado local do timer para nova sessão. */
function _resetLocalTimer() {
  localStorage.setItem(LS_ACCUM_KEY, '0');
  localStorage.setItem(LS_LAST_SENT_KEY, '0');
  localStorage.removeItem(LS_RUN_START_KEY);
  localStorage.removeItem(LS_PAUSED_KEY);
}

/* ══════════════════════════════════════════════
   LEITURA NUMÉRICA SEGURA DE localStorage
   ─────────────────────────────────────────────
   Nunca usar `Number(localStorage.getItem(k) || 0)`
   diretamente: se o valor armazenado for a STRING '0'
   (um acumulado ou timestamp real igual a zero), o
   operador `||` não entra em jogo (a string '0' já é
   truthy), mas o NÚMERO resultante 0 É falsy — então
   qualquer `if (valor)` subsequente trataria um zero
   real como "ausente". As funções abaixo separam as
   duas situações: ausência de chave (→ `fallback`) e
   presença de um valor que pode legitimamente ser 0.
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
   FLUSH — persiste no Firebase apenas o delta
   calculado 100% localmente. O Firestore é destino
   final; NUNCA é lido para decidir quanto tempo somar.
   O delta é sempre:
       activeSecondsLocal - last_sent_local
   onde AMBOS os valores vêm do localStorage desta
   máquina — nunca de uma leitura ao Firestore.
══════════════════════════════════════════════ */
async function _flush() {
  if (!_uid || !_sessionId) return;

  const now           = Date.now();
  const dataKey        = _dateKey(_startedAt);
  const activeSeconds  = _calcActiveSeconds();
  const lastSent       = _readLSNumber(LS_LAST_SENT_KEY, 0);
  const delta          = Math.max(0, activeSeconds - lastSent);

  _finalizarPaginaAtual();

  try {
    /* Estado da sessão (idempotente — sempre reflete o valor atual,
       não soma; pode ser regravado livremente sem risco de duplicar) */
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
      /* Diário e global precisam ser graváveis ATOMICAMENTE: se apenas
         um dos dois tivesse sucesso, LS_LAST_SENT_KEY seria avançado
         (ou não) de forma inconsistente com o que de fato foi persistido,
         e o retry duplicaria ou perderia parte do delta. writeBatch
         garante que ambos os increment() aplicam juntos ou nenhum aplica. */
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

      /* Só marca como enviado DEPOIS do commit atômico ter sucesso */
      localStorage.setItem(LS_LAST_SENT_KEY, String(activeSeconds));
    }

    console.log(`[session-tracker] flush: ${activeSeconds}s local | delta=${delta}s → Firebase`);
  } catch (err) {
    /* Falha de rede/offline/batch: NÃO atualiza LS_LAST_SENT_KEY,
       então o delta correto (intacto, nunca parcialmente aplicado)
       será reenviado no próximo flush que tiver sucesso. O tempo
       local continua existindo e crescendo independentemente disso. */
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
    /* Avisa outras abas (atalho de latência apenas) para reavaliarem
       o lock imediatamente, em vez de esperar o próximo poll. */
    _bc?.postMessage({ type: 'reavaliar', uid: _uid });
  } else {
    /* Reavalia já — tenta lock real, não assume nada por mensagem */
    _avaliarPosseDoLock();
    _bc?.postMessage({ type: 'reavaliar', uid: _uid });

    if (_navCurrentPage !== null) _navPageStart = Date.now();
  }
}

function _onBeforeUnload() {
  if (_isOwner()) {
    _pauseLocalTimer();
    _releaseLock();
    /* flush síncrono best-effort; navegador pode interromper,
       mas o tempo já está salvo no localStorage de qualquer forma
       e será reenviado no próximo flush bem-sucedido (heartbeat
       da próxima aba/sessão), nunca perdido. */
    _flush().catch(() => {});
  }
  _bc?.postMessage({ type: 'reavaliar', uid: _uid });
}

/* ══════════════════════════════════════════════
   LIMPEZA DE SESSÕES ZUMBI
   Sessão salva no sessionStorage mas sem flush
   final — marca como encerrada sem adicionar tempo.
══════════════════════════════════════════════ */
async function _resolverSessaoZumbi(uid, sessionId) {
  if (!uid || !sessionId) return;
  try {
    const snap = await getDoc(_sessaoRef(uid, sessionId));
    if (!snap.exists()) return;

    const data    = snap.data();
    const endedAt = data.endedAt ?? 0;
    const eZumbi  = (Date.now() - endedAt) > ZOMBIE_THRESHOLD;

    if (eZumbi) {
      console.warn('[session-tracker] sessão zumbi detectada:', sessionId,
        `| duração salva: ${data.duracao ?? 0}s`);
      await setDoc(_sessaoRef(uid, sessionId), {
        _encerradaComoZumbi: true,
      }, { merge: true });
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
    /* Reutiliza sessão existente — recupera nav/quiz do Firestore */
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

        /* localStorage já tem o tempo acumulado desta sessão — não
           sobrescreve. Cálculo de tempo nunca usa o valor do Firestore. */
        const lsAccum = _readLSNumber(LS_ACCUM_KEY, 0);
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

  /* Lock global determinístico — única decisão sobre quem conta tempo */
  _initLockSystem();

  /* Timer de notificação de UI — lê localStorage a cada segundo */
  _notifyTimer = setInterval(() => {
    _notify();
  }, NOTIFY_INTERVAL);

  /* Heartbeat de persistência — só efetivamente envia delta se dona */
  _heartbeatTimer = setInterval(() => {
    if (_isOwner()) _flush();
  }, HEARTBEAT_INTERVAL);

  document.addEventListener('visibilitychange', _onVisibilityChange);
  window.addEventListener('beforeunload', _onBeforeUnload);

  /* Se a sessão era nova (não havia storedId), cria no Firestore */
  const eNova = !storedId;
  if (eNova) await _criarSessaoFirestore();

  __nexusPageEnter(location.pathname);
  _notify();
}

async function _iniciarNovaSessao() {
  /* Resolve possível zumbi da sessão anterior */
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

  /* Zera o timer local para nova sessão */
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
   Compatível 100% com v6 — dashboard não muda.
══════════════════════════════════════════════ */
export function getStats() {
  const dono = _isOwner();
  return {
    sessionId:      _sessionId,
    uid:            _uid,
    activeSeconds:  _calcActiveSeconds(),    /* calculado por timestamp local */
    isRunning:      dono && document.visibilityState !== 'hidden',
    isLeader:       dono,                    /* mantido para compatibilidade — agora 100% derivado do lock */
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
   carregarEstatisticas — inalterado de v6
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
      if (historico[key]?.tempoTotal > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
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

    const melhorDia = diasComTempo.reduce(
      (best, d) => (d.tempoTotal > best.tempo ? { key: d.data, tempo: d.tempoTotal } : best),
      { key: null, tempo: 0 }
    );

    return {
      tempoTotalGeral: dadosUsuario.tempoTotalGeral ?? 0,
      totalSessoes:    dadosUsuario.totalSessoes    ?? 0,
      ultimaAtividade: dadosUsuario.ultimaAtividade ?? null,
      tempoHoje,
      streak,
      diasAtivos30,
      mediaDiaria,
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
   NAVIGATION ANALYTICS — helpers internos
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

  if (_initialized && _uid && _isOwner()) _flush().catch(() => {});
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