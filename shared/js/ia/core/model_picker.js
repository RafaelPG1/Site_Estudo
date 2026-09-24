/**
 * NEXUS — shared/js/ia/core/model_picker.js
 *
 * Seletor de modelo de IA para o painel do assistente (#nexus-panel).
 *
 * Responsabilidades exclusivas:
 *   - Injetar uma barra "Modelo" logo abaixo de #nexus-disc-bar, com um chip
 *     que mostra o ícone e o nome do modelo ativo e abre um menu de escolha
 *   - Guardar a escolha em localStorage (persiste entre sessões)
 *   - Expor a escolha via NexusModelPicker.get() para o core/worker.js enviar
 *     ao Cloudflare Worker no campo `provedor`
 *
 * NÃO conhece: quiz, resumo, disciplinas, histórico, rede.
 * Não altera ui.js: espera o painel existir (MutationObserver) e se encaixa.
 *
 * Valores possíveis de get():
 *   'auto'        → cascata Groq → Gemini → OpenRouter (com fallback)
 *   'groq'        → só Groq (GPT-OSS 120B), sem fallback
 *   'gemini'      → só Gemini (3.5 Flash-Lite), sem fallback
 *   'openrouter'  → só OpenRouter (NVIDIA Nemotron 3 Ultra), sem fallback
 *
 * Os ícones são desenhos simples e próprios (não são os logotipos oficiais);
 * a cor de cada um lembra o provedor para facilitar a identificação.
 *
 * Evento disparado ao trocar: window 'nexus:modeloAlterado' { detail:{ provedor } }
 *
 * API pública: window.NexusModelPicker
 *   get()        → string  (id do provedor escolhido)
 *   set(id)      → void
 *   lista()      → array de { id, nome, curto, detalhe, cor }
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'nexus_ia_provedor';

  /* ══════════════════════════════════════════════════════════
     ÍCONES (SVG 24×24, cores próprias — independem do tema)
  ══════════════════════════════════════════════════════════ */

  function _svg(inner, size) {
    var s = size || 18;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" ' +
           'aria-hidden="true" focusable="false">' + inner + '</svg>';
  }

  /* Automático — um ponto de origem que se ramifica (cascata / fallback) */
  function _iconAuto(size) {
    return _svg(
      '<path d="M7 12C11.5 12 12 6 17 6M7 12C11.5 12 12 18 17 18" ' +
        'stroke="#00c8ff" stroke-width="1.8" stroke-linecap="round"/>' +
      '<circle cx="5" cy="12" r="2.6" fill="#00c8ff"/>' +
      '<circle cx="19" cy="6" r="2.2" fill="#00c8ff" fill-opacity=".75"/>' +
      '<circle cx="19" cy="18" r="2.2" fill="#00c8ff" fill-opacity=".45"/>',
      size
    );
  }

  /* Groq — raio (velocidade de inferência), laranja */
  function _iconGroq(size) {
    return _svg(
      '<rect x="3" y="3" width="18" height="18" rx="6" fill="#f55036" fill-opacity=".16" ' +
        'stroke="#f55036" stroke-width="1.5"/>' +
      '<path d="M13.2 5.2 7 13.2h4.4l-.9 5.6 6.5-8.3h-4.5l.7-5.3Z" fill="#f55036"/>',
      size
    );
  }

  /* Gemini — estrela de 4 pontas em dois tons, azul */
  function _iconGemini(size) {
    return _svg(
      '<path d="M12 2C12.7 8 16 11.3 22 12 16 12.7 12.7 16 12 22 11.3 16 8 12.7 2 12 8 11.3 11.3 8 12 2Z" ' +
        'fill="#4f8cff"/>' +
      '<path d="M12 7.2C12.4 10 14 11.6 16.8 12 14 12.4 12.4 14 12 16.8 11.6 14 10 12.4 7.2 12 10 11.6 11.6 10 12 7.2Z" ' +
        'fill="#b9d0ff"/>',
      size
    );
  }

  /* OpenRouter / NVIDIA Nemotron — hexágono com núcleo, verde */
  function _iconNemotron(size) {
    return _svg(
      '<path d="M12 2.6 20 7.3v9.4l-8 4.7-8-4.7V7.3l8-4.7Z" fill="#76b900" fill-opacity=".16" ' +
        'stroke="#76b900" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<circle cx="12" cy="12" r="3.6" stroke="#76b900" stroke-width="1.6"/>' +
      '<circle cx="12" cy="12" r="1.3" fill="#76b900"/>',
      size
    );
  }

  var _ICONE_CHEVRON =
    '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<polyline points="6 9 12 15 18 9"/></svg>';

  var _ICONE_CHECK =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<polyline points="20 6 9 17 4 12"/></svg>';

  /* ══════════════════════════════════════════════════════════
     MODELOS DISPONÍVEIS
  ══════════════════════════════════════════════════════════ */

  var MODELOS = [
    {
      id: 'auto', nome: 'Automático', curto: 'Auto', cor: '#00c8ff',
      detalhe: 'Groq → Gemini → OpenRouter, com fallback', icone: _iconAuto,
    },
    {
      id: 'groq', nome: 'Groq', curto: 'Groq', cor: '#f55036',
      detalhe: 'GPT-OSS 120B', icone: _iconGroq,
    },
    {
      id: 'gemini', nome: 'Gemini', curto: 'Gemini', cor: '#4f8cff',
      detalhe: 'Gemini 3.5 Flash-Lite', icone: _iconGemini,
    },
    {
      id: 'openrouter', nome: 'OpenRouter', curto: 'Nemotron', cor: '#76b900',
      detalhe: 'NVIDIA Nemotron 3 Ultra (free)', icone: _iconNemotron,
    },
  ];

  function _achar(id) {
    for (var i = 0; i < MODELOS.length; i++) {
      if (MODELOS[i].id === id) return MODELOS[i];
    }
    return null;
  }

  /* ══════════════════════════════════════════════════════════
     ESTADO
  ══════════════════════════════════════════════════════════ */

  function get() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      if (v && _achar(v)) return v;
    } catch (e) { /* storage indisponível */ }
    return 'auto';
  }

  function set(id) {
    if (!_achar(id)) return;
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) { /* sem persistência */ }
    _atualizarChip();
    _atualizarMenu();
    try {
      window.dispatchEvent(new CustomEvent('nexus:modeloAlterado', { detail: { provedor: id } }));
    } catch (e) { /* CustomEvent indisponível */ }
    console.log('[NexusModelPicker] modelo:', id);
  }

  function lista() {
    return MODELOS.map(function (m) {
      return { id: m.id, nome: m.nome, curto: m.curto, detalhe: m.detalhe, cor: m.cor };
    });
  }

  /* ══════════════════════════════════════════════════════════
     ESTILO
  ══════════════════════════════════════════════════════════ */

  function _injetarCSS() {
    if (document.getElementById('nexus-model-picker-css')) return;
    var st = document.createElement('style');
    st.id = 'nexus-model-picker-css';
    st.textContent = [
      '#nexus-model-bar{position:relative;display:flex;align-items:center;gap:8px;',
        'padding:6px 12px;flex-shrink:0;',
        'border-bottom:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02);}',
      '#nexus-model-bar .nxm-label{font-size:11px;letter-spacing:.04em;text-transform:uppercase;',
        'color:rgba(255,255,255,.45);}',

      '#nexus-model-btn{display:inline-flex;align-items:center;gap:6px;cursor:pointer;',
        'padding:3px 8px 3px 6px;border-radius:999px;font:inherit;font-size:12px;',
        'color:rgba(255,255,255,.9);background:rgba(255,255,255,.05);',
        'border:1px solid rgba(255,255,255,.14);transition:background .15s,border-color .15s;}',
      '#nexus-model-btn:hover,#nexus-model-btn[aria-expanded="true"]{',
        'background:rgba(255,255,255,.10);border-color:rgba(255,255,255,.28);}',
      '#nexus-model-btn .nxm-ico{display:inline-flex;}',

      '#nexus-model-menu{position:absolute;left:10px;top:calc(100% + 4px);z-index:30;',
        'min-width:260px;max-width:calc(100% - 20px);max-height:60vh;overflow-y:auto;',
        'padding:6px;border-radius:12px;background:rgba(10,15,26,.98);',
        'border:1px solid rgba(255,255,255,.14);',
        'box-shadow:0 18px 40px rgba(0,0,0,.55),0 2px 10px rgba(0,0,0,.4);}',
      '#nexus-model-menu[hidden]{display:none;}',

      '.nxm-item{display:grid;grid-template-columns:30px 1fr 16px;align-items:center;gap:10px;',
        'width:100%;padding:8px;border-radius:9px;cursor:pointer;text-align:left;font:inherit;',
        'color:rgba(255,255,255,.92);background:transparent;border:1px solid transparent;}',
      '.nxm-item:hover{background:rgba(255,255,255,.06);}',
      '.nxm-item[aria-selected="true"]{',
        'background:color-mix(in srgb,var(--c) 14%,transparent);',
        'border-color:color-mix(in srgb,var(--c) 40%,transparent);}',
      '.nxm-item .nxm-ico-box{display:flex;align-items:center;justify-content:center;',
        'width:30px;height:30px;border-radius:8px;',
        'background:color-mix(in srgb,var(--c) 14%,transparent);}',
      '.nxm-item .nxm-nome{display:block;font-size:13px;font-weight:600;line-height:1.2;}',
      '.nxm-item .nxm-det{display:block;margin-top:2px;font-size:11px;line-height:1.25;',
        'color:rgba(255,255,255,.55);}',
      '.nxm-item .nxm-check{display:flex;color:var(--c);opacity:0;}',
      '.nxm-item[aria-selected="true"] .nxm-check{opacity:1;}',
      '.nxm-nota{margin:4px 8px 2px;font-size:10.5px;line-height:1.3;color:rgba(255,255,255,.45);}',
    ].join('');
    document.head.appendChild(st);
  }

  /* ══════════════════════════════════════════════════════════
     DOM
  ══════════════════════════════════════════════════════════ */

  function _esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function _htmlMenu() {
    var atual = get();
    var itens = MODELOS.map(function (m) {
      return (
        '<button type="button" class="nxm-item" role="option" data-id="' + m.id + '"' +
          ' style="--c:' + m.cor + '" aria-selected="' + (m.id === atual) + '">' +
          '<span class="nxm-ico-box">' + m.icone(20) + '</span>' +
          '<span><span class="nxm-nome">' + _esc(m.nome) + '</span>' +
                '<span class="nxm-det">' + _esc(m.detalhe) + '</span></span>' +
          '<span class="nxm-check">' + _ICONE_CHECK + '</span>' +
        '</button>'
      );
    }).join('');
    return itens +
      '<div class="nxm-nota">Ao escolher um modelo específico não há fallback: ' +
      'se ele falhar, o erro aparece em vez de outro modelo responder.</div>';
  }

  function _atualizarChip() {
    var btn = document.getElementById('nexus-model-btn');
    if (!btn) return;
    var m = _achar(get()) || MODELOS[0];
    btn.innerHTML =
      '<span class="nxm-ico">' + m.icone(16) + '</span>' +
      '<span class="nxm-name">' + _esc(m.curto) + '</span>' + _ICONE_CHEVRON;
    btn.title = 'Modelo de IA: ' + m.nome + ' — ' + m.detalhe;
    btn.setAttribute('aria-label', 'Modelo de IA: ' + m.nome + '. Clique para trocar.');
  }

  function _atualizarMenu() {
    var menu = document.getElementById('nexus-model-menu');
    if (!menu) return;
    menu.innerHTML = _htmlMenu();
  }

  function _abrir(aberto) {
    var btn  = document.getElementById('nexus-model-btn');
    var menu = document.getElementById('nexus-model-menu');
    if (!btn || !menu) return;
    menu.hidden = !aberto;
    btn.setAttribute('aria-expanded', String(aberto));
  }

  function _estaAberto() {
    var menu = document.getElementById('nexus-model-menu');
    return !!menu && !menu.hidden;
  }

  function _montar() {
    if (document.getElementById('nexus-model-bar')) return true;

    var ancora = document.getElementById('nexus-disc-bar') ||
                 document.getElementById('nexus-header');
    if (!ancora) return false;

    _injetarCSS();

    var bar = document.createElement('div');
    bar.id = 'nexus-model-bar';
    bar.innerHTML =
      '<span class="nxm-label">Modelo</span>' +
      '<button id="nexus-model-btn" type="button" aria-haspopup="listbox" aria-expanded="false"></button>' +
      '<div id="nexus-model-menu" role="listbox" hidden></div>';

    ancora.parentNode.insertBefore(bar, ancora.nextSibling);

    _atualizarChip();
    _atualizarMenu();

    var btn  = document.getElementById('nexus-model-btn');
    var menu = document.getElementById('nexus-model-menu');

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      _abrir(!_estaAberto());
    });

    menu.addEventListener('click', function (e) {
      e.stopPropagation();
      var item = e.target.closest ? e.target.closest('.nxm-item') : null;
      if (!item) return;
      set(item.getAttribute('data-id'));
      _abrir(false);
    });

    return true;
  }

  /* Fecha ao clicar fora do menu */
  document.addEventListener('mousedown', function (e) {
    if (!_estaAberto()) return;
    var bar = document.getElementById('nexus-model-bar');
    if (bar && bar.contains(e.target)) return;
    _abrir(false);
  });

  /* ESC fecha só o menu (captura, para o painel não fechar junto) */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !_estaAberto()) return;
    e.stopPropagation();
    _abrir(false);
  }, true);

  /* ══════════════════════════════════════════════════════════
     BOOT — espera o painel ser criado por NexusUI.init()
  ══════════════════════════════════════════════════════════ */

  function _boot() {
    if (_montar()) return;

    var obs = new MutationObserver(function () {
      if (_montar()) obs.disconnect();
    });
    obs.observe(document.body, { childList: true });
  }

  if (document.body) _boot();
  else document.addEventListener('DOMContentLoaded', _boot, { once: true });

  window.NexusModelPicker = { get: get, set: set, lista: lista };
}());