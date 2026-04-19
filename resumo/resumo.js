/* =============================================
   NEXUS STUDY — resumo.js  (v5)
   Renderizador de notas de aula por seções
   ============================================= */
import { DISC_CORES } from '../quiz/disciplinas/disciplinas_cores.js';

import {
  getSemestreAtual,
  getDisciplinaAtual,
  setDisciplina,
  getDisciplinasDeSemestre,
  setPagina,
} from '../global.js';


/* ══════════════════════════════════════════════
   ESTADO
══════════════════════════════════════════════ */
const State = {
  disciplina:      null,
  semestre:        null,
  disciplinas:     [],
  aulas:           [],
  aulaAberta:      null,
  secaoAtiva:      'todas',
  termoBusca:      '',
  discVerificadas: new Set(), // disciplinas já verificadas de verdade (via script load/error)
};

/* ══════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  setPagina('RESUMO');
  document.getElementById('footer-year').textContent = new Date().getFullYear();

  const todoBtn = document.querySelector('[data-filter="todos"]');
  if (todoBtn) { todoBtn.textContent = 'Todas'; todoBtn.dataset.filter = 'todas'; }

  _resolverContexto();
  _renderSidebar();
  _renderHeader();
  _bindToolbar();
  _bindModal();
  _bindMobileDropdown();
  _carregarConteudo();
});

/* ══════════════════════════════════════════════
   CONTEXTO
══════════════════════════════════════════════ */
function _resolverContexto() {
  const semestre    = getSemestreAtual();
  const lista       = getDisciplinasDeSemestre(semestre);
  State.semestre    = semestre;
  State.disciplinas = lista;

  const params = new URLSearchParams(window.location.search);
  const discId = params.get('disc') ?? getDisciplinaAtual();
  const disc   = (discId ? lista.find(d => d.id === discId) : null) ?? lista[0] ?? null;
  State.disciplina = disc;
  if (disc) setDisciplina(disc.id);
  if (disc) _aplicarCorDisciplina(disc.id);
}

/* ══════════════════════════════════════════════
   CARREGAR CONTEÚDO DINÂMICO
══════════════════════════════════════════════ */
function _carregarConteudo() {
  _mostrarEstado('loading');
  _removerScriptAnterior();
  window.__nexusConteudo = null;

  const disc = State.disciplina;
  if (!disc) { _mostrarEstadoSemConteudo(); return; }

  const [ano] = (State.semestre ?? '2026.2').split('.');
  const src   = `/resumo/conteudo/${ano}/${State.semestre}/res_${disc.arquivo}.js`;

  const script = document.createElement('script');
  script.src   = src;
  script.id    = 'nexus-conteudo-script';

  script.onload = () => {
    const aulas = _lerDados();
    State.discVerificadas.add(disc.id); // marca como verificada de verdade
    _marcarStatusConteudo(disc.id, aulas.length > 0);
    if (!aulas.length) { _renderHeroStats(0); _mostrarEstadoSemConteudo(); return; }
    State.aulas = aulas;
    State.secaoAtiva = 'todas';
    _renderFiltrosSecao(aulas);
    _renderHeroStats(aulas.length);
    _renderCards(aulas);
    _mostrarEstado('grid');
  };

  script.onerror = () => {
    State.discVerificadas.add(disc.id); // marca como verificada de verdade
    _marcarStatusConteudo(disc.id, false);
    _renderHeroStats(0);
    _mostrarEstadoSemConteudo();
  };

  document.head.appendChild(script);
}

function _removerScriptAnterior() {
  document.getElementById('nexus-conteudo-script')?.remove();
}

function _lerDados() {
  const raw = window.__nexusConteudo ?? null;
  if (!raw) return [];
  if (Array.isArray(raw.aulas))    return raw.aulas;
  if (Array.isArray(raw.questoes)) return raw.questoes.map(_questaoParaAula);
  return [];
}

function _questaoParaAula(q) {
  return {
    aula: q.aula ?? 'Sem título',
    ideia_central: q.question ?? '',
    secoes: [
      { id: 'texto', titulo: '📖 Conteúdo', blocos: [{ tipo: 'lista', itens: [q.texto ?? ''] }] },
    ],
  };
}

