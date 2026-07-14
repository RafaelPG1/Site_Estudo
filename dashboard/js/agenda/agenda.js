/* dashboard\js\agenda\agenda.js
   proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   ─────────────────────────────────────────────
   NEXUS STUDY — Módulo Calendário (Agenda)
   ─────────────────────────────────────────────
   Migrado de pessoal/calendar/ (calendar.html/css/js) para
   dentro do Dashboard, seguindo o MESMO contrato de módulo
   desacoplado já usado por Checklist e Tarefas:

     abrirAgenda(containerEl) → monta (1ª vez) ou apenas
                                 atualiza os dados (demais
                                 vezes) e exibe a view.
     fecharAgenda()           → marca a view como fechada
                                 (fecha menus/modais abertos).
     agendaEstaAberta()       → usado por dashboard.js ao
                                 trocar de semestre, para saber
                                 se precisa re-renderizar.

   O HTML antigo (app-shell + sidebar própria) foi substituído
   por um fragmento único (TEMPLATE_HTML), injetado dentro do
   container que o Dashboard já reserva (#view-agenda). A
   navegação interna (Agenda / Metas / Estatísticas) virou uma
   barra de abas (.agenda-toolbar) — ver agenda.css.

   Este arquivo é o único "dono" de `state` e das funções de
   persistência — os demais arquivos do módulo (agenda_render.js,
   agenda_interactions.js, agenda_pages.js) importam tudo daqui.

   Os campos de Hora inicial/final (modal "Novo estudo" e modal
   "Rotina de estudos") e o campo de Data (meta "Concluir até")
   não são <input type="time"> / <input type="date"> nativos —
   são <input type="text"> comuns, de digitação manual (formato
   HH:MM / DD/MM/AAAA), com formatação e validação feitas por
   initTimeInput()/initDateInput() em agenda_interactions.js.
   ============================================= */

import { renderCalendar } from './agenda_render.js';
import { initAgendaEventListeners, switchTab } from './agenda_interactions.js';

/* ─────────────────────────────────────────────
   UI STATE MANAGER (sistema global de preservação de estado)
   ─────────────────────────────────────────────
   `state.currentWeekStart` (semana visível) e `state.activeTab`
   (Agenda/Metas/Estatísticas) só viviam em memória: sobreviviam a
   uma troca de view dentro da mesma sessão (a Agenda só é montada
   uma vez, ver `_construida` mais abaixo), mas um F5 sempre voltava
   para a semana atual e a aba "Agenda", mesmo que o usuário
   estivesse revisando uma semana passada na aba "Estatísticas".
   Isso é persistido agora pelo mesmo UIState usado por todos os
   outros módulos — ver dashboard/js/utils/ui_state_manager.js. */
import { UIState } from '../utils/ui_state_manager.js';
const _CHAVE_ESTADO_UI = 'agenda';

/* ── CONSTANTES (idênticas ao calendar.js original) ── */
export const DAY_NAMES = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
export const DAY_SHORT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
export const MONTH_NAMES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export const SUBJECTS = [
  'Matemática', 'Física', 'Química', 'Biologia', 'História',
  'Geografia', 'Português', 'Inglês', 'Programação', 'Revisão',
  'Redação', 'Filosofia', 'Sociologia', 'Literatura', 'Arte',
  'Intervalo', 'Exercícios', 'Leitura', 'Projetos',
];

const STORAGE_KEYS = {
  weeks:   'nexus_agenda_weeks',
  routine: 'nexus_agenda_routine',
  goals:   'nexus_agenda_goals',
};

export const MIN_WEEKS_BACK = 1;
export const SNAP_MINUTES = 15;
export const MIN_SESSION_MINUTES = 30;

const DEFAULT_ROUTINE = {
  activeDays: [0, 1, 2, 3, 4],
  startHour: '06:00',
  endHour:   '22:00',
  minSessionMinutes: 60,
};

