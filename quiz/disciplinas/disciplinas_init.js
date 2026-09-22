// @ts-nocheck
/* ============================================================
   NEXUS STUDY — quiz/disciplinas/disciplinas_init.js  v7.4

   RESPONSABILIDADES (e apenas estas):
     1. Resolver o semestre da URL                      (navegação)
     2. Propagar ?sem= nos hrefs dos cards              (navegação)
     3. Exibir badge de semestre no header              (visual)
     4. Aplicar cores da disciplina                     (visual)
     5. Resolver ícone + nome da disciplina a partir de
        _DISCIPLINAS (global.js) e aplicar no header     (visual)
     6. Aplicar os ícones SVG dos MODOS de estudo (AVA,
        Questões, ENADE, Fixação) — centralizados aqui,
        não são dados de disciplina                      (visual)
     7. Injetar logo, inicializar áudio e eventos
        nos cards                                        (visual/UX)
     8. Buscar catalog.json e marcar cards              (UX)
        sem conteúdo como disc-card--vazio
     9. Inicializar a IA (Nexus Assistente)             (IA)

     (contexto de leitura para a IA — disciplina/semestre/
      catalog — é exposto em window como Passo 4.5, antes
      do DOMContentLoaded)

   MUDANÇAS v7.4 — ÍCONES SVG DOS MODOS DE ESTUDO
   (SUBSTITUINDO OS EMOJIS FIXOS DA v7.3):

     Problema: os emojis de cada modo (📚/❓/🏛️/📌) eram texto
     simples aplicado via textContent. Isso funcionava, mas
     destoava visualmente do restante do produto, que já usa
     ícones SVG em outline (mesmo padrão do ícone de disciplina
     resolvido via resolveIcone() em global.js).

     Solução:
       • `_EMOJIS_MODO` foi substituído por `_ICONES_MODO`, um
         dicionário de SVGs inline (outline, stroke="currentColor",
         mesmo padrão visual dos ícones de disciplina).
       • `_aplicarEmojisModo()` foi substituído por
         `_aplicarIconesModo()`, que injeta o SVG via innerHTML
         (em vez de textContent) no mesmo `<span>` que cada card
         já possui dentro de `.disc-card__icon-wrap`.
       • Uma regra CSS mínima (`_injetarEstiloIconeModo`) garante
         que o SVG herde tamanho (1em) e cor (currentColor) do
         elemento pai, sem tocar em nenhum CSS do projeto — mesmo
         padrão já usado para o ícone de disciplina no Passo 5.

     Fonte única: para trocar o ícone de um modo em todas as
     páginas de todas as disciplinas, basta editar o SVG
     correspondente em `_ICONES_MODO`, aqui. Os HTMLs continuam
     declarando apenas `<span></span>` vazio dentro de
     `.disc-card__icon-wrap` — nenhum SVG/emoji fica fixo nos
     arquivos HTML.

   MUDANÇAS v7.3 — CENTRALIZAÇÃO DE ÍCONE/NOME DE DISCIPLINA
   (ANTES FIXOS NOS HTMLs):

     Problema: cada HTML de disciplina (banco_dados.html,
     poo.html, analise_projeto.html etc.) foi criado copiando
     a mesma estrutura e fixando manualmente o emoji/nome da
     disciplina no eyebrow do header, e o emoji de cada modo
     (AVA/Questões/ENADE/Fixação) em cada card. Trocar um
     ícone/emoji exigia editar dezenas de arquivos HTML.

     Solução:
       • Ícone + nome da disciplina — passam a vir de
         _DISCIPLINAS (fonte única já existente em global.js).
         Este arquivo resolve o registro da disciplina atual
         via getDisciplinasDeSemestre(_sem) e injeta:
           #disc-emoji → resolveIcone(discInfo.icone)  (SVG)
           #disc-nome  → discInfo.nome                 (texto)
         Os HTMLs só precisam declarar os elementos vazios
         (<span id="disc-emoji">, <span id="disc-nome">) —
         nenhum dado de disciplina fica fixo no HTML.

     Nenhum dado é duplicado: a fonte de disciplina continua
     sendo exclusivamente _DISCIPLINAS (global.js); este
     arquivo apenas lê e aplica no DOM.

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

import { getDisciplinasDeSemestre, resolveIcone } from '../../src/global.js';
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

/* NAVIGATION ANALYTICS — importa o tracker para garantir que
   window.__nexusPageEnter seja registrado nesta página.
   O tracker inicializa automaticamente via auto-boot interno. */
import '../../src/session-tracker.js';


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
   PASSO 3.5 — Resolver registro completo da disciplina
   (ícone + nome), a partir da fonte única _DISCIPLINAS
   em global.js

   Por que aqui (e não em cada HTML):
     _discId (Passo 1) e _sem (Passo 3) já identificam qual
     disciplina/semestre estamos exibindo. getDisciplinasDeSemestre()
     retorna a lista de disciplinas cadastradas em global.js para
     esse semestre — este passo apenas localiza, dentro dela, a
     entrada cujo `id` ou `arquivo` corresponde a _discId.

     Nenhum dado novo é criado: nome, apelido e ícone continuam
     vindo exclusivamente de _DISCIPLINAS (global.js). Se a
     disciplina não for encontrada (ex.: HTML "solto", sem
     entrada correspondente ainda cadastrada), cai em um fallback
     visual mínimo — mesma chave de ícone padrão que resolveIcone()
     já assume quando nenhuma chave é reconhecida.
   ══════════════════════════════════════════════════════════ */
