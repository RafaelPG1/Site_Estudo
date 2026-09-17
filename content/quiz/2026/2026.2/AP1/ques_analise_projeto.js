// ============================================================
// NEXUS STUDY — quiz/conteudo/2026.2/AP1/ques_analise_projeto.js
// ============================================================
window.questoes = {

  // Questões de Banco de dados 
questoes: [
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Explicativa",
    texto: "No desenvolvimento de sistemas, dois momentos são complementares, mas não se confundem. A análise se preocupa em entender o problema: conversar com quem vai usar o sistema, levantar necessidades e descobrir o que precisa ser feito. Já a modelagem entra depois, para representar essa solução de forma visual e estruturada, geralmente usando diagramas.",
    question: "Com base na diferença explicada acima, qual das alternativas resume corretamente o papel de cada etapa?",
    options: [
      "Análise define o que o sistema deve fazer; modelagem mostra como o sistema deve fazer",
      "Análise e modelagem são a mesma etapa, apenas com nomes diferentes",
      "Modelagem vem antes da análise, pois define os requisitos do sistema",
      "Análise é feita apenas por programadores, e modelagem apenas por clientes"
    ],
    answer: 0,
    feedback: "==def==Análise== = o quê; ==def==Modelagem== = como. Essa dupla é a base de toda a disciplina, por isso costuma aparecer bastante em prova."
  },
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Explicativa",
    texto: "Imagine que você quer criar vários carros em um sistema. Em vez de descrever cada carro do zero, você cria um molde que define quais características (cor, modelo, velocidade) e comportamentos (acelerar, frear) todo carro terá. Esse molde é a classe. Quando você usa esse molde para criar um carro específico, com valores próprios, você tem um objeto.",
    question: "Seguindo a lógica do texto acima, o que representa um objeto em relação a uma classe?",
    options: [
      "Um objeto é uma cópia do código-fonte da classe",
      "Um objeto é uma instância concreta criada a partir da definição de uma classe",
      "Um objeto é a versão simplificada de uma classe, sem atributos",
      "Um objeto define os métodos que a classe poderá usar no futuro"
    ],
    answer: 1,
    feedback: "==term==Classe== é a definição/modelo; ==term==Objeto== é a instância concreta daquela definição, com valores próprios para os atributos."
  },
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Explicativa",
    texto: "Pense em um caixa eletrônico: você não tem acesso direto ao dinheiro guardado no cofre do banco, apenas a operações controladas, como sacar ou consultar saldo. Na orientação a objetos, esse mesmo princípio é aplicado para proteger os dados internos de um objeto, controlando como e quando eles podem ser acessados ou alterados por outras partes do sistema.",
    question: "O princípio descrito no texto, que controla o acesso aos dados e métodos de um objeto, é chamado de:",
    options: [
      "Herança",
      "Polimorfismo",
      "Encapsulamento",
      "Abstração"
    ],
    answer: 2,
    feedback: "==def==Encapsulamento== é justamente isso: proteger e controlar o acesso aos detalhes internos de um objeto, evitando modificações indevidas."
  },
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Contextualizada",
    texto: "Antes de qualquer linha de código ser escrita, o desenvolvimento de software passa por um processo organizado em fases. Tudo começa conversando com o cliente para entender suas necessidades — essa é a fase de levantamento de requisitos. Depois vem o planejamento, que define objetivos e riscos, seguido do design, que estrutura a arquitetura do sistema. Só então ocorre o desenvolvimento (codificação), e por fim, teste e implantação garantem que tudo funcione como esperado.",
    question: "De acordo com a sequência apresentada, qual é a fase responsável por identificar as necessidades do cliente e o propósito do software?",
    options: [
      "Design",
      "Levantamento de requisitos",
      "Teste",
      "Implantação"
    ],
    answer: 1,
    feedback: "O ==proc==levantamento de requisitos== é a etapa inicial, em que se conversa com o cliente para entender necessidades, propósito e funcionalidades desejadas do software."
  },
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Contextualizada",
    texto: "Existem diferentes formas de modelar um sistema, e duas delas são bastante parecidas à primeira vista, mas com focos distintos. A modelagem funcional divide o sistema em funções e processos menores, facilitando manutenção — é o caso de técnicas como o IDEF0. Já a modelagem baseada em processos vai um pouco além: ela se preocupa em definir, projetar e analisar o fluxo de trabalho como um todo, ajudando a identificar problemas e propor soluções.",
    question: "Considerando as diferenças explicadas, qual é o principal foco da modelagem baseada em processos?",
    options: [
      "Representar apenas os dados armazenados no sistema",
      "Definir, projetar e analisar o fluxo de trabalho de sistemas complexos",
      "Substituir totalmente a necessidade de levantamento de requisitos",
      "Descrever matematicamente o comportamento do sistema"
    ],
    answer: 1,
    feedback: "A ==term==modelagem baseada em processos== enfatiza a modularização do fluxo de trabalho, ajudando a compreender, identificar problemas e criar soluções para processos complexos."
  },
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Contextualizada",
    texto: "Em sistemas críticos, como softwares hospitalares ou de controle aéreo, um pequeno erro pode ter consequências graves. Por isso, existe a modelagem formal, que usa lógica matemática para descrever com precisão como um sistema deve se comportar, aumentando a confiança de que ele realmente segue sua especificação. Um exemplo citado no material são as Redes de Petri, usadas para representar estados e atividades de um fluxo de forma visual e rigorosa.",
    question: "Por que a modelagem formal é especialmente indicada para componentes críticos de um sistema?",
    options: [
      "Porque é mais rápida de aplicar do que outros tipos de modelagem",
      "Porque usa lógica matemática, aumentando a precisão e a confiança na especificação",
      "Porque dispensa a necessidade de diagramas e representações visuais",
      "Porque é o único tipo de modelagem compatível com UML"
    ],
    answer: 1,
    feedback: "A ==term==modelagem formal== usa lógica formal/matemática para descrever o comportamento do sistema, sendo indicada quando se exige maior precisão, como em componentes críticos."
  },
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Aplicação",
    texto: "Imagine que um sistema de gestão hospitalar tem uma classe genérica chamada Funcionário, com atributos como nome e salário, e um método chamado registrarPonto(). Agora, o sistema precisa criar uma classe Médico, que também tem nome, salário e registra ponto, mas possui características extras, como especialidade e horário de plantão.",
    question: "Nesse cenário, qual conceito da orientação a objetos permite que a classe Médico reaproveite nome, salário e registrarPonto() da classe Funcionário, adicionando suas próprias características?",
    options: [
      "Encapsulamento",
      "Herança",
      "Abstração",
      "Modularidade"
    ],
    answer: 1,
    feedback: "A ==term==herança== permite que uma classe reaproveite características e comportamentos de outra, podendo ainda adicionar ou modificar o que foi herdado — exatamente o caso de Médico herdando de Funcionário."
  },
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Aplicação",
    texto: "Em um sistema de folha de pagamento, existem diferentes tipos de funcionário: horista, mensalista e comissionado. Todos possuem um método chamado calcularSalario(), mas cada um calcula o valor de forma diferente, dependendo do tipo de contrato. Ainda assim, o sistema consegue chamar calcularSalario() da mesma forma para qualquer funcionário, sem precisar saber o tipo específico antes.",
    question: "Esse comportamento, em que operações com o mesmo nome se comportam de formas diferentes dependendo do objeto, é um exemplo de:",
    options: [
      "Herança",
      "Encapsulamento",
      "Polimorfismo",
      "Modelagem estruturada"
    ],
    answer: 2,
    feedback: "==term==Polimorfismo== permite que diferentes objetos respondam de forma distinta a uma mesma operação, tornando o sistema mais flexível e independente de tipos específicos."
  },
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Aplicação",
    texto: "Ao usar o aplicativo de um banco, você só enxerga botões como 'Transferir' ou 'Consultar saldo'. Você não precisa saber como o sistema calcula juros, valida contas ou se conecta ao banco de dados por trás — tudo isso fica escondido, e você interage apenas com o que é essencial para realizar sua tarefa.",
    question: "Esse exemplo, em que apenas o essencial é exposto ao usuário e os detalhes internos ficam ocultos, ilustra qual conceito da orientação a objetos?",
    options: [
      "Herança",
      "Abstração",
      "Polimorfismo",
      "Modelagem funcional"
    ],
    answer: 1,
    feedback: "==term==Abstração== simplifica e generaliza um problema, escondendo detalhes desnecessários e mostrando apenas o que é relevante para quem utiliza o sistema."
  },
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Contextualizada",
    texto: "Ao modelar um sistema orientado a objetos, é comum representar visualmente classes, seus atributos, métodos e relacionamentos entre si. Para isso, existe um padrão amplamente adotado chamado UML (Unified Modeling Language), que ajuda equipes a se comunicarem melhor sobre a estrutura do sistema. Além de facilitar a comunicação, a orientação a objetos também traz vantagens como modularidade e reutilização de código, tornando o software mais fácil de manter e alterar.",
    question: "Qual é o padrão citado no texto, amplamente utilizado para representar visualmente sistemas orientados a objetos?",
    options: [
      "IDEF0",
      "Redes de Petri",
      "UML (Unified Modeling Language)",
      "Diagrama de Blocos de Fluxo Funcional"
    ],
    answer: 2,
    feedback: "A ==term==UML== é o padrão destacado no material para modelagem de sistemas orientados a objetos, representando classes, objetos e seus relacionamentos de forma visual."
  },
  {
    aula: "Aula 2 — Conceitos Iniciais",
    tipo: "Explicativa",
    texto: "Todo software passa por um caminho parecido com o de um produto: nasce de uma ideia, é planejado, construído, testado, colocado em uso e depois precisa de ajustes até ser descontinuado. Esse caminho completo, organizado em fases, é chamado de ciclo de vida do software, e ajuda a equipe a controlar prazos, custos e riscos do projeto.",
    question: "Com base no texto, o que representa o ciclo de vida do software?",
    options: [
      "Apenas a fase de codificação do sistema",
      "O conjunto de fases que o software percorre desde a concepção até a manutenção/descontinuação",
      "Um tipo específico de teste realizado antes da implantação",
      "A documentação final entregue ao cliente"
    ],
    answer: 1,
    feedback: "O ==def==ciclo de vida== organiza o software desde sua concepção até a manutenção, passando por planejamento, análise, projeto, desenvolvimento, testes e implantação."
  },
  {
    aula: "Aula 2 — Conceitos Iniciais",
    tipo: "Explicativa",
    texto: "Imagine um projeto em que cada etapa só pode começar depois que a anterior termina completamente, como uma fila de dominós caindo em sequência. Assim funciona o Modelo em Cascata, formalizado por Royce em 1970: primeiro se define os requisitos, depois o projeto, depois a implementação, e assim por diante, sem voltar facilmente para etapas já concluídas.",
    question: "Qual característica principal define o Modelo em Cascata, segundo o texto?",
    options: [
      "As fases ocorrem em paralelo, ao mesmo tempo",
      "Uma fase só começa quando a anterior termina, seguindo uma sequência linear",
      "O sistema é entregue em pequenos módulos independentes",
      "O foco está exclusivamente na análise de riscos"
    ],
    answer: 1,
    feedback: "O ==term==Cascata== é um modelo linear e sequencial, adequado para projetos com requisitos bem definidos e estáveis, como sistemas de controle de tráfego aéreo."
  },
  {
    aula: "Aula 2 — Conceitos Iniciais",
    tipo: "Explicativa",
    texto: "Em vez de entregar o sistema inteiro de uma só vez, algumas equipes preferem dividi-lo em módulos menores, desenvolver e entregar cada um separadamente. Um sistema de gestão empresarial, por exemplo, pode ter os módulos de contabilidade, recursos humanos e estoque entregues aos poucos, cada um passando por todas as fases do ciclo de vida antes de ser liberado.",
    question: "O texto descreve o funcionamento de qual modelo de ciclo de vida?",
    options: [
      "Modelo em Cascata",
      "Modelo Incremental",
      "Modelo Espiral",
      "RUP"
    ],
    answer: 1,
    feedback: "No ==term==Modelo Incremental==, os requisitos são agrupados em módulos, desenvolvidos individualmente e entregues progressivamente, aumentando a funcionalidade do sistema aos poucos."
  },
  {
    aula: "Aula 2 — Conceitos Iniciais",
    tipo: "Contextualizada",
    texto: "Algumas startups precisam colocar um produto no mercado rapidamente, sem esperar meses por um ciclo de desenvolvimento completo. Para esses casos, existe o RAD (Rapid Application Development), formalizado por James Martin em 1991, que aposta em ciclos muito curtos — geralmente entre 60 e 90 dias — combinando desenvolvimento iterativo e incremental para acelerar a entrega.",
    question: "Qual é a principal característica que diferencia o RAD dos demais modelos apresentados no texto?",
    options: [
      "A ausência total de testes durante o desenvolvimento",
      "Ciclos de desenvolvimento muito curtos, com foco em entrega rápida",
      "A exigência de que todos os requisitos estejam definidos antes de começar",
      "O uso exclusivo de lógica formal para validar o sistema"
    ],
    answer: 1,
    feedback: "O ==key==RAD== enfatiza rapidez, com ciclos comprimidos (geralmente 60 a 90 dias), sendo indicado para projetos que precisam de entrega ágil, como protótipos para startups."
  },
  {
    aula: "Aula 2 — Conceitos Iniciais",
    tipo: "Contextualizada",
    texto: "Às vezes, o cliente não sabe exatamente descrever o que quer até ver algo na tela. Para esses casos, é comum construir uma versão inicial e simplificada do software — um protótipo — que ajuda a captar, esclarecer e refinar os requisitos antes de investir no desenvolvimento completo. Essa prática pode ser usada como um modelo de ciclo de vida próprio ou como uma técnica dentro de outros modelos.",
    question: "De acordo com o texto, qual é o principal objetivo da prototipagem?",
    options: [
      "Substituir totalmente a fase de testes do sistema",
      "Captar, esclarecer e refinar os requisitos por meio de uma versão inicial do software",
      "Garantir que o sistema final seja entregue em módulos separados",
      "Analisar riscos técnicos antes de iniciar o planejamento"
    ],
    answer: 1,
    feedback: "A ==term==Prototipagem== serve para criar uma versão inicial do software que ajuda a entender melhor os requisitos, podendo ser usada isoladamente ou combinada com outros modelos."
  },
  {
    aula: "Aula 2 — Conceitos Iniciais",
    tipo: "Contextualizada",
    texto: "Em projetos de alto risco, como sistemas de defesa, é essencial reavaliar constantemente os perigos envolvidos antes de seguir em frente. O Modelo Espiral, proposto por Boehm em 1988, atende a essa necessidade: a cada volta da espiral, a equipe define objetivos, analisa riscos, desenvolve uma parte do sistema e planeja a próxima fase, repetindo esse ciclo continuamente.",
    question: "O que torna o Modelo Espiral especialmente indicado para projetos de alto risco, segundo o texto?",
    options: [
      "Ele elimina totalmente a necessidade de testes",
      "Ele dá grande importância à análise de riscos em cada ciclo repetido",
      "Ele exige que todos os requisitos sejam definidos logo no início",
      "Ele combina apenas técnicas de prototipagem, sem etapas de planejamento"
    ],
    answer: 1,
    feedback: "O ==term==Espiral== combina elementos de Cascata e Prototipagem, mas se destaca por repetir ciclos de análise de riscos continuamente, o que é essencial em projetos críticos como sistemas de defesa."
  },
  {
    aula: "Aula 2 — Conceitos Iniciais",
    tipo: "Explicativa",
    texto: "Grandes sistemas corporativos, com alta complexidade e necessidade de documentação detalhada, costumam usar um modelo desenvolvido pela Rational Software Corporation (depois adquirida pela IBM): o RUP (Rational Unified Process). Ele é iterativo, incremental, orientado a casos de uso e organizado em quatro grandes fases: Concepção, Elaboração, Construção e Transição.",
    question: "Quais são as quatro fases que compõem o RUP, de acordo com o texto?",
    options: [
      "Planejamento, Análise, Projeto e Teste",
      "Concepção, Elaboração, Construção e Transição",
      "Requisitos, Design, Codificação e Manutenção",
      "Análise de riscos, Prototipagem, Entrega e Feedback"
    ],
    answer: 1,
    feedback: "O ==term==RUP== é dividido em quatro fases — Concepção, Elaboração, Construção e Transição — sendo indicado para grandes sistemas corporativos que exigem estrutura configurável e documentação detalhada."
  },
  {
    aula: "Aula 2 — Conceitos Iniciais",
    tipo: "Aplicação",
    texto: "A equipe de um CRM acabou de adicionar uma nova funcionalidade de relatórios ao sistema. Antes de liberar essa atualização para os clientes, o time decide verificar se as funcionalidades antigas, como o gerenciamento de contatos e o rastreamento de vendas, continuam funcionando normalmente após a mudança.",
    question: "Esse tipo de verificação, que confirma se uma nova alteração não quebrou funcionalidades que já funcionavam antes, é chamado de:",
    options: [
      "Teste de usabilidade",
      "Teste de desempenho",
      "Teste de regressão",
      "Teste de segurança"
    ],
    answer: 2,
    feedback: "O ==proc==teste de regressão== verifica se funcionalidades já existentes continuam funcionando corretamente depois que uma mudança ou nova funcionalidade foi adicionada ao sistema."
  },
  {
    aula: "Aula 2 — Conceitos Iniciais",
    tipo: "Aplicação",
    texto: "Um site de comércio eletrônico está se preparando para a Black Friday, período em que milhares de usuários acessam a plataforma ao mesmo tempo para comprar produtos com desconto. Antes da data, a equipe técnica simula esse grande volume de acessos simultâneos para verificar se o site consegue manter um tempo de resposta aceitável sem travar.",
    question: "Esse tipo de verificação, que avalia o comportamento do sistema sob diferentes condições de carga, é conhecido como:",
    options: [
      "Teste funcional",
      "Teste de desempenho",
      "Teste de comportamento",
      "Teste de regressão"
    ],
    answer: 1,
    feedback: "Os ==proc==testes de desempenho== avaliam aspectos como tempo de resposta, throughput e utilização de recursos, sendo essenciais para garantir que o sistema suporte picos de acesso, como na Black Friday."
  },
  {
    aula: "Aula 2 — Conceitos Iniciais",
    tipo: "Aplicação",
    texto: "Uma cadeia de supermercados está prestes a colocar em funcionamento um novo sistema de gerenciamento de inventário. A equipe configura os servidores, instala o sistema nos pontos de venda e transfere os dados do sistema antigo para o novo. Depois que tudo está funcionando, ainda serão necessárias correções de bugs e a adição de novas funcionalidades com base no uso real dos funcionários.",
    question: "As duas fases do ciclo de vida descritas no cenário, respectivamente, são:",
    options: [
      "Planejamento e Análise de requisitos",
      "Design e Desenvolvimento",
      "Implantação e Manutenção",
      "Testes e Implantação"
    ],
    answer: 2,
    feedback: "A ==term==Implantação== envolve instalar o software em produção e migrar dados, enquanto a ==term==Manutenção==, que ocorre depois, trata de correções de bugs e melhorias com base no feedback dos usuários."
  },
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Explicativa",
    texto: "Antes de detalhar cada modelo específico, é útil entender três grandes famílias de abordagens de desenvolvimento. Os modelos tradicionais seguem uma linha reta, do início ao fim, com foco em planejamento e controle. Os modelos iterativos trabalham em ciclos repetidos, priorizando adaptabilidade e feedback. Já os modelos incrementais combinam um pouco de estrutura com entregas graduais de funcionalidades.",
    question: "Segundo o texto, qual é o foco principal dos Modelos Tradicionais?",
    options: [
      "Adaptabilidade e feedback contínuo",
      "Planejamento e controle",
      "Entrega gradual de incrementos",
      "Ciclos repetitivos de revisão"
    ],
    answer: 1,
    feedback: "Os ==term==Modelos Tradicionais== têm como foco principal o planejamento e o controle, sendo exemplificados pelo Cascata e pelo Espiral, indicados para requisitos estáveis e ambientes controlados."
  },
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Explicativa",
    texto: "O Modelo Cascata, também conhecido como Modelo Linear Sequencial, organiza o desenvolvimento em etapas que seguem uma ordem fixa: primeiro se definem os requisitos, depois vem o projeto do sistema, em seguida a implementação e teste unitário, depois a integração e teste de sistema, e por fim a operação e manutenção. Cada etapa só avança para a próxima quando a anterior está concluída.",
    question: "Qual é a sequência correta das etapas do Modelo Cascata, de acordo com o texto?",
    options: [
      "Projeto → Requisitos → Implementação → Manutenção → Testes",
      "Definição de Requisitos → Projeto de Sistema e Software → Implementação e Teste Unitário → Integração e Teste de Sistema → Operação e Manutenção",
      "Planejamento → Design → Implementação → Testes → Integração",
      "Análise → Design → Implementação → Testes → Integração"
    ],
    answer: 1,
    feedback: "O ==term==Modelo Cascata== segue uma sequência fixa e linear, começando pela definição de requisitos e terminando na operação e manutenção do sistema."
  },
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Contextualizada",
    texto: "Uma empresa está desenvolvendo um sistema embarcado para um eletrodoméstico. Os requisitos desse tipo de sistema costumam ser bem definidos desde o início e raramente mudam depois de estabelecidos. Além disso, o ambiente de desenvolvimento é controlado, e há prazos e orçamentos rígidos a serem cumpridos.",
    question: "Considerando as características do cenário descrito, qual modelo tradicional seria mais indicado, segundo o texto?",
    options: [
      "Modelo Espiral, pela análise contínua de riscos",
      "Modelo Cascata, por lidar bem com requisitos estáveis e ambientes controlados",
      "Modelo Incremental, pela entrega gradual de funcionalidades",
      "RUP, pela flexibilidade e ciclos de revisão"
    ],
    answer: 1,
    feedback: "O ==key==Modelo Cascata== é indicado quando os requisitos são bem definidos e estáveis, o ambiente é controlado e existem prazos e orçamentos rígidos — exatamente o caso de sistemas embarcados."
  },
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Contextualizada",
    texto: "Um dos pontos fortes do Modelo Cascata é que, por seguir etapas bem definidas, ele naturalmente incentiva a produção de documentação detalhada em cada fase. Essa documentação pode ser usada depois para orientar futuras modificações, apoiar a manutenção do sistema, treinar novos membros da equipe e melhorar a comunicação entre todos os envolvidos no projeto.",
    question: "De acordo com o texto, qual é a principal utilidade da documentação detalhada produzida no Modelo Cascata?",
    options: [
      "Substituir a necessidade de testes no sistema",
      "Servir como referência para modificações futuras, manutenção, treinamento e comunicação",
      "Eliminar a necessidade de levantamento de requisitos em projetos futuros",
      "Garantir que o cliente não precise ser consultado durante o desenvolvimento"
    ],
    answer: 1,
    feedback: "A documentação detalhada do Cascata serve como referência valiosa para modificações futuras, manutenção do sistema, treinamento de equipes e comunicação entre os envolvidos no projeto."
  },
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Contextualizada",
    texto: "Apesar de suas vantagens, o Modelo Cascata tem uma limitação importante: como as etapas seguem uma ordem rígida, fica difícil incorporar mudanças nos requisitos depois que o projeto já avançou. Se uma alteração significativa for necessária em uma fase avançada, isso pode gerar retrabalho, aumento de custos e atrasos no cronograma.",
    question: "Qual é a principal desvantagem do Modelo Cascata destacada no texto?",
    options: [
      "A falta de documentação ao longo do processo",
      "A dificuldade de incorporar mudanças nos requisitos, especialmente em fases avançadas",
      "A impossibilidade de definir prazos e orçamentos",
      "O excesso de envolvimento do cliente durante o desenvolvimento"
    ],
    answer: 1,
    feedback: "A estrutura sequencial e rígida do Cascata dificulta mudanças tardias nos requisitos, podendo provocar retrabalho, aumento de custos e atrasos no cronograma."
  },
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Explicativa",
    texto: "Diferente do Cascata, o Modelo Incremental — também chamado de Modelo de Desenvolvimento Evolucionário — não entrega o sistema todo de uma vez. Em vez disso, ele divide o sistema em módulos funcionais menores, chamados incrementos. Cada incremento passa pelas fases de análise, design, implementação, testes e integração, sendo entregue de forma gradual.",
    question: "Segundo o texto, como o Modelo Incremental organiza o desenvolvimento do sistema?",
    options: [
      "Entregando o sistema completo apenas ao final do projeto",
      "Dividindo o sistema em módulos funcionais menores, entregues gradualmente",
      "Seguindo uma única fase de planejamento sem repetições",
      "Eliminando totalmente a necessidade de testes entre as entregas"
    ],
    answer: 1,
    feedback: "O ==term==Modelo Incremental== divide o sistema em incrementos funcionais, cada um passando por análise, design, implementação, testes e integração, permitindo entrega gradual."
  },
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Aplicação",
    texto: "Um banco está desenvolvendo um novo sistema financeiro. Em vez de esperar meses para lançar tudo de uma vez, a equipe decide entregar primeiro a funcionalidade de abertura de contas, depois transferências bancárias, em seguida pagamentos, e por fim investimentos — cada uma dessas partes sendo testada e avaliada antes de seguir para a próxima.",
    question: "O cenário descrito ilustra a aplicação de qual modelo de desenvolvimento?",
    options: [
      "Modelo Cascata",
      "Modelo Incremental",
      "Modelo Tradicional puro",
      "Nenhum modelo específico, apenas boas práticas gerais"
    ],
    answer: 1,
    feedback: "A entrega gradual de funcionalidades específicas, como abertura de contas e transferências, é um exemplo típico do ==term==Modelo Incremental== aplicado a sistemas bancários em constante evolução."
  },
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Aplicação",
    texto: "Uma equipe está desenvolvendo um sistema de prontuário eletrônico para um hospital. Como as necessidades das diferentes clínicas do hospital vão surgindo aos poucos e podem mudar conforme o uso real do sistema, a equipe prefere entregar módulos menores — como cadastro de pacientes, depois histórico médico, depois prescrições — recebendo feedback a cada entrega.",
    question: "Por que o Modelo Incremental é mais adequado que o Modelo Cascata para esse cenário hospitalar, segundo os critérios apresentados no texto?",
    options: [
      "Porque o Cascata não permite nenhum tipo de documentação",
      "Porque os requisitos estão em evolução e há necessidade de entrega gradual com feedback",
      "Porque o Incremental elimina totalmente a fase de testes",
      "Porque hospitais não podem utilizar modelos tradicionais em nenhuma hipótese"
    ],
    answer: 1,
    feedback: "O Incremental é indicado quando os requisitos estão em evolução, há necessidade de entrega gradual e o ambiente é dinâmico — características comuns em sistemas de saúde como prontuários eletrônicos."
  },
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Contextualizada",
    texto: "Assim como toda abordagem, o Modelo Incremental também tem desafios. Como o sistema é dividido em vários incrementos, é preciso coordenar cuidadosamente o desenvolvimento e a integração de cada parte. Além disso, testes frequentes entre os incrementos são essenciais para garantir que tudo funcione bem em conjunto, o que pode aumentar o tempo e o esforço necessários.",
    question: "Qual desafio do Modelo Incremental é destacado no texto?",
    options: [
      "A impossibilidade de entregar funcionalidades separadamente",
      "A maior complexidade de gerenciamento, exigindo integração e testes frequentes entre os incrementos",
      "A ausência total de comunicação com os stakeholders",
      "A proibição de mudanças nos requisitos durante o projeto"
    ],
    answer: 1,
    feedback: "O gerenciamento de vários incrementos exige coordenação cuidadosa, além de integração contínua e testes frequentes para garantir que o sistema funcione corretamente como um todo."
  },
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Contextualizada",
    texto: "Comparando os dois modelos: no Cascata, a estrutura é linear e sequencial, os requisitos precisam estar bem definidos desde o início, e o cliente tem menor envolvimento ao longo do processo. Já no Incremental, o sistema é dividido em partes menores, os requisitos podem evoluir durante o desenvolvimento, e o cliente participa mais ativamente, dando feedback a cada entrega.",
    question: "Com base na comparação apresentada, qual é a principal diferença entre o envolvimento do cliente nos dois modelos?",
    options: [
      "No Cascata o cliente participa mais, e no Incremental menos",
      "Em ambos os modelos o cliente tem o mesmo nível de envolvimento",
      "No Cascata o envolvimento do cliente é menor ao longo do processo; no Incremental, é maior, com feedback contínuo",
      "Nenhum dos dois modelos considera o envolvimento do cliente"
    ],
    answer: 2,
    feedback: "No Cascata, as decisões são tomadas principalmente no início, reduzindo o envolvimento do cliente depois. No Incremental, o feedback contínuo a cada entrega aumenta a participação do cliente ao longo do projeto."
  },
    {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Explicativa",
    texto: "Em 2001, um grupo de desenvolvedores experientes se reuniu e criou um documento que mudaria a forma de desenvolver software: o Manifesto Ágil. Ele estabelece que indivíduos e interações valem mais que processos e ferramentas, que software funcionando importa mais que documentação extensa, que colaborar com o cliente é melhor que apenas negociar contratos, e que responder a mudanças é mais importante do que seguir um plano rígido.",
    question: "Segundo o texto, o que o Manifesto Ágil valoriza mais do que 'seguir um plano'?",
    options: [
      "Negociação de contratos",
      "Documentação abrangente",
      "Responder a mudanças",
      "Processos e ferramentas"
    ],
    answer: 2,
    feedback: "Um dos quatro valores do ==key==Manifesto Ágil== é justamente valorizar a resposta rápida a mudanças mais do que a rígida obediência a um plano pré-estabelecido."
  },

  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Explicativa",
    texto: "Diferente dos métodos tradicionais, que entregam o software completo apenas no final do projeto e limitam o feedback do cliente a fases específicas, os métodos ágeis funcionam de forma bem diferente: eles entregam software em pequenos incrementos frequentes e buscam feedback contínuo do cliente ao longo de todo o desenvolvimento.",
    question: "Qual é a principal diferença entre métodos ágeis e tradicionais em relação à entrega de software, segundo o texto?",
    options: [
      "Ambos entregam o software apenas ao final do projeto",
      "Métodos ágeis entregam em pequenos incrementos frequentes; tradicionais entregam ao final do projeto",
      "Métodos tradicionais entregam mais rápido que os métodos ágeis",
      "Não existe diferença relevante entre as duas abordagens"
    ],
    answer: 1,
    feedback: "Enquanto os métodos tradicionais concentram a entrega no fim do projeto, os métodos ágeis priorizam entregas frequentes em pequenos incrementos, permitindo feedback contínuo do cliente."
  },

  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Explicativa",
    texto: "O Scrum organiza o trabalho em ciclos curtos chamados sprints, que geralmente duram de 1 a 4 semanas. Para funcionar bem, o Scrum se apoia em três pilares fundamentais: transparência, que garante que todas as informações do projeto estejam visíveis para a equipe; inspeção, que consiste em revisar regularmente o progresso; e adaptação, que é a disposição de mudar a abordagem conforme o feedback recebido.",
    question: "Quais são os três pilares do Scrum apresentados no texto?",
    options: [
      "Planejamento, execução e controle",
      "Transparência, inspeção e adaptação",
      "Comunicação, simplicidade e coragem",
      "Requisitos, design e testes"
    ],
    answer: 1,
    feedback: "O ==term==Scrum== se sustenta em três pilares: transparência (visibilidade das informações), inspeção (revisão regular do progresso) e adaptação (ajuste da abordagem conforme o feedback)."
  },

  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Contextualizada",
    texto: "Em uma equipe Scrum, cada pessoa tem um papel específico. O Product Owner funciona como a 'voz' do cliente, definindo a visão do produto e priorizando o que deve ser feito primeiro. O Scrum Master atua como guardião do processo, removendo obstáculos que atrapalham a equipe. O Time de Desenvolvimento é quem efetivamente transforma as ideias em um produto funcional. E os Stakeholders são todas as partes interessadas no sucesso do projeto, como clientes e investidores.",
    question: "De acordo com o texto, qual papel do Scrum é responsável por remover obstáculos e garantir que os princípios da metodologia sejam seguidos?",
    options: [
      "Product Owner",
      "Scrum Master",
      "Time de Desenvolvimento",
      "Stakeholders"
    ],
    answer: 1,
    feedback: "O ==term==Scrum Master== é o guardião do processo Scrum, responsável por remover obstáculos da equipe e garantir que a metodologia seja seguida corretamente."
  },

  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Contextualizada",
    texto: "Para acompanhar visualmente o progresso de uma sprint, o Scrum utiliza uma ferramenta chamada Burndown Chart. Nela, o eixo vertical mostra os pontos de complexidade que ainda faltam ser feitos, e o eixo horizontal mostra o tempo, geralmente em dias da sprint. Uma linha tracejada representa o ritmo ideal de trabalho, enquanto uma linha real mostra o progresso de fato da equipe. Se a linha real ficar acima da ideal, é um sinal de que a equipe está atrasada.",
    question: "O que o Burndown Chart permite que a equipe visualize, segundo o texto?",
    options: [
      "A quantidade de bugs encontrados no sistema",
      "O progresso do trabalho restante ao longo do tempo, comparando o ritmo real com o ideal",
      "A lista de funcionalidades priorizadas pelo Product Owner",
      "O número de programadores disponíveis em cada sprint"
    ],
    answer: 1,
    feedback: "O ==term==Burndown Chart== é uma ferramenta gráfica que mostra o trabalho restante ao longo do tempo, permitindo comparar o ritmo ideal com o ritmo real da equipe e identificar atrasos precocemente."
  },

  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Contextualizada",
    texto: "Enquanto o Scrum organiza principalmente a gestão do processo, o Extreme Programming (XP), criado por Kent Beck durante o projeto C3 da Chrysler, foca nas práticas técnicas de engenharia de software. O XP se baseia em cinco valores: comunicação, simplicidade, feedback, coragem e respeito. A partir desses valores, surgem práticas como programação em pares, testes unitários e integração contínua.",
    question: "Qual é a principal diferença de foco entre Scrum e XP, segundo o texto?",
    options: [
      "Scrum foca em práticas técnicas de código; XP foca na gestão de sprints",
      "Scrum tem foco mais gerencial; XP tem foco mais técnico, voltado à engenharia de software",
      "Ambos possuem exatamente o mesmo foco, sem diferenças relevantes",
      "XP não possui valores ou práticas definidas, apenas o Scrum possui"
    ],
    answer: 1,
    feedback: "O Scrum assume uma visão mais gerencial, estruturando papéis e sprints, enquanto o ==term==XP== mergulha na engenharia de software, priorizando práticas técnicas para garantir a qualidade do código."
  },

  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Aplicação",
    texto: "Dois desenvolvedores de uma equipe decidem trabalhar juntos na mesma estação de trabalho para implementar uma nova funcionalidade. Enquanto um escreve o código, o outro revisa cada linha em tempo real, sugerindo melhorias e apontando possíveis erros. Depois de um tempo, eles trocam de papel, e quem estava revisando passa a escrever o código.",
    question: "Essa prática, comum no Extreme Programming, em que dois programadores trabalham juntos revisando o código um do outro em tempo real, é chamada de:",
    options: [
      "Sprint Planning",
      "Programação em Pares",
      "Refatoração",
      "Integração Contínua"
    ],
    answer: 1,
    feedback: "A ==proc==Programação em Pares== envolve dois desenvolvedores trabalhando juntos: um escreve o código (driver) enquanto o outro revisa (observer/navigator), trocando papéis frequentemente."
  },

  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Aplicação",
    texto: "Uma startup de tecnologia está desenvolvendo um aplicativo novo e precisa lançar versões rapidamente, recebendo feedback constante dos usuários para ajustar o produto. A equipe decide dividir o trabalho em ciclos curtos, com reuniões diárias rápidas para alinhar o progresso, e realiza uma reunião ao final de cada ciclo para mostrar o que foi feito e receber sugestões dos interessados no projeto.",
    question: "As reuniões descritas no cenário — a conversa diária rápida e a apresentação do que foi feito ao final do ciclo — correspondem, respectivamente, a quais cerimônias do Scrum?",
    options: [
      "Sprint Planning e Sprint Retrospective",
      "Scrum Daily e Sprint Review",
      "Sprint Review e Scrum Daily",
      "Sprint Retrospective e Sprint Planning"
    ],
    answer: 1,
    feedback: "A ==term==Scrum Daily== é a conversa rápida diária sobre avanços e obstáculos, enquanto a ==term==Sprint Review== é o momento de mostrar o que foi realizado durante o sprint e receber feedback dos stakeholders."
  },

  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Aplicação",
    texto: "Depois de finalizar uma sprint, a equipe de desenvolvimento se reúne sem a presença de stakeholders externos. Nessa reunião, eles conversam abertamente sobre o que funcionou bem durante o ciclo, o que não funcionou e quais mudanças podem ser feitas para melhorar o trabalho na próxima sprint.",
    question: "Essa reunião, focada no aprendizado e na melhoria contínua do processo da equipe, é chamada no Scrum de:",
    options: [
      "Sprint Planning",
      "Sprint Review",
      "Scrum Daily",
      "Sprint Retrospective"
    ],
    answer: 3,
    feedback: "A ==term==Sprint Retrospective== é o momento em que a equipe reflete sobre o que deu certo, o que deu errado e como melhorar no próximo sprint, sendo guiada pelo Scrum Master."
  },

  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Contextualizada",
    texto: "Vários setores diferentes adotam métodos ágeis, e não apenas empresas de tecnologia. O Spotify e a Netflix usam Scrum para acelerar entregas; o Banco Itaú aplica Scrum em projetos de aplicativos mobile; e até instituições públicas, como o Tribunal de Contas da União, utilizam Scrum para gerenciar sistemas internos com foco em qualidade e segurança.",
    question: "O que o texto demonstra sobre a adoção de métodos ágeis, considerando os exemplos apresentados?",
    options: [
      "Que métodos ágeis só funcionam em startups de tecnologia",
      "Que a adoção de métodos ágeis não se limita a um único tipo de empresa, abrangendo tecnologia, bancos e instituições públicas",
      "Que instituições governamentais nunca utilizam métodos ágeis",
      "Que apenas empresas internacionais conseguem aplicar métodos ágeis com sucesso"
    ],
    answer: 1,
    feedback: "Os exemplos mostram que métodos ágeis, como o Scrum, são adotados por diferentes tipos de organizações — empresas de tecnologia, bancos tradicionais e até instituições governamentais — comprovando sua ampla aplicabilidade."
  },
    {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Explicativa",
    texto: "Antes de começar a construir qualquer sistema, é preciso descobrir o que ele realmente precisa fazer. Esse processo de descobrir, ouvir e entender as necessidades de todos os interessados — usuários, clientes, gestores — é chamado de elicitação. É como conversar com as pessoas para captar seus 'sonhos' sobre o que o software deve resolver, usando técnicas como entrevistas, questionários e workshops.",
    question: "De acordo com o texto, o que caracteriza a elicitação de requisitos?",
    options: [
      "A etapa de codificação do sistema",
      "O processo de descobrir, ouvir e entender as necessidades dos stakeholders",
      "A fase final de testes antes da implantação",
      "A definição do cronograma financeiro do projeto"
    ],
    answer: 1,
    feedback: "A ==def==elicitação== é a arte de descobrir e entender os requisitos de todas as partes interessadas, usando técnicas como entrevistas, questionários e workshops."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Explicativa",
    texto: "Depois que as necessidades brutas são coletadas na elicitação, entra em cena a análise de requisitos. O material compara esse processo a lapidar uma pedra preciosa: é o momento de refinar, organizar, cruzar informações, identificar inconsistências e definir quais funcionalidades realmente são essenciais para o sistema.",
    question: "Segundo a metáfora usada no texto, o que a análise de requisitos faz com as informações coletadas na elicitação?",
    options: [
      "Ignora as informações e recomeça o processo do zero",
      "Refina e organiza as informações, como quem lapida uma pedra preciosa",
      "Apenas armazena as informações sem processá-las",
      "Substitui a necessidade de conversar com os stakeholders"
    ],
    answer: 1,
    feedback: "A ==proc==análise de requisitos== refina, organiza, cruza dados e identifica inconsistências nas informações coletadas, revelando as funcionalidades realmente essenciais do sistema."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Explicativa",
    texto: "Os requisitos de um sistema se dividem em duas grandes categorias. Os Requisitos Funcionais definem o que o software deve fazer — suas funcionalidades e como ele interage com o usuário. Já os Requisitos Não Funcionais descrevem as características que o software deve ter, como performance, segurança e usabilidade. O material compara os dois à melodia principal e à harmonia de uma música: ambos são necessários para formar o resultado completo.",
    question: "Com base na comparação musical usada no texto, o que representam os Requisitos Não Funcionais?",
    options: [
      "A melodia principal da música",
      "A harmonia que completa a música",
      "O silêncio entre as notas musicais",
      "O instrumento usado para compor a música"
    ],
    answer: 1,
    feedback: "Os ==term==Requisitos Não Funcionais== são comparados à harmonia da música, complementando os Requisitos Funcionais (a melodia) ao definir qualidades como performance, segurança e usabilidade."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Contextualizada",
    texto: "Para que a comunicação entre equipe técnica e clientes seja clara, uma das principais técnicas usadas nos requisitos funcionais são as User Stories. Elas descrevem, em um texto curto e objetivo, quem é o usuário, o que ele precisa fazer, como deve proceder e com qual objetivo — tudo em uma linguagem mais próxima do cliente do que da equipe técnica.",
    question: "Qual é o principal objetivo das User Stories, segundo o texto?",
    options: [
      "Substituir totalmente a necessidade de testes no sistema",
      "Garantir uma comunicação clara e objetiva entre equipe técnica e clientes sobre as funcionalidades",
      "Definir exclusivamente o cronograma financeiro do projeto",
      "Eliminar a necessidade de qualquer documentação do sistema"
    ],
    answer: 1,
    feedback: "As ==term==User Stories== ajudam a comunicar de forma clara e objetiva as funcionalidades do sistema, descrevendo o usuário, a ação, o processo e o objetivo em linguagem próxima do cliente."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Contextualizada",
    texto: "Nem todas as funcionalidades de um sistema têm a mesma urgência. Algumas são determinantes e precisam existir para que o software entre em produção; outras podem esperar, sendo implementadas em um futuro próximo. Essa priorização exige comunicação constante entre equipe técnica e clientes, e serve de base para montar o cronograma de desenvolvimento e o Documento de Requisitos do Sistema.",
    question: "Por que a priorização de requisitos funcionais é importante, de acordo com o texto?",
    options: [
      "Porque elimina totalmente a necessidade de cronograma",
      "Porque define quais funcionalidades são urgentes e quais podem esperar, servindo de base para o cronograma de desenvolvimento",
      "Porque garante que o sistema nunca precisará de testes",
      "Porque substitui a necessidade de comunicação entre equipe e cliente"
    ],
    answer: 1,
    feedback: "A priorização separa funcionalidades urgentes das que podem esperar, sendo essencial para montar o cronograma de desenvolvimento e o Documento de Requisitos do Sistema."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Contextualizada",
    texto: "O autor do material defende uma posição específica sobre como definir o escopo de um projeto de software: em vez de fixar todas as funcionalidades logo no início (Escopo Fixo), ele prefere um Escopo Variado, em que os requisitos são definidos de forma mais flexível e iterativa, associada aos métodos ágeis. O argumento é que, diferente de um parafuso ou uma roda de carro, o software é um produto peculiar, cujas necessidades muitas vezes só ficam claras durante o desenvolvimento e o uso real do sistema.",
    question: "Qual filosofia de escopo o autor do material declara preferir, segundo o texto?",
    options: [
      "Escopo Fixo, pois os requisitos nunca devem mudar",
      "Escopo Variado, com definição de requisitos mais flexível e iterativa",
      "Nenhuma das duas, pois o autor não expressa preferência",
      "Escopo Fixo, por ser mais compatível com métodos ágeis"
    ],
    answer: 1,
    feedback: "O autor defende o ==term==Escopo Variado de Produto==, associado aos métodos ágeis, argumentando que o software é um produto peculiar cujas necessidades podem mudar durante o desenvolvimento."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Aplicação",
    texto: "Uma equipe está desenvolvendo a User Story: 'Como recepcionista do hospital, eu quero cadastrar novos pacientes com informações básicas, para que possamos ter um registro completo dos pacientes.' Para garantir que essa funcionalidade seja considerada completa, a equipe define um conjunto de condições claras: o sistema deve validar campos obrigatórios como nome e contato, e deve gerar um número de identificação único ao salvar o cadastro.",
    question: "Esse conjunto de condições que a funcionalidade deve cumprir para ser considerada completa e aceita pelo cliente é chamado de:",
    options: [
      "Requisito Não Funcional",
      "Critérios de Aceitação",
      "Documento de Requisitos do Sistema",
      "Elicitação de Requisitos"
    ],
    answer: 1,
    feedback: "Os ==term==Critérios de Aceitação== definem o comportamento esperado de uma User Story, servindo também como base para validação e testes, garantindo que a implementação está correta."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Aplicação",
    texto: "Uma startup está criando um aplicativo de gerenciamento de eventos. Em vez de desenvolver todas as funcionalidades de uma vez, a equipe decide lançar primeiro apenas a criação de eventos e a gestão de convidados — o mínimo necessário para testar se os usuários realmente usariam o app — antes de investir em funcionalidades mais avançadas, como envio automático de convites por e-mail.",
    question: "Essa versão mais simples e funcional do produto, criada para validar hipóteses de negócio com o menor investimento possível, é chamada de:",
    options: [
      "Documento de Requisitos do Sistema",
      "Escopo Fixo de Produto",
      "MVP (Minimum Viable Product)",
      "Requisito Não Funcional"
    ],
    answer: 2,
    feedback: "O ==term==MVP (Produto Mínimo Viável)== é a versão mais simples e funcional de um produto, desenvolvida para validar hipóteses de negócio e coletar feedback com o menor investimento possível."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Aplicação",
    texto: "Um hospital está implantando um novo sistema de prontuário eletrônico e exige que ele fique disponível e funcional pelo menos 99,9% do tempo, além de responder às solicitações dos usuários em menos de 2 segundos durante operações normais. Nenhuma dessas exigências descreve uma funcionalidade específica do sistema, mas sim uma qualidade que ele deve ter.",
    question: "As exigências de disponibilidade de 99,9% do tempo e resposta em menos de 2 segundos são exemplos de quais tipos de requisito, segundo o texto?",
    options: [
      "Requisitos Funcionais",
      "User Stories",
      "Requisitos Não Funcionais (Confiabilidade e Desempenho)",
      "Critérios de Aceitação"
    ],
    answer: 2,
    feedback: "Disponibilidade e tempo de resposta são exemplos de ==term==Requisitos Não Funcionais==, respectivamente relacionados à Confiabilidade (≥99,9% do tempo) e ao Desempenho (resposta em menos de 2 segundos)."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Contextualizada",
    texto: "Um bom processo de elicitação e análise de requisitos traz diversos benefícios para o projeto: evita o desenvolvimento de funcionalidades desnecessárias, reduzindo retrabalho e custos; melhora a qualidade do software, já que ele passa a atender às necessidades reais dos usuários; e aumenta a satisfação do cliente, pois o produto final entrega valor real.",
    question: "De acordo com o texto, qual é um dos benefícios de investir em um bom processo de elicitação e análise de requisitos?",
    options: [
      "Aumento do retrabalho e dos custos do projeto",
      "Redução de retrabalho e custos, evitando funcionalidades desnecessárias",
      "Eliminação total da necessidade de comunicação com o cliente",
      "Impossibilidade de medir a qualidade do software"
    ],
    answer: 1,
    feedback: "Um bom processo de elicitação e análise reduz retrabalho e custos, pois evita o desenvolvimento de funcionalidades desnecessárias ou que não atendem às expectativas reais dos usuários."
  },  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Explicativa",
    texto: "Antes de começar a construir qualquer sistema, é preciso descobrir o que ele realmente precisa fazer. Esse processo de descobrir, ouvir e entender as necessidades de todos os interessados — usuários, clientes, gestores — é chamado de elicitação. É como conversar com as pessoas para captar seus 'sonhos' sobre o que o software deve resolver, usando técnicas como entrevistas, questionários e workshops.",
    question: "De acordo com o texto, o que caracteriza a elicitação de requisitos?",
    options: [
      "A etapa de codificação do sistema",
      "O processo de descobrir, ouvir e entender as necessidades dos stakeholders",
      "A fase final de testes antes da implantação",
      "A definição do cronograma financeiro do projeto"
    ],
    answer: 1,
    feedback: "A ==def==elicitação== é a arte de descobrir e entender os requisitos de todas as partes interessadas, usando técnicas como entrevistas, questionários e workshops."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Explicativa",
    texto: "Depois que as necessidades brutas são coletadas na elicitação, entra em cena a análise de requisitos. O material compara esse processo a lapidar uma pedra preciosa: é o momento de refinar, organizar, cruzar informações, identificar inconsistências e definir quais funcionalidades realmente são essenciais para o sistema.",
    question: "Segundo a metáfora usada no texto, o que a análise de requisitos faz com as informações coletadas na elicitação?",
    options: [
      "Ignora as informações e recomeça o processo do zero",
      "Refina e organiza as informações, como quem lapida uma pedra preciosa",
      "Apenas armazena as informações sem processá-las",
      "Substitui a necessidade de conversar com os stakeholders"
    ],
    answer: 1,
    feedback: "A ==proc==análise de requisitos== refina, organiza, cruza dados e identifica inconsistências nas informações coletadas, revelando as funcionalidades realmente essenciais do sistema."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Explicativa",
    texto: "Os requisitos de um sistema se dividem em duas grandes categorias. Os Requisitos Funcionais definem o que o software deve fazer — suas funcionalidades e como ele interage com o usuário. Já os Requisitos Não Funcionais descrevem as características que o software deve ter, como performance, segurança e usabilidade. O material compara os dois à melodia principal e à harmonia de uma música: ambos são necessários para formar o resultado completo.",
    question: "Com base na comparação musical usada no texto, o que representam os Requisitos Não Funcionais?",
    options: [
      "A melodia principal da música",
      "A harmonia que completa a música",
      "O silêncio entre as notas musicais",
      "O instrumento usado para compor a música"
    ],
    answer: 1,
    feedback: "Os ==term==Requisitos Não Funcionais== são comparados à harmonia da música, complementando os Requisitos Funcionais (a melodia) ao definir qualidades como performance, segurança e usabilidade."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Contextualizada",
    texto: "Para que a comunicação entre equipe técnica e clientes seja clara, uma das principais técnicas usadas nos requisitos funcionais são as User Stories. Elas descrevem, em um texto curto e objetivo, quem é o usuário, o que ele precisa fazer, como deve proceder e com qual objetivo — tudo em uma linguagem mais próxima do cliente do que da equipe técnica.",
    question: "Qual é o principal objetivo das User Stories, segundo o texto?",
    options: [
      "Substituir totalmente a necessidade de testes no sistema",
      "Garantir uma comunicação clara e objetiva entre equipe técnica e clientes sobre as funcionalidades",
      "Definir exclusivamente o cronograma financeiro do projeto",
      "Eliminar a necessidade de qualquer documentação do sistema"
    ],
    answer: 1,
    feedback: "As ==term==User Stories== ajudam a comunicar de forma clara e objetiva as funcionalidades do sistema, descrevendo o usuário, a ação, o processo e o objetivo em linguagem próxima do cliente."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Contextualizada",
    texto: "Nem todas as funcionalidades de um sistema têm a mesma urgência. Algumas são determinantes e precisam existir para que o software entre em produção; outras podem esperar, sendo implementadas em um futuro próximo. Essa priorização exige comunicação constante entre equipe técnica e clientes, e serve de base para montar o cronograma de desenvolvimento e o Documento de Requisitos do Sistema.",
    question: "Por que a priorização de requisitos funcionais é importante, de acordo com o texto?",
    options: [
      "Porque elimina totalmente a necessidade de cronograma",
      "Porque define quais funcionalidades são urgentes e quais podem esperar, servindo de base para o cronograma de desenvolvimento",
      "Porque garante que o sistema nunca precisará de testes",
      "Porque substitui a necessidade de comunicação entre equipe e cliente"
    ],
    answer: 1,
    feedback: "A priorização separa funcionalidades urgentes das que podem esperar, sendo essencial para montar o cronograma de desenvolvimento e o Documento de Requisitos do Sistema."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Contextualizada",
    texto: "O autor do material defende uma posição específica sobre como definir o escopo de um projeto de software: em vez de fixar todas as funcionalidades logo no início (Escopo Fixo), ele prefere um Escopo Variado, em que os requisitos são definidos de forma mais flexível e iterativa, associada aos métodos ágeis. O argumento é que, diferente de um parafuso ou uma roda de carro, o software é um produto peculiar, cujas necessidades muitas vezes só ficam claras durante o desenvolvimento e o uso real do sistema.",
    question: "Qual filosofia de escopo o autor do material declara preferir, segundo o texto?",
    options: [
      "Escopo Fixo, pois os requisitos nunca devem mudar",
      "Escopo Variado, com definição de requisitos mais flexível e iterativa",
      "Nenhuma das duas, pois o autor não expressa preferência",
      "Escopo Fixo, por ser mais compatível com métodos ágeis"
    ],
    answer: 1,
    feedback: "O autor defende o ==term==Escopo Variado de Produto==, associado aos métodos ágeis, argumentando que o software é um produto peculiar cujas necessidades podem mudar durante o desenvolvimento."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Aplicação",
    texto: "Uma equipe está desenvolvendo a User Story: 'Como recepcionista do hospital, eu quero cadastrar novos pacientes com informações básicas, para que possamos ter um registro completo dos pacientes.' Para garantir que essa funcionalidade seja considerada completa, a equipe define um conjunto de condições claras: o sistema deve validar campos obrigatórios como nome e contato, e deve gerar um número de identificação único ao salvar o cadastro.",
    question: "Esse conjunto de condições que a funcionalidade deve cumprir para ser considerada completa e aceita pelo cliente é chamado de:",
    options: [
      "Requisito Não Funcional",
      "Critérios de Aceitação",
      "Documento de Requisitos do Sistema",
      "Elicitação de Requisitos"
    ],
    answer: 1,
    feedback: "Os ==term==Critérios de Aceitação== definem o comportamento esperado de uma User Story, servindo também como base para validação e testes, garantindo que a implementação está correta."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Aplicação",
    texto: "Uma startup está criando um aplicativo de gerenciamento de eventos. Em vez de desenvolver todas as funcionalidades de uma vez, a equipe decide lançar primeiro apenas a criação de eventos e a gestão de convidados — o mínimo necessário para testar se os usuários realmente usariam o app — antes de investir em funcionalidades mais avançadas, como envio automático de convites por e-mail.",
    question: "Essa versão mais simples e funcional do produto, criada para validar hipóteses de negócio com o menor investimento possível, é chamada de:",
    options: [
      "Documento de Requisitos do Sistema",
      "Escopo Fixo de Produto",
      "MVP (Minimum Viable Product)",
      "Requisito Não Funcional"
    ],
    answer: 2,
    feedback: "O ==term==MVP (Produto Mínimo Viável)== é a versão mais simples e funcional de um produto, desenvolvida para validar hipóteses de negócio e coletar feedback com o menor investimento possível."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Aplicação",
    texto: "Um hospital está implantando um novo sistema de prontuário eletrônico e exige que ele fique disponível e funcional pelo menos 99,9% do tempo, além de responder às solicitações dos usuários em menos de 2 segundos durante operações normais. Nenhuma dessas exigências descreve uma funcionalidade específica do sistema, mas sim uma qualidade que ele deve ter.",
    question: "As exigências de disponibilidade de 99,9% do tempo e resposta em menos de 2 segundos são exemplos de quais tipos de requisito, segundo o texto?",
    options: [
      "Requisitos Funcionais",
      "User Stories",
      "Requisitos Não Funcionais (Confiabilidade e Desempenho)",
      "Critérios de Aceitação"
    ],
    answer: 2,
    feedback: "Disponibilidade e tempo de resposta são exemplos de ==term==Requisitos Não Funcionais==, respectivamente relacionados à Confiabilidade (≥99,9% do tempo) e ao Desempenho (resposta em menos de 2 segundos)."
  },

  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Contextualizada",
    texto: "Um bom processo de elicitação e análise de requisitos traz diversos benefícios para o projeto: evita o desenvolvimento de funcionalidades desnecessárias, reduzindo retrabalho e custos; melhora a qualidade do software, já que ele passa a atender às necessidades reais dos usuários; e aumenta a satisfação do cliente, pois o produto final entrega valor real.",
    question: "De acordo com o texto, qual é um dos benefícios de investir em um bom processo de elicitação e análise de requisitos?",
    options: [
      "Aumento do retrabalho e dos custos do projeto",
      "Redução de retrabalho e custos, evitando funcionalidades desnecessárias",
      "Eliminação total da necessidade de comunicação com o cliente",
      "Impossibilidade de medir a qualidade do software"
    ],
    answer: 1,
    feedback: "Um bom processo de elicitação e análise reduz retrabalho e custos, pois evita o desenvolvimento de funcionalidades desnecessárias ou que não atendem às expectativas reais dos usuários."
  },
    {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Explicativa",
    texto: "O Levantamento de Requisitos não é uma etapa que acontece só no início do projeto e depois é esquecida. Ele faz parte da Engenharia de Requisitos e precisa acompanhar todo o ciclo de vida do software, coletando e analisando continuamente as necessidades dos stakeholders para que o sistema continue atendendo às expectativas reais dos usuários.",
    question: "De acordo com o texto, como o Levantamento de Requisitos deve ocorrer ao longo de um projeto?",
    options: [
      "Apenas uma única vez, no início do desenvolvimento",
      "De forma contínua, acompanhando todo o ciclo de vida do software",
      "Somente após a implantação do sistema",
      "Exclusivamente durante a fase de testes"
    ],
    answer: 1,
    feedback: "O ==def==Levantamento de Requisitos== é um processo contínuo, que deve acompanhar todo o ciclo de vida do software para manter os requisitos atualizados conforme o sistema evolui."
  },

  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Explicativa",
    texto: "Nem toda entrevista é conduzida da mesma forma. Quando o analista segue um roteiro fixo de perguntas, aplicado da mesma maneira a todos os entrevistados, isso permite comparar as respostas entre diferentes stakeholders de forma mais objetiva — por exemplo, perguntar a cada gerente de projeto exatamente as mesmas perguntas sobre funcionalidades esperadas.",
    question: "O tipo de entrevista descrito no texto, que segue um roteiro rígido e predefinido, é chamado de:",
    options: [
      "Entrevista não estruturada",
      "Entrevista estruturada",
      "Entrevista semiestruturada",
      "Entrevista contextual"
    ],
    answer: 1,
    feedback: "A ==type==Entrevista Estruturada== segue um roteiro rígido de perguntas predefinidas, sendo útil para obter informações comparáveis entre diferentes stakeholders."
  },

  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Explicativa",
    texto: "Às vezes o analista quer ter alguma estrutura na conversa, mas também precisa de liberdade para explorar pontos interessantes que surgem no meio do caminho. Por isso, ele parte de perguntas predefinidas, mas, quando o entrevistado menciona algo relevante — como a importância de uma integração entre sistemas — o analista aprofunda esse tópico específico antes de voltar ao roteiro.",
    question: "Esse tipo de entrevista, que combina roteiro fixo com liberdade para explorar novos tópicos, é chamado de:",
    options: [
      "Entrevista estruturada",
      "Entrevista semiestruturada",
      "Entrevista não estruturada",
      "Reunião de brainstorming"
    ],
    answer: 1,
    feedback: "A ==type==Entrevista Semiestruturada== combina perguntas predefinidas com a flexibilidade de explorar novos tópicos que surgem durante a conversa."
  },

  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Contextualizada",
    texto: "Nem sempre o que os usuários dizem em uma entrevista reflete exatamente como eles realmente trabalham no dia a dia. Por isso, algumas equipes preferem observar diretamente os usuários em seu ambiente natural de trabalho, registrando como eles realmente utilizam o sistema, quais dificuldades enfrentam e quais soluções encontram na prática. Um analista, por exemplo, pode passar um dia inteiro em um hospital observando médicos e enfermeiros usando o sistema de prontuário eletrônico.",
    question: "A técnica descrita no texto, baseada na observação direta dos usuários em seu ambiente real de trabalho, é chamada de:",
    options: [
      "Análise de documentos",
      "Etnografia",
      "Entrevista estruturada",
      "Reunião de análise e revisão"
    ],
    answer: 1,
    feedback: "A ==term==Etnografia== envolve a observação direta dos usuários em seu ambiente natural de trabalho, permitindo identificar oportunidades de melhoria com base em comportamentos reais."
  },

  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Contextualizada",
    texto: "Um dos maiores desafios de observar pessoas trabalhando é que, sabendo que estão sendo observadas, elas podem mudar seu comportamento natural — trabalhando com mais cuidado ou seguindo processos que normalmente pulariam. Isso pode distorcer os dados coletados durante a observação, dificultando a identificação das reais dificuldades enfrentadas no dia a dia.",
    question: "O fenômeno descrito no texto, em que os usuários alteram seu comportamento por saberem que estão sendo observados, é conhecido como:",
    options: [
      "Efeito observador",
      "Entrevista contextual",
      "Análise qualitativa",
      "Reunião de brainstorming"
    ],
    answer: 0,
    feedback: "O ==warn==efeito observador== ocorre quando os usuários alteram seu comportamento por saberem que estão sendo observados, afetando a validade dos dados coletados durante a etnografia."
  },

  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Contextualizada",
    texto: "Além de conversar com as pessoas e observá-las trabalhando, também é possível descobrir requisitos revisando materiais que já existem, como manuais de usuário, relatórios de uso do sistema atual e registros de chamados de suporte. Por exemplo, ao analisar registros de suporte, uma equipe pode perceber que os usuários pedem repetidamente uma funcionalidade que ainda não existe no sistema.",
    question: "A técnica descrita no texto, que envolve revisar manuais, relatórios e registros existentes para identificar requisitos, é chamada de:",
    options: [
      "Entrevista não estruturada",
      "Etnografia",
      "Análise de documentos",
      "Reunião de brainstorming"
    ],
    answer: 2,
    feedback: "A ==term==Análise de Documentos== revisa manuais, relatórios de uso e registros de incidentes/suporte para identificar requisitos implícitos e complementares que os usuários podem não mencionar explicitamente."
  },

  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Aplicação",
    texto: "Uma equipe de desenvolvimento reúne vários stakeholders em uma sala e propõe que todos sugiram livremente ideias e funcionalidades para um novo sistema de gerenciamento de projetos, sem julgar nenhuma ideia de imediato, buscando criar um ambiente criativo e aberto para gerar o maior número possível de sugestões.",
    question: "Esse tipo de reunião, focada em gerar ideias livremente sem julgamentos imediatos, é chamado de:",
    options: [
      "Reunião de análise e revisão",
      "Reunião de brainstorming",
      "Entrevista estruturada",
      "Workshop"
    ],
    answer: 1,
    feedback: "A ==type==Reunião de Brainstorming== é focada na geração colaborativa de ideias e soluções, incentivando os participantes a sugerirem livremente, sem julgamentos imediatos."
  },

  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Aplicação",
    texto: "Depois de já ter coletado uma lista inicial de requisitos, uma equipe organiza uma reunião específica para revisar tudo o que já foi levantado, verificando se os requisitos estão claros, completos e realmente alinhados com os objetivos do projeto, identificando pontos que ainda precisam de mais detalhes.",
    question: "Esse tipo de reunião, voltada a revisar e refinar requisitos já coletados, é chamado de:",
    options: [
      "Reunião de brainstorming",
      "Reunião de análise e revisão",
      "Entrevista semiestruturada",
      "Etnografia"
    ],
    answer: 1,
    feedback: "A ==type==Reunião de Análise e Revisão== é usada para analisar e revisar os requisitos já coletados, garantindo que estejam claros, completos e alinhados com os objetivos do projeto."
  },

  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Aplicação",
    texto: "Uma equipe organiza uma sessão colaborativa mais estruturada do que uma simples reunião, combinando momentos de geração de ideias com momentos de análise mais aprofundada, incluindo atividades práticas para mapear os processos atuais de uma organização e identificar onde um novo sistema pode trazer melhorias.",
    question: "Essa sessão colaborativa mais estruturada, que combina elementos de brainstorming e análise com atividades práticas, é chamada de:",
    options: [
      "Entrevista não estruturada",
      "Workshop",
      "Análise de documentos",
      "Reunião de brainstorming"
    ],
    answer: 1,
    feedback: "O ==type==Workshop== é uma sessão colaborativa mais estruturada, que combina elementos de brainstorming e de análise, geralmente com atividades práticas para explorar e definir requisitos."
  },

  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Contextualizada",
    texto: "Não basta apenas saber conduzir entrevistas, reuniões ou observações — o profissional também precisa desenvolver habilidades técnicas e comportamentais para fazer isso bem. Habilidades técnicas, como conhecimento do domínio do problema e análise de dados, são adquiridas por treinamento e educação formal. Já habilidades comportamentais, como comunicação, empatia e negociação, são fundamentais para lidar bem com as pessoas envolvidas.",
    question: "Segundo o texto, como são chamadas, respectivamente, as habilidades técnicas e as habilidades comportamentais necessárias ao profissional de requisitos?",
    options: [
      "Hard skills e soft skills",
      "Soft skills e hard skills",
      "Habilidades primárias e habilidades secundárias",
      "Competências técnicas e competências de negócio"
    ],
    answer: 0,
    feedback: "As ==term==hard skills== são habilidades técnicas adquiridas por treinamento e educação formal, enquanto as ==term==soft skills== são comportamentais, como comunicação, empatia e negociação."
  },
    {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Explicativa",
    texto: "Antes de escrever qualquer linha de código orientado a objetos, é preciso primeiro entender e planejar o sistema. Essa etapa de identificar e definir os objetos que vão compor o sistema — representando entidades do mundo real ou abstrato — é feita pela Análise Orientada a Objetos (AOO). Só depois dessa modelagem é que a Programação Orientada a Objetos (POO) entra em ação para transformar essas definições em código funcional.",
    question: "Segundo o texto, qual é a relação entre AOO e POO?",
    options: [
      "AOO e POO são a mesma coisa, apenas com nomes diferentes",
      "A AOO cuida da fase de análise e modelagem, enquanto a POO cuida da implementação em código",
      "A POO acontece antes da AOO no desenvolvimento do sistema",
      "A AOO substitui totalmente a necessidade de programação"
    ],
    answer: 1,
    feedback: "A ==def==AOO== foca na identificação e definição dos objetos do sistema (fase de modelagem), enquanto a ==def==POO== trata da implementação dessas definições em código — são processos complementares."
  },

  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Explicativa",
    texto: "Antes de existir o conceito de objeto como conhecemos hoje, linguagens como C já usavam as chamadas structs, que permitiam agrupar variáveis de diferentes tipos em uma única unidade — por exemplo, uma struct 'Carro' com campos para cor, marca e quilometragem. O problema é que essas structs só armazenavam dados, sem capacidade de definir operações (comportamentos) sobre eles.",
    question: "Qual era a principal limitação das structs em relação aos objetos, de acordo com o texto?",
    options: [
      "As structs não permitiam agrupar variáveis de tipos diferentes",
      "As structs armazenavam apenas dados, sem capacidade de definir comportamentos associados",
      "As structs só podiam ser usadas em linguagens orientadas a objetos",
      "As structs eram mais complexas de usar do que os objetos"
    ],
    answer: 1,
    feedback: "As ==term==structs== agrupavam dados, mas careciam de comportamento — não permitiam definir operações sobre eles. Essa limitação motivou a evolução para o conceito de objeto, que une dados e comportamento."
  },

  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Explicativa",
    texto: "Um dos pilares da Análise Orientada a Objetos é a ideia de esconder os detalhes internos de um objeto, expondo apenas o que é necessário para que outras partes do sistema interajam com ele. Essa prática protege a integridade dos dados e promove modularidade, evitando que o funcionamento interno de um objeto seja alterado de forma indevida por outras partes do código.",
    question: "O conceito descrito no texto, que consiste em esconder os detalhes internos de um objeto e expor apenas o necessário, é chamado de:",
    options: [
      "Herança",
      "Polimorfismo",
      "Encapsulamento",
      "Abstração"
    ],
    answer: 2,
    feedback: "O ==def==Encapsulamento== esconde os detalhes internos de um objeto, expondo apenas o necessário para o funcionamento externo, promovendo modularidade e protegendo a integridade dos dados."
  },

  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Contextualizada",
    texto: "Existem diferentes técnicas para modelar visualmente um sistema orientado a objetos. Uma delas, desenvolvida por James Rumbaugh em 1991, divide a modelagem em três aspectos: a estrutura estática dos objetos, o comportamento dinâmico do sistema e o fluxo de dados entre suas partes. Essa técnica é especialmente útil nas fases iniciais de design de um sistema.",
    question: "A técnica de modelagem descrita no texto, criada por James Rumbaugh em 1991, é conhecida como:",
    options: [
      "UML (Unified Modeling Language)",
      "BON (Business Object Notation)",
      "OMT (Object Modeling Technique)",
      "IDEF0"
    ],
    answer: 2,
    feedback: "A ==term==OMT (Object Modeling Technique)==, desenvolvida por James Rumbaugh em 1991, divide a modelagem em estrutura estática, comportamento dinâmico e fluxo de dados, sendo útil em fases iniciais de design."
  },

  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Contextualizada",
    texto: "Entre as diversas técnicas de modelagem orientada a objetos, a UML se destaca por ser um padrão amplamente utilizado, oferecendo diversos tipos de diagramas. Um deles, o Diagrama de Classes, apresenta as entidades do sistema junto com seus atributos e métodos, além de mostrar como as classes se relacionam entre si por meio de linhas que as conectam.",
    question: "De acordo com o texto, o que o Diagrama de Classes da UML representa?",
    options: [
      "Apenas o fluxo de dados entre módulos do sistema",
      "As classes do sistema, junto com seus atributos, métodos e relacionamentos entre elas",
      "Exclusivamente a sequência de interações entre usuários e sistema",
      "Somente os requisitos não funcionais do sistema"
    ],
    answer: 1,
    feedback: "O ==term==Diagrama de Classes== é um tipo de diagrama UML que apresenta as classes de um sistema junto com seus atributos, métodos e os relacionamentos entre elas."
  },

  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Aplicação",
    texto: "Em um sistema, existe uma classe Mamifero que define um comportamento comum chamado mover(), usado tanto por Cachorro quanto por Gato. No entanto, cada uma dessas subclasses implementa o método fazerSom() de forma diferente: o Cachorro emite 'Au Au' e o Gato emite 'Miau'. Ainda assim, o sistema consegue chamar fazerSom() da mesma forma para qualquer animal da lista, sem precisar saber previamente qual subclasse está sendo tratada.",
    question: "A capacidade de diferentes subclasses (Cachorro e Gato) redefinirem o mesmo método (fazerSom) com comportamentos distintos, sendo tratadas de forma unificada pelo sistema, ilustra o conceito de:",
    options: [
      "Encapsulamento",
      "Abstração",
      "Polimorfismo",
      "Interface"
    ],
    answer: 2,
    feedback: "O ==term==Polimorfismo== permite que métodos sejam redefinidos (override) em subclasses, possibilitando que objetos de diferentes classes sejam tratados de forma unificada, com comportamentos específicos."
  },

  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Aplicação",
    texto: "Em um sistema com uma classe Animal, é definido que todo animal deve possuir os métodos fazerSom() e mover(), sem especificar como cada um deles deve funcionar internamente. A classe Passaro, por exemplo, implementa diretamente esse contrato, definindo sua própria versão de fazerSom() ('Piu Piu') e mover() ('está voando'), sem precisar herdar de nenhuma outra classe intermediária.",
    question: "O contrato que define quais métodos uma classe deve implementar, sem especificar como eles devem funcionar internamente, é chamado de:",
    options: [
      "Herança",
      "Interface",
      "Encapsulamento",
      "Classe abstrata concreta"
    ],
    answer: 1,
    feedback: "As ==term==Interfaces== definem contratos que classes podem implementar, garantindo que certos métodos sejam seguidos, sem especificar a implementação — promovendo flexibilidade e intercambialidade."
  },

  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Aplicação",
    texto: "Uma equipe de desenvolvimento está criando um sistema web em JavaScript e decide usar um conjunto de estruturas já prontas, rodando sobre o Node.js, que oferece objetos básicos comuns a diferentes tipos de aplicações web, simplificando bastante a escrita do código do zero.",
    question: "Esse tipo de estrutura reutilizável, mencionada no texto como exemplo de aplicação prática da POO em JavaScript, é chamada de:",
    options: [
      "Componentização",
      "Framework (como o Express)",
      "Herança múltipla",
      "Diagrama de classes"
    ],
    answer: 1,
    feedback: "O paradigma orientado a objetos permite criar ==term==frameworks==, como o Express (JavaScript/Node.js) ou o Flask (Python), que oferecem estruturas básicas reutilizáveis para simplificar o desenvolvimento."
  },

  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Contextualizada",
    texto: "A ideia de dividir um sistema em unidades básicas que se comunicam por troca de mensagens, como se fossem peças de um Lego encaixáveis, também nasceu da orientação a objetos. Essa abordagem permite construir sistemas combinando componentes menores e independentes, em vez de criar tudo como um bloco único e monolítico.",
    question: "Esse conceito, que trata o sistema como unidades básicas combináveis que se comunicam por troca de mensagens, é chamado no texto de:",
    options: [
      "Herança múltipla",
      "Componentização",
      "Polimorfismo dinâmico",
      "Encapsulamento estrutural"
    ],
    answer: 1,
    feedback: "A ==term==Componentização== concebe o sistema como unidades básicas (componentes) que se comunicam por troca de mensagens, como peças de um Lego — dando origem a tecnologias como os Web Components."
  },

  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Contextualizada",
    texto: "Mesmo com toda a popularidade da orientação a objetos, ela não eliminou outras formas de programar. Paradigmas como a Programação Imperativa e a Programação Funcional continuam sendo usados e coexistindo com a POO em diferentes projetos e linguagens. A orientação a objetos apenas trouxe mais uma alternativa para facilitar a compreensão e a manutenção de sistemas.",
    question: "De acordo com o texto, o que aconteceu com os outros paradigmas de programação após a popularização da POO?",
    options: [
      "Foram totalmente substituídos pela POO e deixaram de ser utilizados",
      "Continuam coexistindo com a POO, que apenas agregou uma nova forma de construir sistemas",
      "Passaram a ser considerados incompatíveis com qualquer linguagem moderna",
      "Foram incorporados dentro da POO, deixando de existir como paradigmas separados"
    ],
    answer: 1,
    feedback: "A criação e difusão da POO não eliminou outros paradigmas, como o Imperativo ou o Funcional — ela apenas agregou uma nova forma de construir sistemas, convivendo com as abordagens já existentes."
  },
],


