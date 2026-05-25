/* =============================================
   NEXUS STUDY — pessoal.js  (versão com sync)
   Área Pessoal: Checklist + Tarefa (Categorias) + Anotações
   =============================================

   MUDANÇAS em relação ao original:
   ─────────────────────────────────────────────
   1. Importa pessoal_sync.js no lugar das chamadas
      diretas ao localStorage.
   2. Removidas as funções _loadAllCats / _saveAllCats /
      _getCategorias / _setCategorias / _getCheckedIds /
      _saveCheckedIds (agora estão no sync module).
   3. STORAGE_NOTE / STORAGE_CHECKLIST removidas.
   4. Boot agora chama syncDiscFromFirebase() e, ao terminar,
      re-renderiza com os dados atualizados do Firebase.
   5. _trocarDisciplina() também dispara sync.
   6. Adicionado badge #pessoal-sync-status no header.
   ============================================= */

import {
  getSemestreAtual,
  setSemestre,
  getDisciplinaAtual,
  setDisciplina,
  getDisciplinasDeSemestre,
  setPagina,
  SEMESTRES,
} from '../src/global.js';

import { resolverSemestreDeURL } from '../shared/js/utils/url.js';
import { aplicarCoresDisciplina } from '../shared/js/themes/theme.js';
import { injetarLogo } from '../shared/js/utils/logo.js';

/* ── Módulo de sync (localStorage + Firebase) ── */
import {
  getCheckedIds,
  saveCheckedIds,
  getCategorias,
  setCategorias,
  getNota,
  setNota,
  syncDiscFromFirebase,
  atualizarBadgeLogin,
  setSyncStatus,
  verificarTrocaDeUsuario,
} from './pessoal_sync.js';

/* ── Áudio ── */
import audio from '../shared/js/audio/sfx.js';

/* ─────────────────────────────────────────────
   SFX — mesmos sons do index.js
───────────────────────────────────────────── */
const SFX_MAP = {
  click:      'click',
  hover:      'hover2',
  openModal:  'openModal2',
  closeModal: 'closeModal',
  select:     'select',
};

function playSound(event) {
  const id = SFX_MAP[event];
  if (!id) return;
  try { audio.sfx[id]?.(); } catch (_) {}
}

/* ══════════════════════════════════════════════
   ESTADO
══════════════════════════════════════════════ */
const State = {
  semestre:         null,
  disciplinas:      [],
  discAtiva:        null,
  DISC_CORES:       {},

  checklistData:    {},
  checklistDiscId:  null,
  notaDiscId:       null,
  autosaveTimer:    null,
  abaAtiva:         'checklist',
};

/* ══════════════════════════════════════════════
   CATEGORIAS — helpers locais (usam o sync module)
══════════════════════════════════════════════ */
function _getCategoriasAtivas() {
  const { semestre, discAtiva } = State;
  if (!semestre || !discAtiva) return [];
  return getCategorias(semestre, discAtiva.id);
}

function _salvarCategoriasAtivas(cats) {
  const { semestre, discAtiva } = State;
  if (!semestre || !discAtiva) return;
  setCategorias(semestre, discAtiva.id, cats);
}

function _getStatsAtivos() {
  const cats  = _getCategoriasAtivas();
  const total = cats.reduce((s, c) => s + c.itens.length, 0);
  const done  = cats.reduce((s, c) => s + c.itens.filter(i => i.concluida).length, 0);
  return { total, done };
}

/* ══════════════════════════════════════════════
   MODAL DE CONFIRMAÇÃO
══════════════════════════════════════════════ */
function _confirmar(msg) {
  return new Promise(resolve => {
    const modal    = document.getElementById('confirm-modal');
    const msgEl    = document.getElementById('confirm-modal-msg');
    const btnOk    = document.getElementById('confirm-modal-ok');
    const btnCan   = document.getElementById('confirm-modal-cancel');
    const backdrop = document.getElementById('confirm-modal-backdrop');
    if (!modal) { resolve(window.confirm(msg)); return; }

    msgEl.textContent = msg;
    modal.classList.add('confirm-modal--open');

    const close = (result) => {
      modal.classList.remove('confirm-modal--open');
      btnOk.removeEventListener('click', onOk);
      btnCan.removeEventListener('click', onCancel);
      backdrop.removeEventListener('click', onCancel);
      resolve(result);
    };
    const onOk     = () => { playSound('click'); close(true);  };
    const onCancel = () => { playSound('click'); close(false); };
    btnOk.addEventListener('click', onOk);
    btnCan.addEventListener('click', onCancel);
    backdrop.addEventListener('click', onCancel);
  });
}

/* ══════════════════════════════════════════════
   MINI CONFIRM POPOVER
══════════════════════════════════════════════ */
function _miniConfirmar(anchorEl) {
  return new Promise(resolve => {
    document.getElementById('mini-confirm-pop')?.remove();

    const pop = document.createElement('div');
    pop.id        = 'mini-confirm-pop';
    pop.className = 'mini-confirm';
    pop.innerHTML = `
      <p class="mini-confirm__msg">Excluir este item?</p>
      <div class="mini-confirm__actions">
        <button class="mini-confirm__btn mini-confirm__btn--cancel">Não</button>
        <button class="mini-confirm__btn mini-confirm__btn--ok">Excluir</button>
      </div>
      <div class="mini-confirm__arrow"></div>`;
    document.body.appendChild(pop);

    const rect = anchorEl.getBoundingClientRect();
    const popW = pop.offsetWidth || 185;
    const popH = pop.offsetHeight || 90;
    const left = Math.max(8, rect.right - popW);
    const top  = rect.top - popH - 10;

    pop.style.left = left + 'px';
    pop.style.top  = top  + 'px';

    requestAnimationFrame(() => pop.classList.add('mini-confirm--open'));

    const close = (result) => {
      pop.classList.remove('mini-confirm--open');
      pop.classList.add('mini-confirm--closing');
      setTimeout(() => pop.remove(), 160);
      document.removeEventListener('mousedown', onOutside);
      resolve(result);
    };

    const onOutside = (e) => {
      if (!pop.contains(e.target)) close(false);
    };
    setTimeout(() => document.addEventListener('mousedown', onOutside), 10);

    pop.querySelector('.mini-confirm__btn--ok').addEventListener('click', () => {
      playSound('click');
      close(true);
    });
    pop.querySelector('.mini-confirm__btn--cancel').addEventListener('click', () => {
      playSound('click');
      close(false);
    });
  });
}

