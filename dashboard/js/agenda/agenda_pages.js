/* dashboard\js\agenda\agenda_pages.js
   proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   Páginas "Metas" e "Estatísticas" do módulo Agenda — antes
   modais/páginas isoladas do calendar.js original, agora abas
   internas do módulo (ver .agenda-tabs em agenda.js/agenda.css).
   Cálculos de progresso/estatística preservados 1:1.
   ============================================= */

import {
  state, DAY_SHORT, MONTH_NAMES, uid,
  getWeekKey, isCurrentWeek, formatRange, getAllSessionsFlat,
  findSessionRef, forEachSession, isPlanned, timeToMinutes, toISO,
  saveGoals, showToast, escHtml,
} from './agenda.js';

import { confirmDialog } from './agenda_interactions.js';

/* ══════════════════ METAS ══════════════════ */
function createEmptyGoalDraft() {
  return {
    id: null, title: '', description: '', period: 'week', deadline: '',
    weekKey: getWeekKey(), linkMode: 'subject', subject: '', sessionRefs: [],
    manualProgress: 0, color: 'blue', status: 'active', createdAt: toISO(new Date()),
  };
}

function sessionMatchesSubject(session, subject) {
  if (!subject) return false;
  return (session.subject || '').trim().toLowerCase() === subject.trim().toLowerCase();
}

function computeGoalProgress(goal) {
  if (goal.linkMode === 'none') {
    return { percent: Math.max(0, Math.min(100, Number(goal.manualProgress) || 0)), total: 0, done: 0 };
  }
  if (goal.linkMode === 'subject') {
    let total = 0, done = 0;
    forEachSession((session) => {
      if (!sessionMatchesSubject(session, goal.subject)) return;
      total++;
      if (session.status === 'done') done++;
    });
    if (!total) return { percent: 0, total: 0, done: 0 };
    return { percent: Math.round((done / total) * 100), total, done };
  }
  const refs = goal.sessionRefs || [];
  let total = 0, done = 0;
  refs.forEach(ref => {
    const session = findSessionRef(ref.weekKey, ref.dayIdx, ref.sessionId);
    if (!session) return;
    total++;
    if (session.status === 'done') done++;
  });
  if (!total) return { percent: 0, total: 0, done: 0 };
  return { percent: Math.round((done / total) * 100), total, done };
}

function formatGoalDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y) return iso;
  return `${d} de ${MONTH_NAMES[m - 1]}`;
}

export function openGoalsView() {
  renderGoalsList();
  closeGoalEditor();
}

export function renderGoalsList() {
  const list = document.getElementById('agenda-goals-list');
  if (!list) return;
  list.innerHTML = '';

  if (!state.goals.length) {
    const empty = document.createElement('p');
    empty.className = 'agenda-goals-empty';
    empty.textContent = 'Nenhuma meta ainda. Crie a primeira para acompanhar um objetivo maior, como finalizar um módulo ou revisar um tema durante a semana.';
    list.appendChild(empty);
    return;
  }

  const sorted = [...state.goals].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'done' ? 1 : -1;
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });

  sorted.forEach(goal => {
    const { percent, total, done } = computeGoalProgress(goal);
    const card = document.createElement('div');
    card.className = 'agenda-goal-card' + (goal.status === 'done' ? ' is-done' : '');
    card.dataset.color = goal.color || 'blue';

    const periodLabel = goal.period === 'week' ? 'Esta semana'
      : goal.period === 'custom' ? (goal.deadline ? `Até ${formatGoalDate(goal.deadline)}` : 'Período personalizado')
      : 'Sem prazo definido';

    const linkLabel = goal.linkMode === 'subject' ? `Automático · conteúdo "${escHtml(goal.subject || '—')}"`
      : goal.linkMode === 'manual' ? `${total} estudo${total === 1 ? '' : 's'} vinculado${total === 1 ? '' : 's'}`
      : 'Progresso manual';

    card.innerHTML = `
      <div class="agenda-goal-top">
        <div>
          <h3 class="agenda-goal-title">${escHtml(goal.title)}</h3>
          <span class="agenda-goal-meta">${escHtml(periodLabel)} · ${linkLabel}</span>
        </div>
        <button type="button" class="agenda-goal-done-btn">${goal.status === 'done' ? '✓' : ''}</button>
      </div>
      ${goal.description ? `<p class="agenda-goal-desc">${escHtml(goal.description)}</p>` : ''}
      <div class="agenda-goal-progress-bar"><div class="agenda-goal-progress-fill" style="width:${percent}%"></div></div>
      <div class="agenda-goal-progress-label">${percent}%${goal.linkMode !== 'none' ? (total ? ` · ${done}/${total} concluído${total === 1 ? '' : 's'}` : ' · nenhum estudo vinculado ainda') : ''}</div>
    `;

    card.addEventListener('click', (e) => { if (!e.target.closest('.agenda-goal-done-btn')) openGoalEditor(goal.id); });
    card.querySelector('.agenda-goal-done-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      goal.status = goal.status === 'done' ? 'active' : 'done';
      saveGoals();
      renderGoalsList();
      showToast(goal.status === 'done' ? 'Meta concluída.' : 'Meta reaberta.');
    });

    list.appendChild(card);
  });
}

