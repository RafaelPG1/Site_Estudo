// @ts-nocheck
/* ============================================================
   NEXUS STUDY — quiz/template/template_init.js  v9.1

   RESPONSABILIDADES (e apenas estas):
     1. Declarar contexto de IA antes de carregar módulos  (NOVO v9.1)
     2. Ler e validar parâmetros da URL           _lerParams()
     3. Resolver disciplina e modo               _resolverContexto()
     4. Aplicar tema visual                      _aplicarTema()
     5. Montar componentes visuais do template   _montarVisual()
     6. Injetar nav-float                        _injetarNavFloat()
     7. Inicializar áudio                        _inicializarAudio()
     8. Montar caminho do conteúdo               _resolverCaminhoConteudo()
     9. Aguardar Firebase (fire-and-forget)      _aguardarFirebase()
    10. Carregar conteúdo + UI + engine          _carregarQuiz()

   MUDANÇAS v9.1 — RESET DE CONTEXTO:
     + _declararContexto() grava nexus_ctx + nexus_ctx_dirty antes
       de _carregarIA(), usando disc + modo + sem da URL.
     + Removido: gravação de nexus_worker_ctx em _revogarTokenQuiz().
       NexusCtx substitui esse papel de forma centralizada.
     + Removido: chamada avulsa NexusWorker.limparHistorico() no
       beforeunload (worker limpa via dirty no próximo boot).
     + worker.js e assistant.js cuidam do próprio reset via NexusCtx.

   QUIZ-ISOLATION (mantido integralmente do v9.0):
     + Gera token de sessão de quiz              _gerarTokenQuiz()
     + Registra token em NexusSearch             _autorizarQuizNoSearch()
     + Revoga token ao sair da página            _instalarRevogacao()

   PROIBIÇÕES ABSOLUTAS:
     ✗ Lógica de negócio do quiz
     ✗ Renderização de questões
     ✗ Correção de respostas
     ✗ Conhecer catalog.json
     ✗ Conhecer HTMLs de disciplinas
     ✗ Chamar NexusWorker.limparHistorico() diretamente
   ============================================================ */


/* ── Imports ─────────────────────────────────────────────── */

import {
  setPagina,
  setDisciplina,
  setSemestre,
  getDisciplinasDeSemestre,
  SEMESTRES,
} from '../../src/global.js';

import Storage from '../../src/storage.js';
import { DISC_CORES } from '../../shared/js/themes/cores.js';
import { propagarSemNosLinks } from '../../shared/js/utils/url.js';
import { setText, setHTML } from '../../shared/js/utils/dom.js';
import { aplicarCoresDisciplina } from '../../shared/js/themes/theme.js';
import { injetarLogo } from '../../shared/js/utils/logo.js';
import { Sound, audio, installAudioRecovery, playSound } from '../../shared/js/audio/audio-api.js';
import { carregarRespostasQuiz, salvarRespostasQuiz, limparRespostasQuiz } from '../../src/firebase.js';


/* ══════════════════════════════════════════════════════════
   PASSO 0 — Declarar contexto de IA ANTES de _carregarIA()

   Grava nexus_ctx e nexus_ctx_dirty no sessionStorage de forma
   síncrona, usando os parâmetros da URL (disc, modo, sem).

   worker.js lê dirty no boot síncrono → descarta ou restaura.
   assistant.js lê dirty em initUI()   → limpa DOM ou restaura.

   Não depende de window.NexusCtx estar carregado: usa
   sessionStorage diretamente com a mesma lógica de ctx.js,
   garantindo execução 100% síncrona antes de qualquer _load.
   ══════════════════════════════════════════════════════════ */
(function _declararContexto() {
  try {
    var STORAGE_KEY = 'nexus_ctx';
    var DIRTY_KEY   = 'nexus_ctx_dirty';

    var p    = new URLSearchParams(location.search);
    var disc = p.get('disc') || 'poo';
    var modo = p.get('modo') || 'questoes';
    var sem  = (p.get('sem') || SEMESTRES[0] || '')
      .replace(/-(.+)$/, function (_, ap) { return '-' + ap.toUpperCase(); });

    var novoCtx = { disc: disc, modo: modo, sem: sem, pagina: 'quiz' };

    function _hash(ctx) {
      return [
        (ctx.disc   || '').toLowerCase(),
        (ctx.modo   || '').toLowerCase(),
        (ctx.sem    || '').toLowerCase(),
        (ctx.pagina || '').toLowerCase(),
      ].join('|');
    }

    var salvoRaw = sessionStorage.getItem(STORAGE_KEY);
    var salvo    = salvoRaw ? JSON.parse(salvoRaw) : null;

    if (!salvo || _hash(novoCtx) !== _hash(salvo)) {
      sessionStorage.setItem(DIRTY_KEY,   '1');
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(novoCtx));
    }
  } catch (_) { /* ctx não é essencial para o fluxo do quiz */ }
}());


