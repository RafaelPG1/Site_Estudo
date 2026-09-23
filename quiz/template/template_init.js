// @ts-nocheck
/* ============================================================
   NEXUS STUDY — quiz/template/template_init.js

   RESPONSABILIDADES (e apenas estas):
     1. Ler e validar parâmetros da URL           _lerParams()
     2. Resolver disciplina e modo               _resolverContexto()
     3. Aplicar tema visual                      _aplicarTema()
     4. Montar componentes visuais do template   _montarVisual()
     5. Injetar nav-float                        _injetarNavFloat()
     6. Inicializar áudio                        _inicializarAudio()
     7. Montar caminho do conteúdo               _resolverCaminhoConteudo()
     8. Aguardar Firebase (fire-and-forget)      _aguardarFirebase()
     9. Carregar conteúdo + UI + engine          _carregarQuiz()
    10. Inicializar Quiz-Assistant               _inicializarAssistant()

   PROIBIÇÕES ABSOLUTAS:
     ✗ Lógica de negócio do quiz
     ✗ Renderização de questões
     ✗ Correção de respostas
     ✗ Conhecer catalog.json
     ✗ Conhecer HTMLs de disciplinas
   ============================================================ */


/* ── Imports ─────────────────────────────────────────────── */

import {
  setPagina,
  setDisciplina,
  setSemestre,
  getDisciplinasDeSemestre,
  resolveIcone,
  SEMESTRES,
} from '../../src/global.js';

import Storage from '../../src/storage.js';
import { DISC_CORES } from '../../shared/js/themes/cores.js';
import { propagarSemNosLinks } from '../../shared/js/utils/url.js';
import { setText, setHTML } from '../../shared/js/utils/dom.js';
import { aplicarCoresDisciplina } from '../../shared/js/themes/theme.js';
import { injetarLogo } from '../../shared/js/utils/logo.js';
import { Sound, audio, installAudioRecovery, playSound } from '../../shared/js/audio/audio-api.js';
import { carregarRespostasQuiz, salvarRespostasQuiz, limparRespostasQuiz, salvarPerformanceQuiz } from '../../src/firebase.js';
import { aplicarZoomQuestoes, getZoomQuestoes, setZoomQuestoes } from '../../shared/js/utils/zoom.js';

/* ══════════════════════════════════════════════════════════
   CONFIGURAÇÃO DE MODOS
   ══════════════════════════════════════════════════════════ */

var MODOS_CONFIG = {
  ava:      { breadcrumb: 'AVA',      h1: 'Avaliação <em>AVA</em>',       label: 'Avaliação AVA'     },
  questoes: { breadcrumb: 'Questões', h1: 'Questões <em>Práticas</em>',   label: 'Questões Práticas' },
  enade:    { breadcrumb: 'ENADE',    h1: 'Questões <em>ENADE</em>',      label: 'Questões ENADE'    },
  fixacao:  { breadcrumb: 'Fixação',  h1: 'Questões de <em>Fixação</em>', label: 'Fixação'           },
};


/* ══════════════════════════════════════════════════════════
   PASSO 1 — Ler e validar parâmetros da URL
   ══════════════════════════════════════════════════════════ */

function _lerParams() {
  var params   = new URLSearchParams(location.search);
  var disc     = params.get('disc') || 'poo';
  var modo     = params.get('modo') || 'questoes';
  var semestre = (params.get('sem') || SEMESTRES[0])
    .replace(/-(.+)$/, function (_, ap) { return '-' + ap.toUpperCase(); });

  return { disc: disc, modo: modo, semestre: semestre };
}


/* ══════════════════════════════════════════════════════════
   PASSO 2 — Resolver disciplina
   ══════════════════════════════════════════════════════════ */

function _resolverDisciplina(disc, semestre) {
  var lista    = getDisciplinasDeSemestre(semestre);
  var discInfo = lista.find(function (d) { return d.id === disc; });

  if (!discInfo) {
    console.warn(
      '[template_init] Disciplina "' + disc + '" não encontrada em ' + semestre + '.' +
      ' Usando fallback: "' + (lista[0] ? lista[0].id : 'nenhuma') + '".'
    );
  }

  /* Fallback sem entrada em _DISCIPLINAS: usa a chave 'code' de
     _ICONES (mesmo ícone padrão que resolveIcone() já assume
     quando nenhuma chave é encontrada — ver global.js). */
  return discInfo || lista[0] || { id: disc, nome: disc, arquivo: disc, icone: 'code' };
}


