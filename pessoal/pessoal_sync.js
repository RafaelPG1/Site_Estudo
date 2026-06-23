import { getUsuario } from '../src/global.js';
import {
  salvarChecklistPessoal,
  carregarChecklistPessoal,
  salvarCategoriasPessoal,
  carregarCategoriasPessoal,
  carregarTudoPessoal,
} from '../src/firebase.js';

const KEY_CHECKLIST    = (sem, discId) => `nexus_cl_${sem}_${discId}`;
const KEY_CATS         = 'nexus_cats_v1';
const KEY_CURRENT_USER = 'nexus_pessoal_uid'; // ← rastreia o usuário atual

const _timers = {};

function _debounce(key, fn, delay = 1200) {
  clearTimeout(_timers[key]);
  _timers[key] = setTimeout(fn, delay);
}

function _uid() {
  return getUsuario()?.uid ?? null;
}

/* ── Limpa todos os dados pessoais do localStorage ── */
function _clearAllPessoalLocal() {
  localStorage.removeItem(KEY_CATS);
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith('nexus_cl_')) {
      toRemove.push(k);
    }
  }
  toRemove.forEach(k => localStorage.removeItem(k));
}

/* ── Detecta troca de usuário e limpa localStorage se necessário ── */
export function verificarTrocaDeUsuario() {
  const uid       = _uid() ?? 'visitante';
  const storedUid = localStorage.getItem(KEY_CURRENT_USER);

  if (storedUid !== uid) {
    _clearAllPessoalLocal();
    localStorage.setItem(KEY_CURRENT_USER, uid);
    return true;
  }
  return false;
}

export function setSyncStatus(estado) {
  const el = document.getElementById('pessoal-sync-status');
  if (!el) return;
  el.className = `pessoal-sync pessoal-sync--${estado}`;
  const labels = {
    syncing: '⟳ Sincronizando…',
    synced:  '✓ Sincronizado',
    offline: '○ Offline',
    hidden:  '',
  };
  el.textContent = labels[estado] ?? '';
}

export function getCheckedIds(sem, discId) {
  try {
    const raw = localStorage.getItem(KEY_CHECKLIST(sem, discId));
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function saveCheckedIds(sem, discId, set) {
  try {
    localStorage.setItem(KEY_CHECKLIST(sem, discId), JSON.stringify([...set]));
  } catch {}

  const uid = _uid();
  if (!uid) return;

  setSyncStatus('syncing');
  _debounce(`cl_${sem}_${discId}`, async () => {
    const res = await salvarChecklistPessoal(uid, sem, discId, set);
    setSyncStatus(res.ok ? 'synced' : 'offline');
  }, 800);
}

function _loadAllCats() {
  try {
    const raw  = localStorage.getItem(KEY_CATS);
    const data = raw ? JSON.parse(raw) : {};
    return typeof data === 'object' && data !== null ? data : {};
  } catch {
    return {};
  }
}

function _saveAllCats(data) {
  try { localStorage.setItem(KEY_CATS, JSON.stringify(data)); } catch {}
}

function _ensure(data, sem, discId) {
  if (!data[sem])         data[sem] = {};
  if (!data[sem][discId]) data[sem][discId] = [];
}

export function getCategorias(sem, discId) {
  const data = _loadAllCats();
  _ensure(data, sem, discId);
  return data[sem][discId];
}

export function setCategorias(sem, discId, cats) {
  const data = _loadAllCats();
  _ensure(data, sem, discId);
  data[sem][discId] = cats;
  _saveAllCats(data);

  const uid = _uid();
  if (!uid) return;

  setSyncStatus('syncing');
  _debounce(`cats_${sem}_${discId}`, async () => {
    const res = await salvarCategoriasPessoal(uid, sem, discId, cats);
    setSyncStatus(res.ok ? 'synced' : 'offline');
  }, 1000);
}

export async function syncDiscFromFirebase(sem, discId) {
  verificarTrocaDeUsuario(); // limpa localStorage se usuário trocou

  const uid = _uid();

  const localChecklist  = getCheckedIds(sem, discId);
  const localCategorias = getCategorias(sem, discId);

  if (!uid) {
    return { checklist: localChecklist, categorias: localCategorias };
  }

  setSyncStatus('syncing');

  const remote = await carregarTudoPessoal(uid, sem, discId);

  if (!remote) {
    setSyncStatus('synced');
    if (localStorage.getItem(KEY_CURRENT_USER) === uid) {
      _uploadLocalToFirebase(uid, sem, discId, localChecklist, localCategorias);
    }
    return { checklist: localChecklist, categorias: localCategorias };
  }

  let checklist  = localChecklist;
  let categorias = localCategorias;

  if (remote.checklist !== null) {
    checklist = new Set(remote.checklist);
    try {
      localStorage.setItem(KEY_CHECKLIST(sem, discId), JSON.stringify(remote.checklist));
    } catch {}
  }

  if (remote.categorias !== null) {
    categorias = remote.categorias;
    const data = _loadAllCats();
    _ensure(data, sem, discId);
    data[sem][discId] = categorias;
    _saveAllCats(data);
  }

  setSyncStatus('synced');
  return { checklist, categorias };
}

function _uploadLocalToFirebase(uid, sem, discId, checklist, categorias) {
  if (checklist.size > 0) {
    salvarChecklistPessoal(uid, sem, discId, checklist).catch(() => {});
  }
  if (categorias.length > 0) {
    salvarCategoriasPessoal(uid, sem, discId, categorias).catch(() => {});
  }
}

export function atualizarBadgeLogin() {
  const uid = _uid();
  setSyncStatus(uid ? 'synced' : 'hidden');
}