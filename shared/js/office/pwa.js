/* =============================================
   NEXUS STUDY — shared/js/office/pwa.js
   Registro do Service Worker + Indicador Offline

   Como usar: adicione em cada página HTML,
   logo antes de </body>:

     <script src="/shared/js/office/pwa.js"></script>

   NÃO use type="module" aqui — precisa rodar
   antes de qualquer módulo ES para garantir
   que o SW esteja ativo o quanto antes.
   ============================================= */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════
     PARTE 1 — INDICADOR DE CONEXÃO
     Funciona independente do SW.
     Aparece quando offline, some quando online.
  ══════════════════════════════════════════════ */

  const OFFLINE_CSS = `
    #nexus-offline-bar {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(80px);
      z-index: 99998;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 18px 10px 14px;
      background: rgba(12, 12, 20, 0.96);
      border: 1px solid rgba(255, 80, 80, 0.25);
      border-radius: 14px;
      box-shadow:
        0 0 0 1px rgba(255,80,80,0.08),
        0 8px 32px rgba(0,0,0,0.5),
        0 0 20px rgba(255,60,60,0.08);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      font-family: inherit;
      font-size: 13.5px;
      color: #f0d0d0;
      letter-spacing: 0.01em;
      white-space: nowrap;
      opacity: 0;
      transition:
        transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
        opacity 0.3s ease;
      pointer-events: none;
      user-select: none;
    }

    #nexus-offline-bar.nexus-offline--show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    /* Ícone de sinal cortado */
    .nexus-offline-icon {
      position: relative;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .nexus-offline-icon svg {
      display: block;
    }

    /* Pulso vermelho ao redor do ícone */
    .nexus-offline-pulse {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: rgba(255, 60, 60, 0.15);
      animation: nexus-pulse 2s ease-in-out infinite;
    }

    @keyframes nexus-pulse {
      0%, 100% { transform: scale(1);   opacity: 0.6; }
      50%       { transform: scale(1.5); opacity: 0;   }
    }

    /* Ponto de status animado */
    .nexus-offline-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ff4d4d;
      flex-shrink: 0;
      animation: nexus-blink 1.4s ease-in-out infinite;
    }

    @keyframes nexus-blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.2; }
    }

    /* Texto */
    .nexus-offline-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .nexus-offline-text strong {
      font-size: 13px;
      font-weight: 600;
      color: #ffb0b0;
    }

    .nexus-offline-text span {
      font-size: 11px;
      color: rgba(240, 208, 208, 0.55);
      font-weight: 400;
    }

    /* ── Variante: voltou online ── */
    #nexus-online-toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(80px);
      z-index: 99998;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: rgba(12, 20, 15, 0.96);
      border: 1px solid rgba(60, 210, 120, 0.25);
      border-radius: 14px;
      box-shadow:
        0 0 0 1px rgba(60,210,120,0.08),
        0 8px 32px rgba(0,0,0,0.5),
        0 0 20px rgba(40,180,90,0.08);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      font-family: inherit;
      font-size: 13px;
      color: #b0f0c8;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition:
        transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
        opacity 0.3s ease;
    }

    #nexus-online-toast.nexus-online--show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    .nexus-online-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #3dd68c;
      box-shadow: 0 0 6px #3dd68c;
      flex-shrink: 0;
    }

    /* Mobile: posiciona acima de botões flutuantes */
    @media (max-width: 600px) {
      #nexus-offline-bar,
      #nexus-online-toast {
        bottom: 80px;
        font-size: 12.5px;
      }
    }
  `;

  /* ── Injeta CSS ── */
  function _injetarCSS() {
    if (document.getElementById('nexus-offline-style')) return;
    const style = document.createElement('style');
    style.id = 'nexus-offline-style';
    style.textContent = OFFLINE_CSS;
    document.head.appendChild(style);
  }

  /* ── Cria barra offline ── */
  function _criarBarraOffline() {
    if (document.getElementById('nexus-offline-bar')) return;

    const bar = document.createElement('div');
    bar.id = 'nexus-offline-bar';
    bar.setAttribute('role', 'status');
    bar.setAttribute('aria-live', 'polite');
    bar.innerHTML = `
      <div class="nexus-offline-icon">
        <div class="nexus-offline-pulse"></div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="#ff6b6b" stroke-width="1.8"
             stroke-linecap="round" stroke-linejoin="round">
          <!-- Ondas de Wi-Fi cortadas -->
          <line x1="1" y1="1" x2="23" y2="23" stroke="#ff4d4d" stroke-width="2"/>
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9"/>
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
          <circle cx="12" cy="20" r="1" fill="#ff6b6b"/>
        </svg>
      </div>
      <div class="nexus-offline-dot"></div>
      <div class="nexus-offline-text">
        <strong>Sem conexão</strong>
        <span>Conteúdo offline disponível</span>
      </div>
    `;
    document.body.appendChild(bar);
  }

  /* ── Cria toast de volta online ── */
  function _criarToastOnline() {
    if (document.getElementById('nexus-online-toast')) return;

    const toast = document.createElement('div');
    toast.id = 'nexus-online-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <div class="nexus-online-dot"></div>
      Conexão restaurada
    `;
    document.body.appendChild(toast);
  }

  /* ── Mostra barra offline ── */
  function _mostrarOffline() {
    _criarBarraOffline();
    requestAnimationFrame(() => {
      document.getElementById('nexus-offline-bar')
        ?.classList.add('nexus-offline--show');
    });
  }

  /* ── Esconde barra offline e mostra toast de online ── */
  function _mostrarOnline() {
    const bar = document.getElementById('nexus-offline-bar');
    if (bar) bar.classList.remove('nexus-offline--show');

    // Só mostra "voltou" se estava offline antes
    _criarToastOnline();
    const toast = document.getElementById('nexus-online-toast');
    if (!toast) return;

    requestAnimationFrame(() => toast.classList.add('nexus-online--show'));

    setTimeout(() => {
      toast.classList.remove('nexus-online--show');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 3000);
  }

  /* ── Inicializa listeners de conexão ── */
  function _iniciarMonitorConexao() {
    _injetarCSS();

    // Estado inicial
    if (!navigator.onLine) {
      _mostrarOffline();
    }

    window.addEventListener('offline', _mostrarOffline);
    window.addEventListener('online',  _mostrarOnline);
  }

  // Roda assim que possível (não espera o load)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _iniciarMonitorConexao);
  } else {
    _iniciarMonitorConexao();
  }


  /* ══════════════════════════════════════════════
     PARTE 2 — SERVICE WORKER
  ══════════════════════════════════════════════ */

  if (!('serviceWorker' in navigator)) {
    console.info('[PWA] Service Worker não suportado neste browser.');
    return;
  }

  // ── Detecta base do projeto ───────────────────────────────────
  // O pwa.js sempre fica em: <root>/shared/js/office/pwa.js
  // Então a raiz do projeto é exatamente 3 níveis acima do script.
  // Funciona em localhost, GitHub Pages e qualquer subpasta.
  const _scriptSrc = document.currentScript?.src || '';
  const base = _scriptSrc
    ? new URL('../../../', _scriptSrc).pathname
    : location.pathname.replace(/\/[^/]*$/, '/'); // fallback

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