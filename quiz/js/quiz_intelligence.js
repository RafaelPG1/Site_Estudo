// @ts-nocheck
/* ============================================================
   NEXUS STUDY — quiz/js/quiz_intelligence.js

   CAMADA 3 v3 — Quiz Intelligence (cérebro do sistema)
   ─────────────────────────────────────────────────────
   RESPONSABILIDADE TOTAL de inteligência de aprendizado:

     ✔ Receber payload BRUTO de nexus:quizFinalizado
     ✔ Calcular acertos, erros, taxa de acerto
     ✔ Calcular tempo por questão e tempo total
     ✔ Persistir registro imutável em performance/* (Firebase)
     ✔ Consolidar histórico: diário, semanal, resumo geral
     ✔ Detectar padrões de erro e tendências de evolução
     ✔ Calcular nível estimado, consistência, dificuldade
     ✔ Notificar assinantes via subscribe()

   POR QUE O ENGINE NÃO FAZ MAIS ISSO (v10 → v3):
     O quiz_engine.js (v10) despacha um CustomEvent
     'nexus:quizFinalizado' com o payload BRUTO:
       { disc, modo, semestre, totalQuestoes,
         respostasBrutas, gabarito, startedAt, endedAt,
         revealed }
     Este módulo é o ÚNICO responsável por cruzar
     respostasBrutas x gabarito e derivar qualquer métrica.
     O engine nunca chama funções deste módulo diretamente.

   PIPELINE PERSISTENTE (idêntico à v2, agora alimentado
   pelo payload bruto em vez de ler o Firebase sozinho):
     1. Ouve nexus:quizFinalizado → calcula acertos a partir
        do payload → salva em performance/* → consolida.
     2. No boot (uid resolvido) → consolida histórico completo.
     3. Sob demanda via window.NexusQuizIntelligence.consolidar().

   IDEMPOTÊNCIA:
     consolidarUsuario(uid) reconstrói TUDO do zero lendo
     performance/* do Firestore. Pode rodar N vezes com
     o mesmo resultado.

   NÃO FAZ:
     ✗ UI / dashboard / gráficos
     ✗ Alterações em quiz_engine.js
     ✗ Alterações em session-tracker.js
   ============================================================ */

import {
  salvarPerformanceQuiz,
  listarPerformanceQuiz,
  listarQuizIds,
  carregarEvolutionSummary,
  carregarEvolutionDaily,
  carregarEvolutionWeekly,
  carregarEvolutionDailyRange,
  gravarConsolidacaoEvolucao,
} from '../../src/firebase.js';

/* ══════════════════════════════════════════════
   CONSTANTES
══════════════════════════════════════════════ */
const JANELA_RECENTE       = 3;
const JANELA_MINIMA_TREND  = 2;
const DESVIO_INSTAVEL      = 18;
const MELHORA_MINIMA_PCT   = 5;

const FAIXAS_NIVEL = [
  { min: 0.90, nivel: 'avançado'      },
  { min: 0.75, nivel: 'proficiente'   },
  { min: 0.55, nivel: 'intermediário' },
  { min: 0.35, nivel: 'iniciante'     },
  { min: 0.00, nivel: 'fundamentos'   },
];

const _listeners = new Set();

/* estado interno — lock local de consolidação concorrente */
let _uidAtual              = null;
let _consolidandoAgora     = false;
let _consolidacaoPendente  = false;
let _ultimoSummaryConhecido = null;

