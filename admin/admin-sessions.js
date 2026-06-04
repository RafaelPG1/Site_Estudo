/* =============================================
   NEXUS STUDY — admin-sessions.js
   Painel de Administração — Seção Sessões
   admin/admin-sessions.js
   ============================================= */

import { getDb } from '../src/firebase.js';

import {
  collection, getDocs, deleteDoc,
  query, orderBy, limit,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { _getUsuarios, _toast, _modalConfirmar } from './admin.js';

/* ══════════════════════════════════════════════════════════
   SEÇÃO — SESSÕES
   ══════════════════════════════════════════════════════════ */

const _SESS_STATUS_MAP = {
  ativo:        { label: 'Ativa',      cls: 'badge--teal'  },
  normal:       { label: 'Encerrada',  cls: 'badge--grey'  },
  beforeunload: { label: 'Fechamento', cls: 'badge--blue'  },
  timeout:      { label: 'Timeout',    cls: 'badge--amber' },
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
  const wrap     = document.getElementById('sess-wrap');
  const countEl  = document.getElementById('sess-count');
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
      <div style="overflow-x:auto;">
        <table class="data-table" id="sess-table" style="min-width:720px;table-layout:fixed;width:100%">
          <colgroup>
            <col style="width:18%">
            <col style="width:16%">
            <col style="width:10%">
            <col style="width:11%">
            <col style="width:11%">
            <col style="width:12%">
            <col style="width:13%">
            <col style="width:9%">
          </colgroup>
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
        </table>
      </div>`;

    _bindSessionActions();

  } catch (err) {
    console.error('[admin] _carregarSessoes erro:', err);
    wrap.innerHTML = `<div class="empty-state">Erro ao carregar sessões.</div>`;
  }
}

function _buildMainRow({ usuario: u, sessoes }) {
  const agora     = Date.now();
  const sete_dias = 7 * 24 * 60 * 60 * 1000;
  const ultima    = sessoes[0];
  const sessAtiva = sessoes.find(s => s.encerramento === 'ativo');
  const logs7dias = sessoes.filter(s => (s.entrada ?? 0) >= agora - sete_dias);

  const duracaoTotal = sessoes.reduce((acc, s) => acc + (s.duracao ?? 0), 0);

  const entrada = ultima?.entrada ? new Date(ultima.entrada) : null;
  const saida   = ultima?.saida   ? new Date(ultima.saida)   : null;

  const enc    = ultima?.encerramento ?? 'ativo';
  const status = _SESS_STATUS_MAP[enc] ?? { label: enc, cls: 'badge--grey' };

  const statusBadge = sessAtiva
    ? `<span class="badge badge--teal" style="display:inline-flex;align-items:center;gap:5px;font-size:.72rem">
         <span style="width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0"></span>
         Ativa
       </span>`
    : `<span class="badge ${status.cls}" style="font-size:.72rem">${status.label}</span>`;

  return `
    <tr data-uid="${u.uid}" data-nome="${(u.nome ?? '').toLowerCase()}">
      <td>
        <div style="display:flex;align-items:center;gap:.5rem;overflow:hidden">
          <span style="flex-shrink:0;font-size:1.05rem;line-height:1">${u.avatar ?? '🎓'}</span>
          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u.nome ?? u.uid}</span>
        </div>
      </td>
      <td><code class="quiz-id" style="font-size:.72rem">${u.uid}</code></td>
      <td style="white-space:nowrap">${entrada ? entrada.toLocaleDateString('pt-BR') : '—'}</td>
      <td style="white-space:nowrap;font-variant-numeric:tabular-nums">${entrada ? entrada.toLocaleTimeString('pt-BR') : '—'}</td>
      <td style="white-space:nowrap;font-variant-numeric:tabular-nums">${saida   ? saida.toLocaleTimeString('pt-BR')   : '—'}</td>
      <td style="font-family:monospace;color:var(--teal);white-space:nowrap">${_formatarDuracao(duracaoTotal)}</td>
      <td>${statusBadge}</td>
      <td>
        <button class="sess-logs-btn" data-uid="${u.uid}" title="Ver logs dos últimos 7 dias"
                style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;font-size:.73rem;
                       border-radius:6px;border:1px solid var(--border);background:transparent;
                       color:var(--text-2);cursor:pointer;white-space:nowrap">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8"  y1="2" x2="8"  y2="6"/>
            <line x1="3"  y1="10" x2="21" y2="10"/>
          </svg>
          Logs
          ${logs7dias.length
            ? `<span style="background:var(--teal);color:#fff;border-radius:999px;
                            padding:1px 6px;font-size:.65rem;font-weight:600">${logs7dias.length}</span>`
            : ''}
        </button>
      </td>
    </tr>`;
}

/* ══════════════════════════════════════════════════════════
   MODAL DE LOGS — overlay real com position:fixed inline
   ══════════════════════════════════════════════════════════ */

function _abrirModalLogs(uid, nome, avatar, logs7dias) {
  document.getElementById('sess-log-modal')?.remove();

  const rows = logs7dias.length
    ? logs7dias.map(s => {
        const e  = s.entrada ? new Date(s.entrada) : null;
        const sa = s.saida   ? new Date(s.saida)   : null;
        const st = _SESS_STATUS_MAP[s.encerramento ?? 'ativo'] ?? { label: s.encerramento ?? '—', cls: 'badge--grey' };
        const dur = s.duracao != null ? _formatarDuracao(s.duracao) : '—';
        const pct = s.duracao ? Math.min(100, Math.round(s.duracao / 72000)) : 0;

        return `
          <div style="border:1px solid var(--border);border-radius:10px;padding:14px 16px;
                      background:var(--surface-2,rgba(255,255,255,.03));margin-bottom:10px">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                <span style="font-size:.75rem;color:var(--text-3);display:flex;align-items:center;gap:4px">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  ${e ? e.toLocaleDateString('pt-BR') : '—'}
                </span>
                <span style="font-size:.8rem;color:var(--text-1);font-variant-numeric:tabular-nums;
                             display:flex;align-items:center;gap:5px">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5" stroke-linecap="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <strong>${e ? e.toLocaleTimeString('pt-BR') : '—'}</strong>
                  <span style="color:var(--text-3)">→</span>
                  ${sa ? sa.toLocaleTimeString('pt-BR') : '—'}
                </span>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-family:monospace;color:var(--teal);font-size:.82rem;font-weight:600">${dur}</span>
                <span class="badge ${st.cls}" style="font-size:.65rem;padding:.18rem .55rem">${st.label}</span>
              </div>
            </div>
            ${pct > 0 ? `
            <div style="margin-top:10px;height:3px;border-radius:999px;background:var(--border);overflow:hidden">
              <div style="width:${pct}%;height:100%;border-radius:999px;background:var(--teal)"></div>
            </div>` : ''}
          </div>`;
      }).join('')
    : `<div style="padding:2.5rem;text-align:center;color:var(--text-3);font-size:.85rem">
         Nenhuma sessão nos últimos 7 dias.
       </div>`;

  const totalDur = logs7dias.reduce((a, s) => a + (s.duracao ?? 0), 0);

  /*
   * position:fixed + z-index:99999 direto no style inline —
   * imune a qualquer overflow:hidden ou stacking context do .layout pai.
   */
  const overlay = document.createElement('div');
  overlay.id = 'sess-log-modal';
  overlay.style.cssText = [
    'position:fixed',
    'inset:0',
    'z-index:99999',
    'background:rgba(0,0,0,.65)',
    'backdrop-filter:blur(4px)',
    '-webkit-backdrop-filter:blur(4px)',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'padding:20px',
    'opacity:0',
    'transition:opacity .2s ease',
  ].join(';');

  overlay.innerHTML = `
    <div id="sess-log-box" style="
      background:var(--surface,#16181d);
      border:1px solid var(--border);
      border-radius:16px;
      width:100%;
      max-width:560px;
      max-height:80vh;
      display:flex;
      flex-direction:column;
      overflow:hidden;
      transform:translateY(14px);
      transition:transform .22s ease;
      box-shadow:0 24px 60px rgba(0,0,0,.5);
    ">
      <!-- Cabeçalho -->
      <div style="display:flex;align-items:center;justify-content:space-between;
                  padding:18px 20px;border-bottom:1px solid var(--border);flex-shrink:0">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="font-size:1.6rem;line-height:1">${avatar ?? '🎓'}</div>
          <div>
            <div style="font-weight:600;font-size:.95rem;color:var(--text-1)">${nome}</div>
            <div style="font-size:.72rem;color:var(--text-3);margin-top:2px">Logs dos últimos 7 dias</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:16px">
          <div style="display:flex;align-items:center;gap:12px;font-size:.75rem">
            <div style="text-align:center">
              <div style="font-weight:700;font-size:1rem;color:var(--text-1)">${logs7dias.length}</div>
              <div style="color:var(--text-3)">sessões</div>
            </div>
            <div style="width:1px;height:28px;background:var(--border)"></div>
            <div style="text-align:center">
              <div style="font-weight:700;font-size:1rem;color:var(--teal);font-family:monospace">
                ${_formatarDuracao(totalDur)}
              </div>
              <div style="color:var(--text-3)">total</div>
            </div>
          </div>
          <button id="sess-log-close" style="
            width:30px;height:30px;border-radius:50%;border:1px solid var(--border);
            background:transparent;color:var(--text-2);font-size:.85rem;cursor:pointer;
            display:flex;align-items:center;justify-content:center;flex-shrink:0;
          ">✕</button>
        </div>
      </div>
      <!-- Corpo com scroll próprio do modal -->
      <div style="overflow-y:auto;padding:16px 20px;flex:1">
        ${rows}
      </div>
    </div>`;

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    overlay.querySelector('#sess-log-box').style.transform = 'translateY(0)';
  });

  const fechar = () => {
    overlay.style.opacity = '0';
    overlay.querySelector('#sess-log-box').style.transform = 'translateY(14px)';
    setTimeout(() => overlay.remove(), 220);
  };

  overlay.querySelector('#sess-log-close').addEventListener('click', fechar);
  overlay.addEventListener('click', e => { if (e.target === overlay) fechar(); });

  const onKey = e => {
    if (e.key === 'Escape') { fechar(); document.removeEventListener('keydown', onKey); }
  };
  document.addEventListener('keydown', onKey);
}

/* ── Bind de eventos — apenas botão Logs (sem delete) ── */
function _bindSessionActions() {
  document.querySelectorAll('.sess-logs-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid   = btn.dataset.uid;
      const grupo = (window._sessCache ?? []).find(g => g.usuario.uid === uid);
      if (!grupo) return;

      const agora     = Date.now();
      const sete_dias = 7 * 24 * 60 * 60 * 1000;
      const logs7     = grupo.sessoes.filter(s => (s.entrada ?? 0) >= agora - sete_dias);

      _abrirModalLogs(uid, grupo.usuario.nome ?? uid, grupo.usuario.avatar, logs7);
    });
  });
}

/* ── Limpar sessões com mais de 30 dias ── */
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

/* ── Formata duração em ms → "Xh Ym Zs" ── */
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