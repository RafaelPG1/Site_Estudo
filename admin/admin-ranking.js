/* =============================================
   NEXUS STUDY — admin-ranking.js
   Painel de Administração — Seção Ranking
   admin/admin-ranking.js
   ============================================= */

import { getDb } from '../src/firebase.js';

import {
  collection, getDocs,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { _getUsuarios } from './admin.js';

/* ══════════════════════════════════════════════════════════
   SEÇÃO — RANKING
   Tabs: Quiz | Show do Milhão
   ══════════════════════════════════════════════════════════ */

export async function _renderRanking() {
  const users = await _getUsuarios();

  document.getElementById('content').innerHTML = `
    <div class="section-content">

      <div class="tabs" id="ranking-tabs">
        <button class="tab active" data-tab="quiz">🧠 Quiz</button>
        <button class="tab"        data-tab="sm">⭐ Show do Milhão</button>
      </div>

      <!-- RANKING QUIZ -->
      <div class="section-panel" id="ranking-panel-quiz">
        <div class="panel-header">
          <span class="panel-title">Ranking — Quizzes Finalizados</span>
        </div>
        <div id="ranking-quiz-wrap">
          <div class="init-loading"><div class="spinner"></div><p>Calculando…</p></div>
        </div>
      </div>

      <!-- RANKING SHOW DO MILHÃO -->
      <div class="section-panel" id="ranking-panel-sm" style="display:none">
        <div class="panel-header">
          <span class="panel-title">Ranking — Show do Milhão</span>
          <span class="panel-count" style="font-size:.78rem;color:var(--text-3)">Melhor prêmio conquistado · Desempate por precisão</span>
        </div>
        <div id="ranking-sm-wrap">
          <div class="init-loading"><div class="spinner"></div><p>Calculando…</p></div>
        </div>
      </div>

    </div>`;

  document.getElementById('ranking-tabs').addEventListener('click', e => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    const tab = btn.dataset.tab;
    document.querySelectorAll('#ranking-tabs .tab').forEach(b =>
      b.classList.toggle('active', b.dataset.tab === tab)
    );
    document.getElementById('ranking-panel-quiz').style.display = tab === 'quiz' ? '' : 'none';
    document.getElementById('ranking-panel-sm').style.display   = tab === 'sm'   ? '' : 'none';
  });

  const estudantes = users.filter(u => !u.admin);
  _carregarRankingQuiz(estudantes);
  _carregarRankingSm(estudantes);
}

