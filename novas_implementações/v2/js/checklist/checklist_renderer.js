/* dashboard\js\checklist\checklist_renderer.js
 proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   Responsabilidade ÚNICA: renderização visual do Checklist.
   Não lê Firestore, não decide o que carregar, não conhece
   State — recebe dados já prontos (checklistData + progresso)
   e apenas desenha/atualiza o DOM. Zero cálculo de negócio além
   de somar/contar itens já concluídos e derivar status de
   disciplina (concluída / em andamento / não iniciada) — tudo
   calculado a partir do `progresso` recebido, nunca inventado.

   IMPORTANTE — não existe "atrasado" nem "em andamento" por ITEM
   no modelo de dados (um item só tem `concluido: true|false`).
   Os status abaixo são sempre derivados de contagens reais
   (total/concluídos por disciplina), nunca um campo fictício.

   ─────────────────────────────────────────────
   REDESIGN v4 — MASONRY de 2 colunas independentes (corrige
   "buracos" verticais quando uma disciplina é recolhida)
   ─────────────────────────────────────────────
   CAUSA RAIZ do bug: CSS Grid tradicional (grid-template-columns:
   1fr 1fr) organiza os itens em LINHAS — a altura de cada linha é
   sempre o máximo entre as células daquela linha. Ao recolher uma
   disciplina, a linha inteira só encolhe até a altura do vizinho
   mais alto da MESMA linha; a disciplina da linha seguinte nunca
   "sabe" que sobrou espaço acima, porque Grid não tem noção de
   preenchimento entre linhas. É uma limitação estrutural do
   modelo de Grid, não um bug de implementação.
   CORREÇÃO: em vez de 1 container em grid, `.checklist-disciplinas`
   agora é um `display:flex` HORIZONTAL contendo 2 (ou 1, no
   mobile) sub-containers `.checklist-disciplinas-col`, cada um em
   `display:flex; flex-direction:column` — ou seja, 2 colunas
   TOTALMENTE INDEPENDENTES entre si, cada uma em fluxo normal de
   documento. Assim, quando uma disciplina de uma coluna recolhe,
   somente as disciplinas ABAIXO DELA NA MESMA COLUNA sobem — sem
   depender de linhas compartilhadas com a outra coluna. É o mesmo
   mecanismo simples que já funcionava bem quando só existia 1
   coluna (fluxo normal), duplicado em 2 colunas.
   Distribuição: as disciplinas filtradas/ordenadas são divididas
   por índice alternado (round-robin: índice par → coluna 0, ímpar
   → coluna 1) em _renderColunasHtml/_numColunasAtual — mantém a
   ordem de leitura (A,C na esquerda / B,D na direita, igual ao
   layout visual de 2 colunas atual) sem depender de medir altura
   em JS. O número de colunas é decidido por `matchMedia` (2 acima
   de 900px, 1 abaixo — mesmo breakpoint do CSS anterior) e
   recalculado automaticamente quando a tela cruza esse breakpoint
   (ver `_mediaQueryDuasColunas` no fim do arquivo), então no
   mobile as disciplinas voltam a aparecer em ordem sequencial
   normal, sem qualquer split.
   ANIMAÇÃO: nenhuma técnica nova foi necessária para a
   reorganização ficar suave — como cada coluna é fluxo normal de
   documento, o encolhimento contínuo do card (grid-template-rows
   já animado, ver mais abaixo) já faz o navegador reposicionar os
   vizinhos da mesma coluna quadro a quadro, exatamente como
   acontecia antes de existir a divisão em colunas.
   ─────────────────────────────────────────────
   REDESIGN v3 — categorias voltam a ser uma LISTA VERTICAL, cada
   uma com accordion PRÓPRIO (em vez de abas horizontais, que não
   escalam para disciplinas com muitas categorias). Também corrige
   o bug em que recolher uma disciplina deixava conteúdo "sobrando"
   visível — a causa raiz era puramente de CSS (grid-template-rows
   sem minmax(0, ...)), ver checklist.css para o comentário
   completo; este arquivo só precisou continuar alternando a classe
   `.is-collapsed`, nada mudou na lógica de JS por causa daquele bug.
   ─────────────────────────────────────────────
   checklistData esperado (já validado por checklist.js contra a
   lista oficial de disciplinas — nome/emoji SEMPRE vêm de lá):
     {
       disciplinas: [
         {
           id, nome, emoji,
           categorias: [
             { id, nome, itens: [{ id, titulo }, ...] },
             ...
           ]
         },
         ...
       ]
     }

   Estado de UI (filtro ativo, ordenação, disciplinas e categorias
   colapsadas) é mantido em módulo (_estado), sempre reconstruído
   quando renderChecklist() é chamado de novo (troca de semestre ou
   reabertura da view). filtro/ordenação continuam 100% efêmeros
   (nunca persistidos). Já colapsados/categoriasColapsadas — que
   registram quais disciplinas/categorias estão RECOLHIDAS — são
   inicializados a partir de `estadoUISalvo` (parâmetro recebido de
   fora, já lido do armazenamento por checklist.js) e, a cada
   alteração, são repassados para fora via o callback
   `onMudarEstadoUI`. Este arquivo continua SEM SABER onde/como
   isso é persistido (localStorage, Firestore, etc.) — só lê o
   estado inicial que recebeu e avisa quando ele muda, mantendo a
   responsabilidade única de renderização. Quem decide onde salvar
   é sempre checklist.js (via checklist_storage.js).

   Toggle de item (checkbox) e colapso de disciplina/categoria são
   feitos por atualização direta do DOM (sem re-renderizar a árvore
   inteira) — ver _atualizarContadores() e _ligarEventos(). Só
   filtro/ordenação, por serem bem menos frequentes, re-renderizam
   a lista via _renderCompleto(). */

