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

   ─────────────────────────────────────────────
   AJUSTE — REDESIGN VISUAL DOS CARDS (Score / Tendência / Previsão)
   ─────────────────────────────────────────────
   Apenas apresentação foi alterada. Nenhum cálculo,
   nenhuma chamada a Firebase ou quiz_intelligence foi
   adicionada. O único acréscimo funcional é a leitura
   de uma custom property CSS (--score-pct) para animar
   o anel de progresso do Score Evolutivo — puramente
   visual, sem afetar o valor exibido nem a lógica.

   ─────────────────────────────────────────────
   AJUSTE — FRAQUEZAS POR DISCIPLINA: TODAS AS DISCIPLINAS
   ─────────────────────────────────────────────
   renderWeaknesses agora cruza relatorio.fraquezasPorDisciplina
   (vindo do quiz_intelligence, somente disciplinas com dados)
   com State.disciplinas (todas as disciplinas do semestre
   selecionado, já existente em dashboard_data.js). Disciplinas
   sem tentativas aparecem com 0% e "Sem dados", sem tendência
   e sem badge de queda. Nenhum cálculo de taxa, tendência ou
   queda foi alterado — apenas a montagem da lista exibida.
   O match entre os dois lados usa o identificador oficial da
   disciplina (disc.id), pois é o mesmo valor propagado desde
   a URL do quiz (window.__NEXUS_QUIZ_DISC__) até t.disc /
   item.disciplina em quiz_intelligence.js — não há mais
   dependência do nome de exibição (disc.nome) para o match.

   ─────────────────────────────────────────────
   AJUSTE — TENDÊNCIA POR DISCIPLINA (texto correto por item)
   ─────────────────────────────────────────────
   O rótulo textual de tendência de cada disciplina (Melhorando /
   Estável / Piorando) agora é lido diretamente de
   item.tendencia.direcao, campo já calculado por
   quiz_intelligence.js (fraquezasPorDisciplina) via
   _calcularTendencia — a MESMA função usada pelo card
   "Tendência do Aluno". Nenhuma lógica de tendência foi
   recalculada aqui: apenas exibida. `emQueda` e a barra de
   progresso continuam vindos de inclinacaoPctPorTentativa
   (regressão linear), inalterados. Ícones/setas foram
   removidos do rótulo — exibe-se apenas o texto.
   ============================================= */

import { State } from './dashboard_data.js';

/* ══════════════════════════════════════════════
   CAMADA 5 — COORDENADORA DE RENDER (intelligence)
══════════════════════════════════════════════ */

export function renderDashboardIntelligence(relatorio) {
  if (!relatorio) {
    console.log('[dashboard] renderDashboardIntelligence: relatorio ausente — renderizando estado vazio.');
  }

  renderScore(relatorio);
  renderTrend(relatorio);
  renderWeaknesses(relatorio);
  renderPrediction(relatorio);
  renderTimeline(relatorio);
  renderAchievements(relatorio);

}


/* ══════════════════════════════════════════════
   CAMADA 5 — RENDERIZADORES
══════════════════════════════════════════════ */

/* Fase 2.1 — Score evolutivo (0-100) + nivel estimado */