/* ── Ranking Quiz ── */
async function _carregarRankingQuiz(estudantes) {
  const wrap = document.getElementById('ranking-quiz-wrap');

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

  if (!scores.length) { wrap.innerHTML = `<div class="empty-state">Sem dados ainda.</div>`; return; }

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

/* ── Ranking Show do Milhão ── */
async function _carregarRankingSm(estudantes) {
  const wrap = document.getElementById('ranking-sm-wrap');

  const scores = await Promise.all(estudantes.map(async u => {
    try {
      const snap = await getDocs(collection(getDb(), 'usuarios', u.uid, 'sm_pontuacoes'));
      let melhorValorNum = 0;
      let melhorValorStr = '—';
      let melhorAcertos  = 0;
      let melhorPrecisao = 0;
      let melhorTempo    = '—';
      let melhorData     = 0;
      let totalPartidas  = 0;
      let acumulado      = 0;

      snap.forEach(d => {
        const data = d.data();
        totalPartidas += data.totalPartidas ?? (Array.isArray(data.historico) ? data.historico.length : 0);
        acumulado     += data.acumulado ?? 0;
        const vn = data.melhor?.valorNum ?? 0;
        if (vn > melhorValorNum) {
          melhorValorNum = vn;
          melhorValorStr = data.melhor?.valor    ?? '—';
          melhorAcertos  = data.melhor?.acertos  ?? 0;
          melhorPrecisao = data.melhor?.precisao ?? 0;
          melhorTempo    = data.melhor?.tempo     ?? '—';
          melhorData     = data.melhor?.data      ?? 0;
        }
      });

      return {
        uid: u.uid, nome: u.nome ?? u.uid, avatar: u.avatar ?? '🎓',
        melhorValorNum, melhorValorStr,
        melhorAcertos, melhorPrecisao, melhorTempo, melhorData,
        totalPartidas, acumulado,
      };
    } catch {
      return {
        uid: u.uid, nome: u.nome ?? u.uid, avatar: u.avatar ?? '🎓',
        melhorValorNum: 0, melhorValorStr: '—',
        melhorAcertos: 0, melhorPrecisao: 0, melhorTempo: '—', melhorData: 0,
        totalPartidas: 0, acumulado: 0,
      };
    }
  }));

  // Maior prêmio → maior precisão (desempate) → mais partidas
  scores.sort((a, b) => {
    if (b.melhorValorNum !== a.melhorValorNum) return b.melhorValorNum - a.melhorValorNum;
    if (b.melhorPrecisao !== a.melhorPrecisao) return b.melhorPrecisao - a.melhorPrecisao;
    return b.totalPartidas - a.totalPartidas;
  });

  if (!scores.length) { wrap.innerHTML = `<div class="empty-state">Sem dados ainda.</div>`; return; }

  const MEDALS  = ['🥇','🥈','🥉'];
  const CLASSES = ['lb-item--top1','lb-item--top2','lb-item--top3'];

  const comPontos = scores.filter(s => s.melhorValorNum > 0);
  const semPontos = scores.filter(s => s.melhorValorNum === 0);

  const renderItem = (s, posicao, classeEl) => {
    const premioClass = s.melhorValorNum >= 1000000 ? 'badge--gold'
                      : s.melhorValorNum >= 300000  ? 'badge--amber'
                      : s.melhorValorNum >= 30000   ? 'badge--teal'
                      : s.melhorValorNum > 0        ? 'badge--blue'
                      :                               'badge--grey';
    const dataStr = s.melhorData
      ? new Date(s.melhorData).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'2-digit' })
      : '';

    const acumFmt = s.acumulado > 0
      ? '💰 ' + 'R$ ' + s.acumulado.toLocaleString('pt-BR')
      : '';

    return `
      <div class="lb-item ${classeEl}">
        <div class="lb-rank">${posicao}</div>
        <div class="lb-avatar">${s.avatar}</div>
        <div class="lb-info">
          <strong>${s.nome}</strong>
          <span style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
            <span>${s.uid}</span>
            ${s.totalPartidas > 0
              ? `<span class="badge badge--grey" style="font-size:.65rem">${s.totalPartidas} partida${s.totalPartidas !== 1 ? 's' : ''}</span>`
              : ''}
            ${dataStr ? `<span style="font-size:.65rem;color:var(--text-3)">${dataStr}</span>` : ''}
          </span>
        </div>
        <div class="lb-score">
          <span class="badge ${premioClass}" style="font-size:.8rem;padding:4px 10px">
            🏅 ${s.melhorValorStr}
          </span>
          ${acumFmt
            ? `<span class="lb-unit" style="margin-top:3px;font-size:.7rem;color:var(--text-2)">${acumFmt}</span>`
            : ''}
          ${s.melhorValorNum > 0
            ? `<span class="lb-unit" style="margin-top:2px">${s.melhorAcertos} acerto${s.melhorAcertos !== 1 ? 's' : ''} · ${s.melhorPrecisao}%</span>`
            : `<span class="lb-unit" style="margin-top:3px;color:var(--text-3)">sem partidas</span>`}
        </div>
      </div>`;
  };

  wrap.innerHTML = `<div class="leaderboard">
    ${comPontos.map((s, i) =>
        renderItem(s, MEDALS[i] ?? `#${i+1}`, CLASSES[i] ?? '')
      ).join('')}
    ${semPontos.length > 0 ? `
      <div style="text-align:center;padding:10px 0 4px;color:var(--text-3);font-size:.75rem;letter-spacing:.5px">
        — sem pontuação registrada —
      </div>
      ${semPontos.map((s, i) =>
          renderItem(s, `#${comPontos.length + i + 1}`, '')
        ).join('')}
    ` : ''}
  </div>`;
}