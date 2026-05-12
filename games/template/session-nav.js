/* ═══════════════════════════════════════════════════════════════════════════
   NEXUS STUDY — games/template/session-nav.js  (v1.1)

   CORREÇÕES v1.1 em relação à v1.0
   ──────────────────────────────────
   1. Cache de pegarRestauravel() — variável `_restauravelCache` inicializada
      como null era testada com `!== undefined`, tornando o cache ineficaz.
      CORRIGIDO: flag booleano `_restauravelChecado` separado do valor.

   2. _eraReload() consumia o sessionStorage flag na 1ª chamada, quebrando
      leitura posterior do mesmo flag por lerSessao().
      CORRIGIDO: _lerReloadFlag() apenas lê; _consumirReloadFlag() remove.
      A remoção ocorre uma única vez em pronto(), após toda a lógica de
      restauração ter executado.

   3. beforeunload sempre setava _STAY_KEY='1', inclusive em saídas
      intencionais (ex: botão Voltar para jogo.html), impedindo a detecção
      de "entrada nova" na próxima visita.
      CORRIGIDO: método sairParaRota() marca intenção de saída real;
      beforeunload respeita essa flag e não seta o stay-key.

   4. Anti-flash era injetado tarde (dentro de init() async, após awaits).
      CORRIGIDO: SessionNav.prepararAntiFlash() exposto como API pública
      para chamada síncrona no <head>; SessionNav.criar() também injeta
      de forma síncrona (idempotente).

   5. limpar() não resetava o cache de pegarRestauravel(), causando retorno
      de null stale após uma nova sessão ser iniciada.
      CORRIGIDO: limpar() reseta _restauravelChecado e _restauravelCache.

   FORMATO DE SESSÃO (localStorage)
   ──────────────────────────────────
   Chave: nexus_vf_sessao_{uid}_{discId}_{sem}
   {
     v:           2,
     perguntas:   [...],
     respostas:   [{v: true|false|null|'__p__'}],
     tempos:      [...],
     indice:      N,
     pontos:      N,
     acertos:     N,
     erros:       N,
     modoRevisao: bool,
     timestamp:   ms,
     pathname:    '/caminho/vdd_falso.html',
   }

   CONTRATO DE USO
   ────────────────
   // 0. Anti-flash antes de qualquer render (script inline no <head>):
   //    <script type="module">
   //      import { SessionNav } from '.../session-nav.js';
   //      SessionNav.prepararAntiFlash();
   //    </script>

   // 1. Criar instância (SessionNav.criar() também injeta anti-flash):
   const nav = SessionNav.criar({ uid, discId, sem, ttlMs: 24*60*60*1000 });

   // 2. Verificar restauração (reload-flag ainda NÃO consumido aqui):
   const sessao = nav.pegarRestauravel();
   if (sessao) {
     continuarSessao(sessao);    // vai direto para a questão certa
   } else {
     const salva = nav.lerSessao();
     if (salva?.perguntas?.length) _configurarBtnContinuar(salva);
     mostrarTela('intro');
   }

   // 3. Após decidir a tela — remove anti-flash E consome reload-flag:
   nav.pronto();

   // 4. Salvar ao longo do jogo:
   nav.salvar(estado);
   nav.salvarThrottled(estado);   // throttled para uso em onTick

   // 5. Saída para OUTRA ROTA/HTML (ex: botão "Voltar" do header):
   //    Sempre chamar os dois juntos — ordem importa.
   nav.sairParaRota(); // beforeunload NÃO setará stay-flag → próxima visita = entrada nova
   nav.limpar();       // descarta sessão → retorno futuro abre tela inicial, não questões antigas

   // 6. Descarte sem sair do HTML (ex: "Começar" nova partida, após finalizarJogo):
   nav.limpar(); // só limpa localStorage; sairParaRota() não é necessário aqui

═══════════════════════════════════════════════════════════════════════════ */

/* ── Constantes ───────────────────────────────────────────────────────── */
const _STAY_KEY   = '_snav_stay';
const _SCHEMA_VER = 2;
const _STYLE_ID   = '_snav_antiflash';
const _SENTINEL   = '__p__';

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS PRIVADOS
═══════════════════════════════════════════════════════════════════════ */

