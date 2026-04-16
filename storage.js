/* =============================================
   NEXUS STUDY — storage.js
   Controle centralizado do localStorage
   ============================================= */

const Storage = (() => {
  const PREFIX = 'nexus_';

  function _key(k) {
    return PREFIX + k;
  }

  function set(key, value) {
    try {
      localStorage.setItem(_key(key), JSON.stringify(value));
    } catch (e) {
      console.warn('[Storage] Erro ao salvar:', key, e);
    }
  }

  function get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(_key(key));
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn('[Storage] Erro ao ler:', key, e);
      return fallback;
    }
  }

  function remove(key) {
    try {
      localStorage.removeItem(_key(key));
    } catch (e) {
      console.warn('[Storage] Erro ao remover:', key, e);
    }
  }

  function clear() {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX))
        .forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.warn('[Storage] Erro ao limpar:', e);
    }
  }

  /* ── CORRIGIDO: has() agora tem try/catch igual às demais ── */
  function has(key) {
    try {
      return localStorage.getItem(_key(key)) !== null;
    } catch (e) {
      return false;
    }
  }

  return { set, get, remove, clear, has };
})();

export default Storage;