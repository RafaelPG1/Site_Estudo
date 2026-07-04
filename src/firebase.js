/* =============================================
   NEXUS STUDY — src/firebase.js
   Autenticação com Firestore + PIN com hash SHA-256
   src/firebase.js
   ============================================= */

import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
   initializeFirestore,
   doc, getDoc, setDoc, deleteDoc,
   collection, getDocs, addDoc, query, orderBy, writeBatch,
 } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { setUsuario } from './global.js';
import { logFirestore } from './perf_logger.js';
/* ── CONFIG ─────────────────────────────────── */
const firebaseConfig = {
  apiKey:            'AIzaSyBWRSuyiPS9ez7TFm7K4j5pd7LbdSfPPMk',
  authDomain:        'estudo-site-85244.firebaseapp.com',
  projectId:         'estudo-site-85244',
  storageBucket:     'estudo-site-85244.firebasestorage.app',
  messagingSenderId: '529138252727',
  appId:             '1:529138252727:web:d866279f0c795b013e4632',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/* ── CLIENTE FIRESTORE ──────────────────────────────────────────
   experimentalAutoDetectLongPolling: evita que o SDK precise
   fazer uma sondagem extra de decisão de transporte na primeira
   conexão — mantém a auto-detecção, mas configurada de forma
   explícita em vez do getFirestore() padrão implícito.
   NOTA: o warm-up de canal (fetch/getDoc descartável) que existia
   aqui foi REMOVIDO — medições mostraram que, disparado de dentro
   deste módulo, ele roda praticamente no mesmo instante que as
   leituras reais (scripts type="module" só executam perto do
   DOMContentLoaded), competindo pela mesma negociação de canal em
   vez de adiantá-la. O warm-up agora vive em um <script> clássico
   no <head> do HTML de cada página, que executa durante o parsing
   do documento — antes do grafo de módulos ES começar a ser
   baixado. Ver dashboard.html para a implementação atual. ────── */
let _db = null;
export function getDb() {
  if (!_db) {
    _db = initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    });
  }
  return _db;
}

