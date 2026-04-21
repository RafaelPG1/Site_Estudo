/* =============================================
   NEXUS STUDY — pessoal.js  (v4)
   Área Pessoal: Checklist + Tarefa + Anotações
   ✦ Sistema de tarefas isolado por semestre e disciplina
   ✦ Estrutura: { semestre: { discId: [ ...tarefas ] } }
   ============================================= */

import {
  getSemestreAtual,
  setSemestre,
  getDisciplinaAtual,
  setDisciplina,
  getDisciplinasDeSemestre,
  setPagina,
  SEMESTRES,
} from '../global.js';

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
   STORAGE KEY
══════════════════════════════════════════════ */
const STORAGE_TAREFAS   = 'nexus_tarefas_v4';
const STORAGE_NOTE      = (sem, discId) => `nexus_note_${sem}_${discId}`;
const STORAGE_CHECKLIST = (sem, discId) => `nexus_cl_${sem}_${discId}`;

/* ══════════════════════════════════════════════
   TAREFAS — STORAGE
   Estrutura: { [semestre]: { [discId]: Tarefa[] } }
══════════════════════════════════════════════ */
function _loadAllTarefas() {
  try {
    const raw = localStorage.getItem(STORAGE_TAREFAS);
    const data = raw ? JSON.parse(raw) : {};
    return typeof data === 'object' && data !== null ? data : {};
  } catch (_) { return {}; }
}

function _saveAllTarefas(data) {
  try { localStorage.setItem(STORAGE_TAREFAS, JSON.stringify(data)); }
  catch (_) { /* quota */ }
}

/* Garante que a estrutura semestre > discId existe */
function _ensureStructure(data, semestre, discId) {
  if (!data[semestre])         data[semestre] = {};
  if (!data[semestre][discId]) data[semestre][discId] = [];
}

/* Retorna lista de tarefas da disciplina ativa */
function _getTarefas(semestre, discId) {
  const data = _loadAllTarefas();
  _ensureStructure(data, semestre, discId);
  return data[semestre][discId];
}

/* Salva lista de tarefas de uma disciplina específica */
function _setTarefas(semestre, discId, tarefas) {
  const data = _loadAllTarefas();
  _ensureStructure(data, semestre, discId);
  data[semestre][discId] = tarefas;
  _saveAllTarefas(data);
}

/* ══════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  setPagina('PESSOAL');
  document.getElementById('footer-year').textContent  = new Date().getFullYear();
  document.getElementById('sidebar-year').textContent = new Date().getFullYear();

  try {
    const mod = await import('../quiz/disciplinas/disciplinas_cores.js');
    State.DISC_CORES = mod.DISC_CORES ?? {};
  } catch (_) {}

  try {
    const mod = await import('./checklist/checklist_data.js');
    State.checklistData = mod.CHECKLIST_ITENS ?? {};
  } catch (_) {}

  _resolverContexto();

  _renderSemestreSelector();
  _renderSidebar();
  _renderHeader();
  _renderClPanel();
  _renderTaskContainer();
  _updateProgress();
  _renderNotaAtual();

  _bindTabs();
  _bindAddTask();
  _bindNotes();
  _bindChecklist();
  _bindMobileDropdown();
});

/* ══════════════════════════════════════════════
   CONTEXTO
══════════════════════════════════════════════ */
function _resolverContexto() {
  const semestre    = getSemestreAtual();
  const lista       = getDisciplinasDeSemestre(semestre);
  State.semestre    = semestre;
  State.disciplinas = lista;

  const discId = getDisciplinaAtual();
  const disc   = (discId ? lista.find(d => d.id === discId) : null) ?? lista[0] ?? null;

  State.discAtiva       = disc;
  State.notaDiscId      = disc?.id ?? null;
  State.checklistDiscId = disc?.id ?? null;

  if (disc) { setDisciplina(disc.id); _aplicarCor(disc.id); }
}

function _aplicarCor(discId) {
  const cores = State.DISC_CORES[discId];
  if (!cores) return;
  const r = document.documentElement.style;
  r.setProperty('--disc-tema',     cores.corTema);
  r.setProperty('--disc-tema-rgb', cores.corTemaRgb);
  r.setProperty('--disc-tema2',    cores.corTema2 ?? cores.corTema);
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

  select.addEventListener('change', e => {
    _trocarSemestre(e.target.value);
  });

  wrap.appendChild(select);
}

