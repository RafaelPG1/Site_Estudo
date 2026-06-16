/**
 * NEXUS — shared/js/ia/quiz/search.js
 *
 * Motor de busca exclusivo para questões de quiz.
 *
 * Responsabilidades:
 *   - Gerenciar autorização de sessão de quiz via token
 *   - Indexar questões (enunciados, alternativas, feedback)
 *   - Buscar questões por texto livre
 *   - Recuperar questão específica por número
 *   - Revogar sessão e zerar índice ao sair do quiz
 *
 * NÃO conhece:
 *   - Estrutura de resumo (aulas, seções, blocos)
 *   - DOM
 *   - Estado do assistente
 *
 * Depende de: core/text-utils.js (window.NexusTextUtils)
 *
 * TOKEN DE SESSÃO:
 *   template_init.js deve chamar NexusQuizSearch.autorizarQuiz(token) ANTES
 *   de qualquer indexação de questões.
 *   O token é gerado uma vez por sessão de quiz e armazenado em
 *   window.__NEXUS_QUIZ_TOKEN__.
 *   Ao sair do quiz, template_init ou quiz/assistant.js chama
 *   NexusQuizSearch.revogarQuiz() para zerar token e índice.
 *
 * API pública: window.NexusQuizSearch
 *   contextoAtivo()          — true se tipo 'quiz' está ativo (usa NexusContext)
 *   autorizarQuiz(token)     — registra token de sessão
 *   revogarQuiz()            — invalida token e zera índice
 *   indexarQuestoes(q, m, t) — indexa questões (exige token)
 *   buscarQuiz(p, opts, t)   — busca por texto (exige token)
 *   buscarQuestaoPorNumero(n, t)
 *   estaIndexadoQuiz(t)
 *   limparIndiceQuiz(t)
 *
 * Alias compatível: as funções de quiz são mescladas em window.NexusSearch
 *   para manter compatibilidade com código existente que usa NexusSearch.buscarQuiz(),
 *   NexusSearch.indexarQuestoes(), etc.
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     DEPENDÊNCIA: NexusTextUtils
  ══════════════════════════════════════════════════════════ */

  function _utils() {
    if (typeof window.NexusTextUtils === 'undefined') {
      throw new Error('[NexusQuizSearch] NexusTextUtils não encontrado. Carregue core/text-utils.js antes.');
    }
    return window.NexusTextUtils;
  }

  /* ══════════════════════════════════════════════════════════
     TOKEN DE SESSÃO DE QUIZ
  ══════════════════════════════════════════════════════════ */

  /**
   * Token autorizado para operações de quiz nesta sessão.
   * null = quiz não autorizado.
   */
  let _tokenAtivo = null;

  /**
   * Verifica se o token fornecido é válido.
   * Nunca lança exceção — retorna false silenciosamente.
   *
   * @param {string|undefined} token
   * @returns {boolean}
   */
  function _tokenValido(token) {
    if (!token || typeof token !== 'string') return false;
    if (!_tokenAtivo) return false;
    return token === _tokenAtivo;
  }

  /**
   * Registra o token de sessão de quiz.
   * Chamado exclusivamente por template_init.js durante o boot.
   *
   * @param {string} token
   */
  function autorizarQuiz(token) {
    if (!token || typeof token !== 'string') {
      console.warn('[NexusQuizSearch] autorizarQuiz: token inválido ignorado.');
      return;
    }
    _tokenAtivo = token;
    console.log('[NexusQuizSearch] sessão de quiz autorizada.');
  }

  /**
   * Invalida o token e zera imediatamente o índice de quiz.
   * Chamado por template_init.js ou quiz/assistant.js em beforeunload / pagehide.
   * Após este ponto qualquer acesso ao índice retorna resultado vazio.
   */
  function revogarQuiz() {
    _tokenAtivo = null;
    _indice     = [];
    console.log('[NexusQuizSearch] sessão de quiz revogada — índice zerado.');
  }

  /**
   * Retorna true se o contexto de quiz está ativo nesta página.
   *
   * Usa NexusContext.temTipo('quiz') quando disponível (novo contrato).
   * Fallback: verifica se há token ativo (legado).
   *
   * Não exige token para ser chamada — é uma verificação de presença,
   * não uma operação privilegiada sobre o índice.
   *
   * @returns {boolean}
   */
  function contextoAtivo() {
    if (typeof window.NexusContext !== 'undefined') {
      return window.NexusContext.temTipo('quiz');
    }
    // fallback legado: token ativo implica que autorizarQuiz() foi chamado
    return _tokenAtivo !== null;
  }

  /* ══════════════════════════════════════════════════════════
     ÍNDICE
  ══════════════════════════════════════════════════════════ */

  /**
   * Índice de questões.
   * Cada entrada pode conter _q (objeto completo com gabarito/feedback).
   * Nunca é exposto via buscar() público — somente via buscarQuestaoPorNumero().
   */
  let _indice = [];

  /* ══════════════════════════════════════════════════════════
     INDEXAÇÃO
  ══════════════════════════════════════════════════════════ */

  /**
   * Implementação interna de indexação de questões.
   * Só chamada após verificação de token.
   *
   * O objeto completo da questão (_q) fica armazenado na entrada do índice,
   * mas nunca é exposto via buscarQuiz() — somente via buscarQuestaoPorNumero().
   *
   * @param {object} questoes — estrutura { [modo]: questao[] }
   * @param {string} modo     — ex: 'questoes', 'AP1', 'AP2'
   */
  function _indexarInterno(questoes, modo) {
    _indice = [];

    if (!questoes || !Array.isArray(questoes[modo]) || !questoes[modo].length) {
      console.warn('[NexusQuizSearch] indexarQuestoes: modo "' + modo + '" não encontrado ou vazio.');
      return;
    }

    const u = _utils();

    var lista = (window.__NEXUS_QUESTOES_VISUAIS__ && window.__NEXUS_QUESTOES_VISUAIS__.length)
      ? window.__NEXUS_QUESTOES_VISUAIS__
      : questoes[modo];

    lista.forEach(function (q, i) {
      var numero = i + 1;
      var aula   = q.aula || '';

      // Texto buscável: enunciado e alternativas (nunca gabarito/feedback)
      var partes = [];
      if (q.texto)    partes.push(q.texto);
      if (q.question) partes.push(q.question);
      if (Array.isArray(q.assertions)) partes.push(q.assertions.join(' '));
      if (Array.isArray(q.options))    partes.push(q.options.join(' '));

      var textoCompleto = partes.join(' ');
      var tn = u.normalizarTexto(textoCompleto);

      _indice.push({
        texto:      textoCompleto,
        aula:       aula,
        secao:      modo,
        peso:       1.0,
        textoNorm:  tn,
        stemsTexto: tn.split(' ').filter(Boolean).map(u.stem).join(' '),
        _numero:    numero,
        _modo:      modo,
        _q:         q,   // objeto completo — permanece SOMENTE no índice interno
      });

      // Feedback indexado separadamente com peso menor
      if (q.feedback) {
        var fnorm = u.normalizarTexto(q.feedback);
        _indice.push({
          texto:      q.feedback,
          aula:       aula,
          secao:      modo + '/feedback',
          peso:       0.8,
          textoNorm:  fnorm,
          stemsTexto: fnorm.split(' ').filter(Boolean).map(u.stem).join(' '),
          _numero:    numero,
          _modo:      modo,
          _q:         q,
        });
      }
    });

    console.log('[NexusQuizSearch] indexarQuestoes:', lista.length,
      'questões indexadas para modo "' + modo + '".');
  }

  /**
   * API pública de indexação — exige token válido.
   * Chamado por quiz/assistant.js > _garantirConteudo() quando
   * window.__NEXUS_QUIZ_MODO__ está definido.
   *
   * @param {object} questoes
   * @param {string} modo
   * @param {string} token — deve coincidir com o token autorizado
   */
  function indexarQuestoes(questoes, modo, token) {
    if (!_tokenValido(token)) {
      console.warn('[NexusQuizSearch] indexarQuestoes bloqueado: token inválido.');
      return;
    }
    _indexarInterno(questoes, modo);
  }

  /**
   * Limpa o índice de quiz.
   * Exige token — fora do template_init não tem efeito.
   *
   * @param {string} token
   */
  function limparIndiceQuiz(token) {
    if (!_tokenValido(token)) {
      console.warn('[NexusQuizSearch] limparIndiceQuiz bloqueado: token inválido.');
      return;
    }
    _indice = [];
    console.log('[NexusQuizSearch] índice limpo via token.');
  }

  /**
   * Retorna true se o índice de quiz estiver ativo e populado.
   * Exige token.
   *
   * @param {string} token
   * @returns {boolean}
   */
  function estaIndexadoQuiz(token) {
    if (!_tokenValido(token)) return false;
    return _indice.length > 0;
  }

  /* ══════════════════════════════════════════════════════════
     BUSCA
  ══════════════════════════════════════════════════════════ */

  /**
   * Busca no índice de questões.
   * Retorna array vazio se o token for inválido.
   * O resultado NÃO inclui _q (gabarito/feedback) — apenas texto, aula, secao, score.
   *
   * @param {string} pergunta
   * @param {{ topK?: number, minScore?: number }} [opcoes]
   * @param {string} token
   * @returns {{ score: number, texto: string, aula: string, secao: string }[]}
   */
  function buscarQuiz(pergunta, opcoes, token) {
    if (!_tokenValido(token)) {
      console.warn('[NexusQuizSearch] buscarQuiz bloqueado: token inválido.');
      return [];
    }

    const topK     = (opcoes && opcoes.topK)            || 3;
    const minScore = (opcoes && opcoes.minScore != null) ? opcoes.minScore : 10;
    const u        = _utils();
    const queryNorm = u.normalizarTexto(pergunta);

    if (!queryNorm || !_indice.length) return [];

    const todos = _indice.map(function (entrada) {
      return {
        score: u.score(queryNorm, entrada.textoNorm, entrada.stemsTexto, entrada.peso),
        // _q NÃO é exposto — somente texto de busca
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
   * Retorna a questão completa pelo número VISUAL (base 1) ou null.
   * Exige token — fora do template retorna null silenciosamente.
   *
   * Fonte de verdade primária: window.__NEXUS_QUESTOES_VISUAIS__
   *   Esse array é mantido pelo quiz_engine e reflete exatamente a ordem
   *   e o embaralhamento de alternativas que o usuário está vendo na tela.
   *   Cada objeto já tem options/answer na ordem visual — sem necessidade de
   *   nenhuma tradução adicional.
   *
   *   numero=1 → __NEXUS_QUESTOES_VISUAIS__[0]  (Questão 1 visual)
   *   numero=3 → __NEXUS_QUESTOES_VISUAIS__[2]  (Questão 3 visual)
   *
   * Fonte de fallback: índice interno (_indice)
   *   Usado apenas quando __NEXUS_QUESTOES_VISUAIS__ não está disponível.
   *   Pode ter defasagem de embaralhamento em edge cases de timing — por
   *   isso é apenas fallback.
   *
   * @param {number} numero — número visual (base 1, como exibido ao usuário)
   * @param {string} token
   * @returns {object|null}
   */
  function buscarQuestaoPorNumero(numero, token) {
    if (!_tokenValido(token)) {
      console.warn('[NexusQuizSearch] buscarQuestaoPorNumero bloqueado: token inválido.');
      return null;
    }

    // ── Fonte primária: array visual do quiz_engine ──────────────────────
    // __NEXUS_QUESTOES_VISUAIS__ é setado por quiz_engine em toda inicialização,
    // reinício e aplicação de filtro — é sempre a versão atual que o usuário vê.
    var visuais = window.__NEXUS_QUESTOES_VISUAIS__;
    if (Array.isArray(visuais) && visuais.length > 0) {
      var idx = numero - 1; // converte base-1 (visual) para base-0 (array)
      if (idx >= 0 && idx < visuais.length) {
        console.log('[NexusQuizSearch] buscarQuestaoPorNumero: usando mapa visual para questão', numero);
        return visuais[idx];
      }
      console.warn('[NexusQuizSearch] buscarQuestaoPorNumero: questão', numero, 'fora do intervalo (total:', visuais.length, ')');
      return null;
    }

    // ── Fallback: índice interno ─────────────────────────────────────────
    // Usado apenas quando __NEXUS_QUESTOES_VISUAIS__ não está disponível.
    console.warn('[NexusQuizSearch] buscarQuestaoPorNumero: __NEXUS_QUESTOES_VISUAIS__ ausente, usando índice interno como fallback.');
    for (var i = 0; i < _indice.length; i++) {
      var e = _indice[i];
      if (e._numero === numero && e.secao && !e.secao.includes('/feedback')) {
        return e._q || null;
      }
    }
    return null;
  }

  /* ══════════════════════════════════════════════════════════
     REGISTRO GLOBAL
  ══════════════════════════════════════════════════════════ */

  const api = {
    autorizarQuiz,
    revogarQuiz,
    contextoAtivo,
    indexarQuestoes,
    buscarQuiz,
    buscarQuestaoPorNumero,
    estaIndexadoQuiz,
    limparIndiceQuiz,
  };

  window.NexusQuizSearch = api;

  // Mescla as funções de quiz em window.NexusSearch para compatibilidade
  // com código existente que chama NexusSearch.buscarQuiz(), etc.
  // resumo/search.js já cria NexusSearch com as funções de resumo;
  // aqui adicionamos as de quiz sem sobrescrever as existentes.
  if (typeof window.NexusSearch !== 'undefined') {
    Object.assign(window.NexusSearch, api);
  } else {
    // Fallback: se carregado antes de resumo/search.js
    window.NexusSearch = api;
  }

}());