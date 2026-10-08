// Arquivo: src/data/quiz-repo.js
/* =============================================
   NEXUS STUDY — src/data/quiz-repo.js
   Repositório do QUIZ: estado retomável, histórico de performance e
   evolução consolidada (Fase 4: nova estrutura sob usuarios/{uid} com
   migração por cópia e leitura de compatibilidade do quiz_evolution legado).

   Regras: sem DOM, sem eventos, sem import de core/global, uid sempre
   parâmetro. Contratos de retorno idênticos aos de src/firebase.js.

   Observabilidade (Fase 8): as métricas [PERF] das leituras do quiz são
   registradas aqui mesmo, via perf_logger.logFirestore (mesmos rótulos
   de antes; fn recebe (rotulo, uid, ms, quantidade)). Quem importar este
   módulo direto (Quiz) não depende mais da fachada src/firebase.js.
   definirObservadorLeitura(fn) segue disponível para trocar/desligar.
   ============================================= */

import {
  getDb, doc, getDoc, setDoc, deleteDoc, collection, getDocs, addDoc,
  query, orderBy, writeBatch,
} from './firebase-app.js';
import * as C from './colecoes.js';
import { logFirestore } from '../perf_logger.js';

let _observador = logFirestore;
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

/* ═══════════════════════════════════════════════════════════════
   EVOLUÇÃO CONSOLIDADA — FASE 4 (migração + compatibilidade)

   NOVA estrutura (dados do usuário sob usuarios/{uid}):
     usuarios/{uid}/quiz_evolucao_diaria/{YYYY-MM-DD}
     usuarios/{uid}/quiz_evolucao_semanal/{YYYY-Www}
     usuarios/{uid}/quiz_evolucao_resumo/main
   LEGADO (intacto; este código NUNCA o apaga nem o altera):
     quiz_evolution/{uid}/daily|weekly/{key}  ·  quiz_evolution/{uid}/summary/main

   Como funciona:
     1. Antes de qualquer leitura/escrita de evolução de um usuário,
        garantirMigracaoEvolucao(uid) confere o marcador
        usuarios/{uid}.migracoes.quiz_evolucao_v2.
     2. Sem marcador: migrarEvolucaoUsuario() COPIA o legado (mesmos IDs,
        mesmos dados), valida por releitura e só então grava o marcador.
     3. Com marcador: lê e escreve só na estrutura nova.
     4. Se a migração falhar/não validar: LEITURAS caem para o legado
        (compatibilidade) e ESCRITAS não são feitas (retornam { ok:false }),
        para não dividir os dados entre dois lugares. Nada se perde: a
        consolidação recalcula tudo a partir de `performance` e tenta de novo.
     5. USAR_NOVA_ESTRUTURA_EVOLUCAO = false volta ao comportamento exato
        da Fase 3 (lê/escreve só no legado), sem migrar.

   Cópia: destino inexistente → copia a origem. Destino existente e igual →
   mantém. Destino diferente → vence o maior `_updatedAt`; EMPATE com
   conteúdo diferente é divergência (nada é escrito, nada é marcado, o
   relatório lista o documento). No resumo, processedAttemptIds é a UNIÃO
   das duas listas.
   ═══════════════════════════════════════════════════════════════ */

const USAR_NOVA_ESTRUTURA_EVOLUCAO = true;
const _RETRY_FALHA_MS = 60_000;
const _LOTE_MAX = 400;

const _REFS_NOVO = {
  daily:   (uid, k) => doc(getDb(), ...C.evolucaoDiaria(uid, k)),
  weekly:  (uid, k) => doc(getDb(), ...C.evolucaoSemanal(uid, k)),
  summary: (uid)    => doc(getDb(), ...C.evolucaoResumo(uid)),
};
const _REFS_LEGADO = {
  daily:   (uid, k) => doc(getDb(), ...C.evolucaoDiariaLegado(uid, k)),
  weekly:  (uid, k) => doc(getDb(), ...C.evolucaoSemanalLegado(uid, k)),
  summary: (uid)    => doc(getDb(), ...C.evolucaoResumoLegado(uid)),
};

/* Comparação profunda independente da ordem das chaves. */
function _canon(v) {
  if (v === undefined) return 'u';
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(_canon).join(',') + ']';
  if (typeof v.toMillis === 'function') return 'T' + v.toMillis();
  return '{' + Object.keys(v).filter(k => v[k] !== undefined).sort()
    .map(k => JSON.stringify(k) + ':' + _canon(v[k])).join(',') + '}';
}
const _iguais = (a, b) => _canon(a) === _canon(b);
const _upd = (d) => (typeof d?._updatedAt === 'number' ? d._updatedAt : -1);

