/* dashboard\js\agenda\agenda_interactions.js
   proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   Interações do módulo Agenda: drag & drop (planejado ↔
   agendado, mover/redimensionar cartão), modal de estudo,
   modal de rotina, modal de confirmação, autocomplete de
   conteúdo, seletor de cor, navegação de semana/menu da
   semana e a barra de abas (Agenda/Metas/Estatísticas) que
   substitui a antiga sidebar do calendário. Portado de
   pessoal/calendar/calendar.js, trocando IDs/classes para o
   prefixo `agenda-*` usado no template deste módulo.

   v10 — Adiciona initTimePicker()/initDatePicker(): os campos
   de Hora inicial/final, Rotina (início/fim) e Data (meta
   "Concluir até") deixaram de ser <input type="time"/"date">
   nativos (preenchimento caractere a caractere, com máscara
   imposta pelo navegador). Continuam sendo <input> reais com
   o MESMO id — só a FORMA de preencher muda:
     • clique  → abre um seletor customizado (relógio de duas
                 colunas / calendário mensal) no padrão visual
                 do Dashboard;
     • teclado → Enter/Espaço abre e fecha o seletor, setas ↑/↓
                 funcionam como spinner (Shift = pula hora
                 inteira), dígitos digitados em sequência (ex.:
                 "1430") preenchem sem ordem/máscara forçada, e
                 Backspace/Delete limpa o campo (preserva o
                 conceito de estudo "planejado", sem horário).
   Nenhuma outra função deste arquivo teve sua lógica interna
   alterada: os pickers apenas gravam `.value` e disparam
   'input'/'change' no mesmo elemento que a lógica já lia.
   ============================================= */

import {
  state, SUBJECTS, SNAP_MINUTES, MIN_SESSION_MINUTES,
  TIMELINE_START_HOUR, TIMELINE_END_HOUR,
  getWeekKey, buildEmptyWeek, uid, getSession, findConflicts,
  timeToMinutes, minutesToTime, snapMinutes, offsetToMinutes, timeToOffset,
  getHourHeight, isPlanned, sortPlanned, saveStorage, saveRoutine,
  recalcTimelineBounds,
  showToast, DAY_NAMES, DAY_SHORT, getMondayOf, toISO, escHtml,
  persistirEstadoUIAgenda,
} from './agenda.js';

import { renderCalendar } from './agenda_render.js';
import { openGoalsView, closeGoalEditor, openGoalEditor, saveGoalFromEditor, deleteGoalFromEditor, setGoalLinkMode, renderStats } from './agenda_pages.js';

/* ══════════════════ CONFIRMAÇÃO (Promise) ══════════════════ */
let _confirmResolver = null;

export function confirmDialog(message, opts = {}) {
  const { title = 'Confirmar ação', confirmLabel = 'Confirmar', danger = false } = opts;
  return new Promise((resolve) => {
    _confirmResolver = resolve;
    document.getElementById('agenda-confirm-title').textContent = title;
    document.getElementById('agenda-confirm-message').textContent = message;
    const okBtn = document.getElementById('agenda-confirm-btn-ok');
    okBtn.textContent = confirmLabel;
    okBtn.classList.toggle('agenda-btn-danger', danger);
    okBtn.classList.toggle('agenda-btn-save', !danger);
    const overlay = document.getElementById('agenda-modal-confirm');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    setTimeout(() => okBtn.focus(), 50);
  });
}

function resolveConfirm(result) {
  const overlay = document.getElementById('agenda-modal-confirm');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  if (_confirmResolver) { _confirmResolver(result); _confirmResolver = null; }
}

/* ══════════════════ TOGGLE STATUS ══════════════════ */
export function toggleSessionStatus(weekKey, dayIdx, sessionId) {
  const dayArr = (state.weeks[weekKey] && state.weeks[weekKey][dayIdx]) || [];
  const session = dayArr.find(s => s.id === sessionId);
  if (!session) return;
  session.status = session.status === 'done' ? 'pending' : 'done';
  saveStorage();
  renderCalendar();
}

