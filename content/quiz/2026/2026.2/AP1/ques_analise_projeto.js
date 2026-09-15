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
  }
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