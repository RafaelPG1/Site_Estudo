// @ts-nocheck
/* ============================================================
   NEXUS STUDY — quiz/disciplinas/disciplinas_init.js  v9.0

   INTEGRAÇÃO v9.0 — CENTRALIZAÇÃO DA CONFIGURAÇÃO DE MODOS:

     Problema: a configuração visual de cada modo (SVG, título,
     descrição, cssClass, ordem) estava duplicada em 3 lugares
     (catalog.json._modos, _MODOS_FALLBACK/_ICONES_MODO aqui, e
     uma cópia manual em quiz_starter_modal.js). Isso já tinha
     causado divergência real: o modo "Revisão" existia aqui e
     no catalog.json, mas não em template_init.js, então
     ?modo=revisao caía no fallback "Questões" no template do
     quiz.

     Solução: toda a configuração de modo (id/titulo/descricao/
     cssClass/ordem/icone/breadcrumb/h1/label) foi extraída para
     ./modos.js (mesma pasta), que passa a ser a ÚNICA fonte.
     Este arquivo agora apenas IMPORTA de lá:
       • _MODOS_FALLBACK e _ICONES_MODO foram REMOVIDOS.
       • Passo 3.7 (continuar direto via ?modo=) usa MODOS_QUIZ.
       • Passo 6/6.5 (ícones dos cards) usa getIconeModo().
       • Passo 8 (renderização dos cards) usa getModosOrdenados()
         em vez de ler catalog._modos — catalog.json não guarda
         mais nada visual, só disponibilidade por disciplina/
         semestre (o que já era true antes).

     catalog.json: a chave global `_modos` deve ser REMOVIDA do
     arquivo (não é mais lida por este script). As chaves de
     semestre (disponibilidade por disciplina) continuam
     exatamente como estavam.

   ============================================================ */
/* ============================================================
   NEXUS STUDY — quiz/disciplinas/disciplinas_init.js  v8.2

   INTEGRAÇÃO v8.2 (mescla das versões v7.5/v8.1 e v7.4):
     - Base deste arquivo é a versão mais recente (v7.5/v8.1),
       que já é a implementação atual do projeto: renderização
       dinâmica dos modos a partir de catalog._modos (SUBSTITUÍDO
       em v9.0 — ver nota acima), HTML genérico (disciplina.html)
       e discId lido de ?disc=.
     - Único ponto realmente divergente entre as duas versões era
       o Passo 1 (resolução do discId): a versão anterior (v7.4)
       o extraía do NOME DO ARQUIVO (location.pathname), esquema
       usado quando cada disciplina tinha seu próprio HTML. Esse
       comportamento foi reincorporado como FALLBACK: se ?disc=
       não estiver presente na URL, o script volta a tentar
       resolver o discId a partir do nome do arquivo — cobrindo
       links antigos/diretos — sem jamais sobrepor ?disc= quando
       ele existir (fonte primária, exigida pela arquitetura
       atual de HTML único + catalog._modos).
     - Todo o restante (Passos 2 a 9) já era idêntico em espírito
       entre as duas versões, com a mais recente apenas os
       tornando mais robustos (estado inválido, renderização
       dinâmica de cards, título de página dinâmico) — nada disso
       foi removido nem substituído nesta integração.
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

/* FONTE ÚNICA de configuração dos modos de estudo (v9.0).
   Ver ./modos.js para a lista completa e instruções de como
   adicionar um modo novo. */
import { MODOS_QUIZ, getModosOrdenados, getIconeModo } from './modos.js';

/* NAVIGATION ANALYTICS — importa o tracker para garantir que
   window.__nexusPageEnter seja registrado nesta página.
   O tracker inicializa automaticamente via auto-boot interno. */
import '../../src/session-tracker.js';
import { carregarIA } from '../../shared/js/ia/carregar-ia.js';


