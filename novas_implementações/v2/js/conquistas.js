/* dashboard\js\conquistas.js
   proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   ─────────────────────────────────────────────
   REDESIGN V2 — SUBSTITUIÇÃO TOTAL DO COMPONENTE
   ─────────────────────────────────────────────
   Este arquivo substitui integralmente a versão anterior de
   Conquistas (resumo + filtros + destaques + galeria paginada
   "Mostrar mais"). A versão anterior foi removida por completo,
   junto com o CSS antigo (dashboard_cards.css) e o HTML antigo
   (dashboard.html) — não resta nenhuma dependência dela.

   O CONTRATO DE ENTRADA NÃO MUDOU:
     renderAchievements(relatorio) continua sendo a única função
     exportada, chamada por renderDashboardIntelligence() em
     dashboard_render.js, lendo apenas:
       relatorio.conquistas          → { id: boolean }
       relatorio.conquistasProgresso → { id: {atual, meta, tipo} }
     Nenhum cálculo de negócio, nenhuma chamada a Firebase ou
     quiz_intelligence foi introduzida aqui — apenas leitura e
     montagem de HTML/estado de UI.

   O QUE MUDOU: a interface visual, que agora segue o protótipo
   "Conquistas · V5" (anel de progresso geral, chips de resumo,
   abas por categoria, "Em destaque" com no máximo 3 cards,
   galeria em grid com paginação numerada e modal de detalhe).
   CSS correspondente: dashboard/css/conquistas.css.

   LIMITAÇÃO CONHECIDA (herdada do sistema, não introduzida aqui):
   relatorio.conquistas/conquistasProgresso hoje só cobrem 10 ids
   do catálogo (ver _calcularConquistas em dashboard_data.js). As
   demais conquistas do catálogo aparecem como "bloqueada" sem
   progresso, até que o cálculo real seja estendido para elas.
   Da mesma forma, o sistema não persiste a DATA de desbloqueio de
   cada conquista — por isso o rótulo de data usa sempre
   "Concluída" no lugar de uma data real (ver _achRotuloData).

   ─────────────────────────────────────────────
   CORREÇÃO — legenda "{n} de {total} desbloqueadas"
   ─────────────────────────────────────────────
   _achRenderOverview() escrevia o texto do #ach-overview-caption
   duas vezes seguidas: uma com espaço antes de "de" (correto) e
   logo em seguida outra sem esse espaço, que sobrescrevia a
   primeira (a última atribuição a .textContent sempre vence). Como
   o número (#ach-overview-value) e esta legenda são dois <span>
   adjacentes sem espaço algum entre eles no HTML, o resultado era
   "1de 48 desbloqueadas". A causa não era o HTML nem a
   concatenação do número em si — era a segunda linha, morta e
   duplicada, sobrescrevendo o espaço da primeira. Removida a linha
   duplicada; mantida apenas a atribuição com o espaço inicial.

   ─────────────────────────────────────────────
   AJUSTE 2 — DE MODAL CENTRALIZADO PARA POPOVER CONTEXTUAL
   ─────────────────────────────────────────────
   Puramente UX/apresentação, a pedido do usuário. O detalhe da
   conquista deixou de abrir como modal grande centralizado e passou
   a abrir como um painel contextual (popover) ancorado no card que
   foi clicado — mesmo espírito de GitHub/Figma/Notion/Linear/
   Discord. O CONTEÚDO do painel (função _achAbrirModal, o HTML
   montado dentro de #ach-modal-content) não mudou nada — só COMO e
   ONDE ele aparece na tela.

   Principais adições:
     · _achPosicionarPopover(anchorEl) — calcula a posição via
       getBoundingClientRect() do card clicado, tentando abrir à
       direita; se não couber, tenta à esquerda; se nenhuma lateral
       couber (telas menores), abre abaixo (ou acima, se não houver
       espaço embaixo). Sempre clampado para nunca sair da viewport.
     · _achAnchorEl guarda o card que originou o popover atual, para
       poder recalcular a posição em resize/scroll (ver AJUSTE 3
       abaixo).
   Nenhum cálculo de negócio, conteúdo do painel, cor ou botão foi
   alterado — apenas onde/como ele aparece.

   ─────────────────────────────────────────────
   AJUSTE 3 — FECHAR SÓ POR AÇÃO EXPLÍCITA + REPOSICIONAMENTO
   ─────────────────────────────────────────────
   Antes, QUALQUER evento de scroll fechava o popover — inclusive
   rolagem por mouse wheel, o que dava a falsa impressão de "o
   painel fecha sozinho quando eu mexo o mouse". O pedido explícito
   do usuário foi: mover o mouse NUNCA deve fechar o painel; ele só
   fecha por ação explícita (clique fora, clique de novo no mesmo
   card, ou ESC).

   Mudança:
     · _achOnScrollFechar foi REMOVIDA. Em seu lugar,
       _achOnScrollOuResizeReposicionar cuida de scroll E resize da
       mesma forma: recalcula a posição do painel em relação ao card
       (que pode ter se movido na tela), sem nunca fechá-lo — motivo
       pelo qual o listener de scroll já existia (o popover está em
       position:fixed, então não acompanha o card durante a rolagem
       a menos que seja reposicionado manualmente a cada evento).
     · _achAbrirModalPorId agora funciona como TOGGLE: clicar de novo
       no mesmo card que já está com o painel aberto fecha o painel
       (mesmo padrão usado por popovers do Notion/Linear/GitHub).
     · ESC (_achInicializarUmaVez) e clique no backdrop continuam
       fechando, sem alteração.
   Nenhum cálculo de negócio, conteúdo do painel, cor ou botão foi
   alterado — apenas as regras de quando o painel fecha/reposiciona.
   ═══════════════════════════════════════════════════════════ */

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/* ── Catálogo de conquistas — fonte única de verdade, inalterado
   em relação à versão anterior (mesmos ids, mesmas descrições).
   `categoria` e `tag` são traduzidos para o vocabulário da V2
   pelos mapas logo abaixo (CATEGORIA_MAP / TAG_RARIDADE_MAP). ── */
