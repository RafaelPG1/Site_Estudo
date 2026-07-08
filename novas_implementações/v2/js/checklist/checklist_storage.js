/* dashboard\js\checklist\checklist_storage.js
 proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   Responsabilidade ÚNICA deste arquivo: persistência do
   PROGRESSO do usuário no Checklist (item marcado/desmarcado).

   NUNCA lê nem escreve o conteúdo do checklist (checklist_data.js)
   — esse é fonte fixa e somente leitura, montada por
   content/pessoal/{ano}/{semestre}/checklist_data.js.

   Progresso é armazenado em:
     Firestore: usuarios/{uid}/checklist_progresso/{semestre}
       { itens: { [itemId]: true|false }, atualizadoEm: <timestamp> }

   Fallback local (localStorage), usado:
     - enquanto a escrita remota não confirma (otimista)
     - quando não há usuário autenticado (uid ausente)
   Chave local: nexus_checklist_progresso::{semestre}

   Mesmo padrão de acesso ao Firestore já usado em
   dashboard/js/dashboard_data.js (getDb() + SDK modular via CDN). */

import { getDb } from '../../../../src/firebase.js';
import {
  doc, getDoc, setDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

function _chaveLocal(semestre) {
  return `nexus_checklist_progresso::${semestre}`;
}

function _lerLocal(semestre) {
  try {
    const raw = localStorage.getItem(_chaveLocal(semestre));
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

function _gravarLocal(semestre, itens) {
  try {
    localStorage.setItem(_chaveLocal(semestre), JSON.stringify(itens));
  } catch (_) { /* localStorage indisponível — ignora silenciosamente */ }
}

/* Carrega o progresso do usuário para um semestre específico.
   Retorna sempre um objeto { [itemId]: boolean } — nunca null/undefined.
   Mescla remoto + local (remoto prevalece em conflito), e já
   grava o resultado mesclado de volta no cache local, para que
   salvarItem() sempre parta de uma base atualizada. */
export async function carregarProgresso(uid, semestre) {
  if (!semestre) return {};

  const local = _lerLocal(semestre);
  if (!uid) return local;

  try {
    const db   = getDb();
    const ref  = doc(db, 'usuarios', uid, 'checklist_progresso', semestre);
    const snap = await getDoc(ref);

    if (!snap.exists()) return local;

    const remoto   = snap.data()?.itens ?? {};
    const mesclado = { ...local, ...remoto };
    _gravarLocal(semestre, mesclado);
    return mesclado;
  } catch (err) {
    console.warn('[checklist_storage] carregarProgresso: falha ao ler Firestore, usando cache local.', err);
    return local;
  }
}

/* Salva o estado de UM item (marcado/desmarcado).
   Grava otimisticamente no local primeiro (resposta instantânea
   na UI), depois tenta sincronizar com o Firestore. Falha de rede
   nunca quebra a experiência — o item permanece marcado localmente
   e será re-sincronizado na próxima leitura/gravação bem-sucedida. */
export async function salvarItem(uid, semestre, itemId, concluido) {
  if (!semestre || !itemId) return;

  const local = _lerLocal(semestre);
  local[itemId] = !!concluido;
  _gravarLocal(semestre, local);

  if (!uid) return;

  try {
    const db  = getDb();
    const ref = doc(db, 'usuarios', uid, 'checklist_progresso', semestre);
    await setDoc(ref, {
      itens:        local,
      atualizadoEm: Date.now(),
    }, { merge: true });
  } catch (err) {
    console.warn('[checklist_storage] salvarItem: falha ao sincronizar com Firestore (mantido apenas local).', err);
  }
}