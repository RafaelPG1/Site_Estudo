/* =============================================
   NEXUS STUDY — dashboard\js\dashboard_data.js
    proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar
   Dashboard: dados — State, carregamento de
   métricas reais (session-tracker) e carregamento
   da inteligência (quiz_intelligence).
   =============================================

   ─────────────────────────────────────────────
   ORIGEM
   ─────────────────────────────────────────────
   Extraído de dashboard.js (v5) na reorganização
   da Camada 5 — Fase 1.6 (split de arquivos).
   Nenhuma lógica foi alterada nesta extração:
   apenas movida para este módulo dedicado a dados.

   Responsabilidade deste arquivo:
     ✔ State (fonte única de verdade em memória)
     ✔ _carregarIntelligence(uid) — ponte com
       window.NexusQuizIntelligence
     ✔ _carregarMetricasReais() — leitura de
       session-tracker + Firestore (fallback)
     ✔ Renderização das métricas "reais" de sessão
       (tempo global, tendência de uso, evolução
       diária, navegação, etc.) — mantidas aqui
       porque fazem parte do mesmo fluxo de
       carregamento de dados de sessão, e não dos
       cards inteligentes da Camada 5.

   Não pertence a este arquivo:
     ✗ renderDashboardIntelligence e os 6
       renderizadores da Camada 5 (Score, Trend,
       Comparison, Weaknesses, Prediction,
       LearningCurve) — ver dashboard_render.js
     ✗ bootstrap / listeners de evento — ver
       dashboard.js
   ============================================= */

import { getUsuario } from '../../../src/global.js';

/* ── Session Tracker ── */
import {
  formatTimeHuman,
  carregarEstatisticas,
  getStats      as sessionGetStats,
} from '../../../src/session-tracker.js';

/* ── Firestore (leitura da última sessão persistida — fallback) ── */
import { getDb } from '../../../src/firebase.js';
import {
  collection, query, orderBy, limit, getDocs,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { renderDashboardIntelligence } from './dashboard_render.js';

/* ══════════════════════════════════════════════
   ESTADO
══════════════════════════════════════════════ */
export const State = {
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

export async function _carregarIntelligence(uid) {
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
   METRICAS REAIS DO FIREBASE
══════════════════════════════════════════════ */
export async function _carregarMetricasReais() {
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

/* Exportadas para uso no boot (dashboard.js):
   - _renderMetricasVazio: listener de logout
   - _renderNavegacaoAoVivo: callback do session timer ao vivo (_initSessionTimer) */
export { _renderMetricasVazio, _renderNavegacaoAoVivo };