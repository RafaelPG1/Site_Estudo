/**
 * NEXUS — shared/js/ia/resumo/search.js
 *
 * Motor de busca exclusivo para conteúdo de resumo.
 *
 * Responsabilidades:
 *   - Indexar conteúdo estruturado de resumo (aulas, seções, blocos)
 *   - Buscar trechos relevantes por query de texto livre
 *   - Gerenciar o ciclo de vida do índice (limpar, verificar estado)
 *
 * NÃO conhece:
 *   - Quiz, questões, gabarito, feedback
 *   - Token de sessão
 *   - DOM
 *   - Estado do assistente
 *
 * Depende de: core/text-utils.js (window.NexusTextUtils)
 *
 * API pública: window.NexusResumoSearch
 * Alias compatível: window.NexusSearch (para não quebrar código existente)
 *   — NexusSearch expõe apenas as funções de resumo.
 *     As funções de quiz, que também estavam em NexusSearch, agora
 *     ficam em window.NexusQuizSearch (quiz/search.js).
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     DEPENDÊNCIA: NexusTextUtils
  ══════════════════════════════════════════════════════════ */

  function _utils() {
    if (typeof window.NexusTextUtils === 'undefined') {
      throw new Error('[NexusResumoSearch] NexusTextUtils não encontrado. Carregue core/text-utils.js antes.');
    }
    return window.NexusTextUtils;
  }

  /* ══════════════════════════════════════════════════════════
     ÍNDICE
  ══════════════════════════════════════════════════════════ */

  /** Índice de conteúdo de resumo. Alimentado por indexarConteudo(). */
  let _indice = [];

  /* ══════════════════════════════════════════════════════════
     EXTRAÇÃO DE BLOCOS
  ══════════════════════════════════════════════════════════ */