enade: [
  // 1 - Análise de sistemas
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Asserção + Justificativa",
    texto: "Uma rede varejista de médio porte enfrentava atrasos frequentes na reposição de produtos e dificuldades para rastrear a movimentação de itens entre suas lojas e o centro de distribuição. Para reformular o sistema de gestão de estoque, a equipe de desenvolvimento iniciou o projeto realizando entrevistas com gerentes de loja, conversas com o setor de logística e o levantamento de relatórios de vendas dos últimos dois anos.",
    question: "Considerando as etapas do desenvolvimento de software descritas no material, avalie as asserções a seguir.",
    assertions: [
      "I. As atividades realizadas pela equipe nessa fase inicial do projeto — entrevistas, conversas com stakeholders e levantamento de relatórios — caracterizam uma etapa de ==def==análise==, e não de modelagem.",
      "PORQUE II. A análise tem como propósito compreender o problema, o domínio e as necessidades dos usuários antes de qualquer estruturação visual ou representação do sistema."
    ],
    options: [
      "I e II são verdadeiras, e II justifica I",
      "I e II são verdadeiras, mas II não justifica I",
      "I é verdadeira e II é falsa",
      "I é falsa e II é verdadeira"
    ],
    answer: 0,
    feedback: "As atividades descritas — entrevistar usuários, conversar com stakeholders e coletar informações — são típicas da **análise de sistemas**, etapa voltada a entender o problema antes de qualquer ==proc==representação estrutural==. Como a análise realmente precede e fundamenta a modelagem, II justifica corretamente I."
  },

  // 2 - Fases do desenvolvimento
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Múltiplas Afirmativas",
    texto: "Uma clínica médica contratou uma empresa de software para desenvolver um sistema de agendamento de consultas. Antes de iniciar a programação, a equipe de projeto conversou extensivamente com a recepção e os médicos da clínica para entender as funcionalidades desejadas, elaborou um documento com os requisitos detalhados e os riscos do projeto, e só então definiu a arquitetura da aplicação e o layout das telas.",
    question: "Com base no processo genérico de desenvolvimento de software apresentado no material, avalie as afirmativas a seguir.",
    assertions: [
      "I. As conversas com a recepção e os médicos para identificar necessidades e funcionalidades correspondem à etapa de levantamento de requisitos.",
      "II. A definição da arquitetura da aplicação e do layout das telas, apenas após o levantamento de requisitos, corresponde à etapa de design.",
      "III. A elaboração do documento com riscos e requisitos detalhados é uma atividade que só pode ocorrer depois da etapa de testes.",
      "IV. Segundo o processo apresentado, a implantação do sistema deve necessariamente anteceder a etapa de testes."
    ],
    options: [
      "I, II e III, apenas",
      "I e II, apenas",
      "II e IV, apenas",
      "I, II, III e IV"
    ],
    answer: 1,
    feedback: "O **levantamento de requisitos** ocorre para descobrir necessidades e funcionalidades (I), enquanto o **design** transforma requisitos em arquitetura e interface (II). O planejamento — não os testes — antecede a definição de riscos e requisitos (III é falsa), e a implantação sempre ocorre após a validação por testes, nunca antes (IV é falsa)."
  },

  // 3 - Classe e objeto
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Conceitual Contextualizada",
    texto: "No desenvolvimento de um sistema de gestão hospitalar, a equipe modelou uma estrutura que define quais informações e ações todo paciente do sistema deve possuir, como nome, data de nascimento, histórico médico e a ação de agendar uma consulta. A partir dessa estrutura, o sistema passou a registrar, por exemplo, o paciente João Silva, 45 anos, com uma consulta agendada para o dia seguinte.",
    question: "No contexto orientado a objetos descrito, o registro de 'João Silva, 45 anos, com consulta agendada' representa, em relação à estrutura definida anteriormente, um exemplo de:",
    options: [
      "Uma nova classe, criada para representar exclusivamente pacientes do sexo masculino",
      "Um método, pois executa a ação de agendar uma consulta dentro do sistema",
      "Um objeto, pois se trata de uma instância concreta da classe Paciente, com valores específicos para seus atributos",
      "Uma interface, pois conecta o módulo de pacientes a outros módulos do sistema hospitalar"
    ],
    answer: 2,
    feedback: "O registro de João Silva com valores específicos para nome, idade e consulta é um **objeto** — uma instância concreta da classe Paciente. A classe apenas define a estrutura geral; o objeto é a materialização real dessa estrutura no sistema."
  },

  // 4 - Abstração e encapsulamento
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Análise Aplicada",
    texto: "Em um sistema bancário orientado a objetos, os desenvolvedores de outros módulos podem chamar o método sacar(valor) de um objeto Conta sem precisar saber como a verificação de saldo, o registro da transação e a atualização do extrato são implementados internamente. Além disso, o atributo saldo não pode ser alterado diretamente por nenhum outro objeto do sistema — qualquer modificação deve obrigatoriamente passar pelos métodos da própria classe Conta.",
    question: "As duas características descritas no sistema bancário exemplificam, respectivamente, quais conceitos da orientação a objetos?",
    options: [
      "Herança e polimorfismo, pois o método sacar() é herdado de outra classe e pode assumir diferentes formas conforme o contexto",
      "Modularidade e reutilização de código, já que o método pode ser usado por diferentes módulos sem restrição de acesso",
      "Encapsulamento e abstração, já que restringir o acesso aos dados é abstração e esconder a implementação interna é encapsulamento",
      "Abstração e encapsulamento, pois esconder os detalhes internos do método sacar() é abstração, e restringir o acesso direto ao atributo saldo é encapsulamento"
    ],
    answer: 3,
    feedback: "Permitir o uso do método sem conhecer sua implementação interna é **abstração**; impedir o acesso direto ao atributo saldo, exigindo que a alteração passe pelos métodos da classe, é **encapsulamento**. A opção que inverte essas definições é uma armadilha conceitual comum."
  },

  // 5 - Herança e polimorfismo
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Múltiplas Afirmativas",
    texto: "Uma empresa desenvolveu um sistema de folha de pagamento orientado a objetos. A classe Funcionario define atributos e comportamentos comuns a todos os empregados, incluindo o método calcularSalario(). As classes Gerente e Estagiario, que derivam de Funcionario, implementam esse mesmo método de formas diferentes: a primeira inclui bônus por metas, e a segunda aplica um valor fixo de bolsa-auxílio.",
    question: "Avalie as afirmativas a seguir sobre esse sistema.",
    assertions: [
      "I. A classe Gerente pode herdar atributos e métodos da classe Funcionario, podendo adicionar ou modificar comportamentos herdados, como o próprio calcularSalario().",
      "II. O fato de Gerente e Estagiario implementarem calcularSalario() de formas distintas, mantendo o mesmo nome de método, exemplifica ==rule==polimorfismo==.",
      "III. A herança, nesse caso, impede que qualquer subclasse modifique o comportamento definido originalmente na superclasse.",
      "IV. Para que o polimorfismo ocorra, é obrigatório que todas as classes envolvidas possuam exatamente os mesmos atributos internos."
    ],
    options: [
      "I e II, apenas",
      "I, II e III, apenas",
      "II, III e IV, apenas",
      "I, III e IV, apenas"
    ],
    answer: 0,
    feedback: "A herança permite reaproveitar e **especializar** comportamentos (I), e nomes de método iguais com comportamentos diferentes conforme a classe caracterizam **polimorfismo** (II). A herança não impede alterações na subclasse (III é falsa) e o polimorfismo não exige atributos idênticos entre as classes (IV é falsa)."
  },

  // 6 - Modelagem formal
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Conceitual Contextualizada",
    texto: "Uma equipe de engenharia de software está desenvolvendo o sistema de controle de um componente crítico de um sistema de tráfego aéreo, no qual qualquer falha de comportamento pode gerar consequências graves. Por isso, a equipe decidiu representar matematicamente os estados possíveis do sistema e as transições entre eles, de forma a aumentar a confiança de que a especificação será rigorosamente obedecida.",
    question: "Qual tipo de modelagem, entre os apresentados, é mais adequado para essa finalidade?",
    options: [
      "Modelagem funcional, pois seu foco está na divisão do sistema em funções e processos menores",
      "Modelagem formal, pois utiliza lógica matemática para descrever com precisão o comportamento do sistema, como nas Redes de Petri",
      "Modelagem estruturada, pois representa processos, dados e fluxos de forma tradicional",
      "Modelagem baseada em processos, pois enfatiza a análise dos fluxos de trabalho do sistema"
    ],
    answer: 1,
    feedback: "A **modelagem formal** utiliza lógica matemática para descrever o comportamento de um sistema com precisão, sendo indicada para componentes críticos que exigem alta confiabilidade — como exemplificado pelas Redes de Petri no material."
  },

  // 7 - UML caso de uso
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Análise Aplicada",
    texto: "A equipe responsável pelo sistema de uma biblioteca universitária precisa documentar, de forma visual, quais ações os leitores e os bibliotecários podem realizar ao interagir com o sistema — como emprestar um livro, devolver um exemplar, consultar o acervo e renovar um empréstimo — sem detalhar, nesse momento, a estrutura interna de classes do sistema.",
    question: "Qual artefato UML apresentado no material seria mais adequado para representar essas interações?",
    options: [
      "Diagrama de classes, pois detalha atributos e métodos de cada entidade do sistema",
      "Rede de Petri, pois representa estados e transições com precisão matemática",
      "Diagrama de caso de uso, pois detalha as interações dos usuários com o sistema e suas funcionalidades",
      "Diagrama de blocos de fluxo funcional, pois divide o sistema em funções menores e gerenciáveis"
    ],
    answer: 2,
    feedback: "O **diagrama de caso de uso** é o artefato UML voltado a representar as interações entre usuários (atores) e o sistema, evidenciando funcionalidades como emprestar, devolver e consultar — sem entrar no detalhamento interno das classes."
  },

  // 8 - Vantagens da OO
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Análise Aplicada",
    texto: "Uma empresa decidiu migrar um sistema legado, construído de forma monolítica e com pouca separação entre suas partes, para uma arquitetura orientada a objetos. Após a migração, os desenvolvedores passaram a dividir o sistema em módulos independentes, reaproveitar componentes já existentes em novas funcionalidades e implementar comportamentos diferentes para uma mesma operação, dependendo do tipo de objeto envolvido.",
    question: "As mudanças descritas após a migração estão associadas, respectivamente, a quais conceitos apresentados no material como vantagens da orientação a objetos?",
    options: [
      "Encapsulamento, herança e abstração",
      "Abstração, encapsulamento e herança",
      "Herança, abstração e modularidade",
      "Modularidade, reutilização de código e polimorfismo"
    ],
    answer: 3,
    feedback: "Dividir o sistema em partes independentes é **modularidade**; aproveitar código já existente em novas funcionalidades é **reutilização de código**; e implementar comportamentos diferentes para uma mesma operação conforme o objeto envolvido é polimorfismo."
  },

  // 9 - UML orientada a objetos
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Múltiplas Afirmativas",
    texto: "No projeto de um sistema de gestão hospitalar, a equipe optou por representar entidades como Paciente, Médico e Medicamento como objetos, cada um com seus próprios atributos e métodos, e utilizou diagramas UML para representar essas classes e os relacionamentos entre elas.",
    question: "Avalie as afirmativas a seguir sobre a abordagem adotada pela equipe.",
    assertions: [
      "I. A UML é apresentada no material como um padrão amplamente utilizado para a ==term==modelagem orientada a objetos==.",
      "II. Representar Paciente, Médico e Medicamento como objetos com atributos e métodos próprios é uma prática típica da modelagem orientada a objetos.",
      "III. A modelagem orientada a objetos, segundo o material, tem como foco exclusivo os processos do sistema, sem considerar objetos ou suas interações.",
      "IV. O uso de diagramas UML para representar classes e relacionamentos torna a modelagem estruturada, e não orientada a objetos."
    ],
    options: [
      "I, III e IV, apenas",
      "I e II, apenas",
      "II, III e IV, apenas",
      "I, II, III e IV"
    ],
    answer: 1,
    feedback: "A **UML** é o padrão citado no material para representar sistemas orientados a objetos (I), e representar entidades como objetos com atributos e métodos é justamente o foco dessa abordagem (II). A modelagem orientada a objetos tem foco em objetos e interações, não apenas em processos (III é falsa), e o uso de UML para classes continua caracterizando modelagem orientada a objetos, não estruturada (IV é falsa)."
  },

  // 10 - Ordem do processo
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Conceitual Contextualizada",
    texto: "Uma equipe de desenvolvimento está organizando as etapas de um novo sistema para uma clínica médica. Até o momento, a equipe já conversou extensivamente com a coordenação da clínica para entender as funcionalidades desejadas e já definiu, em um documento formal, os objetivos de negócio, os requisitos detalhados e os principais riscos do projeto.",
    question: "De acordo com o processo genérico de desenvolvimento de software apresentado no material, qual é a próxima etapa a ser realizada pela equipe?",
    options: [
      "Teste, pois os requisitos já foram definidos e o sistema pode ser validado",
      "Levantamento de requisitos, pois essa etapa deve ser repetida antes de qualquer outra atividade",
      "Design, pois é a etapa seguinte ao planejamento, responsável por transformar requisitos em arquitetura e interface",
      "Implantação, pois o projeto já está pronto para ser colocado em uso"
    ],
    answer: 2,
    feedback: "As atividades descritas — entender funcionalidades e definir objetivos, requisitos e riscos — correspondem às etapas de **levantamento de requisitos** e **planejamento**. A etapa seguinte no processo genérico é o **design**, responsável por transformar tudo isso em arquitetura e interface concretas."
  },
