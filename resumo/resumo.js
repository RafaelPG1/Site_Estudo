/* =============================================
   NEXUS STUDY — resumo.js  (v2)
   Tela de Resumos com Sidebar de Disciplinas
   ============================================= */

import {
  getSemestreAtual,
  getDisciplinaAtual,
  setDisciplina,
  getDisciplinasDeSemestre,
  setPagina,
} from '../global.js';

/* ══════════════════════════════════════════════
   ESTADO LOCAL
══════════════════════════════════════════════ */
const State = {
  disciplina:     null,   // objeto completo { id, nome, emoji, arquivo }
  semestre:       null,
  disciplinas:    [],     // lista de todas as disciplinas do semestre
  todosOsItens:   [],
  itensFiltrados: [],
  tipoAtivo:      'todos',
  termoBusca:     '',
};

/* ══════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  setPagina('RESUMO');
  document.getElementById('footer-year').textContent = new Date().getFullYear();

  _resolverContexto();
  _renderSidebar();
  _renderHeader();
  _bindToolbar();
  _bindModal();
  _bindMobileDropdown();
  _carregarConteudo();
});

/* ══════════════════════════════════════════════
   RESOLVER CONTEXTO (semestre + disciplina)
══════════════════════════════════════════════ */
function _resolverContexto() {
  const semestre = getSemestreAtual();
  const lista    = getDisciplinasDeSemestre(semestre);

  State.semestre   = semestre;
  State.disciplinas = lista;

  // Prioridade: URL ?disc=xxx → global.js → primeiro da lista
  const params   = new URLSearchParams(window.location.search);
  const discId   = params.get('disc') ?? getDisciplinaAtual();
  const disc     = (discId ? lista.find(d => d.id === discId) : null) ?? lista[0] ?? null;

  State.disciplina = disc;
  if (disc) setDisciplina(disc.id);
}

/* ══════════════════════════════════════════════
   SIDEBAR — render
══════════════════════════════════════════════ */
function _renderSidebar() {
  // Semestre label
  const semLabel = document.getElementById('sidebar-semestre');
  if (semLabel) semLabel.textContent = State.semestre ?? '—';

  const list = document.getElementById('disc-list');
  if (!list) return;

  list.innerHTML = '';

  State.disciplinas.forEach(disc => {
    const isAtivo = disc.id === State.disciplina?.id;

    const item = document.createElement('button');
    item.className = `disc-item${isAtivo ? ' disc-item--active' : ''}`;
    item.dataset.discId = disc.id;
    item.setAttribute('aria-current', isAtivo ? 'page' : 'false');
    item.title = disc.nome;

    item.innerHTML = `
      <span class="disc-item__emoji">${disc.emoji}</span>
      <span class="disc-item__info">
        <span class="disc-item__nome">${disc.nome}</span>
        <span class="disc-item__status disc-item__status--empty" id="disc-status-${disc.id}">
          Sem conteúdo
        </span>
      </span>
      <svg class="disc-item__chevron" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    `;

    item.addEventListener('click', () => _trocarDisciplina(disc));
    list.appendChild(item);
  });
}

/* ══════════════════════════════════════════════
   SIDEBAR — atualizar item ativo
══════════════════════════════════════════════ */
function _atualizarSidebarAtivo(discId) {
  document.querySelectorAll('.disc-item').forEach(el => {
    const ativo = el.dataset.discId === discId;
    el.classList.toggle('disc-item--active', ativo);
    el.setAttribute('aria-current', ativo ? 'page' : 'false');
  });
}

/* ══════════════════════════════════════════════
   SIDEBAR — marcar disciplina com conteúdo
══════════════════════════════════════════════ */
function _marcarStatusConteudo(discId, temConteudo) {
  const el = document.getElementById(`disc-status-${discId}`);
  if (!el) return;
  el.textContent = temConteudo ? 'Disponível' : 'Sem conteúdo';
  el.className   = `disc-item__status disc-item__status--${temConteudo ? 'ok' : 'empty'}`;
}

/* ══════════════════════════════════════════════
   TROCAR DISCIPLINA
══════════════════════════════════════════════ */
function _trocarDisciplina(disc) {
  if (disc.id === State.disciplina?.id) return;

  State.disciplina = disc;
  setDisciplina(disc.id);

  // Atualiza URL sem reload
  const url = new URL(window.location.href);
  url.searchParams.set('disc', disc.id);
  window.history.pushState({}, '', url);

  // Reset filtros
  State.tipoAtivo  = 'todos';
  State.termoBusca = '';
  const searchInput = document.getElementById('search-input');
  if (searchInput) { searchInput.value = ''; }
  document.getElementById('search-clear').style.display = 'none';

  // Reseta botões de filtro
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
  document.querySelector('[data-filter="todos"]')?.classList.add('filter-btn--active');
  document.querySelectorAll('.filter-btn:not([data-filter="todos"])').forEach(b => b.remove());

  _atualizarSidebarAtivo(disc.id);
  _renderHeader();
  _fecharMobileDropdown();
  _carregarConteudo();
}

