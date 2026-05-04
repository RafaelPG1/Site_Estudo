/* ═══════════════════════════════════════════════════════════════
   NEXUS STUDY — games/template/deck.js

   Algoritmo de seleção ponderada de questões compartilhado entre:
     - Verdadeiro ou Falso  (vdd_falso.js)
     - Show do Milhão       (show_milhao.js)

   O código era 100% idêntico nos dois jogos. Centralizado aqui.

   COMO USAR:
   ──────────
     import { calcularPeso, sorteiarPonderado } from '../../template/deck.js';

     const candidatos = banco.map(q => ({
       item: q,
       peso: calcularPeso(q.id, historico, { pesoNuncaVisto: 3, pesoMin: 1, pesoMax: 10 })
     }));
     const selecionadas = sorteiarPonderado(candidatos, 10);
═══════════════════════════════════════════════════════════════ */

/**
 * Calcula o peso de seleção de uma questão com base no histórico.
 *
 * Questões nunca vistas recebem o peso máximo de novidade.
 * Questões com alta taxa de erro recebem peso alto para reaparecer mais.
 *
 * @param {string} id         — ID da questão
 * @param {object} historico  — mapa { [id]: { tentativas, erros, ... } }
 * @param {object} [cfg]
 * @param {number} [cfg.pesoNuncaVisto=3]  — peso para questões inéditas
 * @param {number} [cfg.pesoMin=1]         — peso mínimo (taxa de erro 0%)
 * @param {number} [cfg.pesoMax=10]        — peso máximo (taxa de erro 100%)
 * @returns {number}
 */
export function calcularPeso(id, historico, cfg = {}) {
  const { pesoNuncaVisto = 3, pesoMin = 1, pesoMax = 10 } = cfg;
  const h = historico[id];
  if (!h || h.tentativas === 0) return pesoNuncaVisto;
  const taxaErro = h.erros / h.tentativas;
  return Math.round(pesoMin + taxaErro * (pesoMax - pesoMin));
}

/**
 * Seleciona N itens de um array de candidatos ponderados.
 *
 * Cada candidato é { item, peso }. A probabilidade de seleção é
 * proporcional ao peso. Itens selecionados são removidos do pool
 * (sem repetição).
 *
 * [BUG CORRIGIDO] Adicionado fallback para quando rand expira sem
 * dar break (arredondamento de ponto flutuante), evitando loop infinito.
 *
 * @param {{ item: any, peso: number }[]} candidatos
 * @param {number} n
 * @returns {any[]}  — array de `item` selecionados (sem o wrapper de peso)
 */
export function sorteiarPonderado(candidatos, n) {
  const pool = [...candidatos];
  const sel  = [];

  while (sel.length < n && pool.length > 0) {
    const total = pool.reduce((acc, c) => acc + c.peso, 0);

    if (total <= 0) {
      // Todos os pesos são zero — seleção aleatória uniforme
      const i = Math.floor(Math.random() * pool.length);
      sel.push(pool[i].item);
      pool.splice(i, 1);
      continue;
    }

    let rand = Math.random() * total;
    let hit  = false;

    for (let i = 0; i < pool.length; i++) {
      rand -= pool[i].peso;
      if (rand <= 0) {
        sel.push(pool[i].item);
        pool.splice(i, 1);
        hit = true;
        break;
      }
    }

    // Fallback: rand acabou exatamente em zero após todos os pesos
    // (arredondamento FP) — seleciona o último elemento restante
    if (!hit && pool.length > 0) {
      sel.push(pool[pool.length - 1].item);
      pool.splice(pool.length - 1, 1);
    }
  }

  return sel;
}