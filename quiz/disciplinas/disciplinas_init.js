// @ts-nocheck
/* ============================================================
   NEXUS STUDY — quiz/disciplinas/disciplinas_init.js  v6.2

   RESPONSABILIDADES (e apenas estas):
     1. Declarar contexto ativo antes de carregar a IA  (NOVO v6.2)
     2. Resolver o semestre da URL                      (navegação)
     3. Propagar ?sem= nos hrefs dos cards              (navegação)
     4. Exibir badge de semestre no header              (visual)
     5. Aplicar cores da disciplina                     (visual)
     6. Injetar logo                                    (visual)
     7. Inicializar áudio e eventos nos cards           (UX)
     8. Buscar catalog.json e marcar cards              (UX)
        sem conteúdo como disc-card--vazio

   MUDANÇAS v6.2 — RESET DE CONTEXTO:
     + _declararContexto() grava nexus_ctx + nexus_ctx_dirty antes
       de qualquer módulo de IA carregar.
     + Removido: setInterval de limpeza de UI (era race condition).
     + Removido: chamada avulsa NexusWorker.limparHistorico() no .then().
     + worker.js e assistant.js cuidam do próprio reset via NexusCtx.

   PROIBIÇÕES ABSOLUTAS:
     ✗ Carregar ques_*.js
     ✗ Criar elementos <script> dinamicamente (exceto via _load interno)
     ✗ Ler window.questoes
     ✗ Montar caminhos de conteúdo de quiz
     ✗ Conhecer template_init.js ou quiz_engine.js
     ✗ Verificar arrays de questões
     ✗ Decidir o que o template deve fazer
     ✗ Chamar NexusWorker.limparHistorico() diretamente
     ✗ Fazer polling de NexusUI para limpeza
   ============================================================ */

import { DISC_CORES }          from '../../shared/js/themes/cores.js';
import { aplicarCoresDisciplina } from '../../shared/js/themes/theme.js';
import { injetarLogo }            from '../../shared/js/utils/logo.js';
import {
  resolverSemestreDeURL,
  sincronizarSemNaURL,
  propagarSemNosLinks,
} from '../../shared/js/utils/url.js';
import {
  Sound,
  audio,
  installAudioRecovery,
  playSound,
} from '../../shared/js/audio/audio-api.js';


/* ══════════════════════════════════════════════════════════
   PASSO 0 — Declarar contexto de IA ANTES de _carregarIA()

   Grava nexus_ctx e nexus_ctx_dirty no sessionStorage de forma
   síncrona. worker.js e assistant.js leem essa flag no próprio
   boot para decidir se restauram ou descartam o histórico.

   Não depende de window.NexusCtx estar carregado: usa
   sessionStorage diretamente com a mesma lógica de ctx.js,
   para garantir execução 100% síncrona antes de qualquer _load.
   ══════════════════════════════════════════════════════════ */
(function _declararContexto() {
  try {
    var STORAGE_KEY = 'nexus_ctx';
    var DIRTY_KEY   = 'nexus_ctx_dirty';

    /* Disciplina = nome do arquivo HTML sem extensão */
    var disc = '';
    try { disc = location.pathname.split('/').pop().replace('.html', '') || ''; } catch (_) {}

    /* Semestre da URL */
    var sem = '';
    try { sem = (new URLSearchParams(location.search).get('sem') || '').toUpperCase(); } catch (_) {}

    var novoCtx = { disc: disc, modo: '', sem: sem, pagina: 'disciplinas' };

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
  } catch (_) { /* ctx não é essencial para o fluxo visual */ }
}());


/* ══════════════════════════════════════════════════════════
   ASSISTENTE NEXUS — carregamento em background
   ══════════════════════════════════════════════════════════ */
(function _carregarIA() {
  try {
    var raiz = new URL('../../', import.meta.url).href.replace(/\/$/, '');
    var BASE = raiz + '/shared/js/ia/';

    function _load(src) {
      return new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = res;
        s.onerror = function () { rej(new Error(src)); };
        document.body.appendChild(s);
      });
    }

    Promise.all([
      _load(BASE + 'core/ctx.js'),        // ← NOVO: deve ser o primeiro
      _load(BASE + 'core/context.js'),
      _load(BASE + 'core/text-utils.js'),
      _load(BASE + 'core/loader.js'),
      _load(BASE + 'core/worker.js'),     // lê dirty no boot síncrono
      _load(BASE + 'core/ui.js'),
      _load(BASE + 'resumo/search.js'),
    ])
    .then(function () {
      /* ctx.js e worker.js já agiram.
         assistant.js vai ler dirty em initUI() e confirmar reset. */
      return _load(BASE + 'resumo/assistant.js');
    })
    .then(function () { return _load(BASE + 'init.js'); })
    .catch(function (err) {
      console.warn('[disciplinas_init] IA não carregada:', err.message);
    });
  } catch (_) { /* IA não é essencial */ }
}());


/* ══════════════════════════════════════════════════════════
   PASSO 1 — Resolver ID da disciplina a partir da URL
   ══════════════════════════════════════════════════════════ */
var _discId = 'desconhecida';
try {
  _discId = location.pathname.split('/').pop().replace('.html', '') || 'desconhecida';
} catch (_) {}


/* ══════════════════════════════════════════════════════════
   PASSO 2 — Aplicar cores da disciplina (síncrono, evita FOUC)
   ══════════════════════════════════════════════════════════ */
try {
  if (DISC_CORES && DISC_CORES[_discId]) {
    aplicarCoresDisciplina(_discId, DISC_CORES);
  }
} catch (e) {
  console.warn('[disciplinas_init] Cores não aplicadas:', e.message);
}


