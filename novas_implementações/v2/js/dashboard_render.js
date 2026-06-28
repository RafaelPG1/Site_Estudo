/* =============================================
   NEXUS STUDY — dashboard\js\dashboard_render.js
    proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar
   Dashboard: renderização dos cards inteligentes
   da Camada 5 (quiz_intelligence).
   =============================================

   ─────────────────────────────────────────────
   ORIGEM
   ─────────────────────────────────────────────
   Extraído de dashboard.js (v5) na reorganização
   da Camada 5 — Fase 1.6 (split de arquivos).
   Nenhuma lógica foi alterada nesta extração:
   apenas movida para este módulo dedicado a
   renderização dos cards inteligentes.

   ─────────────────────────────────────────────
   CAMADA 5 — COORDENADORA DE RENDER (intelligence)
   ─────────────────────────────────────────────
   renderDashboardIntelligence(relatorio) é o único
   ponto que distribui o relatorio para os
   renderizadores da Camada 5.

   REGRAS que esta função obedece:
     ✔ Recebe o relatorio como argumento (sem ler State)
     ✔ Apenas delega — zero lógica própria
     ✔ Não chama Firebase
     ✔ Não chama NexusQuizIntelligence
     ✔ Guard único: se relatorio for null, para aqui

   Ordem de chamada reflete a prioridade visual
   definida na especificação da Camada 5:
     1. Score → 2. Trend → 3. Comparison
     4. Weaknesses → 5. Prediction → 6. LearningCurve
   ─────────────────────────────────────────────

   REGRAS que cada renderizador abaixo obedece:
     ✔ Receber apenas (relatorio) como argumento
     ✔ Ler somente os campos ja existentes no relatorio
       (via State.intelligence ou parâmetro recebido)
     ✔ Nunca chamar Firebase
     ✔ Nunca chamar NexusQuizIntelligence
     ✔ Nunca calcular metricas — apenas exibir
     ✔ Nunca derivar score, tendencia ou previsao
   ============================================= */

/* ══════════════════════════════════════════════
   CAMADA 5 — COORDENADORA DE RENDER (intelligence)
══════════════════════════════════════════════ */
export function renderDashboardIntelligence(relatorio) {
  if (!relatorio) {
    console.log('[dashboard] renderDashboardIntelligence: relatorio ausente — stubs ignorados.');
    return;
  }

  renderScore(relatorio);
  renderTrend(relatorio);
  renderComparison(relatorio);
  renderWeaknesses(relatorio);
  renderPrediction(relatorio);
  renderLearningCurve(relatorio);
}

/* ══════════════════════════════════════════════
   CAMADA 5 — RENDERIZADORES
══════════════════════════════════════════════ */

/* Fase 2.1 — Score evolutivo (0-100) + nivel estimado
   ─────────────────────────────────────────────────────
   Fonte: relatorio.scoreEvolutivo (calculado por quiz_intelligence.js)
   Esta funcao apenas le campos e atualiza o DOM.
   Zero calculos. Zero chamadas externas. */
export function renderScore(relatorio) {
  const score = relatorio?.scoreEvolutivo;

  const elCard        = document.getElementById('score-card');
  const elGeral       = document.getElementById('score-geral');
  const elNivel       = document.getElementById('score-nivel');
  const elTentativas  = document.getElementById('score-tentativas');
  const elDescricao   = document.getElementById('score-descricao');

  /* Sem elemento no DOM: secao ainda nao existe no HTML */
  if (!elCard) return;

  /* Estado vazio: sem dados de inteligencia */
  if (!score || score.scoreGeral === null || score.scoreGeral === undefined) {
    elGeral.textContent      = '—';
    elNivel.textContent      = 'Nível indisponível';
    elTentativas.textContent = 'Nenhuma tentativa analisada ainda';
    elDescricao.textContent  = 'Realize quizzes para gerar seu Score Evolutivo.';
    elCard.className         = 'score-card score-vazio';
    return;
  }

  /* Score geral — numero inteiro, ja calculado pelo quiz_intelligence */
  elGeral.textContent = Math.round(score.scoreGeral);

  /* Nivel estimado — mapeamento de chave para label em portugues */
  const NIVEL_LABEL = {
    'avancado':      'Avançado',
    'proficiente':   'Proficiente',
    'intermediario': 'Intermediário',
    'iniciante':     'Iniciante',
    'fundamentos':   'Fundamentos',
  };
  const nivelChave = score.nivelEstimado ?? 'indeterminado';
  elNivel.textContent = `Nível: ${NIVEL_LABEL[nivelChave] ?? nivelChave}`;

  /* Classe de cor do nivel — controlada por CSS, sem inline style */
  elCard.className = `score-card score-nivel-${nivelChave}`;

  /* Total de tentativas — campo direto */
  const total = score.totalTentativas ?? 0;
  elTentativas.textContent = `${total} tentativa${total !== 1 ? 's' : ''} analisada${total !== 1 ? 's' : ''}`;

  /* Descricao — texto fixo mapeado de composicao.consistencia
     Nenhuma string e derivada de calculo: e apenas um lookup
     sobre o valor de consistencia ja classificado pelo quiz_intelligence */
  const DESCRICAO = {
    'melhorando':    'Sua evolução demonstra crescimento constante.',
    'consistente':   'Sua evolução demonstra boa consistência.',
    'instavel':      'Seu desempenho apresenta variações. Foco na regularidade.',
    'indeterminado': 'Realize mais quizzes para gerar um perfil completo.',
  };
  const consistencia = score.composicao?.consistencia ?? 'indeterminado';
  elDescricao.textContent = DESCRICAO[consistencia] ?? 'Continue praticando para consolidar seu perfil.';
}

