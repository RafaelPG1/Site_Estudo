// ============================================================
// NEXUS STUDY — quiz/conteudo/2026/2026.2/poo.js
// Questões de Programação Orientada a Objetos (POO)
// Formato v1: question, options, answer, feedback, code, etc.
// ============================================================

window.questoes = {

  /* ── QUESTÕES PRÁTICAS ──────────────────────────────── */
  questoes: [
    {
      question: "O que será exibido em `p.nome`?",
      code:
`class Pessoa {
  constructor(nome) {
    this.nome = nome;
  }
}

const p = new Pessoa("Ana");`,
      options: [
        "undefined",
        "Ana",
        "Pessoa",
        "Erro"
      ],
      answer: 1,
      feedback: "O construtor define o atributo nome como 'Ana'."
    },
    {
      question: "O que é um objeto em POO?",
      options: [
        "Uma função que executa ações específicas",
        "Um molde para criar classes",
        "Uma instância de uma classe",
        "Um tipo de banco de dados"
      ],
      answer: 2,
      feedback: "Objeto é uma instância de uma classe, ou seja, algo criado a partir dela."
    },
    {
      question: "Qual conceito da POO permite reutilizar código de outra classe?",
      options: [
        "Encapsulamento",
        "Polimorfismo",
        "Herança",
        "Abstração"
      ],
      answer: 2,
      feedback: "Herança permite que uma classe reutilize características de outra."
    },
    {
      question: "O que é encapsulamento?",
      options: [
        "Tornar todos os atributos públicos",
        "Ocultar detalhes internos e expor apenas o necessário",
        "Criar várias classes iguais",
        "Executar múltiplos métodos ao mesmo tempo"
      ],
      answer: 1,
      feedback: "Encapsulamento protege os dados e controla o acesso."
    },
    {
      question: "O que é polimorfismo?",
      options: [
        "Capacidade de um método ter diferentes comportamentos",
        "Capacidade de criar múltiplas classes iguais",
        "Processo de esconder atributos",
        "Uso de variáveis globais em classes"
      ],
      answer: 0,
      feedback: "Polimorfismo permite que o mesmo método tenha comportamentos diferentes."
    },
    {
      question: "O que é um construtor em uma classe?",
      options: [
        "Um método que destrói objetos",
        "Um método chamado automaticamente ao criar um objeto",
        "Um atributo fixo da classe",
        "Um tipo de variável especial"
      ],
      answer: 1,
      feedback: "Construtor é executado automaticamente na criação do objeto."
    },
    {
      question: "Qual das opções representa corretamente um exemplo de herança?",
      options: [
        "Uma classe Carro copiando código manualmente de outra",
        "Uma classe Animal sendo usada como variável",
        "Uma classe Cachorro que herda de Animal",
        "Um objeto sendo criado dentro de outro"
      ],
      answer: 2,
      feedback: "Herança ocorre quando uma classe filha deriva de uma classe pai."
    },
    {
      question: "O que é abstração em POO?",
      options: [
        "Expor todos os detalhes do sistema",
        "Representar apenas os aspectos essenciais de um objeto",
        "Criar objetos automaticamente",
        "Executar código sem classe"
      ],
      answer: 1,
      feedback: "Abstração foca apenas no que é relevante, escondendo complexidade."
    }
  ],

  /* ── QUESTÕES AVA ───────────────────────────────────── */
  ava: [
    {
      question: "Em POO, qual modificador de acesso torna um atributo acessível apenas dentro da própria classe?",
      options: [
        "public",
        "protected",
        "private",
        "static"
      ],
      answer: 2,
      feedback: "O modificador `private` restringe o acesso à própria classe."
    },
    {
      question: "Qual palavra-chave é usada em Java para indicar herança?",
      options: [
        "implements",
        "extends",
        "inherits",
        "super"
      ],
      answer: 1,
      feedback: "A palavra-chave `extends` indica herança em Java."
    },
    {
      question: "O que é uma interface em POO?",
      options: [
        "Uma classe que já possui implementação completa",
        "Um contrato que define métodos que uma classe deve implementar",
        "Um tipo especial de atributo",
        "Um objeto sem classe definida"
      ],
      answer: 1,
      feedback: "Interface define regras que as classes devem seguir."
    },
    {
      question: "Qual princípio da POO está sendo aplicado quando ocultamos a complexidade interna de um objeto?",
      options: [
        "Herança",
        "Polimorfismo",
        "Encapsulamento",
        "Instanciação"
      ],
      answer: 2,
      feedback: "Encapsulamento esconde detalhes internos e protege os dados."
    },
    {
      question: "O que é sobrescrita (`override`) de método?",
      options: [
        "Criar um método com o mesmo nome mas parâmetros diferentes na mesma classe",
        "Redefinir na subclasse um método herdado da superclasse",
        "Chamar o construtor da classe pai",
        "Tornar um método privado na subclasse"
      ],
      answer: 1,
      feedback: "Override permite alterar o comportamento de um método herdado."
    }
  ]

};