/* ══════════════════════════════════════════════════════════
   PASSO 3 — Aplicar tema visual
   ══════════════════════════════════════════════════════════ */

function _aplicarTema(arquivo) {
  aplicarCoresDisciplina(arquivo, DISC_CORES);

  var cores = DISC_CORES[arquivo];
  if (cores) {
    var root = document.documentElement;
    root.style.setProperty('--accent',     cores.corTema);
    root.style.setProperty('--accent-rgb', cores.corTemaRgb);
  } else {
    console.warn('[template_init] Sem cores para "' + arquivo + '"');
  }
}


/* ══════════════════════════════════════════════════════════
   PASSO 3.5 — Ícone da disciplina (badge #disc-emoji)

   O badge #disc-emoji exibia um emoji como texto puro
   (setText). Agora recebe o SVG resolvido via resolveIcone(),
   então passa a usar setHTML.

   Esta função injeta uma regra CSS mínima e específica ao
   próprio badge (#disc-emoji svg), sem tocar em nenhum
   arquivo CSS do projeto:
     • dimensiona o SVG em `em`, herdando o font-size já
       definido para #disc-emoji (mesmo tamanho do emoji
       anterior);
     • herda a cor via currentColor, preservando a cor do
       badge já controlada pelo tema (--accent);
     • mantém alinhamento vertical equivalente ao glifo de
       texto que havia antes.
   ══════════════════════════════════════════════════════════ */

function _injetarEstiloIconeDisciplina() {
  if (document.getElementById('disc-emoji-svg-style')) return;
  var style = document.createElement('style');
  style.id = 'disc-emoji-svg-style';
  style.textContent =
    '#disc-emoji svg {' +
      'width: 1em;' +
      'height: 1em;' +
      'display: block;' +
      'color: currentColor;' +
      'vertical-align: middle;' +
    '}';
  document.head.appendChild(style);
}


/* ══════════════════════════════════════════════════════════
   PASSO 4 — Montar componentes visuais do template
   ══════════════════════════════════════════════════════════ */

function _atualizarTextos(info, modoConfig, semestre) {
  setHTML('disc-emoji',    resolveIcone(info.icone));
  setText('disc-nome',     info.nome);
  setHTML('page-title-h1', modoConfig.h1);
  setText('page-footer',   'Nexus Study · ' + info.nome + ' · ' + modoConfig.label);
  document.title = modoConfig.breadcrumb + ' — Nexus Study';
}

function _atualizarBadgeSemestre(semestre) {
  var semBadge = document.getElementById('header-sem-badge');
  if (semBadge) semBadge.textContent = semestre;
}

function _atualizarBackBtn(urlBack) {
  var backBtn = document.querySelector('.back-btn');
  if (backBtn) backBtn.href = urlBack;
}

function _montarUrlBack(semestre, arquivo) {
  var periodo = semestre.includes('-') ? semestre.split('-')[0] : semestre;
  var ano     = periodo.split('.')[0];
  return '../disciplinas/' + ano + '/' + periodo + '/' + arquivo + '.html?sem=' + semestre;
}

function _montarVisual(params, info, modoConfig) {
  _injetarEstiloIconeDisciplina();
  _atualizarTextos(info, modoConfig, params.semestre);
  _atualizarBadgeSemestre(params.semestre);

  var urlBack = _montarUrlBack(params.semestre, info.arquivo);
  window.NEXUS_URL_BACK = urlBack;
  _atualizarBackBtn(urlBack);

  document.body.dataset.disciplina = info.arquivo;
  document.body.dataset.modo       = params.modo;

  injetarLogo('#header-logo-wrap');
  propagarSemNosLinks(params.semestre, ['.header__logo[href*="quiz.html"]']);
}


/* ══════════════════════════════════════════════════════════
   PASSO 5 — Injetar nav-float
   ══════════════════════════════════════════════════════════ */