function _trocarSemestre(novoSemestre) {
  setSemestre(novoSemestre);
  State.semestre    = novoSemestre;
  State.disciplinas = getDisciplinasDeSemestre(novoSemestre);

  /* Reseta disciplina ativa para a primeira do novo semestre */
  const primeiraDisc = State.disciplinas[0] ?? null;
  State.discAtiva       = primeiraDisc;
  State.notaDiscId      = primeiraDisc?.id ?? null;
  State.checklistDiscId = primeiraDisc?.id ?? null;

  if (primeiraDisc) {
    setDisciplina(primeiraDisc.id);
    _aplicarCor(primeiraDisc.id);
  }

  /* Re-renderiza tudo com o novo semestre */
  _renderSidebar();
  _renderHeader();
  _renderClPanel();
  _renderTaskContainer();
  _updateProgress();
  _renderNotaAtual();
}


function _bindTabs() {
  document.getElementById('main-tabs')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
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

  _updateHeroStat();
}

/* ══════════════════════════════════════════════
   HEADER & HERO
══════════════════════════════════════════════ */
function _renderHeader() {
  const disc = State.discAtiva;

  /* Breadcrumb central */
  const sub = document.getElementById('header-breadcrumb-sub');
  if (sub) sub.textContent = disc ? `· ${disc.nome}` : '';

  /* disc-badge no header__right (igual ao resumo) */
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

  /* Mobile label */
  const ml = document.getElementById('mobile-disc-label');
  if (ml) ml.textContent = disc
    ? `${disc.emoji} ${disc.apelido ?? _nomeCurto(disc.nome, 20)}`
    : 'Disciplina';

  /* Eyebrow hero */
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
    const discId = State.checklistDiscId;
    const disc   = _getClDisc(discId);
    if (!disc) { pill.style.display = 'none'; return; }
    const todos   = disc.categorias.flatMap(c => c.itens);
    const total   = todos.length;
    if (total === 0) { pill.style.display = 'none'; return; }
    const checked = _getCheckedIds(discId);
    const done    = todos.filter(i => checked.has(i.id)).length;
    pill.style.display = '';
    text.textContent = `${done} / ${total} itens`;

  } else if (State.abaAtiva === 'tarefa') {
    const tarefas   = _getTarefasAtivas();
    const total     = tarefas.length;
    const concluida = tarefas.filter(t => t.concluida).length;
    if (total === 0) { pill.style.display = 'none'; return; }
    pill.style.display = '';
    text.textContent = `${concluida} / ${total} tarefas`;

  } else {
    const discId = State.notaDiscId;
    const nota   = discId
      ? (localStorage.getItem(STORAGE_NOTE(State.semestre, discId)) ?? '')
      : '';
    const words = nota.trim() ? nota.trim().split(/\s+/).length : 0;
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
    const tarefas = _getTarefas(State.semestre, disc.id);
    const total   = tarefas.length;
    const done    = tarefas.filter(t => t.concluida).length;
    const pct     = total > 0 ? Math.round((done / total) * 100) : 0;
    const hasNota = !!(localStorage.getItem(STORAGE_NOTE(State.semestre, disc.id)) ?? '').trim();

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
    item.addEventListener('click', () => _trocarDisciplina(disc));
    list.appendChild(item);
  });
}

function _trocarDisciplina(disc) {
  State.discAtiva       = disc;
  State.notaDiscId      = disc.id;
  State.checklistDiscId = disc.id;
  setDisciplina(disc.id);
  _aplicarCor(disc.id);

  document.querySelectorAll('.disc-item').forEach(el => {
    const a = el.dataset.discId === disc.id;
    el.classList.toggle('disc-item--active', a);
    el.setAttribute('aria-current', a ? 'page' : 'false');
  });

  _renderHeader();
  _fecharMobileDropdown();

  if (State.abaAtiva === 'checklist') {
    _renderClPanel();
  } else if (State.abaAtiva === 'tarefa') {
    _renderTaskContainer();
    _updateProgress();
  } else if (State.abaAtiva === 'notas') {
    _renderNotaAtual();
  }
}

/* ══════════════════════════════════════════════
   TAREFAS — HELPER (disciplina ativa)
══════════════════════════════════════════════ */
function _getTarefasAtivas() {
  const { semestre, discAtiva } = State;
  if (!semestre || !discAtiva) return [];
  return _getTarefas(semestre, discAtiva.id);
}

function _salvarTarefasAtivas(tarefas) {
  const { semestre, discAtiva } = State;
  if (!semestre || !discAtiva) return;
  _setTarefas(semestre, discAtiva.id, tarefas);
}

