/* dashboard\js\conquistas.js
   proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   ─────────────────────────────────────────────
   REDESIGN — ARQUITETURA ESCALÁVEL DA GALERIA
   ─────────────────────────────────────────────
   Reescrita completa da seção Conquistas. O contrato de entrada
   NÃO mudou: continua recebendo apenas (relatorio) com
   relatorio.conquistas + relatorio.conquistasProgresso, sem
   nenhum cálculo de negócio, sem Firebase, sem
   NexusQuizIntelligence — só leitura de estado e montagem de HTML.

   O que mudou é a FORMA como isso é exibido, para que a seção
   continue organizada com 20, 50, 100 ou 200 conquistas:

   1. Zona superior compacta (resumo + filtros lado a lado),
      sem repetir informação e sem ocupar espaço vertical.
   2. Destaques — SEMPRE no máximo 3 cards, nunca mais.
   3. Galeria — CSS Grid de cards pequenos (≈230px), com
      PAGINAÇÃO client-side ("Mostrar mais"): o catálogo inteiro
      nunca é jogado de uma vez no DOM. Isso é o que garante que
      200 conquistas continuem leves e organizadas — sem depender
      de scroll interno infinito nem de recalcular layout a cada
      conquista adicionada ao catálogo.

   Nenhuma dependência de arquivo externo (mesma decisão do
   arquivo original): escapeHtml() é uma cópia local e privada.
   ═══════════════════════════════════════════════════════════ */

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/* ── Catálogo de conquistas — definição estática, sem lógica ──
   (idêntico ao contrato anterior — nenhum id/campo foi alterado,
   apenas mantido aqui como fonte única de verdade do catálogo) */
