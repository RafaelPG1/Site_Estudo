// ============================================================
// NEXUS STUDY — quiz/conteudo/2026/2026.2/banco_dados.js
// ============================================================

window.questoes = {

  questoes: [
    {
      question: "O que será retornado pela consulta?",
      code:
`SELECT nome FROM alunos WHERE idade > 18;`,
      options: [
        "Todos os alunos",
        "Alunos maiores de 18 anos",
        "Apenas um aluno",
        "Erro de sintaxe"
      ],
      answer: 1,
      feedback: "WHERE filtra os registros conforme a condição."
    },
    {
      question: "O que representa uma chave primária?",
      options: [
        "Campo opcional",
        "Identificador único do registro",
        "Campo duplicado",
        "Relacionamento externo"
      ],
      answer: 1,
      feedback: "A chave primária identifica unicamente cada registro."
    },
    {
      question: "O que acontece neste JOIN?",
      code:
`SELECT * 
FROM alunos A
INNER JOIN cursos C
ON A.curso_id = C.id;`,
      options: [
        "Retorna todos os dados",
        "Retorna apenas registros relacionados",
        "Remove duplicados",
        "Cria tabela nova"
      ],
      answer: 1,
      feedback: "INNER JOIN retorna apenas registros com correspondência."
    },
    {
      question: "Qual é o objetivo da normalização?",
      options: [
        "Aumentar tamanho do banco",
        "Reduzir redundância de dados",
        "Apagar tabelas",
        "Criar índices"
      ],
      answer: 1,
      feedback: "Normalização organiza os dados e evita duplicidade."
    }
  ],

  ava: [
    {
      question: "Qual comando insere dados?",
      options: [
        "CREATE",
        "INSERT",
        "UPDATE",
        "SELECT"
      ],
      answer: 1,
      feedback: "INSERT adiciona novos registros."
    },
    {
      question: "O que faz o ORDER BY?",
      options: [
        "Filtra dados",
        "Ordena resultados",
        "Remove registros",
        "Cria tabela"
      ],
      answer: 1,
      feedback: "ORDER BY organiza os dados retornados."
    }
  ]

};