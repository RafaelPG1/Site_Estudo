/* ============================================================
   NEXUS STUDY — quiz/js/filter.js  v2.0

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
     .store                — acesso direto ao FilterStore

   COMUNICAÇÃO COM O ENGINE:
     FilterStore nunca chama funções do Engine diretamente.
     Ao alterar o estado, apenas dispara:
       window.dispatchEvent(new CustomEvent('nexus:filtroAlterado'))
     O Engine escuta este evento e decide como reagir.

   ORDEM DE CARREGAMENTO (garantida pelo template.html):
     filter.js → quiz_starter_modal.js → quiz_engine.js
     Nenhum script posterior precisa aguardar filter.js.
   ============================================================ */

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

    var _overlay  = null;
    var _painel   = null;
    var _listaEl  = null;
    var _contEl   = null;
    var _marcados = new Set();
    var _allAulas = [];
    var _built    = false;

    function _el(tag, cls) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      return e;
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
      });

      var btnNenhuma = _el('button', 'filtro-acao-btn');
      btnNenhuma.type = 'button';
      btnNenhuma.textContent = 'Nenhuma';
      btnNenhuma.addEventListener('click', function () {
        _marcados.clear();
        _renderLista();
        _atualizarContador();
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
      _contEl = _el('span', 'filtro-contador');
      footer.appendChild(_contEl);

      var btnAplicar = _el('button', 'filtro-aplicar');
      btnAplicar.type = 'button';
      btnAplicar.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
        ' stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<polyline points="20 6 9 17 4 12"/></svg> Aplicar';
      btnAplicar.addEventListener('click', _aplicar);

      footer.appendChild(btnAplicar);
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

    function _aplicar() {
      FilterStore.set(new Set(_marcados), _allAulas);
      close();
    }

    /* ── API pública do painel ────────────────────────────── */

    function open() {
      _allAulas = _extrairAulas();
      if (_allAulas.length === 0) return;

      _build();

      var stored = FilterStore.getSelectedLessons();
      _marcados  = stored ? new Set(stored) : new Set(_allAulas);

      _renderLista();
      _atualizarContador();

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          _overlay.classList.add('filtro-show');
          _painel.classList.add('filtro-show');
        });
      });
    }

    function close() {
      if (!_overlay || !_painel) return;
      _overlay.classList.remove('filtro-show');
      _painel.classList.remove('filtro-show');
    }

    return { open: open, close: close };

  })();

  /* ══════════════════════════════════════════════════════════
     BADGE — atualiza ao receber nexus:filtroAlterado
  ══════════════════════════════════════════════════════════ */

  window.addEventListener('nexus:filtroAlterado', _atualizarBadge);

  /* ══════════════════════════════════════════════════════════
     BOTÃO DA NAV
  ══════════════════════════════════════════════════════════ */

  function _vincularBotaoNav() {
    var btn = document.getElementById('btn-filtro-aulas');
    if (btn) btn.addEventListener('click', FilterPanel.open);
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

  };

  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  function _boot() {
    FilterStore.load();
    _atualizarBadge();
    _vincularBotaoNav();
    console.log('[filter] pronto — filtro ativo:', FilterStore.hasFilter(),
                '| aulas:', FilterStore.count());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _boot);
  } else {
    _boot();
  }

})();