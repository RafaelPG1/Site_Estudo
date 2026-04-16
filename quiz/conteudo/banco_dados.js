// ============================================================
// NEXUS STUDY — quiz/conteudo/banco_dados.js
// Questões de Fundamentos de Banco de Dados
// ============================================================

window.questoes = {

  /* ── QUESTÕES PRÁTICAS ──────────────────────────────── */
  questoes: [
    {
      pergunta: "O que é uma chave primária (Primary Key) em um banco de dados relacional?",
      alternativas: [
        "A) Um atributo que pode conter valores nulos",
        "B) Um identificador único que distingue cada registro de uma tabela",
        "C) Uma coluna que referencia outra tabela",
        "D) Um índice criado automaticamente em todas as colunas"
      ],
      correta: 1
    },
    {
      pergunta: "Qual comando SQL é usado para buscar dados em uma tabela?",
      alternativas: [
        "A) INSERT",
        "B) UPDATE",
        "C) SELECT",
        "D) DELETE"
      ],
      correta: 2
    },
    {
      pergunta: "O que é normalização em banco de dados?",
      alternativas: [
        "A) Aumentar velocidade com índices",
        "B) Criptografar dados",
        "C) Organizar tabelas para reduzir redundância",
        "D) Criar backups automáticos"
      ],
      correta: 2
    },
    {
      pergunta: "Qual é a função do WHERE em SQL?",
      alternativas: [
        "A) Ordenar resultados",
        "B) Filtrar registros",
        "C) Criar tabelas",
        "D) Atualizar dados"
      ],
      correta: 1
    },
    {
      pergunta: "O que faz o INNER JOIN?",
      alternativas: [
        "A) Junta todas as linhas de ambas tabelas",
        "B) Retorna apenas registros com correspondência",
        "C) Remove dados duplicados",
        "D) Cria uma nova tabela"
      ],
      correta: 1
    }
  ],

  /* ── QUESTÕES AVA ───────────────────────────────────── */
  ava: [
    {
      pergunta: "Qual comando SQL é usado para inserir dados?",
      alternativas: [
        "A) ADD",
        "B) INSERT",
        "C) CREATE",
        "D) PUT"
      ],
      correta: 1
    },
    {
      pergunta: "Qual restrição impede valores duplicados?",
      alternativas: [
        "A) NOT NULL",
        "B) UNIQUE",
        "C) DEFAULT",
        "D) INDEX"
      ],
      correta: 1
    },
    {
      pergunta: "O que é uma chave estrangeira (Foreign Key)?",
      alternativas: [
        "A) Identificador único da tabela",
        "B) Campo que referencia outra tabela",
        "C) Campo opcional",
        "D) Índice automático"
      ],
      correta: 1
    },
    {
      pergunta: "Qual comando remove dados de uma tabela?",
      alternativas: [
        "A) DELETE",
        "B) REMOVE",
        "C) DROP",
        "D) CLEAR"
      ],
      correta: 0
    },
    {
      pergunta: "ORDER BY é usado para:",
      alternativas: [
        "A) Filtrar dados",
        "B) Ordenar resultados",
        "C) Agrupar tabelas",
        "D) Inserir dados"
      ],
      correta: 1
    }
  ]
};