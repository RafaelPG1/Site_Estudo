/* =============================================
   NEXUS STUDY — admin-progress.js
   Painel de Administração — Seção Progresso
   admin/admin-progress.js
   ============================================= */

import { getDb } from '../src/firebase.js';
import { limparTodoQuizUsuario } from '../src/firebase.js';

import {
  collection, getDocs, deleteDoc, doc, setDoc,
  getDocsFromServer,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { _getUsuarios, _toast, _modalConfirmar } from './admin.js';

/* ══════════════════════════════════════════════════════════
   SEÇÃO — PROGRESSO
   ══════════════════════════════════════════════════════════ */

export async function _renderProgress() {
  const users      = await _getUsuarios();
  const estudantes = users.filter(u => !u.admin);

  document.getElementById('content').innerHTML = `
    <div class="section-content">

      <div class="section-toolbar">
        <input type="text" class="search-input" id="prog-search" placeholder="Filtrar por usuário…">
      </div>

      <!-- TABS -->
      <div class="tabs" id="prog-tabs">
        <button class="tab active" data-tab="quiz">🧠 Quiz</button>
        <button class="tab" data-tab="pessoal">📋 Área Pessoal</button>
        <button class="tab" data-tab="srs">🃏 Flashcard (SRS)</button>
        <button class="tab" data-tab="vf">✅ V ou F</button>
        <button class="tab" data-tab="sm">⭐ Show do Milhão</button>
        <button class="tab" data-tab="assoc">🔗 Associação</button>
      </div>

      <!-- PAINEL QUIZ -->
      <div class="section-panel" id="prog-panel-quiz">
        <div class="panel-header">
          <span class="panel-title">Progresso — Quiz</span>
          <span class="panel-count" id="prog-quiz-count">${estudantes.length} estudantes</span>
        </div>
        <div id="prog-quiz-wrap" class="data-table-wrap">
          <div class="init-loading"><div class="spinner"></div><p>Carregando…</p></div>
        </div>
      </div>

      <!-- PAINEL ÁREA PESSOAL -->
      <div class="section-panel" id="prog-panel-pessoal" style="display:none">
        <div class="panel-header">
          <span class="panel-title">Progresso — Área Pessoal</span>
          <span class="panel-count" id="prog-pessoal-count">${estudantes.length} estudantes</span>
        </div>
        <div id="prog-pessoal-wrap" class="data-table-wrap">
          <div class="init-loading"><div class="spinner"></div><p>Carregando…</p></div>
        </div>
      </div>

      <!-- PAINEL SRS -->
      <div class="section-panel" id="prog-panel-srs" style="display:none">
        <div class="panel-header">
          <span class="panel-title">Progresso — Flashcard / SRS</span>
          <span class="panel-count" id="prog-srs-count">${estudantes.length} estudantes</span>
        </div>
        <div id="prog-srs-wrap" class="data-table-wrap">
          <div class="init-loading"><div class="spinner"></div><p>Carregando…</p></div>
        </div>
      </div>

      <!-- PAINEL V/F -->
      <div class="section-panel" id="prog-panel-vf" style="display:none">
        <div class="panel-header">
          <span class="panel-title">Progresso — Verdadeiro ou Falso</span>
          <span class="panel-count" id="prog-vf-count">${estudantes.length} estudantes</span>
        </div>
        <div id="prog-vf-wrap" class="data-table-wrap">
          <div class="init-loading"><div class="spinner"></div><p>Carregando…</p></div>
        </div>
      </div>

      <!-- PAINEL SHOW DO MILHÃO -->
      <div class="section-panel" id="prog-panel-sm" style="display:none">
        <div class="panel-header">
          <span class="panel-title">Progresso — Show do Milhão</span>
          <span class="panel-count" id="prog-sm-count">${estudantes.length} estudantes</span>
        </div>
        <div id="prog-sm-wrap" class="data-table-wrap">
          <div class="init-loading"><div class="spinner"></div><p>Carregando…</p></div>
        </div>
      </div>

      <!-- PAINEL ASSOCIAÇÃO -->
      <div class="section-panel" id="prog-panel-assoc" style="display:none">
        <div class="panel-header">
          <span class="panel-title">Progresso — Associação</span>
          <span class="panel-count" id="prog-assoc-count">${estudantes.length} estudantes</span>
        </div>
        <div id="prog-assoc-wrap" class="data-table-wrap">
          <div class="init-loading"><div class="spinner"></div><p>Carregando…</p></div>
        </div>
      </div>

    </div>`;

  /* ── Tab switching ── */
  const TABS = ['quiz', 'pessoal', 'srs', 'vf', 'sm', 'assoc'];
  document.getElementById('prog-tabs').addEventListener('click', e => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    const tab = btn.dataset.tab;
    document.querySelectorAll('#prog-tabs .tab').forEach(b =>
      b.classList.toggle('active', b.dataset.tab === tab)
    );
    TABS.forEach(t => {
      document.getElementById(`prog-panel-${t}`).style.display = t === tab ? '' : 'none';
    });
  });

  /* ── Filtro de busca ── */
  document.getElementById('prog-search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    _filtrarTabela('prog-quiz-wrap',    q);
    _filtrarTabela('prog-pessoal-wrap', q);
    _filtrarTabela('prog-srs-wrap',     q);
    _filtrarTabela('prog-vf-wrap',      q);
    _filtrarTabela('prog-sm-wrap',      q);
    _filtrarTabela('prog-assoc-wrap',   q);
  });

  /* ── Carrega todos os painéis em paralelo ── */
  _carregarQuizProgress(estudantes);
  _carregarPessoalProgress(estudantes);
  _carregarSrsProgress(estudantes);
  _carregarVfProgress(estudantes);
  _carregarSmProgress(estudantes);
  _carregarAssocProgress(estudantes);
}

