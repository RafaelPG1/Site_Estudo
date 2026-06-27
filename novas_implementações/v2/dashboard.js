/* =============================================
   NEXUS STUDY — novas_implementações\v2\dashboard.js
    proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar
   Dashboard: visão geral, ferramentas pessoais e estatísticas.
   =============================================

   v3 — Session Tracker real (Firebase)
   ─────────────────────────────────────────────
   MUDANÇAS v2.1 → v3
   ─────────────────────────────────────────────
   • _initSessionTimer() substituído por integração real com
     session-tracker.js. O timer da sidebar agora exibe o tempo
     ativo da sessão atual vindo do Firebase, atualizado a cada
     segundo via subscribe().

   • Novo _carregarMetricasReais(): lê estatísticas derivadas das
     sessões registradas no Firestore via carregarEstatisticas() e
     preenche os stat-cards, perf-items e session-sub com dados
     reais do usuário autenticado.

   • Fallback gracioso: quando o usuário não está logado ou não há
     dados, os cards exibem '—' sem quebrar o layout.

   • A sessão começa automaticamente ao importar session-tracker.js
     e reage ao nexus:loginSuccess / nexus:logout globais.

   MANTIDO (inalterado de v2.1):
   ─────────────────────────────────────────────
   BUG 1 — fechamento correto de _trocarSemestre.
   BUG 2 — wrapper _aplicarCoresSeDefined() para disciplinas sem cores.
   BUG 3 — _renderGreeting declarada.
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

/* ══════════════════════════════════════════════
   ESTADO
══════════════════════════════════════════════ */
const State = {
  semestre:    null,
  disciplinas: [],
  discAtiva:   null,
  DISC_CORES:  {},
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

  if (disc) {
    _aplicarCoresSeDefined(disc.arquivo);
  }
}

