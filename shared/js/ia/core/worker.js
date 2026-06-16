/**
 * NEXUS — shared/js/ia/core/worker.js
 *
 * Responsabilidades exclusivas:
 *   - Manter histórico curto da sessão (somente em memória)
 *   - Serializar resultados em contexto de texto
 *   - Comunicar com o worker remoto (POST)
 *   - Fallback em caso de falha
 *   - Converter markdown da resposta em texto formatado para NexusUI
 *
 * MODO LIVRE (sem contexto interno):
 *   Quando resultados = [] e tipoContexto = 'livre', o worker
 *   responde usando apenas seu conhecimento próprio.
 *   Nenhuma lógica adicional é necessária aqui — a ausência de
 *   contexto serializado já produz esse comportamento.
 *
 * NÃO conhece:
 *   - Quiz, gabarito, feedback, tokens de sessão
 *   - Disciplinas, semestres ou o índice de busca
 *   - Regras específicas de domínio (resumo ou quiz)
 *   - DOM
 *
 * Quem chama decide o que incluir nos resultados.
 * Este módulo apenas serializa e envia.
 *
 * API pública: window.NexusWorker
 *
 * ── CONTRATO COM O WORKER ────────────────────────────────────
 * POST { pergunta, contexto, historico, disciplina, ehQuestao, tipoContexto }
 * ← { resposta: string, fonte: string, modelo: string }
 *
 * tipoContexto:
 *   'conteudo' — resposta ancorada no conteúdo interno enviado
 *   'livre'    — IA responde com conhecimento próprio (sem contexto interno)
 *
 * ── HISTÓRICO DE SESSÃO ──────────────────────────────────────
 * Mantém apenas as últimas MAX_TURNS interações (user + assistant).
 * Somente texto limpo — sem role 'system', metadados ou HTML.
 * Expira automaticamente após SESSION_TTL_MS de inatividade.
 * Reset explícito disponível via NexusWorker.limparHistorico().
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CONFIGURAÇÃO
  ══════════════════════════════════════════════════════════ */

  const WORKER_URL     = 'https://restless-flower-1924.rafaelpeixoto475.workers.dev/';
  const MAX_TURNS      = 5;
  const SESSION_TTL_MS = 2 * 60 * 60 * 1000;
  const CONTEXTO_MAX   = 3000;
  const SESSION_KEY_H  = 'nexus_worker_history';

  /* ══════════════════════════════════════════════════════════
     ESTADO INTERNO
  ══════════════════════════════════════════════════════════ */

  let _historico       = [];
  let _ultimaAtividade = 0;
  let _habilitado      = true;

  // Restaurar histórico do worker persistido na sessão anterior
  (function () {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY_H);
      if (!raw) return;
      const salvo = JSON.parse(raw);
      if (!salvo || !Array.isArray(salvo.historico)) return;
      if (Date.now() - salvo.ultimaAtividade > SESSION_TTL_MS) {
        sessionStorage.removeItem(SESSION_KEY_H);
        return;
      }
      _historico       = salvo.historico;
      _ultimaAtividade = salvo.ultimaAtividade;
      console.log('[NexusWorker] histórico restaurado:', _historico.length / 2, 'turnos.');
    } catch (e) {}
  }());

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

    try {
      sessionStorage.setItem(SESSION_KEY_H, JSON.stringify({
        historico:       _historico,
        ultimaAtividade: _ultimaAtividade,
      }));
    } catch (e) {}
  }

  function _getHistoricoParaEnvio() {
    return _historico.slice();
  }

  /* ══════════════════════════════════════════════════════════
     SERIALIZAÇÃO DO CONTEXTO
  ══════════════════════════════════════════════════════════ */

  /**
   * Converte resultados em string de contexto para o worker.
   * Retorna string vazia quando resultados é vazio ou nulo —
   * isso é o comportamento correto para o modo livre.
   *
   * @param {{ score, texto, aula, secao }[]} resultados
   * @returns {string}
   */
  function _serializarContexto(resultados) {
    if (!resultados || !resultados.length) return '';

    const linhas = ['Fatos de referência (use como âncora factual, não reescreva):'];

    resultados.forEach(function (r) {
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

  /**
   * Detecta pedidos EXPLÍCITOS de gabarito/resposta.
   */
  function _ehQuestao(pergunta) {
    const u = window.NexusTextUtils;
    if (!u) return false;
    const norm = u.normalizarTexto(pergunta);
    return u.contemAlgum(norm, u.PALAVRAS_GABARITO);
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
      return {
        resposta: '⚠️ Muitas perguntas agora 😅 Tente novamente em alguns segundos.',
        fonte: null,
        modelo: null,
      };
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
   * Serializa os resultados passados e envia ao worker remoto.
   *
   * Quando resultados = [] e tipoContexto = 'livre', o worker
   * responde com conhecimento próprio — sem nenhuma lógica adicional
   * aqui. A ausência de contexto serializado já produz esse
   * comportamento naturalmente.
   *
   * @param {{
   *   pergunta:              string,
   *   resultados:            { score, texto, aula, secao }[],
   *   disciplina:            string,
   *   tipoContexto:          'conteudo' | 'livre' | string,
   *   semContexto?:          boolean,       — legado, preferir tipoContexto: 'livre'
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

    // tipoContexto 'livre' ou semContexto:true → contexto vazio,
    // IA responde com conhecimento próprio. Nenhuma serialização necessária.
    const contexto  = _serializarContexto(resultados || []);
    const historico = _getHistoricoParaEnvio();
    const ehQuestao = _ehQuestao(pergunta);

    // Normaliza tipoContexto: semContexto legado → 'livre'
    const tipoFinal = (semContexto === true && !tipoContexto)
      ? 'livre'
      : (tipoContexto || 'conteudo');

    const resultado = await _chamarWorker({
      pergunta:     pergunta.trim(),
      contexto:     contexto,
      historico:    historico,
      disciplina:   disciplina || '',
      ehQuestao:    ehQuestao,
      tipoContexto: tipoFinal,
    });

    if (!resultado) {
      console.warn('[NexusWorker] falha no worker — fallback local ativado.');
      return null;
    }

    const textoFormatado = _markdownParaTexto(resultado.resposta);

    if (resultado.fonte) {
      console.log('[NexusWorker] usando ' + resultado.fonte +
        (resultado.modelo ? ' · modelo: ' + resultado.modelo : '') +
        (tipoFinal === 'livre' ? ' · modo livre' : ''));
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
    try { sessionStorage.removeItem(SESSION_KEY_H); } catch (e) {}
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