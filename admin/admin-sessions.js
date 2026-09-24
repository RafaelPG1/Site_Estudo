/* =============================================
   NEXUS STUDY — admin-sessions.js
   Painel de Administração — Seção Sessões
   admin/admin-sessions.js

   v2 — Sessões confiáveis (dois formatos, unidades corretas)
   ─────────────────────────────────────────────
   CAUSA RAIZ CORRIGIDA
     Esta tela foi escrita para o tracker antigo (entrada / saida /
     duracao em ms / encerramento). O tracker atual (src/session-tracker.js)
     grava startedAt / endedAt / duracao em SEGUNDOS e não tem campo de
     status. Resultado: a consulta orderBy('entrada') omitia todas as
     sessões novas; a duração em segundos era formatada como ms ("45min"
     virava "2s"); "Ativa" era só a existência de encerramento === 'ativo'.

   O QUE MUDOU
     • Toda a regra (formatos, unidades, status, janela, indicadores)
       vive em admin-sessions-model.js — puro e testado.
     • Consulta por faixa de ID do documento (o ID começa com o timestamp de
       início nos dois formatos), janela de 30 dias, em ordem CRESCENTE e
       paginada. Não usa orderBy descendente: no Firestore ele exige um índice
       manual sobre __name__, e a faixa crescente usa só o índice automático.
     • Status por inatividade: Ativa / Ausente / Encerrada.
     • Tempo ativo (duracao, segundos→ms) separado da Janela (início→fim).
     • Indicadores, filtro por status, ordenação, modal de 7 dias.
     • Duração de sessão ativa recalculada no navegador a cada 30 s,
       SEM novas leituras no Firestore. O botão de atualizar da topbar
       continua recarregando os dados reais.
     • "Limpar antigas" corrigido: antes lia `entrada ?? 0`, o que fazia
       toda sessão do formato atual parecer "antiga" e ser apagada.

   PRIVACIDADE
     • Cache privado ao módulo, guardando só uid/nome/avatar do usuário —
       nunca o documento completo (que contém o hash do PIN). O antigo
       window._sessCache não existe mais.
     • Da sessão só saem contagens (páginas, navegações), dispositivo
       (mobile/desktop) e tempos. Nenhuma rota, query string ou nome de
       página é lido pela interface.
     • Todo texto vindo de dados passa por esc() antes do innerHTML.
   ============================================= */

import { getDb } from '../src/firebase.js';