/* ── Migração por usuário ───────────────────────────────────────
   opts.dryRun  → só calcula e relata (nenhuma escrita).
   opts.forcar  → ignora o marcador (reexecuta a cópia; idempotente).
   Retorna um relatório; ok:true somente se validado (ou já migrado). */
export async function migrarEvolucaoUsuario(uid, { dryRun = false, forcar = false } = {}) {
  const rel = {
    uid, dryRun, ok: false, jaMigrado: false, validado: false, erro: null,
    legado:  { diaria: 0, semanal: 0, resumo: 0 },
    copiar:  { diaria: 0, semanal: 0, resumo: 0 },
    iguais:  { diaria: 0, semanal: 0, resumo: 0 },
    destinoVence: { diaria: 0, semanal: 0, resumo: 0 },
    divergencias: [],
  };
  if (!uid) { rel.erro = 'uid_vazio'; return rel; }

  try {
    const db = getDb();
    const userRef  = doc(db, ...C.usuario(uid));
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) { rel.erro = 'usuario_inexistente'; return rel; }

    const marcador = userSnap.data()?.migracoes?.[C.MARCADOR_MIGRACAO_EVOLUCAO] ?? null;
    if (marcador && !forcar) { rel.jaMigrado = true; rel.ok = true; rel.marcador = marcador; return rel; }

    const escritas = [];   // { ref, dados, tipo, id }

    /* diário e semanal: 1 listagem do legado + 1 do destino */
    for (const [tipo, colLeg, colNovo, refNovo] of [
      ['diaria',  C.evolucaoDiariaColecaoLegado,  C.evolucaoDiariaColecao,  _REFS_NOVO.daily],
      ['semanal', C.evolucaoSemanalColecaoLegado, C.evolucaoSemanalColecao, _REFS_NOVO.weekly],
    ]) {
      const [snapLeg, snapNovo] = await Promise.all([
        getDocs(collection(db, ...colLeg(uid))),
        getDocs(collection(db, ...colNovo(uid))),
      ]);
      const destino = new Map(snapNovo.docs.map(d => [d.id, d.data()]));
      rel.legado[tipo] = snapLeg.size;
      for (const d of snapLeg.docs) {
        const src = d.data(); const dst = destino.get(d.id);
        if (dst === undefined) { rel.copiar[tipo]++; escritas.push({ ref: refNovo(uid, d.id), dados: src, tipo, id: d.id }); }
        else if (_iguais(src, dst)) { rel.iguais[tipo]++; }
        else if (_upd(src) > _upd(dst)) { rel.copiar[tipo]++; escritas.push({ ref: refNovo(uid, d.id), dados: src, tipo, id: d.id }); }
        else if (_upd(src) === _upd(dst)) { rel.divergencias.push({ tipo, id: d.id, motivo: 'empate_com_conteudo_diferente' }); }
        else { rel.destinoVence[tipo]++; }
      }
    }

    /* resumo: une processedAttemptIds */
    const [sumLeg, sumNovo] = await Promise.all([
      getDoc(_REFS_LEGADO.summary(uid)), getDoc(_REFS_NOVO.summary(uid)),
    ]);
    if (sumLeg.exists()) {
      rel.legado.resumo = 1;
      const src = sumLeg.data();
      if (!sumNovo.exists()) {
        rel.copiar.resumo = 1;
        escritas.push({ ref: _REFS_NOVO.summary(uid), dados: src, tipo: 'resumo', id: 'main' });
      } else if (_upd(src) === _upd(sumNovo.data())
                 && !_iguais({ ...src, processedAttemptIds: undefined }, { ...sumNovo.data(), processedAttemptIds: undefined })) {
        rel.divergencias.push({ tipo: 'resumo', id: 'main', motivo: 'empate_com_conteudo_diferente' });
      } else {
        const dst = sumNovo.data();
        const vencedor = _upd(src) > _upd(dst) ? src : dst;
        const ids = [...(Array.isArray(src.processedAttemptIds) ? src.processedAttemptIds : [])];
        const visto = new Set(ids);
        for (const id of (Array.isArray(dst.processedAttemptIds) ? dst.processedAttemptIds : [])) {
          if (!visto.has(id)) { visto.add(id); ids.push(id); }
        }
        const esperado = (Array.isArray(src.processedAttemptIds) || Array.isArray(dst.processedAttemptIds))
          ? { ...vencedor, processedAttemptIds: ids } : { ...vencedor };
        if (_iguais(esperado, dst)) rel.iguais.resumo = 1;
        else { rel.copiar.resumo = 1; escritas.push({ ref: _REFS_NOVO.summary(uid), dados: esperado, tipo: 'resumo', id: 'main' }); }
      }
    }

    /* Divergência já no planejamento (destino diferente da origem com o
       mesmo _updatedAt): NÃO escreve nada e NÃO marca — exige análise. */
    if (rel.divergencias.length > 0) { rel.erro = 'divergencia_no_planejamento'; return rel; }

    if (dryRun) { rel.ok = true; return rel; }

    /* escrita em lotes */
    for (let i = 0; i < escritas.length; i += _LOTE_MAX) {
      const batch = writeBatch(db);
      for (const e of escritas.slice(i, i + _LOTE_MAX)) batch.set(e.ref, e.dados);
      await batch.commit();
    }

    /* validação: relê cada documento escrito e compara com o esperado */
    for (const e of escritas) {
      const snap = await getDoc(e.ref);
      if (!snap.exists() || !_iguais(snap.data(), e.dados)) rel.divergencias.push({ tipo: e.tipo, id: e.id });
    }
    if (rel.divergencias.length > 0) { rel.erro = 'divergencia_na_validacao'; return rel; }

    rel.validado = true;
    await setDoc(userRef, { migracoes: { [C.MARCADOR_MIGRACAO_EVOLUCAO]: {
      em: Date.now(),
      diaria: rel.legado.diaria, semanal: rel.legado.semanal, resumo: rel.legado.resumo,
      copiados: { ...rel.copiar }, validado: true,
    } } }, { merge: true });
    rel.ok = true;
    return rel;
  } catch (err) {
    console.warn('[quiz-repo] migrarEvolucaoUsuario erro:', err);
    rel.erro = String(err?.message ?? err);
    return rel;
  }
}