/* Fase 2.2 — Tendencia do aluno (melhorando/estavel/piorando)
   ─────────────────────────────────────────────────────────────
   Fonte: relatorio.tendenciaDoAluno (calculado por quiz_intelligence.js
   via _calcularTendencia). Campos disponíveis: direcao, diferencaPct,
   confianca. Esta funcao apenas le esses campos e atualiza o DOM.
   Zero calculos. Zero chamadas externas. */
export function renderTrend(relatorio) {
  const tendencia = relatorio?.tendenciaDoAluno;

  const elCard      = document.getElementById('trend-card');
  const elDirecao   = document.getElementById('trend-direcao');
  const elDiferenca = document.getElementById('trend-diferenca');
  const elConfianca = document.getElementById('trend-confianca');

  /* Sem elemento no DOM: secao ainda nao existe */
  if (!elCard) return;

  /* Estado vazio: sem dados ou direcao indeterminada por falta de tentativas */
  if (!tendencia || tendencia.direcao === 'indeterminado') {
    elCard.className      = 'trend-card trend-indeterminado';
    elDirecao.textContent = '— Indeterminado';
    elDiferenca.textContent = 'Dados insuficientes para calcular tendência.';
    elConfianca.textContent = '';
    return;
  }

  /* Classe de cor do card — controlada por CSS, sem inline style */
  elCard.className = `trend-card trend-${tendencia.direcao}`;

  /* Icone + label da direcao — lookup puro, sem calculo */
  const DIRECAO_ICONE = {
    'melhorando': '↑',
    'estavel':    '→',
    'piorando':   '↓',
  };
  const DIRECAO_LABEL = {
    'melhorando': 'Melhorando',
    'estavel':    'Estável',
    'piorando':   'Piorando',
  };
  const icone = DIRECAO_ICONE[tendencia.direcao] ?? '—';
  const label = DIRECAO_LABEL[tendencia.direcao] ?? tendencia.direcao;
  elDirecao.textContent = `${icone} ${label}`;

  /* Variacao percentual — campo ja calculado pelo quiz_intelligence.
     Apenas formatamos o sinal e a unidade para exibicao. */
  const pct   = tendencia.diferencaPct ?? 0;
  const sinal = pct >= 0 ? '+' : '';
  elDiferenca.textContent = `${sinal}${pct}% em relação ao período anterior`;

  /* Confianca da analise — lookup puro */
  const CONFIANCA_LABEL = {
    'alta':  'Alta confiança',
    'media': 'Confiança média',
    'baixa': 'Baixa confiança',
  };
  elConfianca.textContent = CONFIANCA_LABEL[tendencia.confianca] ?? tendencia.confianca ?? '';
}

/* Fase 2.3 — Comparacao entre periodos (variacao % entre semanas)
   ──────────────────────────────────────────────────────────────────
   Fonte: relatorio.comparacaoDePeriodos (calculado por quiz_intelligence.js
   via compararPeriodos). Campos disponíveis: diasPorPeriodo, periodoAtual,
   periodoAnterior, variacaoPct, direcao.
   Esta funcao apenas le esses campos e atualiza o DOM.
   Zero calculos. Zero chamadas externas. */
