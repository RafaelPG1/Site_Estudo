/* ============================================================
   NEXUS STUDY — shared/js/utils/logo.js  (v2 — autossuficiente)

   Uso:
     import { injetarLogo } from '../shared/js/utils/logo.js';
     injetarLogo('#header-logo-wrap');
     // ou
     injetarLogo({ destino: '#header-logo-wrap' });

   Parâmetros opcionais (todos com padrão sensato):
     destino   {string}  Seletor CSS do container. Padrão: '#logo-wrap'
     tamanho   {number}  Altura da img em px.      Padrão: 36
   ============================================================ */

import { playSound as _playSound } from '../audio/audio-api.js';

/* ── Resolve o caminho absoluto da imagem uma única vez,
      relativo ao próprio logo.js (shared/js/utils/ → shared/img/)
   ─────────────────────────────────────────────────────────────── */
const _LOGO_SRC = new URL('../../img/logo.png', import.meta.url).href;

/* ── Mapa de área por fragmento de pathname ──────────────────── */
const _AREA_MAP = [
  { match: /\/quiz\//,         area: 'quiz'    },
  { match: /\/resumo\//,       area: 'resumos' },
  { match: /\/games?\//,       area: 'game'    },
  { match: /\/area_pessoal\//, area: 'perfil'  },
  { match: /\/admin\//,        area: 'inicial' },
];

export function getAreaFromPath(path = window.location.pathname) {
  for (const { match, area } of _AREA_MAP) {
    if (match.test(path)) return area;
  }
  return 'inicial';
}

/* ── Calcula o href para a raiz do projeto ───────────────────────
   Conta os segmentos de pasta do pathname atual e sobe todos eles.
   Ex: /Site_Estudo/resumo/resumo.html → 2 segmentos → ../../
       /Site_Estudo/index.html         → 1 segmento  → ../
   ─────────────────────────────────────────────────────────────── */
function _hrefRaiz() {
  const parts = window.location.pathname
    .split('/')
    .filter(Boolean);          // remove strings vazias
  // O último segmento é o arquivo HTML — remove ele, sobram as pastas
  const depth = parts.length - 1;
  if (depth <= 0) return './index.html';
  return '../'.repeat(depth) + 'index.html';
}

/* ── API pública ─────────────────────────────────────────────── */
export function injetarLogo(opcoes = {}) {
  // Aceita string direta: injetarLogo('#header-logo-wrap')
  if (typeof opcoes === 'string') opcoes = { destino: opcoes };

  const {
    destino  = '#logo-wrap',
    tamanho  = 36,
  } = opcoes;

  const container = document.querySelector(destino);
  if (!container) {
    console.warn('[logo.js] Destino não encontrado:', destino);
    return null;
  }

  const area = getAreaFromPath();
  const href = _hrefRaiz();

  /* ── Imagem ── */
  const img       = document.createElement('img');
  img.src         = _LOGO_SRC;
  img.alt         = 'Nexus Study';
  img.height      = tamanho;
  img.width       = tamanho;
  img.className   = 'nexus-logo__img';
  img.loading     = 'lazy';

  /* ── Texto (sempre stacked: Nexus / Study) ── */
  const texto = document.createElement('div');
  texto.className = 'nexus-logo__texto nexus-logo__texto--stacked';
  texto.innerHTML = `
    <span class="nexus-logo__titulo">Nexus</span>
    <span class="nexus-logo__sub">Study</span>
  `;

  /* ── Link para a raiz ── */
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