/**
 * NEXUS — quiz/js/assistant.js  v2.2
 *
 * Quiz-Assistant: tutor de IA dentro do ambiente de quiz.
 *
 * ── MUDANÇAS v2.2 ─────────────────────────────────────────
 *
 *   PERSISTÊNCIA CORRETA NO F5
 *     Removido o listener de 'pagehide' que limpava o histórico do
 *     domínio 'quiz' inteiro. 'pagehide' dispara tanto ao fechar a
 *     aba quanto durante um reload — então todo F5 apagava o chat
 *     antes mesmo da página recarregar. O histórico agora vive em
 *     localStorage (ver history.js v1.1) e só é limpo quando o
 *     CONTEXTO realmente muda (disciplina ou modo diferentes do
 *     que estava salvo da última vez que o assistant rodou) —
 *     verificado de forma intencional em _aplicarPersistenciaContexto(),
 *     não como efeito colateral de um evento de ciclo de vida.
 *
 *   Resto do comportamento (v2.1) inalterado — classificação de
 *   intenção de gabarito, serialização em dois níveis, fallback
 *   offline seguro, etc.
 *
 * ── ARQUITETURA (inalterada) ─────────────────────────────────
 *
 *   Escuta 'nexus:quizPronto' disparado pelo engine.
 *   Lê window.__NEXUS_QUESTOES_VISUAIS__ (somente leitura).
 *   Nunca interfere no engine ou na pontuação.
 *
 * API pública: window.NexusQuizAssistant
 *   init()          — inicialização manual (fallback)
 *   contextoAtivo() — verifica se o assistente pode operar
 */

