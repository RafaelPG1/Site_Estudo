/* dashboard.js — Nexus Study · Área Pessoal */

(function () {
  'use strict';

  /* ── SESSION TIMER ──────────────────────────────────────── */
  let seconds = 48 * 60 + 22;
  const timeEl = document.querySelector('.session-time');

  if (timeEl) {
    setInterval(function () {
      seconds++;
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      timeEl.textContent = m + ':' + s;
    }, 1000);
  }

  /* ── PROGRESS BAR ANIMATION ON LOAD ────────────────────── */
  window.addEventListener('load', function () {
    document.querySelectorAll('.prog-fill').forEach(function (bar) {
      const targetWidth = bar.style.width;
      bar.style.width = '0%';
      setTimeout(function () {
        bar.style.width = targetWidth;
      }, 200);
    });
  });

})();