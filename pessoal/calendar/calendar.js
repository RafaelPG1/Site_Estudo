/* ===========================
   NEXUS STUDY — calendar.js
   =========================== */

'use strict';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const DAY_NAMES    = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const DAY_SHORT    = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const MONTH_NAMES  = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const SUBJECTS = [
  'Matemática', 'Física', 'Química', 'Biologia', 'História',
  'Geografia', 'Português', 'Inglês', 'Programação', 'Revisão',
  'Redação', 'Filosofia', 'Sociologia', 'Literatura', 'Arte',
  'Intervalo', 'Exercícios', 'Leitura', 'Projetos'
];

const STORAGE_KEYS = {
  weeks:   'nexus_weeks',
  routine: 'nexus_routine',
};

const MIN_WEEKS_BACK = 1; // allow current week + 1 week in the past
const SNAP_MINUTES = 15;  // grid snap for drag & resize
const MIN_SESSION_MINUTES = 30; // duração mínima de qualquer sessão agendada
// Rotina padrão usada caso o usuário nunca tenha configurado uma.
const DEFAULT_ROUTINE = {
  activeDays: [0, 1, 2, 3, 4], // Segunda a Sexta
  startHour: '06:00',
  endHour:   '22:00',
  minSessionMinutes: 60,
};

// ─── STATE ────────────────────────────────────────────────────────────────────

let state = {
  currentWeekStart: null,   // Monday of displayed week (Date)
  weeks: {},                // { 'YYYY-MM-DD': { 0:[], 1:[], ... } } keyed by monday ISO
  routine: null,            // { activeDays:[...], startHour, endHour, minSessionMinutes }
  modal: {
    context: null,          // { weekKey, dayIdx, sessionId } | null
    mode: 'new',            // 'new' | 'edit'
    color: 'blue',
  },
  drag: null,               // active drag/resize operation, or null
};

// Derived from state.routine — recalculated whenever the routine changes.
let TIMELINE_START_HOUR = 6;
let TIMELINE_END_HOUR   = 22;
let TIMELINE_HOURS      = TIMELINE_END_HOUR - TIMELINE_START_HOUR;

function recalcTimelineBounds() {
  const [sh] = state.routine.startHour.split(':').map(Number);
  const [eh] = state.routine.endHour.split(':').map(Number);
  TIMELINE_START_HOUR = Number.isFinite(sh) ? sh : 6;
  TIMELINE_END_HOUR   = Number.isFinite(eh) ? eh : 22;
  if (TIMELINE_END_HOUR <= TIMELINE_START_HOUR) TIMELINE_END_HOUR = TIMELINE_START_HOUR + 1;
  TIMELINE_HOURS = TIMELINE_END_HOUR - TIMELINE_START_HOUR;
}

// ─── STORAGE ─────────────────────────────────────────────────────────────────

function loadStorage() {
  try {
    const weeks = localStorage.getItem(STORAGE_KEYS.weeks);
    state.weeks = weeks ? JSON.parse(weeks) : {};
  } catch (e) {
    state.weeks = {};
  }

  try {
    const routine = localStorage.getItem(STORAGE_KEYS.routine);
    state.routine = routine ? { ...DEFAULT_ROUTINE, ...JSON.parse(routine) } : { ...DEFAULT_ROUTINE };
  } catch (e) {
    state.routine = { ...DEFAULT_ROUTINE };
  }

  recalcTimelineBounds();
}

function saveStorage() {
  localStorage.setItem(STORAGE_KEYS.weeks, JSON.stringify(state.weeks));
}