export function renderScore(relatorio) {
  const score = relatorio?.scoreEvolutivo;

  const elCard       = document.getElementById('score-card');
  const elGeral      = document.getElementById('score-geral');
  const elNivel      = document.getElementById('score-nivel');
  const elRingIcon   = document.getElementById('score-ring-icon');
  const elHeadline   = document.getElementById('score-headline');
  const elDescricao  = document.getElementById('score-descricao');
  const elChipText   = document.getElementById('score-chip-text');
  const elTentativas = document.getElementById('score-tentativas');
  const elQuestoes   = document.getElementById('score-questoes');

  if (!elCard) return;

  /* Ícone do anel — igual nos dois estados, apenas fica mais
     discreto via CSS quando há Score calculado. */
  if (elRingIcon && !elRingIcon.innerHTML) {
    elRingIcon.innerHTML = `
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="1.5"
           stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M8 12h4l2-4"/>
        <circle cx="12" cy="16" r=".5" fill="currentColor"/>
      </svg>`;
  }

  if (!score || score.scoreGeral === null || score.scoreGeral === undefined) {
    elCard.className = 'score-card score-vazio';

    elGeral.textContent = '0';

    elNivel.innerHTML = `<span class="score-nivel-text">Sem dados</span>`;

    if (elHeadline)  elHeadline.textContent  = 'Seu score está começando!';
    if (elDescricao) elDescricao.textContent = 'Complete quizzes para acumular pontos e acompanhar sua evolução.';
    if (elChipText)  elChipText.textContent  = 'Mínimo de 2 tentativas para gerar seu score.';
    if (elTentativas) elTentativas.textContent = '0';
    if (elQuestoes)   elQuestoes.textContent   = '0';

    const ringElVazio = elCard.querySelector('.score-ring');
    if (ringElVazio) ringElVazio.style.setProperty('--score-pct', '0%');

    const labelVazio = elCard.querySelector('.score-ring-label');
    if (labelVazio) labelVazio.textContent = '/ 100';

    return;
  }

  const scoreArredondado = Math.round(score.scoreGeral);
  elGeral.textContent = scoreArredondado;

  /* Atualiza o anel de progresso (puramente visual — não afeta o
     valor exibido nem nenhum cálculo). Usa requestAnimationFrame
     para garantir que a transição CSS seja percebida ao trocar
     de 0% para o valor real na primeira renderização. */
  const ringEl = elCard.querySelector('.score-ring');
  if (ringEl) {
    requestAnimationFrame(() => {
      ringEl.style.setProperty('--score-pct', `${scoreArredondado}%`);
    });
  }

  const NIVEL_LABEL = {
    'avancado':      'Avançado',
    'proficiente':   'Proficiente',
    'intermediario': 'Intermediário',
    'iniciante':     'Iniciante',
    'fundamentos':   'Fundamentos',
  };
  const nivelChave = score.nivelEstimado ?? 'indeterminado';
  elNivel.innerHTML = `<span class="score-nivel-text">Nível: ${NIVEL_LABEL[nivelChave] ?? nivelChave}</span>`;
  elCard.className = `score-card score-nivel-${nivelChave}`;

  if (elHeadline) elHeadline.textContent = `Nível ${NIVEL_LABEL[nivelChave] ?? nivelChave}`;

  const DESCRICAO = {
    'melhorando':    'Sua evolução demonstra crescimento constante.',
    'consistente':   'Sua evolução demonstra boa consistência.',
    'instavel':      'Seu desempenho apresenta variações. Foco na regularidade.',
    'indeterminado': 'Realize mais quizzes para gerar um perfil completo.',
  };
  const consistencia = score.composicao?.consistencia ?? 'indeterminado';
  if (elDescricao) elDescricao.textContent = DESCRICAO[consistencia] ?? 'Continue praticando para consolidar seu perfil.';

  const total = score.totalTentativas ?? 0;
  if (elTentativas) elTentativas.textContent = total;
  if (elChipText)   elChipText.textContent   = `${total} tentativa${total !== 1 ? 's' : ''} analisada${total !== 1 ? 's' : ''}`;

  const totalQuestoes = relatorio?.totalQuestoes ?? 0;
  if (elQuestoes) elQuestoes.textContent = totalQuestoes;
}

/* Fase 2.2 — Tendencia do aluno */

