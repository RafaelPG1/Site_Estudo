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

  function has(key) {
    try {
      return localStorage.getItem(_key(key)) !== null;
    } catch (e) {
      return false;
    }
  }

  /* ── PROGRESSO DO QUIZ ──────────────────────────────────── */

  /**
   * Chave de progresso: quiz_progress_{disc}_{modo}_{semestre}
   * ex: nexus_quiz_progress_poo_questoes_2026.2
   */
  function _progressKey(disc, modo, semestre) {
    return 'quiz_progress_' + disc + '_' + modo + '_' + semestre;
  }

  /**
   * Salva o progresso de um quiz.
   * @param {string} disc
   * @param {string} modo
   * @param {string} semestre
   * @param {object} respostas   - { [qi]: ai, ... }
   * @param {boolean} revelado   - se as respostas foram reveladas
   * @param {boolean} finalizado - se o quiz foi concluído
   */
  function saveProgress(disc, modo, semestre, respostas, revelado, finalizado) {
    const key = _progressKey(disc, modo, semestre);
    set(key, {
      respostas,
      revelado,
      finalizado,
      savedAt: Date.now(),
    });
  }

  /**
   * Retorna o progresso salvo ou null se não houver.
   */
  function loadProgress(disc, modo, semestre) {
    const key = _progressKey(disc, modo, semestre);
    return get(key, null);
  }

  /**
   * Remove o progresso de um quiz específico.
   */
  function clearProgress(disc, modo, semestre) {
    const key = _progressKey(disc, modo, semestre);
    remove(key);
  }

  /**
   * Verifica se existe progresso salvo para um quiz.
   */
  function hasProgress(disc, modo, semestre) {
    return has(_progressKey(disc, modo, semestre));
  }

  /**
   * Lista todas as chaves de progresso salvas.
   * Retorna array de { disc, modo, semestre, savedAt, finalizado }
   */
  function listAllProgress() {
    try {
      const prefix = PREFIX + 'quiz_progress_';
      return Object.keys(localStorage)
        .filter(k => k.startsWith(prefix))
        .map(k => {
          try {
            const data = JSON.parse(localStorage.getItem(k));
            // extrai disc_modo_semestre do final da chave
            const parts = k.replace(prefix, '').split('_');
            // semestre é o último segmento (ex: 2026.2)
            const semestre = parts[parts.length - 1];
            // modo é o penúltimo
            const modo     = parts[parts.length - 2];
            // disc é o resto (pode ter _ como banco_dados)
            const disc     = parts.slice(0, -2).join('_');
            return { disc, modo, semestre, savedAt: data?.savedAt, finalizado: data?.finalizado };
          } catch { return null; }
        })
        .filter(Boolean);
    } catch (e) {
      return [];
    }
  }

  return { set, get, remove, clear, has, saveProgress, loadProgress, clearProgress, hasProgress, listAllProgress };
})();

export default Storage;