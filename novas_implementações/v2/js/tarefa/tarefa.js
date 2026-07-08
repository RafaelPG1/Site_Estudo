/* dashboard\js\tarefa\tarefa.js
   proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   Orquestrador do módulo Tarefas — ponto único de integração com o
   Dashboard (importado apenas por dashboard.js), no mesmo padrão do
   Checklist (dashboard/js/checklist/checklist.js).

   Diferença fundamental: aqui NÃO existe fonte de dados oficial —
   tudo (listas, categorias, tarefas) é criado/editado/excluído
   livremente pelo usuário e salvo no Firebase, sempre isolado por
   uid (ver tarefa_storage.js). Não depende de semestre para
   funcionar — a associação com disciplina é só um campo opcional. */

import { getUsuario } from '../../../../src/global.js';
import * as TarefaStorage from './tarefa_storage.js';
import { renderTarefas } from './tarefa_renderer.js';

let _viewAberta      = false;
let _listasEmMemoria = [];
let _disciplinas     = [];
let _containerAtual  = null;

export function tarefasEstaAberta() {
  return _viewAberta;
}

/* Carregamento OPCIONAL das disciplinas do semestre atual, para o
   campo "Associar a uma disciplina" do modal de nova lista.
   Import DINÂMICO propositalmente — se o caminho/nome do módulo
   real ainda não estiver correto (ou o arquivo não existir), o
   erro fica isolado aqui dentro do try/catch e NÃO derruba o
   import estático de tarefa.js inteiro (que quebraria o grafo de
   módulos de dashboard.js e impediria o Dashboard inteiro de
   abrir). Pior caso: a lista de disciplinas fica vazia (só
   "Nenhuma" aparece no select) até o caminho ser corrigido abaixo.
   O 404 no console para essa chamada é esperado e inofensivo
   enquanto isso — o navegador sempre loga a falha de rede, mesmo
   quando o catch abaixo a trata com sucesso.

   TODO: ajustar o caminho do módulo e o nome da função/export para
   os reais — o mesmo dado já usado no card "Disciplinas" do
   Checklist. */
async function _carregarDisciplinasSemestreAtual() {
  try {
    const mod = await import('../../../../src/disciplina.js');
    const fn  = mod.getDisciplinasSemestreAtual ?? mod.default;
    if (typeof fn !== 'function') return [];
    const resultado = await fn();
    return Array.isArray(resultado) ? resultado : [];
  } catch (err) {
    console.warn('[tarefa] não foi possível carregar disciplinas do semestre atual (módulo ausente ou caminho incorreto). Campo "disciplina" do modal ficará só com "Nenhuma".', err);
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
  const [listas, disciplinas] = await Promise.all([
    TarefaStorage.carregarListas(usuario?.uid ?? null),
    _carregarDisciplinasSemestreAtual(),
  ]);
  _listasEmMemoria = listas;
  _disciplinas = disciplinas;

  /* Guarda simples: se a view foi trocada enquanto carregava, não
     sobrescreve o que já está na tela. */
  if (!_viewAberta || _containerAtual !== containerEl) return;

  renderTarefas(containerEl, _listasEmMemoria, _callbacks, _disciplinas);
}

export function fecharTarefas() {
  _viewAberta = false;
  _containerAtual = null;
}