// ============================================================
// NEXUS STUDY — quiz/conteudo/poo.js
// Questões de Programação Orientada a Objetos (POO)
// Estrutura: window.questoes[tipo] → array de questões
// Tipos disponíveis: 'questoes', 'ava'
// ============================================================

window.questoes = {

  /* ── QUESTÕES PRÁTICAS ──────────────────────────────── */
  questoes: [
    {
      pergunta: "O que é uma classe em Programação Orientada a Objetos?",
      alternativas: [
        "A) Um objeto já instanciado no sistema",
        "B) Um modelo que define atributos e comportamentos de objetos",
        "C) Um método responsável por executar ações",
        "D) Um tipo de variável global"
      ],
      correta: 1
    },
    {
      pergunta: "O que é um objeto em POO?",
      alternativas: [
        "A) Uma função que executa ações específicas",
        "B) Um molde para criar classes",
        "C) Uma instância de uma classe",
        "D) Um tipo de banco de dados"
      ],
      correta: 2
    },
    {
      pergunta: "Qual conceito da POO permite reutilizar código de outra classe?",
      alternativas: [
        "A) Encapsulamento",
        "B) Polimorfismo",
        "C) Herança",
        "D) Abstração"
      ],
      correta: 2
    },
    {
      pergunta: "O que é encapsulamento?",
      alternativas: [
        "A) Tornar todos os atributos públicos",
        "B) Ocultar detalhes internos e expor apenas o necessário",
        "C) Criar várias classes iguais",
        "D) Executar múltiplos métodos ao mesmo tempo"
      ],
      correta: 1
    },
    {
      pergunta: "O que é polimorfismo?",
      alternativas: [
        "A) Capacidade de um método ter diferentes comportamentos",
        "B) Capacidade de criar múltiplas classes iguais",
        "C) Processo de esconder atributos",
        "D) Uso de variáveis globais em classes"
      ],
      correta: 0
    },
    {
      pergunta: "O que é um construtor em uma classe?",
      alternativas: [
        "A) Um método que destrói objetos",
        "B) Um método chamado automaticamente ao criar um objeto",
        "C) Um atributo fixo da classe",
        "D) Um tipo de variável especial"
      ],
      correta: 1
    },
    {
      pergunta: "Qual das opções representa corretamente um exemplo de herança?",
      alternativas: [
        "A) Uma classe Carro copiando código manualmente de outra",
        "B) Uma classe Animal sendo usada como variável",
        "C) Uma classe Cachorro que herda de Animal",
        "D) Um objeto sendo criado dentro de outro"
      ],
      correta: 2
    },
    {
      pergunta: "O que é abstração em POO?",
      alternativas: [
        "A) Expor todos os detalhes do sistema",
        "B) Representar apenas os aspectos essenciais de um objeto",
        "C) Criar objetos automaticamente",
        "D) Executar código sem classe"
      ],
      correta: 1
    }
  ],

  /* ── QUESTÕES AVA ───────────────────────────────────── */
  ava: [
    {
      pergunta: "Em POO, qual modificador de acesso torna um atributo acessível apenas dentro da própria classe?",
      alternativas: [
        "A) public",
        "B) protected",
        "C) private",
        "D) static"
      ],
      correta: 2
    },
    {
      pergunta: "Qual palavra-chave é usada em Java para indicar herança?",
      alternativas: [
        "A) implements",
        "B) extends",
        "C) inherits",
        "D) super"
      ],
      correta: 1
    },
    {
      pergunta: "O que é uma interface em POO?",
      alternativas: [
        "A) Uma classe que já possui implementação completa",
        "B) Um contrato que define métodos que uma classe deve implementar",
        "C) Um tipo especial de atributo",
        "D) Um objeto sem classe definida"
      ],
      correta: 1
    },
    {
      pergunta: "Qual princípio da POO está sendo aplicado quando ocultamos a complexidade interna de um objeto?",
      alternativas: [
        "A) Herança",
        "B) Polimorfismo",
        "C) Encapsulamento",
        "D) Instanciação"
      ],
      correta: 2
    },
    {
      pergunta: "O que é sobrescrita (override) de método?",
      alternativas: [
        "A) Criar um método com o mesmo nome mas parâmetros diferentes na mesma classe",
        "B) Redefinir na subclasse um método herdado da superclasse",
        "C) Chamar o construtor da classe pai",
        "D) Tornar um método privado na subclasse"
      ],
      correta: 1
    }
  ]

  // ← Para adicionar novo tipo no futuro, basta acrescentar aqui:
  // simulado: [ ... ]
  // revisao:  [ ... ]
};