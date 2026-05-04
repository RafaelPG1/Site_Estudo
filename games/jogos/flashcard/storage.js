/* ═══════════════════════════════════════════════════════════════
   NEXUS STUDY — games/jogos/flashcard/storage.js  (v2.0)

   SRS persistido no Firestore + localStorage (fallback/cache).

   REFATORAÇÃO v2.0
   ────────────────
   Agora usa criarStorage() de ../../template/storage-base.js para
   o padrão Firestore+localStorage. A lógica de domínio (perfil SRS
   individual) permanece aqui, pois é específica do flashcard.

   Chave local : nexus_srs_{usuario}_{discId}_{sem}
   Firestore   : usuarios/{uid}/srs_perfis/{sem}_{discId}
═══════════════════════════════════════════════════════════════ */

import { criarStorage } from '../../template/storage-base.js';

const _base = criarStorage({
  colecaoFirestore: 'srs_perfis',
  prefixoLocal:     'nexus_srs',
  nomeSistema:      'storage_srs',
});

/* ── CARREGAR perfis completos da disciplina ── */
export async function carregarPerfisSRS(usuario, discId, sem) {
  return _base.carregar(usuario, discId, sem);
}

/* ── SALVAR perfil de um card individual ── */
export async function salvarPerfilSRS(usuario, cardId, perfil, discId, sem) {
  await _base.salvarMerge(usuario, discId, sem, { [cardId]: perfil });
}

/* ── LIMPAR toda a disciplina ── */
export async function limparPerfisSRS(usuario, discId, sem) {
  await _base.limpar(usuario, discId, sem);
}