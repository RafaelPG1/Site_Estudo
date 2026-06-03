// ============================================================
// NEXUS STUDY — quiz/conteudo/2026/AP2/design.js
// ============================================================
window.questoes = {

  // ── Questões Práticas ──────────────────────────────────────
  questoes: [

    // Aula 9 - Prototipagem e Norma ISO 9241

    // Questão 1
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
    // Questão 2
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
    // Questão 3
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
    // Questão 4
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
    // Questão 5
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
    // Questão 6
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
    // Questão 7
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
    // Questão 8
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
    // Questão 9
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
    // Questão 10
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

    //  Aula 10 - Design de Interfaces e Prototipação

    // Questão 11
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

    // Questão 12
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

    // Questão 13
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

    // Questão 14
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

    // Questão 15
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

    // Questão 16
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

    // Questão 17
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

    // Questão 18
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

    // Questão 19
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

    // Questão 20
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

    // Aula 11 - Design Responsivo

    // Questão 21
    {
      aula: "Aula 11 - Design Responsivo",
      tipo: "Explicativa",
      texto: "As media queries são um recurso do CSS3 que permitem aplicar regras de estilo diferentes dependendo do tamanho da tela do usuário. Por exemplo, você pode definir que um elemento ocupe 100% da largura em celulares e apenas 50% em tablets, tudo dentro do mesmo arquivo CSS.",
      question: "Qual é a principal função das media queries no CSS3?",
      options: [
        "Criar animações automáticas para dispositivos móveis",
        "Aplicar estilos diferentes de acordo com o tamanho da tela",
        "Definir a velocidade de carregamento da página",
        "Controlar o número de fontes externas carregadas"
      ],
      answer: 1,
      feedback: "Media queries permitem aplicar regras CSS condicionais, adaptando o layout conforme a resolução ou tamanho da tela do dispositivo."
    },

    // Questão 22
    {
      aula: "Aula 11 - Design Responsivo",
      tipo: "Contextualizada",
      texto: "Quando um site não possui a meta tag viewport configurada, navegadores móveis costumam 'fingir' que a tela é mais larga do que realmente é, encolhendo o conteúdo para caber. A tag correta — com width=device-width e initial-scale=1 — instrui o navegador a usar a largura real do dispositivo e não aplicar zoom automático, garantindo que o layout responsivo funcione como esperado.",
      question: "Por que a meta tag viewport é indispensável para o funcionamento do design responsivo em dispositivos móveis?",
      options: [
        "Ela define o tamanho mínimo das fontes na página",
        "Ela impede que folhas de estilo externas sejam carregadas",
        "Ela garante que o navegador use a largura real do dispositivo sem aplicar zoom automático",
        "Ela ativa automaticamente as media queries no CSS"
      ],
      answer: 2,
      feedback: "Sem a meta tag viewport, o navegador móvel pode distorcer o layout, ignorando as regras responsivas definidas no CSS."
    },

    // Questão 23
    {
      aula: "Aula 11 - Design Responsivo",
      tipo: "Aplicação",
      texto: "Imagine que você está desenvolvendo um blog e quer que o conteúdo principal sempre ocupe 75% da tela, independente se o usuário acessa pelo celular ou pelo computador. Para isso, em vez de definir uma largura fixa em pixels, você usa porcentagem. Assim, o elemento se adapta proporcionalmente a qualquer resolução.",
      question: "Qual prática representa o conceito de layout fluido em CSS?",
      options: [
        "Definir width: 960px para todos os elementos",
        "Usar width: 75% para que o elemento se ajuste proporcionalmente à tela",
        "Aplicar display: none em telas pequenas",
        "Configurar height: 100vh em todos os containers"
      ],
      answer: 1,
      feedback: "O ==def==layout fluido== usa medidas relativas como porcentagem, fazendo com que os elementos se redimensionem automaticamente conforme a tela."
    },

    // Questão 24
    {
      aula: "Aula 11 - Design Responsivo",
      tipo: "Explicativa",
      texto: "A metodologia Mobile First propõe que o desenvolvimento comece pelo layout para dispositivos móveis e, progressivamente, expanda-se para telas maiores. Essa abordagem força o desenvolvedor a priorizar o conteúdo essencial, resultando em interfaces mais limpas e com melhor desempenho.",
      question: "Qual é o ponto de partida da metodologia Mobile First?",
      options: [
        "Criar o layout para desktop e depois adaptar para telas menores",
        "Criar o layout para dispositivos móveis e expandir progressivamente para telas maiores",
        "Desenvolver versões separadas do site para cada tipo de dispositivo",
        "Iniciar pelo tablet como resolução intermediária"
      ],
      answer: 1,
      feedback: "Mobile First começa pelos dispositivos menores, garantindo foco no essencial e melhor desempenho, depois expande para telas maiores com media queries de min-width."
    },

    // Questão 25
    {
      aula: "Aula 11 - Design Responsivo",
      tipo: "Explicativa",
      texto: "Breakpoints são os pontos de 'quebra' do layout — resolucões específicas onde o design muda de comportamento. Por exemplo, abaixo de 480px o site exibe uma coluna, entre 480px e 768px passa para duas colunas, e acima disso exibe três. Eles são definidos diretamente dentro das media queries no CSS.",
      question: "O que são breakpoints no contexto do design responsivo?",
      options: [
        "Erros que ocorrem quando o site não carrega corretamente no mobile",
        "Resoluções específicas onde o layout muda de comportamento",
        "Propriedades CSS que definem a velocidade das animações",
        "Arquivos separados de CSS para cada tipo de dispositivo"
      ],
      answer: 1,
      feedback: "Breakpoints definem os pontos de transição do layout, sendo configurados via media queries para ajustar o design em diferentes faixas de resolução."
    },

    // Questão 26
    {
      aula: "Aula 11 - Design Responsivo",
      tipo: "Contextualizada",
      texto: "No design responsivo, as medidas relativas têm papel central. O uso de porcentagem (%) para larguras e de em para tamanhos de fonte garante que os elementos se comportem de forma proporcional ao contexto em que estão inseridos. Em contrapartida, medidas absolutas como px, cm ou mm travam o layout em um tamanho fixo, dificultando a adaptação a diferentes telas.",
      question: "Quais tipos de medidas são recomendados no design responsivo para garantir a adaptação do layout?",
      options: [
        "px e cm, por oferecerem precisão visual",
        "pt e mm, usados em impressão",
        "% e em, por serem relativas ao contexto da tela",
        "vh e px, pois funcionam em todos os navegadores"
      ],
      answer: 2,
      feedback: "Medidas relativas como % e em permitem que o layout se adapte proporcionalmente, enquanto medidas fixas como px impedem essa flexibilidade."
    },

    // Questão 27
    {
      aula: "Aula 11 - Design Responsivo",
      tipo: "Aplicação",
      texto: "Um grid responsivo adapta o número de colunas conforme a tela do usuário. Em telas pequenas, como celulares, o conteúdo é empilhado em uma única coluna para facilitar a leitura. Em tablets, passa para duas colunas. Em desktops, três ou mais colunas podem ser exibidas simultaneamente, aproveitando o espaço disponível.",
      question: "Como um grid responsivo típico se comporta conforme o tamanho da tela aumenta?",
      options: [
        "Reduz o número de colunas para priorizar o conteúdo principal",
        "Mantém sempre o mesmo número de colunas independente da tela",
        "Aumenta o número de colunas conforme a tela fica maior",
        "Remove colunas apenas em telas de desktop"
      ],
      answer: 2,
      feedback: "O grid responsivo aumenta o número de colunas progressivamente: 1 no mobile, 2 no tablet e 3 ou mais no desktop, aproveitando o espaço de cada dispositivo."
    },

    // Questão 28
    {
      aula: "Aula 11 - Design Responsivo",
      tipo: "Contextualizada",
      texto: "A navegação de um site também precisa ser adaptada conforme o dispositivo. Em desktops, um menu horizontal com todos os itens visíveis é a solução mais comum. Já em celulares, exibir todos esses itens ocuparia boa parte da tela, por isso utiliza-se o menu hambúrguer — um ícone que, ao ser clicado, revela as opções de navegação.",
      question: "Qual é a principal razão para usar o menu hambúrguer em dispositivos móveis?",
      options: [
        "Por ser mais bonito visualmente do que o menu horizontal",
        "Para economizar espaço na tela, exibindo os itens apenas quando necessário",
        "Porque dispositivos móveis não suportam menus horizontais",
        "Para aumentar a velocidade de carregamento do site"
      ],
      answer: 1,
      feedback: "O menu hambúrguer economiza espaço na tela do mobile, exibindo os itens de navegação apenas sob demanda — uma adaptação essencial da interface responsiva."
    },

    // Questão 29
    {
      aula: "Aula 11 - Design Responsivo",
      tipo: "Explicativa",
      texto: "Nas media queries, dois operadores são amplamente usados: max-width e min-width. O max-width aplica estilos até um determinado tamanho de tela — ideal para a abordagem Desktop First. Já o min-width aplica estilos a partir de um tamanho mínimo, sendo a escolha natural para quem adota Mobile First, onde o design parte do menor para o maior.",
      question: "Qual operador de media query é mais adequado para uma abordagem Mobile First?",
      options: [
        "max-width, pois limita o estilo a telas pequenas",
        "min-width, pois aplica estilos a partir de um tamanho mínimo de tela",
        "max-height, pois controla a altura máxima do dispositivo",
        "min-height, pois garante que o layout nunca fique comprimido"
      ],
      answer: 1,
      feedback: "No Mobile First, usa-se ==rule==min-width== para expandir o layout progressivamente: os estilos base valem para telas pequenas, e as media queries adicionam regras para telas maiores."
    },

    // Questão 30
    {
      aula: "Aula 11 - Design Responsivo",
      tipo: "Contextualizada",
      texto: "Ao construir um layout responsivo, algumas boas práticas fazem toda a diferença. Evitar excesso de media queries simplifica a manutenção do código. Usar medidas relativas reduz dependências de tamanho fixo. Sempre incluir a meta tag viewport garante que as regras CSS sejam respeitadas no mobile. Juntos, esses cuidados resultam em um site mais robusto e fácil de manter.",
      question: "Qual conjunto de práticas representa uma abordagem correta no desenvolvimento de layouts responsivos?",
      options: [
        "Usar px em todos os elementos, muitas media queries e omitir a meta tag viewport",
        "Usar medidas relativas, limitar media queries ao necessário e incluir a meta tag viewport",
        "Criar arquivos CSS separados para cada resolução e usar cm para fontes",
        "Aplicar width fixo no body e compensar com zoom via JavaScript"
      ],
      answer: 1,
      feedback: "Boas práticas responsivas combinam medidas relativas, uso consciente de media queries e a presença obrigatória da meta tag viewport para garantir um layout funcional e mantível."
    },

    // Aula 12 - CSS e HTML Comandos Básicos

    // Questão 31
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Explicativa",
      texto: "O HTML5 possui uma estrutura padrão que todo documento deve seguir. Ela é composta por quatro elementos principais: o <!DOCTYPE html>, que informa ao navegador qual versão do HTML está sendo usada; o <html>, que é o elemento raiz; o <head>, que guarda configurações e metadados; e o <body>, que contém tudo que o usuário visualiza na página.",
      question: "Qual parte da estrutura HTML5 é responsável por armazenar o conteúdo visível da página, como textos, imagens e tabelas?",
      options: [
        "<head>",
        "<meta>",
        "<body>",
        "<!DOCTYPE html>"
      ],
      answer: 2,
      feedback: "O ==ddl==<body>== é a área visível ao usuário. Tudo que aparece na tela — textos, imagens, menus e tabelas — fica dentro dele."
    },

    // Questão 32
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Explicativa",
      texto: "Antes de qualquer tag HTML, é comum encontrar a declaração <!DOCTYPE html> no início do documento. Ela não é uma tag HTML comum, mas sim uma instrução especial que informa ao navegador que o documento segue o padrão HTML5. Sem ela, alguns navegadores podem interpretar a página de forma incorreta.",
      question: "Qual é a função do <!DOCTYPE html> em um documento HTML5?",
      options: [
        "Definir o título da página no navegador",
        "Informar ao navegador que o documento usa o padrão HTML5",
        "Conectar o arquivo CSS ao documento",
        "Criar o elemento raiz da página"
      ],
      answer: 1,
      feedback: "O <!DOCTYPE html> não é uma tag, mas uma declaração que indica a versão do HTML utilizada, garantindo que o navegador interprete a página corretamente."
    },

    // Questão 33
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Contextualizada",
      texto: "No HTML, os títulos são representados pelas tags <h1> até <h6>. Elas formam uma hierarquia: o <h1> representa o título de maior importância da página, geralmente o título principal, enquanto o <h6> representa o título de menor relevância. Essa hierarquia não é apenas visual — ela também ajuda buscadores e leitores de tela a entenderem a organização do conteúdo.",
      question: "Em uma página HTML bem estruturada, qual tag deve ser usada para o título principal, de maior importância?",
      options: [
        "<h6>",
        "<h3>",
        "<p>",
        "<h1>"
      ],
      answer: 3,
      feedback: "O ==ddl==<h1>== representa o título de maior importância na hierarquia HTML. Ele deve ser usado para o conteúdo mais relevante da página."
    },

    // Questão 34
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Explicativa",
      texto: "O HTML oferece dois tipos de listas: a lista não ordenada, criada com a tag <ul>, que exibe itens com marcadores visuais; e a lista ordenada, criada com <ol>, que numera os itens automaticamente. Em ambos os casos, cada item da lista é definido pela tag <li>.",
      question: "Qual tag HTML deve ser usada quando se deseja criar uma lista com numeração automática nos itens?",
      options: [
        "<ul>",
        "<li>",
        "<ol>",
        "<dl>"
      ],
      answer: 2,
      feedback: "A tag <ol> (ordered list) cria listas com numeração automática. Já a <ul> usa marcadores visuais sem numeração."
    },

    // Questão 35
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Aplicação",
      texto: "Para inserir uma imagem em uma página HTML, utiliza-se a tag <img>. Ela precisa do atributo src, que indica o caminho até o arquivo de imagem — seja uma pasta local ou um endereço da internet. Sem o src, o navegador não sabe qual imagem exibir. Por exemplo: <img src='assets/img/foto.jpg'> busca a imagem dentro da pasta assets/img do projeto.",
      question: "Um desenvolvedor quer exibir uma imagem chamada 'logo.png' localizada na pasta 'imagens'. Qual código HTML representa essa inserção corretamente?",
      options: [
        "<image href='imagens/logo.png'>",
        "<img src='imagens/logo.png'>",
        "<img link='imagens/logo.png'>",
        "<picture src='imagens/logo.png'>"
      ],
      answer: 1,
      feedback: "A tag correta é <img> com o atributo src apontando para o caminho do arquivo. O atributo href pertence a links, não a imagens."
    },

    // Questão 36
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Contextualizada",
      texto: "Tabelas no HTML são criadas com um conjunto de tags específicas. A tag <table> inicia a tabela. Dentro dela, usa-se <thead> para o cabeçalho e <tbody> para o corpo. As linhas são definidas por <tr>, os títulos de coluna por <th> e as células comuns por <td>. Cada tag tem um papel bem definido para manter a tabela organizada e semântica.",
      question: "Em uma tabela HTML, qual tag é usada para representar uma célula comum de dados, diferente do título de coluna?",
      options: [
        "<th>",
        "<tr>",
        "<tbody>",
        "<td>"
      ],
      answer: 3,
      feedback: "A tag ==ddl==<td>== (table data) representa uma célula comum na tabela. Já o <th> é usado para títulos de coluna, com destaque visual automático."
    },

    // Questão 37
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Explicativa",
      texto: "O CSS (Cascading Style Sheets) é a linguagem responsável por estilizar páginas HTML. Enquanto o HTML define a estrutura e o conteúdo, o CSS cuida da aparência: cores, fontes, espaçamentos, bordas e layout. Manter os dois separados traz vantagens práticas: o mesmo estilo pode ser aplicado a várias páginas, e qualquer alteração visual é feita em um único arquivo.",
      question: "Qual é a principal vantagem de usar CSS em um arquivo externo separado do HTML?",
      options: [
        "Permite criar tags HTML personalizadas",
        "Faz o site carregar mais imagens ao mesmo tempo",
        "Possibilita reutilizar estilos em várias páginas com um único arquivo",
        "Substitui a necessidade de usar a tag <body>"
      ],
      answer: 2,
      feedback: "O CSS externo centraliza os estilos em um único arquivo, permitindo reutilização e facilitando manutenção. Alterar a aparência de todo o site exige mudança em apenas um lugar."
    },

    // Questão 38
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Aplicação",
      texto: "No CSS, padding e margin são duas propriedades de espaçamento com funções distintas. O padding define o espaço interno de um elemento — entre o conteúdo e sua borda. Já a margin define o espaço externo — entre o elemento e os outros ao redor. Confundir os dois é um erro comum: padding 'empurra por dentro', margin 'afasta por fora'.",
      question: "Um desenvolvedor quer dar espaço entre um botão e os outros elementos da página, sem aumentar o espaço interno do botão. Qual propriedade CSS deve usar?",
      options: [
        "padding",
        "border",
        "margin",
        "width"
      ],
      answer: 2,
      feedback: "A ==key==margin== controla o espaço externo ao elemento. Para afastar um elemento dos vizinhos sem alterar seu espaço interno, ela é a propriedade correta."
    },

    // Questão 39
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Contextualizada",
      texto: "O display: flex é uma propriedade CSS moderna usada para organizar elementos de forma flexível e horizontal. Quando aplicada a um container, ela faz com que seus filhos se alinhem lado a lado automaticamente, o que é especialmente útil para criar menus horizontais e layouts responsivos. É um recurso muito presente em projetos web atuais.",
      question: "Para criar um menu horizontal onde os itens ficam alinhados lado a lado, qual propriedade CSS é mais indicada?",
      options: [
        "float: left",
        "display: flex",
        "margin: auto",
        "border-radius"
      ],
      answer: 1,
      feedback: "O ==dml==display: flex== organiza os elementos filhos horizontalmente de forma flexível, sendo ideal para menus e layouts modernos."
    },

    // Questão 40
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Aplicação",
      texto: "A Web Semântica propõe que o conteúdo das páginas tenha significado além do visual. Tags como <nav>, <section> e <footer> comunicam ao navegador e aos buscadores qual é a função daquele bloco. Além disso, as classes CSS permitem aplicar estilos específicos a elementos com a mesma estrutura visual, usando a sintaxe .nome-da-classe no CSS e class='nome-da-classe' no HTML.",
      question: "Um desenvolvedor criou um menu de navegação e quer estilizá-lo com CSS usando uma classe chamada 'menu'. Como ele deve aplicar essa classe no HTML?",
      options: [
        "<nav id='menu'>",
        "<nav style='menu'>",
        "<nav class='menu'>",
        "<nav type='menu'>"
      ],
      answer: 2,
      feedback: "Classes CSS são aplicadas com o atributo class no HTML. A sintaxe correta é class='nome', que corresponde ao seletor .nome definido no arquivo CSS."
    },

    // aula: Aula 13 - Landing page com HTML

    // 41 - landing page
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Explicativa",

      texto: "Uma landing page é uma página web criada com um objetivo bem específico: converter visitantes em leads ou clientes. Por isso, ela tem poucos elementos distrativos, comunicação direta e foco total em uma única ação. É muito usada em campanhas digitais, lançamentos e divulgação de serviços.",

      question: "Qual é a principal característica de uma landing page em relação ao seu conteúdo?",

      options: [
        "Apresentar o maior número possível de informações sobre um produto",
        "Ter foco direto em conversão com conteúdo objetivo e poucos elementos distrativos",
        "Funcionar como um portal de notícias atualizado frequentemente",
        "Exibir menus complexos para facilitar a navegação do usuário"
      ],

      answer: 1,

      feedback: "A landing page se diferencia justamente pela objetividade: ela elimina distrações e direciona o visitante para uma única ação, como preencher um formulário ou conhecer um serviço."
    },

    // 42 - organização de pastas
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Aplicação",

      texto: "Antes de escrever qualquer linha de código, um bom desenvolvedor organiza a estrutura do projeto. Uma convenção comum é criar uma pasta chamada assets com subpastas separadas para CSS e imagens. Essa separação facilita a manutenção, reutilização e escalabilidade do projeto ao longo do tempo.",

      question: "Um estudante está iniciando sua primeira landing page e quer seguir boas práticas de organização. Qual estrutura de pastas seria mais adequada?",

      options: [
        "Colocar todos os arquivos (HTML, CSS e imagens) na mesma pasta raiz",
        "Criar uma pasta assets com subpastas css e img, além do arquivo index.html na raiz",
        "Separar o projeto em pastas por data de criação dos arquivos",
        "Criar uma pasta exclusiva para o HTML e outra para todos os demais arquivos juntos"
      ],

      answer: 1,

      feedback: "A estrutura recomendada separa o HTML na raiz e agrupa os recursos de apoio dentro de assets/css e assets/img, tornando o projeto mais organizado e fácil de manter."
    },

    // 43 - formato SVG
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Explicativa",

      texto: "O formato ==ddl==SVG== (Scalable Vector Graphics) é amplamente utilizado na web por ser um formato vetorial: ele mantém a qualidade da imagem em qualquer tamanho de tela, sem perda de resolução. Além disso, arquivos SVG tendem a ser leves, o que contribui para o desempenho da página.",

      question: "Por que o formato SVG é considerado ideal para imagens usadas em landing pages?",

      options: [
        "Porque ocupa mais espaço em disco, garantindo maior qualidade",
        "Porque é exclusivo para fotografias de alta resolução",
        "Porque mantém qualidade em qualquer escala e é leve para a web",
        "Porque funciona apenas em navegadores modernos como Chrome"
      ],

      answer: 2,

      feedback: "SVG é vetorial, ou seja, não perde qualidade ao ser redimensionado. Isso o torna perfeito para ícones, ilustrações e backgrounds em landing pages."
    },

    // 44 - paleta de cores
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Contextualizada",

      texto: "A escolha de cores em um projeto web envolve mais do que estética: ela comunica personalidade e emoções. Ferramentas como o Adobe Color permitem extrair paletas automaticamente a partir de uma imagem, garantindo harmonia visual. As cores em HTML são definidas pelo sistema ==ddl==RGB==, representadas em formato hexadecimal com a estrutura #RRGGBB.",

      question: "Analisando a paleta do projeto da aula, qual dos seguintes códigos representa uma cor no formato hexadecimal válido para uso em HTML?",

      options: [
        "RGB(99, 94, 242)",
        "#635EF2",
        "roxo-escuro",
        "rgba(93, 89, 217)"
      ],

      answer: 1,

      feedback: "O formato hexadecimal em HTML segue o padrão #RRGGBB, onde cada par representa a intensidade de vermelho, verde e azul. O valor #635EF2 é um exemplo válido desse formato."
    },

    // 45 - web semântica
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Explicativa",

      texto: "A Web Semântica propõe o uso de tags HTML que carregam significado real, e não apenas visual. Isso facilita a leitura do código por humanos, mecanismos de busca e leitores de acessibilidade. Em vez de usar apenas divs para tudo, o HTML5 introduziu tags como section, nav, article e footer, cada uma com uma função bem definida.",

      question: "Qual é o principal benefício de usar tags semânticas como nav, article e footer em vez de usar somente div para estruturar uma página?",

      options: [
        "Reduzir o tamanho do arquivo HTML em kilobytes",
        "Permitir que o CSS funcione sem arquivos externos",
        "Tornar o código mais compreensível para humanos, buscadores e ferramentas de acessibilidade",
        "Aumentar a velocidade de carregamento da página no servidor"
      ],

      answer: 2,

      feedback: "Tags semânticas comunicam o propósito de cada seção da página, beneficiando tanto a manutenção do código quanto o SEO e a acessibilidade."
    },

    // 46 - tags semânticas
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Aplicação",

      texto: "Imagine que você está construindo uma landing page e precisa adicionar um menu com links para as seções da página. O HTML5 oferece uma tag específica para isso: a tag nav, que representa um bloco de navegação. Dentro dela, costuma-se usar uma lista ul com itens li contendo links a.",

      question: "Qual estrutura HTML representa corretamente um menu de navegação semântico?",

      options: [
        "<div class='menu'><a href='#'>Home</a></div>",
        "<nav><ul><li><a href='#'>Home</a></li></ul></nav>",
        "<section><p><a href='#'>Home</a></p></section>",
        "<menu><link href='#'>Home</link></menu>"
      ],

      answer: 1,

      feedback: "A tag nav indica semanticamente que aquele bloco é de navegação. Combinada com ul e li, forma a estrutura correta e acessível para menus em HTML5."
    },

    // 47 - tabelas HTML
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Explicativa",

      texto: "Tabelas HTML são usadas para organizar dados em linhas e colunas. Sua estrutura básica envolve a tag table como contêiner principal, thead para o cabeçalho, tbody para o corpo dos dados, tr para cada linha, th para células de cabeçalho e td para células de dados comuns.",

      question: "Em uma tabela HTML, qual tag é usada especificamente para representar uma célula de cabeçalho de coluna?",

      options: [
        "<td>",
        "<tr>",
        "<th>",
        "<thead>"
      ],

      answer: 2,

      feedback: "A tag th (table header) define células de cabeçalho, geralmente exibidas em negrito e centralizadas por padrão. Já td é usada para as demais células de dados."
    },

    // 48 - tipos de input
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Contextualizada",

      texto: "Os formulários HTML oferecem diferentes tipos de input para coletar dados variados do usuário. O tipo radio permite selecionar apenas uma opção dentro de um grupo, enquanto o ==type==checkbox== permite marcar múltiplas opções ao mesmo tempo. Essa diferença é fundamental na hora de modelar formulários com lógica de seleção.",

      question: "Um formulário pergunta ao usuário qual é o seu gênero musical favorito, permitindo escolher apenas um. Qual tipo de input é mais adequado para esse caso?",

      options: [
        "checkbox, pois permite selecionar mais de uma opção",
        "radio, pois permite selecionar apenas uma opção dentro do grupo",
        "range, pois define um valor numérico entre dois extremos",
        "file, pois permite enviar arquivos de preferência"
      ],

      answer: 1,

      feedback: "O input do tipo radio é ideal quando o usuário deve escolher uma única opção entre várias. O checkbox, por sua vez, é usado quando múltiplas seleções são permitidas."
    },

    // 49 - meta viewport
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Aplicação",

      texto: "Para garantir que uma página web seja exibida corretamente em dispositivos móveis, o HTML usa a tag meta com o atributo name='viewport'. Ela instrui o navegador a ajustar a largura da página à largura da tela do dispositivo e a definir o zoom inicial como 1, evitando que a página apareça reduzida ou deslocada em celulares.",

      question: "Um desenvolvedor percebe que sua landing page aparece muito pequena e deslocada em celulares. Qual tag inserida no head resolveria esse problema?",

      options: [
        "<meta name='description' content='Landing Page'>",
        "<meta name='viewport' content='width=device-width, initial-scale=1'>",
        "<meta name='charset' content='UTF-8'>",
        "<meta name='robots' content='index, follow'>"
      ],

      answer: 1,

      feedback: "A meta viewport é essencial para o design responsivo. Ela adapta a largura da página ao tamanho da tela do dispositivo e define o zoom inicial, garantindo boa visualização em mobile."
    },

    // 50 - tipografia
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Contextualizada",

      texto: "A tipografia vai muito além de escolher uma fonte bonita. Ela influencia diretamente a usabilidade, a leitura e a identidade visual de uma página. Uma fonte pesada demais pode cansar o olho; uma muito informal pode prejudicar a credibilidade. O Google Fonts oferece fontes gratuitas que podem ser importadas diretamente no HTML ou CSS, facilitando o uso de tipografias profissionais em qualquer projeto.",

      question: "Por que a escolha da tipografia é considerada um elemento essencial em uma landing page?",

      options: [
        "Porque fontes diferentes aumentam automaticamente a velocidade de carregamento da página",
        "Porque a tipografia define apenas a cor do texto exibido na página",
        "Porque ela influencia a leitura, a usabilidade e a percepção da identidade visual do projeto",
        "Porque o uso de fontes externas elimina a necessidade de arquivos CSS"
      ],

      answer: 2,

      feedback: "A tipografia comunica sensações e valores: profissionalismo, modernidade, criatividade. Uma escolha inadequada pode comprometer a experiência do usuário e a credibilidade da página."
    },

    // aula 14 Formatando com CSS

    // 51 - vinculação CSS
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Explicativa",

      texto: "Para que o navegador saiba qual arquivo CSS aplicar a uma página HTML, é preciso fazer uma vinculação explícita. Isso é feito com a tag <link> dentro do <head> do HTML, informando o caminho do arquivo de estilo. Sem essa ligação, todo o CSS escrito fica invisível para o navegador — a página carrega sem nenhum estilo aplicado.",

      question: "Qual tag é usada para vincular um arquivo CSS externo ao HTML?",

      options: [
        "<style src='style.css'>",
        "<link rel='stylesheet' href='style.css'>",
        "<css href='style.css'>",
        "<script src='style.css'>"
      ],

      answer: 1,

      feedback: "A tag correta é <link rel='stylesheet' href='...'>, inserida no <head> do HTML. Ela instrui o navegador a carregar o arquivo CSS externo antes de renderizar a página."
    },

    // 52 - teste de vínculo
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Aplicação",

      texto: "Quando se começa a trabalhar com CSS, uma prática comum é testar se o arquivo está corretamente vinculado ao HTML antes de escrever qualquer estilo definitivo. Uma forma simples de fazer isso é aplicar uma cor de fundo chamativa — como vermelho — no seletor body. Se a cor aparecer na página, o vínculo está funcionando.",

      question: "Um aluno escreveu o CSS abaixo, mas a página não mudou de cor. Qual é a causa mais provável?\n\nbody {\n  background-color: red;\n}",

      options: [
        "A propriedade background-color não existe no CSS",
        "O valor 'red' está incorreto e deveria ser '#red'",
        "O arquivo CSS não está corretamente vinculado ao HTML",
        "O seletor body só funciona com IDs"
      ],

      answer: 2,

      feedback: "Se nenhuma regra CSS aparece na página, o problema mais provável é a ausência ou erro no caminho do <link> que conecta o HTML ao arquivo CSS."
    },

    // 53 - separação de responsabilidades
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Explicativa",

      texto: "Uma das boas práticas mais fundamentais no desenvolvimento web é separar estrutura de estilo. O HTML cuida do conteúdo e da semântica — o que a página diz. O CSS cuida da aparência — como a página parece. Manter esses dois arquivos separados facilita a manutenção, permite reaproveitar o estilo em várias páginas e torna o código mais organizado.",

      question: "Por que é recomendado manter o CSS em arquivo separado do HTML?",

      options: [
        "Porque o navegador não consegue ler CSS dentro do HTML",
        "Para facilitar manutenção, reaproveitamento e organização do código",
        "Porque o CSS só funciona quando está em arquivo externo",
        "Para que o HTML fique menor e carregue mais rápido obrigatoriamente"
      ],

      answer: 1,

      feedback: "Separar HTML e CSS é uma questão de organização e boas práticas. Facilita manutenção, permite reutilização do mesmo estilo em múltiplas páginas e deixa cada arquivo com uma responsabilidade clara."
    },

    // 54 - Google Fonts
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Explicativa",

      texto: "Nem toda fonte está disponível em todos os computadores. Para garantir que a tipografia da página seja exibida corretamente em qualquer dispositivo, é possível importar fontes externas usando o Google Fonts. O processo é simples: acessa-se o site, escolhe-se a fonte, copia-se o <link> gerado e cola-se no <head> do HTML. Em seguida, a fonte é aplicada via CSS com a propriedade font-family.",

      question: "Qual é a ordem correta para usar uma fonte do Google Fonts em uma página?",

      options: [
        "Aplicar font-family no CSS e depois acessar o Google Fonts",
        "Instalar a fonte no sistema operacional e referenciar no CSS",
        "Copiar o <link> do Google Fonts, colar no <head> e aplicar font-family no CSS",
        "Baixar o arquivo .ttf e vinculá-lo diretamente no HTML"
      ],

      answer: 2,

      feedback: "O fluxo correto é: acessar o Google Fonts → escolher a fonte → copiar o <link> → colar no <head> do HTML → aplicar font-family no CSS."
    },

    // 55 - tipografia e legibilidade
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Contextualizada",

      texto: "A escolha das fontes em um projeto vai além do gosto estético. Uma tipografia bem escolhida melhora a legibilidade e contribui para a experiência do usuário. Na landing page da aula, foram usadas duas fontes com papéis distintos: Lato para títulos — por ser mais forte e impactante — e Nunito para textos corridos — por ser mais suave e confortável para leitura prolongada. Fontes inadequadas podem gerar poluição visual e até reduzir a acessibilidade.",

      question: "Qual critério guiou o uso de fontes diferentes para títulos e textos na landing page da aula?",

      options: [
        "As fontes foram escolhidas aleatoriamente para variar o visual",
        "Cada fonte tem características que servem melhor a um propósito: impacto nos títulos e conforto nos textos",
        "O Google Fonts só disponibiliza essas duas fontes gratuitamente",
        "A diferença de fontes é obrigatória pela especificação do CSS"
      ],

      answer: 1,

      feedback: "A escolha tipográfica deve considerar legibilidade e contexto. Lato foi usada em títulos pela força visual, e Nunito nos textos pela leitura mais fluida."
    },

    // 56 - seletores de classe
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Explicativa",

      texto: "No CSS, as ==ddl==classes== são seletores identificados pelo ponto (.) antes do nome. Elas permitem aplicar um mesmo conjunto de estilos em múltiplos elementos HTML. Um elemento recebe uma classe através do atributo class='nome' no HTML. A principal característica das classes é a reutilização: o mesmo estilo pode ser aplicado em quantos elementos forem necessários.",

      question: "Qual é a forma correta de criar e usar uma classe CSS chamada 'destaque'?",

      options: [
        "CSS: #destaque {} → HTML: id='destaque'",
        "CSS: .destaque {} → HTML: class='destaque'",
        "CSS: destaque {} → HTML: name='destaque'",
        "CSS: @destaque {} → HTML: style='destaque'"
      ],

      answer: 1,

      feedback: "Classes usam . no CSS e são referenciadas com o atributo class no HTML. São reutilizáveis e podem ser aplicadas em múltiplos elementos."
    },

    // 57 - seletores ID
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Contextualizada",

      texto: "Diferente das classes, os ==ddl==IDs== são identificadores únicos — cada ID deve aparecer apenas uma vez por página. No CSS, são referenciados com o símbolo #. Uma aplicação muito comum de IDs em landing pages é a navegação interna: ao definir id='servicos' em uma seção, é possível criar um link href='#servicos' no menu que, ao ser clicado, rola a página automaticamente até aquela seção.",

      question: "Por que IDs são mais indicados do que classes para criar navegação interna em uma landing page?",

      options: [
        "Porque IDs carregam mais rápido que classes no navegador",
        "Porque IDs são únicos na página, permitindo referenciar seções específicas com href='#id'",
        "Porque o CSS só aceita IDs como destino de links internos",
        "Porque classes não podem ser usadas em tags <section>"
      ],

      answer: 1,

      feedback: "IDs são únicos por página, o que os torna ideais para navegação interna. O href='#id' rola a página até o elemento com aquele identificador."
    },

    // 58 - variáveis CSS
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Explicativa",

      texto: "CSS permite criar ==ddl==variáveis== para armazenar valores reutilizáveis, como cores e espaçamentos. Elas são declaradas dentro do seletor :root usando dois hífens antes do nome: --nome-da-variavel. Para usá-las em qualquer parte do CSS, basta chamar var(--nome-da-variavel). Isso garante consistência visual e facilita mudanças: alterar o valor em um único lugar atualiza toda a página.",

      question: "Qual é a vantagem principal de usar variáveis CSS com :root?",

      options: [
        "Permite usar JavaScript para controlar o CSS diretamente",
        "Torna o carregamento da página mais rápido",
        "Centraliza valores reutilizáveis, facilitando manutenção e garantindo consistência visual",
        "Substitui completamente a necessidade de usar classes"
      ],

      answer: 2,

      feedback: "Variáveis CSS definidas em :root são acessíveis em todo o arquivo. Mudar o valor em um lugar reflete em todos os elementos que a utilizam."
    },

    // 59 - Flexbox no menu
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Aplicação",

      texto: "Flexbox é um modelo de layout do CSS que organiza elementos em linha ou coluna de forma flexível. No menu da landing page da aula, foi usado display: flex com justify-content: space-between para posicionar o logo de um lado e os links do outro, sem precisar calcular margens manualmente. O Flexbox distribui o espaço disponível de forma automática entre os itens.",

      question: "Um desenvolvedor quer que o logo fique à esquerda do menu e os links de navegação à direita, sem cálculo manual de espaços. Qual combinação resolve isso?",

      options: [
        "display: block e margin: auto",
        "display: flex e justify-content: space-between",
        "display: grid e grid-template-columns: 1fr 1fr",
        "position: absolute e right: 0"
      ],

      answer: 1,

      feedback: "display: flex ativa o Flexbox e justify-content: space-between distribui os itens nos extremos do container — perfeito para menus com logo e links."
    },

    // 60 - CSS Grid
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Contextualizada",

      texto: "O CSS Grid é um sistema de layout que permite dividir a página em colunas e linhas de forma precisa. Com display: grid e grid-template-columns, define-se quantas colunas o layout terá e qual o tamanho de cada uma. A unidade fr (fraction) representa uma fração do espaço disponível — então 1fr 1fr cria duas colunas iguais, e 1fr 1fr 1fr cria três colunas proporcionais. É ideal para seções com texto e imagem lado a lado.",

      question: "O que o código abaixo produz na página?\n\n.grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n}",

      options: [
        "Uma coluna com dois elementos empilhados",
        "Duas colunas de tamanho igual dividindo o espaço disponível",
        "Dois elementos flutuando lado a lado com float",
        "Uma tabela com duas células de largura fixa"
      ],

      answer: 1,

      feedback: "1fr 1fr cria duas colunas que dividem igualmente o espaço do container. A unidade fr é proporcional e calculada automaticamente pelo navegador."
    },

    // aula: Aula 15 - Revisão Projeto de Design para Web