/* ══════════════════════════════════════════════
   UTILITÁRIOS NUMÉRICOS PUROS
══════════════════════════════════════════════ */
function _media(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function _desvioPadrao(arr) {
  if (!arr || arr.length < 2) return 0;
  const m = _media(arr);
  return Math.sqrt(_media(arr.map(v => (v - m) ** 2)));
}
function _arredondar(n, casas = 1) {
  const f = 10 ** casas;
  return Math.round((n + Number.EPSILON) * f) / f;
}
function _clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

/* ══════════════════════════════════════════════
   CÁLCULO DE ACERTOS A PARTIR DO PAYLOAD BRUTO
   ─────────────────────────────────────────────
   NOVO em v3: o engine não calcula mais acertos.
   Ele envia respostasBrutas (qi → alternativa escolhida)
   e gabarito (qi → alternativa correta).
   Esta função cruza os dois e retorna { acertos, erros }.
══════════════════════════════════════════════ */
function _calcularAcertosDoPayload(payload) {
  const { respostasBrutas, gabarito, totalQuestoes } = payload;

  if (!respostasBrutas || !gabarito) {
    return { acertos: 0, erros: 0, respondidas: 0 };
  }

  let acertos    = 0;
  let erros      = 0;
  let respondidas = 0;

  for (let qi = 0; qi < totalQuestoes; qi++) {
    const resp = respostasBrutas[qi];
    if (resp === undefined || resp === null) continue;
    respondidas++;
    if (parseInt(resp) === parseInt(gabarito[qi])) {
      acertos++;
    } else {
      erros++;
    }
  }

  return { acertos, erros, respondidas };
}

/* ══════════════════════════════════════════════
   DATAS — dateKey (YYYY-MM-DD) e weekKey (YYYY-Www)
══════════════════════════════════════════════ */
function _dateKey(ts) {
  const d  = new Date(ts);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function _weekKey(ts) {
  const d    = new Date(ts);
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + (4 - dayNum));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNum   = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

function _dateKeyHoje() { return _dateKey(Date.now()); }

/* ══════════════════════════════════════════════
   NORMALIZAÇÃO DE TENTATIVAS
   (leitura do Firestore — formato performance/*)
══════════════════════════════════════════════ */
function _normalizarTentativa(raw) {
  if (!raw) return null;

  const total   = Number(raw.totalQuestoes) || 0;
  const acertos = Number(raw.acertos) || 0;
  const taxa    = typeof raw.taxaAcerto === 'number'
    ? raw.taxaAcerto
    : (total > 0 ? acertos / total : 0);

  const ts = raw.endedAt ?? raw.ts ?? raw.startedAt ?? Date.now();

  return {
    id:            raw.id ?? null,
    quizId:        raw.quizId ?? null,
    disc:          raw.disc ?? null,
    modo:          raw.modo ?? null,
    semestre:      raw.semestre ?? null,
    totalQuestoes: total,
    acertos,
    taxaAcerto:    _clamp(taxa, 0, 1),
    tempoGastoSeg: Number(raw.tempoGastoSeg) || 0,
    tempoPorQuestaoSeg: total > 0 ? (Number(raw.tempoGastoSeg) || 0) / total : 0,
    revealed:      !!raw.revealed,
    startedAt:     raw.startedAt ?? null,
    endedAt:       ts,
    dateKey:       _dateKey(ts),
    weekKey:       _weekKey(ts),
  };
}

function _classificarFaixa(taxa) {
  for (const faixa of FAIXAS_NIVEL) if (taxa >= faixa.min) return faixa.nivel;
  return FAIXAS_NIVEL[FAIXAS_NIVEL.length - 1].nivel;
}

/* ══════════════════════════════════════════════
   ANÁLISE PURA — mesma função para qualquer
   granularidade (dia, semana, histórico total)
══════════════════════════════════════════════ */
function _calcularInsight(tentativasNormalizadas) {
  const tentativas = tentativasNormalizadas
    .slice()
    .sort((a, b) => (a.endedAt ?? 0) - (b.endedAt ?? 0));

  if (tentativas.length === 0) return _insightVazio();

  const taxas       = tentativas.map(t => t.taxaAcerto);
  const tempos      = tentativas.map(t => t.tempoPorQuestaoSeg);
  const taxaMedia   = _media(taxas);
  const tempoMedio  = _media(tempos);
  const desvioTaxas = _desvioPadrao(taxas) * 100;

  const porDisciplina   = _agruparPorDisciplina(tentativas);
  const padroesErro     = _detectarPadroesDeErro(tentativas);
  const tendencia       = _calcularTendencia(taxas);
  const estabilidade    = _classificarEstabilidade(desvioTaxas, tendencia);
  const dificuldadeMedia = _estimarDificuldadeMedia(tentativas);
  const scoreGeral      = _calcularScoreGeral(taxaMedia, tendencia, estabilidade);

  return {
    totalTentativas: tentativas.length,
    performance: {
      taxaAcertoMediaPct:      _arredondar(taxaMedia * 100),
      taxaAcertoUltimaPct:     _arredondar(taxas[taxas.length - 1] * 100),
      taxaAcertoPrimeiraPct:   _arredondar(taxas[0] * 100),
      tempoMedioPorQuestaoSeg: _arredondar(tempoMedio, 1),
      porDisciplina,
      padroesDeErro: padroesErro,
    },
    evolucao: {
      tendencia,
      consistencia:    estabilidade,
      desvioPadraoPct: _arredondar(desvioTaxas),
    },
    metricasDerivadas: {
      nivelEstimadoGeral: _classificarFaixa(taxaMedia),
      nivelEstimadoPorDisc: Object.fromEntries(
        Object.entries(porDisciplina).map(([disc, d]) => [disc, _classificarFaixa(d.taxaAcertoMedia)])
      ),
      estabilidade,
      dificuldadeMediaEstimada: dificuldadeMedia,
      scoreGeral,
    },
  };
}

function _insightVazio() {
  return {
    totalTentativas: 0,
    performance: {
      taxaAcertoMediaPct: null, taxaAcertoUltimaPct: null, taxaAcertoPrimeiraPct: null,
      tempoMedioPorQuestaoSeg: null, porDisciplina: {}, padroesDeErro: [],
    },
    evolucao: {
      tendencia: { direcao: 'indeterminado', diferencaPct: 0, confianca: 'baixa' },
      consistencia: 'indeterminado', desvioPadraoPct: 0,
    },
    metricasDerivadas: {
      nivelEstimadoGeral: null, nivelEstimadoPorDisc: {}, estabilidade: 'indeterminado',
      dificuldadeMediaEstimada: null, scoreGeral: null,
    },
  };
}

function _agruparPorDisciplina(tentativas) {
  const grupos = {};
  tentativas.forEach(t => {
    const chave = t.disc || '__sem_disciplina__';
    if (!grupos[chave]) grupos[chave] = { tentativas: [], taxas: [] };
    grupos[chave].tentativas.push(t);
    grupos[chave].taxas.push(t.taxaAcerto);
  });
  const resultado = {};
  Object.entries(grupos).forEach(([disc, g]) => {
    resultado[disc] = {
      totalTentativas:         g.tentativas.length,
      taxaAcertoMedia:         _media(g.taxas),
      taxaAcertoMediaPct:      _arredondar(_media(g.taxas) * 100),
      tempoMedioPorQuestaoSeg: _arredondar(_media(g.tentativas.map(t => t.tempoPorQuestaoSeg)), 1),
    };
  });
  return resultado;
}

function _detectarPadroesDeErro(tentativas) {
  const LIMIAR_BAIXO = 0.6;
  const porChave = {};
  tentativas.forEach(t => {
    const chave = `${t.disc || '?'} / ${t.modo || '?'}`;
    if (!porChave[chave]) porChave[chave] = { ocorrencias: 0, baixas: 0, taxas: [] };
    porChave[chave].ocorrencias++;
    porChave[chave].taxas.push(t.taxaAcerto);
    if (t.taxaAcerto < LIMIAR_BAIXO) porChave[chave].baixas++;
  });
  return Object.entries(porChave)
    .filter(([, v]) => v.baixas >= 2 || (v.ocorrencias > 0 && v.baixas / v.ocorrencias >= 0.5))
    .map(([chave, v]) => ({
      grupo:                   chave,
      ocorrenciasComErroAlto:  v.baixas,
      totalTentativas:         v.ocorrencias,
      taxaAcertoMediaPct:      _arredondar(_media(v.taxas) * 100),
    }))
    .sort((a, b) => b.ocorrenciasComErroAlto - a.ocorrenciasComErroAlto);
}

function _calcularTendencia(taxas) {
  if (taxas.length < JANELA_MINIMA_TREND) {
    return { direcao: 'indeterminado', diferencaPct: 0, confianca: 'baixa' };
  }
  const n         = taxas.length;
  const tamJanela = Math.min(JANELA_RECENTE, Math.floor(n / 2)) || 1;
  const recentes  = taxas.slice(n - tamJanela);
  const antigas   = taxas.slice(0, tamJanela);
  const diferencaPct = _arredondar((_media(recentes) - _media(antigas)) * 100);

  let direcao;
  if (Math.abs(diferencaPct) < MELHORA_MINIMA_PCT) direcao = 'estavel';
  else direcao = diferencaPct > 0 ? 'melhorando' : 'piorando';

  const confianca = n >= JANELA_RECENTE * 2 ? 'alta' : 'média';
  return { direcao, diferencaPct, confianca };
}

function _classificarEstabilidade(desvioPct, tendencia) {
  if (tendencia.direcao === 'indeterminado') return 'indeterminado';
  if (tendencia.direcao === 'melhorando' && desvioPct < DESVIO_INSTAVEL) return 'melhorando';
  if (desvioPct >= DESVIO_INSTAVEL) return 'instavel';
  return 'consistente';
}

function _estimarDificuldadeMedia(tentativas) {
  const taxaMedia  = _media(tentativas.map(t => t.taxaAcerto));
  const tempoMedio = _media(tentativas.map(t => t.tempoPorQuestaoSeg));
  const tempoAlto  = tempoMedio > 45;
  if (taxaMedia < 0.55 && tempoAlto)   return 'alta';
  if (taxaMedia < 0.55)                return 'média-alta';
  if (taxaMedia >= 0.85 && !tempoAlto) return 'baixa';
  return 'média';
}

function _calcularScoreGeral(taxaMedia, tendencia, estabilidade) {
  let score = taxaMedia * 100;
  if (tendencia.direcao === 'melhorando') score += _clamp(tendencia.diferencaPct * 0.3, 0, 10);
  if (tendencia.direcao === 'piorando')   score -= _clamp(Math.abs(tendencia.diferencaPct) * 0.3, 0, 10);
  if (estabilidade === 'instavel') score -= 5;
  if (estabilidade === 'consistente' || estabilidade === 'melhorando') score += 2;
  return _arredondar(_clamp(score, 0, 100));
}

/* ══════════════════════════════════════════════
   PROCESSAR PAYLOAD BRUTO DO ENGINE
   ─────────────────────────────────────────────
   NOVO em v3: ponto de entrada para o payload que
   chega via nexus:quizFinalizado.

   O engine despacha:
     { disc, modo, semestre, totalQuestoes,
       respostasBrutas, gabarito, startedAt,
       endedAt, revealed }

   Este módulo:
     1. Cruza respostasBrutas x gabarito → acertos
     2. Calcula taxaAcerto e tempoGastoSeg
     3. Persiste em performance/* (Firebase)
     4. Dispara consolidação incremental

   Retorna o objeto salvo (ou null em falha).
══════════════════════════════════════════════ */
async function processarPayloadBruto(payload, uid) {
  if (!payload || !uid) return null;

  const {
    disc, modo, semestre, totalQuestoes,
    respostasBrutas, gabarito,
    startedAt, endedAt, revealed,
  } = payload;

  /* Validação mínima */
  if (!totalQuestoes || totalQuestoes <= 0) {
    console.warn('[quiz_intelligence] payload inválido — totalQuestoes ausente:', payload);
    return null;
  }

  /* 1. CALCULAR acertos a partir dos dados brutos */
  const { acertos, respondidas } = _calcularAcertosDoPayload(payload);
  const taxaAcerto     = respondidas > 0 ? acertos / respondidas : 0;
  const tempoGastoSeg  = (endedAt && startedAt)
    ? Math.max(0, Math.round((endedAt - startedAt) / 1000))
    : 0;

  const quizId = `${semestre}_${modo}_${disc}`;

  /* 2. PERSISTIR no Firebase (único módulo que faz isso) */
  const registroFirebase = {
    totalQuestoes,
    acertos,
    taxaAcerto,
    tempoGastoSeg,
    startedAt: startedAt ?? endedAt,
    endedAt:   endedAt ?? Date.now(),
    modo:      modo     ?? null,
    semestre:  semestre ?? null,
    disc:      disc     ?? null,
    revealed:  !!revealed,
  };

  let idRegistro = null;
  try {
    const resultado = await salvarPerformanceQuiz(uid, quizId, registroFirebase);
    idRegistro = resultado?.id ?? null;
    console.log(
      '[quiz_intelligence] performance salva →', quizId,
      `| ${acertos}/${totalQuestoes}`,
      `(${Math.round(taxaAcerto * 100)}%)`,
      `| ${tempoGastoSeg}s`,
      revealed ? '| revelado' : ''
    );
  } catch (err) {
    console.warn('[quiz_intelligence] falha ao salvar performance:', err);
  }

  /* 3. ANALISAR esta tentativa para notificação imediata */
  const tentativaNormalizada = _normalizarTentativa({
    ...registroFirebase,
    id: idRegistro,
    quizId,
  });

  const analiseImediata = tentativaNormalizada
    ? analisarTentativa(tentativaNormalizada)
    : null;

  if (analiseImediata) {
    _notificarListeners({ tipo: 'tentativa_processada', analise: analiseImediata });
  }

  /* 4. CONSOLIDAR em background (best-effort, não bloqueia) */
  consolidarUsuario(uid).catch(() => {});

  return { registroFirebase, analiseImediata, idRegistro };
}

/* ══════════════════════════════════════════════
   PIPELINE DE CONSOLIDAÇÃO
   ─────────────────────────────────────────────
   Idêntico à v2: lê TUDO do Firestore, recalcula
   do zero, grava daily+weekly+summary.
   Idempotente — pode rodar N vezes.
══════════════════════════════════════════════ */
async function _buscarTodasTentativas(uid) {
  const quizIds = await listarQuizIds(uid);
  if (!quizIds || quizIds.length === 0) return [];

  const listas = await Promise.all(
    quizIds.map(quizId => listarPerformanceQuiz(uid, quizId).catch(() => []))
  );

  return listas
    .flat()
    .filter(Boolean)
    .map(_normalizarTentativa)
    .filter(t => t && t.totalQuestoes > 0);
}

export async function consolidarUsuario(uid) {
  if (!uid) return _insightVazio();

  if (_consolidandoAgora) {
    _consolidacaoPendente = true;
    return _ultimoSummaryConhecido ?? _insightVazio();
  }
  _consolidandoAgora = true;

  try {
    const todasTentativas = await _buscarTodasTentativas(uid);

    if (todasTentativas.length === 0) {
      const vazio = _insightVazio();
      _ultimoSummaryConhecido = vazio;
      _notificarListeners({ tipo: 'summary_atualizado', insight: vazio });
      return vazio;
    }

    const summaryInsight = _calcularInsight(todasTentativas);
    const idsProcessados = todasTentativas.map(t => t.id).filter(Boolean);

    const diasTocados    = new Set(todasTentativas.map(t => t.dateKey));
    const semanasTocadas = new Set(todasTentativas.map(t => t.weekKey));

    const summaryAnterior = await carregarEvolutionSummary(uid).catch(() => null);
    const idsJaProcessadosAntes = new Set(summaryAnterior?.processedAttemptIds || []);
    const tentativasNovas = todasTentativas.filter(t => t.id && !idsJaProcessadosAntes.has(t.id));

    const diasParaGravar = tentativasNovas.length > 0
      ? new Set(tentativasNovas.map(t => t.dateKey))
      : new Set([_dateKeyHoje()].filter(k => diasTocados.has(k)));

    for (const dia of diasParaGravar) {
      const tentativasDoDia    = todasTentativas.filter(t => t.dateKey === dia);
      const semanaDoDia        = tentativasDoDia[0]?.weekKey || _weekKey(Date.now());
      const tentativasDaSemana = todasTentativas.filter(t => t.weekKey === semanaDoDia);

      const dailyInsight  = _calcularInsight(tentativasDoDia);
      const weeklyInsight = _calcularInsight(tentativasDaSemana);

      await gravarConsolidacaoEvolucao(uid, {
        dailyKey:  dia,
        dailyData:  { ...dailyInsight, dateKey: dia, _updatedAt: Date.now() },
        weeklyKey:  semanaDoDia,
        weeklyData: { ...weeklyInsight, weekKey: semanaDoDia, _updatedAt: Date.now() },
        summaryData: {
          ...summaryInsight,
          processedAttemptIds:      idsProcessados,
          totalDiasComAtividade:    diasTocados.size,
          totalSemanasComAtividade: semanasTocadas.size,
          _updatedAt: Date.now(),
        },
      }).catch(err => console.warn('[quiz_intelligence] gravarConsolidacaoEvolucao falhou:', err));
    }

    _ultimoSummaryConhecido = summaryInsight;
    _notificarListeners({ tipo: 'summary_atualizado', insight: summaryInsight });
    return summaryInsight;

  } catch (err) {
    console.warn('[quiz_intelligence] consolidarUsuario falhou:', err);
    return _ultimoSummaryConhecido ?? _insightVazio();
  } finally {
    _consolidandoAgora = false;
    if (_consolidacaoPendente) {
      _consolidacaoPendente = false;
      setTimeout(() => { consolidarUsuario(uid).catch(() => {}); }, 0);
    }
  }
}

/* ══════════════════════════════════════════════
   LEITURA — só consome o que a consolidação gravou
══════════════════════════════════════════════ */

export async function lerSummary(uid) {
  if (!uid) return null;
  return carregarEvolutionSummary(uid);
}

export async function lerDia(uid, dateKey) {
  if (!uid || !dateKey) return null;
  return carregarEvolutionDaily(uid, dateKey);
}

export async function lerSemana(uid, weekKey) {
  if (!uid || !weekKey) return null;
  return carregarEvolutionWeekly(uid, weekKey);
}

export async function lerSerieDiaria(uid, dias = 30) {
  if (!uid) return [];
  const hoje = new Date();
  const keys = [];
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(hoje);
    d.setDate(d.getDate() - i);
    keys.push(_dateKey(d.getTime()));
  }
  const mapa = await carregarEvolutionDailyRange(uid, keys);
  return keys.map(key => ({ dateKey: key, dados: mapa[key] || null }));
}

/* ══════════════════════════════════════════════
   ANÁLISE PONTUAL (sem ir ao Firebase)
══════════════════════════════════════════════ */
export function analisarTentativa(tentativaNormalizada) {
  const t = tentativaNormalizada;
  if (!t || t.totalQuestoes <= 0) return null;
  return {
    tipo:                   'tentativa_unica',
    disc:                   t.disc,
    modo:                   t.modo,
    semestre:               t.semestre,
    taxaAcertoPct:          _arredondar(t.taxaAcerto * 100),
    acertos:                t.acertos,
    totalQuestoes:          t.totalQuestoes,
    tempoTotalSeg:          t.tempoGastoSeg,
    tempoMedioPorQuestaoSeg: _arredondar(t.tempoPorQuestaoSeg, 1),
    revelado:               t.revealed,
    classificacaoRapida:    _classificarFaixa(t.taxaAcerto),
  };
}

/* mantida por compatibilidade — análise síncrona/local de um array
   já em mãos, sem ir ao Firebase */
export function analisarHistorico(attemptsRaw) {
  const tentativas = (Array.isArray(attemptsRaw) ? attemptsRaw : [])
    .map(_normalizarTentativa)
    .filter(t => t && t.totalQuestoes > 0);
  return _calcularInsight(tentativas);
}

/* ══════════════════════════════════════════════
   GATILHO PRINCIPAL — nexus:quizFinalizado
   ─────────────────────────────────────────────
   NOVO em v3: este módulo é o ÚNICO que ouve
   nexus:quizFinalizado para fins de performance.
   O engine apenas despacha; o intelligence faz todo
   o processamento (cálculo + persistência + consolidação).
══════════════════════════════════════════════ */

async function _onQuizFinalizado(e) {
  const payload = e?.detail;
  if (!payload) return;

  const uid = _resolverUid();
  if (!uid) {
    console.warn('[quiz_intelligence] nexus:quizFinalizado recebido mas sem uid — ignorado.');
    return;
  }

  /* processarPayloadBruto faz:
     1. calcular acertos
     2. salvar em performance/*
     3. notificar listeners
     4. consolidar em background */
  await processarPayloadBruto(payload, uid).catch(err => {
    console.warn('[quiz_intelligence] falha ao processar payload:', err);
  });
}

window.addEventListener('nexus:quizFinalizado', _onQuizFinalizado);

/* ══════════════════════════════════════════════
   RECONCILIAÇÃO NO LOGIN / BOOT
══════════════════════════════════════════════ */
function _resolverUid() {
  try {
    const raw = window.NexusStorage ? window.NexusStorage.get('usuario', null) : null;
    return raw && raw.uid ? raw.uid : null;
  } catch (_) {
    return null;
  }
}

async function _reconciliarNoLogin(uid) {
  if (!uid || uid === _uidAtual) return;
  _uidAtual = uid;
  await consolidarUsuario(uid).catch(() => {});
}

document.addEventListener('nexus:loginSuccess', (e) => {
  const uid = e?.detail?.uid;
  if (uid) _reconciliarNoLogin(uid);
});

/* boot imediato — cobre reload com sessão já logada */
;(async () => {
  await new Promise(r => setTimeout(r, 50));
  const uid = _resolverUid();
  if (uid) await _reconciliarNoLogin(uid);
})();

/* ══════════════════════════════════════════════
   SUBSCRIBE
══════════════════════════════════════════════ */
function _notificarListeners(evento) {
  _listeners.forEach(fn => {
    try { fn(evento); } catch (_) { /* listener não deve quebrar o pipeline */ }
  });
}

export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

/* ══════════════════════════════════════════════
   API PÚBLICA GLOBAL
══════════════════════════════════════════════ */
window.NexusQuizIntelligence = {
  /* pipeline */
  consolidar:           (uid) => consolidarUsuario(uid || _resolverUid()),

  /* processa um payload bruto manualmente (útil para testes / backfill) */
  processarPayload:     (payload, uid) => processarPayloadBruto(payload, uid || _resolverUid()),

  /* leitura — só consome o que a consolidação persistiu */
  lerSummary,
  lerDia,
  lerSemana,
  lerSerieDiaria,

  /* análise local, sem ir ao Firebase */
  analisarTentativa,
  analisarHistorico,

  subscribe,
};