function saveRoutine() {
  localStorage.setItem(STORAGE_KEYS.routine, JSON.stringify(state.routine));
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function buildEmptyWeek() {
  return { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[] };
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function getMondayOf(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0,0,0,0);
  return d;
}

function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

function formatRange(monday) {
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const mDay = monday.getDate();
  const mMon = MONTH_NAMES[monday.getMonth()];
  const sDay = sunday.getDate();
  const sMon = MONTH_NAMES[sunday.getMonth()];
  const sYear = sunday.getFullYear();
  return `${mDay} de ${mMon} – ${sDay} de ${sMon} de ${sYear}`;
}

function isCurrentWeek(monday) {
  const todayMonday = toISO(getMondayOf(new Date()));
  return toISO(monday) === todayMonday;
}

// Estudo "agendado" possui hora inicial e final. Estudo "planejado" não tem horário.
function isPlanned(session) {
  return !(session.timeStart || session.time);
}

function sortSessions(sessions) {
  return [...sessions].sort((a, b) => (a.timeStart || a.time || '').localeCompare(b.timeStart || b.time || ''));
}

function timeToMinutes(t) {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

function minutesToTime(mins) {
  mins = Math.max(0, Math.round(mins));
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

function snapMinutes(mins) {
  return Math.round(mins / SNAP_MINUTES) * SNAP_MINUTES;
}

// Convert a time string to a vertical pixel offset within the timeline.
function timeToOffset(t) {
  const minutes = timeToMinutes(t) - TIMELINE_START_HOUR * 60;
  return (minutes / 60) * getHourHeight() + getTopPadding();
}

function offsetToMinutes(offsetPx) {
  const raw = ((offsetPx - getTopPadding()) / getHourHeight()) * 60 + TIMELINE_START_HOUR * 60;
  return raw;
}

function getHourHeight() {
  const val = getComputedStyle(document.documentElement).getPropertyValue('--hour-h').trim();
  return parseFloat(val) || 56;
}

function getTopPadding() {
  return getHourHeight() / 2;
}

// ─── WEEK DATA ────────────────────────────────────────────────────────────────

function getWeekData(monday) {
  const key = toISO(monday);
  if (!state.weeks[key]) {
    state.weeks[key] = buildEmptyWeek();
    saveStorage();
  }
  return state.weeks[key];
}

function getWeekKey() {
  return toISO(state.currentWeekStart);
}

// ─── CONFLITOS DE HORÁRIO ───────────────────────────────────────────────────

// Verifica se um intervalo [timeStart, timeEnd) conflita com algum outro
// estudo agendado no mesmo dia (ignorando estudos planejados, que não têm
// horário, e o próprio estudo sendo editado).
function findConflicts(weekKey, dayIdx, timeStart, timeEnd, excludeId) {
  const dayArr = (state.weeks[weekKey] && state.weeks[weekKey][dayIdx]) || [];
  const start = timeToMinutes(timeStart);
  const end = timeToMinutes(timeEnd);
  return dayArr.filter(s => {
    if (s.id === excludeId) return false;
    if (isPlanned(s)) return false;
    const sStart = timeToMinutes(s.timeStart || s.time);
    const sEnd = timeToMinutes(s.timeEnd) || sStart + 60;
    return start < sEnd && end > sStart;
  });
}

// ─── RENDER CALENDAR ─────────────────────────────────────────────────────────

function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';

  const monday  = state.currentWeekStart;
  const weekKey = getWeekKey();
  const weekData = getWeekData(monday);
  const todayStr = toISO(new Date());

  // Update header
  const isThisWeek = isCurrentWeek(monday);
  document.getElementById('week-title').textContent = isThisWeek ? 'Semana atual' : formatWeekLabel(monday);
  document.getElementById('week-range').textContent  = formatRange(monday);

  // Disable "previous week" navigation beyond the allowed limit
  const todayMonday = getMondayOf(new Date());
  const weeksBack = Math.round((todayMonday - monday) / (7 * 86400000));
  document.getElementById('btn-prev').disabled = weeksBack >= MIN_WEEKS_BACK;

  // Set CSS var for total hours in the timeline (derived from the routine)
  grid.style.setProperty('--hours-count', TIMELINE_HOURS);

  const activeDays = new Set(state.routine.activeDays);

  // ── Single grid container (header row + body rows, same columns) ──
  const scrollWrap = document.createElement('div');
  scrollWrap.className = 'grid-scroll';

  // Gera grid-template-columns dinâmico: dias inativos com 0.5fr (metade da largura)
  const colDefs = [
    `var(--ruler-w)`,
    ...[0,1,2,3,4,5,6].map(i => activeDays.has(i) ? '1fr' : '0.5fr')
  ].join(' ');
  scrollWrap.style.gridTemplateColumns = colDefs;

  // Row 1, col 1: corner (sticky, aligns with time ruler column)
  const corner = document.createElement('div');
  corner.className = 'grid-corner';
  scrollWrap.appendChild(corner);

  // Row 1, cols 2-8: day headers (sticky, same grid as everything else)
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(dayDate.getDate() + i);
    const dateStr = toISO(dayDate);
    const isToday = dateStr === todayStr;
    const isInactive = !activeDays.has(i);

    const cell = document.createElement('div');
    cell.className = 'day-header-cell' + (isToday ? ' is-today' : '') + (isInactive ? ' is-inactive' : '');
    cell.innerHTML = `
      <div class="day-name">${DAY_NAMES[i]}</div>
      <div class="day-date">${dayDate.getDate()}</div>
    `;

    scrollWrap.appendChild(cell);
  }

  // ── Linha "Planejados" (apenas se houver ao menos um estudo sem horário
  // em algum dia da semana). Fica entre o cabeçalho e a régua/timeline,
  // sem ocupar espaço dentro da grade de horários. ──
  const plannedByDay = {};
  let hasAnyPlanned = false;
  for (let i = 0; i < 7; i++) {
    plannedByDay[i] = (weekData[i] || []).filter(isPlanned);
    if (plannedByDay[i].length) hasAnyPlanned = true;
  }

  if (hasAnyPlanned) {
    const plannedCorner = document.createElement('div');
    plannedCorner.className = 'planned-row-corner';
    scrollWrap.appendChild(plannedCorner);

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(dayDate.getDate() + i);
      const dateStr = toISO(dayDate);
      const isToday = dateStr === todayStr;
      const isInactive = !activeDays.has(i);
      const plannedItems = plannedByDay[i];

      const cell = document.createElement('div');
      cell.className = 'planned-row-cell' + (isToday ? ' is-today' : '') + (isInactive ? ' is-inactive' : '');

      if (plannedItems.length) {
        const section = document.createElement('div');
        section.className = 'planned-section';

        const label = document.createElement('div');
        label.className = 'planned-section-label';
        label.textContent = 'Planejados';
        section.appendChild(label);

        const list = document.createElement('div');
        list.className = 'planned-chips';

        plannedItems.forEach(session => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'planned-chip' + (session.status === 'done' ? ' is-done' : '');
          chip.dataset.color = session.color || 'blue';
          chip.title = session.subject + (session.note ? ` — ${session.note}` : '');
          chip.innerHTML = `<span class="planned-chip-icon">📌</span><span class="planned-chip-label">${escHtml(session.subject)}</span>`;
          chip.addEventListener('click', (e) => {
            e.stopPropagation();
            openSessionModal({ weekKey, dayIdx: i, sessionId: session.id });
          });
          list.appendChild(chip);
        });

        section.appendChild(list);
        cell.appendChild(section);
      }

      scrollWrap.appendChild(cell);
    }
  }

  // Row 2, col 1: time ruler
  const ruler = document.createElement('div');
  ruler.className = 'time-ruler';
  const rulerInner = document.createElement('div');
  rulerInner.className = 'timeline-inner';
  for (let h = TIMELINE_START_HOUR; h <= TIMELINE_END_HOUR; h++) {
    const offset = (h - TIMELINE_START_HOUR) * getHourHeight() + getTopPadding();
    const label = document.createElement('div');
    label.className = 'time-ruler-label';
    label.style.top = `${offset}px`;
    label.textContent = `${String(h).padStart(2,'0')}:00`;
    rulerInner.appendChild(label);
  }
  ruler.appendChild(rulerInner);
  scrollWrap.appendChild(ruler);

  // Row 2, cols 2-8: day timelines — same grid, same columns as the headers above
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(dayDate.getDate() + i);
    const dateStr = toISO(dayDate);
    const isToday = dateStr === todayStr;
    const isInactive = !activeDays.has(i);
    // Apenas estudos AGENDADOS (com horário) aparecem na timeline; os
    // planejados ficam nos chips do cabeçalho (renderizados acima).
    const sessions = sortSessions((weekData[i] || []).filter(s => !isPlanned(s))).filter(s => {
      const start = timeToMinutes(s.timeStart || s.time || '00:00');
      return start >= TIMELINE_START_HOUR * 60 && start < TIMELINE_END_HOUR * 60;
    });

    const timeline = document.createElement('div');
    timeline.className = 'day-timeline' + (isToday ? ' is-today' : '') + (isInactive ? ' is-inactive' : '');
    timeline.dataset.dayIdx = i;

    const inner = document.createElement('div');
    inner.className = 'timeline-inner';

    // Hour lines — major (solid) nas horas cheias, minor (tracejado) nas meias horas
    for (let h = TIMELINE_START_HOUR; h <= TIMELINE_END_HOUR; h++) {
      const offset = (h - TIMELINE_START_HOUR) * getHourHeight() + getTopPadding();
      const line = document.createElement('div');
      line.className = 'hour-line major';
      line.style.top = `${offset}px`;
      inner.appendChild(line);

      if (h < TIMELINE_END_HOUR) {
        const halfLine = document.createElement('div');
        halfLine.className = 'hour-line';
        halfLine.style.top = `${offset + getHourHeight() / 2}px`;
        inner.appendChild(halfLine);
      }
    }

    // Session cards (with overlap-aware horizontal layout)
    const positioned = layoutSessions(sessions);
    positioned.forEach(({ session, col, cols }) => {
      const card = createSessionCard(session, col, cols, weekKey, i);
      inner.appendChild(card);
    });

    timeline.appendChild(inner);
    scrollWrap.appendChild(timeline);
  }

  grid.appendChild(scrollWrap);
}

