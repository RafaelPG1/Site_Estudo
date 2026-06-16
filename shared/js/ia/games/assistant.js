/**
 * NEXUS — shared/js/ia/games/assistant.js
 *
 * Camada de IA/Worker/Chat do domínio "games".
 *
 * Responsabilidades:
 *   - Detectar se há um contexto de jogo ativo via NexusContext
 *   - Interceptar perguntas do chat quando o usuário está em um jogo
 *   - Montar contexto textual a partir do banco do jogo e enviá-lo ao worker
 *   - Purgar o contexto ao sair da página
 *   - Responder perguntas sobre o conteúdo do jogo usando NexusWorker
 *
 * NÃO conhece:
 *   - Lógica de sorteio, deck ou partida (responsabilidade de cada jogo)
 *   - Regras de pontuação, timer, renderização ou navegação de jogo
 *   - Estrutura interna de cada jogo (flashcards, show_milhão, etc.)
 *   - Estrutura de resumo ou quiz
 *   - DOM
 *
 * DETECÇÃO DE CONTEXTO
 * ────────────────────
 * A detecção de TIPO usa NexusContext.temTipo('games') — que lê
 * window.__NEXUS_CONTEXT__ quando declarado pela página (novo contrato),
 * ou window.__NEXUS_GAMES_CTX__ como fallback (compatibilidade legada).
 *
 * Os DADOS do jogo continuam em window.__NEXUS_GAMES_CTX__:
 *
 *   window.__NEXUS_GAMES_CTX__ = {
 *     jogo:     'show_milhao',
 *     discId:   'banco_de_dados',
 *     nomeJogo: 'Show do Milhão',
 *     banco:    [...],            // opcional (jogos com import próprio)
 *   };
 *
 * O campo `banco` é opcional: jogos que usam NexusGamesSearch não
 * precisam dele — o assistant obtém o banco via NexusGamesSearch.bancoAtual().
 *
 * Depende de:
 *   - core/context.js     (window.NexusContext)      — tipo de contexto
 *   - core/text-utils.js  (window.NexusTextUtils)    — opcional, melhora score
 *   - core/worker.js      (window.NexusWorker)        — obrigatório para IA
 *   - games/search.js     (window.NexusGamesSearch)  — opcional, fallback de banco
 *
 * API pública: window.NexusGamesAssistant
 *   - interceptar(pergunta, disc, renderBot) → Promise<boolean>
 *   - contextoAtivo() → boolean
 *   - purgar()
 *   - notificarEntradaNoJogo(discId)
 */

