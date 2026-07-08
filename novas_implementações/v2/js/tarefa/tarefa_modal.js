/* dashboard\js\tarefa\tarefa_modal.js
   proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   Modal genérico usado em todas as entradas de texto do módulo
   Tarefas (renomear lista, categoria, tarefa) e confirmação de
   exclusão, além do modal rico de criação de lista (abrirModalNovaLista).
   Sem framework — cria/remove o próprio DOM a cada chamada.
   Responsabilidade ÚNICA: interface do modal. Persistência fica em
   tarefa_storage.js — este arquivo não sabe nada de Firestore. */

function _escapeHtmlModal(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

const _ICON_PLUS  = `<svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 2.5v9M2.5 7h9"/></svg>`;
const _ICON_TRASH = `<svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.5 4h9M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.6 8a1 1 0 001 .9h4.8a1 1 0 001-.9L11 4"/></svg>`;

function _fechar(overlay) {
  overlay.classList.remove('is-aberto');
  setTimeout(() => overlay.remove(), 200);
}

export function abrirModalTexto({ titulo, label = 'Nome', valorInicial = '', textoConfirmar = 'Salvar' }) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'tarefa-modal-overlay';
    overlay.innerHTML = `
      <div class="tarefa-modal" role="dialog" aria-modal="true">
        <h3 class="tarefa-modal-title">${_escapeHtmlModal(titulo)}</h3>
        <label class="tarefa-modal-label">${_escapeHtmlModal(label)}</label>
        <input type="text" class="tarefa-modal-input" maxlength="80" />
        <div class="tarefa-modal-actions">
          <button type="button" class="tarefa-modal-btn tarefa-modal-btn-cancelar">Cancelar</button>
          <button type="button" class="tarefa-modal-btn tarefa-modal-btn-confirmar">${_escapeHtmlModal(textoConfirmar)}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('is-aberto'));

    const input = overlay.querySelector('.tarefa-modal-input');
    input.value = valorInicial;
    input.focus();
    input.select();

    const confirmar = () => {
      const valor = input.value.trim();
      if (!valor) { input.focus(); return; }
      _fechar(overlay);
      resolve(valor);
    };
    const cancelar = () => { _fechar(overlay); resolve(null); };

    overlay.querySelector('.tarefa-modal-btn-confirmar').addEventListener('click', confirmar);
    overlay.querySelector('.tarefa-modal-btn-cancelar').addEventListener('click', cancelar);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') confirmar();
      if (e.key === 'Escape') cancelar();
    });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) cancelar(); });
  });
}

export function abrirModalConfirmar({ titulo, mensagem, textoConfirmar = 'Excluir' }) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'tarefa-modal-overlay';
    overlay.innerHTML = `
      <div class="tarefa-modal" role="dialog" aria-modal="true">
        <h3 class="tarefa-modal-title">${_escapeHtmlModal(titulo)}</h3>
        <p class="tarefa-modal-msg">${_escapeHtmlModal(mensagem)}</p>
        <div class="tarefa-modal-actions">
          <button type="button" class="tarefa-modal-btn tarefa-modal-btn-cancelar">Cancelar</button>
          <button type="button" class="tarefa-modal-btn tarefa-modal-btn-perigo">${_escapeHtmlModal(textoConfirmar)}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('is-aberto'));

    overlay.querySelector('.tarefa-modal-btn-perigo').addEventListener('click', () => { _fechar(overlay); resolve(true); });
    overlay.querySelector('.tarefa-modal-btn-cancelar').addEventListener('click', () => { _fechar(overlay); resolve(false); });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) { _fechar(overlay); resolve(false); } });
  });
}

/* ── Modal rico de criação de lista ──
   Resolve para `null` (cancelado) ou para:
     { nome: string, disciplinaId: string|null, categorias: [{ nome, itens: string[] }] }
   `categorias` vem vazio no modo simples — quem chama decide se usa
   criarLista() ou criarListaCompleta() com base nisso.
   `disciplinas`: [{ id, nome }] — vem do módulo de disciplinas do
   semestre atual (ver tarefa.js), nunca fixo aqui. */
