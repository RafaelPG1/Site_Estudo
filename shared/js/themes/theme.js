/* ============================================================
   NEXUS STUDY — shared/js/theme.js

   ÚNICA fonte de escrita de CSS custom properties de disciplina.
   Todos os CSS do projeto consomem variáveis daqui — nenhum
   deve declarar cores de disciplina com valores literais.

   Variáveis escritas no :root inline style
   (inline style tem especificidade máxima, vence qualquer regra
   de folha de estilos, incluindo seletores body[data-disc]):

     Canônicas (disciplinas_global.css, template.css, flashcard.css):
       --cor-tema         hex da cor principal
       --cor-tema-rgb     canal R,G,B separados por vírgula
       --cor-tema-2       hex da cor secundária
       --cor-tema-2-rgb   canal R,G,B separados por vírgula

     Legadas (resumo.css, pessoal.css):
       --disc-tema        alias de --cor-tema
       --disc-tema-rgb    alias de --cor-tema-rgb
       --disc-tema2       alias de --cor-tema-2
       --disc-tema2-rgb   alias de --cor-tema-2-rgb

     Abreviadas para rgba() no CSS:
       --dt-rgb           alias de --cor-tema-rgb
       --dt2-rgb          alias de --cor-tema-2-rgb

   Atributo no <body>:
       data-disc="poo"    usado por disc-theme.css para pseudo-elementos
                          e contextos onde var() dentro de rgba() não
                          é suportado (Safari ≤ 15.3)

   @param {string} discArquivo  — chave em DISC_CORES, ex: 'banco_dados'
   @param {Object} DISC_CORES   — importado de shared/js/cores.js
   ============================================================ */

export function aplicarCoresDisciplina(discArquivo, DISC_CORES) {
  const cores = DISC_CORES[discArquivo];
  if (!cores) {
    console.warn('[theme] Sem cores definidas para: ' + discArquivo);
    return;
  }

  const r = document.documentElement.style;

  /* ── Canônicas ─────────────────────────────────────────── */
  r.setProperty('--cor-tema',       cores.corTema);
  r.setProperty('--cor-tema-rgb',   cores.corTemaRgb);
  r.setProperty('--cor-tema-2',     cores.corTema2);
  r.setProperty('--cor-tema-2-rgb', cores.corTema2Rgb);

  /* ── Legadas ───────────────────────────────────────────── */
  r.setProperty('--disc-tema',      cores.corTema);
  r.setProperty('--disc-tema-rgb',  cores.corTemaRgb);
  r.setProperty('--disc-tema2',     cores.corTema2);
  r.setProperty('--disc-tema2-rgb', cores.corTema2Rgb);

  /* ── Abreviadas (uso em rgba() inline no CSS) ──────────── */
  r.setProperty('--dt-rgb',         cores.corTemaRgb);
  r.setProperty('--dt2-rgb',        cores.corTema2Rgb);

  /* ── Atributo no body — usado por disc-theme.css ───────── */
  document.body.dataset.disc = discArquivo;
}