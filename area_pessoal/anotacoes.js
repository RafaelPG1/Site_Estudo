/* =============================================
   NEXUS STUDY — anotacoes.js
   Sistema de anotações com autosave
   ============================================= */

/* ─────────────────────────────────────────────
   CONSTANTES
───────────────────────────────────────────── */
const STORAGE_KEY    = 'nexus_notes_v1';
const AUTOSAVE_DELAY = 800;   // ms após última tecla
const SAVE_TIMEOUT   = 3000;  // ms para esconder status "Salvo"

/* ─────────────────────────────────────────────
   ESTADO
───────────────────────────────────────────── */
let autosaveTimer  = null;
let statusTimer    = null;
let isDirty        = false;

/* ─────────────────────────────────────────────
   PERSISTÊNCIA
   Estrutura salva: { content: string, updatedAt: ISO string }
───────────────────────────────────────────── */
function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { content: '', updatedAt: null };
    const data = JSON.parse(raw);
    return { content: data.content || '', updatedAt: data.updatedAt || null };
  } catch {
    return { content: '', updatedAt: null };
  }
}

function saveNotes(content) {
  try {
    const data = { content, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    isDirty = false;
    return true;
  } catch (e) {
    console.warn('[Nexus/notes] Erro ao salvar:', e);
    return false;
  }
}

function clearNotes() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/* ─────────────────────────────────────────────
   STATUS BAR
───────────────────────────────────────────── */
const STATUS_IDLE   = { cls: '',              label: 'Aguardando…' };
const STATUS_SAVING = { cls: 'notes-save-status--saving', label: 'Salvando…' };
const STATUS_SAVED  = { cls: 'notes-save-status--saved',  label: 'Salvo ✓' };
const STATUS_ERR    = { cls: '',              label: 'Erro ao salvar' };

function setStatus(state) {
  const wrap  = document.getElementById('save-status');
  const label = document.getElementById('save-label');
  if (!wrap || !label) return;

  wrap.className = `notes-save-status ${state.cls}`.trim();
  label.textContent = state.label;
}

/* ─────────────────────────────────────────────
   WORD / CHAR COUNT
───────────────────────────────────────────── */
function updateWordCount(text) {
  const el    = document.getElementById('notes-wordcount');
  if (!el) return;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  el.textContent = `${words} palavra${words !== 1 ? 's' : ''} · ${chars} caractere${chars !== 1 ? 's' : ''}`;
}

/* ─────────────────────────────────────────────
   AUTO-SAVE
───────────────────────────────────────────── */
function scheduleAutosave(content) {
  isDirty = true;
  setStatus(STATUS_SAVING);

  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    const ok = saveNotes(content);

    if (ok) {
      setStatus(STATUS_SAVED);
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => setStatus(STATUS_IDLE), SAVE_TIMEOUT);
    } else {
      setStatus(STATUS_ERR);
    }
  }, AUTOSAVE_DELAY);
}

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('toast--show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('toast--show'), 2600);
}

/* ─────────────────────────────────────────────
   MODAL CONFIRM (limpar)
───────────────────────────────────────────── */
function openConfirmModal() {
  const m = document.getElementById('modal-confirm');
  if (!m) return;
  m.classList.add('modal--open');
}

function closeConfirmModal() {
  const m = document.getElementById('modal-confirm');
  if (!m) return;
  m.classList.remove('modal--open');
}

/* ─────────────────────────────────────────────
   SALVAR MANUAL
───────────────────────────────────────────── */
function manualSave() {
  const ta = document.getElementById('notes-textarea');
  if (!ta) return;

  clearTimeout(autosaveTimer);
  const ok = saveNotes(ta.value);

  if (ok) {
    setStatus(STATUS_SAVED);
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => setStatus(STATUS_IDLE), SAVE_TIMEOUT);
    showToast('Anotações salvas!');
  } else {
    showToast('Erro ao salvar. Tente novamente.');
  }
}

/* ─────────────────────────────────────────────
   SALVAR AO SAIR DA ABA
───────────────────────────────────────────── */
function handleVisibilityChange() {
  if (document.hidden && isDirty) {
    const ta = document.getElementById('notes-textarea');
    if (ta) saveNotes(ta.value);
  }
}

function handleBeforeUnload(e) {
  if (isDirty) {
    const ta = document.getElementById('notes-textarea');
    if (ta) saveNotes(ta.value);
    // Não mostramos dialog — salvamos silenciosamente
  }
}

/* ─────────────────────────────────────────────
   ATALHOS DE TECLADO
───────────────────────────────────────────── */
function handleKeydown(e) {
  /* Ctrl/Cmd + S — salvar */
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    manualSave();
  }
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
function init() {
  /* Footer year */
  const fyEl = document.getElementById('footer-year');
  if (fyEl) fyEl.textContent = new Date().getFullYear();

  /* Carregar notas */
  const { content, updatedAt } = loadNotes();
  const ta = document.getElementById('notes-textarea');
  if (ta) {
    ta.value = content;
    updateWordCount(content);

    if (content) {
      setStatus(STATUS_SAVED);
      statusTimer = setTimeout(() => setStatus(STATUS_IDLE), SAVE_TIMEOUT);
    } else {
      setStatus(STATUS_IDLE);
    }

    /* Input → autosave */
    ta.addEventListener('input', () => {
      updateWordCount(ta.value);
      scheduleAutosave(ta.value);
    });
  }

  /* Botão salvar manual */
  document.getElementById('btn-save-notes')
    ?.addEventListener('click', manualSave);

  /* Botão limpar */
  document.getElementById('btn-clear-notes')
    ?.addEventListener('click', openConfirmModal);

  /* Modal — cancelar */
  document.getElementById('btn-cancel-clear')
    ?.addEventListener('click', closeConfirmModal);

  document.getElementById('modal-overlay-confirm')
    ?.addEventListener('click', closeConfirmModal);

  /* Modal — confirmar limpar */
  document.getElementById('btn-confirm-clear')
    ?.addEventListener('click', () => {
      clearNotes();
      if (ta) {
        ta.value = '';
        updateWordCount('');
      }
      isDirty = false;
      clearTimeout(autosaveTimer);
      setStatus(STATUS_IDLE);
      closeConfirmModal();
      showToast('Anotações apagadas.');
    });

  /* Atalhos */
  document.addEventListener('keydown', handleKeydown);

  /* Salvar ao mudar de aba / fechar */
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', handleBeforeUnload);
}

/* ─────────────────────────────────────────────
   EXPORTAR (futuro Firebase)
───────────────────────────────────────────── */
export { loadNotes, saveNotes, clearNotes };

/* Auto-init */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}