/* dashboard\js\tarefa\tarefa_renderer.js
   proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   Responsabilidade ÚNICA: renderização visual do módulo Tarefas.
   Não conhece Firestore — recebe as listas já carregadas, a lista
   de disciplinas do semestre atual (para o modal e o badge) e um
   conjunto de callbacks (onCriarLista, onExcluirTarefa, etc.) que
   delegam a persistência para tarefa.js/tarefa_storage.js.
   Mesmos princípios visuais do Checklist (accordion de 2 níveis,
   grid-template-rows minmax(0,...) para colapso real, cards de
   resumo no topo), mas com identidade própria (.tarefa-*) e ações
   de CRUD, já que aqui o usuário cria/edita/exclui tudo. */

import { abrirModalTexto, abrirModalConfirmar, abrirModalNovaLista } from './tarefa_modal.js';

function _escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

const _CHEVRON_SVG = `
  <svg class="tarefa-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"
       stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3.5 5.25L7 8.75l3.5-3.5"/>
  </svg>`;
const _CHECK_SVG = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.5 6.2l2.3 2.3L9.5 3.5"/></svg>`;
const _ICON_EDIT  = `<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.5 1.5l3 3-7 7-3.5 1 1-3.5z"/></svg>`;
const _ICON_TRASH = `<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.5 4h9M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.6 8a1 1 0 001 .9h4.8a1 1 0 001-.9L11 4"/></svg>`;
const _ICON_PLUS  = `<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 2.5v9M2.5 7h9"/></svg>`;

let _colapsadasListas = new Set();
let _colapsadasCategorias = new Set();
let _callbacks = {};
let _disciplinasAtuais = [];

function _contarTarefas(tarefas) {
  const total = tarefas?.length ?? 0;
  const concluidas = (tarefas ?? []).filter(t => t.concluido).length;
  return { total, concluidas, pct: total > 0 ? Math.round((concluidas / total) * 100) : 0 };
}

function _contarLista(lista) {
  let total = 0, concluidas = 0;
  (lista.categorias ?? []).forEach(c => {
    const r = _contarTarefas(c.tarefas);
    total += r.total; concluidas += r.concluidas;
  });
  return { total, concluidas, pct: total > 0 ? Math.round((concluidas / total) * 100) : 0 };
}

function _nomeDisciplina(disciplinaId) {
  if (!disciplinaId) return null;
  return _disciplinasAtuais.find(d => d.id === disciplinaId)?.nome ?? null;
}

function _renderItemHtml(tarefa) {
  return `
    <div class="tarefa-item${tarefa.concluido ? ' is-concluido' : ''}" data-tar-id="${_escapeHtml(tarefa.id)}">
      <label style="display:flex;align-items:center;gap:12px;flex:1;min-width:0;cursor:pointer;">
        <input type="checkbox" class="tarefa-item-checkbox" ${tarefa.concluido ? 'checked' : ''} />
        <span class="tarefa-item-check" aria-hidden="true">${_CHECK_SVG}</span>
        <span class="tarefa-item-titulo">${_escapeHtml(tarefa.titulo)}</span>
      </label>
      <span class="tarefa-item-acoes">
        <button type="button" class="tarefa-icon-btn tarefa-acao-editar-tarefa" title="Editar" aria-label="Editar tarefa">${_ICON_EDIT}</button>
        <button type="button" class="tarefa-icon-btn tarefa-acao-excluir-tarefa" title="Excluir" aria-label="Excluir tarefa">${_ICON_TRASH}</button>
      </span>
    </div>`;
}