/* ══════════════════════════════════════════════════════════
   MONTAGEM DO HREF DE CADA MODO

   Movido para o topo do arquivo (v8.1) porque é usado em dois
   pontos que precisam existir ANTES do fetch assíncrono de
   catalog.json:
     • Passo 3.7 — continuar direto no modo indicado por ?modo=
       (síncrono, roda antes de qualquer coisa ser desenhada)
     • Passo 8   — renderização dos cards de modo (depois do
       fetch, como já era)

   v9.0 — a lista de modos em si (id/titulo/descricao/cssClass/
   ordem/icone) não vive mais aqui: vem de ./modos.js
   (MODOS_QUIZ / getModosOrdenados / getIconeModo).
   ══════════════════════════════════════════════════════════ */

function _montarHrefModo(discId, modoId, sem) {
  var href = '../template/template.html?disc=' + encodeURIComponent(discId) +
             '&modo=' + encodeURIComponent(modoId);
  if (sem) href += '&sem=' + encodeURIComponent(sem);
  return href;
}


/* ══════════════════════════════════════════════════════════
   PASSO 1 — Resolver ID da disciplina a partir da URL

   v8.0 — MIGRAÇÃO PARA HTML GLOBAL (disciplina.html):
     Antes, cada disciplina tinha seu próprio HTML e o discId
     era inferido do NOME DO ARQUIVO (location.pathname).
     Agora existe um único HTML (disciplina.html) para todas as
     disciplinas, então o discId passa a vir explicitamente do
     parâmetro ?disc= da URL.

     Ex.: disciplina.html?sem=2026.1-AP1&disc=poo → discId = "poo"

     'desconhecida' continua sendo o valor sentinela usado em
     todo o arquivo quando nenhum discId válido é encontrado.
   ══════════════════════════════════════════════════════════ */
var _discId = 'desconhecida';
try {
  var _discParam = new URLSearchParams(location.search).get('disc');
  if (_discParam) {
    _discId = _discParam;
  } else {
    /* INTEGRAÇÃO (esquema anterior, um HTML por disciplina — ex.:
       poo.html, banco_dados.html): fallback para quando a página é
       acessada sem ?disc= (ex.: link antigo/direto ainda em uso).
       Extrai o id a partir do nome do arquivo, exatamente como o
       script fazia antes da migração para disciplina.html (v8.0).
       Só entra em ação na ausência de ?disc=; nunca sobrepõe o
       parâmetro da URL, que continua sendo a fonte primária. */
    var _fromPath = '';
    try { _fromPath = location.pathname.split('/').pop().replace('.html', ''); } catch (_) {}
    if (_fromPath) _discId = _fromPath;
  }
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
  var lista = [];
  try {
    lista = getDisciplinasDeSemestre(sem) || [];
  } catch (e) {
    console.warn('[disciplinas_init] Falha ao resolver disciplinas via global.js:', e.message);
  }

  /* Semestre "existe" se _DISCIPLINAS tiver ao menos uma disciplina
     cadastrada para ele — mesmo critério usado por quiz.js. */
  var semEncontrado = lista.length > 0;

  var info = lista.find(function (d) { return d.id === discId || d.arquivo === discId; });
  if (info) {
    return { info: info, discEncontrada: true, semEncontrado: semEncontrado };
  }

  if (discId && discId !== 'desconhecida') {
    console.warn(
      '[disciplinas_init] Disciplina "' + discId + '" não encontrada em _DISCIPLINAS para "' +
      sem + '". Usando fallback visual.'
    );
  }

  return {
    info: { id: discId, nome: discId, arquivo: discId, icone: 'code' },
    discEncontrada: false,
    semEncontrado: semEncontrado,
  };
}

var _contextoDisc = _resolverInfoDisciplina(_discId, _sem);
var _discInfo      = _contextoDisc.info;

/* ══════════════════════════════════════════════════════════
   PASSO 3.6 — Validar estado geral (disc + sem) a partir da URL

   v8.0 — MIGRAÇÃO PARA HTML GLOBAL (disciplina.html):
     Como o HTML agora é genérico, precisamos decidir aqui,
     de forma centralizada, se a combinação ?disc=&sem= recebida
     é utilizável. Casos tratados como inválidos:
       • disciplina.html                          (sem parâmetros)
       • disciplina.html?disc=nao_existe           (sem sem=)
       • disciplina.html?sem=nao_existe            (sem disc=)
       • disciplina.html?sem=2026.1-AP1&disc=nao_existe

     Quando inválido, a página não tenta buscar catalog.json nem
     renderizar cards de modo — em vez disso mostra uma mensagem
     simples (ver _renderizarEstadoInvalido), mantendo header,
     logo, back-btn e áudio funcionando normalmente.
   ══════════════════════════════════════════════════════════ */