/* ── SPEED DIAL (somente tablet/celular, ≤ 768px) ───────────
   Não cria nem move nenhum botão: a própria <nav.nav-float>, com
   todos os botões que já existem nela (os 8 nativos + música,
   efeitos e IA que são movidos para dentro dela), passa a ficar
   recolhida e é aberta por UM botão principal (+ / ×), fixo no
   centro da lateral direita.

   - Fechado: a nav fica transparente e "inert" (não recebe clique
     nem foco). "inert" é necessário porque os botões de áudio e IA
     têm `pointer-events:auto !important` no template.css, o que
     faria eles continuarem clicáveis mesmo com a nav invisível.
   - O botão principal é uma ABA lateral (handle de gaveta): colada
     na borda direita da tela, pequena, com cantos arredondados só
     do lado de dentro e centralizada apenas na vertical.
   - Aberto: a coluna de botões aparece encostada na aba, junto à
     borda direita, centralizada verticalmente na mesma altura dela.
   - Acima de 768px nada muda: o botão principal fica oculto, a nav
     continua exatamente como era e `inert` é removido.
   ────────────────────────────────────────────────────────── */

function _injetarEstiloSpeedDial() {
  if (document.getElementById('nexus-speed-dial-css')) return;
  var style = document.createElement('style');
  style.id = 'nexus-speed-dial-css';
  style.textContent = [
    '.nav-speed-dial-toggle{display:none;}',

    '@media (max-width:768px){',
      ':root{--sd-tab-w:22px;--sd-tab-h:56px;--sd-gap:8px;--sd-hit:6px;}',

      /* Aba lateral (handle): colada na borda direita, sem folga. */
      '.nav-speed-dial-toggle{',
        'display:flex;align-items:center;justify-content:center;',
        'position:fixed;right:0;top:50%;transform:translateY(-50%);',
        'transform-origin:right center;',
        'width:var(--sd-tab-w);height:var(--sd-tab-h);z-index:51;',
        'padding:0;font-size:.68rem;cursor:pointer;',
        /* cantos arredondados só do lado de dentro; borda direita some */
        'border-radius:12px 0 0 12px;',
        'background:rgba(var(--accent-rgb),.16);',
        'border:1px solid rgba(var(--accent-rgb),.42);border-right:0;',
        'color:var(--accent);',
        '-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);',
        'box-shadow:-3px 0 14px rgba(0,0,0,.35);',
        'transition:background .22s ease,border-color .22s ease,box-shadow .22s ease;',
        'touch-action:manipulation;-webkit-tap-highlight-color:transparent;',
      '}',
      /* Área de toque maior que a aba visível (a aba é fina). */
      '.nav-speed-dial-toggle::before{',
        'content:"";position:absolute;',
        'top:calc(var(--sd-hit) * -1);bottom:calc(var(--sd-hit) * -1);',
        'left:calc(var(--sd-hit) * -1);right:0;',
      '}',
      '.nav-speed-dial-toggle i{transition:transform .28s cubic-bezier(.22,1,.36,1);}',
      '.nav-speed-dial-toggle.sd-open{',
        'background:rgba(var(--accent-rgb),.26);',
        'border-color:rgba(var(--accent-rgb),.6);',
      '}',
      /* seta: > fechado, < aberto */
      '.nav-speed-dial-toggle.sd-open i{transform:rotate(180deg);}',
      '.nav-speed-dial-toggle:active{transform:translateY(-50%) scale(.95);}',

      /* Nav-float vira a lista do speed dial — encostada na aba */
      'nav.nav-float{',
        'right:calc(var(--sd-tab-w) + var(--sd-gap));',
        'top:50%;',
        'transform:translateY(-50%) translateX(0) scale(1);',
        'transform-origin:right center;',
        'opacity:1;',
        'transition:opacity .22s ease,transform .28s cubic-bezier(.22,1,.36,1);',
        /* Fundo sólido de "gaveta": os botões têm fundo quase transparente
           e, sobre o texto das questões, ficavam ilegíveis no mobile. */
        'align-items:center;padding:8px 6px;',
        'background:rgba(8,12,22,.98);',
        'border:1px solid rgba(255,255,255,.12);border-radius:14px;',
        '-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);',
        'box-shadow:0 8px 28px rgba(0,0,0,.55);',
      '}',
      /* Ícones mais legíveis. Exclui hover, modo (.btn-toggle-modo) e filtro
         ativo, que já têm cor própria de destaque. */
      'nav.nav-float .nav-btn:not(:hover):not(.btn-toggle-modo):not(.filtro-ativo){',
        'color:rgba(255,255,255,.8);',
        'background:rgba(255,255,255,.07);',
        'border-color:rgba(255,255,255,.16);',
      '}',
      /* .btn-legenda usa !important no quiz_ui.js com cor a 50%. */
      'nav.nav-float .btn-legenda:not(:hover){',
        'color:rgba(var(--accent-rgb),.92)!important;',
        'background:rgba(var(--accent-rgb),.12)!important;',
        'border-color:rgba(var(--accent-rgb),.34)!important;',
      '}',
      'nav.nav-float:not(.sd-open){',
        'opacity:0;',
        'transform:translateY(-50%) translateX(12px) scale(.94);',
        'pointer-events:none;',
      '}',
      /* Fallback para navegadores sem suporte a `inert`. */
      'nav.nav-float:not(.sd-open) #nexus-fab,',
      'nav.nav-float:not(.sd-open) #music-btn-global,',
      'nav.nav-float:not(.sd-open) .abtn{pointer-events:none!important;}',
    '}',

    '@media (max-width:428px){',
      ':root{--sd-tab-w:20px;--sd-tab-h:52px;--sd-gap:6px;--sd-hit:5px;}',
    '}',

    /* Telas baixas (celular na horizontal, etc.): compacta a lista. */
    '@media (max-width:768px) and (max-height:600px){',
      'nav.nav-float{gap:2px;}',
      'nav.nav-float .nav-btn{width:28px;height:28px;min-width:28px;min-height:28px;}',
      'nav.nav-float #nexus-fab,nav.nav-float #music-btn-global,nav.nav-float .abtn{',
        'width:30px!important;height:30px!important;',
      '}',
    '}',

    '@media (prefers-reduced-motion:reduce){',
      'nav.nav-float,.nav-speed-dial-toggle i{transition:none;}',
    '}',
  ].join('');
  document.head.appendChild(style);
}