/* ══════════════════ DRAG: mover horário ══════════════════ */
export function initCardDrag(card, weekKey, dayIdx, sessionId) {
  card.addEventListener('mousedown', (e) => {
    if (e.target.closest('.agenda-card-check') || e.target.closest('.agenda-card-resize-handle') || e.target.closest('.agenda-card-move-handle')) return;
    if (e.button !== 0) return;

    const session = getSession(weekKey, dayIdx, sessionId);
    if (!session || isPlanned(session)) return;

    const startY = e.clientY;
    const startTop = parseFloat(card.style.top) || 0;
    const startMin = timeToMinutes(session.timeStart || session.time);
    const endMin = timeToMinutes(session.timeEnd) || startMin + 60;
    const duration = endMin - startMin;
    let moved = false;

    card.classList.add('is-dragging');

    function onMove(ev) {
      const dy = ev.clientY - startY;
      if (Math.abs(dy) > 3) moved = true;
      let newTop = startTop + dy;
      let newStartMin = snapMinutes(offsetToMinutes(newTop));
      newStartMin = Math.max(TIMELINE_START_HOUR * 60, Math.min(newStartMin, TIMELINE_END_HOUR * 60 - duration));
      newTop = timeToOffset(minutesToTime(newStartMin));
      card.style.top = `${newTop}px`;
      card._dragNewStartMin = newStartMin;
    }

    async function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      card.classList.remove('is-dragging');

      if (moved && card._dragNewStartMin !== undefined) {
        const newStartMin = card._dragNewStartMin;
        const newStart = minutesToTime(newStartMin);
        const newEnd = minutesToTime(newStartMin + duration);
        card.dataset.suppressClick = '1';

        const conflicts = findConflicts(weekKey, dayIdx, newStart, newEnd, sessionId);
        if (conflicts.length) {
          const c = conflicts[0];
          const proceed = await confirmDialog(`Esse novo horário conflita com "${c.subject}" (${c.timeStart}–${c.timeEnd}). Mover mesmo assim?`, { title: 'Conflito de horário', confirmLabel: 'Mover mesmo assim' });
          if (!proceed) { renderCalendar(); return; }
        }

        session.timeStart = newStart;
        session.timeEnd = newEnd;
        delete session.time;
        saveStorage();
        showToast('Horário atualizado.');
        renderCalendar();
      }
      delete card._dragNewStartMin;
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

/* ══════════════════ RESIZE ══════════════════ */
export function initCardResize(handle, card, weekKey, dayIdx, sessionId) {
  if (!handle) return;
  handle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    if (e.button !== 0) return;

    const session = getSession(weekKey, dayIdx, sessionId);
    if (!session || isPlanned(session)) return;

    const startY = e.clientY;
    const startHeight = parseFloat(card.style.height) || 26;
    const startMin = timeToMinutes(session.timeStart || session.time);
    let moved = false;

    function onMove(ev) {
      const dy = ev.clientY - startY;
      if (Math.abs(dy) > 3) moved = true;
      const hourH = getHourHeight();
      let newHeight = startHeight + dy;
      let newDurationMin = snapMinutes((newHeight / hourH) * 60);
      newDurationMin = Math.max(MIN_SESSION_MINUTES, newDurationMin);
      newDurationMin = Math.min(newDurationMin, TIMELINE_END_HOUR * 60 - startMin);
      newHeight = Math.max((newDurationMin / 60) * hourH, 26);
      card.style.height = `${newHeight}px`;
      card._resizeNewDuration = newDurationMin;
    }

    async function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);

      if (moved && card._resizeNewDuration !== undefined) {
        const newEnd = minutesToTime(startMin + card._resizeNewDuration);
        card.dataset.suppressClick = '1';

        const conflicts = findConflicts(weekKey, dayIdx, session.timeStart || session.time, newEnd, sessionId);
        if (conflicts.length) {
          const c = conflicts[0];
          const proceed = await confirmDialog(`Essa duração conflita com "${c.subject}" (${c.timeStart}–${c.timeEnd}). Continuar mesmo assim?`, { title: 'Conflito de horário', confirmLabel: 'Continuar mesmo assim' });
          if (!proceed) { renderCalendar(); return; }
        }

        session.timeEnd = newEnd;
        saveStorage();
        showToast('Duração atualizada.');
        renderCalendar();
      }
      delete card._resizeNewDuration;
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

/* ══════════════════ DRAG & DROP: planejado ↔ agendado ══════════════════ */
export function initPlannedChipDrag(chip, weekKey, dayIdx, sessionId) {
  chip.addEventListener('dragstart', () => {
    state.plannedDrag = { kind: 'planned', weekKey, dayIdx, sessionId };
    chip.classList.add('is-dragging');
  });
  chip.addEventListener('dragend', () => {
    chip.classList.remove('is-dragging');
    document.querySelectorAll('.is-drop-target').forEach(el => el.classList.remove('is-drop-target'));
    state.plannedDrag = null;
  });
  chip.addEventListener('dragover', (e) => {
    if (!state.plannedDrag || state.plannedDrag.kind !== 'planned') return;
    e.preventDefault();
    chip.classList.add('is-drop-hover');
  });
  chip.addEventListener('dragleave', () => chip.classList.remove('is-drop-hover'));
  chip.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    chip.classList.remove('is-drop-hover');
    const drag = state.plannedDrag;
    if (!drag || drag.kind !== 'planned' || drag.sessionId === sessionId) return;
    reorderPlanned(drag.weekKey, drag.dayIdx, drag.sessionId, weekKey, dayIdx, sessionId);
  });
}

function reorderPlanned(fromWeekKey, fromDayIdx, sessionId, toWeekKey, toDayIdx, beforeSessionId) {
  if (fromWeekKey !== toWeekKey) return;
  const dayArr = state.weeks[toWeekKey] && state.weeks[toWeekKey][toDayIdx];
  if (!dayArr) return;

  let moving = null;
  if (fromDayIdx !== toDayIdx) {
    const fromArr = state.weeks[fromWeekKey][fromDayIdx] || [];
    const idx = fromArr.findIndex(s => s.id === sessionId);
    if (idx < 0) return;
    moving = fromArr.splice(idx, 1)[0];
  } else {
    moving = dayArr.find(s => s.id === sessionId);
    if (!moving) return;
  }

  const targetDayArr = state.weeks[toWeekKey][toDayIdx] || [];
  let planned = sortPlanned(targetDayArr.filter(isPlanned).filter(s => s.id !== sessionId));
  const refIdx = planned.findIndex(s => s.id === beforeSessionId);
  if (fromDayIdx !== toDayIdx) {
    if (refIdx < 0) planned.push(moving); else planned.splice(refIdx, 0, moving);
    targetDayArr.push(moving);
  } else if (refIdx < 0) planned.push(moving); else planned.splice(refIdx, 0, moving);

  planned.forEach((s, idx) => { s.order = idx; });
  saveStorage();
  renderCalendar();
  showToast('Ordem dos planejados atualizada.');
}

export function initPlannedDropZone(cellEl, weekKey, dayIdx) {
  cellEl.addEventListener('dragover', (e) => {
    if (!state.plannedDrag) return;
    e.preventDefault();
    cellEl.classList.add('is-drop-target');
  });
  cellEl.addEventListener('dragleave', (e) => {
    if (!cellEl.contains(e.relatedTarget)) cellEl.classList.remove('is-drop-target');
  });
  cellEl.addEventListener('drop', (e) => {
    e.preventDefault();
    cellEl.classList.remove('is-drop-target');
    const drag = state.plannedDrag;
    if (!drag) return;
    if (drag.kind === 'scheduled') {
      scheduledToPlanned(drag.weekKey, drag.dayIdx, drag.sessionId, weekKey, dayIdx);
    } else if (drag.kind === 'planned' && (drag.weekKey !== weekKey || drag.dayIdx !== dayIdx)) {
      reorderPlanned(drag.weekKey, drag.dayIdx, drag.sessionId, weekKey, dayIdx, null);
    }
  });
}

export function initTimelineDropZone(timelineEl, innerEl, weekKey, dayIdx) {
  timelineEl.addEventListener('dragover', (e) => {
    if (!state.plannedDrag || state.plannedDrag.kind !== 'planned') return;
    e.preventDefault();
    timelineEl.classList.add('is-drop-target');
  });
  timelineEl.addEventListener('dragleave', (e) => {
    if (!timelineEl.contains(e.relatedTarget)) timelineEl.classList.remove('is-drop-target');
  });
  timelineEl.addEventListener('drop', async (e) => {
    e.preventDefault();
    timelineEl.classList.remove('is-drop-target');
    const drag = state.plannedDrag;
    if (!drag || drag.kind !== 'planned') return;

    const rect = innerEl.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    let startMin = snapMinutes(offsetToMinutes(offsetY));
    const durationMin = Number(state.routine.minSessionMinutes) || 60;
    startMin = Math.max(TIMELINE_START_HOUR * 60, Math.min(startMin, TIMELINE_END_HOUR * 60 - durationMin));

    await plannedToScheduled(drag.weekKey, drag.dayIdx, drag.sessionId, weekKey, dayIdx, minutesToTime(startMin), durationMin);
  });
}

async function plannedToScheduled(fromWeekKey, fromDayIdx, sessionId, toWeekKey, toDayIdx, timeStart, durationMin) {
  const fromArr = state.weeks[fromWeekKey] && state.weeks[fromWeekKey][fromDayIdx];
  if (!fromArr) return;
  const idx = fromArr.findIndex(s => s.id === sessionId);
  if (idx < 0) return;

  const session = fromArr[idx];
  const timeEnd = minutesToTime(timeToMinutes(timeStart) + durationMin);

  const conflicts = findConflicts(toWeekKey, toDayIdx, timeStart, timeEnd, sessionId);
  if (conflicts.length) {
    const c = conflicts[0];
    const proceed = await confirmDialog(`Esse horário conflita com "${c.subject}" (${c.timeStart}–${c.timeEnd}). Agendar mesmo assim?`, { title: 'Conflito de horário', confirmLabel: 'Agendar mesmo assim' });
    if (!proceed) return;
  }

  fromArr.splice(idx, 1);
  delete session.order;
  session.timeStart = timeStart;
  session.timeEnd = timeEnd;
  delete session.time;

  if (!state.weeks[toWeekKey]) state.weeks[toWeekKey] = buildEmptyWeek();
  if (!state.weeks[toWeekKey][toDayIdx]) state.weeks[toWeekKey][toDayIdx] = [];
  state.weeks[toWeekKey][toDayIdx].push(session);

  saveStorage();
  renderCalendar();
  showToast(`Agendado para ${timeStart} – ${timeEnd}, com base na duração padrão da rotina.`);
}

function scheduledToPlanned(fromWeekKey, fromDayIdx, sessionId, toWeekKey, toDayIdx) {
  const fromArr = state.weeks[fromWeekKey] && state.weeks[fromWeekKey][fromDayIdx];
  if (!fromArr) return;
  const idx = fromArr.findIndex(s => s.id === sessionId);
  if (idx < 0) return;

  const session = fromArr[idx];
  fromArr.splice(idx, 1);
  delete session.timeStart;
  delete session.timeEnd;
  delete session.time;

  if (!state.weeks[toWeekKey]) state.weeks[toWeekKey] = buildEmptyWeek();
  if (!state.weeks[toWeekKey][toDayIdx]) state.weeks[toWeekKey][toDayIdx] = [];
  const targetArr = state.weeks[toWeekKey][toDayIdx];
  const existingPlanned = sortPlanned(targetArr.filter(isPlanned));
  session.order = existingPlanned.length ? existingPlanned[existingPlanned.length - 1].order + 1 : 0;
  targetArr.push(session);

  saveStorage();
  renderCalendar();
  showToast('Estudo movido para Planejados, sem horário.');
}

export function initScheduledToPlannedDrag(card, weekKey, dayIdx, sessionId) {
  const handle = card.querySelector('.agenda-card-move-handle');
  if (!handle) return;
  handle.addEventListener('mousedown', (e) => e.stopPropagation());
  handle.addEventListener('dragstart', (e) => {
    e.stopPropagation();
    state.plannedDrag = { kind: 'scheduled', weekKey, dayIdx, sessionId };
    card.classList.add('is-dragging');
    document.querySelector('.agenda-module')?.classList.add('is-dragging-scheduled');
  });
  handle.addEventListener('dragend', () => {
    card.classList.remove('is-dragging');
    document.querySelector('.agenda-module')?.classList.remove('is-dragging-scheduled');
    document.querySelectorAll('.is-drop-target').forEach(el => el.classList.remove('is-drop-target'));
    state.plannedDrag = null;
  });
}

/* ══════════════════ CAMPOS INTELIGENTES DE HORA/DATA ══════════════════
   Ver cabeçalho do arquivo e o bloco "CAMPOS INTELIGENTES DE
   DATA/HORA" em agenda.css. Ambas as funções abaixo operam sobre o
   MESMO <input id="..."> que a lógica de saveSession()/
   saveRoutineModal()/saveGoalFromEditor() já lê via `.value` — só
   trocam a experiência de preenchimento, nunca o dado gravado. */

function dispatchValueChange(input) {
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function positionPopoverNear(popover, anchor) {
  const GAP = 8;    // distância vertical entre o input e o popover
  const MARGIN = 8; // respiro mínimo em relação às bordas do limite (modal/janela)

  const rect = anchor.getBoundingClientRect();
  const popRect = popover.getBoundingClientRect();

  // Limite de contenção: o modal (.agenda-modal) mais próximo do input,
  // se existir — assim o popover nunca ultrapassa as bordas do modal
  // mesmo que a janela seja bem maior. Fora de um modal (ex.: dentro da
  // aba "Metas"), cai de volta para os limites da própria janela.
  const modalEl = anchor.closest('.agenda-modal');
  const boundsRect = modalEl ? modalEl.getBoundingClientRect() : null;
  const boundLeft   = Math.max(MARGIN, boundsRect ? boundsRect.left : MARGIN);
  const boundRight  = Math.min(window.innerWidth - MARGIN, boundsRect ? boundsRect.right : window.innerWidth - MARGIN);
  const boundTop    = MARGIN;
  const boundBottom = window.innerHeight - MARGIN;

  // Horizontal: centralizado em relação ao input, depois "empurrado"
  // para dentro dos limites caso estoure de um dos lados — o popover
  // fica visualmente ancorado ao campo, e não a uma posição fixa.
  let left = rect.left + rect.width / 2 - popRect.width / 2;
  left = Math.min(left, boundRight - popRect.width);
  left = Math.max(left, boundLeft);

  // Vertical: abre abaixo do input por padrão; se não houver espaço até
  // o limite inferior, inverte para cima do input automaticamente; se
  // nenhum dos dois lados tiver espaço suficiente (campo muito perto do
  // topo/rodapé), apenas garante que o popover fique inteiramente
  // dentro dos limites, o mais próximo possível do input.
  const spaceBelow = boundBottom - (rect.bottom + GAP);
  const spaceAbove = (rect.top - GAP) - boundTop;
  let top;
  if (popRect.height <= spaceBelow) {
    top = rect.bottom + GAP; // cabe abaixo (comportamento padrão)
  } else if (popRect.height <= spaceAbove) {
    top = rect.top - GAP - popRect.height; // não cabe abaixo, mas cabe acima
  } else {
    // não cabe inteiro em nenhum dos dois lados — usa o lado com mais
    // espaço disponível; o clamp final abaixo garante visibilidade total.
    top = spaceBelow >= spaceAbove ? rect.bottom + GAP : rect.top - GAP - popRect.height;
  }
  top = Math.min(top, boundBottom - popRect.height);
  top = Math.max(top, boundTop);

  popover.style.top = `${top}px`;
  popover.style.left = `${left}px`;
}

/* Registro dos seletores de horário atualmente abertos. Permite
   fechá-los de fora (ex.: quando o modal principal é fechado) sem
   acoplar initTimePicker() a closeSessionModal()/closeRoutineModal()
   — cada instância só se registra/desregistra a si mesma. */
let _openTimePickerClosers = [];
function closeAllTimePickers() {
  [..._openTimePickerClosers].forEach(fn => fn());
}

/* Ancora o popover de horário no campo de horário (wrapper
   input + ícone), não mais só no input "puro". O ícone continua
   sendo o único responsável por abrir/fechar o popover — aqui ele
   só entra como referência para fechar a distância horizontal,
   já que fica inset alguns pixels dentro da borda do input
   (right: 6px, ver .agenda-time-icon-btn em agenda.css).
   Regra: borda direita do popover = borda direita do ÍCONE,
   deslocada só o suficiente para não colar nem sobrepor (GAP_X
   pequeno, 8–12px). Verticalmente, abre logo abaixo do campo
   (GAP_Y pequeno), com flip para cima se não houver espaço. */
function positionPopoverNearInput(popover, input, iconBtn) {
  const GAP_Y = 8;   // espaço vertical entre o campo e o popover
  const GAP_X = 10;  // espaço horizontal entre o ícone e a borda do popover
  const MARGIN = 8;

  const fieldRect = input.getBoundingClientRect();
  const anchorRect = iconBtn ? iconBtn.getBoundingClientRect() : fieldRect;
  const popRect = popover.getBoundingClientRect();

  const viewportLeft  = MARGIN;
  const viewportRight = window.innerWidth - MARGIN;
  const boundTop      = MARGIN;
  const boundBottom   = window.innerHeight - MARGIN;

  // Horizontal: borda direita do popover = borda direita do ÍCONE
  // menos um respiro pequeno e fixo (não mais a borda externa do
  // input inteiro, que ficava alguns pixels mais à direita/distante).
  let left = anchorRect.right - GAP_X - popRect.width + GAP_X; // = anchorRect.right - popRect.width
  left = anchorRect.right - popRect.width;
  left = Math.max(viewportLeft, Math.min(left, viewportRight - popRect.width));

  // Vertical: abaixo do campo por padrão; inverte para cima se não
  // houver espaço; clamp final garante visibilidade total.
  const spaceBelow = boundBottom - (fieldRect.bottom + GAP_Y);
  const spaceAbove = (fieldRect.top - GAP_Y) - boundTop;
  let top;
  if (popRect.height <= spaceBelow) {
    top = fieldRect.bottom + GAP_Y;
  } else if (popRect.height <= spaceAbove) {
    top = fieldRect.top - GAP_Y - popRect.height;
  } else {
    top = spaceBelow >= spaceAbove ? fieldRect.bottom + GAP_Y : fieldRect.top - GAP_Y - popRect.height;
  }
  top = Math.min(top, boundBottom - popRect.height);
  top = Math.max(top, boundTop);

  popover.style.top = `${top}px`;
  popover.style.left = `${left}px`;
}

/* ── Seletor de hora: duas colunas roláveis (hora / minuto) ──
   v11 — O input voltou a ser um campo de texto comum (sem
   readonly): a digitação livre ("8"→08:00, "830"→08:30,
   "1430"→14:30, "08:30"→08:30) é a forma PRINCIPAL de uso e é
   formatada apenas ao perder o foco ou confirmar com Enter — não
   mais interceptada tecla a tecla. O clique no input NÃO abre
   mais o seletor; quem abre é o botão de relógio
   (.agenda-time-icon-btn) ao lado, adicionado em TEMPLATE_HTML.
   O seletor em si (build/open/close/syncActive/scrollToActive)
   não teve nenhuma lógica interna alterada. */
function initTimePicker(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const btn = document.getElementById(`${inputId}-picker-btn`);

  let popover = null;

  function currentMinutes() {
    const v = input.value.trim();
    if (!/^\d{2}:\d{2}$/.test(v)) return null;
    return timeToMinutes(v);
  }

  function commit(minutes) {
    minutes = ((minutes % 1440) + 1440) % 1440;
    const val = minutesToTime(minutes);
    if (input.value !== val) { input.value = val; dispatchValueChange(input); }
  }

  function clearValue() {
    if (input.value !== '') { input.value = ''; dispatchValueChange(input); }
  }

  function parseFreeTyped(raw) {
    const digits = raw.replace(/\D/g, '');
    if (!digits) return null;
    let h, m;
    if (digits.length <= 2) {
      h = Math.min(23, Number(digits));
      m = 0;
    } else {
      m = Math.min(59, Number(digits.slice(-2)));
      h = Math.min(23, Number(digits.slice(0, digits.length - 2)));
    }
    return h * 60 + m;
  }

  function formatTypedValue() {
    const raw = input.value.trim();
    if (!raw) { clearValue(); return; }
    if (/^\d{2}:\d{2}$/.test(raw) && currentMinutes() !== null) return;
    const mins = parseFreeTyped(raw);
    if (mins === null) { clearValue(); return; }
    commit(mins);
    if (popover) { syncActive(); scrollToActive(); }
  }

  function syncActive() {
    if (!popover) return;
    const mins = currentMinutes();
    const h = mins === null ? null : Math.floor(mins / 60);
    const m = mins === null ? null : mins % 60;
    popover.querySelectorAll('[data-hour]').forEach(el => {
      el.classList.toggle('active', h !== null && Number(el.dataset.hour) === h);
    });
    popover.querySelectorAll('[data-min]').forEach(el => {
      el.classList.toggle('active', m !== null && Number(el.dataset.min) === Math.round(m / 5) * 5 % 60);
    });
  }

  function scrollToActive() {
    if (!popover) return;
    popover.querySelector('[data-hour].active')?.scrollIntoView({ block: 'center' });
    popover.querySelector('[data-min].active')?.scrollIntoView({ block: 'center' });
  }

  function build() {
    const pop = document.createElement('div');
    pop.className = 'agenda-picker-popover agenda-time-popover';

    const cols = document.createElement('div');
    cols.className = 'agenda-time-cols';

    const hourCol = document.createElement('div');
    hourCol.className = 'agenda-time-col';
    for (let h = 0; h < 24; h++) {
      const opt = document.createElement('div');
      opt.className = 'agenda-time-opt';
      opt.dataset.hour = String(h);
      opt.textContent = String(h).padStart(2, '0');
      hourCol.appendChild(opt);
    }

    const sep = document.createElement('div');
    sep.className = 'agenda-time-sep';
    sep.textContent = ':';

    const minCol = document.createElement('div');
    minCol.className = 'agenda-time-col';
    for (let m = 0; m < 60; m += 5) {
      const opt = document.createElement('div');
      opt.className = 'agenda-time-opt';
      opt.dataset.min = String(m);
      opt.textContent = String(m).padStart(2, '0');
      minCol.appendChild(opt);
    }

    cols.appendChild(hourCol);
    cols.appendChild(sep);
    cols.appendChild(minCol);

    const footer = document.createElement('div');
    footer.className = 'agenda-time-popover-footer';
    footer.innerHTML = `<span class="agenda-time-quick-hint">Digite, ex.: 1430</span><button type="button" class="agenda-time-clear">Limpar</button>`;

    pop.appendChild(cols);
    pop.appendChild(footer);

    cols.addEventListener('click', (e) => {
      const hourOpt = e.target.closest('[data-hour]');
      const minOpt = e.target.closest('[data-min]');
      if (!hourOpt && !minOpt) return;
      const mins = currentMinutes();
      const now = new Date();
      let h = mins === null ? now.getHours() : Math.floor(mins / 60);
      let m = mins === null ? Math.round(now.getMinutes() / 5) * 5 : mins % 60;
      if (hourOpt) h = Number(hourOpt.dataset.hour);
      if (minOpt) m = Number(minOpt.dataset.min);
      commit(h * 60 + m);
      syncActive();
    });

    footer.querySelector('.agenda-time-clear').addEventListener('click', () => { clearValue(); close(); });

    return pop;
  }

function open() {
    if (popover || !btn) return;
    popover = build();
    document.body.appendChild(popover);
    positionPopoverNearInput(popover, input);           // was: positionPopoverNearIcon(popover, btn)
    requestAnimationFrame(() => popover && popover.classList.add('open'));
    input.classList.add('is-open');
    syncActive();
    scrollToActive();
    window.addEventListener('scroll', onScrollReposition, true);
    window.addEventListener('resize', onResizeReposition);
    _openTimePickerClosers.push(close);
  }

  function close() {
    if (!popover) return;
    popover.classList.remove('open');
    input.classList.remove('is-open');
    const p = popover;
    popover = null;
    window.removeEventListener('scroll', onScrollReposition, true);
    window.removeEventListener('resize', onResizeReposition);
    _openTimePickerClosers = _openTimePickerClosers.filter(fn => fn !== close);
    setTimeout(() => p.remove(), 150);
  }

function onScrollReposition() {
    if (popover) positionPopoverNearInput(popover, input);   // was: if (popover && btn) positionPopoverNearIcon(popover, btn)
  }
  function onResizeReposition() {
    if (popover) positionPopoverNearInput(popover, input);   // was: if (popover && btn) positionPopoverNearIcon(popover, btn)
  }

  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      popover ? close() : open();
    });
  }

  // v12 — digitação livre, porém limitada a dígitos e no máximo 4
  // caracteres (ex.: "1430"). Sem máscara: os dígitos digitados só
  // são filtrados/cortados aqui; a interpretação/formatação em
  // "HH:MM" continua acontecendo só no blur/Enter, via
  // formatTypedValue(), sem nenhuma mudança de lógica. Valores já
  // formatados programaticamente ("HH:MM", vindos de commit()/do
  // seletor) batem no regex abaixo e não são afetados pelo filtro.
  input.addEventListener('input', () => {
    if (/^\d{2}:\d{2}$/.test(input.value)) return;
    const digitsOnly = input.value.replace(/\D/g, '').slice(0, 4);
    if (input.value !== digitsOnly) {
      const removed = input.value.length - digitsOnly.length;
      const pos = Math.max(0, (input.selectionStart || digitsOnly.length) - removed);
      input.value = digitsOnly;
      input.setSelectionRange(pos, pos);
    }
  });

  input.addEventListener('blur', formatTypedValue);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') formatTypedValue();
    else if (e.key === 'Escape' && popover) close();
  });

  document.addEventListener('mousedown', (e) => {
    if (!popover) return;
    if (input.contains(e.target) || popover.contains(e.target) || (btn && btn.contains(e.target))) return;
    close();
  });
}