/* ── Inventário SOMENTE LEITURA da evolução (legado × novo) ──────
   Cada leitura é isolada: se as regras do Firestore negarem um caminho,
   ele aparece em `erros` e as demais contagens continuam válidas. */
export async function inventariarEvolucaoUsuario(uid) {
  const rel = { uid, legado: { diaria: null, semanal: null, resumo: null },
                novo: { diaria: null, semanal: null, resumo: null }, marcador: null, erros: [] };
  const db = getDb();
  const ler = async (caminho, fn) => {
    try { return await fn(); }
    catch (err) { rel.erros.push({ caminho, codigo: String(err?.code ?? err?.name ?? 'erro') }); return null; }
  };
  const [lD, lW, lS, nD, nW, nS, u] = await Promise.all([
    ler(`quiz_evolution/${uid}/daily`,   () => getDocs(collection(db, ...C.evolucaoDiariaColecaoLegado(uid)))),
    ler(`quiz_evolution/${uid}/weekly`,  () => getDocs(collection(db, ...C.evolucaoSemanalColecaoLegado(uid)))),
    ler(`quiz_evolution/${uid}/summary/main`, () => getDoc(_REFS_LEGADO.summary(uid))),
    ler(`usuarios/${uid}/quiz_evolucao_diaria`,  () => getDocs(collection(db, ...C.evolucaoDiariaColecao(uid)))),
    ler(`usuarios/${uid}/quiz_evolucao_semanal`, () => getDocs(collection(db, ...C.evolucaoSemanalColecao(uid)))),
    ler(`usuarios/${uid}/quiz_evolucao_resumo/main`, () => getDoc(_REFS_NOVO.summary(uid))),
    ler(`usuarios/${uid}`, () => getDoc(doc(db, ...C.usuario(uid)))),
  ]);
  if (lD) rel.legado.diaria  = lD.size;
  if (lW) rel.legado.semanal = lW.size;
  if (lS) rel.legado.resumo  = lS.exists() ? 1 : 0;
  if (nD) rel.novo.diaria    = nD.size;
  if (nW) rel.novo.semanal   = nW.size;
  if (nS) rel.novo.resumo    = nS.exists() ? 1 : 0;
  if (u?.exists()) rel.marcador = !!u.data()?.migracoes?.[C.MARCADOR_MIGRACAO_EVOLUCAO];
  return rel;
}

