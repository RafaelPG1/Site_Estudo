// @ts-nocheck
/* ============================================================
   NEXUS STUDY — quiz/template/template_init.js  v9.0

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

   v9.0 — QUIZ-ISOLATION:
     + Gera token de sessão de quiz              _gerarTokenQuiz()
     + Registra token em NexusSearch             _autorizarQuizNoSearch()
     + Revoga token ao sair da página            _instalarRevogacao()
     Sem token ativo: NexusSearch, ia.js e ia-worker.js recusam
     qualquer acesso a questões, gabaritos, feedbacks e alternativas.

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
   ASSISTENTE NEXUS
   Carregamento em background — sem impacto no fluxo principal
   ══════════════════════════════════════════════════════════ */

(function _carregarIA() {
  var raiz = new URL('../../', import.meta.url).href.replace(/\/$/, '');

  function _load(src) {
    return new Promise(function (res, rej) {
      var s    = document.createElement('script');
      s.src    = src;
      s.onload = res;
      s.onerror = function () { rej(new Error('[Nexus IA] Falha: ' + src)); };
      document.body.appendChild(s);
    });
  }

  Promise.all([
    _load(raiz + '/shared/js/ia/ia-ui.js'),
    _load(raiz + '/shared/js/ia/ia-search.js'),
    _load(raiz + '/shared/js/ia/ia-loader.js'),
    _load(raiz + '/shared/js/ia/ia-worker.js'),
  ])
    .then(function () { return _load(raiz + '/shared/js/ia/ia.js'); })
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
 *
 * O token é armazenado em window.__NEXUS_QUIZ_TOKEN__ e lido por
 * NexusSearch, ia.js e ia-worker.js para autorizar operações de quiz.
 *
 * @returns {string} token gerado
 */
function _gerarTokenQuiz() {
  var token;
  try {
    token = crypto.randomUUID();
  } catch (e) {
    // Fallback para ambientes sem crypto.randomUUID (Safari < 15.4)
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
 * Registra o token em NexusSearch assim que o módulo estiver disponível.
 * Como ia-search.js é carregado em background (_carregarIA), usamos polling
 * com intervalo curto. Máximo de 30 tentativas (≈ 3s).
 *
 * @param {string} token
 */
function _autorizarQuizNoSearch(token) {
  var tentativas = 0;
  var MAX_TENTATIVAS = 30;

  var intervalo = setInterval(function () {
    tentativas++;

    if (typeof window.NexusSearch !== 'undefined' && window.NexusSearch.autorizarQuiz) {
      clearInterval(intervalo);
      window.NexusSearch.autorizarQuiz(token);
      console.log('[template_init] NexusSearch autorizado para quiz.');
      return;
    }

    if (tentativas >= MAX_TENTATIVAS) {
      clearInterval(intervalo);
      console.warn('[template_init] NexusSearch não disponível após ' + MAX_TENTATIVAS + ' tentativas — quiz não autorizado.');
    }
  }, 100);
}

/**
 * Instala os listeners que revogam o token ao sair da página.
 *
 * Usa beforeunload + pagehide (Mobile Safari não dispara beforeunload
 * de forma confiável). Ambos chamam _revogarTokenQuiz() que zera
 * window.__NEXUS_QUIZ_TOKEN__ e limpa o índice de quiz no NexusSearch.
 */
function _instalarRevogacao() {

  function _revogarTokenQuiz() {
    console.log('[template_init] revogando token de quiz...');

    // Remove a flag de modo (impede que ia.js reutilize o contexto)
    try { delete window.__NEXUS_QUIZ_MODO__; } catch (e) {}
    try { delete window.__NEXUS_QUIZ_SEMESTRE__; } catch (e) {}
    try { delete window.__NEXUS_QUIZ_DISC__; } catch (e) {}
    try { delete window.__NEXUS_QUESTOES_VISUAIS__; } catch (e) {}

    // Revoga o token no NexusSearch (zera _indiceQuiz internamente)
    if (typeof window.NexusSearch !== 'undefined' && window.NexusSearch.revogarQuiz) {
      window.NexusSearch.revogarQuiz();
    }

    // Remove o token do window — qualquer verificação posterior retorna null
    try { delete window.__NEXUS_QUIZ_TOKEN__; } catch (e) {}

    // Limpa o histórico do worker para não vazar contexto de quiz em
    // perguntas feitas logo após a saída do template
    if (typeof window.NexusWorker !== 'undefined' && window.NexusWorker.limparHistorico) {
      window.NexusWorker.limparHistorico();
    }

    // Zera window.questoes (dados do ques_*.js) para não deixar rastro
    // acessível via console ou outros scripts que leiam window diretamente
    try { window.questoes = null; } catch (e) {}
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
  /* Normaliza casing do AP: "2026.1-ap2" → "2026.1-AP2" */
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

  /* data-* no body para quiz_ui.js */
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
    _criarBotaoNav('btn-up',            'Ir ao topo',               'fas fa-arrow-up')    +
    _criarBotaoNav('btn-left',          'Voltar',                   'fas fa-rotate-left') +
    _criarBotaoNav('btn-down',          'Ir ao final',              'fas fa-arrow-down')  +
    '<div class="nav-divider" aria-hidden="true"></div>'                                  +
    _criarBotaoNav('restartButton',     'Reiniciar',                'fas fa-rotate-right')+
    _criarBotaoNav('revealButton',      'Revelar respostas',        'fas fa-eye')         +
    '<div class="nav-divider" aria-hidden="true"></div>'                                  +
    '<button id="btn-toggle-modo" class="nav-btn btn-toggle-modo" title="Modo Step (uma questão por vez)" type="button">' +
      '<i class="fas fa-layer-group" aria-hidden="true"></i></button>'                    +
    '<div class="nav-divider" aria-hidden="true"></div>'                                  +
    '<button id="btn-filtro-aulas" class="nav-btn btn-filtro-aulas" title="Filtrar aulas" type="button">' +
      '<i class="fas fa-filter" aria-hidden="true"></i></button>'                         +
    '<div class="nav-divider" aria-hidden="true"></div>'                                  +
    '<button id="btn-legenda" class="nav-btn btn-legenda" title="Informações" type="button">' +
      '<i class="fas fa-circle-info" aria-hidden="true"></i></button>';

  document.body.appendChild(nav);
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

  /* Conteúdo e UI em paralelo — engine só após ambos */
  Promise.all([
    _loadScript(contentSrc, document.head).catch(function () {
      console.warn('[template_init] Conteúdo não encontrado:', contentSrc);
      /* Fornece estrutura vazia — engine exibe mensagem de "sem conteúdo" */
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
   quiz_engine.js e quiz_ui.js são scripts não-módulo —
   precisam acessar Storage, Firebase e playSound via window
   ══════════════════════════════════════════════════════════ */

function _exponerGlobais() {
  window.NexusStorage  = Storage;
  window.NexusFirebase = { salvarRespostasQuiz, carregarRespostasQuiz, limparRespostasQuiz };
  window.__nexusPlaySound = playSound;
}


/* ══════════════════════════════════════════════════════════
   EXPOSIÇÃO DE CONTEXTO PARA O ENGINE
   quiz_engine.js lê esses valores via window no momento
   em que é carregado — devem estar prontos antes disso
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
       1. Lê parâmetros da URL
       2. Resolve disciplina
       3. Aplica tema (evita FOUC)
       4. Gera token de sessão de quiz          ← NOVO v9.0
       5. Expõe globais e contexto do quiz
       6. Atualiza estado global

     [assíncrono, após DOMContentLoaded]
       7. Monta componentes visuais
       8. Injeta nav-float
       9. Inicializa áudio

     [assíncrono, paralelo, sem bloquear DOM]
      10. Autoriza NexusSearch (polling até modulo estar pronto) ← NOVO v9.0
      11. Instala revogação do token em beforeunload / pagehide  ← NOVO v9.0
      12. Aguarda Firebase (máx 3s)
      13. Carrega conteúdo + UI + engine
   ══════════════════════════════════════════════════════════ */

var _params     = _lerParams();
var _info       = _resolverDisciplina(_params.disc, _params.semestre);
var _modoConfig = MODOS_CONFIG[_params.modo] || MODOS_CONFIG.questoes;

_aplicarTema(_info.arquivo);

/* QUIZ-ISOLATION: gera o token ANTES de expor qualquer contexto de quiz */
var _quizToken = _gerarTokenQuiz();

_exponerGlobais();
_exponerContextoQuiz(_params);
_atualizarEstadoGlobal(_params);

/* QUIZ-ISOLATION: autoriza o NexusSearch assim que ele estiver disponível */
_autorizarQuizNoSearch(_quizToken);

/* QUIZ-ISOLATION: instala revogação automática ao sair da página */
_instalarRevogacao();

document.addEventListener('DOMContentLoaded', function () {
  _montarVisual(_params, _info, _modoConfig);
  _injetarNavFloat();
  _inicializarAudio();
});

_aguardarFirebase(_params);
_carregarQuiz(_params, _info);