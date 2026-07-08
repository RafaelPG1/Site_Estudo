/* content\pessoal\2026\2026-AP1\checklist_data.js
 proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   Fonte de dados do Checklist para o semestre 2026-AP1.
   APENAS dados — nenhuma lógica, nenhum salvamento, nenhum
   HTML/CSS. Lido dinamicamente por
   dashboard/js/checklist/checklist.js com base no semestre
   selecionado no Dashboard. Este arquivo nunca é modificado pelo
   sistema; o progresso do usuário é armazenado separadamente
   (ver checklist_storage.js). */

   export const checklistData = {
  disciplinas: [
    {
      disciplinaId: 'redes', // precisa bater com o "id" oficial em getDisciplinasDeSemestre
      itens: [
        { id: 'algo-ex1', titulo: 'Exercício 1' },
        { id: 'algo-ex2', titulo: 'Exercício 2' },
        { id: 'algo-rev', titulo: 'Revisão' },
      ],
    },
    {
      disciplinaId: 'banco-dados',
      itens: [
        { id: 'bd-er',   titulo: 'Modelo ER' },
        { id: 'bd-sql',  titulo: 'SQL Básico' },
        { id: 'bd-norm', titulo: 'Normalização' },
      ],
    },
  ],
};