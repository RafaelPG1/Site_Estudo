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

   Os campos de Hora inicial/final, Rotina (início/fim) e Data
   (meta "Concluir até") são <input type="text"> comuns, de
   digitação manual — sem nenhum seletor/popover associado.
   initTimeInput()/initDateInput() só formatam e validam o que é
   digitado (máscara progressiva, limites de caracteres, correção
   de dia/mês/ano, formato HH:MM / DD/MM/AAAA), gravando o
   resultado em `.value` e disparando 'input'/'change' no mesmo
   elemento que a lógica de salvamento já lê.
   ============================================= */

import {
  state, SUBJECTS, SNAP_MINUTES, MIN_SESSION_MINUTES,
  TIMELINE_START_HOUR, TIMELINE_END_HOUR,
  getWeekKey, buildEmptyWeek, uid, getSession, findConflicts,
  timeToMinutes, minutesToTime, snapMinutes, offsetToMinutes, timeToOffset,
  getHourHeight, isPlanned, sortPlanned, saveStorage, saveRoutine,
  recalcTimelineBounds,
  showToast, DAY_SHORT, getMondayOf, toISO, escHtml,
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

/* ══════════════════ CAMPOS DE HORA/DATA (digitação manual) ══════════════════
   Os campos de Hora inicial/final, Rotina (início/fim) e Data (meta
   "Concluir até") são <input type="text"> comuns, preenchidos por
   digitação livre — sem nenhum seletor/popover associado. Ambas as
   funções abaixo (initTimeInput/initDateInput) só cuidam de formatar e
   validar o que é digitado (máscara progressiva, limites de caracteres,
   correção de dia/mês/ano) sobre o MESMO <input id="..."> que a lógica
   de saveSession()/saveRoutineModal()/saveGoalFromEditor() já lê via
   `.value` — nenhum dado gravado muda, só a formatação em tela. */

function dispatchValueChange(input) {
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

/* ── Hora (HH:MM): digitação livre, ex.: "8"→08:00, "830"→08:30,
   "1430"→14:30, "08:30"→08:30 — formatada apenas ao perder o foco ou
   confirmar com Enter. ── */
function initTimeInput(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

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
  }

  // Digitação limitada a dígitos e no máximo 4 caracteres (ex.: "1430").
  // Sem máscara: os dígitos digitados só são filtrados/cortados aqui; a
  // interpretação/formatação em "HH:MM" continua acontecendo só no
  // blur/Enter, via formatTypedValue(). Valores já formatados
  // programaticamente ("HH:MM") batem no regex abaixo e não são
  // afetados pelo filtro.
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
  });
}

/* ── Data (DD/MM/AAAA): digitação livre, com barras automáticas e
   validação em tempo real contra o calendário real (dias por mês, ano
   bissexto). ── */