/* ── ESTADO ── */
export const state = {
  currentWeekStart: null,
  weeks: {},
  routine: null,
  goals: [],
  modal:     { context: null, mode: 'new', color: 'blue' },
  goalModal: { goalId: null, linkMode: 'subject', color: 'blue', sessionRefs: [] },
  drag: null,
  plannedDrag: null,
  activeTab: 'agenda', // 'agenda' | 'goals' | 'stats'
};

export let TIMELINE_START_HOUR = 6;
export let TIMELINE_END_HOUR   = 22;
export let TIMELINE_HOURS      = TIMELINE_END_HOUR - TIMELINE_START_HOUR;

export function recalcTimelineBounds() {
  const [sh] = state.routine.startHour.split(':').map(Number);
  const [eh] = state.routine.endHour.split(':').map(Number);
  TIMELINE_START_HOUR = Number.isFinite(sh) ? sh : 6;
  TIMELINE_END_HOUR   = Number.isFinite(eh) ? eh : 22;
  if (TIMELINE_END_HOUR <= TIMELINE_START_HOUR) TIMELINE_END_HOUR = TIMELINE_START_HOUR + 1;
  TIMELINE_HOURS = TIMELINE_END_HOUR - TIMELINE_START_HOUR;
}

/* ── STORAGE ── */
export function loadStorage() {
  try {
    const weeks = localStorage.getItem(STORAGE_KEYS.weeks);
    state.weeks = weeks ? JSON.parse(weeks) : {};
  } catch (_) { state.weeks = {}; }

  try {
    const routine = localStorage.getItem(STORAGE_KEYS.routine);
    state.routine = routine ? { ...DEFAULT_ROUTINE, ...JSON.parse(routine) } : { ...DEFAULT_ROUTINE };
  } catch (_) { state.routine = { ...DEFAULT_ROUTINE }; }

  try {
    const goals = localStorage.getItem(STORAGE_KEYS.goals);
    state.goals = goals ? JSON.parse(goals) : [];
  } catch (_) { state.goals = []; }

  recalcTimelineBounds();
}

export function saveStorage()  { localStorage.setItem(STORAGE_KEYS.weeks, JSON.stringify(state.weeks)); }
export function saveRoutine()  { localStorage.setItem(STORAGE_KEYS.routine, JSON.stringify(state.routine)); }
export function saveGoals()    { localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(state.goals)); }

/* ── HELPERS DE DATA/HORA ── */
export function buildEmptyWeek() { return { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }; }
export function uid() { return Math.random().toString(36).slice(2, 10); }