function _renderCategoriaHtml(lista, categoria) {
  const r = _contarTarefas(categoria.tarefas);
  const chave = `${lista.id}::${categoria.id}`;
  const colapsada = _colapsadasCategorias.has(chave);
  const itensHtml = (categoria.tarefas ?? []).length
    ? (categoria.tarefas ?? []).map(_renderItemHtml).join('')
    : '<span class="tarefa-vazio">Nenhuma tarefa nesta categoria.</span>';

  return `
    <div class="tarefa-categoria${colapsada ? ' is-collapsed' : ''}" data-cat-id="${_escapeHtml(categoria.id)}">
      <div class="tarefa-categoria-header">
        <button type="button" class="tarefa-categoria-toggle" aria-expanded="${!colapsada}">
          ${_CHEVRON_SVG}
          <span class="tarefa-categoria-nome">${_escapeHtml(categoria.nome)}</span>
        </button>
        <span class="tarefa-categoria-contagem">${r.concluidas}/${r.total}</span>
        <span class="tarefa-categoria-acoes">
          <button type="button" class="tarefa-icon-btn tarefa-acao-add-tarefa" title="Nova tarefa">${_ICON_PLUS}</button>
          <button type="button" class="tarefa-icon-btn tarefa-acao-editar-categoria" title="Renomear">${_ICON_EDIT}</button>
          <button type="button" class="tarefa-icon-btn tarefa-acao-excluir-categoria" title="Excluir">${_ICON_TRASH}</button>
        </span>
      </div>
      <div class="tarefa-categoria-body">
        <div class="tarefa-categoria-body-inner">
          <div class="tarefa-itens-lista">${itensHtml}</div>
        </div>
      </div>
    </div>`;
}

function _renderListaHtml(lista) {
  const r = _contarLista(lista);
  const colapsada = _colapsadasListas.has(lista.id);
  const categorias = lista.categorias ?? [];
  const categoriasHtml = categorias.length
    ? categorias.map(c => _renderCategoriaHtml(lista, c)).join('')
    : '<span class="tarefa-vazio">Nenhuma categoria ainda. Use "+ Categoria" para começar.</span>';
  const nomeDisc = _nomeDisciplina(lista.disciplinaId);

  return `
    <section class="tarefa-lista-block${colapsada ? ' is-collapsed' : ''}" data-lista-id="${_escapeHtml(lista.id)}">
      <div class="tarefa-lista-header">
        <button type="button" class="tarefa-lista-toggle" aria-expanded="${!colapsada}">
          ${_CHEVRON_SVG}
          <span class="tarefa-lista-nome">${_escapeHtml(lista.nome)}</span>
          ${nomeDisc ? `<span class="tarefa-lista-disciplina-badge">${_escapeHtml(nomeDisc)}</span>` : ''}
        </button>
        <div class="tarefa-lista-meta">
          <div class="tarefa-lista-bar-bg"><div class="tarefa-lista-bar-fill" style="width:${r.pct}%"></div></div>
          <span class="tarefa-lista-contagem">${r.concluidas}/${r.total}</span>
          <span class="tarefa-lista-pct">${r.pct}%</span>
        </div>
        <span class="tarefa-lista-acoes">
          <button type="button" class="tarefa-icon-btn tarefa-acao-add-categoria" title="Nova categoria">${_ICON_PLUS} Categoria</button>
          <button type="button" class="tarefa-icon-btn tarefa-acao-editar-lista" title="Renomear lista">${_ICON_EDIT}</button>
          <button type="button" class="tarefa-icon-btn tarefa-acao-excluir-lista" title="Excluir lista">${_ICON_TRASH}</button>
        </span>
      </div>
      <div class="tarefa-lista-body">
        <div class="tarefa-lista-body-inner">
          <div class="tarefa-categorias-lista">${categoriasHtml}</div>
        </div>
      </div>
    </section>`;
}

function _resumoGeral(listas) {
  let concluidas = 0, emAndamento = 0, pendentes = 0;
  listas.forEach(l => {
    const r = _contarLista(l);
    if (r.total === 0) { pendentes++; return; }
    if (r.concluidas === r.total) concluidas++;
    else if (r.concluidas > 0) emAndamento++;
    else pendentes++;
  });
  return { total: listas.length, concluidas, emAndamento, pendentes };
}

