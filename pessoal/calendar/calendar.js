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

const COLOR_ICON = {
  blue:   `<svg class="card-icon" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 12h8M8 8h8M8 16h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  purple: `<svg class="card-icon" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  green:  `<svg class="card-icon" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  amber:  `<svg class="card-icon" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="currentColor" stroke-width="1.8"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  rose:   `<svg class="card-icon" viewBox="0 0 24 24" fill="none"><path d="M4.9 4.9C6.5 3.3 9.1 2 12 2s5.5 1.3 7.1 2.9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M20.4 7.5A10 10 0 1112 22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 8v4l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  teal:   `<svg class="card-icon" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
};

const STORAGE_KEYS = {
  defaultPlan: 'nexus_default_plan',
  weeks:       'nexus_weeks',
};

const MIN_WEEKS_BACK = 1; // allow current week + 1 week in the past

// Time-grid configuration
const TIMELINE_START_HOUR = 6;  // 06:00
const TIMELINE_END_HOUR   = 23; // 23:00
const TIMELINE_HOURS = TIMELINE_END_HOUR - TIMELINE_START_HOUR;

// ─── STATE ────────────────────────────────────────────────────────────────────

let state = {
  currentWeekStart: null,   // Monday of displayed week (Date)
  defaultPlan: null,        // { mon:[], tue:[], ... }
  weeks: {},                // { 'YYYY-MM-DD': { mon:[], ... } } keyed by monday ISO
  modal: {
    context: null,          // { weekKey, dayIdx, sessionId } | null
    mode: 'new',            // 'new' | 'edit'
    color: 'blue',
  },
  planModal: {
    context: null,          // { dayIdx, sessionId } | null
    mode: 'new',
    color: 'blue',
  }
};

// ─── STORAGE ─────────────────────────────────────────────────────────────────

function loadStorage() {
  try {
    const plan = localStorage.getItem(STORAGE_KEYS.defaultPlan);
    state.defaultPlan = plan ? JSON.parse(plan) : buildEmptyWeek();
    const weeks = localStorage.getItem(STORAGE_KEYS.weeks);
    state.weeks = weeks ? JSON.parse(weeks) : {};
  } catch (e) {
    state.defaultPlan = buildEmptyWeek();
    state.weeks = {};
  }
}