export function getMondayOf(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* v14 — Conversão pura de EXIBIÇÃO para o campo "Concluir até" (Metas):
   o dado salvo em goal.deadline (state.goals → localStorage) continua
   100% em ISO "AAAA-MM-DD", exatamente como sempre foi — nenhuma
   lógica de metas/salvamento foi tocada. Estas duas funções só convertem
   a string no exato instante em que ela entra/sai do campo de texto
   (ver agenda_pages.js: openGoalEditor/saveGoalFromEditor), para que o
   input mostre "DD/MM/AAAA" ao usuário sem exigir mudança no formato
   persistido. Nenhuma outra tela/campo usa isso. */
export function isoToBR(iso) {
  const v = (iso || '').trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return '';
  return `${m[3]}/${m[2]}/${m[1]}`;
}

export function brToISO(br) {
  const v = (br || '').trim();
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (!m) return '';
  return `${m[3]}-${m[2]}-${m[1]}`;
}

export function formatRange(monday) {
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  return `${monday.getDate()} de ${MONTH_NAMES[monday.getMonth()]} – ${sunday.getDate()} de ${MONTH_NAMES[sunday.getMonth()]} de ${sunday.getFullYear()}`;
}

export function isCurrentWeek(monday) {
  return toISO(monday) === toISO(getMondayOf(new Date()));
}

export function formatWeekLabel(monday) {
  const todayMonday = getMondayOf(new Date());
  const diff = Math.round((monday - todayMonday) / (7 * 86400000));
  if (diff === -1) return 'Semana passada';
  if (diff === 1) return 'Próxima semana';
  if (diff < 0) return `${Math.abs(diff)} semanas atrás`;
  return `${diff} semanas à frente`;
}

export function isPlanned(session) { return !(session.timeStart || session.time); }

export function sortSessions(sessions) {
  return [...sessions].sort((a, b) => (a.timeStart || a.time || '').localeCompare(b.timeStart || b.time || ''));
}

export function sortPlanned(sessions) {
  return [...sessions].sort((a, b) => {
    const ao = Number.isFinite(a.order) ? a.order : Infinity;
    const bo = Number.isFinite(b.order) ? b.order : Infinity;
    return ao - bo;
  });
}

export function forEachSession(callback) {
  Object.keys(state.weeks).forEach(weekKey => {
    const weekData = state.weeks[weekKey];
    Object.keys(weekData).forEach(dayIdx => {
      (weekData[dayIdx] || []).forEach(session => callback(session, weekKey, Number(dayIdx)));
    });
  });
}

export function getAllSessionsFlat() {
  const out = [];
  forEachSession((session, weekKey, dayIdx) => out.push({ session, weekKey, dayIdx }));
  return out;
}

export function findSessionRef(weekKey, dayIdx, sessionId) {
  const dayArr = (state.weeks[weekKey] && state.weeks[weekKey][dayIdx]) || [];
  return dayArr.find(s => s.id === sessionId) || null;
}

export function timeToMinutes(t) {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function minutesToTime(mins) {
  mins = Math.max(0, Math.round(mins));
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function snapMinutes(mins) { return Math.round(mins / SNAP_MINUTES) * SNAP_MINUTES; }

export function getHourHeight() {
  const el = document.querySelector('.agenda-module');
  const val = el ? getComputedStyle(el).getPropertyValue('--ag-hour-h').trim() : '';
  return parseFloat(val) || 72;
}
export function getTopPadding() { return getHourHeight() / 2; }

export function timeToOffset(t) {
  const minutes = timeToMinutes(t) - TIMELINE_START_HOUR * 60;
  return (minutes / 60) * getHourHeight() + getTopPadding();
}
export function offsetToMinutes(offsetPx) {
  return ((offsetPx - getTopPadding()) / getHourHeight()) * 60 + TIMELINE_START_HOUR * 60;
}

export function getWeekData(monday) {
  const key = toISO(monday);
  if (!state.weeks[key]) { state.weeks[key] = buildEmptyWeek(); saveStorage(); }
  return state.weeks[key];
}
export function getWeekKey() { return toISO(state.currentWeekStart); }

export function findConflicts(weekKey, dayIdx, timeStart, timeEnd, excludeId) {
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

export function getSession(weekKey, dayIdx, sessionId) {
  return (state.weeks[weekKey]?.[dayIdx] || []).find(s => s.id === sessionId) || {};
}

export function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── TOAST (usado por interactions/pages) ── */
let _toastTimer = null;
export function showToast(msg) {
  const el = document.getElementById('agenda-toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

/* ── TEMPLATE HTML — substitui o antigo calendar.html
   (sem <html>/<body>/app-shell/sidebar própria) ── */
const TEMPLATE_HTML = `
<div class="agenda-module">

  <div class="agenda-toolbar">
    <div class="agenda-tabs" id="agenda-tabs">
      <button class="agenda-tab active" data-tab="agenda" type="button">📅 Agenda</button>
      <button class="agenda-tab" data-tab="goals" type="button">🎯 Metas</button>
      <button class="agenda-tab" data-tab="stats" type="button">📊 Estatísticas</button>
    </div>
    <div class="agenda-toolbar-actions">
      <button class="agenda-btn-ghost" id="agenda-btn-routine" type="button">⚙ Rotina de estudos</button>
      <button class="agenda-btn-primary" id="agenda-btn-new" type="button">➕ Novo estudo</button>
    </div>
  </div>

  <!-- PÁGINA: Agenda -->
  <div class="agenda-page active" id="agenda-page-week">
    <header class="agenda-week-nav">
      <button class="agenda-week-arrow" id="agenda-btn-prev" aria-label="Semana anterior" type="button">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button class="agenda-week-title-btn" id="agenda-week-title-btn" type="button">
        <h2 class="agenda-week-title" id="agenda-week-title">Semana atual</h2>
        <span class="agenda-week-range" id="agenda-week-range"></span>
      </button>
      <button class="agenda-week-arrow" id="agenda-btn-next" aria-label="Próxima semana" type="button">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="agenda-week-menu-wrap">
        <button class="agenda-week-menu-btn" id="agenda-week-menu-btn" aria-label="Ações da semana" type="button">⋮</button>
        <div class="agenda-week-menu" id="agenda-week-menu">
          <button class="agenda-week-menu-item" id="agenda-action-copy-prev-week" type="button">Copiar semana anterior</button>
          <button class="agenda-week-menu-item agenda-week-menu-item-danger" id="agenda-action-clear-week" type="button">Limpar semana</button>
        </div>
      </div>
    </header>

    <div class="agenda-calendar-grid" id="agenda-calendar-grid"></div>
  </div>

  <!-- PÁGINA: Metas -->
  <div class="agenda-page" id="agenda-page-goals">
    <div class="agenda-goals-list" id="agenda-goals-list"></div>
    <button class="agenda-btn-add-goal" id="agenda-btn-new-goal" type="button">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      Nova meta
    </button>

    <div class="agenda-goal-editor" id="agenda-goal-editor" style="display:none">
      <div class="agenda-form-group">
        <label class="agenda-form-label" for="agenda-goal-title">Título</label>
        <input class="agenda-input" type="text" id="agenda-goal-title" placeholder="Ex: Finalizar módulo de Java" />
      </div>
      <div class="agenda-form-group">
        <label class="agenda-form-label" for="agenda-goal-description">Descrição <span class="agenda-optional">(opcional)</span></label>
        <textarea class="agenda-input agenda-textarea" id="agenda-goal-description" rows="2" placeholder="Detalhes da meta…"></textarea>
      </div>
      <div class="agenda-form-row">
        <div class="agenda-form-group">
          <label class="agenda-form-label" for="agenda-goal-period">Período</label>
          <select class="agenda-input agenda-select" id="agenda-goal-period">
            <option value="week">Esta semana</option>
            <option value="custom">Período personalizado</option>
            <option value="open">Sem prazo definido</option>
          </select>
        </div>
        <div class="agenda-form-group" id="agenda-goal-deadline-group" style="display:none">
          <label class="agenda-form-label" for="agenda-goal-deadline">Concluir até</label>
          <input class="agenda-input" type="text" id="agenda-goal-deadline" placeholder="DD/MM/AAAA" autocomplete="off" inputmode="numeric" />
          <span class="agenda-field-hint" id="agenda-goal-deadline-hint" style="display:none"></span>
        </div>
      </div>
      <div class="agenda-form-group">
        <label class="agenda-form-label">Acompanhamento de progresso</label>
        <div class="agenda-goal-link-options" id="agenda-goal-link-options">
          <button type="button" class="agenda-goal-link-opt active" data-mode="subject">Automático por conteúdo</button>
          <button type="button" class="agenda-goal-link-opt" data-mode="manual">Estudos específicos</button>
          <button type="button" class="agenda-goal-link-opt" data-mode="none">Progresso manual</button>
        </div>
      </div>
      <div class="agenda-form-group" id="agenda-goal-subject-group">
        <label class="agenda-form-label" for="agenda-goal-subject">Conteúdo vinculado</label>
        <div style="position:relative">
          <input class="agenda-input" type="text" id="agenda-goal-subject" placeholder="Ex: Java, SQL, Git…" autocomplete="off" />
          <div class="agenda-subject-suggestions" id="agenda-goal-subject-suggestions"></div>
        </div>
        <p class="agenda-field-hint">O progresso conta estudos concluídos com esse conteúdo.</p>
      </div>
      <div class="agenda-form-group" id="agenda-goal-sessions-group" style="display:none">
        <label class="agenda-form-label">Estudos vinculados</label>
        <div class="agenda-goal-session-picker" id="agenda-goal-session-picker"></div>
      </div>
      <div class="agenda-form-group" id="agenda-goal-manual-group" style="display:none">
        <label class="agenda-form-label" for="agenda-goal-manual-progress">Progresso manual: <span id="agenda-goal-manual-progress-value">0%</span></label>
        <input type="range" id="agenda-goal-manual-progress" min="0" max="100" step="5" value="0" class="agenda-progress-slider" />
      </div>
      <div class="agenda-form-group">
        <label class="agenda-form-label">Cor</label>
        <div class="agenda-color-options" id="agenda-goal-color-options">
          <button class="agenda-color-dot active" data-color="blue" style="--c:#4FA8E8"></button>
          <button class="agenda-color-dot" data-color="purple" style="--c:#6C63FF"></button>
          <button class="agenda-color-dot" data-color="green" style="--c:#3DDC84"></button>
          <button class="agenda-color-dot" data-color="amber" style="--c:#FFB547"></button>
          <button class="agenda-color-dot" data-color="rose" style="--c:#FF5C6A"></button>
          <button class="agenda-color-dot" data-color="teal" style="--c:#2DD4BF"></button>
        </div>
      </div>
      <div class="agenda-goal-editor-actions">
        <button class="agenda-btn-danger" id="agenda-btn-goal-delete" style="display:none" type="button">Excluir meta</button>
        <div class="agenda-modal-footer-right">
          <button class="agenda-btn-cancel" id="agenda-btn-goal-cancel" type="button">Cancelar</button>
          <button class="agenda-btn-save" id="agenda-btn-goal-save" type="button">Salvar meta</button>
        </div>
      </div>
    </div>
  </div>

  <!-- PÁGINA: Estatísticas -->
  <div class="agenda-page" id="agenda-page-stats">
    <div id="agenda-stats-body"></div>
  </div>

  <!-- MODAL: Novo/Editar estudo -->
  <div class="agenda-modal-overlay" id="agenda-modal-session" aria-hidden="true">
    <div class="agenda-modal" role="dialog" aria-modal="true">
      <div class="agenda-modal-header">
        <h2 class="agenda-modal-title" id="agenda-modal-title">Novo estudo</h2>
        <button class="agenda-modal-close" id="agenda-modal-close" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
      <div class="agenda-modal-body">
        <div class="agenda-form-group">
          <label class="agenda-form-label" for="agenda-input-day">Dia da semana</label>
          <select class="agenda-input agenda-select" id="agenda-input-day"></select>
        </div>
        <div class="agenda-form-row">
          <div class="agenda-form-group">
            <label class="agenda-form-label" for="agenda-input-time">Hora inicial <span class="agenda-optional">(opcional)</span></label>
            <input class="agenda-input" type="text" id="agenda-input-time" placeholder="--:--" autocomplete="off" inputmode="numeric" />
          </div>
          <div class="agenda-form-group">
            <label class="agenda-form-label" for="agenda-input-time-end">Hora final <span class="agenda-optional">(opcional)</span></label>
            <input class="agenda-input" type="text" id="agenda-input-time-end" placeholder="--:--" autocomplete="off" inputmode="numeric" />
          </div>
        </div>
        <p class="agenda-field-hint" id="agenda-duration-hint" style="display:none"></p>
        <p class="agenda-field-hint">Deixe os horários em branco (Backspace no campo) para criar um estudo planejado.</p>
        <div class="agenda-form-group">
          <label class="agenda-form-label" for="agenda-input-subject">Conteúdo</label>
          <div style="position:relative">
            <input class="agenda-input" type="text" id="agenda-input-subject" placeholder="Ex: Matemática, Física…" autocomplete="off" />
            <div class="agenda-subject-suggestions" id="agenda-subject-suggestions"></div>
          </div>
        </div>
        <div class="agenda-form-group">
          <label class="agenda-form-label" for="agenda-input-note">Observação <span class="agenda-optional">(opcional)</span></label>
          <textarea class="agenda-input agenda-textarea" id="agenda-input-note" rows="3" placeholder="Capítulo, exercícios, revisão…"></textarea>
        </div>
        <div class="agenda-form-group">
          <label class="agenda-form-label">Cor do cartão</label>
          <div class="agenda-color-options" id="agenda-color-options">
            <button class="agenda-color-dot active" data-color="blue" style="--c:#4FA8E8"></button>
            <button class="agenda-color-dot" data-color="purple" style="--c:#6C63FF"></button>
            <button class="agenda-color-dot" data-color="green" style="--c:#3DDC84"></button>
            <button class="agenda-color-dot" data-color="amber" style="--c:#FFB547"></button>
            <button class="agenda-color-dot" data-color="rose" style="--c:#FF5C6A"></button>
            <button class="agenda-color-dot" data-color="teal" style="--c:#2DD4BF"></button>
          </div>
        </div>
      </div>
      <div class="agenda-modal-footer">
        <button class="agenda-btn-danger" id="agenda-btn-delete" style="display:none" type="button">Excluir</button>
        <div class="agenda-modal-footer-right">
          <button class="agenda-btn-cancel" id="agenda-btn-cancel" type="button">Cancelar</button>
          <button class="agenda-btn-save" id="agenda-btn-save" type="button">Salvar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL: Rotina de estudos -->
  <div class="agenda-modal-overlay" id="agenda-modal-routine" aria-hidden="true">
    <div class="agenda-modal" role="dialog" aria-modal="true">
      <div class="agenda-modal-header">
        <div>
          <h2 class="agenda-modal-title">Rotina de estudos</h2>
          <p class="agenda-modal-subtitle">Define os dias e o intervalo de horas exibidos na agenda</p>
        </div>
        <button class="agenda-modal-close" id="agenda-modal-routine-close" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
      <div class="agenda-modal-body">
        <div class="agenda-form-group">
          <label class="agenda-form-label">Dias ativos</label>
          <div class="agenda-day-toggle-row" id="agenda-routine-days">
            <label class="agenda-day-toggle"><input type="checkbox" data-day="0" checked /><span>Seg</span></label>
            <label class="agenda-day-toggle"><input type="checkbox" data-day="1" checked /><span>Ter</span></label>
            <label class="agenda-day-toggle"><input type="checkbox" data-day="2" checked /><span>Qua</span></label>
            <label class="agenda-day-toggle"><input type="checkbox" data-day="3" checked /><span>Qui</span></label>
            <label class="agenda-day-toggle"><input type="checkbox" data-day="4" checked /><span>Sex</span></label>
            <label class="agenda-day-toggle"><input type="checkbox" data-day="5" /><span>Sáb</span></label>
            <label class="agenda-day-toggle"><input type="checkbox" data-day="6" /><span>Dom</span></label>
          </div>
        </div>
        <div class="agenda-form-row">
          <div class="agenda-form-group">
            <label class="agenda-form-label" for="agenda-routine-start">Horário inicial</label>
            <input class="agenda-input" type="text" id="agenda-routine-start" value="06:00" autocomplete="off" inputmode="numeric" />
          </div>
          <div class="agenda-form-group">
            <label class="agenda-form-label" for="agenda-routine-end">Horário final</label>
            <input class="agenda-input" type="text" id="agenda-routine-end" value="22:00" autocomplete="off" inputmode="numeric" />
          </div>
        </div>
        <div class="agenda-form-group">
          <label class="agenda-form-label" for="agenda-routine-min-session">Tempo mínimo por sessão</label>
          <select class="agenda-input agenda-select" id="agenda-routine-min-session">
            <option value="30">30 minutos</option>
            <option value="45">45 minutos</option>
            <option value="60" selected>1 hora</option>
            <option value="120">2 horas</option>
          </select>
        </div>
      </div>
      <div class="agenda-modal-footer">
        <div class="agenda-modal-footer-right">
          <button class="agenda-btn-cancel" id="agenda-btn-routine-cancel" type="button">Cancelar</button>
          <button class="agenda-btn-save" id="agenda-btn-routine-save" type="button">Salvar rotina</button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL: Confirmação -->
  <div class="agenda-modal-overlay" id="agenda-modal-confirm" aria-hidden="true">
    <div class="agenda-modal agenda-modal-confirm" role="alertdialog" aria-modal="true">
      <div class="agenda-modal-body agenda-confirm-body">
        <h2 class="agenda-confirm-title" id="agenda-confirm-title">Confirmar ação</h2>
        <p class="agenda-confirm-message" id="agenda-confirm-message"></p>
      </div>
      <div class="agenda-modal-footer">
        <div class="agenda-modal-footer-right">
          <button class="agenda-btn-cancel" id="agenda-confirm-btn-cancel" type="button">Cancelar</button>
          <button class="agenda-btn-save" id="agenda-confirm-btn-ok" type="button">Confirmar</button>
        </div>
      </div>
    </div>
  </div>

  <div class="agenda-toast" id="agenda-toast"></div>
</div>
`;

/* ── API PÚBLICA DO MÓDULO ── */
let _aberta = false;
let _construida = false;

export function agendaEstaAberta() { return _aberta; }

/* Persiste a semana visível + a aba ativa. Chamado por
   agenda_interactions.js sempre que qualquer uma das duas muda
   (navegar de semana, "Hoje", trocar de aba) — ver navigateWeek(),
   goToToday() e switchTab() em agenda_interactions.js. */
export function persistirEstadoUIAgenda() {
  UIState.setState(_CHAVE_ESTADO_UI, {
    currentWeekStartISO: toISO(state.currentWeekStart),
    activeTab: state.activeTab,
  });
}

export function fecharAgenda() {
  _aberta = false;
  const menu = document.getElementById('agenda-week-menu');
  if (menu) menu.classList.remove('open');
}

export async function abrirAgenda(containerEl) {
  if (!containerEl) return;
  _aberta = true;

  if (!_construida) {
    containerEl.innerHTML = TEMPLATE_HTML;
    loadStorage();

    /* Restaura a semana e a aba da última visita (inclusive depois
       de um F5) — sem isso, a Agenda sempre reabria na semana atual
       e na aba "Agenda", perdendo o contexto de navegação. */
    const estadoSalvo = UIState.getState(_CHAVE_ESTADO_UI, { currentWeekStartISO: null, activeTab: 'agenda' });
    state.currentWeekStart = estadoSalvo.currentWeekStartISO
      ? getMondayOf(new Date(estadoSalvo.currentWeekStartISO))
      : getMondayOf(new Date());
    state.activeTab = ['agenda', 'goals', 'stats'].includes(estadoSalvo.activeTab) ? estadoSalvo.activeTab : 'agenda';

    initAgendaEventListeners();
    _construida = true;
  } else {
    loadStorage();
  }

  renderCalendar();

  /* Sincroniza a aba visível (classes .active dos 3 painéis + botões
     de aba) com state.activeTab — importante sobretudo na primeira
     montagem, quando a aba pode ter sido restaurada de uma sessão
     anterior (F5) e não é mais o "agenda" estático do TEMPLATE_HTML. */
  switchTab(state.activeTab);
}