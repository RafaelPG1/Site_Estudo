/* ============================================================
   NOTED — script.js  v3
   Editor de anotações focado em escrita.
   Sem categorias, tags ou sistemas de organização.
   ============================================================ */

'use strict';

/* ============================================================
   ARMAZENAMENTO
============================================================ */

const STORE_KEY = 'noted_v3';

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map(migrate);
  } catch (e) {
    console.error('Erro ao carregar notas:', e);
    return [];
  }
}

function save(notes) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(notes));
  } catch (e) {
    notify('Erro ao salvar. Armazenamento cheio?', 'err');
  }
}

function migrate(n) {
  return {
    id:         n.id         || uid(),
    title:      n.title      || 'Sem título',
    content:    n.content    || '',
    createdAt:  n.createdAt  || new Date().toISOString(),
    modifiedAt: n.modifiedAt || new Date().toISOString(),
  };
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ============================================================
   ESTADO
============================================================ */

const S = {
  notes:       load(),
  currentId:   null,
  dirty:       false,
  saveTimer:   null,
  query:       '',
};

/* ============================================================
   DOM HELPERS
============================================================ */

const $ = id => document.getElementById(id);
const el = tag => document.createElement(tag);

/* ============================================================
   FILTRO
============================================================ */

function filtered() {
  if (!S.query) return S.notes;
  const q = S.query.toLowerCase();
  return S.notes.filter(n =>
    n.title.toLowerCase().includes(q) ||
    n.content.replace(/<[^>]+>/g, '').toLowerCase().includes(q)
  );
}

/* ============================================================
   RENDERIZAÇÃO — LISTA
============================================================ */

function renderList() {
  const list  = $('notes-list');
  const notes = filtered();

  if (notes.length === 0) {
    list.innerHTML = `<div class="notes-empty">${S.query ? 'Nenhum resultado.' : 'Nenhuma anotação.'}</div>`;
    return;
  }

  list.innerHTML = '';
  notes.forEach(n => list.appendChild(buildCard(n)));
}

function buildCard(n) {
  const card    = el('div');
  card.className = `note-card${n.id === S.currentId ? ' active' : ''}`;
  card.setAttribute('role', 'listitem');
  card.dataset.id = n.id;

  const preview = n.content.replace(/<[^>]+>/g, '').trim().slice(0, 60);

  card.innerHTML = `
    <div class="nc-title">${esc(n.title || 'Sem título')}</div>
    ${preview ? `<div class="nc-preview">${esc(preview)}</div>` : ''}
    <div class="nc-date">${relDate(n.modifiedAt)}</div>
  `;

  card.addEventListener('click', () => selectNote(n.id));

  // Right-click context menu
  card.addEventListener('contextmenu', e => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, n.id);
  });

  return card;
}

/* ============================================================
   CONTEXTO MENU
============================================================ */

function showContextMenu(x, y, id) {
  closeContextMenu();

  const menu = el('div');
  menu.id = 'ctx-menu';
  menu.className = 'dropdown-ctx';
  menu.style.cssText = `
    position:fixed; left:${x}px; top:${y}px; z-index:600;
    background:var(--bg-card); border:1px solid var(--line-strong);
    border-radius:var(--r); padding:.3rem; min-width:160px;
    box-shadow:0 8px 24px rgba(0,0,0,.5);
    animation:fadein .12s ease;
  `;

  const items = [
    { label: 'Duplicar',  action: () => duplicateNote(id) },
    { divider: true },
    { label: 'Excluir',   action: () => askDelete(id), danger: true },
  ];

  items.forEach(item => {
    if (item.divider) {
      const d = el('div');
      d.style.cssText = 'height:1px;background:var(--line);margin:.3rem 0;';
      menu.appendChild(d);
      return;
    }
    const btn = el('button');
    btn.style.cssText = `
      display:block; width:100%; padding:.45rem .7rem;
      background:none; border:none; text-align:left;
      font-family:'Inter',sans-serif; font-size:.8rem;
      color:${item.danger ? 'var(--err)' : 'var(--tx-2)'};
      cursor:pointer; border-radius:5px; transition:background .12s;
    `;
    btn.textContent = item.label;
    btn.onmouseenter = () => btn.style.background = 'var(--bg-card-hov)';
    btn.onmouseleave = () => btn.style.background = 'none';
    btn.addEventListener('click', () => { item.action(); closeContextMenu(); });
    menu.appendChild(btn);
  });

  document.body.appendChild(menu);

  // Reposition if overflowing
  requestAnimationFrame(() => {
    const r = menu.getBoundingClientRect();
    if (r.right  > window.innerWidth)  menu.style.left = `${x - r.width}px`;
    if (r.bottom > window.innerHeight) menu.style.top  = `${y - r.height}px`;
  });

  setTimeout(() => {
    document.addEventListener('click', closeContextMenu, { once: true });
  }, 10);
}

