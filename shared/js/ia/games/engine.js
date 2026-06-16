/**
 * NEXUS — shared/js/ia/games/engine.js
 *
 * Motor de partida do domínio "games".
 *
 * Responsabilidades:
 *   - Sortear um subconjunto aleatório de itens do banco atual
 *     (sem alterar o banco original em NexusGamesSearch)
 *   - Gerenciar o ciclo de vida do deck da partida em andamento
 *     (iniciar, encerrar, consultar)
 *
 * NÃO conhece:
 *   - Como os dados são carregados ou de onde vêm (delega a
 *     games/search.js)
 *   - Lógica de IA, worker, chat ou histórico de conversa
 *     (responsabilidade de games/assistant.js)
 *   - Estrutura de resumo ou quiz
 *   - DOM, renderização ou regras específicas de cada jogo
 *     (flashcards, show_milhao, vdd_falso, completar_frase, ...)
 *
 * GENERICIDADE ENTRE JOGOS
 * ────────────────────────
 * Este módulo opera sobre ARRAYS GENÉRICOS. Não sabe (nem precisa
 * saber) se os itens são cartas de flashcard, perguntas de show do
 * milhão ou afirmações de verdadeiro/falso.
 *
 * Cada jogo é responsável por:
 *   1. Chamar NexusGamesSearch.carregarConteudo(ctx) para carregar
 *      seus dados.
 *   2. Extrair a lista de itens jogáveis via
 *      NexusGamesSearch.obterCampo('campo_do_jogo').
 *   3. Chamar iniciarPartida(lista, qtd) com a lista extraída.
 *   4. Interpretar o deck retornado conforme as regras do seu jogo.
 *
 * Nenhuma alteração neste arquivo é necessária para adicionar um novo
 * jogo — apenas o próprio jogo precisa saber qual campo ler.
 *
 * Depende de: (nenhuma dependência em tempo de execução)
 *   O engine recebe a lista como argumento — não consulta
 *   NexusGamesSearch diretamente. Isso permite que cada jogo passe
 *   a lista que quiser (filtrada, combinada, transformada) sem que
 *   o engine precise conhecer a estrutura dos dados.
 *
 * API pública: window.NexusGamesEngine
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CONFIGURAÇÃO
  ══════════════════════════════════════════════════════════ */

  // Quantidade padrão de itens sorteados por partida, quando a
  // chamada não especifica `qtd`.
  const QTD_PADRAO_PARTIDA = 10;

  /* ══════════════════════════════════════════════════════════
     ESTADO INTERNO
  ══════════════════════════════════════════════════════════ */

  // Deck da partida em andamento: nova array com a seleção/ordem
  // sorteada para esta partida. NUNCA é a mesma referência da lista
  // de origem — sempre uma cópia independente.
  let _deckAtual = null;

  /* ══════════════════════════════════════════════════════════
     SELEÇÃO ALEATÓRIA (FISHER–YATES)
  ══════════════════════════════════════════════════════════ */

  /**
   * Embaralha uma cópia do array recebido usando Fisher–Yates.
   * NÃO modifica o array original — sempre opera sobre uma cópia.
   *
   * @param {Array} arr
   * @returns {Array} nova array embaralhada
   */
  function _embaralhar(arr) {
    const copia = arr.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j   = Math.floor(Math.random() * (i + 1));
      const tmp = copia[i];
      copia[i]  = copia[j];
      copia[j]  = tmp;
    }
    return copia;
  }

  /**
   * Sorteia um subconjunto de `qtd` itens a partir de `lista`, sem
   * repetição e sem alterar `lista`.
   *
   * Se `qtd` for maior ou igual ao tamanho da lista, retorna a lista
   * inteira embaralhada (todos os itens participam, em ordem
   * aleatória).
   *
   * @param {Array}  lista
   * @param {number} qtd
   * @returns {Array} nova array com os itens sorteados
   */
  function _sortearSubset(lista, qtd) {
    const embaralhada = _embaralhar(lista);
    if (qtd >= embaralhada.length) return embaralhada;
    return embaralhada.slice(0, qtd);
  }

  /* ══════════════════════════════════════════════════════════
     CICLO DE VIDA DA PARTIDA
  ══════════════════════════════════════════════════════════ */

  /**
   * Inicia uma nova partida: sorteia `qtd` itens de `lista`, em ordem
   * embaralhada, e armazena como deck da partida atual.
   *
   * A `lista` de origem permanece intacta. Chamadas sucessivas de
   * iniciarPartida() com a mesma `lista` sempre sorteiam a partir dela,
   * nunca do deck anterior — permitindo "jogar novamente" com uma nova
   * seleção aleatória.
   *
   * @param {Array}   lista — lista de itens "jogáveis" (cartas, perguntas,
   *   afirmações, etc. — interpretação é responsabilidade do jogo).
   * @param {number} [qtd] — quantidade de itens da partida.
   *   Padrão: 10 (ou o tamanho da lista, se for menor).
   * @returns {Array|null} deck da partida (nova array), ou null se
   *   `lista` for inválida/vazia.
   */
  function iniciarPartida(lista, qtd) {
    if (!Array.isArray(lista) || !lista.length) {
      console.warn('[NexusGamesEngine] iniciarPartida: lista inválida ou vazia.');
      _deckAtual = null;
      return null;
    }

    const quantidade = qtd != null ? qtd : Math.min(QTD_PADRAO_PARTIDA, lista.length);

    _deckAtual = _sortearSubset(lista, quantidade);

    console.log('[NexusGamesEngine] partida iniciada:', _deckAtual.length, 'de', lista.length, 'itens.');

    return _deckAtual;
  }

  /**
   * Retorna o deck da partida em andamento, ou null se nenhuma
   * partida foi iniciada.
   *
   * @returns {Array|null}
   */
  function deckAtual() {
    return _deckAtual;
  }

  /**
   * Encerra a partida atual, limpando o deck.
   *
   * A lista original (e o banco carregado em NexusGamesSearch) NÃO
   * são afetados — uma nova partida pode ser iniciada imediatamente
   * via iniciarPartida().
   */
  function encerrarPartida() {
    _deckAtual = null;
    console.log('[NexusGamesEngine] partida encerrada.');
  }

  /* ══════════════════════════════════════════════════════════
     REGISTRO GLOBAL
  ══════════════════════════════════════════════════════════ */

  window.NexusGamesEngine = {
    iniciarPartida,
    deckAtual,
    encerrarPartida,
  };

}());