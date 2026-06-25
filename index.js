/* =============================================
   NEXUS STUDY — index.js
   Lógica da página inicial

   ESTRUTURA
   ─────────────────────────────────────────────
   SEÇÃO 1 — IMPORTS
   SEÇÃO 2 — ASSISTENTE IA (carregamento antecipado)
   SEÇÃO 3 — INICIALIZAÇÃO
   SEÇÃO 4 — HEADER
   SEÇÃO 5 — CARDS
   SEÇÃO 6 — MODAL LOGIN
   SEÇÃO 7 — MODAL CONFIG
   SEÇÃO 8 — MODAL PERFIL
   SEÇÃO 9 — UTILITÁRIOS (modais + toast)
   ============================================= */


/* ═══════════════════════════════════════════════
   SEÇÃO 1 — IMPORTS
═══════════════════════════════════════════════ */

import {
  setUsuario, getUsuario, estaLogado,
  setPagina,
  setConfigs, getConfigs, resetConfigs,
  hydrateConfigs,
  limparDadosQuiz,
} from './src/global.js';

import { injetarLogo }                       from './shared/js/utils/logo.js';
import { login, logout, carregarConfigs }     from './src/firebase.js';
import { iniciarSessao, encerrarSessao }      from './shared/js/utils/session-tracker.js';
import { criarSemestreSelect, preencherAnos } from './shared/js/utils/dom.js';
import {
  Sound,
  audio,
  installAudioRecovery,
  playSound,
  mountMusicBtn,
  getMusicMode,
  getSfxBtnEnabled,
  setSfxBtnEnabled,
  getMusicBtnEnabled,
  setMusicBtnEnabled,
} from './shared/js/audio/audio-api.js';


/* ── IDs de cards que exigem login — declarado no topo para evitar TDZ ── */
const CARDS_RESTRITOS = ['card-pessoal'];

/* ═══════════════════════════════════════════════
   SEÇÃO 2 — ASSISTENTE IA
   O botão flutuante (#nexus-fab) é injetado por
   fab.js antes mesmo deste módulo carregar.
   Aqui carregamos o restante da IA (painel, lógica,
   contexto) de forma assíncrona, sem bloquear a UI.
═══════════════════════════════════════════════ */

// Declara explicitamente o tipo de contexto desta página.
// core/context.js usa este valor para identificar quais domínios de IA estão ativos.
// NÃO inclui disciplina, semestre ou outros estados dinâmicos — esses ficam em suas
// próprias fontes de verdade (global.js, dom.js, search, estados internos, etc.).
window.__NEXUS_CONTEXT__ = { tipos: ['resumo'] };


function _loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src    = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`[Nexus IA] Falha ao carregar: ${src}`));
    document.body.appendChild(s);
  });
}

function _carregarIA() {
  const BASE = 'shared/js/ia/';
  const deps = [
    BASE + 'core/context.js',    // lê __NEXUS_CONTEXT__ → expõe NexusContext
    BASE + 'core/text-utils.js',
    BASE + 'core/history.js',    // histórico isolado por contexto — requerido por resumo/assistant.js
    BASE + 'core/loader.js',
    BASE + 'core/worker.js',
    BASE + 'core/ui.js',
    BASE + 'resumo/search.js',
  ];

  Promise.all(deps.map(_loadScript))
    .then(() => _loadScript(BASE + 'resumo/assistant.js'))
    .then(() => _loadScript(BASE + 'init.js'))
    .catch(err => console.error(err));
}

_carregarIA();


/* ═══════════════════════════════════════════════
   SEÇÃO 3 — INICIALIZAÇÃO
═══════════════════════════════════════════════ */

async function init() {
  try {
    // Redireciona admin imediatamente
    if (estaLogado() && getUsuario()?.admin) {
      window.location.replace('./admin/admin.html');
      return;
    }

    Sound.init();
    mountMusicBtn();
    installAudioRecovery({ Sound, audio });

    injetarLogo('#header-logo-wrap');

    setPagina('HOME');
    _refreshHeader();
    _aplicarBloqueioCards();
    _bindCardLinks(); // registra listeners imediatamente — não depende do áudio

    // Rastreamento de sessão
    document.addEventListener('nexus:loginSuccess', () => {
      iniciarSessao();
      _aplicarBloqueioCards();
    });
    document.addEventListener('nexus:logout', () => {
      encerrarSessao();
      _aplicarBloqueioCards();
    });

    // Pedido de login disparado pela IA (e outros componentes protegidos)
    // quando o usuário tenta interagir sem estar autenticado.
    document.addEventListener('nexus:loginRequest', () => {
      if (!estaLogado()) _abrirModalLogin();
    });

    await Sound.waitUntilReady();

    preencherAnos(['footer-year']);

    _iniciarMusicaMenu();

  } catch (err) {
    console.error('[init] Erro crítico na inicialização:', err);
    try { _refreshHeader(); } catch (_) {}
  }
}