/**
   * Extrai textos buscáveis de um bloco de conteúdo de resumo.
   * Suporta tipos: texto, destaque, subtitulo, topico, lista, exemplo.
   *
   * CONTRATO — duplicação intencional com _extrairTextosBloco()
   * (resumo/assistant.js):
   *   Esta versão alimenta o ÍNDICE PERSISTENTE e ponderado
   *   (NexusResumoSearch.indexarConteudo → NexusTextUtils.prepararEntrada),
   *   usado pelo motor de busca local de UMA disciplina por vez.
   *   Por isso ignora listas/itens vazios (_joinLista retorna null),
   *   evitando entradas vazias no índice.
   *
   *   _extrairTextosBloco() alimenta um cache EFÊMERO e não-ponderado,
   *   usado só pela busca global entre disciplinas
   *   (_executarBuscaGlobal/_scoreBuscaGlobal), que tem scorer próprio
   *   e já ignora textos vazios.
   *
   *   Consumidores diferentes — não unificar. Qualquer novo `tipo`
   *   de bloco suportado aqui deve ser replicado lá, e vice-versa.
   *
   * @param {object} bloco
   * @returns {string[]}
   */
  function _extrairBloco(bloco) {
    if (!bloco || !bloco.tipo) return [];
    const textos = [];

    function _joinLista(arr) {
      if (!Array.isArray(arr) || !arr.length) return null;
      return arr.join(' ');
    }

    switch (bloco.tipo) {
      case 'texto':
      case 'destaque':
      case 'subtitulo':
        if (bloco.texto) textos.push(bloco.texto);
        break;

      case 'topico':
        if (bloco.titulo) textos.push(bloco.titulo);
        if (bloco.texto)  textos.push(bloco.texto);
        var tl = _joinLista(bloco.lista);
        if (tl) textos.push(tl);
        break;

      case 'lista':
        if (bloco.titulo) textos.push(bloco.titulo);
        var il = _joinLista(bloco.itens);
        if (il) textos.push(il);
        break;

      case 'exemplo':
        if (bloco.titulo) textos.push(bloco.titulo);
        if (bloco.texto)  textos.push(bloco.texto);
        if (bloco.detalhe && typeof bloco.detalhe === 'string') {
          textos.push(bloco.detalhe);
        }
        break;

      default:
        break;
    }

    return textos;
  }

  /* ══════════════════════════════════════════════════════════
     INDEXAÇÃO
  ══════════════════════════════════════════════════════════ */

  /**
   * Indexa conteúdo de resumo.
   * Estrutura esperada: { aulas: [{ aula, ideia_central, secoes: [{ titulo, blocos }] }] }
   *
   * Pesos:
   *   1.5 — ideia central da aula (mais relevante)
   *   1.2 — título de seção
   *   1.0 — conteúdo de blocos
   *
   * @param {object} conteudo — estrutura { aulas: [...] }
   */
  function indexarConteudo(conteudo) {
    _indice = [];

    if (!conteudo || !Array.isArray(conteudo.aulas)) {
      console.warn('[NexusResumoSearch] indexarConteudo: conteúdo inválido ou sem aulas.');
      return;
    }

    const u = _utils();

    conteudo.aulas.forEach(function (aula) {
      const nomeAula = aula.aula || '';

      if (aula.ideia_central) {
        _indice.push(u.prepararEntrada(aula.ideia_central, nomeAula, 'Ideia Central', 1.5));
      }

      if (Array.isArray(aula.secoes)) {
        aula.secoes.forEach(function (secao) {
          const tituloSecao = secao.titulo || '';

          if (tituloSecao) {
            _indice.push(u.prepararEntrada(tituloSecao, nomeAula, tituloSecao, 1.2));
          }

          if (Array.isArray(secao.blocos)) {
            secao.blocos.forEach(function (bloco) {
              _extrairBloco(bloco).forEach(function (trecho) {
                if (trecho && trecho.trim()) {
                  _indice.push(u.prepararEntrada(trecho.trim(), nomeAula, tituloSecao, 1.0));
                }
              });
            });
          }
        });
      }
    });

    console.log('[NexusResumoSearch] indexado:', _indice.length, 'trechos de',
      conteudo.aulas.length, 'aulas.');
  }

  /**
   * Limpa o índice de resumo.
   */
  function limparIndice() {
    _indice = [];
  }

  /**
   * Retorna true se o índice tiver ao menos um trecho indexado.
   *
   * @returns {boolean}
   */
  function estaIndexado() {
    return _indice.length > 0;
  }

  /* ══════════════════════════════════════════════════════════
     BUSCA
  ══════════════════════════════════════════════════════════ */

  /**
   * Busca trechos relevantes no índice de resumo.
   *
   * @param {string} pergunta
   * @param {{ topK?: number, minScore?: number }} [opcoes]
   * @returns {{ score: number, texto: string, aula: string, secao: string }[]}
   */
  function buscar(pergunta, opcoes) {
    const topK     = (opcoes && opcoes.topK)            || 3;
    const minScore = (opcoes && opcoes.minScore != null) ? opcoes.minScore : 10;

    const u = _utils();
    const queryNorm = u.normalizarTexto(pergunta);

    if (!queryNorm || !_indice.length) {
      if (_indice.length === 0) {
        console.warn('[NexusResumoSearch] buscar: índice vazio.');
      }
      return [];
    }

    const todos = _indice.map(function (entrada) {
      return {
        score: u.score(queryNorm, entrada.textoNorm, entrada.stemsTexto, entrada.peso),
        texto: entrada.texto,
        aula:  entrada.aula,
        secao: entrada.secao,
      };
    });

    const resultados = todos
      .sort(function (a, b) { return b.score - a.score; })
      .filter(function (r) { return r.score >= minScore; })
      .slice(0, topK);

    console.log('[NexusResumoSearch] buscar: query=' + JSON.stringify(queryNorm) +
      ' | chunks=' + _indice.length +
      ' | aprovados=' + resultados.length);

    return resultados;
  }

  /* ══════════════════════════════════════════════════════════
     NORMALIZAÇÃO — exposta para uso pelo assistente
  ══════════════════════════════════════════════════════════ */

  /**
   * Proxy para NexusTextUtils.normalizarTexto.
   * Mantém compatibilidade com código que chama NexusSearch.normalizarTexto().
   *
   * @param {string} str
   * @returns {string}
   */
  function normalizarTexto(str) {
    return _utils().normalizarTexto(str);
  }

  /* ══════════════════════════════════════════════════════════
     REGISTRO GLOBAL
  ══════════════════════════════════════════════════════════ */

  const api = {
    indexarConteudo,
    buscar,
    limparIndice,
    estaIndexado,
    normalizarTexto,
  };

  window.NexusResumoSearch = api;

  // Alias de compatibilidade: NexusSearch continua apontando para as funções
  // de resumo, como era antes. Quiz agora usa NexusQuizSearch separadamente.
  window.NexusSearch = api;

}());