/* ══════════════════════════════════════════════
   SELETOR DE SEMESTRE
══════════════════════════════════════════════ */
function _renderSemestreSelector() {
  const wrap = document.getElementById('semestre-selector-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';

  const select = document.createElement('select');
  select.className = 'semestre-select';
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

  if (State.discAtiva) {
    _aplicarCoresSeDefined(State.discAtiva.arquivo);
  }

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
    const vazio = document.createElement('div');
    vazio.className = 'disc-empty';
    vazio.textContent = 'Nenhuma disciplina neste semestre.';
    grid.appendChild(vazio);
    return;
  }

  State.disciplinas.forEach(disc => {
    const cor = _corDaDisciplina(disc);

    const item = document.createElement('div');
    item.className = 'disc-item';
    item.dataset.discId = disc.id;

    const colorBar = document.createElement('div');
    colorBar.className = 'disc-color';
    if (cor) colorBar.style.background = cor;

    const nome = document.createElement('div');
    nome.className = 'disc-name';
    nome.textContent = disc.nome;

    const sub = document.createElement('div');
    sub.className = 'disc-sessions';
    sub.textContent = `${disc.emoji ? disc.emoji + ' ' : ''}${disc.apelido ?? disc.id}`;

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
    const a = document.createElement('a');
    a.className = 'nav-item';
    a.href = '#';

    const icon = document.createElement('span');
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
  const el = document.getElementById('page-user-name');
  if (!el) return;
  const usuario = getUsuario?.();
  const nome    = usuario?.nome || usuario?.displayName || '';
  el.innerHTML = nome ? `, <span class="accent">${_escapeHtml(nome.split(' ')[0])}</span>` : '';
}

function _escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/* ══════════════════════════════════════════════
   SESSION TIMER — integrado com session-tracker.js
   Atualiza a sidebar a cada segundo com dados reais.
   O tempo exibido é o tempo ATIVO da sessão atual,
   não um contador fake a partir de um valor fixo.
══════════════════════════════════════════════ */
function _initSessionTimer() {
  const timeEl = document.querySelector('.session-time');
  const subEl  = document.querySelector('.session-sub');

  if (!timeEl) return;

  // Atualiza o display imediatamente com o estado atual
  function _atualizar(stats) {
    if (!stats) return;
    timeEl.textContent = sessionFormatTime(stats.activeSeconds);

    // Sub-label: mostra semestre e disciplina ativa, ou status de pausa
    if (subEl) {
      if (!stats.isRunning && stats.initialized) {
        subEl.textContent = 'Aba em segundo plano';
      } else if (State.discAtiva) {
        subEl.textContent = `${State.discAtiva.apelido ?? State.discAtiva.nome} · ${State.semestre ?? ''}`;
      } else if (State.semestre) {
        subEl.textContent = State.semestre;
      } else {
        subEl.textContent = 'Sessão ativa';
      }
    }
  }

  // Atualização inicial
  _atualizar(sessionGetStats());

  // Subscribe para updates a cada segundo
  sessionSubscribe(_atualizar);
}

/* ══════════════════════════════════════════════
   MÉTRICAS REAIS DO FIREBASE
   Carrega estatísticas de sessão e preenche os
   stat-cards com dados reais do usuário.
══════════════════════════════════════════════ */
async function _carregarMetricasReais() {
  const usuario = getUsuario?.();
  if (!usuario?.uid) {
    _renderMetricasVazio();
    return;
  }

  try {
    const stats = await carregarEstatisticas(usuario.uid);
    if (!stats) {
      _renderMetricasVazio();
      return;
    }

    _renderStatCards(stats);
    _renderPerfItems(stats);
    _renderUltimoAcesso(stats);
    _renderSparklines(stats);

  } catch (err) {
    console.error('[dashboard] _carregarMetricasReais:', err);
    _renderMetricasVazio();
  }
}

/**
 * Preenche os 4 stat-cards principais com dados reais.
 * Os cards usam IDs adicionados no HTML (data-stat-*) para
 * localização precisa sem depender de posição no DOM.
 */
function _renderStatCards(stats) {
  // Card: Tempo total hoje
  const elTempoHoje = document.getElementById('stat-tempo-hoje');
  if (elTempoHoje) {
    elTempoHoje.textContent = formatTimeHuman(stats.tempoHoje);
  }

  // Card: Sequência de dias
  const elStreak = document.getElementById('stat-streak');
  if (elStreak) {
    elStreak.textContent = stats.streak;
  }

  // Card: Total de sessões
  const elSessoes = document.getElementById('stat-sessoes');
  if (elSessoes) {
    elSessoes.textContent = stats.totalSessoes;
  }

  // Card: Tempo total acumulado
  const elTotal = document.getElementById('stat-tempo-total');
  if (elTotal) {
    elTotal.textContent = formatTimeHuman(stats.tempoTotalGeral);
  }

  // Deltas — comparação vs ontem
  const ontemKey = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  })();
  const tempoOntem = stats.historico?.[ontemKey]?.tempoTotal ?? 0;

  const elDeltaHoje = document.getElementById('stat-delta-tempo');
  if (elDeltaHoje && tempoOntem > 0) {
    const diff = stats.tempoHoje - tempoOntem;
    const sinal = diff >= 0 ? '+' : '';
    elDeltaHoje.textContent = `${sinal}${formatTimeHuman(Math.abs(diff))} vs ontem`;
    elDeltaHoje.closest('.stat-delta')?.classList.toggle('delta-up', diff >= 0);
    elDeltaHoje.closest('.stat-delta')?.classList.toggle('delta-down', diff < 0);
  }
}

