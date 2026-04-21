/* ═══════════════════════════════════════════════════
   NEXUS STUDY — anotacoes.js
   Sistema de anotações: autosave, contagem, modal
   Persistência: localStorage
   Pronto para migrar ao Firebase (exporta API pura)
   ═══════════════════════════════════════════════════ */

/* ── Chaves e timings ── */
const STORAGE_KEY    = 'nexus_notes_v1';
const AUTOSAVE_MS    = 750;  /* delay após última tecla */
const STATUS_HIDE_MS = 3200; /* esconder status "Salvo" */

/* ─────────────────────────────────────────────────────
   PERSISTÊNCIA  (API exportável → Firebase ready)
───────────────────────────────────────────────────── */
export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { content: '', updatedAt: null };
    const data = JSON.parse(raw);
    return {
      content:   data.content   || '',
      updatedAt: data.updatedAt || null,
    };
  } catch {
    return { content: '', updatedAt: null };
  }
}

export function saveNotes(content) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      content,
      updatedAt: new Date().toISOString(),
    }));
    return true;
  } catch (e) {
    console.warn('[Nexus/notes] saveNotes:', e);
    return false;
  }
}

export function clearNotes() {
  try { localStorage.removeItem(STORAGE_KEY); return true; }
  catch { return false; }
}

/* ─────────────────────────────────────────────────────
   STATUS BAR
───────────────────────────────────────────────────── */
const S = {
  idle:   { cls: '',                   label: 'Aguardando' },
  saving: { cls: 'save-status--saving', label: 'Salvando…' },
  saved:  { cls: 'save-status--saved',  label: 'Salvo ✓'   },
  error:  { cls: '',                   label: 'Erro ao salvar' },
};

let statusTimer = null;

function setStatus(state) {
  const wrap  = document.getElementById('save-status');
  const label = document.getElementById('save-label');
  if (!wrap || !label) return;
  wrap.className  = `save-status ${state.cls}`.trim();
  label.textContent = state.label;
}

function statusSaved() {
  setStatus(S.saved);
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => setStatus(S.idle), STATUS_HIDE_MS);
}

/* ─────────────────────────────────────────────────────
   WORD COUNT
───────────────────────────────────────────────────── */
function updateWordCount(text) {
  const el    = document.getElementById('notes-wordcount');
  if (!el) return;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  el.textContent =
    `${words} palavra${words !== 1 ? 's' : ''} · ${chars} caractere${chars !== 1 ? 's' : ''}`;
}

/* ─────────────────────────────────────────────────────
   AUTO-SAVE  (debounce)
───────────────────────────────────────────────────── */
let autosaveTimer = null;
let isDirty       = false;

function scheduleAutosave(content) {
  isDirty = true;
  setStatus(S.saving);
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    const ok = saveNotes(content);
    isDirty   = false;
    ok ? statusSaved() : setStatus(S.error);
  }, AUTOSAVE_MS);
}

/* ─────────────────────────────────────────────────────
   SALVAR MANUAL
───────────────────────────────────────────────────── */
function manualSave() {
  const ta = document.getElementById('notes-textarea');
  if (!ta) return;
  clearTimeout(autosaveTimer);
  isDirty = false;
  const ok = saveNotes(ta.value);
  ok ? (statusSaved(), toast('Anotações salvas!'))
     : toast('Erro ao salvar. Tente novamente.');
}

/* ─────────────────────────────────────────────────────
   MODAL  (confirmação ao limpar)
───────────────────────────────────────────────────── */
function openModal()  { document.getElementById('modal-backdrop')?.classList.add('modal-backdrop--open'); }
function closeModal() { document.getElementById('modal-backdrop')?.classList.remove('modal-backdrop--open'); }

/* ─────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────── */
function toast(msg) {
  const el = document.getElementById('nexus-toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('nexus-toast--show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('nexus-toast--show'), 2600);
}

/* ─────────────────────────────────────────────────────
   SALVAR AO SAIR DA ABA / FECHAR
───────────────────────────────────────────────────── */
function flushIfDirty() {
  if (!isDirty) return;
  const ta = document.getElementById('notes-textarea');
  if (ta) { saveNotes(ta.value); isDirty = false; }
}

/* ─────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────── */
function init() {
  /* Footer year */
  const fy = document.getElementById('footer-year');
  if (fy) fy.textContent = new Date().getFullYear();

  /* Carregar notas salvas */
  const { content } = loadNotes();
  const ta = document.getElementById('notes-textarea');
  if (ta) {
    ta.value = content;
    updateWordCount(content);
    setStatus(content ? S.saved : S.idle);
    if (content) statusTimer = setTimeout(() => setStatus(S.idle), STATUS_HIDE_MS);

    /* Input → autosave + contagem */
    ta.addEventListener('input', () => {
      updateWordCount(ta.value);
      scheduleAutosave(ta.value);
    });
  }

  /* Botão Salvar */
  document.getElementById('btn-save')?.addEventListener('click', manualSave);

  /* Botão Limpar → abre modal */
  document.getElementById('btn-clear')?.addEventListener('click', openModal);

  /* Modal: cancelar */
  document.getElementById('btn-modal-cancel')?.addEventListener('click', closeModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', e => {
    if (e.target === document.getElementById('modal-backdrop')) closeModal();
  });

  /* Modal: confirmar limpar */
  document.getElementById('btn-modal-confirm')?.addEventListener('click', () => {
    clearNotes();
    if (ta) { ta.value = ''; updateWordCount(''); }
    isDirty = false;
    clearTimeout(autosaveTimer);
    setStatus(S.idle);
    closeModal();
    toast('Anotações apagadas.');
  });

  /* Ctrl/Cmd + S */
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      manualSave();
    }
    /* Esc fecha modal */
    if (e.key === 'Escape') closeModal();
  });

  /* Salvar ao mudar de aba ou fechar */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) flushIfDirty();
  });
  window.addEventListener('pagehide',     flushIfDirty);
  window.addEventListener('beforeunload', flushIfDirty);
}

/* Auto-init */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}