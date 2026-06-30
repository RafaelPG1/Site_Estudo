// @ts-nocheck
/* ============================================================
   NEXUS STUDY — quiz/js/quiz_intelligence.js

   CAMADA 3 + CAMADA 4 — Quiz Intelligence (cérebro único do sistema)
   ─────────────────────────────────────────────────────
   Este módulo concentra TODA a inteligência de aprendizado.
   Não existe arquivo paralelo de inteligência — Camada 3 e
   Camada 4 vivem dentro do mesmo módulo, sem duplicação.

   CAMADA 3 — pipeline ativo (escreve no Firebase):
     ✔ Receber payload BRUTO de nexus:quizFinalizado
     ✔ Calcular acertos, erros, taxa de acerto
     ✔ Calcular tempo por questão e tempo total
     ✔ Persistir registro imutável em performance/* (Firebase)
     ✔ Consolidar histórico: diário, semanal, resumo geral
     ✔ Detectar padrões de erro e tendências de evolução
     ✔ Calcular nível estimado, consistência, dificuldade
     ✔ Notificar assinantes via subscribe()

   CAMADA 4 — motor de evolução (somente leitura/interpretação,
   ver bloco "CAMADA 4 — MOTOR DE EVOLUÇÃO E INTERPRETAÇÃO" mais
   abaixo, logo após _buscarTodasTentativas):
     ✔ Curva de aprendizado por disciplina ao longo do tempo
     ✔ Padrão de desempenho / consistência (geral e por disciplina)
     ✔ Tendência do aluno (melhorando / estável / piorando)
     ✔ Fraquezas por disciplina (ranking + detecção de queda)
     ✔ Score evolutivo (0–100)
     ✔ Previsão simples (regressão linear leve, sem libs externas)
     ✔ Comparação entre períodos (usa daily/weekly já persistidos)
     ✔ Listar tentativas recentes (para Timeline do Dashboard)
     ✔ Contar questões respondidas (para Conquistas do Dashboard)
     A Camada 4 NUNCA escreve no Firebase — reaproveita os mesmos
     utilitários (_media, _desvioPadrao, _normalizarTentativa,
     _buscarTodasTentativas, _classificarFaixa, _calcularTendencia,
     _calcularScoreGeral, _classificarEstabilidade) já definidos
     pela Camada 3 neste mesmo arquivo, evitando qualquer duplicação
     de lógica entre módulos.

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
     o mesmo resultado. As funções da Camada 4 também são
     idempotentes pelo mesmo motivo: leem do zero, não acumulam
     estado entre chamadas, e nunca escrevem nada.

   NÃO FAZ:
     ✗ UI / dashboard / gráficos
     ✗ Alterações em quiz_engine.js
     ✗ Alterações em session-tracker.js
     ✗ Escrita no Firebase fora do pipeline da Camada 3
     ✗ Coleta de novos dados (Camada 4 é só leitura/interpretação)
   ============================================================ */

import {
  salvarPerformanceQuiz,
  listarPerformanceQuiz,
  listarQuizIds,
  carregarEvolutionSummary,
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

const JANELA_REGRESSAO_MIN = 3;
const JANELA_MEDIA_MOVEL   = 3;
const DIAS_PERIODO_PADRAO  = 7;

const _listeners = new Set();

let _uidAtual              = null;
let _consolidandoAgora     = false;
let _consolidacaoPendente  = false;
let _ultimoSummaryConhecido = null;

/* ══════════════════════════════════════════════
   CACHE EM MEMÓRIA — TENTATIVAS BRUTAS
══════════════════════════════════════════════ */
let _cacheTentativas = {
  uid:        null,
  tentativas: null,
};
let _cacheVersao = 0;

function _invalidarCacheTentativas(uid = null) {
  if (uid && _cacheTentativas.uid !== uid) return;
  _cacheTentativas = { uid: null, tentativas: null };
  _cacheVersao++;
}

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

function _regressaoLinear(valores) {
  const n = valores.length;
  if (n < JANELA_REGRESSAO_MIN) return null;

  const xs     = valores.map((_, i) => i);
  const mediaX = _media(xs);
  const mediaY = _media(valores);

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mediaX) * (valores[i] - mediaY);
    den += (xs[i] - mediaX) ** 2;
  }
  if (den === 0) return { slope: 0, intercept: mediaY };

  const slope     = num / den;
  const intercept = mediaY - slope * mediaX;
  return { slope, intercept };
}

