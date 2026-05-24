/* =============================================
   NEXUS STUDY — index.js
   Lógica da página inicial
   ============================================= */

import {
  getEstado, setUsuario, getUsuario, estaLogado,
  setPagina,
  setConfigs, getConfigs, resetConfigs,
  hydrateConfigs,
  limparDadosQuiz,
  getSemestreAtual, getDisciplinasDeSemestre,
} from './src/global.js';

import { injetarLogo } from './shared/js/utils/logo.js';
import { login, logout, carregarConfigs } from './src/firebase.js';
import { criarSemestreSelect, preencherAnos } from './shared/js/utils/dom.js';
import audio from './shared/js/audio/sfx.js';

/* ─────────────────────────────────────────────
   SFX — mapa de sons por evento
   ─────────────────────────────────────────────
   Troque o valor de cada chave pelo ID do som
   desejado (veja catalog em sfx.js).

   Disponíveis por categoria:
     click     → click, click2, click3, click4, click5, click6
     hover     → hover, hover2, hover3, hover4, hover5, hover6, hover7, hover8
     openModal → openModal1, openModal2, openModal3
     closeModal→ closeModal1, closeModal2, closeModal3
     select    → select1 … select10
───────────────────────────────────────────── */
const SFX_MAP = {
  click:      'click',
  hover:      'hover2',
  openModal:  'openModal2',
  closeModal: 'closeModal1',
  select:     'select1',
};

/**
 * Toca o som mapeado para um evento.
 * Se o ID não existir no catálogo, falha silenciosamente.
 *
 * @param {'click'|'hover'|'openModal'|'closeModal'|'select'} event
 */
function playSound(event) {
  const id = SFX_MAP[event];
  if (!id) return;
  try { audio.sfx[id]?.(); } catch (_) {}
}

