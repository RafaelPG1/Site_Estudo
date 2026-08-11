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
import { renderTarefas, reabrirRascunhoNovaListaSeExistir } from './tarefa_renderer.js';

/* ─────────────────────────────────────────────
   UI STATE MANAGER (sistema global de preservação de estado)
   ─────────────────────────────────────────────
   _rerender() é chamado depois de TODA mutação (criar/renomear/
   excluir lista, categoria ou tarefa, marcar/desmarcar item) — cada
   uma delas reconstrói `.tarefa-listas-wrap` do zero (ver
   tarefa_renderer.js → renderTarefas → innerHTML). Sem tratamento,
   marcar uma única tarefa no meio de uma lista longa jogaria o
   usuário de volta pro topo da página a cada clique. Envolver
   _rerender() com UIState.preserveScroll() resolve isso de forma
   genérica, no único ponto por onde toda atualização já passa. */
import { UIState } from '../utils/ui_state_manager.js';

let _viewAberta      = false;
let _listasEmMemoria = [];
let _disciplinas     = [];
let _containerAtual  = null;

/* Garante que a verificação de rascunho pendente (modal "Nova
   lista") só é feita UMA VEZ por carregamento de página — não a
   cada vez que o usuário navega para a aba Tarefas. Continua sendo
   exatamente o momento certo mesmo que a 1ª exibição de Tarefas
   após o F5 não seja imediata (ex.: o usuário estava no Dashboard
   no reload e só clicou em "Tarefas" depois): é a 1ª vez que
   abrirTarefas roda desde o carregamento, e é isso que importa. */
let _verificouRascunhoModalNaBoot = false;

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
  const containerEl = _containerAtual;
  UIState.preserveScroll('tarefas-rerender', {
    window: 'window',
    corpo: () => containerEl,
  }, () => {
    renderTarefas(containerEl, _listasEmMemoria, _callbacks, _disciplinas);
  });
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

let _geracaoAtual = 0; // guarda de geração — mesma técnica de checklist.js

export async function abrirTarefas(containerEl) {
  if (!containerEl) return;
  _viewAberta = true;
  _containerAtual = containerEl;
  const minhaGeracao = ++_geracaoAtual;

  containerEl.innerHTML = `<div class="tarefa-loading">Carregando tarefas…</div>`;

  const usuario = getUsuario?.();
  _disciplinas = _carregarDisciplinasSemestreAtual();
  _listasEmMemoria = await TarefaStorage.carregarListas(usuario?.uid ?? null);

  /* Guarda de geração: se abrirTarefas() foi chamado de novo (ou a
     view foi fechada) enquanto esperávamos, esta resposta antiga
     não deve sobrescrever o que já está na tela. Comparar apenas
     containerEl não bastava — o mesmo elemento é reaproveitado
     entre aberturas, então uma resposta antiga podia "vencer" uma
     mais nova se chegasse depois dela. */
  if (!_viewAberta || _containerAtual !== containerEl || minhaGeracao !== _geracaoAtual) return;

  renderTarefas(containerEl, _listasEmMemoria, _callbacks, _disciplinas);

  if (!_verificouRascunhoModalNaBoot) {
    _verificouRascunhoModalNaBoot = true;
    /* Reabre sozinho o modal "Nova lista" se havia um rascunho não
       salvo antes do F5 (ver tarefa_modal.js/tarefa_renderer.js). */
    await reabrirRascunhoNovaListaSeExistir();
  }
}

export function fecharTarefas() {
  _viewAberta = false;
  _containerAtual = null;
}