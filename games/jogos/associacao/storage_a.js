/* ════════════════════════════════════════════════════════
   NEXUS STUDY — storage_a.js
   Persiste o estado de cada rodada do jogo de Associação.
   Usa sessionStorage (mantém durante a sessão do browser).
   Para persistência entre sessões, troque por localStorage.
   ════════════════════════════════════════════════════════ */

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
 * Remove o estado salvo de uma rodada (ex: ao reiniciar).
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
    const keys = Object.keys(sessionStorage).filter(function(k) {
      return k.startsWith(PREFIX) || k === 'assoc_seed' || k === 'assoc_round';
    });
    keys.forEach(function(k) { sessionStorage.removeItem(k); });
  } catch (e) {
    console.warn('[storage_a] Falha ao limpar tudo', e);
  }
}