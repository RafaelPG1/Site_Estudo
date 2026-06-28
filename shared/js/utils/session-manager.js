/* =============================================
   NEXUS STUDY — shared/js/utils/session-tracker.js
   Rastreamento de sessão por usuário
   shared/js/session-tracker.js
   =============================================

   Integração:
     Chamado via nexus:loginSuccess (index.js) → iniciarSessao()
     Chamado via nexus:logout       (index.js) → encerrarSessao()

   Estrutura Firestore gerada:
     usuarios/{uid}/sessoes/{sessionId}
       - uid        : string
       - nome       : string
       - avatar     : string
       - entrada    : number (timestamp ms)
       - saida      : number | null
       - duracao    : number | null  (ms)
       - encerramento: 'ativo' | 'normal' | 'beforeunload' | 'timeout'

   Estratégia de cobertura:
     1. Entrada      → registrada ao chamar iniciarSessao() (apenas na 1ª vez por aba)
     2. Retomada     → F5 / navegação entre páginas retomam a sessão via sessionStorage
     3. Heartbeat    → atualiza campo "saida" a cada 60 s (sessão "ao vivo")
     4. beforeunload → registra saída exata ao fechar/recarregar
     5. Logout       → encerrarSessao() registra saída com motivo 'normal'
     6. Timeout      → sessão sem heartbeat recente é considerada encerrada pelo admin
============================================= */

import { getUsuario }   from '../../../src/global.js';
import { getDb }        from '../../../src/firebase.js';
import {
  doc, setDoc, updateDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

/* ── Constantes ── */
const HEARTBEAT_MS   = 60_000;   // intervalo do heartbeat (1 min)
const SESSION_PREFIX = 'nexus_session_';

/* ── Estado interno ── */
let _sessionId   = null;
let _uid         = null;
let _entradaMs   = null;
let _hbInterval  = null;
let _registrada  = false;

/* ══════════════════════════════════════════════
   API PÚBLICA
══════════════════════════════════════════════ */

/**
 * Inicia o rastreamento da sessão para o usuário atual.
 * Deve ser chamada uma vez por página, após a autenticação.
 * Chamadas duplicadas na mesma aba são ignoradas.
 *
 * Comportamento no F5 / navegação entre páginas:
 *   O sessionStorage persiste enquanto a aba estiver aberta.
 *   Se existir um sessionId salvo para o uid atual, a sessão é
 *   retomada — sem criar novo documento no Firestore. O heartbeat
 *   continua atualizando o documento existente.
 *   Uma nova sessão só é criada quando não há registro no sessionStorage
 *   (primeiro login, ou sessão encerrada/expirada).
 */
export async function iniciarSessao() {
  if (_registrada) return;

  const u = getUsuario();
  if (!u || !u.uid) return;          // usuário não autenticado — sem rastreamento

  _uid = u.uid;

  // ── Verifica se há sessão ativa desta aba no sessionStorage ──
  const sessaoExistente = _lerIdLocal();

  if (sessaoExistente) {
    // Retoma a sessão sem criar novo documento no Firestore.
    // Isso cobre F5 e navegação entre páginas.
    _sessionId  = sessaoExistente;
    _entradaMs  = parseInt(sessaoExistente, 10);   // sessionId = timestamp de entrada
    console.log('[session-tracker] retomando sessão existente:', _sessionId);
  } else {
    // Primeira entrada: cria novo documento no Firestore.
    _entradaMs = Date.now();
    _sessionId = `${_entradaMs}`;
    _salvarIdLocal();
    await _criarSessao(u);
    console.log('[session-tracker] nova sessão criada:', _sessionId);
  }

  // ── Marca que essa aba já iniciou o rastreamento ──
  _registrada = true;

  // ── Heartbeat: mantém a sessão "ao vivo" ──
  _hbInterval = setInterval(_heartbeat, HEARTBEAT_MS);

  // ── Registra saída ao fechar/recarregar ──
  window.addEventListener('beforeunload', _aoFechar);
}

/**
 * Encerra a sessão manualmente (ex: no botão de logout).
 * Registra saída com encerramento = 'normal'.
 */
export async function encerrarSessao() {
  if (!_registrada || !_sessionId) return;
  clearInterval(_hbInterval);
  window.removeEventListener('beforeunload', _aoFechar);
  await _registrarSaida('normal');
  _limparLocal();
  _registrada = false;
}

/* ══════════════════════════════════════════════
   INTERNOS
══════════════════════════════════════════════ */

async function _criarSessao(u) {
  try {
    const ref = _docRef();
    await setDoc(ref, {
      uid:          _uid,
      nome:         u.nome ?? u.uid,
      avatar:       u.avatar ?? '🎓',
      entrada:      _entradaMs,
      saida:        null,
      duracao:      null,
      encerramento: 'ativo',
    });
  } catch (err) {
    console.warn('[session-tracker] _criarSessao erro:', err);
  }
}

async function _heartbeat() {
  if (!_sessionId) return;
  const agora = Date.now();
  try {
    await updateDoc(_docRef(), {
      saida:        agora,
      duracao:      agora - _entradaMs,
      encerramento: 'ativo',
    });
  } catch (err) {
    // Heartbeat silencioso — não interrompe a experiência do usuário
    console.warn('[session-tracker] heartbeat erro:', err);
  }
}

async function _registrarSaida(motivo) {
  const agora = Date.now();
  try {
    await updateDoc(_docRef(), {
      saida:        agora,
      duracao:      agora - _entradaMs,
      encerramento: motivo,
    });
  } catch (err) {
    console.warn('[session-tracker] _registrarSaida erro:', err);
  }
}

/**
 * Handler do beforeunload — registra a saída exata antes de fechar/recarregar.
 * Não chama _limparLocal() pois no F5 o sessionStorage deve ser mantido
 * para que a próxima carga da página retome a mesma sessão.
 */
function _aoFechar() {
  if (!_sessionId) return;

  clearInterval(_hbInterval);

  const agora   = Date.now();
  const duracao = agora - _entradaMs;

  // Tenta updateDoc antes de a aba fechar.
  // Se falhar, o heartbeat anterior é a melhor estimativa disponível.
  updateDoc(_docRef(), {
    saida:        agora,
    duracao:      duracao,
    encerramento: 'beforeunload',
  }).catch(() => {
    // Fallback silencioso — heartbeat cobrirá o timestamp aproximado.
  });
}

function _docRef() {
  const db = getDb();
  return doc(db, 'usuarios', _uid, 'sessoes', _sessionId);
}

function _salvarIdLocal() {
  try {
    sessionStorage.setItem(`${SESSION_PREFIX}${_uid}`, _sessionId);
  } catch { /* ignorar se sessionStorage não disponível */ }
}

function _lerIdLocal() {
  try {
    return sessionStorage.getItem(`${SESSION_PREFIX}${_uid}`) ?? null;
  } catch { return null; }
}

function _limparLocal() {
  try {
    sessionStorage.removeItem(`${SESSION_PREFIX}${_uid}`);
  } catch { /* ignorar */ }
}