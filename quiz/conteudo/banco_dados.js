// ============================================================
// NEXUS STUDY — conteudo/banco_dados.js
// Questões de Fundamentos de Banco de Dados
// ============================================================

const questoes = [
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
    pergunta: "O que faz a seguinte query SQL?\n\nSELECT nome, idade\nFROM usuarios\nWHERE idade > 18\nORDER BY nome ASC;",
    alternativas: [
      "A) Retorna todos os usuários ordenados por idade de forma decrescente",
      "B) Retorna nome e idade dos usuários maiores de 18 anos, ordenados por nome A-Z",
      "C) Deleta usuários com idade maior que 18",
      "D) Atualiza o campo nome de todos os usuários maiores de 18"
    ],
    correta: 1
  },
  {
    pergunta: "O que é normalização em banco de dados?",
    alternativas: [
      "A) O processo de aumentar a velocidade das consultas com índices",
      "B) A técnica de criptografar os dados armazenados",
      "C) O processo de organizar tabelas para reduzir redundância e dependências inconsistentes",
      "D) A criação de backups automáticos do banco de dados"
    ],
    correta: 2
  },
  {
    pergunta: "Qual é a diferença entre INNER JOIN e LEFT JOIN?",
    alternativas: [
      "A) INNER JOIN retorna todos os registros da tabela da esquerda, LEFT JOIN apenas os correspondentes",
      "B) LEFT JOIN retorna todos os registros da tabela esquerda mesmo sem correspondência, INNER JOIN só os correspondentes",
      "C) Não há diferença, ambos retornam os mesmos resultados",
      "D) INNER JOIN funciona apenas com chaves primárias, LEFT JOIN com quaisquer colunas"
    ],
    correta: 1
  }
];

window.questoes = questoes;