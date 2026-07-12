/* dashboard\js\utils\ui_state_manager.js
   proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   ═══════════════════════════════════════════════════════════════
   UI STATE MANAGER — sistema GLOBAL de RESTAURAÇÃO DE SESSÃO DE
   INTERFACE, reutilizável por QUALQUER módulo do Dashboard
   (Dashboard, Checklist, Tarefas, Agenda, Conquistas, Estatísticas,
   Configurações, e qualquer módulo futuro).
   ═══════════════════════════════════════════════════════════════

   ESCOPO (ampliado — este arquivo deixou de ser só "voltar para a
   mesma tela" e passou a cobrir sessão de interface como um todo,
   no espírito de Notion/Google Docs/VS Code/Figma):
     • view ativa, scroll (de página e interno), abas, accordions,
       filtros, paginação, ordenação, pesquisas, cards expandidos —
       ver seções 1/2/3 abaixo (já existiam);
     • RASCUNHO de formulários/modais ainda não salvos (campos de
       texto, textarea, select, checkbox, radio) — ver seção 4;
     • "qual modal estava aberto" e "em que etapa de um wizard" —
       não é um mecanismo à parte: é só mais um uso de
       getState/setState (seção 1), documentado com exemplo em
       trackForm() abaixo. Ver dashboard/js/tarefa/tarefa_modal.js
       para a implementação de referência (modal de nova lista).

   POR QUE ESTE ARQUIVO EXISTE
   ─────────────────────────────────────────────
   Antes deste módulo, cada tela reinventava sua própria solução,
   sempre um pouco diferente das outras:
     - dashboard_data.js guardava `scrollAnterior` em variável local
       antes de reconstruir `.nav-rank-entries` / `.nav-tl-entries`.
     - dashboard_render.js fazia o mesmo para a timeline de navegação.
     - checklist_storage.js tinha uma chave própria de localStorage
       só para accordions (`nexus_checklist_ui::{semestre}`).
     - tarefa_renderer.js guardava `_colapsadasListas` /
       `_colapsadasCategorias` em Set() de módulo — perdido a cada
       F5, porque nunca era persistido em lugar nenhum.
     - dashboard_data.js tinha `_paginasExpandido` como variável de
       módulo — mesmo problema.
     - agenda.js/conquistas.js: filtro ativo, aba ativa, página do
       paginador — todos efêmeros, perdidos a qualquer atualização.
     - formulários e modais nunca tiveram NENHUM tratamento: um F5
       no meio do preenchimento de "Nova lista de tarefas" sempre
       apagava tudo, mesmo que o usuário não tivesse cometido
       nenhum erro — só recarregou a página.
   Cada uma dessas é uma reimplementação isolada do MESMO problema:
   "não perder o estado visual/de trabalho quando algo muda". Este
   arquivo substitui todas elas por UMA arquitetura única.

   O QUE ESTE MÓDULO NÃO FAZ
   ─────────────────────────────────────────────
   Não guarda dados de negócio DEFINITIVOS (progresso, listas,
   sessões etc.) — isso continua em cada *_storage.js, Firestore, ou
   localStorage próprio de cada módulo. Este arquivo guarda estado
   de interface e RASCUNHOS temporários — nunca a fonte de verdade.
   Um rascunho de formulário aqui é sempre substituído/descartado
   assim que o módulo confirma o salvamento real (ver seção 4) —
   até lá, sessionStorage é só uma rede de segurança contra F5/queda,
   nunca um substituto do banco de dados.

   ═══════════════════════════════════════════════════════════════
   API
   ═══════════════════════════════════════════════════════════════

   1) ESTADO "QUE DECIDE O QUE RENDERIZAR"
      (filtro ativo, aba ativa, página atual, ids recolhidos, texto
      de busca, ordenação...)

        const estado = UIState.getState(key, valoresPadrao);
        // ... usuário interage, estado muda em memória ...
        UIState.setState(key, { filtro: 'pendentes' });

      `key` é uma string única por módulo (e, se o módulo depender
      de contexto — como o Checklist depende do semestre — a key
      deve incluir esse contexto, ex.: `checklist:${semestre}`).
      `getState` sempre devolve um objeto novo (seguro para mutar
      localmente); `setState` mescla (shallow merge) e persiste.

   2) ESTADO "PURAMENTE VISUAL DE SCROLL"
      (posição de scroll da janela ou de qualquer contêiner interno,
      que não faz parte da lógica do módulo — só precisa "voltar
      pro mesmo lugar" depois de um re-render)

        await UIState.preserveScroll(key, {
          window: 'window',
          lista:  () => containerEl.querySelector('.minha-lista'),
        }, async () => {
          // ... aqui dentro: recria o DOM (innerHTML, re-render etc.) ...
        });

      `preserveScroll` captura a posição ANTES de rodar a função,
      espera ela terminar (funciona com funções síncronas ou que
      retornam Promise) e restaura a posição DEPOIS, já com o novo
      DOM no lugar (usa duplo requestAnimationFrame para garantir
      que o layout novo já foi calculado pelo navegador).
      Os valores do mapa de scrolláveis podem ser:
        - a string 'window'                → window.scrollX/Y
        - uma função () => Element|null     → resolvida de novo a
          cada captura/restauração (importante: se o elemento for
          recriado do zero, a referência antiga fica "morta"; por
          isso é sempre uma função, nunca o elemento direto).

   3) RECARREGAMENTO DE PÁGINA (F5) — automático, para QUALQUER view
      registrada, sem que o módulo precise ouvir eventos de unload:

        UIState.registerView('checklist', {
          getScrollables: () => ({
            window: 'window',
            corpo:  () => document.querySelector('#view-checklist'),
          }),
        });
        // uma única vez, no boot do Dashboard:
        UIState.initAutoCapture(() => _viewAtivaNoMomento());
        // depois que a view terminar de renderizar (1ª pintura ou
        // volta de navegação):
        UIState.restoreView('checklist');

      `initAutoCapture` grava a posição de scroll da view ATIVA no
      momento em que a página está sendo fechada/recarregada
      (pagehide/beforeunload) — nenhum listener de "scroll" fica
      ligado o tempo todo, então não há custo de performance durante
      o uso normal (só um pequeno cálculo no instante do F5).

   4) RASCUNHO DE FORMULÁRIOS/MODAIS — campos ainda não salvos
      (texto, textarea, select, checkbox, radio):

        const overlay = document.querySelector('.meu-modal');
        UIState.trackForm('meu-modal:novo-item', overlay);
        // pronto — a partir daqui, TODO campo com `id` ou `name`
        // dentro de `overlay` é observado (eventos 'input'/'change',
        // com debounce) e persistido automaticamente. Se já existia
        // um rascunho salvo (de um F5 no meio do preenchimento), ele
        // já é aplicado de volta nos campos NA HORA desta chamada —
        // o módulo não precisa escrever nenhum código de
        // preencher/ler campo, só registrar o contêiner.
        //
        // Ao SALVAR de verdade (ou cancelar), o módulo limpa o
        // rascunho — ele nunca deve sobreviver a uma ação concluída:
        UIState.clearState('meu-modal:novo-item');
        UIState.untrackForm('meu-modal:novo-item');

      Para "qual modal estava aberto" (e reabri-lo automaticamente
      depois de um F5) não existe uma API própria — é só mais um uso
      de getState/setState (seção 1): o módulo salva uma flag
      { aberto: true, ...contexto } ao abrir o modal, apaga ao
      salvar/cancelar, e no boot verifica essa flag para decidir se
      reabre o modal sozinho (chamando a mesma função que o clique
      no botão chamaria). Exemplo completo, com estado próprio de
      formulário (categorias/itens dinâmicos) combinado a
      trackForm() para os campos simples: ver
      dashboard/js/tarefa/tarefa_modal.js (abrirModalNovaLista) e
      dashboard/js/tarefa/tarefa.js (abrirTarefas, verificação no
      boot). Um wizard de múltiplas etapas usa o mesmo padrão: a
      etapa atual é só mais um campo do objeto salvo via setState.

   ═══════════════════════════════════════════════════════════════
   PERSISTÊNCIA
   ═══════════════════════════════════════════════════════════════
   sessionStorage por padrão — sobrevive a F5 (é exatamente o que
   este sistema precisa resolver) mas não vaza para outras abas/
   sessões nem cresce indefinidamente como localStorage. Pode ser
   trocado por módulo passando `{ persist: 'local' }` quando o
   estado deveria sobreviver ao fechamento da aba (raro; hoje
   nenhum módulo precisa disso — deixado como opção para o futuro).
   ═══════════════════════════════════════════════════════════════ */