/* ══════════════════════════════════════════════════════════
   ASSISTENTE NEXUS
   Carregamento em background — sem impacto no fluxo principal
   ══════════════════════════════════════════════════════════ */

(function _carregarIA() {
  var raiz = new URL('../../', import.meta.url).href.replace(/\/$/, '');
  var BASE = raiz + '/shared/js/ia/';

  function _load(src) {
    return new Promise(function (res, rej) {
      var s    = document.createElement('script');
      s.src    = src;
      s.onload = res;
      s.onerror = function () { rej(new Error('[Nexus IA] Falha: ' + src)); };
      document.body.appendChild(s);
    });
  }

  /* Etapa 1: ctx.js primeiro — deve estar pronto quando worker.js bootar */
  _load(BASE + 'core/ctx.js')
    // Etapa 2: deps base sem dependências entre si — carregam em paralelo
    .then(function () {
      return Promise.all([
        _load(BASE + 'core/context.js'),
        _load(BASE + 'core/text-utils.js'),
        _load(BASE + 'core/loader.js'),
        _load(BASE + 'core/worker.js'),   // lê dirty no boot síncrono
        _load(BASE + 'core/ui.js'),
      ]);
    })
    // Etapa 3: os dois módulos de search podem carregar em paralelo
    .then(function () {
      return Promise.all([
        _load(BASE + 'resumo/search.js'),
        _load(BASE + 'quiz/search.js'),
      ]);
    })
    // Etapa 4: assistant de resumo — precisa dos dois search prontos
    .then(function () { return _load(BASE + 'resumo/assistant.js'); })
    // Etapa 5: assistant de quiz — intercepta perguntas quando token ativo
    .then(function () { return _load(BASE + 'quiz/assistant.js'); })
    // Etapa 6: init — detecta contexto e autoriza NexusQuizSearch
    .then(function () { return _load(BASE + 'init.js'); })
    .catch(function (err) { console.error(err); });
}());


/* ══════════════════════════════════════════════════════════
   CONFIGURAÇÃO DE MODOS
   Propriedades visuais por modo — somente apresentação
   ══════════════════════════════════════════════════════════ */

var MODOS_CONFIG = {
  ava:      { breadcrumb: 'AVA',      h1: 'Avaliação <em>AVA</em>',       label: 'Avaliação AVA'     },
  questoes: { breadcrumb: 'Questões', h1: 'Questões <em>Práticas</em>',   label: 'Questões Práticas' },
  enade:    { breadcrumb: 'ENADE',    h1: 'Questões <em>ENADE</em>',      label: 'Questões ENADE'    },
  fixacao:  { breadcrumb: 'Fixação',  h1: 'Questões de <em>Fixação</em>', label: 'Fixação'           },
};


/* ══════════════════════════════════════════════════════════
   QUIZ-ISOLATION — TOKEN DE SESSÃO
   ══════════════════════════════════════════════════════════ */

/**
 * Gera um token criptograficamente aleatório para a sessão de quiz.
 * Usa crypto.randomUUID() quando disponível; cai em Math.random() como fallback.
 */
function _gerarTokenQuiz() {
  var token;
  try {
    token = crypto.randomUUID();
  } catch (e) {
    token = 'nxq-' +
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).slice(2) +
      Date.now().toString(36);
  }
  window.__NEXUS_QUIZ_TOKEN__ = token;
  console.log('[template_init] token de sessão de quiz gerado.');
  return token;
}

/**
 * Aguarda NexusQuizSearch (ou NexusSearch como fallback) ficarem
 * disponíveis e autoriza o token de quiz.
 */
