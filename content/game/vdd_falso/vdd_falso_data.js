/* ============================================================
   NEXUS STUDY — games/conteudo/vdd_falso/vdd_falso_data.js

   Banco de perguntas de Verdadeiro ou Falso por disciplina.
   Estrutura:
     {
       [discId]: [
         { enunciado: string, resposta: true|false, explicacao: string }
       ]
     }
   ============================================================ */

export const VDD_FALSO_DATA = {

  /* ── POO — Programação Orientada a Objetos ── */
  poo: [
    {
      enunciado: "Em Java, uma classe abstrata pode ser instanciada diretamente.",
      resposta: false,
      explicacao: "Classes abstratas não podem ser instanciadas. Elas servem como modelo para subclasses."
    },
    {
      enunciado: "Herança é um dos quatro pilares da Programação Orientada a Objetos.",
      resposta: true,
      explicacao: "Os quatro pilares são: Abstração, Encapsulamento, Herança e Polimorfismo."
    },
    {
      enunciado: "Em Java, uma interface pode ter métodos com implementação usando a palavra-chave 'default'.",
      resposta: true,
      explicacao: "Desde o Java 8, interfaces podem ter métodos default com implementação."
    },
    {
      enunciado: "O encapsulamento impede que os atributos de uma classe sejam acessados de qualquer forma externa.",
      resposta: false,
      explicacao: "O encapsulamento controla o acesso, mas métodos getters e setters permitem acesso controlado."
    },
    {
      enunciado: "Polimorfismo permite que objetos de classes diferentes respondam ao mesmo método de formas distintas.",
      resposta: true,
      explicacao: "Esse é exatamente o conceito de polimorfismo — mesmo método, comportamentos diferentes."
    },
    {
      enunciado: "Em Java, uma classe pode herdar de múltiplas classes simultaneamente.",
      resposta: false,
      explicacao: "Java não suporta herança múltipla de classes. Usa-se interfaces para isso."
    },
    {
      enunciado: "O construtor de uma classe é chamado automaticamente quando o objeto é criado.",
      resposta: true,
      explicacao: "O construtor é invocado no momento do 'new', inicializando o objeto."
    },
    {
      enunciado: "Um método estático pode acessar atributos de instância diretamente.",
      resposta: false,
      explicacao: "Métodos estáticos pertencem à classe, não à instância, e não podem acessar atributos de instância diretamente."
    },
  ],

  /* ── BD — Banco de Dados ── */
  bd: [
    {
      enunciado: "SQL significa Structured Query Language.",
      resposta: true,
      explicacao: "SQL é a linguagem padrão para gerenciar e consultar bancos de dados relacionais."
    },
    {
      enunciado: "A chave primária pode conter valores nulos.",
      resposta: false,
      explicacao: "A chave primária não aceita NULL e deve ser única para cada registro."
    },
    {
      enunciado: "O comando SELECT é usado para inserir dados em uma tabela.",
      resposta: false,
      explicacao: "SELECT é usado para consultar dados. Para inserir, usa-se INSERT INTO."
    },
    {
      enunciado: "Uma chave estrangeira cria um vínculo entre duas tabelas.",
      resposta: true,
      explicacao: "A chave estrangeira referencia a chave primária de outra tabela, garantindo integridade referencial."
    },
    {
      enunciado: "O comando DROP TABLE apaga apenas os dados da tabela, mantendo sua estrutura.",
      resposta: false,
      explicacao: "DROP TABLE remove completamente a tabela e todos os seus dados. Para só apagar dados, usa-se DELETE ou TRUNCATE."
    },
    {
      enunciado: "Um índice em banco de dados pode melhorar o desempenho de consultas.",
      resposta: true,
      explicacao: "Índices aceleram a busca de registros, funcionando como o índice de um livro."
    },
    {
      enunciado: "JOIN é usado para combinar registros de duas ou mais tabelas.",
      resposta: true,
      explicacao: "O JOIN une tabelas com base em uma condição, geralmente uma chave em comum."
    },
    {
      enunciado: "NoSQL significa 'Not Only SQL' e sempre é mais rápido que bancos relacionais.",
      resposta: false,
      explicacao: "NoSQL significa 'Not Only SQL', mas desempenho depende do caso de uso — não é sempre mais rápido."
    },
  ],

  /* ── Design — Design de Interfaces ── */
  design: [
    {
      enunciado: "UX e UI Design são exatamente a mesma coisa.",
      resposta: false,
      explicacao: "UX (User Experience) foca na experiência geral do usuário. UI (User Interface) foca na aparência visual da interface."
    },
    {
      enunciado: "Um wireframe é uma representação visual de baixa fidelidade de uma interface.",
      resposta: true,
      explicacao: "Wireframes são esboços esquemáticos usados para estruturar o layout antes do design final."
    },
    {
      enunciado: "A regra dos terços é um princípio utilizado apenas em fotografia, não em design de interfaces.",
      resposta: false,
      explicacao: "A regra dos terços também é aplicada em design para criar composições visualmente equilibradas."
    },
    {
      enunciado: "Contraste é um dos princípios fundamentais do design visual.",
      resposta: true,
      explicacao: "Contraste, repetição, alinhamento e proximidade formam os princípios CRAP do design."
    },
    {
      enunciado: "O modelo de cores RGB é utilizado para impressão.",
      resposta: false,
      explicacao: "RGB é para telas digitais. Para impressão usa-se CMYK."
    },
    {
      enunciado: "Acessibilidade em design garante que pessoas com deficiência possam usar o produto.",
      resposta: true,
      explicacao: "Design acessível inclui contraste adequado, texto alternativo em imagens e navegação por teclado."
    },
  ],

  /* ── Redes — Redes de Computadores ── */
  redes: [
    {
      enunciado: "O protocolo HTTP opera na camada de aplicação do modelo OSI.",
      resposta: true,
      explicacao: "HTTP está na camada 7 (Aplicação) do modelo OSI."
    },
    {
      enunciado: "Um endereço IP versão 4 possui 128 bits.",
      resposta: false,
      explicacao: "IPv4 possui 32 bits. IPv6 é que possui 128 bits."
    },
    {
      enunciado: "DNS converte nomes de domínio em endereços IP.",
      resposta: true,
      explicacao: "O DNS (Domain Name System) é como a 'agenda telefônica' da internet."
    },
    {
      enunciado: "TCP garante a entrega dos pacotes, enquanto UDP não garante.",
      resposta: true,
      explicacao: "TCP é orientado à conexão e confiável. UDP é mais rápido mas sem garantia de entrega."
    },
    {
      enunciado: "Um roteador opera apenas na camada física do modelo OSI.",
      resposta: false,
      explicacao: "Roteadores operam na camada de rede (camada 3) do modelo OSI."
    },
  ],

};