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
 * Para resolver isso sem precisar editar o código a cada deploy,
 * detectamos o "prefixo base" da página atual a partir do
 * pathname, olhando para as pastas conhecidas do projeto
 * (resumo, quiz, games, pessoal). Tudo o que vem ANTES dessas
 * pastas (ou antes de index.html na raiz) é o BASE_PATH.
 *
 * Em localhost (servidor na raiz), BASE_PATH fica "" e tudo
 * continua funcionando como antes.
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

  /* ── Configuração dos botões ──────────────────────────────── */

  /**
   * BASE_PATH: prefixo do projeto dentro do domínio.
   * Ex.: em "https://rafaelpg1.github.io/nexus-study/resumo/resumo.html"
   *      BASE_PATH = "/nexus-study"
   * Em "http://localhost:5500/index.html"
   *      BASE_PATH = ""
   */
  const KNOWN_FOLDERS = ['resumo', 'quiz', 'games', 'pessoal'];

  function detectBasePath() {
    const path = window.location.pathname; // ex: /nexus-study/resumo/resumo.html

    for (const folder of KNOWN_FOLDERS) {
      const marker = `/${folder}/`;
      const idx = path.indexOf(marker);
      if (idx !== -1) {
        return path.slice(0, idx); // tudo antes de "/resumo/" etc.
      }
    }

    // Está na raiz (index.html ou "/"): remove o nome do arquivo final
    const lastSlash = path.lastIndexOf('/');
    const dir = path.slice(0, lastSlash); // ex: "/nexus-study" ou ""

    return dir;
  }

  const BASE_PATH = detectBasePath();

  /**
   * BASE_URL: raiz absoluta do projeto (origin + BASE_PATH).
   * Funciona tanto em servidor local quanto em produção / subpasta.
   */
  const BASE_URL = window.location.origin + BASE_PATH;

  const QA_ITEMS = [
    {
      id:    'home',
      icon:  '🏠',
      label: 'Home',
      title: 'Página inicial',
      href:  `${BASE_URL}/index.html`,
      match: /^\/?(?:[^/]*\/)?index\.html$|\/$/,
    },
    {
      id:    'resumos',
      icon:  '📚',
      label: 'Resumos',
      title: 'Resumos',
      href:  `${BASE_URL}/resumo/resumo.html`,
      match: /\/resumo\//,
    },
    {
      id:    'quiz',
      icon:  '📝',
      label: 'Quiz',
      title: 'Quiz',
      href:  `${BASE_URL}/quiz/quiz.html`,
      match: /\/quiz\//,
    },
    {
      id:    'jogos',
      icon:  '🎮',
      label: 'Jogos',
      title: 'Jogos',
      href:  `${BASE_URL}/games/jogos.html`,
      match: /\/games\//,
    },
    {
      id:    'pessoal',
      icon:  '👤',
      label: 'Pessoal',
      title: 'Pessoal',
      href:  `${BASE_URL}/pessoal/pessoal.html`,
      match: /\/pessoal\//,
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

      /* Marca o botão da página atual */
      if (item.match.test(currentPath)) {
        btn.classList.add('qa-active');
        btn.setAttribute('aria-current', 'page');
      }

      /* Ícone */
      const icon = document.createElement('span');
      icon.className       = 'qa-icon';
      icon.textContent     = item.icon;
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