function initDateInput(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  /* v16 — hint discreto opcional (ver agenda.js: só o campo
     "Concluir até" tem o span `${inputId}-hint`; outros campos que
     usem initDateInput no futuro simplesmente não terão esse
     elemento, e tudo abaixo já lida com isso via `if (hint)`). */
  const hint = document.getElementById(`${inputId}-hint`);

  /* Liga/desliga o estado de "ano incompleto" — borda vermelha no
     input (mesmo padrão visual de --red já usado em .agenda-btn-danger
     etc.) e, se existir, a mensagem discreta no hint. Nada aqui mexe
     no valor do campo, só na aparência. */
  function setYearError(active) {
    input.classList.toggle('is-error', active);
    if (hint) {
      hint.classList.toggle('is-error', active);
      hint.textContent = active ? 'O ano precisa ter 4 dígitos.' : '';
      hint.style.display = active ? '' : 'none';
    }
  }

  /* Valor exibido/digitado é sempre "DD/MM/AAAA" — mesmo padrão de
     "o que o usuário vê é o que está no .value" já usado no campo de
     horário ("HH:MM"). A conversão para o formato ISO que
     saveGoalFromEditor() grava continua acontecendo só na leitura do
     campo (ver brToISO() em agenda_pages.js) — nada aqui muda o dado
     salvo, só a experiência de preenchimento. */
  function parseValue() {
    const v = input.value.trim();
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
    if (!m) return null;
    const d = Number(m[1]), mo = Number(m[2]), y = Number(m[3]);
    const date = new Date(y, mo - 1, d);
    if (date.getMonth() !== mo - 1) return null; // dia inválido para o mês (ex.: 31/02)
    return date;
  }

  function formatBR(date) {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  function clearValue() {
    if (input.value !== '') { input.value = ''; dispatchValueChange(input); }
  }

  /* ── Formatação + validação EM TEMPO REAL (a cada tecla) ──
     "25122026" já vira "25/12/2026" durante a digitação, e cada bloco
     (dia, depois mês) é grampeado para um intervalo válido assim que
     completa seus 2 dígitos — sem esperar o valor inteiro. O ano
     (últimos 4 dígitos) nunca é tocado aqui. */
  function clampSegment(twoDigits, min, max) {
    if (twoDigits.length < 2) return twoDigits; // ainda incompleto, nada a grampear
    const n = Math.max(min, Math.min(max, Number(twoDigits)));
    return String(n).padStart(2, '0');
  }

  function formatDigitsLive(digits) {
    const day = clampSegment(digits.slice(0, 2), 1, 31);
    const month = clampSegment(digits.slice(2, 4), 1, 12);
    const year = digits.slice(4, 8);
    let out = day;
    if (digits.length >= 2) out += '/';
    out += month;
    if (digits.length >= 4) out += '/';
    out += year;
    return out;
  }

  /* Validação FINAL contra o calendário real (dias por mês, ano
     bissexto) — o clamp por segmento acima não sabe quantos dias tem
     cada mês, então só entra em ação aqui, assim que os 8 dígitos já
     existem (ex.: 31/02 → 28 ou 29, conforme o ano). Mesma regra de
     "cai no último dia real do mês" que já existia. */
  function clampToRealDate(d, mo, y) {
    let date = new Date(y, mo - 1, d);
    if (date.getMonth() !== mo - 1) date = new Date(y, mo, 0);
    return date;
  }

  function formatTypedValue() {
    const raw = input.value.trim();
    if (!raw) { clearValue(); return; }
    // Ano com menos de 4 dígitos = data ainda em edição, não inválida.
    // A formatação/clamp de dia e mês e a validação de calendário real
    // (quando o ano já tem 4 dígitos) já acontecem a cada tecla, no
    // listener de 'input' — aqui, no blur/Enter, não há mais nada a
    // fazer além de preservar exatamente o que já está no campo.
  }

  // Formatação + clamp acontecem a cada tecla (ver formatDigitsLive/
  // clampSegment acima). O cursor é reposicionado contando DÍGITOS
  // (não caracteres) antes dele na digitação original, e recolocado
  // depois do mesmo número de dígitos no resultado formatado — as
  // barras nunca "prendem" o cursor.
  input.addEventListener('input', () => {
    const raw = input.value;
    const caret = input.selectionStart ?? raw.length;
    const digitsBeforeCaret = (raw.slice(0, caret).match(/\d/g) || []).length;

    let digits = (raw.match(/\d/g) || []).slice(0, 8).join('');
    let formatted = formatDigitsLive(digits);

    // Validação final contra o calendário real assim que os 8
    // dígitos já existem (ex.: 31/02 → 28 ou 29) — sem esperar blur.
    if (digits.length === 8) {
      const d = Number(formatted.slice(0, 2));
      const mo = Number(formatted.slice(3, 5));
      const y = Number(formatted.slice(6, 10));
      formatted = formatBR(clampToRealDate(d, mo, y));
    }

    if (input.value !== formatted) input.value = formatted;

    // Ano incompleto = dia e mês já ocupam os 4 primeiros dígitos
    // (digits.length > 4) mas o ano ainda não fechou os seus 4
    // (digits.length < 8). Só o AAAA entra nesse cálculo — DD/MM
    // continuam sem nenhum estado de erro.
    setYearError(digits.length > 4 && digits.length < 8);

    let pos = formatted.length, count = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) count++;
      if (count === digitsBeforeCaret) { pos = i + 1; break; }
    }
    if (digitsBeforeCaret === 0) pos = 0;
    while (formatted[pos] === '/') pos++; // pula a barra recém-inserida, em vez de parar antes dela
    input.setSelectionRange(pos, pos);
  });

  input.addEventListener('blur', formatTypedValue);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const digitCount = (input.value.match(/\d/g) || []).length;
      if (digitCount > 4 && digitCount < 8) {
        // Ano incompleto: não limpa, não conclui — só reforça
        // visualmente o erro e mantém o foco no campo, para o
        // usuário continuar digitando.
        e.preventDefault();
        setYearError(true);
        return;
      }
      // Vazio → apaga (comportamento já existente). Data completa
      // (8 dígitos) → já foi formatada/validada contra o calendário
      // real a cada tecla; Enter aqui só conclui a edição normalmente.
      formatTypedValue();
      if (digitCount === 0 || parseValue()) {
        input.blur();
      }
      return;
    }
    // Backspace logo depois de uma barra automática: remove a barra
    // E o dígito anterior a ela numa tacada só, senão o backspace
    // "prenderia" nas barras (o próximo ciclo de formatação
    // reinseriria a barra sozinho, e o dígito ficaria intocado).
    if (e.key === 'Backspace' && input.selectionStart === input.selectionEnd) {
      const pos = input.selectionStart;
      if (pos > 0 && input.value[pos - 1] === '/') {
        e.preventDefault();
        input.value = input.value.slice(0, pos - 2) + input.value.slice(pos);
        input.setSelectionRange(pos - 2, pos - 2);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  });
}

