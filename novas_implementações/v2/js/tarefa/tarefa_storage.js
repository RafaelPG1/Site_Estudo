/* dashboard\js\tarefa\tarefa_storage.js
   proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   Responsabilidade ÚNICA: persistência das listas de Tarefas do
   usuário. Diferente do Checklist (conteúdo fixo, só leitura),
   aqui TUDO é criado/editado/excluído pelo próprio usuário e
   pertence exclusivamente a ele (isolado por uid).

   Firestore:
     usuarios/{uid}/tarefas_listas/{listaId}
       {
         nome: string,
         disciplinaId: string|null,
         ordem: number,
         criadoEm: timestamp,
         categorias: [
           {
             id, nome, ordem,
             tarefas: [
               { id, titulo, concluido, ordem, criadoEm,
                 // preparado para o futuro, ainda não usado:
                 dataVencimento: null, prioridade: null, etiquetas: [] }
             ]
           }
         ]
       }

   Fallback local (localStorage) — mesmo padrão de
   checklist_storage.js — usado só quando não há uid (usuário não
   autenticado). Chave: nexus_tarefas_listas::{uid|anon}

   Cada mutação reescreve o documento da lista inteira (categorias
   é array aninhado — mais simples que subcoleções para permitir
   editar/excluir itens no meio do array). Aceitável para o volume
   de dados de uma lista de tarefas pessoal. */