/* ══════════════════════════════════════════════
   RENDER HEADER
══════════════════════════════════════════════ */
function _renderHeader() {
  const disc = State.disciplina;

  const breadcrumb = document.getElementById('header-breadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = disc
      ? `Resumos <span>· ${disc.nome}</span>`
      : 'Resumos';
  }

  const badge = document.getElementById('disc-badge');
  if (badge && disc) {
    badge.innerHTML = `<span>${disc.emoji}</span> ${_nomeCurto(disc.nome)}`;
  }

  const eyebrow = document.getElementById('hero-eyebrow-text');
  if (eyebrow) eyebrow.textContent = disc?.nome ?? 'Resumos';

  const mobileLabel = document.getElementById('mobile-disc-label');
  if (mobileLabel) mobileLabel.textContent = disc ? `${disc.emoji} ${_nomeCurto(disc.nome, 20)}` : 'Disciplina';

  document.title = disc ? `Resumos — ${disc.nome} · Nexus Study` : 'Resumos · Nexus Study';
}

function _nomeCurto(nome, max = 28) {
  return nome.length > max ? nome.slice(0, max - 2) + '…' : nome;
}

/* ══════════════════════════════════════════════
   CARREGAR CONTEÚDO
══════════════════════════════════════════════ */
function _carregarConteudo() {
  _mostrarEstado('loading');

  setTimeout(() => {
    const dados = _lerDados();
    const disc  = State.disciplina;
    const temConteudo = dados.length > 0;

    _marcarStatusConteudo(disc?.id, temConteudo);

    if (!temConteudo) {
      // Sem conteúdo — estado especial
      _renderHeroStats(0, 0);
      _mostrarEstadoSemConteudo();
      return;
    }

    State.todosOsItens   = dados;
    State.itensFiltrados = dados;

    _renderFiltrosTipo(dados);
    _renderHeroStats(dados.length, _contarTipos(dados));
    _renderGrid(dados);
    _mostrarEstado('grid');
  }, 280);
}

function _lerDados() {
  const raw = window.__nexusConteudo ?? window.questoes ?? null;
  if (!raw) return [];
  return Array.isArray(raw.questoes) ? raw.questoes : [];
}

/* ══════════════════════════════════════════════
   ESTADOS DA UI
══════════════════════════════════════════════ */
function _mostrarEstado(estado) {
  document.getElementById('state-loading').style.display    = estado === 'loading'    ? 'flex' : 'none';
  document.getElementById('state-no-content').style.display = estado === 'no-content' ? 'flex' : 'none';
  document.getElementById('state-empty').style.display      = estado === 'empty'      ? 'flex' : 'none';
  document.getElementById('resumos-grid').style.display     = estado === 'grid'       ? 'grid' : 'none';
}

function _mostrarEstadoSemConteudo() {
  const disc = State.disciplina;
  document.getElementById('state-disc-emoji').textContent = disc?.emoji ?? '📚';
  document.getElementById('state-disc-name').textContent  = disc?.nome  ?? '—';
  _mostrarEstado('no-content');
}

/* ══════════════════════════════════════════════
   HERO STATS
══════════════════════════════════════════════ */
function _renderHeroStats(total, tipos) {
  const container = document.getElementById('hero-stats');
  if (!container) return;

  const disc = State.disciplina;

  if (total === 0) {
    container.innerHTML = `
      <div class="stat-pill">${disc?.emoji ?? ''} ${disc?.nome ?? '—'}</div>
      <div class="stat-pill"><strong>0</strong> resumos</div>
    `;
    document.getElementById('hero-sub').textContent =
      `Nenhum resumo disponível para ${disc?.nome ?? 'esta disciplina'} ainda.`;
    return;
  }

  container.innerHTML = `
    <div class="stat-pill"><strong>${total}</strong> resumo${total !== 1 ? 's' : ''}</div>
    <div class="stat-pill"><strong>${tipos}</strong> tipo${tipos !== 1 ? 's' : ''}</div>
    ${disc ? `<div class="stat-pill">${disc.emoji} ${disc.nome}</div>` : ''}
  `;

  document.getElementById('hero-sub').textContent =
    `${total} resumo${total !== 1 ? 's' : ''} disponíve${total !== 1 ? 'is' : 'l'} para ${disc?.nome ?? 'esta disciplina'}.`;
}

