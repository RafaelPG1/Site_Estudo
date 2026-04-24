/* =============================================
   NEXUS STUDY — shared/js/fundo.js
   Injeta o fundo visual global (orbs + grid)
   automaticamente em qualquer página.

   Como usar: importe este script no HTML
   antes do fechamento do </body>:

     <script type="module" src="../../shared/js/fundo.js"></script>

   O caminho ../../ varia conforme a profundidade
   da pasta — ajuste conforme necessário.
   ============================================= */

(function () {
  /* ── 1. Injeta o CSS do fundo ── */
  const scriptEl = document.currentScript ||
    document.querySelector('script[src*="fundo.js"]');

  const scriptSrc = scriptEl ? scriptEl.getAttribute('src') : null;
  const cssPath = scriptSrc
    ? scriptSrc.replace('js/fundo.js', 'css/fundo.css')
    : '../../shared/css/fundo.css'; // fallback

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssPath;

  // Insere antes de qualquer outro <link> ou <style> para garantir
  // que os CSS de página possam sobrescrever se necessário
  const firstLink = document.head.querySelector('link, style');
  if (firstLink) {
    document.head.insertBefore(link, firstLink);
  } else {
    document.head.appendChild(link);
  }

  /* ── 2. Injeta os elementos HTML do fundo ── */
  function injectFundo() {
    // Evita duplicar se já existirem
    if (document.querySelector('.bg-orb--1')) return;

    const fundo = document.createDocumentFragment();

    // Orb 1
    const orb1 = document.createElement('div');
    orb1.className = 'bg-orb bg-orb--1';
    fundo.appendChild(orb1);

    // Orb 2
    const orb2 = document.createElement('div');
    orb2.className = 'bg-orb bg-orb--2';
    fundo.appendChild(orb2);

    // Orb 3
    const orb3 = document.createElement('div');
    orb3.className = 'bg-orb bg-orb--3';
    fundo.appendChild(orb3);

    // Grid overlay
    const grid = document.createElement('div');
    grid.className = 'bg-grid';
    fundo.appendChild(grid);

    // Insere no início do body
    document.body.insertBefore(fundo, document.body.firstChild);
  }

  // Garante que o body já existe antes de injetar
  if (document.body) {
    injectFundo();
  } else {
    document.addEventListener('DOMContentLoaded', injectFundo);
  }
})();