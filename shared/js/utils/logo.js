/* ============================================================
   NEXUS STUDY — shared/js/utils/logo.js  (v2.2)
   ============================================================ */

import { playSound as _playSound } from '../audio/audio-api.js';
import { getAreaFromPath } from './zoom.js';
export { getAreaFromPath };

/* ── Caminho da imagem resolvido uma vez, relativo ao logo.js ── */
const _LOGO_SRC = new URL('../../img/logo.png', import.meta.url).href;

/* ── Favicon: aparece em toda página que carrega o logo.js ──────
   Usa os arquivos de shared/img/favicon_io, com caminho relativo ao logo.js
   (funciona em localhost e no GitHub Pages, mesmo dentro de subpasta). */
const _FAV = (arq) => new URL('../../img/favicon_io/' + arq, import.meta.url).href;

function _injetarFavicons() {
  if (typeof document === 'undefined' || !document.head) return;
  if (document.head.querySelector('link[data-nexus-fav]')) return;

  document.head
    .querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')
    .forEach((l) => l.remove());

  [
    { rel: 'icon',             href: _FAV('favicon.ico'), sizes: 'any' },
    { rel: 'icon',             href: _FAV('favicon-32x32.png'), type: 'image/png', sizes: '32x32' },
    { rel: 'icon',             href: _FAV('favicon-16x16.png'), type: 'image/png', sizes: '16x16' },
    { rel: 'apple-touch-icon', href: _FAV('apple-touch-icon.png'), sizes: '180x180' },
    { rel: 'manifest',         href: _FAV('site.webmanifest') },
  ].forEach((attrs) => {
    const link = document.createElement('link');
    Object.entries(attrs).forEach(([k, v]) => link.setAttribute(k, v));
    link.setAttribute('data-nexus-fav', '');
    document.head.appendChild(link);
  });
}
_injetarFavicons();

/* ── Raiz do projeto calculada a partir do logo.js ─────────────
   logo.js sempre está em: <raiz>/shared/js/utils/logo.js
   Então a raiz é tudo antes de '/shared/'.
   Isso é independente da página que chamou injetarLogo().
   ─────────────────────────────────────────────────────────── */
function _hrefRaiz() {
  const url    = new URL(import.meta.url);
  const partes = url.pathname.split('/').filter(Boolean);
  const idx    = partes.indexOf('shared');

  if (idx <= 0) return '/index.html'; // localhost ou raiz absoluta
  
  const raiz = '/' + partes.slice(0, idx).join('/') + '/';
  return raiz + 'index.html';
}

/* ── API pública ─────────────────────────────────────────────── */
export function injetarLogo(opcoes = {}) {
  // Aceita string direta: injetarLogo('#header-logo-wrap')
  if (typeof opcoes === 'string') opcoes = { destino: opcoes };

const { destino, tamanho = 36 } = opcoes;
if (!destino) {
  console.error('[logo.js] injetarLogo() chamada sem destino.');
  return null;
}

  const container = document.querySelector(destino);
  if (!container) {
    console.warn('[logo.js] Destino não encontrado:', destino);
    return null;
  }

  const area = getAreaFromPath();
  const href = _hrefRaiz();

  /* ── Imagem ── */
  const img     = document.createElement('img');
  img.src       = _LOGO_SRC;
  img.alt       = 'Nexus Study';
  img.height    = tamanho;
  img.width     = tamanho;
  img.className = 'nexus-logo__img';
  img.loading = 'eager';

  /* ── Texto ── */
  const texto = document.createElement('div');
  texto.className = 'nexus-logo__texto nexus-logo__texto--stacked';
  texto.innerHTML = `
    <span class="nexus-logo__titulo">Nexus</span>
    <span class="nexus-logo__sub">Study</span>
  `;

  /* ── Link ── */
  const link = document.createElement('a');
  link.href      = href;
  link.className = 'nexus-logo__link';
  link.setAttribute('aria-label', 'Nexus Study — página inicial');
  link.appendChild(img);
  link.appendChild(texto);

  link.addEventListener('mouseenter', () => _playSound('hover', area));
  link.addEventListener('click',      () => _playSound('click', area));

  /* ── Wrapper ── */
  const wrap = document.createElement('div');
  wrap.className = 'nexus-logo';
  wrap.appendChild(link);

  container.innerHTML = '';
  container.appendChild(wrap);
  return wrap;
}