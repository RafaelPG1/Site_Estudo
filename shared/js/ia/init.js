/**
 * NEXUS — shared/js/ia/games/assistant.js
 *
 * Camada de sessão/orquestração do domínio "games".
 *
 * Responsabilidades:
 *   - Sortear um subconjunto aleatório de itens de uma lista, sem
 *     alterar a lista original (banco carregado por games/search.js)
 *   - Gerenciar o ciclo de vida da partida atual (deck ativo,
 *     reinício, encerramento)
 *   - Orquestrar o fluxo "carregar conteúdo → iniciar partida" usando
 *     games/search.js, sem conhecer o formato interno dos dados
 *
 * NÃO conhece:
 *   - Como os dados são carregados ou de onde vêm (delega
 *     integralmente a games/search.js)
 *   - O formato interno do conteúdo de cada jogo (se é
 *     "cartas", "questoes", "afirmacoes", etc.)
 *   - Regras de pontuação, renderização ou interação — isso é
 *     responsabilidade exclusiva do código de cada jogo
 *   - Estrutura de resumo ou quiz
 *   - DOM
 *
 * Papel no domínio games (equivalente a resumo/assistant.js e
 * quiz/assistant.js): camada de orquestração acima da camada de
 * dados. Assim como o assistant de resumo/quiz coordena busca +
 * worker sem reimplementar nenhum dos dois, este módulo coordena
 * carregamento (games/search.js) + sorteio/sessão, sem reimplementar
 * a lógica de cada jogo.
 *
 * GENERICIDADE ENTRE JOGOS
 * ────────────────────────
 * Este módulo opera sobre ARRAYS GENÉRICOS. Ele não sabe (nem precisa
 * saber) se os itens são cartas de flashcard, perguntas de show do
 * milhão ou afirmações de verdadeiro/falso. O código de cada jogo é
 * responsável por:
 *   1. Chamar iniciarPartida(lista, qtd) passando a lista correta
 *      (extraída via NexusGamesSearch.obterCampo('campo_do_jogo')).
 *   2. Interpretar os itens do deck retornado da forma que seu próprio
 *      jogo exige.
 *
 * Nenhuma alteração neste arquivo é necessária para adicionar um novo
 * jogo — apenas o próprio jogo precisa saber qual campo ler.
 *
 * Depende de: games/search.js (window.NexusGamesSearch)
 *
 * API pública: window.NexusGamesAssistant
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     DEPENDÊNCIA: NexusGamesSearch
  ══════════════════════════════════════════════════════════ */

  function _search() {
    if (typeof window.NexusGamesSearch === 'undefined') {
      throw new Error('[NexusGamesAssistant] NexusGamesSearch não encontrado. Carregue games/search.js antes.');
    }
    return window.NexusGamesSearch;
  }

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
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copia[i];
      copia[i] = copia[j];
      copia[j] = tmp;
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
   * @param {Array} lista
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
   * A `lista` de origem (gerenciada por quem chama — tipicamente um
   * array extraído do banco de games/search.js) permanece intacta.
   * Chamadas sucessivas de iniciarPartida() com a mesma `lista` sempre
   * sorteiam a partir dela, nunca do deck anterior — permitindo
   * "jogar novamente" com uma nova seleção aleatória.
   *
   * @param {Array} lista — lista de itens "jogáveis" do conteúdo
   *   carregado (cartas, perguntas, afirmações, etc. — interpretação
   *   é responsabilidade do jogo).
   * @param {number} [qtd] — quantidade de itens da partida.
   *   Padrão: 10 (ou o tamanho da lista, se for menor).
   * @returns {Array|null} deck da partida (nova array), ou null se
   *   `lista` for inválida/vazia
   */
  function iniciarPartida(lista, qtd) {
    if (!Array.isArray(lista) || !lista.length) {
      console.warn('[NexusGamesAssistant] iniciarPartida: lista inválida ou vazia.');
      _deckAtual = null;
      return null;
    }

    const quantidade = qtd != null ? qtd : Math.min(QTD_PADRAO_PARTIDA, lista.length);

    _deckAtual = _sortearSubset(lista, quantidade);

    console.log('[NexusGamesAssistant] partida iniciada:', _deckAtual.length, 'de', lista.length, 'itens.');

    return _deckAtual;
  }

  /**
   * Atalho que combina o carregamento de conteúdo (via
   * games/search.js) com o início de partida.
   *
   * Útil para o fluxo de inicialização padrão: carregar o conteúdo
   * do jogo/ano/conteúdo atuais e já sortear o primeiro deck.
   *
   * @param {{ jogo: string, ano: string, conteudo: string, prefixo?: string, arquivo?: string }} ctx
   *   — mesmo contrato de NexusGamesSearch.carregarConteudo().
   * @param {string} campoLista — nome do campo do banco que contém a
   *   lista de itens jogáveis (ex: 'cartas', 'questoes', 'afirmacoes').
   *   Definido por cada jogo — este módulo não assume nenhum nome fixo.
   * @param {number} [qtd] — quantidade de itens da partida (ver
   *   iniciarPartida()).
   *
   * @returns {Promise<Array|null>} deck da partida, ou null em caso
   *   de falha no carregamento ou campo ausente/vazio
   */
  async function carregarEIniciar(ctx, campoLista, qtd) {
    const banco = await _search().carregarConteudo(ctx);

    if (!banco) {
      _deckAtual = null;
      return null;
    }

    const lista = _search().obterCampo(campoLista);

    if (!Array.isArray(lista)) {
      console.warn('[NexusGamesAssistant] carregarEIniciar: campo "' + campoLista +
        '" não é uma lista válida no conteúdo de', ctx.jogo, '/', ctx.conteudo);
      _deckAtual = null;
      return null;
    }

    return iniciarPartida(lista, qtd);
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
   * O banco carregado em games/search.js NÃO é afetado — uma nova
   * partida pode ser iniciada imediatamente via iniciarPartida() ou
   * carregarEIniciar().
   */
  function encerrarPartida() {
    _deckAtual = null;
    console.log('[NexusGamesAssistant] partida encerrada.');
  }

  /* ══════════════════════════════════════════════════════════
     REGISTRO GLOBAL
  ══════════════════════════════════════════════════════════ */

  window.NexusGamesAssistant = {
    iniciarPartida,
    carregarEIniciar,
    deckAtual,
    encerrarPartida,
  };

}());