/**
 * Quick Access Bar — quick-access.js
 * ============================================================
 * Cria e controla a barra de acesso rápido sem modificar o HTML.
 *
 * NAVEGAÇÃO — Por que detectar o BASE_PATH automaticamente?
 * --------------------------------------------------
 * No GitHub Pages, quando o site não está na raiz do domínio
 * (ex: https://usuario.github.io/NOME-DO-REPO/), um caminho
 * absoluto começando com "/" (ex: "/index.html") aponta para
 * "https://usuario.github.io/index.html" — fora do repositório,
 * causando 404.
 *
 * A detecção primária usa a URL RESOLVIDA do próprio
 * <script src="...">: o navegador sempre entrega essa URL em
 * forma absoluta, então cortamos exatamente antes do sufixo
 * conhecido do arquivo (/shared/js/utils/quick-access.js).
 * Isso funciona em QUALQUER pasta do projeto — incluindo pastas
 * criadas no futuro — sem precisar manter uma lista de pastas
 * conhecidas. Um fallback por pastas conhecidas é mantido só
 * para o caso raro do script ser movido/inlinado.
 *
 * Em localhost (servidor na raiz), BASE_PATH fica "" e tudo
 * continua funcionando como antes.
 *
 * ÍCONES — SVG outline (stroke, sem fill), no mesmo estilo já
 * usado no restante do site (sidebar do dashboard, admin etc.),
 * em vez de emoji — evita inconsistência visual entre sistemas
 * operacionais/fontes e dá acabamento mais profissional.
 *
 * Ativação  : tecla Tab (quando não está digitando em input/textarea)
 * Fechar    : ESC · clique fora · tecla Tab novamente
 * ============================================================
 */

