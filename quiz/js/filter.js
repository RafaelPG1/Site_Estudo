/* ============================================================
   NEXUS STUDY — quiz/js/filter.js  v2.3

   Sistema de filtro de aulas — única fonte de verdade.

   MÓDULOS INTERNOS:
     FilterStore  — estado, persistência, eventos
     FilterPanel  — overlay, painel, checkboxes, ações

   API PÚBLICA: window.NexusFilter
     .open()               — abre o painel de filtro
     .close()              — fecha o painel de filtro
     .hasFilter()          — true se existe filtro ativo
     .getSelectedLessons() — Set de aulas selecionadas ou null
     .clear()              — remove o filtro (todas as aulas)
     .contarAulas()        — nº de aulas distintas do modo atual
                             (requer window.questoes carregado)
     .atualizarVisibilidade() — esconde/mostra o botão de filtro da
                             nav conforme haja 2+ aulas
     .store                — acesso direto ao FilterStore

   v2.3 — QUIZ COM UMA ÚNICA AULA:
     Filtrar não faz sentido com 0 ou 1 aula. Quando o conteúdo
     carrega e há menos de 2 aulas, o botão de filtro da nav (e o
     divisor que o precede) é escondido via a classe
     html.nexus-sem-filtro. O modal inicial usa contarAulas() para
     decidir se mostra as duas opções ou apenas "Iniciar quiz".

   COMUNICAÇÃO COM O ENGINE:
     FilterStore nunca chama funções do Engine diretamente.
     Ao alterar o estado, apenas dispara:
       window.dispatchEvent(new CustomEvent('nexus:filtroAlterado'))
     O Engine escuta este evento e decide como reagir.

   ORDEM DE CARREGAMENTO (garantida pelo template.html):
     filter.js → quiz_starter_modal.js → quiz_engine.js
     Nenhum script posterior precisa aguardar filter.js.

   ────────────────────────────────────────────────────────────
   v2.2 — CORREÇÃO DA CAUSA RAIZ: botão da nav completamente
   inativo (clique não produzia nenhuma ação, nenhum erro).

   CAUSA:
     filter.js é carregado com `defer`. Quando um script defer
     executa, o parsing do HTML já terminou e
     document.readyState já é "interactive" (nunca "loading")
     — então _boot() sempre rodava de forma SÍNCRONA e IMEDIATA,
     sem esperar DOMContentLoaded.

     #btn-filtro-aulas NÃO existe no HTML estático: é criado
     dinamicamente por _injetarNavFloat(), dentro do listener de
     DOMContentLoaded de template_init.js — que só roda DEPOIS
     que todos os scripts defer (inclusive filter.js) terminam
     de executar.

     Resultado: no momento de _vincularBotaoNav(),
     document.getElementById('btn-filtro-aulas') retornava null.
     Por causa do `if (btn)`, nada era anexado — sem erro, sem
     log — e o botão real (criado depois) nunca recebia listener.

   CORREÇÃO:
     Delegação de evento em `document`. O alvo é resolvido
     somente no momento do clique, quando o botão certamente já
     existe — independente da ordem de término entre os scripts
     defer e o DOMContentLoaded de template_init.js.

   v2.1 — Filtro incremental no painel + ação "Remover filtro"
   guardada contra perda de progresso (ver FilterPanel abaixo).
   FilterStore e nexus:filtroAlterado permanecem inalterados.
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     UTILITÁRIOS INTERNOS
  ══════════════════════════════════════════════════════════ */

  function _uid() {
    var S = window.NexusStorage;
    if (!S) return 'guest';
    var u = S.get('usuario', null);
    return (u && u.uid) ? u.uid : 'guest';
  }

  function _storageKey() {
    var disc = window.__NEXUS_QUIZ_DISC__     || '';
    var modo = window.__NEXUS_QUIZ_MODO__     || '';
    var sem  = window.__NEXUS_QUIZ_SEMESTRE__ || '';
    return 'quiz_filter_' + _uid() + '_' + disc + '_' + modo + '_' + sem;
  }

  function _storage() { return window.NexusStorage || null; }

  /* Detecta se já existem respostas para a tentativa atual.
     Lê o mesmo progresso que o engine grava via
     _Storage.saveProgress() (quiz_engine.js → selectOption()).
     Não depende de nenhuma variável interna do engine — mesma
     técnica usada em quiz_starter_modal.js::_temProgresso(). */
  function _temRespostasAtuais() {
    var S = _storage();
    if (!S || typeof S.loadProgress !== 'function') return false;

    var disc = window.__NEXUS_QUIZ_DISC__     || '';
    var modo = window.__NEXUS_QUIZ_MODO__     || '';
    var sem  = window.__NEXUS_QUIZ_SEMESTRE__ || '';
    if (!disc || !modo || !sem) return false;

    var discUid = _uid() + '_' + disc;
    var salvo;
    try {
      salvo = S.loadProgress(discUid, modo, sem);
    } catch (e) {
      return false;
    }

    if (!salvo || !salvo.respostas) return false;
    return Object.keys(salvo.respostas).length > 0;
  }

  /* ══════════════════════════════════════════════════════════
     EXTRAÇÃO DE AULAS
     Lê window.questoes e retorna lista ordenada de aulas.
     Chamada pelo FilterPanel ao abrir — window.questoes
     garantidamente carregado nesse momento.
  ══════════════════════════════════════════════════════════ */

  function _extrairAulas() {
    var modo = window.__NEXUS_QUIZ_MODO__ || 'questoes';
    var q    = window.questoes || {};
    var lista;

    if (Array.isArray(q))            { lista = q; }
    else if (modo === 'ava')         { lista = q.ava      || []; }
    else if (modo === 'enade')       { lista = q.enade    || []; }
    else if (modo === 'fixacao')     { lista = q.fixacao  || []; }
    else                             { lista = q.questoes || []; }

    var vistas = {};
    var aulas  = [];
    for (var i = 0; i < lista.length; i++) {
      var a = lista[i].aula;
      if (a !== undefined && a !== null && !vistas[a]) {
        vistas[a] = true;
        aulas.push(a);
      }
    }
    return aulas;
  }

  /* ══════════════════════════════════════════════════════════
     FILTERSTORE
     Estado, persistência e eventos.
     Não tem DOM. Não conhece o Engine.
     (inalterado em relação à versão anterior)
  ══════════════════════════════════════════════════════════ */

  var FilterStore = (function () {

    /* null = sem filtro (todas as aulas) | Set = aulas selecionadas */
    var _selected = null;

    /* ── Persistência ─────────────────────────────────────── */

    function _save() {
      var S = _storage();
      if (!S) return;
      if (_selected === null) {
        S.remove(_storageKey());
      } else {
        S.set(_storageKey(), Array.from(_selected));
      }
    }

    function load() {
      var S = _storage();
      if (!S) { _selected = null; return; }
      var raw = S.get(_storageKey(), null);
      _selected = (raw && Array.isArray(raw) && raw.length > 0)
        ? new Set(raw)
        : null;
    }

    /* ── Getters ──────────────────────────────────────────── */

    function getSelectedLessons() { return _selected; }
    function hasFilter()          { return _selected !== null; }
    function count()              { return _selected ? _selected.size : 0; }

    /* ── Mutação ──────────────────────────────────────────── */

    function set(aulaSet, allAulas) {
      /* Selecionar todas = sem filtro */
      if (allAulas && aulaSet && aulaSet.size >= allAulas.length) {
        var todas = true;
        for (var i = 0; i < allAulas.length; i++) {
          if (!aulaSet.has(allAulas[i])) { todas = false; break; }
        }
        if (todas) { clear(); return; }
      }
      if (!aulaSet || aulaSet.size === 0) { clear(); return; }

      _selected = new Set(aulaSet);
      _save();
      _dispatch();
    }

    function clear() {
      _selected = null;
      var S = _storage();
      if (S) S.remove(_storageKey());
      _dispatch();
    }

    /* ── Evento ───────────────────────────────────────────── */

    function _dispatch() {
      try {
        window.dispatchEvent(new CustomEvent('nexus:filtroAlterado'));
      } catch (e) {
        console.warn('[filter] falha ao disparar nexus:filtroAlterado', e);
      }
    }

    return { load, getSelectedLessons, hasFilter, count, set, clear };

  })();

  /* ══════════════════════════════════════════════════════════
     BADGE DO BOTÃO NAV
  ══════════════════════════════════════════════════════════ */

  function _atualizarBadge() {
    var btn = document.getElementById('btn-filtro-aulas');
    if (!btn) return;

    var old = btn.querySelector('.filtro-badge');
    if (old) old.remove();

    if (FilterStore.hasFilter()) {
      btn.classList.add('filtro-ativo');
      var badge = document.createElement('span');
      badge.className   = 'filtro-badge';
      badge.textContent = FilterStore.count();
      btn.appendChild(badge);
    } else {
      btn.classList.remove('filtro-ativo');
    }
  }

  /* ══════════════════════════════════════════════════════════
     FILTERPANEL
     Overlay, painel, lista, checkboxes, contador, ações.
     Reutiliza CSS existente (.filtro-overlay, .filtro-painel, etc.)
  ══════════════════════════════════════════════════════════ */

  var FilterPanel = (function () {

    var _overlay    = null;
    var _painel     = null;
    var _listaEl    = null;
    var _contEl     = null;
    var _avisoEl    = null;
    var _btnRemover = null;
    var _marcados   = new Set();
    var _allAulas   = [];
    var _built      = false;

    var _MSG_BLOQUEIO_REMOCAO =
      'Não é possível remover o filtro agora: você já respondeu questões ' +
      'nesta tentativa. Finalize, revele as respostas ou reinicie o quiz ' +
      'para poder remover o filtro sem perder o progresso.';

    function _el(tag, cls) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      return e;
    }

    /* ── Aviso inline (bloqueios) ──────────────────────────── */

    function _mostrarAviso(msg) {
      if (!_avisoEl) return;
      _avisoEl.innerHTML =
        '<i class="fas fa-triangle-exclamation" aria-hidden="true"></i> ' + msg;
      _avisoEl.style.display = 'flex';
    }

    function _esconderAviso() {
      if (!_avisoEl) return;
      _avisoEl.style.display = 'none';
    }

    /* ── Construção única do DOM ──────────────────────────── */

    function _build() {
      if (_built) return;
      _built = true;

      _overlay = _el('div', 'filtro-overlay');
      _overlay.addEventListener('click', close);
      document.body.appendChild(_overlay);

      _painel = _el('div', 'filtro-painel');
      _painel.setAttribute('role', 'dialog');
      _painel.setAttribute('aria-modal', 'true');
      _painel.setAttribute('aria-label', 'Filtrar aulas');

      /* Header */
      var header    = _el('div', 'filtro-header');
      var eyebrow   = _el('div', 'filtro-eyebrow');
      eyebrow.innerHTML = '<i class="fas fa-filter" aria-hidden="true"></i> Filtrar aulas';
      var titulo    = _el('h2', 'filtro-titulo');
      titulo.textContent = 'Selecionar aulas';
      var subtitulo = _el('p', 'filtro-subtitulo');
      subtitulo.textContent = 'Escolha as aulas que deseja estudar.';
      var closeBtn  = _el('button', 'filtro-close');
      closeBtn.type = 'button';
      closeBtn.setAttribute('aria-label', 'Fechar filtro');
      closeBtn.textContent = '×';
      closeBtn.addEventListener('click', close);
      header.appendChild(eyebrow);
      header.appendChild(titulo);
      header.appendChild(subtitulo);
      header.appendChild(closeBtn);
      _painel.appendChild(header);

      /* Body */
      var body  = _el('div', 'filtro-body');
      var acoes = _el('div', 'filtro-acoes');

      var btnTodas = _el('button', 'filtro-acao-btn');
      btnTodas.type = 'button';
      btnTodas.textContent = 'Todas';
      btnTodas.addEventListener('click', function () {
        _allAulas.forEach(function (a) { _marcados.add(a); });
        _renderLista();
        _atualizarContador();
        _esconderAviso();
      });

      var btnNenhuma = _el('button', 'filtro-acao-btn');
      btnNenhuma.type = 'button';
      btnNenhuma.textContent = 'Nenhuma';
      btnNenhuma.addEventListener('click', function () {
        _marcados.clear();
        _renderLista();
        _atualizarContador();
        _esconderAviso();
      });

      acoes.appendChild(btnTodas);
      acoes.appendChild(btnNenhuma);
      body.appendChild(acoes);

      _listaEl = _el('ul', 'filtro-lista');
      _listaEl.setAttribute('role', 'list');
      body.appendChild(_listaEl);
      _painel.appendChild(body);

      /* Footer */
      var footer = _el('div', 'filtro-footer');
      footer.style.cssText = 'display:flex;flex-direction:column;gap:0.55rem;width:100%;';

      _avisoEl = _el('div', 'filtro-aviso');
      _avisoEl.setAttribute('role', 'alert');
      _avisoEl.style.cssText =
        'display:none;align-items:flex-start;gap:0.4rem;' +
        'width:100%;font-size:0.72rem;line-height:1.4;' +
        'color:#fca5a5;background:rgba(248,113,113,0.08);' +
        'border:1px solid rgba(248,113,113,0.22);border-radius:8px;' +
        'padding:0.5rem 0.7rem;box-sizing:border-box;';
      footer.appendChild(_avisoEl);

      var footerRow = _el('div', 'filtro-footer-row');
      footerRow.style.cssText =
        'display:flex;align-items:center;gap:0.6rem;width:100%;flex-wrap:wrap;';

      _contEl = _el('span', 'filtro-contador');
      footerRow.appendChild(_contEl);

      var spacer = _el('span');
      spacer.style.cssText = 'flex:1;';
      footerRow.appendChild(spacer);

      _btnRemover = _el('button', 'filtro-acao-btn');
      _btnRemover.type = 'button';
      _btnRemover.innerHTML =
        '<i class="fas fa-xmark" aria-hidden="true"></i> Remover filtro';
      _btnRemover.addEventListener('click', _removerFiltro);
      footerRow.appendChild(_btnRemover);

      var btnAplicar = _el('button', 'filtro-aplicar');
      btnAplicar.type = 'button';
      btnAplicar.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
        ' stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<polyline points="20 6 9 17 4 12"/></svg> Aplicar';
      btnAplicar.addEventListener('click', _aplicar);
      footerRow.appendChild(btnAplicar);

      footer.appendChild(footerRow);
      _painel.appendChild(footer);
      document.body.appendChild(_painel);
    }

    /* ── Renderizar lista ─────────────────────────────────── */

    function _renderLista() {
      _listaEl.innerHTML = '';
      _allAulas.forEach(function (aula) {
        var item = _el('li', 'filtro-item' + (_marcados.has(aula) ? ' filtro-marcado' : ''));
        item.setAttribute('role', 'listitem');
        item.setAttribute('tabindex', '0');
        item.dataset.aula = aula;

        var chkBox  = _el('div', 'filtro-chk-box');
        var chkIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        chkIcon.setAttribute('class', 'filtro-chk-icon');
        chkIcon.setAttribute('viewBox', '0 0 24 24');
        var poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        poly.setAttribute('points', '20 6 9 17 4 12');
        chkIcon.appendChild(poly);
        chkBox.appendChild(chkIcon);

        var txt = _el('span', 'filtro-aula-txt');
        txt.textContent = aula;

        function _toggle() {
          if (_marcados.has(aula)) { _marcados.delete(aula); item.classList.remove('filtro-marcado'); }
          else                     { _marcados.add(aula);    item.classList.add('filtro-marcado'); }
          _atualizarContador();
          _esconderAviso();
        }

        item.appendChild(chkBox);
        item.appendChild(txt);
        item.addEventListener('click', _toggle);
        item.addEventListener('keydown', function (e) {
          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); _toggle(); }
        });

        _listaEl.appendChild(item);
      });
    }

    function _atualizarContador() {
      if (!_contEl) return;
      _contEl.innerHTML = '<strong>' + _marcados.size + '</strong> de ' + _allAulas.length + ' aulas selecionadas';
    }

    /* ── Estado do botão "Remover filtro" ─────────────────── */

    function _atualizarBotaoRemover() {
      if (!_btnRemover) return;

      var ativo = FilterStore.hasFilter();
      _btnRemover.style.display = ativo ? '' : 'none';
      if (!ativo) return;

      var bloqueado = _temRespostasAtuais();
      _btnRemover.disabled      = bloqueado;
      _btnRemover.title         = bloqueado
        ? _MSG_BLOQUEIO_REMOCAO
        : 'Remove o filtro e volta a mostrar todas as aulas';
      _btnRemover.style.opacity = bloqueado ? '0.5'        : '';
      _btnRemover.style.cursor  = bloqueado ? 'not-allowed' : '';
    }

    /* ── Helpers de comparação de seleção ─────────────────── */

    function _representaTodas(marcadosSet) {
      if (marcadosSet.size < _allAulas.length) return false;
      for (var i = 0; i < _allAulas.length; i++) {
        if (!marcadosSet.has(_allAulas[i])) return false;
      }
      return true;
    }

    /* true se aplicar agora não mudaria nada no FilterStore */
    function _semMudanca() {
      var atual      = FilterStore.getSelectedLessons(); /* Set | null */
      var novasTodas = _representaTodas(_marcados);

      if (atual === null) return novasTodas;
      if (novasTodas)     return false;
      if (atual.size !== _marcados.size) return false;

      var igual = true;
      atual.forEach(function (a) { if (!_marcados.has(a)) igual = false; });
      return igual;
    }

    /* ── Ações ─────────────────────────────────────────────── */

    function _removerFiltro() {
      _esconderAviso();

      if (!FilterStore.hasFilter()) return;

      if (_temRespostasAtuais()) {
        _mostrarAviso(_MSG_BLOQUEIO_REMOCAO);
        _atualizarBotaoRemover();
        return;
      }

      FilterStore.clear();
      close();
    }

    function _aplicar() {
      _esconderAviso();

      /* Nada mudou de fato — fecha sem disparar nexus:filtroAlterado,
         evitando um reset desnecessário do progresso. */
      if (_semMudanca()) { close(); return; }

      var novasTodas      = _representaTodas(_marcados);
      var removeriaFiltro = FilterStore.hasFilter() && novasTodas;

      /* "Aplicar" com tudo marcado, partindo de um filtro ativo,
         equivale a remover o filtro — mesma trava de progresso. */
      if (removeriaFiltro && _temRespostasAtuais()) {
        _mostrarAviso(_MSG_BLOQUEIO_REMOCAO);
        return;
      }

      FilterStore.set(new Set(_marcados), _allAulas);
      close();
    }

    /* ── API pública do painel ────────────────────────────── */

    function open() {
      _allAulas = _extrairAulas();
      if (_allAulas.length === 0) {
        console.warn('[Filtro] nenhuma aula encontrada em window.questoes — painel não aberto');
        return;
      }

      _build();
      _esconderAviso();

      var stored = FilterStore.getSelectedLessons();
      _marcados  = stored ? new Set(stored) : new Set(_allAulas);

      _renderLista();
      _atualizarContador();
      _atualizarBotaoRemover();

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          _overlay.classList.add('filtro-show');
          _painel.classList.add('filtro-show');
        });
      });

      console.log('[Filtro] painel criado/exibido —', _allAulas.length, 'aulas');
    }

    function close() {
      if (!_overlay || !_painel) return;
      _overlay.classList.remove('filtro-show');
      _painel.classList.remove('filtro-show');
      _esconderAviso();
    }

    return { open: open, close: close };

  })();

  /* ══════════════════════════════════════════════════════════
     BADGE — atualiza ao receber nexus:filtroAlterado
  ══════════════════════════════════════════════════════════ */

  window.addEventListener('nexus:filtroAlterado', _atualizarBadge);

  /* ══════════════════════════════════════════════════════════
     VISIBILIDADE DO BOTÃO DE FILTRO (v2.3)
     Só existe o que filtrar se houver 2+ aulas. Usa uma classe
     em <html> + CSS, em vez de mexer no botão diretamente,
     porque o botão é criado depois por template_init.js —
     a classe vale independentemente da ordem de criação.
     O divisor que precede o botão é escondido junto (:has),
     para não sobrarem dois divisores seguidos na nav.
  ══════════════════════════════════════════════════════════ */

  function _contarAulas() {
    return _extrairAulas().length;
  }

  function _injetarCssVisibilidade() {
    if (document.getElementById('nexus-filter-vis-css')) return;
    var st = document.createElement('style');
    st.id = 'nexus-filter-vis-css';
    st.textContent =
      'html.nexus-sem-filtro #btn-filtro-aulas,' +
      'html.nexus-sem-filtro .nav-divider:has(+ #btn-filtro-aulas)' +
      '{display:none!important;}';
    document.head.appendChild(st);
  }

  /* Chamar somente com window.questoes já carregado — antes disso
     a contagem seria 0 e o botão sumiria indevidamente. */
  function _atualizarVisibilidadeBotao() {
    _injetarCssVisibilidade();
    document.documentElement.classList.toggle('nexus-sem-filtro', _contarAulas() < 2);
  }

  /* ══════════════════════════════════════════════════════════
     BOTÃO DA NAV

     Ver bloco de comentário no topo do arquivo (v2.2) para a
     causa raiz completa. Resumo: o botão é criado dinamicamente
     DEPOIS que este script pode já ter executado seu boot — por
     isso o registro do listener usa delegação em `document`,
     que resolve o alvo apenas no momento do clique.
  ══════════════════════════════════════════════════════════ */

  var _navListenerRegistrado = false;

  function _vincularBotaoNav() {
    if (_navListenerRegistrado) return;
    _navListenerRegistrado = true;

    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('#btn-filtro-aulas') : null;
      if (!btn) return;

      console.log('[Filtro] clique recebido em #btn-filtro-aulas');
      console.log('[Filtro] FilterPanel.open chamado');
      FilterPanel.open();
    });

    console.log('[Filtro] listener de clique (delegado em document) registrado');
  }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA — window.NexusFilter
  ══════════════════════════════════════════════════════════ */

  window.NexusFilter = {
    /* Painel */
    open:  function () { FilterPanel.open(); },
    close: function () { FilterPanel.close(); },

    /* Estado */
    hasFilter:          function () { return FilterStore.hasFilter(); },
    getSelectedLessons: function () { return FilterStore.getSelectedLessons(); },
    clear:              function () { FilterStore.clear(); },

    /* Aulas (v2.3) */
    contarAulas:           _contarAulas,
    atualizarVisibilidade: _atualizarVisibilidadeBotao,

  };

  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  function _boot() {
    FilterStore.load();
    _atualizarBadge();
    _vincularBotaoNav();

    /* Esconde o botão de filtro se o quiz tiver menos de 2 aulas.
       __nexusPreCarregarConteudo é idempotente (devolve a mesma
       promise que o modal/engine usam) e só resolve com
       window.questoes disponível. */
    if (typeof window.__nexusPreCarregarConteudo === 'function') {
      try {
        window.__nexusPreCarregarConteudo().then(_atualizarVisibilidadeBotao);
      } catch (e) {}
    }

    console.log('[filter] pronto — filtro ativo:', FilterStore.hasFilter(),
                '| aulas:', FilterStore.count());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _boot);
  } else {
    _boot();
  }

})();