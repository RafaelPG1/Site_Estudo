/* =============================================
   NEXUS STUDY — dashboard\js\dashboard.js
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

   ─────────────────────────────────────────────
   CAMADA 5 — Fase 1.6 (organização — split de arquivos)
   ─────────────────────────────────────────────
   - Este arquivo (dashboard.js) passou a conter
     SOMENTE bootstrap, listeners, navegação de UI
     (semestre/disciplinas/sidebar), greeting/usuário,
     session timer ao vivo e o fluxo principal de boot.
   - State, _carregarIntelligence e _carregarMetricasReais
     foram movidos para dashboard_data.js.
   - renderDashboardIntelligence e os 6 renderizadores da
     Camada 5 foram movidos para dashboard_render.js.
   - Nenhuma lógica foi alterada nesta reorganização —
     apenas a localização do código.

   ─────────────────────────────────────────────
   v10.1 — ALINHAMENTO DE COPY COM SESSION-TRACKER IDLE-AWARE
   ─────────────────────────────────────────────
   session-tracker.js (v10) passou a exigir atividade real
   (mouse/scroll/teclado) para considerar a sessão "rodando"
   — ver campo stats.isIdle, novo em getStats(). O texto
   dinâmico do card de sessão (.session-sub) foi ajustado
   para refletir isso:
     ✔ novo estado "Inativo — sem interação", exibido quando
       stats.isIdle é true (aba em foco, mas sem atividade
       real há mais de 15s)
     ✗ "Sessão ativa" trocado por "Engajamento ativo", para
       usar a mesma linguagem do restante do dashboard
   Nenhuma outra lógica deste arquivo foi alterada — apenas
   a função _atualizar() dentro de _initSessionTimer().

   ─────────────────────────────────────────────
   MÓDULO CHECKLIST — NAVEGAÇÃO SPA (novo)
   ─────────────────────────────────────────────
   Adicionado o módulo Checklist como uma segunda "view" dentro
   de .content, alternada via display — sem nenhum reload de
   página, sem novo checklist.html. Sidebar, cabeçalho e o
   seletor de semestre nunca são recriados/tocados.

   Este arquivo passou a conhecer apenas 4 coisas do módulo
   Checklist (import de dashboard/js/checklist/checklist.js):
     - abrirChecklist(containerEl)   → monta a view
     - fecharChecklist()             → limpa flag de estado aberto
     - checklistEstaAberta()         → usado ao trocar de semestre,
                                        para saber se precisa recarregar
   Toda a lógica de dados/renderização do Checklist vive isolada
   nesse módulo — dashboard.js apenas alterna a view e delega.

   Novo:
     - _setNavAtivo(id) — helper de UI (marca item ativo na sidebar)
     - _mostrarViewChecklist() / _mostrarViewDashboard() — troca de view
     - wiring de clique em #nav-home, #nav-checklist, #tool-btn-checklist
     - _trocarSemestre() passou a recarregar o Checklist quando a
       view já está aberta no momento da troca de semestre.
   Nenhuma outra lógica pré-existente deste arquivo foi alterada.
   ============================================= */

import {
  setSemestre,
  getDisciplinaAtual,
  getDisciplinasDeSemestre,
  setPagina,
  SEMESTRES,
  getUsuario,
} from '../../../src/global.js';

import { criarSemestreSelect } from '../../../shared/js/utils/dom.js';

import { resolverSemestreDeURL } from '../../../shared/js/utils/url.js';
import { aplicarCoresDisciplina } from '../../../shared/js/themes/theme.js';
import { injetarLogo } from '../../../shared/js/utils/logo.js';

// no topo do arquivo
import { perfLog } from '../../../src/perf_logger.js';

// primeira linha do bootstrap/init do dashboard
const __nexusDashboardT0 = performance.now();