/* ══════════════════ MODAL: Novo/Editar estudo ══════════════════ */
/* v-premium — Nomes completos usados SÓ para exibição no novo
   cabeçalho/card de contexto/resumo do modal "Novo estudo" (ver
   TEMPLATE_HTML em agenda.js). Não substituem DAY_NAMES/MONTH_NAMES
   (usados em outros lugares, com abreviações), então ficam locais
   aqui, alinhados por índice (0=Segunda...6=Domingo). Nenhuma
   lógica de salvamento ou estrutura de dados é afetada por eles. */
const FULL_DAY_NAMES = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
const FULL_MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const SHORT_MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const PLAN_MODE_LABELS = { this: 'Semana atual', next: 'Próxima semana', other: 'Semana selecionada' };

function formatFullDateBR(date) {
  return `${date.getDate()} de ${FULL_MONTH_NAMES[date.getMonth()]} de ${date.getFullYear()}`;
}

/* "14 Jul → 20 Jul 2026" — usado só no card de Planejamento (chips de
   semana), formato mais compacto que formatFullDateBR(). Se a semana
   cruzar o ano (raríssimo, só na última semana de dezembro), mostra o
   ano das duas pontas para não ficar ambíguo. */
function formatWeekRangeShort(monday) {
  const end = new Date(monday);
  end.setDate(end.getDate() + 6);
  const p1 = `${String(monday.getDate()).padStart(2, '0')} ${SHORT_MONTH_NAMES[monday.getMonth()]}`;
  const p2 = `${String(end.getDate()).padStart(2, '0')} ${SHORT_MONTH_NAMES[end.getMonth()]}`;
  if (monday.getFullYear() !== end.getFullYear()) return `${p1} ${monday.getFullYear()} → ${p2} ${end.getFullYear()}`;
  return `${p1} → ${p2} ${end.getFullYear()}`;
}

/* dayIdx (0=Segunda...6=Domingo) → Date real dentro da semana
   ESCOLHIDA NO PLANEJADOR (state.modal.planWeekStart) — não mais a
   semana visível no grid principal (state.currentWeekStart). É essa
   escolha, feita no card "Planejamento", que agora decide em qual
   semana a sessão é de fato salva (ver saveSession()). */
function dateForPlanDayIdx(dayIdx) {
  const d = new Date(state.modal.planWeekStart);
  d.setDate(d.getDate() + dayIdx);
  return d;
}

/* Classifica uma segunda-feira como "esta semana" / "próxima semana"
   / "outra" em relação à semana real atual (data do dispositivo) —
   não em relação à semana visível no grid. Usado tanto para decidir
   o modo inicial do planejador (ao abrir o modal) quanto para rotular
   o card de semana. */
function classifyWeekMode(monday) {
  const thisMonday = getMondayOf(new Date());
  const nextMonday = new Date(thisMonday);
  nextMonday.setDate(nextMonday.getDate() + 7);
  const key = toISO(monday);
  if (key === toISO(thisMonday)) return 'this';
  if (key === toISO(nextMonday)) return 'next';
  return 'other';
}

/* Card "Hoje/Agora" do topo do modal — puramente informativo,
   calculado a partir da data/hora reais do dispositivo no momento
   em que o modal é aberto. */
function renderNowContextCard() {
  const now = new Date();
  const dow = now.getDay();
  const idx = dow === 0 ? 6 : dow - 1;
  const elWeekday = document.getElementById('agenda-context-weekday');
  const elDate = document.getElementById('agenda-context-date');
  const elTime = document.getElementById('agenda-context-time');
  const elMonthYear = document.getElementById('agenda-context-monthyear');
  if (!elWeekday) return;
  elWeekday.textContent = FULL_DAY_NAMES[idx];
  elDate.textContent = formatFullDateBR(now);
  elTime.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  elMonthYear.textContent = `${FULL_MONTH_NAMES[now.getMonth()]} de ${now.getFullYear()}`;
}

