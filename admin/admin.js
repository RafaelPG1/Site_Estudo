/* =============================================
   NEXUS ADMIN — admin.js
   Painel de controle administrativo
   ============================================= */

import {
  login,
  getUsuarios,
  criarUsuario,
  removerUsuario,
  resetarPin,
  limparTodoQuizUsuario,
  hashPin,
} from '../src/firebase.js';

import { SEMESTRES, getDisciplinasDeSemestre } from '../src/global.js';
import { limparPerfisSRS } from '../games/jogos/flashcard/storage.js';

/* ─────────────────────────────────────────────
   ESTADO
───────────────────────────────────────────── */
let _admin    = null;   // { uid, nome, avatar }
let _usuarios = [];
let _tabAtual = 'usuarios';

const ROOT = () => document.getElementById('admin-root');

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Tenta sessão admin salva
  const saved = sessionStorage.getItem('nexus_admin');
  if (saved) {
    try {
      _admin = JSON.parse(saved);
      _mostrarPainel();
      return;
    } catch {
      sessionStorage.removeItem('nexus_admin');
    }
  }

  // ✅ Tenta aproveitar login do Nexus
  const nexusUser = JSON.parse(localStorage.getItem('usuario') ?? 'null');
  if (nexusUser?.admin === true) {
    _admin = nexusUser;
    sessionStorage.setItem('nexus_admin', JSON.stringify(_admin));
    _mostrarPainel();
    return;
  }

  _mostrarLogin();
});

/* ─────────────────────────────────────────────
   TELA DE LOGIN
───────────────────────────────────────────── */
function _mostrarLogin() {
  ROOT().innerHTML = `
    <div class="admin-login-wrap">
      <div class="admin-login-card">

        <div class="admin-login__badge">🛡️ Acesso Restrito</div>

        <h1 class="admin-login__title">Nexus Admin</h1>
        <p class="admin-login__sub">Painel de controle</p>

        <div class="admin-field">
          <label for="adm-nome">Nome</label>
          <input
            type="text"
            id="adm-nome"
            class="admin-input"
            placeholder="admin"
            autocomplete="off"
            autocapitalize="off"
          />
        </div>

        <div class="admin-field">
          <label for="adm-pin">PIN</label>
          <input
            type="password"
            id="adm-pin"
            class="admin-input"
            placeholder="• • • • • •"
            maxlength="20"
            autocomplete="off"
          />
        </div>

        <p id="adm-erro" class="admin-login__erro"></p>

        <button class="admin-btn--login" id="adm-btn-entrar">Entrar</button>
      </div>
    </div>`;

  document.getElementById('adm-nome').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('adm-pin').focus();
  });

  document.getElementById('adm-pin').addEventListener('keydown', e => {
    if (e.key === 'Enter') _tentarLogin();
  });

  document.getElementById('adm-btn-entrar').addEventListener('click', _tentarLogin);
  requestAnimationFrame(() => document.getElementById('adm-nome').focus());
}

async function _tentarLogin() {
  const nome = document.getElementById('adm-nome').value.trim();
  const pin  = document.getElementById('adm-pin').value.trim();
  const erro = document.getElementById('adm-erro');
  const btn  = document.getElementById('adm-btn-entrar');

  erro.style.display = 'none';

  if (!nome || !pin) {
    _exibirErroLogin(erro, 'Preencha nome e PIN.');
    return;
  }

  btn.textContent = 'Verificando…';
  btn.disabled    = true;

  const resultado = await login(nome, pin);

  btn.textContent = 'Entrar';
  btn.disabled    = false;

  if (!resultado.ok) {
    _exibirErroLogin(erro, resultado.erro);
    document.getElementById('adm-pin').value = '';
    return;
  }

  if (!resultado.usuario.admin) {
    _exibirErroLogin(erro, 'Acesso negado. Usuário não é administrador.');
    document.getElementById('adm-pin').value = '';
    return;
  }

  _admin = resultado.usuario;
  sessionStorage.setItem('nexus_admin', JSON.stringify(_admin));
  _mostrarPainel();
}

function _exibirErroLogin(el, msg) {
  el.textContent   = msg;
  el.style.display = 'block';
}