var _semValido    = !!_sem && _contextoDisc.semEncontrado;
var _discValido   = _discId !== 'desconhecida' && _contextoDisc.discEncontrada;
var _estadoValido = _semValido && _discValido;

function _mensagemEstadoInvalido() {
  if (!_sem) return 'Nenhum semestre foi informado na URL.';
  if (!_contextoDisc.semEncontrado) return 'O semestre "' + _sem + '" não foi encontrado.';
  if (_discId === 'desconhecida') return 'Nenhuma disciplina foi informada na URL.';
  return 'A disciplina "' + _discId + '" não foi encontrada em ' + _sem + '.';
}

/* ══════════════════════════════════════════════════════════
   PASSO 3.7 — Continuar direto no modo indicado por ?modo=

   INTEGRAÇÃO (v8.1): esta funcionalidade existia numa versão
   anterior deste arquivo (pré-v7.5, cards de modo hardcoded no
   HTML) e foi perdida quando os cards passaram a ser renderizados
   dinamicamente a partir de catalog.json (Passo 8, assíncrono).

   Origem/uso: a Home ("Continuar Estudando", em quiz.js/
   _renderContinuarEstudando) monta o link desta página como
   "disciplina.html?sem=X&disc=Y&modo=Z" para retomar uma
   tentativa em andamento. Sem este passo, ?modo= chega aqui e
   é ignorado — o usuário sempre para na tela de escolha manual,
   mesmo já sabendo o modo.

   v9.0: antes, esta camada síncrona usava uma lista estática
   local (_MODOS_FALLBACK) e existia uma "Camada 2" no Passo 8
   que reconferia com a lista real vinda de catalog._modos, caso
   ela trouxesse mais/menos modos que o fallback. Como agora a
   lista de modos (MODOS_QUIZ, vinda de ./modos.js) já é a lista
   REAL e completa desde o início — não depende mais de nenhum
   fetch — essa segunda camada deixou de ser necessária e foi
   removida. Esta função roda apenas uma vez.

   Mesma filosofia da versão anterior (documentada lá): NÃO
   verifica disponibilidade (discEntry[modo] === true) antes de
   redirecionar — isso só é conhecido depois do catalog.json
   responder (Passo 8), e preferimos deixar o usuário continuar
   a bloquear precocemente um caso que normalmente é válido.
   ══════════════════════════════════════════════════════════ */
var _modoRedirecionado = false;

function _tentarContinuarModo(modosConhecidos) {
  if (_modoRedirecionado || !_estadoValido) return;

  var modoContinuar;
  try {
    modoContinuar = new URLSearchParams(location.search).get('modo');
  } catch (_) {
    return;
  }
  if (!modoContinuar) return;

  var modoValido = modosConhecidos.some(function (m) { return m.id === modoContinuar; });
  if (!modoValido) {
    console.warn(
      '[disciplinas_init] ?modo="' + modoContinuar + '" não corresponde a nenhum modo' +
      ' conhecido — mantendo a tela de escolha normal.'
    );
    return;
  }

  _modoRedirecionado = true;
  /* location.replace() (em vez de location.href) evita empilhar esta
     tela intermediária no histórico — "voltar" a partir do quiz volta
     para a Home, e não para esta tela de escolha que o usuário nunca
     viu de fato. Mesmo comportamento da versão anterior. */
  location.replace(_montarHrefModo(_discId, modoContinuar, _sem));
}

/* Lista real e completa de modos, vinda da fonte única (./modos.js).
   Não depende de nenhum fetch — está disponível de forma síncrona
   desde o carregamento do módulo. */
