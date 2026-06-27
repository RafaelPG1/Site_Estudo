/**
 * ASSISTENTE NEXUS — ia.js  v3.0 (QUIZ-ISOLATION)
 *
 * PATCH QUIZ-ISOLATION (estrutural):
 *
 *   1. TOKEN DE SESSÃO DE QUIZ
 *      _quizToken() lê window.__NEXUS_QUIZ_TOKEN__ gerado pelo template_init.
 *      Todas as operações que envolvem dados de quiz (indexação, busca,
 *      serialização, envio ao worker) exigem esse token internamente.
 *      Sem token => operação é no-op silenciosa.
 *
 *   2. ÍNDICES SEPARADOS
 *      NexusSearch agora mantém _indiceResumo e _indiceQuiz fisicamente
 *      separados. buscar() público nunca acessa _indiceQuiz.
 *      Chamadas de indexarQuestoes / buscarQuiz / buscarQuestaoPorNumero
 *      exigem o token em cada chamada.
 *
 *   3. SERIALIZAÇÃO DE QUESTÃO SEM GABARITO FORA DO TEMPLATE
 *      _serializarQuestao() inclui gabarito e feedback SOMENTE quando
 *      _contextoQuizAtivo() retorna true (token presente e válido).
 *      Fora do quiz, o contexto enviado ao worker nunca contém gabarito.
 *
 *   4. PURGE DO ÍNDICE DE QUIZ AO SAIR
 *      _purgarContextoQuiz() é chamado em beforeunload / pagehide e
 *      visibilitychange → hidden. Zera token, índice e contexto de quiz.
 *
 *   5. RESTAURAÇÃO DE SESSÃO NUNCA REINDEXARÁ QUIZ
 *      _garantirConteudo() verifica _contextoQuizAtivo() antes de tentar
 *      indexar questões. Sessões restauradas em páginas sem template_init
 *      ativo só indexarão 'resumo', independentemente do fonteIndexada salvo.
 *
 *   6. CACHE DE BUSCA GLOBAL (discsCacheadas) NUNCA CONTÉM QUESTÕES
 *      _carregarDiscParaBuscaGlobal() opera exclusivamente sobre res_*.js
 *      (estrutura de resumo). Nunca carrega ques_*.js.
 *
 *   7. WORKER: contexto de quiz NÃO é enviado fora do template
 *      _responderSobreQuestao() e _executarBuscaNaDisc() verificam
 *      _contextoQuizAtivo() antes de montar resultados com dados de questão.
 *
 * INVARIANTE CENTRAL:
 *   Fora do template_init (sem window.__NEXUS_QUIZ_TOKEN__ válido):
 *     ❌ NexusSearch.buscar() → retorna apenas trechos de resumo
 *     ❌ NexusSearch.buscarQuiz() → retorna []
 *     ❌ NexusSearch.buscarQuestaoPorNumero() → retorna null
 *     ❌ NexusSearch.indexarQuestoes() → no-op
 *     ❌ _serializarQuestao() → sem gabarito/feedback
 *     ❌ _responderSobreQuestao() → retorna sem enviar dados de questão
 *     ❌ worker nunca recebe gabarito, feedback ou alternativas do quiz
 *     ✅ Resumo disponível normalmente
 */

