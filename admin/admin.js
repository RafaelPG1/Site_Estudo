/* =============================================
   NEXUS STUDY — admin.js
   Painel de Administração
   admin/admin.js
   ============================================= */

import {
  getUsuario, estaLogado,
} from '../src/global.js';

import {
  getUsuarios,
  criarUsuario,
  removerUsuario,
  resetarPin,
  hashPin,
  limparTodoQuizUsuario,
  logout,
  getDb,
} from '../src/firebase.js';

import {
  collection, getDocs, deleteDoc, doc, setDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

/* ══════════════════════════════════════════════════════════
   CONSTANTES
   ══════════════════════════════════════════════════════════ */

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard',  icon: iconDashboard() },
  { id: 'users',     label: 'Usuários',   icon: iconUsers()     },
  { id: 'progress',  label: 'Progresso',  icon: iconProgress()  },
  { id: 'ranking',   label: 'Ranking',    icon: iconRanking()   },
];

const AVATARS = ['🎓','🧑‍💻','👾','🦊','🐉','🌙','⚡','🔥','🎯','🧠','🚀','🦁'];

/* ══════════════════════════════════════════════════════════
   ESTADO
   ══════════════════════════════════════════════════════════ */

let _secaoAtual = 'dashboard';
let _usuarios   = [];

/* ══════════════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  const u = getUsuario();
  if (!u || !u.admin) {
    document.getElementById('content').innerHTML = `
      <div class="init-loading">
        <p style="color:var(--rose)">⛔ Acesso negado. Faça login como administrador.</p>
        <a href="../index.html" class="action-btn action-btn--ghost" style="margin-top:1rem">← Voltar</a>
      </div>`;
    return;
  }

  _montarSidebar(u);
  _bindSidebar();
  _bindTopbar();
  await _navegarPara('dashboard');
});

/* ══════════════════════════════════════════════════════════
   SIDEBAR
   ══════════════════════════════════════════════════════════ */

function _montarSidebar(u) {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = SECTIONS.map(s => `
    <button class="nav-item ${s.id === _secaoAtual ? 'active' : ''}" data-section="${s.id}">
      ${s.icon} ${s.label}
    </button>
  `).join('');

  document.getElementById('sidebar-user').innerHTML = `
    <div class="su-avatar">${u.foto ? `<img src="${u.foto}" alt="">` : u.avatar ?? '🛡️'}</div>
    <div class="su-info">
      <strong>${u.nome}</strong>
      <span>Admin</span>
    </div>`;

  document.getElementById('btn-logout').addEventListener('click', () => {
    logout();
    window.location.href = '../index.html';
  });
}

function _bindSidebar() {
  document.getElementById('sidebar-nav').addEventListener('click', async e => {
    const btn = e.target.closest('.nav-item');
    if (!btn) return;
    await _navegarPara(btn.dataset.section);
  });
}

function _bindTopbar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  document.getElementById('btn-hamburger').addEventListener('click', () => {
    sidebar.classList.toggle('sidebar--open');
    overlay.classList.toggle('overlay--show');
  });
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('sidebar--open');
    overlay.classList.remove('overlay--show');
  });

  document.getElementById('btn-refresh').addEventListener('click', async () => {
    _usuarios = [];
    await _navegarPara(_secaoAtual);
  });
}

/* ══════════════════════════════════════════════════════════
   NAVEGAÇÃO
   ══════════════════════════════════════════════════════════ */

async function _navegarPara(secao) {
  _secaoAtual = secao;

  document.querySelectorAll('.nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.section === secao);
  });

  const s = SECTIONS.find(x => x.id === secao);
  document.getElementById('topbar-title').textContent = s?.label ?? secao;

  document.getElementById('sidebar').classList.remove('sidebar--open');
  document.getElementById('sidebar-overlay').classList.remove('overlay--show');

  const content = document.getElementById('content');
  content.innerHTML = `<div class="init-loading"><div class="spinner"></div><p>Carregando…</p></div>`;

  switch (secao) {
    case 'dashboard': await _renderDashboard(); break;
    case 'users':     await _renderUsers();     break;
    case 'progress':  await _renderProgress();  break;
    case 'ranking':   await _renderRanking();   break;
    default:
      content.innerHTML = `<div class="empty-state">Seção em desenvolvimento 🚧</div>`;
  }
}

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */

async function _getUsuarios(force = false) {
  if (!force && _usuarios.length) return _usuarios;
  _usuarios = await getUsuarios();
  return _usuarios;
}

/* ══════════════════════════════════════════════════════════
   REMOVER USUÁRIO — apaga doc principal + subcoleções
   ══════════════════════════════════════════════════════════ */

async function _removerUsuarioCompleto(uid) {
  try {
    const db = getDb();

    // Lista de TODAS as subcoleções conhecidas do usuário
    const SUBCOLLECTIONS = ['quiz_respostas', 'srs_perfis'];

    // Apaga cada subcoleção conhecida
    for (const subCol of SUBCOLLECTIONS) {
      const colRef = collection(db, 'usuarios', uid, subCol);
      const snap   = await getDocs(colRef);
      if (!snap.empty) {
        await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
        console.log(`[admin] Subcoleção "${subCol}" apagada (${snap.size} docs) → ${uid}`);
      }
    }

    // Apaga o documento principal POR ÚLTIMO
    await deleteDoc(doc(db, 'usuarios', uid));

    console.log('[admin] _removerUsuarioCompleto ok →', uid);
    return { ok: true };
  } catch (err) {
    console.error('[admin] _removerUsuarioCompleto erro:', err);
    return { ok: false, erro: err.message };
  }
}

/* ══════════════════════════════════════════════════════════
   SEÇÃO — DASHBOARD
   ══════════════════════════════════════════════════════════ */