function _renderPerfItems(stats) {
  // Média diária de tempo (últimos 7 dias)
  const mediaDiaria = document.getElementById('perf-media-diaria');
  if (mediaDiaria && stats.ultimos7?.length) {
    const diasAtivos = stats.ultimos7.filter(d => d.tempoTotal > 0);
    const media = diasAtivos.length
      ? Math.floor(diasAtivos.reduce((a, b) => a + b.tempoTotal, 0) / diasAtivos.length)
      : 0;
    mediaDiaria.textContent = formatTimeHuman(media);

    // Barra de progresso: 2h = 100%
    const bar = document.getElementById('perf-bar-media');
    if (bar) bar.style.width = Math.min(100, (media / 7200) * 100) + '%';
  }

  // Dias ativos nos últimos 7
  const diasAtivos7 = document.getElementById('perf-dias-ativos');
  if (diasAtivos7 && stats.ultimos7?.length) {
    const count = stats.ultimos7.filter(d => d.tempoTotal > 0).length;
    diasAtivos7.textContent = count;
    const bar = document.getElementById('perf-bar-dias');
    if (bar) bar.style.width = (count / 7 * 100) + '%';
  }

  // Total de sessões
  const totalSessoesEl = document.getElementById('perf-total-sessoes');
  if (totalSessoesEl) {
    totalSessoesEl.textContent = stats.totalSessoes;
    const bar = document.getElementById('perf-bar-sessoes');
    if (bar) bar.style.width = Math.min(100, (stats.totalSessoes / 100) * 100) + '%';
  }

  // Sequência atual
  const streakEl = document.getElementById('perf-streak');
  if (streakEl) {
    streakEl.textContent = `${stats.streak} dia${stats.streak !== 1 ? 's' : ''}`;
    const bar = document.getElementById('perf-bar-streak');
    if (bar) bar.style.width = Math.min(100, (stats.streak / 30) * 100) + '%';
  }
}

function _renderUltimoAcesso(stats) {
  const el = document.getElementById('stat-ultimo-acesso');
  if (!el || !stats.ultimaAtividade) return;

  const agora   = Date.now();
  const diff    = agora - stats.ultimaAtividade;
  const minutos = Math.floor(diff / 60000);
  const horas   = Math.floor(diff / 3600000);
  const dias    = Math.floor(diff / 86400000);

  let texto;
  if (minutos < 1)      texto = 'agora mesmo';
  else if (minutos < 60) texto = `há ${minutos}min`;
  else if (horas < 24)   texto = `há ${horas}h`;
  else                   texto = `há ${dias} dia${dias !== 1 ? 's' : ''}`;

  el.textContent = texto;
}

/**
 * Atualiza os sparklines SVG dos stat-cards com dados reais
 * dos últimos 7 dias de tempo de estudo.
 */
function _renderSparklines(stats) {
  if (!stats.ultimos7?.length) return;

  const pontos = stats.ultimos7.map(d => d.tempoTotal);
  const maxVal = Math.max(...pontos, 1);

  // Gera coordenadas SVG normalizadas (viewBox 0 0 80 32)
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

function _renderMetricasVazio() {
  // Preenche com '—' quando não há dados disponíveis
  ['stat-tempo-hoje', 'stat-streak', 'stat-sessoes', 'stat-tempo-total'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '—';
  });
  ['perf-media-diaria', 'perf-dias-ativos', 'perf-total-sessoes', 'perf-streak'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '—';
  });
}

/* ══════════════════════════════════════════════
   PROGRESS BAR ANIMATION ON LOAD
══════════════════════════════════════════════ */
function _initProgressBarAnimation() {
  document.querySelectorAll('.prog-fill').forEach(function (bar) {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';
    setTimeout(function () {
      bar.style.width = targetWidth;
    }, 200);
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
    const mod = await import('../../shared/js/themes/cores.js');
    State.DISC_CORES = mod.DISC_CORES ?? {};
  } catch (_) {}

  _resolverContexto();
  _renderSemestreSelector();
  _renderContexto();
  _renderDisciplinas();
  _renderSidebarDisciplinas();
  _renderGreeting();
  _renderUsuario();

  // Session timer real — conectado ao session-tracker.js
  _initSessionTimer();
  _initProgressBarAnimation();

  // Métricas reais do Firebase
  await _carregarMetricasReais();

  // Re-carrega métricas quando o usuário fizer login após a página já aberta
  document.addEventListener('nexus:loginSuccess', async () => {
    _renderUsuario();
    await _carregarMetricasReais();
  });

  document.addEventListener('nexus:logout', () => {
    _renderUsuario();
    _renderMetricasVazio();
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