import { getDb } from '../../../../src/firebase.js';
import {
  collection, doc, getDocs, setDoc, deleteDoc, query, orderBy,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

function _chaveLocal(uid) {
  return `nexus_tarefas_listas::${uid ?? 'anon'}`;
}

function _lerLocal(uid) {
  try {
    const raw = localStorage.getItem(_chaveLocal(uid));
    return raw ? JSON.parse(raw) : [];
  } catch (_) { return []; }
}

function _gravarLocal(uid, listas) {
  try {
    localStorage.setItem(_chaveLocal(uid), JSON.stringify(listas));
  } catch (_) { /* localStorage indisponível — ignora silenciosamente */ }
}

function _gerarId(prefixo) {
  return `${prefixo}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function _atualizarListaNoCache(uid, listaAtualizada) {
  const listas = _lerLocal(uid);
  const idx = listas.findIndex(l => l.id === listaAtualizada.id);
  if (idx === -1) listas.push(listaAtualizada); else listas[idx] = listaAtualizada;
  _gravarLocal(uid, listas);
}

export async function carregarListas(uid) {
  if (!uid) return _lerLocal(uid);

  try {
    const db   = getDb();
    const ref  = collection(db, 'usuarios', uid, 'tarefas_listas');
    const q    = query(ref, orderBy('ordem', 'asc'));
    const snap = await getDocs(q);
    const listas = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    _gravarLocal(uid, listas);
    return listas;
  } catch (err) {
    console.warn('[tarefa_storage] carregarListas: falha ao ler Firestore, usando cache local.', err);
    return _lerLocal(uid);
  }
}

async function _salvarListaCompleta(uid, lista) {
  _atualizarListaNoCache(uid, lista);
  if (!uid) return;

  try {
    const db  = getDb();
    const ref = doc(db, 'usuarios', uid, 'tarefas_listas', lista.id);
    await setDoc(ref, {
      nome:         lista.nome,
      disciplinaId: lista.disciplinaId ?? null,
      ordem:        lista.ordem ?? 0,
      criadoEm:     lista.criadoEm ?? Date.now(),
      categorias:   lista.categorias ?? [],
    });
  } catch (err) {
    console.warn('[tarefa_storage] falha ao sincronizar lista com Firestore (mantido apenas local).', err);
  }
}

/* ── Listas ──
   `disciplinaId` é opcional (null por padrão) — não muda o
   contrato de quem já chamava criarLista sem esse argumento. */
export async function criarLista(uid, nome, ordem = 0, disciplinaId = null) {
  const lista = { id: _gerarId('lista'), nome, disciplinaId, ordem, criadoEm: Date.now(), categorias: [] };
  await _salvarListaCompleta(uid, lista);
  return lista;
}

/* Usada pelo "Modo completo" do modal de criação — monta e grava a
   lista já com categorias e itens em UMA única escrita, reaproveitando
   a mesma _salvarListaCompleta() de sempre (mesma coleção, mesmo
   formato, mesmo cache local). Não é um novo mecanismo de persistência.
   `categoriasSpec`: [{ nome: string, itens: string[] }] */
export async function criarListaCompleta(uid, nome, disciplinaId, categoriasSpec, ordem = 0) {
  const categorias = (categoriasSpec ?? []).map((catSpec, catIdx) => ({
    id:    _gerarId('cat'),
    nome:  catSpec.nome,
    ordem: catIdx,
    tarefas: (catSpec.itens ?? []).map((titulo, tarIdx) => ({
      id:        _gerarId('tar'),
      titulo,
      concluido: false,
      ordem:     tarIdx,
      criadoEm:  Date.now(),
      /* mesmos campos preparados para o futuro já usados em criarTarefa() */
      dataVencimento: null,
      prioridade:     null,
      etiquetas:      [],
    })),
  }));

  const lista = {
    id: _gerarId('lista'),
    nome,
    disciplinaId: disciplinaId ?? null,
    ordem,
    criadoEm: Date.now(),
    categorias,
  };

  await _salvarListaCompleta(uid, lista);
  return lista;
}

export async function renomearLista(uid, lista, novoNome) {
  lista.nome = novoNome;
  await _salvarListaCompleta(uid, lista);
}

export async function excluirLista(uid, listaId) {
  const listas = _lerLocal(uid).filter(l => l.id !== listaId);
  _gravarLocal(uid, listas);
  if (!uid) return;
  try {
    await deleteDoc(doc(getDb(), 'usuarios', uid, 'tarefas_listas', listaId));
  } catch (err) {
    console.warn('[tarefa_storage] falha ao excluir lista no Firestore.', err);
  }
}

/* ── Categorias ── */
export async function criarCategoria(uid, lista, nome) {
  const categoria = { id: _gerarId('cat'), nome, ordem: (lista.categorias?.length ?? 0), tarefas: [] };
  lista.categorias = [...(lista.categorias ?? []), categoria];
  await _salvarListaCompleta(uid, lista);
  return categoria;
}

export async function renomearCategoria(uid, lista, categoriaId, novoNome) {
  lista.categorias = (lista.categorias ?? []).map(c => c.id === categoriaId ? { ...c, nome: novoNome } : c);
  await _salvarListaCompleta(uid, lista);
}

export async function excluirCategoria(uid, lista, categoriaId) {
  lista.categorias = (lista.categorias ?? []).filter(c => c.id !== categoriaId);
  await _salvarListaCompleta(uid, lista);
}

/* ── Tarefas ── */
export async function criarTarefa(uid, lista, categoriaId, titulo) {
  const tarefa = {
    id: _gerarId('tar'), titulo, concluido: false, ordem: 0, criadoEm: Date.now(),
    /* preparado para funcionalidades futuras — não usado ainda */
    dataVencimento: null, prioridade: null, etiquetas: [],
  };
  lista.categorias = (lista.categorias ?? []).map(c => {
    if (c.id !== categoriaId) return c;
    tarefa.ordem = c.tarefas?.length ?? 0;
    return { ...c, tarefas: [...(c.tarefas ?? []), tarefa] };
  });
  await _salvarListaCompleta(uid, lista);
  return tarefa;
}

export async function editarTarefa(uid, lista, categoriaId, tarefaId, novoTitulo) {
  lista.categorias = (lista.categorias ?? []).map(c => {
    if (c.id !== categoriaId) return c;
    return { ...c, tarefas: (c.tarefas ?? []).map(t => t.id === tarefaId ? { ...t, titulo: novoTitulo } : t) };
  });
  await _salvarListaCompleta(uid, lista);
}

export async function excluirTarefa(uid, lista, categoriaId, tarefaId) {
  lista.categorias = (lista.categorias ?? []).map(c => {
    if (c.id !== categoriaId) return c;
    return { ...c, tarefas: (c.tarefas ?? []).filter(t => t.id !== tarefaId) };
  });
  await _salvarListaCompleta(uid, lista);
}

export async function toggleTarefa(uid, lista, categoriaId, tarefaId, concluido) {
  lista.categorias = (lista.categorias ?? []).map(c => {
    if (c.id !== categoriaId) return c;
    return { ...c, tarefas: (c.tarefas ?? []).map(t => t.id === tarefaId ? { ...t, concluido } : t) };
  });
  await _salvarListaCompleta(uid, lista);
}