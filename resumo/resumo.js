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
  setSemestre,
  SEMESTRES,
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
  discVerificadas: new Set(),
  temConteudo:     null,   // null = carregando | true = tem | false = vazio
};

/* ══════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  setPagina('RESUMO');
  document.getElementById('footer-year').textContent  = new Date().getFullYear();
document.getElementById('sidebar-year').textContent = new Date().getFullYear();

  _resolverContexto();
  _renderSidebar();
  _renderHeader();
  _renderSemestreSelector();
  _bindModal();
  _bindMobileDropdown();
  _carregarConteudo();
});

/* ══════════════════════════════════════════════
   SELETOR DE SEMESTRE
══════════════════════════════════════════════ */
function _renderSemestreSelector() {
  const wrap = document.getElementById('semestre-wrap-resumo');
  if (!wrap) return;

  const atual = State.semestre;
  const select = document.createElement('select');
  select.className = 'semestre-select';
  select.title = 'Selecionar semestre';

  SEMESTRES.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    if (s === atual) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener('change', e => {
    setSemestre(e.target.value);
    State.semestre    = e.target.value;
    State.disciplinas = getDisciplinasDeSemestre(e.target.value);
    State.temConteudo = null;

    State.disciplina = State.disciplinas[0] ?? null;
    if (State.disciplina) {
      setDisciplina(State.disciplina.id);
      _aplicarCorDisciplina(State.disciplina.id);
    } else {
      setDisciplina(null);
    }

    _renderSidebar();
    _renderHeader();
    _carregarConteudo();
  });

  wrap.appendChild(select);
}

