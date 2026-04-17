// ============================================================
// NEXUS STUDY — quiz/conteudo/2026/2026.2/redes.js
// Questões de Redes de Computadores
// ============================================================

window.questoes = {

  questoes: [
    {
      question: "O que será exibido ao acessar o site?",
      code:
`// Cliente acessa: http://meusite.com
// DNS resolve para: 192.168.1.10
// Servidor responde corretamente

console.log("Conexão estabelecida");`,
      options: [
        "Erro de DNS",
        "Conexão estabelecida",
        "Timeout",
        "IP inválido"
      ],
      answer: 1,
      feedback: "O DNS resolve o domínio corretamente e a conexão é realizada com sucesso."
    },
    {
      question: "Qual camada do modelo OSI é responsável por endereçamento lógico (IP)?",
      options: [
        "Enlace",
        "Transporte",
        "Rede",
        "Aplicação"
      ],
      answer: 2,
      feedback: "A camada de Rede é responsável pelo endereçamento lógico, como IP."
    },
    {
      question: "Qual comportamento descreve melhor o TCP?",
      options: [
        "Envia dados sem verificação",
        "Garante entrega e ordem dos pacotes",
        "Funciona apenas com DNS",
        "É mais rápido que UDP sempre"
      ],
      answer: 1,
      feedback: "TCP garante entrega confiável e ordenada."
    },
    {
      question: "Um roteador tem como principal função:",
      options: [
        "Armazenar arquivos",
        "Converter nomes em IP",
        "Encaminhar pacotes entre redes",
        "Executar programas"
      ],
      answer: 2,
      feedback: "Roteadores direcionam pacotes entre redes diferentes."
    }
  ],

  ava: [
    {
      question: "O que acontece ao usar HTTPS em vez de HTTP?",
      options: [
        "Aumenta apenas a velocidade",
        "Adiciona criptografia na comunicação",
        "Remove necessidade de DNS",
        "Evita uso de IP"
      ],
      answer: 1,
      feedback: "HTTPS utiliza SSL/TLS para garantir segurança."
    },
    {
      question: "Qual situação representa melhor o uso de UDP?",
      options: [
        "Transferência bancária",
        "Streaming de vídeo",
        "Login em sistema",
        "Envio de email"
      ],
      answer: 1,
      feedback: "UDP é usado quando velocidade é mais importante que confiabilidade, como streaming."
    }
  ]

};