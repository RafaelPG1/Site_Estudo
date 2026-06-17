// @ts-nocheck
/* ============================================================
   NEXUS — shared/js/ia/core/ctx.js  v1.0

   RESPONSABILIDADES (apenas estas):
     1. Gravar o contexto ativo no sessionStorage        (escrita)
     2. Detectar troca de contexto entre páginas         (decisão)
     3. Expor deveResetar() para worker e assistant      (leitura)
     4. Expor confirmarReset() — chamado só pelo assistant

   PROIBIÇÕES ABSOLUTAS:
     ✗ Limpar histórico de chat ou worker
     ✗ Tocar no DOM
     ✗ Conhecer worker.js, assistant.js ou init scripts
     ✗ Carregar outros módulos

   QUEM CHAMA ESTE MÓDULO:
     - template_init.js   → declarar() antes de _carregarIA()
     - disciplinas_init.js → declarar() antes de _carregarIA()
     - worker.js          → deveResetar() no boot síncrono
     - assistant.js       → deveResetar() + confirmarReset() em initUI()
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'nexus_ctx';       // JSON: { disc, modo, sem, pagina }
  var DIRTY_KEY   = 'nexus_ctx_dirty'; // '1' quando contexto mudou

  /* ── Leitura interna ─────────────────────────────────────── */

  function _lerCtxSalvo() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  /**
   * Serializa contexto para comparação estável.
   * Normaliza undefined/null para '' para evitar falsos positivos.
   * Campos: disc | modo | sem | pagina (todos lowercase).
   */
  function _hash(ctx) {
    return [
      (ctx.disc   || '').toLowerCase(),
      (ctx.modo   || '').toLowerCase(),
      (ctx.sem    || '').toLowerCase(),
      (ctx.pagina || '').toLowerCase(),
    ].join('|');
  }

  /* ── API pública ─────────────────────────────────────────── */

  /**
   * declarar({ disc, modo, sem, pagina })
   *
   * Chamado pelos init scripts ANTES de _carregarIA().
   * Compara o contexto recebido com o salvo no sessionStorage.
   *
   * Se diferente → grava dirty='1' e atualiza nexus_ctx.
   * Se igual     → não toca em nada (worker e assistant restauram normalmente).
   *
   * Execução: síncrona, sem dependências externas.
   */
  function declarar(novoCtx) {
    try {
      var salvo    = _lerCtxSalvo();
      var novoHash = _hash(novoCtx);
      var salvoHash = salvo ? _hash(salvo) : null;

      if (novoHash !== salvoHash) {
        sessionStorage.setItem(DIRTY_KEY,   '1');
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(novoCtx));
        console.log('[NexusCtx] contexto alterado →', novoCtx);
      }
    } catch (_) {}
  }

  /**
   * deveResetar()
   *
   * Retorna true se nexus_ctx_dirty === '1'.
   * Chamado por worker.js no boot síncrono e por assistant.js em initUI().
   * Leitura pura — não modifica nada.
   */
  function deveResetar() {
    try { return sessionStorage.getItem(DIRTY_KEY) === '1'; } catch (_) { return false; }
  }

  /**
   * confirmarReset()
   *
   * Remove nexus_ctx_dirty do sessionStorage.
   * Chamado UMA VEZ, por assistant.js, após limpar storage + DOM.
   * NÃO deve ser chamado por worker.js.
   */
  function confirmarReset() {
    try { sessionStorage.removeItem(DIRTY_KEY); } catch (_) {}
  }

  /**
   * contextoAtivo()
   *
   * Retorna o contexto salvo (objeto) ou null.
   * Uso: debug, telemetria, inspeção de estado.
   */
  function contextoAtivo() {
    return _lerCtxSalvo();
  }

  window.NexusCtx = { declarar, deveResetar, confirmarReset, contextoAtivo };

}());