function saveStorage() {
  localStorage.setItem(STORAGE_KEYS.defaultPlan, JSON.stringify(state.defaultPlan));
  localStorage.setItem(STORAGE_KEYS.weeks, JSON.stringify(state.weeks));
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

function sortSessions(sessions) {
  return [...sessions].sort((a, b) => (a.timeStart || a.time || '').localeCompare(b.timeStart || b.time || ''));
}

function timeToMinutes(t) {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

// Convert a time string to a vertical pixel offset within the timeline
function timeToOffset(t) {
  const minutes = timeToMinutes(t) - TIMELINE_START_HOUR * 60;
  return (minutes / 60) * getHourHeight();
}

function getHourHeight() {
  const val = getComputedStyle(document.documentElement).getPropertyValue('--hour-h').trim();
  return parseFloat(val) || 56;
}

// ─── WEEK DATA ────────────────────────────────────────────────────────────────

function getWeekData(monday) {
  const key = toISO(monday);
  if (!state.weeks[key]) {
    // Deep clone default plan for this week
    const plan = state.defaultPlan;
    const week = {};
    for (let i = 0; i < 7; i++) {
      week[i] = (plan[i] || []).map(s => ({ ...s, id: uid() }));
    }
    state.weeks[key] = week;
    saveStorage();
  }
  return state.weeks[key];
}

function getWeekKey() {
  return toISO(state.currentWeekStart);
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

  // Set CSS var for total hours in the timeline
  grid.style.setProperty('--hours-count', TIMELINE_HOURS);

  // ── Scroll wrapper ──
  const scrollWrap = document.createElement('div');
  scrollWrap.className = 'grid-scroll';

  // ── Header row: corner + 7 day headers ──
  const headerRow = document.createElement('div');
  headerRow.className = 'grid-header-row';

  const corner = document.createElement('div');
  corner.className = 'grid-corner';
  headerRow.appendChild(corner);

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(dayDate.getDate() + i);
    const dateStr = toISO(dayDate);
    const isToday = dateStr === todayStr;

    const cell = document.createElement('div');
    cell.className = 'day-header-cell' + (isToday ? ' is-today' : '');
    cell.innerHTML = `
      <div class="day-name">${DAY_NAMES[i]}</div>
      <div class="day-date">${dayDate.getDate()}</div>
    `;
    headerRow.appendChild(cell);
  }

  scrollWrap.appendChild(headerRow);

  // ── Body row: time ruler + 7 timelines ──
  const gridBody = document.createElement('div');
  gridBody.className = 'grid-body';

  // Time ruler
  const ruler = document.createElement('div');
  ruler.className = 'time-ruler';
  const rulerInner = document.createElement('div');
  rulerInner.className = 'timeline-inner';
  for (let h = TIMELINE_START_HOUR; h <= TIMELINE_END_HOUR; h++) {
    const offset = (h - TIMELINE_START_HOUR) * getHourHeight();
    const label = document.createElement('div');
    label.className = 'time-ruler-label';
    label.style.top = `${offset}px`;
    label.textContent = `${String(h).padStart(2,'0')}:00`;
    rulerInner.appendChild(label);
  }
  ruler.appendChild(rulerInner);
  gridBody.appendChild(ruler);

  // Day timelines
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(dayDate.getDate() + i);
    const dateStr = toISO(dayDate);
    const isToday = dateStr === todayStr;
    const sessions = sortSessions(weekData[i] || []);

    const timeline = document.createElement('div');
    timeline.className = 'day-timeline' + (isToday ? ' is-today' : '');
    timeline.dataset.dayIdx = i;

    const inner = document.createElement('div');
    inner.className = 'timeline-inner';

    // Hour lines
    for (let h = TIMELINE_START_HOUR; h <= TIMELINE_END_HOUR; h++) {
      const offset = (h - TIMELINE_START_HOUR) * getHourHeight();
      const line = document.createElement('div');
      line.className = 'hour-line';
      line.style.top = `${offset}px`;
      inner.appendChild(line);
    }

    // Session cards (with overlap-aware horizontal layout)
    const positioned = layoutSessions(sessions);
    positioned.forEach(({ session, col, cols }) => {
      const card = createSessionCard(session, col, cols);
      card.addEventListener('click', () => openSessionModal({ weekKey, dayIdx: i, sessionId: session.id }));
      inner.appendChild(card);
    });

    timeline.appendChild(inner);

    // Add button
    const addBtn = document.createElement('button');
    addBtn.className = 'day-add-btn';
    addBtn.textContent = '+';
    addBtn.setAttribute('aria-label', `Adicionar estudo em ${DAY_NAMES[i]}`);
    addBtn.addEventListener('click', () => openSessionModal({ weekKey, dayIdx: i, sessionId: null }));
    timeline.appendChild(addBtn);

    gridBody.appendChild(timeline);
  }

  scrollWrap.appendChild(gridBody);
  grid.appendChild(scrollWrap);
}