/* ══════════════════════════════════════════════
   TAREFAS — PROGRESSO
══════════════════════════════════════════════ */
function _updateProgress() {
  const tarefas    = _getTarefasAtivas();
  const total      = tarefas.length;
  const concluidas = tarefas.filter(t => t.concluida).length;
  const pct        = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  const countEl = document.getElementById('progress-count');
  const fillEl  = document.getElementById('progress-fill');
  const hdrEl   = document.getElementById('header-progress-pill');
  const hdrText = document.getElementById('header-progress-text');

  if (countEl) countEl.innerHTML = `${concluidas} <span>/ ${total} tarefa${total !== 1 ? 's' : ''}</span>`;
  if (fillEl)  fillEl.style.width = `${pct}%`;

  if (hdrEl && hdrText) {
    hdrEl.style.display = total > 0 ? '' : 'none';
    if (total > 0) hdrText.textContent = `${concluidas} / ${total}`;
  }

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

  const tarefas = _getTarefasAtivas();

  if (tarefas.length === 0) {
    container.appendChild(_buildEmptyState());
    return;
  }

  tarefas.forEach((t, i) => container.appendChild(_buildTaskItem(t, i)));
}

function _buildEmptyState() {
  const div = document.createElement('div');
  div.className = 'tasks-empty';
  div.innerHTML = `
    <span class="tasks-empty__icon">✅</span>
    <p>Nenhuma tarefa ainda</p>
    <small>Use o campo acima para adicionar sua primeira tarefa.</small>`;
  return div;
}

function _buildTaskItem(tarefa, idx) {
  const item = document.createElement('div');
  item.className = `task-item task-item--priority-${tarefa.prioridade}${tarefa.concluida ? ' task-item--done' : ''}`;
  item.dataset.taskId = tarefa.id;
  item.style.animationDelay = `${idx * 0.05}s`;

  const dataFormatada = new Date(tarefa.dataCriacao).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short'
  });
  const labelPrioridade = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }[tarefa.prioridade] ?? '';

  item.innerHTML = `
    <div class="task-check" title="${tarefa.concluida ? 'Desmarcar' : 'Marcar como feita'}">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
           stroke="var(--teal)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
    <div class="task-body">
      <span class="task-text">${_esc(tarefa.texto)}</span>
      <div class="task-meta">
        <span class="task-priority">${labelPrioridade}</span>
        <span class="task-date">${dataFormatada}</span>
      </div>
    </div>
    <button class="task-delete" title="Excluir tarefa" aria-label="Excluir">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
      </svg>
    </button>`;

  item.querySelector('.task-check').addEventListener('click', e => {
    e.stopPropagation();
    _toggleTarefa(tarefa.id);
  });
  item.querySelector('.task-delete').addEventListener('click', e => {
    e.stopPropagation();
    _deletarTarefa(tarefa.id, item);
  });
  item.addEventListener('click', () => _toggleTarefa(tarefa.id));

  return item;
}

/* ══════════════════════════════════════════════
   TAREFAS — CRUD
══════════════════════════════════════════════ */
function _bindAddTask() {
  const input   = document.getElementById('add-task-input');
  const btn     = document.getElementById('add-task-btn');
  const selPrio = document.getElementById('task-priority-select');

  const add = () => {
    const texto = input?.value.trim();
    if (!texto) return;

    const tarefas = _getTarefasAtivas();
    const nova = {
      id:          _uid(),
      texto,
      prioridade:  selPrio?.value ?? 'media',
      concluida:   false,
      dataCriacao: Date.now(),
    };

    tarefas.unshift(nova);
    _salvarTarefasAtivas(tarefas);

    if (input) input.value = '';
    _renderTaskContainer();
    _updateProgress();
  };

  btn?.addEventListener('click', add);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
}

function _toggleTarefa(id) {
  const tarefas = _getTarefasAtivas();
  const t = tarefas.find(t => t.id === id);
  if (!t) return;

  t.concluida = !t.concluida;
  _salvarTarefasAtivas(tarefas);

  const item = document.querySelector(`[data-task-id="${id}"]`);
  if (item) {
    item.classList.toggle('task-item--done', t.concluida);
  }

  _updateProgress();
}