function _escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function _contarItens(itens, progresso) {
  const total      = itens?.length ?? 0;
  const concluidos = (itens ?? []).filter(it => progresso[it.id] === true).length;
  const pct        = total > 0 ? Math.round((concluidos / total) * 100) : 0;
  return { total, concluidos, pct };
}

function _progressoCategoria(categoria, progresso) {
  return _contarItens(categoria?.itens, progresso);
}

function _progressoDisciplina(disciplina, progresso) {
  const categorias = disciplina?.categorias ?? [];
  let total = 0, concluidos = 0;
  categorias.forEach(cat => {
    const r = _progressoCategoria(cat, progresso);
    total += r.total;
    concluidos += r.concluidos;
  });
  const pct = total > 0 ? Math.round((concluidos / total) * 100) : 0;
  return { total, concluidos, pct };
}

/* Único ponto que decide o "status" textual de uma disciplina —
   sempre a partir de total/pct reais, nunca de um campo à parte. */
function _statusDisciplina(total, pct) {
  if (total === 0)  return { chave: 'sem-itens',    label: 'Sem itens' };
  if (pct >= 100)   return { chave: 'concluida',    label: 'Concluída' };
  if (pct > 0)      return { chave: 'andamento',    label: 'Em andamento' };
  return               { chave: 'nao-iniciada', label: 'Não iniciada' };
}

function _statsGlobais(disciplinas, progresso) {
  let totalItens = 0, concluidosItens = 0;
  let concluidasDisc = 0, andamentoDisc = 0, naoIniciadasDisc = 0;

  disciplinas.forEach(d => {
    const { total, concluidos, pct } = _progressoDisciplina(d, progresso);
    totalItens += total;
    concluidosItens += concluidos;

    const status = _statusDisciplina(total, pct).chave;
    if (status === 'concluida') concluidasDisc += 1;
    else if (status === 'andamento') andamentoDisc += 1;
    else naoIniciadasDisc += 1; // inclui 'nao-iniciada' e 'sem-itens'
  });

  const pctGeral = totalItens > 0 ? Math.round((concluidosItens / totalItens) * 100) : 0;

  return {
    totalItens, concluidosItens, pctGeral,
    totalDisc: disciplinas.length,
    concluidasDisc, andamentoDisc, naoIniciadasDisc,
  };
}

const _CHEVRON_SVG = `
  <svg class="checklist-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"
       stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3.5 5.25L7 8.75l3.5-3.5"/>
  </svg>`;

const _CHECK_SVG = `
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M2.5 6.2l2.3 2.3L9.5 3.5"/>
  </svg>`;

const _ICON_TOTAL = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/>
    <rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/>
  </svg>`;
const _ICON_CHECK = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="8" cy="8" r="6.5"/><path d="M5 8.2l2.1 2.1L11.2 6"/>
  </svg>`;
const _ICON_CLOCK = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="8" cy="8" r="6.5"/><path d="M8 4.5V8l2.5 2.5"/>
  </svg>`;
const _ICON_CIRCLE = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="8" cy="8" r="6.5" stroke-dasharray="2.5 2.5"/>
  </svg>`;

