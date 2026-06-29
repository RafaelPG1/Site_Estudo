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
   apenas os blocos exclusivos dos cards inteligentes
   (Score, Tendência, Comparação, Fraquezas) foram
   movidos para este módulo.

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
     7. Timeline → 8. Achievements
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
    console.log('[dashboard] renderDashboardIntelligence: relatorio ausente — renderizando estado vazio.');
  }

  renderScore(relatorio);
  renderTrend(relatorio);
  renderComparison(relatorio);
  renderWeaknesses(relatorio);
  renderPrediction(relatorio);
  renderLearningCurve(relatorio);
  renderTimeline(relatorio);
  renderAchievements(relatorio);
}

/* ══════════════════════════════════════════════
   CAMADA 5 — RENDERIZADORES
══════════════════════════════════════════════ */

/* Fase 2.1 — Score evolutivo (0-100) + nivel estimado */
export function renderScore(relatorio) {
  const score = relatorio?.scoreEvolutivo;

  const elCard        = document.getElementById('score-card');
  const elGeral       = document.getElementById('score-geral');
  const elNivel       = document.getElementById('score-nivel');
  const elTentativas  = document.getElementById('score-tentativas');
  const elDescricao   = document.getElementById('score-descricao');

  if (!elCard) return;

  if (!score || score.scoreGeral === null || score.scoreGeral === undefined) {
    elGeral.textContent      = '—';
    elNivel.textContent      = 'Nível indisponível';
    elTentativas.textContent = 'Nenhuma tentativa analisada ainda';
    elDescricao.textContent  = 'Realize quizzes para gerar seu Score Evolutivo.';
    elCard.className         = 'score-card score-vazio';
    return;
  }

  elGeral.textContent = Math.round(score.scoreGeral);

  const NIVEL_LABEL = {
    'avancado':      'Avançado',
    'proficiente':   'Proficiente',
    'intermediario': 'Intermediário',
    'iniciante':     'Iniciante',
    'fundamentos':   'Fundamentos',
  };
  const nivelChave = score.nivelEstimado ?? 'indeterminado';
  elNivel.textContent = `Nível: ${NIVEL_LABEL[nivelChave] ?? nivelChave}`;

  elCard.className = `score-card score-nivel-${nivelChave}`;

  const total = score.totalTentativas ?? 0;
  elTentativas.textContent = `${total} tentativa${total !== 1 ? 's' : ''} analisada${total !== 1 ? 's' : ''}`;

  const DESCRICAO = {
    'melhorando':    'Sua evolução demonstra crescimento constante.',
    'consistente':   'Sua evolução demonstra boa consistência.',
    'instavel':      'Seu desempenho apresenta variações. Foco na regularidade.',
    'indeterminado': 'Realize mais quizzes para gerar um perfil completo.',
  };
  const consistencia = score.composicao?.consistencia ?? 'indeterminado';
  elDescricao.textContent = DESCRICAO[consistencia] ?? 'Continue praticando para consolidar seu perfil.';
}

/* Fase 2.2 — Tendencia do aluno */
export function renderTrend(relatorio) {
  const tendencia = relatorio?.tendenciaDoAluno;

  const elCard      = document.getElementById('trend-card');
  const elDirecao   = document.getElementById('trend-direcao');
  const elDiferenca = document.getElementById('trend-diferenca');
  const elConfianca = document.getElementById('trend-confianca');

  if (!elCard) return;

  if (!tendencia || tendencia.direcao === 'indeterminado') {
    elCard.className      = 'trend-card trend-indeterminado';
    elDirecao.textContent = '— Indeterminado';
    elDiferenca.textContent = 'Dados insuficientes para calcular tendência.';
    elConfianca.textContent = '';
    return;
  }

  elCard.className = `trend-card trend-${tendencia.direcao}`;

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

  const pct   = tendencia.diferencaPct ?? 0;
  const sinal = pct >= 0 ? '+' : '';
  elDiferenca.textContent = `${sinal}${pct}% em relação ao período anterior`;

  const CONFIANCA_LABEL = {
    'alta':  'Alta confiança',
    'media': 'Confiança média',
    'baixa': 'Baixa confiança',
  };
  elConfianca.textContent = CONFIANCA_LABEL[tendencia.confianca] ?? tendencia.confianca ?? '';
}