export function openGoalEditor(goalId) {
  const isEdit = !!goalId;
  const goal = isEdit ? state.goals.find(g => g.id === goalId) : createEmptyGoalDraft();
  if (isEdit && !goal) return;

  state.goalModal = { goalId: isEdit ? goalId : null, linkMode: goal.linkMode, color: goal.color, sessionRefs: isEdit ? [...(goal.sessionRefs || [])] : [] };

  document.getElementById('agenda-goal-title').value = goal.title || '';
  document.getElementById('agenda-goal-description').value = goal.description || '';
  document.getElementById('agenda-goal-period').value = goal.period || 'week';
  document.getElementById('agenda-goal-deadline').value = goal.deadline || '';
  document.getElementById('agenda-goal-deadline-group').style.display = goal.period === 'custom' ? '' : 'none';
  document.getElementById('agenda-goal-subject').value = goal.subject || '';
  document.getElementById('agenda-goal-manual-progress').value = String(goal.manualProgress || 0);
  document.getElementById('agenda-goal-manual-progress-value').textContent = `${goal.manualProgress || 0}%`;

  document.querySelectorAll('#agenda-goal-color-options .agenda-color-dot').forEach(dot => dot.classList.toggle('active', dot.dataset.color === (goal.color || 'blue')));
  setGoalLinkMode(goal.linkMode || 'subject');
  renderGoalSessionPicker();

  document.getElementById('agenda-btn-goal-delete').style.display = isEdit ? 'inline-flex' : 'none';
  document.getElementById('agenda-goal-editor').style.display = 'flex';
  document.getElementById('agenda-btn-new-goal').style.display = 'none';
  document.getElementById('agenda-goals-list').style.display = 'none';

  setTimeout(() => document.getElementById('agenda-goal-title').focus(), 50);
}

export function closeGoalEditor() {
  const editor = document.getElementById('agenda-goal-editor');
  if (!editor) return;
  editor.style.display = 'none';
  document.getElementById('agenda-btn-new-goal').style.display = '';
  document.getElementById('agenda-goals-list').style.display = '';
  document.getElementById('agenda-goal-subject-suggestions').classList.remove('visible');
}

export function setGoalLinkMode(mode) {
  state.goalModal.linkMode = mode;
  document.querySelectorAll('#agenda-goal-link-options .agenda-goal-link-opt').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
  document.getElementById('agenda-goal-subject-group').style.display = mode === 'subject' ? '' : 'none';
  document.getElementById('agenda-goal-sessions-group').style.display = mode === 'manual' ? '' : 'none';
  document.getElementById('agenda-goal-manual-group').style.display = mode === 'none' ? '' : 'none';
  if (mode === 'manual') renderGoalSessionPicker();
}