/* ─────────────────────────────────────────────
   ESTADO DE UI — módulo único, resetado a cada renderChecklist()
   ───────────────────────────────────────────── */
let _estado = null;

/* Callback opcional recebido por renderChecklist(), chamado toda
   vez que colapsados/categoriasColapsadas mudam (ver
   _persistirEstadoUI). Resetado a cada renderChecklist() novo,
   igual a _estado. */
let _onMudarEstadoUI = null;

/* Referência para o rerender mais recente (ver _ligarEventos),
   usada pelo listener de matchMedia registrado logo abaixo, para
   redesenhar a lista de disciplinas quando a tela cruza o
   breakpoint de 2↔1 colunas (ver REDESIGN v4 no topo do arquivo). */
let _rerenderAtual = null;

/* `estadoUISalvo` (opcional) vem de fora já lido do armazenamento
   — { colapsados: string[], categoriasColapsadas: string[] } —
   com os IDs que estavam RECOLHIDOS na última visita. Ausente ou
   inválido = tudo expandido (mesmo default de sempre). */
function _estadoInicial(estadoUISalvo) {
  const salvo = estadoUISalvo ?? {};
  return {
    filtro: 'todas',
    colapsados: new Set(Array.isArray(salvo.colapsados) ? salvo.colapsados : []),
    categoriasColapsadas: new Set(Array.isArray(salvo.categoriasColapsadas) ? salvo.categoriasColapsadas : []),
  };
}
/* Serializa colapsados/categoriasColapsadas (Sets) para arrays e
   repassa ao callback externo, se houver. Chamado apenas nos dois
   pontos onde essas duas coleções realmente mudam (toggle de
   disciplina e toggle de categoria em _ligarEventos) — nunca a
   cada clique de checkbox nem a cada rerender de filtro/ordenação. */
function _persistirEstadoUI() {
  if (typeof _onMudarEstadoUI !== 'function') return;
  _onMudarEstadoUI({
    colapsados: Array.from(_estado.colapsados),
    categoriasColapsadas: Array.from(_estado.categoriasColapsadas),
  });
}

export function renderEstadoVazio(containerEl, mensagem) {
  containerEl.innerHTML = `
    <div class="checklist-empty">
      <div class="checklist-empty-icon" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 5h12M3 9h8M3 13h10"/>
        </svg>
      </div>
      <p class="checklist-empty-msg">${_escapeHtml(mensagem)}</p>
    </div>`;
}

function _renderItemHtml(item, progresso) {
  const marcado = progresso[item.id] === true;
  return `
    <label class="checklist-item${marcado ? ' is-concluido' : ''}">
      <input type="checkbox" class="checklist-item-checkbox" data-item-id="${_escapeHtml(item.id)}" ${marcado ? 'checked' : ''} />
      <span class="checklist-item-check" aria-hidden="true">${_CHECK_SVG}</span>
      <span class="checklist-item-titulo">${_escapeHtml(item.titulo)}</span>
    </label>`;
}

/* Itens de UMA categoria (dentro do próprio accordion dela).
   Exibe TODOS os itens sempre que a categoria está expandida —
   não há mais paginação/"ver mais". */
function _renderItensCategoriaHtml(categoria, progresso) {
  const itens = categoria.itens ?? [];
  if (itens.length === 0) {
    return '<span class="checklist-itens-vazio">Nenhum item cadastrado.</span>';
  }

  const itensHtml = itens.map(item => _renderItemHtml(item, progresso)).join('');
  return `<div class="checklist-itens-grid">${itensHtml}</div>`;
}

/* Uma categoria = 1 accordion próprio (nível 2), sempre visível na
   lista vertical, independente de quantas outras existam na mesma
   disciplina. */
function _renderCategoriaHtml(disciplina, categoria, progresso) {
  const rCat      = _progressoCategoria(categoria, progresso);
  const chaveCol  = `${disciplina.id}::${categoria.id}`;
  const colapsada = _estado.categoriasColapsadas.has(chaveCol);
  const corpoHtml = _renderItensCategoriaHtml(categoria, progresso);

  return `
    <div class="checklist-categoria${colapsada ? ' is-collapsed' : ''}" data-cat-id="${_escapeHtml(categoria.id)}">
      <button type="button" class="checklist-categoria-header" aria-expanded="${!colapsada}">
        ${_CHEVRON_SVG}
        <span class="checklist-categoria-nome">${_escapeHtml(categoria.nome)}</span>
        <span class="checklist-categoria-contagem">${rCat.concluidos}/${rCat.total}</span>
      </button>
      <div class="checklist-categoria-body">
        <div class="checklist-categoria-body-inner">${corpoHtml}</div>
      </div>
    </div>`;
}

