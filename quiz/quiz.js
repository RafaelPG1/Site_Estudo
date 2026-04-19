/* =============================================
   NEXUS STUDY — quiz/quiz.js
   Lógica da página de seleção de disciplinas
   Usa global.js como fonte de verdade
   ============================================= */

import {
  SEMESTRES,
  getSemestreAtual,
  setSemestre,
} from '../global.js';

(function () {

  /* 1. Semestre inicial — vem do global.js (já lê o localStorage) */
  const semParam = new URLSearchParams(location.search).get('sem');
  if (semParam && SEMESTRES.includes(semParam)) setSemestre(semParam);

  let semAtual = getSemestreAtual();

  /* 2. Popula o <select> dinamicamente com SEMESTRES do global.js */
  const select = document.getElementById('quiz-semestre-select');

  SEMESTRES.forEach(s => {
    const opt       = document.createElement('option');
    opt.value       = s;
    opt.textContent = s;
    if (s === semAtual) opt.selected = true;
    select.appendChild(opt);
  });

  /* 3. Filtra cards e atualiza hrefs */
  function aplicarSemestre(sem) {
    const ano = sem.split('.')[0];
    let visivel = 0;

    document.querySelectorAll('.disc-card[data-semestres]').forEach(card => {
      const lista = card.dataset.semestres.split(',').map(s => s.trim());

      if (lista.includes(sem)) {
        card.style.display = '';
        try {
          const url = new URL(card.href, location.href);
          url.searchParams.set('sem', sem);
          url.pathname = url.pathname.replace(/disciplinas\/\d{4}\//, `disciplinas/${ano}/`);
          card.href = url.toString();
        } catch (e) {}
        visivel++;
      } else {
        card.style.display = 'none';
      }
    });

    const msgEl = document.getElementById('disciplines-empty');
    if (msgEl) {
      msgEl.textContent = visivel === 0 ? `Nenhuma disciplina cadastrada para o semestre ${sem}.` : '';
      msgEl.style.display = visivel === 0 ? 'block' : 'none';
    }
  }

  /* 4. Sincroniza URL sem recarregar */
  function sincronizarURL(sem) {
    try {
      const url = new URL(location.href);
      url.searchParams.set('sem', sem);
      history.replaceState(null, '', url.toString());
    } catch (e) {}
  }

  /* 5. Boot */
  aplicarSemestre(semAtual);
  sincronizarURL(semAtual);

  /* 6. Evento de troca */
  select.addEventListener('change', () => {
    semAtual = select.value;
    setSemestre(semAtual);
    aplicarSemestre(semAtual);
    sincronizarURL(semAtual);
  });

  /* 7. Footer year */
  const fy = document.getElementById('footer-year');
  if (fy) fy.textContent = new Date().getFullYear();

})();