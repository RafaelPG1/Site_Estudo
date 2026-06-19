/**
 * NEXUS — shared/js/ia/core/worker.js
 *
 * Responsabilidades exclusivas:
 *   - Manter histórico curto da sessão (somente em memória)
 *   - Serializar resultados em contexto de texto
 *   - Comunicar com o worker remoto (Cloudflare Worker, POST)
 *   - Fallback em caso de falha
 *   - Converter markdown da resposta em texto formatado para NexusUI
 *
 * NÃO conhece:
 *   - Quiz, gabarito, feedback, tokens de sessão
 *   - Disciplinas, semestres ou o índice de busca
 *   - Regras específicas de domínio (resumo ou quiz)
 *   - DOM
 *
 * Quem chama decide o que incluir nos resultados e como classificar
 * a pergunta. Este módulo apenas serializa, envia e formata a resposta.
 *
 * Script clássico (não ES Module) — carregado via <script src="...">
 * e expõe window.NexusWorker.
 *
 * ── CONTRATO COM O WORKER REMOTO (Cloudflare) ────────────────
 * POST { pergunta, contexto, historico, disciplina, tipoContexto, ehQuestao }
 * ← { resposta: string, fonte: string, modelo: string }
 *
 * ── HISTÓRICO DE SESSÃO ──────────────────────────────────────
 * Mantém apenas as últimas MAX_TURNS interações (user + assistant).
 * Somente texto limpo — sem role 'system', metadados ou HTML.
 * Expira automaticamente após SESSION_TTL_MS de inatividade.
 * Reset explícito disponível via NexusWorker.limparHistorico().
 * Restauração após F5 via NexusWorker.restaurarHistorico(msgs).
 *
 * ── RETORNO DE perguntar() ───────────────────────────────────
 * { texto, fonte, modelo, turnosAoEnviar }
 *
 * turnosAoEnviar: número de turnos que existiam no histórico NO
 * MOMENTO DO ENVIO ao Cloudflare Worker (antes de _registrarTurno).
 * Permite que assistant.js classifique corretamente a origem da
 * resposta sem depender de status() fora de hora (que já refletiria
 * o turno recém-adicionado e produziria falso positivo).
 *
 * API pública: window.NexusWorker
 *   perguntar(opcoes)         → Promise<{ texto, fonte, modelo, turnosAoEnviar } | null>
 *   limparHistorico()
 *   restaurarHistorico(msgs)  → restaura _historico a partir de msgs visuais
 *   setHabilitado(valor)
 *   status()                  → { habilitado, turnosNoHistorico }
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CONFIGURAÇÃO
  ══════════════════════════════════════════════════════════ */

  var WORKER_URL     = 'https://restless-flower-1924.rafaelpeixoto475.workers.dev/';
  var MAX_TURNS      = 5;
  var SESSION_TTL_MS = 2 * 60 * 60 * 1000;
  var CONTEXTO_MAX   = 3000;

  /* ══════════════════════════════════════════════════════════
     ESTADO INTERNO
  ══════════════════════════════════════════════════════════ */

  var _historico       = [];
  var _ultimaAtividade = 0;
  var _habilitado      = true;

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

    var maxMensagens = MAX_TURNS * 2;
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
   * Converte resultados em string de contexto para o worker remoto.
   * Não filtra nem interpreta o conteúdo — serializa o que recebe.
   *
   * @param {{ score, texto, aula, secao }[]} resultados
   * @returns {string}
   */
  function _serializarContexto(resultados) {
    if (!resultados || !resultados.length) return '';

    var linhas = ['Fatos de referência (use como âncora factual, não reescreva):'];

    resultados.forEach(function (r) {
      var origem = r.aula
        ? (r.secao && r.secao !== r.aula ? r.aula + ' · ' + r.secao : r.aula)
        : (r.secao || 'Conteúdo');

      linhas.push('• [' + origem + '] ' + r.texto.trim());
    });

    var ctx = linhas.join('\n').trim();
    return ctx.length > CONTEXTO_MAX ? ctx.slice(0, CONTEXTO_MAX) + '…' : ctx;
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
     COMUNICAÇÃO COM O WORKER REMOTO
  ══════════════════════════════════════════════════════════ */

  async function _chamarWorker(payload) {
    var res;
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
        fonte:    null,
        modelo:   null,
      };
    }

    if (!res.ok) {
      console.warn('[NexusWorker] worker retornou HTTP', res.status);
      return null;
    }

    var data;
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
   * Quem chama (resumo/assistant.js, quiz/assistant.js) é responsável
   * por passar apenas os resultados adequados ao seu próprio contexto
   * e por classificar tipoContexto. Este módulo não filtra por domínio
   * nem decide se a pergunta é um pedido de gabarito — isso é
   * responsabilidade de cada assistant.
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
   * @returns {Promise<{ texto, fonte, modelo, turnosAoEnviar }|null>}
   *
   * turnosAoEnviar — número de turnos presentes no histórico NO
   * MOMENTO DO ENVIO, antes de _registrarTurno() acrescentar o turno
   * atual. Permite ao chamador saber se a resposta foi gerada com
   * contexto de conversa anterior ou apenas com conhecimento próprio.
   */
  async function perguntar(opcoes) {
    if (!_habilitado) return null;
    if (!opcoes) return null;

    var pergunta             = opcoes.pergunta;
    var resultados           = opcoes.resultados;
    var disciplina           = opcoes.disciplina;
    var tipoContexto         = opcoes.tipoContexto;
    var registrarNoHistorico = opcoes.registrarNoHistorico;

    if (!pergunta || !pergunta.trim()) return null;

    _verificarExpiracao();

    var contexto  = _serializarContexto(resultados || []);
    var historico = _getHistoricoParaEnvio();

    // Captura ANTES do envio e ANTES de _registrarTurno().
    // Após o retorno do fetch, _registrarTurno() incrementa o contador,
    // tornando status().turnosNoHistorico inapropriado para esta decisão.
    var turnosAoEnviar = historico.length / 2;

    var resultado = await _chamarWorker({
      pergunta:     pergunta.trim(),
      contexto:     contexto,
      historico:    historico,
      disciplina:   disciplina || '',
      tipoContexto: tipoContexto || 'conteudo',
      ehQuestao:    false,
    });

    if (!resultado) {
      console.warn('[NexusWorker] falha no worker — fallback local ativado.');
      return null;
    }

    var textoFormatado = _markdownParaTexto(resultado.resposta);

    if (resultado.fonte) {
      console.log('[NexusWorker] usando ' + resultado.fonte +
        (resultado.modelo ? ' · modelo: ' + resultado.modelo : ''));
    }

    var deveRegistrar = registrarNoHistorico !== false;
    if (deveRegistrar) {
      _registrarTurno(pergunta.trim(), textoFormatado);
    }

    return {
      texto:          textoFormatado,
      fonte:          resultado.fonte,
      modelo:         resultado.modelo,
      turnosAoEnviar: turnosAoEnviar,
    };
  }

  function limparHistorico() {
    _historico       = [];
    _ultimaAtividade = 0;
    console.log('[NexusWorker] histórico de sessão limpo.');
  }

  /**
   * restaurarHistorico(mensagens)
   *
   * Reconstrói _historico a partir do array de mensagens visuais
   * salvas pelo NexusHistory. Chamado por assistant.js em
   * _restaurarSessao() quando o histórico visual é recarregado após F5.
   *
   * Regras:
   *   - Ignora mensagens role:'system' (banner de boas-vindas etc.)
   *   - Converte role:'bot' → role:'assistant' (contrato do worker remoto)
   *   - Aplica o mesmo limite MAX_TURNS que _registrarTurno()
   *   - Atualiza _ultimaAtividade para evitar expiração imediata
   *
   * @param {Array<{ role: string, text: string }>} mensagens
   */
  function restaurarHistorico(mensagens) {
    if (!Array.isArray(mensagens) || !mensagens.length) return;

    var pares = [];
    for (var i = 0; i < mensagens.length - 1; i++) {
      if (mensagens[i].role === 'user' && mensagens[i + 1].role === 'bot') {
        pares.push(
          { role: 'user',      content: mensagens[i].text     || '' },
          { role: 'assistant', content: mensagens[i + 1].text || '' }
        );
        i++;
      }
    }

    if (!pares.length) return;

    var maxMensagens = MAX_TURNS * 2;
    if (pares.length > maxMensagens) {
      pares = pares.slice(pares.length - maxMensagens);
    }

    _historico       = pares;
    _ultimaAtividade = Date.now();

    console.log('[NexusWorker] histórico restaurado — ' + (_historico.length / 2) + ' turno(s).');
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
    restaurarHistorico,
    setHabilitado,
    status,
  };

}());