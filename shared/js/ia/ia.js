/**
 * ASSISTENTE NEXUS — ia.js
 * Controlador principal. Ponto de entrada único.
 *
 * Dependências (carregadas antes deste script, nesta ordem):
 *   ia-ui.js     → window.NexusUI
 *   ia-search.js → window.NexusSearch
 *   ia-loader.js → window.NexusLoader
 *
 * Ponte com ES Modules:
 *   window.__nexusCtx → exposto pelo global.js
 *   { getSemestre(), getDisciplinas(), getDisciplinaAtual(), parseSemestre() }
 *
 * ── FLUXO DE DISCIPLINA ──────────────────────────────────────
 *
 *  1. Ao restaurar histórico, disciplina é extraída das mensagens salvas
 *     e restaurada no state SEM reprocessar input do usuário.
 *  2. Se getDisciplinaAtual() retornar um id válido → usa direto.
 *  3. Se não houver disciplina ativa:
 *     a. Responde com a lista de disciplinas.
 *     b. Aguarda o usuário digitar o nome (ou parte dele).
 *     c. Faz match por id, apelido ou nome (case-insensitive).
 *     d. Carrega o res_*.js correspondente e indexa.
 *  4. Troca de disciplina via comando explícito tem prioridade máxima.
 *
 * ── CHANGELOG ───────────────────────────────────────────────
 * FIX 1  — _normalizar() delega para NexusSearch.normalizarTexto().
 * FIX 2  — NexusSearch.estaIndexado() em vez de _getIndice().length.
 * FIX 3  — state.processando=true desabilita o botão de envio.
 * FIX 4  — _detectarTrocaDisc() heurística + palavras interrogativas.
 * FIX 5  — Race condition eliminada: lock ANTES do setTimeout.
 * FIX 6  — _extrairSentencas() sem lookbehind (Safari iOS compat).
 * FIX 7  — state.messages usa tipo 'system' como discriminador.
 * FIX 8  — Histórico de chat por sessionStorage.
 * FIX 9  — Comando explícito de troca de disciplina.
 * FIX 10 — Indicador de disciplina ativa no header (via NexusUI).
 * FIX 11 — Sugestões clicáveis na tela inicial.
 * FIX 12 — Formatação de resposta com Aula + Seção destacadas.
 * FIX 13 — Feedback 👍/👎 por resposta (sessionStorage).
 * FIX 14 — Comando "resumo aula N".
 * FIX 15 — Busca em múltiplas disciplinas carregadas ("buscar em tudo").
 *
 * CORREÇÃO A — Restauro de histórico NÃO reexecuta lógica de disciplina.
 *              discEscolhida é extraída das mensagens salvas, não inferida
 *              por heurística sobre textos do usuário.
 * CORREÇÃO B — aguardandoDisc é gerenciado em ponto único (_pedirDisc /
 *              _confirmarDisc). Histórico restaurado não ativa a flag.
 * CORREÇÃO C — _resolverDisc() não muta state.aguardandoDisc
 *              dentro do fluxo aguardandoDisc — evita conflito de flags.
 * CORREÇÃO D — _processar() verifica aguardandoDisc ANTES de qualquer
 *              outra lógica (exceto comandos explícitos e ajuda).
 * ────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── CONSTANTES ──────────────────────────────────────────── */
  const REPLY_DELAY_MS  = 900;
  const TOP_K           = 5;
  const MIN_SCORE       = 10;
  const MAX_HISTORY     = 20;
  const SESSION_KEY     = 'nexus_chat_history';
  const SESSION_DISC    = 'nexus_disc_ativa';   // CORREÇÃO A: chave separada p/ disciplina
  const FEEDBACK_KEY    = 'nexus_feedback';

  /* ── ESTADO ──────────────────────────────────────────────── */
  // Ponto único de verdade. Nenhum outro arquivo muta este objeto.
  const state = {
    messages:       [],
    typingTimer:    null,
    discEscolhida:  null,   // objeto de disciplina ou null
    aguardandoDisc: false,  // true = aguardando o usuário digitar nome da disc
    processando:    false,
    discsCacheadas: {},     // { discId: trechos[] } — FIX 15
  };

  /* ══════════════════════════════════════════════════════════
     NORMALIZAÇÃO — FIX 1 (fonte única)
     ══════════════════════════════════════════════════════════ */

  function _normalizar(str) {
    return NexusSearch.normalizarTexto(str);
  }

  /* ── HELPERS ─────────────────────────────────────────────── */

  function _getTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * FIX 7: preserva mensagem 'system' pelo tipo, não pela posição.
   */
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

  function _renderBot(text, feedbackId) {
    const msg = _push({ role: 'bot', text: text, time: _getTime(), feedbackId: feedbackId || null });
    NexusUI.renderMessage(msg);
  }

  /**
   * FIX 3: habilita ou bloqueia o input de texto e o botão de envio.
   */
  function _setInputBloqueado(bloqueado) {
    const input   = document.getElementById('nexus-input');
    const sendBtn = document.getElementById('nexus-send');
    if (input)   input.disabled   = bloqueado;
    if (sendBtn) sendBtn.disabled = bloqueado;
    if (input) input.placeholder = bloqueado ? 'Aguarde…' : 'Digite sua mensagem…';
  }

  /* ══════════════════════════════════════════════════════════
     FIX 8 + CORREÇÃO A — HISTÓRICO (sessionStorage)
     Histórico de mensagens e disciplina ativa são salvos
     em chaves SEPARADAS para restauro preciso.
     ══════════════════════════════════════════════════════════ */

  function _salvarHistorico() {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(state.messages));
    } catch (e) {}
  }

  /**
   * CORREÇÃO A: salva a disciplina ativa separadamente.
   * Isso evita ter que inferir a disciplina por heurística nas mensagens.
   */
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
    } catch (e) {
      return null;
    }
  }

  /**
   * CORREÇÃO A: restaura disciplina da chave dedicada, sem heurística.
   * Retorna o objeto de disciplina ou null.
   */
  function _carregarDiscSalva() {
    try {
      const raw = sessionStorage.getItem(SESSION_DISC);
      if (!raw) return null;
      const disc = JSON.parse(raw);
      if (!disc || !disc.id) return null;
      // Valida que a disciplina ainda existe no semestre atual
      const discs = _getDisciplinas();
      if (!discs) return null;
      const encontrada = discs.find(function (d) { return d.id === disc.id; });
      return encontrada || null;
    } catch (e) {
      return null;
    }
  }

  function _limparHistoricoStorage() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_DISC);
    } catch (e) {}
  }

  /* ══════════════════════════════════════════════════════════
     FIX 13 — FEEDBACK (sessionStorage)
     ══════════════════════════════════════════════════════════ */

  function _registrarFeedback(feedbackId, valor) {
    try {
      const raw      = sessionStorage.getItem(FEEDBACK_KEY);
      const feedbacks = raw ? JSON.parse(raw) : {};
      feedbacks[feedbackId] = { valor: valor, time: _getTime() };
      sessionStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbacks));
      console.log('[NexusAssistant] feedback registrado:', feedbackId, valor);
    } catch (e) {}
  }

  /* ══════════════════════════════════════════════════════════
     CONTEXTO — lê do global.js via window.__nexusCtx
     ══════════════════════════════════════════════════════════ */

  function _getCtxBridge() {
    const ctx = window.__nexusCtx;
    if (!ctx) {
      console.warn('[NexusAssistant] window.__nexusCtx não disponível.');
      return null;
    }
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
    return {
      ano:     parsed.ano,
      periodo: parsed.periodo,
      ap:      parsed.ap,
      arquivo: disc.arquivo,
    };
  }

  /**
   * CORREÇÃO C: _resolverDisc() retorna a disciplina ativa sem mutar
   * state.aguardandoDisc. A mutação de flags só ocorre em _confirmarDisc()
   * e _limparContexto(). Isso evita que o fluxo aguardandoDisc seja
   * interrompido por uma chamada colateral a _resolverDisc().
   */
  function _resolverDisc() {
    const ctx = _getCtxBridge();
    if (!ctx) return state.discEscolhida || null;

    const idAtivo = ctx.getDisciplinaAtual ? ctx.getDisciplinaAtual() : null;
    if (idAtivo) {
      const discs = _getDisciplinas();
      if (discs) {
        const found = discs.find(function (d) { return d.id === idAtivo; });
        if (found) {
          // Se a disciplina ativa do contexto mudou, limpa e troca silenciosamente
          if (state.discEscolhida && state.discEscolhida.id !== found.id) {
            NexusSearch.limparIndice();
            NexusLoader.limpar();
            state.discEscolhida = null;
            _salvarDiscAtiva();
          }
          return found;
        }
      }
    }

    return state.discEscolhida || null;
  }

  /* ══════════════════════════════════════════════════════════
     CARREGAMENTO
     ══════════════════════════════════════════════════════════ */

  /**
   * FIX 2: usa NexusSearch.estaIndexado() em vez de _getIndice().length.
   */
  async function _garantirConteudo(disc) {
    const loaderCtx = _montarCtx(disc);
    if (!loaderCtx) return false;

    const conteudo = await NexusLoader.carregar(loaderCtx);
    if (!conteudo) return false;

    if (!NexusSearch.estaIndexado()) {
      NexusSearch.indexarConteudo(conteudo);
    }

    return true;
  }

  /* ══════════════════════════════════════════════════════════
     LIMPEZA DE CONTEXTO
     ══════════════════════════════════════════════════════════ */

  function _limparContexto() {
    NexusSearch.limparIndice();
    NexusLoader.limpar();
    state.discEscolhida  = null;
    state.aguardandoDisc = false;
    _salvarDiscAtiva();
    NexusUI.atualizarDiscAtiva(null);
    console.log('[NexusAssistant] contexto limpo.');
  }

  /* ══════════════════════════════════════════════════════════
     SELEÇÃO DE DISCIPLINA VIA CHAT
     ══════════════════════════════════════════════════════════ */

  function _pedirDisc() {
    const discs = _getDisciplinas();
    if (!discs || !discs.length) {
      _renderBot('Não encontrei disciplinas para o semestre atual.');
      return;
    }

    const lista = discs.map(function (d) {
      return '  • ' + d.apelido + ' — ' + d.nome;
    }).join('\n');

    _renderBot(
      'Não encontrei uma disciplina ativa.\n\n' +
      'Disciplinas disponíveis:\n' + lista + '\n\n' +
      'Digite o nome da disciplina que deseja consultar.'
    );

    state.aguardandoDisc = true;
  }

  /**
   * CORREÇÃO B: _confirmarDisc() é o único ponto que finaliza o modo
   * aguardandoDisc. Centraliza o carregamento e atualização de estado.
   */
  async function _confirmarDisc(disc) {
    NexusSearch.limparIndice();
    NexusLoader.limpar();

    state.discEscolhida  = disc;
    state.aguardandoDisc = false;
    _salvarDiscAtiva();

    const ok = await _garantirConteudo(disc);
    if (!ok) {
      // Reverte em caso de falha — não fica em estado inconsistente
      state.discEscolhida = null;
      _salvarDiscAtiva();
      _renderBot('Não consegui carregar o conteúdo de ' + disc.apelido + '. Tente novamente.');
      return false;
    }

    NexusUI.atualizarDiscAtiva(disc.apelido);

    const sugestoes = _gerarSugestoes(window.__nexusConteudo);

    _renderBot(
      '✓ Disciplina carregada: ' + disc.apelido + '\n\n' +
      'Pode fazer perguntas sobre ' + disc.nome + '.\n' +
      'Para trocar de disciplina: "mudar Redes" ou "trocar para POO".'
    );

    if (sugestoes.length > 0) {
      NexusUI.mostrarSugestoes(sugestoes, _onSugestaoClick);
    }

    return true;
  }

  function _matchDisc(texto) {
    const discs = _getDisciplinas();
    if (!discs) return null;

    const norm = _normalizar(texto);

    var found = discs.find(function (d) {
      return _normalizar(d.id) === norm;
    });
    if (found) return found;

    found = discs.find(function (d) {
      return _normalizar(d.apelido).includes(norm) ||
             _normalizar(d.nome).includes(norm)    ||
             norm.includes(_normalizar(d.apelido)) ||
             norm.includes(_normalizar(d.id));
    });

    return found || null;
  }

  /**
   * FIX 9 — Detecta comando explícito de troca de disciplina.
   * Máxima prioridade — sempre verificado antes da heurística.
   */
  function _detectarComandoTroca(texto) {
    const norm = _normalizar(texto.trim());

    const PREFIXOS = [
      'mudar para ', 'mudar ', 'trocar para ', 'trocar ',
      'ir para ', 'abrir ', 'carregar ', 'muda para ', 'muda ',
      'troca para ', 'troca ', 'mudar disc ', 'trocar disc ',
    ];

    for (var i = 0; i < PREFIXOS.length; i++) {
      var pfx = PREFIXOS[i];
      if (norm.startsWith(pfx)) {
        var resto = norm.slice(pfx.length).trim();
        if (resto.length >= 2) {
          return _matchDisc(resto);
        }
      }
    }

    return null;
  }

  /**
   * FIX 4: Heurística de troca por nome simples (fallback).
   * Só é chamada quando já existe uma disciplina ativa —
   * nunca durante o fluxo aguardandoDisc.
   */
  function _detectarTrocaDisc(texto) {
    var trim = texto.trim();

    if (trim.length < 2) return null;
    if (trim.includes('?')) return null;

    var _INTERROGATIVAS = /^(como|qual|quais|o que|oque|por que|porque|quando|onde|what|how)\b/i;
    if (_INTERROGATIVAS.test(_normalizar(trim))) return null;

    var palavras = trim.split(/\s+/);
    if (palavras.length > 4) return null;

    return _matchDisc(trim);
  }

  /* ══════════════════════════════════════════════════════════
     AJUDA
     ══════════════════════════════════════════════════════════ */

  function _ehPedidoAjuda(texto) {
    const norm = _normalizar(texto);
    return norm === 'ajuda' || norm === '?' || norm === 'help';
  }

  function _responderAjuda(discAtual) {
    const discs = _getDisciplinas() || [];

    const exemplosDiscs = discs
      .map(function (d) { return '  • ' + d.apelido; })
      .join('\n');

    const discAtualLinha = discAtual
      ? 'Disciplina atual: ' + discAtual.apelido + ' (' + discAtual.nome + ')'
      : 'Nenhuma disciplina selecionada.';

    _renderBot(
      discAtualLinha + '\n\n' +
      'Como usar:\n' +
      '  • Digite qualquer pergunta para buscar no conteúdo\n' +
      '  • "mudar Redes" ou "trocar para POO" para mudar disciplina\n' +
      '  • "resumo aula 3" para ver a ideia central da aula 3\n' +
      '  • "buscar em tudo: [termo]" para buscar em todas as disciplinas\n' +
      '  • "ajuda" ou "?" para ver esta mensagem\n\n' +
      'Disciplinas disponíveis:\n' +
      exemplosDiscs
    );
  }

  /* ══════════════════════════════════════════════════════════
     FIX 14 — COMANDO "RESUMO AULA N"
     ══════════════════════════════════════════════════════════ */

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
    const conteudo = window.__nexusConteudo;

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

    const ideia      = aula.ideia_central || '(sem ideia central registrada)';
    const numSecoes  = Array.isArray(aula.secoes) ? aula.secoes.length : 0;
    const titulosSecoes = numSecoes > 0
      ? aula.secoes.map(function (s) { return '  • ' + (s.titulo || '—'); }).join('\n')
      : '  (nenhuma seção registrada)';

    return (
      '📖 ' + aula.aula + '\n' +
      '─────────────────────\n' +
      ideia + '\n\n' +
      'Seções (' + numSecoes + '):\n' +
      titulosSecoes + '\n\n' +
      '─── ' + nomeDisc
    );
  }

  /* ══════════════════════════════════════════════════════════
     FIX 15 — BUSCA EM MÚLTIPLAS DISCIPLINAS
     ══════════════════════════════════════════════════════════ */

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

  async function _carregarDiscParaBuscaGlobal(disc) {
    if (state.discsCacheadas[disc.id]) {
      return state.discsCacheadas[disc.id];
    }

    const loaderCtx = _montarCtx(disc);
    if (!loaderCtx) return [];

    const conteudo = await NexusLoader.carregar(loaderCtx);
    if (!conteudo || !Array.isArray(conteudo.aulas)) return [];

    const trechos = [];
    conteudo.aulas.forEach(function (aula) {
      const nomeAula = aula.aula || '';
      if (aula.ideia_central) {
        trechos.push({ texto: aula.ideia_central, aula: nomeAula, secao: 'Ideia Central', disc: disc.apelido });
      }
      if (Array.isArray(aula.secoes)) {
        aula.secoes.forEach(function (secao) {
          if (secao.titulo) {
            trechos.push({ texto: secao.titulo, aula: nomeAula, secao: secao.titulo, disc: disc.apelido });
          }
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
        if (bloco.texto) textos.push(bloco.texto);
        break;
      case 'topico':
        if (bloco.titulo) textos.push(bloco.titulo);
        if (bloco.texto)  textos.push(bloco.texto);
        if (Array.isArray(bloco.lista)) textos.push(bloco.lista.join(' '));
        break;
      case 'lista':
        if (bloco.titulo) textos.push(bloco.titulo);
        if (Array.isArray(bloco.itens)) textos.push(bloco.itens.join(' '));
        break;
      case 'exemplo':
        if (bloco.titulo) textos.push(bloco.titulo);
        if (bloco.texto)  textos.push(bloco.texto);
        if (typeof bloco.detalhe === 'string') textos.push(bloco.detalhe);
        break;
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
    if (!discs || !discs.length) {
      return 'Nenhuma disciplina encontrada para este semestre.';
    }

    const queryNorm      = _normalizar(termoBusca);
    const todosResultados = [];
    const discAtual      = _resolverDisc();

    for (var i = 0; i < discs.length; i++) {
      var disc = discs[i];

      if (discAtual && disc.id === discAtual.id && NexusSearch.estaIndexado()) {
        var res = NexusSearch.buscar(termoBusca, { topK: 3, minScore: MIN_SCORE });
        res.forEach(function (r) {
          todosResultados.push(Object.assign({}, r, { disc: disc.apelido }));
        });
      } else {
        var trechos = await _carregarDiscParaBuscaGlobal(disc);
        trechos.forEach(function (t) {
          var sc = _scoreBuscaGlobal(queryNorm, _normalizar(t.texto));
          if (sc >= MIN_SCORE) {
            todosResultados.push({ score: sc, texto: t.texto, aula: t.aula, secao: t.secao, disc: t.disc });
          }
        });
      }
    }

    if (!todosResultados.length) {
      return 'Nenhum resultado para "' + termoBusca + '" em nenhuma disciplina.';
    }

    todosResultados.sort(function (a, b) { return b.score - a.score; });
    const top = todosResultados.slice(0, 6);

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

  /* ══════════════════════════════════════════════════════════
     FIX 11 — SUGESTÕES NA TELA INICIAL
     ══════════════════════════════════════════════════════════ */

  function _gerarSugestoes(conteudo) {
    if (!conteudo || !Array.isArray(conteudo.aulas)) return [];

    return conteudo.aulas
      .filter(function (a) { return a.ideia_central; })
      .slice(0, 4)
      .map(function (a) {
        var tema = a.ideia_central.split(/[.,;]/)[0].trim();
        return _truncarNaPalavra(tema, 60);
      });
  }

  /* ══════════════════════════════════════════════════════════
     FORMATAÇÃO DA RESPOSTA — FIX 12
     ══════════════════════════════════════════════════════════ */

  function _truncarNaPalavra(texto, limite) {
    if (texto.length <= limite) return texto;
    const cortado     = texto.slice(0, limite);
    const ultimoEspaco = cortado.lastIndexOf(' ');
    return (ultimoEspaco > 0 ? cortado.slice(0, ultimoEspaco) : cortado) + '…';
  }

  /**
   * FIX 6: sem lookbehind — compatível com Safari iOS < 16.4.
   */
  function _extrairSentencas(texto) {
    var tokens    = texto.split(' ');
    var sentencas = [];
    var atual     = [];

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
    if (!termos.length) return texto;
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
    const feedbackId = 'fb_' + Date.now();

    if (!resultados.length) {
      return {
        feedbackId: null,
        texto: (
          'Nenhum resultado encontrado para "' + pergunta + '" em ' + nomeDisc + '.\n\n' +
          'Dicas:\n' +
          '  • Tente termos mais simples\n' +
          '  • Verifique se a disciplina correta está selecionada\n' +
          '  • Digite "ajuda" para ver opções'
        ),
      };
    }

    const termos = _normalizar(pergunta).split(' ').filter(function (t) { return t.length >= 3; });

    const aulasVistas = [];
    const porAula     = {};
    resultados.forEach(function (r) {
      const chave = r.aula || 'Geral';
      if (!porAula[chave]) {
        porAula[chave] = { secoes: new Set(), trechos: [] };
        aulasVistas.push(chave);
      }
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
            if (!sentencasVistas.has(sNorm)) {
              sentencasVistas.add(sNorm);
              pontosConsolidados.push(s);
            }
          });
        } else {
          const tNorm = _normalizar(trecho);
          if (!sentencasVistas.has(tNorm)) {
            sentencasVistas.add(tNorm);
            pontosConsolidados.push(trecho);
          }
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

    return { feedbackId: feedbackId, texto: linhas.join('\n').trim() };
  }

  /* ══════════════════════════════════════════════════════════
     FLUXO DO CHAT
     ══════════════════════════════════════════════════════════ */

  function _onUserSend(text) {
    // FIX 5: verifica o lock ANTES de cancelar o timer.
    if (state.processando) return;

    if (state.typingTimer) clearTimeout(state.typingTimer);

    const userMsg = _push({ role: 'user', text: text, time: _getTime() });
    NexusUI.renderMessage(userMsg);
    NexusUI.showTyping();

    // FIX 5: seta o lock aqui, antes do setTimeout.
    state.processando = true;
    _setInputBloqueado(true);

    state.typingTimer = setTimeout(function () {
      _processar(text);
    }, REPLY_DELAY_MS);
  }

  function _onSugestaoClick(texto) {
    _onUserSend(texto);
  }

  /**
   * CORREÇÃO D: ordem de verificação em _processar():
   *
   *   1. ajuda             (sempre respondida, independente de estado)
   *   2. comando de troca  (prioridade máxima — cancela aguardandoDisc se necessário)
   *   3. aguardandoDisc    (usuário deve selecionar disciplina antes de qualquer coisa)
   *   4. resumo aula       (só com disciplina ativa)
   *   5. busca global      (qualquer estado)
   *   6. busca normal      (disciplina ativa)
   */
  async function _processar(texto) {
    try {

      /* ── 1. AJUDA ── */
      if (_ehPedidoAjuda(texto)) {
        _responderAjuda(_resolverDisc());
        return;
      }

      /* ── 2. COMANDO EXPLÍCITO DE TROCA (prioridade máxima) ── */
      const comandoTroca = _detectarComandoTroca(texto);
      if (comandoTroca) {
        // Cancela o modo aguardandoDisc se estava ativo
        state.aguardandoDisc = false;

        if (state.discEscolhida && comandoTroca.id === state.discEscolhida.id) {
          _renderBot('Você já está em ' + comandoTroca.apelido + '. Pode fazer perguntas!');
          return;
        }

        _limparContexto();
        await _confirmarDisc(comandoTroca);
        return;
      }

      /* ── 3. MODO: aguardando escolha de disciplina ── */
      if (state.aguardandoDisc) {
        const disc = _matchDisc(texto);
        if (!disc) {
          _renderBot(
            'Não reconheci essa disciplina. Tente o nome completo ou abreviado.\n' +
            'Exemplos: Redes, POO, Banco de Dados, Design\n\n' +
            'Digite "ajuda" para ver as opções disponíveis.'
          );
          return;
        }

        await _confirmarDisc(disc);
        return;
      }

      /* ── MODO NORMAL: disciplina já selecionada ── */
      const disc = _resolverDisc();

      if (!disc) {
        _pedirDisc();
        return;
      }

      /* ── 4. RESUMO DE AULA ── */
      const numAula = _detectarResumoAula(texto);
      if (numAula !== null) {
        const ok = await _garantirConteudo(disc);
        if (!ok) {
          _renderBot('Não consegui carregar o conteúdo. Tente novamente.');
          return;
        }
        _renderBot(_responderResumoAula(numAula, disc.apelido));
        return;
      }

      /* ── 5. BUSCA GLOBAL ── */
      const termoBuscaGlobal = _detectarBuscaGlobal(texto);
      if (termoBuscaGlobal !== null) {
        const respostaGlobal = await _executarBuscaGlobal(termoBuscaGlobal);
        _renderBot(respostaGlobal);
        return;
      }

      /* ── 6. Heurística de troca de disciplina (fallback) ── */
      const troca = _detectarTrocaDisc(texto);
      if (troca && troca.id !== disc.id) {
        _limparContexto();
        await _confirmarDisc(troca);
        return;
      }

      /* ── 7. BUSCA NORMAL ── */
      const ok = await _garantirConteudo(disc);
      if (!ok) {
        _renderBot('Não consegui carregar o conteúdo de ' + disc.apelido + '. Tente novamente.');
        return;
      }

      NexusUI.atualizarDiscAtiva(disc.apelido);

      const resultados = NexusSearch.buscar(texto, { topK: TOP_K, minScore: MIN_SCORE });

      const { texto: textoResposta, feedbackId } = _formatarResposta(texto, resultados, disc.apelido);
      _renderBot(textoResposta, feedbackId);

      if (feedbackId) {
        NexusUI.renderFeedback(feedbackId, _registrarFeedback);
      }

    } catch (err) {
      console.error('[NexusAssistant] erro ao processar:', err);
      _renderBot('Ocorreu um erro ao processar sua pergunta. Tente novamente.');
    } finally {
      NexusUI.hideTyping();
      state.processando = false;
      _setInputBloqueado(false);
    }
  }

  /* ══════════════════════════════════════════════════════════
     EVENTO — semestre mudou
     ══════════════════════════════════════════════════════════ */
  document.addEventListener('nexus:semestreChanged', function () {
    _limparContexto();
    _limparHistoricoStorage();
    state.discsCacheadas = {};
    console.log('[NexusAssistant] semestre mudou — contexto e cache limpos.');
  });

  /* ══════════════════════════════════════════════════════════
     MENSAGEM DE BOAS-VINDAS / RESTAURAÇÃO DE HISTÓRICO
     CORREÇÃO A + B: restaura disciplina da chave dedicada,
     sem reprocessar mensagens do usuário nem ativar aguardandoDisc.
     ══════════════════════════════════════════════════════════ */

  function _addWelcomeMessage() {
    const msg = {
      role: 'system',
      text: '⬡  Nexus v1.0 · Interface inicializada',
      time: _getTime(),
    };
    _push(msg);
    NexusUI.renderMessage(msg);
  }

  /**
   * CORREÇÃO A: restaura histórico de mensagens E disciplina ativa
   * de forma independente. Não processa nem reavalia textos do usuário.
   *
   * @returns {boolean} true se histórico restaurado
   */
  function _restaurarHistorico() {
    const msgs = _carregarHistorico();
    if (!msgs || !msgs.length) return false;

    state.messages = msgs;

    // CORREÇÃO A: restaura disciplina da chave dedicada — sem heurística
    const discSalva = _carregarDiscSalva();
    if (discSalva) {
      state.discEscolhida  = discSalva;
      state.aguardandoDisc = false;   // CORREÇÃO B: nunca ativa ao restaurar
      // Nota: conteúdo (índice) NÃO é restaurado — será recarregado na
      // primeira pergunta via _garantirConteudo(). Isso é intencional:
      // o índice é efêmero (reside no NexusSearch, não no sessionStorage).
    }

    msgs.forEach(function (msg) {
      NexusUI.renderMessage(msg);
    });

    const banner = document.getElementById('nexus-messages');
    if (banner) {
      const el = document.createElement('div');
      el.className = 'nexus-msg nexus-system nexus-restore-banner';
      el.innerHTML = '<div class="nexus-msg-bubble">↩ Histórico restaurado</div>';
      banner.appendChild(el);
    }

    return true;
  }

  /* ══════════════════════════════════════════════════════════
     VERIFICAÇÃO DE DEPENDÊNCIAS
     ══════════════════════════════════════════════════════════ */
  function _depsOk() {
    if (typeof window.NexusUI === 'undefined') {
      console.error('[NexusAssistant] NexusUI não encontrado. ia-ui.js carregado?');
      return false;
    }
    if (typeof window.NexusSearch === 'undefined') {
      console.error('[NexusAssistant] NexusSearch não encontrado. ia-search.js carregado?');
      return false;
    }
    if (typeof window.NexusLoader === 'undefined') {
      console.error('[NexusAssistant] NexusLoader não encontrado. ia-loader.js carregado?');
      return false;
    }
    if (typeof window.__nexusCtx === 'undefined') {
      console.error('[NexusAssistant] __nexusCtx não encontrado. global.js expôs a ponte?');
      return false;
    }
    return true;
  }

  /* ══════════════════════════════════════════════════════════
     INICIALIZAÇÃO
     ══════════════════════════════════════════════════════════ */
  function init() {
    if (!_depsOk()) return;
    if (document.getElementById('nexus-fab')) return;

    NexusUI.init({ onSend: _onUserSend });

    const restaurado = _restaurarHistorico();
    if (!restaurado) {
      _addWelcomeMessage();
    }

    // Atualiza indicador com base no estado restaurado (ou null)
    NexusUI.atualizarDiscAtiva(state.discEscolhida ? state.discEscolhida.apelido : null);

    // Se há disciplina restaurada, recarrega índice silenciosamente em background
    if (state.discEscolhida) {
      _garantirConteudo(state.discEscolhida).then(function (ok) {
        if (ok && !restaurado) {
          // Só mostra sugestões se for sessão nova
          const sugestoes = _gerarSugestoes(window.__nexusConteudo);
          if (sugestoes.length > 0) {
            NexusUI.mostrarSugestoes(sugestoes, _onSugestaoClick);
          }
        }
      });
    } else if (!restaurado) {
      // Sessão nova sem disciplina — verifica contexto externo
      const discInicial = _resolverDisc();
      if (discInicial) {
        _garantirConteudo(discInicial).then(function (ok) {
          if (ok) {
            state.discEscolhida = discInicial;
            _salvarDiscAtiva();
            NexusUI.atualizarDiscAtiva(discInicial.apelido);
            const sugestoes = _gerarSugestoes(window.__nexusConteudo);
            if (sugestoes.length > 0) {
              NexusUI.mostrarSugestoes(sugestoes, _onSugestaoClick);
            }
          }
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── API PÚBLICA ─────────────────────────────────────────── */
  window.NexusAssistant = {
    open:   function () { NexusUI.open();   },
    close:  function () { NexusUI.close();  },
    toggle: function () { NexusUI.toggle(); },
  };

}());