/**
 * NEXUS — shared/js/ia/core/text-utils.js
 *
 * Utilitários de texto compartilhados entre resumo/search.js e quiz/search.js.
 *
 * Responsabilidades:
 *   - Normalização de texto (acentos, caixa, pontuação)
 *   - Stemming simples para português
 *   - Stopwords
 *   - Função de score BM25-simplificado
 *   - Preparação de entrada para índice
 *
 * NÃO conhece:
 *   - Estrutura de resumo
 *   - Estrutura de quiz
 *   - DOM
 *   - Estado de sessão
 *
 * API pública: window.NexusTextUtils
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     NORMALIZAÇÃO
  ══════════════════════════════════════════════════════════ */

  /**
   * Normaliza texto para busca: minúsculas, sem acentos, sem pontuação.
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
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* ══════════════════════════════════════════════════════════
     STEMMING
  ══════════════════════════════════════════════════════════ */

  /**
   * Stemming simples para português.
   * Remove sufixos comuns para melhorar recall na busca.
   *
   * @param {string} termo
   * @returns {string}
   */
  function stem(termo) {
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

  const STOPWORDS = new Set([
    'a','o','as','os','e','de','da','do','das','dos',
    'em','na','no','nas','nos','um','uma','uns','umas',
    'que','se','com','por','para','ao','aos','pelo','pela',
    'como','mais','mas','ou','ja','ate','sobre','entre',
    'qual','quais','quando','onde','porque','pois',
    'me','te','se','lhe','nos','vos','lhes',
    'isso','este','esta','esse','essa','aquele','aquela',
    'eh','sao','foi','tem','ter','ser','estar',
    'oq','oque','oqe',
    'explique','explica','explicar','explicacao',
    'conceitue','conceitua','conceituar',
    'defina','define','definir','definicao',
    'descreva','descreve','descrever','descricao',
    'mostre','mostra','mostrar',
    'fale','fala','falar',
    'diga','diz','dizer',
    'liste','lista','listar',
    'cite','citar',
    'resuma','resumir',
    'voce','vc','pra','pro',
    'cara','mano','mana','brother','bro','bi',
    'puts','poxa','putz','caramba','nossa','eita','uai','xi',
    'ah','oh','ih','uh','hm','hmm',
    'kkk','kkkk','kkkkk','kk','haha','hahaha','rsrs','rsrsrs','lol',
    'aeee','aeeeee','ueee',
    'travei','emperrei',
    'dificil','pesado','complicado','chato','saco',
    'socorro','perdido','perdida',
    'ta','dai','ai','tipo','assim','entao',
    'ne','num','nao','so','la',
    'tb','tbm','tmb','tambem',
    'mt','mto',
    'super','hiper','mega','ultra',
    'ok','okay',
    'oi','ola','hey','hi','hello','eai','salve','opa',
    'bom','boa','noite','tarde','dia',
  ]);

  /**
   * Remove stopwords de uma lista de termos.
   * Se todos forem stopwords, retorna a lista original para não esvaziar a query.
   *
   * @param {string[]} termos
   * @returns {string[]}
   */
  function filtrarStopwords(termos) {
    const filtrados = termos.filter(function (t) { return !STOPWORDS.has(t); });
    return filtrados.length > 0 ? filtrados : termos;
  }

  /* ══════════════════════════════════════════════════════════
     SCORE
  ══════════════════════════════════════════════════════════ */

  /**
   * Calcula score de relevância entre query e entrada do índice.
   *
   * @param {string} queryNorm   — query normalizada
   * @param {string} textoNorm   — texto da entrada normalizado
   * @param {string} stemsTexto  — stems do texto da entrada
   * @param {number} peso        — peso da entrada (ex: 1.5 para ideia central)
   * @returns {number} 0–100
   */
  function score(queryNorm, textoNorm, stemsTexto, peso) {
    if (!queryNorm || !textoNorm) return 0;

    const todosTermos = queryNorm.split(' ').filter(Boolean);
    if (!todosTermos.length) return 0;

    const termos = filtrarStopwords(todosTermos);

    var acertos = 0;
    termos.forEach(function (t) {
      var stemT = stem(t);
      if (textoNorm.includes(t) || stemsTexto.includes(stemT)) {
        acertos++;
      }
    });

    const cobertura = acertos / termos.length;
    const stemQuery = termos.map(stem).join(' ');
    const bonus     = (textoNorm.includes(queryNorm) || stemsTexto.includes(stemQuery)) ? 0.3 : 0;

    var scoreBase = Math.min(100, Math.round((cobertura + bonus) * peso * 100));

    if (termos.length === 1 && acertos === 1 && scoreBase < 60) {
      scoreBase = Math.round(60 * peso);
    }

    return scoreBase;
  }

  /* ══════════════════════════════════════════════════════════
     PREPARAÇÃO DE ENTRADA DE ÍNDICE
  ══════════════════════════════════════════════════════════ */

  /**
   * Prepara um objeto de entrada para inserção num índice de busca.
   * Pré-computa textoNorm e stemsTexto para evitar recalcular a cada busca.
   *
   * @param {string} texto
   * @param {string} aula
   * @param {string} secao
   * @param {number} peso
   * @returns {{ texto, aula, secao, peso, textoNorm, stemsTexto }}
   */
  function prepararEntrada(texto, aula, secao, peso) {
    var tn       = normalizarTexto(texto);
    var palavras = tn.split(' ').filter(Boolean);
    return {
      texto:      texto,
      aula:       aula,
      secao:      secao,
      peso:       peso,
      textoNorm:  tn,
      stemsTexto: palavras.map(stem).join(' '),
    };
  }

  /* ══════════════════════════════════════════════════════════
     REGISTRO GLOBAL
  ══════════════════════════════════════════════════════════ */

  window.NexusTextUtils = {
    normalizarTexto,
    stem,
    STOPWORDS,
    filtrarStopwords,
    score,
    prepararEntrada,
  };

}());