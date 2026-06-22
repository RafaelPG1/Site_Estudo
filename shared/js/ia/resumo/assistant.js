/**
 * NEXUS — shared/js/ia/resumo/assistant.js  v3.7
 *
 * Orquestrador do sistema de IA para Resumos.
 *
 * ── MUDANÇAS v3.7 (correção de bugs da árvore de versões) ──────
 *
 *   Bug 1 — troca de versão durante geração da IA
 *     _onTrocarVersao() não verificava state.processando. Era possível
 *     trocar de ramo enquanto uma resposta da IA ainda estava a
 *     caminho (resposta a uma mensagem normal OU a uma edição). Quando
 *     a resposta chegava, _renderBot()/_push() a anexava ao FINAL do
 *     state.messages atual — que podia já ser um ramo diferente do que
 *     originou a pergunta — produzindo perguntas sem resposta, respostas
 *     sem pergunta e, em casos repetidos, ramos corrompidos.
 *     CORREÇÃO: adicionado `if (state.processando) return;` no início
 *     de _onTrocarVersao(), espelhando a guarda já existente em
 *     _onUserSend() e _onEditarMensagem().
 *
 *   Bug 2 — histórico interno do NexusWorker não acompanhava a árvore
 *     core/worker.js mantém seu próprio histórico de turnos (_historico),
 *     independente de state.messages/msg.tree, usado para montar o
 *     contexto multi-turno enviado à IA. Nem _onTrocarVersao() nem
 *     _onEditarMensagem() chamavam NexusWorker.limparHistorico() /
 *     restaurarHistorico() — então, ao voltar para uma versão antiga e
 *     perguntar algo novo, a IA recebia contexto de turnos pertencentes
 *     a um ramo que não estava mais ativo/visível (vazamento de
 *     contexto entre ramos).
 *     CORREÇÃO: depois que state.messages é reconstruído para refletir
 *     o ramo ativo (em _onTrocarVersao()) ou a linha cortada pela
 *     edição (em _onEditarMensagem(), antes de processar a nova
 *     pergunta), chama-se NexusWorker.limparHistorico() seguido de
 *     NexusWorker.restaurarHistorico(state.messages) — mesmo padrão já
 *     usado em _restaurarSessao()/init() ao recarregar a página.
 *
 *   Nenhuma mudança em UI, layout, estilos ou na estrutura/algoritmo
 *   da árvore de versões em si (msg.tree, _criarNode, _garantirTree,
 *   _fecharRamoAtivo, _abrirRamoNode permanecem inalterados).
 *
 * ── MUDANÇAS v3.8 (correção do bug crítico de F5 — restore) ─────
 *
 *   Bug 3 — restore abortava silenciosamente por timing de __nexusCtx
 *     _restaurarSessao() era chamada dentro de initUI(), mas dependia
 *     de window.__nexusCtx (via _carregarDiscSalva() → _getDisciplinas()
 *     → _getCtxBridge()) para resolver a disciplina salva em
 *     sessionStorage. Como __nexusCtx só é garantido a partir de
 *     _depsConteudoOk() (verificado em init(), chamado separadamente e
 *     mais tarde que initUI()), era possível initUI() rodar ANTES de
 *     __nexusCtx existir. Nesse caso _carregarDiscSalva() retornava
 *     null, _restaurarSessao() abortava sem nunca chamar
 *     NexusHistory.carregar() — e como não havia retry, o histórico
 *     salvo (com toda a árvore de versões) nunca era lido de volta,
 *     mesmo estando intacto no localStorage.
 *     CORREÇÃO: _restaurarSessao() agora verifica explicitamente se
 *     __nexusCtx está disponível ANTES de tentar resolver a disciplina
 *     salva. Se não estiver, marca state.pendingRestore = true e loga
 *     um warning (em vez de abortar silenciosamente). init() — que já
 *     garante __nexusCtx disponível via _depsConteudoOk() — verifica
 *     state.pendingRestore e, se true, chama _tentarRestaurarPendente()
 *     para repetir a tentativa de restauração antes de decidir entre
 *     carregar o conteúdo da disciplina restaurada ou mostrar as
 *     boas-vindas.
 *
 *   Bug 4 — chaveHistorico nunca definida no fluxo automático
 *     _resolverDisc() resolvia a disciplina ativa via
 *     ctx.getDisciplinaAtual() (fallback automático, sem o usuário
 *     digitar /disc) e retornava o objeto encontrado, mas NUNCA
 *     atribuía state.discEscolhida nem state.chaveHistorico. Como
 *     _salvarHistorico() é um no-op quando state.chaveHistorico é
 *     null, toda mensagem trocada nesse fluxo — incluindo árvores de
 *     versão criadas por edição — nunca era persistida no
 *     localStorage. Não havia nada para restaurar no F5 seguinte
 *     porque nada tinha sido salvo.
 *     CORREÇÃO: ao resolver a disciplina automaticamente,
 *     _resolverDisc() agora persiste a escolha exatamente como
 *     _confirmarDisc() faz no fluxo manual: define
 *     state.discEscolhida, monta e define state.chaveHistorico, e
 *     grava a disciplina ativa em sessionStorage via
 *     _salvarDiscAtiva() — garantindo que a própria sessionStorage
 *     (usada por _carregarDiscSalva() no próximo F5) também reflita a
 *     disciplina resolvida automaticamente.
 *
 *   Escopo desta correção: exclusivamente inicialização, restauração
 *   de sessão e definição da chave de histórico. Nenhuma mudança na
 *   estrutura/algoritmo da árvore de versões (msg.tree, _criarNode,
 *   _garantirTree, _fecharRamoAtivo, _abrirRamoNode), na renderização
 *   da UI (core/ui.js não foi tocado) ou no NexusWorker.
 *
 * ── MUDANÇAS v3.6 (árvore de conversa) ─────────────────────────
 *
 *   Problema observado: o sistema de versões era uma LISTA linear de
 *   snapshots (texto/resposta/rodape/time). Cada versão guardava apenas
 *   a sua própria pergunta+resposta, mas não guardava as mensagens que
 *   o usuário enviasse DEPOIS dela. Resultado: se o usuário voltasse para
 *   a Versão 1 e mandasse uma mensagem de acompanhamento ("resuma por
 *   favor"), essa nova mensagem era empurrada para o array linear de
 *   state.messages e passava a aparecer em TODAS as versões, já que o
 *   array não sabia a qual "ramo" ela pertencia.
 *
 *   CORREÇÃO: cada mensagem editável agora tem uma ÁRVORE de versões
 *   (msg.tree), não uma lista. Cada nó da árvore guarda, além do
 *   snapshot de sempre (texto/resposta/rodape/time), o seu próprio
 *   sub-histórico de conversa (node.ramo) — as mensagens subsequentes
 *   criadas enquanto aquele nó estava ativo. Trocar de versão agora:
 *
 *     1. "Fecha" o ramo atual: tudo que está em state.messages depois
 *        da mensagem editável é cortado (deep clone) e guardado dentro
 *        do nó que está deixando de ser ativo (_fecharRamoAtivo).
 *     2. "Abre" o ramo escolhido: o sub-histórico salvo no nó de destino
 *        é expandido de volta para state.messages (_abrirRamoNode).
 *     3. Rerenderiza tudo.
 *
 *   Isso garante que mensagens de acompanhamento pertencem exclusivamente
 *   ao ramo (versão) onde foram criadas, e nunca aparecem em outro ramo.
 *
 *   MIGRAÇÃO: históricos antigos salvos como msg.versions[] (lista linear,
 *   sem árvore) são convertidos para msg.tree na primeira leitura, via
 *   _migrarVersionsParaTree(). A conversão produz uma árvore "degenerada"
 *   em lista — cada versão antiga se torna um nó cujo único filho é a
 *   próxima versão antiga — preservando 100% o comportamento exibido
 *   anteriormente (sem ramos extras, já que o conceito não existia).
 *   Depois da primeira migração, msg.versions é removido e msg.tree passa
 *   a ser a única fonte de verdade; tudo é persistido por _salvarHistorico
 *   como antes (window.NexusHistory.salvar), sem mudança de formato de
 *   storage (continua sendo o array state.messages serializado).
 *
 * ── MUDANÇAS v3.5 (correção de versionamento) ─────────────────
 *
 *   Problema observado: ao editar uma mensagem múltiplas vezes
 *   (3+ versões) ou ao restaurar do localStorage, versões anteriores
 *   exibiam a resposta da versão mais recente.
 *
 *   Causas raiz identificadas e corrigidas:
 *
 *   1. SHALLOW COPY do rodapé em _onEditarMensagem:
 *      versions[0].rodape = botExistente.rodape
 *      Como rodape é um objeto { linha1, linha2 }, versão 0 e o objeto
 *      bot em state.messages compartilhavam a mesma referência.
 *      CORREÇÃO: deep copy via _clonarRodape() em toda atribuição de rodape.
 *
 *   2. AUSÊNCIA DE TIME por versão:
 *      _onTrocarVersao usava botAtual.time (tempo do bot atual na tela),
 *      e após múltiplas trocas o time exibido era sempre o da última versão.
 *      CORREÇÃO: cada versão armazena { texto, resposta, rodape, time }.
 *      _renderBot salva o horário da resposta na versão correspondente.
 *      _onTrocarVersao usa versao.time para restaurar corretamente.
 *
 *   3. _onTrocarVersao não tratava ausência de bot corrente:
 *      Se state.messages[msgIndex+1] não existia ou tinha role diferente
 *      de 'bot', a substituição era ignorada silenciosamente.
 *      CORREÇÃO: se não há bot atual mas a versão tem resposta salva,
 *      insere um novo objeto bot em state.messages na posição correta.
 *
 *   4. rodape em _onTrocarVersao era reutilizado sem clonar:
 *      versao.rodape era atribuído diretamente ao novo objeto bot.
 *      Se alguém mutasse esse objeto, a versão salva seria corrompida.
 *      CORREÇÃO: _clonarRodape() em toda construção de objeto bot novo.
 *
 * ── MUDANÇAS v3.4 ─────────────────────────────────────────────
 *   (ver cabeçalho da versão anterior)
 *
 * Depende de:
 *   - core/ctx.js, core/context.js, core/history.js, core/ui.js
 *   - core/loader.js, core/worker.js, core/text-utils.js
 *   - resumo/search.js, window.__nexusCtx
 *
 * API pública: window.NexusAssistant
 */

