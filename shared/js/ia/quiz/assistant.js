/**
 * NEXUS — shared/js/ia/quiz/assistant.js  v3.0
 *
 * Orquestrador do sistema de IA para Quiz.
 *
 * Completamente independente de resumo/assistant.js.
 * Possui: UI própria, histórico próprio, contexto próprio, mensagem inicial própria.
 *
 * Responsabilidades:
 *   - Fluxo completo do chat de quiz
 *   - Exigir disciplina configurada (via __NEXUS_QUIZ_DISC__)
 *   - Responder dúvidas sobre questões
 *   - Histórico isolado por (quiz + disciplina + semestre + modo)
 *   - Purge ao sair do quiz
 *
 * NÃO conhece:
 *   - resumo/assistant.js ou qualquer estado do Resumo
 *   - Seleção de disciplina pelo usuário (disciplina vem da página)
 *   - /disc commands
 *   - Busca de resumo
 *
 * Disciplina:
 *   - OBRIGATÓRIA — definida pela página via window.__NEXUS_QUIZ_DISC__
 *   - SEM fallback, SEM automático, SEM detecção
 *   - Se ausente, o quiz não inicializa
 *
 * Histórico:
 *   - Isolado por chave: quiz|discId|semestre|modo
 *   - Reset do chat: limpa histórico, mantém disciplina ativa
 *   - Troca de disciplina, semestre ou modo: limpa histórico
 *   - Ao sair: limpa todo o domínio quiz no storage
 *
 * Depende de:
 *   - core/context.js    (window.NexusContext)
 *   - core/history.js    (window.NexusHistory)
 *   - core/ui.js         (window.NexusUI)
 *   - core/loader.js     (window.NexusLoader)
 *   - core/worker.js     (window.NexusWorker)
 *   - core/text-utils.js (window.NexusTextUtils)
 *   - quiz/search.js     (window.NexusQuizSearch)
 *   - window.__nexusCtx  (bridge de contexto)
 *   - window.__NEXUS_QUIZ_TOKEN__    (token da sessão — gerado por template_init.js)
 *   - window.__NEXUS_QUIZ_MODO__     (modo ativo: 'AP1', 'AP2', etc.)
 *   - window.__NEXUS_QUIZ_DISC__     (id da disciplina — definido pela página)
 *   - window.__NEXUS_QUESTOES_VISUAIS__ (ordem visual das questões)
 *
 * Inicialização:
 *   - NexusQuizAssistant.init() — chamado por init.js após autorizar o token
 *
 * API pública: window.NexusQuizAssistant
 */

