/* =============================================
   NEXUS STUDY — shared/js/utils/html-seguro.js
   Inserção segura de dados (Firestore, localStorage) em HTML.

   Por contexto:
     · Texto HTML e atributos ENTRE ASPAS  → esc()
     · URL (src de <img>)                  → urlImagemSegura(), e o
                                             resultado ainda passa por esc()
     · Linhas de tabela/ranking com muitos
       campos                              → escDados()

   NÃO serve para: JavaScript inline, <script>, <style>/atributo style,
   atributos sem aspas nem href/src com URL arbitrária. Nenhum desses
   contextos recebe dado do Firestore hoje; se algum dia receber, use
   DOM (textContent / setAttribute / dataset) em vez de montar string.
   ============================================= */

const _MAPA = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapa texto para HTML e para valores de atributo entre aspas. */
export function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, c => _MAPA[c]);
}

/** Cópia rasa de `obj` com esc() em todo campo string (números e demais tipos intactos). */
export function escDados(obj) {
  const out = {};
  for (const k of Object.keys(obj ?? {})) {
    out[k] = typeof obj[k] === 'string' ? esc(obj[k]) : obj[k];
  }
  return out;
}

/* data URI de imagem raster (SVG fica de fora de propósito) */
const _RE_DATA_IMG  = /^data:image\/(?:png|jpe?g|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/i;
/* caminho relativo simples: sem esquema (a:), sem "//", só caracteres de caminho */
const _RE_RELATIVO  = /^(?![a-z][a-z0-9+.-]*:)(?!\/\/)[\w.\-/%~]+$/i;
/* qualquer espaço, controle, aspas, <, >, crase ou barra invertida */
const _RE_PROIBIDO  = /[\u0000- \u007f"'<>`\\]/;
const _MAX_URL      = 1000000;

/**
 * Valida uma URL de imagem vinda de dado não confiável.
 * Aceita: https:// (sem usuário/senha), data:image/png|jpeg|gif|webp;base64 e
 * caminho relativo simples. Qualquer outra coisa devolve '' (o chamador cai
 * no avatar emoji). O retorno deve ser inserido com esc() dentro de src="…".
 */
export function urlImagemSegura(v) {
  if (typeof v !== 'string') return '';
  const s = v.trim();
  if (!s || s.length > _MAX_URL || _RE_PROIBIDO.test(s)) return '';

  if (/^data:/i.test(s)) return _RE_DATA_IMG.test(s) ? s : '';

  if (/^https:/i.test(s)) {
    if (!/^https:\/\/[^/]/i.test(s)) return '';   // exige host logo após https://
    try {
      const u = new URL(s);
      return (u.protocol === 'https:' && !u.username && !u.password) ? s : '';
    } catch { return ''; }
  }

  return _RE_RELATIVO.test(s) ? s : '';
}