function _renderDisciplinaHtml(disciplina, progresso) {
  const { total, concluidos, pct } = _progressoDisciplina(disciplina, progresso);
  const status     = _statusDisciplina(total, pct);
  const categorias = disciplina.categorias ?? [];
  const colapsado  = _estado.colapsados.has(disciplina.id);

  const categoriasHtml = categorias.length
    ? categorias.map(cat => _renderCategoriaHtml(disciplina, cat, progresso)).join('')
    : '<span class="checklist-itens-vazio">Nenhuma categoria cadastrada.</span>';

  return `
    <section class="checklist-disc-block${colapsado ? ' is-collapsed' : ''}" data-disc-id="${_escapeHtml(disciplina.id)}">
      <button type="button" class="checklist-disc-header" aria-expanded="${!colapsado}">
        <span class="checklist-disc-emoji">${disciplina.emoji ? _escapeHtml(disciplina.emoji) : '📚'}</span>
        <div class="checklist-disc-info">
          <div class="checklist-disc-title-row">
            <h3 class="checklist-disc-nome">${_escapeHtml(disciplina.nome)}</h3>
            <span class="checklist-disc-status status-${status.chave}">${status.label}</span>
          </div>
          <div class="checklist-disc-meta">
            <div class="checklist-disc-bar-bg">
              <div class="checklist-disc-bar-fill" style="width:${pct}%"></div>
            </div>
            <span class="checklist-disc-contagem">${concluidos}/${total}</span>
            <span class="checklist-disc-pct">${pct}%</span>
          </div>
        </div>
        ${_CHEVRON_SVG}
      </button>
      <div class="checklist-disc-body">
        <div class="checklist-disc-body-inner">
          <div class="checklist-categorias-lista">${categoriasHtml}</div>
        </div>
      </div>
    </section>`;
}

function _filtrarDisciplinas(disciplinas, progresso) {
  let lista = disciplinas.map(d => ({ d, r: _progressoDisciplina(d, progresso) }));

  if (_estado.filtro !== 'todas') {
    lista = lista.filter(({ r }) => {
      const chave = _statusDisciplina(r.total, r.pct).chave;
      if (_estado.filtro === 'nao-iniciadas') return chave === 'nao-iniciada' || chave === 'sem-itens';
      return chave === _estado.filtro;
    });
  }

  return lista.map(x => x.d);
}

function _construirHeaderHtml(stats, semestre) {
  const restantes = stats.totalItens - stats.concluidosItens;
  return `
    <div class="checklist-header">
      <div class="checklist-header-top">
        <div class="checklist-header-left">
          <h2 class="checklist-title">Checklist</h2>
          <p class="checklist-subtitle">Semestre ${_escapeHtml(semestre)} — acompanhe seus conteúdos e mantenha o foco.</p>
        </div>
        <div class="checklist-ring-wrap">
          <div class="checklist-ring" style="--pct:${stats.pctGeral}">
            <div class="checklist-ring-hole">
              <span class="checklist-ring-pct">${stats.pctGeral}%</span>
            </div>
          </div>
          <div class="checklist-ring-info">
            <span class="checklist-ring-fracao">${stats.concluidosItens} / ${stats.totalItens}</span>
            <span class="checklist-ring-label">conteúdos concluídos</span>
            <span class="checklist-ring-restam">${restantes > 0 ? `Faltam ${restantes} conteúdos` : 'Tudo concluído! 🎉'}</span>
          </div>
        </div>
      </div>
      <div class="checklist-stats-row">
        <div class="checklist-stat-chip">
          <span class="checklist-stat-icon ic-blue">${_ICON_TOTAL}</span>
          <div class="checklist-stat-body">
            <span class="checklist-stat-label">Disciplinas</span>
            <span class="checklist-stat-value" data-stat="total">${stats.totalDisc}</span>
          </div>
        </div>
        <div class="checklist-stat-chip">
          <span class="checklist-stat-icon ic-green">${_ICON_CHECK}</span>
          <div class="checklist-stat-body">
            <span class="checklist-stat-label">Concluídas</span>
            <span class="checklist-stat-value" data-stat="concluidas">${stats.concluidasDisc}</span>
          </div>
        </div>
        <div class="checklist-stat-chip">
          <span class="checklist-stat-icon ic-amber">${_ICON_CLOCK}</span>
          <div class="checklist-stat-body">
            <span class="checklist-stat-label">Em andamento</span>
            <span class="checklist-stat-value" data-stat="andamento">${stats.andamentoDisc}</span>
          </div>
        </div>
        <div class="checklist-stat-chip">
          <span class="checklist-stat-icon ic-purple">${_ICON_CIRCLE}</span>
          <div class="checklist-stat-body">
            <span class="checklist-stat-label">Não iniciadas</span>
            <span class="checklist-stat-value" data-stat="nao-iniciadas">${stats.naoIniciadasDisc}</span>
          </div>
        </div>
      </div>
    </div>`;
}


