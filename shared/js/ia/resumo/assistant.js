/**
 * NEXUS — shared/js/ia/resumo/assistant.js  v3.1
 *
 * Orquestrador do sistema de IA para Resumos.
 *
 * Responsabilidades:
 *   - Fluxo completo do chat de resumo
 *   - Seleção e troca de disciplina
 *   - Busca no conteúdo de resumo
 *   - Histórico isolado por (domínio + disciplina + semestre)
 *   - Integração com NexusWorker para respostas da IA
 *
 * NÃO conhece:
 *   - Quiz, questões, gabarito, feedback, token de sessão
 *   - Games
 *   - Qualquer estado externo de outros domínios
 *
 * MUDANÇAS v3.1:
 *   - Persistência da disciplina ativa (SESSION_DISC) restaurada.
 *     Sem isso, F5 / reabrir aba / fechar e abrir não conseguia saber
 *     qual chave de histórico (NexusHistory) carregar, e o chat sempre
 *     voltava para as boas-vindas mesmo com histórico salvo.
 *   - initUI() / init() agora restauram disciplina + histórico reais
 *     quando o contexto não mudou (NexusCtx.deveResetar() === false).
 *     Histórico só é apagado por: reset manual (botão), troca de
 *     disciplina, troca de semestre, troca de modo — nunca por reload
 *     simples da mesma sessão.
 *   - Guarda de tamanho de mensagem em _onUserSend(): mensagens
 *     anormalmente grandes (> MENSAGEM_MAX_CHARS) são bloqueadas antes
 *     de qualquer busca ou chamada ao worker, com aviso amigável.
 *
 * Depende de:
 *   - core/ctx.js         (window.NexusCtx)
 *   - core/context.js     (window.NexusContext)
 *   - core/history.js     (window.NexusHistory)
 *   - core/ui.js          (window.NexusUI)
 *   - core/loader.js      (window.NexusLoader)
 *   - core/worker.js      (window.NexusWorker)
 *   - core/text-utils.js  (window.NexusTextUtils)
 *   - resumo/search.js    (window.NexusResumoSearch)
 *   - window.__nexusCtx   (bridge de contexto)
 *
 * Inicialização:
 *   - NexusAssistant.initUI() — sempre (configura o chat/UI)
 *   - NexusAssistant.init()   — apenas quando tipos inclui 'resumo'
 *
 * API pública: window.NexusAssistant
 */

