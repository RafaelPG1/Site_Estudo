/* =============================================
   NEXUS STUDY — checklist.js
   Lógica do checklist com localStorage
   ============================================= */

const STORAGE_KEY = 'nexus_checklist_v1';

/* ── PADRÃO — itens iniciais ── */
const DEFAULT_TASKS = [
  { id: uid(), text: 'Estudar aula do dia',        done: false },
  { id: uid(), text: 'Fazer exercícios práticos',  done: false },
  { id: uid(), text: 'Revisar conteúdo anterior',  done: false },
];

/* ─────────────────────────────────────────────
   ESTADO
───────────────────────────────────────────── */
let tasks = [];

/* ─────────────────────────────────────────────
   PERSISTÊNCIA
───────────────────────────────────────────── */
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : structuredClone(DEFAULT_TASKS);
  } catch {
    return structuredClone(DEFAULT_TASKS);
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn('[Nexus/checklist] Não foi possível salvar:', e);
  }
}

/* ─────────────────────────────────────────────
   UTILITÁRIOS
───────────────────────────────────────────── */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getProgress() {
  const done  = tasks.filter(t => t.done).length;
  const total = tasks.length;
  return { done, total };
}

/* ─────────────────────────────────────────────
   DOM — render
───────────────────────────────────────────── */
function renderList() {
  const list = document.getElementById('checklist-list');
  if (!list) return;

  list.innerHTML = '';

  if (tasks.length === 0) {
    list.innerHTML = '<li class="checklist-empty">Nenhuma tarefa ainda. Adicione uma! 🎯</li>';
    updateProgress();
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `checklist-item${task.done ? ' checklist-item--done' : ''}`;
    li.dataset.id = task.id;
    li.innerHTML = `
      <input
        type="checkbox"
        class="item-checkbox"
        id="chk-${task.id}"
        ${task.done ? 'checked' : ''}
        aria-label="${escapeHtml(task.text)}"
      />
      <label class="item-label" for="chk-${task.id}">${escapeHtml(task.text)}</label>
      <button class="item-delete" data-id="${task.id}" aria-label="Remover tarefa" title="Remover">✕</button>
    `;
    list.appendChild(li);
  });

  updateProgress();
}

function updateProgress() {
  const el = document.getElementById('checklist-progress');
  if (!el) return;
  const { done, total } = getProgress();
  el.textContent = `${done} / ${total} concluída${done !== 1 ? 's' : ''}`;
}

/* ─────────────────────────────────────────────
   AÇÕES
───────────────────────────────────────────── */
function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return false;
  tasks.push({ id: uid(), text: trimmed, done: false });
  saveTasks();
  renderList();
  return true;
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  saveTasks();

  /* Animação suave sem re-render completo */
  const li = document.querySelector(`.checklist-item[data-id="${id}"]`);
  if (li) {
    li.classList.toggle('checklist-item--done', task.done);
  }
  updateProgress();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();

  const li = document.querySelector(`.checklist-item[data-id="${id}"]`);
  if (li) {
    li.style.transition = 'opacity 0.2s, transform 0.2s';
    li.style.opacity    = '0';
    li.style.transform  = 'translateX(12px)';
    li.addEventListener('transitionend', () => {
      renderList(); // re-render after animation
    }, { once: true });
  }
}

function clearDone() {
  const doneBefore = tasks.filter(t => t.done).length;
  if (doneBefore === 0) return 0;
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  renderList();
  return doneBefore;
}

/* ─────────────────────────────────────────────
   PAINEL TOGGLE
───────────────────────────────────────────── */
function togglePanel() {
  const panel = document.getElementById('checklist-panel');
  const btn   = document.getElementById('btn-toggle-checklist');
  if (!panel || !btn) return;

  const isOpen = !panel.hidden;

  if (isOpen) {
    panel.style.animation = 'none';
    panel.style.opacity   = '0';
    panel.style.transform = 'translateY(-8px)';
    panel.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    setTimeout(() => {
      panel.hidden = true;
      panel.style.cssText = '';
    }, 200);
    btn.setAttribute('aria-expanded', 'false');
  } else {
    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    renderList();
  }
}

/* ─────────────────────────────────────────────
   ESCAPE HTML
───────────────────────────────────────────── */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ─────────────────────────────────────────────
   TOAST (re-usa o do pessoal.js se disponível)
───────────────────────────────────────────── */
function showToast(msg) {
  if (typeof window.nexusToast === 'function') {
    window.nexusToast(msg);
    return;
  }
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('toast--show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('toast--show'), 2500);
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
function initChecklist() {
  tasks = loadTasks();

  /* Toggle painel */
  document.getElementById('btn-toggle-checklist')
    ?.addEventListener('click', togglePanel);

  /* Enter no input */
  document.getElementById('checklist-new-input')
    ?.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const input = e.currentTarget;
        const ok = addTask(input.value);
        if (ok) { input.value = ''; showToast('Tarefa adicionada!'); }
      }
    });

  /* Botão adicionar */
  document.getElementById('btn-add-task')
    ?.addEventListener('click', () => {
      const input = document.getElementById('checklist-new-input');
      if (!input) return;
      const ok = addTask(input.value);
      if (ok) { input.value = ''; showToast('Tarefa adicionada!'); }
    });

  /* Delegação de eventos na lista */
  document.getElementById('checklist-list')
    ?.addEventListener('change', e => {
      if (e.target.classList.contains('item-checkbox')) {
        const id = e.target.closest('.checklist-item')?.dataset.id;
        if (id) toggleTask(id);
      }
    });

  document.getElementById('checklist-list')
    ?.addEventListener('click', e => {
      const delBtn = e.target.closest('.item-delete');
      if (delBtn) {
        deleteTask(delBtn.dataset.id);
        showToast('Tarefa removida.');
      }
    });

  /* Limpar concluídas */
  document.getElementById('btn-clear-done')
    ?.addEventListener('click', () => {
      const removed = clearDone();
      showToast(removed > 0 ? `${removed} tarefa${removed !== 1 ? 's' : ''} removida${removed !== 1 ? 's' : ''}.` : 'Nenhuma concluída para remover.');
    });
}

/* Exportar para uso externo (futuro Firebase) */
export { initChecklist, addTask, toggleTask, deleteTask, clearDone, loadTasks, saveTasks, tasks };

/* Auto-init quando DOM pronto */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChecklist);
} else {
  initChecklist();
}