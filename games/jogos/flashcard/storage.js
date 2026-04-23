/* ═══════════════════════════════════════════════════
   NEXUS STUDY — games/jogos/flashcard/storage.js
   SRS persistido no Firestore + localStorage (fallback/cache).
   Chave local: nexus_srs_{usuario}_{discId}_{sem}
   Firestore:   usuarios/{uid}/srs_perfis/{sem}_{discId}
═══════════════════════════════════════════════════ */

import { doc, getDoc, setDoc, deleteDoc }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getDb } from '../../../src/firebase.js';

const _chaveLocal = (usuario, discId, sem) =>
  `nexus_srs_${usuario}_${discId}_${sem}`;
const _docRef = (usuario, discId, sem) => {
  console.log('[_docRef] valores:', { usuario, discId, sem });
  console.log('[_docRef] getDb():', getDb());
  return doc(getDb(), 'usuarios', usuario, 'srs_perfis', `${sem}_${discId}`);
};
/* ── CARREGAR ── */
export async function carregarPerfisSRS(usuario, discId, sem) {
    console.log('[carregarPerfisSRS] chamado com:', { usuario, discId, sem });
  if (!usuario || usuario === 'visitante') {
    return _lerLocal(usuario, discId, sem);
  }

  try {
    const snap = await getDoc(_docRef(usuario, discId, sem));
    if (snap.exists()) {
      const dados = snap.data();
      localStorage.setItem(
        _chaveLocal(usuario, discId, sem),
        JSON.stringify(dados),
      );
      console.log(`[storage] SRS carregado do Firestore: ${usuario}/${sem}_${discId}`);
      return dados;
    }
    return _lerLocal(usuario, discId, sem);
  } catch (err) {
    console.warn('[storage] Firestore indisponível, usando localStorage:', err.message);
    return _lerLocal(usuario, discId, sem);
  }
}

/* ── SALVAR PERFIL INDIVIDUAL ── */
export async function salvarPerfilSRS(usuario, cardId, perfil, discId, sem) {
  _salvarLocal(usuario, cardId, perfil, discId, sem);

  if (!usuario || usuario === 'visitante') return;

  try {
    await setDoc(
      _docRef(usuario, discId, sem),
      { [cardId]: perfil },
      { merge: true },
    );
  } catch (err) {
    console.warn('[storage] Erro ao salvar no Firestore (dados salvos no localStorage):', err.message);
  }
}

/* ── LIMPAR UMA DISCIPLINA ── */
export async function limparPerfisSRS(usuario, discId, sem) {
  localStorage.removeItem(_chaveLocal(usuario, discId, sem));

  if (!usuario || usuario === 'visitante') return;

  try {
    await deleteDoc(_docRef(usuario, discId, sem));
    console.log(`[storage] SRS apagado no Firestore: ${usuario}/${sem}_${discId}`);
  } catch (err) {
    console.warn('[storage] Erro ao apagar no Firestore:', err.message);
  }
}

/* ── HELPERS LOCAIS ── */
function _lerLocal(usuario, discId, sem) {
  try {
    const salvo = localStorage.getItem(_chaveLocal(usuario, discId, sem));
    return salvo ? JSON.parse(salvo) : {};
  } catch {
    return {};
  }
}

function _salvarLocal(usuario, cardId, perfil, discId, sem) {
  try {
    const chave = _chaveLocal(usuario, discId, sem);
    const atual = JSON.parse(localStorage.getItem(chave) || '{}');
    atual[cardId] = perfil;
    localStorage.setItem(chave, JSON.stringify(atual));
  } catch (err) {
    console.error('[storage] Erro ao salvar local:', err);
  }
}