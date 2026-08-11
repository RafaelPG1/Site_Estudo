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
   de CRUD, já que aqui o usuário cria/edita/exclui tudo.

   ─────────────────────────────────────────────
   CABEÇALHO — reaproveita diretamente os componentes do Checklist
   ─────────────────────────────────────────────
   `.checklist-header`, `.checklist-header-top`, `.checklist-header-left`,
   `.checklist-title`, `.checklist-subtitle`, `.checklist-stats-row` e
   `.checklist-stat-chip` (definidos em checklist.css) não são
   escopados a `.view-checklist` — são componentes soltos,
   compartilháveis entre views do Dashboard. _cabecalhoHtml() usa
   essas classes diretamente, então nenhuma regra de layout/
   espaçamento do cabeçalho é duplicada em tarefa.css; só o wrapper
   do botão (`.tarefa-header-acao`) e o próprio botão
   (`.tarefa-btn-primario`, que já existia) são específicos daqui,
   já que o Checklist não tem um botão principal (suas disciplinas
   são fixas, não criadas pelo usuário) — o botão ocupa exatamente
   o slot onde o Checklist mostra o anel de progresso. */

import { abrirModalTexto, abrirModalConfirmar, abrirModalNovaLista, CHAVE_RASCUNHO_NOVA_LISTA } from './tarefa_modal.js';

/* ─────────────────────────────────────────────
   UI STATE MANAGER (sistema global de preservação de estado)
   ─────────────────────────────────────────────
   `_colapsadasListas`/`_colapsadasCategorias` eram Sets que só
   viviam na memória do módulo: sobreviviam a um re-render dentro
   da mesma sessão (tarefa.js chama renderTarefas de novo, mas o
   arquivo continua carregado), mas eram perdidos a cada F5 — nunca
   existiu nenhuma persistência para eles. Agora os dois conjuntos
   são semeados uma vez a partir do UIState (mesma peça usada por
   Checklist/Agenda/Dashboard/Conquistas) e toda mudança é
   persistida de volta, então um F5 no meio de Tarefas volta
   exatamente com as mesmas listas/categorias abertas ou fechadas. */
import { UIState } from '../utils/ui_state_manager.js';

/* ─────────────────────────────────────────────
   FIX MOBILE — "scroll travado" até abrir uma lista
   ─────────────────────────────────────────────
   Mesma causa raiz do Checklist (ver comentário equivalente em
   checklist_renderer.js): `renderTarefas()` é chamado depois de um
   `await` (tarefa_storage.js / Firestore — ver tarefa.js →
   abrirTarefas/_rerender), então o `containerEl.innerHTML` que faz
   a página crescer roda FORA da pilha de execução do toque que
   abriu a view ou disparou a mutação. No WebKit/iOS Safari isso
   pode deixar o motor de rolagem por toque com um `scrollHeight`
   desatualizado até a próxima mudança de layout ligada a um gesto
   SÍNCRONO — no caso das Tarefas, abrir uma lista (.tarefa-lista-
   -toggle, ver _ligarEventos abaixo), que faz `classList.toggle`
   direto dentro do handler `click`.
   CORREÇÃO: mesmo nudge de scroll de 1px (vai e volta), só no
   mobile, sem gesto do usuário, sem scroll interno novo, sem tocar
   em accordions — só resincroniza o scroll normal da janela. */
const _mqScrollFixMobile = window.matchMedia('(max-width: 900px)');
function _destravarScrollMobile() {
  if (!_mqScrollFixMobile.matches) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollBy(0, 1);
      window.scrollBy(0, -1);
    });
  });
}

const _CHAVE_ESTADO_UI = 'tarefas';
let _estadoUICarregado = false;

function _carregarEstadoUISeNecessario() {
  if (_estadoUICarregado) return;
  _estadoUICarregado = true;
  const salvo = UIState.getState(_CHAVE_ESTADO_UI, { colapsadasListas: [], colapsadasCategorias: [] });
  _colapsadasListas = new Set(Array.isArray(salvo.colapsadasListas) ? salvo.colapsadasListas : []);
  _colapsadasCategorias = new Set(Array.isArray(salvo.colapsadasCategorias) ? salvo.colapsadasCategorias : []);
}

function _persistirEstadoUI() {
  UIState.setState(_CHAVE_ESTADO_UI, {
    colapsadasListas: Array.from(_colapsadasListas),
    colapsadasCategorias: Array.from(_colapsadasCategorias),
  });
}

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