import {
  collection, getDocs, deleteDoc,
  query, orderBy, limit, where, documentId,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { _getUsuarios, _toast, _modalConfirmar } from './admin.js';

import {
  CONFIG, MS_DIA, STATUS, STATUS_INFO,
  normalizarSessao, inicioDaSessao, derivarSessao, escolherSessaoDoUsuario,
  resumir, ordenarLinhas,
  formatarDuracao, formatarRelativo, formatarDataHora, formatarFim, esc,
} from './admin-sessions-model.js';

/* ══════════════════════════════════════════════════════════
   ESTADO — privado ao módulo (nada em window)
   ══════════════════════════════════════════════════════════ */

const PAGINA_SESSOES     = 200;      // documentos por consulta
const MAX_PAGINAS        = 5;        // teto de segurança: 1000 sessões/usuário na janela
const TICK_MS            = 30_000;   // recálculo local; não consulta o Firestore

let _grupos      = [];               // [{ usuario:{uid,nome,avatar}, sessoes:[normalizadas] }]
let _carregadoEm = null;
let _falhas      = 0;
let _truncados   = 0;
let _filtros     = { busca: '', status: 'todos', ordem: 'recentes' };

let _mountToken  = 0;                // invalida cargas/ticks de renderizações antigas
let _tickTimer   = null;
let _modalUid    = null;
let _onKeyModal  = null;

const _TZ = (() => {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { return ''; }
})();

/* ══════════════════════════════════════════════════════════
   ESTILOS (injetados uma vez; prefixo sx- para não colidir
   com as regras .sess-* / .slog-* já existentes no admin.css)
   ══════════════════════════════════════════════════════════ */

function _injetarEstilos() {
  if (document.getElementById('sx-styles')) return;
  const st = document.createElement('style');
  st.id = 'sx-styles';
  st.textContent = `
    .sx-note{padding:.55rem 1.25rem;font-size:.72rem;color:var(--text-3);border-bottom:1px solid var(--border)}
    .sx-warn{color:var(--gold)}
    .sx-filter{flex:0 0 auto;min-width:150px}
    .sx-table{width:100%}
    .sx-table th{padding:.6rem .55rem;white-space:nowrap;font-size:.62rem;letter-spacing:.06em}
    .sx-table td{padding:.6rem .55rem;white-space:nowrap;font-size:.8rem}
    .sx-user{display:flex;align-items:center;gap:.5rem;max-width:170px;overflow:hidden}

    /* Rolagem horizontal no padrão do painel: fina, teal, sem setas nem trilho claro */
    .sx-scroll{overflow-x:auto}
    .sx-scroll::-webkit-scrollbar{height:4px}
    .sx-scroll::-webkit-scrollbar-track{background:transparent}
    .sx-scroll::-webkit-scrollbar-thumb{background:rgba(77,217,180,.22);border-radius:4px}
    .sx-scroll::-webkit-scrollbar-thumb:hover{background:rgba(77,217,180,.45)}
    .sx-scroll::-webkit-scrollbar-button{display:none;width:0;height:0}
    .sx-scroll::-webkit-scrollbar-corner{background:transparent}
    @supports not selector(::-webkit-scrollbar){
      .sx-scroll{scrollbar-width:thin;scrollbar-color:rgba(77,217,180,.3) transparent}
    }
    .sx-user__av{flex-shrink:0;font-size:1.05rem;line-height:1}
    .sx-user__txt{overflow:hidden;min-width:0}
    .sx-user__name{display:block;overflow:hidden;text-overflow:ellipsis;color:var(--text-1)}
    .sx-sub{display:block;font-size:.68rem;color:var(--text-3);margin-top:1px;font-variant-numeric:tabular-nums}
    .sx-num{font-variant-numeric:tabular-nums}
    .sx-strong{color:var(--teal);font-weight:600;font-variant-numeric:tabular-nums}
    .sx-dev{font-size:1.35rem !important;letter-spacing:.02em}

    .sx-ov{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.65);
      backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;
      align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .2s ease}
    .sx-ov--show{opacity:1}
    .sx-box{background:var(--surface,#16181d);border:1px solid var(--border);border-radius:16px;
      width:100%;max-width:600px;max-height:82vh;display:flex;flex-direction:column;overflow:hidden;
      transform:translateY(14px);transition:transform .22s ease;box-shadow:0 24px 60px rgba(0,0,0,.5)}
    .sx-ov--show .sx-box{transform:translateY(0)}
    .sx-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;
      padding:16px 20px;border-bottom:1px solid var(--border);flex-shrink:0}
    .sx-head__user{display:flex;align-items:center;gap:12px;min-width:0}
    .sx-head__av{font-size:1.6rem;line-height:1}
    .sx-head__name{font-weight:600;font-size:.95rem;color:var(--text-1);overflow:hidden;text-overflow:ellipsis}
    .sx-head__sub{font-size:.72rem;color:var(--text-3);margin-top:2px}
    .sx-head__right{display:flex;align-items:center;gap:16px}
    .sx-stats{display:flex;align-items:center;gap:12px;font-size:.72rem;color:var(--text-3)}
    .sx-stat{text-align:center}
    .sx-stat b{display:block;font-size:1rem;color:var(--text-1)}
    .sx-stat b.sx-teal{color:var(--teal)}
    .sx-sep{width:1px;height:28px;background:var(--border)}
    .sx-close{width:30px;height:30px;border-radius:50%;border:1px solid var(--border);background:transparent;
      color:var(--text-2);font-size:.85rem;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .sx-close:hover{color:var(--text-1);background:rgba(255,255,255,.06)}
    .sx-body{overflow-y:auto;padding:16px 20px;flex:1}
    .sx-empty{padding:2.5rem;text-align:center;color:var(--text-3);font-size:.85rem}
    .sx-card{border:1px solid var(--border);border-radius:10px;padding:13px 15px;
      background:var(--surface-2,rgba(255,255,255,.03));margin-bottom:10px}
    .sx-card__top{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
    .sx-card__when{font-size:.8rem;color:var(--text-1);font-variant-numeric:tabular-nums}
    .sx-card__meta{display:flex;gap:14px;flex-wrap:wrap;margin-top:8px;font-size:.72rem;color:var(--text-3)}
    .sx-card__meta b{color:var(--text-2);font-weight:600;font-variant-numeric:tabular-nums}
    .sx-bar{margin-top:9px;height:3px;border-radius:999px;background:var(--border);overflow:hidden}
    .sx-bar>i{display:block;height:100%;border-radius:999px;background:var(--teal)}
  `;
  document.head.appendChild(st);
}

/* ══════════════════════════════════════════════════════════
   SEÇÃO — SESSÕES
   ══════════════════════════════════════════════════════════ */

export async function _renderSessions() {
  const token = ++_mountToken;
  _pararTick();
  _fecharModalAgora();
  _injetarEstilos();

  _filtros = { busca: '', status: 'todos', ordem: 'recentes' };

  document.getElementById('content').innerHTML = `
    <div class="section-content" id="sx-root">

      <div class="stat-grid" id="sx-cards"></div>

      <div class="section-toolbar">
        <input type="text" class="search-input" id="sess-search"
               placeholder="Filtrar por usuário ou ID…" autocomplete="off">
        <select class="search-input sx-filter" id="sess-status" aria-label="Filtrar por status">
          <option value="todos">Todos os status</option>
          <option value="ativa">Ativas</option>
          <option value="ausente">Ausentes</option>
          <option value="encerrada">Encerradas</option>
        </select>
        <select class="search-input sx-filter" id="sess-ordem" aria-label="Ordenar">
          <option value="recentes">Mais recentes</option>
          <option value="tempo">Maior tempo ativo</option>
          <option value="nome">Nome (A–Z)</option>
        </select>
        <button class="action-btn action-btn--ghost" id="sess-clear-btn"
                title="Remove do banco as sessões com mais de 30 dias (elas já não aparecem nesta lista)">
          🧹 Limpar antigas
        </button>
      </div>

      <div class="section-panel">
        <div class="panel-header">
          <span class="panel-title">Histórico de Sessões</span>
          <span class="panel-count" id="sess-count">—</span>
        </div>
        <div class="sx-note" id="sx-note">Carregando…</div>
        <div id="sess-wrap">
          <div class="init-loading"><div class="spinner"></div><p>Carregando sessões…</p></div>
        </div>
      </div>

    </div>`;

  _bindEventos();
  await _carregarSessoes(token);
  if (token !== _mountToken) return;
  _iniciarTick(token);
}

function _bindEventos() {
  document.getElementById('sess-search').addEventListener('input', e => {
    _filtros.busca = e.target.value.trim().toLowerCase();
    _renderTudo();
  });
  document.getElementById('sess-status').addEventListener('change', e => {
    _filtros.status = e.target.value;
    _renderTudo();
  });
  document.getElementById('sess-ordem').addEventListener('change', e => {
    _filtros.ordem = e.target.value;
    _renderTudo();
  });

  document.getElementById('sess-clear-btn').addEventListener('click', _iniciarLimpeza);

  /* Delegação: a tabela é re-renderizada, o container não. */
  document.getElementById('sess-wrap').addEventListener('click', e => {
    const btn = e.target.closest('.sess-logs-btn');
    if (btn) _abrirModalLogs(btn.dataset.uid);
  });
}

/* ══════════════════════════════════════════════════════════
   CARGA (Firestore)
   ══════════════════════════════════════════════════════════ */

/* Só o necessário do usuário — o documento completo (com hash do PIN)
   nunca é guardado. */
function _usuarioPublico(u) {
  const uid = String(u.uid);
  return {
    uid,
    nome:   (typeof u.nome === 'string' && u.nome) ? u.nome : uid,
    avatar: (typeof u.avatar === 'string' && u.avatar) ? u.avatar : '🎓',
  };
}

/* Os IDs das sessões começam com o timestamp de início (13 dígitos) nos dois
   formatos, então filtrar por faixa de ID é filtrar por data — e cobre
   documentos antigos e novos.

   IMPORTANTE (Firestore): faixa + orderBy CRESCENTE no ID usa o índice
   automático. orderBy(documentId(), 'desc') exige índice manual — por isso a
   ordenação recente→antigo é feita no cliente e a leitura é paginada em vez
   de "limit dos N mais novos".

   Se a consulta por faixa falhar por qualquer motivo, cai para a leitura
   simples da coleção (sem ordenação) e a janela é aplicada no cliente. */
async function _buscarDocsSessoes(uid, corteMs) {
  const col  = collection(getDb(), 'usuarios', uid, 'sessoes');
  const docs = [];
  try {
    let refId = String(corteMs);
    let op    = '>=';
    for (let pagina = 0; pagina < MAX_PAGINAS; pagina++) {
      const snap = await getDocs(query(
        col,
        where(documentId(), op, refId),
        orderBy(documentId()),
        limit(PAGINA_SESSOES),
      ));
      docs.push(...snap.docs);
      if (snap.docs.length < PAGINA_SESSOES) return { docs, truncado: false };
      refId = snap.docs[snap.docs.length - 1].id;
      op    = '>';
    }
    return { docs, truncado: true };
  } catch (err) {
    console.warn('[admin-sessions] consulta por faixa falhou, lendo a coleção inteira:', uid, err);
    const snap = await getDocs(col);
    return { docs: snap.docs, truncado: false };
  }
}

async function _carregarSessoes(token) {
  const usuarios = (await _getUsuarios()).map(_usuarioPublico);
  const corte    = Date.now() - CONFIG.JANELA_DIAS * MS_DIA;
  let falhas     = 0;
  let truncados  = 0;

  const grupos = await Promise.all(usuarios.map(async usuario => {
    try {
      const { docs, truncado } = await _buscarDocsSessoes(usuario.uid, corte);
      if (truncado) truncados++;
      const sessoes = docs
        .map(d => normalizarSessao(d.id, d.data()))
        .filter(s => s && s.inicio >= corte)
        .sort((a, b) => b.inicio - a.inicio);
      return { usuario, sessoes };
    } catch (err) {
      falhas++;
      console.error('[admin-sessions] erro ao carregar sessões de', usuario.uid, err);
      return { usuario, sessoes: [] };
    }
  }));

  if (token !== _mountToken) return;      // usuário já saiu desta seção

  _grupos      = grupos.filter(g => g.sessoes.length > 0);
  _carregadoEm = Date.now();
  _falhas      = falhas;
  _truncados   = truncados;
  _renderTudo();
}

/* ══════════════════════════════════════════════════════════
   RENDER (a partir do cache; nunca consulta o Firestore)
   ══════════════════════════════════════════════════════════ */

function _computar(agora) {
  const linhas = [];
  const todas  = [];
  for (const g of _grupos) {
    const deriv = g.sessoes.map(s => ({ ...derivarSessao(s, agora), uid: g.usuario.uid }));
    todas.push(...deriv);
    linhas.push({ usuario: g.usuario, principal: escolherSessaoDoUsuario(deriv), sessoes: deriv });
  }
  return { linhas, todas };
}

function _renderTudo() {
  const wrap = document.getElementById('sess-wrap');
  if (!wrap) return;                       // seção não está mais na tela

  const agora = Date.now();
  const { linhas, todas } = _computar(agora);

  /* Indicadores */
  const cards = document.getElementById('sx-cards');
  if (cards) cards.innerHTML = _htmlCards(resumir(todas));

  /* Nota (fuso, horário da carga, falhas) */
  const nota = document.getElementById('sx-note');
  if (nota) {
    const hora = _carregadoEm ? formatarDataHora(_carregadoEm, agora) : '—';
    nota.innerHTML =
      `Últimos ${CONFIG.JANELA_DIAS} dias · horários no fuso do navegador${_TZ ? ` (${esc(_TZ)})` : ''} · ` +
      `dados carregados ${esc(hora)}` +
      (_falhas ? ` · <span class="sx-warn">⚠️ ${_falhas} usuário${_falhas !== 1 ? 's' : ''} não ${_falhas !== 1 ? 'puderam' : 'pôde'} ser carregado${_falhas !== 1 ? 's' : ''}</span>` : '') +
      (_truncados ? ` · <span class="sx-warn">⚠️ histórico muito grande em ${_truncados} usuário${_truncados !== 1 ? 's' : ''}: sessões mais recentes podem estar fora da lista</span>` : '');
  }

  /* Filtro + ordenação */
  const filtradas = ordenarLinhas(
    linhas.filter(l => {
      if (_filtros.status !== 'todos' && l.principal.status !== _filtros.status) return false;
      if (!_filtros.busca) return true;
      return l.usuario.nome.toLowerCase().includes(_filtros.busca)
          || l.usuario.uid.toLowerCase().includes(_filtros.busca);
    }),
    _filtros.ordem,
  );

  const countEl = document.getElementById('sess-count');
  if (countEl) countEl.textContent = `${filtradas.length} usuário${filtradas.length !== 1 ? 's' : ''}`;

  if (!linhas.length) {
    wrap.innerHTML = `<div class="empty-state">Nenhuma sessão nos últimos ${CONFIG.JANELA_DIAS} dias.</div>`;
  } else if (!filtradas.length) {
    wrap.innerHTML = `<div class="empty-state">Nenhum usuário corresponde ao filtro.</div>`;
  } else {
    wrap.innerHTML = `
      <div class="data-table-wrap sx-scroll">
        <table class="data-table sx-table" id="sess-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Status</th>
              <th>Início</th>
              <th>Última atividade</th>
              <th>Encerramento</th>
              <th>Tempo ativo</th>
              <th>Janela</th>
              <th>Dispositivo</th>
              <th>Atividade</th>
              <th>Logs</th>
            </tr>
          </thead>
          <tbody>${filtradas.map(l => _htmlLinha(l, agora)).join('')}</tbody>
        </table>
      </div>`;
  }

  if (_modalUid) _atualizarModal();
}

function _htmlCards(r) {
  const totalDisp = r.mobile + r.desktop;
  const pct = n => Math.round((n / totalDisp) * 100);

  return `
    <div class="stat-card stat-card--teal">
      <div class="stat-card__icon">🟢</div>
      <div class="stat-card__val">${r.ativas}</div>
      <div class="stat-card__label">Sessões ativas</div>
      <div class="stat-card__sub">${r.usuariosAtivos} usuário${r.usuariosAtivos !== 1 ? 's' : ''} · ${r.ausentes} ausente${r.ausentes !== 1 ? 's' : ''}</div>
    </div>
    <div class="stat-card stat-card--blue">
      <div class="stat-card__icon">📁</div>
      <div class="stat-card__val">${r.encerradas}</div>
      <div class="stat-card__label">Sessões encerradas</div>
      <div class="stat-card__sub">${r.total} no total · ${CONFIG.JANELA_DIAS} dias</div>
    </div>
    <div class="stat-card stat-card--gold">
      <div class="stat-card__icon">⏱️</div>
      <div class="stat-card__val">${esc(formatarDuracao(r.tempoAtivoMedioMs))}</div>
      <div class="stat-card__label">Tempo ativo médio</div>
      <div class="stat-card__sub">${r.amostraTempo} ${r.amostraTempo !== 1 ? 'sessões' : 'sessão'} com medição</div>
    </div>
    <div class="stat-card stat-card--rose">
      <div class="stat-card__icon">📊</div>
      <div class="stat-card__val sx-dev">${totalDisp ? `📱 ${r.mobile} · 🖥️ ${r.desktop}` : '—'}</div>
      <div class="stat-card__label">Dispositivos</div>
      <div class="stat-card__sub">${totalDisp ? `${pct(r.mobile)}% mobile · ${pct(r.desktop)}% desktop` : 'sem dados de dispositivo'}</div>
    </div>`;
}

function _htmlStatus(status) {
  const st = STATUS_INFO[status];
  return st.dot
    ? `<span class="badge ${st.cls} sess-status-ativa"><span class="sess-dot"></span>${st.label}</span>`
    : `<span class="badge ${st.cls}">${st.label}</span>`;
}

function _textoDispositivo(d) {
  return d === 'mobile' ? '📱 Mobile' : d === 'desktop' ? '🖥️ Desktop' : '—';
}

function _textoAtividade(s) {
  if (s.paginas === null) return '—';
  const p = `${s.paginas} pág${s.paginas !== 1 ? 's' : ''}.`;
  return s.navegacoes === null ? p : `${p} · ${s.navegacoes} nav.`;
}

function _htmlLinha({ usuario: u, principal: p, sessoes }, agora) {
  const emAtividade = p.status !== STATUS.ENCERRADA;
  const logs7 = sessoes.filter(s => s.inicio >= agora - CONFIG.MODAL_DIAS * MS_DIA).length;

  return `
    <tr>
      <td>
        <div class="sx-user">
          <span class="sx-user__av">${esc(u.avatar)}</span>
          <span class="sx-user__txt">
            <span class="sx-user__name">${esc(u.nome)}</span>
            <span class="sx-sub">${esc(u.uid)}</span>
          </span>
        </div>
      </td>
      <td>${_htmlStatus(p.status)}</td>
      <td class="sx-num">${esc(formatarDataHora(p.inicio, agora))}</td>
      <td class="sx-num">
        ${esc(formatarDataHora(p.ultimaAtividade, agora))}
        ${emAtividade ? `<span class="sx-sub">${esc(formatarRelativo(agora - p.ultimaAtividade))}</span>` : ''}
      </td>
      <td class="sx-num">${p.encerramentoEm !== null ? esc(formatarDataHora(p.encerramentoEm, agora)) : '—'}</td>
      <td class="sx-strong" title="Tempo com interação real registrado pelo tracker">${esc(formatarDuracao(p.tempoAtivoExibidoMs))}</td>
      <td class="sx-num" title="${p.status === STATUS.ATIVA ? 'Do início até agora' : 'Do início até a última atividade'}">${esc(formatarDuracao(p.janelaMs))}</td>
      <td>${esc(_textoDispositivo(p.dispositivo))}</td>
      <td class="sx-num">${esc(_textoAtividade(p))}</td>
      <td>
        <button class="sess-logs-btn" data-uid="${esc(u.uid)}" title="Ver sessões dos últimos ${CONFIG.MODAL_DIAS} dias">
          Logs ${logs7 ? `<span class="sess-logs-badge">${logs7}</span>` : ''}
        </button>
      </td>
    </tr>`;
}

/* ══════════════════════════════════════════════════════════
   ATUALIZAÇÃO LOCAL (sem Firestore)
   ══════════════════════════════════════════════════════════ */

function _onVisibilidade() {
  if (!document.hidden && document.getElementById('sx-root')) _renderTudo();
}

function _iniciarTick(token) {
  _pararTick();
  _tickTimer = setInterval(() => {
    if (token !== _mountToken || !document.getElementById('sx-root')) { _pararTick(); return; }
    if (document.hidden) return;           // aba em segundo plano: não recalcula
    _renderTudo();
  }, TICK_MS);
  document.addEventListener('visibilitychange', _onVisibilidade);
}

function _pararTick() {
  if (_tickTimer) clearInterval(_tickTimer);
  _tickTimer = null;
  document.removeEventListener('visibilitychange', _onVisibilidade);
}

/* ══════════════════════════════════════════════════════════
   MODAL DE LOGS (7 dias)
   ══════════════════════════════════════════════════════════ */

function _htmlSessaoModal(s, agora) {
  const fim = s.status === STATUS.ATIVA ? 'agora' : formatarFim(s.inicio, s.ultimaAtividade, agora);
  const aproveitamento = (s.tempoAtivoExibidoMs !== null && s.janelaMs >= 60_000)
    ? Math.min(100, Math.round((s.tempoAtivoExibidoMs / s.janelaMs) * 100))
    : null;

  return `
    <div class="sx-card">
      <div class="sx-card__top">
        <span class="sx-card__when"><strong>${esc(formatarDataHora(s.inicio, agora))}</strong> → ${esc(fim)}</span>
        ${_htmlStatus(s.status)}
      </div>
      <div class="sx-card__meta">
        <span>Tempo ativo <b>${esc(formatarDuracao(s.tempoAtivoExibidoMs))}</b></span>
        <span>Janela <b>${esc(formatarDuracao(s.janelaMs))}</b></span>
        <span>${esc(_textoDispositivo(s.dispositivo))}</span>
        <span>${esc(_textoAtividade(s))}</span>
      </div>
      ${aproveitamento !== null
        ? `<div class="sx-bar" title="Tempo ativo = ${aproveitamento}% da janela"><i style="width:${aproveitamento}%"></i></div>`
        : ''}
    </div>`;
}

function _atualizarModal() {
  const ov = document.getElementById('sx-modal');
  const grupo = _grupos.find(g => g.usuario.uid === _modalUid);
  if (!ov || !grupo) return;

  const agora = Date.now();
  const sessoes = grupo.sessoes
    .filter(s => s.inicio >= agora - CONFIG.MODAL_DIAS * MS_DIA)
    .map(s => derivarSessao(s, agora));

  const medidos = sessoes.filter(s => s.tempoAtivoExibidoMs !== null);
  const totalAtivo = medidos.reduce((a, s) => a + s.tempoAtivoExibidoMs, 0);

  ov.querySelector('#sx-modal-stats').innerHTML = `
    <div class="sx-stat"><b>${sessoes.length}</b>sessões</div>
    <div class="sx-sep"></div>
    <div class="sx-stat"><b class="sx-teal">${esc(medidos.length ? formatarDuracao(totalAtivo) : '—')}</b>tempo ativo</div>`;

  ov.querySelector('#sx-modal-body').innerHTML = sessoes.length
    ? sessoes.map(s => _htmlSessaoModal(s, agora)).join('')
    : `<div class="sx-empty">Nenhuma sessão nos últimos ${CONFIG.MODAL_DIAS} dias.</div>`;
}

function _abrirModalLogs(uid) {
  const grupo = _grupos.find(g => g.usuario.uid === uid);
  if (!grupo) return;

  _fecharModalAgora();
  _modalUid = uid;

  const ov = document.createElement('div');
  ov.id = 'sx-modal';
  ov.className = 'sx-ov';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.innerHTML = `
    <div class="sx-box">
      <div class="sx-head">
        <div class="sx-head__user">
          <div class="sx-head__av">${esc(grupo.usuario.avatar)}</div>
          <div style="min-width:0">
            <div class="sx-head__name">${esc(grupo.usuario.nome)}</div>
            <div class="sx-head__sub">Sessões dos últimos ${CONFIG.MODAL_DIAS} dias</div>
          </div>
        </div>
        <div class="sx-head__right">
          <div class="sx-stats" id="sx-modal-stats"></div>
          <button class="sx-close" id="sx-close" aria-label="Fechar">✕</button>
        </div>
      </div>
      <div class="sx-body" id="sx-modal-body"></div>
    </div>`;
  document.body.appendChild(ov);
  _atualizarModal();
  requestAnimationFrame(() => ov.classList.add('sx-ov--show'));

  const fechar = () => {
    _modalUid = null;
    if (_onKeyModal) { document.removeEventListener('keydown', _onKeyModal); _onKeyModal = null; }
    ov.classList.remove('sx-ov--show');
    setTimeout(() => ov.remove(), 220);
  };

  ov.querySelector('#sx-close').addEventListener('click', fechar);
  ov.addEventListener('click', e => { if (e.target === ov) fechar(); });
  _onKeyModal = e => { if (e.key === 'Escape') fechar(); };
  document.addEventListener('keydown', _onKeyModal);
}

function _fecharModalAgora() {
  _modalUid = null;
  if (_onKeyModal) { document.removeEventListener('keydown', _onKeyModal); _onKeyModal = null; }
  document.getElementById('sx-modal')?.remove();
}

/* ══════════════════════════════════════════════════════════
   LIMPEZA — sessões com mais de 30 dias
   ══════════════════════════════════════════════════════════

   O "início" vem do MESMO normalizador usado na tela (startedAt | entrada |
   timestamp do ID). Sessão cujo início não pode ser determinado NÃO é apagada. */

async function _docsCandidatosAntigos(colRef, corte) {
  try {
    const snap = await getDocs(query(colRef, where(documentId(), '<', String(corte))));
    return snap.docs;
  } catch {
    return (await getDocs(colRef)).docs;   // fallback: filtra no cliente abaixo
  }
}

const _TXT_BTN_LIMPAR = '🧹 Limpar antigas';

function _estadoBtnLimpar(ocupado, texto = _TXT_BTN_LIMPAR) {
  const btn = document.getElementById('sess-clear-btn');
  if (!btn) return;
  btn.disabled = ocupado;
  btn.textContent = texto;
}

/* Passo 1 — só LÊ: descobre exatamente o que seria removido. */
async function _planejarLimpeza() {
  const corte    = Date.now() - CONFIG.JANELA_DIAS * MS_DIA;
  const usuarios = (await _getUsuarios()).map(_usuarioPublico);
  const refs = [];
  const usuariosAfetados = new Set();
  let falhas = 0;

  await Promise.all(usuarios.map(async u => {
    try {
      const colRef = collection(getDb(), 'usuarios', u.uid, 'sessoes');
      const docs   = await _docsCandidatosAntigos(colRef, corte);
      for (const d of docs) {
        const ini = inicioDaSessao(d.id, d.data());
        if (ini !== null && ini < corte) { refs.push(d.ref); usuariosAfetados.add(u.uid); }
      }
    } catch (err) {
      falhas++;
      console.error('[admin-sessions] erro ao verificar sessões antigas de', u.uid, err);
    }
  }));

  return { refs, total: refs.length, usuarios: usuariosAfetados.size, falhas };
}

/* Clique no botão: verifica → (se houver algo) confirma com a contagem → executa. */
async function _iniciarLimpeza() {
  const btn = document.getElementById('sess-clear-btn');
  if (!btn || btn.disabled) return;

  _estadoBtnLimpar(true, '⏳ Verificando…');
  let plano;
  try {
    plano = await _planejarLimpeza();
  } catch (err) {
    console.error('[admin-sessions] falha ao planejar a limpeza:', err);
    _estadoBtnLimpar(false);
    _toast('Não foi possível verificar as sessões antigas.', true);
    return;
  }
  _estadoBtnLimpar(false);

  if (plano.total === 0) {
    _toast(
      plano.falhas
        ? `Nada encontrado, mas ${plano.falhas} usuário${plano.falhas !== 1 ? 's' : ''} não ${plano.falhas !== 1 ? 'puderam' : 'pôde'} ser verificado${plano.falhas !== 1 ? 's' : ''}.`
        : `Nenhuma sessão com mais de ${CONFIG.JANELA_DIAS} dias para remover.`,
      plano.falhas > 0
    );
    return;
  }

  _modalConfirmar(
    'Limpar sessões antigas?',
    `${plano.total} registro${plano.total !== 1 ? 's' : ''} com mais de ${CONFIG.JANELA_DIAS} dias ` +
    `(${plano.usuarios} usuário${plano.usuarios !== 1 ? 's' : ''}) ser${plano.total !== 1 ? 'ão' : 'á'} removido${plano.total !== 1 ? 's' : ''}. Não dá para desfazer.`,
    'Remover',
    () => _executarLimpeza(plano),
    document.getElementById('sess-clear-btn')
  );
}

/* Passo 2 — remove exatamente o que foi mostrado na confirmação. */
async function _executarLimpeza(plano) {
  _estadoBtnLimpar(true, '⏳ Removendo…');
  let removidos = 0;
  let erros     = 0;
  let primeiroErro = null;
  const LOTE = 25;

  for (let i = 0; i < plano.refs.length; i += LOTE) {
    const resultados = await Promise.allSettled(plano.refs.slice(i, i + LOTE).map(r => deleteDoc(r)));
    for (const r of resultados) {
      if (r.status === 'fulfilled') removidos++;
      else { erros++; primeiroErro ??= r.reason; }
    }
  }
  _estadoBtnLimpar(false);

  if (erros) {
    console.error('[admin-sessions] falha ao remover sessões antigas:', primeiroErro);
    _toast(`${removidos} removido${removidos !== 1 ? 's' : ''}, ${erros} falhou (sem permissão de exclusão?). Veja o console.`, true);
  } else {
    _toast(`${removidos} registro${removidos !== 1 ? 's' : ''} antigo${removidos !== 1 ? 's' : ''} removido${removidos !== 1 ? 's' : ''}. 🧹`);
  }

  if (document.getElementById('sx-root')) await _carregarSessoes(_mountToken);
}