const CONQUISTAS_CATALOGO = [
  { id: 'primeiroPasso',      categoria: 'estudo',         emoji: '🌱', nome: 'Primeiro Passo',          desc: 'Concluiu o primeiro quiz',                               tag: 'Bronze' },
  { id: 'tentativas10',       categoria: 'estudo',         emoji: '📝', nome: '10 Tentativas',          desc: 'Completou 10 quizzes na plataforma',                      tag: 'Bronze' },
  { id: 'tentativas50',       categoria: 'estudo',         emoji: '📝', nome: '50 Tentativas',          desc: 'Completou 50 quizzes na plataforma',                      tag: 'Prata'  },
  { id: 'tentativas100',      categoria: 'estudo',         emoji: '📝', nome: '100 Tentativas',         desc: 'Completou 100 quizzes na plataforma',                     tag: 'Prata'  },
  { id: 'tentativas500',      categoria: 'estudo',         emoji: '📚', nome: '500 Tentativas',         desc: 'Completou 500 quizzes na plataforma',                     tag: 'Ouro'   },

  { id: 'questoes100',        categoria: 'conhecimento',   emoji: '⚡', nome: '100 Questões',           desc: 'Respondeu 100 questões',                                  tag: 'Bronze' },
  { id: 'questoes500',        categoria: 'conhecimento',   emoji: '⚡', nome: '500 Questões',           desc: 'Respondeu 500 questões',                                  tag: 'Prata'  },
  { id: 'questoesMil',        categoria: 'conhecimento',   emoji: '⚡', nome: 'Mil Questões',           desc: 'Respondeu mais de 1.000 questões',                         tag: 'Ouro'   },
  { id: 'questoes5000',       categoria: 'conhecimento',   emoji: '⚡', nome: '5 Mil Questões',         desc: 'Respondeu mais de 5.000 questões',                         tag: 'Diamante' },

  { id: 'sequencia3',         categoria: 'sequencias',     emoji: '🔥', nome: 'Sequência de 3 dias',    desc: 'Estudou por 3 dias consecutivos',                          tag: 'Bronze' },
  { id: 'sequencia7',         categoria: 'sequencias',     emoji: '🔥', nome: 'Sequência de 7 dias',    desc: 'Estudou por 7 dias consecutivos',                          tag: 'Prata'  },
  { id: 'sequencia15',        categoria: 'sequencias',     emoji: '🔥', nome: 'Sequência de 15 dias',   desc: 'Estudou por 15 dias consecutivos',                         tag: 'Ouro'   },
  { id: 'sequencia30',        categoria: 'sequencias',     emoji: '🔥', nome: 'Sequência de 30 dias',   desc: 'Estudou por 30 dias consecutivos',                         tag: 'Ouro'   },
  { id: 'sequencia100',       categoria: 'sequencias',     emoji: '🔥', nome: 'Sequência de 100 dias',  desc: 'Estudou por 100 dias consecutivos',                        tag: 'Diamante' },

  { id: 'tempo1h',            categoria: 'tempo',          emoji: '⏱️', nome: '1 Hora',                 desc: 'Acumulou 1 hora de estudo',                                tag: 'Bronze' },
  { id: 'tempo10h',           categoria: 'tempo',          emoji: '⏱️', nome: '10 Horas',               desc: 'Acumulou 10 horas de estudo',                              tag: 'Prata'  },
  { id: 'tempo50h',           categoria: 'tempo',          emoji: '⏱️', nome: '50 Horas',               desc: 'Acumulou 50 horas de estudo',                              tag: 'Ouro'   },
  { id: 'tempo100h',          categoria: 'tempo',          emoji: '🏅', nome: '100 Horas',              desc: 'Acumulou 100 horas de estudo',                             tag: 'Diamante' },
  { id: 'maratonista',        categoria: 'tempo',          emoji: '🏆', nome: 'Maratonista',            desc: 'Estudou mais de 5 horas em um único dia',                  tag: 'Ouro'   },

  { id: 'scoreIntermediario', categoria: 'desempenho',     emoji: '🎯', nome: 'Score Intermediário',    desc: 'Atingiu nível Intermediário',                              tag: 'Prata'  },
  { id: 'scoreAvancado',      categoria: 'desempenho',     emoji: '🎯', nome: 'Score Avançado',         desc: 'Atingiu nível Avançado',                                   tag: 'Ouro'   },
  { id: 'scoreElite',         categoria: 'desempenho',     emoji: '👑', nome: 'Score Elite',            desc: 'Atingiu o maior nível de desempenho',                      tag: 'Diamante' },
  { id: 'miraAfiada',         categoria: 'desempenho',     emoji: '🎯', nome: 'Mira Afiada',            desc: 'Mais de 75% de acertos na média geral',                    tag: 'Ouro'   },
  { id: 'precisao90',         categoria: 'desempenho',     emoji: '🎯', nome: 'Precisão Máxima',        desc: 'Alcançou 90% de acertos',                                  tag: 'Diamante' },

  { id: 'emEvolucao',         categoria: 'desempenho',     emoji: '📈', nome: 'Em Evolução',            desc: 'O sistema detectou melhora constante',                     tag: 'Prata'  },
  { id: 'superacao',          categoria: 'desempenho',     emoji: '🚀', nome: 'Superação',              desc: 'Melhorou significativamente seu desempenho',               tag: 'Ouro'   },
  { id: 'semQuedas',          categoria: 'consistencia',   emoji: '✅', nome: 'Sem Quedas',             desc: 'Nenhuma disciplina em queda',                              tag: 'Prata'  },
  { id: 'equilibrado',        categoria: 'consistencia',   emoji: '⚖️', nome: 'Equilibrado',            desc: 'Todas as disciplinas possuem bom desempenho',              tag: 'Ouro'   },

  { id: 'sessoes10',          categoria: 'consistencia',   emoji: '📅', nome: '10 Sessões',             desc: 'Realizou 10 sessões de estudo',                            tag: 'Bronze' },
  { id: 'sessoes50',          categoria: 'consistencia',   emoji: '🏆', nome: '50 Sessões',             desc: 'Realizou 50 sessões de estudo',                            tag: 'Ouro'   },
  { id: 'sessoes100',         categoria: 'consistencia',   emoji: '🏆', nome: '100 Sessões',            desc: 'Realizou 100 sessões de estudo',                           tag: 'Diamante' },

  { id: 'explorador',         categoria: 'plataforma',     emoji: '🧭', nome: 'Explorador',             desc: 'Visitou todas as áreas da plataforma',                     tag: 'Bronze' },
  { id: 'organizado',         categoria: 'plataforma',     emoji: '📂', nome: 'Organizado',             desc: 'Criou sua primeira disciplina',                            tag: 'Bronze' },
  { id: 'dedicado',           categoria: 'plataforma',     emoji: '📖', nome: 'Dedicado',               desc: 'Leu 100 conteúdos',                                        tag: 'Prata'  },
  { id: 'curioso',            categoria: 'plataforma',     emoji: '🔎', nome: 'Curioso',                desc: 'Pesquisou diversos conteúdos na plataforma',               tag: 'Bronze' },

  { id: 'madrugador',         categoria: 'habitos',        emoji: '🌅', nome: 'Madrugador',             desc: 'Estudou antes das 6h da manhã',                            tag: 'Prata'  },
  { id: 'noturno',            categoria: 'habitos',        emoji: '🌙', nome: 'Coruja',                 desc: 'Estudou após as 23h',                                      tag: 'Prata'  },
  { id: 'pontual',            categoria: 'habitos',        emoji: '⏰', nome: 'Pontual',                desc: 'Estudou no horário planejado por 7 dias',                  tag: 'Ouro'   },

  { id: 'focoTotal',          categoria: 'habitos',        emoji: '🧠', nome: 'Foco Total',             desc: 'Concluiu uma sessão sem interrupções',                     tag: 'Bronze' },
  { id: 'incansavel',         categoria: 'habitos',        emoji: '💪', nome: 'Incansável',             desc: 'Completou 10 dias com mais de 2 horas de estudo',          tag: 'Ouro'   },

  { id: 'colecionador',       categoria: 'especial',       emoji: '🏅', nome: 'Colecionador',           desc: 'Desbloqueou 10 conquistas',                                tag: 'Prata'  },
  { id: 'veterano',           categoria: 'especial',       emoji: '🎖️', nome: 'Veterano',              desc: 'Desbloqueou 25 conquistas',                                tag: 'Ouro'   },
  { id: 'lendario',           categoria: 'especial',       emoji: '👑', nome: 'Lendário',               desc: 'Desbloqueou 50 conquistas',                                tag: 'Diamante' },

  { id: 'persistente',        categoria: 'especial',       emoji: '🛡️', nome: 'Persistente',            desc: 'Nunca desistiu de um quiz iniciado',                       tag: 'Ouro'   },
  { id: 'estrela',            categoria: 'especial',       emoji: '⭐', nome: 'Estrela',                 desc: 'Recebeu destaque em desempenho',                           tag: 'Ouro'   },
  { id: 'genio',              categoria: 'especial',       emoji: '🧠', nome: 'Gênio',                  desc: 'Acertou 100 questões consecutivas',                        tag: 'Diamante' },
  { id: 'invencivel',         categoria: 'especial',       emoji: '💎', nome: 'Invencível',             desc: 'Manteve desempenho excelente por um mês',                  tag: 'Diamante' },
  { id: 'nexusMaster',        categoria: 'especial',       emoji: '🌌', nome: 'Nexus Master',           desc: 'Alcançou o nível máximo da plataforma',                    tag: 'Diamante' },
];

