/* =============================================
   NEXUS STUDY — sw.js
   Service Worker — Cache Offline Completo

   COMO ATUALIZAR O CACHE:
   Quando adicionar novo conteúdo (resumos, questões,
   imagens), mude o número da versão abaixo e faça
   push pro GitHub. O SW vai baixar tudo de novo.
   ============================================= */

const CACHE_VERSION = 'nexus-v2';

/* ─────────────────────────────────────────────
   BASE DO PROJETO
   Em localhost → ''
   Em GitHub Pages → '/nome-do-repo'
   O SW detecta automaticamente pelo seu próprio URL.
───────────────────────────────────────────── */
const BASE = self.location.pathname.replace(/\/sw\.js$/, '');

/* ─────────────────────────────────────────────
   ASSETS ESTÁTICOS
   Tudo que precisa funcionar offline.
───────────────────────────────────────────── */

const ASSETS_CORE = [
  // Raiz
  BASE + '/',
  BASE + '/index.html',
  BASE + '/index.js',
  BASE + '/style.css',
  BASE + '/manifest.json',

  // Shared — CSS
  BASE + '/shared/css/themes/fundo.css',
  BASE + '/shared/css/themes/logo.css',
  BASE + '/shared/css/audio/sound.css',
  BASE + '/shared/css/audio/audio-btns.css',
  BASE + '/shared/css/audio/vol-slider.css',
  BASE + '/shared/css/ia/ia.css',

  // Shared — JS utilitários
  BASE + '/shared/js/utils/logo.js',
  BASE + '/shared/js/utils/session-tracker.js',
  BASE + '/shared/js/utils/dom.js',
  BASE + '/shared/js/office/pwa.js',

  // Shared — JS áudio
  BASE + '/shared/js/audio/audio-api.js',

  // Shared — JS IA
  BASE + '/shared/js/ia/ia-ui.js',
  BASE + '/shared/js/ia/ia-search.js',
  BASE + '/shared/js/ia/ia-loader.js',
  BASE + '/shared/js/ia/ia-worker.js',
  BASE + '/shared/js/ia/ia.js',

  // Src (módulos internos)
  BASE + '/src/global.js',
  BASE + '/src/firebase.js',
];

const ASSETS_RESUMO = [
  BASE + '/resumo/resumo.html',
  // BASE + '/resumo/resumo.js',
  // BASE + '/resumo/resumo.css',
];

const ASSETS_QUIZ = [
  BASE + '/quiz/quiz.html',
  // BASE + '/quiz/quiz.js',
  // BASE + '/quiz/quiz.css',
];

const ASSETS_GAMES = [
  BASE + '/games/jogo.html',
  // BASE + '/games/jogo.js',
  // BASE + '/games/jogo.css',
];

const ASSETS_PESSOAL = [
  BASE + '/pessoal/pessoal.html',
  // BASE + '/pessoal/pessoal.js',
  // BASE + '/pessoal/pessoal.css',
];

const ASSETS_ADMIN = [
  BASE + '/admin/admin.html',
  // BASE + '/admin/admin.js',
  // BASE + '/admin/admin.css',
];

const ASSETS_IMAGENS = [
  // Adicione as imagens aqui conforme o projeto crescer
  // BASE + '/content/resumo/...',
];

const TODOS_ASSETS = [
  ...ASSETS_CORE,
  ...ASSETS_RESUMO,
  ...ASSETS_QUIZ,
  ...ASSETS_GAMES,
  ...ASSETS_PESSOAL,
  ...ASSETS_ADMIN,
  ...ASSETS_IMAGENS,
];

/* ─────────────────────────────────────────────
   DOMÍNIOS EXTERNOS — sempre network (nunca cache)
───────────────────────────────────────────── */
const NETWORK_ONLY_ORIGINS = [
  'https://firestore.googleapis.com',
  'https://firebase.googleapis.com',
  'https://identitytoolkit.googleapis.com',
  'https://api.anthropic.com',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
];


/* ═══════════════════════════════════════════════
   INSTALL
═══════════════════════════════════════════════ */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      const promises = TODOS_ASSETS.map(url =>
        cache.add(url).catch(err =>
          console.warn(`[SW] Falha ao cachear: ${url}`, err)
        )
      );
      return Promise.all(promises);
    })
    .then(() => self.skipWaiting())
  );
});


/* ═══════════════════════════════════════════════
   ACTIVATE
═══════════════════════════════════════════════ */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION)
          .map(key => {
            console.log(`[SW] Removendo cache antigo: ${key}`);
            return caches.delete(key);
          })
      )
    )
    .then(() => self.clients.claim())
  );
});


/* ═══════════════════════════════════════════════
   FETCH
═══════════════════════════════════════════════ */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) return;
  if (request.method !== 'GET') return;

  // ── Network Only para serviços externos ──────────────
  const isExternal = NETWORK_ONLY_ORIGINS.some(origin =>
    request.url.startsWith(origin)
  );
  if (isExternal) {
    event.respondWith(
      fetch(request).catch(() => new Response('', { status: 503 }))
    );
    return;
  }

  // ── Cache First + cache on demand para imagens ───────
  if (url.pathname.startsWith(BASE + '/content/resumo/') &&
      /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(request, clone));
          }
          return response;
        }).catch(() => new Response('', { status: 404 }));
      })
    );
    return;
  }

  // ── Cache First para todo o resto ────────────────────
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match(BASE + '/index.html');
        }
        return new Response('', { status: 503 });
      });
    })
  );
});