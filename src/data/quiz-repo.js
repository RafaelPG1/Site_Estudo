// Arquivo: src/data/quiz-repo.js
/* =============================================
   NEXUS STUDY — src/data/quiz-repo.js
   Repositório do QUIZ: estado retomável, histórico de performance e
   evolução consolidada (quiz_evolution — caminho NÃO alterado nesta
   fase; a migração é Fase 4).

   Regras: sem DOM, sem eventos, sem import de core/global, uid sempre
   parâmetro. Contratos de retorno idênticos aos de src/firebase.js.

   Observabilidade: este módulo não conhece perf_logger. Quem quiser
   medir leituras chama definirObservadorLeitura(fn); fn recebe
   (rotulo, uid, ms, quantidade) — mesmos rótulos de antes.
   ============================================= */

import {
  getDb, doc, getDoc, setDoc, deleteDoc, collection, getDocs, addDoc,
  query, orderBy, writeBatch,
} from './firebase-app.js';
import * as C from './colecoes.js';

let _observador = null;
export function definirObservadorLeitura(fn) {
  _observador = (typeof fn === 'function') ? fn : null;
}
function _medir(rotulo, uid, ms, n) {
  if (_observador) _observador(rotulo, uid, ms, n);
}

const _quizRef = (uid, semestre, modo, disc) =>
  doc(getDb(), ...C.quizResposta(uid, C.quizId(semestre, modo, disc)));

/* ── ESTADO RETOMÁVEL: usuarios/{uid}/quiz_respostas/{semestre}_{modo}_{disc} ── */
export async function salvarRespostasQuiz(uid, semestre, modo, disc, respostasStr, revelado, finalizado, shuffleMapStr) {
  try {
    await setDoc(_quizRef(uid, semestre, modo, disc), {
      respostas:  respostasStr,
      revelado:   revelado,
      finalizado: finalizado,
      savedAt:    Date.now(),
      /* semestre/modo/disc gravados explicitamente (e não só embutidos no
         id do documento) para listagens em lote não precisarem fazer
         split() do quizId — ambíguo quando `disc` contém "_". */
      semestre:   semestre,
      modo:       modo,
      disc:       disc,
      /* shuffleMap (string JSON) — reconstrói a MESMA ordem embaralhada
         ao restaurar de outro navegador. Opcional: undefined não grava. */
      ...(shuffleMapStr !== undefined ? { shuffleMap: shuffleMapStr } : {}),
    });
    console.log('[firebase] salvarRespostasQuiz ok →', `${semestre}_${modo}_${disc}`);
    return { ok: true };
  } catch (err) {
    console.error('[firebase] salvarRespostasQuiz erro:', err);
    return { ok: false };
  }
}

export async function carregarRespostasQuiz(uid, semestre, modo, disc) {
  try {
    const snap = await getDoc(_quizRef(uid, semestre, modo, disc));
    if (!snap.exists()) {
      console.log('[firebase] carregarRespostasQuiz: sem dados para', `${semestre}_${modo}_${disc}`);
      return null;
    }
    const data = snap.data();
    console.log('[firebase] carregarRespostasQuiz:', `${semestre}_${modo}_${disc}`, '→', data);
    return data;
  } catch (err) {
    console.error('[firebase] carregarRespostasQuiz erro:', err);
    return null;
  }
}

/* ATENÇÃO: setDoc de reset em vez de deleteDoc — deleteDoc orfanizaria a
   subcoleção 'performance' (histórico imutável). _limpo=true diferencia
   "nunca respondido" de "resetado intencionalmente". */
export async function limparRespostasQuiz(uid, semestre, modo, disc) {
  try {
    await setDoc(_quizRef(uid, semestre, modo, disc), {
      respostas:  '',
      revelado:   false,
      finalizado: false,
      savedAt:    Date.now(),
      _limpo:     true,
    });
    console.log('[firebase] limparRespostasQuiz (reset seguro) →', `${semestre}_${modo}_${disc}`);
    return { ok: true };
  } catch (err) {
    console.error('[firebase] limparRespostasQuiz erro:', err);
    return { ok: false };
  }
}

