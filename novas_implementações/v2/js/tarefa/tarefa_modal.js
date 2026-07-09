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
const _ICON_CLOSE = `<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 3l8 8M11 3l-8 8"/></svg>`;

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
   `disciplinas`: [{ id, nome, emoji }] — vem do módulo de disciplinas
   do semestre atual (ver tarefa.js), nunca fixo aqui. `emoji` é
   opcional; quando presente, é usado como prefixo visual da opção
   no select, na mesma identidade usada pelo resto do Dashboard
   (ver .disc-item / sidebar-disciplinas em dashboard.js).

   ── Validação "lazy" (estilo Notion/Linear/GitHub) ──
   O modal nunca nasce com erros visíveis, e simplesmente focar/
   desfocar campos (clicar, tabular, sair vazio) também não gera
   nenhum erro — navegar pelo formulário é sempre neutro. O único
   gatilho que liga a validação visual é uma tentativa de submit
   (clicar em "Criar"): a partir daí, `tentouSubmeter` fica `true`
   pelo resto da vida do modal e a validação passa a ser dinâmica —
   cada campo corrigido faz o erro dele sumir na hora, e qualquer
   campo/categoria nova criada depois desse ponto já é validada em
   tempo real também. */
export function abrirModalNovaLista({ disciplinas = [] } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'tarefa-modal-overlay';

    let modo = 'simples'; // 'simples' | 'completo'
    let categoriasState = []; // [{ nome, itens: string[] }]

    // Único gatilho de validação visual: uma tentativa de submit.
    // Antes disso, nada — nem focar, nem desfocar, nem digitar —
    // deve pintar um campo de vermelho.
    let tentouSubmeter = false;

    overlay.innerHTML = `
      <div class="tarefa-modal tarefa-modal--nova-lista" role="dialog" aria-modal="true" aria-labelledby="tnl-title">
        <div class="tarefa-modal-header">
          <h3 class="tarefa-modal-title" id="tnl-title">Nova lista de tarefas</h3>
          <button type="button" class="tarefa-modal-fechar" id="tnl-fechar" aria-label="Fechar">${_ICON_CLOSE}</button>
        </div>

        <div class="tarefa-modal-body tarefa-scroll-fino">
          <div class="tarefa-modal-tabs" role="tablist">
            <button type="button" class="tarefa-modal-tab is-active" data-modo="simples" role="tab" aria-selected="true">Modo simples</button>
            <button type="button" class="tarefa-modal-tab" data-modo="completo" role="tab" aria-selected="false">Modo completo</button>
          </div>
          <p class="tarefa-modal-tab-hint" id="tnl-hint">Crie só o nome agora e organize o resto depois.</p>

          <div class="tarefa-modal-section">
            <label class="tarefa-modal-label">Nome da lista</label>
            <input type="text" class="tarefa-modal-input" id="tnl-nome" maxlength="80" placeholder="Ex: Estudos para a prova final" />
            <span class="tarefa-modal-campo-erro" id="tnl-erro-nome" hidden>Informe um nome para a lista.</span>
          </div>

          <div class="tarefa-modal-section">
            <label class="tarefa-modal-label">Associar a uma disciplina <span class="tarefa-modal-opcional">(opcional)</span></label>
            <select class="tarefa-modal-select" id="tnl-disciplina">
              <option value="">Nenhuma</option>
              ${disciplinas.map(d => `<option value="${_escapeHtmlModal(d.id)}">${d.emoji ? _escapeHtmlModal(d.emoji) + ' ' : ''}${_escapeHtmlModal(d.nome)}</option>`).join('')}
            </select>
          </div>

          <div class="tarefa-modal-section tarefa-modal-secao-categorias" id="tnl-secao-categorias" hidden>
            <div class="tarefa-modal-separador"></div>
            <label class="tarefa-modal-label">Categorias e itens</label>
            <div class="tarefa-modal-categorias tarefa-scroll-fino" id="tnl-categorias"></div>
            <button type="button" class="tarefa-modal-btn-add" id="tnl-add-categoria">${_ICON_PLUS} Adicionar categoria</button>
          </div>
        </div>

        <div class="tarefa-modal-actions tarefa-modal-footer">
          <button type="button" class="tarefa-modal-btn tarefa-modal-btn-cancelar">Cancelar</button>
          <button type="button" class="tarefa-modal-btn tarefa-modal-btn-confirmar" id="tnl-confirmar">Criar lista</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('is-aberto'));

    const inputNome    = overlay.querySelector('#tnl-nome');
    const erroNomeEl   = overlay.querySelector('#tnl-erro-nome');
    const selectDisc   = overlay.querySelector('#tnl-disciplina');
    const secaoCat     = overlay.querySelector('#tnl-secao-categorias');
    const catsWrap     = overlay.querySelector('#tnl-categorias');
    const hint         = overlay.querySelector('#tnl-hint');
    const tabs         = overlay.querySelectorAll('.tarefa-modal-tab');
    const btnConfirmar = overlay.querySelector('#tnl-confirmar');

    inputNome.focus();

    /* ── Cálculo de erros (puro) ──
       Não decide o que mostrar na tela — só descreve o que está
       inválido. Quem decide exibir ou não é _aplicarValidacaoUI(),
       cruzando isso com `tentouSubmeter`. */
    function _computarErros() {
      const erros = { nome: !inputNome.value.trim(), categorias: [] };
      if (modo === 'completo') {
        categoriasState.forEach(cat => {
          erros.categorias.push({
            semNome:  !cat.nome.trim(),
            semItens: cat.itens.length === 0,
          });
        });
      }
      return erros;
    }

    /* ── Aplicação visual da validação ──
       Um erro só aparece na tela depois que houve uma tentativa de
       submit (tentouSubmeter === true). Antes disso, focar,
       desfocar ou navegar entre campos nunca pinta nada de
       vermelho. A VALIDADE real (retorno da função) é sempre
       calculada em cima do estado verdadeiro dos campos,
       independente de exibição — é o que confirmar() usa para
       decidir se pode seguir em frente. */
    function _aplicarValidacaoUI() {
      const erros = _computarErros();

      // Antes da primeira tentativa de submit, nada é exibido —
      // independentemente de o campo ter sido focado/desfocado.
      const mostrarErroNome = erros.nome && tentouSubmeter;
      inputNome.classList.toggle('is-invalid', mostrarErroNome);
      erroNomeEl.hidden = !mostrarErroNome;

      const blocos = catsWrap.querySelectorAll('.tarefa-modal-categoria-bloco');
      blocos.forEach((bloco, idx) => {
        const catInput = bloco.querySelector('.tarefa-modal-input-categoria');
        const erroEl   = bloco.querySelector('.tarefa-modal-categoria-erro');
        const info     = erros.categorias[idx];
        const temErro  = !!info && (info.semNome || info.semItens);
        const mostrar  = temErro && tentouSubmeter;

        if (!mostrar) {
          catInput?.classList.remove('is-invalid');
          if (erroEl) erroEl.hidden = true;
          return;
        }

        catInput.classList.toggle('is-invalid', info.semNome);
        if (erroEl) {
          if (info.semNome) {
            erroEl.textContent = 'Dê um nome a esta categoria.';
            erroEl.hidden = false;
          } else if (info.semItens) {
            erroEl.textContent = 'Adicione ao menos um item nesta categoria.';
            erroEl.hidden = false;
          } else {
            erroEl.hidden = true;
          }
        }
      });

      const categoriasOk = modo !== 'completo'
        || erros.categorias.every(c => !c.semNome && !c.semItens);
      const valido = !erros.nome && categoriasOk;

      // O botão fica sempre clicável — é o clique que revela os
      // erros (padrão Notion/Linear), em vez de nascer desabilitado.
      return valido;
    }

    function _renderCategorias() {
      catsWrap.innerHTML = categoriasState.map((cat, catIdx) => `
        <div class="tarefa-modal-categoria-bloco" data-cat-idx="${catIdx}">
          <div class="tarefa-modal-categoria-cabecalho">
            <input type="text" class="tarefa-modal-input tarefa-modal-input-categoria" placeholder="Nome da categoria" value="${_escapeHtmlModal(cat.nome)}" />
            <button type="button" class="tarefa-modal-icon-btn tnl-remover-categoria"
                    title="${categoriasState.length <= 1 ? 'Limpar categoria' : 'Remover categoria'}"
                    aria-label="${categoriasState.length <= 1 ? 'Limpar categoria' : 'Remover categoria'}">${_ICON_TRASH}</button>
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
          <p class="tarefa-modal-categoria-erro" hidden></p>
        </div>`).join('');

      _aplicarValidacaoUI();
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
        /* Regra: nunca deixar o formulário com 0 categorias. Se só
           existe uma, "Excluir" limpa os campos em vez de remover
           o bloco — o usuário sempre tem pelo menos uma categoria
           disponível para preencher. */
        if (categoriasState.length <= 1) {
          categoriasState[catIdx] = { nome: '', itens: [] };
        } else {
          categoriasState.splice(catIdx, 1);
        }
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

    // Digitar sempre atualiza o estado; a validação visual só
    // reage a isso depois da 1ª tentativa de submit (ver
    // _aplicarValidacaoUI). Simplesmente focar/desfocar nunca
    // dispara validação — só existe o listener de 'input' aqui,
    // de propósito (nenhum 'blur'/'focusout' nestes campos).
    catsWrap.addEventListener('input', (e) => {
      const bloco = e.target.closest('.tarefa-modal-categoria-bloco');
      if (!bloco || !e.target.classList.contains('tarefa-modal-input-categoria')) return;
      const cat = categoriasState[Number(bloco.dataset.catIdx)];
      cat.nome = e.target.value;
      _aplicarValidacaoUI();
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

    // Mesma regra para o nome da lista: só 'input' (digitar) reage
    // à validação; focar/desfocar o campo nunca pinta nada.
    inputNome.addEventListener('input', () => {
      _aplicarValidacaoUI();
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
        }
        _renderCategorias();
      });
    });

    const confirmar = () => {
      const valido = _aplicarValidacaoUI();
      if (!valido) {
        // Primeira tentativa "fracassada" de submit: a partir de
        // agora a validação passa a ser dinâmica em tempo real,
        // até que todos os erros sejam corrigidos.
        tentouSubmeter = true;
        _aplicarValidacaoUI();

        const erros = _computarErros();
        if (erros.nome) {
          inputNome.focus();
        } else {
          const idxInvalido = erros.categorias.findIndex(c => c.semNome || c.semItens);
          if (idxInvalido !== -1) {
            catsWrap.querySelectorAll('.tarefa-modal-categoria-bloco')[idxInvalido]
              ?.querySelector('.tarefa-modal-input-categoria')?.focus();
          }
        }
        return;
      }

      const nome = inputNome.value.trim();
      const disciplinaId = selectDisc.value || null;
      const categorias = modo === 'completo'
        ? categoriasState.map(c => ({ nome: c.nome.trim(), itens: c.itens.filter(Boolean) }))
        : [];

      _fechar(overlay);
      resolve({ nome, disciplinaId, categorias });
    };
    const cancelar = () => { _fechar(overlay); resolve(null); };

    btnConfirmar.addEventListener('click', confirmar);
    overlay.querySelector('.tarefa-modal-btn-cancelar').addEventListener('click', cancelar);
    overlay.querySelector('#tnl-fechar').addEventListener('click', cancelar);
    inputNome.addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmar(); });
    overlay.addEventListener('keydown', (e) => { if (e.key === 'Escape') cancelar(); });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) cancelar(); });

    // Estado inicial: nada foi tocado ainda, então nenhum erro deve
    // aparecer — mesmo que o nome esteja vazio (é o padrão ao abrir).
    _aplicarValidacaoUI();
  });
}