/* ─────────────────────────────────────────────
   PAINEL PRINCIPAL
───────────────────────────────────────────── */
function _mostrarPainel() {
  ROOT().innerHTML = `
    <div class="admin-shell">
      <header class="admin-header">
        <div class="admin-header__logo">
          <div class="admin-header__mark">🛡️</div>
          <div>
            <div class="admin-header__title">Nexus Admin</div>
            <div class="admin-header__sub">Painel de Controle</div>
          </div>
        </div>
        <div class="admin-header__right">
          <span class="admin-header__user">
            ${_admin.avatar ?? '🛡️'} ${_admin.nome}
          </span>
          <button class="admin-btn--logout" id="adm-logout">Sair</button>
        </div>
      </header>

      <nav class="admin-tabs">
        <button class="admin-tab admin-tab--active" data-tab="usuarios">
          👥 Usuários
        </button>
        <button class="admin-tab" data-tab="dados">
          🗄️ Dados
        </button>
        <button class="admin-tab" data-tab="estatisticas">
          📊 Estatísticas
        </button>
      </nav>

      <main class="admin-content" id="adm-content">
        <div class="admin-loading">
          <div class="admin-spinner"></div>
          Carregando…
        </div>
      </main>
    </div>`;

  document.getElementById('adm-logout').addEventListener('click', () => {
    sessionStorage.removeItem('nexus_admin');
    _admin    = null;
    _usuarios = [];
    _mostrarLogin();
  });

  document.querySelectorAll('.admin-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('admin-tab--active'));
      btn.classList.add('admin-tab--active');
      _tabAtual = btn.dataset.tab;
      _renderTab(_tabAtual);
    });
  });

  _renderTab('usuarios');
}

function _renderTab(tab) {
  const content = document.getElementById('adm-content');
  if (!content) return;

  if (tab === 'usuarios')     _renderUsuarios(content);
  else if (tab === 'dados')   _renderDados(content);
  else if (tab === 'estatisticas') _renderEstatisticas(content);
}

/* ─────────────────────────────────────────────
   TAB: USUÁRIOS
───────────────────────────────────────────── */
async function _renderUsuarios(content) {
  content.innerHTML = `<div class="admin-loading"><div class="admin-spinner"></div>Carregando usuários…</div>`;

  _usuarios = await getUsuarios();

  content.innerHTML = `
    <div class="admin-section-title">Usuários</div>
    <p class="admin-section-sub">${_usuarios.length} usuário(s) cadastrado(s)</p>

    <button class="admin-create-toggle" id="adm-toggle-criar">
      ＋ Criar usuário
    </button>

    <div class="admin-create-form" id="adm-form-criar">
      <p class="admin-erro" id="adm-criar-erro"></p>
      <div class="admin-create-form__grid">
        <div class="admin-field">
          <label>Nome (login)</label>
          <input type="text" id="criar-nome" class="admin-input" placeholder="ex: joao" autocapitalize="off" autocomplete="off" />
        </div>
        <div class="admin-field">
          <label>PIN</label>
          <input type="text" id="criar-pin" class="admin-input" placeholder="ex: 1234" autocomplete="off" />
        </div>
        <div class="admin-field">
          <label>Avatar (emoji)</label>
          <input type="text" id="criar-avatar" class="admin-input" placeholder="🎓" maxlength="4" />
        </div>
      </div>
      <div class="admin-create-form__footer">
        <button class="abtn abtn--gold" id="adm-btn-criar">Criar usuário</button>
      </div>
    </div>

    <div class="admin-user-list" id="adm-user-list"></div>`;

  // Toggle form
  document.getElementById('adm-toggle-criar').addEventListener('click', () => {
    const form = document.getElementById('adm-form-criar');
    form.classList.toggle('open');
    document.getElementById('adm-toggle-criar').textContent =
      form.classList.contains('open') ? '✕ Cancelar' : '＋ Criar usuário';
  });

  document.getElementById('adm-btn-criar').addEventListener('click', _criarUsuario);

  _renderListaUsuarios();
}