// 11 - Modelo Cascata
{
  aula: "Aula 2 — Ciclo de Vida do Software",
  tipo: "Asserção + Justificativa",
  texto: "Uma equipe de TI está desenvolvendo o sistema de controle de tráfego aéreo de um novo aeroporto internacional. Os requisitos do sistema já foram amplamente definidos junto a órgãos reguladores e especialistas em aviação, sendo considerados estáveis e com baixa expectativa de mudanças ao longo do projeto.",
  question: "Considerando as características dos modelos de ciclo de vida do software apresentados no material, avalie as asserções a seguir.",
  assertions: [
    "I. O ==def==Modelo em Cascata== é o mais indicado para esse projeto, já que sua estrutura de fases sucessivas exige que uma etapa só comece após a conclusão da anterior.",
    "PORQUE II. Esse modelo é adequado a projetos com requisitos bem conhecidos e estáveis, com pouca expectativa de mudanças — características presentes no cenário descrito."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "O **Modelo em Cascata** é indicado para projetos com requisitos estáveis, como no exemplo de controle de tráfego aéreo citado pelo material. Sua estrutura ==proc==sequencial== exige que uma fase termine antes que a próxima comece, o que só funciona bem quando há baixa expectativa de mudanças — por isso II justifica corretamente I."
},

//12 - Comparação de modelos
{
  aula: "Aula 2 — Ciclo de Vida do Software",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma empresa de desenvolvimento está avaliando qual modelo de ciclo de vida adotar para três projetos distintos: um sistema de gestão empresarial dividido em módulos de contabilidade, RH e estoque; um protótipo de aplicativo para uma startup que precisa lançar rapidamente no mercado; e um sistema de defesa que exige análise contínua de riscos ao longo de todo o desenvolvimento.",
  question: "Avalie as afirmativas a seguir sobre os modelos de ciclo de vida mais adequados a cada um desses cenários.",
  assertions: [
    "I. Para o sistema de gestão empresarial dividido em módulos, o Modelo Incremental é adequado, pois permite que cada módulo seja desenvolvido e entregue separadamente.",
    "II. Para o protótipo da startup que precisa de lançamento rápido, o RAD é mais adequado, já que enfatiza ciclos curtos e entrega rápida.",
    "III. Para o sistema de defesa que exige análise contínua de riscos, o Modelo Espiral é mais indicado, pois cada iteração envolve a análise de riscos como etapa central.",
    "IV. Os três cenários exigem necessariamente o Modelo em Cascata, já que ele é o único capaz de organizar fases de desenvolvimento de forma clara."
  ],
  options: [
    "I e II, apenas",
    "I, II e III, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "Cada modelo atende a uma necessidade distinta: o **Incremental** entrega o sistema por módulos, o **RAD** prioriza rapidez e o **Espiral** enfatiza a análise contínua de riscos. A afirmativa IV é falsa, pois nenhum modelo é obrigatório para todos os contextos — a escolha depende das características de cada projeto."
},

// 13 - Prototipagem
{
  aula: "Aula 2 — Ciclo de Vida do Software",
  tipo: "Conceitual Contextualizada",
  texto: "Uma equipe de UX está desenvolvendo a interface de um novo aplicativo de delivery de comida. Antes de iniciar a implementação definitiva, a equipe construiu uma versão inicial navegável do aplicativo e a apresentou a usuários reais, coletando reações sobre a disposição dos botões, o fluxo de pedidos e a clareza das informações, ajustando os requisitos a partir desse retorno.",
  question: "A prática adotada pela equipe de UX exemplifica qual abordagem de ciclo de vida apresentada no material?",
  options: [
    "Modelo em Cascata, pois a interface foi definida em uma única fase sequencial, sem retorno a etapas anteriores",
    "Modelo Espiral, pois o principal objetivo da equipe foi realizar uma análise formal de riscos do projeto",
    "Prototipagem, pois a construção de uma versão inicial teve como objetivo captar, esclarecer e refinar os requisitos junto aos usuários",
    "RUP, pois a equipe organizou o trabalho em quatro fases distintas: concepção, elaboração, construção e transição"
  ],
  answer: 2,
  feedback: "A construção de uma versão inicial do software para **captar, esclarecer e refinar requisitos** junto aos usuários é a definição de prototipagem apresentada no material, podendo funcionar como modelo independente ou como técnica dentro de outras abordagens."
},

// 14 - Teste de regressão
{
  aula: "Aula 2 — Ciclo de Vida do Software",
  tipo: "Análise Aplicada",
  texto: "Após a equipe de desenvolvimento de um CRM adicionar uma nova funcionalidade de exportação de relatórios em PDF, o time de qualidade foi acionado para verificar se funcionalidades já existentes, como o gerenciamento de contatos e o rastreamento de vendas, continuavam funcionando corretamente após essa alteração.",
  question: "Qual tipo de teste, entre os apresentados no material, está sendo realizado pelo time de qualidade nessa situação?",
  options: [
    "Teste de regressão, pois verifica se uma alteração recente não comprometeu funcionalidades que já funcionavam corretamente",
    "Teste de desempenho, pois avalia o comportamento do sistema sob diferentes condições de carga",
    "Teste de usabilidade, pois avalia a facilidade de interação do usuário com a nova funcionalidade",
    "Teste de segurança, pois identifica vulnerabilidades introduzidas pela nova funcionalidade de exportação"
  ],
  answer: 0,
  feedback: "O **teste de regressão** verifica se uma mudança recente no sistema não quebrou funcionalidades que já funcionavam antes — exatamente o que ocorre ao checar se contatos e vendas continuam operando após a nova funcionalidade de exportação."
},

// 15 - Fases do ciclo de vida
{
  aula: "Aula 2 — Ciclo de Vida do Software",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma equipe está desenvolvendo um sistema de e-commerce. Nas primeiras semanas, definiu metas de negócio, recursos disponíveis e o cronograma do projeto. Em seguida, realizou entrevistas e workshops com stakeholders para identificar funcionalidades como carrinho de compras e histórico de pedidos. Por fim, antes de iniciar a codificação, elaborou diagramas de classes para produtos, usuários e pedidos, além de um diagrama de sequência para o fluxo de compra.",
  question: "Avalie as afirmativas a seguir sobre as fases do ciclo de vida do software presentes nesse cenário.",
  assertions: [
    "I. A definição de metas de negócio, recursos e cronograma corresponde à fase de Planejamento.",
    "II. As entrevistas e workshops para identificar funcionalidades como carrinho de compras correspondem à fase de Análise de Requisitos.",
    "III. A elaboração dos diagramas de classes e de sequência, antes da codificação, corresponde à fase de Design.",
    "IV. A fase de Testes deveria ter sido realizada antes da fase de Design, conforme a sequência apresentada no material."
  ],
  options: [
    "I e III, apenas",
    "II, III e IV, apenas",
    "I, II e III, apenas",
    "I, II, III e IV"
  ],
  answer: 2,
  feedback: "O cenário percorre exatamente a sequência **Planejamento → Análise de Requisitos → Design** apresentada no material. A afirmativa IV é falsa, pois os testes ocorrem depois da implementação, e não antes do design."
},

// 16 - Fases do RUP
{
  aula: "Aula 2 — Ciclo de Vida do Software",
  tipo: "Asserção + Justificativa",
  texto: "Uma equipe está estruturando o desenvolvimento de um grande sistema corporativo com alta complexidade e forte necessidade de documentação detalhada, optando por um modelo iterativo e orientado a casos de uso.",
  question: "Avalie as asserções a seguir sobre o modelo adotado pela equipe.",
  assertions: [
    "I. O ==term==RUP== possui exatamente três fases — concepção, elaboração e construção —, consideradas suficientes para gerenciar projetos corporativos complexos.",
    "PORQUE II. O RUP é um modelo iterativo, incremental e orientado a casos de uso, amplamente indicado para grandes sistemas corporativos que exigem documentação detalhada."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 3,
  feedback: "O **RUP** é dividido em quatro fases — concepção, elaboração, construção e transição —, e não em três, o que torna I falsa. II, no entanto, descreve corretamente suas características como modelo iterativo, incremental e orientado a casos de uso."
},

// 17 - Metodologias ágeis
{
  aula: "Aula 2 — Ciclo de Vida do Software",
  tipo: "Conceitual Contextualizada",
  texto: "Uma startup está desenvolvendo um aplicativo móvel cujos requisitos de mercado mudam com frequência. A equipe precisa incorporar rapidamente o feedback dos usuários a cada nova versão lançada, priorizando entregas frequentes e colaboração constante com o cliente.",
  question: "Considerando as características dos modelos de ciclo de vida apresentados no material, qual abordagem é mais adequada a esse cenário?",
  options: [
    "RUP, pois sua estrutura de quatro fases fixas garante maior previsibilidade em cenários de mudanças constantes",
    "Metodologias Ágeis, pois priorizam ciclos curtos, entregas frequentes e forte capacidade de adaptação às mudanças",
    "Modelo em Cascata, pois cada fase sequencial permite reavaliar os requisitos de mercado antes de avançar",
    "Modelo Espiral, pois seu foco principal está na análise formal de riscos, e não na velocidade de adaptação"
  ],
  answer: 1,
  feedback: "As **Metodologias Ágeis** trabalham com ciclos curtos e iterativos, priorizando entregas frequentes, colaboração contínua com o cliente e forte capacidade de adaptação — exatamente o que o cenário da startup exige."
},

// 18 - Teste de segurança
{
  aula: "Aula 2 — Ciclo de Vida do Software",
  tipo: "Análise Aplicada",
  texto: "Antes de lançar uma nova versão de um sistema bancário online, a equipe de qualidade realizou uma série de verificações para identificar possíveis vulnerabilidades, incluindo tentativas de ataques como SQL Injection e Cross-Site Scripting (XSS), buscando proteger os dados dos clientes contra acessos não autorizados.",
  question: "Qual tipo de teste, entre os apresentados no material, corresponde à verificação realizada pela equipe?",
  options: [
    "Teste funcional, pois verifica se cada funcionalidade do sistema bancário atende aos requisitos definidos",
    "Teste de comportamento, pois simula interações dos usuários em cenários reais de uso do sistema",
    "Teste de regressão, pois verifica se alterações recentes comprometeram funcionalidades já existentes",
    "Teste de segurança, pois identifica e corrige vulnerabilidades, como SQL Injection e XSS, protegendo o sistema contra acessos não autorizados"
  ],
  answer: 3,
  feedback: "O **teste de segurança** tem como objetivo identificar e corrigir vulnerabilidades que possam expor o sistema a acessos não autorizados ou ataques maliciosos, como os exemplos de SQL Injection e XSS citados no material."
},

// 19 - Modelo Incremental
{
  aula: "Aula 2 — Ciclo de Vida do Software",
  tipo: "Conceitual Contextualizada",
  texto: "Uma empresa de tecnologia decidiu dividir o desenvolvimento de seu sistema de gestão empresarial em módulos — contabilidade, recursos humanos e estoque —, permitindo que cada módulo passe pelas fases do ciclo de vida individualmente e seja entregue de forma progressiva aos usuários, aumentando gradualmente a funcionalidade do sistema.",
  question: "Essa estratégia de desenvolvimento, descrita no material, corresponde a qual modelo de ciclo de vida?",
  options: [
    "RAD, pois enfatiza ciclos extremamente curtos, entre 60 e 90 dias, com foco exclusivo em rapidez de entrega",
    "Modelo Incremental, pois os requisitos são agrupados em módulos, desenvolvidos individualmente e entregues de maneira progressiva",
    "Modelo Espiral, pois cada módulo corresponde a uma iteração voltada à análise contínua de riscos do projeto",
    "Modelo em Cascata, pois cada módulo deve ser finalizado por completo antes que o módulo seguinte seja sequer iniciado"
  ],
  answer: 1,
  feedback: "O **Modelo Incremental** agrupa requisitos em módulos, desenvolvidos individualmente e entregues de forma progressiva, aumentando gradualmente a funcionalidade do sistema — exatamente como descrito no cenário da gestão empresarial."
},

// 20 - Teste de usabilidade
{
  aula: "Aula 2 — Ciclo de Vida do Software",
  tipo: "Análise Aplicada",
  texto: "Uma equipe está validando um aplicativo móvel de gerenciamento de tarefas antes do lançamento. Durante os testes, usuários reais foram convidados a navegar pelas telas, criar novas tarefas e buscar informações, enquanto os avaliadores observavam se a interface era intuitiva, eficiente e fácil de utilizar, sem necessidade de instruções adicionais.",
  question: "Qual tipo de teste, entre os apresentados no material, está sendo aplicado nessa situação?",
  options: [
    "Teste de desempenho, pois avalia o tempo de resposta do aplicativo sob diferentes condições de carga de usuários",
    "Teste de regressão, pois verifica se uma alteração recente no aplicativo comprometeu funcionalidades já existentes",
    "Teste de usabilidade, pois avalia a facilidade de interação dos usuários com o aplicativo, verificando se a interface é intuitiva e eficiente",
    "Teste funcional, pois verifica exclusivamente se cada funcionalidade do aplicativo cumpre os requisitos especificados"
  ],
  answer: 2,
  feedback: "O **teste de usabilidade** avalia a facilidade de interação do usuário com o software, verificando se a navegação é intuitiva e eficiente — exatamente o que os avaliadores observaram ao acompanhar os usuários reais no aplicativo de tarefas."
},
// 21 - Modelos tradicionais x iterativos
{
  aula: "Aula 3 — Modelos Cascata e Incremental",
  tipo: "Asserção + Justificativa",
  texto: "Uma consultoria de TI está avaliando dois projetos: o primeiro é a modernização de um sistema de contabilidade com requisitos regulatórios já consolidados e pouca margem para mudanças; o segundo é uma plataforma inovadora cujos requisitos ainda dependem de validação constante junto aos usuários finais e podem mudar ao longo do desenvolvimento.",
  question: "Considerando o comparativo entre Modelos Tradicionais e Modelos Iterativos apresentado no material, avalie as asserções a seguir.",
  assertions: [
    "I. O primeiro projeto se encaixa melhor em um ==def==Modelo Tradicional==, enquanto o segundo se beneficiaria mais de um Modelo Iterativo.",
    "PORQUE II. Modelos Tradicionais têm foco em planejamento e controle, sendo ideais para requisitos estáveis, enquanto Modelos Iterativos têm foco em adaptabilidade e feedback, sendo ideais para requisitos em evolução."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "O Quadro 1 do material mostra que **Modelos Tradicionais** têm foco em planejamento e controle, sendo ideais para requisitos estáveis (caso do sistema de contabilidade), enquanto **Modelos Iterativos** têm foco em adaptabilidade e feedback, sendo ideais para requisitos em evolução (caso da plataforma inovadora). Por isso, II justifica corretamente I."
},

// 22 - Etapas do Modelo Cascata
{
  aula: "Aula 3 — Modelos Cascata e Incremental",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma fabricante de dispositivos médicos está desenvolvendo o software embarcado de um novo equipamento hospitalar. A equipe optou pelo Modelo Cascata, seguindo rigorosamente a sequência de etapas apresentada no material, com documentação detalhada produzida em cada fase.",
  question: "Avalie as afirmativas a seguir sobre o Modelo Cascata aplicado a esse projeto.",
  assertions: [
    "I. A sequência correta das etapas é Definição de Requisitos, Projeto de Sistema e Software, Implementação e Teste Unitário, Integração e Teste de Sistema, Operação e Manutenção.",
    "II. Sistemas embarcados, como os presentes em dispositivos médicos, são citados no material como exemplos de aplicação adequada do Modelo Cascata.",
    "III. A documentação detalhada produzida em cada etapa não traz nenhum benefício futuro, servindo apenas como formalidade burocrática do processo.",
    "IV. Caso surjam mudanças significativas nos requisitos em uma fase avançada do projeto, o Modelo Cascata lida com essas mudanças de forma ágil, sem gerar retrabalho."
  ],
  options: [
    "I e II, apenas",
    "I, II e III, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A sequência do Modelo Cascata segue exatamente a ordem apresentada na Figura 1 (I), e sistemas embarcados em dispositivos médicos são citados como exemplo adequado (II). A documentação detalhada serve como referência para manutenção, treinamento e futuras modificações — não é mera burocracia (III é falsa) — e mudanças tardias nos requisitos tendem a gerar retrabalho, custos e atrasos, e não agilidade (IV é falsa)."
},

// 23 - Modelo Incremental
{
  aula: "Aula 3 — Modelos Cascata e Incremental",
  tipo: "Conceitual Contextualizada",
  texto: "Um banco digital está desenvolvendo sua plataforma de serviços financeiros. A equipe decidiu entregar primeiro a funcionalidade de abertura de contas, depois transferências bancárias, em seguida pagamentos e, por fim, investimentos — cada uma passando por análise, design, implementação, testes e integração antes de ser disponibilizada aos clientes.",
  question: "A estratégia adotada pelo banco digital exemplifica qual modelo apresentado no material?",
  options: [
    "Modelo Cascata, pois cada funcionalidade representa uma fase única que deve ser concluída antes de qualquer outra atividade do projeto",
    "Modelo Incremental, pois o sistema é dividido em incrementos funcionais entregues gradualmente, cada um passando pelas próprias fases de desenvolvimento",
    "Modelo Tradicional, pois a entrega de funcionalidades separadas indica um processo totalmente linear e sem retorno a etapas anteriores",
    "Nenhum dos modelos citados, pois a entrega de funcionalidades separadas não é uma prática reconhecida no material"
  ],
  answer: 1,
  feedback: "O cenário do banco digital é citado literalmente no material como exemplo de aplicação do **Modelo Incremental**, que divide o sistema em incrementos funcionais — como abertura de contas, transferências, pagamentos e investimentos —, cada um passando pelas etapas de análise, design, implementação, testes e integração antes de ser entregue."
},

// 24 - Vantagens e desvantagens do Cascata
{
  aula: "Aula 3 — Modelos Cascata e Incremental",
  tipo: "Análise Aplicada",
  texto: "Durante a fase final de testes de um sistema de gestão de dados desenvolvido com o Modelo Cascata, os stakeholders solicitaram uma mudança significativa em um dos requisitos centrais do sistema, algo que não havia sido previsto durante a fase de definição de requisitos.",
  question: "Com base nas características do Modelo Cascata apresentadas no material, qual é a consequência mais provável dessa situação?",
  options: [
    "A mudança será incorporada facilmente, já que o Modelo Cascata foi desenhado justamente para acomodar alterações tardias sem custos adicionais",
    "A mudança provavelmente causará retrabalho, aumento de custos e atrasos no cronograma, já que a estrutura sequencial dificulta alterações em fases avançadas",
    "A mudança não terá nenhum impacto no projeto, pois o Modelo Cascata permite retornar livremente a qualquer etapa anterior sem custo",
    "A mudança exigirá a substituição do Modelo Cascata pelo Modelo Iterativo antes que qualquer ajuste possa ser realizado"
  ],
  answer: 1,
  feedback: "Uma das principais desvantagens do **Modelo Cascata** é a inflexibilidade diante de mudanças, especialmente em fases avançadas, o que tende a gerar retrabalho, custos adicionais e atrasos no cronograma — exatamente o risco descrito no cenário do sistema de gestão de dados."
},

// 25 - Cascata x Incremental
{
  aula: "Aula 3 — Modelos Cascata e Incremental",
  tipo: "Múltiplas Afirmativas",
  texto: "Duas equipes de desenvolvimento estão comparando suas experiências: a Equipe A trabalhou em um projeto com estrutura linear e sequencial, com pouco envolvimento do cliente ao longo do processo; a Equipe B trabalhou em um projeto dividido em incrementos funcionais, com entregas graduais e forte participação dos stakeholders durante todo o desenvolvimento.",
  question: "Com base no comparativo entre Modelo Cascata e Modelo Incremental apresentado no material, avalie as afirmativas a seguir.",
  assertions: [
    "I. A experiência da Equipe A é característica do Modelo Cascata, que tende a apresentar menor envolvimento do cliente ao longo do processo.",
    "II. A experiência da Equipe B é característica do Modelo Incremental, que favorece maior envolvimento e feedback contínuo do cliente.",
    "III. No Modelo Incremental, assim como no Cascata, os problemas do projeto só podem ser identificados após a conclusão total do sistema.",
    "IV. O Modelo Cascata tende a apresentar um gerenciamento mais simples, com estrutura clara, enquanto o Modelo Incremental costuma ser mais complexo pela coordenação entre incrementos."
  ],
  options: [
    "I e II, apenas",
    "I, II e IV, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "O comparativo do material associa o **Cascata** a menor envolvimento do cliente (I) e o **Incremental** a maior envolvimento e feedback contínuo (II), além de um gerenciamento mais simples no Cascata e mais complexo no Incremental (IV). A afirmativa III é falsa, pois uma das vantagens do Incremental é justamente identificar problemas mais cedo, ao longo dos incrementos."
},

// 26 - Modelos iterativos (RUP)
{
  aula: "Aula 3 — Modelos Cascata e Incremental",
  tipo: "Conceitual Contextualizada",
  texto: "Uma equipe está desenvolvendo um sistema complexo cujo processo é dividido em ciclos repetitivos de planejamento, design, implementação e testes. A cada ciclo, o projeto é revisado e ajustado com base no feedback dos stakeholders, permitindo identificar problemas precocemente e promover melhoria contínua.",
  question: "Segundo o material, essa abordagem descreve qual categoria de modelo de desenvolvimento?",
  options: [
    "Modelos Tradicionais, pois o foco está exclusivamente em planejamento e controle rígido das etapas",
    "Modelos Iterativos, representados no material pelo Rational Unified Process (RUP), caracterizados por ciclos, feedback e melhoria contínua",
    "Modelos Incrementais, pois a entrega ocorre exclusivamente por meio de módulos funcionais independentes e sem revisão cíclica",
    "Modelo Cascata, pois a estrutura sequencial rígida favorece revisões constantes durante o desenvolvimento"
  ],
  answer: 1,
  feedback: "Os **Modelos Iterativos**, exemplificados no material pelo RUP, utilizam ciclos repetitivos de planejamento, design, implementação e testes, permitindo revisar o projeto, identificar problemas precocemente e incorporar feedback continuamente."
},

// 27 - Aplicações do Modelo Cascata
{
  aula: "Aula 3 — Modelos Cascata e Incremental",
  tipo: "Análise Aplicada",
  texto: "Uma empresa de eletrodomésticos está desenvolvendo o firmware de uma nova linha de fogões inteligentes. Os requisitos técnicos já foram amplamente definidos com base em normas de segurança e especificações de hardware, com pouquíssima expectativa de alterações durante o desenvolvimento.",
  question: "Considerando os exemplos de aplicação apresentados no material, qual modelo seria mais indicado para esse projeto?",
  options: [
    "Modelo Incremental, pois sistemas embarcados exigem entrega gradual de funcionalidades para adaptação constante às normas de segurança",
    "Modelo Cascata, pois sistemas embarcados com requisitos bem definidos e estáveis são citados no material como aplicação adequada desse modelo",
    "Modelo Iterativo, pois o firmware exige ciclos de revisão constante devido à complexidade do hardware envolvido",
    "Nenhum dos modelos apresentados é adequado, pois sistemas embarcados não são mencionados no material"
  ],
  answer: 1,
  feedback: "O material cita explicitamente **sistemas embarcados** — presentes em carros, eletrodomésticos e dispositivos médicos — como exemplo de aplicação do **Modelo Cascata**, justamente por geralmente possuírem requisitos bem definidos e estáveis, como no caso do firmware do fogão inteligente."
},

// 28 - Desvantagens do Incremental
{
  aula: "Aula 3 — Modelos Cascata e Incremental",
  tipo: "Asserção + Justificativa",
  texto: "Uma equipe que desenvolve um sistema hospitalar utilizando o Modelo Incremental está enfrentando dificuldades para coordenar a integração entre os diversos incrementos já entregues, além de precisar manter comunicação constante entre desenvolvedores, stakeholders e clientes.",
  question: "Avalie as asserções a seguir sobre a situação enfrentada pela equipe.",
  assertions: [
    "I. As dificuldades relatadas são compatíveis com as desvantagens do ==rule==Modelo Incremental== apontadas no material, como maior complexidade de gerenciamento e necessidade de comunicação constante.",
    "PORQUE II. O Modelo Incremental elimina totalmente a necessidade de testes e integração entre as partes do sistema, já que cada incremento funciona de forma completamente isolada."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 2,
  feedback: "As dificuldades descritas correspondem, de fato, às desvantagens do **Modelo Incremental** citadas no material, como maior complexidade de gerenciamento e necessidade de comunicação constante (I é verdadeira). No entanto, o modelo exige justamente o contrário do afirmado em II: integração contínua e testes frequentes entre os incrementos são essenciais, tornando II falsa."
},

// 29 - Modelo de Desenvolvimento Evolucionário
{
  aula: "Aula 3 — Modelos Cascata e Incremental",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma startup de saúde está desenvolvendo um sistema de prontuário eletrônico. A equipe optou por dividir o desenvolvimento em módulos funcionais entregues gradualmente, permitindo que o hospital parceiro utilize e forneça feedback sobre cada parte do sistema antes da entrega completa.",
  question: "Avalie as afirmativas a seguir sobre esse cenário, considerando os conceitos apresentados no material.",
  assertions: [
    "I. O Modelo Incremental também é chamado, no material, de Modelo de Desenvolvimento Evolucionário.",
    "II. Sistemas de saúde, como prontuários eletrônicos, são citados no material como exemplos de aplicação do Modelo Incremental.",
    "III. Nesse modelo, cada incremento entregue não pode receber feedback dos usuários antes da finalização completa do sistema.",
    "IV. A divisão em incrementos permite identificar problemas mais cedo e reduzir riscos ao longo do desenvolvimento."
  ],
  options: [
    "I e II, apenas",
    "I, II e IV, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "O material chama o Modelo Incremental de **Modelo de Desenvolvimento Evolucionário** (I) e cita sistemas de saúde como exemplo de aplicação (II). A afirmativa III é falsa, pois um dos benefícios do modelo é justamente permitir feedback antecipado a cada incremento entregue, o que também contribui para a redução de riscos (IV)."
},

// 30 - Fatores de escolha do modelo
{
  aula: "Aula 3 — Modelos Cascata e Incremental",
  tipo: "Conceitual Contextualizada",
  texto: "Uma equipe de projeto está decidindo entre o Modelo Cascata e o Modelo Incremental para o desenvolvimento de um novo sistema de gestão de dados que precisa atender a regulamentações específicas do setor, mas cujas funcionalidades adicionais poderão ser ajustadas conforme o feedback dos usuários após o lançamento inicial.",
  question: "Considerando os critérios de escolha entre os modelos apresentados no material, qual fator seria mais relevante para orientar essa decisão?",
  options: [
    "Apenas o tamanho da equipe de desenvolvimento disponível para o projeto, já que esse é o único critério citado no material",
    "A estabilidade dos requisitos, o ambiente de desenvolvimento e as expectativas dos stakeholders quanto a mudanças e entregas graduais",
    "Exclusivamente o custo total do projeto, sem relação com a estabilidade dos requisitos ou o ambiente de desenvolvimento",
    "A linguagem de programação escolhida para o desenvolvimento, já que ela determina automaticamente qual modelo deve ser utilizado"
  ],
  answer: 1,
  feedback: "O material indica que a escolha entre os modelos deve considerar principalmente a **estabilidade dos requisitos**, o **ambiente de desenvolvimento** e as **expectativas dos stakeholders** — fatores que, no cenário descrito, apontam para uma combinação de exigências regulatórias estáveis com necessidade de ajustes graduais, características centrais dessa decisão."
},

// 31 - Manifesto Ágil
{
  aula: "Aula 4 — Métodos Ágeis",
  tipo: "Asserção + Justificativa",
  texto: "Uma equipe de desenvolvimento está discutindo mudanças em seu processo de trabalho. Um dos desenvolvedores propõe reduzir a quantidade de documentação extensa produzida antes de cada entrega, priorizando a construção de versões funcionais do software que possam ser testadas e avaliadas pelo cliente com frequência.",
  question: "Considerando os valores do Manifesto Ágil apresentados no material, avalie as asserções a seguir.",
  assertions: [
    "I. A proposta do desenvolvedor está alinhada ao valor ágil de ==def==\"Software em funcionamento mais que documentação abrangente\"==.",
    "PORQUE II. O Manifesto Ágil estabelece que a documentação deve ser completamente eliminada de qualquer projeto de desenvolvimento de software, independentemente do contexto."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 2,
  feedback: "A proposta do desenvolvedor está de fato alinhada ao valor de priorizar **software funcionando** em vez de documentação abrangente (I é verdadeira). No entanto, o Manifesto Ágil não prega a eliminação total da documentação, apenas prioriza a entrega de software funcional sobre documentação excessiva — tornando II falsa."
},

// 32 - Papéis do Scrum
{
  aula: "Aula 4 — Métodos Ágeis",
  tipo: "Múltiplas Afirmativas",
  texto: "Em uma equipe Scrum de uma fintech, Marina é responsável por definir a visão do produto e priorizar os itens do backlog; Carlos atua removendo obstáculos da equipe e garantindo que os princípios do Scrum sejam seguidos; e o restante do time é formado por desenvolvedores e testadores que transformam as histórias de usuário em funcionalidades entregáveis.",
  question: "Avalie as afirmativas a seguir sobre os papéis exercidos nessa equipe Scrum.",
  assertions: [
    "I. Marina exerce o papel de Product Owner, atuando como a 'voz' do cliente dentro do projeto.",
    "II. Carlos exerce o papel de Scrum Master, atuando como guardião do processo Scrum.",
    "III. Os desenvolvedores e testadores mencionados correspondem ao Time de Desenvolvimento, descrito como a força motriz do projeto.",
    "IV. Os quatro papéis do Scrum descritos no material são Product Owner, Scrum Master, Time de Desenvolvimento e Cliente Final, sendo este último responsável por escrever o código do sistema."
  ],
  options: [
    "I e II, apenas",
    "I, II e III, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "Marina corresponde ao **Product Owner** (I), Carlos ao **Scrum Master** (II), e os desenvolvedores/testadores ao **Time de Desenvolvimento** (III). A afirmativa IV é falsa, pois o quarto papel do Scrum é o de **Stakeholders**, e não 'Cliente Final' responsável por escrever código — essa é uma função do Time de Desenvolvimento."
},

// 33 - Burndown Chart
{
  aula: "Aula 4 — Métodos Ágeis",
  tipo: "Análise Aplicada",
  texto: "Durante uma sprint de 10 dias, o Scrum Master de uma equipe percebeu que, a partir do quinto dia, a Linha de Trabalho Restante Real do Burndown Chart passou a se manter consistentemente acima da Linha de Trabalho Restante Ideal, indicando que a quantidade de pontos de complexidade restantes era maior do que o esperado para aquele momento da sprint.",
  question: "Com base no funcionamento do Burndown Chart apresentado no material, o que essa situação indica sobre o andamento da sprint?",
  options: [
    "A equipe está adiantada em relação ao cronograma planejado e poderá incorporar novos itens ao Sprint Backlog sem qualquer risco",
    "A equipe está em bom ritmo, pois a Linha Real acima da Linha Ideal é o comportamento esperado em qualquer sprint bem-sucedida",
    "A equipe está atrasada em relação ao ritmo ideal de trabalho, podendo ser necessário melhorar o ritmo ou revisar o planejamento do tempo restante",
    "O gráfico está incorreto, já que a Linha Real nunca pode ultrapassar a Linha Ideal em nenhum momento da sprint"
  ],
  answer: 2,
  feedback: "Segundo o material, quando a **Linha de Trabalho Restante Real** se mantém acima da Linha Ideal, isso indica que a equipe está atrasada em relação ao ritmo esperado, sendo necessário melhorar o ritmo de trabalho ou revisar o planejamento do tempo do projeto."
},

// 34 - Scrum x XP
{
  aula: "Aula 4 — Métodos Ágeis",
  tipo: "Conceitual Contextualizada",
  texto: "Uma equipe de desenvolvimento de software está decidindo entre adotar práticas voltadas à engenharia técnica — como testes unitários, integração contínua e programação em pares — ou uma abordagem mais estruturada em papéis organizacionais e sprints de duração fixa, com cerimônias bem definidas para marcar o início, meio e fim de cada ciclo.",
  question: "Considerando o comparativo entre Scrum e Extreme Programming (XP) apresentado no material, a segunda abordagem descrita — baseada em papéis organizacionais e sprints fixos — corresponde a qual metodologia?",
  options: [
    "Extreme Programming (XP), pois seu foco está na engenharia de software e na qualidade técnica do código produzido",
    "Scrum, pois assume uma visão mais gerencial, estruturando o fluxo de trabalho em sprints e definindo papéis como Product Owner e Scrum Master",
    "Kanban, pois se baseia exclusivamente na visualização do fluxo de trabalho sem definição de papéis organizacionais",
    "Lean, pois seu foco central está na eliminação de desperdícios durante o processo de desenvolvimento"
  ],
  answer: 1,
  feedback: "O **Scrum** assume uma visão gerencial, estruturando o trabalho em sprints de duração fixa e definindo papéis como Product Owner e Scrum Master, além de um conjunto de cerimônias que marcam o início, meio e fim de cada sprint — diferentemente do XP, mais voltado a práticas técnicas de engenharia."
},

// 35 - Testes unitários e refatoração
{
  aula: "Aula 4 — Métodos Ágeis",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma equipe que adota Extreme Programming (XP) escreve testes automatizados para cada nova funcionalidade antes de considerá-la concluída, reorganiza periodicamente trechos do código para torná-lo mais limpo e fácil de manter, e integra as alterações de todos os desenvolvedores à base principal do código várias vezes ao dia.",
  question: "Avalie as afirmativas a seguir sobre as práticas adotadas por essa equipe.",
  assertions: [
    "I. A escrita de testes automatizados para garantir que cada funcionalidade funcione corretamente corresponde à prática de Testes Unitários.",
    "II. A reorganização do código para torná-lo mais limpo e fácil de manter corresponde à prática de Refatoração.",
    "III. A integração frequente das alterações de todos os desenvolvedores à base principal corresponde à prática de Integração Contínua.",
    "IV. Essas três práticas são exclusivas do Scrum e não fazem parte do conjunto de práticas do XP apresentado no material."
  ],
  options: [
    "I e II, apenas",
    "I, II e III, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "As três práticas descritas — **Testes Unitários** (I), **Refatoração** (II) e **Integração Contínua** (III) — são exatamente práticas do XP apresentadas no material. A afirmativa IV é falsa, pois essas práticas pertencem ao conjunto de nove práticas do XP, e não ao Scrum."
},

// 36 - Comparação métodos ágeis x tradicionais
{
  aula: "Aula 4 — Métodos Ágeis",
  tipo: "Análise Aplicada",
  texto: "Uma empresa que utilizava um processo de desenvolvimento tradicional, com documentação extensa produzida no início do projeto e feedback do cliente restrito a fases específicas, decidiu migrar para uma abordagem em que o cliente participa continuamente do processo e o software é entregue em pequenos incrementos ao longo de todo o desenvolvimento.",
  question: "Com base no Quadro Comparativo entre Métodos Tradicionais e Ágeis apresentado no material, essa mudança representa uma transição em qual dos seguintes aspectos?",
  options: [
    "Uma mudança apenas na linguagem de programação utilizada pela equipe, sem qualquer relação com o processo de desenvolvimento",
    "Uma transição de feedback do cliente limitado a fases específicas para feedback contínuo e constante, e de entrega ao final do projeto para entregas frequentes em pequenos incrementos",
    "Uma transição de um método ágil para um método tradicional, já que a entrega em incrementos é característica exclusiva de processos sequenciais",
    "Nenhuma mudança relevante, pois o Quadro Comparativo não menciona diferenças quanto ao feedback do cliente ou à frequência de entrega"
  ],
  answer: 1,
  feedback: "O Quadro Comparativo do material mostra que os métodos tradicionais têm feedback do cliente **limitado a fases específicas** e entrega **ao final do projeto**, enquanto os métodos ágeis oferecem feedback **contínuo** e entregas **frequentes em pequenos incrementos** — exatamente a transição descrita no cenário."
},

// 37 - Reuniões do Scrum
{
  aula: "Aula 4 — Métodos Ágeis",
  tipo: "Conceitual Contextualizada",
  texto: "Ao final de cada sprint, uma equipe se reúne para apresentar aos stakeholders as funcionalidades desenvolvidas naquele ciclo, recebendo validação do Product Owner e sugestões de melhorias ou novas ideias para os próximos sprints.",
  question: "Segundo o material, essa reunião corresponde a qual cerimônia do Scrum?",
  options: [
    "Sprint Planning, pois é o momento em que a equipe define o escopo e as prioridades do próximo sprint",
    "Scrum Daily, pois é o momento em que os membros compartilham avanços e obstáculos diários",
    "Sprint Review, pois é a oportunidade de mostrar o que foi realizado no sprint e receber feedback dos stakeholders",
    "Sprint Retrospective, pois é o momento de discutir o que deu certo e o que deu errado durante o sprint"
  ],
  answer: 2,
  feedback: "A **Sprint Review** é a cerimônia em que a equipe apresenta o trabalho realizado durante o sprint aos stakeholders, recebendo validação do Product Owner e sugestões de melhorias — diferente da Retrospective, que foca na reflexão interna da equipe sobre o processo."
},

// 38 - Pilares do Scrum
{
  aula: "Aula 4 — Métodos Ágeis",
  tipo: "Asserção + Justificativa",
  texto: "Em uma equipe Scrum, todas as informações sobre o andamento do projeto são disponibilizadas abertamente a todos os membros e partes interessadas, a equipe revisa regularmente seu progresso para identificar melhorias, e está sempre disposta a ajustar sua abordagem conforme surgem novas informações ao longo do desenvolvimento.",
  question: "Avalie as asserções a seguir sobre essa equipe.",
  assertions: [
    "I. As práticas descritas representam, respectivamente, os três ==rule==pilares do Scrum==: transparência, inspeção e adaptação.",
    "PORQUE II. O Scrum é definido no material como uma metodologia de gerenciamento de projetos baseada em sprints, fundamentada nesses três pilares."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "As práticas descritas correspondem exatamente aos três pilares do **Scrum**: disponibilizar informações abertamente é **transparência**, revisar regularmente o progresso é **inspeção**, e ajustar a abordagem conforme novas informações é **adaptação**. Como o material define o Scrum justamente com base nesses três pilares, II justifica corretamente I."
},

// 39 - Princípios do Manifesto Ágil
{
  aula: "Aula 4 — Métodos Ágeis",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma equipe de desenvolvimento decidiu aceitar uma mudança significativa de requisitos solicitada pelo cliente mesmo em uma fase avançada do projeto, priorizar reuniões presenciais em vez de longas trocas de e-mails para resolver dúvidas técnicas, e permitir que a própria equipe, sem intervenção externa, decidisse a arquitetura do sistema.",
  question: "Avalie as afirmativas a seguir sobre essas decisões, à luz dos princípios do Manifesto Ágil apresentados no material.",
  assertions: [
    "I. Aceitar mudanças de requisitos mesmo em fase avançada do desenvolvimento está alinhado a um dos doze princípios do Manifesto Ágil.",
    "II. Priorizar a conversa face a face em vez de e-mails está alinhado ao princípio de que essa é a forma mais eficiente de transmitir informações.",
    "III. Permitir que a equipe decida a arquitetura sem intervenção externa contraria o princípio de que as melhores arquiteturas emergem de equipes auto-organizadas.",
    "IV. Esses três princípios pertencem aos quatro valores fundamentais do Manifesto Ágil, e não aos doze princípios detalhados no material."
  ],
  options: [
    "I e II, apenas",
    "I, II e III, apenas",
    "I, II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "Aceitar mudanças tardias de requisitos (I) e priorizar a comunicação face a face (II) correspondem a princípios explícitos do Manifesto Ágil. A afirmativa III é falsa, pois permitir que a equipe decida a arquitetura sem intervenção externa está de acordo com — e não contraria — o princípio das equipes auto-organizadas. A afirmativa IV também é falsa, pois esses três itens fazem parte dos doze princípios, e não dos quatro valores fundamentais."
},

// 40 - História dos métodos ágeis
{
  aula: "Aula 4 — Métodos Ágeis",
  tipo: "Análise Aplicada",
  texto: "Um pesquisador está estudando a origem histórica das metodologias ágeis para uma apresentação acadêmica. Ele identificou que duas metodologias específicas surgiram na década de 1990 como resposta à rigidez dos modelos tradicionais: uma delas foi liderada por Ken Schwaber e Jeff Sutherland, e a outra foi criada por Kent Beck e Ward Cunningham, sendo posteriormente aplicada no projeto C3 da Chrysler.",
  question: "Com base no material, quais metodologias o pesquisador identificou, respectivamente?",
  options: [
    "Kanban e Lean, pois ambas surgiram na década de 1990 como ferramentas complementares aos métodos ágeis",
    "Scrum e Extreme Programming (XP), já que o Scrum foi liderado por Schwaber e Sutherland, e o XP foi criado por Beck e Cunningham",
    "Extreme Programming (XP) e Scrum, já que o XP foi liderado por Schwaber e Sutherland, e o Scrum foi criado por Beck e Cunningham",
    "DevOps e Kanban, pois ambos são citados no material como metodologias criadas na mesma década pelos mesmos autores"
  ],
  answer: 1,
  feedback: "O material indica que o **Scrum** foi liderado por Ken Schwaber e Jeff Sutherland, enquanto o **Extreme Programming (XP)** foi criado por Kent Beck e Ward Cunningham, sendo o XP posteriormente aplicado no projeto C3 da Chrysler, conforme descrito na seção sobre a origem do XP."
},
// 41 - Elicitação x Análise
{
  aula: "Aula 5 — Análise de Requisitos",
  tipo: "Asserção + Justificativa",
  texto: "A equipe responsável pelo desenvolvimento de um sistema de gerenciamento de projetos realizou entrevistas com gerentes para descobrir quais funcionalidades eles esperavam do software, como criar projetos, atribuir tarefas e gerar relatórios de status. Em seguida, essas informações foram organizadas em categorias, tiveram inconsistências identificadas e foram priorizadas conforme a urgência de cada funcionalidade.",
  question: "Considerando as etapas do processo de requisitos apresentadas no material, avalie as asserções a seguir.",
  assertions: [
    "I. A primeira etapa descrita, de conversar com os gerentes para descobrir as funcionalidades esperadas, corresponde à ==def==elicitação== de requisitos.",
    "PORQUE II. A elicitação é a etapa em que se refina, organiza e prioriza as informações já coletadas, sem envolver contato direto com os stakeholders."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 2,
  feedback: "A etapa de entrevistar gerentes para descobrir necessidades corresponde de fato à **elicitação** (I é verdadeira). No entanto, é a **análise** — e não a elicitação — que refina, organiza e prioriza as informações já coletadas; a elicitação envolve justamente o contato direto com os stakeholders, tornando II falsa."
},

// 42 - Requisitos funcionais e não funcionais
{
  aula: "Aula 5 — Análise de Requisitos",
  tipo: "Múltiplas Afirmativas",
  texto: "No desenvolvimento de um sistema de prontuário eletrônico, foram levantados os seguintes itens: permitir o cadastro de novos pacientes com nome, idade e contatos; garantir que o sistema responda às solicitações em menos de 2 segundos durante operações normais; permitir que médicos registrem prescrições de medicamentos; e assegurar que o sistema esteja disponível 99,9% do tempo, excluindo manutenções programadas.",
  question: "Avalie as afirmativas a seguir sobre a classificação desses itens.",
  assertions: [
    "I. O cadastro de pacientes e o registro de prescrições de medicamentos são exemplos de requisitos funcionais, pois definem o que o sistema deve fazer.",
    "II. A meta de resposta em menos de 2 segundos é um requisito não funcional relacionado a desempenho.",
    "III. A meta de disponibilidade de 99,9% do tempo é um requisito não funcional relacionado a confiabilidade.",
    "IV. Requisitos não funcionais são sempre menos importantes que requisitos funcionais, já que não afetam diretamente a experiência do usuário."
  ],
  options: [
    "I e II, apenas",
    "I, II e III, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "Cadastro de pacientes e registro de prescrições são **requisitos funcionais** (I), enquanto a meta de resposta em menos de 2 segundos é um requisito não funcional de **desempenho** (II) e a disponibilidade de 99,9% é de **confiabilidade** (III). A afirmativa IV é falsa, pois o material apresenta as duas categorias como complementares e igualmente importantes — a 'melodia' e a 'harmonia' da mesma música."
},

// 43 - MVP
{
  aula: "Aula 5 — Análise de Requisitos",
  tipo: "Conceitual Contextualizada",
  texto: "Uma equipe está desenvolvendo um software de gerenciamento de eventos. Em vez de implementar todas as funcionalidades planejadas de uma só vez, a equipe decidiu lançar primeiro apenas a criação de eventos e a gestão de convidados, coletando feedback dos usuários antes de adicionar a criação de tarefas e o envio de convites por e-mail nas versões seguintes.",
  question: "Essa estratégia de desenvolvimento, descrita no material, está associada a qual conceito?",
  options: [
    "Escopo Fixo de Produto, pois todas as funcionalidades planejadas foram definidas antecipadamente e não podem ser alteradas",
    "MVP (Minimum Viable Product), pois representa a versão mais simples e funcional do produto, priorizando funcionalidades essenciais e validando hipóteses com o menor investimento possível",
    "Requisito Não Funcional, pois a estratégia está relacionada à escalabilidade do sistema conforme o número de usuários cresce",
    "Critério de Aceitação, pois define as condições que o software deve cumprir para ser aceito pelo cliente"
  ],
  answer: 1,
  feedback: "A estratégia descrita — lançar uma versão inicial com as funcionalidades essenciais e evoluir com base no feedback dos usuários — é exatamente a definição de **MVP (Produto Mínimo Viável)** apresentada no material, exemplificada pelo caso do Event Planner."
},

// 44 - Critérios de aceitação
{
  aula: "Aula 5 — Análise de Requisitos",
  tipo: "Análise Aplicada",
  texto: "Para a User Story 'Como recepcionista do hospital, eu quero cadastrar novos pacientes com informações básicas, para que possamos ter um registro completo dos pacientes que chegam ao hospital', a equipe definiu que o sistema deve validar campos obrigatórios como nome e número de contato, e que, ao salvar o cadastro, deve confirmar a criação e gerar um número de identificação único para o paciente.",
  question: "As condições definidas pela equipe para considerar essa funcionalidade completa correspondem a qual elemento apresentado no material?",
  options: [
    "Requisitos não funcionais, pois tratam exclusivamente de aspectos de qualidade do sistema, como segurança e desempenho",
    "Critérios de aceitação, pois definem condições claras, mensuráveis e objetivas que a User Story deve cumprir para ser considerada completa e funcional",
    "Elicitação de requisitos, pois representam o primeiro contato da equipe com as necessidades do cliente",
    "Documento de Requisitos do Sistema, pois estabelece o escopo completo do projeto e o cronograma de entrega"
  ],
  answer: 1,
  feedback: "As condições descritas são **critérios de aceitação**: um conjunto de condições claras, mensuráveis e objetivas que a User Story deve atender para ser considerada completa, servindo também de base para validação e testes do sistema."
},

// 45 - Escopo Fixo x Escopo Variado
{
  aula: "Aula 5 — Análise de Requisitos",
  tipo: "Múltiplas Afirmativas",
  texto: "Durante o desenvolvimento de um sistema, o gerente de projeto defende que nenhuma funcionalidade definida no início deve ser alterada, adicionada ou removida ao longo do desenvolvimento, mesmo que novas necessidades surjam. Já a equipe técnica argumenta que o escopo deveria ser discutido e ajustado em diferentes momentos do projeto, à medida que o sistema evolui e o negócio muda.",
  question: "Avalie as afirmativas a seguir sobre as posições defendidas pelo gerente e pela equipe técnica.",
  assertions: [
    "I. A posição do gerente de projeto corresponde à filosofia de ==rule==Escopo Fixo de Produto==, apresentada no material.",
    "II. A posição da equipe técnica corresponde à filosofia de Escopo Variado de Produto, associada aos Métodos Ágeis.",
    "III. O material apresenta o Escopo Fixo como a filosofia declaradamente preferida pelo autor do capítulo.",
    "IV. Segundo o material, novas necessidades não podem surgir durante o desenvolvimento e o uso do sistema, já que a análise inicial deve esgotar todas as funcionalidades."
  ],
  options: [
    "I e II, apenas",
    "I, II e III, apenas",
    "I, II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A posição do gerente reflete o **Escopo Fixo de Produto** (I), enquanto a da equipe técnica reflete o **Escopo Variado de Produto** (II). As afirmativas III e IV são falsas: o autor declara preferir o Escopo Variado, e o próprio material reconhece que novas necessidades podem surgir durante o desenvolvimento e o uso do sistema."
},

// 46 - Requisitos não funcionais - confiabilidade
{
  aula: "Aula 5 — Análise de Requisitos",
  tipo: "Asserção + Justificativa",
  texto: "Um hospital exige que o sistema de prontuário eletrônico esteja disponível e funcional pelo menos 99,9% do tempo, excluindo períodos de manutenção programada, garantindo que médicos e enfermeiros possam depender do sistema sem interrupções inesperadas durante o atendimento aos pacientes.",
  question: "Avalie as asserções a seguir sobre essa exigência.",
  assertions: [
    "I. Essa exigência corresponde ao requisito não funcional de ==term==confiabilidade==, apresentado no material.",
    "PORQUE II. A confiabilidade descreve a capacidade do sistema de estar disponível e funcional durante a maior parte do tempo, garantindo que os usuários possam depender dele sem interrupções inesperadas."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "A exigência de disponibilidade de 99,9% do tempo é exatamente a definição de **confiabilidade** apresentada no material, que trata da capacidade do sistema de permanecer disponível e funcional, sem interrupções inesperadas. Como essa é a própria definição do conceito, II justifica corretamente I."
},

// 47 - User Stories
{
  aula: "Aula 5 — Análise de Requisitos",
  tipo: "Conceitual Contextualizada",
  texto: "Ao documentar uma funcionalidade do sistema de prontuário eletrônico, a equipe escreveu o seguinte texto: 'Como recepcionista do hospital, eu quero atualizar, editar e excluir os dados cadastrais dos pacientes, para que possamos manter as informações dos pacientes sempre atualizadas e corretas.'",
  question: "Esse tipo de descrição, utilizada para comunicar funcionalidades de forma clara entre a equipe técnica e os clientes, é chamada no material de:",
  options: [
    "Documento de Requisitos do Sistema, pois estabelece o escopo completo e o cronograma de entrega do projeto",
    "Requisito Não Funcional, pois descreve uma característica de qualidade que o sistema deve possuir",
    "User Story, pois descreve o usuário, a ação desejada e o objetivo dessa ação, em linguagem próxima do cliente",
    "Ferramenta CASE, pois é um software especializado utilizado para gerenciamento e documentação de requisitos"
  ],
  answer: 2,
  feedback: "O texto segue o formato de uma **User Story**, técnica que descreve o usuário, a ação que ele deseja realizar e o objetivo dessa ação, utilizando uma linguagem próxima do cliente para facilitar a comunicação entre a equipe técnica e os stakeholders."
},

// 48 - Identificação de requisito não funcional
{
  aula: "Aula 5 — Análise de Requisitos",
  tipo: "Análise Aplicada",
  texto: "Uma empresa de e-commerce exige que seu sistema possa ser acessado corretamente tanto por computadores desktop quanto por tablets e smartphones, com diferentes navegadores, garantindo que a experiência do usuário seja consistente e eficiente em todos os dispositivos.",
  question: "Essa exigência corresponde a qual requisito não funcional apresentado no material?",
  options: [
    "Compatibilidade, pois exige que o sistema seja acessível a partir de diferentes dispositivos e navegadores, mantendo uma experiência consistente",
    "Escalabilidade, pois assegura que o sistema possa crescer e se adaptar a um aumento no número de usuários e registros",
    "Manutenibilidade, pois garante que o sistema seja fácil de manter e atualizar, com documentação clara do código",
    "Usabilidade, pois exige que a interface seja intuitiva e fácil de usar, sem necessidade de treinamento extensivo"
  ],
  answer: 0,
  feedback: "A exigência de funcionamento consistente em diferentes dispositivos e navegadores corresponde ao requisito não funcional de **compatibilidade**, apresentado no material como a capacidade do sistema de ser acessado a partir de desktops, tablets e smartphones."
},

// 49 - Técnicas e ferramentas de elicitação
{
  aula: "Aula 5 — Análise de Requisitos",
  tipo: "Múltiplas Afirmativas",
  texto: "Para desenvolver um sistema de e-commerce, a equipe realizou workshops com clientes e vendedores para entender suas expectativas, aplicou questionários a um grupo maior de usuários e utilizou protótipos interativos para validar a disposição das telas de compra antes da implementação definitiva.",
  question: "Avalie as afirmativas a seguir sobre as técnicas e ferramentas utilizadas pela equipe.",
  assertions: [
    "I. Os workshops realizados com clientes e vendedores são citados no material como uma técnica de elicitação de requisitos.",
    "II. Os questionários aplicados a um grupo maior de stakeholders também são citados como técnica de elicitação de requisitos.",
    "III. Os protótipos interativos utilizados para validar as telas de compra são citados no material como uma ferramenta de apoio à elicitação e análise de requisitos.",
    "IV. Ferramentas CASE, entrevistas e diagramas de casos de uso não são mencionados no material como técnicas ou ferramentas relacionadas a requisitos."
  ],
  options: [
    "I e II, apenas",
    "I, II e III, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "Workshops (I) e questionários (II) são citados como técnicas de elicitação, e protótipos (III) como ferramenta de apoio à elicitação e análise. A afirmativa IV é falsa, pois o material cita explicitamente entrevistas, diagramas de casos de uso e ferramentas CASE como técnicas e ferramentas relacionadas ao processo de requisitos."
},

// 50 - Priorização de requisitos funcionais
{
  aula: "Aula 5 — Análise de Requisitos",
  tipo: "Conceitual Contextualizada",
  texto: "Durante o levantamento de requisitos de um sistema de gerenciamento de projetos, a equipe técnica e os clientes discutiram intensamente quais funcionalidades seriam indispensáveis para que o sistema pudesse entrar em produção, e quais poderiam ser implementadas em um momento posterior, resultando em um documento que estabelece o escopo, a descrição, as prioridades e o cronograma de entrega de cada funcionalidade.",
  question: "Esse documento, resultado da comunicação entre equipe técnica e clientes para definir prioridades, é chamado no material de:",
  options: [
    "User Story, pois descreve a funcionalidade sob a perspectiva do usuário, em linguagem próxima ao cliente",
    "Documento de Requisitos do Sistema, pois estabelece as funcionalidades, suas descrições, prioridades e o cronograma de entrega do projeto",
    "Critério de Aceitação, pois define as condições que uma funcionalidade específica deve cumprir para ser considerada completa",
    "Quadro de Requisitos Não Funcionais, pois organiza exclusivamente as características de qualidade exigidas pelo sistema"
  ],
  answer: 1,
  feedback: "O documento descrito é o **Documento de Requisitos do Sistema**, que estabelece o escopo do projeto, a descrição de cada funcionalidade, as prioridades definidas junto aos clientes e o cronograma de entrega, servindo inclusive de base para contratos em equipes terceirizadas."
},
// 51 - Tipos de entrevistas
{
  aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
  tipo: "Asserção + Justificativa",
  texto: "Uma analista de sistemas está entrevistando cinco gerentes de projeto diferentes sobre as funcionalidades que esperam de um novo sistema de gerenciamento de tarefas. Para garantir que as respostas pudessem ser comparadas entre si, ela utilizou exatamente a mesma lista fixa de perguntas com todos os entrevistados, sem se desviar do roteiro predefinido.",
  question: "Considerando os tipos de entrevistas apresentados no material, avalie as asserções a seguir.",
  assertions: [
    "I. A técnica utilizada pela analista corresponde à ==def==entrevista estruturada==.",
    "PORQUE II. Esse tipo de entrevista segue um roteiro rígido de perguntas predefinidas, sendo útil para obter informações específicas e comparáveis entre diferentes stakeholders."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "O uso de uma lista fixa de perguntas, sem desvio do roteiro, para obter respostas comparáveis entre diferentes gerentes é exatamente a definição de **entrevista estruturada** apresentada no material. Como essa é justamente a característica que define esse tipo de entrevista, II justifica corretamente I."
},

// 52 - Reuniões
{
  aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma equipe de desenvolvimento organizou três encontros distintos: no primeiro, os participantes sugeriram livremente ideias para um novo sistema, sem julgamentos imediatos; no segundo, a equipe discutiu e refinou requisitos já coletados anteriormente, buscando identificar inconsistências; no terceiro, foi realizada uma sessão estruturada com atividades práticas para mapear os processos da organização e definir novos requisitos.",
  question: "Avalie as afirmativas a seguir sobre os três encontros descritos.",
  assertions: [
    "I. O primeiro encontro corresponde a uma Reunião de Brainstorming, focada na geração livre de ideias.",
    "II. O segundo encontro corresponde a uma Reunião de Análise e Revisão, voltada a refinar requisitos já coletados.",
    "III. O terceiro encontro corresponde a um Workshop, que combina elementos de brainstorming e de análise em atividades mais estruturadas.",
    "IV. Os três encontros descritos são, na verdade, exemplos de Etnografia, pois envolvem observação direta dos participantes em seu ambiente de trabalho."
  ],
  options: [
    "I e II, apenas",
    "I, II e III, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "Os três encontros correspondem exatamente aos tipos de reuniões apresentados no material: **Brainstorming** (I), **Análise e Revisão** (II) e **Workshop** (III). A afirmativa IV é falsa, pois os três exemplos são reuniões em grupo, e não observação direta dos usuários em seu ambiente natural de trabalho, que é a definição de etnografia."
},

// 53 - Etnografia
{
  aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
  tipo: "Conceitual Contextualizada",
  texto: "Um analista de sistemas passou um dia inteiro acompanhando médicos e enfermeiros em um hospital, observando como eles utilizavam o sistema de prontuário eletrônico no dia a dia, registrando as dificuldades enfrentadas e as soluções improvisadas que os profissionais adotavam para contornar limitações do sistema atual.",
  question: "Essa prática, descrita no material, corresponde a qual técnica de levantamento de requisitos?",
  options: [
    "Análise de documentos, pois o analista revisou manuais e registros de suporte do hospital antes de tomar qualquer decisão",
    "Entrevista estruturada, pois o analista utilizou uma lista fixa de perguntas para todos os profissionais observados",
    "Etnografia, pois envolve a observação direta dos usuários em seu ambiente natural de trabalho, permitindo identificar comportamentos reais e oportunidades de melhoria",
    "Reunião de brainstorming, pois o objetivo principal foi gerar ideias livremente junto aos profissionais do hospital"
  ],
  answer: 2,
  feedback: "A observação direta dos usuários em seu ambiente natural de trabalho, como no caso do analista acompanhando médicos e enfermeiros no hospital, é a definição de **etnografia** apresentada no material, permitindo identificar dificuldades e comportamentos reais que talvez não fossem mencionados espontaneamente."
},

// 54 - Efeito observador
{
  aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
  tipo: "Análise Aplicada",
  texto: "Durante uma pesquisa etnográfica em uma empresa, um analista percebeu que os funcionários passaram a seguir rigorosamente todos os procedimentos formais do sistema assim que perceberam que estavam sendo observados, algo que normalmente não faziam em seu dia a dia de trabalho.",
  question: "Esse fenômeno, mencionado no material como um dos desafios da etnografia, é conhecido como:",
  options: [
    "Efeito observador, que ocorre quando os usuários alteram seu comportamento por saberem que estão sendo observados, afetando a validade dos dados coletados",
    "Viés de confirmação, que ocorre quando o analista busca apenas informações que confirmem hipóteses previamente estabelecidas",
    "Inconsistência de stakeholders, que ocorre quando diferentes usuários fornecem informações conflitantes entre si durante entrevistas",
    "Efeito de saturação, que ocorre quando o volume de dados qualitativos coletados se torna grande demais para ser interpretado"
  ],
  answer: 0,
  feedback: "O material descreve exatamente esse fenômeno como **efeito observador**: quando os usuários alteram seu comportamento por saberem que estão sendo observados, o que pode comprometer a validade dos dados coletados durante a etnografia."
},

// 55 - Análise de documentos
{
  aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
  tipo: "Múltiplas Afirmativas",
  texto: "Antes de iniciar o desenvolvimento de um novo sistema de suporte ao cliente, uma equipe revisou manuais de usuário do sistema atual, analisou relatórios sobre quais funcionalidades eram mais utilizadas pelos clientes, e examinou registros de chamados de suporte para identificar problemas recorrentes relatados pelos usuários.",
  question: "Avalie as afirmativas a seguir sobre a técnica utilizada pela equipe.",
  assertions: [
    "I. A revisão de manuais, relatórios de uso e registros de suporte corresponde à técnica de Análise de Documentos.",
    "II. Essa técnica é útil para identificar requisitos implícitos e complementares que os usuários podem não mencionar explicitamente em entrevistas.",
    "III. Um dos desafios dessa técnica, segundo o material, é que os documentos podem estar incompletos ou desatualizados, levando a uma compreensão incorreta dos requisitos.",
    "IV. A Análise de Documentos é capaz de capturar, sem exceção, todas as necessidades dos usuários, mesmo aquelas que nunca foram documentadas."
  ],
  options: [
    "I e II, apenas",
    "I, II e III, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "A revisão de manuais, relatórios e registros de suporte corresponde à **Análise de Documentos** (I), útil para identificar requisitos implícitos (II), mas sujeita ao desafio de documentos incompletos ou desatualizados (III). A afirmativa IV é falsa, pois o próprio material reconhece que essa técnica pode não capturar necessidades não documentadas."
},

// 56 - Hard skills e soft skills
{
  aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
  tipo: "Asserção + Justificativa",
  texto: "Um analista de requisitos precisa, ao mesmo tempo, compreender tecnicamente o domínio do problema para formular perguntas relevantes durante uma entrevista, e demonstrar empatia com os stakeholders para estabelecer um ambiente de confiança durante a conversa.",
  question: "Avalie as asserções a seguir sobre as competências exigidas desse analista.",
  assertions: [
    "I. A compreensão técnica do domínio do problema é um exemplo de ==proc==hard skill==, enquanto a empatia é um exemplo de soft skill.",
    "PORQUE II. Hard skills são habilidades técnicas adquiridas por treinamento, experiência prática e educação formal, enquanto soft skills estão relacionadas a comportamento, personalidade e habilidades sociais."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "O conhecimento técnico do domínio do problema é classificado no material como **hard skill**, enquanto a empatia é uma **soft skill** (I é verdadeira). Como essa é justamente a distinção conceitual apresentada entre os dois tipos de habilidade — técnicas versus comportamentais —, II justifica corretamente I."
},

// 57 - Entrevista semiestruturada
{
  aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
  tipo: "Conceitual Contextualizada",
  texto: "Durante uma entrevista, o analista partiu de uma pergunta predefinida sobre quais funcionalidades o entrevistado esperava do novo sistema. Ao perceber que o entrevistado mencionou espontaneamente a importância de integrar o novo sistema com outra plataforma já utilizada pela empresa, o analista aprofundou esse ponto com perguntas adicionais não planejadas originalmente.",
  question: "Esse tipo de entrevista, que combina perguntas predefinidas com a flexibilidade de explorar novos tópicos, é chamado no material de:",
  options: [
    "Entrevista estruturada, pois segue rigorosamente um roteiro fixo de perguntas, sem qualquer desvio durante a conversa",
    "Entrevista não estruturada, pois não existe nenhum planejamento prévio das perguntas realizadas pelo analista",
    "Entrevista semiestruturada, pois combina perguntas predefinidas com a flexibilidade de explorar novos tópicos que surgem durante a conversa",
    "Reunião de brainstorming, pois o objetivo principal foi gerar novas ideias livremente com o entrevistado"
  ],
  answer: 2,
  feedback: "A combinação de perguntas predefinidas com a flexibilidade de aprofundar tópicos que surgem espontaneamente durante a conversa é a definição de **entrevista semiestruturada** apresentada no material, diferente da estruturada (roteiro rígido) e da não estruturada (sem roteiro algum)."
},

// 58 - Desafios das entrevistas
{
  aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
  tipo: "Análise Aplicada",
  texto: "Ao entrevistar três stakeholders diferentes de um mesmo sistema, um analista percebeu que cada um deles descreveu de forma bastante diferente qual deveria ser a principal funcionalidade do software, com informações que pareciam se contradizer entre si.",
  question: "Considerando os desafios das entrevistas apresentados no material, qual habilidade seria mais relevante para o analista lidar com essa situação?",
  options: [
    "Discrição, pois o analista deve evitar interferir na rotina dos stakeholders durante a coleta de informações",
    "Negociação, pois é a habilidade voltada a reconciliar requisitos conflitantes entre diferentes stakeholders, buscando compromissos que satisfaçam a todos",
    "Técnicas de observação, pois o analista deve registrar dados de forma sistemática durante a interação com os stakeholders",
    "Planejamento de reuniões, pois o principal desafio está relacionado à definição de agendas e objetivos específicos para o encontro"
  ],
  answer: 1,
  feedback: "Diante de informações conflitantes entre diferentes stakeholders, a habilidade mais relevante apontada no material é a **negociação**, voltada justamente a reconciliar requisitos conflitantes e buscar compromissos que satisfaçam a todos os envolvidos."
},

// 59 - Levantamento de requisitos como processo contínuo
{
  aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
  tipo: "Múltiplas Afirmativas",
  texto: "Após o lançamento inicial de um sistema de gestão hospitalar, a equipe de desenvolvimento continuou realizando entrevistas periódicas com médicos e enfermeiros, revisando relatórios de uso do sistema e observando o comportamento dos usuários, mesmo meses após a implantação, para identificar novas necessidades que surgiram com o uso real do sistema.",
  question: "Avalie as afirmativas a seguir sobre essa prática, à luz do material.",
  assertions: [
    "I. Essa prática reflete a ideia de que o Levantamento de Requisitos é um processo contínuo, que deve acompanhar todo o ciclo de vida do software.",
    "II. As entrevistas periódicas, a revisão de relatórios e a observação de comportamento correspondem, respectivamente, às técnicas de entrevistas, análise de documentos e etnografia.",
    "III. Segundo o material, o Levantamento de Requisitos deve ocorrer apenas uma vez, antes do início do desenvolvimento, sendo desnecessário revisá-lo após a implantação do sistema.",
    "IV. A continuidade desse processo ajuda a garantir que os requisitos permaneçam atualizados e que o sistema evolua de forma sustentável."
  ],
  options: [
    "I e II, apenas",
    "I, II e IV, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "O cenário reflete exatamente a ideia de que o Levantamento de Requisitos é um **processo contínuo** (I), combinando entrevistas, análise de documentos e etnografia (II), o que ajuda a manter os requisitos atualizados e o sistema evoluindo de forma sustentável (IV). A afirmativa III é falsa, pois contraria diretamente essa continuidade defendida pelo material."
},

// 60 - Workshops
{
  aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
  tipo: "Conceitual Contextualizada",
  texto: "Uma organização promoveu uma sessão colaborativa estruturada, com atividades práticas e exercícios específicos, reunindo diferentes stakeholders com o objetivo de mapear os processos atuais da empresa e identificar, de forma conjunta, áreas de melhoria que poderiam ser resolvidas por meio de um novo sistema de software.",
  question: "Essa sessão, descrita no material, corresponde a qual tipo de reunião de levantamento de requisitos?",
  options: [
    "Reunião de Brainstorming, pois seu único objetivo é a geração livre de ideias, sem qualquer estrutura ou atividade prática",
    "Reunião de Análise e Revisão, pois seu foco está exclusivamente em revisar requisitos que já haviam sido coletados anteriormente",
    "Workshop, pois é uma sessão colaborativa mais estruturada, que combina elementos de brainstorming e de análise, com atividades práticas para explorar e definir requisitos",
    "Entrevista contextual, pois envolve perguntas realizadas aos stakeholders durante a execução de suas atividades cotidianas"
  ],
  answer: 2,
  feedback: "A sessão descrita — colaborativa, estruturada, com atividades práticas para mapear processos e identificar melhorias — corresponde a um **Workshop**, que combina elementos de brainstorming e de análise em um formato mais estruturado, conforme apresentado no material."
},
// 61 - AOO x POO
{
  aula: "Aula 7 — Análise e Programação Orientada a Objetos",
  tipo: "Asserção + Justificativa",
  texto: "Uma equipe de desenvolvimento está construindo um sistema de locadora de veículos. Antes de escrever qualquer linha de código, os analistas identificaram quais entidades do domínio deveriam ser representadas como objetos — como Veículo, Cliente e Contrato — e definiram suas características e comportamentos. Somente depois disso, os programadores começaram a implementar essas definições em Java.",
  question: "Considerando a relação entre AOO e POO apresentada no material, avalie as asserções a seguir.",
  assertions: [
    "I. A etapa de identificar as entidades do domínio e definir suas características corresponde à ==type==Análise Orientada a Objetos (AOO)==, enquanto a implementação em Java corresponde à Programação Orientada a Objetos (POO).",
    "PORQUE II. A AOO cuida da fase de análise e modelagem do sistema, definindo os objetos e suas interações, enquanto a POO cuida da implementação dessas definições em código."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "A identificação das entidades do domínio, como Veículo e Cliente, corresponde à **AOO**, enquanto a implementação em Java corresponde à **POO**. Como o material define exatamente essa divisão de papéis entre análise/modelagem e implementação, II justifica corretamente I."
},

// 62 - Pilares da AOO
{
  aula: "Aula 7 — Análise e Programação Orientada a Objetos",
  tipo: "Múltiplas Afirmativas",
  texto: "Em um sistema bancário orientado a objetos, o atributo saldo de uma conta só pode ser alterado por meio dos métodos da própria classe Conta; o programador que utiliza o método sacar() não precisa conhecer como a verificação de saldo é implementada internamente; e a classe ContaPoupanca deriva da classe Conta, reaproveitando seus atributos e métodos.",
  question: "Avalie as afirmativas a seguir sobre os conceitos da AOO presentes nesse sistema.",
  assertions: [
    "I. A restrição de acesso direto ao atributo saldo, exigindo que a alteração passe pelos métodos da classe, é um exemplo de encapsulamento.",
    "II. A possibilidade de usar o método sacar() sem conhecer sua implementação interna é um exemplo de abstração.",
    "III. A derivação de ContaPoupanca a partir de Conta, reaproveitando atributos e métodos, é um exemplo de herança.",
    "IV. Esses três conceitos — encapsulamento, abstração e herança — são, segundo o material, sinônimos entre si, representando a mesma ideia central da AOO."
  ],
  options: [
    "I e II, apenas",
    "I, II e III, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "As três situações descritas correspondem, respectivamente, a **encapsulamento** (I), **abstração** (II) e **herança** (III), todos apresentados no material como pilares distintos da AOO. A afirmativa IV é falsa, pois cada conceito possui uma definição própria e diferente dos demais."
},

// 63 - Técnicas de modelagem OO
{
  aula: "Aula 7 — Análise e Programação Orientada a Objetos",
  tipo: "Conceitual Contextualizada",
  texto: "Uma equipe de engenharia de software precisa escolher uma técnica de modelagem orientada a objetos que enfatize a integração suave entre as fases de análise, design e implementação, utilizando uma notação gráfica simples para descrever classes e suas interações — sendo especialmente indicada quando se busca transitar de forma fluida entre o modelo conceitual e o código final.",
  question: "Considerando as técnicas de modelagem apresentadas no material, qual delas melhor atende a essa necessidade?",
  options: [
    "OMT, pois divide a modelagem em estrutura estática, comportamento dinâmico e fluxo de dados, sendo mais voltada às fases iniciais de design",
    "BON, pois foca na integração entre análise, design e implementação, utilizando notação gráfica simples eficaz na transição entre design e código",
    "UML, pois é a única técnica capaz de representar tanto a estrutura estática quanto o comportamento dinâmico de um sistema",
    "Nenhuma das técnicas apresentadas no material aborda a integração entre análise, design e implementação"
  ],
  answer: 1,
  feedback: "A **BON (Business Object Notation)**, criada por Jean-Marc Nerson e Kim Waldén, é apresentada no material como a técnica focada justamente na integração entre análise, design e implementação, utilizando uma notação gráfica simples eficaz para a transição suave entre modelo e código."
},

// 64 - Herança e polimorfismo em código
{
  aula: "Aula 7 — Análise e Programação Orientada a Objetos",
  tipo: "Análise Aplicada",
  texto: "Considere o trecho de código a seguir, baseado no exemplo de hierarquia de animais apresentado no material, no qual a classe Cachorro e a classe Gato herdam de uma classe base comum e implementam o método fazerSom() de formas diferentes.",
  code: `public abstract class Mamifero implements Animal {
    protected String nome;
    public Mamifero(String nome) { this.nome = nome; }
    public void mover() { System.out.println(nome + " está se movendo"); }
    public abstract void fazerSom();
}

public class Cachorro extends Mamifero {
    public Cachorro(String nome) { super(nome); }
    @Override
    public void fazerSom() { System.out.println(nome + " faz: Au Au"); }
}

public class Gato extends Mamifero {
    public Gato(String nome) { super(nome); }
    @Override
    public void fazerSom() { System.out.println(nome + " faz: Miau"); }
}`,
  question: "Ao percorrer um array do tipo Animal contendo objetos Cachorro e Gato e chamar animal.fazerSom() para cada elemento, cada objeto executa uma versão diferente do método, apesar de todos serem tratados de forma unificada pelo mesmo tipo Animal. Esse comportamento é um exemplo de qual conceito?",
  options: [
    "Encapsulamento, pois os atributos de Cachorro e Gato estão protegidos contra acesso externo indevido",
    "Abstração, pois o programador não precisa conhecer os detalhes internos da implementação de fazerSom()",
    "Polimorfismo, pois métodos redefinidos (override) em subclasses diferentes permitem que o mesmo método tenha comportamentos distintos conforme a classe do objeto",
    "Composição, pois Cachorro e Gato são formados pela combinação de múltiplos objetos menores dentro de uma mesma estrutura"
  ],
  answer: 2,
  feedback: "O comportamento descrito é **polimorfismo**: o método fazerSom() é redefinido (override) em Cachorro e Gato, permitindo que o mesmo método, chamado a partir de um tipo comum (Animal), produza resultados diferentes conforme a classe real do objeto."
},

// 65 - Origem das structs
{
  aula: "Aula 7 — Análise e Programação Orientada a Objetos",
  tipo: "Asserção + Justificativa",
  texto: "Um desenvolvedor está estudando a origem histórica do conceito de objeto na programação. Ele descobre que, em linguagens como C, era possível agrupar variáveis de diferentes tipos em uma única unidade chamada struct, como uma struct Carro contendo os campos marca, ano e quilometragem.",
  question: "Avalie as asserções a seguir sobre essa origem histórica.",
  assertions: [
    "I. As ==ddl==structs== evoluíram para o conceito de objeto com a introdução do paradigma orientado a objetos.",
    "PORQUE II. As structs, por si só, já possuíam a capacidade de definir métodos e comportamentos associados aos dados agrupados, sendo equivalentes aos objetos da POO."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 2,
  feedback: "As structs de fato evoluíram para o conceito de objeto (I é verdadeira). No entanto, o material afirma explicitamente que as structs carecem de comportamento — armazenam apenas dados, sem capacidade de definir operações sobre eles —, o que torna II falsa, pois estruturas e objetos não são equivalentes nesse aspecto."
},

// 66 - Diagrama de classes UML
{
  aula: "Aula 7 — Análise e Programação Orientada a Objetos",
  tipo: "Múltiplas Afirmativas",
  texto: "Um analista está elaborando um Diagrama de Classes UML para representar o sistema de uma biblioteca. Ele inclui uma classe com atributos marcados com indicadores de visibilidade pública, protegida e privada, uma operação com argumento e tipo de retorno, e um relacionamento de composição ligando essa classe a outra classe dependente.",
  question: "Avalie as afirmativas a seguir sobre esse diagrama, considerando o material apresentado.",
  assertions: [
    "I. O Diagrama de Classes é classificado, na hierarquia de diagramas UML apresentada no material, como um Diagrama de Estruturas.",
    "II. Os indicadores de visibilidade pública, protegida e privada são utilizados para especificar o nível de acesso permitido a atributos e operações de uma classe.",
    "III. Um losango preenchido em uma relação entre classes é utilizado, segundo o material, para representar o relacionamento de composição.",
    "IV. O Diagrama de Classes é classificado no material como um Diagrama de Comportamentos, assim como o Diagrama de Sequência."
  ],
  options: [
    "I, II e III, apenas",
    "I e II, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "O material classifica o **Diagrama de Classes** como um Diagrama de Estruturas (I), utiliza indicadores de visibilidade para atributos e operações (II) e representa composição por meio de um losango preenchido (III). A afirmativa IV é falsa, pois o Diagrama de Sequência pertence à categoria de Diagramas de Comportamentos, diferente do Diagrama de Classes."
},

// 67 - Interfaces
{
  aula: "Aula 7 — Análise e Programação Orientada a Objetos",
  tipo: "Conceitual Contextualizada",
  texto: "Em um sistema que modela diferentes tipos de animais, a classe Passaro implementa diretamente um contrato que define os métodos fazerSom() e mover(), sem herdar de nenhuma classe intermediária, garantindo apenas que esses métodos existam em sua implementação, sem especificar como devem ser executados internamente.",
  question: "Esse contrato implementado diretamente por Passaro, que define métodos obrigatórios sem especificar sua implementação, corresponde a qual conceito apresentado no material?",
  options: [
    "Herança, pois Passaro deriva diretamente de uma superclasse que já implementa fazerSom() e mover()",
    "Interface, pois define contratos que classes podem implementar, garantindo que certos métodos sejam seguidos, sem especificar a implementação em si",
    "Encapsulamento, pois esconde os detalhes internos da classe Passaro de outras partes do sistema",
    "Composição, pois Passaro é formado pela combinação de múltiplos objetos menores em sua estrutura interna"
  ],
  answer: 1,
  feedback: "O conceito descrito é o de **Interface**: um contrato que define quais métodos uma classe deve implementar, sem especificar como isso deve ser feito, promovendo flexibilidade e intercambialidade entre diferentes implementações — exatamente o caso de Passaro implementando Animal diretamente."
},

// 68 - Aplicações práticas da POO
{
  aula: "Aula 7 — Análise e Programação Orientada a Objetos",
  tipo: "Análise Aplicada",
  texto: "Uma equipe está desenvolvendo uma aplicação web em JavaScript utilizando um framework que já fornece objetos básicos comuns a diferentes tipos de aplicações web, funcionando como um arcabouço que simplifica a escrita do código, evitando que a equipe precise reescrever estruturas repetitivas do zero.",
  question: "Considerando os exemplos de aplicações práticas da POO apresentados no material, qual framework é citado como exemplo dessa situação em JavaScript?",
  options: [
    "Flask, framework citado no material como equivalente ao Express, mas voltado para a linguagem Python",
    "WinUI, API do SDK do Windows utilizada para acesso a componentes gráficos prontos",
    "Express, framework para desenvolvimento de aplicações web em JavaScript, rodando sobre o ambiente Node.js",
    "OMT, técnica de modelagem orientada a objetos desenvolvida por James Rumbaugh em 1991"
  ],
  answer: 2,
  feedback: "O **Express** é citado no material como o framework para desenvolvimento de aplicações web em JavaScript, rodando sobre o Node.js, fornecendo objetos básicos que simplificam a escrita de código — diferente do Flask, que é seu equivalente em Python."
},

// 69 - Componentização
{
  aula: "Aula 7 — Análise e Programação Orientada a Objetos",
  tipo: "Asserção + Justificativa",
  texto: "Uma equipe de desenvolvimento de software decidiu estruturar seu sistema como um conjunto de unidades independentes, cada uma responsável por uma funcionalidade específica, que se comunicam entre si por meio de troca de mensagens — de forma semelhante a peças de um brinquedo de montar que se encaixam e interagem.",
  question: "Avalie as asserções a seguir sobre essa estratégia de desenvolvimento.",
  assertions: [
    "I. Essa estratégia é descrita no material como ==type==componentização==, um conceito trazido pela POO às arquiteturas de software.",
    "PORQUE II. A POO permite conceber um sistema como unidades básicas combinadas para realizar uma funcionalidade, comunicando-se por troca de mensagens, conceito do qual derivam tecnologias como os Componentes Web."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "A estratégia descrita corresponde exatamente à **componentização**, conceito trazido pela POO às arquiteturas de software, do qual derivam tecnologias como os Componentes Web. Como essa é a própria definição do conceito apresentada no material, II justifica corretamente I."
},

// 70 - Comparação structs x objetos
{
  aula: "Aula 7 — Análise e Programação Orientada a Objetos",
  tipo: "Múltiplas Afirmativas",
  texto: "Um professor está explicando aos alunos a diferença entre uma struct em C e uma classe em Python. Ele mostra que a struct agrupa apenas os campos marca, ano e quilometragem de um carro, sem nenhuma função associada, enquanto a classe Carro em Python, além desses atributos, também define métodos como acelerar() e frear().",
  question: "Avalie as afirmativas a seguir sobre essa comparação, considerando o material apresentado.",
  assertions: [
    "I. A struct em C armazena apenas dados, sem capacidade de definir operações sobre eles, conforme descrito no material.",
    "II. A classe Carro em Python, ao definir métodos como acelerar() e frear(), demonstra a capacidade de encapsular tanto dados quanto comportamento em um mesmo objeto.",
    "III. A necessidade de declarar objetos semelhantes sem reescrever código motivou, segundo o material, a criação da abstração chamada Classe.",
    "IV. Segundo o material, structs e classes orientadas a objetos são conceitos idênticos, sem nenhuma diferença relevante entre eles."
  ],
  options: [
    "I e II, apenas",
    "I, II e III, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "O material afirma que **structs** armazenam apenas dados, sem comportamento (I), enquanto **classes** encapsulam dados e métodos (II), e que a necessidade de declarar objetos semelhantes sem reescrever código motivou a criação do conceito de **Classe** (III). A afirmativa IV é falsa, pois o material trata structs e objetos como conceitos distintos, sendo a struct um antecessor histórico do objeto, e não um sinônimo dele."
},

  ],


  fixacao: [
  // 1 - Fases do desenvolvimento
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Direta",
    texto: "O desenvolvimento de software é organizado em fases distintas.",
    question: "Qual das fases a seguir tem como foco conversar com o cliente para identificar suas necessidades e o propósito do software?",
    options: [
      "Levantamento de requisitos",
      "Planejamento",
      "Design",
      "Implantação"
    ],
    answer: 0,
    feedback: "O levantamento de requisitos é a etapa em que se conversa com o cliente para descobrir o que ele precisa e o que o sistema deverá oferecer."
  },

  // 2 - Análise x Modelagem
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Contexto",
    texto: "Análise e modelagem são etapas complementares no desenvolvimento de sistemas, mas cada uma tem um foco diferente.",
    question: "Qual afirmação descreve corretamente a diferença entre análise e modelagem?",
    options: [
      "A análise define o que o sistema deve fazer, enquanto a modelagem mostra como o sistema deve fazer",
      "A análise mostra como o sistema deve fazer, enquanto a modelagem define o que ele deve fazer",
      "Ambas têm exatamente a mesma função dentro do processo de desenvolvimento",
      "A modelagem substitui totalmente a necessidade de análise de requisitos"
    ],
    answer: 0,
    feedback: "A análise investiga o problema e define o que o sistema deve fazer; a modelagem representa, por meio de diagramas e símbolos, como o sistema deve funcionar."
  },

  // 3 - Exemplo de análise aplicada
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Aplicação",
    texto: "Uma varejista percebe atrasos constantes na reposição de produtos e dificuldade em rastrear itens no estoque. A equipe de TI decide investigar o problema antes de propor qualquer solução técnica.",
    question: "Nesse cenário, a atividade de investigar o problema, entender as necessidades da equipe e identificar as causas dos atrasos corresponde a qual etapa?",
    options: [
      "Análise do sistema",
      "Modelagem formal",
      "Codificação",
      "Implantação"
    ],
    answer: 0,
    feedback: "Investigar o problema, entender necessidades e identificar o que o sistema deve resolver são atividades típicas da análise do sistema, que precede a modelagem da solução."
  },

  // 4 - UML
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Direta",
    texto: "A UML é amplamente citada como ferramenta de modelagem.",
    question: "O que significa a sigla UML, mencionada no material como padrão para modelagem orientada a objetos?",
    options: [
      "Unified Modeling Language",
      "Universal Management Layer",
      "Unified Method Logic",
      "User Modeling Language"
    ],
    answer: 0,
    feedback: "UML significa Unified Modeling Language, um padrão amplamente utilizado para modelar sistemas orientados a objetos."
  },

  // 5 - Tipos de modelagem
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Contexto",
    texto: "O material apresenta diferentes tipos de modelagem, cada um com um foco específico dentro do desenvolvimento de sistemas.",
    question: "Qual tipo de modelagem utiliza lógica formal para descrever matematicamente o comportamento de um sistema, sendo indicada para componentes que exigem maior precisão?",
    options: [
      "Modelagem formal",
      "Modelagem funcional",
      "Modelagem estruturada",
      "Modelagem baseada em processos"
    ],
    answer: 0,
    feedback: "A modelagem formal usa lógica formal para descrever matematicamente o comportamento do sistema, sendo empregada em componentes críticos que exigem maior precisão, como nas Redes de Petri."
  },

  // 6 - Classe e objeto
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Aplicação",
    texto: "Em um sistema hospitalar, um médico chamado Dr. Carlos é cadastrado no sistema com nome, especialidade e CRM preenchidos.",
    question: "Nesse exemplo, o registro concreto de 'Dr. Carlos' com seus dados preenchidos representa qual conceito da orientação a objetos?",
    options: [
      "Um objeto, instância da classe Médico",
      "Uma classe, que define o médico",
      "Um método de encapsulamento",
      "Um exemplo de herança múltipla"
    ],
    answer: 0,
    feedback: "O objeto é a instância concreta de uma classe. 'Dr. Carlos' com seus dados específicos preenchidos é uma instância concreta da classe Médico."
  },

  // 7 - Encapsulamento
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Direta",
    texto: "Um dos pilares da orientação a objetos trata do controle de acesso aos detalhes internos de um objeto.",
    question: "Qual conceito da orientação a objetos protege dados e métodos contra acessos ou modificações indevidas por outros objetos?",
    options: [
      "Encapsulamento",
      "Herança",
      "Polimorfismo",
      "Abstração"
    ],
    answer: 0,
    feedback: "O encapsulamento tem como ideia central controlar o acesso aos detalhes internos do objeto, protegendo dados e métodos."
  },

  // 8 - Herança e polimorfismo
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Contexto",
    texto: "Em um sistema orientado a objetos, uma classe Funcionario possui uma característica comum, mas as classes Gerente e Vendedor, que herdam dela, implementam o método calcularSalario() de formas diferentes.",
    question: "O fato de o mesmo método ter comportamentos diferentes em Gerente e Vendedor exemplifica qual conceito?",
    options: [
      "Polimorfismo",
      "Encapsulamento",
      "Modularidade estrutural",
      "Modelagem formal"
    ],
    answer: 0,
    feedback: "O polimorfismo permite que diferentes operações compartilhem o mesmo nome, mas se comportem de formas distintas dependendo do contexto ou da classe."
  },

  // 9 - Abstração
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Aplicação",
    texto: "Um desenvolvedor utiliza uma biblioteca para enviar e-mails apenas chamando um método enviarEmail(), sem precisar saber como o protocolo de envio funciona internamente.",
    question: "Essa situação, em que o usuário utiliza uma funcionalidade sem conhecer sua implementação interna, ilustra principalmente qual conceito?",
    options: [
      "Abstração",
      "Herança",
      "Modelagem estruturada",
      "Levantamento de requisitos"
    ],
    answer: 0,
    feedback: "A abstração esconde detalhes desnecessários da implementação, permitindo usar uma funcionalidade sem precisar conhecer como ela funciona internamente."
  },

  // 10 - Vantagens da orientação a objetos
  {
    aula: "Aula 1 — Conceitos Iniciais",
    tipo: "Direta",
    texto: "A orientação a objetos traz benefícios práticos para o desenvolvimento de software.",
    question: "Qual das opções abaixo NÃO é citada no material como uma vantagem da orientação a objetos?",
    options: [
      "Eliminação total da necessidade de testes",
      "Modularidade",
      "Reutilização de código",
      "Facilidade de manutenção"
    ],
    answer: 0,
    feedback: "O material cita modularidade, reutilização de código, flexibilidade e facilidade de manutenção como vantagens, mas não afirma que a orientação a objetos elimina a necessidade de testes."
  },
  // 11 - Definição de ciclo de vida
  {
    aula: "Aula 2 — Ciclo de Vida do Software",
    tipo: "Direta",
    texto: "O ciclo de vida do software organiza as fases pelas quais um sistema passa.",
    question: "O que é o ciclo de vida do software, segundo o material?",
    options: [
      "Uma abordagem estruturada que organiza as fases do software desde sua concepção até a manutenção/descontinuação",
      "Um conjunto de testes aplicados apenas na fase final do projeto",
      "Um documento único que substitui o levantamento de requisitos",
      "Um modelo exclusivo para sistemas de grande porte"
    ],
    answer: 0,
    feedback: "O ciclo de vida do software é a estrutura que organiza as fases do sistema, da concepção até a manutenção ou descontinuação."
  },

  // 12 - Modelo Cascata
  {
    aula: "Aula 2 — Ciclo de Vida do Software",
    tipo: "Contexto",
    texto: "O Modelo em Cascata é considerado o mais antigo entre os apresentados, sendo formalizado por Royce em 1970.",
    question: "Qual é a principal característica do Modelo em Cascata?",
    options: [
      "As fases são sequenciais, e uma fase só começa quando a anterior termina",
      "As entregas ocorrem em módulos independentes ao longo do projeto",
      "O foco está na análise contínua de riscos a cada ciclo",
      "O desenvolvimento ocorre em ciclos muito curtos, entre 60 e 90 dias"
    ],
    answer: 0,
    feedback: "O Cascata é um modelo linear e sequencial, em que uma fase começa somente após o término da anterior."
  },

  // 13 - Aplicação do Incremental
  {
    aula: "Aula 2 — Ciclo de Vida do Software",
    tipo: "Aplicação",
    texto: "Uma empresa decide desenvolver seu sistema de gestão dividindo-o em módulos de contabilidade, recursos humanos e estoque, entregando cada módulo separadamente conforme fica pronto.",
    question: "Essa estratégia de desenvolvimento corresponde a qual modelo de ciclo de vida?",
    options: [
      "Incremental",
      "Cascata",
      "Espiral",
      "RUP"
    ],
    answer: 0,
    feedback: "O Modelo Incremental divide o sistema em módulos desenvolvidos e entregues progressivamente, aumentando a funcionalidade aos poucos."
  },

  // 14 - RAD
  {
    aula: "Aula 2 — Ciclo de Vida do Software",
    tipo: "Direta",
    texto: "O RAD é conhecido por sua rapidez no desenvolvimento.",
    question: "Qual é a característica central do modelo RAD (Rapid Application Development)?",
    options: [
      "Desenvolvimento rápido, com ciclos curtos e abordagem iterativa e incremental",
      "Ênfase exclusiva na documentação detalhada do sistema",
      "Fases estritamente sequenciais sem possibilidade de retorno",
      "Foco principal na análise formal de riscos do projeto"
    ],
    answer: 0,
    feedback: "O RAD enfatiza desenvolvimento rápido, com ciclos curtos (geralmente entre 60 e 90 dias) e caráter iterativo e incremental."
  },

  // 15 - Prototipagem
  {
    aula: "Aula 2 — Ciclo de Vida do Software",
    tipo: "Contexto",
    texto: "Uma equipe de design cria uma versão inicial e simplificada de uma interface para que os usuários testem e deem feedback antes da versão final ser desenvolvida.",
    question: "Essa prática descrita está associada a qual conceito do material?",
    options: [
      "Prototipagem",
      "Modelo Espiral",
      "Teste de regressão",
      "RUP"
    ],
    answer: 0,
    feedback: "A prototipagem consiste em construir um exemplar inicial do software para captar, esclarecer e refinar requisitos."
  },

  // 16 - Modelo Espiral
  {
    aula: "Aula 2 — Ciclo de Vida do Software",
    tipo: "Aplicação",
    texto: "Em um sistema de defesa, a equipe precisa avaliar continuamente possíveis riscos técnicos e operacionais a cada nova etapa do desenvolvimento.",
    question: "Esse cenário é um exemplo característico de qual modelo de ciclo de vida?",
    options: [
      "Espiral",
      "Cascata",
      "RAD",
      "Prototipagem"
    ],
    answer: 0,
    feedback: "O Modelo Espiral combina elementos de Cascata e Prototipagem, dando grande importância à análise contínua de riscos em cada ciclo."
  },

  // 17 - RUP
  {
    aula: "Aula 2 — Ciclo de Vida do Software",
    tipo: "Direta",
    texto: "O RUP é um modelo dividido em quatro fases principais.",
    question: "Quais são as quatro fases do RUP (Rational Unified Process)?",
    options: [
      "Concepção, Elaboração, Construção e Transição",
      "Planejamento, Análise, Design e Testes",
      "Requisitos, Prototipagem, Implementação e Manutenção",
      "Iniciação, Execução, Monitoramento e Encerramento"
    ],
    answer: 0,
    feedback: "O RUP é dividido em quatro fases: Concepção, Elaboração, Construção e Transição, sendo iterativo, incremental e orientado a casos de uso."
  },

  // 18 - Testes de regressão
  {
    aula: "Aula 2 — Ciclo de Vida do Software",
    tipo: "Aplicação",
    texto: "Após adicionar uma nova funcionalidade a um sistema de CRM, a equipe decide verificar se o gerenciamento de contatos e o rastreamento de vendas continuam funcionando normalmente.",
    question: "Esse procedimento corresponde a qual tipo de teste?",
    options: [
      "Teste de regressão",
      "Teste de usabilidade",
      "Teste de desempenho",
      "Teste de segurança"
    ],
    answer: 0,
    feedback: "O teste de regressão verifica se uma nova alteração não quebrou funcionalidades que já funcionavam corretamente antes."
  },

  // 19 - Testes de segurança
  {
    aula: "Aula 2 — Ciclo de Vida do Software",
    tipo: "Direta",
    texto: "Alguns tipos de teste têm como foco proteger o sistema contra ataques maliciosos.",
    question: "Qual tipo de teste tem como objetivo identificar vulnerabilidades como SQL Injection e Cross-Site Scripting (XSS)?",
    options: [
      "Teste de segurança",
      "Teste funcional",
      "Teste de comportamento",
      "Teste de regressão"
    ],
    answer: 0,
    feedback: "Os testes de segurança identificam e corrigem vulnerabilidades, protegendo o sistema contra acessos não autorizados e ataques, como SQL Injection e XSS."
  },

  // 20 - Metodologias Ágeis
  {
    aula: "Aula 2 — Ciclo de Vida do Software",
    tipo: "Contexto",
    texto: "Uma equipe de desenvolvimento de aplicativos móveis trabalha em ciclos curtos, com entregas frequentes e ajustes constantes conforme o feedback dos usuários.",
    question: "Essa forma de trabalho está mais alinhada com qual abordagem de ciclo de vida?",
    options: [
      "Metodologias Ágeis",
      "Modelo em Cascata",
      "RUP",
      "Modelo Espiral"
    ],
    answer: 0,
    feedback: "As Metodologias Ágeis trabalham com ciclos curtos, incrementais e iterativos, priorizando colaboração contínua, entregas frequentes e resposta rápida a mudanças."
  },
    // 21 - Comparativo entre modelos
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Direta",
    texto: "O material compara três categorias de modelos de desenvolvimento de software.",
    question: "Qual é o foco principal dos Modelos Tradicionais, segundo o quadro comparativo apresentado?",
    options: [
      "Planejamento e controle",
      "Adaptabilidade e feedback",
      "Estruturação e entrega gradual",
      "Análise contínua de riscos"
    ],
    answer: 0,
    feedback: "O quadro comparativo indica que os Modelos Tradicionais têm como foco principal o planejamento e o controle do projeto."
  },

  // 22 - Modelos Iterativos
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Contexto",
    texto: "Os Modelos Iterativos, representados pelo RUP, dividem o projeto em ciclos repetitivos de planejamento, design, implementação e testes.",
    question: "Qual das opções abaixo é uma característica dos Modelos Iterativos?",
    options: [
      "Identificação precoce de problemas e melhoria contínua a cada ciclo",
      "Estrutura totalmente linear, sem possibilidade de revisão",
      "Ausência de envolvimento do cliente durante o desenvolvimento",
      "Entrega única do sistema completo ao final do projeto"
    ],
    answer: 0,
    feedback: "Os Modelos Iterativos permitem revisar e ajustar o projeto a cada ciclo, favorecendo identificação precoce de problemas e melhoria contínua."
  },

  // 23 - Aplicação do Cascata
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Aplicação",
    texto: "Uma equipe está desenvolvendo o software embarcado de um equipamento médico, cujos requisitos regulatórios são fixos e não devem mudar ao longo do projeto.",
    question: "Considerando as características apresentadas no material, qual modelo seria mais indicado para esse cenário?",
    options: [
      "Modelo Cascata",
      "Modelo Incremental",
      "Modelo Iterativo",
      "Nenhum dos modelos seria adequado"
    ],
    answer: 0,
    feedback: "O Modelo Cascata é indicado para projetos com requisitos bem definidos, estáveis e ambientes controlados, como é o caso de sistemas embarcados médicos."
  },

  // 24 - Etapas do Cascata
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Direta",
    texto: "O Modelo Cascata segue uma sequência fixa de etapas.",
    question: "Qual é a sequência correta das etapas do Modelo Cascata apresentada na Figura 1 do material?",
    options: [
      "Definição de Requisitos → Projeto de Sistema e Software → Implementação e Teste Unitário → Integração e Teste de Sistema → Operação e Manutenção",
      "Planejamento → Testes → Implementação → Requisitos → Manutenção",
      "Design → Requisitos → Implementação → Integração → Planejamento",
      "Requisitos → Manutenção → Implementação → Testes → Projeto"
    ],
    answer: 0,
    feedback: "A sequência apresentada é: Definição de Requisitos, Projeto de Sistema e Software, Implementação e Teste Unitário, Integração e Teste de Sistema, e Operação e Manutenção."
  },

  // 25 - Desvantagem do Cascata
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Contexto",
    texto: "Durante o desenvolvimento de um sistema utilizando o Modelo Cascata, o cliente solicita uma mudança significativa nos requisitos já na fase de integração e teste do sistema.",
    question: "Segundo o material, qual é a consequência mais provável dessa mudança tardia nesse modelo?",
    options: [
      "Retrabalho, aumento de custos e atrasos no cronograma",
      "Nenhum impacto, já que o Cascata se adapta facilmente a mudanças",
      "Redução automática do escopo do projeto",
      "Entrega antecipada do sistema"
    ],
    answer: 0,
    feedback: "A estrutura sequencial do Cascata dificulta mudanças em fases avançadas, podendo gerar retrabalho, custos adicionais e atrasos no cronograma."
  },

  // 26 - Modelo Incremental — funcionamento
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Direta",
    texto: "O Modelo Incremental também é conhecido por outro nome no material.",
    question: "Como o Modelo Incremental também é chamado, segundo o PDF?",
    options: [
      "Modelo de Desenvolvimento Evolucionário",
      "Modelo Linear Sequencial",
      "Modelo de Casos de Uso",
      "Modelo de Prototipagem Rápida"
    ],
    answer: 0,
    feedback: "O material indica que o Modelo Incremental também é chamado de Modelo de Desenvolvimento Evolucionário."
  },

  // 27 - Aplicação do Incremental
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Aplicação",
    texto: "Um banco está desenvolvendo um novo sistema e decide lançar primeiro a funcionalidade de abertura de contas, depois transferências, e em seguida pagamentos e investimentos, ajustando o projeto conforme o feedback dos usuários.",
    question: "Essa estratégia de desenvolvimento é característica de qual modelo?",
    options: [
      "Modelo Incremental",
      "Modelo Cascata",
      "Modelo Tradicional",
      "Nenhum dos modelos citados"
    ],
    answer: 0,
    feedback: "O Modelo Incremental entrega funcionalidades gradualmente, permitindo adaptação conforme o feedback dos usuários, como no exemplo de sistemas bancários citado no material."
  },

  // 28 - Vantagem do Incremental
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Direta",
    texto: "O Modelo Incremental oferece algumas vantagens específicas em relação a projetos com requisitos instáveis.",
    question: "Qual das opções abaixo é uma vantagem do Modelo Incremental citada no material?",
    options: [
      "Redução de riscos pela identificação precoce de problemas",
      "Documentação mais simples do que em outros modelos",
      "Eliminação total da necessidade de testes de integração",
      "Ausência de necessidade de comunicação entre equipe e stakeholders"
    ],
    answer: 0,
    feedback: "Como o projeto é dividido em incrementos menores, problemas podem ser identificados e resolvidos mais cedo, reduzindo riscos significativos."
  },

  // 29 - Desvantagem do Incremental
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Contexto",
    texto: "Uma equipe que utiliza o Modelo Incremental precisa coordenar o desenvolvimento de vários incrementos ao mesmo tempo, garantindo que todos se integrem corretamente ao sistema final.",
    question: "Essa necessidade de coordenação constante entre os incrementos representa qual desvantagem do modelo?",
    options: [
      "Maior complexidade de gerenciamento",
      "Baixa adaptabilidade a mudanças",
      "Menor envolvimento do cliente",
      "Estrutura excessivamente rígida"
    ],
    answer: 0,
    feedback: "A necessidade de coordenar o desenvolvimento e a integração de vários incrementos é apontada no material como uma fonte de maior complexidade de gerenciamento."
  },

  // 30 - Cascata x Incremental
  {
    aula: "Aula 3 — Modelos Cascata e Incremental",
    tipo: "Contexto",
    texto: "O material apresenta um comparativo direto entre o Modelo Cascata e o Modelo Incremental quanto ao envolvimento do cliente durante o desenvolvimento.",
    question: "De acordo com o comparativo apresentado, como esses dois modelos se diferenciam quanto ao envolvimento do cliente?",
    options: [
      "No Cascata o envolvimento é menor ao longo do processo; no Incremental há maior envolvimento e feedback",
      "No Cascata o envolvimento é maior; no Incremental o cliente não participa do processo",
      "Ambos os modelos possuem exatamente o mesmo nível de envolvimento do cliente",
      "No Incremental o cliente só participa na fase final do projeto"
    ],
    answer: 0,
    feedback: "O comparativo indica que no Cascata o cliente tem menor envolvimento ao longo do processo, enquanto no Incremental há maior envolvimento e feedback contínuo."
  },
    // 31 - Manifesto Ágil
  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Direta",
    texto: "O Manifesto Ágil, criado em 2001, estabelece os valores centrais dos métodos ágeis.",
    question: "Segundo o Manifesto Ágil, qual das opções abaixo representa corretamente um de seus quatro valores fundamentais?",
    options: [
      "Responder a mudanças mais que seguir um plano",
      "Seguir processos rígidos mais que buscar colaboração",
      "Documentação abrangente mais que software em funcionamento",
      "Negociação de contratos mais que colaboração com o cliente"
    ],
    answer: 0,
    feedback: "O Manifesto Ágil valoriza responder a mudanças mais do que seguir rigidamente um plano, reconhecendo que mudanças são inevitáveis no desenvolvimento."
  },

  // 32 - Origem histórica
  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Direta",
    texto: "Os métodos ágeis surgiram como resposta à rigidez dos modelos tradicionais.",
    question: "Quem são apontados no material como os criadores do Scrum e do Extreme Programming (XP), respectivamente?",
    options: [
      "Ken Schwaber e Jeff Sutherland (Scrum); Kent Beck e Ward Cunningham (XP)",
      "Kent Beck e Ward Cunningham (Scrum); Ken Schwaber e Jeff Sutherland (XP)",
      "Royce (Scrum); Boehm (XP)",
      "James Martin (Scrum); Ivar Jacobson (XP)"
    ],
    answer: 0,
    feedback: "O Scrum foi liderado por Ken Schwaber e Jeff Sutherland, enquanto o XP foi criado por Kent Beck e Ward Cunningham."
  },

  // 33 - Comparação com métodos tradicionais
  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Contexto",
    texto: "O material compara métodos ágeis e métodos tradicionais quanto à forma de lidar com mudanças de requisitos e feedback do cliente.",
    question: "De acordo com o Quadro 1 apresentado, como os métodos ágeis se diferenciam dos tradicionais quanto ao feedback do cliente?",
    options: [
      "Nos métodos ágeis o feedback é contínuo e constante; nos tradicionais é limitado a fases específicas",
      "Nos métodos ágeis o feedback só ocorre ao final do projeto; nos tradicionais é constante",
      "Ambas as abordagens tratam o feedback do cliente da mesma forma",
      "Métodos tradicionais não permitem qualquer tipo de feedback do cliente"
    ],
    answer: 0,
    feedback: "Nos métodos ágeis, o feedback do cliente é contínuo e constante, enquanto nos métodos tradicionais ele fica limitado a fases específicas do projeto."
  },

  // 34 - Aplicação de empresas
  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Aplicação",
    texto: "O material cita diversas empresas que adotam métodos ágeis, incluindo empresas de tecnologia, startups e instituições governamentais.",
    question: "Segundo os exemplos apresentados, qual das empresas abaixo é citada como usuária do Scrum no desenvolvimento de aplicativos mobile e plataformas digitais?",
    options: [
      "Banco Itaú",
      "Volkswagen",
      "Philips",
      "Rappi"
    ],
    answer: 0,
    feedback: "O material cita o Banco Itaú como uma empresa tradicional que emprega o Scrum em projetos como aplicativos mobile e plataformas digitais."
  },

  // 35 - Pilares do Scrum
  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Direta",
    texto: "O Scrum é estruturado com base em três pilares fundamentais.",
    question: "Quais são os três pilares do Scrum apresentados no material?",
    options: [
      "Transparência, Inspeção e Adaptação",
      "Planejamento, Execução e Controle",
      "Comunicação, Simplicidade e Feedback",
      "Colaboração, Documentação e Entrega"
    ],
    answer: 0,
    feedback: "O Scrum é baseado nos pilares de Transparência, Inspeção e Adaptação, que orientam a forma como a equipe trabalha ao longo dos sprints."
  },

  // 36 - Papéis do Scrum
  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Aplicação",
    texto: "Em uma equipe Scrum, um dos membros é responsável por remover obstáculos da equipe e garantir que os princípios do Scrum sejam seguidos corretamente, sem definir o que será desenvolvido.",
    question: "Esse papel descrito corresponde a qual ator-chave do Scrum?",
    options: [
      "Scrum Master",
      "Product Owner",
      "Time de Desenvolvimento",
      "Stakeholder"
    ],
    answer: 0,
    feedback: "O Scrum Master é o guardião do processo, responsável por remover obstáculos e garantir que os princípios do Scrum sejam seguidos pela equipe."
  },

  // 37 - Burndown Chart
  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Contexto",
    texto: "Durante uma sprint, a equipe percebe que a Linha de Trabalho Restante Real está consistentemente acima da Linha de Trabalho Restante Ideal no Burndown Chart.",
    question: "O que essa situação indica, segundo o funcionamento do Burndown Chart descrito no material?",
    options: [
      "A equipe está atrasada em relação ao ritmo esperado e pode precisar revisar o planejamento",
      "A equipe está adiantada em relação ao cronograma da sprint",
      "O gráfico está incorreto, pois a linha real nunca deve variar da ideal",
      "A sprint já foi concluída com sucesso"
    ],
    answer: 0,
    feedback: "Se a linha real se mantém acima da linha ideal, isso indica que a equipe está atrás do ritmo esperado, podendo ser necessário melhorar o ritmo ou revisar o planejamento."
  },

  // 38 - Valores do XP
  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Direta",
    texto: "O Extreme Programming (XP) se apoia em valores fundamentais que orientam suas práticas.",
    question: "Qual das opções abaixo é um dos cinco valores fundamentais do XP apresentados no material?",
    options: [
      "Coragem",
      "Transparência",
      "Inspeção",
      "Priorização de backlog"
    ],
    answer: 0,
    feedback: "Coragem é um dos cinco valores fundamentais do XP, ao lado de comunicação, simplicidade, feedback e respeito."
  },

  // 39 - Prática do XP
  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Aplicação",
    texto: "Em uma equipe que utiliza XP, dois desenvolvedores trabalham juntos na mesma estação, um escrevendo o código enquanto o outro revisa cada linha em tempo real.",
    question: "Essa prática descrita corresponde a qual técnica do Extreme Programming?",
    options: [
      "Programação em Pares",
      "Integração Contínua",
      "Refatoração",
      "Planejamento em Tempo Real"
    ],
    answer: 0,
    feedback: "A Programação em Pares consiste em dois programadores trabalhando juntos na mesma estação, promovendo colaboração e revisão de código em tempo real."
  },

  // 40 - Scrum x XP
  {
    aula: "Aula 4 — Métodos Ágeis",
    tipo: "Contexto",
    texto: "O material compara o Scrum e o Extreme Programming (XP) quanto ao foco principal de cada metodologia.",
    question: "De acordo com o comparativo apresentado, qual é a principal diferença de foco entre XP e Scrum?",
    options: [
      "XP prioriza práticas técnicas de engenharia de software, enquanto o Scrum tem uma visão mais gerencial do processo",
      "XP é focado exclusivamente em gerenciamento de equipes, enquanto o Scrum trata apenas de qualidade de código",
      "Ambos os métodos possuem exatamente o mesmo foco e as mesmas práticas",
      "O Scrum é voltado à engenharia de software, enquanto o XP organiza papéis como Product Owner e Scrum Master"
    ],
    answer: 0,
    feedback: "O XP tem foco técnico, priorizando práticas de engenharia como testes unitários e programação em pares, enquanto o Scrum assume uma visão mais gerencial, estruturando sprints e papéis como Product Owner e Scrum Master."
  },
    // 41 - Elicitação de requisitos
  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Direta",
    texto: "A elicitação é descrita como a arte de descobrir, ouvir e entender os requisitos das partes interessadas.",
    question: "Qual das opções abaixo é uma técnica de elicitação de requisitos citada no material?",
    options: [
      "Entrevistas",
      "Burndown Chart",
      "Refatoração",
      "Sprint Retrospective"
    ],
    answer: 0,
    feedback: "Entrevistas, questionários e workshops são citados como técnicas usadas na elicitação de requisitos, para coletar informações diretamente dos stakeholders."
  },

  // 42 - Requisitos funcionais x não funcionais
  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Contexto",
    texto: "O material usa uma metáfora musical para diferenciar as duas categorias de requisitos de um sistema.",
    question: "Segundo essa metáfora, o que representam os Requisitos Funcionais e os Requisitos Não Funcionais, respectivamente?",
    options: [
      "A melodia principal e a harmonia da música",
      "A harmonia e a melodia principal da música",
      "O ritmo e a letra da música",
      "Apenas a melodia, já que os não funcionais não têm metáfora associada"
    ],
    answer: 0,
    feedback: "O material compara os Requisitos Funcionais à 'melodia principal da sinfonia do software' e os Não Funcionais à 'harmonia que completa a música'."
  },

  // 43 - Aplicação: cronograma e priorização
  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Aplicação",
    texto: "Uma equipe está definindo quais funcionalidades de um sistema são urgentes e determinantes para o lançamento, e quais podem ser implementadas em uma fase futura.",
    question: "Esse processo de definição de prioridades entre funcionalidades está diretamente relacionado a qual etapa descrita no material?",
    options: [
      "Priorização de Requisitos Funcionais",
      "Elicitação de Requisitos Não Funcionais",
      "Definição de Critérios de Aceitação apenas",
      "Auditoria de Acessos"
    ],
    answer: 0,
    feedback: "A priorização de requisitos funcionais envolve decidir quais funcionalidades são urgentes e determinantes e quais podem esperar, sendo essencial para o cronograma do projeto."
  },

  // 44 - Escopo fixo x variado
  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Direta",
    texto: "O autor do material discute duas filosofias de definição de escopo de um projeto de software.",
    question: "Qual filosofia de escopo o autor Wellington W. F. Sarmento declara preferir?",
    options: [
      "Escopo Variado de Produto",
      "Escopo Fixo de Produto",
      "Nenhuma das duas, defendendo um modelo híbrido obrigatório",
      "O material não apresenta uma preferência do autor"
    ],
    answer: 0,
    feedback: "O autor defende o Escopo Variado de Produto, associado aos métodos ágeis, por permitir maior flexibilidade diante de mudanças nos requisitos ao longo do desenvolvimento."
  },

  // 45 - Critérios de aceitação
  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Contexto",
    texto: "Uma equipe está definindo as condições que uma User Story deve cumprir para ser considerada completa pelo cliente.",
    question: "Qual das características abaixo NÃO é citada no material como uma característica dos critérios de aceitação?",
    options: [
      "Flexíveis, podendo ser interpretados de formas diferentes por cada envolvido",
      "Claros e específicos, sem ambiguidades",
      "Mensuráveis, possíveis de medir ou testar",
      "Relevantes, diretamente relacionados à história de usuário"
    ],
    answer: 0,
    feedback: "O material afirma que os critérios de aceitação devem ser objetivos, de forma que todos os envolvidos concordem sobre o que significa cumpri-los — e não flexíveis ou passíveis de interpretações diferentes."
  },

  // 46 - MVP
  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Aplicação",
    texto: "Uma equipe decide lançar primeiro a funcionalidade de criação de eventos, depois a gestão de convidados, seguida pela criação de tarefas e, por fim, o envio de convites por e-mail, testando a aceitação do produto com o mínimo de esforço possível.",
    question: "Essa estratégia de desenvolvimento incremental, priorizando funcionalidades essenciais, exemplifica qual conceito apresentado no material?",
    options: [
      "MVP (Minimum Viable Product)",
      "Requisito Não Funcional de Escalabilidade",
      "Escopo Fixo de Produto",
      "Auditoria de Acessos"
    ],
    answer: 0,
    feedback: "O MVP é a versão mais simples e funcional de um produto, desenvolvida com o mínimo de esforço para testar uma ideia e coletar feedback, como no exemplo do Event Planner."
  },

  // 47 - Requisitos não funcionais
  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Direta",
    texto: "O material detalha diversas características de qualidade que um sistema deve possuir.",
    question: "Qual requisito não funcional garante que o sistema esteja disponível e funcional pelo menos 99,9% do tempo, excluindo manutenções programadas?",
    options: [
      "Confiabilidade",
      "Usabilidade",
      "Compatibilidade",
      "Manutenibilidade"
    ],
    answer: 0,
    feedback: "A Confiabilidade refere-se à capacidade do sistema de estar disponível e funcional pelo menos 99,9% do tempo, excluindo períodos de manutenção programada."
  },

  // 48 - User Stories
  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Contexto",
    texto: "Uma equipe está descrevendo uma funcionalidade do sistema utilizando o formato: 'Como recepcionista do hospital, eu quero cadastrar novos pacientes, para que possamos ter um registro completo dos que chegam ao hospital.'",
    question: "Essa forma de descrever a funcionalidade corresponde a qual técnica apresentada no material?",
    options: [
      "User Story",
      "Diagrama de Casos de Uso",
      "Requisito Não Funcional",
      "Ferramenta CASE"
    ],
    answer: 0,
    feedback: "As User Stories descrevem funcionalidades a partir da perspectiva do usuário, em linguagem próxima ao cliente, geralmente no formato 'Como [usuário], eu quero [ação], para que [objetivo]'."
  },

  // 49 - Benefícios da análise de requisitos
  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Direta",
    texto: "O material lista diversos benefícios de um bom processo de elicitação e análise de requisitos.",
    question: "Qual das opções abaixo é apresentada como um benefício de investir em elicitação e análise de requisitos?",
    options: [
      "Redução de retrabalho e custos",
      "Eliminação total da necessidade de testes",
      "Garantia de que os requisitos nunca mudarão",
      "Dispensa da comunicação entre equipe e stakeholders"
    ],
    answer: 0,
    feedback: "Um bom processo de elicitação e análise evita o desenvolvimento de funcionalidades desnecessárias, reduzindo retrabalho e custos."
  },

  // 50 - Segurança como requisito não funcional
  {
    aula: "Aula 5 — Análise de Requisitos",
    tipo: "Aplicação",
    texto: "Em um sistema de prontuário eletrônico, apenas médicos e enfermeiros autenticados e autorizados podem visualizar ou modificar dados sensíveis dos pacientes, com diferentes níveis de permissão conforme o papel de cada usuário.",
    question: "Essa característica do sistema está diretamente relacionada a qual requisito não funcional descrito no material?",
    options: [
      "Segurança",
      "Usabilidade",
      "Escalabilidade",
      "Compatibilidade"
    ],
    answer: 0,
    feedback: "A Segurança exige medidas robustas para proteger dados contra acesso não autorizado, incluindo controle de acesso baseado em papéis, como descrito no exemplo do prontuário eletrônico."
  },
    // 51 - Tipos de entrevista
  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Direta",
    texto: "As entrevistas podem seguir diferentes níveis de estruturação.",
    question: "Qual tipo de entrevista segue um roteiro rígido de perguntas predefinidas, útil para obter informações comparáveis entre diferentes stakeholders?",
    options: [
      "Entrevista Estruturada",
      "Entrevista Semiestruturada",
      "Entrevista Não Estruturada",
      "Entrevista Contextual"
    ],
    answer: 0,
    feedback: "A Entrevista Estruturada segue um roteiro fixo de perguntas, permitindo comparar respostas entre diferentes stakeholders de forma padronizada."
  },

  // 52 - Aplicação: entrevista semiestruturada
  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Aplicação",
    texto: "Um analista pergunta a um gerente sobre as funcionalidades desejadas do sistema seguindo um roteiro predefinido, mas, ao ouvir uma resposta sobre integração entre sistemas, decide aprofundar o assunto com perguntas adicionais não planejadas.",
    question: "Esse comportamento do analista caracteriza qual tipo de entrevista?",
    options: [
      "Entrevista Semiestruturada",
      "Entrevista Estruturada",
      "Entrevista Não Estruturada",
      "Reunião de Brainstorming"
    ],
    answer: 0,
    feedback: "A Entrevista Semiestruturada combina perguntas predefinidas com a flexibilidade de explorar novos tópicos que surgem durante a conversa."
  },

  // 53 - Desafios das entrevistas
  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Contexto",
    texto: "Durante o levantamento de requisitos por meio de entrevistas, diferentes stakeholders podem fornecer informações que não coincidem entre si.",
    question: "Segundo o material, qual é um dos desafios das entrevistas relacionado a essa situação?",
    options: [
      "Surgimento de informações inconsistentes ou conflitantes entre diferentes stakeholders",
      "Impossibilidade total de identificar as necessidades dos usuários",
      "Ausência completa de qualquer tipo de comunicação entre analista e entrevistado",
      "Obrigatoriedade de utilizar apenas entrevistas não estruturadas nesses casos"
    ],
    answer: 0,
    feedback: "Um dos desafios das entrevistas é lidar com informações inconsistentes ou conflitantes entre stakeholders, exigindo que o analista reconcilie essas discrepâncias."
  },

  // 54 - Hard skills e soft skills
  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Direta",
    texto: "O material diferencia hard skills de soft skills necessárias ao profissional de requisitos.",
    question: "Qual das opções abaixo é classificada como uma soft skill no material?",
    options: [
      "Empatia",
      "Conhecimento Técnico",
      "Documentação",
      "Análise de Dados"
    ],
    answer: 0,
    feedback: "Empatia é uma soft skill, relacionada a comportamento e habilidades sociais, enquanto conhecimento técnico, documentação e análise de dados são hard skills."
  },

  // 55 - Tipos de reunião
  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Aplicação",
    texto: "Uma equipe organiza uma sessão colaborativa e estruturada, com atividades práticas, para mapear os processos atuais de uma organização e identificar áreas de melhoria.",
    question: "Esse tipo de reunião descrito corresponde a qual conceito apresentado no material?",
    options: [
      "Workshop",
      "Reunião de Brainstorming",
      "Entrevista Estruturada",
      "Análise de Documentos"
    ],
    answer: 0,
    feedback: "O Workshop é uma sessão colaborativa mais estruturada, combinando elementos de brainstorming e análise, geralmente com atividades práticas."
  },

  // 56 - Desafios das reuniões
  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Direta",
    texto: "As reuniões enfrentam desafios específicos para o levantamento de requisitos.",
    question: "Qual dos itens abaixo é apontado como um desafio das reuniões no material?",
    options: [
      "Garantir a participação ativa e o engajamento de todos os stakeholders",
      "Impossibilidade de discutir diferentes perspectivas",
      "Ausência total de necessidade de planejamento",
      "Incapacidade de gerar qualquer tipo de consenso"
    ],
    answer: 0,
    feedback: "Garantir a participação ativa e o engajamento de todos os stakeholders é um dos principais desafios das reuniões, especialmente diante de conflitos de agenda ou interesses divergentes."
  },

  // 57 - Etnografia
  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Contexto",
    texto: "Um analista passa um dia inteiro em um hospital observando como médicos e enfermeiros utilizam o sistema de prontuário eletrônico, sem interferir diretamente no trabalho deles.",
    question: "Essa prática descrita corresponde a qual técnica de levantamento de requisitos?",
    options: [
      "Etnografia",
      "Entrevista Estruturada",
      "Análise de Documentos",
      "Reunião de Análise e Revisão"
    ],
    answer: 0,
    feedback: "A Etnografia envolve a observação direta dos usuários em seu ambiente natural de trabalho, permitindo identificar necessidades com base em comportamentos reais."
  },

  // 58 - Efeito observador
  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Direta",
    texto: "A etnografia apresenta desafios específicos relacionados à observação dos usuários.",
    question: "Qual desafio da etnografia ocorre quando os usuários mudam seu comportamento por saberem que estão sendo observados?",
    options: [
      "Efeito observador",
      "Efeito de confiança",
      "Efeito de documentação",
      "Efeito de negociação"
    ],
    answer: 0,
    feedback: "O efeito observador ocorre quando os usuários alteram seu comportamento por saberem que estão sendo observados, o que pode afetar a validade dos dados coletados."
  },

  // 59 - Análise de documentos
  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Aplicação",
    texto: "Ao revisar registros de suporte técnico de um sistema, uma equipe percebe que os usuários solicitam repetidamente uma funcionalidade que ainda não existe no sistema atual.",
    question: "Esse processo de identificar necessidades a partir de registros existentes corresponde a qual técnica de levantamento de requisitos?",
    options: [
      "Análise de Documentos",
      "Etnografia",
      "Entrevista Não Estruturada",
      "Reunião de Brainstorming"
    ],
    answer: 0,
    feedback: "A Análise de Documentos envolve revisar documentos existentes, como registros de suporte, para identificar requisitos implícitos e necessidades não atendidas."
  },

  // 60 - Desafios da análise de documentos
  {
    aula: "Aula 6 — Técnicas de Levantamento de Requisitos",
    tipo: "Direta",
    texto: "A análise de documentos também apresenta limitações como técnica de levantamento de requisitos.",
    question: "Qual das opções abaixo é apontada como um desafio da análise de documentos?",
    options: [
      "Documentos podem estar incompletos ou desatualizados",
      "É impossível revisar mais de um documento por vez",
      "Não permite identificar nenhum requisito funcional",
      "Substitui totalmente a necessidade de entrevistas e reuniões"
    ],
    answer: 0,
    feedback: "Um dos desafios da análise de documentos é que eles podem estar incompletos ou desatualizados, levando a uma compreensão incorreta dos requisitos."
  },
  
  // 61 - Conceito de POO
  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Direta",
    texto: "A POO organiza o código de uma forma específica, diferente da programação procedural.",
    question: "O que caracteriza principalmente o paradigma da Programação Orientada a Objetos?",
    options: [
      "A execução sequencial de instruções sem uso de funções",
      "A organização do código em torno de objetos que encapsulam dados e comportamentos",
      "O uso exclusivo de variáveis globais para armazenar estados",
      "A separação total entre dados e qualquer tipo de lógica de negócio"
    ],
    answer: 1,
    feedback: "A POO estrutura o sistema como um conjunto de objetos que encapsulam dados e comportamentos relacionados, promovendo reutilização e modularidade."
  },

  // 62 - Papel da AOO
  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Direta",
    texto: "Antes de qualquer linha de código ser escrita, existe uma etapa de planejamento do sistema.",
    question: "Qual é o principal objetivo da Análise Orientada a Objetos (AOO)?",
    options: [
      "Otimizar o desempenho do processador durante a execução do sistema",
      "Traduzir diretamente algoritmos matemáticos em código-fonte",
      "Identificar e definir os objetos que compõem o sistema, criando um modelo próximo da realidade do problema",
      "Substituir totalmente a etapa de testes de software"
    ],
    answer: 2,
    feedback: "A AOO busca identificar os objetos que representam entidades do mundo real ou abstrato, criando um modelo intuitivo que facilita a compreensão e a implementação."
  },

  // 63 - Encapsulamento
  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Contexto",
    texto: "Em um sistema bancário, a classe ContaCorrente guarda o saldo do cliente em um atributo privado, acessível apenas por métodos específicos como depositar() e sacar().",
    question: "Esse comportamento da classe ContaCorrente é um exemplo de qual conceito da AOO?",
    options: [
      "Encapsulamento",
      "Herança",
      "Polimorfismo",
      "Modelagem funcional"
    ],
    answer: 0,
    feedback: "O encapsulamento esconde os detalhes internos de um objeto, expondo apenas o necessário — nesse caso, o saldo só é alterado por métodos controlados."
  },

  // 64 - Herança
  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Contexto",
    texto: "Uma classe Funcionario possui atributos como nome e salário. A classe Gerente é criada a partir dela, reaproveitando esses atributos e adicionando o método aprovarOrcamento().",
    question: "Esse tipo de relação entre Funcionario e Gerente representa qual mecanismo da POO?",
    options: [
      "Abstração",
      "Encapsulamento",
      "Composição obrigatória",
      "Herança"
    ],
    answer: 3,
    feedback: "A herança permite que uma classe derive de outra, reaproveitando atributos e métodos e formando hierarquias entre classes mais gerais e mais específicas."
  },

  // 65 - Polimorfismo
  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Aplicação",
    texto: "Um sistema de folha de pagamento percorre uma lista de objetos do tipo Funcionario (que inclui subclasses como Vendedor e Gerente) e chama o método calcularBonus() de cada um, obtendo resultados diferentes conforme o tipo do funcionário.",
    question: "Esse comportamento, em que o mesmo método produz resultados distintos dependendo da subclasse, ilustra qual conceito?",
    options: [
      "Modelagem funcional da OMT",
      "Polimorfismo",
      "Componentização de software",
      "Abstração de dados via struct"
    ],
    answer: 1,
    feedback: "O polimorfismo permite que o mesmo método seja redefinido (override) em diferentes subclasses, produzindo comportamentos distintos ao ser chamado de forma unificada."
  },

  // 66 - OMT
  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Direta",
    texto: "A técnica OMT foi desenvolvida por James Rumbaugh em 1991.",
    question: "Em quais três aspectos a OMT divide a modelagem de um sistema?",
    options: [
      "Estrutura estática, comportamento dinâmico e fluxo de dados",
      "Segurança, desempenho e escalabilidade",
      "Testes unitários, testes de integração e testes de aceitação",
      "Interface gráfica, banco de dados e rede"
    ],
    answer: 0,
    feedback: "A OMT organiza a modelagem em estrutura estática (modelagem de objetos), comportamento dinâmico (modelagem dinâmica) e fluxo de dados (modelagem funcional)."
  },

  // 67 - BON
  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Contexto",
    texto: "Uma equipe de desenvolvimento precisa de uma técnica de modelagem que facilite a transição direta entre o design do sistema e sua implementação em código.",
    question: "Qual técnica de modelagem, criada por Jean-Marc Nerson e Kim Waldén, é indicada para esse cenário?",
    options: [
      "UML",
      "BON",
      "OMT",
      "MVC"
    ],
    answer: 1,
    feedback: "A BON foca na integração entre análise, design e implementação, usando notação gráfica simples e sendo eficaz em projetos que exigem transição suave entre design e código."
  },

  // 68 - Diagrama de Classes (UML)
  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Aplicação",
    texto: "Ao documentar um sistema de vendas, um analista precisa mostrar visualmente as classes do sistema, seus atributos, métodos e o relacionamento entre elas, incluindo indicadores de visibilidade como público e privado.",
    question: "Qual diagrama da UML é o mais adequado para essa finalidade?",
    options: [
      "Diagrama de Casos de Uso",
      "Diagrama de Implantação",
      "Diagrama de Máquina de Estados",
      "Diagrama de Classes"
    ],
    answer: 3,
    feedback: "O Diagrama de Classes apresenta as entidades junto com atributos, métodos e os relacionamentos entre classes, incluindo símbolos de visibilidade como + (público) e - (privado)."
  },

  // 69 - Código: herança e interface em Java
  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Código",
    texto: "Considere a hierarquia de classes abaixo, em que Mamifero implementa a interface Animal e Cachorro herda de Mamifero.",
    question: "Ao executar o trecho abaixo, o que será impresso ao chamar os métodos de 'cachorro'?",
    code: `public abstract class Mamifero implements Animal {
    protected String nome;
    public Mamifero(String nome) { this.nome = nome; }
    public void mover() {
        System.out.println(nome + " está se movendo");
    }
    public abstract void fazerSom();
}

public class Cachorro extends Mamifero {
    public Cachorro(String nome) { super(nome); }
    @Override
    public void fazerSom() {
        System.out.println(nome + " faz: Au Au");
    }
}

Animal cachorro = new Cachorro("Rex");
cachorro.fazerSom();
cachorro.mover();`,
    options: [
      "Erro de compilação, pois Cachorro não pode ser referenciado como Animal",
      "\"Rex está se movendo\" seguido de \"Rex faz: Au Au\"",
      "\"Rex faz: Au Au\" seguido de \"Rex está se movendo\"",
      "Apenas \"Rex faz: Au Au\", pois mover() não é chamado por herança"
    ],
    answer: 2,
    feedback: "fazerSom() é sobrescrito em Cachorro e imprime 'Rex faz: Au Au'; mover() é herdado de Mamifero e imprime 'Rex está se movendo', nessa ordem de chamada."
  },

  // 70 - Frameworks e componentização
  {
    aula: "Aula 7 — Análise e Programação Orientada a Objetos",
    tipo: "Aplicação",
    texto: "Uma desenvolvedora Python quer criar uma aplicação web sem precisar implementar do zero funcionalidades básicas comuns a esse tipo de sistema, aproveitando uma estrutura reutilizável já existente.",
    question: "Qual das opções a seguir é um exemplo de framework citado no material que atenderia a essa necessidade?",
    options: [
      "WinUI",
      "Express",
      "Flask",
      "Web Components"
    ],
    answer: 2,
    feedback: "Flask é citado como framework para desenvolvimento de aplicações web em Python, similar ao Express, que cumpre esse papel em JavaScript/Node.js."
  }

],

