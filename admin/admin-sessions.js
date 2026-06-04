/* =============================================
   NEXUS STUDY — admin-sessions.js
   Painel de Administração — Seção Sessões
   admin/admin-sessions.js
   ============================================= */

import { getDb } from '../src/firebase.js';

import {
  collection, getDocs, deleteDoc, doc,
  query, orderBy, limit,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { _getUsuarios, _toast, _modalConfirmar } from './admin.js';

/* ══════════════════════════════════════════════════════════
   SEÇÃO — SESSÕES
   ══════════════════════════════════════════════════════════ */

const _SESS_STATUS_MAP = {
  ativo:        { label: 'Ativa',       cls: 'badge--teal'  },
  normal:       { label: 'Normal',      cls: 'badge--green' },
  beforeunload: { label: 'Fechamento',  cls: 'badge--blue'  },
  timeout:      { label: 'Timeout',     cls: 'badge--amber' },
};

export async function _renderSessions() {
  document.getElementById('content').innerHTML = `
    <div class="section-content">

      <div class="section-toolbar">
        <input type="text" class="search-input" id="sess-search"
               placeholder="Filtrar por usuário ou ID…">
        <button class="action-btn action-btn--ghost" id="sess-clear-btn">
          🧹 Limpar antigas
        </button>
      </div>

      <div class="section-panel">
        <div class="panel-header">
          <span class="panel-title">Histórico de Sessões</span>
          <span class="panel-count" id="sess-count">—</span>
        </div>
        <div id="sess-wrap">
          <div class="init-loading"><div class="spinner"></div><p>Carregando sessões…</p></div>
        </div>
      </div>

    </div>`;

  await _carregarSessoes();

  document.getElementById('sess-search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('#sess-table tbody tr').forEach(tr => {
      const txt = (tr.dataset.nome ?? '') + (tr.dataset.uid ?? '');
      tr.style.display = txt.includes(q) ? '' : 'none';
    });
  });

  document.getElementById('sess-clear-btn').addEventListener('click', () => {
    _modalConfirmar(
      'Limpar sessões antigas?',
      'Remove registros com mais de 30 dias de todos os usuários.',
      'Limpar',
      _limparSessoesAntigas,
      document.getElementById('sess-clear-btn')
    );
  });
}

async function _carregarSessoes() {
  const wrap    = document.getElementById('sess-wrap');
  const countEl = document.getElementById('sess-count');
  const usuarios = await _getUsuarios();

  try {
    const porUsuario = await Promise.all(
      usuarios.map(async u => {
        try {
          const colRef = collection(getDb(), 'usuarios', u.uid, 'sessoes');
          const q      = query(colRef, orderBy('entrada', 'desc'), limit(200));
          const snap   = await getDocs(q);
          return { usuario: u, sessoes: snap.docs.map(d => ({ id: d.id, ...d.data() })) };
        } catch {
          return { usuario: u, sessoes: [] };
        }
      })
    );

    const comSessoes = porUsuario.filter(g => g.sessoes.length > 0);
    window._sessCache = comSessoes;

    if (countEl) countEl.textContent = `${comSessoes.length} usuário${comSessoes.length !== 1 ? 's' : ''}`;

    if (!comSessoes.length) {
      wrap.innerHTML = `<div class="empty-state">Nenhuma sessão registrada ainda.</div>`;
      return;
    }

    wrap.innerHTML = `
      <table class="data-table sess-table" id="sess-table">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>ID</th>
            <th>Data</th>
            <th>Entrada</th>
            <th>Saída</th>
            <th>Duração</th>
            <th>Status</th>
            <th>Logs</th>
          </tr>
        </thead>
        <tbody>
          ${comSessoes.map(g => _buildMainRow(g)).join('')}
        </tbody>
      </table>`;

    _bindSessionActions();

  } catch (err) {
    console.error('[admin] _carregarSessoes erro:', err);
    wrap.innerHTML = `<div class="empty-state">Erro ao carregar sessões.</div>`;
  }
}