export function renderTrend(relatorio) {
   const tendencia = relatorio?.tendenciaDoAluno;
 
   const elCard        = document.getElementById('trend-card');
   const elDirecao      = document.getElementById('trend-direcao');
   const elDiferenca      = document.getElementById('trend-diferenca');
   const elConfianca        = document.getElementById('trend-confianca');
   const elChartBadge          = document.getElementById('trend-chart-badge');
  const elBadge                 = document.getElementById('trend-badge');
 
   if (!elCard) return;
 
   if (!tendencia || tendencia.direcao === 'indeterminado') {
     elCard.className = 'trend-card trend-indeterminado';
 
     elDirecao.textContent = 'Ainda sem dados suficientes';
 
     elDiferenca.innerHTML = `
       <span class="empty-state-msg">
         A tendência será calculada automaticamente
         quando houver mais tentativas registradas.
         <br><span class="empty-state-hint">São necessárias pelo menos 2 tentativas.</span>
       </span>`;
 
     elConfianca.textContent = '';
     if (elChartBadge) elChartBadge.textContent = '—';
    if (elBadge) {
      elBadge.className   = 'intel-badge trend-badge-vazio';
      elBadge.textContent = 'Sem dados';
    }
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

  if (elBadge) {
    elBadge.className   = 'intel-badge trend-header-badge';
    elBadge.textContent = label;
  }
 
   const pct   = tendencia.diferencaPct ?? 0;
  const sinal = pct >= 0 ? '+' : '';
  elDiferenca.textContent = `${sinal}${pct}% em relação ao seu desempenho recente`;

  if (elChartBadge) elChartBadge.textContent = `${sinal}${pct}%`;
}


/* Fase 2.4 — Fraquezas por disciplina
   ─────────────────────────────────────────────
   Sempre exibe TODAS as disciplinas do semestre
   selecionado (State.disciplinas), cruzando com os dados
   reais vindos de relatorio.fraquezasPorDisciplina.
   Disciplinas sem tentativas aparecem com 0% e "Sem dados".

   AJUSTE — equilíbrio visual com o card "Perfil de uso":
   o card ganhou 3 zonas (chips de resumo → lista → insight).
   Nenhum cálculo novo foi introduzido — chips e insight
   apenas agrupam/selecionam campos já presentes em `lista`,
   a mesma lista já usada para renderizar as linhas. */
export function renderWeaknesses(relatorio) {
  const dadosReaisLista = relatorio?.fraquezasPorDisciplina;

  const elSection  = document.getElementById('weaknesses-section');
  const elLista    = document.getElementById('weaknesses-lista');
  const elCount    = document.getElementById('weaknesses-count');
  const elStatsRow = document.getElementById('wk-stats-row');
  const elInsight  = document.getElementById('wk-insight');

  if (!elSection || !elLista) return;

  /* Normaliza string para comparação: minúsculas, sem acentos, sem espaços extras. */
  function _norm(s) {
    return String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  /* Mapa de dados reais indexado pelo identificador oficial normalizado.
     item.disciplina vem de t.disc, que é o mesmo valor de disc.id
     propagado desde window.__NEXUS_QUIZ_DISC__ (ver template_init.js). */
  const mapaReais = new Map();
  if (Array.isArray(dadosReaisLista)) {
    dadosReaisLista.forEach(item => {
      if (item?.disciplina) mapaReais.set(_norm(item.disciplina), item);
    });
  }

  /* Lista base: todas as disciplinas do semestre atualmente selecionado */
  const discsSemestre = State.disciplinas ?? [];

  if (discsSemestre.length === 0) {
    /* Sem disciplinas configuradas no semestre — não há o que listar */
    elSection.className = 'weaknesses-card weaknesses-vazio';
    if (elCount) elCount.textContent = '';
    if (elStatsRow) elStatsRow.innerHTML = '';
    if (elInsight) elInsight.textContent = 'Nenhuma disciplina configurada para este semestre.';
    elLista.innerHTML = `
      <div class="empty-state-block">
        <div class="empty-state-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.5"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20V10"/>
            <path d="M18 20V4"/>
            <path d="M6 20v-4"/>
          </svg>
        </div>
        <div class="empty-state-text">
          <span class="empty-state-title">
            Análise por Disciplina
            <span class="empty-state-info-btn" tabindex="0"
                  aria-label="Como as fraquezas são identificadas"
                  data-tooltip="Identifica as disciplinas com menor taxa de acerto e detecta quando o desempenho está em queda ao longo das tentativas.">ⓘ</span>
          </span>
          <span class="empty-state-msg">
            Nenhuma disciplina configurada para este semestre.
          </span>
        </div>
      </div>`;
    return;
  }

  /* Constrói a lista final: dados reais quando existem,
     placeholder de "sem dados" quando a disciplina nunca foi praticada.
     Nenhum cálculo de taxa/tendência/queda é feito aqui — apenas
     reaproveitamento dos campos já calculados pelo quiz_intelligence
     ou montagem de um objeto neutro (0%, sem tendência). */
  const lista = discsSemestre.map(disc => {
    const dadosReais = mapaReais.get(_norm(disc.id));
    if (dadosReais) return dadosReais;
    return {
      disciplina:                disc.nome,
      taxaAcertoMediaPct:        0,
      inclinacaoPctPorTentativa: null,
      tendencia:                 null,
      emQueda:                   false,
      _semDados:                 true,
    };
  });

  elSection.className = 'weaknesses-card full-width';
  if (elCount) {
    const comDados = lista.filter(i => !i._semDados).length;
    elCount.textContent = comDados > 0 ? comDados : '';
  }
  elLista.innerHTML = '';

  const TENDENCIA_LABEL = {
    'melhorando': 'Melhorando',
    'estavel':    'Estável',
    'piorando':   'Piorando',
  };
  const TENDENCIA_CLASSE = {
    'melhorando': 'wk-tend-melhorando',
    'estavel':    'wk-tend-estavel',
    'piorando':   'wk-tend-piorando',
  };

  /* Acumulado durante o loop, usado depois para montar o insight
     do rodapé — nenhum cálculo novo, apenas coleta dos itens que
     já têm taxa consolidada (mesmo critério de dadosInsuficientes
     usado linha a linha). */
  const candidatosInsight = [];

  lista.forEach((item, idx) => {
    const disc = item?.disciplina        ?? '—';
    const taxa = item?.taxaAcertoMediaPct ?? null;

    /* Tendência real da disciplina — lida diretamente de
       item.tendencia.direcao (calculada por _calcularTendencia
       em quiz_intelligence.js). 'indeterminado' é tratado como
       "sem direção conhecida ainda", igual ao card de Tendência
       do Aluno — não é um valor fixo, é o próprio resultado
       retornado pela função quando há menos de 2 tentativas. */
    const direcaoReal = (!item._semDados && item?.tendencia?.direcao)
      ? item.tendencia.direcao
      : null;
    const temDirecaoValida = direcaoReal && direcaoReal !== 'indeterminado';

    /* Quando há tentativas mas ainda não o suficiente para calcular
       tendência (temDirecaoValida === false, e não é o caso de
       disciplina nunca praticada), a porcentagem também é ocultada
       com '—'. Evita a inconsistência de mostrar, por exemplo, 100%
       ao lado de "Aguardando mais tentativas" — o dado é real, mas
       ainda não é representativo o suficiente para ser exibido como
       taxa consolidada. Nenhum cálculo foi alterado: apenas a
       decisão de exibir ou não o valor já calculado. */
    const dadosInsuficientes = !item._semDados && !temDirecaoValida;
    const emQueda = item?.emQueda === true;

    if (!item._semDados && !dadosInsuficientes && taxa !== null) {
      candidatosInsight.push({ disciplina: disc, taxa });
    }

    const row       = document.createElement('div');
    row.className   = 'wk-item';
    if (emQueda && !item._semDados) row.classList.add('wk-item-queda');
    if (item._semDados) row.classList.add('wk-item-semdados');

    const pos         = document.createElement('div');
    /* Cor do indicador de posição por faixa de desempenho — apenas
       aparência, reaproveita a mesma faixa já usada na barra
       (wk-bar-ok / wk-bar-medio / wk-bar-baixo). */
    const posClasse = item._semDados
      ? 'wk-pos-semdados'
      : dadosInsuficientes
        ? ''
        : (taxa >= 70 ? 'wk-pos-ok' : taxa >= 40 ? 'wk-pos-medio' : 'wk-pos-baixo');
    pos.className     = ['wk-pos', posClasse].filter(Boolean).join(' ');
    pos.textContent   = idx + 1;

    const corpo       = document.createElement('div');
    corpo.className   = 'wk-corpo';

    const nomeWrap    = document.createElement('div');
    nomeWrap.className = 'wk-nome-wrap';

    const nome        = document.createElement('span');
    nome.className    = 'wk-nome';
    nome.textContent  = disc;
    nomeWrap.appendChild(nome);

    if (emQueda && !item._semDados) {
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

    /* Barra "vazia": tanto para disciplinas nunca praticadas
       (_semDados) quanto para disciplinas com dados insuficientes
       para confiar na tendência (dadosInsuficientes) — mesmo
       critério já usado para ocultar a porcentagem em wk-taxa.
       Nos dois casos a barra fica neutra (cinza, largura 0),
       em vez de colorida com base na taxa. */
    const barraVazia = item._semDados || dadosInsuficientes;
    const largura = (taxa !== null && !barraVazia) ? Math.max(0, Math.min(100, taxa)) : 0;
    barFill.style.width = largura + '%';

    if (barraVazia) {
      barFill.classList.add('wk-bar-semdados');
    } else if (taxa !== null) {
      if (taxa >= 70)      barFill.classList.add('wk-bar-ok');
      else if (taxa >= 40) barFill.classList.add('wk-bar-medio');
      else                 barFill.classList.add('wk-bar-baixo');
    }

    barBg.appendChild(barFill);
    barWrap.appendChild(barBg);

    corpo.appendChild(nomeWrap);
    corpo.appendChild(barWrap);
// DEPOIS
const meta        = document.createElement('div');
meta.className    = 'wk-meta';

const taxaEl      = document.createElement('div');
taxaEl.className  = 'wk-taxa';
taxaEl.textContent = (taxa !== null && !dadosInsuficientes) ? `${taxa}%` : '—';

/* "Evolução" agora é um bloco isolado (pill com rótulo fixo + valor
   colorido) em vez de um texto solto embaixo da porcentagem — evita
   que as duas informações sejam lidas como uma frase única. Nenhum
   dado novo: mesmas classes de estado (TENDENCIA_CLASSE) já calculadas
   acima, apenas reorganizadas visualmente. */
const tendEl      = document.createElement('div');
tendEl.className  = [
  'wk-evolucao',
  (!item._semDados && temDirecaoValida) ? (TENDENCIA_CLASSE[direcaoReal] ?? '') : '',
  item._semDados ? 'wk-tend-semdados' : '',
  (!item._semDados && !temDirecaoValida) ? 'wk-evolucao-poucos' : '',
].join(' ').trim();

const label = item._semDados
  ? 'Sem dados'
  : (temDirecaoValida ? (TENDENCIA_LABEL[direcaoReal] ?? direcaoReal) : 'Poucos dados');

tendEl.innerHTML = `
  <span class="wk-evolucao-rotulo">Evolução</span>
  <span class="wk-evolucao-valor">${label}</span>
`;

meta.appendChild(taxaEl);
meta.appendChild(tendEl);
    row.appendChild(pos);
    row.appendChild(corpo);
    row.appendChild(meta);
    elLista.appendChild(row);
  });

  /* ── Zona 1: chips de resumo (topo do card) ──
     Apenas agrupamento de campos já existentes em `lista`,
     mesmo padrão do total exibido no heatmap de "Perfil de uso". */
  if (elStatsRow) {
    const comDados  = lista.filter(i => !i._semDados).length;
    const emQuedaQt = lista.filter(i => i.emQueda === true && !i._semDados).length;

    elStatsRow.innerHTML = `
      <div class="wk-stat-chip">
        <div class="wk-stat-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="2" width="14" height="14" rx="2.5"/>
            <path d="M5.5 6.5h7M5.5 9.5h7M5.5 12.5h4"/>
          </svg>
        </div>
        <div class="wk-stat-body">
          <span class="wk-stat-label">Disciplinas monitoradas</span>
          <span class="wk-stat-value">${comDados} de ${lista.length}</span>
        </div>
      </div>
      <div class="wk-stat-chip">
        <div class="wk-stat-icon ${emQuedaQt > 0 ? 'ic-red' : 'ic-green'}">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 5.5v4.5M9 12.3v.2"/>
            <circle cx="9" cy="9" r="6.5"/>
          </svg>
        </div>
        <div class="wk-stat-body">
          <span class="wk-stat-label">Em queda</span>
          <span class="wk-stat-value">${emQuedaQt > 0 ? `${emQuedaQt} disciplina${emQuedaQt !== 1 ? 's' : ''}` : 'Nenhuma'}</span>
        </div>
      </div>
    `;
  }

  /* ── Zona 3: insight (rodapé do card) ──
     Seleciona (não calcula) a disciplina com menor taxa entre as
     que já têm dado consolidado — mesma lógica de "maior oportunidade
     de melhoria" que já orienta a ordenação visual da lista. */
  if (elInsight) {
    const todasSemDados = lista.every(i => i._semDados);

    if (todasSemDados) {
      elInsight.textContent = 'Complete quizzes para gerar sua análise por disciplina.';
    } else if (candidatosInsight.length > 0) {
      const pior = [...candidatosInsight].sort((a, b) => a.taxa - b.taxa)[0];
      elInsight.textContent = `Sua maior oportunidade de melhoria está em ${pior.disciplina} (${pior.taxa}%). Reforce essa disciplina para elevar sua média geral.`;
    } else {
      elInsight.textContent = 'Continue realizando quizzes para consolidar a análise por disciplina.';
    }
  }
}
/* Fase 2.5 — Previsao simples */

export function renderPrediction(relatorio) {
  const previsao = relatorio?.previsaoSimples;

  const elCard      = document.getElementById('prediction-card');
  const elBadge     = document.getElementById('prediction-badge');
  const elNumero    = document.getElementById('prediction-numero');
  const elDirecao   = document.getElementById('prediction-direcao');
  const elFill      = document.getElementById('prediction-slider-fill');
  const elHandle    = document.getElementById('prediction-slider-handle');
  const elAmostras  = document.getElementById('prediction-amostras');
  const elDescricao = document.getElementById('prediction-descricao');

  if (!elCard) return;

  const PROBABILIDADE_LABEL = {
    'alta':  'Alta probabilidade',
    'media': 'Probabilidade moderada',
    'média': 'Probabilidade moderada',
    'baixa': 'Baixa probabilidade',
  };

  if (!previsao || previsao.previsaoTaxaAcertoPct === null || previsao.previsaoTaxaAcertoPct === undefined) {
    elCard.className = 'prediction-card prediction-vazio';

    const amostrasAtuais = previsao?.amostras ?? 0;
    const faltam         = Math.max(0, 3 - amostrasAtuais);

    if (elBadge) elBadge.textContent = 'Sem dados';

    elNumero.innerHTML = `
      <span class="empty-icon" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="1.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 3v18h18"/>
          <path d="M7 16l4-4 4 4 4-8" stroke-dasharray="2 2"/>
        </svg>
      </span>`;

    elDirecao.textContent = 'Previsão indisponível no momento';

    if (elFill)   elFill.style.width  = '0%';
    if (elHandle) elHandle.style.left = '0%';

    elAmostras.textContent = amostrasAtuais > 0
      ? `${amostrasAtuais} de 3 tentativas registradas`
      : '';

    elDescricao.innerHTML = faltam > 0
      ? `<span class="empty-state-msg">
           Realize mais quizzes para ativar a previsão de desempenho.
           <br><span class="empty-state-hint">
             Mínimo de 3 quizzes para ativar esta análise.
           </span>
         </span>`
      : `<span class="empty-state-msg">
           Realize mais quizzes para aumentar a precisão da análise.
         </span>`;

    return;
  }

  const pctSeguro = Math.max(0, Math.min(100, previsao.previsaoTaxaAcertoPct));
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

  if (elFill)   elFill.style.width  = `${pctSeguro}%`;
  if (elHandle) elHandle.style.left = `${pctSeguro}%`;

  const probabilidadeLabel = PROBABILIDADE_LABEL[previsao.confianca] ?? 'Previsão disponível';
  if (elBadge) elBadge.textContent = probabilidadeLabel;

  const amostras = previsao.amostras ?? 0;
  elAmostras.textContent = `${amostras} amostra${amostras !== 1 ? 's' : ''} analisada${amostras !== 1 ? 's' : ''}`;

  elDescricao.textContent = `Com base no seu desempenho atual, você tem ${probabilidadeLabel.toLowerCase()} de alcançar um excelente resultado.`;
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

  _garantirScrollInterno(elTimeline);

  /* Preserva a posição do scroll entre re-renders: o container é
     reconstruído a cada chamada (innerHTML = ''), o que por padrão
     zeraria a rolagem mesmo que o usuário estivesse no meio da lista. */
  const scrollAnterior = elTimeline.scrollTop;

  elTimeline.innerHTML = '';

  if (!tentativas || !Array.isArray(tentativas) || tentativas.length === 0) {
    elTimeline.innerHTML = `
      <div class="empty-state-block empty-state-block--timeline">
        <div class="empty-state-icon" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.5"
               stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 7v5l3 3"/>
          </svg>
        </div>
        <div class="empty-state-text">
          <span class="empty-state-title">Atividade Recente</span>
          <span class="empty-state-msg">
            Nenhum quiz registrado ainda.
            <br>Complete quizzes para ver seu histórico de atividade aqui.
          </span>
        </div>
      </div>`;
    return;
  }

  tentativas.forEach(t => {
    const taxa  = typeof t.taxaAcerto === 'number' ? Math.round(t.taxaAcerto * 100) : 0;
    const label = [t.disc, t.modo].filter(Boolean).join(' · ') || 'Quiz';

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

  /* Restaura a posição de rolagem, limitada ao novo scrollHeight
     (evita "scroll fantasma" caso a lista tenha ficado menor). */
  elTimeline.scrollTop = Math.min(scrollAnterior, elTimeline.scrollHeight);
}

/* ─── Contrato de scroll interno da Atividade Recente ───────
   Aplicado via style inline (não apenas via classe CSS) porque
   este container está sujeito à cascata de dois arquivos CSS
   carregados em sequência (dashboard.css → dashboard_cards.css).
   Estilo inline tem prioridade sobre qualquer <link>, garantindo
   que o comportamento de "lista com ~4 itens visíveis + scroll
   interno" funcione mesmo que outra folha de estilo redefina
   .timeline / #activity-timeline no futuro.
   Não é lógica de negócio — é apenas reforço de apresentação,
   chamado a cada render para manter o contrato consistente. */
function _garantirScrollInterno(elTimeline) {
  elTimeline.style.maxHeight        = '312px';
  elTimeline.style.overflowY        = 'auto';
  elTimeline.style.overflowX        = 'hidden';
  elTimeline.style.overscrollBehavior = 'contain';
  elTimeline.style.scrollbarGutter  = 'stable';
  elTimeline.style.paddingRight     = '6px';
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

    /* Conquistas bloqueadas mostram dica de desbloqueio no tooltip */
    const infoBtn = !desbloqueada
      ? `<span class="empty-state-info-btn ach-info-btn" tabindex="0"
               aria-label="Como desbloquear ${_escapeHtml(c.nome)}"
               data-tooltip="${_escapeHtml(c.desc)}">ⓘ</span>`
      : '';

    item.innerHTML = `
      <div class="ach-badge" style="background:${badgeBg}">${c.emoji}</div>
      <div class="ach-body">
        <div class="ach-name">
          ${_escapeHtml(c.nome)}${infoBtn}
        </div>
        <div class="ach-desc">${_escapeHtml(c.desc)}</div>
        <span class="ach-tag ${desbloqueada ? c.tagCls : 'tag-locked'}">${desbloqueada ? c.tag : 'Bloqueado'}</span>
      </div>
    `;

    elLista.appendChild(item);
  });
}