// Detect overlapping sessions and assign column slots so they sit side-by-side
function layoutSessions(sessions) {
  const items = sessions.map(s => ({
    session: s,
    start: timeToMinutes(s.timeStart || s.time || '00:00'),
    end: timeToMinutes(s.timeEnd) || (timeToMinutes(s.timeStart || s.time || '00:00') + 60),
  }));

  // Group overlapping items into clusters
  items.sort((a, b) => a.start - b.start);
  const result = [];
  let cluster = [];
  let clusterEnd = -Infinity;

  function flushCluster() {
    if (!cluster.length) return;
    // Assign columns within the cluster (simple greedy)
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

function createSessionCard(session, col = 0, cols = 1) {
  const color = session.color || 'blue';
  const icon  = COLOR_ICON[color] || COLOR_ICON.blue;
  const card  = document.createElement('div');
  card.className     = 'session-card';
  card.dataset.color = color;
  card.dataset.id    = session.id;

  const start = session.timeStart || session.time || '';
  const end   = session.timeEnd || '';
  const timeLabel = end ? `${start} <span class="time-sep">→</span> ${end}` : start;

  // Position and size based on time
  const hourH = getHourHeight();
  const top = timeToOffset(start);
  let durationMin = end ? (timeToMinutes(end) - timeToMinutes(start)) : 60;
  if (durationMin <= 0) durationMin = 60;
  const height = Math.max((durationMin / 60) * hourH, 30);

  card.style.top = `${top}px`;
  card.style.height = `${height}px`;

  // Horizontal slot when sessions overlap
  if (cols > 1) {
    const gap = 4;
    card.style.left = `calc(6px + (100% - 12px) * ${col} / ${cols} + ${col > 0 ? gap/2 : 0}px)`;
    card.style.width = `calc((100% - 12px) / ${cols} - ${cols > 1 ? gap/2 : 0}px)`;
    card.style.right = 'auto';
  }

  // Hide subject/note text if card is too short to fit comfortably
  const compact = height < 44;

  card.innerHTML = `
    <div class="card-time">${icon}${timeLabel}</div>
    ${compact ? '' : `<div class="card-subject">${escHtml(session.subject)}</div>`}
  `;
  return card;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ─── SESSION MODAL ────────────────────────────────────────────────────────────

function openSessionModal({ weekKey, dayIdx, sessionId }) {
  const overlay = document.getElementById('modal-session');
  const isEdit  = sessionId !== null;

  state.modal.context = { weekKey, dayIdx, sessionId };
  state.modal.mode    = isEdit ? 'edit' : 'new';

  // Set title
  document.getElementById('modal-title').textContent =
    isEdit ? 'Editar estudo' : `Novo estudo — ${DAY_NAMES[dayIdx]}`;

  // Populate or reset
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
}

function saveSession() {
  const timeStart = document.getElementById('input-time').value.trim();
  const timeEnd   = document.getElementById('input-time-end').value.trim();
  const subject   = document.getElementById('input-subject').value.trim();
  const note      = document.getElementById('input-note').value.trim();
  const color     = state.modal.color;

  if (!timeStart) return showToast('Por favor, defina a hora inicial.');
  if (!timeEnd)   return showToast('Por favor, defina a hora final.');
  if (timeEnd <= timeStart) return showToast('A hora final deve ser depois da inicial.');
  if (!subject) return showToast('Por favor, informe a matéria.');

  const { weekKey, dayIdx, sessionId } = state.modal.context;

  if (!state.weeks[weekKey]) state.weeks[weekKey] = buildEmptyWeek();
  const dayArr = state.weeks[weekKey][dayIdx] || [];

  if (state.modal.mode === 'edit') {
    const idx = dayArr.findIndex(s => s.id === sessionId);
    if (idx >= 0) {
      dayArr[idx] = { ...dayArr[idx], timeStart, timeEnd, subject, note, color };
      delete dayArr[idx].time;
    }
  } else {
    dayArr.push({ id: uid(), timeStart, timeEnd, subject, note, color });
    state.weeks[weekKey][dayIdx] = dayArr;
  }

  saveStorage();
  renderCalendar();
  closeSessionModal();
  showToast(state.modal.mode === 'edit' ? 'Estudo atualizado.' : 'Estudo adicionado.');
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
    if (stateKey === 'modal')     state.modal.color = color;
    if (stateKey === 'planModal') state.planModal.color = color;
    setColorPicker(containerId, color);
  });
}

// ─── SUBJECT AUTOCOMPLETE ─────────────────────────────────────────────────────

function initAutocomplete(inputId, suggestionsId, stateKey) {
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

// ─── DEFAULT PLAN MODAL ───────────────────────────────────────────────────────

function openPlanModal() {
  renderPlanGrid();
  document.getElementById('modal-plan').classList.add('open');
  document.getElementById('modal-plan').setAttribute('aria-hidden', 'false');
}

function closePlanModal() {
  document.getElementById('modal-plan').classList.remove('open');
  document.getElementById('modal-plan').setAttribute('aria-hidden', 'true');
}

function renderPlanGrid() {
  const grid = document.getElementById('plan-grid');
  grid.innerHTML = '';

  for (let i = 0; i < 7; i++) {
    const col = document.createElement('div');
    col.className = 'plan-day-col';
    col.innerHTML = `<div class="plan-day-name">${DAY_SHORT[i]}</div>`;

    const sessions = sortSessions(state.defaultPlan[i] || []);
    sessions.forEach(s => {
      const card = document.createElement('div');
      card.className = 'plan-session-card';
      card.dataset.color = s.color || 'blue';
      const start = s.timeStart || s.time || '';
      const end   = s.timeEnd || '';
      const timeLabel = end ? `${start} → ${end}` : start;
      card.innerHTML = `
        <div class="plan-card-time">${timeLabel}</div>
        <div class="plan-card-subject">${escHtml(s.subject)}</div>
      `;
      card.addEventListener('click', () => openPlanSessionModal({ dayIdx: i, sessionId: s.id }));
      col.appendChild(card);
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'plan-add-btn';
    addBtn.textContent = '+';
    addBtn.addEventListener('click', () => openPlanSessionModal({ dayIdx: i, sessionId: null }));
    col.appendChild(addBtn);

    grid.appendChild(col);
  }
}

function applyPlanToCurrentWeek() {
  const key = getWeekKey();
  const week = {};
  for (let i = 0; i < 7; i++) {
    week[i] = (state.defaultPlan[i] || []).map(s => ({ ...s, id: uid() }));
  }
  state.weeks[key] = week;
  saveStorage();
  renderCalendar();
  closePlanModal();
  showToast('Plano padrão aplicado à semana atual.');
}

function clearDefaultPlan() {
  if (!confirm('Limpar todo o plano padrão?')) return;
  state.defaultPlan = buildEmptyWeek();
  saveStorage();
  renderPlanGrid();
  showToast('Plano padrão limpo.');
}

// ─── PLAN SESSION MODAL ───────────────────────────────────────────────────────

function openPlanSessionModal({ dayIdx, sessionId }) {
  const overlay = document.getElementById('modal-plan-session');
  const isEdit  = sessionId !== null;

  state.planModal.context = { dayIdx, sessionId };
  state.planModal.mode    = isEdit ? 'edit' : 'new';

  document.getElementById('modal-plan-session-title').textContent =
    isEdit ? `Editar — ${DAY_NAMES[dayIdx]}` : `Adicionar — ${DAY_NAMES[dayIdx]}`;

  if (isEdit) {
    const session = (state.defaultPlan[dayIdx] || []).find(s => s.id === sessionId) || {};
    document.getElementById('ps-time').value     = session.timeStart || session.time || '';
    document.getElementById('ps-time-end').value = session.timeEnd || '';
    document.getElementById('ps-subject').value  = session.subject || '';
    document.getElementById('ps-note').value     = session.note || '';
    setColorPicker('ps-color-options', session.color || 'blue');
    state.planModal.color = session.color || 'blue';
    document.getElementById('btn-ps-delete').style.display = 'inline-flex';
  } else {
    document.getElementById('ps-time').value     = '';
    document.getElementById('ps-time-end').value = '';
    document.getElementById('ps-subject').value  = '';
    document.getElementById('ps-note').value     = '';
    setColorPicker('ps-color-options', 'blue');
    state.planModal.color = 'blue';
    document.getElementById('btn-ps-delete').style.display = 'none';
  }

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => document.getElementById('ps-time').focus(), 100);
}

function closePlanSessionModal() {
  document.getElementById('modal-plan-session').classList.remove('open');
  document.getElementById('modal-plan-session').setAttribute('aria-hidden', 'true');
  document.getElementById('ps-suggestions').classList.remove('visible');
}

function savePlanSession() {
  const timeStart = document.getElementById('ps-time').value.trim();
  const timeEnd   = document.getElementById('ps-time-end').value.trim();
  const subject   = document.getElementById('ps-subject').value.trim();
  const note      = document.getElementById('ps-note').value.trim();
  const color     = state.planModal.color;

  if (!timeStart) return showToast('Por favor, defina a hora inicial.');
  if (!timeEnd)   return showToast('Por favor, defina a hora final.');
  if (timeEnd <= timeStart) return showToast('A hora final deve ser depois da inicial.');
  if (!subject) return showToast('Por favor, informe a matéria.');

  const { dayIdx, sessionId } = state.planModal.context;
  const dayArr = state.defaultPlan[dayIdx] || [];

  if (state.planModal.mode === 'edit') {
    const idx = dayArr.findIndex(s => s.id === sessionId);
    if (idx >= 0) {
      dayArr[idx] = { ...dayArr[idx], timeStart, timeEnd, subject, note, color };
      delete dayArr[idx].time;
    }
  } else {
    dayArr.push({ id: uid(), timeStart, timeEnd, subject, note, color });
    state.defaultPlan[dayIdx] = dayArr;
  }

  saveStorage();
  closePlanSessionModal();
  renderPlanGrid();
  showToast(state.planModal.mode === 'edit' ? 'Atualizado no plano.' : 'Adicionado ao plano.');
}

function deletePlanSession() {
  const { dayIdx, sessionId } = state.planModal.context;
  state.defaultPlan[dayIdx] = (state.defaultPlan[dayIdx] || [])
    .filter(s => s.id !== sessionId);
  saveStorage();
  closePlanSessionModal();
  renderPlanGrid();
  showToast('Removido do plano.');
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

function copyPreviousWeek() {
  const currentMonday = state.currentWeekStart;
  const prevMonday = new Date(currentMonday);
  prevMonday.setDate(prevMonday.getDate() - 7);

  const currentKey = toISO(currentMonday);
  const hasExisting = Object.values(getWeekData(currentMonday) || {})
    .some(arr => Array.isArray(arr) && arr.length > 0);

  if (hasExisting) {
    if (!confirm('Isso vai substituir os horários já definidos para esta semana pelos da semana anterior. Continuar?')) {
      return;
    }
  }

  const prevData = getWeekData(prevMonday);
  const week = {};
  for (let i = 0; i < 7; i++) {
    week[i] = (prevData[i] || []).map(s => ({ ...s, id: uid() }));
  }
  state.weeks[currentKey] = week;
  saveStorage();
  renderCalendar();
  showToast('Semana anterior copiada.');
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

// ─── SEED DEFAULT PLAN ────────────────────────────────────────────────────────

function seedDefaultPlan() {
  // Only seed if plan is completely empty
  const isEmpty = Object.values(state.defaultPlan).every(d => d.length === 0);
  if (!isEmpty) return;

  const seed = {
    0: [ // Segunda
      { id: uid(), timeStart:'07:00', timeEnd:'08:00', subject:'Matemática', note:'', color:'blue' },
      { id: uid(), timeStart:'08:30', timeEnd:'09:30', subject:'Física',     note:'', color:'purple' },
      { id: uid(), timeStart:'10:00', timeEnd:'11:00', subject:'Intervalo',  note:'', color:'amber' },
      { id: uid(), timeStart:'13:30', timeEnd:'14:30', subject:'Programação',note:'', color:'green' },
      { id: uid(), timeStart:'15:00', timeEnd:'16:00', subject:'Inglês',     note:'', color:'teal' },
      { id: uid(), timeStart:'19:00', timeEnd:'20:00', subject:'Revisão',    note:'', color:'rose' },
    ],
    1: [ // Terça
      { id: uid(), timeStart:'07:30', timeEnd:'08:30', subject:'Inglês',     note:'', color:'teal' },
      { id: uid(), timeStart:'09:00', timeEnd:'10:00', subject:'Matemática', note:'', color:'blue' },
      { id: uid(), timeStart:'10:30', timeEnd:'11:30', subject:'Intervalo',  note:'', color:'amber' },
      { id: uid(), timeStart:'14:00', timeEnd:'15:00', subject:'Física',     note:'', color:'purple' },
      { id: uid(), timeStart:'16:00', timeEnd:'17:00', subject:'Programação',note:'', color:'green' },
      { id: uid(), timeStart:'19:30', timeEnd:'20:30', subject:'Revisão',    note:'', color:'rose' },
    ],
    2: [ // Quarta
      { id: uid(), timeStart:'07:00', timeEnd:'08:00', subject:'Matemática', note:'', color:'blue' },
      { id: uid(), timeStart:'09:30', timeEnd:'10:30', subject:'Física',     note:'', color:'purple' },
      { id: uid(), timeStart:'10:00', timeEnd:'11:00', subject:'Intervalo',  note:'', color:'amber' },
      { id: uid(), timeStart:'13:30', timeEnd:'14:30', subject:'Programação',note:'', color:'green' },
      { id: uid(), timeStart:'15:00', timeEnd:'16:00', subject:'Inglês',     note:'', color:'teal' },
      { id: uid(), timeStart:'19:00', timeEnd:'20:00', subject:'Revisão',    note:'', color:'rose' },
    ],
    3: [ // Quinta
      { id: uid(), timeStart:'07:30', timeEnd:'08:30', subject:'Programação',note:'', color:'green' },
      { id: uid(), timeStart:'09:30', timeEnd:'10:30', subject:'Matemática', note:'', color:'blue' },
      { id: uid(), timeStart:'11:00', timeEnd:'12:00', subject:'Intervalo',  note:'', color:'amber' },
      { id: uid(), timeStart:'14:00', timeEnd:'15:00', subject:'Física',     note:'', color:'purple' },
      { id: uid(), timeStart:'16:00', timeEnd:'17:00', subject:'Inglês',     note:'', color:'teal' },
      { id: uid(), timeStart:'19:30', timeEnd:'20:30', subject:'Revisão',    note:'', color:'rose' },
    ],
    4: [ // Sexta
      { id: uid(), timeStart:'07:00', timeEnd:'08:00', subject:'Matemática', note:'', color:'blue' },
      { id: uid(), timeStart:'08:30', timeEnd:'09:30', subject:'Física',     note:'', color:'purple' },
      { id: uid(), timeStart:'10:00', timeEnd:'11:00', subject:'Intervalo',  note:'', color:'amber' },
      { id: uid(), timeStart:'13:30', timeEnd:'14:30', subject:'Programação',note:'', color:'green' },
      { id: uid(), timeStart:'15:00', timeEnd:'16:00', subject:'Inglês',     note:'', color:'teal' },
      { id: uid(), timeStart:'19:00', timeEnd:'20:00', subject:'Revisão',    note:'', color:'rose' },
    ],
    5: [ // Sábado
      { id: uid(), timeStart:'08:00', timeEnd:'09:00', subject:'Matemática', note:'', color:'blue' },
      { id: uid(), timeStart:'10:00', timeEnd:'11:00', subject:'Física',     note:'', color:'purple' },
      { id: uid(), timeStart:'12:00', timeEnd:'13:00', subject:'Intervalo',  note:'', color:'amber' },
      { id: uid(), timeStart:'14:00', timeEnd:'15:00', subject:'Programação',note:'', color:'green' },
      { id: uid(), timeStart:'16:00', timeEnd:'17:00', subject:'Inglês',     note:'', color:'teal' },
      { id: uid(), timeStart:'18:00', timeEnd:'19:00', subject:'Revisão',    note:'', color:'rose' },
    ],
    6: [ // Domingo
      { id: uid(), timeStart:'09:00', timeEnd:'10:00', subject:'Programação',note:'', color:'green' },
      { id: uid(), timeStart:'11:00', timeEnd:'12:00', subject:'Matemática', note:'', color:'blue' },
      { id: uid(), timeStart:'13:00', timeEnd:'14:00', subject:'Intervalo',  note:'', color:'amber' },
      { id: uid(), timeStart:'15:00', timeEnd:'16:00', subject:'Física',     note:'', color:'purple' },
      { id: uid(), timeStart:'17:00', timeEnd:'18:00', subject:'Inglês',     note:'', color:'teal' },
      { id: uid(), timeStart:'19:00', timeEnd:'20:00', subject:'Revisão',    note:'', color:'rose' },
    ],
  };

  state.defaultPlan = seed;
  saveStorage();
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

function init() {
  // Load data
  loadStorage();
  seedDefaultPlan();

  // Set current week
  state.currentWeekStart = getMondayOf(new Date());

  // Render
  renderCalendar();

  // ── Header buttons
  document.getElementById('btn-prev').addEventListener('click', () => navigateWeek(-1));
  document.getElementById('btn-next').addEventListener('click', () => navigateWeek(1));
  document.getElementById('btn-today').addEventListener('click', goToToday);
  document.getElementById('btn-copy-prev').addEventListener('click', copyPreviousWeek);
  document.getElementById('btn-default-plan').addEventListener('click', openPlanModal);

  // ── Session modal buttons
  document.getElementById('modal-close').addEventListener('click', closeSessionModal);
  document.getElementById('btn-cancel').addEventListener('click', closeSessionModal);
  document.getElementById('btn-save').addEventListener('click', saveSession);
  document.getElementById('btn-delete').addEventListener('click', deleteSession);

  // ── Plan modal buttons
  document.getElementById('modal-plan-close').addEventListener('click', closePlanModal);
  document.getElementById('btn-plan-cancel').addEventListener('click', closePlanModal);
  document.getElementById('btn-apply-plan').addEventListener('click', applyPlanToCurrentWeek);
  document.getElementById('btn-clear-plan').addEventListener('click', clearDefaultPlan);

  // ── Plan session modal buttons
  document.getElementById('modal-plan-session-close').addEventListener('click', closePlanSessionModal);
  document.getElementById('btn-ps-cancel').addEventListener('click', closePlanSessionModal);
  document.getElementById('btn-ps-save').addEventListener('click', savePlanSession);
  document.getElementById('btn-ps-delete').addEventListener('click', deletePlanSession);

  // ── Overlays: click outside to close
  document.getElementById('modal-session').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeSessionModal();
  });
  document.getElementById('modal-plan').addEventListener('click', e => {
    if (e.target === e.currentTarget) closePlanModal();
  });
  document.getElementById('modal-plan-session').addEventListener('click', e => {
    if (e.target === e.currentTarget) closePlanSessionModal();
  });

  // ── ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (document.getElementById('modal-plan-session').classList.contains('open')) closePlanSessionModal();
      else if (document.getElementById('modal-plan').classList.contains('open'))    closePlanModal();
      else if (document.getElementById('modal-session').classList.contains('open')) closeSessionModal();
    }
  });

  // ── Color pickers
  initColorPicker('color-options', 'modal');
  initColorPicker('ps-color-options', 'planModal');

  // ── Autocomplete
  initAutocomplete('input-subject', 'subject-suggestions', 'modal');
  initAutocomplete('ps-subject',    'ps-suggestions',       'planModal');

  // ── Save on Enter in session modal inputs (except textarea)
  ['input-time','input-time-end','input-subject'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveSession();
      }
    });
  });
  ['ps-time','ps-time-end','ps-subject'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        savePlanSession();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', init);