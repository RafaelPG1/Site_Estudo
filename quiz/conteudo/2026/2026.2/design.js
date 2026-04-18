// ============================================================
// NEXUS STUDY — quiz/conteudo/2026/2026.2/design.js
// ============================================================
window.questoes = {

  // Questões de Design
  questoes: [  
 {
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
  ],

  ava: [
    {
      question: "O que significa consistência no design?",
      options: [
        "Mudar layout frequentemente",
        "Manter padrões visuais e comportamentais",
        "Usar cores aleatórias",
        "Ignorar o usuário"
      ],
      answer: 1,
      feedback: "Consistência melhora usabilidade e previsibilidade."
    },
    {
      question: "Feedback no sistema é:",
      options: [
        "Erro no sistema",
        "Resposta às ações do usuário",
        "Delay",
        "Código invisível"
      ],
      answer: 1,
      feedback: "Feedback informa o resultado das ações do usuário."
    }
  ],

  /* ══════════════════════════════════════════════════════════
     QUESTÕES ENADE Desing
     ══════════════════════════════════════════════════════════ */
  enade: [

    /* ──────────────────────────────────────────────────────────
       AULA 9 — Prototipagem e Norma ISO 9241
    ────────────────────────────────────────────────────────── */

    // ── Q1: Asserção + Justificativa — Modelo Cascata ─────────
    {
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

    // ── Q2: Asserção + Justificativa — ISO 9241 Eficiência ────
    {
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

    // ── Q3: Asserção + Justificativa — Design Thinking ────────
    {
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

    // ── Q4: Múltiplas afirmativas — Ciclos de vida ────────────
    {
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

    // ── Q5: Múltiplas afirmativas — 7 princípios ISO 9241 ─────
    {
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

    // ── Q6: Múltiplas afirmativas — Design Thinking princípios
    {
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

    // ── Q7: Conceitual — Modelo Estrela vs Shneiderman ────────
    {
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

    // ── Q8: Conceitual — Manifesto Ágil ───────────────────────
    {
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

    // ── Q9: Conceitual — Métricas ISO 9241 ───────────────────
    {
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

    // ── Q10: Análise aplicada — Escolha de modelo ─────────────
    {
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

    // ── Q11: Análise aplicada — Violação ISO 9241 ─────────────
    {
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

    // ── Q12: Análise aplicada — Engenharia de Software ────────
    {
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

  ]

};