/* ══════════════════════════════════════════════
   CONTEXTO
══════════════════════════════════════════════ */
function _resolverContexto() {
  const semestre    = getSemestreAtual();
  const lista       = getDisciplinasDeSemestre(semestre);
  State.semestre    = semestre;
  State.disciplinas = lista;

  if (!lista.length) {
    State.disciplina = null;
    setDisciplina(null);
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const discId = params.get('disc') ?? getDisciplinaAtual();
  const disc   = (discId ? lista.find(d => d.id === discId) : null) ?? lista[0] ?? null;
  State.disciplina = disc;
  if (disc) setDisciplina(disc.id);
  if (disc) _aplicarCorDisciplina(disc.id);
}

/* ══════════════════════════════════════════════
   STATUS BADGE
   — mostra o badge de disciplina OU o badge
     "Vazio" com o mesmo tamanho/posição
══════════════════════════════════════════════ */
function _atualizarStatusBadge() {
  const discBadge   = document.getElementById('disc-badge');
  const statusBadge = document.getElementById('header-status-badge');
  if (!discBadge || !statusBadge) return;

  if (State.disciplinas.length === 0) {
    // Semestre sem disciplinas → mostra "Vazio" no lugar do disc-badge
    discBadge.style.display   = 'none';
    discBadge.innerHTML       = '';
    statusBadge.style.display = '';
    statusBadge.innerHTML     = `<span style="flex-shrink:0">📭</span><span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;min-width:0">Vazio</span>`;
    statusBadge.className     = 'status-badge status-badge--empty';
  } else {
    // Tem disciplinas → o disc-badge já é gerenciado por _renderHeader()
    statusBadge.style.display = 'none';
    statusBadge.innerHTML     = '';
  }
}

/* ══════════════════════════════════════════════
   CARREGAR CONTEÚDO DINÂMICO
══════════════════════════════════════════════ */
function _carregarConteudo() {
  _mostrarEstado('loading');
  State.temConteudo = null;
  _atualizarStatusBadge();
  _removerScriptAnterior();
  window.__nexusConteudo = null;

  const disc = State.disciplina;
  if (!disc) {
    State.temConteudo = false;
    _atualizarStatusBadge();
    _renderHeroStats(0);
    _mostrarEstadoSemConteudo();
    return;
  }

  const [ano] = (State.semestre ?? '2026.2').split('.');
  const src   = `/resumo/conteudo/${ano}/${State.semestre}/res_${disc.arquivo}.js`;

  const script = document.createElement('script');
  script.src   = src;
  script.id    = 'nexus-conteudo-script';

  script.onload = () => {
    if (State.disciplina?.id !== disc.id) return;

    const aulas = _lerDados();
    State.discVerificadas.add(disc.id);
    State.temConteudo = aulas.length > 0;
    _marcarStatusConteudo(disc.id, State.temConteudo);

    if (!aulas.length) { _renderHeroStats(0); _mostrarEstadoSemConteudo(); return; }
    State.aulas = aulas;
    _renderHeroStats(aulas.length);
    _renderCards(aulas);
    _mostrarEstado('grid');
  };

  script.onerror = () => {
    if (State.disciplina?.id !== disc.id) return;

    State.discVerificadas.add(disc.id);
    State.temConteudo = false;
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
  if (eEl) eEl.textContent = disc?.emoji ?? '';
  if (nEl) nEl.textContent  = disc?.nome  ?? '';
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

  c.innerHTML = disc
    ? `<div class="stat-pill">${disc.emoji} ${disc.nome}</div>`
    : '';

  if (sub) sub.textContent = total === 0
    ? `Nenhum resumo disponível para ${disc?.nome ?? 'esta disciplina'} ainda.`
    : `${total} aula${total !== 1 ? 's' : ''} disponíve${total !== 1 ? 'is' : 'l'} — ${disc?.nome ?? ''}.`;
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

  const aulaStr    = _esc(aula.aula ?? '');
  const aulaMatch  = aulaStr.match(/^(Aula\s*\d+)\s*[—–-]\s*(.+)$/i);
  const aulaNum    = aulaMatch ? aulaMatch[1] : aulaStr;
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
          <span class="card-meta__count">${secoes.length} seç${secoes.length !== 1 ? 'ões' : 'ão'}</span>
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
      if (b.lista)  html += `<ul class="rm-lista">${b.lista.map(i => `<li><span>${_parseInline(i)}</span></li>`).join('')}</ul>`;
      if (b.codigo) html += `<pre class="rm-codigo"><code>${_esc(b.codigo)}</code></pre>`;
      html += `</div>`;
      return html;
    }

    case 'lista': {
      let html = '';
      if (b.titulo) html += `<p class="rm-lista-titulo">${_parseInline(b.titulo)}</p>`;
      html += `<ul class="rm-lista">${(b.itens ?? []).map(i => `<li><span>${_parseInline(i)}</span></li>`).join('')}</ul>`;
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

  if (!State.disciplinas.length) {
    list.innerHTML = `
      <div style="
        padding: 1.5rem 0.75rem;
        text-align: center;
        color: var(--text-3);
        font-size: 0.72rem;
        letter-spacing: 0.06em;
        line-height: 1.7;
      ">
        <div style="font-size: 1.4rem; margin-bottom: 0.5rem;">📭</div>
        Nenhuma disciplina<br>neste semestre
      </div>`;
    _mostrarEstado('no-content');
    return;
  }

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
  if (el) {
    el.textContent = tem ? 'Disponível' : 'Sem conteúdo';
    el.className   = `disc-item__status disc-item__status--${tem ? 'ok' : 'empty'}`;
  }
}

function _trocarDisciplina(disc) {
  if (disc.id === State.disciplina?.id) return;
  State.disciplina  = disc;
  State.temConteudo = null;
  setDisciplina(disc.id);

  const url = new URL(window.location.href);
  url.searchParams.set('disc', disc.id);
  window.history.pushState({}, '', url);

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

  const bc = document.getElementById('header-breadcrumb');
  if (bc) bc.innerHTML = disc ? `Resumos <span>· ${disc.nome}</span>` : 'Resumos';

  const badge = document.getElementById('disc-badge');
  if (badge) {
    if (disc && State.disciplinas.length > 0) {
      const label = disc.apelido ?? disc.nome;
      badge.style.display = '';
      badge.innerHTML = `
        <span style="flex-shrink:0">${disc.emoji}</span>
        <span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;min-width:0">${label}</span>
      `;
    } else {
      badge.style.display = 'none';
      badge.innerHTML = '';
    }
  }

  const ey = document.getElementById('hero-eyebrow-text');
  if (ey) ey.textContent = disc?.nome ?? 'Resumos';

  const ml = document.getElementById('mobile-disc-label');
  if (ml) ml.textContent = disc ? `${disc.emoji} ${disc.apelido ?? _nomeCurto(disc.nome, 20)}` : 'Disciplina';

  document.title = disc ? `Resumos — ${disc.nome} · Nexus Study` : 'Resumos · Nexus Study';

  _atualizarStatusBadge();
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