function _construirControlesHtml() {
  const filtros = [
    { chave: 'todas',          label: 'Todas' },
    { chave: 'andamento',      label: 'Em andamento' },
    { chave: 'concluidas',     label: 'Concluídas' },
    { chave: 'nao-iniciadas',  label: 'Não iniciadas' },
  ];
  const tabsHtml = filtros.map(f => `
    <button type="button" class="checklist-filter-tab${_estado.filtro === f.chave ? ' is-active' : ''}" data-filtro="${f.chave}">
      ${f.label}
    </button>`).join('');

  return `
    <div class="checklist-controls">
      <div class="checklist-filter-tabs" role="tablist">${tabsHtml}</div>
    </div>`;
}
/* ─────────────────────────────────────────────
   MASONRY — 2 colunas independentes (ver comentário REDESIGN v4
   no topo do arquivo). Mesmo breakpoint do CSS (900px): acima
   disso, 2 colunas; 900px ou abaixo, 1 coluna só (sem split). */
const _mediaQueryDuasColunas = window.matchMedia('(min-width: 901px)');

/* Registrado uma única vez (escopo de módulo, não por render) —
   sempre que a tela cruza o breakpoint, redesenha a lista de
   disciplinas para recalcular quantas colunas usar. */
_mediaQueryDuasColunas.addEventListener('change', () => {
  _rerenderAtual?.();
});

function _numColunasAtual() {
  return _mediaQueryDuasColunas.matches ? 2 : 1;
}

/* Distribui a lista já filtrada/ordenada em N colunas por índice
   alternado (round-robin: 0,2,4... na coluna 0; 1,3,5... na
   coluna 1) — mantém a ordem de leitura sem precisar medir altura
   em JS. Cada coluna vira um sub-container de fluxo normal
   totalmente independente (ver .checklist-disciplinas-col no
   CSS), o que é o que garante que recolher uma disciplina nunca
   deixa "buraco": só os itens abaixo dela NA MESMA COLUNA sobem. */
function _renderColunasHtml(listaFiltrada, progresso) {
  const numColunas = _numColunasAtual();
  const colunas = Array.from({ length: numColunas }, () => []);
  listaFiltrada.forEach((d, i) => colunas[i % numColunas].push(d));

  return colunas
    .map(col => `<div class="checklist-disciplinas-col">${col.map(d => _renderDisciplinaHtml(d, progresso)).join('')}</div>`)
    .join('');
}

/* Redesenha cabeçalho + controles + lista de disciplinas por
   inteiro, a partir do estado atual (_estado) + dados/progresso
   recebidos. Reatribui os listeners delegados a cada chamada,
   pois o innerHTML inteiro é substituído. Chamado apenas em
   reações pouco frequentes (abrir a view, trocar filtro/ordenação,
   colapsar disciplina, cruzar o breakpoint de colunas) — NUNCA a
   cada clique de checkbox (ver _atualizarContadores). */
function _renderCompleto(containerEl, checklistData, progresso, semestre, onToggleItem) {
  const disciplinas = checklistData?.disciplinas ?? [];
  const stats = _statsGlobais(disciplinas, progresso);
const listaFiltrada = _filtrarDisciplinas(disciplinas, progresso);
  const listaHtml = listaFiltrada.length
    ? _renderColunasHtml(listaFiltrada, progresso)
    : '<div class="checklist-filtro-vazio">Nenhuma disciplina encontrada para este filtro.</div>';

  containerEl.innerHTML = `
    ${_construirHeaderHtml(stats, semestre)}
    ${_construirControlesHtml()}
    <div class="checklist-disciplinas" id="checklist-disciplinas">${listaHtml}</div>
  `;

  _ligarEventos(containerEl, checklistData, progresso, semestre, onToggleItem);
}