/* ══════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  setPagina('PESSOAL');
  document.getElementById('footer-year').textContent  = new Date().getFullYear();
  document.getElementById('sidebar-year').textContent = new Date().getFullYear();

  injetarLogo({
    destino:  '#header-logo-wrap',
    tamanho:  32,
    layout:   'stacked',
    srcBase:  '../shared/img/logo.png',
    linkHref: '../index.html',
  });

  try {
    const mod = await import('../shared/js/cores.js');
    State.DISC_CORES = mod.DISC_CORES ?? {};
  } catch (_) {}

  try {
    const mod = await import('../content/area_pessoal/checklist_data.js');
    State.checklistData = mod.CHECKLIST_ITENS ?? {};
  } catch (_) {}

  _resolverContexto();

  verificarTrocaDeUsuario(); // ← antes de tudo

  _resolverContexto();       // ← só uma vez
  _renderSemestreSelector();
  _renderSidebar();
  _renderHeader();

  /* ── Renderiza com dados do localStorage primeiro (rápido) ── */
  _renderClPanel();
  _renderTaskContainer();
  _updateProgress();
  _renderNotaAtual();

  _bindTabs();
  _bindAddTask();
  _bindNotes();
  _bindChecklist();
  _bindMobileDropdown();
  _bindFab();

  /* ── Badge de sync ── */
  atualizarBadgeLogin();

  /* ── Sync do Firebase em background (atualiza se tiver dado mais recente) ── */
  if (State.discAtiva) {
    _syncAndRefresh(State.semestre, State.discAtiva.id);
  }
});

/* ── Sync + re-render após retorno do Firebase ── */
async function _syncAndRefresh(sem, discId) {
  try {
    await syncDiscFromFirebase(sem, discId);

    /* Só re-renderiza se a disciplina ainda for a mesma */
    if (State.discAtiva?.id !== discId || State.semestre !== sem) return;

    _renderClPanel();
    _renderTaskContainer();
    _updateProgress();
    _renderNotaAtual();
    _renderSidebar();
  } catch (err) {
    console.warn('[pessoal] _syncAndRefresh falhou:', err);
    setSyncStatus('offline');
  }
}

/* ══════════════════════════════════════════════
   CONTEXTO
══════════════════════════════════════════════ */
function _resolverContexto() {
  const semestre    = resolverSemestreDeURL();
  const lista       = getDisciplinasDeSemestre(semestre);
  State.semestre    = semestre;
  State.disciplinas = lista;

  const discId = getDisciplinaAtual();
  const disc   = (discId ? lista.find(d => d.id === discId) : null) ?? lista[0] ?? null;

  State.discAtiva       = disc;
  State.notaDiscId      = disc?.id ?? null;
  State.checklistDiscId = disc?.id ?? null;

  if (disc) { setDisciplina(disc.id); aplicarCoresDisciplina(disc.arquivo, State.DISC_CORES); }
}

/* ══════════════════════════════════════════════
   SELETOR DE SEMESTRE
══════════════════════════════════════════════ */
function _renderSemestreSelector() {
  const wrap = document.getElementById('semestre-selector-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';

  const select = document.createElement('select');
  select.className = 'semestre-select';
  select.title     = 'Selecionar semestre';
  select.id        = 'semestre-select';

  SEMESTRES.forEach(s => {
    const opt       = document.createElement('option');
    opt.value       = s;
    opt.textContent = s;
    if (s === State.semestre) opt.selected = true;
    select.appendChild(opt);
  });

  /* Som de click ao abrir a lista, select ao confirmar */
select.addEventListener('change', e => {
  playSound('select');
  _trocarSemestre(e.target.value);
});

wrap.appendChild(select);

/* Som de click ao abrir a lista — aguarda o elemento estar no DOM,
   igual ao padrão usado no index.js (_montarSelect) */
requestAnimationFrame(() => {
  const sel = wrap.querySelector('select');
  if (sel) sel.addEventListener('mousedown', () => playSound('click'));
});
}

function _trocarSemestre(novoSemestre) {
  setSemestre(novoSemestre);
  State.semestre    = novoSemestre;
  State.disciplinas = getDisciplinasDeSemestre(novoSemestre);

  const primeiraDisc = State.disciplinas[0] ?? null;
  State.discAtiva       = primeiraDisc;
  State.notaDiscId      = primeiraDisc?.id ?? null;
  State.checklistDiscId = primeiraDisc?.id ?? null;

  if (primeiraDisc) {
    setDisciplina(primeiraDisc.id);
    aplicarCoresDisciplina(primeiraDisc.arquivo, State.DISC_CORES);
  }

  _renderSidebar();
  _renderHeader();
  _renderClPanel();
  _renderTaskContainer();
  _updateProgress();
  _renderNotaAtual();

  if (primeiraDisc) {
    _syncAndRefresh(novoSemestre, primeiraDisc.id);
  }
}

/* ══════════════════════════════════════════════
   ABAS
══════════════════════════════════════════════ */
function _bindTabs() {
  document.getElementById('main-tabs')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
    playSound('select');
    _setAba(btn.dataset.tab);
  });
}

