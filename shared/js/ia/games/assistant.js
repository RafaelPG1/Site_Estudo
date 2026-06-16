/**
 * NEXUS — shared/js/ia/games/assistant.js
 *
 * Camada de IA/Worker/Chat do domínio "games".
 *
 * Responsabilidades:
 *   - Detectar se há um contexto de jogo ativo (via window.__NEXUS_GAMES_CTX__)
 *   - Interceptar perguntas do chat quando o usuário está em um jogo
 *   - Buscar conteúdo relevante do banco carregado (via NexusGamesSearch)
 *     e enviá-lo ao worker como contexto para a IA
 *   - Purgar o contexto de jogo ao sair da página
 *   - Responder perguntas sobre o conteúdo do jogo usando NexusWorker
 *
 * NÃO conhece:
 *   - Lógica de sorteio, deck ou partida (responsabilidade de cada jogo,
 *     usando games/engine.js diretamente)
 *   - Regras de pontuação, timer, renderização ou navegação de jogo
 *   - Estrutura interna de cada jogo (flashcards, show_milhão, etc.)
 *   - Estrutura de resumo ou quiz
 *   - DOM
 *
 * Papel no domínio games: equivalente a quiz/assistant.js e
 * resumo/assistant.js — é a ponte entre o usuário no chat e o
 * worker de IA, restrita ao contexto do conteúdo carregado pelo jogo.
 *
 * CONTEXTO DE JOGO ATIVO
 * ──────────────────────
 * O código de inicialização de cada jogo deve registrar o contexto via:
 *
 *   window.__NEXUS_GAMES_CTX__ = {
 *     jogo:       'show_milhao',    // id do jogo
 *     discId:     'banco_de_dados', // disciplina associada (para o chat)
 *     nomeJogo:   'Show do Milhão', // nome legível para mensagens
 *   };
 *
 * E limpá-lo ao sair (ou delegar ao purgar() deste módulo):
 *
 *   delete window.__NEXUS_GAMES_CTX__;
 *
 * Depende de:
 *   - core/text-utils.js   (window.NexusTextUtils)
 *   - core/worker.js       (window.NexusWorker)
 *   - games/search.js      (window.NexusGamesSearch)
 *
 * API pública: window.NexusGamesAssistant
 *   - interceptar(pergunta, disc, renderBot) → Promise<boolean>
 *     Retorna true se tratou a pergunta; false se deve seguir para o resumo.
 *   - contextoAtivo() → boolean
 *   - purgar()
 *   - notificarEntradaNoJogo(discId)
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CONTEXTO DE JOGO ATIVO
  ══════════════════════════════════════════════════════════ */

  /**
   * Retorna o contexto de jogo registrado, ou null se nenhum jogo
   * está ativo.
   *
   * @returns {{ jogo: string, discId?: string, nomeJogo?: string }|null}
   */
  function _getCtxJogo() {
    var ctx = window.__NEXUS_GAMES_CTX__;
    if (!ctx || typeof ctx !== 'object' || !ctx.jogo) return null;
    return ctx;
  }

  /**
   * Retorna true se há um jogo ativo E conteúdo carregado em
   * NexusGamesSearch.
   *
   * @returns {boolean}
   */
  function contextoAtivo() {
    if (!_getCtxJogo()) return false;
    if (typeof window.NexusGamesSearch === 'undefined') return false;
    return window.NexusGamesSearch.estaCarregado();
  }

  /* ══════════════════════════════════════════════════════════
     PURGE DO CONTEXTO DE JOGO
  ══════════════════════════════════════════════════════════ */

  function purgar() {
    try { delete window.__NEXUS_GAMES_CTX__; } catch (e) {}

    if (typeof window.NexusGamesSearch !== 'undefined') {
      window.NexusGamesSearch.limpar();
    }

    _limparDiscNaUI();

    console.log('[NexusGamesAssistant] contexto de jogo purgado.');
  }

  (function _instalarListenersPurge() {
    window.addEventListener('beforeunload', purgar);
    window.addEventListener('pagehide',     purgar);
  }());

  /* ══════════════════════════════════════════════════════════
     NOTIFICAÇÃO DE DISCIPLINA NO CHAT
  ══════════════════════════════════════════════════════════ */

  /**
   * Notifica o assistente de resumo que entramos em contexto de jogo,
   * forçando a seleção automática da disciplina no chat.
   *
   * Chamado pela inicialização de cada jogo.
   *
   * @param {string} discId — id da disciplina (ex: 'banco_de_dados', 'poo')
   */
  function notificarEntradaNoJogo(discId) {
    if (!discId) return;

    var tentativas     = 0;
    var MAX_TENTATIVAS = 30; // 3s no total (30 × 100ms)

    var intervalo = setInterval(function () {
      tentativas++;

      var assistente = window.NexusAssistant;
      if (assistente && typeof assistente.selecionarDiscPorId === 'function') {
        clearInterval(intervalo);
        assistente.selecionarDiscPorId(discId, { silencioso: true });
        console.log('[NexusGamesAssistant] disciplina "' + discId + '" selecionada automaticamente no chat.');
        return;
      }

      if (tentativas >= MAX_TENTATIVAS) {
        clearInterval(intervalo);
        console.warn('[NexusGamesAssistant] NexusAssistant não disponível — seleção automática falhou.');
      }
    }, 100);
  }

  function _limparDiscNaUI() {
    var assistente = window.NexusAssistant;
    if (assistente && typeof assistente.limparDisc === 'function') {
      assistente.limparDisc();
    } else if (typeof window.NexusUI !== 'undefined') {
      window.NexusUI.atualizarDiscAtiva(null);
    }
  }

  /* ══════════════════════════════════════════════════════════
     BUSCA DE CONTEÚDO RELEVANTE
  ══════════════════════════════════════════════════════════ */

  /**
   * Busca no banco atual do jogo itens relevantes para a pergunta.
   *
   * O banco de games é estruturalmente diferente do resumo/quiz: em vez
   * de um índice de texto invertido, o conteúdo é um objeto com campos
   * definidos pelo jogo (cartas, questoes, afirmacoes, etc.).
   *
   * Como o banco não é pré-indexado para busca semântica (games não
   * requerem isso — sua lógica é de sorteio/jogo), usamos o banco bruto
   * como contexto único para o worker, limitado a CONTEXTO_MAX chars.
   *
   * Se o banco tiver um campo `descricao` ou `titulo`, incluímos como
   * cabeçalho para dar mais contexto ao modelo.
   *
   * @param {string} pergunta
   * @returns {{ score: number, texto: string, aula: string, secao: string }[]|null}
   */
  function _buscarContextoJogo(pergunta) {
    if (typeof window.NexusGamesSearch === 'undefined') return null;

    var search = window.NexusGamesSearch;
    var banco  = search.bancoAtual();
    if (!banco) return null;

    var ctx    = search.contextoAtual();
    var secao  = ctx ? (ctx.jogo + '/' + ctx.conteudo) : 'games';
    var aula   = ctx ? ctx.conteudo : '';

    // Serializa o banco como texto de contexto para o worker.
    // Campos internos de controle (funções, refs circulares) são ignorados
    // pelo JSON.stringify com replacer seguro.
    var textoContexto;
    try {
      textoContexto = JSON.stringify(banco, function (key, value) {
        if (typeof value === 'function') return undefined;
        return value;
      });
    } catch (e) {
      textoContexto = '[conteúdo do jogo não serializável]';
    }

    // Limita tamanho para não sobrecarregar o worker
    var CONTEXTO_MAX = 4000;
    if (textoContexto.length > CONTEXTO_MAX) {
      textoContexto = textoContexto.slice(0, CONTEXTO_MAX) + '…';
    }

    // Usa NexusTextUtils para calcular score de relevância do contexto
    var score = 50; // score base: contexto de jogo é sempre parcialmente relevante
    if (typeof window.NexusTextUtils !== 'undefined') {
      var u      = window.NexusTextUtils;
      var qNorm  = u.normalizarTexto(pergunta);
      var tNorm  = u.normalizarTexto(textoContexto);
      var stems  = tNorm.split(' ').filter(Boolean).map(u.stem).join(' ');
      score = Math.max(score, u.score(qNorm, tNorm, stems, 1.0));
    }

    return [{ score: score, texto: textoContexto, aula: aula, secao: secao }];
  }

  /* ══════════════════════════════════════════════════════════
     INTERCEPTAÇÃO DO FLUXO DE CHAT
  ══════════════════════════════════════════════════════════ */

  /**
   * Tenta tratar a mensagem no contexto do jogo ativo.
   *
   * Chamado por resumo/assistant.js dentro de _executarBuscaNaDisc()
   * ANTES das verificações de resumo, quando o contexto de games está ativo.
   *
   * Retorna true se tratou (e renderizou) a resposta.
   * Retorna false para deixar o fluxo normal de resumo continuar.
   *
   * @param {string}   pergunta
   * @param {object}   disc      — disciplina ativa no chat
   * @param {Function} renderBot — callback de renderização do chat
   * @returns {Promise<boolean>}
   */
  async function interceptar(pergunta, disc, renderBot) {
    if (!contextoAtivo()) return false;

    var ctxJogo    = _getCtxJogo();
    var nomeJogo   = (ctxJogo && ctxJogo.nomeJogo) ? ctxJogo.nomeJogo : 'jogo';
    var resultados = _buscarContextoJogo(pergunta);

    if (!resultados || !resultados.length) return false;

    if (typeof window.NexusWorker === 'undefined') return false;

    var search     = window.NexusGamesSearch;
    var ctxSearch  = search ? search.contextoAtual() : null;
    var disciplina = (disc && disc.id) ? disc.id : (ctxJogo && ctxJogo.discId ? ctxJogo.discId : '');

    var respostaIA = null;
    try {
      respostaIA = await window.NexusWorker.perguntar({
        pergunta:     pergunta,
        resultados:   resultados,
        disciplina:   disciplina,
        tipoContexto: 'conteudo',
        semContexto:  false,
      });
    } catch (e) {
      console.warn('[NexusGamesAssistant] interceptar: erro ao chamar NexusWorker:', e);
    }

    if (respostaIA) {
      var rodape = null;
      if (respostaIA.fonte || respostaIA.modelo) {
        rodape = {
          linha1: ['IA: ' + (respostaIA.fonte || ''), respostaIA.modelo || ''].filter(Boolean).join(' · '),
          linha2: 'fonte: ' + nomeJogo + (ctxSearch ? ' · ' + ctxSearch.conteudo : ''),
        };
      }
      renderBot(respostaIA.texto, rodape);
      return true;
    }

    return false;
  }

  /* ══════════════════════════════════════════════════════════
     REGISTRO GLOBAL
  ══════════════════════════════════════════════════════════ */

  window.NexusGamesAssistant = {
    interceptar,
    contextoAtivo,
    purgar,
    notificarEntradaNoJogo,
  };

}());