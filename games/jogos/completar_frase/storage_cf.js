/* ═══════════════════════════════════════════════════════════════
   NEXUS STUDY — games/jogos/completar_frase/storage_cf.js

   Histórico de desempenho do "Complete a Frase" persistido no
   Firestore + localStorage (fallback/cache).

   Segue exatamente o mesmo padrão de storage_vf.js (v7.0).

   Chave local : nexus_cf_{usuario}_{discId}_{sem}
   Firestore   : usuarios/{uid}/cf_historico/{sem}_{discId}

   Estrutura de cada entrada:
     {
       [questaoId]: {
         tentativas,
         acertos,
         erros,
         ultimaVez,
         acertosConsecutivos
       }
     }
═══════════════════════════════════════════════════════════════ */

import { criarStorage, lerLocal, escreverLocal } from '../../template/storage-base.js';

const _base = criarStorage({
  colecaoFirestore: 'cf_historico',
  prefixoLocal:     'nexus_cf_hist',
  nomeSistema:      'storage_cf',
});

/* Chave local — necessária para atualização incremental antes do merge */
const _chaveLocal = (usuario, discId, sem) =>
  `nexus_cf_hist_${usuario}_${discId}_${sem}`;

/* ══════════════════════════════════════════════════════════
   CARREGAR histórico completo da disciplina
══════════════════════════════════════════════════════════ */
export async function carregarHistoricoCF(usuario, discId, sem) {
  return _base.carregar(usuario, discId, sem);
}

/* ══════════════════════════════════════════════════════════
   SALVAR resultado de uma ou mais respostas
   Recebe array: [{ id, acertou }]
══════════════════════════════════════════════════════════ */
export async function salvarResultadoCF(usuario, discId, sem, resultados) {
  const validos = (resultados ?? []).filter(r => r?.id);
  if (validos.length === 0) return;

  /* Atualiza localStorage de forma incremental */
  const chave = _chaveLocal(usuario, discId, sem);
  const atual = lerLocal(chave);

  for (const { id, acertou } of validos) {
    const entrada = atual[id] ?? {
      tentativas: 0, acertos: 0, erros: 0,
      ultimaVez: 0, acertosConsecutivos: 0,
    };
    entrada.tentativas++;
    if (acertou) {
      entrada.acertos++;
      entrada.acertosConsecutivos = (entrada.acertosConsecutivos ?? 0) + 1;
    } else {
      entrada.erros++;
      entrada.acertosConsecutivos = 0;
    }
    entrada.ultimaVez = Date.now();
    atual[id] = entrada;
  }

  escreverLocal(chave, atual);

  /* Monta patch e delega o merge ao base (Firestore) */
  const patch = {};
  for (const { id } of validos) patch[id] = atual[id];
  await _base.salvarMerge(usuario, discId, sem, patch);
}

/* ══════════════════════════════════════════════════════════
   LIMPAR histórico de uma disciplina
══════════════════════════════════════════════════════════ */
export async function limparHistoricoCF(usuario, discId, sem) {
  await _base.limpar(usuario, discId, sem);
}