(function () {
  'use strict';

  var REPLY_DELAY_MS     = 900;
  var TOP_K              = 8;
  var MIN_SCORE          = 15;
  var SESSION_DISC_KEY   = 'nexus_resumo_disc_ativa';
  var MENSAGEM_MAX_CHARS = 4000; // limiar generoso — só barra entradas claramente anormais

  /* ══════════════════════════════════════════════════════════
     ESTADO INTERNO
  ══════════════════════════════════════════════════════════ */

  var state = {
    messages:        [],
    typingTimer:     null,
    discEscolhida:   null,
    aguardandoDisc:  false,
    processando:     false,
    discsCacheadas:  {},
    discIndexadaId:  null,
    conteudoAtual:   null,
    chaveHistorico:  null,   // NexusHistory key ativa
  };

  var _pipelineConteudoAtivo = false;

  /* ══════════════════════════════════════════════════════════
     UTILITÁRIOS
  ══════════════════════════════════════════════════════════ */

  function _normalizar(str) { return window.NexusTextUtils.normalizarTexto(str); }
  function _getTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function _getCtxBridge() {
    var ctx = window.__nexusCtx;
    if (!ctx) { console.warn('[NexusAssistant] window.__nexusCtx não disponível.'); return null; }
    return ctx;
  }

  function _getDisciplinas() {
    var ctx = _getCtxBridge();
    if (!ctx) return null;
    var sem = ctx.getSemestre();
    return ctx.getDisciplinas(sem) || null;
  }

  function _getSemestre() {
    var ctx = _getCtxBridge();
    return ctx ? ctx.getSemestre() : '';
  }

  /* ══════════════════════════════════════════════════════════
     PERSISTÊNCIA DA DISCIPLINA ATIVA
     Necessária para saber, no boot da página, qual chave de
     histórico restaurar. Isolada do histórico de mensagens em si
     (NexusHistory) — aqui só guardamos QUAL disciplina estava ativa.
  ══════════════════════════════════════════════════════════ */

  function _salvarDiscAtiva() {
    try {
      if (state.discEscolhida) {
        sessionStorage.setItem(SESSION_DISC_KEY, JSON.stringify({
          id: state.discEscolhida.id,
        }));
      } else {
        sessionStorage.removeItem(SESSION_DISC_KEY);
      }
    } catch (e) {}
  }

  function _carregarDiscSalva() {
    try {
      var raw = sessionStorage.getItem(SESSION_DISC_KEY);
      if (!raw) return null;
      var saved = JSON.parse(raw);
      if (!saved || !saved.id) return null;
      var discs = _getDisciplinas();
      if (!discs) return null;
      return discs.find(function (d) { return d.id === saved.id; }) || null;
    } catch (e) { return null; }
  }

  function _limparDiscSalva() {
    try { sessionStorage.removeItem(SESSION_DISC_KEY); } catch (e) {}
  }

  /* ══════════════════════════════════════════════════════════
     CHAVE DE HISTÓRICO
     Isolada por domínio + disciplina + semestre.
     Enquanto a disciplina não está selecionada, histórico é nulo
     (não persiste conversa sem disciplina).
  ══════════════════════════════════════════════════════════ */

  function _montarChaveHistorico(discId) {
    if (!discId) return null;
    return window.NexusHistory.montarChave('resumo', discId, _getSemestre());
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
    state.chaveHistorico = null;
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
     CONTEXTO E LOADER
  ══════════════════════════════════════════════════════════ */

  function _montarCtx(disc) {
    var ctx = _getCtxBridge();
    if (!ctx || !disc) return null;
    var sem     = ctx.getSemestre();
    var parsed  = ctx.parseSemestre(sem);
    var prefixo   = (ctx.getPrefixo   && ctx.getPrefixo())   || 'res_';
    var varGlobal = (ctx.getVarGlobal && ctx.getVarGlobal()) || '__nexusConteudo';
    return {
      ano: parsed.ano, periodo: parsed.periodo, ap: parsed.ap,
      arquivo: disc.arquivo, fonte: 'resumo', prefixo, varGlobal,
    };
  }

  function _resolverDisc() {
    if (state.discEscolhida) return state.discEscolhida;
    var ctx = _getCtxBridge();
    if (!ctx) return null;
    var idAtivo = ctx.getDisciplinaAtual ? ctx.getDisciplinaAtual() : null;
    if (idAtivo) {
      var discs = _getDisciplinas();
      if (discs) {
        var found = discs.find(function (d) { return d.id === idAtivo; });
        if (found) return found;
      }
    }
    return null;
  }

  async function _garantirConteudo(disc) {
    var loaderCtx = _montarCtx(disc);
    if (!loaderCtx) return null;
    var conteudo = await NexusLoader.carregar(loaderCtx);
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
    state.discEscolhida  = null;
    state.aguardandoDisc = false;
    state.discIndexadaId = null;
    state.conteudoAtual  = null;
    NexusUI.atualizarDiscAtiva(null);
    if (typeof window.NexusWorker !== 'undefined') NexusWorker.limparHistorico();
  }

  /* ══════════════════════════════════════════════════════════
     DETECÇÃO DE COMANDOS E INTENÇÕES
  ══════════════════════════════════════════════════════════ */

  function _matchDisc(texto) {
    var discs = _getDisciplinas();
    if (!discs) return null;
    var norm = _normalizar(texto);
    return discs.find(function (d) { return _normalizar(d.id)     === norm; }) ||
           discs.find(function (d) { return _normalizar(d.apelido)=== norm; }) ||
           discs.find(function (d) { return _normalizar(d.nome)   === norm; }) || null;
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
    var discs = _getDisciplinas();
    if (!discs) return [];
    var q = _normalizar(query);
    var candidatos = [];
    discs.forEach(function (d) {
      var dist = Math.min(
        _levenshtein(q, _normalizar(d.id)),
        _levenshtein(q, _normalizar(d.apelido))
      );
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
    var norm = _normalizar(texto.trim());
    var m = norm.match(/\/disc\s+(\S+)/i) || norm.match(/^disc\s+(\S+)/i);
    if (!m) return null;
    var query    = _normalizar(m[1]);
    var residual = norm.replace(m[0].trim(), '').replace(/\s{2,}/g, ' ').replace(/^\s*[,;:?!]\s*/, '').trim();
    var exato    = _matchDisc(query);
    if (exato) return { tipo: 'exato', disc: exato, query, perguntaResidual: residual };
    if (query.length < 4) return { tipo: 'curto', query, perguntaResidual: residual };
    var maxDist    = query.length >= 7 ? 3 : 2;
    var candidatos = _fuzzyMatchDiscs(query, maxDist);
    if (!candidatos.length) return { tipo: 'nenhum', query, perguntaResidual: residual };
    if (candidatos.length === 1) return { tipo: 'fuzzy', disc: candidatos[0], candidatos, query, perguntaResidual: residual };
    return { tipo: 'multiplo', candidatos, query, perguntaResidual: residual };
  }

  function _ehPedidoAjuda(texto) {
    var norm = _normalizar(texto);
    return norm === 'ajuda' || norm === '?' || norm === 'help';
  }

  function _ehSaudacao(texto) {
    var norm = _normalizar(texto.trim());
    var SAUDACOES = [
      'oi','ola','hey','hi','hello','bom dia','boa tarde','boa noite',
      'eai','e ai','ei','ae','salve','opa','oii','olaa','oioi',
      'tudo bem','tudo bom','como vai',
    ];
    return SAUDACOES.some(function (s) {
      return norm === s || norm.startsWith(s + ' ') || norm.startsWith(s + ',');
    });
  }

  function _ehAgradecimento(texto) {
    var norm = _normalizar(texto.trim());
    var TODOS = [
      'obrigado','obrigada','muito obrigado','muito obrigada','brigado','brigada',
      'obg','vlw','valeu','grato','grata','agradecido','agradecida',
      'thanks','thank you','thx','tchau','ate mais','ate logo','flw','falou',
    ];
    return TODOS.some(function (s) {
      return norm === s || norm.startsWith(s + ' ') || norm.startsWith(s + ',') || norm.startsWith(s + '!');
    });
  }

  function _detectarResumoAula(texto) {
    var norm = _normalizar(texto.trim());
    var PADROES = [
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
    var norm = _normalizar(texto.trim());
    var PADROES = [
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
    var norm = _normalizar(texto.trim());
    var PADROES = [
      /\bcada\s+aula\b/,/\bpor\s+aula\b/,/\btodas?\s+(?:as\s+)?aulas?\b/,
      /\bresumo\s+(?:da?\s+)?(?:disciplina|conteudo|materia|curso)\b/,
      /\bconteudo\s+(?:completo|da?\s+(?:disciplina|materia|curso))\b/,
      /\bassuntos?\s+(?:da?\s+)?(?:disciplina|materia|curso|aulas?)\b/,
      /\btopicos?\s+(?:da?\s+)?(?:disciplina|materia|curso|aulas?)\b/,
      /\blista\s+(?:de\s+)?topicos?\b/,
      /\bo\s+que\s+(?:\w+\s+)?estudar\b/,
      /\b(?:me\s+(?:faz?|da|de|passa))\s+(?:um\s+)?resumo\b/,
      /\b(?:principais?|mais\s+importantes?)\s+(?:assuntos?|topicos?|pontos?)\b/,
      /\bvisao\s+geral\b/,
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
      /\bpor\s+onde\s+(?:comecar|comeco|inicio)\b/,
      /\bonde\s+(?:comecar|comeco)\b/,
      /\bqual\s+aula\s+(?:estudar|ver|comecar)\s+(?:primeiro|antes)\b/,
      /\b(?:sequencia|ordem)\s+(?:das?\s+)?(?:aulas?|estudos?)\b/,
      /\bem\s+que\s+ordem\b/,
      /\bplano\s+(?:de\s+)?estud/,
      /\bcronograma\s+(?:de\s+)?estud/,
      /\bmonte\s+(?:um\s+)?(?:plano|cronograma|roteiro)/,
      /\bquais?\s+aulas?\s+(?:dependem|precisam)\b/,
      /\bquais?\s+(?:sao\s+os?\s+)?(?:prerequisitos?)\b/,
      /\bsequencia\s+(?:recomendada|ideal)\b/,
      /\bquais?\s+(?:sao\s+)?(?:todas?\s+(?:as\s+)?)?aulas?\s+(?:da\s+)?disciplina\b/,
      /\bquantas\s+aulas?\b/,
      /\bliste\s+(?:as\s+)?(?:todas\s+(?:as\s+)?)?aulas?\b/,
    ];
    for (var i = 0; i < PADROES.length; i++) {
      if (PADROES[i].test(norm)) return true;
    }
    return false;
  }

  function _detectarLocalizacao(texto) {
    var norm = _normalizar(texto.trim());
    var PADROES = [
      /^em\s+qual\s+aula\s+(?:esta|fica|aparece|tem|fala(?:\s+sobre)?|explica(?:\s+sobre)?)\s+(.+)$/,
      /^onde\s+(?:esta|foi\s+explicado|fica|aparece|tem|fala(?:\s+sobre)?)\s+(.+)$/,
      /^qual\s+(?:secao|aula|parte)\s+(?:fala\s+(?:sobre|de)|trata\s+(?:de|sobre)|explica|tem)\s+(.+)$/,
      /^(.+)\s+(?:foi\s+(?:visto|explicado|abordado)|aparece|esta)\s+em\s+qual\s+(?:aula|secao|parte)[\?]?$/,
      /^onde\s+(?:(?:nos\s+)?vimos|estudamos|aprendemos)\s+(.+)$/,
    ];
    for (var i = 0; i < PADROES.length; i++) {
      var m = norm.match(PADROES[i]);
      if (m && m[1] && m[1].trim().length >= 2) return m[1].trim();
    }
    return null;
  }

  /* ══════════════════════════════════════════════════════════
     FORMATAÇÃO DE RESPOSTAS
  ══════════════════════════════════════════════════════════ */

  function _truncarNaPalavra(texto, limite) {
    if (texto.length <= limite) return texto;
    var cortado = texto.slice(0, limite);
    var ultimoEspaco = cortado.lastIndexOf(' ');
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
    var resultado = texto;
    termos.forEach(function (termo) {
      if (termo.length < 3) return;
      var regex = new RegExp('\\S*' + termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\S*', 'gi');
      resultado = resultado.replace(regex, function (match) { return match.toUpperCase(); });
    });
    return resultado;
  }

  function _responderResumoAula(numAula, nomeDisc) {
    var conteudo = state.conteudoAtual;
    if (!conteudo || !Array.isArray(conteudo.aulas)) {
      return 'Conteúdo não carregado. Selecione uma disciplina primeiro.';
    }
    var aula = conteudo.aulas.find(function (a) {
      if (!a.aula) return false;
      var m = a.aula.match(/(\d+)/);
      return m && parseInt(m[1], 10) === numAula;
    });
    if (!aula) {
      return 'Aula ' + numAula + ' não encontrada em ' + nomeDisc + '.\n\nAulas disponíveis: ' +
        conteudo.aulas.map(function (a) { return a.aula || '?'; }).join(', ');
    }
    var ideia = aula.ideia_central || '(sem ideia central registrada)';
    var numSecoes = Array.isArray(aula.secoes) ? aula.secoes.length : 0;
    var titulosSecoes = numSecoes > 0
      ? aula.secoes.map(function (s) { return '  • ' + (s.titulo || '—'); }).join('\n')
      : '  (nenhuma seção registrada)';
    return '📖 ' + aula.aula + '\n─────────────────────\n' + ideia +
      '\n\nSeções (' + numSecoes + '):\n' + titulosSecoes + '\n\n─── ' + nomeDisc;
  }

  function _responderLocalizacao(termoLocalizar, nomeDisc) {
    var resultados = NexusResumoSearch.buscar(termoLocalizar, { topK: 8, minScore: MIN_SCORE });
    if (!resultados.length) {
      return 'Não encontrei "' + termoLocalizar + '" em nenhuma aula de ' + nomeDisc + '.';
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
      var secoesVistas = {};
      var secoes = [];
      ocorrencias.forEach(function (r) {
        if (r.secao && !secoesVistas[r.secao]) { secoesVistas[r.secao] = true; secoes.push(r.secao); }
      });
      linhas.push('📖 ' + nomeAula);
      if (secoes.length > 0) linhas.push('   📂 Seção: ' + secoes.join(' · '));
      linhas.push('   "' + _truncarNaPalavra(ocorrencias[0].texto, 200) + '"');
      linhas.push('');
    });
    linhas.push('─── ' + nomeDisc);
    return linhas.join('\n').trim();
  }

  function _responderAjuda(discAtual) {
    var discs = _getDisciplinas() || [];
    var exemplosDiscs = discs.map(function (d) { return '  /disc ' + d.id + '   — ' + d.apelido; }).join('\n');
    var discAtualLinha = discAtual
      ? 'Disciplina atual: ' + discAtual.apelido + ' (' + discAtual.nome + ')'
      : 'Nenhuma disciplina selecionada.';
    _renderBot(
      discAtualLinha + '\n\nComandos:\n' +
      '  /disc <nome>   — selecionar ou trocar disciplina\n' +
      '  resumo aula N  — ideia central da aula N\n' +
      '  buscar em tudo: <termo>  — buscar em todas as disciplinas\n' +
      '  ajuda / ?      — exibir esta mensagem\n\n' +
      'Disciplinas disponíveis:\n' + exemplosDiscs
    );
  }

  function _formatarResposta(pergunta, resultados, nomeDisc) {
    if (!resultados.length) {
      return 'Nenhum resultado encontrado para "' + pergunta + '" em ' + nomeDisc + '.';
    }
    var termos = _normalizar(pergunta).split(' ').filter(function (t) { return t.length >= 3; });
    var porAula = {};
    var aulasVistas = [];
    resultados.forEach(function (r) {
      var chave = r.aula || 'Geral';
      if (!porAula[chave]) { porAula[chave] = { secoes: new Set(), trechos: [] }; aulasVistas.push(chave); }
      if (r.secao) porAula[chave].secoes.add(r.secao);
      porAula[chave].trechos.push(r.texto);
    });
    var linhas = [];
    aulasVistas.forEach(function (nomeAula) {
      var grupo = porAula[nomeAula];
      linhas.push('📖 ' + nomeAula);
      if (grupo.secoes.size > 0) {
        var secoesArr = [];
        grupo.secoes.forEach(function (s) { secoesArr.push(s); });
        linhas.push('   📂 ' + secoesArr.join(' · '));
      }
      var sentencasVistas = new Set();
      var pontosConsolidados = [];
      grupo.trechos.forEach(function (trecho) {
        var sentencas = _extrairSentencas(trecho);
        if (sentencas.length > 0) {
          sentencas.forEach(function (s) {
            var sNorm = _normalizar(s);
            if (!sentencasVistas.has(sNorm)) { sentencasVistas.add(sNorm); pontosConsolidados.push(s); }
          });
        } else {
          var tNorm = _normalizar(trecho);
          if (!sentencasVistas.has(tNorm)) { sentencasVistas.add(tNorm); pontosConsolidados.push(trecho); }
        }
      });
      pontosConsolidados.slice(0, 4).forEach(function (ponto) {
        linhas.push('  • ' + _truncarNaPalavra(_destacarTermos(ponto, termos), 180));
      });
      linhas.push('');
    });
    linhas.push('─── ' + nomeDisc);
    return linhas.join('\n').trim();
  }

  /* ══════════════════════════════════════════════════════════
     BUSCA GLOBAL (entre disciplinas)
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
    var ctx = _getCtxBridge(); if (!ctx) return [];
    var sem = ctx.getSemestre(); var parsed = ctx.parseSemestre(sem);
    var prefixo   = (ctx.getPrefixo   && ctx.getPrefixo())   || 'res_';
    var varGlobal = (ctx.getVarGlobal && ctx.getVarGlobal()) || '__nexusConteudo';
    var conteudo = await NexusLoader.carregar({
      ano: parsed.ano, periodo: parsed.periodo, ap: parsed.ap,
      arquivo: disc.arquivo, fonte: 'resumo', prefixo, varGlobal,
    });
    if (!conteudo || !Array.isArray(conteudo.aulas)) return [];
    var trechos = [];
    conteudo.aulas.forEach(function (aula) {
      var nomeAula = aula.aula || '';
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
    return Math.min(100, Math.round((acertos / termos.length + (textoNorm.includes(queryNorm) ? 0.3 : 0)) * 100));
  }

  async function _executarBuscaGlobal(termoBusca) {
    var discs = _getDisciplinas();
    if (!discs || !discs.length) return 'Nenhuma disciplina encontrada para este semestre.';
    var queryNorm = _normalizar(termoBusca);
    var todosResultados = [];
    var discAtual = _resolverDisc();
    for (var i = 0; i < discs.length; i++) {
      var disc = discs[i];
      if (discAtual && disc.id === discAtual.id && NexusResumoSearch.estaIndexado() && state.discIndexadaId === discAtual.id) {
        NexusResumoSearch.buscar(termoBusca, { topK: 3, minScore: MIN_SCORE }).forEach(function (r) {
          todosResultados.push(Object.assign({}, r, { disc: disc.apelido }));
        });
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
    var top = todosResultados.slice(0, 6);
    var linhas = ['🔍 Busca global: "' + termoBusca + '"\n'];
    var porDisc = {};
    top.forEach(function (r) {
      var d = r.disc || 'Desconhecida';
      if (!porDisc[d]) porDisc[d] = [];
      porDisc[d].push(r);
    });
    Object.keys(porDisc).forEach(function (nomeDisc) {
      linhas.push('📚 ' + nomeDisc);
      porDisc[nomeDisc].forEach(function (r) {
        linhas.push('  📖 ' + (r.aula || 'Geral') + (r.secao ? ' [' + r.secao + ']' : ''));
        linhas.push('  ' + _truncarNaPalavra(r.texto, 160));
      });
      linhas.push('');
    });
    return linhas.join('\n').trim();
  }

  function _montarContextoGlobal(conteudo) {
    if (!conteudo || !Array.isArray(conteudo.aulas)) return [];
    var resultados = [];
    conteudo.aulas.forEach(function (aula) {
      var nomeAula = aula.aula || 'Aula';
      var ideia    = aula.ideia_central ? aula.ideia_central.trim() : '';
      var titulosSecoes = Array.isArray(aula.secoes) && aula.secoes.length > 0
        ? aula.secoes.map(function (s) { return s.titulo || ''; }).filter(Boolean).join(' · ')
        : '';
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
      var secoes = Array.isArray(aula.secoes) && aula.secoes.length > 0
        ? aula.secoes.map(function (s) { return s.titulo || ''; }).filter(Boolean).join(', ')
        : '';
      var texto = 'Aula ' + (i + 1);
      if (aula.aula) texto += ' — ' + aula.aula;
      if (secoes) texto += ' | Seções: ' + secoes;
      return { score: 100, texto: texto, aula: aula.aula || ('Aula ' + (i + 1)), secao: 'Mapa' };
    });
  }

  /* ══════════════════════════════════════════════════════════
     LIVE CHIPS
  ══════════════════════════════════════════════════════════ */

  var _liveChipsContainer = null;

  function _ehPrefixoDisc(val) {
    return /^\/d(?:i(?:s(?:c)?)?)?$/i.test(val) || /\/disc\s+/i.test(val);
  }

  function _exibirLiveChips() {
    var discs = _getDisciplinas(); if (!discs || !discs.length) return;
    if (!_liveChipsContainer || !document.getElementById('nexus-live-chips')) {
      var footer = document.getElementById('nexus-footer'); if (!footer) return;
      _liveChipsContainer = document.createElement('div');
      _liveChipsContainer.id = 'nexus-live-chips';
      _liveChipsContainer.className = 'nexus-sugestoes';
      footer.insertBefore(_liveChipsContainer, footer.firstChild);
    }
    _liveChipsContainer.innerHTML = '';
    discs.forEach(function (d) {
      var btn = document.createElement('button');
      btn.className = 'nexus-sugestao-chip nexus-sugestao-chip--disc nexus-sugestao-chip--disc-cmd';
      btn.textContent = '/disc ' + d.id;
      btn.setAttribute('aria-label', 'Selecionar disciplina: /disc ' + d.id);
      btn.addEventListener('click', function (e) {
        e.stopPropagation(); _removerLiveChips();
        var inputEl = document.getElementById('nexus-input');
        if (inputEl) { inputEl.value = ''; inputEl.style.height = 'auto'; inputEl.classList.remove('nexus-input--cmd'); inputEl.focus(); }
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
     GUARDA DE TAMANHO DE MENSAGEM

     Bloqueia entradas claramente anormais (texto enorme, histórico
     colado, etc.) ANTES de qualquer busca local ou chamada ao
     NexusWorker. Não é um limite arbitrário pequeno — é só uma
     rede de segurança para entradas fora do uso normal de chat.
  ══════════════════════════════════════════════════════════ */

  function _mensagemExcedeLimite(texto) {
    return typeof texto === 'string' && texto.length > MENSAGEM_MAX_CHARS;
  }

  /* ══════════════════════════════════════════════════════════
     FLUXO DE CHAT
  ══════════════════════════════════════════════════════════ */

  function _onUserSend(text) {
    if (state.processando) return;

    // Guarda de tamanho — antes de qualquer busca, render de mensagem
    // do usuário no histórico, ou chamada ao worker.
    if (_mensagemExcedeLimite(text)) {
      NexusUI.renderMessage({
        role: 'system',
        text: 'Mensagem muito grande. Resuma sua pergunta e tente novamente.',
        time: _getTime(),
      });
      return;
    }

    if (state.typingTimer) clearTimeout(state.typingTimer);
    _removerLiveChips();
    NexusUI.renderMessage(_push({ role: 'user', text: text, time: _getTime() }));
    NexusUI.showTyping();
    state.processando = true;
    _setInputBloqueado(true);
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

      var resultadoCmd = _detectarComandoTroca(texto);
      if (resultadoCmd !== null) {
        state.aguardandoDisc = false;
        if (resultadoCmd.tipo === 'curto') {
          var discsC = _getDisciplinas() || [];
          _renderBot('Digite mais caracteres para localizar a disciplina.\n\nExemplos:\n  ' +
            discsC.slice(0, 4).map(function (d) { return '/disc ' + d.id; }).join('  '));
          NexusUI.mostrarSugestoes(_chipsDiscs(discsC.slice(0, 4)), _onSugestaoClick);
          return;
        }
        if (resultadoCmd.tipo === 'nenhum') {
          var discsN = _getDisciplinas() || [];
          _renderBot('Disciplina não encontrada: "' + resultadoCmd.query + '".\n\nDisciplinas disponíveis:\n  ' +
            discsN.slice(0, 4).map(function (d) { return '/disc ' + d.id; }).join('  '));
          NexusUI.mostrarSugestoes(_chipsDiscs(discsN.slice(0, 4)), _onSugestaoClick);
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

        var discExata        = resultadoCmd.disc;
        var perguntaResidual = resultadoCmd.perguntaResidual || '';
        var discJaAtiva      = state.discEscolhida && discExata.id === state.discEscolhida.id;

        if (!discJaAtiva) {
          // Troca de disciplina limpa o histórico (regra de negócio mantida)
          _limparHistoricoAtivo();
          _limparContexto();
          var carregou = await _confirmarDisc(discExata);
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
        var disc = _matchDisc(texto);
        if (disc) { await _confirmarDisc(disc); return; }
        state.aguardandoDisc = false;
      }

      var discAtiva = _resolverDisc();
      if (!discAtiva) {
        await _executarSemDisc(texto);
        return;
      }
      await _executarBuscaNaDisc(texto, discAtiva);

    } catch (err) {
      console.error('[NexusAssistant] erro ao processar:', err);
      _renderBot('Ocorreu um erro ao processar sua pergunta. Tente novamente.');
    } finally {
      NexusUI.hideTyping();
      state.processando = false;
      _setInputBloqueado(false);
    }
  }

  async function _responderModoLivre(texto) {
    if (typeof window.NexusWorker === 'undefined') {
      _renderBot('Assistente de IA não disponível no momento.'); return;
    }
    if (_ehSaudacao(texto)) { _renderBot('Olá! 👋 Pode me perguntar qualquer coisa — estou aqui para ajudar!'); return; }
    if (_ehAgradecimento(texto)) { _renderBot('De nada! 😊 Se tiver mais dúvidas, é só perguntar.'); return; }

    var respostaIA = null;
    try {
      respostaIA = await NexusWorker.perguntar({ pergunta: texto, resultados: [], disciplina: '', tipoContexto: 'livre' });
    } catch (e) { console.warn('[NexusAssistant] _responderModoLivre erro:', e); }

    if (respostaIA) {
      _renderBot(respostaIA.texto, (respostaIA.fonte || respostaIA.modelo) ? {
        linha1: ['IA: ' + (respostaIA.fonte || ''), respostaIA.modelo || ''].filter(Boolean).join(' · '),
        linha2: 'fonte: conhecimento próprio',
      } : null);
    } else {
      _renderBot('Não consegui processar sua pergunta. Tente novamente.');
    }
  }

  async function _executarSemDisc(texto) {
    if (_ehSaudacao(texto)) {
      var discs = _getDisciplinas() || [];
      var lista = discs.map(function (d) { return '  /disc ' + d.id + '   — ' + d.nome; }).join('\n');
      _renderBot('Olá! 👋\n\nNenhuma disciplina selecionada. Selecione uma para eu buscar no conteúdo do site:\n\n' + lista);
      NexusUI.mostrarSugestoes(discs.map(function (d) {
        return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' };
      }), _onSugestaoClick);
      return;
    }

    if (typeof window.NexusWorker !== 'undefined') {
      NexusUI.showTyping();
      try {
        var respostaIA = await NexusWorker.perguntar({ pergunta: texto, resultados: [], disciplina: null, tipoContexto: 'livre' });
        if (respostaIA) {
          _renderBot(respostaIA.texto, (respostaIA.fonte || respostaIA.modelo) ? {
            linha1: ['IA: ' + (respostaIA.fonte || ''), respostaIA.modelo || ''].filter(Boolean).join(' · '),
            linha2: 'fonte: conhecimento próprio',
          } : null);
        } else {
          _renderBot('Não consegui processar sua pergunta. Tente novamente.');
        }
      } catch (e) {
        _renderBot('Ocorreu um erro ao processar sua pergunta. Tente novamente.');
      } finally {
        NexusUI.hideTyping();
      }
    } else {
      var discsSemDisc = _getDisciplinas() || [];
      _renderBot('Selecione uma disciplina:\n\n' +
        discsSemDisc.map(function (d) { return '  /disc ' + d.id + '   — ' + d.nome; }).join('\n'));
      NexusUI.mostrarSugestoes(discsSemDisc.map(function (d) {
        return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' };
      }), _onSugestaoClick);
    }
  }

  async function _executarBuscaNaDisc(texto, disc) {
    if (_ehSaudacao(texto)) {
      _renderBot('Olá! 👋 Pode me fazer uma pergunta sobre ' + disc.apelido + '.');
      return;
    }
    if (_ehAgradecimento(texto)) {
      _renderBot('De nada! 😊 Se tiver mais dúvidas sobre ' + disc.apelido + ', é só perguntar.');
      return;
    }

    var numAula = _detectarResumoAula(texto);
    if (numAula !== null) {
      var c = await _garantirConteudo(disc);
      if (!c) { _renderBot('Não consegui carregar o conteúdo. Tente novamente.'); return; }
      _renderBot(_responderResumoAula(numAula, disc.apelido));
      return;
    }

    var termoBuscaGlobal = _detectarBuscaGlobal(texto);
    if (termoBuscaGlobal !== null) {
      _renderBot(await _executarBuscaGlobal(termoBuscaGlobal));
      return;
    }

    var termoLocalizar = _detectarLocalizacao(texto);
    if (termoLocalizar !== null) {
      var cLoc = await _garantirConteudo(disc);
      if (!cLoc) { _renderBot('Não consegui carregar o conteúdo de ' + disc.apelido + '.'); return; }
      NexusUI.atualizarDiscAtiva(disc.apelido);
      _renderBot(_responderLocalizacao(termoLocalizar, disc.apelido));
      return;
    }

    var ehNavegacao   = _detectarPerguntaNavegacao(texto);
    var ehGlobal      = !ehNavegacao && _detectarPerguntaGlobal(texto);
    var conteudoDisc  = await _garantirConteudo(disc);
    if (!conteudoDisc) { _renderBot('Não consegui carregar o conteúdo de ' + disc.apelido + '.'); return; }
    NexusUI.atualizarDiscAtiva(disc.apelido);

    var tipoContexto, resultados;
    if (ehNavegacao)      { tipoContexto = 'estrutura'; resultados = _montarMapaDisc(conteudoDisc); }
    else if (ehGlobal)    { tipoContexto = 'global';    resultados = _montarContextoGlobal(conteudoDisc); }
    else {
      tipoContexto = 'conteudo';
      resultados = NexusResumoSearch.buscar(texto, { topK: TOP_K, minScore: MIN_SCORE });
      if (!resultados.length && _normalizar(texto.trim()).split(' ').length <= 4) {
        resultados = NexusResumoSearch.buscar(texto, { topK: TOP_K, minScore: 5 });
      }
    }

    if (typeof window.NexusWorker !== 'undefined') {
      var temCtx  = tipoContexto === 'conteudo' ? (resultados && resultados.length > 0) : true;
      var respostaIA = null;
      try {
        respostaIA = await NexusWorker.perguntar({
          pergunta: texto, resultados: resultados,
          disciplina: disc.id, tipoContexto: tipoContexto, semContexto: !temCtx,
        });
      } catch (errIA) { console.warn('[NexusAssistant] NexusWorker.perguntar() erro:', errIA); }
      if (respostaIA) {
        var labelFonte = temCtx ? 'fonte: conteúdo do site' : 'fonte: conhecimento próprio';
        _renderBot(respostaIA.texto, (respostaIA.fonte || respostaIA.modelo) ? {
          linha1: ['IA: ' + (respostaIA.fonte || ''), respostaIA.modelo || ''].filter(Boolean).join(' · '),
          linha2: labelFonte,
        } : null);
        return;
      }
    }
    _renderBot(_formatarResposta(texto, resultados, disc.apelido));
  }

  async function _confirmarDisc(disc) {
    NexusResumoSearch.limparIndice();
    NexusLoader.limpar();
    state.discIndexadaId = null;
    state.discEscolhida  = disc;
    state.aguardandoDisc = false;

    // Persiste qual disciplina está ativa (sobrevive a F5 / reabrir aba)
    _salvarDiscAtiva();

    // Ativa histórico isolado para esta disciplina
    state.chaveHistorico = _montarChaveHistorico(disc.id);

    if (typeof window.NexusWorker !== 'undefined') NexusWorker.limparHistorico();

    var loaderCtx = _montarCtx(disc);
    if (!loaderCtx) {
      state.discEscolhida = null; state.chaveHistorico = null;
      _limparDiscSalva();
      _renderBot('Não consegui montar o contexto de ' + disc.apelido + '. Tente novamente.');
      return false;
    }
    var conteudo = await NexusLoader.carregar(loaderCtx);
    if (!conteudo) {
      state.discEscolhida = null; state.chaveHistorico = null;
      _limparDiscSalva();
      _renderBot('Não consegui carregar o conteúdo de ' + disc.apelido + '. Tente novamente.');
      return false;
    }
    NexusResumoSearch.indexarConteudo(conteudo);
    state.discIndexadaId = disc.id;
    NexusUI.atualizarDiscAtiva(disc.apelido);
    _renderBot('✓ Disciplina carregada: ' + disc.apelido + '\n\nPode fazer perguntas sobre ' + disc.nome + '.\nPara trocar: /disc <nome>  ·  Ajuda: ?');
    return true;
  }

  /* ══════════════════════════════════════════════════════════
     BOAS-VINDAS
  ══════════════════════════════════════════════════════════ */

  function _addWelcomeMessage() {
    var msg = { role: 'system', text: '⬡  Nexus IA', time: _getTime() };
    _push(msg);
    NexusUI.renderMessage(msg);
  }

  function _mostrarBoasVindas() {
    var discs = _getDisciplinas();
    if (!discs || !discs.length) {
      setTimeout(function () {
        var d = _getDisciplinas();
        if (d && d.length) {
          _renderBot('Olá! 👋\n\nSelecione uma disciplina para começar:\n\n' +
            d.map(function (x) { return '  /disc ' + x.id + '   — ' + x.nome; }).join('\n'));
          NexusUI.mostrarSugestoes(d.map(function (x) {
            return { label: '/disc ' + x.id, cmd: '/disc ' + x.id, tipo: 'disc' };
          }), _onSugestaoClick);
        }
      }, 300);
      return;
    }
    _renderBot('Olá! 👋\n\nSelecione uma disciplina para eu buscar no conteúdo do site, ou pergunte qualquer coisa:\n\n' +
      discs.map(function (d) { return '  /disc ' + d.id + '   — ' + d.nome; }).join('\n'));
    NexusUI.mostrarSugestoes(discs.map(function (d) {
      return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' };
    }), _onSugestaoClick);
  }

  function _mostrarBoasVindasLivre() {
    var discs = _getDisciplinas();
    if (discs && discs.length) {
      _renderBot('Olá! 👋 Pode me perguntar qualquer coisa!\n\nDisciplinas disponíveis:\n\n' +
        discs.map(function (d) { return '  /disc ' + d.id + '   — ' + d.nome; }).join('\n'));
      NexusUI.mostrarSugestoes(discs.map(function (d) {
        return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' };
      }), _onSugestaoClick);
    } else {
      _renderBot('Olá! 👋 Pode me perguntar qualquer coisa — estou aqui para ajudar!');
    }
  }

  /* ══════════════════════════════════════════════════════════
     RESET DE CHAT
     Único ponto (além de troca de disciplina/semestre/modo) onde
     o histórico é de fato apagado.
  ══════════════════════════════════════════════════════════ */

  function _resetarChat() {
    // Limpa histórico persistido da disciplina ativa
    _limparHistoricoAtivo();
    _removerLiveChips();

    state.processando = false;
    if (state.typingTimer) { clearTimeout(state.typingTimer); state.typingTimer = null; }

    if (typeof window.NexusWorker !== 'undefined') NexusWorker.limparHistorico();

    // Reset completo de contexto (disciplina incluída)
    NexusResumoSearch.limparIndice();
    NexusLoader.limpar();
    state.discEscolhida  = null;
    state.discIndexadaId = null;
    state.conteudoAtual  = null;
    state.discsCacheadas = {};
    state.chaveHistorico = null;
    _limparDiscSalva();
    NexusUI.atualizarDiscAtiva(null);

    NexusUI.limparMensagens();
    NexusUI.hideTyping();
    _setInputBloqueado(false);

    _addWelcomeMessage();
    if (_pipelineConteudoAtivo) {
      _mostrarBoasVindas();
    } else {
      _mostrarBoasVindasLivre();
    }
  }

  /* ══════════════════════════════════════════════════════════
     RESTAURAÇÃO DE HISTÓRICO

     Restaura a disciplina ativa (sessionStorage) e o histórico de
     mensagens correspondente (NexusHistory) — usado em F5, reload
     de aba ou reabertura da mesma sessão. Não é chamado quando o
     contexto mudou (NexusCtx.deveResetar() === true) nem após reset
     manual.
  ══════════════════════════════════════════════════════════ */

  function _restaurarSessao() {
    var discSalva = _carregarDiscSalva();
    if (!discSalva) return false;

    var chave = _montarChaveHistorico(discSalva.id);
    var msgs  = chave ? window.NexusHistory.carregar(chave) : [];
    if (!msgs || !msgs.length) {
      // Disciplina estava salva mas sem histórico (ex: trocou sem mandar
      // mensagem) — ainda assim restauramos a disciplina ativa.
      state.discEscolhida  = discSalva;
      state.chaveHistorico = chave;
      return false;
    }

    state.discEscolhida  = discSalva;
    state.chaveHistorico = chave;
    state.messages       = msgs;

    msgs.forEach(function (msg) { NexusUI.renderMessage(msg); });

    var msgsEl = document.getElementById('nexus-messages');
    if (msgsEl) {
      var el = document.createElement('div');
      el.className = 'nexus-msg nexus-system nexus-restore-banner';
      el.innerHTML = '<div class="nexus-msg-bubble">↩ Histórico restaurado</div>';
      msgsEl.appendChild(el);
    }
    return true;
  }

  /* ══════════════════════════════════════════════════════════
     VERIFICAÇÃO DE DEPENDÊNCIAS
  ══════════════════════════════════════════════════════════ */

  function _depsUIok() {
    if (typeof window.NexusUI        === 'undefined') { console.error('[NexusAssistant] NexusUI não encontrado.');        return false; }
    if (typeof window.NexusTextUtils === 'undefined') { console.error('[NexusAssistant] NexusTextUtils não encontrado.'); return false; }
    if (typeof window.NexusHistory   === 'undefined') { console.error('[NexusAssistant] NexusHistory não encontrado.');   return false; }
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
     initUI() — configura o chat, sempre chamado

     Decide entre RESET (contexto mudou de verdade — outra
     disciplina/semestre/modo declarado via NexusCtx.declarar())
     e RESTAURAÇÃO (mesma sessão — F5, reabrir aba, fechar e abrir).
  ══════════════════════════════════════════════════════════ */

  function initUI() {
    if (!_depsUIok()) return;
    if (document.getElementById('nexus-fab')) return;

    NexusUI.init({ onSend: _onUserSend, onReset: _resetarChat });

    // Live chips no input
    (function () {
      var inputEl = document.getElementById('nexus-input');
      if (!inputEl) return;
      inputEl.addEventListener('input', function () {
        var val = inputEl.value;
        if (!_pipelineConteudoAtivo) return;
        var ehCmd = _ehPrefixoDisc(val);
        inputEl.classList.toggle('nexus-input--cmd', ehCmd);
        if (ehCmd) _exibirLiveChips(); else _removerLiveChips();
      });
      inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) inputEl.classList.remove('nexus-input--cmd');
      });
    }());

    // Decide reset vs restauração usando NexusCtx.
    // dirty=true  → contexto realmente mudou (disc/sem/modo) → reset completo.
    // dirty=false → mesma sessão (F5, reabrir aba) → restaura disciplina + histórico.
    var resetando = (typeof window.NexusCtx !== 'undefined') && window.NexusCtx.deveResetar();

    if (resetando) {
      if (typeof window.NexusHistory !== 'undefined') {
        window.NexusHistory.limparDominio('resumo');
      }
      _limparDiscSalva();

      state.messages       = [];
      state.discEscolhida  = null;
      state.processando    = false;
      state.discsCacheadas = {};
      state.chaveHistorico = null;

      NexusUI.limparMensagens();
      if (typeof window.NexusWorker !== 'undefined') NexusWorker.limparHistorico();
      if (typeof window.NexusCtx !== 'undefined') window.NexusCtx.confirmarReset();

      console.log('[NexusAssistant] reset de contexto aplicado.');
      _addWelcomeMessage();
      // Boas-vindas serão adicionadas por init() após pipeline estar ativo
    } else {
      // Mesma sessão: tenta restaurar disciplina + histórico reais.
      // _addWelcomeMessage() só roda se NÃO houver histórico restaurado,
      // para não duplicar a mensagem de sistema "⬡ Nexus IA" acima de
      // mensagens já existentes.
      var restaurado = _restaurarSessao();
      if (!restaurado) {
        _addWelcomeMessage();
      }
    }
  }

  /* ══════════════════════════════════════════════════════════
     init() — ativa pipeline de conteúdo de resumo

     Só mostra boas-vindas quando NÃO havia histórico restaurado em
     initUI() — caso contrário a conversa restaurada já é suficiente
     e boas-vindas duplicadas seriam ruído.
  ══════════════════════════════════════════════════════════ */

  function init() {
    if (!_depsConteudoOk()) return;

    _pipelineConteudoAtivo = true;
    console.log('[NexusAssistant] pipeline de conteúdo de resumo ativo.');

    if (state.discEscolhida) {
      // Disciplina restaurada por initUI() — garante índice/conteúdo
      // carregados, sem mostrar boas-vindas (histórico já cobre isso).
      NexusUI.atualizarDiscAtiva(state.discEscolhida.apelido);
      _garantirConteudo(state.discEscolhida).catch(function (err) {
        console.warn('[NexusAssistant] falha ao recarregar conteúdo restaurado:', err);
      });
    } else {
      NexusUI.atualizarDiscAtiva(null);
      _mostrarBoasVindas();
    }
  }

  /* ══════════════════════════════════════════════════════════
     EVENTO: troca de semestre
  ══════════════════════════════════════════════════════════ */

  document.addEventListener('nexus:semestreChanged', function () {
    _limparHistoricoAtivo();
    _limparContexto();
    _limparDiscSalva();
    state.discsCacheadas = {};
    _removerLiveChips();
  });

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════════════════════════ */

  window.NexusAssistant = {
    initUI,
    init,
    open:   function () { NexusUI.open();   },
    close:  function () { NexusUI.close();  },
    toggle: function () { NexusUI.toggle(); },
    pipelineAtivo: function () { return _pipelineConteudoAtivo; },
  };

}());