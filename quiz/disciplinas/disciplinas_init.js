// @ts-nocheck
/* ============================================================
   NEXUS STUDY — quiz/disciplinas/disciplinas_init.js  v8.2

   INTEGRAÇÃO v8.2 (mescla das versões v7.5/v8.1 e v7.4):
     - Base deste arquivo é a versão mais recente (v7.5/v8.1),
       que já é a implementação atual do projeto: renderização
       dinâmica dos modos a partir de catalog._modos, HTML
       genérico (disciplina.html) e discId lido de ?disc=.
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
/* ============================================================
   NEXUS STUDY — quiz/disciplinas/disciplinas_init.js  v7.5

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
     8. Buscar catalog.json, RENDERIZAR os cards de modo
        dinamicamente (fonte única: catalog._modos) e
        marcar como disc-card--vazio os indisponíveis    (UX)
     9. Inicializar a IA (Nexus Assistente)             (IA)

     (contexto de leitura para a IA — disciplina/semestre/
      catalog — é exposto em window como Passo 4.5, antes
      do DOMContentLoaded)

   MUDANÇAS v7.5 — CARDS DE MODO GERADOS DINAMICAMENTE
   (SUBSTITUINDO OS <a class="disc-card"> HARDCODED NOS HTMLs):

     Problema: cada HTML de disciplina (poo.html, banco_dados.html,
     design.html, redes.html, redes2.html, analise_projeto.html,
     estruturas_dados.html, legislacao.html,
     psicologia_organizacional.html) repetia manualmente os mesmos
     4 blocos <a class="disc-card"> (AVA/Questões/ENADE/Fixação).
     Criar um modo novo exigia editar dezenas de arquivos HTML.

     Solução:
       • catalog.json ganhou uma chave global `_modos`, um array
         com { id, titulo, descricao, cssClass, ordem } — a fonte
         única de QUAIS modos existem (a disponibilidade por
         disciplina/semestre continua exatamente como antes, nas
         chaves de semestre do próprio catalog.json).
       • O Passo 8 (antes `_aplicarDisponibilidade`, só marcava
         cards já existentes) virou `_renderizarModos`: monta um
         `<a class="disc-card">` por item de `_modos` (na ordem
         de `ordem`), idêntico em marcação/classe/ícone/texto ao
         que cada HTML tinha fixo, e insere via DocumentFragment
         no `#disciplines-container`.
       • Os HTMLs agora só declaram o container vazio:
           <div class="disciplines" id="disciplines-container"></div>
         Nenhum <a class="disc-card"> fica fixo em HTML.
       • Ícones (`_ICONES_MODO`, Passo 6) e sons de hover/click
         (Passo 7) foram mantidos como funções reaproveitáveis,
         agora também invocadas DEPOIS que os cards são inseridos
         no DOM (antes só rodavam uma vez no DOMContentLoaded, o
         que não bastava mais porque os cards passaram a existir
         apenas depois do fetch assíncrono do catalog.json).
       • Criar um modo novo, daqui pra frente, é: adicionar um
         objeto em `_modos` + a disponibilidade por disciplina/
         semestre no catalog.json. Nenhum HTML precisa ser tocado.

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
       ui.js, resumo/search_resumo.js, resumo/assistant_resumo.js, init.js).
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
   MODOS — lista de fallback e montagem do href de cada modo

   Movidos para o topo do arquivo (v8.1) porque agora são usados
   em dois pontos que precisam existir ANTES do fetch assíncrono
   de catalog.json:
     • Passo 3.7 — continuar direto no modo indicado por ?modo=
       (síncrono, roda antes de qualquer coisa ser desenhada)
     • Passo 8   — renderização dos cards de modo (depois do
       fetch, como já era)

   v8.1 — CORREÇÃO DE PATH (migração para disciplina.html):
     Antes, os HTMLs de disciplina viviam em
     quiz/disciplinas/{ano}/{periodo}/{arquivo}.html — dois
     níveis mais fundo que este script (quiz/disciplinas/
     disciplinas_init.js), por isso o href para o template
     precisava subir 3 níveis: '../../../template/template.html'.

     Agora existe um único disciplina.html, na MESMA pasta deste
     script (quiz/disciplinas/disciplina.html), então o caminho
     correto passa a subir apenas 1 nível: '../template/template.html'.
     Sem este ajuste, todo card de modo (e o redirecionamento do
     Passo 3.7) apontaria para um caminho inexistente.
   ══════════════════════════════════════════════════════════ */

/* Fallback usado se catalog._modos vier ausente/inválido — mesmos
   4 modos que antes estavam hardcoded em cada HTML. Mantém a
   página funcional mesmo se o catalog.json for editado incorretamente,
   e serve também como lista síncrona de "modos conhecidos" para o
   Passo 3.7 (antes do catalog.json ainda ter respondido). */
