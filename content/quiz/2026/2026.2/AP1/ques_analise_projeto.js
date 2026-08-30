// ============================================================
// NEXUS STUDY — quiz/conteudo/2026.2/AP1/ques_analise_projeto.js
// ============================================================
window.questoes = {

  // Questões de Banco de dados 
  questoes: [],


  enade: [],


  fixacao: [],

  ava: [
    // aula: Aula 1 e 2
  // 1 - análise requisitos
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "Análise de Requisitos, cuja essência é coletar, analisar e documentar as necessidades dos usuários e funcionalidades esperadas do software."
  },

  // 2 - implantação sistema
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "Implantação, que consiste exatamente na preparação do ambiente de produção, configuração de infraestrutura e migração de dados para disponibilizar o sistema aos usuários finais."
  },

  // 3 - testes regressão
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "Testes de regressão, cuja finalidade é garantir que novas funcionalidades ou alterações no código não introduzam defeitos em partes do sistema que já estavam funcionando corretamente."
  },

  // 4 - modelos ciclo vida
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "P1 → Cascata; P2 → Ágil; P3 → Prototipagem; P4 → RUP."
  },

  // 5 - modelo cascata
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "corresponde ao Modelo em Cascata e é tecnicamente adequada para o contexto apresentado, dado que os requisitos são estáveis."
  },

  // 6 - casos uso classes
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "São instrumentos complementares: os diagramas de caso de uso pertencem à análise (o que o sistema faz) e os diagramas de classes pertencem à modelagem orientada a objetos (como o sistema é estruturado), ambos fazendo parte do processo de desenvolvimento."
  },

  // 7 - modelagem OO
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "trata-se da Modelagem Orientada a Objetos, que organiza dados e processos em objetos com atributos e métodos, facilitando a compreensão das relações e interações do sistema."
  },

  // 8 - fase design UML
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "a equipe está na fase de Design, transformando requisitos em uma arquitetura detalhada por meio da linguagem UML."
  },

  // 9 - manutenção bug
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "A falha no cálculo configura correção de bug e os novos módulos configuram atualizações, ambas pertencentes à fase de Manutenção."
  },

  // 10 - protótipo
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "protótipo, cuja função principal é capturar e refinar os requisitos do cliente por meio de uma versão inicial do software."
  },

  // 11 - análise sistema
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "a Análise do Sistema, que consiste em examinar operações de negócio para identificar objetivos e desenvolver processos otimizados que atendam às necessidades reais do cliente."
  },

  // 12 - abstração
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "abstração, que oculta os detalhes da implementação e permite que o componente seja utilizado sem acesso ao código interno."
  },

  // 13 - modelo incremental
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "o Modelo Incremental, cujas entregas parciais aumentam progressivamente a funcionalidade do sistema."
  },

  // 14 - metodologias ágeis
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "Metodologias Ágeis, dado que promovem ciclos curtos, iterativos e incrementais, com colaboração contínua com o cliente."
  },

  // 15 - modelagem formal
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "Modelagem Formal, que emprega lógica formal para descrever matematicamente o comportamento do sistema, sendo especialmente indicada para componentes críticos."
  },

  // 16 - testes desempenho
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "testes de desempenho, que avaliam o comportamento do sistema sob alta carga e identificam gargalos de capacidade antes do pico de acessos."
  },

  // 17 - herança polimorfismo
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "herança e polimorfismo, pois Livro e Periodico herdam de uma superclasse comum e o mesmo método apresenta comportamentos distintos conforme o objeto."
  },

  // 18 - RUP scrum
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "RUP e Metodologias Ágeis (Scrum)."
  },

  // 19 - modelo espiral
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "trata-se do Modelo Espiral, cuja abordagem cíclica com análise contínua de riscos é especialmente adequada ao contexto de sistemas de defesa."
  },

  // 20 - tipos testes
  {
    aula: "Aula 1 e 2",
    tipo: "Aplicação",
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
    feedback: "testes funcionais, testes de segurança e testes de desempenho."
  },

  
],


};