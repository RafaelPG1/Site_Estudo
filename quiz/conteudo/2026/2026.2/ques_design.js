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
  },

  // ── Questão 13 ── Explicativa
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
    tipo: "Explicativa",

    texto: "O Design Centrado no Usuário (DCU) é uma abordagem que coloca o usuário como ponto de partida de todas as decisões do projeto. Em vez de criar um sistema e depois ajustá-lo para as pessoas, o DCU parte das necessidades, comportamentos e limitações dos usuários para guiar o desenvolvimento. Quatro princípios sustentam essa abordagem: usabilidade, ergonomia, comunicabilidade e intuitividade.",

    question: "O que diferencia o Design Centrado no Usuário de abordagens tradicionais de desenvolvimento?",

    options: [
      "Ele prioriza a linguagem de programação antes de definir os requisitos.",
      "Ele parte das necessidades e comportamentos do usuário para guiar todo o projeto.",
      "Ele elimina a etapa de testes para acelerar a entrega do produto.",
      "Ele foca exclusivamente na aparência visual do sistema, ignorando a funcionalidade."
    ],

    answer: 1,

    feedback: "No ==def==DCU==, o usuário é o centro de cada decisão — desde o planejamento até a entrega. Usabilidade, ergonomia, comunicabilidade e intuitividade são seus pilares fundamentais."
  },

  // ── Questão 14 ── Explicativa
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
    tipo: "Explicativa",

    texto: "O modelo conceitual representa como o sistema funciona na teoria — é a ideia abstrata por trás da interface. Para tornar essa ideia compreensível, designers usam metáforas do mundo real: uma lixeira para representar exclusão, uma pasta para agrupar arquivos, um envelope para mensagens. Essas associações ajudam o usuário a entender o sistema sem precisar aprender conceitos completamente novos.",

    question: "Por que os modelos conceituais utilizam metáforas do mundo real?",

    options: [
      "Para reduzir o tempo de programação durante o desenvolvimento.",
      "Para garantir que o sistema funcione em diferentes sistemas operacionais.",
      "Para facilitar a compreensão do sistema com base em referências já conhecidas pelo usuário.",
      "Para substituir a necessidade de documentação técnica do projeto."
    ],

    answer: 2,

    feedback: "As ==def==metáforas do mundo real== tornam o modelo conceitual intuitivo, aproveitando associações que o usuário já conhece para explicar como o sistema funciona."
  },

  // ── Questão 15 ── Explicativa
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
    tipo: "Explicativa",

    texto: "Os problemas de usabilidade são classificados em três categorias conforme o impacto que causam na experiência do usuário. As barreiras impedem completamente a conclusão de uma tarefa. Os obstáculos dificultam, mas ainda permitem que o usuário conclua o que precisa fazer. Já os ruídos não impedem nem dificultam diretamente, mas geram dúvida ou confusão desnecessária durante a interação.",

    question: "Um botão de confirmação que some da tela antes do usuário conseguir clicar impede a conclusão da tarefa. Que tipo de problema de usabilidade é esse?",

    options: [
      "Ruído, pois gera apenas uma leve confusão visual.",
      "Obstáculo, pois dificulta mas ainda permite concluir a tarefa.",
      "Barreira, pois impede completamente a conclusão da tarefa.",
      "Problema secundário, pois afeta apenas parte dos usuários."
    ],

    answer: 2,

    feedback: "==def==Barreiras== são problemas que impedem totalmente a execução de uma tarefa. Quando o usuário não consegue nem avançar, trata-se de uma barreira — a categoria mais crítica de problema de usabilidade."
  },

  // ── Questão 16 ── Contextualizada
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
    tipo: "Contextualizada",

    texto: "A prototipação é o processo de criar representações do sistema antes de desenvolvê-lo de verdade. Protótipos servem para testar ideias, identificar problemas cedo e economizar tempo e recursos. Quanto antes um problema é encontrado, mais barato e simples é corrigi-lo. Por isso, a prototipação é considerada um investimento: evita retrabalho e melhora a experiência final do usuário.",

    question: "Por que a prototipação é considerada uma etapa essencial antes da implementação do sistema?",

    options: [
      "Porque substitui completamente a fase de testes após o desenvolvimento.",
      "Porque permite identificar e corrigir problemas antes de investir no desenvolvimento completo.",
      "Porque garante que o sistema final será idêntico ao protótipo aprovado.",
      "Porque elimina a necessidade de envolvimento do usuário nas fases seguintes."
    ],

    answer: 1,

    feedback: "==proc==Prototipar== antecipa problemas e valida ideias com custo muito menor do que corrigi-los após a implementação. É uma prática central no design centrado no usuário."
  },

  // ── Questão 17 ── Contextualizada
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
    tipo: "Contextualizada",

    texto: "Os protótipos podem ser classificados quanto à fidelidade — o quanto se aproximam do produto final. Um protótipo de baixa fidelidade é simples, rápido de criar e estimula a geração de muitas ideias sem preocupação com detalhes. Já um protótipo de alta fidelidade é detalhado, visual e próximo do sistema real — ideal para validar a experiência antes da entrega. A escolha entre os dois depende da fase e do objetivo do projeto.",

    question: "Uma equipe está na fase inicial do projeto e quer explorar o máximo de ideias possível sem se preocupar com detalhes visuais. Qual tipo de protótipo é mais indicado?",

    options: [
      "Alta fidelidade, pois apresenta mais detalhes para análise.",
      "Baixa fidelidade, pois é mais simples e estimula a geração de ideias.",
      "Mockup, pois representa visualmente todas as telas do sistema.",
      "Vertical, pois detalha profundamente cada funcionalidade."
    ],

    answer: 1,

    feedback: "Protótipos de ==def==baixa fidelidade== são rápidos, simples e ideais para explorar ideias nas fases iniciais. A alta fidelidade entra quando o foco é validar detalhes antes da implementação."
  },

  // ── Questão 18 ── Contextualizada
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
    tipo: "Contextualizada",

    texto: "Quanto à estrutura, os protótipos podem ser horizontais ou verticais. O protótipo horizontal cobre muitas funcionalidades do sistema, mas com pouco aprofundamento em cada uma — dá uma visão ampla do produto. O protótipo vertical faz o oposto: escolhe poucas funcionalidades e as detalha profundamente. Cada abordagem tem sua utilidade dependendo do que precisa ser validado.",

    question: "Uma equipe precisa testar em detalhe apenas o fluxo de login e recuperação de senha de um sistema. Qual estrutura de protótipo é mais adequada?",

    options: [
      "Horizontal, pois cobre todas as funcionalidades do sistema de forma ampla.",
      "Vertical, pois foca em poucas funcionalidades com alto nível de detalhamento.",
      "Baixa fidelidade, pois elimina a necessidade de detalhar fluxos específicos.",
      "Storyboard, pois representa visualmente todas as telas do sistema."
    ],

    answer: 1,

    feedback: "O protótipo ==def==vertical== é indicado quando o objetivo é aprofundar poucas funcionalidades. Para validar o fluxo de login em detalhe, essa é a estrutura mais adequada."
  },

  // ── Questão 19 ── Aplicação
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
    tipo: "Aplicação",

    texto: "O wireframe é um tipo de protótipo que representa a estrutura básica de uma interface: onde ficam os botões, menus, campos de texto e blocos de conteúdo. Ele não inclui cores, imagens ou tipografia elaborada — o foco é exclusivamente na organização dos elementos na tela. Por ser simples e rápido de criar, o wireframe é muito usado nas fases iniciais do design para alinhar a estrutura antes de avançar para o visual.",

    question: "Um designer apresentou ao cliente um esboço em preto e branco mostrando onde ficam o menu, os botões e os campos do sistema — sem cores ou imagens. Que tipo de protótipo foi entregue?",

    options: [
      "Mockup, pois representa visualmente o produto final.",
      "Storyboard, pois mostra a sequência de interações do usuário.",
      "Wireframe, pois apresenta a estrutura da interface sem elementos visuais detalhados.",
      "Cenário, pois descreve narrativamente o fluxo de uso do sistema."
    ],

    answer: 2,

    feedback: "O ==def==wireframe== é o 'esqueleto' da interface — mostra organização e estrutura sem design visual. É o ponto de partida antes de evoluir para o mockup."
  },

  // ── Questão 20 ── Aplicação
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
    tipo: "Aplicação",

    texto: "O mockup é um protótipo de alta fidelidade que representa visualmente o sistema de forma muito próxima do produto final. Ele inclui cores, tipografia, imagens e todos os elementos visuais que estarão presentes na interface real. Diferente do wireframe, o mockup não foca na estrutura — ele foca na aparência. É usado para aprovação visual antes do desenvolvimento.",

    question: "Após aprovar a estrutura do sistema com o wireframe, a equipe precisa apresentar ao cliente como o produto vai parecer visualmente, com cores e imagens reais. Qual tipo de protótipo deve ser criado agora?",

    options: [
      "Wireframe, pois é mais detalhado que o mockup.",
      "Storyboard, pois representa o fluxo visual das telas.",
      "Cenário, pois descreve a aparência em formato de narrativa.",
      "Mockup, pois simula a aparência final do sistema com todos os elementos visuais."
    ],

    answer: 3,

    feedback: "O ==def==mockup== é a etapa visual do protótipo — apresenta cores, imagens e tipografia, simulando fielmente como o produto final vai se parecer."
  },

  // ── Questão 21 ── Aplicação
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
    tipo: "Aplicação",

    texto: "O storyboard é um tipo de protótipo que representa visualmente a sequência de interações entre o usuário e o sistema. Funciona como um roteiro em quadros: cada imagem mostra uma etapa da interação, permitindo visualizar o fluxo completo antes de qualquer linha de código ser escrita. É muito usado para comunicar ideias de forma clara entre equipes e clientes.",

    question: "Uma equipe quer mostrar ao cliente, passo a passo e de forma visual, como o usuário vai interagir com o aplicativo — desde a abertura até a conclusão de uma compra. Qual ferramenta de prototipação é mais adequada?",

    options: [
      "Wireframe, pois representa a estrutura de cada tela individualmente.",
      "Mockup, pois apresenta as cores e o visual de cada tela.",
      "Storyboard, pois mostra a sequência visual das interações passo a passo.",
      "Modelo conceitual, pois descreve as funções do sistema teoricamente."
    ],

    answer: 2,

    feedback: "O ==def==storyboard== é ideal para representar fluxos de interação em sequência. Ele comunica a jornada do usuário de forma visual e narrativa, antes do desenvolvimento."
  },

  // ── Questão 22 ── Aplicação
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
    tipo: "Aplicação",

    texto: "Os modelos físicos transformam o modelo conceitual em algo concreto e visível. Eles se dividem em três tipos: o operacional, que representa como o sistema funciona; o representacional, que descreve a aparência visual; e o de interação, que define o fluxo de uso — como o usuário navega pelo sistema. Juntos, eles garantem que o sistema seja bem planejado antes de ser desenvolvido.",

    question: "Um designer criou um diagrama mostrando exatamente como o usuário vai navegar entre as telas do sistema — do login até o fechamento de um pedido. Que tipo de modelo físico foi criado?",

    options: [
      "Operacional, pois representa o funcionamento interno do sistema.",
      "Representacional, pois descreve a aparência visual das telas.",
      "Interação, pois define o fluxo de navegação do usuário pelo sistema.",
      "Conceitual, pois representa a ideia teórica por trás do sistema."
    ],

    answer: 2,

    feedback: "O modelo físico de ==def==interação== define o fluxo de uso — como o usuário navega e transita entre as partes do sistema. É diferente do operacional (funcionamento) e do representacional (visual)."
  },

  // ── Questão 23 ── Contextualizada
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
    tipo: "Contextualizada",

    texto: "Os tipos de interação definidos nos modelos conceituais descrevem as diferentes formas como o usuário pode se comunicar com o sistema. Na interação por instrução, o usuário emite comandos diretos — como cliques e atalhos de teclado. Na conversação, o sistema responde de forma mais natural, como em chats com IA. Na manipulação e navegação, o usuário age diretamente sobre os elementos da tela. Na exploração, o sistema guia o usuário pelo caminho.",

    question: "Um usuário interage com um assistente virtual digitando perguntas e recebendo respostas em linguagem natural. Que tipo de interação está sendo utilizado?",

    options: [
      "Instrução, pois o usuário emite comandos diretos ao sistema.",
      "Exploração, pois o sistema guia o usuário pelo conteúdo.",
      "Conversação, pois a interação ocorre em formato de diálogo natural.",
      "Manipulação, pois o usuário age diretamente sobre os elementos da tela."
    ],

    answer: 2,

    feedback: "A interação por ==def==conversação== envolve diálogo natural entre usuário e sistema — típico de assistentes virtuais e chatbots com IA."
  },

  // ── Questão 24 ── Contextualizada
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
    tipo: "Contextualizada",

    texto: "No Design Centrado no Usuário, o papel do designer vai muito além de criar telas bonitas. Ele precisa analisar o comportamento e o contexto de uso dos usuários, definir requisitos funcionais e não funcionais, considerar limitações técnicas e financeiras do projeto e planejar como a interação vai ocorrer. Sem esse entendimento amplo, corre-se o risco de criar um sistema visualmente atraente mas inutilizável na prática.",

    question: "Por que o designer, no DCU, precisa considerar as limitações técnicas e financeiras do projeto?",

    options: [
      "Para garantir que o sistema tenha a melhor aparência possível dentro do orçamento.",
      "Para que as decisões de design sejam viáveis de implementar na realidade do projeto.",
      "Para substituir o papel do gerente de projetos na definição de prazos.",
      "Para escolher a linguagem de programação mais adequada ao sistema."
    ],

    answer: 1,

    feedback: "No ==def==DCU==, o designer deve equilibrar as necessidades do usuário com as restrições reais do projeto. Ignorar limitações técnicas e financeiras gera soluções ideais no papel, mas inviáveis na prática."
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
    },
  {
    tipo: "Asserção + Justificativa",
    texto: "Uma equipe de design foi contratada para reformular o aplicativo de agendamento de consultas de uma rede de clínicas. Antes de iniciar qualquer desenvolvimento, os designers decidiram elaborar representações simples e sem cor, focando apenas na organização dos elementos de tela — botões, menus e campos — para discutir a estrutura com os stakeholders e validar o fluxo de navegação antes de comprometer recursos com o visual final.",
    question: "Analise as asserções a seguir e a relação proposta entre elas:",
    assertions: [
      "A representação descrita corresponde a um ==def==wireframe==, artefato de prototipação de baixa fidelidade que estrutura a interface sem se preocupar com elementos visuais como cores, imagens ou tipografia.",
      "[PORQUE] Protótipos de baixa fidelidade são utilizados nas fases iniciais do projeto por serem mais ágeis para construir e modificar, permitindo explorar um maior número de ideias antes que qualquer decisão de design visual seja tomada."
    ],
    options: [
      "As asserções I e II são verdadeiras, e II justifica I",
      "As asserções I e II são verdadeiras, mas II não justifica I",
      "A asserção I é verdadeira e a II é falsa",
      "A asserção I é falsa e a II é verdadeira"
    ],
    answer: 0,
    feedback: "Correto: A. O ==def==wireframe== é um protótipo de baixa fidelidade focado exclusivamente na estrutura — botões, menus e layout — sem elementos visuais (I). A asserção II justifica diretamente essa escolha: **protótipos de baixa fidelidade** permitem iteração rápida e exploração de mais ideias antes do refinamento visual, o que explica por que a equipe os usou nessa fase do projeto."
  },

  {
    tipo: "Asserção + Justificativa",
    texto: "Após validar a estrutura de navegação com wireframes, a equipe de design de um e-commerce avançou para a criação de um protótipo com cores, tipografia definida, imagens reais dos produtos e comportamentos de hover nos botões. O artefato era visualmente indistinguível do produto final e foi utilizado em testes com usuários reais para avaliar a experiência completa de compra.",
    question: "Analise as asserções a seguir e a relação proposta entre elas:",
    assertions: [
      "O artefato descrito é classificado como ==def==mockup== de alta fidelidade, pois reproduz com precisão a aparência visual do produto final, incluindo elementos estéticos e comportamentos de interface.",
      "[PORQUE] Protótipos de alta fidelidade são mais adequados para testes de usabilidade com usuários reais porque minimizam a abstração e permitem avaliar a experiência de interação em condições próximas ao uso real do sistema."
    ],
    options: [
      "As asserções I e II são verdadeiras, e II justifica I",
      "As asserções I e II são verdadeiras, mas II não justifica I",
      "A asserção I é verdadeira e a II é falsa",
      "A asserção I é falsa e a II é verdadeira"
    ],
    answer: 0,
    feedback: "Correto: A. O artefato descrito — com cores, tipografia, imagens e interações — é um ==def==mockup== de alta fidelidade (I). A asserção II justifica o uso desse tipo de protótipo em testes com usuários: quanto mais próximo do produto real, mais válidas são as reações e avaliações dos participantes — o que fundamenta diretamente a escolha descrita em I."
  },

  {
    tipo: "Asserção + Justificativa",
    texto: "Em um projeto de redesign de um portal universitário, a equipe optou por um protótipo horizontal para a primeira rodada de validação com usuários. O protótipo contemplava todas as seções do sistema — matrícula, biblioteca, financeiro, acadêmico e suporte — mas cada seção possuía apenas as telas iniciais, sem aprofundamento nos fluxos internos de cada funcionalidade.",
    question: "Analise as asserções a seguir e a relação proposta entre elas:",
    assertions: [
      "A escolha de um ==def==protótipo horizontal== é adequada para validar a abrangência do sistema com usuários, pois permite cobrir todas as áreas funcionais sem exigir o desenvolvimento detalhado de cada fluxo interno.",
      "[PORQUE] O protótipo horizontal sacrifica profundidade em favor da amplitude, sendo mais eficiente quando o objetivo é verificar se o sistema cobre as necessidades gerais dos usuários, antes de detalhar funcionalidades específicas."
    ],
    options: [
      "As asserções I e II são verdadeiras, e II justifica I",
      "As asserções I e II são verdadeiras, mas II não justifica I",
      "A asserção I é verdadeira e a II é falsa",
      "A asserção I é falsa e a II é verdadeira"
    ],
    answer: 0,
    feedback: "Correto: A. O ==def==protótipo horizontal== cobre muitas funções com pouco detalhamento, sendo ideal para validar a abrangência do sistema (I). A asserção II explica o princípio subjacente: **amplitude em detrimento da profundidade** — exatamente o trade-off que justifica essa escolha para uma validação inicial de escopo. As duas asserções são verdadeiras e II justifica I."
  },

  {
    tipo: "Múltiplas afirmativas",
    texto: "Uma equipe multidisciplinar responsável pelo redesign do aplicativo de mobilidade urbana de uma capital brasileira discutiu os fundamentos do Design Centrado no Usuário (DCU) antes de iniciar qualquer atividade de prototipação. O debate envolveu o papel do designer, os princípios norteadores da abordagem e a relação entre usabilidade, ergonomia e comunicabilidade no contexto do projeto.",
    question: "Avalie as afirmativas a seguir sobre os princípios e fundamentos do Design Centrado no Usuário:",
    assertions: [
      "O ==def==Design Centrado no Usuário== estabelece que o comportamento e o contexto do usuário devem ser analisados antes da definição de requisitos, garantindo que as decisões de design partam de necessidades reais e não de suposições da equipe.",
      "O princípio de intuitividade no DCU implica que o sistema deve poder ser utilizado sem necessidade de consulta a manuais ou treinamentos, reduzindo a curva de aprendizado para novos usuários.",
      "O papel do designer no DCU se limita à definição da aparência visual do sistema, cabendo às equipes de engenharia todas as decisões sobre funcionalidade, fluxo de interação e estrutura de navegação.",
      "A comunicabilidade, como princípio do DCU, refere-se à clareza com que o sistema transmite informações ao usuário, garantindo que mensagens, rótulos e feedbacks sejam compreendidos sem ambiguidade."
    ],
    questionContinuation: "São corretas apenas as afirmativas:",
    options: [
      "I, II e IV, apenas",
      "I e II, apenas",
      "II e IV, apenas",
      "I, II, III e IV"
    ],
    answer: 0,
    feedback: "Correto: A (I, II e IV). O DCU parte da análise do usuário (I), preza pela intuitividade sem manuais (II) e inclui comunicabilidade como clareza informacional (IV) — todas corretas. A afirmativa III está **errada**: o papel do designer no DCU é amplo, incluindo análise de comportamento, definição de requisitos, planejamento da interação e estrutura do sistema — não se restringe à aparência visual."
  },

  {
    tipo: "Múltiplas afirmativas",
    texto: "Durante a avaliação de usabilidade de um sistema de gestão escolar, a equipe classificou os problemas encontrados em três categorias distintas, conforme os conceitos estudados na disciplina. Os problemas identificados foram: (1) um botão de exclusão de registros posicionado próximo ao botão de salvar, causando exclusões acidentais frequentes; (2) um campo de busca que demorava 8 segundos para retornar resultados, tornando o processo lento; (3) uma mensagem de confirmação com linguagem técnica ambígua que gerava dúvidas nos usuários, mas não impedia a conclusão da tarefa.",
    question: "Avalie as afirmativas a seguir sobre a classificação dos problemas de usabilidade identificados:",
    assertions: [
      "O problema (1) — botão de exclusão próximo ao de salvar — deve ser classificado como ==warn==barreira==, pois a proximidade entre os botões provoca erros irreversíveis que frequentemente impedem o usuário de atingir seu objetivo.",
      "O problema (2) — lentidão de 8 segundos — deve ser classificado como obstáculo, pois dificulta a conclusão da tarefa sem impedi-la completamente, comprometendo a eficiência da interação.",
      "O problema (3) — mensagem ambígua — deve ser classificado como ruído, pois causa dúvida e confusão no usuário mas não impede nem dificulta gravemente a conclusão da tarefa.",
      "Os problemas (1), (2) e (3) são todos barreiras, pois qualquer problema de usabilidade que impacte negativamente a experiência do usuário deve ser classificado na categoria mais grave para garantir priorização na correção."
    ],
    questionContinuation: "São corretas apenas as afirmativas:",
    options: [
      "I, II e III, apenas",
      "I e II, apenas",
      "II e III, apenas",
      "I, II, III e IV"
    ],
    answer: 0,
    feedback: "Correto: A (I, II e III). As classificações estão corretas: ==warn==barreira== quando impede o objetivo (I), obstáculo quando dificulta sem impedir (II), e ruído quando causa dúvida sem bloquear a tarefa (III). A afirmativa IV está **errada**: os três tipos formam uma taxonomia graduada — classificar todos como barreiras ignora as distinções conceituais e prejudica a priorização adequada das correções."
  },

  {
    tipo: "Múltiplas afirmativas",
    texto: "Uma equipe de produto utilizou diferentes tipos de protótipos ao longo do desenvolvimento de um sistema de reservas hoteleiras. Na fase inicial, criaram narrativas textuais descrevendo o fluxo completo de reserva de um hóspede fictício. Em seguida, produziram representações visuais sequenciais mostrando cada passo da interação. Depois, partiram para estruturas básicas das telas sem elementos visuais. Por fim, desenvolveram interfaces completas com cores, fontes e imagens.",
    question: "Avalie as afirmativas a seguir sobre os tipos de protótipos utilizados pela equipe:",
    assertions: [
      "As narrativas textuais descrevendo o fluxo do usuário correspondem ao tipo ==def==cenário==, que relata passo a passo a interação entre usuário e sistema de forma descritiva.",
      "As representações visuais sequenciais correspondem ao storyboard, que transforma o cenário em uma sequência de imagens ou esboços representando cada momento da interação.",
      "As estruturas básicas das telas sem elementos visuais correspondem ao mockup, que é o artefato de mais alta fidelidade utilizado no processo de prototipação.",
      "As interfaces completas com cores, fontes e imagens correspondem ao mockup de alta fidelidade, que simula o produto final e é utilizado em fases avançadas de validação com usuários."
    ],
    questionContinuation: "São corretas apenas as afirmativas:",
    options: [
      "I, II e IV, apenas",
      "I e II, apenas",
      "III e IV, apenas",
      "I, II, III e IV"
    ],
    answer: 0,
    feedback: "Correto: A (I, II e IV). O ==def==cenário== é a narrativa textual (I), o storyboard é a versão visual sequencial (II), e o mockup de alta fidelidade representa o produto final com todos os elementos visuais (IV). A afirmativa III está **errada**: a estrutura básica sem elementos visuais corresponde ao **wireframe**, não ao mockup — o wireframe é um artefato de baixa fidelidade, enquanto o mockup é o de alta fidelidade."
  },

  {
    tipo: "Conceitual",
    texto: "Em uma sprint de design de um aplicativo de saúde mental, a equipe precisou decidir entre dois modelos de protótipo: um cobrindo todas as funcionalidades do sistema — cadastro, diário de humor, meditações guiadas, agenda de consultas e relatórios — com apenas as telas iniciais de cada módulo; e outro focando exclusivamente no módulo de diário de humor, com todos os fluxos detalhados, incluindo edição, histórico, análise gráfica e exportação de dados.",
    question: "Sobre as classificações por estrutura dos dois protótipos descritos, assinale a alternativa correta:",
    options: [
      "Ambos os protótipos são horizontais, pois os dois cobrem funcionalidades reais do sistema e foram desenvolvidos para validação com usuários.",
      "O primeiro protótipo é horizontal — abrange muitas funções com pouco detalhamento — e o segundo é vertical — cobre menos funções com alto nível de detalhamento interno.",
      "O primeiro protótipo é vertical por cobrir o sistema completo e o segundo é horizontal por se aprofundar em uma única funcionalidade.",
      "A classificação horizontal e vertical refere-se apenas à fidelidade visual dos protótipos, sendo irrelevante para a análise da abrangência funcional."
    ],
    answer: 1,
    feedback: "Correto: B. O protótipo que cobre todas as funcionalidades com pouco detalhamento é chamado de **horizontal** — amplo em abrangência, raso em profundidade. O que se aprofunda em uma única funcionalidade com todos os seus fluxos é chamado de ==def==vertical== — estreito em escopo, profundo em detalhamento. A alternativa A erra ao classificar ambos como horizontais. A C inverte as definições. A D confunde classificação por estrutura com fidelidade visual."
  },

  {
    tipo: "Conceitual",
    texto: "A diretora de produto de uma startup de educação financeira apresentou ao conselho três modelos conceituais de interação possíveis para o novo aplicativo: no primeiro, os usuários emitiriam comandos por voz ou texto para executar ações; no segundo, interagiriam em tempo real com um assistente de inteligência artificial que responderia perguntas e ofereceria orientações personalizadas; no terceiro, navegariam por menus e visualizariam seus dados financeiros diretamente manipulando gráficos e categorias.",
    question: "Com base nos tipos de interação definidos nos modelos conceituais, assinale a alternativa que classifica corretamente as três abordagens descritas:",
    options: [
      "O primeiro é conversação; o segundo é instrução; o terceiro é exploração/pesquisa.",
      "O primeiro é instrução; o segundo é conversação; o terceiro é manipulação/navegação.",
      "O primeiro é manipulação/navegação; o segundo é instrução; o terceiro é conversação.",
      "Os três modelos são variações do tipo exploração/pesquisa, pois todos permitem que o usuário interaja com informações financeiras do sistema."
    ],
    answer: 1,
    feedback: "Correto: B. O primeiro modelo — comandos de voz ou texto para executar ações — é o tipo **instrução**. O segundo — interação com IA respondendo perguntas em tempo real — é o tipo ==def==conversação==. O terceiro — navegação por menus e manipulação direta de gráficos — é o tipo **manipulação/navegação**. A alternativa A inverte instrução e conversação. A C classifica incorretamente os três tipos. A D generaliza indevidamente todos como exploração."
  },

  {
    tipo: "Conceitual",
    texto: "Em uma reunião de planejamento, o gerente de produto de uma plataforma de RH afirmou que os modelos físicos são desnecessários, já que os modelos conceituais descrevem com precisão como o sistema deve funcionar. Um desenvolvedor sênior discordou, argumentando que modelo conceitual e modelo físico têm propósitos complementares e nenhum substitui o outro. A discussão revelou uma confusão sobre as definições e papéis de cada tipo de modelo.",
    question: "Sobre a distinção entre modelos conceituais e modelos físicos no contexto do design de interfaces, assinale a alternativa correta:",
    options: [
      "Modelos conceituais e físicos são equivalentes e intercambiáveis — ambos descrevem como o sistema deve ser implementado tecnicamente, diferindo apenas no nível de abstração utilizado.",
      "O modelo conceitual representa como o sistema funciona na teoria, utilizando diagramas e metáforas do mundo real, enquanto o modelo físico transforma essa visão em elementos concretos como aparência, fluxo e operação.",
      "O modelo físico é sempre desenvolvido antes do conceitual, pois as decisões de implementação técnica devem preceder as escolhas de design e interação para garantir viabilidade.",
      "O modelo conceitual é utilizado exclusivamente por desenvolvedores para definir arquitetura de software, enquanto o modelo físico é o único instrumento de trabalho dos designers de interface."
    ],
    answer: 1,
    feedback: "Correto: B. O ==def==modelo conceitual== representa o sistema na teoria — como ele funciona, suas funções e conexões, usando diagramas e metáforas. O modelo físico transforma essa abstração em algo concreto: aparência visual (representacional), funcionamento (operacional) e fluxo de uso (interação). As alternativas A e D distorcem os papéis. A alternativa C inverte a sequência natural — o conceitual precede o físico no processo de design."
  },

  {
    tipo: "Análise aplicada",
    texto: "Uma equipe de UX foi contratada para redesenhar o sistema de prontuário eletrônico de um hospital público. No levantamento inicial, identificaram que médicos experientes completavam todas as tarefas com sucesso, mas precisavam de 30% mais tempo que em sistemas similares. Já os médicos recém-formados frequentemente iniciavam preenchimentos e os abandonavam no meio por não entenderem o fluxo. Por fim, médicos com deficiência visual relatavam impossibilidade de uso por ausência de suporte a leitores de tela.",
    question: "Com base na classificação de problemas de usabilidade por tipo de usuário e na categorização dos problemas encontrados, avalie as afirmativas a seguir:",
    assertions: [
      "O problema dos médicos experientes — conclusão com 30% mais tempo — configura um ==warn==obstáculo== para usuários especialistas, pois dificulta a eficiência sem impedir a conclusão das tarefas.",
      "O problema dos médicos recém-formados — abandono do preenchimento — configura uma barreira para usuários iniciantes, pois impede efetivamente a conclusão da tarefa.",
      "O problema dos médicos com deficiência visual — impossibilidade de uso — é classificado como ruído de acessibilidade, pois causa confusão mas não bloqueia completamente o uso do sistema.",
      "Os três problemas identificados requerem estratégias de correção distintas: obstáculos demandam otimização de fluxo; barreiras exigem reestruturação funcional; e problemas de acessibilidade requerem implementação de suporte a tecnologias assistivas."
    ],
    questionContinuation: "São corretas apenas as afirmativas:",
    options: [
      "I, II e IV, apenas",
      "I e IV, apenas",
      "II e III, apenas",
      "I, II, III e IV"
    ],
    answer: 0,
    feedback: "Correto: A (I, II e IV). O excesso de tempo para especialistas é um ==warn==obstáculo== — dificulta sem impedir (I). O abandono por iniciantes é uma barreira — impede a conclusão (II). Estratégias distintas para cada tipo são adequadas (IV). A afirmativa III está **errada**: a impossibilidade de uso por deficiência visual é uma **barreira**, não um ruído — o sistema é completamente inutilizável para esse perfil, o que corresponde à categoria mais grave de problema."
  },

  {
    tipo: "Análise aplicada",
    texto: "Uma consultoria foi contratada para desenvolver um aplicativo de gestão de resíduos para um município. O projeto tinha prazo de 18 meses e envolvia três grupos de usuários com perfis muito distintos: agentes de coleta (baixa familiaridade com tecnologia), fiscais ambientais (usuários técnicos) e gestores municipais (foco em relatórios e indicadores). A equipe debateu a sequência metodológica mais adequada: iniciar com prototipação de baixa fidelidade, validar com usuários, refinar e então avançar para alta fidelidade.",
    question: "Com base nos conceitos de prototipação e design centrado no usuário, avalie as afirmativas a seguir sobre a abordagem adotada:",
    assertions: [
      "Iniciar com protótipos de ==def==baixa fidelidade== é tecnicamente adequado para esse contexto porque permite explorar um maior volume de ideias e alternativas de design antes de comprometer recursos com elementos visuais detalhados.",
      "A presença de três perfis distintos de usuários reforça a necessidade de validar os protótipos com representantes de cada grupo, pois barreiras e obstáculos de usabilidade tendem a variar significativamente conforme o nível de familiaridade com tecnologia.",
      "A validação com usuários só deve ocorrer após a conclusão do mockup de alta fidelidade, pois protótipos simples não fornecem informações úteis para decisões de design em projetos complexos.",
      "A progressão de baixa para alta fidelidade seguida de validação iterativa corresponde a uma abordagem centrada no usuário que reduz retrabalho e aumenta a aderência do produto final às necessidades reais dos diferentes perfis."
    ],
    questionContinuation: "São corretas apenas as afirmativas:",
    options: [
      "I, II e IV, apenas",
      "I e II, apenas",
      "III e IV, apenas",
      "I, II, III e IV"
    ],
    answer: 0,
    feedback: "Correto: A (I, II e IV). Iniciar com ==def==baixa fidelidade== permite explorar mais ideias com menos custo (I). Validar com múltiplos perfis é essencial dado o gap de familiaridade tecnológica entre os grupos (II). A progressão iterativa é a abordagem DCU adequada para o contexto (IV). A afirmativa III está **errada**: protótipos de baixa fidelidade são ferramentas valiosas exatamente em fases iniciais de projetos complexos — postegar a validação até o mockup final aumenta o custo de correção de erros estruturais."
  },

  {
    tipo: "Análise aplicada",
    texto: "Uma equipe de design recebeu o briefing para criar um novo sistema de gestão de frotas para uma empresa de logística. Antes de qualquer prototipação, o líder de design propôs construir modelos conceituais e físicos do sistema. Foram elaborados: (1) diagramas de caso de uso e de sequência descrevendo as funções do sistema; (2) esboços da aparência das telas principais; (3) representações do fluxo de navegação entre módulos. Em seguida, a equipe produziu um storyboard mostrando um motorista recebendo uma rota, registrando paradas e encerrando o turno.",
    question: "Com base nos conceitos de modelagem e prototipação, avalie as afirmativas a seguir sobre as atividades descritas:",
    assertions: [
      "Os diagramas de caso de uso e sequência (1) são instrumentos do ==def==modelo conceitual==, pois representam as funções e conexões do sistema de forma abstrata, antes de qualquer decisão de aparência ou interação.",
      "Os esboços de aparência (2) e as representações de fluxo (3) compõem o modelo físico do sistema, sendo respectivamente os subtipos representacional e de interação.",
      "O storyboard produzido é um protótipo de alta fidelidade porque apresenta sequência visual detalhada e representa com precisão o produto final que será entregue aos motoristas.",
      "A sequência adotada pela equipe — modelo conceitual, modelo físico e então storyboard — é coerente com o princípio de que a modelagem deve preceder a prototipação, garantindo que as representações visuais estejam fundamentadas em uma visão funcional clara do sistema."
    ],
    questionContinuation: "São corretas apenas as afirmativas:",
    options: [
      "I, II e IV, apenas",
      "I e IV, apenas",
      "II e III, apenas",
      "I, II, III e IV"
    ],
    answer: 0,
    feedback: "Correto: A (I, II e IV). Os diagramas UML pertencem ao ==def==modelo conceitual== (I). Os esboços de aparência e fluxo de navegação compõem o modelo físico representacional e de interação, respectivamente (II). A sequência modelagem → prototipação é o fluxo correto no DCU (IV). A afirmativa III está **errada**: o storyboard é um protótipo de **baixa fidelidade** — é uma representação visual narrativa e simplificada, não uma simulação do produto final, que corresponderia ao mockup de alta fidelidade."
  },

  

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
  },
  {
    tipo: "Curta",
    texto: "Sobre os objetivos da prototipação no processo de design.",
    question: "Qual é o principal propósito de criar um protótipo antes de implementar o sistema final?",
    options: [
      "Substituir a documentação técnica do projeto",
      "Testar ideias e identificar problemas antes do desenvolvimento",
      "Definir o banco de dados relacional da aplicação",
      "Gerar o código-fonte da interface automaticamente"
    ],
    answer: 1,
    feedback: "A prototipação permite testar ideias, identificar problemas e economizar tempo e custo antes da implementação final, melhorando a experiência do usuário."
  },
  {
    tipo: "Direta",
    texto: "Sobre as classificações de protótipos por fidelidade.",
    question: "Qual afirmação descreve corretamente a diferença entre protótipos de baixa e alta fidelidade?",
    options: [
      "Baixa fidelidade é mais detalhado; alta fidelidade é mais simples",
      "Ambos possuem o mesmo nível de detalhe visual",
      "Baixa fidelidade gera mais ideias; alta fidelidade foca em detalhes próximos do produto final",
      "Alta fidelidade é usada apenas na fase de análise de requisitos"
    ],
    answer: 2,
    feedback: "Protótipos de baixa fidelidade são rascunhos simples que estimulam a geração de ideias, enquanto os de alta fidelidade são detalhados e próximos do produto final."
  },
  {
    tipo: "Contexto",
    texto: "Uma equipe de design criou um esboço em papel com a disposição dos botões, menus e campos de formulário de um aplicativo, sem qualquer cor ou imagem.",
    question: "Que tipo de artefato de prototipação está sendo descrito?",
    options: [
      "Mockup",
      "Storyboard",
      "Wireframe",
      "Cenário"
    ],
    answer: 2,
    feedback: "O wireframe é o 'esqueleto' da interface: representa estrutura, layout e posicionamento dos elementos sem detalhes visuais como cores ou imagens."
  },
  {
    tipo: "Direta",
    texto: "Sobre os tipos de protótipos estudados na disciplina.",
    question: "Qual tipo de protótipo utiliza narrativa textual para descrever, passo a passo, como o usuário interage com o sistema?",
    options: [
      "Wireframe",
      "Cenário",
      "Mockup",
      "Modelo conceitual"
    ],
    answer: 1,
    feedback: "Cenários são narrativas de uso que descrevem o passo a passo da interação entre o usuário e o sistema, como o exemplo do caixa eletrônico."
  },
  {
    tipo: "Aplicação",
    texto: "Um designer precisa apresentar ao cliente uma versão da interface com cores reais, tipografia definida e imagens no lugar, simulando o produto final antes do desenvolvimento.",
    question: "Qual tipo de artefato o designer deve entregar nesse caso?",
    options: [
      "Wireframe horizontal",
      "Cenário de uso",
      "Storyboard",
      "Mockup"
    ],
    answer: 3,
    feedback: "O mockup é a representação visual detalhada da interface, com cores, imagens e tipografia, sendo classificado como protótipo de alta fidelidade."
  },
  {
    tipo: "Contexto",
    texto: "Em um sistema bancário, foram prototipadas todas as funcionalidades principais (sacar, transferir, pagar), porém nenhuma delas foi detalhada em profundidade.",
    question: "Qual classificação de protótipo por estrutura descreve essa abordagem?",
    options: [
      "Protótipo vertical, pois cobre muitas funções",
      "Protótipo horizontal, pois cobre muitas funções com pouco detalhamento",
      "Protótipo de baixa fidelidade, pois não tem cores",
      "Protótipo vertical, pois não detalha nenhuma função"
    ],
    answer: 1,
    feedback: "O protótipo horizontal cobre muitas funcionalidades com pouco nível de detalhe, oferecendo uma visão ampla do sistema sem aprofundamento."
  },
  {
    tipo: "Curta",
    texto: "Sobre os tipos de interação definidos pelos modelos conceituais.",
    question: "Qual tipo de interação é caracterizado pelo uso de comandos como cliques, teclado ou voz para operar o sistema?",
    options: [
      "Exploração",
      "Conversação",
      "Instrução",
      "Manipulação"
    ],
    answer: 2,
    feedback: "O tipo instrução envolve o usuário emitindo comandos diretos ao sistema, como cliques em botões, atalhos de teclado ou comandos de voz."
  },
  {
    tipo: "Direta",
    texto: "Sobre os problemas de usabilidade e sua classificação.",
    question: "Qual tipo de problema de usabilidade impede completamente o usuário de concluir sua tarefa?",
    options: [
      "Ruído",
      "Obstáculo",
      "Barreira",
      "Problema secundário"
    ],
    answer: 2,
    feedback: "Barreiras são problemas que impedem totalmente a realização da tarefa. Obstáculos dificultam mas permitem conclusão, enquanto ruídos causam dúvida ou confusão."
  },
  {
    tipo: "Aplicação",
    texto: "Um usuário experiente relata que determinado recurso do sistema é confuso apenas para quem está usando pela primeira vez, mas não causa problema para usuários habituados.",
    question: "Como esse problema de usabilidade seria classificado quanto ao perfil de usuário afetado?",
    options: [
      "Problema geral, pois afeta qualquer usuário",
      "Problema de acessibilidade, pois envolve limitações físicas",
      "Problema para usuário iniciante, pois afeta apenas quem não tem experiência",
      "Problema para especialista, pois exige conhecimento avançado para percebê-lo"
    ],
    answer: 2,
    feedback: "Os problemas de usabilidade podem ser classificados por perfil de usuário. Um problema que afeta apenas iniciantes é categorizado como problema para usuário iniciante."
  },
  {
    tipo: "Contexto",
    texto: "Uma equipe utilizou diagramas UML e metáforas do mundo real para representar como o sistema de agendamento funcionaria antes de qualquer linha de código ser escrita.",
    question: "Que tipo de modelo está sendo produzido nessa atividade?",
    options: [
      "Modelo físico representacional",
      "Modelo conceitual",
      "Wireframe de alta fidelidade",
      "Modelo físico operacional"
    ],
    answer: 1,
    feedback: "O modelo conceitual representa como o sistema funciona na teoria, utilizando diagramas, UML e metáforas do mundo real para facilitar o entendimento antes da implementação."
  },
  {
    tipo: "Curta",
    texto: "Sobre os princípios do Design Centrado no Usuário (DCU).",
    question: "Qual princípio do DCU está relacionado à capacidade do usuário de operar o sistema sem consultar um manual?",
    options: [
      "Ergonomia",
      "Comunicabilidade",
      "Intuitividade",
      "Usabilidade"
    ],
    answer: 2,
    feedback: "Intuitividade refere-se à capacidade do sistema de ser utilizado sem necessidade de instrução prévia, ou seja, o usuário consegue operar o sistema de forma natural."
  },
  {
    tipo: "Aplicação",
    texto: "Um designer optou por detalhar apenas o módulo de pagamento de um e-commerce, mapeando cada tela, validação e mensagem de erro com alta precisão, deixando as demais áreas sem protótipo.",
    question: "Qual classificação de protótipo por estrutura descreve essa escolha?",
    options: [
      "Protótipo horizontal, pois cobre poucas funções",
      "Protótipo vertical, pois foca em poucas funções com alto nível de detalhe",
      "Protótipo de baixa fidelidade, pois não cobre todo o sistema",
      "Protótipo horizontal de alta fidelidade"
    ],
    answer: 1,
    feedback: "O protótipo vertical aprofunda poucas funcionalidades com alto nível de detalhamento, sendo útil para validar fluxos críticos do sistema antes da implementação."
  },

  ]

};