function _aplicarCorDisciplina(discId) {
  const cores = DISC_CORES[discId];
  if (!cores) return;
  const r = document.documentElement.style;
  r.setProperty('--disc-tema',     cores.corTema);
  r.setProperty('--disc-tema-rgb', cores.corTemaRgb);
  r.setProperty('--disc-tema2',    cores.corTema2);
  r.setProperty('--disc-tema2Rgb', cores.corTema2Rgb);
}

/* ══════════════════════════════════════════════
   VERIFICAÇÃO DE STATUS — HEAD request
   Só atualiza disciplinas que ainda não foram
   verificadas de verdade (via script load/error)
══════════════════════════════════════════════ */
function _verificarStatusTodos() {
  const [ano] = (State.semestre ?? '2026.2').split('.');

  State.disciplinas.forEach(disc => {
    const src = `/resumo/conteudo/${ano}/${State.semestre}/res_${disc.arquivo}.js`;

    fetch(src, { method: 'HEAD' })
      .then(r => {
        if (!State.discVerificadas.has(disc.id)) {
          _marcarStatusConteudo(disc.id, r.ok);
        }
      })
      .catch(() => {
        if (!State.discVerificadas.has(disc.id)) {
          _marcarStatusConteudo(disc.id, false);
        }
      });
  });
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
  const eEl  = document.getElementById('state-disc-emoji');
  const nEl  = document.getElementById('state-disc-name');
  if (eEl) eEl.textContent = disc?.emoji ?? '📚';
  if (nEl) nEl.textContent  = disc?.nome  ?? '—';
  _mostrarEstado('no-content');
}

/* ══════════════════════════════════════════════
   HERO STATS
══════════════════════════════════════════════ */
function _renderHeroStats(total) {
  const c    = document.getElementById('hero-stats');
  const sub  = document.getElementById('hero-sub');
  const disc = State.disciplina;
  if (!c) return;

  c.innerHTML = total === 0
    ? `<div class="stat-pill">${disc?.emoji ?? ''} ${disc?.nome ?? '—'}</div>
       <div class="stat-pill"><strong>0</strong> aulas</div>`
    : `<div class="stat-pill"><strong>${total}</strong> aula${total !== 1 ? 's' : ''}</div>
       ${disc ? `<div class="stat-pill">${disc.emoji} ${disc.nome}</div>` : ''}`;

  if (sub) sub.textContent = total === 0
    ? `Nenhum resumo disponível para ${disc?.nome ?? 'esta disciplina'} ainda.`
    : `${total} aula${total !== 1 ? 's' : ''} disponíve${total !== 1 ? 'is' : 'l'} — ${disc?.nome ?? ''}.`;
}

/* ══════════════════════════════════════════════
   FILTROS — por seção
══════════════════════════════════════════════ */
function _renderFiltrosSecao(aulas) {
  const ids   = new Set();
  const nomes = {};
  aulas.forEach(a => (a.secoes ?? []).forEach(s => { ids.add(s.id); nomes[s.id] = s.titulo; }));

  const group = document.getElementById('filter-group');
  if (!group) return;
  group.querySelectorAll('[data-filter]:not([data-filter="todas"])').forEach(b => b.remove());

  ids.forEach(id => {
    const btn = document.createElement('button');
    btn.className      = 'filter-btn';
    btn.dataset.filter = id;
    btn.textContent    = nomes[id].replace(/^[^\w\s]+\s*/, '');
    group.appendChild(btn);
  });
}

function _bindToolbar() {
  document.getElementById('filter-group')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
    State.secaoAtiva = btn.dataset.filter;
    _aplicarFiltros();
  });

  const si = document.getElementById('search-input');
  const sc = document.getElementById('search-clear');
  si?.addEventListener('input', e => {
    State.termoBusca = e.target.value.trim().toLowerCase();
    if (sc) sc.style.display = State.termoBusca ? 'block' : 'none';
    _aplicarFiltros();
  });
  sc?.addEventListener('click', () => {
    if (si) si.value = '';
    State.termoBusca = '';
    if (sc) sc.style.display = 'none';
    _aplicarFiltros();
  });
}