/* ── Filtra linhas da tabela por texto ── */
function _filtrarTabela(wrapId, q) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  wrap.querySelectorAll('tbody tr').forEach(tr => {
    const txt = tr.textContent.toLowerCase();
    tr.style.display = txt.includes(q) ? '' : 'none';
  });
}

/* ──────────────────────────────────────────────
   QUIZ PROGRESS
────────────────────────────────────────────── */
async function _carregarQuizProgress(estudantes) {
  const wrap = document.getElementById('prog-quiz-wrap');

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

  wrap.innerHTML = _buildQuizTable(dados);
  _bindQuizActions(dados);
}

function _buildQuizTable(dados) {
  if (!dados.length) return `<div class="empty-state">Nenhum dado encontrado.</div>`;
  return `
    <table class="data-table">
      <thead><tr>
        <th>Usuário</th>
        <th>ID</th>
        <th>Salvos</th>
        <th>Finalizados</th>
        <th>Ações</th>
      </tr></thead>
      <tbody>
        ${dados.map(r => `
          <tr data-uid="${r.uid}">
            <td><span style="font-size:1.1rem;margin-right:6px">${r.avatar}</span>${r.nome}</td>
            <td><code class="quiz-id">${r.uid}</code></td>
            <td>${r.total}</td>
            <td>
              <span class="badge ${r.finalizados > 0 ? 'badge--green' : 'badge--grey'}">
                ${r.finalizados}
              </span>
            </td>
            <td>
              <button class="icon-btn icon-btn--rose btn-limpar-quiz"
                      data-uid="${r.uid}" data-nome="${r.nome}"
                      ${r.total === 0 ? 'disabled' : ''}>
                🧹 Limpar
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

function _bindQuizActions(dados) {
  document.querySelectorAll('.btn-limpar-quiz').forEach(btn => {
    btn.addEventListener('click', () =>
      _modalConfirmar(
        `Limpar quiz de <strong>${btn.dataset.nome}</strong>?`,
        'Remove todo o progresso de quiz salvo no Firestore.',
        'Limpar',
        async () => {
          const res = await limparTodoQuizUsuario(btn.dataset.uid);
          if (res.ok) {
            _toast(`Quiz de ${btn.dataset.nome} limpo! 🧹`);
            await _carregarQuizProgress(dados);
          } else {
            _toast('Erro ao limpar.', true);
          }
        },
        btn
      )
    );
  });
}

/* ──────────────────────────────────────────────
   ÁREA PESSOAL PROGRESS
────────────────────────────────────────────── */

async function _getPessoalDocs(uid) {
  try {
    const snap = await getDocsFromServer(collection(getDb(), 'usuarios', uid, 'pessoal'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}

async function _carregarPessoalProgress(estudantes) {
  const wrap = document.getElementById('prog-pessoal-wrap');

  const dados = await Promise.all(estudantes.map(async u => {
    const docs = await _getPessoalDocs(u.uid);

    let totalChecked = 0;
    let totalTarefas = 0;
    let totalNotas   = 0;

    docs.forEach(d => {
      if (Array.isArray(d.checklist)) totalChecked += d.checklist.length;
      if (Array.isArray(d.categorias)) {
        d.categorias.forEach(cat => {
          if (Array.isArray(cat.itens)) totalTarefas += cat.itens.length;
        });
      }
      if (typeof d.nota === 'string' && d.nota.trim()) totalNotas++;
    });

    return {
      uid: u.uid, nome: u.nome ?? u.uid, avatar: u.avatar ?? '🎓',
      docs: docs.length,
      totalChecked, totalTarefas, totalNotas,
    };
  }));

  wrap.innerHTML = _buildPessoalTable(dados);
  _bindPessoalActions(estudantes, dados);
}

function _buildPessoalTable(dados) {
  if (!dados.length) return `<div class="empty-state">Nenhum dado encontrado.</div>`;
  return `
    <table class="data-table">
      <thead><tr>
        <th>Usuário</th>
        <th>ID</th>
        <th>✅ Itens marcados</th>
        <th>📋 Tarefas</th>
        <th>📝 Notas</th>
        <th>Ações</th>
      </tr></thead>
      <tbody>
        ${dados.map(r => `
          <tr data-uid="${r.uid}">
            <td><span style="font-size:1.1rem;margin-right:6px">${r.avatar}</span>${r.nome}</td>
            <td><code class="quiz-id">${r.uid}</code></td>
            <td>
              <span class="badge ${r.totalChecked > 0 ? 'badge--teal' : 'badge--grey'}">
                ${r.totalChecked}
              </span>
            </td>
            <td>
              <span class="badge ${r.totalTarefas > 0 ? 'badge--blue' : 'badge--grey'}">
                ${r.totalTarefas}
              </span>
            </td>
            <td>
              <span class="badge ${r.totalNotas > 0 ? 'badge--amber' : 'badge--grey'}">
                ${r.totalNotas} disc
              </span>
            </td>
            <td style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center">
              <button class="icon-btn icon-btn--teal  btn-limpar-checklist"
                      data-uid="${r.uid}" data-nome="${r.nome}"
                      ${r.totalChecked === 0 ? 'disabled' : ''}>
                ✅ Checklist
              </button>
              <button class="icon-btn icon-btn--blue  btn-limpar-tarefas"
                      data-uid="${r.uid}" data-nome="${r.nome}"
                      ${r.totalTarefas === 0 ? 'disabled' : ''}>
                📋 Tarefas
              </button>
              <button class="icon-btn icon-btn--gold  btn-limpar-notas"
                      data-uid="${r.uid}" data-nome="${r.nome}"
                      ${r.totalNotas === 0 ? 'disabled' : ''}>
                📝 Notas
              </button>
              <button class="icon-btn icon-btn--rose  btn-limpar-pessoal-tudo"
                      data-uid="${r.uid}" data-nome="${r.nome}"
                      ${r.totalChecked === 0 && r.totalTarefas === 0 && r.totalNotas === 0 ? 'disabled' : ''}>
                🗑️ Tudo
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

function _bindPessoalActions(estudantes, dados) {
  const _reload = () => _carregarPessoalProgress(estudantes);

  document.querySelectorAll('.btn-limpar-checklist').forEach(btn => {
    btn.addEventListener('click', () =>
      _modalConfirmar(
        `Limpar checklist de <strong>${btn.dataset.nome}</strong>?`,
        'Desmarca todos os itens do checklist de todas as disciplinas.',
        'Limpar',
        async () => {
          await _limparCampoPessoal(btn.dataset.uid, 'checklist', []);
          _toast(`Checklist de ${btn.dataset.nome} limpo! ✅`);
          _reload();
        },
        btn
      )
    );
  });

  document.querySelectorAll('.btn-limpar-tarefas').forEach(btn => {
    btn.addEventListener('click', () =>
      _modalConfirmar(
        `Limpar tarefas de <strong>${btn.dataset.nome}</strong>?`,
        'Remove todas as categorias e tarefas de todas as disciplinas.',
        'Limpar',
        async () => {
          await _limparCampoPessoal(btn.dataset.uid, 'categorias', []);
          _toast(`Tarefas de ${btn.dataset.nome} limpas! 📋`);
          _reload();
        },
        btn
      )
    );
  });

  document.querySelectorAll('.btn-limpar-notas').forEach(btn => {
    btn.addEventListener('click', () =>
      _modalConfirmar(
        `Limpar notas de <strong>${btn.dataset.nome}</strong>?`,
        'Apaga as anotações de todas as disciplinas.',
        'Limpar',
        async () => {
          await _limparCampoPessoal(btn.dataset.uid, 'nota', '');
          _toast(`Notas de ${btn.dataset.nome} limpas! 📝`);
          _reload();
        },
        btn
      )
    );
  });

  document.querySelectorAll('.btn-limpar-pessoal-tudo').forEach(btn => {
    btn.addEventListener('click', () =>
      _modalConfirmar(
        `Limpar TUDO de <strong>${btn.dataset.nome}</strong>?`,
        'Remove checklist, tarefas e notas de todas as disciplinas.',
        'Limpar tudo',
        async () => {
          await _limparTodoPessoal(btn.dataset.uid);
          _toast(`Área Pessoal de ${btn.dataset.nome} limpa! 🗑️`);
          await _reload();
        },
        btn
      )
    );
  });
}

async function _limparCampoPessoal(uid, campo, valorVazio) {
  try {
    const snap = await getDocs(collection(getDb(), 'usuarios', uid, 'pessoal'));
    await Promise.all(snap.docs.map(d =>
      setDoc(d.ref, { [campo]: valorVazio }, { merge: true })
    ));
    console.log(`[admin] _limparCampoPessoal: uid="${uid}" campo="${campo}" ok`);
  } catch (err) {
    console.error('[admin] _limparCampoPessoal erro:', err);
  }
}

async function _limparTodoPessoal(uid) {
  await _limparCampoPessoal(uid, 'checklist', []);
  await _limparCampoPessoal(uid, 'categorias', []);
  await _limparCampoPessoal(uid, 'nota', '');
}

/* ──────────────────────────────────────────────
   SRS / FLASHCARD PROGRESS
────────────────────────────────────────────── */
async function _carregarSrsProgress(estudantes) {
  const wrap = document.getElementById('prog-srs-wrap');

  const dados = await Promise.all(estudantes.map(async u => {
    try {
      const snap = await getDocs(collection(getDb(), 'usuarios', u.uid, 'srs_perfis'));
      let totalCards = 0;
      const discs = new Set();
      snap.forEach(d => {
        const data = d.data();
        discs.add(d.id.split('_')[0]);
        if (data.cards && typeof data.cards === 'object') {
          totalCards += Object.keys(data.cards).length;
        }
      });
      return {
        uid: u.uid, nome: u.nome ?? u.uid, avatar: u.avatar ?? '🎓',
        perfis: snap.size, discs: discs.size, totalCards,
      };
    } catch {
      return { uid: u.uid, nome: u.nome ?? u.uid, avatar: u.avatar ?? '🎓', perfis: 0, discs: 0, totalCards: 0 };
    }
  }));

  wrap.innerHTML = _buildSrsTable(dados);
  _bindSrsActions(estudantes, dados);
}

function _buildSrsTable(dados) {
  if (!dados.length) return `<div class="empty-state">Nenhum dado encontrado.</div>`;
  return `
    <table class="data-table">
      <thead><tr>
        <th>Usuário</th>
        <th>ID</th>
        <th>Disciplinas</th>
        <th>Cards estudados</th>
        <th>Ações</th>
      </tr></thead>
      <tbody>
        ${dados.map(r => `
          <tr data-uid="${r.uid}">
            <td><span style="font-size:1.1rem;margin-right:6px">${r.avatar}</span>${r.nome}</td>
            <td><code class="quiz-id">${r.uid}</code></td>
            <td>
              <span class="badge ${r.discs > 0 ? 'badge--teal' : 'badge--grey'}">
                ${r.discs} disc
              </span>
            </td>
            <td>
              <span class="badge ${r.totalCards > 0 ? 'badge--green' : 'badge--grey'}">
                ${r.totalCards}
              </span>
            </td>
            <td>
              <button class="icon-btn icon-btn--rose btn-limpar-srs"
                      data-uid="${r.uid}" data-nome="${r.nome}"
                      ${r.perfis === 0 ? 'disabled' : ''}>
                🧹 Limpar SRS
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

function _bindSrsActions(estudantes, dados) {
  document.querySelectorAll('.btn-limpar-srs').forEach(btn => {
    btn.addEventListener('click', () =>
      _modalConfirmar(
        `Limpar SRS de <strong>${btn.dataset.nome}</strong>?`,
        'Zera todo o progresso de repetição espaçada do flashcard.',
        'Limpar',
        async () => {
          await _limparSrsUsuario(btn.dataset.uid);
          _toast(`SRS de ${btn.dataset.nome} limpo! 🃏`);
          _carregarSrsProgress(estudantes);
        },
        btn
      )
    );
  });
}

async function _limparSrsUsuario(uid) {
  try {
    const snap = await getDocs(collection(getDb(), 'usuarios', uid, 'srs_perfis'));
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
    console.log(`[admin] _limparSrsUsuario: uid="${uid}" ok (${snap.size} docs)`);
  } catch (err) {
    console.error('[admin] _limparSrsUsuario erro:', err);
  }
}

/* ──────────────────────────────────────────────
   V/F (VERDADEIRO OU FALSO) PROGRESS
────────────────────────────────────────────── */
async function _carregarVfProgress(estudantes) {
  const wrap = document.getElementById('prog-vf-wrap');

  const dados = await Promise.all(estudantes.map(async u => {
    try {
      const snap = await getDocs(collection(getDb(), 'usuarios', u.uid, 'vf_historico'));
      let totalQuestoes = 0, totalTentativas = 0, totalAcertos = 0, totalErros = 0;
      const discs = new Set();

      snap.forEach(d => {
        const idx = d.id.indexOf('_');
        if (idx !== -1) discs.add(d.id.slice(idx + 1));
        const data = d.data();
        Object.values(data).forEach(q => {
          if (q && typeof q === 'object') {
            totalQuestoes++;
            totalTentativas += q.tentativas ?? 0;
            totalAcertos    += q.acertos    ?? 0;
            totalErros      += q.erros      ?? 0;
          }
        });
      });

      const taxa = totalTentativas > 0
        ? Math.round((totalAcertos / totalTentativas) * 100)
        : null;

      return {
        uid: u.uid, nome: u.nome ?? u.uid, avatar: u.avatar ?? '🎓',
        docs: snap.size, discs: discs.size,
        totalQuestoes, totalTentativas, totalAcertos, totalErros, taxa,
      };
    } catch {
      return {
        uid: u.uid, nome: u.nome ?? u.uid, avatar: u.avatar ?? '🎓',
        docs: 0, discs: 0,
        totalQuestoes: 0, totalTentativas: 0, totalAcertos: 0, totalErros: 0, taxa: null,
      };
    }
  }));

  wrap.innerHTML = _buildVfTable(dados);
  _bindVfActions(estudantes, dados);
}

function _buildVfTable(dados) {
  if (!dados.length) return `<div class="empty-state">Nenhum dado encontrado.</div>`;

  return `
    <table class="data-table">
      <thead><tr>
        <th>Usuário</th>
        <th>ID</th>
        <th>Disciplinas</th>
        <th>Questões vistas</th>
        <th>✅ Acertos</th>
        <th>❌ Erros</th>
        <th>Taxa</th>
        <th>Ações</th>
      </tr></thead>
      <tbody>
        ${dados.map(r => {
          const taxaClass = r.taxa === null ? 'badge--grey'
                         : r.taxa >= 70    ? 'badge--green'
                         : r.taxa >= 40    ? 'badge--amber'
                         :                   'badge--rose';
          const taxaLabel = r.taxa === null ? '—' : `${r.taxa}%`;
          return `
          <tr data-uid="${r.uid}">
            <td><span style="font-size:1.1rem;margin-right:6px">${r.avatar}</span>${r.nome}</td>
            <td><code class="quiz-id">${r.uid}</code></td>
            <td>
              <span class="badge ${r.discs > 0 ? 'badge--teal' : 'badge--grey'}">
                ${r.discs} disc
              </span>
            </td>
            <td>
              <span class="badge ${r.totalQuestoes > 0 ? 'badge--blue' : 'badge--grey'}">
                ${r.totalQuestoes}
              </span>
            </td>
            <td>
              <span class="badge ${r.totalAcertos > 0 ? 'badge--green' : 'badge--grey'}">
                ${r.totalAcertos}
              </span>
            </td>
            <td>
              <span class="badge ${r.totalErros > 0 ? 'badge--rose' : 'badge--grey'}">
                ${r.totalErros}
              </span>
            </td>
            <td>
              <span class="badge ${taxaClass}">${taxaLabel}</span>
            </td>
            <td>
              <button class="icon-btn icon-btn--rose btn-limpar-vf"
                      data-uid="${r.uid}" data-nome="${r.nome}"
                      ${r.docs === 0 ? 'disabled' : ''}>
                🧹 Limpar
              </button>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

function _bindVfActions(estudantes, dados) {
  document.querySelectorAll('.btn-limpar-vf').forEach(btn => {
    btn.addEventListener('click', () =>
      _modalConfirmar(
        `Limpar V/F de <strong>${btn.dataset.nome}</strong>?`,
        'Apaga todo o histórico de Verdadeiro ou Falso do Firestore.',
        'Limpar',
        async () => {
          await _limparVfUsuario(btn.dataset.uid);
          _toast(`Histórico V/F de ${btn.dataset.nome} limpo! 🧹`);
          _carregarVfProgress(estudantes);
        },
        btn
      )
    );
  });
}

async function _limparVfUsuario(uid) {
  try {
    // 1. Apaga Firestore: usuarios/{uid}/vf_historico/*
    const snap = await getDocs(collection(getDb(), 'usuarios', uid, 'vf_historico'));
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
    console.log(`[admin] _limparVfUsuario Firestore: uid="${uid}" ok (${snap.size} docs)`);

    // 2. Apaga localStorage: todas as chaves nexus_vf_{uid}_*
    // Padrão de chave (storage_vf.js): nexus_vf_{usuario}_{discId}_{sem}
    const prefixo = `nexus_vf_${uid}_`;
    const keysParaRemover = Object.keys(localStorage).filter(k => k.startsWith(prefixo));
    keysParaRemover.forEach(k => localStorage.removeItem(k));
    if (keysParaRemover.length) {
      console.log(`[admin] _limparVfUsuario localStorage: ${keysParaRemover.length} chave(s) removida(s) → ${uid}`);
    }
  } catch (err) {
    console.error('[admin] _limparVfUsuario erro:', err);
  }
}

/* ──────────────────────────────────────────────
   SHOW DO MILHÃO — PROGRESSO
   Lê sm_historico (questões) + sm_pontuacoes (melhor prêmio e partidas)
   Botões: limpar só pontuação | limpar tudo
────────────────────────────────────────────── */
async function _carregarSmProgress(estudantes) {
  const wrap = document.getElementById('prog-sm-wrap');

  const dados = await Promise.all(estudantes.map(async u => {
    try {
      // ── Histórico de questões ──
      const snapHist = await getDocs(collection(getDb(), 'usuarios', u.uid, 'sm_historico'));
      let totalQuestoes = 0, totalTentativas = 0, totalAcertos = 0, totalErros = 0;
      const discs = new Set();

      snapHist.forEach(d => {
        const idx = d.id.indexOf('__');
        if (idx !== -1) discs.add(d.id.slice(0, idx));
        const data = d.data();
        Object.values(data).forEach(q => {
          if (q && typeof q === 'object') {
            totalQuestoes++;
            totalTentativas += q.tentativas ?? 0;
            totalAcertos    += q.acertos    ?? 0;
            totalErros      += q.erros      ?? 0;
          }
        });
      });

      const taxa = totalTentativas > 0
        ? Math.round((totalAcertos / totalTentativas) * 100)
        : null;

      // ── Pontuações (sm_pontuacoes) ──
      const snapPont = await getDocs(collection(getDb(), 'usuarios', u.uid, 'sm_pontuacoes'));
      let melhorValorNum = 0;
      let melhorValorStr = '—';
      let totalPartidas  = 0;
      let acumulado      = 0;

      snapPont.forEach(d => {
        const data = d.data();
        // totalPartidas: prefer campo direto, fallback para historico.length
        totalPartidas += data.totalPartidas ?? (Array.isArray(data.historico) ? data.historico.length : 0);
        // acumulado: soma dos campos acumulado de cada doc
        acumulado += data.acumulado ?? 0;
        const vn = data.melhor?.valorNum ?? 0;
        if (vn > melhorValorNum) {
          melhorValorNum = vn;
          melhorValorStr = data.melhor?.valor ?? '—';
        }
      });

      return {
        uid: u.uid, nome: u.nome ?? u.uid, avatar: u.avatar ?? '🎓',
        docsHist: snapHist.size, docsPont: snapPont.size,
        discs: discs.size,
        totalQuestoes, totalTentativas, totalAcertos, totalErros, taxa,
        melhorValorStr, melhorValorNum, totalPartidas, acumulado,
      };
    } catch {
      return {
        uid: u.uid, nome: u.nome ?? u.uid, avatar: u.avatar ?? '🎓',
        docsHist: 0, docsPont: 0, discs: 0,
        totalQuestoes: 0, totalTentativas: 0, totalAcertos: 0, totalErros: 0, taxa: null,
        melhorValorStr: '—', melhorValorNum: 0, totalPartidas: 0, acumulado: 0,
      };
    }
  }));

  wrap.innerHTML = _buildSmTable(dados);
  _bindSmActions(estudantes, dados);
}

function _buildSmTable(dados) {
  if (!dados.length) return `<div class="empty-state">Nenhum dado encontrado.</div>`;

  return `
    <table class="data-table">
      <thead><tr>
        <th>Usuário</th>
        <th>ID</th>
        <th>Discs</th>
        <th>Partidas</th>
        <th>🏅 Melhor prêmio</th>
        <th>💰 Acumulado</th>
        <th>✅ Acertos</th>
        <th>❌ Erros</th>
        <th>Taxa</th>
        <th>Ações</th>
      </tr></thead>
      <tbody>
        ${dados.map(r => {
          const taxaClass = r.taxa === null ? 'badge--grey'
                         : r.taxa >= 70    ? 'badge--green'
                         : r.taxa >= 40    ? 'badge--amber'
                         :                   'badge--rose';
          const taxaLabel = r.taxa === null ? '—' : `${r.taxa}%`;

          const premioClass = r.melhorValorNum >= 1000000 ? 'badge--gold'
                            : r.melhorValorNum >= 300000  ? 'badge--amber'
                            : r.melhorValorNum >= 30000   ? 'badge--teal'
                            : r.melhorValorNum > 0        ? 'badge--blue'
                            :                               'badge--grey';

          const acumClass = r.acumulado >= 1000000 ? 'badge--gold'
                          : r.acumulado >= 300000  ? 'badge--amber'
                          : r.acumulado >= 30000   ? 'badge--teal'
                          : r.acumulado > 0        ? 'badge--blue'
                          :                          'badge--grey';
          const acumFmt = r.acumulado > 0
            ? 'R$ ' + r.acumulado.toLocaleString('pt-BR')
            : '—';

          const semDados = r.docsHist === 0 && r.docsPont === 0;

          return `
          <tr data-uid="${r.uid}">
            <td><span style="font-size:1.1rem;margin-right:6px">${r.avatar}</span>${r.nome}</td>
            <td><code class="quiz-id">${r.uid}</code></td>
            <td>
              <span class="badge ${r.discs > 0 ? 'badge--teal' : 'badge--grey'}">
                ${r.discs} disc
              </span>
            </td>
            <td>
              <span class="badge ${r.totalPartidas > 0 ? 'badge--blue' : 'badge--grey'}">
                ${r.totalPartidas}
              </span>
            </td>
            <td>
              <span class="badge ${premioClass}" title="${r.melhorValorNum > 0 ? r.melhorValorStr : 'Sem pontuação'}">
                ${r.melhorValorStr}
              </span>
            </td>
            <td>
              <span class="badge ${acumClass}" title="Soma de todos os prêmios">
                ${acumFmt}
              </span>
            </td>
            <td>
              <span class="badge ${r.totalAcertos > 0 ? 'badge--green' : 'badge--grey'}">
                ${r.totalAcertos}
              </span>
            </td>
            <td>
              <span class="badge ${r.totalErros > 0 ? 'badge--rose' : 'badge--grey'}">
                ${r.totalErros}
              </span>
            </td>
            <td>
              <span class="badge ${taxaClass}">${taxaLabel}</span>
            </td>
            <td>
              <button class="icon-btn icon-btn--rose btn-limpar-sm-tudo"
                      data-uid="${r.uid}" data-nome="${r.nome}"
                      ${semDados ? 'disabled' : ''}>
                🧹 Limpar
              </button>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

function _bindSmActions(estudantes) {
  // Limpar tudo (histórico de questões + pontuações)
  document.querySelectorAll('.btn-limpar-sm-tudo').forEach(btn => {
    btn.addEventListener('click', () =>
      _modalConfirmar(
        `Limpar TUDO do Show do Milhão de <strong>${btn.dataset.nome}</strong>?`,
        'Apaga histórico de questões E histórico de pontuações/prêmios permanentemente.',
        'Limpar tudo',
        async () => {
          await _limparSmCompleto(btn.dataset.uid);
          _toast(`Show do Milhão de ${btn.dataset.nome} zerado! 🧹`);
          _carregarSmProgress(estudantes);
        },
        btn
      )
    );
  });
}

async function _limparSmPontuacoes(uid) {
  try {
    const snap = await getDocs(collection(getDb(), 'usuarios', uid, 'sm_pontuacoes'));
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
    console.log(`[admin] _limparSmPontuacoes: uid="${uid}" ok (${snap.size} docs)`);
  } catch (err) {
    console.error('[admin] _limparSmPontuacoes erro:', err);
  }
}

async function _limparSmHistorico(uid) {
  try {
    const snap = await getDocs(collection(getDb(), 'usuarios', uid, 'sm_historico'));
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
    console.log(`[admin] _limparSmHistorico: uid="${uid}" ok (${snap.size} docs)`);
  } catch (err) {
    console.error('[admin] _limparSmHistorico erro:', err);
  }
}

async function _limparSmCompleto(uid) {
  await Promise.all([
    _limparSmHistorico(uid),
    _limparSmPontuacoes(uid),
  ]);
}

/* ──────────────────────────────────────────────
   ASSOCIAÇÃO — PROGRESSO
────────────────────────────────────────────── */
async function _carregarAssocProgress(estudantes) {
  const wrap = document.getElementById('prog-assoc-wrap');

  const dados = await Promise.all(estudantes.map(async u => {
    try {
      const snap = await getDocs(collection(getDb(), 'usuarios', u.uid, 'assoc_historico'));
      let totalPares = 0, totalTentativas = 0, totalAcertos = 0, totalErros = 0;
      const discs = new Set();

      snap.forEach(d => {
        const idx = d.id.indexOf('_');
        if (idx !== -1) discs.add(d.id.slice(idx + 1));
        const data = d.data();
        Object.values(data).forEach(q => {
          if (q && typeof q === 'object') {
            totalPares++;
            totalTentativas += q.tentativas ?? 0;
            totalAcertos    += q.acertos    ?? 0;
            totalErros      += q.erros      ?? 0;
          }
        });
      });

      const taxa = totalTentativas > 0
        ? Math.round((totalAcertos / totalTentativas) * 100)
        : null;

      return {
        uid: u.uid, nome: u.nome ?? u.uid, avatar: u.avatar ?? '🎓',
        docs: snap.size, discs: discs.size,
        totalPares, totalTentativas, totalAcertos, totalErros, taxa,
      };
    } catch {
      return {
        uid: u.uid, nome: u.nome ?? u.uid, avatar: u.avatar ?? '🎓',
        docs: 0, discs: 0,
        totalPares: 0, totalTentativas: 0, totalAcertos: 0, totalErros: 0, taxa: null,
      };
    }
  }));

  wrap.innerHTML = _buildAssocTable(dados);
  _bindAssocActions(estudantes, dados);
}

function _buildAssocTable(dados) {
  if (!dados.length) return `<div class="empty-state">Nenhum dado encontrado.</div>`;

  return `
    <table class="data-table">
      <thead><tr>
        <th>Usuário</th>
        <th>ID</th>
        <th>Disciplinas</th>
        <th>Pares vistos</th>
        <th>✅ Acertos</th>
        <th>❌ Erros</th>
        <th>Taxa</th>
        <th>Ações</th>
      </tr></thead>
      <tbody>
        ${dados.map(r => {
          const taxaClass = r.taxa === null ? 'badge--grey'
                         : r.taxa >= 70    ? 'badge--green'
                         : r.taxa >= 40    ? 'badge--amber'
                         :                   'badge--rose';
          const taxaLabel = r.taxa === null ? '—' : `${r.taxa}%`;
          return `
          <tr data-uid="${r.uid}">
            <td><span style="font-size:1.1rem;margin-right:6px">${r.avatar}</span>${r.nome}</td>
            <td><code class="quiz-id">${r.uid}</code></td>
            <td>
              <span class="badge ${r.discs > 0 ? 'badge--teal' : 'badge--grey'}">
                ${r.discs} disc
              </span>
            </td>
            <td>
              <span class="badge ${r.totalPares > 0 ? 'badge--blue' : 'badge--grey'}">
                ${r.totalPares}
              </span>
            </td>
            <td>
              <span class="badge ${r.totalAcertos > 0 ? 'badge--green' : 'badge--grey'}">
                ${r.totalAcertos}
              </span>
            </td>
            <td>
              <span class="badge ${r.totalErros > 0 ? 'badge--rose' : 'badge--grey'}">
                ${r.totalErros}
              </span>
            </td>
            <td>
              <span class="badge ${taxaClass}">${taxaLabel}</span>
            </td>
            <td>
              <button class="icon-btn icon-btn--rose btn-limpar-assoc"
                      data-uid="${r.uid}" data-nome="${r.nome}"
                      ${r.docs === 0 ? 'disabled' : ''}>
                🧹 Limpar
              </button>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

function _bindAssocActions(estudantes, dados) {
  document.querySelectorAll('.btn-limpar-assoc').forEach(btn => {
    btn.addEventListener('click', () =>
      _modalConfirmar(
        `Limpar Associação de <strong>${btn.dataset.nome}</strong>?`,
        'Apaga todo o histórico de Associação do Firestore.',
        'Limpar',
        async () => {
          await _limparAssocUsuario(btn.dataset.uid);
          _toast(`Histórico Associação de ${btn.dataset.nome} limpo! 🧹`);
          _carregarAssocProgress(estudantes);
        },
        btn
      )
    );
  });
}

async function _limparAssocUsuario(uid) {
  try {
    const snap = await getDocs(collection(getDb(), 'usuarios', uid, 'assoc_historico'));
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
    console.log(`[admin] _limparAssocUsuario Firestore: uid="${uid}" ok (${snap.size} docs)`);

    const prefixo = `nexus_assoc_${uid}_`;
    const keysParaRemover = Object.keys(localStorage).filter(k => k.startsWith(prefixo));
    keysParaRemover.forEach(k => localStorage.removeItem(k));
    if (keysParaRemover.length) {
      console.log(`[admin] _limparAssocUsuario localStorage: ${keysParaRemover.length} chave(s) → ${uid}`);
    }
  } catch (err) {
    console.error('[admin] _limparAssocUsuario erro:', err);
  }
}