// última linha, depois que _carregarMetricasReais() (e o que mais rodar no boot) terminar
perfLog('Dashboard', 'Dashboard Total', performance.now() - __nexusDashboardT0);
/* ── Áudio ── */
import {
  Sound,
  audio,
  installAudioRecovery,
  playSound,
} from '../../../shared/js/audio/audio-api.js';

/* ── Session Tracker ── */
import {
  subscribe     as sessionSubscribe,
  formatTime    as sessionFormatTime,
  getStats      as sessionGetStats,
} from '../../../src/session-tracker.js';

/* ── Dados (Camada 5 — Fase 1.6: extraído para dashboard_data.js) ── */
import {
  State,
  _carregarMetricasReais,
  _renderMetricasVazio,
  _renderNavegacaoAoVivo,
} from './dashboard_data.js';

/* ── Checklist (módulo desacoplado — ver dashboard/js/checklist/) ── */
import {
  abrirChecklist,
  fecharChecklist,
  checklistEstaAberta,
} from './checklist/checklist.js';

/* ── Tarefas (módulo desacoplado — ver dashboard/js/tarefa/) ── */
import {
  abrirTarefas,
  fecharTarefas,
  tarefasEstaAberta,
} from './tarefa/tarefa.js';
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
  /* Usa o mesmo componente visual do Quiz (criarSemestreSelect de dom.js).
     O CSS vem de semestre-picker.css, carregado no HTML do Dashboard.
     Não cria <select> nativo — monta .sp-wrap > .sp-trigger + .sp-panel. */
  criarSemestreSelect('semestre-selector-wrap', novoSemestre => {
    playSound('select', 'perfil');
    _trocarSemestre(novoSemestre);
  }, State.semestre);
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

  /* Recarrega todas as métricas usando o novo semestre como filtro.
     _carregarMetricasReais lê State.semestre internamente, por isso
     basta chamá-la após a atualização do State acima. */
  _carregarMetricasReais().catch(() => {});

  /* Checklist — módulo desacoplado (ver dashboard/js/checklist/).
     Se a view do Checklist estiver aberta no momento da troca de
     semestre, ela precisa ser recarregada com o novo semestre;
     caso contrário continuaria mostrando os dados do semestre
     anterior até o usuário navegar para fora e voltar. Se a view
     não estiver aberta, checklist.js resolve o semestre correto
     sozinho (via State.semestre) na próxima vez que for aberta. */
  if (checklistEstaAberta()) {
    const viewChecklist = document.getElementById('view-checklist');
    if (viewChecklist) abrirChecklist(viewChecklist).catch(() => {});
  }
}

/* ══════════════════════════════════════════════
   RENDER — elementos dinâmicos
══════════════════════════════════════════════ */
function _renderContexto() {
  const semEl = document.getElementById('meta-semestre');
  if (semEl) semEl.textContent = State.semestre ? `Semestre · ${State.semestre}` : '—';
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
   NAVEGAÇÃO SPA — Dashboard ↔ Checklist
   ─────────────────────────────────────────────
   Sidebar, cabeçalho (.topbar) e o seletor de semestre vivem
   FORA de #view-dashboard-home / #view-checklist e nunca são
   recriados ao alternar de view. Apenas o conteúdo principal
   é trocado, via display — nenhum reload de página, nenhuma
   navegação de URL.

   _setNavAtivo() cuida apenas do estado visual (.active) dos
   itens da sidebar — mesma classe já usada estaticamente no
   HTML original ("Dashboard" nasce com .active).
══════════════════════════════════════════════ */
function _setNavAtivo(idAtivo) {
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => {
    el.classList.toggle('active', el.id === idAtivo);
  });
}

function _esconderTodasViews() {
  document.getElementById('view-dashboard-home')?.style.setProperty('display', 'none');
  document.getElementById('view-checklist')?.style.setProperty('display', 'none');
  document.getElementById('view-tarefas')?.style.setProperty('display', 'none');
}

async function _mostrarViewChecklist() {
  const view = document.getElementById('view-checklist');
  if (!view) return;
  _esconderTodasViews();
  view.style.display = '';
  _setNavAtivo('nav-checklist');
  fecharTarefas();
  await abrirChecklist(view);
}

