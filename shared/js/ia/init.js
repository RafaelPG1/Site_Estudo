/**
 * NEXUS — shared/js/ia/init.js  v1.1 (auditoria)
 *
 * Portão único do pipeline de IA.
 *
 * ── PRINCÍPIO CENTRAL ────────────────────────────────────────
 *
 *   A IA SEMPRE existe. A UI SEMPRE existe.
 *   O conteúdo interno do Nexus é apenas uma fonte adicional.
 *
 *   IA + conteúdo interno (opcional)
 *   ≠
 *   IA = conteúdo interno
 *
 * ── RESPONSABILIDADE EXCLUSIVA ───────────────────────────────
 *
 *   1. Inicializar o chat/UI sempre (NexusAssistant.initUI)
 *   2. Ativar pipelines de conteúdo SOMENTE se a página declarar
 *      window.__NEXUS_CONTEXT__ com os tipos correspondentes.
 *
 * ── FLUXO ────────────────────────────────────────────────────
 *
 *   window.__NEXUS_CONTEXT__
 *          │
 *          ▼
 *        init.js  ◄── único portão
 *          │
 *          ├── [sempre] → _initUI()           ← chat existe sempre
 *          │
 *          ├── tipos inclui 'resumo' → _initResumo()
 *          ├── tipos inclui 'quiz'   → _initQuiz()  (exige resumo ok)
 *          └── tipos inclui 'games'  → _initGames()
 *
 *   Sem __NEXUS_CONTEXT__ (ou tipos vazio):
 *     - Chat funciona normalmente
 *     - IA responde com conhecimento próprio
 *     - NADA é carregado, indexado ou preparado internamente
 *
 * ── CONTRATO COM OS ASSISTANTS ───────────────────────────────
 *
 *   Os assistants NÃO se auto-inicializam via DOMContentLoaded.
 *   Expõem funções explícitas que este módulo chama:
 *
 *     NexusAssistant.initUI()      — inicializa chat/UI (sempre)
 *     NexusAssistant.init()        — ativa pipeline de conteúdo resumo
 *     NexusQuizAssistant.init()    — ativa pipeline de conteúdo quiz
 *     NexusGamesAssistant.init()   — ativa pipeline de conteúdo games
 *
 * ── MUDANÇAS v1.1 (auditoria — Requisito 1) ──────────────────
 *
 *   _initQuiz() agora chama NexusQuizAssistant.notificarEntradaNoQuiz()
 *   diretamente, APÓS NexusAssistant.init() ter ligado o pipeline de
 *   conteúdo. Isso elimina a corrida que existia quando apenas
 *   template_init.js disparava a notificação via polling:
 *
 *     Antes: template_init.js → polling (100ms) → encontrava
 *     NexusAssistant.selecionarDiscPorId() disponível, mas
 *     _pipelineConteudoAtivo ainda era false → chamada descartada
 *     silenciosamente.
 *
 *     Agora: init.js garante que _initResumo() (que liga
 *     _pipelineConteudoAtivo via NexusAssistant.init()) roda
 *     ANTES de _initQuiz() chamar notificarEntradaNoQuiz(). O
 *     polling em template_init.js permanece como fallback para
 *     cobrir casos de carregamento assíncrono tardio, mas agora
 *     notificarEntradaNoQuiz() em quiz/assistant.js v1.1 exige
 *     que pipelineAtivo() seja true antes de disparar
 *     selecionarDiscPorId(), eliminando o descarte silencioso
 *     mesmo nesse fallback.
 *
 * ── NÃO CONHECE ──────────────────────────────────────────────
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
      // Se a página declarou __NEXUS_CONTEXT__ mas core/context.js não foi
      // carregado, é uma falha de dependência — pipelines de conteúdo não
      // poderão ser ativados.
      if (window.__NEXUS_CONTEXT__ && Array.isArray(window.__NEXUS_CONTEXT__.tipos)
          && window.__NEXUS_CONTEXT__.tipos.length) {
        console.error('[NexusInit] NexusContext não encontrado mas __NEXUS_CONTEXT__ foi declarado. ' +
          'Verifique se core/context.js está carregado antes de init.js.');
      } else {
        // Sem declaração alguma: modo livre esperado — warn apenas.
        console.warn('[NexusInit] NexusContext não encontrado — usando contexto vazio.');
      }
      return null;
    }
    return window.NexusContext;
  }

  /* ══════════════════════════════════════════════════════════
     VERIFICAÇÃO DE DEPENDÊNCIAS
  ══════════════════════════════════════════════════════════ */

  function _depsUIok() {
    var ok = true;
    if (typeof window.NexusAssistant === 'undefined') {
      console.error('[NexusInit] NexusAssistant não encontrado.');
      ok = false;
    } else if (typeof window.NexusAssistant.initUI !== 'function') {
      console.error('[NexusInit] NexusAssistant.initUI() não encontrado. ' +
        'resumo/assistant.js deve expor initUI() separadamente de init().');
      ok = false;
    }
    return ok;
  }

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
     INICIALIZAÇÃO DA UI — SEMPRE, INDEPENDENTE DE CONTEXTO
  ══════════════════════════════════════════════════════════ */

  /**
   * Inicializa o chat e a UI.
   *
   * Chamado sempre — com ou sem __NEXUS_CONTEXT__.
   * NexusAssistant.initUI() configura o painel, os callbacks de envio
   * e o worker, mas NÃO carrega nem indexa nenhum conteúdo interno.
   *
   * @returns {boolean} true se a UI foi inicializada com sucesso
   */
  function _initUI() {
    if (!_depsUIok()) {
      console.error('[NexusInit] dependências de UI ausentes — chat não será inicializado.');
      return false;
    }
    console.log('[NexusInit] inicializando UI do chat.');
    window.NexusAssistant.initUI();
    return true;
  }

  /* ══════════════════════════════════════════════════════════
     INICIALIZAÇÃO POR DOMÍNIO DE CONTEÚDO
     Só chamados quando __NEXUS_CONTEXT__ declara o tipo.
  ══════════════════════════════════════════════════════════ */

  /**
   * Ativa o pipeline de conteúdo de resumo.
   *
   * Apenas conecta o carregamento/indexação ao chat já inicializado.
   * NexusAssistant.init() é o ponto de entrada — ele coordena
   * NexusLoader, NexusResumoSearch e o worker para conteúdo interno.
   *
   * @returns {boolean}
   */
  function _initResumo() {
    if (!_depsResumoOk()) {
      console.error('[NexusInit] dependências de resumo ausentes — pipeline de resumo abortado.');
      return false;
    }

    if (typeof window.NexusAssistant.init !== 'function') {
      console.error('[NexusInit] NexusAssistant.init() não encontrado. ' +
        'resumo/assistant.js deve expor init() para o pipeline de conteúdo.');
      return false;
    }

    console.log('[NexusInit] ativando pipeline de conteúdo: resumo');
    window.NexusAssistant.init();
    return true;
  }

  /**
   * Ativa o pipeline de conteúdo de quiz.
   *
   * Depende de resumo já estar ativo (compartilha o chat/worker do resumo).
   * Autoriza NexusQuizSearch e dispara NexusQuizAssistant.init().
   *
   * v1.1 (auditoria — Requisito 1): após NexusQuizAssistant.init(),
   * chama notificarEntradaNoQuiz() diretamente aqui, DEPOIS de
   * _initResumo() ter garantido que _pipelineConteudoAtivo é true
   * (via NexusAssistant.init()). Isso elimina a corrida original
   * em que o polling de template_init.js encontrava
   * selecionarDiscPorId() disponível mas o pipeline ainda não ativo,
   * resultando em descarte silencioso da chamada.
   *
   * O polling em template_init.js (_notificarDiscNoChat) é mantido
   * como mecanismo de fallback para casos de carregamento tardio,
   * e agora é inofensivo porque notificarEntradaNoQuiz() (v1.1) só
   * dispara selecionarDiscPorId() quando pipelineAtivo() confirma
   * que o pipeline está de fato ativo.
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

    console.log('[NexusInit] ativando pipeline de conteúdo: quiz — modo:', modo);
    window.NexusQuizAssistant.init();

    // v1.1 (auditoria — Requisito 1): seleciona a disciplina do quiz no
    // chat diretamente após init(), agora que _pipelineConteudoAtivo é
    // true (ligado por _initResumo() → NexusAssistant.init() antes deste
    // ponto). notificarEntradaNoQuiz() em quiz/assistant.js v1.1 valida
    // pipelineAtivo() internamente — se por algum motivo assíncrono ainda
    // não estiver pronto, vai continuar tentando via polling interno.
    var discQuiz = window.__NEXUS_QUIZ_DISC__;
    if (discQuiz && typeof window.NexusQuizAssistant.notificarEntradaNoQuiz === 'function') {
      window.NexusQuizAssistant.notificarEntradaNoQuiz(discQuiz);
    }
  }

  /**
   * Ativa o pipeline de conteúdo de games.
   *
   * Games é independente de resumo/quiz — não depende deles.
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

    console.log('[NexusInit] ativando pipeline de conteúdo: games');
    window.NexusGamesAssistant.init();
  }

  /* ══════════════════════════════════════════════════════════
     DISPARO
  ══════════════════════════════════════════════════════════ */

  function _init() {
    var ctx   = _contexto();
    var tipos = ctx ? ctx.getTipos() : [];

    // ── 1. UI nasce sempre ──────────────────────────────────
    // O chat existe independente de qualquer contexto declarado.
    // Sem UI, nada adianta — abortamos se ela falhar.
    var uiOk = _initUI();
    if (!uiOk) return;

    // ── 2. Sem tipos declarados: IA no modo livre ───────────
    // Nenhum conteúdo interno é carregado ou indexado.
    // O worker responde usando apenas seu conhecimento próprio.
    if (!tipos.length) {
      console.log('[NexusInit] nenhum contexto de conteúdo declarado — ' +
        'IA em modo livre (conhecimento próprio, sem conteúdo interno).');
      return;
    }

    console.log('[NexusInit] contextos de conteúdo declarados:', tipos);

    var temResumo = tipos.indexOf('resumo') !== -1;
    var temQuiz   = tipos.indexOf('quiz')   !== -1;
    var temGames  = tipos.indexOf('games')  !== -1;

    // ── 3. Pipeline de conteúdo: resumo ────────────────────
    // Quiz também depende do pipeline de resumo (compartilha worker/chat).
    // _initResumo() chama NexusAssistant.init(), que liga
    // _pipelineConteudoAtivo — necessário para que
    // selecionarDiscPorId() não descarte a chamada de
    // notificarEntradaNoQuiz() em _initQuiz() (v1.1).
    var resumoOk = false;
    if (temResumo || temQuiz) {
      resumoOk = _initResumo();
    }

    // ── 4. Pipeline de conteúdo: quiz ──────────────────────
    // Roda DEPOIS de _initResumo() — garante que _pipelineConteudoAtivo
    // já é true quando _initQuiz() chama notificarEntradaNoQuiz().
    if (temQuiz && resumoOk) {
      _initQuiz();
    } else if (temQuiz && !resumoOk) {
      console.warn('[NexusInit] quiz ignorado pois o pipeline de resumo falhou.');
    }

    // ── 5. Pipeline de conteúdo: games ─────────────────────
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