(function () {
  'use strict';

  var CONTEXTO_MAX = 5000;

  /* ══════════════════════════════════════════════════════════
     ACESSO AO CONTEXTO DE DADOS DO JOGO
     (__NEXUS_GAMES_CTX__ continua sendo a fonte dos dados;
      apenas a detecção de TIPO migrou para NexusContext)
  ══════════════════════════════════════════════════════════ */

  function _getCtxJogo() {
    var ctx = window.__NEXUS_GAMES_CTX__;
    if (!ctx || typeof ctx !== 'object' || !ctx.jogo) return null;
    return ctx;
  }

  /* ══════════════════════════════════════════════════════════
     DETECÇÃO DE CONTEXTO ATIVO
  ══════════════════════════════════════════════════════════ */

  /**
   * Retorna true se o tipo 'games' está ativo na página.
   *
   * Usa NexusContext (novo contrato) quando disponível.
   * Fallback: verifica __NEXUS_GAMES_CTX__ diretamente (legado).
   *
   * @returns {boolean}
   */
  function _tipoGamesAtivo() {
    if (typeof window.NexusContext !== 'undefined') {
      return window.NexusContext.temTipo('games');
    }
    // fallback legado
    var ctx = _getCtxJogo();
    return ctx !== null;
  }

  /**
   * Retorna true se há jogo ativo com banco disponível (inline ou via
   * NexusGamesSearch).
   */
  function contextoAtivo() {
    if (!_tipoGamesAtivo()) return false;

    var ctx = _getCtxJogo();

    // Banco inline (jogos com import dinâmico próprio, ex: show_milhao)
    if (ctx && Array.isArray(ctx.banco) && ctx.banco.length > 0) return true;

    // Banco via NexusGamesSearch (jogos que usam o fluxo padrão)
    if (typeof window.NexusGamesSearch !== 'undefined') {
      return window.NexusGamesSearch.estaCarregado();
    }

    return false;
  }

  /* ══════════════════════════════════════════════════════════
     PURGE
  ══════════════════════════════════════════════════════════ */

  function purgar() {
    try { delete window.__NEXUS_GAMES_CTX__; } catch (e) {}
    if (typeof window.NexusGamesSearch !== 'undefined') {
      window.NexusGamesSearch.limpar();
    }
    _limparDiscNaUI();
    console.log('[NexusGamesAssistant] contexto de jogo purgado.');
  }

  (function () {
    window.addEventListener('beforeunload', purgar);
    window.addEventListener('pagehide',     purgar);
  }());

  /* ══════════════════════════════════════════════════════════
     NOTIFICAÇÃO DE DISCIPLINA NO CHAT
  ══════════════════════════════════════════════════════════ */

  /**
   * Notifica NexusAssistant (resumo) que entramos em contexto de jogo,
   * selecionando a disciplina automaticamente no chat.
   *
   * @param {string} discId
   */
  function notificarEntradaNoJogo(discId) {
    if (!discId) return;

    var tentativas = 0;
    var intervalo  = setInterval(function () {
      tentativas++;
      var a = window.NexusAssistant;
      if (a && typeof a.selecionarDiscPorId === 'function') {
        clearInterval(intervalo);
        a.selecionarDiscPorId(discId, { silencioso: true });
        console.log('[NexusGamesAssistant] disciplina "' + discId + '" selecionada no chat.');
        return;
      }
      if (tentativas >= 30) {
        clearInterval(intervalo);
        console.warn('[NexusGamesAssistant] NexusAssistant indisponível — seleção automática falhou.');
      }
    }, 100);
  }

  function _limparDiscNaUI() {
    var a = window.NexusAssistant;
    if (a && typeof a.limparDisc === 'function') {
      a.limparDisc();
    } else if (typeof window.NexusUI !== 'undefined') {
      window.NexusUI.atualizarDiscAtiva(null);
    }
  }

  /* ══════════════════════════════════════════════════════════
     MONTAGEM DO CONTEXTO TEXTUAL
  ══════════════════════════════════════════════════════════ */

  /**
   * Obtém o banco de itens do jogo: ctx.banco primeiro (inline),
   * depois NexusGamesSearch como fallback.
   */
  function _obterBanco() {
    var ctx = _getCtxJogo();
    if (!ctx) return null;

    if (Array.isArray(ctx.banco) && ctx.banco.length > 0) return ctx.banco;

    if (typeof window.NexusGamesSearch !== 'undefined') {
      var b = window.NexusGamesSearch.bancoAtual();
      if (!b) return null;
      if (Array.isArray(b.questoes))   return b.questoes;
      if (Array.isArray(b.cartas))     return b.cartas;
      if (Array.isArray(b.afirmacoes)) return b.afirmacoes;
      if (Array.isArray(b))            return b;
    }

    return null;
  }

  /**
   * Serializa o banco em texto legível para o worker.
   * Suporta os formatos dos diferentes jogos:
   *   show_milhao:      { pergunta, alternativas[], correta }
   *   flashcard:        { frente, verso }
   *   verdadeiro/falso: { texto, correto }
   *   genérico:         { texto | question }
   */
  function _montarContexto(pergunta) {
    var ctx   = _getCtxJogo();
    var banco = _obterBanco();
    if (!ctx || !banco) return null;

    var nomeJogo = ctx.nomeJogo || ctx.jogo;
    var linhas   = ['Banco de questões — ' + nomeJogo + ':'];
    var tamanho  = linhas[0].length;
    var letras   = ['A', 'B', 'C', 'D', 'E'];

    for (var i = 0; i < banco.length; i++) {
      var q    = banco[i];
      var linha = '';

      if (q.pergunta) {
        // show_milhao / perguntas com alternativas
        linha = 'Q' + (i + 1) + ': ' + q.pergunta;
        if (Array.isArray(q.alternativas)) {
          linha += ' | ' + q.alternativas.map(function (alt, j) {
            return letras[j] + ') ' + alt;
          }).join(' | ');
        }
        if (q.correta) linha += ' | Gabarito: ' + q.correta;
      } else if (q.frente) {
        // flashcard
        linha = 'Q' + (i + 1) + ': ' + q.frente + ' → ' + (q.verso || '');
      } else if (q.texto) {
        // genérico com campo texto
        linha = 'Q' + (i + 1) + ': ' + q.texto;
        if (q.correto !== undefined) linha += ' [' + (q.correto ? 'Verdadeiro' : 'Falso') + ']';
      } else if (q.question) {
        linha = 'Q' + (i + 1) + ': ' + q.question;
      } else {
        try { linha = 'Q' + (i + 1) + ': ' + JSON.stringify(q); } catch (_) { continue; }
      }

      if (!linha) continue;

      if (tamanho + linha.length > CONTEXTO_MAX) {
        linhas.push('… (mais ' + (banco.length - i) + ' questões omitidas)');
        break;
      }

      linhas.push(linha);
      tamanho += linha.length;
    }

    var textoContexto = linhas.join('\n');

    var score = 50;
    if (typeof window.NexusTextUtils !== 'undefined') {
      var u     = window.NexusTextUtils;
      var qNorm = u.normalizarTexto(pergunta);
      var tNorm = u.normalizarTexto(textoContexto);
      var stems = tNorm.split(' ').filter(Boolean).map(u.stem).join(' ');
      score = Math.max(score, u.score(qNorm, tNorm, stems, 1.0));
    }

    return [{ score: score, texto: textoContexto, aula: nomeJogo, secao: ctx.jogo }];
  }

  /* ══════════════════════════════════════════════════════════
     INTERCEPTAÇÃO DO FLUXO DE CHAT
  ══════════════════════════════════════════════════════════ */

  /**
   * Tenta tratar a mensagem no contexto do jogo ativo.
   *
   * Chamado por resumo/assistant.js dentro de _executarBuscaNaDisc()
   * antes das verificações de resumo.
   *
   * @param {string}   pergunta
   * @param {object}   disc      — disciplina ativa no chat
   * @param {Function} renderBot — callback de renderização
   * @returns {Promise<boolean>} true se tratou, false para continuar no resumo
   */
  async function interceptar(pergunta, disc, renderBot) {
    if (!contextoAtivo()) return false;
    if (typeof window.NexusWorker === 'undefined') return false;

    var ctxJogo    = _getCtxJogo();
    var nomeJogo   = ctxJogo ? (ctxJogo.nomeJogo || ctxJogo.jogo) : 'jogo';
    var resultados = _montarContexto(pergunta);
    if (!resultados || !resultados.length) return false;

    var disciplina = (disc && disc.id) ? disc.id
                   : (ctxJogo && ctxJogo.discId) ? ctxJogo.discId : '';

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
      console.warn('[NexusGamesAssistant] interceptar: erro no worker:', e);
    }

    if (respostaIA) {
      var rodape = null;
      if (respostaIA.fonte || respostaIA.modelo) {
        rodape = {
          linha1: ['IA: ' + (respostaIA.fonte || ''), respostaIA.modelo || '']
                    .filter(Boolean).join(' · '),
          linha2: 'fonte: ' + nomeJogo,
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