_tentarContinuarModo(MODOS_QUIZ);


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

    /* document.title era fixo por HTML (um por disciplina). Agora
       o HTML é genérico, então o título passa a ser montado aqui,
       a partir do mesmo _discInfo.nome já usado no header. */
    document.title = 'Nexus Study — ' + _discInfo.nome;
  } catch (e) {
    console.warn('[disciplinas_init] Ícone/nome da disciplina não aplicado:', e.message);
  }
}

/* ══════════════════════════════════════════════════════════
   PASSO 5.5 — Estado inválido (?disc= / ?sem= ausentes ou
   inexistentes em _DISCIPLINAS)

   Não é uma "tela de erro" separada: reaproveita os mesmos
   elementos do header/página (eyebrow, título, descrição,
   container de modos), apenas substituindo o conteúdo deles
   por uma mensagem curta. Header, logo, back-btn e áudio
   continuam funcionando normalmente — a página nunca fica em
   branco/quebrada.
   ══════════════════════════════════════════════════════════ */
function _renderizarEstadoInvalido() {
  try {
    _injetarEstiloIconeDisciplina();

    var iconeEl = document.getElementById('disc-emoji');
    if (iconeEl) iconeEl.innerHTML = resolveIcone('code');

    var nomeEl = document.getElementById('disc-nome');
    if (nomeEl) nomeEl.textContent = '—';

    var tituloEl = document.getElementById('page-title-h1');
    if (tituloEl) tituloEl.innerHTML = 'Não foi possível <em>continuar</em>';

    var descEl = document.getElementById('page-header-desc');
    if (descEl) descEl.textContent = _mensagemEstadoInvalido();

    var container = document.getElementById('disciplines-container');
    if (container) container.innerHTML = '';

    document.title = 'Nexus Study — Disciplina não encontrada';
  } catch (e) {
    console.warn('[disciplinas_init] Falha ao renderizar estado inválido:', e.message);
  }
}


/* ══════════════════════════════════════════════════════════
   PASSO 6 — Ícones SVG dos MODOS de estudo (AVA/Questões/
   ENADE/Fixação/Revisão)

   v9.0: os SVGs de cada modo NÃO vivem mais aqui. Eles foram
   centralizados em ./modos.js (MODOS_QUIZ / getIconeModo()),
   junto com título, descrição, cssClass e ordem — a mesma fonte
   que quiz_starter_modal.js também consome (via import()
   dinâmico). Trocar o ícone de um modo em todas as páginas de
   todas as disciplinas passa a exigir editar um único arquivo:
   ./modos.js.

   Aplicados via o atributo `data-modo` que cada `.disc-card`
   já possui — nenhum novo atributo é necessário no HTML.
   O HTML só precisa do `<span>` vazio dentro de
   `.disc-card__icon-wrap`.
   ══════════════════════════════════════════════════════════ */

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
      var svg = getIconeModo(card.dataset.modo);
      if (!svg) return;
      var span = card.querySelector('.disc-card__icon-wrap span');
      if (span) span.innerHTML = svg;
    });
  } catch (e) {
    console.warn('[disciplinas_init] Ícones de modo não aplicados:', e.message);
  }
}


/* ══════════════════════════════════════════════════════════
   PASSO 6.5 — Vincular sons de hover/click nos cards de modo

   Extraído do antigo Passo 7 para virar uma função reaproveitável:
   antes, os cards já existiam no DOM quando o DOMContentLoaded
   disparava (eram hardcoded no HTML). Agora eles só existem depois
   que o catalog.json responde (Passo 8, assíncrono) — então esta
   função passa a ser chamada também logo após os cards serem
   inseridos no DOM, e não só uma vez no boot.

   `data-som-vinculado` evita vincular o mesmo card duas vezes caso
   a função seja chamada mais de uma vez sobre o mesmo elemento.
   ══════════════════════════════════════════════════════════ */
function _vincularSomCards() {
  try {
    document.querySelectorAll('.disc-card').forEach(function (card) {
      if (card.dataset.somVinculado === '1') return;
      card.dataset.somVinculado = '1';

      card.addEventListener('mouseenter', function () {
        try { playSound('hover', 'quiz'); } catch (_) {}
      });
      card.addEventListener('click', function () {
        try { playSound('click', 'quiz'); } catch (_) {}
      });
    });
  } catch (_) {}
}