(function () {
  'use strict';

  var REPLY_DELAY_MS = 900;

  /* ══════════════════════════════════════════════════════════
     ESTADO INTERNO
  ══════════════════════════════════════════════════════════ */

  var state = {
    messages:       [],
    typingTimer:    null,
    processando:    false,
    chaveHistorico: null,
    modoAtivo:      null,
    discAtivo:      null,
  };

  /* ══════════════════════════════════════════════════════════
     UTILITÁRIOS
  ══════════════════════════════════════════════════════════ */

  function _getTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function _normalizar(str) {
    return window.NexusTextUtils.normalizarTexto(str);
  }

  function _getCtxBridge() {
    return window.__nexusCtx || null;
  }

  function _getSemestre() {
    var ctx = _getCtxBridge();
    return ctx ? ctx.getSemestre() : '';
  }

  /* ══════════════════════════════════════════════════════════
     TOKEN E CONTEXTO DE QUIZ
  ══════════════════════════════════════════════════════════ */

  function _quizToken() {
    var t = window.__NEXUS_QUIZ_TOKEN__;
    return (t && typeof t === 'string') ? t : null;
  }

  /**
   * Verificação operacional completa.
   * Exige: NexusContext com tipo 'quiz' + token + modo + disc.
   */
  function _contextoAtivo() {
    if (typeof window.NexusContext === 'undefined') return false;
    if (!window.NexusContext.temTipo('quiz')) return false;
    if (!_quizToken()) return false;
    if (!window.__NEXUS_QUIZ_MODO__) return false;
    if (!window.__NEXUS_QUIZ_DISC__) return false;
    return true;
  }

  /* ══════════════════════════════════════════════════════════
     CHAVE DE HISTÓRICO
     Isolada por: quiz + discId + semestre + modo
  ══════════════════════════════════════════════════════════ */

  function _montarChaveHistorico(discId, modo) {
    var sem = _getSemestre();
    var base = window.NexusHistory.montarChave('quiz', discId, sem);
    return base + '|' + (modo || '').toLowerCase();
  }

  function _salvarHistorico() {
    if (!state.chaveHistorico) return;
    window.NexusHistory.salvar(state.chaveHistorico, state.messages);
  }

  function _limparHistoricoAtivo() {
    if (state.chaveHistorico) {
      window.NexusHistory.limpar(state.chaveHistorico);
    }
    state.messages = [];
  }

  /* ══════════════════════════════════════════════════════════
     PUSH / RENDER
  ══════════════════════════════════════════════════════════ */

  function _push(msg) {
    state.messages.push(msg);
    _salvarHistorico();
    return msg;
  }

  function _renderBot(text, rodape) {
    var msg = _push({ role: 'bot', text: text, time: _getTime(), rodape: rodape || null });
    NexusUI.renderMessage(msg);
  }

  function _setInputBloqueado(bloqueado) {
    var input   = document.getElementById('nexus-input');
    var sendBtn = document.getElementById('nexus-send');
    if (input)   input.disabled   = bloqueado;
    if (sendBtn) sendBtn.disabled = bloqueado;
    if (input) input.placeholder = bloqueado ? 'Aguarde…' : 'Digite sua mensagem…';
  }

  /* ══════════════════════════════════════════════════════════
     BOAS-VINDAS
  ══════════════════════════════════════════════════════════ */

  function _mostrarBoasVindas() {
    var modo = window.__NEXUS_QUIZ_MODO__ || '';
    var rotuloModo = modo ? ' — ' + modo.toUpperCase() : '';
    _renderBot(
      '📝 Modo Quiz' + rotuloModo + '\n\n' +
      'Pode me perguntar sobre qualquer questão deste quiz:\n' +
      '  "explica a questão 3"\n' +
      '  "por que a alternativa B está errada?"\n\n' +
      'Gabaritos só são respondidos aqui, dentro do quiz.'
    );
  }

  /* ══════════════════════════════════════════════════════════
     DETECÇÃO DE INTENÇÃO
  ══════════════════════════════════════════════════════════ */

  function _ehPedidoDeGabarito(pergunta) {
    if (/\b(gabarito|resposta\s+certa|resposta\s+correta)\b/i.test(pergunta)) return true;
    if (/qual\s+(é\s+)?a?\s*(resposta|alternativa\s+(certa|correta)|letra)\b/i.test(pergunta)) return true;
    if (/me\s+(d[aá]|pass[ae]|fal[ae])\s+(a\s+)?resposta\b/i.test(pergunta)) return true;
    if (/^[éeÉ]\s+[aAoO]\s+[A-Ea-e]\s*[\)\.]/.test(pergunta.trim())) return true;
    return false;
  }

  /* ══════════════════════════════════════════════════════════
     PALAVRAS NEUTRAS DE REFERÊNCIA
  ══════════════════════════════════════════════════════════ */

  var PALAVRAS_REFERENCIA_EXTRA = new Set([
    'a','o','as','os','e','ou','que','se','com','sobre',
    'da','do','na','no','em','pra','pro','para','por',
    'ela','ele','isto',
    'questao','questoes','pergunta','perguntas',
    'alternativa','alternativas','opcao','opcoes',
    'letra','letras','item','itens',
    'resposta','respostas','gabarito',
    'correta','correto','certa','certo',
    'errada','errado','incorreta','incorreto',
    'assunto','assuntos','significa','significado',
    'trata','tratando','aborda','abordar',
    'conta','conte','contar',
    'descreve','descreva','descrever',
    'analisa','analise','analisar',
    'comenta','comente','comentar',
    'responde','responda','responder',
    'entendi','entender','compreendi','compreender',
  ]);

  function _ehPalavraDeReferencia(palavra) {
    if (!palavra) return true;
    var u = window.NexusTextUtils;
    return u.STOPWORDS.has(palavra) ||
           PALAVRAS_REFERENCIA_EXTRA.has(palavra) ||
           /^[a-e]$/.test(palavra);
  }

  function _restanteEhReferencia(normSemNumero) {
    return normSemNumero.split(' ').filter(Boolean).every(_ehPalavraDeReferencia);
  }

  /* ══════════════════════════════════════════════════════════
     DETECÇÃO DE NÚMERO DE QUESTÃO
  ══════════════════════════════════════════════════════════ */

  function _detectarNumeroQuestao(texto) {
    var norm = _normalizar(texto.trim());
    var padroes = [
      /\bquest(?:ao|oes?)?\s*n?[o°]?\s*(\d+)\b/,
      /\bq\s*(\d+)\b/,
      /#(\d+)\b/,
      /\bnumero\s+(\d+)\b/,
      /\b(\d+)[aª]\s*quest/,
      /\b(?:da|do|na|no|pra|pro|essa|esta|aquela)\s+(\d+)\b/,
    ];
    for (var i = 0; i < padroes.length; i++) {
      var m = norm.match(padroes[i]);
      if (m) return parseInt(m[1], 10);
    }

    var bare = norm.match(/\b(\d+)\b/);
    if (bare) {
      var n = parseInt(bare[1], 10);
      var visuais = window.__NEXUS_QUESTOES_VISUAIS__;
      var dentroDoIntervalo = !visuais || !visuais.length || (n >= 1 && n <= visuais.length);
      if (dentroDoIntervalo) {
        var semNumero = (norm.slice(0, bare.index) + ' ' + norm.slice(bare.index + bare[0].length)).trim();
        if (_restanteEhReferencia(semNumero)) return n;
      }
    }

    return null;
  }

  /* ══════════════════════════════════════════════════════════
     CONTEXTO DA ÚLTIMA QUESTÃO DISCUTIDA
  ══════════════════════════════════════════════════════════ */

  var _ultimoContexto           = null;
  var _ultimoMapaVisualRastreio = null;
  var _ultimoMapaVisual         = null;

  function _registrarContexto(numeroVisual, q) {
    _ultimoContexto = {
      tipo:     'questao',
      visual:   numeroVisual,
      original: (q && typeof q.__qiOriginal__ === 'number') ? q.__qiOriginal__ : null,
    };
  }

  function _resetRastreioSeMapaMudou() {
    var atual = window.__NEXUS_QUESTOES_VISUAIS__;
    if (atual && atual.length && atual !== _ultimoMapaVisualRastreio) {
      _ultimoContexto           = null;
      _ultimoMapaVisualRastreio = atual;
    }
  }

  function _mapaVisualMudou() {
    var atual = window.__NEXUS_QUESTOES_VISUAIS__;
    if (!atual || !atual.length) return false;
    return atual !== _ultimoMapaVisual;
  }

  /**
   * Detecta mudança de modo, disc ou semestre e reseta o histórico se necessário.
   */
  function _resetarChatSeContextoMudou() {
    var modoAtual = window.__NEXUS_QUIZ_MODO__;
    var discAtual = window.__NEXUS_QUIZ_DISC__;
    var semAtual  = _getSemestre();

    var modoMudou = state.modoAtivo !== null && state.modoAtivo !== modoAtual;
    var discMudou = state.discAtivo !== null && state.discAtivo !== discAtual;

    if (modoMudou || discMudou) {
      console.log('[NexusQuizAssistant] contexto mudou — limpando histórico do quiz.');
      _limparHistoricoAtivo();
      _ultimoContexto           = null;
      _ultimoMapaVisualRastreio = null;

      // Recalcula chave com novos valores
      state.chaveHistorico = _montarChaveHistorico(discAtual, modoAtual);

      if (typeof window.NexusWorker !== 'undefined' &&
          typeof window.NexusWorker.limparHistorico === 'function') {
        window.NexusWorker.limparHistorico();
      }
    }

    state.modoAtivo = modoAtual || state.modoAtivo;
    state.discAtivo = discAtual || state.discAtivo;
  }

  /* ══════════════════════════════════════════════════════════
     REFERÊNCIA IMPLÍCITA À ÚLTIMA QUESTÃO
  ══════════════════════════════════════════════════════════ */

  function _referenciaImplicita(texto) {
    var norm = _normalizar(texto);
    if (/\b(alternativa|opcao|letra|item)\s*[a-e]\b/.test(norm)) return true;
    if (/^e\s+[ao]\s*[a-e]\b/.test(norm)) return true;
    if (/\b(essa|esta|nessa|nesta|dessa|desta|aquela)\s+(questao|pergunta|alternativa|opcao)\b/.test(norm)) return true;
    if (/\b(certa|certo|errada|errado|correta|correto|incorreta|incorreto)\b/.test(norm)) return true;
    if (/\b(resposta|gabarito)\b/.test(norm)) return true;
    if (/\b(assunto|significa|significado|aborda|abordar|trata|tratando)\b/.test(norm)) return true;
    return false;
  }

  /* ══════════════════════════════════════════════════════════
     INDEXAÇÃO DE QUESTÕES
  ══════════════════════════════════════════════════════════ */

  function _montarCtxQuiz(discId) {
    var ctx = _getCtxBridge();
    if (!ctx || !discId) return null;
    var sem    = ctx.getSemestre();
    var parsed = ctx.parseSemestre(sem);

    var prefixo   = (ctx.getPrefixoQuiz   && ctx.getPrefixoQuiz())   || 'ques_';
    var varGlobal = (ctx.getVarGlobalQuiz && ctx.getVarGlobalQuiz()) || 'questoes';

    // Precisamos do arquivo da disciplina
    var discs = ctx.getDisciplinas(sem);
    if (!discs) return null;
    var disc = discs.find(function (d) { return d.id === discId; });
    if (!disc) return null;

    return {
      ano: parsed.ano, periodo: parsed.periodo, ap: parsed.ap,
      arquivo: disc.arquivo, fonte: 'quiz', prefixo, varGlobal,
    };
  }

  async function _garantirIndexacaoQuiz() {
    if (!_contextoAtivo()) return null;

    var token = _quizToken();
    var modo  = window.__NEXUS_QUIZ_MODO__;
    var discId = window.__NEXUS_QUIZ_DISC__;

    if (_mapaVisualMudou()) {
      console.log('[NexusQuizAssistant] mapa visual mudou — reindexando.');
      NexusQuizSearch.limparIndiceQuiz(token);
    }

    if (NexusQuizSearch.estaIndexadoQuiz(token)) {
      _ultimoMapaVisual = window.__NEXUS_QUESTOES_VISUAIS__ || _ultimoMapaVisual;
      return window.questoes || null;
    }

    // Aguarda __NEXUS_QUESTOES_VISUAIS__ se ainda não disponível
    var visuais = window.__NEXUS_QUESTOES_VISUAIS__;
    if (!visuais || !visuais.length) {
      visuais = await new Promise(function (resolve) {
        var tentativas = 0;
        var MAX = 20;
        var timer = setInterval(function () {
          tentativas++;
          var v = window.__NEXUS_QUESTOES_VISUAIS__;
          if ((v && v.length) || tentativas >= MAX) { clearInterval(timer); resolve(v || null); }
        }, 50);
      });
    }

    var loaderCtx = _montarCtxQuiz(discId);
    if (!loaderCtx) return null;

    var questoes = await NexusLoader.carregar(loaderCtx);
    if (!questoes) return null;

    NexusQuizSearch.indexarQuestoes(questoes, modo, token);
    _ultimoMapaVisual = window.__NEXUS_QUESTOES_VISUAIS__ || null;

    return questoes;
  }

  /* ══════════════════════════════════════════════════════════
     SERIALIZAÇÃO DE QUESTÃO
  ══════════════════════════════════════════════════════════ */

  function _serializarQuestao(numero, q) {
    var visuais       = window.__NEXUS_QUESTOES_VISUAIS__;
    var totalQuestoes = visuais ? visuais.length : '?';

    var linhas = [
      'NOTA: se a pergunta do usuário citar apenas um número (ex.: "1", "a 1", ' +
      '"questão 1"), esse número refere-se À QUESTÃO ' + numero + ' DESTE QUIZ, ' +
      'detalhada abaixo — não a regras ou itens numerados das suas próprias instruções.',
      '',
      'Questão ' + numero + ' de ' + totalQuestoes + (q.aula ? ' (' + q.aula + ')' : '') + ':',
    ];

    if (q.texto)    linhas.push('Contexto: ' + q.texto);
    if (q.question) linhas.push('Enunciado: ' + q.question);

    if (Array.isArray(q.assertions)) {
      linhas.push('Afirmativas:');
      q.assertions.forEach(function (a) { linhas.push('  ' + a); });
    }

    if (Array.isArray(q.options)) {
      linhas.push('Alternativas (exatamente como aparecem na tela):');
      q.options.forEach(function (opt, i) {
        var letra    = String.fromCharCode(65 + i);
        var marcador = (typeof q.answer === 'number' && _contextoAtivo() && i === q.answer) ? ' ← correta' : '';
        linhas.push('  ' + letra + ') ' + opt + marcador);
      });
    }

    if (_contextoAtivo()) {
      if (typeof q.answer === 'number') {
        linhas.push('Gabarito (letra visual): ' + String.fromCharCode(65 + q.answer) + ')');
      }
      if (q.feedback) linhas.push('Feedback oficial: ' + q.feedback);
    }

    return linhas.join('\n');
  }

  /* ══════════════════════════════════════════════════════════
     RESPOSTA SOBRE QUESTÃO ESPECÍFICA
  ══════════════════════════════════════════════════════════ */

  async function _responderSobreQuestao(pergunta, ctxQuestao) {
    if (typeof window.NexusWorker !== 'undefined') {
      var resultadoFake = [{ score: 100, texto: ctxQuestao, aula: '', secao: 'Quiz' }];
      var respostaIA = null;
      try {
        respostaIA = await NexusWorker.perguntar({
          pergunta:     pergunta,
          resultados:   resultadoFake,
          disciplina:   window.__NEXUS_QUIZ_DISC__ || '',
          tipoContexto: 'conteudo',
          semContexto:  false,
        });
      } catch (e) { console.warn('[NexusQuizAssistant] erro worker:', e); }

      if (respostaIA) {
        _renderBot(respostaIA.texto, (respostaIA.fonte || respostaIA.modelo) ? {
          linha1: ['IA: ' + (respostaIA.fonte || ''), respostaIA.modelo || ''].filter(Boolean).join(' · '),
          linha2: 'fonte: questões do quiz',
        } : null);
        return;
      }
    }
    // Fallback: exibe contexto diretamente
    _renderBot(ctxQuestao);
  }

  /* ══════════════════════════════════════════════════════════
     BUSCA POR TEXTO NO ÍNDICE
  ══════════════════════════════════════════════════════════ */

  async function _buscarPorTexto(pergunta) {
    var token    = _quizToken();
    var questoes = await _garantirIndexacaoQuiz();
    if (!questoes) return false;

    var resultados = NexusQuizSearch.buscarQuiz(pergunta, { topK: 8, minScore: 15 }, token);
    if (!resultados || !resultados.length) return false;

    if (typeof window.NexusWorker !== 'undefined') {
      var respostaIA = null;
      try {
        respostaIA = await NexusWorker.perguntar({
          pergunta:     pergunta,
          resultados:   resultados,
          disciplina:   window.__NEXUS_QUIZ_DISC__ || '',
          tipoContexto: 'conteudo',
          semContexto:  false,
        });
      } catch (e) { console.warn('[NexusQuizAssistant] _buscarPorTexto erro:', e); }

      if (respostaIA) {
        _renderBot(respostaIA.texto, (respostaIA.fonte || respostaIA.modelo) ? {
          linha1: ['IA: ' + (respostaIA.fonte || ''), respostaIA.modelo || ''].filter(Boolean).join(' · '),
          linha2: 'fonte: questões do quiz',
        } : null);
        return true;
      }
    }
    return false;
  }

  /* ══════════════════════════════════════════════════════════
     FLUXO DE CHAT
  ══════════════════════════════════════════════════════════ */

  function _onUserSend(text) {
    if (state.processando) return;
    if (state.typingTimer) clearTimeout(state.typingTimer);
    NexusUI.renderMessage(_push({ role: 'user', text: text, time: _getTime() }));
    NexusUI.showTyping();
    state.processando = true;
    _setInputBloqueado(true);
    state.typingTimer = setTimeout(function () { _processar(text); }, REPLY_DELAY_MS);
  }

  async function _processar(texto) {
    try {
      if (!_contextoAtivo()) {
        _renderBot('Sessão de quiz inativa. Recarregue a página para continuar.');
        return;
      }

      // Detecta mudança de modo/disc e reseta se necessário
      _resetarChatSeContextoMudou();

      var numQ = _detectarNumeroQuestao(texto);

      // Detecta substituição do mapa visual
      _resetRastreioSeMapaMudou();

      // Resolve referência implícita à última questão
      var numQResolvido = numQ;
      if (numQResolvido === null && _ultimoContexto !== null && _referenciaImplicita(texto)) {
        numQResolvido = _ultimoContexto.visual;
      }

      // Busca por número: usa __NEXUS_QUESTOES_VISUAIS__ diretamente
      if (numQResolvido !== null) {
        var token = _quizToken();
        var q     = NexusQuizSearch.buscarQuestaoPorNumero(numQResolvido, token);
        if (!q) {
          var visuais = window.__NEXUS_QUESTOES_VISUAIS__;
          var total   = visuais ? visuais.length : '?';
          _renderBot('Questão ' + numQResolvido + ' não encontrada. O quiz atual tem ' + total + ' questões.');
          return;
        }
        _registrarContexto(numQResolvido, q);
        var ctxQuestao = _serializarQuestao(numQResolvido, q);
        await _responderSobreQuestao(texto, ctxQuestao);
        return;
      }

      // Busca por texto no índice
      var tratou = await _buscarPorTexto(texto);
      if (!tratou) {
        // Pergunta geral sem match — responde com conhecimento do worker
        if (typeof window.NexusWorker !== 'undefined') {
          var respostaIA = null;
          try {
            respostaIA = await NexusWorker.perguntar({
              pergunta: texto, resultados: [], disciplina: window.__NEXUS_QUIZ_DISC__ || '',
              tipoContexto: 'livre', semContexto: true,
            });
          } catch (e) { console.warn('[NexusQuizAssistant] resposta livre erro:', e); }
          if (respostaIA) {
            _renderBot(respostaIA.texto, null);
            return;
          }
        }
        _renderBot('Não encontrei essa questão no quiz atual. Você pode mencionar o número da questão (ex: "questão 3") ou descrever o tema.');
      }

    } catch (err) {
      console.error('[NexusQuizAssistant] erro ao processar:', err);
      _renderBot('Ocorreu um erro ao processar sua pergunta. Tente novamente.');
    } finally {
      NexusUI.hideTyping();
      state.processando = false;
      _setInputBloqueado(false);
    }
  }

  /* ══════════════════════════════════════════════════════════
     RESET DE CHAT
     Limpa histórico, mantém disciplina ativa.
  ══════════════════════════════════════════════════════════ */

  function _resetarChat() {
    _limparHistoricoAtivo();
    _ultimoContexto           = null;
    _ultimoMapaVisualRastreio = null;

    state.processando = false;
    if (state.typingTimer) { clearTimeout(state.typingTimer); state.typingTimer = null; }

    if (typeof window.NexusWorker !== 'undefined' &&
        typeof window.NexusWorker.limparHistorico === 'function') {
      window.NexusWorker.limparHistorico();
    }

    NexusUI.limparMensagens();
    NexusUI.hideTyping();
    _setInputBloqueado(false);

    // Recria mensagem de sistema e boas-vindas
    var sysMsg = { role: 'system', text: '⬡  Nexus IA', time: _getTime() };
    _push(sysMsg);
    NexusUI.renderMessage(sysMsg);
    _mostrarBoasVindas();
  }

  /* ══════════════════════════════════════════════════════════
     PURGE — ao sair do quiz
  ══════════════════════════════════════════════════════════ */

  function _purgar() {
    // Limpa todo o domínio quiz no storage
    if (typeof window.NexusHistory !== 'undefined') {
      window.NexusHistory.limparDominio('quiz');
    }

    state.messages       = [];
    state.chaveHistorico = null;
    state.modoAtivo      = null;
    state.discAtivo      = null;
    _ultimoContexto           = null;
    _ultimoMapaVisualRastreio = null;
    _ultimoMapaVisual         = null;

    try { delete window.__NEXUS_QUIZ_MODO__; } catch (e) {}

    if (typeof window.NexusQuizSearch !== 'undefined') {
      NexusQuizSearch.revogarQuiz();
    }

    try { delete window.__NEXUS_QUIZ_TOKEN__; } catch (e) {}

    // Limpa badge da UI
    if (typeof window.NexusUI !== 'undefined') {
      NexusUI.atualizarDiscAtiva(null);
    }

    console.log('[NexusQuizAssistant] quiz purgado.');
  }

  (function _instalarListenersPurge() {
    window.addEventListener('beforeunload', _purgar);
    window.addEventListener('pagehide',     _purgar);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && !_contextoAtivo()) {
        _purgar();
      }
    });
  }());

  /* ══════════════════════════════════════════════════════════
     VERIFICAÇÃO DE DEPENDÊNCIAS
  ══════════════════════════════════════════════════════════ */

  function _depsOk() {
    var ok = true;
    if (typeof window.NexusContext    === 'undefined') { console.error('[NexusQuizAssistant] NexusContext não encontrado.');    ok = false; }
    if (typeof window.NexusHistory    === 'undefined') { console.error('[NexusQuizAssistant] NexusHistory não encontrado.');    ok = false; }
    if (typeof window.NexusUI         === 'undefined') { console.error('[NexusQuizAssistant] NexusUI não encontrado.');         ok = false; }
    if (typeof window.NexusTextUtils  === 'undefined') { console.error('[NexusQuizAssistant] NexusTextUtils não encontrado.');  ok = false; }
    if (typeof window.NexusQuizSearch === 'undefined') { console.error('[NexusQuizAssistant] NexusQuizSearch não encontrado.'); ok = false; }
    if (typeof window.NexusLoader     === 'undefined') { console.error('[NexusQuizAssistant] NexusLoader não encontrado.');     ok = false; }
    if (typeof window.__nexusCtx      === 'undefined') { console.error('[NexusQuizAssistant] __nexusCtx não encontrado.');      ok = false; }
    return ok;
  }

  /* ══════════════════════════════════════════════════════════
     SANITIZAÇÃO DE RESULTADOS
     (usada por outros módulos que precisam filtrar conteúdo de quiz)
  ══════════════════════════════════════════════════════════ */

  function sanitizarResultados(resultados) {
    if (!resultados || !resultados.length) return resultados;
    if (_contextoAtivo()) return resultados;
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
     INIT — ponto de entrada, chamado por init.js
  ══════════════════════════════════════════════════════════ */

  /**
   * Inicializa o chat de Quiz de forma completamente independente.
   *
   * Exige:
   *   - __NEXUS_QUIZ_TOKEN__ autorizado
   *   - __NEXUS_QUIZ_MODO__ definido
   *   - __NEXUS_QUIZ_DISC__ definido (disciplina obrigatória, sem fallback)
   *
   * Se qualquer pré-requisito falhar, init() aborta com erro — não há
   * fallback silencioso, não há detecção automática de disciplina.
   */
  function init() {
    if (!_depsOk()) {
      console.error('[NexusQuizAssistant] init() abortado: dependências ausentes.');
      return;
    }

    if (!_contextoAtivo()) {
      console.error('[NexusQuizAssistant] init() abortado: contexto de quiz inativo.' +
        ' Verifique __NEXUS_QUIZ_TOKEN__, __NEXUS_QUIZ_MODO__ e __NEXUS_QUIZ_DISC__.');
      return;
    }

    // Monta chave de histórico para este contexto específico
    var discId = window.__NEXUS_QUIZ_DISC__;
    var modo   = window.__NEXUS_QUIZ_MODO__;

    state.modoAtivo      = modo;
    state.discAtivo      = discId;
    state.chaveHistorico = _montarChaveHistorico(discId, modo);

    // Inicializa a UI do quiz (separada da UI do Resumo)
    if (!document.getElementById('nexus-fab')) {
      NexusUI.init({ onSend: _onUserSend, onReset: _resetarChat });
    } else {
      // FAB já existe (ex: Resumo também está carregado na mesma página)
      // Reassocia os callbacks para o Quiz
      NexusUI.init({ onSend: _onUserSend, onReset: _resetarChat });
    }

    // Limpa histórico do worker (contexto anterior)
    if (typeof window.NexusWorker !== 'undefined' &&
        typeof window.NexusWorker.limparHistorico === 'function') {
      window.NexusWorker.limparHistorico();
    }

    // Atualiza badge de disciplina
    var ctx   = _getCtxBridge();
    var sem   = ctx ? ctx.getSemestre() : '';
    var discs = ctx ? ctx.getDisciplinas(sem) : null;
    var disc  = discs ? discs.find(function (d) { return d.id === discId; }) : null;
    NexusUI.atualizarDiscAtiva(disc ? disc.apelido : discId);

    // Tenta restaurar histórico existente para este contexto
    var histSalvo = window.NexusHistory.carregar(state.chaveHistorico);
    var sysMsg = { role: 'system', text: '⬡  Nexus IA', time: _getTime() };

    NexusUI.limparMensagens();

    if (histSalvo && histSalvo.length > 0) {
      state.messages = histSalvo;
      histSalvo.forEach(function (msg) { NexusUI.renderMessage(msg); });
      var msgsEl = document.getElementById('nexus-messages');
      if (msgsEl) {
        var el = document.createElement('div');
        el.className = 'nexus-msg nexus-system nexus-restore-banner';
        el.innerHTML = '<div class="nexus-msg-bubble">↩ Histórico restaurado</div>';
        msgsEl.appendChild(el);
      }
    } else {
      // Novo contexto: exibe mensagem de sistema e boas-vindas
      _push(sysMsg);
      NexusUI.renderMessage(sysMsg);
      _mostrarBoasVindas();
    }

    console.log('[NexusQuizAssistant] quiz ativo — disc:', discId, '| modo:', modo);
  }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════════════════════════ */

  window.NexusQuizAssistant = {
    init,
    contextoAtivo:      _contextoAtivo,
    purgar:             _purgar,
    sanitizarResultados,
  };

}());