ava: [
  // aula: Aula 1 e 2
  // 1 - análise requisitos
  {
    aula: "Aula 1 e 2",
    texto: "Uma equipe de desenvolvimento recebeu a demanda de construir um sistema de gerenciamento de consultas para uma rede de clínicas. O gerente de projetos convocou uma reunião com os médicos, recepcionistas e diretores administrativos para discutir as necessidades do sistema. Nessa reunião, foram utilizadas técnicas de workshop e questionários estruturados para levantar as funcionalidades desejadas. A documentação produzida ao final seria entregue à equipe técnica como ponto de partida para o projeto arquitetural.",
    question: "A fase do ciclo de vida que descreve essa atividade, segundo a literatura da disciplina, é:",
    code: ``,
    options: [
      "Manutenção, pois compreende a coleta de feedbacks de usuários para adaptar o sistema a novas necessidades.",
      "Design, pois envolve a criação de diagramas UML a partir das necessidades levantadas.",
      "Planejamento, porque a reunião com stakeholders define o cronograma e os recursos do projeto.",
      "Implantação, uma vez que envolve a interação direta com usuários finais no ambiente de produção.",
      "Análise de Requisitos, cuja essência é coletar, analisar e documentar as necessidades dos usuários e funcionalidades esperadas do software."
    ],
    answer: 4,
    feedback: "A situação descrita é típica da fase de ==ddl==Análise de Requisitos==, pois o foco está em ouvir os diferentes stakeholders (médicos, recepcionistas, diretores) por meio de técnicas de ==dml==elicitação== (workshops e questionários) para levantar e documentar o que o sistema precisa fazer, antes de qualquer definição de arquitetura. As demais opções descrevem fases posteriores do ciclo de vida: Design trabalha sobre requisitos já levantados, Planejamento trata de cronograma/recursos, Implantação ocorre após o sistema pronto e Manutenção acontece após o uso em produção."
  },

  // 2 - implantação sistema
  {
    aula: "Aula 1 e 2",
    texto: "Uma rede de supermercados com 120 lojas contratou uma empresa de TI para substituir o sistema legado de gestão de inventário. Após a homologação, a equipe precisou configurar servidores em todas as unidades, instalar o novo sistema nos pontos de venda e transferir o histórico de produtos e fornecedores do banco de dados antigo para o novo. O gerente de TI orientou que nenhuma loja deveria operar com o sistema novo sem que todos os dados migrados fossem validados.",
    question: "Essa etapa do ciclo de vida é denominada",
    code: ``,
    options: [
      "Análise de Requisitos, já que inclui a identificação das necessidades do ambiente de produção.",
      "Testes, porque a validação dos dados migrados constitui uma forma de verificação do sistema.",
      "Design, porque a definição da arquitetura de bancos de dados e servidores integra a fase de projeto do sistema.",
      "Implantação, que consiste exatamente na preparação do ambiente de produção, configuração de infraestrutura e migração de dados para disponibilizar o sistema aos usuários finais.",
      "Manutenção, pois envolve a correção de inconsistências encontradas durante a transferência de dados."
    ],
    answer: 3,
    feedback: "Trata-se da fase de ==ddl==Implantação==, caracterizada pela preparação do ambiente de produção (configuração de servidores), instalação do sistema nas unidades e ==dml==migração de dados== do sistema legado para o novo. Embora a validação dos dados envolva verificação, ela ocorre aqui como parte do processo de disponibilização do sistema aos usuários finais, e não como uma fase isolada de Testes — que normalmente antecede a implantação em ambientes controlados."
  },

  // 3 - testes regressão
  {
    aula: "Aula 1 e 2",
    texto: "Uma equipe de desenvolvimento lançou a versão 2.5 de um sistema de CRM adicionando um módulo de automação de campanhas de marketing. Logo após o lançamento, o gestor de vendas reportou que o histórico de conversões, funcionalidade que existia desde a versão 1.0 e que nunca havia apresentado problemas, passou a exibir dados incorretos. A analista de qualidade reconheceu imediatamente qual tipo de teste deveria ter sido executado antes do lançamento para detectar esse problema.",
    question: "Qual tipo de teste a analista identificou e qual é a razão de ser dessa modalidade?",
    code: ``,
    options: [
      "Testes funcionais, porque verificam se cada funcionalidade do sistema opera conforme especificado nos requisitos.",
      "Testes de comportamento, que simulam interações de usuários e verificam a resposta do sistema a entradas inesperadas.",
      "Testes de regressão, cuja finalidade é garantir que novas funcionalidades ou alterações no código não introduzam defeitos em partes do sistema que já estavam funcionando corretamente.",
      "Testes de desempenho, pois o novo módulo sobrecarregou o banco de dados e corrompeu os dados de conversão.",
      "Testes de usabilidade, porque a nova interface do módulo de automação confundiu os usuários na leitura dos relatórios."
    ],
    answer: 2,
    feedback: "O cenário exemplifica exatamente o motivo de existirem os ==dml==testes de regressão==: uma funcionalidade antiga (histórico de conversões) que nunca apresentou problemas passou a falhar após a inclusão de um novo módulo. Isso mostra que alterações no código, mesmo em áreas aparentemente isoladas, podem gerar ==danger==efeitos colaterais== em partes já estáveis do sistema — e é justamente esse tipo de regressão que esses testes visam detectar antes do lançamento."
  },

  // 4 - modelos ciclo vida
  {
    aula: "Aula 1 e 2",
    texto: "Uma empresa de consultoria foi contratada para escolher o modelo de ciclo de vida mais adequado para quatro projetos distintos: (P1) um sistema embarcado de controle de reator nuclear, com requisitos altamente regulamentados e estáveis; (P2) um aplicativo de delivery com requisitos mutáveis e necessidade de lançamento incremental; (P3) um protótipo de interface para validar a experiência do usuário antes do desenvolvimento completo; (P4) um grande sistema corporativo de RH com alta complexidade, necessidade de documentação detalhada e múltiplas iterações de refinamento.",
    question: "Com base no quadro comparativo de modelos apresentado no material de referência, a correspondência correta entre projetos e modelos é:",
    code: ``,
    options: [
      "P1 → Espiral; P2 → RAD; P3 → Cascata; P4 → Incremental.",
      "P1 → Prototipagem; P2 → RUP; P3 → Ágil; P4 → Cascata.",
      "P1 → Ágil; P2 → Cascata; P3 → Espiral; P4 → RUP.",
      "P1 → RUP; P2 → Espiral; P3 → Incremental; P4 → Cascata.",
      "P1 → Cascata; P2 → Ágil; P3 → Prototipagem; P4 → RUP."
    ],
    answer: 4,
    feedback: "A correspondência correta reflete o perfil de cada projeto com o modelo mais adequado: P1 (requisitos estáveis e regulamentados) combina com o ==key==Modelo Cascata==, cuja estrutura sequencial rígida favorece ambientes previsíveis; P2 (requisitos mutáveis, entregas rápidas) se encaixa nas ==key==Metodologias Ágeis==; P3 (validar experiência do usuário antes do desenvolvimento completo) é o uso clássico de ==key==Prototipagem==; e P4 (alta complexidade, muita documentação e iterações) corresponde ao ==key==RUP==, que combina iteração com rigor documental."
  },

  // 5 - modelo cascata
  {
    aula: "Aula 1 e 2",
    texto: "Durante uma reunião de kickoff, o analista de um grande integrador de sistemas apresenta a seguinte argumentação ao cliente: \"Nosso contrato prevê que todos os requisitos funcionais e não funcionais sejam levantados, validados e congelados antes do início do desenvolvimento. Qualquer alteração após essa etapa demandará um aditivo contratual.\" Essa postura está alinhada com a filosofia de qual modelo de ciclo de vida? Considerando que o sistema a ser construído é um módulo de folha de pagamento cujas regras legais são amplamente conhecidas e raramente mudam, a escolha descrita pelo analista",
    question: "A escolha descrita pelo analista:",
    code: ``,
    options: [
      "é inviável porque o Modelo em Cascata nunca foi aplicado a sistemas corporativos de grande porte.",
      "corresponde ao Modelo em Cascata e é tecnicamente adequada para o contexto apresentado, dado que os requisitos são estáveis.",
      "corresponde ao Modelo Espiral, caracterizado justamente pela negociação contratual iterativa.",
      "reflete a filosofia do RUP, que define um contrato único e imutável para todo o projeto.",
      "é inadequada, pois nenhum modelo moderno permite o congelamento de requisitos."
    ],
    answer: 1,
    feedback: "A prática de congelar requisitos antes do desenvolvimento é a marca registrada do ==ddl==Modelo em Cascata==. Como o sistema em questão trata de regras de folha de pagamento amplamente conhecidas e estáveis, esse modelo é tecnicamente adequado, pois o baixo risco de mudança compensa sua rigidez. O Modelo Espiral e o RUP, ao contrário, são orientados a ==key==iterações== e à absorção contínua de mudanças, o que não condiz com a postura contratual descrita."
  },

  // 6 - casos uso classes
  {
    aula: "Aula 1 e 2",
    texto: "Um professor de Engenharia de Software apresenta o seguinte quadro para seus alunos: \"A análise define o que o sistema deve fazer; a modelagem mostra como o sistema deve fazer.\" Em seguida, apresenta um caso em que uma equipe produziu diagramas de caso de uso para mapear interações de usuários com um sistema de biblioteca, e diagramas de classes para representar as entidades do domínio (Livro, Leitor, Empréstimo). O professor pergunta qual é a relação entre os dois instrumentos utilizados.",
    question: "Com base no material de referência, a afirmação que melhor descreve essa relação é:",
    code: ``,
    options: [
      "Os diagramas de caso de uso são produzidos na fase de Design, posterior à elaboração dos diagramas de classes.",
      "São instrumentos concorrentes: os diagramas de caso de uso substituem os diagramas de classes em projetos ágeis.",
      "Ambos pertencem exclusivamente à modelagem formal, pois utilizam notação padronizada da UML.",
      "O diagrama de classes pertence exclusivamente à fase de Implementação, não à modelagem.",
      "São instrumentos complementares: os diagramas de caso de uso pertencem à análise (o que o sistema faz) e os diagramas de classes pertencem à modelagem orientada a objetos (como o sistema é estruturado), ambos fazendo parte do processo de desenvolvimento."
    ],
    answer: 4,
    feedback: "Os dois instrumentos são ==key==complementares==, não concorrentes: os diagramas de caso de uso pertencem à etapa de ==ddl==análise== (respondem \"o que\" o sistema deve fazer, sob a ótica do usuário) enquanto os diagramas de classes pertencem à ==ddl==modelagem orientada a objetos== (respondem \"como\" o sistema é estruturado internamente). Um não substitui o outro; ambos coexistem ao longo do processo de desenvolvimento, servindo a propósitos diferentes."
  },

  // 7 - modelagem OO
  {
    aula: "Aula 1 e 2",
    texto: "No projeto de um sistema hospitalar, a equipe de modelagem criou representações visuais nas quais cada entidade — paciente, médico, medicamento — foi descrita com seus respectivos atributos (nome, CRM, dosagem) e comportamentos (agendar consulta, prescrever, dispensar). Essas representações permitiram que desenvolvedores, analistas e gestores hospitalares tivessem uma compreensão unificada do sistema antes do início da codificação.",
    question: "Acerca do tipo de modelagem adotado pela equipe, é correto afirmar que:",
    code: ``,
    options: [
      "trata-se da Modelagem Funcional, que decompõe o sistema em blocos funcionais independentes segundo o princípio IDEF0.",
      "trata-se da Modelagem Formal, que emprega lógica matemática como Redes de Petri para descrever comportamentos com precisão.",
      "trata-se da Modelagem Estruturada, centrada na representação de fluxos de dados e processos por meio de DFDs.",
      "trata-se da Modelagem Baseada em Processos, cuja ênfase está na definição e análise do fluxo de trabalho do sistema.",
      "trata-se da Modelagem Orientada a Objetos, que organiza dados e processos em objetos com atributos e métodos, facilitando a compreensão das relações e interações do sistema."
    ],
    answer: 4,
    feedback: "A descrição das entidades (paciente, médico, medicamento) com seus respectivos ==key==atributos== (nome, CRM, dosagem) e ==key==comportamentos== (agendar, prescrever, dispensar) é a essência da ==ddl==Modelagem Orientada a Objetos==, que une dados e processos em um mesmo elemento (o objeto). As demais opções descrevem abordagens distintas: a Modelagem Funcional decompõe em blocos de funções, a Formal usa notação matemática rigorosa, e a Estruturada foca em fluxos de dados (DFDs), sem essa junção atributo-comportamento típica da OO."
  },

  // 8 - fase design UML
  {
    aula: "Aula 1 e 2",
    texto: "Em um projeto de e-commerce, a equipe técnica recebeu o documento de requisitos aprovado e partiu para a criação de diagramas de classes que representam produtos, usuários e pedidos, além de diagramas de sequência que modelam o fluxo de compra desde a seleção do item até a confirmação do pagamento. Esses artefatos servirão de base para a codificação nas semanas seguintes.",
    question: "Considerando o ciclo de vida descrito no material de referência, a fase em que a equipe se encontra, e a linguagem de modelagem utilizada, é correto afirmar que:",
    code: ``,
    options: [
      "a equipe está na fase de Planejamento, definindo cronograma e alocando recursos por meio de diagramas estruturados.",
      "a equipe está na fase de Implementação, utilizando UML como linguagem de programação orientada a objetos.",
      "a equipe está na fase de Design, transformando requisitos em uma arquitetura detalhada por meio da linguagem UML.",
      "a equipe está na fase de Testes, pois os diagramas de sequência descrevem cenários de validação do sistema.",
      "a equipe está na fase de Análise de Requisitos, produzindo documentação visual das necessidades dos stakeholders."
    ],
    answer: 2,
    feedback: "A equipe já possui os requisitos aprovados e está transformando-os em uma representação arquitetural (diagramas de classes e sequência), o que caracteriza a fase de ==ddl==Design==. É importante notar que a ==key==UML== é uma linguagem de **modelagem** — e não de programação —, usada justamente para estruturar visualmente o sistema antes da codificação propriamente dita, que ocorreria na fase seguinte, de Implementação."
  },

  // 9 - manutenção bug
  {
    aula: "Aula 1 e 2",
    texto: "Um sistema de gestão escolar foi implantado com sucesso há dois anos. Nesse período, professores identificaram falhas no cálculo de médias para turmas com recuperação paralela, e a diretoria solicitou a inclusão de um módulo de relatórios de desempenho por turma e a integração com a plataforma de pagamento de mensalidades. A equipe de software classificou essas demandas em categorias distintas antes de priorizá-las.",
    question: "Qual das opções abaixo descreve corretamente as categorias e a fase do ciclo de vida correspondente?",
    code: ``,
    options: [
      "Ambas pertencem à fase de Análise de Requisitos, pois representam novas necessidades levantadas pelos usuários.",
      "A integração com pagamento é Implantação, pois representa a instalação de um novo módulo no ambiente de produção.",
      "Ambas as demandas são \"novas funcionalidades\" e pertencem à fase de Implementação.",
      "A falha de cálculo pertence à fase de Testes, pois deveria ter sido detectada antes da implantação.",
      "A falha no cálculo configura correção de bug e os novos módulos configuram atualizações, ambas pertencentes à fase de Manutenção."
    ],
    answer: 4,
    feedback: "Ambas as demandas ocorrem após dois anos de sistema em produção, o que já indica a fase de ==ddl==Manutenção==. Dentro dela, existem tipos distintos: a falha no cálculo de médias é uma ==danger==correção de bug== (manutenção corretiva), enquanto os novos módulos de relatórios e integração de pagamento são ==term==atualizações/evoluções== (manutenção evolutiva). Classificar corretamente essas demandas ajuda a equipe a priorizá-las de forma adequada, mesmo estando ambas sob o guarda-chuva da mesma fase do ciclo de vida."
  },

  // 10 - protótipo
  {
    aula: "Aula 1 e 2",
    texto: "Um desenvolvedor sênior relata que, em determinado projeto, a equipe construiu uma versão simplificada do sistema com o objetivo de mostrar ao cliente a interface e as principais funcionalidades antes de investir no desenvolvimento completo. O cliente pôde interagir com essa versão, sugerir ajustes na navegação e esclarecer requisitos que, até então, estavam ambíguos.",
    question: "Com base no material de referência da disciplina, esse recurso utilizado pela equipe é denominado:",
    code: ``,
    options: [
      "backlog, que concentra os requisitos priorizados que ainda precisam ser implementados.",
      "sprint, porque trata-se de um ciclo curto de desenvolvimento com entrega ao final.",
      "diagrama UML, utilizado para representar visualmente a interface do sistema antes do desenvolvimento.",
      "protótipo, cuja função principal é capturar e refinar os requisitos do cliente por meio de uma versão inicial do software.",
      "incremento, pois representa uma entrega parcial e funcional do sistema ao cliente."
    ],
    answer: 3,
    feedback: "A construção de uma versão simplificada e interativa do sistema, usada para o cliente validar interface e funcionalidades e esclarecer requisitos ambíguos, é a definição clássica de ==ddl==protótipo==. Diferente de um incremento (que já é uma parte funcional entregue em produção) ou de uma sprint (um ciclo de trabalho do Scrum), o protótipo tem como função principal servir de instrumento de ==dml==validação e refinamento de requisitos== antes do desenvolvimento definitivo."
  },

  // 11 - análise sistema
  {
    aula: "Aula 1 e 2",
    texto: "Uma varejista de médio porte contratou uma consultoria para reformular seu sistema de gestão de estoque após constantes atrasos na reposição de produtos. Os analistas realizaram entrevistas com gerentes de loja, operadores de depósito e compradores para mapear os pontos de falha do processo atual. Ao final, identificaram que o sistema não emitia alertas automáticos quando o estoque de um item caía abaixo do ponto de pedido. Com base nesse levantamento, propuseram um novo sistema com sensores IoT e algoritmos preditivos para automatizar a reposição.",
    question: "A atividade descrita exemplifica, conforme o material de referência:",
    code: ``,
    options: [
      "a fase de Implantação, pois envolve a configuração de sensores no ambiente de produção.",
      "os Testes de Comportamento, que simulam interações reais do usuário com o sistema para verificar sua resposta.",
      "o Planejamento, porque define os recursos tecnológicos (sensores e algoritmos) a serem utilizados.",
      "a Modelagem do Sistema, cujo objetivo é representar visualmente as interações entre módulos por meio de diagramas.",
      "a Análise do Sistema, que consiste em examinar operações de negócio para identificar objetivos e desenvolver processos otimizados que atendam às necessidades reais do cliente."
    ],
    answer: 4,
    feedback: "O trabalho descrito — entrevistar stakeholders, mapear falhas do processo atual e identificar oportunidades de melhoria (como o alerta automático de reposição) — caracteriza a ==ddl==Análise do Sistema==. Essa fase examina as operações de negócio existentes para entender seus objetivos e propor processos otimizados, o que é diferente de simplesmente representar visualmente módulos (Modelagem) ou já configurar tecnologia em produção (Implantação)."
  },

  // 12 - abstração
  {
    aula: "Aula 1 e 2",
    texto: "Durante o desenvolvimento de um sistema de CRM para uma corretora de seguros, a equipe de back-end expôs um serviço de envio de e-mails por meio de uma interface pública. Os desenvolvedores de front-end podiam chamar o método enviarNotificacao(destinatario, mensagem) sem conhecer os detalhes internos da implementação — se utilizava SendGrid, AWS SES ou servidor SMTP próprio. Quando a corretora migrou de provedor de e-mail, nenhuma alteração foi necessária no front-end.",
    question: "Esse cenário exemplifica, no contexto da orientação a objetos abordado no material de referência, o conceito de:",
    code: ``,
    options: [
      "herança, pois a classe de e-mail herda comportamentos do serviço de notificação da empresa.",
      "modularidade, conceito exclusivo de arquitetura de software e distinto dos pilares da orientação a objetos.",
      "abstração, que oculta os detalhes da implementação e permite que o componente seja utilizado sem acesso ao código interno.",
      "encapsulamento, que protege os atributos internos do objeto contra alterações externas diretas por meio de modificadores de acesso.",
      "polimorfismo, porque o mesmo método pode ser chamado com diferentes parâmetros de destinatário."
    ],
    answer: 2,
    feedback: "O fato de o front-end usar apenas a interface enviarNotificacao() sem precisar saber qual provedor de e-mail está por trás (SendGrid, SES ou SMTP) é o exemplo clássico de ==ddl==abstração==: expor apenas o que é essencial para o uso, ocultando os detalhes de implementação. É por isso que a troca de provedor não exigiu mudanças no front-end — a interface pública permaneceu a mesma, mesmo com o comportamento interno mudando completamente."
  },

  // 13 - modelo incremental
  {
    aula: "Aula 1 e 2",
    texto: "Uma empresa de software recebeu a demanda de desenvolver um sistema de gestão empresarial para uma rede de distribuidoras. O cliente sinalizou que deseja visualizar funcionalidades em produção o quanto antes, sem aguardar a entrega do sistema completo. O arquiteto de software propôs dividir o sistema em módulos — contabilidade, recursos humanos e estoque — desenvolvendo e entregando cada um deles de forma sequencial, porém cada módulo passando por todas as fases do ciclo de vida antes da entrega.",
    question: "Essa abordagem está de acordo com:",
    code: ``,
    options: [
      "o Modelo em Cascata, porque prevê a entrega do sistema em etapas sequenciais independentes.",
      "o RAD, já que o prazo de entrega de cada módulo é comprimido para entre 60 e 90 dias obrigatoriamente.",
      "o Modelo Incremental, cujas entregas parciais aumentam progressivamente a funcionalidade do sistema.",
      "a Prototipagem, porque cada módulo entregue funciona como um protótipo para o módulo seguinte.",
      "o Modelo Espiral, pois cada módulo representa uma volta da espiral com análise de riscos dedicada."
    ],
    answer: 2,
    feedback: "A divisão do sistema em módulos independentes (contabilidade, RH, estoque), cada um passando por todo o ciclo de desenvolvimento e sendo entregue progressivamente, é a característica central do ==ddl==Modelo Incremental==. Isso atende diretamente à necessidade do cliente de ver funcionalidades em produção rapidamente, sem depender da conclusão do sistema inteiro — diferente do Cascata (entrega única ao final) ou do Espiral (foco em análise cíclica de riscos)."
  },

  // 14 - metodologias ágeis
  {
    aula: "Aula 1 e 2",
    texto: "Uma startup de tecnologia financeira contratou uma equipe para desenvolver um aplicativo de pagamentos instantâneos. Após as primeiras semanas, os sócios perceberam que as exigências do Banco Central do Brasil mudam com frequência e que o escopo inicial já havia sofrido três revisões. O gerente de projetos, ao apresentar o planejamento, propõe adotar um modelo de ciclo de vida que permite entregas funcionais incrementais a cada três semanas, com reavaliação do backlog ao final de cada ciclo e envolvimento contínuo dos stakeholders.",
    question: "Com base nos materiais de referência da disciplina, o modelo que melhor se enquadra a essa proposta e às necessidades descritas é o",
    code: ``,
    options: [
      "Rapid Application Development (RAD), por priorizar exclusivamente a velocidade de entrega em detrimento da qualidade.",
      "Metodologias Ágeis, dado que promovem ciclos curtos, iterativos e incrementais, com colaboração contínua com o cliente.",
      "Modelo em Cascata, pois exige a definição completa de requisitos antes do início do desenvolvimento.",
      "Modelo Espiral, pois é o único que realiza análise de riscos em cada fase do desenvolvimento.",
      "Modelo Incremental, visto que, por definição, inclui cerimônias como daily meetings e sprint planning."
    ],
    answer: 1,
    feedback: "O cenário descrito — ciclos curtos de três semanas, reavaliação constante do backlog e envolvimento contínuo dos stakeholders diante de requisitos regulatórios instáveis — é característico das ==ddl==Metodologias Ágeis==. Elas foram criadas justamente para lidar com ambientes de alta mudança, ao contrário do Cascata (que exige requisitos fechados) e do Modelo Incremental puro (que não define, por si só, cerimônias como daily meetings e sprint planning, típicas de frameworks ágeis como o Scrum)."
  },

  // 15 - modelagem formal
  {
    aula: "Aula 1 e 2",
    texto: "Uma empresa de softwares embarcados para aviação civil precisa garantir que um componente de monitoramento de altitude obedeça rigorosamente à especificação formal antes de qualquer implementação, pois falhas podem colocar vidas em risco. O arquiteto sênior propõe utilizar uma abordagem de modelagem que emprega lógica matemática para descrever e verificar o comportamento do componente, aumentando a confiança de que o sistema realmente obedece à sua especificação antes da codificação.",
    question: "Segundo o material de referência da disciplina, essa abordagem é classificada como:",
    code: ``,
    options: [
      "Modelagem Formal, que emprega lógica formal para descrever matematicamente o comportamento do sistema, sendo especialmente indicada para componentes críticos.",
      "Modelagem Estruturada, adequada a sistemas embarcados por sua representação de fluxos de dados em tempo real.",
      "Modelagem Baseada em Processos, cuja divisão modular garante o isolamento de falhas em componentes críticos.",
      "Modelagem Orientada a Objetos, pois organiza as funções de voo em objetos com métodos seguros.",
      "Prototipagem, porque permite validar o comportamento do sistema com usuários antes do desenvolvimento final."
    ],
    answer: 0,
    feedback: "O uso de ==key==lógica matemática== para descrever e verificar rigorosamente o comportamento de um sistema antes da implementação é a definição de ==ddl==Modelagem Formal==. Ela é especialmente recomendada para componentes críticos, como sistemas de aviação, exatamente por oferecer um nível de verificação matemática de correção que outras abordagens (como a Modelagem Estruturada ou Orientada a Objetos, mais voltadas à organização e representação visual) não conseguem garantir com o mesmo rigor."
  },

  // 16 - testes desempenho
  {
    aula: "Aula 1 e 2",
    texto: "Uma plataforma de streaming de vídeo vai realizar uma promoção nacional com transmissão ao vivo de um evento esportivo esperando pico de 2 milhões de acessos simultâneos. O time de engenharia precisa decidir qual conjunto de testes executar com maior urgência antes do evento. A analista lembra que, segundo o material da disciplina, há uma modalidade de teste que avalia como o software se comporta sob diversas condições de carga, medindo o tempo de resposta, throughput e utilização de recursos para identificar possíveis gargalos.",
    question: "Considerando esse contexto, a prioridade de teste deve ser:",
    code: ``,
    options: [
      "testes funcionais, verificando se o botão de play e os controles de vídeo operam conforme especificado.",
      "testes de usabilidade, para garantir que a interface seja intuitiva para novos usuários durante o evento.",
      "testes de regressão, assegurando que atualizações recentes não tenham comprometido funcionalidades existentes.",
      "testes de desempenho, que avaliam o comportamento do sistema sob alta carga e identificam gargalos de capacidade antes do pico de acessos.",
      "testes de segurança, pois eventos de grande porte atraem tentativas de ataques como DDoS e SQL injection."
    ],
    answer: 3,
    feedback: "Diante de um pico esperado de 2 milhões de acessos simultâneos, a prioridade urgente são os ==ddl==testes de desempenho==, que medem justamente ==key==tempo de resposta, throughput e utilização de recursos== sob alta carga, permitindo identificar gargalos antes que eles afetem os usuários reais durante o evento. Testes funcionais, de usabilidade, regressão e segurança são igualmente importantes, mas não respondem diretamente ao risco central descrito no cenário: a capacidade do sistema de suportar volume extremo de acesso."
  },

  // 17 - herança polimorfismo
  {
    aula: "Aula 1 e 2",
    texto: "Em uma revisão de código de um sistema de biblioteca, o desenvolvedor júnior percebeu que a classe Livro herdava de MaterialBibliografico, reaproveitando atributos como título, autor e ISBN. A classe Periodico também herdava de MaterialBibliografico, adicionando o atributo de frequência de publicação. Ao tentar chamar o método emitirEtiqueta(), tanto Livro quanto Periodico respondiam de formas distintas.",
    question: "Esses dois mecanismos da orientação a objetos identificados na análise do código são, respectivamente:",
    code: ``,
    options: [
      "abstração e herança, porque MaterialBibliografico generaliza conceitos e as subclasses especializam o comportamento.",
      "herança e polimorfismo, pois Livro e Periodico herdam de uma superclasse comum e o mesmo método apresenta comportamentos distintos conforme o objeto.",
      "modularidade e reutilização de código, conceitos que não pertencem formalmente à orientação a objetos.",
      "polimorfismo e encapsulamento, porque o método é reutilizado e os atributos são ocultados de outras classes.",
      "encapsulamento e abstração, pois os atributos são protegidos e os detalhes de implementação ocultados."
    ],
    answer: 1,
    feedback: "O cenário combina dois pilares clássicos da orientação a objetos: primeiro, ==ddl==herança==, pois Livro e Periodico reaproveitam atributos e comportamentos da superclasse MaterialBibliografico; segundo, ==ddl==polimorfismo==, pois o mesmo método emitirEtiqueta() apresenta comportamentos diferentes dependendo de qual subclasse o está chamando. Essa combinação é o que permite reutilizar código comum e, ao mesmo tempo, especializar comportamentos específicos de cada tipo de material."
  },

  // 18 - RUP scrum
  {
    aula: "Aula 1 e 2",
    texto: "Um comitê de TI de uma instituição financeira debate a adoção de um framework de desenvolvimento para um novo sistema de concessão de crédito corporativo. Dois arquitetos apresentam propostas distintas. O Arquiteto A defende um modelo iterativo e incremental, orientado a casos de uso, dividido em fases de concepção, elaboração, construção e transição, desenvolvido pela Rational Software Corporation e posteriormente adquirido pela IBM. O Arquiteto B propõe um modelo que promove ciclos curtos com sprints de duas semanas e reuniões diárias de alinhamento.",
    question: "Com base no material de referência, as propostas do Arquiteto A e do Arquiteto B correspondem, respectivamente:",
    code: ``,
    options: [
      "Modelo Espiral e Modelo Incremental.",
      "RUP e Metodologias Ágeis (Scrum).",
      "Prototipagem e Metodologias Ágeis.",
      "Modelo Incremental e RAD.",
      "RUP e Modelo em Cascata."
    ],
    answer: 1,
    feedback: "A descrição do Arquiteto A — fases de concepção, elaboração, construção e transição, criado pela Rational Software Corporation e adquirido pela IBM — corresponde exatamente ao ==ddl==RUP (Rational Unified Process)==. Já a proposta do Arquiteto B, com sprints de duas semanas e reuniões diárias de alinhamento (daily meetings), é característica do ==ddl==Scrum==, um dos frameworks das Metodologias Ágeis. Ambos são modelos iterativos, mas com estruturas e cerimônias bem distintas."
  },

  // 19 - modelo espiral
  {
    aula: "Aula 1 e 2",
    texto: "Um analista de sistemas recém-contratado por uma empresa de defesa é orientado a mapear todas as iterações do projeto em quadrantes que envolvem: (I) definição de objetivos e restrições da iteração; (II) avaliação de alternativas e identificação e resolução de riscos; (III) desenvolvimento e verificação do produto da iteração; (IV) planejamento da próxima iteração. O analista reconhece essa estrutura como característica de um modelo específico.",
    question: "Acerca do modelo descrito e do contexto de aplicação apresentado, é correto afirmar que",
    code: ``,
    options: [
      "trata-se do RUP, dividido nas fases de concepção, elaboração, construção e transição, todas com duração fixa de um quadrante.",
      "trata-se do Modelo em Cascata, adaptado para sistemas críticos por meio da adição de revisões de qualidade entre as fases.",
      "trata-se do Modelo Espiral, cuja abordagem cíclica com análise contínua de riscos é especialmente adequada ao contexto de sistemas de defesa.",
      "trata-se do Modelo Incremental, cuja principal vantagem é a entrega de funcionalidades parciais ao cliente ao final de cada módulo.",
      "trata-se do RAD, indicado para o contexto de defesa por reduzir o tempo de entrega de 60 a 90 dias."
    ],
    answer: 2,
    feedback: "A estrutura em quatro quadrantes — definição de objetivos, avaliação de alternativas com foco em riscos, desenvolvimento/verificação e planejamento da próxima iteração — é a assinatura do ==ddl==Modelo Espiral==. Sua ênfase na ==key==análise contínua de riscos== a cada volta da espiral o torna especialmente indicado para contextos de alto risco e criticidade, como sistemas de defesa, diferentemente de modelos como Cascata (sem ciclos de reavaliação) ou RAD (focado em velocidade de entrega)."
  },

  // 20 - tipos testes
  {
    aula: "Aula 1 e 2",
    texto: "Após a conclusão do desenvolvimento de um aplicativo bancário, a equipe de qualidade realizou uma bateria de verificações em que cada funcionalidade — login seguro, transferência de fundos, visualização de extrato — foi testada individualmente e, em seguida, em conjunto. Paralelamente, outra subequipe simulou tentativas de SQL injection e cross-site scripting para identificar vulnerabilidades. Uma terceira frente avaliou o comportamento do sistema com 50.000 usuários simultâneos para verificar gargalos.",
    question: "Esses procedimentos correspondem, respectivamente, aos tipos de testes denominados",
    code: ``,
    options: [
      "testes funcionais, testes de segurança e testes de desempenho.",
      "testes de aceitação, testes de penetração e testes de escalabilidade.",
      "testes de desempenho, testes de comportamento e testes funcionais.",
      "testes de regressão, testes de usabilidade e testes de comportamento.",
      "testes de integração, testes de conformidade e testes de carga."
    ],
    answer: 0,
    feedback: "Cada frente de verificação corresponde a um tipo distinto de teste: testar individualmente e em conjunto as funcionalidades (login, transferência, extrato) caracteriza os ==dml==testes funcionais==; simular SQL injection e cross-site scripting corresponde aos ==dml==testes de segurança==, que buscam identificar vulnerabilidades; e avaliar o sistema sob 50.000 usuários simultâneos é próprio dos ==dml==testes de desempenho==, focados em identificar gargalos de capacidade."
  },

  // 21 - modelo cascata
  {
    aula: "Atividade 2 - Aula 3, 4 e 5",
    texto: "Durante a auditoria de um projeto falho de um sistema governamental, constatou-se que o desenvolvimento adotou o Modelo Cascata. No nono mês do projeto, na fase de implementação, o governo alterou a legislação tributária que fundamentava os cálculos do sistema. A equipe não conseguiu absorver a mudança sem descartar 70% do trabalho já realizado, estourando o prazo e o orçamento.",
    question: "Analisando a falha à luz dos modelos de ciclo de vida, o desastre no projeto deve-se ao fato de que o Modelo Cascata",
    code: ``,
    options: [
      "apresenta baixa adaptabilidade a mudanças tardias, pois exige reestruturação significativa das etapas anteriores já concluídas.",
      "encoraja o excesso de comunicação com o cliente, gerando mudanças de escopo que inviabilizam o cronograma.",
      "promove entregas frequentes, fazendo com que a alteração da lei afetasse versões que já estavam em produção no governo.",
      "impede a produção de documentação detalhada, dificultando a revisão do código tributário."
    ],
    answer: 0,
    feedback: "O desastre ocorreu porque o ==danger==Modelo Cascata tem baixa adaptabilidade a mudanças tardias==: como cada fase depende da conclusão da anterior e os requisitos são congelados no início, uma mudança na fase de implementação (como a nova legislação tributária) exige retrabalho significativo em etapas já finalizadas — no caso, o descarte de 70% do trabalho. As demais opções não fazem sentido no contexto: o Cascata não incentiva comunicação contínua com o cliente, não promove entregas frequentes (é uma entrega única ao final) e não impede documentação detalhada — pelo contrário, costuma exigi-la fortemente."
  },

  // 22 - requisito funcional
  {
    aula: "Atividade 2 - Aula 3, 4 e 5",
    texto: "No desenvolvimento de sistemas, os requisitos são tradicionalmente divididos em funcionais e não funcionais. Compreender a diferença entre essas categorias é o primeiro passo da Engenharia de Requisitos para garantir que as expectativas de uso e as restrições arquiteturais sejam devidamente documentadas.\n\nPAULA, P. S.; SARMENTO, W. W. F. Análise de Requisitos. Quixadá: UniCatólica, 2024.",
    question: "Ao levantar as necessidades para um aplicativo de compras, um exemplo clássico de requisito funcional é a",
    code: ``,
    options: [
      "capacidade de o usuário aplicar filtros por categoria e preço durante a busca de um produto.",
      "implementação de criptografia avançada e protocolos rigorosos para impedir invasões cibernéticas.",
      "obrigatoriedade de que o banco de dados responda a uma consulta em menos de dois segundos.",
      "garantia de que o sistema esteja disponível e operacional em 99,9% do tempo."
    ],
    answer: 0,
    feedback: "A capacidade de o usuário filtrar produtos por categoria e preço é um ==ddl==requisito funcional==, pois descreve diretamente uma ==dml==ação ou funcionalidade== que o sistema deve executar para o usuário. Já as demais opções — criptografia, tempo de resposta do banco e disponibilidade de 99,9% — são ==key==requisitos não funcionais==, pois tratam de qualidades e restrições do sistema (segurança, desempenho, confiabilidade), e não de funcionalidades diretas visíveis ao usuário."
  },

  // 23 - critério aceitação
  {
    aula: "Atividade 2 - Aula 3, 4 e 5",
    texto: "As \"Histórias de Usuário\" (User Stories) são recursos vitais para aproximar a equipe técnica dos clientes. Elas descrevem, em linguagem natural, as intenções do usuário. Contudo, para que a equipe saiba que o requisito foi completamente implementado, as histórias precisam vir acompanhadas dos chamados \"Critérios de Aceitação\".\n\nPAULA, P. S.; SARMENTO, W. W. F. Análise de Requisitos. Quixadá: UniCatólica, 2024.",
    question: "Ao analisar a qualidade de um critério de aceitação escrito para uma funcionalidade de \"Recuperação de Senha\", deve-se buscar que ele seja",
    code: ``,
    options: [
      "mensurável e objetivo, definindo de forma clara uma condição de teste (ex: \"o sistema deve enviar um link válido de recuperação em até 1 minuto\").",
      "mutável, permitindo que os validadores alterem a regra do teste durante a homologação do sistema.",
      "ambíguo, deixando a cargo do desenvolvedor a interpretação da melhor tecnologia de e-mail a utilizar.",
      "extenso e pautado apenas na visão do banco de dados, excluindo as percepções de interface do usuário final."
    ],
    answer: 0,
    feedback: "Um bom ==ddl==critério de aceitação== precisa ser ==key==mensurável e objetivo==, estabelecendo uma condição de teste clara e verificável, como no exemplo do link de recuperação em até 1 minuto. Isso permite que a equipe saiba exatamente quando o requisito foi cumprido. Critérios ambíguos, mutáveis durante a homologação ou restritos apenas à visão técnica do banco de dados vão contra o propósito do critério de aceitação, que é eliminar dúvidas sobre o que significa \"pronto\" para aquela funcionalidade."
  },

  // 24 - modelo incremental
  {
    aula: "Atividade 2 - Aula 3, 4 e 5",
    texto: "Uma empresa de desenvolvimento foi contratada para construir um sistema de saúde focado em prontuários eletrônicos. O cliente deseja começar utilizando imediatamente o módulo de cadastro de pacientes, enquanto os módulos de exames e faturamento podem ser adicionados ao longo dos próximos meses, dependendo de novas regulamentações que ainda serão aprovadas pelo governo.",
    question: "Diante desse cenário de incerteza regulatória e necessidade de uso imediato de funcionalidades básicas, a abordagem metodológica mais adequada e sua respectiva justificativa são o",
    code: ``,
    options: [
      "modelo em espiral, pois ele foca exclusivamente na entrega do produto final completo após a análise de riscos.",
      "modelo cascata, pois garante a estabilidade de todo o sistema antes de ser liberado para o hospital.",
      "modelo incremental, pois permite a entrega gradual do módulo de cadastro e adaptação posterior aos novos requisitos de faturamento.",
      "modelo iterativo, pois ele dispensa a fase de testes em módulos não concluídos, reduzindo os custos."
    ],
    answer: 2,
    feedback: "O cenário combina duas necessidades típicas do ==ddl==Modelo Incremental==: uso imediato de uma funcionalidade essencial (cadastro de pacientes) e flexibilidade para incorporar módulos futuros (exames, faturamento) conforme regulamentações ainda incertas forem definidas. Isso permite entregar valor rapidamente sem esperar o sistema completo, e cada novo módulo pode ser adaptado às regras vigentes no momento de seu desenvolvimento — o que não seria possível no Cascata, que exige o sistema pronto e estável apenas ao final."
  },

  // 25 - requisito não funcional
  {
    aula: "Atividade 2 - Aula 3, 4 e 5",
    texto: "O Tribunal de Justiça contratou uma empresa de software para desenvolver um sistema de processos digitais. Durante o levantamento, o diretor do fórum exigiu que \"o sistema deve ser capaz de processar até 5 mil acessos simultâneos de advogados durante o horário comercial sem travamentos\".",
    question: "Aplicando a teoria de engenharia de requisitos, a solicitação do diretor classifica-se como um requisito não funcional voltado especificamente para a",
    code: ``,
    options: [
      "usabilidade, pois garante que os advogados terão telas fáceis e intuitivas de operar.",
      "escalabilidade e desempenho, garantindo a suportabilidade e o tempo de resposta em condições de alta carga.",
      "auditabilidade, pois trata da capacidade de registrar as ações de todos os advogados.",
      "portabilidade, pois obriga o sistema a rodar em diferentes modelos de navegadores e celulares."
    ],
    answer: 1,
    feedback: "A exigência de suportar 5 mil acessos simultâneos sem travamentos é um requisito não funcional de ==ddl==escalabilidade e desempenho==, pois trata da capacidade do sistema de manter sua operação e tempo de resposta adequados sob ==key==alta carga de usuários==. Não se trata de usabilidade (facilidade de uso da interface), auditabilidade (registro de ações) ou portabilidade (compatibilidade entre plataformas), que são outras categorias de requisitos não funcionais com focos distintos."
  },

  // 26 - MVP
  {
    aula: "Atividade 2 - Aula 3, 4 e 5",
    texto: "O termo Minimum Viable Product (MVP), ou Produto Mínimo Viável, refere-se à versão mais enxuta e funcional de um produto, desenvolvida com o menor esforço necessário para testar uma ideia de negócio. Identificar o MVP exige um apurado processo de análise e priorização de requisitos, separando o que é crucial do que é secundário.\n\nPAULA, P. S.; SARMENTO, W. W. F. Análise de Requisitos. Quixadá: UniCatólica, 2024.",
    question: "Avaliando a estratégia de construção de um MVP para um novo aplicativo de viagens, a decisão correta sobre a priorização de requisitos consiste em",
    code: ``,
    options: [
      "eleger o subconjunto de requisitos funcionais estritamente necessários para permitir o fluxo principal (pesquisa e reserva), validando o modelo de negócio rapidamente.",
      "implementar todas as funcionalidades de gamificação e pontuação antes de garantir a funcionalidade central de reserva da passagem.",
      "desenvolver um sistema complexo desde o início, cobrindo todos os requisitos possíveis para não frustrar usuários exigentes logo de cara.",
      "garantir a entrega de uma versão com defeitos de segurança, visando apenas demonstrar a interface para investidores rapidamente."
    ],
    answer: 0,
    feedback: "A essência do ==ddl==MVP== é priorizar apenas o ==key==subconjunto mínimo de requisitos== necessário para viabilizar o fluxo principal do negócio — no caso, pesquisar e reservar uma viagem — permitindo validar rapidamente se a ideia funciona no mercado. Investir em funcionalidades secundárias (como gamificação) antes do essencial, tentar cobrir todos os requisitos possíveis de uma vez, ou negligenciar a segurança para acelerar uma demonstração, contraria justamente o propósito de enxugar esforço e validar hipóteses rapidamente."
  },

  // 27 - XP vs Scrum
  {
    aula: "Atividade 2 - Aula 3, 4 e 5",
    texto: "O Extreme Programming (XP) e o Scrum são duas abordagens ágeis populares, porém com focos levemente distintos. Enquanto o Scrum assume uma visão mais gerencial e organizacional, estruturando o fluxo de trabalho em Sprints e papéis, o XP mergulha nas práticas técnicas rigorosas de engenharia de software para garantir a robustez do produto.\n\nPAULA, P. S.; SARMENTO, W. W. F. Métodos Ágeis. Quixadá: UniCatólica, 2024.",
    question: "Na análise comparativa entre as duas abordagens, uma prática intrínseca que diferencia o XP por seu foco puramente técnico na qualidade do código é",
    code: ``,
    options: [
      "a definição de um papel centralizador para o gerenciamento de portfólio de projetos da empresa.",
      "a realização de cerimônias de Sprint Retrospective focadas no sentimento da equipe de gestão.",
      "a utilização exclusiva de quadros Kanban visuais para ditar o ritmo puxado das tarefas.",
      "o desenvolvimento baseado em Programação em Pares (Pair Programming) e a refatoração contínua."
    ],
    answer: 3,
    feedback: "O ==ddl==Extreme Programming (XP)== se diferencia justamente por suas ==key==práticas técnicas rigorosas==, como a ==dml==Programação em Pares (Pair Programming)== e a ==dml==refatoração contínua==, voltadas a garantir a qualidade e robustez do código. Já a Sprint Retrospective e o gerenciamento de portfólio são características mais associadas à dimensão gerencial do Scrum, e o Kanban, embora visual, não é exclusivo do XP nem representa seu foco técnico central."
  },

  // 28 - elicitação requisitos
  {
    aula: "Atividade 2 - Aula 3, 4 e 5",
    texto: "A elicitação é a arte de descobrir, ouvir e entender os requisitos de todas as partes interessadas no projeto. Essa etapa ocorre nas fases iniciais do ciclo de vida, mas nos métodos modernos é vista como um esforço contínuo. Técnicas bem aplicadas evitam que o software seja construído com base em suposições incorretas.\n\nPAULA, P. S.; SARMENTO, W. W. F. Análise de Requisitos. Quixadá: UniCatólica, 2024.",
    question: "Para a elicitação e levantamento de requisitos de um sistema complexo onde os clientes estão espalhados geograficamente, uma técnica adequada para coletar informações estruturadas de um grande número de stakeholders de forma rápida é o uso de",
    code: ``,
    options: [
      "observação participante no ambiente físico de trabalho.",
      "diagramas complexos de classes de banco de dados.",
      "sessões diárias intensas de programação em pares.",
      "questionários eletrônicos bem estruturados."
    ],
    answer: 3,
    feedback: "Quando os stakeholders estão geograficamente dispersos e é preciso coletar informações de forma ==key==rápida e estruturada de um grande número de pessoas==, os ==dml==questionários eletrônicos== são a técnica de elicitação mais adequada, pois dispensam presença física e permitem respostas padronizadas em escala. A observação participante exige presença no local, os diagramas de classes pertencem à modelagem (não à elicitação) e a programação em pares é uma prática de desenvolvimento, não de levantamento de requisitos."
  },

  // 29 - escopo variável
  {
    aula: "Atividade 2 - Aula 3, 4 e 5",
    texto: "Projetos de software frequentemente sofrem conflitos entre fornecedores e clientes no tocante ao escopo. Métodos tradicionais tentam blindar o escopo fixando requisitos no início, enquanto métodos ágeis advogam pelo \"Escopo Variável\", defendendo que o software não é um produto fabricado de forma idêntica e previsível, mas sim um reflexo de regras de negócio em mutação.\n\nPAULA, P. S.; SARMENTO, W. W. F. Métodos Ágeis. Quixadá: UniCatólica, 2024.",
    question: "Avaliando as implicações contratuais e produtivas da adoção do escopo variável em um ambiente ágil, é correto afirmar que essa prática",
    code: ``,
    options: [
      "enfraquece o comprometimento da equipe, pois a ausência de requisitos fixos elimina a necessidade de qualquer planejamento inicial.",
      "garante maior alinhamento do produto com as necessidades reais do mercado, permitindo que a equipe priorize funcionalidades de maior valor ao longo do desenvolvimento.",
      "torna obrigatório o uso do Modelo Cascata para fins de formalização jurídica antes de cada nova entrega.",
      "reduz a participação do cliente, visto que o time ganha total autonomia para alterar as regras de negócio sem consultar os stakeholders."
    ],
    answer: 1,
    feedback: "O ==ddl==Escopo Variável== permite que o produto se ajuste continuamente às ==key==necessidades reais do mercado==, já que a equipe pode repriorizar funcionalidades de maior valor ao longo do desenvolvimento, em vez de ficar presa a um escopo definido rigidamente no início. Isso não elimina o planejamento (apenas o torna contínuo e adaptativo), não exige o Modelo Cascata (que é justamente o oposto dessa filosofia) e não reduz a participação do cliente — pelo contrário, o escopo variável depende de colaboração constante com os stakeholders para decidir o que priorizar."
  },

  // 30 - papel Scrum
  {
    aula: "Atividade 2 - Aula 3, 4 e 5",
    texto: "O framework Scrum estabelece papéis claros para otimizar o fluxo de trabalho e garantir o alinhamento entre as expectativas de negócio e a entrega técnica. Um desses papéis atua como a \"voz do cliente\", sendo responsável por maximizar o valor do produto e gerenciar ativamente a lista de funcionalidades desejadas.\n\nPAULA, P. S.; SARMENTO, W. W. F. Métodos Ágeis. Quixadá: UniCatólica, 2024.",
    question: "Dentro da metodologia Scrum, a descrição apresentada refere-se ao papel do",
    code: ``,
    options: [
      "Desenvolvedor Líder, que escolhe quais tarefas técnicas são prioritárias para a estabilidade da arquitetura.",
      "Stakeholder, que dita o ritmo de trabalho diário da equipe técnica durante as sprints.",
      "Scrum Master, que remove os impedimentos e garante que os princípios ágeis sejam respeitados.",
      "Product Owner, que define a visão do produto e prioriza os itens do backlog para desenvolvimento."
    ],
    answer: 3,
    feedback: "A descrição de atuar como \"voz do cliente\", maximizando o valor do produto e gerenciando a lista de funcionalidades, corresponde exatamente ao papel do ==ddl==Product Owner==, responsável por definir a ==key==visão do produto== e ==dml==priorizar o backlog==. É importante não confundi-lo com o Scrum Master, cujo foco é remover impedimentos e zelar pelos princípios ágeis do processo, não pela priorização de funcionalidades de negócio."
  },

  // 31 - modelo incremental
  {
    aula: "Atividade 2 - Aula 3, 4 e 5",
    texto: "Considere um cenário de transição tecnológica em que uma startup de logística precisa substituir seu sistema legado monolítico. A diretoria exige que a migração não interrompa a operação diária e que o risco de falha global do sistema seja minimizado. O arquiteto de software sugere o uso de um modelo de desenvolvimento incremental para construir e substituir a plataforma gradativamente.",
    question: "Avaliando a recomendação do arquiteto, constata-se que a adoção do modelo incremental para minimizar os riscos de implantação é",
    code: ``,
    options: [
      "adequada, pois o modelo incremental garante a imutabilidade do código do sistema legado durante a transição.",
      "inadequada, pois o modelo incremental concentra todo o risco na etapa final de integração do sistema.",
      "adequada, pois a divisão em incrementos menores facilita a identificação e resolução precoce de problemas antes da adoção global.",
      "inadequada, pois a necessidade de documentação exaustiva a cada incremento atrasará a substituição do sistema legado de forma inaceitável."
    ],
    answer: 2,
    feedback: "A recomendação é adequada porque, ao dividir a substituição do sistema legado em ==key==incrementos menores==, a equipe consegue identificar e resolver problemas de forma ==dml==precoce e localizada==, em vez de arriscar tudo em uma grande virada única — o que reduz justamente o risco de falha global exigido pela diretoria. A opção que fala em \"imutabilidade do código legado\" não faz sentido, pois o próprio objetivo é substituí-lo; e a ideia de que o risco se concentraria na integração final é característica mais associada ao Cascata do que ao Incremental."
  },

  // 32 - burndown chart
  {
    aula: "Atividade 2 - Aula 3, 4 e 5",
    texto: "Durante a execução de uma Sprint de duas semanas utilizando o Scrum, a equipe de desenvolvimento adota o \"Burndown Chart\" (gráfico de burndown) para acompanhar o seu progresso diário. No oitavo dia da Sprint, o Scrum Master nota que a \"Linha de Trabalho Restante Real\" está se mantendo consistentemente acima da \"Linha de Trabalho Restante Ideal\".",
    question: "Considerando a utilidade dessa ferramenta no contexto ágil, a interpretação desse gráfico indica que a equipe",
    code: ``,
    options: [
      "concluiu perfeitamente todas as histórias de usuário estimadas, e a linha acima indica uma margem de segurança.",
      "está entregando as tarefas mais rapidamente do que o planejado, podendo adicionar novos itens ao Sprint Backlog.",
      "enfrenta dificuldades ou atrasos, evidenciando que o trabalho restante não está sendo concluído no ritmo necessário para fechar a Sprint.",
      "deve interromper imediatamente a Sprint e iniciar a fase de testes unitários exigidos pelo Extreme Programming (XP)."
    ],
    answer: 2,
    feedback: "Quando a ==key==linha real de trabalho restante== permanece consistentemente acima da ==key==linha ideal== no ==ddl==Burndown Chart==, isso indica que a equipe está enfrentando ==danger==dificuldades ou atrasos==, pois o ritmo de conclusão das tarefas está abaixo do necessário para zerar o trabalho restante até o fim da Sprint. Não se trata de margem de segurança nem de adiantamento — o gráfico é justamente um sinal de alerta para o Scrum Master investigar impedimentos, e não motivo para interromper a Sprint ou iniciar fases não relacionadas a essa ferramenta."
  },

  // 33 - modelo incremental
  {
    aula: "Atividade 2 - Aula 3, 4 e 5",
    texto: "Os Modelos Incrementais de desenvolvimento de software representam uma síntese entre a estruturação dos modelos tradicionais e a flexibilidade dos iterativos. Nessa abordagem, o sistema é dividido em incrementos funcionais, e cada um deles passa por todo o ciclo de desenvolvimento (análise, design, implementação e testes).\n\nPAULA, P. S.; SARMENTO, W. W. F. Modelos Cascata e Incremental. Quixadá: UniCatólica, 2024.",
    question: "Um gerente de projetos decide adotar o modelo incremental para o desenvolvimento de um novo sistema bancário. Do ponto de vista da gestão do projeto, essa escolha traz como vantagem a",
    code: ``,
    options: [
      "diminuição da necessidade de comunicação com o cliente, já que cada incremento é desenvolvido isoladamente pela equipe técnica.",
      "entrega rápida de partes funcionais do sistema, permitindo validação e feedback antecipado por parte dos usuários finais.",
      "garantia de que todos os requisitos do projeto final sejam mapeados e congelados desde a primeira etapa de especificação.",
      "eliminação da necessidade de integração contínua de código, pois os módulos são independentes."
    ],
    answer: 1,
    feedback: "A principal vantagem de gestão trazida pelo modelo incremental é a ==key==entrega rápida de partes funcionais== do sistema, o que permite ==dml==validação e feedback antecipado== dos usuários finais ao longo do projeto, em vez de esperar até o final para saber se o produto atende às expectativas. Isso é o oposto de diminuir a comunicação com o cliente (que na verdade se intensifica a cada entrega) e não implica congelamento total de requisitos desde o início, característica do Cascata."
  },

  // 34 - manifesto ágil
  {
    aula: "Atividade 2 - Aula 3, 4 e 5",
    texto: "O Manifesto Ágil, criado em 2001 por um grupo de desenvolvedores experientes, estabeleceu quatro valores fundamentais e doze princípios que orientam as práticas ágeis. Essa filosofia mudou a forma como as equipes de engenharia de software encaram a construção de produtos digitais, em contraponto aos métodos tradicionais pesados.\n\nPAULA, P. S.; SARMENTO, W. W. F. Métodos Ágeis. Quixadá: UniCatólica, 2024.",
    question: "De acordo com os valores fundamentais expressos no Manifesto Ágil, as equipes devem valorizar",
    code: ``,
    options: [
      "documentação abrangente de todos os requisitos mais do que a entrega de software em funcionamento.",
      "a resposta a mudanças nas necessidades do negócio mais do que o seguimento rigoroso de um plano inicial.",
      "processos rígidos e ferramentas automatizadas mais do que indivíduos e interações.",
      "negociação formal de contratos de escopo fechado mais do que a colaboração com o cliente."
    ],
    answer: 1,
    feedback: "Um dos quatro valores centrais do ==ddl==Manifesto Ágil== é priorizar a ==key==resposta a mudanças== mais do que o ==term==seguimento rigoroso de um plano==. As demais opções invertem exatamente os valores do manifesto: ele prioriza software em funcionamento sobre documentação abrangente, indivíduos e interações sobre processos e ferramentas, e colaboração com o cliente sobre negociação contratual fechada — sendo, portanto, o contrário do que essas alternativas afirmam."
  },

  // 35 - modelo cascata
  {
    aula: "Atividade 2 - Aula 3, 4 e 5",
    texto: "O Modelo Cascata, também conhecido como Modelo Linear Sequencial, figura entre os modelos de desenvolvimento de software mais tradicionais e amplamente utilizados. Sua estrutura sequencial rígida o torna adequado para determinados tipos de projetos, nos quais as fases do processo devem ser concluídas antes que a próxima possa iniciar.\n\nPAULA, P. S.; SARMENTO, W. W. F. Modelos Cascata e Incremental. Quixadá: UniCatólica, 2024.",
    question: "Considerando as características de planejamento e execução do Modelo Cascata, conclui-se que ele é ideal para projetos que apresentam",
    code: ``,
    options: [
      "requisitos em constante evolução durante todas as fases do desenvolvimento, permitindo adaptações diárias.",
      "alto nível de incerteza e necessidade de envolvimento contínuo do cliente na programação das funcionalidades.",
      "necessidades de entregas parciais e graduais de funcionalidades ao cliente para obter feedback rápido.",
      "requisitos bem definidos e estáveis, desenvolvidos em um ambiente controlado e com escopo pouco suscetível a alterações."
    ],
    answer: 3,
    feedback: "O ==ddl==Modelo Cascata== é ideal para projetos com ==key==requisitos bem definidos e estáveis==, pois sua estrutura sequencial rígida exige que cada fase seja concluída antes de iniciar a próxima, sem espaço natural para revisões constantes. Por isso, ele não se adapta bem a cenários de requisitos em constante evolução, alta incerteza com envolvimento contínuo do cliente, ou necessidade de entregas parciais e graduais — situações mais adequadas a modelos incrementais ou ágeis."
  },

  
],

};