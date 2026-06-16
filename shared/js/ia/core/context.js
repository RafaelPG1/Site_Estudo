/**
 * NEXUS — shared/js/ia/core/context.js
 *
 * Fonte de verdade para o tipo de contexto da página atual.
 *
 * Cada página declara explicitamente em qual(is) domínio(s) opera:
 *
 *   window.__NEXUS_CONTEXT__ = { tipos: ['resumo'] };
 *   window.__NEXUS_CONTEXT__ = { tipos: ['quiz'] };
 *   window.__NEXUS_CONTEXT__ = { tipos: ['games'] };
 *   window.__NEXUS_CONTEXT__ = { tipos: ['resumo', 'quiz'] };
 *   window.__NEXUS_CONTEXT__ = { tipos: ['resumo', 'games'] };
 *
 * Este módulo APENAS lê e expõe esse contrato. NÃO armazena disciplina,
 * semestre, ano, conteúdo ou qualquer outro estado dinâmico — esses
 * continuam em suas próprias fontes de verdade (global.js, search.js, etc.).
 *
 * Contrato obrigatório
 * ─────────────────────
 * window.__NEXUS_CONTEXT__ é a ÚNICA fonte de verdade para o tipo de
 * contexto. Se não estiver definido, estiver inválido ou possuir tipos
 * vazio, o sistema opera sem contexto — nenhuma detecção automática,
 * nenhum fallback, nenhum carregamento implícito de conteúdo.
 *
 * Depende de: (nenhuma dependência — carregado antes de todos os módulos de IA)
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
   * Retorna todos os tipos de contexto ativos na página atual.
   * Retorna [] se __NEXUS_CONTEXT__ não estiver definido ou for inválido.
   * Nenhuma detecção automática — ausência de declaração = sem contexto.
   *
   * @returns {string[]} ex: ['resumo'], ['quiz'], ['resumo', 'games'], []
   */
  function getTipos() {
    return _tiposExplicitos() || [];
  }

  /**
   * Retorna true se o tipo informado estiver declarado em __NEXUS_CONTEXT__.
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