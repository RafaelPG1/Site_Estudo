/**
 * ASSISTENTE NEXUS — ia-search.js
 * Motor de busca interno. Zero DOM. Zero renderização. Zero I/O.
 *
 * PATCH score-v2:
 *   _STOPWORDS expandida com verbos de pergunta ("explique", "explica",
 *   "conceitue", "defina", "descreva", "mostre", "fale") e partículas
 *   de interrogação ("oq", "oque", "qual", "como", "por").
 *   Esses termos nunca aparecem nos resumos e inflavam o denominador
 *   do score, fazendo com que matches reais (ex: "dns") fossem divididos
 *   por um conjunto grande e ficassem abaixo do minScore.
 *
 *   _score() também ganhou um "boost de termo único": quando a query
 *   filtrada tem apenas 1 termo e ele é encontrado no chunk, o score
 *   mínimo garantido é 60 — evitando que siglas e termos técnicos
 *   curtos sejam descartados pelo threshold.
 */

(function () {
  'use strict';

  let _indice = [];

  /* ══════════════════════════════════════════════════════════
     NORMALIZAÇÃO
  ══════════════════════════════════════════════════════════ */

  function normalizarTexto(texto) {
    if (typeof texto !== 'string') return '';
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')   // remove pontuacao
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
     PATCH score-v2: adicionados verbos de pergunta e partículas
     de interrogação que nunca aparecem nos resumos e inflavam
     o denominador do score desnecessariamente.
  ══════════════════════════════════════════════════════════ */

  const _STOPWORDS = new Set([
    // artigos, preposições, conjunções originais
    'a','o','as','os','e','de','da','do','das','dos',
    'em','na','no','nas','nos','um','uma','uns','umas',
    'que','se','com','por','para','ao','aos','pelo','pela',
    'como','mais','mas','ou','ja','ate','sobre','entre',
    'qual','quais','quando','onde','porque','pois',
    'me','te','se','lhe','nos','vos','lhes',
    'isso','este','esta','esse','essa','aquele','aquela',
    'eh','sao','foi','tem','ter','ser','estar',

    // PATCH: partículas de interrogação informal
    'oq','oque','oqe','oq','oque',

    // PATCH: verbos de pergunta — nunca estão nos resumos
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

    // PATCH: partículas interrogativas adicionais
    'voce','vc','pra','pro',

    // PATCH informal-br: expressões coloquiais brasileiras que nunca aparecem
    // em resumos acadêmicos e inflariam o denominador do score inutilmente.

    // Interjeições / reações
    'cara','mano','mana','brother','bro','bi',
    'puts','poxa','putz','caramba','nossa','eita','uai','xi',
    'ah','ah','eh','oh','ih','uh','hm','hmm',
    'kkk','kkkk','kkkkk','kk','haha','hahaha','rsrs','rsrsrs','lol',
    'aeee','aeeeee','ueee',

    // Expressões de dificuldade / desabafo (só tokens únicos — o filtro opera por palavra)
    'travei','emperrei',
    'dificil','pesado','complicado','chato','saco',
    'socorro','perdido','perdida',

    // Conectores e transições informais
    // (versões acentuadas omitidas — normalizarTexto remove acentos antes do filtro)
    'ta','dai','ai','tipo','assim','entao',
    'ate','ne','num','nao','so','la',
    'tb','tbm','tmb','tambem',

    // Intensificadores informais vazios (mt/mto são só abreviações de chat)
    'mt','mto',
    'super','hiper','mega','ultra',

    // Confirmações / hesitações de chat
    'ok','okay','hm',

    // Saudações (redundante com _ehSaudacao mas protege o score também)
    'oi','ola','hey','hi','hello','eai','salve','opa',
    'bom','boa','noite','tarde','dia',
  ]);

  function _filtrarStopwords(termos) {
    const filtrados = termos.filter(function (t) { return !_STOPWORDS.has(t); });
    return filtrados.length > 0 ? filtrados : termos;
  }

  /* ══════════════════════════════════════════════════════════
     INDEXAÇÃO
  ══════════════════════════════════════════════════════════ */

  function indexarConteudo(conteudo) {
    _indice = [];

    if (!conteudo || !Array.isArray(conteudo.aulas)) {
      console.warn('[NexusSearch] indexarConteudo: conteúdo inválido ou sem aulas.');
      return;
    }

    function _prepararEntrada(texto, aula, secao, peso) {
      var tn       = normalizarTexto(texto);
      var palavras = tn.split(' ').filter(Boolean);
      return {
        texto:      texto,
        aula:       aula,
        secao:      secao,
        peso:       peso,
        textoNorm:  tn,
        stemsTexto: palavras.map(_stem).join(' '),
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

  function limparIndice() {
    _indice = [];
  }

  function estaIndexado() {
    return _indice.length > 0;
  }

  /* ══════════════════════════════════════════════════════════
     SCORE
     PATCH score-v2:
       - Boost de termo único: query filtrada com 1 termo encontrado
         garante score mínimo 60. Resolve siglas (DNS, TCP, IP)
         que após filtrar stopwords ficam com 1 só termo — antes
         dividiam cobertura=1/1=1.0 mas peso*100=100... porém
         o problema era o denominador inflado ANTES do filtro.
         Com o filtro correto isso já se resolve, mas o boost
         serve como segurança extra.
  ══════════════════════════════════════════════════════════ */

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
    const bonus     = (textoNorm.includes(queryNorm) || stemsTexto.includes(stemQuery)) ? 0.3 : 0;

    var scoreBase = Math.min(100, Math.round((cobertura + bonus) * peso * 100));

    // PATCH: boost de termo único — sigla/termo técnico encontrado sozinho
    // garante score mínimo de 60 para não ser descartado pelo threshold
    if (termos.length === 1 && acertos === 1 && scoreBase < 60) {
      scoreBase = Math.round(60 * peso);
    }

    return scoreBase;
  }

  /* ══════════════════════════════════════════════════════════
     BUSCA
  ══════════════════════════════════════════════════════════ */

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
    normalizarTexto,
    estaIndexado,
  };

}());