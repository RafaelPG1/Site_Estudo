/* ============================================================
   NEXUS STUDY — quiz/js/filter.js  v1.0

   Sistema de filtro de aulas — única fonte de verdade.

   MÓDULOS INTERNOS:
     FilterStore  — estado, persistência, eventos
     FilterPanel  — overlay, painel, checkboxes, ações

   INTEGRAÇÃO:
     • Engine consulta FilterStore.getSelected() para montar questões
     • Alteração de filtro dispara 'nexus:filtroAlterado'
     • Engine escuta o evento e chama reiniciar() + remonta base
     • Modal (tela 2) usa FilterPanel diretamente via FilterPanel.open()

   ESTADO:
     null     → sem filtro (todas as aulas)
     Set(...) → aulas selecionadas

   BOOT:
     FilterStore.load() na inicialização restaura filtro persistido.
     Engine deve consultar FilterStore.getSelected() ANTES de montar
     questões — a primeira renderização já nasce correta.
   ============================================================ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     UTILITÁRIOS
  ══════════════════════════════════════════════════════════ */

  function _uid() {
    var S = window.NexusStorage;
    if (!S) return 'guest';
    var u = S.get('usuario', null);
    return (u && u.uid) ? u.uid : 'guest';
  }

  function _ctx() {
    return {
      uid:  _uid(),
      disc: window.__NEXUS_QUIZ_DISC__     || '',
      modo: window.__NEXUS_QUIZ_MODO__     || '',
      sem:  window.__NEXUS_QUIZ_SEMESTRE__ || '',
    };
  }

  function _storageKey() {
    var c = _ctx();
    return 'quiz_filter_' + c.uid + '_' + c.disc + '_' + c.modo + '_' + c.sem;
  }

  function _storage() { return window.NexusStorage || null; }

  /* ══════════════════════════════════════════════════════════
     FILTERSTORE
     Estado, persistência e comunicação por eventos.
     Sem DOM. Sem HTML. Sem CSS.
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
        var arr = Array.from(_selected);
        S.set(_storageKey(), arr);
      }
    }

    function load() {
      var S = _storage();
      if (!S) { _selected = null; return; }
      var raw = S.get(_storageKey(), null);
      if (!raw || !Array.isArray(raw) || raw.length === 0) {
        _selected = null;
      } else {
        _selected = new Set(raw);
      }
    }

    /* ── Getters ──────────────────────────────────────────── */

    function getSelected() {
      /* Retorna null (todas) ou Set de nomes de aula */
      return _selected;
    }

    function isActive() {
      return _selected !== null;
    }

    function count() {
      return _selected ? _selected.size : 0;
    }

    /* ── Mutação ──────────────────────────────────────────── */

    function set(aulaSet, allAulas) {
      /* Se o set recebido contiver todas as aulas conhecidas → clear */
      if (allAulas && aulaSet && aulaSet.size >= allAulas.length) {
        var todaNoSet = true;
        for (var i = 0; i < allAulas.length; i++) {
          if (!aulaSet.has(allAulas[i])) { todaNoSet = false; break; }
        }
        if (todaNoSet) { clear(); return; }
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
        window.dispatchEvent(new CustomEvent('nexus:filtroAlterado', {
          detail: { selected: _selected }
        }));
      } catch (e) {
        console.warn('[filter] falha ao disparar nexus:filtroAlterado', e);
      }
    }

    return { load, getSelected, isActive, count, set, clear };

  })();

  /* ══════════════════════════════════════════════════════════
     EXTRAÇÃO DE AULAS
     Lê window.questoes e extrai lista ordenada de aulas.
  ══════════════════════════════════════════════════════════ */

  function _extrairAulas() {
    var modo = window.__NEXUS_QUIZ_MODO__ || 'questoes';
    var q    = window.questoes || {};
    var lista;

    if (Array.isArray(q)) {
      lista = q;
    } else if (modo === 'ava')     { lista = q.ava      || []; }
    else if (modo === 'enade')     { lista = q.enade    || []; }
    else if (modo === 'fixacao')   { lista = q.fixacao  || []; }
    else                           { lista = q.questoes || []; }

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
     BADGE DO BOTÃO NAV
  ══════════════════════════════════════════════════════════ */

  function _atualizarBadge() {
    var btn = document.getElementById('btn-filtro-aulas');
    if (!btn) return;

    /* Remove badge anterior */
    var old = btn.querySelector('.filtro-badge');
    if (old) old.remove();

    if (FilterStore.isActive()) {
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
     Reutiliza o CSS existente (.filtro-overlay, .filtro-painel, etc.)
  ══════════════════════════════════════════════════════════ */

  var FilterPanel = (function () {

    var _overlay = null;
    var _painel  = null;
    var _lista   = null;
    var _contador= null;
    var _marcados= new Set();
    var _allAulas= [];
    var _built   = false;

    /* ── Utilitário: criar elemento ───────────────────────── */
    function _el(tag, cls) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      return e;
    }

    /* ── Construção única do DOM ──────────────────────────── */
    function _build() {
      if (_built) return;
      _built = true;

      /* Overlay */
      _overlay = _el('div', 'filtro-overlay');
      _overlay.addEventListener('click', close);
      document.body.appendChild(_overlay);

      /* Painel */
      _painel = _el('div', 'filtro-painel');
      _painel.setAttribute('role', 'dialog');
      _painel.setAttribute('aria-modal', 'true');
      _painel.setAttribute('aria-label', 'Filtrar aulas');

      /* Header */
      var header = _el('div', 'filtro-header');

      var eyebrow = _el('div', 'filtro-eyebrow');
      eyebrow.innerHTML = '<i class="fas fa-filter" aria-hidden="true"></i> Filtrar aulas';

      var titulo = _el('h2', 'filtro-titulo');
      titulo.textContent = 'Selecionar aulas';

      var subtitulo = _el('p', 'filtro-subtitulo');
      subtitulo.textContent = 'Escolha as aulas que deseja estudar.';

      var closeBtn = _el('button', 'filtro-close');
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
      var body = _el('div', 'filtro-body');

      /* Ações rápidas */
      var acoes = _el('div', 'filtro-acoes');

      var btnTodas = _el('button', 'filtro-acao-btn');
      btnTodas.type = 'button';
      btnTodas.textContent = 'Todas';
      btnTodas.addEventListener('click', function () { _marcarTodas(); _atualizarUI(); });

      var btnNenhuma = _el('button', 'filtro-acao-btn');
      btnNenhuma.type = 'button';
      btnNenhuma.textContent = 'Nenhuma';
      btnNenhuma.addEventListener('click', function () { _desmarcarTodas(); _atualizarUI(); });

      acoes.appendChild(btnTodas);
      acoes.appendChild(btnNenhuma);
      body.appendChild(acoes);

      /* Lista */
      _lista = _el('ul', 'filtro-lista');
      _lista.setAttribute('role', 'list');
      body.appendChild(_lista);

      _painel.appendChild(body);

      /* Footer */
      var footer = _el('div', 'filtro-footer');

      _contador = _el('span', 'filtro-contador');
      footer.appendChild(_contador);

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

    /* ── Renderizar lista de aulas ────────────────────────── */
    function _renderLista() {
      _lista.innerHTML = '';
      _allAulas.forEach(function (aula) {
        var item = _el('li', 'filtro-item' + (_marcados.has(aula) ? ' filtro-marcado' : ''));
        item.setAttribute('role', 'listitem');
        item.setAttribute('tabindex', '0');
        item.dataset.aula = aula;

        var chkBox = _el('div', 'filtro-chk-box');
        var chkIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        chkIcon.setAttribute('class', 'filtro-chk-icon');
        chkIcon.setAttribute('viewBox', '0 0 24 24');
        var poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        poly.setAttribute('points', '20 6 9 17 4 12');
        chkIcon.appendChild(poly);
        chkBox.appendChild(chkIcon);

        var txt = _el('span', 'filtro-aula-txt');
        txt.textContent = aula;

        item.appendChild(chkBox);
        item.appendChild(txt);

        function _toggle() {
          if (_marcados.has(aula)) { _marcados.delete(aula); item.classList.remove('filtro-marcado'); }
          else                     { _marcados.add(aula);    item.classList.add('filtro-marcado'); }
          _atualizarContador();
        }

        item.addEventListener('click', _toggle);
        item.addEventListener('keydown', function (e) {
          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); _toggle(); }
        });

        _lista.appendChild(item);
      });
    }

    function _marcarTodas()    { _allAulas.forEach(function (a) { _marcados.add(a); }); _renderLista(); }
    function _desmarcarTodas() { _marcados.clear(); _renderLista(); }

    function _atualizarContador() {
      if (!_contador) return;
      var n = _marcados.size;
      var t = _allAulas.length;
      _contador.innerHTML = '<strong>' + n + '</strong> de ' + t + ' aulas selecionadas';
    }

    function _atualizarUI() { _atualizarContador(); }

    /* ── Aplicar filtro ───────────────────────────────────── */
    function _aplicar() {
      FilterStore.set(new Set(_marcados), _allAulas);
      close();
      /* Badge atualiza via evento nexus:filtroAlterado */
    }

    /* ── Abrir painel ─────────────────────────────────────── */
    function open() {
      _allAulas = _extrairAulas();
      if (_allAulas.length === 0) return; /* sem aulas, sem painel */

      _build();

      /* Sincroniza _marcados com FilterStore */
      var stored = FilterStore.getSelected();
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

    /* ── Fechar painel ────────────────────────────────────── */
    function close() {
      if (!_overlay || !_painel) return;
      _overlay.classList.remove('filtro-show');
      _painel.classList.remove('filtro-show');
    }

    return { open, close };

  })();

  /* ══════════════════════════════════════════════════════════
     INTEGRAÇÃO COM O ENGINE
     Engine escuta nexus:filtroAlterado e reinicia sessão.
     Engine consulta FilterStore.getSelected() para filtrar base.
  ══════════════════════════════════════════════════════════ */

  window.addEventListener('nexus:filtroAlterado', function () {
    _atualizarBadge();

    /* Solicita ao Engine que reinicie com nova base */
    if (typeof window.__nexusFiltroReiniciar === 'function') {
      window.__nexusFiltroReiniciar();
    }
  });

  /* ══════════════════════════════════════════════════════════
     BOTÃO DA NAV
  ══════════════════════════════════════════════════════════ */

  function _vincularBotaoNav() {
    var btn = document.getElementById('btn-filtro-aulas');
    if (!btn) return;
    btn.addEventListener('click', function () { FilterPanel.open(); });
  }

  /* ══════════════════════════════════════════════════════════
     INTEGRAÇÃO COM QUIZ_STARTER_MODAL
     A tela 2 do modal usa FilterPanel.open() ao clicar
     "Filtrar aulas". O modal chama window.__nexusFiltroAbrir.
  ══════════════════════════════════════════════════════════ */

  window.__nexusFiltroAbrir = function () { FilterPanel.open(); };

  /* ══════════════════════════════════════════════════════════
     EXPOSIÇÃO GLOBAL
  ══════════════════════════════════════════════════════════ */

  window.NexusFilter = {
    store:  FilterStore,
    panel:  FilterPanel,
    aulas:  _extrairAulas,
  };

  /* ══════════════════════════════════════════════════════════
     BOOT
     1. Restaura filtro persistido
     2. Atualiza badge
     3. Vincula botão da nav
  ══════════════════════════════════════════════════════════ */

  function _boot() {
    FilterStore.load();
    _atualizarBadge();
    _vincularBotaoNav();
    console.log('[filter] boot concluído — filtro ativo:', FilterStore.isActive(),
                '| aulas:', FilterStore.count());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _boot);
  } else {
    _boot();
  }

})();