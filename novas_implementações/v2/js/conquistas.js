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

  const backdrop = document.getElementById('ach-modal-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', e => { if (e.target === backdrop) _achFecharModal(); });
  }
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
    el.addEventListener('click', () => _achAbrirModalPorId(el.dataset.id));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _achAbrirModalPorId(el.dataset.id); }
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
      el.addEventListener('click', () => _achAbrirModalPorId(el.dataset.id));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _achAbrirModalPorId(el.dataset.id); }
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
   MODAL
══════════════════════════════════════════════ */
function _achAbrirModalPorId(id) {
  const item = _achDadosAtuais.find(i => i.id === id);
  if (item) _achAbrirModal(item);
}

function _achAbrirModal(item) {
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
  backdrop.classList.add('open');
  document.getElementById('ach-modal-close-btn')?.addEventListener('click', _achFecharModal);
}

function _achFecharModal() {
  document.getElementById('ach-modal-backdrop')?.classList.remove('open');
}