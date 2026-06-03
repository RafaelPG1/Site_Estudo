/* ============================================================
   NEXUS STUDY — shared/js/utils/logo.js  (v2.1)
   ============================================================ */

import { playSound as _playSound } from '../audio/audio-api.js';

/* ── Caminho da imagem resolvido uma vez, relativo ao logo.js ── */
const _LOGO_SRC = new URL('../../img/logo.png', import.meta.url).href;

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

/* ── Mapa de área por pathname ──────────────────────────────── */
const _AREA_MAP = [
  { match: /\/quiz\//,         area: 'quiz'    },
  { match: /\/resumo\//,       area: 'resumos' },
  { match: /\/games?\//,       area: 'game'    },
  { match: /\/pessoal\//, area: 'perfil' },
  { match: /\/admin\//,        area: 'inicial' },
];

export function getAreaFromPath(path = window.location.pathname) {
  for (const { match, area } of _AREA_MAP) {
    if (match.test(path)) return area;
  }
  return 'inicial';
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