function _montarSpeedDial(nav) {
  if (document.getElementById('nav-speed-dial-toggle')) return;

  _injetarEstiloSpeedDial();

  nav.id = nav.id || 'nexus-nav-float';

  var toggle = document.createElement('button');
  toggle.id        = 'nav-speed-dial-toggle';
  toggle.className = 'nav-speed-dial-toggle';
  toggle.type      = 'button';
  toggle.setAttribute('aria-controls', nav.id);
  toggle.innerHTML = '<i class="fas fa-chevron-right" aria-hidden="true"></i>';
  document.body.appendChild(toggle);

  var mq     = window.matchMedia ? window.matchMedia('(max-width: 768px)') : null;
  var aberto = false;

  function _aplicar() {
    var mobile = !!(mq && mq.matches);

    nav.classList.toggle('sd-open', aberto);
    toggle.classList.toggle('sd-open', aberto);
    toggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    toggle.setAttribute('aria-label', aberto ? 'Fechar atalhos' : 'Abrir atalhos');

    /* Recolhido só no mobile/tablet; no desktop a nav segue normal. */
    if (mobile && !aberto) nav.setAttribute('inert', '');
    else                   nav.removeAttribute('inert');
  }

  toggle.addEventListener('click', function () {
    aberto = !aberto;
    _aplicar();
  });

  if (mq) {
    if (mq.addEventListener) mq.addEventListener('change', _aplicar);
    else if (mq.addListener) mq.addListener(_aplicar);
  }

  _aplicar();
}

function _criarBotaoNav(id, titulo, icone) {
  return '<button id="' + id + '" class="nav-btn" title="' + titulo + '" type="button">' +
         '<i class="' + icone + '" aria-hidden="true"></i></button>';
}