function _setAba(aba) {
  State.abaAtiva = aba;

  document.querySelectorAll('.main-tab-btn').forEach(btn => {
    btn.classList.toggle('main-tab-btn--active', btn.dataset.tab === aba);
    btn.setAttribute('aria-selected', btn.dataset.tab === aba ? 'true' : 'false');
  });

  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('tab-panel--active', p.id === `panel-${aba}`);
  });

  _renderSidebar();
  _updateHeroStat();
}

/* ══════════════════════════════════════════════
   HEADER & HERO
══════════════════════════════════════════════ */
function _renderHeader() {
  const disc = State.discAtiva;

  const sub = document.getElementById('header-breadcrumb-sub');
  if (sub) sub.textContent = disc ? `· ${disc.nome}` : '';

  const badge = document.getElementById('disc-badge');
  if (badge) {
    if (disc) {
      const label = disc.apelido ?? disc.nome;
      badge.style.display = '';
      badge.innerHTML = `
        <span style="flex-shrink:0">${disc.emoji}</span>
        <span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;min-width:0">${label}</span>`;
    } else {
      badge.style.display = 'none';
      badge.innerHTML = '';
    }
  }

  const ml = document.getElementById('mobile-disc-label');
  if (ml) ml.textContent = disc
    ? `${disc.emoji} ${disc.apelido ?? _nomeCurto(disc.nome, 20)}`
    : 'Disciplina';

  const ey = document.getElementById('hero-eyebrow-text');
  if (ey) ey.textContent = disc ? disc.nome : 'Área Pessoal';

  document.title = 'Área Pessoal · Nexus Study';
  _updateHeroStat();
}