function _deletarTarefa(id, itemEl) {
  if (itemEl) {
    itemEl.style.transition = 'opacity 0.25s, transform 0.25s';
    itemEl.style.opacity    = '0';
    itemEl.style.transform  = 'translateX(16px)';
    setTimeout(() => _removerEAtualizar(id), 240);
  } else {
    _removerEAtualizar(id);
  }
}

function _removerEAtualizar(id) {
  const tarefas = _getTarefasAtivas().filter(t => t.id !== id);
  _salvarTarefasAtivas(tarefas);
  _renderTaskContainer();
  _updateProgress();
}

/* ══════════════════════════════════════════════
   CHECKLIST PRÉ-DEFINIDO
══════════════════════════════════════════════ */
function _getClDisc(discId) {
  return State.checklistData[State.semestre]?.[discId] ?? null;
}

function _getCheckedIds(discId) {
  try {
    const raw = localStorage.getItem(STORAGE_CHECKLIST(State.semestre, discId));
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (_) { return new Set(); }
}

function _saveCheckedIds(discId, set) {
  try {
    localStorage.setItem(
      STORAGE_CHECKLIST(State.semestre, discId),
      JSON.stringify([...set])
    );
  } catch (_) {}
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

  disc.categorias.forEach((cat, ci) => {
    const catDone  = cat.itens.filter(i => checked.has(i.id)).length;
    const catTotal = cat.itens.length;

    const section = document.createElement('div');
    section.className = 'cl-section';
    section.style.animationDelay = `${ci * 0.07}s`;
    section.innerHTML = `
      <div class="cl-section__header">
        <div class="cl-section__title">
          <span class="cl-section__icon">${cat.icone}</span>
          ${_esc(cat.nome)}
        </div>
        <span class="cl-section__badge">${catDone}/${catTotal}</span>
      </div>
      <div class="cl-items" id="cl-items-${ci}"></div>`;

    const itemsEl = section.querySelector('.cl-items');
    cat.itens.forEach((item, ii) => {
      const isChecked = checked.has(item.id);
      const el = document.createElement('label');
      el.className = `cl-item${isChecked ? ' cl-item--checked' : ''}`;
      el.style.animationDelay = `${(ci * 0.07) + (ii * 0.04)}s`;
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

    container.appendChild(section);
  });
}

function _updateClProgress(done, total) {
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0;
  const countEl = document.getElementById('cl-progress-count');
  const fillEl  = document.getElementById('cl-progress-fill');
  if (countEl) countEl.textContent = `${done} / ${total}`;
  if (fillEl)  fillEl.style.width  = `${pct}%`;
}

function _bindChecklist() {
  document.getElementById('cl-container')?.addEventListener('change', e => {
    const input = e.target.closest('.cl-item__input');
    if (!input) return;

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
  });

  document.getElementById('cl-reset-btn')?.addEventListener('click', () => {
    const discId = State.checklistDiscId;
    if (!discId) return;
    const disc = _getClDisc(discId);
    if (!disc) return;
    const total = disc.categorias.flatMap(c => c.itens).length;
    if (total === 0) return;
    if (!confirm('Desmarcar todos os itens desta disciplina?')) return;
    _saveCheckedIds(discId, new Set());
    _renderClPanel();
    _updateHeroStat();
  });
}

/* ══════════════════════════════════════════════
   ANOTAÇÕES
══════════════════════════════════════════════ */
function _renderNotaAtual() {
  const textarea = document.getElementById('note-textarea');
  const titleEl  = document.getElementById('note-box-title');
  if (!textarea) return;

  const discId = State.notaDiscId;
  const disc   = State.disciplinas.find(d => d.id === discId);
  const nota   = discId
    ? (localStorage.getItem(STORAGE_NOTE(State.semestre, discId)) ?? '')
    : '';

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

  document.getElementById('note-clear-btn')?.addEventListener('click', () => {
    if (!textarea.value.trim()) return;
    if (!confirm('Limpar todas as anotações desta disciplina?')) return;
    textarea.value = '';
    _salvarNotaAtual();
    _updateNoteStats();
  });
}

function _salvarNotaAtual() {
  const textarea = document.getElementById('note-textarea');
  const discId   = State.notaDiscId;
  if (!textarea || !discId) return;

  try {
    localStorage.setItem(STORAGE_NOTE(State.semestre, discId), textarea.value);
  } catch (_) {}

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
  document.getElementById('mobile-disc-btn')?.addEventListener('click', _abrirMobileDropdown);
  document.getElementById('mobile-dropdown-backdrop')?.addEventListener('click', _fecharMobileDropdown);
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