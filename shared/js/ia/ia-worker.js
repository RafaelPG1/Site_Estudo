/**
 * ASSISTENTE NEXUS — ia-worker.js
 * Módulo de integração com a IA externa.
 *
 * Responsabilidades exclusivas:
 *   - Manter histórico curto da sessão (somente em memória)
 *   - Serializar resultados do NexusSearch em contexto de texto
 *   - Comunicar com o worker (POST)
 *   - Fallback em caso de falha
 *   - Converter markdown da resposta em texto formatado para NexusUI
 *
 * NÃO:
 *   - Conhece disciplinas, semestres ou o índice de busca
 *   - Toca no DOM diretamente
 *   - Persiste dados fora da sessão atual
 *   - Salva perguntas do usuário
 *
 * API pública: window.NexusWorker
 *
 * Dependências: nenhuma (pode ser carregado antes ou depois de ia.js).
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
 *
 * ── CHANGELOG ────────────────────────────────────────────────
 * FIX TUTOR — _serializarContexto() reescrito: contexto agora é
 *   emoldurado como "fatos de referência", não como "material de apoio".
 *   O frame anterior induzia o modelo a reformular os trechos.
 *   O novo frame instrui o modelo a usar os fatos como âncora factual
 *   enquanto formula a própria resposta de tutor.
 *
 * FIX TUTOR — modoExplicacao removido do payload. O worker v7.1
 *   não usa mais esse campo para selecionar system prompt. O modelo
 *   interpreta o estilo diretamente a partir da pergunta do usuário,
 *   o que produz respostas mais naturais e adaptadas.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CONFIGURAÇÃO
     ══════════════════════════════════════════════════════════ */

  // URL do Cloudflare Worker. Trocar aqui quando necessário.
  const WORKER_URL = 'https://restless-flower-1924.rafaelpeixoto475.workers.dev/';

  // Máximo de turnos (par user+assistant) mantidos no histórico.
  // 5 turnos = 10 mensagens → contexto de ~3 trocas anteriores visíveis.
  const MAX_TURNS = 5;

  // Tempo de inatividade em ms antes de expirar o histórico (2 horas).
  const SESSION_TTL_MS = 2 * 60 * 60 * 1000;

  // Limite de caracteres para o contexto enviado ao worker.
  // Worker aceita até 4500 — mantemos margem para historico e pergunta.
  const CONTEXTO_MAX = 3000;

  /* ══════════════════════════════════════════════════════════
     ESTADO INTERNO
     ══════════════════════════════════════════════════════════ */

  // Histórico limpo: apenas { role: 'user'|'assistant', content: string }
  // Nunca inclui 'system', 'bot', feedbackId ou HTML.
  let _historico = [];

  // Timestamp da última interação. Usado para expirar o histórico.
  let _ultimaAtividade = 0;

  // Flag que permite desabilitar a IA sem remover o módulo.
  // ia.js pode chamar NexusWorker.setHabilitado(false) para voltar ao
  // modo somente-busca sem recarregar a página.
  let _habilitado = true;

  /* ══════════════════════════════════════════════════════════
     HISTÓRICO DE SESSÃO
     ══════════════════════════════════════════════════════════ */

  /**
   * Verifica e aplica a expiração por inatividade.
   * Chamado no início de cada interação.
   */
  function _verificarExpiracao() {
    if (_ultimaAtividade > 0 && Date.now() - _ultimaAtividade > SESSION_TTL_MS) {
      _historico = [];
      console.log('[NexusWorker] histórico expirado por inatividade.');
    }
  }

  /**
   * Registra um turno completo no histórico.
   * Descarta o turno mais antigo quando MAX_TURNS é atingido.
   *
   * @param {string} pergunta  — texto do usuário (já enviado ao worker)
   * @param {string} resposta  — texto da IA (sem HTML)
   */
  function _registrarTurno(pergunta, resposta) {
    _historico.push({ role: 'user',      content: pergunta });
    _historico.push({ role: 'assistant', content: resposta });

    // Mantém apenas os últimos MAX_TURNS turnos (MAX_TURNS * 2 mensagens)
    const maxMensagens = MAX_TURNS * 2;
    if (_historico.length > maxMensagens) {
      _historico = _historico.slice(_historico.length - maxMensagens);
    }

    _ultimaAtividade = Date.now();
  }

  /**
   * Retorna uma cópia do histórico para envio ao worker.
   * Exclui o último par (pergunta atual) — ele já está no campo `pergunta`.
   * O worker usa o histórico para contexto das trocas ANTERIORES.
   *
   * @returns {{ role: string, content: string }[]}
   */
  function _getHistoricoParaEnvio() {
    // O histórico contém turnos já finalizados.
    // Enviamos tudo — a pergunta atual ainda não foi registrada.
    return _historico.slice();
  }

  /* ══════════════════════════════════════════════════════════
     SERIALIZAÇÃO DO CONTEXTO
     ══════════════════════════════════════════════════════════ */

  /**
   * Converte os resultados de NexusSearch.buscar() em uma string de
   * contexto para o worker.
   *
   * FIX TUTOR: o formato anterior apresentava os trechos como
   * "Material de apoio", um frame que induzia o modelo a reformulá-los.
   * O novo formato os apresenta como "Fatos de referência" e inclui
   * uma instrução explícita de que o modelo deve usá-los como âncora
   * factual — não como roteiro a ser reescrito.
   *
   * Formato gerado:
   *   Fatos de referência (use como âncora, não reescreva):
   *   • [Aula X · Seção Y] trecho do conteúdo...
   *   • [Aula X · Seção Z] outro trecho...
   *
   * @param {{ score: number, texto: string, aula: string, secao: string }[]} resultados
   * @returns {string} contexto serializado, limitado a CONTEXTO_MAX chars
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
   * Heurística simples para sinalizar ao worker que a pergunta
   * é sobre uma questão de prova/exercício.
   *
   * @param {string} pergunta
   * @returns {boolean}
   */
  function _ehQuestao(pergunta) {
    return (
      /\b[A-Ea-e]\s*[\)\.]/.test(pergunta) ||
      /qual\s+(a\s+)?(resposta|alternativa|correta|certa|gabarito)/i.test(pergunta) ||
      /quest[aã]o\s+\d+/i.test(pergunta) ||
      /me\s+explica/i.test(pergunta)
    );
  }

  /* ══════════════════════════════════════════════════════════
     FORMATAÇÃO DE MARKDOWN
     Copiado de ia_antigo e adaptado para retornar texto puro
     (com \n para quebras de linha) em vez de HTML, já que
     NexusUI.renderMessage() usa _sanitize() + \n→<br>.
     ══════════════════════════════════════════════════════════ */

  /**
   * Converte markdown simples para texto com formatação visual mínima.
   * NexusUI espera texto puro — não HTML — nas mensagens do bot.
   * Converte bold, listas e cabeçalhos para representações em texto.
   *
   * @param {string} texto
   * @returns {string}
   */
  function _markdownParaTexto(texto) {
    if (!texto) return '';

    return texto
      // Remove blocos de código (mantém só o conteúdo)
      .replace(/```[\w]*\n?([\s\S]*?)```/g, function (_, cod) {
        return '\n' + cod.trim() + '\n';
      })
      // Inline code: remove backticks
      .replace(/`([^`]+)`/g, '$1')
      // Negrito: **texto** ou __texto__
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      // Itálico: *texto* ou _texto_
      .replace(/\*([^*\n]+)\*/g, '$1')
      .replace(/_([^_\n]+)_/g, '$1')
      // Cabeçalhos → linha em maiúscula
      .replace(/^#{1,3}\s+(.+)$/gm, function (_, titulo) {
        return titulo.toUpperCase();
      })
      // Listas: * item ou - item → • item
      .replace(/^[*\-]\s+(.+)$/gm, '• $1')
      // Colapsa 3+ newlines para no máximo 2
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  /* ══════════════════════════════════════════════════════════
     COMUNICAÇÃO COM O WORKER
     ══════════════════════════════════════════════════════════ */

  /**
   * Envia a requisição ao worker e retorna { resposta, fonte, modelo }.
   * Não lança exceção — erros são normalizados no chamador (perguntar()).
   *
   * @param {object} payload
   * @returns {Promise<{ resposta: string, fonte: string, modelo: string }|null>}
   */
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
      // Rate limit — sinaliza de volta ao chamador com mensagem específica
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
   * Chamado por ia.js no bloco de busca normal, APÓS NexusSearch.buscar().
   *
   * Recebe a pergunta e os resultados já prontos do NexusSearch.
   * Monta o contexto, chama o worker, registra o turno, retorna o texto.
   *
   * Em caso de falha, retorna null para que ia.js use o fallback local.
   *
   * FIX TUTOR: modoExplicacao não é mais enviado ao worker. O modelo
   * adapta o estilo de resposta a partir da própria pergunta do usuário.
   *
   * GLOBAL-3: tipoContexto ('conteudo' | 'global' | 'estrutura') é
   * repassado ao worker para seleção do system prompt adequado.
   *
   * @param {{
   *   pergunta:     string,
   *   resultados:   { score: number, texto: string, aula: string, secao: string }[],
   *   disciplina:   string,
   *   tipoContexto: string,
   * }} opcoes
   *
   * @returns {Promise<{ texto: string, fonte: string|null, modelo: string|null }|null>}
   *   null = falhou, ia.js deve usar fallback local (_formatarResposta)
   */
  async function perguntar(opcoes) {
    if (!_habilitado) return null;

    const { pergunta, resultados, disciplina, tipoContexto } = opcoes;

    if (!pergunta || !pergunta.trim()) return null;

    _verificarExpiracao();

    const contexto   = _serializarContexto(resultados);
    const historico  = _getHistoricoParaEnvio();
    const ehQuestao_ = _ehQuestao(pergunta);

    const resultado = await _chamarWorker({
      pergunta:      pergunta.trim(),
      contexto:      contexto,
      historico:     historico,
      disciplina:    disciplina || '',
      ehQuestao:     ehQuestao_,
      tipoContexto:  tipoContexto || 'conteudo',
      // modoExplicacao removido: o worker não usa mais esse campo.
    });

    // Falha de rede ou worker indisponível — sinaliza fallback
    if (!resultado) {
      console.warn('[NexusWorker] falha no worker — fallback local ativado.');
      return null;
    }

    const textoFormatado = _markdownParaTexto(resultado.resposta);

    // Log claro do provedor e modelo utilizados
    if (resultado.fonte) {
      console.log('[NexusWorker] usando ' + resultado.fonte +
        (resultado.modelo ? ' · modelo: ' + resultado.modelo : ''));
    }

    // Registra o turno somente após sucesso confirmado
    _registrarTurno(pergunta.trim(), textoFormatado);

    return {
      texto:  textoFormatado,
      fonte:  resultado.fonte,
      modelo: resultado.modelo,
    };
  }

  /**
   * Limpa o histórico da sessão.
   * Deve ser chamado por ia.js em _resetarChat() e em _limparContexto().
   */
  function limparHistorico() {
    _historico       = [];
    _ultimaAtividade = 0;
    console.log('[NexusWorker] histórico de sessão limpo.');
  }

  /**
   * Habilita ou desabilita a IA sem recarregar a página.
   * Quando desabilitada, perguntar() retorna null imediatamente,
   * fazendo ia.js cair no fallback local.
   *
   * @param {boolean} valor
   */
  function setHabilitado(valor) {
    _habilitado = !!valor;
    console.log('[NexusWorker] IA ' + (_habilitado ? 'habilitada' : 'desabilitada') + '.');
  }

  /**
   * Retorna o estado atual do módulo.
   * Útil para diagnóstico em ia.js.
   *
   * @returns {{ habilitado: boolean, turnosNoHistorico: number }}
   */
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