function _ligarEventos(containerEl, checklistData, progresso, semestre, onToggleItem) {
  const rerender = () => {
    /* Guarda simples: se o container não está mais no documento
       (view fechada / trocada), não há nada para redesenhar. */
    if (!containerEl.isConnected) return;
    _renderCompleto(containerEl, checklistData, progresso, semestre, onToggleItem);
  };

  /* Mantém sempre a referência do rerender mais recente, para que
     o listener de matchMedia (registrado uma única vez, fora desta
     função) saiba redesenhar a lista quando a tela cruzar o
     breakpoint de 2↔1 colunas. */
  _rerenderAtual = rerender;

  /* ── Filtro por status ── */
  const filterTabs = containerEl.querySelector('.checklist-filter-tabs');
  filterTabs?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filtro]');
    if (!btn) return;
    _estado.filtro = btn.dataset.filtro;
    rerender();
  });


  const wrap = containerEl.querySelector('#checklist-disciplinas');
  if (!wrap) return;

  /* ── Clique: colapsar categoria / colapsar disciplina ──
     Colapsar (disciplina OU categoria) é alternado DIRETO no DOM,
     sem re-render completo — é a interação mais frequente do
     Checklist e não deve refazer a árvore inteira a cada clique. */
  wrap.addEventListener('click', (e) => {
    const catHeader = e.target.closest('.checklist-categoria-header');
    if (catHeader) {
      const blocoCat = catHeader.closest('.checklist-categoria');
      const blocoDisc = catHeader.closest('.checklist-disc-block');
      const discId = blocoDisc?.dataset.discId;
      const catId  = blocoCat?.dataset.catId;
      if (!discId || !catId) return;
      const chave = `${discId}::${catId}`;
      const colapsarAgora = !_estado.categoriasColapsadas.has(chave);
      if (colapsarAgora) _estado.categoriasColapsadas.add(chave);
      else _estado.categoriasColapsadas.delete(chave);
      blocoCat.classList.toggle('is-collapsed', colapsarAgora);
      catHeader.setAttribute('aria-expanded', String(!colapsarAgora));
      _persistirEstadoUI();
      return;
    }

    const header = e.target.closest('.checklist-disc-header');
    if (header) {
      const bloco  = header.closest('.checklist-disc-block');
      const discId = bloco?.dataset.discId;
      if (!discId) return;
      const colapsarAgora = !_estado.colapsados.has(discId);
      if (colapsarAgora) _estado.colapsados.add(discId);
      else _estado.colapsados.delete(discId);
      bloco.classList.toggle('is-collapsed', colapsarAgora);
      header.setAttribute('aria-expanded', String(!colapsarAgora));
      _persistirEstadoUI();
      return;
    }
  });

  /* ── Toggle de item — nunca re-renderiza a árvore inteira; só
     atualiza classes/contadores que dependem do progresso. ── */
  wrap.addEventListener('change', (e) => {
    const checkbox = e.target.closest('.checklist-item-checkbox');
    if (!checkbox) return;

    const itemId    = checkbox.dataset.itemId;
    const concluido = checkbox.checked;

    progresso[itemId] = concluido;
    checkbox.closest('.checklist-item')?.classList.toggle('is-concluido', concluido);
    _atualizarContadores(containerEl, checklistData, progresso);

    onToggleItem?.(itemId, concluido);
  });
}

/* Atualiza, sem re-renderizar HTML: contagem/pct/status/barra de
   cada disciplina visível, contagem de cada categoria, e os chips
   + anel do cabeçalho geral. Mantém o comportamento leve já
   existente (progresso mutado por referência) mesmo com o
   redesign. */
