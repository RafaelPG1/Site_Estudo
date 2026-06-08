/* =============================================
   NEXUS STUDY — shared/js/office/pwa.js
   Registro do Service Worker

   Como usar: adicione em cada página HTML,
   logo antes de </body>:

     <script src="/shared/js/office/pwa.js"></script>

   NÃO use type="module" aqui — precisa rodar
   antes de qualquer módulo ES para garantir
   que o SW esteja ativo o quanto antes.
   ============================================= */

(function () {
  'use strict';

  // Service Workers só funcionam em HTTPS ou localhost
  if (!('serviceWorker' in navigator)) {
    console.info('[PWA] Service Worker não suportado neste browser.');
    return;
  }

  // ── Detecta base do projeto (funciona em localhost E GitHub Pages) ──
  // Ex: localhost → base = '/'
  // Ex: usuario.github.io/nexus-study/ → base = '/nexus-study/'
  const base = location.pathname.replace(/\/[^/]*$/, '/');

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(base + 'sw.js', { scope: base })
      .then(registration => {

        console.info('[PWA] Service Worker registrado:', registration.scope);

        // ── Detecta atualização disponível ───────────────────
        registration.addEventListener('updatefound', () => {
          const novoSW = registration.installing;
          if (!novoSW) return;

          novoSW.addEventListener('statechange', () => {
            if (
              novoSW.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              _mostrarAvisoAtualizacao();
            }
          });
        });

      })
      .catch(err => {
        console.error('[PWA] Falha ao registrar Service Worker:', err);
      });

    // ── Recarrega após o SW assumir controle ──────────────────
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (document.visibilityState === 'hidden') return;
      window.location.reload();
    });
  });


  /* ── Aviso de atualização ──────────────────────────────────── */
  function _mostrarAvisoAtualizacao() {
    if (document.getElementById('pwa-update-toast')) return;

    const toast = document.createElement('div');
    toast.id = 'pwa-update-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(20, 20, 30, 0.95);
      border: 1px solid rgba(255,255,255,0.12);
      color: #e8e8f0;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 14px;
      font-family: inherit;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 99999;
      box-shadow: 0 4px 24px rgba(0,0,0,0.4);
      backdrop-filter: blur(12px);
      cursor: default;
      white-space: nowrap;
    `;
    toast.innerHTML = `
      <span>✨ Novo conteúdo disponível</span>
      <button style="
        background: rgba(120,100,255,0.25);
        border: 1px solid rgba(120,100,255,0.4);
        color: #c4b5fd;
        padding: 4px 12px;
        border-radius: 8px;
        font-size: 13px;
        cursor: pointer;
        font-family: inherit;
      " id="pwa-update-btn">Atualizar</button>
    `;

    document.body.appendChild(toast);

    document.getElementById('pwa-update-btn')?.addEventListener('click', () => {
      toast.remove();
      window.location.reload();
    });

    setTimeout(() => toast.remove(), 15_000);
  }

})();