/* dashboard\js\agenda\agenda_render.js
   proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   Renderização do módulo Agenda: grid semanal, linha de
   "Planejados" e cartões de sessão. Portado de
   pessoal/calendar/calendar.js (renderCalendar/createSessionCard/
   layoutSessions), trocando apenas as classes CSS (prefixo
   `agenda-*`, ver agenda.css) e os IDs (prefixo `agenda-*`,
   ver TEMPLATE_HTML em agenda.js). Nenhuma lógica de cálculo
   de horário/layout foi alterada.
   ============================================= */

import {
  state, DAY_NAMES, TIMELINE_START_HOUR, TIMELINE_END_HOUR, TIMELINE_HOURS,
  getWeekKey, getWeekData, isCurrentWeek, formatWeekLabel, formatRange,
  toISO, sortPlanned, sortSessions, isPlanned, timeToMinutes, timeToOffset,
  getHourHeight, escHtml,
} from './agenda.js';

import { initPlannedChipDrag, initPlannedDropZone, initTimelineDropZone, initCardDrag, initCardResize, initScheduledToPlannedDrag } from './agenda_interactions.js';
import { openSessionModal } from './agenda_interactions.js';
import { toggleSessionStatus } from './agenda_interactions.js';

export function renderCalendar() {
  const grid = document.getElementById('agenda-calendar-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const monday = state.currentWeekStart;
  const weekKey = getWeekKey();
  const weekData = getWeekData(monday);
  const todayStr = toISO(new Date());

  const isThisWeek = isCurrentWeek(monday);
  const titleEl = document.getElementById('agenda-week-title');
  const rangeEl = document.getElementById('agenda-week-range');
  if (titleEl) titleEl.textContent = isThisWeek ? 'Semana atual' : formatWeekLabel(monday);
  if (rangeEl) rangeEl.textContent = formatRange(monday);

  const todayMonday = new Date(monday);
  const btnPrev = document.getElementById('agenda-btn-prev');
  if (btnPrev) {
    const weeksBack = Math.round((_getTodayMonday() - monday) / (7 * 86400000));
    btnPrev.disabled = weeksBack >= 1;
  }

  grid.style.setProperty('--ag-hours-count', TIMELINE_HOURS);

  const activeDays = new Set(state.routine.activeDays);

  const scrollWrap = document.createElement('div');
  scrollWrap.className = 'agenda-grid-scroll';
  const colDefs = ['var(--ag-ruler-w)', ...[0,1,2,3,4,5,6].map(i => activeDays.has(i) ? '1fr' : '0.5fr')].join(' ');
  scrollWrap.style.gridTemplateColumns = colDefs;

  const corner = document.createElement('div');
  corner.className = 'agenda-corner';
  scrollWrap.appendChild(corner);

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(dayDate.getDate() + i);
    const dateStr = toISO(dayDate);
    const isToday = dateStr === todayStr;
    const isInactive = !activeDays.has(i);

    const cell = document.createElement('div');
    cell.className = 'agenda-day-header' + (isToday ? ' is-today' : '') + (isInactive ? ' is-inactive' : '');
    cell.innerHTML = `<div class="agenda-day-name">${DAY_NAMES[i]}</div><div class="agenda-day-date">${dayDate.getDate()}</div>`;
    scrollWrap.appendChild(cell);
  }

  const plannedByDay = {};
  let hasAnyPlanned = false;
  for (let i = 0; i < 7; i++) {
    plannedByDay[i] = sortPlanned((weekData[i] || []).filter(isPlanned));
    if (plannedByDay[i].length) hasAnyPlanned = true;
  }

  const plannedCorner = document.createElement('div');
  plannedCorner.className = 'agenda-planned-corner' + (hasAnyPlanned ? '' : ' is-collapsed');
  scrollWrap.appendChild(plannedCorner);

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(dayDate.getDate() + i);
    const dateStr = toISO(dayDate);
    const isToday = dateStr === todayStr;
    const isInactive = !activeDays.has(i);
    const plannedItems = plannedByDay[i];

    const cell = document.createElement('div');
    cell.className = 'agenda-planned-cell' + (isToday ? ' is-today' : '') + (isInactive ? ' is-inactive' : '') + (hasAnyPlanned ? '' : ' is-collapsed');
    cell.dataset.dayIdx = i;

    const section = document.createElement('div');
    section.className = 'agenda-planned-section';
    const label = document.createElement('div');
    label.className = 'agenda-planned-label';
    label.textContent = 'Planejados';
    section.appendChild(label);

    const list = document.createElement('div');
    list.className = 'agenda-planned-chips';
    list.dataset.dayIdx = i;

    if (plannedItems.length) {
      plannedItems.forEach(session => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.draggable = true;
        chip.className = 'agenda-planned-chip' + (session.status === 'done' ? ' is-done' : '');
        chip.dataset.color = session.color || 'blue';
        chip.dataset.sessionId = session.id;
        chip.dataset.dayIdx = i;
        chip.title = session.subject + (session.note ? ` — ${session.note}` : '') + ' · arraste para um horário ou para reordenar';
        chip.innerHTML = `<span>📌</span><span>${escHtml(session.subject)}</span>`;
        chip.addEventListener('click', (e) => {
          if (chip.dataset.suppressClick === '1') { chip.dataset.suppressClick = '0'; return; }
          e.stopPropagation();
          openSessionModal({ weekKey, dayIdx: i, sessionId: session.id });
        });
        initPlannedChipDrag(chip, weekKey, i, session.id);
        list.appendChild(chip);
      });
    } else {
      list.classList.add('is-empty');
    }

    section.appendChild(list);
    cell.appendChild(section);
    initPlannedDropZone(cell, weekKey, i);
    scrollWrap.appendChild(cell);
  }

  const ruler = document.createElement('div');
  ruler.className = 'agenda-ruler';
  const rulerInner = document.createElement('div');
  rulerInner.className = 'agenda-timeline-inner';
  for (let h = TIMELINE_START_HOUR; h <= TIMELINE_END_HOUR; h++) {
    const offset = (h - TIMELINE_START_HOUR) * getHourHeight() + getHourHeight() / 2;
    const label = document.createElement('div');
    label.className = 'agenda-ruler-label';
    label.style.top = `${offset}px`;
    label.textContent = `${String(h).padStart(2, '0')}:00`;
    rulerInner.appendChild(label);
  }
  ruler.appendChild(rulerInner);
  scrollWrap.appendChild(ruler);

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(dayDate.getDate() + i);
    const dateStr = toISO(dayDate);
    const isToday = dateStr === todayStr;
    const isInactive = !activeDays.has(i);
    const sessions = sortSessions((weekData[i] || []).filter(s => !isPlanned(s))).filter(s => {
      const start = timeToMinutes(s.timeStart || s.time || '00:00');
      return start >= TIMELINE_START_HOUR * 60 && start < TIMELINE_END_HOUR * 60;
    });

    const timeline = document.createElement('div');
    timeline.className = 'agenda-timeline' + (isToday ? ' is-today' : '') + (isInactive ? ' is-inactive' : '');
    timeline.dataset.dayIdx = i;

    const inner = document.createElement('div');
    inner.className = 'agenda-timeline-inner';

    for (let h = TIMELINE_START_HOUR; h <= TIMELINE_END_HOUR; h++) {
      const offset = (h - TIMELINE_START_HOUR) * getHourHeight() + getHourHeight() / 2;
      const line = document.createElement('div');
      line.className = 'agenda-hour-line major';
      line.style.top = `${offset}px`;
      inner.appendChild(line);
      if (h < TIMELINE_END_HOUR) {
        const half = document.createElement('div');
        half.className = 'agenda-hour-line';
        half.style.top = `${offset + getHourHeight() / 2}px`;
        inner.appendChild(half);
      }
    }

    const positioned = layoutSessions(sessions);
    positioned.forEach(({ session, col, cols }) => {
      inner.appendChild(createSessionCard(session, col, cols, weekKey, i));
    });

    timeline.appendChild(inner);
    initTimelineDropZone(timeline, inner, weekKey, i);
    scrollWrap.appendChild(timeline);
  }

  grid.appendChild(scrollWrap);
}