/* ── Seletor de data: calendário mensal ── */
const MONTH_FULL = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function buildMonthGrid(viewDate, selectedDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // 0 = Segunda
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayIso = toISO(new Date());
  const selectedIso = selectedDate ? toISO(selectedDate) : null;

  const cells = [];
  for (let i = 0; i < startOffset; i++) {
    const date = new Date(year, month, 1 - (startOffset - i));
    cells.push({ date, outside: true });
  }
  for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(year, month, d), outside: false });
  while (cells.length < 42) {
    const date = new Date(year, month, cells.length - startOffset + 1);
    cells.push({ date, outside: true });
  }

  return cells.map(c => ({
    day: c.date.getDate(),
    date: c.date,
    outside: c.outside,
    isToday: toISO(c.date) === todayIso,
    isSelected: selectedIso !== null && toISO(c.date) === selectedIso,
  }));
}

function initDatePicker(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  let popover = null;
  let viewDate = new Date();

  function parseValue() {
    const v = input.value.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
    const [y, m, d] = v.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function commit(date) {
    const iso = toISO(date);
    if (input.value !== iso) { input.value = iso; dispatchValueChange(input); }
  }

  function clearValue() {
    if (input.value !== '') { input.value = ''; dispatchValueChange(input); }
  }

  function renderGrid() {
    const body = popover.querySelector('.agenda-date-grid');
    const title = popover.querySelector('.agenda-date-title');
    title.textContent = `${MONTH_FULL[viewDate.getMonth()]} de ${viewDate.getFullYear()}`;
    body.innerHTML = '';
    buildMonthGrid(viewDate, parseValue()).forEach(cell => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'agenda-date-cell'
        + (cell.outside ? ' is-outside' : '')
        + (cell.isToday ? ' is-today' : '')
        + (cell.isSelected ? ' is-selected' : '');
      btn.textContent = cell.day;
      btn.addEventListener('click', () => { commit(cell.date); close(); });
      body.appendChild(btn);
    });
  }

  function build() {
    const pop = document.createElement('div');
    pop.className = 'agenda-picker-popover agenda-date-popover';
    pop.innerHTML = `
      <div class="agenda-date-head">
        <button type="button" class="agenda-date-nav" data-nav="-1" aria-label="Mês anterior">‹</button>
        <span class="agenda-date-title"></span>
        <button type="button" class="agenda-date-nav" data-nav="1" aria-label="Próximo mês">›</button>
      </div>
      <div class="agenda-date-weekdays">${DAY_SHORT.map(d => `<span class="agenda-date-weekday">${d[0]}</span>`).join('')}</div>
      <div class="agenda-date-grid"></div>
      <div class="agenda-date-footer">
        <button type="button" class="agenda-date-today-btn">Hoje</button>
        <button type="button" class="agenda-date-clear">Limpar</button>
      </div>
    `;
    pop.querySelector('[data-nav="-1"]').addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth() - 1); renderGrid(); repositionSoon(); });
    pop.querySelector('[data-nav="1"]').addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth() + 1); renderGrid(); repositionSoon(); });
    pop.querySelector('.agenda-date-today-btn').addEventListener('click', () => { commit(new Date()); close(); });
    pop.querySelector('.agenda-date-clear').addEventListener('click', () => { clearValue(); close(); });
    return pop;
  }

  function repositionSoon() {
    if (popover) requestAnimationFrame(() => popover && positionPopoverNear(popover, input));
  }

  function open() {
    if (popover) return;
    const existing = parseValue();
    viewDate = existing ? new Date(existing) : new Date();
    popover = build();
    document.body.appendChild(popover);
    renderGrid();
    positionPopoverNear(popover, input);
    requestAnimationFrame(() => popover && popover.classList.add('open'));
    input.classList.add('is-open');
    input.focus();
    window.addEventListener('scroll', onOutsideScroll, true);
    window.addEventListener('resize', close);
  }

  function close() {
    if (!popover) return;
    popover.classList.remove('open');
    input.classList.remove('is-open');
    const p = popover;
    popover = null;
    window.removeEventListener('scroll', onOutsideScroll, true);
    window.removeEventListener('resize', close);
    setTimeout(() => p.remove(), 150);
  }

  function onOutsideScroll(e) {
    if (popover && !popover.contains(e.target)) close();
  }

  input.addEventListener('click', () => { popover ? close() : open(); });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopImmediatePropagation(); close(); return; }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopImmediatePropagation(); popover ? close() : open(); return; }
    if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); e.stopImmediatePropagation(); clearValue(); }
  });

  document.addEventListener('mousedown', (e) => {
    if (!popover) return;
    if (input.contains(e.target) || popover.contains(e.target)) return;
    close();
  });
}