function _updateHeroStat() {
  const pill = document.getElementById('hero-stat-pill');
  const text = document.getElementById('hero-stat-text');
  if (!pill || !text) return;

  if (State.abaAtiva === 'checklist') {
    const discId  = State.checklistDiscId;
    const disc    = _getClDisc(discId);
    if (!disc) { pill.style.display = 'none'; return; }
    const todos   = disc.categorias.flatMap(c => c.itens);
    const total   = todos.length;
    if (total === 0) { pill.style.display = 'none'; return; }
    const checked = getCheckedIds(State.semestre, discId);
    const done    = todos.filter(i => checked.has(i.id)).length;
    pill.style.display = '';
    text.textContent = `${done} / ${total} itens`;

  } else if (State.abaAtiva === 'tarefa') {
    const { total, done } = _getStatsAtivos();
    if (total === 0) { pill.style.display = 'none'; return; }
    pill.style.display = '';
    text.textContent = `${done} / ${total} itens`;

  } else {
    const discId = State.notaDiscId;
    const nota   = discId ? getNota(State.semestre, discId) : '';
    const words  = nota.trim() ? nota.trim().split(/\s+/).length : 0;
    if (words === 0) { pill.style.display = 'none'; return; }
    pill.style.display = '';
    text.textContent = `${words} palavra${words !== 1 ? 's' : ''}`;
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
      <div style="padding:1.5rem 0.75rem;text-align:center;color:var(--text-3);font-size:0.72rem;letter-spacing:0.06em;line-height:1.7;">
        <div style="font-size:1.4rem;margin-bottom:0.5rem;">📭</div>
        Nenhuma disciplina<br>neste semestre
      </div>`;
    return;
  }

  State.disciplinas.forEach(disc => {
    const isAtivo = disc.id === State.discAtiva?.id;
    const hasNota = !!getNota(State.semestre, disc.id).trim();

    let total = 0, done = 0;

    if (State.abaAtiva === 'checklist') {
      const clDisc = _getClDisc(disc.id);
      if (clDisc) {
        const todos   = clDisc.categorias.flatMap(c => c.itens);
        total = todos.length;
        const checked = getCheckedIds(State.semestre, disc.id);
        done  = todos.filter(i => checked.has(i.id)).length;
      }
    } else if (State.abaAtiva === 'tarefa') {
      const cats = getCategorias(State.semestre, disc.id);
      total = cats.reduce((s, c) => s + c.itens.length, 0);
      done  = cats.reduce((s, c) => s + c.itens.filter(i => i.concluida).length, 0);
    }

    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    const item = document.createElement('button');
    item.className      = `disc-item${isAtivo ? ' disc-item--active' : ''}`;
    item.dataset.discId = disc.id;
    item.setAttribute('aria-current', isAtivo ? 'page' : 'false');
    item.title = disc.nome;
    item.innerHTML = `
      <span class="disc-item__emoji">${disc.emoji}</span>
      <span class="disc-item__info">
        <span class="disc-item__nome">${disc.nome}</span>
        <span class="disc-item__sub ${total > 0 ? 'disc-item__sub--ok' : 'disc-item__sub--empty'}">
          ${total > 0 ? `${done}/${total} ✓` : hasNota ? '📝 nota' : 'sem dados'}
        </span>
        <div class="disc-item__progress">
          <div class="disc-item__progress-fill" style="width:${pct}%"></div>
        </div>
      </span>
      <svg class="disc-item__chevron" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>`;

    item.addEventListener('mouseenter', () => playSound('hover'));
    item.addEventListener('click', () => {
      playSound('select');
      _trocarDisciplina(disc);
    });
    list.appendChild(item);
  });
}

function _trocarDisciplina(disc) {
  State.discAtiva       = disc;
  State.notaDiscId      = disc.id;
  State.checklistDiscId = disc.id;
  setDisciplina(disc.id);
  aplicarCoresDisciplina(disc.arquivo, State.DISC_CORES);

  document.querySelectorAll('.disc-item').forEach(el => {
    const a = el.dataset.discId === disc.id;
    el.classList.toggle('disc-item--active', a);
    el.setAttribute('aria-current', a ? 'page' : 'false');
  });

  _renderHeader();
  _fecharMobileDropdown();

  /* Renderiza com localStorage (imediato) */
  if (State.abaAtiva === 'checklist') {
    _renderClPanel();
  } else if (State.abaAtiva === 'tarefa') {
    _renderTaskContainer();
    _updateProgress();
  } else if (State.abaAtiva === 'notas') {
    _renderNotaAtual();
  }

  /* Sync Firebase em background */
  _syncAndRefresh(State.semestre, disc.id);
}

/* ══════════════════════════════════════════════
   TAREFAS — PROGRESSO
══════════════════════════════════════════════ */
function _updateProgress() {
  const { total, done } = _getStatsAtivos();
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const countEl = document.getElementById('progress-count');
  const fillEl  = document.getElementById('progress-fill');

  if (countEl) countEl.innerHTML = `${done}&thinsp;/&thinsp;${total} itens`;
  if (fillEl)  fillEl.style.width = `${pct}%`;

  _updateHeroStat();
  _renderSidebar();
}

/* ══════════════════════════════════════════════
   TAREFAS — RENDER
══════════════════════════════════════════════ */
function _renderTaskContainer() {
  const container = document.getElementById('tasks-container');
  if (!container) return;
  container.innerHTML = '';

  const cats = _getCategoriasAtivas();
  if (cats.length === 0) { container.appendChild(_buildEmptyState()); return; }
  cats.forEach((cat, ci) => container.appendChild(_buildCatSection(cat, ci)));
}

function _buildEmptyState() {
  const div = document.createElement('div');
  div.className = 'tasks-empty';
  div.innerHTML = `
    <span class="tasks-empty__icon">📂</span>
    <p>Nenhuma categoria ainda</p>
    <small>Crie uma categoria acima para começar a organizar suas tarefas.</small>`;
  return div;
}

function _buildCatSection(cat, ci) {
  const done  = cat.itens.filter(i => i.concluida).length;
  const total = cat.itens.length;

  const section = document.createElement('div');
  section.className = 'cat-section';
  section.dataset.catId = cat.id;
  section.style.animationDelay = `${ci * 0.06}s`;

  section.innerHTML = `
    <div class="cat-header">
      <div class="cat-header__left">
        <span class="cat-header__nome">${_esc(cat.nome)}</span>
        <span class="cat-header__badge">${done}/${total}</span>
      </div>
      <div class="cat-header__actions">
        <button class="cat-edit" title="Renomear categoria">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          Renomear
        </button>
        <button class="cat-delete" title="Excluir categoria">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
          Excluir
        </button>
      </div>
    </div>
    <div class="cat-items" id="cat-items-${cat.id}">
      ${cat.itens.map((item, ii) => _buildItemHTML(item, ii)).join('')}
    </div>
    <div class="cat-add-item">
      <input type="text" class="cat-item-input" placeholder="Novo item…" maxlength="200" />
      <button class="cat-item-add-btn">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Adicionar
      </button>
    </div>`;

  section.querySelector('.cat-edit').addEventListener('click', () => {
    playSound('click');
    _editarCategoria(cat.id, section);
  });
  section.querySelector('.cat-delete').addEventListener('click', () => {
    playSound('click');
    _deletarCategoria(cat.id, section);
  });

  section.querySelector('.cat-items').addEventListener('click', e => {
    const delBtn = e.target.closest('.item-delete');
    if (delBtn) {
      playSound('click');
      const row = delBtn.closest('.item-row');
      _deletarItem(cat.id, delBtn.dataset.itemId, row);
      return;
    }
    const editBtn = e.target.closest('.item-edit');
    if (editBtn) {
      playSound('click');
      const row = editBtn.closest('.item-row');
      _editarItem(cat.id, editBtn.dataset.itemId, row);
      return;
    }
    const row = e.target.closest('.item-row');
    if (!row || row.classList.contains('item-editing')) return;
    if (e.target.closest('.item-edit-input')) return;
    playSound('click');
    _toggleItem(cat.id, row.dataset.itemId, row);
  });

  const input  = section.querySelector('.cat-item-input');
  const addBtn = section.querySelector('.cat-item-add-btn');

  const addItem = () => {
    const texto = input?.value.trim();
    if (!texto) {
      const prev = input?.getAttribute('placeholder');
      input?.classList.add('input-error');
      input?.setAttribute('placeholder', '⚠ Digite algo antes de adicionar…');
      setTimeout(() => {
        input?.classList.remove('input-error');
        input?.setAttribute('placeholder', prev ?? 'Novo item…');
      }, 2000);
      input?.focus();
      return;
    }

    playSound('click');

    const cats = _getCategoriasAtivas();
    const c = cats.find(c => c.id === cat.id);
    if (!c) return;

    const newItem = { id: _uid(), texto, concluida: false, dataCriacao: Date.now() };
    c.itens.push(newItem);
    _salvarCategoriasAtivas(cats);
    if (input) input.value = '';

    const itemsEl = section.querySelector(`#cat-items-${cat.id}`);
    if (itemsEl) {
      const tmp = document.createElement('div');
      tmp.innerHTML = _buildItemHTML(newItem, c.itens.length - 1);
      const rowEl = tmp.firstElementChild;
      rowEl.style.animationDelay = '0s';
      itemsEl.appendChild(rowEl);
    }

    _atualizarBadge(section, c);
    _updateProgress();
  };

  addBtn.addEventListener('click', addItem);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') addItem(); });

  return section;
}

function _buildItemHTML(item, ii) {
  const done = item.concluida;
  return `
    <div class="item-row${done ? ' item-row--done' : ''}" data-item-id="${item.id}" style="animation-delay:${ii * 0.04}s">
      <span class="item-check${done ? ' item-check--done' : ''}">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
             stroke="var(--teal)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
      <span class="item-text${done ? ' item-text--done' : ''}">${_esc(item.texto)}</span>
      <button class="item-edit" data-item-id="${item.id}" title="Editar item">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      </button>
      <button class="item-delete" data-item-id="${item.id}" title="Excluir item">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>`;
}