/* ─────────────────────────────────────────────
   INICIALIZAÇÃO
───────────────────────────────────────────── */
function init() {
  try {
    if (estaLogado() && getUsuario()?.admin) {
      window.location.replace('/admin/admin.html');
      return;
    }

    injetarLogo({
      destino:  '#header-logo-wrap',
      tamanho:  38,
      layout:   'stacked',
      srcBase:  './shared/img/logo.png',
      linkHref: './index.html',
    });

    setPagina('HOME');
    _refreshHeader();
    bindCardLinks();
    preencherAnos(['footer-year']);
  } catch (err) {
    console.error('[init] Erro crítico na inicialização:', err);
    try { _refreshHeader(); } catch (_) {}
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ─────────────────────────────────────────────
   HEADER — ponto único de reconstrução
───────────────────────────────────────────── */

function _refreshHeader() {
  try {
    renderHeader();
    _montarSelect();
  } catch (err) {
    console.error('[Header] Falha ao reconstruir o header:', err);
  }
}

function _montarSelect() {
  const wrap = document.getElementById('semestre-wrap');
  if (!wrap) {
    console.warn('[Header] #semestre-wrap não encontrado — renderHeader() pode ter falhado.');
    return;
  }
  criarSemestreSelect('semestre-wrap', sem => {
    // Som de select ao confirmar a escolha do semestre
    playSound('select');
    document.dispatchEvent(new CustomEvent('nexus:semestreChanged', { detail: sem }));
  });

  // Som de click ao abrir a lista do select do semestre
  // Aguarda o elemento ser criado pelo criarSemestreSelect
  requestAnimationFrame(() => {
    const sel = wrap.querySelector('select');
    if (sel) {
      sel.addEventListener('mousedown', () => playSound('click'));
    }
  });
}

function renderHeader() {
  const nav = document.getElementById('header-nav');
  if (!nav) {
    console.error('[Header] #header-nav não encontrado no DOM.');
    return;
  }
  nav.innerHTML = '';

  const semestreWrap = document.createElement('div');
  semestreWrap.id = 'semestre-wrap';
  nav.appendChild(semestreWrap);

  if (estaLogado()) {
    const u = getUsuario();
    const avatarVal = u.avatar ?? u.nome.charAt(0).toUpperCase();

    const btnPerfil = document.createElement('button');
    btnPerfil.className = 'nav-btn--avatar';
    btnPerfil.id    = 'btn-perfil';
    btnPerfil.title = u.nome;

    if (u.foto) {
      btnPerfil.innerHTML = `<img src="${u.foto}" alt="${u.nome}" class="avatar-img" />`;
    } else {
      btnPerfil.textContent = avatarVal;
    }

    // Sem hover — apenas click
    btnPerfil.addEventListener('click', () => { playSound('click'); abrirPerfilModal(); });
    nav.appendChild(btnPerfil);

  } else {
    const btnEntrar = document.createElement('button');
    btnEntrar.className   = 'nav-btn';
    btnEntrar.id          = 'btn-entrar';
    btnEntrar.textContent = 'Entrar';
    btnEntrar.addEventListener('mouseenter', () => playSound('hover'));
    btnEntrar.addEventListener('click', () => { playSound('click'); abrirModalLogin(); });
    nav.appendChild(btnEntrar);
  }

  const btnConfig = document.createElement('button');
  btnConfig.className = 'nav-btn nav-btn--icon';
  btnConfig.id    = 'btn-config';
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
  // Sem hover — apenas click
  btnConfig.addEventListener('click', () => { playSound('click'); abrirModalConfig(); });
  nav.appendChild(btnConfig);
}

/* ─────────────────────────────────────────────
   CARDS — links + hover
───────────────────────────────────────────── */
function bindCardLinks() {
  const rotas = {
    'card-pessoal': './area_pessoal/pessoal.html',
    'card-resumos': './resumo/resumo.html',
    'card-quiz':    './quiz/quiz.html',
    'card-jogos':   './games/jogo.html',
  };
  Object.entries(rotas).forEach(([id, path]) => {
    const card = document.getElementById(id);
    if (!card) return;
    card.addEventListener('mouseenter', () => playSound('hover'));
    card.addEventListener('click', () => {
      playSound('click');
      window.location.href = path;
    });
  });
}

/* ─────────────────────────────────────────────
   MODAL LOGIN — Nome + PIN
───────────────────────────────────────────── */
function abrirModalLogin() {
  fecharTodosModais();
  playSound('openModal');

  const modal = criarModal('login');
  modal.innerHTML = `
    <div class="modal__overlay" id="modal-overlay-login"></div>
    <div class="modal__box modal__box--sm" role="dialog" aria-modal="true" aria-label="Entrar">

      <div class="modal__header modal__header--normal">
        <h2 class="modal__title" id="login-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Entrar no Nexus
        </h2>
        <button class="modal__close" id="modal-close-login" aria-label="Fechar">✕</button>
      </div>

      <div class="modal__header modal__header--admin-view">
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

      <div class="modal__body-scroll">
      <div class="modal__section">

        <div class="config-row config-row--col">
          <label for="login-nome">Nome</label>
          <input
            type="text"
            id="login-nome"
            class="config-input"
            placeholder="seu nome"
            maxlength="30"
            autocomplete="off"
            autocapitalize="off"
          />
        </div>

        <div class="config-row config-row--col">
          <label for="login-pin">PIN</label>
          <div class="pin-wrap">
            <input
              type="password"
              id="login-pin"
              class="config-input"
              placeholder="• • •"
              maxlength="3"
              inputmode="numeric"
              autocomplete="off"
            />
            <button type="button" class="pin-eye" id="btn-pin-eye" aria-label="Mostrar PIN" tabindex="-1">
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

      <div class="modal__footer">
        <button class="modal-btn modal-btn--primary" id="btn-login-entrar">
          Entrar
        </button>
      </div>

    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('modal--open'));

  const inputNome = document.getElementById('login-nome');
  const box       = modal.querySelector('.modal__box');
  const cards     = document.querySelector('.cards-grid');

  inputNome.addEventListener('input', function () {
    const isAdmin = this.value.trim().toLowerCase() === 'admin';
    const pin = document.getElementById('login-pin');
    pin.setAttribute('maxlength', isAdmin ? '9' : '3');
    if (!isAdmin && pin.value.length > 3) pin.value = pin.value.slice(0, 3);
    box.classList.toggle('modal__box--admin', isAdmin);
    cards?.classList.toggle('cards-hidden', isAdmin);
  });

  document.getElementById('btn-pin-eye').addEventListener('click', function () {
    const pin  = document.getElementById('login-pin');
    const icon = document.getElementById('pin-eye-icon');
    const show = pin.type === 'password';
    pin.type = show ? 'text' : 'password';
    icon.innerHTML = show
      ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
         <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
         <line x1="1" y1="1" x2="23" y2="23"/>`
      : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
         <circle cx="12" cy="12" r="3"/>`;
  });

  document.getElementById('login-nome').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('login-pin').focus();
  });

  document.getElementById('login-pin').addEventListener('keydown', e => {
    if (e.key === 'Enter') _tentarLogin();
  });

  document.getElementById('modal-overlay-login').addEventListener('click', () => {
    cards?.classList.remove('cards-hidden');
    playSound('closeModal');
    fecharModal(modal);
  });
  document.getElementById('modal-close-login').addEventListener('click', () => {
    cards?.classList.remove('cards-hidden');
    playSound('closeModal');
    fecharModal(modal);
  });
  document.getElementById('btn-login-entrar').addEventListener('click', () => { playSound('click'); _tentarLogin(); });

  async function _tentarLogin() {
    const nome = document.getElementById('login-nome').value.trim();
    const pin  = document.getElementById('login-pin').value.trim();
    const erro = document.getElementById('login-erro');
    const btn  = document.getElementById('btn-login-entrar');

    erro.style.display = 'none';

    if (!nome || !pin) {
      erro.textContent   = 'Selecione seu nome e digite o PIN.';
      erro.style.display = 'block';
      return;
    }

    btn.textContent = 'Entrando…';
    btn.disabled    = true;

    const resultado = await login(nome, pin);

    btn.textContent = 'Entrar';
    btn.disabled    = false;

    if (resultado.ok) {

      if (resultado.usuario.admin) {
        cards?.classList.remove('cards-hidden');
        fecharModal(modal);
        window.location.replace('/admin/admin.html');
        return;
      }

      limparDadosQuiz();
      const configsRemota = await carregarConfigs(resultado.usuario.uid);

      if (configsRemota) {
        // FIX 3: usa hydrateConfigs em vez de setConfigs.
        // hydrateConfigs atualiza memória, localStorage e UI
        // sem disparar write-back desnecessário no Firebase.
        // setConfigs() é reservado para mudanças intencionais do usuário.
        hydrateConfigs({ ...configsRemota, ...getConfigs() });
        console.log('[login] configs mescladas com Firebase ✓');
      } else {
        console.log('[login] nenhuma config remota — mantendo localStorage');
      }

      cards?.classList.remove('cards-hidden');
      fecharModal(modal);
      _refreshHeader();

      // Notifica audio-state.js que o login foi concluído e as configs
      // já estão mergeadas no global. O audio-state.js usa o sistema de
      // token para descartar o disparo anterior (feito via setTimeout em
      // setUsuario) e aplicar o modo correto do Firebase para este usuário.
      document.dispatchEvent(new CustomEvent('nexus:loginSuccess', {
        detail: { uid: resultado.usuario.uid },
      }));

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
  playSound('openModal');

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

        <div class="modal__section">
          <div class="modal__section-title">Área Pessoal</div>

          <div class="config-row">
            <label>
              Limpar checklist
              <small style="display:block; font-weight:400; opacity:0.6; font-size:0.72em; margin-top:2px;">
                Desmarca todos os itens do checklist de uma disciplina específica.
              </small>
            </label>
            <div class="flashcard-disc-btns" id="pessoal-cl-btns"></div>
          </div>

          <div class="config-row">
            <label>
              Limpar tarefas
              <small style="display:block; font-weight:400; opacity:0.6; font-size:0.72em; margin-top:2px;">
                Remove todas as categorias e tarefas de uma disciplina específica.
              </small>
            </label>
            <div class="flashcard-disc-btns" id="pessoal-task-btns"></div>
          </div>

          <div class="config-row">
            <label>
              Limpar tudo
              <small style="display:block; font-weight:400; opacity:0.6; font-size:0.72em; margin-top:2px;">
                Limpa checklist e tarefas de todas as disciplinas do semestre atual.
              </small>
            </label>
            <button class="modal-btn modal-btn--danger" id="btn-limpar-pessoal-tudo">
              Limpar tudo
            </button>
          </div>
        </div>

      </div>

      <div class="modal__footer">
        <button class="modal-btn modal-btn--ghost" id="btn-reset-configs">Resetar padrão</button>
        <button class="modal-btn modal-btn--primary" id="btn-salvar-configs">Salvar</button>
      </div>

    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('modal--open'));

  function _lerConfigs() {
    return {
      tema:                   document.getElementById('cfg-tema').value,
      animacoes:              document.getElementById('cfg-anim').checked,
      notificacoes:           document.getElementById('cfg-notif').checked,
      salvarProgressoParcial: document.getElementById('cfg-salvar-parcial').checked,
      salvarProgresso:        document.getElementById('cfg-salvar-progresso').checked,
    };
  }

  function _autoSave() { _configsAlteradas = true; setConfigs(_lerConfigs()); }

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

  let _configsAlteradas = false;

  function _fecharComToast() {
    playSound('closeModal');
    fecharModal(modal);
    if (_configsAlteradas) mostrarToast('Configurações salvas!');
  }

  document.getElementById('modal-overlay-config').addEventListener('click', _fecharComToast);
  document.getElementById('modal-close-config').addEventListener('click',   _fecharComToast);

  document.getElementById('btn-salvar-configs').addEventListener('click', () => {
    playSound('click');
    setConfigs(_lerConfigs());
    _configsAlteradas = true;
    _fecharComToast();
  });

  document.getElementById('btn-reset-configs').addEventListener('click', () => {
    playSound('click');
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

  if (estaLogado()) {
    document.getElementById('btn-logout')?.addEventListener('click', () => {
      playSound('click');
      limparDadosQuiz();
      logout(); // logout() → setUsuario(null) → dispara nexus:logout via setTimeout
      fecharModal(modal);
      _refreshHeader();
      mostrarToast('Sessão encerrada.');
    });
  }

  const sem         = getSemestreAtual();
  const disciplinas = getDisciplinasDeSemestre(sem);
  const uid         = getUsuario()?.uid ?? 'visitante';

  /* ── Flashcard SRS ── */
  async function _resetarSRS(discId) {
    try {
      const mod = await import('./games/jogos/flashcard/flashcard.js');
      if (typeof mod?.invalidarCacheSRS === 'function') {
        mod.invalidarCacheSRS(discId ?? null);
        console.log(`[SRS] cache invalidado: disc="${discId ?? 'todas'}"`);
      }
    } catch (errMod) {
      console.warn('[SRS] flashcard.js não encontrado (não crítico):', errMod?.message);
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

  /* ── Área Pessoal ── */
  const clBtns   = document.getElementById('pessoal-cl-btns');
  const taskBtns = document.getElementById('pessoal-task-btns');

  if (clBtns && taskBtns) {
    disciplinas.forEach(disc => {
      const btnCl = document.createElement('button');
      btnCl.className   = 'modal-btn modal-btn--ghost';
      btnCl.textContent = disc.apelido;
      btnCl.title       = `Limpar checklist de ${disc.nome}`;
      btnCl.addEventListener('click', () => {
        _confirmar(btnCl, async () => {
          const { saveCheckedIds } = await import('./area_pessoal/pessoal_sync.js');
          saveCheckedIds(sem, disc.id, new Set());
          mostrarToast(`Checklist de ${disc.apelido} limpo.`);
        });
      });
      clBtns.appendChild(btnCl);

      const btnTask = document.createElement('button');
      btnTask.className   = 'modal-btn modal-btn--ghost';
      btnTask.textContent = disc.apelido;
      btnTask.title       = `Limpar tarefas de ${disc.nome}`;
      btnTask.addEventListener('click', () => {
        _confirmar(btnTask, async () => {
          const { setCategorias } = await import('./area_pessoal/pessoal_sync.js');
          setCategorias(sem, disc.id, []);
          mostrarToast(`Tarefas de ${disc.apelido} apagadas.`);
        });
      });
      taskBtns.appendChild(btnTask);
    });
  }

  document.getElementById('btn-limpar-pessoal-tudo')?.addEventListener('click', function () {
    _confirmar(this, async () => {
      const { saveCheckedIds, setCategorias } = await import('./area_pessoal/pessoal_sync.js');
      for (const disc of disciplinas) {
        saveCheckedIds(sem, disc.id, new Set());
        setCategorias(sem, disc.id, []);
      }
      mostrarToast('Checklist e tarefas de todas as disciplinas apagados.');
    });
  });
}

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

/* ─────────────────────────────────────────────
   MODAL PERFIL
───────────────────────────────────────────── */

const EMOJIS_PERFIL = [
  '🎓','🧑‍💻','👾','🦊','🐉','🌙',
  '⚡','🔥','🎯','🧠','🚀','🦁',
  '📚','💡','☕','🌟','🎸','🐺',
  '🤖','🧙','🎭','🏆','🎲','🛡️',
];

function abrirPerfilModal() {
  fecharTodosModais();
  playSound('openModal');

  const u = getUsuario();
  if (!u) return;

  const avatarAtual = u.foto
    ? null
    : (u.avatar ?? u.nome.charAt(0).toUpperCase());

  const avatarHTML = u.foto
    ? `<img src="${u.foto}" alt="${u.nome}" class="pm-avatar__img" />`
    : `<span class="pm-avatar__emoji" id="pm-avatar-emoji">${avatarAtual}</span>`;

  const badgeHTML = u.admin
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

  const emojiGridHTML = EMOJIS_PERFIL.map(e => `
    <button type="button" class="ej${e === avatarAtual ? ' on' : ''}"
            data-emoji="${e}">${e}</button>
  `).join('');

  const modal = criarModal('perfil');
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
            <div class="pm-avatar-inner" id="pm-avatar-display">
              ${avatarHTML}
            </div>
          </div>

          <h3 class="pm-username">${u.nome}</h3>
          ${changeBtnHTML}
        </div>

        <div class="modal__body-scroll">
          <div class="pm-data">

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
            <div class="pm-picker-grid" id="pm-picker-grid">
              ${emojiGridHTML}
            </div>
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

  function _setPreview(e) {
    const previewEmoji = document.getElementById('pm-picker-preview-emoji');
    const previewVal   = document.getElementById('pm-picker-preview-val');
    if (previewEmoji) previewEmoji.textContent = e;
    if (previewVal)   previewVal.textContent   = e;
  }

  function _abrirPicker() {
    pickerAberto = true;
    document.getElementById('pm-picker-panel')?.classList.add('pm-picker-panel--open');
    document.getElementById('pm-toggle-picker')?.classList.add('pm-change-btn--active');
  }

  function _fecharPicker() {
    pickerAberto = false;
    document.getElementById('pm-picker-panel')?.classList.remove('pm-picker-panel--open');
    document.getElementById('pm-toggle-picker')?.classList.remove('pm-change-btn--active');
  }

  function _aplicarAvatar(emoji) {
    const display = document.getElementById('pm-avatar-emoji');
    if (display) display.textContent = emoji;
    avatarSelecionado = emoji;
  }

  document.getElementById('pm-picker-grid')?.addEventListener('click', e => {
    const btn = e.target.closest('.ej');
    if (!btn) return;
    playSound('click');
    avatarSelecionado = btn.dataset.emoji;
    _setPreview(avatarSelecionado);
    document.querySelectorAll('#pm-picker-grid .ej').forEach(b =>
      b.classList.toggle('on', b.dataset.emoji === avatarSelecionado)
    );
  });

  document.getElementById('pm-toggle-picker')?.addEventListener('click', () => {
    playSound('click');
    pickerAberto ? _fecharPicker() : _abrirPicker();
  });

  document.getElementById('pm-picker-close')?.addEventListener('click',  _fecharPicker);
  document.getElementById('pm-picker-cancel')?.addEventListener('click', () => { playSound('click'); _fecharPicker(); });

  document.getElementById('pm-picker-ok')?.addEventListener('click', () => {
    playSound('click');
    _aplicarAvatar(avatarSelecionado);
    _fecharPicker();
  });

  document.getElementById('pm-btn-salvar')?.addEventListener('click', async () => {
    playSound('click');
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

    fecharModal(modal);
    _refreshHeader();
    mostrarToast('Perfil atualizado!');
  });

  document.getElementById('pm-btn-logout')?.addEventListener('click', () => {
    playSound('click');
    limparDadosQuiz();
    logout(); // logout() → setUsuario(null) → dispara nexus:logout via setTimeout
    fecharModal(modal);
    _refreshHeader();
    mostrarToast('Sessão encerrada.');
  });

  document.getElementById('pm-close-btn')?.addEventListener('click', () => { playSound('closeModal'); fecharModal(modal); });
  document.getElementById('modal-overlay-perfil')?.addEventListener('click', () => { playSound('closeModal'); fecharModal(modal); });
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