// ============================================================
// NEXUS STUDY — quiz/conteudo/2026/2026.1/ques_design.js
// Design de Sistemas de Informação — Questões 2026.1
// Convertido do formato v1 para v2
// ============================================================

window.questoes = {

  questoes: [

    // ── Aula 1 — Design com Foco no Usuário ───────────────

    {
      aula: "Aula 1 — Design com Foco no Usuário",
      tipo: "Contextualizada",
      texto: "Uma empresa de e-commerce percebeu que muitos usuários abandonam o carrinho de compras na etapa de preenchimento do endereço. Ao analisar a interface, o designer notou que o sistema exige que o usuário digite manualmente o nome da rua, bairro e cidade, sem oferecer autopreenchimento por CEP, e apresenta todos os campos (cerca de 20) em uma única tela vertical extensa.",
      question: "Segundo os critérios ergonômicos de Scapin e Bastien, quais princípios estão sendo negligenciados?",
      options: [
        "Compatibilidade e Adaptabilidade.",
        "Carga de Trabalho (brevidade/ações mínimas) e Condução.",
        "Significado dos Códigos e Controle Explícito.",
        "Homogeneidade e Gestão de Erros.",
        "Usabilidade e Arquitetura da Informação apenas."
      ],
      answer: 1,
      feedback: "O critério ==key==Carga de Trabalho== refere-se à redução da carga cognitiva e ao número de ações necessárias. Ao exigir digitação manual e apresentar excesso de campos, o sistema sobrecarrega o usuário. A ==mark==Condução== também é afetada, pois o fluxo não auxilia o usuário a completar a tarefa com presteza."
    },

    {
      aula: "Aula 1 — Design com Foco no Usuário",
      tipo: "Contextualizada",
      texto: "Durante o desenvolvimento de um aplicativo de banco digital voltado ao público idoso, a equipe de UX realizou testes com protótipos de telas. Uma das propostas apresentava botões de confirmação com formato tridimensional sombreado, imitando botões físicos reais, para que o usuário reconhecesse a função do elemento intuitivamente, sem necessidade de leitura de rótulos.",
      question: "Esse conceito visual visa facilitar a compreensão imediata da função do elemento. Qual princípio do 'bom design' está sendo aplicado?",
      options: [
        "Visibilidade.",
        "Consistência.",
        "Familiaridade.",
        "Affordance.",
        "Estética."
      ],
      answer: 3,
      feedback: "O termo ==key==Affordance== significa 'propiciar'; o design deve ter caráter intuitivo para que o usuário aprenda a usá-lo sem manuais, apenas pela aparência do objeto que sugere sua função."
    },

    {
      aula: "Aula 1 — Design com Foco no Usuário",
      tipo: "Contextualizada",
      texto: "Um sistema de controle de tráfego aéreo apresenta alertas sonoros e visuais idênticos tanto para uma 'falha leve de conexão de sensor' quanto para uma 'colisão iminente entre aeronaves'. Durante um turno de alta demanda, o operador ignorou o alerta de colisão por considerar tratar-se da falha de sensor recorrente, situação que quase resultou em acidente grave.",
      question: "Analisando o cenário pelos critérios de Gestão de Erros e Homogeneidade, qual a falha crítica de design?",
      options: [
        "O sistema foi homogêneo demais ao usar o mesmo código para problemas de severidades distintas, falhando na distinção de itens.",
        "O sistema violou a Adaptabilidade ao não permitir que o usuário personalizasse os alarmes.",
        "A falha é de Controle Explícito, pois o sistema deveria ter impedido o operador de ignorar o alarme.",
        "A falha é exclusivamente de Carga de Trabalho, pois o som causou fadiga auditiva.",
        "O sistema falhou na Compatibilidade com a idade do operador."
      ],
      answer: 0,
      feedback: "O critério de ==key==Homogeneidade== diz que a interface deve ser conservada idêntica em contexto idêntico, mas ==danger==diferente em contexto distinto==. Ao usar o mesmo sinal para riscos diferentes, o sistema impede a distinção de itens e falha na ==mark==Gestão de Erros==, pois não informa com clareza a natureza do perigo."
    },

    {
      aula: "Aula 1 — Design com Foco no Usuário",
      tipo: "Contextualizada",
      texto: "Uma startup de logística está desenvolvendo um novo painel administrativo para gerenciar frotas e entregas. A equipe de produto precisa organizar os menus e submenus do sistema, definindo categorias claras para que os operadores encontrem rapidamente as funções de rastreamento, relatórios financeiros e gestão de motoristas, garantindo que os rótulos dos grupos sejam intuitivos e precisos.",
      question: "Essa atividade pertence a qual disciplina?",
      options: [
        "Design de Interação.",
        "Design de Interface.",
        "Ergonomia Cognitiva.",
        "Arquitetura da Informação.",
        "Experiência do Usuário (UX)."
      ],
      answer: 3,
      feedback: "A ==key==Arquitetura da Informação== diz respeito à organização e estruturação das informações, incluindo ==mark==categorização em menus, submenus e rotulação== adequada."
    },

    {
      aula: "Aula 1 — Design com Foco no Usuário",
      tipo: "Contextualizada",
      texto: "Um usuário está utilizando um editor de fotos online para finalizar um projeto de design gráfico. Após trabalhar por 40 minutos editando uma imagem, ele clica acidentalmente no botão de fechar sem ter salvo. O sistema exibe uma caixa de diálogo perguntando: 'Deseja salvar as alterações antes de sair?'.",
      question: "Qual critério ergonômico de Bastien e Scapin está sendo aplicado para garantir uma experiência segura?",
      options: [
        "Compatibilidade.",
        "Adaptabilidade.",
        "Gestão de Erros (proteção contra erros).",
        "Controle Explícito.",
        "Significado dos Códigos."
      ],
      answer: 2,
      feedback: "A ==key==Gestão de Erros== refere-se a mecanismos que evitam a ocorrência de erros ou favorecem sua correção. Mostrar uma mensagem para confirmar a ação antes de sair (==mark==proteção==) é o exemplo clássico deste critério."
    },

    {
      aula: "Aula 1 — Design com Foco no Usuário",
      tipo: "Aplicação",
      texto: "Uma equipe de qualidade de software realizou testes de usabilidade comparando dois sistemas de agendamento médico com o mesmo objetivo de tarefa. Os resultados foram registrados na tabela a seguir:<br><br><table style='width:100%;border-collapse:collapse;font-size:0.82rem;margin:0.5rem 0'><thead><tr style='background:rgba(255,255,255,0.08)'><th style='border:1px solid rgba(255,255,255,0.12);padding:7px 10px;text-align:left'>Sistema</th><th style='border:1px solid rgba(255,255,255,0.12);padding:7px 10px;text-align:left'>Tempo médio</th><th style='border:1px solid rgba(255,255,255,0.12);padding:7px 10px;text-align:left'>Taxa de Erros</th><th style='border:1px solid rgba(255,255,255,0.12);padding:7px 10px;text-align:left'>Satisfação (1-5)</th></tr></thead><tbody><tr><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>A</td><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>45 segundos</td><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>5%</td><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>4.8</td></tr><tr><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>B</td><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>20 segundos</td><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>2%</td><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>3.0</td></tr></tbody></table>",
      question: "Considerando a definição de Usabilidade da NBR 9241-11, qual conclusão é correta?",
      options: [
        "O Sistema B é mais usual porque é mais rápido (eficiência).",
        "O Sistema A é superior em todos os aspectos de usabilidade.",
        "O Sistema B possui maior eficácia e eficiência, mas o Sistema A gera maior satisfação.",
        "O Sistema A não possui usabilidade, apenas UX.",
        "A taxa de erros não interfere na usabilidade."
      ],
      answer: 2,
      feedback: "Usabilidade é a medida de ==key==eficácia== (conclusão da tarefa/menor erro), ==key==eficiência== (tempo/recursos) e ==key==satisfação==. O Sistema B é mais eficaz (menos erros) e mais eficiente (mais rápido), enquanto o Sistema A gera mais satisfação."
    },

    {
      aula: "Aula 1 — Design com Foco no Usuário",
      tipo: "Contextualizada",
      texto: "Uma equipe de desenvolvimento está construindo um portal educacional para cursos técnicos. Para atender diferentes perfis de alunos, o time implementou um seletor de nível de experiência no início do sistema:<br><br><div style='background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.9rem 1.1rem;font-family:monospace;font-size:0.82rem;line-height:1.7'>&lt;select id=\"userLevel\"&gt;<br>&nbsp;&nbsp;&lt;option value=\"beginner\"&gt;Iniciante (Exibir dicas de texto)&lt;/option&gt;<br>&nbsp;&nbsp;&lt;option value=\"intermediate\"&gt;Intermediário (Menus padrão)&lt;/option&gt;<br>&nbsp;&nbsp;&lt;option value=\"expert\"&gt;Avançado (Habilitar atalhos e comandos via console)&lt;/option&gt;<br>&lt;/select&gt;</div>",
      question: "De acordo com os critérios ergonômicos estudados, por que essa estratégia é considerada uma boa prática de design centrado no usuário?",
      options: [
        "Porque garante a Homogeneidade entre todos os níveis de usuários.",
        "Porque foca exclusivamente no Design de Interação físico.",
        "Porque a adaptabilidade permite que o sistema reaja conforme as necessidades e experiências prévias dos usuários, oferecendo flexibilidade estrutural.",
        "Porque reduz a Carga de Trabalho ao remover o controle explícito do usuário avançado.",
        "Porque utiliza o critério de Significado dos Códigos para traduzir o console."
      ],
      answer: 2,
      feedback: "A ==key==Adaptabilidade== refere-se à capacidade do sistema de reagir conforme o contexto e preferências. Sistemas devem oferecer ==mark==ajuda a iniciantes== e ==mark==atalhos para experientes== (flexibilidade estrutural)."
    },

    {
      aula: "Aula 1 — Design com Foco no Usuário",
      tipo: "Contextualizada",
      texto: "Em um sistema hospitalar de monitoramento intensivo, o designer organizou visualmente a tela principal agrupando todas as informações vitais do paciente (batimentos, pressão, oxigenação) em um quadro com bordas destacadas e cores similares, separando-as dos dados cadastrais (nome, idade, convênio). Essa decisão foi tomada para facilitar a leitura rápida pela equipe médica em situações de emergência.",
      question: "Qual subcritério de Condução de Scapin e Bastien foi aplicado?",
      options: [
        "Feedback imediato.",
        "Legibilidade.",
        "Agrupamento/Distinção de Itens.",
        "Presteza.",
        "Carga de Trabalho."
      ],
      answer: 2,
      feedback: "O critério de ==key==Condução== subdivide-se em presteza, ==mark==agrupamento/distinção de itens==, feedback e legibilidade. Agrupar itens relacionados (vitais) e separá-los de outros (cadastro) facilita o aprendizado e a localização da informação."
    },

    {
      aula: "Aula 1 — Design com Foco no Usuário",
      tipo: "Explicativa",
      texto: "Uma universidade federal decidiu criar um novo curso de pós-graduação em Interação Humano-Computador. Para montar a grade curricular, os coordenadores precisaram mapear todas as áreas do conhecimento que fundamentam os estudos de IHC, para garantir que os alunos desenvolvessem uma visão interdisciplinar sólida sobre o projeto de sistemas interativos.",
      question: "Segundo o material estudado, quais são as principais áreas de origem que fundamentam os estudos de IHC?",
      options: [
        "Marketing, Administração e Design.",
        "Ergonomia, Psicologia Cognitiva, Design e Ciência da Computação.",
        "Engenharia de Software e Publicidade apenas.",
        "Sociologia e Antropologia apenas.",
        "Artes Plásticas e Matemática."
      ],
      answer: 1,
      feedback: "IHC tem suas origens na ==key==Ergonomia/Fatores Humanos==, ==key==Psicologia Cognitiva==, ==key==Design== e ==key==Ciência da Computação==."
    },

    {
      aula: "Aula 1 — Design com Foco no Usuário",
      tipo: "Contextualizada",
      texto: "Uma empresa de software de RH lançou um sistema funcional que já atendia bem às necessidades operacionais dos usuários, com boa eficiência e baixa taxa de erros. Ao analisar métricas de uso, porém, perceberam que os usuários utilizavam o sistema apenas quando obrigados e o abandonavam rapidamente. A diretoria decidiu então reformular o produto para que ele causasse encantamento, desejo e vínculo emocional no usuário, transformando o uso obrigatório em uso voluntário.",
      question: "Eles estão expandindo o foco para qual área?",
      options: [
        "Arquitetura da Informação.",
        "Ergonomia Física.",
        "Interação Humano-Computador.",
        "Experiência do Usuário (UX).",
        "Design de Interface Gráfica."
      ],
      answer: 3,
      feedback: "A ==key==Experiência do Usuário (UX)== surge para analisar fatores além da eficiência, como ==mark==prazer, emoção, afetividade e encantamento==, visando fazer o usuário desejar o produto."
    },

    // ── Aula 2 — Comunicação e Semiótica ──────────────────

    {
      aula: "Aula 2 — Comunicação e Semiótica",
      tipo: "Contextualizada",
      texto: "Uma empresa multinacional contratou um engenheiro brasileiro para operar remotamente, em caráter emergencial, uma interface de controle de uma usina nuclear localizada na Rússia. O profissional não fala russo e não conhece a simbologia técnica utilizada nas telas do sistema, o que gerou graves dificuldades na interpretação dos painéis durante a operação.",
      question: "No modelo de comunicação de Roman Jakobson, qual o principal ruído de comunicação gerado nessa situação?",
      options: [
        "Ruído Físico, pois o sistema pode cair.",
        "Ruído Psicossocial, devido ao estresse da função.",
        "Ruído Cultural, pois os códigos (idioma e ícones) não são assimilados pelo receptor.",
        "Falha de Canal, pois a interface gráfica é ineficiente.",
        "Falha de Referente, pois o objeto da usina não existe para o operador."
      ],
      answer: 2,
      feedback: "==key==Ruídos culturais== ocorrem quando códigos (como ícones ou idiomas) possuem significados diferentes ou desconhecidos em culturas distintas, ==danger==impedindo a compreensão da mensagem==."
    },

    {
      aula: "Aula 2 — Comunicação e Semiótica",
      tipo: "Explicativa",
      texto: "Pesquisadores da área de IHC debatem sobre a natureza da comunicação em sistemas computacionais. Uma das abordagens teóricas mais relevantes propõe que o designer, ao projetar uma interface, não apenas organiza elementos visuais, mas envia uma mensagem estruturada ao usuário ensinando-o a usar o sistema, comunicando as intenções de design e os princípios que regem o comportamento do produto.",
      question: "Na Engenharia Semiótica, essa mensagem específica sobre como o sistema deve ser utilizado é chamada de:",
      options: [
        "Código binário.",
        "Metamensagem (ou metacomunicação).",
        "Feedback imediato.",
        "Signo ambíguo.",
        "Canal de transmissão."
      ],
      answer: 1,
      feedback: "A ==key==Engenharia Semiótica== considera sistemas como artefatos de ==mark==metacomunicação==, onde a interface é uma mensagem do designer ensinando o usuário a usar o sistema."
    },

    {
      aula: "Aula 2 — Comunicação e Semiótica",
      tipo: "Contextualizada",
      texto: "Um designer veterano, acostumado com convenções dos anos 1990, manteve em um sistema moderno o ícone de um disquete de 3,5 polegadas para representar a função de salvar. Durante os testes de usabilidade, usuários da Geração Z (nascidos após 2010), que nunca viram um disquete físico, clicavam no ícone apenas por tentativa e erro, sem conseguir associar a imagem à função de gravação de dados.",
      question: "Segundo a teoria de Peirce, o que ocorreu nesse processo de significação?",
      options: [
        "O ícone funcionou perfeitamente como símbolo universal independente da cultura.",
        "Houve uma falha na Semiose, pois o interpretante (usuário) não possuía o conhecimento prévio para ligar o signo ao objeto real representado.",
        "O signo é meramente um índice de que o sistema está funcionando.",
        "A representação gráfica não é um signo, pois não é entendida pelo interpretante.",
        "O botão hambúrguer substituiu a necessidade de entender o disquete."
      ],
      answer: 1,
      feedback: "Para ser signo, a representação deve ser entendida como tal pelo interpretante. Cadeias de significados (==key==Semiose==) dependem de ==mark==hábitos, cultura e contexto==; se o usuário nunca viu um disquete, o signo perde sua força representacional original."
    },

    {
      aula: "Aula 2 — Comunicação e Semiótica",
      tipo: "Explicativa",
      texto: "Em um artigo acadêmico sobre avaliação de sistemas interativos, um pesquisador afirma que interfaces de qualidade não apenas executam funções com eficiência, mas também conseguem transmitir ao usuário, de forma clara, as intenções do designer e a lógica que governa o comportamento do sistema, permitindo que o usuário entenda o porquê das decisões de design sem precisar de manuais.",
      question: "A capacidade de uma interface de transmitir ao usuário as intenções do designer e os princípios que determinam o comportamento do sistema é definida como:",
      options: [
        "Usabilidade.",
        "Comunicabilidade.",
        "Fenomenologia.",
        "Engenharia de Requisitos.",
        "Programação Visual."
      ],
      answer: 1,
      feedback: "A ==key==Comunicabilidade== é expressamente definida como a capacidade da interface de transmitir a ==mark==lógica do design e as intenções do desenvolvedor==."
    },

    {
      aula: "Aula 2 — Comunicação e Semiótica",
      tipo: "Contextualizada",
      texto: "Uma equipe de UX está revisando dois protótipos de formulário de contato para o site de uma seguradora. As propostas diferem apenas na posição do botão de envio:<br><br><div style='background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.8rem 1rem;margin:0.5rem 0;font-size:0.85rem;line-height:1.7'><strong>Interface I:</strong> Botão \"ENVIAR\" localizado logo abaixo do último campo preenchido.<br><strong>Interface II:</strong> Botão \"ENVIAR\" localizado no topo da página, no canto superior direito, longe dos campos.</div>",
      question: "Considerando que a leitura ocidental ocorre da esquerda para a direita e de cima para baixo, qual conclusão sobre a comunicabilidade é correta?",
      options: [
        "A Interface II é melhor por ser mais criativa.",
        "A Interface I possui comunicabilidade mais eficiente pois segue a progressão visual natural do usuário.",
        "Ambas são iguais, pois o código (palavra ENVIAR) é o mesmo.",
        "A Interface II reduz ruídos psicossociais.",
        "O botão deve ser um ícone de disquete em ambas para ser entendido."
      ],
      answer: 1,
      feedback: "A comunicabilidade é mais objetiva na ==mark==Interface I== porque o usuário termina o preenchimento e já encontra o botão na sua ==key==sequência visual natural==, enquanto na II ele teria que procurar o comando."
    },

    {
      aula: "Aula 2 — Comunicação e Semiótica",
      tipo: "Contextualizada",
      texto: "Uma equipe de pesquisa de IHC foi contratada para avaliar um sistema de gestão educacional utilizado por alunos do ensino médio. O processo de avaliação consistiu em gravar as sessões de uso dos estudantes, identificar rupturas na comunicação entre o sistema e o usuário, classificar cada interação com rótulos padronizados e cruzar os dados para identificar padrões de falhas de design. Esse método divide-se em três etapas: preparação, coleta e análise.",
      question: "Esse processo de análise de gravações é característico de qual método?",
      options: [
        "Método de Inspeção Semiótica (MIS).",
        "Método de Avaliação de Comunicabilidade (MAC).",
        "Heurísticas de Nielsen.",
        "Teste de Turing.",
        "Modelo de Jakobson."
      ],
      answer: 1,
      feedback: "O método ==key==MAC== divide-se em ==mark==preparação, coleta (gravação das interações) e análise== (etiquetagem/classificação das gravações para interpretação)."
    },

    {
      aula: "Aula 2 — Comunicação e Semiótica",
      tipo: "Contextualizada",
      texto: "Durante uma avaliação de um sistema de e-learning por Inspeção Semiótica, o avaliador percebe uma inconsistência importante: o ícone de ponto de interrogação (?) abre um menu de ajuda completo na tela de cadastro, mas na tela de configurações o mesmo ícone exibe apenas o nome e contato do desenvolvedor, sem qualquer função de suporte ao usuário.",
      question: "Qual etapa da inspeção identificaria essa falha e qual o problema encontrado?",
      options: [
        "Inspeção de signos estáticos; o problema é a falta de barras de rolagem.",
        "Inspeção de signos metalinguísticos; o problema é a falta de feedback de erro.",
        "Contraste e comparação; o problema é a mensagem ambígua (o mesmo signo evoca mais de uma compreensão).",
        "Apreciação da metacomunicação; o problema é o relatório final.",
        "Inspeção de signos dinâmicos; o problema é que o botão não pode ser movido."
      ],
      answer: 2,
      feedback: "Na etapa de ==key==Contraste e Comparação==, o avaliador certifica se existe coerência e se alguns signos estão passando ==danger==mensagens ambíguas== (o mesmo signo evocando compreensões diferentes em contextos distintos)."
    },

    {
      aula: "Aula 2 — Comunicação e Semiótica",
      tipo: "Explicativa",
      texto: "Em uma disciplina de Fundamentos de Design de Interfaces, um professor explica que Charles Peirce fundamentou a semiótica na fenomenologia e dividiu as ciências normativas em três ramos. Ao projetar uma interface, o designer precisa considerar três perguntas fundamentais: quais ideais guiam os sentimentos do usuário, quais fins devem nortear suas ações, e como os signos representam os objetos com os quais o usuário interage.",
      question: "A preocupação com quais ideais guiam os sentimentos do usuário refere-se a qual ciência normativa segundo Peirce?",
      options: [
        "Lógica.",
        "Ética.",
        "Estética.",
        "Semiótica pura.",
        "Engenharia."
      ],
      answer: 2,
      feedback: "Segundo Peirce, responder a quais ideais guiam nossos sentimentos é tarefa da ==key==Estética==."
    },

    {
      aula: "Aula 2 — Comunicação e Semiótica",
      tipo: "Explicativa",
      texto: "Em uma aula sobre o modelo de comunicação de Roman Jakobson aplicado à IHC, o professor apresenta os seis elementos da comunicação: emissor, receptor, mensagem, código, referente e canal. Ele pede que os alunos identifiquem, no contexto de um sistema computacional, qual elemento desempenha o papel de veículo físico pelo qual a mensagem trafega entre o usuário e o computador.",
      question: "No estudo de IHC, qual elemento desempenha o papel de Canal principal?",
      options: [
        "O programador.",
        "O manual de instruções impresso.",
        "As interfaces gráficas.",
        "O banco de dados SQL.",
        "O roteador de internet apenas."
      ],
      answer: 2,
      feedback: "No estudo de IHC, as ==key==interfaces gráficas== são os ==mark==canais de comunicação entre homem e máquina==."
    },

    {
      aula: "Aula 2 — Comunicação e Semiótica",
      tipo: "Contextualizada",
      texto: "Um designer está criando os ícones de um novo sistema operacional. Para representar a função de descartar arquivos, ele utiliza a imagem de uma lixeira doméstica, aproveitando a semelhança visual entre o objeto físico e a ação digital de descarte. Para representar uma pasta de documentos, utiliza a imagem de uma pasta suspensa amarela idêntica às usadas em arquivos físicos de escritório.",
      question: "Como esse tipo de signo, cuja relação com o objeto é de imitação ou semelhança, é classificado segundo Peirce?",
      options: [
        "Índice.",
        "Símbolo.",
        "Referente.",
        "Ícone.",
        "Emissor."
      ],
      answer: 3,
      feedback: "O ==key==Ícone== apresenta uma relação de ==mark==analogia (semelhança ou imitação)== com o objeto representado."
    },

    // ── Aula 3 — Alfabeto Visual ──────────────────────────

    {
      aula: "Aula 3 — Alfabeto Visual",
      tipo: "Contextualizada",
      texto: "Uma agência de turismo especializada em destinos de praia deseja renovar sua identidade visual para atrair o público jovem entre 18 e 30 anos. O designer responsável pela reformulação propôs substituir a fotografia realista de uma praia tropical (nível representacional) por um ícone minimalista composto apenas por um semicírculo amarelo e três linhas azuis curvas abaixo, capaz de ser reproduzido em qualquer tamanho sem perda de reconhecimento.",
      question: "De acordo com a classificação das mensagens visuais, essa mudança representa uma transição para qual nível?",
      options: [
        "Nível Abstrato, pois foca na redução à mínima informação representacional e ênfase em formas.",
        "Nível Simbólico, pois reduz o objeto ao mínimo irredutível para ser facilmente lembrado e reproduzido.",
        "Nível Epistemológico, pois exige um conhecimento prévio da cultura local.",
        "Nível Fisiológico, pois altera a percepção cromática do usuário.",
        "Nível Representacional Híbrido, pois ainda utiliza cores que remetem ao mundo real."
      ],
      answer: 1,
      feedback: "O nível ==key==Simbólico== é caracterizado pela ==mark==redução radical dos elementos representacionais ao 'mínimo irredutível'==, visando a rápida memorização e reprodução, como é o caso de ícones e logotipos simplificados."
    },

    {
      aula: "Aula 3 — Alfabeto Visual",
      tipo: "Contextualizada",
      texto: "Um desenvolvedor de sistemas industriais está projetando o painel de monitoramento de uma caldeira de alta pressão. Para indicar o status de pressão excessiva — uma condição de risco que exige atenção imediata do operador — ele está considerando o uso de diferentes direções de linha no indicador visual de status. O objetivo é escolher uma direção que, por si só, transmita visualmente a sensação de instabilidade e perigo iminente.",
      question: "Segundo o Alfabeto Visual, qual a mensagem visual associada à direção diagonal?",
      options: [
        "Repouso e estabilidade.",
        "Equilíbrio e retidão.",
        "Instabilidade e provocação.",
        "Infinidade e proteção.",
        "Unidade e harmonia."
      ],
      answer: 2,
      feedback: "A direção ==key==Diagonal== é associada à ==mark==instabilidade== e é a mais provocadora das formulações visuais."
    },

    {
      aula: "Aula 3 — Alfabeto Visual",
      tipo: "Contextualizada",
      texto: "A Agência Resn, premiada por seus projetos de web design interativo, desenvolveu uma página institucional para uma joalheria de luxo. A interface principal apresenta um diamante tridimensional que responde ao movimento do mouse: o objeto gira suavemente, revelando suas facetas por meio de variações de luz e sombra que criam a ilusão de profundidade e volume real em uma tela plana.",
      question: "Quais elementos do alfabeto visual estão sendo combinados para criar essa experiência?",
      options: [
        "Ponto, linha e escala apenas.",
        "Textura, tom, dimensão e movimento.",
        "Cor, direção e equilíbrio apenas.",
        "Escala, dimensão e simetria apenas.",
        "Tom, cor e representação verbal apenas."
      ],
      answer: 1,
      feedback: "O diamante remete à ==key==Textura== (percepção de volume óptica), ao ==key==Tom== (contraste sombra e luz para volume), à ==key==Dimensão== (perspectiva 3D) e ao ==key==Movimento== (signo dinâmico que gira)."
    },

    {
      aula: "Aula 3 — Alfabeto Visual",
      tipo: "Contextualizada",
      texto: "Um banco digital nacional está desenvolvendo um novo aplicativo mobile para gestão financeira pessoal. Durante o briefing de identidade visual, a diretoria solicitou que a interface transmitisse ao usuário as sensações de honestidade, retidão e esmero, valores considerados fundamentais para construir confiança em um serviço financeiro.",
      question: "Com base nos significados atribuídos às formas básicas no Alfabeto Visual, qual forma geométrica deve predominar no layout?",
      options: [
        "O Círculo.",
        "O Triângulo Equilátero.",
        "O Quadrado.",
        "O Pentágono.",
        "A Linha Curva."
      ],
      answer: 2,
      feedback: "Ao ==key==Quadrado== associam-se os significados de ==mark==honestidade, retidão e esmero==."
    },

    {
      aula: "Aula 3 — Alfabeto Visual",
      tipo: "Aplicação",
      texto: "Um portal de notícias está sendo redesenhado. O arquiteto de informação documentou os elementos visuais utilizados e suas funções pretendidas na tabela abaixo:<br><br><table style='width:100%;border-collapse:collapse;font-size:0.82rem;margin:0.5rem 0'><thead><tr style='background:rgba(255,255,255,0.08)'><th style='border:1px solid rgba(255,255,255,0.12);padding:7px 10px;text-align:left'>Elemento</th><th style='border:1px solid rgba(255,255,255,0.12);padding:7px 10px;text-align:left'>Função na Interface</th></tr></thead><tbody><tr><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>Pontos ligados</td><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>Direcionar o olhar do usuário para o menu</td></tr><tr><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>Variação de escala</td><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>Criar hierarquia e peso visual entre notícias</td></tr><tr><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>Perspectiva (ponto de fuga)</td><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>Produzir sensação de realidade e segurança</td></tr></tbody></table>",
      question: "Segundo as técnicas de leitura visual, essa composição utiliza, respectivamente:",
      options: [
        "Linha, Escala e Dimensão.",
        "Ponto, Tom e Movimento.",
        "Direção, Cor e Textura.",
        "Linha, Movimento e Forma.",
        "Ponto, Escala e Tom."
      ],
      answer: 0,
      feedback: "Pontos ligados constituem uma ==key==Linha== que direciona o olhar; o tamanho dos objetos e seu peso visual referem-se à ==key==Escala==; e o uso de perspectiva/ponto de fuga para criar ilusão de profundidade em plano 2D é o elemento ==key==Dimensão==."
    },

    {
      aula: "Aula 3 — Alfabeto Visual",
      tipo: "Contextualizada",
      texto: "Um designer está desenvolvendo a interface de um software profissional de edição de vídeo. Para facilitar a leitura das trilhas de áudio sobrepostas na linha do tempo, ele aplicou ao fundo da tela variações sutis entre regiões mais claras e mais escuras, criando uma diferenciação visual de profundidade entre as camadas de áudio sem o uso de cores distintas.",
      question: "Esse recurso técnico utiliza qual elemento visual do Alfabeto Visual?",
      options: [
        "Cor.",
        "Textura.",
        "Tom.",
        "Movimento.",
        "Escala."
      ],
      answer: 2,
      feedback: "O ==key==Tom== refere-se às ==mark==variações de luz e obscuridade== através das quais distinguimos a complexidade da informação visual."
    },

    {
      aula: "Aula 3 — Alfabeto Visual",
      tipo: "Contextualizada",
      texto: "Uma agência de fotografia profissional está desenvolvendo seu portfólio digital. O designer responsável tomou a decisão consciente de utilizar exclusivamente fotografias de alta resolução que reproduzam os cenários, pessoas e objetos da forma mais fiel possível à realidade, sem recorrer a ilustrações, ícones simplificados ou recursos abstratos, para valorizar o trabalho fotográfico em si.",
      question: "Essa escolha de design prioriza qual nível comunicacional segundo a classificação das mensagens visuais?",
      options: [
        "Nível Simbólico.",
        "Nível Abstrato.",
        "Nível Representacional.",
        "Nível Dinâmico.",
        "Nível de Dimensão."
      ],
      answer: 2,
      feedback: "O nível ==key==Representacional== é aquele que ilustra ==mark==elementos do mundo real da forma mais fiel possível==."
    },

    {
      aula: "Aula 3 — Alfabeto Visual",
      tipo: "Contextualizada",
      texto: "A Agência Murmure, conhecida por seus projetos minimalistas premiados, foi contratada por uma startup de moda de alto padrão para criar seu site institucional. A diretiva criativa determinava que o site deveria transmitir sofisticação por meio da ausência de elementos supérfluos, valorizando os produtos fotográficos com o máximo de espaço ao redor e o mínimo de interferência visual.",
      question: "No estudo de caso da Agência Murmure, qual elemento é enfatizado para gerar esse efeito de clareza e sofisticação?",
      options: [
        "O uso massivo de texturas.",
        "A mudança de escala constante.",
        "Pontos vazios (espaço negativo) para evidenciar conteúdos.",
        "Cores saturadas e quentes.",
        "Linhas diagonais em todo o layout."
      ],
      answer: 2,
      feedback: "O estudo de caso cita que o conteúdo é distribuído de maneira a valorizar o design, com muitos ==key==Pontos Vazios (espaço negativo)== para evidenciar os conteúdos."
    },

    {
      aula: "Aula 3 — Alfabeto Visual",
      tipo: "Contextualizada",
      texto: "Um aplicativo de meditação e bem-estar foi desenvolvido para ajudar usuários a relaxarem antes de dormir. A tela principal exibe círculos em tons de azul e verde que se expandem e contraem lentamente em sincronia com a respiração guiada, criando uma experiência visual harmônica e envolvente.",
      question: "De acordo com o alfabeto visual, essa interface explora quais significados associativos?",
      options: [
        "Conflito (triângulo) e Tensão (diagonal).",
        "Proteção/Infinitude (círculo) e Repetição/Calidez (curva/movimento).",
        "Honestidade (quadrado) e Instabilidade (diagonal).",
        "Dinamismo (escala) e Realidade (dimensão).",
        "Esmero (quadrado) e Força (vertical)."
      ],
      answer: 1,
      feedback: "O ==key==Círculo== evoca ==mark==infinitude e proteção==; a direção ==key==Curva== (repetição e calidez) e o movimento harmônico reforçam o estado de calma."
    },

    {
      aula: "Aula 3 — Alfabeto Visual",
      tipo: "Explicativa",
      texto: "Em uma aula introdutória de Design Visual, o professor apresenta os elementos fundamentais do Alfabeto Visual, começando pela unidade mais básica de todas. Ele explica que essa unidade serve como referência ou indicador de posição no espaço, que ao ser movimentada gera a próxima unidade visual, e que dois ou mais delas alinhados já criam essa próxima estrutura.",
      question: "Qual é a unidade de comunicação visual mais simples e irredutivelmente mínima?",
      options: [
        "A Linha.",
        "O Ponto.",
        "A Forma.",
        "O Tom.",
        "A Cor."
      ],
      answer: 1,
      feedback: "O ==key==Ponto== é a ==mark==unidade de comunicação visual mais simples e irredutivelmente mínima==."
    },

    // ── Aula 4 — Psicologia Cognitiva e Gestalt da Forma ──

    {
      aula: "Aula 4 — Psicologia Cognitiva e Gestalt da Forma",
      tipo: "Contextualizada",
      texto: "Um usuário está preenchendo um longo formulário de cadastro para abertura de conta em um banco digital. Na metade do processo, ele abre uma nova aba para buscar seu número de CPF em um documento digitalizado. Ao retornar ao formulário, ele não consegue lembrar qual campo havia preenchido por último, pois o sistema não sinalizava o progresso nem destacava o campo atual.",
      question: "Esse erro de design ignora as limitações de qual processo cognitivo?",
      options: [
        "Memória de Longa Duração.",
        "Atenção Seletiva.",
        "Memória de Curta Duração.",
        "Vigilância.",
        "Sondagem."
      ],
      answer: 2,
      feedback: "A ==key==Memória de Curta Duração== retém informações por períodos extremamente curtos (10 a 20 segundos) e tem ==danger==capacidade limitada (7 itens ± 2)==. Sem sinais visuais, o usuário esquece rapidamente o contexto imediato."
    },

    {
      aula: "Aula 4 — Psicologia Cognitiva e Gestalt da Forma",
      tipo: "Contextualizada",
      texto: "Um analista de segurança cibernética trabalha monitorando um dashboard em tempo real que exibe o tráfego de rede de uma grande instituição financeira. Seu papel é detectar picos anormais de acesso que podem indicar tentativas de ataque hacker. Esses eventos não têm hora marcada — podem ocorrer a qualquer momento durante o turno de oito horas.",
      question: "Qual função da atenção está sendo exigida do analista durante esse monitoramento?",
      options: [
        "Atenção Dividida.",
        "Atenção Seletiva.",
        "Vigilância e Detecção de Sinal.",
        "Sondagem.",
        "Categorização."
      ],
      answer: 2,
      feedback: "A ==key==Vigilância== ocorre quando a pessoa ==mark==espera detectar um estímulo-sinal que pode surgir em um tempo desconhecido==."
    },

    {
      aula: "Aula 4 — Psicologia Cognitiva e Gestalt da Forma",
      tipo: "Contextualizada",
      texto: "Um designer de aplicativo mobile está criando a tela de lista de contatos de um app de mensagens. Para cada contato, o layout exibe foto de perfil, nome e número de telefone muito próximos entre si, com um espaço em branco visivelmente maior separando um contato do seguinte. Essa decisão foi tomada para que o usuário perceba intuitivamente quais informações pertencem ao mesmo contato.",
      question: "Qual lei da Gestalt está sendo aplicada nessa organização visual?",
      options: [
        "Lei da Semelhança.",
        "Lei da Proximidade.",
        "Lei do Fechamento.",
        "Lei da Unificação.",
        "Lei da Segregação."
      ],
      answer: 1,
      feedback: "A ==key==Proximidade== é o agrupamento de objetos a fim de criarem ==mark==blocos visuais que tendem a ser vistos juntos==, criando unidades."
    },

    {
      aula: "Aula 4 — Psicologia Cognitiva e Gestalt da Forma",
      tipo: "Contextualizada",
      texto: "Um desenvolvedor implementou o recurso de Breadcrumbs (trilha de navegação) no topo de um portal de transparência governamental. A estrutura exibida é: Início > Gastos > 2023 > Saúde. Esse recurso permite que o usuário saiba exatamente em qual seção do portal está e compreenda as relações hierárquicas entre as páginas visitadas.",
      question: "Segundo a Psicologia Cognitiva, esse recurso auxilia em quais etapas da Análise de uma Situação?",
      options: [
        "Ativação e Observação apenas.",
        "Categorização e Decodificação apenas.",
        "Observação e Interpretação.",
        "Planificação e Definição de Tarefas.",
        "Controle de Ação e Habilidades."
      ],
      answer: 2,
      feedback: "Os breadcrumbs ajudam na ==key==Observação== (identificar o ambiente de interação) e na ==key==Interpretação== (determinar causas e consequências do sistema a partir da interação/feedback visual)."
    },

    {
      aula: "Aula 4 — Psicologia Cognitiva e Gestalt da Forma",
      tipo: "Contextualizada",
      texto: "Um estúdio de branding criou o logotipo de uma empresa de tecnologia utilizando a letra G em que a curvatura não é fechada completamente — existe uma pequena abertura no traçado. Apesar da lacuna, todos os participantes dos testes de percepção identificaram instantaneamente a forma como circular e completa, sem notar a interrupção.",
      question: "Qual pilar da Gestalt explica esse fenômeno perceptivo?",
      options: [
        "Continuidade.",
        "Unidade.",
        "Fechamento.",
        "Segregação.",
        "Semelhança."
      ],
      answer: 2,
      feedback: "O ==key==Fechamento== preenche as ==mark==lacunas de objetos incompletos buscando a 'boa forma'== ou unidade."
    },

    {
      aula: "Aula 4 — Psicologia Cognitiva e Gestalt da Forma",
      tipo: "Contextualizada",
      texto: "Ao projetar a interface de um e-commerce de eletrônicos, o designer decidiu padronizar todos os botões de ação de compra com o mesmo formato retangular, a mesma cor verde e o mesmo tamanho, independentemente da categoria de produto. Essa decisão foi tomada para que o usuário reconheça imediatamente a função de compra em qualquer página do site sem precisar reler os rótulos.",
      question: "Essa estratégia utiliza qual lei da Gestalt para gerar coerência visual?",
      options: [
        "Proximidade.",
        "Semelhança (ou Similaridade).",
        "Fechamento.",
        "Segregação.",
        "Pregnância da Forma."
      ],
      answer: 1,
      feedback: "A ==key==Semelhança== defende que ==mark==elementos similares em forma, cor, tamanho e peso tendem a se unir na percepção visual==."
    },

    {
      aula: "Aula 4 — Psicologia Cognitiva e Gestalt da Forma",
      tipo: "Explicativa",
      texto: "Em 1986, Donald Norman publicou trabalhos que influenciaram profundamente o campo do design de sistemas. Sua proposta central era que engenheiros e designers precisavam compreender as capacidades e, principalmente, as limitações da mente humana, para então aplicar esse conhecimento no desenvolvimento de produtos e sistemas interativos com características específicas.",
      question: "Segundo Donald Norman, a Engenharia Cognitiva visa desenvolver sistemas interativos que sejam:",
      options: [
        "Complexos e desafiadores.",
        "Apenas lucrativos e rápidos.",
        "Agradáveis, motivadores e fáceis de usar.",
        "Dependentes exclusivamente de manuais técnicos.",
        "Focados apenas no hardware."
      ],
      answer: 2,
      feedback: "Norman propôs o uso da psicologia para entender processos cognitivos e criar sistemas ==key==motivadores, prazerosos e fáceis de usar==."
    },

    {
      aula: "Aula 4 — Psicologia Cognitiva e Gestalt da Forma",
      tipo: "Contextualizada",
      texto: "Uma empresa de contabilidade utiliza um software de planilhas financeiras. Os analistas iniciantes acessam a função de colar apenas valores pelo menu visual (Editar > Colar Especial > Valores). Os analistas seniores, com anos de uso do sistema, executam a mesma função diretamente com o atalho Ctrl+Shift+V, sem pensar conscientemente nos passos envolvidos.",
      question: "Segundo a Psicologia Cognitiva aplicada ao Controle das Ações, o comportamento do usuário avançado é classificado como:",
      options: [
        "Baseado em Habilidades (automatizado).",
        "Baseado em Regras (memorizado por aprendizado recente).",
        "Baseado em Conhecimentos (tarefa nova/complexa).",
        "Baseado em Vigilância (espera de sinal).",
        "Baseado em Atenção Dividida."
      ],
      answer: 0,
      feedback: "Comportamentos ==key==Baseados em Habilidades== são acionados conforme ==mark==competências adquiridas anteriormente e automatizadas pelo uso==."
    },

    {
      aula: "Aula 4 — Psicologia Cognitiva e Gestalt da Forma",
      tipo: "Explicativa",
      texto: "Em uma aula de design de interfaces, a professora apresenta aos alunos um princípio fundamental da Gestalt que orienta diretamente as decisões de organização visual. Ela explica que quanto mais clara, simples e bem estruturada for a organização formal de um objeto, mais rápida e precisa será a leitura e interpretação do usuário, pois o cérebro humano tende a preferir formas regulares e equilibradas.",
      question: "Ela está descrevendo qual princípio geral da Gestalt?",
      options: [
        "Segregação figura-fundo.",
        "Constância Perceptiva.",
        "Pregnância da Forma.",
        "Tendência à estruturação.",
        "Unificação por Simetria."
      ],
      answer: 2,
      feedback: "A ==key==Pregnância da Forma== é o princípio da 'boa forma': percebemos mais facilmente ==mark==formas simples, regulares e equilibradas==."
    },

    {
      aula: "Aula 4 — Psicologia Cognitiva e Gestalt da Forma",
      tipo: "Contextualizada",
      texto: "O site institucional de uma ONG de proteção ambiental apresenta como imagem principal dois personagens — uma ativista e um cientista — fotografados em foco nítido e com alta saturação de cores, enquanto o fundo florestal ao redor está desfocado e com baixo contraste. Essa técnica faz com que o olhar do visitante seja automaticamente atraído para os personagens, ignorando os elementos secundários do cenário.",
      question: "Essa técnica de divisão visual para atrair a atenção para os personagens utiliza qual pilar da Gestalt?",
      options: [
        "Unificação.",
        "Segregação.",
        "Fechamento.",
        "Proximidade.",
        "Semelhança."
      ],
      answer: 1,
      feedback: "A ==key==Segregação== é a forma de divisão dos elementos na composição, podendo ==mark==isolar ou destacar unidades para dar ênfase==."
    },

    // ── Aula 5 — O Elemento Cor ───────────────────────────

    {
      aula: "Aula 5 — O Elemento Cor",
      tipo: "Contextualizada",
      texto: "Um designer gráfico experiente em criação de catálogos impressos para o setor editorial foi contratado para desenvolver a interface digital de um novo aplicativo de investimentos. Ao finalizar o projeto e testá-lo no monitor do cliente, percebeu que o tom de Azul Marinho selecionado na paleta do software de design parecia acinzentado e sem brilho na tela, diferente do resultado esperado.",
      question: "De acordo com os conceitos de síntese cromática, qual foi a falha técnica cometida?",
      options: [
        "O designer usou o sistema RGB, que possui uma gama de cores menor que o CMYK, resultando em perda de brilho.",
        "O designer trabalhou no sistema CMYK (síntese subtrativa), adequado para impressão, em vez de converter o projeto para RGB (síntese aditiva), que utiliza a luz dos monitores e oferece maior brilho e gama cromática.",
        "Houve um erro de 'Saturação', pois ao adicionar preto para escurecer o azul no monitor, a cor automaticamente ganha croma.",
        "O problema é de 'Temperatura', pois o azul é uma cor quente e exige mais energia para ser processada pela retina do usuário.",
        "O designer aplicou a regra 60-30-10 de forma invertida, usando 60% de cores de acabamento."
      ],
      answer: 1,
      feedback: "O sistema ==key==RGB== é o ideal para dispositivos que usam luz (monitores, TVs), pois é uma ==mark==síntese aditiva== que alcança o branco na junção das cores. O ==danger==CMYK== é para pigmentos físicos (impressão), onde a mistura resulta em ausência de luz (preto) e tons mais opacos em tela."
    },

    {
      aula: "Aula 5 — O Elemento Cor",
      tipo: "Contextualizada",
      texto: "Um hospital de referência em cardiologia solicitou o desenvolvimento de um painel de controle digital para a UTI. O designer responsável pelo projeto escolheu o verde-claro como cor de fundo da interface e botões vermelhos pulsantes para os alertas críticos de Parada Cardíaca, justificando que a escolha maximizaria a visibilidade do alerta em situações de emergência.",
      question: "Considerando o círculo cromático e a psicodinâmica das cores, essa escolha é tecnicamente justificada por qual motivo?",
      options: [
        "Uso de cores análogas, que garantem repouso visual e harmonia extrema entre o fundo e o alerta.",
        "Aplicação de cores complementares (verde e vermelho), que oferecem o maior contraste possível entre si, tornando o alerta altamente visível e evocando urgência e ação.",
        "Uso de monocromia, utilizando tons de vermelho para suavizar a tensão do ambiente hospitalar.",
        "Redução da carga de trabalho ao utilizar cores frias (vermelho) para acalmar o médico durante a crise.",
        "Aplicação de cores neutras (vermelho e verde) para evitar ruídos culturais com pacientes hindus."
      ],
      answer: 1,
      feedback: "Cores ==key==Complementares== estão em lados opostos no círculo cromático (como verde e vermelho) e geram ==mark==o máximo de contraste==, ideal para sinalizar alertas que exigem atenção imediata. Além disso, o vermelho está psicologicamente ligado a ==danger==ação, perigo e emergência==."
    },

    {
      aula: "Aula 5 — O Elemento Cor",
      tipo: "Contextualizada",
      texto: "Uma startup brasileira do setor de seguros de vida está expandindo seus serviços para o mercado indiano. O site atual, desenvolvido para o público brasileiro, utiliza o branco como cor predominante para transmitir limpeza, transparência e confiança — valores centrais da marca. Ao compartilhar o projeto com consultores locais de Mumbai, estes expressaram preocupação com a escolha cromática.",
      question: "Segundo a psicologia e os valores culturais das cores, qual o risco de manter o design original para o mercado indiano?",
      options: [
        "O branco na cultura hindu está relacionado à morte e ao luto, o que pode gerar uma percepção negativa e inadequada para um serviço de seguros e proteção à vida.",
        "O branco é uma cor de 'onda longa' e causaria fadiga visual extrema nos usuários indianos devido à alta incidência de luz solar na região.",
        "Na Índia, apenas o preto simboliza transparência e confiança em serviços financeiros.",
        "O branco é considerado uma cor 'quente' no oriente, impedindo a harmonização com o azul.",
        "Não há risco, pois o significado das cores é fisiológico e universal, independente da religião ou geografia."
      ],
      answer: 0,
      feedback: "O material enfatiza que a percepção das cores depende de ==key==fatores subjetivos e culturais==. Enquanto no ocidente o preto remete à morte, para os hindus, o ==danger==branco== é a cor associada ao luto, o que mudaria drasticamente a metamensagem do site de seguros."
    },

    {
      aula: "Aula 5 — O Elemento Cor",
      tipo: "Contextualizada",
      texto: "Uma rede de fast food nacional está reformulando a identidade visual de seus pontos de venda físicos e do aplicativo de delivery. Durante a reunião de briefing, o arquiteto de informação sugeriu manter a paleta atual baseada em Vermelho e Amarelo, apresentando argumentos técnicos fundamentados na teoria das cores e na psicodinâmica cromática para justificar a escolha ao cliente.",
      question: "Segundo Derli Kraemer, qual a justificativa para essa escolha no contexto de consumo rápido?",
      options: [
        "Essas cores significam frio e serenidade, incentivando o cliente a permanecer mais tempo no estabelecimento.",
        "O vermelho evoca energia e dinamismo, enquanto o amarelo remete a conforto e prazer; ambas possuem comprimentos de onda longos que exigem mais energia para processar, estimulando a atenção e o apetite.",
        "O amarelo representa inveja e egoísmo, o que afasta a concorrência.",
        "São cores frias que diminuem a taxa metabólica do usuário.",
        "O uso dessas cores visa apenas a economia de pixels na renderização da interface mobile."
      ],
      answer: 1,
      feedback: "Cores quentes (vermelho/amarelo) têm ==key==comprimentos de onda longos==, gerando mais energia psíquica e atenção. O vermelho é ligado ao ==mark==dinamismo== e o amarelo ao ==mark==prazer/conforto==, combinação clássica para estimular consumo rápido."
    },

    {
      aula: "Aula 5 — O Elemento Cor",
      tipo: "Contextualizada",
      texto: "Um estúdio de design foi contratado para redesenhar o aplicativo de meditação e sono MindRest. O designer aplicou a técnica 60-30-10 com as seguintes proporções: 60% Azul como cor dominante (fundo e elementos principais), 30% Verde como cor secundária (ícones e destaques) e 10% Branco como cor de acabamento (textos e separadores).",
      question: "Essa estratégia de composição cromática é classificada como:",
      options: [
        "Contraste por cores complementares, visando despertar o usuário com vibração visual.",
        "Harmonia por cores análogas e frias, promovendo calma, repouso visual e redução da taxa metabólica.",
        "Esquema de cores triádico, buscando um equilíbrio dinâmico e tensionado.",
        "Monocromia pura, pois azul e verde são variações da mesma matiz de vermelho.",
        "Síntese subtrativa instável, pois o azul e o verde combinados geram o magenta."
      ],
      answer: 1,
      feedback: "Azul e Verde são cores vizinhas no círculo cromático (==key==Análogas==) e ambas são classificadas como ==mark==cores frias==, o que as torna ideais para promover calma e relaxamento."
    },

    {
      aula: "Aula 5 — O Elemento Cor",
      tipo: "Aplicação",
      texto: "Um designer está configurando as especificações técnicas de uma cor no seletor de um software de design para uso em uma interface corporativa. As configurações registradas na ferramenta são:<br><br><table style='width:100%;border-collapse:collapse;font-size:0.82rem;margin:0.5rem 0'><thead><tr style='background:rgba(255,255,255,0.08)'><th style='border:1px solid rgba(255,255,255,0.12);padding:7px 10px;text-align:left'>Atributo</th><th style='border:1px solid rgba(255,255,255,0.12);padding:7px 10px;text-align:left'>Valor/Estado</th></tr></thead><tbody><tr><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>Matiz</td><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>Puro (Estado original)</td></tr><tr><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>Luminosidade</td><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>Alta incidência de Branco</td></tr><tr><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>Saturação</td><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>Aproximação do Cinza</td></tr></tbody></table>",
      question: "Com base nas Dimensões da Cor, como essa cor será percebida pelo usuário na interface?",
      options: [
        "Como uma cor vibrante e intensa, ideal para botões de 'Call to Action'.",
        "Como uma cor neutra e opaca, sem brilho e pouco saturada (dessaturada).",
        "Como uma cor escura e pesada, devido à alta luminosidade.",
        "Como uma cor fluorescente, pois a saturação tende ao cinza quando está pura.",
        "Como uma cor preta pura, pois a matiz foi removida."
      ],
      answer: 1,
      feedback: "A ==key==Saturação== (ou croma) refere-se à pureza da cor; quando ela se aproxima do cinza, é chamada de ==mark==dessaturada==. A alta luminosidade com baixa saturação resulta em ==danger==tons pastéis ou opacos==."
    },

    {
      aula: "Aula 5 — O Elemento Cor",
      tipo: "Contextualizada",
      texto: "Um banco digital implementou um sistema de design consistente para seu portal web. Todos os links de seções de ajuda e suporte são exibidos em roxo. Após o usuário visitar uma página de ajuda específica, o link correspondente muda automaticamente para um tom de roxo acinzentado, indicando que aquele conteúdo já foi acessado.",
      question: "Segundo o estudo do elemento Cor aplicado à interface, essa é uma técnica de:",
      options: [
        "Codificação de cores para sinalizar prioridade e status de navegação.",
        "Uso de cores quentes para induzir a leiturabilidade.",
        "Aplicação de cores secundárias da síntese aditiva (RGB).",
        "Uso de cores análogas para gerar tensão visual.",
        "Apenas decoração estética sem valor de usabilidade."
      ],
      answer: 0,
      feedback: "O material cita que as cores podem facilitar a interação e criar senso de prioridade. Usar ==key==Codificação de Cores== em links visitados é uma prática de navegação que ==mark==auxilia o usuário a saber onde já esteve==."
    },

    {
      aula: "Aula 5 — O Elemento Cor",
      tipo: "Contextualizada",
      texto: "Um estúdio de comunicação visual foi contratado para criar peças digitais para a campanha nacional do Setembro Amarelo, voltada à prevenção ao suicídio e valorização da vida. O designer responsável defendeu em reunião a escolha do Amarelo como cor dominante de todas as peças, argumentando com base nos significados associativos documentados na teoria das cores.",
      question: "De acordo com os significados associativos estudados, qual argumento sustenta essa escolha?",
      options: [
        "Egoísmo e ciúmes.",
        "Guerra e violência.",
        "Esperança, iluminação e euforia.",
        "Mistério e roubo.",
        "Humidade e frescor."
      ],
      answer: 2,
      feedback: "O amarelo possui significados como ==key==esperança, prazer e iluminação==, o que se alinha perfeitamente ao propósito da campanha de prevenção e apoio."
    },

    {
      aula: "Aula 5 — O Elemento Cor",
      tipo: "Contextualizada",
      texto: "Um desenvolvedor iniciante em design de interfaces precisa criar o esquema de cores de um site institucional para uma empresa de tecnologia. Ele sabe que precisa trabalhar com cores geradas a partir da luz do monitor, mas tem dificuldade em encontrar combinações harmônicas por conta própria. Um colega mais experiente o orienta a usar uma ferramenta gratuita e intuitiva que permite explorar diferentes esquemas cromáticos (monocromático, triádico, complementar etc.) diretamente no navegador.",
      question: "Qual plataforma e qual sistema de cores o desenvolvedor deve focar para interfaces digitais?",
      options: [
        "Adobe Color / Sistema RGB.",
        "Corel Draw / Sistema CMYK.",
        "Grasshopper / Sistema de onda curta apenas.",
        "Microsoft Word / Sistema de cores terciárias.",
        "Photoshop / Apenas cores neutras."
      ],
      answer: 0,
      feedback: "O material cita o ==key==Adobe Color== como um serviço intuitivo para gerar esquemas (monocromáticos, triádicos, etc.) e reforça que para interfaces digitais usa-se a cor luz (==mark==RGB==)."
    },

    {
      aula: "Aula 5 — O Elemento Cor",
      tipo: "Contextualizada",
      texto: "Durante uma apresentação sobre teoria das cores aplicada ao design de interfaces, um designer demonstrou um experimento visual: o mesmo botão amarelo foi colocado sobre dois fundos distintos — um fundo roxo escuro e um fundo branco. Todos os participantes perceberam o botão como mais claro, mais vibrante e mais destacado quando estava sobre o fundo roxo.",
      question: "Segundo Samara (2010), qual propriedade visual explica esse fenômeno?",
      options: [
        "A temperatura do roxo anulou a matiz do amarelo.",
        "Colocar qualquer cor sobre uma cor mais escura fará com que ela pareça mais clara.",
        "O roxo e o amarelo são cores análogas, o que funde os seus brilhos.",
        "O branco possui uma onda eletromagnética que absorve o amarelo.",
        "A saturação do amarelo diminui quando confrontada com o contraste de tom."
      ],
      answer: 1,
      feedback: "É uma regra física da percepção: uma cor parece ter maior ==mark==luminosidade e destaque quando contrastada com um fundo escuro== do que com um fundo claro."
    },

    // ── Aula 6 — Tipografia ───────────────────────────────

    {
      aula: "Aula 6 — Tipografia",
      tipo: "Contextualizada",
      texto: "Um aplicativo de notícias com foco em leitores acima de 55 anos passou por uma reformulação tipográfica. A equipe de UX decidiu mudar a fonte dos artigos de uma Sans Serif (Arial) para uma Serif (Garamond). Após a mudança, os testes com o público-alvo indicaram que, embora o estilo parecesse mais clássico, a leitura de textos longos ficou visivelmente menos cansativa.",
      question: "Qual a justificativa técnica para essa percepção?",
      options: [
        "Fontes sem serifas são exclusivas para crianças menores de 7 anos.",
        "As serifas funcionam como terminações que auxiliam na continuidade da leitura, reduzindo o cansaço visual em textos longos.",
        "O estilo Garamond é um 'Estilo Moderno' que enfatiza o alinhamento vertical das hastes.",
        "Fontes serifadas ocupam menos pixels no monitor, aumentando a resolução da tela.",
        "A mudança ocorreu porque a Garamond é uma 'Letra Negra' ornamental."
      ],
      answer: 1,
      feedback: "As ==key==Serifas== (pequenos traços no final das hastes) ==mark==ajudam o olho a seguir a linha do texto com mais fluidez==, sendo ideais para volumes grandes de informação impressa ou digital, desde que a resolução permita."
    },

    {
      aula: "Aula 6 — Tipografia",
      tipo: "Contextualizada",
      texto: "Um desenvolvedor Front-End está construindo um blog de tecnologia que precisa funcionar adequadamente em dispositivos com telas muito diferentes — desde monitores 4K de alta resolução até smartphones Android de entrada. O objetivo é garantir que os textos se adaptem proporcionalmente ao contexto de cada dispositivo sem necessidade de declarar tamanhos fixos para cada resolução.",
      question: "Segundo as boas práticas de design responsivo, qual unidade de medida ele deve usar para as fontes?",
      options: [
        "Pixels (px), por serem mais precisos entre os browsers.",
        "EM (unidade tipográfica), pois garante flexibilidade e mantém a proporção independente do tamanho da tela.",
        "Pontos (pt), pois é a unidade oficial dos hieróglifos egípcios.",
        "Altura-X, pois define a distância entre a haste e o ombro da letra.",
        "CMYK, para garantir que a cor da fonte não mude."
      ],
      answer: 1,
      feedback: "O uso de ==key==EM== permite que a fonte ==mark==se adapte proporcionalmente==, facilitando o trabalho do desenvolvedor que não precisa 'caçar break points' em pixels para cada aparelho novo que surge."
    },

    {
      aula: "Aula 6 — Tipografia",
      tipo: "Contextualizada",
      texto: "Um desenvolvedor está implementando o estilo CSS de um blog de notícias mobile e configurou o parágrafo principal conforme o trecho abaixo. Durante os testes de usabilidade, usuários relataram dificuldade de leitura e desconforto visual.<br><br><div style='background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.9rem 1.1rem;font-family:monospace;font-size:0.82rem;line-height:1.7'>p {<br>&nbsp;&nbsp;font-family: 'Times New Roman', serif;<br>&nbsp;&nbsp;text-align: justify;<br>&nbsp;&nbsp;font-size: 16px;<br>}</div>",
      question: "Considerando as orientações sobre legibilidade em telas digitais, quais são os dois principais problemas desta implementação?",
      options: [
        "O uso de fonte Serif e o tamanho de 16px, que é grande demais para celulares.",
        "O alinhamento Justificado, que gera 'caminhos de rato' (lacunas brancas) devido à falta de hifenização na web, e o uso de serifas que podem ser um empecilho em telas pequenas.",
        "O uso de aspas simples no nome da fonte e a falta do peso Bold.",
        "A ausência da regra @font-face e o uso de caixa alta obrigatória.",
        "O parágrafo deveria ter no máximo 80 caracteres, mas o CSS não limita a largura."
      ],
      answer: 1,
      feedback: "O texto ==danger==Justificado== na internet costuma criar grandes espaços vazios desagradáveis ('caminhos de rato'). Além disso, embora serifas ajudem no impresso, em telas pequenas ou de baixa resolução, as fontes ==key==Sans Serif== são mais indicadas para o meio digital."
    },

    {
      aula: "Aula 6 — Tipografia",
      tipo: "Contextualizada",
      texto: "Em setembro de 2015, o Google anunciou uma grande reformulação de sua identidade de marca. Uma das mudanças mais notáveis foi a substituição da fonte com serifas utilizada desde a fundação da empresa por uma fonte Sans Serif geométrica personalizada chamada Product Sans. A decisão foi amplamente elogiada por especialistas em branding e design digital.",
      question: "Qual foi a principal metamensagem visual buscada com essa alteração tipográfica?",
      options: [
        "Retomar o fascínio pela Renascença e pelos tipos móveis de Gutenberg.",
        "Transmitir modernidade, leveza e melhor legibilidade em diferentes dispositivos digitais, mantendo a clareza mesmo em telas menores.",
        "Aplicar o estilo 'Egípcio' com serifas espessas para dar robustez.",
        "Homenagear o alfabeto fenício, que foi o primeiro puramente fonético.",
        "Forçar o usuário a usar o zoom para identificar os caracteres."
      ],
      answer: 1,
      feedback: "Fontes ==key==Sans Serif== passam a sensação de ==mark==modernidade==. No caso da Google, o redesenho visava garantir que a marca fosse ==mark==legível e 'limpa' em qualquer tamanho de tela==, desde relógios inteligentes até TVs."
    },

    {
      aula: "Aula 6 — Tipografia",
      tipo: "Contextualizada",
      texto: "Um tipógrafo está documentando a anatomia das fontes utilizadas em um novo sistema de design. Ao analisar a letra H maiúscula, ele precisa nomear o traço horizontal que conecta as duas hastes verticais. Ao analisar a letra B maiúscula, precisa nomear as partes curvas que criam os espaços internos fechados acima e abaixo do eixo central.",
      question: "Quais nomes técnicos ele deve usar para esses dois elementos anatômicos?",
      options: [
        "Serifa e Descendente.",
        "Trave (ou braço) e Bojo (ou barriga).",
        "Gancho e Haste.",
        "Ombro e Altura-X.",
        "Caixa Alta e Caixa Baixa."
      ],
      answer: 1,
      feedback: "==key==Trave== é o traço horizontal que conecta hastes. ==key==Bojo== é a parte arredondada que cria o ==mark==espaço interno (olho)== das letras."
    },

    {
      aula: "Aula 6 — Tipografia",
      tipo: "Explicativa",
      texto: "Em uma aula sobre a história da tipografia, o professor discute a origem das terminologias utilizadas no design. Ao abordar os termos caixa alta e caixa baixa, ele narra o contexto histórico de onde surgiram essas expressões, explicando que elas não se referem ao tamanho físico das letras, mas a uma prática de organização adotada pelos primeiros profissionais da imprensa.",
      question: "De onde surgiu essa nomenclatura?",
      options: [
        "Do peso das letras de chumbo: as maiúsculas eram mais pesadas e ficavam em caixas no alto.",
        "Da forma como os tipos móveis eram armazenados: as maiúsculas ficavam em caixas superiores de fácil acesso, e as minúsculas em caixas inferiores.",
        "Do tamanho físico das letras: maiúsculas são fisicamente mais altas.",
        "Da hierarquia da Igreja Católica, que guardava bíblias em caixas altas.",
        "De uma regra de CSS criada nos anos 90."
      ],
      answer: 1,
      feedback: "É uma curiosidade histórica: tipógrafos organizavam seus tipos móveis em gavetas/caixas; as letras maiúsculas ficavam na parte de cima (==mark=='Caixa Alta'==) por serem mais requisitadas para títulos e inícios de frase."
    },

    {
      aula: "Aula 6 — Tipografia",
      tipo: "Contextualizada",
      texto: "Uma marca de perfumes de luxo francesa relançou seu site para o mercado brasileiro. O designer escolheu uma fonte estilo Script cursivo para todos os textos descritivos dos produtos, argumentando que a caligrafia transmitia elegância e sofisticação alinhadas ao posicionamento da marca. Semanas após o lançamento, os dados de analytics indicaram que os usuários passavam menos de 5 segundos nos textos dos produtos antes de abandonar a página.",
      question: "Qual o erro de design tipográfico cometido?",
      options: [
        "Fontes Script imitam a escrita manual e são elegantes, mas dificultam a leitura quando empregadas em grandes blocos de texto, devendo ser usadas apenas em detalhes decorativos ou títulos curtos.",
        "O site deveria usar fontes 'Letras Negras' para passar a ideia de luxo.",
        "O erro é a falta de cores complementares no texto.",
        "Fontes cursivas só podem ser lidas por mulheres.",
        "O texto deveria estar centralizado para aumentar a velocidade de leitura."
      ],
      answer: 0,
      feedback: "Fontes caligráficas/==key==Scripts== têm baixa ==danger==leiturabilidade em blocos longos== devido à complexidade de seus traços. O esforço cognitivo do usuário para decifrar as letras cursivas em excesso causa abandono da leitura."
    },

    {
      aula: "Aula 6 — Tipografia",
      tipo: "Aplicação",
      texto: "Um designer está revisando as especificações tipográficas de um aplicativo mobile de leitura de notícias, conforme o documento técnico da equipe:<br><br><div style='background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.8rem 1rem;margin:0.5rem 0;font-size:0.85rem;line-height:1.8'><strong>Tamanho da fonte:</strong> 12px<br><strong>Largura da linha de texto:</strong> 65 caracteres<br><strong>Espaçamento entre linhas:</strong> Aumentado</div>",
      question: "Qual ajuste ainda seria necessário para otimizar essa interface especificamente para smartphones?",
      options: [
        "Diminuir o tamanho para 10px, pois adultos leem melhor assim.",
        "Reduzir a quantidade de caracteres por linha para cerca de 30 a 35, facilitando o processamento visual em telas estreitas.",
        "Mudar o alinhamento para justificado para evitar o 'caminho de rato'.",
        "Usar obrigatoriamente a fonte Times New Roman para passar veracidade.",
        "Remover todos os espaços entre as palavras para caber mais texto."
      ],
      answer: 1,
      feedback: "Para desktops, 50 a 80 caracteres por linha são aceitáveis, mas para ==key==celulares==, o ideal é cortar para ==mark==30-35 caracteres== para que o usuário não se perca ao trocar de linha em uma tela pequena."
    },

    {
      aula: "Aula 6 — Tipografia",
      tipo: "Explicativa",
      texto: "Um desenvolvedor web sênior está treinando um estagiário sobre as boas práticas de tipografia digital. Para contextualizar as limitações do passado, ele explica como o processo de escolha e aplicação de fontes em websites evoluiu drasticamente desde os primeiros anos da internet até as tecnologias atuais.",
      question: "Qual a principal diferença técnica e de usabilidade entre o uso de fontes em sites nos anos 90 e nos dias atuais?",
      options: [
        "Antigamente usava-se apenas hieróglifos, hoje usamos o alfabeto fenício.",
        "Nos anos 90, o designer era limitado às fontes instaladas no PC do usuário; hoje, com o CSS @font-face e serviços como Google Fonts, é possível incorporar qualquer fonte via servidor.",
        "Atualmente as fontes são bitmaps, e antigamente eram vetores móveis.",
        "Não há diferença, a tecnologia de tipos móveis de 1450 ainda é a única usada na web.",
        "Hoje usamos apenas fontes de 'Pincel' para facilitar o toque na tela."
      ],
      answer: 1,
      feedback: "A evolução das ==key==Webfonts== permitiu liberdade criativa. Antes, se o usuário não tivesse a fonte instalada, o site 'quebrava' para uma fonte padrão. Agora, o navegador baixa a fonte necessária automaticamente via ==mark==@font-face e Google Fonts==."
    },

    {
      aula: "Aula 6 — Tipografia",
      tipo: "Contextualizada",
      texto: "O Governo Federal está licitando o desenvolvimento de um novo sistema digital para declaração e acompanhamento do Imposto de Renda. Os requisitos de design especificam que a interface deve transmitir seriedade, tradição institucional e confiança, para que o contribuinte se sinta seguro ao inserir dados financeiros sensíveis no sistema.",
      question: "Qual categoria de tipos é a mais adequada para os títulos deste projeto e por quê?",
      options: [
        "Decorativas ou Fantasia, para atrair o público jovem.",
        "Pincel, para dar um toque humano.",
        "Estilo Antigo ou Transicionais (Serifadas), por serem associadas à tradição e seriedade.",
        "Letras Negras, para facilitar a leitura de quem tem visão baixa.",
        "Itálico e Condensado em todas as palavras para economizar espaço."
      ],
      answer: 2,
      feedback: "Fontes com serifas (especialmente os estilos ==key==Antigo e Transicional==) são culturalmente ligadas a ==mark==instituições sérias, livros e jornais tradicionais==, transmitindo a autoridade necessária para um sistema de impostos."
    },

    // ── Aula 7 — A Imagem ─────────────────────────────────

    {
      aula: "Aula 7 — A Imagem",
      tipo: "Contextualizada",
      texto: "Uma equipe de desenvolvimento está criando um catálogo digital de alta performance para uma loja de móveis de luxo. Os produtos precisam ser exibidos com fundos transparentes que se adaptem dinamicamente a diferentes paletas de cores do site, sem perda de definição nos detalhes das texturas. O gerente de infraestrutura alerta que o tempo de carregamento é crítico, pois pesquisas indicam que usuários abandonam páginas que demoram mais de 3 segundos.",
      question: "Qual formato de imagem é o mais adequado para atender aos requisitos de transparência com alta definição?",
      options: [
        "JPEG, pois possui o algoritmo de compressão mais eficaz para fotografias.",
        "GIF, porque permite fundos transparentes e é o formato mais leve para a web.",
        "PNG, pois suporta transparência com alta definição e possui algoritmo otimizado, apesar de ser mais pesado que o JPEG.",
        "TIFF, por ser o formato de maior qualidade e não apresentar perda de informação.",
        "BMP, pois não possui compressão e garante que o móvel seja visto sem ruídos de cor."
      ],
      answer: 2,
      feedback: "O ==key==PNG== é o formato ideal quando se exige ==mark==transparência com alta definição==. Embora seja mais pesado que o JPEG, ele não perde qualidade na compressão da mesma forma."
    },

    {
      aula: "Aula 7 — A Imagem",
      tipo: "Contextualizada",
      texto: "Um designer está mapeando os signos visuais utilizados no aplicativo de GPS de uma montadora de automóveis. Ele identifica dois tipos distintos: (1) o ícone de bomba de gasolina simplificada que indica um posto de combustível próximo, e (2) o sinal de exclamação dentro de um triângulo amarelo que alerta sobre perigo na pista.",
      question: "Segundo a classificação de Peirce, como esses dois signos são definidos, respectivamente?",
      options: [
        "Ícone (por analogia com o objeto) e Símbolo (por convenção social).",
        "Índice (por causa física) e Ícone (por semelhança).",
        "Símbolo (por regra) e Índice (por causalidade).",
        "Índice (por indicação direta) e Símbolo (por convenção).",
        "Ambos são Ícones, pois representam objetos do mundo real de forma fiel."
      ],
      answer: 0,
      feedback: "O desenho da bomba de combustível é um ==key==Ícone==, pois mantém uma relação de ==mark==analogia/semelhança== com o objeto real. O sinal de perigo é um ==key==Símbolo==, pois sua interpretação depende de uma ==mark==convenção social== (aprendizado prévio de que o triângulo com exclamação significa alerta)."
    },

    {
      aula: "Aula 7 — A Imagem",
      tipo: "Contextualizada",
      texto: "Um designer de interface está desenvolvendo a tela de receita de um aplicativo de culinária. Para exibir a foto principal do prato, ele optou por uma composição centralizada com espaço em branco uniforme em todos os lados da imagem, sem elementos visuais concorrentes ao redor. O objetivo era criar uma apresentação neutra que permitisse ao usuário analisar o prato sem distrações.",
      question: "Segundo Samara (2010), qual a percepção visual gerada por esse tipo de composição?",
      options: [
        "Sensação de movimento e dinamismo.",
        "Imagem neutra ou descritiva, analisada de forma isolada.",
        "Sensação de alienação do objeto.",
        "Poder imagético confrontador.",
        "Ambiguidade visual indesejada."
      ],
      answer: 1,
      feedback: "De acordo com o material, se uma figura tem um tamanho com ==mark==espaço circundante relativamente uniforme==, ela é percebida como ==key==neutra ou descritiva==."
    },

    {
      aula: "Aula 7 — A Imagem",
      tipo: "Contextualizada",
      texto: "Uma agência de publicidade criou uma campanha digital para um banco de investimentos. A peça principal apresenta uma fotografia de uma família feliz reunida em um campo florido durante o pôr do sol. Logo abaixo da imagem, um texto em destaque diz: 'O investimento certo para o futuro de quem você ama'. O texto foi posicionado estrategicamente para impedir que o usuário interpretasse a cena como um simples passeio de lazer.",
      question: "Qual técnica de interação semiótica entre imagem e texto foi utilizada?",
      options: [
        "Relais.",
        "Redundância.",
        "Informatividade.",
        "Ancoragem.",
        "Discrepância."
      ],
      answer: 3,
      feedback: "A ==key==Ancoragem== ocorre quando as palavras presentes na imagem (ou entorno) ==mark==dizem como interpretar a imagem==, controlando o entendimento do leitor."
    },

    {
      aula: "Aula 7 — A Imagem",
      tipo: "Contextualizada",
      texto: "Um portal de saúde pública criou um infográfico interativo para explicar ao público leigo como funciona a vacina de RNA mensageiro contra a COVID-19. O material combina ilustrações detalhadas dos mecanismos celulares, dados estatísticos de eficácia e textos explicativos curtos. Pesquisas de compreensão mostraram que 94% dos usuários compreenderam o conteúdo pelo infográfico, contra 41% que leram apenas o texto explicativo.",
      question: "Essa relação entre imagem e texto é classificada como:",
      options: [
        "Redundância.",
        "Complexidade.",
        "Informatividade.",
        "Ancoragem.",
        "Indexação Casual."
      ],
      answer: 2,
      feedback: "Na ==key==Informatividade==, o ==mark==poder semiótico da imagem é superior ao do texto verbal==, caso clássico de infográficos e manuais explicativos."
    },

    {
      aula: "Aula 7 — A Imagem",
      tipo: "Aplicação",
      texto: "Uma equipe de web design está definindo as especificações técnicas de imagens para um novo portal de notícias. A tabela comparativa elaborada pelo arquiteto de informação apresenta os dois cenários principais:<br><br><table style='width:100%;border-collapse:collapse;font-size:0.82rem;margin:0.5rem 0'><thead><tr style='background:rgba(255,255,255,0.08)'><th style='border:1px solid rgba(255,255,255,0.12);padding:7px 10px;text-align:left'>Elemento</th><th style='border:1px solid rgba(255,255,255,0.12);padding:7px 10px;text-align:left'>Resolução</th><th style='border:1px solid rgba(255,255,255,0.12);padding:7px 10px;text-align:left'>Tamanho Estimado</th></tr></thead><tbody><tr><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>Foto Original da Câmera</td><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>300 dpi</td><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>5 MB</td></tr><tr><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>Foto Otimizada para Web</td><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>72 ppi</td><td style='border:1px solid rgba(255,255,255,0.08);padding:7px 10px'>10 KB</td></tr></tbody></table>",
      question: "Por que a foto otimizada para web é o padrão para o desenvolvimento de sites?",
      options: [
        "Porque monitores não conseguem processar imagens acima de 10 KB.",
        "Para garantir a velocidade de navegação, menor uso de armazenamento e tempo de resposta rápido do servidor.",
        "Porque a imagem de 72 ppi é vetorial e a de 300 dpi é bitmap.",
        "Porque o sistema RGB só funciona em resoluções baixas.",
        "Porque imagens compactadas aumentam a fidelidade das cores em dispositivos móveis."
      ],
      answer: 1,
      feedback: "Na tomada de decisão digital, deve-se considerar limitações como ==key==velocidade de navegação, armazenamento e tempo de resposta==. Imagens de ==mark==72 ppi compactadas== são o padrão para viabilizar o acesso."
    },

    {
      aula: "Aula 7 — A Imagem",
      tipo: "Contextualizada",
      texto: "A equipe de UX de uma empresa de segurança digital está redesenhando o painel de monitoramento de servidores. Para representar visualmente o estado de sobrecarga de um servidor, o designer optou por utilizar o ícone de fumaça saindo de um componente, aproveitando a associação natural que os usuários fazem entre fumaça e calor ou mau funcionamento.",
      question: "De acordo com a classificação de Peirce, este signo é um exemplo de:",
      options: [
        "Ícone, pois se parece com o calor.",
        "Símbolo, pois foi decidido em reunião.",
        "Índice (ou indício), pois apresenta uma relação causal e física com o objeto (fogo/calor).",
        "Metamensagem abstrata, pois não tem forma definida.",
        "Relais visual, pois precisa de texto para ser entendido."
      ],
      answer: 2,
      feedback: "O ==key==Índice== aponta para o objeto através de uma ==mark==relação causal de contiguidade física==, como a fumaça indicando fogo ou calor excessivo."
    },

    {
      aula: "Aula 7 — A Imagem",
      tipo: "Contextualizada",
      texto: "Uma nova rede social voltada para criadores independentes está sendo lançada no mercado. O fundador e a equipe criativa debateram longamente sobre a identidade visual do logotipo. A proposta vencedora foi uma ilustração feita à mão pelo artista-diretor, em vez de uma fotografia ou de um ícone vetorial geométrico. A escolha foi justificada com base nos valores da marca e no efeito psicológico que esse estilo gera nos usuários.",
      question: "Qual a vantagem estratégica dessa escolha para a marca?",
      options: [
        "Garantir que o usuário entenda o objeto como algo 100% real.",
        "Reduzir o peso do arquivo para menos de 10 KB obrigatoriamente.",
        "Conectar-se em um nível mais pessoal e explorar o sentido de criatividade e inovação.",
        "Evitar o uso do sistema RGB.",
        "Facilitar a ancoragem de textos longos."
      ],
      answer: 2,
      feedback: "A escolha de uma ilustração ajuda na representação de sentimentos e fantasias, conectando em um ==mark==nível mais pessoal== e explorando a ==key==criatividade==."
    },

    {
      aula: "Aula 7 — A Imagem",
      tipo: "Contextualizada",
      texto: "Um estudante de design digital está analisando diferentes arquivos de imagem em um editor gráfico. Ao ampliar uma das imagens para 400% no zoom, ele percebe que a imagem se fragmenta em pequenos quadrados coloridos serrilhados que distorcem completamente a nitidez original. Ao ampliar um segundo arquivo para o mesmo zoom, a imagem mantém sua qualidade perfeita sem qualquer perda de definição.",
      question: "A primeira imagem, que perde qualidade ao ser ampliada, é estruturada em:",
      options: [
        "Vetores baseados em fórmulas matemáticas.",
        "Grids de 12 colunas responsivas.",
        "Bitmaps baseados em pixels (pontos na tela).",
        "Formato TIFF de alta compressão.",
        "Síntese subtrativa de luz."
      ],
      answer: 2,
      feedback: "Imagens cuja estrutura é baseada em ==key==Pixels== (pontos na tela) são conhecidas como ==mark==Bitmaps==. ==danger==Ao ampliar, os pixels ficam visíveis e a imagem perde nitidez==, ao contrário das imagens vetoriais."
    },

    {
      aula: "Aula 7 — A Imagem",
      tipo: "Contextualizada",
      texto: "Um fotógrafo profissional utiliza o formato JPEG para entregar imagens editadas a clientes de casamentos. Ele percebeu que, após salvar e reabrir o arquivo diversas vezes para fazer pequenos ajustes, as imagens começam a apresentar artefatos de compressão progressivos — pequenas manchas e perda de detalhes que não existiam no arquivo original.",
      question: "Qual a principal desvantagem do formato JPEG que explica esse comportamento?",
      options: [
        "Não permite mais de 256 cores.",
        "Como o algoritmo de compressão tem perda de informação, o arquivo perde dados continuamente cada vez que é guardado.",
        "É um formato pesado demais para a Internet.",
        "Não aceita o sistema de cores RGB.",
        "Exige o uso obrigatório de Grids."
      ],
      answer: 1,
      feedback: "O algoritmo do ==key==JPEG== tem ==danger==perda de informação==; sempre que o ficheiro é guardado, ele atua, ==mark==perdendo informações continuamente==."
    },

    // ── Aula 8 — O Layout ─────────────────────────────────

    {
      aula: "Aula 8 — O Layout",
      tipo: "Contextualizada",
      texto: "O designer-chefe de um portal de notícias de grande circulação decidiu reformular o layout da homepage. A nova proposta apresenta todos os elementos (manchetes, fotos, categorias e anúncios) perfeitamente alinhados a eixos verticais e horizontais, sem elementos inesperados, diagonais ou composições que fujam do grid. O resultado é uma interface ordenada, previsível e de fácil leitura.",
      question: "Segundo Dondis (2007), essa composição é classificada como:",
      options: [
        "Aguçamento, pois foca na surpresa visual.",
        "Ambiguidade, pois demonstra descuido decisivo.",
        "Nivelamento, pois apresenta harmonia centralizada e sem surpresas.",
        "Fragmentação, pois divide o conteúdo em colunas.",
        "Instabilidade, pois provoca o olhar do usuário."
      ],
      answer: 2,
      feedback: "O ==key==Nivelamento== ocorre em composições ==mark==organizadas em seus eixos, sem surpresas visuais==, gerando uma perfeita harmonia."
    },

    {
      aula: "Aula 8 — O Layout",
      tipo: "Aplicação",
      texto: "Um desenvolvedor front-end está migrando um layout fixo em pixels para um layout responsivo. Em uma das seções, a barra lateral ocupa atualmente 320px de largura fixa, em um container de 1280px. Para garantir que a proporção seja mantida em qualquer resolução, ele precisa converter esse valor para porcentagem usando a fórmula: objeto ÷ largura = resultado.",
      question: "Utilizando a fórmula objeto ÷ largura = resultado, qual o valor correto para o CSS?",
      options: [
        "width: 32%;",
        "width: 20%;",
        "width: 25%;",
        "width: 40%;",
        "width: 0,25%;"
      ],
      answer: 2,
      feedback: "A fórmula é ==key==objeto ÷ largura = resultado==. Logo, 320 ÷ 1280 = 0,25. Multiplicando por 100 para obter a porcentagem, temos ==mark==25%==."
    },

    {
      aula: "Aula 8 — O Layout",
      tipo: "Contextualizada",
      texto: "O arquiteto de informação responsável pelo redesign de um sistema de gestão escolar estabeleceu uma diretriz para a equipe de desenvolvimento: nenhuma funcionalidade principal do sistema poderia estar a mais de um número específico de ações do usuário a partir da tela inicial. O objetivo era garantir que professores e coordenadores encontrassem rapidamente lançamentos de notas, chamadas e relatórios, sem precisar navegar por menus profundos.",
      question: "Que regra de navegação foi aplicada?",
      options: [
        "Regra dos Terços.",
        "Regra do Nivelamento Visual.",
        "Técnica dos Três Cliques.",
        "Técnica da Fragmentação Unificada.",
        "Lei da Proximidade de Gestalt."
      ],
      answer: 2,
      feedback: "Para garantir uma boa navegação, o material sugere a ==key==Técnica dos Três Cliques==: o usuário deve chegar às seções principais ==mark==clicando no máximo três vezes==."
    },

    {
      aula: "Aula 8 — O Layout",
      tipo: "Contextualizada",
      texto: "Um designer está apresentando dois conceitos de layout para o site de uma galeria de arte contemporânea. O primeiro conceito utiliza pouquíssimos elementos por tela, grandes áreas de respiro e uma hierarquia visual muito clara, transmitindo sofisticação por meio da ausência. O segundo conceito usa o mínimo absoluto de recursos compositivos, eliminando tudo que não seja essencial à comunicação.",
      question: "Quais técnicas visuais polarizadas estão sendo descritas respectivamente?",
      options: [
        "Exagero e Profusão.",
        "Unidade e Fragmentação.",
        "Economia e Minimização (Minimalismo).",
        "Instabilidade e Aguçamento.",
        "Simetria e Complexidade."
      ],
      answer: 2,
      feedback: "A ==key==Economia== é uma organização parcimoniosa e sensata; a ==key==Minimização (Minimalismo)== baseia-se na premissa de que ==mark=='menos é mais'==."
    },

    {
      aula: "Aula 8 — O Layout",
      tipo: "Contextualizada",
      texto: "Uma equipe de design está desenvolvendo um aplicativo mobile para gestão de finanças pessoais. O líder técnico orientou que toda a estrutura de telas fosse baseada em um sistema de Grids de 12 colunas, padrão utilizado nos principais frameworks de design responsivo do mercado.",
      question: "Qual a principal justificativa técnica para o uso desse grid específico no desenvolvimento moderno?",
      options: [
        "Porque 12 é o número de cores primárias do círculo cromático.",
        "Para garantir a uniformidade do design e facilitar a responsividade do layout em diferentes dispositivos.",
        "Porque o HTML5 só aceita divisões por 12.",
        "Para forçar o usuário a ler apenas da direita para a esquerda.",
        "Para criar obrigatoriamente um layout ambíguo."
      ],
      answer: 1,
      feedback: "O grid ajuda na estruturação, garante ==key==consistência visual== e facilita tornar a interface ==mark==responsiva==. O formato de 12 colunas é popular por permitir divisões uniformes."
    },

    {
      aula: "Aula 8 — O Layout",
      tipo: "Contextualizada",
      texto: "Um consultor de UX está comparando as estratégias visuais de duas lojas virtuais concorrentes no segmento de eletrônicos. A primeira loja utiliza imagens e botões com pesos visuais idênticos, divididos por uma linha central imaginária que cria um espelho perfeito entre os dois lados da tela. A segunda loja usa elementos de tamanhos diferentes, mas equilibrados visualmente por meio de variações de cor, tom e espaçamento.",
      question: "Essas técnicas são, respectivamente:",
      options: [
        "Nivelamento e Aguçamento.",
        "Simetria (equilíbrio axial) e Assimetria.",
        "Regularidade e Instabilidade.",
        "Economia e Exagero.",
        "Fragmentação e Unidade."
      ],
      answer: 1,
      feedback: "A ==key==Simetria== é o ==mark==equilíbrio axial (partes iguais como espelho)==; a ==key==Assimetria== cria equilíbrio usando leis da Gestalt ==danger==sem igualdade formal de lados==."
    },

    {
      aula: "Aula 8 — O Layout",
      tipo: "Explicativa",
      texto: "Durante uma reunião de kickoff de um projeto de redesign de sistema ERP, o cliente perguntou ao designer o que exatamente seria o Layout da nova interface. O designer precisou explicar o conceito de forma precisa e abrangente, diferenciando-o de elementos individuais como cor, tipografia ou imagem isolados.",
      question: "O termo Layout é definido como:",
      options: [
        "O código-fonte de um sistema.",
        "A apresentação hierárquica, em conjunto, de todos os elementos compositivos de uma composição visual.",
        "Apenas a escolha das cores primárias de um site.",
        "O manual de instruções de um aplicativo.",
        "Uma técnica exclusiva de impressão de livros."
      ],
      answer: 1,
      feedback: "Definição literal do material: o layout é a ==key==apresentação hierárquica em conjunto== de todos os elementos (cor, tipo, imagem)."
    },

    {
      aula: "Aula 8 — O Layout",
      tipo: "Contextualizada",
      texto: "Um estúdio independente de desenvolvimento de jogos está criando a interface de um jogo de terror psicológico em primeira pessoa. O designer de UI tomou a decisão consciente de estruturar os menus e telas de HUD com elementos visuais inclinados, assimétricos e propositalmente fora dos eixos esperados, para que o jogador se sinta constantemente desconfortável e em estado de alerta, mesmo nas telas de pausa.",
      question: "Essa escolha técnica baseia-se em qual polaridade visual?",
      options: [
        "Equilíbrio.",
        "Estabilidade.",
        "Instabilidade.",
        "Simplicidade.",
        "Nivelamento Axial."
      ],
      answer: 2,
      feedback: "A ==key==Instabilidade== é uma opção visual ==mark==inquietante, tensionada e provocadora==, sendo o contraste da necessidade humana de equilíbrio."
    },

    {
      aula: "Aula 8 — O Layout",
      tipo: "Contextualizada",
      texto: "O designer de uma plataforma de analytics empresarial precisou criar uma tela de dashboard que apresenta simultaneamente dezenas de indicadores diferentes — KPIs, gráficos de tendência, alertas e tabelas comparativas. Para organizar o volume de informação sem sobrecarregar visualmente o usuário, ele separou cada conjunto de dados em cards individuais com bordas delimitadas, mantendo o aspecto isolado de cada bloco, embora todos se relacionem no contexto geral do painel.",
      question: "De acordo com o conteúdo sobre Layout, essa técnica de decomposição é chamada de:",
      options: [
        "Unidade.",
        "Economia.",
        "Fragmentação.",
        "Minimização.",
        "Aguçamento."
      ],
      answer: 2,
      feedback: "A ==key==Fragmentação== é a ==mark==decomposição dos elementos em partes separadas que conservam seu aspecto individual==."
    },

    {
      aula: "Aula 8 — O Layout",
      tipo: "Explicativa",
      texto: "Durante um workshop de design de interfaces, o instrutor discute como fatores culturais influenciam diretamente as decisões de composição de layout. Ele demonstra que ignorar os padrões culturais de leitura do público-alvo pode comprometer gravemente a hierarquia visual e fazer com que os elementos mais importantes de uma tela sejam ignorados pelo usuário.",
      question: "Qual a orientação cultural de leitura que o designer deve considerar ao posicionar os elementos mais importantes de um layout para o público ocidental?",
      options: [
        "Da direita para a esquerda, de baixo para cima.",
        "Em círculos concêntricos, partindo do centro.",
        "Da esquerda para a direita e de cima para baixo.",
        "Apenas verticalmente, do centro para as bordas.",
        "A leitura é aleatória e depende apenas das cores quentes."
      ],
      answer: 2,
      feedback: "O material reforça que a ==key==tendência ocidental== é ler da ==mark==esquerda para a direita e de cima para baixo==."
    },

  ],

  ava: [],

};