/* ══════════════════════════════════════════════
   EDIÇÃO INLINE — ITEM
══════════════════════════════════════════════ */
function _editarItem(catId, itemId, rowEl) {
  if (!rowEl || rowEl.classList.contains('item-editing')) return;
  rowEl.classList.add('item-editing');

  const textEl  = rowEl.querySelector('.item-text');
  const editBtn = rowEl.querySelector(`.item-edit[data-item-id="${itemId}"]`);
  const delBtn  = rowEl.querySelector(`.item-delete[data-item-id="${itemId}"]`);
  if (!textEl) { rowEl.classList.remove('item-editing'); return; }

  const original = textEl.textContent;
  const isDone   = rowEl.classList.contains('item-row--done');

  const input = document.createElement('input');
  input.type      = 'text';
  input.className = 'item-edit-input';
  input.value     = original;
  input.maxLength = 200;

  const resizeItem = () => { input.style.width = Math.max(60, input.value.length + 3) + 'ch'; };
  resizeItem();
  input.addEventListener('input', resizeItem);

  textEl.replaceWith(input);
  if (editBtn) editBtn.style.display = 'none';
  if (delBtn)  delBtn.style.display  = 'none';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'item-action-btn item-action-btn--save';
  saveBtn.title     = 'Salvar (Enter)';
  saveBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'item-action-btn item-action-btn--cancel';
  cancelBtn.title     = 'Cancelar (Esc)';
  cancelBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

  rowEl.appendChild(saveBtn);
  rowEl.appendChild(cancelBtn);
  input.focus();
  input.select();

  const _restore = (texto) => {
    document.removeEventListener('mousedown', onOutside);
    const span = document.createElement('span');
    span.className = `item-text${isDone ? ' item-text--done' : ''}`;
    span.textContent = texto;
    input.replaceWith(span);
    saveBtn.remove();
    cancelBtn.remove();
    if (editBtn) editBtn.style.display = '';
    if (delBtn)  delBtn.style.display  = '';
    rowEl.classList.remove('item-editing');
  };

  const save = () => {
    const newText = input.value.trim();
    if (!newText) { input.classList.add('input-error'); input.focus(); return; }
    playSound('click');
    const cats = _getCategoriasAtivas();
    const cat  = cats.find(c => c.id === catId);
    if (cat) {
      const item = cat.itens.find(i => i.id === itemId);
      if (item) { item.texto = newText; _salvarCategoriasAtivas(cats); }
    }
    _restore(newText);
  };

  const cancel = () => { playSound('click'); _restore(original); };
  const onOutside = (e) => { if (!rowEl.contains(e.target)) save(); };
  setTimeout(() => document.addEventListener('mousedown', onOutside), 10);

  saveBtn.addEventListener('click',   save);
  cancelBtn.addEventListener('click', cancel);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); save(); }
    if (e.key === 'Escape') { e.preventDefault(); cancel(); }
  });
}

/* ══════════════════════════════════════════════
   EDIÇÃO INLINE — CATEGORIA
══════════════════════════════════════════════ */
function _editarCategoria(catId, sectionEl) {
  if (!sectionEl || sectionEl.classList.contains('cat-editing')) return;
  sectionEl.classList.add('cat-editing');

  const nomeEl  = sectionEl.querySelector('.cat-header__nome');
  const editBtn = sectionEl.querySelector('.cat-edit');
  const delBtn  = sectionEl.querySelector('.cat-delete');
  if (!nomeEl) { sectionEl.classList.remove('cat-editing'); return; }

  const original = nomeEl.textContent;

  const input = document.createElement('input');
  input.type      = 'text';
  input.className = 'cat-name-input';
  input.value     = original;
  input.maxLength = 60;

  const resizeCat = () => { input.style.width = Math.max(60, input.value.length + 3) + 'ch'; };
  resizeCat();
  input.addEventListener('input', resizeCat);

  nomeEl.replaceWith(input);
  if (editBtn) editBtn.style.display = 'none';
  if (delBtn)  delBtn.style.display  = 'none';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'cat-action-btn cat-action-btn--save';
  saveBtn.title     = 'Salvar (Enter)';
  saveBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'cat-action-btn cat-action-btn--cancel';
  cancelBtn.title     = 'Cancelar (Esc)';
  cancelBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

  const actionsEl = sectionEl.querySelector('.cat-header__actions');
  if (actionsEl) {
    actionsEl.prepend(cancelBtn);
    actionsEl.prepend(saveBtn);
  }

  input.focus();
  input.select();

  const _restore = (nome) => {
    document.removeEventListener('mousedown', onOutside);
    const span = document.createElement('span');
    span.className   = 'cat-header__nome';
    span.textContent = nome;
    input.replaceWith(span);
    saveBtn.remove();
    cancelBtn.remove();
    if (editBtn) editBtn.style.display = '';
    if (delBtn)  delBtn.style.display  = '';
    sectionEl.classList.remove('cat-editing');
  };

  const save = () => {
    const newNome = input.value.trim();
    if (!newNome) { input.classList.add('input-error'); input.focus(); return; }
    playSound('click');
    const cats = _getCategoriasAtivas();
    const cat  = cats.find(c => c.id === catId);
    if (cat) { cat.nome = newNome; _salvarCategoriasAtivas(cats); }
    _restore(newNome);
  };

  const cancel = () => { playSound('click'); _restore(original); };
  const onOutside = (e) => { if (!sectionEl.contains(e.target)) cancel(); };
  setTimeout(() => document.addEventListener('mousedown', onOutside), 10);

  saveBtn.addEventListener('click',   save);
  cancelBtn.addEventListener('click', cancel);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); save(); }
    if (e.key === 'Escape') { e.preventDefault(); cancel(); }
  });
}