/* Tradução das categorias antigas para as 6 abas do protótipo V2.
   Puramente de apresentação — não muda `categoria` no catálogo. */
const CATEGORIA_MAP = {
  estudo:       'desempenho',
  conhecimento: 'conhecimento',
  sequencias:   'sequencias',
  tempo:        'tempo',
  desempenho:   'desempenho',
  consistencia: 'consistencia',
  plataforma:   'exploracao',
  habitos:      'exploracao',
  especial:     'exploracao',
};

/* Tradução da tag antiga (Bronze/Prata/Ouro/Diamante) para a
   escala de raridade de 5 níveis do protótipo V2. "Épica" fica
   sem uso direto do catálogo atual — não é obrigatório usar as 5
   raridades, e nenhuma conquista existente perde informação com
   este mapeamento 1:1. */
const TAG_RARIDADE_MAP = { Bronze: 'comum', Prata: 'incomum', Ouro: 'rara', Diamante: 'lendaria' };
const RARIDADE_PESO    = { comum: 0, incomum: 1, rara: 2, epica: 3, lendaria: 4 };
const RARITY_LABEL     = { comum: 'Comum', incomum: 'Incomum', rara: 'Rara', epica: 'Épica', lendaria: 'Lendária' };

const ACH_CATS = [
  { id: 'todas',        label: 'Todas',         icon: null },
  { id: 'desempenho',   label: 'Desempenho',    icon: 'trending' },
  { id: 'consistencia', label: 'Consistência',  icon: 'calendar' },
  { id: 'sequencias',   label: 'Sequências',    icon: 'flame' },
  { id: 'tempo',        label: 'Tempo de estudo', icon: 'clock' },
  { id: 'conhecimento', label: 'Conhecimento',  icon: 'book' },
  { id: 'exploracao',   label: 'Exploração',    icon: 'compass' },
];