function closeContextMenu() {
  const m = document.getElementById('ctx-menu');
  if (m) m.remove();
}

/* ============================================================
   ABRIR NOTA
============================================================ */

function selectNote(id) {
  // Salvar nota atual antes de trocar
  if (S.dirty) flushSave();

  const note = find(id);
  if (!note) return;

  S.currentId = id;
  S.dirty     = false;

  $('empty-state').classList.add('hidden');
  $('editor-wrap').classList.remove('hidden');

  $('note-title').value      = note.title;
  $('editor').innerHTML      = note.content;
  $('tb-block').value        = 'p';

  updateMeta(note);
  setStatus('saved');
  updateWordCount();
  updateToolbarState();
  markActiveCard();
}

function markActiveCard() {
  document.querySelectorAll('.note-card').forEach(c =>
    c.classList.toggle('active', c.dataset.id === S.currentId)
  );
}

function find(id) {
  return S.notes.find(n => n.id === id) || null;
}

/* ============================================================
   NOVA NOTA
============================================================ */

function newNote() {
  if (S.dirty) flushSave();

  const note = migrate({ id: uid(), createdAt: new Date().toISOString() });
  S.notes.unshift(note);
  save(S.notes);
  renderList();
  selectNote(note.id);
  $('note-title').focus();
  notify('Nova anotação criada', 'ok');
}

/* ============================================================
   SALVAR
============================================================ */

function scheduleSave() {
  S.dirty = true;
  setStatus('unsaved');
  clearTimeout(S.saveTimer);
  S.saveTimer = setTimeout(flushSave, 700);
}

function flushSave() {
  if (!S.currentId) return;
  const note = find(S.currentId);
  if (!note) return;

  setStatus('saving');

  note.title      = $('note-title').value.trim() || 'Sem título';
  note.content    = $('editor').innerHTML;
  note.modifiedAt = new Date().toISOString();

  save(S.notes);
  S.dirty = false;

  updateMeta(note);
  renderList();      // refresh card preview + date
  markActiveCard();

  // Pequeno delay para mostrar "Salvando..."
  setTimeout(() => setStatus('saved'), 300);
}

/* ============================================================
   DUPLICAR / EXCLUIR
============================================================ */

function duplicateNote(id) {
  const note = find(id);
  if (!note) return;

  const dup = migrate({
    ...JSON.parse(JSON.stringify(note)),
    id:        uid(),
    title:     note.title + ' (cópia)',
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
  });

  const idx = S.notes.findIndex(n => n.id === id);
  S.notes.splice(idx + 1, 0, dup);
  save(S.notes);
  renderList();
  selectNote(dup.id);
  notify('Nota duplicada', 'ok');
}

let pendingDelete = null;

function askDelete(id) {
  pendingDelete = id;
  $('modal-delete').classList.remove('hidden');
}

function doDelete() {
  if (!pendingDelete) return;
  const id  = pendingDelete;
  const idx = S.notes.findIndex(n => n.id === id);
  if (idx === -1) return;

  S.notes.splice(idx, 1);
  save(S.notes);

  if (S.currentId === id) {
    S.currentId = null;
    S.dirty     = false;
    $('editor-wrap').classList.add('hidden');
    $('empty-state').classList.remove('hidden');
  }

  renderList();
  pendingDelete = null;
  $('modal-delete').classList.add('hidden');
  notify('Nota excluída', 'info');
}