/* ══════════════════ CARD "PLANEJAMENTO" ══════════════════ */
/* Gera os 7 chips de dia (SEG 14, TER 15...) da semana em
   state.modal.planWeekStart, destacando o dia real de hoje
   (is-today), o dia escolhido (is-selected) e esmaecendo os dias
   fora da rotina ativa (is-inactive) — mesmo dado de
   state.routine.activeDays já usado no grid principal, só exibido
   aqui como dica visual (não bloqueia o clique: o usuário pode
   perfeitamente planejar um estudo num dia fora da rotina). */
function renderPlanDayChips() {
  const container = document.getElementById('agenda-plan-day-chips');
  if (!container || !state.modal.planWeekStart) return;
  const monday = state.modal.planWeekStart;
  const todayISO = toISO(new Date());
  const activeDays = new Set(state.routine.activeDays || []);
  container.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'agenda-plan-day-chip'
      + (toISO(d) === todayISO ? ' is-today' : '')
      + (i === state.modal.planDayIdx ? ' is-selected' : '')
      + (!activeDays.has(i) ? ' is-inactive' : '');
    chip.dataset.dayIdx = String(i);
    chip.innerHTML = `<span class="dow">${DAY_SHORT[i]}</span><span class="num">${d.getDate()}</span>`;
    chip.addEventListener('click', () => selectPlanDay(i));
    container.appendChild(chip);
  }
}

function selectPlanDay(dayIdx) {
  state.modal.planDayIdx = dayIdx;
  renderPlanDayChips();
  updateSessionSummary();
}

/* Repinta o painel de semana (label + intervalo + "Hoje é" + chips)
   a partir do estado atual — não muda planWeekStart/planDayIdx, só
   exibe. As setas de navegação só ficam visíveis no modo "other"
   (nos modos "this"/"next" a semana é sempre a mesma, determinística,
   então navegar não faz sentido ali). */
function renderPlanWeekPanel() {
  const monday = state.modal.planWeekStart;
  if (!monday) return;
  const mode = state.modal.planMode;
  document.getElementById('agenda-plan-week-label').textContent = PLAN_MODE_LABELS[mode] || 'Semana selecionada';
  document.getElementById('agenda-plan-week-range').textContent = formatWeekRangeShort(monday);

  const showNav = mode === 'other';
  document.getElementById('agenda-plan-week-prev').style.visibility = showNav ? 'visible' : 'hidden';
  document.getElementById('agenda-plan-week-next').style.visibility = showNav ? 'visible' : 'hidden';

  const todayLine = document.getElementById('agenda-plan-today-line');
  if (mode === 'this') {
    const now = new Date();
    const idx = now.getDay() === 0 ? 6 : now.getDay() - 1;
    todayLine.textContent = `Hoje é: ${FULL_DAY_NAMES[idx]}, ${formatFullDateBR(now)}`;
    todayLine.style.display = '';
  } else {
    todayLine.style.display = 'none';
  }

  renderPlanDayChips();
}

/* Repinta a casca inteira do card (botões de modo + alterna entre o
   painel de semana e o de data específica) a partir do estado atual
   — chamada ao abrir o modal (sem mexer no estado, já calculado em
   openSessionModal) e depois de qualquer troca de modo. */
