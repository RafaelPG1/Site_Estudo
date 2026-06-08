/* =============================================
   NEXUS STUDY — sw.js
   Service Worker — Cache Offline Completo

   COMO ATUALIZAR O CACHE:
   Quando adicionar novo conteúdo (resumos, questões,
   imagens), mude o número da versão abaixo e faça
   push pro GitHub. O SW vai baixar tudo de novo.
   ============================================= */

const CACHE_VERSION = 'nexus-v1';

/* ─────────────────────────────────────────────
   ASSETS ESTÁTICOS
   Tudo que precisa funcionar offline.
   Organize por seção para facilitar manutenção.
───────────────────────────────────────────── */

const ASSETS_CORE = [
  // Raiz
  '/',
  '/index.html',
  '/index.js',
  '/style.css',
  '/manifest.json',

  // Shared — CSS
  '/shared/css/themes/fundo.css',
  '/shared/css/themes/logo.css',
  '/shared/css/audio/sound.css',
  '/shared/css/audio/audio-btns.css',
  '/shared/css/audio/vol-slider.css',
  '/shared/css/ia/ia.css',

  // Shared — JS utilitários
  '/shared/js/utils/logo.js',
  '/shared/js/utils/session-tracker.js',
  '/shared/js/utils/dom.js',
  '/shared/js/office/pwa.js',

  // Shared — JS áudio
  '/shared/js/audio/audio-api.js',

  // Shared — JS IA
  '/shared/js/ia/ia-ui.js',
  '/shared/js/ia/ia-search.js',
  '/shared/js/ia/ia-loader.js',
  '/shared/js/ia/ia-worker.js',
  '/shared/js/ia/ia.js',

  // Src (módulos internos)
  '/src/global.js',
  '/src/firebase.js',
];

const ASSETS_RESUMO = [
  '/resumo/resumo.html',
  // ↓ Adicione aqui os JS/CSS da seção Resumo
  // '/resumo/resumo.js',
  // '/resumo/resumo.css',
];

const ASSETS_QUIZ = [
  '/quiz/quiz.html',
  // '/quiz/quiz.js',
  // '/quiz/quiz.css',
];

const ASSETS_GAMES = [
  '/games/jogo.html',
  // '/games/jogo.js',
  // '/games/jogo.css',
];

const ASSETS_PESSOAL = [
  '/pessoal/pessoal.html',
  // '/pessoal/pessoal.js',
  // '/pessoal/pessoal.css',
];

const ASSETS_ADMIN = [
  '/admin/admin.html',
  // '/admin/admin.js',
  // '/admin/admin.css',
];

/* ─────────────────────────────────────────────
   IMAGENS DOS RESUMOS
   Liste aqui as imagens em /content/resumo/
   Exemplo: '/content/resumo/1ano/1sem/ap1/image/fig1.png'

   DICA: Se forem muitas imagens (~200+), você pode
   cachear só quando o usuário abre o resumo.
   Veja a estratégia "cache on demand" no final.
───────────────────────────────────────────── */
const ASSETS_IMAGENS = [
  // Adicione as imagens aqui conforme o projeto crescer
  // '/content/resumo/...',
];

/* ─────────────────────────────────────────────
   LISTA FINAL — todos os assets juntos
───────────────────────────────────────────── */
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
   Firebase, Anthropic e Google Fonts precisam
   de internet; se offline, falham silenciosamente.
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
   INSTALL — baixa e cacheia todos os assets
═══════════════════════════════════════════════ */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      // Cacheia em lotes para não travar em erros individuais
      const promises = TODOS_ASSETS.map(url =>
        cache.add(url).catch(err =>
          console.warn(`[SW] Falha ao cachear: ${url}`, err)
        )
      );
      return Promise.all(promises);
    })
    .then(() => self.skipWaiting()) // Ativa imediatamente sem esperar tab fechar
  );
});


/* ═══════════════════════════════════════════════
   ACTIVATE — remove caches de versões antigas
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
    .then(() => self.clients.claim()) // Assume controle de todas as tabs abertas
  );
});


/* ═══════════════════════════════════════════════
   FETCH — estratégia por tipo de recurso

   ┌─────────────────────────────────────────┐
   │  Externo (Firebase/Anthropic/Fonts)     │
   │  → Network Only (sem cache)             │
   ├─────────────────────────────────────────┤
   │  Imagens dos resumos (/content/resumo/) │
   │  → Cache First + cache on demand        │
   ├─────────────────────────────────────────┤
   │  Todo o resto (HTML, JS, CSS)           │
   │  → Cache First (rápido + offline)       │
   └─────────────────────────────────────────┘
═══════════════════════════════════════════════ */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) return;
  // Ignora requisições não-GET (POST do Firebase, etc.)
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
  if (url.pathname.startsWith('/content/resumo/') &&
      /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        // Não está no cache → busca na rede E guarda para próxima vez
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
      // Não está no cache → tenta a rede (primeira visita ou arquivo novo)
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        // Offline e sem cache → retorna página offline genérica se for HTML
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
        return new Response('', { status: 503 });
      });
    })
  );
});