/* ── HASH SHA-256 ── */
export async function hashPin(pin) {
  const encoded = new TextEncoder().encode(String(pin));
  const buffer  = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/* ── LOGIN ── */
export async function login(nome, pin) {
  if (!nome || !pin) return { ok: false, erro: 'Preencha nome e PIN.' };

  const id = nome.trim().toLowerCase();

  try {
    const ref  = doc(getDb(), 'usuarios', id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return { ok: false, erro: 'Usuário não encontrado.' };

    const dados   = snap.data();
    const hashDig = await hashPin(pin);

    if (hashDig !== dados.pin) return { ok: false, erro: 'PIN incorreto.' };

    const usuario = {
      uid:    id,
      nome:   dados.nome ?? nome,
      avatar: dados.avatar ?? '🎓',
      foto:   dados.foto   ?? null,
      admin:  dados.admin  ?? false,
    };

    setUsuario(usuario);
    return { ok: true, usuario };

  } catch (err) {
    console.error('[firebase.js] Erro no login:', err);
    return { ok: false, erro: 'Erro de conexão. Tente novamente.' };
  }
}

/* ── LOGOUT ── */
export function logout() {
  setUsuario(null);
}

/* ── CONFIGS DO USUÁRIO ── */
export async function salvarConfigs(uid, configs) {
  try {
    const ref = doc(getDb(), 'usuarios', uid);
    await setDoc(ref, { configs }, { merge: true });
    console.log('[firebase] salvarConfigs: salvo com sucesso para', uid, '→', configs);
    return { ok: true };
  } catch (err) {
    console.error('[firebase.js] Erro ao salvar configs:', err);
    return { ok: false };
  }
}

export async function carregarConfigs(uid) {
  try {
    const ref  = doc(getDb(), 'usuarios', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      console.warn('[firebase] carregarConfigs: documento não encontrado para', uid);
      return null;
    }
    const configs = snap.data().configs ?? null;
    console.log('[firebase] carregarConfigs: campo configs →', configs);
    return configs;
  } catch (err) {
    console.error('[firebase.js] Erro ao carregar configs:', err);
    return null;
  }
}

/* ── RESPOSTAS DO QUIZ ── */
function _quizRef(uid, semestre, modo, disc) {
  return doc(getDb(), 'usuarios', uid, 'quiz_respostas', `${semestre}_${modo}_${disc}`);
}

export async function salvarRespostasQuiz(uid, semestre, modo, disc, respostasStr, revelado, finalizado) {
  try {
    await setDoc(_quizRef(uid, semestre, modo, disc), {
      respostas:  respostasStr,
      revelado:   revelado,
      finalizado: finalizado,
      savedAt:    Date.now(),
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

/* ── LIMPAR RESPOSTAS DO QUIZ ──────────────────────────────────────────────
   ATENÇÃO: usa setDoc de reset em vez de deleteDoc.
   Motivo: deleteDoc removeria o documento pai, orphanizando a subcoleção
   'performance' (histórico imutável de desempenho). Com setDoc + merge:false
   apenas os campos de estado são zerados; a subcoleção permanece intacta.
   O campo _limpo=true serve como flag de auditoria para diferenciar
   "nunca respondido" de "resetado intencionalmente".
   ─────────────────────────────────────────────────────────────────────────*/
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

/* ── PERFORMANCE DO QUIZ ───────────────────────────────────────────────────
   Salva um registro imutável de desempenho em subcoleção separada.
   Nunca é apagada por limparRespostasQuiz() ou reiniciar().

   Estrutura:
     usuarios/{uid}/quiz_respostas/{quizId}/performance/{auto-id}
       totalQuestoes : number
       acertos       : number
       taxaAcerto    : number   (0–1)
       tempoGastoSeg : number
       startedAt     : number   (ms)
       endedAt       : number   (ms)
       modo          : string
       semestre      : string
       disc          : string
       revealed      : boolean
   ─────────────────────────────────────────────────────────────────────────*/
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
    const perfCol = collection(
      getDb(), 'usuarios', uid, 'quiz_respostas', quizId, 'performance'
    );
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

/* ── ADMIN: LISTAR USUÁRIOS ── */
export async function getUsuarios() {
  try {
    const col  = collection(getDb(), 'usuarios');
    const snap = await getDocs(col);
    return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
  } catch (err) {
    console.error('[firebase] getUsuarios erro:', err);
    return [];
  }
}

/* ── ADMIN: CRIAR USUÁRIO ── */
export async function criarUsuario(uid, nome, pinHash, avatar) {
  try {
    const ref  = doc(getDb(), 'usuarios', uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return { ok: false, erro: `Usuário "${uid}" já existe.` };
    }

    await setDoc(ref, {
      nome:   nome,
      pin:    pinHash,
      avatar: avatar ?? '🎓',
      admin:  false,
    });

    console.log('[firebase] criarUsuario ok →', uid);
    return { ok: true };
  } catch (err) {
    console.error('[firebase] criarUsuario erro:', err);
    return { ok: false, erro: err.message };
  }
}

/* ── ADMIN: REMOVER USUÁRIO ── */
export async function removerUsuario(uid) {
  try {
    await deleteDoc(doc(getDb(), 'usuarios', uid));
    console.log('[firebase] removerUsuario ok →', uid);
    return { ok: true };
  } catch (err) {
    console.error('[firebase] removerUsuario erro:', err);
    return { ok: false };
  }
}

/* ── ADMIN: RESETAR PIN ── */
export async function resetarPin(uid, novoPin) {
  try {
    const novoHash = await hashPin(novoPin);
    await setDoc(doc(getDb(), 'usuarios', uid), { pin: novoHash }, { merge: true });
    console.log('[firebase] resetarPin ok →', uid);
    return { ok: true };
  } catch (err) {
    console.error('[firebase] resetarPin erro:', err);
    return { ok: false };
  }
}

/* ── ADMIN: LIMPAR TODO O QUIZ DE UM USUÁRIO ── */
export async function limparTodoQuizUsuario(uid) {
  try {
    const col  = collection(getDb(), 'usuarios', uid, 'quiz_respostas');
    const snap = await getDocs(col);

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

/* ── GERAR HASH (utilitário de console) ── */
export async function gerarHash(pin) {
  const h = await hashPin(pin);
  console.log(`PIN: ${pin}  →  hash: ${h}`);
  return h;
}

/* ═══════════════════════════════════════════════════════════════
   NEXUS STUDY — firebase.js  ·  Área Pessoal
   ═══════════════════════════════════════════════════════════════ */

function _pessoalRef(uid, semestre, discId) {
  return doc(getDb(), 'usuarios', uid, 'pessoal', `${semestre}_${discId}`);
}

/* ── Checklist ── */
export async function salvarChecklistPessoal(uid, semestre, discId, checkedSet) {
  try {
    await setDoc(_pessoalRef(uid, semestre, discId), {
      checklist:  [...checkedSet],
      clUpdatedAt: Date.now(),
    }, { merge: true });
    return { ok: true };
  } catch (err) {
    console.error('[firebase] salvarChecklistPessoal:', err);
    return { ok: false };
  }
}

export async function carregarChecklistPessoal(uid, semestre, discId) {
  try {
    const snap = await getDoc(_pessoalRef(uid, semestre, discId));
    if (!snap.exists()) return null;
    const raw = snap.data().checklist;
    return Array.isArray(raw) ? raw : null;
  } catch (err) {
    console.error('[firebase] carregarChecklistPessoal:', err);
    return null;
  }
}

/* ── Categorias ── */
export async function salvarCategoriasPessoal(uid, semestre, discId, cats) {
  try {
    const clean = JSON.parse(JSON.stringify(cats));
    await setDoc(_pessoalRef(uid, semestre, discId), {
      categorias:   clean,
      catsUpdatedAt: Date.now(),
    }, { merge: true });
    return { ok: true };
  } catch (err) {
    console.error('[firebase] salvarCategoriasPessoal:', err);
    return { ok: false };
  }
}

export async function carregarCategoriasPessoal(uid, semestre, discId) {
  try {
    const snap = await getDoc(_pessoalRef(uid, semestre, discId));
    if (!snap.exists()) return null;
    const raw = snap.data().categorias;
    return Array.isArray(raw) ? raw : null;
  } catch (err) {
    console.error('[firebase] carregarCategoriasPessoal:', err);
    return null;
  }
}

/* ── Notas ── */
export async function salvarNotaPessoal(uid, semestre, discId, nota) {
  try {
    await setDoc(_pessoalRef(uid, semestre, discId), {
      nota,
      notaUpdatedAt: Date.now(),
    }, { merge: true });
    return { ok: true };
  } catch (err) {
    console.error('[firebase] salvarNotaPessoal:', err);
    return { ok: false };
  }
}

export async function carregarNotaPessoal(uid, semestre, discId) {
  try {
    const snap = await getDoc(_pessoalRef(uid, semestre, discId));
    if (!snap.exists()) return null;
    const raw = snap.data().nota;
    return typeof raw === 'string' ? raw : null;
  } catch (err) {
    console.error('[firebase] carregarNotaPessoal:', err);
    return null;
  }
}

export async function carregarTudoPessoal(uid, semestre, discId) {
  try {
    const snap = await getDoc(_pessoalRef(uid, semestre, discId));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      checklist:  Array.isArray(d.checklist)  ? d.checklist  : null,
      categorias: Array.isArray(d.categorias) ? d.categorias : null,
      nota:       typeof d.nota === 'string'   ? d.nota       : null,
    };
  } catch (err) {
    console.error('[firebase] carregarTudoPessoal:', err);
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════════
   NEXUS STUDY — firebase.js · Camada 3 v2 (Quiz Intelligence)
   ─────────────────────────────────────────────────────────────
   Estrutura de evolução PERSISTIDA. Firebase passa a ser a fonte
   de verdade da inteligência — não apenas um destino de log.

   usuarios/{uid}/quiz_respostas/{quizId}/performance/{auto-id}
     → histórico bruto por tentativa (já existia, intocado)

   quiz_evolution/{uid}/daily/{YYYY-MM-DD}
     → snapshot consolidado do dia: tentativas do dia, acertos,
       tempo, por disciplina, score do dia

   quiz_evolution/{uid}/weekly/{YYYY-Www}
     → mesma forma, agregada por semana ISO

   quiz_evolution/{uid}/summary/main
     → agregados acumulados (médias, score histórico incremental,
       evolução por disciplina) + processedAttemptIds, que é o que
       torna a consolidação IDEMPOTENTE: qualquer tentativa cujo id
       já esteja nesta lista é ignorada, então rodar a consolidação
       2x, 10x, ou após reload total nunca duplica nada.
   ═══════════════════════════════════════════════════════════════ */

function _evolutionDailyRef(uid, dateKey)  { return doc(getDb(), 'quiz_evolution', uid, 'daily',  dateKey); }
function _evolutionWeeklyRef(uid, weekKey) { return doc(getDb(), 'quiz_evolution', uid, 'weekly', weekKey); }
function _evolutionSummaryRef(uid)         { return doc(getDb(), 'quiz_evolution', uid, 'summary', 'main'); }

/* ── LISTAR HISTÓRICO BRUTO (somente leitura) ── */
export async function listarPerformanceQuiz(uid, quizId) {
  if (!uid || !quizId) return [];
  const t0 = performance.now();
  try {
    const perfCol = collection(
      getDb(), 'usuarios', uid, 'quiz_respostas', quizId, 'performance'
    );
    const q = query(perfCol, orderBy('endedAt', 'asc'));
    const snap = await getDocs(q);
    const resultado = snap.docs.map(d => ({ id: d.id, quizId, ...d.data() }));
    logFirestore(`quiz_respostas/${quizId}/performance`, uid, performance.now() - t0, resultado.length);
    return resultado;
  } catch (err) {
    console.warn('[firebase] listarPerformanceQuiz erro:', err);
    logFirestore(`quiz_respostas/${quizId}/performance (ERRO)`, uid, performance.now() - t0, 0);
    return [];
  }
}
/* ── LISTAR TODOS OS quizIds que um usuário já tem em quiz_respostas ──
   Necessário para a consolidação conseguir varrer TODAS as tentativas
   do usuário sem que o chamador precise adivinhar semestre/modo/disc
   de antemão. Só leitura; não decide nada por conta própria. */
export async function listarQuizIds(uid) {
  if (!uid) return [];
  const t0 = performance.now();
  try {
    const col  = collection(getDb(), 'usuarios', uid, 'quiz_respostas');
    const snap = await getDocs(col);
    const ids = snap.docs.map(d => d.id);
    logFirestore('usuarios/{uid}/quiz_respostas (lista de IDs)', uid, performance.now() - t0, ids.length);
    return ids;
  } catch (err) {
    console.warn('[firebase] listarQuizIds erro:', err);
    logFirestore('usuarios/{uid}/quiz_respostas (ERRO)', uid, performance.now() - t0, 0);
    return [];
  }
}

/* ── LER O RESUMO ACUMULADO ── */
export async function carregarEvolutionSummary(uid) {
  if (!uid) return null;
  const t0 = performance.now();
  try {
    const snap = await getDoc(_evolutionSummaryRef(uid));
    const resultado = snap.exists() ? snap.data() : null;
    logFirestore('quiz_evolution/{uid}/summary/main', uid, performance.now() - t0, resultado ? 1 : 0);
    return resultado;
  } catch (err) {
    console.warn('[firebase] carregarEvolutionSummary erro:', err);
    logFirestore('quiz_evolution/{uid}/summary/main (ERRO)', uid, performance.now() - t0, 0);
    return null;
  }
}

/* ── LER SNAPSHOT DIÁRIO / SEMANAL (para séries temporais) ── */
export async function carregarEvolutionDaily(uid, dateKey) {
  if (!uid || !dateKey) return null;
  try {
    const snap = await getDoc(_evolutionDailyRef(uid, dateKey));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('[firebase] carregarEvolutionDaily erro:', err);
    return null;
  }
}

export async function carregarEvolutionWeekly(uid, weekKey) {
  if (!uid || !weekKey) return null;
  try {
    const snap = await getDoc(_evolutionWeeklyRef(uid, weekKey));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('[firebase] carregarEvolutionWeekly erro:', err);
    return null;
  }
}

/* ── LER UM INTERVALO DE DIAS (usado para reconstruir série temporal) ── */
export async function carregarEvolutionDailyRange(uid, dateKeys) {
  if (!uid || !Array.isArray(dateKeys) || dateKeys.length === 0) return {};
  const out = {};
  await Promise.all(dateKeys.map(async (key) => {
    try {
      const snap = await getDoc(_evolutionDailyRef(uid, key));
      if (snap.exists()) out[key] = snap.data();
    } catch (_) { /* dia sem dado é normal, ignora */ }
  }));
  return out;
}

/* ── GRAVAR CONSOLIDAÇÃO (chamada SOMENTE por quiz_intelligence.js) ──
   Grava de forma atômica: snapshot do dia, snapshot da semana, e o
   resumo acumulado (que inclui processedAttemptIds para idempotência).
   O CHAMADOR monta os três objetos já calculados — esta função apenas
   persiste, não decide nada sobre o conteúdo. */
export async function gravarConsolidacaoEvolucao(uid, { dailyKey, dailyData, weeklyKey, weeklyData, summaryData }) {
  if (!uid || !dailyKey || !weeklyKey || !summaryData) return { ok: false };
  try {
    const batch = writeBatch(getDb());

    batch.set(_evolutionDailyRef(uid, dailyKey), dailyData, { merge: true });
    batch.set(_evolutionWeeklyRef(uid, weeklyKey), weeklyData, { merge: true });
    batch.set(_evolutionSummaryRef(uid), summaryData, { merge: true });

    await batch.commit();
    return { ok: true };
  } catch (err) {
    console.warn('[firebase] gravarConsolidacaoEvolucao erro:', err);
    return { ok: false };
  }
}