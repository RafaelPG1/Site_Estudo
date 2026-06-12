/**
 * NEXUS — shared/js/ia/quiz/assistant.js
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
 *
 * NÃO conhece:
 *   - Fluxo de chat de resumo
 *   - Seleção de disciplina
 *   - Busca global de resumo
 *   - Localização de conteúdo
 *   - Comandos /disc
 *
 * Depende de:
 *   - core/text-utils.js       (window.NexusTextUtils)
 *   - core/loader.js           (window.NexusLoader)
 *   - core/worker.js           (window.NexusWorker)
 *   - core/ui.js               (window.NexusUI)
 *   - quiz/search.js           (window.NexusQuizSearch)
 *   - resumo/assistant.js      (window.NexusAssistant — para interceptação)
 *   - window.__nexusCtx        (bridge de contexto)
 *   - window.__NEXUS_QUIZ_TOKEN__   (token de sessão, gerado por template_init.js)
 *   - window.__NEXUS_QUIZ_MODO__    (modo ativo: 'AP1', 'AP2', etc.)
 *   - window.__NEXUS_QUESTOES_VISUAIS__ (ordem visual das questões, opcional)
 *
 * API pública: window.NexusQuizAssistant
 *   - interceptar(pergunta, disc, renderBot, workerPerguntar) → Promise<boolean>
 *     Retorna true se tratou a pergunta; false se deve seguir para o resumo.
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
  ══════════════════════════════════════════════════════════ */

  function _quizToken() {
    var t = window.__NEXUS_QUIZ_TOKEN__;
    if (!t || typeof t !== 'string') return null;
    return t;
  }

  function _contextoQuizAtivo() {
    return _quizToken() !== null && window.__NEXUS_QUIZ_MODO__ !== undefined;
  }

  /* ══════════════════════════════════════════════════════════
     PURGE DO CONTEXTO DE QUIZ
  ══════════════════════════════════════════════════════════ */

  function _purgarContextoQuiz() {
    try { delete window.__NEXUS_QUIZ_MODO__; } catch (e) {}

    if (typeof window.NexusQuizSearch !== 'undefined') {
      NexusQuizSearch.revogarQuiz();
    }

    if (typeof window.NexusSearch !== 'undefined' &&
        typeof window.NexusSearch.revogarQuiz === 'function') {
      window.NexusSearch.revogarQuiz();
    }

    try { delete window.__NEXUS_QUIZ_TOKEN__; } catch (e) {}

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
   * @param {string} discId — id da disciplina (ex: 'design', 'poo')
   */
  function notificarEntradaNoQuiz(discId) {
    if (!discId) return;

    var tentativas     = 0;
    var MAX_TENTATIVAS = 30; // 3s no total

    var intervalo = setInterval(function () {
      tentativas++;

      var assistente = window.NexusAssistant;
      if (assistente && typeof assistente.selecionarDiscPorId === 'function') {
        clearInterval(intervalo);
        assistente.selecionarDiscPorId(discId, { silencioso: true });
        console.log('[NexusQuizAssistant] disciplina "' + discId + '" selecionada automaticamente no chat.');
        return;
      }

      if (tentativas >= MAX_TENTATIVAS) {
        clearInterval(intervalo);
        console.warn('[NexusQuizAssistant] NexusAssistant não disponível — seleção automática falhou.');
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
     MONTAGEM DE CONTEXTO DE CARREGAMENTO (quiz)
  ══════════════════════════════════════════════════════════ */

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

    if (NexusQuizSearch.estaIndexadoQuiz(token)) return window.questoes || null;

    const loaderCtx = _montarCtxQuiz(disc);
    if (!loaderCtx) return null;

    const questoes = await NexusLoader.carregar(loaderCtx);
    if (!questoes) return null;

    NexusQuizSearch.indexarQuestoes(questoes, modo, token);
    return questoes;
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
    ];
    for (var i = 0; i < padroes.length; i++) {
      var m = norm.match(padroes[i]);
      if (m) return parseInt(m[1], 10);
    }
    return null;
  }

  /* ══════════════════════════════════════════════════════════
     SERIALIZAÇÃO DE QUESTÃO
  ══════════════════════════════════════════════════════════ */

  function _serializarQuestao(numero, q) {
    var linhas = ['Questão ' + numero + (q.aula ? ' (' + q.aula + ')' : '') + ':'];

    if (q.texto)    linhas.push('Contexto: ' + q.texto);
    if (q.question) linhas.push('Enunciado: ' + q.question);

    if (Array.isArray(q.assertions)) {
      linhas.push('Afirmativas:');
      q.assertions.forEach(function (a) { linhas.push('  ' + a); });
    }

    if (Array.isArray(q.options)) {
      linhas.push('Alternativas:');
      q.options.forEach(function (opt, i) {
        var letra = String.fromCharCode(65 + i);
        linhas.push('  ' + letra + ') ' + opt);
      });
    }

    // Gabarito e feedback: SOMENTE dentro do template de quiz com token válido
    if (_contextoQuizAtivo()) {
      if (typeof q.answer === 'number') {
        var gabarito = String.fromCharCode(65 + q.answer);
        linhas.push('Gabarito: ' + gabarito);
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
   *   - Questão com número → serializa e responde via worker
   *   - Pergunta geral → busca por texto no índice de questões
   */
  async function interceptar(pergunta, disc, renderBot) {
    if (!_contextoQuizAtivo()) {
      if (_ehPedidoDeGabarito(pergunta)) {
        renderBot(
          'Perguntas sobre gabarito e respostas só podem ser respondidas dentro do Quiz da disciplina.\n\n' +
          'Abra o Quiz correspondente e faça a pergunta novamente. 📝'
        );
        return true;
      }
      return false;
    }

    const numQ = _detectarNumeroQuestao(pergunta);
    if (numQ === null) {
      return await _interceptarBuscaQuiz(pergunta, disc, renderBot);
    }

    const questoes = await _garantirIndexacaoQuiz(disc);
    if (!questoes) {
      renderBot('Não consegui carregar as questões. Tente novamente.');
      return true;
    }

    const token = _quizToken();
    const q     = NexusQuizSearch.buscarQuestaoPorNumero(numQ, token);
    if (!q) {
      renderBot('Questão ' + numQ + ' não encontrada no modo atual.');
      return true;
    }

    const ctxQuestao = _serializarQuestao(numQ, q);
    await _responderSobreQuestao(pergunta, ctxQuestao, disc, renderBot);
    return true;
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

  window.NexusQuizAssistant = {
    interceptar,
    sanitizarResultados,
    contextoAtivo:         _contextoQuizAtivo,
    purgar:                _purgarContextoQuiz,
    notificarEntradaNoQuiz,
  };

}());