var _MODOS_FALLBACK = [
  { id: 'revisao',  titulo: 'Revisão',   descricao: 'Questões de revisão dos Professores(as).',                            cssClass: 'disc-card--revisao', ordem: 1 },
  { id: 'ava',      titulo: 'AVA',       descricao: 'Questões extraídas das atividades do AVA',                                          cssClass: 'disc-card--ava',     ordem: 2 },
  { id: 'questoes', titulo: 'Questões',  descricao: 'Questões adaptativas criadas por IA com feedback explicativo.',                       cssClass: 'disc-card--quiz',    ordem: 3 },
  { id: 'enade',    titulo: 'ENADE',     descricao: 'Questões estilo ENADE com contexto aplicado, asserções e análise crítica.',           cssClass: 'disc-card--enade',   ordem: 4 },
  { id: 'fixacao',  titulo: 'Fixação',   descricao: 'Questões de revisão para consolidar o conteúdo estudado.',                            cssClass: 'disc-card--fixacao', ordem: 5 },

];

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

   Adaptação necessária: a versão anterior fazia
   `document.querySelector('.disc-card[data-modo="X"][href]')`,
   o que exigia que os cards já existissem no DOM. Isso não é
   mais garantido de forma síncrona: os cards só nascem depois
   do fetch assíncrono de catalog.json (Passo 8). Em vez de
   depender do DOM, este passo monta o href diretamente via
   _montarHrefModo(), usando a lista estática _MODOS_FALLBACK
   como "modos conhecidos" — exatamente os mesmos 4 modos que a
   versão anterior enxergava como cards fixos no HTML.

   Mesma filosofia da versão anterior (documentada lá): NÃO
   verifica disponibilidade (discEntry[modo] === true) antes de
   redirecionar — isso só é conhecido depois do catalog.json
   responder (Passo 8), e preferimos deixar o usuário continuar
   a bloquear precocemente um caso que normalmente é válido.

   Camada 2 (correção/robustez, ver _renderizarModos): se
   catalog._modos trouxer um modo que não está em
   _MODOS_FALLBACK, esta camada síncrona não o reconhece — o
   Passo 8 tenta novamente com a lista real assim que ela chega.
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

/* Camada 1 — síncrona, com a lista estática (idêntico em espírito
   à versão anterior, que via os 4 cards fixos no HTML antes de
   qualquer fetch). */
_tentarContinuarModo(_MODOS_FALLBACK);


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

  /* REVISÃO — prancheta com marcação (questões de revisão dos professores) */
  revisao:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
      '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>' +
      '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>' +
      '<path d="m9 14 2 2 4-4"/>' +
    '</svg>',
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

   Fonte única: catalog.json passa a descrever tanto QUAIS modos
   existem (chave global `_modos`) quanto a disponibilidade deles
   por disciplina/semestre (chaves de semestre, como já era antes).

   Fluxo:
     1. Usa o semestre completo como chave do catalog
        (ex: "2026.1-AP1", "2026.1-AP2" — sem extração de período base)
     2. Faz fetch de ./catalog.json (mesma pasta do disciplinas_init.js)
     3. Lê catalog._modos (lista de modos existentes) e
        catalog[_sem][discId] (disponibilidade)
     4. Para cada modo, na ordem de `ordem`, monta um
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
     - Se o fetch falhar ou catalog._modos estiver ausente,
       usa um fallback estático com os 4 modos atuais — nenhum
       modo desaparece por falha de rede
     - Se catalog[_sem][discId] não existir, nenhum card é
       desabilitado (mesmo comportamento de antes: preferimos
       falso-positivo a esconder conteúdo válido)
     - Assíncrono: não bloqueia a exibição do resto da página
   ══════════════════════════════════════════════════════════ */

/* _MODOS_FALLBACK e _montarHrefModo foram centralizados no topo
   do arquivo (logo após os imports) — são usados tanto aqui
   (Passo 8, renderização dos cards) quanto no Passo 3.7
   (continuar direto no modo via ?modo=), que roda bem antes
   deste ponto do arquivo. */

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

  var modos = Array.isArray(catalog._modos) ? catalog._modos : _MODOS_FALLBACK;
  if (!Array.isArray(catalog._modos)) {
    console.warn('[disciplinas_init] catalog._modos ausente/inválido — usando fallback estático de modos.');
  }

  modos = modos.slice().sort(function (a, b) {
    return (a.ordem || 0) - (b.ordem || 0);
  });

  /* Camada 2 do Passo 3.7 — agora com a lista REAL de modos
     (catalog._modos, que pode ter mais/menos itens que o fallback
     estático usado na Camada 1, síncrona). Não-op se a Camada 1
     já redirecionou. */
  _tentarContinuarModo(modos);
  if (_modoRedirecionado) return;

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
      console.warn('[disciplinas_init] Renderizando modos com fallback estático (sem disponibilidade).');
      /* Mesmo sem catalog.json, renderiza os modos (fallback) para
         a página não ficar vazia — nenhum card fica desabilitado,
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
    BASE + 'resumo/search_resumo.js',
  ];

  document.addEventListener('DOMContentLoaded', function () {
    Promise.all(deps.map(_loadScript))
      .then(function () { return _loadScript(BASE + 'resumo/assistant_resumo.js'); })
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