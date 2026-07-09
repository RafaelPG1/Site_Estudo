/* dashboard\js\tarefa\tarefa.js
   proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   Orquestrador do módulo Tarefas — ponto único de integração com o
   Dashboard (importado apenas por dashboard.js), no mesmo padrão do
   Checklist (dashboard/js/checklist/checklist.js).

   Diferença fundamental: aqui NÃO existe fonte de dados oficial —
   tudo (listas, categorias, tarefas) é criado/editado/excluído
   livremente pelo usuário e salvo no Firebase, sempre isolado por
   uid (ver tarefa_storage.js). A associação com disciplina é só um
   campo opcional, resolvido a partir do semestre atual via
   getDisciplinasDeSemestre() — já exportado por src/global.js e
   usado pelo próprio Dashboard (mesma fonte do card "Disciplinas"). */

import { getUsuario, getSemestreAtual, getDisciplinasDeSemestre } from '../../../src/global.js';
import * as TarefaStorage from './tarefa_storage.js';
import { renderTarefas } from './tarefa_renderer.js';

let _viewAberta      = false;
let _listasEmMemoria = [];
let _disciplinas     = [];
let _containerAtual  = null;

export function tarefasEstaAberta() {
  return _viewAberta;
}

/* Disciplinas do semestre atual, para o campo "Associar a uma
   disciplina" do modal de nova lista. getDisciplinasDeSemestre()
   já existe em src/global.js (mesma fonte usada pelo Dashboard em
   _renderDisciplinas()) — aqui remapeamos para { id, nome, emoji },
   formato que o modal usa para montar o select com ícone + nome. */
function _carregarDisciplinasSemestreAtual() {
  try {
    const semestre = getSemestreAtual();
    const lista = getDisciplinasDeSemestre(semestre) ?? [];
    return lista.map(d => ({ id: d.id, nome: d.nome, emoji: d.emoji ?? null }));
  } catch (err) {
    console.warn('[tarefa] falha ao resolver disciplinas do semestre atual.', err);
    return [];
  }
}

function _rerender() {
  if (!_containerAtual) return;
  renderTarefas(_containerAtual, _listasEmMemoria, _callbacks, _disciplinas);
}

const _callbacks = {
  onCriarLista: async (spec) => {
    const uid = getUsuario?.()?.uid ?? null;
    const lista = spec.categorias?.length
      ? await TarefaStorage.criarListaCompleta(uid, spec.nome, spec.disciplinaId, spec.categorias, _listasEmMemoria.length)
      : await TarefaStorage.criarLista(uid, spec.nome, _listasEmMemoria.length, spec.disciplinaId);
    _listasEmMemoria.push(lista);
    _rerender();
  },
  onRenomearLista: async (lista, novoNome) => {
    await TarefaStorage.renomearLista(getUsuario?.()?.uid ?? null, lista, novoNome);
    _rerender();
  },
  onExcluirLista: async (lista) => {
    await TarefaStorage.excluirLista(getUsuario?.()?.uid ?? null, lista.id);
    _listasEmMemoria = _listasEmMemoria.filter(l => l.id !== lista.id);
    _rerender();
  },
  onCriarCategoria: async (lista, nome) => {
    await TarefaStorage.criarCategoria(getUsuario?.()?.uid ?? null, lista, nome);
    _rerender();
  },
  onRenomearCategoria: async (lista, categoria, novoNome) => {
    await TarefaStorage.renomearCategoria(getUsuario?.()?.uid ?? null, lista, categoria.id, novoNome);
    _rerender();
  },
  onExcluirCategoria: async (lista, categoria) => {
    await TarefaStorage.excluirCategoria(getUsuario?.()?.uid ?? null, lista, categoria.id);
    _rerender();
  },
  onCriarTarefa: async (lista, categoria, titulo) => {
    await TarefaStorage.criarTarefa(getUsuario?.()?.uid ?? null, lista, categoria.id, titulo);
    _rerender();
  },
  onEditarTarefa: async (lista, categoria, tarefa, novoTitulo) => {
    await TarefaStorage.editarTarefa(getUsuario?.()?.uid ?? null, lista, categoria.id, tarefa.id, novoTitulo);
    _rerender();
  },
  onExcluirTarefa: async (lista, categoria, tarefa) => {
    await TarefaStorage.excluirTarefa(getUsuario?.()?.uid ?? null, lista, categoria.id, tarefa.id);
    _rerender();
  },
  onToggleTarefa: async (lista, categoria, tarefa, concluido) => {
    tarefa.concluido = concluido; // otimista, resposta instantânea
    await TarefaStorage.toggleTarefa(getUsuario?.()?.uid ?? null, lista, categoria.id, tarefa.id, concluido);
    _rerender(); // atualiza contagens/progresso de categoria e lista
  },
};

export async function abrirTarefas(containerEl) {
  if (!containerEl) return;
  _viewAberta = true;
  _containerAtual = containerEl;

  containerEl.innerHTML = `<div class="tarefa-loading">Carregando tarefas…</div>`;

  const usuario = getUsuario?.();
  _disciplinas = _carregarDisciplinasSemestreAtual();
  _listasEmMemoria = await TarefaStorage.carregarListas(usuario?.uid ?? null);

  /* Guarda simples: se a view foi trocada enquanto carregava, não
     sobrescreve o que já está na tela. */
  if (!_viewAberta || _containerAtual !== containerEl) return;

  renderTarefas(containerEl, _listasEmMemoria, _callbacks, _disciplinas);
}

export function fecharTarefas() {
  _viewAberta = false;
  _containerAtual = null;
}