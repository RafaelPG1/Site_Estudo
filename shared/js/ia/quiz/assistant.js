/**
 * NEXUS — quiz/js/quiz_assistant.js  v2.0
 *
 * Quiz-Assistant: tutor de IA dentro do ambiente de quiz.
 *
 * ARQUITETURA v2.0 — inicialização por evento:
 *   O Assistant NÃO depende de chamada externa (template_init não chama init()).
 *   Ele escuta o evento 'nexus:quizPronto' disparado pelo engine após a primeira
 *   renderização. Isso garante:
 *     - Ordem de carregamento não importa (script pode ser carregado antes ou depois do engine)
 *     - Sem polling (zero setInterval/setTimeout de espera)
 *     - Snapshot visual sempre consistente (engine atualiza, assistant apenas lê)
 *     - Sem crash por dependência ausente (modo seguro com logs claros)
 *
 * Responsabilidades:
 *   - Atuar como tutor de conteúdo da disciplina ativa
 *   - Explicar questões na ordem visual que o usuário está vendo
 *   - Manter histórico isolado por (disciplina + modo + semestre)
 *   - Usar NexusWorker para respostas via IA
 *   - Nunca interferir na lógica de pontuação ou estado do quiz engine
 *
 * NÃO faz:
 *   - Gerar listas de questões ou simular provas
 *   - Acessar estado interno do engine (lê apenas __NEXUS_QUESTOES_VISUAIS__)
 *   - Misturar histórico entre contextos
 *   - Usar polling de qualquer tipo
 *
 * Contrato com quiz_engine.js:
 *   Engine dispara: window.dispatchEvent(new CustomEvent('nexus:quizPronto'))
 *   Assistant escuta: window.addEventListener('nexus:quizPronto', ...)
 *   Engine atualiza: window.__NEXUS_QUESTOES_VISUAIS__ = [...] (snapshot imutável por render)
 *   Assistant lê: window.__NEXUS_QUESTOES_VISUAIS__ (somente leitura)
 *
 * API pública: window.NexusQuizAssistant
 *   init()          — inicialização manual (fallback, normalmente chamada pelo evento)
 *   contextoAtivo() — verifica se o assistente pode operar
 */

