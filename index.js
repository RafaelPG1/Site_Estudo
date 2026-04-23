/* =============================================
   NEXUS STUDY — index.js
   Lógica da página inicial
   ============================================= */

import {
  getEstado, setUsuario, getUsuario, estaLogado,
  setPagina,
  setConfigs, getConfigs, resetConfigs,
  limparDadosQuiz,
  getSemestreAtual, getDisciplinasDeSemestre,
} from './global.js';

import { login, logout, carregarConfigs } from './firebase.js';
import { criarSemestreSelect, preencherAnos } from './shared/dom.js';
// index.js — no topo, junto com os outros imports
import { limparPerfisSRS } from './games/jogos/flashcard/storage.js';
/* ─────────────────────────────────────────────
   INICIALIZAÇÃO
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setPagina('HOME');
  renderHeader();
  _montarSelect();
  bindCardLinks();
  preencherAnos(['footer-year']);
});

/* ─────────────────────────────────────────────
   SELETOR DE SEMESTRE
───────────────────────────────────────────── */
function _montarSelect() {
  criarSemestreSelect('semestre-wrap', sem => {
    document.dispatchEvent(new CustomEvent('nexus:semestreChanged', { detail: sem }));
  });
}

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
      : `<span class="avatar-initial">${u.avatar ?? u.nome.charAt(0).toUpperCase()}</span>`;
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
   MODAL LOGIN — Nome + PIN
