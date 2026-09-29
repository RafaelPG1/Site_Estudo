/* dashboard\js\conquista\regras.js
   Conquistas — REGRAS de desbloqueio e progresso. Arquivo para EDITAR
   quando quiser mudar QUANDO uma conquista é desbloqueada ou como sua
   barra de progresso é calculada (ids devem existir em catalogo.js).

   Funções movidas de dashboard_data.js sem alterar nenhuma linha de
   lógica (apenas renomeadas: _calcularConquistas → calcularConquistas,
   _calcularProgressoConquistas → calcularProgressoConquistas, e
   exportadas). Continuam sendo funções puras: recebem o relatório
   GLOBAL (semestre=null) + estatísticas de sessão já em memória.

   ATUALIZAÇÃO DO CATÁLOGO (nova lista de conquistas):
   · As 10 regras originais NÃO foram alteradas (mesmas fórmulas).
   · Novas regras só usam métricas que o Nexus JÁ coleta:
       stats.tempoTotalGeral · stats.streak · relatorio.scoreEvolutivo ·
       extras.tentativas (listarTentativasRecentes, todas) ·
       extras.perfilUso (perfil_uso/global, heatmap por hora).
   · Conquistas cuja métrica NÃO existe (ou cujo limiar não foi
     definido) ficam em CONQUISTAS_PENDENTES, com o motivo. Elas
     aparecem como "bloqueadas" e NÃO têm regra nem progresso
     inventados — quando a métrica existir, basta criar a regra
     aqui e removê-la de CONQUISTAS_PENDENTES.
   ═══════════════════════════════════════════════════════════ */

/* Ordem dos níveis de quiz_intelligence.js (FAIXAS_NIVEL), do menor
   para o maior. Só leitura — o valor vem de scoreEvolutivo.nivelEstimado. */
const NIVEIS_ORDEM = ['fundamentos', 'iniciante', 'intermediário', 'proficiente', 'avançado'];

/* Conquistas que dependem da QUANTIDADE de outras desbloqueadas.
   São calculadas depois das demais e não contam a si mesmas. */
const CONQUISTAS_META = ['colecionador', 'veterano', 'lendario'];

/* Áreas principais REAIS do Nexus, conforme ROTA_LABELS em
   dashboard_data.js (quiz, resumo, atlas, dashboard, index=Início).
   'index' é a página inicial/launcher e não entra. Usada quando o
   Nexus passar a persistir quais áreas o usuário já visitou (ver
   'explorador' em CONQUISTAS_PENDENTES). Confirmar se existe outra
   área principal (ex.: games) que ainda não esteja em ROTA_LABELS. */
export const AREAS_PRINCIPAIS_NEXUS = ['dashboard', 'quiz', 'resumo', 'atlas'];

/* Mesma lógica de _extrairMapaAninhado em dashboard_data.js (o
   perfil_uso pode vir como mapa aninhado OU como chaves planas
   "hourHeatmap.14"). Repetida aqui porque conquista/ não importa
   nada de fora da própria pasta. */
function _extrairMapaAninhado(perfil, prefixo) {
  if (!perfil) return {};
  if (perfil[prefixo] && typeof perfil[prefixo] === 'object' && !Array.isArray(perfil[prefixo])) {
    return perfil[prefixo];
  }
  const resultado = {};
  const prefixoComPonto = `${prefixo}.`;
  Object.keys(perfil).forEach(chave => {
    if (chave.startsWith(prefixoComPonto)) resultado[chave.slice(prefixoComPonto.length)] = perfil[chave];
  });
  return resultado;
}

/* Totais derivados da lista de tentativas (cada item já traz acertos,
   respondidas e totalQuestoes). erros = respondidas − acertos, a mesma
   relação gravada em processarPayloadBruto. Retorna null quando a lista
   não está disponível — nesse caso as regras que dependem dela NÃO são
   avaliadas (ficam bloqueadas), em vez de assumir 0. */