function _mediaMovel(valores, janela = JANELA_MEDIA_MOVEL) {
  if (!valores || valores.length === 0) return [];
  return valores.map((_, i) => {
    const inicio = Math.max(0, i - janela + 1);
    const fatia  = valores.slice(inicio, i + 1);
    return _media(fatia);
  });
}

/* ══════════════════════════════════════════════
   CÁLCULO DE ACERTOS A PARTIR DO PAYLOAD BRUTO
══════════════════════════════════════════════ */
function _calcularAcertosDoPayload(payload) {
  const { respostasBrutas, gabarito, totalQuestoes } = payload;

  if (!respostasBrutas || !gabarito) {
    return { acertos: 0, erros: 0, respondidas: 0 };
  }

  let acertos     = 0;
  let erros       = 0;
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
   DATAS
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
  return `${date.getUTCFullYear()}-W${String(weekNum).padStart(2, '00')}`;
}

function _dateKeyHoje() { return _dateKey(Date.now()); }



/* ══════════════════════════════════════════════
   NORMALIZAÇÃO DE TENTATIVAS
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
   BLOCO 2 — MÉTRICAS BASE
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

  const porDisciplina    = _agruparPorDisciplina(tentativas);
  const padroesErro      = _detectarPadroesDeErro(tentativas);
  const tendencia        = _calcularTendencia(taxas);
  const estabilidade     = _classificarEstabilidade(desvioTaxas, tendencia);
  const dificuldadeMedia = _estimarDificuldadeMedia(tentativas);
  const scoreGeral       = _calcularScoreGeral(taxaMedia, tendencia, estabilidade);

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
      grupo:                  chave,
      ocorrenciasComErroAlto: v.baixas,
      totalTentativas:        v.ocorrencias,
      taxaAcertoMediaPct:     _arredondar(_media(v.taxas) * 100),
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
   BLOCO 1 — PIPELINE
══════════════════════════════════════════════ */
async function processarPayloadBruto(payload, uid) {
  if (!payload || !uid) return null;

  const {
    disc, modo, semestre, totalQuestoes,
    respostasBrutas, gabarito,
    startedAt, endedAt, revealed,
  } = payload;

  if (!totalQuestoes || totalQuestoes <= 0) {
    console.warn('[quiz_intelligence] payload inválido — totalQuestoes ausente:', payload);
    return null;
  }

  _invalidarCacheTentativas(uid);

  const { acertos, respondidas } = _calcularAcertosDoPayload(payload);
  const taxaAcerto    = respondidas > 0 ? acertos / respondidas : 0;
  const tempoGastoSeg = (endedAt && startedAt)
    ? Math.max(0, Math.round((endedAt - startedAt) / 1000))
    : 0;

  const quizId = `${semestre}_${modo}_${disc}`;

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

  consolidarUsuario(uid).catch(() => {});

  return { registroFirebase, analiseImediata, idRegistro };
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
        dailyKey:   dia,
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
    _invalidarCacheTentativas(uid);

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
   BUSCA COMPARTILHADA (cache único para pipeline
   + Camada 4)
══════════════════════════════════════════════ */
async function _buscarTodasTentativas(uid) {
  if (_cacheTentativas.uid === uid && _cacheTentativas.tentativas !== null) {
    return _cacheTentativas.tentativas;
  }

  const versaoNoInicio = _cacheVersao;

  const quizIds = await listarQuizIds(uid);
  if (!quizIds || quizIds.length === 0) {
    if (_cacheVersao === versaoNoInicio) {
      _cacheTentativas = { uid, tentativas: [] };
      _cacheVersao++;
    }
    return [];
  }

  const listas = await Promise.all(
    quizIds.map(quizId => listarPerformanceQuiz(uid, quizId).catch(() => []))
  );

  const tentativas = listas
    .flat()
    .filter(Boolean)
    .map(_normalizarTentativa)
    .filter(t => t && t.totalQuestoes > 0);

  if (_cacheVersao === versaoNoInicio) {
    _cacheTentativas = { uid, tentativas };
    _cacheVersao++;
  }
  return tentativas;
}

/* ════════════════════════════════════════════════════════════
   BLOCO 3 — CAMADA 4 — MOTOR DE EVOLUÇÃO E INTERPRETAÇÃO
   ────────────────────────────────────────────────────────────
   Todas as funções abaixo SOMENTE leem e interpretam.
   Nenhuma escreve no Firebase. Nenhuma duplica lógica da
   Camada 3. Todas reutilizam _buscarTodasTentativas e seu cache.
   ════════════════════════════════════════════════════════════ */



/* ── 2. Padrão de desempenho ── */
export async function padraoDeDesempenho(uid) {
  if (!uid) return { geral: null, porDisciplina: {} };

  const tentativas = await _buscarTodasTentativas(uid);
  if (tentativas.length === 0) return { geral: null, porDisciplina: {} };

  function _avaliar(lista) {
    const taxas = lista.map(t => t.taxaAcerto);
    if (taxas.length === 0) return null;
    const desvioPct = _desvioPadrao(taxas) * 100;
    const variacao  = taxas.length >= 2
      ? _arredondar((Math.max(...taxas) - Math.min(...taxas)) * 100)
      : 0;

    let classificacao;
    if (taxas.length < JANELA_REGRESSAO_MIN) classificacao = 'indeterminado';
    else if (desvioPct >= DESVIO_INSTAVEL)    classificacao = 'oscilante';
    else                                       classificacao = 'consistente';

    return {
      totalTentativas: taxas.length,
      desvioPadraoPct: _arredondar(desvioPct),
      variacaoMaxPct:  variacao,
      classificacao,
    };
  }

  const porDisc = {};
  tentativas.forEach(t => {
    const chave = t.disc || '__sem_disciplina__';
    if (!porDisc[chave]) porDisc[chave] = [];
    porDisc[chave].push(t);
  });

  const resultadoPorDisc = {};
  Object.entries(porDisc).forEach(([disc, lista]) => {
    resultadoPorDisc[disc] = _avaliar(lista);
  });

  return {
    geral: _avaliar(tentativas),
    porDisciplina: resultadoPorDisc,
  };
}

/* ── 3. Tendência do aluno ── */
export async function tendenciaDoAluno(uid) {
  if (!uid) return { direcao: 'indeterminado', diferencaPct: 0, confianca: 'baixa' };

  const tentativas = await _buscarTodasTentativas(uid);
  if (tentativas.length === 0) return { direcao: 'indeterminado', diferencaPct: 0, confianca: 'baixa' };

  const taxas = tentativas.map(t => t.taxaAcerto);
  return _calcularTendencia(taxas);
}

/* ── 4. Fraquezas por disciplina ── */
export async function fraquezasPorDisciplina(uid) {
  if (!uid) return [];

  const tentativas = await _buscarTodasTentativas(uid);
  if (tentativas.length === 0) return [];

  const porDisc = {};
  tentativas.forEach(t => {
    const chave = t.disc || '__sem_disciplina__';
    if (!porDisc[chave]) porDisc[chave] = [];
    porDisc[chave].push(t);
  });

  const lista = Object.entries(porDisc).map(([disc, itens]) => {
    const taxas     = itens.map(t => t.taxaAcerto);
    const taxaMedia = _media(taxas);
    const reta      = _regressaoLinear(taxas.map(v => v * 100));
    const emQueda   = !!reta && reta.slope < -0.5;

    return {
      disciplina:                disc,
      totalTentativas:           itens.length,
      taxaAcertoMediaPct:        _arredondar(taxaMedia * 100),
      nivelEstimado:             _classificarFaixa(taxaMedia),
      emQueda,
      inclinacaoPctPorTentativa: reta ? _arredondar(reta.slope, 2) : null,
    };
  });

  return lista.sort((a, b) => {
    if (a.emQueda !== b.emQueda) return a.emQueda ? -1 : 1;
    return a.taxaAcertoMediaPct - b.taxaAcertoMediaPct;
  });
}

/* ── 5. Score evolutivo ── */
export async function scoreEvolutivo(uid) {
  if (!uid) return null;

  const tentativas = await _buscarTodasTentativas(uid);
  if (tentativas.length === 0) return null;

  const taxas        = tentativas.map(t => t.taxaAcerto);
  const taxaMedia    = _media(taxas);
  const tendencia    = _calcularTendencia(taxas);
  const desvioPct    = _desvioPadrao(taxas) * 100;
  const estabilidade = _classificarEstabilidade(desvioPct, tendencia);
  const scoreGeral   = _calcularScoreGeral(taxaMedia, tendencia, estabilidade);

  return {
    scoreGeral,
    composicao: {
      taxaAcertoMediaPct: _arredondar(taxaMedia * 100),
      tendencia,
      consistencia:       estabilidade,
      desvioPadraoPct:    _arredondar(desvioPct),
    },
    nivelEstimado:   _classificarFaixa(taxaMedia),
    totalTentativas: tentativas.length,
  };
}

/* ── 6. Previsão simples ── */
export async function previsaoSimples(uid, disc = null) {
  if (!uid) return { previsaoTaxaAcertoPct: null, confianca: 'baixa', metodo: 'regressao_linear' };

  const todas      = await _buscarTodasTentativas(uid);
  const tentativas = disc ? todas.filter(t => t.disc === disc) : todas;

  if (tentativas.length < JANELA_REGRESSAO_MIN) {
    return {
      previsaoTaxaAcertoPct: null,
      confianca:  'baixa',
      metodo:     'regressao_linear',
      motivo:     'dados_insuficientes',
      amostras:   tentativas.length,
      disciplina: disc,
    };
  }

  const taxasPct = tentativas.map(t => t.taxaAcerto * 100);
  const reta     = _regressaoLinear(taxasPct);
  if (!reta) {
    return {
      previsaoTaxaAcertoPct: null,
      confianca:  'baixa',
      metodo:     'regressao_linear',
      motivo:     'dados_insuficientes',
      amostras:   tentativas.length,
      disciplina: disc,
    };
  }

  const proximoIndice   = taxasPct.length;
  const previsaoBruta   = reta.slope * proximoIndice + reta.intercept;
  const previsaoClamped = _clamp(previsaoBruta, 0, 100);

  const movel       = _mediaMovel(taxasPct);
  const ultimaMovel  = movel[movel.length - 1];
  const divergencia  = Math.abs(previsaoClamped - ultimaMovel);

  const confianca = tentativas.length >= 10 && divergencia < 10
    ? 'alta'
    : (tentativas.length >= 6 && divergencia < 15 ? 'média' : 'baixa');

  return {
    previsaoTaxaAcertoPct: _arredondar(previsaoClamped),
    direcaoEsperada: reta.slope > 0.5 ? 'melhora' : (reta.slope < -0.5 ? 'queda' : 'estavel'),
    confianca,
    metodo:     'regressao_linear',
    amostras:   tentativas.length,
    disciplina: disc,
  };
}
export async function relatorioEvolucao(uid) {
  if (!uid) return null;

  const [
    padrao, tendencia, fraquezas, score, previsao, summaryPersistido,
  ] = await Promise.allSettled([
    padraoDeDesempenho(uid),
    tendenciaDoAluno(uid),
    fraquezasPorDisciplina(uid),
    scoreEvolutivo(uid),
    previsaoSimples(uid),
    carregarEvolutionSummary(uid),
  ]);

  const _valor = (r) => (r.status === 'fulfilled' ? r.value : null);

  return {
    geradoEm:                Date.now(),
    padraoDeDesempenho:      _valor(padrao),
    tendenciaDoAluno:        _valor(tendencia),
    fraquezasPorDisciplina:  _valor(fraquezas),
    scoreEvolutivo:          _valor(score),
    previsaoSimples:         _valor(previsao),
    summaryPersistidoCamada3: _valor(summaryPersistido),
  };
}

/* ── 8. Listar tentativas recentes (para Timeline do Dashboard) ──
   Reutiliza _buscarTodasTentativas e seu cache existente.
   Não cria novo cache. Não recalcula dados.
   Ordena por endedAt decrescente e retorna apenas os campos
   necessários para a Timeline. */
export async function listarTentativasRecentes(uid, limite = 10) {
  if (!uid) return [];

  const tentativas = await _buscarTodasTentativas(uid);
  if (tentativas.length === 0) return [];

  return tentativas
    .slice()
    .sort((a, b) => (b.endedAt ?? 0) - (a.endedAt ?? 0))
    .slice(0, limite)
    .map(t => ({
      disc:          t.disc,
      modo:          t.modo,
      semestre:      t.semestre,
      acertos:       t.acertos,
      totalQuestoes: t.totalQuestoes,
      taxaAcerto:    t.taxaAcerto,
      tempoGastoSeg: t.tempoGastoSeg,
      revealed:      t.revealed,
      endedAt:       t.endedAt,
      dateKey:       t.dateKey,
    }));
}

/* ── 9. Contar questões respondidas (para Conquistas do Dashboard) ──
   Reutiliza _buscarTodasTentativas e seu cache existente.
   Apenas soma totalQuestoes. Sem novo cache. Sem recálculo. */
export async function contarQuestoesRespondidas(uid) {
  if (!uid) return 0;

  const tentativas = await _buscarTodasTentativas(uid);
  return tentativas.reduce((soma, t) => soma + (t.totalQuestoes ?? 0), 0);
}

/* ══════════════════════════════════════════════
   LEITURA — só consome o que a consolidação gravou
══════════════════════════════════════════════ */
export async function lerSummary(uid) {
  if (!uid) return null;
  return carregarEvolutionSummary(uid);
}


/* ══════════════════════════════════════════════
   ANÁLISE PONTUAL (sem ir ao Firebase)
══════════════════════════════════════════════ */
export function analisarTentativa(tentativaNormalizada) {
  const t = tentativaNormalizada;
  if (!t || t.totalQuestoes <= 0) return null;
  return {
    tipo:                    'tentativa_unica',
    disc:                    t.disc,
    modo:                    t.modo,
    semestre:                t.semestre,
    taxaAcertoPct:           _arredondar(t.taxaAcerto * 100),
    acertos:                 t.acertos,
    totalQuestoes:           t.totalQuestoes,
    tempoTotalSeg:           t.tempoGastoSeg,
    tempoMedioPorQuestaoSeg: _arredondar(t.tempoPorQuestaoSeg, 1),
    revelado:                t.revealed,
    classificacaoRapida:     _classificarFaixa(t.taxaAcerto),
  };
}

export function analisarHistorico(attemptsRaw) {
  const tentativas = (Array.isArray(attemptsRaw) ? attemptsRaw : [])
    .map(_normalizarTentativa)
    .filter(t => t && t.totalQuestoes > 0);
  return _calcularInsight(tentativas);
}

/* ══════════════════════════════════════════════
   CAMINHO DIRETO
══════════════════════════════════════════════ */
export async function processarQuizDireto(payload, uidExplicito = null) {
  if (!payload) return null;

  const uid = uidExplicito || _resolverUid();
  if (!uid) {
    console.warn('[quiz_intelligence] processarQuizDireto: sem uid resolvido — ignorado.');
    return null;
  }

  return processarPayloadBruto(payload, uid).catch(err => {
    console.warn('[quiz_intelligence] processarQuizDireto: falha ao processar payload:', err);
    return null;
  });
}

/* ══════════════════════════════════════════════
   GATILHO — nexus:quizFinalizado
══════════════════════════════════════════════ */
async function _onQuizFinalizado(e) {
  const payload = e?.detail;
  if (!payload) return;
  await processarQuizDireto(payload);
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
    try { fn(evento); } catch (_) {}
  });
}

export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

/* ════════════════════════════════════════════════════════════
   BLOCO 4 — API PÚBLICA (window.NexusQuizIntelligence)
   ════════════════════════════════════════════════════════════ */
window.NexusQuizIntelligence = {
  /* pipeline (Camada 3) */
  consolidar:         (uid) => consolidarUsuario(uid || _resolverUid()),
  processarPayload:   (payload, uid) => processarQuizDireto(payload, uid),
  processarQuizDireto,

  /* leitura — só consome o que a consolidação persistiu */
  lerSummary,

  /* análise local, sem ir ao Firebase */
  analisarTentativa,
  analisarHistorico,

  /* Camada 4 — evolução do aluno */
  padraoDeDesempenho,
  tendenciaDoAluno,
  fraquezasPorDisciplina,
  scoreEvolutivo,
  previsaoSimples,
  relatorioEvolucao,

  /* Camada 4 — dados para Dashboard (Timeline + Conquistas) */
  listarTentativasRecentes,
  contarQuestoesRespondidas,

  subscribe,
};