/* ══════════════════════════════════════════════════════════
   PASSO 7 — Logo, áudio e eventos (após DOMContentLoaded)
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  /* Ícone + nome da disciplina (Passo 5) — ou mensagem de
     estado inválido (Passo 5.5), se ?disc=/?sem= não resolverem
     para uma disciplina real de _DISCIPLINAS. */
  if (_estadoValido) {
    _renderizarCabecalhoDisciplina();
  } else {
    _renderizarEstadoInvalido();
  }

  /* Ícones dos modos de estudo (Passo 6) — não-op se os cards
     ainda não existirem (ver Passo 8); roda de novo depois que
     eles forem inseridos. */
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

  /* Som do botão "Voltar" (não depende dos cards de modo) */
  try {
    var backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        try { playSound('click', 'quiz'); } catch (_) {}
      });
    }
  } catch (_) {}

  /* Som dos cards de modo — não-op se ainda não existirem
     (ver Passo 8); roda de novo depois que eles forem inseridos. */
  _vincularSomCards();

  /* Áudio pronto em background */
  try { Sound.waitUntilReady().catch(function () {}); } catch (_) {}

  /* Footer: ano atual */
  try {
    var yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  } catch (_) {}

});


/* ══════════════════════════════════════════════════════════
   PASSO 8 — Renderizar os cards de modo a partir do catalog.json

   v9.0 — catalog.json deixou de guardar QUAIS modos existem
   (chave global `_modos`, removida). Ele agora é responsável
   apenas pela DISPONIBILIDADE por disciplina/semestre — o que
   já era sua única responsabilidade real. A lista de modos em
   si (id/titulo/descricao/cssClass/ordem/icone) vem sempre de
   ./modos.js (getModosOrdenados()), a mesma fonte usada no
   Passo 3.7 e no Passo 6.

   Fluxo:
     1. Usa o semestre completo como chave do catalog
        (ex: "2026.1-AP1", "2026.1-AP2" — sem extração de período base)
     2. Faz fetch de ./catalog.json (mesma pasta do disciplinas_init.js)
     3. Lê catalog[_sem][discId] (disponibilidade)
     4. Para cada modo de getModosOrdenados(), monta um
        <a class="disc-card"> idêntico em marcação ao que antes
        era hardcoded em cada HTML, e insere via DocumentFragment
        em #disciplines-container
     5. Modos ausentes ou marcados como false recebem
        disc-card--vazio (mesmo estado visual de antes)
     6. Guarda o discEntry em _catalogDiscEntry, para que
        getConteudoIndex() possa retorná-lo
     7. Reaplica ícones (Passo 6) e sons (Passo 6.5) sobre os
        cards recém-criados, já que eles não existiam quando o
        DOMContentLoaded rodou essas funções pela primeira vez

   Garantias mantidas:
     - Nunca omite um modo do DOM: um modo sem disponibilidade
       aparece desabilitado (disc-card--vazio), nunca some
     - A lista de modos em si não depende do fetch (vem de
       ./modos.js, síncrono) — só a DISPONIBILIDADE depende dele.
       Se o fetch falhar, os cards ainda aparecem, só que nenhum
       é desabilitado (mesma filosofia de antes: preferimos
       falso-positivo a esconder conteúdo válido)
     - Se catalog[_sem][discId] não existir, nenhum card é
       desabilitado (mesmo comportamento de antes)
     - Assíncrono: não bloqueia a exibição do resto da página
   ══════════════════════════════════════════════════════════ */