function _injetarAntiFlash() {
  if (document.getElementById(_STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = _STYLE_ID;
  s.textContent = `
    #screen-intro,
    #screen-question,
    #screen-result,
    #screen-empty {
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;
  if (document.head) {
    document.head.insertBefore(s, document.head.firstChild);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.head.insertBefore(
        document.getElementById(_STYLE_ID) ? null : s,
        document.head.firstChild,
      );
    }, { once: true });
  }
}

function _removerAntiFlash() {
  document.getElementById(_STYLE_ID)?.remove();
}

/** Lê o reload-flag SEM consumi-lo. */
function _lerReloadFlag() {
  return sessionStorage.getItem(_STAY_KEY) === '1';
}

/** Remove o reload-flag. Chamado APENAS em pronto(). */
function _consumirReloadFlag() {
  sessionStorage.removeItem(_STAY_KEY);
}

function _serializarRespostas(respostas) {
  return respostas.map(r =>
    r === undefined ? { v: _SENTINEL } : { v: r },
  );
}

function _desserializarRespostas(arr) {
  return arr.map(r => {
    if (r && typeof r === 'object' && 'v' in r) {
      return r.v === _SENTINEL ? undefined : r.v;
    }
    // Compatibilidade v1
    if (r === '__undef__' || r === null) return undefined;
    return r;
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   CLASSE PRINCIPAL
═══════════════════════════════════════════════════════════════════════ */

class _SessionNav {
  /**
   * @param {object}  opts
   * @param {string}  opts.uid          - ID do usuário (ou 'visitante')
   * @param {string}  opts.discId       - ID da disciplina
   * @param {string}  opts.sem          - Semestre (ex: '2026.1')
   * @param {number}  [opts.ttlMs]      - TTL em ms (padrão: 24h)
   * @param {number}  [opts.throttleMs] - Throttle do salvarThrottled (padrão: 500ms)
   */
  constructor({ uid, discId, sem, ttlMs = 24 * 60 * 60 * 1000, throttleMs = 500 }) {
    this._chave            = `nexus_vf_sessao_${uid}_${discId}_${sem}`;
    this._pathname         = location.pathname;
    this._ttlMs            = ttlMs;
    this._throttleMs       = throttleMs;
    this._throttleId       = null;
    this._prontoFoi        = false;
    this._saidaRealMarcada = false;

    // Cache de pegarRestauravel()
    // _restauravelChecado: false = nunca consultado; true = já consultado
    this._restauravelChecado = false;
    this._restauravelCache   = null;

    /* ── Listeners de ciclo de vida ─────────────────────────────────── */

    // beforeunload: seta stay-flag SOMENTE se não for saída intencional
    this._handlerBeforeUnload = () => {
      if (!this._saidaRealMarcada) {
        sessionStorage.setItem(_STAY_KEY, '1');
      }
    };

    // pagehide: mais confiável em mobile
    this._handlerPageHide = (e) => {
      if (e.persisted) return; // entrou em bfcache
      if (!this._saidaRealMarcada) {
        sessionStorage.setItem(_STAY_KEY, '1');
      }
    };

    // popstate: botão Voltar do browser para outra rota → limpa sessão
    this._handlerPopState = () => {
      if (location.pathname !== this._pathname) {
        this.limpar();
      }
    };

    window.addEventListener('beforeunload', this._handlerBeforeUnload);
    window.addEventListener('pagehide',     this._handlerPageHide);
    window.addEventListener('popstate',     this._handlerPopState);
  }

  /* ── CHAVE ──────────────────────────────────────────────────────── */

  get chave() { return this._chave; }

  /* ── ANTI-FLASH / PRONTO ────────────────────────────────────────── */

  /**
   * Remove o anti-flash e consome o reload-flag.
   * Deve ser chamado APÓS mostrarTela() ter sido invocado com a tela correta.
   * Idempotente.
   */
  pronto() {
    if (this._prontoFoi) return;
    this._prontoFoi = true;

    // Consome o reload-flag após toda a lógica de restauração ter rodado
    _consumirReloadFlag();

    requestAnimationFrame(() => {
      requestAnimationFrame(_removerAntiFlash);
    });
  }

  /* ── SAÍDA CONSCIENTE ───────────────────────────────────────────── */

  /**
   * Marca que a próxima navegação é uma saída REAL para fora deste HTML
   * (ex: clicar no botão "Voltar" do header, que navega para jogo.html).
   *
   * Efeito: o beforeunload NÃO irá setar o stay-flag, garantindo que a
   * próxima vez que o usuário acessar esta página seja tratada como
   * entrada nova — sem restauração automática de sessão antiga.
   *
   * USE SEMPRE em conjunto com limpar():
   *   nav.sairParaRota();
   *   nav.limpar();
   *
   * Sem limpar(), a sessão permanece no localStorage mas não será
   * restaurada automaticamente (só aparecerá no botão "Continuar").
   */
  sairParaRota() {
    this._saidaRealMarcada = true;
  }

  /* ── SERIALIZAÇÃO ───────────────────────────────────────────────── */

  /**
   * Salva o estado completo da sessão no localStorage.
   * @param {object} estado  { perguntas, respostas, tempos, indice,
   *                           pontos, acertos, erros, modoRevisao,
   *                           tela }  ← 'question' | 'intro' | 'result'
   *
   * O campo `tela` controla se pegarRestauravel() vai restaurar
   * automaticamente no próximo reload:
   *   'question' → restaura direto na questão (sem passar pela intro)
   *   qualquer outro valor → não restaura automaticamente; o botão
   *   "Continuar" fica visível na intro para o usuário decidir
   */
  salvar(estado) {
    if (!estado?.perguntas?.length) return;
    try {
      const sessao = {
        v:           _SCHEMA_VER,
        perguntas:   estado.perguntas,
        respostas:   _serializarRespostas(estado.respostas),
        tempos:      [...(estado.tempos ?? [])],
        indice:      estado.indice      ?? 0,
        pontos:      estado.pontos      ?? 0,
        acertos:     estado.acertos     ?? 0,
        erros:       estado.erros       ?? 0,
        modoRevisao: estado.modoRevisao ?? false,
        tela:        estado.tela        ?? 'question',
        timestamp:   Date.now(),
        pathname:    this._pathname,
      };
      localStorage.setItem(this._chave, JSON.stringify(sessao));
    } catch (e) {
      console.warn('[session-nav] Erro ao salvar sessão:', e);
    }
  }

  /**
   * Versão throttled de salvar.
   * Garante no máximo 1 write a cada throttleMs milissegundos.
   */
  salvarThrottled(estado) {
    if (this._throttleId !== null) return;
    this._throttleId = setTimeout(() => {
      this._throttleId = null;
      this.salvar(estado);
    }, this._throttleMs);
  }

  /* ── LEITURA ────────────────────────────────────────────────────── */

  /**
   * Retorna a sessão restaurável se:
   *   • O acesso atual for um reload (stay-flag presente)
   *   • A sessão existir, não estiver expirada e pertencer a esta rota
   *   • A sessão foi salva com tela === 'question' (usuário estava respondendo)
   *   • Houver questões ainda sem resposta (sessão não concluída)
   *
   * Se o reload ocorreu na tela inicial (intro), retorna null — o botão
   * "Continuar" aparecerá na intro para o usuário decidir se quer retomar.
   *
   * Resultado cacheado — chamadas repetidas não releem o localStorage.
   * O stay-flag NÃO é consumido aqui; isso ocorre em pronto().
   */
  pegarRestauravel() {
    if (this._restauravelChecado) return this._restauravelCache;
    this._restauravelChecado = true;
    this._restauravelCache   = null;

    if (!_lerReloadFlag()) return null;

    const sessao = this._lerRaw();
    if (!sessao) return null;

    if (sessao.pathname && sessao.pathname !== this._pathname) return null;

    // Só restaura automaticamente se o usuário estava na tela de questões.
    // Se estava na intro (tela: 'intro' ou campo ausente em sessões legado
    // salvas antes deste campo existir), vai para a intro normalmente.
    if (sessao.tela !== 'question') return null;

    const pendentes = sessao.respostas.filter(r => r === undefined).length;
    if (pendentes === 0) return null;

    this._restauravelCache = sessao;
    return sessao;
  }

  /**
   * Lê e retorna a sessão do localStorage independente de ser reload.
   * Útil para o botão "Continuar" na tela de intro.
   */
  lerSessao() {
    return this._lerRaw();
  }

  _lerRaw() {
    try {
      const raw = localStorage.getItem(this._chave);
      if (!raw) return null;

      const sessao = JSON.parse(raw);

      if (Date.now() - (sessao.timestamp ?? 0) > this._ttlMs) {
        localStorage.removeItem(this._chave);
        return null;
      }

      sessao.respostas = _desserializarRespostas(sessao.respostas ?? []);
      return sessao;
    } catch {
      return null;
    }
  }

  /* ── LIMPEZA ────────────────────────────────────────────────────── */

  /**
   * Remove a sessão do localStorage e cancela qualquer throttle pendente.
   * Reseta o cache de pegarRestauravel() para que chamadas futuras
   * funcionem corretamente após uma nova sessão ser iniciada.
   */
  limpar() {
    clearTimeout(this._throttleId);
    this._throttleId         = null;
    // Reset de cache: permite que a próxima chamada a pegarRestauravel()
    // consulte o localStorage novamente (importante após iniciarJogo())
    this._restauravelChecado = false;
    this._restauravelCache   = null;
    try {
      localStorage.removeItem(this._chave);
    } catch { /* silencioso */ }
  }

  /**
   * Remove todos os event listeners e libera recursos.
   * Chame ao destruir o componente (ex: HMR, testes unitários).
   */
  destruir() {
    window.removeEventListener('beforeunload', this._handlerBeforeUnload);
    window.removeEventListener('pagehide',     this._handlerPageHide);
    window.removeEventListener('popstate',     this._handlerPopState);
    clearTimeout(this._throttleId);
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   FACTORY PÚBLICA
═══════════════════════════════════════════════════════════════════════ */

export const SessionNav = {
  /**
   * Injeta o anti-flash de forma síncrona.
   * Para uso em um <script type="module"> no <head> do HTML,
   * ANTES de qualquer CSS ou conteúdo que possa causar flash visual.
   *
   * O SessionNav.criar() também chama isso, mas se init() contiver awaits
   * antes de criar a instância, o browser pode já ter renderizado.
   * Nesse caso, chame prepararAntiFlash() manualmente no início do módulo.
   */
  prepararAntiFlash() {
    _injetarAntiFlash();
  },

  /**
   * Cria e retorna uma instância de _SessionNav.
   * Injeta o anti-flash sincronamente (idempotente).
   *
   * @param {object} opts - Mesmas opções de _SessionNav
   * @returns {_SessionNav}
   */
  criar(opts) {
    _injetarAntiFlash();
    return new _SessionNav(opts);
  },
};