/* Ícones dos 4 chips de estatística do cabeçalho — mesmos desenhos
   usados pelo Checklist (_ICON_TOTAL/_ICON_CHECK/_ICON_CLOCK/
   _ICON_CIRCLE em checklist_renderer.js), copiados aqui para
   manter cada módulo dono do próprio conjunto de ícones (mesmo
   padrão já seguido por _ICON_EDIT/_ICON_TRASH/_ICON_PLUS acima),
   mas com o traçado idêntico para garantir a mesma linguagem
   visual exigida entre os dois módulos. */
const _ICON_STAT_LISTAS = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/>
    <rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/>
  </svg>`;
const _ICON_STAT_CONCLUIDAS = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="8" cy="8" r="6.5"/><path d="M5 8.2l2.1 2.1L11.2 6"/>
  </svg>`;
const _ICON_STAT_ANDAMENTO = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="8" cy="8" r="6.5"/><path d="M8 4.5V8l2.5 2.5"/>
  </svg>`;
const _ICON_STAT_PENDENTES = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="8" cy="8" r="6.5" stroke-dasharray="2.5 2.5"/>
  </svg>`;

let _colapsadasListas = new Set();
let _colapsadasCategorias = new Set();
let _callbacks = {};
let _disciplinasAtuais = [];
let _rerenderAtual = null; // referência ao último render — ver MASONRY mais abaixo

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

/* Mesma classificação de _statusDisciplina() em checklist_renderer.js
   (mesmas 4 chaves/labels, mesmo critério), para que o badge de
   status no header da lista tenha exatamente a mesma linguagem
   visual. Usa classe própria (.tarefa-lista-status, ver tarefa.css)
   com os mesmos valores visuais de .checklist-disc-status — mesmo
   padrão já seguido pelo resto deste arquivo (identidade .tarefa-*
   própria; só o cabeçalho, documentado no topo, reaproveita classes
   do Checklist diretamente). */
function _statusLista(total, pct) {
  if (total === 0) return { chave: 'sem-itens',    label: 'Sem itens' };
  if (pct >= 100)  return { chave: 'concluida',    label: 'Concluída' };
  if (pct > 0)     return { chave: 'andamento',    label: 'Em andamento' };
  return              { chave: 'nao-iniciada', label: 'Não iniciada' };
}

function _nomeDisciplina(disciplinaId) {
  if (!disciplinaId) return null;
  return _disciplinasAtuais.find(d => d.id === disciplinaId)?.nome ?? null;
}

