/**
 * NEXUS — shared/js/ia/core/history.js
 *
 * Gerenciador de histórico de chat isolado por chave de contexto.
 *
 * Cada combinação de (domínio + disciplina + semestre + modo) produz uma
 * chave única. Históricos de contextos diferentes nunca se misturam.
 *
 * ── v1.1 — PERSISTÊNCIA REAL NO F5 ───────────────────────────
 *   Antes usava sessionStorage. sessionStorage por si só já sobrevive
 *   a F5, mas o quiz/js/assistant.js limpava o domínio inteiro no
 *   evento 'pagehide' — e 'pagehide' também dispara em reload, não
 *   apenas ao fechar a aba. Resultado: o histórico era apagado bem
 *   antes do reload terminar, parecendo "resetar no F5".
 *
 *   Trocado para localStorage, que é mais explícito sobre a intenção
 *   (persistir entre sessões da aba) e não depende de nenhum
 *   comportamento de ciclo de vida de página para "sobreviver".
 *   A responsabilidade de LIMPAR ao trocar de disciplina/modo agora
 *   é tratada de forma intencional pelo assistant.js (comparando o
 *   contexto salvo vs. o contexto atual), não por um listener de
 *   ciclo de vida que dispara em momentos imprevisíveis.
 *
 * API pública: window.NexusHistory
 *
 * Depende de: (nenhuma)
 */

(function () {
  'use strict';

  var MAX_MESSAGES   = 20;
  var STORAGE_PREFIX = 'nexus_chat_';

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
     ACESSO SEGURO AO localStorage

     Algumas situações (modo privado restrito, cota excedida,
     ambiente sem storage) podem lançar exceção. Todas as operações
     já eram protegidas por try/catch — mantido igual.
  ══════════════════════════════════════════════════════════ */

  function _store() {
    try {
      return window.localStorage || null;
    } catch (_) {
      return null;
    }
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
    var store = _store();
    if (!store) return [];
    try {
      var raw = store.getItem(_storageKey(chave));
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
    var store = _store();
    if (!store) return;
    try {
      var sistemaIdx = mensagens.findIndex(function (m) { return m.role === 'system'; });
      var sistema    = sistemaIdx !== -1 ? mensagens[sistemaIdx] : null;
      var resto      = mensagens.filter(function (m) { return m.role !== 'system'; });

      if (resto.length > MAX_MESSAGES - 1) {
        resto = resto.slice(-(MAX_MESSAGES - 1));
      }

      var final = sistema ? [sistema].concat(resto) : resto;
      store.setItem(_storageKey(chave), JSON.stringify(final));
    } catch (_) {}
  }

  /**
   * Apaga o histórico da chave.
   *
   * @param {string} chave
   */
  function limpar(chave) {
    if (!chave) return;
    var store = _store();
    if (!store) return;
    try { store.removeItem(_storageKey(chave)); } catch (_) {}
  }

  /**
   * Apaga todos os históricos cujo domínio corresponda ao prefixo.
   * Útil para limpar tudo de um domínio quando o contexto muda de
   * verdade (ex: trocou de disciplina ou de modo no quiz).
   *
   * @param {string} dominio — 'resumo' | 'quiz' | 'games'
   */
  function limparDominio(dominio) {
    if (!dominio) return;
    var store = _store();
    if (!store) return;
    try {
      var prefix = STORAGE_PREFIX + dominio.toLowerCase() + '|';
      var keys = [];
      for (var i = 0; i < store.length; i++) {
        var k = store.key(i);
        if (k && k.indexOf(prefix) === 0) keys.push(k);
      }
      keys.forEach(function (k) { store.removeItem(k); });
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