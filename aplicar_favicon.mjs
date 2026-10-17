// Coloca o favicon (shared/img/favicon_io) em todas as páginas que carregam o logo.js
// e no index.html. Rode na RAIZ do projeto (onde fica o index.html):  node aplicar_favicon.mjs
// Só troca trechos exatos; se algo não bater, NÃO altera nada e avisa. Pode rodar mais de uma vez.
import fs from 'node:fs';

const BLOCO_LOGO = `/* ── Favicon: aparece em toda página que carrega o logo.js ──────
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

`;

const HTML_LINKS = `  <link rel="icon" href="shared/img/favicon_io/favicon.ico" sizes="any" data-nexus-fav />
  <link rel="icon" type="image/png" sizes="32x32" href="shared/img/favicon_io/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="shared/img/favicon_io/favicon-16x16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="shared/img/favicon_io/apple-touch-icon.png" />
  <link rel="manifest" href="shared/img/favicon_io/site.webmanifest" />\n`;

const ler = (a) => fs.readFileSync(a, 'utf8');
const saidas = new Map();
let problema = false;
const falha = (m) => { console.log('✘ ' + m); problema = true; };

// 1) logo.js
{
  const a = 'shared/js/utils/logo.js';
  if (!fs.existsSync(a)) falha(`não achei ${a} (rode na raiz do projeto)`);
  else {
    const orig = ler(a), txt = orig.replace(/\r\n/g, '\n');
    if (txt.includes('_injetarFavicons')) console.log(`• ${a}: já estava aplicado`);
    else {
      const ancora = "const _LOGO_SRC = new URL('../../img/logo.png', import.meta.url).href;\n\n";
      if (txt.split(ancora).length !== 2) falha(`${a}: ponto de inserção não encontrado (1 vez esperada)`);
      else { saidas.set(a, { orig, novo: txt.replace(ancora, () => ancora + BLOCO_LOGO) }); console.log(`✔ ${a}: ajuste preparado`); }
    }
  }
}
// 2) index.html: troca o favicon provisório (SVG) pelos arquivos reais
{
  const a = 'index.html';
  if (!fs.existsSync(a)) falha(`não achei ${a}`);
  else {
    const orig = ler(a), txt = orig.replace(/\r\n/g, '\n');
    if (txt.includes('favicon_io/favicon.ico')) console.log(`• ${a}: já estava aplicado`);
    else {
      const re = /  <link rel="icon" type="image\/svg\+xml" href="data:image\/svg\+xml[^\n]*\n/;
      if (!re.test(txt)) falha(`${a}: não achei o favicon provisório (SVG) para trocar`);
      else { saidas.set(a, { orig, novo: txt.replace(re, () => HTML_LINKS) }); console.log(`✔ ${a}: ajuste preparado`); }
    }
  }
}
if (problema) { console.log('\nNada foi gravado. Me mande esta saída.'); process.exit(1); }
for (const [a, { orig, novo }] of saidas) {
  fs.writeFileSync(a, orig.includes('\r\n') ? novo.replace(/\n/g, '\r\n') : novo);
  console.log('gravado: ' + a);
}
console.log('\nPronto. Confira com: git diff');
