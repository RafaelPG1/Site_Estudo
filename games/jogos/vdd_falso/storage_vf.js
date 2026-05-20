/* ═══════════════════════════════════════════════════════════════
   NEXUS STUDY — games/jogos/vdd_falso/storage_vf.js  (v7.0)

   Histórico de desempenho do V/F persistido no
   Firestore + localStorage (fallback/cache).

   REFATORAÇÃO v7.0
   ────────────────
   Usa criarStorage() de ../../template/storage-base.js para toda a
   plombing de Firestore+localStorage. Este arquivo mantém apenas a
   lógica de domínio: acumulação de tentativas/acertos/erros.

   Chave local : nexus_vf_{usuario}_{discId}_{sem}
   Firestore   : usuarios/{uid}/vf_historico/{sem}_{discId}

   Estrutura de cada entrada:
     { [questaoId]: { tentativas, acertos, erros, ultimaVez, acertosConsecutivos } }

   FILTRO DE TIMEOUTS (mantido da v6.2):
   Questões com resp === null (tempo esgotado) são excluídas antes
   de qualquer processamento — são neutras no jogo e não devem
   contaminar o histórico nem o algoritmo de peso ponderado.
═══════════════════════════════════════════════════════════════ */

import { criarStorage, lerLocal, escreverLocal } from '../../template/storage-base.js';

const _base = criarStorage({
  colecaoFirestore: 'vf_historico',
  prefixoLocal:     'nexus_vf',
  nomeSistema:      'storage_vf',
});

/* chave local — necessária para atualização incremental */
const _chaveLocal = (usuario, discId, sem) =>
  `nexus_vf_${usuario}_${discId}_${sem}`;

/* ══════════════════════════════════════════════════════════
   CARREGAR histórico completo da disciplina
══════════════════════════════════════════════════════════ */
export async function carregarHistoricoVF(usuario, discId, sem) {
  return _base.carregar(usuario, discId, sem);
}

/* ══════════════════════════════════════════════════════════
   SALVAR resultado de uma rodada
   Recebe array de resultados: [{ id, acertou, resp? }]

   Defesa em profundidade: filtra resp === null (timeouts)
   mesmo que o caller já tenha filtrado, pois evita que uma
   mudança futura no caller introduza erros indevidos.
══════════════════════════════════════════════════════════ */
export async function salvarResultadoVF(usuario, discId, sem, resultados) {
  // Filtra timeouts (resp === null) — neutros no histórico
  const validos = (resultados ?? []).filter(
    r => r.resp !== null && r.resp !== undefined,
  );

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

  return atual; // retorna o histórico completo atualizado para o caller
}

/* ══════════════════════════════════════════════════════════
   LIMPAR histórico de uma disciplina
══════════════════════════════════════════════════════════ */
export async function limparHistoricoVF(usuario, discId, sem) {
  await _base.limpar(usuario, discId, sem);
}