function renderGoalSessionPicker() {
  const picker = document.getElementById('agenda-goal-session-picker');
  picker.innerHTML = '';
  const allSessions = getAllSessionsFlat()
    .sort((a, b) => (b.weekKey + (a.session.timeStart || a.session.time || '')).localeCompare(a.weekKey + (b.session.timeStart || b.session.time || '')));

  if (!allSessions.length) {
    picker.innerHTML = '<p class="agenda-field-hint">Nenhum estudo criado ainda.</p>';
    return;
  }

  const selectedIds = new Set(state.goalModal.sessionRefs.map(r => r.sessionId));
  allSessions.slice(0, 60).forEach(({ session, weekKey, dayIdx }) => {
    const row = document.createElement('label');
    row.className = 'agenda-goal-session-row';
    const isChecked = selectedIds.has(session.id);
    const timeLabel = isPlanned(session) ? 'Planejado' : (session.timeStart || session.time || '');
    row.innerHTML = `
      <input type="checkbox" ${isChecked ? 'checked' : ''} />
      <span class="agenda-goal-session-subject">${escHtml(session.subject)}</span>
      <span class="agenda-goal-session-meta">${DAY_SHORT[dayIdx]} · ${escHtml(timeLabel)}${session.status === 'done' ? ' · ✓' : ''}</span>
    `;
    row.querySelector('input').addEventListener('change', (e) => {
      const refs = state.goalModal.sessionRefs;
      const idx = refs.findIndex(r => r.sessionId === session.id);
      if (e.target.checked && idx < 0) refs.push({ weekKey, dayIdx, sessionId: session.id });
      else if (!e.target.checked && idx >= 0) refs.splice(idx, 1);
    });
    picker.appendChild(row);
  });
}

export function saveGoalFromEditor() {
  const title = document.getElementById('agenda-goal-title').value.trim();
  if (!title) return showToast('Dê um título para a meta.');

  const description = document.getElementById('agenda-goal-description').value.trim();
  const period = document.getElementById('agenda-goal-period').value;
  const deadline = document.getElementById('agenda-goal-deadline').value;
  const linkMode = state.goalModal.linkMode;
  const subject = document.getElementById('agenda-goal-subject').value.trim();
  const manualProgress = Number(document.getElementById('agenda-goal-manual-progress').value) || 0;
  const color = state.goalModal.color;

  if (period === 'custom' && !deadline) return showToast('Defina uma data ou escolha outro período.');
  if (linkMode === 'subject' && !subject) return showToast('Informe o conteúdo a ser acompanhado.');

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

  if (!isEdit) { goal.id = uid(); state.goals.push(goal); }

  saveGoals();
  renderGoalsList();
  closeGoalEditor();
  showToast(isEdit ? 'Meta atualizada.' : 'Meta criada.');
}

export async function deleteGoalFromEditor() {
  const { goalId } = state.goalModal;
  if (!goalId) return;
  const proceed = await confirmDialog('Excluir esta meta? Os estudos vinculados não serão afetados.', { title: 'Excluir meta', confirmLabel: 'Excluir', danger: true });
  if (!proceed) return;
  state.goals = state.goals.filter(g => g.id !== goalId);
  saveGoals();
  renderGoalsList();
  closeGoalEditor();
  showToast('Meta excluída.');
}