function _resolverInfoDisciplina(discId, sem) {
  try {
    var lista = getDisciplinasDeSemestre(sem);
    var info = lista.find(function (d) { return d.id === discId || d.arquivo === discId; });
    if (info) return info;
  } catch (e) {
    console.warn('[disciplinas_init] Falha ao resolver disciplina via global.js:', e.message);
  }
  console.warn(
    '[disciplinas_init] Disciplina "' + discId + '" não encontrada em _DISCIPLINAS para "' +
    sem + '". Usando fallback visual.'
  );
  return { id: discId, nome: discId, arquivo: discId, icone: 'code' };
}

var _discInfo = _resolverInfoDisciplina(_discId, _sem);


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
   pelo Passo 8, quando o catalog.json responder — getConteudoIndex()
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
   PASSO 5 — Ícone + nome da disciplina no header

   Aplica no DOM o que foi resolvido no Passo 3.5. O HTML só
   precisa declarar os elementos vazios:
     <span id="disc-emoji"></span>
     <span id="disc-nome"></span>

   #disc-emoji recebe SVG (não mais emoji/texto), então usamos
   innerHTML. Uma regra CSS mínima é injetada (ver
   _injetarEstiloIconeDisciplina) para que o SVG ocupe o mesmo
   espaço visual do emoji anterior, herdando tamanho
   (font-size → 1em) e cor (currentColor) do elemento pai —
   sem tocar em nenhum arquivo CSS do projeto.
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

function _renderizarCabecalhoDisciplina() {
  try {
    _injetarEstiloIconeDisciplina();

    var iconeEl = document.getElementById('disc-emoji');
    if (iconeEl) iconeEl.innerHTML = resolveIcone(_discInfo.icone);

    var nomeEl = document.getElementById('disc-nome');
    if (nomeEl) nomeEl.textContent = _discInfo.nome;
  } catch (e) {
    console.warn('[disciplinas_init] Ícone/nome da disciplina não aplicado:', e.message);
  }
}


/* ══════════════════════════════════════════════════════════
   PASSO 6 — Ícones SVG dos MODOS de estudo (AVA/Questões/
   ENADE/Fixação)

   Estes ícones representam o MODO de estudo, não a
   disciplina — são os mesmos em toda disciplina. Por isso
   NÃO pertencem a _DISCIPLINAS/_ICONES (global.js), que
   guardam apenas dados por disciplina. Ficam centralizados
   aqui: para trocar o ícone de um modo em todas as páginas
   de todas as disciplinas, basta editar o SVG correspondente
   neste objeto.

   Padrão visual (idêntico ao dos ícones de disciplina
   resolvidos por resolveIcone() em global.js):
     fill="none"
     stroke="currentColor"
     stroke-linecap="round"
     stroke-linejoin="round"
     viewBox="0 0 24 24"

   Aplicados via o atributo `data-modo` que cada `.disc-card`
   já possui — nenhum novo atributo é necessário no HTML.
   O HTML só precisa do `<span>` vazio dentro de
   `.disc-card__icon-wrap`.
   ══════════════════════════════════════════════════════════ */

var _ICONES_MODO = {
  /* AVA — livro aberto (material/atividades do ambiente virtual) */
  ava:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>' +
      '<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' +
    '</svg>',

  /* QUESTÕES — círculo com interrogação (banco de questões adaptativas) */
  questoes:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="12" cy="12" r="10"/>' +
      '<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>' +
      '<line x1="12" y1="17" x2="12.01" y2="17"/>' +
    '</svg>',

  /* ENADE — fachada de instituição (prova de avaliação institucional) */
  enade:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
      '<line x1="3" y1="22" x2="21" y2="22"/>' +
      '<line x1="6" y1="18" x2="6" y2="11"/>' +
      '<line x1="10" y1="18" x2="10" y2="11"/>' +
      '<line x1="14" y1="18" x2="14" y2="11"/>' +
      '<line x1="18" y1="18" x2="18" y2="11"/>' +
      '<polygon points="12 2 20 7 4 7"/>' +
    '</svg>',

  /* FIXAÇÃO — alfinete (revisão/consolidação do conteúdo) */
  fixacao:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 17v5"/>' +
      '<path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>' +
    '</svg>',
};

function _injetarEstiloIconeModo() {
  if (document.getElementById('disc-card-icon-svg-style')) return;
  var style = document.createElement('style');
  style.id = 'disc-card-icon-svg-style';
  style.textContent =
    '.disc-card__icon-wrap svg {' +
      'width: 1em;' +
      'height: 1em;' +
      'display: block;' +
      'color: currentColor;' +
      'vertical-align: middle;' +
    '}';
  document.head.appendChild(style);
}

function _aplicarIconesModo() {
  try {
    _injetarEstiloIconeModo();
    document.querySelectorAll('.disc-card[data-modo]').forEach(function (card) {
      var svg = _ICONES_MODO[card.dataset.modo];
      if (!svg) return;
      var span = card.querySelector('.disc-card__icon-wrap span');
      if (span) span.innerHTML = svg;
    });
  } catch (e) {
    console.warn('[disciplinas_init] Ícones de modo não aplicados:', e.message);
  }
}


/* ══════════════════════════════════════════════════════════
   PASSO 7 — Logo, áudio e eventos (após DOMContentLoaded)
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  /* Ícone + nome da disciplina (Passo 5) */
  _renderizarCabecalhoDisciplina();

  /* Ícones dos modos de estudo (Passo 6) */
  _aplicarIconesModo();

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

  /* NAVIGATION ANALYTICS — registra entrada na página de disciplinas */
  try {
    if (typeof window.__nexusPageEnter === 'function') {
      window.__nexusPageEnter(location.pathname);
    }
  } catch (_) {}

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
   PASSO 8 — Verificar disponibilidade via catalog.json

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