const ACH_PAGE_SIZE = 20;

/* ── Ícones (mesmo sistema Feather-style do protótipo) ── */
const svgWrap = (inner, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${inner}</svg>`;

const ICON_PATHS = {
  trophy: `<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 5H4a3 3 0 0 0 3 3"/><path d="M17 5h3a3 3 0 0 1-3 3"/>`,
  hourglass: `<path d="M6 3h12"/><path d="M6 21h12"/><path d="M7 3c0 5.5 5 6 5 9s-5 3.5-5 9"/><path d="M17 3c0 5.5-5 6-5 9s5 3.5 5 9"/>`,
  lock: `<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>`,
  gem: `<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20"/><path d="M9 3l3 6 3-6"/>`,
  check: `<polyline points="20 6 9 17 4 12"/>`,
  chevronLeft: `<polyline points="15 18 9 12 15 6"/>`,
  chevronRight: `<polyline points="9 18 15 12 9 6"/>`,
  trending: `<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>`,
  calendar: `<rect x="3" y="4.5" width="18" height="16" rx="2"/><line x1="16" y1="2.5" x2="16" y2="6.5"/><line x1="8" y1="2.5" x2="8" y2="6.5"/><line x1="3" y1="10" x2="21" y2="10"/>`,
  flame: `<path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c0-1.5-1-2-1-3.5 2 1.5 3 4 3 6.5a5 5 0 0 1-10 0c0-4 3-6 5-11z"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>`,
  book: `<path d="M2 5.5h7a3 3 0 0 1 3 3V20a2.2 2.2 0 0 0-2-1.4H2z"/><path d="M22 5.5h-7a3 3 0 0 0-3 3V20a2.2 2.2 0 0 1 2-1.4h8z"/>`,
  compass: `<circle cx="12" cy="12" r="9"/><polygon points="15 9 12.5 12.5 9 15 11.5 11.5"/>`,
};
function icon(name, extra = '') {
  return svgWrap(ICON_PATHS[name] ?? '', extra);
}

/* ══════════════════════════════════════════════
   ESTADO DE UI (não é dado de negócio — apenas
   seleção/paginação atual da pessoa na interface)
══════════════════════════════════════════════ */
let _achFiltroAtivo    = 'todas';
let _achPage           = 1;
let _achDadosAtuais    = [];
let _achInicializado   = false;

/* ══════════════════════════════════════════════
   POSICIONAMENTO DO POPOVER — apenas UX/apresentação.
   Não é lógica de negócio: só decide ONDE o painel de
   detalhe aparece na tela em relação ao card clicado.
══════════════════════════════════════════════ */
const ACH_POPOVER_GAP    = 12; // espaço entre o card e o painel
const ACH_POPOVER_MARGIN = 16; // respiro mínimo até a borda da viewport
const ACH_POPOVER_ARROW_MIN = 20; // distância mínima da seta até um canto arredondado do painel

let _achAnchorEl = null; // card (ou featured-card) que originou o popover aberto no momento

