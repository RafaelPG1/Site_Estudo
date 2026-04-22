/* ============================================================
   NEXUS STUDY — games/conteudo/flashcards/flashcards.js

   Formato dos decks de flashcard.
   Cada chave é o id da disciplina (mesmo valor de ?disc= na URL).

   Estrutura de cada card:
     id      → número único dentro do deck
     frente  → pergunta ou termo (exibido na frente do card)
     verso   → resposta ou definição (exibido ao virar)
     dica    → (opcional) texto de apoio exibido na frente
     tags    → (opcional) array de strings para filtros futuros

   Como adicionar uma disciplina:
     1. Adicione uma nova chave em DECKS com o id da disciplina
     2. Preencha o array de cards (recomendado: 20–60 cards por deck)
     3. O jogo carrega automaticamente pelo ?disc= na URL
   ============================================================ */

export const DECKS = {

  /* ── EXEMPLO — substitua pelo id real da sua disciplina ── */
  'exemplo': {
    cards: [
      {
        id: 1,
        frente: 'O que é encapsulamento?',
        verso:  'Mecanismo que protege os dados internos de um objeto, expondo apenas o necessário por meio de métodos públicos (getters/setters).',
        dica:   'Relacionado a controle de acesso',
      },
      {
        id: 2,
        frente: 'Diferença entre classe e objeto',
        verso:  'Classe é o molde/definição; objeto é uma instância concreta criada a partir desse molde com valores próprios.',
      },
      {
        id: 3,
        frente: 'O que é herança?',
        verso:  'Mecanismo pelo qual uma classe (filha) herda atributos e métodos de outra classe (pai), permitindo reutilização e especialização de código.',
        tags:   ['herança', 'hierarquia'],
      },
    ],
  },

  /* ── Adicione seus decks reais abaixo ── */

  // 'poo': {
  //   cards: [
  //     { id: 1, frente: '...', verso: '...' },
  //   ],
  // },

  // 'design': {
  //   cards: [
  //     { id: 1, frente: '...', verso: '...' },
  //   ],
  // },

};