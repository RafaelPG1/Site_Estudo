/**
 * NEXUS — shared/js/ia/core/history.js
 *
 * Gerenciador de histórico de chat isolado por chave de contexto.
 *
 * Cada combinação de (domínio + disciplina + semestre) produz uma
 * chave única. Históricos de contextos diferentes nunca se misturam.
 *
 * API pública: window.NexusHistory
 *
 * Depende de: (nenhuma)
 */

(function () {
  'use strict';

  var MAX_MESSAGES  = 20;
  var STORAGE_PREFIX = 'nexus_hist_';

  /* ══════════════════════════════════════════════════════════
     CHAVE DE CONTEXTO
  ══════════════════════════════════════════════════════════ */

  /**
   * Monta chave estável para um contexto.
   * Ex: "resumo|design|2026.1-ap1"
   *     "quiz|redes|2026.1-ap2"
   *
   * @param {string} dominio  — 'resumo' | 'quiz' | 'games'
   * @param {string} discId   — id da disciplina (ex: 'design', 'redes')
   * @param {string} sem      — semestre (ex: '2026.1-AP1')
   * @returns {string}
   */
  function montarChave(dominio, discId, sem) {
    return [
      (dominio || '').toLowerCase(),
      (discId  || '').toLowerCase(),
      (sem     || '').toLowerCase(),
    ].join('|');
  }

  function _storageKey(chave) {
    return STORAGE_PREFIX + chave;
  }

  /* ══════════════════════════════════════════════════════════
     LEITURA / ESCRITA
  ══════════════════════════════════════════════════════════ */

  /**
   * Carrega mensagens salvas para a chave.
   * Retorna [] se não houver histórico ou se falhar.
   *
   * @param {string} chave
   * @returns {object[]}
   */
  function carregar(chave) {
    if (!chave) return [];
    try {
      var raw = sessionStorage.getItem(_storageKey(chave));
      if (!raw) return [];
      var msgs = JSON.parse(raw);
      return Array.isArray(msgs) ? msgs : [];
    } catch (_) { return []; }
  }

  /**
   * Salva mensagens para a chave.
   * Aplica limite de MAX_MESSAGES, preservando a msg de sistema (role:'system').
   *
   * @param {string}   chave
   * @param {object[]} mensagens
   */
  function salvar(chave, mensagens) {
    if (!chave || !Array.isArray(mensagens)) return;
    try {
      var sistemaIdx = mensagens.findIndex(function (m) { return m.role === 'system'; });
      var sistema    = sistemaIdx !== -1 ? mensagens[sistemaIdx] : null;
      var resto      = mensagens.filter(function (m) { return m.role !== 'system'; });

      if (resto.length > MAX_MESSAGES - 1) {
        resto = resto.slice(-(MAX_MESSAGES - 1));
      }

      var final = sistema ? [sistema].concat(resto) : resto;
      sessionStorage.setItem(_storageKey(chave), JSON.stringify(final));
    } catch (_) {}
  }

  /**
   * Apaga o histórico da chave.
   *
   * @param {string} chave
   */
  function limpar(chave) {
    if (!chave) return;
    try { sessionStorage.removeItem(_storageKey(chave)); } catch (_) {}
  }

  /**
   * Apaga todos os históricos cujo domínio corresponda ao prefixo.
   * Útil para limpar tudo de um domínio ao sair (ex: sair do quiz).
   *
   * @param {string} dominio — 'resumo' | 'quiz' | 'games'
   */
  function limparDominio(dominio) {
    if (!dominio) return;
    try {
      var prefix = STORAGE_PREFIX + dominio.toLowerCase() + '|';
      var keys = [];
      for (var i = 0; i < sessionStorage.length; i++) {
        var k = sessionStorage.key(i);
        if (k && k.startsWith(prefix)) keys.push(k);
      }
      keys.forEach(function (k) { sessionStorage.removeItem(k); });
    } catch (_) {}
  }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════════════════════════ */

  window.NexusHistory = {
    montarChave,
    carregar,
    salvar,
    limpar,
    limparDominio,
  };

}());