function renderPlanCard() {
  const mode = state.modal.planMode;
  document.querySelectorAll('#agenda-plan-modes .agenda-plan-mode-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  const weekPanel = document.getElementById('agenda-plan-week-panel');
  const datePanel = document.getElementById('agenda-plan-date-panel');
  if (!weekPanel || !datePanel) return;

  if (mode === 'date') {
    weekPanel.style.display = 'none';
    datePanel.style.display = '';
    if (state.modal.planWeekStart && (state.modal.planDayIdx ?? null) !== null) {
      const d = dateForPlanDayIdx(state.modal.planDayIdx);
      document.getElementById('agenda-plan-date-input').value =
        `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    }
  } else {
    weekPanel.style.display = '';
    datePanel.style.display = 'none';
    renderPlanWeekPanel();
  }
}

/* Clique num dos 4 botões de modo — só aqui o modo/semana são
   REALMENTE decididos (renderPlanCard() acima só exibe o que já foi
   decidido). "this"/"next" sempre apontam para a semana real atual/
   seguinte (determinístico); "other" preserva a última semana
   navegada (ou parte da semana atual, se ainda não havia nenhuma). */
function setPlanMode(mode) {
  state.modal.planMode = mode;
  const thisMonday = getMondayOf(new Date());
  if (mode === 'this') {
    state.modal.planWeekStart = thisMonday;
  } else if (mode === 'next') {
    const n = new Date(thisMonday);
    n.setDate(n.getDate() + 7);
    state.modal.planWeekStart = n;
  } else if (mode === 'other' && !state.modal.planWeekStart) {
    state.modal.planWeekStart = thisMonday;
  }
  renderPlanCard();
  updateSessionSummary();
}

/* Setas ← / → do modo "other" — troca a semana navegada em blocos de
   7 dias, sem alterar o dia (planDayIdx) já escolhido. */
function changePlanWeek(deltaWeeks) {
  if (state.modal.planMode !== 'other' || !state.modal.planWeekStart) return;
  const d = new Date(state.modal.planWeekStart);
  d.setDate(d.getDate() + deltaWeeks * 7);
  state.modal.planWeekStart = d;
  renderPlanWeekPanel();
  updateSessionSummary();
}

/* Campo "Escolha uma data" (modo "date") — initTimeInput já cuida da
   máscara/validação de digitação (ver initDateInput mais abaixo);
   aqui só lemos o valor já formatado "DD/MM/AAAA" e recalculamos a
   semana + o dia correspondentes, exatamente como pedido ("semana
   correspondente, dia da semana, mês e ano" — tudo deriva da mesma
   data escolhida, sem duplicar o dado em outro lugar). */
function parsePlanDateInput() {
  const raw = document.getElementById('agenda-plan-date-input').value.trim();
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(raw);
  if (!m) return;
  const day = Number(m[1]), month = Number(m[2]) - 1, year = Number(m[3]);
  const date = new Date(year, month, day);
  if (date.getMonth() !== month) return; // dia inválido para o mês; initDateInput já corrige a digitação
  state.modal.planWeekStart = getMondayOf(date);
  const dow = date.getDay();
  state.modal.planDayIdx = dow === 0 ? 6 : dow - 1;
  updateSessionSummary();
}

/* Painel "Resumo da sessão" — espelha, em tempo real, os mesmos
   campos que já existem no formulário (semana/dia escolhidos no
   Planejamento, horários, conteúdo) e deriva 2 informações extras só
   de leitura:
   • Categoria: "Agendado" (tem horário) vs "Planejado" (sem
     horário) — já é exatamente a mesma distinção usada por
     isPlanned()/sortPlanned() no resto do módulo, só exibida aqui.
   • Status: "Concluído"/"Pendente", lido do próprio session.status
     quando em edição (nunca escrito por esta função). */
function updateSessionSummary() {
  const summarySubject = document.getElementById('agenda-summary-subject');
  const dayIdx = state.modal.planDayIdx;
  if (!summarySubject || dayIdx === null || dayIdx === undefined || !state.modal.planWeekStart) return;

  const timeStart = document.getElementById('agenda-input-time').value.trim();
  const timeEnd = document.getElementById('agenda-input-time-end').value.trim();
  const subject = document.getElementById('agenda-input-subject').value.trim();

  summarySubject.textContent = subject || '—';
  document.getElementById('agenda-summary-date').textContent = `${FULL_DAY_NAMES[dayIdx]}, ${formatFullDateBR(dateForPlanDayIdx(dayIdx))}`;

  const hasTime = timeStart && timeEnd;
  document.getElementById('agenda-summary-time').textContent = hasTime ? `${timeStart} – ${timeEnd}` : 'Sem horário definido';
  document.getElementById('agenda-summary-category').textContent = hasTime ? 'Agendado' : 'Planejado';

  let durationLabel = '—';
  if (hasTime) {
    const duration = timeToMinutes(timeEnd) - timeToMinutes(timeStart);
    if (duration > 0) durationLabel = formatDurationLabel(duration);
  }
  document.getElementById('agenda-summary-duration').textContent = durationLabel;

  let statusLabel = 'Pendente';
  if (state.modal.mode === 'edit' && state.modal.context) {
    const { weekKey, dayIdx: origDayIdx, sessionId } = state.modal.context;
    const session = getSession(weekKey, origDayIdx, sessionId);
    if (session && session.status === 'done') statusLabel = 'Concluído';
  }
  document.getElementById('agenda-summary-status').textContent = statusLabel;
}

function refreshSessionModalInfo() {
  renderNowContextCard();
  renderPlanCard();
  updateSessionSummary();
}

export function openSessionModal({ weekKey, dayIdx, sessionId }) {
  const overlay = document.getElementById('agenda-modal-session');
  const isEdit = sessionId !== null && sessionId !== undefined;

  state.modal.context = { weekKey, dayIdx, sessionId };
  state.modal.mode = isEdit ? 'edit' : 'new';

  document.getElementById('agenda-modal-title').textContent = isEdit ? 'Editar estudo' : 'Novo estudo';
  hideDurationHint();

  /* Planejamento — inicializa a partir de ONDE a sessão já está
     (edição) ou de onde o usuário clicou (nova sessão), mas
     classificado contra a semana REAL de hoje (não a semana visível
     no grid): se cair exatamente na semana atual ou na próxima, o
     planejador já abre no modo correspondente; caso contrário, abre
     em "Escolher outra semana" já navegado até lá. Isso desacopla de
     vez o modal da semana que porventura esteja sendo visualizada no
     grid principal (state.currentWeekStart), que pode ser qualquer
     semana passada/futura. */
  const baseMonday = new Date(state.currentWeekStart);
  state.modal.planWeekStart = baseMonday;
  state.modal.planDayIdx = dayIdx ?? 0;
  state.modal.planMode = classifyWeekMode(baseMonday);

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

  refreshSessionModalInfo();

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => document.getElementById('agenda-input-time').focus(), 100);
}

function closeSessionModal() {
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
  updateSessionSummary();
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
    updateSessionSummary();
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
  if (!state.modal.planWeekStart || state.modal.planDayIdx === null || state.modal.planDayIdx === undefined) {
    return showToast('Escolha uma semana ou uma data válida no Planejamento.');
  }
  const weekKey = toISO(state.modal.planWeekStart);
  const dayIdx = Number(state.modal.planDayIdx);
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

  const { sessionId } = state.modal.context;
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
  const prevWeekKey = state.modal.context.weekKey;
  const prevDayIdx = state.modal.context.dayIdx;
  const becamePlanned = !timeStart && !timeEnd;
  /* v-planejamento — antes só existia troca de DIA dentro da MESMA
     semana (o modal nunca deixava mudar a semana). Agora o usuário
     pode replanejar a sessão para qualquer semana/data no card
     "Planejamento", então a detecção de "mudou de lugar" precisa
     comparar semana E dia — não só o dia como antes. */
  const moved = isEdit && (prevWeekKey !== weekKey || prevDayIdx !== dayIdx);

  if (moved) {
    const fromArr = (state.weeks[prevWeekKey] && state.weeks[prevWeekKey][prevDayIdx]) || [];
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

  /* v-planejamento — card "Planejamento": 4 modos de escolha de
     semana/data, setas de navegação (só ativas no modo "other") e o
     campo de data específica. Nenhum deles interfere no listener de
     salvamento — só atualizam state.modal.planWeekStart/planDayIdx e
     repintam o próprio card + o Resumo da sessão. */
  document.getElementById('agenda-plan-modes').addEventListener('click', (e) => {
    const btn = e.target.closest('.agenda-plan-mode-opt');
    if (btn) setPlanMode(btn.dataset.mode);
  });
  document.getElementById('agenda-plan-week-prev').addEventListener('click', () => changePlanWeek(-1));
  document.getElementById('agenda-plan-week-next').addEventListener('click', () => changePlanWeek(1));
  document.getElementById('agenda-plan-date-input').addEventListener('input', parsePlanDateInput);
  document.getElementById('agenda-plan-date-input').addEventListener('change', parsePlanDateInput);

  document.getElementById('agenda-input-subject').addEventListener('input', updateSessionSummary);

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

  // Campos de hora/data — formatação e validação de digitação,
  // registrados ANTES do listener de "Enter salva o formulário" abaixo,
  // para que Enter nesses campos apenas formate o valor em vez de
  // disparar saveSession() imediatamente.
  initTimeInput('agenda-input-time');
  initTimeInput('agenda-input-time-end');
  initTimeInput('agenda-routine-start');
  initTimeInput('agenda-routine-end');
  initDateInput('agenda-goal-deadline');
  initDateInput('agenda-plan-date-input');

  ['agenda-input-time', 'agenda-input-time-end', 'agenda-input-subject'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); saveSession(); } });
  });

  window.addEventListener('resize', () => { if (document.getElementById('agenda-page-week')?.classList.contains('active')) renderCalendar(); });
}