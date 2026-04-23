/* =============================================
   NEXUS STUDY — firebase.js
   Autenticação com Firestore + PIN com hash SHA-256
   ============================================= */

import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getFirestore,
  doc, getDoc, setDoc, deleteDoc,
  collection, getDocs,
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
      admin:  dados.admin  ?? false,   // ← campo admin incluído
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

export async function limparRespostasQuiz(uid, semestre, modo, disc) {
  try {
    await deleteDoc(_quizRef(uid, semestre, modo, disc));
    console.log('[firebase] limparRespostasQuiz deletado →', `${semestre}_${modo}_${disc}`);
    return { ok: true };
  } catch (err) {
    console.error('[firebase] limparRespostasQuiz erro:', err);
    return { ok: false };
  }
}

/* ── ADMIN: LISTAR USUÁRIOS ── */
// Nota: requer regra Firestore que permita o admin ler a coleção inteira.
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
// pinHash deve chegar já processado via hashPin()
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

/*
 * TODO: getEstatisticasUsuario(uid)
 * ─────────────────────────────────────────────
 * Planejado para a seção de Estatísticas do admin.
 *
 * Deve agregar:
 *   - quiz_respostas → total de questões, % acerto por disciplina
 *   - srs_perfis     → total de cards, distribuição de intervalos
 *   - último acesso  → campo 'savedAt' mais recente em quiz_respostas
 *
 * Exemplo de implementação futura:
 *
 * export async function getEstatisticasUsuario(uid) {
 *   try {
 *     const quizCol  = collection(getDb(), 'usuarios', uid, 'quiz_respostas');
 *     const quizSnap = await getDocs(quizCol);
 *
 *     let totalRespondidas = 0;
 *     let totalCorretas    = 0;
 *     let ultimoAcesso     = null;
 *
 *     quizSnap.forEach(d => {
 *       const data = d.data();
 *       // data.respostas é string compacta — parsear conforme quiz_engine
 *       // data.finalizado, data.savedAt
 *       if (data.savedAt > (ultimoAcesso ?? 0)) ultimoAcesso = data.savedAt;
 *     });
 *
 *     return { ok: true, totalRespondidas, totalCorretas, ultimoAcesso };
 *   } catch (err) {
 *     console.error('[firebase] getEstatisticasUsuario erro:', err);
 *     return { ok: false };
 *   }
 * }
 */

/* ── GERAR HASH (utilitário de console) ── */
export async function gerarHash(pin) {
  const h = await hashPin(pin);
  console.log(`PIN: ${pin}  →  hash: ${h}`);
  return h;
}