function _emojiDisciplina(disciplinaId) {
  if (!disciplinaId) return null;
  return _disciplinasAtuais.find(d => d.id === disciplinaId)?.emoji ?? null;
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
          <span class="tarefa-categoria-contagem">${r.concluidas}/${r.total}</span>
        </button>
        <span class="tarefa-categoria-acoes">
          <button type="button" class="tarefa-icon-btn tarefa-acao-add-tarefa" title="Nova tarefa">${_ICON_PLUS}</button>
          <button type="button" class="tarefa-icon-btn tarefa-acao-editar-categoria" title="Renomear">${_ICON_EDIT}</button>
          <button type="button" class="tarefa-icon-btn tarefa-acao-excluir-categoria" title="Excluir">${_ICON_TRASH}</button>
        </span>
      </div>
      <div class="tarefa-categoria-body">
        <div class="tarefa-categoria-body-inner">
          <div class="tarefa-itens-grid">${itensHtml}</div>
        </div>
      </div>
    </div>`;
}

function _renderListaHtml(lista) {
  const r = _contarLista(lista);
  const status = _statusLista(r.total, r.pct);
  const colapsada = _colapsadasListas.has(lista.id);
  const categorias = lista.categorias ?? [];
  const categoriasHtml = categorias.length
    ? categorias.map(c => _renderCategoriaHtml(lista, c)).join('')
    : '<span class="tarefa-vazio">Nenhuma categoria ainda. Use "+ Categoria" para começar.</span>';
  const nomeDisc  = _nomeDisciplina(lista.disciplinaId);
  const emojiDisc = _emojiDisciplina(lista.disciplinaId);

  return `
    <section class="tarefa-lista-block${colapsada ? ' is-collapsed' : ''}" data-lista-id="${_escapeHtml(lista.id)}">
      <div class="tarefa-lista-header">
        <button type="button" class="tarefa-lista-toggle" aria-expanded="${!colapsada}">
          <span class="tarefa-lista-emoji">${emojiDisc ? _escapeHtml(emojiDisc) : '📋'}</span>
          <div class="tarefa-lista-info">
            <div class="tarefa-lista-title-row">
              <h3 class="tarefa-lista-nome">${_escapeHtml(lista.nome)}</h3>
              ${nomeDisc ? `<span class="tarefa-lista-disciplina-badge">${_escapeHtml(nomeDisc)}</span>` : ''}
              <span class="tarefa-lista-status status-${status.chave}">${status.label}</span>
            </div>
            <div class="tarefa-lista-meta">
              <div class="tarefa-lista-bar-bg"><div class="tarefa-lista-bar-fill" style="width:${r.pct}%"></div></div>
              <span class="tarefa-lista-contagem">${r.concluidas}/${r.total}</span>
              <span class="tarefa-lista-pct">${r.pct}%</span>
            </div>
          </div>
          ${_CHEVRON_SVG}
        </button>
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

/* ─────────────────────────────────────────────
   MASONRY — 2 colunas independentes (mesma técnica e mesmo
   breakpoint de checklist_renderer.js — ver comentário lá).
   Evita que recolher uma lista deixe "buraco" na coluna: cada
   coluna é um sub-container de fluxo normal totalmente
   independente (.tarefa-listas-col no CSS). */
const _mqDuasColunas = window.matchMedia('(min-width: 901px)');
_mqDuasColunas.addEventListener('change', () => {
  _rerenderAtual?.();
});

function _numColunasAtual() {
  return _mqDuasColunas.matches ? 2 : 1;
}

function _renderColunasHtml(listasOrdenadas) {
  const numColunas = _numColunasAtual();
  const colunas = Array.from({ length: numColunas }, () => []);
  listasOrdenadas.forEach((l, i) => colunas[i % numColunas].push(l));

  return colunas
    .map(col => `<div class="tarefa-listas-col">${col.map(_renderListaHtml).join('')}</div>`)
    .join('');
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

/* Um chip de estatística — mesma estrutura/classes do Checklist
   (.checklist-stat-chip > .checklist-stat-icon + .checklist-stat-body),
   incluindo as classes globais de cor de ícone já usadas em outros
   cards do Dashboard (ic-blue/ic-green/ic-amber/ic-purple). */
function _statChipHtml(iconSvg, corIcone, label, valor) {
  return `
    <div class="checklist-stat-chip">
      <span class="checklist-stat-icon ${corIcone}">${iconSvg}</span>
      <div class="checklist-stat-body">
        <span class="checklist-stat-label">${label}</span>
        <span class="checklist-stat-value">${valor}</span>
      </div>
    </div>`;
}

function _cabecalhoHtml(listas = []) {
  const r = _resumoGeral(listas);
  return `
    <div class="checklist-header">
      <div class="checklist-header-top">
        <div class="checklist-header-left">
          <h2 class="checklist-title">Tarefas</h2>
          <p class="checklist-subtitle">Crie suas próprias listas e organize seus estudos do seu jeito.</p>
        </div>
        <div class="tarefa-header-acao">
          <button type="button" class="tarefa-btn-primario" id="tarefa-btn-nova-lista">${_ICON_PLUS} Nova lista</button>
        </div>
      </div>
      <div class="checklist-stats-row">
        ${_statChipHtml(_ICON_STAT_LISTAS, 'ic-blue', 'Listas', r.total)}
        ${_statChipHtml(_ICON_STAT_CONCLUIDAS, 'ic-green', 'Concluídas', r.concluidas)}
        ${_statChipHtml(_ICON_STAT_ANDAMENTO, 'ic-amber', 'Em andamento', r.emAndamento)}
        ${_statChipHtml(_ICON_STAT_PENDENTES, 'ic-purple', 'Pendentes', r.pendentes)}
      </div>
    </div>`;
}

export function renderTarefasVazio(containerEl, disciplinas = []) {
  _carregarEstadoUISeNecessario();
  _disciplinasAtuais = disciplinas;
  _rerenderAtual = null; // nada para redesenhar no cruzamento de breakpoint enquanto vazio
  containerEl.innerHTML = `
    ${_cabecalhoHtml([])}
    <div class="tarefa-empty">
      <div class="tarefa-empty-icon" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 5h12M3 9h8M3 13h10"/>
        </svg>
      </div>
      <p class="tarefa-empty-msg">Você ainda não criou nenhuma lista. Comece criando sua primeira lista de tarefas.</p>
    </div>`;
  _ligarEventoNovaLista(containerEl);
}

export function renderTarefas(containerEl, listas, callbacks, disciplinas = []) {
  _carregarEstadoUISeNecessario();
  _callbacks = callbacks ?? {};
  _disciplinasAtuais = disciplinas;

  if (!listas || listas.length === 0) {
    renderTarefasVazio(containerEl, disciplinas);
    return;
  }

  const listasOrdenadas = [...listas].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  _renderCompleto(containerEl, listasOrdenadas);
}

/* Redesenha cabeçalho + lista de listas por inteiro. Reatribui os
   listeners delegados a cada chamada (innerHTML inteiro é
   substituído). Chamado tanto por renderTarefas() quanto pelo
   listener de matchMedia (_rerenderAtual, ver MASONRY acima) quando
   a tela cruza o breakpoint de 2↔1 colunas — mesmo padrão de
   _renderCompleto em checklist_renderer.js. */
function _renderCompleto(containerEl, listasOrdenadas) {
  const listasHtml = _renderColunasHtml(listasOrdenadas);

  containerEl.innerHTML = `
    ${_cabecalhoHtml(listasOrdenadas)}
    <div class="tarefa-listas-wrap" id="tarefa-listas-wrap">${listasHtml}</div>`;

  _ligarEventoNovaLista(containerEl);
  _ligarEventos(containerEl, listasOrdenadas);
  _destravarScrollMobile();
}

function _ligarEventoNovaLista(containerEl) {
  containerEl.querySelector('#tarefa-btn-nova-lista')?.addEventListener('click', () => _abrirNovaListaEProcessar());
}

async function _abrirNovaListaEProcessar() {
  const spec = await abrirModalNovaLista({ disciplinas: _disciplinasAtuais });
  if (spec) _callbacks.onCriarLista?.(spec);
}

/* Chamada por tarefa.js uma única vez, logo após a primeira
   renderização da view (boot/F5) — reabre sozinho o modal "Nova
   lista" se houver um rascunho pendente de uma sessão anterior (ver
   comentário no topo de tarefa_modal.js). Reusa exatamente o mesmo
   caminho do clique manual no botão — abrirModalNovaLista() já se
   encarrega de preencher os campos com o rascunho salvo. */
export async function reabrirRascunhoNovaListaSeExistir() {
  if (!UIState.hasState(CHAVE_RASCUNHO_NOVA_LISTA)) return;
  await _abrirNovaListaEProcessar();
}

function _buscarLista(listas, listaId) { return listas.find(l => l.id === listaId); }
function _buscarCategoria(lista, catId) { return (lista?.categorias ?? []).find(c => c.id === catId); }

function _ligarEventos(containerEl, listas) {
  const wrap = containerEl.querySelector('#tarefa-listas-wrap');
  if (!wrap) return;

  /* Mantém sempre a referência do rerender mais recente, para que o
     listener de matchMedia (registrado uma única vez, fora desta
     função — ver MASONRY acima) saiba redesenhar a lista quando a
     tela cruzar o breakpoint de 2↔1 colunas. Guarda simples: se o
     container não está mais no documento (view fechada/trocada),
     não há nada para redesenhar — mesmo padrão de checklist_renderer.js. */
  _rerenderAtual = () => {
    if (!containerEl.isConnected) return;
    _renderCompleto(containerEl, listas);
  };

  wrap.addEventListener('click', async (e) => {
    const blocoLista = e.target.closest('.tarefa-lista-block');
    const listaId = blocoLista?.dataset.listaId;
    const lista = listaId ? _buscarLista(listas, listaId) : null;

    if (e.target.closest('.tarefa-lista-toggle')) {
      const colapsar = !_colapsadasListas.has(listaId);
      colapsar ? _colapsadasListas.add(listaId) : _colapsadasListas.delete(listaId);
      blocoLista.classList.toggle('is-collapsed', colapsar);
      _persistirEstadoUI();
      return;
    }

    const catToggle = e.target.closest('.tarefa-categoria-toggle');
    if (catToggle) {
      const blocoCat = catToggle.closest('.tarefa-categoria');
      const chave = `${listaId}::${blocoCat?.dataset.catId}`;
      const colapsar = !_colapsadasCategorias.has(chave);
      colapsar ? _colapsadasCategorias.add(chave) : _colapsadasCategorias.delete(chave);
      blocoCat.classList.toggle('is-collapsed', colapsar);
      _persistirEstadoUI();
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