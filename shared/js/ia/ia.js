/**
 * ASSISTENTE NEXUS — ia.js
 * Controlador principal. Ponto de entrada único.
 *
 * Dependências (carregadas antes deste script):
 *   ia-ui.js     → window.NexusUI
 *   ia-search.js → window.NexusSearch
 *
 * Ponte com ES Modules:
 *   window.__nexusCtx → exposto pelo global.js
 *   { getSemestre(), getDisciplinas(), parseSemestre() }
 */

(function () {
  'use strict';

  /* ── CONSTANTES ──────────────────────────────────────────── */
  const REPLY_DELAY_MS = 900;
  const TOP_K          = 3;    // máximo de trechos retornados
  const MIN_SCORE      = 10;   // score mínimo para considerar relevante

  const FALLBACK_SEM_CONTEUDO =
    'Ainda não há conteúdo indexado para o semestre atual. ' +
    'Verifique se a disciplina está disponível.';

  const FALLBACK_SEM_RESULTADO =
    'Não encontrei nada relacionado nos resumos disponíveis. ' +
    'Tente reformular a pergunta.';

  /* ── ESTADO ──────────────────────────────────────────────── */
  const state = {
    messages:     [],
    typingTimer:  null,
    contextoOk:   false,   // true após primeiro carregamento bem-sucedido
  };

  /* ── HELPERS ─────────────────────────────────────────────── */
  function _getTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function _push(msg) {
    state.messages.push(msg);
    return msg;
  }

  /* ══════════════════════════════════════════════════════════
     CONTEXTO — lê do global.js via window.__nexusCtx
     ══════════════════════════════════════════════════════════ */

  /**
   * Lê o semestre atual e retorna o contexto da PRIMEIRA disciplina
   * disponível (na home, não há disciplina selecionada — usamos a primeira).
   *
   * Retorna null se não for possível montar o contexto.
   * @returns {{ ano, periodo, ap, arquivo } | null}
   */
  function _resolverContexto() {
    const ctx = window.__nexusCtx;
    if (!ctx) {
      console.warn('[NexusAssistant] window.__nexusCtx não disponível. global.js expôs a ponte?');
      return null;
    }

    const semestre    = ctx.getSemestre();
    const parsed      = ctx.parseSemestre(semestre);
    const disciplinas = ctx.getDisciplinas(semestre);

    if (!disciplinas || !disciplinas.length) {
      console.warn('[NexusAssistant] Nenhuma disciplina para o semestre:', semestre);
      return null;
    }

    // Na home: usa a primeira disciplina da lista.
    // Futuramente: receber disciplina selecionada pelo usuário no chat.
    const disc = disciplinas[0];

    return {
      ano:     parsed.ano,
      periodo: parsed.periodo,
      ap:      parsed.ap,       // ex: 'AP1' | null
      arquivo: disc.arquivo,    // ex: 'redes'
      disc:    disc.apelido,    // para exibir ao usuário
    };
  }

  /* ══════════════════════════════════════════════════════════
     FORMATAÇÃO DA RESPOSTA
     ══════════════════════════════════════════════════════════ */

  /**
   * Formata os resultados da busca em texto legível para o chat.
   * Futuramente: delegar a ia-engine.js (LLM) para síntese.
   * @param {string} pergunta
   * @param {Array<{ score, texto, aula, secao }>} resultados
   * @param {string} nomeDisc — apelido da disciplina
   * @returns {string}
   */
  function _formatarResposta(pergunta, resultados, nomeDisc) {
    if (!resultados.length) return FALLBACK_SEM_RESULTADO;

    // Agrupa por aula para evitar repetição
    const porAula = {};
    resultados.forEach(function (r) {
      if (!porAula[r.aula]) porAula[r.aula] = [];
      porAula[r.aula].push(r.texto);
    });

    const linhas = [];
    linhas.push('📚 ' + nomeDisc + ' — resultados para "' + pergunta + '":');
    linhas.push('');

    Object.keys(porAula).forEach(function (aula) {
      linhas.push('▸ ' + aula);
      porAula[aula].forEach(function (trecho) {
        // Trunca trechos muito longos para o chat
        const curto = trecho.length > 200 ? trecho.slice(0, 197) + '…' : trecho;
        linhas.push('  ' + curto);
      });
      linhas.push('');
    });

    return linhas.join('\n').trim();
  }

  /* ══════════════════════════════════════════════════════════
     FLUXO DO CHAT
     ══════════════════════════════════════════════════════════ */

  /**
   * Chamado pelo NexusUI quando o usuário submete uma mensagem.
   * @param {string} text
   */
  function _onUserSend(text) {
    // 1. Exibe mensagem do usuário
    const userMsg = _push({ role: 'user', text: text, time: _getTime() });
    NexusUI.renderMessage(userMsg);

    // 2. Typing indicator
    NexusUI.showTyping();
    if (state.typingTimer) clearTimeout(state.typingTimer);

    // 3. Resolve contexto e busca
    state.typingTimer = setTimeout(function () {
      _responder(text);
    }, REPLY_DELAY_MS);
  }

  async function _responder(pergunta) {
    try {
      // Resolve contexto atual
      const ctx = _resolverContexto();

      if (!ctx) {
        NexusUI.hideTyping();
        _renderBot(FALLBACK_SEM_CONTEUDO);
        return;
      }

      // Informa o motor de busca sobre o contexto
      NexusSearch.setContexto(ctx);

      // Garante que o conteúdo está carregado e indexado
      const ok = await NexusSearch.garantirConteudo();

      NexusUI.hideTyping();

      if (!ok) {
        _renderBot(FALLBACK_SEM_CONTEUDO);
        return;
      }

      // Executa a busca
      const resultados = NexusSearch.buscar(pergunta, { topK: TOP_K, minScore: MIN_SCORE });
      const resposta   = _formatarResposta(pergunta, resultados, ctx.disc);

      _renderBot(resposta);

    } catch (err) {
      console.error('[NexusAssistant] erro ao responder:', err);
      NexusUI.hideTyping();
      _renderBot('Ocorreu um erro ao processar sua pergunta. Tente novamente.');
    }
  }

  function _renderBot(text) {
    const msg = _push({ role: 'bot', text: text, time: _getTime() });
    NexusUI.renderMessage(msg);
  }

  /* ══════════════════════════════════════════════════════════
     EVENTO — semestre mudou
     Quando o usuário troca o semestre no select, reseta o contexto
     para que o próximo buscar() recarregue o arquivo correto.
     ══════════════════════════════════════════════════════════ */
  document.addEventListener('nexus:semestreChanged', function () {
    NexusSearch.setContexto(null);
    console.log('[NexusAssistant] semestre mudou — contexto resetado.');
  });

  /* ══════════════════════════════════════════════════════════
     MENSAGEM DE BOAS-VINDAS
     ══════════════════════════════════════════════════════════ */
  function _addWelcomeMessage() {
    const welcome = _push({
      role: 'system',
      text: '⬡  Nexus v1.0 · Interface inicializada',
      time: _getTime(),
    });
    NexusUI.renderMessage(welcome);
  }

  /* ══════════════════════════════════════════════════════════
     VERIFICAÇÃO DE DEPENDÊNCIAS
     ══════════════════════════════════════════════════════════ */
  function _depsOk() {
    if (typeof window.NexusUI === 'undefined') {
      console.error('[NexusAssistant] NexusUI não encontrado. ia-ui.js carregado?');
      return false;
    }
    if (typeof window.NexusSearch === 'undefined') {
      console.error('[NexusAssistant] NexusSearch não encontrado. ia-search.js carregado?');
      return false;
    }
    if (typeof window.__nexusCtx === 'undefined') {
      console.error('[NexusAssistant] __nexusCtx não encontrado. global.js expôs a ponte?');
      return false;
    }
    return true;
  }

  /* ══════════════════════════════════════════════════════════
     INICIALIZAÇÃO
     ══════════════════════════════════════════════════════════ */
  function init() {
    if (!_depsOk()) return;
    if (document.getElementById('nexus-fab')) return; // já inicializado

    NexusUI.init({ onSend: _onUserSend });
    _addWelcomeMessage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── API PÚBLICA ─────────────────────────────────────────── */
  window.NexusAssistant = {
    open:   function () { NexusUI.open();   },
    close:  function () { NexusUI.close();  },
    toggle: function () { NexusUI.toggle(); },
  };

}());