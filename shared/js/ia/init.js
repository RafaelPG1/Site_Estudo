/**
 * NEXUS — shared/js/ia/init.js
 *
 * Ponto de entrada único do sistema de IA.
 *
 * Responsabilidade exclusiva:
 *   Identificar o contexto da página e carregar os módulos corretos.
 *
 * Decisão:
 *   - Páginas normais (resumo)  → carrega apenas o sistema de resumo
 *   - Páginas de quiz           → carrega sistema de quiz + resumo (fallback)
 *
 * A detecção é simples e direta:
 *   window.__NEXUS_QUIZ_TOKEN__ presente e válido → contexto de quiz
 *   Qualquer outra situação → contexto de resumo
 *
 * Quem define __NEXUS_QUIZ_TOKEN__ é o template_init.js das páginas
 * de quiz, ANTES que init.js seja executado.
 *
 * Ordem de carregamento garantida pelo HTML:
 *   1. core/text-utils.js
 *   2. core/loader.js
 *   3. core/worker.js
 *   4. core/ui.js
 *   5. resumo/search.js
 *   6. quiz/search.js       (apenas em páginas de quiz)
 *   7. resumo/assistant.js
 *   8. quiz/assistant.js    (apenas em páginas de quiz)
 *   9. init.js              ← este arquivo
 *
 * Não faz import dinâmico — apenas verifica o estado global e
 * garante que os módulos necessários foram carregados pelo HTML.
 *
 * NÃO conhece:
 *   - Detalhes de disciplina, semestre, conteúdo
 *   - Lógica de busca ou chat
 *
 * Dependências obrigatórias (sempre):
 *   window.NexusTextUtils, window.NexusLoader, window.NexusWorker,
 *   window.NexusUI, window.NexusResumoSearch, window.NexusAssistant
 *
 * Dependências de quiz (apenas em páginas de quiz):
 *   window.NexusQuizSearch, window.NexusQuizAssistant
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     DETECÇÃO DE CONTEXTO
  ══════════════════════════════════════════════════════════ */

  /**
   * Retorna true se a página atual é uma página de quiz com
   * token de sessão válido.
   *
   * @returns {boolean}
   */
  function _ehContextoQuiz() {
    var t = window.__NEXUS_QUIZ_TOKEN__;
    if (!t || typeof t !== 'string') return false;
    return window.__NEXUS_QUIZ_MODO__ !== undefined;
  }

  /* ══════════════════════════════════════════════════════════
     VERIFICAÇÃO DE DEPENDÊNCIAS
  ══════════════════════════════════════════════════════════ */

  function _depsBaseOk() {
    var ok = true;
    if (typeof window.NexusTextUtils    === 'undefined') { console.error('[NexusInit] NexusTextUtils não encontrado.');    ok = false; }
    if (typeof window.NexusLoader       === 'undefined') { console.error('[NexusInit] NexusLoader não encontrado.');       ok = false; }
    if (typeof window.NexusWorker       === 'undefined') { console.warn ('[NexusInit] NexusWorker não encontrado. Modo somente-busca.'); }
    if (typeof window.NexusUI           === 'undefined') { console.error('[NexusInit] NexusUI não encontrado.');           ok = false; }
    if (typeof window.NexusResumoSearch === 'undefined') { console.error('[NexusInit] NexusResumoSearch não encontrado.'); ok = false; }
    if (typeof window.NexusAssistant    === 'undefined') { console.error('[NexusInit] NexusAssistant não encontrado.');    ok = false; }
    return ok;
  }

  function _depsQuizOk() {
    var ok = true;
    if (typeof window.NexusQuizSearch    === 'undefined') { console.error('[NexusInit] NexusQuizSearch não encontrado.');    ok = false; }
    if (typeof window.NexusQuizAssistant === 'undefined') { console.error('[NexusInit] NexusQuizAssistant não encontrado.'); ok = false; }
    return ok;
  }

  /* ══════════════════════════════════════════════════════════
     INICIALIZAÇÃO
  ══════════════════════════════════════════════════════════ */

  function _init() {
    if (!_depsBaseOk()) {
      console.error('[NexusInit] dependências base ausentes — abortando inicialização.');
      return;
    }

    var isQuiz = _ehContextoQuiz();

    if (isQuiz) {
      if (!_depsQuizOk()) {
        console.warn('[NexusInit] dependências de quiz ausentes — iniciando apenas resumo.');
        isQuiz = false;
      }
    }

    if (isQuiz) {
      console.log('[NexusInit] contexto: quiz + resumo (fallback)');

      // Autoriza o NexusQuizSearch com o token de sessão
      NexusQuizSearch.autorizarQuiz(window.__NEXUS_QUIZ_TOKEN__);

      // O resumo/assistant.js já se auto-inicializa via DOMContentLoaded.
      // quiz/assistant.js também se registra automaticamente e intercepta
      // perguntas quando _contextoQuizAtivo() retornar true.
      // Nada mais é necessário aqui além do autorizar acima.

      console.log('[NexusInit] quiz autorizado para modo:', window.__NEXUS_QUIZ_MODO__);

    } else {
      console.log('[NexusInit] contexto: resumo');
      // resumo/assistant.js se auto-inicializa via DOMContentLoaded.
      // Nenhuma ação adicional necessária.
    }
  }

  /* ══════════════════════════════════════════════════════════
     DISPARO
  ══════════════════════════════════════════════════════════ */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

}());