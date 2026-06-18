/**
 * NEXUS — shared/js/ia/resumo/assistant.js  v2.1
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
 * MUDANÇAS v2.1 — NÃO INTERFERIR NO QUIZ (auditoria):
 *   - _resolverDisc() nunca usa o fallback genérico de disciplina
 *     quando o contexto de Quiz está ativo; resolve direto via
 *     window.__NEXUS_QUIZ_DISC__ ou retorna null.
 *   - _processar() não cai em _executarSemDisc() (fluxo de "nenhuma
 *     disciplina selecionada") quando estamos dentro do Quiz.
 *   - init() e initUI() não mostram as boas-vindas genéricas do
 *     Resumo quando a página é de Quiz — quem fala primeiro lá é
 *     NexusQuizAssistant.
 *   - _resetarChat() preserva a disciplina ativa quando o reset
 *     de chat ocorre dentro de uma sessão de Quiz (só reseta o
 *     histórico, não o contexto de disciplina).
 *   - nexus:semestreChanged não limpa o contexto se o Quiz estiver
 *     ativo (evita apagar a disciplina por um evento global).
 *   - Exposto window.NexusAssistant.renderBotMessage — hook para
 *     módulos de domínio (quiz/games) injetarem mensagens mantendo
 *     state.messages/sessionStorage sincronizados.
 *   - Exposto window.NexusAssistant.pipelineAtivo() — permite que
 *     chamadores externos (ex.: NexusQuizAssistant.notificarEntradaNoQuiz)
 *     confirmem que o pipeline de conteúdo já está pronto antes de
 *     chamar selecionarDiscPorId(), evitando que a chamada seja
 *     descartada silenciosamente por corrida de carregamento.
 *
 * MUDANÇAS v2.0 — RESET DE CONTEXTO:
 *   initUI() agora usa NexusCtx.deveResetar() para decidir entre
 *   reset completo (contexto mudou) ou restauração normal.
 *   Removido: setInterval de polling de UI (era race condition).
 *   Removido: limpeza duplicada no .then() do Promise.all externo.
 *   NexusCtx.confirmarReset() é chamado UMA VEZ, dentro de initUI().
 *
 * NÃO conhece:
 *   - Token de quiz
 *   - Gabarito, feedback, questões
 *   - Purge de sessão de quiz
 *   - Serialização de questões
 *   - Contexto de quiz (exceto a checagem operacional mínima via
 *     window.NexusQuizAssistant.contextoAtivo(), usada apenas para
 *     NÃO interferir — nunca para decidir lógica de quiz)
 *
 * Depende de:
 *   - core/ctx.js         (window.NexusCtx)          — para reset
 *   - core/context.js     (window.NexusContext)       — obrigatório
 *   - core/ui.js          (window.NexusUI)
 *   - core/loader.js      (window.NexusLoader)
 *   - core/worker.js      (window.NexusWorker)
 *   - core/text-utils.js  (window.NexusTextUtils)
 *   - resumo/search.js    (window.NexusResumoSearch)
 *   - window.__nexusCtx   (bridge de contexto)
 *
 * NÃO se auto-inicializa. init.js chama:
 *   - NexusAssistant.initUI() — SEMPRE
 *   - NexusAssistant.init()   — SOMENTE quando NexusContext.temTipo('resumo')
 *
 * API pública: window.NexusAssistant
 */