// 61 - Mobile First
{
  aula: "Aula 15 - Revisão Projeto de Design para Web",
  tipo: "Explicativa",

  texto: "O Mobile First é uma abordagem de desenvolvimento web que propõe começar o projeto pelas telas menores — como smartphones — e só depois expandir o layout para tablets e desktops. Essa lógica inverte a ordem tradicional e força o designer a priorizar o que realmente importa, já que o espaço disponível é limitado. O resultado costuma ser um código mais enxuto e uma experiência mais fluida em dispositivos móveis.",

  question: "Qual é o princípio central da abordagem Mobile First no desenvolvimento web?",

  options: [
    "Desenvolver primeiro para desktops e depois adaptar para telas menores",
    "Criar layouts fixos que funcionem igualmente em todos os dispositivos",
    "Começar o desenvolvimento pelos dispositivos móveis e expandir progressivamente para telas maiores",
    "Eliminar o uso de Media Queries para simplificar o código"
  ],

  answer: 2,

  feedback: "No Mobile First, o desenvolvimento parte das telas menores em direção às maiores, garantindo foco no conteúdo essencial e melhor experiência em smartphones."
},

// 62 - Media Queries
{
  aula: "Aula 15 - Revisão Projeto de Design para Web",
  tipo: "Aplicação",

  texto: "Imagine que você está desenvolvendo um site seguindo o Mobile First. O layout para smartphones já está pronto, mas agora você precisa reorganizar os elementos quando a tela for maior — colocando o menu na lateral e exibindo mais colunas de conteúdo. Para isso, o CSS oferece um recurso específico que permite aplicar estilos diferentes de acordo com o tamanho da tela do dispositivo.",

  question: "Qual recurso do CSS deve ser utilizado para adaptar o layout progressivamente conforme o tamanho da tela aumenta?",

  options: [
    "Pseudo-classes",
    "Media Queries",
    "Variáveis CSS",
    "Seletores de atributo"
  ],

  answer: 1,

  feedback: "As ==rule==Media Queries== permitem definir regras CSS condicionais baseadas no tamanho da tela, sendo o recurso central para a adaptação progressiva no Mobile First."
},