function _getTodayMonday() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function layoutSessions(sessions) {
  const items = sessions.map(s => ({
    session: s,
    start: timeToMinutes(s.timeStart || s.time || '00:00'),
    end: timeToMinutes(s.timeEnd) || (timeToMinutes(s.timeStart || s.time || '00:00') + 60),
  }));
  items.sort((a, b) => a.start - b.start);

  const result = [];
  let cluster = [];
  let clusterEnd = -Infinity;

  function flushCluster() {
    if (!cluster.length) return;
    const cols = [];
    cluster.forEach(item => {
      let placed = false;
      for (let c = 0; c < cols.length; c++) {
        if (cols[c] <= item.start) { cols[c] = item.end; item._col = c; placed = true; break; }
      }
      if (!placed) { item._col = cols.length; cols.push(item.end); }
    });
    const totalCols = cols.length;
    cluster.forEach(item => result.push({ session: item.session, col: item._col, cols: totalCols }));
    cluster = [];
  }

  items.forEach(item => {
    if (item.start >= clusterEnd) { flushCluster(); clusterEnd = item.end; }
    else { clusterEnd = Math.max(clusterEnd, item.end); }
    cluster.push(item);
  });
  flushCluster();

  return result;
}

function createSessionCard(session, col, cols, weekKey, dayIdx) {
  const color = session.color || 'blue';
  const card = document.createElement('div');
  card.className = 'agenda-session-card' + (session.status === 'done' ? ' is-done' : '');
  card.dataset.color = color;
  card.dataset.id = session.id;

  const start = session.timeStart || session.time || '';
  const end = session.timeEnd || '';
  const timeLabel = end ? `${start} – ${end}` : start;

  const hourH = getHourHeight();
  const top = timeToOffset(start);
  let durationMin = end ? (timeToMinutes(end) - timeToMinutes(start)) : 60;
  if (durationMin <= 0) durationMin = 60;
  const height = Math.max((durationMin / 60) * hourH, 26);

  card.style.top = `${top}px`;
  card.style.height = `${height}px`;

  if (cols > 1) {
    const gap = 3;
    card.style.left = `calc(4px + (100% - 8px) * ${col} / ${cols} + ${col > 0 ? gap / 2 : 0}px)`;
    card.style.width = `calc((100% - 8px) / ${cols} - ${cols > 1 ? gap / 2 : 0}px)`;
    card.style.right = 'auto';
  }

  const compact = height < 34;
  const showNote = height >= 66 && session.note;
  const showTime = height >= 26;

  if (compact) card.classList.add('is-compact');

  const subjectLine = `<div class="agenda-card-subject">${escHtml(session.subject)}</div>`;
  const timeLine = showTime ? `<div class="agenda-card-time">${timeLabel}</div>` : '';
  const noteLine = showNote ? `<div class="agenda-card-note">${escHtml(session.note)}</div>` : '';

  card.innerHTML = `
    <div class="agenda-card-body">${compact ? timeLine : subjectLine + timeLine + noteLine}</div>
    <button type="button" class="agenda-card-check" title="${session.status === 'done' ? 'Marcar como pendente' : 'Marcar como concluído'}">${session.status === 'done' ? '✓' : ''}</button>
    <div class="agenda-card-move-handle" draggable="true" title="Arraste até 'Planejados' para remover o horário">⠿</div>
    <div class="agenda-card-resize-handle"></div>
  `;

  card.addEventListener('click', (e) => {
    if (e.target.closest('.agenda-card-move-handle')) return;
    if (card.dataset.suppressClick === '1') { card.dataset.suppressClick = '0'; return; }
    openSessionModal({ weekKey, dayIdx, sessionId: session.id });
  });

  card.querySelector('.agenda-card-check').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSessionStatus(weekKey, dayIdx, session.id);
  });

  initCardDrag(card, weekKey, dayIdx, session.id);
  initCardResize(card.querySelector('.agenda-card-resize-handle'), card, weekKey, dayIdx, session.id);
  initScheduledToPlannedDrag(card, weekKey, dayIdx, session.id);

  return card;
}   