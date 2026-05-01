/* ═══════════════════════════════════════════════════
   NEXUS STUDY — games/jogos/show_milhao/storage_sm.js
   Histórico de desempenho do Show do Milhão persistido
   no Firestore + localStorage (fallback/cache).

   Chave local : nexus_sm_{usuario}_{discId}_{sem}
   Firestore   : usuarios/{uid}/sm_historico/{sem}_{discId}

   Estrutura de cada entrada:
     {
       [questaoId]: {
         tentativas: number,
         acertos:    number,
         erros:      number,
         ultimaVez:  timestamp (ms),
         acertosConsecutivos: number,
       }
     }

   Nota: questões com tempo esgotado (resp === null)
   são neutras — não incrementam acertos nem erros.
   O filtro é aplicado tanto no caller (show_milhao.js)
   quanto aqui como defesa em profundidade.
═══════════════════════════════════════════════════ */

import { doc, getDoc, setDoc, deleteDoc }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getDb } from '../../../src/firebase.js';

/* ── Helpers de chave ── */
const _chaveLocal = (usuario, discId, sem) =>
  `nexus_sm_${usuario}_${discId}_${sem}`;

const _docRef = (usuario, discId, sem) =>
  doc(getDb(), 'usuarios', usuario, 'sm_historico', `${sem}_${discId}`);

/* ══════════════════════════════════════════════════
   CARREGAR histórico completo da disciplina
══════════════════════════════════════════════════ */
export async function carregarHistoricoSM(usuario, discId, sem) {
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
      console.log(`[storage_sm] Histórico carregado do Firestore: ${usuario}/${sem}_${discId}`);
      return dados;
    }
    return _lerLocal(usuario, discId, sem);
  } catch (err) {
    console.warn('[storage_sm] Firestore indisponível, usando localStorage:', err.message);
    return _lerLocal(usuario, discId, sem);
  }
}

/* ══════════════════════════════════════════════════
   SALVAR resultado de uma rodada
   Recebe um array de resultados: [{ id, acertou, resp }]

   Defesa em profundidade: questões com resp === null
   (tempo esgotado) são excluídas antes de processar,
   evitando contaminar o histórico com erros indevidos.
══════════════════════════════════════════════════ */
export async function salvarResultadoSM(usuario, discId, sem, resultados) {
  const resultadosValidos = resultados.filter(
    r => r.resp !== null && r.resp !== undefined
  );

  if (resultadosValidos.length === 0) return;

  // 1. Atualiza localStorage primeiro (rápido, nunca falha)
  const atual = _lerLocal(usuario, discId, sem);

  for (const { id, acertou } of resultadosValidos) {
    const entrada = atual[id] ?? {
      tentativas: 0, acertos: 0, erros: 0,
      ultimaVez: 0, acertosConsecutivos: 0,
    };
    entrada.tentativas++;
    if (acertou) {
      entrada.acertos++;
      entrada.acertosConsecutivos = (entrada.acertosConsecutivos ?? 0) + 1;
    } else {
      entrada.erros++;
      entrada.acertosConsecutivos = 0;
    }
    entrada.ultimaVez = Date.now();
    atual[id] = entrada;
  }

  try {
    localStorage.setItem(
      _chaveLocal(usuario, discId, sem),
      JSON.stringify(atual),
    );
  } catch (err) {
    console.error('[storage_sm] Erro ao salvar localStorage:', err);
  }

  // 2. Sincroniza Firestore (merge para não sobrescrever outras questões)
  if (!usuario || usuario === 'visitante') return;

  try {
    const patch = {};
    for (const { id } of resultadosValidos) {
      patch[id] = atual[id];
    }
    await setDoc(_docRef(usuario, discId, sem), patch, { merge: true });
  } catch (err) {
    console.warn('[storage_sm] Erro ao salvar no Firestore (dados no localStorage):', err.message);
  }
}

/* ══════════════════════════════════════════════════
   LIMPAR histórico de uma disciplina
══════════════════════════════════════════════════ */
export async function limparHistoricoSM(usuario, discId, sem) {
  if (!usuario || usuario === 'visitante') {
    localStorage.removeItem(_chaveLocal(usuario, discId, sem));
    return;
  }

  // Apaga Firestore PRIMEIRO; só remove local após confirmação.
  try {
    await deleteDoc(_docRef(usuario, discId, sem));
    console.log(`[storage_sm] Histórico apagado no Firestore: ${usuario}/${sem}_${discId}`);
  } catch (err) {
    console.warn('[storage_sm] Erro ao apagar no Firestore — localStorage mantido:', err.message);
    return;
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
    console.warn('[storage_sm] Erro ao ler localStorage (dado corrompido?):', err.message);
    return {};
  }
}