function _agregarTentativas(tentativas) {
  if (!Array.isArray(tentativas)) return null;
  let acertos = 0;
  let erros = 0;
  let perfeito = false;
  for (const t of tentativas) {
    const a = Number(t?.acertos) || 0;
    const r = Number(t?.respondidas) || 0;
    const q = Number(t?.totalQuestoes) || 0;
    acertos += a;
    erros   += Math.max(0, r - a);
    /* Perfeito: quiz INTEIRO respondido e todas certas (1 questão certa
       de 1 respondida não conta). */
    if (q > 0 && r === q && a === r) perfeito = true;
  }
  return { acertos, erros, perfeito };
}

function _usoPorHora(perfilUso) {
  if (!perfilUso) return null;
  const mapa  = _extrairMapaAninhado(perfilUso, 'hourHeatmap');
  const soma  = horas => horas.reduce((acc, h) => acc + (Number(mapa[String(h)]) || 0), 0);
  return { antesDas6h: soma([0, 1, 2, 3, 4, 5]), apos23h: soma([23]) };
}

function _contarDesbloqueadas(mapa) {
  return Object.entries(mapa).filter(([id, v]) => v === true && !CONQUISTAS_META.includes(id)).length;
}

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
export function calcularConquistas(relatorio, stats, extras = {}) {
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

  /* ── métricas usadas apenas pelas regras novas ── */
  const tempoTotal = stats.tempoTotalGeral ?? 0;
  const agg        = _agregarTentativas(extras?.tentativas);
  const uso        = _usoPorHora(extras?.perfilUso);
  const nivelIdx   = NIVEIS_ORDEM.indexOf(nivelEstimado);
  const horas      = h => tempoTotal >= h * 3600;

  const mapa = {
    /* ── regras ORIGINAIS (inalteradas) ── */
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

    /* ── Estudos e Quizzes (mesma métrica de tentativas100) ── */
    primeiroPasso: totalTentativas >= 1,
    tentativas10:  totalTentativas >= 10,
    tentativas50:  totalTentativas >= 50,
    tentativas500: totalTentativas >= 500,

    /* ── Questões (mesma métrica de questoesMil) ── */
    questoes100:   totalQuestoes >= 100,
    questoes500:   totalQuestoes >= 500,
    questoes5000:  totalQuestoes >= 5000,

    /* ── Acertos / erros (soma sobre as tentativas) ── */
    acertos10:     !!agg && agg.acertos >= 10,
    acertos50:     !!agg && agg.acertos >= 50,
    acertos100:    !!agg && agg.acertos >= 100,
    acertos500:    !!agg && agg.acertos >= 500,
    erros10:       !!agg && agg.erros >= 10,
    erros100:      !!agg && agg.erros >= 100,
    erros1000:     !!agg && agg.erros >= 1000,

    /* ── Tempo de uso (usuarios/{uid}.tempoTotalGeral, em segundos) ── */
    tempo1h:       horas(1),
    tempo5h:       horas(5),
    tempo10h:      horas(10),
    tempo25h:      horas(25),
    tempo50h:      horas(50),
    tempo100h:     horas(100),

    /* ── Sequências (stats.streak — janela de 30 dias, ver pendentes) ── */
    sequencia3:    streak >= 3,
    sequencia15:   streak >= 15,

    /* ── Desempenho ── */
    scoreIntermediario: nivelIdx >= NIVEIS_ORDEM.indexOf('intermediário'),
    precisao90:    totalTentativas > 0 && taxaMediaPct >= 90,
    perfeito:      !!agg && agg.perfeito,

    /* ── Hábitos (perfil_uso.hourHeatmap: horas de USO do Nexus) ── */
    madrugador:    !!uso && uso.antesDas6h > 0,
    noturno:       !!uso && uso.apos23h > 0,
  };

  /* ── Especiais por contagem — depois de todas as outras ── */
  const n = _contarDesbloqueadas(mapa);
  mapa.colecionador = n >= 10;
  mapa.veterano     = n >= 25;
  mapa.lendario     = n >= 50;

  return mapa;
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
export function calcularProgressoConquistas(relatorio, stats, extras = {}) {
  if (!relatorio || !stats) return {};

  const score = relatorio.scoreEvolutivo;

  const streak           = stats.streak ?? 0;
  const totalSessoes     = stats.totalSessoes ?? 0;
  const melhorDiaTempo   = stats.melhorDia?.tempo ?? 0;
  const totalTentativas  = score?.totalTentativas ?? 0;
  const totalQuestoes    = relatorio.totalQuestoes ?? 0;
  const taxaMediaPct     = score?.composicao?.taxaAcertoMediaPct ?? 0;

  const tempoTotal = stats.tempoTotalGeral ?? 0;
  const agg        = _agregarTentativas(extras?.tentativas);
  const n          = _contarDesbloqueadas(calcularConquistas(relatorio, stats, extras));

  const num  = (atual, meta) => ({ atual, meta, tipo: 'numero' });
  const hora = h              => ({ atual: tempoTotal, meta: h * 3600, tipo: 'tempo' });

  const progresso = {
    /* ── ORIGINAIS (inalterados) ── */
    sequencia7:    { atual: streak,          meta: 7,     tipo: 'numero'     },
    sequencia30:   { atual: streak,          meta: 30,    tipo: 'numero'     },
    tentativas100: { atual: totalTentativas, meta: 100,   tipo: 'numero'     },
    questoesMil:   { atual: totalQuestoes,   meta: 1000,  tipo: 'numero'     },
    miraAfiada:    { atual: taxaMediaPct,    meta: 75,    tipo: 'percentual' },
    maratonista:   { atual: melhorDiaTempo,  meta: 18000, tipo: 'tempo'      },
    sessoes50:     { atual: totalSessoes,    meta: 50,    tipo: 'numero'     },

    /* ── novas (mesmos campos das regras acima) ── */
    primeiroPasso: num(totalTentativas, 1),
    tentativas10:  num(totalTentativas, 10),
    tentativas50:  num(totalTentativas, 50),
    tentativas500: num(totalTentativas, 500),
    questoes100:   num(totalQuestoes, 100),
    questoes500:   num(totalQuestoes, 500),
    questoes5000:  num(totalQuestoes, 5000),
    tempo1h:       hora(1),
    tempo5h:       hora(5),
    tempo10h:      hora(10),
    tempo25h:      hora(25),
    tempo50h:      hora(50),
    tempo100h:     hora(100),
    sequencia3:    num(streak, 3),
    sequencia15:   num(streak, 15),
    precisao90:    { atual: taxaMediaPct, meta: 90, tipo: 'percentual' },
    colecionador:  num(n, 10),
    veterano:      num(n, 25),
    lendario:      num(n, 50),
  };

  if (agg) {
    Object.assign(progresso, {
      acertos10:  num(agg.acertos, 10),   acertos50:  num(agg.acertos, 50),
      acertos100: num(agg.acertos, 100),  acertos500: num(agg.acertos, 500),
      erros10:    num(agg.erros, 10),     erros100:   num(agg.erros, 100),
      erros1000:  num(agg.erros, 1000),
    });
  }

  return progresso;
}

/* ══════════════════════════════════════════════════════════════
   CONQUISTAS PENDENTES — no catálogo, SEM regra ainda
   ──────────────────────────────────────────────────────────────
   Cada id abaixo existe em catalogo.js (aparece como "bloqueada"),
   mas NÃO pode ser calculado com o que o Nexus coleta hoje.
   Nenhuma regra ou progresso falso foi criado para elas.
   `motivo` diz exatamente o que falta. Para ativar uma: implemente
   a métrica, crie a regra em calcularConquistas() e apague a linha
   daqui.
══════════════════════════════════════════════════════════════ */
const _SEM_ORDEM   = 'Falta a ORDEM das respostas: performance/* guarda só totais por tentativa (acertos/erros), não a sequência de cada questão.';
const _SEM_LEITURA = 'Falta rastrear leitura: nenhum contador de conteúdos lidos nem tempo de leitura é gravado (navPages é por sessão e não separa "ler um resumo").';
const _SEM_LIMIAR  = 'Limiar/critério não definido no pedido ("bom desempenho", "vários", "significativamente"...). Definir números antes de implementar.';

export const CONQUISTAS_PENDENTES = {
  /* Questões — acertos seguidos */
  seguidos5: _SEM_ORDEM, seguidos10: _SEM_ORDEM, seguidos25: _SEM_ORDEM,
  seguidos50: _SEM_ORDEM, seguidos100: _SEM_ORDEM, genio: _SEM_ORDEM,

  /* Leitura / Resumos */
  primeiraLeitura: _SEM_LEITURA, leitor: _SEM_LEITURA, leitorAssiduo: _SEM_LEITURA,
  leitorDedicado: _SEM_LEITURA,
  leitura1h: _SEM_LEITURA, leitura5h: _SEM_LEITURA, leitura10h: _SEM_LEITURA,
  leitura25h: _SEM_LEITURA, leitura50h: _SEM_LEITURA, leitura100h: _SEM_LEITURA,

  /* Sequências longas */
  sequencia60:  'stats.streak só olha os últimos 30 dias (carregarEstatisticas); precisa de janela maior ou de uma "maior sequência" persistida.',
  sequencia100: 'Idem sequencia60.',
  sequencia365: 'Idem sequencia60.',

  /* Desempenho / especiais de nível */
  scoreElite: 'Não existe nível acima de "avançado" em quiz_intelligence.js (FAIXAS_NIVEL) — "avançado" já é o máximo e é usado por scoreAvancado.',
  nexusMaster: 'Não existe sistema de nível/XP da plataforma.',
  consistente: _SEM_LIMIAR, viradaDeJogo: _SEM_LIMIAR, superacao: _SEM_LIMIAR,
  invencivel: _SEM_LIMIAR, estrela: _SEM_LIMIAR,

  /* Quiz — retomada */
  persistente: 'Falta registrar que o quiz foi RETOMADO: quiz_respostas guarda o estado atual (finalizado), não o histórico de retomadas.',

  /* Hábitos */
  pontual:   'Não existe horário de estudo planejado no Nexus para comparar.',
  focoTotal: 'Interrupções/ociosidade não são gravadas por sessão (só o estado em memória em session-tracker.js).',
  constante: _SEM_LIMIAR + ' (stats.historico já tem os dias da semana.)',
  incansavel: 'Pedido diz "vários dias CONSECUTIVOS"; o catálogo antigo dizia "10 dias" sem consecutividade. Definir qual vale e quantos dias (stats.historico já tem tempo por dia).',

  /* Exploração */
  explorador: 'Áreas visitadas não são agregadas entre sessões. Áreas reais (ROTA_LABELS): ver AREAS_PRINCIPAIS_NEXUS.',
  curioso: 'Pesquisas na plataforma não são contadas.',
  investigador: 'Idem curioso.',
  conhecedor: 'Acesso a conteúdos por disciplina não é registrado (só há disciplina nas tentativas de quiz). Definir "várias".',
  multidisciplinar: 'Quantidade de disciplinas não definida no pedido (a disciplina de cada tentativa já existe em tentativas[].disc).',

  /* Já sem regra ANTES desta atualização (não pedidas agora; intactas) */
  sessoes10: 'Pré-existente sem regra (não fazia parte desta lista).',
  sessoes100: 'Pré-existente sem regra (não fazia parte desta lista).',
  organizado: 'Pré-existente sem regra (não fazia parte desta lista).',
  equilibrado: 'Pré-existente sem regra (não fazia parte desta lista).',
};