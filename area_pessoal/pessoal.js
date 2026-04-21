/* =============================================
   NEXUS STUDY — pessoal.js
   Lógica da Área Pessoal
   ============================================= */

import './checklist.js'; // garante que o checklist inicializa

const NOTES_KEY = 'nexus_notes_v1';

/* ─────────────────────────────────────────────
   TOAST GLOBAL
───────────────────────────────────────────── */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('toast--show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('toast--show'), 2600);
}

/* Disponibiliza globalmente para checklist.js */
window.nexusToast = showToast;

/* ─────────────────────────────────────────────
   PREVIEW DE ANOTAÇÕES
───────────────────────────────────────────── */
function renderNotesPreview() {
  const el = document.getElementById('notes-preview');
  if (!el) return;

  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      const text = (data.content || '').trim();
      if (text) {
        el.innerHTML = ''; // limpa "vazio"
        const p = document.createElement('span');
        p.style.color = 'var(--text-2)';
        p.textContent = text.slice(0, 180);
        el.appendChild(p);
        return;
      }
    }
  } catch { /* noop */ }

  el.innerHTML = '<span class="preview-empty">Nenhuma anotação ainda…</span>';
}

/* ─────────────────────────────────────────────
   FOOTER ANO
───────────────────────────────────────────── */
function renderFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderFooterYear();
  renderNotesPreview();
});