function _autorizarQuizNoSearch(token) {
  var tentativas     = 0;
  var MAX_TENTATIVAS = 30;

  var intervalo = setInterval(function () {
    tentativas++;

    if (typeof window.NexusQuizSearch !== 'undefined' && window.NexusQuizSearch.autorizarQuiz) {
      clearInterval(intervalo);
      window.NexusQuizSearch.autorizarQuiz(token);
      console.log('[template_init] NexusQuizSearch autorizado para quiz.');
      return;
    }

    if (typeof window.NexusSearch !== 'undefined' && window.NexusSearch.autorizarQuiz) {
      clearInterval(intervalo);
      window.NexusSearch.autorizarQuiz(token);
      console.log('[template_init] NexusSearch (alias) autorizado para quiz.');
      return;
    }

    if (tentativas >= MAX_TENTATIVAS) {
      clearInterval(intervalo);
      console.warn('[template_init] NexusQuizSearch não disponível após ' + MAX_TENTATIVAS + ' tentativas.');
    }
  }, 100);
}

/**
 * Notifica o assistente de resumo que entramos em contexto de quiz,
 * selecionando automaticamente a disciplina no chat.
 */
function _notificarDiscNoChat(discId) {
  if (!discId) return;

  var tentativas     = 0;
  var MAX_TENTATIVAS = 50;

  var intervalo = setInterval(function () {
    tentativas++;

    if (typeof window.NexusQuizAssistant !== 'undefined' &&
        typeof window.NexusQuizAssistant.notificarEntradaNoQuiz === 'function') {
      clearInterval(intervalo);
      window.NexusQuizAssistant.notificarEntradaNoQuiz(discId);
      return;
    }

    if (tentativas >= MAX_TENTATIVAS) {
      clearInterval(intervalo);
      console.warn('[template_init] NexusQuizAssistant não disponível — notificação falhou.');
    }
  }, 100);
}

/**
 * Instala revogação do token de quiz em beforeunload / pagehide.
 *
 * v9.1: não grava mais nexus_worker_ctx — NexusCtx (_declararContexto)
 * já faz a comunicação de contexto de forma mais robusta e centralizada.
 * Não chama mais NexusWorker.limparHistorico() — worker.js limpa via dirty.
 */
function _instalarRevogacao() {

  function _revogarTokenQuiz() {
    console.log('[template_init] revogando token de quiz...');

    /* Remove flags de modo */
    try { delete window.__NEXUS_QUIZ_MODO__; } catch (e) {}
    try { delete window.__NEXUS_QUIZ_SEMESTRE__; } catch (e) {}
    try { delete window.__NEXUS_QUIZ_DISC__; } catch (e) {}
    try { delete window.__NEXUS_QUESTOES_VISUAIS__; } catch (e) {}

    /* Revoga token no NexusQuizSearch */
    if (typeof window.NexusQuizSearch !== 'undefined' && window.NexusQuizSearch.revogarQuiz) {
      window.NexusQuizSearch.revogarQuiz();
    }
    if (typeof window.NexusSearch !== 'undefined' && window.NexusSearch.revogarQuiz) {
      window.NexusSearch.revogarQuiz();
    }

    /* Remove token do window */
    try { delete window.__NEXUS_QUIZ_TOKEN__; } catch (e) {}

    /* Zera questoes */
    try { window.questoes = null; } catch (e) {}

    /* NOTA v9.1: NexusWorker.limparHistorico() foi REMOVIDO daqui.
       O próximo boot de qualquer página chama _declararContexto(),
       que detecta a mudança de contexto e grava dirty='1'.
       worker.js descarta o histórico no próprio boot síncrono. */
  }

  window.addEventListener('beforeunload', _revogarTokenQuiz);
  window.addEventListener('pagehide',     _revogarTokenQuiz);
}


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

  return discInfo || lista[0] || { id: disc, nome: disc, arquivo: disc, emoji: '📚' };
}


/* ══════════════════════════════════════════════════════════
   PASSO 3 — Aplicar tema visual
   Síncrono — executado antes do DOMContentLoaded para evitar FOUC
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
   PASSO 4 — Montar componentes visuais do template
   ══════════════════════════════════════════════════════════ */

