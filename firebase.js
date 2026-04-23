/* =============================================
   NEXUS STUDY — firebase.js
   Autenticação com Firestore + PIN com hash SHA-256
   ============================================= */

import { initializeApp }              from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';

import { getFirestore, doc, getDoc, setDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { setUsuario }                 from './global.js';

/* ── CONFIG ─────────────────────────────────── */
const firebaseConfig = {
  apiKey:            'AIzaSyBWRSuyiPS9ez7TFm7K4j5pd7LbdSfPPMk',
  authDomain:        'estudo-site-85244.firebaseapp.com',
  projectId:         'estudo-site-85244',
  storageBucket:     'estudo-site-85244.firebasestorage.app',
  messagingSenderId: '529138252727',
  appId:             '1:529138252727:web:d866279f0c795b013e4632',
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

/* ── HASH SHA-256 (Web Crypto API — sem dependências) ── */
async function hashPin(pin) {
  const encoded = new TextEncoder().encode(String(pin));
  const buffer  = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/* ── LOGIN ──────────────────────────────────────
   Retorna: { ok: true, usuario } | { ok: false, erro: string }
─────────────────────────────────────────────── */
export async function login(nome, pin) {
  if (!nome || !pin) {
    return { ok: false, erro: 'Preencha nome e PIN.' };
  }

  const id = nome.trim().toLowerCase();

  try {
    const ref  = doc(db, 'usuarios', id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return { ok: false, erro: 'Usuário não encontrado.' };
    }

    const dados    = snap.data();
    const hashDig  = await hashPin(pin);

    if (hashDig !== dados.pin) {
      return { ok: false, erro: 'PIN incorreto.' };
    }

    const usuario = {
      uid:    id,
      nome:   dados.nome ?? nome,
      avatar: dados.avatar ?? '🎓',
      foto:   dados.foto   ?? null,
    };

    setUsuario(usuario);
    return { ok: true, usuario };

  } catch (err) {
    console.error('[firebase.js] Erro no login:', err);
    return { ok: false, erro: 'Erro de conexão. Tente novamente.' };
  }
}

/* ── LOGOUT ─────────────────────────────────── */
export function logout() {
  setUsuario(null);
}

/* ── CONFIGS DO USUÁRIO ─────────────────────────────────────
   salvarConfigs(uid, configs) → Promise<{ ok: bool }>
   carregarConfigs(uid)        → Promise<configs | null>
─────────────────────────────────────────────────────────── */
export async function salvarConfigs(uid, configs) {
  try {
    const ref = doc(db, 'usuarios', uid);
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
    const ref  = doc(db, 'usuarios', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      console.warn('[firebase] carregarConfigs: documento não encontrado para', uid);
      return null;
    }
    const configs = snap.data().configs ?? null;
    console.log('[firebase] carregarConfigs: resultado bruto do Firestore →', snap.data());
    console.log('[firebase] carregarConfigs: campo configs →', configs);
    return configs;
  } catch (err) {
    console.error('[firebase.js] Erro ao carregar configs:', err);
    return null;
  }
}

/* ── RESPOSTAS DO QUIZ ──────────────────────────────────────
   Estrutura: usuarios/{uid}/quiz_respostas/{semestre}_{modo}_{disc}
   respostasStr → string compacta ex: "2,0,null,1,null,3"
     cada posição = índice da questão
     valor = opção escolhida (0-3) ou "null" se não respondida
─────────────────────────────────────────────────────────── */

function _quizRef(uid, semestre, modo, disc) {
  return doc(db, 'usuarios', uid, 'quiz_respostas', `${semestre}_${modo}_${disc}`);
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
    return data; // { respostas: string, revelado, finalizado, savedAt }
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

/* ── GERAR HASH (utilitário — use no console para gerar os hashes dos PINs) ──
   Abra o console do navegador e rode:
     import('/firebase.js').then(m => m.gerarHash('288').then(console.log))
─────────────────────────────────────────────── */
export async function gerarHash(pin) {
  const h = await hashPin(pin);
  console.log(`PIN: ${pin}  →  hash: ${h}`);
  return h;
}