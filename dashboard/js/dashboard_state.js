/* =============================================
   NEXUS STUDY — dashboard\js\dashboard_state.js
   Dashboard: State (fonte única de verdade em memória).
   Extraído de dashboard_data.js (Fase 7) para eliminar o ciclo
   dashboard_data ↔ dashboard_render. Sem imports, sem lógica.
   dashboard_data.js continua re-exportando State.
   ============================================= */

export const State = {
  semestre:    null,
  disciplinas: [],
  discAtiva:   null,
  DISC_CORES:  {},

  /* ── CAMADA 5 ──
     Resultado completo de relatorioEvolucao(uid) mais
     dados complementares (tentativasRecentes, conquistas).
     Populado por _carregarIntelligence(uid).
     Nunca modificado diretamente por nenhum renderizador.
     Nunca recalculado — apenas recebido da API pública.

     IMPORTANTE: apesar de este relatório em si ser filtrado
     pelo semestre selecionado (State.semestre), os campos
     `.conquistas` e `.conquistasProgresso` dentro dele são
     SEMPRE calculados a partir de um relatório GLOBAL separado
     (semestre=null), buscado internamente por
     _carregarIntelligence — ver changelog "CORREÇÃO — CONQUISTAS
     INDEPENDENTES DE SEMESTRE" no topo do arquivo. */
  intelligence: null,
};