(function () {
  'use strict';

  const REPLY_DELAY_MS = 900;
  const TOP_K          = 8;
  const MIN_SCORE      = 15;
  const MAX_HISTORY    = 20;
  const SESSION_KEY    = 'nexus_chat_history';
  const SESSION_DISC   = 'nexus_disc_ativa';

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

  var _pipelineConteudoAtivo = false;

  function _normalizar(str) { return window.NexusTextUtils.normalizarTexto(str); }
  function _getTime() { return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); }

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

  /**
   * Verifica se há uma sessão de Quiz operacionalmente ativa.
   * Usada exclusivamente para EVITAR que o Resumo interfira no Quiz
   * (REQUISITO 4) — nunca para implementar lógica de quiz aqui.
   */
  function _quizAtivo() {
    return typeof window.NexusQuizAssistant !== 'undefined' &&
           typeof window.NexusQuizAssistant.contextoAtivo === 'function' &&
           window.NexusQuizAssistant.contextoAtivo();
  }

  function _push(msg) {
    state.messages.push(msg);
    if (state.messages.length > MAX_HISTORY) {
      const sistemaIdx = state.messages.findIndex(function (m) { return m.role === 'system'; });
      const sistema    = sistemaIdx !== -1 ? state.messages[sistemaIdx] : null;
      const recentes   = state.messages.filter(function (m) { return m.role !== 'system'; }).slice(-(MAX_HISTORY - 1));
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
          id: state.discEscolhida.id, apelido: state.discEscolhida.apelido,
          nome: state.discEscolhida.nome, arquivo: state.discEscolhida.arquivo,
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
      return discs.find(function (d) { return d.id === disc.id; }) || null;
    } catch (e) { return null; }
  }

  function _limparHistoricoStorage() {
    try { sessionStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_DISC); } catch (e) {}
  }

  function _montarCtx(disc) {
    const ctx = _getCtxBridge();
    if (!ctx || !disc) return null;
    const sem    = ctx.getSemestre();
    const parsed = ctx.parseSemestre(sem);
    const prefixo   = (ctx.getPrefixo   && ctx.getPrefixo())   || 'res_';
    const varGlobal = (ctx.getVarGlobal && ctx.getVarGlobal()) || '__nexusConteudo';
    return { ano: parsed.ano, periodo: parsed.periodo, ap: parsed.ap, arquivo: disc.arquivo, fonte: 'resumo', prefixo, varGlobal };
  }

  /**
   * Resolve a disciplina ativa para o chat.
   *
   * REGRA CRÍTICA (Requisito 1 / Requisito 4): dentro de uma sessão de
   * Quiz operacionalmente ativa, NUNCA usamos o fallback genérico do
   * Resumo (ctx.getDisciplinaAtual()) — a disciplina do Quiz é fixa,
   * definida pela própria página (window.__NEXUS_QUIZ_DISC__). Se ela
   * ainda não puder ser resolvida (ex.: catálogo de disciplinas ainda
   * carregando), retornamos null em vez de adivinhar — quem chama
   * _resolverDisc() trata esse null bloqueando o envio, nunca caindo
   * no fluxo genérico de "selecione uma disciplina".
   */
  function _resolverDisc() {
    if (state.discEscolhida) return state.discEscolhida;

    if (_quizAtivo()) {
      var discIdQuiz = window.__NEXUS_QUIZ_DISC__;
      var discsQuiz  = _getDisciplinas();
      if (discIdQuiz && discsQuiz) {
        var foundQuiz = discsQuiz.find(function (d) { return d.id === discIdQuiz; });
        if (foundQuiz) return foundQuiz;
      }
      return null;
    }

    const ctx = _getCtxBridge();
    if (!ctx) return null;
    const idAtivo = ctx.getDisciplinaAtual ? ctx.getDisciplinaAtual() : null;
    if (idAtivo) {
      const discs = _getDisciplinas();
      if (discs) { const found = discs.find(function (d) { return d.id === idAtivo; }); if (found) return found; }
    }
    return null;
  }

  async function _garantirConteudo(disc) {
    const loaderCtx = _montarCtx(disc);
    if (!loaderCtx) return null;
    const conteudo = await NexusLoader.carregar(loaderCtx);
    if (!conteudo) return null;
    if (!NexusResumoSearch.estaIndexado() || state.discIndexadaId !== disc.id) {
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
    state.discEscolhida = null; state.aguardandoDisc = false;
    state.discIndexadaId = null; state.conteudoAtual = null;
    _salvarDiscAtiva();
    NexusUI.atualizarDiscAtiva(null);
    if (typeof window.NexusWorker !== 'undefined') NexusWorker.limparHistorico();
    console.log('[NexusAssistant] contexto limpo.');
  }

  function _matchDisc(texto) {
    const discs = _getDisciplinas();
    if (!discs) return null;
    const norm = _normalizar(texto);
    return discs.find(function (d) { return _normalizar(d.id) === norm; }) ||
           discs.find(function (d) { return _normalizar(d.apelido) === norm; }) ||
           discs.find(function (d) { return _normalizar(d.nome) === norm; }) || null;
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
      var dist = Math.min(_levenshtein(q, _normalizar(d.id)), _levenshtein(q, _normalizar(d.apelido)));
      if (dist <= maxDist) candidatos.push({ disc: d, dist: dist });
    });
    candidatos.sort(function (a, b) { return a.dist - b.dist; });
    return candidatos.map(function (c) { return c.disc; });
  }

  function _chipsDiscs(discs, modoCmd) {
    var tipo = modoCmd ? 'disc-cmd' : 'disc';
    return discs.map(function (d) { return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: tipo }; });
  }

  function _detectarComandoTroca(texto) {
    const norm = _normalizar(texto.trim());
    var m = norm.match(/\/disc\s+(\S+)/i) || norm.match(/^disc\s+(\S+)/i);
    if (!m) return null;
    const query = _normalizar(m[1]);
    const residual = norm.replace(m[0].trim(), '').replace(/\s{2,}/g, ' ').replace(/^\s*[,;:?!]\s*/, '').trim();
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
    var SAUDACOES = ['oi','ola','hey','hi','hello','bom dia','boa tarde','boa noite','eai','e ai','ei','ae','salve','opa','oii','olaa','oioi','oi oi','tudo bem','tudo bom','como vai','como voce esta','oi tudo bem','ola tudo bem','bom dia tudo bem','oi como vai','ola como vai'];
    return SAUDACOES.some(function (s) { return norm === s || norm.startsWith(s + ' ') || norm.startsWith(s + ','); });
  }

  function _ehAgradecimento(texto) {
    var norm = _normalizar(texto.trim());
    var TODOS = ['obrigado','obrigada','muito obrigado','muito obrigada','brigado','brigada','obg','vlw','valeu','valew','grato','grata','agradecido','agradecida','thanks','thank you','thx','tchau','ate mais','ate logo','ate amanha','flw','falou','fui','xau','bye','bye bye'];
    return TODOS.some(function (s) { return norm === s || norm.startsWith(s + ' ') || norm.startsWith(s + ',') || norm.startsWith(s + '!'); });
  }

  function _ehPerguntaSobreGabarito(texto) {
    var norm = _normalizar(texto.trim());
    if (/\bgabarito\b/.test(norm)) return true;
    if (/\bresposta\s+(certa|correta)\b/.test(norm)) return true;
    if (/\bqual\s+(e\s+)?a\s+resposta\b/.test(norm)) return true;
    if (/\bqual\s+(e\s+)?(a\s+)?(alternativa|letra|opcao)\s+(certa|correta)\b/.test(norm)) return true;
    if (/\bme\s+(da|passa|fala)\s+(a\s+)?resposta\b/.test(norm)) return true;
    if (/\bresposta\s+d[ao]s?\s+(quest(ao|oes?)?\s*)?\d+\b/.test(norm)) return true;
    return false;
  }

  function _detectarResumoAula(texto) {
    const norm = _normalizar(texto.trim());
    const PADROES = [/^resumo\s+(?:d[ao]\s+)?aula\s+(\d+)$/,/^aula\s+(\d+)\s*(?:resumo)?$/,/^ver\s+aula\s+(\d+)$/,/^mostrar\s+aula\s+(\d+)$/];
    for (var i = 0; i < PADROES.length; i++) { var m = norm.match(PADROES[i]); if (m) return parseInt(m[1], 10); }
    return null;
  }

  function _detectarBuscaGlobal(texto) {
    const norm = _normalizar(texto.trim());
    const PADROES = [/^buscar\s+em\s+tudo[:\s]+(.+)$/,/^busca\s+global[:\s]+(.+)$/,/^buscar\s+tudo[:\s]+(.+)$/,/^global[:\s]+(.+)$/];
    for (var i = 0; i < PADROES.length; i++) { var m = norm.match(PADROES[i]); if (m && m[1].trim().length >= 2) return m[1].trim(); }
    return null;
  }

  function _detectarPerguntaGlobal(texto) {
    const norm = _normalizar(texto.trim());
    const PADROES = [/\bcada\s+aula\b/,/\bpor\s+aula\b/,/\btodas?\s+(?:as\s+)?aulas?\b/,/\bresumo\s+(?:da?\s+)?(?:disciplina|conteudo|materia|curso)\b/,/\bconteudo\s+(?:completo|da?\s+(?:disciplina|materia|curso))\b/,/\bassuntos?\s+(?:da?\s+)?(?:disciplina|materia|curso|aulas?)\b/,/\btopicos?\s+(?:da?\s+)?(?:disciplina|materia|curso|aulas?)\b/,/\blista\s+(?:de\s+)?topicos?\b/,/\bo\s+que\s+(?:\w+\s+)?estudar\b/,/\bo\s+que\s+(?:cai|vai\s+cair|pode\s+cair)\s+(?:na|em)\s+prova\b/,/\b(?:assuntos?|topicos?|conteudos?)\s+(?:para\s+(?:a\s+)?prova|importantes?)\b/,/\bvisao\s+geral\b/,/\b(?:me\s+(?:faz?|da|de|passa))\s+(?:um\s+)?resumo\b/,/\b(?:principais?|mais\s+importantes?)\s+(?:assuntos?|topicos?|pontos?|conteudos?)\b/,/\b(?:assuntos?|topicos?|pontos?|conteudos?)\s+mais\s+importantes?\b/,/\bo\s+que\s+(?:tem|foi\s+visto|estudamos?|aprendemos?|vimos?)\s+(?:em\s+)?cada\s+aula\b/,/\bmapa\s+(?:da?\s+)?(?:disciplina|materia|estudos?)\b/];
    for (var i = 0; i < PADROES.length; i++) { if (PADROES[i].test(norm)) return true; }
    return false;
  }

  function _detectarPerguntaNavegacao(texto) {
    var norm = _normalizar(texto.trim());
    var PADROES = [/\bpor\s+onde\s+(?:comecar|comeco|inicio|devo\s+comecar)\b/,/\bonde\s+(?:comecar|comeco|devo\s+comecar)\b/,/\bqual\s+aula\s+(?:estudar|ver|fazer|comecar)\s+(?:primeiro|antes)\b/,/\bqual\s+aula\s+(?:vem|fica|fica)\s+(?:depois|antes|apos)\b/,/\bqual\s+(?:e\s+a\s+)?(?:primeira|proxima|ultima)\s+aula\b/,/\b(?:sequencia|ordem)\s+(?:das?\s+)?(?:aulas?|estudos?|conteudos?)\b/,/\bsequencia\s+(?:de\s+)?estudo\b/,/\bem\s+que\s+ordem\b/,/\bplano\s+(?:de\s+)?(?:estudo|estudos|revisao|estudo)\b/,/\bcronograma\s+(?:de\s+)?(?:estudo|estudos|revisao)\b/,/\bmonte\s+(?:um\s+)?(?:plano|cronograma|roteiro|guia)\b/,/\bcrie\s+(?:um\s+)?(?:plano|cronograma|roteiro|guia)\b/,/\bfaca\s+(?:um\s+)?(?:plano|cronograma|roteiro|guia)\b/,/\bquais?\s+aulas?\s+(?:dependem|precisam|requerem|necessitam)\b/,/\bquais?\s+(?:sao\s+os?\s+)?(?:prerequisitos?|pre-?requisitos?)\b/,/\bo\s+que\s+preciso\s+(?:saber|estudar|ver)\s+antes\b/,/\b(?:comecar|iniciar)\s+(?:pelos?\s+)?(?:basico|fundamentos?|inicio|começo)\b/,/\bsequencia\s+(?:recomendada|ideal|certa|correta)\b/,/\bordem?\s+(?:recomendada?|ideal|certo|correta?)\b/,/\bquais?\s+(?:sao\s+)?(?:todas?\s+(?:as\s+)?)?aulas?\s+(?:da\s+)?disciplina\b/,/\bquantas\s+aulas?\b/,/\bliste\s+(?:as\s+)?(?:todas\s+(?:as\s+)?)?aulas?\b/,/\bquais?\s+(?:sao\s+)?as\s+aulas\b/];
    for (var i = 0; i < PADROES.length; i++) { if (PADROES[i].test(norm)) return true; }
    return false;
  }

  function _detectarLocalizacao(texto) {
    const norm = _normalizar(texto.trim());
    const PADROES = [/^em\s+qual\s+aula\s+(?:esta|fica|aparece|tem|fala(?:\s+sobre)?|explica(?:\s+sobre)?)\s+(.+)$/,/^em\s+qual\s+aula\s+(?:eu\s+)?(?:vejo|encontro|estudo|aprendo)\s+(.+)$/,/^onde\s+(?:esta|foi\s+explicado|fica|aparece|tem|fala(?:\s+sobre)?)\s+(.+)$/,/^onde\s+(?:eu\s+)?(?:encontro|vejo|estudo|aprendo)\s+(.+)$/,/^qual\s+(?:secao|aula|parte)\s+(?:fala\s+(?:sobre|de)|trata\s+(?:de|sobre)|explica|tem)\s+(.+)$/,/^em\s+qual\s+(?:conteudo|parte|secao)\s+(?:(?:nos\s+)?vimos|estudamos|aprendemos|foi\s+(?:explicado|visto))\s+(.+)$/,/^(.+)\s+(?:foi\s+(?:visto|explicado|abordado|estudado)|aparece|esta)\s+em\s+qual\s+(?:aula|secao|parte)[\?]?$/,/^onde\s+(?:(?:nos\s+)?vimos|estudamos|aprendemos|foi\s+(?:visto|explicado))\s+(.+)$/];
    for (var i = 0; i < PADROES.length; i++) { var m = norm.match(PADROES[i]); if (m && m[1] && m[1].trim().length >= 2) return m[1].trim(); }
    return null;
  }

  function _responderResumoAula(numAula, nomeDisc) {
    const conteudo = state.conteudoAtual;
    if (!conteudo || !Array.isArray(conteudo.aulas)) return 'Conteúdo não carregado. Selecione uma disciplina primeiro.';
    const aula = conteudo.aulas.find(function (a) { if (!a.aula) return false; var m = a.aula.match(/(\d+)/); return m && parseInt(m[1], 10) === numAula; });
    if (!aula) return 'Aula ' + numAula + ' não encontrada em ' + nomeDisc + '.\n\nAulas disponíveis: ' + conteudo.aulas.map(function (a) { return a.aula || '?'; }).join(', ');
    const ideia = aula.ideia_central || '(sem ideia central registrada)';
    const numSecoes = Array.isArray(aula.secoes) ? aula.secoes.length : 0;
    const titulosSecoes = numSecoes > 0 ? aula.secoes.map(function (s) { return '  • ' + (s.titulo || '—'); }).join('\n') : '  (nenhuma seção registrada)';
    return '📖 ' + aula.aula + '\n─────────────────────\n' + ideia + '\n\nSeções (' + numSecoes + '):\n' + titulosSecoes + '\n\n─── ' + nomeDisc;
  }

  function _responderLocalizacao(termoLocalizar, nomeDisc) {
    var resultados = NexusResumoSearch.buscar(termoLocalizar, { topK: 8, minScore: MIN_SCORE });
    if (!resultados.length) return 'Não encontrei "' + termoLocalizar + '" em nenhuma aula de ' + nomeDisc + '.\n\nDicas:\n  • Tente um termo mais simples ou sinônimo\n  • Verifique se o assunto pertence a esta disciplina';
    var porAula = {}; var aulasOrdem = [];
    resultados.forEach(function (r) { var chave = r.aula || 'Geral'; if (!porAula[chave]) { porAula[chave] = []; aulasOrdem.push(chave); } porAula[chave].push(r); });
    var linhas = ['📍 "' + termoLocalizar + '" aparece em ' + nomeDisc + ':\n'];
    aulasOrdem.forEach(function (nomeAula) {
      var ocorrencias = porAula[nomeAula]; var secoes = []; var secoesVistas = {};
      ocorrencias.forEach(function (r) { var s = r.secao || ''; if (s && !secoesVistas[s]) { secoesVistas[s] = true; secoes.push(s); } });
      linhas.push('📖 ' + nomeAula);
      if (secoes.length > 0) linhas.push('   📂 Seção: ' + secoes.join(' · '));
      linhas.push('   "' + _truncarNaPalavra(ocorrencias[0].texto, 200) + '"');
      linhas.push('');
    });
    linhas.push('─── ' + nomeDisc);
    return linhas.join('\n').trim();
  }

  function _responderAjuda(discAtual) {
    const discs = _getDisciplinas() || [];
    const exemplosDiscs = discs.map(function (d) { return '  /disc ' + d.id + '   — ' + d.apelido; }).join('\n');
    const discAtualLinha = discAtual ? 'Disciplina atual: ' + discAtual.apelido + ' (' + discAtual.nome + ')' : 'Nenhuma disciplina selecionada.';
    _renderBot(discAtualLinha + '\n\nComandos:\n  /disc <nome>   — selecionar ou trocar disciplina\n  resumo aula N  — ideia central da aula N\n  buscar em tudo: <termo>  — buscar em todas as disciplinas\n  ajuda / ?      — exibir esta mensagem\n\nDica: use /disc em qualquer ponto da mensagem:\n  "oq é tcp em /disc redes?" → seleciona Redes e já responde\n\nDisciplinas disponíveis:\n' + exemplosDiscs + '\n\nQualquer outra mensagem é tratada como busca na disciplina atual.');
  }

  function _extrairSentencas(texto) {
    var tokens = texto.split(' '); var sentencas = []; var atual = [];
    tokens.forEach(function (token) { atual.push(token); if (/[.!?;]$/.test(token)) { var s = atual.join(' ').trim(); if (s.length > 20) sentencas.push(s); atual = []; } });
    if (atual.length > 0) { var resto = atual.join(' ').trim(); if (resto.length > 20) sentencas.push(resto); }
    return sentencas;
  }

  function _destacarTermos(texto, termos) {
    let resultado = texto;
    termos.forEach(function (termo) {
      if (termo.length < 3) return;
      const regex = new RegExp('\\S*' + termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\S*', 'gi');
      resultado = resultado.replace(regex, function (match) { return match.toUpperCase(); });
    });
    return resultado;
  }

  function _truncarNaPalavra(texto, limite) {
    if (texto.length <= limite) return texto;
    const cortado = texto.slice(0, limite); const ultimoEspaco = cortado.lastIndexOf(' ');
    return (ultimoEspaco > 0 ? cortado.slice(0, ultimoEspaco) : cortado) + '…';
  }

  function _formatarResposta(pergunta, resultados, nomeDisc) {
    if (!resultados.length) return 'Nenhum resultado encontrado para "' + pergunta + '" em ' + nomeDisc + '.\n\nDicas:\n  • Tente termos mais simples\n  • Verifique se a disciplina correta está selecionada\n  • Digite "ajuda" para ver opções';
    const termos = _normalizar(pergunta).split(' ').filter(function (t) { return t.length >= 3; });
    const aulasVistas = []; const porAula = {};
    resultados.forEach(function (r) { const chave = r.aula || 'Geral'; if (!porAula[chave]) { porAula[chave] = { secoes: new Set(), trechos: [] }; aulasVistas.push(chave); } if (r.secao) porAula[chave].secoes.add(r.secao); porAula[chave].trechos.push(r.texto); });
    const linhas = [];
    aulasVistas.forEach(function (nomeAula) {
      const grupo = porAula[nomeAula];
      linhas.push('📖 ' + nomeAula);
      if (grupo.secoes.size > 0) { var secoesArr = []; grupo.secoes.forEach(function (s) { secoesArr.push(s); }); linhas.push('   📂 ' + secoesArr.join(' · ')); }
      const sentencasVistas = new Set(); const pontosConsolidados = [];
      grupo.trechos.forEach(function (trecho) {
        const sentencas = _extrairSentencas(trecho);
        if (sentencas.length > 0) { sentencas.forEach(function (s) { const sNorm = _normalizar(s); if (!sentencasVistas.has(sNorm)) { sentencasVistas.add(sNorm); pontosConsolidados.push(s); } }); }
        else { const tNorm = _normalizar(trecho); if (!sentencasVistas.has(tNorm)) { sentencasVistas.add(tNorm); pontosConsolidados.push(trecho); } }
      });
      pontosConsolidados.slice(0, 4).forEach(function (ponto) { linhas.push('  • ' + _truncarNaPalavra(_destacarTermos(ponto, termos), 180)); });
      linhas.push('');
    });
    linhas.push('─── ' + nomeDisc);
    return linhas.join('\n').trim();
  }

  function _montarContextoGlobal(conteudo) {
    if (!conteudo || !Array.isArray(conteudo.aulas)) return [];
    var resultados = [];
    conteudo.aulas.forEach(function (aula) {
      var nomeAula = aula.aula || 'Aula';
      var ideia = aula.ideia_central ? aula.ideia_central.trim() : '';
      var titulosSecoes = Array.isArray(aula.secoes) && aula.secoes.length > 0 ? aula.secoes.map(function (s) { return s.titulo || ''; }).filter(Boolean).join(' · ') : '';
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
      var secoes = Array.isArray(aula.secoes) && aula.secoes.length > 0 ? aula.secoes.map(function (s) { return s.titulo || ''; }).filter(Boolean).join(', ') : '';
      var texto = 'Aula ' + (i + 1); if (aula.aula) texto += ' — ' + aula.aula; if (secoes) texto += ' | Seções: ' + secoes;
      return { score: 100, texto: texto, aula: aula.aula || ('Aula ' + (i + 1)), secao: 'Mapa' };
    });
  }

  function _extrairTextosBloco(bloco) {
    if (!bloco || !bloco.tipo) return [];
    var textos = [];
    switch (bloco.tipo) {
      case 'texto': case 'destaque': case 'subtitulo': if (bloco.texto) textos.push(bloco.texto); break;
      case 'topico': if (bloco.titulo) textos.push(bloco.titulo); if (bloco.texto) textos.push(bloco.texto); if (Array.isArray(bloco.lista)) textos.push(bloco.lista.join(' ')); break;
      case 'lista': if (bloco.titulo) textos.push(bloco.titulo); if (Array.isArray(bloco.itens)) textos.push(bloco.itens.join(' ')); break;
      case 'exemplo': if (bloco.titulo) textos.push(bloco.titulo); if (bloco.texto) textos.push(bloco.texto); if (typeof bloco.detalhe === 'string') textos.push(bloco.detalhe); break;
    }
    return textos;
  }

  async function _carregarDiscParaBuscaGlobal(disc) {
    if (state.discsCacheadas[disc.id]) return state.discsCacheadas[disc.id];
    const ctx = _getCtxBridge(); if (!ctx) return [];
    const sem = ctx.getSemestre(); const parsed = ctx.parseSemestre(sem);
    const prefixo = (ctx.getPrefixo && ctx.getPrefixo()) || 'res_';
    const varGlobal = (ctx.getVarGlobal && ctx.getVarGlobal()) || '__nexusConteudo';
    const conteudo = await NexusLoader.carregar({ ano: parsed.ano, periodo: parsed.periodo, ap: parsed.ap, arquivo: disc.arquivo, fonte: 'resumo', prefixo, varGlobal });
    if (!conteudo || !Array.isArray(conteudo.aulas)) return [];
    const trechos = [];
    conteudo.aulas.forEach(function (aula) {
      const nomeAula = aula.aula || '';
      if (aula.ideia_central) trechos.push({ texto: aula.ideia_central, aula: nomeAula, secao: 'Ideia Central', disc: disc.apelido });
      if (Array.isArray(aula.secoes)) {
        aula.secoes.forEach(function (secao) {
          if (secao.titulo) trechos.push({ texto: secao.titulo, aula: nomeAula, secao: secao.titulo, disc: disc.apelido });
          if (Array.isArray(secao.blocos)) { secao.blocos.forEach(function (bloco) { _extrairTextosBloco(bloco).forEach(function (t) { trechos.push({ texto: t, aula: nomeAula, secao: secao.titulo || '', disc: disc.apelido }); }); }); }
        });
      }
    });
    state.discsCacheadas[disc.id] = trechos;
    return trechos;
  }

  function _scoreBuscaGlobal(queryNorm, textoNorm) {
    if (!queryNorm || !textoNorm) return 0;
    var termos = queryNorm.split(' ').filter(Boolean); if (!termos.length) return 0;
    var acertos = 0; termos.forEach(function (t) { if (textoNorm.includes(t)) acertos++; });
    return Math.min(100, Math.round((acertos / termos.length + (textoNorm.includes(queryNorm) ? 0.3 : 0)) * 100));
  }

  async function _executarBuscaGlobal(termoBusca) {
    const discs = _getDisciplinas();
    if (!discs || !discs.length) return 'Nenhuma disciplina encontrada para este semestre.';
    const queryNorm = _normalizar(termoBusca); const todosResultados = []; const discAtual = _resolverDisc();
    for (var i = 0; i < discs.length; i++) {
      var disc = discs[i];
      if (discAtual && disc.id === discAtual.id && NexusResumoSearch.estaIndexado() && state.discIndexadaId === discAtual.id) {
        NexusResumoSearch.buscar(termoBusca, { topK: 3, minScore: MIN_SCORE }).forEach(function (r) { todosResultados.push(Object.assign({}, r, { disc: disc.apelido })); });
      } else {
        var trechos = await _carregarDiscParaBuscaGlobal(disc);
        trechos.forEach(function (t) { var sc = _scoreBuscaGlobal(queryNorm, _normalizar(t.texto)); if (sc >= MIN_SCORE) todosResultados.push({ score: sc, texto: t.texto, aula: t.aula, secao: t.secao, disc: t.disc }); });
      }
    }
    if (!todosResultados.length) return 'Nenhum resultado para "' + termoBusca + '" em nenhuma disciplina.';
    todosResultados.sort(function (a, b) { return b.score - a.score; });
    const top = todosResultados.slice(0, 6); const linhas = ['🔍 Busca global: "' + termoBusca + '"\n']; const porDisc = {};
    top.forEach(function (r) { var d = r.disc || 'Desconhecida'; if (!porDisc[d]) porDisc[d] = []; porDisc[d].push(r); });
    Object.keys(porDisc).forEach(function (nomeDisc) {
      linhas.push('📚 ' + nomeDisc);
      porDisc[nomeDisc].forEach(function (r) { linhas.push('  📖 ' + (r.aula || 'Geral') + (r.secao ? ' [' + r.secao + ']' : '')); linhas.push('  ' + _truncarNaPalavra(r.texto, 160)); });
      linhas.push('');
    });
    return linhas.join('\n').trim();
  }

  var _liveChipsContainer = null;

  function _ehPrefixoDisc(val) { return /^\/d(?:i(?:s(?:c)?)?)?$/i.test(val) || /\/disc\s+/i.test(val); }

  function _exibirLiveChips() {
    const discs = _getDisciplinas(); if (!discs || !discs.length) return;
    if (!_liveChipsContainer || !document.getElementById('nexus-live-chips')) {
      const footer = document.getElementById('nexus-footer'); if (!footer) return;
      _liveChipsContainer = document.createElement('div');
      _liveChipsContainer.id = 'nexus-live-chips'; _liveChipsContainer.className = 'nexus-sugestoes';
      footer.insertBefore(_liveChipsContainer, footer.firstChild);
    }
    _liveChipsContainer.innerHTML = '';
    discs.forEach(function (d) {
      const btn = document.createElement('button');
      btn.className = 'nexus-sugestao-chip nexus-sugestao-chip--disc nexus-sugestao-chip--disc-cmd';
      btn.textContent = '/disc ' + d.id; btn.setAttribute('aria-label', 'Selecionar disciplina: /disc ' + d.id);
      btn.addEventListener('click', function (e) {
        e.stopPropagation(); _removerLiveChips();
        const inputEl = document.getElementById('nexus-input');
        if (inputEl) { inputEl.value = ''; inputEl.style.height = 'auto'; inputEl.classList.remove('nexus-input--cmd'); inputEl.focus(); }
        _onSugestaoClick('/disc ' + d.id);
      });
      _liveChipsContainer.appendChild(btn);
    });
  }

  function _removerLiveChips() {
    if (_liveChipsContainer && _liveChipsContainer.parentNode) _liveChipsContainer.parentNode.removeChild(_liveChipsContainer);
    _liveChipsContainer = null;
  }

  function _onUserSend(text) {
    if (state.processando) return;
    if (state.typingTimer) clearTimeout(state.typingTimer);
    _removerLiveChips();
    NexusUI.renderMessage(_push({ role: 'user', text: text, time: _getTime() }));
    NexusUI.showTyping(); state.processando = true; _setInputBloqueado(true);
    state.typingTimer = setTimeout(function () { _processar(text); }, REPLY_DELAY_MS);
  }

  function _onSugestaoClick(texto) { _onUserSend(texto); }

  async function _processar(texto) {
    try {
      if (_ehPedidoAjuda(texto)) { _responderAjuda(_resolverDisc()); return; }

      if (!_pipelineConteudoAtivo) {
        await _responderModoLivre(texto);
        return;
      }

      const resultadoCmd = _detectarComandoTroca(texto);
      if (resultadoCmd !== null) {
        state.aguardandoDisc = false;
        if (resultadoCmd.tipo === 'curto') {
          const discs = _getDisciplinas() || [];
          _renderBot('Digite mais caracteres para localizar a disciplina.\n\nExemplos:\n  ' + discs.slice(0, 4).map(function (d) { return '/disc ' + d.id; }).join('  '));
          NexusUI.mostrarSugestoes(_chipsDiscs(discs.slice(0, 4)), _onSugestaoClick); return;
        }
        if (resultadoCmd.tipo === 'nenhum') {
          const discs = _getDisciplinas() || [];
          _renderBot('Disciplina não encontrada: "' + resultadoCmd.query + '".\n\nDisciplinas disponíveis:\n  ' + discs.slice(0, 4).map(function (d) { return '/disc ' + d.id; }).join('  '));
          NexusUI.mostrarSugestoes(_chipsDiscs(discs.slice(0, 4)), _onSugestaoClick); return;
        }
        if (resultadoCmd.tipo === 'fuzzy') { _renderBot('Você quis dizer:'); NexusUI.mostrarSugestoes(_chipsDiscs([resultadoCmd.disc]), _onSugestaoClick); return; }
        if (resultadoCmd.tipo === 'multiplo') { _renderBot('Encontrei mais de uma opção:'); NexusUI.mostrarSugestoes(_chipsDiscs(resultadoCmd.candidatos), _onSugestaoClick); return; }

        const discExata = resultadoCmd.disc; const perguntaResidual = resultadoCmd.perguntaResidual || '';
        const discJaAtiva = state.discEscolhida && discExata.id === state.discEscolhida.id;
        if (!discJaAtiva) { _limparContexto(); const carregou = await _confirmarDisc(discExata); if (!carregou) return; }
        else { if (typeof window.NexusWorker !== 'undefined') NexusWorker.limparHistorico(); }
        if (perguntaResidual.length >= 2) { await _executarBuscaNaDisc(perguntaResidual, discExata); }
        else if (discJaAtiva) { _renderBot('Você já está em ' + discExata.apelido + '. Pode fazer perguntas!'); }
        return;
      }

      if (state.aguardandoDisc) {
        const disc = _matchDisc(texto);
        if (disc) { await _confirmarDisc(disc); return; }
        state.aguardandoDisc = false;
      }

      const disc = _resolverDisc();
      if (!disc) {
        if (_quizAtivo()) {
          // Requisito 1/4: dentro do Quiz, nunca caímos no fluxo genérico
          // de "nenhuma disciplina selecionada" — a disciplina é obrigatória
          // e fixa pela própria página. Se ainda não resolveu, bloqueamos
          // o envio em vez de oferecer /disc de outras disciplinas.
          _renderBot('Carregando a disciplina do quiz… tente novamente em um instante. 📝');
          return;
        }
        await _executarSemDisc(texto); return;
      }
      await _executarBuscaNaDisc(texto, disc);

    } catch (err) {
      console.error('[NexusAssistant] erro ao processar:', err);
      _renderBot('Ocorreu um erro ao processar sua pergunta. Tente novamente.');
    } finally {
      NexusUI.hideTyping(); state.processando = false; _setInputBloqueado(false);
    }
  }

  async function _responderModoLivre(texto) {
    if (typeof window.NexusWorker === 'undefined') {
      _renderBot('Assistente de IA não disponível no momento.'); return;
    }
    if (_ehSaudacao(texto)) { _renderBot('Olá! 👋 Pode me perguntar qualquer coisa — estou aqui para ajudar!'); return; }
    if (_ehAgradecimento(texto)) { _renderBot('De nada! 😊 Se tiver mais dúvidas, é só perguntar.'); return; }

    var respostaIA = null;
    const turnosAntesDePerguntar = NexusWorker.status().turnosNoHistorico;
    try {
      respostaIA = await NexusWorker.perguntar({ pergunta: texto, resultados: [], disciplina: '', tipoContexto: 'livre' });
    } catch (e) { console.warn('[NexusAssistant] _responderModoLivre erro:', e); }

    if (respostaIA) {
      const temHistorico = turnosAntesDePerguntar > 0;
      const rodape = (respostaIA.fonte || respostaIA.modelo) ? {
        linha1: ['IA: ' + (respostaIA.fonte || ''), respostaIA.modelo || ''].filter(Boolean).join(' · '),
        linha2: temHistorico ? 'fonte: histórico da conversa' : 'fonte: conhecimento próprio',
      } : null;
      _renderBot(respostaIA.texto, rodape);
    } else {
      _renderBot('Não consegui processar sua pergunta. Tente novamente.');
    }
  }

  async function _executarSemDisc(texto) {
    if (_ehPerguntaSobreGabarito(texto)) {
      _renderBot('Perguntas sobre gabarito e respostas só podem ser respondidas dentro do quiz da disciplina. 📝\n\nAbra o quiz correspondente e faça a pergunta por lá.'); return;
    }
    if (_ehSaudacao(texto)) {
      const discs = _getDisciplinas() || [];
      const lista = discs.map(function (d) { return '  /disc ' + d.id + '   — ' + d.nome; }).join('\n');
      _renderBot('Ola! 👋\n\nNenhuma disciplina selecionada ainda. Voce pode perguntar qualquer coisa — respondo com conhecimento geral — ou selecione uma disciplina para eu buscar no conteudo do site:\n\n' + lista);
      NexusUI.mostrarSugestoes(discs.map(function (d) { return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' }; }), _onSugestaoClick); return;
    }

    var normTexto = _normalizar(texto);
    var ehOndeAprende = /\b(qual|em qual|que|em que)\s+(disciplina|materia|aula|curso)\b/.test(normTexto) || /\b(onde|quando)\s+(vejo|aprendo|estudo|tem|cai)\b/.test(normTexto);

    if (ehOndeAprende) {
      var termoRaw = normTexto.replace(/\b(em qual|qual|em que|que|onde|quando)\b/g,' ').replace(/\b(disciplina|materia|aula|curso|aprendo|estudo|vejo|tem|cai|posso|aprender)\b/g,' ').replace(/\b(eu|e|a|o|de|da|do|para|pra)\b/g,' ').replace(/\s+/g,' ').trim();
      var discsOndeAprende = _getDisciplinas() || [];
      await Promise.all(discsOndeAprende.map(function (d) { return _carregarDiscParaBuscaGlobal(d); }));
      var matchDiscs = [];
      if (termoRaw.length >= 2) {
        discsOndeAprende.forEach(function (d) {
          var hits = 0; var trechos = state.discsCacheadas[d.id] || [];
          for (var j = 0; j < trechos.length; j++) { if (_normalizar(trechos[j].texto || '').includes(termoRaw)) hits++; }
          if (hits > 0) matchDiscs.push({ disc: d, hits: hits });
        });
        matchDiscs.sort(function (a, b) { return b.hits - a.hits; });
      }
      if (matchDiscs.length > 0) {
        var topDiscs = matchDiscs.slice(0, 2);
        _renderBot('Você provavelmente encontra isso em:\n\n' + topDiscs.map(function (m) { return '  /disc ' + m.disc.id + '   — ' + m.disc.nome; }).join('\n') + '\n\nSelecione para eu buscar no conteúdo do site.');
        NexusUI.mostrarSugestoes(topDiscs.map(function (m) { return { label: '/disc ' + m.disc.id, cmd: '/disc ' + m.disc.id, tipo: 'disc' }; }), _onSugestaoClick);
      } else {
        var todasDiscs = discsOndeAprende;
        _renderBot('Não encontrei esse assunto nos resumos disponíveis.\n\nSelecione uma disciplina:\n\n' + todasDiscs.map(function (d) { return '  /disc ' + d.id + '   — ' + d.nome; }).join('\n'));
        NexusUI.mostrarSugestoes(todasDiscs.map(function (d) { return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' }; }), _onSugestaoClick);
      }
      return;
    }

    NexusUI.showTyping();
    const turnosAntesDePerguntar = NexusWorker.status().turnosNoHistorico;
    try {
      const respostaIA = await NexusWorker.perguntar({ pergunta: texto, resultados: [], disciplina: null, tipoContexto: 'livre' });
      if (respostaIA) {
        const temHistorico = turnosAntesDePerguntar > 0;
        _renderBot(respostaIA.texto, (respostaIA.fonte || respostaIA.modelo) ? { linha1: ['IA: ' + (respostaIA.fonte || ''), respostaIA.modelo || ''].filter(Boolean).join(' · '), linha2: temHistorico ? 'fonte: histórico da conversa' : 'fonte: conhecimento próprio' } : null);
      } else { _renderBot('Nao consegui processar sua pergunta. Tente novamente.'); }
    } catch (e) { console.error('[NexusAssistant] _executarSemDisc erro:', e); _renderBot('Ocorreu um erro ao processar sua pergunta. Tente novamente.'); }
    finally { NexusUI.hideTyping(); }
  }

  async function _executarBuscaNaDisc(texto, disc) {
    if (_ehSaudacao(texto)) { _renderBot('Olá! 👋 Estou aqui para ajudar com ' + disc.apelido + '.\n\nPode me fazer uma pergunta sobre a disciplina ou digitar "ajuda" para ver os comandos disponíveis.'); return; }
    if (_ehAgradecimento(texto)) { _renderBot('De nada! 😊 Se tiver mais dúvidas sobre ' + disc.apelido + ', é só perguntar.'); return; }

    if (NexusContext.temTipo('quiz') && typeof window.NexusQuizAssistant !== 'undefined' && NexusQuizAssistant.contextoAtivo()) {
      if (await NexusQuizAssistant.interceptar(texto, disc, _renderBot.bind(null))) return;
    }
    if (NexusContext.temTipo('games') && typeof window.NexusGamesAssistant !== 'undefined' && NexusGamesAssistant.contextoAtivo()) {
      if (await NexusGamesAssistant.interceptar(texto, disc, _renderBot.bind(null))) return;
    }

    if (_ehPerguntaSobreGabarito(texto)) { _renderBot('Perguntas sobre gabarito e respostas só podem ser respondidas dentro do quiz da disciplina. 📝\n\nAbra o quiz de ' + disc.apelido + ' e faça a pergunta por lá.'); return; }

    const numAula = _detectarResumoAula(texto);
    if (numAula !== null) { const c = await _garantirConteudo(disc); if (!c) { _renderBot('Não consegui carregar o conteúdo. Tente novamente.'); return; } _renderBot(_responderResumoAula(numAula, disc.apelido)); return; }

    const termoBuscaGlobal = _detectarBuscaGlobal(texto);
    if (termoBuscaGlobal !== null) { _renderBot(await _executarBuscaGlobal(termoBuscaGlobal)); return; }

    const termoLocalizar = _detectarLocalizacao(texto);
    if (termoLocalizar !== null) { const c = await _garantirConteudo(disc); if (!c) { _renderBot('Não consegui carregar o conteúdo de ' + disc.apelido + '. Tente novamente.'); return; } NexusUI.atualizarDiscAtiva(disc.apelido); _renderBot(_responderLocalizacao(termoLocalizar, disc.apelido)); return; }

    const ehNavegacao = _detectarPerguntaNavegacao(texto);
    const ehGlobal    = !ehNavegacao && _detectarPerguntaGlobal(texto);
    const conteudoDisc = await _garantirConteudo(disc);
    if (!conteudoDisc) { _renderBot('Não consegui carregar o conteúdo de ' + disc.apelido + '. Tente novamente.'); return; }
    NexusUI.atualizarDiscAtiva(disc.apelido);

    var tipoContexto, resultados;
    if (ehNavegacao) { tipoContexto = 'estrutura'; resultados = _montarMapaDisc(conteudoDisc); }
    else if (ehGlobal) { tipoContexto = 'global'; resultados = _montarContextoGlobal(conteudoDisc); }
    else {
      tipoContexto = 'conteudo';
      resultados = NexusResumoSearch.buscar(texto, { topK: TOP_K, minScore: MIN_SCORE });
      if (!resultados.length && _normalizar(texto.trim()).split(' ').length <= 4) {
        resultados = NexusResumoSearch.buscar(texto, { topK: TOP_K, minScore: 5 });
      }
    }

    if (typeof window.NexusWorker !== 'undefined') {
      const temCtx                = tipoContexto === 'conteudo' ? (resultados && resultados.length > 0) : (tipoContexto === 'global' || tipoContexto === 'estrutura');
      const turnosAntesDePerguntar = NexusWorker.status().turnosNoHistorico;
      let respostaIA = null;
      try { respostaIA = await NexusWorker.perguntar({ pergunta: texto, resultados: resultados, disciplina: disc.id, tipoContexto: tipoContexto, semContexto: !temCtx }); }
      catch (errIA) { console.warn('[NexusAssistant] NexusWorker.perguntar() lançou exceção:', errIA); }
      if (respostaIA) {
        const temHistorico = turnosAntesDePerguntar > 0;
        var labelFonte;
        if (temCtx && temHistorico)  labelFonte = 'fonte: conteúdo do site (via histórico)';
        else if (temCtx)             labelFonte = 'fonte: conteúdo do site';
        else if (temHistorico)       labelFonte = 'fonte: histórico da conversa';
        else                         labelFonte = 'fonte: conhecimento próprio';
        _renderBot(respostaIA.texto, (respostaIA.fonte || respostaIA.modelo) ? { linha1: ['IA: ' + (respostaIA.fonte || ''), respostaIA.modelo || ''].filter(Boolean).join(' · '), linha2: labelFonte } : null);
        return;
      }
      console.warn('[NexusAssistant] IA indisponível — fallback local ativado.');
    }
    _renderBot(_formatarResposta(texto, resultados, disc.apelido));
  }

  function _pedirDisc() {
    const discs = _getDisciplinas();
    if (!discs || !discs.length) { _renderBot('Não encontrei disciplinas para o semestre atual.'); return; }
    _renderBot('Disciplinas disponíveis:\n\n' + discs.map(function (d) { return '  /disc ' + d.id + '   — ' + d.nome; }).join('\n') + '\n\nDigite o nome da disciplina ou use /disc <nome> para selecionar.');
    NexusUI.mostrarSugestoes(discs.map(function (d) { return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' }; }), _onSugestaoClick);
    state.aguardandoDisc = true;
  }

  async function _confirmarDisc(disc) {
    NexusResumoSearch.limparIndice(); NexusLoader.limpar();
    state.discIndexadaId = null; state.discEscolhida = disc; state.aguardandoDisc = false;
    _salvarDiscAtiva();
    if (typeof window.NexusWorker !== 'undefined') NexusWorker.limparHistorico();
    const loaderCtx = _montarCtx(disc);
    if (!loaderCtx) { state.discEscolhida = null; _salvarDiscAtiva(); _renderBot('Não consegui montar o contexto de ' + disc.apelido + '. Tente novamente.'); return false; }
    const conteudo = await NexusLoader.carregar(loaderCtx);
    if (!conteudo) { state.discEscolhida = null; _salvarDiscAtiva(); _renderBot('Não consegui carregar o conteúdo de ' + disc.apelido + '. Tente novamente.'); return false; }
    NexusResumoSearch.indexarConteudo(conteudo); state.discIndexadaId = disc.id;
    NexusUI.atualizarDiscAtiva(disc.apelido);
    _renderBot('✓ Disciplina carregada: ' + disc.apelido + '\n\nPode fazer perguntas sobre ' + disc.nome + '.\nPara trocar: /disc <nome>  ·  Ajuda: ?');
    const sugestoes = _gerarSugestoes(conteudo);
    if (sugestoes.length > 0) NexusUI.mostrarSugestoes(sugestoes, _onSugestaoClick);
    return true;
  }

  function _gerarSugestoes(_conteudo) { return []; }

  function _mostrarBoasVindas() {
    var discs = _getDisciplinas();
    if (!discs || !discs.length) {
      setTimeout(function () { var d = _getDisciplinas(); if (d && d.length) { _renderBot('Olá! 👋 Pode me perguntar qualquer coisa — estou aqui para ajudar!\n\nDisciplinas disponíveis:\n\n' + d.map(function (x) { return '  /disc ' + x.id + '   — ' + x.nome; }).join('\n') + '\n\nSelecione uma disciplina para eu buscar no conteúdo do site, ou pergunte qualquer coisa e respondo com conhecimento geral.'); NexusUI.mostrarSugestoes(d.map(function (x) { return { label: '/disc ' + x.id, cmd: '/disc ' + x.id, tipo: 'disc' }; }), _onSugestaoClick); } }, 300);
      return;
    }
    _renderBot('Olá! 👋 Pode me perguntar qualquer coisa — estou aqui para ajudar!\n\nDisciplinas disponíveis:\n\n' + discs.map(function (d) { return '  /disc ' + d.id + '   — ' + d.nome; }).join('\n') + '\n\nSelecione uma disciplina para eu buscar no conteúdo do site, ou pergunte qualquer coisa e respondo com conhecimento geral.');
    NexusUI.mostrarSugestoes(discs.map(function (d) { return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' }; }), _onSugestaoClick);
  }

  function _mostrarBoasVindasLivre() {
    var discs = _getDisciplinas();
    if (discs && discs.length) {
      _renderBot('Olá! 👋 Pode me perguntar qualquer coisa — estou aqui para ajudar!\n\nDisciplinas disponíveis:\n\n' + discs.map(function (d) { return '  /disc ' + d.id + '   — ' + d.nome; }).join('\n') + '\n\nSelecione uma disciplina para eu buscar no conteúdo do site, ou pergunte qualquer coisa e respondo com conhecimento geral.');
      NexusUI.mostrarSugestoes(discs.map(function (d) { return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' }; }), _onSugestaoClick);
    } else {
      _renderBot('Olá! 👋 Pode me perguntar qualquer coisa — estou aqui para ajudar!');
    }
  }

  function _addWelcomeMessage() {
    const msg = { role: 'system', text: '⬡  Nexus IA', time: _getTime() };
    _push(msg); NexusUI.renderMessage(msg);
  }

  function _restaurarHistorico() {
    const msgs = _carregarHistorico(); if (!msgs || !msgs.length) return false;
    state.messages = msgs;
    const discSalva = _carregarDiscSalva();
    if (discSalva) { state.discEscolhida = discSalva; state.aguardandoDisc = false; }
    const msgsEl = document.getElementById('nexus-messages');
    if (msgsEl) { const stale = msgsEl.querySelector('.nexus-sugestoes'); if (stale) stale.remove(); }
    msgs.forEach(function (msg) { NexusUI.renderMessage(msg); });
    if (!state.discEscolhida && _pipelineConteudoAtivo) {
      const discs = _getDisciplinas();
      if (discs && discs.length) NexusUI.mostrarSugestoes(discs.map(function (d) { return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' }; }), _onSugestaoClick);
    }
    if (state.discEscolhida) {
      const banner = document.getElementById('nexus-messages');
      if (banner) { const el = document.createElement('div'); el.className = 'nexus-msg nexus-system nexus-restore-banner'; el.innerHTML = '<div class="nexus-msg-bubble">↩ Histórico restaurado</div>'; banner.appendChild(el); }
    }
    return true;
  }

  /**
   * Reset de chat acionado pelo botão da UI ("nova conversa").
   *
   * REGRA CRÍTICA (Requisito 1): dentro de uma sessão de Quiz, este
   * reset deve apagar o HISTÓRICO (mensagens, worker) mas NUNCA a
   * disciplina ativa nem o índice de conteúdo já carregado — a
   * disciplina só pode ser removida por uma troca real de contexto
   * (modo/disciplina/semestre/saída do quiz), nunca por este botão.
   */
  function _resetarChat() {
    var quizAtivo = _quizAtivo();

    _limparHistoricoStorage();
    _removerLiveChips();

    state.messages    = [];
    state.processando = false;
    if (state.typingTimer) { clearTimeout(state.typingTimer); state.typingTimer = null; }

    if (typeof window.NexusWorker !== 'undefined') NexusWorker.limparHistorico();

    if (!quizAtivo) {
      // Fora do Quiz: comportamento original — reset de chat também
      // reseta o contexto de disciplina.
      NexusResumoSearch.limparIndice();
      NexusLoader.limpar();
      state.discEscolhida  = null;
      state.discIndexadaId = null;
      state.conteudoAtual  = null;
      state.discsCacheadas = {};
      _salvarDiscAtiva();
      NexusUI.atualizarDiscAtiva(null);
    }
    // Dentro do Quiz: state.discEscolhida, discIndexadaId, conteudoAtual
    // e o badge de disciplina ativa são preservados — só o histórico de
    // conversa é apagado.

    const msgsEl = document.getElementById('nexus-messages'); if (msgsEl) msgsEl.innerHTML = '';
    NexusUI.hideTyping(); _setInputBloqueado(false);

    _addWelcomeMessage();

    if (quizAtivo && typeof window.NexusQuizAssistant !== 'undefined' &&
        typeof window.NexusQuizAssistant.mensagemBoasVindas === 'function') {
      // Requisito 2: dentro do Quiz, a mensagem de boas-vindas é
      // responsabilidade do NexusQuizAssistant, não do Resumo.
      window.NexusQuizAssistant.mensagemBoasVindas(_renderBot);
    } else if (_pipelineConteudoAtivo) {
      _mostrarBoasVindas();
    } else {
      _mostrarBoasVindasLivre();
    }
  }

  function _depsUIok() {
    if (typeof window.NexusUI        === 'undefined') { console.error('[NexusAssistant] NexusUI não encontrado.');        return false; }
    if (typeof window.NexusTextUtils === 'undefined') { console.error('[NexusAssistant] NexusTextUtils não encontrado.'); return false; }
    if (typeof window.NexusWorker    === 'undefined') { console.warn('[NexusAssistant] NexusWorker não encontrado. Modo somente-busca.'); }
    return true;
  }

  function _depsConteudoOk() {
    if (typeof window.NexusContext      === 'undefined') { console.error('[NexusAssistant] NexusContext não encontrado.');      return false; }
    if (typeof window.NexusResumoSearch === 'undefined') { console.error('[NexusAssistant] NexusResumoSearch não encontrado.'); return false; }
    if (typeof window.NexusLoader       === 'undefined') { console.error('[NexusAssistant] NexusLoader não encontrado.');       return false; }
    if (typeof window.__nexusCtx        === 'undefined') { console.error('[NexusAssistant] __nexusCtx não encontrado.');        return false; }
    return true;
  }

  /* ══════════════════════════════════════════════════════════
     initUI() — v2.1: decisão centralizada de reset vs restauração,
     e nunca exibe as boas-vindas genéricas do Resumo dentro do Quiz.

     Lê NexusCtx.deveResetar() para decidir:

     SE dirty=1 (contexto mudou):
       1. Limpa sessionStorage (nexus_chat_history + nexus_disc_ativa)
       2. Zera state em memória
       3. Limpa DOM do chat (NexusUI.limparMensagens)
       4. Limpa worker (NexusWorker.limparHistorico) como garantia extra
       5. Confirma reset (remove nexus_ctx_dirty)
       6. Mostra boas-vindas normais — EXCETO se a página for de Quiz,
          caso em que NexusQuizAssistant.init() (chamado depois por
          init.js) é quem fala primeiro.

     SE dirty não está ativo (mesmo contexto):
       → _restaurarHistorico() normalmente
   ══════════════════════════════════════════════════════════ */
  function initUI() {
    if (!_depsUIok()) return;
    if (document.getElementById('nexus-fab')) return;

    NexusUI.init({ onSend: _onUserSend, onReset: _resetarChat });

    (function () {
      var inputEl = document.getElementById('nexus-input'); if (!inputEl) return;
      inputEl.addEventListener('input', function () {
        var val = inputEl.value;
        if (!_pipelineConteudoAtivo) return;
        var ehCmd = _ehPrefixoDisc(val);
        inputEl.classList.toggle('nexus-input--cmd', ehCmd);
        if (ehCmd) _exibirLiveChips(); else _removerLiveChips();
      });
      inputEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) inputEl.classList.remove('nexus-input--cmd'); });
    }());

    var resetando   = (typeof window.NexusCtx !== 'undefined') && window.NexusCtx.deveResetar();
    var paginaEhQuiz = (typeof window.NexusContext !== 'undefined') && window.NexusContext.temTipo('quiz');

    if (resetando) {
      _limparHistoricoStorage();

      state.messages      = [];
      state.discEscolhida = null;
      state.processando   = false;
      state.discsCacheadas = {};

      NexusUI.limparMensagens();

      if (typeof window.NexusWorker !== 'undefined') {
        NexusWorker.limparHistorico();
      }

      window.NexusCtx.confirmarReset();

      console.log('[NexusAssistant] reset de contexto aplicado.');

      _addWelcomeMessage();
      // Requisito 2: boas-vindas genéricas do Resumo NUNCA na página de Quiz.
      if (!_pipelineConteudoAtivo && !paginaEhQuiz) _mostrarBoasVindasLivre();

    } else {
      const restaurado = _restaurarHistorico();
      if (!restaurado) {
        _addWelcomeMessage();
        if (!_pipelineConteudoAtivo && !paginaEhQuiz) _mostrarBoasVindasLivre();
      }
    }
  }

  /* ── init(): ativa pipeline de conteúdo de resumo ───────────
     Chamado por init.js SOMENTE quando tipos inclui 'resumo'
     (incluindo quando o Quiz depende do pipeline de resumo).
     Assume que initUI() já foi chamado antes.

     v2.1: nunca mostra as boas-vindas genéricas nem resolve uma
     disciplina "padrão" quando a página é de Quiz — isso é papel
     do NexusQuizAssistant.
  ─────────────────────────────────────────────────────────── */
  function init() {
    if (!_depsConteudoOk()) return;

    _pipelineConteudoAtivo = true;
    console.log('[NexusAssistant] pipeline de conteúdo de resumo ativo.');

    var paginaEhQuiz = (typeof window.NexusContext !== 'undefined') && window.NexusContext.temTipo('quiz');

    NexusUI.atualizarDiscAtiva(state.discEscolhida ? state.discEscolhida.apelido : null);

    const restaurado = state.messages.length > 1;

    if (state.discEscolhida) {
      _garantirConteudo(state.discEscolhida).then(function (conteudo) {
        if (conteudo && !restaurado && !paginaEhQuiz) {
          const loaderCtx = _montarCtx(state.discEscolhida);
          if (loaderCtx) { NexusLoader.carregar(loaderCtx).then(function (c) { const sugestoes = _gerarSugestoes(c); if (sugestoes.length > 0) NexusUI.mostrarSugestoes(sugestoes, _onSugestaoClick); }); }
        }
      });
    } else if (!restaurado && !paginaEhQuiz) {
      // Requisito 1/2: fora do Quiz, mantém o comportamento original
      // (boas-vindas + resolução de disciplina inicial via contexto).
      // Dentro do Quiz, NÃO mostramos boas-vindas genéricas nem
      // resolvemos uma disciplina "padrão" por aqui.
      _mostrarBoasVindas();
      const discInicial = _resolverDisc();
      if (discInicial) {
        const loaderCtx = _montarCtx(discInicial);
        if (loaderCtx) {
          NexusLoader.carregar(loaderCtx).then(function (conteudo) {
            if (conteudo) {
              NexusResumoSearch.indexarConteudo(conteudo); state.discIndexadaId = discInicial.id; state.discEscolhida = discInicial; _salvarDiscAtiva(); NexusUI.atualizarDiscAtiva(discInicial.apelido);
            }
            var discsReexibir = _getDisciplinas();
            if (discsReexibir && discsReexibir.length) NexusUI.mostrarSugestoes(discsReexibir.map(function (d) { return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' }; }), _onSugestaoClick);
          });
        }
      }
    }
  }

  document.addEventListener('nexus:semestreChanged', function () {
    // Requisito 4: não interfere com o Quiz. Troca de semestre dentro
    // de uma sessão de Quiz é tratada pelo próprio template_init.js
    // (via _declararContexto + dirty flag), não por este listener global.
    if (_quizAtivo()) return;
    _limparContexto(); _limparHistoricoStorage(); state.discsCacheadas = {}; _removerLiveChips();
  });

  window.NexusAssistant = {
    initUI,
    init,

    // NOVO — hook para módulos de domínio (quiz/games) injetarem
    // mensagens mantendo state.messages/sessionStorage sincronizados.
    renderBotMessage: _renderBot,

    // NOVO — permite que chamadores externos (ex.: NexusQuizAssistant)
    // confirmem que o pipeline de conteúdo já está pronto antes de
    // chamar selecionarDiscPorId(), evitando descarte silencioso.
    pipelineAtivo: function () { return _pipelineConteudoAtivo; },

    open:   function () { NexusUI.open();   },
    close:  function () { NexusUI.close();  },
    toggle: function () { NexusUI.toggle(); },

    selecionarDiscPorId: function (discId, opts) {
      if (!_pipelineConteudoAtivo) return;
      if (!discId) return;
      var discs = _getDisciplinas(); if (!discs) return;
      var disc = discs.find(function (d) { return d.id === discId; });
      if (!disc) { console.warn('[NexusAssistant] selecionarDiscPorId: disciplina não encontrada:', discId); return; }
      state.discEscolhida = disc; state.aguardandoDisc = false; _salvarDiscAtiva();
      NexusUI.atualizarDiscAtiva(disc.apelido);
      if (!(opts && opts.silencioso)) _renderBot('✓ Disciplina selecionada: ' + disc.apelido);
      _garantirConteudo(disc).then(function () { console.log('[NexusAssistant] conteúdo de ' + disc.apelido + ' indexado via selecionarDiscPorId.'); });
    },

    limparDisc: function () {
      state.discEscolhida = null; state.aguardandoDisc = false; _salvarDiscAtiva();
      NexusUI.atualizarDiscAtiva(null);
      console.log('[NexusAssistant] disciplina removida via limparDisc.');
    },
  };

}());