function _buildMainRow({ usuario: u, sessoes }) {
  const agora     = Date.now();
  const sete_dias = 7 * 24 * 60 * 60 * 1000;
  const sessAtiva = sessoes.find(s => s.encerramento === 'ativo');
  const ultima    = sessoes[0];
  const logs7dias = sessoes.filter(s => (s.entrada ?? 0) >= agora - sete_dias);

  const duracaoTotal = sessoes.reduce((acc, s) => acc + (s.duracao ?? 0), 0);

  const entrada = ultima?.entrada ? new Date(ultima.entrada) : null;
  const saida   = ultima?.saida   ? new Date(ultima.saida)   : null;

  const enc    = ultima?.encerramento ?? 'ativo';
  const status = _SESS_STATUS_MAP[enc] ?? { label: enc, cls: 'badge--grey' };

  // Status badge: inline-flex para alinhar ponto + texto corretamente
  const statusBadge = sessAtiva
    ? `<span class="badge badge--teal sess-status-ativa"><span class="sess-dot"></span>Ativa</span>`
    : `<span class="badge ${status.cls}">${status.label}</span>`;

  return `
    <tr data-uid="${u.uid}" data-nome="${(u.nome ?? '').toLowerCase()}">
      <td>
        <div style="display:flex;align-items:center;gap:0.5rem">
          <span style="font-size:1.05rem;line-height:1">${u.avatar ?? '🎓'}</span>
          <span>${u.nome ?? u.uid}</span>
        </div>
      </td>
      <td><code class="quiz-id">${u.uid}</code></td>
      <td class="sess-num">${entrada ? entrada.toLocaleDateString('pt-BR') : '—'}</td>
      <td class="sess-num">${entrada ? entrada.toLocaleTimeString('pt-BR') : '—'}</td>
      <td class="sess-num">${saida   ? saida.toLocaleTimeString('pt-BR')   : '—'}</td>
      <td style="font-family:monospace;color:var(--teal);white-space:nowrap">${_formatarDuracao(duracaoTotal)}</td>
      <td>${statusBadge}</td>
      <td>
        <button class="sess-logs-btn" data-uid="${u.uid}" title="Ver logs dos últimos 7 dias">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8"  y1="2" x2="8"  y2="6"/>
            <line x1="3"  y1="10" x2="21" y2="10"/>
          </svg>
          Logs
          ${logs7dias.length ? `<span class="sess-logs-badge">${logs7dias.length}</span>` : ''}
        </button>
      </td>
    </tr>`;
}

