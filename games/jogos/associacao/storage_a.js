/* ═══════════════════════════════════════════════════════════════
   NEXUS STUDY — games/jogos/associacao/storage_a.js

   Histórico de desempenho do Associação persistido no
   Firestore + localStorage (fallback/cache).

   Chave local : nexus_assoc_{usuario}_{discId}_{sem}
   Firestore   : usuarios/{uid}/assoc_historico/{sem}_{discId}

   Estrutura de cada entrada:
     { [parId]: { tentativas, acertos, erros, ultimaVez } }
═══════════════════════════════════════════════════════════════ */

import { criarStorage, lerLocal, escreverLocal } from '../../template/storage-base.js';

const _base = criarStorage({
  colecaoFirestore: 'assoc_historico',
  prefixoLocal:     'nexus_assoc',
  nomeSistema:      'storage_a_historico',
});

const _chaveLocal = (usuario, discId, sem) =>
  `nexus_assoc_${usuario}_${discId}_${sem}`;

/* ══════════════════════════════════════════════════════════
   CARREGAR histórico completo da disciplina
══════════════════════════════════════════════════════════ */
export async function carregarHistoricoAssoc(usuario, discId, sem) {
  return _base.carregar(usuario, discId, sem);
}

/* ══════════════════════════════════════════════════════════
   SALVAR resultado de uma rodada
   Recebe array de resultados: [{ id, acertou }]
══════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════
   LIMPAR histórico de uma disciplina
══════════════════════════════════════════════════════════ */
export async function limparHistoricoAssoc(usuario, discId, sem) {
  await _base.limpar(usuario, discId, sem);
}