/* ══════════════════ ESTATÍSTICAS ══════════════════ */
function computeGlobalStats() {
  let totalSessions = 0, doneSessions = 0, plannedCount = 0, scheduledCount = 0, totalMinutesDone = 0;
  const bySubject = {};
  const weekTotals = {};

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

  let bestWeek = null;
  Object.keys(weekTotals).forEach(wk => { if (!bestWeek || weekTotals[wk].done > weekTotals[bestWeek].done) bestWeek = wk; });

  const topSubjects = Object.entries(bySubject)
    .map(([subject, v]) => ({ subject, ...v, percent: v.total ? Math.round((v.done / v.total) * 100) : 0 }))
    .sort((a, b) => b.done - a.done)
    .slice(0, 5);

  const streak = computeCompletionStreak();
  const goalsActive = state.goals.filter(g => g.status === 'active');
  const goalsDone = state.goals.filter(g => g.status === 'done');
  const goalsAvgPercent = goalsActive.length
    ? Math.round(goalsActive.reduce((sum, g) => sum + computeGoalProgress(g).percent, 0) / goalsActive.length)
    : 0;

  return {
    totalSessions, doneSessions, plannedCount, scheduledCount, completionPercent, totalMinutesDone,
    bestWeek, bestWeekDone: bestWeek ? weekTotals[bestWeek].done : 0, topSubjects, streak,
    goalsActiveCount: goalsActive.length, goalsDoneCount: goalsDone.length, goalsAvgPercent,
  };
}

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

  if (!doneDates.size) return 0;
  let streak = 0;
  let cursor = new Date();
  if (!doneDates.has(toISO(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (doneDates.has(toISO(cursor))) { streak++; cursor.setDate(cursor.getDate() - 1); }
  return streak;
}

function formatHoursLabel(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (!h) return `${m} min`;
  if (!m) return `${h}h`;
  return `${h}h ${m}min`;
}

export function renderStats() {
  const body = document.getElementById('agenda-stats-body');
  if (!body) return;
  const s = computeGlobalStats();

  if (!s.totalSessions) {
    body.innerHTML = `<p class="agenda-goals-empty">Ainda não há estudos suficientes para gerar estatísticas. Adicione estudos na agenda e volte aqui para acompanhar sua evolução.</p>`;
    return;
  }

  const metricCard = (label, value, sub) => `
    <div class="agenda-stat-card">
      <div class="agenda-stat-value">${value}</div>
      <div class="agenda-stat-label">${label}</div>
      ${sub ? `<div class="agenda-stat-sub">${sub}</div>` : ''}
    </div>`;

  const bestWeekLabel = s.bestWeek
    ? (isCurrentWeek(new Date(s.bestWeek + 'T00:00:00')) ? 'Esta semana' : formatRange(new Date(s.bestWeek + 'T00:00:00')))
    : '—';

  body.innerHTML = `
    <div class="agenda-stats-grid">
      ${metricCard('Estudos concluídos', `${s.doneSessions}`, `de ${s.totalSessions} criados`)}
      ${metricCard('Conclusão geral', `${s.completionPercent}%`, `${s.plannedCount} planejados · ${s.scheduledCount} agendados`)}
      ${metricCard('Tempo estudado', formatHoursLabel(s.totalMinutesDone), 'estudos agendados concluídos')}
      ${metricCard('Sequência atual', `${s.streak} dia${s.streak === 1 ? '' : 's'}`, 'com estudos concluídos')}
      ${metricCard('Semana mais produtiva', bestWeekLabel, s.bestWeek ? `${s.bestWeekDone} concluído${s.bestWeekDone === 1 ? '' : 's'}` : '')}
      ${metricCard('Metas', `${s.goalsAvgPercent}%`, `${s.goalsActiveCount} ativa${s.goalsActiveCount === 1 ? '' : 's'} · ${s.goalsDoneCount} concluída${s.goalsDoneCount === 1 ? '' : 's'}`)}
    </div>
    <div class="agenda-stats-section">
      <h3 class="agenda-stats-section-title">Conteúdos com mais estudos concluídos</h3>
      ${s.topSubjects.length ? s.topSubjects.map(t => `
        <div class="agenda-stats-subject-row">
          <span class="agenda-stats-subject-name">${escHtml(t.subject)}</span>
          <div class="agenda-stats-subject-bar"><div class="agenda-stats-subject-fill" style="width:${t.percent}%"></div></div>
          <span class="agenda-stats-subject-count">${t.done}/${t.total}</span>
        </div>`).join('') : '<p class="agenda-field-hint">Sem dados suficientes ainda.</p>'}
    </div>
  `;
}