async function _mostrarViewTarefas() {
  const view = document.getElementById('view-tarefas');
  if (!view) return;
  _esconderTodasViews();
  view.style.display = '';
  _setNavAtivo('nav-tarefas');
  fecharChecklist();
  await abrirTarefas(view);
}

function _mostrarViewDashboard() {
  const home = document.getElementById('view-dashboard-home');
  if (!home) return;
  _esconderTodasViews();
  home.style.display = '';
  _setNavAtivo('nav-home');
  fecharChecklist();
  fecharTarefas();
}
function _initNavegacaoSpa() {
  document.getElementById('nav-home')?.addEventListener('click', (e) => {
    e.preventDefault();
    _mostrarViewDashboard();
  });

  document.getElementById('nav-checklist')?.addEventListener('click', (e) => {
    e.preventDefault();
    _mostrarViewChecklist();
  });

  /* Botão "Checklist" na grade de Ferramentas Pessoais — mesmo
     destino da navegação da sidebar, apenas outro ponto de entrada
     para a mesma view. */
  document.getElementById('tool-btn-checklist')?.addEventListener('click', () => {
    _mostrarViewChecklist();
  });

  document.getElementById('nav-tarefas')?.addEventListener('click', (e) => {
  e.preventDefault();
  _mostrarViewTarefas();
});

document.getElementById('tool-btn-tarefas')?.addEventListener('click', () => {
  _mostrarViewTarefas();
});
}

/* ══════════════════════════════════════════════
   SESSION TIMER — ao vivo
   Exibe o tempo ativo desta aba (ou pausa se não
   for a aba líder).

   v10.1 — agora também distingue "inativo por falta de
   interação" (stats.isIdle) de "em segundo plano"
   (aba sem lock/visibilidade). São causas diferentes de
   a contagem estar parada, então merecem textos diferentes
   em vez de caírem no mesmo rótulo genérico.
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
      } else if (stats.initialized && stats.isIdle) {
        /* v10.1 — session-tracker.js é idle-aware: activeSeconds só
           avança com interação real (mouse/scroll/teclado). Quando
           isIdle é true, o timer está pausado por ausência de
           atividade — cenário diferente de "aba em segundo plano"
           (tratado no branch abaixo), por isso ganha texto próprio. */
        subEl.textContent = 'Inativo — sem interação';
      } else if (!stats.isRunning && stats.initialized) {
        subEl.textContent = 'Aba em segundo plano';
      } else {
        subEl.textContent = 'Engajamento ativo';
      }
    }

    _renderNavegacaoAoVivo(stats);
  }

  _atualizar(sessionGetStats());
  sessionSubscribe(_atualizar);
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
    srcBase:  '../../../shared/img/logo.png',
    linkHref: '../../../index.html',
  });

  try {
    const mod       = await import('../../../shared/js/themes/cores.js');
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
  _initTooltipPositioning();
  _initNavegacaoSpa();

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
      /* criarSemestreSelect gerencia seu próprio estado visual —
         não há <select> nativo para sincronizar. */
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await _bootPagina();
});

/* ══════════════════════════════════════════════
   TOOLTIP — posicionamento dinâmico via fixed
   Os botões ⓘ usam position:fixed no ::after para
   nunca serem cortados por overflow:hidden dos
   cards. Como fixed não se ancora ao pai sozinho,
   calculamos as coordenadas no hover/focus.
══════════════════════════════════════════════ */
function _initTooltipPositioning() {
  document.body.addEventListener('mouseover', _posicionarTooltip, true);
  document.body.addEventListener('focusin', _posicionarTooltip, true);
}

function _posicionarTooltip(e) {
  const btn = e.target.closest('.empty-state-info-btn');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  btn.style.setProperty('--tooltip-left', `${rect.left + rect.width / 2}px`);
  btn.style.setProperty('--tooltip-top', `${rect.top}px`);
}