const CONQUISTAS_CATALOGO = [
  { id: 'primeiroPasso',      categoria: 'estudo',         emoji: '🌱', nome: 'Primeiro Passo',          desc: 'Concluiu o primeiro quiz',                               tag: 'Bronze', tagCls: 'tag-bronze' },
  { id: 'tentativas10',       categoria: 'estudo',         emoji: '📝', nome: '10 Tentativas',          desc: 'Completou 10 quizzes na plataforma',                      tag: 'Bronze', tagCls: 'tag-bronze' },
  { id: 'tentativas50',       categoria: 'estudo',         emoji: '📝', nome: '50 Tentativas',          desc: 'Completou 50 quizzes na plataforma',                      tag: 'Prata',  tagCls: 'tag-silver' },
  { id: 'tentativas100',      categoria: 'estudo',         emoji: '📝', nome: '100 Tentativas',         desc: 'Completou 100 quizzes na plataforma',                     tag: 'Prata',  tagCls: 'tag-silver' },
  { id: 'tentativas500',      categoria: 'estudo',         emoji: '📚', nome: '500 Tentativas',         desc: 'Completou 500 quizzes na plataforma',                     tag: 'Ouro',   tagCls: 'tag-gold' },

  { id: 'questoes100',        categoria: 'conhecimento',   emoji: '⚡', nome: '100 Questões',           desc: 'Respondeu 100 questões',                                  tag: 'Bronze', tagCls: 'tag-bronze' },
  { id: 'questoes500',        categoria: 'conhecimento',   emoji: '⚡', nome: '500 Questões',           desc: 'Respondeu 500 questões',                                  tag: 'Prata',  tagCls: 'tag-silver' },
  { id: 'questoesMil',        categoria: 'conhecimento',   emoji: '⚡', nome: 'Mil Questões',           desc: 'Respondeu mais de 1.000 questões',                         tag: 'Ouro',   tagCls: 'tag-gold' },
  { id: 'questoes5000',       categoria: 'conhecimento',   emoji: '⚡', nome: '5 Mil Questões',         desc: 'Respondeu mais de 5.000 questões',                         tag: 'Diamante', tagCls: 'tag-diamond' },

  { id: 'sequencia3',         categoria: 'sequencias',     emoji: '🔥', nome: 'Sequência de 3 dias',    desc: 'Estudou por 3 dias consecutivos',                          tag: 'Bronze', tagCls: 'tag-bronze' },
  { id: 'sequencia7',         categoria: 'sequencias',     emoji: '🔥', nome: 'Sequência de 7 dias',    desc: 'Estudou por 7 dias consecutivos',                          tag: 'Prata',  tagCls: 'tag-silver' },
  { id: 'sequencia15',        categoria: 'sequencias',     emoji: '🔥', nome: 'Sequência de 15 dias',   desc: 'Estudou por 15 dias consecutivos',                         tag: 'Ouro',   tagCls: 'tag-gold' },
  { id: 'sequencia30',        categoria: 'sequencias',     emoji: '🔥', nome: 'Sequência de 30 dias',   desc: 'Estudou por 30 dias consecutivos',                         tag: 'Ouro',   tagCls: 'tag-gold' },
  { id: 'sequencia100',       categoria: 'sequencias',     emoji: '🔥', nome: 'Sequência de 100 dias',  desc: 'Estudou por 100 dias consecutivos',                        tag: 'Diamante', tagCls: 'tag-diamond' },

  { id: 'tempo1h',            categoria: 'tempo',          emoji: '⏱️', nome: '1 Hora',                 desc: 'Acumulou 1 hora de estudo',                                tag: 'Bronze', tagCls: 'tag-bronze' },
  { id: 'tempo10h',           categoria: 'tempo',          emoji: '⏱️', nome: '10 Horas',               desc: 'Acumulou 10 horas de estudo',                              tag: 'Prata',  tagCls: 'tag-silver' },
  { id: 'tempo50h',           categoria: 'tempo',          emoji: '⏱️', nome: '50 Horas',               desc: 'Acumulou 50 horas de estudo',                              tag: 'Ouro',   tagCls: 'tag-gold' },
  { id: 'tempo100h',          categoria: 'tempo',          emoji: '🏅', nome: '100 Horas',              desc: 'Acumulou 100 horas de estudo',                             tag: 'Diamante', tagCls: 'tag-diamond' },
  { id: 'maratonista',        categoria: 'tempo',          emoji: '🏆', nome: 'Maratonista',            desc: 'Estudou mais de 5 horas em um único dia',                  tag: 'Ouro',   tagCls: 'tag-gold' },

  { id: 'scoreIntermediario', categoria: 'desempenho',     emoji: '🎯', nome: 'Score Intermediário',    desc: 'Atingiu nível Intermediário',                              tag: 'Prata',  tagCls: 'tag-silver' },
  { id: 'scoreAvancado',      categoria: 'desempenho',     emoji: '🎯', nome: 'Score Avançado',         desc: 'Atingiu nível Avançado',                                   tag: 'Ouro',   tagCls: 'tag-gold' },
  { id: 'scoreElite',         categoria: 'desempenho',     emoji: '👑', nome: 'Score Elite',            desc: 'Atingiu o maior nível de desempenho',                      tag: 'Diamante', tagCls: 'tag-diamond' },
  { id: 'miraAfiada',         categoria: 'desempenho',     emoji: '🎯', nome: 'Mira Afiada',            desc: 'Mais de 75% de acertos na média geral',                    tag: 'Ouro',   tagCls: 'tag-gold' },
  { id: 'precisao90',         categoria: 'desempenho',     emoji: '🎯', nome: 'Precisão Máxima',        desc: 'Alcançou 90% de acertos',                                  tag: 'Diamante', tagCls: 'tag-diamond' },

  { id: 'emEvolucao',         categoria: 'desempenho',     emoji: '📈', nome: 'Em Evolução',            desc: 'O sistema detectou melhora constante',                     tag: 'Prata',  tagCls: 'tag-silver' },
  { id: 'superacao',          categoria: 'desempenho',     emoji: '🚀', nome: 'Superação',              desc: 'Melhorou significativamente seu desempenho',               tag: 'Ouro',   tagCls: 'tag-gold' },
  { id: 'semQuedas',          categoria: 'consistencia',   emoji: '✅', nome: 'Sem Quedas',             desc: 'Nenhuma disciplina em queda',                              tag: 'Prata',  tagCls: 'tag-silver' },
  { id: 'equilibrado',        categoria: 'consistencia',   emoji: '⚖️', nome: 'Equilibrado',            desc: 'Todas as disciplinas possuem bom desempenho',              tag: 'Ouro',   tagCls: 'tag-gold' },

  { id: 'sessoes10',          categoria: 'consistencia',   emoji: '📅', nome: '10 Sessões',             desc: 'Realizou 10 sessões de estudo',                            tag: 'Bronze', tagCls: 'tag-bronze' },
  { id: 'sessoes50',          categoria: 'consistencia',   emoji: '🏆', nome: '50 Sessões',             desc: 'Realizou 50 sessões de estudo',                            tag: 'Ouro',   tagCls: 'tag-gold' },
  { id: 'sessoes100',         categoria: 'consistencia',   emoji: '🏆', nome: '100 Sessões',            desc: 'Realizou 100 sessões de estudo',                           tag: 'Diamante', tagCls: 'tag-diamond' },

  { id: 'explorador',         categoria: 'plataforma',     emoji: '🧭', nome: 'Explorador',             desc: 'Visitou todas as áreas da plataforma',                     tag: 'Bronze', tagCls: 'tag-bronze' },
  { id: 'organizado',         categoria: 'plataforma',     emoji: '📂', nome: 'Organizado',             desc: 'Criou sua primeira disciplina',                            tag: 'Bronze', tagCls: 'tag-bronze' },
  { id: 'dedicado',           categoria: 'plataforma',     emoji: '📖', nome: 'Dedicado',               desc: 'Leu 100 conteúdos',                                        tag: 'Prata',  tagCls: 'tag-silver' },
  { id: 'curioso',            categoria: 'plataforma',     emoji: '🔎', nome: 'Curioso',                desc: 'Pesquisou diversos conteúdos na plataforma',               tag: 'Bronze', tagCls: 'tag-bronze' },

  { id: 'madrugador',         categoria: 'habitos',        emoji: '🌅', nome: 'Madrugador',             desc: 'Estudou antes das 6h da manhã',                            tag: 'Prata',  tagCls: 'tag-silver' },
  { id: 'noturno',            categoria: 'habitos',        emoji: '🌙', nome: 'Coruja',                 desc: 'Estudou após as 23h',                                      tag: 'Prata',  tagCls: 'tag-silver' },
  { id: 'pontual',            categoria: 'habitos',        emoji: '⏰', nome: 'Pontual',                desc: 'Estudou no horário planejado por 7 dias',                  tag: 'Ouro',   tagCls: 'tag-gold' },

  { id: 'focoTotal',          categoria: 'habitos',        emoji: '🧠', nome: 'Foco Total',             desc: 'Concluiu uma sessão sem interrupções',                     tag: 'Bronze', tagCls: 'tag-bronze' },
  { id: 'incansavel',         categoria: 'habitos',        emoji: '💪', nome: 'Incansável',             desc: 'Completou 10 dias com mais de 2 horas de estudo',          tag: 'Ouro',   tagCls: 'tag-gold' },

  { id: 'colecionador',       categoria: 'especial',       emoji: '🏅', nome: 'Colecionador',           desc: 'Desbloqueou 10 conquistas',                                tag: 'Prata',  tagCls: 'tag-silver' },
  { id: 'veterano',           categoria: 'especial',       emoji: '🎖️', nome: 'Veterano',              desc: 'Desbloqueou 25 conquistas',                                tag: 'Ouro',   tagCls: 'tag-gold' },
  { id: 'lendario',           categoria: 'especial',       emoji: '👑', nome: 'Lendário',               desc: 'Desbloqueou 50 conquistas',                                tag: 'Diamante', tagCls: 'tag-diamond' },

  { id: 'persistente',        categoria: 'especial',       emoji: '🛡️', nome: 'Persistente',            desc: 'Nunca desistiu de um quiz iniciado',                       tag: 'Ouro',   tagCls: 'tag-gold' },
  { id: 'estrela',            categoria: 'especial',       emoji: '⭐', nome: 'Estrela',                 desc: 'Recebeu destaque em desempenho',                           tag: 'Ouro',   tagCls: 'tag-gold' },
  { id: 'genio',              categoria: 'especial',       emoji: '🧠', nome: 'Gênio',                  desc: 'Acertou 100 questões consecutivas',                        tag: 'Diamante', tagCls: 'tag-diamond' },
  { id: 'invencivel',         categoria: 'especial',       emoji: '💎', nome: 'Invencível',             desc: 'Manteve desempenho excelente por um mês',                  tag: 'Diamante', tagCls: 'tag-diamond' },
  { id: 'nexusMaster',        categoria: 'especial',       emoji: '🌌', nome: 'Nexus Master',           desc: 'Alcançou o nível máximo da plataforma',                    tag: 'Diamante', tagCls: 'tag-diamond' }
];