function _renderListaUsuarios() {
  const list = document.getElementById('adm-user-list');
  if (!list) return;

  if (_usuarios.length === 0) {
    list.innerHTML = `<div class="admin-empty">Nenhum usuário encontrado.</div>`;
    return;
  }

  list.innerHTML = '';

  _usuarios.forEach(u => {
    const isAdmin = u.admin === true;
    const card    = document.createElement('div');
    card.className = `admin-user-card${isAdmin ? ' admin-user-card--admin' : ''}`;
    card.dataset.uid = u.uid;

    card.innerHTML = `
      <div class="auc-avatar">${u.avatar ?? u.nome?.charAt(0).toUpperCase() ?? '?'}</div>

      <div class="auc-info">
        <div class="auc-nome">
          ${u.nome ?? u.uid}
          ${isAdmin ? '<span class="auc-badge-admin">admin</span>' : ''}
        </div>
        <div class="auc-uid">${u.uid}</div>
      </div>

      <div class="auc-actions">
        <!-- Form reset PIN (oculto por padrão) -->
        <div class="auc-reset-form" id="reset-form-${u.uid}">
          <input
            type="text"
            class="auc-reset-input"
            id="reset-pin-${u.uid}"
            placeholder="Novo PIN"
            autocomplete="off"
          />
          <button class="abtn abtn--teal" data-uid="${u.uid}" data-action="confirmar-reset">Salvar</button>
          <button class="abtn abtn--ghost" data-uid="${u.uid}" data-action="cancelar-reset">✕</button>
        </div>

        <!-- Botões padrão -->
        <button class="abtn abtn--ghost" data-uid="${u.uid}" data-action="toggle-reset"
          ${isAdmin ? 'disabled title="Não é possível resetar PIN do admin por aqui"' : ''}>
          Reset PIN
        </button>

        <button class="abtn abtn--danger" data-uid="${u.uid}" data-action="remover"
          ${isAdmin ? 'disabled title="Não é possível remover o admin"' : ''}>
          Remover
        </button>
      </div>`;

    list.appendChild(card);
  });

  // Eventos delegados
  list.addEventListener('click', async e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const { uid, action } = btn.dataset;

    if (action === 'toggle-reset') {
      const form = document.getElementById(`reset-form-${uid}`);
      form.classList.toggle('open');
      btn.style.display = form.classList.contains('open') ? 'none' : '';
    }

    if (action === 'cancelar-reset') {
      document.getElementById(`reset-form-${uid}`).classList.remove('open');
      list.querySelector(`[data-uid="${uid}"][data-action="toggle-reset"]`).style.display = '';
    }

    if (action === 'confirmar-reset') {
      const novoPin = document.getElementById(`reset-pin-${uid}`).value.trim();
      if (!novoPin) return;

      btn.textContent = 'Salvando…';
      btn.disabled    = true;

      const r = await resetarPin(uid, novoPin);

      btn.textContent = 'Salvar';
      btn.disabled    = false;

      if (r.ok) {
        document.getElementById(`reset-form-${uid}`).classList.remove('open');
        list.querySelector(`[data-uid="${uid}"][data-action="toggle-reset"]`).style.display = '';
        _toast(`PIN de "${uid}" atualizado.`);
      } else {
        _toast('Erro ao resetar PIN.');
      }
    }

    if (action === 'remover') {
      _confirmar(btn, async () => {
        const r = await removerUsuario(uid);
        if (r.ok) {
          _usuarios = _usuarios.filter(u => u.uid !== uid);
          document.querySelector(`.admin-user-card[data-uid="${uid}"]`)?.remove();
          _toast(`Usuário "${uid}" removido.`);
          // Atualiza contagem
          const sub = document.querySelector('.admin-section-sub');
          if (sub) sub.textContent = `${_usuarios.length} usuário(s) cadastrado(s)`;
        } else {
          _toast('Erro ao remover usuário.');
        }
      });
    }
  });
}

