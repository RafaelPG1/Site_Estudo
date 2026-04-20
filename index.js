/* =============================================
   NEXUS STUDY — index.js
   Lógica da página inicial
   ============================================= */

import {
  getEstado, setUsuario, getUsuario, estaLogado,
  setPagina, setSemestre, getSemestreAtual,
  setConfigs, getConfigs, resetConfigs,
  limparDadosQuiz,
  SEMESTRES,
} from './global.js';

/* ─────────────────────────────────────────────
   INICIALIZAÇÃO
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setPagina('HOME');
  renderHeader();
  renderSemestreSelector();
  bindCardLinks();
  document.getElementById('footer-year').textContent = new Date().getFullYear();
});

/* ─────────────────────────────────────────────
   HEADER — render dinâmico
───────────────────────────────────────────── */
function renderHeader() {
  const nav = document.getElementById('header-nav');
  nav.innerHTML = '';

  const semestreWrap = document.createElement('div');
  semestreWrap.id = 'semestre-wrap';
  nav.appendChild(semestreWrap);

  if (estaLogado()) {
    const u = getUsuario();

    const btnPerfil = document.createElement('button');
    btnPerfil.className = 'nav-btn nav-btn--avatar';
    btnPerfil.id = 'btn-perfil';
    btnPerfil.title = u.nome;
    btnPerfil.innerHTML = u.foto
      ? `<img src="${u.foto}" alt="${u.nome}" class="avatar-img" />`
      : `<span class="avatar-initial">${u.nome.charAt(0).toUpperCase()}</span>`;
    btnPerfil.addEventListener('click', abrirPerfilDropdown);
    nav.appendChild(btnPerfil);
  } else {
    const btnEntrar = document.createElement('button');
    btnEntrar.className = 'nav-btn';
    btnEntrar.id = 'btn-entrar';
    btnEntrar.textContent = 'Entrar';
    btnEntrar.addEventListener('click', abrirModalLogin);
    nav.appendChild(btnEntrar);
  }

  const btnConfig = document.createElement('button');
  btnConfig.className = 'nav-btn nav-btn--icon';
  btnConfig.id = 'btn-config';
  btnConfig.title = 'Configurações';
  btnConfig.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06
               a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09
               A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83
               l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09
               A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83
               l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09
               a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83
               l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09
               a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>`;
  btnConfig.addEventListener('click', abrirModalConfig);
  nav.appendChild(btnConfig);
}

/* ─────────────────────────────────────────────
   SELETOR DE SEMESTRE
───────────────────────────────────────────── */
function renderSemestreSelector() {
  const wrap = document.getElementById('semestre-wrap');
  if (!wrap) return;

  const atual = getSemestreAtual();

  const select = document.createElement('select');
  select.className = 'semestre-select';
  select.title     = 'Selecionar semestre';

  SEMESTRES.forEach(s => {
    const opt       = document.createElement('option');
    opt.value       = s;
    opt.textContent = s;
    if (s === atual) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener('change', e => {
    setSemestre(e.target.value);
    document.dispatchEvent(new CustomEvent('nexus:semestreChanged', { detail: e.target.value }));
  });

  wrap.appendChild(select);
}

/* ─────────────────────────────────────────────
   CARDS — links
───────────────────────────────────────────── */
function bindCardLinks() {
  const rotas = {
    'card-resumo': './resumo/resumo.html',
    'card-quiz':   './quiz/quiz.html',
    'card-jogos':  './jogos/jogo.html',
  };
  Object.entries(rotas).forEach(([id, path]) => {
    document.getElementById(id)?.addEventListener('click', () => {
      window.location.href = path;
    });
  });
}

/* ─────────────────────────────────────────────
   MODAL CONFIG
───────────────────────────────────────────── */
function abrirModalConfig() {
  fecharTodosModais();

  const cfg   = getConfigs();
  const modal = criarModal('config');

  modal.innerHTML = `
    <div class="modal__overlay" id="modal-overlay-config"></div>
    <div class="modal__box" role="dialog" aria-modal="true" aria-label="Configurações">

      <div class="modal__header">
        <h2 class="modal__title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06
                     a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09
                     A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83
                     l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09
                     A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83
                     l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09
                     a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83
                     l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09
                     a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Configurações
        </h2>
        <button class="modal__close" id="modal-close-config" aria-label="Fechar">✕</button>
      </div>

      <div class="modal__body-scroll">

        ${estaLogado() ? `
        <div class="modal__section">
          <div class="modal__section-title">Perfil</div>
          <div class="config-perfil">
            <div class="config-perfil__avatar">
              ${getUsuario().foto
                ? `<img src="${getUsuario().foto}" alt="avatar" />`
                : `<span>${getUsuario().nome.charAt(0).toUpperCase()}</span>`}
            </div>
            <div class="config-perfil__info">
              <strong>${getUsuario().nome}</strong>
              <span>${getUsuario().email}</span>
            </div>
            <button class="config-perfil__logout" id="btn-logout">Sair</button>
          </div>
        </div>
        ` : ''}

        <div class="modal__section">
          <div class="modal__section-title">Aparência</div>
          <div class="config-row">
            <label for="cfg-tema">Tema</label>
            <select id="cfg-tema" class="config-select">
              <option value="dark"  ${cfg.tema === 'dark'  ? 'selected' : ''}>Escuro</option>
              <option value="light" ${cfg.tema === 'light' ? 'selected' : ''}>Claro</option>
            </select>
          </div>
          <div class="config-row">
            <label for="cfg-anim">Animações</label>
            <label class="toggle">
              <input type="checkbox" id="cfg-anim" ${cfg.animacoes ? 'checked' : ''} />
              <span class="toggle__track"></span>
            </label>
          </div>
        </div>

        <div class="modal__section">
          <div class="modal__section-title">Sistema</div>
          <div class="config-row">
            <label for="cfg-notif">Notificações</label>
            <label class="toggle">
              <input type="checkbox" id="cfg-notif" ${cfg.notificacoes ? 'checked' : ''} />
              <span class="toggle__track"></span>
            </label>
          </div>
        </div>

        <div class="modal__section">
          <div class="modal__section-title">Quiz</div>

          <div class="config-row">
  <label for="cfg-salvar-parcial">
    Salvar progresso
    <small style="display:block; font-weight:400; opacity:0.6; font-size:0.72em; margin-top:2px;">
      Quando ativado, o progresso parcial é salvo enquanto você responde.
      Desativado, apaga 10&nbsp;min após sair da aba.
    </small>
  </label>
  <label class="toggle">
    <input type="checkbox" id="cfg-salvar-parcial"
      ${cfg.salvarProgressoParcial !== false ? 'checked' : ''} />
    <span class="toggle__track"></span>
  </label>
</div>
          <div class="config-row">
            <label for="cfg-salvar-progresso">
              Salvar ao concluir
              <small style="display:block; font-weight:400; opacity:0.6; font-size:0.72em; margin-top:2px;">
                Quando ativado, o resultado fica salvo permanentemente.
                Desativado, apaga 20&nbsp;s após sair da aba.
                Progresso parcial é sempre salvo.
              </small>
            </label>
            <label class="toggle">
              <input type="checkbox" id="cfg-salvar-progresso"
                ${cfg.salvarProgresso !== false ? 'checked' : ''} />
              <span class="toggle__track"></span>
            </label>
          </div>

          <div class="config-row">
            <label>
              Limpar dados do quiz
              <small style="display:block; font-weight:400; opacity:0.6; font-size:0.72em; margin-top:2px;">
                Remove todo progresso salvo de todos os quizzes. Configs e
                demais dados do sistema não são afetados.
              </small>
            </label>
            <button class="modal-btn modal-btn--danger" id="btn-limpar-quiz">
              Limpar
            </button>
          </div>
        </div>

      </div><!-- /.modal__body-scroll -->

      <div class="modal__footer">
        <button class="modal-btn modal-btn--ghost" id="btn-reset-configs">Resetar padrão</button>
        <button class="modal-btn modal-btn--primary" id="btn-salvar-configs">Salvar</button>
      </div>

    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('modal--open'));

  /* ── Auto-save ao mudar qualquer controle ── */
