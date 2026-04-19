// ============================================================
// NEXUS STUDY — quiz/conteudo/2026/2026.2/design.js
// ============================================================
window.questoes = {

  // ── Questões Práticas ──────────────────────────────────────
  questoes: [

  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Explicativa",
    texto: "O ==def==ciclo de vida de software== define as etapas pelas quais um sistema passa, desde o planejamento inicial até a manutenção. Ele orienta como o trabalho será organizado, quem participa em cada fase e como os resultados são validados. Existem modelos voltados ao produto (mais tradicionais) e modelos voltados ao usuário (mais modernos), cada um com suas prioridades e características.",
    question: "Qual é a função principal do ciclo de vida de software?",
    options: [
      "Definir a linguagem de programação a ser utilizada no projeto",
      "Estabelecer as etapas de desenvolvimento, do planejamento à manutenção",
      "Determinar o número de desenvolvedores necessários para o projeto",
      "Garantir que o sistema seja entregue sem necessidade de testes"
    ],
    answer: 1,
    feedback: "O ==def==ciclo de vida== organiza o desenvolvimento em etapas, guiando desde o planejamento até a entrega e manutenção do sistema."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Explicativa",
    texto: "O ==def==Modelo Cascata== é um dos mais antigos modelos de desenvolvimento. Nele, as etapas seguem uma ordem rígida e linear: requisitos → projeto → implementação → testes → manutenção. Cada fase só começa quando a anterior é concluída. Isso traz organização, mas também um grande problema: se um erro for descoberto na fase de testes, corrigir exige voltar ao início, o que é muito custoso.",
    question: "Por que o Modelo Cascata é considerado pouco flexível?",
    options: [
      "Porque exige que todos os desenvolvedores trabalhem simultaneamente",
      "Porque não permite documentação durante o desenvolvimento",
      "Porque suas fases são sequenciais e não preveem revisão formal das etapas anteriores",
      "Porque elimina a fase de testes para acelerar a entrega"
    ],
    answer: 2,
    feedback: "A rigidez sequencial do ==def==Modelo Cascata== impede revisões formais entre fases, tornando difícil incorporar mudanças após o início do desenvolvimento."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Contextualizada",
    texto: "O ==def==Modelo Espiral== surgiu para resolver um dos maiores problemas do desenvolvimento: o risco. Em vez de seguir uma linha reta, ele funciona em ciclos — a cada volta do espiral, a equipe planeja, analisa riscos, desenvolve e avalia com o cliente. Além disso, usa ==proc==protótipos== para validar ideias antes de avançar, o que reduz surpresas no final do projeto.",
    question: "O que diferencia o Modelo Espiral dos demais modelos tradicionais?",
    options: [
      "Ele elimina a fase de planejamento para agilizar as entregas",
      "Ele incorpora análise de riscos em cada ciclo e utiliza protótipos como ferramenta de validação",
      "Ele é baseado exclusivamente em documentação detalhada antes do desenvolvimento",
      "Ele exige que o cliente defina todos os requisitos antes do primeiro ciclo"
    ],
    answer: 1,
    feedback: "O ==def==Modelo Espiral== se destaca pela ==rule==análise de riscos== em cada ciclo e pelo uso de ==proc==protótipos== para validação progressiva."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Contextualizada",
    texto: "O ==def==Modelo Iterativo== propõe que o software seja desenvolvido em repetições chamadas iterações. A cada ciclo, uma parte do sistema é construída, testada e ajustada com base no feedback recebido. Isso permite que erros sejam corrigidos cedo, que o produto evolua conforme as necessidades mudam e que o usuário participe ativamente ao longo do desenvolvimento — algo que o Cascata não oferece.",
    question: "Qual é a principal vantagem do Modelo Iterativo em relação ao Modelo Cascata?",
    options: [
      "Entrega o sistema completo mais rapidamente, sem fases intermediárias",
      "Permite correção contínua de erros e adaptação a mudanças ao longo do desenvolvimento",
      "Elimina a necessidade de envolvimento do usuário durante o projeto",
      "Garante que os requisitos nunca precisem ser revisados após a primeira iteração"
    ],
    answer: 1,
    feedback: "O ==def==Modelo Iterativo== permite ==proc==adaptação contínua== e participação do usuário em cada ciclo, reduzindo o acúmulo de erros."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Contextualizada",
    texto: "O ==def==Modelo Estrela== representa uma virada no design de software: ao invés de um ponto de partida fixo, o desenvolvimento pode começar por qualquer etapa. O elemento central e obrigatório é a ==rule==avaliação==, que ocorre entre todas as atividades. Isso significa que o projeto pode iniciar pelos requisitos, pela prototipagem, ou mesmo pela implementação — a avaliação sempre conecta tudo.",
    question: "O que torna o Modelo Estrela único em relação aos outros modelos de ciclo de vida?",
    options: [
      "Ele exige que a implementação ocorra sempre antes da prototipagem",
      "Ele posiciona a avaliação como atividade central e permite iniciar por qualquer etapa",
      "Ele substitui todas as fases por uma única etapa de análise de requisitos",
      "Ele é voltado exclusivamente para sistemas de grande porte"
    ],
    answer: 1,
    feedback: "No ==def==Modelo Estrela==, a ==rule==avaliação== é o centro do processo e qualquer etapa pode ser o ponto de partida, conferindo grande flexibilidade."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Explicativa",
    texto: "O ==def==Modelo de Shneiderman== é um modelo centrado no usuário que organiza o desenvolvimento em três pilares principais: ==proc==especificação== (definir o que o sistema deve fazer), ==proc==prototipagem== (criar versões preliminares da interface) e ==proc==testes de usabilidade== (verificar se o sistema é fácil e eficiente de usar). Essa estrutura garante que a experiência do usuário esteja no centro de cada decisão.",
    question: "Quais são os três pilares que estruturam o Modelo de Shneiderman?",
    options: [
      "Planejamento, desenvolvimento e entrega",
      "Requisitos, implementação e documentação",
      "Especificação, prototipagem e testes de usabilidade",
      "Análise de riscos, iteração e avaliação"
    ],
    answer: 2,
    feedback: "O ==def==Modelo de Shneiderman== se apoia em ==proc==especificação==, ==proc==prototipagem== e ==proc==testes de usabilidade== para garantir qualidade centrada no usuário."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Contextualizada",
    texto: "O ==def==Manifesto Ágil== surgiu como uma resposta às metodologias tradicionais de desenvolvimento, que priorizavam processos e documentação em detrimento das pessoas e da entrega de valor. Seus quatro valores centrais são: pessoas acima de processos, software funcional acima de documentação extensa, colaboração do cliente acima de contratos fechados e adaptação a mudanças acima de seguir um plano rígido.",
    question: "Qual dos valores abaixo representa corretamente uma das prioridades do Manifesto Ágil?",
    options: [
      "Documentação completa deve ser entregue antes do software funcional",
      "Contratos fechados garantem o sucesso do projeto e devem ser seguidos à risca",
      "Colaboração do cliente e resposta a mudanças são mais importantes que planos fixos",
      "Processos e ferramentas devem ser priorizados em relação às pessoas"
    ],
    answer: 2,
    feedback: "O ==def==Manifesto Ágil== valoriza pessoas, software funcional, colaboração do cliente e ==rule==adaptação a mudanças== acima de contratos e planos rígidos."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Explicativa",
    texto: "O ==def==Design Thinking== é uma abordagem de desenvolvimento centrada no ser humano. Antes de criar qualquer solução, a equipe investe tempo em entender profundamente as pessoas para as quais está desenvolvendo — suas necessidades, frustrações e contexto de vida. Essa etapa inicial, chamada de empatia, é o que diferencia o Design Thinking de metodologias que partem de suposições técnicas.",
    question: "O que caracteriza a etapa inicial do Design Thinking?",
    options: [
      "Definição imediata dos requisitos técnicos do sistema",
      "Criação de protótipos funcionais antes de qualquer pesquisa",
      "Empatia com o usuário para compreender necessidades reais antes de propor soluções",
      "Análise de riscos financeiros do projeto"
    ],
    answer: 2,
    feedback: "O ==def==Design Thinking== começa pela ==proc==empatia==: entender as necessidades reais do usuário antes de imaginar qualquer solução."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Contextualizada",
    texto: "O ==def==Design Thinking== é descrito como uma abordagem ==rule==holística== porque considera todas as dimensões envolvidas na experiência do usuário — não apenas a tecnologia, mas também o aspecto emocional, social e de negócio. Além disso, é ==rule==cocriativo==: as soluções são desenvolvidas junto com os usuários e partes interessadas, e não apenas para eles. Isso resulta em produtos muito mais conectados com a realidade de quem os usa.",
    question: "O que o princípio cocriativo do Design Thinking determina?",
    options: [
      "Que apenas especialistas técnicos devem participar do processo de criação",
      "Que as soluções devem ser desenvolvidas com a participação ativa dos usuários, não apenas para eles",
      "Que cada fase do processo deve ser concluída antes de avançar para a próxima",
      "Que o foco deve estar exclusivamente na aparência visual do produto"
    ],
    answer: 1,
    feedback: "O ==rule==princípio cocriativo== determina que usuários e partes interessadas participam ativamente da criação, tornando as soluções mais aderentes à realidade."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Explicativa",
    texto: "A ==def==Norma ISO 9241== é um padrão internacional que trata da usabilidade e ergonomia em sistemas interativos. Ela define três dimensões fundamentais para avaliar se um sistema é realmente usável: ==rule==eficácia== (o usuário consegue atingir seus objetivos?), ==rule==eficiência== (consegue fazer isso com o menor esforço possível?) e ==rule==satisfação== (a experiência foi agradável?). As três juntas formam a base da usabilidade.",
    question: "Quais são as três dimensões de usabilidade definidas pela Norma ISO 9241?",
    options: [
      "Desempenho, segurança e acessibilidade",
      "Eficácia, eficiência e satisfação",
      "Velocidade, precisão e confiabilidade",
      "Funcionalidade, estética e compatibilidade"
    ],
    answer: 1,
    feedback: "A ==def==ISO 9241== avalia usabilidade por meio de três dimensões: ==rule==eficácia== (atingir objetivos), ==rule==eficiência== (esforço empregado) e ==rule==satisfação== (experiência do usuário)."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Aplicação",
    texto: "Entre os sete princípios de diálogo definidos pela ==def==Norma ISO 9241-110==, dois se destacam por lidar com situações de erro. A ==rule==tolerância a erros== determina que o sistema deve minimizar a chance de erros e, quando eles ocorrem, permitir recuperação com o menor esforço possível. Já a ==rule==autodescrição== exige que a interface comunique seu estado atual em cada etapa, deixando o usuário sempre informado sobre o que está acontecendo.",
    question: "Um sistema que executa uma ação irreversível sem pedir confirmação e sem oferecer opção de desfazê-la está violando qual princípio da ISO 9241-110?",
    options: [
      "Individualização",
      "Adequação à tarefa",
      "Tolerância a erros",
      "Conformidade com expectativas"
    ],
    answer: 2,
    feedback: "A ==rule==tolerância a erros== exige que o sistema minimize erros e permita recuperação — ações irreversíveis sem confirmação violam diretamente esse princípio."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Aplicação",
    texto: "A ==rule==adequação à tarefa== é um dos princípios da ==def==ISO 9241-110== que mais impacta a experiência diária do usuário. Ele determina que o sistema deve apoiar o usuário em suas tarefas sem exigir etapas desnecessárias, informações irrelevantes ou esforço além do necessário. Já o princípio de ==rule==individualização== vai além: permite que o próprio usuário personalize a interface conforme suas preferências e necessidades específicas.",
    question: "Um aplicativo que permite ao usuário escolher o idioma da interface e ajustar o tamanho da fonte está aplicando qual princípio da ISO 9241-110?",
    options: [
      "Adequação à tarefa",
      "Autodescrição",
      "Tolerância a erros",
      "Individualização"
    ],
    answer: 3,
    feedback: "A ==rule==individualização== permite que o usuário adapte a interface às suas preferências, tornando a experiência mais acessível e personalizada."
  }
  ],

  /* ══════════════════════════════════════════════════════════
     QUESTÕES ENADE — Design
     ══════════════════════════════════════════════════════════ */
  enade: [

    {
      aula: "Aula 9 — Prototipagem e Norma ISO 9241",
      tipo: "Asserção + Justificativa",
      texto: "Uma empresa de desenvolvimento contratada pelo governo estadual iniciou a construção de um sistema de gestão tributária adotando o Modelo Cascata. Após seis meses de desenvolvimento, os analistas perceberam que os requisitos levantados no início do projeto estavam desatualizados em função de uma mudança na legislação fiscal. A equipe se viu impossibilitada de incorporar as alterações sem comprometer o cronograma e o orçamento, pois todas as etapas seguintes já haviam sido planejadas com base nos requisitos originais.",
      question: "Analise as asserções a seguir e a relação proposta entre elas:",
      assertions: [
        "O ==def==Modelo Cascata== é inadequado para projetos com requisitos instáveis porque sua estrutura sequencial não prevê mecanismos formais de revisão após a conclusão de cada etapa.",
        "[PORQUE] Em modelos lineares de desenvolvimento, o custo de correção de um erro aumenta exponencialmente conforme o projeto avança, tornando inviável a incorporação de mudanças tardias sem impacto significativo no escopo e no prazo."
      ],
      options: [
        "As asserções I e II são verdadeiras, e II justifica I",
        "As asserções I e II são verdadeiras, mas II não justifica I",
        "A asserção I é verdadeira e a II é falsa",
        "A asserção I é falsa e a II é verdadeira"
      ],
      answer: 0,
      feedback: "Correto: A. O ==def==Modelo Cascata== é sequencial e não prevê retorno formal entre fases (I). A asserção II explica o **mecanismo subjacente**: em modelos lineares, erros descobertos tardiamente custam muito mais para corrigir — o que fundamenta diretamente a inadequação descrita em I. As demais alternativas estão erradas pois ambas as asserções são verdadeiras e há relação direta de justificativa."
    },

    {
      aula: "Aula 9 — Prototipagem e Norma ISO 9241",
      tipo: "Asserção + Justificativa",
      texto: "Durante a auditoria de usabilidade de um portal de serviços públicos, a equipe de avaliadores verificou que usuários frequentemente conseguiam completar tarefas como emissão de certidões e agendamentos, mas relatavam cansaço e frustração ao final do processo. As entrevistas revelaram que, embora os objetivos fossem alcançados, o número de etapas desnecessárias e a falta de atalhos tornavam o sistema desgastante para uso recorrente.",
      question: "Analise as asserções a seguir e a relação proposta entre elas:",
      assertions: [
        "O cenário descrito configura um problema de ==rule==eficiência== segundo a Norma ISO 9241, pois os usuários atingem seus objetivos, mas com esforço desproporcional ao esperado.",
        "[PORQUE] A ISO 9241 distingue eficácia — capacidade de atingir o objetivo — de eficiência — a relação entre o resultado alcançado e os recursos consumidos no processo, incluindo tempo e esforço cognitivo."
      ],
      options: [
        "As asserções I e II são verdadeiras, e II justifica I",
        "As asserções I e II são verdadeiras, mas II não justifica I",
        "A asserção I é verdadeira e a II é falsa",
        "A asserção I é falsa e a II é verdadeira"
      ],
      answer: 0,
      feedback: "Correto: A. A asserção I identifica corretamente o problema como de ==rule==eficiência==: tarefas concluídas, mas com custo excessivo. A asserção II explica a **distinção conceitual da ISO 9241** entre eficácia e eficiência, que é exatamente o fundamento que permite classificar o caso como descrito em I — portanto, II justifica I."
    },

    {
      aula: "Aula 9 — Prototipagem e Norma ISO 9241",
      tipo: "Asserção + Justificativa",
      texto: "Uma startup educacional decidiu desenvolver uma plataforma de reforço escolar para estudantes do ensino médio. Em vez de partir de especificações técnicas, a equipe passou três semanas realizando entrevistas com alunos, professores e pais, observando rotinas de estudo e mapeando dificuldades reais antes de esboçar qualquer solução. Ao final do processo, as funcionalidades propostas eram radicalmente diferentes das que a equipe havia imaginado inicialmente.",
      question: "Analise as asserções a seguir e a relação proposta entre elas:",
      assertions: [
        "A abordagem adotada pela startup é característica do ==def==Design Thinking==, que parte da empatia com o usuário para compreender necessidades reais antes de propor qualquer solução.",
        "[PORQUE] O Design Thinking reconhece que soluções desenvolvidas sem contato direto com o contexto do usuário tendem a resolver problemas presumidos pelos desenvolvedores, e não os problemas que os usuários efetivamente enfrentam."
      ],
      options: [
        "As asserções I e II são verdadeiras, e II justifica I",
        "As asserções I e II são verdadeiras, mas II não justifica I",
        "A asserção I é verdadeira e a II é falsa",
        "A asserção I é falsa e a II é verdadeira"
      ],
      answer: 0,
      feedback: "Correto: A. O ==def==Design Thinking== se inicia pela empatia — compreender o usuário antes de propor soluções (I). A asserção II explica **por que** essa etapa é fundamental: sem ela, os desenvolvedores resolvem seus próprios pressupostos, não os problemas reais — o que justifica diretamente a abordagem descrita em I."
    },

    {
      aula: "Aula 9 — Prototipagem e Norma ISO 9241",
      tipo: "Múltiplas afirmativas",
      texto: "No planejamento de um novo sistema de gestão hospitalar, a equipe de TI debateu qual modelo de ciclo de vida de software seria mais adequado. Foram analisados quatro modelos estudados na disciplina: Cascata, Espiral, Iterativo e Estrela. Cada modelo foi avaliado quanto à sua flexibilidade, participação do usuário e capacidade de lidar com mudanças de requisitos ao longo do projeto.",
      question: "Avalie as afirmativas a seguir sobre os modelos de ciclo de vida de software:",
      assertions: [
        "O ==def==Modelo Cascata== apresenta baixa flexibilidade porque suas fases são executadas de forma sequencial e linear, sem previsão de retorno formal às etapas anteriores.",
        "O Modelo Espiral diferencia-se dos demais por incluir explicitamente a análise de riscos a cada ciclo e pelo uso de protótipos como ferramenta de validação progressiva do produto.",
        "O Modelo Iterativo elimina completamente a necessidade de planejamento inicial ao substituí-lo por repetições contínuas, o que dispensa qualquer forma de documentação formal no projeto.",
        "O ==def==Modelo Estrela== posiciona a avaliação como atividade central e permite que o desenvolvimento se inicie a partir de qualquer etapa, conferindo maior flexibilidade para projetos com usuários ativos."
      ],
      questionContinuation: "São corretas apenas as afirmativas:",
      options: [
        "I, II e IV, apenas",
        "I e IV, apenas",
        "II e III, apenas",
        "I, II, III e IV"
      ],
      answer: 0,
      feedback: "Correto: A (I, II e IV). As afirmativas I, II e IV descrevem corretamente as características do Cascata, Espiral e Estrela, respectivamente. A afirmativa III está **errada**: o ==proc==Modelo Iterativo== não elimina planejamento nem documentação — distribui essas atividades ao longo das iterações, mantendo organização e rastreabilidade."
    },

    {
      aula: "Aula 9 — Prototipagem e Norma ISO 9241",
      tipo: "Múltiplas afirmativas",
      texto: "A equipe de design de uma plataforma bancária digital foi encarregada de revisar a interface do aplicativo com base nos sete princípios de diálogo definidos pela Norma ISO 9241-110. Cada princípio foi avaliado em funcionalidades específicas: o formulário de transferência, o histórico de transações, as configurações de segurança e o processo de recuperação de senha.",
      question: "Avalie as afirmativas a seguir sobre os princípios de diálogo da Norma ISO 9241-110:",
      assertions: [
        "O princípio de ==rule==adequação à tarefa== determina que o sistema deve apoiar o usuário na realização de suas atividades sem exigir etapas desnecessárias ou informações irrelevantes para o objetivo da interação.",
        "O princípio de autodescrição exige que o sistema informe, em cada etapa da interação, qual é o estado atual do processo e quais ações estão disponíveis, tornando a interface transparente para o usuário.",
        "O princípio de conformidade com as expectativas do usuário determina que o sistema seja deliberadamente surpreendente em sua navegação, estimulando a descoberta de funcionalidades por exploração espontânea.",
        "O princípio de ==rule==tolerância a erros== implica que o sistema deve minimizar a ocorrência de erros e, quando eles acontecem, permitir sua correção com o menor esforço possível por parte do usuário."
      ],
      questionContinuation: "São corretas apenas as afirmativas:",
      options: [
        "I, II e IV, apenas",
        "I e III, apenas",
        "II e IV, apenas",
        "I, II, III e IV"
      ],
      answer: 0,
      feedback: "Correto: A (I, II e IV). Os princípios de adequação à tarefa, autodescrição e ==rule==tolerância a erros== estão corretamente descritos. A afirmativa III está **errada**: o princípio de conformidade exige que o sistema seja **consistente** com as expectativas do usuário, não surpreendente — inconsistência aumenta erros e prejudica o aprendizado."
    },

    {
      aula: "Aula 9 — Prototipagem e Norma ISO 9241",
      tipo: "Múltiplas afirmativas",
      texto: "Uma consultoria de inovação foi contratada por uma rede de saúde pública para redesenhar o processo de triagem em unidades de pronto-atendimento. A metodologia adotada foi o Design Thinking, com equipes compostas por médicos, enfermeiros, pacientes, assistentes sociais e especialistas em tecnologia, trabalhando de forma colaborativa desde o levantamento de necessidades até a prototipagem das soluções.",
      question: "Avalie as afirmativas a seguir sobre as características e princípios do Design Thinking:",
      assertions: [
        "O ==def==Design Thinking== é uma abordagem interdisciplinar centrada no ser humano, que integra empatia, criatividade e experimentação para desenvolver soluções baseadas nas necessidades reais dos usuários.",
        "O princípio cocriativo do Design Thinking prevê que as soluções sejam desenvolvidas com a participação ativa dos usuários e demais partes interessadas, e não apenas para eles.",
        "Por ser uma abordagem sequencial e rígida, o Design Thinking impõe a obrigatoriedade de concluir cada fase antes de avançar, garantindo que não haja retorno a etapas anteriores durante o processo.",
        "O princípio holístico do Design Thinking considera que uma solução deve contemplar todas as dimensões da experiência — tecnológica, de negócio, emocional e social — de forma integrada."
      ],
      questionContinuation: "São corretas apenas as afirmativas:",
      options: [
        "I, II e IV, apenas",
        "I e II, apenas",
        "II e III, apenas",
        "I, II, III e IV"
      ],
      answer: 0,
      feedback: "Correto: A (I, II e IV). O ==def==Design Thinking== é centrado no ser humano (I), cocriativo (II) e holístico (IV) — todas corretas. A afirmativa III está **errada**: o Design Thinking é iterativo e não linear, admitindo retornos e revisões a qualquer momento do processo."
    },

    {
      aula: "Aula 9 — Prototipagem e Norma ISO 9241",
      tipo: "Conceitual",
      texto: "Ao elaborar o plano de desenvolvimento de um sistema de apoio à decisão para magistrados, a equipe técnica discutiu os modelos centrados no usuário estudados na disciplina. Foram considerados o Modelo Estrela, desenvolvido por Hartson e Hix, e o Modelo de Shneiderman, ambos com foco em usabilidade. A discussão central girou em torno do papel da avaliação e da prototipagem em cada abordagem.",
      question: "Sobre as características que diferenciam o Modelo Estrela do Modelo de Shneiderman, assinale a alternativa correta:",
      options: [
        "O Modelo de Shneiderman posiciona a avaliação como atividade central e pode ser iniciado a partir de qualquer etapa, enquanto o Modelo Estrela segue uma sequência rígida baseada em especificação, prototipagem e testes.",
        "Ambos os modelos são equivalentes e intercambiáveis, diferindo apenas na nomenclatura adotada por seus autores, sem implicações práticas para o processo de desenvolvimento.",
        "O Modelo Estrela centraliza a avaliação e permite flexibilidade de entrada por qualquer etapa, enquanto o Modelo de Shneiderman estrutura o processo em três pilares sequenciais: especificação, prototipagem e testes de usabilidade.",
        "O Modelo de Shneiderman elimina a necessidade de prototipagem ao substituí-la por avaliações heurísticas, tornando o processo mais rápido e adequado a projetos com prazos reduzidos."
      ],
      answer: 2,
      feedback: "Correto: C. O ==def==Modelo Estrela== tem a avaliação no centro e permite início por qualquer etapa. O Modelo de Shneiderman organiza o processo em três pilares — especificação, prototipagem e testes de usabilidade — de forma mais estruturada. A alternativa A inverte as características dos dois modelos. A B é falsa pois há diferenças práticas relevantes. A D distorce o Modelo de Shneiderman, que **inclui** prototipagem como pilar central."
    },

    {
      aula: "Aula 9 — Prototipagem e Norma ISO 9241",
      tipo: "Conceitual",
      texto: "Uma empresa de desenvolvimento de software, após anos trabalhando com metodologias tradicionais, decidiu adotar uma abordagem mais adaptativa. Em reunião estratégica, o gestor de projetos apresentou os valores do Manifesto Ágil como referência para a mudança cultural. A equipe debateu de que forma esses valores impactariam não apenas o processo técnico, mas também a relação com os clientes e a organização interna das equipes.",
      question: "Sobre os valores e princípios que fundamentam o Manifesto Ágil, assinale a alternativa correta:",
      options: [
        "O Manifesto Ágil prioriza processos e ferramentas em relação às pessoas, por entender que a padronização técnica garante maior qualidade e previsibilidade nos projetos de software.",
        "Segundo o Manifesto Ágil, a documentação abrangente deve ser o principal produto de cada etapa do desenvolvimento, sendo o software funcional apenas uma consequência secundária do processo.",
        "O Manifesto Ágil valoriza a colaboração do cliente e a capacidade de resposta a mudanças, reconhecendo que planos detalhados são menos importantes que a adaptação contínua às necessidades reais do projeto.",
        "O Manifesto Ágil determina que contratos fechados e negociações formais devem guiar todas as decisões do projeto, limitando alterações de escopo para garantir a previsibilidade do produto final."
      ],
      answer: 2,
      feedback: "Correto: C. O ==def==Manifesto Ágil== prioriza pessoas sobre processos, software funcional sobre documentação excessiva, colaboração do cliente sobre negociação contratual e resposta a mudanças sobre seguir um plano fixo. As alternativas A, B e D contradizem diretamente esses valores — cada uma inverte uma das quatro prioridades fundamentais do manifesto."
    },

    {
      aula: "Aula 9 — Prototipagem e Norma ISO 9241",
      tipo: "Conceitual",
      texto: "A equipe de qualidade de uma fintech realizou testes de usabilidade com três grupos de usuários sobre um novo fluxo de contratação de crédito. Os resultados mostraram que: (1) todos os usuários concluíram a contratação com sucesso; (2) o tempo médio por operação era 40% maior que o de sistemas concorrentes; (3) os usuários relataram sentir-se inseguros e ansiosos durante o processo, mesmo quando bem-sucedidos. Com base na Norma ISO 9241, a equipe precisou classificar cada achado dentro das métricas de usabilidade.",
      question: "Com base nos resultados descritos e nas métricas de usabilidade definidas pela Norma ISO 9241, assinale a alternativa que classifica corretamente os três achados:",
      options: [
        "Os três achados representam problemas de eficácia, pois todos indicam falhas no processo de conclusão da tarefa pelo usuário.",
        "O primeiro achado evidencia boa eficácia; o segundo indica problema de eficiência; o terceiro aponta comprometimento da satisfação do usuário.",
        "O segundo achado representa problema de eficácia e o terceiro de eficiência, enquanto o primeiro — conclusão com sucesso — é irrelevante para a avaliação de usabilidade.",
        "Os três achados são interdependentes e não podem ser classificados separadamente segundo a ISO 9241, pois a norma avalia usabilidade apenas de forma global."
      ],
      answer: 1,
      feedback: "Correto: B. A ISO 9241 define: **eficácia** como a capacidade de atingir o objetivo (achado 1 — todos concluíram, portanto eficácia satisfatória); ==rule==eficiência== como o esforço empregado em relação ao resultado (achado 2 — tempo 40% maior que concorrentes, problema de eficiência); e satisfação como a percepção subjetiva do usuário (achado 3 — sensação de insegurança, problema de satisfação). As demais alternativas classificam os achados incorretamente."
    },

    {
      aula: "Aula 9 — Prototipagem e Norma ISO 9241",
      tipo: "Análise aplicada",
      texto: "O governo de um estado brasileiro contratou uma empresa para desenvolver um sistema de concessão de benefícios sociais. O projeto apresentava as seguintes características: (1) os requisitos eram inicialmente imprecisos e sujeitos a mudanças conforme a legislação evoluísse; (2) os beneficiários tinham perfis variados, com baixa familiaridade com tecnologia; (3) erros no sistema poderiam impactar diretamente o acesso de famílias vulneráveis a direitos essenciais; (4) havia necessidade de validar a solução com usuários reais em ciclos curtos antes da entrega definitiva.",
      question: "Considerando as características do projeto, avalie as afirmativas a seguir sobre a escolha do modelo de ciclo de vida:",
      assertions: [
        "O ==def==Modelo Cascata== seria a escolha mais adequada porque sua estrutura sequencial garante controle rígido de prazos e orçamento, elementos críticos em projetos governamentais.",
        "O Modelo Iterativo seria mais indicado que o Cascata para esse projeto por permitir correções contínuas de erros e adaptação a mudanças de requisitos ao longo do desenvolvimento.",
        "O ==warn==Modelo Espiral== seria inadequado para o contexto porque a análise de riscos em ciclos aumenta o tempo total do projeto, sendo contraproducente em situações que exigem entrega rápida.",
        "O Modelo Estrela seria uma escolha adequada para o projeto por centralizar a avaliação e permitir forte participação dos usuários, fundamental dado o perfil diversificado dos beneficiários."
      ],
      questionContinuation: "São corretas apenas as afirmativas:",
      options: [
        "II e IV, apenas",
        "I e III, apenas",
        "I, II e IV, apenas",
        "I, II, III e IV"
      ],
      answer: 0,
      feedback: "Correto: A (II e IV). O Modelo Iterativo permite adaptação contínua, essencial dado que os requisitos são instáveis (II). O ==def==Modelo Estrela== é adequado pela centralidade da avaliação e participação dos usuários (IV). A afirmativa I está **errada**: o Cascata é inadequado exatamente pela rigidez sequencial que impede adaptação a mudanças. A afirmativa III está **errada**: a análise de riscos do Espiral é uma vantagem em projetos com alto impacto social, não uma desvantagem."
    },

    {
      aula: "Aula 9 — Prototipagem e Norma ISO 9241",
      tipo: "Análise aplicada",
      texto: "Ao testar o sistema de agendamento médico de uma UBS (Unidade Básica de Saúde), avaliadores de usabilidade registraram os seguintes problemas: (a) ao confirmar um agendamento, o sistema não informava se a operação havia sido concluída com sucesso ou se ainda estava em processamento; (b) ao clicar em \"Cancelar\" por engano, o sistema executava o cancelamento imediatamente, sem solicitar confirmação e sem oferecer forma de desfazer a ação; (c) termos técnicos de saúde eram exibidos sem qualquer explicação contextual, confundindo pacientes sem formação médica.",
      question: "Relacione cada problema identificado ao princípio de diálogo da Norma ISO 9241-110 que foi violado e assinale a alternativa que apresenta a correspondência correta:",
      options: [
        "Problema (a) viola a adequação à tarefa; problema (b) viola a individualização; problema (c) viola a tolerância a erros.",
        "Problema (a) viola a autodescrição; problema (b) viola a tolerância a erros; problema (c) viola a adequação à tarefa.",
        "Problema (a) viola a conformidade; problema (b) viola o controle do usuário; problema (c) viola o aprendizado.",
        "Problema (a) viola a autodescrição; problema (b) viola o controle do usuário; problema (c) viola a autodescrição."
      ],
      answer: 1,
      feedback: "Correto: B. O problema (a) — ausência de resposta sobre o estado da operação — viola a **autodescrição**, que exige que o sistema informe seu estado em cada etapa. O problema (b) — execução irreversível sem confirmação — viola a ==rule==tolerância a erros==, que exige minimizar erros e permitir recuperação. O problema (c) — termos técnicos sem explicação — viola a **adequação à tarefa**, pois sobrecarrega o usuário com informações inadequadas ao seu perfil. As demais alternativas associam os problemas aos princípios incorretos."
    },

    {
      aula: "Aula 9 — Prototipagem e Norma ISO 9241",
      tipo: "Análise aplicada",
      texto: "Uma equipe de engenharia de software debatia qual abordagem de desenvolvimento adotar para modernizar o sistema de controle acadêmico de uma universidade pública. O sistema legado era complexo, tinha mais de 20 anos de uso e atendia a perfis variados de usuários: alunos, professores, coordenadores e gestores. A equipe avaliou três abordagens: (1) reescrever tudo com Modelo Cascata, entregando o sistema completo ao final; (2) adotar Modelo Iterativo com entregas parciais a cada dois meses; (3) aplicar Design Thinking como fase inicial de imersão antes de qualquer desenvolvimento.",
      question: "Com base nos conceitos de ciclo de vida e design centrado no usuário, avalie as afirmativas a seguir sobre as três abordagens consideradas:",
      assertions: [
        "A abordagem (1) apresenta o maior risco para o projeto porque problemas identificados somente na entrega final tendem a exigir retrabalho extenso, dado que todas as fases já terão sido concluídas.",
        "A abordagem (2) é mais adequada que a (1) para esse contexto porque permite validar funcionalidades com usuários reais a cada entrega, incorporando ajustes antes que os erros se acumulem.",
        "A abordagem (3) substitui completamente o ciclo de desenvolvimento, eliminando a necessidade de modelagem, prototipagem e testes após a fase de imersão.",
        "A combinação das abordagens (2) e (3) seria a mais completa: o ==def==Design Thinking== na fase inicial identificaria necessidades reais, e o Modelo Iterativo garantiria entregas progressivas e validadas ao longo do projeto."
      ],
      questionContinuation: "São corretas apenas as afirmativas:",
      options: [
        "I, II e IV, apenas",
        "I e II, apenas",
        "III e IV, apenas",
        "I, II, III e IV"
      ],
      answer: 0,
      feedback: "Correto: A (I, II e IV). A abordagem (1) apresenta alto risco pela rigidez do Cascata (I). A abordagem (2) é mais adequada pela validação contínua (II). A combinação de ==def==Design Thinking== com Iterativo é a mais robusta para o cenário (IV). A afirmativa III está **errada**: o Design Thinking é uma abordagem de imersão e ideação, não substitui o ciclo de desenvolvimento — ele **precede e alimenta** o processo, que ainda exige modelagem, prototipagem e testes."
    }

  ],

  // ── Questões de Fixação ────────────────────────────────────
  fixacao: [

  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Curta",
    texto: "Sobre os modelos de ciclo de vida de software.",
    question: "Qual modelo de ciclo de vida executa suas etapas de forma sequencial e linear, sem retorno formal às fases anteriores?",
    options: [
      "==def==Modelo Espiral==",
      "==proc==Modelo Iterativo==",
      "==def==Modelo Cascata==",
      "==def==Modelo Estrela=="
    ],
    answer: 2,
    feedback: "O ==def==Modelo Cascata== é caracterizado pelo fluxo sequencial: cada fase só começa após a conclusão da anterior, sem mecanismo formal de revisão."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Direta",
    texto: "Considere os modelos centrados no usuário estudados na disciplina.",
    question: "O que diferencia o ==def==Modelo Estrela== dos demais modelos de ciclo de vida?",
    options: [
      "Ele elimina a fase de prototipagem para acelerar a entrega",
      "Ele posiciona a avaliação como atividade central e permite início por qualquer etapa",
      "Ele exige que os requisitos sejam completamente definidos antes do desenvolvimento",
      "Ele é baseado exclusivamente em análise de riscos a cada ciclo"
    ],
    answer: 1,
    feedback: "O ==def==Modelo Estrela== tem a avaliação no centro e pode ser iniciado a partir de qualquer etapa, conferindo alta flexibilidade e forte participação do usuário."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Contexto",
    texto: "Uma equipe de desenvolvimento percebeu, após quatro meses de projeto, que os requisitos iniciais estavam desatualizados por conta de uma mudança na legislação. O modelo adotado não permitia retorno às fases anteriores sem comprometer cronograma e orçamento.",
    question: "Qual modelo estava sendo utilizado e por que ele gerou esse problema?",
    options: [
      "==proc==Modelo Iterativo==, pois não prevê documentação de requisitos",
      "==def==Modelo Espiral==, pois sua análise de riscos ignora mudanças legislativas",
      "==def==Modelo Cascata==, pois sua estrutura sequencial não prevê revisão formal após cada etapa",
      "==def==Modelo Estrela==, pois centraliza a avaliação e impede mudanças de requisitos"
    ],
    answer: 2,
    feedback: "O ==def==Modelo Cascata== é rígido e sequencial. Mudanças de requisitos após o início do desenvolvimento geram alto custo e risco de retrabalho."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Direta",
    texto: "Sobre ferramentas e artefatos utilizados no design de interfaces.",
    question: "Qual é a principal função de um ==term==wireframe== no processo de design?",
    options: [
      "Definir as cores e tipografia da interface final",
      "Executar o código da aplicação em ambiente de testes",
      "Definir a estrutura e organização da interface, sem detalhes visuais",
      "Armazenar os dados do banco de dados relacional"
    ],
    answer: 2,
    feedback: "O ==term==wireframe== é um esqueleto da interface — define layout, hierarquia e posicionamento dos elementos, sem se preocupar com aspectos estéticos."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Contexto",
    texto: "Em um portal de serviços públicos, todos os usuários conseguiam concluir seus agendamentos, mas relatavam desgaste e cansaço ao final do processo, devido ao grande número de etapas desnecessárias.",
    question: "Qual dimensão de usabilidade da ==mark==ISO 9241== está comprometida nesse cenário?",
    options: [
      "==rule==Eficácia==, pois os usuários não conseguem atingir seus objetivos",
      "Satisfação, pois o sistema não informa o estado das operações",
      "==rule==Eficiência==, pois o esforço empregado é desproporcional ao resultado obtido",
      "Autodescrição, pois a interface não explica suas funcionalidades"
    ],
    answer: 2,
    feedback: "==rule==Eficiência== mede a relação entre o resultado e os recursos consumidos (tempo, esforço). Usuários que concluem tarefas com esforço excessivo têm problema de ==rule==eficiência==, não de ==rule==eficácia==."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Curta",
    texto: "Sobre os princípios de diálogo definidos pela Norma ==mark==ISO 9241-110==.",
    question: "Qual princípio determina que o sistema deve informar ao usuário, em cada etapa, qual é o estado atual do processo e quais ações estão disponíveis?",
    options: [
      "==rule==Tolerância a erros==",
      "==rule==Adequação à tarefa==",
      "Individualização",
      "==rule==Autodescrição=="
    ],
    answer: 3,
    feedback: "O princípio de ==rule==autodescrição== exige que a interface seja transparente: o sistema deve sempre comunicar seu estado e orientar o usuário sobre as ações disponíveis."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Aplicação",
    texto: "Ao realizar um agendamento médico online, o usuário clicou por engano no botão 'Cancelar'. O sistema executou o cancelamento imediatamente, sem pedir confirmação nem oferecer forma de desfazer a ação.",
    question: "Qual princípio da ==mark==ISO 9241-110== foi violado nessa situação?",
    options: [
      "Conformidade com as expectativas do usuário",
      "==rule==Tolerância a erros==",
      "==rule==Adequação à tarefa==",
      "Aprendizado"
    ],
    answer: 1,
    feedback: "==rule==Tolerância a erros== determina que o sistema deve minimizar erros e, quando ocorrem, permitir recuperação com o menor esforço possível. Ações irreversíveis sem confirmação violam diretamente esse princípio."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Direta",
    texto: "Sobre os valores estabelecidos pelo ==def==Manifesto Ágil==.",
    question: "Qual das opções representa corretamente uma das prioridades do ==def==Manifesto Ágil==?",
    options: [
      "Documentação abrangente em detrimento de software funcional",
      "Processos e ferramentas acima de pessoas e interações",
      "Contratos fechados como guia principal das decisões do projeto",
      "Colaboração do cliente e resposta a mudanças acima de planos fixos"
    ],
    answer: 3,
    feedback: "O ==def==Manifesto Ágil== prioriza: pessoas sobre processos, software funcional sobre documentação, colaboração do cliente sobre negociação contratual e adaptação sobre seguir um plano rígido."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Contexto",
    texto: "Uma startup de saúde realizou entrevistas com pacientes e médicos, observou rotinas clínicas e mapeou dores reais antes de esboçar qualquer solução. A equipe era composta por profissionais de áreas distintas trabalhando de forma colaborativa.",
    question: "Qual abordagem de design está sendo aplicada nesse cenário?",
    options: [
      "==def==Modelo Cascata== com fase de levantamento de requisitos",
      "==def==Modelo Espiral== com análise de riscos inicial",
      "==def==Design Thinking==, com ênfase na empatia e ==mark==cocriação==",
      "Modelo de Shneiderman, com foco em testes de usabilidade"
    ],
    answer: 2,
    feedback: "O ==def==Design Thinking== é caracterizado por ser centrado no usuário, interdisciplinar e baseado em empatia — compreender necessidades reais antes de propor soluções."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Curta",
    texto: "Sobre os modelos de desenvolvimento de software e suas características.",
    question: "Qual modelo de ciclo de vida inclui explicitamente análise de riscos em cada ciclo e utiliza protótipos como ferramenta de validação progressiva?",
    options: [
      "==def==Modelo Cascata==",
      "==def==Modelo Espiral==",
      "==def==Modelo Estrela==",
      "==proc==Modelo Iterativo=="
    ],
    answer: 1,
    feedback: "O ==def==Modelo Espiral== se diferencia dos demais por incorporar análise de riscos em cada ciclo e pelo uso sistemático de protótipos para validar o produto progressivamente."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Aplicação",
    texto: "Uma plataforma de e-commerce exibe um botão 'Comprar' e um botão 'Cancelar' com as mesmas cores, tamanho e destaque visual, sem qualquer diferenciação entre a ação principal e a secundária.",
    question: "Qual problema de design está presente nesse layout?",
    options: [
      "Violação do princípio de individualização",
      "Ausência de responsividade para dispositivos móveis",
      "Falta de ==term==hierarquia visual== e contraste entre ações primária e secundária",
      "Excesso de informações desnecessárias na interface"
    ],
    answer: 2,
    feedback: "Sem contraste ou destaque, o usuário não identifica qual ação é prioritária. A ==term==hierarquia visual== é fundamental para guiar decisões e evitar cliques equivocados."
  },
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",
    tipo: "Direta",
    texto: "Sobre os princípios do ==def==Design Thinking== e sua aplicação em projetos.",
    question: "O que significa dizer que o ==def==Design Thinking== é uma abordagem 'holística'?",
    options: [
      "Que cada fase deve ser concluída isoladamente antes de avançar para a próxima",
      "Que a solução deve contemplar todas as dimensões da experiência: tecnológica, de negócio, emocional e social",
      "Que apenas especialistas técnicos participam do processo de desenvolvimento",
      "Que o foco está exclusivamente na aparência visual do produto final"
    ],
    answer: 1,
    feedback: "O princípio ==mark==holístico== do ==def==Design Thinking== considera que uma boa solução deve integrar todas as dimensões da experiência — não apenas o aspecto técnico, mas também o humano, emocional e de negócio."
  }
  ]

};