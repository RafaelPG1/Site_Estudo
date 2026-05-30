// @ts-nocheck
/* =============================================
   NEXUS STUDY — quiz/disciplinas/disciplinas_init.js
   ============================================= */

import { DISC_CORES } from '../../shared/js/themes/cores.js';
import { resolverSemestreDeURL, sincronizarSemNaURL, propagarSemNosLinks } from '../../shared/js/utils/url.js';
import { aplicarCoresDisciplina } from '../../shared/js/themes/theme.js';
import { injetarLogo } from '../../shared/js/utils/logo.js';
import { Sound, audio, installAudioRecovery, playSound } from '../../shared/js/audio/audio-api.js'; // ← MIGRADO

/* ── APLICA CORES DA DISCIPLINA (síncrono, sem FOUC) ─────── */
aplicarCoresDisciplina(
  location.pathname.split('/').pop().replace('.html', ''),
  DISC_CORES
);

/* ── SEMESTRE, LINKS E FILTRO DE MODOS ───────────────────── */
(function () {
  const sem = resolverSemestreDeURL();
  sincronizarSemNaURL(sem);
  propagarSemNosLinks(sem, [
    'a[href*="ava_template"]',
    'a[href*="quiz_template"]',
    'a[href*="quiz.html"]',
    'a[href*="template.html"]',
  ]);

  // Exibe o semestre ativo no header
  const badge = document.getElementById('header-sem-badge');
  if (badge) badge.textContent = sem;

  document.querySelectorAll('[data-semestres]').forEach(function (card) {
    const semestresDoCard = card.dataset.semestres
      .split(',')
      .map(s => s.trim());
    if (!semestresDoCard.includes(sem)) {
      card.style.display = 'none';
    }
  });
})();

/* ── ÁUDIO + LOGO ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  Sound.init();
  installAudioRecovery({ Sound, audio });
  await Sound.waitUntilReady();

  injetarLogo({
    destino:  '#header-logo-wrap',
    tamanho:  32,
    layout:   'stacked',
    srcBase:  '../../../shared/img/logo.png',
    linkHref: '../../../index.html',
    area:     'quiz',
    playSound,
  });

  document.getElementById('back-btn')
    ?.addEventListener('click', () => playSound('click', 'quiz'));

  document.querySelectorAll('.modes-grid a, .disc-card').forEach(card => {
    card.addEventListener('mouseenter', () => playSound('hover', 'quiz'));
    card.addEventListener('click',      () => playSound('click', 'quiz'));
  });
});