/* ── PERFORMANCE (imutável): .../quiz_respostas/{quizId}/performance/{auto-id} ── */
export async function salvarPerformanceQuiz(uid, quizId, payload) {
  if (!uid || !quizId || !payload) return { ok: false };

  const {
    totalQuestoes, acertos, taxaAcerto, tempoGastoSeg,
    startedAt, endedAt, modo, semestre, disc, revealed,
  } = payload;

  /* Validação mínima — não grava dados sem sentido */
  if (typeof totalQuestoes !== 'number' || totalQuestoes <= 0 ||
      typeof startedAt !== 'number' || typeof endedAt !== 'number') {
    console.warn('[firebase] salvarPerformanceQuiz: payload inválido', payload);
    return { ok: false };
  }

  try {
    const perfCol = collection(getDb(), ...C.quizPerformance(uid, quizId));
    const ref = await addDoc(perfCol, {
      totalQuestoes,
      acertos:       acertos       ?? 0,
      taxaAcerto:    taxaAcerto    ?? 0,
      tempoGastoSeg: tempoGastoSeg ?? 0,
      startedAt,
      endedAt,
      modo:     modo     ?? null,
      semestre: semestre ?? null,
      disc:     disc     ?? null,
      revealed: !!revealed,
    });
    console.log(
      '[firebase] salvarPerformanceQuiz ok →', quizId, ref.id,
      `| ${acertos}/${totalQuestoes} (${Math.round((taxaAcerto ?? 0) * 100)}%)`,
      `| ${tempoGastoSeg}s`
    );
    return { ok: true, id: ref.id };
  } catch (err) {
    console.error('[firebase] salvarPerformanceQuiz erro:', err);
    return { ok: false };
  }
}

/* ── ADMIN: apaga os documentos-pai de quiz_respostas de um usuário ── */
export async function limparTodoQuizUsuario(uid) {
  try {
    const snap = await getDocs(collection(getDb(), ...C.quizRespostas(uid)));

    if (snap.empty) {
      console.log('[firebase] limparTodoQuizUsuario: sem documentos para', uid);
      return { ok: true };
    }

    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
    console.log('[firebase] limparTodoQuizUsuario: deletados', snap.size, 'docs para', uid);
    return { ok: true };
  } catch (err) {
    console.error('[firebase] limparTodoQuizUsuario erro:', err);
    return { ok: false };
  }
}

/* ── LEITURAS (somente leitura) ── */
export async function listarPerformanceQuiz(uid, quizId) {
  if (!uid || !quizId) return [];
  const t0 = performance.now();
  try {
    const perfCol = collection(getDb(), ...C.quizPerformance(uid, quizId));
    const snap = await getDocs(query(perfCol, orderBy('endedAt', 'asc')));
    const resultado = snap.docs.map(d => ({ id: d.id, quizId, ...d.data() }));
    _medir(`quiz_respostas/${quizId}/performance`, uid, performance.now() - t0, resultado.length);
    return resultado;
  } catch (err) {
    console.warn('[firebase] listarPerformanceQuiz erro:', err);
    _medir(`quiz_respostas/${quizId}/performance (ERRO)`, uid, performance.now() - t0, 0);
    return [];
  }
}

export async function listarQuizIds(uid) {
  if (!uid) return [];
  const t0 = performance.now();
  try {
    const snap = await getDocs(collection(getDb(), ...C.quizRespostas(uid)));
    const ids = snap.docs.map(d => d.id);
    _medir('usuarios/{uid}/quiz_respostas (lista de IDs)', uid, performance.now() - t0, ids.length);
    return ids;
  } catch (err) {
    console.warn('[firebase] listarQuizIds erro:', err);
    _medir('usuarios/{uid}/quiz_respostas (ERRO)', uid, performance.now() - t0, 0);
    return [];
  }
}

