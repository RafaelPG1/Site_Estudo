// ============================================================
// NEXUS STUDY — conteudo/redes.js
// Questões de Redes de Computadores
// ============================================================

const questoes = [
  {
    pergunta: "Qual camada do modelo OSI é responsável pelo endereçamento IP?",
    alternativas: [
      "A) Camada de Enlace",
      "B) Camada de Transporte",
      "C) Camada de Rede",
      "D) Camada de Sessão"
    ],
    correta: 2
  },
  {
    pergunta: "O protocolo TCP difere do UDP principalmente porque:",
    alternativas: [
      "A) TCP é mais rápido e não garante entrega",
      "B) TCP garante a entrega ordenada dos pacotes, UDP não",
      "C) UDP é orientado à conexão, TCP não",
      "D) TCP opera apenas na camada de rede"
    ],
    correta: 1
  },
  {
    pergunta: "O que é uma sub-rede (subnet)?",
    alternativas: [
      "A) Um protocolo de roteamento dinâmico",
      "B) Uma divisão lógica de uma rede IP em segmentos menores",
      "C) Um tipo de cabo de rede de alta velocidade",
      "D) O endereço físico de uma placa de rede"
    ],
    correta: 1
  },
  {
    pergunta: "Qual protocolo é utilizado para traduzir nomes de domínio em endereços IP?",
    alternativas: [
      "A) DHCP",
      "B) FTP",
      "C) DNS",
      "D) SMTP"
    ],
    correta: 2
  },
  {
    pergunta: "O endereço MAC (Media Access Control) opera em qual camada do modelo OSI?",
    alternativas: [
      "A) Camada Física",
      "B) Camada de Enlace de Dados",
      "C) Camada de Rede",
      "D) Camada de Transporte"
    ],
    correta: 1
  }
];

window.questoes = questoes;