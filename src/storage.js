/* =============================================
   NEXUS STUDY — src/storage.js
src/storage.js
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

  function has(key) {
    try {
      return localStorage.getItem(_key(key)) !== null;
    } catch (e) {
      return false;
    }
  }

  /* ── PROGRESSO DO QUIZ ──────────────────────────────────── */

  function _progressKey(disc, modo, semestre) {
    return 'quiz_progress_' + disc + '_' + modo + '_' + semestre;
  }

function saveProgress(disc, modo, semestre, respostas, revelado, finalizado) {
  const key = _progressKey(disc, modo, semestre);
  set(key, {
    respostas,
    revelado,
    finalizado,
    savedAt:     Date.now(),
    completedAt: finalizado ? Date.now() : null, // ← novo
  });
}
  function loadProgress(disc, modo, semestre) {
    const key = _progressKey(disc, modo, semestre);
    return get(key, null);
  }

  function clearProgress(disc, modo, semestre) {
    const key = _progressKey(disc, modo, semestre);
    remove(key);
  }

  function hasProgress(disc, modo, semestre) {
    return has(_progressKey(disc, modo, semestre));
  }

  function listAllProgress() {
    try {
      const prefix = PREFIX + 'quiz_progress_';
      return Object.keys(localStorage)
        .filter(k => k.startsWith(prefix))
        .map(k => {
          try {
            const data  = JSON.parse(localStorage.getItem(k));
            const parts = k.replace(prefix, '').split('_');
            const semestre = parts[parts.length - 1];
            const modo     = parts[parts.length - 2];
            const disc     = parts.slice(0, -2).join('_');
            return { disc, modo, semestre, savedAt: data?.savedAt, finalizado: data?.finalizado };
          } catch { return null; }
        })
        .filter(Boolean);
    } catch (e) {
      return [];
    }
  }

  /**
   * Remove APENAS as chaves de quiz do localStorage.
   * Abrange progress, smap e leftat (prefixo nexus_quiz_).
   * Configs, usuário e demais chaves do sistema são preservadas.
   */
  function clearAllQuizData() {
    try {
      const quizPrefix = PREFIX + 'quiz_';
      const keys = Object.keys(localStorage).filter(k => k.startsWith(quizPrefix));
      keys.forEach(k => localStorage.removeItem(k));
      console.info('[Storage] Quiz data limpo. Chaves removidas:', keys.length);
    } catch (e) {
      console.warn('[Storage] Erro ao limpar dados do quiz:', e);
    }
  }

  return {
    set, get, remove, clear, has,
    saveProgress, loadProgress, clearProgress, hasProgress, listAllProgress,
    clearAllQuizData,
  };
})();

export default Storage;