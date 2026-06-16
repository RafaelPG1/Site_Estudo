/**
 * NEXUS — shared/js/ia/init.js
 *
 * Portão único do pipeline de IA.
 *
 * Responsabilidade exclusiva:
 *   Ler NexusContext e disparar a inicialização dos domínios
 *   declarados pela página. Sem contexto declarado, absolutamente
 *   nada é carregado, indexado ou disponibilizado à IA.
 *
 * Fluxo:
 *
 *   window.__NEXUS_CONTEXT__
 *          │
 *          ▼
 *        init.js  ◄── único portão
 *          │
 *          ├── sem tipos declarados → encerra aqui, pipeline não inicia
 *          │
 *          ├── tipos: ['resumo'] → _initResumo()
 *          ├── tipos: ['quiz']   → _initResumo() + _initQuiz()
 *          ├── tipos: ['games']  → _initGames()
 *          └── combinações válidas
 *
 * Contrato com os assistants:
 *   Os assistants NÃO se auto-inicializam via DOMContentLoaded.
 *   Eles expõem uma função init() que este módulo chama
 *   explicitamente após verificar o contexto:
 *
 *     window.NexusAssistant.init()       — resumo
 *     window.NexusQuizAssistant.init()   — quiz (após resumo)
 *     window.NexusGamesAssistant.init()  — games
 *
 * Ordem de carregamento garantida pelo HTML antes deste script:
 *
 *   Páginas de resumo / quiz:
 *     core/context.js, core/text-utils.js, core/loader.js,
 *     core/worker.js, core/ui.js, resumo/search.js,
 *     resumo/assistant.js
 *     quiz/search.js, quiz/assistant.js  (apenas em páginas de quiz)
 *
 *   Páginas de games:
 *     core/context.js, core/loader.js,
 *     games/search.js, games/assistant.js, games/engine.js
 *
 * NÃO conhece:
 *   - Detalhes de disciplina, semestre, conteúdo
 *   - Lógica de busca, indexação ou chat
 *   - Regras internas de cada jogo
 *
 * Depende de: core/context.js (window.NexusContext) — obrigatório.
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     PORTÃO: verificação de contexto
  ══════════════════════════════════════════════════════════ */

  function _contexto() {
    if (typeof window.NexusContext === 'undefined') {
      console.warn('[NexusInit] NexusContext não encontrado — pipeline não será iniciado.');
      return null;
    }
    return window.NexusContext;
  }

  /* ══════════════════════════════════════════════════════════
     VERIFICAÇÃO DE DEPENDÊNCIAS
  ══════════════════════════════════════════════════════════ */

  function _depsResumoOk() {
    var ok = true;
    if (typeof window.NexusTextUtils    === 'undefined') { console.error('[NexusInit] NexusTextUtils não encontrado.');    ok = false; }
    if (typeof window.NexusLoader       === 'undefined') { console.error('[NexusInit] NexusLoader não encontrado.');       ok = false; }
    if (typeof window.NexusUI           === 'undefined') { console.error('[NexusInit] NexusUI não encontrado.');           ok = false; }
    if (typeof window.NexusResumoSearch === 'undefined') { console.error('[NexusInit] NexusResumoSearch não encontrado.'); ok = false; }
    if (typeof window.NexusAssistant    === 'undefined') { console.error('[NexusInit] NexusAssistant não encontrado.');    ok = false; }
    if (typeof window.NexusWorker       === 'undefined') { console.warn ('[NexusInit] NexusWorker não encontrado. Modo somente-busca.'); }
    return ok;
  }

  function _depsQuizOk() {
    var ok = true;
    if (typeof window.NexusQuizSearch    === 'undefined') { console.error('[NexusInit] NexusQuizSearch não encontrado.');    ok = false; }
    if (typeof window.NexusQuizAssistant === 'undefined') { console.error('[NexusInit] NexusQuizAssistant não encontrado.'); ok = false; }
    return ok;
  }

  function _depsGamesOk() {
    var ok = true;
    if (typeof window.NexusLoader         === 'undefined') { console.error('[NexusInit] NexusLoader não encontrado.');         ok = false; }
    if (typeof window.NexusGamesSearch    === 'undefined') { console.error('[NexusInit] NexusGamesSearch não encontrado.');    ok = false; }
    if (typeof window.NexusGamesAssistant === 'undefined') { console.error('[NexusInit] NexusGamesAssistant não encontrado.'); ok = false; }
    if (typeof window.NexusGamesEngine    === 'undefined') { console.error('[NexusInit] NexusGamesEngine não encontrado.');    ok = false; }
    return ok;
  }

  /* ══════════════════════════════════════════════════════════
     INICIALIZAÇÃO POR DOMÍNIO
  ══════════════════════════════════════════════════════════ */

  /**
   * Inicia o pipeline de resumo.
   * NexusAssistant.init() é o único ponto de entrada — ele é quem
   * coordena carregamento, indexação e UI. Nenhum outro módulo
   * inicia o pipeline por conta própria.
   */
  function _initResumo() {
    if (!_depsResumoOk()) {
      console.error('[NexusInit] dependências de resumo ausentes — pipeline de resumo abortado.');
      return false;
    }

    if (typeof window.NexusAssistant.init !== 'function') {
      console.error('[NexusInit] NexusAssistant.init() não encontrado. ' +
        'resumo/assistant.js deve expor init() em vez de se auto-inicializar.');
      return false;
    }

    console.log('[NexusInit] iniciando domínio: resumo');
    window.NexusAssistant.init();
    return true;
  }

  /**
   * Inicia o pipeline de quiz.
   * Depende de resumo já estar ativo (usa NexusAssistant internamente
   * para selecionar disciplina no chat).
   * Autoriza NexusQuizSearch com o token de sessão e dispara
   * NexusQuizAssistant.init().
   */
  function _initQuiz() {
    if (!_depsQuizOk()) {
      console.warn('[NexusInit] dependências de quiz ausentes — domínio quiz ignorado.');
      return;
    }

    if (typeof window.NexusQuizAssistant.init !== 'function') {
      console.error('[NexusInit] NexusQuizAssistant.init() não encontrado. ' +
        'quiz/assistant.js deve expor init().');
      return;
    }

    // O token e o modo continuam sendo responsabilidade do template_init.js
    // da página de quiz. init.js apenas verifica sua presença e autoriza.
    var token = window.__NEXUS_QUIZ_TOKEN__;
    var modo  = window.__NEXUS_QUIZ_MODO__;

    if (!token || typeof token !== 'string') {
      console.error('[NexusInit] quiz: __NEXUS_QUIZ_TOKEN__ ausente ou inválido — ' +
        'quiz não pode ser iniciado sem token de sessão.');
      return;
    }

    if (modo === undefined) {
      console.error('[NexusInit] quiz: __NEXUS_QUIZ_MODO__ ausente — ' +
        'quiz não pode ser iniciado sem modo definido.');
      return;
    }

    NexusQuizSearch.autorizarQuiz(token);

    console.log('[NexusInit] iniciando domínio: quiz — modo:', modo);
    window.NexusQuizAssistant.init();
  }

  /**
   * Inicia o pipeline de games.
   * Games é um domínio independente — não depende de resumo/quiz.
   */
  function _initGames() {
    if (!_depsGamesOk()) {
      console.error('[NexusInit] dependências de games ausentes — pipeline de games abortado.');
      return;
    }

    if (typeof window.NexusGamesAssistant.init !== 'function') {
      console.error('[NexusInit] NexusGamesAssistant.init() não encontrado. ' +
        'games/assistant.js deve expor init().');
      return;
    }

    console.log('[NexusInit] iniciando domínio: games');
    window.NexusGamesAssistant.init();
  }

  /* ══════════════════════════════════════════════════════════
     DISPARO
  ══════════════════════════════════════════════════════════ */

  function _init() {
  var ctx   = _contexto();
  var tipos = ctx ? ctx.getTipos() : [];

  if (tipos.length) {
    console.log('[NexusInit] contexto declarado:', tipos);
  } else {
    console.log('[NexusInit] nenhum contexto declarado — IA em modo livre (sem conteúdo interno).');
  }

  var temQuiz  = tipos.indexOf('quiz')  !== -1;
  var temGames = tipos.indexOf('games') !== -1;

  // O chat/UI nasce sempre. Quem decide se carrega conteúdo interno
  // (content/resumo) é o próprio NexusAssistant, consultando
  // NexusContext.temTipo('resumo') internamente — init.js não gateia
  // mais a existência da UI, só a ativação dos subdomínios quiz/games.
  var chatOk = _initResumo();

  if (temGames) _initGames();

  if (temQuiz && chatOk) {
    _initQuiz();
  } else if (temQuiz && !chatOk) {
    console.warn('[NexusInit] quiz ignorado pois o pipeline de chat falhou.');
  }
}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

}());