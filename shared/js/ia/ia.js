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
 *
 * v2 (UX + bugs) ─────────────────────────────────────────────
 * UX-1  — Seleção inicial sem double-type: init() chama _pedirDisc()
 *          imediatamente quando não há disc ativa, exibindo a lista
 *          antes de qualquer pergunta do usuário.
 * UX-2  — Troca de disciplina via comando explícito apenas:
 *          "disc X" / "/disc X". Heurística _detectarTrocaDisc()
 *          removida — elimina trocas acidentais por palavras curtas.
 *          Durante aguardandoDisc, nomes simples ainda funcionam.
 * UX-3  — _responderAjuda() atualizado com novos comandos.
 * UX-4  — Chips de sugestão com aparência de comando /disc.
 * BUG-1 — _discIndexadaId no state: _garantirConteudo() rastreia qual
 *          disc está indexada e força reindexação ao trocar, eliminando
 *          conteúdo stale no índice e nas sugestões.
 * BUG-2 — _scoreBuscaGlobal() substituído por chamada a
 *          NexusSearch.buscar() na disc atual — busca global agora usa
 *          stemming igual à busca normal.
 * BUG-3 — _restaurarHistorico() remove chips de sugestão stale
 *          antes de renderizar o histórico.
 *
 * UX-5  — Comando /disc reescrito com 4 casos:
 *          Caso 1 (exato)    — /disc redes → carrega imediatamente
 *          Caso 2 (fuzzy)    — /disc pooo  → chip "Você quis dizer?"
 *          Caso 3 (curto)    — /disc des   → pede mais caracteres
 *          Caso 4 (múltiplo) → chips sem trocar automaticamente
 *          _matchDisc() agora é match exato (id, apelido, nome).
 *          _levenshtein() + _fuzzyMatchDiscs() para sugestões.
 *          _chipsDiscs() monta chips para qualquer lista de discs.
 *
 * IA-1  — Integração com NexusWorker (ia-worker.js):
 *          Busca normal agora tenta NexusWorker.perguntar() antes de
 *          _formatarResposta(). Fallback local mantido intacto.
 *          NexusSearch continua sendo a fonte da verdade — a IA recebe
 *          os resultados da busca como contexto, não acessa o índice.
 *          Histórico de sessão gerenciado inteiramente por ia-worker.js.
 *          ia.js não envia state.messages ao worker.
 *
 * IA-2  — Identificação do provedor/modelo exibida discretamente no
 *          rodapé de cada resposta da IA: "─── IA: Groq · Modelo: xxx".
 *          Informação vem do worker — nunca inventada.
 *
 * IA-3  — Sistema de feedback (👍/👎) removido completamente:
 *          FEEDBACK_KEY, _registrarFeedback(), feedbackId e chamadas
 *          a NexusUI.renderFeedback() eliminados de ia.js.
 *
 * FIX-DISC — _detectarComandoTroca(): match exato verificado ANTES do
 *          limite de comprimento. Corrige /disc poo, /disc des, /disc redes
 *          que antes caíam no aviso "Digite mais caracteres".
 *
 * GLOBAL-1 — _detectarPerguntaGlobal(): detecta perguntas estruturais sobre
 *          toda a disciplina (cada aula, resumo da matéria, o que estudar,
 *          assuntos mais importantes, etc.) via padrões regex declarativos.
 *
 * GLOBAL-2 — _montarContextoGlobal(): percorre conteudo.aulas[] diretamente,
 *          retornando { score, texto, aula, secao } no mesmo formato de
 *          NexusSearch.buscar(). ia-worker.js não precisa saber a diferença.
 *          Garante que TODAS as aulas sejam vistas pela IA, não apenas topK.
 *
 * LOC-1   — _detectarLocalizacao(): detecta perguntas de localização de
 *          conteúdo ("em qual aula está X", "onde foi explicado X") via
 *          regex. Extrai o termo a ser localizado.
 *
 * LOC-2   — _responderLocalizacao(): resposta determinística com aula, seção
 *          e trecho real. Não delega localização para a IA inferir.
 *          Usa NexusSearch.buscar(topK=8) para maximizar cobertura.
 *
 * _processar() — passos 6 (localização) e 7 (global) inseridos antes da
 *          busca normal. Perguntas globais bifurcam para _montarContextoGlobal();
 *          perguntas de localização retornam diretamente sem passar pela IA.
 *          Compatibilidade total com busca normal e todos os outros fluxos.
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

  /* ── ESTADO ──────────────────────────────────────────────── */
  // Ponto único de verdade. Nenhum outro arquivo muta este objeto.
  const state = {
    messages:       [],
    typingTimer:    null,
    discEscolhida:  null,   // objeto de disciplina ou null
    aguardandoDisc: false,  // true = aguardando o usuário digitar nome da disc
    processando:    false,
    discsCacheadas: {},     // { discId: trechos[] } — FIX 15
    discIndexadaId: null,   // BUG-1: id da disc cujo conteúdo está no índice atual
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

  function _renderBot(text) {
    const msg = _push({ role: 'bot', text: text, time: _getTime() });
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
            state.discEscolhida  = null;
            state.discIndexadaId = null;
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
   * BUG-1: rastreia state.discIndexadaId para detectar quando o índice
   * pertence a uma disc diferente da solicitada e forçar reindexação.
   * Elimina conteúdo stale no índice ao trocar de disciplina.
   */
  async function _garantirConteudo(disc) {
    const loaderCtx = _montarCtx(disc);
    if (!loaderCtx) return false;

    const conteudo = await NexusLoader.carregar(loaderCtx);
    if (!conteudo) return false;

    // Reindexar se: índice vazio OU índice é de outra disciplina
    if (!NexusSearch.estaIndexado() || state.discIndexadaId !== disc.id) {
      NexusSearch.indexarConteudo(conteudo);
      state.discIndexadaId = disc.id;
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
    state.discIndexadaId = null;
    _salvarDiscAtiva();
    NexusUI.atualizarDiscAtiva(null);
    // IA-1: limpa histórico de sessão junto com o contexto da disciplina
    if (typeof window.NexusWorker !== 'undefined') {
      NexusWorker.limparHistorico();
    }
    console.log('[NexusAssistant] contexto limpo.');
  }

  /* ══════════════════════════════════════════════════════════
     SELEÇÃO DE DISCIPLINA VIA CHAT
     ══════════════════════════════════════════════════════════ */

  /**
   * UX-1: exibe a lista de disciplinas imediatamente ao abrir o chat
   * sem disciplina ativa. Os chips usam aparência de comando /disc.
   */
  function _pedirDisc() {
    const discs = _getDisciplinas();
    if (!discs || !discs.length) {
      _renderBot('Não encontrei disciplinas para o semestre atual.');
      return;
    }

    const lista = discs.map(function (d) {
      return '  /disc ' + d.id + '   — ' + d.nome;
    }).join('\n');

    _renderBot(
      'Disciplinas disponíveis:\n\n' +
      lista + '\n\n' +
      'Digite o nome da disciplina ou use /disc <nome> para selecionar.'
    );

    // Chips clicáveis com aparência de comando /disc
    const chips = discs.map(function (d) {
      return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' };
    });
    NexusUI.mostrarSugestoes(chips, _onSugestaoClick);

    state.aguardandoDisc = true;
  }

  /**
   * CORREÇÃO B: _confirmarDisc() é o único ponto que finaliza o modo
   * aguardandoDisc. Centraliza o carregamento e atualização de estado.
   * BUG-1: usa o conteúdo retornado por NexusLoader diretamente,
   * não window.__nexusConteudo, que pode ser stale de outra disciplina.
   */
  async function _confirmarDisc(disc) {
    NexusSearch.limparIndice();
    NexusLoader.limpar();
    state.discIndexadaId = null;

    state.discEscolhida  = disc;
    state.aguardandoDisc = false;
    _salvarDiscAtiva();

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

    NexusSearch.indexarConteudo(conteudo);
    state.discIndexadaId = disc.id;

    NexusUI.atualizarDiscAtiva(disc.apelido);

    // BUG-1: usa conteudo local — não depende de window.__nexusConteudo
    const sugestoes = _gerarSugestoes(conteudo);

    _renderBot(
      '✓ Disciplina carregada: ' + disc.apelido + '\n\n' +
      'Pode fazer perguntas sobre ' + disc.nome + '.\n' +
      'Para trocar: /disc <nome>  ·  Ajuda: ?'
    );

    if (sugestoes.length > 0) {
      NexusUI.mostrarSugestoes(sugestoes, _onSugestaoClick);
    }

    return true;
  }

  /**
   * Match exato: id, apelido ou nome (normalizado, sem fuzzy).
   * Retorna a disciplina ou null.
   */
  function _matchDisc(texto) {
    const discs = _getDisciplinas();
    if (!discs) return null;
    const norm = _normalizar(texto);
    // Exato por id
    var found = discs.find(function (d) { return _normalizar(d.id) === norm; });
    if (found) return found;
    // Exato por apelido normalizado
    found = discs.find(function (d) { return _normalizar(d.apelido) === norm; });
    if (found) return found;
    // Exato por nome completo normalizado
    found = discs.find(function (d) { return _normalizar(d.nome) === norm; });
    return found || null;
  }

  /**
   * Distância de Levenshtein simplificada (strings até ~20 chars).
   * Usada apenas para fuzzy match de ids de disciplina — não para busca.
   */
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

  /**
   * Retorna as disciplinas que são candidatas a fuzzy match para `query`.
   * Critério: distância de Levenshtein ≤ maxDist em relação ao id ou apelido.
   * Retorna array ordenado por distância (menor = melhor).
   */
  function _fuzzyMatchDiscs(query, maxDist) {
    const discs = _getDisciplinas();
    if (!discs) return [];
    const q = _normalizar(query);
    var candidatos = [];
    discs.forEach(function (d) {
      var distId     = _levenshtein(q, _normalizar(d.id));
      var distAlias  = _levenshtein(q, _normalizar(d.apelido));
      var dist       = Math.min(distId, distAlias);
      if (dist <= maxDist) {
        candidatos.push({ disc: d, dist: dist });
      }
    });
    candidatos.sort(function (a, b) { return a.dist - b.dist; });
    return candidatos.map(function (c) { return c.disc; });
  }

  /**
   * Monta chips de sugestão de disciplina para exibição.
   * @param {Array} discs — lista de disciplinas
   * @returns {Array} chips no formato esperado por NexusUI.mostrarSugestoes
   */
  function _chipsDiscs(discs) {
    return discs.map(function (d) {
      return { label: '/disc ' + d.id, cmd: '/disc ' + d.id, tipo: 'disc' };
    });
  }

  /**
   * UX-2 + UX melhorado: Detecta comando explícito de troca de disciplina.
   * Aceita apenas "disc X" e "/disc X".
   *
   * Retorna um objeto com { tipo, disc?, candidatos?, query }:
   *   tipo 'exato'    → match exato encontrado, disc pronta para carregar
   *   tipo 'fuzzy'    → 1+ candidatos próximos, exibir chips de sugestão
   *   tipo 'multiplo' → 2+ candidatos igualmente próximos
   *   tipo 'curto'    → query tem menos de 4 chars úteis — orientar usuário
   *   tipo 'nenhum'   → nenhum candidato — orientar usuário
   *   null            → não era um comando /disc
   *
   * Casos:
   *   Caso 1 (exato)    — /disc redes  → carrega imediatamente
   *   Caso 2 (fuzzy)    — /disc pooo   → mostra 1 chip "Você quis dizer?"
   *   Caso 3 (curto)    — /disc des    → pede mais caracteres
   *   Caso 4 (múltiplo) — /disc sis    → mostra vários chips sem trocar
   */
  function _detectarComandoTroca(texto) {
    const norm    = _normalizar(texto.trim());
    const PREFIXOS = ['disc ', '/disc '];

    var resto = null;
    for (var i = 0; i < PREFIXOS.length; i++) {
      var pfx = PREFIXOS[i];
      if (norm.startsWith(pfx)) {
        resto = norm.slice(pfx.length).trim();
        break;
      }
    }
    if (resto === null) return null; // não é comando /disc

    const query = resto;

    // Caso 1: match exato (id, apelido, nome) — verificado ANTES do limite de comprimento.
    // Isso garante que ids curtos válidos como "poo", "des", "redes" sejam reconhecidos
    // imediatamente, sem cair no aviso de "Digite mais caracteres".
    const exato = _matchDisc(query);
    if (exato) {
      return { tipo: 'exato', disc: exato, query: query };
    }

    // Caso 3: sem match exato e termo muito curto (< 4 chars) — não tentar fuzzy
    if (query.length < 4) {
      return { tipo: 'curto', query: query };
    }

    // Fuzzy: distância ≤ 2 (1 ou 2 erros de digitação)
    // Para queries mais longas, permite até 3 erros
    const maxDist   = query.length >= 7 ? 3 : 2;
    const candidatos = _fuzzyMatchDiscs(query, maxDist);

    if (!candidatos.length) {
      return { tipo: 'nenhum', query: query };
    }

    if (candidatos.length === 1) {
      return { tipo: 'fuzzy', disc: candidatos[0], candidatos: candidatos, query: query };
    }

    // Caso 4: múltiplos candidatos
    return { tipo: 'multiplo', candidatos: candidatos, query: query };
  }

  // UX-2: _detectarTrocaDisc() (heurística automática) removida.
  // Trocas acidentais por palavras curtas como "redes", "poo" quando
  // já existe disciplina ativa eram a principal fonte de erros de UX.

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
      .map(function (d) { return '  /disc ' + d.id + '   — ' + d.apelido; })
      .join('\n');

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
      'Disciplinas disponíveis:\n' +
      exemplosDiscs + '\n\n' +
      'Qualquer outra mensagem é tratada como busca na disciplina atual.'
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

  /* ══════════════════════════════════════════════════════════
     PERGUNTAS GLOBAIS DA DISCIPLINA ATUAL
     Detecta perguntas estruturais que precisam de todas as aulas,
     não apenas dos trechos mais relevantes pelo score.
     ══════════════════════════════════════════════════════════ */

  /**
   * Detecta perguntas que exigem visão da disciplina inteira.
   * Padrões declarativos — sem if (texto.includes(...)) espalhados.
   *
   * Retorna true quando a pergunta for estrutural (todas as aulas),
   * false quando for pontual (busca normal por similaridade).
   *
   * @param {string} texto — texto original do usuário (não normalizado)
   * @returns {boolean}
   */
  function _detectarPerguntaGlobal(texto) {
    const norm = _normalizar(texto.trim());

    const PADROES = [
      // "cada aula" — cobre "cada aula", "de cada aula", "por aula"
      /\bcada\s+aula\b/,
      /\bpor\s+aula\b/,

      // "todas as aulas" / "todas aulas"
      /\btodas?\s+(?:as\s+)?aulas?\b/,

      // "resumo da disciplina" / "resumo do conteúdo" / "resumo da matéria"
      /\bresumo\s+(?:da?\s+)?(?:disciplina|conteudo|materia|curso)\b/,

      // "conteúdo completo" / "conteúdo da disciplina" / "conteúdo da matéria"
      /\bconteudo\s+(?:completo|da?\s+(?:disciplina|materia|curso))\b/,

      // "assuntos da matéria" / "assuntos da disciplina" / "assuntos das aulas"
      /\bassuntos?\s+(?:da?\s+)?(?:disciplina|materia|curso|aulas?)\b/,

      // "tópicos da disciplina" / "tópicos do curso" / "lista de tópicos"
      /\btopicos?\s+(?:da?\s+)?(?:disciplina|materia|curso|aulas?)\b/,
      /\blista\s+(?:de\s+)?topicos?\b/,

      // "o que estudar" / "o que preciso estudar" / "o que cai na prova"
      /\bo\s+que\s+(?:\w+\s+)?estudar\b/,
      /\bo\s+que\s+(?:cai|vai\s+cair|pode\s+cair)\s+(?:na|em)\s+prova\b/,

      // "para a prova" sozinho raramente é suficiente, mas combinado:
      // "o que é importante para a prova" / "assuntos para a prova"
      /\b(?:assuntos?|topicos?|conteudos?)\s+(?:para\s+(?:a\s+)?prova|importantes?)\b/,

      // "visão geral" / "visão geral da disciplina"
      /\bvisao\s+geral\b/,

      // "me faz um resumo" / "me dá um resumo" / "quero um resumo"
      /\b(?:me\s+(?:faz?|da|de|passa))\s+(?:um\s+)?resumo\b/,

      // "principais assuntos" / "assuntos mais importantes" / "pontos mais importantes"
      /\b(?:principais?|mais\s+importantes?)\s+(?:assuntos?|topicos?|pontos?|conteudos?)\b/,
      /\b(?:assuntos?|topicos?|pontos?|conteudos?)\s+mais\s+importantes?\b/,

      // "o que tem em cada aula" / "o que foi visto em cada aula"
      /\bo\s+que\s+(?:tem|foi\s+visto|estudamos?|aprendemos?|vimos?)\s+(?:em\s+)?cada\s+aula\b/,

      // "mapa da disciplina" / "mapa de estudos"
      /\bmapa\s+(?:da?\s+)?(?:disciplina|materia|estudos?)\b/,
    ];

    for (var i = 0; i < PADROES.length; i++) {
      if (PADROES[i].test(norm)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Monta contexto global da disciplina percorrendo conteudo.aulas[] diretamente.
   *
   * Retorna array no mesmo formato { score, texto, aula, secao } que
   * NexusSearch.buscar() retorna — ia-worker.js não precisa saber a diferença.
   *
   * Estratégia por aula:
   *   - texto principal: ideia_central (se existir)
   *   - texto complementar: títulos das seções concatenados
   * Isso mantém o contexto compacto e estruturado, dentro do CONTEXTO_MAX
   * do ia-worker.js (3000 chars), mesmo para disciplinas com muitas aulas.
   *
   * O score é fixo (100) porque não há ranking — queremos cobertura total,
   * não relevância relativa. ia-worker.js não usa o score para filtrar,
   * apenas para ordenar; todos iguais = ordem original das aulas preservada.
   *
   * @param {object} conteudo — window.__nexusConteudo ou retorno de NexusLoader
   * @returns {{ score: number, texto: string, aula: string, secao: string }[]}
   */
  function _montarContextoGlobal(conteudo) {
    if (!conteudo || !Array.isArray(conteudo.aulas)) return [];

    var resultados = [];

    conteudo.aulas.forEach(function (aula) {
      var nomeAula = aula.aula || 'Aula';

      // Texto principal: ideia central
      var ideia = aula.ideia_central ? aula.ideia_central.trim() : '';

      // Complemento: títulos das seções (visão estrutural da aula)
      var titulosSecoes = '';
      if (Array.isArray(aula.secoes) && aula.secoes.length > 0) {
        titulosSecoes = aula.secoes
          .map(function (s) { return s.titulo || ''; })
          .filter(Boolean)
          .join(' · ');
      }

      // Monta texto combinado: ideia + seções
      var textoAula = ideia;
      if (titulosSecoes) {
        textoAula += (textoAula ? ' | Seções: ' : 'Seções: ') + titulosSecoes;
      }

      if (!textoAula) return; // aula sem conteúdo utilizável

      resultados.push({
        score: 100,
        texto: textoAula,
        aula:  nomeAula,
        secao: 'Visão Geral',
      });
    });

    console.log('[NexusAssistant] contexto global montado: ' + resultados.length + ' aulas.');
    return resultados;
  }

  /* ══════════════════════════════════════════════════════════
     MAPA ESTRUTURAL DA DISCIPLINA — GLOBAL-3
     Gera visão estrutural compacta para perguntas de navegação
     (sequência, plano de estudo, ordem, pré-requisitos).
     Cada entrada = 1 aula com número, nome e títulos de seções.
     Mantém o contexto dentro do CONTEXTO_MAX mesmo para
     disciplinas com muitas aulas (~100 chars/aula).
     ══════════════════════════════════════════════════════════ */

  /**
   * Monta mapa estrutural percorrendo conteudo.aulas[].
   * Retorna array no mesmo formato { score, texto, aula, secao }
   * de NexusSearch.buscar() — ia-worker.js não precisa saber a diferença.
   *
   * @param {object} conteudo — window.__nexusConteudo
   * @returns {{ score: number, texto: string, aula: string, secao: string }[]}
   */
  function _montarMapaDisc(conteudo) {
    if (!conteudo || !Array.isArray(conteudo.aulas)) return [];

    return conteudo.aulas.map(function (aula, i) {
      var secoes = '';
      if (Array.isArray(aula.secoes) && aula.secoes.length > 0) {
        secoes = aula.secoes
          .map(function (s) { return s.titulo || ''; })
          .filter(Boolean)
          .join(', ');
      }

      // Mapa estrutural: apenas número, nome e seções.
      // Ideia central excluída — inflava o contexto (~600 chars/aula) a ponto
      // de truncar aulas do final. Sem ela: ~200 chars/aula, todas as aulas chegam.
      var texto = 'Aula ' + (i + 1);
      if (aula.aula) texto += ' — ' + aula.aula;
      if (secoes) texto += ' | Seções: ' + secoes;

      return {
        score: 100,
        texto: texto,
        aula:  aula.aula || ('Aula ' + (i + 1)),
        secao: 'Mapa',
      };
    });
  }

  /* ══════════════════════════════════════════════════════════
     DETECÇÃO DE PERGUNTAS DE NAVEGAÇÃO — GLOBAL-4
     Perguntas sobre sequência, plano, ordem e pré-requisitos.
     Usa _montarMapaDisc() em vez de busca por similaridade.
     Separado de _detectarPerguntaGlobal() para clareza.
     ══════════════════════════════════════════════════════════ */

  /**
   * Detecta perguntas que precisam do mapa estrutural da disciplina:
   * sequência de estudo, ordem das aulas, plano, por onde começar, etc.
   *
   * @param {string} texto
   * @returns {boolean}
   */
  function _detectarPerguntaNavegacao(texto) {
    var norm = _normalizar(texto.trim());

    var PADROES = [
      // por onde começar / onde começo
      /\bpor\s+onde\s+(?:comecar|comeco|inicio|devo\s+comecar)\b/,
      /\bonde\s+(?:comecar|comeco|devo\s+comecar)\b/,

      // qual aula estudar primeiro / qual aula vem antes / depois
      /\bqual\s+aula\s+(?:estudar|ver|fazer|comecar)\s+(?:primeiro|antes)\b/,
      /\bqual\s+aula\s+(?:vem|fica|fica)\s+(?:depois|antes|apos)\b/,
      /\bqual\s+(?:e\s+a\s+)?(?:primeira|proxima|ultima)\s+aula\b/,

      // sequência / ordem das aulas
      /\b(?:sequencia|ordem)\s+(?:das?\s+)?(?:aulas?|estudos?|conteudos?)\b/,
      /\bsequencia\s+(?:de\s+)?estudo\b/,
      /\bem\s+que\s+ordem\b/,

      // plano de estudo / cronograma
      /\bplano\s+(?:de\s+)?(?:estudo|estudos|revisao|estudo)\b/,
      /\bcronograma\s+(?:de\s+)?(?:estudo|estudos|revisao)\b/,
      /\bmonte\s+(?:um\s+)?(?:plano|cronograma|roteiro|guia)\b/,
      /\bcrie\s+(?:um\s+)?(?:plano|cronograma|roteiro|guia)\b/,
      /\bfaca\s+(?:um\s+)?(?:plano|cronograma|roteiro|guia)\b/,

      // quais aulas dependem / precisam / requerem
      /\bquais?\s+aulas?\s+(?:dependem|precisam|requerem|necessitam)\b/,
      /\bquais?\s+(?:sao\s+os?\s+)?(?:prerequisitos?|pre-?requisitos?)\b/,
      /\bo\s+que\s+preciso\s+(?:saber|estudar|ver)\s+antes\b/,

      // começar pelos fundamentos / básico primeiro
      /\b(?:comecar|iniciar)\s+(?:pelos?\s+)?(?:basico|fundamentos?|inicio|começo)\b/,

      // qual é a sequência / ordem recomendada
      /\bsequencia\s+(?:recomendada|ideal|certa|correta)\b/,
      /\borden?\s+(?:recomendada?|ideal|certo|correta?)\b/,

      // todas as aulas + navegação (não conteúdo)
      /\bquais?\s+(?:sao\s+)?(?:todas?\s+(?:as\s+)?)?aulas?\s+(?:da\s+)?disciplina\b/,
      /\bquantas\s+aulas?\b/,
      /\bliste\s+(?:as\s+)?(?:todas\s+(?:as\s+)?)?aulas?\b/,
      /\bquais?\s+(?:sao\s+)?as\s+aulas\b/,
    ];

    for (var i = 0; i < PADROES.length; i++) {
      if (PADROES[i].test(norm)) {
        return true;
      }
    }

    return false;
  }

  /* ══════════════════════════════════════════════════════════
     PERGUNTAS DE LOCALIZAÇÃO DE CONTEÚDO
     "em qual aula está X", "onde foi explicado X", etc.
     Resposta determinística — não deixa a IA inferir localização.
     ══════════════════════════════════════════════════════════ */

  /**
   * Detecta perguntas de localização de conteúdo.
   * Retorna o termo a ser localizado (string) ou null.
   *
   * @param {string} texto
   * @returns {string|null} termo a localizar, ou null
   */
  function _detectarLocalizacao(texto) {
    const norm = _normalizar(texto.trim());

    const PADROES = [
      // "em qual aula está/fica/aparece X"
      /^em\s+qual\s+aula\s+(?:esta|fica|aparece|tem|fala(?:\s+sobre)?|explica(?:\s+sobre)?)\s+(.+)$/,

      // "em qual aula (eu) vejo/encontro/estudo X"
      /^em\s+qual\s+aula\s+(?:eu\s+)?(?:vejo|encontro|estudo|aprendo)\s+(.+)$/,

      // "onde está/foi explicado/fica X"
      /^onde\s+(?:esta|foi\s+explicado|fica|aparece|tem|fala(?:\s+sobre)?)\s+(.+)$/,

      // "onde eu encontro/vejo X"
      /^onde\s+(?:eu\s+)?(?:encontro|vejo|estudo|aprendo)\s+(.+)$/,

      // "qual seção/aula fala sobre X" / "qual seção trata de X"
      /^qual\s+(?:secao|aula|parte)\s+(?:fala\s+(?:sobre|de)|trata\s+(?:de|sobre)|explica|tem)\s+(.+)$/,

      // "em qual conteúdo/parte/seção vimos X"
      /^em\s+qual\s+(?:conteudo|parte|secao)\s+(?:(?:nos\s+)?vimos|estudamos|aprendemos|foi\s+(?:explicado|visto))\s+(.+)$/,

      // "X foi visto em qual aula" / "X é ensinado em qual seção"
      /^(.+)\s+(?:foi\s+(?:visto|explicado|abordado|estudado)|aparece|esta)\s+em\s+qual\s+(?:aula|secao|parte)[\?]?$/,

      // "onde vimos X" / "onde estudamos X"
      /^onde\s+(?:(?:nos\s+)?vimos|estudamos|aprendemos|foi\s+(?:visto|explicado))\s+(.+)$/,
    ];

    for (var i = 0; i < PADROES.length; i++) {
      var m = norm.match(PADROES[i]);
      if (m && m[1] && m[1].trim().length >= 2) {
        return m[1].trim();
      }
    }

    return null;
  }

  /**
   * Executa busca de localização e formata resposta determinística.
   * Usa NexusSearch.buscar() para encontrar os trechos, mas a resposta
   * informa exatamente em qual aula e seção o conteúdo aparece —
   * não repassa para a IA inferir.
   *
   * @param {string} termoLocalizar — termo extraído por _detectarLocalizacao()
   * @param {string} nomeDisc       — apelido da disciplina ativa
   * @returns {string} resposta formatada com aula, seção e trecho
   */
  function _responderLocalizacao(termoLocalizar, nomeDisc) {
    // Busca com topK maior para maximizar cobertura de ocorrências
    var resultados = NexusSearch.buscar(termoLocalizar, { topK: 8, minScore: MIN_SCORE });

    if (!resultados.length) {
      return (
        'Não encontrei "' + termoLocalizar + '" em nenhuma aula de ' + nomeDisc + '.\n\n' +
        'Dicas:\n' +
        '  • Tente um termo mais simples ou sinônimo\n' +
        '  • Verifique se o assunto pertence a esta disciplina'
      );
    }

    // Agrupa por aula para evitar repetição e mostrar todas as ocorrências
    var porAula = {};
    var aulasOrdem = [];

    resultados.forEach(function (r) {
      var chave = r.aula || 'Geral';
      if (!porAula[chave]) {
        porAula[chave] = [];
        aulasOrdem.push(chave);
      }
      porAula[chave].push(r);
    });

    var linhas = [
      '📍 "' + termoLocalizar + '" aparece em ' + nomeDisc + ':\n',
    ];

    aulasOrdem.forEach(function (nomeAula) {
      var ocorrencias = porAula[nomeAula];

      // Agrupa por seção dentro da aula
      var secoes = [];
      var secoesVistas = {};
      ocorrencias.forEach(function (r) {
        var s = r.secao || '';
        if (s && !secoesVistas[s]) {
          secoesVistas[s] = true;
          secoes.push(s);
        }
      });

      linhas.push('📖 ' + nomeAula);
      if (secoes.length > 0) {
        linhas.push('   📂 Seção: ' + secoes.join(' · '));
      }

      // Mostra o trecho de maior score como evidência
      var melhor = ocorrencias[0];
      var trecho = _truncarNaPalavra(melhor.texto, 200);
      linhas.push('   "' + trecho + '"');
      linhas.push('');
    });

    linhas.push('─── ' + nomeDisc);
    return linhas.join('\n').trim();
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

  /**
   * BUG-2: para a disc atual já indexada, delega para NexusSearch.buscar()
   * que inclui stemming. Para discs não indexadas, usa matching simples
   * (normalizado) — suficiente para busca global cross-disciplina.
   */
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

      // BUG-2: disc atual já indexada → usa NexusSearch.buscar (com stemming)
      if (discAtual && disc.id === discAtual.id && NexusSearch.estaIndexado() && state.discIndexadaId === discAtual.id) {
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

  /**
   * Sugestões de conteúdo desativadas — chips de aula não são exibidos.
   * Os únicos chips ativos são os /disc gerados por _pedirDisc().
   */
  function _gerarSugestoes(_conteudo) {
    return [];
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
    if (!resultados.length) {
      return (
        'Nenhum resultado encontrado para "' + pergunta + '" em ' + nomeDisc + '.\n\n' +
        'Dicas:\n' +
        '  • Tente termos mais simples\n' +
        '  • Verifique se a disciplina correta está selecionada\n' +
        '  • Digite "ajuda" para ver opções'
      );
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

    return linhas.join('\n').trim();
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
   * Ordem de verificação em _processar():
   *
   *   1. ajuda             (sempre respondida, independente de estado)
   *   2. comando disc X    (prioridade máxima — cancela aguardandoDisc se necessário)
   *   3. aguardandoDisc    (usuário deve selecionar disciplina antes de qualquer coisa)
   *   4. resumo aula       (só com disciplina ativa)
   *   5. busca global      (qualquer estado com disc)
   *   6. busca normal      (disciplina ativa)
   *
   * UX-2: heurística de troca automática removida. Troca somente via
   * comando explícito "disc X" / "/disc X".
   */
  async function _processar(texto) {
    try {

      /* ── 1. AJUDA ── */
      if (_ehPedidoAjuda(texto)) {
        _responderAjuda(_resolverDisc());
        return;
      }

      /* ── 2. COMANDO EXPLÍCITO DE TROCA (prioridade máxima) ── */
      const resultadoCmd = _detectarComandoTroca(texto);
      if (resultadoCmd !== null) {
        // Todos os sub-casos de /disc cancelam aguardandoDisc
        state.aguardandoDisc = false;

        // Caso 3: query muito curta
        if (resultadoCmd.tipo === 'curto') {
          const discs      = _getDisciplinas() || [];
          const exemplos   = discs.slice(0, 4).map(function (d) { return '/disc ' + d.id; }).join('  ');
          _renderBot(
            'Digite mais caracteres para localizar a disciplina.\n\n' +
            'Exemplos:\n  ' + exemplos
          );
          NexusUI.mostrarSugestoes(_chipsDiscs(discs.slice(0, 4)), _onSugestaoClick);
          return;
        }

        // Caso (nenhum): sem candidatos
        if (resultadoCmd.tipo === 'nenhum') {
          const discs    = _getDisciplinas() || [];
          const exemplos = discs.slice(0, 4).map(function (d) { return '/disc ' + d.id; }).join('  ');
          _renderBot(
            'Disciplina não encontrada: "' + resultadoCmd.query + '".\n\n' +
            'Disciplinas disponíveis:\n  ' + exemplos
          );
          NexusUI.mostrarSugestoes(_chipsDiscs(discs.slice(0, 4)), _onSugestaoClick);
          return;
        }

        // Caso 2: fuzzy — 1 candidato próximo, não troca automaticamente
        if (resultadoCmd.tipo === 'fuzzy') {
          const sugerida = resultadoCmd.disc;
          _renderBot('Você quis dizer:');
          NexusUI.mostrarSugestoes(_chipsDiscs([sugerida]), _onSugestaoClick);
          return;
        }

        // Caso 4: múltiplos candidatos — não troca automaticamente
        if (resultadoCmd.tipo === 'multiplo') {
          _renderBot('Encontrei mais de uma opção:');
          NexusUI.mostrarSugestoes(_chipsDiscs(resultadoCmd.candidatos), _onSugestaoClick);
          return;
        }

        // Caso 1: match exato — troca imediatamente
        const discExata = resultadoCmd.disc;
        if (state.discEscolhida && discExata.id === state.discEscolhida.id) {
          _renderBot('Você já está em ' + discExata.apelido + '. Pode fazer perguntas!');
          return;
        }

        _limparContexto();
        await _confirmarDisc(discExata);
        return;
      }

      /* ── 3. MODO: aguardando escolha de disciplina ── */
      if (state.aguardandoDisc) {
        const disc = _matchDisc(texto);
        if (!disc) {
          const discs    = _getDisciplinas() || [];
          const exemplos = discs.slice(0, 4).map(function (d) { return '/disc ' + d.id; }).join('  ');
          _renderBot(
            'Não reconheci "' + texto.trim() + '".\n\n' +
            'Use /disc <nome> para selecionar. Exemplos:\n  ' + exemplos
          );
          NexusUI.mostrarSugestoes(_chipsDiscs(discs.slice(0, 4)), _onSugestaoClick);
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

      /* ── 6. LOCALIZAÇÃO DE CONTEÚDO ── */
      // Perguntas como "em qual aula está X", "onde foi explicado X".
      // Resposta determinística — não delega localização para a IA inferir.
      const termoLocalizar = _detectarLocalizacao(texto);
      if (termoLocalizar !== null) {
        const okLoc = await _garantirConteudo(disc);
        if (!okLoc) {
          _renderBot('Não consegui carregar o conteúdo de ' + disc.apelido + '. Tente novamente.');
          return;
        }
        NexusUI.atualizarDiscAtiva(disc.apelido);
        _renderBot(_responderLocalizacao(termoLocalizar, disc.apelido));
        return;
      }

      /* ── 7. CLASSIFICAÇÃO DO TIPO DE PERGUNTA — GLOBAL-3/4 ── */
      // Três caminhos mutuamente exclusivos:
      //   navegacao → mapa estrutural (sequência, plano, ordem, pré-requisitos)
      //   global    → contexto completo de conteúdo (resumo, assuntos de cada aula)
      //   normal    → busca por similaridade via NexusSearch (padrão)
      const ehNavegacao = _detectarPerguntaNavegacao(texto);
      const ehGlobal    = !ehNavegacao && _detectarPerguntaGlobal(texto);

      /* ── 8. CARREGAMENTO E BUSCA ── */
      const ok = await _garantirConteudo(disc);
      if (!ok) {
        _renderBot('Não consegui carregar o conteúdo de ' + disc.apelido + '. Tente novamente.');
        return;
      }

      NexusUI.atualizarDiscAtiva(disc.apelido);

      // Seleciona contexto adequado ao tipo de pergunta.
      // GLOBAL-3: navegação usa mapa estrutural (aulas em sequência, títulos de seções).
      // GLOBAL-2: global usa contexto completo de conteúdo (ideia central + seções).
      // Normal  : busca por similaridade via NexusSearch (comportamento original).
      var tipoContexto;
      var resultados;

      if (ehNavegacao) {
        tipoContexto = 'estrutura';
        resultados   = _montarMapaDisc(window.__nexusConteudo);
        console.log('[NexusAssistant] contexto: estrutura (' + resultados.length + ' aulas)');
      } else if (ehGlobal) {
        tipoContexto = 'global';
        resultados   = _montarContextoGlobal(window.__nexusConteudo);
        console.log('[NexusAssistant] contexto: global (' + resultados.length + ' aulas)');
      } else {
        tipoContexto = 'conteudo';
        resultados   = NexusSearch.buscar(texto, { topK: TOP_K, minScore: MIN_SCORE });
      }

      // IA-1: tenta resposta via IA externa antes do fallback local.
      // NexusWorker recebe a pergunta + resultados + tipoContexto.
      // Se falhar (rede, worker fora, desabilitado), cai no fallback local.
      if (typeof window.NexusWorker !== 'undefined') {
        let respostaIA = null;
        try {
          respostaIA = await NexusWorker.perguntar({
            pergunta:      texto,
            resultados:    resultados,
            disciplina:    disc.id,
            tipoContexto:  tipoContexto,
          });
        } catch (errIA) {
          console.warn('[NexusAssistant] NexusWorker.perguntar() lançou exceção inesperada:', errIA);
        }

        if (respostaIA) {
          // Monta rodapé discreto com identificação do provedor e modelo
          let textoFinal = respostaIA.texto;
          if (respostaIA.fonte || respostaIA.modelo) {
            const linhaFonte  = respostaIA.fonte  ? 'IA: ' + respostaIA.fonte                   : '';
            const linhaModelo = respostaIA.modelo ? 'Modelo: ' + respostaIA.modelo               : '';
            const partes = [linhaFonte, linhaModelo].filter(Boolean).join('  ·  ');
            textoFinal += '\n─── ' + partes;
          }
          _renderBot(textoFinal);
          return;
        }

        // Falhou — avisa no console e usa fallback local abaixo
        console.warn('[NexusAssistant] IA indisponível — fallback local ativado.');
      }

      // Fallback local: formatação estruturada por aula/seção (comportamento original)
      const textoResposta = _formatarResposta(texto, resultados, disc.apelido);
      _renderBot(textoResposta);

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

    // BUG-3: remove chips de sugestão da sessão anterior antes de renderizar
    const msgsEl = document.getElementById('nexus-messages');
    if (msgsEl) {
      const stale = msgsEl.querySelector('.nexus-sugestoes');
      if (stale) stale.remove();
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
     RESET DE CHAT
     Limpa tudo: histórico, disciplina, índice, cache.
     Equivale a um "novo chat" sem recarregar a página.
     ══════════════════════════════════════════════════════════ */

  function _resetarChat() {
    // Limpa estado interno
    _limparContexto();
    _limparHistoricoStorage();
    state.messages       = [];
    state.discsCacheadas = {};
    state.processando    = false;
    if (state.typingTimer) {
      clearTimeout(state.typingTimer);
      state.typingTimer = null;
    }

    // Limpa DOM do chat
    const msgsEl = document.getElementById('nexus-messages');
    if (msgsEl) msgsEl.innerHTML = '';
    NexusUI.hideTyping();
    _setInputBloqueado(false);

    // Recomeça como sessão nova
    _addWelcomeMessage();
    _pedirDisc();

    console.log('[NexusAssistant] chat resetado.');
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
    // IA-1: NexusWorker é opcional — se ausente, o sistema funciona só com busca local.
    if (typeof window.NexusWorker === 'undefined') {
      console.warn('[NexusAssistant] NexusWorker não encontrado. ia-worker.js carregado? Funcionando em modo somente-busca.');
    }
    return true;
  }

  /* ══════════════════════════════════════════════════════════
     INICIALIZAÇÃO
     ══════════════════════════════════════════════════════════ */
  function init() {
    if (!_depsOk()) return;
    if (document.getElementById('nexus-fab')) return;

    NexusUI.init({ onSend: _onUserSend, onReset: _resetarChat });

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
          const loaderCtx = _montarCtx(state.discEscolhida);
          if (loaderCtx) {
            NexusLoader.carregar(loaderCtx).then(function (c) {
              const sugestoes = _gerarSugestoes(c);
              if (sugestoes.length > 0) {
                NexusUI.mostrarSugestoes(sugestoes, _onSugestaoClick);
              }
            });
          }
        }
      });
    } else if (!restaurado) {
      // UX-1: sessão nova sem disciplina ativa — verifica contexto externo
      const discInicial = _resolverDisc();
      if (discInicial) {
        // Disciplina injetada pelo contexto externo (página de resumo etc.)
        const loaderCtx = _montarCtx(discInicial);
        if (loaderCtx) {
          NexusLoader.carregar(loaderCtx).then(function (conteudo) {
            if (conteudo) {
              NexusSearch.indexarConteudo(conteudo);
              state.discIndexadaId = discInicial.id;
              state.discEscolhida  = discInicial;
              _salvarDiscAtiva();
              NexusUI.atualizarDiscAtiva(discInicial.apelido);
              const sugestoes = _gerarSugestoes(conteudo);
              if (sugestoes.length > 0) {
                NexusUI.mostrarSugestoes(sugestoes, _onSugestaoClick);
              }
            }
          });
        }
      } else {
        // UX-1: sem disc de contexto externo → mostrar lista imediatamente
        _pedirDisc();
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