/* ══════════════════════════════════════════════
   TAREFAS — CRUD
══════════════════════════════════════════════ */
function _bindAddTask() {
  const input = document.getElementById('add-cat-input');
  const btn   = document.getElementById('add-cat-btn');

  let errMsg = document.getElementById('add-cat-error');
  if (!errMsg && input) {
    errMsg = document.createElement('span');
    errMsg.id = 'add-cat-error';
    input.parentElement?.insertAdjacentElement('afterend', errMsg);
  }

  const showErr = () => {
    const prev = input?.getAttribute('placeholder');
    input?.classList.add('input-error');
    input?.setAttribute('placeholder', '⚠ Digite algo antes de adicionar…');
    errMsg?.classList.add('input-error-msg--show');
    setTimeout(() => {
      input?.classList.remove('input-error');
      input?.setAttribute('placeholder', prev ?? 'Nome da categoria… (ex: Prova 1, Projeto Final)');
      errMsg?.classList.remove('input-error-msg--show');
    }, 2500);
  };

  const add = () => {
    const nome = input?.value.trim();
    if (!nome) { showErr(); input?.focus(); return; }
    playSound('click');
    const cats = _getCategoriasAtivas();
    cats.push({ id: _uid(), nome, itens: [] });
    _salvarCategoriasAtivas(cats);
    if (input) input.value = '';
    _renderTaskContainer();
    _updateProgress();
  };
  btn?.addEventListener('click', add);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
}

function _toggleItem(catId, itemId, rowEl) {
  const cats = _getCategoriasAtivas();
  const cat  = cats.find(c => c.id === catId);
  if (!cat) return;
  const item = cat.itens.find(i => i.id === itemId);
  if (!item) return;
  item.concluida = !item.concluida;
  _salvarCategoriasAtivas(cats);
  if (rowEl) {
    rowEl.classList.toggle('item-row--done', item.concluida);
    rowEl.querySelector('.item-check')?.classList.toggle('item-check--done', item.concluida);
    rowEl.querySelector('.item-text')?.classList.toggle('item-text--done', item.concluida);
    const sectionEl = rowEl.closest('.cat-section');
    _atualizarBadge(sectionEl, cats.find(c => c.id === catId));
  }
  _updateProgress();
}

async function _deletarItem(catId, itemId, rowEl) {
  if (!rowEl) return;

  const btn = rowEl.querySelector(`.item-delete[data-item-id="${itemId}"]`);
  const ok  = await _miniConfirmar(btn ?? rowEl);
  if (!ok) return;

  rowEl.style.transition = 'opacity 0.16s ease, transform 0.16s ease';
  rowEl.style.opacity    = '0';
  rowEl.style.transform  = 'translateX(16px)';

  setTimeout(() => {
    const height = rowEl.offsetHeight;
    rowEl.style.transition = 'height 0.18s ease, margin 0.18s ease, padding 0.18s ease, gap 0.18s ease';
    rowEl.style.overflow   = 'hidden';
    rowEl.style.height     = height + 'px';
    void rowEl.offsetHeight;
    rowEl.style.height        = '0';
    rowEl.style.marginTop     = '0';
    rowEl.style.marginBottom  = '0';
    rowEl.style.paddingTop    = '0';
    rowEl.style.paddingBottom = '0';

    setTimeout(() => {
      rowEl.remove();
      const cats = _getCategoriasAtivas();
      const cat  = cats.find(c => c.id === catId);
      if (cat) cat.itens = cat.itens.filter(i => i.id !== itemId);
      _salvarCategoriasAtivas(cats);
      const sectionEl = document.querySelector(`[data-cat-id="${catId}"]`);
      _atualizarBadge(sectionEl, cats.find(c => c.id === catId));
      _updateProgress();
    }, 190);
  }, 160);
}

async function _deletarCategoria(catId, sectionEl) {
  const btn = sectionEl?.querySelector('.cat-delete');
  const ok  = await _miniConfirmar(btn ?? sectionEl);
  if (!ok) return;

  if (sectionEl) {
    sectionEl.style.transition = 'opacity 0.25s, transform 0.25s';
    sectionEl.style.opacity    = '0';
    sectionEl.style.transform  = 'translateX(16px)';
    setTimeout(() => {
      const cats = _getCategoriasAtivas().filter(c => c.id !== catId);
      _salvarCategoriasAtivas(cats);
      _renderTaskContainer();
      _updateProgress();
    }, 240);
  }
}

function _atualizarBadge(sectionEl, cat) {
  if (!sectionEl || !cat) return;
  const badge = sectionEl.querySelector('.cat-header__badge');
  if (!badge) return;
  const done = cat.itens.filter(i => i.concluida).length;
  badge.textContent = `${done}/${cat.itens.length}`;
}

/* ══════════════════════════════════════════════
   CHECKLIST PRÉ-DEFINIDO
══════════════════════════════════════════════ */
function _getClDisc(discId) {
  const raw = State.checklistData[State.semestre]?.[discId];
  if (!raw) return null;

  if (raw.aulas) {
    const categorias = raw.aulas.flatMap(aula =>
      aula.categorias.map(cat => ({
        ...cat,
        _grupo: aula.nome,
      }))
    );
    return { categorias };
  }
  return raw;
}

/* ── usa pessoal_sync ── */
function _getCheckedIds(discId) {
  return getCheckedIds(State.semestre, discId);
}

function _saveCheckedIds(discId, set) {
  saveCheckedIds(State.semestre, discId, set);
}

