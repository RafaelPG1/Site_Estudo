import {
  SEMESTRES,
  getSemestreAtual,
  setSemestre,
  getDisciplinasDeSemestre,
} from '../src/global.js';

import { sincronizarSemNaURL } from '../shared/js/utils/url.js';
import { preencherAnos } from '../shared/js/utils/dom.js';

import { injetarLogo } from '../shared/js/utils/logo.js';

(function () {

  document.addEventListener('DOMContentLoaded', () => {
    injetarLogo({ destino: '#header-logo-wrap', tamanho: 32, layout: 'stacked' });
  });

  const semParam = new URLSearchParams(location.search).get('sem');
  if (semParam && SEMESTRES.includes(semParam)) setSemestre(semParam);

  let semAtual = getSemestreAtual();

  /* ── Popula o <select> já existente no HTML ── */
  const select = document.getElementById('quiz-semestre-select');
  SEMESTRES.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    if (s === semAtual) opt.selected = true;
    select.appendChild(opt);
  });

  /* ── Mapa de cores por disciplina (classe CSS) ── */
  const DISC_CLASS = {
    poo: 'disc-card--blue', redes: 'disc-card--teal',
    design: 'disc-card--gold', banco_dados: 'disc-card--rose',
  };

  /* ── Gera os cards a partir do global.js ── */
  function gerarCards(sem) {
    const ano   = sem.split('.')[0];
    const grid  = document.getElementById('disciplines-grid');
    const msgEl = document.getElementById('disciplines-empty');
    const discs = getDisciplinasDeSemestre(sem);

    grid.querySelectorAll('.disc-card').forEach(c => c.remove());

    if (!discs.length) {
      msgEl.textContent = `Nenhuma disciplina cadastrada para ${sem}.`;
      msgEl.style.display = 'block';
      return;
    }

    msgEl.style.display = 'none';

    discs.forEach(disc => {
      const href  = `disciplinas/${ano}/${disc.arquivo}.html?sem=${sem}`;
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
      grid.insertBefore(a, msgEl);
    });
  }

  gerarCards(semAtual);
  sincronizarSemNaURL(semAtual);

  select.addEventListener('change', () => {
    semAtual = select.value;
    setSemestre(semAtual);
    gerarCards(semAtual);
    sincronizarSemNaURL(semAtual);
  });

  preencherAnos(['footer-year']);

})();