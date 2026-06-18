/**
 * NEXUS — shared/js/ia/quiz/assistant.js  v1.1 (auditoria)
 *
 * Extensão do sistema de IA para o contexto de Quiz.
 *
 * Responsabilidades:
 *   - Token de sessão de quiz (_quizToken, _contextoQuizAtivo)
 *   - Purge automático do contexto ao sair da página
 *   - Carregamento e indexação de questões via NexusQuizSearch
 *   - Detecção de número de questão na pergunta do usuário
 *   - Serialização de questão para o worker (com gabarito controlado por token)
 *   - Resposta sobre questões específicas via NexusWorker
 *   - Interceptação do fluxo de chat quando contexto de quiz está ativo
 *   - Sanitização de resultados (impede quiz de vazar fora do template)
 *   - Mensagem de boas-vindas própria do Quiz (NOVO v1.1 — Requisito 2)
 *
 * MUDANÇAS v1.1 (auditoria):
 *   + _mensagemBoasVindasQuiz(): mensagem de boas-vindas própria do
 *     Quiz, nunca reaproveitando o texto genérico do Resumo. Chamada
 *     de dentro de init() via window.NexusAssistant.renderBotMessage,
 *     para manter state.messages/sessionStorage sincronizados com o
 *     que é exibido na tela. Também exposta publicamente como
 *     NexusQuizAssistant.mensagemBoasVindas() para que
 *     resumo/assistant.js a use no reset de chat (botão "nova
 *     conversa") dentro do Quiz, preservando o Requisito 2 mesmo
 *     após um reset.
 *   + notificarEntradaNoQuiz(): agora só dispara
 *     selecionarDiscPorId() quando window.NexusAssistant.pipelineAtivo()
 *     confirma que o pipeline de conteúdo do Resumo já está ativo.
 *     Antes, bastava a função existir — o que podia ser verdade
 *     ANTES de init.js rodar NexusAssistant.init(), fazendo a chamada
 *     ser descartada silenciosamente (Requisito 1).
 *
 * NÃO conhece:
 *   - Fluxo de chat de resumo
 *   - Seleção de disciplina
 *   - Busca global de resumo
 *   - Localização de conteúdo
 *   - Comandos /disc
 *
 * Depende de:
 *   - core/context.js          (window.NexusContext)           — OBRIGATÓRIO
 *   - core/text-utils.js       (window.NexusTextUtils)
 *   - core/loader.js           (window.NexusLoader)
 *   - core/worker.js           (window.NexusWorker)
 *   - core/ui.js               (window.NexusUI)
 *   - quiz/search.js           (window.NexusQuizSearch)
 *   - resumo/assistant.js      (window.NexusAssistant — para interceptação,
 *                                renderBotMessage e pipelineAtivo)
 *   - window.__nexusCtx        (bridge de contexto)
 *   - window.__NEXUS_QUIZ_TOKEN__   (token de sessão, gerado por template_init.js)
 *   - window.__NEXUS_QUIZ_MODO__    (modo ativo: 'AP1', 'AP2', etc.)
 *   - window.__NEXUS_QUESTOES_VISUAIS__ (ordem visual das questões, opcional)
 *
 * API pública: window.NexusQuizAssistant
 *   - init()  — ponto de entrada explícito, chamado exclusivamente por init.js.
 *     NÃO se auto-inicializa via DOMContentLoaded.
 *   - interceptar(pergunta, disc, renderBot, workerPerguntar) → Promise<boolean>
 *     Retorna true se tratou a pergunta; false se deve seguir para o resumo.
 *   - contextoAtivo() — verificação OPERACIONAL (NexusContext + token + modo).
 *     Distinto de NexusQuizSearch.contextoAtivo() — ver comentário no export.
 *   - mensagemBoasVindas(renderBotFn) — NOVO: renderiza a mensagem de
 *     boas-vindas própria do Quiz usando a função de render recebida.
 *
 * INVARIANTE:
 *   Fora do template_init (sem __NEXUS_QUIZ_TOKEN__ válido):
 *     - Nenhuma função deste módulo envia dados de questão ao worker
 *     - indexarQuestoes() é no-op
 *     - buscarQuiz() retorna []
 *     - buscarQuestaoPorNumero() retorna null
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     TOKEN E CONTEXTO DE QUIZ

     Dois níveis de verificação, com papéis distintos:

     _quizToken()
       Requisito operacional de sessão. Retorna o token ativo
       ou null. Não consulta NexusContext — é uma leitura direta
       de window.__NEXUS_QUIZ_TOKEN__.

     _contextoQuizAtivo()
       Portão completo. Reúne os três requisitos:
         1. NexusContext.temTipo('quiz') — domínio declarado na página
         2. _quizToken() !== null        — sessão autorizada pelo template
         3. __NEXUS_QUIZ_MODO__ definido — modo de avaliação ativo
       Todos devem ser true. Falha em qualquer um retorna false.

     NexusContext é tratado como dependência obrigatória: se não existir,
     _contextoQuizAtivo() loga erro e retorna false — não há fallback.
  ══════════════════════════════════════════════════════════ */

  function _quizToken() {
    var t = window.__NEXUS_QUIZ_TOKEN__;
    if (!t || typeof t !== 'string') return null;
    return t;
  }

  function _contextoQuizAtivo() {
    // NexusContext é dependência obrigatória (carregado por core/context.js
    // antes de qualquer módulo de IA). Se ausente, algo falhou no boot —
    // não tentamos operar sem ele.
    if (typeof window.NexusContext === 'undefined') {
      console.error('[NexusQuizAssistant] NexusContext não encontrado — contexto de quiz inativo.');
      return false;
    }
    if (!window.NexusContext.temTipo('quiz')) return false;
    return _quizToken() !== null && window.__NEXUS_QUIZ_MODO__ !== undefined;
  }

  /* ══════════════════════════════════════════════════════════
     PURGE DO CONTEXTO DE QUIZ
  ══════════════════════════════════════════════════════════ */

  function _purgarContextoQuiz() {
    _ultimoContexto           = null;
    _ultimoMapaVisualRastreio = null;
    _modoAtivo                = null;
    _discAtivo                = null;

    try { delete window.__NEXUS_QUIZ_MODO__; } catch (e) {}

    // NexusSearch é um alias de compatibilidade que aponta para as mesmas
    // funções de NexusQuizSearch (Object.assign em quiz/search.js).
    // Chamar os dois seria invocar revogarQuiz() duas vezes na mesma sessão.
    // Mantemos apenas NexusQuizSearch — fonte canônica do domínio quiz.
    if (typeof window.NexusQuizSearch !== 'undefined') {
      NexusQuizSearch.revogarQuiz();
    }

    // NOTA: __NEXUS_CONTEXT__ não é alterado aqui intencionalmente.
    // Ele pertence à página, não à sessão de quiz. Após o purge,
    // NexusContext.temTipo('quiz') ainda retorna true, mas
    // _contextoQuizAtivo() retorna false porque token e modo foram
    // deletados — portanto a guarda operacional funciona corretamente.
    try { delete window.__NEXUS_QUIZ_TOKEN__; } catch (e) {}

    // NOTA (auditoria): a limpeza do histórico de chat (nexus_chat_history,
    // worker) NÃO é feita aqui de propósito — é responsabilidade do boot da
    // PRÓXIMA página, via NexusCtx (declarar()/deveResetar()), que já detecta
    // a troca de contexto e descarta o histórico de forma centralizada.
    // Duplicar essa limpeza aqui não é necessário e foi intencionalmente
    // removido em template_init.js v9.1 pelo mesmo motivo.

    _limparDiscNaUI();

    console.log('[NexusQuizAssistant] contexto de quiz purgado.');
  }

  (function _instalarListenersPurge() {
    window.addEventListener('beforeunload', _purgarContextoQuiz);
    window.addEventListener('pagehide',     _purgarContextoQuiz);

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && !_contextoQuizAtivo()) {
        _purgarContextoQuiz();
      }
    });
  }());

  /* ══════════════════════════════════════════════════════════
     NOTIFICAÇÃO DE CONTEXTO PARA O CHAT
  ══════════════════════════════════════════════════════════ */

  /**
   * Notifica o assistente de resumo que entramos em contexto de quiz,
   * forçando a seleção automática da disciplina no chat.
   *
   * Chamado por template_init.js (via _notificarDiscNoChat) e por init.js.
   * Usa selecionarDiscPorId (exposto por resumo/assistant.js) com
   * { silencioso: true } — atualiza só o badge sem mensagem no chat.
   *
   * v1.1 (auditoria — Requisito 1): além de existir, exigimos que
   * window.NexusAssistant.pipelineAtivo() seja true antes de chamar
   * selecionarDiscPorId(). Antes, bastava a função existir no objeto
   * NexusAssistant — o que é verdade desde que resumo/assistant.js
   * termina de carregar, MAS ANTES de init.js executar
   * NexusAssistant.init() (que é quem liga o pipeline). Como
   * resumo/assistant.js carrega antes de quiz/assistant.js e de
   * init.js na cadeia de _carregarIA() do template_init.js, existia
   * uma janela real em que esse polling encontrava a função "pronta"
   * e a chamava — mas selecionarDiscPorId() descartava a chamada
   * silenciosamente porque _pipelineConteudoAtivo ainda era false.
   * Com essa checagem extra, o polling só dispara quando a chamada
   * de fato terá efeito.
   *
   * @param {string} discId — id da disciplina (ex: 'design', 'poo')
   */
  function notificarEntradaNoQuiz(discId) {
    if (!discId) return;

    var tentativas     = 0;
    var MAX_TENTATIVAS = 50; // 5s no total

    var intervalo = setInterval(function () {
      tentativas++;

      var assistente = window.NexusAssistant;
      var pronto = assistente &&
                   typeof assistente.selecionarDiscPorId === 'function' &&
                   typeof assistente.pipelineAtivo === 'function' &&
                   assistente.pipelineAtivo();

      if (pronto) {
        clearInterval(intervalo);
        assistente.selecionarDiscPorId(discId, { silencioso: true });
        console.log('[NexusQuizAssistant] disciplina "' + discId + '" selecionada automaticamente no chat.');
        return;
      }

      if (tentativas >= MAX_TENTATIVAS) {
        clearInterval(intervalo);
        console.warn('[NexusQuizAssistant] NexusAssistant não disponível/pronto — notificação falhou.');
      }
    }, 100);
  }

  function _limparDiscNaUI() {
    var assistente = window.NexusAssistant;
    if (assistente && typeof assistente.limparDisc === 'function') {
      assistente.limparDisc();
    } else if (typeof window.NexusUI !== 'undefined') {
      NexusUI.atualizarDiscAtiva(null);
    }
  }

  /* ══════════════════════════════════════════════════════════
     MENSAGEM DE BOAS-VINDAS PRÓPRIA DO QUIZ (Requisito 2)
  ══════════════════════════════════════════════════════════ */

  /**
   * Renderiza a mensagem de boas-vindas específica do Quiz.
   *
   * NUNCA reaproveita o texto genérico de boas-vindas do Resumo
   * (_mostrarBoasVindas / _mostrarBoasVindasLivre em resumo/assistant.js).
   *
   * @param {Function} renderBotFn — função de render que mantém
   *   state.messages/sessionStorage sincronizados (normalmente
   *   window.NexusAssistant.renderBotMessage).
   */
  function _mensagemBoasVindasQuiz(renderBotFn) {
    if (typeof renderBotFn !== 'function') return;

    var modo = window.__NEXUS_QUIZ_MODO__ || '';
    var rotuloModo = modo ? ' — ' + modo.toUpperCase() : '';

    renderBotFn(
      '📝 Modo Quiz' + rotuloModo + '\n\n' +
      'Pode me perguntar sobre qualquer questão deste quiz — por exemplo:\n' +
      '  "explica a questão 3"\n' +
      '  "por que a alternativa B está errada?"\n\n' +
      'Pedidos de gabarito só são respondidos aqui, dentro do quiz.'
    );
  }

  /* ══════════════════════════════════════════════════════════
     DETECÇÃO DE PEDIDO DE GABARITO
  ══════════════════════════════════════════════════════════ */

  /**
   * Verifica se a pergunta é um pedido EXPLÍCITO de gabarito/resposta.
   * Retorna false para perguntas de explicação, análise ou estudo.
   *
   * TRUE:  "qual o gabarito?", "qual é a resposta?", "qual a letra correta?",
   *        "me dá a resposta", "resposta correta", "gabarito da 3"
   *
   * FALSE: "me explica a questão 1", "qual assunto aborda?",
   *        "por que essa alternativa está errada?", "questão 3",
   *        "essa questão fala sobre TCP?", "explique a questão 5"
   */
  function _ehPedidoDeGabarito(pergunta) {
    if (/\b(gabarito|resposta\s+certa|resposta\s+correta)\b/i.test(pergunta)) return true;
    if (/qual\s+(é\s+)?a?\s*(resposta|alternativa\s+(certa|correta)|letra)\b/i.test(pergunta)) return true;
    if (/me\s+(d[aá]|pass[ae]|fal[ae])\s+(a\s+)?resposta\b/i.test(pergunta)) return true;
    if (/^[éeÉ]\s+[aAoO]\s+[A-Ea-e]\s*[\)\.]/.test(pergunta.trim())) return true;
    return false;
  }

  /* ══════════════════════════════════════════════════════════
     SANITIZAÇÃO DE RESULTADOS
  ══════════════════════════════════════════════════════════ */

  function sanitizarResultados(resultados) {
    if (!resultados || !resultados.length) return resultados;
    if (_contextoQuizAtivo()) return resultados;

    return resultados.filter(function (r) {
      if (r.secao === 'Quiz') return false;
      if (typeof r.secao === 'string' && r.secao.includes('/feedback')) return false;
      if (typeof r.texto === 'string') {
        if (/^Gabarito:\s*[A-E]\b/m.test(r.texto))          return false;
        if (/^Feedback oficial:/m.test(r.texto))             return false;
        if (/^Alternativas:\s*\n\s*[A-E]\)/m.test(r.texto)) return false;
      }
      return true;
    });
  }

  /* ══════════════════════════════════════════════════════════
     RASTREAMENTO DO MAPA VISUAL
     Detecta quando __NEXUS_QUESTOES_VISUAIS__ foi substituído
     (reinício ou filtro) para forçar reindexação da IA.
  ══════════════════════════════════════════════════════════ */

  /**
   * Referência ao array __NEXUS_QUESTOES_VISUAIS__ da última indexação.
   * Comparação por identidade (===) detecta substituição do array.
   */
  var _ultimoMapaVisual = null;

  /* ══════════════════════════════════════════════════════════
     CONTEXTO EXPLÍCITO DA ÚLTIMA QUESTÃO DISCUTIDA

     Permite que perguntas de acompanhamento sem número explícito
     ("por que a alternativa B está errada?", "e a resposta?",
     "essa está errada?") sejam resolvidas para a MESMA questão
     visual já tratada na resposta anterior — sem qualquer busca
     textual ou aproximação.

     _ultimoContexto = { tipo: 'questao', visual: N, original: M }
       visual   — número exibido ao usuário (base 1, índice em
                   __NEXUS_QUESTOES_VISUAIS__)
       original — índice original da questão no arquivo ques_*
                   (q.__qiOriginal__), guardado apenas para
                   diagnóstico/logs — a busca em si sempre usa
                   o número visual via buscarQuestaoPorNumero().

     É invalidado sempre que __NEXUS_QUESTOES_VISUAIS__ é substituído
     (reinício, filtro de aulas) — a referência anterior não tem mais
     correspondência garantida com a nova ordem visual.
  ══════════════════════════════════════════════════════════ */

  var _ultimoContexto           = null;
  var _ultimoMapaVisualRastreio = null;

  /* ══════════════════════════════════════════════════════════
     RASTREAMENTO DE MODO E DISCIPLINA ATIVOS

     Quando modo ou disciplina mudam dentro da mesma sessão
     (sem reload de página), o histórico do worker e o contexto
     da última questão discutida são zerados para que o chat
     não carregue contexto obsoleto do modo/disciplina anterior.
  ══════════════════════════════════════════════════════════ */

  var _modoAtivo = null;
  var _discAtivo = null;

  /**
   * Registra a questão visual atualmente em discussão.
   * @param {number} numeroVisual
   * @param {object} q — objeto visual retornado por buscarQuestaoPorNumero()
   */
  function _registrarContexto(numeroVisual, q) {
    _ultimoContexto = {
      tipo:     'questao',
      visual:   numeroVisual,
      original: (q && typeof q.__qiOriginal__ === 'number') ? q.__qiOriginal__ : null,
    };
  }

  /**
   * Se __NEXUS_QUESTOES_VISUAIS__ foi substituído desde a última
   * pergunta, zera o contexto da última questão discutida.
   */
  function _resetRastreioSeMapaMudou() {
    var atual = window.__NEXUS_QUESTOES_VISUAIS__;
    if (atual && atual.length && atual !== _ultimoMapaVisualRastreio) {
      _ultimoContexto           = null;
      _ultimoMapaVisualRastreio = atual;
    }
  }

  /**
   * Retorna true se o mapa visual foi substituído desde a última indexação.
   * @returns {boolean}
   */
  function _mapaVisualMudou() {
    var atual = window.__NEXUS_QUESTOES_VISUAIS__;
    if (!atual || !atual.length) return false;
    return atual !== _ultimoMapaVisual;
  }

  /**
   * Detecta mudança de modo ou disciplina e reseta o chat se necessário.
   * Chamado no início de cada interceptar() para garantir que o histórico
   * do worker não carregue contexto de um modo/disciplina anterior.
   *
   * Cobre dois casos:
   *   - __NEXUS_QUIZ_MODO__ mudou  (ex: AP1 → AP2 dentro da mesma sessão)
   *   - __NEXUS_QUIZ_DISC__ mudou  (disciplina trocada sem reload)
   *
   * O mapa visual (__NEXUS_QUESTOES_VISUAIS__) já dispara reindexação
   * via _mapaVisualMudou(); aqui cuidamos apenas do histórico de chat
   * e do contexto de última questão discutida.
   */
  function _resetarChatSeContextoMudou() {
    var modoAtual = window.__NEXUS_QUIZ_MODO__;
    var discAtual = window.__NEXUS_QUIZ_DISC__;

    var modoMudou = _modoAtivo !== null && _modoAtivo !== modoAtual;
    var discMudou = _discAtivo !== null && _discAtivo !== discAtual;

    if (modoMudou || discMudou) {
      console.log(
        '[NexusQuizAssistant] contexto mudou (' +
        (modoMudou ? 'modo: ' + _modoAtivo + ' → ' + modoAtual : '') +
        (modoMudou && discMudou ? ', ' : '') +
        (discMudou ? 'disc: ' + _discAtivo + ' → ' + discAtual : '') +
        ') — resetando chat.'
      );

      // Zera o contexto da última questão discutida
      _ultimoContexto           = null;
      _ultimoMapaVisualRastreio = null;

      // Limpa histórico do worker para não vazar contexto do modo/disc anterior
      if (typeof window.NexusWorker !== 'undefined' &&
          typeof window.NexusWorker.limparHistorico === 'function') {
        window.NexusWorker.limparHistorico();
      }
    }

    // Atualiza referências para a próxima comparação
    _modoAtivo = modoAtual || _modoAtivo;
    _discAtivo = discAtual || _discAtivo;
  }

  function _getCtxBridge() {
    return window.__nexusCtx || null;
  }

  function _montarCtxQuiz(disc) {
    const ctx = _getCtxBridge();
    if (!ctx || !disc) return null;
    const sem    = ctx.getSemestre();
    const parsed = ctx.parseSemestre(sem);

    const prefixo   = (ctx.getPrefixoQuiz   && ctx.getPrefixoQuiz())   || 'ques_';
    const varGlobal = (ctx.getVarGlobalQuiz && ctx.getVarGlobalQuiz()) || 'questoes';

    return {
      ano:       parsed.ano,
      periodo:   parsed.periodo,
      ap:        parsed.ap,
      arquivo:   disc.arquivo,
      fonte:     'quiz',
      prefixo,
      varGlobal,
    };
  }

  /* ══════════════════════════════════════════════════════════
     INDEXAÇÃO DE QUESTÕES
  ══════════════════════════════════════════════════════════ */

  async function _garantirIndexacaoQuiz(disc) {
    if (!_contextoQuizAtivo()) return null;

    const token = _quizToken();
    const modo  = window.__NEXUS_QUIZ_MODO__;

    // Força reindexação se __NEXUS_QUESTOES_VISUAIS__ foi substituído
    // (acontece em reiniciar() e _aplicarFiltro() no quiz_engine)
    if (_mapaVisualMudou()) {
      console.log('[NexusQuizAssistant] mapa visual mudou — reindexando questões.');
      NexusQuizSearch.limparIndiceQuiz(token);
    }

    if (NexusQuizSearch.estaIndexadoQuiz(token)) {
      // Atualiza referência visual mesmo em cache hit para manter _ultimoMapaVisual
      // sincronizado após reinício detectado acima
      _ultimoMapaVisual = window.__NEXUS_QUESTOES_VISUAIS__ || _ultimoMapaVisual;
      return window.questoes || null;
    }

    // ── Aguarda __NEXUS_QUESTOES_VISUAIS__ estar disponível ────────────
    // O quiz_engine o seta após criarCopiaEmbaralhada(). Se a IA indexar
    // antes disso (timing), forçamos uma espera curta para garantir que
    // a indexação use sempre o mapeamento visual correto.
    var visuais = window.__NEXUS_QUESTOES_VISUAIS__;
    if (!visuais || !visuais.length) {
      visuais = await new Promise(function (resolve) {
        var tentativas = 0;
        var MAX = 20; // 1s no máximo (20 × 50ms)
        var timer = setInterval(function () {
          tentativas++;
          var v = window.__NEXUS_QUESTOES_VISUAIS__;
          if ((v && v.length) || tentativas >= MAX) {
            clearInterval(timer);
            resolve(v || null);
          }
        }, 50);
      });
    }

    const loaderCtx = _montarCtxQuiz(disc);
    if (!loaderCtx) return null;

    const questoes = await NexusLoader.carregar(loaderCtx);
    if (!questoes) return null;

    NexusQuizSearch.indexarQuestoes(questoes, modo, token);

    // Registra o mapa visual atual como referência para próxima comparação
    _ultimoMapaVisual = window.__NEXUS_QUESTOES_VISUAIS__ || null;

    return questoes;
  }

  /* ══════════════════════════════════════════════════════════
     PALAVRAS NEUTRAS DE REFERÊNCIA À QUESTÃO

     Conjunto de palavras que, isoladas, não carregam conteúdo
     técnico — apenas indicam que o usuário está falando SOBRE
     uma questão (verbos de pedido, pronomes, conectores, termos
     do próprio domínio "questão/alternativa/resposta").
     Usado para decidir se um número solto na frase ("a 1",
     "explica 1") é referência à questão ou parte do conteúdo
     ("o IPv4 possui 32 bits").

     Reaproveita window.NexusTextUtils.STOPWORDS (que já cobre boa
     parte dos verbos de pedido — explica, fala, mostra, resuma,
     diga, descreva — e pronomes/conectores) e complementa com
     termos específicos do domínio de quiz.
  ══════════════════════════════════════════════════════════ */

  var PALAVRAS_REFERENCIA_EXTRA = new Set([
    'a', 'o', 'as', 'os', 'e', 'ou', 'que', 'se', 'com', 'sobre',
    'da', 'do', 'na', 'no', 'em', 'pra', 'pro', 'para', 'por',
    'ela', 'ele', 'isto',
    'questao', 'questoes', 'pergunta', 'perguntas',
    'alternativa', 'alternativas', 'opcao', 'opcoes',
    'letra', 'letras', 'item', 'itens',
    'resposta', 'respostas', 'gabarito',
    'correta', 'correto', 'certa', 'certo',
    'errada', 'errado', 'incorreta', 'incorreto',
    'assunto', 'assuntos', 'significa', 'significado',
    'trata', 'tratando', 'aborda', 'abordar',
    'conta', 'conte', 'contar',
    'descreve', 'descreva', 'descrever',
    'analisa', 'analise', 'analisar',
    'comenta', 'comente', 'comentar',
    'responde', 'responda', 'responder',
    'entendi', 'entender', 'compreendi', 'compreender',
  ]);

  /**
   * Retorna true se a palavra normalizada não carrega conteúdo
   * técnico — ou é uma stopword geral, um termo neutro de
   * referência a questão, ou uma letra de alternativa (a-e).
   *
   * @param {string} palavra — token já normalizado
   * @returns {boolean}
   */
  function _ehPalavraDeReferencia(palavra) {
    if (!palavra) return true;
    var u = window.NexusTextUtils;
    return u.STOPWORDS.has(palavra)
        || PALAVRAS_REFERENCIA_EXTRA.has(palavra)
        || /^[a-e]$/.test(palavra);
  }

  /**
   * Verifica se, removendo o número da frase, tudo o que resta
   * são palavras neutras de referência (verbos de pedido,
   * pronomes, conectores, vocabulário de quiz).
   *
   * Ex.: "me explica a 1"      → resta "me explica a"      → true
   *      "fala sobre a 1"      → resta "fala sobre a"      → true
   *      "tenho 20 minutos"    → resta "tenho minutos"     → false
   *      "o ipv4 possui 32 bits" → resta "o ipv4 possui bits" → false
   *
   * @param {string} normSemNumero — texto normalizado, com o
   *   número já removido
   * @returns {boolean}
   */
  function _restanteEhReferencia(normSemNumero) {
    var tokens = normSemNumero.split(' ').filter(Boolean);
    return tokens.every(_ehPalavraDeReferencia);
  }

  /* ══════════════════════════════════════════════════════════
     DETECÇÃO DE NÚMERO DE QUESTÃO
  ══════════════════════════════════════════════════════════ */

  function _detectarNumeroQuestao(texto) {
    var norm = window.NexusTextUtils.normalizarTexto(texto.trim());
    var padroes = [
      /\bquest(?:ao|oes?)?\s*n?[o°]?\s*(\d+)\b/,
      /\bq\s*(\d+)\b/,
      /#(\d+)\b/,
      /\bnumero\s+(\d+)\b/,
      /\b(\d+)[aª]\s*quest/,
      // "resposta da 1", "explica a 2", "vamos pra 3", "vou pro 4"
      /\b(?:da|do|na|no|pra|pro|essa|esta|aquela)\s+(\d+)\b/,
    ];
    for (var i = 0; i < padroes.length; i++) {
      var m = norm.match(padroes[i]);
      if (m) return parseInt(m[1], 10);
    }

    // ── Último recurso: número solto na frase ──────────────────────────
    // "me explica a 1", "fala da 1", "a 1", "1", "e a 1?", "resuma a 1"...
    //
    // Só é aceito como referência à questão se:
    //   (a) estiver dentro do intervalo de questões do quiz atual, E
    //   (b) o restante da frase (sem o número) for composto apenas
    //       por palavras neutras de referência — caso contrário o
    //       número é parte do CONTEÚDO ("o IPv4 possui 32 bits",
    //       "a porta 443 usa HTTPS", "o exercício tem 15 linhas").
    var bare = norm.match(/\b(\d+)\b/);
    if (bare) {
      var n = parseInt(bare[1], 10);
      var visuais = window.__NEXUS_QUESTOES_VISUAIS__;
      var dentroDoIntervalo = !visuais || !visuais.length || (n >= 1 && n <= visuais.length);

      if (dentroDoIntervalo) {
        var semNumero = (norm.slice(0, bare.index) + ' ' + norm.slice(bare.index + bare[0].length)).trim();
        if (_restanteEhReferencia(semNumero)) {
          return n;
        }
      }
    }

    return null;
  }

  /* ══════════════════════════════════════════════════════════
     REFERÊNCIA IMPLÍCITA À ÚLTIMA QUESTÃO DISCUTIDA
  ══════════════════════════════════════════════════════════ */

  /**
   * Detecta perguntas de acompanhamento que se referem à questão
   * discutida na interação anterior, sem citar um número.
   *
   * TRUE:  "por que a alternativa B está errada?", "e a B?",
   *        "e a opção C?", "essa questão fala sobre o quê?",
   *        "por que essa está certa?", "explica essa alternativa",
   *        "e a resposta?", "essa está errada?", "qual o assunto?",
   *        "essa questão fala sobre MVC?"
   *
   * Só é consultada quando _detectarNumeroQuestao() não encontra
   * número algum E existe um _ultimoContexto registrado.
   */
  function _referenciaImplicita(texto) {
    var norm = window.NexusTextUtils.normalizarTexto(texto);

    // "alternativa B", "opcao c", "letra D", "item a"
    if (/\b(alternativa|opcao|letra|item)\s*[a-e]\b/.test(norm)) return true;

    // "e a b?", "e a c?" — referência curta a uma alternativa
    if (/^e\s+[ao]\s*[a-e]\b/.test(norm)) return true;

    // "essa/esta/nessa/nesta/dessa/desta/aquela questao/pergunta/alternativa/opcao"
    if (/\b(essa|esta|nessa|nesta|dessa|desta|aquela)\s+(questao|pergunta|alternativa|opcao)\b/.test(norm)) return true;

    // "por que está certa/errada?", "ela está certa?", "essa está errada?"
    if (/\b(certa|certo|errada|errado|correta|correto|incorreta|incorreto)\b/.test(norm)) return true;

    // "e a resposta?", "qual a resposta?", "qual o gabarito?"
    if (/\b(resposta|gabarito)\b/.test(norm)) return true;

    // "qual o assunto?", "o que isso significa?", "sobre o que ela fala?",
    // "essa questão aborda o quê?"
    if (/\b(assunto|significa|significado|aborda|abordar|trata|tratando)\b/.test(norm)) return true;

    return false;
  }

  /* ══════════════════════════════════════════════════════════
     SERIALIZAÇÃO DE QUESTÃO
  ══════════════════════════════════════════════════════════ */

  /**
   * Serializa uma questão para envio ao worker.
   *
   * A questão recebida (q) SEMPRE vem de __NEXUS_QUESTOES_VISUAIS__
   * (via buscarQuestaoPorNumero) — ou seja, é o objeto exato que o
   * quiz_engine usa para renderizar a tela. Por isso:
   *
   *   q.options  = alternativas na ordem VISUAL (embaralhada)
   *   q.answer   = índice da correta na ordem VISUAL
   *   q.feedback = já reescrito com a letra visual correta
   *
   * O worker recebe tudo alinhado com o que o usuário vê.
   * O campo __qiOriginal__ (índice no arquivo original) é ignorado —
   * é dado interno do engine e irrelevante para a IA.
   *
   * @param {number} numero — número visual (base 1)
   * @param {object} q     — objeto de questão visual de __NEXUS_QUESTOES_VISUAIS__
   * @returns {string}
   */
  function _serializarQuestao(numero, q) {
    var visuais = window.__NEXUS_QUESTOES_VISUAIS__;
    var totalQuestoes = visuais ? visuais.length : '?';

    var linhas = [
      // Nota de desambiguação: o usuário pode ter perguntado usando
      // apenas o número ("me explica a 1", "qual a resposta da 2?").
      // Sem isso, alguns modelos confundem esse número com itens/regras
      // numeradas do PRÓPRIO prompt de sistema do worker e respondem
      // sobre "a regra 1" em vez da questão do quiz.
      'NOTA: se a pergunta do usuário citar apenas um número (ex.: "1", "a 1", ' +
      '"questão 1"), esse número se refere À QUESTÃO ' + numero + ' DESTE QUIZ, ' +
      'detalhada abaixo — não a regras, passos ou itens numerados das suas ' +
      'próprias instruções.',
      '',
      'Questão ' + numero + ' de ' + totalQuestoes +
      (q.aula ? ' (' + q.aula + ')' : '') + ':'
    ];

    if (q.texto)    linhas.push('Contexto: ' + q.texto);
    if (q.question) linhas.push('Enunciado: ' + q.question);

    if (Array.isArray(q.assertions)) {
      linhas.push('Afirmativas:');
      q.assertions.forEach(function (a) { linhas.push('  ' + a); });
    }

    // Alternativas na ordem VISUAL — exatamente como aparecem na tela.
    // q.options já foi embaralhado pelo quiz_engine; q.answer é o índice
    // correto nessa ordem embaralhada. Nenhuma tradução necessária.
    if (Array.isArray(q.options)) {
      linhas.push('Alternativas (exatamente como aparecem na tela para o usuário):');
      q.options.forEach(function (opt, i) {
        var letra   = String.fromCharCode(65 + i);
        var marcador = (typeof q.answer === 'number' && _contextoQuizAtivo() && i === q.answer)
          ? ' ← correta'
          : '';
        linhas.push('  ' + letra + ') ' + opt + marcador);
      });
    }

    // Gabarito e feedback: SOMENTE dentro do template de quiz com token válido.
    // q.answer e q.feedback já foram recalculados pelo quiz_engine para a
    // ordem visual — correspondem exatamente ao que o usuário está vendo.
    if (_contextoQuizAtivo()) {
      if (typeof q.answer === 'number') {
        var gabarito = String.fromCharCode(65 + q.answer);
        linhas.push('Gabarito (letra visual): ' + gabarito + ')');
      }
      if (q.feedback) linhas.push('Feedback oficial: ' + q.feedback);
    }

    return linhas.join('\n');
  }

  /* ══════════════════════════════════════════════════════════
     RESPOSTA SOBRE QUESTÃO
  ══════════════════════════════════════════════════════════ */

  async function _responderSobreQuestao(pergunta, ctxQuestao, disc, renderBot) {
    if (!_contextoQuizAtivo()) {
      renderBot('Esta função está disponível apenas dentro do quiz. 📝');
      return true;
    }

    if (typeof window.NexusWorker !== 'undefined') {
      const resultadoFake = [{ score: 100, texto: ctxQuestao, aula: '', secao: 'Quiz' }];
      let respostaIA = null;
      try {
        respostaIA = await NexusWorker.perguntar({
          pergunta:     pergunta,
          resultados:   resultadoFake,
          disciplina:   disc.id,
          tipoContexto: 'conteudo',
          semContexto:  false,
        });
      } catch (e) {
        console.warn('[NexusQuizAssistant] _responderSobreQuestao erro worker:', e);
      }
      if (respostaIA) {
        const rodape = (respostaIA.fonte || respostaIA.modelo) ? {
          linha1: ['IA: ' + (respostaIA.fonte || ''), respostaIA.modelo || ''].filter(Boolean).join(' · '),
          linha2: 'fonte: questões do quiz',
        } : null;
        renderBot(respostaIA.texto, rodape);
        return true;
      }
    }

    // Fallback: exibe o contexto da questão diretamente
    renderBot(ctxQuestao);
    return true;
  }

  /* ══════════════════════════════════════════════════════════
     INTERCEPTAÇÃO DO FLUXO DE CHAT
  ══════════════════════════════════════════════════════════ */

  /**
   * Tenta tratar a mensagem no contexto de quiz.
   *
   * Chamado por resumo/assistant.js dentro de _executarBuscaNaDisc()
   * ANTES das verificações de resumo, quando o contexto de quiz está ativo.
   *
   * Fora do quiz:
   *   - Pedidos EXPLÍCITOS de gabarito → mensagem direcionando ao quiz (sem /disc)
   *   - Perguntas de explicação/análise → retorna false (fluxo normal de resumo)
   *
   * Dentro do quiz:
   *   - Questão com número → lê diretamente de __NEXUS_QUESTOES_VISUAIS__ (sem indexação)
   *   - Pergunta geral     → busca por texto no índice de questões (com indexação)
   *
   * A busca por número usa __NEXUS_QUESTOES_VISUAIS__ como fonte de verdade,
   * garantindo que a IA veja exatamente o mesmo estado que o usuário.
   */
  async function interceptar(pergunta, disc, renderBot) {
    // Detecta mudança de modo/disc e reseta o chat se necessário
    _resetarChatSeContextoMudou();

    if (!_contextoQuizAtivo()) {
      // Se há contexto de jogo ativo (ex: Show do Milhão), NÃO bloqueia — o
      // NexusGamesAssistant tratará a pergunta no fluxo normal de resumo/assistant.js.
      var gamesAtivo = typeof window.NexusGamesAssistant !== 'undefined' &&
                       window.NexusGamesAssistant.contextoAtivo();

      if (_ehPedidoDeGabarito(pergunta) && !gamesAtivo) {
        renderBot(
          'Perguntas sobre gabarito e respostas só podem ser respondidas dentro do Quiz da disciplina.\n\n' +
          'Abra o Quiz correspondente e faça a pergunta novamente. 📝'
        );
        return true;
      }
      return false;
    }

    const numQ = _detectarNumeroQuestao(pergunta);

    // ── Mapa visual pode ter sido substituído (reinício/filtro) ─────────
    // Invalida a referência da última questão discutida nesse caso.
    _resetRastreioSeMapaMudou();

    // ── Sem número explícito: tenta resolver por referência implícita ──
    // Ex: "por que a alternativa B está errada?" após já termos
    // discutido a questão N. Reaproveita a mesma questão visual —
    // nunca busca por aproximação textual.
    var numQResolvido = numQ;
    if (numQResolvido === null && _ultimoContexto !== null && _referenciaImplicita(pergunta)) {
      numQResolvido = _ultimoContexto.visual;
    }

    // ── Busca por número: usa __NEXUS_QUESTOES_VISUAIS__ diretamente ────
    // Não depende de indexação — vai direto ao mapeamento atual do engine.
    // A indexação (para busca por texto) ainda acontece em _interceptarBuscaQuiz.
    if (numQResolvido !== null) {
      const token = _quizToken();

      // buscarQuestaoPorNumero agora usa __NEXUS_QUESTOES_VISUAIS__ como
      // fonte primária — retorna o objeto visual sem necessidade de indexação
      const q = NexusQuizSearch.buscarQuestaoPorNumero(numQResolvido, token);

      if (!q) {
        // Verifica se o número está fora do intervalo para dar mensagem útil
        var visuais = window.__NEXUS_QUESTOES_VISUAIS__;
        var total   = visuais ? visuais.length : '?';
        renderBot('Questão ' + numQResolvido + ' não encontrada. O quiz atual tem ' + total + ' questões.');
        return true;
      }

      _registrarContexto(numQResolvido, q);

      const ctxQuestao = _serializarQuestao(numQResolvido, q);
      await _responderSobreQuestao(pergunta, ctxQuestao, disc, renderBot);
      return true;
    }

    // ── Busca por texto: usa índice (requer indexação) ───────────────────
    return await _interceptarBuscaQuiz(pergunta, disc, renderBot);
  }

  /**
   * Trata perguntas gerais sobre o quiz (não por número de questão).
   * Usa buscarQuiz() para encontrar questões relevantes pelo texto.
   */
  async function _interceptarBuscaQuiz(pergunta, disc, renderBot) {
    const token = _quizToken();

    const questoes = await _garantirIndexacaoQuiz(disc);
    if (!questoes) return false;

    const resultados = NexusQuizSearch.buscarQuiz(
      pergunta,
      { topK: 8, minScore: 15 },
      token
    );

    if (!resultados || !resultados.length) return false;

    if (typeof window.NexusWorker !== 'undefined') {
      let respostaIA = null;
      try {
        respostaIA = await NexusWorker.perguntar({
          pergunta:     pergunta,
          resultados:   resultados,
          disciplina:   disc.id,
          tipoContexto: 'conteudo',
          semContexto:  false,
        });
      } catch (e) {
        console.warn('[NexusQuizAssistant] _interceptarBuscaQuiz erro worker:', e);
      }
      if (respostaIA) {
        const rodape = (respostaIA.fonte || respostaIA.modelo) ? {
          linha1: ['IA: ' + (respostaIA.fonte || ''), respostaIA.modelo || ''].filter(Boolean).join(' · '),
          linha2: 'fonte: questões do quiz',
        } : null;
        renderBot(respostaIA.texto, rodape);
        return true;
      }
    }

    return false;
  }

  /* ══════════════════════════════════════════════════════════
     REGISTRO GLOBAL
  ══════════════════════════════════════════════════════════ */

  /**
   * Ponto de entrada explícito — chamado exclusivamente por init.js
   * após confirmar que NexusContext.temTipo('quiz') é true e que o
   * token de sessão foi autorizado via NexusQuizSearch.autorizarQuiz().
   *
   * O quiz assistant não se auto-inicializa. Todo carregamento e
   * indexação de questões ocorre de forma lazy em _garantirIndexacaoQuiz(),
   * disparado apenas quando o usuário faz uma pergunta no chat.
   *
   * A guarda _contextoQuizAtivo() abaixo é MANTIDA intencionalmente,
   * mesmo que init.js já faça verificação equivalente antes de chamar
   * esta função. Razão: init() faz parte da API pública de
   * NexusQuizAssistant e pode ser invocado diretamente por qualquer
   * código externo — a guarda interna é a única defesa nesse caso.
   * Redundância com init.js é aceitável; ausência da guarda não é.
   *
   * v1.1 (auditoria — Requisito 2): agora renderiza a mensagem de
   * boas-vindas própria do Quiz (_mensagemBoasVindasQuiz) através de
   * window.NexusAssistant.renderBotMessage, em vez de só limpar a UI
   * e deixá-la vazia. Isso evita que a mensagem genérica do Resumo
   * (mostrada por initUI()/init() antes deste ponto) fique sendo a
   * última coisa visível — ou que o chat fique sem nenhuma mensagem.
   */
  function init() {
    if (!_contextoQuizAtivo()) {
      console.warn('[NexusQuizAssistant] init() chamado sem contexto de quiz ativo — ignorado.');
      return;
    }

    if (typeof window.NexusWorker !== 'undefined' &&
        typeof window.NexusWorker.limparHistorico === 'function') {
      window.NexusWorker.limparHistorico();
    }

    // Limpa também as mensagens visíveis do chat — o histórico lógico
    // e a UI precisam estar em sincronia ao entrar em nova sessão de quiz.
    if (typeof window.NexusUI !== 'undefined' &&
        typeof window.NexusUI.limparMensagens === 'function') {
      window.NexusUI.limparMensagens();
    }

    // Mensagem própria do Quiz (Requisito 2) — usa o hook do
    // NexusAssistant para manter state.messages/sessionStorage em
    // sincronia com o que é exibido.
    if (typeof window.NexusAssistant !== 'undefined' &&
        typeof window.NexusAssistant.renderBotMessage === 'function') {
      _mensagemBoasVindasQuiz(window.NexusAssistant.renderBotMessage);
    } else {
      console.warn('[NexusQuizAssistant] NexusAssistant.renderBotMessage não disponível — ' +
        'mensagem de boas-vindas do Quiz não pôde ser exibida.');
    }

    console.log('[NexusQuizAssistant] domínio quiz ativo — modo:', window.__NEXUS_QUIZ_MODO__);
  }

  window.NexusQuizAssistant = {
    init,
    interceptar,
    sanitizarResultados,
    /**
     * contextoAtivo() — verificação OPERACIONAL.
     *
     * Retorna true somente se TODOS os requisitos estiverem satisfeitos:
     *   1. NexusContext.temTipo('quiz') → domínio declarado na página
     *   2. __NEXUS_QUIZ_TOKEN__ válido  → sessão autorizada
     *   3. __NEXUS_QUIZ_MODO__ definido → modo de avaliação ativo
     *
     * ⚠ NÃO confundir com NexusQuizSearch.contextoAtivo(), que é uma
     *   verificação ESTRUTURAL: responde apenas "o tipo quiz está declarado
     *   em __NEXUS_CONTEXT__?" — sem exigir token ou modo.
     *   Use NexusQuizSearch.contextoAtivo() para saber se a página suporta
     *   quiz; use NexusQuizAssistant.contextoAtivo() para saber se o quiz
     *   está atualmente em sessão operacional.
     */
    contextoAtivo:         _contextoQuizAtivo,
    purgar:                _purgarContextoQuiz,
    notificarEntradaNoQuiz,
    // NOVO (Requisito 2) — permite que resumo/assistant.js reexiba a
    // mensagem própria do Quiz após um reset de chat (_resetarChat),
    // em vez de cair na mensagem genérica do Resumo.
    mensagemBoasVindas:    _mensagemBoasVindasQuiz,
  };

}());