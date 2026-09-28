/* dashboard\js\conquista\index.js
   Conquistas — INTERFACE ÚNICA com o Dashboard. O Dashboard
   (dashboard_data.js / dashboard_render.js) importa SOMENTE deste
   arquivo; nunca de catalogo.js, regras.js ou conquistas.js.

   Contrato:
     carregarConquistas(quizIntelligence, uid, statsPromise)
        → Promise<{ conquistas, conquistasProgresso }>
        · quizIntelligence: módulo quiz_intelligence.js já importado
          pelo Dashboard (o Dashboard é dono desse import dinâmico).
        · statsPromise: estatísticas de sessão (carregarEstatisticas),
          também obtidas pelo Dashboard.
        · Conquistas são SEMPRE globais (semestre=null): busca aqui o
          relatório e a contagem de questões globais, independentes do
          seletor de semestre. (Regra do changelog "CONQUISTAS
          INDEPENDENTES DE SEMESTRE" de dashboard_data.js.)
        · O Dashboard apenas grava o resultado em
          relatorio.conquistas / relatorio.conquistasProgresso.

     renderAchievements(relatorio)
        → lê relatorio.conquistas / relatorio.conquistasProgresso e
          desenha a seção de Conquistas (contrato inalterado).

   SIMPLIFICAÇÃO (correção pós-reorganização): este arquivo NÃO importa
   mais nada de fora de dashboard/js/conquista/ — antes importava
   perfLog de '../../../src/perf_logger.js' (único import de 3 níveis
   do projeto; todo o resto nunca passa de '../../'). Essa instrumentação
   de tempo foi devolvida para dashboard_data.js, que já importa perfLog
   normalmente. Isso não muda nenhum log gerado — só reduz o número de
   caminhos relativos novos que dependem da profundidade exata da pasta
   conquista/, que é o ponto mais frágil de qualquer reorganização de
   pastas sem bundler. Se relatorioGlobal vier nulo (falha silenciosa de
   quiz_intelligence.js), retorna {} em vez de lançar erro — mantendo
   o Dashboard de pé mesmo se só Conquistas falhar.
   ═══════════════════════════════════════════════════════════ */

import { calcularConquistas, calcularProgressoConquistas } from './regras.js';

export { renderAchievements } from './conquistas.js';

export async function carregarConquistas(quizIntelligence, uid, statsPromise) {
  const [relatorioGlobal, totalQuestoesGlobal, stats] = await Promise.all([
    quizIntelligence.relatorioEvolucao(uid, null),
    typeof quizIntelligence.contarQuestoesRespondidas === 'function'
      ? quizIntelligence.contarQuestoesRespondidas(uid, null)
      : Promise.resolve(0),
    statsPromise,
  ]);

  if (!relatorioGlobal) return { conquistas: {}, conquistasProgresso: {} };

  relatorioGlobal.totalQuestoes = totalQuestoesGlobal;
  return {
    conquistas:          calcularConquistas(relatorioGlobal, stats),
    conquistasProgresso: calcularProgressoConquistas(relatorioGlobal, stats),
  };
}