/* Calcula e aplica a posição (top/left), o lado (data-side) e o
   alinhamento da seta do popover, a partir da posição REAL do card
   na tela (getBoundingClientRect) — não de um valor fixo. Lógica:
     1. Tenta abrir à DIREITA do card.
     2. Se não couber, tenta à ESQUERDA.
     3. Se não couber em nenhuma lateral (telas menores), abre
        ABAIXO do card — ou ACIMA, se também não houver espaço
        suficiente embaixo.
     4. Em qualquer um dos casos, a posição final é sempre
        "clampada" para nunca deixar o painel sair da viewport.
   O painel já está no DOM com o conteúdo preenchido (mas
   visibility:hidden, conforme CSS) no momento desta chamada, então
   offsetWidth/offsetHeight refletem o tamanho real do conteúdo
   atual — inclusive quando limitado por max-height/overflow-y.
   Como o CSS agora usa height:auto (ver AJUSTE de altura no CSS),
   offsetHeight aqui já reflete a altura NATURAL do conteúdo (sem
   forçar scrollbar), exceto quando ela realmente ultrapassa
   max-height — só nesse caso o painel rola internamente. */
function _achPosicionarPopover(anchorEl) {
  const modal = document.getElementById('ach-modal-content');
  if (!modal || !anchorEl) return;

  const rect = anchorEl.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const pw = modal.offsetWidth;
  const ph = modal.offsetHeight;

  let side, top, left;

  const cabeDireita  = rect.right + ACH_POPOVER_GAP + pw <= vw - ACH_POPOVER_MARGIN;
  const cabeEsquerda = rect.left  - ACH_POPOVER_GAP - pw >= ACH_POPOVER_MARGIN;

  if (cabeDireita) {
    side = 'right';
    left = rect.right + ACH_POPOVER_GAP;
    top  = rect.top + rect.height / 2 - ph / 2;
  } else if (cabeEsquerda) {
    side = 'left';
    left = rect.left - ACH_POPOVER_GAP - pw;
    top  = rect.top + rect.height / 2 - ph / 2;
  } else {
    const cabeAbaixo = rect.bottom + ACH_POPOVER_GAP + ph <= vh - ACH_POPOVER_MARGIN;
    side = cabeAbaixo ? 'below' : 'above';
    top  = cabeAbaixo ? rect.bottom + ACH_POPOVER_GAP : rect.top - ACH_POPOVER_GAP - ph;
    left = rect.left + rect.width / 2 - pw / 2;
  }

  /* Clamp final — nunca deixa o painel sair da viewport em nenhuma
     das quatro direções, independentemente do lado escolhido acima. */
  top  = Math.max(ACH_POPOVER_MARGIN, Math.min(top,  vh - ph - ACH_POPOVER_MARGIN));
  left = Math.max(ACH_POPOVER_MARGIN, Math.min(left, vw - pw - ACH_POPOVER_MARGIN));

  modal.style.top  = `${top}px`;
  modal.style.left = `${left}px`;
  modal.dataset.side = side;

  /* Seta — alinhada com o centro do card no eixo relevante para o
     lado escolhido (vertical para direita/esquerda, horizontal para
     abaixo/acima), sempre mantida a uma distância mínima dos cantos
     arredondados do próprio painel. */
  if (side === 'right' || side === 'left') {
    const centroCardY = rect.top + rect.height / 2;
    const arrowTop = Math.max(ACH_POPOVER_ARROW_MIN, Math.min(centroCardY - top, ph - ACH_POPOVER_ARROW_MIN));
    modal.style.setProperty('--ach-pop-arrow', `${arrowTop}px`);
  } else {
    const centroCardX = rect.left + rect.width / 2;
    const arrowLeft = Math.max(ACH_POPOVER_ARROW_MIN, Math.min(centroCardX - left, pw - ACH_POPOVER_ARROW_MIN));
    modal.style.setProperty('--ach-pop-arrow', `${arrowLeft}px`);
  }
}

/* AJUSTE 3 — scroll e resize fazem a MESMA coisa: reposicionar o
   painel em relação ao card (que pode ter se movido na tela), sem
   NUNCA fechá-lo. `capture:true` no listener de scroll (aplicado
   onde a função é registrada, em _achAbrirModal) garante que o
   reposicionamento funcione mesmo que a rolagem aconteça num
   container interno (ex.: <main class="main">), não só na janela. */
function _achOnScrollOuResizeReposicionar() {
  if (_achAnchorEl) _achPosicionarPopover(_achAnchorEl);
}

/* ══════════════════════════════════════════════
   API PÚBLICA
══════════════════════════════════════════════ */
export function renderAchievements(relatorio) {
  _achInicializarUmaVez();

  const conquistas = relatorio?.conquistas ?? {};
  const progresso  = relatorio?.conquistasProgresso ?? {};

  _achDadosAtuais = _achComputarItens(conquistas, progresso);

  _achRenderOverview(_achDadosAtuais);
  _achRenderFeatured(_achDadosAtuais);
  _achRenderGrid();
}

/* ══════════════════════════════════════════════
   TRANSFORMAÇÃO DE DADOS
   ─────────────────────────────────────────────
   Único ponto que lê relatorio.conquistas /
   conquistasProgresso. Zero cálculo de negócio:
   apenas classifica o catálogo estático em
   desbloqueada / em progresso / bloqueada.
══════════════════════════════════════════════ */
function _achComputarItens(conquistas, progresso) {
  return CONQUISTAS_CATALOGO.map(c => {
    const desbloqueada = conquistas[c.id] === true;
    const prog = progresso[c.id];
    const emProgresso = !desbloqueada && !!prog && prog.atual > 0;

    const status = desbloqueada ? 'unlocked' : (emProgresso ? 'progress' : 'locked');
    const pct = emProgresso && prog.meta > 0
      ? Math.max(0, Math.min(100, Math.round((prog.atual / prog.meta) * 100)))
      : (desbloqueada ? 100 : null);

    return {
      id:          c.id,
      nome:        c.nome,
      desc:        c.desc,
      emoji:       c.emoji,
      cat:         CATEGORIA_MAP[c.categoria] ?? 'exploracao',
      rarity:      TAG_RARIDADE_MAP[c.tag] ?? 'comum',
      status,
      progress:    emProgresso ? pct : null,
      requirement: desbloqueada
        ? 'Concluído'
        : (emProgresso ? _achFormatarValor(prog, pct) : 'Detalhes revelados ao progredir'),
    };
  });
}