/* ══════════════════ MODAL: Novo/Editar estudo ══════════════════ */
function populateDayOptions(currentDayIdx) {
  const select = document.getElementById('agenda-input-day');
  let days = [...(state.routine.activeDays || [])].sort((a, b) => a - b);
  if (currentDayIdx !== null && currentDayIdx !== undefined && !days.includes(currentDayIdx)) {
    days.push(currentDayIdx); days.sort((a, b) => a - b);
  }
  if (!days.length) days = [0, 1, 2, 3, 4, 5, 6];
  select.innerHTML = days.map(d => `<option value="${d}">${DAY_NAMES[d]}</option>`).join('');
}

export function openSessionModal({ weekKey, dayIdx, sessionId }) {
  const overlay = document.getElementById('agenda-modal-session');
  const isEdit = sessionId !== null && sessionId !== undefined;

  state.modal.context = { weekKey, dayIdx, sessionId };
  state.modal.mode = isEdit ? 'edit' : 'new';

  document.getElementById('agenda-modal-title').textContent = isEdit ? 'Editar estudo' : 'Novo estudo';
  populateDayOptions(dayIdx);
  document.getElementById('agenda-input-day').value = String(dayIdx ?? 0);
  hideDurationHint();

  if (isEdit) {
    const session = getSession(weekKey, dayIdx, sessionId);
    document.getElementById('agenda-input-time').value = session.timeStart || session.time || '';
    document.getElementById('agenda-input-time-end').value = session.timeEnd || '';
    document.getElementById('agenda-input-subject').value = session.subject || '';
    document.getElementById('agenda-input-note').value = session.note || '';
    setColorPicker('agenda-color-options', session.color || 'blue');
    state.modal.color = session.color || 'blue';
    document.getElementById('agenda-btn-delete').style.display = 'inline-flex';
  } else {
    document.getElementById('agenda-input-time').value = '';
    document.getElementById('agenda-input-time-end').value = '';
    document.getElementById('agenda-input-subject').value = '';
    document.getElementById('agenda-input-note').value = '';
    setColorPicker('agenda-color-options', 'blue');
    state.modal.color = 'blue';
    document.getElementById('agenda-btn-delete').style.display = 'none';
  }

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => document.getElementById('agenda-input-time').focus(), 100);
}