/* Lê os documentos-pai (único lugar com o estado realmente retomável). */
export async function listarEstadosQuizUsuario(uid) {
  if (!uid) return [];
  const t0 = performance.now();
  try {
    const snap = await getDocs(collection(getDb(), ...C.quizRespostas(uid)));
    const estados = snap.docs.map(d => ({ quizId: d.id, ...d.data() }));
    _medir('usuarios/{uid}/quiz_respostas (estados)', uid, performance.now() - t0, estados.length);
    return estados;
  } catch (err) {
    console.warn('[firebase] listarEstadosQuizUsuario erro:', err);
    _medir('usuarios/{uid}/quiz_respostas (estados) (ERRO)', uid, performance.now() - t0, 0);
    return [];
  }
}

/* ── EVOLUÇÃO CONSOLIDADA (quiz_evolution/{uid}/…) — caminho inalterado ── */
const _dailyRef   = (uid, k) => doc(getDb(), ...C.evolucaoDiaria(uid, k));
const _weeklyRef  = (uid, k) => doc(getDb(), ...C.evolucaoSemanal(uid, k));
const _summaryRef = (uid)    => doc(getDb(), ...C.evolucaoResumo(uid));

export async function carregarEvolutionSummary(uid) {
  if (!uid) return null;
  const t0 = performance.now();
  try {
    const snap = await getDoc(_summaryRef(uid));
    const resultado = snap.exists() ? snap.data() : null;
    _medir('quiz_evolution/{uid}/summary/main', uid, performance.now() - t0, resultado ? 1 : 0);
    return resultado;
  } catch (err) {
    console.warn('[firebase] carregarEvolutionSummary erro:', err);
    _medir('quiz_evolution/{uid}/summary/main (ERRO)', uid, performance.now() - t0, 0);
    return null;
  }
}

export async function carregarEvolutionDaily(uid, dateKey) {
  if (!uid || !dateKey) return null;
  try {
    const snap = await getDoc(_dailyRef(uid, dateKey));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('[firebase] carregarEvolutionDaily erro:', err);
    return null;
  }
}

export async function carregarEvolutionWeekly(uid, weekKey) {
  if (!uid || !weekKey) return null;
  try {
    const snap = await getDoc(_weeklyRef(uid, weekKey));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('[firebase] carregarEvolutionWeekly erro:', err);
    return null;
  }
}

export async function carregarEvolutionDailyRange(uid, dateKeys) {
  if (!uid || !Array.isArray(dateKeys) || dateKeys.length === 0) return {};
  const out = {};
  await Promise.all(dateKeys.map(async (key) => {
    try {
      const snap = await getDoc(_dailyRef(uid, key));
      if (snap.exists()) out[key] = snap.data();
    } catch (_) { /* dia sem dado é normal, ignora */ }
  }));
  return out;
}

/* Grava de forma atômica dia + semana + resumo (idempotência via
   processedAttemptIds, decidida pelo chamador — quiz_intelligence.js). */
export async function gravarConsolidacaoEvolucao(uid, { dailyKey, dailyData, weeklyKey, weeklyData, summaryData }) {
  if (!uid || !dailyKey || !weeklyKey || !summaryData) return { ok: false };
  try {
    const batch = writeBatch(getDb());

    batch.set(_dailyRef(uid, dailyKey),   dailyData,   { merge: true });
    batch.set(_weeklyRef(uid, weeklyKey), weeklyData,  { merge: true });
    batch.set(_summaryRef(uid),           summaryData, { merge: true });

    await batch.commit();
    return { ok: true };
  } catch (err) {
    console.warn('[firebase] gravarConsolidacaoEvolucao erro:', err);
    return { ok: false };
  }
}