/* dashboard\js\checklist\checklist_renderer.js
 proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   Responsabilidade ÚNICA: renderização visual do Checklist.
   Não lê Firestore, não decide o que carregar, não conhece
   State — recebe dados já prontos (checklistData + progresso)
   e apenas desenha/atualiza o DOM. Zero cálculo de negócio além
   de somar/contar itens já concluídos para exibir progresso. */

function _escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function _progressoDisciplina(disciplina, progresso) {
  const itens      = disciplina.itens ?? [];
  const total      = itens.length;
  const concluidos = itens.filter(it => progresso[it.id] === true).length;
  const pct        = total > 0 ? Math.round((concluidos / total) * 100) : 0;
  return { total, concluidos, pct };
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

/* Renderiza o Checklist completo. `progresso` é mantido por
   REFERÊNCIA (mutado diretamente no listener de change abaixo),
   para que os contadores possam ser atualizados sem re-renderizar
   a árvore inteira a cada clique. `onToggleItem(itemId, concluido)`
   é chamado apenas como efeito colateral de persistência — não
   afeta o que é exibido (isso já foi feito antes de chamá-lo). */
export function renderChecklist(containerEl, checklistData, progresso, semestre, onToggleItem) {
  const disciplinas = checklistData?.disciplinas ?? [];

  if (disciplinas.length === 0) {
    renderEstadoVazio(containerEl, 'Nenhuma disciplina cadastrada no checklist deste semestre.');
    return;
  }

  const totalItens = disciplinas.reduce((acc, d) => acc + (d.itens?.length ?? 0), 0);
  const totalConcluidos = disciplinas.reduce(
    (acc, d) => acc + (d.itens ?? []).filter(it => progresso[it.id] === true).length,
    0
  );
  const pctGeral = totalItens > 0 ? Math.round((totalConcluidos / totalItens) * 100) : 0;

  containerEl.innerHTML = `
    <div class="checklist-header">
      <div class="checklist-header-left">
        <h2 class="checklist-title">Checklist</h2>
        <p class="checklist-subtitle">Semestre ${_escapeHtml(semestre)}</p>
      </div>
      <div class="checklist-progress-geral">
        <div class="checklist-progress-ring-wrap">
          <div class="checklist-progress-bar-bg">
            <div class="checklist-progress-bar-fill" style="width:${pctGeral}%"></div>
          </div>
          <span class="checklist-progress-pct">${pctGeral}%</span>
        </div>
        <span class="checklist-progress-label">${totalConcluidos}/${totalItens} concluídos</span>
      </div>
    </div>
    <div class="checklist-disciplinas" id="checklist-disciplinas"></div>
  `;

  const wrap = containerEl.querySelector('#checklist-disciplinas');

  disciplinas.forEach(disc => {
    const { total, concluidos, pct } = _progressoDisciplina(disc, progresso);

    const card = document.createElement('div');
    card.className = 'checklist-disc-card';
    card.dataset.discId = disc.id;

    const itensHtml = (disc.itens ?? []).map(item => {
      const marcado = progresso[item.id] === true;
      return `
        <label class="checklist-item${marcado ? ' is-concluido' : ''}">
          <input type="checkbox" class="checklist-item-checkbox" data-item-id="${_escapeHtml(item.id)}" ${marcado ? 'checked' : ''} />
          <span class="checklist-item-check" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2.5 6.2l2.3 2.3L9.5 3.5"/>
            </svg>
          </span>
          <span class="checklist-item-titulo">${_escapeHtml(item.titulo)}</span>
        </label>`;
    }).join('');

    card.innerHTML = `
      <div class="checklist-disc-head">
        <div class="checklist-disc-titulo-wrap">
          ${disc.emoji ? `<span class="checklist-disc-emoji">${_escapeHtml(disc.emoji)}</span>` : ''}
          <span class="checklist-disc-nome">${_escapeHtml(disc.nome)}</span>
        </div>
        <span class="checklist-disc-contagem">${concluidos}/${total}</span>
      </div>
      <div class="checklist-disc-bar-bg">
        <div class="checklist-disc-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="checklist-itens-lista">
        ${itensHtml || '<span class="checklist-itens-vazio">Nenhum item cadastrado.</span>'}
      </div>
    `;

    wrap.appendChild(card);
  });

  /* Delegação única de evento no container das disciplinas —
     sobrevive a qualquer atualização futura, pois o wrap em si
     só é recriado quando renderChecklist() é chamado de novo
     (troca de semestre), não a cada clique. */
  wrap.addEventListener('change', (e) => {
    const checkbox = e.target.closest('.checklist-item-checkbox');
    if (!checkbox) return;

    const itemId    = checkbox.dataset.itemId;
    const concluido = checkbox.checked;

    /* Atualiza o estado exibido ANTES de qualquer chamada externa
       — a UI nunca espera a persistência para reagir ao clique. */
    progresso[itemId] = concluido;
    checkbox.closest('.checklist-item')?.classList.toggle('is-concluido', concluido);
    _atualizarContadores(containerEl, checklistData, progresso);

    onToggleItem?.(itemId, concluido);
  });
}

function _atualizarContadores(containerEl, checklistData, progresso) {
  const disciplinas = checklistData?.disciplinas ?? [];

  disciplinas.forEach(disc => {
    const card = containerEl.querySelector(`.checklist-disc-card[data-disc-id="${CSS.escape(disc.id)}"]`);
    if (!card) return;

    const { total, concluidos, pct } = _progressoDisciplina(disc, progresso);
    const contagemEl = card.querySelector('.checklist-disc-contagem');
    const barFill     = card.querySelector('.checklist-disc-bar-fill');
    if (contagemEl) contagemEl.textContent = `${concluidos}/${total}`;
    if (barFill)    barFill.style.width    = `${pct}%`;
  });

  const totalItens = disciplinas.reduce((acc, d) => acc + (d.itens?.length ?? 0), 0);
  const totalConcluidos = disciplinas.reduce(
    (acc, d) => acc + (d.itens ?? []).filter(it => progresso[it.id] === true).length,
    0
  );
  const pctGeral = totalItens > 0 ? Math.round((totalConcluidos / totalItens) * 100) : 0;

  const pctEl   = containerEl.querySelector('.checklist-progress-pct');
  const fillEl  = containerEl.querySelector('.checklist-progress-bar-fill');
  const labelEl = containerEl.querySelector('.checklist-progress-label');
  if (pctEl)   pctEl.textContent  = `${pctGeral}%`;
  if (fillEl)  fillEl.style.width = `${pctGeral}%`;
  if (labelEl) labelEl.textContent = `${totalConcluidos}/${totalItens} concluídos`;
}