function closeSessionModal() {
  closeAllTimePickers();
  const overlay = document.getElementById('agenda-modal-session');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.getElementById('agenda-subject-suggestions').classList.remove('visible');
  hideDurationHint();
}
function hideDurationHint() {
  const hint = document.getElementById('agenda-duration-hint');
  hint.style.display = 'none';
  hint.classList.remove('is-active');
}

function updateDurationSuggestion() {
  const startVal = document.getElementById('agenda-input-time').value.trim();
  const endInput = document.getElementById('agenda-input-time-end');
  const hint = document.getElementById('agenda-duration-hint');
  const minSession = Number(state.routine.minSessionMinutes) || 60;
  if (!startVal) { hideDurationHint(); return; }

  if (!endInput.value.trim()) {
    const suggestedEnd = minutesToTime(timeToMinutes(startVal) + minSession);
    endInput.value = suggestedEnd;
    hint.textContent = `Duração sugerida com base na sua rotina: ${formatDurationLabel(minSession)} (até ${suggestedEnd}).`;
    hint.style.display = 'block';
    hint.classList.add('is-active');
  } else {
    hideDurationHint();
  }
}

function formatDurationLabel(mins) {
  if (mins % 60 === 0) return `${mins / 60} hora${mins / 60 > 1 ? 's' : ''}`;
  return `${mins} minutos`;
}

