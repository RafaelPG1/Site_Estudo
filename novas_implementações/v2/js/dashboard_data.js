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

   ─────────────────────────────────────────────
   AJUSTES — CARD "NAVEGAÇÃO" (Páginas mais acessadas
   e Histórico de navegação)
   ─────────────────────────────────────────────
   1. Correção de páginas duplicadas no ranking:
      _renderPaginasMaisAcessadas agora agrupa por
      RÓTULO NORMALIZADO (não pelo pathname bruto),
      já que pathnames diferentes podem resolver
      para o mesmo label visível (ex.: "/" e
      "/index.html" → "Início"). Ver comentário
      dentro da função.

   2. Limite inicial de 3 itens + expandir/recolher:
      tanto o ranking quanto o histórico exibem no
      máximo 3 itens por padrão. Um botão permite
      expandir para ver todos os registros, com
      rolagem interna isolada (sem afetar o scroll
      da página) e sem alterar a altura do card.

   Nenhuma lógica de coleta, tracking ou persistência
   de dados foi alterada — apenas apresentação.

   ─────────────────────────────────────────────
   AJUSTE — REDESIGN "PERFIL DE USO"
   ─────────────────────────────────────────────
   _renderHeatmapHorario continua calculando
   EXATAMENTE os mesmos valores de sempre (mapa por
   hora, maxVal, total, horaPicoNum, somas por
   período via USAGE_PERIODOS). A única mudança é
   que, além de renderizar como antes, agora também:
     · desenha um eixo Y no gráfico (apenas exibição
       do maxVal já calculado);
     · exibe uma pílula com o nome do período no chip
       de "Horário mais ativo" (mesmo período já
       encontrado via USAGE_PERIODOS.find);
     · troca a lista simples de períodos por cards
       com ícone (mesmos soma/pct já calculados);
     · guarda o resultado em `_ultimoPerfilUso`
       (módulo) para a nova seção "Seus hábitos de
       estudo" reaproveitar sem recalcular nada.
   O antigo parágrafo de insight (#usage-insight) foi
   removido do HTML; a mesma frase que ele exibia
   agora é reaproveitada como descrição do card de
   hábito "Mais ativo à ...".
   `_renderHabitosEstudo` é a única função nova:
   ela NÃO calcula nada — apenas lê `_ultimoPerfilUso`
   (gerado por `_renderHeatmapHorario`) e
   `stats.ultimos7` (já calculado por
   carregarEstatisticas, mesma fórmula usada em
   "Dias ativos nos últimos 7") e formata os dois
   cards de hábito.

   ─────────────────────────────────────────────
   AJUSTE — REORGANIZAÇÃO DE PERSISTÊNCIA (aprovada)
   ─────────────────────────────────────────────
   1. O card "Perfil de uso" (heatmap por hora +
      dispositivo) deixou de depender da última sessão
      persistida (fallback frágil e não-semestral).
      Passa a consumir exclusivamente
      session-tracker.carregarPerfilUso(uid, semestre),
      que lê o documento consolidado
      perfil_uso/{semestre} do Firebase — um heatmap
      por semestre, não vitalício.
      _renderHeatmapHorario e _renderDispositivo NÃO
      mudaram de contrato: continuam recebendo
      exatamente os mesmos formatos de dados
      (hourHeatmap: objeto por hora / deviceType:
      string) e calculando exatamente o mesmo que já
      calculavam. Só mudou de onde o dado vem.

   2. O card "Navegação" (páginas mais acessadas +
      histórico) continua usando a sessão ao vivo ou a
      última sessão persistida como antes — nenhuma
      mudança de comportamento aqui. Apenas foi
      desacoplado do heatmap/dispositivo, que agora tem
      fonte própria (item 1).

   3. setSemestreAtivo(State.semestre) é chamado antes
      de carregar as métricas para que session-tracker.js
      (que roda em todas as páginas, sem acesso direto ao
      State do Dashboard) saiba qual semestre gravar/ler
      em perfil_uso. Reaproveita a mesma fonte de verdade
      que o Dashboard já usa (State.semestre) — nenhuma
      nova variável/configuração foi criada.

   Nenhuma mudança de cálculo, contrato público, HTML ou
   renderização dos demais cards.
   ============================================= */

import { getUsuario } from '../../../src/global.js';

/* ── Session Tracker ── */
import {
  formatTimeHuman,
  carregarEstatisticas,
  getStats        as sessionGetStats,
  setSemestreAtivo,
  carregarPerfilUso,
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
══════════════════════════════════════════════ */
export async function _carregarMetricasReais() {
  const _t0 = performance.now();
  const usuario = getUsuario?.();
  if (!usuario?.uid) {
    _renderMetricasVazio();
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

  try {
    const _tPromiseAll = performance.now();
    const [stats, ultimaSessao, perfilUso] = await Promise.all([
      statsPromise.then(r => { perfLog('Promise.all (item)', '_carregarMetricasReais :: carregarEstatisticas', performance.now() - _tPromiseAll); return r; }),
      ultimaSessaoPromise.then(r => { perfLog('Promise.all (item)', '_carregarMetricasReais :: ultimaSessaoPromise', performance.now() - _tPromiseAll); return r; }),
      carregarPerfilUso(usuario.uid, State.semestre).then(r => { perfLog('Promise.all (item)', '_carregarMetricasReais :: carregarPerfilUso', performance.now() - _tPromiseAll); return r; }),
    ]);
    perfLog('Promise.all', '_carregarMetricasReais :: total do conjunto (3 itens)', performance.now() - _tPromiseAll);

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

      const _tRenderPerfil = performance.now();
      _renderPerfilUsoConsolidado(perfilUso);
      _renderUsageInsight();
      perfLog('Render', '_carregarMetricasReais :: render perfil de uso (heatmap + dispositivo + insight)', performance.now() - _tRenderPerfil);
    }

  } catch (err) {
    console.error('[dashboard] _carregarMetricasReais:', err);
    _renderMetricasVazio();
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
   RENDER — >Perfil de uso (últimos 30 dias)
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

/* Agrupamento de horas em períodos do dia — apenas apresentação,
   reaproveita o mesmo hourHeatmap já calculado (agora vindo de
   perfil_uso/{semestre} em vez da sessão). Cores seguem os
   modificadores já existentes de .prog-fill. */
const USAGE_PERIODOS = [
  { id: 'madrugada', label: 'Madrugada', horas: [0,1,2,3,4,5],   corClasse: 'blue'  },
  { id: 'manha',     label: 'Manhã',     horas: [6,7,8,9,10,11], corClasse: 'amber' },
  { id: 'tarde',     label: 'Tarde',     horas: [12,13,14,15,16,17], corClasse: 'green' },
  { id: 'noite',     label: 'Noite',     horas: [18,19,20,21,22,23], corClasse: 'purple'    },
];

/* Guarda o último resultado calculado por _renderHeatmapHorario
   (período dominante + sua % + frase de insight já existente),
   para a seção "Seus hábitos de estudo" reaproveitar sem recalcular
   nada. Populado sempre que o heatmap é renderizado (via perfil_uso
   consolidado ou estado vazio). */
let _ultimoPerfilUso = {
  temDados:     false,
  periodoId:    null,
  periodoLabel: null,
  periodoPct:   0,
  descricao:    'Continue estudando para gerar seu perfil de uso.',
};

/* Ícones por período do dia — puramente decorativo, mesmo padrão
   de ícone-linha (stroke) usado no restante do dashboard. */
function _iconePeriodo(id) {
  const ICONES = {
    madrugada: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9.6 2.2a5.4 5.4 0 106.2 6.7A4.3 4.3 0 019.6 2.2z"/></svg>`,
    manha:     `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8.2a3.5 3.5 0 017 0"/><path d="M7.5 3.5v1.4M2.6 8.2h1.2M11.2 8.2h1.2M4 5l.9.9M11 5l-.9.9"/><path d="M1.8 11h11.4"/></svg>`,
    tarde:     `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="7.5" r="2.6"/><path d="M7.5 1.6v1.3M7.5 12.1v1.3M1.6 7.5h1.3M12.1 7.5h1.3M3.3 3.3l.9.9M10.3 3.3l-.9.9M3.3 11.7l.9-.9M10.3 11.7l-.9-.9"/></svg>`,
    noite:     `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9.6 2.2a5.4 5.4 0 106.2 6.7A4.3 4.3 0 019.6 2.2z"/><path d="M12.3 1.6l.35.9.9.35-.9.35-.35.9-.35-.9-.9-.35.9-.35z" fill="currentColor" stroke="none"/></svg>`,
  };
  return ICONES[id] ?? ICONES.noite;
}

/* Ícone de calendário reaproveitado para o card de frequência de
   estudo — mesmo estilo do ícone já usado no menu "Calendário". */
function _iconeCalendarioHabito() {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1.5" y="3" width="13" height="11" rx="1.5"/><path d="M5 1.5V4M11 1.5V4M1.5 7h13"/></svg>`;
}

/* ══════════════════════════════════════════════
   RENDER — PERFIL DE USO CONSOLIDADO (Firebase)
   ─────────────────────────────────────────────
   Nova função (v8). Substitui a antiga dependência
   de sessão para alimentar o heatmap/dispositivo:
   recebe o objeto já lido de perfil_uso/{semestre}
   (via carregarPerfilUso) e delega para as MESMAS
   funções de render de sempre — _renderHeatmapHorario
   e _renderDispositivo — sem alterar o contrato ou
   o cálculo interno delas.
══════════════════════════════════════════════ */
function _renderPerfilUsoConsolidado(perfilUso) {
  _renderHeatmapHorario(perfilUso?.hourHeatmap ?? null);
  _renderDispositivo(perfilUso?.deviceType ?? null);
}

/* ══════════════════════════════════════════════
   RENDER — NAVIGATION ANALYTICS
   ─────────────────────────────────────────────
   Agora cuidam SOMENTE de páginas mais acessadas e
   histórico de navegação. Heatmap/dispositivo saíram
   daqui e passaram para _renderPerfilUsoConsolidado,
   com fonte própria (perfil_uso/{semestre}).
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
  class="lucide lucide-clock2-icon lucide-clock-2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4-2"/>
  </svg>
  Atualizado agora há pouco
`;
wrap.appendChild(footer);
}


function _renderHeatmapHorario(hourHeatmap) {
  const wrap = document.getElementById('nav-heatmap');
  if (!wrap) return;

  wrap.innerHTML = '';

  const mapa     = hourHeatmap && typeof hourHeatmap === 'object' ? hourHeatmap : {};
  const valores  = Object.values(mapa);
  const maxVal   = Math.max(...valores, 1);
  const total    = valores.reduce((a, b) => a + (b || 0), 0);
  const temDados = total > 0;

  let horaPicoNum = null;
  if (temDados) {
    const entradas = Object.entries(mapa).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
    horaPicoNum = Number(entradas[0][0]);
  }

  /* Barras — mesma lógica de altura de antes, apenas com destaque
     visual para a barra do horário de pico (puramente apresentação). */
  for (let h = 0; h < 24; h++) {
    const count = mapa[String(h)] ?? 0;
    const col   = document.createElement('div');
    col.className = 'heatmap-col';
    col.title   = `${h}h · ${count} acesso${count !== 1 ? 's' : ''}`;

    const bar     = document.createElement('div');
    bar.className = 'heatmap-bar';
    if (temDados && h === horaPicoNum) bar.classList.add('heatmap-bar-peak');
    bar.style.height = (count > 0 ? Math.max(8, (count / maxVal) * 100) : 0) + '%';

    col.appendChild(bar);
    wrap.appendChild(col);
  }

  /* Eixo Y — apenas exibição do maxVal já calculado acima (0 / metade /
     máximo). Nenhum cálculo de negócio novo. */
  const yaxisEl = document.getElementById('usage-heatmap-yaxis');
  if (yaxisEl) {
    yaxisEl.innerHTML = temDados
      ? `<span>${maxVal}</span><span>${Math.round(maxVal / 2)}</span><span>0</span>`
      : `<span>—</span><span>—</span><span>0</span>`;
  }

  const labelEl = document.getElementById('nav-horario-pico');
  if (labelEl) {
    labelEl.textContent = temDados ? `${horaPicoNum}h–${horaPicoNum + 1}h` : '—';
  }

  const totalEl = document.getElementById('usage-heatmap-total');
  if (totalEl) {
    totalEl.textContent = temDados ? `${total} acesso${total !== 1 ? 's' : ''}` : 'Sem dados';
  }

  /* Período que contém o horário de pico — mesmo cálculo que já
     existia para compor a frase de insight. Reaproveitado também
     para a pílula no chip "Horário mais ativo". */
  const periodoDoPico = temDados
    ? USAGE_PERIODOS.find(p => p.horas.includes(horaPicoNum))
    : null;

  const badgeEl = document.getElementById('usage-horario-badge');
  if (badgeEl) {
    if (temDados && periodoDoPico) {
      badgeEl.textContent = periodoDoPico.label;
      badgeEl.classList.add('is-visible');
    } else {
      badgeEl.classList.remove('is-visible');
      badgeEl.textContent = '';
    }
  }

  /* Resumo por período — soma das mesmas contagens do heatmap,
     agrupadas em 4 faixas. Nenhum dado novo, apenas reagrupamento
     (mesma lógica de sempre, agora renderizada como cards). */
  const periodsWrap = document.getElementById('usage-periods-row');
  let periodoDominante = null;

  if (periodsWrap) {
    periodsWrap.innerHTML = '';

    if (!temDados) {
      periodsWrap.innerHTML = `<span class="usage-periods-empty">Sem dados suficientes ainda.</span>`;
    } else {
      const somas = USAGE_PERIODOS.map(p => ({
        ...p,
        soma: p.horas.reduce((s, h) => s + (mapa[String(h)] ?? 0), 0),
      }));
      const maiorSoma = Math.max(...somas.map(p => p.soma));

      somas.forEach(p => {
        const pct = total > 0 ? Math.round((p.soma / total) * 100) : 0;
        const isDominante = p.soma > 0 && p.soma === maiorSoma;

        if (isDominante && !periodoDominante) {
          periodoDominante = { id: p.id, label: p.label, pct };
        }

        const card = document.createElement('div');
        card.className = 'usage-period-card' + (isDominante ? ' is-dominant' : '');
        card.title = `${p.label}: ${p.soma} acesso${p.soma !== 1 ? 's' : ''}`;
        card.innerHTML = `
          <div class="usage-period-top">
            <span class="usage-period-icon">${_iconePeriodo(p.id)}</span>
            <span class="usage-period-name">${p.label}</span>
          </div>
          <span class="usage-period-pct">${pct}%</span>
        `;
        periodsWrap.appendChild(card);
      });
    }
  }

  /* Guarda o resultado para a seção "Seus hábitos de estudo"
     reaproveitar sem recalcular nada — mesmos valores já derivados
     acima (período dominante por soma + frase de insight já usada
     anteriormente no card, agora reaproveitada como descrição). */
  _ultimoPerfilUso = {
    temDados,
    periodoId:    periodoDominante?.id    ?? null,
    periodoLabel: periodoDominante?.label ?? null,
    periodoPct:   periodoDominante?.pct   ?? 0,
    descricao: temDados && periodoDoPico
      ? `Você costuma estudar mais durante a ${periodoDoPico.label.toLowerCase()}, por volta das ${horaPicoNum}h.`
      : 'Continue estudando para gerar seu perfil de uso.',
  };
}

/* ══════════════════════════════════════════════
   RENDER — SEUS HÁBITOS DE ESTUDO
   ─────────────────────────────────────────────
   NÃO calcula nenhuma métrica nova. Apenas lê:
     · _ultimoPerfilUso (preenchido por
       _renderHeatmapHorario logo acima — período
       dominante + % já calculados)
     · statsGlobal.ultimos7 (já calculado por
       carregarEstatisticas em session-tracker.js,
       mesma fórmula usada em "Dias ativos nos
       últimos 7" dentro de _renderTendencia)
   e formata os dois cards de resumo.
══════════════════════════════════════════════ */
/* ══════════════════════════════════════════════
   RENDER — INSIGHT DE HORÁRIO DE ESTUDO
   ─────────────────────────────────────────────
   NÃO calcula nada — apenas lê _ultimoPerfilUso.descricao,
   já preenchido por _renderHeatmapHorario logo acima.
══════════════════════════════════════════════ */
function _renderUsageInsight() {
  const el = document.getElementById('usage-insight');
  if (!el) return;
  el.textContent = _ultimoPerfilUso.descricao;
}

function _renderDispositivo(deviceType) {
  const el       = document.getElementById('nav-device-tipo');
  const iconWrap = document.getElementById('usage-device-icon');
  if (!el) return;

  const ICONE_DESKTOP = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="14" height="9" rx="1.5"/><path d="M6.5 15.5h5M9 12v3.5" stroke-linecap="round"/></svg>`;
  const ICONE_MOBILE  = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5.5" y="1.5" width="7" height="15" rx="2"/><path d="M8.25 14.2h1.5" stroke-linecap="round"/></svg>`;
  const ICONE_UNKNOWN = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="9" r="6.5"/><path d="M6.8 7.2a2.2 2.2 0 014.2.9c0 1.4-2 1.7-2 3.1" stroke-linecap="round"/><circle cx="9" cy="13" r=".4" fill="currentColor"/></svg>`;

  if (deviceType === 'mobile') {
    el.textContent = 'Mobile';
    if (iconWrap) { iconWrap.innerHTML = ICONE_MOBILE; iconWrap.className = 'usage-stat-icon ic-green'; }
  } else if (deviceType === 'desktop') {
    el.textContent = 'Desktop';
    if (iconWrap) { iconWrap.innerHTML = ICONE_DESKTOP; iconWrap.className = 'usage-stat-icon ic-purple'; }
  } else {
    el.textContent = '—';
    if (iconWrap) { iconWrap.innerHTML = ICONE_UNKNOWN; iconWrap.className = 'usage-stat-icon'; }
  }
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
  _renderPerfilUsoConsolidado(null);
  _renderUsageInsight();
}

export { _renderMetricasVazio, _renderNavegacaoAoVivo };