// 63 - Design Centrado Usuário
{
  aula: "Aula 15 - Revisão Projeto de Design para Web",
  tipo: "Explicativa",

  texto: "O Design Centrado no Usuário coloca as necessidades reais de quem vai usar a interface acima de qualquer preferência estética do designer. Isso significa pensar em usabilidade — quão fácil é usar o sistema —, acessibilidade — se pessoas com diferentes necessidades conseguem utilizá-lo —, e comunicabilidade — se a interface consegue transmitir suas funções claramente. Um projeto bem centrado no usuário resulta em navegação intuitiva e conforto cognitivo durante o uso.",

  question: "Qual das opções abaixo representa um dos pilares do Design Centrado no Usuário?",

  options: [
    "Priorizar o visual moderno em detrimento da facilidade de uso",
    "Garantir que o designer tenha liberdade criativa total sem restrições funcionais",
    "Considerar acessibilidade, usabilidade e comunicabilidade no projeto da interface",
    "Desenvolver primeiro as funcionalidades avançadas antes das básicas"
  ],

  answer: 2,

  feedback: "O Design Centrado no Usuário envolve usabilidade, acessibilidade, comunicabilidade, clareza visual e conforto cognitivo — todos voltados às necessidades reais do usuário."
},

// 64 - Ergonomia condução
{
  aula: "Aula 15 - Revisão Projeto de Design para Web",
  tipo: "Aplicação",

  texto: "Pense em um aplicativo de banco onde, ao entrar em qualquer tela, você sempre sabe onde está, o que pode fazer e como voltar. Essa sensação de orientação constante não é acidente — ela é resultado da aplicação de um critério ergonômico específico. Interfaces bem projetadas guiam o usuário durante toda a navegação, reduzindo a sensação de perda ou confusão.",

  question: "Qual critério ergonômico é responsável por orientar o usuário durante a navegação, indicando onde ele está e quais ações estão disponíveis?",

  options: [
    "Homogeneidade",
    "Adaptabilidade",
    "Condução",
    "Controle explícito"
  ],

  answer: 2,

  feedback: "O critério de Condução trata exatamente da orientação do usuário durante a navegação, garantindo que ele sempre saiba onde está e o que pode fazer."
},

// 65 - Ergonomia carga trabalho
{
  aula: "Aula 15 - Revisão Projeto de Design para Web",
  tipo: "Explicativa",

  texto: "Toda vez que um usuário precisa memorizar informações entre telas, preencher campos desnecessários ou processar muitas opções ao mesmo tempo, ele está sendo submetido a um esforço mental elevado. Um bom design deve minimizar esse esforço, tornando a interação mais fluida e menos cansativa. Esse cuidado com o esforço mental que a interface exige do usuário é tratado por um critério ergonômico específico.",

  question: "Qual critério ergonômico trata da redução do esforço mental exigido do usuário durante o uso da interface?",

  options: [
    "Gestão de erros",
    "Carga de trabalho",
    "Compatibilidade",
    "Homogeneidade"
  ],

  answer: 1,

  feedback: "O critério de Carga de trabalho visa reduzir o esforço mental do usuário, simplificando interações e evitando sobrecarga cognitiva desnecessária."
},

// 66 - Engenharia Semiótica
{
  aula: "Aula 15 - Revisão Projeto de Design para Web",
  tipo: "Contextualizada",

  texto: "A Engenharia Semiótica parte de uma ideia interessante: toda interface é, na prática, uma mensagem. Quando o designer cria botões, ícones, animações e textos, ele está codificando intenções de uso. O sistema funciona como o canal que transmite essa mensagem ao usuário. Signos visuais, símbolos, comportamentos e feedbacks são os elementos que carregam esse significado. A análise dessa comunicação envolve três atores principais: o designer, o sistema e o usuário.",

  question: "Na perspectiva da ==def==Engenharia Semiótica==, o que a interface representa dentro do processo de comunicação?",

  options: [
    "A intenção final do usuário ao interagir com o sistema",
    "Uma mensagem do designer para o usuário, mediada pelo sistema",
    "Um conjunto de regras técnicas independente de interpretação humana",
    "O resultado visual do processo de desenvolvimento front-end"
  ],

  answer: 1,

  feedback: "Na Engenharia Semiótica, a interface é a mensagem que o designer envia ao usuário por meio do sistema, utilizando signos visuais, comportamentos e feedbacks como elementos comunicativos."
},

// 67 - Inspeção semiótica etapas
{
  aula: "Aula 15 - Revisão Projeto de Design para Web",
  tipo: "Explicativa",

  texto: "A Inspeção Semiótica é um método de avaliação de interfaces que segue uma sequência definida de etapas. Começa analisando os signos que explicam o próprio sistema (metalinguísticos), depois os elementos visuais fixos (estáticos) e os que mudam com a interação (dinâmicos). Em seguida, compara as mensagens transmitidas por esses diferentes signos e, por fim, avalia a qualidade geral da comunicação entre designer e usuário.",

  question: "Qual é a ordem correta das etapas iniciais da Inspeção Semiótica?",

  options: [
    "Signos dinâmicos → Signos estáticos → Signos metalinguísticos",
    "Signos metalinguísticos → Signos estáticos → Signos dinâmicos",
    "Avaliação da metacomunicação → Comparação das metamensagens → Signos estáticos",
    "Comparação das metamensagens → Signos dinâmicos → Signos metalinguísticos"
  ],

  answer: 1,

  feedback: "A Inspeção Semiótica começa pelos signos metalinguísticos, avança para os estáticos e dinâmicos, depois compara as metamensagens e finaliza com a avaliação da metacomunicação."
},

// 68 - Psicologia cognitiva
{
  aula: "Aula 15 - Revisão Projeto de Design para Web",
  tipo: "Contextualizada",

  texto: "O design de interfaces dialoga diretamente com como o cérebro humano processa informações. Alguns fatores cognitivos são especialmente relevantes: a atenção seletiva define o que o usuário percebe primeiro; a memória de curto prazo limita quantas informações ele consegue reter de uma vez; e a categorização ajuda o cérebro a organizar elementos em grupos com significado. Quando esses fatores são ignorados no projeto, a interface se torna confusa e difícil de usar.",

  question: "Um designer quer que o usuário identifique rapidamente o botão de ação principal em uma tela com muitos elementos. Qual fator cognitivo ele deve explorar para alcançar esse objetivo?",

  options: [
    "Memória de longo prazo",
    "Vigilância",
    "Atenção seletiva",
    "Interpretação"
  ],

  answer: 2,

  feedback: "A atenção seletiva é o mecanismo cognitivo que direciona o foco do usuário. Ao criar destaque visual para o botão principal, o designer explora esse fator para guiar a percepção."
},

// 69 - Tipografia objetivos
{
  aula: "Aula 15 - Revisão Projeto de Design para Web",
  tipo: "Aplicação",

  texto: "A tipografia em um projeto web vai muito além da escolha de uma fonte bonita. Ela cumpre papéis funcionais importantes: organiza as informações em níveis de importância, facilita a leitura do conteúdo e contribui para que o site transmita uma identidade visual coerente. Por isso, no projeto estudado na aula, foram escolhidas fontes diferentes para títulos e para textos corridos — cada uma com uma função específica.",

  question: "No projeto desenvolvido durante o módulo, qual fonte foi escolhida para os textos corridos e qual era o objetivo principal dessa diferenciação tipográfica?",

  options: [
    "Lato Black 900, para reforçar a identidade visual nos parágrafos",
    "Nunito Regular 400, para criar hierarquia visual e melhorar a leitura",
    "Roboto Regular, para garantir maior compatibilidade entre navegadores",
    "Open Sans 400, para uniformizar títulos e textos em uma única fonte"
  ],

  answer: 1,

  feedback: "A Nunito Regular 400 foi escolhida para textos corridos. Combinada com a Lato Black 900 nos títulos, essa diferenciação cria hierarquia visual e melhora a experiência de leitura."
},

// 70 - HTML semântico
{
  aula: "Aula 15 - Revisão Projeto de Design para Web",
  tipo: "Explicativa",

  texto: "O HTML5 trouxe uma série de elementos semânticos que vão além da simples organização visual da página — eles comunicam o significado de cada bloco de conteúdo. Usar `<header>` indica que aquela área é o cabeçalho; `<nav>` sinaliza um bloco de navegação; `<article>` representa um conteúdo independente. Isso beneficia a acessibilidade, melhora a leitura do código por outros desenvolvedores e auxilia mecanismos de busca a compreenderem a estrutura do site.",

  question: "Qual elemento HTML semântico deve ser utilizado para delimitar um bloco de conteúdo independente, como uma notícia ou post de blog?",

  options: [
    "<section>",
    "<main>",
    "<article>",
    "<div>"
  ],

  answer: 2,

  feedback: "O elemento `<article>` representa conteúdo independente e autossuficiente, como uma notícia ou post. Diferente de `<section>`, ele faz sentido mesmo fora do contexto da página."
}

  ],

