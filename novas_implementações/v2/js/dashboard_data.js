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
     ✗ renderDashboardIntelligence e os renderizadores
       da Camada 5 — ver dashboard_render.js
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
/* ══════════════════════════════════════════════
   NORMALIZAÇÃO SEMÂNTICA DE NAVEGAÇÃO
   ─────────────────────────────────────────────
   Camada exclusivamente de EXIBIÇÃO. Não altera
   tracking, não altera o que session-tracker.js
   grava (pathname puro, sem query string).

   Usada por _renderPaginasMaisAcessadas() e
   _renderFluxoNavegacao() — mesma função, para
   garantir que o mesmo pathname produza sempre
   o mesmo rótulo nas duas seções.

   LIMITAÇÃO CONHECIDA: session-tracker.js só
   registra location.pathname (sem query string).
   Por isso, ?disc= nunca está disponível para
   entradas do histórico — apenas State.discAtiva
   (estado atual em memória) pode complementar a
   disciplina, e somente quando o pathname exibido
   corresponde à área de disciplina ativa agora.
   Não é possível recuperar a disciplina de uma
   visita passada a outra disciplina.
══════════════════════════════════════════════ */

const ROTA_LABELS = {
  quiz:      'Quiz',
  resumo:    'Resumo',
  atlas:     'Atlas',
  index:     'Início',
  dashboard: 'Dashboard',
};

/* Áreas que fazem sentido combinar com disciplina ativa */
const ROTAS_COM_DISCIPLINA = new Set(['quiz', 'resumo', 'atlas']);

