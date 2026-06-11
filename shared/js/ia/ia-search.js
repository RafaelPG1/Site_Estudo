/**
 * ASSISTENTE NEXUS — ia-search.js  v3.0 (QUIZ-ISOLATION)
 *
 * BREAKING CHANGE — Índices completamente separados:
 *
 *   _indiceResumo  — alimentado por indexarConteudo()
 *                    usado por buscar() em todos os contextos
 *
 *   _indiceQuiz    — alimentado por _indexarQuestoesInterno()
 *                    NUNCA exposto via buscar() público
 *                    acessível SOMENTE via buscarQuiz() / buscarQuestaoPorNumero()
 *                    exige token de sessão gerado pelo template_init
 *
 * Qualquer tentativa de chamar indexarQuestoes() ou as funções de busca
 * de quiz sem o token correto é silenciosamente bloqueada e os índices
 * são retornados vazios — sem erro, sem exceção, sem vazamento.
 *
 * TOKEN DE SESSÃO:
 *   template_init.js deve chamar NexusSearch.autorizarQuiz(token) ANTES
 *   de qualquer indexação de questões.
 *   O token é gerado uma vez por sessão de quiz (crypto.randomUUID ou
 *   Math.random fallback) e armazenado em window.__NEXUS_QUIZ_TOKEN__.
 *   Ao sair do quiz (unload / visibilitychange → hidden), template_init
 *   chama NexusSearch.revogarQuiz() para zerar o token e o índice.
 *
 * API PÚBLICA (não muda para consumidores de resumo):
 *   NexusSearch.indexarConteudo(conteudo)
 *   NexusSearch.buscar(pergunta, opcoes)
 *   NexusSearch.limparIndice()       — limpa APENAS _indiceResumo
 *   NexusSearch.estaIndexado()       — reflete apenas _indiceResumo
 *   NexusSearch.normalizarTexto(str)
 *
 * API RESTRITA (quiz — exige token):
 *   NexusSearch.autorizarQuiz(token)
 *   NexusSearch.revogarQuiz()
 *   NexusSearch.indexarQuestoes(questoes, modo, token)
 *   NexusSearch.buscarQuiz(pergunta, opcoes, token)
 *   NexusSearch.buscarQuestaoPorNumero(numero, token)
 *   NexusSearch.estaIndexadoQuiz(token)
 *   NexusSearch.limparIndiceQuiz(token)
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     ÍNDICES SEPARADOS
  ══════════════════════════════════════════════════════════ */

  /** Índice de conteúdo de resumo — alimentado por indexarConteudo() */
  let _indiceResumo = [];

  /**
   * Índice de questões de quiz — alimentado por _indexarQuestoesInterno().
   * Cada entrada pode conter _q (objeto completo com gabarito/feedback).
   * NUNCA sai deste módulo via buscar() público.
   */
  let _indiceQuiz = [];

  /* ══════════════════════════════════════════════════════════
     TOKEN DE SESSÃO DE QUIZ
  ══════════════════════════════════════════════════════════ */

  /**
   * Token autorizado para operações de quiz nesta sessão.
   * null = quiz não autorizado.
   * Qualquer chamada de API de quiz com token diferente é bloqueada.
   */
  let _tokenQuizAtivo = null;

  /**
   * Verifica se o token fornecido é válido para acesso ao quiz.
   * Nunca lança exceção — retorna false silenciosamente.
   *
   * @param {string|undefined} token
   * @returns {boolean}
   */
  function _tokenValido(token) {
    if (!token || typeof token !== 'string') return false;
    if (!_tokenQuizAtivo)                    return false;
    return token === _tokenQuizAtivo;
  }

  /**
   * Registra o token de sessão de quiz.
   * Chamado exclusivamente por template_init.js durante o boot.
   *
   * @param {string} token
   */
  function autorizarQuiz(token) {
    if (!token || typeof token !== 'string') {
      console.warn('[NexusSearch] autorizarQuiz: token inválido ignorado.');
      return;
    }
    _tokenQuizAtivo = token;
    console.log('[NexusSearch] sessão de quiz autorizada.');
  }

  /**
   * Invalida o token e zera imediatamente o índice de quiz.
   * Chamado por template_init.js em beforeunload / pagehide / visibilitychange.
   * Após este ponto qualquer acesso ao índice de quiz retorna resultado vazio.
   */
  function revogarQuiz() {
    _tokenQuizAtivo = null;
    _indiceQuiz     = [];
    console.log('[NexusSearch] sessão de quiz revogada — índice de quiz zerado.');
  }

  /* ══════════════════════════════════════════════════════════
     NORMALIZAÇÃO
  ══════════════════════════════════════════════════════════ */

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
     EXTRAÇÃO DE BLOCOS (resumo)
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

  function _filtrarStopwords(termos) {
    const filtrados = termos.filter(function (t) { return !_STOPWORDS.has(t); });
    return filtrados.length > 0 ? filtrados : termos;
  }

  /* ══════════════════════════════════════════════════════════
     SCORE
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

    if (termos.length === 1 && acertos === 1 && scoreBase < 60) {
      scoreBase = Math.round(60 * peso);
    }

    return scoreBase;
  }

  /* ══════════════════════════════════════════════════════════
     HELPERS DE PREPARAÇÃO DE ENTRADA
  ══════════════════════════════════════════════════════════ */

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

  /* ══════════════════════════════════════════════════════════
     INDEXAÇÃO DE RESUMO (público)
  ══════════════════════════════════════════════════════════ */

  /**
   * Indexa conteúdo de resumo em _indiceResumo.
   * NÃO toca em _indiceQuiz.
   *
   * @param {object} conteudo — estrutura { aulas: [...] }
   */
  function indexarConteudo(conteudo) {
    _indiceResumo = [];

    if (!conteudo || !Array.isArray(conteudo.aulas)) {
      console.warn('[NexusSearch] indexarConteudo: conteúdo inválido ou sem aulas.');
      return;
    }

    conteudo.aulas.forEach(function (aula) {
      const nomeAula = aula.aula || '';

      if (aula.ideia_central) {
        _indiceResumo.push(_prepararEntrada(aula.ideia_central, nomeAula, 'Ideia Central', 1.5));
      }

      if (Array.isArray(aula.secoes)) {
        aula.secoes.forEach(function (secao) {
          const tituloSecao = secao.titulo || '';

          if (tituloSecao) {
            _indiceResumo.push(_prepararEntrada(tituloSecao, nomeAula, tituloSecao, 1.2));
          }

          if (Array.isArray(secao.blocos)) {
            secao.blocos.forEach(function (bloco) {
              _extrairBloco(bloco).forEach(function (trecho) {
                if (trecho && trecho.trim()) {
                  _indiceResumo.push(_prepararEntrada(trecho.trim(), nomeAula, tituloSecao, 1.0));
                }
              });
            });
          }
        });
      }
    });

    console.log('[NexusSearch] indexado:', _indiceResumo.length, 'trechos de resumo de', conteudo.aulas.length, 'aulas.');
  }

  /**
   * Limpa APENAS o índice de resumo.
   * O índice de quiz NÃO é afetado por esta função —
   * use limparIndiceQuiz(token) para isso.
   */
  function limparIndice() {
    _indiceResumo = [];
  }

  /** Retorna true se o índice de resumo tiver ao menos um trecho. */
  function estaIndexado() {
    return _indiceResumo.length > 0;
  }

  /* ══════════════════════════════════════════════════════════
     INDEXAÇÃO DE QUIZ (restrita por token)
  ══════════════════════════════════════════════════════════ */

  /**
   * Implementação interna real de indexação de quiz.
   * Só chamada após verificação de token.
   *
   * Armazena objeto completo (_q) mas SOMENTE em _indiceQuiz —
   * nunca mistura com _indiceResumo.
   */
  function _indexarQuestoesInterno(questoes, modo) {
    _indiceQuiz = [];

    if (!questoes || !Array.isArray(questoes[modo]) || !questoes[modo].length) {
      console.warn('[NexusSearch] indexarQuestoes: modo "' + modo + '" não encontrado ou vazio.');
      return;
    }

    var lista = (window.__NEXUS_QUESTOES_VISUAIS__ && window.__NEXUS_QUESTOES_VISUAIS__.length)
      ? window.__NEXUS_QUESTOES_VISUAIS__
      : questoes[modo];

    lista.forEach(function (q, i) {
      var numero = i + 1;
      var aula   = q.aula || '';

      // Texto buscável: apenas enunciado e alternativas (sem gabarito/feedback)
      var partes = [];
      if (q.texto)    partes.push(q.texto);
      if (q.question) partes.push(q.question);
      if (Array.isArray(q.assertions)) partes.push(q.assertions.join(' '));
      if (Array.isArray(q.options))    partes.push(q.options.join(' '));

      var textoCompleto = partes.join(' ');
      var tn = normalizarTexto(textoCompleto);

      _indiceQuiz.push({
        texto:      textoCompleto,
        aula:       aula,
        secao:      modo,
        peso:       1.0,
        textoNorm:  tn,
        stemsTexto: tn.split(' ').filter(Boolean).map(_stem).join(' '),
        _numero:    numero,
        _modo:      modo,
        _q:         q,   // objeto completo — permanece SOMENTE em _indiceQuiz
      });

      // Feedback indexado separadamente (peso menor) — mas também somente em _indiceQuiz
      if (q.feedback) {
        var fnorm = normalizarTexto(q.feedback);
        _indiceQuiz.push({
          texto:      q.feedback,
          aula:       aula,
          secao:      modo + '/feedback',
          peso:       0.8,
          textoNorm:  fnorm,
          stemsTexto: fnorm.split(' ').filter(Boolean).map(_stem).join(' '),
          _numero:    numero,
          _modo:      modo,
          _q:         q,
        });
      }
    });

    console.log('[NexusSearch] indexarQuestoes: ' + lista.length + ' questões indexadas para modo "' + modo + '".');
  }

  /**
   * API pública de indexação de quiz — exige token.
   * Chamado por ia.js > _garantirConteudo() SOMENTE quando
   * window.__NEXUS_QUIZ_MODO__ está definido.
   *
   * @param {object} questoes
   * @param {string} modo
   * @param {string} token  — deve coincidir com o token autorizado
   */
  function indexarQuestoes(questoes, modo, token) {
    if (!_tokenValido(token)) {
      console.warn('[NexusSearch] indexarQuestoes bloqueado: token inválido ou quiz não autorizado.');
      return;
    }
    _indexarQuestoesInterno(questoes, modo);
  }

  /**
   * Limpa o índice de quiz.
   * Exige token — fora do template_init não tem efeito.
   *
   * @param {string} token
   */
  function limparIndiceQuiz(token) {
    if (!_tokenValido(token)) {
      console.warn('[NexusSearch] limparIndiceQuiz bloqueado: token inválido.');
      return;
    }
    _indiceQuiz = [];
    console.log('[NexusSearch] índice de quiz limpo via token.');
  }

  /** Retorna true se o índice de quiz estiver ativo e populado. Exige token. */
  function estaIndexadoQuiz(token) {
    if (!_tokenValido(token)) return false;
    return _indiceQuiz.length > 0;
  }

  /* ══════════════════════════════════════════════════════════
     BUSCA DE RESUMO (pública — sempre usa _indiceResumo)
  ══════════════════════════════════════════════════════════ */

  /**
   * Busca no índice de RESUMO.
   * Nunca acessa _indiceQuiz.
   *
   * @param {string} pergunta
   * @param {object} [opcoes]
   * @returns {{ score, texto, aula, secao }[]}
   */
  function buscar(pergunta, opcoes) {
    const topK     = (opcoes && opcoes.topK)            || 3;
    const minScore = (opcoes && opcoes.minScore != null) ? opcoes.minScore : 10;

    const queryNorm = normalizarTexto(pergunta);

    if (!queryNorm || !_indiceResumo.length) {
      if (_indiceResumo.length === 0) {
        console.warn('[NexusSearch] buscar: índice de resumo vazio.');
      }
      return [];
    }

    const todos = _indiceResumo.map(function (entrada) {
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

    console.log('[NexusSearch] buscar (resumo): query=' + JSON.stringify(queryNorm) +
                ' | chunks=' + _indiceResumo.length +
                ' | aprovados=' + resultados.length);

    return resultados;
  }

  /* ══════════════════════════════════════════════════════════
     BUSCA DE QUIZ (restrita por token)
  ══════════════════════════════════════════════════════════ */

  /**
   * Busca no índice de QUIZ.
   * Retorna array vazio se o token for inválido ou o quiz não autorizado.
   * O resultado NÃO inclui _q (gabarito/feedback) — apenas texto, aula, secao, score.
   *
   * @param {string} pergunta
   * @param {object} [opcoes]
   * @param {string} token
   * @returns {{ score, texto, aula, secao }[]}
   */
  function buscarQuiz(pergunta, opcoes, token) {
    if (!_tokenValido(token)) {
      console.warn('[NexusSearch] buscarQuiz bloqueado: token inválido.');
      return [];
    }

    const topK     = (opcoes && opcoes.topK)            || 3;
    const minScore = (opcoes && opcoes.minScore != null) ? opcoes.minScore : 10;
    const queryNorm = normalizarTexto(pergunta);

    if (!queryNorm || !_indiceQuiz.length) return [];

    const todos = _indiceQuiz.map(function (entrada) {
      return {
        score: _score(queryNorm, entrada.textoNorm, entrada.stemsTexto, entrada.peso),
        // _q NÃO é exposto aqui — somente texto de busca
        texto: entrada.texto,
        aula:  entrada.aula,
        secao: entrada.secao,
      };
    });

    return todos
      .sort(function (a, b) { return b.score - a.score; })
      .filter(function (r) { return r.score >= minScore; })
      .slice(0, topK);
  }

  /**
   * Retorna a questão completa pelo número (base 1) ou null.
   * Exige token — fora do template retorna null silenciosamente.
   *
   * @param {number} numero
   * @param {string} token
   * @returns {object|null}
   */
  function buscarQuestaoPorNumero(numero, token) {
    if (!_tokenValido(token)) {
      console.warn('[NexusSearch] buscarQuestaoPorNumero bloqueado: token inválido.');
      return null;
    }
    for (var i = 0; i < _indiceQuiz.length; i++) {
      var e = _indiceQuiz[i];
      if (e._numero === numero && e.secao && !e.secao.includes('/feedback')) {
        return e._q || null;
      }
    }
    return null;
  }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════════════════════════ */

  window.NexusSearch = {
    // Resumo (sempre disponível)
    indexarConteudo,
    buscar,
    limparIndice,
    estaIndexado,
    normalizarTexto,

    // Quiz (exigem token em cada chamada)
    autorizarQuiz,
    revogarQuiz,
    indexarQuestoes,
    buscarQuiz,
    buscarQuestaoPorNumero,
    estaIndexadoQuiz,
    limparIndiceQuiz,
  };

}());