/* Inicia a BGM da página inicial e mantém um watchdog para retomá-la */
function _iniciarMusicaMenu() {
  function _tryStart() {
    if (!audio.isUnlocked()) return;
    if (audio.music.currentId() === 'music-menu') return;
    if ((getMusicMode() ?? 'normal') === 'mute') return;
    audio.music.menu();
  }

  _tryStart();
  document.addEventListener('nexus:audioUnlocked', _tryStart, { once: true });

  const watchdog = setInterval(() => {
    if (document.hidden || !audio.isUnlocked()) return;
    if (audio.music.currentId() !== 'music-menu' && (getMusicMode() ?? 'normal') !== 'mute') {
      audio.music.menu();
    }
  }, 30_000);

  window.addEventListener('pagehide', () => clearInterval(watchdog), { once: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


/* ═══════════════════════════════════════════════
   SEÇÃO 4 — HEADER
   Ponto único de reconstrução do header-nav.
   Chamado na inicialização e após login/logout.
═══════════════════════════════════════════════ */

function _refreshHeader() {
  try {
    _renderHeader();
    _montarSelect();
  } catch (err) {
    console.error('[Header] Falha ao reconstruir o header:', err);
  }
}

function _montarSelect() {
  const wrap = document.getElementById('semestre-wrap');
  if (!wrap) {
    console.warn('[Header] #semestre-wrap não encontrado — _renderHeader() pode ter falhado.');
    return;
  }

  criarSemestreSelect('semestre-wrap', sem => {
    playSound('select', 'inicial');
    document.dispatchEvent(new CustomEvent('nexus:semestreChanged', { detail: sem }));
  });

  requestAnimationFrame(() => {
    const sel = wrap.querySelector('select');
    if (sel) sel.addEventListener('mousedown', () => playSound('click', 'inicial'));
  });
}

function _renderHeader() {
  const nav = document.getElementById('header-nav');
  if (!nav) {
    console.error('[Header] #header-nav não encontrado no DOM.');
    return;
  }
  nav.innerHTML = '';

  // Seletor de semestre
  const semestreWrap = document.createElement('div');
  semestreWrap.id = 'semestre-wrap';
  nav.appendChild(semestreWrap);

  // Avatar (logado) ou botão Entrar (visitante)
  if (estaLogado()) {
    const u          = getUsuario();
    const avatarVal  = u.avatar ?? u.nome.charAt(0).toUpperCase();
    const btnPerfil  = document.createElement('button');

    btnPerfil.className = 'nav-btn--avatar';
    btnPerfil.id        = 'btn-perfil';
    btnPerfil.title     = u.nome;
    btnPerfil.innerHTML = u.foto
      ? `<img src="${u.foto}" alt="${u.nome}" class="avatar-img" />`
      : avatarVal;

    btnPerfil.addEventListener('click', () => {
      playSound('click', 'inicial');
      _abrirPerfilModal();
    });
    nav.appendChild(btnPerfil);

  } else {
    const btnEntrar = document.createElement('button');
    btnEntrar.className   = 'nav-btn';
    btnEntrar.id          = 'btn-entrar';
    btnEntrar.textContent = 'Entrar';

    btnEntrar.addEventListener('mouseenter', () => playSound('hover', 'inicial'));
    btnEntrar.addEventListener('click', () => {
      playSound('click', 'inicial');
      _abrirModalLogin();
    });
    nav.appendChild(btnEntrar);
  }

  // Botão de configurações
  const btnConfig = document.createElement('button');
  btnConfig.className = 'nav-btn nav-btn--icon';
  btnConfig.id        = 'btn-config';
  btnConfig.title     = 'Configurações';
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

  btnConfig.addEventListener('click', () => {
    playSound('click', 'inicial');
    _abrirModalConfig();
  });
  nav.appendChild(btnConfig);
}


/* ═══════════════════════════════════════════════
   SEÇÃO 5 — CARDS
   Hover usa área 'inicial'; click usa a área de destino.
   Card "Pessoal" é bloqueado para visitantes (sem login).
═══════════════════════════════════════════════ */

function _bindCardLinks() {
  const rotas = {
    'card-pessoal': { path: './pessoal/pessoal.html', area: 'perfil'  },
    'card-resumos': { path: './resumo/resumo.html',   area: 'resumos' },
    'card-quiz':    { path: './quiz/quiz.html',        area: 'quiz'    },
    'card-jogos':   { path: './games/jogo.html',       area: 'game'    },
    'card-atlas':   { path: './atlas/atlas.html',      area: 'atlas'   },
  };

  Object.entries(rotas).forEach(([id, { path, area }]) => {
    const card = document.getElementById(id);
    if (!card) return;

    const restrito = CARDS_RESTRITOS.includes(id);

    card.addEventListener('mouseenter', () => {
      playSound('hover', 'inicial');
    });

    card.addEventListener('click', (e) => {
      if (restrito && !estaLogado()) {
        e.preventDefault();
        _dispararBloqueio(card);
        return;
      }
      playSound('click', area);
      window.location.href = path;
    });
  });
}

/* Aplica/remove o estado visual de bloqueio nos cards restritos,
   de acordo com o status de login atual. Chamado na init e
   sempre que login/logout acontece. */
function _aplicarBloqueioCards() {
  CARDS_RESTRITOS.forEach(id => {
    const card = document.getElementById(id);
    if (!card) return;

    const bloqueado = !estaLogado();
    card.classList.toggle('card--locked', bloqueado);
    card.setAttribute('aria-disabled', bloqueado ? 'true' : 'false');

    // Badge de cadeado — injeta uma vez, reaproveita depois
    let badge = card.querySelector('.card__lock-badge');
    if (bloqueado && !badge) {
      badge = document.createElement('div');
      badge.className = 'card__lock-badge';
      badge.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="5" y="11" width="14" height="9" rx="2"/>
          <path d="M8 11V8a4 4 0 0 1 8 0v3"/>
        </svg>
        <span>Entrar para acessar</span>
      `;
      card.appendChild(badge);
    } else if (!bloqueado && badge) {
      badge.remove();
    }
  });
}

/* Feedback de "tentou acessar, mas está bloqueado":
   shake rápido no card — sem toast, sem modal. */
function _dispararBloqueio(card) {
  card.classList.remove('card--shake');
  void card.offsetWidth;
  card.classList.add('card--shake');
  card.addEventListener('animationend', () => card.classList.remove('card--shake'), { once: true });
}


/* ═══════════════════════════════════════════════
   SEÇÃO 6 — MODAL LOGIN
   Fluxo: nome + PIN → login() → loginSuccess event
   Modo admin detectado pelo nome 'admin'.
═══════════════════════════════════════════════ */

function _abrirModalLogin() {
  _fecharTodosModais();
  playSound('openModal', 'inicial');

  const cards = document.querySelector('.cards-grid');
  const modal = _criarModal('login');

  modal.innerHTML = `
    <div class="modal__overlay" id="modal-overlay-login"></div>
    <div class="modal__box modal__box--sm" role="dialog" aria-modal="true" aria-label="Entrar">

      <div class="modal__header modal__header--normal login-hero">
        <button class="modal__close login-hero__close" id="modal-close-login" aria-label="Fechar">✕</button>
        <div class="login-hero__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <span class="login-hero__eyebrow">Acesso à plataforma</span>
        <h2 class="modal__title login-hero__title" id="login-title">Entrar no Nexus</h2>
        <p class="login-hero__sub">Seu progresso, salvo e sincronizado</p>
      </div>

      <div class="modal__header modal__header--admin-view login-hero login-hero--admin">
        <div class="admin-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Acesso Restrito
        </div>
        <h2 class="admin-title">Nexus Admin</h2>
        <p class="admin-subtitle">Painel de Controle</p>
      </div>

      <div class="modal__body-scroll login-body">
        <div class="modal__section login-section">

          <div class="config-row config-row--col login-field">
            <label for="login-nome" class="login-field__label">Nome</label>
            <input type="text" id="login-nome" class="config-input login-field__input"
              placeholder="Nome" maxlength="30"
              autocomplete="off" autocapitalize="off" />
          </div>

          <div class="config-row config-row--col login-field">
            <label for="login-pin" class="login-field__label">PIN</label>
            <div class="pin-wrap">
              <input type="password" id="login-pin" class="config-input login-field__input"
                placeholder="• • •" maxlength="3"
                inputmode="numeric" autocomplete="off" />
              <button type="button" class="pin-eye" id="btn-pin-eye"
                      aria-label="Mostrar PIN" tabindex="-1">
                <svg id="pin-eye-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>

          <p id="login-erro" class="login-erro" style="display:none"></p>

        </div>
      </div>

      <div class="modal__footer login-footer">
        <button class="modal-btn modal-btn--primary login-submit" id="btn-login-entrar">Entrar</button>
      </div>

    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('modal--open'));

  // Refs de DOM (cacheadas uma vez)
  const inputNome = modal.querySelector('#login-nome');
  const inputPin  = modal.querySelector('#login-pin');
  const erroEl    = modal.querySelector('#login-erro');
  const btnEntrar = modal.querySelector('#btn-login-entrar');
  const pinEyeBtn = modal.querySelector('#btn-pin-eye');
  const pinEyeIcon = modal.querySelector('#pin-eye-icon');
  const box       = modal.querySelector('.modal__box');

  /* Detecta modo admin pelo nome */
  inputNome.addEventListener('input', function () {
    const isAdmin = this.value.trim().toLowerCase() === 'admin';
    inputPin.setAttribute('maxlength', isAdmin ? '9' : '3');
    if (!isAdmin && inputPin.value.length > 3) inputPin.value = inputPin.value.slice(0, 3);
    box.classList.toggle('modal__box--admin', isAdmin);
    cards?.classList.toggle('cards-hidden', isAdmin);
  });

  /* Toggle visibilidade do PIN */
  pinEyeBtn.addEventListener('click', () => {
    const show    = inputPin.type === 'password';
    inputPin.type = show ? 'text' : 'password';
    pinEyeIcon.innerHTML = show
      ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
         <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
         <line x1="1" y1="1" x2="23" y2="23"/>`
      : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
         <circle cx="12" cy="12" r="3"/>`;
  });

  /* Atalhos de teclado */
  inputNome.addEventListener('keydown', e => {
    if (e.key === 'Enter') inputPin.focus();
  });
  inputPin.addEventListener('keydown', e => {
    if (e.key === 'Enter') _tentarLogin();
  });

  /* Fechar */
  function _fecharLogin() {
    cards?.classList.remove('cards-hidden');
    playSound('closeModal', 'inicial');
    _fecharModal(modal);
  }
  modal.querySelector('#modal-overlay-login').addEventListener('click', _fecharLogin);
  modal.querySelector('#modal-close-login').addEventListener('click',   _fecharLogin);

  /* Submit */
  btnEntrar.addEventListener('click', () => {
    playSound('click', 'inicial');
    _tentarLogin();
  });

  async function _tentarLogin() {
    const nome = inputNome.value.trim();
    const pin  = inputPin.value.trim();

    erroEl.style.display = 'none';

    if (!nome || !pin) {
      erroEl.textContent   = 'Selecione seu nome e digite o PIN.';
      erroEl.style.display = 'block';
      return;
    }

    btnEntrar.textContent = 'Entrando…';
    btnEntrar.disabled    = true;

    const resultado = await login(nome, pin);

    btnEntrar.textContent = 'Entrar';
    btnEntrar.disabled    = false;

    if (resultado.ok) {
      if (resultado.usuario.admin) {
        cards?.classList.remove('cards-hidden');
        _fecharModal(modal);
        window.location.replace('./admin/admin.html');
        return;
      }

      limparDadosQuiz();

      const configsRemota = await carregarConfigs(resultado.usuario.uid);
      if (configsRemota) {
        hydrateConfigs({ ...getConfigs(), ...configsRemota });
        console.log('[login] configs mescladas com Firebase ✓');
      } else {
        console.log('[login] nenhuma config remota — mantendo localStorage');
      }

      cards?.classList.remove('cards-hidden');
      _fecharModal(modal);
      _refreshHeader();

      document.dispatchEvent(new CustomEvent('nexus:loginSuccess', {
        detail: { uid: resultado.usuario.uid },
      }));

      mostrarToast(`Bem-vindo, ${resultado.usuario.nome}! ${resultado.usuario.avatar}`);

    } else {
      erroEl.textContent   = resultado.erro;
      erroEl.style.display = 'block';
      inputPin.value = '';
      inputPin.focus();
    }
  }
}


/* ═══════════════════════════════════════════════
   SEÇÃO 7 — MODAL CONFIG
   Aparência, sistema e áudio.
═══════════════════════════════════════════════ */

function _abrirModalConfig() {
  _fecharTodosModais();
  playSound('openModal', 'inicial');

  const cfg   = getConfigs();
  const modal = _criarModal('config');

  modal.innerHTML = `
    <div class="modal__overlay" id="modal-overlay-config"></div>
    <div class="modal__box modal__box--quiz" role="dialog" aria-modal="true" aria-label="Configurações">

      <div class="modal__header cfg-header">
        <h2 class="modal__title cfg-header__title">
          <span class="cfg-header__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
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
          </span>
          Configurações
        </h2>
        <button class="modal__close" id="modal-close-config" aria-label="Fechar">✕</button>
      </div>

      <div class="modal__body-scroll cfg-body">

        ${estaLogado() ? `
        <div class="modal__section cfg-section cfg-section--conta">
          <div class="modal__section-title cfg-section-title">
            <span class="cfg-section-title__dot cfg-dot--conta"></span>Conta
          </div>
          <div class="config-perfil">
            <div class="config-perfil__avatar">
              ${getUsuario().foto
                ? `<img src="${getUsuario().foto}" alt="avatar" />`
                : `<span>${getUsuario().avatar ?? getUsuario().nome.charAt(0).toUpperCase()}</span>`}
            </div>
            <div class="config-perfil__info">
              <strong>${getUsuario().nome}</strong>
              <span class="config-perfil__uid">${getUsuario().uid}</span>
            </div>
            <button class="config-perfil__logout" id="btn-logout">Sair</button>
          </div>
        </div>` : ''}

        <div class="modal__section cfg-section cfg-section--aparencia">
          <div class="modal__section-title cfg-section-title">
            <span class="cfg-section-title__dot cfg-dot--aparencia"></span>Aparência
          </div>
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

        <div class="modal__section cfg-section cfg-section--sistema">
          <div class="modal__section-title cfg-section-title">
            <span class="cfg-section-title__dot cfg-dot--sistema"></span>Sistema
          </div>
          <div class="config-row">
            <label for="cfg-notif">Notificações</label>
            <label class="toggle">
              <input type="checkbox" id="cfg-notif" ${cfg.notificacoes ? 'checked' : ''} />
              <span class="toggle__track"></span>
            </label>
          </div>
        </div>

        <div class="modal__section cfg-section cfg-section--audio">
          <div class="modal__section-title cfg-section-title">
            <span class="cfg-section-title__dot cfg-dot--audio"></span>Áudio
          </div>

          <div class="config-row">
            <label for="cfg-sfx-enabled">
              Efeitos sonoros
              <small class="config-label-hint">
                Sons de clique, hover e outras interações. Quando desativado,
                o botão flutuante de SFX é ocultado.
              </small>
            </label>
            <label class="toggle">
              <input type="checkbox" id="cfg-sfx-enabled" ${getSfxBtnEnabled() ? 'checked' : ''} />
              <span class="toggle__track"></span>
            </label>
          </div>

          <div class="config-row">
            <label for="cfg-music-enabled">
              Música de fundo
              <small class="config-label-hint">
                Trilhas sonoras ambiente. Quando desativado, a música para
                e o botão flutuante de música é ocultado.
              </small>
            </label>
            <label class="toggle">
              <input type="checkbox" id="cfg-music-enabled" ${getMusicBtnEnabled() ? 'checked' : ''} />
              <span class="toggle__track"></span>
            </label>
          </div>

          <div class="config-row">
            <label>
              Configurações de Som
              <small class="config-label-hint">
                Ajuste volumes, variantes de SFX e trilhas sonoras.
              </small>
            </label>
            <button class="modal-btn modal-btn--ghost" id="btn-abrir-audio">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
              Configurar
            </button>
          </div>
        </div>


      </div>

      <div class="modal__footer cfg-footer">
        <button class="modal-btn modal-btn--ghost"   id="btn-reset-configs">Resetar padrão</button>
        <button class="modal-btn modal-btn--primary" id="btn-salvar-configs">Salvar</button>
      </div>

    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('modal--open'));

  /* Leitura dos campos de configuração */
  function _lerConfigs() {
    return {
      tema:            modal.querySelector('#cfg-tema').value,
      animacoes:       modal.querySelector('#cfg-anim').checked,
      notificacoes:    modal.querySelector('#cfg-notif').checked,
      sfxBtnEnabled:   modal.querySelector('#cfg-sfx-enabled').checked,
      musicBtnEnabled: modal.querySelector('#cfg-music-enabled').checked,
    };
  }

  let _configsAlteradas = false;
  function _autoSave() {
    _configsAlteradas = true;
    setConfigs(_lerConfigs());
  }

  modal.querySelector('#cfg-tema').addEventListener('change',  _autoSave);
  modal.querySelector('#cfg-anim').addEventListener('change',  _autoSave);
  modal.querySelector('#cfg-notif').addEventListener('change', _autoSave);

  /* SFX — controla visibilidade do botão flutuante */
  modal.querySelector('#cfg-sfx-enabled').addEventListener('change', function () {
    setSfxBtnEnabled(this.checked);
    setConfigs({ sfxBtnEnabled: this.checked });
    if (this.checked) playSound('click', 'inicial');
  });

  /* Música — controla visibilidade do botão flutuante */
  modal.querySelector('#cfg-music-enabled').addEventListener('change', function () {
    setMusicBtnEnabled(this.checked);
    setConfigs({ musicBtnEnabled: this.checked });
    playSound('click', 'inicial');
  });

  /* Fechar com toast se houve alterações */
  function _fecharComToast() {
    playSound('closeModal', 'inicial');
    _fecharModal(modal);
    if (_configsAlteradas) mostrarToast('Configurações salvas!');
  }

  modal.querySelector('#modal-overlay-config').addEventListener('click', _fecharComToast);
  modal.querySelector('#modal-close-config').addEventListener('click',   _fecharComToast);

  /* Ações do rodapé */
  modal.querySelector('#btn-salvar-configs').addEventListener('click', () => {
    playSound('click', 'inicial');
    setConfigs(_lerConfigs());
    _configsAlteradas = true;
    _fecharComToast();
  });

  modal.querySelector('#btn-reset-configs').addEventListener('click', () => {
    playSound('click', 'inicial');
    resetConfigs();
    Sound.resetAudio();
    _fecharModal(modal);
    mostrarToast('Configurações resetadas.');
    setTimeout(_abrirModalConfig, 300);
  });

  modal.querySelector('#btn-abrir-audio').addEventListener('click', () => {
    playSound('click', 'inicial');
    Sound.openModal();
  });

  /* Logout (quando logado) */
  if (estaLogado()) {
    modal.querySelector('#btn-logout')?.addEventListener('click', () => {
      playSound('click', 'inicial');
      limparDadosQuiz();
      logout();
      _fecharModal(modal);
      _refreshHeader();
      mostrarToast('Sessão encerrada.');
    });
  }

}


/* ═══════════════════════════════════════════════
   SEÇÃO 8 — MODAL PERFIL
   Avatar picker (emoji) + salvar + logout.
═══════════════════════════════════════════════ */

const _EMOJIS_PERFIL = [
  '🎓','🧑‍💻','👾','🦊','🐉','🌙',
  '⚡','🔥','🎯','🧠','🚀','🦁',
  '📚','💡','☕','🌟','🎸','🐺',
  '🤖','🧙','🎭','🏆','🎲','🛡️',
];

function _abrirPerfilModal() {
  _fecharTodosModais();
  playSound('openModal', 'inicial');

  const u = getUsuario();
  if (!u) return;

  const avatarAtual   = u.foto ? null : (u.avatar ?? u.nome.charAt(0).toUpperCase());
  const avatarHTML    = u.foto
    ? `<img src="${u.foto}" alt="${u.nome}" class="pm-avatar__img" />`
    : `<span class="pm-avatar__emoji" id="pm-avatar-emoji">${avatarAtual}</span>`;
  const badgeHTML     = u.admin
    ? `<div class="pm-data-badge pm-data-badge--admin">admin</div>`
    : `<div class="pm-data-badge pm-data-badge--locked">verificado</div>`;
  const changeBtnHTML = u.foto ? '' : `
    <button class="pm-change-btn" id="pm-toggle-picker" type="button">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.2" stroke-linecap="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
      Alterar avatar
    </button>`;
  const emojiGridHTML = _EMOJIS_PERFIL.map(e => `
    <button type="button" class="ej${e === avatarAtual ? ' on' : ''}"
            data-emoji="${e}">${e}</button>
  `).join('');

  const modal = _criarModal('perfil');
  modal.innerHTML = `
    <div class="modal__overlay" id="modal-overlay-perfil"></div>
    <div class="pm-duo">

      <div class="modal__box--perfil" role="dialog" aria-modal="true" aria-label="Perfil">

        <div class="pm-top">
          <button class="pm-close-btn" id="pm-close-btn" aria-label="Fechar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6"  y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div class="pm-avatar-ring">
            <div class="pm-avatar-inner" id="pm-avatar-display">${avatarHTML}</div>
          </div>
          <h3 class="pm-username">${u.nome}</h3>
          <span class="pm-role-pill ${u.admin ? 'pm-role-pill--admin' : ''}">
            ${u.admin ? 'Administrador' : 'Estudante'}
          </span>
          ${changeBtnHTML}
        </div>

        <div class="modal__body-scroll">
          <div class="pm-data pm-data--card">

            <div class="pm-data-row">
              <div class="pm-data-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="pm-data-content">
                <span class="pm-data-label">Nome</span>
                <span class="pm-data-value">${u.nome}</span>
              </div>
              ${badgeHTML}
            </div>

            <div class="pm-data-row">
              <div class="pm-data-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div class="pm-data-content">
                <span class="pm-data-label">PIN</span>
                <span class="pm-data-value pm-data-value--pin">• • •</span>
              </div>
              <span class="pm-pin-admin-badge">admin</span>
            </div>

          </div>
        </div>

        <div class="pm-footer">
          <button class="pm-btn-logout" id="pm-btn-logout">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sair da conta
          </button>
          <button class="pm-btn-save" id="pm-btn-salvar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.2" stroke-linecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Salvar
          </button>
        </div>
      </div>

      <div class="pm-picker-panel" id="pm-picker-panel">
        <div class="pm-picker-inner">

          <div class="pm-picker-head">
            <span class="pm-picker-title">Avatar</span>
            <button class="pm-picker-close" id="pm-picker-close" aria-label="Fechar picker">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6"  y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="pm-picker-preview">
            <div class="pm-mini-ring">
              <div class="pm-avatar-inner">
                <span id="pm-picker-preview-emoji">${avatarAtual}</span>
              </div>
            </div>
            <div class="pm-picker-preview-info">
              <span class="pm-picker-preview-lbl">Preview</span>
              <span class="pm-picker-preview-val" id="pm-picker-preview-val">${avatarAtual}</span>
            </div>
          </div>

          <div class="pm-picker-grid-wrap">
            <div class="pm-picker-grid" id="pm-picker-grid">${emojiGridHTML}</div>
          </div>

          <div class="pm-picker-foot">
            <button class="modal-btn modal-btn--ghost"   id="pm-picker-cancel">Cancelar</button>
            <button class="modal-btn modal-btn--primary" id="pm-picker-ok">Aplicar</button>
          </div>

        </div>
      </div>

    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('modal--open'));

  let avatarSelecionado = avatarAtual;
  let pickerAberto      = false;

  /* Helpers do picker */
  function _setPreview(emoji) {
    const elEmoji = modal.querySelector('#pm-picker-preview-emoji');
    const elVal   = modal.querySelector('#pm-picker-preview-val');
    if (elEmoji) elEmoji.textContent = emoji;
    if (elVal)   elVal.textContent   = emoji;
  }

  function _abrirPicker() {
    pickerAberto = true;
    modal.querySelector('#pm-picker-panel')?.classList.add('pm-picker-panel--open');
    modal.querySelector('#pm-toggle-picker')?.classList.add('pm-change-btn--active');
  }

  function _fecharPicker() {
    pickerAberto = false;
    modal.querySelector('#pm-picker-panel')?.classList.remove('pm-picker-panel--open');
    modal.querySelector('#pm-toggle-picker')?.classList.remove('pm-change-btn--active');
  }

  function _aplicarAvatar(emoji) {
    const display = modal.querySelector('#pm-avatar-emoji');
    if (display) display.textContent = emoji;
    avatarSelecionado = emoji;
  }

  /* Eventos do picker */
  modal.querySelector('#pm-picker-grid')?.addEventListener('click', e => {
    const btn = e.target.closest('.ej');
    if (!btn) return;
    playSound('click', 'inicial');
    avatarSelecionado = btn.dataset.emoji;
    _setPreview(avatarSelecionado);
    modal.querySelectorAll('#pm-picker-grid .ej').forEach(b =>
      b.classList.toggle('on', b.dataset.emoji === avatarSelecionado)
    );
  });

  modal.querySelector('#pm-toggle-picker')?.addEventListener('click', () => {
    playSound('click', 'inicial');
    pickerAberto ? _fecharPicker() : _abrirPicker();
  });

  modal.querySelector('#pm-picker-close')?.addEventListener('click',  _fecharPicker);
  modal.querySelector('#pm-picker-cancel')?.addEventListener('click', () => {
    playSound('click', 'inicial');
    _fecharPicker();
  });
  modal.querySelector('#pm-picker-ok')?.addEventListener('click', () => {
    playSound('click', 'inicial');
    _aplicarAvatar(avatarSelecionado);
    _fecharPicker();
  });

  /* Salvar perfil */
  modal.querySelector('#pm-btn-salvar')?.addEventListener('click', async () => {
    playSound('click', 'inicial');
    _aplicarAvatar(avatarSelecionado);

    const usuarioAtualizado = { ...getUsuario(), avatar: avatarSelecionado };
    setUsuario(usuarioAtualizado);

    try {
      const { salvarAvatar } = await import('./src/firebase.js');
      if (typeof salvarAvatar === 'function') {
        await salvarAvatar(usuarioAtualizado.uid, avatarSelecionado);
      }
    } catch (err) {
      console.warn('[salvarAvatar] Falha ao sincronizar com o Firebase:', err);
    }

    _fecharModal(modal);
    _refreshHeader();
    mostrarToast('Perfil atualizado!');
  });

  /* Logout */
  modal.querySelector('#pm-btn-logout')?.addEventListener('click', () => {
    playSound('click', 'inicial');
    limparDadosQuiz();
    logout();
    _fecharModal(modal);
    _refreshHeader();
    mostrarToast('Sessão encerrada.');
  });

  /* Fechar */
  function _fecharPerfil() {
    playSound('closeModal', 'inicial');
    _fecharModal(modal);
  }
  modal.querySelector('#pm-close-btn')?.addEventListener('click',         _fecharPerfil);
  modal.querySelector('#modal-overlay-perfil')?.addEventListener('click', _fecharPerfil);
}


/* ═══════════════════════════════════════════════
   SEÇÃO 9 — UTILITÁRIOS
   ─────────────────────────────────────────────
   9a. Modais — criar, fechar, fechar todos
   9b. Confirmação de ação destrutiva (dois cliques)
   9c. Toast — empilhamento + reposicionamento
═══════════════════════════════════════════════ */

/* ── 9a. Modais ── */

function _criarModal(id) {
  const el = document.createElement('div');
  el.className = 'modal';
  el.id        = `modal-${id}`;
  return el;
}

function _fecharModal(modal) {
  modal.classList.remove('modal--open');
  modal.addEventListener('transitionend', () => modal.remove(), { once: true });
}

function _fecharTodosModais() {
  document.querySelectorAll('.modal').forEach(m => m.remove());
}

/* ── 9b. Confirmação de ação destrutiva ──
   Primeiro clique: transforma o botão em "Tem certeza?" (3 s).
   Segundo clique:  executa o callback.                          */

function _confirmar(btn, callback) {
  if (btn.dataset.confirmando === 'true') {
    btn.dataset.confirmando = 'false';
    btn.textContent = btn.dataset.textoOriginal;
    btn.classList.remove('modal-btn--danger');
    callback();
    return;
  }

  btn.dataset.textoOriginal = btn.textContent;
  btn.dataset.confirmando   = 'true';
  btn.textContent = 'Tem certeza?';
  btn.classList.add('modal-btn--danger');

  setTimeout(() => {
    if (!document.body.contains(btn)) return;
    if (btn.dataset.confirmando === 'true') {
      btn.dataset.confirmando = 'false';
      btn.textContent = btn.dataset.textoOriginal;
      btn.classList.remove('modal-btn--danger');
    }
  }, 3000);
}

/* ── 9c. Toast ── */

const TOAST_OFFSET   = 12;
const TOAST_DURATION = 2800;

function mostrarToast(msg) {
  const existentes = document.querySelectorAll('.nexus-toast');
  let nextBottom   = 32;
  existentes.forEach(t => { nextBottom += t.offsetHeight + TOAST_OFFSET; });

  const t       = document.createElement('div');
  t.className   = 'nexus-toast';
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
  }, TOAST_DURATION);
}

function _reposicionarToasts() {
  let bottom = 32;
  document.querySelectorAll('.nexus-toast').forEach(t => {
    t.style.bottom = `${bottom}px`;
    bottom += t.offsetHeight + TOAST_OFFSET;
  });
}