function _achFormatarValor(prog, pct) {
  if (!prog) return '';
  if (prog.tipo === 'tempo')      return `${_achFormatarTempo(prog.atual)} / ${_achFormatarTempo(prog.meta)} (${pct}%)`;
  if (prog.tipo === 'percentual') return `${Math.round(prog.atual)}% / ${prog.meta}%`;
  return `${prog.atual}/${prog.meta} concluído`;
}

function _achFormatarTempo(segundos) {
  const s = segundos ?? 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h${m > 0 ? m + 'm' : ''}`;
  return `${m}m`;
}

/* Rótulo de "data" — o sistema não persiste timestamp de
   desbloqueio por conquista, então usamos um rótulo neutro em
   vez de inventar uma data. Ver nota de limitação no topo do
   arquivo. */
function _achRotuloData() {
  return 'Concluída';
}

/* ══════════════════════════════════════════════
   INICIALIZAÇÃO ÚNICA (ícones estáticos + listeners)
══════════════════════════════════════════════ */
function _achInicializarUmaVez() {
  if (_achInicializado) return;
  _achInicializado = true;

  const setIcon = (id, name) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = icon(name);
  };
  setIcon('ach-icon-trophy',   'trophy');
  setIcon('ach-icon-progress', 'hourglass');
  setIcon('ach-icon-locked',   'lock');
  setIcon('ach-icon-rare',     'gem');

  const tabsWrap = document.getElementById('ach-cat-tabs');
  if (tabsWrap) {
    tabsWrap.innerHTML = ACH_CATS.map(cat => `
      <button type="button" class="cat-tab${cat.id === _achFiltroAtivo ? ' active' : ''}" data-cat="${cat.id}">
        ${cat.icon ? icon(cat.icon) : ''}${escapeHtml(cat.label)}
      </button>`).join('');

    tabsWrap.addEventListener('click', e => {
      const btn = e.target.closest('.cat-tab');
      if (!btn) return;
      tabsWrap.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      _achFiltroAtivo = btn.dataset.cat;
      _achPage = 1;
      _achRenderGrid();
    });
  }

  /* REFINAMENTO 4 — clique fora fecha o painel.
     ANTES: o backdrop cobria a tela inteira com pointer-events:auto
     sempre que o painel estava aberto — então QUALQUER clique
     (inclusive em outro card de conquista) era engolido pelo
     backdrop antes de chegar ao elemento de baixo, e fechava o
     painel. Era essa a causa real do "fecha sozinho".
     AGORA: o backdrop nunca intercepta cliques (ver CSS,
     pointer-events:none fixo). Quem detecta "clique fora" é este
     listener no document: só fecha se o clique não foi dentro do
     painel E não foi em nenhum card de conquista — nesse último
     caso, quem decide o que fazer é o próprio handler do card
     (_achAbrirModalPorId), que já sabe abrir, trocar de conquista
     ou fechar via toggle (clique de novo no mesmo card). */
  document.addEventListener('click', e => {
    const backdrop = document.getElementById('ach-modal-backdrop');
    if (!backdrop?.classList.contains('open')) return;
    const modalEl = document.getElementById('ach-modal-content');
    if (modalEl?.contains(e.target)) return;
    if (e.target.closest('.ach-card, .featured-card')) return;
    _achFecharModal();
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') _achFecharModal(); });
}

/* ══════════════════════════════════════════════
   RENDER — OVERVIEW (anel + chips de resumo)
══════════════════════════════════════════════ */
function _achRenderOverview(itens) {
  const total         = itens.length;
  const desbloqueadas = itens.filter(i => i.status === 'unlocked').length;
  const emAndamento   = itens.filter(i => i.status === 'progress').length;
  const bloqueadas    = total - desbloqueadas - emAndamento;
  const pct           = total > 0 ? Math.round((desbloqueadas / total) * 100) : 0;
  const rarasOuMais   = itens.filter(i =>
    i.status === 'unlocked' && ['rara', 'epica', 'lendaria'].includes(i.rarity)
  ).length;


  const elRingFill = document.getElementById('ach-ring-fill');
const elRingLabel = document.getElementById('ach-ring-label');
if (elRingFill) {
 const circunferencia = 125.7; // 2πr, r=20
  const offset = circunferencia - (circunferencia * pct) / 100;
  elRingFill.style.strokeDasharray  = `${circunferencia}`;
  elRingFill.style.strokeDashoffset = `${offset}`;
}
if (elRingLabel) elRingLabel.textContent = `${pct}%`;

const elValue = document.getElementById('ach-overview-value');
if (elValue) elValue.textContent = desbloqueadas;

/* Legenda "{n} de {total} desbloqueadas". O número (#ach-overview-value)
   e esta legenda são <span> adjacentes sem espaço no HTML, então o
   espaço antes de "de" precisa vir daqui — por isso a string começa
   com espaço. (Ver nota de correção no topo do arquivo: havia uma
   segunda atribuição duplicada, sem esse espaço, que sobrescrevia
   esta e causava "1de 48 desbloqueadas".) */
const elCaption = document.getElementById('ach-overview-caption');
if (elCaption) elCaption.textContent = ` de ${total} desbloqueadas`;

  const setNum = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setNum('ach-stat-progress-num', emAndamento);
  setNum('ach-stat-locked-num',   bloqueadas);
  setNum('ach-stat-rare-num',     rarasOuMais);
}

/* ══════════════════════════════════════════════
   RENDER — DESTAQUES (no máximo 3)
══════════════════════════════════════════════ */
function _achRenderFeatured(itens) {
  const elRow   = document.getElementById('ach-featured-row');
  const elBlock = document.getElementById('ach-featured-block');
  if (!elRow) return;

  const emProgresso = itens
    .filter(i => i.status === 'progress')
    .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));

  let destaques = emProgresso.slice(0, 3);

  if (destaques.length < 3) {
    const desbloqueadas = itens
      .filter(i => i.status === 'unlocked')
      .sort((a, b) => (RARIDADE_PESO[b.rarity] ?? 0) - (RARIDADE_PESO[a.rarity] ?? 0));
    for (const item of desbloqueadas) {
      if (destaques.length >= 3) break;
      if (!destaques.some(d => d.id === item.id)) destaques.push(item);
    }
  }

  if (elBlock) elBlock.style.display = destaques.length === 0 ? 'none' : '';
  if (destaques.length === 0) { elRow.innerHTML = ''; return; }

  elRow.innerHTML = destaques.map(item => {
    const corVar = `var(--r-${item.rarity})`;
    const corridaHtml = item.status === 'unlocked'
      ? `<div class="f-done">${icon('check')}${_achRotuloData()}</div>`
      : `<div class="f-progress"><div class="f-progress-fill" style="width:${item.progress ?? 0}%;"></div></div>
         <div class="f-meta"><span>${escapeHtml(item.requirement)}</span><span>${item.progress ?? 0}%</span></div>`;

    return `
      <div class="featured-card" style="--f-color:${corVar};" data-id="${item.id}" tabindex="0">
        <div class="f-medal">${icon(item.status === 'locked' ? 'lock' : 'gem')}</div>
        <div class="f-body">
          <span class="f-rarity">${RARITY_LABEL[item.rarity]}</span>
          <h4>${escapeHtml(item.nome)}</h4>
          <p>${escapeHtml(item.desc)}</p>
          ${corridaHtml}
        </div>
      </div>`;
  }).join('');

  elRow.querySelectorAll('.featured-card').forEach(el => {
    el.addEventListener('click', () => _achAbrirModalPorId(el.dataset.id, el));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _achAbrirModalPorId(el.dataset.id, el); }
    });
  });
}

/* ══════════════════════════════════════════════
   RENDER — GRID + PAGINAÇÃO
══════════════════════════════════════════════ */
function _achFilteredData() {
  return _achFiltroAtivo === 'todas'
    ? _achDadosAtuais
    : _achDadosAtuais.filter(i => i.cat === _achFiltroAtivo);
}

function _achRenderGrid() {
  const itens = _achFilteredData();
  const elCount = document.getElementById('ach-grid-count');
  if (elCount) elCount.textContent = ` · ${itens.length}`;

  const totalPages = Math.max(1, Math.ceil(itens.length / ACH_PAGE_SIZE));
  _achPage = Math.min(_achPage, totalPages);
  const start = (_achPage - 1) * ACH_PAGE_SIZE;
  const pageItems = itens.slice(start, start + ACH_PAGE_SIZE);

  const grid = document.getElementById('ach-grid');
  if (!grid) return;

  if (itens.length === 0) {
    grid.innerHTML = `<div class="ach-empty-grid">Nenhuma conquista nesta categoria ainda.</div>`;
  } else {
    grid.innerHTML = pageItems.map(item => {
      const stateClass = item.status === 'unlocked' ? 'state-unlocked' : (item.status === 'progress' ? 'state-progress' : 'locked');
      const showLockIcon = item.status === 'locked';
      const caption = item.status === 'unlocked'
        ? _achRotuloData()
        : (item.status === 'progress' ? `${item.progress}%` : 'Bloqueada');

      return `
        <div class="ach-card ${stateClass}" data-rarity="${item.rarity}" data-id="${item.id}" tabindex="0">
          ${item.rarity === 'lendaria' && item.status === 'unlocked' ? '<span class="legend-dot"></span>' : ''}
          <div class="medal">${icon(showLockIcon ? 'lock' : 'gem')}</div>
          <div class="ach-name">${escapeHtml(item.nome)}</div>
          <div class="ach-desc">${escapeHtml(item.desc)}</div>
          ${item.progress !== null && item.status !== 'unlocked' ? `<div class="mini-progress"><div class="mini-progress-fill" style="width:${item.progress}%;"></div></div>` : ''}
          <div class="hover-caption">${escapeHtml(caption)}</div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.ach-card').forEach(el => {
      el.addEventListener('click', () => _achAbrirModalPorId(el.dataset.id, el));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _achAbrirModalPorId(el.dataset.id, el); }
      });
    });
  }

  _achRenderPager(totalPages);
}

