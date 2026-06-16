/**
 * NEXUS — shared/js/ia/resumo/assistant.js
 *
 * Orquestrador do sistema de IA para Resumos.
 *
 * Responsabilidades:
 *   - Fluxo completo do chat (receber mensagem → processar → responder)
 *   - Seleção e troca de disciplina
 *   - Busca no conteúdo de resumo (por disciplina e global)
 *   - Localização de conteúdo ("em qual aula está X?")
 *   - Resumo de aula específica
 *   - Navegação pela estrutura do curso
 *   - Histórico de conversa e persistência de sessão
 *   - Integração com NexusWorker para respostas da IA
 *
 * NÃO conhece:
 *   - Token de quiz
 *   - Gabarito, feedback, questões
 *   - Purge de sessão de quiz
 *   - Serialização de questões
 *   - Contexto de quiz
 *
 * Depende de:
 *   - core/ui.js          (window.NexusUI)
 *   - core/loader.js      (window.NexusLoader)
 *   - core/worker.js      (window.NexusWorker)
 *   - core/text-utils.js  (window.NexusTextUtils)
 *   - resumo/search.js    (window.NexusResumoSearch)
 *   - window.__nexusCtx   (bridge de contexto)
 *
 * API pública: window.NexusAssistant
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CONFIGURAÇÃO
  ══════════════════════════════════════════════════════════ */

  const REPLY_DELAY_MS = 900;
  const TOP_K          = 8;
  const MIN_SCORE      = 15;
  const MAX_HISTORY    = 20;
  const SESSION_KEY    = 'nexus_chat_history';
  const SESSION_DISC   = 'nexus_disc_ativa';

  /* ══════════════════════════════════════════════════════════
     ESTADO
  ══════════════════════════════════════════════════════════ */

  const state = {
    messages:       [],
    typingTimer:    null,
    discEscolhida:  null,
    aguardandoDisc: false,
    processando:    false,
    discsCacheadas: {},
    discIndexadaId: null,
    conteudoAtual:  null,
  };

  /* ══════════════════════════════════════════════════════════
     HELPERS DE ACESSO
  ══════════════════════════════════════════════════════════ */

  function _normalizar(str) {
    return window.NexusTextUtils.normalizarTexto(str);
  }

  function _getTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
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

  /* ══════════════════════════════════════════════════════════
     HISTÓRICO E PERSISTÊNCIA
  ══════════════════════════════════════════════════════════ */

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

  /* ══════════════════════════════════════════════════════════
     MONTAGEM DE CONTEXTO DE CARREGAMENTO
  ══════════════════════════════════════════════════════════ */

  /**
   * Monta o contexto para NexusLoader.carregar().
   * Sempre com fonte='resumo' — este módulo nunca carrega quiz.
   *
   * @param {object} disc
   * @returns {object|null}
   */
  function _montarCtx(disc) {
    const ctx = _getCtxBridge();
    if (!ctx || !disc) return null;
    const sem    = ctx.getSemestre();
    const parsed = ctx.parseSemestre(sem);

    const prefixo   = (ctx.getPrefixo   && ctx.getPrefixo())   || 'res_';
    const varGlobal = (ctx.getVarGlobal && ctx.getVarGlobal()) || '__nexusConteudo';

    return {
      ano:       parsed.ano,
      periodo:   parsed.periodo,
      ap:        parsed.ap,
      arquivo:   disc.arquivo,
      fonte:     'resumo',
      prefixo,
      varGlobal,
    };
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

  /* ══════════════════════════════════════════════════════════
     CARREGAMENTO E INDEXAÇÃO
  ══════════════════════════════════════════════════════════ */

  /**
   * Garante que o conteúdo de resumo está carregado e indexado.
   * Sempre usa fonte='resumo', nunca toca em quiz.
   *
   * @param {object} disc
   * @returns {Promise<object|null>}
   */
  async function _garantirConteudo(disc) {
    const loaderCtx = _montarCtx(disc);
    if (!loaderCtx) return null;

    const conteudo = await NexusLoader.carregar(loaderCtx);
    if (!conteudo) return null;

    const precisaReindexar = (
      !NexusResumoSearch.estaIndexado() ||
      state.discIndexadaId !== disc.id
    );

    if (precisaReindexar) {
      NexusResumoSearch.limparIndice();
      NexusResumoSearch.indexarConteudo(conteudo);
      state.discIndexadaId = disc.id;
    }

    state.conteudoAtual = conteudo;
    return conteudo;
  }

  function _limparContexto() {
    NexusResumoSearch.limparIndice();
    NexusLoader.limpar();
    state.discEscolhida  = null;
    state.aguardandoDisc = false;
    state.discIndexadaId = null;
    state.conteudoAtual  = null;
    _salvarDiscAtiva();
    NexusUI.atualizarDiscAtiva(null);
    if (typeof window.NexusWorker !== 'undefined') NexusWorker.limparHistorico();
    console.log('[NexusAssistant] contexto limpo.');
  }

  /* ══════════════════════════════════════════════════════════
     MATCH DE DISCIPLINA
  ══════════════════════════════════════════════════════════ */

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

  /* ══════════════════════════════════════════════════════════
     DETECÇÃO DE INTENÇÃO
  ══════════════════════════════════════════════════════════ */

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

  /**
   * Detecta pedidos EXPLÍCITOS de gabarito/resposta correta.
   *
   * Retorna true SOMENTE para pedidos diretos de resposta — nunca para
   * perguntas de explicação, análise ou estudo da questão.
   *
   * TRUE:  "qual o gabarito?", "qual é a resposta?", "qual a letra correta?",
   *        "me dá a resposta", "resposta correta", "gabarito da 3"
   *
   * FALSE: "me explica a questão 1", "qual assunto essa questão aborda?",
   *        "por que essa alternativa está errada?", "questão 3",
   *        "essa questão fala sobre TCP?", "explique a questão 5"
   */
  function _ehPerguntaSobreGabarito(texto) {
    var norm = _normalizar(texto.trim());
    if (/\bgabarito\b/.test(norm))                                                             return true;
    if (/\bresposta\s+(certa|correta)\b/.test(norm))                                           return true;
    if (/\bqual\s+(e\s+)?a\s+resposta\b/.test(norm))                                          return true;
    if (/\bqual\s+(e\s+)?(a\s+)?(alternativa|letra|opcao)\s+(certa|correta)\b/.test(norm))    return true;
    if (/\bme\s+(da|passa|fala)\s+(a\s+)?resposta\b/.test(norm))                              return true;
    if (/\bresposta\s+d[ao]s?\s+(quest(ao|oes?)?\s*)?\d+\b/.test(norm))                       return true;
    return false;
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

  /* ══════════════════════════════════════════════════════════
     RESPOSTAS LOCAIS (sem IA)
  ══════════════════════════════════════════════════════════ */

  function _responderResumoAula(numAula, nomeDisc) {
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

  function _responderLocalizacao(termoLocalizar, nomeDisc) {
    var resultados = NexusResumoSearch.buscar(termoLocalizar, { topK: 8, minScore: MIN_SCORE });
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

  /* ══════════════════════════════════════════════════════════
     FORMATAÇÃO DE RESPOSTA LOCAL (fallback sem IA)
  ══════════════════════════════════════════════════════════ */

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

  function _truncarNaPalavra(texto, limite) {
    if (texto.length <= limite) return texto;
    const cortado      = texto.slice(0, limite);
    const ultimoEspaco = cortado.lastIndexOf(' ');
    return (ultimoEspaco > 0 ? cortado.slice(0, ultimoEspaco) : cortado) + '…';
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

  /* ══════════════════════════════════════════════════════════
     CONTEXTO GLOBAL E MAPA
  ══════════════════════════════════════════════════════════ */

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

  /* ══════════════════════════════════════════════════════════
     BUSCA GLOBAL (todas as disciplinas)
  ══════════════════════════════════════════════════════════ */

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

  async function _carregarDiscParaBuscaGlobal(disc) {
    if (state.discsCacheadas[disc.id]) return state.discsCacheadas[disc.id];

    const ctx = _getCtxBridge();
    if (!ctx) return [];
    const sem    = ctx.getSemestre();
    const parsed = ctx.parseSemestre(sem);
    const prefixo   = (ctx.getPrefixo   && ctx.getPrefixo())   || 'res_';
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
    const queryNorm       = _normalizar(termoBusca);
    const todosResultados = [];
    const discAtual       = _resolverDisc();
    for (var i = 0; i < discs.length; i++) {
      var disc = discs[i];
      if (discAtual && disc.id === discAtual.id &&
          NexusResumoSearch.estaIndexado() &&
          state.discIndexadaId === discAtual.id) {
        var res = NexusResumoSearch.buscar(termoBusca, { topK: 3, minScore: MIN_SCORE });
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
        var trecho     = _truncarNaPalavra(r.texto, 160);
        var secaoLabel = r.secao ? ' [' + r.secao + ']' : '';
        linhas.push('  📖 ' + (r.aula || 'Geral') + secaoLabel);
        linhas.push('  ' + trecho);
      });
      linhas.push('');
    });
    return linhas.join('\n').trim();
  }

  /* ══════════════════════════════════════════════════════════
     LIVE CHIPS
  ══════════════════════════════════════════════════════════ */

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
      _renderBot(
        'Perguntas sobre gabarito e respostas só podem ser respondidas dentro do quiz da disciplina. 📝\n\n' +
        'Abra o quiz correspondente e faça a pergunta por lá.'
      );
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

    /* ── Interceptação por tipo de contexto ──────────────────
       Ordem de prioridade: quiz → games → resumo (padrão).
       NexusContext.temTipo() usa __NEXUS_CONTEXT__ quando declarado
       pela página; caso contrário faz detecção legada automaticamente.
       Cada assistant intercept() retorna true se tratou a mensagem.
    ── */

    // quiz
    if (typeof window.NexusContext !== 'undefined' && NexusContext.temTipo('quiz') &&
        typeof window.NexusQuizAssistant !== 'undefined' &&
        NexusQuizAssistant.contextoAtivo()) {
      const tratado = await NexusQuizAssistant.interceptar(texto, disc, _renderBot.bind(null));
      if (tratado) return;
    } else if (typeof window.NexusContext === 'undefined' &&
               typeof window.NexusQuizAssistant !== 'undefined' &&
               NexusQuizAssistant.contextoAtivo()) {
      // fallback: NexusContext ainda não carregado (compatibilidade)
      const tratado = await NexusQuizAssistant.interceptar(texto, disc, _renderBot.bind(null));
      if (tratado) return;
    }

    // games
    if (typeof window.NexusContext !== 'undefined' && NexusContext.temTipo('games') &&
        typeof window.NexusGamesAssistant !== 'undefined' &&
        NexusGamesAssistant.contextoAtivo()) {
      const tratado = await NexusGamesAssistant.interceptar(texto, disc, _renderBot.bind(null));
      if (tratado) return;
    } else if (typeof window.NexusContext === 'undefined' &&
               typeof window.NexusGamesAssistant !== 'undefined' &&
               NexusGamesAssistant.contextoAtivo()) {
      // fallback: NexusContext ainda não carregado (compatibilidade)
      const tratado = await NexusGamesAssistant.interceptar(texto, disc, _renderBot.bind(null));
      if (tratado) return;
    }

    if (_ehPerguntaSobreGabarito(texto)) {
      _renderBot(
        'Perguntas sobre gabarito e respostas só podem ser respondidas dentro do quiz da disciplina. 📝\n\n' +
        'Abra o quiz de ' + disc.apelido + ' e faça a pergunta por lá.'
      );
      return;
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
      resultados   = NexusResumoSearch.buscar(texto, { topK: TOP_K, minScore: MIN_SCORE });
      if (!resultados.length) {
        const normLen = _normalizar(texto.trim()).split(' ').length;
        if (normLen <= 4) {
          resultados = NexusResumoSearch.buscar(texto, { topK: TOP_K, minScore: 5 });
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

  /* ══════════════════════════════════════════════════════════
     CONFIRMAR DISCIPLINA
  ══════════════════════════════════════════════════════════ */

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
    NexusResumoSearch.limparIndice();
    NexusLoader.limpar();
    state.discIndexadaId = null;
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

    NexusResumoSearch.indexarConteudo(conteudo);
    state.discIndexadaId = disc.id;

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

  function _gerarSugestoes(_conteudo) { return []; }

  /* ══════════════════════════════════════════════════════════
     INICIALIZAÇÃO
  ══════════════════════════════════════════════════════════ */

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
    if (typeof window.NexusUI          === 'undefined') { console.error('[NexusAssistant] NexusUI não encontrado.');          return false; }
    if (typeof window.NexusResumoSearch === 'undefined') { console.error('[NexusAssistant] NexusResumoSearch não encontrado.'); return false; }
    if (typeof window.NexusLoader      === 'undefined') { console.error('[NexusAssistant] NexusLoader não encontrado.');       return false; }
    if (typeof window.NexusTextUtils   === 'undefined') { console.error('[NexusAssistant] NexusTextUtils não encontrado.');    return false; }
    if (typeof window.__nexusCtx       === 'undefined') { console.error('[NexusAssistant] __nexusCtx não encontrado.');        return false; }
    if (typeof window.NexusWorker      === 'undefined') { console.warn('[NexusAssistant] NexusWorker não encontrado. Modo somente-busca.'); }
    if (typeof window.NexusContext     === 'undefined') { console.warn('[NexusAssistant] NexusContext não encontrado. Usando detecção legada de contexto.'); }
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
              NexusResumoSearch.indexarConteudo(conteudo);
              state.discIndexadaId = discInicial.id;
              state.discEscolhida  = discInicial;
              _salvarDiscAtiva();
              NexusUI.atualizarDiscAtiva(discInicial.apelido);
            }
          });
        }
      }
    }
  }

  /* ── Evento: semestre mudou ── */
  document.addEventListener('nexus:semestreChanged', function () {
    _limparContexto();
    _limparHistoricoStorage();
    state.discsCacheadas = {};
    _removerLiveChips();
  });

  /* ══════════════════════════════════════════════════════════
     REGISTRO GLOBAL
  ══════════════════════════════════════════════════════════ */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.NexusAssistant = {
    open:   function () { NexusUI.open();   },
    close:  function () { NexusUI.close();  },
    toggle: function () { NexusUI.toggle(); },

    /**
     * Seleciona disciplina pelo id sem exibir mensagem no chat.
     * Usado por NexusQuizAssistant.notificarEntradaNoQuiz() para
     * sincronizar automaticamente o estado visual ao entrar no quiz.
     *
     * @param {string}  discId
     * @param {{ silencioso?: boolean }} [opts]
     */
    selecionarDiscPorId: function (discId, opts) {
      if (!discId) return;
      var silencioso = opts && opts.silencioso;
      var discs = _getDisciplinas();
      if (!discs) return;
      var disc = discs.find(function (d) { return d.id === discId; });
      if (!disc) {
        console.warn('[NexusAssistant] selecionarDiscPorId: disciplina não encontrada:', discId);
        return;
      }
      state.discEscolhida  = disc;
      state.aguardandoDisc = false;
      _salvarDiscAtiva();
      NexusUI.atualizarDiscAtiva(disc.apelido);
      if (!silencioso) {
        _renderBot('✓ Disciplina selecionada: ' + disc.apelido);
      }
      // Garante que o conteúdo de resumo é indexado em background
      _garantirConteudo(disc).then(function () {
        console.log('[NexusAssistant] conteúdo de ' + disc.apelido + ' indexado via selecionarDiscPorId.');
      });
    },

    /**
     * Remove a disciplina ativa do estado e do visual do chat.
     * Usado por NexusQuizAssistant ao sair do quiz para limpar o contexto.
     */
    limparDisc: function () {
      state.discEscolhida  = null;
      state.aguardandoDisc = false;
      _salvarDiscAtiva();
      NexusUI.atualizarDiscAtiva(null);
      console.log('[NexusAssistant] disciplina removida via limparDisc.');
    },
  };

}());