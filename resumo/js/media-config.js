/* =============================================
   NEXUS STUDY — resumo/js/media-config.js
   Fonte única da URL base das mídias hospedadas no
   Cloudflare R2 (imagens, vídeos, áudios, pdfs).

   Trocar de bucket/domínio no futuro = editar só
   MEDIA_BASE aqui. resumo-reader.js, resumo-pdf.js e
   resumo-extra.js importam daqui — nenhum dos três
   deve montar essa base por conta própria.
   ============================================= */

import { parseSemestre } from '../../src/global.js';

// Sem barra no final — as funções abaixo já adicionam.
export const MEDIA_BASE = 'https://pub-9008c4b64b4f48feaca3befd4a508075.r2.dev';

// Codifica cada segmento do caminho (entre barras) separadamente —
// preserva a estrutura de pastas, só escapa espaço/acento/caractere
// especial dentro de cada nome. Sem isso, nomes como "3 Níveis de
// Abstração.png" ou "revisão_analise - Copia.jpg" quebram a URL.
export function encodePath(path) {
  return String(path).split('/').map(encodeURIComponent).join('/');
}

/* Base de `image/` por disciplina (padrão, sem `pasta` explícita):
   MEDIA_BASE/<ano>/<periodo>[/<ap>]/image/imagens_<discArquivo>/ */
export function imgBase(discArquivo, semestre) {
  const { ano, periodo, ap } = parseSemestre(semestre ?? '2026.1');
  const apPath = ap ? `/${ap}` : '';
  return discArquivo
    ? `${MEDIA_BASE}/${ano}/${periodo}${apPath}/image/imagens_${discArquivo}/`
    : `${MEDIA_BASE}/${ano}/${periodo}${apPath}/image/`;
}

/* Base de `image/<pasta>/` — quando o bloco define `pasta` explícita
   (bloco tipo 'imagem'), em vez da pasta padrão por disciplina. */
export function imgBasePasta(pasta, semestre) {
  const { ano, periodo, ap } = parseSemestre(semestre ?? '2026.1');
  const apPath = ap ? `/${ap}` : '';
  return `${MEDIA_BASE}/${ano}/${periodo}${apPath}/image/${encodePath(pasta)}/`;
}

/* Base de `extra/` — irmã de `image/`, mesmo nível (mapas mentais e
   vídeo local, ver resumo-extra.js). Sem subpasta padrão por disciplina. */
export function extraBase(semestre) {
  const { ano, periodo, ap } = parseSemestre(semestre ?? '2026.1');
  const apPath = ap ? `/${ap}` : '';
  return `${MEDIA_BASE}/${ano}/${periodo}${apPath}/extra/`;
}