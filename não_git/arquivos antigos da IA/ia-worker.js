/**
 * ASSISTENTE NEXUS — ia-worker.js  v3.0 (QUIZ-ISOLATION)
 *
 * Responsabilidades exclusivas:
 *   - Manter histórico curto da sessão (somente em memória)
 *   - Serializar resultados do NexusSearch em contexto de texto
 *   - Comunicar com o worker (POST)
 *   - Fallback em caso de falha
 *   - Converter markdown da resposta em texto formatado para NexusUI
 *
 * PATCH QUIZ-ISOLATION:
 *   _sanitizarResultados() — remove qualquer entrada cujo campo `secao`
 *   seja 'Quiz' ou contenha '/feedback' quando o contexto de quiz não
 *   estiver ativo (window.__NEXUS_QUIZ_TOKEN__ ausente).
 *   Isso fecha o último vetor: mesmo que ia.js passasse resultados de
 *   quiz por engano, o worker nunca os receberia sem o token.
 *
 *   _contextoQuizAtivo() — cópia local da verificação de token.
 *   O worker não depende de ia.js para decidir o que filtrar.
 *
 * NÃO:
 *   - Conhece disciplinas, semestres ou o índice de busca
 *   - Toca no DOM diretamente
 *   - Persiste dados fora da sessão atual
 *   - Salva perguntas do usuário
 *
 * API pública: window.NexusWorker
 *
 * ── CONTRATO COM O WORKER ────────────────────────────────────
 * POST { pergunta, contexto, historico, disciplina, ehQuestao }
 * ← { resposta: string, fonte: string, modelo: string }
 *
 * ── HISTÓRICO DE SESSÃO ──────────────────────────────────────
 * Mantém apenas as últimas MAX_TURNS interações (user + assistant).
 * Somente texto limpo — sem role 'system', 'bot', metadados ou HTML.
 * Expira automaticamente após SESSION_TTL_MS de inatividade.
 * Reset explícito disponível via NexusWorker.limparHistorico().
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CONFIGURAÇÃO
  ══════════════════════════════════════════════════════════ */

  const WORKER_URL    = 'https://restless-flower-1924.rafaelpeixoto475.workers.dev/';
  const MAX_TURNS     = 5;
  const SESSION_TTL_MS = 2 * 60 * 60 * 1000;
  const CONTEXTO_MAX  = 3000;

  /* ══════════════════════════════════════════════════════════
     ESTADO INTERNO
  ══════════════════════════════════════════════════════════ */

  let _historico       = [];
  let _ultimaAtividade = 0;
  let _habilitado      = true;

  /* ══════════════════════════════════════════════════════════
     VERIFICAÇÃO DE CONTEXTO DE QUIZ (cópia local — independente)
     O worker não confia que ia.js filtrou tudo. Verifica por conta
     própria antes de serializar qualquer contexto com marcação de quiz.
  ══════════════════════════════════════════════════════════ */

  /**
   * Retorna true se o contexto de quiz estiver ativo com token válido.
   * Cópia intencional de ia.js — o worker não deve depender de outro módulo.
   *
   * @returns {boolean}
   */
  function _contextoQuizAtivo() {
    var t = window.__NEXUS_QUIZ_TOKEN__;
    if (!t || typeof t !== 'string') return false;
    return window.__NEXUS_QUIZ_MODO__ !== undefined;
  }

  /**
   * Remove entradas de quiz dos resultados quando o contexto de quiz
   * não estiver ativo. Barreira de segurança final antes do envio ao worker.
   *
   * Entradas de quiz têm secao === 'Quiz' ou secao contendo '/feedback',
   * ou texto que inclui padrões típicos de serialização de questão
   * ('Gabarito:', 'Feedback oficial:', 'Alternativas:').
   *
   * @param {{ score, texto, aula, secao }[]} resultados
   * @returns {{ score, texto, aula, secao }[]}
   */
  function _sanitizarResultados(resultados) {
    if (!resultados || !resultados.length) return resultados;
    if (_contextoQuizAtivo()) return resultados; // dentro do quiz: passa tudo

    return resultados.filter(function (r) {
      // Filtra por secao
      if (r.secao === 'Quiz') return false;
      if (typeof r.secao === 'string' && r.secao.includes('/feedback')) return false;

      // Filtra por padrões de texto que indicam serialização de questão com gabarito
      if (typeof r.texto === 'string') {
        if (/^Gabarito:\s*[A-E]\b/m.test(r.texto))          return false;
        if (/^Feedback oficial:/m.test(r.texto))             return false;
        if (/^Alternativas:\s*\n\s*[A-E]\)/m.test(r.texto)) return false;
      }

      return true;
    });
  }

  /* ══════════════════════════════════════════════════════════
     HISTÓRICO DE SESSÃO
  ══════════════════════════════════════════════════════════ */

  function _verificarExpiracao() {
    if (_ultimaAtividade > 0 && Date.now() - _ultimaAtividade > SESSION_TTL_MS) {
      _historico = [];
      console.log('[NexusWorker] histórico expirado por inatividade.');
    }
  }

  function _registrarTurno(pergunta, resposta) {
    _historico.push({ role: 'user',      content: pergunta });
    _historico.push({ role: 'assistant', content: resposta });

    const maxMensagens = MAX_TURNS * 2;
    if (_historico.length > maxMensagens) {
      _historico = _historico.slice(_historico.length - maxMensagens);
    }

    _ultimaAtividade = Date.now();
  }

  function _getHistoricoParaEnvio() {
    return _historico.slice();
  }

  /* ══════════════════════════════════════════════════════════
     SERIALIZAÇÃO DO CONTEXTO
  ══════════════════════════════════════════════════════════ */

  /**
   * Converte resultados em string de contexto para o worker.
   * Aplica _sanitizarResultados() antes de serializar — garante que
   * nenhum dado de quiz chegue ao worker sem token ativo.
   *
   * @param {{ score, texto, aula, secao }[]} resultados
   * @returns {string}
   */
  function _serializarContexto(resultados) {
    if (!resultados || !resultados.length) return '';

    // Sanitização final: remove entradas de quiz se contexto não estiver ativo
    const seguros = _sanitizarResultados(resultados);
    if (!seguros || !seguros.length) return '';

    const linhas = ['Fatos de referência (use como âncora factual, não reescreva):'];

    seguros.forEach(function (r) {
      const origem = r.aula
        ? (r.secao && r.secao !== r.aula ? r.aula + ' · ' + r.secao : r.aula)
        : (r.secao || 'Conteúdo');

      linhas.push('• [' + origem + '] ' + r.texto.trim());
    });

    const ctx = linhas.join('\n').trim();
    return ctx.length > CONTEXTO_MAX ? ctx.slice(0, CONTEXTO_MAX) + '…' : ctx;
  }

  /* ══════════════════════════════════════════════════════════
     DETECÇÃO DE TIPO DE PERGUNTA
  ══════════════════════════════════════════════════════════ */

  function _ehQuestao(pergunta) {
    return (
      /\b[A-Ea-e]\s*[\)\.]/.test(pergunta) ||
      /qual\s+(a\s+)?(resposta|alternativa|correta|certa|gabarito)/i.test(pergunta) ||
      /quest[aã]o\s+\d+/i.test(pergunta)
    );
  }

  /* ══════════════════════════════════════════════════════════
     FORMATAÇÃO DE MARKDOWN
  ══════════════════════════════════════════════════════════ */

  function _markdownParaTexto(texto) {
    if (!texto) return '';

    return texto
      .replace(/```[\w]*\n?([\s\S]*?)```/g, function (_, cod) {
        return '\n' + cod.trim() + '\n';
      })
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/\*([^*\n]+)\*/g, '$1')
      .replace(/_([^_\n]+)_/g, '$1')
      .replace(/^#{1,3}\s+(.+)$/gm, function (_, titulo) {
        return titulo.toUpperCase();
      })
      .replace(/^[*\-]\s+(.+)$/gm, '• $1')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  /* ══════════════════════════════════════════════════════════
     COMUNICAÇÃO COM O WORKER
  ══════════════════════════════════════════════════════════ */

  async function _chamarWorker(payload) {
    let res;
    try {
      res = await fetch(WORKER_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('[NexusWorker] falha de rede ao chamar worker:', err);
      return null;
    }

    if (res.status === 429) {
      return { resposta: '⚠️ Muitas perguntas agora 😅 Tente novamente em alguns segundos.', fonte: null, modelo: null };
    }

    if (!res.ok) {
      console.warn('[NexusWorker] worker retornou HTTP', res.status);
      return null;
    }

    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.warn('[NexusWorker] resposta do worker não é JSON válido:', err);
      return null;
    }

    if (!data || !data.resposta) {
      console.warn('[NexusWorker] worker respondeu sem campo "resposta".');
      return null;
    }

    return {
      resposta: data.resposta,
      fonte:    data.fonte  || null,
      modelo:   data.modelo || null,
    };
  }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA PRINCIPAL
  ══════════════════════════════════════════════════════════ */

  /**
   * Ponto de entrada principal.
   * Chamado por ia.js após NexusSearch.buscar() ou buscarQuiz().
   *
   * QUIZ-ISOLATION:
   *   Aplica _sanitizarResultados() em `resultados` antes de serializar.
   *   Mesmo que ia.js passe dados de quiz por engano, são removidos aqui.
   *
   * @param {{
   *   pergunta:              string,
   *   resultados:            { score, texto, aula, secao }[],
   *   disciplina:            string,
   *   tipoContexto:          string,
   *   semContexto?:          boolean,
   *   registrarNoHistorico?: boolean,
   * }} opcoes
   *
   * @returns {Promise<{ texto, fonte, modelo }|null>}
   */
  async function perguntar(opcoes) {
    if (!_habilitado) return null;

    const {
      pergunta,
      resultados,
      disciplina,
      tipoContexto,
      semContexto,
      registrarNoHistorico,
    } = opcoes;

    if (!pergunta || !pergunta.trim()) return null;

    _verificarExpiracao();

    // Sanitização final: nunca envia contexto de quiz sem token ativo
    const resultadosSeguros = _sanitizarResultados(resultados || []);

    const contexto   = _serializarContexto(resultadosSeguros);
    const historico  = _getHistoricoParaEnvio();
    const ehQuestao_ = _ehQuestao(pergunta);

    const resultado = await _chamarWorker({
      pergunta:     pergunta.trim(),
      contexto:     contexto,
      historico:    historico,
      disciplina:   disciplina || '',
      ehQuestao:    ehQuestao_,
      tipoContexto: tipoContexto || 'conteudo',
    });

    if (!resultado) {
      console.warn('[NexusWorker] falha no worker — fallback local ativado.');
      return null;
    }

    const textoFormatado = _markdownParaTexto(resultado.resposta);

    if (resultado.fonte) {
      console.log('[NexusWorker] usando ' + resultado.fonte +
        (resultado.modelo ? ' · modelo: ' + resultado.modelo : ''));
    }

    const deveRegistrar = registrarNoHistorico !== false;
    if (deveRegistrar) {
      _registrarTurno(pergunta.trim(), textoFormatado);
    }

    return { texto: textoFormatado, fonte: resultado.fonte, modelo: resultado.modelo };
  }

  function limparHistorico() {
    _historico       = [];
    _ultimaAtividade = 0;
    console.log('[NexusWorker] histórico de sessão limpo.');
  }

  function setHabilitado(valor) {
    _habilitado = !!valor;
    console.log('[NexusWorker] IA ' + (_habilitado ? 'habilitada' : 'desabilitada') + '.');
  }

  function status() {
    return {
      habilitado:        _habilitado,
      turnosNoHistorico: _historico.length / 2,
    };
  }

  /* ══════════════════════════════════════════════════════════
     REGISTRO GLOBAL
  ══════════════════════════════════════════════════════════ */

  window.NexusWorker = {
    perguntar,
    limparHistorico,
    setHabilitado,
    status,
  };

}());