function _criarCardModo(modo, disponivel, discId, sem) {
  var a = document.createElement('a');
  a.className = 'disc-card' + (modo.cssClass ? ' ' + modo.cssClass : '');
  a.href = _montarHrefModo(discId, modo.id, sem);
  a.dataset.modo = modo.id;

  if (!disponivel) {
    a.classList.add('disc-card--vazio');
    a.setAttribute('aria-disabled', 'true');
    a.setAttribute('tabindex', '-1');
  }

  var iconWrap = document.createElement('div');
  iconWrap.className = 'disc-card__icon-wrap';
  iconWrap.appendChild(document.createElement('span'));

  var body = document.createElement('div');
  body.className = 'disc-card__body';

  var titulo = document.createElement('h2');
  titulo.className = 'disc-card__title';
  titulo.textContent = modo.titulo;

  var desc = document.createElement('p');
  desc.className = 'disc-card__desc';
  desc.textContent = modo.descricao;

  body.appendChild(titulo);
  body.appendChild(desc);

  var cta = document.createElement('div');
  cta.className = 'disc-card__cta';
  cta.innerHTML =
    '<div class="disc-card__arrow">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>' +
      '</svg>' +
    '</div>' +
    '<span class="disc-card__cta-label">Iniciar</span>';

  var glow = document.createElement('div');
  glow.className = 'disc-card__glow';

  a.appendChild(iconWrap);
  a.appendChild(body);
  a.appendChild(cta);
  a.appendChild(glow);

  return a;
}

function _renderizarModos(catalog) {
  var container = document.getElementById('disciplines-container');
  if (!container) {
    console.warn('[disciplinas_init] #disciplines-container não encontrado — cards de modo não renderizados.');
    return;
  }

  /* Fonte única e sempre completa dos modos — não depende mais
     de catalog._modos (removido). Já vem ordenada por `ordem`. */
  var modos = getModosOrdenados();

  var semesterEntry = catalog[_sem];
  var discEntry      = semesterEntry ? semesterEntry[_discId] : null;

  if (!semesterEntry) {
    console.info(
      '[disciplinas_init] Semestre "' + _sem + '" não encontrado no catalog.json.' +
      ' Nenhum card será desabilitado.'
    );
  } else if (!discEntry) {
    console.info(
      '[disciplinas_init] Disciplina "' + _discId + '" não encontrada em "' + _sem + '"' +
      ' no catalog.json. Nenhum card será desabilitado.'
    );
  }

  /* Disponibiliza o discEntry para getConteudoIndex() — igual a antes */
  _catalogDiscEntry = discEntry || null;

  var frag = document.createDocumentFragment();
  modos.forEach(function (modo) {
    /* Sem entrada no catalog para este semestre/disciplina:
       nenhum card é desabilitado (mesmo comportamento de antes).
       Com entrada: disponível apenas se explicitamente `true`. */
    var disponivel = discEntry ? discEntry[modo.id] === true : true;
    frag.appendChild(_criarCardModo(modo, disponivel, _discId, _sem));
  });

  container.innerHTML = '';
  container.appendChild(frag);

  /* Os cards acabaram de nascer — reaplica ícones (Passo 6) e
     sons de hover/click (Passo 6.5), que já rodaram uma vez no
     DOMContentLoaded sem encontrar nenhum card. */
  _aplicarIconesModo();
  _vincularSomCards();
}

(function _carregarCatalogERenderizarModos() {

  if (!_estadoValido) {
    /* ?disc=/?sem= inválidos: Passo 5.5 já mostrou a mensagem
       de estado inválido. Não faz sentido buscar catalog.json
       nem renderizar cards de modo para uma disciplina/semestre
       que não existem. */
    try { document.documentElement.removeAttribute('data-catalog-loading'); } catch (_) {}
    return;
  }

  /* Caminho do catalog relativo à raiz do projeto */
  var _catalogUrl = new URL('./catalog.json', import.meta.url).href;

  fetch(_catalogUrl)
    .then(function (res) {
      if (!res.ok) throw new Error('catalog.json retornou HTTP ' + res.status);
      return res.json();
    })
    .then(function (catalog) {
      _renderizarModos(catalog);
    })
    .catch(function (err) {
      console.warn('[disciplinas_init] Falha ao carregar catalog.json:', err.message);
      console.warn('[disciplinas_init] Renderizando modos sem informação de disponibilidade.');
      /* Mesmo sem catalog.json, renderiza os modos (fonte ./modos.js)
         para a página não ficar vazia — nenhum card fica desabilitado,
         seguindo a mesma filosofia de "falso-positivo > esconder". */
      _renderizarModos({});
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

  document.addEventListener('DOMContentLoaded', function () {
    carregarIA('disciplinas_init');
  }, { once: true });

}());