/* ── Garantia antes de qualquer acesso (memoizada por usuário) ── */
const _migracoes = new Map();   // uid → { ts, ok, p }
export function garantirMigracaoEvolucao(uid) {
  if (!uid) return Promise.resolve(false);
  const c = _migracoes.get(uid);
  if (c && (c.ok || Date.now() - c.ts < _RETRY_FALHA_MS)) return c.p;
  const entrada = { ts: Date.now(), ok: false, p: null };
  entrada.p = migrarEvolucaoUsuario(uid)
    .then(r => { entrada.ok = !!r.ok; return !!r.ok; })
    .catch(() => false);
  _migracoes.set(uid, entrada);
  return entrada.p;
}

/* 'novo' → estrutura nova · 'legado-leitura' → falhou (só lê o legado) ·
   'legado' → chave desligada (comportamento da Fase 3) */
async function _modoEvolucao(uid) {
  if (!USAR_NOVA_ESTRUTURA_EVOLUCAO) return 'legado';
  return (await garantirMigracaoEvolucao(uid)) ? 'novo' : 'legado-leitura';
}
const _refsDoModo = (modo) => (modo === 'novo' ? _REFS_NOVO : _REFS_LEGADO);

export async function carregarEvolutionSummary(uid) {
  if (!uid) return null;
  const t0 = performance.now();
  const modo = await _modoEvolucao(uid);
  const rotulo = modo === 'novo' ? 'usuarios/{uid}/quiz_evolucao_resumo/main' : 'quiz_evolution/{uid}/summary/main';
  try {
    const snap = await getDoc(_refsDoModo(modo).summary(uid));
    const resultado = snap.exists() ? snap.data() : null;
    _medir(rotulo, uid, performance.now() - t0, resultado ? 1 : 0);
    return resultado;
  } catch (err) {
    console.warn('[firebase] carregarEvolutionSummary erro:', err);
    _medir(`${rotulo} (ERRO)`, uid, performance.now() - t0, 0);
    return null;
  }
}

export async function carregarEvolutionDaily(uid, dateKey) {
  if (!uid || !dateKey) return null;
  const modo = await _modoEvolucao(uid);
  try {
    const snap = await getDoc(_refsDoModo(modo).daily(uid, dateKey));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('[firebase] carregarEvolutionDaily erro:', err);
    return null;
  }
}

export async function carregarEvolutionWeekly(uid, weekKey) {
  if (!uid || !weekKey) return null;
  const modo = await _modoEvolucao(uid);
  try {
    const snap = await getDoc(_refsDoModo(modo).weekly(uid, weekKey));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('[firebase] carregarEvolutionWeekly erro:', err);
    return null;
  }
}

export async function carregarEvolutionDailyRange(uid, dateKeys) {
  if (!uid || !Array.isArray(dateKeys) || dateKeys.length === 0) return {};
  const refs = _refsDoModo(await _modoEvolucao(uid));
  const out = {};
  await Promise.all(dateKeys.map(async (key) => {
    try {
      const snap = await getDoc(refs.daily(uid, key));
      if (snap.exists()) out[key] = snap.data();
    } catch (_) { /* dia sem dado é normal, ignora */ }
  }));
  return out;
}

/* Grava de forma atômica dia + semana + resumo (idempotência via
   processedAttemptIds, decidida pelo chamador — quiz_intelligence.js).
   Só escreve onde a leitura aponta: estrutura nova (migrada) ou legado
   (chave desligada). Em 'legado-leitura' NÃO grava. */
export async function gravarConsolidacaoEvolucao(uid, { dailyKey, dailyData, weeklyKey, weeklyData, summaryData }) {
  if (!uid || !dailyKey || !weeklyKey || !summaryData) return { ok: false };
  try {
    const modo = await _modoEvolucao(uid);
    if (modo === 'legado-leitura') {
      console.warn('[quiz-repo] evolução não gravada: migração do usuário ainda não validada', uid);
      return { ok: false };
    }
    const refs = _refsDoModo(modo);
    const batch = writeBatch(getDb());

    batch.set(refs.daily(uid, dailyKey),   dailyData,   { merge: true });
    batch.set(refs.weekly(uid, weeklyKey), weeklyData,  { merge: true });
    batch.set(refs.summary(uid),           summaryData, { merge: true });

    await batch.commit();
    return { ok: true };
  } catch (err) {
    console.warn('[firebase] gravarConsolidacaoEvolucao erro:', err);
    return { ok: false };
  }
}