async function _criarUsuario() {
  const nome   = document.getElementById('criar-nome').value.trim().toLowerCase();
  const pin    = document.getElementById('criar-pin').value.trim();
  const avatar = document.getElementById('criar-avatar').value.trim() || '🎓';
  const erro   = document.getElementById('adm-criar-erro');

  erro.style.display = 'none';

  if (!nome || !pin) {
    erro.textContent   = 'Preencha nome e PIN.';
    erro.style.display = 'block';
    return;
  }

  if (/\s/.test(nome)) {
    erro.textContent   = 'Nome não pode ter espaços.';
    erro.style.display = 'block';
    return;
  }

  // Verifica se já existe
  if (_usuarios.find(u => u.uid === nome)) {
    erro.textContent   = `Usuário "${nome}" já existe.`;
    erro.style.display = 'block';
    return;
  }

  const btn = document.getElementById('adm-btn-criar');
  btn.textContent = 'Criando…';
  btn.disabled    = true;

  const pinHash = await hashPin(pin);
  const r = await criarUsuario(nome, nome, pinHash, avatar);

  btn.textContent = 'Criar usuário';
  btn.disabled    = false;

  if (r.ok) {
    _toast(`Usuário "${nome}" criado com sucesso!`);
    // Limpa form
    document.getElementById('criar-nome').value   = '';
    document.getElementById('criar-pin').value    = '';
    document.getElementById('criar-avatar').value = '';
    // Recarrega lista
    _usuarios = await getUsuarios();
    _renderListaUsuarios();
    // Atualiza contagem
    const sub = document.querySelector('.admin-section-sub');
    if (sub) sub.textContent = `${_usuarios.length} usuário(s) cadastrado(s)`;
  } else {
    erro.textContent   = r.erro ?? 'Erro ao criar usuário.';
    erro.style.display = 'block';
  }
}

/* ─────────────────────────────────────────────
   TAB: DADOS
───────────────────────────────────────────── */
async function _renderDados(content) {
  content.innerHTML = `<div class="admin-loading"><div class="admin-spinner"></div>Carregando…</div>`;

  if (_usuarios.length === 0) {
    _usuarios = await getUsuarios();
  }

  const usuariosNaoAdmin = _usuarios.filter(u => !u.admin);

  content.innerHTML = `
    <div class="admin-section-title">Dados</div>
    <p class="admin-section-sub">Limpe dados de quiz ou flashcard de um usuário específico.</p>

    <div class="admin-dados-grid">
      <div class="admin-field">
        <label>Usuário</label>
        <select id="dados-usuario" class="admin-select">
          <option value="">— selecione —</option>
          ${usuariosNaoAdmin.map(u => `<option value="${u.uid}">${u.nome ?? u.uid}</option>`).join('')}
        </select>
      </div>
      <div class="admin-field">
        <label>Semestre</label>
        <select id="dados-semestre" class="admin-select">
          ${SEMESTRES.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="admin-dados-actions" id="dados-actions"></div>`;

  document.getElementById('dados-usuario').addEventListener('change', _renderDadosActions);
  document.getElementById('dados-semestre').addEventListener('change', _renderDadosActions);
}

function _renderDadosActions() {
  const uid      = document.getElementById('dados-usuario').value;
  const sem      = document.getElementById('dados-semestre').value;
  const box      = document.getElementById('dados-actions');
  const discs    = getDisciplinasDeSemestre(sem);

  if (!uid) {
    box.classList.remove('open');
    box.innerHTML = '';
    return;
  }

  box.classList.add('open');

  const discBtns = discs.map(d => `
    <button class="abtn abtn--ghost" data-disc="${d.id}" data-action="limpar-srs-disc">
      ${d.apelido}
    </button>`).join('');

  box.innerHTML = `
    <div class="admin-dados-actions__title">Ações para: ${uid} / ${sem}</div>

    <!-- QUIZ -->
    <div class="admin-dados-row">
      <label>
        Limpar Quiz
        <small>Remove todos os dados de quiz deste usuário no semestre.</small>
      </label>
      <button class="abtn abtn--danger" data-action="limpar-quiz">Limpar quiz</button>
    </div>

    <!-- SRS por disciplina -->
    <div class="admin-dados-row">
      <label>
        Limpar SRS — disciplina
        <small>Zera repetição espaçada de uma disciplina específica.</small>
      </label>
      <div class="admin-dados-disc-btns">${discBtns}</div>
    </div>

    <!-- SRS tudo -->
    <div class="admin-dados-row">
      <label>
        Limpar SRS — tudo
        <small>Zera todas as disciplinas do semestre para este usuário.</small>
      </label>
      <button class="abtn abtn--danger" data-action="limpar-srs-tudo">Limpar tudo</button>
    </div>`;

  box.addEventListener('click', async e => {
    const btn    = e.target.closest('[data-action]');
    if (!btn) return;

    const { action } = btn.dataset;

    if (action === 'limpar-quiz') {
      _confirmar(btn, async () => {
        const r = await limparTodoQuizUsuario(uid);
        _toast(r.ok ? `Quiz de "${uid}" apagado.` : 'Erro ao limpar quiz.');
      });
    }

    if (action === 'limpar-srs-disc') {
      const discId = btn.dataset.disc;
      _confirmar(btn, async () => {
        await limparPerfisSRS(uid, discId, sem);
        _toast(`SRS de ${discId} (${uid}) apagado.`);
      });
    }

    if (action === 'limpar-srs-tudo') {
      _confirmar(btn, async () => {
        for (const d of discs) {
          await limparPerfisSRS(uid, d.id, sem);
        }
        _toast(`SRS de "${uid}" — todas as disciplinas apagadas.`);
      });
    }
  });
}