function nextPlannedOrder(weekKey, dayIdx, excludeId) {
  const dayArr = (state.weeks[weekKey] && state.weeks[weekKey][dayIdx]) || [];
  const planned = sortPlanned(dayArr.filter(s => isPlanned(s) && s.id !== excludeId));
  if (!planned.length) return 0;
  const last = planned[planned.length - 1];
  return Number.isFinite(last.order) ? last.order + 1 : planned.length;
}

async function saveSession() {
  const dayIdx = Number(document.getElementById('agenda-input-day').value);
  const timeInput = document.getElementById('agenda-input-time');
  const timeEndInput = document.getElementById('agenda-input-time-end');
  const timeStart = timeInput.value.trim();
  const timeEnd = timeEndInput.value.trim();
  const subject = document.getElementById('agenda-input-subject').value.trim();
  const note = document.getElementById('agenda-input-note').value.trim();
  const color = state.modal.color;

  if (timeInput.validity && timeInput.validity.badInput) return showToast('Hora inicial incompleta.');
  if (timeEndInput.validity && timeEndInput.validity.badInput) return showToast('Hora final incompleta.');
  if (!subject) return showToast('Por favor, informe o conteúdo.');
  if ((timeStart && !timeEnd) || (!timeStart && timeEnd)) return showToast('Preencha as duas horas, ou deixe ambas em branco para um estudo planejado.');
  if (timeStart && timeEnd && timeEnd <= timeStart) return showToast('A hora final deve ser depois da inicial.');
  if (timeStart && timeEnd) {
    const duration = timeToMinutes(timeEnd) - timeToMinutes(timeStart);
    if (duration < MIN_SESSION_MINUTES) return showToast(`A sessão deve ter no mínimo ${MIN_SESSION_MINUTES} minutos.`);
  }

  const { weekKey, sessionId } = state.modal.context;
  const isEdit = state.modal.mode === 'edit';

  if (timeStart && timeEnd) {
    const conflicts = findConflicts(weekKey, dayIdx, timeStart, timeEnd, isEdit ? sessionId : null);
    if (conflicts.length) {
      const c = conflicts[0];
      const proceed = await confirmDialog(`Conflito de horário com "${c.subject}" (${c.timeStart}–${c.timeEnd}). Deseja salvar mesmo assim?`, { title: 'Conflito de horário', confirmLabel: 'Salvar mesmo assim' });
      if (!proceed) return;
    }
  }

  if (!state.weeks[weekKey]) state.weeks[weekKey] = buildEmptyWeek();
  const prevDayIdx = state.modal.context.dayIdx;
  const becamePlanned = !timeStart && !timeEnd;

  if (isEdit && prevDayIdx !== dayIdx) {
    const fromArr = state.weeks[weekKey][prevDayIdx] || [];
    const idx = fromArr.findIndex(s => s.id === sessionId);
    let existing = {};
    if (idx >= 0) { existing = fromArr[idx]; fromArr.splice(idx, 1); }
    const toArr = state.weeks[weekKey][dayIdx] || [];
    const newSession = { id: sessionId, timeStart, timeEnd, subject, note, color, status: existing.status || 'pending' };
    if (becamePlanned) newSession.order = nextPlannedOrder(weekKey, dayIdx);
    toArr.push(newSession);
    state.weeks[weekKey][dayIdx] = toArr;
  } else if (isEdit) {
    const dayArr = state.weeks[weekKey][dayIdx] || [];
    const idx = dayArr.findIndex(s => s.id === sessionId);
    if (idx >= 0) {
      const wasPlanned = isPlanned(dayArr[idx]);
      dayArr[idx] = { ...dayArr[idx], timeStart, timeEnd, subject, note, color };
      delete dayArr[idx].time;
      if (becamePlanned && !wasPlanned) dayArr[idx].order = nextPlannedOrder(weekKey, dayIdx, sessionId);
      else if (!becamePlanned) delete dayArr[idx].order;
    }
  } else {
    const dayArr = state.weeks[weekKey][dayIdx] || [];
    const newSession = { id: uid(), timeStart, timeEnd, subject, note, color, status: 'pending' };
    if (becamePlanned) newSession.order = nextPlannedOrder(weekKey, dayIdx);
    dayArr.push(newSession);
    state.weeks[weekKey][dayIdx] = dayArr;
  }

  saveStorage();
  renderCalendar();
  closeSessionModal();
  showToast(isEdit ? 'Estudo atualizado.' : 'Estudo adicionado.');
}