(function () {
  'use strict';

  var REPLY_DELAY_MS     = 900;
  var TOP_K              = 8;
  var MIN_SCORE          = 15;
  var SESSION_DISC_KEY   = 'nexus_resumo_disc_ativa';
  var MENSAGEM_MAX_CHARS = 4000;

  var APS_POR_PERIODO = {
    '2026.1': ['AP1', 'AP2'],
    '2026.2': ['AP1', 'AP2'],
  };

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
    chaveHistorico:  null,
    // v3.8 — true quando _restaurarSessao() não conseguiu rodar por
    // falta de window.__nexusCtx no momento em que initUI() foi chamada.
    // init() verifica esta flag e tenta novamente assim que o contexto
    // estiver garantido (_depsConteudoOk()). Ver _tentarRestaurarPendente().
    pendingRestore:  false,
  };

  var _versaoEditando = null; // { msgIndex, nodeId } | null

  var _pipelineConteudoAtivo = false;

  /* ══════════════════════════════════════════════════════════
     UTILITÁRIO: DEEP COPY DE RODAPÉ
     Garante que nenhuma versão compartilhe referência com outra.
  ══════════════════════════════════════════════════════════ */

  function _clonarRodape(rodape) {
    if (!rodape) return null;
    return { linha1: rodape.linha1 || null, linha2: rodape.linha2 || null };
  }

  /* ══════════════════════════════════════════════════════════
     ÁRVORE DE CONVERSA (sistema de versões)
     ──────────────────────────────────────────────────────────
     Estrutura por mensagem editável (msg.tree):

       msg.tree = {
         nodes:    { [nodeId]: NodeVersao },
         rootId:   string,
         activeId: string,
       }

       NodeVersao = {
         id:          string,
         parentId:    string | null,
         childrenIds: string[],
         texto:       string,        // pergunta do usuário nesta versão
         resposta:    string | null, // resposta da IA nesta versão
         rodape:      {linha1,linha2} | null,
         time:        string | null, // horário da resposta
         ramo:        object[],      // mensagens subsequentes deste ramo
       }

     "ramo" é o sub-histórico de conversa que existe SOMENTE enquanto
     este nó está ativo. Ele é deep-clonado para dentro/fora de
     state.messages a cada troca de versão (_fecharRamoAtivo /
     _abrirRamoNode), nunca compartilhando referência com o que está
     visível na tela.
  ══════════════════════════════════════════════════════════ */

  var _seqNodeId = 0;
  function _novoNodeId() {
    _seqNodeId += 1;
    return 'v' + Date.now().toString(36) + '_' + _seqNodeId;
  }

  function _clonarMensagensProfundo(msgs) {
    if (!Array.isArray(msgs)) return [];
    try {
      return JSON.parse(JSON.stringify(msgs));
    } catch (e) {
      return [];
    }
  }

  function _criarNode(parentId, texto, resposta, rodape, time) {
    return {
      id: _novoNodeId(),
      parentId: parentId,
      childrenIds: [],
      texto: texto,
      resposta: (resposta === undefined) ? null : resposta,
      rodape: _clonarRodape(rodape),
      time: time || null,
      ramo: [],
    };
  }

  /**
   * Garante que msg.tree exista. Se a mensagem só tem o formato antigo
   * (msg.versions[] linear) ou nenhum versionamento ainda, constrói a
   * árvore a partir do que houver, preservando o comportamento visível.
   *
   * tree.rootId é um nó SENTINELA interno (nunca exibido, nunca tem
   * resposta própria) cujo único papel é ser o pai comum de TODAS as
   * versões reais (V1, V2, V3...). Isso garante que toda nova edição
   * sempre nasça como irmã das demais versões — navegação plana "i/N",
   * exatamente como o controle de versão da UI espera — mesmo que o
   * usuário tenha aprofundado um sub-ramo de conversa dentro de uma
   * delas antes de editar de novo.
   *
   * Casos:
   *  - msg já tem msg.tree → não faz nada.
   *  - msg tem msg.versions (formato pré-v3.6) → migra para árvore com
   *    sentinela na raiz e cada versão antiga como filha direta dela.
   *  - msg não tem nem tree nem versions → cria sentinela + V1 com o
   *    estado atual da própria mensagem (texto + bot seguinte, se houver).
   */
  function _garantirTree(msg, msgIndex) {
    if (msg.tree && msg.tree.nodes && msg.tree.activeId) return msg.tree;

    if (Array.isArray(msg.versions) && msg.versions.length) {
      msg.tree = _migrarVersionsParaTree(msg, msgIndex);
      delete msg.versions;
      delete msg.versionIndex;
      return msg.tree;
    }

    var botExistente = (state.messages[msgIndex + 1] && state.messages[msgIndex + 1].role === 'bot')
      ? state.messages[msgIndex + 1]
      : null;

    var sentinela = _criarNode(null, null, null, null, null);
    var v1 = _criarNode(
      sentinela.id,
      msg.text,
      botExistente ? botExistente.text : null,
      botExistente ? botExistente.rodape : null,
      botExistente ? (botExistente.time || null) : null
    );
    sentinela.childrenIds.push(v1.id);

    var nodes = {};
    nodes[sentinela.id] = sentinela;
    nodes[v1.id] = v1;
    msg.tree = { nodes: nodes, rootId: sentinela.id, activeId: v1.id };
    return msg.tree;
  }

  /**
   * Migração de msg.versions[] (lista linear pré-v3.6) para msg.tree.
   * Cada versão antiga se torna filha direta do nó sentinela — todas
   * irmãs entre si, replicando exatamente a navegação plana "i/N" que
   * já existia, sem ramos alternativos (o formato antigo não tinha
   * esse conceito, então nenhum dado é perdido ou inventado).
   */
  function _migrarVersionsParaTree(msg, msgIndex) {
    var versions = msg.versions;
    var versionIndex = (typeof msg.versionIndex === 'number') ? msg.versionIndex : versions.length - 1;
    var sentinela = _criarNode(null, null, null, null, null);
    var nodes = {};
    nodes[sentinela.id] = sentinela;
    var ids = [];

    versions.forEach(function (v) {
      var node = _criarNode(sentinela.id, v.texto, v.resposta, v.rodape, v.time);
      nodes[node.id] = node;
      sentinela.childrenIds.push(node.id);
      ids.push(node.id);
    });

    var activeId = ids[Math.max(0, Math.min(versionIndex, ids.length - 1))];

    return { nodes: nodes, rootId: sentinela.id, activeId: activeId };
  }

  /**
   * Fecha o ramo atualmente ativo de uma mensagem: corta de
   * state.messages tudo que vem depois dela e guarda esse trecho
   * (deep clone) dentro do nó ativo, como node.ramo.
   *
   * IMPORTANTE: a posição msgIndex+1 normalmente contém a RESPOSTA da
   * própria versão (já guardada em node.resposta/node.rodape/node.time)
   * — ela não faz parte do "ramo de acompanhamento" e não deve ser
   * duplicada dentro de node.ramo. O corte do ramo começa, portanto,
   * em msgIndex+2 quando a versão tem resposta própria, ou msgIndex+1
   * quando ainda não tem (ex.: versão recém-criada, resposta pendente).
   *
   * @returns {number} quantidade de mensagens removidas de state.messages
   */
  function _fecharRamoAtivo(msgIndex) {
    var msg = state.messages[msgIndex];
    if (!msg || !msg.tree) return 0;
    var node = msg.tree.nodes[msg.tree.activeId];
    if (!node) return 0;

    var temRespostaPropria = node.resposta !== null && node.resposta !== undefined;
    var inicioRamo = msgIndex + 1 + (temRespostaPropria ? 1 : 0);

    var resto = state.messages.slice(inicioRamo);
    node.ramo = _clonarMensagensProfundo(resto);
    state.messages.length = msgIndex + 1;
    return resto.length;
  }

  /**
   * Abre o ramo de um nó (que se torna o ativo): expande node.ramo
   * (deep clone) de volta para state.messages, a partir da posição
   * `posInsercao` (índice ABSOLUTO em state.messages onde a primeira
   * mensagem do ramo deve entrar — normalmente logo após a pergunta
   * do usuário, ou logo após a resposta da IA quando ela existe).
   */
  function _abrirRamoNode(posInsercao, node) {
    var expandido = _clonarMensagensProfundo(node.ramo || []);
    for (var i = 0; i < expandido.length; i++) {
      state.messages.splice(posInsercao + i, 0, expandido[i]);
    }
  }

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

  function _resolverApsParaCarregamento(periodo, apUnico) {
    var lista = APS_POR_PERIODO[periodo];
    if (Array.isArray(lista) && lista.length) return lista;
    return apUnico;
  }

  /* ══════════════════════════════════════════════════════════
     PERSISTÊNCIA DA DISCIPLINA ATIVA
  ══════════════════════════════════════════════════════════ */

  function _salvarDiscAtiva() {
    try {
      if (state.discEscolhida) {
        sessionStorage.setItem(SESSION_DISC_KEY, JSON.stringify({ id: state.discEscolhida.id }));
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

  function _rerenderTudo() {
    NexusUI.limparMensagens();
    state.messages.forEach(function (m, i) {
      m.__idx = i;
      NexusUI.renderMessage(m);
    });
  }

  /**
   * Renderiza mensagem do bot e persiste snapshot independente na versão.
   *
   * v3.6 — quando uma resposta é gerada como consequência de uma edição
   * (_versaoEditando !== null), o snapshot é salvo no NÓ da árvore
   * (msg.tree.nodes[nodeId]), não mais num array linear de versões.
   * rodape continua sempre deep-clonado via _clonarRodape().
   */
  function _renderBot(text, rodape) {
    var rodapeClone = _clonarRodape(rodape);
    var horario     = _getTime();

    var msg = _push({ role: 'bot', text: text, time: horario, rodape: rodapeClone });
    msg.__idx = state.messages.length - 1;
    NexusUI.renderMessage(msg);

    if (_versaoEditando !== null) {
      var userMsg = state.messages[_versaoEditando.msgIndex];
      if (userMsg && userMsg.tree && userMsg.tree.nodes[_versaoEditando.nodeId]) {
        var node = userMsg.tree.nodes[_versaoEditando.nodeId];
        node.resposta = text;
        node.rodape   = _clonarRodape(rodapeClone); // clone do clone — snapshot isolado
        node.time     = horario;
      }
      _versaoEditando = null;
      _salvarHistorico(); // persiste com a versão preenchida
    }
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
    var apsParaCarregar = _resolverApsParaCarregamento(parsed.periodo, parsed.ap);
    return {
      ano: parsed.ano, periodo: parsed.periodo, ap: apsParaCarregar,
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
        if (found) {
          // v3.8 — bug 4: antes, esta função apenas RETORNAVA `found`,
          // sem nunca atribuir state.discEscolhida/state.chaveHistorico.
          // Como _salvarHistorico() é um no-op enquanto chaveHistorico
          // for null, qualquer conversa que dependesse exclusivamente
          // deste fallback automático (sem o usuário digitar /disc)
          // nunca era persistida — nada para restaurar no F5 seguinte.
          // Persistimos a escolha aqui exatamente como _confirmarDisc()
          // faz no fluxo manual, incluindo a gravação em sessionStorage
          // (_salvarDiscAtiva()) para que _carregarDiscSalva() também
          // encontre esta disciplina em um próximo reload.
          state.discEscolhida  = found;
          state.chaveHistorico = _montarChaveHistorico(found.id);
          _salvarDiscAtiva();
          return found;
        }
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
    var loaderCtx = _montarCtx(disc);
    if (!loaderCtx) return [];
    var conteudo = await NexusLoader.carregar(loaderCtx);
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
  ══════════════════════════════════════════════════════════ */

  function _mensagemExcedeLimite(texto) {
    return typeof texto === 'string' && texto.length > MENSAGEM_MAX_CHARS;
  }

  /* ══════════════════════════════════════════════════════════
     FLUXO DE CHAT
  ══════════════════════════════════════════════════════════ */

  function _onUserSend(text) {
    if (state.processando) return;
    if (_mensagemExcedeLimite(text)) {
      NexusUI.renderMessage({ role: 'system', text: 'Mensagem muito grande. Resuma sua pergunta e tente novamente.', time: _getTime() });
      return;
    }
    if (state.typingTimer) clearTimeout(state.typingTimer);
    _removerLiveChips();
    var msgUser = _push({ role: 'user', text: text, time: _getTime() });
    msgUser.__idx = state.messages.length - 1;
    NexusUI.renderMessage(msgUser);
    NexusUI.showTyping();
    state.processando = true;
    _setInputBloqueado(true);
    state.typingTimer = setTimeout(function () { _processar(text); }, REPLY_DELAY_MS);
  }

  function _onSugestaoClick(texto) { _onUserSend(texto); }

  /**
   * Disparado pela UI quando o usuário confirma a edição de uma mensagem.
   *
   * v3.6 — Editar uma mensagem cria um NOVO NÓ na árvore de versões,
   * filho do nó atualmente ativo. Antes de criar o nó, o ramo ativo é
   * fechado (_fecharRamoAtivo): tudo que está depois desta mensagem em
   * state.messages é cortado e guardado dentro do nó que está deixando
   * de ser ativo, garantindo que mensagens de acompanhamento (ex.:
   * "resuma por favor") fiquem isoladas dentro do ramo onde nasceram.
   *
   * v3.7 — depois de reconstruir state.messages (que agora reflete só
   * a linha do tempo até a mensagem editada), o histórico interno do
   * NexusWorker é ressincronizado ANTES de agendar a nova pergunta —
   * sem isso, a IA responderia usando turnos de uma linha do tempo que
   * não existe mais a partir deste ponto (bug 2, vazamento de contexto).
   */
  function _onEditarMensagem(msgIndex, novoTexto) {
    if (state.processando) return;
    if (_mensagemExcedeLimite(novoTexto)) {
      NexusUI.renderMessage({ role: 'system', text: 'Mensagem muito grande. Resuma sua pergunta e tente novamente.', time: _getTime() });
      return;
    }

    var msg = state.messages[msgIndex];
    if (!msg || msg.role !== 'user') return;

    var tree = _garantirTree(msg, msgIndex);

    // Fecha o ramo do nó ativo atual — captura qualquer mensagem de
    // acompanhamento criada enquanto esse nó estava ativo, isolando-a
    // dentro dele antes de criarmos a nova versão.
    _fecharRamoAtivo(msgIndex);

    // A nova versão é sempre filha da RAIZ (irmã de todas as outras
    // versões já existentes), não do nó ativo. Isso preserva a navegação
    // "i/N" plana exibida pela UI (< versão anterior / próxima versão >),
    // independentemente de quão profundo o usuário tenha navegado antes
    // de editar — exatamente como no requisito: V1, V2 e V3 são irmãs,
    // mesmo que V1 tenha ganhado um sub-ramo próprio ("Resuma por favor").
    var raizId  = tree.rootId;
    var novoNode = _criarNode(raizId, novoTexto, null, null, null);
    tree.nodes[novoNode.id] = novoNode;
    tree.nodes[raizId].childrenIds.push(novoNode.id);
    tree.activeId = novoNode.id;

    msg.text = novoTexto;

    // Sinaliza para _renderBot onde salvar o snapshot da resposta da IA.
    _versaoEditando = { msgIndex: msgIndex, nodeId: novoNode.id };

    // state.messages já está truncado em msgIndex+1 por _fecharRamoAtivo;
    // a resposta nova será inserida via _push/_renderBot normalmente.

    _removerLiveChips();
    _salvarHistorico();
    _rerenderTudo();

    // v3.7 — bug 2: realinha o histórico interno do NexusWorker com a
    // linha do tempo atual (state.messages), que acabou de ser cortada
    // por _fecharRamoAtivo. Sem isto, a próxima chamada a
    // NexusWorker.perguntar() (dentro de _processar, logo abaixo)
    // ainda enxergaria turnos de mensagens que já não existem mais
    // a partir deste ponto da conversa.
    if (typeof window.NexusWorker !== 'undefined') {
      NexusWorker.limparHistorico();
      NexusWorker.restaurarHistorico(state.messages);
    }

    NexusUI.showTyping();
    state.processando = true;
    _setInputBloqueado(true);
    state.typingTimer = setTimeout(function () { _processar(novoTexto); }, REPLY_DELAY_MS);
  }

  /**
   * Disparado pela UI ao clicar em "<" ou ">" no controle de versão.
   *
   * v3.6 — Navega pela árvore em vez de uma lista. "<" e ">" andam entre
   * irmãos no mesmo nível (filhos do mesmo pai), preservando a ordem em
   * que foram criados — comportamento idêntico ao "versão anterior /
   * próxima versão" de antes, mas agora baseado em childrenIds da árvore.
   *
   * Ao trocar de nó ativo:
   *   1. Fecha o ramo do nó que está saindo (_fecharRamoAtivo) — guarda
   *      o sub-histórico atual dentro dele.
   *   2. Atualiza tree.activeId para o nó de destino.
   *   3. Reconstrói o bot da própria versão (pergunta+resposta) a partir
   *      do snapshot do nó.
   *   4. Abre o ramo do nó de destino (_abrirRamoNode) — expande o
   *      sub-histórico que pertence exclusivamente a essa versão.
   *
   * v3.7 — bug 1: a função agora retorna imediatamente se
   * state.processando for true. Antes, era possível trocar de ramo
   * enquanto uma resposta da IA ainda estava a caminho (de um envio
   * normal ou de uma edição); quando a resposta chegava, ela era
   * anexada ao FINAL do state.messages já mutado pela troca de versão
   * — ou seja, no ramo errado — deixando a pergunta original sem
   * resposta (órfã) e corrompendo a estrutura esperada pela próxima
   * chamada a _garantirTree/_fecharRamoAtivo para essa mensagem.
   *
   * v3.7 — bug 2: ao final, o histórico interno do NexusWorker é
   * ressincronizado com o ramo que acabou de se tornar ativo.
   */
  function _onTrocarVersao(msgIndex, delta) {
    if (state.processando) return;

    var msg = state.messages[msgIndex];
    if (!msg) return;
    var tree = _garantirTree(msg, msgIndex);

    var nodeAtivo = tree.nodes[tree.activeId];
    if (!nodeAtivo || !nodeAtivo.parentId) return;

    var irmaos   = tree.nodes[nodeAtivo.parentId].childrenIds;
    var posAtual = irmaos.indexOf(nodeAtivo.id);
    var posNova  = posAtual + delta;
    if (posNova < 0 || posNova >= irmaos.length) return;

    var nodeDestino = tree.nodes[irmaos[posNova]];
    if (!nodeDestino) return;

    // 1. Fecha o ramo do nó atual (guarda mensagens de acompanhamento nele).
    _fecharRamoAtivo(msgIndex);

    // 2. Troca o nó ativo.
    tree.activeId = nodeDestino.id;
    msg.text = nodeDestino.texto;

    // 3. Reconstrói pergunta + resposta da versão de destino.
    var temResposta = nodeDestino.resposta !== null && nodeDestino.resposta !== undefined;
    if (temResposta) {
      var novoBot = {
        role:   'bot',
        text:   nodeDestino.resposta,
        time:   nodeDestino.time || _getTime(),
        rodape: _clonarRodape(nodeDestino.rodape),
      };
      state.messages.splice(msgIndex + 1, 0, novoBot);
    }

    // 4. Abre o ramo do nó de destino, logo após a resposta (se houver)
    //    ou logo após a pergunta (se a versão ainda não tiver resposta).
    var posInsercaoRamo = msgIndex + 1 + (temResposta ? 1 : 0);
    _abrirRamoNode(posInsercaoRamo, nodeDestino);

    _salvarHistorico();
    _rerenderTudo();

    // v3.7 — bug 2: realinha o histórico interno do NexusWorker com o
    // ramo que acabou de se tornar ativo. Sem isto, a IA continuaria
    // "lembrando" de turnos pertencentes ao ramo anterior (vazamento
    // de contexto entre ramos).
    if (typeof window.NexusWorker !== 'undefined') {
      NexusWorker.limparHistorico();
      NexusWorker.restaurarHistorico(state.messages);
    }
  }

  async function _processar(texto) {
    try {
      if (_ehPedidoAjuda(texto)) { _responderAjuda(_resolverDisc()); return; }
      if (!_pipelineConteudoAtivo) { await _responderModoLivre(texto); return; }

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
      if (!discAtiva) { await _executarSemDisc(texto); return; }
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
    if (typeof window.NexusWorker === 'undefined') { _renderBot('Assistente de IA não disponível no momento.'); return; }
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
    if (_ehSaudacao(texto)) { _renderBot('Olá! 👋 Pode me fazer uma pergunta sobre ' + disc.apelido + '.'); return; }
    if (_ehAgradecimento(texto)) { _renderBot('De nada! 😊 Se tiver mais dúvidas sobre ' + disc.apelido + ', é só perguntar.'); return; }

    var numAula = _detectarResumoAula(texto);
    if (numAula !== null) {
      var c = await _garantirConteudo(disc);
      if (!c) { _renderBot('Não consegui carregar o conteúdo. Tente novamente.'); return; }
      _renderBot(_responderResumoAula(numAula, disc.apelido));
      return;
    }

    var termoBuscaGlobal = _detectarBuscaGlobal(texto);
    if (termoBuscaGlobal !== null) { _renderBot(await _executarBuscaGlobal(termoBuscaGlobal)); return; }

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
    if (ehNavegacao)   { tipoContexto = 'estrutura'; resultados = _montarMapaDisc(conteudoDisc); }
    else if (ehGlobal) { tipoContexto = 'global';    resultados = _montarContextoGlobal(conteudoDisc); }
    else {
      tipoContexto = 'conteudo';
      resultados = NexusResumoSearch.buscar(texto, { topK: TOP_K, minScore: MIN_SCORE });
      if (!resultados.length && _normalizar(texto.trim()).split(' ').length <= 4) {
        resultados = NexusResumoSearch.buscar(texto, { topK: TOP_K, minScore: 5 });
      }
    }

    if (typeof window.NexusWorker !== 'undefined') {
      var temCtx = tipoContexto === 'conteudo' ? (resultados && resultados.length > 0) : true;
      var respostaIA = null;
      try {
        respostaIA = await NexusWorker.perguntar({
          pergunta: texto, resultados: resultados,
          disciplina: disc.id, tipoContexto: tipoContexto, semContexto: !temCtx,
        });
      } catch (errIA) { console.warn('[NexusAssistant] NexusWorker.perguntar() erro:', errIA); }
      if (respostaIA) {
        var labelFonte = temCtx
          ? 'fonte: conteúdo do site'
          : (respostaIA.turnosAoEnviar > 0)
            ? 'fonte: histórico da conversa'
            : 'fonte: conhecimento próprio';
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
    _salvarDiscAtiva();
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
    msg.__idx = state.messages.length - 1;
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
  ══════════════════════════════════════════════════════════ */

  function _resetarChat() {
    _limparHistoricoAtivo();
    _removerLiveChips();
    state.processando = false;
    if (state.typingTimer) { clearTimeout(state.typingTimer); state.typingTimer = null; }
    if (typeof window.NexusWorker !== 'undefined') NexusWorker.limparHistorico();
    NexusResumoSearch.limparIndice();
    NexusLoader.limpar();
    state.discEscolhida  = null;
    state.discIndexadaId = null;
    state.conteudoAtual  = null;
    state.discsCacheadas = {};
    state.chaveHistorico = null;
    _versaoEditando      = null;
    _limparDiscSalva();
    NexusUI.atualizarDiscAtiva(null);
    NexusUI.limparMensagens();
    NexusUI.hideTyping();
    _setInputBloqueado(false);
    _addWelcomeMessage();
    if (_pipelineConteudoAtivo) { _mostrarBoasVindas(); } else { _mostrarBoasVindasLivre(); }
  }

  /* ══════════════════════════════════════════════════════════
     RESTAURAÇÃO DE HISTÓRICO
  ══════════════════════════════════════════════════════════ */

  function _restaurarSessao() {
    var discSalva = _carregarDiscSalva();
    if (!discSalva) return false;
    var chave = _montarChaveHistorico(discSalva.id);
    var msgs  = chave ? window.NexusHistory.carregar(chave) : [];
    if (!msgs || !msgs.length) {
      state.discEscolhida  = discSalva;
      state.chaveHistorico = chave;
      return false;
    }
    state.discEscolhida  = discSalva;
    state.chaveHistorico = chave;
    state.messages       = msgs;
    msgs.forEach(function (msg, i) {
      msg.__idx = i;
      NexusUI.renderMessage(msg);
    });
    if (typeof window.NexusWorker !== 'undefined') {
      NexusWorker.restaurarHistorico(msgs);
    }
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
     initUI()
  ══════════════════════════════════════════════════════════ */

  function initUI() {
    if (!_depsUIok()) return;
    if (document.getElementById('nexus-panel')) return;
    NexusUI.init({
      onSend:          _onUserSend,
      onReset:         _resetarChat,
      onEdit:          _onEditarMensagem,
      onVersionSwitch: _onTrocarVersao,
    });
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

    var resetando = (typeof window.NexusCtx !== 'undefined') && window.NexusCtx.deveResetar();
    if (resetando) {
      if (typeof window.NexusHistory !== 'undefined') window.NexusHistory.limparDominio('resumo');
      _limparDiscSalva();
      state.messages       = [];
      state.discEscolhida  = null;
      state.processando    = false;
      state.discsCacheadas = {};
      state.chaveHistorico = null;
      _versaoEditando      = null;
      NexusUI.limparMensagens();
      if (typeof window.NexusWorker !== 'undefined') NexusWorker.limparHistorico();
      if (typeof window.NexusCtx !== 'undefined') window.NexusCtx.confirmarReset();
      console.log('[NexusAssistant] reset de contexto aplicado.');
      _addWelcomeMessage();
    } else {
      var restaurado = _restaurarSessao();
      if (!restaurado) { _addWelcomeMessage(); }
    }
  }

  /* ══════════════════════════════════════════════════════════
     init()
  ══════════════════════════════════════════════════════════ */

  function init() {
    if (!_depsConteudoOk()) return;
    _pipelineConteudoAtivo = true;
    console.log('[NexusAssistant] pipeline de conteúdo de resumo ativo.');
    if (state.discEscolhida) {
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
    _versaoEditando      = null;
    _removerLiveChips();
  });

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════════════════════════ */

  window.NexusAssistant = {
    initUI,
    init,
    open:          function () { NexusUI.open();   },
    close:         function () { NexusUI.close();  },
    toggle:        function () { NexusUI.toggle(); },
    pipelineAtivo: function () { return _pipelineConteudoAtivo; },
  };

}());