/* =============================================
   NEXUS STUDY — novas_implementações\v2\dashboard.js
    proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar
   Dashboard: visão geral, ferramentas pessoais e estatísticas.
   =============================================

   v5 — Tempo global contínuo (Camada 1)
   ─────────────────────────────────────────────
   MUDANÇAS v4 → v5
   ─────────────────────────────────────────────
   • Filosofia de exibição alterada: o dashboard não
     exibe "sessões" como unidade principal. O usuário
     vê tempo contínuo de estudo — como um tracker de
     progresso pessoal, não um log de conexões.

   • Novos indicadores obrigatórios:
     - Tempo total lifetime (tempoTotalGeral)
     - Tempo médio por dia (diasAtivos nos últimos 30)
     - Evolução diária 30 dias (barras reais)
     - Streak de dias ativos
     - Frequência de uso (dias ativos / 30)
     - Comparação dia a dia (delta vs ontem)
     - Identificação do melhor dia
     - Gráfico de crescimento acumulado (últimos 7)

   • Removido: exibição de contagem de sessões como
     métrica principal do usuário. totalSessoes permanece
     como dado técnico interno, não como destaque visual.

   • Mantido inalterado de v4:
     - Navigation analytics (pages, navigation, heatmap)
     - Quiz events rendering
     - Session timer ao vivo via subscribe()
     - BUG 1, 2, 3 de versões anteriores
     - Toda a lógica de troca de semestre
     - _buscarUltimaSessaoPersistida (fallback Firestore)

   ─────────────────────────────────────────────
   CAMADA 5 — Fase 1 (integracao com quiz_intelligence)
   ─────────────────────────────────────────────
   - Adicionado: _carregarIntelligence(uid)
     Ponto unico de entrada para a inteligencia.
     Chama window.NexusQuizIntelligence.relatorioEvolucao(uid)
     uma unica vez e armazena em State.intelligence.

   - Adicionado: State.intelligence = null
     Campo central onde todos os renderizadores da
     Camada 5 buscam os dados de inteligencia.

   ─────────────────────────────────────────────
   CAMADA 5 — Fase 1.5 (arquitetura do dashboard)
   ─────────────────────────────────────────────
   - Adicionado: renderDashboardIntelligence(relatorio)
     Coordenadora leve. Unico ponto que distribui
     State.intelligence para os renderizadores.
     Nenhuma logica propria — apenas delega.

   - Adicionados: 6 stubs de renderizadores
     renderScore / renderTrend / renderComparison /
     renderWeaknesses / renderPrediction / renderLearningCurve
     Cada um responsavel por um unico bloco visual.
     Preenchidos nas Fases 2.1 a 2.6.

   - Fluxo canonico estabelecido:
     _bootPagina()
       → _carregarMetricasReais()
         → _carregarIntelligence(uid)
           → State.intelligence
           → renderDashboardIntelligence(relatorio)
             → renderScore / renderTrend / renderComparison
             → renderWeaknesses / renderPrediction / renderLearningCurve

   - Regra arquitetural preservada:
     quiz_engine → quiz_intelligence → dashboard
     O dashboard nao recalcula, nao interpreta,
     nao e uma segunda inteligencia.

   - HTML e CSS: inalterados nesta fase.
   ============================================= */

import {
  setSemestre,
  getDisciplinaAtual,
  getDisciplinasDeSemestre,
  setPagina,
  SEMESTRES,
  getUsuario,
} from '../../src/global.js';

import { resolverSemestreDeURL } from '../../shared/js/utils/url.js';
import { aplicarCoresDisciplina } from '../../shared/js/themes/theme.js';
import { injetarLogo } from '../../shared/js/utils/logo.js';

/* ── Áudio ── */
import {
  Sound,
  audio,
  installAudioRecovery,
  playSound,
} from '../../shared/js/audio/audio-api.js';

/* ── Session Tracker ── */
import {
  subscribe     as sessionSubscribe,
  formatTime    as sessionFormatTime,
  formatTimeHuman,
  carregarEstatisticas,
  getStats      as sessionGetStats,
} from '../../src/session-tracker.js';