function deleteSession() {
  const { weekKey, dayIdx, sessionId } = state.modal.context;
  if (!state.weeks[weekKey]) return;
  state.weeks[weekKey][dayIdx] = (state.weeks[weekKey][dayIdx] || []).filter(s => s.id !== sessionId);
  saveStorage();
  renderCalendar();
  closeSessionModal();
  showToast('Estudo removido.');
}

/* ══════════════════ COLOR PICKER ══════════════════ */
function setColorPicker(containerId, color) {
  document.querySelectorAll(`#${containerId} .agenda-color-dot`).forEach(dot => {
    dot.classList.toggle('active', dot.dataset.color === color);
  });
}

function initColorPicker(containerId, stateKey) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.addEventListener('click', e => {
    const dot = e.target.closest('.agenda-color-dot');
    if (!dot) return;
    const color = dot.dataset.color;
    if (stateKey === 'modal') state.modal.color = color;
    else if (stateKey === 'goalModal') state.goalModal.color = color;
    setColorPicker(containerId, color);
  });
}

/* ══════════════════ AUTOCOMPLETE DE CONTEÚDO ══════════════════ */
function initAutocomplete(inputId, suggestionsId) {
  const input = document.getElementById(inputId);
  const box = document.getElementById(suggestionsId);
  if (!input || !box) return;
  let focusIdx = -1;

  function showSuggestions(val) {
    if (!val) { box.classList.remove('visible'); return; }
    const matches = SUBJECTS.filter(s => s.toLowerCase().startsWith(val.toLowerCase()));
    if (!matches.length) { box.classList.remove('visible'); return; }
    box.innerHTML = matches.map((m, i) => `<div class="agenda-suggestion-item" data-idx="${i}">${m}</div>`).join('');
    box.classList.add('visible');
    focusIdx = -1;
  }

  input.addEventListener('input', () => showSuggestions(input.value));
  input.addEventListener('keydown', e => {
    const items = box.querySelectorAll('.agenda-suggestion-item');
    if (!items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); focusIdx = (focusIdx + 1) % items.length; items.forEach((el, i) => el.classList.toggle('focused', i === focusIdx)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusIdx = (focusIdx - 1 + items.length) % items.length; items.forEach((el, i) => el.classList.toggle('focused', i === focusIdx)); }
    else if (e.key === 'Enter' && focusIdx >= 0) { e.preventDefault(); input.value = items[focusIdx].textContent; box.classList.remove('visible'); }
    else if (e.key === 'Escape') box.classList.remove('visible');
  });
  box.addEventListener('mousedown', e => {
    const item = e.target.closest('.agenda-suggestion-item');
    if (item) { e.preventDefault(); input.value = item.textContent; box.classList.remove('visible'); }
  });
  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !box.contains(e.target)) box.classList.remove('visible');
  });
}

/* ══════════════════ ROTINA DE ESTUDOS ══════════════════ */
function openRoutineModal() {
  const overlay = document.getElementById('agenda-modal-routine');
  document.querySelectorAll('#agenda-routine-days input[type="checkbox"]').forEach(cb => {
    cb.checked = state.routine.activeDays.includes(Number(cb.dataset.day));
  });
  document.getElementById('agenda-routine-start').value = state.routine.startHour;
  document.getElementById('agenda-routine-end').value = state.routine.endHour;
  document.getElementById('agenda-routine-min-session').value = String(state.routine.minSessionMinutes || 60);
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
}

function closeRoutineModal() {
  closeAllTimePickers();
  const overlay = document.getElementById('agenda-modal-routine');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
}

function saveRoutineModal() {
  const activeDays = [...document.querySelectorAll('#agenda-routine-days input[type="checkbox"]')].filter(cb => cb.checked).map(cb => Number(cb.dataset.day));
  const startHour = document.getElementById('agenda-routine-start').value.trim();
  const endHour = document.getElementById('agenda-routine-end').value.trim();
  const minSessionMinutes = Number(document.getElementById('agenda-routine-min-session').value);

  if (!startHour || !endHour) return showToast('Defina o horário inicial e final do dia.');
  if (endHour <= startHour) return showToast('O horário final deve ser depois do inicial.');
  if (!activeDays.length) return showToast('Selecione ao menos um dia ativo.');

  state.routine = { activeDays, startHour, endHour, minSessionMinutes };
  saveRoutine();
  // CORREÇÃO: recalcTimelineBounds() precisa rodar de forma SÍNCRONA e
  // ANTES de renderCalendar(). A versão anterior usava import('./agenda.js')
  // (dinâmico), cuja Promise só resolve depois que renderCalendar() já
  // tinha sido executado — por isso a grade continuava com o intervalo de
  // horas antigo até um F5 (que recarrega o módulo e chama
  // recalcTimelineBounds() de forma síncrona dentro de loadStorage()).
  recalcTimelineBounds();
  renderCalendar();
  closeRoutineModal();
  showToast('Rotina de estudos atualizada.');
}

/* ══════════════════ NAVEGAÇÃO DE SEMANA ══════════════════ */
function navigateWeek(delta) {
  const d = new Date(state.currentWeekStart);
  d.setDate(d.getDate() + delta * 7);
  if (delta < 0) {
    const todayMonday = getMondayOf(new Date());
    const weeksBack = Math.round((todayMonday - d) / (7 * 86400000));
    if (weeksBack > 1) return;
  }
  state.currentWeekStart = d;
  renderCalendar();
  persistirEstadoUIAgenda();
}

function goToToday() {
  state.currentWeekStart = getMondayOf(new Date());
  renderCalendar();
  persistirEstadoUIAgenda();
}

function toggleWeekMenu(forceClose) {
  const menu = document.getElementById('agenda-week-menu');
  if (forceClose) { menu.classList.remove('open'); return; }
  menu.classList.toggle('open');
}

async function copyPreviousWeek() {
  toggleWeekMenu(true);
  const currentMonday = state.currentWeekStart;
  const prevMonday = new Date(currentMonday);
  prevMonday.setDate(prevMonday.getDate() - 7);
  const prevKey = toISO(prevMonday);
  const currentKey = getWeekKey();
  const prevData = state.weeks[prevKey];

  if (!prevData || Object.values(prevData).every(arr => !arr.length)) return showToast('A semana anterior está vazia.');

  const currentData = state.weeks[currentKey];
  const hasCurrentData = currentData && Object.values(currentData).some(arr => arr.length);
  const proceed = hasCurrentData
    ? await confirmDialog('A semana atual já possui estudos. Copiar a semana anterior vai substituir os dados existentes. Continuar?', { title: 'Copiar semana anterior', confirmLabel: 'Substituir e copiar', danger: true })
    : await confirmDialog('Copiar todos os estudos da semana anterior para a semana atual?', { title: 'Copiar semana anterior', confirmLabel: 'Copiar' });
  if (!proceed) return;

  const newWeek = buildEmptyWeek();
  Object.keys(prevData).forEach(dayIdx => {
    newWeek[dayIdx] = (prevData[dayIdx] || []).map(s => ({ ...s, id: uid(), status: 'pending' }));
  });
  state.weeks[currentKey] = newWeek;
  saveStorage();
  renderCalendar();
  showToast('Semana anterior copiada.');
}