export function renderComparison(relatorio) {
  const comp = relatorio?.comparacaoDePeriodos;

  const elCard       = document.getElementById('comparison-card');
  const elAtualTaxa  = document.getElementById('comparison-atual-taxa');
  const elAtualTent  = document.getElementById('comparison-atual-tent');
  const elAntTaxa    = document.getElementById('comparison-ant-taxa');
  const elAntTent    = document.getElementById('comparison-ant-tent');
  const elVariacao   = document.getElementById('comparison-variacao');
  const elDirecao    = document.getElementById('comparison-direcao');

  /* Sem elemento no DOM: secao ainda nao existe */
  if (!elCard) return;

  /* Estado vazio: sem dados ou direcao indeterminada */
  if (!comp || comp.direcao === 'indeterminado' ||
      comp.periodoAtual?.taxaAcertoMediaPct === null) {
    elCard.className     = 'comparison-card comparison-indeterminado';
    elAtualTaxa.textContent  = '—';
    elAtualTent.textContent  = '—';
    elAntTaxa.textContent    = '—';
    elAntTent.textContent    = '—';
    elVariacao.textContent   = '—';
    elDirecao.textContent    = 'Histórico insuficiente para comparar períodos.';
    return;
  }

  /* Classe de cor do card — controlada por CSS, sem inline style */
  elCard.className = `comparison-card comparison-${comp.direcao}`;

  /* Periodo atual — campos ja calculados pelo quiz_intelligence */
  const taxaAtual = comp.periodoAtual?.taxaAcertoMediaPct ?? null;
  elAtualTaxa.textContent = taxaAtual !== null ? `${taxaAtual}%` : '—';

  const tentAtual = comp.periodoAtual?.totalTentativas ?? 0;
  elAtualTent.textContent = `${tentAtual} tentativa${tentAtual !== 1 ? 's' : ''}`;

  /* Periodo anterior — campos ja calculados pelo quiz_intelligence */
  const taxaAnt = comp.periodoAnterior?.taxaAcertoMediaPct ?? null;
  elAntTaxa.textContent = taxaAnt !== null ? `${taxaAnt}%` : '—';

  const tentAnt = comp.periodoAnterior?.totalTentativas ?? 0;
  elAntTent.textContent = `${tentAnt} tentativa${tentAnt !== 1 ? 's' : ''}`;

  /* Variacao — campo ja calculado (variacaoPct = atual.taxa - anterior.taxa)
     Apenas formatamos o sinal para exibicao */
  const variacao = comp.variacaoPct ?? null;
  if (variacao !== null) {
    const sinal = variacao >= 0 ? '+' : '';
    elVariacao.textContent = `${sinal}${variacao}%`;
  } else {
    elVariacao.textContent = '—';
  }

  /* Direcao — lookup puro de string */
  const DIRECAO_LABEL = {
    'melhorando': '↑ Melhorando em relação ao período anterior',
    'estavel':    '→ Desempenho estável entre os períodos',
    'piorando':   '↓ Queda em relação ao período anterior',
  };
  const dias = comp.diasPorPeriodo ?? 7;
  elDirecao.textContent =
    (DIRECAO_LABEL[comp.direcao] ?? comp.direcao) +
    ` · últimos ${dias} dias vs ${dias} anteriores`;
}

/* Fase 2.4 — Fraquezas por disciplina (ranking + badge queda)
   ──────────────────────────────────────────────────────────────
   Fonte: relatorio.fraquezasPorDisciplina (calculado por quiz_intelligence.js)
   A lista chega ordenada da Camada 4 — exibida exatamente na ordem recebida.

   Campos consumidos por item (defensivo — so usa o que existe):
     .disciplina      string  nome/id da disciplina
     .taxaAcertoPct   number  taxa de acerto em % (0-100)
     .tendencia       string  'melhorando' | 'estavel' | 'piorando'
     .emQueda         boolean true se a disciplina está em queda

   Esta funcao apenas le os dados recebidos e atualiza o DOM.
   Zero calculos. Zero reordenacao. Zero chamadas externas. */