/* Fase 2.3 — Comparacao entre periodos */
export function renderComparison(relatorio) {
  const comp = relatorio?.comparacaoDePeriodos;

  const elCard       = document.getElementById('comparison-card');
  const elAtualTaxa  = document.getElementById('comparison-atual-taxa');
  const elAtualTent  = document.getElementById('comparison-atual-tent');
  const elAntTaxa    = document.getElementById('comparison-ant-taxa');
  const elAntTent    = document.getElementById('comparison-ant-tent');
  const elVariacao   = document.getElementById('comparison-variacao');
  const elDirecao    = document.getElementById('comparison-direcao');

  if (!elCard) return;

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

  elCard.className = `comparison-card comparison-${comp.direcao}`;

  const taxaAtual = comp.periodoAtual?.taxaAcertoMediaPct ?? null;
  elAtualTaxa.textContent = taxaAtual !== null ? `${taxaAtual}%` : '—';

  const tentAtual = comp.periodoAtual?.totalTentativas ?? 0;
  elAtualTent.textContent = `${tentAtual} tentativa${tentAtual !== 1 ? 's' : ''}`;

  const taxaAnt = comp.periodoAnterior?.taxaAcertoMediaPct ?? null;
  elAntTaxa.textContent = taxaAnt !== null ? `${taxaAnt}%` : '—';

  const tentAnt = comp.periodoAnterior?.totalTentativas ?? 0;
  elAntTent.textContent = `${tentAnt} tentativa${tentAnt !== 1 ? 's' : ''}`;

  const variacao = comp.variacaoPct ?? null;
  if (variacao !== null) {
    const sinal = variacao >= 0 ? '+' : '';
    elVariacao.textContent = `${sinal}${variacao}%`;
  } else {
    elVariacao.textContent = '—';
  }

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

/* Fase 2.4 — Fraquezas por disciplina */
export function renderWeaknesses(relatorio) {
    const lista = relatorio?.fraquezasPorDisciplina;

  const elSection = document.getElementById('weaknesses-section');
  const elLista   = document.getElementById('weaknesses-lista');
  const elCount   = document.getElementById('weaknesses-count');

  if (!elSection || !elLista) return;

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

  elSection.className = 'weaknesses-card';
  if (elCount) elCount.textContent = lista.length;
  elLista.innerHTML   = '';

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

  lista.forEach((item, idx) => {
    const disc      = item?.disciplina        ?? '—';
    const taxa      = item?.taxaAcertoMediaPct ?? null;
    const tendencia = item?.inclinacaoPctPorTentativa != null
      ? (item.inclinacaoPctPorTentativa > 0.5 ? 'melhorando'
        : item.inclinacaoPctPorTentativa < -0.5 ? 'piorando'
        : 'estavel')
      : null;
    const emQueda   = item?.emQueda === true;

    const row       = document.createElement('div');
    row.className   = 'wk-item';
    if (emQueda) row.classList.add('wk-item-queda');

    const pos         = document.createElement('div');
    pos.className     = 'wk-pos';
    pos.textContent   = idx + 1;

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

    const barWrap     = document.createElement('div');
    barWrap.className = 'wk-bar-wrap';

    const barBg       = document.createElement('div');
    barBg.className   = 'wk-bar-bg';

    const barFill     = document.createElement('div');
    barFill.className = 'wk-bar-fill';

    const largura = taxa !== null ? Math.max(0, Math.min(100, taxa)) : 0;
    barFill.style.width = largura + '%';

    if (taxa !== null) {
      if (taxa >= 70)      barFill.classList.add('wk-bar-ok');
      else if (taxa >= 40) barFill.classList.add('wk-bar-medio');
      else                 barFill.classList.add('wk-bar-baixo');
    }

    barBg.appendChild(barFill);
    barWrap.appendChild(barBg);

    corpo.appendChild(nomeWrap);
    corpo.appendChild(barWrap);

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

/* Fase 2.5 — Previsao simples */
export function renderPrediction(relatorio) {
  const previsao = relatorio?.previsaoSimples;

  const elCard      = document.getElementById('prediction-card');
  const elNumero    = document.getElementById('prediction-numero');
  const elDirecao   = document.getElementById('prediction-direcao');
  const elAmostras  = document.getElementById('prediction-amostras');
  const elDescricao = document.getElementById('prediction-descricao');

  if (!elCard) return;

  if (!previsao || previsao.previsaoTaxaAcertoPct === null || previsao.previsaoTaxaAcertoPct === undefined) {
    elCard.className        = 'prediction-card prediction-vazio';
    elNumero.textContent    = '—';
    elDirecao.textContent   = 'Indeterminado';
    elAmostras.textContent  = previsao?.amostras
      ? `${previsao.amostras} amostra${previsao.amostras !== 1 ? 's' : ''} analisada${previsao.amostras !== 1 ? 's' : ''}`
      : 'Nenhuma amostra analisada ainda';
    elDescricao.textContent = previsao?.motivo === 'dados_insuficientes'
      ? 'Dados insuficientes para gerar uma previsão. Realize mais quizzes.'
      : 'Realize quizzes para gerar sua previsão de desempenho.';
    return;
  }

  elNumero.textContent = `${previsao.previsaoTaxaAcertoPct}%`;

  const DIRECAO_ICONE = {
    'melhora': '↑',
    'estavel': '→',
    'queda':   '↓',
  };
  const DIRECAO_LABEL = {
    'melhora': 'Melhora esperada',
    'estavel': 'Estabilidade esperada',
    'queda':   'Queda esperada',
  };
  const direcaoChave = previsao.direcaoEsperada ?? 'indeterminado';
  const icone = DIRECAO_ICONE[direcaoChave] ?? '—';
  const label = DIRECAO_LABEL[direcaoChave] ?? direcaoChave;
  elDirecao.textContent = `${icone} ${label}`;

  elCard.className = `prediction-card prediction-${direcaoChave}`;

  const amostras = previsao.amostras ?? 0;
  elAmostras.textContent = `${amostras} amostra${amostras !== 1 ? 's' : ''} analisada${amostras !== 1 ? 's' : ''}`;

  const CONFIANCA_LABEL = {
    'alta':  'Alta confiança',
    'media': 'Confiança média',
    'média': 'Confiança média',
    'baixa': 'Baixa confiança',
  };
  const confiancaLabel = CONFIANCA_LABEL[previsao.confianca] ?? previsao.confianca ?? '';
  elDescricao.textContent = confiancaLabel
    ? `Estimativa via regressão linear · ${confiancaLabel}`
    : 'Estimativa via regressão linear.';
}

/* Fase 2.6 — Curva de aprendizado */
export function renderLearningCurve(relatorio) {
  const curva = relatorio?.curvaDeAprendizado?.geral;

  const elCard       = document.getElementById('curve-card');
  const elTendencia  = document.getElementById('curve-tendencia');
  const elAmostras   = document.getElementById('curve-amostras');
  const elChartWrap  = document.getElementById('curve-chart-wrap');

  if (!elCard) return;

  const serie = curva?.serieTaxaAcertoPct;
  if (!curva || !Array.isArray(serie) || serie.length < 2) {
    elCard.className       = 'curve-card curve-vazio';
    elTendencia.textContent = 'Indeterminado';
    elAmostras.textContent  = curva?.totalTentativas
      ? `${curva.totalTentativas} tentativa${curva.totalTentativas !== 1 ? 's' : ''} analisada${curva.totalTentativas !== 1 ? 's' : ''}`
      : 'Nenhuma tentativa analisada ainda';
    if (elChartWrap) {
      elChartWrap.innerHTML = '';
      const vazio       = document.createElement('div');
      vazio.className   = 'curve-empty';
      vazio.textContent = 'Realize mais quizzes para gerar sua curva de aprendizado.';
      elChartWrap.appendChild(vazio);
    }
    return;
  }

  const tendencia = curva.tendencia ?? { direcao: 'indeterminado', inclinacaoPctPorTentativa: null };

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
  const direcaoChave = tendencia.direcao ?? 'indeterminado';
  const icone = DIRECAO_ICONE[direcaoChave] ?? '—';
  const label = DIRECAO_LABEL[direcaoChave] ?? direcaoChave;
  elTendencia.textContent = `${icone} ${label}`;

  elCard.className = `curve-card curve-${direcaoChave}`;

  const total = curva.totalTentativas ?? serie.length;
  elAmostras.textContent = `${total} tentativa${total !== 1 ? 's' : ''} analisada${total !== 1 ? 's' : ''}`;

  if (elChartWrap) {
    elChartWrap.innerHTML = '';

    const movel = Array.isArray(curva.mediaMovelPct) ? curva.mediaMovelPct : [];
    const W = 560, H = 140, PAD = 8;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'curve-svg');
    svg.setAttribute('preserveAspectRatio', 'none');

    function _pontos(valores) {
      return valores.map((v, i) => {
        const x = valores.length > 1
          ? Math.round((i / (valores.length - 1)) * (W - PAD * 2)) + PAD
          : PAD;
        const vClamped = Math.max(0, Math.min(100, v));
        const y = Math.round(H - PAD - (vClamped / 100) * (H - PAD * 2));
        return `${x},${y}`;
      }).join(' ');
    }

    const linhaReal = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    linhaReal.setAttribute('points', _pontos(serie));
    linhaReal.setAttribute('class', 'curve-line-real');
    svg.appendChild(linhaReal);

    if (movel.length === serie.length && movel.length > 0) {
      const linhaMovel = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      linhaMovel.setAttribute('points', _pontos(movel));
      linhaMovel.setAttribute('class', 'curve-line-movel');
      svg.appendChild(linhaMovel);
    }

    elChartWrap.appendChild(svg);
  }
}

/* ══════════════════════════════════════════════
   FASE 3 — Timeline (Atividade Recente)
   ─────────────────────────────────────────────
   Fonte: relatorio.tentativasRecentes
   (populado em _carregarIntelligence via
   listarTentativasRecentes())

   Campos consumidos por item:
     .disc          string
     .modo          string
     .acertos       number
     .totalQuestoes number
     .taxaAcerto    number  (0–1)
     .endedAt       number  (timestamp)

   Zero cálculos. Zero Firebase. Zero quiz_intelligence.
   Apenas lookup de formatação e atualização de DOM.
══════════════════════════════════════════════ */
export function renderTimeline(relatorio) {
  const tentativas = relatorio?.tentativasRecentes;

  const elTimeline = document.getElementById('activity-timeline');
  if (!elTimeline) return;

  elTimeline.innerHTML = '';

  if (!tentativas || !Array.isArray(tentativas) || tentativas.length === 0) {
    const vazio = document.createElement('div');
    vazio.className   = 'tl-empty';
    vazio.textContent = 'Nenhum quiz registrado ainda. Complete quizzes para ver sua atividade recente.';
    elTimeline.appendChild(vazio);
    return;
  }

  tentativas.forEach(t => {
    const taxa  = typeof t.taxaAcerto === 'number' ? Math.round(t.taxaAcerto * 100) : 0;
    const label = [t.disc, t.modo].filter(Boolean).join(' · ') || 'Quiz';

    /* Cor do dot baseada na taxa — lookup CSS, sem cálculo */
    let corDot, corIcone;
    if (taxa >= 75)      { corDot = 'rgba(61,220,132,.12)';  corIcone = '#3DDC84'; }
    else if (taxa >= 50) { corDot = 'rgba(255,181,71,.12)';  corIcone = '#FFB547'; }
    else                 { corDot = 'rgba(255,92,106,.12)';   corIcone = '#FF5C6A'; }

    const tempoFormatado = _formatarTempoRelativo(t.endedAt);

    const item = document.createElement('div');
    item.className = 'tl-item';

    item.innerHTML = `
      <div class="tl-dot" style="background:${corDot}">
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="${corIcone}" stroke-width="1.5">
          <circle cx="7" cy="7" r="5.5"/>
          <path d="M5 7c0-1.1.9-2 2-2s2 .9 2 2-.9 1.5-2 1.5v1"/>
          <circle cx="7" cy="11" r=".5" fill="${corIcone}"/>
        </svg>
      </div>
      <div class="tl-body">
        <div class="tl-title">Quiz finalizado</div>
        <div class="tl-desc">${_escapeHtml(label)} · <strong style="color:${corIcone}">${t.acertos ?? 0}/${t.totalQuestoes ?? 0} (${taxa}%)</strong></div>
        <div class="tl-time">
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="5" cy="5" r="4.5"/>
            <path d="M5 2.5V5l1.5 1.5"/>
          </svg>
          ${_escapeHtml(tempoFormatado)}
        </div>
      </div>
    `;

    elTimeline.appendChild(item);
  });
}

/* Formata timestamp como texto relativo — apenas formatação, sem cálculo de métrica */
function _formatarTempoRelativo(ts) {
  if (!ts) return '—';
  const diff    = Date.now() - ts;
  const minutos = Math.floor(diff / 60000);
  const horas   = Math.floor(diff / 3600000);
  const dias    = Math.floor(diff / 86400000);

  if (minutos < 1)       return 'agora mesmo';
  if (minutos < 60)      return `há ${minutos}min`;
  if (horas < 24)        return `há ${horas}h`;
  if (dias === 1)        return 'ontem';
  if (dias < 7)          return `há ${dias} dias`;
  return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function _escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/* ══════════════════════════════════════════════
   FASE 3 — Conquistas
   ─────────────────────────────────────────────
   Fonte: relatorio.conquistas
   (objeto calculado em _carregarIntelligence e
   armazenado em State.intelligence)

   Estrutura esperada de relatorio.conquistas:
     {
       sequencia7:       boolean,
       sequencia30:      boolean,
       tentativas100:    boolean,
       questoesMil:      boolean,
       scoreAvancado:    boolean,
       emEvolucao:       boolean,
       miraAfiada:       boolean,
       maratonista:      boolean,
       semQuedas:        boolean,
       sessoes50:        boolean,
     }

   Zero cálculos. Zero Firebase. Zero quiz_intelligence.
   Apenas lookup de estado e atualização de DOM.
══════════════════════════════════════════════ */

/* Catálogo de conquistas — definição estática, sem lógica */
const CONQUISTAS_CATALOGO = [
  {
    id:      'sequencia7',
    emoji:   '🔥',
    nome:    'Sequência de 7 dias',
    desc:    'Estudou por 7 dias consecutivos',
    tag:     'Prata',
    tagCls:  'tag-silver',
    corBg:   'rgba(168,163,255,.12)',
  },
  {
    id:      'sequencia30',
    emoji:   '🔥',
    nome:    'Sequência de 30 dias',
    desc:    'Estudou por 30 dias consecutivos',
    tag:     'Ouro',
    tagCls:  'tag-gold',
    corBg:   'rgba(255,181,71,.12)',
  },
  {
    id:      'tentativas100',
    emoji:   '📝',
    nome:    '100 Tentativas',
    desc:    'Completou 100 quizzes na plataforma',
    tag:     'Prata',
    tagCls:  'tag-silver',
    corBg:   'rgba(79,168,232,.12)',
  },
  {
    id:      'questoesMil',
    emoji:   '⚡',
    nome:    'Mil Questões',
    desc:    'Respondeu mais de 1.000 questões na plataforma',
    tag:     'Ouro',
    tagCls:  'tag-gold',
    corBg:   'rgba(61,220,132,.1)',
  },
  {
    id:      'scoreAvancado',
    emoji:   '🎯',
    nome:    'Score Avançado',
    desc:    'Atingiu nível Avançado no Score Evolutivo',
    tag:     'Ouro',
    tagCls:  'tag-gold',
    corBg:   'rgba(255,181,71,.12)',
  },
  {
    id:      'emEvolucao',
    emoji:   '📈',
    nome:    'Em Evolução',
    desc:    'Tendência de melhora detectada pelo sistema',
    tag:     'Prata',
    tagCls:  'tag-silver',
    corBg:   'rgba(61,220,132,.1)',
  },
  {
    id:      'miraAfiada',
    emoji:   '🎯',
    nome:    'Mira Afiada',
    desc:    'Mais de 75% de acertos na média geral',
    tag:     'Ouro',
    tagCls:  'tag-gold',
    corBg:   'rgba(255,181,71,.12)',
  },
  {
    id:      'maratonista',
    emoji:   '🏅',
    nome:    'Maratonista',
    desc:    'Mais de 5 horas de estudo em um único dia',
    tag:     'Ouro',
    tagCls:  'tag-gold',
    corBg:   'rgba(108,99,255,.15)',
  },
  {
    id:      'semQuedas',
    emoji:   '✅',
    nome:    'Sem Quedas',
    desc:    'Sem disciplinas em queda detectadas',
    tag:     'Prata',
    tagCls:  'tag-silver',
    corBg:   'rgba(61,220,132,.1)',
  },
  {
    id:      'sessoes50',
    emoji:   '🏆',
    nome:    '50 Sessões',
    desc:    'Realizou 50 sessões de estudo',
    tag:     'Ouro',
    tagCls:  'tag-gold',
    corBg:   'rgba(255,181,71,.12)',
  },
];

export function renderAchievements(relatorio) {
  const conquistas = relatorio?.conquistas;

  const elLista = document.getElementById('ach-list');
  if (!elLista) return;

  elLista.innerHTML = '';

  /* Se não há dados ainda, renderiza tudo como bloqueado */
  const dados = conquistas ?? {};

  CONQUISTAS_CATALOGO.forEach(c => {
    const desbloqueada = dados[c.id] === true;

    const item          = document.createElement('div');
    item.className      = `ach-item${desbloqueada ? '' : ' locked'}`;

    const badgeBg = desbloqueada ? c.corBg : 'var(--border)';

    item.innerHTML = `
      <div class="ach-badge" style="background:${badgeBg}">${c.emoji}</div>
      <div class="ach-body">
        <div class="ach-name">${_escapeHtml(c.nome)}</div>
        <div class="ach-desc">${_escapeHtml(c.desc)}</div>
        <span class="ach-tag ${desbloqueada ? c.tagCls : 'tag-locked'}">${desbloqueada ? c.tag : 'Bloqueado'}</span>
      </div>
    `;

    elLista.appendChild(item);
  });
}