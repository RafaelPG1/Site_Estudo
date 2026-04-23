/* ═══════════════════════════════════════════════════
   NEXUS STUDY — games/jogos/flashcard/storage.js
   SRS persistido no localStorage.
   Chave: nexus_srs_{usuario}_{discId}_{sem}
═══════════════════════════════════════════════════ */

const _chave = (usuario, discId, sem) =>
  `nexus_srs_${usuario}_${discId}_${sem}`;

export async function carregarPerfisSRS(usuario, discId, sem) {
  try {
    const salvo = localStorage.getItem(_chave(usuario, discId, sem));
    return salvo ? JSON.parse(salvo) : {};
  } catch {
    return {};
  }
}

export async function salvarPerfilSRS(usuario, cardId, perfil, discId, sem) {
  try {
    const chave = _chave(usuario, discId, sem);
    const atual = JSON.parse(localStorage.getItem(chave) || '{}');
    atual[cardId] = perfil;
    localStorage.setItem(chave, JSON.stringify(atual));
  } catch (err) {
    console.error('[storage.js] Erro ao salvar:', err);
  }
}

export function limparPerfisSRS(usuario, discId, sem) {
  localStorage.removeItem(_chave(usuario, discId, sem));
}