function _contarTipos(itens) {
  return new Set(itens.map(i => (i.tipo ?? 'default').toLowerCase())).size;
}

/* ══════════════════════════════════════════════
   FILTROS
══════════════════════════════════════════════ */
function _renderFiltrosTipo(itens) {
  const tipos = [...new Set(itens.map(i => i.tipo ?? 'Outros'))].sort();
  const group = document.getElementById('filter-group');
  if (!group) return;
  group.querySelectorAll('[data-filter]:not([data-filter="todos"])').forEach(b => b.remove());
  tipos.forEach(tipo => {
    const btn = document.createElement('button');
    btn.className     = 'filter-btn';
    btn.dataset.filter = tipo.toLowerCase();
    btn.textContent   = tipo;
    group.appendChild(btn);
  });
}

function _bindToolbar() {
  document.getElementById('filter-group')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
    State.tipoAtivo = btn.dataset.filter;
    _aplicarFiltros();
  });

  const si = document.getElementById('search-input');
  const sc = document.getElementById('search-clear');
  si?.addEventListener('input', e => {
    State.termoBusca = e.target.value.trim().toLowerCase();
    sc.style.display = State.termoBusca ? 'block' : 'none';
    _aplicarFiltros();
  });
  sc?.addEventListener('click', () => {
    si.value = '';
    State.termoBusca = '';
    sc.style.display = 'none';
    _aplicarFiltros();
  });
}

function _aplicarFiltros() {
  let itens = [...State.todosOsItens];
  if (State.tipoAtivo !== 'todos') {
    itens = itens.filter(i => (i.tipo ?? 'outros').toLowerCase() === State.tipoAtivo);
  }
  if (State.termoBusca) {
    const t = State.termoBusca;
    itens = itens.filter(i =>
      (i.aula ?? '').toLowerCase().includes(t) ||
      (i.question ?? '').toLowerCase().includes(t) ||
      (i.texto ?? '').toLowerCase().includes(t)
    );
  }
  State.itensFiltrados = itens;
  if (itens.length === 0) _mostrarEstado('empty');
  else { _renderGrid(itens); _mostrarEstado('grid'); }
}

/* ══════════════════════════════════════════════
   RENDER GRID
══════════════════════════════════════════════ */
function _renderGrid(itens) {
  const grid = document.getElementById('resumos-grid');
  if (!grid) return;
  grid.innerHTML = '';
  itens.forEach((item, idx) => grid.appendChild(_criarCard(item, idx)));
}

