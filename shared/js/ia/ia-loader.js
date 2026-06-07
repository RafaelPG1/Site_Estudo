/**
 * ASSISTENTE NEXUS — ia-loader.js
 * Responsabilidade exclusiva: carregar arquivos res_*.js no DOM.
 *
 * NÃO indexa. NÃO busca. NÃO conhece o motor de busca.
 * Retorna o conteúdo bruto para quem chamar — o orquestrador decide o que fazer.
 *
 * API pública: window.NexusLoader
 *
 * Dependências: nenhuma.
 */

(function () {
  'use strict';

  /* ── ESTADO INTERNO ──────────────────────────────────────── */

  // Path do último arquivo carregado com sucesso.
  // null = nenhum arquivo carregado nesta sessão.
  let _pathCarregado = null;

  /* ══════════════════════════════════════════════════════════
     MONTAGEM DE PATH
     ══════════════════════════════════════════════════════════ */

  /**
   * Monta o path do arquivo res_*.js a partir do contexto.
   *
   * Usa path relativo (sem / inicial) para funcionar corretamente
   * tanto em localhost quanto no GitHub Pages com subdiretório.
   *
   * Formatos suportados:
   *   Com AP:  content/resumo/{ano}/{periodo}/{ap}/res_{arquivo}.js
   *   Sem AP:  content/resumo/{ano}/{periodo}/res_{arquivo}.js
   *
   * @param {{ ano: string, periodo: string, ap: string|null, arquivo: string }} ctx
   * @returns {string}
   */
  function _montarPath(ctx) {
    const base = 'content/resumo/' + ctx.ano + '/' + ctx.periodo;
    if (ctx.ap) {
      return base + '/' + ctx.ap + '/res_' + ctx.arquivo + '.js';
    }
    return base + '/res_' + ctx.arquivo + '.js';
  }

  /* ══════════════════════════════════════════════════════════
     CARREGAMENTO
     ══════════════════════════════════════════════════════════ */

  /**
   * Injeta um <script> no DOM e aguarda seu carregamento.
   * Remove o script anterior (id='nexus-conteudo-script') antes de injetar.
   * Limpa window.__nexusConteudo antes de cada carregamento para evitar
   * leitura de conteúdo stale de outra disciplina.
   *
   * @param {string} path
   * @returns {Promise<object|null>} conteúdo (__nexusConteudo) ou null em caso de falha
   */
  function _injetarScript(path) {
    return new Promise(function (resolve) {
      // Remove script anterior do DOM (não afeta o índice — só o DOM)
      const anterior = document.getElementById('nexus-conteudo-script');
      if (anterior) anterior.remove();

      // Garante que não existe conteúdo stale de outra disciplina
      window.__nexusConteudo = undefined;

      const s = document.createElement('script');
      s.id  = 'nexus-conteudo-script';
      s.src = path;

      s.onload = function () {
        if (window.__nexusConteudo) {
          resolve(window.__nexusConteudo);
        } else {
          console.warn('[NexusLoader] script carregado mas __nexusConteudo não definido:', path);
          resolve(null);
        }
      };

      s.onerror = function () {
        console.warn('[NexusLoader] falha ao carregar script:', path);
        resolve(null);
      };

      document.body.appendChild(s);
    });
  }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
     ══════════════════════════════════════════════════════════ */

  /**
   * Carrega o arquivo res_*.js correspondente ao contexto.
   *
   * Cache: se o path resultante for idêntico ao último carregado
   * com sucesso E window.__nexusConteudo ainda existir, retorna
   * o conteúdo em memória sem nova injeção de script.
   *
   * @param {{ ano: string, periodo: string, ap: string|null, arquivo: string }} ctx
   * @returns {Promise<object|null>} conteúdo ou null
   */
  async function carregar(ctx) {
    if (!ctx || !ctx.arquivo) {
      console.warn('[NexusLoader] carregar: contexto inválido.', ctx);
      return null;
    }

    const path = _montarPath(ctx);

    // Cache hit: mesmo arquivo já carregado e conteúdo ainda na memória
    if (_pathCarregado === path && window.__nexusConteudo) {
      console.log('[NexusLoader] cache hit:', path);
      return window.__nexusConteudo;
    }

    console.log('[NexusLoader] carregando:', path);
    const conteudo = await _injetarScript(path);

    if (conteudo) {
      _pathCarregado = path;
      console.log('[NexusLoader] carregado com sucesso:', path);
    } else {
      // Carregamento falhou — reseta cache para forçar nova tentativa futura
      _pathCarregado = null;
    }

    return conteudo;
  }

  /**
   * Reseta o cache interno.
   * Deve ser chamado ao trocar de semestre ou quando o contexto
   * for explicitamente invalidado.
   *
   * NÃO remove o script do DOM (desnecessário — será substituído
   * no próximo carregamento).
   */
  function limpar() {
    _pathCarregado = null;
    window.__nexusConteudo = undefined;
    console.log('[NexusLoader] cache limpo.');
  }

  /**
   * Retorna o path do arquivo atualmente em cache, ou null.
   * Útil para diagnóstico e para ia.js verificar mudanças de contexto.
   *
   * @returns {string|null}
   */
  function pathAtual() {
    return _pathCarregado;
  }

  window.NexusLoader = {
    carregar,
    limpar,
    pathAtual,
  };

}());