function _lerConfigs() {
  return {
    tema:                   document.getElementById('cfg-tema').value,
    animacoes:              document.getElementById('cfg-anim').checked,
    notificacoes:           document.getElementById('cfg-notif').checked,
    salvarProgressoParcial: document.getElementById('cfg-salvar-parcial').checked, // ← novo
    salvarProgresso:        document.getElementById('cfg-salvar-progresso').checked,
  };
}

  function _autoSave() {
    setConfigs(_lerConfigs());
  }

  document.getElementById('cfg-tema').addEventListener('change', _autoSave);
  document.getElementById('cfg-anim').addEventListener('change', _autoSave);
  document.getElementById('cfg-notif').addEventListener('change', _autoSave);
  document.getElementById('cfg-salvar-progresso').addEventListener('change', _autoSave);
  document.getElementById('cfg-salvar-parcial').addEventListener('change', _autoSave); // ← novo

  /* ── Fechar — salva e mostra toast ── */
  function _fecharComToast() {
    fecharModal(modal);
    mostrarToast('Configurações salvas!');
  }

  document.getElementById('modal-overlay-config').addEventListener('click', _fecharComToast);
  document.getElementById('modal-close-config').addEventListener('click', _fecharComToast);

  /* ── Salvar (botão explícito — mesma ação) ── */
  document.getElementById('btn-salvar-configs').addEventListener('click', () => {
    setConfigs(_lerConfigs());
    _fecharComToast();
  });

  /* ── Resetar configs ── */
  document.getElementById('btn-reset-configs').addEventListener('click', () => {
    resetConfigs();
    fecharModal(modal);
    mostrarToast('Configurações resetadas.');
    setTimeout(abrirModalConfig, 300);
  });

  /* ── Limpar dados do quiz ── */
  document.getElementById('btn-limpar-quiz').addEventListener('click', () => {
    limparDadosQuiz();
    if (typeof window.__nexusQuizNotifyCleared === 'function') {
      window.__nexusQuizNotifyCleared();
    }
    mostrarToast('Dados do quiz apagados.');
  });

  /* ── Logout ── */
  if (estaLogado()) {
    document.getElementById('btn-logout')?.addEventListener('click', () => {
      setUsuario(null);
      fecharModal(modal);
      renderHeader();
      renderSemestreSelector();
      mostrarToast('Sessão encerrada.');
    });
  }

  document.getElementById('cfg-salvar-parcial').addEventListener('change', function () {
  var concluir = document.getElementById('cfg-salvar-progresso');
  if (!this.checked) {
    concluir.checked  = false;
    concluir.disabled = true;
  } else {
    concluir.disabled = false;
  }
  _autoSave();
});