// Detect overlapping sessions and assign column slots so they sit side-by-side
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
        if (cols[c] <= item.start) {
          cols[c] = item.end;
          item._col = c;
          placed = true;
          break;
        }
      }
      if (!placed) {
        item._col = cols.length;
        cols.push(item.end);
      }
    });
    const totalCols = cols.length;
    cluster.forEach(item => {
      result.push({ session: item.session, col: item._col, cols: totalCols });
    });
    cluster = [];
  }

  items.forEach(item => {
    if (item.start >= clusterEnd) {
      flushCluster();
      clusterEnd = item.end;
    } else {
      clusterEnd = Math.max(clusterEnd, item.end);
    }
    cluster.push(item);
  });
  flushCluster();

  return result;
}

function formatWeekLabel(monday) {
  const todayMonday = getMondayOf(new Date());
  const diff = Math.round((monday - todayMonday) / (7 * 86400000));
  if (diff === -1) return 'Semana passada';
  if (diff === 1)  return 'Próxima semana';
  if (diff < 0)    return `${Math.abs(diff)} semanas atrás`;
  return `${diff} semanas à frente`;
}

function createSessionCard(session, col, cols, weekKey, dayIdx) {
  const color = session.color || 'blue';
  const card  = document.createElement('div');
  card.className     = 'session-card' + (session.status === 'done' ? ' is-done' : '');
  card.dataset.color = color;
  card.dataset.id    = session.id;

  const start = session.timeStart || session.time || '';
  const end   = session.timeEnd || '';

  const timeLabel = end ? `${start} – ${end}` : start;

  const hourH = getHourHeight();
  const top = timeToOffset(start);
  let durationMin = end ? (timeToMinutes(end) - timeToMinutes(start)) : 60;
  if (durationMin <= 0) durationMin = 60;
  const height = Math.max((durationMin / 60) * hourH, 28);

  card.style.top    = `${top}px`;
  card.style.height = `${height}px`;

  if (cols > 1) {
    const gap = 3;
    card.style.left  = `calc(5px + (100% - 10px) * ${col} / ${cols} + ${col > 0 ? gap/2 : 0}px)`;
    card.style.width = `calc((100% - 10px) / ${cols} - ${cols > 1 ? gap/2 : 0}px)`;
    card.style.right = 'auto';
  }

  const compact  = height < 36;   // cards muito curtos (< ~27min)
  const showNote = height >= 68 && session.note;
  const showTime = height >= 28;
  const showIndicators = height >= 52 && (session.note);

  if (compact) card.classList.add('is-compact');

  // Disciplina sempre como elemento principal; horário abaixo
  const subjectLine = `<div class="card-subject">${escHtml(session.subject)}</div>`;
  const timeLine = showTime
    ? `<div class="card-time">${timeLabel}</div>`
    : '';
  const noteLine = showNote
    ? `<div class="card-note">${escHtml(session.note)}</div>`
    : '';

  // Indicadores discretos (nota e/ou status) — aparecem em cards médios+
  let indicatorsHtml = '';
  if (showIndicators) {
    const badges = [];
    if (session.note) badges.push(`<span class="card-badge">📝 Obs.</span>`);
    if (badges.length) indicatorsHtml = `<div class="card-indicators">${badges.join('')}</div>`;
  }

  card.innerHTML = `
    <div class="card-body">
      ${compact ? timeLine : subjectLine + timeLine + noteLine + indicatorsHtml}
    </div>
    <button type="button" class="card-check" title="${session.status === 'done' ? 'Marcar como pendente' : 'Marcar como concluído'}">${session.status === 'done' ? '✓' : ''}</button>
    <div class="card-resize-handle"></div>
  `;

  // Clique no card abre o modal de edição (a menos que tenha havido drag/resize)
  card.addEventListener('click', (e) => {
    if (card.dataset.suppressClick === '1') {
      card.dataset.suppressClick = '0';
      return;
    }
    openSessionModal({ weekKey, dayIdx, sessionId: session.id });
  });

  // Botão de concluir
  const checkBtn = card.querySelector('.card-check');
  checkBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSessionStatus(weekKey, dayIdx, session.id);
  });

  // Drag vertical (mover horário) e resize (alterar duração)
  initCardDrag(card, weekKey, dayIdx, session.id);
  initCardResize(card.querySelector('.card-resize-handle'), card, weekKey, dayIdx, session.id);

  return card;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ─── CONCLUIR ESTUDO ──────────────────────────────────────────────────────────