(function () {
  'use strict';

  const REPLY_DELAY_MS  = 900;
  const TOP_K           = 8;
  const MIN_SCORE       = 15;
  const MAX_HISTORY     = 20;
  const SESSION_KEY     = 'nexus_chat_history';
  const SESSION_DISC    = 'nexus_disc_ativa';

  const state = {
    messages:       [],
    typingTimer:    null,
    discEscolhida:  null,
    aguardandoDisc: false,
    processando:    false,
    discsCacheadas: {},
    discIndexadaId: null,
    fonteIndexada:  null,
    conteudoAtual:  null,
  };

  /* ══════════════════════════════════════════════════════════
     TOKEN E CONTEXTO DE QUIZ
  ══════════════════════════════════════════════════════════ */

  /**
   * Retorna o token de quiz ativo ou null.
   * ÚNICA fonte de verdade para autorização de quiz.
   *
   * @returns {string|null}
   */
  function _quizToken() {
    var t = window.__NEXUS_QUIZ_TOKEN__;
    if (!t || typeof t !== 'string') return null;
    return t;
  }

  /**
   * Retorna true SE E SOMENTE SE estivermos dentro de um template
   * de quiz com token de sessão válido.
   *
   * NÃO depende de window.__NEXUS_QUIZ_MODO__ sozinho (que persiste
   * entre navegações no mesmo tab). O token é a âncora segura.
   *
   * @returns {boolean}
   */
  function _contextoQuizAtivo() {
    return _quizToken() !== null && window.__NEXUS_QUIZ_MODO__ !== undefined;
  }

  /**
   * Purga todo o contexto de quiz desta sessão.
   * Chamado em unload, pagehide e visibilitychange → hidden.
   * Após esta chamada nenhum dado de quiz fica acessível.
   */
  function _purgarContextoQuiz() {
    // Remove a flag de modo do quiz
    try { delete window.__NEXUS_QUIZ_MODO__; } catch (e) {}

    // Revoga o token no NexusSearch (zera _indiceQuiz)
    if (typeof window.NexusSearch !== 'undefined' && NexusSearch.revogarQuiz) {
      NexusSearch.revogarQuiz();
    }

    // Limpa estado local
    state.fonteIndexada  = null;
    state.discIndexadaId = null;
    state.conteudoAtual  = null;

    // Remove token do window para fechar o acesso
    try { delete window.__NEXUS_QUIZ_TOKEN__; } catch (e) {}

    console.log('[NexusAssistant] contexto de quiz purgado.');
  }

  /* ── Listeners de purge automático ── */
  (function _instalarListenersPurge() {
    // beforeunload / pagehide: saída da página de quiz
    window.addEventListener('beforeunload', _purgarContextoQuiz);
    window.addEventListener('pagehide',     _purgarContextoQuiz);

    // visibilitychange → hidden: usuário troca de aba ou minimiza
    // Não purgamos aqui para não quebrar retorno imediato ao quiz,
    // mas zeramos caso __NEXUS_QUIZ_MODO__ não esteja mais definido.
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') return; // deixa para beforeunload
      // Quando volta (visible): verifica se ainda está no template de quiz
      if (document.visibilityState === 'visible' && !_contextoQuizAtivo()) {
        _purgarContextoQuiz();
      }
    });
  }());

  /* ══════════════════════════════════════════════════════════
     HELPERS DE STATE
  ══════════════════════════════════════════════════════════ */

  function _normalizar(str) {
    return NexusSearch.normalizarTexto(str);
  }

  function _getTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function _push(msg) {
    state.messages.push(msg);
    if (state.messages.length > MAX_HISTORY) {
      const sistemaIdx = state.messages.findIndex(function (m) { return m.role === 'system'; });
      const sistema    = sistemaIdx !== -1 ? state.messages[sistemaIdx] : null;
      const recentes   = state.messages
        .filter(function (m) { return m.role !== 'system'; })
        .slice(-(MAX_HISTORY - 1));
      state.messages = sistema ? [sistema].concat(recentes) : recentes;
    }
    _salvarHistorico();
    return msg;
  }

  function _renderBot(text, rodape) {
    const msg = _push({ role: 'bot', text: text, time: _getTime(), rodape: rodape || null });
    NexusUI.renderMessage(msg);
  }

  function _setInputBloqueado(bloqueado) {
    const input   = document.getElementById('nexus-input');
    const sendBtn = document.getElementById('nexus-send');
    if (input)   input.disabled   = bloqueado;
    if (sendBtn) sendBtn.disabled = bloqueado;
    if (input) input.placeholder = bloqueado ? 'Aguarde…' : 'Digite sua mensagem…';
  }

  function _salvarHistorico() {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(state.messages)); } catch (e) {}
  }

  function _salvarDiscAtiva() {
    try {
      if (state.discEscolhida) {
        sessionStorage.setItem(SESSION_DISC, JSON.stringify({
          id:      state.discEscolhida.id,
          apelido: state.discEscolhida.apelido,
          nome:    state.discEscolhida.nome,
          arquivo: state.discEscolhida.arquivo,
        }));
      } else {
        sessionStorage.removeItem(SESSION_DISC);
      }
    } catch (e) {}
  }

  function _carregarHistorico() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const msgs = JSON.parse(raw);
      if (!Array.isArray(msgs) || !msgs.length) return null;
      return msgs;
    } catch (e) { return null; }
  }

  function _carregarDiscSalva() {
    try {
      const raw = sessionStorage.getItem(SESSION_DISC);
      if (!raw) return null;
      const disc = JSON.parse(raw);
      if (!disc || !disc.id) return null;
      const discs = _getDisciplinas();
      if (!discs) return null;
      const encontrada = discs.find(function (d) { return d.id === disc.id; });
      return encontrada || null;
    } catch (e) { return null; }
  }

  function _limparHistoricoStorage() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_DISC);
    } catch (e) {}
  }

  function _getCtxBridge() {
    const ctx = window.__nexusCtx;
    if (!ctx) { console.warn('[NexusAssistant] window.__nexusCtx não disponível.'); return null; }
    return ctx;
  }

  function _getDisciplinas() {
    const ctx = _getCtxBridge();
    if (!ctx) return null;
    const sem = ctx.getSemestre();
    return ctx.getDisciplinas(sem) || null;
  }

  function _montarCtx(disc) {
    const ctx = _getCtxBridge();
    if (!ctx || !disc) return null;
    const sem    = ctx.getSemestre();
    const parsed = ctx.parseSemestre(sem);

    // A fonte só é 'quiz' se o contexto de quiz estiver explicitamente ativo
    // com token válido. Em qualquer outra situação (incluindo restauração de
    // sessão em páginas sem template_init), a fonte é sempre 'resumo'.
    const fonte = _contextoQuizAtivo()
      ? 'quiz'
      : ((ctx.getFonte && ctx.getFonte() === 'resumo') ? 'resumo' : 'resumo');

    const prefixo   = fonte === 'quiz' ? 'ques_'    : ((ctx.getPrefixo  && ctx.getPrefixo())  || 'res_');
    const varGlobal = fonte === 'quiz' ? 'questoes' : ((ctx.getVarGlobal && ctx.getVarGlobal()) || '__nexusConteudo');

    return { ano: parsed.ano, periodo: parsed.periodo, ap: parsed.ap, arquivo: disc.arquivo, fonte, prefixo, varGlobal };
  }

  function _resolverDisc() {
    if (state.discEscolhida) return state.discEscolhida;
    const ctx = _getCtxBridge();
    if (!ctx) return null;
    const idAtivo = ctx.getDisciplinaAtual ? ctx.getDisciplinaAtual() : null;
    if (idAtivo) {
      const discs = _getDisciplinas();
      if (discs) {
        const found = discs.find(function (d) { return d.id === idAtivo; });
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Garante que o conteúdo está carregado e indexado.
   *
   * QUIZ-ISOLATION:
   *   - Só indexa questões se _contextoQuizAtivo() for true E o token for válido.
   *   - Se o contexto de quiz não estiver ativo, força fonte='resumo' independente
   *     do que estiver em state.fonteIndexada (evita reutilização de índice de quiz
   *     após restauração de sessão).
   */
  async function _garantirConteudo(disc) {
    const loaderCtx = _montarCtx(disc);
    if (!loaderCtx) return null;
    const conteudo = await NexusLoader.carregar(loaderCtx);
    if (!conteudo) return null;

    // Força sempre 'resumo' fora do contexto de quiz ativo
    const fonte = _contextoQuizAtivo() ? 'quiz' : 'resumo';

    const precisaReindexar = (
      !NexusSearch.estaIndexado() ||
      state.discIndexadaId !== disc.id ||
      state.fonteIndexada  !== fonte
    );

    // Também reindexar se o índice de quiz foi revogado mas fonteIndexada='quiz'
    const quizRevogado = (state.fonteIndexada === 'quiz' && !_contextoQuizAtivo());

    if (precisaReindexar || quizRevogado) {
      if (fonte === 'quiz') {
        const token = _quizToken();
        const modo  = window.__NEXUS_QUIZ_MODO__ || 'questoes';
        // Passa o token — NexusSearch valida internamente
        NexusSearch.indexarQuestoes(conteudo, modo, token);
      } else {
        // Garante que o índice de quiz foi limpo antes de indexar o resumo
        NexusSearch.limparIndice();
        NexusSearch.indexarConteudo(conteudo);
      }
      state.discIndexadaId = disc.id;
      state.fonteIndexada  = fonte;
    }

    state.conteudoAtual = conteudo;
    return conteudo;
  }

  function _limparContexto() {
    NexusSearch.limparIndice();
    NexusLoader.limpar();
    state.discEscolhida  = null;
    state.aguardandoDisc = false;
    state.discIndexadaId = null;
    state.fonteIndexada  = null;
    state.conteudoAtual  = null;
    _salvarDiscAtiva();
    NexusUI.atualizarDiscAtiva(null);
    if (typeof window.NexusWorker !== 'undefined') NexusWorker.limparHistorico();
    console.log('[NexusAssistant] contexto limpo.');
  }

  function _pedirDisc() {
    const discs = _getDisciplinas();
    if (!discs || !discs.length) {
      _renderBot('Não encontrei disciplinas para o semestre atual.');
      return;
    }
    const lista = discs.map(function (d) { return '  /disc ' + d.id + '   — ' + d.nome; }).join('\n');
    _renderBot(
      'Disciplinas disponíveis:\n\n' + lista + '\n\n' +
      'Digite o nome da disciplina ou use /disc <nome> para selecionar.'
    );
    const chips = discs.map(function (d) { return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' }; });
    NexusUI.mostrarSugestoes(chips, _onSugestaoClick);
    state.aguardandoDisc = true;
  }

  async function _confirmarDisc(disc) {
    NexusSearch.limparIndice();
    NexusLoader.limpar();
    state.discIndexadaId = null;
    state.fonteIndexada  = null;
    state.discEscolhida  = disc;
    state.aguardandoDisc = false;
    _salvarDiscAtiva();

    if (typeof window.NexusWorker !== 'undefined') NexusWorker.limparHistorico();

    const loaderCtx = _montarCtx(disc);
    if (!loaderCtx) {
      state.discEscolhida = null;
      _salvarDiscAtiva();
      _renderBot('Não consegui montar o contexto de ' + disc.apelido + '. Tente novamente.');
      return false;
    }
    const conteudo = await NexusLoader.carregar(loaderCtx);
    if (!conteudo) {
      state.discEscolhida = null;
      _salvarDiscAtiva();
      _renderBot('Não consegui carregar o conteúdo de ' + disc.apelido + '. Tente novamente.');
      return false;
    }

    // _confirmarDisc sempre indexa o RESUMO — nunca quiz
    // (o quiz é indexado sob demanda em _garantirConteudo quando dentro do template)
    NexusSearch.indexarConteudo(conteudo);
    state.discIndexadaId = disc.id;
    state.fonteIndexada  = 'resumo';

    NexusUI.atualizarDiscAtiva(disc.apelido);
    const sugestoes = _gerarSugestoes(conteudo);
    _renderBot(
      '✓ Disciplina carregada: ' + disc.apelido + '\n\n' +
      'Pode fazer perguntas sobre ' + disc.nome + '.\n' +
      'Para trocar: /disc <nome>  ·  Ajuda: ?'
    );
    if (sugestoes.length > 0) NexusUI.mostrarSugestoes(sugestoes, _onSugestaoClick);
    return true;
  }

  function _matchDisc(texto) {
    const discs = _getDisciplinas();
    if (!discs) return null;
    const norm = _normalizar(texto);
    var found = discs.find(function (d) { return _normalizar(d.id) === norm; });
    if (found) return found;
    found = discs.find(function (d) { return _normalizar(d.apelido) === norm; });
    if (found) return found;
    found = discs.find(function (d) { return _normalizar(d.nome) === norm; });
    return found || null;
  }

  function _levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    var prev = [];
    for (var j = 0; j <= b.length; j++) prev[j] = j;
    for (var i = 1; i <= a.length; i++) {
      var curr = [i];
      for (var jj = 1; jj <= b.length; jj++) {
        var cost = a[i - 1] === b[jj - 1] ? 0 : 1;
        curr[jj] = Math.min(curr[jj - 1] + 1, prev[jj] + 1, prev[jj - 1] + cost);
      }
      prev = curr;
    }
    return prev[b.length];
  }

  function _fuzzyMatchDiscs(query, maxDist) {
    const discs = _getDisciplinas();
    if (!discs) return [];
    const q = _normalizar(query);
    var candidatos = [];
    discs.forEach(function (d) {
      var distId    = _levenshtein(q, _normalizar(d.id));
      var distAlias = _levenshtein(q, _normalizar(d.apelido));
      var dist      = Math.min(distId, distAlias);
      if (dist <= maxDist) candidatos.push({ disc: d, dist: dist });
    });
    candidatos.sort(function (a, b) { return a.dist - b.dist; });
    return candidatos.map(function (c) { return c.disc; });
  }

  function _chipsDiscs(discs, modoCmd) {
    var tipo = modoCmd ? 'disc-cmd' : 'disc';
    return discs.map(function (d) {
      return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: tipo };
    });
  }

  function _detectarComandoTroca(texto) {
    const norm = _normalizar(texto.trim());
    const REGEX_BARRA  = /\/disc\s+(\S+)/i;
    const REGEX_INICIO = /^disc\s+(\S+)/i;

    var m = norm.match(REGEX_BARRA) || norm.match(REGEX_INICIO);
    if (!m) return null;

    const query = _normalizar(m[1]);
    const residual = norm
      .replace(m[0].trim(), '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s*[,;:?!]\s*/, '')
      .trim();

    const exato = _matchDisc(query);
    if (exato) return { tipo: 'exato', disc: exato, query, perguntaResidual: residual };
    if (query.length < 4) return { tipo: 'curto', query, perguntaResidual: residual };

    const maxDist    = query.length >= 7 ? 3 : 2;
    const candidatos = _fuzzyMatchDiscs(query, maxDist);

    if (!candidatos.length) return { tipo: 'nenhum', query, perguntaResidual: residual };
    if (candidatos.length === 1) return { tipo: 'fuzzy', disc: candidatos[0], candidatos, query, perguntaResidual: residual };
    return { tipo: 'multiplo', candidatos, query, perguntaResidual: residual };
  }

  function _ehPedidoAjuda(texto) {
    const norm = _normalizar(texto);
    return norm === 'ajuda' || norm === '?' || norm === 'help';
  }

  function _ehSaudacao(texto) {
    var norm = _normalizar(texto.trim());
    var SAUDACOES = [
      'oi', 'ola', 'hey', 'hi', 'hello',
      'bom dia', 'boa tarde', 'boa noite',
      'eai', 'e ai', 'ei', 'ae', 'salve', 'opa',
      'oii', 'olaa', 'oioi', 'oi oi',
      'tudo bem', 'tudo bom', 'como vai', 'como voce esta',
      'oi tudo bem', 'ola tudo bem', 'bom dia tudo bem',
      'oi como vai', 'ola como vai',
    ];
    return SAUDACOES.some(function (s) {
      return norm === s || norm.startsWith(s + ' ') || norm.startsWith(s + ',');
    });
  }

  function _ehAgradecimento(texto) {
    var norm = _normalizar(texto.trim());
    var AGRADECIMENTOS = [
      'obrigado', 'obrigada', 'muito obrigado', 'muito obrigada',
      'brigado', 'brigada', 'obg', 'vlw', 'valeu', 'valew',
      'grato', 'grata', 'agradecido', 'agradecida',
      'thanks', 'thank you', 'thx',
    ];
    var DESPEDIDAS = [
      'tchau', 'ate mais', 'ate logo', 'ate amanha',
      'flw', 'falou', 'fui', 'xau', 'bye', 'bye bye',
    ];
    var todos = AGRADECIMENTOS.concat(DESPEDIDAS);
    return todos.some(function (s) {
      return norm === s || norm.startsWith(s + ' ') || norm.startsWith(s + ',') || norm.startsWith(s + '!');
    });
  }

  function _ehPerguntaSobreGabarito(texto) {
    var norm = _normalizar(texto.trim());
    var PADROES = [
      /\b(?:qual|me\s+(?:fala|diz|passa))\s+(?:e\s+a?\s+|a?\s+)?(?:resposta|gabarito|alternativa\s+correta)\b/,
      /\b(?:resposta|gabarito)\s+(?:d[ao]s?\s+)?(?:quest(?:ao|oes?)?|q\s*\d|#\s*\d|\d)/,
      /\b(?:resposta|gabarito)\s+(?:corret[ao]s?|certo|certa)s?\b/,
      /\bqual\s+(?:e\s+a?\s+)?(?:letra|alternativa|opcao)\s+corret[ao]\b/,
      /\bquest(?:ao|oes?)?\s*(?:n?[o°]?\s*)?\d+\s+(?:resposta|gabarito|alternativa|letra)\b/,
      /\b(?:resposta|gabarito)\s+(?:e|eh|e\s+a|eh\s+a)\s+[a-e]\b/,
      /\bqual\s+(?:e\s+)?(?:o\s+)?gabarito\b/,
      /\bme\s+(?:da|fala|diz)\s+(?:o\s+)?gabarito\b/,
    ];
    for (var i = 0; i < PADROES.length; i++) {
      if (PADROES[i].test(norm)) return true;
    }
    var temNumero   = /\d+/.test(norm);
    var temGabarito = /\b(?:resposta|gabarito|alternativa|letra\s+corret[ao])\b/.test(norm);
    if (temNumero && temGabarito && norm.split(' ').length <= 8) return true;
    return false;
  }

  function _responderAjuda(discAtual) {
    const discs = _getDisciplinas() || [];
    const exemplosDiscs = discs.map(function (d) { return '  /disc ' + d.id + '   — ' + d.apelido; }).join('\n');
    const discAtualLinha = discAtual
      ? 'Disciplina atual: ' + discAtual.apelido + ' (' + discAtual.nome + ')'
      : 'Nenhuma disciplina selecionada.';
    _renderBot(
      discAtualLinha + '\n\n' +
      'Comandos:\n' +
      '  /disc <nome>   — selecionar ou trocar disciplina\n' +
      '  resumo aula N  — ideia central da aula N\n' +
      '  buscar em tudo: <termo>  — buscar em todas as disciplinas\n' +
      '  ajuda / ?      — exibir esta mensagem\n\n' +
      'Dica: use /disc em qualquer ponto da mensagem:\n' +
      '  "oq é tcp em /disc redes?" → seleciona Redes e já responde\n\n' +
      'Disciplinas disponíveis:\n' + exemplosDiscs + '\n\n' +
      'Qualquer outra mensagem é tratada como busca na disciplina atual.'
    );
  }

  function _detectarResumoAula(texto) {
    const norm = _normalizar(texto.trim());
    const PADROES = [
      /^resumo\s+(?:d[ao]\s+)?aula\s+(\d+)$/,
      /^aula\s+(\d+)\s*(?:resumo)?$/,
      /^ver\s+aula\s+(\d+)$/,
      /^mostrar\s+aula\s+(\d+)$/,
    ];
    for (var i = 0; i < PADROES.length; i++) {
      var m = norm.match(PADROES[i]);
      if (m) return parseInt(m[1], 10);
    }
    return null;
  }

  function _responderResumoAula(numAula, nomeDisc) {
    // Usa apenas conteudo de resumo — nunca window.questoes
    const conteudo = state.conteudoAtual;
    if (!conteudo || !Array.isArray(conteudo.aulas)) {
      return 'Conteúdo não carregado. Selecione uma disciplina primeiro.';
    }
    const aula = conteudo.aulas.find(function (a) {
      if (!a.aula) return false;
      var m = a.aula.match(/(\d+)/);
      return m && parseInt(m[1], 10) === numAula;
    });
    if (!aula) {
      return (
        'Aula ' + numAula + ' não encontrada em ' + nomeDisc + '.\n\n' +
        'Aulas disponíveis: ' +
        conteudo.aulas.map(function (a) { return a.aula || '?'; }).join(', ')
      );
    }
    const ideia     = aula.ideia_central || '(sem ideia central registrada)';
    const numSecoes = Array.isArray(aula.secoes) ? aula.secoes.length : 0;
    const titulosSecoes = numSecoes > 0
      ? aula.secoes.map(function (s) { return '  • ' + (s.titulo || '—'); }).join('\n')
      : '  (nenhuma seção registrada)';
    return (
      '📖 ' + aula.aula + '\n─────────────────────\n' +
      ideia + '\n\nSeções (' + numSecoes + '):\n' + titulosSecoes + '\n\n─── ' + nomeDisc
    );
  }

  function _detectarBuscaGlobal(texto) {
    const norm = _normalizar(texto.trim());
    const PADROES = [
      /^buscar\s+em\s+tudo[:\s]+(.+)$/,
      /^busca\s+global[:\s]+(.+)$/,
      /^buscar\s+tudo[:\s]+(.+)$/,
      /^global[:\s]+(.+)$/,
    ];
    for (var i = 0; i < PADROES.length; i++) {
      var m = norm.match(PADROES[i]);
      if (m && m[1].trim().length >= 2) return m[1].trim();
    }
    return null;
  }

  function _detectarPerguntaGlobal(texto) {
    const norm = _normalizar(texto.trim());
    const PADROES = [
      /\bcada\s+aula\b/, /\bpor\s+aula\b/, /\btodas?\s+(?:as\s+)?aulas?\b/,
      /\bresumo\s+(?:da?\s+)?(?:disciplina|conteudo|materia|curso)\b/,
      /\bconteudo\s+(?:completo|da?\s+(?:disciplina|materia|curso))\b/,
      /\bassuntos?\s+(?:da?\s+)?(?:disciplina|materia|curso|aulas?)\b/,
      /\btopicos?\s+(?:da?\s+)?(?:disciplina|materia|curso|aulas?)\b/,
      /\blista\s+(?:de\s+)?topicos?\b/, /\bo\s+que\s+(?:\w+\s+)?estudar\b/,
      /\bo\s+que\s+(?:cai|vai\s+cair|pode\s+cair)\s+(?:na|em)\s+prova\b/,
      /\b(?:assuntos?|topicos?|conteudos?)\s+(?:para\s+(?:a\s+)?prova|importantes?)\b/,
      /\bvisao\s+geral\b/, /\b(?:me\s+(?:faz?|da|de|passa))\s+(?:um\s+)?resumo\b/,
      /\b(?:principais?|mais\s+importantes?)\s+(?:assuntos?|topicos?|pontos?|conteudos?)\b/,
      /\b(?:assuntos?|topicos?|pontos?|conteudos?)\s+mais\s+importantes?\b/,
      /\bo\s+que\s+(?:tem|foi\s+visto|estudamos?|aprendemos?|vimos?)\s+(?:em\s+)?cada\s+aula\b/,
      /\bmapa\s+(?:da?\s+)?(?:disciplina|materia|estudos?)\b/,
    ];
    for (var i = 0; i < PADROES.length; i++) {
      if (PADROES[i].test(norm)) return true;
    }
    return false;
  }

  function _montarContextoGlobal(conteudo) {
    if (!conteudo || !Array.isArray(conteudo.aulas)) return [];
    var resultados = [];
    conteudo.aulas.forEach(function (aula) {
      var nomeAula = aula.aula || 'Aula';
      var ideia = aula.ideia_central ? aula.ideia_central.trim() : '';
      var titulosSecoes = '';
      if (Array.isArray(aula.secoes) && aula.secoes.length > 0) {
        titulosSecoes = aula.secoes.map(function (s) { return s.titulo || ''; }).filter(Boolean).join(' · ');
      }
      var textoAula = ideia;
      if (titulosSecoes) textoAula += (textoAula ? ' | Seções: ' : 'Seções: ') + titulosSecoes;
      if (!textoAula) return;
      resultados.push({ score: 100, texto: textoAula, aula: nomeAula, secao: 'Visão Geral' });
    });
    return resultados;
  }

  function _montarMapaDisc(conteudo) {
    if (!conteudo || !Array.isArray(conteudo.aulas)) return [];
    return conteudo.aulas.map(function (aula, i) {
      var secoes = '';
      if (Array.isArray(aula.secoes) && aula.secoes.length > 0) {
        secoes = aula.secoes.map(function (s) { return s.titulo || ''; }).filter(Boolean).join(', ');
      }
      var texto = 'Aula ' + (i + 1);
      if (aula.aula) texto += ' — ' + aula.aula;
      if (secoes) texto += ' | Seções: ' + secoes;
      return { score: 100, texto: texto, aula: aula.aula || ('Aula ' + (i + 1)), secao: 'Mapa' };
    });
  }

  function _detectarPerguntaNavegacao(texto) {
    var norm = _normalizar(texto.trim());
    var PADROES = [
      /\bpor\s+onde\s+(?:comecar|comeco|inicio|devo\s+comecar)\b/,
      /\bonde\s+(?:comecar|comeco|devo\s+comecar)\b/,
      /\bqual\s+aula\s+(?:estudar|ver|fazer|comecar)\s+(?:primeiro|antes)\b/,
      /\bqual\s+aula\s+(?:vem|fica|fica)\s+(?:depois|antes|apos)\b/,
      /\bqual\s+(?:e\s+a\s+)?(?:primeira|proxima|ultima)\s+aula\b/,
      /\b(?:sequencia|ordem)\s+(?:das?\s+)?(?:aulas?|estudos?|conteudos?)\b/,
      /\bsequencia\s+(?:de\s+)?estudo\b/, /\bem\s+que\s+ordem\b/,
      /\bplano\s+(?:de\s+)?(?:estudo|estudos|revisao|estudo)\b/,
      /\bcronograma\s+(?:de\s+)?(?:estudo|estudos|revisao)\b/,
      /\bmonte\s+(?:um\s+)?(?:plano|cronograma|roteiro|guia)\b/,
      /\bcrie\s+(?:um\s+)?(?:plano|cronograma|roteiro|guia)\b/,
      /\bfaca\s+(?:um\s+)?(?:plano|cronograma|roteiro|guia)\b/,
      /\bquais?\s+aulas?\s+(?:dependem|precisam|requerem|necessitam)\b/,
      /\bquais?\s+(?:sao\s+os?\s+)?(?:prerequisitos?|pre-?requisitos?)\b/,
      /\bo\s+que\s+preciso\s+(?:saber|estudar|ver)\s+antes\b/,
      /\b(?:comecar|iniciar)\s+(?:pelos?\s+)?(?:basico|fundamentos?|inicio|começo)\b/,
      /\bsequencia\s+(?:recomendada|ideal|certa|correta)\b/,
      /\bordem?\s+(?:recomendada?|ideal|certo|correta?)\b/,
      /\bquais?\s+(?:sao\s+)?(?:todas?\s+(?:as\s+)?)?aulas?\s+(?:da\s+)?disciplina\b/,
      /\bquantas\s+aulas?\b/, /\bliste\s+(?:as\s+)?(?:todas\s+(?:as\s+)?)?aulas?\b/,
      /\bquais?\s+(?:sao\s+)?as\s+aulas\b/,
    ];
    for (var i = 0; i < PADROES.length; i++) {
      if (PADROES[i].test(norm)) return true;
    }
    return false;
  }

  function _detectarLocalizacao(texto) {
    const norm = _normalizar(texto.trim());
    const PADROES = [
      /^em\s+qual\s+aula\s+(?:esta|fica|aparece|tem|fala(?:\s+sobre)?|explica(?:\s+sobre)?)\s+(.+)$/,
      /^em\s+qual\s+aula\s+(?:eu\s+)?(?:vejo|encontro|estudo|aprendo)\s+(.+)$/,
      /^onde\s+(?:esta|foi\s+explicado|fica|aparece|tem|fala(?:\s+sobre)?)\s+(.+)$/,
      /^onde\s+(?:eu\s+)?(?:encontro|vejo|estudo|aprendo)\s+(.+)$/,
      /^qual\s+(?:secao|aula|parte)\s+(?:fala\s+(?:sobre|de)|trata\s+(?:de|sobre)|explica|tem)\s+(.+)$/,
      /^em\s+qual\s+(?:conteudo|parte|secao)\s+(?:(?:nos\s+)?vimos|estudamos|aprendemos|foi\s+(?:explicado|visto))\s+(.+)$/,
      /^(.+)\s+(?:foi\s+(?:visto|explicado|abordado|estudado)|aparece|esta)\s+em\s+qual\s+(?:aula|secao|parte)[\?]?$/,
      /^onde\s+(?:(?:nos\s+)?vimos|estudamos|aprendemos|foi\s+(?:visto|explicado))\s+(.+)$/,
    ];
    for (var i = 0; i < PADROES.length; i++) {
      var m = norm.match(PADROES[i]);
      if (m && m[1] && m[1].trim().length >= 2) return m[1].trim();
    }
    return null;
  }

  function _responderLocalizacao(termoLocalizar, nomeDisc) {
    // buscar() usa apenas _indiceResumo — seguro
    var resultados = NexusSearch.buscar(termoLocalizar, { topK: 8, minScore: MIN_SCORE });
    if (!resultados.length) {
      return (
        'Não encontrei "' + termoLocalizar + '" em nenhuma aula de ' + nomeDisc + '.\n\n' +
        'Dicas:\n  • Tente um termo mais simples ou sinônimo\n' +
        '  • Verifique se o assunto pertence a esta disciplina'
      );
    }
    var porAula = {};
    var aulasOrdem = [];
    resultados.forEach(function (r) {
      var chave = r.aula || 'Geral';
      if (!porAula[chave]) { porAula[chave] = []; aulasOrdem.push(chave); }
      porAula[chave].push(r);
    });
    var linhas = ['📍 "' + termoLocalizar + '" aparece em ' + nomeDisc + ':\n'];
    aulasOrdem.forEach(function (nomeAula) {
      var ocorrencias = porAula[nomeAula];
      var secoes = [];
      var secoesVistas = {};
      ocorrencias.forEach(function (r) {
        var s = r.secao || '';
        if (s && !secoesVistas[s]) { secoesVistas[s] = true; secoes.push(s); }
      });
      linhas.push('📖 ' + nomeAula);
      if (secoes.length > 0) linhas.push('   📂 Seção: ' + secoes.join(' · '));
      var melhor = ocorrencias[0];
      var trecho = _truncarNaPalavra(melhor.texto, 200);
      linhas.push('   "' + trecho + '"');
      linhas.push('');
    });
    linhas.push('─── ' + nomeDisc);
    return linhas.join('\n').trim();
  }

  /**
   * QUIZ-ISOLATION: _carregarDiscParaBuscaGlobal carrega APENAS resumo (res_*.js).
   * Nunca carrega ques_*.js nem acessa window.questoes.
   */
  async function _carregarDiscParaBuscaGlobal(disc) {
    if (state.discsCacheadas[disc.id]) return state.discsCacheadas[disc.id];

    // Força fonte=resumo explicitamente — ignora contexto de quiz
    const ctx = _getCtxBridge();
    if (!ctx) return [];
    const sem    = ctx.getSemestre();
    const parsed = ctx.parseSemestre(sem);
    const prefixo   = (ctx.getPrefixo && ctx.getPrefixo()) || 'res_';
    const varGlobal = (ctx.getVarGlobal && ctx.getVarGlobal()) || '__nexusConteudo';
    const loaderCtxResumo = {
      ano: parsed.ano, periodo: parsed.periodo, ap: parsed.ap,
      arquivo: disc.arquivo, fonte: 'resumo', prefixo, varGlobal,
    };

    const conteudo = await NexusLoader.carregar(loaderCtxResumo);
    if (!conteudo || !Array.isArray(conteudo.aulas)) return [];

    const trechos = [];
    conteudo.aulas.forEach(function (aula) {
      const nomeAula = aula.aula || '';
      if (aula.ideia_central) trechos.push({ texto: aula.ideia_central, aula: nomeAula, secao: 'Ideia Central', disc: disc.apelido });
      if (Array.isArray(aula.secoes)) {
        aula.secoes.forEach(function (secao) {
          if (secao.titulo) trechos.push({ texto: secao.titulo, aula: nomeAula, secao: secao.titulo, disc: disc.apelido });
          if (Array.isArray(secao.blocos)) {
            secao.blocos.forEach(function (bloco) {
              _extrairTextosBloco(bloco).forEach(function (t) {
                trechos.push({ texto: t, aula: nomeAula, secao: secao.titulo || '', disc: disc.apelido });
              });
            });
          }
        });
      }
    });
    state.discsCacheadas[disc.id] = trechos;
    return trechos;
  }

  function _extrairTextosBloco(bloco) {
    if (!bloco || !bloco.tipo) return [];
    var textos = [];
    switch (bloco.tipo) {
      case 'texto': case 'destaque': case 'subtitulo':
        if (bloco.texto) textos.push(bloco.texto); break;
      case 'topico':
        if (bloco.titulo) textos.push(bloco.titulo);
        if (bloco.texto)  textos.push(bloco.texto);
        if (Array.isArray(bloco.lista)) textos.push(bloco.lista.join(' ')); break;
      case 'lista':
        if (bloco.titulo) textos.push(bloco.titulo);
        if (Array.isArray(bloco.itens)) textos.push(bloco.itens.join(' ')); break;
      case 'exemplo':
        if (bloco.titulo) textos.push(bloco.titulo);
        if (bloco.texto)  textos.push(bloco.texto);
        if (typeof bloco.detalhe === 'string') textos.push(bloco.detalhe); break;
    }
    return textos;
  }

  function _scoreBuscaGlobal(queryNorm, textoNorm) {
    if (!queryNorm || !textoNorm) return 0;
    var termos = queryNorm.split(' ').filter(Boolean);
    if (!termos.length) return 0;
    var acertos = 0;
    termos.forEach(function (t) { if (textoNorm.includes(t)) acertos++; });
    var bonus = textoNorm.includes(queryNorm) ? 0.3 : 0;
    return Math.min(100, Math.round((acertos / termos.length + bonus) * 100));
  }

  async function _executarBuscaGlobal(termoBusca) {
    const discs = _getDisciplinas();
    if (!discs || !discs.length) return 'Nenhuma disciplina encontrada para este semestre.';
    const queryNorm      = _normalizar(termoBusca);
    const todosResultados = [];
    const discAtual      = _resolverDisc();
    for (var i = 0; i < discs.length; i++) {
      var disc = discs[i];
      // Usa o índice de resumo se disponível para a disc ativa; nunca usa índice de quiz
      if (discAtual && disc.id === discAtual.id &&
          NexusSearch.estaIndexado() &&
          state.discIndexadaId === discAtual.id &&
          state.fonteIndexada  === 'resumo') {
        var res = NexusSearch.buscar(termoBusca, { topK: 3, minScore: MIN_SCORE });
        res.forEach(function (r) { todosResultados.push(Object.assign({}, r, { disc: disc.apelido })); });
      } else {
        var trechos = await _carregarDiscParaBuscaGlobal(disc);
        trechos.forEach(function (t) {
          var sc = _scoreBuscaGlobal(queryNorm, _normalizar(t.texto));
          if (sc >= MIN_SCORE) todosResultados.push({ score: sc, texto: t.texto, aula: t.aula, secao: t.secao, disc: t.disc });
        });
      }
    }
    if (!todosResultados.length) return 'Nenhum resultado para "' + termoBusca + '" em nenhuma disciplina.';
    todosResultados.sort(function (a, b) { return b.score - a.score; });
    const top    = todosResultados.slice(0, 6);
    const linhas = ['🔍 Busca global: "' + termoBusca + '"\n'];
    const porDisc = {};
    top.forEach(function (r) {
      var d = r.disc || 'Desconhecida';
      if (!porDisc[d]) porDisc[d] = [];
      porDisc[d].push(r);
    });
    Object.keys(porDisc).forEach(function (nomeDisc) {
      linhas.push('📚 ' + nomeDisc);
      porDisc[nomeDisc].forEach(function (r) {
        var trecho    = _truncarNaPalavra(r.texto, 160);
        var secaoLabel = r.secao ? ' [' + r.secao + ']' : '';
        linhas.push('  📖 ' + (r.aula || 'Geral') + secaoLabel);
        linhas.push('  ' + trecho);
      });
      linhas.push('');
    });
    return linhas.join('\n').trim();
  }

  function _gerarSugestoes(_conteudo) { return []; }

  function _truncarNaPalavra(texto, limite) {
    if (texto.length <= limite) return texto;
    const cortado      = texto.slice(0, limite);
    const ultimoEspaco = cortado.lastIndexOf(' ');
    return (ultimoEspaco > 0 ? cortado.slice(0, ultimoEspaco) : cortado) + '…';
  }

  function _extrairSentencas(texto) {
    var tokens = texto.split(' ');
    var sentencas = [];
    var atual = [];
    tokens.forEach(function (token) {
      atual.push(token);
      if (/[.!?;]$/.test(token)) {
        var s = atual.join(' ').trim();
        if (s.length > 20) sentencas.push(s);
        atual = [];
      }
    });
    if (atual.length > 0) {
      var resto = atual.join(' ').trim();
      if (resto.length > 20) sentencas.push(resto);
    }
    return sentencas;
  }

  function _destacarTermos(texto, termos) {
    let resultado = texto;
    termos.forEach(function (termo) {
      if (termo.length < 3) return;
      const escapado = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex    = new RegExp('\\S*' + escapado + '\\S*', 'gi');
      resultado = resultado.replace(regex, function (match) { return match.toUpperCase(); });
    });
    return resultado;
  }

  function _formatarResposta(pergunta, resultados, nomeDisc) {
    if (!resultados.length) {
      return (
        'Nenhum resultado encontrado para "' + pergunta + '" em ' + nomeDisc + '.\n\n' +
        'Dicas:\n  • Tente termos mais simples\n' +
        '  • Verifique se a disciplina correta está selecionada\n' +
        '  • Digite "ajuda" para ver opções'
      );
    }
    const termos = _normalizar(pergunta).split(' ').filter(function (t) { return t.length >= 3; });
    const aulasVistas = [];
    const porAula     = {};
    resultados.forEach(function (r) {
      const chave = r.aula || 'Geral';
      if (!porAula[chave]) { porAula[chave] = { secoes: new Set(), trechos: [] }; aulasVistas.push(chave); }
      if (r.secao) porAula[chave].secoes.add(r.secao);
      porAula[chave].trechos.push(r.texto);
    });
    const linhas = [];
    aulasVistas.forEach(function (nomeAula) {
      const grupo = porAula[nomeAula];
      linhas.push('📖 ' + nomeAula);
      if (grupo.secoes.size > 0) {
        var secoesArr = [];
        grupo.secoes.forEach(function (s) { secoesArr.push(s); });
        linhas.push('   📂 ' + secoesArr.join(' · '));
      }
      const sentencasVistas    = new Set();
      const pontosConsolidados = [];
      grupo.trechos.forEach(function (trecho) {
        const sentencas = _extrairSentencas(trecho);
        if (sentencas.length > 0) {
          sentencas.forEach(function (s) {
            const sNorm = _normalizar(s);
            if (!sentencasVistas.has(sNorm)) { sentencasVistas.add(sNorm); pontosConsolidados.push(s); }
          });
        } else {
          const tNorm = _normalizar(trecho);
          if (!sentencasVistas.has(tNorm)) { sentencasVistas.add(tNorm); pontosConsolidados.push(trecho); }
        }
      });
      pontosConsolidados.slice(0, 4).forEach(function (ponto) {
        const destacado = _destacarTermos(ponto, termos);
        const truncado  = _truncarNaPalavra(destacado, 180);
        linhas.push('  • ' + truncado);
      });
      linhas.push('');
    });
    linhas.push('─── ' + nomeDisc);
    return linhas.join('\n').trim();
  }

  /* ── LIVE CHIPS ────────────────────────────────────────── */
  var _liveChipsContainer = null;

  function _ehPrefixoDisc(val) {
    if (/^\/d(?:i(?:s(?:c)?)?)?$/i.test(val)) return true;
    if (/\/disc\s+/i.test(val)) return true;
    return false;
  }

  function _exibirLiveChips() {
    const discs = _getDisciplinas();
    if (!discs || !discs.length) return;
    if (!_liveChipsContainer || !document.getElementById('nexus-live-chips')) {
      const footer = document.getElementById('nexus-footer');
      if (!footer) return;
      _liveChipsContainer = document.createElement('div');
      _liveChipsContainer.id = 'nexus-live-chips';
      _liveChipsContainer.className = 'nexus-sugestoes';
      footer.insertBefore(_liveChipsContainer, footer.firstChild);
    }
    _liveChipsContainer.innerHTML = '';
    discs.forEach(function (d) {
      const btn = document.createElement('button');
      btn.className = 'nexus-sugestao-chip nexus-sugestao-chip--disc nexus-sugestao-chip--disc-cmd';
      btn.textContent = '/disc ' + d.id;
      btn.setAttribute('aria-label', 'Selecionar disciplina: /disc ' + d.id);
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        _removerLiveChips();
        const inputEl = document.getElementById('nexus-input');
        if (inputEl) {
          inputEl.value = '';
          inputEl.style.height = 'auto';
          inputEl.classList.remove('nexus-input--cmd');
          inputEl.focus();
        }
        _onSugestaoClick('/disc ' + d.id);
      });
      _liveChipsContainer.appendChild(btn);
    });
  }

  function _removerLiveChips() {
    if (_liveChipsContainer && _liveChipsContainer.parentNode) {
      _liveChipsContainer.parentNode.removeChild(_liveChipsContainer);
    }
    _liveChipsContainer = null;
  }

  /* ══════════════════════════════════════════════════════════
     FLUXO DO CHAT
  ══════════════════════════════════════════════════════════ */

  function _onUserSend(text) {
    if (state.processando) return;
    if (state.typingTimer) clearTimeout(state.typingTimer);
    _removerLiveChips();
    const userMsg = _push({ role: 'user', text: text, time: _getTime() });
    NexusUI.renderMessage(userMsg);
    NexusUI.showTyping();
    state.processando = true;
    _setInputBloqueado(true);
    state.typingTimer = setTimeout(function () { _processar(text); }, REPLY_DELAY_MS);
  }

  function _onSugestaoClick(texto) { _onUserSend(texto); }

  async function _processar(texto) {
    try {

      if (_ehPedidoAjuda(texto)) {
        _responderAjuda(_resolverDisc());
        return;
      }

      const resultadoCmd = _detectarComandoTroca(texto);
      if (resultadoCmd !== null) {
        state.aguardandoDisc = false;

        if (resultadoCmd.tipo === 'curto') {
          const discs    = _getDisciplinas() || [];
          const exemplos = discs.slice(0, 4).map(function (d) { return '/disc ' + d.id; }).join('  ');
          _renderBot('Digite mais caracteres para localizar a disciplina.\n\nExemplos:\n  ' + exemplos);
          NexusUI.mostrarSugestoes(_chipsDiscs(discs.slice(0, 4)), _onSugestaoClick);
          return;
        }

        if (resultadoCmd.tipo === 'nenhum') {
          const discs    = _getDisciplinas() || [];
          const exemplos = discs.slice(0, 4).map(function (d) { return '/disc ' + d.id; }).join('  ');
          _renderBot('Disciplina não encontrada: "' + resultadoCmd.query + '".\n\nDisciplinas disponíveis:\n  ' + exemplos);
          NexusUI.mostrarSugestoes(_chipsDiscs(discs.slice(0, 4)), _onSugestaoClick);
          return;
        }

        if (resultadoCmd.tipo === 'fuzzy') {
          _renderBot('Você quis dizer:');
          NexusUI.mostrarSugestoes(_chipsDiscs([resultadoCmd.disc]), _onSugestaoClick);
          return;
        }

        if (resultadoCmd.tipo === 'multiplo') {
          _renderBot('Encontrei mais de uma opção:');
          NexusUI.mostrarSugestoes(_chipsDiscs(resultadoCmd.candidatos), _onSugestaoClick);
          return;
        }

        const discExata        = resultadoCmd.disc;
        const perguntaResidual = resultadoCmd.perguntaResidual || '';
        const discJaAtiva      = state.discEscolhida && discExata.id === state.discEscolhida.id;

        if (!discJaAtiva) {
          _limparContexto();
          const carregou = await _confirmarDisc(discExata);
          if (!carregou) return;
        } else {
          if (typeof window.NexusWorker !== 'undefined') NexusWorker.limparHistorico();
        }

        if (perguntaResidual.length >= 2) {
          await _executarBuscaNaDisc(perguntaResidual, discExata);
        } else if (discJaAtiva) {
          _renderBot('Você já está em ' + discExata.apelido + '. Pode fazer perguntas!');
        }
        return;
      }

      if (state.aguardandoDisc) {
        const disc = _matchDisc(texto);
        if (disc) {
          await _confirmarDisc(disc);
          return;
        }
        state.aguardandoDisc = false;
      }

      const disc = _resolverDisc();
      if (!disc) { await _executarSemDisc(texto); return; }
      await _executarBuscaNaDisc(texto, disc);

    } catch (err) {
      console.error('[NexusAssistant] erro ao processar:', err);
      _renderBot('Ocorreu um erro ao processar sua pergunta. Tente novamente.');
    } finally {
      NexusUI.hideTyping();
      state.processando = false;
      _setInputBloqueado(false);
    }
  }

  async function _executarSemDisc(texto) {
    if (_ehPerguntaSobreGabarito(texto)) {
      const discs = _getDisciplinas() || [];
      const lista = discs.map(function (d) { return '  /disc ' + d.id; }).join('  ');
      _renderBot(
        'Perguntas sobre gabarito e respostas só estão disponíveis dentro do quiz. 📝\n\n' +
        'Acesse o quiz de uma das disciplinas para fazer esse tipo de pergunta:\n' + lista
      );
      const chips = discs.map(function (d) { return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' }; });
      NexusUI.mostrarSugestoes(chips, _onSugestaoClick);
      return;
    }

    if (_ehSaudacao(texto)) {
      const discs = _getDisciplinas() || [];
      const lista = discs.map(function (d) { return '  /disc ' + d.id + '   — ' + d.nome; }).join('\n');
      _renderBot(
        'Ola! 👋\n\n' +
        'Nenhuma disciplina selecionada ainda. Voce pode perguntar qualquer coisa — ' +
        'respondo com conhecimento geral — ou selecione uma disciplina para eu buscar no conteudo do site:\n\n' + lista
      );
      const chips = discs.map(function (d) { return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' }; });
      NexusUI.mostrarSugestoes(chips, _onSugestaoClick);
      return;
    }

    var normTexto = _normalizar(texto);
    var ehOndeAprende = (
      /\b(qual|em qual|que|em que)\s+(disciplina|materia|aula|curso)\b/.test(normTexto) ||
      /\b(onde|quando)\s+(vejo|aprendo|estudo|tem|cai)\b/.test(normTexto)
    );

    if (ehOndeAprende) {
      var termoRaw = normTexto
        .replace(/\b(em qual|qual|em que|que|onde|quando)\b/g, ' ')
        .replace(/\b(disciplina|materia|aula|curso|aprendo|estudo|vejo|tem|cai|posso|aprender)\b/g, ' ')
        .replace(/\b(eu|e|a|o|de|da|do|para|pra)\b/g, ' ')
        .replace(/\s+/g, ' ').trim();

      var discsOndeAprende = _getDisciplinas() || [];

      await Promise.all(discsOndeAprende.map(function (d) {
        return _carregarDiscParaBuscaGlobal(d);
      }));

      var matchDiscs = [];

      if (termoRaw.length >= 2) {
        discsOndeAprende.forEach(function (d) {
          var trechos = state.discsCacheadas[d.id] || [];
          var hits = 0;
          for (var j = 0; j < trechos.length; j++) {
            if (_normalizar(trechos[j].texto || '').includes(termoRaw)) hits++;
          }
          if (hits > 0) matchDiscs.push({ disc: d, hits: hits });
        });
        matchDiscs.sort(function (a, b) { return b.hits - a.hits; });
      }

      if (matchDiscs.length > 0) {
        var topDiscs = matchDiscs.slice(0, 2);
        var lista = topDiscs.map(function (m) { return '  /disc ' + m.disc.id + '   — ' + m.disc.nome; }).join('\n');
        _renderBot('Você provavelmente encontra isso em:\n\n' + lista + '\n\nSelecione para eu buscar no conteúdo do site.');
        NexusUI.mostrarSugestoes(
          topDiscs.map(function (m) { return { label: '/disc ' + m.disc.id, cmd: '/disc ' + m.disc.id, tipo: 'disc' }; }),
          _onSugestaoClick
        );
      } else {
        var todasDiscs = discsOndeAprende;
        var listaGeral = todasDiscs.map(function (d) { return '  /disc ' + d.id + '   — ' + d.nome; }).join('\n');
        _renderBot('Não encontrei esse assunto nos resumos disponíveis.\n\nSelecione uma disciplina:\n\n' + listaGeral);
        NexusUI.mostrarSugestoes(
          todasDiscs.map(function (d) { return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' }; }),
          _onSugestaoClick
        );
      }
      return;
    }

    NexusUI.showTyping();
    try {
      const respostaIA = await NexusWorker.perguntar({
        pergunta:     texto,
        resultados:   [],
        disciplina:   null,
        tipoContexto: 'conteudo',
        semContexto:  true,
      });
      if (respostaIA) {
        const rodape = (respostaIA.fonte || respostaIA.modelo) ? {
          linha1: ['IA: ' + (respostaIA.fonte || ''), respostaIA.modelo || ''].filter(Boolean).join(' · '),
          linha2: 'fonte: conhecimento externo',
        } : null;
        _renderBot(respostaIA.texto, rodape);
      } else {
        _renderBot('Nao consegui processar sua pergunta. Tente novamente.');
      }
    } catch (e) {
      console.error('[NexusAssistant] _executarSemDisc erro:', e);
      _renderBot('Ocorreu um erro ao processar sua pergunta. Tente novamente.');
    } finally {
      NexusUI.hideTyping();
    }
  }

  /* ══════════════════════════════════════════════════════════
     QUIZ — funções auxiliares
  ══════════════════════════════════════════════════════════ */

  function _detectarNumeroQuestao(texto) {
    var norm = NexusSearch.normalizarTexto(texto.trim());
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

  /**
   * Serializa a questão para o worker.
   *
   * QUIZ-ISOLATION:
   *   Gabarito e feedback são incluídos SOMENTE quando o contexto de quiz
   *   estiver ativo com token válido.
   *   Fora do template_init nunca expõe q.answer nem q.feedback.
   *
   * @param {number} numero
   * @param {object} q
   * @returns {string}
   */
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

  /**
   * Responde sobre uma questão específica via worker.
   *
   * QUIZ-ISOLATION:
   *   Abortado silenciosamente se o contexto de quiz não estiver ativo.
   *   O worker nunca recebe dados de questão fora do template.
   */
  async function _responderSobreQuestao(pergunta, ctxQuestao, disc) {
    if (!_contextoQuizAtivo()) {
      _renderBot('Esta função está disponível apenas dentro do quiz. 📝');
      return;
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
        console.warn('[NexusAssistant] _responderSobreQuestao erro worker:', e);
      }
      if (respostaIA) {
        const rodape = (respostaIA.fonte || respostaIA.modelo) ? {
          linha1: ['IA: ' + (respostaIA.fonte || ''), respostaIA.modelo || ''].filter(Boolean).join(' · '),
          linha2: 'fonte: questões do quiz',
        } : null;
        _renderBot(respostaIA.texto, rodape);
        return;
      }
    }
    // Fallback: exibe a questão sem gabarito se estiver no template mas o worker falhou
    _renderBot(ctxQuestao);
  }

  /* ══════════════════════════════════════════════════════════
     _executarBuscaNaDisc()
  ══════════════════════════════════════════════════════════ */
  async function _executarBuscaNaDisc(texto, disc) {

    if (_ehSaudacao(texto)) {
      _renderBot(
        'Olá! 👋 Estou aqui para ajudar com ' + disc.apelido + '.\n\n' +
        'Pode me fazer uma pergunta sobre a disciplina ou digitar "ajuda" para ver os comandos disponíveis.'
      );
      return;
    }

    if (_ehAgradecimento(texto)) {
      _renderBot('De nada! 😊 Se tiver mais dúvidas sobre ' + disc.apelido + ', é só perguntar.');
      return;
    }

    /* Gabarito/resposta — bloqueia fora do template de quiz */
    if (!_contextoQuizAtivo() && _ehPerguntaSobreGabarito(texto)) {
      _renderBot(
        'Perguntas sobre gabarito e respostas só estão disponíveis dentro do quiz. 📝\n\n' +
        'Abra o quiz de ' + disc.apelido + ' e faça a pergunta por lá!'
      );
      return;
    }

    /* Quiz: lookup de questão por número */
    if (_contextoQuizAtivo()) {
      const numQ = _detectarNumeroQuestao(texto);
      if (numQ !== null) {
        const conteudoQ = await _garantirConteudo(disc);
        if (!conteudoQ) { _renderBot('Não consegui carregar as questões. Tente novamente.'); return; }

        const token = _quizToken();
        const q     = NexusSearch.buscarQuestaoPorNumero(numQ, token);
        if (!q) {
          _renderBot('Questão ' + numQ + ' não encontrada no modo atual.');
          return;
        }
        const ctxQuestao = _serializarQuestao(numQ, q);
        await _responderSobreQuestao(texto, ctxQuestao, disc);
        return;
      }
    }

    /* Resumo de aula */
    const numAula = _detectarResumoAula(texto);
    if (numAula !== null) {
      const conteudoResumo = await _garantirConteudo(disc);
      if (!conteudoResumo) { _renderBot('Não consegui carregar o conteúdo. Tente novamente.'); return; }
      _renderBot(_responderResumoAula(numAula, disc.apelido));
      return;
    }

    /* Busca global */
    const termoBuscaGlobal = _detectarBuscaGlobal(texto);
    if (termoBuscaGlobal !== null) {
      const respostaGlobal = await _executarBuscaGlobal(termoBuscaGlobal);
      _renderBot(respostaGlobal);
      return;
    }

    /* Localização de conteúdo */
    const termoLocalizar = _detectarLocalizacao(texto);
    if (termoLocalizar !== null) {
      const conteudoLoc = await _garantirConteudo(disc);
      if (!conteudoLoc) { _renderBot('Não consegui carregar o conteúdo de ' + disc.apelido + '. Tente novamente.'); return; }
      NexusUI.atualizarDiscAtiva(disc.apelido);
      _renderBot(_responderLocalizacao(termoLocalizar, disc.apelido));
      return;
    }

    /* Classificação do tipo de pergunta */
    const ehNavegacao = _detectarPerguntaNavegacao(texto);
    const ehGlobal    = !ehNavegacao && _detectarPerguntaGlobal(texto);

    /* Carregamento e busca */
    const conteudoDisc = await _garantirConteudo(disc);
    if (!conteudoDisc) { _renderBot('Não consegui carregar o conteúdo de ' + disc.apelido + '. Tente novamente.'); return; }

    NexusUI.atualizarDiscAtiva(disc.apelido);

    var tipoContexto;
    var resultados;

    if (ehNavegacao) {
      tipoContexto = 'estrutura';
      resultados   = _montarMapaDisc(conteudoDisc);
    } else if (ehGlobal) {
      tipoContexto = 'global';
      resultados   = _montarContextoGlobal(conteudoDisc);
    } else {
      tipoContexto = 'conteudo';

      if (_contextoQuizAtivo()) {
        // Dentro do quiz: usa buscarQuiz() que acessa _indiceQuiz — exige token
        const token = _quizToken();
        resultados  = NexusSearch.buscarQuiz(texto, { topK: TOP_K, minScore: MIN_SCORE }, token);
        if (!resultados.length) {
          const normLen = _normalizar(texto.trim()).split(' ').length;
          if (normLen <= 4) {
            resultados = NexusSearch.buscarQuiz(texto, { topK: TOP_K, minScore: 5 }, token);
          }
        }
      } else {
        // Fora do quiz: buscar() usa apenas _indiceResumo
        resultados = NexusSearch.buscar(texto, { topK: TOP_K, minScore: MIN_SCORE });
        if (!resultados.length) {
          const normLen = _normalizar(texto.trim()).split(' ').length;
          if (normLen <= 4) {
            resultados = NexusSearch.buscar(texto, { topK: TOP_K, minScore: 5 });
          }
        }
      }
    }

    if (typeof window.NexusWorker !== 'undefined') {
      const temCtx = tipoContexto === 'conteudo'
        ? (resultados && resultados.length > 0)
        : (tipoContexto === 'global' || tipoContexto === 'estrutura');

      let respostaIA = null;
      try {
        respostaIA = await NexusWorker.perguntar({
          pergunta:     texto,
          resultados:   resultados,
          disciplina:   disc.id,
          tipoContexto: tipoContexto,
          semContexto:  !temCtx,
        });
      } catch (errIA) {
        console.warn('[NexusAssistant] NexusWorker.perguntar() lançou exceção:', errIA);
      }
      if (respostaIA) {
        const rodape = (respostaIA.fonte || respostaIA.modelo) ? {
          linha1: ['IA: ' + (respostaIA.fonte || ''), respostaIA.modelo || ''].filter(Boolean).join(' · '),
          linha2: temCtx ? 'fonte: conteúdo do site' : 'fonte: conhecimento externo',
        } : null;
        _renderBot(respostaIA.texto, rodape);
        return;
      }
      console.warn('[NexusAssistant] IA indisponível — fallback local ativado.');
    }

    _renderBot(_formatarResposta(texto, resultados, disc.apelido));
  }

  /* ── EVENTO: semestre mudou ── */
  document.addEventListener('nexus:semestreChanged', function () {
    _limparContexto();
    _limparHistoricoStorage();
    state.discsCacheadas = {};
    _removerLiveChips();
  });

  function _mostrarBoasVindas() {
    var discs = _getDisciplinas();
    if (!discs || !discs.length) return;
    var lista = discs.map(function (d) { return '  /disc ' + d.id + '   — ' + d.nome; }).join('\n');
    _renderBot(
      'Disciplinas disponíveis:\n\n' + lista + '\n\n' +
      'Selecione uma disciplina para eu buscar no conteúdo do site, ' +
      'ou pergunte qualquer coisa e respondo com conhecimento geral.'
    );
    var chips = discs.map(function (d) { return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' }; });
    NexusUI.mostrarSugestoes(chips, _onSugestaoClick);
  }

  function _addWelcomeMessage() {
    const msg = { role: 'system', text: '⬡  Nexus IA', time: _getTime() };
    _push(msg);
    NexusUI.renderMessage(msg);
  }

  function _restaurarHistorico() {
    const msgs = _carregarHistorico();
    if (!msgs || !msgs.length) return false;
    state.messages = msgs;

    const discSalva = _carregarDiscSalva();
    if (discSalva) {
      state.discEscolhida  = discSalva;
      state.aguardandoDisc = false;
    }

    const msgsEl = document.getElementById('nexus-messages');
    if (msgsEl) { const stale = msgsEl.querySelector('.nexus-sugestoes'); if (stale) stale.remove(); }

    msgs.forEach(function (msg) { NexusUI.renderMessage(msg); });

    if (!state.discEscolhida) {
      const discs = _getDisciplinas();
      if (discs && discs.length) {
        const chips = discs.map(function (d) { return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' }; });
        NexusUI.mostrarSugestoes(chips, _onSugestaoClick);
      }
    }

    if (state.discEscolhida) {
      const banner = document.getElementById('nexus-messages');
      if (banner) {
        const el = document.createElement('div');
        el.className = 'nexus-msg nexus-system nexus-restore-banner';
        el.innerHTML = '<div class="nexus-msg-bubble">↩ Histórico restaurado</div>';
        banner.appendChild(el);
      }
    }

    return true;
  }

  function _resetarChat() {
    _limparContexto();
    _limparHistoricoStorage();
    _removerLiveChips();
    state.messages       = [];
    state.discsCacheadas = {};
    state.processando    = false;
    if (state.typingTimer) { clearTimeout(state.typingTimer); state.typingTimer = null; }
    const msgsEl = document.getElementById('nexus-messages');
    if (msgsEl) msgsEl.innerHTML = '';
    NexusUI.hideTyping();
    _setInputBloqueado(false);
    _addWelcomeMessage();
    _mostrarBoasVindas();
  }

  function _depsOk() {
    if (typeof window.NexusUI     === 'undefined') { console.error('[NexusAssistant] NexusUI não encontrado.');    return false; }
    if (typeof window.NexusSearch === 'undefined') { console.error('[NexusAssistant] NexusSearch não encontrado.'); return false; }
    if (typeof window.NexusLoader === 'undefined') { console.error('[NexusAssistant] NexusLoader não encontrado.'); return false; }
    if (typeof window.__nexusCtx  === 'undefined') { console.error('[NexusAssistant] __nexusCtx não encontrado.');  return false; }
    if (typeof window.NexusWorker === 'undefined') { console.warn('[NexusAssistant] NexusWorker não encontrado. Modo somente-busca.'); }
    return true;
  }

  function init() {
    if (!_depsOk()) return;
    if (document.getElementById('nexus-fab')) return;

    NexusUI.init({ onSend: _onUserSend, onReset: _resetarChat });

    (function () {
      var inputEl = document.getElementById('nexus-input');
      if (!inputEl) return;
      inputEl.addEventListener('input', function () {
        var val   = inputEl.value;
        var ehCmd = _ehPrefixoDisc(val);
        inputEl.classList.toggle('nexus-input--cmd', ehCmd);
        if (ehCmd) _exibirLiveChips(); else _removerLiveChips();
      });
      inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) inputEl.classList.remove('nexus-input--cmd');
      });
    }());

    const restaurado = _restaurarHistorico();
    if (!restaurado) _addWelcomeMessage();

    NexusUI.atualizarDiscAtiva(state.discEscolhida ? state.discEscolhida.apelido : null);

    if (state.discEscolhida) {
      _garantirConteudo(state.discEscolhida).then(function (conteudo) {
        if (conteudo && !restaurado) {
          const loaderCtx = _montarCtx(state.discEscolhida);
          if (loaderCtx) {
            NexusLoader.carregar(loaderCtx).then(function (c) {
              const sugestoes = _gerarSugestoes(c);
              if (sugestoes.length > 0) NexusUI.mostrarSugestoes(sugestoes, _onSugestaoClick);
            });
          }
        }
      });
    } else if (!restaurado) {
      _mostrarBoasVindas();
      const discInicial = _resolverDisc();
      if (discInicial) {
        const loaderCtx = _montarCtx(discInicial);
        if (loaderCtx) {
          NexusLoader.carregar(loaderCtx).then(function (conteudo) {
            if (conteudo) {
              // Sempre indexa resumo no init — nunca quiz
              NexusSearch.indexarConteudo(conteudo);
              state.discIndexadaId = discInicial.id;
              state.fonteIndexada  = 'resumo';
              state.discEscolhida  = discInicial;
              _salvarDiscAtiva();
              NexusUI.atualizarDiscAtiva(discInicial.apelido);
            }
          });
        }
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.NexusAssistant = {
    open:   function () { NexusUI.open();   },
    close:  function () { NexusUI.close();  },
    toggle: function () { NexusUI.toggle(); },
  };

}());