function _limparSegmento(segmento) {
  if (!segmento) return '';
  let s = segmento;
  try { s = decodeURIComponent(s); } catch (_) { /* já decodificado ou inválido */ }
  s = s.replace(/\.html?$/i, '');
  s = s.replace(/[-_]+/g, ' ').trim();
  if (!s) return '';
  return s
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function _extrairChaveDeRota(pathname) {
  if (typeof pathname !== 'string' || !pathname) return null;

  let limpo = pathname;
  try { limpo = decodeURIComponent(pathname); } catch (_) { /* mantém original */ }

  const segmentos = limpo.split('/').filter(Boolean);
  if (segmentos.length === 0) return { chave: 'index', ultimoSegmentoLimpo: 'Início' };

  for (const seg of segmentos) {
    const semExt = seg.replace(/\.html?$/i, '').toLowerCase();
    if (ROTA_LABELS[semExt]) {
      return { chave: semExt, ultimoSegmentoLimpo: null };
    }
  }

  const ultimo = segmentos[segmentos.length - 1];
  const semExtUltimo = ultimo.replace(/\.html?$/i, '').toLowerCase();
  if (semExtUltimo === '' || semExtUltimo === 'index') {
    return { chave: 'index', ultimoSegmentoLimpo: null };
  }

  return { chave: null, ultimoSegmentoLimpo: _limparSegmento(ultimo) };
}

/* Disciplina via query string (?disc=) — só funciona se o
   pathname recebido já contiver a query (não é o caso do
   session-tracker.js hoje, mas a função suporta se um dia
   passar a registrar). Mantido por completude da regra 4.3. */
function _extrairDisciplinaDaQuery(pathnameOuUrl) {
  try {
    const idx = pathnameOuUrl.indexOf('?');
    if (idx === -1) return null;
    const params = new URLSearchParams(pathnameOuUrl.slice(idx));
    const disc = params.get('disc');
    return disc ? _limparSegmento(disc) : null;
  } catch (_) {
    return null;
  }
}

function _resolverNomeDisciplinaAtiva() {
  const disc = State.discAtiva;
  if (!disc) return null;
  return disc.nome || disc.apelido || null;
}

/* Função única de normalização — ponto central exigido
   pela regra de consistência (seção 5).
   ─────────────────────────────────────────────
   REGRA (corrigida): a disciplina exibida vem EXCLUSIVAMENTE da
   query string presente na própria chave de navegação registrada
   (pathname + search, gravados juntos em __nexusPageEnter).
   NUNCA usa State.discAtiva, variáveis globais, ou qualquer dado
   em memória da aplicação no momento da exibição. Se a chave não
   tiver ?disc=, exibe apenas o label base (sem disciplina). */
function _normalizarRotaParaLabel(chaveNav) {
  const { chave, ultimoSegmentoLimpo } = _extrairChaveDeRota(chaveNav) || {};

  if (!chave) {
    return ultimoSegmentoLimpo || 'Página';
  }

  const labelBase = ROTA_LABELS[chave] ?? _limparSegmento(chave) ?? 'Página';

  if (!ROTAS_COM_DISCIPLINA.has(chave)) {
    return labelBase;
  }

  const disciplina = _extrairDisciplinaDaQuery(chaveNav);

  return disciplina ? `${labelBase} · ${disciplina}` : labelBase;
}


export const State = {
  semestre:    null,
  disciplinas: [],
  discAtiva:   null,
  DISC_CORES:  {},

  /* ── CAMADA 5 ──
     Resultado completo de relatorioEvolucao(uid) mais
     dados complementares (tentativasRecentes, conquistas).
     Populado por _carregarIntelligence(uid).
     Nunca modificado diretamente por nenhum renderizador.
     Nunca recalculado — apenas recebido da API pública. */
  intelligence: null,
};

/* ══════════════════════════════════════════════
   CAMADA 5 — INTEGRAÇÃO COM QUIZ INTELLIGENCE
   ─────────────────────────────────────────────
   Ponto único de carregamento da inteligência.

   REGRA: este bloco NUNCA calcula métricas de quiz.
   Apenas chama a API pública e armazena o resultado.

   O cálculo das conquistas usa SOMENTE campos já
   presentes no relatorio (taxaAcertoMediaPct,
   tendenciaDoAluno, scoreEvolutivo, fraquezasPorDisciplina)
   e dados de sessão já disponíveis em State/carregarEstatisticas
   — sem nenhum novo acesso ao Firebase ou ao quiz_intelligence.
   É transformação de dados, não derivação de métricas.
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

/* ── Derivação das conquistas ────────────────────────────────
   Recebe o relatorio completo + estatísticas de sessão
   (ambos já em memória — nenhuma chamada adicional).
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
function _calcularConquistas(relatorio, stats) {
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

  return {
    sequencia7:    streak >= 7,
    sequencia30:   streak >= 30,
    tentativas100: totalTentativas >= 100,
    questoesMil:   totalQuestoes >= 1000,
    scoreAvancado: nivelEstimado === 'avancado',
    emEvolucao:    tendenciaDir === 'melhorando',
    miraAfiada:    taxaMediaPct >= 75,
    maratonista:   melhorDiaTempo >= 18000,
    semQuedas:     !temQueda && totalTentativas > 0,
    sessoes50:     totalSessoes >= 50,
  };
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
    renderDashboardIntelligence(null);
    return null;
  }

  try {
    console.log('[dashboard] _carregarIntelligence: chamando relatorioEvolucao para', uid);

    /* Carrega o relatório principal + dados complementares em paralelo */
    const [relatorio, tentativasRecentes, totalQuestoes] = await Promise.all([
      intelligence.relatorioEvolucao(uid),
      intelligence.listarTentativasRecentes
        ? intelligence.listarTentativasRecentes(uid, 10)
        : Promise.resolve([]),
      intelligence.contarQuestoesRespondidas
        ? intelligence.contarQuestoesRespondidas(uid)
        : Promise.resolve(0),
    ]);

    /* Adiciona os dados complementares ao relatorio em memória.
       Não altera o que foi persistido no Firebase. */
    relatorio.tentativasRecentes = tentativasRecentes;
    relatorio.totalQuestoes      = totalQuestoes;

    /* Calcula conquistas usando o relatorio já populado e as
       estatísticas de sessão já carregadas pela _carregarMetricasReais.
       Se as stats não estiverem disponíveis neste momento, passa null
       e renderAchievements exibirá tudo como bloqueado. */
    const statsAtuais = await carregarEstatisticas(uid).catch(() => null);
    relatorio.conquistas = _calcularConquistas(relatorio, statsAtuais);

    State.intelligence = relatorio;

    console.group('[dashboard] State.intelligence — relatorio recebido');
    console.log('geradoEm:',             new Date(relatorio?.geradoEm).toLocaleTimeString());
    console.log('scoreEvolutivo:',       relatorio?.scoreEvolutivo);
    console.log('tendenciaDoAluno:',     relatorio?.tendenciaDoAluno);
    console.log('fraquezasPorDisc:',     relatorio?.fraquezasPorDisciplina?.length, 'disciplinas');
    console.log('curvaDeAprendizado:',   relatorio?.curvaDeAprendizado?.geral?.totalTentativas, 'tentativas gerais');
    console.log('previsaoSimples:',      relatorio?.previsaoSimples);
    console.log('comparacaoDePeriodos:', relatorio?.comparacaoDePeriodos);
    console.log('summaryPersistido:',    relatorio?.summaryPersistidoCamada3);
    console.log('tentativasRecentes:',   relatorio?.tentativasRecentes?.length, 'itens');
    console.log('totalQuestoes:',        relatorio?.totalQuestoes);
    console.log('conquistas:',           relatorio?.conquistas);
    console.groupEnd();

    renderDashboardIntelligence(relatorio);

    return relatorio;

  } catch (err) {
    console.error('[dashboard] _carregarIntelligence: erro ao chamar relatorioEvolucao:', err);
    State.intelligence = null;
    renderDashboardIntelligence(null);
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

    _renderTempoGlobal(stats);
    _renderTendencia(stats);
    _renderEvolucaoDiaria(stats);
    _renderCrescimentoAcumulado(stats);
    _renderConsistencia(stats);
    _renderSparklines(stats);
    _renderUltimoAcesso(stats);

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
══════════════════════════════════════════════ */
function _renderTempoGlobal(stats) {
  const elTotal = document.getElementById('stat-tempo-total');
  if (elTotal) elTotal.textContent = formatTimeHuman(stats.tempoTotalGeral);

  const elHoje = document.getElementById('stat-tempo-hoje');
  if (elHoje) elHoje.textContent = formatTimeHuman(stats.tempoHoje);

  const elStreak = document.getElementById('stat-streak');
  if (elStreak) elStreak.textContent = stats.streak;

  const elMedia = document.getElementById('stat-media-sessao');
  if (elMedia) {
    elMedia.textContent = stats.mediaSessao > 0
      ? formatTimeHuman(stats.mediaSessao)
      : '—';
  }

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

  const elSessoes = document.getElementById('stat-sessoes');
  if (elSessoes) elSessoes.textContent = stats.totalSessoes;
}

/* ══════════════════════════════════════════════
   RENDER — TENDÊNCIA DE USO
══════════════════════════════════════════════ */
function _renderTendencia(stats) {
  const mediaDiaria = document.getElementById('perf-media-diaria');
  if (mediaDiaria) {
    mediaDiaria.textContent = stats.mediaDiaria > 0
      ? formatTimeHuman(stats.mediaDiaria)
      : '—';
    const bar = document.getElementById('perf-bar-media');
    if (bar) bar.style.width = Math.min(100, (stats.mediaDiaria / 7200) * 100) + '%';
  }

  const diasAtivos7 = document.getElementById('perf-dias-ativos');
  if (diasAtivos7 && stats.ultimos7?.length) {
    const count = stats.ultimos7.filter(d => d.tempoTotal > 0).length;
    diasAtivos7.textContent = `${count}/7`;
    const bar = document.getElementById('perf-bar-dias');
    if (bar) bar.style.width = (count / 7 * 100) + '%';
  }

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

  const streakEl = document.getElementById('perf-streak');
  if (streakEl) {
    streakEl.textContent = `${stats.streak} dia${stats.streak !== 1 ? 's' : ''}`;
    const bar = document.getElementById('perf-bar-streak');
    if (bar) bar.style.width = Math.min(100, (stats.streak / 30) * 100) + '%';
  }
}

/* ══════════════════════════════════════════════
   RENDER — CRESCIMENTO ACUMULADO (últimos 7 dias)
══════════════════════════════════════════════ */
function _renderCrescimentoAcumulado(stats) {
  const wrap = document.getElementById('crescimento-acumulado');
  if (!wrap || !stats.ultimos7?.length) return;

  wrap.innerHTML = '';

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
══════════════════════════════════════════════ */
function _renderConsistencia(stats) {
  const freqEl = document.getElementById('consistencia-frequencia');
  if (freqEl) {
    const pct = Math.round((stats.diasAtivos30 / 30) * 100);
    freqEl.textContent = `${stats.diasAtivos30} de 30 dias (${pct}%)`;
    const bar = document.getElementById('consistencia-bar-freq');
    if (bar) bar.style.width = pct + '%';
  }

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
      const cv     = media > 0 ? desv / media : 1;
      const score  = Math.max(0, Math.min(100, Math.round((1 - Math.min(cv, 1)) * 100)));
      const rotulo = score >= 75 ? 'Regular' : score >= 40 ? 'Moderado' : 'Variável';
      regEl.textContent = `${rotulo} (${score}%)`;
      const bar = document.getElementById('consistencia-bar-reg');
      if (bar) bar.style.width = score + '%';
    } else {
      regEl.textContent = diasComTempo.length === 1 ? 'Dados insuficientes' : '—';
    }
  }

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

/* ── ícone por pathname ───────────────────────────────────── */
function _iconePorRota(chave) {
  const ICONES = {
    dashboard: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="8" y="1" width="5" height="5" rx="1"/><rect x="1" y="8" width="5" height="5" rx="1"/><rect x="8" y="8" width="5" height="5" rx="1"/></svg>`,
    quiz:      `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="5.5"/><path d="M5.5 5.5a1.5 1.5 0 012.5 1c0 1-1.5 1.5-1.5 2.5M7 11v.5"/></svg>`,
    resumo:    `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 2h10a1 1 0 011 1v8l-3 1.5H2a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M4 5h6M4 7.5h4"/></svg>`,
    atlas:     `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1.5" y="2" width="11" height="10" rx="1.5"/><path d="M5 2v10M1.5 6h11"/></svg>`,
    index:     `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1.5 7L7 2l5.5 5M3 6v5.5h3V9h2v2.5h3V6"/></svg>`,
  };
  return ICONES[chave] ?? `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="5.5"/></svg>`;
}

function _corIconePorRota(chave) {
  const CORES = {
    dashboard: 'rgba(108,99,255,.15)',
    quiz:      'rgba(61,220,132,.12)',
    resumo:    'rgba(79,168,232,.12)',
    atlas:     'rgba(255,181,71,.12)',
    index:     'rgba(108,99,255,.12)',
  };
  const TEXTO = {
    dashboard: 'var(--accent-lite)',
    quiz:      'var(--green)',
    resumo:    'var(--blue)',
    atlas:     'var(--amber)',
    index:     'var(--accent-lite)',
  };
  return {
    bg:    CORES[chave]  ?? 'var(--border)',
    color: TEXTO[chave]  ?? 'var(--text-3)',
  };
}

function _renderPaginasMaisAcessadas(pages) {
  const wrap = document.getElementById('nav-paginas-lista');
  if (!wrap) return;

  wrap.innerHTML = '';
  wrap.className = 'nav-rank-list';

  const entradas = pages && typeof pages === 'object' ? Object.entries(pages) : [];

  const relevantes = entradas
    .filter(([, info]) => (info?.visits ?? 0) >= 2)
    .map(([pathname, info]) => ({
      pathname,
      visits: info?.visits ?? 0,
      time:   info?.time   ?? 0,
      score:  (info?.visits ?? 0) * 10 + (info?.time ?? 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (!relevantes.length) {
    const vazio = document.createElement('div');
    vazio.className = 'nav-rank-empty';
    vazio.textContent = 'Nenhuma página com 2 ou mais visitas ainda.';
    wrap.appendChild(vazio);
    return;
  }

  const maxScore = relevantes[0].score;

  relevantes.forEach(({ pathname, visits, time, score }, idx) => {
    const { chave } = _extrairChaveDeRota(pathname) ?? {};
    const pct  = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const rank = idx + 1;
    const isTop = rank === 1;

    const iconeCor = _corIconePorRota(chave);
    const iconeClasse = {
      dashboard: 'ic-purple',
      quiz:      'ic-green',
      atlas:     'ic-amber',
      resumo:    'ic-blue',
      index:     'ic-purple',
    }[chave] ?? 'ic-purple';

    const item = document.createElement('div');
    item.className = 'nav-rank-item';

    item.innerHTML = `
      <span class="nav-rank-pos${isTop ? ' is-top' : ''}">#${rank}</span>
      <div class="nav-rank-icon ${iconeClasse}" style="color:${iconeCor.color}">
        ${_iconePorRota(chave)}
      </div>
      <div class="nav-rank-body">
        <div class="nav-rank-name${isTop ? ' is-top' : ''}">${_escapeHtmlNav(_normalizarRotaParaLabel(pathname))}</div>
        <div class="nav-rank-meta">
          <span class="nav-rank-stat"><strong>${visits}</strong> visita${visits !== 1 ? 's' : ''}</span>
          <span class="nav-rank-stat"><strong>${formatTimeHuman(time)}</strong> tempo total</span>
        </div>
      </div>
      <div class="nav-rank-bar-wrap">
        <div class="nav-rank-bar">
          <div class="nav-rank-bar-fill${isTop ? ' is-top' : ''}" style="width:${pct}%"></div>
        </div>
        <div class="nav-rank-pct">${pct}%</div>
      </div>
    `;

    wrap.appendChild(item);
  });
}

function _escapeHtmlNav(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function _renderFluxoNavegacao(navigation) {
  const wrap = document.getElementById('nav-fluxo');
  if (!wrap) return;

  wrap.innerHTML = '';
  wrap.className = 'nav-tl-list';

  const sequencia = Array.isArray(navigation) ? navigation : [];

  if (!sequencia.length) {
    const vazio = document.createElement('div');
    vazio.className = 'nav-tl-empty';
    vazio.textContent = 'Sem histórico de navegação registrado ainda.';
    wrap.appendChild(vazio);
    return;
  }

  const semRep = sequencia.reduce((acc, cur) => {
    if (acc[acc.length - 1] !== cur) acc.push(cur);
    return acc;
  }, []);

  const exibir = semRep.slice(-8);
  const agora  = Date.now();

  exibir.forEach((pathname, idx) => {
    const isCurrent = idx === exibir.length - 1;
    const minutosAtras = (exibir.length - 1 - idx) * 3;
    const tsEstimado   = agora - minutosAtras * 60 * 1000;
    const horario      = new Date(tsEstimado).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    let tempoLabel;
    if (minutosAtras === 0)      tempoLabel = 'agora';
    else if (minutosAtras < 60)  tempoLabel = `há ${minutosAtras} min`;
    else                         tempoLabel = `há ${Math.round(minutosAtras / 60)}h`;

    const entry = document.createElement('div');
    entry.className = 'nav-tl-entry';

    entry.innerHTML = `
      <div class="nav-tl-dot-col">
        <div class="nav-tl-dot${isCurrent ? ' is-current' : ''}"></div>
      </div>
      <div class="nav-tl-body">
        <div class="nav-tl-page-name${isCurrent ? ' is-current' : ''}">${_escapeHtmlNav(_normalizarRotaParaLabel(pathname))}</div>
        <div class="nav-tl-page-time">${horario} · ${tempoLabel}</div>
      </div>
      ${isCurrent ? '<span class="nav-tl-badge">Agora</span>' : ''}
    `;

    wrap.appendChild(entry);
  });

  const footer = document.createElement('div');
  footer.className = 'nav-tl-footer';
  footer.innerHTML = `
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path d="M9.5 5.5A4 4 0 115.5 1.5M9.5 1.5v4h-4"/>
    </svg>
    Atualizado agora há pouco
  `;
  wrap.appendChild(footer);
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
  if (deviceType === 'mobile')       el.textContent = '📱 Mobile';
  else if (deviceType === 'desktop') el.textContent = '🖥️ Desktop';
  else                               el.textContent = '—';
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

export { _renderMetricasVazio, _renderNavegacaoAoVivo };