(function () {
  'use strict';

  /* ── Proteção contra múltiplas instâncias ─────────────────── */
  if (window.__qaBarInitialized) return;
  window.__qaBarInitialized = true;

  /* ── BASE_PATH ─────────────────────────────────────────────
     Ver comentário no topo do arquivo. */
  function detectBasePath() {
    const scriptEl = document.currentScript
                   || document.querySelector('script[src*="quick-access.js"]');
    const MARKER = '/shared/js/utils/quick-access.js';

    if (scriptEl && scriptEl.src) {
      try {
        const scriptPath = new URL(scriptEl.src).pathname;
        const idx = scriptPath.indexOf(MARKER);
        if (idx !== -1) return scriptPath.slice(0, idx);
      } catch (_) { /* URL inválida — cai no fallback abaixo */ }
    }

    /* ── Fallback — lógica por pastas conhecidas (só usado se o
       script for movido/inlinado no futuro) ── */
    const path = window.location.pathname;
    const KNOWN_FOLDERS = ['resumo', 'quiz', 'games', 'pessoal', 'dashboard', 'admin'];

    for (const folder of KNOWN_FOLDERS) {
      const marker = `/${folder}/`;
      const idx = path.indexOf(marker);
      if (idx !== -1) return path.slice(0, idx);
    }

    const segments = path.split('/').filter(Boolean);
    if (segments.length && segments[segments.length - 1].includes('.')) {
      segments.pop();
    }
    return segments.length ? `/${segments.join('/')}` : '';
  }

  const BASE_PATH = detectBasePath();

  /**
   * BASE_URL: raiz absoluta do projeto (origin + BASE_PATH).
   * Funciona tanto em servidor local quanto em produção / subpasta.
   */
  const BASE_URL = window.location.origin + BASE_PATH;

  /* ── Ícones SVG (outline, stroke=currentColor, 20×20) ───────
     Mesmo estilo visual já usado na sidebar do dashboard e no
     admin: sem fill, stroke-width 1.6, cantos arredondados. */
  const QA_ICONS = {
    home: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L10 3l7 6.5"/><path d="M4.5 8.5V16a1 1 0 001 1H8v-4.5a1 1 0 011-1h2a1 1 0 011 1V17h2.5a1 1 0 001-1V8.5"/></svg>`,

    resumos: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 5.2C8.8 4.2 6.9 3.6 4.7 3.6c-.4 0-.7.3-.7.7v9.4c0 .4.3.7.7.7 2.2 0 4.1.6 5.3 1.6"/><path d="M10 5.2c1.2-1 3.1-1.6 5.3-1.6.4 0 .7.3.7.7v9.4c0 .4-.3.7-.7.7-2.2 0-4.1.6-5.3 1.6"/><path d="M10 5.2V16"/></svg>`,

    quiz: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7"/><path d="M7.6 8c.2-1.1 1.1-1.9 2.4-1.9 1.2 0 2.2.8 2.2 1.9 0 1.3-1.9 1.6-1.9 3.1"/><circle cx="10" cy="13.6" r=".15" fill="currentColor" stroke="currentColor" stroke-width="1.1"/></svg>`,

    jogos: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.2" y="6.5" width="15.6" height="8.4" rx="4"/><path d="M6.4 9.4v2.6M5.1 10.7h2.6"/><circle cx="13" cy="9.6" r=".9" fill="currentColor" stroke="none"/><circle cx="15.2" cy="11.8" r=".9" fill="currentColor" stroke="none"/></svg>`,

    /* Bússola — remete a "atlas" (mapa/referência) sem repetir o
       ícone de livro já usado em Resumos. */
    atlas: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7.3"/><path d="M12.6 7.4l-1.4 3.8-3.8 1.4 1.4-3.8z"/></svg>`,

    pessoal: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="6.8" r="3.2"/><path d="M3.6 16.8c.7-3 3.2-5 6.4-5s5.7 2 6.4 5"/></svg>`,
  };

  /* ── Cor de identidade de cada botão ─────────────────────────
     Mesma paleta já usada nos cards do dashboard (ic-purple,
     ic-green, ic-amber, ic-blue, etc.). Cada item define hex (para
     texto/ícone) e a versão "r,g,b" (para usar em rgba() no fundo/
     glow do hover e do estado ativo). Aplicado via CSS custom
     properties inline no próprio botão — ver createBar(). */
  const QA_COLORS = {
    home:    { hex: '#6C63FF', rgb: '108,99,255' }, // roxo
    resumos: { hex: '#4FA8E8', rgb: '79,168,232'  }, // azul
    quiz:    { hex: '#3DDC84', rgb: '61,220,132'  }, // verde
    jogos:   { hex: '#FFB547', rgb: '255,181,71'  }, // âmbar
    atlas:   { hex: '#4DD9B4', rgb: '77,217,180'  }, // teal
    pessoal: { hex: '#FF6B9D', rgb: '255,107,157' }, // rosa
  };

  const QA_ITEMS = [
    {
      id:    'home',
      icon:  QA_ICONS.home,
      label: 'Home',
      title: 'Página inicial',
      href:  `${BASE_URL}/index.html`,
      match: /^\/?(?:[^/]*\/)?index\.html$|\/$/,
    },
    {
      id:    'resumos',
      icon:  QA_ICONS.resumos,
      label: 'Resumos',
      title: 'Resumos',
      href:  `${BASE_URL}/resumo/resumo.html`,
      match: /\/resumo\//,
    },
    {
      id:    'quiz',
      icon:  QA_ICONS.quiz,
      label: 'Quiz',
      title: 'Quiz',
      href:  `${BASE_URL}/quiz/quiz.html`,
      match: /\/quiz\//,
    },
    // {
    //   id:    'jogos',
    //   icon:  QA_ICONS.jogos,
    //   label: 'Jogos',
    //   title: 'Jogos',
    //   href:  `${BASE_URL}/games/jogo.html`,
    //   match: /\/games\//,
    // },
    {
      id:    'atlas',
      icon:  QA_ICONS.atlas,
      label: 'Atlas',
      title: 'Atlas — biblioteca de conteúdos',
      href:  `${BASE_URL}/atlas/atlas.html`,
      match: /\/atlas\//,
    },
    {
      id:    'pessoal',
      icon:  QA_ICONS.pessoal,
      label: 'Pessoal',
      title: 'Pessoal',
      href:  `${BASE_URL}/dashboard/dashboard.html`,
      match: /\/dashboard\//,
    },
  ];

  /* ── Estado interno ───────────────────────────────────────── */
  const state = {
    isOpen: false,
  };

  /* ── Elementos DOM ───────────────────────────────────────────
     Criados dinamicamente; o HTML das páginas fica intocado.     */
  let overlay, bar;

  /* ============================================================
     BUILD — Cria todos os elementos e injeta no body
     ============================================================ */
  function build() {
    injectCSS();
    overlay = createOverlay();
    bar     = createBar();

    document.body.appendChild(overlay);
    document.body.appendChild(bar);

    bindEvents();
  }

  /* ── Injeta o <link> do CSS automaticamente ─────────────────
     Detecta o path do script para derivar o do CSS.             */
  function injectCSS() {
    if (document.getElementById('qa-styles')) return; // já injetado

    const scriptEl  = document.currentScript
                   || document.querySelector('script[src*="quick-access"]');
    let cssHref = `${BASE_URL}/shared/css/utils/quick-access.css`;

    /* Fallback: tenta derivar do path do próprio script */
    if (scriptEl && scriptEl.src) {
      cssHref = scriptEl.src
        .replace(/\/js\//, '/css/')
        .replace(/\.js$/, '.css');
    }

    const link  = document.createElement('link');
    link.id     = 'qa-styles';
    link.rel    = 'stylesheet';
    link.href   = cssHref;
    document.head.appendChild(link);
  }

  /* ── Cria o overlay de fundo (detecta clique fora) ─────────── */
  function createOverlay() {
    const el = document.createElement('div');
    el.id = 'qa-overlay';
    el.setAttribute('aria-hidden', 'true');
    el.addEventListener('click', close);
    return el;
  }

  /* ── Cria a barra e os botões ───────────────────────────────── */
  function createBar() {
    const el = document.createElement('nav');
    el.id = 'qa-bar';
    el.setAttribute('role', 'navigation');
    el.setAttribute('aria-label', 'Acesso rápido');

    const currentPath = window.location.pathname;

    QA_ITEMS.forEach((item, index) => {
      /* Separador antes do primeiro botão não; entre os demais sim */
      if (index > 0) {
        const sep = document.createElement('div');
        sep.className = 'qa-separator';
        sep.setAttribute('aria-hidden', 'true');
        el.appendChild(sep);
      }

      const btn = document.createElement('a');
      btn.href       = item.href;
      btn.className  = 'qa-btn';
      btn.id         = `qa-btn-${item.id}`;
      btn.setAttribute('data-label', item.title);
      btn.setAttribute('aria-label', item.title);
      btn.setAttribute('tabindex', '-1'); // acessível só quando aberto

      /* Cor de identidade do botão (ver QA_COLORS) — lida pelo CSS
         via var(--qa-item-color) / var(--qa-item-rgb). */
      const cor = QA_COLORS[item.id];
      if (cor) {
        btn.style.setProperty('--qa-item-color', cor.hex);
        btn.style.setProperty('--qa-item-rgb', cor.rgb);
      }

      /* Marca o botão da página atual */
      if (item.match.test(currentPath)) {
        btn.classList.add('qa-active');
        btn.setAttribute('aria-current', 'page');
      }

      /* Ícone (SVG inline) */
      const icon = document.createElement('span');
      icon.className       = 'qa-icon';
      icon.innerHTML        = item.icon;
      icon.setAttribute('aria-hidden', 'true');

      /* Label */
      const label = document.createElement('span');
      label.className  = 'qa-label';
      label.textContent = item.label;

      btn.appendChild(icon);
      btn.appendChild(label);
      el.appendChild(btn);

      /* Navega sem fechar com animação incompleta */
      btn.addEventListener('click', (e) => {
        /* Permite abrir em nova aba normalmente */
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;

        e.preventDefault();
        close();

        /* Aguarda saída antes de navegar */
        setTimeout(() => {
          window.location.href = item.href;
        }, 280);
      });
    });

    return el;
  }

  /* ============================================================
     CONTROLE — Abrir / fechar / toggle
     ============================================================ */
  function open() {
    if (state.isOpen) return;
    state.isOpen = true;

    overlay.classList.add('qa-visible');
    bar.classList.add('qa-open');

    /* Torna os botões focáveis */
    bar.querySelectorAll('.qa-btn').forEach(btn => {
      btn.setAttribute('tabindex', '0');
    });

    /* Foca o primeiro botão para acessibilidade */
    const firstBtn = bar.querySelector('.qa-btn');
    if (firstBtn) {
      setTimeout(() => firstBtn.focus(), 80);
    }

    document.dispatchEvent(new CustomEvent('qa:open'));
  }

  function close() {
    if (!state.isOpen) return;
    state.isOpen = false;

    overlay.classList.remove('qa-visible');
    bar.classList.remove('qa-open');

    /* Remove foco dos botões */
    bar.querySelectorAll('.qa-btn').forEach(btn => {
      btn.setAttribute('tabindex', '-1');
      btn.blur();
    });

    document.dispatchEvent(new CustomEvent('qa:close'));
  }

  function toggle() {
    state.isOpen ? close() : open();
  }

  /* ============================================================
     EVENTOS
     ============================================================ */
  function bindEvents() {
    /* Teclado global */
    document.addEventListener('keydown', onKeyDown);

    /* Navegação por teclado dentro da barra */
    bar.addEventListener('keydown', onBarKeyDown);
  }

  function onKeyDown(e) {
    /* ESC — fecha */
    if (e.key === 'Escape') {
      if (state.isOpen) close();
      return;
    }

    /* Tab — toggle (ignora quando digitando) */
    if (e.key === 'Tab') {
      if (isTyping()) return;
      e.preventDefault();
      toggle();
    }
  }

  /* Navegação horizontal na barra com ← → e wrap */
  function onBarKeyDown(e) {
    const btns = Array.from(bar.querySelectorAll('.qa-btn'));
    const focused = document.activeElement;
    const idx = btns.indexOf(focused);

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const dir   = e.key === 'ArrowRight' ? 1 : -1;
      const next  = (idx + dir + btns.length) % btns.length;
      btns[next].focus();
    }

    if (e.key === 'Home') { e.preventDefault(); btns[0].focus(); }
    if (e.key === 'End')  { e.preventDefault(); btns[btns.length - 1].focus(); }
  }

  /* ── Detecta se o usuário está digitando ─────────────────────
     Não ativa o atalho em inputs, textareas ou contenteditable. */
  function isTyping() {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
    if (document.activeElement?.isContentEditable) return true;
    return false;
  }

  /* ============================================================
     INICIALIZAÇÃO — aguarda o DOM estar pronto
     ============================================================ */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', build);
    } else {
      build();
    }
  }

  /* ── API pública (opcional) ─────────────────────────────────── */
  window.QuickAccessBar = { open, close, toggle };

  /* Inicia */
  init();

})();