function toggleSessionStatus(weekKey, dayIdx, sessionId) {
  const dayArr = (state.weeks[weekKey] && state.weeks[weekKey][dayIdx]) || [];
  const session = dayArr.find(s => s.id === sessionId);
  if (!session) return;
  session.status = session.status === 'done' ? 'pending' : 'done';
  saveStorage();
  renderCalendar();
}

// Estrutura simples para futuras estatísticas (ex: "31 de 35 concluídos — 89%").
// Não é exibida em nenhuma UI ainda, apenas preparada para uso futuro.
function getWeekStats(weekKey) {
  const weekData = state.weeks[weekKey];
  if (!weekData) return { total: 0, done: 0, percent: 0 };
  let total = 0, done = 0;
  Object.values(weekData).forEach(dayArr => {
    dayArr.forEach(s => {
      total++;
      if (s.status === 'done') done++;
    });
  });
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
}

// ─── DRAG (mover horário verticalmente) ──────────────────────────────────────

function initCardDrag(card, weekKey, dayIdx, sessionId) {
  card.addEventListener('mousedown', (e) => {
    if (e.target.closest('.card-check') || e.target.closest('.card-resize-handle')) return;
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
      // snap to grid
      let newStartMin = offsetToMinutes(newTop);
      newStartMin = snapMinutes(newStartMin);
      newStartMin = Math.max(TIMELINE_START_HOUR * 60, Math.min(newStartMin, TIMELINE_END_HOUR * 60 - duration));
      newTop = timeToOffset(minutesToTime(newStartMin));
      card.style.top = `${newTop}px`;
      card._dragNewStartMin = newStartMin;
    }

    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      card.classList.remove('is-dragging');

      if (moved && card._dragNewStartMin !== undefined) {
        const newStartMin = card._dragNewStartMin;
        const newEndMin = newStartMin + duration;
        const newStart = minutesToTime(newStartMin);
        const newEnd = minutesToTime(newEndMin);

        const conflicts = findConflicts(weekKey, dayIdx, newStart, newEnd, sessionId);
        if (conflicts.length && !window.confirm(
          `Esse novo horário conflita com "${conflicts[0].subject}" (${conflicts[0].timeStart}–${conflicts[0].timeEnd}). Mover mesmo assim?`
        )) {
          renderCalendar();
          card.dataset.suppressClick = '1';
          return;
        }

        session.timeStart = newStart;
        session.timeEnd = newEnd;
        delete session.time;
        saveStorage();
        showToast('Horário atualizado.');
        renderCalendar();
        card.dataset.suppressClick = '1';
      }
      delete card._dragNewStartMin;
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

// ─── RESIZE (alterar duração arrastando a borda inferior) ───────────────────

function initCardResize(handle, card, weekKey, dayIdx, sessionId) {
  if (!handle) return;
  handle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    if (e.button !== 0) return;

    const session = getSession(weekKey, dayIdx, sessionId);
    if (!session || isPlanned(session)) return;

    const startY = e.clientY;
    const startHeight = parseFloat(card.style.height) || 28;
    const startMin = timeToMinutes(session.timeStart || session.time);
    const minDuration = MIN_SESSION_MINUTES; // mínimo de 30 min — não permite menos
    let moved = false;

    function onMove(ev) {
      const dy = ev.clientY - startY;
      if (Math.abs(dy) > 3) moved = true;
      const hourH = getHourHeight();
      let newHeight = startHeight + dy;
      let newDurationMin = (newHeight / hourH) * 60;
      newDurationMin = snapMinutes(newDurationMin);
      newDurationMin = Math.max(minDuration, newDurationMin);
      // não ultrapassar o fim da rotina
      newDurationMin = Math.min(newDurationMin, TIMELINE_END_HOUR * 60 - startMin);
      newHeight = Math.max((newDurationMin / 60) * hourH, 28);
      card.style.height = `${newHeight}px`;
      card._resizeNewDuration = newDurationMin;
    }

    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);

      if (moved && card._resizeNewDuration !== undefined) {
        const newEndMin = startMin + card._resizeNewDuration;
        const newEnd = minutesToTime(newEndMin);

        const conflicts = findConflicts(weekKey, dayIdx, session.timeStart || session.time, newEnd, sessionId);
        if (conflicts.length && !window.confirm(
          `Essa duração conflita com "${conflicts[0].subject}" (${conflicts[0].timeStart}–${conflicts[0].timeEnd}). Continuar mesmo assim?`
        )) {
          renderCalendar();
          card.dataset.suppressClick = '1';
          return;
        }

        session.timeEnd = newEnd;
        saveStorage();
        showToast('Duração atualizada.');
        renderCalendar();
        card.dataset.suppressClick = '1';
      }
      delete card._resizeNewDuration;
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

// ─── SESSION MODAL (Novo estudo / editar) ────────────────────────────────────

// Preenche o select "Dia da semana" do modal apenas com os dias ativos
// da rotina configurada. Se o estudo (em edição) estiver em um dia que
// não é mais ativo, esse dia é incluído também, para não impedir a edição.
function populateDayOptions(currentDayIdx) {
  const select = document.getElementById('input-day');
  const activeDays = state.routine.activeDays || [];
  let days = [...activeDays].sort((a, b) => a - b);

  if (currentDayIdx !== null && currentDayIdx !== undefined && !days.includes(currentDayIdx)) {
    days.push(currentDayIdx);
    days.sort((a, b) => a - b);
  }

  if (!days.length) days = [0, 1, 2, 3, 4, 5, 6];

  select.innerHTML = days.map(d => `<option value="${d}">${DAY_NAMES[d]}</option>`).join('');
}

function openSessionModal({ weekKey, dayIdx, sessionId }) {
  const overlay = document.getElementById('modal-session');
  const isEdit  = sessionId !== null && sessionId !== undefined;

  state.modal.context = { weekKey, dayIdx, sessionId };
  state.modal.mode    = isEdit ? 'edit' : 'new';

  document.getElementById('modal-title').textContent = isEdit ? 'Editar estudo' : 'Novo estudo';
  populateDayOptions(dayIdx);
  document.getElementById('input-day').value = String(dayIdx ?? 0);
  hideDurationHint();

  if (isEdit) {
    const session = getSession(weekKey, dayIdx, sessionId);
    document.getElementById('input-time').value     = session.timeStart || session.time || '';
    document.getElementById('input-time-end').value = session.timeEnd || '';
    document.getElementById('input-subject').value  = session.subject || '';
    document.getElementById('input-note').value     = session.note || '';
    setColorPicker('color-options', session.color || 'blue');
    state.modal.color = session.color || 'blue';
    document.getElementById('btn-delete').style.display = 'inline-flex';
  } else {
    document.getElementById('input-time').value     = '';
    document.getElementById('input-time-end').value = '';
    document.getElementById('input-subject').value  = '';
    document.getElementById('input-note').value     = '';
    setColorPicker('color-options', 'blue');
    state.modal.color = 'blue';
    document.getElementById('btn-delete').style.display = 'none';
  }

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => document.getElementById('input-time').focus(), 100);
}

function closeSessionModal() {
  const overlay = document.getElementById('modal-session');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.getElementById('subject-suggestions').classList.remove('visible');
  hideDurationHint();
}

// Sugestão automática de duração: quando há rotina configurada e o usuário
// preenche a hora inicial sem preencher a final, sugerimos (sem obrigar)
// uma hora final com base no tempo mínimo por sessão da rotina.
function hideDurationHint() {
  const hint = document.getElementById('duration-hint');
  hint.style.display = 'none';
  hint.classList.remove('is-active');
}

function updateDurationSuggestion() {
  const startVal = document.getElementById('input-time').value.trim();
  const endInput = document.getElementById('input-time-end');
  const hint = document.getElementById('duration-hint');
  const minSession = Number(state.routine.minSessionMinutes) || 60;

  if (!startVal) { hideDurationHint(); return; }

  if (!endInput.value.trim()) {
    const suggestedEnd = minutesToTime(timeToMinutes(startVal) + minSession);
    endInput.value = suggestedEnd;
    endInput.dataset.autofilled = '1';
    hint.textContent = `Duração sugerida com base na sua rotina: ${formatDurationLabel(minSession)} (até ${suggestedEnd}). Você pode ajustar livremente.`;
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

function saveSession() {
  const dayIdx     = Number(document.getElementById('input-day').value);
  const timeInput    = document.getElementById('input-time');
  const timeEndInput  = document.getElementById('input-time-end');
  const timeStart   = timeInput.value.trim();
  const timeEnd     = timeEndInput.value.trim();
  const subject     = document.getElementById('input-subject').value.trim();
  const note        = document.getElementById('input-note').value.trim();
  const color       = state.modal.color;

  // Detecta hora parcialmente preenchida (ex: "13:--", onde o usuário
  // digitou a hora mas deixou os minutos em branco). Nesses casos o
  // navegador reporta value vazio, mas validity.badInput fica true —
  // sem essa checagem o salvamento falhava silenciosamente.
  if (timeInput.validity && timeInput.validity.badInput) {
    return showToast('Hora inicial incompleta. Preencha os minutos (ex: 13:00) ou limpe o campo.');
  }
  if (timeEndInput.validity && timeEndInput.validity.badInput) {
    return showToast('Hora final incompleta. Preencha os minutos (ex: 14:00) ou limpe o campo.');
  }

  if (!subject) return showToast('Por favor, informe o conteúdo.');

  // Horário agora é opcional: ambos em branco = estudo planejado.
  // Apenas um preenchido = dado incompleto.
  if ((timeStart && !timeEnd) || (!timeStart && timeEnd)) {
    return showToast('Preencha as duas horas, ou deixe ambas em branco para um estudo planejado.');
  }
if (timeStart && timeEnd && timeEnd <= timeStart) {
  return showToast('A hora final deve ser depois da inicial.');
}

// ← ADICIONAR AQUI:
if (timeStart && timeEnd) {
  const duration = timeToMinutes(timeEnd) - timeToMinutes(timeStart);
  if (duration < MIN_SESSION_MINUTES) {
    return showToast(`A sessão deve ter no mínimo ${MIN_SESSION_MINUTES} minutos.`);
  }
}

  const { weekKey, sessionId } = state.modal.context;
  const isEdit = state.modal.mode === 'edit';

  // Conflito de horário: só se aplica a estudos agendados.
  if (timeStart && timeEnd) {
    const conflicts = findConflicts(weekKey, dayIdx, timeStart, timeEnd, isEdit ? sessionId : null);
    if (conflicts.length) {
      const c = conflicts[0];
      const proceed = window.confirm(
        `Conflito de horário com "${c.subject}" (${c.timeStart}–${c.timeEnd}). Deseja salvar mesmo assim?`
      );
      if (!proceed) return;
    }
  }

  if (!state.weeks[weekKey]) state.weeks[weekKey] = buildEmptyWeek();

  const prevDayIdx = state.modal.context.dayIdx;

  if (isEdit && prevDayIdx !== dayIdx) {
    const fromArr = state.weeks[weekKey][prevDayIdx] || [];
    const idx = fromArr.findIndex(s => s.id === sessionId);
    let existing = {};
    if (idx >= 0) { existing = fromArr[idx]; fromArr.splice(idx, 1); }
    const toArr = state.weeks[weekKey][dayIdx] || [];
    toArr.push({ id: sessionId, timeStart, timeEnd, subject, note, color, status: existing.status || 'pending' });
    state.weeks[weekKey][dayIdx] = toArr;
  } else if (isEdit) {
    const dayArr = state.weeks[weekKey][dayIdx] || [];
    const idx = dayArr.findIndex(s => s.id === sessionId);
    if (idx >= 0) {
      dayArr[idx] = { ...dayArr[idx], timeStart, timeEnd, subject, note, color };
      delete dayArr[idx].time;
    }
  } else {
    const dayArr = state.weeks[weekKey][dayIdx] || [];
    dayArr.push({ id: uid(), timeStart, timeEnd, subject, note, color, status: 'pending' });
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
  state.weeks[weekKey][dayIdx] = (state.weeks[weekKey][dayIdx] || [])
    .filter(s => s.id !== sessionId);
  saveStorage();
  renderCalendar();
  closeSessionModal();
  showToast('Estudo removido.');
}

function getSession(weekKey, dayIdx, sessionId) {
  return (state.weeks[weekKey]?.[dayIdx] || []).find(s => s.id === sessionId) || {};
}

// ─── COLOR PICKER ─────────────────────────────────────────────────────────────

function setColorPicker(containerId, color) {
  document.querySelectorAll(`#${containerId} .color-dot`).forEach(dot => {
    dot.classList.toggle('active', dot.dataset.color === color);
  });
}

function initColorPicker(containerId, stateKey) {
  document.getElementById(containerId).addEventListener('click', e => {
    const dot = e.target.closest('.color-dot');
    if (!dot) return;
    const color = dot.dataset.color;
    if (stateKey === 'modal') state.modal.color = color;
    setColorPicker(containerId, color);
  });
}

// ─── SUBJECT AUTOCOMPLETE ─────────────────────────────────────────────────────

function initAutocomplete(inputId, suggestionsId) {
  const input  = document.getElementById(inputId);
  const box    = document.getElementById(suggestionsId);
  let focusIdx = -1;

  function showSuggestions(val) {
    if (!val) { box.classList.remove('visible'); return; }
    const matches = SUBJECTS.filter(s => s.toLowerCase().startsWith(val.toLowerCase()));
    if (!matches.length) { box.classList.remove('visible'); return; }
    box.innerHTML = matches.map((m,i) =>
      `<div class="suggestion-item" data-idx="${i}">${m}</div>`
    ).join('');
    box.classList.add('visible');
    focusIdx = -1;
  }

  input.addEventListener('input', () => showSuggestions(input.value));

  input.addEventListener('keydown', e => {
    const items = box.querySelectorAll('.suggestion-item');
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusIdx = (focusIdx + 1) % items.length;
      items.forEach((el,i) => el.classList.toggle('focused', i === focusIdx));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusIdx = (focusIdx - 1 + items.length) % items.length;
      items.forEach((el,i) => el.classList.toggle('focused', i === focusIdx));
    } else if (e.key === 'Enter' && focusIdx >= 0) {
      e.preventDefault();
      input.value = items[focusIdx].textContent;
      box.classList.remove('visible');
    } else if (e.key === 'Escape') {
      box.classList.remove('visible');
    }
  });

  box.addEventListener('mousedown', e => {
    const item = e.target.closest('.suggestion-item');
    if (item) {
      e.preventDefault();
      input.value = item.textContent;
      box.classList.remove('visible');
    }
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !box.contains(e.target)) {
      box.classList.remove('visible');
    }
  });
}

// ─── ROTINA DE ESTUDOS ────────────────────────────────────────────────────────

function openRoutineModal() {
  const overlay = document.getElementById('modal-routine');

  document.querySelectorAll('#routine-days input[type="checkbox"]').forEach(cb => {
    const day = Number(cb.dataset.day);
    cb.checked = state.routine.activeDays.includes(day);
  });
  document.getElementById('routine-start').value = state.routine.startHour;
  document.getElementById('routine-end').value   = state.routine.endHour;
  document.getElementById('routine-min-session').value = String(state.routine.minSessionMinutes || 60);

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
}

function closeRoutineModal() {
  const overlay = document.getElementById('modal-routine');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
}

function saveRoutineModal() {
  const activeDays = [...document.querySelectorAll('#routine-days input[type="checkbox"]')]
    .filter(cb => cb.checked)
    .map(cb => Number(cb.dataset.day));

  const startHour = document.getElementById('routine-start').value.trim();
  const endHour   = document.getElementById('routine-end').value.trim();
  const minSessionMinutes = Number(document.getElementById('routine-min-session').value);

  if (!startHour || !endHour) return showToast('Defina o horário inicial e final do dia.');
  if (endHour <= startHour) return showToast('O horário final deve ser depois do inicial.');
  if (!activeDays.length) return showToast('Selecione ao menos um dia ativo.');

  state.routine = { activeDays, startHour, endHour, minSessionMinutes };
  saveRoutine();
  recalcTimelineBounds();
  renderCalendar();
  closeRoutineModal();
  showToast('Rotina de estudos atualizada.');
}

// ─── WEEK NAVIGATION ──────────────────────────────────────────────────────────

function navigateWeek(delta) {
  const d = new Date(state.currentWeekStart);
  d.setDate(d.getDate() + delta * 7);

  if (delta < 0) {
    const todayMonday = getMondayOf(new Date());
    const weeksBack = Math.round((todayMonday - d) / (7 * 86400000));
    if (weeksBack > MIN_WEEKS_BACK) return; // block navigation beyond limit
  }

  state.currentWeekStart = d;
  renderCalendar();
}

function goToToday() {
  state.currentWeekStart = getMondayOf(new Date());
  renderCalendar();
}

// ─── AÇÕES DA SEMANA (menu ⋮) ─────────────────────────────────────────────────

function toggleWeekMenu(forceClose) {
  const menu = document.getElementById('week-menu');
  if (forceClose) { menu.classList.remove('open'); return; }
  menu.classList.toggle('open');
}

function copyPreviousWeek() {
  toggleWeekMenu(true);

  const currentMonday = state.currentWeekStart;
  const prevMonday = new Date(currentMonday);
  prevMonday.setDate(prevMonday.getDate() - 7);
  const prevKey = toISO(prevMonday);
  const currentKey = getWeekKey();

  const prevData = state.weeks[prevKey];
  if (!prevData || Object.values(prevData).every(arr => !arr.length)) {
    showToast('A semana anterior está vazia.');
    return;
  }

  const currentData = state.weeks[currentKey];
  const hasCurrentData = currentData && Object.values(currentData).some(arr => arr.length);
  if (hasCurrentData) {
    const proceed = window.confirm('A semana atual já possui estudos. Copiar a semana anterior vai substituir os dados existentes. Continuar?');
    if (!proceed) return;
  } else {
    const proceed = window.confirm('Copiar todos os estudos da semana anterior para a semana atual?');
    if (!proceed) return;
  }

  const newWeek = buildEmptyWeek();
  Object.keys(prevData).forEach(dayIdx => {
    newWeek[dayIdx] = (prevData[dayIdx] || []).map(s => ({
      ...s,
      id: uid(),
      status: 'pending',
    }));
  });

  state.weeks[currentKey] = newWeek;
  saveStorage();
  renderCalendar();
  showToast('Semana anterior copiada.');
}

function clearCurrentWeek() {
  toggleWeekMenu(true);

  const currentKey = getWeekKey();
  const currentData = state.weeks[currentKey];
  const hasData = currentData && Object.values(currentData).some(arr => arr.length);

  if (!hasData) {
    showToast('Esta semana já está vazia.');
    return;
  }

  const proceed = window.confirm('Tem certeza que deseja apagar todos os estudos desta semana? Esta ação não pode ser desfeita.');
  if (!proceed) return;

  // Remove apenas os estudos da semana atual (agendados, planejados,
  // observações e status). Rotina, semanas anteriores/futuras e demais
  // configurações permanecem intactas.
  state.weeks[currentKey] = buildEmptyWeek();
  saveStorage();
  renderCalendar();
  showToast('Semana limpa.');
}

// ─── TOAST ────────────────────────────────────────────────────────────────────

let toastTimer = null;

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

function init() {
  // Load data
  loadStorage();

  // Set current week
  state.currentWeekStart = getMondayOf(new Date());

  // Render
  renderCalendar();

  // ── Week navigation (compact, title-like) ──
  document.getElementById('btn-prev').addEventListener('click', () => navigateWeek(-1));
  document.getElementById('btn-next').addEventListener('click', () => navigateWeek(1));
  document.getElementById('week-nav-title').addEventListener('click', goToToday);

  // ── Week menu (ações da semana) ──
  document.getElementById('week-menu-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleWeekMenu();
  });
  document.getElementById('action-copy-prev-week').addEventListener('click', copyPreviousWeek);
  document.getElementById('action-clear-week').addEventListener('click', clearCurrentWeek);
  document.addEventListener('click', (e) => {
    const wrap = document.querySelector('.week-menu-wrap');
    if (wrap && !wrap.contains(e.target)) toggleWeekMenu(true);
  });

  // ── Sidebar ──
  document.getElementById('nav-agenda').addEventListener('click', () => {
    setActiveSidebarItem('nav-agenda');
  });
  document.getElementById('nav-new-study').addEventListener('click', () => {
    openSessionModal({ weekKey: getWeekKey(), dayIdx: state.currentWeekStart.getDay() === 0 ? 6 : state.currentWeekStart.getDay() - 1, sessionId: null });
  });
  document.getElementById('nav-routine').addEventListener('click', openRoutineModal);

  // ── Session modal buttons ──
  document.getElementById('modal-close').addEventListener('click', closeSessionModal);
  document.getElementById('btn-cancel').addEventListener('click', closeSessionModal);
  document.getElementById('btn-save').addEventListener('click', saveSession);
  document.getElementById('btn-delete').addEventListener('click', deleteSession);

  // ── Sugestão automática de duração ──
  document.getElementById('input-time').addEventListener('change', updateDurationSuggestion);
  document.getElementById('input-time-end').addEventListener('input', () => {
    document.getElementById('input-time-end').dataset.autofilled = '0';
    hideDurationHint();
  });

  // ── Routine modal buttons ──
  document.getElementById('modal-routine-close').addEventListener('click', closeRoutineModal);
  document.getElementById('btn-routine-cancel').addEventListener('click', closeRoutineModal);
  document.getElementById('btn-routine-save').addEventListener('click', saveRoutineModal);

  // ── Overlays: click outside to close ──
  document.getElementById('modal-session').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeSessionModal();
  });
  document.getElementById('modal-routine').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeRoutineModal();
  });

  // ── ESC key ──
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (document.getElementById('modal-routine').classList.contains('open')) closeRoutineModal();
      else if (document.getElementById('modal-session').classList.contains('open')) closeSessionModal();
      else toggleWeekMenu(true);
    }
  });

  // ── Color picker ──
  initColorPicker('color-options', 'modal');

  // ── Autocomplete ──
  initAutocomplete('input-subject', 'subject-suggestions');

  // ── Save on Enter in session modal inputs (except textarea) ──
  ['input-time','input-time-end','input-subject'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveSession();
      }
    });
  });

  // ── Recalculate label offsets on resize, in case --hour-h changes
  // via a responsive media query (keeps ruler/hour-line positions in sync)
  window.addEventListener('resize', () => renderCalendar());
}

function setActiveSidebarItem(id) {
  document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

document.addEventListener('DOMContentLoaded', init);