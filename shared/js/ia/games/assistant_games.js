/**
 * NEXUS — shared/js/ia/games/assistant_games.js   (v2.0)
 *
 * Assistente de IA do domínio "games" — domínio INDEPENDENTE, no mesmo
 * modelo do quiz (assistant_quiz.js): inicia o próprio chat com
 * NexusUI.init() e responde pelo NexusWorker. É assim que o portão
 * shared/js/ia/init.js (v2.0) já espera o domínio games ("NexusGamesAssistant.init()").
 *
 * POR QUE FOI REESCRITO (causa de a IA dos jogos não funcionar)
 * ─────────────────────────────────────────────────────────────
 * A versão anterior era só um "interceptador" (interceptar/contextoAtivo/
 * purgar) que dependia de ganchos do assistant_resumo.js. Esses ganchos
 * NÃO existem mais no resumo atual (o resumo foi separado do quiz e dos
 * jogos): ele não chama NexusGamesAssistant.interceptar() e não tem
 * selecionarDiscPorId()/limparDisc(). Além disso, as páginas de jogos:
 *   1. nunca chamavam initUI()/init() — não existia botão nem painel do chat;
 *   2. não carregavam core/context.js nem core/history.js;
 *   3. não declaravam window.__NEXUS_CONTEXT__ com o tipo 'games';
 *   4. só o Show do Milhão tentava carregar a IA, e mesmo assim a conversa
 *      nunca era iniciada.
 * E o serializador do banco não entendia os formatos reais (Show do Milhão:
 * `texto` + `alternativas` em objeto {A,B,C,D} + `correta`; V/F: `enunciado`
 * + `resposta`; Complete a Frase: `frase` + `resposta`; Associação: pares
 * `pergunta`/`resposta`), então as alternativas e o gabarito nem chegavam à IA.
 *
 * AUTENTICAÇÃO E WORKER
 * ─────────────────────
 * Nada de novo aqui: toda chamada passa por NexusWorker.perguntar()
 * (core/worker.js), que envia "Authorization: Bearer <ID token do Firebase>"
 * (window.NexusAuthToken), trata 401/403/429/timeout e mostra "Entre na sua
 * conta" sem chamar o Worker quando não há login. Este arquivo não lê token,
 * não conhece a URL do Worker e não enfraquece nenhuma proteção.
 * Parâmetros enviados (mesmo contrato do quiz/resumo):
 *   pergunta (≤ 500, só o digitado) · instrucao (orientação de tutor, ≤ 1500)
 *   · resultados → contexto (banco do jogo) · disciplina · tipoContexto.
 *
 * CONTEXTO DO JOGO
 * ────────────────
 * Dados em window.__NEXUS_GAMES_CTX__ (preenchido por cada jogo, via
 * NexusGamesAssistant.registrarContexto()):
 *   { jogo, discId, nomeJogo, sem, banco: [...] }
 * Sem contexto (ex.: página central de jogos) o chat funciona em modo livre.
 *
 * API pública: window.NexusGamesAssistant
 *   init()                              — inicia o chat (idempotente)
 *   registrarContexto(ctx)              — define/atualiza o jogo ativo
 *   contextoAtivo()                     — há jogo ativo com banco?
 *   interceptar(pergunta, disc, render) — compatibilidade com a API antiga
 *   notificarEntradaNoJogo(discId)      — mostra a disciplina na barra do chat
 *   purgar()                            — limpa o contexto (ao sair da página)
 *
 * Depende de: core/ui.js (NexusUI), core/history.js (NexusHistory),
 *   core/worker.js (NexusWorker); opcional: core/context.js, core/text-utils.js.
 */