// logo após o modal ser criado, antes dos listeners
if (cfg.salvarProgressoParcial === false) {
  var concluir = document.getElementById('cfg-salvar-progresso');
  if (concluir) {
    concluir.checked  = false;
    concluir.disabled = true;
  }
}
}

/* ─────────────────────────────────────────────
   MODAL LOGIN
───────────────────────────────────────────── */
function abrirModalLogin() {
  fecharTodosModais();

  const modal = criarModal('login');
  modal.innerHTML = `
    <div class="modal__overlay" id="modal-overlay-login"></div>
    <div class="modal__box modal__box--sm" role="dialog" aria-modal="true" aria-label="Entrar">
      <div class="modal__header">
        <h2 class="modal__title">Entrar no Nexus</h2>
        <button class="modal__close" id="modal-close-login" aria-label="Fechar">✕</button>
      </div>

      <div class="modal__section">
        <div class="config-row config-row--col">
          <label for="login-email">E-mail</label>
          <input type="email" id="login-email" class="config-input" placeholder="seu@email.com" />
        </div>
        <div class="config-row config-row--col">
          <label for="login-senha">Senha</label>
          <input type="password" id="login-senha" class="config-input" placeholder="••••••••" />
        </div>
        <p id="login-erro" class="login-erro" style="display:none"></p>
      </div>

      <div class="modal__footer">
        <button class="modal-btn modal-btn--ghost" id="btn-login-google">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21
            3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71
            1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43
            8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12
            1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar com Google
        </button>
        <button class="modal-btn modal-btn--primary" id="btn-login-email">Entrar</button>
      </div>
    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('modal--open'));

  document.getElementById('modal-overlay-login').addEventListener('click', () => fecharModal(modal));
  document.getElementById('modal-close-login').addEventListener('click',   () => fecharModal(modal));

  document.getElementById('btn-login-email').addEventListener('click', () => {
    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value;
    const erro  = document.getElementById('login-erro');

    if (!email || !senha) {
      erro.textContent = 'Preencha e-mail e senha.';
      erro.style.display = 'block';
      return;
    }

    // TODO: conectar ao firebase.js
    setUsuario({ uid: 'temp_001', nome: email.split('@')[0], email, foto: null });
    fecharModal(modal);
    renderHeader();
    renderSemestreSelector();
    mostrarToast(`Bem-vindo, ${getUsuario().nome}!`);
  });

  document.getElementById('btn-login-google').addEventListener('click', () => {
    // TODO: conectar ao firebase.js — signInWithPopup(googleProvider)
    mostrarToast('Google Login: conecte ao firebase.js');
  });
}

/* ─────────────────────────────────────────────
   DROPDOWN PERFIL
───────────────────────────────────────────── */
function abrirPerfilDropdown() {
  const existente = document.getElementById('perfil-dropdown');
  if (existente) { existente.remove(); return; }

  const u    = getUsuario();
  const btn  = document.getElementById('btn-perfil');
  const rect = btn.getBoundingClientRect();

  const dd = document.createElement('div');
  dd.id = 'perfil-dropdown';
  dd.className = 'perfil-dropdown';
  dd.style.cssText = `top:${rect.bottom + 10}px; right:${window.innerWidth - rect.right}px`;

  dd.innerHTML = `
    <div class="pd-header">
      <div class="pd-avatar">
        ${u.foto ? `<img src="${u.foto}" alt="avatar" />` : `<span>${u.nome.charAt(0).toUpperCase()}</span>`}
      </div>
      <div class="pd-info">
        <strong>${u.nome}</strong>
        <span>${u.email}</span>
      </div>
    </div>
    <div class="pd-divider"></div>
    <a href="/area_pessoal/pessoal.html" class="pd-item">📚 Área Pessoal</a>
    <a href="/area_pessoal/anotacoes/anotacoes.html" class="pd-item">📝 Anotações</a>
    <div class="pd-divider"></div>
    <button class="pd-item pd-item--danger" id="pd-logout">Sair da conta</button>`;

  document.body.appendChild(dd);
  requestAnimationFrame(() => dd.classList.add('perfil-dropdown--open'));

  setTimeout(() => {
    document.addEventListener('click', function handler(e) {
      if (!dd.contains(e.target) && e.target !== btn) {
        dd.remove();
        document.removeEventListener('click', handler);
      }
    });
  }, 100);

  document.getElementById('pd-logout').addEventListener('click', () => {
    setUsuario(null);
    dd.remove();
    renderHeader();
    renderSemestreSelector();
    mostrarToast('Sessão encerrada.');
  });
}

/* ─────────────────────────────────────────────
   UTILITÁRIOS DE MODAL
───────────────────────────────────────────── */
function criarModal(id) {
  const el = document.createElement('div');
  el.className = 'modal';
  el.id = `modal-${id}`;
  return el;
}

function fecharModal(modal) {
  modal.classList.remove('modal--open');
  modal.addEventListener('transitionend', () => modal.remove(), { once: true });
}

function fecharTodosModais() {
  document.querySelectorAll('.modal').forEach(m => m.remove());
}

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */
function mostrarToast(msg) {
  const t = document.createElement('div');
  t.className = 'nexus-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('nexus-toast--show'));
  setTimeout(() => {
    t.classList.remove('nexus-toast--show');
    t.addEventListener('transitionend', () => t.remove(), { once: true });
  }, 2800);
}