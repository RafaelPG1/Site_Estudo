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
   MÉTRICAS REAIS DO FIREBASE
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