(function () {
  'use strict';

  var REPLY_DELAY_MS     = 600;
  var MENSAGEM_MAX_CHARS = 500;     // limite real do Worker para `pergunta`
  var CONTEXTO_MAX       = 14000;   // < MAX_CONTEXTO_CHARS (20000) do Worker e do worker.js

  /* Orientação de tutor: campo SEPARADO da pergunta (limite próprio de 1500 no Worker). */
  var INSTRUCAO_JOGO = (
    'INSTRUÇÃO PARA O TUTOR: o aluno está dentro de um jogo de estudo. O contexto traz o banco de ' +
    'questões do jogo, com o gabarito, SÓ para você conferir os fatos. Ajude a entender o conceito ' +
    'com explicações curtas e exemplos. NÃO entregue a resposta de uma questão que o aluno possa estar ' +
    'respondendo agora, a menos que ele peça explicitamente a resposta ou o gabarito. ' +
    'Se a pergunta não tiver relação com o banco, responda normalmente com seu conhecimento.'
  );

  /* ══════════════════════════════════════════════════════════
     ESTADO
  ══════════════════════════════════════════════════════════ */

  var _iniciado = false;
  var state = {
    messages:       [],
    typingTimer:    null,
    processando:    false,
    chaveHistorico: null,
  };

  /* ══════════════════════════════════════════════════════════
     CONTEXTO DE DADOS DO JOGO
  ══════════════════════════════════════════════════════════ */

  function _getCtxJogo() {
    var ctx = window.__NEXUS_GAMES_CTX__;
    if (!ctx || typeof ctx !== 'object' || !ctx.jogo) return null;
    return ctx;
  }

  function _obterBanco() {
    var ctx = _getCtxJogo();
    if (!ctx) return null;
    if (Array.isArray(ctx.banco) && ctx.banco.length > 0) return ctx.banco;
    if (typeof window.NexusGamesSearch !== 'undefined' && window.NexusGamesSearch.bancoAtual) {
      var b = window.NexusGamesSearch.bancoAtual();
      if (Array.isArray(b)) return b.length ? b : null;
      if (b && Array.isArray(b.questoes))   return b.questoes;
      if (b && Array.isArray(b.cartas))     return b.cartas;
      if (b && Array.isArray(b.afirmacoes)) return b.afirmacoes;
    }
    return null;
  }

  function contextoAtivo() {
    return _getCtxJogo() !== null && _obterBanco() !== null;
  }

  function _semAtual() {
    var ctx = _getCtxJogo();
    if (ctx && ctx.sem) return String(ctx.sem);
    try { return new URLSearchParams(location.search).get('sem') || ''; } catch (_) { return ''; }
  }

  /* ══════════════════════════════════════════════════════════
     SERIALIZAÇÃO DO BANCO (formatos reais dos 5 jogos)
  ══════════════════════════════════════════════════════════ */

  function _semHtml(s) {
    return String(s == null ? '' : s).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function _alternativasTexto(alts) {
    if (Array.isArray(alts)) {
      return alts.map(function (a, i) { return String.fromCharCode(65 + i) + ') ' + _semHtml(a); }).join(' | ');
    }
    if (alts && typeof alts === 'object') {
      return Object.keys(alts).map(function (k) { return k + ') ' + _semHtml(alts[k]); }).join(' | ');
    }
    return '';
  }

  /** Uma linha de texto por item, conforme o formato do jogo. */
  function _linhaItem(q, i) {
    var p = 'Q' + (i + 1) + ': ';
    if (q == null) return '';
    if (typeof q === 'string') return p + _semHtml(q);

    // Show do Milhão (e perguntas de múltipla escolha)
    if (q.alternativas && (q.texto || q.pergunta)) {
      var l = p + _semHtml(q.texto || q.pergunta);
      var alt = _alternativasTexto(q.alternativas);
      if (alt) l += ' | ' + alt;
      if (q.correta != null) l += ' | Gabarito: ' + _semHtml(q.correta);
      return l;
    }
    // Verdadeiro ou Falso
    if (q.enunciado) {
      var v = p + _semHtml(q.enunciado);
      if (typeof q.resposta === 'boolean') v += ' [' + (q.resposta ? 'Verdadeiro' : 'Falso') + ']';
      if (q.explicacao) v += ' — ' + _semHtml(q.explicacao);
      return v;
    }
    // Complete a Frase
    if (q.frase) {
      var f = p + _semHtml(q.frase);
      if (q.resposta != null) f += ' → ' + _semHtml(q.resposta);
      return f;
    }
    // Flashcard
    if (q.frente) return p + _semHtml(q.frente) + ' → ' + _semHtml(q.verso || '');
    // Associação (pares termo/definição)
    if (q.pergunta && q.resposta != null) return p + _semHtml(q.pergunta) + ' → ' + _semHtml(q.resposta);
    // Genéricos
    if (q.pergunta) return p + _semHtml(q.pergunta);
    if (q.texto) {
      var t = p + _semHtml(q.texto);
      if (q.correto !== undefined) t += ' [' + (q.correto ? 'Verdadeiro' : 'Falso') + ']';
      return t;
    }
    if (q.question) return p + _semHtml(q.question);
    try { return p + JSON.stringify(q); } catch (_) { return ''; }
  }

  function _tokens(s) {
    var n;
    if (typeof window.NexusTextUtils !== 'undefined' && window.NexusTextUtils.normalizarTexto) {
      n = window.NexusTextUtils.normalizarTexto(s);
    } else {
      n = String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ');
    }
    return n.split(/\s+/).filter(function (w) { return w.length > 2; });
  }

  /**
   * Monta o contexto textual. Cabendo tudo, vai o banco inteiro (ordem original);
   * senão, entram primeiro os itens mais relacionados à pergunta.
   */
  function _montarContexto(pergunta) {
    var ctx   = _getCtxJogo();
    var banco = _obterBanco();
    if (!ctx || !banco) return null;

    var nomeJogo = ctx.nomeJogo || ctx.jogo;
    var cab      = 'Banco de questões — ' + nomeJogo + (ctx.discId ? ' (' + ctx.discId + ')' : '') + ':';
    var itens    = [];
    for (var i = 0; i < banco.length; i++) {
      var linha = _linhaItem(banco[i], i);
      if (linha) itens.push({ i: i, linha: linha, score: 0 });
    }

    var total = cab.length;
    itens.forEach(function (it) { total += it.linha.length + 1; });

    var escolhidos = itens;
    var omitidos   = 0;
    if (total > CONTEXTO_MAX) {
      var qt = _tokens(pergunta);
      itens.forEach(function (it) {
        var set = {}; _tokens(it.linha).forEach(function (w) { set[w] = 1; });
        qt.forEach(function (w) { if (set[w]) it.score++; });
      });
      var porRelevancia = itens.slice().sort(function (a, b) { return b.score - a.score || a.i - b.i; });
      var usado = cab.length, pegos = [];
      for (var k = 0; k < porRelevancia.length; k++) {
        var it = porRelevancia[k];
        if (usado + it.linha.length + 1 > CONTEXTO_MAX) continue;
        pegos.push(it); usado += it.linha.length + 1;
      }
      escolhidos = pegos.sort(function (a, b) { return a.i - b.i; });
      omitidos   = itens.length - escolhidos.length;
    }

    var linhas = [cab].concat(escolhidos.map(function (it) { return it.linha; }));
    if (omitidos > 0) linhas.push('… (' + omitidos + ' questões menos relacionadas omitidas)');

    return [{ score: 100, texto: linhas.join('\n'), aula: nomeJogo, secao: ctx.jogo }];
  }

  /* ══════════════════════════════════════════════════════════
     CHAMADA À IA (sempre via NexusWorker)
  ══════════════════════════════════════════════════════════ */

  function _rodape(resp, fonte) {
    if (!resp || (!resp.fonte && !resp.modelo)) return null;
    return {
      linha1: ['IA: ' + (resp.fonte || ''), resp.modelo || ''].filter(Boolean).join(' · '),
      linha2: 'fonte: ' + fonte,
    };
  }

  /** Resolve a pergunta com o banco do jogo (se houver) ou em modo livre. */
  async function _perguntarIA(pergunta) {
    if (typeof window.NexusWorker === 'undefined') return { resp: null, fonte: '' };
    var ctx = _getCtxJogo();
    var comBanco = contextoAtivo();
    var resultados = comBanco ? (_montarContexto(pergunta) || []) : [];
    var resp = null;
    try {
      resp = await window.NexusWorker.perguntar({
        pergunta:     pergunta,
        instrucao:    comBanco ? INSTRUCAO_JOGO : '',
        resultados:   resultados,
        disciplina:   (ctx && ctx.discId) || '',
        tipoContexto: comBanco ? 'conteudo' : 'livre',
        semContexto:  !comBanco,
      });
    } catch (e) {
      console.warn('[NexusGamesAssistant] NexusWorker.perguntar erro:', e);
    }
    return { resp: resp, fonte: comBanco ? (ctx.nomeJogo || ctx.jogo) : 'conhecimento próprio' };
  }

  /** API antiga (compatibilidade): trata a pergunta no contexto do jogo ativo. */
  async function interceptar(pergunta, disc, renderBot) {
    if (!contextoAtivo() || typeof window.NexusWorker === 'undefined') return false;
    var r = await _perguntarIA(pergunta);
    if (r.resp && r.resp.cancelado) return true;
    if (r.resp && typeof renderBot === 'function') { renderBot(r.resp.texto, _rodape(r.resp, r.fonte)); return true; }
    return false;
  }

  /* ══════════════════════════════════════════════════════════
     HISTÓRICO / MENSAGENS
  ══════════════════════════════════════════════════════════ */

  function _getTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function _montarChave() {
    var ctx = _getCtxJogo();
    var id  = ctx ? (ctx.jogo + (ctx.discId ? '-' + ctx.discId : '')) : 'hub';
    if (typeof window.NexusHistory !== 'undefined') {
      try { return window.NexusHistory.montarChave('games', id, _semAtual()); } catch (_) {}
    }
    return null;
  }

  function _salvar() {
    if (!state.chaveHistorico || typeof window.NexusHistory === 'undefined') return;
    try { window.NexusHistory.salvar(state.chaveHistorico, state.messages); } catch (_) {}
  }

  function _push(msg) {
    state.messages.push(msg);
    _salvar();
    msg.__idx = state.messages.length - 1;
    return msg;
  }

  function _renderBot(text, rodape) {
    if (typeof window.NexusUI === 'undefined') return;
    var msg = _push({ role: 'bot', text: text, time: _getTime(), rodape: rodape || null });
    window.NexusUI.renderMessage(msg);
  }

  function _setInputBloqueado(bloqueado) {
    var input = document.getElementById('nexus-input');
    if (!input) return;
    input.disabled = bloqueado;
    input.placeholder = bloqueado ? 'Aguarde…' : 'Digite sua mensagem…';
    if (!bloqueado) {
      var panel = document.getElementById('nexus-panel');
      if (panel && panel.classList.contains('nexus-open')) input.focus({ preventScroll: true });
    }
  }

  function _boasVindas() {
    var ctx = _getCtxJogo();
    if (ctx && contextoAtivo()) {
      _renderBot(
        '🎮 Assistente de jogos — ' + (ctx.nomeJogo || ctx.jogo) + '\n\n' +
        'Posso ajudar com:\n' +
        '  • Explicar um conceito que apareceu no jogo\n' +
        '  • Tirar dúvidas sobre uma questão ou alternativa\n' +
        '  • Revisar o conteúdo da disciplina\n\n' +
        'Não entrego a resposta de uma questão em andamento — peça o gabarito se quiser. 😊'
      );
    } else {
      _renderBot('🎮 Assistente de jogos\n\nPode me perguntar qualquer coisa — estou aqui para ajudar!');
    }
  }

  function _mostrarSistema() {
    var sys = _push({ role: 'system', text: '⬡  Nexus IA', time: _getTime() });
    window.NexusUI.renderMessage(sys);
  }

  /** Carrega (ou cria) a conversa da chave atual e desenha no painel. */
  function _carregarConversa() {
    state.chaveHistorico = _montarChave();
    var salvo = [];
    if (state.chaveHistorico && typeof window.NexusHistory !== 'undefined') {
      try { salvo = window.NexusHistory.carregar(state.chaveHistorico) || []; } catch (_) { salvo = []; }
    }
    if (typeof window.NexusWorker !== 'undefined') window.NexusWorker.limparHistorico();
    window.NexusUI.limparMensagens();
    state.messages = [];
    if (salvo.length > 0) {
      state.messages = salvo;
      salvo.forEach(function (m, i) { m.__idx = i; window.NexusUI.renderMessage(m); });
      if (typeof window.NexusWorker !== 'undefined' && window.NexusWorker.restaurarHistorico) {
        window.NexusWorker.restaurarHistorico(salvo);
      }
      var el = document.getElementById('nexus-messages');
      if (el) {
        var b = document.createElement('div');
        b.className = 'nexus-msg nexus-system nexus-restore-banner';
        b.innerHTML = '<div class="nexus-msg-bubble">↩ Histórico restaurado</div>';
        el.appendChild(b);
      }
    } else {
      _mostrarSistema();
      _boasVindas();
    }
  }

  /* ══════════════════════════════════════════════════════════
     FLUXO DO CHAT
  ══════════════════════════════════════════════════════════ */

  function _onStop() {
    if (!state.processando) return;
    if (state.typingTimer) { clearTimeout(state.typingTimer); state.typingTimer = null; }
    if (typeof window.NexusWorker !== 'undefined' && window.NexusWorker.parar) window.NexusWorker.parar();
    state.processando = false;
    window.NexusUI.hideTyping();
    _setInputBloqueado(false);
  }

  function _onUserSend(text) {
    if (state.processando) return;
    if (!text || !text.trim()) return;
    if (text.length > MENSAGEM_MAX_CHARS) {
      window.NexusUI.renderMessage({ role: 'system', text: 'Mensagem muito grande. Resuma sua pergunta e tente novamente.', time: _getTime() });
      return;
    }
    if (state.typingTimer) clearTimeout(state.typingTimer);
    var u = _push({ role: 'user', text: text, time: _getTime() });
    window.NexusUI.renderMessage(u);
    window.NexusUI.showTyping();
    state.processando = true;
    _setInputBloqueado(true);
    state.typingTimer = setTimeout(function () { _processar(text); }, REPLY_DELAY_MS);
  }

  async function _processar(texto) {
    try {
      if (typeof window.NexusWorker === 'undefined') {
        _renderBot('Assistente de IA não disponível no momento.');
        return;
      }
      var r = await _perguntarIA(texto.trim());
      if (r.resp && r.resp.cancelado) return;
      if (r.resp) { _renderBot(r.resp.texto, _rodape(r.resp, r.fonte)); return; }
      _renderBot('Não consegui obter a resposta da IA agora. Envie de novo ou troque o modelo no seletor.');
    } catch (err) {
      console.error('[NexusGamesAssistant] erro ao processar:', err);
      _renderBot('Ocorreu um erro ao processar sua pergunta. Tente novamente.');
    } finally {
      window.NexusUI.hideTyping();
      state.processando = false;
      _setInputBloqueado(false);
    }
  }

  function _resetarChat() {
    if (state.chaveHistorico && typeof window.NexusHistory !== 'undefined') {
      try { window.NexusHistory.limpar(state.chaveHistorico); } catch (_) {}
    }
    state.messages = [];
    state.processando = false;
    if (state.typingTimer) { clearTimeout(state.typingTimer); state.typingTimer = null; }
    if (typeof window.NexusWorker !== 'undefined') window.NexusWorker.limparHistorico();
    window.NexusUI.limparMensagens();
    window.NexusUI.hideTyping();
    _setInputBloqueado(false);
    _mostrarSistema();
    _boasVindas();
  }

  /* ══════════════════════════════════════════════════════════
     DISCIPLINA NA BARRA DO CHAT
  ══════════════════════════════════════════════════════════ */

  function _rotuloDisc(discId) {
    try {
      var c = window.__nexusCtx;
      var lista = c && c.getDisciplinas ? c.getDisciplinas(_semAtual() || (c.getSemestre && c.getSemestre())) : null;
      if (Array.isArray(lista)) {
        var d = lista.find(function (x) { return x.id === discId || x.arquivo === discId; });
        if (d) return d.apelido || d.nome || discId;
      }
    } catch (_) {}
    return discId;
  }

  function notificarEntradaNoJogo(discId) {
    if (!discId || typeof window.NexusUI === 'undefined') return;
    window.NexusUI.atualizarDiscAtiva(_rotuloDisc(discId));
  }

  /* ══════════════════════════════════════════════════════════
     CONTEXTO / INIT / PURGE
  ══════════════════════════════════════════════════════════ */

  /** Define o jogo ativo (cada jogo chama quando o banco termina de carregar). */
  function registrarContexto(ctx) {
    if (!ctx || !ctx.jogo) return;
    window.__NEXUS_GAMES_CTX__ = ctx;
    if (_iniciado) {
      var nova = _montarChave();
      if (nova !== state.chaveHistorico) {      // troca de jogo/disciplina: conversa própria
        _salvar();
        _carregarConversa();
      }
      if (ctx.discId) notificarEntradaNoJogo(ctx.discId);
    }
  }

  function init() {
    if (_iniciado) return;
    if (typeof window.NexusUI === 'undefined' || typeof window.NexusHistory === 'undefined') {
      console.error('[NexusGamesAssistant] init() abortado — NexusUI/NexusHistory não carregados.');
      return;
    }
    if (typeof window.NexusWorker === 'undefined') {
      console.warn('[NexusGamesAssistant] NexusWorker não encontrado — respostas de IA indisponíveis.');
    }
    _iniciado = true;
    window.NexusUI.init({
      onSend:  _onUserSend,
      onReset: _resetarChat,
      onStop:  _onStop,
    });
    var ctx = _getCtxJogo();
    window.NexusUI.atualizarDiscAtiva(ctx && ctx.discId ? _rotuloDisc(ctx.discId) : null);
    _carregarConversa();
    console.log('[NexusGamesAssistant] iniciado v2.0 — ' + (ctx ? ctx.jogo + ' / ' + ctx.discId : 'hub (modo livre)'));
  }

  function purgar() {
    try { delete window.__NEXUS_GAMES_CTX__; } catch (e) {}
    if (typeof window.NexusGamesSearch !== 'undefined' && window.NexusGamesSearch.limpar) {
      window.NexusGamesSearch.limpar();
    }
  }

  window.addEventListener('pagehide', purgar);

  /* ══════════════════════════════════════════════════════════
     REGISTRO GLOBAL
  ══════════════════════════════════════════════════════════ */

  window.NexusGamesAssistant = {
    init: init,
    registrarContexto: registrarContexto,
    contextoAtivo: contextoAtivo,
    interceptar: interceptar,
    notificarEntradaNoJogo: notificarEntradaNoJogo,
    purgar: purgar,
  };

}());
