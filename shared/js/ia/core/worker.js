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
 * POST { pergunta, instrucao, contexto, historico, disciplina, tipoContexto, ehQuestao }
 *   pergunta  = só o que o aluno digitou (limite de 500 no servidor)
 *   instrucao = orientação de tutor gerada pelo assistant (limite próprio)
 *   provedor  = 'auto' | 'groq' | 'gemini' | 'openrouter' (vem do NexusModelPicker)
 * ← { resposta: string, fonte: string, modelo: string }
 *
 * ── TIMEOUT E AVISOS (Fase 6) ────────────────────────────────
 * A requisição ao Worker é cancelada após TIMEOUT_MS (30 s, cobre
 * também a leitura do corpo). Timeout e HTTP 429 NÃO são respostas
 * da IA: perguntar() devolve a mensagem amigável ao chamador
 * (mesmo formato { texto, fonte:null, modelo:null, turnosAoEnviar }),
 * mas NÃO grava o turno no histórico de sessão, e
 * restaurarHistorico() ignora pares cuja resposta seja um desses
 * avisos (inclusive os já salvos no histórico visual). Não há retry
 * automático. O botão Parar (parar()) segue cancelando sem mensagem.
 *
 * ── HISTÓRICO DE SESSÃO ──────────────────────────────────────
 * Mantém apenas as últimas MAX_TURNS interações (user + assistant).
 * Somente texto limpo — sem role 'system', metadados ou HTML.
 * Expira automaticamente após SESSION_TTL_MS de inatividade.
 * Reset explícito disponível via NexusWorker.limparHistorico().
 * Restauração após F5 via NexusWorker.restaurarHistorico(msgs).
 *
 * ── NOTA (não-alteração) ─────────────────────────────────────
 * Este histórico (_historico) é independente da árvore de versões
 * mantida em resumo/assistant_resumo.js e quiz/js/assistant.js. A API
 * pública já suportava sincronização (limparHistorico +
 * restaurarHistorico); o bug de vazamento de contexto entre ramos
 * estava na ausência da CHAMADA a essas funções nos assistants ao
 * trocar de versão / editar mensagem — corrigido nos assistants,
 * não aqui. Este arquivo não foi modificado.
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

  var WORKER_URL     = 'https://site-estudo.rafaelpeixoto475.workers.dev/';
  var MAX_TURNS      = 5;
  var SESSION_TTL_MS = 2 * 60 * 60 * 1000;
  // Teto de segurança para o contexto (enunciado + alternativas de questões grandes).
  // Precisa ser <= MAX_CONTEXTO_CHARS do Cloudflare Worker.
  var CONTEXTO_MAX   = 20000;
  // Tempo máximo de espera pela resposta do Cloudflare Worker.
  var TIMEOUT_MS     = 30000;

  // Avisos mostrados ao usuário. NÃO são respostas da IA: não vão ao histórico.
  var MSG_RATE_LIMIT = '⚠️ Muitas perguntas agora 😅 Tente novamente em alguns segundos.';
  var MSG_TIMEOUT    = '⏱️ A IA demorou demais para responder. Tente novamente.';

  /* ══════════════════════════════════════════════════════════
     ESTADO INTERNO
  ══════════════════════════════════════════════════════════ */

  var _historico       = [];
  var _ultimaAtividade = 0;
  var _habilitado      = true;
  var _controllerAtual  = null;

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
    var controller = new AbortController();
    _controllerAtual = controller;

    // Timeout próprio: aborta o mesmo controller, mas marca `estourou`
    // para distinguir de um cancelamento do usuário (parar()).
    var estourou = false;
    var timer = setTimeout(function () {
      estourou = true;
      controller.abort();
    }, TIMEOUT_MS);

    try {
      var res;
      try {
        res = await fetch(WORKER_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload),
          signal:  controller.signal,
        });
      } catch (err) {
        _controllerAtual = null;
        if (err && err.name === 'AbortError') {
          if (estourou) {
            console.warn('[NexusWorker] timeout de ' + (TIMEOUT_MS / 1000) + 's aguardando o worker.');
            return { timeout: true };
          }
          console.log('[NexusWorker] requisição cancelada pelo usuário.');
          return { cancelado: true };
        }
        console.warn('[NexusWorker] falha de rede ao chamar worker:', err);
        return null;
      }
      _controllerAtual = null;

      if (res.status === 429) {
        return { limite: true };
      }

      if (!res.ok) {
        console.warn('[NexusWorker] worker retornou HTTP', res.status);
        return null;
      }

      var data;
      try {
        data = await res.json();
      } catch (err) {
        if (estourou) {
          console.warn('[NexusWorker] timeout de ' + (TIMEOUT_MS / 1000) + 's lendo a resposta do worker.');
          return { timeout: true };
        }
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
    } finally {
      clearTimeout(timer);
    }
  }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA PRINCIPAL
  ══════════════════════════════════════════════════════════ */

  /**
   * Ponto de entrada principal.
   * Serializa os resultados passados e envia ao worker remoto.
   *
   * Quem chama (resumo/assistant_resumo.js, quiz/assistant_quiz.js) é responsável
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
    var ehQuestao            = opcoes.ehQuestao;
    var instrucao            = opcoes.instrucao;
    // Modelo escolhido no seletor (NexusModelPicker, definido em core/ui.js). 'auto' = cascata com fallback.
    var provedor             = (window.NexusModelPicker && window.NexusModelPicker.get()) || 'auto';

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
      instrucao:    (instrucao || '').trim(),
      provedor:     provedor,
      contexto:     contexto,
      historico:    historico,
      disciplina:   disciplina || '',
      tipoContexto: tipoContexto || 'conteudo',
      ehQuestao:    !!ehQuestao,
    });

    if (resultado && resultado.cancelado) {
      return { cancelado: true };
    }

    // Avisos (429 / timeout): exibidos ao usuário, mas NÃO são resposta da
    // IA — não entram no histórico de sessão (_registrarTurno não é chamado).
    if (resultado && (resultado.limite || resultado.timeout)) {
      return {
        texto:          resultado.limite ? MSG_RATE_LIMIT : MSG_TIMEOUT,
        fonte:          null,
        modelo:         null,
        turnosAoEnviar: turnosAoEnviar,
      };
    }

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
   * _restaurarSessao() quando o histórico visual é recarregado após F5,
   * e também — a partir da correção do bug de vazamento de contexto —
   * em _onTrocarVersao() e _onEditarMensagem(), para realinhar este
   * histórico interno com o ramo atualmente ativo da árvore de
   * versões.
   *
   * Regras:
   *   - Ignora mensagens role:'system' (banner de boas-vindas etc.)
   *   - Ignora pares cuja resposta seja o aviso de 429 ou de timeout
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
        // Avisos de 429/timeout salvos no histórico visual não são resposta da IA.
        var textoBot = (mensagens[i + 1].text || '').trim();
        if (textoBot === MSG_RATE_LIMIT || textoBot === MSG_TIMEOUT) { i++; continue; }
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

  function parar() {
    if (_controllerAtual) {
      _controllerAtual.abort();
    }
  }

  /* ══════════════════════════════════════════════════════════
     REGISTRO GLOBAL
  ══════════════════════════════════════════════════════════ */

function exportarHistorico() {
  return _historico.slice();
}

window.NexusWorker = {
  perguntar,
  limparHistorico,
  restaurarHistorico,
  exportarHistorico,
  setHabilitado,
  status,
  parar,
};
}());