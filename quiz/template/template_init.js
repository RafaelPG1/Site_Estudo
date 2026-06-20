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

  var moved = { music: false, sfx: false, ia: false };

  var observer = new MutationObserver(function () {
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
    if (moved.music && moved.sfx && moved.ia) observer.disconnect();
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
   PASSO 10 — Inicializar Quiz-Assistant

   Aguarda o engine terminar de montar __NEXUS_QUESTOES_VISUAIS__
   antes de iniciar o assistente, com polling leve (máx 3s).

   Ordem de dependências exigidas:
     - window.NexusUI         (core/ui.js)
     - window.NexusHistory    (core/history.js)
     - window.NexusWorker     (core/worker.js)
     - window.NexusTextUtils  (core/text-utils.js)
     - window.NexusQuizAssistant (quiz/quiz_assistant.js)
     - window.__NEXUS_QUIZ_DISC__
     - window.__NEXUS_QUIZ_MODO__
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
  if (!_depsAssistantPresentes()) {
    console.warn('[template_init] Quiz-Assistant: dependências ausentes — não inicializado.');
    return;
  }

  // Aguarda __NEXUS_QUESTOES_VISUAIS__ (populado pelo engine após renderizar)
  var tentativas = 0;
  var MAX        = 60;  // 60 × 50ms = 3s

  var timer = setInterval(function () {
    tentativas++;

    var visuais = window.__NEXUS_QUESTOES_VISUAIS__;
    var prontas = Array.isArray(visuais) && visuais.length > 0;

    if (prontas || tentativas >= MAX) {
      clearInterval(timer);

      if (!prontas) {
        console.warn('[template_init] Quiz-Assistant: __NEXUS_QUESTOES_VISUAIS__ não disponível após 3s — iniciando sem mapa visual.');
      }

      window.NexusQuizAssistant.init();
    }
  }, 50);
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
       11. Carrega conteúdo + UI + engine   ← só após modal decidir
       12. Inicializa Quiz-Assistant (após engine montar questões)

   IMPORTANTE: _carregarQuiz NÃO é chamado aqui.
   É exposto via window.__nexusCarregarQuiz e chamado
   pelo quiz_starter_modal.js após a decisão do fluxo.
   Isso garante que o engine nunca carrega antes do modal.
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

/* Expõe o carregador para o modal chamar no momento certo.
   O modal detecta progresso, decide o fluxo, e só então
   chama esta função — evitando qualquer render antecipado. */
window.__nexusCarregarQuiz = function () {
  _aguardarFirebase(_params);
  _carregarQuiz(_params, _info);
};