function _atualizarTextos(info, modoConfig, semestre) {
  setText('disc-emoji',    info.emoji);
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

  var moved = { fab: false, music: false, sfx: false };

  var observer = new MutationObserver(function () {
    if (!moved.music) {
      var music = document.getElementById('music-btn-global');
      if (music) { nav.appendChild(music); moved.music = true; }
    }
    if (!moved.sfx) {
      var sfx = document.querySelector('.abtn');
      if (sfx) { nav.appendChild(sfx); moved.sfx = true; }
    }
    if (!moved.fab) {
      var fab = document.getElementById('nexus-fab');
      if (fab) { nav.appendChild(fab); moved.fab = true; }
    }
    if (moved.fab && moved.music && moved.sfx) observer.disconnect();
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

function _carregarQuiz(params, info) {
  var contentSrc = _resolverCaminhoConteudo(params.semestre, info.arquivo);
  var uiSrc      = '../js/quiz_ui.js';
  var engineSrc  = '../js/quiz_engine.js';

  Promise.all([
    _loadScript(contentSrc, document.head).catch(function () {
      console.warn('[template_init] Conteúdo não encontrado:', contentSrc);
      window.questoes = window.questoes || { ava: [], questoes: [], fixacao: [], enade: [] };
    }),
    _loadScript(uiSrc, document.head),
  ])
    .then(function () { _loadScript(engineSrc, document.body); })
    .catch(function (err) {
      console.error('[template_init] Falha ao carregar UI do quiz:', err);
    });
}


/* ══════════════════════════════════════════════════════════
   EXPOSIÇÃO PARA SCRIPTS CLÁSSICOS
   ══════════════════════════════════════════════════════════ */

function _exponerGlobais() {
  window.NexusStorage  = Storage;
  window.NexusFirebase = { salvarRespostasQuiz, carregarRespostasQuiz, limparRespostasQuiz };
  window.__nexusPlaySound = playSound;
}


/* ══════════════════════════════════════════════════════════
   EXPOSIÇÃO DE CONTEXTO PARA O ENGINE
   ══════════════════════════════════════════════════════════ */

function _exponerContextoQuiz(params) {
  window.__NEXUS_QUIZ_DISC__     = params.disc;
  window.__NEXUS_QUIZ_MODO__     = params.modo;
  window.__NEXUS_QUIZ_SEMESTRE__ = params.semestre;
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
       0. Declara contexto de IA (nexus_ctx + dirty) ← NOVO v9.1
       1. Lê parâmetros da URL
       2. Resolve disciplina
       3. Aplica tema (evita FOUC)
       4. Declara domínio quiz em __NEXUS_CONTEXT__ (merge seguro)
       5. Gera token de sessão de quiz
       6. Expõe globais e contexto do quiz
       7. Atualiza estado global

     [assíncrono, após DOMContentLoaded]
       8.  Monta componentes visuais
       9.  Injeta nav-float
       10. Inicializa áudio

     [assíncrono, paralelo, sem bloquear DOM]
       11. Autoriza NexusSearch (polling até módulo estar pronto)
       12. Notifica disciplina no chat
       13. Instala revogação do token em beforeunload / pagehide
       14. Aguarda Firebase (máx 3s)
       15. Carrega conteúdo + UI + engine
   ══════════════════════════════════════════════════════════ */

var _params     = _lerParams();
var _info       = _resolverDisciplina(_params.disc, _params.semestre);
var _modoConfig = MODOS_CONFIG[_params.modo] || MODOS_CONFIG.questoes;

_aplicarTema(_info.arquivo);

/* Declara domínio de IA: quiz */
if (typeof window.__NEXUS_CONTEXT__ === 'undefined') {
  window.__NEXUS_CONTEXT__ = { tipos: [] };
}
if (!Array.isArray(window.__NEXUS_CONTEXT__.tipos)) {
  window.__NEXUS_CONTEXT__.tipos = [];
}
if (window.__NEXUS_CONTEXT__.tipos.indexOf('quiz') === -1) {
  window.__NEXUS_CONTEXT__.tipos.push('quiz');
}

/* QUIZ-ISOLATION: gera o token ANTES de expor qualquer contexto de quiz */
var _quizToken = _gerarTokenQuiz();

_exponerGlobais();
_exponerContextoQuiz(_params);
_atualizarEstadoGlobal(_params);

/* QUIZ-ISOLATION: autoriza o NexusSearch assim que ele estiver disponível */
_autorizarQuizNoSearch(_quizToken);

/* CHAT: seleciona automaticamente a disciplina no chat */
_notificarDiscNoChat(_params.disc);

/* QUIZ-ISOLATION: instala revogação automática ao sair da página */
_instalarRevogacao();

document.addEventListener('DOMContentLoaded', function () {
  _montarVisual(_params, _info, _modoConfig);
  _injetarNavFloat();
  _inicializarAudio();
});

_aguardarFirebase(_params);
_carregarQuiz(_params, _info);