/* ══════════════════════════════════════════════════════════
     QUESTÕES ENADE — Design
     ══════════════════════════════════════════════════════════ */
  enade: [

  // Aula 9 — Prototipagem e Norma ISO 9241
  // Questão 1
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

  // Questão 2
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

  // Questão 3
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

  // Questão 4
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

  // Questão 5
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

  // Questão 6
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

  // Questão 7
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

  // Questão 8
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

  // Questão 9
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

  // Questão 10
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

  // Aula 10 — Design de Interfaces e Prototipação
  // Questão 11
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
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

  // Questão 12
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
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

  // Questão 13
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
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

  // Questão 14
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
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

  // Questão 15
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
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

  // Questão 16
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
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

  // Questão 17
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
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

  // Questão 18
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
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

  // Questão 19
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
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
    feedback: "Correto: A (I, II e IV). Iniciar com ==def==baixa fidelidade== permite explorar mais ideias com menos custo (I). Validar com múltiplos perfis é essencial dado o gap de familiaridade tecnológica entre os grupos (II). A progressão iterativa é a abordagem DCU adequada para o contexto (IV). A afirmativa III está **errada**: protótipos de baixa fidelidade são ferramentas valiosas exatamente em fases iniciais de projetos complexos — postergar a validação até o mockup final aumenta o custo de correção de erros estruturais."
  },

  // Questão 20
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",
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

  // Aula 11 - Design Responsivo

  // Questão 21
  {
    aula: "Aula 11 - Design Responsivo",
    tipo: "Conceitual contextualizada",

    texto: "Uma equipe de desenvolvimento recebeu a tarefa de modernizar o portal de uma rede hospitalar. Os acessos vinham majoritariamente de dispositivos móveis, mas o site havia sido construído com larguras fixas em pixels, causando problemas graves de usabilidade em celulares e tablets. A equipe decidiu adotar design responsivo como solução estrutural.",

    question: "Considerando o cenário apresentado, o ==def==design responsivo== vai além de simplesmente reduzir o tamanho do site. Assinale a alternativa que melhor descreve sua real finalidade:",

    options: [
      "Criar versões diferentes do site para cada dispositivo, com URLs distintas e folhas de estilo separadas.",
      "Reorganizar, adaptar e otimizar a interface para diferentes dispositivos a partir de uma única base de código.",
      "Reduzir automaticamente a resolução das imagens para que o carregamento seja mais rápido em redes móveis.",
      "Garantir que o layout permaneça idêntico em todos os dispositivos, preservando a identidade visual da marca."
    ],

    answer: 1,

    feedback: "Correto: B. O **design responsivo** não se limita a redimensionar elementos — envolve ==def==reorganização e adaptação== da interface para cada contexto de uso. Criar versões separadas (opção A) é uma abordagem antiga chamada design adaptativo, não responsivo. Manter o layout idêntico (opção D) contradiz o próprio conceito."
  },

  // Questão 22
  {
    aula: "Aula 11 - Design Responsivo",
    tipo: "Análise aplicada",

    texto: "Durante o desenvolvimento de um sistema de notícias online, um desenvolvedor front-end escreveu o seguinte trecho de CSS para adaptar o layout do componente de artigos em dispositivos menores.",

    question: "Analise o código abaixo e identifique seu comportamento correto:",

    code: `@media (max-width: 600px) {
    .artigo {
      width: 100%;
      font-size: 14px;
    }
  }`,

    options: [
      "O estilo será aplicado somente em telas com largura superior a 600px.",
      "O estilo será aplicado em qualquer tamanho de tela, substituindo todas as regras anteriores.",
      "O estilo será aplicado apenas quando a largura da tela for igual ou menor que 600px.",
      "O código é inválido pois media queries não aceitam a propriedade font-size."
    ],

    answer: 2,

    feedback: "Correto: C. A diretiva ==ddl==@media (max-width: 600px)== define que os estilos contidos no bloco serão aplicados apenas quando a largura da viewport for igual ou inferior a 600px. É um dos ==key==breakpoints== mais comuns para dispositivos móveis."
  },

  // Questão 23
  {
    aula: "Aula 11 - Design Responsivo",
    tipo: "Asserção + Justificativa",

    texto: "Ao inspecionar o comportamento de um site em um smartphone, um desenvolvedor percebeu que, mesmo com media queries corretamente configuradas, o layout continuava sendo renderizado como se fosse uma tela de desktop. Após investigação, verificou-se que a meta tag viewport estava ausente no HTML.",

    question: "Avalie a seguinte asserção e sua justificativa:",

    assertions: [
      "A ausência da ==def==meta tag viewport== faz com que o navegador mobile renderize a página como se tivesse uma largura de desktop, ignorando os breakpoints definidos nas media queries.",
      "[PORQUE] A meta tag viewport instrui o navegador a utilizar a largura real do dispositivo como referência de escala, permitindo que as media queries funcionem corretamente."
    ],

    options: [
      "As duas afirmativas são verdadeiras, e a II justifica a I.",
      "As duas afirmativas são verdadeiras, mas a II não justifica a I.",
      "A afirmativa I é verdadeira e a II é falsa.",
      "A afirmativa I é falsa e a II é verdadeira."
    ],

    answer: 0,

    feedback: "Correto: A. Ambas as afirmativas são verdadeiras e há relação direta entre elas. Sem o ==def==viewport==, navegadores móveis assumem uma largura padrão de ~980px, tornando as media queries ineficazes. A tag `<meta name='viewport' content='width=device-width, initial-scale=1'>` resolve esse comportamento."
  },

  // Questão 24
  {
    aula: "Aula 11 - Design Responsivo",
    tipo: "Múltiplas afirmativas",

    texto: "Em um projeto de e-commerce, a equipe de front-end debateu sobre as melhores práticas para construção de layouts responsivos. Surgiram divergências sobre o uso de medidas fixas versus relativas no CSS.",

    question: "Avalie as afirmativas a seguir sobre ==def==layout fluido==:",

    assertions: [
      "I. O uso de porcentagens (%) para larguras permite que elementos se ajustem proporcionalmente ao tamanho da tela do usuário.",
      "II. Medidas em pixels (px) são preferíveis para larguras de containers, pois garantem consistência visual entre dispositivos.",
      "III. A unidade em pode ser utilizada para fontes, tornando o texto escalável em relação ao elemento pai.",
      "IV. Utilizar width: 100% em um elemento garante que ele sempre ocupe toda a largura da tela, independentemente do contexto."
    ],

    options: [
      "I e III, apenas.",
      "I, II e III, apenas.",
      "II e IV, apenas.",
      "I, II, III e IV."
    ],

    answer: 0,

    feedback: "Correto: A. As afirmativas I e III são verdadeiras. ==def==Medidas relativas== como % e em são o fundamento do layout fluido. A afirmativa II está errada pois px é uma medida fixa — inadequada para layouts responsivos. A afirmativa IV é imprecisa: `width: 100%` ocupa 100% do elemento pai, não necessariamente da tela."
  },

  // Questão 25
  {
    aula: "Aula 11 - Design Responsivo",
    tipo: "Conceitual contextualizada",

    texto: "Uma startup de tecnologia educacional iniciou o desenvolvimento de sua plataforma de cursos. Após análise de métricas, constatou-se que 78% dos acessos seriam feitos via smartphones. O líder técnico sugeriu adotar a metodologia Mobile First no desenvolvimento do front-end.",

    question: "Qual é a característica central da abordagem ==def==Mobile First== e por que ela é recomendada nesse contexto?",

    options: [
      "Criar um layout desktop completo e depois remover funcionalidades para versões móveis, simplificando o processo de adaptação.",
      "Desenvolver primeiro a versão mobile com foco no essencial e depois expandir progressivamente para telas maiores usando min-width.",
      "Proibir o uso de imagens e animações na versão mobile para garantir desempenho máximo em redes lentas.",
      "Utilizar exclusivamente frameworks como Bootstrap, que já implementam Mobile First por padrão sem necessidade de customização."
    ],

    answer: 1,

    feedback: "Correto: B. O **Mobile First** parte do pressuposto de desenvolver para o contexto mais restrito primeiro, garantindo foco no conteúdo essencial. As ==proc==media queries com min-width== são usadas para escalar progressivamente o layout. A opção A descreve o processo inverso, chamado graceful degradation."
  },

  // Questão 26
  {
    aula: "Aula 11 - Design Responsivo",
    tipo: "Análise aplicada",

    texto: "Um desenvolvedor está construindo um componente de grade de notícias com comportamento diferente em três contextos: celular, tablet e desktop. Ele utiliza breakpoints para definir o número de colunas exibidas.",

    question: "Analise o trecho de CSS abaixo e determine o comportamento esperado:",

    code: `.noticia { width: 100%; }

  @media (min-width: 768px) {
    .noticia { width: 50%; }
  }

  @media (min-width: 960px) {
    .noticia { width: 33.33%; }
  }`,

    options: [
      "Em celulares: 3 colunas. Em tablets: 2 colunas. Em desktops: 1 coluna.",
      "Em celulares: 1 coluna. Em tablets: 2 colunas. Em desktops: 3 colunas.",
      "O código é inválido pois media queries com min-width não podem ser aninhadas.",
      "Em todos os tamanhos: 1 coluna, pois a regra sem media query sobrescreve todas as outras."
    ],

    answer: 1,

    feedback: "Correto: B. Seguindo a abordagem ==ddl==Mobile First==, a regra base (sem media query) aplica 100% de largura — 1 coluna. A partir de ==key==768px==, cada item ocupa 50% — 2 colunas. A partir de ==key==960px==, 33.33% — 3 colunas. As regras se sobrescrevem progressivamente conforme o tamanho da tela aumenta."
  },

  // Questão 27
  {
    aula: "Aula 11 - Design Responsivo",
    tipo: "Asserção + Justificativa",

    texto: "Durante a revisão de código de um projeto web, um desenvolvedor sênior apontou que a ordem das media queries no arquivo CSS estava causando comportamentos inesperados no layout. Alguns estilos definidos para mobile estavam sendo sobrescritos por regras para desktop.",

    question: "Avalie a asserção e sua justificativa:",

    assertions: [
      "A ==warn==ordem das media queries== no CSS interfere diretamente no resultado visual, podendo fazer com que regras anteriores sejam sobrescritas por regras posteriores com a mesma especificidade.",
      "[PORQUE] O CSS segue o princípio da cascata, onde a última regra declarada com a mesma especificidade prevalece sobre as anteriores."
    ],

    options: [
      "As duas afirmativas são verdadeiras, e a II justifica a I.",
      "As duas afirmativas são verdadeiras, mas a II não justifica a I.",
      "A afirmativa I é verdadeira e a II é falsa.",
      "A afirmativa I é falsa e a II é verdadeira."
    ],

    answer: 0,

    feedback: "Correto: A. O **princípio da cascata** do CSS determina que, quando há conflito de especificidade igual, a última regra declarada vence. Por isso, a ==warn==ordem das media queries== é crítica: no Mobile First, regras mobile vêm antes e são sobrescritas pelas de desktop via `min-width`. Inverter essa ordem gera comportamentos incorretos."
  },

  // Questão 28
  {
    aula: "Aula 11 - Design Responsivo",
    tipo: "Conceitual contextualizada",

    texto: "Uma desenvolvedora está refatorando o CSS de um portal de notícias para torná-lo responsivo. Ela percebe que os elementos principais usam larguras em centímetros e fontes em milímetros, o que causa inconsistências graves entre dispositivos.",

    question: "Qual das alternativas representa a substituição mais adequada para tornar o layout ==def==fluido e responsivo==?",

    options: [
      "Substituir centímetros por pixels, pois pixels são a unidade padrão do CSS e garantem precisão.",
      "Substituir larguras por porcentagens e fontes por em ou rem, utilizando medidas relativas ao contexto do elemento.",
      "Utilizar media queries para definir valores fixos diferentes em cada breakpoint, mantendo o uso de pixels.",
      "Converter todas as medidas para viewport width (vw) e viewport height (vh), eliminando qualquer outra unidade."
    ],

    answer: 1,

    feedback: "Correto: B. O **layout fluido** baseia-se em ==def==medidas relativas==: `%` para larguras de containers e `em`/`rem` para fontes. Pixels (opção A) continuam sendo fixos e não se adaptam. A opção C mantém rigidez nos valores. A opção D não é errada, mas `vw`/`vh` têm limitações específicas e não são substitutos universais de %."
  },

  // Questão 29
  {
    aula: "Aula 11 - Design Responsivo",
    tipo: "Asserção + Justificativa",

    texto: "Em um debate técnico, dois desenvolvedores discutiam qual abordagem seria mais eficiente: começar pelo design desktop e depois adaptar para mobile, ou iniciar pelo mobile e escalar para desktop.",

    question: "Avalie a asserção e sua justificativa sobre a abordagem ==def==Mobile First==:",

    assertions: [
      "A metodologia Mobile First resulta em interfaces mais limpas e com melhor desempenho, pois obriga a priorizar apenas o conteúdo essencial desde o início do desenvolvimento.",
      "[PORQUE] Ao partir de telas pequenas, os desenvolvedores são forçados a eliminar elementos desnecessários, e o carregamento progressivo de recursos adicionais para telas maiores é mais eficiente do que remover recursos para telas menores."
    ],

    options: [
      "As duas afirmativas são verdadeiras, e a II justifica a I.",
      "As duas afirmativas são verdadeiras, mas a II não justifica a I.",
      "A afirmativa I é verdadeira e a II é falsa.",
      "A afirmativa I é falsa e a II é verdadeira."
    ],

    answer: 0,

    feedback: "Correto: A. Ambas as afirmativas são verdadeiras e há relação causal direta. O **Mobile First** impõe restrição como disciplina criativa: o espaço limitado força decisões de priorização de conteúdo. A ==proc==escala progressiva== via `min-width` é mais performática do que a degradação de recursos (Desktop First com `max-width`)."
  },

  // Questão 30
  {
    aula: "Aula 11 - Design Responsivo",
    tipo: "Análise aplicada",

    texto: "Uma desenvolvedora júnior foi incumbida de criar uma página responsiva para um blog. Ela escreveu o seguinte código HTML e CSS, mas percebeu que o layout não se comportava como esperado em celulares.",

    question: "Analise o código e identifique o principal problema que impede o funcionamento correto do design responsivo:",

    code: `<!-- HTML -->
  <head>
    <title>Blog</title>
    <!-- meta viewport ausente -->
  </head>

  /* CSS */
  .container {
    width: 960px;
  }

  .post {
    width: 640px;
    font-size: 16px;
  }`,

    options: [
      "O problema está apenas no CSS: as larguras deveriam usar em ao invés de px para fontes e % para larguras.",
      "O código possui dois problemas combinados: ausência da meta tag viewport e uso de medidas fixas em px, impedindo a adaptação em telas menores.",
      "O problema está apenas na ausência da meta tag viewport; as larguras em px são aceitáveis desde que as media queries sejam definidas corretamente.",
      "O CSS está correto, pois define larguras explícitas. O único ajuste necessário é adicionar a meta tag viewport ao HTML."
    ],

    answer: 1,

    feedback: "Correto: B. O código apresenta dois problemas que se somam: a ==warn==ausência da meta tag viewport== faz o navegador mobile ignorar a largura real da tela, e o uso de ==warn==larguras fixas em px== impede qualquer adaptação fluida. Um design verdadeiramente responsivo exige: viewport configurado, medidas relativas (%) e media queries. Nenhum dos dois problemas isolado resolve a situação completamente."
  },

  // Aula 12 - CSS e HTML Comandos Básicos

  // Questão 31
  {
  aula: "Aula 12 - CSS e HTML Comandos Básicos",
    tipo: "Asserção + Justificativa",

    texto: "Uma equipe de desenvolvimento web está revisando boas práticas de separação de responsabilidades em projetos front-end. Durante a revisão, surge uma discussão sobre o papel do HTML e do CSS na construção de páginas web.",

    question: "Analise as asserções a seguir sobre ==def==HTML== e ==def==CSS==:",

    assertions: [
      "I. O HTML é uma linguagem de marcação responsável por estruturar o conteúdo de páginas web, não executando lógica de programação.",
      "[PORQUE] II. O CSS é utilizado para separar a aparência da estrutura, permitindo reutilização de estilos e redução de retrabalho no desenvolvimento."
    ],

    options: [
      "As asserções I e II são verdadeiras, e II justifica o papel complementar de I",
      "As asserções I e II são verdadeiras, mas II não justifica I",
      "A asserção I é verdadeira e a II é falsa",
      "A asserção I é falsa e a II é verdadeira"
    ],

    answer: 1,

    feedback: "Correto: B. Ambas as afirmativas são verdadeiras: o **HTML** de fato é uma linguagem de marcação sem execução de lógica, e o ==def==CSS== realmente separa estrutura de aparência. Porém, a segunda não justifica a primeira — são papéis complementares e independentes, não uma relação de causa e consequência."
  },

  // Questão 32
  {
  aula: "Aula 12 - CSS e HTML Comandos Básicos",
    tipo: "Múltiplas afirmativas",

    texto: "Um estudante de desenvolvimento web está analisando a estrutura de um arquivo HTML5 e precisa identificar quais elementos pertencem corretamente à tag <head> de uma página.",

    question: "Considerando a estrutura padrão do ==def==HTML5==, avalie as afirmativas abaixo sobre o conteúdo da tag `<head>`:",

    assertions: [
      "I. A tag `<title>` define o título exibido na aba do navegador e deve estar dentro do `<head>`.",
      "II. A tag `<link rel='stylesheet'>` conecta o arquivo CSS externo e deve ser inserida no `<head>`.",
      "III. Imagens, tabelas e menus de navegação são elementos típicos do `<head>`.",
      "IV. A tag `<meta>` armazena metadados da página e é posicionada no `<head>`."
    ],

    options: [
      "I, II e IV, apenas",
      "I e III, apenas",
      "II e III, apenas",
      "I, II, III e IV"
    ],

    answer: 0,

    feedback: "Correto: A. As afirmativas **I, II e IV** estão corretas — `<title>`, `<link>` e `<meta>` são elementos do `<head>`. A afirmativa III está errada: imagens, tabelas e menus pertencem ao `<body>`, que é a área visível ao usuário."
  },

  // Questão 33
  {
  aula: "Aula 12 - CSS e HTML Comandos Básicos",
    tipo: "Asserção + Justificativa",

    texto: "Uma empresa de e-commerce percebeu que seus produtos não apareciam bem posicionados nos resultados do Google. Ao auditar o código-fonte do site, o desenvolvedor constatou que toda a estrutura estava construída exclusivamente com tags `<div>` e `<span>`, sem nenhuma tag semântica.",

    question: "Analise as asserções sobre ==def==Web Semântica== e sua relação com esse cenário:",

    assertions: [
      "I. O uso exclusivo de `<div>` e `<span>` prejudica a indexação do site por mecanismos de busca, pois essas tags não carregam significado semântico.",
      "[PORQUE] II. A Web Semântica, conceito associado a Tim Berners-Lee, busca dar significado ao conteúdo das páginas para facilitar sua interpretação por sistemas automatizados como buscadores."
    ],

    options: [
      "As asserções I e II são verdadeiras, e II justifica I",
      "As asserções I e II são verdadeiras, mas II não justifica I",
      "A asserção I é verdadeira e a II é falsa",
      "A asserção I é falsa e a II é verdadeira"
    ],

    answer: 0,

    feedback: "Correto: A. Ambas as asserções são verdadeiras e há relação de justificativa: a **Web Semântica** ==def==busca dar significado ao conteúdo== justamente para que buscadores entendam a estrutura. Por isso, o uso de apenas `<div>` prejudica a indexação — o que torna II uma justificativa direta de I."
  },

  // Questão 34
  {
  aula: "Aula 12 - CSS e HTML Comandos Básicos",
    tipo: "Análise aplicada",

    texto: "Uma desenvolvedora júnior recebeu a tarefa de implementar um layout com duas colunas: a coluna principal à esquerda, ocupando 70% da largura, e uma barra lateral à direita, com 30%. Ela escreveu o seguinte CSS:",

    question: "Considerando o uso da propriedade ==dml==float== no CSS, assinale a alternativa que representa a implementação correta para esse layout:",

    code: `/* Opção implementada pela desenvolvedora */
  .principal {
    width: 70%;
    float: right;
  }
  .lateral {
    width: 30%;
    float: right;
  }`,

    options: [
      "O código está correto e produzirá o layout esperado com as colunas lado a lado",
      "O código está incorreto: .principal deveria usar float: left para ficar à esquerda",
      "O código está incorreto: a propriedade correta para esse layout é display: flex em ambos",
      "O código está correto, pois float: right em ambos posiciona os elementos em lados opostos automaticamente"
    ],

    answer: 1,

    feedback: "Correto: B. O erro está no **float** de `.principal`: para que fique à esquerda, deve-se usar `float: left`. Com `float: right` em ambos os elementos, os dois seriam empurrados para a direita, quebrando o layout esperado. ==dml==float: left== e `float: right` posicionam o elemento no lado correspondente do container."
  },

  // Questão 35
  {
  aula: "Aula 12 - CSS e HTML Comandos Básicos",
    tipo: "Conceitual contextualizada",

    texto: "Em um projeto web com múltiplas páginas, o time de front-end precisa garantir que botões de confirmação em diferentes seções do sistema compartilhem o mesmo visual: fundo azul, bordas arredondadas e fonte branca. O desenvolvedor sênior orienta a equipe a utilizar classes CSS em vez de estilizar cada elemento individualmente.",

    question: "Qual é a principal vantagem do uso de ==def==classes CSS== nesse cenário, em comparação com a estilização inline aplicada diretamente em cada elemento?",

    options: [
      "As classes CSS são processadas mais rapidamente pelo navegador do que estilos inline",
      "As classes CSS permitem reutilização de estilos em múltiplos elementos, reduzindo retrabalho e facilitando manutenção",
      "O uso de classes elimina a necessidade de um arquivo CSS externo vinculado ao HTML",
      "Classes CSS só podem ser aplicadas a elementos do tipo <div>, o que padroniza o código"
    ],

    answer: 1,

    feedback: "Correto: B. A principal vantagem das **classes CSS** é justamente a ==def==reutilização de estilos==: define-se uma vez na classe e aplica-se em quantos elementos forem necessários. Isso reduz retrabalho, centraliza a manutenção e mantém a consistência visual em todo o projeto."
  },

  // Questão 36
  {
  aula: "Aula 12 - CSS e HTML Comandos Básicos",
    tipo: "Múltiplas afirmativas",

    texto: "Um analista de sistemas está revisando o código HTML de um relatório gerado automaticamente pelo sistema de uma empresa. O relatório exibe dados tabulares de vendas mensais. O analista precisa verificar se a estrutura das tabelas HTML está semanticamente correta.",

    question: "Avalie as afirmativas abaixo sobre a estrutura de ==def==tabelas HTML==:",

    assertions: [
      "I. A tag `<thead>` agrupa as linhas de cabeçalho da tabela, contribuindo para a organização semântica do conteúdo.",
      "II. A tag `<th>` define células de dados comuns no corpo da tabela, enquanto `<td>` define os títulos de coluna.",
      "III. A tag `<tr>` representa uma linha dentro da tabela, podendo estar tanto no `<thead>` quanto no `<tbody>`.",
      "IV. A tag `<table>` é o elemento raiz que envolve toda a estrutura da tabela HTML."
    ],

    options: [
      "I, II e III, apenas",
      "I, III e IV, apenas",
      "II e IV, apenas",
      "I, II, III e IV"
    ],

    answer: 1,

    feedback: "Correto: B. As afirmativas **I, III e IV** estão corretas. A afirmativa II está **invertida**: ==danger==`<th>`== define títulos de coluna (cabeçalho), e `<td>` define células de dados comuns. Essa inversão é uma armadilha conceitual frequente em avaliações sobre estrutura de tabelas."
  },

  // Questão 37
  {
  aula: "Aula 12 - CSS e HTML Comandos Básicos",
    tipo: "Asserção + Justificativa",

    texto: "Uma equipe de UX/UI está desenvolvendo um menu de navegação horizontal para um portal corporativo. O líder técnico recomenda o uso de `display: flex` no elemento `<nav>` para organizar os itens do menu.",

    question: "Analise as asserções sobre o uso de ==dml==display: flex== no contexto de menus de navegação:",

    assertions: [
      "I. A propriedade `display: flex` organiza os elementos filhos horizontalmente e de forma flexível, sendo adequada para construção de menus modernos.",
      "[PORQUE] II. Sem `display: flex`, elementos `<li>` dentro de `<ul>` são exibidos em bloco, verticalmente empilhados por padrão."
    ],

    options: [
      "As asserções I e II são verdadeiras, e II justifica I",
      "As asserções I e II são verdadeiras, mas II não justifica I",
      "A asserção I é verdadeira e a II é falsa",
      "A asserção I é falsa e a II é verdadeira"
    ],

    answer: 0,

    feedback: "Correto: A. Ambas são verdadeiras e há justificativa direta: **`display: flex`** é recomendado para menus exatamente porque, sem ele, os `<li>` são exibidos verticalmente por padrão. A necessidade de horizontalizar os itens justifica o uso do ==dml==flex==."
  },

  // Questão 38
  {
  aula: "Aula 12 - CSS e HTML Comandos Básicos",
    tipo: "Conceitual contextualizada",

    texto: "Durante uma revisão de código em uma startup de tecnologia, o desenvolvedor sênior questiona o uso indiscriminado de `<div>` para todas as seções do site, incluindo o menu principal, o rodapé e as seções de conteúdo. Ele sugere substituí-las por tags semânticas adequadas.",

    question: "Considerando os ==def==elementos semânticos== do HTML5, assinale a alternativa que apresenta a substituição correta das `<div>` pelas tags semânticas correspondentes:",

    options: [
      "<section> para o menu de navegação, <nav> para o rodapé e <footer> para as seções de conteúdo",
      "<nav> para o menu de navegação, <footer> para o rodapé e <section> para as seções de conteúdo",
      "<footer> para o menu de navegação, <section> para o rodapé e <nav> para as seções de conteúdo",
      "<nav> para o menu, <section> para o rodapé e <div> mantida para as seções de conteúdo"
    ],

    answer: 1,

    feedback: "Correto: B. A correspondência semântica correta é: **`<nav>`** para menus de navegação, **`<footer>`** para o rodapé e **`<section>`** para divisões de conteúdo. Cada tag ==def==semântica== carrega um significado específico que auxilia buscadores e tecnologias assistivas a interpretarem a estrutura da página."
  },

  // Questão 39
  {
  aula: "Aula 12 - CSS e HTML Comandos Básicos",
    tipo: "Múltiplas afirmativas",

    texto: "Um designer front-end está documentando as propriedades CSS mais utilizadas no projeto de um sistema de gestão. Ele elabora uma lista com descrições de cada propriedade para treinamento da equipe.",

    question: "Avalie as afirmativas abaixo sobre ==def==propriedades CSS==:",

    assertions: [
      "I. A propriedade `padding` define o espaçamento interno entre o conteúdo do elemento e sua borda.",
      "II. A propriedade `margin` define o espaçamento externo entre o elemento e os demais elementos ao redor.",
      "III. A propriedade `border-radius` define a espessura e a cor da borda de um elemento.",
      "IV. A propriedade `text-transform` permite alterar a capitalização do texto, com valores como `uppercase` e `lowercase`."
    ],

    options: [
      "I, II e III, apenas",
      "I, II e IV, apenas",
      "II, III e IV, apenas",
      "I, II, III e IV"
    ],

    answer: 1,

    feedback: "Correto: B. As afirmativas **I, II e IV** estão corretas. A afirmativa III está errada: ==danger==`border-radius`== arredonda as bordas do elemento — quem define espessura e cor da borda é a propriedade `border`. Essa confusão entre `border` e `border-radius` é um erro conceitual comum."
  },

  // Questão 40
  {
  aula: "Aula 12 - CSS e HTML Comandos Básicos",
    tipo: "Análise aplicada",

    texto: "Um desenvolvedor criou um arquivo HTML e um arquivo CSS separados. Ao abrir a página no navegador, nenhum estilo foi aplicado. Ao inspecionar o código, encontrou o seguinte trecho no arquivo HTML:",

    question: "Analisando o trecho abaixo e considerando a ==rule==vinculação correta de CSS externo==, identifique o problema e a solução adequada:",

    code: `<body>
    <link rel="stylesheet" href="assets/css/style.css">
    <h1>Meu Site</h1>
  </body>`,

    options: [
      "O problema é o caminho do arquivo CSS; ele deve estar na raiz do projeto como style.css",
      "O problema é a posição da tag <link>: ela deve estar dentro do <head>, não do <body>",
      "O problema é o atributo rel; o valor correto é rel='style' e não rel='stylesheet'",
      "Não há problema; navegadores modernos aceitam a tag <link> dentro do <body> sem perda de estilos"
    ],

    answer: 1,

    feedback: "Correto: B. A tag **`<link rel='stylesheet'>`** deve ser inserida dentro do `<head>`, não do `<body>`. Embora alguns navegadores modernos façam renderização parcial, a ==rule==prática correta e padronizada== é posicioná-la no `<head>` para garantir que os estilos sejam carregados antes da renderização do conteúdo visível."
  },

  // Aula 13 - Landing page com HTML

  // Questão 41
  {
    aula: "Aula 13 - Landing page com HTML",
    tipo: "Conceitual contextualizada",

    texto: "Uma agência de marketing digital foi contratada para criar uma presença online para o lançamento de um novo produto de beleza. A equipe decidiu desenvolver uma página web dedicada exclusivamente à campanha, com foco em conversão de visitantes, captura de e-mails e apresentação objetiva do produto. A página não teria menu de navegação para outros conteúdos nem links externos que desviassem a atenção do visitante.",

    question: "Com base nas características descritas, essa página se enquadra no conceito de ==def==landing page==. Assinale a alternativa que melhor define esse tipo de página:",

    options: [
      "Página principal de um site institucional, com menu completo e links para todas as seções da empresa.",
      "Página única com foco em conversão, comunicação direta e poucos elementos distrativos, voltada para campanhas e captação de leads.",
      "Página de blog com múltiplos artigos, categorias e sistema de comentários para engajamento do público.",
      "Painel administrativo com formulários de cadastro e relatórios de acesso para controle interno da empresa."
    ],

    answer: 1,

    feedback: "Correto: B. A ==def==landing page== é uma página única criada com foco em conversão, marketing e captação de contatos. Suas características centrais são: conteúdo objetivo, ausência de elementos distrativos e comunicação visual simples e direta. As demais alternativas descrevem outros tipos de páginas sem essa finalidade específica."
  },

  // Questão 42
  {
    aula: "Aula 13 - Landing page com HTML",
    tipo: "Asserção + Justificativa",

    texto: "Ao iniciar o desenvolvimento de uma landing page, o líder técnico de uma startup orientou a equipe a organizar os arquivos do projeto em uma estrutura de pastas separando o HTML na raiz e os arquivos de CSS e imagens dentro de uma pasta chamada assets, com subpastas específicas para cada tipo de recurso.",

    question: "Analise as asserções a seguir sobre a organização de projetos web:",

    assertions: [
      "A separação de arquivos em pastas como ==def==assets/css== e assets/img melhora a manutenção, a organização e a escalabilidade do projeto.",
      "[PORQUE] A mistura de arquivos HTML, CSS e imagens em um único diretório dificulta a localização de recursos à medida que o projeto cresce, aumentando o risco de erros e retrabalho."
    ],

    options: [
      "As asserções I e II são verdadeiras, e II justifica I",
      "As asserções I e II são verdadeiras, mas II não justifica I",
      "A asserção I é verdadeira e a II é falsa",
      "A asserção I é falsa e a II é verdadeira"
    ],

    answer: 0,

    feedback: "Correto: A. Ambas as asserções são verdadeiras e há relação direta de justificativa. A organização em ==def==assets/css== e assets/img é uma boa prática porque evita exatamente o problema descrito em II: à medida que o projeto cresce, a desorganização de arquivos aumenta o risco de erros. Portanto, II justifica I diretamente."
  },

  // Questão 43
  {
    aula: "Aula 13 - Landing page com HTML",
    tipo: "Múltiplas afirmativas",

    texto: "Durante o desenvolvimento de uma landing page para um escritório de advocacia, a equipe de design debateu qual formato de imagem seria mais adequado para os ícones e ilustrações da página. Foram considerados os formatos JPEG, PNG, GIF e SVG, levando em conta qualidade visual, desempenho e adaptação a diferentes resoluções de tela.",

    question: "Avalie as afirmativas a seguir sobre o uso do formato ==def==SVG== em projetos web:",

    assertions: [
      "I. O SVG é um formato vetorial que mantém a qualidade visual independentemente do tamanho em que é exibido, sendo ideal para ícones e ilustrações em páginas responsivas.",
      "II. Arquivos SVG tendem a ser mais pesados que imagens JPEG de alta resolução, tornando-os inadequados para uso em páginas que priorizam desempenho.",
      "III. O SVG pode ser personalizado via CSS e JavaScript, permitindo alterações de cor, animação e interatividade diretamente no código.",
      "IV. O formato SVG é baseado em XML, o que permite que seu conteúdo seja lido e indexado por mecanismos de busca, contribuindo para acessibilidade e SEO."
    ],

    questionContinuation: "São corretas apenas as afirmativas:",

    options: [
      "I, III e IV, apenas",
      "I e III, apenas",
      "II e IV, apenas",
      "I, II, III e IV"
    ],

    answer: 0,

    feedback: "Correto: A (I, III e IV). O ==def==SVG== é vetorial e escalável sem perda de qualidade (I), pode ser manipulado via CSS e JavaScript (III) e é baseado em XML, favorecendo indexação e acessibilidade (IV). A afirmativa II está **errada**: SVGs são geralmente arquivos leves, especialmente para ícones e ilustrações simples — essa é justamente uma de suas vantagens em relação a imagens rasterizadas."
  },

  // Questão 44
  {
    aula: "Aula 13 - Landing page com HTML",
    tipo: "Asserção + Justificativa",

    texto: "Ao definir a identidade visual de uma landing page, a designer da equipe utilizou o Adobe Color para gerar uma paleta baseada em uma imagem de referência. Os códigos obtidos foram aplicados diretamente no CSS, como #F26D78 para o rosa e #635EF2 para o roxo. Um desenvolvedor júnior da equipe questionou o significado dos caracteres após o sustenido.",

    question: "Analise as asserções sobre a representação de ==def==cores em hexadecimal== no CSS:",

    assertions: [
      "No sistema hexadecimal de cores do CSS, o código #RRGGBB representa, respectivamente, os canais de vermelho, verde e azul, onde cada par de caracteres varia de 00 (ausência) a FF (intensidade máxima).",
      "[PORQUE] As cores na web são baseadas no modelo RGB, e a notação hexadecimal é apenas uma forma compacta de representar os valores decimais de cada canal de cor em uma única string."
    ],

    options: [
      "As asserções I e II são verdadeiras, e II justifica I",
      "As asserções I e II são verdadeiras, mas II não justifica I",
      "A asserção I é verdadeira e a II é falsa",
      "A asserção I é falsa e a II é verdadeira"
    ],

    answer: 0,

    feedback: "Correto: A. Ambas as asserções são verdadeiras e há relação de justificativa. A asserção I descreve corretamente a estrutura do código ==def==hexadecimal== no CSS. A asserção II explica o fundamento: a notação hexadecimal é uma representação compacta do modelo RGB, o que justifica por que cada par de caracteres corresponde a um canal de cor com variação de 00 a FF."
  },

  // Questão 45
  {
    aula: "Aula 13 - Landing page com HTML",
    tipo: "Múltiplas afirmativas",

    texto: "A equipe de design de uma fintech estava revisando a identidade visual de sua landing page. O debate central girava em torno da escolha tipográfica: alguns membros defendiam fontes serifadas tradicionais, outros preferiam fontes sans-serif modernas. O líder de UX reforçou que a tipografia não é apenas uma questão estética, mas um elemento funcional da comunicação visual.",

    question: "Avalie as afirmativas a seguir sobre ==def==tipografia== em projetos web:",

    assertions: [
      "I. A escolha inadequada de fontes pode prejudicar a legibilidade, a usabilidade e a experiência do usuário, independentemente da qualidade do conteúdo.",
      "II. As fontes transmitem sensações e valores da marca — uma fonte sem serifa tende a transmitir modernidade, enquanto fontes com serifa remetem a tradição e formalidade.",
      "III. O uso de Google Fonts é tecnicamente equivalente a hospedar as fontes localmente no servidor, sem diferenças de desempenho ou dependência de serviços externos.",
      "IV. A tipografia é um elemento essencial da comunicação visual e deve ser escolhida considerando o público-alvo, o contexto de uso e a identidade da marca."
    ],

    questionContinuation: "São corretas apenas as afirmativas:",

    options: [
      "I, II e IV, apenas",
      "I e IV, apenas",
      "II e III, apenas",
      "I, II, III e IV"
    ],

    answer: 0,

    feedback: "Correto: A (I, II e IV). A tipografia impacta diretamente usabilidade e leitura (I), comunica valores da marca (II) e deve ser escolhida com critério estratégico (IV). A afirmativa III está **errada**: fontes hospedadas via ==def==Google Fonts== dependem de conexão com servidores externos, o que pode impactar o desempenho em redes lentas ou quando o serviço estiver indisponível — ao contrário de fontes hospedadas localmente."
  },

  // Questão 46
  {
    aula: "Aula 13 - Landing page com HTML",
    tipo: "Conceitual contextualizada",

    texto: "Um desenvolvedor recebeu a tarefa de revisar o código HTML de uma landing page criada por um estagiário. Ao analisar o código, percebeu que toda a estrutura era composta exclusivamente por tags `<div>`, inclusive o menu de navegação, o rodapé, os blocos de serviços e as seções de conteúdo. O desenvolvedor sênior solicitou a refatoração usando tags semânticas do HTML5.",

    question: "Considerando as ==def==tags semânticas== do HTML5, assinale a alternativa que apresenta a correspondência correta entre os elementos da página e as tags adequadas:",

    options: [
      "<article> para o menu, <footer> para os serviços, <nav> para o rodapé e <section> para as seções de conteúdo.",
      "<nav> para o menu, <article> para os blocos de serviços, <section> para as seções de conteúdo e <footer> para o rodapé.",
      "<section> para o menu, <nav> para os blocos de serviços, <footer> para as seções de conteúdo e <article> para o rodapé.",
      "<footer> para o menu, <section> para os blocos de serviços, <article> para o rodapé e <nav> para as seções de conteúdo."
    ],

    answer: 1,

    feedback: "Correto: B. A correspondência semântica correta é: **`<nav>`** para o menu de navegação, **`<article>`** para blocos de conteúdo independente como serviços, **`<section>`** para divisões temáticas de conteúdo e **`<footer>`** para o rodapé. Cada ==def==tag semântica== carrega um significado específico que auxilia buscadores, tecnologias assistivas e outros desenvolvedores a compreenderem a estrutura da página."
  },

  // Questão 47
  {
    aula: "Aula 13 - Landing page com HTML",
    tipo: "Múltiplas afirmativas",

    texto: "Uma equipe de desenvolvimento estava implementando o formulário de contato de uma landing page. O formulário precisava coletar: nome completo, e-mail, data de nascimento, interesses do usuário (podendo selecionar mais de um), preferência de contato (apenas uma opção entre telefone, e-mail ou WhatsApp) e um botão para enviar os dados. Cada campo foi associado a um tipo de input do HTML.",

    question: "Avalie as afirmativas a seguir sobre os ==def==tipos de input== do HTML:",

    assertions: [
      "I. O tipo `radio` é adequado para o campo de preferência de contato, pois permite que o usuário selecione apenas uma opção dentro de um grupo.",
      "II. O tipo `checkbox` é adequado para o campo de interesses, pois permite que o usuário selecione múltiplas opções simultaneamente.",
      "III. O tipo `email` valida automaticamente se o valor digitado possui o formato de um endereço de e-mail válido antes do envio do formulário.",
      "IV. O tipo `submit` e o tipo `reset` têm a mesma função: ambos enviam os dados do formulário para o servidor definido no atributo action."
    ],

    questionContinuation: "São corretas apenas as afirmativas:",

    options: [
      "I, II e III, apenas",
      "I e II, apenas",
      "II e III, apenas",
      "I, II, III e IV"
    ],

    answer: 0,

    feedback: "Correto: A (I, II e III). O `radio` restringe a seleção a uma opção (I), o `checkbox` permite múltiplas seleções (II) e o `email` realiza validação de formato no cliente (III). A afirmativa IV está **errada**: ==danger==`reset`== limpa os campos do formulário para seus valores padrão — não envia dados. Apenas o `submit` envia o formulário ao servidor."
  },

  // Questão 48
  {
    aula: "Aula 13 - Landing page com HTML",
    tipo: "Análise aplicada",

    texto: "Uma desenvolvedora criou o seguinte trecho de formulário para uma landing page de captura de leads. Ao testar o formulário, percebeu que ao clicar no botão, todos os campos voltavam aos valores padrão em vez de enviar os dados.",

    question: "Analise o código abaixo e identifique o problema que causa o comportamento inesperado:",

    code: `<form action="/cadastro" method="post">
  <input type="text" name="nome" placeholder="Seu nome">
  <input type="email" name="email" placeholder="Seu e-mail">
  <input type="reset" value="Enviar">
</form>`,

    options: [
      "O problema está no atributo method: o correto para envio de dados de formulário é method='get'.",
      "O problema está no tipo do botão: foi usado type='reset', que limpa o formulário, quando o correto seria type='submit' para enviar os dados.",
      "O problema está na ausência do atributo name no botão de envio, o que impede o formulário de identificar qual ação executar.",
      "O código está correto; o comportamento descrito é o esperado para formulários com action definido."
    ],

    answer: 1,

    feedback: "Correto: B. O erro está na utilização de ==danger==`type='reset'`== no botão que deveria enviar o formulário. O tipo `reset` limpa todos os campos para seus valores padrão — comportamento exato descrito no enunciado. Para enviar os dados ao servidor, o tipo correto é `type='submit'`. Os demais atributos do formulário estão semanticamente corretos."
  },

  // Questão 49
  {
    aula: "Aula 13 - Landing page com HTML",
    tipo: "Asserção + Justificativa",

    texto: "O departamento de marketing de uma empresa percebeu que sua landing page não aparecia nas primeiras posições do Google, mesmo com conteúdo relevante. Ao contratar uma auditoria de SEO, o especialista identificou que todo o HTML era construído com `<div>` genéricas, sem nenhuma tag semântica, e que os títulos não usavam as tags `<h1>`, `<h2>` e `<h3>` adequadamente.",

    question: "Analise as asserções sobre ==def==Web Semântica== e sua relação com indexação e acessibilidade:",

    assertions: [
      "O uso de tags semânticas como `<nav>`, `<article>`, `<section>` e `<footer>` contribui para a melhor indexação da página por mecanismos de busca, pois fornece contexto sobre o papel de cada área do conteúdo.",
      "[PORQUE] A Web Semântica busca dar significado ao conteúdo das páginas para facilitar sua interpretação tanto por humanos quanto por sistemas automatizados, como buscadores e tecnologias assistivas."
    ],

    options: [
      "As asserções I e II são verdadeiras, e II justifica I",
      "As asserções I e II são verdadeiras, mas II não justifica I",
      "A asserção I é verdadeira e a II é falsa",
      "A asserção I é falsa e a II é verdadeira"
    ],

    answer: 0,

    feedback: "Correto: A. Ambas as asserções são verdadeiras e há relação direta de justificativa. A asserção II define o objetivo central da ==def==Web Semântica== — dar significado ao conteúdo para sistemas automatizados — o que explica diretamente por que o uso de tags semânticas descritas em I melhora a indexação pelos mecanismos de busca."
  },

  // Questão 50
  {
    aula: "Aula 13 - Landing page com HTML",
    tipo: "Análise aplicada",

    texto: "Uma equipe foi incumbida de desenvolver uma landing page completa para um escritório de contabilidade. O briefing definia os seguintes componentes: menu de navegação com links internos, seção de apresentação com imagem e slogan, grade com três serviços oferecidos, tabela comparativa de planos, formulário de contato e rodapé com informações institucionais.",

    question: "Avalie as afirmativas a seguir sobre a estrutura HTML semântica adequada para os componentes descritos:",

    assertions: [
      "I. O menu de navegação deve ser estruturado com `<nav>` contendo uma lista `<ul>` com itens `<li>` e links `<a>`, garantindo semântica e acessibilidade.",
      "II. Cada serviço da grade deve ser marcado com `<article>`, pois representa um bloco de conteúdo independente com imagem, título e descrição.",
      "III. A tabela comparativa de planos deve ser construída com `<table>`, usando `<thead>` para o cabeçalho, `<tbody>` para os dados, `<th>` para títulos de coluna e `<td>` para os valores.",
      "IV. O rodapé deve ser implementado com `<div id='rodape'>`, pois a tag `<footer>` é reservada exclusivamente para páginas com múltiplas seções e não se aplica a landing pages de página única."
    ],

    questionContinuation: "São corretas apenas as afirmativas:",

    options: [
      "I, II e III, apenas",
      "I e III, apenas",
      "II e IV, apenas",
      "I, II, III e IV"
    ],

    answer: 0,

    feedback: "Correto: A (I, II e III). A estrutura de `<nav>` com lista é semanticamente correta para menus (I). O `<article>` é adequado para blocos de conteúdo independente como serviços (II). A estrutura de tabela com `<thead>`, `<tbody>`, `<th>` e `<td>` segue a semântica correta (III). A afirmativa IV está **errada**: ==danger==`<footer>`== é uma tag semântica de uso geral, aplicável a qualquer página web — inclusive landing pages de página única. Não existe essa restrição."
  },

  // aula 14 Formatando com CSS

  // 51 - vinculação HTML/CSS
  {
    aula: "Aula 14 - Formatando com CSS",
    tipo: "Conceitual contextualizada",

    texto: "Uma equipe de desenvolvimento iniciou um projeto de landing page. O designer entregou o arquivo style.css com todas as regras visuais definidas, mas ao abrir o HTML no navegador, a página aparece completamente sem estilo. O desenvolvedor responsável precisa identificar o que está faltando.",

    question: "Qual é a causa mais provável para a página não aplicar o CSS, e como corrigi-la?",

    options: [
      "O arquivo CSS está com nome errado e deve ser renomeado para index.css",
      "Falta a tag <link rel='stylesheet' href='style.css'> no <head> do HTML",
      "O navegador precisa ser reiniciado para carregar arquivos CSS externos",
      "O CSS só funciona se escrito dentro de uma tag <style> no próprio HTML"
    ],

    answer: 1,

    feedback: "Correto: B. Para que o navegador carregue um arquivo CSS externo, é obrigatória a presença da tag **<link>** com rel='stylesheet' e o caminho correto no atributo href, inserida no <head> do HTML."
  },

  // 52 - separação estrutura/estilo
  {
    aula: "Aula 14 - Formatando com CSS",
    tipo: "Asserção + Justificativa",

    texto: "No desenvolvimento web moderno, é prática consolidada manter o HTML e o CSS em arquivos separados. Essa abordagem reflete o princípio de separação de responsabilidades, onde cada tecnologia tem um papel bem definido no projeto.",

    question: "Analise a asserção e a justificativa a seguir:",

    assertions: [
      "Manter o CSS em arquivo externo separado do HTML facilita a manutenção e permite reutilizar o mesmo estilo em múltiplas páginas.",
      "[PORQUE] O CSS externo é carregado pelo navegador uma única vez e pode ser armazenado em cache, além de deixar o HTML focado apenas na estrutura do conteúdo."
    ],

    options: [
      "As duas afirmativas são verdadeiras, e a II justifica a I",
      "As duas afirmativas são verdadeiras, mas a II não justifica a I",
      "A afirmativa I é verdadeira e a II é falsa",
      "A afirmativa I é falsa e a II é verdadeira"
    ],

    answer: 0,

    feedback: "Correto: A. Ambas são verdadeiras. O arquivo CSS externo favorece **reaproveitamento** e manutenção, e a justificativa é válida: o cache do navegador reduz requisições e o HTML fica responsável apenas pela estrutura."
  },

  // 53 - seletores classe vs ID
  {
    aula: "Aula 14 - Formatando com CSS",
    tipo: "Múltiplas afirmativas",

    texto: "Em CSS, classes e IDs são os dois principais tipos de seletores usados para aplicar estilos a elementos HTML. Cada um tem características e casos de uso distintos que influenciam diretamente na organização e manutenção do código.",

    question: "Avalie as afirmações a seguir sobre ==ddl==classes== e ==ddl==IDs== no CSS:",

    assertions: [
      "I. Classes são identificadas pelo símbolo . no CSS e podem ser aplicadas em múltiplos elementos da página.",
      "II. IDs são identificados pelo símbolo # e devem ser únicos por página.",
      "III. Uma mesma classe pode ser usada em elementos de tipos diferentes, como <div> e <section>.",
      "IV. IDs e classes têm exatamente o mesmo nível de especificidade no CSS."
    ],

    options: [
      "I, II e III, apenas",
      "I e III, apenas",
      "II e IV, apenas",
      "I, II, III e IV"
    ],

    answer: 0,

    feedback: "Correto: A. As afirmativas I, II e III são verdadeiras. A IV é falsa: **IDs têm especificidade maior** que classes no CSS, o que significa que regras com ID sobrepõem regras com classe quando há conflito."
  },

  // 54 - variáveis CSS
  {
    aula: "Aula 14 - Formatando com CSS",
    tipo: "Análise aplicada",

    texto: "Uma desenvolvedora está estilizando uma landing page com várias seções que compartilham a mesma paleta de cores. Atualmente, ela repete o valor #414059 em mais de 20 propriedades diferentes no arquivo CSS. O cliente avisou que pode pedir mudanças na identidade visual ao longo do projeto.",

    question: "Considerando a situação descrita, qual abordagem tornaria a manutenção do código mais eficiente diante de possíveis mudanças de cor?",

    options: [
      "Usar um comentário no topo do CSS indicando qual cor deve ser alterada manualmente",
      "Criar uma classe .cor-padrao e aplicar em todos os elementos que usam a cor",
      "Declarar a cor como variável CSS em :root e referenciar com var() em todas as propriedades",
      "Substituir o valor hexadecimal por um nome de cor equivalente em inglês"
    ],

    answer: 2,

    feedback: "Correto: C. ==ddl==Variáveis CSS== declaradas em :root centralizam o valor em um único ponto. Ao mudar --cor-azulescuro: #414059 para outro valor, todos os elementos que usam **var(--cor-azulescuro)** são atualizados automaticamente."
  },

  // 55 - Flexbox
  {
    aula: "Aula 14 - Formatando com CSS",
    tipo: "Asserção + Justificativa",

    texto: "No projeto da landing page, o menu de navegação precisa posicionar o logotipo à esquerda e os links de navegação à direita, ocupando toda a largura do cabeçalho. Para isso, foi utilizado Flexbox com a propriedade justify-content: space-between.",

    question: "Analise a asserção e a justificativa:",

    assertions: [
      "O uso de ==def==display: flex== com justify-content: space-between é adequado para distribuir o logo e os links nos extremos opostos do menu.",
      "[PORQUE] O justify-content: space-between distribui os itens de forma que o primeiro fique no início e o último no fim do container, sem cálculo manual de margens."
    ],

    options: [
      "As duas afirmativas são verdadeiras, e a II justifica a I",
      "As duas afirmativas são verdadeiras, mas a II não justifica a I",
      "A afirmativa I é verdadeira e a II é falsa",
      "A afirmativa I é falsa e a II é verdadeira"
    ],

    answer: 0,

    feedback: "Correto: A. Ambas são verdadeiras e a relação é válida. **justify-content: space-between** posiciona o primeiro item no início e o último no fim do container flex, sendo ideal para menus com logo e links."
  },

  // 56 - menu fixo
  {
    aula: "Aula 14 - Formatando com CSS",
    tipo: "Conceitual contextualizada",

    texto: "Em uma landing page de página única, o usuário precisa rolar bastante para acessar seções diferentes. O cliente solicitou que o menu de navegação permaneça sempre visível no topo da tela, independente de quanto o usuário role a página.",

    question: "Qual propriedade CSS implementa corretamente esse comportamento?",

    options: [
      "position: relative e top: 0, para manter o menu no fluxo da página",
      "position: absolute e top: 0, para posicionar o menu em relação ao container pai",
      "position: fixed e top: 0, para fixar o menu em relação à janela do navegador",
      "display: sticky e top: 0, para tornar o menu visível apenas na rolagem"
    ],

    answer: 2,

    feedback: "Correto: C. ==def==position: fixed== remove o elemento do fluxo normal do documento e o mantém posicionado em relação à viewport — a janela do navegador. Com top: 0, o menu fica sempre no topo independente da rolagem."
  },

  // 57 - CSS Grid
  {
    aula: "Aula 14 - Formatando com CSS",
    tipo: "Múltiplas afirmativas",

    texto: "O CSS Grid é um sistema de layout bidimensional amplamente usado para organizar seções de páginas web em colunas e linhas. Na landing page da aula, foram utilizados grids de duas e três colunas para estruturar o conteúdo visualmente.",

    question: "Avalie as afirmações sobre ==ddl==CSS Grid==:",

    assertions: [
      "I. A propriedade grid-template-columns: 1fr 1fr cria duas colunas de tamanho igual.",
      "II. A unidade fr representa uma fração do espaço disponível no container do grid.",
      "III. Para ativar o grid em um elemento, é necessário declarar display: grid.",
      "IV. O CSS Grid só funciona corretamente se combinado com Flexbox no mesmo elemento."
    ],

    options: [
      "I, II e III, apenas",
      "I e II, apenas",
      "II, III e IV, apenas",
      "I, II, III e IV"
    ],

    answer: 0,

    feedback: "Correto: A. As afirmativas I, II e III são verdadeiras. A IV é falsa: **Grid e Flexbox são sistemas independentes** e não precisam ser usados juntos. Cada um resolve diferentes problemas de layout."
  },

  // 58 - background-image
  {
    aula: "Aula 14 - Formatando com CSS",
    tipo: "Análise aplicada",

    texto: "Um desenvolvedor aplicou uma imagem de fundo em uma seção da landing page usando background-image, mas a imagem está aparecendo cortada e não ocupa toda a área da seção. Ele quer que a imagem cubra completamente o espaço disponível, mesmo que parte dela seja cortada nas bordas.",

    question: "Qual propriedade CSS resolve corretamente o problema descrito?",

    options: [
      "background-size: contain, para exibir a imagem inteira sem corte",
      "background-size: cover, para cobrir toda a área mesmo que a imagem seja parcialmente cortada",
      "background-position: center, para centralizar a imagem sem redimensioná-la",
      "background-repeat: no-repeat, para impedir que a imagem se repita na área"
    ],

    answer: 1,

    feedback: "Correto: B. ==def==background-size: cover== faz a imagem escalar para cobrir completamente a área do elemento, cortando o excesso quando necessário. É diferente de contain, que exibe a imagem inteira sem corte mas pode deixar espaços vazios."
  },

  // 59 - responsividade de imagem
  {
    aula: "Aula 14 - Formatando com CSS",
    tipo: "Asserção + Justificativa",

    texto: "Ao montar um layout com CSS Grid de duas colunas, as imagens inseridas nas colunas estavam ultrapassando os limites da coluna e quebrando o layout em telas menores. A solução aplicada foi adicionar max-width: 100% e height: auto às imagens.",

    question: "Analise a asserção e a justificativa:",

    assertions: [
      "Aplicar max-width: 100% e height: auto nas imagens é uma prática eficaz para evitar que elas ultrapassem os limites do container e se distorçam.",
      "[PORQUE] O max-width: 100% limita a largura da imagem ao tamanho do seu container, e o height: auto preserva a proporção original da imagem automaticamente."
    ],

    options: [
      "As duas afirmativas são verdadeiras, e a II justifica a I",
      "As duas afirmativas são verdadeiras, mas a II não justifica a I",
      "A afirmativa I é verdadeira e a II é falsa",
      "A afirmativa I é falsa e a II é verdadeira"
    ],

    answer: 0,

    feedback: "Correto: A. Ambas são verdadeiras e a justificativa é direta: **max-width: 100%** impede que a imagem extrapole o container, e **height: auto** garante que a proporção seja mantida ao redimensionar."
  },

  // 60 - navegação com IDs
  {
    aula: "Aula 14 - Formatando com CSS",
    tipo: "Conceitual contextualizada",

    texto: "Em uma landing page de página única, todas as seções — introdução, serviços, sobre e contato — estão empilhadas verticalmente. O cliente quer que os links do menu levem o usuário diretamente a cada seção ao clicar, sem carregar uma nova página.",

    question: "Qual combinação de HTML implementa corretamente essa navegação interna?",

    options: [
      "Usar class='servicos' na seção e href='servicos' no link do menu",
      "Usar id='servicos' na seção e href='#servicos' no link do menu",
      "Usar name='servicos' na seção e href='/servicos' no link do menu",
      "Usar data-section='servicos' na seção e href='?section=servicos' no link do menu"
    ],

    answer: 1,

    feedback: "Correto: B. A navegação interna é feita com **id** no elemento de destino e href='#id' no link. Ao clicar, o navegador rola automaticamente até o elemento com aquele identificador, sem recarregar a página."
  },
  
    // aula: Aula 15 - Revisão Projeto de Design para Web

    // 61 - Mobile First
    {
      aula: "Aula 15 - Revisão Projeto de Design para Web",
      tipo: "Asserção + Justificativa",

      texto: "A abordagem Mobile First tem se consolidado como estratégia preferencial no desenvolvimento web moderno, especialmente diante do crescente uso de smartphones para acesso à internet.",

      question: "Avalie a asserção e a justificativa a seguir sobre o ==def==Mobile First==.",

      assertions: [
        "I. O Mobile First prioriza o desenvolvimento para telas pequenas antes de adaptar o layout para dispositivos maiores.",
        "[PORQUE] II. Iniciar o desenvolvimento pelo menor contexto de tela obriga o designer a focar no ==rule==conteúdo essencial==, resultando em código mais organizado e layouts progressivamente mais ricos."
      ],

      options: [
        "I e II são verdadeiras, e II justifica I",
        "I e II são verdadeiras, mas II não justifica I",
        "I é verdadeira e II é falsa",
        "I é falsa e II é verdadeira"
      ],

      answer: 0,

      feedback: "Correto: A. O **Mobile First** parte das telas menores para as maiores, e essa restrição inicial força a priorização do essencial, o que de fato justifica a produção de código mais limpo e bem estruturado."
    },

    // 62 - Design Centrado Usuário
    {
      aula: "Aula 15 - Revisão Projeto de Design para Web",
      tipo: "Múltiplas afirmativas",

      texto: "Uma equipe de design web está revisando os princípios que devem nortear o projeto de uma nova interface. O líder do time afirma que o Design Centrado no Usuário envolve múltiplas dimensões além da estética.",

      question: "Considerando os pilares do ==def==Design Centrado no Usuário==, assinale as afirmativas corretas.",

      assertions: [
        "I. A acessibilidade é um dos aspectos considerados no Design Centrado no Usuário.",
        "II. A comunicabilidade diz respeito à capacidade da interface de transmitir suas funções ao usuário.",
        "III. O conforto cognitivo é irrelevante, pois o usuário se adapta à interface com o tempo.",
        "IV. A facilidade de navegação é um requisito do projeto centrado no usuário."
      ],

      options: [
        "I, II e IV, apenas",
        "I e III, apenas",
        "II e III, apenas",
        "I, II, III e IV"
      ],

      answer: 0,

      feedback: "Correto: A. O **Design Centrado no Usuário** inclui acessibilidade, comunicabilidade e facilidade de navegação. A afirmativa III está errada pois o ==warn==conforto cognitivo== é explicitamente considerado um requisito do projeto."
    },

    // 63 - Ergonomia critérios
    {
      aula: "Aula 15 - Revisão Projeto de Design para Web",
      tipo: "Análise aplicada",

      texto: "Durante uma auditoria de usabilidade, um especialista identifica que a interface de um sistema não fornece orientações claras sobre onde o usuário está e quais ações podem ser realizadas. Os menus mudam de posição entre as telas e os rótulos variam para a mesma função.",

      question: "Com base nos critérios ergonômicos de interfaces, quais dois critérios estão sendo ==warn==violados== nesse sistema?",

      options: [
        "Adaptabilidade e Controle explícito",
        "Condução e Homogeneidade",
        "Gestão de erros e Compatibilidade",
        "Carga de trabalho e Adaptabilidade"
      ],

      answer: 1,

      feedback: "Correto: B. **Condução** refere-se à orientação da navegação — ausente quando o usuário não sabe onde está. **Homogeneidade** exige padrões consistentes — violada quando menus e rótulos variam entre telas."
    },

    // 64 - Engenharia Semiótica
    {
      aula: "Aula 15 - Revisão Projeto de Design para Web",
      tipo: "Asserção + Justificativa",

      texto: "A Engenharia Semiótica propõe que toda interface é, em essência, uma mensagem do designer para o usuário, mediada pelo sistema.",

      question: "Avalie a asserção e a justificativa a seguir sobre a ==def==Engenharia Semiótica==.",

      assertions: [
        "I. A interface comunica significados por meio de signos visuais, símbolos, comportamentos e feedbacks.",
        "[PORQUE] II. O sistema atua como canal de comunicação entre o ==proc==designer== e o usuário, transmitindo intenções de uso por meio dos elementos da interface."
      ],

      options: [
        "I e II são verdadeiras, e II justifica I",
        "I e II são verdadeiras, mas II não justifica I",
        "I é verdadeira e II é falsa",
        "I é falsa e II é verdadeira"
      ],

      answer: 0,

      feedback: "Correto: A. Na **Engenharia Semiótica**, o sistema é o meio pelo qual o designer comunica suas intenções ao usuário, e os signos visuais, comportamentos e feedbacks são os elementos dessa comunicação — II justifica I diretamente."
    },

    // 65 - Inspeção semiótica
    {
      aula: "Aula 15 - Revisão Projeto de Design para Web",
      tipo: "Múltiplas afirmativas",

      texto: "Uma equipe aplica o método de Inspeção Semiótica em uma interface web educacional. Cada membro é responsável por conduzir uma das etapas previstas no método.",

      question: "Assinale as etapas que fazem parte da ==def==Inspeção Semiótica== conforme o conteúdo estudado.",

      assertions: [
        "I. Inspeção de signos metalinguísticos.",
        "II. Teste de carga de trabalho cognitivo.",
        "III. Comparação das metamensagens.",
        "IV. Avaliação da metacomunicação."
      ],

      options: [
        "I, III e IV, apenas",
        "I e II, apenas",
        "II, III e IV, apenas",
        "I, II, III e IV"
      ],

      answer: 0,

      feedback: "Correto: A. As etapas da **Inspeção Semiótica** são: inspeção de signos metalinguísticos, estáticos e dinâmicos, comparação das metamensagens e avaliação da metacomunicação. ==warn==Teste de carga de trabalho== não pertence a esse método."
    },

    // 66 - Psicologia cognitiva
    {
      aula: "Aula 15 - Revisão Projeto de Design para Web",
      tipo: "Conceitual contextualizada",

      texto: "Um designer percebe que usuários abandonam o formulário de cadastro de seu site após poucos segundos. Ao analisar a interface, nota que há muitos campos, textos longos e opções em excesso exibidas simultaneamente.",

      question: "Considerando os fatores cognitivos do design, qual conceito da ==def==Psicologia Cognitiva== está sendo mais diretamente comprometido nessa situação?",

      options: [
        "Vigilância",
        "Categorização",
        "Memória de longo prazo",
        "Memória de curto prazo"
      ],

      answer: 3,

      feedback: "Correto: D. A **memória de curto prazo** tem capacidade limitada. Interfaces com excesso de informações simultâneas sobrecarregam esse recurso, dificultando a retenção momentânea e aumentando o abandono da tarefa."
    },

    // 67 - Tipografia hierarquia
    {
      aula: "Aula 15 - Revisão Projeto de Design para Web",
      tipo: "Asserção + Justificativa",

      texto: "A escolha tipográfica em projetos web vai além da estética — ela impacta diretamente a experiência de leitura e a percepção da identidade visual.",

      question: "Avalie a asserção e a justificativa sobre o papel da ==def==tipografia== no design web.",

      assertions: [
        "I. Utilizar fontes distintas para títulos e textos corridos contribui para a criação de hierarquia visual na interface.",
        "[PORQUE] II. A ==rule==hierarquia visual== orienta o olhar do usuário, indicando quais informações têm maior relevância dentro da página."
      ],

      options: [
        "I e II são verdadeiras, e II justifica I",
        "I e II são verdadeiras, mas II não justifica I",
        "I é verdadeira e II é falsa",
        "I é falsa e II é verdadeira"
      ],

      answer: 0,

      feedback: "Correto: A. A diferenciação tipográfica entre títulos e textos cria **hierarquia visual**, e essa hierarquia de fato orienta o olhar do usuário — II justifica I de forma direta e coerente."
    },

    // 68 - Cores semiótica
    {
      aula: "Aula 15 - Revisão Projeto de Design para Web",
      tipo: "Múltiplas afirmativas",

      texto: "Na definição da paleta de cores de um projeto web, o designer deve considerar múltiplas dimensões além da preferência estética pessoal.",

      question: "Assinale as afirmativas corretas sobre o uso de ==def==cores== no design para web.",

      assertions: [
        "I. As cores possuem valor emocional, psicológico e semiótico.",
        "II. O contraste e a harmonia são fatores relevantes na definição do esquema cromático.",
        "III. A temperatura da cor não interfere na percepção do usuário sobre a interface.",
        "IV. O significado visual das cores deve ser considerado no projeto."
      ],

      options: [
        "I, II e IV, apenas",
        "I e III, apenas",
        "II, III e IV, apenas",
        "I, II, III e IV"
      ],

      answer: 0,

      feedback: "Correto: A. As cores têm **valor emocional, psicológico e semiótico**, e o esquema deve considerar contraste, harmonia e significado. A afirmativa III está errada: ==warn==temperatura da cor== influencia diretamente a percepção e o estado emocional do usuário."
    },

    // 69 - HTML semântico
    {
      aula: "Aula 15 - Revisão Projeto de Design para Web",
      tipo: "Análise aplicada",

      texto: "Um desenvolvedor junior está estruturando o HTML de um portal de notícias. Ele utiliza apenas `<div>` para organizar todos os blocos da página — cabeçalho, navegação, conteúdo principal, artigos individuais e rodapé.",

      question: "Avalie as consequências dessa escolha em relação ao uso de ==def==elementos semânticos== do HTML5.",

      options: [
        "Não há impacto, pois `<div>` e elementos semânticos têm o mesmo comportamento visual e estrutural",
        "O uso exclusivo de `<div>` prejudica a acessibilidade e a legibilidade do código, pois elementos como `<nav>`, `<article>` e `<footer>` comunicam significado estrutural",
        "Elementos semânticos são recomendados apenas para projetos com JavaScript, sendo `<div>` suficiente em páginas estáticas",
        "O impacto é exclusivamente estético, sem relação com hierarquia ou navegabilidade"
      ],

      answer: 1,

      feedback: "Correto: B. Elementos como **`<nav>`**, **`<article>`** e **`<footer>`** comunicam a função estrutural de cada bloco, beneficiando acessibilidade, SEO e legibilidade do código. ==warn==Usar apenas `<div>`== elimina esse significado semântico."
    },

    // 70 - FontAwesome ícones
    {
      aula: "Aula 15 - Revisão Projeto de Design para Web",
      tipo: "Conceitual contextualizada",

      texto: "Durante o desenvolvimento do projeto web do módulo, a equipe decidiu incorporar ícones à interface para complementar textos e facilitar a identificação de funcionalidades pelos usuários.",

      question: "Qual biblioteca foi utilizada para implementar ícones no projeto, e qual o principal objetivo dessa escolha segundo o conteúdo estudado?",

      options: [
        "Bootstrap Icons, para garantir responsividade automática dos ícones",
        "Material Icons, para padronizar o visual com o ecossistema Google",
        "FontAwesome, para melhorar a comunicação visual e facilitar a navegação",
        "Heroicons, para reduzir o tempo de carregamento da página"
      ],

      answer: 2,

      feedback: "Correto: C. O projeto utilizou **FontAwesome** com os objetivos explícitos de melhorar a comunicação visual e facilitar a navegação, integrando os ícones como elementos semióticos da interface."
    }


  ],

  // ── Questões de Fixação ────────────────────────────────────
  fixacao: [

    // Aula 9 — Prototipagem e Norma ISO 9241
    // Questão 1
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

    // Questão 2
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

    // Questão 3
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

    // Questão 4
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

    // Questão 5
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

    // Questão 6
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

    // Questão 7
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

    // Questão 8
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

    // Questão 9
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

    // Questão 10
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

    // Aula 10 — Design de Interfaces e Prototipação
    // Questão 11
    {
      aula: "Aula 10 — Design de Interfaces e Prototipação",
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

    // Questão 12
    {
      aula: "Aula 10 — Design de Interfaces e Prototipação",
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

    // Questão 13
    {
      aula: "Aula 10 — Design de Interfaces e Prototipação",
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

    // Questão 14
    {
      aula: "Aula 10 — Design de Interfaces e Prototipação",
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

    // Questão 15
    {
      aula: "Aula 10 — Design de Interfaces e Prototipação",
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

    // Questão 16
    {
      aula: "Aula 10 — Design de Interfaces e Prototipação",
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

    // Questão 17
    {
      aula: "Aula 10 — Design de Interfaces e Prototipação",
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

    // Questão 18
    {
      aula: "Aula 10 — Design de Interfaces e Prototipação",
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

    // Questão 19
    {
      aula: "Aula 10 — Design de Interfaces e Prototipação",
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

    // Questão 20
    {
      aula: "Aula 10 — Design de Interfaces e Prototipação",
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

    // Aula 11 — Design Responsivo
    // Questão 21
    {
      aula: "Aula 11 — Design Responsivo",
      tipo: "Direta",
      texto: "O design responsivo é uma abordagem fundamental no desenvolvimento web moderno.",
      question: "O que caracteriza um site com design responsivo?",
      options: [
        "Ter um layout fixo com largura de 1200px",
        "Adaptar-se a diferentes tamanhos de tela sem perder usabilidade",
        "Usar apenas imagens vetoriais para garantir qualidade",
        "Carregar versões diferentes do site para cada dispositivo"
      ],
      answer: 1,
      feedback: "Design responsivo significa que o site se adapta automaticamente a diferentes resoluções, reorganizando seus elementos para manter a usabilidade."
    },

    // Questão 22
    {
      aula: "Aula 11 — Design Responsivo",
      tipo: "Código",
      texto: "Considere o trecho de CSS abaixo.",
      question: "O que o código a seguir faz quando a largura da tela for menor ou igual a 600px?",
      code: `@media (max-width: 600px) {
      body {
        background-color: lightblue;
      }
    }`,
      options: [
        "Aplica fundo azul claro em todas as telas",
        "Remove o fundo da página em telas pequenas",
        "Aplica fundo azul claro apenas em telas com até 600px de largura",
        "Bloqueia o acesso ao site em dispositivos móveis"
      ],
      answer: 2,
      feedback: "A media query com max-width: 600px aplica o estilo somente quando a viewport tiver no máximo 600px de largura."
    },

    // Questão 23
    {
      aula: "Aula 11 — Design Responsivo",
      tipo: "Curta",
      texto: "A meta tag viewport é usada em páginas web para controlar a exibição em dispositivos móveis.",
      question: "Qual é o principal objetivo da meta tag viewport?",
      options: [
        "Definir o idioma da página",
        "Controlar o zoom e a escala de exibição no mobile",
        "Aumentar a velocidade de carregamento",
        "Bloquear o redimensionamento da janela no desktop"
      ],
      answer: 1,
      feedback: "A meta tag viewport impede que o navegador encolha o site e permite controlar a escala inicial da página em dispositivos móveis."
    },

    // Questão 24
    {
      aula: "Aula 11 — Design Responsivo",
      tipo: "Contexto",
      texto: "Um desenvolvedor percebeu que ao redimensionar a janela do navegador, os elementos do site quebravam e se sobrepunham. Ele decidiu revisar as unidades de medida usadas no CSS.",
      question: "Qual prática de layout fluido ajudaria a resolver esse problema?",
      options: [
        "Substituir medidas em % por valores fixos em px",
        "Usar apenas a unidade cm para larguras",
        "Usar medidas relativas como % e em no lugar de px",
        "Definir largura mínima de 1280px para todos os elementos"
      ],
      answer: 2,
      feedback: "O layout fluido usa medidas relativas (%, em) para que os elementos se adaptem proporcionalmente ao tamanho da tela."
    },

    // Questão 25
    {
      aula: "Aula 11 — Design Responsivo",
      tipo: "Direta",
      texto: "Existem diferentes estratégias para construir layouts responsivos.",
      question: "O que define a metodologia Mobile First?",
      options: [
        "Criar o site primeiro para desktop e depois adaptar para mobile",
        "Desenvolver o layout iniciando pelas telas menores e expandindo para as maiores",
        "Usar apenas dispositivos móveis para testar o site",
        "Desativar recursos visuais avançados em dispositivos móveis"
      ],
      answer: 1,
      feedback: "Mobile First consiste em projetar o layout começando pelos dispositivos de menor tela, garantindo o essencial, e depois expandindo para tablets e desktops."
    },

    // Questão 26
    {
      aula: "Aula 11 — Design Responsivo",
      tipo: "Curta",
      texto: "Breakpoints são pontos definidos no CSS onde o layout do site é alterado.",
      question: "Qual valor de breakpoint é normalmente associado a tablets?",
      options: [
        "480px",
        "768px",
        "1280px",
        "960px"
      ],
      answer: 1,
      feedback: "O breakpoint de 768px é o mais comumente associado a tablets, enquanto 480px é para celulares maiores e 960px+ para desktops."
    },

    // Questão 27
    {
      aula: "Aula 11 — Design Responsivo",
      tipo: "Aplicação",
      texto: "Uma equipe está desenvolvendo um portal de notícias que exibe cards de artigos. No mobile, cada card ocupa toda a largura. No desktop, devem aparecer lado a lado.",
      question: "Qual abordagem é mais adequada para implementar esse comportamento?",
      options: [
        "Criar duas páginas HTML separadas, uma para mobile e outra para desktop",
        "Usar JavaScript para detectar o dispositivo e trocar o CSS",
        "Usar media queries para alterar a largura dos cards conforme a resolução",
        "Fixar a largura dos cards em 50% independente do dispositivo"
      ],
      answer: 2,
      feedback: "Media queries permitem aplicar estilos diferentes conforme o tamanho da tela, sendo a forma correta de reorganizar os cards entre mobile e desktop."
    },

    // Questão 28
    {
      aula: "Aula 11 — Design Responsivo",
      tipo: "Direta",
      texto: "A escolha das unidades de medida no CSS impacta diretamente na responsividade do layout.",
      question: "Quais unidades são recomendadas no design responsivo para garantir flexibilidade?",
      options: [
        "px e cm",
        "mm e pt",
        "% e em",
        "vw e px"
      ],
      answer: 2,
      feedback: "As unidades % e em são relativas e se ajustam ao contexto do elemento e da tela, sendo ideais para layouts responsivos."
    },

    // Questão 29
    {
      aula: "Aula 11 — Design Responsivo",
      tipo: "Aplicação",
      texto: "Em um projeto web, o menu de navegação exibe todos os itens horizontalmente no desktop. No entanto, em telas pequenas, esse comportamento prejudica a usabilidade.",
      question: "Qual solução é mais adequada para menus em telas pequenas?",
      options: [
        "Remover o menu completamente no mobile",
        "Reduzir o tamanho da fonte até caber na tela",
        "Substituir o menu horizontal por um menu hambúrguer",
        "Exibir o menu apenas ao rolar a página"
      ],
      answer: 2,
      feedback: "O menu hambúrguer (ícone ☰) é a solução padrão para substituir menus horizontais em telas pequenas, economizando espaço e mantendo a navegação acessível."
    },

    // Questão 30
    {
      aula: "Aula 11 — Design Responsivo",
      tipo: "Contexto",
      texto: "Um desenvolvedor iniciante precisa criar um layout responsivo seguindo a metodologia Mobile First.",
      question: "Qual é a ordem correta para estruturar o CSS nessa abordagem?",
      options: [
        "Criar o layout desktop, depois adicionar media queries com max-width",
        "Criar o layout mobile, depois expandir com media queries usando min-width",
        "Criar os layouts mobile e desktop separadamente e uni-los ao final",
        "Usar apenas media queries com max-width para todos os dispositivos"
      ],
      answer: 1,
      feedback: "No Mobile First, o CSS base é escrito para telas pequenas e as media queries com min-width são adicionadas progressivamente para adaptar o layout a telas maiores."
    },

    // Aula 12 - CSS e HTML Comandos Básicos

    // Questão 31
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Direta",
      texto: "O HTML5 possui uma estrutura padrão reconhecida por todos os navegadores modernos.",
      question: "Qual elemento define o tipo do documento e indica ao navegador que o arquivo utiliza o padrão HTML5?",
      options: [
        "<!DOCTYPE html>",
        "<html lang='pt-BR'>",
        "<meta charset='UTF-8'>",
        "<head>"
      ],
      answer: 0,
      feedback: "O <!DOCTYPE html> não é uma tag HTML, mas uma declaração que informa ao navegador a versão do HTML utilizada no documento."
    },

    // Questão 32
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Curta",
      texto: "Na estrutura do HTML5, cada seção possui uma função específica.",
      question: "Qual das opções abaixo representa corretamente um conteúdo que fica dentro da tag <head>?",
      options: [
        "Parágrafos e imagens visíveis ao usuário",
        "Tabelas com dados da página",
        "Título da página e links para arquivos CSS externos",
        "Menus de navegação e rodapé"
      ],
      answer: 2,
      feedback: "A tag <head> contém metadados, configurações e links externos como o <title> e <link rel='stylesheet'>, que não são exibidos diretamente na página."
    },

    // Questão 33
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Código",
      texto: "Analise o trecho de código abaixo:",
      question: "Qual será o comportamento visual desse trecho ao ser renderizado no navegador?",
      code: `<ol>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ol>`,
      options: [
        "Uma lista com marcadores (bolinhas) para cada item",
        "Uma lista numerada com HTML, CSS e JavaScript",
        "Três parágrafos separados por ponto e vírgula",
        "Uma lista sem nenhuma marcação visual"
      ],
      answer: 1,
      feedback: "A tag <ol> cria uma lista ordenada, que numera automaticamente cada item <li>. Listas com marcadores usam <ul>."
    },

    // Questão 34
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Direta",
      texto: "Para separar estrutura de aparência, o CSS externo é vinculado ao HTML.",
      question: "Onde deve ser inserida a tag <link> para conectar um arquivo CSS externo a uma página HTML?",
      options: [
        "Dentro da tag <body>, antes do conteúdo",
        "Após o fechamento da tag </html>",
        "Dentro da tag <head>",
        "Dentro da tag <footer>"
      ],
      answer: 2,
      feedback: "A tag <link rel='stylesheet' href='...'> deve ser inserida dentro do <head>, pois é nessa seção que ficam as configurações e referências externas da página."
    },

    // Questão 35
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Contexto",
      texto: "Um desenvolvedor percebe que o texto dentro de um botão está muito próximo das bordas do elemento, mas o botão em si está bem posicionado na página.",
      question: "Qual propriedade CSS ele deve ajustar para resolver esse problema?",
      options: [
        "margin",
        "border",
        "padding",
        "float"
      ],
      answer: 2,
      feedback: "O padding define o espaçamento interno entre o conteúdo e a borda do elemento. O margin controla o espaço externo entre elementos distintos."
    },

    // Questão 36
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Direta",
      texto: "As tabelas HTML possuem tags específicas para cada parte de sua estrutura.",
      question: "Qual tag é utilizada para definir uma célula de dados no corpo de uma tabela HTML?",
      options: [
        "<th>",
        "<tr>",
        "<td>",
        "<tbody>"
      ],
      answer: 2,
      feedback: "A tag <td> representa uma célula de dados comum. A tag <th> é usada para células de cabeçalho, e <tr> define uma linha inteira da tabela."
    },

    // Questão 37
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Aplicação",
      texto: "Uma desenvolvedora precisa criar um menu de navegação com os itens dispostos horizontalmente e com distribuição flexível do espaço.",
      question: "Qual propriedade CSS é mais adequada para esse tipo de layout?",
      options: [
        "float: left",
        "display: flex",
        "border-radius",
        "text-transform: uppercase"
      ],
      answer: 1,
      feedback: "O display: flex organiza os elementos de forma horizontal e flexível, sendo amplamente utilizado em menus e layouts modernos."
    },

    // Questão 38
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Contexto",
      texto: "Ao analisar o código de um site, um desenvolvedor percebe que todos os elementos usam apenas <div> e <span>, sem nenhuma tag semântica.",
      question: "Qual é a principal desvantagem dessa abordagem em relação à Web Semântica?",
      options: [
        "O site ficará visualmente deformado no navegador",
        "O CSS não conseguirá estilizar elementos <div>",
        "Os mecanismos de busca terão dificuldade em interpretar e indexar o conteúdo",
        "Os títulos <h1> deixarão de funcionar corretamente"
      ],
      answer: 2,
      feedback: "A Web Semântica busca dar significado ao conteúdo para que buscadores e tecnologias assistivas entendam a estrutura da página. Usar apenas <div> sem tags semânticas prejudica a indexação e organização."
    },

    // Questão 39
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Código",
      texto: "Considere o seguinte trecho de HTML e CSS:",
      question: "O que acontece ao aplicar a classe 'destaque' ao parágrafo?",
      code: `/* CSS */
    .destaque {
      background-color: yellow;
      font-family: Verdana;
    }

    <!-- HTML -->
    <p class="destaque">Texto importante</p>`,
      options: [
        "O parágrafo recebe fundo amarelo e fonte Verdana",
        "Apenas a cor do texto muda para amarelo",
        "A classe só funciona em elementos <div>",
        "O parágrafo some da página"
      ],
      answer: 0,
      feedback: "As classes CSS permitem aplicar conjuntos de estilos a qualquer elemento HTML. Ao usar class='destaque', o parágrafo herda o fundo amarelo e a fonte Verdana definidos na classe."
    },

    // Questão 40
    {
      aula: "Aula 12 - CSS e HTML Comandos Básicos",
      tipo: "Aplicação",
      texto: "Um desenvolvedor deseja criar um layout com duas colunas: o conteúdo principal ocupando 70% da largura à esquerda e uma barra lateral com 30% à direita.",
      question: "Qual combinação de propriedades CSS representa corretamente essa estrutura?",
      options: [
        ".principal { width: 70%; float: right; } .lateral { width: 30%; float: left; }",
        ".principal { width: 70%; float: left; } .lateral { width: 30%; float: right; }",
        ".principal { width: 70%; margin: auto; } .lateral { width: 30%; margin: auto; }",
        ".principal { display: flex; } .lateral { display: flex; }"
      ],
      answer: 1,
      feedback: "Para um layout de duas colunas com float, o conteúdo principal deve ter float: left com 70% e a barra lateral float: right com 30%, posicionando-os lado a lado."
    },

    // Aula 13 - Landing page com HTML

    // Questão 41
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Direta",
      texto: "Landing pages são amplamente usadas em campanhas de marketing digital.",
      question: "Qual é o principal objetivo de uma landing page?",
      options: [
        "Exibir todas as páginas e seções de um site institucional.",
        "Converter visitantes e capturar leads com foco em uma única mensagem.",
        "Gerenciar o cadastro de usuários em um sistema administrativo.",
        "Apresentar um blog com múltiplos artigos e categorias."
      ],
      answer: 1,
      feedback: "A landing page é uma página única criada para conversão de visitantes, captação de contatos e comunicação direta — com poucos elementos distrativos e foco total na ação desejada."
    },

    // Questão 42
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Direta",
      texto: "Todo documento HTML5 segue uma estrutura básica obrigatória.",
      question: "Qual tag define o início do conteúdo visível ao usuário em uma página HTML5?",
      options: [
        "<head>",
        "<html>",
        "<body>",
        "<title>"
      ],
      answer: 2,
      feedback: "A tag <body> contém todo o conteúdo visível da página — textos, imagens, botões, menus. Já o <head> armazena metadados, links de CSS e o título da aba, que não são exibidos diretamente ao usuário."
    },

    // Questão 43
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Contexto",
      texto: "Um desenvolvedor iniciante colocou todos os arquivos do projeto — HTML, CSS e imagens — na mesma pasta raiz. Com o crescimento do projeto, ficou difícil localizar e manter os arquivos.",
      question: "Qual estrutura de pastas representa a organização mais adequada para um projeto de landing page?",
      options: [
        "Todos os arquivos na raiz, separados por prefixo no nome (ex: css_style.css, img_logo.png).",
        "index.html na raiz e uma pasta assets com subpastas css e img.",
        "Um único arquivo HTML com CSS e imagens embutidos diretamente no código.",
        "Pasta separada para cada página, com CSS e imagens duplicadas em cada uma."
      ],
      answer: 1,
      feedback: "A estrutura recomendada mantém o index.html na raiz e organiza os recursos dentro de assets/css e assets/img. Essa separação melhora manutenção, organização e escalabilidade do projeto."
    },

    // Questão 44
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Direta",
      texto: "A escolha do formato de imagem impacta diretamente a qualidade visual e o desempenho de uma landing page.",
      question: "Por que o formato SVG é considerado ideal para ícones e ilustrações em páginas web?",
      options: [
        "Porque suporta animações de vídeo e áudio embutidos no arquivo.",
        "Porque é um formato rasterizado com alta compressão e carregamento rápido.",
        "Porque mantém qualidade visual em qualquer tamanho, sendo leve e escalável.",
        "Porque é o único formato compatível com todos os navegadores modernos."
      ],
      answer: 2,
      feedback: "O SVG é um formato vetorial que não perde qualidade ao ser redimensionado, é leve e escalável — características ideais para ícones e ilustrações em páginas responsivas."
    },

    // Questão 45
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Direta",
      texto: "No CSS, as cores são frequentemente representadas no formato hexadecimal.",
      question: "O que representa cada par de caracteres no código de cor #RRGGBB?",
      options: [
        "Resolução, Gradiente e Brilho da cor na tela.",
        "Os canais de vermelho, verde e azul, respectivamente.",
        "Os níveis de opacidade, saturação e luminosidade.",
        "Código de fonte, tamanho e peso tipográfico da cor."
      ],
      answer: 1,
      feedback: "No sistema hexadecimal #RRGGBB, RR representa vermelho, GG representa verde e BB representa azul. Cada par varia de 00 (ausência) a FF (intensidade máxima), compondo qualquer cor do modelo RGB."
    },

    // Questão 46
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Contexto",
      texto: "Durante uma auditoria de código, um desenvolvedor encontrou uma página onde menus, rodapé e seções de conteúdo eram todos marcados com <div>.",
      question: "Qual conjunto de tags semânticas do HTML5 substituiria corretamente essas divs?",
      options: [
        "<menu>, <base>, <content> e <bottom>",
        "<nav>, <article>, <section> e <footer>",
        "<list>, <block>, <area> e <end>",
        "<header>, <link>, <text> e <close>"
      ],
      answer: 1,
      feedback: "As tags semânticas corretas são: <nav> para menus, <article> para conteúdo independente, <section> para divisões temáticas e <footer> para o rodapé. Elas dão significado à estrutura, favorecendo acessibilidade e indexação por buscadores."
    },

    // Questão 47
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Direta",
      texto: "Formulários HTML oferecem diferentes tipos de input para diferentes necessidades de seleção.",
      question: "Qual é a diferença fundamental entre os inputs do tipo radio e checkbox?",
      options: [
        "Radio aceita texto digitado; checkbox aceita apenas cliques.",
        "Radio permite selecionar apenas uma opção do grupo; checkbox permite múltiplas seleções.",
        "Radio é usado para datas; checkbox é usado para arquivos.",
        "Ambos têm a mesma função, diferindo apenas na aparência visual."
      ],
      answer: 1,
      feedback: "O input type='radio' permite que o usuário escolha apenas uma opção dentro de um grupo. Já o type='checkbox' permite selecionar múltiplas opções simultaneamente — essa distinção é fundamental para criar formulários funcionalmente corretos."
    },

    // Questão 48
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Contexto",
      texto: "A equipe de design de uma startup escolheu uma fonte manuscrita para todos os textos do sistema, incluindo campos de formulário e tabelas de dados.",
      question: "Do ponto de vista da usabilidade, qual é o principal risco dessa escolha tipográfica?",
      options: [
        "Fontes manuscritas aumentam o tamanho dos arquivos CSS além do limite suportado pelos navegadores.",
        "A escolha pode prejudicar a legibilidade em textos longos ou pequenos, comprometendo a experiência do usuário.",
        "Fontes externas como Google Fonts são incompatíveis com campos de formulário HTML.",
        "Fontes manuscritas não são suportadas pelo sistema de cores hexadecimais do CSS."
      ],
      answer: 1,
      feedback: "A tipografia influencia diretamente a legibilidade, usabilidade e experiência do usuário. Fontes manuscritas podem ser adequadas para títulos decorativos, mas prejudicam a leitura em textos corridos, formulários e tabelas — contextos que exigem clareza e precisão visual."
    },

    // Questão 49
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Código",
      texto: "Um desenvolvedor criou o seguinte formulário para coletar dados de contato em uma landing page.",
      question: "Qual input está com o tipo incorreto para sua finalidade descrita no placeholder?",
      code: `<form>
    <input type="text" placeholder="Seu nome completo">
    <input type="text" placeholder="Seu e-mail">
    <input type="password" placeholder="Crie uma senha">
    <input type="submit" value="Enviar">
  </form>`,
      options: [
        "O primeiro input, pois nomes devem usar type='name'.",
        "O segundo input, pois e-mails devem usar type='email' para validação automática.",
        "O terceiro input, pois senhas devem usar type='text' para visibilidade.",
        "O quarto input, pois botões de envio devem usar type='button'."
      ],
      answer: 1,
      feedback: "O campo de e-mail está usando type='text', que não realiza nenhuma validação de formato. O correto é type='email', que valida automaticamente se o valor digitado corresponde ao padrão de um endereço de e-mail antes do envio do formulário."
    },

    // Questão 50
    {
      aula: "Aula 13 - Landing page com HTML",
      tipo: "Aplicação",
      texto: "Uma landing page estava sendo exibida corretamente no desktop, mas em smartphones o conteúdo aparecia muito pequeno, como uma versão miniaturizada da tela de computador.",
      question: "Qual tag, ausente no código, é a principal responsável por esse comportamento em dispositivos móveis?",
      options: [
        "<link rel='mobile' href='mobile.css'>",
        "<meta name='viewport' content='width=device-width, initial-scale=1'>",
        "<style media='screen and (max-width: 600px)'>",
        "<script src='responsive.js'></script>"
      ],
      answer: 1,
      feedback: "Sem a meta tag viewport, navegadores móveis renderizam a página assumindo uma largura de desktop (cerca de 980px) e a comprimem para caber na tela, resultando no efeito de miniaturização descrito. A tag <meta name='viewport' content='width=device-width, initial-scale=1'> instrui o navegador a usar a largura real do dispositivo como referência."
    },
      // aula 14 Formatando com CSS

    // 51 - o que é CSS
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Direta",

      texto: "CSS significa Cascading Style Sheets.",

      question: "Qual é a principal função do CSS no desenvolvimento web?",

      options: [
        "Estruturar o conteúdo da página com elementos e tags",
        "Definir a aparência visual da página, como cores, fontes e espaçamentos",
        "Gerenciar requisições entre o navegador e o servidor",
        "Criar a lógica de interação e comportamento da página"
      ],

      answer: 1,

      feedback: "CSS é responsável pelo estilo visual da página — cores, fontes, espaçamentos e layout — enquanto o HTML cuida da estrutura."
    },

    // 52 - vinculação CSS
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Código",

      texto: "Para aplicar um arquivo CSS externo a uma página HTML, é necessário informar ao navegador onde encontrá-lo.",

      question: "Qual das opções abaixo vincula corretamente um arquivo CSS externo ao HTML?",

      code: `<!-- Opção A -->
    <style href="style.css">

    <!-- Opção B -->
    <link rel="stylesheet" href="style.css">

    <!-- Opção C -->
    <css src="style.css">

    <!-- Opção D -->
    <script rel="stylesheet" href="style.css">`,

      options: [
        "Opção A",
        "Opção B",
        "Opção C",
        "Opção D"
      ],

      answer: 1,

      feedback: "A tag correta é <link rel='stylesheet' href='style.css'>, inserida no <head> do HTML. As demais opções usam tags ou atributos incorretos."
    },

    // 53 - teste de vínculo
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Curta",

      texto: "Durante o desenvolvimento, é comum verificar se o CSS está sendo carregado corretamente pelo navegador.",

      question: "Qual é a forma mais rápida de testar se o arquivo CSS está vinculado ao HTML?",

      options: [
        "Abrir o terminal e executar o arquivo CSS diretamente",
        "Aplicar uma cor de fundo chamativa no seletor body e verificar se a página muda",
        "Criar um segundo arquivo HTML e importar o CSS nele",
        "Verificar se o arquivo CSS tem mais de 10 linhas escritas"
      ],

      answer: 1,

      feedback: "Aplicar background-color: red no body é um teste rápido e prático. Se a cor aparecer na página, o vínculo está funcionando corretamente."
    },

    // 54 - Google Fonts
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Contexto",

      texto: "Um desenvolvedor quer usar a fonte Nunito nos textos da landing page, mas ela não está instalada nos computadores dos usuários.",

      question: "Qual é a solução correta para garantir que a fonte apareça em qualquer dispositivo?",

      options: [
        "Instalar a fonte no servidor de hospedagem do site",
        "Orientar os usuários a instalarem a fonte manualmente",
        "Importar a fonte via Google Fonts com um <link> no <head> e aplicar com font-family no CSS",
        "Converter a fonte para imagem e inserir no HTML"
      ],

      answer: 2,

      feedback: "O Google Fonts permite importar fontes externas via <link> no HTML. Com font-family no CSS, a fonte é aplicada em qualquer dispositivo sem precisar de instalação local."
    },

    // 55 - classes CSS
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Direta",

      texto: "Seletores de classe são um dos recursos mais usados no CSS.",

      question: "Como uma classe chamada 'card' é declarada no CSS e aplicada no HTML?",

      options: [
        "CSS: #card {} → HTML: id='card'",
        "CSS: .card {} → HTML: class='card'",
        "CSS: @card {} → HTML: name='card'",
        "CSS: card {} → HTML: type='card'"
      ],

      answer: 1,

      feedback: "Classes usam ponto (.) no CSS e são referenciadas com o atributo class no HTML. São reutilizáveis e podem ser aplicadas em múltiplos elementos."
    },

    // 56 - variáveis CSS
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Código",

      texto: "Variáveis CSS são declaradas em :root e reutilizadas ao longo do arquivo.",

      question: "Qual código declara e usa corretamente uma variável CSS?",

      code: `// Opção A
    body { --cor-principal: #414059; }
    h1 { color: var(cor-principal); }

    // Opção B
    :root { --cor-principal: #414059; }
    h1 { color: var(--cor-principal); }

    // Opção C
    :root { $cor-principal: #414059; }
    h1 { color: $cor-principal; }

    // Opção D
    root { --cor-principal: #414059; }
    h1 { color: --cor-principal; }`,

      options: [
        "Opção A",
        "Opção B",
        "Opção C",
        "Opção D"
      ],

      answer: 1,

      feedback: "Variáveis CSS são declaradas em :root com dois hífens (--nome) e usadas com var(--nome). A opção B é a única sintaticamente correta."
    },

    // 57 - Flexbox
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Contexto",

      texto: "No menu da landing page, o logo precisa ficar à esquerda e os links de navegação à direita, ocupando toda a largura do cabeçalho.",

      question: "Qual combinação de propriedades CSS resolve esse layout de forma eficiente?",

      options: [
        "display: block e text-align: right",
        "display: flex e justify-content: space-between",
        "position: absolute e right: 0",
        "display: grid e grid-template-columns: auto"
      ],

      answer: 1,

      feedback: "display: flex transforma o container em layout flexível, e justify-content: space-between posiciona o primeiro item no início e o último no fim — ideal para menus."
    },

    // 58 - menu fixo
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Direta",

      texto: "Em landing pages, é comum que o menu permaneça visível enquanto o usuário rola a página.",

      question: "Qual propriedade CSS mantém o menu fixo no topo da tela durante a rolagem?",

      options: [
        "position: relative",
        "position: absolute",
        "position: fixed",
        "position: static"
      ],

      answer: 2,

      feedback: "position: fixed remove o elemento do fluxo do documento e o mantém fixo em relação à janela do navegador, independente da rolagem."
    },

    // 59 - CSS Grid
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Aplicação",

      texto: "Uma seção da landing page precisa exibir três cartões lado a lado, ocupando o mesmo espaço cada um.",

      question: "Qual CSS cria corretamente esse layout de três colunas iguais?",

      options: [
        "display: flex; flex-columns: 3;",
        "display: grid; grid-template-columns: 1fr 1fr 1fr;",
        "display: grid; columns: 3 equal;",
        "display: block; width: 33% each;"
      ],

      answer: 1,

      feedback: "display: grid com grid-template-columns: 1fr 1fr 1fr cria três colunas que dividem o espaço disponível em partes iguais usando a unidade fr."
    },

    // 60 - responsividade imagem
    {
      aula: "Aula 14 - Formatando com CSS",
      tipo: "Curta",

      texto: "Imagens dentro de colunas de Grid podem extrapolar os limites e quebrar o layout.",

      question: "Qual conjunto de propriedades impede que uma imagem ultrapasse a largura da coluna e se distorça?",

      options: [
        "width: 100% e height: 100%",
        "max-width: 100% e height: auto",
        "min-width: 100% e height: fixed",
        "overflow: hidden e height: auto"
      ],

      answer: 1,

      feedback: "max-width: 100% impede que a imagem ultrapasse o container, e height: auto preserva a proporção original. É a combinação padrão para imagens responsivas."
    },
      // aula: Aula 15 - Revisão Projeto de Design para Web

  // 61 - Mobile First
  {
    aula: "Aula 15 - Revisão Projeto de Design para Web",
    tipo: "Direta",
    texto: "A metodologia Mobile First define uma ordem de desenvolvimento específica.",
    question: "Qual é a ordem correta de desenvolvimento no Mobile First?",
    options: [
      "Desktop → Tablet → Smartphone",
      "Smartphone → Tablet → Desktop",
      "Tablet → Smartphone → Desktop",
      "Desktop → Smartphone → Tablet"
    ],
    answer: 1,
    feedback: "No Mobile First, o desenvolvimento começa pelos dispositivos menores (smartphones) e progride gradualmente para telas maiores, como tablets e desktops."
  },

  // 62 - Media Queries
  {
    aula: "Aula 15 - Revisão Projeto de Design para Web",
    tipo: "Contexto",
    texto: "Uma desenvolvedora está criando um site responsivo seguindo a abordagem Mobile First e precisa adaptar o layout para telas maiores em determinados pontos.",
    question: "Qual recurso CSS ela deve utilizar para realizar essas adaptações progressivas?",
    options: [
      "Flexbox",
      "Media Queries",
      "FontAwesome",
      "Pseudo-elementos"
    ],
    answer: 1,
    feedback: "Media Queries permitem definir estilos específicos para diferentes tamanhos de tela, viabilizando a adaptação progressiva do layout do Mobile First ao Desktop."
  },

  // 63 - ergonomia compatibilidade
  {
    aula: "Aula 15 - Revisão Projeto de Design para Web",
    tipo: "Direta",
    texto: "Entre os critérios ergonômicos de interfaces, um deles trata da coerência entre a interface e as expectativas do usuário.",
    question: "Qual critério ergonômico corresponde a essa descrição?",
    options: [
      "Adaptabilidade",
      "Condução",
      "Compatibilidade",
      "Homogeneidade"
    ],
    answer: 2,
    feedback: "Compatibilidade é o critério que garante que a interface seja coerente com as expectativas e modelos mentais do usuário, facilitando o uso."
  },

  // 64 - semiótica signos
  {
    aula: "Aula 15 - Revisão Projeto de Design para Web",
    tipo: "Curta",
    texto: "A engenharia semiótica estuda a comunicação entre designer, sistema e usuário.",
    question: "Qual das opções abaixo NÃO é citada como forma de transmissão de mensagens pela interface?",
    options: [
      "Signos visuais",
      "Feedbacks",
      "Algoritmos de busca",
      "Comportamentos"
    ],
    answer: 2,
    feedback: "A interface transmite mensagens por meio de signos visuais, símbolos, comportamentos e feedbacks. Algoritmos de busca não fazem parte desse conjunto semiótico."
  },

  // 65 - HTML semântico
  {
    aula: "Aula 15 - Revisão Projeto de Design para Web",
    tipo: "Aplicação",
    texto: "Um desenvolvedor precisa marcar o trecho de navegação principal do seu site com o elemento HTML semântico correto.",
    question: "Qual elemento HTML deve ser usado para representar a área de navegação?",
    options: [
      "<header>",
      "<section>",
      "<nav>",
      "<aside>"
    ],
    answer: 2,
    feedback: "O elemento <nav> é utilizado especificamente para definir blocos de navegação, sendo o elemento semântico correto para links de menu principal."
  },

  // 66 - psicologia cognitiva
  {
    aula: "Aula 15 - Revisão Projeto de Design para Web",
    tipo: "Contexto",
    texto: "Ao projetar uma interface, o designer quer garantir que o usuário perceba rapidamente as informações mais importantes da tela.",
    question: "Qual conceito da psicologia cognitiva está diretamente relacionado a esse objetivo?",
    options: [
      "Memória de longo prazo",
      "Categorização",
      "Atenção seletiva",
      "Interpretação"
    ],
    answer: 2,
    feedback: "A atenção seletiva é o mecanismo cognitivo responsável por direcionar o foco do usuário para informações relevantes, sendo fundamental para guiar a percepção na interface."
  },

  // 67 - tipografia
  {
    aula: "Aula 15 - Revisão Projeto de Design para Web",
    tipo: "Direta",
    texto: "No projeto desenvolvido durante o módulo, duas fontes foram selecionadas com papéis distintos.",
    question: "Qual fonte foi utilizada especificamente para títulos?",
    options: [
      "Nunito Regular 400",
      "Lato Black 900",
      "Roboto Bold 700",
      "Open Sans 600"
    ],
    answer: 1,
    feedback: "A fonte Lato Black 900 foi escolhida para títulos, enquanto Nunito Regular 400 foi destinada aos textos corridos, criando hierarquia visual clara."
  },

  // 68 - ergonomia erros
  {
    aula: "Aula 15 - Revisão Projeto de Design para Web",
    tipo: "Curta",
    texto: "Um dos critérios ergonômicos trata de como a interface lida com situações inesperadas durante o uso.",
    question: "Qual critério ergonômico corresponde à prevenção e ao tratamento de erros?",
    options: [
      "Controle explícito",
      "Carga de trabalho",
      "Gestão de erros",
      "Condução"
    ],
    answer: 2,
    feedback: "Gestão de erros é o critério ergonômico que abrange tanto a prevenção quanto o tratamento de erros, ajudando o usuário a identificar e recuperar-se de falhas."
  },

  // 69 - inspeção semiótica
  {
    aula: "Aula 15 - Revisão Projeto de Design para Web",
    tipo: "Contexto",
    texto: "Uma equipe aplica o método de inspeção semiótica em uma interface web e segue as etapas previstas pelo método.",
    question: "Qual é a última etapa do processo de inspeção semiótica descrito no conteúdo?",
    options: [
      "Inspeção de signos dinâmicos",
      "Comparação das metamensagens",
      "Avaliação da metacomunicação",
      "Inspeção de signos metalinguísticos"
    ],
    answer: 2,
    feedback: "A avaliação da metacomunicação é a etapa final da inspeção semiótica, onde se analisa a qualidade geral da comunicação entre designer e usuário mediada pelo sistema."
  },

  // 70 - Mobile First vantagens
  {
    aula: "Aula 15 - Revisão Projeto de Design para Web",
    tipo: "Aplicação",
    texto: "Uma startup decide adotar o Mobile First no desenvolvimento do seu novo produto web, esperando benefícios concretos para o projeto.",
    question: "Qual das opções abaixo representa uma vantagem direta do uso da abordagem Mobile First?",
    options: [
      "Maior uso de animações complexas",
      "Código mais limpo e organizado",
      "Dependência reduzida de Media Queries",
      "Layout fixo para todos os dispositivos"
    ],
    answer: 1,
    feedback: "Uma das vantagens do Mobile First é produzir código mais limpo, pois a priorização do essencial desde o início evita acúmulo de regras CSS desnecessárias."
  }

  ]

};