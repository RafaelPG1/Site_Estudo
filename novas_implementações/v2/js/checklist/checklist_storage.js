/* dashboard\js\checklist\checklist_storage.js
 proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   Responsabilidade deste arquivo: persistência do PROGRESSO do
   usuário no Checklist (item marcado/desmarcado) E persistência
   do ESTADO DE UI dos accordions (disciplinas/categorias abertas
   ou fechadas). São dois dados diferentes, mas ambos usam o MESMO
   mecanismo de armazenamento local (localStorage) já existente
   neste arquivo — nenhum sistema de persistência novo foi criado.

   NUNCA lê nem escreve o conteúdo do checklist (checklist_data.js)
   — esse é fonte fixa e somente leitura, montada por
   content/pessoal/{ano}/{semestre}/checklist_data.js.

   ─────────────────────────────────────────────
   PROGRESSO (itens marcados/desmarcados)
   ─────────────────────────────────────────────
   Armazenado em:
     Firestore: usuarios/{uid}/checklist_progresso/{semestre}
       { itens: { [itemId]: true|false }, atualizadoEm: <timestamp> }

   Fallback local (localStorage), usado:
     - enquanto a escrita remota não confirma (otimista)
     - quando não há usuário autenticado (uid ausente)
   Chave local: nexus_checklist_progresso::{semestre}

   Mesmo padrão de acesso ao Firestore já usado em
   dashboard/js/dashboard_data.js (getDb() + SDK modular via CDN).

   ─────────────────────────────────────────────
   ESTADO DE UI (accordions abertos/fechados) — NOVO
   ─────────────────────────────────────────────
   Puramente visual (não é "progresso" do usuário, não vai para o
   Firestore, não é sincronizado entre dispositivos) — por isso
   fica somente em localStorage, sob uma chave própria e separada
   da chave de progresso, mas seguindo exatamente o mesmo padrão
   (uma chave por semestre, para que abrir/fechar disciplinas em
   um semestre nunca afete outro semestre):
     Chave local: nexus_checklist_ui::{semestre}
     Formato:     { colapsados: [discId, ...],
                    categoriasColapsadas: ["discId::catId", ...] }

   Guarda apenas os IDs (estáveis, vindos de checklistData — nunca
   índice de array) que estão RECOLHIDOS. Disciplina/categoria que
   não aparece na lista está, por definição, expandida — mesmo
   default já usado em memória por checklist_renderer.js
   (_estadoInicial), então nada muda para quem nunca usou o
   Checklist antes (primeira visita = nada salvo = tudo expandido,
   igual a hoje). */

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

/* ─────────────────────────────────────────────
   ESTADO DE UI — accordions de disciplina/categoria
   ───────────────────────────────────────────── */

function _chaveLocalUI(semestre) {
  return `nexus_checklist_ui::${semestre}`;
}

const _ESTADO_UI_VAZIO = Object.freeze({ colapsados: [], categoriasColapsadas: [] });

/* Lê o estado de UI salvo para o semestre. Retorna sempre um
   objeto { colapsados: string[], categoriasColapsadas: string[] }
   — nunca null/undefined — mesmo se nada foi salvo ainda, se o
   JSON estiver corrompido, ou se localStorage estiver indisponível
   (mesma postura defensiva de carregarProgresso/_lerLocal acima). */
export function carregarEstadoUI(semestre) {
  if (!semestre) return { ..._ESTADO_UI_VAZIO };

  try {
    const raw = localStorage.getItem(_chaveLocalUI(semestre));
    if (!raw) return { ..._ESTADO_UI_VAZIO };

    const parsed = JSON.parse(raw);
    return {
      colapsados: Array.isArray(parsed?.colapsados) ? parsed.colapsados : [],
      categoriasColapsadas: Array.isArray(parsed?.categoriasColapsadas) ? parsed.categoriasColapsadas : [],
    };
  } catch (_) {
    return { ..._ESTADO_UI_VAZIO };
  }
}

/* Salva o estado de UI do semestre. Somente local (localStorage) —
   estado de accordion é visual, não é "progresso" do usuário, não
   vai para o Firestore nem precisa sincronizar entre dispositivos.
   Chamado pelo orquestrador (checklist.js) toda vez que o usuário
   expande/recolhe uma disciplina ou categoria. */
export function salvarEstadoUI(semestre, estadoUI) {
  if (!semestre) return;

  try {
    localStorage.setItem(_chaveLocalUI(semestre), JSON.stringify({
      colapsados: Array.isArray(estadoUI?.colapsados) ? estadoUI.colapsados : [],
      categoriasColapsadas: Array.isArray(estadoUI?.categoriasColapsadas) ? estadoUI.categoriasColapsadas : [],
    }));
  } catch (_) { /* localStorage indisponível — ignora silenciosamente */ }
}