function _aplicarFiltros() {
  let aulas = [...State.aulas];

  if (State.termoBusca) {
    const t = State.termoBusca;
    aulas = aulas.filter(a =>
      (a.aula ?? '').toLowerCase().includes(t) ||
      (a.ideia_central ?? '').toLowerCase().includes(t) ||
      JSON.stringify(a.secoes ?? '').toLowerCase().includes(t)
    );
  }

  if (aulas.length === 0) { _mostrarEstado('empty'); return; }
  _renderCards(aulas);
  _mostrarEstado('grid');
}

/* ══════════════════════════════════════════════
   CARDS
══════════════════════════════════════════════ */
function _renderCards(aulas) {
  const grid = document.getElementById('resumos-grid');
  if (!grid) return;
  grid.innerHTML = '';
  aulas.forEach((aula, idx) => grid.appendChild(_criarCard(aula, idx)));
}

function _criarCard(aula, idx) {
  const secoes = aula.secoes ?? [];

  // Extrai só o número/label da aula (ex: "Aula 9") e o título separado
  const aulaStr   = _esc(aula.aula ?? '');
  const aulaMatch = aulaStr.match(/^(Aula\s*\d+)\s*[—–-]\s*(.+)$/i);
  const aulaNum   = aulaMatch ? aulaMatch[1] : aulaStr;
  const aulaTitulo = aulaMatch ? aulaMatch[2] : '';

  const card = document.createElement('article');
  card.className = 'resumo-card resumo-card--nota';
  card.style.animationDelay = `${idx * 0.06}s`;
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Abrir: ${aula.aula}`);

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-num">${aulaNum}</div>
      <div class="card-title">${aulaTitulo || aulaStr}</div>
      <div class="card-divider"></div>
      ${aula.ideia_central
        ? `<p class="card-desc">${_parseInline(aula.ideia_central)}</p>`
        : ''}
      <div class="card-bottom">
        <div class="card-progress__track">
          <div class="card-progress__fill"></div>
        </div>
        <div class="card-meta">
          <span class="card-meta__count">${secoes.length} seção${secoes.length !== 1 ? 'ões' : ''}</span>
          <span class="card-meta__cta">
            Ver resumo
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  `;

  card.addEventListener('click', () => _abrirModal(aula));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _abrirModal(aula); }
  });
  return card;
}

function _gerarPreview(aula) {
  const primeira = (aula.secoes ?? [])[0];
  if (!primeira) return '';
  const bloco = (primeira.blocos ?? [])[0];
  if (!bloco) return '';
  if (bloco.tipo === 'lista' && bloco.itens) {
    return bloco.itens.slice(0, 3).map(i => `• ${_parseInline(i)}`).join('<br>');
  }
  if (bloco.tipo === 'topico' && bloco.texto) return _parseInline(bloco.texto);
  return '';
}

