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

import { getDb } from '../../../src/firebase.js';
import {
  doc, getDoc, setDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

/* ─────────────────────────────────────────────
   UI STATE MANAGER — sistema GLOBAL de preservação de estado de
   interface (ver dashboard/js/utils/ui_state_manager.js). A seção
   "ESTADO DE UI" abaixo costumava ter sua PRÓPRIA chave de
   localStorage e seu próprio parsing/validação — exatamente o tipo
   de solução isolada por tela que o sistema global veio substituir.
   As funções carregarEstadoUI()/salvarEstadoUI() continuam
   existindo com a MESMA assinatura (checklist.js e
   checklist_renderer.js não precisam saber onde/como isso é
   guardado agora), só que por baixo elas delegam tudo ao UIState —
   a mesma peça que Tarefas, Agenda, Dashboard e Conquistas também
   usam. Isso é o "cada módulo registra o que precisa preservar,
   toda a lógica de salvar/restaurar fica centralizada" pedido. ── */
import { UIState } from '../utils/ui_state_manager.js';

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

/* Uma key de estado por semestre — mesmo motivo de sempre: abrir/
   recolher disciplinas num semestre nunca deve afetar outro. */
function _chaveEstadoUI(semestre) {
  return `checklist:${semestre}`;
}

const _ESTADO_UI_VAZIO = Object.freeze({ filtro: 'todas', colapsados: [], categoriasColapsadas: [] });

/* Lê o estado de UI salvo para o semestre (filtro ativo + o que
   está recolhido). Retorna sempre um objeto completo — nunca
   null/undefined — mesmo se nada foi salvo ainda ou o dado salvo
   estiver corrompido (mesma postura defensiva de sempre, agora
   garantida centralmente por UIState.getState). */
export function carregarEstadoUI(semestre) {
  if (!semestre) return { ..._ESTADO_UI_VAZIO };

  const estado = UIState.getState(_chaveEstadoUI(semestre), _ESTADO_UI_VAZIO);
  return {
    filtro: typeof estado.filtro === 'string' ? estado.filtro : 'todas',
    colapsados: Array.isArray(estado.colapsados) ? estado.colapsados : [],
    categoriasColapsadas: Array.isArray(estado.categoriasColapsadas) ? estado.categoriasColapsadas : [],
  };
}

/* Salva o estado de UI do semestre via UIState (sessionStorage —
   sobrevive a F5, que é o requisito real aqui; não precisa
   sincronizar entre dispositivos nem sobreviver ao fechamento da
   aba). Chamado pelo orquestrador (checklist.js) toda vez que o
   usuário expande/recolhe uma disciplina/categoria ou troca de
   filtro (ver checklist_renderer.js). */
export function salvarEstadoUI(semestre, estadoUI) {
  if (!semestre) return;

  UIState.setState(_chaveEstadoUI(semestre), {
    filtro: typeof estadoUI?.filtro === 'string' ? estadoUI.filtro : 'todas',
    colapsados: Array.isArray(estadoUI?.colapsados) ? estadoUI.colapsados : [],
    categoriasColapsadas: Array.isArray(estadoUI?.categoriasColapsadas) ? estadoUI.categoriasColapsadas : [],
  });
}