function _criarCard(item, idx) {
  const tipo      = (item.tipo ?? 'default').toLowerCase();
  const tipoClass = _tipoParaClass(tipo);
  const optCount  = Array.isArray(item.options) ? item.options.length : 0;

  const card = document.createElement('article');
  card.className = `resumo-card card--${tipoClass}`;
  card.style.animationDelay = `${idx * 0.055}s`;
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Abrir resumo: ${item.aula}`);

  card.innerHTML = `
    <div class="card-head">
      <span class="card-aula">${_esc(item.aula ?? '')}</span>
      <span class="card-tipo-badge badge--${tipoClass}">${_esc(item.tipo ?? 'Outros')}</span>
    </div>
    <div class="card-body">
      <p class="card-question">${_esc(item.question ?? '')}</p>
      <p class="card-preview">${_stripMarkup(item.texto ?? '')}</p>
    </div>
    <div class="card-foot">
      <span class="card-options-count">${optCount > 0 ? `${optCount} alternativa${optCount !== 1 ? 's' : ''}` : 'Sem alternativas'}</span>
      <span class="card-cta">
        Ver mais
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
        </svg>
      </span>
    </div>
  `;

  card.addEventListener('click', () => _abrirModal(item));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _abrirModal(item); }
  });
  return card;
}

/* ══════════════════════════════════════════════
   MODAL LATERAL
══════════════════════════════════════════════ */
function _bindModal() {
  document.getElementById('read-modal-overlay')?.addEventListener('click', _fecharModal);
  document.getElementById('read-modal-close')?.addEventListener('click', _fecharModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') _fecharModal(); });
}

function _abrirModal(item) {
  const tipo = (item.tipo ?? 'default').toLowerCase();
  const cls  = _tipoParaClass(tipo);

  document.getElementById('rm-aula-label').textContent = item.aula ?? '';
  const badge = document.getElementById('rm-tipo-badge');
  badge.textContent = item.tipo ?? 'Outros';
  badge.className   = `read-modal__badge badge--${cls}`;

  document.getElementById('rm-body').innerHTML = _buildModalBody(item);

  document.getElementById('read-modal').classList.add('read-modal--open');
  document.body.style.overflow = 'hidden';
  document.getElementById('read-modal-panel')?.focus();
}

function _fecharModal() {
  document.getElementById('read-modal')?.classList.remove('read-modal--open');
  document.body.style.overflow = '';
}

function _buildModalBody(item) {
  const letras = ['A', 'B', 'C', 'D', 'E'];
  const ansIdx = typeof item.answer === 'number' ? item.answer : -1;
  let html = '';

  if (item.question) {
    html += `<h2 class="rm-question-title">${_esc(item.question)}</h2>`;
  }
  if (item.texto) {
    html += `
      <div class="rm-section">
        <div class="rm-section-label">Explicação</div>
        <div class="rm-text">${_renderMarkup(item.texto)}</div>
      </div>`;
  }
  if (Array.isArray(item.options) && item.options.length > 0) {
    html += `
      <div class="rm-section">
        <div class="rm-section-label">Alternativas</div>
        <div class="rm-options">
          ${item.options.map((opt, i) => `
            <div class="rm-option ${i === ansIdx ? 'rm-option--correct' : ''}">
              <span class="rm-option-letter">${letras[i] ?? i + 1}</span>
              <span class="rm-option-text">${_renderMarkup(opt)}</span>
            </div>
          `).join('')}
        </div>
      </div>`;
  }
  if (item.feedback) {
    html += `
      <div class="rm-section">
        <div class="rm-section-label">Feedback</div>
        <div class="rm-feedback">${_renderMarkup(item.feedback)}</div>
      </div>`;
  }
  return html;
}

/* ══════════════════════════════════════════════
   MOBILE DROPDOWN DE DISCIPLINAS
══════════════════════════════════════════════ */
function _bindMobileDropdown() {
  document.getElementById('mobile-disc-btn')?.addEventListener('click', _abrirMobileDropdown);
  document.getElementById('mobile-dropdown-backdrop')?.addEventListener('click', _fecharMobileDropdown);
}

function _abrirMobileDropdown() {
  const dd   = document.getElementById('mobile-dropdown');
  const list = document.getElementById('mobile-dropdown-list');
  if (!dd || !list) return;

  list.innerHTML = '';
  State.disciplinas.forEach(disc => {
    const isAtivo = disc.id === State.disciplina?.id;
    const btn = document.createElement('button');
    btn.className = `disc-item${isAtivo ? ' disc-item--active' : ''}`;
    btn.innerHTML = `
      <span class="disc-item__emoji">${disc.emoji}</span>
      <span class="disc-item__info">
        <span class="disc-item__nome">${disc.nome}</span>
      </span>
      ${isAtivo ? `<svg class="disc-item__chevron" style="opacity:1;transform:translateX(0)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>` : ''}
    `;
    btn.addEventListener('click', () => _trocarDisciplina(disc));
    list.appendChild(btn);
  });

  dd.classList.add('mobile-dropdown--open');
  document.body.style.overflow = 'hidden';
}

function _fecharMobileDropdown() {
  document.getElementById('mobile-dropdown')?.classList.remove('mobile-dropdown--open');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════
   UTILITÁRIOS
══════════════════════════════════════════════ */
function _tipoParaClass(tipo) {
  return { explicativa: 'explicativa', revisão: 'revisao', revisao: 'revisao',
           prática: 'pratica', pratica: 'pratica', conceito: 'conceito' }[tipo] ?? 'default';
}

function _esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function _stripMarkup(texto) {
  return _esc(texto
    .replace(/==\w+==([^=]+)==/g, '$1')
    .replace(/==([^=]+)==/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
  );
}

function _renderMarkup(texto) {
  if (!texto) return '';
  let html = _esc(texto);
  html = html.replace(/==(\w+)==([^=]+)==/g, (_, tipo, c) =>
    `<mark class="hl ${_tipoHL(tipo.toLowerCase())}">${c}</mark>`);
  html = html.replace(/==([^=]+)==/g, (_, c) =>
    `<mark class="hl hl--default">${c}</mark>`);
  html = html.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  html = html.replace(/\n/g, '<br>');
  return html;
}

function _tipoHL(tipo) {
  return { ddl: 'hl--ddl', danger: 'hl--danger', warn: 'hl--warn' }[tipo] ?? 'hl--default';
}