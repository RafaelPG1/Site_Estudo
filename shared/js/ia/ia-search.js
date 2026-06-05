/**
 * ASSISTENTE NEXUS — ia-search.js
 * Motor de busca interno. Zero DOM. Zero renderização. Zero I/O.
 *
 * Responsabilidades:
 *   - Receber conteúdo pronto e indexar
 *   - Buscar por query textual
 *   - Normalizar texto
 *   - Calcular score
 *
 * NÃO carrega arquivos. NÃO monta paths. NÃO conhece o filesystem.
 * Quem carrega conteúdo é o NexusLoader (ia-loader.js).
 *
 * API pública: window.NexusSearch
 *
 * Dependências: nenhuma.
 *
 * ── CHANGELOG ───────────────────────────────────────────────
 * FIX 1 — normalizarTexto() agora é a fonte única de normalização.
 *          ia.js usa NexusSearch.normalizarTexto() em vez de replicar
 *          a função localmente. Eliminada duplicação.
 *
 * FIX 2 — _getIndice() removido da API pública. Substituído por
 *          estaIndexado(), que expõe apenas o booleano necessário.
 *          ia.js não acessa mais detalhes internos do índice.
 *
 * FIX 9 — Pré-processamento no índice: textoNorm e stemsTexto agora
 *          são calculados UMA VEZ na indexação e armazenados junto
 *          a cada entrada. buscar() e _score() reutilizam esses
 *          campos em vez de recalcular a cada query.
 * ────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── ESTADO INTERNO ──────────────────────────────────────── */

  // FIX 9: cada entrada agora carrega textoNorm e stemsTexto
  // pré-computados. Formato:
  // { texto, aula, secao, peso, textoNorm, stemsTexto }
  let _indice = [];

  /* ══════════════════════════════════════════════════════════
     NORMALIZAÇÃO
     ══════════════════════════════════════════════════════════ */

  /**
   * Normaliza texto para busca:
   *   - minúsculo
   *   - remove acentos (NFD + strip combining marks)
   *   - colapsa espaços
   *
   * FIX 1: esta é a função canônica. ia.js delega para cá via
   * NexusSearch.normalizarTexto() em vez de manter cópia local.
   *
   * @param {string} texto
   * @returns {string}
   */
  function normalizarTexto(texto) {
    if (typeof texto !== 'string') return '';
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* ══════════════════════════════════════════════════════════
     EXTRAÇÃO DE BLOCOS
     ══════════════════════════════════════════════════════════ */

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
        if (bloco.titulo)  textos.push(bloco.titulo);
        if (bloco.texto)   textos.push(bloco.texto);
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
     STEMMING
     ══════════════════════════════════════════════════════════ */

  function _stem(termo) {
    if (termo.length <= 4) return termo;

    const regras = [
      'amentos', 'imentos', 'amento',  'imento',
      'acoes',   'icoes',   'acao',    'icao',
      'adores',  'adoras',  'ador',    'adora',
      'mente',
      'ando',    'endo',    'indo',
      'ados',    'idas',    'idos',    'ado',    'ida',    'ido',
      'ares',    'eres',    'ires',    'ar',     'er',     'ir',
      'icas',    'icos',    'ica',     'ico',
      'osas',    'osos',    'osa',     'oso',
      'istas',   'ista',
      'veis',    'vel',
      'oes',     'aos',
      'es',      'os',      'as',
    ];

    for (var i = 0; i < regras.length; i++) {
      var suf = regras[i];
      if (termo.endsWith(suf) && termo.length - suf.length >= 4) {
        return termo.slice(0, termo.length - suf.length);
      }
    }

    return termo;
  }

  /* ══════════════════════════════════════════════════════════
     STOPWORDS
     ══════════════════════════════════════════════════════════ */

  const _STOPWORDS = new Set([
    'a','o','as','os','e','de','da','do','das','dos',
    'em','na','no','nas','nos','um','uma','uns','umas',
    'que','se','com','por','para','ao','aos','pelo','pela',
    'como','mais','mas','ou','ja','ate','sobre','entre',
    'qual','quais','quando','onde','porque','pois',
    'me','te','se','lhe','nos','vos','lhes',
    'isso','este','esta','esse','essa','aquele','aquela',
    'eh','sao','foi','tem','ter','ser','estar',
  ]);

  function _filtrarStopwords(termos) {
    const filtrados = termos.filter(function (t) { return !_STOPWORDS.has(t); });
    return filtrados.length > 0 ? filtrados : termos;
  }

  /* ══════════════════════════════════════════════════════════
     INDEXAÇÃO
     ══════════════════════════════════════════════════════════ */

  /**
   * Recebe o conteúdo bruto e constrói o índice.
   * Sempre substitui o índice anterior — não há merge.
   *
   * FIX 9: cada entrada recebe textoNorm e stemsTexto no momento
   * da indexação. _score() reutiliza esses campos sem recalcular.
   *
   * @param {object} conteudo — { aulas: [...] }
   */
  function indexarConteudo(conteudo) {
    _indice = [];

    if (!conteudo || !Array.isArray(conteudo.aulas)) {
      console.warn('[NexusSearch] indexarConteudo: conteúdo inválido ou sem aulas.');
      return;
    }

    // FIX 9: helper que pré-processa um texto no momento da indexação.
    function _prepararEntrada(texto, aula, secao, peso) {
      var tn    = normalizarTexto(texto);
      var palavras = tn.split(' ').filter(Boolean);
      return {
        texto:      texto,
        aula:       aula,
        secao:      secao,
        peso:       peso,
        textoNorm:  tn,                          // normalizado — calculado 1x
        stemsTexto: palavras.map(_stem).join(' '), // stems — calculado 1x
      };
    }

    conteudo.aulas.forEach(function (aula) {
      const nomeAula = aula.aula || '';

      if (aula.ideia_central) {
        _indice.push(_prepararEntrada(aula.ideia_central, nomeAula, 'Ideia Central', 1.5));
      }

      if (Array.isArray(aula.secoes)) {
        aula.secoes.forEach(function (secao) {
          const tituloSecao = secao.titulo || '';

          if (tituloSecao) {
            _indice.push(_prepararEntrada(tituloSecao, nomeAula, tituloSecao, 1.2));
          }

          if (Array.isArray(secao.blocos)) {
            secao.blocos.forEach(function (bloco) {
              _extrairBloco(bloco).forEach(function (trecho) {
                if (trecho && trecho.trim()) {
                  _indice.push(_prepararEntrada(trecho.trim(), nomeAula, tituloSecao, 1.0));
                }
              });
            });
          }
        });
      }
    });

    console.log('[NexusSearch] indexado:', _indice.length, 'trechos de', conteudo.aulas.length, 'aulas.');
  }

  /**
   * Limpa o índice em memória.
   */
  function limparIndice() {
    _indice = [];
  }

  /**
   * FIX 2: substitui _getIndice() na lógica de ia.js.
   * Expõe apenas o booleano necessário — sem vazar o array interno.
   *
   * @returns {boolean} true se o índice possui ao menos uma entrada.
   */
  function estaIndexado() {
    return _indice.length > 0;
  }

  /* ══════════════════════════════════════════════════════════
     SCORE
     ══════════════════════════════════════════════════════════ */

  /**
   * Calcula score de relevância entre query e entrada do índice.
   *
   * FIX 9: recebe textoNorm e stemsTexto prontos da entrada —
   * não normaliza nem stemiza o texto do índice por chamada.
   *
   * @param {string}   queryNorm   — query já normalizada
   * @param {string}   textoNorm   — campo pré-computado da entrada
   * @param {string}   stemsTexto  — campo pré-computado da entrada
   * @param {number}   peso
   * @returns {number} 0–100
   */
  function _score(queryNorm, textoNorm, stemsTexto, peso) {
    if (!queryNorm || !textoNorm) return 0;

    const todosTermos = queryNorm.split(' ').filter(Boolean);
    if (!todosTermos.length) return 0;

    const termos = _filtrarStopwords(todosTermos);

    var acertos = 0;
    termos.forEach(function (t) {
      var stemT = _stem(t);
      if (textoNorm.includes(t) || stemsTexto.includes(stemT)) {
        acertos++;
      }
    });

    const cobertura = acertos / termos.length;
    const stemQuery = termos.map(_stem).join(' ');
    const bonus = (textoNorm.includes(queryNorm) || stemsTexto.includes(stemQuery)) ? 0.3 : 0;

    return Math.min(100, Math.round((cobertura + bonus) * peso * 100));
  }

  /* ══════════════════════════════════════════════════════════
     BUSCA
     ══════════════════════════════════════════════════════════ */

  /**
   * Busca no índice as entradas mais relevantes para a pergunta.
   * FIX 9: usa textoNorm/stemsTexto pré-computados de cada entrada.
   *
   * @param {string} pergunta
   * @param {{ topK?: number, minScore?: number }} [opcoes]
   * @returns {{ score: number, texto: string, aula: string, secao: string }[]}
   */
  function buscar(pergunta, opcoes) {
    const topK     = (opcoes && opcoes.topK)            || 3;
    const minScore = (opcoes && opcoes.minScore != null) ? opcoes.minScore : 10;

    const queryNorm = normalizarTexto(pergunta);

    if (!queryNorm || !_indice.length) {
      console.warn('[NexusSearch] buscar: query vazia ou índice vazio.');
      return [];
    }

    const todos = _indice.map(function (entrada) {
      return {
        // FIX 9: passa campos pré-computados — sem normalizar/stemizar aqui
        score: _score(queryNorm, entrada.textoNorm, entrada.stemsTexto, entrada.peso),
        texto: entrada.texto,
        aula:  entrada.aula,
        secao: entrada.secao,
      };
    });

    const resultados = todos
      .sort(function (a, b) { return b.score - a.score; })
      .filter(function (r) { return r.score >= minScore; })
      .slice(0, topK);

    console.log('[NexusSearch] buscar: query=' + JSON.stringify(queryNorm) +
                ' | chunks=' + _indice.length +
                ' | aprovados=' + resultados.length);

    return resultados;
  }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
     ══════════════════════════════════════════════════════════ */
  window.NexusSearch = {
    indexarConteudo,
    limparIndice,
    buscar,
    normalizarTexto,  // FIX 1: fonte única — ia.js usa daqui
    estaIndexado,     // FIX 2: substitui _getIndice() na lógica de negócio
    // _getIndice removido da API pública.
    // Se precisar para diagnóstico, use o console: window.NexusSearch não o expõe.
  };

}());