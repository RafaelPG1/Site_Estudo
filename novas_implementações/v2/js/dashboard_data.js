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
       diária, navegação, Perfil de Uso, etc.)

   Não pertence a este arquivo:
     ✗ renderDashboardIntelligence e os renderizadores
       da Camada 5 — ver dashboard_render.js
     ✗ bootstrap / listeners de evento — ver
       dashboard.js

   ─────────────────────────────────────────────
   PERFIL DE USO — v9 (reimplementação do zero, global)
   ─────────────────────────────────────────────
   O card "Perfil de uso" passa a ler exclusivamente de
   usuarios/{uid}/perfil_uso/global (via carregarPerfilUso,
   em src/session-tracker.js). Não depende de semestre, não
   depende de Quiz Intelligence. O registro do lado do
   session-tracker.js agora é IMEDIATO (hora + dispositivo
   gravados assim que a página carrega, sem esperar heartbeat
   nem tempo mínimo de sessão) e dispara o evento DOM
   'nexus:perfilUsoAtualizado' a cada flush bem-sucedido —
   este arquivo escuta esse evento para re-renderizar o card
   sozinho, sem depender de reload.

   ─────────────────────────────────────────────
   PERFIL DE USO — v9.1 (alinhamento de copy com idle-aware)
   ─────────────────────────────────────────────
   session-tracker.js (v10) passou a exigir atividade real
   (mouse/scroll/teclado) para incrementar hourHeatmap —
   deixou de contar apenas por a aba estar aberta e visível.
   Isso muda o SIGNIFICADO do valor bruto de cada bucket:
   antes era "quantos ticks de presença passiva", agora é
   "quantos segundos de engajamento ativo real". A camada de
   apresentação foi ajustada para refletir essa mudança
   (textos de "uso" trocados por "engajamento"/"presença
   ativa"). Nenhum cálculo, leitura de Firestore ou estrutura
   de dados foi alterado — apenas formatação e texto.

   ─────────────────────────────────────────────
   PERFIL DE USO — v9.2 (dois bugs corrigidos)
   ─────────────────────────────────────────────
   BUG 1 — perda de precisão na exibição de detalhe:
   formatTimeHuman() (session-tracker.js) arredonda para a
   unidade maior — 61s e 119s produzem ambos "1m". Como a
   classificação Baixo/Médio/Pico usa o valor em SEGUNDOS
   (não alterado aqui), duas colunas podiam exibir o mesmo
   texto e ainda assim ter classificações diferentes,
   parecendo um erro. CORREÇÃO: nova função local
   _formatTempoDetalhado(), usada em todo texto de DETALHE
   (tooltip, callout de pico, insights) — mostra minutos E
   segundos (ex.: "1m 02s", "1h 05m 18s"). O eixo Y do
   gráfico continua resumido via _formatMinutosCurto
   (inalterado) — só os detalhes ganharam precisão total.

   BUG 2 — eixo X desalinhado das colunas reais:
   investigação completa da cadeia (leitura de hourHeatmap →
   montagem do array de 24 posições → renderização das
   colunas → dataset.hora → tooltip → aria-label →
   classificação → callout de pico) confirmou que TODOS esses
   pontos usam consistentemente o mesmo índice `h` — não
   havia nenhum off-by-one no JavaScript. A causa raiz estava
   no HTML/CSS: o eixo X era uma faixa ESTÁTICA de 5 <span>
   distribuídos via `justify-content:space-between`, um
   modelo de grade diferente do das 24 barras (`flex:1` com
   `gap:3px` cada). Isso fazia os rótulos "12h"/"18h" caírem
   visualmente sobre o limite entre colunas, não sobre o
   centro da coluna correta. CORREÇÃO: o eixo X agora é
   gerado dinamicamente aqui, com os MESMOS 24 itens, mesmo
   `flex:1` e mesmo `gap` das barras (ver dashboard.html/CSS
   — classe .usage-heatmap-axis-tick), garantindo alinhamento
   por construção. Nenhum índice foi somado/subtraído —
   apenas o modelo de layout foi unificado com o das colunas.
   ============================================= */

import { getUsuario } from '../../../src/global.js';

/* ── Session Tracker ── */
import {
  formatTimeHuman,
  carregarEstatisticas,
  getStats        as sessionGetStats,
  setSemestreAtivo,
  carregarPerfilUso,
  USAGE_PERIODOS,
} from '../../../src/session-tracker.js';

/* ── Firestore (leitura da última sessão persistida — fallback do card Navegação) ── */
import { getDb } from '../../../src/firebase.js';
import {
  collection, query, orderBy, limit, getDocs,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { renderDashboardIntelligence } from './dashboard_render.js';
import { perfLog, logFirestore } from '../../../src/perf_logger.js';
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

  /* Separa a query string ANTES de decodificar/dividir em segmentos —
     evita que ela permaneça colada ao último segmento do caminho. */
  const semQuery = pathname.split('?')[0];

  let limpo = semQuery;
  try { limpo = decodeURIComponent(semQuery); } catch (_) { /* mantém original */ }

  const segmentos = limpo.split('/').filter(Boolean);
  if (segmentos.length === 0) return { chave: 'index', ultimoSegmentoLimpo: 'Início' };

  /* ── Caso especial: /quiz/disciplinas/.../arquivo.html ──────────────
     Nesta etapa (escolha de modo) o caminho contém o segmento literal
     "disciplinas" entre "quiz" e o arquivo final. Quando esse padrão
     aparece, a disciplina é o NOME DO ARQUIVO final, não a rota "quiz"
     — então este caso precisa ser resolvido ANTES da busca genérica
     por ROTA_LABELS, que do contrário sempre bate em "quiz" primeiro
     (pois "quiz" é o primeiro segmento de toda URL desta área). */
  const idxDisciplinas = segmentos.findIndex(s => s.toLowerCase() === 'disciplinas');
  if (idxDisciplinas !== -1 && segmentos[0]?.toLowerCase() === 'quiz') {
    const arquivoFinal = segmentos[segmentos.length - 1];
    const semExtArquivo = arquivoFinal.replace(/\.html?$/i, '').toLowerCase();
    /* Só trata como disciplina se o arquivo final não for, ele mesmo,
       uma rota conhecida (ex.: index.html dentro de /disciplinas/) */
    if (semExtArquivo && !ROTA_LABELS[semExtArquivo]) {
      return {
        chave:               'quiz',
        ultimoSegmentoLimpo: null,
        discDoArquivo:       _limparSegmento(arquivoFinal),
      };
    }
  }

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
  const { chave, ultimoSegmentoLimpo, discDoArquivo } = _extrairChaveDeRota(chaveNav) || {};

  if (!chave) {
    return ultimoSegmentoLimpo || 'Página';
  }

  const labelBase = ROTA_LABELS[chave] ?? _limparSegmento(chave) ?? 'Página';

  if (!ROTAS_COM_DISCIPLINA.has(chave)) {
    return labelBase;
  }

  /* Prioridade obrigatória, lida sempre a partir da própria URL
     registrada — nunca de State, variáveis globais ou contexto:
       1. ?disc= na query string da entrada
       2. nome do arquivo, quando vier de /quiz/disciplinas/.../arquivo.html
       3. nenhuma disciplina — mostra só o label base */
  const disciplina = _extrairDisciplinaDaQuery(chaveNav) || discDoArquivo || null;

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
   CAMADA 5 — SINCRONIZAÇÃO COM QUIZ INTELLIGENCE
   ─────────────────────────────────────────────
   Substitui o antigo polling (_aguardarNexusIntelligence,
   setInterval de 100ms até 3000ms esperando
   window.NexusQuizIntelligence existir). Em vez de espera
   ativa, usamos import() dinâmico do próprio módulo ES —
   a arquitetura de módulos já existente. O import é
   assíncrono e resolvido pelo runtime assim que o módulo
   terminar de carregar/avaliar; se o módulo já tiver sido
   carregado por qualquer outra página/import, o browser
   reaproveita o mesmo module record (sem nova requisição).
   Falha de carregamento é tratada de forma equivalente ao
   antigo timeout: retorna null e o card correspondente
   renderiza estado vazio, sem travar o carregamento. ── */
let _quizIntelligenceModulePromise = null;

function _importarQuizIntelligence() {
  if (_quizIntelligenceModulePromise) return _quizIntelligenceModulePromise;

  _quizIntelligenceModulePromise = import('../../../quiz/js/quiz_intelligence.js')
    .catch(err => {
      console.warn('[dashboard] _importarQuizIntelligence: falha ao importar quiz_intelligence.js:', err);
      _quizIntelligenceModulePromise = null; // permite nova tentativa numa próxima chamada
      return null;
    });

  return _quizIntelligenceModulePromise;
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

/* ── Progresso numérico das conquistas (apoio visual) ──────────
   NÃO recalcula nada e NÃO cria nenhuma regra nova: lê os MESMOS
   campos já extraídos em _calcularConquistas (streak, totalSessoes,
   totalTentativas, totalQuestoes, taxaAcertoMediaPct, melhorDia.tempo)
   e apenas expõe o par {atual, meta} para as barras de progresso
   da UI. A lógica de desbloqueio continua 100% em _calcularConquistas. */
function _calcularProgressoConquistas(relatorio, stats) {
  if (!relatorio || !stats) return {};

  const score = relatorio.scoreEvolutivo;

  const streak           = stats.streak ?? 0;
  const totalSessoes     = stats.totalSessoes ?? 0;
  const melhorDiaTempo   = stats.melhorDia?.tempo ?? 0;
  const totalTentativas  = score?.totalTentativas ?? 0;
  const totalQuestoes    = relatorio.totalQuestoes ?? 0;
  const taxaMediaPct     = score?.composicao?.taxaAcertoMediaPct ?? 0;

  return {
    sequencia7:    { atual: streak,          meta: 7,     tipo: 'numero'     },
    sequencia30:   { atual: streak,          meta: 30,    tipo: 'numero'     },
    tentativas100: { atual: totalTentativas, meta: 100,   tipo: 'numero'     },
    questoesMil:   { atual: totalQuestoes,   meta: 1000,  tipo: 'numero'     },
    miraAfiada:    { atual: taxaMediaPct,    meta: 75,    tipo: 'percentual' },
    maratonista:   { atual: melhorDiaTempo,  meta: 18000, tipo: 'tempo'      },
    sessoes50:     { atual: totalSessoes,    meta: 50,    tipo: 'numero'     },
  };
}

/* _carregarIntelligence(uid)
   Lê State.semestre para filtrar todas as métricas de quiz
   pelo semestre atualmente selecionado no dashboard. */
export async function _carregarIntelligence(uid, statsPreCarregadas = null) {
  const _t0 = performance.now();
  if (!uid) {
    console.warn('[dashboard] _carregarIntelligence: uid ausente — ignorado.');
    return null;
  }

  const _tImport = performance.now();
  const mod = await _importarQuizIntelligence();
  perfLog('dashboard_data', '_importarQuizIntelligence (import dinâmico)', performance.now() - _tImport);

  if (!mod) {
    console.warn('[dashboard] _carregarIntelligence: quiz_intelligence.js indisponível.');
    State.intelligence = null;
    renderDashboardIntelligence(null);
    perfLog('dashboard_data', '_carregarIntelligence (módulo indisponível)', performance.now() - _t0);
    return null;
  }

  const semestreAtivo = State.semestre ?? null;

  const statsPromise = statsPreCarregadas !== null
    ? Promise.resolve(statsPreCarregadas)
    : carregarEstatisticas(uid).catch(() => null);

  try {
    console.log(
      '[dashboard] _carregarIntelligence: chamando relatorioEvolucao para', uid,
      '| semestre:', semestreAtivo ?? 'todos'
    );

    const _tPromiseAll = performance.now();
    const [relatorio, tentativasRecentes, totalQuestoes, statsAtuais] = await Promise.all([
      (async () => {
        const t0 = performance.now();
        const r = await mod.relatorioEvolucao(uid, semestreAtivo);
        perfLog('Promise.all (item)', '_carregarIntelligence :: relatorioEvolucao', performance.now() - t0);
        return r;
      })(),
      (async () => {
        const t0 = performance.now();
        const r = typeof mod.listarTentativasRecentes === 'function'
          ? await mod.listarTentativasRecentes(uid, 10, semestreAtivo)
          : [];
        perfLog('Promise.all (item)', '_carregarIntelligence :: listarTentativasRecentes', performance.now() - t0);
        return r;
      })(),
      (async () => {
        const t0 = performance.now();
        const r = typeof mod.contarQuestoesRespondidas === 'function'
          ? await mod.contarQuestoesRespondidas(uid, semestreAtivo)
          : 0;
        perfLog('Promise.all (item)', '_carregarIntelligence :: contarQuestoesRespondidas', performance.now() - t0);
        return r;
      })(),
      (async () => {
        const t0 = performance.now();
        const r = await statsPromise;
        perfLog('Promise.all (item)', '_carregarIntelligence :: statsPromise (compartilhada)', performance.now() - t0);
        return r;
      })(),
    ]);
    perfLog('Promise.all', '_carregarIntelligence :: total do conjunto (4 itens)', performance.now() - _tPromiseAll);

    relatorio.tentativasRecentes = tentativasRecentes;
    relatorio.totalQuestoes      = totalQuestoes;
    relatorio.semestreFiltrado   = semestreAtivo;

    const _tConquistas = performance.now();
    relatorio.conquistas          = _calcularConquistas(relatorio, statsAtuais);
    relatorio.conquistasProgresso = _calcularProgressoConquistas(relatorio, statsAtuais);
    perfLog('quiz_intelligence', '_carregarIntelligence :: cálculo local de conquistas', performance.now() - _tConquistas);

    State.intelligence = relatorio;

    console.group('[dashboard] State.intelligence — relatorio recebido');
    console.log('geradoEm:',             new Date(relatorio?.geradoEm).toLocaleTimeString());
    console.log('semestreFiltrado:',     relatorio?.semestreFiltrado);
    console.log('scoreEvolutivo:',       relatorio?.scoreEvolutivo);
    console.log('tendenciaDoAluno:',     relatorio?.tendenciaDoAluno);
    console.log('fraquezasPorDisc:',     relatorio?.fraquezasPorDisciplina?.length, 'disciplinas');
    console.log('previsaoSimples:',      relatorio?.previsaoSimples);
    console.log('summaryPersistido:',    relatorio?.summaryPersistidoCamada3);
    console.log('tentativasRecentes:',   relatorio?.tentativasRecentes?.length, 'itens');
    console.log('totalQuestoes:',        relatorio?.totalQuestoes);
    console.log('conquistas:',           relatorio?.conquistas);
    console.groupEnd();

    const _tRender = performance.now();
    renderDashboardIntelligence(relatorio);
    perfLog('Render', '_carregarIntelligence :: renderDashboardIntelligence (chamada)', performance.now() - _tRender);

    perfLog('dashboard_data', '_carregarIntelligence (total)', performance.now() - _t0);

    return relatorio;

  } catch (err) {
    console.error('[dashboard] _carregarIntelligence: erro ao chamar relatorioEvolucao:', err);
    State.intelligence = null;
    renderDashboardIntelligence(null);
    perfLog('dashboard_data', '_carregarIntelligence (ERRO)', performance.now() - _t0);
    return null;
  }
}

/* ══════════════════════════════════════════════
   METRICAS REAIS DO FIREBASE
   ─────────────────────────────────────────────
   Guarda de geração (correção da race condition):
   _carregarMetricasReais() pode ser disparada por 3
   gatilhos independentes em dashboard.js — boot,
   nexus:loginSuccess e troca de semestre (esta última
   sem await) — sem qualquer exclusão mútua entre eles.
   Sem essa guarda, uma chamada mais ANTIGA que termina
   DEPOIS de uma mais nova sobrescrevia o DOM já correto
   (inclusive apagando o Perfil de Uso já renderizado).
   _cargaMetricasGeracaoAtual é incrementado a cada nova
   chamada; ao final, cada execução só escreve no DOM se
   ainda for a mais recente. Nenhum dado, cálculo ou regra
   de negócio foi alterado — apenas a permissão de escrita.
══════════════════════════════════════════════ */
let _cargaMetricasGeracaoAtual = 0;
export async function _carregarMetricasReais() {
  const _minhaGeracao = ++_cargaMetricasGeracaoAtual;

  const _t0 = performance.now();
  const usuario = getUsuario?.();
  if (!usuario?.uid) {
    if (_minhaGeracao === _cargaMetricasGeracaoAtual) _renderMetricasVazio();
    perfLog('dashboard_data', '_carregarMetricasReais (sem usuário)', performance.now() - _t0);
    return;
  }

  setSemestreAtivo(State.semestre);

  const statsPromise = carregarEstatisticas(usuario.uid);

  const _tIntelligence = performance.now();
  const intelligencePromise = _carregarIntelligence(usuario.uid, statsPromise)
    .then(r => {
      perfLog('dashboard_data', '_carregarMetricasReais :: pipeline intelligence (paralela, não bloqueia)', performance.now() - _tIntelligence);
      return r;
    })
    .catch(err => {
      console.error('[dashboard] _carregarIntelligence (pipeline paralela):', err);
      perfLog('dashboard_data', '_carregarMetricasReais :: pipeline intelligence (paralela, ERRO)', performance.now() - _tIntelligence);
      return null;
    });

  const _tSessaoCheck = performance.now();
  const statsSessaoAtualPreCheck = sessionGetStats();
  const temSessaoEmMemoriaPreCheck = statsSessaoAtualPreCheck?.initialized
    && (statsSessaoAtualPreCheck.navSequence?.length > 0);
  perfLog('Sessão', '_carregarMetricasReais :: checagem sessão em memória (getStats síncrono)', performance.now() - _tSessaoCheck, { temSessaoEmMemoria: temSessaoEmMemoriaPreCheck });

  const ultimaSessaoPromise = temSessaoEmMemoriaPreCheck
    ? Promise.resolve(null)
    : _buscarUltimaSessaoPersistida(usuario.uid);

  /* Perfil de Uso Global — independente de semestre e de sessão em
     memória; é lido em paralelo, sem bloquear nada acima. */
  const perfilUsoPromise = carregarPerfilUso(usuario.uid).catch(() => null);

  try {
    const _tPromiseAll = performance.now();
const [stats, ultimaSessao, perfilUso] = await Promise.all([
  statsPromise.then(r => {
    perfLog('Promise.all (item)', '_carregarMetricasReais :: carregarEstatisticas', performance.now() - _tPromiseAll);
    return r;
  }),
  ultimaSessaoPromise.then(r => {
    perfLog('Promise.all (item)', '_carregarMetricasReais :: ultimaSessaoPromise', performance.now() - _tPromiseAll);
    return r;
  }),
  perfilUsoPromise.then(r => {
    perfLog('Promise.all (item)', '_carregarMetricasReais :: perfilUsoPromise', performance.now() - _tPromiseAll);
    return r;
  }),
]);
    perfLog('Promise.all', '_carregarMetricasReais :: total do conjunto (4 itens)', performance.now() - _tPromiseAll);


    /* Guarda de geração — descarta resultado obsoleto.
       Se, entre o início desta chamada e agora, uma chamada mais
       recente de _carregarMetricasReais já foi disparada (login,
       troca de semestre, novo boot), esta execução NÃO escreve
       no DOM — mesmo que stats/perfilUso tenham vindo corretos.
       Isso evita que uma resposta antiga, mais lenta, sobrescreva
       uma resposta mais nova já renderizada corretamente. */
    if (_minhaGeracao !== _cargaMetricasGeracaoAtual) {
      console.warn('[PERFIL-USO][dashboard_data] resultado obsoleto descartado — geração',
        _minhaGeracao, '| geração atual:', _cargaMetricasGeracaoAtual);
      perfLog('dashboard_data', '_carregarMetricasReais (descartada — geração obsoleta)', performance.now() - _t0);
      intelligencePromise.catch(() => {});
      return;
    }
// dashboard_data.js — dentro de _carregarMetricasReais()

    if (!stats) {
      _renderMetricasVazio();
    } else {
      const _tRenderSessao = performance.now();
      _renderTempoGlobal(stats);
      _renderTendencia(stats);
      _renderConsistencia(stats);
      _renderSparklines(stats);
      _renderUltimoAcesso(stats);
      perfLog('Render', '_carregarMetricasReais :: renders de sessão (Tempo Global/Tendência/Consistência/Sparklines/Último acesso)', performance.now() - _tRenderSessao);

      const statsSessaoAtual   = sessionGetStats();
      const temSessaoEmMemoria = statsSessaoAtual?.initialized
        && (statsSessaoAtual.navSequence?.length > 0);

      const _tRenderNav = performance.now();
      if (temSessaoEmMemoria) {
        _renderNavegacaoAoVivo(statsSessaoAtual);
      } else if (ultimaSessao) {
        _renderNavegacaoPersistida(ultimaSessao);
      } else {
        _renderNavegacaoVazia();
      }
      perfLog('Render', '_carregarMetricasReais :: render navegação (páginas + histórico)', performance.now() - _tRenderNav);
    }

    /* Perfil de Uso é independente de `stats` — precisa ser renderizado
       com o dado real sempre que carregarPerfilUso() tiver retornado algo,
       mesmo que carregarEstatisticas() (stats) tenha falhado. Antes, esta
       chamada vivia dentro do `else` acima e ficava refém de `stats`;
       quando stats vinha null, _renderMetricasVazio() já tinha forçado
       _renderPerfilUso(null) por cima de um perfilUso real já carregado. */
    const _tRenderPerfilUso = performance.now();
    _renderPerfilUso(perfilUso);
    perfLog('Render', '_carregarMetricasReais :: render Perfil de Uso (global)', performance.now() - _tRenderPerfilUso);

  } catch (err) {
    console.error('[dashboard] _carregarMetricasReais:', err);
    if (_minhaGeracao === _cargaMetricasGeracaoAtual) _renderMetricasVazio();
  }

  perfLog('dashboard_data', '_carregarMetricasReais (bloco síncrono, sem contar pipeline intelligence)', performance.now() - _t0);

  intelligencePromise.catch(() => {});
}

async function _buscarUltimaSessaoPersistida(uid) {
  if (!uid) return null;
  const t0 = performance.now();
  try {
    const db  = getDb();
    const ref = collection(db, 'usuarios', uid, 'sessoes');
    const q   = query(ref, orderBy('startedAt', 'desc'), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) {
      logFirestore('usuarios/{uid}/sessoes (última)', uid, performance.now() - t0, 0);
      return null;
    }
    const docSnap = snap.docs[0];
    logFirestore('usuarios/{uid}/sessoes (última)', uid, performance.now() - t0, 1);
    return { id: docSnap.id, ...docSnap.data() };
  } catch (err) {
    console.warn('[dashboard] _buscarUltimaSessaoPersistida:', err);
    logFirestore('usuarios/{uid}/sessoes (última) (ERRO)', uid, performance.now() - t0, 0);
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
   RENDER — Consistência de uso (últimos 30 dias)
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
  if (tendEl) tendEl.textContent = '—';
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
   RENDER — PERFIL DE USO (GLOBAL)
   ─────────────────────────────────────────────
   Fonte: usuarios/{uid}/perfil_uso/global (via carregarPerfilUso).
   Zero cálculo de negócio novo: apenas lê deviceType, hourHeatmap
   e periodHeatmap já consolidados pelo session-tracker.js e formata
   para os elementos do card "Perfil de uso" do dashboard.html.

   v9.1 — cada unidade de hourHeatmap/periodHeatmap representa 1
   SEGUNDO de engajamento ativo real (session-tracker.js v10,
   idle-aware). Textos usam linguagem de "engajamento".

   v9.2 — dois ajustes de apresentação (ver changelog no topo do
   arquivo): _formatTempoDetalhado() para precisão de segundos em
   todo texto de detalhe, e geração dinâmica do eixo X do heatmap
   (HEATMAP_AXIS_HORAS) para eliminar o desalinhamento entre
   rótulo e coluna. Nenhum cálculo de hourHeatmap/classificação foi
   alterado — apenas a formatação e a geração do eixo.
══════════════════════════════════════════════ */
const DEVICE_LABELS = { desktop: 'Computador', mobile: 'Celular', tablet: 'Tablet' };

const DEVICE_ICONS = {
  desktop: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1.5" y="2.5" width="15" height="10" rx="1.5"/><path d="M6 15.5h6M9 12.5v3"/></svg>`,
  mobile:  `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="1.5" width="8" height="15" rx="1.5"/><path d="M8 14h2"/></svg>`,
  tablet:  `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="1.5" width="12" height="15" rx="1.5"/><path d="M8 14h2"/></svg>`,
};

function _iconePeriodo(id) {
  const ICONES = {
    madrugada: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 1.5a5.5 5.5 0 105.5 5.5A4.5 4.5 0 017 1.5z"/></svg>`,
    manha:     `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="8" r="3"/><path d="M7 1v1.5M2 8H.5M13.5 8H12M3.5 4l-1-1M10.5 4l1-1"/></svg>`,
    tarde:     `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="4"/><path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13"/></svg>`,
    noite:     `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 8.5A5 5 0 116 1.5 4 4 0 0011 8.5z"/></svg>`,
  };
  return ICONES[id] ?? '';
}

/* ── Classificação visual das barras do heatmap ─────────────────
   Puramente de apresentação: não recalcula hourHeatmap, apenas
   categoriza os MESMOS valores já lidos de perfil.hourHeatmap
   para decidir cor/hierarquia e o texto do tooltip.
     vazio → valor 0
     baixo → valor > 0 e abaixo da média das horas com uso
     médio → valor >= média e < pico
     pico  → o(s) valor(es) igual(is) ao máximo do dia
   INALTERADA na v9.2 — nenhuma regra de classificação foi tocada. */
function _classificarValorHeatmap(valor, media, maxVal) {
  if (valor <= 0) return 'vazio';
  if (valor === maxVal) return 'pico';
  if (valor >= media) return 'medio';
  return 'baixo';
}

const UH_LABEL = { vazio: 'Sem atividade', baixo: 'Baixo', medio: 'Médio', pico: 'Pico' };

/* Horas exibidas com rótulo no eixo X do heatmap. As outras 19
   posições são geradas como itens vazios — mas com o MESMO flex:1
   e o MESMO gap das 24 barras (.heatmap-chart), garantindo que a
   posição de cada rótulo coincida exatamente com a coluna
   correspondente. Antes, o eixo era uma faixa estática de 5 <span>
   distribuídos via justify-content:space-between — um modelo de
   grade diferente do das barras, que é a causa raiz do
   desalinhamento relatado. */
const HEATMAP_AXIS_HORAS = new Set([0, 6, 12, 18, 23]);

/* Formata segundos em minutos compactos — usado SÓ no eixo Y do
   heatmap, onde o espaço é reduzido (20px de largura) e exige
   rótulos curtos. Não é uma nova métrica: é apenas outra
   representação textual do mesmo valor em segundos já usado para
   classificar e desenhar as barras. */
function _formatMinutosCurto(segundos) {
  const min = Math.round((segundos ?? 0) / 60);
  if (min <= 0) return '<1m';
  if (min < 60) return `${min}m`;
  const h        = Math.floor(min / 60);
  const restoMin = min % 60;
  return restoMin > 0 ? `${h}h${restoMin}m` : `${h}h`;
}

/* Formata segundos com precisão TOTAL (minutos e segundos, ou
   horas/minutos/segundos) — usado em qualquer texto de DETALHE:
   tooltip, callout de pico, insights. Diferente de formatTimeHuman
   (session-tracker.js), que arredonda para a unidade maior e por
   isso pode exibir "1m" tanto para 61s quanto para 119s, mascarando
   a diferença que a classificação (acima) já usa corretamente.
   Exemplos: 62s → "1m 02s" | 754s → "12m 34s" | 3918s → "1h 05m 18s". */
function _formatTempoDetalhado(segundosBrutos) {
  const total = Math.max(0, Math.floor(segundosBrutos ?? 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, '0');

  if (h > 0) {
    const mm = String(m).padStart(2, '0');
    return `${h}h ${mm}m ${ss}s`;
  }
  if (m > 0) {
    return `${m}m ${ss}s`;
  }
  return `${s}s`;
}

/* ── Tooltip customizado do heatmap ──────────────────────────────
   Delegação de evento única no container pai (#nav-heatmap), que
   sobrevive aos re-renders (innerHTML é limpo e recriado a cada
   chamada, mas o elemento #nav-heatmap em si nunca é substituído).
   dataset.tooltipBound evita anexar o listener mais de uma vez. */
function _instalarTooltipHeatmap(elHeatmap) {
  if (elHeatmap.dataset.tooltipBound === '1') return;
  elHeatmap.dataset.tooltipBound = '1';

  const tooltipEl = document.getElementById('usage-heatmap-tooltip');
  const elHora    = document.getElementById('uht-hora');
  const elValor   = document.getElementById('uht-valor');
  const elBadge   = document.getElementById('uht-badge');
  if (!tooltipEl) return;

  function mostrar(col) {
    const hora   = col.dataset.hora;
    const valor  = col.dataset.valor;
    const classe = col.dataset.classe;

    elHora.textContent  = `${hora}h`;
    /* v9.2 — precisão total (minutos + segundos), não mais o valor
       arredondado de formatTimeHuman. */
    elValor.textContent = `${_formatTempoDetalhado(Number(valor))} de engajamento`;
    elBadge.textContent = UH_LABEL[classe] ?? '—';
    elBadge.className   = `uht-badge ${classe}`;

    const bodyEl = elHeatmap.closest('.usage-heatmap-body');
    const barEl  = col.querySelector('.heatmap-bar');
    if (!bodyEl || !barEl) return;

    const rectBar  = barEl.getBoundingClientRect();
    const rectBody = bodyEl.getBoundingClientRect();

    tooltipEl.style.left = `${rectBar.left - rectBody.left + rectBar.width / 2}px`;
    tooltipEl.style.top  = `${rectBar.top  - rectBody.top}px`;
    tooltipEl.classList.add('is-visible');
  }

  function esconder() {
    tooltipEl.classList.remove('is-visible');
  }

  elHeatmap.addEventListener('mouseover', (e) => {
    const col = e.target.closest('.heatmap-col');
    if (col && elHeatmap.contains(col)) mostrar(col);
  });

  elHeatmap.addEventListener('mouseout', (e) => {
    const col = e.target.closest('.heatmap-col');
    if (!col) return;
    if (e.relatedTarget && col.contains(e.relatedTarget)) return;
    esconder();
  });

  /* Acessibilidade — foco via teclado também aciona o tooltip */
  elHeatmap.addEventListener('focusin', (e) => {
    const col = e.target.closest('.heatmap-col');
    if (col) mostrar(col);
  });
  elHeatmap.addEventListener('focusout', esconder);
}

function _renderPerfilUso(perfil) {
  const elDeviceIcon   = document.getElementById('usage-device-icon');
  const elDeviceTipo   = document.getElementById('nav-device-tipo');
  const elHorarioPico  = document.getElementById('nav-horario-pico');
  const elHorarioBadge = document.getElementById('usage-horario-badge');
  const elHeatmapTotal = document.getElementById('usage-heatmap-total');
  const elYAxis        = document.getElementById('usage-heatmap-yaxis');
  const elHeatmap      = document.getElementById('nav-heatmap');
  /* v9.2 — eixo X agora é gerado aqui, não mais estático no HTML. */
  const elXAxis        = document.getElementById('usage-heatmap-axis');
  const elPeriodsRow   = document.getElementById('usage-periods-row');
  const elInsight      = document.getElementById('usage-insight');
  const elPeakCallout  = document.getElementById('usage-peak-callout');
  const elPeakText     = document.getElementById('usage-peak-text');

  if (!elHeatmap) return;

  const deviceType    = _extrairMapaAninhado(perfil, 'deviceType');
  const hourHeatmap   = _extrairMapaAninhado(perfil, 'hourHeatmap');
  const periodHeatmap = _extrairMapaAninhado(perfil, 'periodHeatmap');

  /* ── Dispositivo principal ── */
  const deviceEntries = Object.entries(deviceType).filter(([, v]) => v > 0);
  if (deviceEntries.length === 0) {
    if (elDeviceTipo) elDeviceTipo.textContent = '—';
    if (elDeviceIcon) elDeviceIcon.innerHTML = DEVICE_ICONS.desktop;
  } else {
    const [tipoPrincipal] = [...deviceEntries].sort((a, b) => b[1] - a[1])[0];
    if (elDeviceTipo) elDeviceTipo.textContent = DEVICE_LABELS[tipoPrincipal] ?? tipoPrincipal;
    if (elDeviceIcon) elDeviceIcon.innerHTML = DEVICE_ICONS[tipoPrincipal] ?? DEVICE_ICONS.desktop;
  }

  /* ── Heatmap por hora (0–23) ──
     valores[h] corresponde exatamente à hora h. Este é o ÚNICO
     array-fonte usado por barras, dataset.hora, tooltip, aria-label,
     classificação e callout de pico abaixo — todos leem o mesmo
     índice h do mesmo array, nunca um índice derivado ou deslocado. */
  const valores = Array.from({ length: 24 }, (_, h) => hourHeatmap[h] ?? hourHeatmap[String(h)] ?? 0);
  const total   = valores.reduce((a, b) => a + b, 0);
  const maxVal  = Math.max(...valores, 1);

  /* Média calculada só sobre horas COM atividade — usada
     exclusivamente para classificar visualmente baixo/médio/pico
     (apresentação), não altera nenhum número exibido em outros
     lugares. */
  const horasComUso = valores.filter(v => v > 0);
  const media = horasComUso.length > 0
    ? horasComUso.reduce((a, b) => a + b, 0) / horasComUso.length
    : 0;

  if (elHeatmapTotal) elHeatmapTotal.textContent = total > 0 ? `${_formatTempoDetalhado(total)} de engajamento` : '—';
  if (elYAxis) elYAxis.innerHTML = `<span>${_formatMinutosCurto(maxVal)}</span><span>${_formatMinutosCurto(Math.round(maxVal / 2))}</span><span>0</span>`;

  let horaPicoNum = null, picoValor = -1;
  valores.forEach((v, h) => { if (v > picoValor) { picoValor = v; horaPicoNum = h; } });

  elHeatmap.innerHTML = '';
  valores.forEach((v, h) => {
    const classe    = _classificarValorHeatmap(v, media, maxVal);
    const alturaPct = total > 0 ? Math.max(2, Math.round((v / maxVal) * 100)) : 2;

    const col = document.createElement('div');
    col.className = 'heatmap-col';
    col.tabIndex  = total > 0 ? 0 : -1;
    col.dataset.hora   = h;
    col.dataset.valor  = v;
    col.dataset.classe = classe;
    col.setAttribute('aria-label', `${h}h — ${_formatTempoDetalhado(v)} de engajamento (${UH_LABEL[classe]})`);

    const bar = document.createElement('div');
    bar.className = `heatmap-bar uh-${classe}`;
    bar.style.height = `${alturaPct}%`;

    col.appendChild(bar);
    elHeatmap.appendChild(col);
  });

  _instalarTooltipHeatmap(elHeatmap);

  /* ── Eixo X — gerado com o MESMO número de itens (24), mesmo gap
     e mesmo flex:1 por item que .heatmap-chart (ver CSS em
     dashboard.html: .usage-heatmap-axis / .usage-heatmap-axis-tick).
     Isso garante que cada rótulo ocupe exatamente a mesma coluna
     horizontal da barra correspondente — a correção da causa raiz
     do desalinhamento (o eixo antigo era uma faixa estática de 5
     <span> via justify-content:space-between, um modelo de grade
     diferente do das barras). Nenhum índice foi somado/subtraído:
     tick[h] e valores[h] são construídos a partir do MESMO laço de
     0 a 23, na mesma ordem. */
  if (elXAxis) {
    elXAxis.innerHTML = '';
    for (let h = 0; h < 24; h++) {
      const tick = document.createElement('span');
      tick.className = 'usage-heatmap-axis-tick';
      if (HEATMAP_AXIS_HORAS.has(h)) tick.textContent = `${h}h`;
      elXAxis.appendChild(tick);
    }
  }

  if (elHorarioPico) elHorarioPico.textContent = total > 0 ? `${horaPicoNum}h` : '—';

  /* ── Período dominante (já consolidado em periodHeatmap) ── */
  const periodoEntries = USAGE_PERIODOS.map(p => ({ ...p, valor: periodHeatmap[p.id] ?? 0 }));
  const totalPeriodos  = periodoEntries.reduce((a, p) => a + p.valor, 0);
  const periodoDominante = totalPeriodos > 0
    ? [...periodoEntries].sort((a, b) => b.valor - a.valor)[0]
    : null;

  if (elHorarioBadge) {
    if (periodoDominante) {
      elHorarioBadge.textContent = periodoDominante.label;
      elHorarioBadge.classList.add('is-visible');
    } else {
      elHorarioBadge.textContent = '';
      elHorarioBadge.classList.remove('is-visible');
    }
  }

  if (elPeriodsRow) {
    if (totalPeriodos === 0) {
      elPeriodsRow.innerHTML = `<div class="usage-periods-empty">Continue usando a plataforma para gerar seu perfil de horários.</div>`;
    } else {
      elPeriodsRow.innerHTML = periodoEntries.map(p => {
        const pct = Math.round((p.valor / totalPeriodos) * 100);
        return `
          <div class="usage-period-card${periodoDominante?.id === p.id ? ' is-dominant' : ''}">
            <div class="usage-period-top">
              <span class="usage-period-icon">${_iconePeriodo(p.id)}</span>
              <span class="usage-period-name">${p.label}</span>
            </div>
            <span class="usage-period-pct">${pct}%</span>
          </div>`;
      }).join('');
    }
  }

  /* ── Callout fixo do pico real ──
     v9.3: este é agora o ÚNICO destaque visual acima do gráfico
     (âmbar/🔥). O bloco roxo (usage-chart-insight) foi removido —
     as duas mensagens diziam basicamente a mesma coisa (período
     dominante + horário de pico), então manter as duas era
     redundante. O insight cinza de rodapé (usage-insight, logo
     abaixo do heatmap) permanece como o único texto complementar
     do card. Tempo de engajamento no pico com precisão total
     (_formatTempoDetalhado), inalterado desde a v9.2. */
  if (elPeakCallout && elPeakText) {
    if (total > 0 && horaPicoNum !== null) {
      elPeakText.textContent = `Pico de engajamento: ${horaPicoNum}h (${_formatTempoDetalhado(picoValor)} ativos)`;
      elPeakCallout.style.display = '';
    } else {
      elPeakCallout.style.display = 'none';
    }
  }

  if (elInsight) {
    if (!periodoDominante) {
      elInsight.textContent = 'Continue estudando para gerar seu perfil de engajamento.';
    } else {
      const horaTxt = total > 0 ? `, com pico às ${horaPicoNum}h (${_formatTempoDetalhado(picoValor)})` : '';
      elInsight.textContent = `Você costuma manter engajamento ativo principalmente à ${periodoDominante.label.toLowerCase()}${horaTxt}.`;
    }
  }
}

/* Lê um submapa de perfil_uso suportando dois formatos possíveis do
   documento no Firestore:
     1. Aninhado correto:  perfil.hourHeatmap = { "11": 115, "12": 39 }
     2. Chave plana com ponto literal no nome (formato real constatado
        em produção via inspeção direta do documento):
        perfil["hourHeatmap.11"] = 115, perfil["hourHeatmap.12"] = 39
   Não altera nada em session-tracker.js nem no Firestore — apenas
   normaliza a leitura para o formato que o render já espera,
   funcionando com documentos já existentes E com qualquer escrita
   futura que venha corretamente aninhada. */
function _extrairMapaAninhado(perfil, prefixo) {
  if (!perfil) return {};
  if (perfil[prefixo] && typeof perfil[prefixo] === 'object' && !Array.isArray(perfil[prefixo])) {
    return perfil[prefixo];
  }

  const resultado = {};
  const prefixoComPonto = `${prefixo}.`;
  Object.keys(perfil).forEach(chave => {
    if (chave.startsWith(prefixoComPonto)) {
      const subchave = chave.slice(prefixoComPonto.length);
      resultado[subchave] = perfil[chave];
    }
  });
  return resultado;
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
   RENDER — NAVIGATION ANALYTICS
   ─────────────────────────────────────────────
   Cuidam SOMENTE de páginas mais acessadas e
   histórico de navegação. Heatmap/dispositivo têm
   fonte própria (Perfil de Uso Global — ver acima).
══════════════════════════════════════════════ */
function _renderNavegacaoAoVivo(stats) {
  if (!stats) return;
  _renderPaginasMaisAcessadas(stats.navPages);
  _renderFluxoNavegacao(stats.navSequence);
}

function _renderNavegacaoPersistida(sessao) {
  if (!sessao) return;
  _renderPaginasMaisAcessadas(sessao.pages);
  _renderFluxoNavegacao(sessao.navigation);
}

function _renderNavegacaoVazia() {
  _renderPaginasMaisAcessadas(null);
  _renderFluxoNavegacao(null);
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

/* ══════════════════════════════════════════════
   UTILITÁRIOS — histórico/ranking expansíveis
   ─────────────────────────────────────────────
   Compartilhados entre _renderPaginasMaisAcessadas
   e _renderFluxoNavegacao. Apenas apresentação —
   não tocam em dados, tracking ou lógica de negócio.
══════════════════════════════════════════════ */
const NAV_ITENS_VISIVEIS = 3;

/* Mede a altura real dos N primeiros itens já renderizados no DOM
   e aplica como max-height inline. Mais preciso que um valor fixo
   em CSS, pois a altura de cada item varia entre ranking e histórico
   (conteúdo diferente) e pode mudar com fonte/zoom do navegador. */
function _aplicarAlturaVisivel(entriesEl, qtdVisivel) {
  const itens = entriesEl.children;
  if (itens.length <= qtdVisivel) {
    entriesEl.style.maxHeight = '';
    return;
  }
  let altura = 0;
  for (let i = 0; i < qtdVisivel; i++) {
    altura += itens[i].getBoundingClientRect().height;
  }
  entriesEl.style.maxHeight = `${Math.ceil(altura)}px`;
}

/* Isola o scroll da lista: enquanto ainda houver conteúdo para rolar
   na direção do gesto, o wheel é totalmente interceptado (preventDefault)
   e aplicado manualmente ao contêiner interno — nada vaza para a página.
   Só quando a lista já está no limite (topo/fundo) o evento segue seu
   curso normal, liberando o scroll da página. */
function _isolarScrollWheel(entriesEl) {
  entriesEl.addEventListener('wheel', (e) => {
    const { scrollTop, scrollHeight, clientHeight } = entriesEl;
    const podeDescer = scrollTop + clientHeight < scrollHeight - 1;
    const podeSubir  = scrollTop > 0;

    if ((e.deltaY > 0 && podeDescer) || (e.deltaY < 0 && podeSubir)) {
      e.preventDefault();
      entriesEl.scrollTop += e.deltaY;
    }
  }, { passive: false });
}

/* Estado dos toggles "ver todos" — ficam fora das funções de render
   para persistir entre re-renders (ranking e histórico são atualizados
   a cada tick do session-tracker, então uma variável local se perderia). */
let _historicoExpandido = false;
let _paginasExpandido   = false;

function _renderPaginasMaisAcessadas(pages) {
  const wrap = document.getElementById('nav-paginas-lista');
  if (!wrap) return;

  /* Preserva a posição de rolagem entre re-renders. A lista é
     redesenhada a cada tick do session-tracker (cronômetro ao vivo),
     o que recriava o contêiner do zero e resetava scrollTop para 0 —
     dando a impressão de que o scroll "voltava sozinho" durante o uso. */
  const scrollAnterior = wrap.querySelector('.nav-rank-entries')?.scrollTop ?? 0;

  wrap.innerHTML = '';
  wrap.className = 'nav-rank-list';

  const entradas = pages && typeof pages === 'object' ? Object.entries(pages) : [];

  const grupos = new Map();

  entradas.forEach(([pathname, info]) => {
    const visits = info?.visits ?? 0;
    const time   = info?.time   ?? 0;
    const label  = _normalizarRotaParaLabel(pathname);

    const grupo = grupos.get(label);
    if (!grupo) {
      grupos.set(label, {
        label,
        pathnameRepresentativo: pathname,
        maiorVisitasIndividual: visits,
        visits,
        time,
      });
    } else {
      grupo.visits += visits;
      grupo.time   += time;
      if (visits > grupo.maiorVisitasIndividual) {
        grupo.maiorVisitasIndividual = visits;
        grupo.pathnameRepresentativo = pathname;
      }
    }
  });

  const todasRelevantes = Array.from(grupos.values())
    .filter(g => g.visits >= 2)
    .map(g => ({
      label:    g.label,
      pathname: g.pathnameRepresentativo,
      visits:   g.visits,
      time:     g.time,
      score:    g.visits * 10 + g.time,
    }))
    .sort((a, b) => b.score - a.score);

  if (!todasRelevantes.length) {
    const vazio = document.createElement('div');
    vazio.className = 'nav-rank-empty';
    vazio.textContent = 'Nenhuma página com 2 ou mais visitas ainda.';
    wrap.appendChild(vazio);
    return;
  }

  const LIMITE_COLAPSADO = NAV_ITENS_VISIVEIS;
  const temMais = todasRelevantes.length > LIMITE_COLAPSADO;

  if (!temMais) _paginasExpandido = false;

  const relevantes = _paginasExpandido
    ? todasRelevantes
    : todasRelevantes.slice(0, LIMITE_COLAPSADO);

  const entriesEl = document.createElement('div');
  entriesEl.className = 'nav-rank-entries' + (_paginasExpandido ? ' is-expandido' : '');

  relevantes.forEach(({ label, pathname, visits, time }, idx) => {
    const { chave } = _extrairChaveDeRota(pathname) ?? {};
    const rank  = idx + 1;
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
        <div class="nav-rank-name${isTop ? ' is-top' : ''}">${_escapeHtmlNav(label)}</div>
        <div class="nav-rank-meta">
          <span class="nav-rank-stat"><strong>${visits}</strong> visita${visits !== 1 ? 's' : ''}</span>
          <span class="nav-rank-stat"><strong>${formatTimeHuman(time)}</strong> tempo total</span>
        </div>
      </div>
    `;

    entriesEl.appendChild(item);
  });

  wrap.appendChild(entriesEl);

  if (_paginasExpandido) {
    _aplicarAlturaVisivel(entriesEl, NAV_ITENS_VISIVEIS);
    entriesEl.scrollTop = scrollAnterior;
    _isolarScrollWheel(entriesEl);
  }

  if (temMais) {
    const toggle = document.createElement('button');
    toggle.type       = 'button';
    toggle.className  = 'nav-rank-toggle';
    toggle.textContent = _paginasExpandido
      ? 'Mostrar menos'
      : `Ver todas as páginas (${todasRelevantes.length})`;
    toggle.addEventListener('click', () => {
      _paginasExpandido = !_paginasExpandido;
      _renderPaginasMaisAcessadas(pages);
    });
    wrap.appendChild(toggle);
  }
}

function _escapeHtmlNav(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function _renderFluxoNavegacao(navigation) {
  const wrap = document.getElementById('nav-fluxo');
  if (!wrap) return;

  /* Preserva scrollTop entre re-renders — mesma causa e mesmo
     remédio de _renderPaginasMaisAcessadas (ver comentário lá). */
  const scrollAnterior = wrap.querySelector('.nav-tl-entries')?.scrollTop ?? 0;

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

  /* ── Ordem de exibição: mais recente primeiro ──────────────────
     semRep vem em ordem cronológica crescente (mais antigo → mais
     recente, item atual por último). Invertendo aqui, o item mais
     recente (atual) fica no índice 0. Isso garante que os 3 itens
     exibidos no modo colapsado sejam EXATAMENTE os 3 primeiros itens
     do modo expandido — o restante do histórico aparece só abaixo,
     sem reposicionar o que já estava visível. */
  const semRepRecenteAntes = [...semRep].reverse();

  const LIMITE_COLAPSADO = NAV_ITENS_VISIVEIS;
  const temMais = semRepRecenteAntes.length > LIMITE_COLAPSADO;

  if (!temMais) _historicoExpandido = false;

  const exibir = _historicoExpandido
    ? semRepRecenteAntes
    : semRepRecenteAntes.slice(0, LIMITE_COLAPSADO);

  const agora = Date.now();

  const entriesEl = document.createElement('div');
  entriesEl.className = 'nav-tl-entries' + (_historicoExpandido ? ' is-expandido' : '');

  exibir.forEach((pathname, idx) => {
    /* idx 0 = item mais recente (atual), pois "exibir" já está
       em ordem "mais recente primeiro". */
    const isCurrent    = idx === 0;
    const minutosAtras = idx * 3;
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

    entriesEl.appendChild(entry);
  });

  wrap.appendChild(entriesEl);

  if (_historicoExpandido) {
    _aplicarAlturaVisivel(entriesEl, NAV_ITENS_VISIVEIS);
    entriesEl.scrollTop = scrollAnterior;
    _isolarScrollWheel(entriesEl);
  }

  if (temMais) {
    const toggle = document.createElement('button');
    toggle.type       = 'button';
    toggle.className  = 'nav-tl-toggle';
    toggle.textContent = _historicoExpandido
      ? 'Mostrar menos'
      : `Ver histórico completo (${semRepRecenteAntes.length})`;
    toggle.addEventListener('click', () => {
      _historicoExpandido = !_historicoExpandido;
      _renderFluxoNavegacao(navigation);
    });
    wrap.appendChild(toggle);
  }

const footer = document.createElement('div');
footer.className = 'nav-tl-footer';
footer.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
  class="lucide lucide-history-icon lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
  <path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
  Atualizado agora há pouco
`;
wrap.appendChild(footer);
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
  _renderPerfilUso(null);
}

/* ══════════════════════════════════════════════
   PERFIL DE USO — ATUALIZAÇÃO EM TEMPO REAL
   ─────────────────────────────────────────────
   session-tracker.js despacha 'nexus:perfilUsoAtualizado' assim que
   consolida um flush (imediatamente ao entrar na página, e a cada
   heartbeat). Ouvindo aqui, o card se atualiza sozinho — cobre o
   caso de sessões curtas, onde o primeiro flush pode terminar DEPOIS
   que _carregarMetricasReais() já tinha rodado e renderizado vazio.
══════════════════════════════════════════════ */
document.addEventListener('nexus:perfilUsoAtualizado', () => {
  const usuario = getUsuario?.();
  if (!usuario?.uid) return;
  carregarPerfilUso(usuario.uid).then(_renderPerfilUso).catch(() => {});
});

export { _renderMetricasVazio, _renderNavegacaoAoVivo };