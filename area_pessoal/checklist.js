/* ═══════════════════════════════════════════════════
   NEXUS STUDY — checklist.js
   Sistema completo de checklist
   Persistência: localStorage
   Pronto para migrar ao Firebase (exporta API pura)
   ═══════════════════════════════════════════════════ */

/* ── Storage key ── */
const KEY = 'nexus_checklist_v1';

/* ── Circunferência do ring (r=19) ── */
const RING_CIRC = 2 * Math.PI * 19; // ≈ 119.38

/* ─────────────────────────────────────────────────────
   ESTADO
───────────────────────────────────────────────────── */
let tasks        = [];
let activeFilter = 'all'; // 'all' | 'active' | 'done'

/* ─────────────────────────────────────────────────────
   UTILITÁRIOS
───────────────────────────────────────────────────── */
function uid() {
  return `t_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function escHtml(s) {
  return s
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ─────────────────────────────────────────────────────
   PERSISTÊNCIA
───────────────────────────────────────────────────── */
const DEFAULT_TASKS = [
  { id: uid(), text: 'Estudar aula do dia',       done: false, createdAt: Date.now() },
  { id: uid(), text: 'Fazer exercícios práticos', done: false, createdAt: Date.now() },
  { id: uid(), text: 'Revisar conteúdo anterior', done: false, createdAt: Date.now() },
];

export function loadTasks() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_TASKS);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : structuredClone(DEFAULT_TASKS);
  } catch { return structuredClone(DEFAULT_TASKS); }
}

export function saveTasks(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); }
  catch (e) { console.warn('[Nexus/checklist] saveTasks:', e); }
}

/* ─────────────────────────────────────────────────────
   API PURA  (fácil de trocar pelo Firebase depois)
───────────────────────────────────────────────────── */
export function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const task = { id: uid(), text: trimmed, done: false, createdAt: Date.now() };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

export function toggleTask(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return false;
  t.done = !t.done;
  saveTasks(tasks);
  return t.done;
}

export function deleteTask(id) {
  const idx = tasks.findIndex(x => x.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  saveTasks(tasks);
  return true;
}

export function clearDone() {
  const removed = tasks.filter(x => x.done).length;
  tasks = tasks.filter(x => !x.done);
  saveTasks(tasks);
  return removed;
}

export function getStats() {
  const total = tasks.length;
  const done  = tasks.filter(x => x.done).length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, pending: total - done, pct };
}

/* ─────────────────────────────────────────────────────
   FILTRO
───────────────────────────────────────────────────── */
function getVisible() {
  if (activeFilter === 'active') return tasks.filter(x => !x.done);
  if (activeFilter === 'done')   return tasks.filter(x =>  x.done);
  return tasks;
}

/* ─────────────────────────────────────────────────────
   DOM — PROGRESS
───────────────────────────────────────────────────── */
function updateProgress() {
  const { total, done, pending, pct } = getStats();

  /* Ring */
  const fill = document.getElementById('ring-fill');
  if (fill) {
    const offset = RING_CIRC - (pct / 100) * RING_CIRC;
    fill.style.strokeDashoffset = offset;
  }

  /* Percentage text */
  const pctEl = document.getElementById('ring-pct');
  if (pctEl) pctEl.textContent = `${pct}%`;

  /* Fraction */
  document.getElementById('done-count')?.setAttribute('data-val', done);
  const doneEl  = document.getElementById('done-count');
  const totalEl = document.getElementById('total-count');
  if (doneEl)  doneEl.textContent  = done;
  if (totalEl) totalEl.textContent = total;

  /* Linear bar */
  const barFill = document.getElementById('cl-bar-fill');
  if (barFill) barFill.style.width = `${pct}%`;

  /* ARIA */
  const bar = document.getElementById('cl-progressbar');
  if (bar) bar.setAttribute('aria-valuenow', pct);

  /* Foot info */
  const footInfo = document.getElementById('cl-foot-info');
  if (footInfo) {
    footInfo.textContent = pending === 0 && total > 0
      ? '✓ Tudo concluído!'
      : `${pending} pendente${pending !== 1 ? 's' : ''}`;
  }
}

/* ─────────────────────────────────────────────────────
   DOM — LIST
───────────────────────────────────────────────────── */
function renderList() {
  const list = document.getElementById('cl-list');
  if (!list) return;

  const visible = getVisible();
  list.innerHTML = '';

  if (visible.length === 0) {
    const li = document.createElement('li');
    li.className = 'cl-empty';
    li.textContent = activeFilter === 'done'
      ? 'Nenhuma tarefa concluída ainda.'
      : activeFilter === 'active'
      ? 'Todas as tarefas foram concluídas! 🎉'
      : 'Adicione sua primeira tarefa acima 🎯';
    list.appendChild(li);
    return;
  }

  visible.forEach((task, idx) => {
    const li = document.createElement('li');
    li.className = `cl-item${task.done ? ' cl-item--done' : ''}`;
    li.dataset.id = task.id;
    li.style.animationDelay = `${idx * 0.04}s`;

    li.innerHTML = `
      <input
        type="checkbox"
        class="cl-checkbox"
        id="chk-${task.id}"
        ${task.done ? 'checked' : ''}
        aria-label="${escHtml(task.text)}"
      />
      <label class="cl-item__text" for="chk-${task.id}">${escHtml(task.text)}</label>
      <button
        class="cl-item__del"
        data-id="${task.id}"
        aria-label="Remover tarefa"
        title="Remover"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6"  y1="6" x2="18" y2="18"/>
        </svg>
      </button>`;

    list.appendChild(li);
  });

  updateProgress();
}

/* ─────────────────────────────────────────────────────
   DOM — FILTER BUTTONS
───────────────────────────────────────────────────── */
function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('.cl-filter').forEach(btn => {
    btn.classList.toggle('cl-filter--active', btn.dataset.filter === filter);
  });
  renderList();
}

/* ─────────────────────────────────────────────────────
   TOAST  (usa window.nexusToast se disponível)
───────────────────────────────────────────────────── */
function toast(msg) {
  if (typeof window.nexusToast === 'function') { window.nexusToast(msg); return; }
  const el = document.getElementById('nexus-toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('nexus-toast--show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('nexus-toast--show'), 2500);
}

/* ─────────────────────────────────────────────────────
   ADD TASK (helper com feedback)
───────────────────────────────────────────────────── */
function handleAdd() {
  const input = document.getElementById('cl-new-input');
  if (!input) return;
  const task = addTask(input.value);
  if (task) {
    input.value = '';
    if (activeFilter === 'done') setFilter('all');
    else renderList();
    toast('Tarefa adicionada!');
  } else {
    input.focus();
    input.style.borderColor = 'rgba(232,122,154,.5)';
    setTimeout(() => (input.style.borderColor = ''), 900);
  }
}

/* ─────────────────────────────────────────────────────
   DELETE  (com animação de saída)
───────────────────────────────────────────────────── */
function handleDelete(id) {
  const li = document.querySelector(`.cl-item[data-id="${id}"]`);
  if (li) {
    li.classList.add('cl-item--removing');
    li.addEventListener('transitionend', () => {
      deleteTask(id);
      renderList();
    }, { once: true });
  } else {
    deleteTask(id);
    renderList();
  }
  toast('Tarefa removida.');
}

/* ─────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────── */
export function initChecklist() {
  tasks = loadTasks();
  renderList();

  /* ── Botão adicionar ── */
  document.getElementById('cl-add-btn')
    ?.addEventListener('click', handleAdd);

  /* ── Enter no input ── */
  document.getElementById('cl-new-input')
    ?.addEventListener('keydown', e => { if (e.key === 'Enter') handleAdd(); });

  /* ── Delegação na lista (toggle + delete) ── */
  document.getElementById('cl-list')?.addEventListener('click', e => {
    /* Delete */
    const delBtn = e.target.closest('.cl-item__del');
    if (delBtn) { handleDelete(delBtn.dataset.id); return; }

    /* Toggle ao clicar no item (exceto no del) */
    const item = e.target.closest('.cl-item');
    if (item && !e.target.classList.contains('cl-item__del')) {
      const id = item.dataset.id;
      toggleTask(id);
      /* Atualiza visualmente sem re-render completo */
      const chk = item.querySelector('.cl-checkbox');
      const task = tasks.find(x => x.id === id);
      if (chk && task) {
        chk.checked = task.done;
        item.classList.toggle('cl-item--done', task.done);
      }
      updateProgress();
      /* Se filtro ativo não mostra este item, re-render após delay */
      if (activeFilter !== 'all') {
        setTimeout(renderList, 350);
      }
    }
  });

  /* ── Filtros ── */
  document.getElementById('cl-filters')?.addEventListener('click', e => {
    const btn = e.target.closest('.cl-filter');
    if (btn) setFilter(btn.dataset.filter);
  });

  /* ── Limpar concluídas ── */
  document.getElementById('cl-clear-done')?.addEventListener('click', () => {
    const removed = clearDone();
    renderList();
    toast(removed > 0
      ? `${removed} tarefa${removed !== 1 ? 's' : ''} removida${removed !== 1 ? 's' : ''}.`
      : 'Nenhuma concluída para remover.'
    );
  });
}

/* Auto-init */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChecklist);
} else {
  initChecklist();
}