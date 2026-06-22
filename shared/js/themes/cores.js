/* ============================================================
   NEXUS STUDY — shared/js/themes/cores.js

   Paleta extraída do design visual atual (quiz.css /
   disciplinas_global.css) — tokens canônicos do projeto:

     violet  #6c63ff  →  108, 99, 255
     cyan    #3dd9c2  →   61, 217, 194
     amber   #f7c948  →  247, 201, 72
     rose    #ff6b8a  →  255, 107, 138
     sage    #5de8a0  →   93, 232, 160

   Mapeamento disciplina → par de cores (tema + acento):
     poo          violet  +  cyan    (tecnologia / POO)
     redes        cyan    +  violet  (redes / conectividade)
     banco_dados  rose    +  amber   (dados / estrutura)
     design       amber   +  sage    (criatividade / visual)

   REGRAS DE USO:
     ✔ Bordas de cards por disciplina
     ✔ Hover effects e highlights
     ✔ Indicadores e badges
     ✔ Pequenos detalhes visuais
     ✗ NÃO usar em background principal
     ✗ NÃO alterar gradientes de fundo
     ✗ NÃO substituir efeitos atmosféricos
   ============================================================ */

export const DISC_CORES = {

  /* ── POO — violeta elétrico + cyan ─────────────────────── */
  poo: {
    corTema:     '#6c63ff', corTemaRgb:  '108, 99, 255',
    corTema2:    '#3dd9c2', corTema2Rgb: '61, 217, 194',
  },

  /* ── REDES — cyan + violeta ─────────────────────────────── */
  redes: {
    corTema:     '#3dd9c2', corTemaRgb:  '61, 217, 194',
    corTema2:    '#6c63ff', corTema2Rgb: '108, 99, 255',
  },

  /* ── BANCO DE DADOS — rose + amber ─────────────────────── */
  banco_dados: {
    corTema:     '#ff6b8a', corTemaRgb:  '255, 107, 138',
    corTema2:    '#f7c948', corTema2Rgb: '247, 201, 72',
  },

  /* ── DESIGN — amber + sage ──────────────────────────────── */
  design: {
    corTema:     '#f7c948', corTemaRgb:  '247, 201, 72',
    corTema2:    '#5de8a0', corTema2Rgb: '93, 232, 160',
  },

};