/* ============================================================
   EXPORTAR
============================================================ */

function exportTxt() {
  const note = find(S.currentId);
  if (!note) return;
  const text = $('editor').innerText || note.content.replace(/<[^>]+>/g, '');
  download(slugify(note.title) + '.txt', text, 'text/plain');
  notify('Exportado como .txt', 'ok');
}

function exportHtml() {
  const note = find(S.currentId);
  if (!note) return;
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${esc(note.title)}</title>
  <style>
    body{font-family:Georgia,serif;max-width:760px;margin:2.5rem auto;padding:0 1.5rem;
      line-height:1.85;color:#1a1916;background:#f9f6f1;}
    h1,h2,h3{font-family:system-ui,sans-serif;letter-spacing:-.02em;}
    a{color:#9a6c20;}pre{background:#f0ede6;padding:1rem;border-radius:6px;overflow-x:auto;}
    img{max-width:100%;border-radius:6px;}
    .meta{font-size:.8rem;color:#888;margin-bottom:2rem;}
  </style>
</head>
<body>
  <h1>${esc(note.title)}</h1>
  <p class="meta">Exportado em ${fmtDate(new Date().toISOString())}</p>
  ${note.content}
</body>
</html>`;
  download(slugify(note.title) + '.html', html, 'text/html');
  notify('Exportado como .html', 'ok');
}

function download(name, content, mime) {
  const a   = el('a');
  a.href    = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ============================================================
   FORMATAÇÃO DO EDITOR
============================================================ */

/**
 * Executa um comando execCommand padrão.
 * Foca o editor antes para manter a seleção.
 */
function fmt(cmd, val = null) {
  $('editor').focus();
  document.execCommand(cmd, false, val);
  updateToolbarState();
  scheduleSave();
}

/**
 * Atualiza o estado visual (on/off) dos botões da toolbar.
 */
function updateToolbarState() {
  const cmds = [
    'bold', 'italic', 'underline', 'strikeThrough',
    'insertUnorderedList', 'insertOrderedList',
    'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
  ];

  cmds.forEach(cmd => {
    const btn = document.querySelector(`.tb-btn[data-cmd="${cmd}"]`);
    if (btn) btn.classList.toggle('on', document.queryCommandState(cmd));
  });
}

/* ============================================================
   INSERÇÃO DE IMAGEM
============================================================ */

function insertImage(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = e => {
    $('editor').focus();
    document.execCommand('insertHTML', false, `<img src="${e.target.result}" alt="${esc(file.name)}" />`);
    scheduleSave();
    notify('Imagem inserida', 'ok');
  };
  reader.readAsDataURL(file);
}

/* ============================================================
   INSERÇÃO DE LINK
============================================================ */

let savedSel = null;

function openLinkModal() {
  // Salvar seleção atual
  const sel = window.getSelection();
  if (sel.rangeCount > 0) savedSel = sel.getRangeAt(0).cloneRange();

  $('link-text').value = sel.toString() || '';
  $('link-url').value  = '';
  $('modal-link').classList.remove('hidden');
  $('link-url').focus();
}

function closeLinkModal() {
  $('modal-link').classList.add('hidden');
}

function insertLink() {
  const text = $('link-text').value.trim();
  const url  = $('link-url').value.trim();
  if (!url) { notify('URL é obrigatória', 'err'); return; }

  $('editor').focus();

  if (savedSel) {
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedSel);
  }

  const anchor = `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(text || url)}</a>`;
  document.execCommand('insertHTML', false, anchor);
  closeLinkModal();
  scheduleSave();
}

/* ============================================================
   CONTAGEM DE PALAVRAS
============================================================ */

function updateWordCount() {
  const txt   = $('editor').innerText || '';
  const words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
  $('word-count').textContent = `${words} ${words === 1 ? 'palavra' : 'palavras'}`;
}

/* ============================================================
   META / STATUS
============================================================ */

function updateMeta(note) {
  $('meta-created').textContent  = 'Criada ' + relDate(note.createdAt);
  $('meta-modified').textContent = 'Editada ' + relDate(note.modifiedAt);
}

function setStatus(s) {
  const el = $('save-status');
  el.className = 'save-status ' + (s === 'saved' ? '' : s);
  el.textContent = s === 'saved' ? 'Salvo' : s === 'saving' ? 'Salvando...' : 'Não salvo';
}

/* ============================================================
   TEMA
============================================================ */

function loadTheme() {
  const t = localStorage.getItem('noted_theme') || 'dark';
  document.documentElement.dataset.theme = t;
  renderThemeIcon(t);
}

function toggleTheme() {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  localStorage.setItem('noted_theme', t);
  renderThemeIcon(t);
}

function renderThemeIcon(theme) {
  $('theme-btn').innerHTML = theme === 'dark'
    ? `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="4" stroke="currentColor" stroke-width="1.4"/>
        <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M11.89 4.11l-1.06 1.06M4.11 11.89L3.05 12.95" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
       </svg>`
    : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M13.5 9.5A6 6 0 016.5 2.5a6 6 0 100 11 6 6 0 007-4z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
       </svg>`;
}

/* ============================================================
   NOTIFICAÇÕES
============================================================ */

function notify(msg, type = 'info') {
  const c = $('notif-container');
  const d = el('div');
  d.className = `notif ${type}`;
  d.textContent = msg;
  c.appendChild(d);
  setTimeout(() => {
    d.classList.add('out');
    setTimeout(() => d.remove(), 300);
  }, 2400);
}

/* ============================================================
   UTILITÁRIOS
============================================================ */

function esc(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function relDate(iso) {
  if (!iso) return '—';
  const d    = new Date(iso);
  const diff = Math.floor((Date.now() - d) / 1000);
  if (diff < 60)        return 'agora';
  if (diff < 3600)      return `há ${Math.floor(diff/60)} min`;
  if (diff < 86400)     return `há ${Math.floor(diff/3600)}h`;
  if (diff < 86400 * 2) return 'ontem';
  if (diff < 86400 * 7) return `há ${Math.floor(diff/86400)} dias`;
  return d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' });
}

function slugify(s) {
  return (s || 'nota').toLowerCase()
    .replace(/[àáâãä]/g,'a').replace(/[èéêë]/g,'e')
    .replace(/[ìíîï]/g,'i').replace(/[òóôõö]/g,'o')
    .replace(/[ùúûü]/g,'u').replace(/[ç]/g,'c')
    .replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'').slice(0,60) || 'nota';
}

/* ============================================================
   ATALHOS DO EDITOR
============================================================ */

/**
 * Intercepta Tab/Shift+Tab dentro de listas para indent/outdent
 * e impede o Tab de sair do editor.
 */
function handleEditorKeydown(e) {
  updateToolbarState();

  if (e.key === 'Tab') {
    e.preventDefault();
    if (e.shiftKey) {
      document.execCommand('outdent', false, null);
    } else {
      document.execCommand('indent', false, null);
    }
    scheduleSave();
    return;
  }

  // Enter após linha vazia em bloco h1/h2/h3 → voltar para parágrafo
  if (e.key === 'Enter') {
    const sel  = window.getSelection();
    if (!sel.rangeCount) return;
    const node = sel.getRangeAt(0).startContainer;
    const blk  = node.nodeType === 3 ? node.parentElement : node;
    const tag  = blk?.tagName;
    if (tag && /^H[123]$/.test(tag) && blk.textContent === '') {
      e.preventDefault();
      document.execCommand('formatBlock', false, 'p');
    }
  }
}

/* ============================================================
   EVENTOS
============================================================ */

function bindEvents() {

  // Nova nota
  $('btn-new').addEventListener('click', newNote);

  // Busca
  $('search-input').addEventListener('input', e => {
    S.query = e.target.value;
    renderList();
  });

  // Tema
  $('theme-btn').addEventListener('click', toggleTheme);

  // Título
  $('note-title').addEventListener('input', scheduleSave);

  // Editor
  const editor = $('editor');
  editor.addEventListener('input',  () => { scheduleSave(); updateWordCount(); updateToolbarState(); });
  editor.addEventListener('keyup',  updateToolbarState);
  editor.addEventListener('mouseup', updateToolbarState);
  editor.addEventListener('keydown', handleEditorKeydown);

  // Drag & drop de imagem
  editor.addEventListener('dragover', e => e.preventDefault());
  editor.addEventListener('drop', e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) insertImage(file);
  });

  // Paste de imagem
  editor.addEventListener('paste', e => {
    for (const item of e.clipboardData.items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        insertImage(item.getAsFile());
        return;
      }
    }
  });

  // Toolbar — comandos execCommand
  document.querySelectorAll('.tb-btn[data-cmd]').forEach(btn => {
    btn.addEventListener('mousedown', e => {
      e.preventDefault();      // não perde foco do editor
      fmt(btn.dataset.cmd);
    });
  });

  // Toolbar — estilo de bloco
  $('tb-block').addEventListener('change', e => {
    editor.focus();
    document.execCommand('formatBlock', false, e.target.value);
    scheduleSave();
  });

  // Toolbar — cores
  $('tb-color-text').addEventListener('input', e => { fmt('foreColor', e.target.value); });
  $('tb-color-bg').addEventListener('input',   e => { fmt('hiliteColor', e.target.value); });

  // Toolbar — link
  $('tb-link').addEventListener('click', openLinkModal);
  $('link-cancel').addEventListener('click', closeLinkModal);
  $('link-ok').addEventListener('click', insertLink);
  $('link-url').addEventListener('keydown', e => { if (e.key === 'Enter') insertLink(); });
  $('modal-link').addEventListener('click', e => { if (e.target === $('modal-link')) closeLinkModal(); });

  // Toolbar — imagem
  $('tb-image').addEventListener('click', () => $('img-input').click());
  $('img-input').addEventListener('change', e => {
    if (e.target.files[0]) insertImage(e.target.files[0]);
    e.target.value = '';
  });

  // Ações da nota
  $('btn-delete').addEventListener('click', () => {
    if (S.currentId) askDelete(S.currentId);
  });
  $('btn-duplicate').addEventListener('click', () => {
    if (S.currentId) duplicateNote(S.currentId);
  });
  $('btn-export-txt').addEventListener('click', exportTxt);
  $('btn-export-html').addEventListener('click', exportHtml);

  // Modal delete
  $('del-cancel').addEventListener('click', () => {
    $('modal-delete').classList.add('hidden');
    pendingDelete = null;
  });
  $('del-confirm').addEventListener('click', doDelete);
  $('modal-delete').addEventListener('click', e => {
    if (e.target === $('modal-delete')) {
      $('modal-delete').classList.add('hidden');
      pendingDelete = null;
    }
  });

  // Atalhos globais de teclado
  document.addEventListener('keydown', e => {
    const ctrl = e.ctrlKey || e.metaKey;

    if (ctrl && e.key === 's') {
      e.preventDefault();
      if (S.currentId) { flushSave(); notify('Salvo!', 'ok'); }
      return;
    }
    if (ctrl && e.key === 'n') {
      e.preventDefault();
      newNote();
      return;
    }
    if (ctrl && e.key === 'k') {
      e.preventDefault();
      if (S.currentId) openLinkModal();
      return;
    }
    if (e.key === 'Escape') {
      closeLinkModal();
      $('modal-delete').classList.add('hidden');
      pendingDelete = null;
      closeContextMenu();
    }
  });

  // Salvar ao fechar a página
  window.addEventListener('beforeunload', () => {
    if (S.dirty) flushSave();
  });
}

/* ============================================================
   INICIALIZAÇÃO
============================================================ */

function init() {
  loadTheme();
  renderList();
  bindEvents();

  // Abrir primeira nota, se existir
  if (S.notes.length > 0) {
    selectNote(S.notes[0].id);
  }
}

document.addEventListener('DOMContentLoaded', init);

// Expor para uso no HTML inline (empty state)
window.App = { newNote };