const ACH_CATEGORIAS = [
  { id: 'todas',        label: 'Todas' },
  { id: 'desempenho',   label: 'Desempenho' },
  { id: 'consistencia', label: 'Consistência' },
  { id: 'estudo',       label: 'Estudo' },
  { id: 'conhecimento', label: 'Conhecimento' },
  { id: 'sequencias',   label: 'Sequências' },
  { id: 'tempo',        label: 'Tempo de estudo' },
  { id: 'plataforma',   label: 'Plataforma' },
  { id: 'habitos',      label: 'Hábitos' },
  { id: 'especial',     label: 'Especiais' },
];

/* Quantos cards a galeria revela por vez. É este número — não o
   tamanho do catálogo — que define o custo de renderização.
   Adicionar mais 100 conquistas ao catálogo não deixa a seção
   mais pesada: o DOM continua limitado a PAGE_SIZE + os já
   carregados pelo usuário nesta sessão de navegação. */
const ACH_PAGE_SIZE = 20;

/* ── Estado de UI exclusivo deste módulo ──────────────────────
   Nenhum dado de negócio — apenas a seleção/paginação atual do
   usuário na interface, mesma responsabilidade que o módulo já
   tinha antes (filtro ativo). */
let _achFiltroAtivo   = 'todas';
let _achVisiveisQtd   = ACH_PAGE_SIZE;
let _achUltimoRelatorio = null;