(function () {
  'use strict';

  var REPLY_DELAY_MS = 900;

  /* ══════════════════════════════════════════════════════════
     ESTADO INTERNO
  ══════════════════════════════════════════════════════════ */

  var _iniciado = false;  // garante init() idempotente

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
     Sem exceção, sem crash — apenas log + retorno falso.
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
      // Worker é recomendado mas não bloqueia — opera sem IA (só fallback)
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
    // Fallback robusto — não depende de NexusTextUtils
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

  // Lê o snapshot visual criado pelo engine — NUNCA escreve nele
  function _getSnapshot() {
    var v = window.__NEXUS_QUESTOES_VISUAIS__;
    return Array.isArray(v) ? v : [];
  }

  /* ══════════════════════════════════════════════════════════
     VERIFICAÇÃO OPERACIONAL (runtime)
     Distinta de _verificarDeps() — verifica estado de execução.
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
     Isolada por: quiz + disc + semestre + modo
  ══════════════════════════════════════════════════════════ */

  function _montarChaveHistorico(discId, modo, sem) {
    if (typeof window.NexusHistory !== 'undefined') {
      var base = window.NexusHistory.montarChave('quiz', discId, sem);
      return base + '|' + (modo || '').toLowerCase();
    }
    // Fallback determinístico se NexusHistory não estiver disponível ainda
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
     PUSH / RENDER
  ══════════════════════════════════════════════════════════ */

  function _push(msg) {
    state.messages.push(msg);
    _salvarHistorico();
    return msg;
  }

  function _renderBot(text, rodape) {
    if (typeof window.NexusUI === 'undefined') return;
    var msg = _push({ role: 'bot', text: text, time: _getTime(), rodape: rodape || null });
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
     DETECÇÃO DE MUDANÇA DE CONTEXTO
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
      if (typeof window.NexusWorker !== 'undefined') {
        window.NexusWorker.limparHistorico();
      }
    }

    if (discAtual) state.discAtivo = discAtual;
    if (modoAtual) state.modoAtivo = modoAtual;
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
    var norm    = _normalizar(texto);
    var snapshot = _getSnapshot();

    // Padrões explícitos com menção a "questão"
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

    // Número isolado: só interpreta como questão se o resto for tudo palavras neutras
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
     SERIALIZAÇÃO DA QUESTÃO VISUAL
     Usa SOMENTE o snapshot de __NEXUS_QUESTOES_VISUAIS__.
     Alternativas já estão embaralhadas na ordem que o usuário vê.
  ══════════════════════════════════════════════════════════ */

  function _serializarQuestao(numeroVisual, q) {
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

    if (typeof q.answer === 'number') {
      linhas.push('Alternativa correta: ' + String.fromCharCode(65 + q.answer) + ')');
    }
    if (q.feedback) {
      linhas.push('Explicação: ' + q.feedback);
    }

    return linhas.join('\n');
  }

  /* ══════════════════════════════════════════════════════════
     BUSCA DE QUESTÃO NO SNAPSHOT
  ══════════════════════════════════════════════════════════ */

  function _buscarQuestaoPorNumero(numero) {
    var snapshot = _getSnapshot();
    if (!snapshot.length) return null;
    var idx = numero - 1;   // base-1 → base-0
    if (idx < 0 || idx >= snapshot.length) return null;
    return snapshot[idx] || null;
  }

  /* ══════════════════════════════════════════════════════════
     COMUNICAÇÃO COM A IA (NexusWorker)
     Modo seguro: se Worker ausente, usa fallback textual.
  ══════════════════════════════════════════════════════════ */

  async function _perguntarIA(pergunta, resultados, tipoContexto) {
    if (typeof window.NexusWorker === 'undefined') return null;
    try {
      return await window.NexusWorker.perguntar({
        pergunta:     pergunta,
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
     RESPOSTAS
  ══════════════════════════════════════════════════════════ */

  async function _responderSobreQuestao(pergunta, numeroVisual, q) {
    _ultimaQuestaoVisual = numeroVisual;

    var ctxTexto  = _serializarQuestao(numeroVisual, q);
    var resultados = [{ score: 100, texto: ctxTexto, aula: q.aula || '', secao: 'Quiz' }];

    var resp = await _perguntarIA(pergunta, resultados, 'conteudo');
    if (resp) {
      _renderBot(resp.texto, _montarRodape(resp, 'questão ' + numeroVisual));
      return;
    }

    // Fallback: exibe os dados da questão diretamente
    var fb = 'Questão ' + numeroVisual;
    if (q.question) fb += '\n\n' + q.question;
    if (typeof q.answer === 'number' && Array.isArray(q.options)) {
      fb += '\n\nResposta correta: ' +
            String.fromCharCode(65 + q.answer) + ') ' + q.options[q.answer];
    }
    if (q.feedback) fb += '\n\n' + q.feedback;
    _renderBot(fb);
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
     RESET DO CHAT
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
      '  • Conteúdo da disciplina: "o que é herança em POO?"\n\n' +
      'Sobre o que você tem dúvida?'
    );
  }

  /* ══════════════════════════════════════════════════════════
     INIT — inicialização do assistant
     Chamado internamente ao receber 'nexus:quizPronto',
     ou externamente como fallback manual.
     Idempotente: segunda chamada é ignorada com segurança.
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

    state.discAtivo      = discId;
    state.modoAtivo      = modo;
    state.chaveHistorico = _montarChaveHistorico(discId, modo, sem);

    // Conecta callbacks à UI
    window.NexusUI.init({ onSend: _onUserSend, onReset: _resetarChat });

    // Limpa histórico do worker (contexto anterior)
    if (typeof window.NexusWorker !== 'undefined') {
      window.NexusWorker.limparHistorico();
    }

    // Badge de disciplina
    window.NexusUI.atualizarDiscAtiva(discId || null);

    // Tenta restaurar sessão anterior
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

      // Sincroniza worker com histórico visual restaurado
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

    console.log('[NexusQuizAssistant] iniciado — disc:', discId, '| modo:', modo,
                '| questões no snapshot:', _getSnapshot().length);
  }

  /* ══════════════════════════════════════════════════════════
     LISTENER DO EVENTO DE BOOT DO ENGINE
     O engine dispara 'nexus:quizPronto' após a primeira
     _atualizarMapaVisual(). Isso garante:
       - Snapshot visual já está populado
       - Sem polling, sem corrida de ordem de carregamento
       - Se o script for carregado DEPOIS do evento, o flag
         window.__NEXUS_QUIZ_PRONTO__ serve de fallback
  ══════════════════════════════════════════════════════════ */

  function _onQuizPronto() {
    if (_iniciado) return;   // idempotente
    console.log('[NexusQuizAssistant] recebeu nexus:quizPronto — inicializando.');
    init();
  }

  // Escuta o evento (caso script carregue ANTES do engine terminar)
  window.addEventListener('nexus:quizPronto', _onQuizPronto);

  // Fallback: se o evento já disparou antes deste script ser carregado,
  // o engine deixa o flag window.__NEXUS_QUIZ_PRONTO__ = true
  if (window.__NEXUS_QUIZ_PRONTO__ === true) {
    console.log('[NexusQuizAssistant] quiz já estava pronto — inicializando diretamente.');
    // Usa requestAnimationFrame para garantir que o DOM está pintado
    (window.requestAnimationFrame || setTimeout)(function () { _onQuizPronto(); }, 0);
  }

  /* ══════════════════════════════════════════════════════════
     LIMPEZA AO SAIR
  ══════════════════════════════════════════════════════════ */

  window.addEventListener('pagehide', function () {
    if (typeof window.NexusHistory !== 'undefined') {
      try { window.NexusHistory.limparDominio('quiz'); } catch (e) {}
    }
  });

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════════════════════════ */

  window.NexusQuizAssistant = {
    init:          init,           // fallback de inicialização manual
    contextoAtivo: _contextoAtivo, // verifica se está operacional
  };

}());