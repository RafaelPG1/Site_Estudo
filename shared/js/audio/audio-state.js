// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/audio-state.js
   Estado global de áudio — fonte única de verdade
   Versão 1.2

   RESPONSABILIDADES
   ─────────────────────────────────────────────
   ✅ Este módulo É responsável por:
     - manter o modo de áudio atual (normal / low / mute)
     - aplicar o modo no sfx.js (setMasterVolume, mute, unmute)
     - carregar estado do Firebase por usuário
     - salvar estado no Firebase
     - reagir a login (nexus:loginSuccess) e logout (nexus:logout)
     - notificar subscribers quando o modo muda

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

   MODOS
   ─────────────────────────────────────────────
   'normal'  →  masterVolume 1.0, unmuted
   'low'     →  masterVolume 0.5, unmuted
   'mute'    →  masterVolume 0,   muted

   API PÚBLICA
   ─────────────────────────────────────────────
   audioState.getMode()             → 'normal' | 'low' | 'mute'
   audioState.setMode(id)           → aplica + persiste + notifica
   audioState.subscribe(fn)         → fn(modeId) chamado em cada mudança
   audioState.unsubscribe(fn)       → remove subscriber
   audioState.loadFromFirebase(uid) → carrega e aplica estado salvo
   audioState.reset()               → volta ao padrão, sem persistir
   ============================================= */

import audio from './sfx.js';
import { carregarConfigs, salvarConfigs } from '../../../src/firebase.js';

// getUsuario() foi REMOVIDO intencionalmente.
// Este módulo rastreia o UID atual via _currentUid (seção 2b),
// definido exclusivamente pelos eventos nexus:loginSuccess e nexus:logout.
// Isso elimina toda dependência do estado global de auth e impede
// que saves do Firebase usem o usuário errado em trocas rápidas de conta.

/* ═══════════════════════════════════════════════
   1. DEFINIÇÃO DOS MODOS
   Fonte única de verdade sobre o que cada modo
   significa em termos de volume/mute.
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
   2. ESTADO EM MEMÓRIA
═══════════════════════════════════════════════ */

/**
 * Modo atual. Começa no padrão e é sobrescrito
 * pelo loadFromFirebase após login.
 */
let _currentMode = DEFAULT_MODE;

/* ═══════════════════════════════════════════════
   2b. UID INTERNO — dono do estado atual
   ─────────────────────────────────────────────
   Definido SOMENTE pelos listeners de auth abaixo.
   Nunca lido de getUsuario() — isso eliminaria a
   garantia de isolamento entre contas.

   Ciclo de vida:
     null          → nenhum usuário logado (visitante)
     string (uid)  → usuário autenticado, capturado no
                     momento exato do nexus:loginSuccess

   Por que isso importa:
     _persistToFirebase() é fire-and-forget. Sem _currentUid,
     ela chamaria getUsuario() no momento da execução da Promise,
     que pode ser após uma troca de conta — salvando no uid errado.
     Com _currentUid, o uid é capturado no início do login e não
     muda até o próximo evento de auth.
═══════════════════════════════════════════════ */

let _currentUid = null;

/* ═══════════════════════════════════════════════
   2c. CONTROLE DE RACE CONDITION
   ─────────────────────────────────────────────
   Token incremental que identifica o request de
   Firebase mais recente. Qualquer resposta cujo
   token não bate com o atual é descartada — ela
   pertence a um login anterior já invalidado.

   Incrementado em dois momentos:
     • início do listener nexus:loginSuccess  → invalida login anterior
     • listener nexus:logout                  → invalida request pendente
═══════════════════════════════════════════════ */

let _activeLoadToken = 0;

/* ═══════════════════════════════════════════════
   3. SISTEMA DE SUBSCRIBERS
   Interfaces (ex: audio-btn) se registram aqui
   e recebem o novo modeId sempre que ele muda.
═══════════════════════════════════════════════ */

const _subscribers = new Set();

/**
 * Notifica todos os subscribers com o modo atual.
 * Chamado internamente após qualquer mudança de modo.
 */
function _notify() {
  for (const fn of _subscribers) {
    try { fn(_currentMode); } catch (err) {
      console.warn('[audio-state] subscriber error:', err);
    }
  }
}