/* ══════════════════════════════════════════════
   API PÚBLICA
══════════════════════════════════════════════ */
export function renderAchievements(relatorio) {
  _achUltimoRelatorio = relatorio;

  const conquistas = relatorio?.conquistas ?? {};
  const progresso  = relatorio?.conquistasProgresso ?? {};

  const elSummary    = document.getElementById('ach-summary');
  const elFilters    = document.getElementById('ach-filters');
  const elHighlights = document.getElementById('ach-highlights');
  const elHighBlock  = document.getElementById('ach-highlights-block');
  const elLista      = document.getElementById('ach-list');

  if (!elLista) return;

  const total         = CONQUISTAS_CATALOGO.length;
  const desbloqueadas = CONQUISTAS_CATALOGO.filter(c => conquistas[c.id] === true).length;
  const bloqueadas    = total - desbloqueadas;
  const pct           = total > 0 ? Math.round((desbloqueadas / total) * 100) : 0;

  const emAndamentoQt = CONQUISTAS_CATALOGO.filter(c => {
    if (conquistas[c.id] === true) return false;
    const p = progresso[c.id];
    return p && p.atual > 0;
  }).length;

  /* ── Zona superior: resumo compacto (anel + chips) ── */
  if (elSummary) {
    elSummary.innerHTML = `
      <div class="ach-ring" style="--ach-pct:${pct}%">
        <div class="ach-ring-inner"><span class="ach-ring-pct">${pct}%</span></div>
      </div>
      <div class="ach-summary-text">
        <div class="ach-summary-headline"><strong>${desbloqueadas}</strong> de ${total} desbloqueadas</div>
        <div class="ach-summary-chips">
          <span class="ach-mini-chip"><i class="ach-dot ach-dot-unlock"></i>${desbloqueadas} desbloqueadas</span>
          <span class="ach-mini-chip"><i class="ach-dot ach-dot-progress"></i>${emAndamentoQt} em andamento</span>
          <span class="ach-mini-chip"><i class="ach-dot ach-dot-locked"></i>${bloqueadas} bloqueadas</span>
        </div>
      </div>
    `;
  }

  /* ── Zona superior: filtros por categoria ── */
  if (elFilters) {
    elFilters.innerHTML = '';
    ACH_CATEGORIAS.forEach(cat => {
      const btn = document.createElement('button');
      btn.type      = 'button';
      btn.className = 'ach-filter-pill' + (cat.id === _achFiltroAtivo ? ' is-active' : '');
      btn.textContent = cat.label;
      btn.addEventListener('click', () => {
        if (_achFiltroAtivo === cat.id) return;
        _achFiltroAtivo  = cat.id;
        _achVisiveisQtd  = ACH_PAGE_SIZE; /* nova seleção reinicia a paginação */
        renderAchievements(_achUltimoRelatorio);
      });
      elFilters.appendChild(btn);
    });
  }

  /* ── Destaques — NUNCA mais que 3 cards, sempre ──
     Prioridade: conquistas quase completas (maior % de progresso),
     preenchendo o restante com uma conquista de destaque já
     desbloqueada (Ouro/Diamante) quando houver espaço. */
  if (elHighlights && elHighBlock) {
    const candidatosProgresso = CONQUISTAS_CATALOGO
      .filter(c => conquistas[c.id] !== true && progresso[c.id])
      .map(c => {
        const p = progresso[c.id];
        const pctItem = p.meta > 0 ? Math.min(100, Math.round((p.atual / p.meta) * 100)) : 0;
        return { c, p, pctItem };
      })
      .filter(x => x.pctItem > 0)
      .sort((a, b) => b.pctItem - a.pctItem)
      .slice(0, 3);

    const cardsHtml = candidatosProgresso.map(({ c, p, pctItem }) => `
      <div class="ach-highlight-card">
        <span class="ach-highlight-ribbon">Quase lá</span>
        <div class="ach-highlight-icon">${c.emoji}</div>
        <div class="ach-highlight-name">${escapeHtml(c.nome)}</div>
        <div class="ach-highlight-bar"><div class="ach-highlight-bar-fill" style="width:${pctItem}%"></div></div>
        <div class="ach-highlight-meta">${_achFormatarValor(p)} · ${pctItem}%</div>
      </div>`);

    if (cardsHtml.length < 3) {
      const destacadaOuro = CONQUISTAS_CATALOGO.find(c =>
        conquistas[c.id] === true && (c.tag === 'Ouro' || c.tag === 'Diamante')
      );
      if (destacadaOuro) {
        cardsHtml.push(`
          <div class="ach-highlight-card is-unlocked">
            <span class="ach-highlight-ribbon ribbon-gold">Destaque</span>
            <div class="ach-highlight-icon">${destacadaOuro.emoji}</div>
            <div class="ach-highlight-name">${escapeHtml(destacadaOuro.nome)}</div>
            <span class="ach-tag ${destacadaOuro.tagCls}">${destacadaOuro.tag}</span>
          </div>`);
      }
    }

    if (cardsHtml.length === 0) {
      elHighBlock.style.display = 'none';
    } else {
      elHighBlock.style.display = '';
      /* Garantia dura do limite de 3, independentemente da lógica acima. */
      elHighlights.innerHTML = cardsHtml.slice(0, 3).join('');
    }
  }

  _renderGaleria(conquistas, progresso);
}