const _PREFIX = 'nexus_ui_state::';

/* Views registradas via registerView() — Map<key, { getScrollables }> */
const _views = new Map();

/* Debounce de escrita por key, para não gravar no storage a cada
   pequena mudança em sequência rápida (ex.: usuário clicando várias
   vezes seguidas). Mantém o sistema "leve", como pedido. */
const _pendingWrites = new Map();
const _WRITE_DEBOUNCE_MS = 120;

function _storageFor(persist) {
  try {
    return persist === 'local' ? window.localStorage : window.sessionStorage;
  } catch (_) {
    return null;
  }
}

function _readRaw(key, persist) {
  const storage = _storageFor(persist);
  if (!storage) return null;
  try {
    const raw = storage.getItem(_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function _writeRawNow(key, persist, data) {
  const storage = _storageFor(persist);
  if (!storage) return;
  try {
    storage.setItem(_PREFIX + key, JSON.stringify(data));
  } catch (_) {
    /* storage indisponível/cheio — ignora silenciosamente, mesma
       postura defensiva já usada em checklist_storage.js/tarefa_storage.js */
  }
}

function _writeRawDebounced(key, persist, data) {
  const pendingKey = `${persist}::${key}`;
  const existing = _pendingWrites.get(pendingKey);
  if (existing) clearTimeout(existing.timer);
  const timer = setTimeout(() => {
    _pendingWrites.delete(pendingKey);
    _writeRawNow(key, persist, data);
  }, _WRITE_DEBOUNCE_MS);
  _pendingWrites.set(pendingKey, { timer });
}

/* Força a escrita imediata de qualquer gravação pendente — usado
   antes de capturar estado no unload (pagehide/beforeunload), para
   nunca perder a última mudança por causa do debounce. */
function _flushPendingWrites() {
  _pendingWrites.forEach(({ timer }) => clearTimeout(timer));
  _pendingWrites.clear();
}

/* ─────────────────────────────────────────────
   1) ESTADO GENÉRICO (filtros, abas, paginação, ids recolhidos...)
   ───────────────────────────────────────────── */

/* Lê o estado salvo de `key`, mesclado sobre `defaults` (defaults
   preenche qualquer campo ausente/corrompido — contrato igual ao
   de carregarEstadoUI() que já existia no Checklist). Devolve
   sempre um objeto novo, nunca a mesma referência salva. */
function getState(key, defaults = {}, opts = {}) {
  const persist = opts.persist ?? 'session';
  const saved = _readRaw(key, persist);
  if (!saved || typeof saved !== 'object') return { ...defaults };
  return { ...defaults, ...saved };
}

/* Mescla `patch` (objeto, ou função (estadoAtual) => patch) sobre o
   estado salvo de `key` e persiste. Uso típico: chamar sempre que o
   usuário muda um filtro/aba/página/expande algo. */
function setState(key, patch, opts = {}) {
  const persist = opts.persist ?? 'session';
  const atual = getState(key, {}, opts);
  const parcial = typeof patch === 'function' ? patch(atual) : patch;
  const proximo = { ...atual, ...parcial };
  if (opts.immediate) _writeRawNow(key, persist, proximo);
  else _writeRawDebounced(key, persist, proximo);
  return proximo;
}

function clearState(key, opts = {}) {
  const persist = opts.persist ?? 'session';
  const storage = _storageFor(persist);
  if (!storage) return;
  try { storage.removeItem(_PREFIX + key); } catch (_) {}
}

/* Existe algum estado salvo para `key`? Útil para decidir "tem
   rascunho/modal para reabrir" sem precisar inventar um valor
   padrão só para checar presença (getState sempre devolve um
   objeto, mesmo vazio — hasState responde só "existe ou não"). */
function hasState(key, opts = {}) {
  const persist = opts.persist ?? 'session';
  return _readRaw(key, persist) !== null;
}

/* ─────────────────────────────────────────────
   2) SCROLL — captura/restauração genérica
   ───────────────────────────────────────────── */

function _resolveScrollable(ref) {
  if (ref === 'window') return window;
  if (typeof ref === 'function') {
    try { return ref() ?? null; } catch (_) { return null; }
  }
  if (ref && typeof ref === 'object' && 'scrollTop' in ref) return ref; // elemento direto (uso avançado)
  return null;
}

function _readScrollPos(el) {
  if (el === window) return { x: window.scrollX, y: window.scrollY };
  return { x: el.scrollLeft, y: el.scrollTop };
}

function _writeScrollPos(el, pos) {
  if (!pos) return;
  if (el === window) window.scrollTo(pos.x ?? 0, pos.y ?? 0);
  else { el.scrollLeft = pos.x ?? 0; el.scrollTop = pos.y ?? 0; }
}

/* Captura a posição atual de cada scrollável do mapa `scrollables`
   ({ nome: 'window' | () => Element }) e devolve um objeto plano
   { nome: {x,y} } — não persiste sozinho (quem chama decide se
   guarda em memória ou em getState/setState). */
function captureScrollNow(scrollables) {
  const out = {};
  Object.entries(scrollables || {}).forEach(([nome, ref]) => {
    const el = _resolveScrollable(ref);
    if (el) out[nome] = _readScrollPos(el);
  });
  return out;
}

/* Aguarda o navegador terminar de aplicar o novo layout (duplo
   rAF é o padrão mais confiável para "depois que o DOM novo já foi
   pintado") antes de aplicar as posições salvas. */
function _afterLayout() {
  return new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

async function applyScrollNow(scrollables, saved) {
  if (!saved) return;
  await _afterLayout();
  Object.entries(scrollables || {}).forEach(([nome, ref]) => {
    const el = _resolveScrollable(ref);
    if (el && saved[nome]) _writeScrollPos(el, saved[nome]);
  });
}

/* Helper principal para "atualizações internas" (criar/editar/
   excluir/salvar/sincronizar): captura → executa a função de
   render (síncrona ou assíncrona) → restaura. É o equivalente
   reutilizável do antigo padrão manual `scrollAnterior`. */
async function preserveScroll(key, scrollables, renderFn) {
  const before = captureScrollNow(scrollables);
  let resultado;
  try {
    resultado = renderFn();
    if (resultado && typeof resultado.then === 'function') resultado = await resultado;
  } finally {
    await applyScrollNow(scrollables, before);
  }
  return resultado;
}

/* ─────────────────────────────────────────────
   3) VIEWS — F5 automático
   ───────────────────────────────────────────── */

/* Registra uma view (Dashboard, Checklist, Tarefas, Agenda, ou
   qualquer módulo futuro). `getScrollables()` é chamada só no
   instante da captura/restauração (nunca antes), então pode
   apontar para elementos que ainda nem existem no momento do
   registro. */
function registerView(key, { getScrollables }) {
  _views.set(key, { getScrollables: getScrollables ?? (() => ({ window: 'window' })) });
}

const _F5_STATE_PREFIX = 'view::';

function _captureActiveView(getActiveViewKey) {
  let ativa;
  try { ativa = getActiveViewKey(); } catch (_) { ativa = null; }
  if (!ativa) return;
  const view = _views.get(ativa);
  if (!view) return;
  const scrollables = view.getScrollables();
  const pos = captureScrollNow(scrollables);
  _writeRawNow(_F5_STATE_PREFIX + ativa, 'session', pos);
}

/* Chamar UMA ÚNICA VEZ no boot da aplicação (ex.: dashboard.js).
   `getActiveViewKey()` deve devolver a key da view visível no
   momento (ex.: 'dashboard-home', 'checklist', 'tarefas', 'agenda').
   Não fica nenhum listener de scroll ativo — só reage no instante
   em que a página está de fato sendo fechada/recarregada. */
function initAutoCapture(getActiveViewKey) {
  const handler = () => {
    _flushPendingWrites();
    _captureActiveView(getActiveViewKey);
  };
  window.addEventListener('pagehide', handler);
  /* beforeunload como reforço em navegadores/casos onde pagehide
     não dispara a tempo (ex.: fechamento abrupto) — mesmo handler,
     execução é barata (só leitura de scroll + 1 escrita). */
  window.addEventListener('beforeunload', handler);
  /* Também captura ao trocar de aba/perder foco (visibilitychange
     → 'hidden'), cobrindo o caso de o usuário trocar de app antes
     de um F5, sem precisar de um listener de scroll contínuo. */
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') handler();
  });
}

/* Chamar depois que a view `key` estiver com seu DOM montado e
   visível (ex.: logo após abrirChecklist()/abrirAgenda() ou depois
   de trocar para a view do Dashboard). Restaura a posição salva —
   seja de um F5 anterior, seja de uma troca de view anterior.
   Sempre seguro de chamar mesmo sem nada salvo ainda (primeira
   visita). */
async function restoreView(key) {
  const view = _views.get(key);
  if (!view) return;
  const saved = _readRaw(_F5_STATE_PREFIX + key, 'session');
  if (!saved) return;
  const scrollables = view.getScrollables();
  await applyScrollNow(scrollables, saved);
}

/* Captura manualmente a posição da view `key` agora (útil ao SAIR
   de uma view por navegação SPA, sem esperar o F5 — assim voltar
   para ela depois também restaura o scroll). */
function captureView(key) {
  const view = _views.get(key);
  if (!view) return;
  const scrollables = view.getScrollables();
  const pos = captureScrollNow(scrollables);
  _writeRawNow(_F5_STATE_PREFIX + key, 'session', pos);
}

/* ─────────────────────────────────────────────
   4) FORMULÁRIOS/MODAIS — rascunho genérico de campos
   ───────────────────────────────────────────── */

const _CAMPO_SELECTOR = 'input, textarea, select';

/* Só rastreia campos com identidade ESTÁVEL (name ou id) — um
   campo sem nenhum dos dois não tem como ser reencontrado depois
   de o modal ser recriado do zero, então é ignorado silenciosamente
   (mesma postura defensiva do resto do arquivo). */
function _identificarCampo(el) {
  return el.name || el.id || null;
}

function _lerValorDoCampo(el) {
  if (el.type === 'checkbox') return el.checked;
  if (el.type === 'radio') return el.checked ? el.value : undefined;
  if (el.tagName === 'SELECT' && el.multiple) {
    return Array.from(el.selectedOptions).map(o => o.value);
  }
  return el.value;
}

function _aplicarValorNoCampo(el, valor) {
  if (valor === undefined) return;
  if (el.type === 'checkbox') { el.checked = !!valor; return; }
  if (el.type === 'radio') { el.checked = (el.value === valor); return; }
  if (el.tagName === 'SELECT' && el.multiple) {
    const setValores = new Set(Array.isArray(valor) ? valor : []);
    Array.from(el.options).forEach(o => { o.selected = setValores.has(o.value); });
    return;
  }
  el.value = valor;
}

/* Varre `container` e devolve { idDoCampo: valor } — só campos com
   name/id, ignorando rádios não marcados (o marcado já cobre o
   grupo inteiro pelo próprio `name`). */
function captureFormNow(container) {
  const dados = {};
  if (!container) return dados;
  container.querySelectorAll(_CAMPO_SELECTOR).forEach(el => {
    const id = _identificarCampo(el);
    if (!id) return;
    if (el.type === 'radio' && !el.checked) return;
    const valor = _lerValorDoCampo(el);
    if (valor !== undefined) dados[id] = valor;
  });
  return dados;
}

/* Aplica `dados` (mesmo formato de captureFormNow) de volta nos
   campos de `container` que ainda existirem — seguro de chamar com
   um rascunho "mais antigo" que tem campos que não existem mais
   (ex.: modal mudou de versão): esses são simplesmente ignorados. */
function applyFormNow(container, dados) {
  if (!container || !dados) return;
  container.querySelectorAll(_CAMPO_SELECTOR).forEach(el => {
    const id = _identificarCampo(el);
    if (!id || !(id in dados)) return;
    _aplicarValorNoCampo(el, dados[id]);
  });
}

/* Trackers ativos por key — permite untrackForm() remover o
   listener certo mais tarde (ex.: quando o modal é salvo/fechado). */
const _formTrackers = new Map();

/* Liga a captura automática de `container` sob `key`: aplica
   IMEDIATAMENTE qualquer rascunho já salvo (ex.: reaberto depois de
   um F5) e, a partir daí, persiste a cada 'input'/'change' (mesmo
   debounce de setState — ver _WRITE_DEBOUNCE_MS). Devolve o
   rascunho aplicado (ou null, se não havia nenhum), para o módulo
   usar em qualquer lógica adicional própria (ex.: campos que não
   são <input>/<select> nativos, como um array de categorias). */
function trackForm(key, container, opts = {}) {
  if (!container) return null;
  untrackForm(key); // evita acumular listeners se chamado 2x na mesma key
  const persist = opts.persist ?? 'session';

  const salvo = _readRaw(key, persist);
  if (salvo) applyFormNow(container, salvo);

  const handler = () => setState(key, captureFormNow(container), { persist });
  container.addEventListener('input', handler);
  container.addEventListener('change', handler);
  _formTrackers.set(key, { container, handler });

  return salvo;
}

/* Desliga a captura automática — chamar sempre que o formulário for
   salvo de verdade ou cancelado (junto com clearState(key), para
   também apagar o rascunho persistido). Seguro chamar mesmo sem
   nenhum tracker ativo para essa key. */
function untrackForm(key) {
  const t = _formTrackers.get(key);
  if (!t) return;
  t.container.removeEventListener('input', t.handler);
  t.container.removeEventListener('change', t.handler);
  _formTrackers.delete(key);
}

export const UIState = {
  getState,
  setState,
  clearState,
  hasState,
  captureScrollNow,
  applyScrollNow,
  preserveScroll,
  registerView,
  initAutoCapture,
  restoreView,
  captureView,
  captureFormNow,
  applyFormNow,
  trackForm,
  untrackForm,
};

export default UIState;