(function () {
  'use strict';

  var REPLY_DELAY_MS = 900;

  /* ══════════════════════════════════════════════════════════
     ESTADO INTERNO
  ══════════════════════════════════════════════════════════ */

  var _iniciado = false;

  var state = {
    messages:       [],
    typingTimer:    null,
    processando:    false,
    chaveHistorico: null,
    modoAtivo:      null,
    discAtivo:      null,
  };

  /* ══════════════════════════════════════════════════════════
     VERIFICAÇÃO DE DEPENDÊNCIAS
  ══════════════════════════════════════════════════════════ */

  function _verificarDeps() {
    var ok = true;

    if (typeof window.NexusUI === 'undefined') {
      console.error('[NexusQuizAssistant] NexusUI não encontrado — core/ui.js deve ser carregado antes.');
      ok = false;
    }
    if (typeof window.NexusHistory === 'undefined') {
      console.error('[NexusQuizAssistant] NexusHistory não encontrado — core/history.js deve ser carregado antes.');
      ok = false;
    }
    if (typeof window.NexusWorker === 'undefined') {
      console.warn('[NexusQuizAssistant] NexusWorker não encontrado — respostas de IA indisponíveis.');
    }
    if (!window.__NEXUS_QUIZ_DISC__) {
      console.error('[NexusQuizAssistant] __NEXUS_QUIZ_DISC__ não definido — disciplina obrigatória.');
      ok = false;
    }
    if (!window.__NEXUS_QUIZ_MODO__) {
      console.error('[NexusQuizAssistant] __NEXUS_QUIZ_MODO__ não definido — modo obrigatório.');
      ok = false;
    }

    return ok;
  }

  /* ══════════════════════════════════════════════════════════
     UTILITÁRIOS
  ══════════════════════════════════════════════════════════ */

  function _getTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function _normalizar(str) {
    if (typeof window.NexusTextUtils !== 'undefined') {
      return window.NexusTextUtils.normalizarTexto(str);
    }
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function _getDisc()     { return window.__NEXUS_QUIZ_DISC__     || null; }
  function _getModo()     { return window.__NEXUS_QUIZ_MODO__     || null; }
  function _getSemestre() { return window.__NEXUS_QUIZ_SEMESTRE__ || ''; }

  function _getSnapshot() {
    var v = window.__NEXUS_QUESTOES_VISUAIS__;
    return Array.isArray(v) ? v : [];
  }

  /* ══════════════════════════════════════════════════════════
     VERIFICAÇÃO OPERACIONAL
  ══════════════════════════════════════════════════════════ */

  function _contextoAtivo() {
    return !!(
      _iniciado &&
      _getDisc() &&
      _getModo() &&
      typeof window.NexusUI !== 'undefined'
    );
  }

  /* ══════════════════════════════════════════════════════════
     CHAVE DE HISTÓRICO
  ══════════════════════════════════════════════════════════ */

  function _montarChaveHistorico(discId, modo, sem) {
    if (typeof window.NexusHistory !== 'undefined') {
      var base = window.NexusHistory.montarChave('quiz', discId, sem);
      return base + '|' + (modo || '').toLowerCase();
    }
    return 'quiz|' + (discId || '').toLowerCase() +
           '|' + (sem || '').toLowerCase() +
           '|' + (modo || '').toLowerCase();
  }

  function _salvarHistorico() {
    if (!state.chaveHistorico || typeof window.NexusHistory === 'undefined') return;
    try {
      window.NexusHistory.salvar(state.chaveHistorico, state.messages);
    } catch (e) {
      console.warn('[NexusQuizAssistant] erro ao salvar histórico:', e);
    }
  }

  function _limparHistoricoAtivo() {
    if (state.chaveHistorico && typeof window.NexusHistory !== 'undefined') {
      try { window.NexusHistory.limpar(state.chaveHistorico); } catch (e) {}
    }
    state.messages = [];
  }

  /* ══════════════════════════════════════════════════════════
     PERSISTÊNCIA INTELIGENTE ENTRE CARGAS DE PÁGINA (v2.2)

     Problema que isto resolve:
       O chat precisa SOBREVIVER a um F5 simples (mesma disciplina,
       mesmo modo), mas precisa ser LIMPO quando o aluno navega para
       outra disciplina ou outro modo.

       Como cada F5 reinicia totalmente o JS (state.discAtivo/modoAtivo
       nascem null de novo), não dá pra comparar "contexto anterior"
       usando apenas memória — precisamos de um marcador persistido
       (localStorage) que sobrevive ao reload e registra qual foi o
       ÚLTIMO contexto (disciplina+modo+semestre) em que o assistant
       rodou.

     Fluxo:
       • Lê o marcador salvo da visita anterior.
       • Se disciplina OU modo mudaram → limpa todo o domínio 'quiz'
         (todas as chaves antigas), garantindo que nenhum resquício
         de outra disciplina/modo apareça.
       • Se for a mesma disciplina+modo (ou não havia marcador ainda,
         ou seja, primeira visita) → não limpa nada; o histórico
         daquele contexto específico será restaurado normalmente
         pelo fluxo de init() (NexusHistory.carregar).
       • Sempre regrava o marcador com o contexto atual ao final.

     Isto substitui o antigo listener de 'pagehide' que limpava o
     histórico em TODO reload — inclusive nos que deveriam apenas
     restaurar a conversa.
  ══════════════════════════════════════════════════════════ */

  var _CHAVE_ULTIMO_CONTEXTO = 'nexus_chat_ultimo_contexto_quiz';

  function _lerUltimoContexto() {
    try {
      var raw = window.localStorage && window.localStorage.getItem(_CHAVE_ULTIMO_CONTEXTO);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function _salvarUltimoContexto(discId, modo, sem) {
    try {
      if (!window.localStorage) return;
      window.localStorage.setItem(
        _CHAVE_ULTIMO_CONTEXTO,
        JSON.stringify({ disc: discId, modo: modo, sem: sem })
      );
    } catch (e) {}
  }

  /**
   * Decide, no boot do assistant, se o contexto persistido em
   * localStorage de uma visita anterior ainda é válido para esta
   * visita. Só limpa o domínio inteiro quando disciplina ou modo
   * realmente mudaram — um F5 puro na mesma questão nunca aciona isto.
   */
  function _aplicarPersistenciaContexto(discId, modo, sem) {
    var anterior = _lerUltimoContexto();
    var mudouContexto = !!anterior &&
      (anterior.disc !== discId || anterior.modo !== modo);

    if (mudouContexto) {
      console.log(
        '[NexusQuizAssistant] disciplina ou modo mudou (' +
        anterior.disc + '/' + anterior.modo + ' → ' + discId + '/' + modo +
        ') — limpando histórico salvo do quiz.'
      );
      if (typeof window.NexusHistory !== 'undefined') {
        try { window.NexusHistory.limparDominio('quiz'); } catch (e) {}
      }
      if (typeof window.NexusWorker !== 'undefined') {
        window.NexusWorker.limparHistorico();
      }
    }

    _salvarUltimoContexto(discId, modo, sem);
  }

  /* ══════════════════════════════════════════════════════════
     PUSH / RENDER
  ══════════════════════════════════════════════════════════ */

  function _push(msg) {
    state.messages.push(msg);
    _salvarHistorico();
    return msg;
  }

  /**
   * Remove marcadores de chip do quiz (==cat==texto==) do texto de saída.
   * Esses marcadores são usados internamente no quiz_ui para estilizar
   * chips nas questões — não devem aparecer no chat da IA.
   *
   * Ex: ==key==PRIMARY KEY== → PRIMARY KEY
   * Ex: ==type==VARCHAR==    → VARCHAR
   *
   * Não afeta negrito (**), quebras de linha, markdown ou qualquer
   * outra formatação — filtro exclusivo dos delimitadores == .
   *
   * @param {string} texto
   * @returns {string}
   */
  function _limparMarcadoresChips(texto) {
    if (!texto) return texto;
    // Padrão: ==categoria==conteúdo== → conteúdo
    return texto.replace(/==[^=]+==([^=]+)==/g, '$1');
  }

  function _renderBot(text, rodape) {
    if (typeof window.NexusUI === 'undefined') return;
    var textoLimpo = _limparMarcadoresChips(text);
    var msg = _push({ role: 'bot', text: textoLimpo, time: _getTime(), rodape: rodape || null });
    window.NexusUI.renderMessage(msg);
  }

  function _setInputBloqueado(bloqueado) {
    var input   = document.getElementById('nexus-input');
    var sendBtn = document.getElementById('nexus-send');
    if (input)   { input.disabled   = bloqueado; }
    if (sendBtn) { sendBtn.disabled = bloqueado; }
    if (input)   { input.placeholder = bloqueado ? 'Aguarde…' : 'Digite sua mensagem…'; }
  }

  /* ══════════════════════════════════════════════════════════
     DETECÇÃO DE MUDANÇA DE CONTEXTO DENTRO DA MESMA SESSÃO

     (cenário diferente do _aplicarPersistenciaContexto acima: aqui é
     uma mudança detectada SEM reload de página, caso o host troque
     disciplina/modo dinamicamente sem recarregar o script.)
  ══════════════════════════════════════════════════════════ */

  function _resetarSeContextoMudou() {
    var discAtual = _getDisc();
    var modoAtual = _getModo();

    var discMudou = state.discAtivo !== null && state.discAtivo !== discAtual;
    var modoMudou = state.modoAtivo !== null && state.modoAtivo !== modoAtual;

    if (discMudou || modoMudou) {
      console.log('[NexusQuizAssistant] contexto mudou — limpando histórico.');
      _limparHistoricoAtivo();
      state.chaveHistorico = _montarChaveHistorico(discAtual, modoAtual, _getSemestre());
      _salvarUltimoContexto(discAtual, modoAtual, _getSemestre());
      if (typeof window.NexusWorker !== 'undefined') {
        window.NexusWorker.limparHistorico();
      }
    }

    if (discAtual) state.discAtivo = discAtual;
    if (modoAtual) state.modoAtivo = modoAtual;
  }

  /* ══════════════════════════════════════════════════════════
     CLASSIFICAÇÃO DE INTENÇÃO — NÚCLEO DA v2.1

     Três estados possíveis para qualquer mensagem sobre uma questão:
       'explicacao'  → padrão absoluto (não pede resposta)
       'gabarito'    → pedido explícito de resposta/gabarito
       'hibrido'     → pede explicação E resposta ao mesmo tempo

     REGRA DE SEGURANÇA:
       Em caso de dúvida → 'explicacao'
       Gabarito só com evidência clara e inequívoca na mensagem
  ══════════════════════════════════════════════════════════ */

  /**
   * Detecta pedido EXPLÍCITO de gabarito/resposta.
   * Cobre variantes coloquiais mas exige sinal semântico claro de
   * "quero saber qual é a certa" — em caso de dúvida, não dispara.
   */
  var _PEDE_RESPOSTA_RE = /\b(?:qual\s+(?:e|eh|é)\s+(?:a\s+)?(?:resposta|alternativa|letra|opcao|gabarito|certa?|correta?)|qual\s+(?:resposta|alternativa|letra|opcao|gabarito)|(?:me\s+)?(?:da|fala|diz|mostra|revela|mostre)\s+(?:a\s+)?(?:resposta|alternativa|letra|opcao|gabarito|certa?|correta?)|(?:resposta|gabarito)\s*(?:correta?|certa?)?|qual\s+alternativa\s+(?:esta|e|eh|e)\s+(?:certa?|correta?)|me\s+d[aa]\s+o\s+gabarito|qual\s+(?:e\s+)?a?\s*certa|qual\s+acertei|acertei\s+ou\s+errei)\b/;

  /**
   * Detecta pedido de EXPLICAÇÃO explícita (além do padrão).
   * Usado para identificar modo híbrido quando combinado com pedido de resposta.
   */
  var _PEDE_EXPLICACAO_RE = /\b(?:explica(?:r)?|explicar?|por\s+que|porque|como\s+(?:funciona|resolver?|chegar)|o\s+que\s+(?:significa|e|eh|é|aborda)|entender?|entend[ae]|me\s+(?:explica|ajuda|ensina)|racioc[ií]nio|racion[aá]l|log[ií]ca|conceito|teoria)\b/;

  /**
   * Determina a intenção da mensagem em relação a uma questão.
   *
   * @param {string} textoNormalizado
   * @returns {'explicacao'|'gabarito'|'hibrido'}
   */
  function _classificarIntencao(textoNormalizado) {
    var pedeResposta   = _PEDE_RESPOSTA_RE.test(textoNormalizado);
    var pedeExplicacao = _PEDE_EXPLICACAO_RE.test(textoNormalizado);

    if (pedeResposta && pedeExplicacao) return 'hibrido';
    if (pedeResposta)                   return 'gabarito';
    return 'explicacao';   // PADRÃO ABSOLUTO
  }

  /* ══════════════════════════════════════════════════════════
     DETECÇÃO DE NÚMERO DE QUESTÃO
  ══════════════════════════════════════════════════════════ */

  var _PALAVRAS_NEUTRAS = new Set([
    'a','o','as','os','e','ou','que','se','com','sobre','da','do','na','no',
    'em','pra','pro','para','por','ela','ele','isto',
    'questao','questoes','pergunta','perguntas',
    'alternativa','alternativas','opcao','opcoes',
    'letra','letras','item','itens',
    'resposta','respostas','gabarito',
    'correta','correto','certa','certo',
    'errada','errado','incorreta','incorreto',
    'explica','explique','me','fala','diga','descreve','qual','quais',
  ]);

  function _ehPalavraNeutra(palavra) {
    if (!palavra) return true;
    if (_PALAVRAS_NEUTRAS.has(palavra)) return true;
    if (/^[a-e]$/.test(palavra)) return true;
    if (typeof window.NexusTextUtils !== 'undefined' &&
        window.NexusTextUtils.STOPWORDS &&
        window.NexusTextUtils.STOPWORDS.has(palavra)) return true;
    return false;
  }

  function _detectarNumeroQuestao(texto) {
    var norm     = _normalizar(texto);
    var snapshot = _getSnapshot();

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
      var n     = parseInt(bare[1], 10);
      var total = snapshot.length || 999;
      if (n >= 1 && n <= total) {
        var semNum = (norm.slice(0, bare.index) + ' ' + norm.slice(bare.index + bare[0].length)).trim();
        if (semNum.split(' ').filter(Boolean).every(_ehPalavraNeutra)) return n;
      }
    }

    return null;
  }

  /* ══════════════════════════════════════════════════════════
     RASTREIO DA ÚLTIMA QUESTÃO DISCUTIDA
  ══════════════════════════════════════════════════════════ */

  var _ultimaQuestaoVisual = null;

  function _referenciaImplicita(texto) {
    var norm = _normalizar(texto);
    if (/\b(alternativa|opcao|letra|item)\s*[a-e]\b/.test(norm)) return true;
    if (/\b(essa|esta|nessa|nesta|dessa|desta)\s+(questao|pergunta|alternativa)\b/.test(norm)) return true;
    if (/\b(certa|certo|errada|errado|correta|correto|incorreta|incorreto)\b/.test(norm)) return true;
    if (/\b(resposta|gabarito)\b/.test(norm)) return true;
    if (/\b(assunto|significa|significado|aborda|trata)\b/.test(norm)) return true;
    return false;
  }

  /* ══════════════════════════════════════════════════════════
     SERIALIZAÇÃO DA QUESTÃO — DOIS NÍVEIS (v2.1)

     _serializarQuestaoSemGabarito()
       Contexto enviado por padrão.
       Inclui enunciado, alternativas embaralhadas, afirmativas, código.
       NÃO inclui answer nem feedback.
       A IA pode explicar o conteúdo mas não sabe qual é a correta.

     _serializarQuestaoComGabarito()
       Contexto enviado apenas quando pedido explícito de gabarito.
       Inclui tudo, incluindo answer e feedback.
  ══════════════════════════════════════════════════════════ */

  function _serializarQuestaoSemGabarito(numeroVisual, q) {
    var snapshot = _getSnapshot();
    var total    = snapshot.length || '?';

    var linhas = [
      'QUESTÃO ' + numeroVisual + ' DE ' + total +
        (q.aula ? ' (' + q.aula + ')' : '') + ':',
    ];

    if (q.texto)    linhas.push('Contexto: ' + q.texto);
    if (q.question) linhas.push('Enunciado: ' + q.question);

    if (Array.isArray(q.assertions) && q.assertions.length) {
      linhas.push('Afirmativas:');
      q.assertions.forEach(function (a) { linhas.push('  ' + a); });
    }

    if (Array.isArray(q.options) && q.options.length) {
      linhas.push('Alternativas (exatamente como o usuário está vendo):');
      q.options.forEach(function (opt, i) {
        linhas.push('  ' + String.fromCharCode(65 + i) + ') ' + opt);
      });
    }

    // answer e feedback INTENCIONALMENTE OMITIDOS neste nível

    return linhas.join('\n');
  }

  function _serializarQuestaoComGabarito(numeroVisual, q) {
    // Começa com o contexto sem gabarito e adiciona as informações extras
    var base   = _serializarQuestaoSemGabarito(numeroVisual, q);
    var linhas = [base];

    if (typeof q.answer === 'number') {
      linhas.push('Alternativa correta: ' + String.fromCharCode(65 + q.answer) + ')');
    }
    if (q.feedback) {
      linhas.push('Explicação: ' + q.feedback);
    }

    return linhas.join('\n');
  }

  /* ══════════════════════════════════════════════════════════
     INSTRUÇÕES DE SISTEMA PARA A IA — POR TIPO DE CONTEXTO

     Enviadas como prefixo da pergunta para orientar o worker
     sem alterar a arquitetura do worker.js.
  ══════════════════════════════════════════════════════════ */

  var _INSTRUCOES_IA = {
    /**
     * Modo padrão: IA deve EXPLICAR sem revelar gabarito.
     * O contexto não contém a resposta correta — mas caso
     * a IA infira por outros meios, esta instrução impede a revelação.
     */
    conteudo: (
      'INSTRUÇÃO PARA O TUTOR: O aluno quer entender o conteúdo desta questão, ' +
      'NÃO quer saber a resposta correta. ' +
      'Explique os conceitos, contextualize o tema, analise as alternativas do ponto de vista conceitual. ' +
      'NÃO revele qual alternativa é a correta. ' +
      'Se o aluno quiser o gabarito, ele pedirá explicitamente. ' +
      'Pergunta do aluno: '
    ),

    /**
     * Modo gabarito: IA pode revelar a resposta.
     * O contexto inclui answer e feedback.
     */
    gabarito: (
      'INSTRUÇÃO PARA O TUTOR: O aluno pediu explicitamente o gabarito desta questão. ' +
      'Informe qual alternativa é a correta e explique brevemente por que está certa, ' +
      'usando o feedback fornecido no contexto. ' +
      'Pergunta do aluno: '
    ),

    /**
     * Modo híbrido: IA deve explicar primeiro, depois revelar.
     * O contexto inclui answer e feedback.
     */
    hibrido: (
      'INSTRUÇÃO PARA O TUTOR: O aluno quer tanto uma explicação quanto saber a resposta. ' +
      'Estruture sua resposta assim: ' +
      '1) Explique o conteúdo e analise as alternativas conceitualmente. ' +
      '2) Ao final, revele a alternativa correta e por que ela está certa. ' +
      'Pergunta do aluno: '
    ),

    /**
     * Modo livre: pergunta geral, sem questão específica.
     */
    livre: '',
  };

  /* ══════════════════════════════════════════════════════════
     BUSCA DE QUESTÃO NO SNAPSHOT
  ══════════════════════════════════════════════════════════ */

  function _buscarQuestaoPorNumero(numero) {
    var snapshot = _getSnapshot();
    if (!snapshot.length) return null;
    var idx = numero - 1;
    if (idx < 0 || idx >= snapshot.length) return null;
    return snapshot[idx] || null;
  }

  /* ══════════════════════════════════════════════════════════
     COMUNICAÇÃO COM A IA (NexusWorker)
  ══════════════════════════════════════════════════════════ */

  async function _perguntarIA(pergunta, resultados, tipoContexto) {
    if (typeof window.NexusWorker === 'undefined') return null;

    // Prefixa a instrução de sistema à pergunta do aluno
    var instrucao = _INSTRUCOES_IA[tipoContexto] || '';
    var perguntaComInstrucao = instrucao ? instrucao + pergunta : pergunta;

    try {
      return await window.NexusWorker.perguntar({
        pergunta:     perguntaComInstrucao,
        resultados:   resultados || [],
        disciplina:   _getDisc() || '',
        tipoContexto: tipoContexto || 'conteudo',
        semContexto:  !resultados || !resultados.length,
      });
    } catch (e) {
      console.warn('[NexusQuizAssistant] NexusWorker.perguntar erro:', e);
      return null;
    }
  }

  /* ══════════════════════════════════════════════════════════
     RESPOSTAS — v2.1

     _responderSobreQuestao() agora:
       1. Classifica a intenção do usuário
       2. Serializa o contexto no nível adequado (sem/com gabarito)
       3. Envia a instrução correta à IA
       4. No fallback offline, aplica a mesma lógica sem vazar resposta
  ══════════════════════════════════════════════════════════ */

  async function _responderSobreQuestao(pergunta, numeroVisual, q) {
    _ultimaQuestaoVisual = numeroVisual;

    var norm    = _normalizar(pergunta);
    var intencao = _classificarIntencao(norm);

    // Escolhe o nível de serialização baseado na intenção
    var usarGabarito = intencao === 'gabarito' || intencao === 'hibrido';
    var ctxTexto = usarGabarito
      ? _serializarQuestaoComGabarito(numeroVisual, q)
      : _serializarQuestaoSemGabarito(numeroVisual, q);

    var resultados = [{ score: 100, texto: ctxTexto, aula: q.aula || '', secao: 'Quiz' }];

    var resp = await _perguntarIA(pergunta, resultados, intencao);
    if (resp) {
      _renderBot(resp.texto, _montarRodape(resp, 'questão ' + numeroVisual));
      return;
    }

    // ── FALLBACK OFFLINE (sem IA) ────────────────────────────
    // Mesma lógica de intenção: só mostra gabarito se pedido explicitamente

    if (intencao === 'gabarito') {
      var fb = 'Questão ' + numeroVisual;
      if (q.question) fb += '\n\n' + q.question;
      if (typeof q.answer === 'number' && Array.isArray(q.options)) {
        fb += '\n\nRESPOSTA: ' +
              String.fromCharCode(65 + q.answer) + ') ' + q.options[q.answer];
        if (q.feedback) fb += '\n\n' + q.feedback;
      }
      _renderBot(fb);
      return;
    }

    if (intencao === 'hibrido') {
      var fbH = 'Questão ' + numeroVisual;
      if (q.question) fbH += '\n\n' + q.question;
      fbH += '\n\n(IA indisponível — não consigo gerar uma explicação completa agora.)';
      if (typeof q.answer === 'number' && Array.isArray(q.options)) {
        fbH += '\n\nRESPOSTA: ' +
               String.fromCharCode(65 + q.answer) + ') ' + q.options[q.answer];
        if (q.feedback) fbH += '\n\n' + q.feedback;
      }
      _renderBot(fbH);
      return;
    }

    // intencao === 'explicacao': NÃO revelar resposta no fallback
    var fbE = 'Questão ' + numeroVisual;
    if (q.question) fbE += '\n\n' + q.question;
    if (Array.isArray(q.options) && q.options.length) {
      fbE += '\n\nAlternativas:\n' + q.options.map(function (opt, i) {
        return String.fromCharCode(65 + i) + ') ' + opt;
      }).join('\n');
    }
    fbE += '\n\n(IA indisponível agora — não consigo gerar uma explicação completa. ' +
           'Se quiser ver o gabarito, pergunte "qual a resposta da questão ' + numeroVisual + '".)';
    _renderBot(fbE);
  }

  async function _responderGeral(texto) {
    var resp = await _perguntarIA(texto, [], 'livre');
    if (resp) {
      _renderBot(resp.texto, _montarRodape(resp, 'conhecimento próprio'));
    } else {
      _renderBot(
        'Não consegui processar sua pergunta.\n\n' +
        'Tente mencionar o número de uma questão para que eu possa explicá-la diretamente.'
      );
    }
  }

  function _montarRodape(resp, fonte) {
    if (!resp || (!resp.fonte && !resp.modelo)) return null;
    return {
      linha1: ['IA: ' + (resp.fonte || ''), resp.modelo || ''].filter(Boolean).join(' · '),
      linha2: 'fonte: ' + fonte,
    };
  }

  /* ══════════════════════════════════════════════════════════
     FLUXO DE CHAT
  ══════════════════════════════════════════════════════════ */

  function _onUserSend(text) {
    if (state.processando) return;
    if (!text || !text.trim()) return;
    if (state.typingTimer) clearTimeout(state.typingTimer);

    if (typeof window.NexusUI === 'undefined') return;

    window.NexusUI.renderMessage(_push({ role: 'user', text: text, time: _getTime() }));
    window.NexusUI.showTyping();
    state.processando = true;
    _setInputBloqueado(true);

    state.typingTimer = setTimeout(function () { _processar(text); }, REPLY_DELAY_MS);
  }

  async function _processar(texto) {
    try {
      if (!_contextoAtivo()) {
        _renderBot('Assistente indisponível. Recarregue a página.');
        return;
      }

      _resetarSeContextoMudou();

      // 1. Número de questão explícito
      var numQ = _detectarNumeroQuestao(texto);

      // 2. Referência implícita à última questão discutida
      if (numQ === null && _ultimaQuestaoVisual !== null && _referenciaImplicita(texto)) {
        numQ = _ultimaQuestaoVisual;
      }

      if (numQ !== null) {
        var q = _buscarQuestaoPorNumero(numQ);
        if (!q) {
          var total = _getSnapshot().length;
          _renderBot(
            'Questão ' + numQ + ' não encontrada.' +
            (total > 0 ? ' O quiz atual tem ' + total + ' questões.' : '')
          );
          return;
        }
        await _responderSobreQuestao(texto, numQ, q);
        return;
      }

      // 3. Pergunta geral de conteúdo
      await _responderGeral(texto);

    } catch (err) {
      console.error('[NexusQuizAssistant] erro ao processar:', err);
      _renderBot('Ocorreu um erro. Tente novamente.');
    } finally {
      if (typeof window.NexusUI !== 'undefined') window.NexusUI.hideTyping();
      state.processando = false;
      _setInputBloqueado(false);
    }
  }

  /* ══════════════════════════════════════════════════════════
     RESET DO CHAT (manual — botão de reset na UI)
  ══════════════════════════════════════════════════════════ */

  function _resetarChat() {
    _limparHistoricoAtivo();
    _ultimaQuestaoVisual = null;
    state.processando    = false;

    if (state.typingTimer) { clearTimeout(state.typingTimer); state.typingTimer = null; }
    if (typeof window.NexusWorker !== 'undefined') window.NexusWorker.limparHistorico();
    if (typeof window.NexusUI     === 'undefined') return;

    window.NexusUI.limparMensagens();
    window.NexusUI.hideTyping();
    _setInputBloqueado(false);

    var sysMsg = { role: 'system', text: '⬡  Nexus IA', time: _getTime() };
    _push(sysMsg);
    window.NexusUI.renderMessage(sysMsg);
    _mostrarBoasVindas();
  }

  /* ══════════════════════════════════════════════════════════
     BOAS-VINDAS
  ══════════════════════════════════════════════════════════ */

  function _mostrarBoasVindas() {
    var modo  = _getModo() || '';
    var disc  = _getDisc() || '';
    var label = modo ? modo.toUpperCase() : 'Quiz';

    _renderBot(
      '📝 Quiz-Assistant — ' + label + (disc ? ' · ' + disc : '') + '\n\n' +
      'Posso ajudar com:\n' +
      '  • Explicar qualquer questão: "explica a questão 3"\n' +
      '  • Dúvidas sobre alternativas: "por que a letra B está errada?"\n' +
      '  • Conteúdo da disciplina: "o que é herança em POO?"\n' +
      '  • Ver gabarito: "qual a resposta da questão 5"\n\n' +
      'Por padrão, sempre explico o conteúdo sem revelar a resposta.\n' +
      'Peça o gabarito explicitamente quando quiser! 😊'
    );
  }

  /* ══════════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════════ */

  function init() {
    if (_iniciado) {
      console.log('[NexusQuizAssistant] init() ignorado — já iniciado.');
      return;
    }

    if (!_verificarDeps()) {
      console.error('[NexusQuizAssistant] init() abortado — dependências obrigatórias ausentes.');
      return;
    }

    _iniciado = true;

    var discId = _getDisc();
    var modo   = _getModo();
    var sem    = _getSemestre();

    // v2.2 — decide ANTES de carregar o histórico se o contexto desta
    // visita é o mesmo da última (mantém) ou mudou (limpa o domínio
    // inteiro). Substitui o antigo listener de 'pagehide'.
    _aplicarPersistenciaContexto(discId, modo, sem);

    state.discAtivo      = discId;
    state.modoAtivo      = modo;
    state.chaveHistorico = _montarChaveHistorico(discId, modo, sem);

    window.NexusUI.init({ onSend: _onUserSend, onReset: _resetarChat });

    if (typeof window.NexusWorker !== 'undefined') {
      window.NexusWorker.limparHistorico();
    }

    window.NexusUI.atualizarDiscAtiva(discId || null);

    var histSalvo = [];
    if (typeof window.NexusHistory !== 'undefined') {
      try {
        histSalvo = window.NexusHistory.carregar(state.chaveHistorico) || [];
      } catch (e) { histSalvo = []; }
    }

    window.NexusUI.limparMensagens();

    if (histSalvo.length > 0) {
      state.messages = histSalvo;
      histSalvo.forEach(function (msg) { window.NexusUI.renderMessage(msg); });

      if (typeof window.NexusWorker !== 'undefined' &&
          typeof window.NexusWorker.restaurarHistorico === 'function') {
        window.NexusWorker.restaurarHistorico(histSalvo);
      }

      var msgsEl = document.getElementById('nexus-messages');
      if (msgsEl) {
        var banner = document.createElement('div');
        banner.className = 'nexus-msg nexus-system nexus-restore-banner';
        banner.innerHTML = '<div class="nexus-msg-bubble">↩ Histórico restaurado</div>';
        msgsEl.appendChild(banner);
      }
    } else {
      var sysMsg = { role: 'system', text: '⬡  Nexus IA', time: _getTime() };
      _push(sysMsg);
      window.NexusUI.renderMessage(sysMsg);
      _mostrarBoasVindas();
    }

    console.log('[NexusQuizAssistant] iniciado v2.2 — disc:', discId, '| modo:', modo,
                '| questões no snapshot:', _getSnapshot().length);
  }

  /* ══════════════════════════════════════════════════════════
     LISTENER DO EVENTO DE BOOT DO ENGINE
  ══════════════════════════════════════════════════════════ */

  function _onQuizPronto() {
    if (_iniciado) return;
    console.log('[NexusQuizAssistant] recebeu nexus:quizPronto — inicializando.');
    init();
  }

  window.addEventListener('nexus:quizPronto', _onQuizPronto);

  if (window.__NEXUS_QUIZ_PRONTO__ === true) {
    console.log('[NexusQuizAssistant] quiz já estava pronto — inicializando diretamente.');
    (window.requestAnimationFrame || setTimeout)(function () { _onQuizPronto(); }, 0);
  }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════════════════════════ */

  window.NexusQuizAssistant = {
    init:          init,
    contextoAtivo: _contextoAtivo,
  };

}());