// @ts-nocheck
/* ============================================================
   NEXUS STUDY — quiz/disciplinas/disciplinas_init.js  v7.2

   RESPONSABILIDADES (e apenas estas):
     1. Resolver o semestre da URL                      (navegação)
     2. Propagar ?sem= nos hrefs dos cards              (navegação)
     3. Exibir badge de semestre no header              (visual)
     4. Aplicar cores da disciplina                     (visual)
     5. Injetar logo                                    (visual)
     6. Inicializar áudio e eventos nos cards           (UX)
     7. Buscar catalog.json e marcar cards              (UX)
        sem conteúdo como disc-card--vazio
     8. Expor contexto de leitura (disciplina/semestre/
        catalog) em window, para a IA consumir          (contexto)
     9. Inicializar a IA (Nexus Assistente)             (IA)

   MUDANÇAS v7.2 — INICIALIZAÇÃO DA IA:
     - Adicionado _inicializarIA() no Passo 9.
     - Mesmo padrão de quiz.js/_carregarIA(): carrega as
       dependências via <script> em sequência e chama
       NexusAssistant.initUI() + NexusAssistant.init().
     - Os HTMLs das disciplinas NÃO devem mais carregar
       fab.js diretamente — esta função assume essa
       responsabilidade. ui.js faz getElementById('nexus-fab')
       || _criarFAB(), portanto o FAB aparece no momento certo
       independentemente de quem chega primeiro.
     - O contexto da disciplina já está disponível em
       window.__NEXUS_CONTEXT__ (Passo 4.5) quando a IA inicia.

   MUDANÇAS v7.0 — REMOÇÃO DO ASSISTENTE NEXUS IA:
     - Removido por completo o bootstrap do assistente de chat
       (ctx.js, context.js, text-utils.js, loader.js, worker.js,
       ui.js, resumo/search.js, resumo/assistant.js, init.js).
     - Removida a declaração de contexto em sessionStorage
       (nexus_ctx / nexus_ctx_dirty), que existia exclusivamente
       para o assistente restaurar/descartar histórico de chat.

   PATCH v7.1 — EXPOSIÇÃO DE CONTEXTO (SEM CARREGAR IA):
     - Reintroduzido window.__NEXUS_CONTEXT__ e três funções de
       leitura (getDisciplinaAtual, getSemestreAtual,
       getConteudoIndex), todas retornando dados que este
       arquivo já calculava (_discId, _sem, discEntry do
       catalog.json). Nenhum script novo é carregado, nenhum
       elemento <script> é criado dinamicamente, nenhuma
       inicialização de IA acontece aqui.

   REVERSÃO (este arquivo NÃO bloqueia .disc-card):
     - Nenhuma lógica de login/bloqueio visual é aplicada aos
       cards de disciplina. Este arquivo permanece restrito às
       responsabilidades listadas acima. O bloqueio por login
       é exclusivo do botão da IA (ui.js / ia.css) e não deve
       ser estendido a nenhum outro componente desta página.

   PROIBIÇÕES ABSOLUTAS (mantidas):
     ✗ Carregar ques_*.js
     ✗ Criar elementos <script> dinamicamente fora do Passo 9
     ✗ Ler window.questoes
     ✗ Montar caminhos de conteúdo de quiz
     ✗ Conhecer template_init.js ou quiz_engine.js
     ✗ Verificar arrays de questões
     ✗ Decidir o que o template deve fazer
     ✗ Aplicar qualquer classe de bloqueio (login) nos
       .disc-card — isso NÃO é responsabilidade deste arquivo
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
   PASSO 4.5 — Contexto para a IA (Resumo)

   Apenas EXPÕE leitura de dados já calculados nos passos
   anteriores (_discId, _sem). Não carrega nenhum script, não
   instancia nenhum assistente, não cria <script> dinâmico.

   _catalogDiscEntry começa null e é preenchido (se existir)
   pelo Passo 6, quando o catalog.json responder — getConteudoIndex()
   reflete esse valor por closure, sem necessidade de re-sincronizar
   window.__NEXUS_CONTEXT__ manualmente.
   ══════════════════════════════════════════════════════════ */
var _catalogDiscEntry = null;

window.__NEXUS_CONTEXT__ = {
  tipos: ['resumo'],
  disciplinaAtiva: _discId,
  semestre: _sem,
};

function getDisciplinaAtual() { return _discId; }
function getSemestreAtual()   { return _sem; }
function getConteudoIndex()   { return _catalogDiscEntry; }

window.getDisciplinaAtual = getDisciplinaAtual;
window.getSemestreAtual   = getSemestreAtual;
window.getConteudoIndex   = getConteudoIndex;


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
     5. Guarda o discEntry em _catalogDiscEntry, para que
        getConteudoIndex() possa retorná-lo

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

      /* Disponibiliza o discEntry para getConteudoIndex() */
      _catalogDiscEntry = discEntry;

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


/* ══════════════════════════════════════════════════════════
   PASSO 9 — Inicializar a IA (Nexus Assistente)

   Mesmo padrão de quiz.js/_carregarIA():
     • Carrega dependências em sequência via <script>
     • NexusAssistant.initUI() cria o painel/FAB se ainda não existir
     • NexusAssistant.init() registra o contexto da disciplina atual
       usando window.__NEXUS_CONTEXT__ já exposto no Passo 4.5

   Integração com fab.js:
     • Os HTMLs das disciplinas NÃO devem mais carregar fab.js.
     • ui.js faz getElementById('nexus-fab') || _criarFAB(),
       portanto o FAB aparece no momento certo independentemente
       de quem chega primeiro.

   Garantias:
     • Não bloqueia renderização (aguarda DOMContentLoaded)
     • Se algum script falhar, apenas loga — não quebra a página
     • Não cria nenhum sistema paralelo — reutiliza integralmente
       a cadeia ui.js → NexusAssistant já usada pelo quiz.js
   ══════════════════════════════════════════════════════════ */
(function _inicializarIA() {

  function _loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) { resolve(); return; }
      var s = document.createElement('script');
      s.src     = src;
      s.onload  = resolve;
      s.onerror = function () { reject(new Error('[Nexus IA] Falha: ' + src)); };
      document.body.appendChild(s);
    });
  }

  /* Caminho relativo ao próprio disciplinas_init.js:
       quiz/disciplinas/disciplinas_init.js
       → ../../shared/js/ia/
       → shared/js/ia/
     Idêntico ao BASE usado em quiz.js ('../../shared/js/ia/' a partir de quiz/). */
  var BASE = new URL('../../shared/js/ia/', import.meta.url).href;

  var deps = [
    BASE + 'core/context.js',
    BASE + 'core/text-utils.js',
    BASE + 'core/history.js',
    BASE + 'core/loader.js',
    BASE + 'core/worker.js',
    BASE + 'core/ui.js',
    BASE + 'resumo/search.js',
  ];

  document.addEventListener('DOMContentLoaded', function () {
    Promise.all(deps.map(_loadScript))
      .then(function () { return _loadScript(BASE + 'resumo/assistant.js'); })
      .then(function () {
        if (window.NexusAssistant) {
          window.NexusAssistant.initUI();
          window.NexusAssistant.init();
        }
      })
      .catch(function (err) {
        console.error('[disciplinas_init] Falha ao carregar IA:', err);
      });
  }, { once: true });

}());