export function renderWeaknesses(relatorio) {
  const lista = relatorio?.fraquezasPorDisciplina;

  const elSection = document.getElementById('weaknesses-section');
  const elLista   = document.getElementById('weaknesses-lista');
  const elCount   = document.getElementById('weaknesses-count');

  /* Sem elemento no DOM: secao ainda nao existe no HTML */
  if (!elSection || !elLista) return;

  /* Estado vazio: sem dados ou array vazio */
  if (!lista || !Array.isArray(lista) || lista.length === 0) {
    elSection.className = 'weaknesses-card weaknesses-vazio';
    elLista.innerHTML   = '';
    if (elCount) elCount.textContent = '0';

    const vazio       = document.createElement('div');
    vazio.className   = 'weaknesses-empty';
    vazio.textContent = 'Nenhuma fraqueza identificada ainda. Realize quizzes para gerar análise por disciplina.';
    elLista.appendChild(vazio);
    return;
  }

  /* Card ativo */
  elSection.className = 'weaknesses-card';
  if (elCount) elCount.textContent = lista.length;
  elLista.innerHTML   = '';

  /* Lookup de icone, classe e label por tendencia — apenas exibicao, sem calculo */
  const TENDENCIA_ICONE = {
    'melhorando': '↑',
    'estavel':    '→',
    'piorando':   '↓',
  };
  const TENDENCIA_CLASSE = {
    'melhorando': 'wk-tend-melhorando',
    'estavel':    'wk-tend-estavel',
    'piorando':   'wk-tend-piorando',
  };
  const TENDENCIA_LABEL = {
    'melhorando': 'Melhorando',
    'estavel':    'Estável',
    'piorando':   'Piorando',
  };

  /* Renderiza cada disciplina na ordem exata recebida da Camada 4.
     Sem .sort(). Sem reordenacao. */
  lista.forEach((item, idx) => {
    const disc      = item?.disciplina    ?? '—';
    const taxa      = item?.taxaAcertoPct ?? null;
    const tendencia = item?.tendencia     ?? null;
    const emQueda   = item?.emQueda       === true;

    const row       = document.createElement('div');
    row.className   = 'wk-item';
    if (emQueda) row.classList.add('wk-item-queda');

    /* ── Posicao no ranking ── */
    const pos         = document.createElement('div');
    pos.className     = 'wk-pos';
    pos.textContent   = idx + 1;

    /* ── Corpo: nome + badge + barra ── */
    const corpo       = document.createElement('div');
    corpo.className   = 'wk-corpo';

    const nomeWrap    = document.createElement('div');
    nomeWrap.className = 'wk-nome-wrap';

    const nome        = document.createElement('span');
    nome.className    = 'wk-nome';
    nome.textContent  = disc;
    nomeWrap.appendChild(nome);

    if (emQueda) {
      const badge       = document.createElement('span');
      badge.className   = 'wk-badge-queda';
      badge.textContent = '↓ Em queda';
      nomeWrap.appendChild(badge);
    }

    /* Barra de progresso — largura = taxa recebida, sem calculo */
    const barWrap     = document.createElement('div');
    barWrap.className = 'wk-bar-wrap';

    const barBg       = document.createElement('div');
    barBg.className   = 'wk-bar-bg';

    const barFill     = document.createElement('div');
    barFill.className = 'wk-bar-fill';

    /* Sanitizacao de limite para style.width — nao e calculo de metrica */
    const largura = taxa !== null ? Math.max(0, Math.min(100, taxa)) : 0;
    barFill.style.width = largura + '%';

    /* Classe de cor da barra por faixa — apenas CSS, sem nova metrica */
    if (taxa !== null) {
      if (taxa >= 70)      barFill.classList.add('wk-bar-ok');
      else if (taxa >= 40) barFill.classList.add('wk-bar-medio');
      else                 barFill.classList.add('wk-bar-baixo');
    }

    barBg.appendChild(barFill);
    barWrap.appendChild(barBg);

    corpo.appendChild(nomeWrap);
    corpo.appendChild(barWrap);

    /* ── Coluna direita: taxa + tendencia ── */
    const meta        = document.createElement('div');
    meta.className    = 'wk-meta';

    const taxaEl      = document.createElement('div');
    taxaEl.className  = 'wk-taxa';
    taxaEl.textContent = taxa !== null ? `${taxa}%` : '—';

    const tendEl      = document.createElement('div');
    tendEl.className  = [
      'wk-tendencia',
      tendencia ? (TENDENCIA_CLASSE[tendencia] ?? '') : '',
    ].join(' ').trim();

    const icone = tendencia ? (TENDENCIA_ICONE[tendencia] ?? '') : '';
    const label = tendencia ? (TENDENCIA_LABEL[tendencia] ?? tendencia) : '—';
    tendEl.textContent = icone ? `${icone} ${label}` : label;

    meta.appendChild(taxaEl);
    meta.appendChild(tendEl);

    row.appendChild(pos);
    row.appendChild(corpo);
    row.appendChild(meta);
    elLista.appendChild(row);
  });
}

/* Fase 2.5 — Previsao simples de desempenho */
export function renderPrediction(relatorio) {
  /* stub — sera preenchido na Fase 2.5 */
  /* fonte: relatorio.previsaoSimples */
}

/* Fase 2.6 — Curva de aprendizado (serie temporal + media movel) */
export function renderLearningCurve(relatorio) {
  /* stub — sera preenchido na Fase 2.6 */
  /* fonte: relatorio.curvaDeAprendizado */
}