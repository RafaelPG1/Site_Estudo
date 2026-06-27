/* =============================================
   NEXUS STUDY — src/firebase.js
   Autenticação com Firestore + PIN com hash SHA-256
   src/firebase.js
   ============================================= */

import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getFirestore,
  doc, getDoc, setDoc, deleteDoc,
  collection, getDocs, addDoc, query, orderBy,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { setUsuario } from './global.js';

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

let _db = null;
export function getDb() {
  if (!_db) _db = getFirestore(app);
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