/* ══════════════════════════════════════════════
   GALERIA — grid paginado (o coração da escalabilidade)
══════════════════════════════════════════════ */
function _renderGaleria(conquistas, progresso) {
  const elLista = document.getElementById('ach-list');
  const elFooter = _achGarantirFooter(elLista);

  const itensFiltrados = _achFiltroAtivo === 'todas'
    ? CONQUISTAS_CATALOGO
    : CONQUISTAS_CATALOGO.filter(c => c.categoria === _achFiltroAtivo);

  if (itensFiltrados.length === 0) {
    elLista.innerHTML = `<div class="ach-empty">Nenhuma conquista nesta categoria ainda.</div>`;
    elFooter.innerHTML = '';
    return;
  }

  const visiveisQtd = Math.min(_achVisiveisQtd, itensFiltrados.length);
  const fatia = itensFiltrados.slice(0, visiveisQtd);

  elLista.innerHTML = fatia.map(c => _achCardHtml(c, conquistas, progresso)).join('');

  const restantes = itensFiltrados.length - visiveisQtd;
  if (restantes > 0) {
    const proximoLote = Math.min(ACH_PAGE_SIZE, restantes);
    elFooter.innerHTML = `
      <span class="ach-gallery-count">Mostrando ${visiveisQtd} de ${itensFiltrados.length}</span>
      <button type="button" class="ach-loadmore-btn" id="ach-loadmore-btn">Mostrar mais (+${proximoLote})</button>
    `;
    const btn = document.getElementById('ach-loadmore-btn');
    if (btn) btn.addEventListener('click', () => {
      _achVisiveisQtd += ACH_PAGE_SIZE;
      _renderGaleria(conquistas, progresso);
    });
  } else {
    elFooter.innerHTML = `<span class="ach-gallery-count">Mostrando todas as ${itensFiltrados.length} conquistas desta categoria</span>`;
  }
}

