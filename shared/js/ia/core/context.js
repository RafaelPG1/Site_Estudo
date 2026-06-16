/**
 * NEXUS — shared/js/ia/core/context.js
 *
 * Fonte de verdade para os TIPOS DE CONTEÚDO habilitados na página.
 *
 * Cada página declara explicitamente quais domínios de conteúdo interno
 * ela disponibiliza para a IA:
 *
 *   window.__NEXUS_CONTEXT__ = { tipos: ['resumo'] };
 *   window.__NEXUS_CONTEXT__ = { tipos: ['quiz'] };
 *   window.__NEXUS_CONTEXT__ = { tipos: ['games'] };
 *   window.__NEXUS_CONTEXT__ = { tipos: ['resumo', 'quiz'] };
 *   window.__NEXUS_CONTEXT__ = { tipos: ['resumo', 'games'] };
 *
 * ── PRINCÍPIO CENTRAL ────────────────────────────────────────
 *
 *   __NEXUS_CONTEXT__ NÃO controla a existência da IA.
 *   __NEXUS_CONTEXT__ NÃO controla a existência do chat.
 *   __NEXUS_CONTEXT__ controla APENAS quais pipelines de
 *   conteúdo interno ficam disponíveis.
 *
 *   Sem __NEXUS_CONTEXT__:
 *     - Chat: funciona normalmente
 *     - IA: responde com conhecimento próprio
 *     - Conteúdo interno: nenhum é carregado ou indexado
 *
 *   Com __NEXUS_CONTEXT__:
 *     - Chat: funciona normalmente
 *     - IA: responde com conhecimento próprio + conteúdo interno
 *     - Conteúdo interno: carregado e indexado conforme os tipos
 *
 * ── NÃO ARMAZENA ─────────────────────────────────────────────
 *
 *   Este módulo NÃO armazena disciplina, semestre, ano, AP,
 *   conteúdo, jogo ativo ou qualquer estado dinâmico — esses
 *   continuam em suas próprias fontes de verdade
 *   (global.js, search.js, __nexusCtx, etc.).
 *
 * ── CONTRATO OBRIGATÓRIO ─────────────────────────────────────
 *
 *   window.__NEXUS_CONTEXT__ é a ÚNICA fonte de verdade para
 *   os tipos de conteúdo habilitados. Se não estiver definido,
 *   for inválido ou tiver tipos vazio, nenhum conteúdo interno
 *   é carregado — sem detecção automática, sem fallback, sem
 *   carregamento implícito.
 *
 * Depende de: (nenhuma — carregado antes de todos os módulos de IA)
 *
 * API pública: window.NexusContext
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     LEITURA DO CONTRATO EXPLÍCITO
  ══════════════════════════════════════════════════════════ */

  /**
   * Retorna o array de tipos declarados em __NEXUS_CONTEXT__, ou null
   * se a página não tiver declarado o contexto explicitamente.
   *
   * @returns {string[]|null}
   */
  function _tiposExplicitos() {
    var ctx = window.__NEXUS_CONTEXT__;
    if (!ctx || !Array.isArray(ctx.tipos) || !ctx.tipos.length) return null;
    return ctx.tipos;
  }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════════════════════════ */

  /**
   * Retorna todos os tipos de conteúdo habilitados na página atual.
   * Retorna [] se __NEXUS_CONTEXT__ não estiver definido ou for inválido.
   *
   * [] não significa "IA desabilitada" — significa "sem conteúdo interno".
   * O chat e a IA existem independente deste retorno.
   *
   * @returns {string[]} ex: ['resumo'], ['quiz'], ['resumo', 'games'], []
   */
  function getTipos() {
    return _tiposExplicitos() || [];
  }

  /**
   * Retorna true se o tipo informado estiver habilitado nesta página.
   *
   * @param {string} tipo — 'resumo' | 'quiz' | 'games'
   * @returns {boolean}
   */
  function temTipo(tipo) {
    return getTipos().indexOf(tipo) !== -1;
  }

  /* ══════════════════════════════════════════════════════════
     REGISTRO GLOBAL
  ══════════════════════════════════════════════════════════ */

  window.NexusContext = {
    getTipos,
    temTipo,
  };

}());