/* ── Firestore (leitura da última sessão persistida — fallback) ── */
import { getDb } from '../../src/firebase.js';
import {
  collection, query, orderBy, limit, getDocs,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

/* ══════════════════════════════════════════════
   ESTADO
══════════════════════════════════════════════ */
const State = {
  semestre:    null,
  disciplinas: [],
  discAtiva:   null,
  DISC_CORES:  {},

  /* ── CAMADA 5 ──
     Resultado completo de relatorioEvolucao(uid).
     Populado por _carregarIntelligence(uid).
     Nunca modificado diretamente por nenhum renderizador.
     Nunca recalculado — apenas recebido da API pública. */
  intelligence: null,
};

/* ══════════════════════════════════════════════
   WRAPPER DE TEMA
══════════════════════════════════════════════ */
function _aplicarCoresSeDefined(discArquivo) {
  if (!discArquivo) return;
  if (!State.DISC_CORES[discArquivo]) return;
  aplicarCoresDisciplina(discArquivo, State.DISC_CORES);
}

/* ══════════════════════════════════════════════
   CONTEXTO — semestre / disciplina atuais
══════════════════════════════════════════════ */
function _resolverContexto() {
  const semestre = resolverSemestreDeURL();
  setSemestre(semestre);

  const lista = getDisciplinasDeSemestre(semestre);

  State.semestre    = semestre;
  State.disciplinas = lista;

  const discId = getDisciplinaAtual();
  const disc   = (discId ? lista.find(d => d.id === discId) : null) ?? lista[0] ?? null;

  State.discAtiva = disc;

  if (disc) _aplicarCoresSeDefined(disc.arquivo);
}

/* ══════════════════════════════════════════════
   SELETOR DE SEMESTRE
══════════════════════════════════════════════ */
function _renderSemestreSelector() {
  const wrap = document.getElementById('semestre-selector-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';

  const select      = document.createElement('select');
  select.className  = 'semestre-select';
  select.title      = 'Selecionar semestre';
  select.id         = 'semestre-select';

  SEMESTRES.forEach(s => {
    const opt       = document.createElement('option');
    opt.value       = s;
    opt.textContent = s;
    if (s === State.semestre) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener('change', e => {
    playSound('select', 'perfil');
    _trocarSemestre(e.target.value);
  });

  wrap.appendChild(select);

  requestAnimationFrame(() => {
    const sel = wrap.querySelector('select');
    if (sel) sel.addEventListener('mousedown', () => playSound('click', 'perfil'));
  });
}

function _trocarSemestre(novoSemestre) {
  setSemestre(novoSemestre);
  State.semestre    = novoSemestre;
  State.disciplinas = getDisciplinasDeSemestre(novoSemestre);
  State.discAtiva   = State.disciplinas[0] ?? null;

  if (State.discAtiva) _aplicarCoresSeDefined(State.discAtiva.arquivo);

  _renderContexto();
  _renderDisciplinas();
  _renderSidebarDisciplinas();
}

/* ══════════════════════════════════════════════
   RENDER — elementos dinâmicos
══════════════════════════════════════════════ */
function _renderContexto() {
  const semEl = document.getElementById('meta-semestre');
  if (semEl) semEl.textContent = State.semestre ? `Semestre · ${State.semestre}` : '—';

  const discEl = document.getElementById('meta-disciplina');
  if (discEl) {
    discEl.textContent = State.discAtiva
      ? `${State.discAtiva.emoji ? State.discAtiva.emoji + ' ' : ''}${State.discAtiva.nome}`
      : 'Nenhuma disciplina';
  }
}

function _corDaDisciplina(disc) {
  const entry = disc?.arquivo ? State.DISC_CORES?.[disc.arquivo] : null;
  if (!entry) return null;
  if (typeof entry === 'string') return entry;
  return entry.cor ?? entry.hex ?? entry.primary ?? entry.principal ?? null;
}

function _renderDisciplinas() {
  const grid = document.getElementById('disc-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (!State.disciplinas.length) {
    const vazio       = document.createElement('div');
    vazio.className   = 'disc-empty';
    vazio.textContent = 'Nenhuma disciplina neste semestre.';
    grid.appendChild(vazio);
    return;
  }

  State.disciplinas.forEach(disc => {
    const cor = _corDaDisciplina(disc);

    const item          = document.createElement('div');
    item.className      = 'disc-item';
    item.dataset.discId = disc.id;

    const colorBar     = document.createElement('div');
    colorBar.className = 'disc-color';
    if (cor) colorBar.style.background = cor;

    const nome          = document.createElement('div');
    nome.className      = 'disc-name';
    nome.textContent    = disc.nome;

    const sub           = document.createElement('div');
    sub.className       = 'disc-sessions';
    sub.textContent     = `${disc.emoji ? disc.emoji + ' ' : ''}${disc.apelido ?? disc.id}`;

    item.appendChild(colorBar);
    item.appendChild(nome);
    item.appendChild(sub);
    grid.appendChild(item);
  });
}

function _renderSidebarDisciplinas() {
  const wrap = document.getElementById('sidebar-disciplinas');
  if (!wrap) return;

  wrap.innerHTML = '';

  State.disciplinas.forEach(disc => {
    const a       = document.createElement('a');
    a.className   = 'nav-item';
    a.href        = '#';

    const icon    = document.createElement('span');
    icon.className = 'nav-icon nav-emoji';
    icon.textContent = disc.emoji ?? '📚';
    icon.setAttribute('aria-hidden', 'true');

    const label = document.createTextNode(disc.apelido ?? disc.nome);

    a.appendChild(icon);
    a.appendChild(label);
    wrap.appendChild(a);
  });
}

/* ══════════════════════════════════════════════
   GREETING
══════════════════════════════════════════════ */
function _renderGreeting() {
  const el = document.getElementById('page-greeting');
  if (!el) return;
  const agora = new Date();
  const texto = agora.toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
  el.textContent = `// ${texto}`;
}

function _renderUsuario() {
  const el     = document.getElementById('page-user-name');
  if (!el) return;
  const usuario = getUsuario?.();
  const nome    = usuario?.nome || usuario?.displayName || '';
  el.innerHTML  = nome
    ? `, <span class="accent">${_escapeHtml(nome.split(' ')[0])}</span>`
    : '';
}

function _escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/* ══════════════════════════════════════════════
   SESSION TIMER — ao vivo
   Exibe o tempo ativo desta aba (ou pausa se não
   for a aba líder).
══════════════════════════════════════════════ */
function _initSessionTimer() {
  const timeEl = document.querySelector('.session-time');
  const subEl  = document.querySelector('.session-sub');

  if (!timeEl) return;

  function _atualizar(stats) {
    if (!stats) return;
    timeEl.textContent = sessionFormatTime(stats.activeSeconds);

    if (subEl) {
      if (stats.initialized && !stats.isLeader) {
        subEl.textContent = 'Outra aba em contagem';
      } else if (!stats.isRunning && stats.initialized) {
        subEl.textContent = 'Aba em segundo plano';
      } else if (State.discAtiva) {
        subEl.textContent = `${State.discAtiva.apelido ?? State.discAtiva.nome} · ${State.semestre ?? ''}`;
      } else if (State.semestre) {
        subEl.textContent = State.semestre;
      } else {
        subEl.textContent = 'Sessão ativa';
      }
    }

    _renderNavegacaoAoVivo(stats);
  }

  _atualizar(sessionGetStats());
  sessionSubscribe(_atualizar);
}

/* ══════════════════════════════════════════════
   CAMADA 5 — INTEGRAÇÃO COM QUIZ INTELLIGENCE
   ─────────────────────────────────────────────
   Ponto único de carregamento da inteligência.

   REGRA: este bloco NUNCA calcula nada.
   Apenas chama a API pública e armazena o resultado.

   Fluxo:
     1. Verifica se window.NexusQuizIntelligence existe.
        Se não existir ainda (race condition no boot),
        aguarda até 3s com polling de 100ms antes de desistir.
     2. Chama relatorioEvolucao(uid) — uma única vez.
        Internamente ela já usa Promise.allSettled, então
        falhas parciais não quebram o retorno.
     3. Armazena em State.intelligence.
     4. Loga o resultado completo no console para
        validação durante desenvolvimento.

   O que NÃO está aqui (e nunca estará):
     ✗ Cálculo de taxa de acerto
     ✗ Derivação de tendência
     ✗ Classificação de nível
     ✗ Qualquer Math.* sobre dados de quiz
   ─────────────────────────────────────────────*/
async function _aguardarNexusIntelligence(timeoutMs = 3000) {
  if (window.NexusQuizIntelligence) return window.NexusQuizIntelligence;

  return new Promise((resolve) => {
    const inicio    = Date.now();
    const intervalo = setInterval(() => {
      if (window.NexusQuizIntelligence) {
        clearInterval(intervalo);
        resolve(window.NexusQuizIntelligence);
        return;
      }
      if (Date.now() - inicio >= timeoutMs) {
        clearInterval(intervalo);
        console.warn('[dashboard] NexusQuizIntelligence não disponível após', timeoutMs, 'ms');
        resolve(null);
      }
    }, 100);
  });
}

async function _carregarIntelligence(uid) {
  if (!uid) {
    console.warn('[dashboard] _carregarIntelligence: uid ausente — ignorado.');
    return null;
  }

  const intelligence = await _aguardarNexusIntelligence();

  if (!intelligence) {
    console.warn('[dashboard] _carregarIntelligence: NexusQuizIntelligence indisponível.');
    State.intelligence = null;
    return null;
  }

  try {
    console.log('[dashboard] _carregarIntelligence: chamando relatorioEvolucao para', uid);
    const relatorio = await intelligence.relatorioEvolucao(uid);

    State.intelligence = relatorio;

    /* Log de validação — permite confirmar no console
       que todos os blocos da API estão retornando dados.
       Remover ou suprimir em produção se necessário. */
    console.group('[dashboard] State.intelligence — relatorio recebido');
    console.log('geradoEm:',             new Date(relatorio?.geradoEm).toLocaleTimeString());
    console.log('scoreEvolutivo:',       relatorio?.scoreEvolutivo);
    console.log('tendenciaDoAluno:',     relatorio?.tendenciaDoAluno);
    console.log('fraquezasPorDisc:',     relatorio?.fraquezasPorDisciplina?.length, 'disciplinas');
    console.log('curvaDeAprendizado:',   relatorio?.curvaDeAprendizado?.geral?.totalTentativas, 'tentativas gerais');
    console.log('previsaoSimples:',      relatorio?.previsaoSimples);
    console.log('comparacaoDePeriodos:', relatorio?.comparacaoDePeriodos);
    console.log('summaryPersistido:',    relatorio?.summaryPersistidoCamada3);
    console.groupEnd();

    /* Disparar o coordenador de render da Camada 5.
       State.intelligence já foi populado acima — renderDashboardIntelligence
       recebe o relatorio diretamente para evitar dependência implícita
       de estado global dentro dos renderizadores. */
    renderDashboardIntelligence(relatorio);

    return relatorio;

  } catch (err) {
    console.error('[dashboard] _carregarIntelligence: erro ao chamar relatorioEvolucao:', err);
    State.intelligence = null;
    return null;
  }
}

/* ══════════════════════════════════════════════
   CAMADA 5 — COORDENADORA DE RENDER (intelligence)
   ─────────────────────────────────────────────
   renderDashboardIntelligence(relatorio) é o único
   ponto que distribui State.intelligence para os
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
   ─────────────────────────────────────────────*/
function renderDashboardIntelligence(relatorio) {
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
   ─────────────────────────────────────────────
   Cada função abaixo é responsavel por exatamente
   um bloco visual da Camada 5.

   REGRAS que cada renderizador obedece:
     ✔ Receber apenas (relatorio) como argumento
     ✔ Ler somente os campos ja existentes no relatorio
     ✔ Nunca chamar Firebase
     ✔ Nunca chamar NexusQuizIntelligence
     ✔ Nunca calcular metricas — apenas exibir
     ✔ Nunca derivar score, tendencia ou previsao
   ─────────────────────────────────────────────*/

/* Fase 2.1 — Score evolutivo (0-100) + nivel estimado
   ─────────────────────────────────────────────────────
   Fonte: relatorio.scoreEvolutivo (calculado por quiz_intelligence.js)
   Esta funcao apenas le campos e atualiza o DOM.
   Zero calculos. Zero chamadas externas. */
function renderScore(relatorio) {
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
function renderTrend(relatorio) {
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
function renderComparison(relatorio) {
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
function renderWeaknesses(relatorio) {
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
function renderPrediction(relatorio) {
  /* stub — sera preenchido na Fase 2.5 */
  /* fonte: relatorio.previsaoSimples */
}

/* Fase 2.6 — Curva de aprendizado (serie temporal + media movel) */
function renderLearningCurve(relatorio) {
  /* stub — sera preenchido na Fase 2.6 */
  /* fonte: relatorio.curvaDeAprendizado */
}

/* ══════════════════════════════════════════════
   METRICAS REAIS DO FIREBASE
══════════════════════════════════════════════ */
async function _carregarMetricasReais() {
  const usuario = getUsuario?.();
  if (!usuario?.uid) {
    _renderMetricasVazio();
    return;
  }

  try {
    const [stats, ultimaSessao] = await Promise.all([
      carregarEstatisticas(usuario.uid),
      _buscarUltimaSessaoPersistida(usuario.uid),
    ]);

    if (!stats) {
      _renderMetricasVazio();
      return;
    }

    /* ── Bloco principal: tempo global contínuo ── */
    _renderTempoGlobal(stats);

    /* ── Tendência e evolução ── */
    _renderTendencia(stats);
    _renderEvolucaoDiaria(stats);
    _renderCrescimentoAcumulado(stats);

    /* ── Consistência de uso ── */
    _renderConsistencia(stats);

    /* ── Sparklines nos cards ── */
    _renderSparklines(stats);

    /* ── Último acesso ── */
    _renderUltimoAcesso(stats);

    /* ── Navegação: ao vivo ou fallback Firestore ── */
    const statsSessaoAtual   = sessionGetStats();
    const temSessaoEmMemoria = statsSessaoAtual?.initialized
      && (statsSessaoAtual.navSequence?.length > 0);

    if (temSessaoEmMemoria) {
      _renderNavegacaoAoVivo(statsSessaoAtual);
    } else if (ultimaSessao) {
      _renderNavegacaoPersistida(ultimaSessao);
    } else {
      _renderNavegacaoVazia();
    }

  } catch (err) {
    console.error('[dashboard] _carregarMetricasReais:', err);
    _renderMetricasVazio();
  }

  /* ── CAMADA 5: carregar inteligência após métricas de sessão ──
     Chamado aqui para garantir que o uid já foi validado acima.
     Não bloqueia o render das métricas de sessão — é independente.
     O resultado fica em State.intelligence para os futuros
     renderizadores da Fase 2 consumirem. */
  _carregarIntelligence(getUsuario()?.uid).catch(() => {});
}

async function _buscarUltimaSessaoPersistida(uid) {
  if (!uid) return null;
  try {
    const db  = getDb();
    const ref = collection(db, 'usuarios', uid, 'sessoes');
    const q   = query(ref, orderBy('startedAt', 'desc'), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docSnap = snap.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  } catch (err) {
    console.warn('[dashboard] _buscarUltimaSessaoPersistida:', err);
    return null;
  }
}

/* ══════════════════════════════════════════════
   RENDER — TEMPO GLOBAL CONTÍNUO
   Principal bloco de métricas. Foco em evolução,
   não em contagem de sessões.
══════════════════════════════════════════════ */
function _renderTempoGlobal(stats) {
  /* Tempo total lifetime */
  const elTotal = document.getElementById('stat-tempo-total');
  if (elTotal) elTotal.textContent = formatTimeHuman(stats.tempoTotalGeral);

  /* Tempo hoje */
  const elHoje = document.getElementById('stat-tempo-hoje');
  if (elHoje) elHoje.textContent = formatTimeHuman(stats.tempoHoje);

  /* Streak */
  const elStreak = document.getElementById('stat-streak');
  if (elStreak) elStreak.textContent = stats.streak;

  /* Média diária (30 dias) */
  const elMedia = document.getElementById('stat-media-sessao');
  if (elMedia) {
    elMedia.textContent = stats.mediaDiaria > 0
      ? formatTimeHuman(stats.mediaDiaria)
      : '—';
  }

  /* Delta vs ontem */
  const ontemKey   = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  })();
  const tempoOntem = stats.historico?.[ontemKey]?.tempoTotal ?? 0;

  const elDelta = document.getElementById('stat-delta-tempo');
  if (elDelta) {
    if (tempoOntem > 0 || stats.tempoHoje > 0) {
      const diff  = stats.tempoHoje - tempoOntem;
      const sinal = diff >= 0 ? '+' : '';
      elDelta.textContent = `${sinal}${formatTimeHuman(Math.abs(diff))} vs ontem`;
      elDelta.closest('.stat-delta')?.classList.toggle('delta-up',   diff >= 0);
      elDelta.closest('.stat-delta')?.classList.toggle('delta-down', diff < 0);
    } else {
      elDelta.textContent = '—';
    }
  }

  /* totalSessoes — mantido como dado técnico (não destaque) */
  const elSessoes = document.getElementById('stat-sessoes');
  if (elSessoes) elSessoes.textContent = stats.totalSessoes;
}

/* ══════════════════════════════════════════════
   RENDER — TENDÊNCIA DE USO
   Compara os últimos 7 dias para identificar
   padrão de crescimento ou queda.
══════════════════════════════════════════════ */
function _renderTendencia(stats) {
  /* Média diária */
  const mediaDiaria = document.getElementById('perf-media-diaria');
  if (mediaDiaria) {
    mediaDiaria.textContent = stats.mediaDiaria > 0
      ? formatTimeHuman(stats.mediaDiaria)
      : '—';
    const bar = document.getElementById('perf-bar-media');
    if (bar) bar.style.width = Math.min(100, (stats.mediaDiaria / 7200) * 100) + '%';
  }

  /* Dias ativos nos últimos 7 */
  const diasAtivos7 = document.getElementById('perf-dias-ativos');
  if (diasAtivos7 && stats.ultimos7?.length) {
    const count = stats.ultimos7.filter(d => d.tempoTotal > 0).length;
    diasAtivos7.textContent = `${count}/7`;
    const bar = document.getElementById('perf-bar-dias');
    if (bar) bar.style.width = (count / 7 * 100) + '%';
  }

  /* Melhor dia (últimos 30) */
  const melhorDiaEl = document.getElementById('perf-melhor-dia');
  if (melhorDiaEl) {
    if (stats.melhorDia?.tempo > 0) {
      const [, mm, dd] = (stats.melhorDia.key ?? '').split('-');
      melhorDiaEl.textContent = `${dd}/${mm} · ${formatTimeHuman(stats.melhorDia.tempo)}`;
    } else {
      melhorDiaEl.textContent = '—';
    }
    const bar = document.getElementById('perf-bar-melhor');
    if (bar) bar.style.width = stats.melhorDia?.tempo > 0
      ? Math.min(100, (stats.melhorDia.tempo / 14400) * 100) + '%'
      : '0%';
  }

  /* Streak */
  const streakEl = document.getElementById('perf-streak');
  if (streakEl) {
    streakEl.textContent = `${stats.streak} dia${stats.streak !== 1 ? 's' : ''}`;
    const bar = document.getElementById('perf-bar-streak');
    if (bar) bar.style.width = Math.min(100, (stats.streak / 30) * 100) + '%';
  }
}

/* ══════════════════════════════════════════════
   RENDER — CRESCIMENTO ACUMULADO (últimos 7 dias)
   Mostra tempo acumulado corrido para evidenciar
   a trajetória de estudo, não apenas o dia a dia.
══════════════════════════════════════════════ */
function _renderCrescimentoAcumulado(stats) {
  const wrap = document.getElementById('crescimento-acumulado');
  if (!wrap || !stats.ultimos7?.length) return;

  wrap.innerHTML = '';

  /* Calcula acumulado corrido */
  let acum = 0;
  const pontos = stats.ultimos7.map(d => {
    acum += d.tempoTotal;
    return acum;
  });

  const maxAcum = Math.max(...pontos, 1);
  const W = 280, H = 64;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('class', 'crescimento-svg');

  /* Área preenchida */
  const pts = pontos.map((v, i) => {
    const x = Math.round((i / (pontos.length - 1)) * (W - 8)) + 4;
    const y = Math.round(H - 8 - ((v / maxAcum) * (H - 16)));
    return `${x},${y}`;
  });

  const area = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  const firstX = pts[0].split(',')[0];
  const lastX  = pts[pts.length - 1].split(',')[0];
  area.setAttribute('points', `${firstX},${H} ${pts.join(' ')} ${lastX},${H}`);
  area.setAttribute('class', 'crescimento-area');

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  line.setAttribute('points', pts.join(' '));
  line.setAttribute('class', 'crescimento-line');

  svg.appendChild(area);
  svg.appendChild(line);
  wrap.appendChild(svg);

  /* Label do total acumulado (últimos 7 dias) */
  const label = document.getElementById('crescimento-total-label');
  if (label) {
    const totalUltimos7 = stats.ultimos7.reduce((s, d) => s + d.tempoTotal, 0);
    label.textContent = totalUltimos7 > 0
      ? `${formatTimeHuman(totalUltimos7)} nos últimos 7 dias`
      : '—';
  }
}

/* ══════════════════════════════════════════════
   RENDER — CONSISTÊNCIA DE USO (últimos 30 dias)
   Frequência de acesso e regularidade — mostra
   se o usuário tem um padrão sólido ou esporádico.
══════════════════════════════════════════════ */
function _renderConsistencia(stats) {
  /* Frequência: dias ativos / 30 */
  const freqEl = document.getElementById('consistencia-frequencia');
  if (freqEl) {
    const pct = Math.round((stats.diasAtivos30 / 30) * 100);
    freqEl.textContent = `${stats.diasAtivos30} de 30 dias (${pct}%)`;
    const bar = document.getElementById('consistencia-bar-freq');
    if (bar) bar.style.width = pct + '%';
  }

  /* Regularidade: quanto o tempo varia entre dias (desvio relativo) */
  const regEl = document.getElementById('consistencia-regularidade');
  if (regEl) {
    const diasComTempo = Object.values(stats.historico ?? {})
      .filter(d => d.tempoTotal > 0)
      .map(d => d.tempoTotal);

    if (diasComTempo.length >= 2) {
      const media  = diasComTempo.reduce((a, b) => a + b, 0) / diasComTempo.length;
      const desv   = Math.sqrt(
        diasComTempo.reduce((s, v) => s + Math.pow(v - media, 2), 0) / diasComTempo.length
      );
      const cv     = media > 0 ? desv / media : 1; // coeficiente de variação (0=uniforme, >1=irregular)
      const score  = Math.max(0, Math.min(100, Math.round((1 - Math.min(cv, 1)) * 100)));
      const rotulo = score >= 75 ? 'Regular' : score >= 40 ? 'Moderado' : 'Variável';
      regEl.textContent = `${rotulo} (${score}%)`;
      const bar = document.getElementById('consistencia-bar-reg');
      if (bar) bar.style.width = score + '%';
    } else {
      regEl.textContent = diasComTempo.length === 1 ? 'Dados insuficientes' : '—';
    }
  }

  /* Tendência: compara média últimos 7 dias vs 7 dias anteriores */
  const tendEl = document.getElementById('consistencia-tendencia');
  if (tendEl && stats.ultimos7?.length === 7 && stats.historico) {
    const mediaRecente = stats.ultimos7.reduce((s, d) => s + d.tempoTotal, 0) / 7;

    const hoje = new Date();
    let mediaAnterior = 0;
    for (let i = 7; i < 14; i++) {
      const d   = new Date(hoje);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      mediaAnterior += stats.historico?.[key]?.tempoTotal ?? 0;
    }
    mediaAnterior /= 7;

    if (mediaAnterior > 0) {
      const delta  = mediaRecente - mediaAnterior;
      const sinal  = delta >= 0 ? '▲' : '▼';
      const classe = delta >= 0 ? 'tend-up' : 'tend-down';
      tendEl.textContent  = `${sinal} ${formatTimeHuman(Math.abs(delta))}/dia vs semana anterior`;
      tendEl.className    = `consistencia-tend ${classe}`;
    } else {
      tendEl.textContent = mediaRecente > 0 ? '▲ Primeira semana com dados' : '—';
      tendEl.className   = 'consistencia-tend';
    }
  }
}

/* ══════════════════════════════════════════════
   RENDER — ÚLTIMO ACESSO
══════════════════════════════════════════════ */
function _renderUltimoAcesso(stats) {
  const el = document.getElementById('stat-ultimo-acesso');
  if (!el || !stats.ultimaAtividade) return;

  const agora   = Date.now();
  const diff    = agora - stats.ultimaAtividade;
  const minutos = Math.floor(diff / 60000);
  const horas   = Math.floor(diff / 3600000);
  const dias    = Math.floor(diff / 86400000);

  let texto;
  if (minutos < 1)       texto = 'agora mesmo';
  else if (minutos < 60) texto = `há ${minutos}min`;
  else if (horas < 24)   texto = `há ${horas}h`;
  else                   texto = `há ${dias} dia${dias !== 1 ? 's' : ''}`;

  el.textContent = texto;
}

/* ══════════════════════════════════════════════
   RENDER — SPARKLINES
══════════════════════════════════════════════ */
function _renderSparklines(stats) {
  if (!stats.ultimos7?.length) return;

  const pontos = stats.ultimos7.map(d => d.tempoTotal);
  const maxVal = Math.max(...pontos, 1);

  function _sparkPath(vals) {
    return vals.map((v, i) => {
      const x = Math.round((i / (vals.length - 1)) * 80);
      const y = Math.round(28 - (v / maxVal) * 24);
      return `${x},${y}`;
    }).join(' ');
  }

  const sparkEls = document.querySelectorAll('.stat-sparkline[data-real]');
  sparkEls.forEach(svg => {
    const poly = svg.querySelector('polyline');
    if (poly) poly.setAttribute('points', _sparkPath(pontos));
  });
}

/* ══════════════════════════════════════════════
   RENDER — EVOLUÇÃO DIÁRIA (30 dias)
══════════════════════════════════════════════ */
function _renderEvolucaoDiaria(stats) {
  const wrap = document.getElementById('evolucao-30dias');
  if (!wrap) return;

  wrap.innerHTML = '';

  const hoje = new Date();
  const dias  = [];
  for (let i = 29; i >= 0; i--) {
    const d   = new Date(hoje);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    dias.push({
      key,
      dia:        d.getDate(),
      tempoTotal: stats.historico?.[key]?.tempoTotal ?? 0,
    });
  }

  const maxTempo = Math.max(...dias.map(d => d.tempoTotal), 1);

  dias.forEach(d => {
    const col   = document.createElement('div');
    col.className = 'evo-col';
    col.title   = `${d.key} · ${formatTimeHuman(d.tempoTotal)}`;

    const bar       = document.createElement('div');
    bar.className   = 'evo-bar';
    const alturaPct = d.tempoTotal > 0 ? Math.max(6, (d.tempoTotal / maxTempo) * 100) : 0;
    bar.style.height = alturaPct + '%';
    if (d.tempoTotal === 0) bar.classList.add('evo-bar-vazia');

    /* Destaca o melhor dia */
    if (d.key === stats.melhorDia?.key) bar.classList.add('evo-bar-melhor');

    col.appendChild(bar);
    wrap.appendChild(col);
  });
}

/* ══════════════════════════════════════════════
   RENDER — NAVIGATION ANALYTICS
══════════════════════════════════════════════ */
function _renderNavegacaoAoVivo(stats) {
  if (!stats) return;
  _renderPaginasMaisAcessadas(stats.navPages);
  _renderFluxoNavegacao(stats.navSequence);
  _renderHeatmapHorario(stats.navHourHeatmap);
  _renderDispositivo(stats.navDeviceType);
  _renderQuizEvents(stats.quizEvents);
}

function _renderNavegacaoPersistida(sessao) {
  if (!sessao) return;
  _renderPaginasMaisAcessadas(sessao.pages);
  _renderFluxoNavegacao(sessao.navigation);
  _renderHeatmapHorario(sessao.hourHeatmap);
  _renderDispositivo(sessao.deviceType);
  _renderQuizEvents(sessao.quizEvents);
}

function _renderNavegacaoVazia() {
  _renderPaginasMaisAcessadas(null);
  _renderFluxoNavegacao(null);
  _renderHeatmapHorario(null);
  _renderDispositivo(null);
  _renderQuizEvents(null);
}

function _renderPaginasMaisAcessadas(pages) {
  const wrap = document.getElementById('nav-paginas-lista');
  if (!wrap) return;

  wrap.innerHTML = '';

  const entradas = pages && typeof pages === 'object' ? Object.entries(pages) : [];

  if (!entradas.length) {
    const vazio       = document.createElement('div');
    vazio.className   = 'nav-empty';
    vazio.textContent = 'Sem dados de navegação registrados ainda.';
    wrap.appendChild(vazio);
    return;
  }

  entradas
    .sort((a, b) => (b[1]?.time ?? 0) - (a[1]?.time ?? 0))
    .slice(0, 6)
    .forEach(([pathname, info]) => {
      const item = document.createElement('div');
      item.className = 'nav-page-item';

      const nome       = document.createElement('span');
      nome.className   = 'nav-page-name';
      nome.textContent = pathname;

      const meta       = document.createElement('span');
      meta.className   = 'nav-page-meta';
      const tempo      = formatTimeHuman(info?.time ?? 0);
      const visits     = info?.visits ?? 0;
      meta.textContent = `${tempo} · ${visits} visita${visits !== 1 ? 's' : ''}`;

      item.appendChild(nome);
      item.appendChild(meta);
      wrap.appendChild(item);
    });
}

function _renderFluxoNavegacao(navigation) {
  const wrap = document.getElementById('nav-fluxo');
  if (!wrap) return;

  wrap.innerHTML = '';

  const sequencia = Array.isArray(navigation) ? navigation : [];

  if (!sequencia.length) {
    const vazio       = document.createElement('div');
    vazio.className   = 'nav-empty';
    vazio.textContent = 'Sem sequência de navegação registrada ainda.';
    wrap.appendChild(vazio);
    return;
  }

  sequencia.slice(-12).forEach((pathname, idx, arr) => {
    const step       = document.createElement('span');
    step.className   = 'nav-flow-step';
    step.textContent = pathname;
    wrap.appendChild(step);

    if (idx < arr.length - 1) {
      const seta       = document.createElement('span');
      seta.className   = 'nav-flow-arrow';
      seta.textContent = '→';
      wrap.appendChild(seta);
    }
  });
}

function _renderHeatmapHorario(hourHeatmap) {
  const wrap = document.getElementById('nav-heatmap');
  if (!wrap) return;

  wrap.innerHTML = '';

  const mapa    = hourHeatmap && typeof hourHeatmap === 'object' ? hourHeatmap : {};
  const valores = Object.values(mapa);
  const maxVal  = Math.max(...valores, 1);
  const temDados = valores.length > 0;

  for (let h = 0; h < 24; h++) {
    const count = mapa[String(h)] ?? 0;
    const col   = document.createElement('div');
    col.className = 'heatmap-col';
    col.title   = `${h}h · ${count} acesso${count !== 1 ? 's' : ''}`;

    const bar     = document.createElement('div');
    bar.className = 'heatmap-bar';
    bar.style.height = (count > 0 ? Math.max(8, (count / maxVal) * 100) : 0) + '%';

    col.appendChild(bar);
    wrap.appendChild(col);
  }

  const labelEl = document.getElementById('nav-horario-pico');
  if (labelEl) {
    if (!temDados) {
      labelEl.textContent = '—';
    } else {
      const horaPico = Object.entries(mapa).sort((a, b) => b[1] - a[1])[0]?.[0];
      labelEl.textContent = horaPico !== undefined
        ? `${horaPico}h–${Number(horaPico) + 1}h`
        : '—';
    }
  }
}

function _renderDispositivo(deviceType) {
  const el = document.getElementById('nav-device-tipo');
  if (!el) return;
  if (deviceType === 'mobile')  el.textContent = '📱 Mobile';
  else if (deviceType === 'desktop') el.textContent = '🖥️ Desktop';
  else el.textContent = '—';
}

function _renderQuizEvents(quizEvents) {
  const wrap   = document.getElementById('quiz-eventos-lista');
  const count  = document.getElementById('quiz-eventos-count');
  const eventos = Array.isArray(quizEvents) ? quizEvents : [];

  if (count) count.textContent = eventos.length;

  if (!wrap) return;
  wrap.innerHTML = '';

  if (!eventos.length) {
    const vazio       = document.createElement('div');
    vazio.className   = 'nav-empty';
    vazio.textContent = 'Nenhum quiz registrado nesta sessão.';
    wrap.appendChild(vazio);
    return;
  }

  eventos.slice(-8).reverse().forEach(ev => {
    const item = document.createElement('div');
    item.className = 'quiz-event-item';

    const nome       = document.createElement('span');
    nome.className   = 'quiz-event-name';
    nome.textContent = [ev.disc, ev.modo].filter(Boolean).join(' / ') || 'Quiz';

    const taxa       = document.createElement('span');
    taxa.className   = 'quiz-event-taxa';
    const pct        = typeof ev.taxaAcerto === 'number' ? Math.round(ev.taxaAcerto * 100) : 0;
    taxa.textContent = `${ev.acertos ?? 0}/${ev.totalQuestoes ?? 0} · ${pct}%`;

    item.appendChild(nome);
    item.appendChild(taxa);
    wrap.appendChild(item);
  });
}

/* ══════════════════════════════════════════════
   RENDER — ESTADO VAZIO
══════════════════════════════════════════════ */
function _renderMetricasVazio() {
  [
    'stat-tempo-hoje', 'stat-streak', 'stat-sessoes',
    'stat-tempo-total', 'stat-media-sessao',
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '—';
  });

  [
    'perf-media-diaria', 'perf-dias-ativos',
    'perf-melhor-dia', 'perf-streak',
    'consistencia-frequencia', 'consistencia-regularidade',
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '—';
  });

  _renderNavegacaoVazia();

  const wrap = document.getElementById('evolucao-30dias');
  if (wrap) wrap.innerHTML = '';

  const wrapAcum = document.getElementById('crescimento-acumulado');
  if (wrapAcum) wrapAcum.innerHTML = '';
}

/* ══════════════════════════════════════════════
   PROGRESS BAR ANIMATION ON LOAD
══════════════════════════════════════════════ */
function _initProgressBarAnimation() {
  document.querySelectorAll('.prog-fill').forEach(function (bar) {
    const targetWidth = bar.style.width;
    bar.style.width   = '0%';
    setTimeout(function () { bar.style.width = targetWidth; }, 200);
  });
}

/* ══════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════ */
async function _bootPagina() {
  setPagina('DASHBOARD');
  Sound.init();
  installAudioRecovery({ Sound, audio });

  injetarLogo({
    destino:  '#header-logo-wrap',
    tamanho:  32,
    layout:   'stacked',
    srcBase:  '../../shared/img/logo.png',
    linkHref: '../../index.html',
  });

  try {
    const mod       = await import('../../shared/js/themes/cores.js');
    State.DISC_CORES = mod.DISC_CORES ?? {};
  } catch (_) {}

  _resolverContexto();
  _renderSemestreSelector();
  _renderContexto();
  _renderDisciplinas();
  _renderSidebarDisciplinas();
  _renderGreeting();
  _renderUsuario();

  _initSessionTimer();
  _initProgressBarAnimation();

  await _carregarMetricasReais();

  document.addEventListener('nexus:loginSuccess', async () => {
    _renderUsuario();
    await _carregarMetricasReais();
    /* _carregarIntelligence já é chamado dentro de _carregarMetricasReais,
       portanto não é necessário chamá-lo novamente aqui. */
  });

  document.addEventListener('nexus:logout', () => {
    _renderUsuario();
    _renderMetricasVazio();
    /* Limpa o relatório de inteligência ao fazer logout. */
    State.intelligence = null;
    console.log('[dashboard] nexus:logout — State.intelligence limpo.');
  });

  document.addEventListener('nexus:semestre-changed', e => {
    const novoSemestre = e?.detail?.semestre;
    if (novoSemestre && novoSemestre !== State.semestre) {
      _trocarSemestre(novoSemestre);
      const sel = document.getElementById('semestre-select');
      if (sel) sel.value = novoSemestre;
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await _bootPagina();
});