/* ══════════════════════════════════════════════
   MODAL — LEITURA COMPLETA
══════════════════════════════════════════════ */
function _bindModal() {
  document.getElementById('read-modal-overlay')?.addEventListener('click', _fecharModal);
  document.getElementById('read-modal-close')?.addEventListener('click', _fecharModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') _fecharModal(); });
}

function _abrirModal(aula) {
  document.getElementById('rm-aula-label').textContent = aula.aula ?? '';
  const badge = document.getElementById('rm-tipo-badge');
  badge.textContent = 'Resumo';
  badge.className   = 'read-modal__badge badge--conceito';

  document.getElementById('rm-body').innerHTML = _buildModalBody(aula);

  document.getElementById('read-modal').classList.add('read-modal--open');
  document.body.style.overflow = 'hidden';
  document.getElementById('read-modal-panel')?.focus();

  _bindModalTabs();
}

function _fecharModal() {
  document.getElementById('read-modal')?.classList.remove('read-modal--open');
  document.body.style.overflow = '';
}

function _buildModalBody(aula) {
  const secoes = aula.secoes ?? [];
  let html = '';

  if (aula.ideia_central) {
    html += `<div class="rm-ideia-central">
      <span class="rm-ideia-icon">💡</span>
      <span>${_parseInline(aula.ideia_central)}</span>
    </div>`;
  }

  if (secoes.length > 1) {
    html += `<div class="rm-tabs" id="rm-tabs">
      ${secoes.map((s, i) =>
        `<button class="rm-tab${i === 0 ? ' rm-tab--active' : ''}" data-sec="${i}">${s.titulo}</button>`
      ).join('')}
    </div>`;
  }

  secoes.forEach((sec, i) => {
    html += `<div class="rm-secao${i === 0 ? ' rm-secao--active' : ''}" data-sec="${i}">
      <h3 class="rm-secao-titulo">${_esc(sec.titulo)}</h3>
      ${(sec.blocos ?? []).map(b => _renderBloco(b)).join('')}
    </div>`;
  });

  return html;
}

function _bindModalTabs() {
  document.getElementById('rm-tabs')?.addEventListener('click', e => {
    const btn = e.target.closest('.rm-tab');
    if (!btn) return;
    const idx = parseInt(btn.dataset.sec);

    document.querySelectorAll('.rm-tab').forEach(b => b.classList.remove('rm-tab--active'));
    document.querySelectorAll('.rm-secao').forEach(s => s.classList.remove('rm-secao--active'));
    btn.classList.add('rm-tab--active');
    document.querySelector(`.rm-secao[data-sec="${idx}"]`)?.classList.add('rm-secao--active');
  });
}

/* ══════════════════════════════════════════════
   RENDERIZADOR DE BLOCOS
══════════════════════════════════════════════ */
function _renderBloco(b) {
  switch (b.tipo) {

    case 'topico': {
      let html = `<div class="rm-topico">`;
      html += `<div class="rm-topico__titulo">${_parseInline(b.titulo ?? '')}</div>`;
      if (b.texto)  html += `<p class="rm-topico__texto">${_parseInline(b.texto)}</p>`;
      if (b.lista)  html += `<ul class="rm-lista">${b.lista.map(i => `<li>${_parseInline(i)}</li>`).join('')}</ul>`;
      if (b.codigo) html += `<pre class="rm-codigo"><code>${_esc(b.codigo)}</code></pre>`;
      html += `</div>`;
      return html;
    }

    case 'lista': {
      let html = '';
      if (b.titulo) html += `<p class="rm-lista-titulo">${_parseInline(b.titulo)}</p>`;
      html += `<ul class="rm-lista">${(b.itens ?? []).map(i => `<li>${_parseInline(i)}</li>`).join('')}</ul>`;
      return html;
    }

    case 'subtitulo':
      return `<div class="rm-subtitulo">${_parseInline(b.texto ?? '')}</div>`;

    case 'exemplo':
      return `<div class="rm-exemplo">
        <div class="rm-exemplo__titulo">${_esc(b.titulo ?? '')}</div>
        <p class="rm-exemplo__texto">${_parseInline(b.texto ?? '')}</p>
        ${b.detalhe ? `<span class="rm-exemplo__detalhe">${_parseInline(b.detalhe)}</span>` : ''}
      </div>`;

    case 'tabela': {
      const cols = b.colunas ?? [];
      const rows = b.linhas  ?? [];
      return `
        ${b.titulo ? `<div class="rm-topico__titulo">${_parseInline(b.titulo)}</div>` : ''}
        <div class="rm-tabela-wrap">
          <table class="rm-tabela">
            <thead>
              <tr>${cols.map(c => `<th>${_esc(c)}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rows.map(r => `<tr>${r.map(c => `<td><code>${_esc(c)}</code></td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </div>`;
    }

    case 'codigo':
      return `<pre class="rm-codigo"><code>${_esc(b.codigo ?? '')}</code></pre>`;

    case 'destaque':
      return `<div class="rm-destaque">${_parseInline(b.texto ?? '')}</div>`;

    default:
      return '';
  }
}

/* ══════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════ */
function _renderSidebar() {
  const semLabel = document.getElementById('sidebar-semestre');
  if (semLabel) semLabel.textContent = State.semestre ?? '—';

  const list = document.getElementById('disc-list');
  if (!list) return;
  list.innerHTML = '';

  State.disciplinas.forEach(disc => {
    const isAtivo = disc.id === State.disciplina?.id;
    const item    = document.createElement('button');
    item.className       = `disc-item${isAtivo ? ' disc-item--active' : ''}`;
    item.dataset.discId  = disc.id;
    item.setAttribute('aria-current', isAtivo ? 'page' : 'false');
    item.title = disc.nome;
    item.innerHTML = `
      <span class="disc-item__emoji">${disc.emoji}</span>
      <span class="disc-item__info">
        <span class="disc-item__nome">${disc.nome}</span>
        <span class="disc-item__status disc-item__status--hint" id="disc-status-${disc.id}">Clique</span>
      </span>
      <svg class="disc-item__chevron" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>`;
    item.addEventListener('click', () => _trocarDisciplina(disc));
    list.appendChild(item);
  });
}

function _atualizarSidebarAtivo(discId) {
  document.querySelectorAll('.disc-item').forEach(el => {
    const a = el.dataset.discId === discId;
    el.classList.toggle('disc-item--active', a);
    el.setAttribute('aria-current', a ? 'page' : 'false');
  });
}

function _marcarStatusConteudo(discId, tem) {
  const el = document.getElementById(`disc-status-${discId}`);
  if (!el) return;
  el.textContent = tem ? 'Disponível' : 'Sem conteúdo';
  el.className   = `disc-item__status disc-item__status--${tem ? 'ok' : 'empty'}`;
}

function _trocarDisciplina(disc) {
  if (disc.id === State.disciplina?.id) return;
  State.disciplina = disc;
  setDisciplina(disc.id);

  const url = new URL(window.location.href);
  url.searchParams.set('disc', disc.id);
  window.history.pushState({}, '', url);

  State.secaoAtiva = 'todas';
  State.termoBusca = '';
  const si = document.getElementById('search-input');
  if (si) si.value = '';
  document.getElementById('search-clear').style.display = 'none';
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
  document.querySelector('[data-filter="todas"]')?.classList.add('filter-btn--active');
  document.querySelectorAll('.filter-btn:not([data-filter="todas"])').forEach(b => b.remove());

  _atualizarSidebarAtivo(disc.id);
  _renderHeader();
  _fecharMobileDropdown();
  _aplicarCorDisciplina(disc.id);
  _carregarConteudo();
}

/* ══════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════ */
function _renderHeader() {
  const disc = State.disciplina;
  const bc   = document.getElementById('header-breadcrumb');
  if (bc) bc.innerHTML = disc ? `Resumos <span>· ${disc.nome}</span>` : 'Resumos';

  const badge = document.getElementById('disc-badge');
  if (badge && disc) {
    const label = disc.apelido ?? disc.nome;
    badge.innerHTML = `
      <span style="flex-shrink:0">${disc.emoji}</span>
      <span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;min-width:0">${label}</span>
    `;
  }

  const ey = document.getElementById('hero-eyebrow-text');
  if (ey) ey.textContent = disc?.nome ?? 'Resumos';

  const ml = document.getElementById('mobile-disc-label');
  if (ml) ml.textContent = disc ? `${disc.emoji} ${disc.apelido ?? _nomeCurto(disc.nome, 20)}` : 'Disciplina';

  document.title = disc ? `Resumos — ${disc.nome} · Nexus Study` : 'Resumos · Nexus Study';
}

function _nomeCurto(nome, max = 18) {
  return nome.length > max ? nome.slice(0, max - 2) + '…' : nome;
}

/* ══════════════════════════════════════════════
   MOBILE DROPDOWN
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
      <span class="disc-item__info"><span class="disc-item__nome">${disc.nome}</span></span>`;
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
function _esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function _parseInline(str) {
  if (!str) return '';
  return _esc(str)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}