function _achRenderPager(totalPages) {
  const pager = document.getElementById('ach-pager');
  if (!pager) return;
  pager.innerHTML = '';

  const mkBtn = (content, page, opts = {}) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = content;
    if (opts.active)   b.classList.add('active');
    if (opts.disabled) b.disabled = true;
    b.addEventListener('click', () => { _achPage = page; _achRenderGrid(); });
    return b;
  };

  pager.appendChild(mkBtn(icon('chevronLeft'), _achPage - 1, { disabled: _achPage === 1 }));

  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - _achPage) <= 1) pages.push(p);
  }
  let last = 0;
  pages.forEach(p => {
    if (p - last > 1) {
      const span = document.createElement('span');
      span.className = 'ellipsis';
      span.textContent = '…';
      pager.appendChild(span);
    }
    pager.appendChild(mkBtn(String(p), p, { active: p === _achPage }));
    last = p;
  });

  pager.appendChild(mkBtn(icon('chevronRight'), _achPage + 1, { disabled: _achPage === totalPages }));
}

/* ══════════════════════════════════════════════
   MODAL / POPOVER
══════════════════════════════════════════════ */

/* AJUSTE 3 — toggle: clicar de novo no MESMO card que já está com o
   painel aberto fecha o painel, em vez de reabri-lo. Clicar em outro
   card enquanto o painel já está aberto simplesmente abre o novo
   (comportamento inalterado). */
