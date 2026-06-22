/* ===========================
   NEXUS STUDY — pessoal/calendar/calendar.js
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
  goals:   'nexus_goals',
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
  goals: [],                // [{ id, title, description, period, deadline, weekKey, linkMode, subject, sessionRefs, manualProgress, color, status, createdAt }]
  modal: {
    context: null,          // { weekKey, dayIdx, sessionId } | null
    mode: 'new',            // 'new' | 'edit'
    color: 'blue',
  },
  goalModal: {
    goalId: null,           // id of goal being edited, or null when creating
    linkMode: 'subject',    // 'subject' | 'manual' | 'none'
    color: 'blue',
    sessionRefs: [],        // [{ weekKey, dayIdx, sessionId }] when linkMode === 'manual'
  },
  drag: null,               // active drag/resize operation, or null
  plannedDrag: null,        // active planned-chip drag (planned<->scheduled, reorder)
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

  try {
    const goals = localStorage.getItem(STORAGE_KEYS.goals);
    state.goals = goals ? JSON.parse(goals) : [];
  } catch (e) {
    state.goals = [];
  }

  recalcTimelineBounds();
}

function saveStorage() {
  localStorage.setItem(STORAGE_KEYS.weeks, JSON.stringify(state.weeks));
}

function saveRoutine() {
  localStorage.setItem(STORAGE_KEYS.routine, JSON.stringify(state.routine));
}

function saveGoals() {
  localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(state.goals));
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

// Ordena estudos planejados pelo campo `order` (definido pelo usuário via
// drag and drop); itens sem `order` (ex: criados antes dessa funcionalidade)
// vão para o final, na ordem em que aparecem.
function sortPlanned(sessions) {
  return [...sessions].sort((a, b) => {
    const ao = Number.isFinite(a.order) ? a.order : Infinity;
    const bo = Number.isFinite(b.order) ? b.order : Infinity;
    return ao - bo;
  });
}

// ─── ITERAÇÃO GLOBAL DE SESSÕES (usado por Metas e Estatísticas) ───────────

// Percorre todas as sessões de todas as semanas conhecidas, chamando
// callback(session, weekKey, dayIdx) para cada uma. Não modifica nada.
function forEachSession(callback) {
  Object.keys(state.weeks).forEach(weekKey => {
    const weekData = state.weeks[weekKey];
    Object.keys(weekData).forEach(dayIdx => {
      (weekData[dayIdx] || []).forEach(session => {
        callback(session, weekKey, Number(dayIdx));
      });
    });
  });
}

function getAllSessionsFlat() {
  const out = [];
  forEachSession((session, weekKey, dayIdx) => out.push({ session, weekKey, dayIdx }));
  return out;
}

function findSessionRef(weekKey, dayIdx, sessionId) {
  const dayArr = (state.weeks[weekKey] && state.weeks[weekKey][dayIdx]) || [];
  return dayArr.find(s => s.id === sessionId) || null;
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

  // ── Linha "Planejados". Fica entre o cabeçalho e a régua/timeline, sem
  // ocupar espaço dentro da grade de horários. É sempre renderizada no DOM
  // (estrutura), mas só ganha altura/padding visíveis quando há ao menos
  // um planejado na semana — isso preserva a zona de drop em todos os dias,
  // mesmo vazios, permitindo devolver um estudo agendado para "Planejados"
  // mesmo quando a lista está completamente vazia. ──
  const plannedByDay = {};
  let hasAnyPlanned = false;
  for (let i = 0; i < 7; i++) {
    plannedByDay[i] = sortPlanned((weekData[i] || []).filter(isPlanned));
    if (plannedByDay[i].length) hasAnyPlanned = true;
  }

  {
    const plannedCorner = document.createElement('div');
    plannedCorner.className = 'planned-row-corner' + (hasAnyPlanned ? '' : ' is-collapsed');
    scrollWrap.appendChild(plannedCorner);

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(dayDate.getDate() + i);
      const dateStr = toISO(dayDate);
      const isToday = dateStr === todayStr;
      const isInactive = !activeDays.has(i);
      const plannedItems = plannedByDay[i];

      const cell = document.createElement('div');
      cell.className = 'planned-row-cell'
        + (isToday ? ' is-today' : '')
        + (isInactive ? ' is-inactive' : '')
        + (hasAnyPlanned ? '' : ' is-collapsed');
      cell.dataset.dayIdx = i;

      const section = document.createElement('div');
      section.className = 'planned-section';

      const label = document.createElement('div');
      label.className = 'planned-section-label';
      label.textContent = 'Planejados';
      section.appendChild(label);

      const list = document.createElement('div');
      list.className = 'planned-chips';
      list.dataset.dayIdx = i;

      if (plannedItems.length) {
        plannedItems.forEach(session => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.draggable = true;
          chip.className = 'planned-chip' + (session.status === 'done' ? ' is-done' : '');
          chip.dataset.color = session.color || 'blue';
          chip.dataset.sessionId = session.id;
          chip.dataset.dayIdx = i;
          chip.title = session.subject + (session.note ? ` — ${session.note}` : '') + ' · arraste para um horário ou para reordenar';
          chip.innerHTML = `<span class="planned-chip-icon">📌</span><span class="planned-chip-label">${escHtml(session.subject)}</span>`;
          chip.addEventListener('click', (e) => {
            if (chip.dataset.suppressClick === '1') {
              chip.dataset.suppressClick = '0';
              return;
            }
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
    initTimelineDropZone(timeline, inner, weekKey, i);
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
    <div class="card-move-handle" draggable="true" title="Arraste até 'Planejados' para remover o horário">⠿</div>
    <div class="card-resize-handle"></div>
  `;

  // Clique no card abre o modal de edição (a menos que tenha havido drag/resize)
  card.addEventListener('click', (e) => {
    if (e.target.closest('.card-move-handle')) return;
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
  // Drag para a área "Planejados" (remove o horário, mantém o restante)
  initScheduledToPlannedDrag(card, weekKey, dayIdx, session.id);

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
    if (e.target.closest('.card-check') || e.target.closest('.card-resize-handle') || e.target.closest('.card-move-handle')) return;
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

    async function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      card.classList.remove('is-dragging');

      if (moved && card._dragNewStartMin !== undefined) {
        const newStartMin = card._dragNewStartMin;
        const newEndMin = newStartMin + duration;
        const newStart = minutesToTime(newStartMin);
        const newEnd = minutesToTime(newEndMin);
        card.dataset.suppressClick = '1';

        const conflicts = findConflicts(weekKey, dayIdx, newStart, newEnd, sessionId);
        if (conflicts.length) {
          const c = conflicts[0];
          const proceed = await confirmDialog(
            `Esse novo horário conflita com "${c.subject}" (${c.timeStart}–${c.timeEnd}). Mover mesmo assim?`,
            { title: 'Conflito de horário', confirmLabel: 'Mover mesmo assim' }
          );
          if (!proceed) {
            renderCalendar();
            return;
          }
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

    async function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);

      if (moved && card._resizeNewDuration !== undefined) {
        const newEndMin = startMin + card._resizeNewDuration;
        const newEnd = minutesToTime(newEndMin);
        card.dataset.suppressClick = '1';

        const conflicts = findConflicts(weekKey, dayIdx, session.timeStart || session.time, newEnd, sessionId);
        if (conflicts.length) {
          const c = conflicts[0];
          const proceed = await confirmDialog(
            `Essa duração conflita com "${c.subject}" (${c.timeStart}–${c.timeEnd}). Continuar mesmo assim?`,
            { title: 'Conflito de horário', confirmLabel: 'Continuar mesmo assim' }
          );
          if (!proceed) {
            renderCalendar();
            return;
          }
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

// ─── DRAG AND DROP: PLANEJADO ↔ AGENDADO ─────────────────────────────────────
//
// Usa a API nativa de Drag and Drop do HTML5 (draggable + dragstart/dragover/
// drop), pois a interação atravessa zonas distintas do grid (chips de
// planejados <-> colunas de horário <-> outros chips para reordenar), o que
// é mais robusto com eventos nativos do que com mousemove manual.

// Estudo planejado arrastado para fora da lista de chips (para um horário,
// ou para reordenar dentro da própria lista).
function initPlannedChipDrag(chip, weekKey, dayIdx, sessionId) {
  chip.addEventListener('dragstart', (e) => {
    state.plannedDrag = { kind: 'planned', weekKey, dayIdx, sessionId };
    chip.classList.add('is-dragging');
    e.dataTransfer.effectAllowed = 'move';
    // Necessário em alguns navegadores para que o drag funcione
    try { e.dataTransfer.setData('text/plain', sessionId); } catch (_) {}
  });
  chip.addEventListener('dragend', () => {
    chip.classList.remove('is-dragging');
    document.querySelectorAll('.is-drop-target').forEach(el => el.classList.remove('is-drop-target'));
    state.plannedDrag = null;
  });

  // Permite também reordenar: soltar um chip sobre outro chip da mesma lista
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
    if (!drag || drag.kind !== 'planned') return;
    if (drag.sessionId === sessionId) return; // soltou sobre si mesmo

    reorderPlanned(drag.weekKey, drag.dayIdx, drag.sessionId, weekKey, dayIdx, sessionId);
  });
}

// Reordena (ou move entre dias, se aplicável) um estudo planejado, soltando-o
// na posição de outro estudo planejado de referência.
function reorderPlanned(fromWeekKey, fromDayIdx, sessionId, toWeekKey, toDayIdx, beforeSessionId) {
  if (fromWeekKey !== toWeekKey) return; // reordenação é sempre dentro da mesma semana

  const dayArr = state.weeks[toWeekKey] && state.weeks[toWeekKey][toDayIdx];
  if (!dayArr) return;

  // Move o estudo de dia, se necessário (mantendo-o planejado)
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

  // Reconstroi a ordem da lista de planejados do dia de destino, inserindo
  // o item movido imediatamente antes do item de referência.
  const targetDayArr = state.weeks[toWeekKey][toDayIdx] || [];
  let planned = sortPlanned(targetDayArr.filter(isPlanned).filter(s => s.id !== sessionId));
  const refIdx = planned.findIndex(s => s.id === beforeSessionId);
  if (fromDayIdx !== toDayIdx) {
    if (refIdx < 0) planned.push(moving); else planned.splice(refIdx, 0, moving);
    targetDayArr.push(moving);
  } else {
    if (refIdx < 0) planned.push(moving); else planned.splice(refIdx, 0, moving);
  }

  planned.forEach((s, idx) => { s.order = idx; });

  saveStorage();
  renderCalendar();
  showToast('Ordem dos planejados atualizada.');
}

// Zona de drop para a área "Planejados" de um dia — recebe tanto chips de
// outros dias (reordenação/realocação) quanto estudos agendados arrastados
// da timeline (que perdem o horário e se tornam planejados).
function initPlannedDropZone(cellEl, weekKey, dayIdx) {
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
      // Soltou em uma lista vazia ou fora de qualquer chip específico: vai para o final
      reorderPlanned(drag.weekKey, drag.dayIdx, drag.sessionId, weekKey, dayIdx, null);
    }
  });
}

// Zona de drop nas colunas de horário — recebe um chip "Planejado" e o
// transforma em estudo agendado, usando a duração mínima configurada na
// rotina, no horário correspondente à posição vertical do drop.
function initTimelineDropZone(timelineEl, innerEl, weekKey, dayIdx) {
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
    let startMin = offsetToMinutes(offsetY);
    startMin = snapMinutes(startMin);

    const durationMin = Number(state.routine.minSessionMinutes) || 60;
    startMin = Math.max(TIMELINE_START_HOUR * 60, Math.min(startMin, TIMELINE_END_HOUR * 60 - durationMin));

    await plannedToScheduled(drag.weekKey, drag.dayIdx, drag.sessionId, weekKey, dayIdx, minutesToTime(startMin), durationMin);
  });
}

// Converte um estudo planejado em agendado: aplica timeStart/timeEnd
// (duração padrão da rotina) e remove o campo `order` (não é mais relevante
// fora da lista de planejados). Mantém conteúdo, observação, status e cor.
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
    const proceed = await confirmDialog(
      `Esse horário conflita com "${c.subject}" (${c.timeStart}–${c.timeEnd}). Agendar mesmo assim?`,
      { title: 'Conflito de horário', confirmLabel: 'Agendar mesmo assim' }
    );
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

// Converte um estudo agendado em planejado: remove apenas timeStart/timeEnd,
// mantendo conteúdo, observação, status e demais informações.
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

// Estudo agendado (session-card) arrastado para a área de planejados, via
// um handle dedicado (para não competir com o reposicionamento vertical
// manual, que usa mousedown/mousemove na área principal do card).
function initScheduledToPlannedDrag(card, weekKey, dayIdx, sessionId) {
  const handle = card.querySelector('.card-move-handle');
  if (!handle) return;

  handle.addEventListener('mousedown', (e) => e.stopPropagation());

  handle.addEventListener('dragstart', (e) => {
    e.stopPropagation();
    state.plannedDrag = { kind: 'scheduled', weekKey, dayIdx, sessionId };
    card.classList.add('is-dragging');
    document.body.classList.add('is-dragging-scheduled');
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', sessionId); } catch (_) {}
  });
  handle.addEventListener('dragend', () => {
    card.classList.remove('is-dragging');
    document.body.classList.remove('is-dragging-scheduled');
    document.querySelectorAll('.is-drop-target').forEach(el => el.classList.remove('is-drop-target'));
    state.plannedDrag = null;
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

async function saveSession() {
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
      const proceed = await confirmDialog(
        `Conflito de horário com "${c.subject}" (${c.timeStart}–${c.timeEnd}). Deseja salvar mesmo assim?`,
        { title: 'Conflito de horário', confirmLabel: 'Salvar mesmo assim' }
      );
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
      if (becamePlanned && !wasPlanned) {
        dayArr[idx].order = nextPlannedOrder(weekKey, dayIdx, sessionId);
      } else if (!becamePlanned) {
        delete dayArr[idx].order;
      }
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

// Calcula o próximo índice de ordem para um novo estudo planejado em um dia
// (vai para o final da lista de planejados existente). `excludeId` evita
// contar o próprio estudo (em edições) se ele já estiver no array.
function nextPlannedOrder(weekKey, dayIdx, excludeId) {
  const dayArr = (state.weeks[weekKey] && state.weeks[weekKey][dayIdx]) || [];
  const planned = sortPlanned(dayArr.filter(s => isPlanned(s) && s.id !== excludeId));
  if (!planned.length) return 0;
  const last = planned[planned.length - 1];
  return Number.isFinite(last.order) ? last.order + 1 : planned.length;
}

function deleteSession() {
  const { weekKey, dayIdx, sessionId } = state.modal.context;
  if (!state.weeks[weekKey]) return;
  state.weeks[weekKey][dayIdx] = (state.weeks[weekKey][dayIdx] || [])
    .filter(s => s.id !== sessionId);
  unlinkSessionFromGoals(weekKey, dayIdx, sessionId);
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
    else if (stateKey === 'goalModal') state.goalModal.color = color;
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

// ─── METAS ────────────────────────────────────────────────────────────────────
//
// Uma meta representa um objetivo maior que um único estudo (ex: "Finalizar
// módulo de Java"). O progresso pode vir de três formas (vínculo híbrido):
//   - 'subject': conta automaticamente estudos concluídos cujo conteúdo
//      corresponde ao texto definido na meta (mesmo critério usado no
//      autocomplete de conteúdo do estudo).
//   - 'manual': a meta lista referências explícitas a estudos específicos
//      (de qualquer dia/semana, planejados ou agendados); o progresso é a
//      proporção desses estudos já concluídos.
//   - 'none': progresso é um número (0-100) definido livremente pelo
//      usuário, sem nenhum vínculo com estudos.
// Em qualquer modo, o usuário pode também sobrescrever o progresso
// manualmente (campo `manualOverride`), o que tem prioridade sobre o
// cálculo automático — sem perder o vínculo (ex: pode "destravar" depois).

function createEmptyGoalDraft() {
  return {
    id: null,
    title: '',
    description: '',
    period: 'week',       // 'week' | 'custom' | 'open'
    deadline: '',         // ISO date, usado quando period === 'custom'
    weekKey: getWeekKey(),// semana de referência quando period === 'week'
    linkMode: 'subject',  // 'subject' | 'manual' | 'none'
    subject: '',
    sessionRefs: [],      // [{ weekKey, dayIdx, sessionId }]
    manualProgress: 0,
    color: 'blue',
    status: 'active',     // 'active' | 'done' | 'archived'
    createdAt: toISO(new Date()),
  };
}

// Verifica se um estudo corresponde ao conteúdo vinculado de uma meta
// (comparação case-insensitive, por igualdade — mesmo padrão usado nos
// chips de Conteúdo já existentes no sistema).
function sessionMatchesSubject(session, subject) {
  if (!subject) return false;
  return (session.subject || '').trim().toLowerCase() === subject.trim().toLowerCase();
}

// Calcula o progresso (0-100) e contadores de uma meta a partir dos dados
// reais do sistema (estudos), respeitando o modo de vínculo escolhido.
function computeGoalProgress(goal) {
  if (goal.linkMode === 'none') {
    return { percent: Math.max(0, Math.min(100, Number(goal.manualProgress) || 0)), total: 0, done: 0 };
  }

  if (goal.linkMode === 'subject') {
    let total = 0, done = 0;
    // Metas com vínculo automático por conteúdo somam o histórico completo
    // de estudos com aquele conteúdo (não apenas a semana atual), já que o
    // objetivo (ex: "Finalizar módulo de Java") geralmente atravessa
    // várias semanas.
    forEachSession((session) => {
      if (!sessionMatchesSubject(session, goal.subject)) return;
      total++;
      if (session.status === 'done') done++;
    });
    if (!total) return { percent: 0, total: 0, done: 0 };
    return { percent: Math.round((done / total) * 100), total, done };
  }

  // linkMode === 'manual'
  const refs = goal.sessionRefs || [];
  let total = 0, done = 0;
  refs.forEach(ref => {
    const session = findSessionRef(ref.weekKey, ref.dayIdx, ref.sessionId);
    if (!session) return; // referência órfã (estudo removido) — ignorada silenciosamente
    total++;
    if (session.status === 'done') done++;
  });
  if (!total) return { percent: 0, total: 0, done: 0 };
  return { percent: Math.round((done / total) * 100), total, done };
}

// Remove referências a um estudo excluído de todas as metas que o
// vinculam manualmente, para não acumular referências órfãs.
function unlinkSessionFromGoals(weekKey, dayIdx, sessionId) {
  let changed = false;
  state.goals.forEach(goal => {
    if (goal.linkMode !== 'manual' || !goal.sessionRefs) return;
    const before = goal.sessionRefs.length;
    goal.sessionRefs = goal.sessionRefs.filter(r =>
      !(r.weekKey === weekKey && r.dayIdx === dayIdx && r.sessionId === sessionId)
    );
    if (goal.sessionRefs.length !== before) changed = true;
  });
  if (changed) saveGoals();
}

// ─── NAVEGAÇÃO ENTRE VIEWS (Agenda / Metas / Estatísticas) ───────────────────
//
// As três seções funcionam como "páginas" dentro do mesmo app-shell: a
// sidebar permanece fixa e apenas o conteúdo principal é substituído,
// com o item correspondente marcado como ativo — sem usar modais.
function switchView(viewId, navId) {
  document.querySelectorAll('.app-view').forEach(el => {
    el.classList.toggle('active', el.id === viewId);
  });
  setActiveSidebarItem(navId);
}

function openAgendaView() {
  switchView('view-agenda', 'nav-agenda');
}

function openGoalsView() {
  switchView('view-goals', 'nav-goals');
  renderGoalsList();
  closeGoalEditor();
}

function renderGoalsList() {
  const list = document.getElementById('goals-list');
  list.innerHTML = '';

  if (!state.goals.length) {
    const empty = document.createElement('p');
    empty.className = 'goals-empty';
    empty.textContent = 'Nenhuma meta ainda. Crie a primeira para acompanhar um objetivo maior, como finalizar um módulo ou revisar um tema durante a semana.';
    list.appendChild(empty);
    return;
  }

  // Ativas primeiro, depois concluídas; dentro de cada grupo, mais recentes primeiro.
  const sorted = [...state.goals].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'done' ? 1 : -1;
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });

  sorted.forEach(goal => {
    const { percent, total, done } = computeGoalProgress(goal);
    const card = document.createElement('div');
    card.className = 'goal-card' + (goal.status === 'done' ? ' is-done' : '');
    card.dataset.color = goal.color || 'blue';

    const periodLabel = goal.period === 'week'
      ? 'Esta semana'
      : goal.period === 'custom'
        ? (goal.deadline ? `Até ${formatGoalDate(goal.deadline)}` : 'Período personalizado')
        : 'Sem prazo definido';

    const linkLabel = goal.linkMode === 'subject'
      ? `Automático · conteúdo "${escHtml(goal.subject || '—')}"`
      : goal.linkMode === 'manual'
        ? `${total} estudo${total === 1 ? '' : 's'} vinculado${total === 1 ? '' : 's'}`
        : 'Progresso manual';

    card.innerHTML = `
      <div class="goal-card-top">
        <div class="goal-card-title-wrap">
          <h3 class="goal-card-title">${escHtml(goal.title)}</h3>
          <span class="goal-card-meta">${escHtml(periodLabel)} · ${escHtml(linkLabel)}</span>
        </div>
        <button type="button" class="goal-card-done-btn" title="${goal.status === 'done' ? 'Reabrir meta' : 'Marcar como concluída'}">${goal.status === 'done' ? '✓' : ''}</button>
      </div>
      ${goal.description ? `<p class="goal-card-desc">${escHtml(goal.description)}</p>` : ''}
      <div class="goal-progress-bar"><div class="goal-progress-fill" style="width:${percent}%"></div></div>
      <div class="goal-progress-label">${percent}%${goal.linkMode !== 'none' ? (total ? ` · ${done}/${total} concluído${total === 1 ? '' : 's'}` : ' · nenhum estudo vinculado ainda') : ''}</div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.goal-card-done-btn')) return;
      openGoalEditor(goal.id);
    });

    card.querySelector('.goal-card-done-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      goal.status = goal.status === 'done' ? 'active' : 'done';
      saveGoals();
      renderGoalsList();
      showToast(goal.status === 'done' ? 'Meta concluída.' : 'Meta reaberta.');
    });

    list.appendChild(card);
  });
}

function formatGoalDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y) return iso;
  return `${d} de ${MONTH_NAMES[m - 1]}`;
}

// ─── EDITOR DE META (criar/editar) ───────────────────────────────────────────

function openGoalEditor(goalId) {
  const isEdit = !!goalId;
  const goal = isEdit ? state.goals.find(g => g.id === goalId) : createEmptyGoalDraft();
  if (isEdit && !goal) return;

  state.goalModal = {
    goalId: isEdit ? goalId : null,
    linkMode: goal.linkMode,
    color: goal.color,
    sessionRefs: isEdit ? [...(goal.sessionRefs || [])] : [],
  };

  document.getElementById('goal-title').value = goal.title || '';
  document.getElementById('goal-description').value = goal.description || '';
  document.getElementById('goal-period').value = goal.period || 'week';
  document.getElementById('goal-deadline').value = goal.deadline || '';
  document.getElementById('goal-deadline-group').style.display = goal.period === 'custom' ? '' : 'none';
  document.getElementById('goal-subject').value = goal.subject || '';
  document.getElementById('goal-manual-progress').value = String(goal.manualProgress || 0);
  document.getElementById('goal-manual-progress-value').textContent = `${goal.manualProgress || 0}%`;

  setColorPicker('goal-color-options', goal.color || 'blue');
  state.goalModal.color = goal.color || 'blue';
  setGoalLinkMode(goal.linkMode || 'subject');
  renderGoalSessionPicker();

  document.getElementById('btn-goal-delete').style.display = isEdit ? 'inline-flex' : 'none';
  document.getElementById('goal-editor').style.display = 'flex';
  document.getElementById('btn-new-goal').style.display = 'none';
  document.getElementById('goals-list').style.display = 'none';

  setTimeout(() => document.getElementById('goal-title').focus(), 50);
}

function closeGoalEditor() {
  document.getElementById('goal-editor').style.display = 'none';
  document.getElementById('btn-new-goal').style.display = '';
  document.getElementById('goals-list').style.display = '';
  document.getElementById('goal-subject-suggestions').classList.remove('visible');
}

function setGoalLinkMode(mode) {
  state.goalModal.linkMode = mode;
  document.querySelectorAll('#goal-link-options .goal-link-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  document.getElementById('goal-subject-group').style.display = mode === 'subject' ? '' : 'none';
  document.getElementById('goal-sessions-group').style.display = mode === 'manual' ? '' : 'none';
  document.getElementById('goal-manual-group').style.display = mode === 'none' ? '' : 'none';
  if (mode === 'manual') renderGoalSessionPicker();
}

// Lista candidatos para vínculo manual: estudos planejados ou agendados das
// semanas conhecidas (atual ± próximas/anteriores já visitadas), permitindo
// ao usuário escolher quais compõem a meta. Estudos já selecionados ficam
// marcados; o sistema também sugere automaticamente estudos cujo conteúdo
// seja igual ao título da meta, como ponto de partida.
function renderGoalSessionPicker() {
  const picker = document.getElementById('goal-session-picker');
  picker.innerHTML = '';

  const allSessions = getAllSessionsFlat()
    .sort((a, b) => (b.weekKey + (a.session.timeStart || a.session.time || '')).localeCompare(a.weekKey + (b.session.timeStart || b.session.time || '')));

  if (!allSessions.length) {
    picker.innerHTML = '<p class="field-hint">Nenhum estudo criado ainda. Crie estudos na agenda para vinculá-los aqui.</p>';
    return;
  }

  const selectedIds = new Set(state.goalModal.sessionRefs.map(r => r.sessionId));

  allSessions.slice(0, 60).forEach(({ session, weekKey, dayIdx }) => {
    const row = document.createElement('label');
    row.className = 'goal-session-row';
    const isChecked = selectedIds.has(session.id);
    const timeLabel = isPlanned(session) ? 'Planejado' : (session.timeStart || session.time || '');
    row.innerHTML = `
      <input type="checkbox" ${isChecked ? 'checked' : ''} />
      <span class="goal-session-row-subject">${escHtml(session.subject)}</span>
      <span class="goal-session-row-meta">${DAY_SHORT[dayIdx]} · ${escHtml(timeLabel)}${session.status === 'done' ? ' · ✓' : ''}</span>
    `;
    row.querySelector('input').addEventListener('change', (e) => {
      const refs = state.goalModal.sessionRefs;
      const idx = refs.findIndex(r => r.sessionId === session.id);
      if (e.target.checked && idx < 0) {
        refs.push({ weekKey, dayIdx, sessionId: session.id });
      } else if (!e.target.checked && idx >= 0) {
        refs.splice(idx, 1);
      }
    });
    picker.appendChild(row);
  });
}

function saveGoalFromEditor() {
  const title = document.getElementById('goal-title').value.trim();
  if (!title) return showToast('Dê um título para a meta.');

  const description = document.getElementById('goal-description').value.trim();
  const period = document.getElementById('goal-period').value;
  const deadline = document.getElementById('goal-deadline').value;
  const linkMode = state.goalModal.linkMode;
  const subject = document.getElementById('goal-subject').value.trim();
  const manualProgress = Number(document.getElementById('goal-manual-progress').value) || 0;
  const color = state.goalModal.color;

  if (period === 'custom' && !deadline) {
    return showToast('Defina uma data ou escolha outro período.');
  }
  if (linkMode === 'subject' && !subject) {
    return showToast('Informe o conteúdo a ser acompanhado, ou escolha outro modo de progresso.');
  }

  const { goalId } = state.goalModal;
  const isEdit = !!goalId;
  const goal = isEdit ? state.goals.find(g => g.id === goalId) : createEmptyGoalDraft();

  goal.title = title;
  goal.description = description;
  goal.period = period;
  goal.deadline = period === 'custom' ? deadline : '';
  goal.weekKey = period === 'week' ? getWeekKey() : goal.weekKey;
  goal.linkMode = linkMode;
  goal.subject = subject;
  goal.sessionRefs = [...state.goalModal.sessionRefs];
  goal.manualProgress = manualProgress;
  goal.color = color;
  if (!goal.status) goal.status = 'active';

  if (!isEdit) {
    goal.id = uid();
    state.goals.push(goal);
  }

  saveGoals();
  renderGoalsList();
  closeGoalEditor();
  showToast(isEdit ? 'Meta atualizada.' : 'Meta criada.');
}

async function deleteGoalFromEditor() {
  const { goalId } = state.goalModal;
  if (!goalId) return;
  const proceed = await confirmDialog(
    'Excluir esta meta? Os estudos vinculados não serão afetados.',
    { title: 'Excluir meta', confirmLabel: 'Excluir', danger: true }
  );
  if (!proceed) return;
  state.goals = state.goals.filter(g => g.id !== goalId);
  saveGoals();
  renderGoalsList();
  closeGoalEditor();
  showToast('Meta excluída.');
}

// ─── ESTATÍSTICAS ─────────────────────────────────────────────────────────────
//
// Calculadas sob demanda a partir dos dados reais (não há persistência
// própria) — sempre refletem o estado atual de semanas, rotina e metas.

function computeGlobalStats() {
  let totalSessions = 0, doneSessions = 0, plannedCount = 0, scheduledCount = 0;
  let totalMinutesDone = 0;
  const bySubject = {};       // { subject: { total, done } }
  const weekTotals = {};      // { weekKey: { total, done } }

  forEachSession((session, weekKey) => {
    totalSessions++;
    const planned = isPlanned(session);
    if (planned) plannedCount++; else scheduledCount++;

    const subj = session.subject || '—';
    if (!bySubject[subj]) bySubject[subj] = { total: 0, done: 0 };
    bySubject[subj].total++;

    if (!weekTotals[weekKey]) weekTotals[weekKey] = { total: 0, done: 0 };
    weekTotals[weekKey].total++;

    if (session.status === 'done') {
      doneSessions++;
      bySubject[subj].done++;
      weekTotals[weekKey].done++;
      if (!planned) {
        const start = timeToMinutes(session.timeStart || session.time || '00:00');
        const end = timeToMinutes(session.timeEnd) || start + 60;
        totalMinutesDone += Math.max(0, end - start);
      }
    }
  });

  const completionPercent = totalSessions ? Math.round((doneSessions / totalSessions) * 100) : 0;

  // Semana mais produtiva (mais estudos concluídos)
  let bestWeek = null;
  Object.keys(weekTotals).forEach(wk => {
    const w = weekTotals[wk];
    if (!bestWeek || w.done > weekTotals[bestWeek].done) bestWeek = wk;
  });

  // Top conteúdos por volume de estudos concluídos
  const topSubjects = Object.entries(bySubject)
    .map(([subject, v]) => ({ subject, ...v, percent: v.total ? Math.round((v.done / v.total) * 100) : 0 }))
    .sort((a, b) => b.done - a.done)
    .slice(0, 5);

  // Sequência de conclusão: dias consecutivos (até hoje, olhando para trás)
  // com pelo menos um estudo concluído.
  const streak = computeCompletionStreak();

  // Progresso de metas
  const goalsActive = state.goals.filter(g => g.status === 'active');
  const goalsDone = state.goals.filter(g => g.status === 'done');
  const goalsAvgPercent = goalsActive.length
    ? Math.round(goalsActive.reduce((sum, g) => sum + computeGoalProgress(g).percent, 0) / goalsActive.length)
    : 0;

  return {
    totalSessions, doneSessions, plannedCount, scheduledCount,
    completionPercent, totalMinutesDone,
    bestWeek, bestWeekDone: bestWeek ? weekTotals[bestWeek].done : 0,
    topSubjects, streak,
    goalsActiveCount: goalsActive.length,
    goalsDoneCount: goalsDone.length,
    goalsAvgPercent,
  };
}

// Conta quantos dias consecutivos (terminando hoje ou no último dia com
// dados) tiveram ao menos um estudo concluído, com base no campo `status`
// dos estudos agendados (estudos planejados não têm data fixa, então não
// participam da sequência diária).
function computeCompletionStreak() {
  const doneDates = new Set();
  Object.keys(state.weeks).forEach(weekKey => {
    const monday = new Date(weekKey + 'T00:00:00');
    const weekData = state.weeks[weekKey];
    Object.keys(weekData).forEach(dayIdx => {
      (weekData[dayIdx] || []).forEach(session => {
        if (session.status === 'done' && !isPlanned(session)) {
          const d = new Date(monday);
          d.setDate(d.getDate() + Number(dayIdx));
          doneDates.add(toISO(d));
        }
      });
    });
  });

  if (!doneDates.has(toISO(new Date())) && !doneDates.size) return 0;

  let streak = 0;
  let cursor = new Date();
  // Se hoje ainda não tem nada concluído, começa a contar a partir de ontem
  // (não zera a sequência só porque o dia ainda não terminou).
  if (!doneDates.has(toISO(cursor))) cursor.setDate(cursor.getDate() - 1);

  while (doneDates.has(toISO(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function openStatsView() {
  switchView('view-stats', 'nav-stats');
  renderStats();
}

function formatHoursLabel(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (!h) return `${m} min`;
  if (!m) return `${h}h`;
  return `${h}h ${m}min`;
}

function renderStats() {
  const body = document.getElementById('stats-body');
  const s = computeGlobalStats();

  if (!s.totalSessions) {
    body.innerHTML = `<p class="goals-empty">Ainda não há estudos suficientes para gerar estatísticas. Adicione estudos na agenda e volte aqui para acompanhar sua evolução.</p>`;
    return;
  }

  const metricCard = (label, value, sub) => `
    <div class="stat-card">
      <div class="stat-card-value">${value}</div>
      <div class="stat-card-label">${label}</div>
      ${sub ? `<div class="stat-card-sub">${sub}</div>` : ''}
    </div>
  `;

  const bestWeekLabel = s.bestWeek
    ? (isCurrentWeek(new Date(s.bestWeek + 'T00:00:00')) ? 'Esta semana' : formatRange(new Date(s.bestWeek + 'T00:00:00')))
    : '—';

  body.innerHTML = `
    <div class="stats-grid">
      ${metricCard('Estudos concluídos', `${s.doneSessions}`, `de ${s.totalSessions} criados`)}
      ${metricCard('Conclusão geral', `${s.completionPercent}%`, `${s.plannedCount} planejados · ${s.scheduledCount} agendados`)}
      ${metricCard('Tempo estudado', formatHoursLabel(s.totalMinutesDone), 'estudos agendados concluídos')}
      ${metricCard('Sequência atual', `${s.streak} dia${s.streak === 1 ? '' : 's'}`, 'com estudos concluídos')}
      ${metricCard('Semana mais produtiva', bestWeekLabel, s.bestWeek ? `${s.bestWeekDone} concluído${s.bestWeekDone === 1 ? '' : 's'}` : '')}
      ${metricCard('Metas', `${s.goalsAvgPercent}%`, `${s.goalsActiveCount} ativa${s.goalsActiveCount === 1 ? '' : 's'} · ${s.goalsDoneCount} concluída${s.goalsDoneCount === 1 ? '' : 's'}`)}
    </div>

    <div class="stats-section">
      <h3 class="stats-section-title">Conteúdos com mais estudos concluídos</h3>
      <div class="stats-subject-list">
        ${s.topSubjects.length ? s.topSubjects.map(t => `
          <div class="stats-subject-row">
            <span class="stats-subject-name">${escHtml(t.subject)}</span>
            <div class="stats-subject-bar"><div class="stats-subject-fill" style="width:${t.percent}%"></div></div>
            <span class="stats-subject-count">${t.done}/${t.total}</span>
          </div>
        `).join('') : '<p class="field-hint">Sem dados suficientes ainda.</p>'}
      </div>
    </div>
  `;
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

async function copyPreviousWeek() {
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
  const proceed = hasCurrentData
    ? await confirmDialog(
        'A semana atual já possui estudos. Copiar a semana anterior vai substituir os dados existentes. Continuar?',
        { title: 'Copiar semana anterior', confirmLabel: 'Substituir e copiar', danger: true }
      )
    : await confirmDialog(
        'Copiar todos os estudos da semana anterior para a semana atual?',
        { title: 'Copiar semana anterior', confirmLabel: 'Copiar' }
      );
  if (!proceed) return;

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

async function clearCurrentWeek() {
  toggleWeekMenu(true);

  const currentKey = getWeekKey();
  const currentData = state.weeks[currentKey];
  const hasData = currentData && Object.values(currentData).some(arr => arr.length);

  if (!hasData) {
    showToast('Esta semana já está vazia.');
    return;
  }

  const proceed = await confirmDialog(
    'Tem certeza que deseja apagar todos os estudos desta semana? Esta ação não pode ser desfeita.',
    { title: 'Limpar semana', confirmLabel: 'Apagar tudo', danger: true }
  );
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

// ─── CONFIRMAÇÃO (modal) ──────────────────────────────────────────────────────
//
// Substitui window.confirm em todo o sistema por um modal consistente com o
// restante da interface. Como um modal real não bloqueia a thread (ao
// contrário de window.confirm), a função retorna uma Promise<boolean> —
// resolvida com `true` se o usuário confirmar, `false` se cancelar ou fechar
// de qualquer forma (ESC, clique fora, botão Cancelar).
let confirmResolver = null;

function confirmDialog(message, opts = {}) {
  const { title = 'Confirmar ação', confirmLabel = 'Confirmar', danger = false } = opts;

  return new Promise((resolve) => {
    confirmResolver = resolve;

    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    const okBtn = document.getElementById('confirm-btn-ok');
    okBtn.textContent = confirmLabel;
    okBtn.classList.toggle('btn-danger', danger);
    okBtn.classList.toggle('btn-save', !danger);

    const overlay = document.getElementById('modal-confirm');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    setTimeout(() => okBtn.focus(), 50);
  });
}

function resolveConfirm(result) {
  const overlay = document.getElementById('modal-confirm');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  if (confirmResolver) {
    confirmResolver(result);
    confirmResolver = null;
  }
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
  document.getElementById('nav-agenda').addEventListener('click', openAgendaView);
  document.getElementById('nav-new-study').addEventListener('click', () => {
    openSessionModal({ weekKey: getWeekKey(), dayIdx: state.currentWeekStart.getDay() === 0 ? 6 : state.currentWeekStart.getDay() - 1, sessionId: null });
  });
  document.getElementById('nav-routine').addEventListener('click', openRoutineModal);
  document.getElementById('nav-goals').addEventListener('click', openGoalsView);
  document.getElementById('nav-stats').addEventListener('click', openStatsView);

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

  // ── Goals (view) buttons ──
  document.getElementById('btn-new-goal').addEventListener('click', () => openGoalEditor(null));
  document.getElementById('btn-goal-cancel').addEventListener('click', closeGoalEditor);
  document.getElementById('btn-goal-save').addEventListener('click', saveGoalFromEditor);
  document.getElementById('btn-goal-delete').addEventListener('click', deleteGoalFromEditor);

  document.getElementById('goal-period').addEventListener('change', (e) => {
    document.getElementById('goal-deadline-group').style.display = e.target.value === 'custom' ? '' : 'none';
  });

  document.getElementById('goal-link-options').addEventListener('click', (e) => {
    const btn = e.target.closest('.goal-link-opt');
    if (!btn) return;
    setGoalLinkMode(btn.dataset.mode);
  });

  document.getElementById('goal-manual-progress').addEventListener('input', (e) => {
    document.getElementById('goal-manual-progress-value').textContent = `${e.target.value}%`;
  });

  initColorPicker('goal-color-options', 'goalModal');
  initAutocomplete('goal-subject', 'goal-subject-suggestions');

  // ── Confirm modal buttons ──
  document.getElementById('confirm-btn-ok').addEventListener('click', () => resolveConfirm(true));
  document.getElementById('confirm-btn-cancel').addEventListener('click', () => resolveConfirm(false));

  // ── Overlays: click outside to close (apenas modais reais — Metas e
  // Estatísticas agora são views de página, sem overlay) ──
  document.getElementById('modal-session').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeSessionModal();
  });
  document.getElementById('modal-routine').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeRoutineModal();
  });
  document.getElementById('modal-confirm').addEventListener('click', e => {
    if (e.target === e.currentTarget) resolveConfirm(false);
  });

  // ── ESC key ──
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (document.getElementById('modal-confirm').classList.contains('open')) resolveConfirm(false);
      else if (document.getElementById('modal-routine').classList.contains('open')) closeRoutineModal();
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