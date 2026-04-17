// ============================================================
// NEXUS STUDY — quiz/conteudo/banco_dados.js
// ============================================================

window.questoes = {

  questoes: [
    {
      question: "O que é uma chave primária (Primary Key) em um banco de dados relacional?",
      options: [
        "Um atributo que pode conter valores nulos",
        "Um identificador único que distingue cada registro de uma tabela",
        "Uma coluna que referencia outra tabela",
        "Um índice criado automaticamente em todas as colunas"
      ],
      answer: 1,
      feedback: "A chave primária identifica unicamente cada registro."
    },
    {
      question: "Qual comando SQL é usado para buscar dados em uma tabela?",
      options: [
        "INSERT",
        "UPDATE",
        "SELECT",
        "DELETE"
      ],
      answer: 2,
      feedback: "SELECT é usado para consultar dados."
    },
    {
      question: "O que é normalização em banco de dados?",
      options: [
        "Aumentar velocidade com índices",
        "Criptografar dados",
        "Organizar tabelas para reduzir redundância",
        "Criar backups automáticos"
      ],
      answer: 2,
      feedback: "Normalização evita redundância e inconsistência."
    },
    {
      question: "Qual é a função do WHERE em SQL?",
      options: [
        "Ordenar resultados",
        "Filtrar registros",
        "Criar tabelas",
        "Atualizar dados"
      ],
      answer: 1,
      feedback: "WHERE filtra os dados retornados."
    },
    {
      question: "O que faz o INNER JOIN?",
      options: [
        "Junta todas as linhas de ambas tabelas",
        "Retorna apenas registros com correspondência",
        "Remove dados duplicados",
        "Cria uma nova tabela"
      ],
      answer: 1,
      feedback: "INNER JOIN retorna apenas correspondências entre tabelas."
    }
  ],

  ava: [
    {
      question: "Qual comando SQL é usado para inserir dados?",
      options: [
        "ADD",
        "INSERT",
        "CREATE",
        "PUT"
      ],
      answer: 1,
      feedback: "INSERT adiciona novos registros."
    },
    {
      question: "Qual restrição impede valores duplicados?",
      options: [
        "NOT NULL",
        "UNIQUE",
        "DEFAULT",
        "INDEX"
      ],
      answer: 1,
      feedback: "UNIQUE impede valores repetidos."
    },
    {
      question: "O que é uma chave estrangeira (Foreign Key)?",
      options: [
        "Identificador único da tabela",
        "Campo que referencia outra tabela",
        "Campo opcional",
        "Índice automático"
      ],
      answer: 1,
      feedback: "Foreign Key cria relacionamento entre tabelas."
    },
    {
      question: "Qual comando remove dados de uma tabela?",
      options: [
        "DELETE",
        "REMOVE",
        "DROP",
        "CLEAR"
      ],
      answer: 0,
      feedback: "DELETE remove registros da tabela."
    },
    {
      question: "ORDER BY é usado para:",
      options: [
        "Filtrar dados",
        "Ordenar resultados",
        "Agrupar tabelas",
        "Inserir dados"
      ],
      answer: 1,
      feedback: "ORDER BY organiza os resultados."
    }
  ]

};