function _achAbrirModalPorId(id, anchorEl) {
  const backdrop = document.getElementById('ach-modal-backdrop');
  const mesmoCardJaAberto = backdrop?.classList.contains('open') && _achAnchorEl === anchorEl;
  if (mesmoCardJaAberto) { _achFecharModal(); return; }

  const item = _achDadosAtuais.find(i => i.id === id);
  if (item) _achAbrirModal(item, anchorEl);
}

function _achAbrirModal(item, anchorEl) {
  const backdrop = document.getElementById('ach-modal-backdrop');
  const content  = document.getElementById('ach-modal-content');
  if (!backdrop || !content) return;

  const showLockIcon = item.status === 'locked';
  const corVar = `var(--r-${item.rarity})`;

  content.innerHTML = `
    <div class="medal" style="border-color:${corVar}; --card-ring:${corVar};">${icon(showLockIcon ? 'lock' : 'gem')}</div>
    <h3>${escapeHtml(item.nome)}</h3>
    <div class="m-rarity" style="color:${corVar};">${RARITY_LABEL[item.rarity]}</div>
    <p class="desc">${escapeHtml(item.desc)}</p>
    ${item.progress !== null && item.status !== 'unlocked' ? `<div class="mini-progress" style="height:4px; margin-bottom:14px;"><div class="mini-progress-fill" style="width:${item.progress}%; background:${corVar};"></div></div>` : ''}
    <div class="meta-row"><span>Requisito</span><b>${escapeHtml(item.requirement)}</b></div>
    <div class="meta-row" style="border-bottom:1px solid var(--border);">
      <span>${item.status === 'unlocked' ? 'Status' : 'Status'}</span>
      <b>${item.status === 'unlocked' ? _achRotuloData() : (item.status === 'progress' ? 'Em andamento' : 'Bloqueada')}</b>
    </div>
    <button type="button" class="close-btn" id="ach-modal-close-btn">Fechar</button>
  `;

  _achAnchorEl = anchorEl ?? null;
  if (_achAnchorEl) _achPosicionarPopover(_achAnchorEl);

  backdrop.classList.add('open');

  /* REFINAMENTO 4 — animação de abertura via classe + @keyframes.
     Remove qualquer resquício de animação de saída em andamento
     (troca rápida de card) e força um reflow antes de religar
     is-opening, garantindo que a keyframe sempre reinicie do zero
     — mesmo se o painel estivesse no meio de um fechamento. */
  content.classList.remove('is-closing');
  content.classList.remove('is-opening');
  void content.offsetWidth;
  content.classList.add('is-opening');

  window.addEventListener('scroll', _achOnScrollOuResizeReposicionar, true);
  window.addEventListener('resize', _achOnScrollOuResizeReposicionar);

  document.getElementById('ach-modal-close-btn')?.addEventListener('click', _achFecharModal);
}
function _achFecharModal() {
  const backdrop = document.getElementById('ach-modal-backdrop');
  const content  = document.getElementById('ach-modal-content');
  if (!backdrop?.classList.contains('open')) return; // já fechado, evita reprocessar

  backdrop.classList.remove('open');
  window.removeEventListener('scroll', _achOnScrollOuResizeReposicionar, true);
  window.removeEventListener('resize', _achOnScrollOuResizeReposicionar);
  _achAnchorEl = null;

  if (content) {
    content.classList.remove('is-opening');
    content.classList.add('is-closing');
    // Ao fim da animação de saída, remove a classe — o painel volta
    // ao estado base (opacity:0/visibility:hidden do CSS), sem flash.
    content.addEventListener('animationend', function onEnd() {
      content.classList.remove('is-closing');
      content.removeEventListener('animationend', onEnd);
    }, { once: true });
  }
}