function _atualizarContadores(containerEl, checklistData, progresso) {
  const disciplinas = checklistData?.disciplinas ?? [];
  const wrap = containerEl.querySelector('#checklist-disciplinas');

  disciplinas.forEach(disc => {
    const blocoDisc = wrap?.querySelector(`.checklist-disc-block[data-disc-id="${CSS.escape(disc.id)}"]`);
    const categorias = disc.categorias ?? [];
    let totalDisc = 0, concluidosDisc = 0;

    categorias.forEach(cat => {
      const rCat = _progressoCategoria(cat, progresso);
      totalDisc += rCat.total;
      concluidosDisc += rCat.concluidos;

      if (blocoDisc) {
        const catCountEl = blocoDisc.querySelector(`.checklist-categoria[data-cat-id="${CSS.escape(cat.id)}"] .checklist-categoria-contagem`);
        if (catCountEl) catCountEl.textContent = `${rCat.concluidos}/${rCat.total}`;
      }
    });

    if (blocoDisc) {
      const pctDisc = totalDisc > 0 ? Math.round((concluidosDisc / totalDisc) * 100) : 0;
      const status  = _statusDisciplina(totalDisc, pctDisc);

      const contagemEl = blocoDisc.querySelector('.checklist-disc-contagem');
      const pctEl       = blocoDisc.querySelector('.checklist-disc-pct');
      const barFillEl   = blocoDisc.querySelector('.checklist-disc-bar-fill');
      const statusEl    = blocoDisc.querySelector('.checklist-disc-status');

      if (contagemEl) contagemEl.textContent = `${concluidosDisc}/${totalDisc}`;
      if (pctEl)       pctEl.textContent      = `${pctDisc}%`;
      if (barFillEl)   barFillEl.style.width  = `${pctDisc}%`;
      if (statusEl) {
        statusEl.textContent = status.label;
        statusEl.className   = `checklist-disc-status status-${status.chave}`;
      }
    }
  });

  const stats = _statsGlobais(disciplinas, progresso);
  _atualizarHeaderStats(containerEl, stats);
}

function _atualizarHeaderStats(containerEl, stats) {
  const ring = containerEl.querySelector('.checklist-ring');
  if (ring) ring.style.setProperty('--pct', String(stats.pctGeral));

  const pctEl = containerEl.querySelector('.checklist-ring-pct');
  if (pctEl) pctEl.textContent = `${stats.pctGeral}%`;

  const fracaoEl = containerEl.querySelector('.checklist-ring-fracao');
  if (fracaoEl) fracaoEl.textContent = `${stats.concluidosItens} / ${stats.totalItens}`;

  const restam = stats.totalItens - stats.concluidosItens;
  const restamEl = containerEl.querySelector('.checklist-ring-restam');
  if (restamEl) restamEl.textContent = restam > 0 ? `Faltam ${restam} conteúdos` : 'Tudo concluído! 🎉';

  const mapa = {
    total: stats.totalDisc,
    concluidas: stats.concluidasDisc,
    andamento: stats.andamentoDisc,
    'nao-iniciadas': stats.naoIniciadasDisc,
  };
  Object.entries(mapa).forEach(([chave, valor]) => {
    const el = containerEl.querySelector(`[data-stat="${chave}"]`);
    if (el) el.textContent = String(valor);
  });
}

/* Renderiza o Checklist completo. `progresso` é mantido por
   REFERÊNCIA (mutado diretamente no listener de change), para que
   os contadores possam ser atualizados sem re-renderizar a árvore
   inteira a cada clique. `onToggleItem(itemId, concluido)` é
   chamado apenas como efeito colateral de persistência — não
   afeta o que é exibido (isso já foi feito antes de chamá-lo).

   `estadoUISalvo` (opcional) — { colapsados, categoriasColapsadas }
   já lido do armazenamento por checklist.js — restaura quais
   disciplinas/categorias estavam recolhidas na última visita a
   este semestre. `onMudarEstadoUI(estadoUI)` (opcional) é chamado
   toda vez que o usuário expande/recolhe uma disciplina ou
   categoria, para que checklist.js persista a mudança; assim como
   onToggleItem, é só efeito colateral — nunca afeta o que já foi
   desenhado na tela. */
export function renderChecklist(containerEl, checklistData, progresso, semestre, onToggleItem, estadoUISalvo, onMudarEstadoUI) {
  const disciplinas = checklistData?.disciplinas ?? [];

  if (disciplinas.length === 0) {
    renderEstadoVazio(containerEl, 'Nenhuma disciplina cadastrada no checklist deste semestre.');
    return;
  }

  _estado = _estadoInicial(estadoUISalvo);
  _onMudarEstadoUI = onMudarEstadoUI ?? null;
  _renderCompleto(containerEl, checklistData, progresso, semestre, onToggleItem);
}