/* ─────────────────────────────────────────────
   TAB: ESTATÍSTICAS (PLACEHOLDER)
───────────────────────────────────────────── */
function _renderEstatisticas(content) {
  content.innerHTML = `
    <div class="admin-section-title">Estatísticas</div>
    <p class="admin-section-sub">Em desenvolvimento.</p>

    <div class="admin-stats-placeholder">
      <div class="admin-stats-placeholder__icon">📊</div>
      <div class="admin-stats-placeholder__title">Em breve</div>
      <p class="admin-stats-placeholder__desc">
        Esta seção vai exibir quem estudou mais, progresso por disciplina,
        sessões de quiz concluídas e histórico de flashcards.
      </p>
    </div>

    <!--
    TODO: Estatísticas planejadas
    ─────────────────────────────────────────
    Por usuário:
      - Total de questões respondidas (quiz)
      - % de acerto por disciplina
      - Total de flashcards revisados
      - Streak de dias consecutivos
      - Última sessão registrada

    Implementação:
      1. Criar firebase.getEstatisticasUsuario(uid) → lê subcoleção 'quiz_respostas'
         e agrega: total respondidas, total corretas
      2. Criar firebase.getEstatisticasSRS(uid, semestre) → lê subcoleção 'srs_perfis'
         e agrega: total de cartões, cartões em cada intervalo (new/again/good/easy)
      3. Exibir em cards por usuário com gráfico simples de barras

    Dependências:
      - quiz_respostas já existe no Firestore
      - srs_perfis — verificar estrutura em flashcard/storage.js
    ─────────────────────────────────────────
    -->`;
}

/* ─────────────────────────────────────────────
   UTILITÁRIOS
───────────────────────────────────────────── */

// Confirmação em dois cliques (igual ao index.js)
function _confirmar(btn, callback) {
  if (btn.dataset.confirmando === 'true') {
    btn.dataset.confirmando = 'false';
    btn.textContent = btn.dataset.textoOriginal;
    btn.classList.remove('abtn--danger');
    callback();
    return;
  }

  btn.dataset.textoOriginal = btn.textContent;
  btn.dataset.confirmando   = 'true';
  btn.textContent = 'Tem certeza?';
  btn.classList.add('abtn--danger');

  setTimeout(() => {
    if (btn.dataset.confirmando === 'true') {
      btn.dataset.confirmando = 'false';
      btn.textContent = btn.dataset.textoOriginal;
      btn.classList.remove('abtn--danger');
    }
  }, 3000);
}

// Toast simples
function _toast(msg) {
  const t = document.createElement('div');
  t.className   = 'nexus-toast';
  t.textContent = msg;
  t.style.bottom = '32px';
  document.body.appendChild(t);

  requestAnimationFrame(() => t.classList.add('nexus-toast--show'));

  setTimeout(() => {
    t.classList.remove('nexus-toast--show');
    t.addEventListener('transitionend', () => t.remove(), { once: true });
  }, 2800);
}