function _cardResumoHtml(valor, label) {
  return `
    <div class="tarefa-resumo-card">
      <span class="tarefa-resumo-valor">${valor}</span>
      <span class="tarefa-resumo-label">${label}</span>
    </div>`;
}

function _cabecalhoHtml(listas = []) {
  const r = _resumoGeral(listas);
  return `
    <div class="tarefa-header">
      <div class="tarefa-header-topo">
        <div>
          <h2 class="tarefa-title">Tarefas</h2>
          <p class="tarefa-subtitle">Crie suas próprias listas e organize seus estudos do seu jeito.</p>
        </div>
        <button type="button" class="tarefa-btn-primario" id="tarefa-btn-nova-lista">${_ICON_PLUS} Nova lista</button>
      </div>
      <div class="tarefa-resumo-grid">
        ${_cardResumoHtml(r.total, 'Listas')}
        ${_cardResumoHtml(r.concluidas, 'Concluídas')}
        ${_cardResumoHtml(r.emAndamento, 'Em andamento')}
        ${_cardResumoHtml(r.pendentes, 'Pendentes')}
      </div>
    </div>`;
}

export function renderTarefasVazio(containerEl, disciplinas = []) {
  _disciplinasAtuais = disciplinas;
  containerEl.innerHTML = `
    ${_cabecalhoHtml([])}
    <div class="tarefa-empty">
      <p class="tarefa-empty-msg">Você ainda não criou nenhuma lista. Comece criando sua primeira lista de tarefas.</p>
    </div>`;
  _ligarEventoNovaLista(containerEl);
}

export function renderTarefas(containerEl, listas, callbacks, disciplinas = []) {
  _callbacks = callbacks ?? {};
  _disciplinasAtuais = disciplinas;

  if (!listas || listas.length === 0) {
    renderTarefasVazio(containerEl, disciplinas);
    return;
  }

  const listasOrdenadas = [...listas].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  const listasHtml = listasOrdenadas.map(_renderListaHtml).join('');

  containerEl.innerHTML = `
    ${_cabecalhoHtml(listasOrdenadas)}
    <div class="tarefa-listas-wrap" id="tarefa-listas-wrap">${listasHtml}</div>`;

  _ligarEventoNovaLista(containerEl);
  _ligarEventos(containerEl, listasOrdenadas);
}

function _ligarEventoNovaLista(containerEl) {
  containerEl.querySelector('#tarefa-btn-nova-lista')?.addEventListener('click', async () => {
    const spec = await abrirModalNovaLista({ disciplinas: _disciplinasAtuais });
    if (spec) _callbacks.onCriarLista?.(spec);
  });
}

function _buscarLista(listas, listaId) { return listas.find(l => l.id === listaId); }
function _buscarCategoria(lista, catId) { return (lista?.categorias ?? []).find(c => c.id === catId); }