export function abrirModalNovaLista({ disciplinas = [] } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'tarefa-modal-overlay';

    let modo = 'simples'; // 'simples' | 'completo'
    let categoriasState = []; // [{ nome, itens: string[] }]

    overlay.innerHTML = `
      <div class="tarefa-modal tarefa-modal--nova-lista" role="dialog" aria-modal="true" aria-labelledby="tnl-title">
        <h3 class="tarefa-modal-title" id="tnl-title">Nova lista de tarefas</h3>

        <div class="tarefa-modal-tabs" role="tablist">
          <button type="button" class="tarefa-modal-tab is-active" data-modo="simples" role="tab" aria-selected="true">Modo simples</button>
          <button type="button" class="tarefa-modal-tab" data-modo="completo" role="tab" aria-selected="false">Modo completo</button>
        </div>
        <p class="tarefa-modal-tab-hint" id="tnl-hint">Crie só o nome agora e organize o resto depois.</p>

        <div class="tarefa-modal-section">
          <label class="tarefa-modal-label">Nome da lista</label>
          <input type="text" class="tarefa-modal-input" id="tnl-nome" maxlength="80" placeholder="Ex: Estudos para a prova final" />
        </div>

        <div class="tarefa-modal-section">
          <label class="tarefa-modal-label">Associar a uma disciplina <span class="tarefa-modal-opcional">(opcional)</span></label>
          <select class="tarefa-modal-select" id="tnl-disciplina">
            <option value="">Nenhuma</option>
            ${disciplinas.map(d => `<option value="${_escapeHtmlModal(d.id)}">${_escapeHtmlModal(d.nome)}</option>`).join('')}
          </select>
        </div>

        <div class="tarefa-modal-section tarefa-modal-secao-categorias" id="tnl-secao-categorias" hidden>
          <div class="tarefa-modal-separador"></div>
          <label class="tarefa-modal-label">Categorias e itens</label>
          <div class="tarefa-modal-categorias" id="tnl-categorias"></div>
          <button type="button" class="tarefa-modal-btn-add" id="tnl-add-categoria">${_ICON_PLUS} Adicionar categoria</button>
        </div>

        <div class="tarefa-modal-actions">
          <button type="button" class="tarefa-modal-btn tarefa-modal-btn-cancelar">Cancelar</button>
          <button type="button" class="tarefa-modal-btn tarefa-modal-btn-confirmar" id="tnl-confirmar">Criar lista</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('is-aberto'));

    const inputNome  = overlay.querySelector('#tnl-nome');
    const selectDisc = overlay.querySelector('#tnl-disciplina');
    const secaoCat   = overlay.querySelector('#tnl-secao-categorias');
    const catsWrap   = overlay.querySelector('#tnl-categorias');
    const hint       = overlay.querySelector('#tnl-hint');
    const tabs       = overlay.querySelectorAll('.tarefa-modal-tab');

    inputNome.focus();

    function _renderCategorias() {
      catsWrap.innerHTML = categoriasState.map((cat, catIdx) => `
        <div class="tarefa-modal-categoria-bloco" data-cat-idx="${catIdx}">
          <div class="tarefa-modal-categoria-cabecalho">
            <input type="text" class="tarefa-modal-input tarefa-modal-input-categoria" placeholder="Nome da categoria" value="${_escapeHtmlModal(cat.nome)}" />
            <button type="button" class="tarefa-modal-icon-btn tnl-remover-categoria" title="Remover categoria" aria-label="Remover categoria">${_ICON_TRASH}</button>
          </div>
          <div class="tarefa-modal-itens-chips">
            ${cat.itens.map((item, itIdx) => `
              <span class="tarefa-modal-chip" data-it-idx="${itIdx}">
                ${_escapeHtmlModal(item)}
                <button type="button" class="tnl-remover-item" aria-label="Remover item">&times;</button>
              </span>`).join('')}
          </div>
          <div class="tarefa-modal-add-item">
            <input type="text" class="tarefa-modal-input tarefa-modal-input-item" placeholder="Novo item + Enter" />
          </div>
        </div>`).join('');
    }

    overlay.querySelector('#tnl-add-categoria').addEventListener('click', () => {
      categoriasState.push({ nome: '', itens: [] });
      _renderCategorias();
      catsWrap.querySelector('.tarefa-modal-categoria-bloco:last-child .tarefa-modal-input-categoria')?.focus();
    });

    catsWrap.addEventListener('click', (e) => {
      const bloco = e.target.closest('.tarefa-modal-categoria-bloco');
      if (!bloco) return;
      const catIdx = Number(bloco.dataset.catIdx);

      if (e.target.closest('.tnl-remover-categoria')) {
        categoriasState.splice(catIdx, 1);
        _renderCategorias();
        return;
      }
      if (e.target.closest('.tnl-remover-item')) {
        const chip = e.target.closest('.tarefa-modal-chip');
        const itIdx = Number(chip.dataset.itIdx);
        categoriasState[catIdx].itens.splice(itIdx, 1);
        _renderCategorias();
      }
    });

    catsWrap.addEventListener('input', (e) => {
      const bloco = e.target.closest('.tarefa-modal-categoria-bloco');
      if (!bloco || !e.target.classList.contains('tarefa-modal-input-categoria')) return;
      categoriasState[Number(bloco.dataset.catIdx)].nome = e.target.value;
    });

    catsWrap.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const bloco = e.target.closest('.tarefa-modal-categoria-bloco');
      if (!bloco || !e.target.classList.contains('tarefa-modal-input-item')) return;
      e.preventDefault();
      const catIdx = Number(bloco.dataset.catIdx);
      const valor = e.target.value.trim();
      if (!valor) return;
      categoriasState[catIdx].itens.push(valor);
      _renderCategorias();
      catsWrap.querySelectorAll('.tarefa-modal-categoria-bloco')[catIdx]
        ?.querySelector('.tarefa-modal-input-item')?.focus();
    });

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        modo = tab.dataset.modo;
        tabs.forEach(t => {
          t.classList.toggle('is-active', t === tab);
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });
        const ehCompleto = modo === 'completo';
        secaoCat.hidden = !ehCompleto;
        hint.textContent = ehCompleto
          ? 'Monte categorias e itens agora — tudo em uma única criação.'
          : 'Crie só o nome agora e organize o resto depois.';
        if (ehCompleto && categoriasState.length === 0) {
          categoriasState.push({ nome: '', itens: [] });
          _renderCategorias();
        }
      });
    });

    const confirmar = () => {
      const nome = inputNome.value.trim();
      if (!nome) { inputNome.focus(); return; }

      const disciplinaId = selectDisc.value || null;
      const categorias = modo === 'completo'
        ? categoriasState
            .map(c => ({ nome: c.nome.trim(), itens: c.itens.filter(Boolean) }))
            .filter(c => c.nome)
        : [];

      _fechar(overlay);
      resolve({ nome, disciplinaId, categorias });
    };
    const cancelar = () => { _fechar(overlay); resolve(null); };

    overlay.querySelector('#tnl-confirmar').addEventListener('click', confirmar);
    overlay.querySelector('.tarefa-modal-btn-cancelar').addEventListener('click', cancelar);
    inputNome.addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmar(); });
    overlay.addEventListener('keydown', (e) => { if (e.key === 'Escape') cancelar(); });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) cancelar(); });
  });
}