───────────────────────────────────────────── */
function abrirModalLogin() {
  fecharTodosModais();

  const modal = criarModal('login');
  modal.innerHTML = `
    <div class="modal__overlay" id="modal-overlay-login"></div>
    <div class="modal__box modal__box--sm" role="dialog" aria-modal="true" aria-label="Entrar">

      <div class="modal__header">
        <h2 class="modal__title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Entrar no Nexus
        </h2>
        <button class="modal__close" id="modal-close-login" aria-label="Fechar">✕</button>
      </div>

      <div class="modal__section">

        <!-- Nome -->
<div class="config-row config-row--col">
  <label for="login-nome">Nome</label>
  <input
    type="text"
    id="login-nome"
    class="config-input"
    placeholder="seu nome"
    autocomplete="off"
    autocapitalize="off"
  />
</div>

        <!-- PIN -->
        <div class="config-row config-row--col">
          <label for="login-pin">PIN</label>
          <input
            type="password"
            id="login-pin"
            class="config-input"
            placeholder="• • •"
            maxlength="6"
            inputmode="numeric"
            autocomplete="off"
          />
        </div>

        <p id="login-erro" class="login-erro" style="display:none"></p>

      </div>

      <div class="modal__footer">
        <button class="modal-btn modal-btn--primary" id="btn-login-entrar">
          Entrar
        </button>
      </div>

    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('modal--open'));

  // Foca o PIN quando selecionar o nome
  // ADICIONE:
document.getElementById('login-nome').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('login-pin').focus();
});

  // Enter no PIN dispara login
  document.getElementById('login-pin').addEventListener('keydown', e => {
    if (e.key === 'Enter') _tentarLogin();
  });

  document.getElementById('modal-overlay-login').addEventListener('click', () => fecharModal(modal));
  document.getElementById('modal-close-login').addEventListener('click',   () => fecharModal(modal));
  document.getElementById('btn-login-entrar').addEventListener('click', _tentarLogin);

  async function _tentarLogin() {
    const nome  = document.getElementById('login-nome').value.trim();
    const pin   = document.getElementById('login-pin').value.trim();
    const erro  = document.getElementById('login-erro');
    const btn   = document.getElementById('btn-login-entrar');

    erro.style.display = 'none';

    if (!nome || !pin) {
      erro.textContent   = 'Selecione seu nome e digite o PIN.';
      erro.style.display = 'block';
      return;
    }

    // Estado de carregamento
    btn.textContent = 'Entrando…';
    btn.disabled    = true;

    const resultado = await login(nome, pin);

    btn.textContent = 'Entrar';
    btn.disabled    = false;

if (resultado.ok) {
    limparDadosQuiz();
  const configsRemota = await carregarConfigs(resultado.usuario.uid);
  console.log('[login] configsRemota recebida →', configsRemota);

  if (configsRemota) {
    setConfigs(configsRemota);
    console.log('[login] configs aplicadas do Firebase ✓');
  } else {
    console.log('[login] nenhuma config remota — mantendo localStorage');
  }

  fecharModal(modal);
  renderHeader();
  _montarSelect();
  mostrarToast(`Bem-vindo, ${resultado.usuario.nome}! ${resultado.usuario.avatar}`);


    } else {
      erro.textContent   = resultado.erro;
      erro.style.display = 'block';
      document.getElementById('login-pin').value = '';
      document.getElementById('login-pin').focus();
    }
  }
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
                : `<span>${getUsuario().avatar ?? getUsuario().nome.charAt(0).toUpperCase()}</span>`}
            </div>
            <div class="config-perfil__info">
              <strong>${getUsuario().nome}</strong>
              <span style="color:var(--text-2,#a8a49c); font-size:.8rem">
                ${getUsuario().uid}
              </span>
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
<div class="modal__section">
  <div class="modal__section-title">Flashcard</div>

  <div class="config-row">
    <label>
      Limpar disciplina
      <small style="display:block; font-weight:400; opacity:0.6; font-size:0.72em; margin-top:2px;">
        Zera o progresso de repetição espaçada de uma disciplina específica.
      </small>
    </label>
    <div class="flashcard-disc-btns" id="flashcard-disc-btns"></div>
  </div>

  <div class="config-row">
    <label>
      Limpar tudo
      <small style="display:block; font-weight:400; opacity:0.6; font-size:0.72em; margin-top:2px;">
        Zera o SRS de todas as disciplinas do semestre atual.
      </small>
    </label>
    <button class="modal-btn modal-btn--danger" id="btn-limpar-srs-tudo">
      Limpar tudo
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

  /* ── Auto-save ── */
  function _lerConfigs() {
    return {
      tema:                   document.getElementById('cfg-tema').value,
      animacoes:              document.getElementById('cfg-anim').checked,
      notificacoes:           document.getElementById('cfg-notif').checked,
      salvarProgressoParcial: document.getElementById('cfg-salvar-parcial').checked,
      salvarProgresso:        document.getElementById('cfg-salvar-progresso').checked,
    };
  }

  function _autoSave() { setConfigs(_lerConfigs()); }

  document.getElementById('cfg-tema').addEventListener('change', _autoSave);
  document.getElementById('cfg-anim').addEventListener('change', _autoSave);
  document.getElementById('cfg-notif').addEventListener('change', _autoSave);
  document.getElementById('cfg-salvar-progresso').addEventListener('change', _autoSave);

  document.getElementById('cfg-salvar-parcial').addEventListener('change', function () {
    const concluir = document.getElementById('cfg-salvar-progresso');
    if (!this.checked) {
      concluir.checked  = false;
      concluir.disabled = true;
    } else {
      concluir.disabled = false;
    }
    _autoSave();
  });

  if (cfg.salvarProgressoParcial === false) {
    const concluir = document.getElementById('cfg-salvar-progresso');
    if (concluir) { concluir.checked = false; concluir.disabled = true; }
  }

  /* ── Fechar ── */
  function _fecharComToast() {
    fecharModal(modal);
    mostrarToast('Configurações salvas!');
  }

  document.getElementById('modal-overlay-config').addEventListener('click', _fecharComToast);
  document.getElementById('modal-close-config').addEventListener('click',   _fecharComToast);

  document.getElementById('btn-salvar-configs').addEventListener('click', () => {
    setConfigs(_lerConfigs());
    _fecharComToast();
  });

  document.getElementById('btn-reset-configs').addEventListener('click', () => {
    resetConfigs();
    fecharModal(modal);
    mostrarToast('Configurações resetadas.');
    setTimeout(abrirModalConfig, 300);
  });

document.getElementById('btn-limpar-quiz').addEventListener('click', function () {
  _confirmar(this, () => {
    limparDadosQuiz();
    console.log('[Quiz] dados do quiz apagados via configurações');
    if (typeof window.__nexusQuizNotifyCleared === 'function') {
      window.__nexusQuizNotifyCleared();
    }
    mostrarToast('Dados do quiz apagados.');
  });
});

  /* ── Logout ── */
  if (estaLogado()) {
    document.getElementById('btn-logout')?.addEventListener('click', () => {
      limparDadosQuiz();
      logout();
      fecharModal(modal);
      renderHeader();
      _montarSelect();
      mostrarToast('Sessão encerrada.');
    });
  }
/* ── SRS Flashcard ── */
const sem         = getSemestreAtual();
const disciplinas = getDisciplinasDeSemestre(sem);
const uid         = getUsuario()?.uid ?? 'visitante';

// Importa invalidarCacheSRS dinamicamente para não criar dependência circular
async function _resetarSRS(discId) {
  const mod = await import('./games/jogos/flashcard/flashcard.js');
  if (discId) {
    await limparPerfisSRS(uid, discId, sem);
    mod.invalidarCacheSRS(discId);
    console.log(`[SRS] limpo: uid="${uid}" disc="${discId}" sem="${sem}"`);
  } else {
    for (const disc of disciplinas) {
      await limparPerfisSRS(uid, disc.id, sem);
      console.log(`[SRS] limpo: uid="${uid}" disc="${disc.id}" sem="${sem}"`);
    }
    mod.invalidarCacheSRS(null); // limpa cache inteiro
  }
}

const discBtns = document.getElementById('flashcard-disc-btns');
if (discBtns) {
  disciplinas.forEach(disc => {
    const btn = document.createElement('button');
    btn.className   = 'modal-btn modal-btn--ghost';
    btn.textContent = disc.apelido;
    btn.title       = `Limpar SRS de ${disc.nome}`;
    btn.addEventListener('click', () => {
      _confirmar(btn, async () => {
        await _resetarSRS(disc.id);
        mostrarToast(`SRS de ${disc.apelido} apagado.`);
      });
    });
    discBtns.appendChild(btn);
  });
}

document.getElementById('btn-limpar-srs-tudo')?.addEventListener('click', function () {
  _confirmar(this, async () => {
    await _resetarSRS(null);
    mostrarToast('SRS de todas as disciplinas apagado.');
  });
});
}

function _confirmar(btn, callback) {
  if (btn.dataset.confirmando === 'true') {
    // Segunda vez — executa
    btn.dataset.confirmando = 'false';
    btn.textContent = btn.dataset.textoOriginal;
    btn.classList.remove('modal-btn--danger');
    callback();
    return;
  }

  // Primeira vez — pede confirmação
  btn.dataset.textoOriginal = btn.textContent;
  btn.dataset.confirmando   = 'true';
  btn.textContent = 'Tem certeza?';
  btn.classList.add('modal-btn--danger');

  // Cancela automaticamente após 3s se não confirmar
  setTimeout(() => {
    if (btn.dataset.confirmando === 'true') {
      btn.dataset.confirmando = 'false';
      btn.textContent = btn.dataset.textoOriginal;
      btn.classList.remove('modal-btn--danger');
    }
  }, 3000);
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
        ${u.foto
          ? `<img src="${u.foto}" alt="avatar" />`
          : `<span>${u.avatar ?? u.nome.charAt(0).toUpperCase()}</span>`}
      </div>
      <div class="pd-info">
        <strong>${u.nome}</strong>
        <span style="font-size:.75rem; opacity:.5">${u.uid}</span>
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
    limparDadosQuiz();
    logout();
    dd.remove();
    renderHeader();
    _montarSelect();
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
  const OFFSET   = 12;
  const DURATION = 2800;

  const existentes = document.querySelectorAll('.nexus-toast');
  let nextBottom = 32;
  existentes.forEach(t => { nextBottom += t.offsetHeight + OFFSET; });

  const t = document.createElement('div');
  t.className = 'nexus-toast';
  t.textContent = msg;
  t.style.bottom = `${nextBottom}px`;
  document.body.appendChild(t);

  requestAnimationFrame(() => t.classList.add('nexus-toast--show'));

  setTimeout(() => {
    t.classList.remove('nexus-toast--show');
    t.addEventListener('transitionend', () => {
      t.remove();
      _reposicionarToasts();
    }, { once: true });
  }, DURATION);
}

function _reposicionarToasts() {
  const OFFSET = 12;
  let bottom = 32;
  document.querySelectorAll('.nexus-toast').forEach(t => {
    t.style.bottom = `${bottom}px`;
    bottom += t.offsetHeight + OFFSET;
  });
}