function _renderClPanel() {
  const container = document.getElementById('cl-container');
  if (!container) return;
  container.innerHTML = '';

  const discId = State.checklistDiscId;
  const disc   = _getClDisc(discId);

  if (!disc) {
    container.innerHTML = `
      <div class="cl-empty">
        <span class="cl-empty__icon">📄</span>
        <p>Sem conteúdo para esta disciplina</p>
        <small>
          Adicione os itens em <code>checklist_data.js</code> dentro do semestre
          <strong>${State.semestre ?? '—'}</strong> com o id <strong>${discId ?? '—'}</strong>.
        </small>
      </div>`;
    _updateClProgress(0, 0);
    return;
  }

  const checked  = _getCheckedIds(discId);
  const allItems = disc.categorias.flatMap(c => c.itens);
  const total    = allItems.length;
  const done     = allItems.filter(i => checked.has(i.id)).length;
  _updateClProgress(done, total);

  const grupos = new Map();
  disc.categorias.forEach(cat => {
    const sep   = cat.nome.indexOf(' · ');
    const grupo = sep !== -1 ? cat.nome.slice(0, sep).trim()  : (cat._grupo ?? 'Geral');
    const label = sep !== -1 ? cat.nome.slice(sep + 3).trim() : cat.nome;
    if (!grupos.has(grupo)) grupos.set(grupo, []);
    grupos.get(grupo).push({ ...cat, _label: label });
  });

  let groupIdx = 0;
  grupos.forEach((cats, grupoNome) => {
    const groupEl = document.createElement('div');
    groupEl.className = 'cl-group cl-group--collapsed';
    groupEl.style.animationDelay = `${groupIdx * 0.1}s`;

    const groupItems   = cats.flatMap(c => c.itens);
    const groupTotal   = groupItems.length;
    const groupDone    = groupItems.filter(i => checked.has(i.id)).length;

    groupEl.innerHTML = `
      <div class="cl-group__header" data-toggle="cl-group-body-${groupIdx}">
        <span class="cl-group__title">${_esc(grupoNome)}</span>
        <div class="cl-group__meta">
          <span class="cl-group__badge">${groupDone}/${groupTotal}</span>
          <svg class="cl-group__chevron" width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
      <div class="cl-group__body" id="cl-group-body-${groupIdx}"></div>`;

    const bodyEl = groupEl.querySelector(`#cl-group-body-${groupIdx}`);

    cats.forEach((cat, ci) => {
      const catDone  = cat.itens.filter(i => checked.has(i.id)).length;
      const catTotal = cat.itens.length;

      const section = document.createElement('div');
      section.className = 'cl-section cl-section--collapsed';
      section.style.animationDelay = `${(groupIdx * 0.1) + (ci * 0.06)}s`;
      section.innerHTML = `
        <div class="cl-section__header cl-section__header--toggle">
          <div class="cl-section__title">
            <span class="cl-section__icon">${cat.icone}</span>
            ${_esc(cat._label)}
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <span class="cl-section__badge">${catDone}/${catTotal}</span>
            <svg class="cl-section__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>
        <div class="cl-items cl-section__body" id="cl-items-${groupIdx}-${ci}"></div>`;

      const itemsEl = section.querySelector('.cl-items');
      cat.itens.forEach((item, ii) => {
        const isChecked = checked.has(item.id);
        const el = document.createElement('label');
        el.className = `cl-item${isChecked ? ' cl-item--checked' : ''}`;
        el.style.animationDelay = `${(groupIdx * 0.1) + (ci * 0.06) + (ii * 0.03)}s`;
        el.innerHTML = `
          <span class="cl-item__box">
            <svg class="cl-item__check" width="9" height="9" viewBox="0 0 24 24" fill="none"
                 stroke="var(--teal)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
          <input type="checkbox" class="cl-item__input" ${isChecked ? 'checked' : ''}
                 data-item-id="${_esc(item.id)}" data-disc-id="${_esc(discId)}"/>
          <span class="cl-item__text">${_esc(item.texto)}</span>`;
        itemsEl.appendChild(el);
      });

      bodyEl.appendChild(section);

      /* Som ao abrir/fechar seção do checklist */
      section.querySelector('.cl-section__header--toggle').addEventListener('click', () => {
        playSound('click');
        section.classList.toggle('cl-section--collapsed');
      });
    });

    container.appendChild(groupEl);

    /* Som ao abrir/fechar grupo do checklist */
    groupEl.querySelector('.cl-group__header').addEventListener('click', () => {
      playSound('click');
      groupEl.classList.toggle('cl-group--collapsed');
    });

    groupIdx++;
  });
}

function _updateClProgress(done, total) {
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0;
  const countEl = document.getElementById('cl-progress-count');
  const fillEl  = document.getElementById('cl-progress-fill');
  if (countEl) countEl.textContent = `${done} / ${total} itens`;
  if (fillEl)  fillEl.style.width  = `${pct}%`;
}

function _bindChecklist() {
  document.getElementById('cl-container')?.addEventListener('change', e => {
    const input = e.target.closest('.cl-item__input');
    if (!input) return;

    playSound('click');

    const itemId  = input.dataset.itemId;
    const discId  = input.dataset.discId;
    const label   = input.closest('.cl-item');
    const checked = _getCheckedIds(discId);

    if (input.checked) {
      checked.add(itemId);
      label?.classList.add('cl-item--checked');
    } else {
      checked.delete(itemId);
      label?.classList.remove('cl-item--checked');
    }

    /* Grava no localStorage + Firebase (via sync module) */
    _saveCheckedIds(discId, checked);

    const section = input.closest('.cl-section');
    if (section) {
      const allInputs  = section.querySelectorAll('.cl-item__input');
      const doneInputs = section.querySelectorAll('.cl-item__input:checked');
      const badge = section.querySelector('.cl-section__badge');
      if (badge) badge.textContent = `${doneInputs.length}/${allInputs.length}`;
    }

    const disc       = _getClDisc(discId);
    const todos      = disc ? disc.categorias.flatMap(c => c.itens) : [];
    const newChecked = _getCheckedIds(discId);
    const done       = todos.filter(i => newChecked.has(i.id)).length;
    _updateClProgress(done, todos.length);
    _updateHeroStat();
    _renderSidebar();
  });

  document.getElementById('cl-reset-btn')?.addEventListener('click', async () => {
    const discId = State.checklistDiscId;
    if (!discId) return;
    const disc = _getClDisc(discId);
    if (!disc) return;
    const total = disc.categorias.flatMap(c => c.itens).length;
    if (total === 0) return;
    const ok = await _confirmar('Desmarcar todos os itens desta disciplina?');
    if (!ok) return;
    _saveCheckedIds(discId, new Set());
    _renderClPanel();
    _updateHeroStat();
    _renderSidebar();
  });
}

