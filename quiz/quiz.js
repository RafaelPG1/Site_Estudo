// @ts-nocheck
/* ═══════════════════════════════════════════════════════════
   NEXUS STUDY — quiz/quiz.js  (redesign completo)
   Lógica de interação da tela de seleção de disciplinas.
   ═══════════════════════════════════════════════════════════ */

import {
  getSemestreAtual,
  setSemestre,
  getDisciplinasDeSemestre,
  getConfigs,
  setConfigs,
  limparDadosQuiz,
} from '../src/global.js';

import { sincronizarSemNaURL }              from '../shared/js/utils/url.js';
import { criarSemestreSelect, preencherAnos } from '../shared/js/utils/dom.js';
import { injetarLogo }                      from '../shared/js/utils/logo.js';
import { Sound, audio, installAudioRecovery, playSound } from '../shared/js/audio/audio-api.js';

(function () {

  /* ══════════════════════════════════════════════
     IA (RESUMO) — mesmo padrão do index.js
  ══════════════════════════════════════════════ */
  window.__NEXUS_CONTEXT__ = { tipos: ['resumo'] };

  function _loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error(`[Nexus IA] Falha: ${src}`));
      document.body.appendChild(s);
    });
  }

  function _carregarIA() {
    const BASE = '../shared/js/ia/';
    const deps = [
      BASE + 'core/context.js',
      BASE + 'core/text-utils.js',
      BASE + 'core/history.js',
      BASE + 'core/loader.js',
      BASE + 'core/worker.js',
      BASE + 'core/ui.js',
      BASE + 'resumo/search.js',
    ];
    Promise.all(deps.map(_loadScript))
      .then(() => _loadScript(BASE + 'resumo/assistant.js'))
      .then(() => {
        if (window.NexusAssistant) {
          window.NexusAssistant.initUI();
          window.NexusAssistant.init();
        }
      })
      .catch(err => console.error('[Quiz] Falha ao carregar IA:', err));
  }

  /* ══════════════════════════════════════════════
     CANVAS DE FUNDO — partículas geométricas
  ══════════════════════════════════════════════ */
  function _initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [], animId;

    const PARTICLE_COUNT = window.innerWidth < 600 ? 40 : 70;
    const COLORS = ['rgba(108,99,255,', 'rgba(61,217,194,', 'rgba(247,201,72,', 'rgba(255,107,138,'];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function createParticle() {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x:     Math.random() * W,
        y:     Math.random() * H,
        // Partículas menores e mais lentas — menos flickering visual
        size:  Math.random() * 1.2 + 0.3,
        vx:    (Math.random() - 0.5) * 0.15,
        vy:    (Math.random() - 0.5) * 0.15,
        // Alpha fixo por partícula — sem variação dinâmica que cause shimmer
        alpha: Math.random() * 0.3 + 0.08,
        color,
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Grid de linhas sutis
      ctx.strokeStyle = 'rgba(255,255,255,0.018)';
      ctx.lineWidth = 0.5;
      const GRID = 80;
      for (let x = 0; x < W; x += GRID) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += GRID) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Partículas — simples pontos com alpha fixo, sem variação por frame
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        // Wraparound
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
        if (p.y < -5) p.y = H + 5;
        if (p.y > H + 5) p.y = -5;
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();

    window.addEventListener('resize', () => { resize(); });

    // Pausa quando aba não é visível (economiza CPU)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(animId); }
      else { draw(); }
    });
  }

  /* ══════════════════════════════════════════════
     CARDS
  ══════════════════════════════════════════════ */

  // Cor do tema de cada disciplina (por id)
  const DISC_THEME = {
    poo:         'disc-card--violet',
    redes:       'disc-card--cyan',
    design:      'disc-card--amber',
    banco_dados: 'disc-card--rose',
  };

  // Fallback sequencial para disciplinas não mapeadas
  const THEME_FALLBACK = [
    'disc-card--violet',
    'disc-card--cyan',
    'disc-card--amber',
    'disc-card--rose',
    'disc-card--sage',
  ];

  function _resolverPeriodo(sem) {
    return sem.includes('-') ? sem.split('-')[0] : sem;
  }

  function gerarCards(sem) {
    const periodo = _resolverPeriodo(sem);
    const ano     = periodo.split('.')[0];
    const grid    = document.getElementById('disciplines-grid');
    const msgEl   = document.getElementById('disciplines-empty');
    const discs   = getDisciplinasDeSemestre(sem);

    // Remove cards antigos
    grid.querySelectorAll('.disc-card').forEach(c => c.remove());

    if (!discs.length) {
      msgEl.textContent  = `Nenhuma disciplina cadastrada para o período ${sem}.`;
      msgEl.style.display = 'block';
      return;
    }

    msgEl.style.display = 'none';

    discs.forEach((disc, idx) => {
      const href  = `disciplinas/${ano}/${periodo}/${disc.arquivo}.html?sem=${sem}`;
      const theme = DISC_THEME[disc.id] ?? THEME_FALLBACK[idx % THEME_FALLBACK.length];
      const label = disc.apelido ?? disc.nome;
      const num   = String(idx + 1).padStart(2, '0');

      const a = document.createElement('a');
      a.href      = href;
      a.className = `disc-card ${theme}`;
      a.setAttribute('role', 'listitem');
      a.setAttribute('aria-label', disc.nome);

      a.innerHTML = `
        <div class="disc-card__inner">
          <span class="disc-card__num">${num}</span>
          <div class="disc-card__icon" aria-hidden="true">${disc.emoji}</div>
          <div class="disc-card__body">
            <h2 class="disc-card__title">${label}</h2>
            <p class="disc-card__desc">${disc.nome}</p>
          </div>
          <div class="disc-card__footer">
            <span class="disc-card__tag">Iniciar quiz</span>
            <div class="disc-card__arrow-wrap" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      `;

      a.addEventListener('mouseenter', () => playSound('hover', 'quiz'));
      a.addEventListener('click',      () => playSound('click', 'quiz'));

      grid.insertBefore(a, msgEl);
    });
  }

  /* ══════════════════════════════════════════════
     SELECT DE SEMESTRE
  ══════════════════════════════════════════════ */
  function _montarSelect() {
    const wrap = document.getElementById('semestre-wrap');
    if (!wrap) return;

    criarSemestreSelect('semestre-wrap', sem => {
      setSemestre(sem);
      gerarCards(sem);
      sincronizarSemNaURL(sem);
      playSound('select', 'quiz');
      document.dispatchEvent(new CustomEvent('nexus:semestreChanged', { detail: sem }));
    });

    requestAnimationFrame(() => {
      const sel = wrap.querySelector('select');
      if (sel) sel.addEventListener('mousedown', () => playSound('click', 'quiz'));
    });
  }

  /* ══════════════════════════════════════════════
     UTILITÁRIOS DE MODAL / TOAST
  ══════════════════════════════════════════════ */
  function _criarModal(id) {
    const el = document.createElement('div');
    el.className = 'modal';
    el.id = `modal-${id}`;
    return el;
  }

  function _fecharModal(modal) {
    modal.classList.remove('modal--open');
    modal.addEventListener('transitionend', () => modal.remove(), { once: true });
  }

  function _toast(msg) {
    const OFFSET = 12, DURATION = 2800;
    const existentes = document.querySelectorAll('.nexus-toast');
    let nextBottom = 32;
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

  /* ══════════════════════════════════════════════
     MODAL DE CONFIGURAÇÕES
  ══════════════════════════════════════════════ */
  function _abrirModalConfig() {
    playSound('openModal', 'quiz');
    const cfg   = getConfigs();
    const modal = _criarModal('config-quiz');

    modal.innerHTML = `
      <div class="modal__overlay" id="modal-overlay-cfg"></div>
      <div class="modal__box" role="dialog" aria-modal="true" aria-label="Configurações do Quiz">

        <div class="modal__header">
          <h2 class="modal__title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
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
            Configurações do Quiz
          </h2>
          <button class="modal__close" id="cfg-close" aria-label="Fechar">✕</button>
        </div>

        <div class="modal__body-scroll">
          <div class="modal__section">
            <div class="modal__section-title">Progresso</div>
            <div class="config-row">
              <label for="cfg-parcial">
                Salvar progresso
                <small style="display:block;font-weight:400;opacity:0.55;font-size:0.7em;margin-top:3px;">
                  Salva seu progresso parcial enquanto responde.
                </small>
              </label>
              <label class="toggle">
                <input type="checkbox" id="cfg-parcial"
                  ${cfg.salvarProgressoParcial !== false ? 'checked' : ''} />
                <span class="toggle__track"></span>
              </label>
            </div>
            <div class="config-row">
              <label for="cfg-concluir">
                Salvar ao concluir
                <small style="display:block;font-weight:400;opacity:0.55;font-size:0.7em;margin-top:3px;">
                  Guarda o resultado permanentemente ao terminar.
                </small>
              </label>
              <label class="toggle">
                <input type="checkbox" id="cfg-concluir"
                  ${cfg.salvarProgresso !== false ? 'checked' : ''} />
                <span class="toggle__track"></span>
              </label>
            </div>
          </div>

          <div class="modal__section">
            <div class="modal__section-title">Dados</div>
            <div class="config-row">
              <label>
                Limpar dados
                <small style="display:block;font-weight:400;opacity:0.55;font-size:0.7em;margin-top:3px;">
                  Remove todo progresso salvo de todos os quizzes.
                </small>
              </label>
              <button class="modal-btn modal-btn--danger" id="cfg-btn-limpar">Limpar</button>
            </div>
          </div>
        </div>

        <div class="modal__footer">
          <button class="modal-btn modal-btn--ghost" id="cfg-btn-cancelar">Cancelar</button>
          <button class="modal-btn modal-btn--primary" id="cfg-btn-salvar">Salvar</button>
        </div>
      </div>`;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('modal--open'));

    const chkParcial  = document.getElementById('cfg-parcial');
    const chkConcluir = document.getElementById('cfg-concluir');

    function _sync() {
      if (!chkParcial.checked) {
        chkConcluir.checked  = false;
        chkConcluir.disabled = true;
      } else {
        chkConcluir.disabled = false;
      }
    }

    _sync();
    chkParcial.addEventListener('change', _sync);

    document.getElementById('cfg-btn-limpar')?.addEventListener('click', function () {
      _confirmar(this, () => {
        limparDadosQuiz();
        window.__nexusQuizNotifyCleared?.();
        _toast('Dados do quiz apagados.');
      });
    });

    function _fechar() {
      playSound('closeModal', 'quiz');
      _fecharModal(modal);
    }

    document.getElementById('modal-overlay-cfg')?.addEventListener('click', _fechar);
    document.getElementById('cfg-close')?.addEventListener('click', _fechar);
    document.getElementById('cfg-btn-cancelar')?.addEventListener('click', () => {
      playSound('click', 'quiz');
      _fechar();
    });

    document.getElementById('cfg-btn-salvar')?.addEventListener('click', () => {
      playSound('click', 'quiz');
      setConfigs({
        salvarProgressoParcial: chkParcial.checked,
        salvarProgresso:        chkConcluir.checked,
      });
      _fecharModal(modal);
      _toast('Configurações salvas!');
    });
  }

  /* ══════════════════════════════════════════════
     INICIALIZAÇÃO
  ══════════════════════════════════════════════ */

  // Lê ?sem= da URL antes do DOMContentLoaded
  const semParam = new URLSearchParams(location.search).get('sem');
  if (semParam) setSemestre(semParam);

  let semAtual = getSemestreAtual();

  document.addEventListener('DOMContentLoaded', async () => {

    // Áudio
    Sound.init();
    installAudioRecovery({ Sound, audio });
    await Sound.waitUntilReady();

    // Logo
    injetarLogo('#header-logo-wrap');

    // Botão voltar
    document.querySelector('.nav-back')
      ?.addEventListener('click', () => playSound('click', 'quiz'));

    // Select de semestre
    _montarSelect();

    // Botão de config
    document.getElementById('btn-quiz-config')
      ?.addEventListener('click', _abrirModalConfig);

    // Cards
    gerarCards(semAtual);
    sincronizarSemNaURL(semAtual);

    // Footer
    preencherAnos(['footer-year']);

    // Canvas de fundo
    _initCanvas();

    // IA (não bloqueia renderização)
    _carregarIA();

  });

}());