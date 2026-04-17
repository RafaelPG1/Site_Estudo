// ============================================================
// NEXUS STUDY — quiz/conteudo/redes.js
// Questões de Redes de Computadores
// ============================================================

window.questoes = {

  questoes: [
    {
      question: "Qual camada do modelo OSI usa IP?",
      options: [
        "Enlace",
        "Transporte",
        "Rede",
        "Sessão"
      ],
      answer: 2,
      feedback: "O protocolo IP atua na camada de Rede do modelo OSI."
    },
    {
      question: "TCP garante:",
      options: [
        "Velocidade sem controle",
        "Entrega confiável",
        "Sem conexão",
        "Broadcast"
      ],
      answer: 1,
      feedback: "O TCP garante entrega confiável, com controle de erros e ordem."
    },
    {
      question: "O que é subnet?",
      options: [
        "Cabo",
        "Divisão de rede",
        "Protocolo",
        "IP fixo"
      ],
      answer: 1,
      feedback: "Subnet é a divisão de uma rede maior em redes menores."
    },
    {
      question: "DNS serve para:",
      options: [
        "Enviar email",
        "Traduzir domínio para IP",
        "Transferir arquivos",
        "Roteamento"
      ],
      answer: 1,
      feedback: "O DNS converte nomes de domínio em endereços IP."
    },
    {
      question: "MAC atua na camada:",
      options: [
        "Física",
        "Enlace",
        "Rede",
        "Transporte"
      ],
      answer: 1,
      feedback: "O endereço MAC atua na camada de Enlace."
    }
  ],

  ava: [
    {
      question: "HTTP usa porta padrão:",
      options: [
        "21",
        "80",
        "443",
        "25"
      ],
      answer: 1,
      feedback: "A porta padrão do HTTP é a 80."
    },
    {
      question: "HTTPS adiciona:",
      options: [
        "Compressão",
        "Segurança",
        "Velocidade",
        "DNS"
      ],
      answer: 1,
      feedback: "HTTPS adiciona segurança através de criptografia (SSL/TLS)."
    },
    {
      question: "Roteador faz:",
      options: [
        "Processar CPU",
        "Direcionar pacotes",
        "Armazenar dados",
        "Criar código"
      ],
      answer: 1,
      feedback: "O roteador é responsável por direcionar pacotes entre redes."
    },
    {
      question: "IP identifica:",
      options: [
        "Usuário",
        "Dispositivo na rede",
        "Programa",
        "Arquivo"
      ],
      answer: 1,
      feedback: "O endereço IP identifica dispositivos dentro de uma rede."
    },
    {
      question: "UDP é:",
      options: [
        "Confiável",
        "Lento",
        "Sem conexão",
        "Criptografado"
      ],
      answer: 2,
      feedback: "UDP é um protocolo sem conexão e sem garantia de entrega."
    }
  ]

};