/* ══════════════════════════════════════════════
   ANOTAÇÕES  — usa pessoal_sync
══════════════════════════════════════════════ */
function _renderNotaAtual() {
  const textarea = document.getElementById('note-textarea');
  const titleEl  = document.getElementById('note-box-title');
  if (!textarea) return;

  const discId = State.notaDiscId;
  const disc   = State.disciplinas.find(d => d.id === discId);
  const nota   = discId ? getNota(State.semestre, discId) : '';

  textarea.value = nota;
  if (titleEl) titleEl.textContent = disc ? `Anotações — ${disc.nome}` : 'Anotações';
  _updateNoteStats();
  _updateHeroStat();
  _setAutosave('saved', _savedLabel(discId));
}

function _bindNotes() {
  const textarea = document.getElementById('note-textarea');
  if (!textarea) return;

  textarea.addEventListener('input', () => {
    _updateNoteStats();
    _setAutosave('saving', 'Salvando…');
    clearTimeout(State.autosaveTimer);
    State.autosaveTimer = setTimeout(_salvarNotaAtual, 800);
  });

  textarea.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      _salvarNotaAtual();
    }
  });

  document.getElementById('note-copy-btn')?.addEventListener('click', async () => {
    const val = textarea.value;
    if (!val.trim()) return;
    playSound('click');
    try {
      await navigator.clipboard.writeText(val);
      const btn = document.getElementById('note-copy-btn');
      if (btn) {
        const t = btn.textContent;
        btn.textContent = 'Copiado!';
        setTimeout(() => { btn.textContent = t; }, 1500);
      }
    } catch (_) {}
  });

  document.getElementById('note-clear-btn')?.addEventListener('click', async () => {
    if (!textarea.value.trim()) return;
    playSound('click');
    const ok = await _confirmar('Limpar todas as anotações desta disciplina?');
    if (!ok) return;
    textarea.value = '';
    _salvarNotaAtual();
    _updateNoteStats();
  });
}

function _salvarNotaAtual() {
  const textarea = document.getElementById('note-textarea');
  const discId   = State.notaDiscId;
  if (!textarea || !discId) return;

  /* Grava no localStorage + Firebase (via sync module) */
  setNota(State.semestre, discId, textarea.value);

  _setAutosave('saved', _savedLabel(discId));
  _updateHeroStat();
  _renderSidebar();
}

function _updateNoteStats() {
  const textarea = document.getElementById('note-textarea');
  if (!textarea) return;
  const val   = textarea.value;
  const words = val.trim() ? val.trim().split(/\s+/).length : 0;
  const chars = val.length;
  const wEl   = document.getElementById('note-words');
  const cEl   = document.getElementById('note-chars');
  if (wEl) wEl.textContent = words;
  if (cEl) cEl.textContent = chars;
}

function _setAutosave(estado, label) {
  const ind  = document.getElementById('autosave-indicator');
  const text = document.getElementById('autosave-text');
  if (!ind) return;
  ind.className = `autosave-indicator autosave-indicator--${estado}`;
  if (text) text.textContent = label;
}

function _savedLabel(discId) {
  const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const el   = document.getElementById('note-saved-at');
  if (el) el.textContent = hora;
  return `Salvo às ${hora}`;
}

/* ══════════════════════════════════════════════
   MOBILE DROPDOWN
══════════════════════════════════════════════ */
function _bindMobileDropdown() {
  document.getElementById('mobile-disc-btn')?.addEventListener('click', () => {
    playSound('click');
    _abrirMobileDropdown();
  });
  document.getElementById('mobile-dropdown-backdrop')?.addEventListener('click', () => {
    playSound('click');
    _fecharMobileDropdown();
  });
}

function _abrirMobileDropdown() {
  const dd   = document.getElementById('mobile-dropdown');
  const list = document.getElementById('mobile-dropdown-list');
  if (!dd || !list) return;
  list.innerHTML = '';

  State.disciplinas.forEach(disc => {
    const isAtivo = disc.id === State.discAtiva?.id;
    const btn = document.createElement('button');
    btn.className = `disc-item${isAtivo ? ' disc-item--active' : ''}`;
    btn.innerHTML = `
      <span class="disc-item__emoji">${disc.emoji}</span>
      <span class="disc-item__info"><span class="disc-item__nome">${disc.nome}</span></span>`;
    btn.addEventListener('click', () => {
      playSound('select');
      _trocarDisciplina(disc);
    });
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
function _uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function _esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function _nomeCurto(nome, max = 18) {
  return nome.length > max ? nome.slice(0, max - 2) + '…' : nome;
}

/* ══════════════════════════════════════════════
   FAB
══════════════════════════════════════════════ */
function _smoothScrollTo(targetY, duration = 1400) {
  const startY   = window.scrollY;
  const distance = targetY - startY;
  let startTime  = null;

  const ease = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed  = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

function _bindFab() {
  document.getElementById('fab-top')?.addEventListener('click', () => {
    playSound('click');
    _smoothScrollTo(0);
  });
  document.getElementById('fab-bottom')?.addEventListener('click', () => {
    playSound('click');
    _smoothScrollTo(document.body.scrollHeight);
  });
  document.getElementById('fab-collapse')?.addEventListener('click', () => {
    playSound('click');
    document.querySelectorAll('.cl-group').forEach(g => g.classList.add('cl-group--collapsed'));
    document.querySelectorAll('.cl-section').forEach(s => s.classList.add('cl-section--collapsed'));
  });
}