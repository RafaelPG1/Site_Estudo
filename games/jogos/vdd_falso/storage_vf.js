/* ═══════════════════════════════════════════════════
   NEXUS STUDY — games/jogos/vdd_falso/storage_vf.js
   Histórico de desempenho do V/F persistido no
   Firestore + localStorage (fallback/cache).

   Chave local : nexus_vf_{usuario}_{discId}_{sem}
   Firestore   : usuarios/{uid}/vf_historico/{sem}_{discId}

   Estrutura de cada entrada:
     {
       [questaoId]: {
         tentativas: number,
         acertos:    number,
         erros:      number,
         ultimaVez:  timestamp (ms),
       }
     }
═══════════════════════════════════════════════════ */

import { doc, getDoc, setDoc, deleteDoc }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getDb } from '../../../src/firebase.js';

/* ── Helpers de chave ── */
const _chaveLocal = (usuario, discId, sem) =>
  `nexus_vf_${usuario}_${discId}_${sem}`;

const _docRef = (usuario, discId, sem) =>
  doc(getDb(), 'usuarios', usuario, 'vf_historico', `${sem}_${discId}`);

/* ══════════════════════════════════════════════════
   CARREGAR histórico completo da disciplina
══════════════════════════════════════════════════ */
export async function carregarHistoricoVF(usuario, discId, sem) {
  if (!usuario || usuario === 'visitante') {
    return _lerLocal(usuario, discId, sem);
  }

  try {
    const snap = await getDoc(_docRef(usuario, discId, sem));
    if (snap.exists()) {
      const dados = snap.data();
      // Atualiza cache local
      localStorage.setItem(
        _chaveLocal(usuario, discId, sem),
        JSON.stringify(dados),
      );
      console.log(`[storage_vf] Histórico carregado do Firestore: ${usuario}/${sem}_${discId}`);
      return dados;
    }
    // Firestore vazio → tenta local
    return _lerLocal(usuario, discId, sem);
  } catch (err) {
    console.warn('[storage_vf] Firestore indisponível, usando localStorage:', err.message);
    return _lerLocal(usuario, discId, sem);
  }
}

/* ══════════════════════════════════════════════════
   SALVAR resultado de uma rodada
   Recebe um array de resultados: [{ id, acertou }]
══════════════════════════════════════════════════ */
export async function salvarResultadoVF(usuario, discId, sem, resultados) {
  // 1. Atualiza localStorage primeiro (rápido, nunca falha)
  const atual = _lerLocal(usuario, discId, sem);

  for (const { id, acertou } of resultados) {
    const entrada = atual[id] ?? { tentativas: 0, acertos: 0, erros: 0, ultimaVez: 0 };
    entrada.tentativas++;
    acertou ? entrada.acertos++ : entrada.erros++;
    entrada.ultimaVez = Date.now();
    atual[id] = entrada;
  }

  try {
    localStorage.setItem(
      _chaveLocal(usuario, discId, sem),
      JSON.stringify(atual),
    );
  } catch (err) {
    console.error('[storage_vf] Erro ao salvar localStorage:', err);
  }

  // 2. Sincroniza Firestore (merge para não sobrescrever outras questões)
  if (!usuario || usuario === 'visitante') return;

  try {
    const patch = {};
    for (const { id } of resultados) {
      patch[id] = atual[id];
    }
    await setDoc(_docRef(usuario, discId, sem), patch, { merge: true });
  } catch (err) {
    console.warn('[storage_vf] Erro ao salvar no Firestore (dados no localStorage):', err.message);
  }
}

/* ══════════════════════════════════════════════════
   LIMPAR histórico de uma disciplina
══════════════════════════════════════════════════ */
export async function limparHistoricoVF(usuario, discId, sem) {
  // Visitante: só local, pode apagar direto
  if (!usuario || usuario === 'visitante') {
    localStorage.removeItem(_chaveLocal(usuario, discId, sem));
    return;
  }

  // Usuário autenticado: apaga Firestore PRIMEIRO.
  // O local só é removido após confirmação — se o deleteDoc falhar,
  // o cache local continua existindo e não "ressuscita" dados antigos
  // na próxima carga.
  try {
    await deleteDoc(_docRef(usuario, discId, sem));
    console.log(`[storage_vf] Histórico apagado no Firestore: ${usuario}/${sem}_${discId}`);
  } catch (err) {
    console.warn('[storage_vf] Erro ao apagar no Firestore — localStorage mantido:', err.message);
    return; // aborta: não apaga o local se o Firestore falhou
  }

  localStorage.removeItem(_chaveLocal(usuario, discId, sem));
}

/* ══════════════════════════════════════════════════
   HELPERS LOCAIS (internos)
══════════════════════════════════════════════════ */
function _lerLocal(usuario, discId, sem) {
  try {
    const salvo = localStorage.getItem(_chaveLocal(usuario, discId, sem));
    return salvo ? JSON.parse(salvo) : {};
  } catch (err) {
    console.warn('[storage_vf] Erro ao ler localStorage (dado corrompido?):', err.message);
    return {};
  }
}