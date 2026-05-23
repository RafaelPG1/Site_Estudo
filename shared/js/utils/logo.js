/* ============================================================
   NEXUS STUDY — shared/js/logo.js
   Injeta a logo do projeto no DOM de forma declarativa.

   Uso básico:
     import { injetarLogo } from '../shared/js/logo.js';
     injetarLogo({ destino: '#header-logo-wrap' });

   Opções:
     destino    {string}  Seletor CSS do container.
                          Padrão: '#logo-wrap'

     tamanho    {number}  Altura da <img> em px.
                          Padrão: 36

     layout     {string}  Como o texto aparece ao lado da imagem:
                          'inline'  → img + [ Nexus  Study ] na mesma linha
                                      (Nexus grande, Study pequeno à direita)
                          'stacked' → img + bloco de duas linhas
                                      (Nexus em cima, Study embaixo)
                          Padrão: 'stacked'

     exibirNome {boolean} Exibe o bloco de texto.
                          Padrão: true

     classe     {string}  Classe extra no wrapper <div>.

     srcBase    {string}  Caminho para logo.png relativo à página.
                          Padrão: '../shared/img/logo.png'

     linkHref   {string}  Href do link. '' = sem link.
                          Padrão: '../index.html'

   Exemplos:
     // Header com texto em duas linhas (padrão)
     injetarLogo({ destino: '#header-logo-wrap', tamanho: 38 });

     // Sidebar com texto inline (Nexus + Study lado a lado)
     injetarLogo({ destino: '#sidebar-logo', tamanho: 32, layout: 'inline' });

     // Hero centralizado sem texto
     injetarLogo({ destino: '#hero-logo', tamanho: 64, exibirNome: false });
   ============================================================ */

export function injetarLogo({
  destino    = '#logo-wrap',
  tamanho    = 36,
  layout     = 'stacked',
  exibirNome = true,
  classe     = '',
  srcBase    = '../../shared/img/logo.png',
  linkHref   = '../../index.html',
} = {}) {
  const container = document.querySelector(destino);
  if (!container) {
    console.warn('[logo.js] Destino não encontrado:', destino);
    return null;
  }

  /* ── Imagem ──────────────────────────────────────────── */
  const img     = document.createElement('img');
  img.src       = srcBase;
  img.alt       = 'Nexus Study';
  img.height    = tamanho;
  img.width     = tamanho;
  img.className = 'nexus-logo__img';
  img.loading   = 'lazy';

  /* ── Bloco de texto ──────────────────────────────────── */
  const texto     = document.createElement('div');
  texto.hidden    = !exibirNome;

  if (layout === 'inline') {
    // [ Nexus  Study ] — tudo na mesma linha, alinhados pela baseline
    texto.className = 'nexus-logo__texto nexus-logo__texto--inline';
    texto.innerHTML = `
      <span class="nexus-logo__titulo">Nexus</span>
      <span class="nexus-logo__sub nexus-logo__sub--inline">Study</span>
    `;
  } else {
    // Nexus em cima, Study embaixo (padrão)
    texto.className = 'nexus-logo__texto nexus-logo__texto--stacked';
    texto.innerHTML = `
      <span class="nexus-logo__titulo">Nexus</span>
      <span class="nexus-logo__sub">Study</span>
    `;
  }

  /* ── Wrapper ─────────────────────────────────────────── */
  const wrap     = document.createElement('div');
  wrap.className = ['nexus-logo', classe].filter(Boolean).join(' ');

  /* ── Link (opcional) ─────────────────────────────────── */
  if (linkHref) {
    const link = document.createElement('a');
    link.href      = linkHref;
    link.className = 'nexus-logo__link';
    link.setAttribute('aria-label', 'Nexus Study — página inicial');
    link.appendChild(img);
    if (exibirNome) link.appendChild(texto);
    wrap.appendChild(link);
  } else {
    wrap.appendChild(img);
    if (exibirNome) wrap.appendChild(texto);
  }

  container.innerHTML = '';
  container.appendChild(wrap);
  return wrap;
}