/* ══════════════════════════════════════════════════════════
   PASSO 3 — Resolver semestre

   Prioridade:
     1. URLSearchParams direto (nunca rejeita formatos como "2026.1-AP2")
     2. resolverSemestreDeURL() como fallback
   ══════════════════════════════════════════════════════════ */
var _sem = '';
try {
  var _rawSem = new URLSearchParams(location.search).get('sem') || '';
  /* Normaliza casing do AP: "2026.1-ap2" → "2026.1-AP2" */
  _sem = _rawSem.replace(/-(.+)$/, function (_, ap) { return '-' + ap.toUpperCase(); });
} catch (_) {}

if (!_sem) {
  try { _sem = resolverSemestreDeURL() || ''; } catch (_) {}
}

/* Sincroniza na URL sem adicionar entrada no histórico */
try {
  if (_sem) sincronizarSemNaURL(_sem);
} catch (_) {}


/* ══════════════════════════════════════════════════════════
   PASSO 4 — Propagar ?sem= nos hrefs dos cards e back-btn
   ══════════════════════════════════════════════════════════ */
try {
  propagarSemNosLinks(_sem, [
    'a[href*="template.html"]',
    '.disc-card[href]',
  ]);
} catch (_) {}

/* Fallback manual — garante que todos os links .disc-card recebam ?sem= */
if (_sem) {
  try {
    document.querySelectorAll('a.disc-card, a[href*="template.html"]').forEach(function (link) {
      try {
        var url = new URL(link.href, location.href);
        url.searchParams.set('sem', _sem);
        link.href = url.toString();
      } catch (_) {}
    });
  } catch (_) {}
}

/* Badge de semestre no header */
try {
  var _badge = document.getElementById('header-sem-badge');
  if (_badge) _badge.textContent = _sem || '—';
} catch (_) {}


/* ══════════════════════════════════════════════════════════
   PASSO 5 — Logo, áudio e eventos (após DOMContentLoaded)
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  /* Logo */
  try { injetarLogo('#header-logo-wrap'); } catch (e) {
    console.warn('[disciplinas_init] Logo não injetada:', e.message);
  }

  /* Áudio */
  try {
    Sound.init();
    installAudioRecovery({ Sound, audio });
  } catch (e) {
    console.warn('[disciplinas_init] Áudio não iniciado:', e.message);
  }

  /* Eventos de hover e click nos cards */
  try {
    var backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        try { playSound('click', 'quiz'); } catch (_) {}
      });
    }

    document.querySelectorAll('.disc-card').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        try { playSound('hover', 'quiz'); } catch (_) {}
      });
      card.addEventListener('click', function () {
        try { playSound('click', 'quiz'); } catch (_) {}
      });
    });
  } catch (_) {}

  /* Áudio pronto em background */
  try { Sound.waitUntilReady().catch(function () {}); } catch (_) {}

  /* Footer: ano atual */
  try {
    var yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  } catch (_) {}

});


/* ══════════════════════════════════════════════════════════
   PASSO 6 — Verificar disponibilidade via catalog.json

   Fluxo:
     1. Usa o semestre completo como chave do catalog
        (ex: "2026.1-AP1", "2026.1-AP2" — sem extração de período base)
     2. Faz fetch de ./catalog.json (mesma pasta do disciplinas_init.js)
     3. Lê catalog[_sem][discId]
     4. Para cada card com data-modo, aplica disc-card--vazio
        se o modo estiver ausente ou false no catalog

   Garantias:
     - Nunca remove cards do DOM
     - Se o fetch falhar, nenhum card é desabilitado
       (preferimos falso-positivo a esconder conteúdo válido)
     - Assíncrono: não bloqueia a exibição dos cards
   ══════════════════════════════════════════════════════════ */
(function _aplicarDisponibilidade() {

  if (!_sem || !_discId || _discId === 'desconhecida') return;

  /* Caminho do catalog relativo à raiz do projeto */
  var _catalogUrl = new URL('./catalog.json', import.meta.url).href;

  fetch(_catalogUrl)
    .then(function (res) {
      if (!res.ok) throw new Error('catalog.json retornou HTTP ' + res.status);
      return res.json();
    })
    .then(function (catalog) {
      var semesterEntry = catalog[_sem];
      if (!semesterEntry) {
        console.info(
          '[disciplinas_init] Semestre "' + _sem + '" não encontrado no catalog.json.' +
          ' Nenhum card será desabilitado.'
        );
        try { document.documentElement.removeAttribute('data-catalog-loading'); } catch (_) {}
        return;
      }

      var discEntry = semesterEntry[_discId];
      if (!discEntry) {
        console.info(
          '[disciplinas_init] Disciplina "' + _discId + '" não encontrada em "' + _sem + '"' +
          ' no catalog.json. Nenhum card será desabilitado.'
        );
        try { document.documentElement.removeAttribute('data-catalog-loading'); } catch (_) {}
        return;
      }

      document.querySelectorAll('.disc-card[data-modo]').forEach(function (card) {
        var modo = card.dataset.modo;
        var disponivel = discEntry[modo] === true;

        if (!disponivel) {
          card.classList.add('disc-card--vazio');
          card.setAttribute('aria-disabled', 'true');
          card.setAttribute('tabindex', '-1');
        }
      });
    })
    .catch(function (err) {
      console.warn('[disciplinas_init] Falha ao carregar catalog.json:', err.message);
    })
    .finally(function () {
      try { document.documentElement.removeAttribute('data-catalog-loading'); } catch (_) {}
    });
}());