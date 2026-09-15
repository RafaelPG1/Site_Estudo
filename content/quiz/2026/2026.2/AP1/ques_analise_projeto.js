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
    aula: "Aula 2 — Ciclo de Vida do Software",
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
    aula: "Aula 2 — Ciclo de Vida do Software",
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
    aula: "Aula 2 — Ciclo de Vida do Software",
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
    aula: "Aula 2 — Ciclo de Vida do Software",
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
    aula: "Aula 2 — Ciclo de Vida do Software",
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
    aula: "Aula 2 — Ciclo de Vida do Software",
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
    aula: "Aula 2 — Ciclo de Vida do Software",
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
    aula: "Aula 2 — Ciclo de Vida do Software",
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
    aula: "Aula 2 — Ciclo de Vida do Software",
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
    aula: "Aula 2 — Ciclo de Vida do Software",
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


  enade: [],


  fixacao: [],

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