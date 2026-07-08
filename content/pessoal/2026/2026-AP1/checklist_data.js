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
      id: 'matematica',
      nome: 'Matemática',
      emoji: '📐',
      itens: [
        { id: 'mat-01', titulo: 'Funções e limites' },
        { id: 'mat-02', titulo: 'Derivadas' },
        { id: 'mat-03', titulo: 'Integrais' },
        { id: 'mat-04', titulo: 'Séries e sequências' },
      ],
    },
    {
      id: 'ingles',
      nome: 'Inglês',
      emoji: '🇬🇧',
      itens: [
        { id: 'ing-01', titulo: 'Reading comprehension' },
        { id: 'ing-02', titulo: 'Grammar essentials' },
        { id: 'ing-03', titulo: 'Vocabulary building' },
      ],
    },
    {
      id: 'programacao',
      nome: 'Programação',
      emoji: '💻',
      itens: [
        { id: 'prog-01', titulo: 'Lógica de programação' },
        { id: 'prog-02', titulo: 'Estruturas de dados' },
        { id: 'prog-03', titulo: 'Algoritmos de ordenação' },
        { id: 'prog-04', titulo: 'Orientação a objetos' },
        { id: 'prog-05', titulo: 'Projeto final' },
      ],
    },
  ],
};