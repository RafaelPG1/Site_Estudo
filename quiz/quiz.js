// @ts-nocheck
/* =============================================
   NEXUS STUDY — quiz/quiz.js
   ============================================= */

import {
  getSemestreAtual,
  setSemestre,
  getDisciplinasDeSemestre,
  getConfigs,
  setConfigs,
  limparDadosQuiz,
} from '../src/global.js';

import { sincronizarSemNaURL }            from '../shared/js/utils/url.js';
import { criarSemestreSelect, preencherAnos } from '../shared/js/utils/dom.js';
import { injetarLogo }                    from '../shared/js/utils/logo.js';
import { Sound, audio, installAudioRecovery, playSound } from '../shared/js/audio/audio-api.js';

// ── Assistente Nexus ──────────────────────────────────────────
function _loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`[Nexus IA] Falha ao carregar: ${src}`));
    document.body.appendChild(s);
  });
}
function _carregarIA() {
  const raiz = new URL('../', import.meta.url).href.replace(/\/$/, '');
  const BASE = raiz + '/shared/js/ia/';
  const deps = [
    BASE + 'core/text-utils.js',
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
// ─────────────────────────────────────────────────────────────

(function () {

  // ── Lê ?sem= da URL e aplica antes de qualquer coisa ─────────
  const semParam = new URLSearchParams(location.search).get('sem');
  if (semParam) setSemestre(semParam);

  let semAtual = getSemestreAtual();

  // ── Disciplinas ───────────────────────────────────────────────
  const DISC_CLASS = {
    poo:         'disc-card--blue',
    redes:       'disc-card--teal',
    design:      'disc-card--gold',
    banco_dados: 'disc-card--rose',
  };

  function _resolverPeriodo(sem) {
    /* "2026.1-AP2" → "2026.1" · "2026.1" → "2026.1" */
    return sem.includes('-') ? sem.split('-')[0] : sem;
  }

  function gerarCards(sem) {
    const periodo = _resolverPeriodo(sem);
    const ano     = periodo.split('.')[0];
    const grid    = document.getElementById('disciplines-grid');
    const msgEl   = document.getElementById('disciplines-empty');
    const discs   = getDisciplinasDeSemestre(sem);

    grid.querySelectorAll('.disc-card').forEach(c => c.remove());

    if (!discs.length) {
      msgEl.textContent   = `Nenhuma disciplina cadastrada para ${sem}.`;
      msgEl.style.display = 'block';
      return;
    }

    msgEl.style.display = 'none';

    discs.forEach(disc => {
      const href  = `disciplinas/${ano}/${periodo}/${disc.arquivo}.html?sem=${sem}`;
      const cls   = DISC_CLASS[disc.id] ?? 'disc-card--blue';
      const label = disc.apelido ?? disc.nome;

      const a = document.createElement('a');
      a.href      = href;
      a.className = `disc-card ${cls}`;
      a.setAttribute('role', 'listitem');
      a.setAttribute('aria-label', disc.nome);
      a.innerHTML = `
        <div class="disc-card__icon-col">
          <div class="disc-card__icon-wrap"><span>${disc.emoji}</span></div>
        </div>
        <div class="disc-card__body">
          <h2 class="disc-card__title">${label}</h2>
          <p class="disc-card__desc">${disc.nome}</p>
        </div>
        <div class="disc-card__cta">
          <div class="disc-card__arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
            </svg>
          </div>
          <span class="disc-card__cta-label">Iniciar</span>
        </div>
        <div class="disc-card__glow"></div>
      `;

      a.addEventListener('mouseenter', () => playSound('hover', 'quiz'));
      a.addEventListener('click',      () => playSound('click', 'quiz'));

      grid.insertBefore(a, msgEl);
    });
  }

  // ── Monta o select de semestre igual ao index.js ──────────────
  function _montarSelect() {
    const wrap = document.getElementById('semestre-wrap');
    if (!wrap) {
      console.warn('[Quiz] #semestre-wrap não encontrado.');
      return;
    }

    criarSemestreSelect('semestre-wrap', sem => {
      semAtual = sem;
      setSemestre(sem);
      gerarCards(sem);
      sincronizarSemNaURL(sem);
      playSound('select', 'quiz');
    });

    requestAnimationFrame(() => {
      const sel = wrap.querySelector('select');
      if (sel) sel.addEventListener('mousedown', () => playSound('click', 'quiz'));
    });
  }

  // ── Utilitários de modal (self-contained no quiz) ─────────────
  function _criarModalQuiz(id) {
    const el = document.createElement('div');
    el.className = 'modal';
    el.id = `modal-${id}`;
    return el;
  }

  function _fecharModalQuiz(modal) {
    modal.classList.remove('modal--open');
    modal.addEventListener('transitionend', () => modal.remove(), { once: true });
  }

  function _mostrarToastQuiz(msg) {
    const OFFSET   = 12;
    const DURATION = 2800;
    const existentes = document.querySelectorAll('.nexus-toast');
    let nextBottom   = 32;
    existentes.forEach(t => { nextBottom += t.offsetHeight + OFFSET; });

    const t = document.createElement('div');
    t.className   = 'nexus-toast';
    t.textContent = msg;
    t.style.bottom = `${nextBottom}px`;
    document.body.appendChild(t);

    requestAnimationFrame(() => t.classList.add('nexus-toast--show'));
    setTimeout(() => {
      t.classList.remove('nexus-toast--show');
      t.addEventListener('transitionend', () => t.remove(), { once: true });
    }, DURATION);
  }

  function _confirmarQuiz(btn, callback) {
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

  // ── Modal de configurações exclusivas do Quiz ─────────────────
  function _abrirModalConfigQuiz() {
    playSound('openModal', 'quiz');

    const cfg   = getConfigs();
    const modal = _criarModalQuiz('config-quiz');

    modal.innerHTML = `
      <div class="modal__overlay" id="modal-overlay-config-quiz"></div>
      <div class="modal__box modal__box--sm" role="dialog" aria-modal="true" aria-label="Configurações do Quiz">

        <div class="modal__header">
          <h2 class="modal__title">
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
            Quiz — Configurações
          </h2>
          <button class="modal__close" id="qcfg-close" aria-label="Fechar">✕</button>
        </div>

        <div class="modal__body-scroll">

          <div class="modal__section">
            <div class="modal__section-title">Progresso</div>

            <div class="config-row">
              <label for="qcfg-salvar-parcial">
                Salvar progresso
                <small style="display:block;font-weight:400;opacity:0.6;font-size:0.72em;margin-top:2px;">
                  Quando ativado, o progresso parcial é salvo enquanto você responde.
                  Desativado, apaga 10&nbsp;min após sair da aba.
                </small>
              </label>
              <label class="toggle">
                <input type="checkbox" id="qcfg-salvar-parcial"
                  ${cfg.salvarProgressoParcial !== false ? 'checked' : ''} />
                <span class="toggle__track"></span>
              </label>
            </div>

            <div class="config-row">
              <label for="qcfg-salvar-concluir">
                Salvar ao concluir
                <small style="display:block;font-weight:400;opacity:0.6;font-size:0.72em;margin-top:2px;">
                  Quando ativado, o resultado fica salvo permanentemente.
                  Desativado, apaga 20&nbsp;s após sair da aba.
                </small>
              </label>
              <label class="toggle">
                <input type="checkbox" id="qcfg-salvar-concluir"
                  ${cfg.salvarProgresso !== false ? 'checked' : ''} />
                <span class="toggle__track"></span>
              </label>
            </div>
          </div>

          <div class="modal__section">
            <div class="modal__section-title">Dados</div>

            <div class="config-row">
              <label>
                Limpar dados do quiz
                <small style="display:block;font-weight:400;opacity:0.6;font-size:0.72em;margin-top:2px;">
                  Remove todo progresso salvo de todos os quizzes.
                </small>
              </label>
              <button class="modal-btn modal-btn--danger" id="qcfg-btn-limpar">Limpar</button>
            </div>
          </div>

        </div>

        <div class="modal__footer">
          <button class="modal-btn modal-btn--ghost"   id="qcfg-btn-cancelar">Cancelar</button>
          <button class="modal-btn modal-btn--primary" id="qcfg-btn-salvar">Salvar</button>
        </div>

      </div>`;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('modal--open'));

    // Dependência: "Salvar ao concluir" exige "Salvar progresso" ativo
    const chkParcial  = document.getElementById('qcfg-salvar-parcial');
    const chkConcluir = document.getElementById('qcfg-salvar-concluir');

    function _syncDependencia() {
      if (!chkParcial.checked) {
        chkConcluir.checked  = false;
        chkConcluir.disabled = true;
      } else {
        chkConcluir.disabled = false;
      }
    }

    _syncDependencia();
    chkParcial.addEventListener('change', _syncDependencia);

    // Limpar
    document.getElementById('qcfg-btn-limpar')?.addEventListener('click', function () {
      _confirmarQuiz(this, () => {
        limparDadosQuiz();
        window.__nexusQuizNotifyCleared?.();
        _mostrarToastQuiz('Dados do quiz apagados.');
      });
    });

    // Fechar
    function _fechar() {
      playSound('closeModal', 'quiz');
      _fecharModalQuiz(modal);
    }

    document.getElementById('modal-overlay-config-quiz')?.addEventListener('click', _fechar);
    document.getElementById('qcfg-close')?.addEventListener('click', _fechar);
    document.getElementById('qcfg-btn-cancelar')?.addEventListener('click', () => {
      playSound('click', 'quiz');
      _fechar();
    });

    // Salvar
    document.getElementById('qcfg-btn-salvar')?.addEventListener('click', () => {
      playSound('click', 'quiz');
      setConfigs({
        salvarProgressoParcial: chkParcial.checked,
        salvarProgresso:        chkConcluir.checked,
      });
      _fecharModalQuiz(modal);
      _mostrarToastQuiz('Configurações salvas!');
    });
  }

  // ── Injeta botão ⚙ no header__right ─────────────────────────
  function _injetarBtnConfig() {
    const right = document.querySelector('.header__right');
    if (!right) return;

    const btn = document.createElement('button');
    btn.className = 'quiz-cfg-btn';
    btn.id        = 'btn-quiz-config';
    btn.title     = 'Configurações do Quiz';
    btn.setAttribute('aria-label', 'Configurações do Quiz');
    btn.innerHTML = `
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
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

    btn.addEventListener('mouseenter', () => playSound('hover', 'quiz'));
    btn.addEventListener('click', () => {
      playSound('click', 'quiz');
      _abrirModalConfigQuiz();
    });

    right.appendChild(btn);
  }

  // ── Inicialização ─────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', async () => {
    Sound.init();
    installAudioRecovery({ Sound, audio });
    await Sound.waitUntilReady();

    injetarLogo('#header-logo-wrap');

    document.querySelector('.back-btn')
      ?.addEventListener('click', () => playSound('click', 'quiz'));

    _montarSelect();
    _injetarBtnConfig();
    gerarCards(semAtual);
    sincronizarSemNaURL(semAtual);
    preencherAnos(['footer-year']);
  });

}());