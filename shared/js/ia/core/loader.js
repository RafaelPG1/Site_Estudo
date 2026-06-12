/**
 * NEXUS — shared/js/ia/core/loader.js
 *
 * Responsabilidade exclusiva: carregar arquivos de conteúdo no DOM.
 *
 * NÃO indexa. NÃO busca. NÃO conhece resumo nem quiz.
 * Retorna o conteúdo bruto para quem chamar — o assistant decide o que fazer.
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
     DETECÇÃO DA RAIZ DO SITE
  ══════════════════════════════════════════════════════════ */

  /**
   * Detecta a URL raiz do site a partir do src do próprio script.
   *
   * loader.js sempre está em: <raiz>/shared/js/ia/core/loader.js
   * Sobe 5 segmentos para obter a raiz absoluta — funciona em localhost
   * e no GitHub Pages com qualquer subdiretório, independente de qual
   * página chamou o script.
   *
   * Exemplo:
   *   src = "https://rafaelpg1.github.io/Site_Estudo/shared/js/ia/core/loader.js"
   *   raiz = "https://rafaelpg1.github.io/Site_Estudo"
   *
   * @returns {string}
   */
  function _detectarRaiz() {
    const scripts = document.querySelectorAll('script[src*="loader.js"]');
    if (scripts.length) {
      // Pega o último script com esse nome (mais seguro em caso de múltiplos)
      for (var i = scripts.length - 1; i >= 0; i--) {
        if (scripts[i].src.includes('/ia/core/loader.js')) {
          const url    = new URL(scripts[i].src);
          const partes = url.pathname.split('/').filter(Boolean);
          // Remove os 5 últimos: loader.js, core, ia, js, shared
          const raizPartes = partes.slice(0, partes.length - 5);
          return url.origin + (raizPartes.length ? '/' + raizPartes.join('/') : '');
        }
      }
    }
    return window.location.origin;
  }

  const _raizSite = _detectarRaiz();

  /* ══════════════════════════════════════════════════════════
     MONTAGEM DE PATH
  ══════════════════════════════════════════════════════════ */

  /**
   * Monta a URL absoluta do arquivo de conteúdo a partir do contexto.
   *
   * ctx.fonte    — subpasta em content/ (ex: 'resumo', 'quiz').
   *                Padrão: 'resumo'.
   * ctx.prefixo  — prefixo do arquivo (ex: 'res_', 'ques_').
   *                Padrão: 'res_'.
   *
   * Formatos suportados:
   *   Com AP:  <raiz>/content/{fonte}/{ano}/{periodo}/{ap}/{prefixo}{arquivo}.js
   *   Sem AP:  <raiz>/content/{fonte}/{ano}/{periodo}/{prefixo}{arquivo}.js
   *
   * @param {{ fonte?: string, prefixo?: string, ano: string, periodo: string, ap: string|null, arquivo: string }} ctx
   * @returns {string}
   */
  function _montarPath(ctx) {
    var fonte   = ctx.fonte   || 'resumo';
    var prefixo = ctx.prefixo || 'res_';
    var base    = _raizSite + '/content/' + fonte + '/' + ctx.ano + '/' + ctx.periodo;
    if (ctx.ap) {
      return base + '/' + ctx.ap + '/' + prefixo + ctx.arquivo + '.js';
    }
    return base + '/' + prefixo + ctx.arquivo + '.js';
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
   * @param {string} varGlobal — nome da variável global que o script define
   * @returns {Promise<object|null>} conteúdo ou null em caso de falha
   */
  function _injetarScript(path, varGlobal) {
    return new Promise(function (resolve) {
      const anterior = document.getElementById('nexus-conteudo-script');
      if (anterior) anterior.remove();

      window.__nexusConteudo = undefined;

      const s = document.createElement('script');
      s.id  = 'nexus-conteudo-script';
      s.src = path;

      s.onload = function () {
        const conteudo = window[varGlobal];
        if (conteudo) {
          resolve(conteudo);
        } else {
          console.warn('[NexusLoader] script carregado mas "' + varGlobal + '" não definido:', path);
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
   * Carrega o arquivo de conteúdo correspondente ao contexto.
   *
   * ctx.varGlobal — nome da variável global que o script define.
   *   'resumo' define window.__nexusConteudo  → varGlobal: '__nexusConteudo'
   *   'quiz'   define window.questoes         → varGlobal: 'questoes'
   *   Padrão: '__nexusConteudo'.
   *
   * Cache: se o path resultante for idêntico ao último carregado
   * com sucesso E a variável global ainda existir, retorna
   * o conteúdo em memória sem nova injeção de script.
   *
   * @param {{ fonte?: string, prefixo?: string, varGlobal?: string, ano: string, periodo: string, ap: string|null, arquivo: string }} ctx
   * @returns {Promise<object|null>} conteúdo ou null
   */
  async function carregar(ctx) {
    if (!ctx || !ctx.arquivo) {
      console.warn('[NexusLoader] carregar: contexto inválido.', ctx);
      return null;
    }

    const varGlobal = ctx.varGlobal || '__nexusConteudo';
    const path = _montarPath(ctx);

    // Cache hit: mesmo arquivo já carregado e conteúdo ainda na memória
    if (_pathCarregado === path && window[varGlobal]) {
      console.log('[NexusLoader] cache hit:', path);
      return window[varGlobal];
    }

    console.log('[NexusLoader] carregando:', path);
    const conteudo = await _injetarScript(path, varGlobal);

    if (conteudo) {
      _pathCarregado = path;
      console.log('[NexusLoader] carregado com sucesso:', path);
    } else {
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
   * Útil para diagnóstico e para o assistant verificar mudanças de contexto.
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