async function _renderDashboard() {
  const users  = await _getUsuarios();
  const admins = users.filter(u => u.admin);

  document.getElementById('content').innerHTML = `
    <div class="section-content">
      <div class="stat-grid">
        <div class="stat-card stat-card--teal">
          <div class="stat-card__icon">👥</div>
          <div class="stat-card__val">${users.length}</div>
          <div class="stat-card__label">Usuários</div>
          <div class="stat-card__sub">${admins.length} admin${admins.length !== 1 ? 's' : ''}</div>
        </div>
        <div class="stat-card stat-card--gold">
          <div class="stat-card__icon">🛡️</div>
          <div class="stat-card__val">${admins.length}</div>
          <div class="stat-card__label">Admins</div>
          <div class="stat-card__sub">acesso total</div>
        </div>
        <div class="stat-card stat-card--blue">
          <div class="stat-card__icon">📚</div>
          <div class="stat-card__val">${users.length - admins.length}</div>
          <div class="stat-card__label">Estudantes</div>
          <div class="stat-card__sub">usuários regulares</div>
        </div>
        <div class="stat-card stat-card--rose">
          <div class="stat-card__icon">🧠</div>
          <div class="stat-card__val">4</div>
          <div class="stat-card__label">Disciplinas</div>
          <div class="stat-card__sub">2026.1 / 2026.2</div>
        </div>
      </div>

      <div class="section-panel">
        <div class="panel-header">
          <span class="panel-title">Usuários cadastrados</span>
          <span class="panel-count">${users.length} total</span>
        </div>
        <div class="activity-list">
          ${users.slice(0, 8).map(u => `
            <div class="activity-item">
              <div class="activity-avatar">${u.avatar ?? '🎓'}</div>
              <div class="activity-info">
                <strong>${u.nome ?? u.uid}</strong>
                <span>${u.uid}</span>
              </div>
              <div class="activity-meta">
                ${u.admin
                  ? `<span class="badge badge--amber">Admin</span>`
                  : `<span class="badge badge--green">Estudante</span>`}
              </div>
            </div>
          `).join('')}
          ${users.length > 8 ? `
            <div class="activity-item" style="justify-content:center">
              <button class="action-btn action-btn--ghost" id="dash-ver-todos">
                Ver todos (${users.length}) →
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    </div>`;

  document.getElementById('dash-ver-todos')?.addEventListener('click', () => _navegarPara('users'));
}

/* ══════════════════════════════════════════════════════════
   SEÇÃO — USUÁRIOS
   ══════════════════════════════════════════════════════════ */

async function _renderUsers() {
  const users = await _getUsuarios();

  document.getElementById('content').innerHTML = `
    <div class="section-content">
      <div class="section-toolbar">
        <input type="text" class="search-input" id="user-search"
               placeholder="Buscar por nome ou ID…">
        <button class="action-btn action-btn--primary" id="btn-criar-usuario">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo usuário
        </button>
      </div>

      <div class="section-panel">
        <div class="panel-header">
          <span class="panel-title">Todos os usuários</span>
          <span class="panel-count" id="user-count">${users.length} total</span>
        </div>
        <div class="user-grid" id="user-grid" style="padding:1rem">
          ${_renderUserCards(users)}
        </div>
      </div>
    </div>`;

  document.getElementById('user-search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const filtered = _usuarios.filter(u =>
      u.uid.includes(q) || (u.nome ?? '').toLowerCase().includes(q)
    );
    document.getElementById('user-grid').innerHTML = _renderUserCards(filtered);
    document.getElementById('user-count').textContent = `${filtered.length} total`;
    _bindUserCardActions();
  });

  document.getElementById('btn-criar-usuario').addEventListener('click', _modalCriarUsuario);
  _bindUserCardActions();
}

function _renderUserCards(users) {
  if (!users.length) return `<div class="empty-state">Nenhum usuário encontrado.</div>`;
  return users.map(u => `
    <div class="user-card" data-uid="${u.uid}">
      <div class="user-card__header">
        <div class="user-card__avatar ${u.admin ? 'user-card__avatar--admin' : ''}">
          ${u.foto ? `<img src="${u.foto}" alt="">` : u.avatar ?? '🎓'}
        </div>
        <div class="user-card__info">
          <strong>${u.nome ?? u.uid}</strong>
          <code>${u.uid}</code>
        </div>
        ${u.admin ? `<span class="admin-chip">Admin</span>` : ''}
      </div>
      <div class="user-card__actions">
        <button class="icon-btn icon-btn--blue btn-reset-pin"
                data-uid="${u.uid}"
                data-nome="${u.nome ?? u.uid}"
                data-admin="${u.admin ? '1' : '0'}">
          🔑 PIN
        </button>
        <button class="icon-btn icon-btn--gold btn-edit-user"
                data-uid="${u.uid}"
                data-nome="${u.nome ?? u.uid}"
                data-avatar="${u.avatar ?? '🎓'}">
          ✏️ Editar
        </button>
        ${!u.admin ? `
        <button class="icon-btn icon-btn--rose btn-remover-user"
                data-uid="${u.uid}"
                data-nome="${u.nome ?? u.uid}">
          🗑️ Remover
        </button>` : ''}
      </div>
    </div>
  `).join('');
}

function _bindUserCardActions() {
  document.querySelectorAll('.btn-reset-pin').forEach(btn => {
    btn.addEventListener('click', () =>
      _modalResetPin(btn.dataset.uid, btn.dataset.nome, btn.dataset.admin === '1')
    );
  });

  document.querySelectorAll('.btn-edit-user').forEach(btn => {
    btn.addEventListener('click', () =>
      _modalEditarUsuario(btn.dataset.uid, btn.dataset.nome, btn.dataset.avatar)
    );
  });

  document.querySelectorAll('.btn-remover-user').forEach(btn => {
    btn.addEventListener('click', () =>
      _modalConfirmar(
        `Remover <strong>${btn.dataset.nome}</strong>?`,
        'Apaga o usuário e todo o progresso permanentemente.',
        'Remover',
        async () => {
          const res = await _removerUsuarioCompleto(btn.dataset.uid);
          if (res.ok) {
            _usuarios = [];
            _toast(`${btn.dataset.nome} removido.`);
            await _renderUsers();
          } else {
            _toast('Erro ao remover usuário.', true);
          }
        },
        btn
      )
    );
  });
}

/* ══════════════════════════════════════════════════════════
   SEÇÃO — PROGRESSO
   ══════════════════════════════════════════════════════════ */

async function _renderProgress() {
  const users = await _getUsuarios();

  document.getElementById('content').innerHTML = `
    <div class="section-content">
      <div class="section-toolbar">
        <input type="text" class="search-input" id="prog-search" placeholder="Filtrar por usuário…">
      </div>
      <div class="section-panel">
        <div class="panel-header">
          <span class="panel-title">Progresso dos Usuários</span>
          <span class="panel-count">${users.filter(u => !u.admin).length} estudantes</span>
        </div>
        <div id="progress-table-wrap" class="data-table-wrap">
          <div class="init-loading"><div class="spinner"></div><p>Carregando…</p></div>
        </div>
      </div>
    </div>`;

  const estudantes = users.filter(u => !u.admin);
  const dados = await Promise.all(estudantes.map(async u => {
    try {
      const snap = await getDocs(collection(getDb(), 'usuarios', u.uid, 'quiz_respostas'));
      let total = 0, finalizados = 0;
      snap.forEach(d => { total++; if (d.data().finalizado) finalizados++; });
      return { uid: u.uid, nome: u.nome ?? u.uid, avatar: u.avatar ?? '🎓', total, finalizados };
    } catch {
      return { uid: u.uid, nome: u.nome ?? u.uid, avatar: u.avatar ?? '🎓', total: 0, finalizados: 0 };
    }
  }));

  function _renderTable(rows) {
    if (!rows.length) return `<div class="empty-state">Nenhum dado encontrado.</div>`;
    return `<table class="data-table">
      <thead><tr>
        <th>Usuário</th><th>ID</th><th>Quizzes salvos</th><th>Finalizados</th><th>Ações</th>
      </tr></thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td><span style="font-size:1.1rem;margin-right:6px">${r.avatar}</span>${r.nome}</td>
            <td><code class="quiz-id">${r.uid}</code></td>
            <td>${r.total}</td>
            <td><span class="badge ${r.finalizados > 0 ? 'badge--green' : 'badge--grey'}">${r.finalizados}</span></td>
            <td>
              <button class="icon-btn icon-btn--rose btn-limpar-quiz-prog"
                      data-uid="${r.uid}" data-nome="${r.nome}">
                🧹 Limpar quiz
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
  }

  const wrap = document.getElementById('progress-table-wrap');
  wrap.innerHTML = _renderTable(dados);

  document.getElementById('prog-search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    wrap.innerHTML = _renderTable(dados.filter(r =>
      r.uid.includes(q) || r.nome.toLowerCase().includes(q)
    ));
    _bindProgressActions();
  });

  _bindProgressActions();
}

