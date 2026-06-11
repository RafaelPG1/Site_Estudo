// @ts-nocheck
/* =============================================
   NEXUS STUDY — quiz/quiz.js
   ============================================= */

import {
  getSemestreAtual,
  setSemestre,
  getDisciplinasDeSemestre,
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
  const deps = [
    raiz + '/shared/js/ia/ia-ui.js',
    raiz + '/shared/js/ia/ia-search.js',
    raiz + '/shared/js/ia/ia-loader.js',
    raiz + '/shared/js/ia/ia-worker.js',
  ];
  Promise.all(deps.map(_loadScript))
    .then(() => _loadScript(raiz + '/shared/js/ia/ia.js'))
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

  // ── Inicialização ─────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', async () => {
    Sound.init();
    installAudioRecovery({ Sound, audio });
    await Sound.waitUntilReady();

    injetarLogo('#header-logo-wrap');

    document.querySelector('.back-btn')
      ?.addEventListener('click', () => playSound('click', 'quiz'));

    _montarSelect();
    gerarCards(semAtual);
    sincronizarSemNaURL(semAtual);
    preencherAnos(['footer-year']);
  });

}());