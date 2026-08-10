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
   AJUSTE — Desempenho por Disciplina: TODAS AS DISCIPLINAS
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

   ─────────────────────────────────────────────
   CORREÇÃO — SyntaxError: 'renderAchievements' já declarada
   ─────────────────────────────────────────────
   Havia DUAS declarações de `export function renderAchievements`
   neste arquivo: a versão completa (resumo/anel/filtros/destaques,
   compatível com os elementos #ach-summary, #ach-filters,
   #ach-highlights-block do HTML atual) e uma versão antiga/simples
   no final do arquivo, que só preenchia #ach-list. Duas declarações
   de function com o mesmo nome no escopo do módulo são um erro de
   SINTAXE em ESM (SyntaxError), o que impedia o parser de sequer
   carregar o arquivo — por isso nenhuma função deste módulo era
   executada (efeito cascata: Score, Tendência, Fraquezas, Previsão,
   Timeline e Conquistas paravam de renderizar).
   Correção aplicada: a segunda declaração (versão antiga, simples)
   foi removida. Mantida apenas a primeira, que é a compatível com
   o HTML atual. Nenhuma outra lógica foi alterada.

   ─────────────────────────────────────────────
   REFATORAÇÃO — MODULARIZAÇÃO DE CONQUISTAS
   ─────────────────────────────────────────────
   Toda a lógica de Conquistas (catálogo estático, categorias de
   filtro, estado do filtro ativo, renderAchievements() e os
   helpers _ach* de formatação/ícones) foi extraída para
   dashboard/js/conquistas.js. Este arquivo passou a apenas
   IMPORTAR renderAchievements() e delegar a chamada dentro do
   coordenador renderDashboardIntelligence(), exatamente na mesma
   posição da sequência de render que já existia antes (item 8,
   após Timeline). Nenhum comportamento, HTML gerado, classe CSS
   ou ordem de execução foi alterado — apenas a localização física
   do código.
   A função _escapeHtml() continua definida aqui (como sempre
   esteve), pois também é usada por renderTimeline(). conquistas.js
   tem sua própria cópia local e privada — por decisão explícita,
   nenhum arquivo utilitário compartilhado foi criado; a pequena
   duplicação dessa função pura foi o trade-off aceito para manter
   os dois módulos sem dependência de um terceiro arquivo.
   ============================================= */

import { State } from './dashboard_data.js';
import { perfLog } from '../../src/perf_logger.js';
import { renderAchievements } from './conquistas.js';
import { UIState } from './utils/ui_state_manager.js';

/* ══════════════════════════════════════════════
   CAMADA 5 — COORDENADORA DE RENDER (intelligence)
══════════════════════════════════════════════ */
export function renderDashboardIntelligence(relatorio) {
  const _t0 = performance.now();

  if (!relatorio) {
    console.log('[dashboard] renderDashboardIntelligence: relatorio ausente — renderizando estado vazio.');
  }

  const _medir = (label, fn) => {
    const t0 = performance.now();
    fn();
    perfLog('Render', label, performance.now() - t0);
  };

  _medir('Render Score',       () => renderScore(relatorio));
  _medir('Render Tendência',   () => renderTrend(relatorio));
  _medir('Render Disciplinas', () => renderWeaknesses(relatorio));
  _medir('Render Previsão',    () => renderPrediction(relatorio));
  _medir('Render Atividade',   () => renderTimeline(relatorio));
  _medir('Render Conquistas',  () => renderAchievements(relatorio));

  perfLog('Render', 'Render completo (renderDashboardIntelligence)', performance.now() - _t0);
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
    'avançado':      'Avançado',
    'proficiente':   'Proficiente',
    'intermediário': 'Intermediário',
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


/* Fase 2.4 — Desempenho por Disciplina
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
/* ─────────────────────────────────────────────
   REDESIGN — Desempenho por Disciplina
   (antigo "Desempenho por Disciplina")
   ─────────────────────────────────────────────
   Transforma a lista simples em um painel analítico:
   cards de resumo + tabela com Nível, Prioridade e
   Evolução. NENHUM cálculo novo foi introduzido —
   todos os campos usados (taxaAcertoMediaPct,
   totalTentativas, nivelEstimado, emQueda,
   inclinacaoPctPorTentativa, tendencia.direcao) já
   são retornados por fraquezasPorDisciplina() em
   quiz_intelligence.js. "Nível" e "Prioridade" são
   apenas uma tradução visual de nivelEstimado
   (rótulos + nº de estrelas) — sem novo threshold
   sendo calculado aqui. */

const WK_NIVEL_META = {
  fundamentos:     { label: 'Crítico',   cls: 'wk-nivel-critico',   estrelas: 5 },
  iniciante:       { label: 'Baixo',     cls: 'wk-nivel-baixo',     estrelas: 4 },
  'intermediário': { label: 'Moderado',  cls: 'wk-nivel-moderado',  estrelas: 3 },
  proficiente:     { label: 'Bom',       cls: 'wk-nivel-bom',       estrelas: 2 },
  'avançado':      { label: 'Excelente', cls: 'wk-nivel-excelente', estrelas: 1 },
};

const WK_AVATAR_PALETTE = [
  { bg: 'rgba(108,99,255,.18)', color: 'var(--accent-lite)' },
  { bg: 'rgba(61,220,132,.18)', color: 'var(--green)' },
  { bg: 'rgba(255,181,71,.18)', color: 'var(--amber)' },
  { bg: 'rgba(79,168,232,.18)', color: 'var(--blue)' },
  { bg: 'rgba(255,92,106,.18)', color: 'var(--red)' },
];

const WK_STOPWORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);

/* Iniciais do avatar — puramente estético, não representa nenhum
   dado do sistema (apenas o nome real da disciplina, já existente). */
function _wkIniciais(nome) {
  const palavras = String(nome ?? '').trim().split(/\s+/)
    .filter(w => w && !WK_STOPWORDS.has(w.toLowerCase()));
  if (palavras.length === 0) return '?';
  if (palavras.length === 1) {
    const p = palavras[0];
    return (p[0] ?? '').toUpperCase() + (p[1] ?? '').toLowerCase();
  }
  return palavras[0][0].toUpperCase() + palavras[1][0].toLowerCase();
}

/* Estrelas de prioridade — apenas renderização de um número
   (0 a 5) já derivado de nivelEstimado, sem novo cálculo. */
/* Sempre renderiza as 5 estrelas — quando qtd=0 (poucos/sem dados),
   as 5 ficam vazias, deixando claro que ainda não há classificação
   em vez de esconder a informação atrás de um "—". */
function _wkEstrelasHtml(qtd) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="wk-star${i <= qtd ? ' is-filled' : ''}">★</span>`;
  }
  return html;
}

export function renderWeaknesses(relatorio) {
  const dadosReaisLista = relatorio?.fraquezasPorDisciplina;

  const elSection  = document.getElementById('weaknesses-section');
  const elLista    = document.getElementById('weaknesses-lista');
  const elStatsRow = document.getElementById('wk-stats-row');
  const elInsight  = document.getElementById('wk-insight');

  if (!elSection || !elLista) return;

  function _norm(s) {
    return String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  /* Mapa de dados reais indexado pelo identificador oficial normalizado
     — mesma regra de match de sempre (item.disciplina == disc.id). */
  const mapaReais = new Map();
  if (Array.isArray(dadosReaisLista)) {
    dadosReaisLista.forEach(item => {
      if (item?.disciplina) mapaReais.set(_norm(item.disciplina), item);
    });
  }

  const discsSemestre = State.disciplinas ?? [];

  if (discsSemestre.length === 0) {
    elSection.className = 'weaknesses-card weaknesses-vazio';
    if (elStatsRow) elStatsRow.innerHTML = '';
    if (elInsight) elInsight.textContent = 'Nenhuma disciplina configurada para este semestre.';
    elLista.innerHTML = `
      <div class="empty-state-block">
        <div class="empty-state-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.5"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
          </svg>
        </div>
        <div class="empty-state-text">
          <span class="empty-state-title">
            Desempenho por Disciplina
            <span class="empty-state-info-btn" tabindex="0"
                  aria-label="Como o desempenho é analisado"
                  data-tooltip="Cruza sua taxa de acerto por disciplina com a tendência de evolução para indicar onde focar os estudos.">ⓘ</span>
          </span>
          <span class="empty-state-msg">Nenhuma disciplina configurada para este semestre.</span>
        </div>
      </div>`;
    return;
  }

  /* Lista base: dado real quando existe, placeholder neutro quando
     a disciplina nunca foi praticada — mesma regra de sempre. */
  const listaBase = discsSemestre.map(disc => {
    const dadosReais = mapaReais.get(_norm(disc.id));
    if (dadosReais) return { ...dadosReais, _semDados: false };
    return {
      disciplina:                disc.nome,
      totalTentativas:           0,
      taxaAcertoMediaPct:        0,
      nivelEstimado:             null,
      inclinacaoPctPorTentativa: null,
      tendencia:                 null,
      emQueda:                   false,
      _semDados:                 true,
    };
  });

  /* Enriquecimento por item — leitura e classificação dos campos
     já existentes, nenhum cálculo novo. */
  const lista = listaBase.map(item => {
    const direcaoReal = (!item._semDados && item?.tendencia?.direcao)
      ? item.tendencia.direcao
      : null;
    const temDirecaoValida   = !!direcaoReal && direcaoReal !== 'indeterminado';
    const dadosInsuficientes = !item._semDados && !temDirecaoValida;
    const nivelMeta = (!item._semDados && item.nivelEstimado)
      ? WK_NIVEL_META[item.nivelEstimado]
      : null;

    return {
      ...item,
      _direcaoReal:        direcaoReal,
      _temDirecaoValida:   temDirecaoValida,
      _dadosInsuficientes: dadosInsuficientes,
      _nivelMeta:          nivelMeta,
    };
  });

  /* Ordenação: mesma prioridade já usada em fraquezasPorDisciplina()
     no quiz_intelligence.js (em queda primeiro, depois pior taxa
     primeiro). Sem dados vão para o final. */
  lista.sort((a, b) => {
    if (a._semDados !== b._semDados) return a._semDados ? 1 : -1;
    if (a.emQueda !== b.emQueda) return a.emQueda ? -1 : 1;
    return (a.taxaAcertoMediaPct ?? 0) - (b.taxaAcertoMediaPct ?? 0);
  });

  elSection.className = 'weaknesses-card full-width';

  /* ── Zona 1: cards de resumo ── */
  if (elStatsRow) {
    const totalDisc         = lista.length;
    const comDados          = lista.filter(i => i._temDirecaoValida).length;
    const emQuedaQt         = lista.filter(i => i.emQueda === true && !i._semDados).length;
    const precisamAtencaoQt = lista.filter(i =>
      !i._semDados && (i.nivelEstimado === 'fundamentos' || i.nivelEstimado === 'iniciante')
    ).length;

    elStatsRow.innerHTML = `
      <div class="wk-stat-chip">
        <div class="wk-stat-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="2" width="14" height="14" rx="2.5"/>
            <path d="M5.5 6.5h7M5.5 9.5h7M5.5 12.5h4"/>
          </svg>
        </div>
        <div class="wk-stat-body">
          <span class="wk-stat-value">${totalDisc}</span>
          <span class="wk-stat-label">Monitoradas</span>
        </div>
      </div>
      <div class="wk-stat-chip">
        <div class="wk-stat-icon ic-green">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="9" cy="9" r="6.5"/><path d="M6.2 9.3l1.8 1.8 3.8-3.8"/>
          </svg>
        </div>
        <div class="wk-stat-body">
          <span class="wk-stat-value">${comDados}</span>
          <span class="wk-stat-label">Com dados suficientes</span>
        </div>
      </div>
      <div class="wk-stat-chip">
        <div class="wk-stat-icon ${emQuedaQt > 0 ? 'ic-red' : 'ic-green'}">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2.5 5.5L7 10l2.5-2.5L15.5 13.5M11.5 13.5h4v-4"/>
          </svg>
        </div>
        <div class="wk-stat-body">
          <span class="wk-stat-value">${String(emQuedaQt).padStart(2, '0')}</span>
          <span class="wk-stat-label">Em queda</span>
        </div>
      </div>
      <div class="wk-stat-chip">
        <div class="wk-stat-icon ${precisamAtencaoQt > 0 ? 'ic-amber' : 'ic-green'}">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 2.5l7 12.5H2z"/><path d="M9 7.5v3.2M9 13v.2"/>
          </svg>
        </div>
        <div class="wk-stat-body">
          <span class="wk-stat-value">${String(precisamAtencaoQt).padStart(2, '0')}</span>
          <span class="wk-stat-label">Precisam de atenção</span>
        </div>
      </div>
    `;
  }

  /* ── Zona 2: tabela ── */
  const EVOL_LABEL = { melhorando: 'Melhorando', estavel: 'Estável', piorando: 'Piorando' };
  const EVOL_CLS   = { melhorando: 'wk-tend-melhorando', estavel: 'wk-tend-estavel', piorando: 'wk-tend-piorando' };

  const linhasHtml = lista.map((item, idx) => {
    const rank   = idx + 1;
    const disc   = item.disciplina ?? '—';
    const taxa   = item.taxaAcertoMediaPct ?? null;
    const emQueda = item.emQueda === true && !item._semDados;
    const nivelMeta = item._nivelMeta;
    const paleta = WK_AVATAR_PALETTE[idx % WK_AVATAR_PALETTE.length];

    const mostraTaxa = !item._semDados && !item._dadosInsuficientes && taxa !== null;
    const taxaTexto    = mostraTaxa ? `${taxa}%` : '—';
    const larguraBarra = mostraTaxa ? Math.max(0, Math.min(100, taxa)) : 0;
    const corBarra = !mostraTaxa
      ? 'wk-bar-semdados'
      : (taxa >= 70 ? 'wk-bar-ok' : taxa >= 40 ? 'wk-bar-medio' : 'wk-bar-baixo');

    /* Nível e Prioridade só são exibidos quando há dado consolidado
       o suficiente para confiar na tendência (_temDirecaoValida).
       Sem isso, o sistema já trata a disciplina como "não classificável"
       em outras partes do dashboard — aqui a linha só reflete essa
       mesma regra, sem novo critério. */
    const nivelHtml = item._semDados
      ? `<span class="wk-nivel-badge wk-nivel-semdados">Sem dados</span>`
      : (item._dadosInsuficientes
          ? `<span class="wk-nivel-badge wk-nivel-poucosdados">Poucos dados</span>`
          : `<span class="wk-nivel-badge ${nivelMeta.cls}">${nivelMeta.label}</span>`);

    const estrelasQtd = (!item._semDados && !item._dadosInsuficientes && nivelMeta)
      ? nivelMeta.estrelas
      : 0;
    const prioridadeHtml = `<span class="wk-stars" aria-label="Prioridade ${estrelasQtd} de 5">${_wkEstrelasHtml(estrelasQtd)}</span>`;

    const EVOL_LABEL = { melhorando: 'Melhorando', estavel: 'Estável', piorando: 'Piorando' };
    const EVOL_CLS   = { melhorando: 'wk-tend-melhorando', estavel: 'wk-tend-estavel', piorando: 'wk-tend-piorando' };
    const evolClasse = item._temDirecaoValida ? (EVOL_CLS[item._direcaoReal] ?? '') : (item._semDados ? 'wk-tend-semdados' : 'wk-evolucao-poucos');
    const evolLabel   = item._semDados ? 'Sem dados' : (item._temDirecaoValida ? (EVOL_LABEL[item._direcaoReal] ?? item._direcaoReal) : 'Poucos dados');
    /* Badge só mostra o valor — a coluna "Evolução" já dá o contexto,
       repetir a palavra dentro do badge era redundante. */
    const evolucaoHtml = `
      <span class="wk-evolucao ${evolClasse}">
        <span class="wk-evolucao-valor">${evolLabel}</span>
      </span>${emQueda ? '<span class="wk-badge-queda">↓ Em queda</span>' : ''}`;
    const tentativasTexto = item._semDados ? '—' : (item.totalTentativas ?? 0);

    return `
      <tr class="wk-row${emQueda ? ' wk-row-queda' : ''}${item._semDados ? ' wk-row-semdados' : ''}">
        <td class="wk-td-pos"><span class="wk-pos">${rank}</span></td>
        <td class="wk-td-disc">
          <div class="wk-disc-cell">
            <div class="wk-avatar" style="background:${paleta.bg};color:${paleta.color}">${_wkIniciais(disc)}</div>
            <span class="wk-disc-nome">${disc}</span>
          </div>
        </td>
        <td class="wk-td-desemp">
          <div class="wk-desemp-cell">
            <span class="wk-desemp-pct">${taxaTexto}</span>
            <div class="wk-bar-wrap"><div class="wk-bar-bg"><div class="wk-bar-fill ${corBarra}" style="width:${larguraBarra}%"></div></div></div>
          </div>
        </td>
        <td class="wk-td-nivel">${nivelHtml}</td>
        <td class="wk-td-prioridade">${prioridadeHtml}</td>
        <td class="wk-td-evolucao">${evolucaoHtml}</td>
        <td class="wk-td-tentativas"><span class="wk-tentativas-valor">${tentativasTexto}</span></td>
      </tr>`;
  }).join('');

  elLista.innerHTML = `
    <div class="wk-table-wrap">
      <table class="wk-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Disciplina</th>
            <th>Desempenho</th>
            <th>Nível</th>
            <th>Prioridade</th>
            <th>Evolução</th>
            <th>Tentativas</th>
          </tr>
        </thead>
        <tbody>${linhasHtml}</tbody>
      </table>
    </div>`;

  /* ── Zona 3: insight ── (mesma lógica de sempre: seleciona,
     não calcula, a pior taxa entre disciplinas com dado consolidado) */
  if (elInsight) {
    const candidatos    = lista.filter(i => !i._semDados && !i._dadosInsuficientes && i.taxaAcertoMediaPct !== null);
    const todasSemDados = lista.every(i => i._semDados);

    if (todasSemDados) {
      elInsight.textContent = 'Complete quizzes para gerar sua análise por disciplina.';
    } else if (candidatos.length > 0) {
      const pior = [...candidatos].sort((a, b) => a.taxaAcertoMediaPct - b.taxaAcertoMediaPct)[0];
      elInsight.textContent = `Sua maior oportunidade de melhoria está em ${pior.disciplina} (${pior.taxaAcertoMediaPct}%). Foque nessa disciplina para elevar seu desempenho geral.`;
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
     zeraria a rolagem mesmo que o usuário estivesse no meio da lista.
     Mesmo mecanismo usado pelos outros módulos — ver
     dashboard/js/utils/ui_state_manager.js. */
  const scrollables = { timeline: () => document.getElementById('activity-timeline') };
  const scrollAnterior = UIState.captureScrollNow(scrollables);

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

    /* Concluído x em andamento: reaproveita exclusivamente os campos
       já normalizados por quiz_intelligence.js (respondidas e
       totalQuestoes, os mesmos que alimentam todo o resto do sistema).
       Nenhum novo status é calculado ou persistido — é apenas a
       mesma condição que já define `finalizado` no quiz_engine.js
       (respondidas === totalQuestoes), lida aqui só para exibição. */
    const respondidas = t.respondidas ?? t.acertos ?? 0;
    const total        = t.totalQuestoes ?? 0;
    const concluido     = total > 0 && respondidas >= total;

    let corDot, corIcone;
    if (!concluido) {
      corDot = 'rgba(255,181,71,.12)'; corIcone = '#FFB547';
    } else if (taxa >= 75)      { corDot = 'rgba(61,220,132,.12)'; corIcone = '#3DDC84'; }
    else if (taxa >= 50) { corDot = 'rgba(255,181,71,.12)';  corIcone = '#FFB547'; }
    else                 { corDot = 'rgba(255,92,106,.12)';   corIcone = '#FF5C6A'; }

    const tempoFormatado = _formatarTempoRelativo(t.endedAt);

    const titulo = concluido ? 'Quiz concluído' : 'Quiz em andamento';
    const descHtml = concluido
      ? `${_escapeHtml(label)} · <strong style="color:${corIcone}">${t.acertos ?? 0}/${total} (${taxa}%)</strong>`
      : `${_escapeHtml(label)} · <strong style="color:${corIcone}">${respondidas}/${total} respondidas</strong>`;

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
        <div class="tl-title">${titulo}</div>
        <div class="tl-desc">${descHtml}</div>
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

  /* Restaura a posição de rolagem — o próprio navegador limita
     scrollTop ao scrollHeight atual, então não é preciso clampar
     manualmente aqui (evita "scroll fantasma" caso a lista tenha
     ficado menor). */
  UIState.applyScrollNow(scrollables, scrollAnterior);
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