/* ============================================================
   NEXUS STUDY — shared/theme.js
   Aplica as cores de uma disciplina via CSS custom properties.

   Função exportada:
     aplicarCoresDisciplina(discArquivo, DISC_CORES)

   Aplica os dois conjuntos de nomes de variáveis para garantir
   compatibilidade com todos os CSS do projeto:
     • --cor-tema / --cor-tema-rgb / --cor-tema-2 / --cor-tema-2-rgb
       → consumidas por disciplinas_global.css e template.css
     • --disc-tema / --disc-tema-rgb / --disc-tema2 / --disc-tema2Rgb
       → consumidas por resumo.css e pessoal.css
   ============================================================ */

/**
 * Aplica as cores de uma disciplina como CSS custom properties
 * no elemento :root.
 *
 * @param {string} discArquivo  — chave no objeto DISC_CORES (ex: 'banco_dados')
 * @param {Object} DISC_CORES   — mapa de cores importado de shared/cores.js
 *
 * Exemplo:
 *   import { aplicarCoresDisciplina } from '../../shared/theme.js';
 *   aplicarCoresDisciplina(info.arquivo, DISC_CORES);
 */
export function aplicarCoresDisciplina(discArquivo, DISC_CORES) {
  const cores = DISC_CORES[discArquivo];
  if (!cores) {
    console.warn('[theme] Sem cores definidas para: ' + discArquivo);
    return;
  }

  const r = document.documentElement.style;

  /* Nomes canônicos — consumidos por disciplinas_global.css e template.css */
  r.setProperty('--cor-tema',       cores.corTema);
  r.setProperty('--cor-tema-rgb',   cores.corTemaRgb);
  r.setProperty('--cor-tema-2',     cores.corTema2);
  r.setProperty('--cor-tema-2-rgb', cores.corTema2Rgb);

  /* Nomes legados — consumidos por resumo.css e pessoal.css */
  r.setProperty('--disc-tema',      cores.corTema);
  r.setProperty('--disc-tema-rgb',  cores.corTemaRgb);
  r.setProperty('--disc-tema2',     cores.corTema2);
  r.setProperty('--disc-tema2-rgb', cores.corTema2Rgb);
}