/* Cria (uma única vez) o rodapé da galeria — contador + botão de
   paginação. Fica fora do innerHTML da grid para não ser apagado
   a cada re-render da lista de cards. */
function _achGarantirFooter(elLista) {
  let footer = elLista.parentElement.querySelector('#ach-gallery-footer');
  if (!footer) {
    footer = document.createElement('div');
    footer.id = 'ach-gallery-footer';
    footer.className = 'ach-gallery-footer';
    elLista.insertAdjacentElement('afterend', footer);
  }
  return footer;
}

/* Um card da galeria — três estados possíveis:
   desbloqueada / em progresso (bloqueada com atual>0) / bloqueada.
   Conteúdo mínimo por design: ícone, nome, descrição de 1 linha,
   badge, e progresso apenas quando existir. */
function _achCardHtml(c, conquistas, progresso) {
  const desbloqueada = conquistas[c.id] === true;
  const prog = progresso[c.id];
  const emProgresso = !desbloqueada && prog && prog.atual > 0;

  const estadoCls = desbloqueada ? 'ach-state-unlocked' : (emProgresso ? 'ach-state-progress' : 'ach-state-locked');

  const tagHtml = desbloqueada
    ? `<span class="ach-card-tag ${c.tagCls}">${c.tag}</span>`
    : `<span class="ach-card-lock" aria-hidden="true">🔒</span>`;

  let progressoHtml = '';
  if (emProgresso) {
    const pctItem = prog.meta > 0 ? Math.min(100, Math.round((prog.atual / prog.meta) * 100)) : 0;
    progressoHtml = `
      <div class="ach-card-bar"><div class="ach-card-bar-fill" style="width:${pctItem}%"></div></div>
      <div class="ach-card-progress-txt">${_achFormatarValor(prog)}</div>`;
  }

  return `
    <div class="ach-card-item ${estadoCls}" title="${escapeHtml(c.desc)}">
      ${tagHtml}
      <div class="ach-card-icon">${desbloqueada || emProgresso ? c.emoji : '<span class="ach-card-icon-dim">' + c.emoji + '</span>'}</div>
      <div class="ach-card-name">${escapeHtml(c.nome)}</div>
      <div class="ach-card-desc">${escapeHtml(c.desc)}</div>
      ${progressoHtml}
    </div>`;
}

/* ══════════════════════════════════════════════
   Helpers privados de formatação — não exportados
══════════════════════════════════════════════ */
function _achFormatarValor(prog) {
  if (!prog) return '';
  if (prog.tipo === 'tempo')      return `${_achFormatarTempo(prog.atual)} / ${_achFormatarTempo(prog.meta)}`;
  if (prog.tipo === 'percentual') return `${Math.round(prog.atual)}% / ${prog.meta}%`;
  return `${prog.atual} / ${prog.meta}`;
}

function _achFormatarTempo(segundos) {
  const s = segundos ?? 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h${m > 0 ? m + 'm' : ''}`;
  return `${m}m`;
}