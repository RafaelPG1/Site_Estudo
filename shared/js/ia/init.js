/**
 * NEXUS — shared/js/ia/init.js  v2.0
 *
 * Portão único do pipeline de IA.
 *
 * ── PRINCÍPIO CENTRAL ────────────────────────────────────────
 *
 *   A IA SEMPRE existe. A UI SEMPRE existe.
 *   O conteúdo interno do Nexus é apenas uma fonte adicional.
 *
 * ── RESPONSABILIDADE EXCLUSIVA ───────────────────────────────
 *
 *   Ativa pipelines de domínio (resumo, quiz, games) SOMENTE se a
 *   página declarar window.__NEXUS_CONTEXT__ com os tipos correspondentes.
 *
 * ── INDEPENDÊNCIA DE DOMÍNIOS (v2.0) ─────────────────────────
 *
 *   Resumo e Quiz são agora COMPLETAMENTE independentes:
 *     - Cada um chama NexusUI.init() com seus próprios callbacks
 *       (onSend/onReset), sobrescrevendo os do outro se ambos
 *       carregarem na mesma página.
 *     - Em páginas que são SOMENTE quiz (sem tipo 'resumo'),
 *       apenas NexusQuizAssistant.init() roda — não há mais
 *       dependência do pipeline de resumo para o quiz funcionar.
 *     - Em páginas que são SOMENTE resumo, apenas
 *       NexusAssistant.init() roda.
 *     - Se uma página declarar AMBOS os tipos (não recomendado,
 *       mas suportado), o último a chamar NexusUI.init() é quem
 *       fica com o chat — normalmente Quiz, pois é inicializado
 *       depois.
 *
 *   Quiz NÃO chama mais NexusAssistant.initUI() nem depende de
 *   _pipelineConteudoAtivo do Resumo. Quiz exige disciplina
 *   obrigatória via __NEXUS_QUIZ_DISC__ — sem fallback.
 *
 * ── NÃO CONHECE ──────────────────────────────────────────────
 *   - Detalhes de disciplina, semestre, conteúdo
 *   - Lógica de busca, indexação ou chat
 *   - Regras internas de cada domínio
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
      if (window.__NEXUS_CONTEXT__ && Array.isArray(window.__NEXUS_CONTEXT__.tipos)
          && window.__NEXUS_CONTEXT__.tipos.length) {
        console.error('[NexusInit] NexusContext não encontrado mas __NEXUS_CONTEXT__ foi declarado. ' +
          'Verifique se core/context.js está carregado antes de init.js.');
      } else {
        console.warn('[NexusInit] NexusContext não encontrado — usando contexto vazio.');
      }
      return null;
    }
    return window.NexusContext;
  }

  /* ══════════════════════════════════════════════════════════
     INICIALIZAÇÃO: RESUMO
  ══════════════════════════════════════════════════════════ */

  function _depsResumoOk() {
    var ok = true;
    if (typeof window.NexusTextUtils    === 'undefined') { console.error('[NexusInit] NexusTextUtils não encontrado.');    ok = false; }
    if (typeof window.NexusHistory      === 'undefined') { console.error('[NexusInit] NexusHistory não encontrado.');      ok = false; }
    if (typeof window.NexusLoader       === 'undefined') { console.error('[NexusInit] NexusLoader não encontrado.');       ok = false; }
    if (typeof window.NexusUI           === 'undefined') { console.error('[NexusInit] NexusUI não encontrado.');           ok = false; }
    if (typeof window.NexusResumoSearch === 'undefined') { console.error('[NexusInit] NexusResumoSearch não encontrado.'); ok = false; }
    if (typeof window.NexusAssistant    === 'undefined') { console.error('[NexusInit] NexusAssistant não encontrado.');    ok = false; }
    if (typeof window.NexusWorker       === 'undefined') { console.warn ('[NexusInit] NexusWorker não encontrado. Modo somente-busca.'); }
    return ok;
  }

  function _initResumo() {
    if (!_depsResumoOk()) {
      console.error('[NexusInit] dependências de resumo ausentes — pipeline de resumo abortado.');
      return false;
    }
    if (typeof window.NexusAssistant.initUI !== 'function' ||
        typeof window.NexusAssistant.init   !== 'function') {
      console.error('[NexusInit] NexusAssistant.initUI()/init() não encontrados.');
      return false;
    }

    console.log('[NexusInit] ativando pipeline: resumo');
    window.NexusAssistant.initUI();
    window.NexusAssistant.init();
    return true;
  }

  /* ══════════════════════════════════════════════════════════
     INICIALIZAÇÃO: QUIZ (independente)
  ══════════════════════════════════════════════════════════ */

  function _depsQuizOk() {
    var ok = true;
    if (typeof window.NexusHistory       === 'undefined') { console.error('[NexusInit] NexusHistory não encontrado.');       ok = false; }
    if (typeof window.NexusUI            === 'undefined') { console.error('[NexusInit] NexusUI não encontrado.');            ok = false; }
    if (typeof window.NexusTextUtils     === 'undefined') { console.error('[NexusInit] NexusTextUtils não encontrado.');     ok = false; }
    if (typeof window.NexusQuizSearch    === 'undefined') { console.error('[NexusInit] NexusQuizSearch não encontrado.');    ok = false; }
    if (typeof window.NexusQuizAssistant === 'undefined') { console.error('[NexusInit] NexusQuizAssistant não encontrado.'); ok = false; }
    if (typeof window.NexusLoader        === 'undefined') { console.error('[NexusInit] NexusLoader não encontrado.');        ok = false; }
    return ok;
  }

  /**
   * Ativa o pipeline de Quiz — totalmente independente do Resumo.
   *
   * Exige disciplina obrigatória via __NEXUS_QUIZ_DISC__. Sem fallback,
   * sem detecção automática. Se ausente, o quiz não inicializa.
   */
  function _initQuiz() {
    if (!_depsQuizOk()) {
      console.warn('[NexusInit] dependências de quiz ausentes — domínio quiz ignorado.');
      return;
    }

    if (typeof window.NexusQuizAssistant.init !== 'function') {
      console.error('[NexusInit] NexusQuizAssistant.init() não encontrado.');
      return;
    }

    var token  = window.__NEXUS_QUIZ_TOKEN__;
    var modo   = window.__NEXUS_QUIZ_MODO__;
    var discId = window.__NEXUS_QUIZ_DISC__;

    if (!token || typeof token !== 'string') {
      console.error('[NexusInit] quiz: __NEXUS_QUIZ_TOKEN__ ausente — quiz não iniciado.');
      return;
    }
    if (modo === undefined) {
      console.error('[NexusInit] quiz: __NEXUS_QUIZ_MODO__ ausente — quiz não iniciado.');
      return;
    }
    if (!discId) {
      console.error('[NexusInit] quiz: __NEXUS_QUIZ_DISC__ ausente — disciplina é obrigatória, ' +
        'sem fallback automático. Quiz não iniciado.');
      return;
    }

    NexusQuizSearch.autorizarQuiz(token);

    console.log('[NexusInit] ativando pipeline: quiz — disc:', discId, '| modo:', modo);
    window.NexusQuizAssistant.init();
  }

  /* ══════════════════════════════════════════════════════════
     INICIALIZAÇÃO: GAMES
  ══════════════════════════════════════════════════════════ */

  function _depsGamesOk() {
    var ok = true;
    if (typeof window.NexusLoader         === 'undefined') { console.error('[NexusInit] NexusLoader não encontrado.');         ok = false; }
    if (typeof window.NexusGamesSearch    === 'undefined') { console.error('[NexusInit] NexusGamesSearch não encontrado.');    ok = false; }
    if (typeof window.NexusGamesAssistant === 'undefined') { console.error('[NexusInit] NexusGamesAssistant não encontrado.'); ok = false; }
    if (typeof window.NexusGamesEngine    === 'undefined') { console.error('[NexusInit] NexusGamesEngine não encontrado.');    ok = false; }
    return ok;
  }

  function _initGames() {
    if (!_depsGamesOk()) {
      console.error('[NexusInit] dependências de games ausentes — pipeline de games abortado.');
      return;
    }
    if (typeof window.NexusGamesAssistant.init !== 'function') {
      console.error('[NexusInit] NexusGamesAssistant.init() não encontrado.');
      return;
    }
    console.log('[NexusInit] ativando pipeline: games');
    window.NexusGamesAssistant.init();
  }

  /* ══════════════════════════════════════════════════════════
     DISPARO
  ══════════════════════════════════════════════════════════ */

  function _init() {
    var ctx   = _contexto();
    var tipos = ctx ? ctx.getTipos() : [];

    if (!tipos.length) {
      console.log('[NexusInit] nenhum contexto de conteúdo declarado — IA não inicializada.');
      return;
    }

    console.log('[NexusInit] contextos de conteúdo declarados:', tipos);

    var temResumo = tipos.indexOf('resumo') !== -1;
    var temQuiz   = tipos.indexOf('quiz')   !== -1;
    var temGames  = tipos.indexOf('games')  !== -1;

    // Resumo e Quiz são independentes: cada um inicializa sua própria UI
    // e seu próprio chat. Não há mais dependência entre eles.
    if (temResumo) {
      _initResumo();
    }

    if (temQuiz) {
      _initQuiz();
    }

    if (temGames) {
      _initGames();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

}());