/* ═══════════════════════════════════════════════
   4. APLICAÇÃO NO sfx.js
   Única função que traduz um modeId em chamadas
   concretas na engine de áudio.
═══════════════════════════════════════════════ */

/**
 * Aplica um modo diretamente na engine sfx.js.
 * Não altera _currentMode — apenas faz os gain nodes
 * refletirem os valores do modo recebido.
 *
 * @param {string} modeId — 'normal' | 'low' | 'mute'
 */
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

/**
 * Lê audioState do Firebase para um UID.
 * Retorna o modeId salvo ou null se não houver dado.
 *
 * @param {string} uid
 * @returns {Promise<string|null>}
 */
async function _fetchFromFirebase(uid) {
  try {
    const configs = await carregarConfigs(uid);
    const saved   = configs?.audioState;
    return VALID_MODES.includes(saved) ? saved : null;
  } catch (err) {
    console.warn('[audio-state] Erro ao carregar Firebase:', err);
    return null;
  }
}

/**
 * Salva o modeId no Firebase para o UID capturado no login.
 * Fire-and-forget — não bloqueia nada.
 *
 * Usa _currentUid (capturado em nexus:loginSuccess), NUNCA getUsuario().
 * Isso garante que o save sempre vai para o usuário que estava logado
 * no momento em que setMode() foi chamado, mesmo que getUsuario() já
 * tenha mudado por uma troca de conta subsequente.
 *
 * ATENÇÃO — por que usa getConfigs() aqui:
 * firebase.js salvarConfigs() faz setDoc({ configs: dados }, merge:true).
 * O merge ocorre no nível do documento, mas o campo "configs" é substituído
 * por inteiro. Se mandarmos apenas { audioState: modeId }, apagamos
 * tema, animacoes e todas as outras configs do usuário.
 * A solução é sempre salvar o objeto de configs completo com audioState atualizado.
 * getConfigs() é seguro aqui porque só lemos — não escrevemos de volta.
 *
 * @param {string} modeId
 */
function _persistToFirebase(modeId) {
  if (!_currentUid) return; // visitante ou pós-logout: não salva

  // Captura uid e configs localmente para que a closure da Promise use
  // valores fixos, independente de mudanças futuras em _currentUid ou
  // no estado de configs durante o await do Firestore.
  const uid = _currentUid;

  // Importa getConfigs apenas para compor o objeto completo a salvar.
  // Nunca é usado para determinar o modo — isso é responsabilidade
  // exclusiva de _currentMode e _currentUid deste módulo.
  import('../../../src/global.js').then(({ getConfigs }) => {
    const configsAtuais = getConfigs();
    const payload = { ...configsAtuais, audioState: modeId };
    salvarConfigs(uid, payload).catch(err => {
      console.warn(`[audio-state] Erro ao salvar Firebase (uid="${uid}"):`, err);
    });
  }).catch(err => {
    // Fallback: se o import dinâmico falhar (improvável, mas defensivo),
    // salva só o audioState. Pior caso: outras configs ficam desatualizadas
    // até o próximo setConfigs() do global.js.
    console.warn('[audio-state] fallback save sem configs completas:', err);
    salvarConfigs(uid, { audioState: modeId }).catch(() => {});
  });
}

/* ═══════════════════════════════════════════════
   6. LISTENERS DE AUTH
   Centraliza aqui toda a lógica de login/logout.
═══════════════════════════════════════════════ */

