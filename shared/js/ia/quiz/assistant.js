/**
 * NEXUS — quiz/js/assistant.js  v2.5
 *
 * Quiz-Assistant: tutor de IA dentro do ambiente de quiz.
 *
 * ── MUDANÇAS v2.5 ─────────────────────────────────────────
 *
 *   CORREÇÃO DO BUG DE VERSIONAMENTO (regressão em v2.4)
 *
 *   Problema observado: ao editar uma mensagem múltiplas vezes
 *   (3+ versões) ou ao restaurar do localStorage, versões anteriores
 *   exibiam a resposta da versão mais recente.
 *
 *   Causas raiz identificadas:
 *
 *   1. SHALLOW COPY do rodapé em _onEditarMensagem:
 *      versions[0].rodape = botExistente.rodape
 *      Como rodape é um objeto { linha1, linha2 }, versão 0 e o objeto
 *      bot em state.messages compartilhavam a mesma referência.
 *      Se _onTrocarVersao depois reutilizasse o rodape de outra versão,
 *      a mutação vazava para versão 0.
 *      CORREÇÃO: deep copy via _clonarRodape() em toda atribuição de rodape.
 *
 *   2. AUSÊNCIA DE TIME por versão:
 *      _onTrocarVersao usava botAtual.time (tempo do bot atual na tela)
 *      para montar o objeto de substituição. Após múltiplas trocas,
 *      o time exibido era sempre o da última versão gerada.
 *      CORREÇÃO: cada versão agora armazena { texto, resposta, rodape, time }.
 *      _renderBot salva resp.time na versão. _onTrocarVersao usa versao.time.
 *
 *   3. _rerenderTudo não recalculava __idx após splices:
 *      Mensagens removidas por splice deixavam buracos no __idx esperado
 *      pelos botões de editar/versão. Se duas mensagens user estivessem
 *      presentes e a primeira fosse editada, os botões da segunda apontavam
 *      para o índice errado.
 *      CORREÇÃO: _rerenderTudo recalcula msg.__idx = i em todo rerender.
 *      (já estava assim em v2.4 — mantido).
 *
 *   4. _onTrocarVersao não tratava ausência de bot corrente:
 *      Se state.messages[msgIndex+1] não existia (race condition durante
 *      geração) ou tinha role diferente de 'bot', a substituição era
 *      silenciosamente ignorada e o display ficava inconsistente.
 *      CORREÇÃO: se não há bot atual mas a versão tem resposta salva,
 *      insere um novo objeto bot em state.messages[msgIndex+1].
 *
 * ── MUDANÇAS v2.4 ─────────────────────────────────────────
 *   (ver cabeçalho da versão anterior)
 *
 * ── MUDANÇAS v2.6 (árvore de conversa) ──────────────────────
 *
 *   Problema observado: o sistema de versões era uma LISTA linear de
 *   snapshots. Cada versão guardava apenas sua própria pergunta+resposta,
 *   mas não isolava mensagens de acompanhamento enviadas depois dela —
 *   se o usuário voltasse a uma versão antiga e mandasse uma mensagem
 *   nova (ex.: "resuma por favor"), ela acabava aparecendo em TODAS as
 *   versões, porque o array linear de state.messages não sabia a qual
 *   versão ela pertencia.
 *
 *   CORREÇÃO: cada mensagem editável agora tem uma ÁRVORE de versões
 *   (msg.tree). tree.rootId é um nó sentinela interno (nunca exibido)
 *   cujos filhos diretos são as versões reais (V1, V2, V3...) — sempre
 *   irmãs entre si, preservando a navegação plana "< i/N >" que a UI
 *   já exibia. Cada nó de versão guarda, além do snapshot de sempre
 *   (texto/resposta/rodape/time), seu PRÓPRIO sub-histórico de conversa
 *   (node.ramo) — mensagens criadas enquanto aquele nó estava ativo.
 *
 *   Trocar de versão agora:
 *     1. Fecha o ramo do nó que está deixando de ser ativo
 *        (_fecharRamoAtivo): tudo que está em state.messages depois da
 *        mensagem editável é cortado (deep clone) e guardado dentro dele.
 *     2. Abre o ramo do nó de destino (_abrirRamoNode): o sub-histórico
 *        salvo nele é expandido de volta para state.messages.
 *     3. Rerenderiza tudo.
 *
 *   Isso garante que mensagens de acompanhamento pertencem exclusivamente
 *   ao ramo (versão) onde foram criadas, e nunca aparecem em outro ramo.
 *
 *   MIGRAÇÃO: históricos antigos salvos como msg.versions[] (lista linear)
 *   são convertidos para msg.tree na primeira leitura, via
 *   _migrarVersionsParaTree() — cada versão antiga se torna filha direta
 *   do sentinela (irmãs entre si), preservando 100% o que era exibido
 *   antes. Depois da migração, msg.versions é removido e msg.tree passa
 *   a ser a única fonte de verdade.
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

  var _versaoEditando = null; // { msgIndex, nodeId } | null

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
     Ver cabeçalho do arquivo (v2.6) para a descrição completa.
     Estrutura idêntica à usada em shared/js/ia/resumo/assistant.js,
     por mensagem editável (msg.tree):

       msg.tree = {
         nodes:    { [nodeId]: NodeVersao },
         rootId:   string,   // nó sentinela, nunca exibido
         activeId: string,
       }

       NodeVersao = {
         id, parentId, childrenIds: string[],
         texto, resposta, rodape, time,
         ramo: object[],   // sub-histórico exclusivo deste nó
       }
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
   * Garante que msg.tree exista. tree.rootId é um nó SENTINELA interno
   * (nunca exibido, nunca tem resposta própria) cujo único papel é ser
   * o pai comum de todas as versões reais (V1, V2, V3...) — garantindo
   * que toda nova edição nasça como irmã das demais, navegação plana
   * "i/N", mesmo que o usuário tenha aprofundado um sub-ramo de conversa
   * dentro de uma delas antes de editar de novo.
   *
   * Casos:
   *  - msg já tem msg.tree → não faz nada.
   *  - msg tem msg.versions (formato pré-v2.6) → migra para árvore com
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
   * Migração de msg.versions[] (lista linear pré-v2.6) para msg.tree.
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
   * quando ainda não tem.
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
   * mensagem do ramo deve entrar).
   */
  function _abrirRamoNode(posInsercao, node) {
    var expandido = _clonarMensagensProfundo(node.ramo || []);
    for (var i = 0; i < expandido.length; i++) {
      state.messages.splice(posInsercao + i, 0, expandido[i]);
    }
  }

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
     PERSISTÊNCIA INTELIGENTE ENTRE CARGAS DE PÁGINA
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

  function _rerenderTudo() {
    if (typeof window.NexusUI === 'undefined') return;
    window.NexusUI.limparMensagens();
    state.messages.forEach(function (m, i) {
      m.__idx = i;
      window.NexusUI.renderMessage(m);
    });
  }

  function _limparMarcadoresChips(texto) {
    if (!texto) return texto;
    return texto.replace(/==[^=]+==([^=]+)==/g, '$1');
  }

  /**
   * Renderiza mensagem do bot e persiste snapshot independente na versão.
   *
   * v2.6 — quando a resposta é consequência de uma edição
   * (_versaoEditando !== null), o snapshot é salvo no NÓ da árvore
   * (msg.tree.nodes[nodeId]), não mais num array linear de versões.
   * rodape é sempre deep-clonado via _clonarRodape().
   */
  function _renderBot(text, rodape) {
    if (typeof window.NexusUI === 'undefined') return;
    var textoLimpo   = _limparMarcadoresChips(text);
    var rodapeClone  = _clonarRodape(rodape);
    var horario      = _getTime();

    var msg = _push({ role: 'bot', text: textoLimpo, time: horario, rodape: rodapeClone });
    msg.__idx = state.messages.length - 1;
    window.NexusUI.renderMessage(msg);

    if (_versaoEditando !== null) {
      var userMsg = state.messages[_versaoEditando.msgIndex];
      if (userMsg && userMsg.tree && userMsg.tree.nodes[_versaoEditando.nodeId]) {
        var node = userMsg.tree.nodes[_versaoEditando.nodeId];
        node.resposta = textoLimpo;
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
    if (input)   { input.disabled   = bloqueado; }
    if (sendBtn) { sendBtn.disabled = bloqueado; }
    if (input)   { input.placeholder = bloqueado ? 'Aguarde…' : 'Digite sua mensagem…'; }
  }

  /* ══════════════════════════════════════════════════════════
     DETECÇÃO DE MUDANÇA DE CONTEXTO DENTRO DA MESMA SESSÃO
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
      _versaoEditando = null;
      if (typeof window.NexusWorker !== 'undefined') {
        window.NexusWorker.limparHistorico();
      }
    }

    if (discAtual) state.discAtivo = discAtual;
    if (modoAtual) state.modoAtivo = modoAtual;
  }

  /* ══════════════════════════════════════════════════════════
     CLASSIFICAÇÃO DE INTENÇÃO
  ══════════════════════════════════════════════════════════ */

  var _PEDE_RESPOSTA_RE = /\b(?:qual\s+(?:e|eh|é)\s+(?:a\s+)?(?:resposta|alternativa|letra|opcao|gabarito|certa?|correta?)|qual\s+(?:resposta|alternativa|letra|opcao|gabarito)|(?:me\s+)?(?:da|fala|diz|mostra|revela|mostre)\s+(?:a\s+)?(?:resposta|alternativa|letra|opcao|gabarito|certa?|correta?)|(?:resposta|gabarito)\s*(?:correta?|certa?)?|qual\s+alternativa\s+(?:esta|e|eh|e)\s+(?:certa?|correta?)|me\s+d[aa]\s+o\s+gabarito|qual\s+(?:e\s+)?a?\s*certa|qual\s+acertei|acertei\s+ou\s+errei)\b/;

  var _PEDE_EXPLICACAO_RE = /\b(?:explica(?:r)?|explicar?|por\s+que|porque|como\s+(?:funciona|resolver?|chegar)|o\s+que\s+(?:significa|e|eh|é|aborda)|entender?|entend[ae]|me\s+(?:explica|ajuda|ensina)|racioc[ií]nio|racion[aá]l|log[ií]ca|conceito|teoria)\b/;

  function _classificarIntencao(textoNormalizado) {
    var pedeResposta   = _PEDE_RESPOSTA_RE.test(textoNormalizado);
    var pedeExplicacao = _PEDE_EXPLICACAO_RE.test(textoNormalizado);
    if (pedeResposta && pedeExplicacao) return 'hibrido';
    if (pedeResposta)                   return 'gabarito';
    return 'explicacao';
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
     SERIALIZAÇÃO DA QUESTÃO
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
    return linhas.join('\n');
  }

  function _serializarQuestaoComGabarito(numeroVisual, q) {
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
     INSTRUÇÕES DE SISTEMA PARA A IA
  ══════════════════════════════════════════════════════════ */

  var _INSTRUCOES_IA = {
    conteudo: (
      'INSTRUÇÃO PARA O TUTOR: O aluno quer entender o conteúdo desta questão, ' +
      'NÃO quer saber a resposta correta. ' +
      'Explique os conceitos, contextualize o tema, analise as alternativas do ponto de vista conceitual. ' +
      'NÃO revele qual alternativa é a correta. ' +
      'Se o aluno quiser o gabarito, ele pedirá explicitamente. ' +
      'Pergunta do aluno: '
    ),
    gabarito: (
      'INSTRUÇÃO PARA O TUTOR: O aluno pediu explicitamente o gabarito desta questão. ' +
      'Informe qual alternativa é a correta e explique brevemente por que está certa, ' +
      'usando o feedback fornecido no contexto. ' +
      'Pergunta do aluno: '
    ),
    hibrido: (
      'INSTRUÇÃO PARA O TUTOR: O aluno quer tanto uma explicação quanto saber a resposta. ' +
      'Estruture sua resposta assim: ' +
      '1) Explique o conteúdo e analise as alternativas conceitualmente. ' +
      '2) Ao final, revele a alternativa correta e por que ela está certa. ' +
      'Pergunta do aluno: '
    ),
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
     RESPOSTAS
  ══════════════════════════════════════════════════════════ */

  async function _responderSobreQuestao(pergunta, numeroVisual, q) {
    _ultimaQuestaoVisual = numeroVisual;
    var norm     = _normalizar(pergunta);
    var intencao = _classificarIntencao(norm);
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
    // Fallback offline
    if (intencao === 'gabarito') {
      var fb = 'Questão ' + numeroVisual;
      if (q.question) fb += '\n\n' + q.question;
      if (typeof q.answer === 'number' && Array.isArray(q.options)) {
        fb += '\n\nRESPOSTA: ' + String.fromCharCode(65 + q.answer) + ') ' + q.options[q.answer];
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
        fbH += '\n\nRESPOSTA: ' + String.fromCharCode(65 + q.answer) + ') ' + q.options[q.answer];
        if (q.feedback) fbH += '\n\n' + q.feedback;
      }
      _renderBot(fbH);
      return;
    }
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
    var msgUser = _push({ role: 'user', text: text, time: _getTime() });
    msgUser.__idx = state.messages.length - 1;
    window.NexusUI.renderMessage(msgUser);
    window.NexusUI.showTyping();
    state.processando = true;
    _setInputBloqueado(true);
    state.typingTimer = setTimeout(function () { _processar(text); }, REPLY_DELAY_MS);
  }

  /**
   * Disparado pela UI quando o usuário confirma a edição de uma mensagem.
   *
   * v2.6 — Editar uma mensagem cria um NOVO NÓ na árvore de versões,
   * sempre filho do nó SENTINELA (irmão de todas as outras versões já
   * existentes). Antes de criar o nó, o ramo ativo é fechado
   * (_fecharRamoAtivo): tudo que está depois desta mensagem em
   * state.messages é cortado e guardado dentro do nó que está deixando
   * de ser ativo, garantindo que mensagens de acompanhamento (ex.:
   * "resuma por favor") fiquem isoladas dentro do ramo onde nasceram.
   */
  function _onEditarMensagem(msgIndex, novoTexto) {
    if (state.processando) return;
    if (typeof window.NexusUI === 'undefined') return;

    var msg = state.messages[msgIndex];
    if (!msg || msg.role !== 'user') return;

    var tree = _garantirTree(msg, msgIndex);

    // Fecha o ramo do nó ativo atual — captura qualquer mensagem de
    // acompanhamento criada enquanto esse nó estava ativo, isolando-a
    // dentro dele antes de criarmos a nova versão.
    _fecharRamoAtivo(msgIndex);

    // A nova versão é sempre filha do SENTINELA (irmã de todas as outras
    // versões já existentes) — preserva a navegação "i/N" plana exibida
    // pela UI, independentemente de quão profundo o usuário tenha
    // navegado um sub-ramo antes de editar.
    var raizId   = tree.rootId;
    var novoNode = _criarNode(raizId, novoTexto, null, null, null);
    tree.nodes[novoNode.id] = novoNode;
    tree.nodes[raizId].childrenIds.push(novoNode.id);
    tree.activeId = novoNode.id;

    msg.text = novoTexto;

    // Sinaliza para _renderBot onde salvar o snapshot da resposta da IA.
    _versaoEditando = { msgIndex: msgIndex, nodeId: novoNode.id };

    // state.messages já está truncado em msgIndex+1 por _fecharRamoAtivo;
    // a resposta nova será inserida via _push/_renderBot normalmente.

    _salvarHistorico();
    _rerenderTudo();

    window.NexusUI.showTyping();
    state.processando = true;
    _setInputBloqueado(true);
    state.typingTimer = setTimeout(function () { _processar(novoTexto); }, REPLY_DELAY_MS);
  }

  /**
   * Disparado pela UI ao clicar em "<" ou ">" no controle de versão.
   *
   * v2.6 — Navega entre irmãos (filhos do sentinela) em vez de uma
   * lista linear de versões. Ao trocar de nó ativo:
   *   1. Fecha o ramo do nó que está saindo (_fecharRamoAtivo) — guarda
   *      o sub-histórico atual dentro dele.
   *   2. Atualiza tree.activeId para o nó de destino.
   *   3. Reconstrói o bot da própria versão (pergunta+resposta) a partir
   *      do snapshot do nó.
   *   4. Abre o ramo do nó de destino (_abrirRamoNode) — expande o
   *      sub-histórico que pertence exclusivamente a essa versão.
   */
  function _onTrocarVersao(msgIndex, delta) {
    var msg = state.messages[msgIndex];
    if (!msg || !msg.tree) return;
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
  }

  async function _processar(texto) {
    try {
      if (!_contextoAtivo()) {
        _renderBot('Assistente indisponível. Recarregue a página.');
        return;
      }
      _resetarSeContextoMudou();
      var numQ = _detectarNumeroQuestao(texto);
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
    _versaoEditando      = null;
    state.processando    = false;
    if (state.typingTimer) { clearTimeout(state.typingTimer); state.typingTimer = null; }
    if (typeof window.NexusWorker !== 'undefined') window.NexusWorker.limparHistorico();
    if (typeof window.NexusUI     === 'undefined') return;
    window.NexusUI.limparMensagens();
    window.NexusUI.hideTyping();
    _setInputBloqueado(false);
    var sysMsg = { role: 'system', text: '⬡  Nexus IA', time: _getTime() };
    _push(sysMsg);
    sysMsg.__idx = state.messages.length - 1;
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
    _aplicarPersistenciaContexto(discId, modo, sem);
    state.discAtivo      = discId;
    state.modoAtivo      = modo;
    state.chaveHistorico = _montarChaveHistorico(discId, modo, sem);
    window.NexusUI.init({
      onSend:          _onUserSend,
      onReset:         _resetarChat,
      onEdit:          _onEditarMensagem,
      onVersionSwitch: _onTrocarVersao,
    });
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
      histSalvo.forEach(function (msg, i) {
        msg.__idx = i;
        window.NexusUI.renderMessage(msg);
      });
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
      sysMsg.__idx = state.messages.length - 1;
      window.NexusUI.renderMessage(sysMsg);
      _mostrarBoasVindas();
    }
    console.log('[NexusQuizAssistant] iniciado v2.6 — disc:', discId, '| modo:', modo,
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