function _bindProgressActions() {
  document.querySelectorAll('.btn-limpar-quiz-prog').forEach(btn => {
    btn.addEventListener('click', () =>
      _modalConfirmar(
        `Limpar quiz de <strong>${btn.dataset.nome}</strong>?`,
        'Remove todo o progresso de quiz salvo no Firestore.',
        'Limpar',
        async () => {
          const res = await limparTodoQuizUsuario(btn.dataset.uid);
          _toast(res.ok ? `Quiz de ${btn.dataset.nome} limpo! 🧹` : 'Erro ao limpar.', !res.ok);
        },
        btn
      )
    );
  });
}

/* ══════════════════════════════════════════════════════════
   SEÇÃO — RANKING
   ══════════════════════════════════════════════════════════ */

async function _renderRanking() {
  const users = await _getUsuarios();

  document.getElementById('content').innerHTML = `
    <div class="section-content">
      <div class="section-panel">
        <div class="panel-header">
          <span class="panel-title">Ranking — Quizzes Finalizados</span>
        </div>
        <div id="ranking-wrap">
          <div class="init-loading"><div class="spinner"></div><p>Calculando…</p></div>
        </div>
      </div>
    </div>`;

  const estudantes = users.filter(u => !u.admin);
  const scores = await Promise.all(estudantes.map(async u => {
    try {
      const snap = await getDocs(collection(getDb(), 'usuarios', u.uid, 'quiz_respostas'));
      let finalizados = 0;
      snap.forEach(d => { if (d.data().finalizado) finalizados++; });
      return { uid: u.uid, nome: u.nome ?? u.uid, avatar: u.avatar ?? '🎓', pontos: finalizados };
    } catch {
      return { uid: u.uid, nome: u.nome ?? u.uid, avatar: u.avatar ?? '🎓', pontos: 0 };
    }
  }));

  scores.sort((a, b) => b.pontos - a.pontos);

  const MEDALS  = ['🥇','🥈','🥉'];
  const CLASSES = ['lb-item--top1','lb-item--top2','lb-item--top3'];
  const wrap    = document.getElementById('ranking-wrap');

  if (!scores.length) {
    wrap.innerHTML = `<div class="empty-state">Sem dados ainda.</div>`;
    return;
  }

  wrap.innerHTML = `<div class="leaderboard">
    ${scores.map((s, i) => `
      <div class="lb-item ${CLASSES[i] ?? ''}">
        <div class="lb-rank">${MEDALS[i] ?? `#${i+1}`}</div>
        <div class="lb-avatar">${s.avatar}</div>
        <div class="lb-info">
          <strong>${s.nome}</strong>
          <span>${s.uid}</span>
        </div>
        <div class="lb-score">
          <span class="lb-val">${s.pontos}</span>
          <span class="lb-unit">quiz${s.pontos !== 1 ? 'zes' : ''}</span>
        </div>
      </div>
    `).join('')}
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   MODAL — CONFIRMAR (popover flutuante)
   ══════════════════════════════════════════════════════════ */

function _modalConfirmar(titulo, subtitulo, labelConfirmar, onConfirm, anchorEl = null) {
  // Remove qualquer popover anterior
  document.getElementById('confirm-modal')?.remove();

  const el = document.createElement('div');
  el.id = 'confirm-modal';
  el.className = 'mini-confirm';

  el.innerHTML = `
    <div class="mini-confirm__arrow"></div>
    <div class="mini-confirm__msg">
      <strong style="display:block;margin-bottom:0.25rem;font-size:0.8rem;color:var(--text-1)">${titulo}</strong>
      ${subtitulo ? `<span style="font-size:0.72rem;color:var(--text-3)">${subtitulo}</span>` : ''}
    </div>
    <div class="mini-confirm__actions">
      <button class="mini-confirm__btn mini-confirm__btn--cancel" id="cfm-nao">Não</button>
      <button class="mini-confirm__btn mini-confirm__btn--ok"     id="cfm-sim">${labelConfirmar}</button>
    </div>`;

  document.body.appendChild(el);

  /* ── Posicionamento ancorado ao botão ── */
  if (anchorEl) {
    const popW = 210;

    requestAnimationFrame(() => {
      const rect = anchorEl.getBoundingClientRect();
      const popH = el.offsetHeight;

      let left = rect.right - popW;
      let top  = rect.top - popH - 10; // acima do botão por padrão

      // Se não couber acima, posiciona abaixo
      if (top < 8) {
        top = rect.bottom + 8;
        el.querySelector('.mini-confirm__arrow').style.cssText =
          'bottom:auto;top:-5px;transform:rotate(225deg)';
      }

      // Garante que não sai da tela pela esquerda
      if (left < 8) left = 8;

      el.style.left  = left + 'px';
      el.style.top   = top  + 'px';
      el.style.width = popW + 'px';
      el.classList.add('mini-confirm--open');
    });
  } else {
    /* Fallback: centro da tela */
    el.style.left            = '50%';
    el.style.top             = '50%';
    el.style.transform       = 'translate(-50%,-50%) scale(1)';
    el.style.transformOrigin = 'center';
    requestAnimationFrame(() => el.classList.add('mini-confirm--open'));
  }

  /* ── Fechar com animação ── */
  function _fechar() {
    el.classList.add('mini-confirm--closing');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  }

  document.getElementById('cfm-nao').addEventListener('click', _fechar);
  document.getElementById('cfm-sim').addEventListener('click', async () => {
    _fechar();
    await onConfirm();
  });

  /* Clique fora fecha */
  setTimeout(() => {
    document.addEventListener('click', function handler(e) {
      if (!el.contains(e.target)) {
        _fechar();
        document.removeEventListener('click', handler);
      }
    });
  }, 50);
}

/* ══════════════════════════════════════════════════════════
   MODAL — CRIAR USUÁRIO
   ══════════════════════════════════════════════════════════ */

function _modalCriarUsuario() {
  const overlay = _criarOverlay();
  let avatarSel = '🎓';

  overlay.querySelector('.modal-box').innerHTML = `
    <div class="modal-header">
      <span class="modal-title">Novo Usuário</span>
      <button class="modal-close" id="mc-close">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Nome de exibição</label>
        <input class="form-input" id="mc-nome" placeholder="Ex: João Silva"
               maxlength="30" autocomplete="off">
      </div>
      <div class="form-group">
        <label>ID (login)</label>
        <input class="form-input" id="mc-id" placeholder="Ex: joao"
               maxlength="20" autocomplete="off" style="font-family:monospace">
        <small>Minúsculas, sem espaços ou acentos.</small>
      </div>
      <div class="form-group">
        <label>PIN (3 dígitos)</label>
        <input class="form-input" id="mc-pin" placeholder="• • •"
               maxlength="3" inputmode="numeric" type="password" autocomplete="off">
      </div>
      <div class="form-group">
        <label>Avatar</label>
        <div class="avatar-picker" id="mc-avatar-picker">
          ${AVATARS.map(a => `
            <button type="button" class="avatar-opt ${a === avatarSel ? 'selected' : ''}"
                    data-avatar="${a}">${a}</button>
          `).join('')}
        </div>
      </div>
      <p class="form-error" id="mc-erro" style="display:none"></p>
    </div>
    <div class="modal-footer">
      <button class="action-btn action-btn--ghost"   id="mc-cancel">Cancelar</button>
      <button class="action-btn action-btn--primary" id="mc-save">Criar</button>
    </div>`;

  document.getElementById('mc-close').addEventListener('click',  () => overlay.remove());
  document.getElementById('mc-cancel').addEventListener('click', () => overlay.remove());

  document.getElementById('mc-nome').addEventListener('input', e => {
    /* ── Navegação entre campos com Enter ── */
document.getElementById('mc-nome').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('mc-id').focus();
});
document.getElementById('mc-id').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('mc-pin').focus();
});
document.getElementById('mc-pin').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('mc-save').click();
});
    const idEl = document.getElementById('mc-id');
    if (!idEl.dataset.editado) {
      idEl.value = e.target.value.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '').slice(0, 20);
    }
  });
  document.getElementById('mc-id').addEventListener('input', e => {
    e.target.dataset.editado = '1';
    e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
  });

  document.getElementById('mc-avatar-picker').addEventListener('click', e => {
    const btn = e.target.closest('.avatar-opt');
    if (!btn) return;
    document.querySelectorAll('#mc-avatar-picker .avatar-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    avatarSel = btn.dataset.avatar;
  });

  document.getElementById('mc-save').addEventListener('click', async () => {
    const nome    = document.getElementById('mc-nome').value.trim();
    const id      = document.getElementById('mc-id').value.trim();
    const pin     = document.getElementById('mc-pin').value.trim();
    const erro    = document.getElementById('mc-erro');
    const saveBtn = document.getElementById('mc-save');

    erro.style.display = 'none';
    if (!nome || !id || !pin) {
      erro.textContent = 'Preencha todos os campos.'; erro.style.display = 'block'; return;
    }
    if (!/^\d{3}$/.test(pin)) {
      erro.textContent = 'PIN deve ter exatamente 3 dígitos.'; erro.style.display = 'block'; return;
    }

    saveBtn.disabled = true; saveBtn.textContent = 'Criando…';
    const pinHash = await hashPin(pin);
    const res = await criarUsuario(id, nome, pinHash, avatarSel);
    saveBtn.disabled = false; saveBtn.textContent = 'Criar';

    if (res.ok) {
      _usuarios = [];
      overlay.remove();
      _toast('Usuário criado! 🎉');
      await _renderUsers();
    } else {
      erro.textContent = res.erro ?? 'Erro ao criar usuário.';
      erro.style.display = 'block';
    }
  });
}

/* ══════════════════════════════════════════════════════════
   MODAL — EDITAR USUÁRIO
   ══════════════════════════════════════════════════════════ */

function _modalEditarUsuario(uid, nome, avatarAtual) {
  const overlay = _criarOverlay();
  let avatarSel = avatarAtual || '🎓';

  overlay.querySelector('.modal-box').innerHTML = `
    <div class="modal-header">
      <span class="modal-title">Editar — ${nome}</span>
      <button class="modal-close" id="me-close">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Nome de exibição</label>
        <input class="form-input" id="me-nome" value="${nome}"
               maxlength="30" autocomplete="off">
      </div>
      <div class="form-group">
        <label>Avatar</label>
        <div class="avatar-picker" id="me-avatar-picker">
          ${AVATARS.map(a => `
            <button type="button" class="avatar-opt ${a === avatarSel ? 'selected' : ''}"
                    data-avatar="${a}">${a}</button>
          `).join('')}
        </div>
      </div>
      <p class="form-error" id="me-erro" style="display:none"></p>
    </div>
    <div class="modal-footer">
      <button class="action-btn action-btn--ghost"   id="me-cancel">Cancelar</button>
      <button class="action-btn action-btn--primary" id="me-save">Salvar</button>
    </div>`;

  document.getElementById('me-close').addEventListener('click',  () => overlay.remove());
  document.getElementById('me-cancel').addEventListener('click', () => overlay.remove());

  document.getElementById('me-avatar-picker').addEventListener('click', e => {
    const btn = e.target.closest('.avatar-opt');
    if (!btn) return;
    document.querySelectorAll('#me-avatar-picker .avatar-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    avatarSel = btn.dataset.avatar;
  });

  document.getElementById('me-save').addEventListener('click', async () => {
    const novoNome = document.getElementById('me-nome').value.trim();
    const erro     = document.getElementById('me-erro');
    const saveBtn  = document.getElementById('me-save');

    if (!novoNome) {
      erro.textContent = 'Nome não pode ser vazio.'; erro.style.display = 'block'; return;
    }

    saveBtn.disabled = true; saveBtn.textContent = 'Salvando…';
    try {
      await setDoc(doc(getDb(), 'usuarios', uid), { nome: novoNome, avatar: avatarSel }, { merge: true });
      _usuarios = [];
      overlay.remove();
      _toast('Usuário atualizado! ✅');
      await _renderUsers();
    } catch (err) {
      erro.textContent = 'Erro: ' + err.message;
      erro.style.display = 'block';
      saveBtn.disabled = false; saveBtn.textContent = 'Salvar';
    }
  });
}

/* ══════════════════════════════════════════════════════════
   MODAL — RESET PIN
   ══════════════════════════════════════════════════════════ */

function _modalResetPin(uid, nome, isAdmin) {
  const overlay = _criarOverlay();
  const maxPin = isAdmin ? 9 : 3;

  overlay.querySelector('.modal-box').innerHTML = `
    <div class="modal-header">
      <span class="modal-title">Resetar PIN — ${nome}</span>
      <button class="modal-close" id="rp-close">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Novo PIN (${isAdmin ? 'até 9' : '3'} dígitos)</label>
        <input class="form-input" id="rp-pin" placeholder="• • •"
               maxlength="${maxPin}" inputmode="numeric" type="password" autocomplete="off">
        <small>O PIN antigo será substituído imediatamente.</small>
      </div>
      <p class="form-error" id="rp-erro" style="display:none"></p>
    </div>
    <div class="modal-footer">
      <button class="action-btn action-btn--ghost"   id="rp-cancel">Cancelar</button>
      <button class="action-btn action-btn--primary" id="rp-save">Resetar</button>
    </div>`;

  document.getElementById('rp-close').addEventListener('click',  () => overlay.remove());
  document.getElementById('rp-cancel').addEventListener('click', () => overlay.remove());

  document.getElementById('rp-save').addEventListener('click', async () => {
    const pin  = document.getElementById('rp-pin').value.trim();
    const erro = document.getElementById('rp-erro');
    const btn  = document.getElementById('rp-save');

    const pattern = isAdmin ? /^\d{4,9}$/ : /^\d{3}$/;
    const hint    = isAdmin ? 'PIN admin: 4 a 9 dígitos.' : 'PIN deve ter exatamente 3 dígitos.';

    if (!pattern.test(pin)) {
      erro.textContent = hint; erro.style.display = 'block'; return;
    }

    btn.disabled = true; btn.textContent = 'Resetando…';
    const res = await resetarPin(uid, pin);
    btn.disabled = false; btn.textContent = 'Resetar';

    if (res.ok) {
      overlay.remove();
      _toast(`PIN de ${nome} resetado! 🔑`);
    } else {
      erro.textContent = 'Erro ao resetar PIN.'; erro.style.display = 'block';
    }
  });
}

/* ══════════════════════════════════════════════════════════
   OVERLAY REUTILIZÁVEL (modais grandes)
   ══════════════════════════════════════════════════════════ */

function _criarOverlay() {
  document.querySelector('.modal-overlay')?.remove();

  const root    = document.getElementById('modal-root');
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const box = document.createElement('div');
  box.className = 'modal-box';
  overlay.appendChild(box);
  root.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add('modal-overlay--open');
    box.classList.add('modal-box--open');
  });

  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  return overlay;
}

/* ══════════════════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════════════════ */

function _toast(msg, erro = false) {
  const root = document.getElementById('toast-root');
  const t = document.createElement('div');
  t.className = `toast${erro ? ' toast--error' : ''}`;
  t.textContent = msg;
  root.appendChild(t);
  requestAnimationFrame(() => t.classList.add('toast--show'));
  setTimeout(() => {
    t.classList.remove('toast--show');
    t.addEventListener('transitionend', () => t.remove(), { once: true });
  }, 2800);
}

/* ══════════════════════════════════════════════════════════
   ÍCONES
   ══════════════════════════════════════════════════════════ */

function iconDashboard() {
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`;
}
function iconUsers() {
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`;
}
function iconProgress() {
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
}
function iconRanking() {
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`;
}