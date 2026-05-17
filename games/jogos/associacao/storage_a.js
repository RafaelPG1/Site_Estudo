/* ════════════════════════════════════════════════════════════════
   NEXUS STUDY — games/jogos/associacao/storage_a.js

   Dois sistemas em um:
   1. SESSÃO   — sessionStorage (estado do jogo em andamento)
   2. HISTÓRICO — Firestore + localStorage (desempenho persistido)

   Chave local histórico : nexus_assoc_{usuario}_{discId}_{sem}
   Firestore             : usuarios/{uid}/assoc_historico/{sem}_{discId}
════════════════════════════════════════════════════════════════ */

import { criarStorage, lerLocal, escreverLocal } from '../../template/storage-base.js';

/* ══════════════════════════════════════════════════════════════
   PARTE 1 — SESSÃO (sessionStorage)
   Persiste o estado de cada rodada durante a sessão do browser.
══════════════════════════════════════════════════════════════ */

const PREFIX = 'assoc_r_';

/**
 * Salva o estado de uma rodada.
 * @param {number} roundIndex  - índice 0-based da rodada
 * @param {object} state       - { placements, poolOrder, verified }
 */
export function saveRound(roundIndex, state) {
  try {
    sessionStorage.setItem(PREFIX + roundIndex, JSON.stringify(state));
  } catch (e) {
    console.warn('[storage_a] Falha ao salvar rodada', roundIndex, e);
  }
}

/**
 * Carrega o estado salvo de uma rodada.
 * @param {number} roundIndex
 * @returns {object|null}
 */
export function loadRound(roundIndex) {
  try {
    const raw = sessionStorage.getItem(PREFIX + roundIndex);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('[storage_a] Falha ao carregar rodada', roundIndex, e);
    return null;
  }
}

/**
 * Remove o estado salvo de uma rodada.
 * @param {number} roundIndex
 */
export function clearRound(roundIndex) {
  try {
    sessionStorage.removeItem(PREFIX + roundIndex);
  } catch (e) {
    console.warn('[storage_a] Falha ao limpar rodada', roundIndex, e);
  }
}

/**
 * Limpa todos os dados do jogo (nova sessão completa).
 */
export function clearAll() {
  try {
    const keys = Object.keys(sessionStorage).filter(function (k) {
      return k.startsWith(PREFIX) || k === 'assoc_seed' || k === 'assoc_round';
    });
    keys.forEach(function (k) { sessionStorage.removeItem(k); });
  } catch (e) {
    console.warn('[storage_a] Falha ao limpar tudo', e);
  }
}

/* ══════════════════════════════════════════════════════════════
   PARTE 2 — HISTÓRICO (Firestore + localStorage)
   Persiste o desempenho do usuário entre sessões.
══════════════════════════════════════════════════════════════ */

const _base = criarStorage({
  colecaoFirestore: 'assoc_historico',
  prefixoLocal:     'nexus_assoc',
  nomeSistema:      'storage_a',
});

const _chaveLocal = (usuario, discId, sem) =>
  `nexus_assoc_${usuario}_${discId}_${sem}`;

/**
 * Carrega o histórico completo de uma disciplina.
 */
export async function carregarHistoricoAssoc(usuario, discId, sem) {
  return _base.carregar(usuario, discId, sem);
}

/**
 * Salva o resultado de uma rodada no histórico.
 * @param {string} usuario
 * @param {string} discId
 * @param {string} sem
 * @param {Array}  resultados — [{ id, acertou }]
 */
export async function salvarResultadoAssoc(usuario, discId, sem, resultados) {
  const validos = (resultados ?? []).filter(
    r => r.id !== null && r.id !== undefined,
  );

  if (validos.length === 0) return;

  const chave = _chaveLocal(usuario, discId, sem);
  const atual = lerLocal(chave);

  for (const { id, acertou } of validos) {
    const entrada = atual[id] ?? {
      tentativas: 0, acertos: 0, erros: 0, ultimaVez: 0,
    };
    entrada.tentativas++;
    if (acertou) {
      entrada.acertos++;
    } else {
      entrada.erros++;
    }
    entrada.ultimaVez = Date.now();
    atual[id] = entrada;
  }

  escreverLocal(chave, atual);

  const patch = {};
  for (const { id } of validos) patch[id] = atual[id];
  await _base.salvarMerge(usuario, discId, sem, patch);
}

/**
 * Limpa o histórico de uma disciplina.
 */
export async function limparHistoricoAssoc(usuario, discId, sem) {
  await _base.limpar(usuario, discId, sem);
}