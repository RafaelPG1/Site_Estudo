/* dashboard\js\conquista\regras.js
   Conquistas — REGRAS de desbloqueio e progresso. Arquivo para EDITAR
   quando quiser mudar QUANDO uma conquista é desbloqueada ou como sua
   barra de progresso é calculada (ids devem existir em catalogo.js).

   Funções movidas de dashboard_data.js sem alterar nenhuma linha de
   lógica (apenas renomeadas: _calcularConquistas → calcularConquistas,
   _calcularProgressoConquistas → calcularProgressoConquistas, e
   exportadas). Continuam sendo funções puras: recebem o relatório
   GLOBAL (semestre=null) + estatísticas de sessão já em memória.
   ═══════════════════════════════════════════════════════════ */

/* ── Derivação das conquistas ────────────────────────────────
   Recebe o relatorio + estatísticas de sessão (ambos já em
   memória — nenhuma chamada adicional).

   IMPORTANTE (ver changelog "CONQUISTAS INDEPENDENTES DE
   SEMESTRE" no topo do arquivo): o `relatorio` recebido aqui
   por _carregarIntelligence é sempre o relatório GLOBAL
   (semestre=null), nunca o relatório filtrado pelo semestre
   selecionado no dashboard. Esta função em si não sabe nem
   precisa saber disso — ela só lê os campos do objeto que
   recebe; a garantia de "sempre global" é responsabilidade de
   quem chama (_carregarIntelligence).

   Retorna objeto { id: boolean } para renderAchievements().

   Regras de cada conquista — leitura de campos já existentes:
     sequencia7      → stats.streak >= 7
     sequencia30     → stats.streak >= 30
     tentativas100   → relatorio.scoreEvolutivo.totalTentativas >= 100
     questoesMil     → relatorio.totalQuestoes >= 1000
                       (contarQuestoesRespondidas já foi chamado e
                        armazenado em relatorio.totalQuestoes)
     scoreAvancado   → relatorio.scoreEvolutivo.nivelEstimado === 'avancado'
     emEvolucao      → relatorio.tendenciaDoAluno.direcao === 'melhorando'
     miraAfiada      → scoreEvolutivo.composicao.taxaAcertoMediaPct >= 75
     maratonista     → stats.melhorDia.tempo >= 18000 (5h)
     semQuedas       → fraquezasPorDisciplina sem nenhum emQueda === true
     sessoes50       → stats.totalSessoes >= 50
*/
export function calcularConquistas(relatorio, stats) {
  if (!relatorio || !stats) return {};

  const score      = relatorio.scoreEvolutivo;
  const tendencia  = relatorio.tendenciaDoAluno;
  const fraquezas  = relatorio.fraquezasPorDisciplina;

  const streak          = stats.streak ?? 0;
  const totalSessoes    = stats.totalSessoes ?? 0;
  const melhorDiaTempo  = stats.melhorDia?.tempo ?? 0;

  const totalTentativas   = score?.totalTentativas ?? 0;
  const totalQuestoes     = relatorio.totalQuestoes ?? 0;
  const nivelEstimado     = score?.nivelEstimado ?? '';
  const tendenciaDir      = tendencia?.direcao ?? '';
  const taxaMediaPct      = score?.composicao?.taxaAcertoMediaPct ?? 0;
  const temQueda          = Array.isArray(fraquezas)
    ? fraquezas.some(f => f?.emQueda === true)
    : false;

  return {
    sequencia7:    streak >= 7,
    sequencia30:   streak >= 30,
    tentativas100: totalTentativas >= 100,
    questoesMil:   totalQuestoes >= 1000,
    scoreAvancado: nivelEstimado === 'avançado',
    emEvolucao:    tendenciaDir === 'melhorando',
    miraAfiada:    taxaMediaPct >= 75,
    maratonista:   melhorDiaTempo >= 18000,
    semQuedas:     !temQueda && totalTentativas > 0,
    sessoes50:     totalSessoes >= 50,
  };
}

/* ── Progresso numérico das conquistas (apoio visual) ──────────
   NÃO recalcula nada e NÃO cria nenhuma regra nova: lê os MESMOS
   campos já extraídos em _calcularConquistas (streak, totalSessoes,
   totalTentativas, totalQuestoes, taxaAcertoMediaPct, melhorDia.tempo)
   e apenas expõe o par {atual, meta} para as barras de progresso
   da UI. A lógica de desbloqueio continua 100% em _calcularConquistas.

   IMPORTANTE: assim como em _calcularConquistas, o `relatorio`
   recebido aqui deve ser sempre o relatório GLOBAL (semestre=null)
   — ver changelog "CONQUISTAS INDEPENDENTES DE SEMESTRE". */
export function calcularProgressoConquistas(relatorio, stats) {
  if (!relatorio || !stats) return {};

  const score = relatorio.scoreEvolutivo;

  const streak           = stats.streak ?? 0;
  const totalSessoes     = stats.totalSessoes ?? 0;
  const melhorDiaTempo   = stats.melhorDia?.tempo ?? 0;
  const totalTentativas  = score?.totalTentativas ?? 0;
  const totalQuestoes    = relatorio.totalQuestoes ?? 0;
  const taxaMediaPct     = score?.composicao?.taxaAcertoMediaPct ?? 0;

  return {
    sequencia7:    { atual: streak,          meta: 7,     tipo: 'numero'     },
    sequencia30:   { atual: streak,          meta: 30,    tipo: 'numero'     },
    tentativas100: { atual: totalTentativas, meta: 100,   tipo: 'numero'     },
    questoesMil:   { atual: totalQuestoes,   meta: 1000,  tipo: 'numero'     },
    miraAfiada:    { atual: taxaMediaPct,    meta: 75,    tipo: 'percentual' },
    maratonista:   { atual: melhorDiaTempo,  meta: 18000, tipo: 'tempo'      },
    sessoes50:     { atual: totalSessoes,    meta: 50,    tipo: 'numero'     },
  };
}