/* ── Modal de logs dos últimos 7 dias ── */
function _abrirModalLogs(uid, nome, avatar, logs7dias) {
  // Remove modal anterior se existir
  document.getElementById('sess-log-modal')?.remove();

  const rows = logs7dias.length
    ? logs7dias.map(s => {
        const e  = s.entrada ? new Date(s.entrada) : null;
        const sa = s.saida   ? new Date(s.saida)   : null;
        const st = _SESS_STATUS_MAP[s.encerramento ?? 'ativo'] ?? { label: s.encerramento, cls: 'badge--grey' };
        const dur = s.duracao != null ? _formatarDuracao(s.duracao) : '—';
        const pct = s.duracao ? Math.min(100, Math.round(s.duracao / 72000)) : 0;

        return `
          <div class="slog-row">
            <div class="slog-top">
              <div class="slog-date">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                ${e ? e.toLocaleDateString('pt-BR') : '—'}
              </div>
              <div class="slog-times">
                <span class="slog-time-in">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5" stroke-linecap="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  ${e ? e.toLocaleTimeString('pt-BR') : '—'}
                </span>
                <span class="slog-arrow">→</span>
                <span class="slog-time-out">${sa ? sa.toLocaleTimeString('pt-BR') : '—'}</span>
              </div>
              <div class="slog-right">
                <span class="slog-dur">${dur}</span>
                <span class="badge ${st.cls}" style="font-size:.65rem;padding:.18rem .55rem">${st.label}</span>
              </div>
            </div>
            <div class="slog-bar-wrap">
              <div class="slog-bar" style="width:${pct}%"></div>
            </div>
          </div>`;
      }).join('')
    : `<div class="empty-state" style="padding:2.5rem">Nenhuma sessão nos últimos 7 dias.</div>`;

  const totalDur = logs7dias.reduce((a, s) => a + (s.duracao ?? 0), 0);

  const html = `
    <div class="modal-overlay" id="sess-log-modal">
      <div class="modal-box slog-modal-box">
        <div class="slog-modal-head">
          <div class="slog-modal-user">
            <div class="slog-modal-avatar">${avatar ?? '🎓'}</div>
            <div>
              <div class="slog-modal-name">${nome}</div>
              <div class="slog-modal-sub">Logs dos últimos 7 dias</div>
            </div>
          </div>
          <div class="slog-modal-stats">
            <div class="slog-stat">
              <span class="slog-stat-val">${logs7dias.length}</span>
              <span class="slog-stat-lbl">sessões</span>
            </div>
            <div class="slog-stat-sep"></div>
            <div class="slog-stat">
              <span class="slog-stat-val" style="color:var(--teal)">${_formatarDuracao(totalDur)}</span>
              <span class="slog-stat-lbl">total</span>
            </div>
          </div>
          <button class="modal-close slog-modal-close">✕</button>
        </div>
        <div class="slog-modal-body">
          ${rows}
        </div>
      </div>
    </div>`;

  // Inserir diretamente no body — o #modal-root fica dentro de .layout que tem
  // overflow:hidden, o que corta o overlay com position:absolute.
  // Os outros modais (_criarOverlay) também usam document.body.
  const el = document.createElement('div');
  el.innerHTML = html;
  document.body.appendChild(el.firstElementChild);

  // FIX: usar a classe correta do CSS: modal-overlay--open (não --show)
  const overlay = document.getElementById('sess-log-modal');
  requestAnimationFrame(() => {
    overlay.classList.add('modal-overlay--open');
    overlay.querySelector('.slog-modal-box').classList.add('modal-box--open');
  });

  const fechar = () => {
    overlay.classList.remove('modal-overlay--open');
    overlay.querySelector('.slog-modal-box').classList.remove('modal-box--open');
    setTimeout(() => overlay.remove(), 250);
  };

  overlay.querySelector('.slog-modal-close').addEventListener('click', fechar);
  overlay.addEventListener('click', e => { if (e.target === overlay) fechar(); });
}

function _bindSessionActions() {
  document.querySelectorAll('.sess-logs-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid   = btn.dataset.uid;
      const grupo = (window._sessCache ?? []).find(g => g.usuario.uid === uid);
      if (!grupo) return;

      const agora     = Date.now();
      const sete_dias = 7 * 24 * 60 * 60 * 1000;
      const logs7     = grupo.sessoes.filter(s => (s.entrada ?? 0) >= agora - sete_dias);

      // FIX: busca nome direto do cache, não do DOM
      _abrirModalLogs(uid, grupo.usuario.nome ?? uid, grupo.usuario.avatar, logs7);
    });
  });
}

async function _limparSessoesAntigas() {
  const LIMITE_MS = 30 * 24 * 60 * 60 * 1000;
  const corte     = Date.now() - LIMITE_MS;
  const usuarios  = await _getUsuarios();
  let total = 0;

  try {
    await Promise.all(usuarios.map(async u => {
      const snap   = await getDocs(collection(getDb(), 'usuarios', u.uid, 'sessoes'));
      const antigas = snap.docs.filter(d => (d.data().entrada ?? 0) < corte);
      await Promise.all(antigas.map(d => deleteDoc(d.ref)));
      total += antigas.length;
    }));

    _toast(`${total} registro${total !== 1 ? 's' : ''} antigo${total !== 1 ? 's' : ''} removido${total !== 1 ? 's' : ''}. 🧹`);
    await _carregarSessoes();
  } catch (err) {
    console.error('[admin] _limparSessoesAntigas erro:', err);
    _toast('Erro ao limpar registros.', true);
  }
}

/* ── Formata duração em ms para "Xh Ym Zs" ── */
function _formatarDuracao(ms) {
  if (!ms || ms < 0) return '—';
  const s   = Math.floor(ms / 1000);
  const h   = Math.floor(s / 3600);
  const m   = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h${String(m).padStart(2,'0')}m${String(sec).padStart(2,'0')}s`;
  if (m > 0) return `${m}m${String(sec).padStart(2,'0')}s`;
  return `${sec}s`;
}