async function clearCurrentWeek() {
  toggleWeekMenu(true);
  const currentKey = getWeekKey();
  const currentData = state.weeks[currentKey];
  const hasData = currentData && Object.values(currentData).some(arr => arr.length);
  if (!hasData) return showToast('Esta semana já está vazia.');

  const proceed = await confirmDialog('Tem certeza que deseja apagar todos os estudos desta semana? Esta ação não pode ser desfeita.', { title: 'Limpar semana', confirmLabel: 'Apagar tudo', danger: true });
  if (!proceed) return;

  state.weeks[currentKey] = buildEmptyWeek();
  saveStorage();
  renderCalendar();
  showToast('Semana limpa.');
}

/* ══════════════════ ABAS (Agenda / Metas / Estatísticas) ══════════════════
   Exportada para que agenda.js possa restaurar a aba salva (UIState)
   assim que o template é montado — sem isso, um F5 na aba
   "Estatísticas" sempre voltaria visualmente para "Agenda", mesmo
   com state.activeTab já restaurado internamente. */
export function switchTab(tab) {
  state.activeTab = tab;
  document.querySelectorAll('.agenda-tab').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));
  document.getElementById('agenda-page-week').classList.toggle('active', tab === 'agenda');
  document.getElementById('agenda-page-goals').classList.toggle('active', tab === 'goals');
  document.getElementById('agenda-page-stats').classList.toggle('active', tab === 'stats');

  if (tab === 'goals') { openGoalsView(); }
  if (tab === 'stats') { renderStats(); }

  persistirEstadoUIAgenda();
}

/* ══════════════════ WIRING GERAL (chamado 1x por abrirAgenda) ══════════════════ */
export function initAgendaEventListeners() {
  document.getElementById('agenda-btn-prev').addEventListener('click', () => navigateWeek(-1));
  document.getElementById('agenda-btn-next').addEventListener('click', () => navigateWeek(1));
  document.getElementById('agenda-week-title-btn').addEventListener('click', goToToday);

  document.getElementById('agenda-week-menu-btn').addEventListener('click', (e) => { e.stopPropagation(); toggleWeekMenu(); });
  document.getElementById('agenda-action-copy-prev-week').addEventListener('click', copyPreviousWeek);
  document.getElementById('agenda-action-clear-week').addEventListener('click', clearCurrentWeek);
  document.addEventListener('click', (e) => {
    const wrap = document.querySelector('.agenda-week-menu-wrap');
    if (wrap && !wrap.contains(e.target)) toggleWeekMenu(true);
  });

  document.getElementById('agenda-tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.agenda-tab');
    if (btn) switchTab(btn.dataset.tab);
  });

  document.getElementById('agenda-btn-new').addEventListener('click', () => {
    const dow = state.currentWeekStart.getDay();
    openSessionModal({ weekKey: getWeekKey(), dayIdx: dow === 0 ? 6 : dow - 1, sessionId: null });
  });
  document.getElementById('agenda-btn-routine').addEventListener('click', openRoutineModal);

  document.getElementById('agenda-modal-close').addEventListener('click', closeSessionModal);
  document.getElementById('agenda-btn-cancel').addEventListener('click', closeSessionModal);
  document.getElementById('agenda-btn-save').addEventListener('click', saveSession);
  document.getElementById('agenda-btn-delete').addEventListener('click', deleteSession);

  document.getElementById('agenda-input-time').addEventListener('change', updateDurationSuggestion);
  document.getElementById('agenda-input-time-end').addEventListener('input', hideDurationHint);

  document.getElementById('agenda-modal-routine-close').addEventListener('click', closeRoutineModal);
  document.getElementById('agenda-btn-routine-cancel').addEventListener('click', closeRoutineModal);
  document.getElementById('agenda-btn-routine-save').addEventListener('click', saveRoutineModal);

  document.getElementById('agenda-btn-new-goal').addEventListener('click', () => openGoalEditor(null));
  document.getElementById('agenda-btn-goal-cancel').addEventListener('click', closeGoalEditor);
  document.getElementById('agenda-btn-goal-save').addEventListener('click', saveGoalFromEditor);
  document.getElementById('agenda-btn-goal-delete').addEventListener('click', deleteGoalFromEditor);
  document.getElementById('agenda-goal-period').addEventListener('change', (e) => {
    document.getElementById('agenda-goal-deadline-group').style.display = e.target.value === 'custom' ? '' : 'none';
  });
  document.getElementById('agenda-goal-link-options').addEventListener('click', (e) => {
    const btn = e.target.closest('.agenda-goal-link-opt');
    if (btn) setGoalLinkMode(btn.dataset.mode);
  });
  document.getElementById('agenda-goal-manual-progress').addEventListener('input', (e) => {
    document.getElementById('agenda-goal-manual-progress-value').textContent = `${e.target.value}%`;
  });

  document.getElementById('agenda-confirm-btn-ok').addEventListener('click', () => resolveConfirm(true));
  document.getElementById('agenda-confirm-btn-cancel').addEventListener('click', () => resolveConfirm(false));

  document.getElementById('agenda-modal-session').addEventListener('click', e => { if (e.target === e.currentTarget) closeSessionModal(); });
  document.getElementById('agenda-modal-routine').addEventListener('click', e => { if (e.target === e.currentTarget) closeRoutineModal(); });
  document.getElementById('agenda-modal-confirm').addEventListener('click', e => { if (e.target === e.currentTarget) resolveConfirm(false); });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('agenda-modal-confirm').classList.contains('open')) resolveConfirm(false);
    else if (document.getElementById('agenda-modal-routine').classList.contains('open')) closeRoutineModal();
    else if (document.getElementById('agenda-modal-session').classList.contains('open')) closeSessionModal();
    else toggleWeekMenu(true);
  });

  initColorPicker('agenda-color-options', 'modal');
  initColorPicker('agenda-goal-color-options', 'goalModal');
  initAutocomplete('agenda-input-subject', 'agenda-subject-suggestions');
  initAutocomplete('agenda-goal-subject', 'agenda-goal-subject-suggestions');

  // Campos inteligentes de hora/data — registrados ANTES do listener de
  // "Enter salva o formulário" abaixo, para que Enter/Espaço nesses campos
  // controle o seletor (abrir/fechar) em vez de disparar saveSession()
  // imediatamente (o handler de teclado de cada picker usa
  // stopImmediatePropagation() para isso).
  initTimePicker('agenda-input-time');
  initTimePicker('agenda-input-time-end');
  initTimePicker('agenda-routine-start');
  initTimePicker('agenda-routine-end');
  initDatePicker('agenda-goal-deadline');

  ['agenda-input-time', 'agenda-input-time-end', 'agenda-input-subject'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); saveSession(); } });
  });

  window.addEventListener('resize', () => { if (document.getElementById('agenda-page-week')?.classList.contains('active')) renderCalendar(); });
}