document.addEventListener('nexus:loginSuccess', async ({ detail }) => {
  // O uid DEVE vir do detail do evento — nunca de getUsuario().
  // O detail é preenchido pelo chamador (index.js ou global.js) no
  // momento exato do login, antes de qualquer mudança de contexto.
  const uid = detail?.uid;
  if (!uid) {
    console.warn('[audio-state] nexus:loginSuccess sem uid no detail — ignorado.');
    return;
  }

  // Captura o UID desta sessão antes de qualquer await.
  // _persistToFirebase() usará este valor, não getUsuario().
  _currentUid = uid;

  // Incrementa o token ANTES do await para invalidar qualquer
  // request pendente de login anterior. Somente este token,
  // capturado agora, tem autorização para alterar o estado.
  const token = ++_activeLoadToken;

  // Reset imediato para estado padrão enquanto aguardamos Firebase.
  // Garante que o usuário B nunca veja/ouça o estado do usuário A
  // durante os ~200ms de latência da busca.
  _currentMode = DEFAULT_MODE;
  audio.resetToDefaults();
  _applyToEngine(_currentMode);
  _notify();

  // Busca Firebase — fonte de verdade para este usuário.
  const saved = await _fetchFromFirebase(uid);

  // Guarda de race condition: se o token mudou durante o await,
  // significa que chegou um logout ou um login mais recente.
  // Esta resposta pertence a uma sessão já encerrada — descarta.
  if (token !== _activeLoadToken) {
    console.log(`[audio-state] resposta antiga descartada (uid="${uid}", token=${token})`);
    return;
  }

  // Aplica resultado (sobrescreve o padrão acima com o valor real).
  _currentMode = saved ?? DEFAULT_MODE;
  _applyToEngine(_currentMode);
  _notify();

  console.log(
    `[audio-state] uid="${uid}" → modo="${_currentMode}"`,
    saved !== null ? '(Firebase)' : '(padrão — primeiro acesso)'
  );
});

document.addEventListener('nexus:logout', () => {
  // Limpa o UID antes de qualquer outra operação.
  // A partir daqui _persistToFirebase() é no-op — sem uid, sem save.
  _currentUid = null;

  // Incrementa o token para invalidar qualquer _fetchFromFirebase
  // ainda em voo — sua resposta será descartada pelo guard acima.
  _activeLoadToken++;

  _currentMode = DEFAULT_MODE;
  audio.resetToDefaults();
  _applyToEngine(_currentMode);
  _notify();

  console.log('[audio-state] Logout → modo resetado para padrão');
});

/* ═══════════════════════════════════════════════
   7. API PÚBLICA
═══════════════════════════════════════════════ */

const audioState = {

  /**
   * Retorna o modeId atual.
   * @returns {'normal'|'low'|'mute'}
   */
  getMode() {
    return _currentMode;
  },

  /**
   * Define um novo modo, aplica na engine, persiste no Firebase
   * e notifica todos os subscribers.
   *
   * @param {'normal'|'low'|'mute'} modeId
   */
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

  /**
   * Registra uma função para ser chamada sempre que o modo mudar.
   * A função recebe o novo modeId como argumento.
   *
   * @param {(modeId: string) => void} fn
   */
  subscribe(fn) {
    if (typeof fn !== 'function') return;
    _subscribers.add(fn);
  },

  /**
   * Remove uma função registrada anteriormente.
   *
   * @param {(modeId: string) => void} fn
   */
  unsubscribe(fn) {
    _subscribers.delete(fn);
  },

  /**
   * Carrega o estado do Firebase para um UID e aplica.
   * Uso manual para casos onde o caller já tem o uid disponível
   * e não quer depender do evento nexus:loginSuccess.
   *
   * Protegido pelo mesmo sistema de token para evitar que chamadas
   * concorrentes externas corrompam o estado.
   *
   * @param {string} uid
   * @returns {Promise<void>}
   */
  async loadFromFirebase(uid) {
    if (!uid) return;

    // Atualiza o UID interno e captura o token desta operação.
    _currentUid = uid;
    const token = ++_activeLoadToken;

    const saved = await _fetchFromFirebase(uid);

    // Descarta se uma operação mais recente tomou o controle.
    if (token !== _activeLoadToken) {
      console.log(`[audio-state] loadFromFirebase descartado (uid="${uid}", token=${token})`);
      return;
    }

    _currentMode = saved ?? DEFAULT_MODE;
    _applyToEngine(_currentMode);
    _notify();
  },

  /**
   * Reseta o estado para o padrão em memória.
   * Não persiste no Firebase.
   * Chamado internamente no logout — pode ser chamado externamente
   * se necessário (ex: testes, troca de contexto).
   */
  reset() {
    _currentMode = DEFAULT_MODE;
    audio.resetToDefaults();
    _applyToEngine(_currentMode);
    _notify();
  },

  /**
   * Expõe os modos disponíveis para que interfaces
   * possam iterar sem hardcodar os IDs.
   * Retorna cópia — somente leitura.
   */
  getModes() {
    return { ...MODES };
  },

  /**
   * Expõe os IDs válidos.
   * @returns {string[]}
   */
  getValidModes() {
    return [...VALID_MODES];
  },
};

export default audioState;