function _injetarNavFloat() {
  var nav = document.createElement('nav');
  nav.className = 'nav-float';
  nav.setAttribute('aria-label', 'Navegação rápida');

  nav.innerHTML =
    _criarBotaoNav('btn-up',        'Ir ao topo',        'fas fa-arrow-up')    +
    _criarBotaoNav('btn-left',      'Voltar',            'fas fa-rotate-left') +
    _criarBotaoNav('btn-down',      'Ir ao final',       'fas fa-arrow-down')  +
    '<div class="nav-divider" aria-hidden="true"></div>'                        +
    '<button id="restartButton" class="nav-btn" title="Reiniciar" type="button">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"' +
        ' stroke="currentColor" stroke-width="3" stroke-linecap="round"' +
        ' stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M21 9a9.01 9.01 0 0 0-16.95 1"/>' +
        '<polyline points="21 3 21 9 15 9"/>' +
        '<path d="M3 15a9.01 9.01 0 0 0 16.95-1"/>' +
        '<polyline points="3 21 3 15 9 15"/>' +
      '</svg>' +
    '</button>'                                                                 +
    _criarBotaoNav('revealButton',  'Revelar respostas', 'fas fa-eye')         +
    '<div class="nav-divider" aria-hidden="true"></div>'                        +
    '<button id="btn-toggle-modo" class="nav-btn btn-toggle-modo" title="Modo Step" type="button">' +
      '<i class="fas fa-layer-group" aria-hidden="true"></i></button>'          +
    '<div class="nav-divider" aria-hidden="true"></div>'                        +
    '<button id="btn-filtro-aulas" class="nav-btn btn-filtro-aulas" title="Filtrar aulas" type="button">' +
      '<i class="fas fa-filter" aria-hidden="true"></i></button>'               +
    '<div class="nav-divider" aria-hidden="true"></div>'                        +
    '<button id="btn-legenda" class="nav-btn btn-legenda" title="Informações" type="button">' +
      '<i class="fas fa-circle-info" aria-hidden="true"></i></button>'          +
    '<div class="nav-divider nav-divider--externo" aria-hidden="true"></div>';

  document.body.appendChild(nav);

  _montarSpeedDial(nav);

  var moved = { music: false, sfx: false, ia: false };

  function _tentarMover() {
    if (!moved.music) {
      var music = document.getElementById('music-btn-global');
      if (music) { nav.appendChild(music); moved.music = true; }
    }
    if (!moved.sfx) {
      var sfx = document.querySelector('.abtn');
      if (sfx) { nav.appendChild(sfx); moved.sfx = true; }
    }
    if (!moved.ia) {
      var ia = document.getElementById('nexus-fab');
      if (ia) { nav.appendChild(ia); moved.ia = true; }
    }
    return moved.music && moved.sfx && moved.ia;
  }

  if (_tentarMover()) return;

  var observer = new MutationObserver(function () {
    if (_tentarMover()) observer.disconnect();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

/* ══════════════════════════════════════════════════════════
   PASSO 6 — Inicializar áudio
   ══════════════════════════════════════════════════════════ */

var _IDS_NAV_FLOAT = [
  'btn-up', 'btn-left', 'btn-down',
  'restartButton', 'revealButton',
  'btn-toggle-modo', 'btn-filtro-aulas', 'btn-legenda',
];

function _vincularSomBotao(id) {
  var btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('mouseenter', function () { playSound('hover', 'quiz'); });
  btn.addEventListener('click',      function () { playSound('click', 'quiz'); });
}

function _inicializarAudio() {
  Sound.init();
  installAudioRecovery({ Sound, audio });

  Sound.waitUntilReady().then(function () {
    var backBtn = document.querySelector('.back-btn');
    if (backBtn) backBtn.addEventListener('click', function () { playSound('click', 'quiz'); });

    _IDS_NAV_FLOAT.forEach(_vincularSomBotao);
  });
}


/* ══════════════════════════════════════════════════════════
   PASSO 7 — Resolver caminho do arquivo de conteúdo

   Exemplos de saída:
     sem=2026.1      → content/quiz/2026/2026.1/ques_poo.js
     sem=2026.1-AP1  → content/quiz/2026/2026.1/AP1/ques_poo.js
   ══════════════════════════════════════════════════════════ */

function _resolverCaminhoConteudo(semestre, arquivo) {
  var temAP   = semestre.includes('-');
  var periodo = temAP ? semestre.split('-')[0] : semestre;
  var ap      = temAP ? semestre.split('-')[1] : null;
  var ano     = periodo.split('.')[0];
  var base    = '../../content/quiz/' + ano + '/' + periodo + '/';

  return ap
    ? base + ap + '/ques_' + arquivo + '.js'
    : base + 'ques_' + arquivo + '.js';
}


/* ══════════════════════════════════════════════════════════
   PASSO 8 — Aguardar Firebase (fire-and-forget, máx 3s)
   ══════════════════════════════════════════════════════════ */

function _aguardarFirebase(params) {
  var usuario = Storage.get('usuario', null);

  if (!usuario || !usuario.uid) {
    window.__NEXUS_FIREBASE_RESPOSTAS__ = null;
    return Promise.resolve();
  }

  var _busca = carregarRespostasQuiz(usuario.uid, params.semestre, params.modo, params.disc)
    .then(function (data) { window.__NEXUS_FIREBASE_RESPOSTAS__ = data || null; })
    .catch(function ()    { window.__NEXUS_FIREBASE_RESPOSTAS__ = null; });

  var _timeout = new Promise(function (resolve) { setTimeout(resolve, 3000); });

  return Promise.race([_busca, _timeout]);
}


/* ══════════════════════════════════════════════════════════
   PASSO 9 — Carregar conteúdo + UI + engine

   Ordem de carregamento:
     1. Conteúdo (ques_*.js) e quiz_ui.js em paralelo
     2. quiz_engine.js (após os dois acima estarem prontos)

   filter.js é carregado pelo template.html como script defer,
   antes de quiz_starter_modal.js e quiz_engine.js. Não é
   responsabilidade deste módulo carregá-lo.
   ══════════════════════════════════════════════════════════ */

function _loadScript(src, appendTo) {
  return new Promise(function (resolve, reject) {
    var s     = document.createElement('script');
    s.src     = src;
    s.onload  = resolve;
    s.onerror = reject;
    (appendTo || document.head).appendChild(s);
  });
}


var _contentPromise = null;

function _carregarConteudo(params, info) {
  if (_contentPromise) return _contentPromise;

  var contentSrc = _resolverCaminhoConteudo(params.semestre, info.arquivo);

  _contentPromise = _loadScript(contentSrc, document.head).catch(function () {
    console.warn('[template_init] Conteúdo não encontrado:', contentSrc);
    window.questoes = window.questoes || { ava: [], questoes: [], fixacao: [], enade: [] };
  });

  return _contentPromise;
}

function _carregarQuiz(params, info) {
  var uiSrc           = '../js/quiz_ui.js';
  var engineSrc       = '../js/quiz_engine.js';
  var intelligenceSrc = '../js/quiz_intelligence.js';

  /* filter.js carregado pelo template.html antes deste módulo. */
  Promise.all([
    _carregarConteudo(params, info),
    _loadScript(uiSrc, document.head),
  ])
    .then(function () {
      return new Promise(function (resolve, reject) {
        var s  = document.createElement('script');
        s.type = 'module';
        s.src  = intelligenceSrc;
        s.onload  = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      });
    })
    .then(function () {
      return _loadScript(engineSrc, document.body);
    })
    .catch(function (err) {
      console.error('[template_init] Falha ao carregar UI do quiz:', err);
    });
}

/* ══════════════════════════════════════════════════════════
   PASSO 10 — Inicializar Quiz-Assistant
   ══════════════════════════════════════════════════════════ */

function _depsAssistantPresentes() {
  return (
    typeof window.NexusUI             !== 'undefined' &&
    typeof window.NexusHistory        !== 'undefined' &&
    typeof window.NexusWorker         !== 'undefined' &&
    typeof window.NexusQuizAssistant  !== 'undefined' &&
    window.__NEXUS_QUIZ_DISC__ &&
    window.__NEXUS_QUIZ_MODO__
  );
}

function _inicializarAssistant() {
  var tentativasDeps = 0;
  var MAX_DEPS        = 100;

  var timerDeps = setInterval(function () {
    tentativasDeps++;

    if (_depsAssistantPresentes()) {
      clearInterval(timerDeps);
      _aguardarSnapshotEIniciar();
      return;
    }

    if (tentativasDeps >= MAX_DEPS) {
      clearInterval(timerDeps);
      console.warn('[template_init] Quiz-Assistant: dependências ausentes após 5s — não inicializado.');
    }
  }, 50);
}

function _aguardarSnapshotEIniciar() {
  var TIMEOUT_MS = 12000;
  var finalizado = false;
  var timer      = null;

  function _snapshotPronto() {
    var visuais = window.__NEXUS_QUESTOES_VISUAIS__;
    return window.__NEXUS_QUIZ_PRONTO__ === true ||
           (Array.isArray(visuais) && visuais.length > 0);
  }

  function _iniciar() {
    if (finalizado) return;
    finalizado = true;
    clearTimeout(timer);
    window.removeEventListener('nexus:quizPronto', _iniciar);
    window.removeEventListener('nexus:quizCarregando', _armarTimeout);
    window.NexusQuizAssistant.init();
  }

  /* Só começa a contar quando o engine começou a ser carregado. */
  function _armarTimeout() {
    if (finalizado || timer) return;
    timer = setTimeout(function () {
      console.warn('[template_init] Quiz-Assistant: snapshot não chegou em ' +
                   (TIMEOUT_MS / 1000) + 's após o carregamento — iniciando sem mapa visual.');
      _iniciar();
    }, TIMEOUT_MS);
  }

  window.addEventListener('nexus:quizPronto', _iniciar);
  window.addEventListener('nexus:quizCarregando', _armarTimeout);

  if (_snapshotPronto()) { _iniciar(); return; }
  if (window.__NEXUS_QUIZ_CARREGANDO__) _armarTimeout();
}

/* ══════════════════════════════════════════════════════════
   EXPOSIÇÃO PARA SCRIPTS CLÁSSICOS
   ══════════════════════════════════════════════════════════ */

function _exponerGlobais() {
  window.NexusStorage  = Storage;
  window.NexusFirebase = {
    salvarRespostasQuiz,
    carregarRespostasQuiz,
    limparRespostasQuiz,
    salvarPerformanceQuiz,   /* PERFORMANCE ANALYTICS */
  };
  window.__nexusPlaySound = playSound;

  /* Zoom escopado ao conteúdo das questões (#quiz-container).
     Independente do zoom geral da área 'quiz'. */
  window.NexusZoom = {
    aplicarZoomQuestoes,
    getZoomQuestoes,
    setZoomQuestoes,
  };
}


/* ══════════════════════════════════════════════════════════
   EXPOSIÇÃO DE CONTEXTO PARA O ENGINE E ASSISTANT
   ══════════════════════════════════════════════════════════ */

function _exponerContextoQuiz(params) {
  window.__NEXUS_QUIZ_DISC__     = params.disc;
  window.__NEXUS_QUIZ_MODO__     = params.modo;
  window.__NEXUS_QUIZ_SEMESTRE__ = params.semestre;
}


/* ══════════════════════════════════════════════════════════
   DECLARAÇÃO DE CONTEXTO PARA O SISTEMA DE RESET
   ══════════════════════════════════════════════════════════ */

function _declararContextoIA(params) {
  if (typeof window.NexusCtx !== 'undefined') {
    window.NexusCtx.declarar({
      disc:   params.disc,
      modo:   params.modo,
      sem:    params.semestre,
      pagina: 'QUIZ',
    });
  }
}


/* ══════════════════════════════════════════════════════════
   ATUALIZAÇÃO DO ESTADO GLOBAL
   ══════════════════════════════════════════════════════════ */

function _atualizarEstadoGlobal(params) {
  setSemestre(params.semestre);
  setDisciplina(params.disc);
  setPagina('QUIZ');
}


/* ══════════════════════════════════════════════════════════
   BOOT

   Ordem de execução:
     [síncrono, imediato]
       1. Lê parâmetros da URL
       2. Resolve disciplina
       3. Aplica tema (evita FOUC)
       4. Expõe globais e contexto do quiz
       5. Atualiza estado global
       6. Declara contexto para o sistema de reset

     [assíncrono, após DOMContentLoaded]
       7. Monta componentes visuais
       8. Injeta nav-float
       9. Inicializa áudio

     [controlado pelo modal — não automático]
       10. Aguarda Firebase (máx 3s)
       11. Carrega conteúdo + UI + engine
       12. Inicializa Quiz-Assistant (após engine montar questões)

   IMPORTANTE: _carregarQuiz NÃO é chamado aqui.
   É exposto via window.__nexusCarregarQuiz e chamado
   pelo quiz_starter_modal.js após a decisão do fluxo.
   ══════════════════════════════════════════════════════════ */

var _params     = _lerParams();
var _info       = _resolverDisciplina(_params.disc, _params.semestre);
var _modoConfig = MODOS_CONFIG[_params.modo] || MODOS_CONFIG.questoes;

_aplicarTema(_info.arquivo);

_exponerGlobais();
_exponerContextoQuiz(_params);
_atualizarEstadoGlobal(_params);
_declararContextoIA(_params);

document.addEventListener('DOMContentLoaded', function () {
  _montarVisual(_params, _info, _modoConfig);
  _injetarNavFloat();
  _inicializarAudio();
  _inicializarAssistant();

});

window.__nexusCarregarQuiz = function () {
  window.__NEXUS_QUIZ_CARREGANDO__ = true;
  window.dispatchEvent(new CustomEvent('nexus:quizCarregando'));
  _aguardarFirebase(_params);
  _carregarQuiz(_params, _info);
};

window.__nexusPreCarregarConteudo = function () {
  return _carregarConteudo(_params, _info);
};