function _ligarEventos(containerEl, listas) {
  const wrap = containerEl.querySelector('#tarefa-listas-wrap');
  if (!wrap) return;

  wrap.addEventListener('click', async (e) => {
    const blocoLista = e.target.closest('.tarefa-lista-block');
    const listaId = blocoLista?.dataset.listaId;
    const lista = listaId ? _buscarLista(listas, listaId) : null;

    if (e.target.closest('.tarefa-lista-toggle')) {
      const colapsar = !_colapsadasListas.has(listaId);
      colapsar ? _colapsadasListas.add(listaId) : _colapsadasListas.delete(listaId);
      blocoLista.classList.toggle('is-collapsed', colapsar);
      return;
    }

    const catToggle = e.target.closest('.tarefa-categoria-toggle');
    if (catToggle) {
      const blocoCat = catToggle.closest('.tarefa-categoria');
      const chave = `${listaId}::${blocoCat?.dataset.catId}`;
      const colapsar = !_colapsadasCategorias.has(chave);
      colapsar ? _colapsadasCategorias.add(chave) : _colapsadasCategorias.delete(chave);
      blocoCat.classList.toggle('is-collapsed', colapsar);
      return;
    }

    if (e.target.closest('.tarefa-acao-add-categoria')) {
      const nome = await abrirModalTexto({ titulo: 'Nova categoria', label: 'Nome da categoria', textoConfirmar: 'Criar' });
      if (nome) _callbacks.onCriarCategoria?.(lista, nome);
      return;
    }
    if (e.target.closest('.tarefa-acao-editar-lista')) {
      const novoNome = await abrirModalTexto({ titulo: 'Renomear lista', label: 'Nome da lista', valorInicial: lista.nome });
      if (novoNome) _callbacks.onRenomearLista?.(lista, novoNome);
      return;
    }
    if (e.target.closest('.tarefa-acao-excluir-lista')) {
      const ok = await abrirModalConfirmar({ titulo: 'Excluir lista', mensagem: `Excluir "${lista.nome}" e todas as suas categorias/tarefas? Esta ação não pode ser desfeita.` });
      if (ok) _callbacks.onExcluirLista?.(lista);
      return;
    }

    const blocoCat = e.target.closest('.tarefa-categoria');
    const categoria = blocoCat ? _buscarCategoria(lista, blocoCat.dataset.catId) : null;

    if (e.target.closest('.tarefa-acao-add-tarefa')) {
      const titulo = await abrirModalTexto({ titulo: 'Nova tarefa', label: 'Descrição', textoConfirmar: 'Adicionar' });
      if (titulo) _callbacks.onCriarTarefa?.(lista, categoria, titulo);
      return;
    }
    if (e.target.closest('.tarefa-acao-editar-categoria')) {
      const novoNome = await abrirModalTexto({ titulo: 'Renomear categoria', label: 'Nome da categoria', valorInicial: categoria.nome });
      if (novoNome) _callbacks.onRenomearCategoria?.(lista, categoria, novoNome);
      return;
    }
    if (e.target.closest('.tarefa-acao-excluir-categoria')) {
      const ok = await abrirModalConfirmar({ titulo: 'Excluir categoria', mensagem: `Excluir "${categoria.nome}" e todas as suas tarefas?` });
      if (ok) _callbacks.onExcluirCategoria?.(lista, categoria);
      return;
    }

    const itemEl = e.target.closest('.tarefa-item');
    const tarefa = itemEl ? (categoria?.tarefas ?? []).find(t => t.id === itemEl.dataset.tarId) : null;

    if (e.target.closest('.tarefa-acao-editar-tarefa')) {
      const novoTitulo = await abrirModalTexto({ titulo: 'Editar tarefa', label: 'Descrição', valorInicial: tarefa.titulo });
      if (novoTitulo) _callbacks.onEditarTarefa?.(lista, categoria, tarefa, novoTitulo);
      return;
    }
    if (e.target.closest('.tarefa-acao-excluir-tarefa')) {
      const ok = await abrirModalConfirmar({ titulo: 'Excluir tarefa', mensagem: `Excluir "${tarefa.titulo}"?` });
      if (ok) _callbacks.onExcluirTarefa?.(lista, categoria, tarefa);
      return;
    }
  });

  wrap.addEventListener('change', (e) => {
    const checkbox = e.target.closest('.tarefa-item-checkbox');
    if (!checkbox) return;
    const itemEl     = checkbox.closest('.tarefa-item');
    const blocoCat   = checkbox.closest('.tarefa-categoria');
    const blocoLista = checkbox.closest('.tarefa-lista-block');
    const lista      = _buscarLista(listas, blocoLista?.dataset.listaId);
    const categoria  = _buscarCategoria(lista, blocoCat?.dataset.catId);
    const tarefa     = (categoria?.tarefas ?? []).find(t => t.id === itemEl?.dataset.tarId);
    if (!lista || !categoria || !tarefa) return;

    itemEl.classList.toggle('is-concluido', checkbox.checked);
    _callbacks.onToggleTarefa?.(lista, categoria, tarefa, checkbox.checked);
  });
}