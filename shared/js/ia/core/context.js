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
 * Compatibilidade com arquitetura anterior
 * ─────────────────────────────────────────
 * Mecanismos legados são reconhecidos como fallback quando
 * __NEXUS_CONTEXT__ não estiver definido pela página:
 *
 *   quiz  → __NEXUS_QUIZ_TOKEN__ + __NEXUS_QUIZ_MODO__
 *   games → __NEXUS_GAMES_CTX__
 *   resumo → NexusResumoSearch.estaIndexado() (último recurso)
 *
 * Isso permite migrar as páginas incrementalmente, sem quebrar as
 * existentes. Assim que uma página definir __NEXUS_CONTEXT__, o
 * fallback é ignorado para ela.
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
     FALLBACK PARA ARQUITETURA ANTERIOR
     (usado apenas quando __NEXUS_CONTEXT__ não estiver definido)
  ══════════════════════════════════════════════════════════ */

  /**
   * Detecta tipos de contexto via mecanismos legados.
   * Chamado apenas se _tiposExplicitos() retornar null.
   *
   * @returns {string[]}
   */
  function _tiposLegados() {
    var tipos = [];

    // quiz — token + modo presentes (quiz/search.js antigo)
    if (window.__NEXUS_QUIZ_TOKEN__ && window.__NEXUS_QUIZ_MODO__) {
      tipos.push('quiz');
    }

    // games — objeto de contexto de jogo registrado pela init() do jogo
    if (window.__NEXUS_GAMES_CTX__ &&
        typeof window.__NEXUS_GAMES_CTX__ === 'object' &&
        window.__NEXUS_GAMES_CTX__.jogo) {
      tipos.push('games');
    }

    // resumo — índice populado (último recurso: implica que um assistant
    // já carregou e indexou conteúdo de resumo nesta sessão)
    if (typeof window.NexusResumoSearch !== 'undefined' &&
        window.NexusResumoSearch.estaIndexado()) {
      tipos.push('resumo');
    }

    return tipos;
  }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════════════════════════ */

  /**
   * Retorna todos os tipos de contexto ativos na página atual.
   * Usa __NEXUS_CONTEXT__ se disponível; fallback para detecção legada.
   *
   * @returns {string[]} ex: ['resumo'], ['quiz'], ['resumo', 'games'], []
   */
  function getTipos() {
    return _tiposExplicitos() || _tiposLegados();
  }

  /**
   * Retorna true se o tipo informado estiver entre os ativos.
   *
   * @param {string} tipo — 'resumo' | 'quiz' | 'games'
   * @returns {boolean}
   */
  function temTipo(tipo) {
    return getTipos().indexOf(tipo) !== -1;
  }

  /**
   * Retorna true se __NEXUS_CONTEXT__ foi declarado explicitamente
   * pela página (novo contrato), false se está usando fallback legado.
   *
   * Útil para diagnóstico e para módulos que queiram saber se a
   * página já foi migrada para a nova arquitetura.
   *
   * @returns {boolean}
   */
  function isExplicito() {
    return _tiposExplicitos() !== null;
  }

  /* ══════════════════════════════════════════════════════════
     REGISTRO GLOBAL
  ══════════════════════════════════════════════════════════ */

  window.NexusContext = {
    getTipos,
    temTipo,
    isExplicito,
  };

}());