/* =============================================
   NEXUS STUDY — res_analise_projeto.js
   Disciplina: analise de projeto
   ============================================= */

window.__nexusConteudo = {
  aulas: [
  // aula 1
  {
  aula: "Conceitos Iniciais",
    ideia_central: "A aula introduz os conceitos fundamentais de análise e projeto de sistemas, apresentando o processo de desenvolvimento de software, a diferença complementar entre análise (o que o sistema deve fazer) e modelagem (como o sistema deve fazer), os tipos de modelagem existentes e os conceitos centrais da abordagem orientada a objetos.",
    secoes: [
      {
        id: "visao",
        titulo: "Visão geral do conteúdo",
        blocos: [
          {
            tipo: "texto",
            texto: "Material: **Aula 1 — Conceitos Iniciais**, da disciplina de análise e projeto de sistemas. O material apresenta uma visão geral do desenvolvimento de software, análise e modelagem de sistemas e os principais conceitos da abordagem orientada a objetos."
          },
          {
            tipo: "texto",
            texto: "A aula introduz conceitos fundamentais para a **análise e o projeto de sistemas**."
          },
          {
            tipo: "lista",
            titulo: "Os principais temas são",
            itens: [
              "**Desenvolvimento de software**",
              "**Análise de sistemas**",
              "**Modelagem de sistemas**",
              "**Tipos de modelagem**",
              "**Modelagem orientada a objetos**",
              "**Conceitos fundamentais de orientação a objetos**"
            ]
          },
          {
            tipo: "destaque",
            texto: "A ideia central da aula é entender que **análise e modelagem são etapas complementares**: **Análise → define o que o sistema deve fazer.** **Modelagem → mostra como o sistema deve fazer.**"
          }
        ]
      },
      {
        id: "desenvolvimento_software",
        titulo: "Desenvolvimento de software",
        blocos: [
          {
            tipo: "texto",
            texto: "O desenvolvimento de software é apresentado como um processo **complexo e multifacetado**, composto por diversas atividades organizadas em fases."
          },
          {
            tipo: "texto",
            texto: "Segundo o material, essas fases podem variar de acordo com o processo de software utilizado. Também pode haver **mais de um ciclo de vida** dentro de um processo."
          },
          {
            tipo: "lista",
            titulo: "Um processo genérico pode envolver",
            itens: [
              "**Levantamento de requisitos**",
              "**Planejamento**",
              "**Design**",
              "**Desenvolvimento**",
              "**Teste**",
              "**Implantação**"
            ]
          },
          {
            tipo: "topico",
            titulo: "Levantamento de requisitos",
            texto: "É o momento de conversar com o cliente e identificar necessidades, propósito do software e funcionalidades desejadas. Essa etapa estabelece uma **base para o projeto**."
          },
          {
            tipo: "destaque",
            texto: "Para prova: **Levantamento de requisitos = descobrir o que o cliente precisa e o que o sistema deverá oferecer.**"
          },
          {
            tipo: "topico",
            titulo: "Planejamento",
            texto: "Define objetivos de negócio, requisitos detalhados, especificações do projeto e riscos potenciais. Também envolve a **identificação e mitigação de riscos**, buscando garantir que o desenvolvimento ocorra de maneira eficaz e eficiente."
          },
          {
            tipo: "topico",
            titulo: "Design",
            texto: "Cria o plano da aplicação, detalhando elementos como arquitetura do software, interface do usuário e design do banco de dados. O objetivo é transformar os requisitos e objetivos em uma **estrutura concreta** que orientará as etapas seguintes."
          },
          {
            tipo: "topico",
            titulo: "Desenvolvimento",
            texto: "É a etapa em que ocorre codificação e construção do software. O planejamento e o design são transformados em uma **aplicação operacional**."
          },
          {
            tipo: "topico",
            titulo: "Teste e implantação",
            texto: "O software é submetido a testes para verificar se atende aos requisitos e especificações. Após a validação, ocorre a **implantação do software**."
          },
          {
            tipo: "destaque",
            texto: "Importante: em cada fase são definidas atividades, funções, responsabilidades da equipe e artefatos que deverão ser entregues. Os artefatos podem incluir **documentos, modelos, códigos e outros produtos do processo**."
          }
        ]
      },
      {
        id: "analise_modelagem_sistema",
        titulo: "Análise e modelagem do sistema",
        blocos: [
          {
            tipo: "texto",
            texto: "A análise e a modelagem são **complementares e essenciais** para o desenvolvimento de software com qualidade."
          },
          {
            tipo: "tabela",
            titulo: "Diferença fundamental entre Análise e Modelagem",
            colunas: ["Análise", "Modelagem"],
            linhas: [
              ["Define **o que** o sistema deve fazer", "Mostra **como** o sistema deve fazer"],
              ["Entende requisitos e necessidades", "Representa os requisitos"],
              ["Investiga o problema", "Estrutura uma representação do sistema"],
              ["Está ligada à análise de requisitos", "Pode utilizar diagramas, símbolos e modelos"]
            ]
          },
          {
            tipo: "destaque",
            texto: "Essa diferença é uma das partes **mais importantes da aula para prova**."
          }
        ]
      },
      {
        id: "analise_sistema",
        titulo: "Análise do sistema",
        blocos: [
          {
            tipo: "texto",
            texto: "A **análise do sistema** é o processo utilizado para entender e especificar os requisitos de um sistema de software."
          },
          {
            tipo: "lista",
            titulo: "Ela busca descobrir",
            itens: [
              "O que o sistema deve fazer",
              "Como o sistema deve se comportar",
              "Quais são as necessidades dos usuários",
              "Quais são os objetivos do sistema"
            ]
          },
          {
            tipo: "lista",
            titulo: "A análise inclui",
            itens: [
              "Comunicação com usuários",
              "Comunicação com clientes",
              "Comunicação com stakeholders",
              "Coleta de informações",
              "Validação das informações",
              "Compreensão do problema",
              "Compreensão do domínio",
              "Identificação das necessidades do sistema",
              "Documentação dos resultados"
            ]
          },
          {
            tipo: "texto",
            texto: "Ela está diretamente relacionada à **análise de requisitos**."
          },
          {
            tipo: "exemplo",
            titulo: "Exemplo do sistema de estoque",
            texto: "O material apresenta como exemplo a reformulação de um **sistema de gestão de estoque de uma varejista**. A análise poderia identificar problemas como atrasos na reposição de produtos e dificuldade no rastreamento dos itens. A partir dessa análise, poderia ser desenvolvido um novo sistema utilizando, por exemplo, **IoT** para monitoramento do estoque em tempo real e algoritmos preditivos para automatizar a reposição.",
            detalhe: "O exemplo demonstra como a análise pode identificar problemas e orientar soluções alinhadas às necessidades do negócio."
          }
        ]
      },
      {
        id: "modelagem_sistema",
        titulo: "Modelagem do sistema",
        blocos: [
          {
            tipo: "texto",
            texto: "A **modelagem do sistema** representa e organiza os requisitos de um sistema de forma visual, estruturada e abstrata. Para isso, utiliza diagramas, símbolos e anotações."
          },
          {
            tipo: "lista",
            titulo: "Objetivos da modelagem — a modelagem facilita",
            itens: [
              "Compreensão",
              "Comunicação",
              "Projeto",
              "Implementação",
              "Teste",
              "Manutenção do sistema"
            ]
          },
          {
            tipo: "texto",
            texto: "Uma das ferramentas destacadas é a **UML — Unified Modeling Language**, padrão amplamente utilizado para modelagem de sistemas orientados a objetos."
          },
          {
            tipo: "topico",
            titulo: "Sistema de biblioteca",
            texto: "O material apresenta o **diagrama de caso de uso** como exemplo de diagrama UML. Ele é utilizado para detalhar as **interações dos usuários com o sistema**, proporcionando uma visão das funcionalidades e processos."
          },
          {
            tipo: "topico",
            titulo: "Sistema hospitalar",
            texto: "Em um sistema de gestão hospitalar, entidades como pacientes, médicos e medicamentos podem ser representadas como **objetos**, cada um possuindo seus próprios atributos e métodos. Isso facilita a compreensão das relações e interações do sistema."
          }
        ]
      },
      {
        id: "tipos_modelagem",
        titulo: "Tipos de modelagem de sistemas",
        blocos: [
          {
            tipo: "texto",
            texto: "O material apresenta diferentes formas de modelar sistemas."
          },
          {
            tipo: "topico",
            titulo: "Modelagem Estruturada",
            texto: "É tradicionalmente utilizada para representar processos, dados e fluxos dentro de um sistema."
          },
          {
            tipo: "topico",
            titulo: "Modelagem Funcional",
            texto: "É centrada nas **funções e processos do sistema**. Utiliza o princípio da **modularização**, dividindo o sistema em unidades menores e mais gerenciáveis. Isso facilita manutenção e atualizações. O material cita como técnicas o **Diagrama de Blocos de Fluxo Funcional** e o **IDEF0**."
          },
          {
            tipo: "destaque",
            texto: "Para memorizar: **Modelagem funcional → foco nas funções/processos.**"
          },
          {
            tipo: "topico",
            titulo: "Modelagem baseada em processos",
            texto: "É utilizada para definir, projetar e analisar sistemas complexos. Assim como a modelagem funcional, enfatiza a **modularização**, dividindo o sistema em unidades menores e gerenciáveis. Ela ajuda a compreender o fluxo de trabalho, identificar problemas e criar soluções."
          },
          {
            tipo: "destaque",
            texto: "Para memorizar: **Modelagem baseada em processos → foco na definição, projeto e análise dos processos e seus fluxos.**"
          }
        ]
      },
      {
        id: "modelagem_formal",
        titulo: "Modelagem formal",
        blocos: [
          {
            tipo: "texto",
            texto: "A **modelagem formal** utiliza **lógica formal** para descrever matematicamente o comportamento de um sistema."
          },
          {
            tipo: "texto",
            texto: "É especialmente útil em **componentes críticos**, aumentando a confiança de que o sistema realmente obedece à sua especificação. Normalmente é empregada em sistemas que exigem **maior precisão**."
          },
          {
            tipo: "texto",
            texto: "O material apresenta **Redes de Petri** como exemplo de modelagem formal."
          },
          {
            tipo: "imagem",
            src: "modelagem_formal_redes_de_petri.png",
            pasta: "imagens_analise_projeto/aula_01",
            alt: "A figura apresenta uma modelagem formal feita com Redes de Petri, representando visualmente estados/atividades e seus relacionamentos em um fluxo. Ela exemplifica como uma representação formal pode ser utilizada para analisar o comportamento de uma atividade com maior precisão. (Página 9)",
            num: 1
          }
        ]
      },
      {
        id: "modelagem_oo",
        titulo: "Modelagem Orientada a Objetos",
        blocos: [
          {
            tipo: "texto",
            texto: "A **Modelagem Orientada a Objetos (OO)** é uma das modelagens mais utilizadas apresentadas no material."
          },
          {
            tipo: "lista",
            titulo: "Seu foco está em",
            itens: [
              "Objetos",
              "Interações entre objetos"
            ]
          },
          {
            tipo: "texto",
            texto: "Ela busca simplificar a complexidade dos sistemas, organizando **dados e processos em módulos pequenos e integrados**. A UML é utilizada como uma forma de representar esses modelos."
          },
          {
            tipo: "imagem",
            src: "diagrama_uml_modelagem_orientada_objetos.png",
            pasta: "imagens_analise_projeto/aula_01",
            alt: "O diagrama UML representa classes/interfaces e seus relacionamentos, exemplificando como a modelagem orientada a objetos organiza objetos, comportamentos e relações entre diferentes elementos do sistema. (Página 10)",
            num: 2
          },
          {
            tipo: "texto",
            texto: "Durante a análise, modelos orientados a objetos ajudam a conectar o **espaço do problema** ao **espaço da solução**, proporcionando uma compreensão coerente da funcionalidade do sistema."
          }
        ]
      },
      {
        id: "abordagem_oo",
        titulo: "Abordagem Orientada a Objetos",
        blocos: [
          {
            tipo: "texto",
            texto: "Na orientação a objetos, os **objetos são as unidades básicas de construção**."
          },
          {
            tipo: "lista",
            titulo: "Um objeto possui",
            itens: [
              "**Características → atributos**",
              "**Comportamentos → métodos**"
            ]
          },
          {
            tipo: "texto",
            texto: "Os objetos podem se comunicar e interagir para realizar tarefas específicas."
          },
          {
            tipo: "lista",
            titulo: "Os principais conceitos apresentados são",
            itens: [
              "**Classe**",
              "**Objeto**",
              "**Encapsulamento**",
              "**Herança**",
              "**Polimorfismo**",
              "**Abstração**"
            ]
          }
        ]
      },
      {
        id: "classe",
        titulo: "Classe",
        blocos: [
          {
            tipo: "texto",
            texto: "Uma **classe** é uma estrutura que define as características e comportamentos comuns de um conjunto de objetos."
          },
          {
            tipo: "destaque",
            texto: "Pense assim: **Classe = modelo/estrutura.** Ela define o que os objetos daquele tipo podem possuir e fazer."
          }
        ]
      },
      {
        id: "objeto",
        titulo: "Objeto",
        blocos: [
          {
            tipo: "texto",
            texto: "Um **objeto** é uma **instância de uma classe**. Ou seja, representa concretamente aquilo que foi definido pela classe."
          },
          {
            tipo: "destaque",
            texto: "Para memorizar: **Classe → definição.** **Objeto → instância concreta da definição.**"
          }
        ]
      },
      {
        id: "encapsulamento_oo",
        titulo: "Encapsulamento",
        blocos: [
          {
            tipo: "texto",
            texto: "O **encapsulamento** protege dados e métodos de acessos ou modificações indevidas por outros objetos."
          },
          {
            tipo: "texto",
            texto: "A ideia central é **controlar o acesso aos detalhes internos do objeto**."
          }
        ]
      },
      {
        id: "heranca",
        titulo: "Herança",
        blocos: [
          {
            tipo: "texto",
            texto: "A **herança** permite que uma classe herde características e comportamentos de outra classe."
          },
          {
            tipo: "texto",
            texto: "A classe também pode adicionar ou modificar características e comportamentos herdados."
          },
          {
            tipo: "destaque",
            texto: "Para memorizar: **Herança = reaproveitamento e especialização de características/comportamentos de outra classe.**"
          }
        ]
      },
      {
        id: "polimorfismo",
        titulo: "Polimorfismo",
        blocos: [
          {
            tipo: "texto",
            texto: "O **polimorfismo** permite que diferentes operações tenham o **mesmo nome**, tornando os objetos mais independentes."
          },
          {
            tipo: "texto",
            texto: "O material também apresenta polimorfismo como a capacidade de um objeto assumir **diferentes formas dependendo do contexto**."
          },
          {
            tipo: "destaque",
            texto: "Para memorizar: **Polimorfismo = mesma interface/nome, comportamentos diferentes dependendo do contexto.**"
          }
        ]
      },
      {
        id: "abstracao",
        titulo: "Abstração",
        blocos: [
          {
            tipo: "texto",
            texto: "A **abstração** simplifica e generaliza um problema ou conceito. Para isso, ignora detalhes irrelevantes e detalhes desnecessários."
          },
          {
            tipo: "texto",
            texto: "Na prática, esconde detalhes da implementação, permitindo utilizar algo sem precisar conhecer sua implementação interna."
          },
          {
            tipo: "destaque",
            texto: "Para memorizar: **Abstração = mostrar o que é importante e esconder detalhes desnecessários.**"
          }
        ]
      },
      {
        id: "vantagens_oo",
        titulo: "Vantagens da orientação a objetos",
        blocos: [
          {
            tipo: "texto",
            texto: "O material destaca diversas vantagens."
          },
          {
            tipo: "topico",
            titulo: "Modularidade",
            texto: "É a divisão do programa em **partes independentes e reutilizáveis**."
          },
          {
            tipo: "topico",
            titulo: "Reutilização de código",
            texto: "Consiste em aproveitar **código já existente** para criar novas funcionalidades."
          },
          {
            tipo: "topico",
            titulo: "Polimorfismo",
            texto: "Permite que um objeto assuma diferentes formas dependendo do contexto."
          },
          {
            tipo: "texto",
            texto: "De forma geral, a análise e o desenvolvimento orientados a objetos buscam produzir software flexível, fácil de alterar, fácil de manter e reutilizável."
          }
        ]
      },
      {
        id: "linguagens_boas_praticas",
        titulo: "Linguagens e boas práticas",
        blocos: [
          {
            tipo: "lista",
            titulo: "O material cita como exemplos de linguagens que implementam orientação a objetos",
            itens: [
              "**Java**",
              "**C#**",
              "**Python**",
              "**Ruby**",
              "e outras"
            ]
          },
          {
            tipo: "lista",
            titulo: "A orientação a objetos também favorece práticas como",
            itens: [
              "**Design Patterns**",
              "**Clean Code**",
              "**SOLID**"
            ]
          },
          {
            tipo: "texto",
            texto: "O material informa que esses assuntos serão aprofundados posteriormente."
          }
        ]
      },
      {
        id: "formulas_metodos",
        titulo: "Fórmulas e métodos",
        blocos: [
          {
            tipo: "texto",
            texto: "Esta aula é predominantemente **conceitual** e não apresenta fórmulas matemáticas para cálculo. Os principais **métodos/técnicas** que precisam ser lembrados são:"
          },
          {
            tipo: "topico",
            titulo: "Processo de desenvolvimento",
            texto: "**Requisitos → Planejamento → Design → Desenvolvimento → Teste → Implantação**. O material apresenta essa sequência como exemplo de processo genérico, podendo haver variações conforme o processo de software utilizado."
          },
          {
            tipo: "lista",
            titulo: "Modelagem",
            itens: [
              "Modelagem estruturada",
              "Modelagem funcional",
              "Modelagem baseada em processos",
              "Modelagem formal",
              "Modelagem orientada a objetos"
            ]
          }
        ]
      },
      {
        id: "comparacoes",
        titulo: "Comparações importantes para prova",
        blocos: [
          {
            tipo: "topico",
            titulo: "Análise × Modelagem",
            texto: "**Análise:** O que o sistema deve fazer? **Modelagem:** Como representar/estruturar o sistema para compreender como ele deve funcionar?"
          },
          {
            tipo: "topico",
            titulo: "Classe × Objeto",
            texto: "**Classe:** estrutura que define características e comportamentos. **Objeto:** instância concreta dessa classe."
          },
          {
            tipo: "topico",
            titulo: "Encapsulamento × Abstração",
            texto: "**Encapsulamento:** protege/controla o acesso aos dados e métodos. **Abstração:** simplifica o problema escondendo detalhes desnecessários."
          },
          {
            tipo: "topico",
            titulo: "Herança × Polimorfismo",
            texto: "**Herança:** uma classe pode receber características e comportamentos de outra. **Polimorfismo:** diferentes operações podem possuir o mesmo nome/comportar-se de formas diferentes conforme o contexto."
          },
          {
            tipo: "topico",
            titulo: "Modelagem funcional × Orientada a objetos",
            texto: "**Funcional:** foco nas **funções e processos**, utilizando modularização. **Orientada a objetos:** foco nos **objetos e suas interações**, organizando dados e processos em módulos integrados."
          }
        ]
      },
      {
        id: "resumo",
        titulo: "Resumo final para revisão rápida",
        blocos: [
          {
            tipo: "topico",
            titulo: "🟦 Desenvolvimento de software",
            texto: "Processo composto por atividades organizadas em fases. Exemplo: **Levantamento de requisitos → Planejamento → Design → Desenvolvimento → Teste → Implantação**"
          },
          {
            tipo: "topico",
            titulo: "🟦 Análise",
            texto: "**Define o que o sistema deve fazer.**",
            lista: [
              "Usuários",
              "Clientes",
              "Stakeholders",
              "Requisitos",
              "Necessidades",
              "Objetivos",
              "Documentação"
            ]
          },
          {
            tipo: "topico",
            titulo: "🟦 Modelagem",
            texto: "**Representa/organiza os requisitos de forma visual, estruturada e abstrata.** Pode facilitar compreensão, comunicação, projeto, implementação, testes e manutenção."
          },
          {
            tipo: "topico",
            titulo: "🟦 Tipos de modelagem",
            lista: [
              "**Estruturada →** processos, dados e fluxos.",
              "**Funcional →** funções e processos.",
              "**Baseada em processos →** definição, projeto, análise e fluxo de processos.",
              "**Formal →** lógica formal e comportamento matemático; indicada para maior precisão.",
              "**Orientada a objetos →** objetos e suas interações."
            ]
          },
          {
            tipo: "topico",
            titulo: "🟦 UML",
            texto: "**Unified Modeling Language.** É um padrão amplamente utilizado para **modelar sistemas orientados a objetos**."
          },
          {
            tipo: "topico",
            titulo: "🟩 Orientação a Objetos",
            lista: [
              "**Objeto =** instância de uma classe.",
              "**Classe =** define características e comportamentos.",
              "**Atributo =** característica do objeto.",
              "**Método =** comportamento do objeto.",
              "**Encapsulamento =** protege/controla dados e métodos.",
              "**Herança =** permite herdar características e comportamentos.",
              "**Polimorfismo =** permite diferentes comportamentos/formas em diferentes contextos.",
              "**Abstração =** simplifica e esconde detalhes desnecessários."
            ]
          },
          {
            tipo: "topico",
            titulo: "🟩 Vantagens da OO",
            lista: [
              "**Modularidade**",
              "**Reutilização de código**",
              "**Flexibilidade**",
              "**Facilidade de alteração**",
              "**Facilidade de manutenção**",
              "**Reutilização**"
            ]
          },
          {
            tipo: "destaque",
            texto: "⭐ O que eu decoraria para a prova: **Análise = O QUÊ.** **Modelagem = COMO.** **Classe = modelo.** **Objeto = instância.** **Encapsulamento = proteger.** **Herança = herdar.** **Polimorfismo = várias formas/comportamentos.** **Abstração = esconder detalhes.** **Funcional = funções/processos.** **Formal = precisão/lógica matemática.** **Orientada a objetos = objetos/interações.**"
          },
          {
            tipo: "texto",
            texto: "Esses são os conceitos centrais que o próprio material reforça nas considerações finais: **análise e modelagem como pontos complementares**, diferentes tipos de modelagem e a **modelagem orientada a objetos como uma das mais utilizadas**."
          }
        ]
      }
    ]
  },
  // aula 2
  {
  aula: "Ciclo de Vida do Software",
ideia_central: "A aula apresenta o conceito de ciclo de vida do software, os principais modelos de ciclo de vida (Cascata, Incremental, RAD, Prototipagem, Espiral, RUP e Metodologias Ágeis), suas características, vantagens e exemplos de aplicação, além de detalhar as fases gerais do desenvolvimento de software e os principais tipos de testes utilizados para validação.",
secoes: [
  {
    id: "visao",
    titulo: "Visão geral do conteúdo",
    blocos: [
      {
        tipo: "texto",
        texto: "**Material:** *Aula 2 — Ciclo de Vida do Software*. **Disciplina:** Análise e Projeto de Sistemas I. **Total:** 21 páginas."
      },
      {
        tipo: "texto",
        texto: "O **ciclo de vida do software** corresponde ao conjunto de fases e processos que um software percorre **desde sua concepção inicial até sua manutenção e eventual descontinuação**."
      },
      {
        tipo: "lista",
        titulo: "O material apresenta",
        itens: [
          "Definição e importância do ciclo de vida",
          "Fases do desenvolvimento",
          "Principais modelos de ciclo de vida",
          "Características e aplicações de cada modelo",
          "Comparação entre os modelos",
          "Detalhes das fases de desenvolvimento",
          "Principais tipos de testes"
        ]
      },
      {
        tipo: "lista",
        titulo: "Os principais modelos estudados são",
        itens: [
          "**Cascata**",
          "**Incremental**",
          "**RAD**",
          "**Prototipagem**",
          "**Espiral**",
          "**RUP**",
          "**Metodologias Ágeis**"
        ]
      }
    ]
  },
  {
    id: "conceito_ciclo_vida",
    titulo: "O que é ciclo de vida do software?",
    blocos: [
      {
        tipo: "texto",
        texto: "É uma abordagem estruturada que organiza as diferentes fases pelas quais um software passa. Ele começa na **concepção** e segue até a **descontinuação**, passando por atividades como planejamento, análise, projeto, desenvolvimento, testes, implantação e manutenção."
      },
      {
        tipo: "topico",
        titulo: "Por que é importante?",
        texto: "Um ciclo de vida bem definido ajuda a organizar o desenvolvimento e gerenciar o projeto.",
        lista: [
          "Organizar o desenvolvimento",
          "Controlar o projeto",
          "Planejar atividades",
          "Gerenciar recursos",
          "Controlar custos",
          "Controlar prazos",
          "Reduzir riscos",
          "Melhorar a qualidade",
          "Facilitar manutenção e evolução do software"
        ]
      },
      {
        tipo: "destaque",
        texto: "Para prova: **Ciclo de vida = estrutura que organiza o software desde sua concepção até sua manutenção/descontinuação.**"
      }
    ]
  },
  {
    id: "principais_modelos",
    titulo: "Principais modelos de ciclo de vida",
    blocos: [
      {
        tipo: "texto",
        texto: "Os diferentes modelos surgiram para atender a diferentes tipos de projetos. O material apresenta uma evolução histórica."
      },
      {
        tipo: "lista",
        titulo: "Evolução histórica dos modelos",
        itens: [
          "**Cascata:** década de 1970",
          "**Espiral:** década de 1980",
          "**Incremental e RAD:** década de 1990",
          "**Metodologias Ágeis:** século XXI"
        ]
      }
    ]
  },
  {
    id: "cascata",
    titulo: "Modelo em Cascata",
    blocos: [
      {
        tipo: "texto",
        texto: "O **Modelo em Cascata** é o modelo mais antigo e tradicional apresentado. Foi formalizado por **Royce em 1970**."
      },
      {
        tipo: "lista",
        titulo: "É um modelo",
        itens: [
          "**Linear**",
          "**Sequencial**",
          "Baseado em fases sucessivas"
        ]
      },
      {
        tipo: "destaque",
        texto: "A principal característica é que **uma fase começa somente quando a anterior termina**."
      },
      {
        tipo: "texto",
        texto: "As atividades apresentadas são: **Definição de requisitos → Projeto → Implementação e teste unitário → Integração e teste de sistema → Operação e manutenção.**"
      },
      {
        tipo: "imagem",
        src: "modelo_cascata.png",
        pasta: "imagens_analise_projeto/aula_02",
        alt: "O diagrama representa as fases do modelo em sequência, começando pela definição de requisitos e avançando para projeto, implementação, testes, integração e operação/manutenção. As setas mostram a progressão entre as etapas. (Página 7)",
        num: 1
      },
      {
        tipo: "topico",
        titulo: "Quando é adequado?",
        texto: "É indicado para projetos em que os requisitos são bem conhecidos, os requisitos são estáveis e há pouca expectativa de mudanças."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo do material",
        texto: "**Sistemas de controle de tráfego aéreo**, nos quais os requisitos são estáveis e bem compreendidos."
      },
      {
        tipo: "texto",
        texto: "Ponto forte: **Organização e previsibilidade.**"
      },
      {
        tipo: "texto",
        texto: "Ponto fraco principal: como as fases são sequenciais, mudanças posteriores nos requisitos podem ser difíceis de incorporar."
      }
    ]
  },
  {
    id: "incremental",
    titulo: "Modelo Incremental",
    blocos: [
      {
        tipo: "texto",
        texto: "O **Modelo Incremental** foi desenvolvido como uma melhoria em relação ao Cascata."
      },
      {
        tipo: "lista",
        titulo: "Nele, os requisitos são",
        itens: [
          "Obtidos",
          "Agrupados em módulos",
          "Desenvolvidos individualmente",
          "Entregues de maneira incremental"
        ]
      },
      {
        tipo: "texto",
        texto: "Cada módulo passa pelas fases do ciclo de vida e resulta em uma **entrega parcial**. Assim, o sistema vai aumentando progressivamente sua funcionalidade."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo do material",
        texto: "Um sistema de gestão empresarial pode ser dividido em módulos como contabilidade, recursos humanos e estoque. Esses módulos podem ser entregues gradualmente."
      },
      {
        tipo: "destaque",
        texto: "Ideia principal: **Incremental = o sistema é construído e entregue por partes.**"
      },
      {
        tipo: "imagem",
        src: "modelo_incremental.png",
        pasta: "imagens_analise_projeto/aula_02",
        alt: "O diagrama mostra diferentes incrementos sendo desenvolvidos ao longo do cronograma. Cada incremento passa por etapas de comunicação, planejamento, modelagem, construção e entrega, aumentando progressivamente a funcionalidade do software. (Página 8)",
        num: 2
      }
    ]
  },
  {
    id: "rad",
    titulo: "RAD — Rapid Application Development",
    blocos: [
      {
        tipo: "texto",
        texto: "**RAD (Rapid Application Development)** significa **Desenvolvimento Rápido de Aplicações**. Foi formalizado por **James Martin em 1991**."
      },
      {
        tipo: "lista",
        titulo: "O RAD enfatiza",
        itens: [
          "Desenvolvimento rápido",
          "Ciclos muito curtos",
          "Desenvolvimento incremental",
          "Desenvolvimento iterativo",
          "Entrega rápida"
        ]
      },
      {
        tipo: "texto",
        texto: "O material menciona ciclos frequentemente entre **60 e 90 dias**."
      },
      {
        tipo: "topico",
        titulo: "Quando utilizar?",
        texto: "É indicado para projetos que precisam de **entrega rápida**."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo do material",
        texto: "Desenvolvimento de **protótipos de software para startups** que precisam lançar rapidamente produtos no mercado."
      },
      {
        tipo: "destaque",
        texto: "Para prova: **RAD = rapidez + ciclos comprimidos + desenvolvimento iterativo e incremental.**"
      },
      {
        tipo: "imagem",
        src: "modelo_ciclo_vida_rad.png",
        pasta: "imagens_analise_projeto/aula_02",
        alt: "O diagrama apresenta o ciclo do RAD, com análise e projeto rápido, ciclos de prototipagem, demonstração/refinamento, testes e implantação. Ele representa visualmente a característica iterativa e rápida do modelo. (Página 9)",
        num: 3
      }
    ]
  },
  {
    id: "prototipagem",
    titulo: "Prototipagem",
    blocos: [
      {
        tipo: "texto",
        texto: "A **Prototipagem** consiste na construção de um **exemplar inicial do software**, chamado protótipo."
      },
      {
        tipo: "lista",
        titulo: "Seu objetivo é",
        itens: [
          "Captar requisitos",
          "Esclarecer requisitos",
          "Refinar requisitos"
        ]
      },
      {
        tipo: "lista",
        titulo: "Pode ser",
        itens: [
          "Um modelo de ciclo de vida independente",
          "Uma técnica utilizada dentro de outros modelos"
        ]
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo do material",
        texto: "Desenvolvimento de **interfaces de usuário**, utilizando protótipos para esclarecer requisitos visuais e funcionais."
      },
      {
        tipo: "destaque",
        texto: "Para prova: **Prototipagem = criar uma versão inicial para entender e refinar os requisitos.**"
      }
    ]
  },
  {
    id: "espiral",
    titulo: "Modelo Espiral",
    blocos: [
      {
        tipo: "texto",
        texto: "O **Modelo Espiral** foi proposto por **Boehm em 1988**. É uma abordagem **cíclica** que combina elementos de Cascata e Prototipagem."
      },
      {
        tipo: "topico",
        titulo: "Cada iteração da espiral envolve",
        lista: [
          "Definição de objetivos",
          "Análise de riscos",
          "Desenvolvimento",
          "Planejamento da próxima fase"
        ]
      },
      {
        tipo: "topico",
        titulo: "Principal característica",
        texto: "O **risco** recebe grande importância. O processo é repetido em ciclos, permitindo analisar e reduzir riscos continuamente."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo do material",
        texto: "**Sistemas de defesa**, nos quais a análise contínua e a mitigação de riscos são importantes."
      },
      {
        tipo: "destaque",
        texto: "Para prova: **Espiral = ciclos + análise de riscos + desenvolvimento iterativo.**"
      },
      {
        tipo: "imagem",
        src: "modelo_espiral.png",
        pasta: "imagens_analise_projeto/aula_02",
        alt: "A representação mostra o desenvolvimento organizado em ciclos sucessivos. Cada volta da espiral envolve planejamento, análise de riscos, modelagem, construção e entrega/feedback, reforçando o caráter iterativo e orientado a riscos do modelo. (Página 9)",
        num: 4
      }
    ]
  },
  {
    id: "rup",
    titulo: "RUP — Rational Unified Process",
    blocos: [
      {
        tipo: "texto",
        texto: "O **RUP (Rational Unified Process)** é um modelo iterativo, incremental e orientado a casos de uso."
      },
      {
        tipo: "lista",
        titulo: "Ele é dividido em quatro fases",
        itens: [
          "**Concepção**",
          "**Elaboração**",
          "**Construção**",
          "**Transição**"
        ]
      },
      {
        tipo: "texto",
        texto: "O RUP foi desenvolvido pela **Rational Software Corporation** e posteriormente adquirido pela **IBM**. O material destaca que oferece estrutura configurável e melhores práticas comprovadas."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo",
        texto: "**Grandes sistemas corporativos**, especialmente quando existe alta complexidade e necessidade de documentação detalhada."
      }
    ]
  },
  {
    id: "metodologias_ageis",
    titulo: "Metodologias Ágeis",
    blocos: [
      {
        tipo: "topico",
        titulo: "As Metodologias Ágeis trabalham com ciclos",
        lista: [
          "Curtos",
          "Incrementais",
          "Iterativos"
        ]
      },
      {
        tipo: "topico",
        titulo: "Possuem forte foco em",
        lista: [
          "Colaboração contínua com o cliente",
          "Resposta rápida às mudanças",
          "Entregas frequentes",
          "Revisões regulares",
          "Feedback do cliente"
        ]
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo do material",
        texto: "Desenvolvimento de **aplicativos móveis**, em que os requisitos do mercado podem mudar e as expectativas dos usuários podem mudar rapidamente."
      },
      {
        tipo: "destaque",
        texto: "Principal característica: **Agilidade e adaptação às mudanças.**"
      },
      {
        tipo: "imagem",
        src: "modelo_scrum.png",
        pasta: "imagens_analise_projeto/aula_02",
        alt: "O diagrama representa um ciclo do Scrum envolvendo visão, backlog, planejamento da sprint, sprint, revisão, retrospectiva e geração de incremento do produto. Ele demonstra o caráter incremental e iterativo da abordagem. (Página 10)",
        num: 5
      }
    ]
  },
  {
    id: "comparacao_modelos",
    titulo: "Comparação dos modelos",
    blocos: [
      {
        tipo: "texto",
        texto: "O material apresenta uma tabela comparativa entre os modelos."
      },
      {
        tipo: "tabela",
        titulo: "Comparação dos modelos de ciclo de vida",
        colunas: ["Modelo", "Característica principal", "Exemplo do material"],
        linhas: [
          ["Cascata", "Linear e sequencial; requisitos bem definidos", "Controle de tráfego aéreo"],
          ["Incremental", "Entregas parciais e desenvolvimento modular", "Gestão empresarial"],
          ["Evolutivo", "Requisitos adquiridos/refinados durante a evolução", "Aplicações web dinâmicas"],
          ["RAD", "Desenvolvimento rápido, iterativo e incremental", "Protótipos para startups"],
          ["Prototipagem", "Construção de exemplares iniciais para captar requisitos", "Interfaces de usuário"],
          ["Espiral", "Abordagem cíclica e análise de riscos", "Sistemas de defesa"],
          ["RUP", "Iterativo, incremental e orientado a casos de uso", "Grandes sistemas corporativos"],
          ["Metodologias Ágeis", "Desenvolvimento incremental-iterativo, entregas frequentes e alta adaptabilidade", "Aplicativos móveis"]
        ]
      },
      {
        tipo: "destaque",
        texto: "Atenção: o quadro inclui **Evolutivo**, embora o texto anterior do material não apresente uma seção específica desenvolvendo esse modelo. Portanto, para a prova, vale reconhecer a característica indicada na tabela: **requisitos adquiridos e refinados paralelamente à evolução**."
      },
      {
        tipo: "imagem",
        src: "comparacao_modelos_ciclo_vida.png",
        pasta: "imagens_analise_projeto/aula_02",
        alt: "Tabela que compara os modelos de ciclo de vida apresentados, suas características e exemplos práticos. (Página 11)",
        num: 6
      }
    ]
  },
  {
    id: "escolha_modelo",
    titulo: "Como escolher um modelo?",
    blocos: [
      {
        tipo: "texto",
        texto: "Não existe um único modelo que seja sempre o melhor."
      },
      {
        tipo: "lista",
        titulo: "A escolha deve considerar",
        itens: [
          "Características do projeto",
          "Vantagens e desvantagens",
          "Contexto",
          "Requisitos",
          "Necessidade de mudanças",
          "Complexidade",
          "Características do sistema"
        ]
      },
      {
        tipo: "texto",
        texto: "Os exemplos apresentados no material são apenas situações práticas associadas aos modelos. O próprio material ressalta que um projeto poderia ser desenvolvido utilizando outros modelos também."
      }
    ]
  },
  {
    id: "fases_ciclo_vida",
    titulo: "Fases do ciclo de vida",
    blocos: [
      {
        tipo: "lista",
        titulo: "O material apresenta como fases gerais",
        itens: [
          "**Planejamento**",
          "**Análise de requisitos**",
          "**Design (Projeto)**",
          "**Implementação (Desenvolvimento)**",
          "**Testes**",
          "**Implantação**",
          "**Manutenção**"
        ]
      },
      {
        tipo: "imagem",
        src: "fases_desenvolvimento_software.png",
        pasta: "imagens_analise_projeto/aula_02",
        alt: "A figura apresenta visualmente a sequência das principais fases do desenvolvimento: levantamento de requisitos, análise, projeto, desenvolvimento, teste, validação e implantação. (Página 12)",
        num: 7
      }
    ]
  },
  {
    id: "planejamento",
    titulo: "Planejamento",
    blocos: [
      {
        tipo: "texto",
        texto: "O planejamento estabelece a **base do projeto**."
      },
      {
        tipo: "lista",
        titulo: "Envolve",
        itens: [
          "Definição dos objetivos",
          "Identificação dos recursos",
          "Estimativa de custos",
          "Elaboração do cronograma"
        ]
      },
      {
        tipo: "topico",
        titulo: "Objetivos claros",
        texto: "Todos devem compreender o que o projeto pretende alcançar."
      },
      {
        tipo: "topico",
        titulo: "Recursos e cronograma",
        texto: "Identificação dos recursos humanos, tecnológicos e financeiros, além da criação de um cronograma."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo",
        texto: "Em um sistema de **controle de tráfego aéreo**, o planejamento poderia definir metas de segurança e eficiência, além dos profissionais necessários e do custo estimado."
      }
    ]
  },
  {
    id: "analise_requisitos",
    titulo: "Análise de requisitos",
    blocos: [
      {
        tipo: "lista",
        titulo: "É responsável por",
        itens: [
          "Coletar necessidades",
          "Analisar necessidades",
          "Documentar necessidades",
          "Identificar funcionalidades que o software deve possuir"
        ]
      },
      {
        tipo: "lista",
        titulo: "Técnicas citadas pelo material",
        itens: [
          "**Entrevistas**",
          "**Questionários**",
          "**Workshops**"
        ]
      },
      {
        tipo: "topico",
        titulo: "Engajamento do usuário",
        texto: "Envolve usuários finais para garantir que os requisitos reflitam suas necessidades reais."
      },
      {
        tipo: "topico",
        titulo: "Documentação detalhada",
        texto: "Os requisitos documentados servem de base para as fases seguintes."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo",
        texto: "Em um aplicativo de gerenciamento de tarefas, workshops podem identificar funcionalidades como criação de tarefas, definição de prioridades e integração com calendários."
      }
    ]
  },
  {
    id: "design_projeto",
    titulo: "Design — Projeto",
    blocos: [
      {
        tipo: "texto",
        texto: "Transforma os requisitos em uma **arquitetura detalhada** que orientará a construção do software."
      },
      {
        tipo: "lista",
        titulo: "Envolve",
        itens: [
          "Diagramas UML",
          "Estrutura de dados",
          "Algoritmos",
          "Componentes",
          "Interações entre componentes"
        ]
      },
      {
        tipo: "topico",
        titulo: "Modelagem visual",
        texto: "O material cita diagramas UML, incluindo diagramas de classes, diagramas de sequência e diagramas de estados."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo",
        texto: "Em um sistema de **e-commerce**, o design pode utilizar diagrama de classes para produtos, usuários e pedidos, e diagrama de sequência para representar o fluxo de compra."
      }
    ]
  },
  {
    id: "implementacao",
    titulo: "Implementação — Desenvolvimento",
    blocos: [
      {
        tipo: "texto",
        texto: "É a fase em que o software é efetivamente **codificado** de acordo com o design."
      },
      {
        tipo: "lista",
        titulo: "Envolve",
        itens: [
          "Escrita do código",
          "Testes unitários",
          "Integração dos componentes"
        ]
      },
      {
        tipo: "topico",
        titulo: "Codificação",
        texto: "Transforma requisitos e design em código funcional."
      },
      {
        tipo: "topico",
        titulo: "Integração contínua",
        texto: "Integração dos componentes para detectar problemas de integração o mais cedo possível."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo",
        texto: "Em um aplicativo bancário: login seguro, transferência de fundos, visualização de extratos. Os componentes devem funcionar tanto isoladamente quanto integrados."
      }
    ]
  },
  {
    id: "testes",
    titulo: "Testes",
    blocos: [
      {
        tipo: "texto",
        texto: "Os testes verificam e validam o software para garantir que atenda aos requisitos, funcione corretamente, esteja livre de defeitos e tenha desempenho adequado antes da implantação."
      },
      {
        tipo: "texto",
        texto: "O material apresenta seis tipos principais."
      },
      {
        tipo: "topico",
        titulo: "Testes funcionais",
        texto: "Verificam se **cada funcionalidade funciona conforme os requisitos**."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo — Testes funcionais",
        texto: "Sistema de biblioteca: empréstimo, devolução, consulta ao catálogo."
      },
      {
        tipo: "topico",
        titulo: "Testes de desempenho",
        texto: "Avaliam o comportamento do sistema sob diferentes condições de carga. Medem aspectos como tempo de resposta, throughput, utilização de recursos e possíveis gargalos."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo — Testes de desempenho",
        texto: "Verificar se um site de comércio eletrônico suporta muitos usuários simultâneos durante a **Black Friday**."
      },
      {
        tipo: "topico",
        titulo: "Testes de segurança",
        texto: "Identificam e corrigem vulnerabilidades para proteger os dados contra acessos não autorizados e ataques maliciosos. O exemplo do material cita **SQL Injection** e **Cross-Site Scripting (XSS)**."
      },
      {
        tipo: "destaque",
        texto: "Para prova: **Segurança = procurar vulnerabilidades e proteger o sistema contra ataques.**"
      },
      {
        tipo: "topico",
        titulo: "Testes de comportamento",
        texto: "Avaliam como o sistema reage em **cenários reais de uso**. Simulam interações dos usuários e verificam as respostas do sistema."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo — Testes de comportamento",
        texto: "Aplicativo de tarefas: criar tarefa, editar, excluir, utilizar entradas inválidas, verificar respostas inesperadas."
      },
      {
        tipo: "topico",
        titulo: "Testes de regressão",
        texto: "Verificam se uma nova alteração **não quebrou funcionalidades que já funcionavam**. Essa é uma definição muito importante para prova."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo — Testes de regressão",
        texto: "Depois de adicionar uma funcionalidade a um CRM, verificar se gerenciamento de contatos e rastreamento de vendas continuam funcionando."
      },
      {
        tipo: "destaque",
        texto: "Para memorizar: **Regressão = mudou algo novo → verifica se o que já funcionava continua funcionando.**"
      },
      {
        tipo: "topico",
        titulo: "Testes de usabilidade",
        texto: "Avaliam a facilidade de interação do usuário com o software. Verificam se a interface é intuitiva, eficiente e fácil de utilizar."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo — Testes de usabilidade",
        texto: "Em um aplicativo móvel, verificar se o usuário consegue navegar pelas telas, encontrar informações e realizar ações sem dificuldade."
      }
    ]
  },
  {
    id: "implantacao",
    titulo: "Implantação",
    blocos: [
      {
        tipo: "texto",
        texto: "A implantação consiste em instalar o software no **ambiente de produção**, tornando-o disponível para os usuários finais."
      },
      {
        tipo: "topico",
        titulo: "Preparação do ambiente",
        texto: "Servidores, redes, bancos de dados."
      },
      {
        tipo: "topico",
        titulo: "Migração de dados",
        texto: "Transferência dos dados do sistema antigo para o novo, quando necessário."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo",
        texto: "Implantação de um sistema de gerenciamento de inventário em uma cadeia de supermercados, incluindo configuração dos servidores, instalação nos pontos de venda e migração dos dados."
      }
    ]
  },
  {
    id: "manutencao",
    titulo: "Manutenção",
    blocos: [
      {
        tipo: "texto",
        texto: "A manutenção ocorre depois da implantação e envolve correção de defeitos, implementação de melhorias, adaptação a novas necessidades e adaptação a novas tecnologias."
      },
      {
        tipo: "topico",
        titulo: "Correção de bugs",
        texto: "Solucionar problemas encontrados após a implantação."
      },
      {
        tipo: "topico",
        titulo: "Atualizações e melhorias",
        texto: "Adicionar funcionalidades e melhorias com base no feedback dos usuários."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo",
        texto: "Em um sistema de gestão escolar: corrigir bugs relatados, adicionar relatórios de desempenho, integrar sistemas de pagamento online."
      }
    ]
  },
  {
    id: "formulas_metodos",
    titulo: "Fórmulas e métodos",
    blocos: [
      {
        tipo: "texto",
        texto: "Esta aula **não apresenta fórmulas matemáticas**. O que deve ser memorizado são principalmente **sequências, características e critérios de utilização**."
      },
      {
        tipo: "topico",
        titulo: "Sequência das fases",
        texto: "**Planejamento → Análise de Requisitos → Design → Implementação → Testes → Implantação → Manutenção**"
      },
      {
        tipo: "topico",
        titulo: "Sequência simplificada apresentada na figura",
        texto: "**Levantamento de Requisitos → Análise → Projeto → Desenvolvimento → Teste → Validação → Implantação**"
      }
    ]
  },
  {
    id: "comparacoes",
    titulo: "Comparações importantes para a prova",
    blocos: [
      {
        tipo: "topico",
        titulo: "Cascata × Incremental",
        texto: "**Cascata:** linear, sequencial, uma fase após outra, requisitos bem definidos. **Incremental:** divide o sistema em módulos, entrega partes progressivamente, cada módulo passa pelas fases do ciclo."
      },
      {
        tipo: "destaque",
        texto: "Macete: **Cascata = tudo segue em sequência.** **Incremental = entrega por partes.**"
      },
      {
        tipo: "topico",
        titulo: "Incremental × RAD",
        texto: "Ambos possuem características incrementais e iterativas. **Incremental:** foco em dividir o sistema e entregar módulos progressivamente. **RAD:** foco especial em **rapidez**, com ciclos muito comprimidos e entrega rápida."
      },
      {
        tipo: "destaque",
        texto: "Macete: **Incremental = partes.** **RAD = rapidez.**"
      },
      {
        tipo: "topico",
        titulo: "Prototipagem × Espiral",
        texto: "**Prototipagem:** cria um exemplar inicial para compreender/refinar requisitos. **Espiral:** trabalha em ciclos e dá grande importância à **análise de riscos**."
      },
      {
        tipo: "topico",
        titulo: "RUP × Ágil",
        texto: "**RUP:** iterativo, incremental, orientado a casos de uso, possui quatro fases, estrutura configurável, adequado ao contexto apresentado de grandes sistemas corporativos. **Ágil:** ciclos curtos, entregas frequentes, colaboração contínua, feedback, grande capacidade de adaptação às mudanças."
      }
    ]
  },
  {
    id: "resumo",
    titulo: "Resumo final para revisão rápida",
    blocos: [
      {
        tipo: "destaque",
        texto: "⭐ Ciclo de vida: conjunto de fases que o software percorre **da concepção até a manutenção/descontinuação**."
      },
      {
        tipo: "topico",
        titulo: "⭐ Fases",
        texto: "**Planejamento → Requisitos → Design → Desenvolvimento → Testes → Implantação → Manutenção**",
        lista: [
          "**Planejamento:** Objetivos + recursos + custos + cronograma",
          "**Requisitos:** Coletar + analisar + documentar necessidades",
          "**Design:** Arquitetura + UML + dados + algoritmos",
          "**Desenvolvimento:** Código + testes unitários + integração",
          "**Testes:** Verificar e validar o software",
          "**Implantação:** Colocar em produção",
          "**Manutenção:** Corrigir + melhorar + adaptar"
        ]
      },
      {
        tipo: "tabela",
        titulo: "⭐ Modelos — o que decorar",
        colunas: ["Modelo", "Palavra-chave"],
        linhas: [
          ["Cascata", "Sequencial"],
          ["Incremental", "Partes/módulos"],
          ["RAD", "Rapidez"],
          ["Prototipagem", "Protótipo/requisitos"],
          ["Espiral", "Riscos"],
          ["RUP", "Iterativo + casos de uso"],
          ["Ágil", "Adaptação + feedback"]
        ]
      },
      {
        tipo: "topico",
        titulo: "⭐ Tipos de testes",
        lista: [
          "**Funcional →** a função está funcionando conforme o requisito?",
          "**Desempenho →** o sistema aguenta a carga e mantém bom desempenho?",
          "**Segurança →** existem vulnerabilidades?",
          "**Comportamento →** como o sistema reage em situações reais?",
          "**Regressão →** uma mudança quebrou algo que já funcionava?",
          "**Usabilidade →** o sistema é fácil e intuitivo para o usuário?"
        ]
      },
      {
        tipo: "destaque",
        texto: "🧠 O que eu mais decoraria para a prova: **Cascata:** sequência rígida. **Incremental:** entrega por módulos. **RAD:** desenvolvimento muito rápido. **Prototipagem:** cria uma versão inicial para descobrir/refinar requisitos. **Espiral:** ciclos + análise de riscos. **RUP:** iterativo + incremental + casos de uso + 4 fases. **Ágil:** ciclos curtos + entregas frequentes + feedback + adaptação."
      },
      {
        tipo: "destaque",
        texto: "E, principalmente: **Planejamento → Requisitos → Design → Desenvolvimento → Testes → Implantação → Manutenção.** **Teste de regressão = garantir que uma alteração nova não quebrou funcionalidades antigas.** **Implantação = colocar o software no ambiente de produção.** **Manutenção = corrigir, melhorar e adaptar o software após sua implantação.**"
      }
    ]
  }
]
  },
  // aula 3
  {
    aula: "Modelos Cascata e Incremental",
    ideia_central: "O módulo compara Modelos Tradicionais, Iterativos e Incrementais de desenvolvimento de software, aprofundando especialmente o Modelo Cascata e o Modelo Incremental, suas etapas, vantagens, desvantagens e contextos de aplicação.",
    secoes: [
      {
        id: "visao_geral",
        titulo: "Visão geral do conteúdo",
        blocos: [
          {
            tipo: "texto",
            texto: "O módulo apresenta dois modelos importantes de desenvolvimento de software: **Modelo Cascata** e **Modelo Incremental**. Antes de aprofundá-los, o material compara três categorias: Modelos Tradicionais, Modelos Iterativos e Modelos Incrementais."
          },
          {
            tipo: "texto",
            texto: "A ideia central é entender que cada abordagem possui características, vantagens, desvantagens e contextos de aplicação diferentes. A escolha do modelo deve considerar principalmente os requisitos do projeto, o ambiente de desenvolvimento, as incertezas e as necessidades dos stakeholders."
          }
        ]
      },
      {
        id: "comparacao_modelos",
        titulo: "Comparação entre modelos tradicionais, iterativos e incrementais",
        blocos: [
          {
            tipo: "texto",
            texto: "O PDF apresenta o Quadro 1 — Comparativo entre os modelos tradicionais, iterativos e incrementais, que resume as principais diferenças entre as abordagens."
          },
          {
            tipo: "tabela",
            titulo: "Quadro 1 — Comparativo entre os modelos tradicionais, iterativos e incrementais",
            colunas: ["Característica", "Modelos Tradicionais", "Modelos Iterativos", "Modelos Incrementais"],
            linhas: [
              ["Abordagem", "Linear e sequencial", "Cíclica e incremental", "Combina estruturação com entrega gradual"],
              ["Vantagens", "Estrutura clara, facilidade de gerenciamento e documentação detalhada", "Flexibilidade, adaptação a mudanças, identificação precoce de problemas, melhoria contínua e maior envolvimento do cliente", "Flexibilidade, adaptação a mudanças, entrega gradual de valor e gerenciamento simplificado"],
              ["Desvantagens", "Inflexibilidade, alto risco inicial e baixa adaptabilidade a mudanças", "Gerenciamento da complexidade, necessidade de visão inicial clara dos requisitos e comunicação constante", "Definição clara dos incrementos, integração eficiente entre etapas e comunicação constante"],
              ["Ideais para", "Requisitos bem definidos e estáveis, ambiente controlado e prazos/orçamentos rígidos", "Requisitos em evolução, incerteza, necessidade de feedback contínuo e ambiente dinâmico", "Requisitos em evolução, necessidade de entrega gradual, riscos/incertezas e ambiente dinâmico"],
              ["Exemplo", "Modelo Cascata e Espiral", "Rational Unified Process (RUP)", "Incremental and Iterative Development (IID)"],
              ["Foco principal", "Planejamento e controle", "Adaptabilidade e feedback", "Estruturação e entrega gradual"]
            ]
          },
          {
            tipo: "destaque",
            texto: "Para memorizar: Tradicional → planejamento e controle | Iterativo → adaptabilidade e feedback | Incremental → estruturação + entrega gradual"
          }
        ]
      },
      {
        id: "modelos_tradicionais",
        titulo: "Modelos Tradicionais",
        blocos: [
          {
            tipo: "texto",
            texto: "Os Modelos Tradicionais são caracterizados por uma abordagem linear e sequencial. Neles, cada fase precisa ser concluída antes que a próxima possa começar."
          },
          {
            tipo: "lista",
            titulo: "Exemplos de modelos tradicionais (segundo o PDF)",
            itens: ["Modelo Cascata", "Modelo Espiral"]
          },
          {
            tipo: "lista",
            titulo: "Principais características",
            itens: [
              "estrutura clara",
              "facilidade de planejamento",
              "organização do projeto",
              "acompanhamento do progresso",
              "divisão do trabalho em etapas bem definidas",
              "facilidade para gerenciar responsabilidades e prazos",
              "documentação abrangente"
            ]
          },
          {
            tipo: "topico",
            titulo: "Principal problema",
            texto: "A principal limitação é a dificuldade de lidar com mudanças nos requisitos, especialmente quando elas acontecem em fases avançadas."
          },
          {
            tipo: "lista",
            titulo: "Alterações significativas podem provocar",
            itens: [
              "retrabalho",
              "aumento de custos",
              "aumento dos riscos",
              "dificuldades para incorporar novas tecnologias ou metodologias"
            ]
          },
          {
            tipo: "topico",
            titulo: "Quando são mais adequados?",
            lista: [
              "os requisitos estão claramente definidos e estáveis",
              "o ambiente de desenvolvimento é controlado",
              "há baixo risco de mudanças externas",
              "existem prazos e orçamentos rígidos"
            ]
          },
          {
            tipo: "topico",
            titulo: "Stakeholders",
            texto: "O material explica que stakeholders são grupos, organizações ou indivíduos que possuem interesse direto ou indireto nas atividades, operações e resultados de uma organização."
          }
        ]
      },
      {
        id: "modelos_iterativos",
        titulo: "Modelos Iterativos",
        blocos: [
          {
            tipo: "texto",
            texto: "Os Modelos Iterativos, representados no material pelo **Rational Unified Process (RUP)**, utilizam uma abordagem cíclica e incremental."
          },
          {
            tipo: "lista",
            titulo: "O projeto é dividido em ciclos repetitivos que abrangem",
            itens: ["Planejamento", "Design", "Implementação", "Testes"]
          },
          {
            tipo: "texto",
            texto: "Cada ciclo permite revisar e ajustar o projeto."
          },
          {
            tipo: "topico",
            titulo: "Principais características",
            lista: [
              "maior flexibilidade",
              "adaptação às mudanças nos requisitos",
              "identificação precoce de problemas",
              "melhoria contínua",
              "revisões frequentes",
              "utilização do feedback dos stakeholders",
              "maior envolvimento do cliente"
            ]
          },
          {
            tipo: "topico",
            titulo: "Desvantagens",
            texto: "O gerenciamento pode ser mais complexo devido à natureza cíclica do processo. Também são necessários: boa organização; comunicação constante; uma visão inicial clara dos requisitos, mesmo que eles possam mudar."
          },
          {
            tipo: "subtitulo",
            texto: "Quando são recomendados?"
          },
          {
            tipo: "texto",
            texto: "O material destaca quatro situações:"
          },
          {
            tipo: "topico",
            titulo: "a) Requisitos em evolução",
            texto: "Mudanças nos requisitos são esperadas e precisam ser acomodadas durante o desenvolvimento."
          },
          {
            tipo: "topico",
            titulo: "b) Alto nível de incerteza",
            texto: "O projeto possui riscos ou incertezas que exigem flexibilidade."
          },
          {
            tipo: "topico",
            titulo: "c) Necessidade de feedback contínuo",
            texto: "O feedback dos stakeholders e os resultados dos testes são importantes para melhorar o produto."
          },
          {
            tipo: "topico",
            titulo: "d) Ambiente de desenvolvimento dinâmico",
            texto: "Existe alta probabilidade de mudanças externas ou surgimento de novas informações."
          },
          {
            tipo: "destaque",
            texto: "Ideia principal: Iterativo = ciclos + adaptação + feedback + melhoria contínua."
          }
        ]
      },
      {
        id: "modelos_incrementais_intro",
        titulo: "Modelos Incrementais",
        blocos: [
          {
            tipo: "texto",
            texto: "Os Modelos Incrementais, representados pelo **Incremental and Iterative Development (IID)**, são apresentados como uma síntese entre modelos tradicionais e iterativos."
          },
          {
            tipo: "lista",
            titulo: "Seu objetivo é combinar",
            itens: ["estruturação", "flexibilidade", "entrega gradual de funcionalidades"]
          },
          {
            tipo: "texto",
            texto: "O sistema é dividido em incrementos funcionais. Cada incremento representa um conjunto específico de funcionalidades."
          },
          {
            tipo: "lista",
            titulo: "O incremento é",
            itens: ["desenvolvido", "testado", "avaliado", "integrado ao sistema"]
          },
          {
            tipo: "texto",
            texto: "Isso permite entregar partes utilizáveis do sistema gradualmente."
          }
        ]
      },
      {
        id: "funcionamento_incremental",
        titulo: "Funcionamento do Modelo Incremental",
        blocos: [
          {
            tipo: "texto",
            texto: "O Modelo Incremental divide o sistema em módulos funcionais menores chamados incrementos."
          },
          {
            tipo: "texto",
            texto: "Cada incremento possui um conjunto específico de funcionalidades e passa pelas fases de: Análise → Design → Implementação → Testes → Integração"
          },
          {
            tipo: "texto",
            texto: "Depois, o incremento pode ser disponibilizado para utilização e receber feedback dos usuários. Esse processo permite que o desenvolvimento seja adaptado conforme os requisitos mudam."
          },
          {
            tipo: "topico",
            titulo: "Por que dividir em incrementos?",
            lista: [
              "identificar problemas mais cedo",
              "solucionar falhas em etapas menores",
              "reduzir riscos",
              "entregar funcionalidades gradualmente",
              "obter feedback antecipado",
              "adaptar o projeto durante seu desenvolvimento"
            ]
          },
          {
            tipo: "imagem",
            src: "figura_2_modelo_incremental.png",
            pasta: "imagens_analise_projeto/aula_03",
            alt: "A figura representa o desenvolvimento do sistema por diferentes incrementos. O eixo vertical representa o incremento de funcionalidades e o eixo horizontal representa o tempo decorrido do projeto. Cada incremento percorre etapas de especificação, projeto do software, implementação/teste de unidade, integração/teste de sistema e operação/feedback. A figura mostra a entrega progressiva dos Incrementos 1, 2 e N.",
            num: 2
          },
          {
            tipo: "texto",
            texto: "A própria figura está identificada no PDF como \"Figura 2 – Modelo Incremental\" e sua fonte é indicada como Dias (2019)."
          }
        ]
      },
      {
        id: "modelo_cascata",
        titulo: "Modelo Cascata",
        blocos: [
          {
            tipo: "texto",
            texto: "O Modelo Cascata, também chamado de **Modelo Linear Sequencial**, é apresentado como um dos modelos tradicionais de desenvolvimento de software."
          },
          {
            tipo: "texto",
            texto: "Sua característica fundamental é a estrutura sequencial rígida."
          },
          {
            tipo: "topico",
            titulo: "Ele é indicado principalmente para projetos em que os requisitos são",
            lista: ["bem definidos", "estáveis", "sujeitos a poucas ou nenhuma mudança"]
          },
          {
            tipo: "subtitulo",
            texto: "Etapas do Modelo Cascata"
          },
          {
            tipo: "texto",
            texto: "A Figura 1 apresenta as etapas básicas:"
          },
          {
            tipo: "lista",
            itens: [
              "Definição de Requisitos",
              "Projeto de Sistema e Software",
              "Implementação e Teste Unitário",
              "Integração e Teste de Sistema",
              "Operação e Manutenção"
            ]
          },
          {
            tipo: "imagem",
            src: "figura_1_modelo_em_cascata.png",
            pasta: "imagens_analise_projeto/aula_03",
            alt: "A figura apresenta as etapas do Modelo Cascata organizadas sequencialmente. Ela mostra o fluxo partindo da Definição de Requisitos, passando por Projeto de Sistema e Software, Implementação e Teste Unitário, Integração e Teste de Sistema e chegando a Operação e Manutenção. O diagrama também representa retornos das etapas posteriores para etapas anteriores.",
            num: 1
          },
          {
            tipo: "texto",
            texto: "A identificação original do PDF é \"Figura 1 – Modelo em Cascata\". A fonte indicada é \"Adaptado de Blogspot.com\"."
          }
        ]
      },
      {
        id: "vantagens_cascata",
        titulo: "Vantagens do Modelo Cascata",
        blocos: [
          {
            tipo: "topico",
            titulo: "8.1 Estrutura clara e fácil gerenciamento",
            lista: [
              "planejamento",
              "organização",
              "monitoramento do progresso",
              "gerenciamento de tarefas",
              "controle de prazos",
              "controle de recursos",
              "definição de responsabilidades"
            ]
          },
          {
            tipo: "texto",
            texto: "O modelo possui uma estrutura clara e bem definida, facilitando os pontos listados acima."
          },
          {
            tipo: "topico",
            titulo: "8.2 Documentação detalhada",
            texto: "O processo sequencial incentiva a produção de documentação abrangente e detalhada em cada etapa."
          },
          {
            tipo: "lista",
            titulo: "Essa documentação pode servir como referência para",
            itens: ["futuras modificações", "manutenção", "treinamento", "comunicação entre os envolvidos"]
          },
          {
            tipo: "topico",
            titulo: "8.3 Facilidade de controle e previsibilidade",
            texto: "A natureza sequencial permite maior controle do projeto."
          },
          {
            tipo: "lista",
            titulo: "Segundo o material, isso facilita",
            itens: [
              "identificação e resolução de problemas em etapas iniciais",
              "redução de retrabalho",
              "redução de custos adicionais",
              "maior previsibilidade do cronograma",
              "maior previsibilidade do orçamento"
            ]
          },
          {
            tipo: "topico",
            titulo: "8.4 Ideal para ambientes controlados",
            lista: [
              "baixo risco de mudanças externas",
              "baixa incerteza",
              "maior estabilidade dos requisitos"
            ]
          },
          {
            tipo: "texto",
            texto: "É especialmente adequado para ambientes em que existem os fatores listados acima. A estrutura rígida proporciona maior estabilidade e previsibilidade nesses ambientes."
          }
        ]
      },
      {
        id: "desvantagens_cascata",
        titulo: "Desvantagens do Modelo Cascata",
        blocos: [
          {
            tipo: "topico",
            titulo: "9.1 Inflexibilidade diante de mudanças",
            texto: "A estrutura sequencial dificulta alterações nos requisitos, principalmente em fases avançadas."
          },
          {
            tipo: "lista",
            titulo: "Isso pode provocar",
            itens: ["retrabalho", "custos adicionais", "atrasos no cronograma"]
          },
          {
            tipo: "topico",
            titulo: "9.2 Baixa adaptabilidade a novas tecnologias",
            texto: "A adoção de novas tecnologias ou metodologias durante o desenvolvimento pode ser difícil, pois pode exigir uma reestruturação significativa das etapas anteriores."
          },
          {
            tipo: "topico",
            titulo: "9.3 Risco de falhas em estágios avançados",
            texto: "Quando mudanças significativas nos requisitos são necessárias tardiamente, aumenta o risco de falhas em estágios avançados."
          },
          {
            tipo: "lista",
            titulo: "Consequentemente, podem surgir",
            itens: ["custos adicionais", "atrasos consideráveis"]
          },
          {
            tipo: "topico",
            titulo: "9.4 Menor envolvimento do cliente",
            texto: "O cliente tende a ter menor envolvimento durante o desenvolvimento, porque as decisões e o planejamento são realizados principalmente no início. Isso pode resultar em um produto final que não atende completamente às necessidades do cliente."
          }
        ]
      },
      {
        id: "quando_usar_cascata",
        titulo: "Quando utilizar o Modelo Cascata?",
        blocos: [
          {
            tipo: "texto",
            texto: "O PDF apresenta quatro situações principais."
          },
          {
            tipo: "topico",
            titulo: "1. Requisitos bem definidos e estáveis",
            texto: "As mudanças são mínimas ou inexistentes."
          },
          {
            tipo: "topico",
            titulo: "2. Ambiente de desenvolvimento controlado",
            texto: "Existe baixo risco de mudanças externas ou incertezas que afetem os requisitos."
          },
          {
            tipo: "topico",
            titulo: "3. Foco no cumprimento de prazos e orçamentos",
            texto: "A estrutura rígida facilita planejamento e controle."
          },
          {
            tipo: "topico",
            titulo: "4. Projetos de grande porte e complexos",
            texto: "Pode ser eficaz quando organização e controle rígidos são considerados essenciais."
          },
          {
            tipo: "destaque",
            texto: "Regra para prova: Cascata → requisitos estáveis + ambiente controlado + planejamento/controle."
          }
        ]
      },
      {
        id: "exemplos_cascata",
        titulo: "Exemplos de aplicação do Modelo Cascata",
        blocos: [
          {
            tipo: "exemplo",
            titulo: "Sistemas embarcados",
            texto: "O PDF cita sistemas embarcados presentes em carros, eletrodomésticos e dispositivos médicos. Esses sistemas geralmente possuem requisitos bem definidos e estáveis, tornando o Modelo Cascata uma opção apresentada como adequada."
          },
          {
            tipo: "exemplo",
            titulo: "Sistemas de Informação Legados",
            texto: "Sistemas legados possuem uma base de código complexa e podem se beneficiar da estrutura organizada do Modelo Cascata para facilitar manutenção e aprimoramento."
          },
          {
            tipo: "exemplo",
            titulo: "Aplicações de Governança e Conformidade",
            texto: "Aplicações voltadas ao atendimento de normas e regulamentações específicas, como sistemas de contabilidade e sistemas de gestão de dados. Esses sistemas geralmente possuem requisitos rígidos e bem definidos."
          }
        ]
      },
      {
        id: "caracteristicas_incremental",
        titulo: "Modelo Incremental — características",
        blocos: [
          {
            tipo: "texto",
            texto: "O Modelo Incremental também é chamado no material de **Modelo de Desenvolvimento Evolucionário**."
          },
          {
            tipo: "texto",
            texto: "Sua característica central é o desenvolvimento gradual e iterativo, utilizando incrementos funcionais."
          },
          {
            tipo: "lista",
            titulo: "O sistema é entregue em etapas, proporcionando",
            itens: ["maior flexibilidade", "maior adaptabilidade", "entrega rápida de valor aos stakeholders"]
          },
          {
            tipo: "lista",
            titulo: "Cada incremento",
            itens: [
              "possui funcionalidades específicas",
              "passa por análise",
              "passa por design",
              "passa por implementação",
              "passa por testes",
              "é integrado ao sistema existente"
            ]
          }
        ]
      },
      {
        id: "vantagens_incremental",
        titulo: "Vantagens do Modelo Incremental",
        blocos: [
          {
            tipo: "topico",
            titulo: "13.1 Flexibilidade para mudanças de requisitos",
            texto: "O modelo consegue lidar com mudanças nos requisitos mesmo em etapas avançadas do desenvolvimento."
          },
          {
            tipo: "topico",
            titulo: "13.2 Entrega rápida de partes funcionais",
            texto: "As funcionalidades são entregues em etapas. Assim, os usuários podem utilizar o sistema e fornecer feedback precocemente."
          },
          {
            tipo: "topico",
            titulo: "13.3 Redução de riscos",
            texto: "Como o projeto é dividido em incrementos menores, problemas podem ser identificados e resolvidos mais cedo. Isso reduz o risco de falhas significativas no projeto como um todo."
          },
          {
            tipo: "topico",
            titulo: "13.4 Maior envolvimento do cliente",
            texto: "O feedback contínuo dos stakeholders aumenta o envolvimento do cliente durante o desenvolvimento."
          },
          {
            tipo: "topico",
            titulo: "13.5 Melhor gerenciamento de prazos e orçamentos",
            texto: "A divisão em etapas menores facilita o planejamento e controle de prazos e orçamentos. Também permite realizar ajustes e adaptações quando necessário."
          }
        ]
      },
      {
        id: "desvantagens_incremental",
        titulo: "Desvantagens do Modelo Incremental",
        blocos: [
          {
            tipo: "topico",
            titulo: "14.1 Maior complexidade de gerenciamento",
            texto: "É necessário coordenar o desenvolvimento e a integração de vários incrementos."
          },
          {
            tipo: "topico",
            titulo: "14.2 Integração contínua e testes frequentes",
            texto: "A integração e os testes frequentes entre os incrementos são essenciais para garantir o funcionamento do sistema como um todo. Isso pode aumentar tempo e esforço de desenvolvimento."
          },
          {
            tipo: "topico",
            titulo: "14.3 Dependência de planejamento detalhado",
            lista: ["funcionalidades", "prazos", "recursos necessários para cada etapa"]
          },
          {
            tipo: "texto",
            texto: "O sucesso depende de planejamento detalhado dos incrementos, incluindo os itens listados acima."
          },
          {
            tipo: "topico",
            titulo: "14.4 Comunicação constante e eficaz",
            lista: ["equipe de desenvolvimento", "stakeholders", "clientes"]
          },
          {
            tipo: "texto",
            texto: "É fundamental manter comunicação entre os grupos listados acima. Essa comunicação ajuda a alinhar expectativas e resolver conflitos."
          }
        ]
      },
      {
        id: "quando_usar_incremental",
        titulo: "Quando utilizar o Modelo Incremental?",
        blocos: [
          {
            tipo: "texto",
            texto: "O material destaca quatro situações."
          },
          {
            tipo: "topico",
            titulo: "1. Requisitos em evolução",
            texto: "Mudanças são esperadas durante o desenvolvimento."
          },
          {
            tipo: "topico",
            titulo: "2. Necessidade de entrega gradual",
            texto: "O cliente deseja receber partes funcionais do sistema em etapas para avaliação e feedback."
          },
          {
            tipo: "topico",
            titulo: "3. Riscos e incertezas",
            texto: "O projeto possui riscos ou incertezas que exigem adaptabilidade."
          },
          {
            tipo: "topico",
            titulo: "4. Ambiente de desenvolvimento dinâmico",
            texto: "Existe alta probabilidade de mudanças externas ou novas informações."
          },
          {
            tipo: "destaque",
            texto: "Regra para prova: Incremental → requisitos em evolução + entrega gradual + feedback + adaptabilidade."
          }
        ]
      },
      {
        id: "exemplos_incremental",
        titulo: "Exemplos de aplicação do Modelo Incremental",
        blocos: [
          {
            tipo: "exemplo",
            titulo: "Desenvolvimento de software para bancos",
            texto: "O PDF apresenta o desenvolvimento de sistemas bancários em constante evolução. As funcionalidades podem ser entregues gradualmente, incluindo abertura de contas, transferências bancárias, pagamentos e investimentos.",
            detalhe: "O modelo permite adaptar o sistema às novas necessidades do mercado e dos clientes."
          },
          {
            tipo: "exemplo",
            titulo: "Sistemas de Saúde",
            texto: "Sistemas complexos de saúde, como prontuários eletrônicos e sistemas de gestão hospitalar, podem se beneficiar da flexibilidade do Modelo Incremental para atender às demandas específicas das instituições, permitindo entrega gradual e adaptação às mudanças."
          }
        ]
      },
      {
        id: "cascata_x_incremental",
        titulo: "Cascata × Incremental",
        blocos: [
          {
            tipo: "tabela",
            titulo: "Comparativo Cascata × Incremental",
            colunas: ["Aspecto", "Modelo Cascata", "Modelo Incremental"],
            linhas: [
              ["Estrutura", "Linear e sequencial", "Dividida em incrementos"],
              ["Requisitos", "Bem definidos e estáveis", "Podem estar em evolução"],
              ["Mudanças", "Difíceis de acomodar", "Maior facilidade de adaptação"],
              ["Entrega", "Segue o processo sequencial", "Funcionalidades entregues gradualmente"],
              ["Cliente", "Menor envolvimento ao longo do processo", "Maior envolvimento e feedback"],
              ["Riscos", "Maior dificuldade quando problemas surgem tardiamente", "Problemas podem ser identificados mais cedo"],
              ["Gerenciamento", "Estrutura clara e fácil gerenciamento", "Mais complexo pela coordenação dos incrementos"],
              ["Ambiente", "Controlado e previsível", "Dinâmico e sujeito a mudanças"],
              ["Principal foco", "Planejamento e controle", "Flexibilidade e entrega gradual"]
            ]
          },
          {
            tipo: "texto",
            texto: "Essas diferenças são apresentadas ao longo do material e também sintetizadas no quadro comparativo inicial."
          }
        ]
      },
      {
        id: "relacao_tres_modelos",
        titulo: "Relação entre os três tipos de modelo",
        blocos: [
          {
            tipo: "texto",
            texto: "Uma forma de compreender o conteúdo do PDF é observar o foco de cada abordagem:"
          },
          {
            tipo: "topico",
            titulo: "Modelos Tradicionais",
            texto: "Estrutura → planejamento → controle. São mais rígidos e funcionam melhor quando os requisitos são estáveis."
          },
          {
            tipo: "topico",
            titulo: "Modelos Iterativos",
            texto: "Ciclos → feedback → adaptação. Permitem revisar e melhorar continuamente o sistema."
          },
          {
            tipo: "topico",
            titulo: "Modelos Incrementais",
            texto: "Incrementos → entregas graduais → feedback. Combinam estruturação com flexibilidade e entrega progressiva de funcionalidades."
          }
        ]
      },
      {
        id: "pontos_prova",
        titulo: "Pontos que mais podem ser cobrados em prova",
        blocos: [
          {
            tipo: "topico",
            titulo: "Modelo Cascata — Memorize",
            lista: [
              "também chamado de Modelo Linear Sequencial",
              "possui abordagem linear e sequencial",
              "possui estrutura rígida",
              "cada etapa segue a anterior",
              "é adequado para requisitos bem definidos e estáveis",
              "funciona melhor em ambientes controlados",
              "possui forte estrutura de planejamento e controle",
              "possui documentação detalhada",
              "apresenta baixa adaptabilidade a mudanças",
              "possui menor envolvimento do cliente",
              "mudanças tardias podem causar retrabalho, custos e atrasos"
            ]
          },
          {
            tipo: "destaque",
            texto: "Sequência da Figura 1: Definição de Requisitos → Projeto de Sistema e Software → Implementação e Teste Unitário → Integração e Teste de Sistema → Operação e Manutenção."
          },
          {
            tipo: "topico",
            titulo: "Modelo Incremental — Memorize",
            lista: [
              "também chamado de Modelo de Desenvolvimento Evolucionário",
              "divide o sistema em incrementos funcionais",
              "cada incremento possui funcionalidades específicas",
              "os incrementos são desenvolvidos, testados e integrados",
              "permite entrega gradual",
              "permite feedback antecipado",
              "possui maior flexibilidade",
              "facilita adaptação às mudanças",
              "reduz riscos pela identificação precoce de problemas",
              "exige planejamento detalhado",
              "exige integração e testes frequentes",
              "exige comunicação constante"
            ]
          }
        ]
      },
      {
        id: "consideracoes_finais",
        titulo: "Considerações finais e resumo final para revisão rápida",
        blocos: [
          {
            tipo: "texto",
            texto: "O material conclui que o Modelo Cascata se destaca por sua abordagem linear e sequencial, estrutura clara e facilidade de gerenciamento, sendo adequado para projetos com requisitos bem definidos e estáveis."
          },
          {
            tipo: "texto",
            texto: "Já o Modelo Incremental apresenta maior flexibilidade e adaptabilidade, permitindo entregas graduais e contínuas de funcionalidades e facilitando a gestão de mudanças e a obtenção de feedback contínuo dos usuários."
          },
          {
            tipo: "topico",
            titulo: "A escolha da abordagem deve considerar",
            lista: ["estabilidade dos requisitos", "ambiente de desenvolvimento", "expectativas dos stakeholders"]
          },
          {
            tipo: "subtitulo",
            texto: "📝 Resumo final para revisão rápida"
          },
          {
            tipo: "topico",
            titulo: "🟦 MODELO CASCATA",
            texto: "Palavras-chave: Linear • Sequencial • Rígido • Planejamento • Controle • Documentação • Requisitos estáveis"
          },
          {
            tipo: "lista",
            titulo: "Vantagens",
            itens: [
              "estrutura clara",
              "fácil gerenciamento",
              "documentação detalhada",
              "controle",
              "previsibilidade",
              "adequado a ambientes controlados"
            ]
          },
          {
            tipo: "lista",
            titulo: "Desvantagens",
            itens: [
              "inflexibilidade",
              "dificuldade para mudanças",
              "baixa adaptabilidade a novas tecnologias",
              "risco de falhas em fases avançadas",
              "menor envolvimento do cliente"
            ]
          },
          {
            tipo: "destaque",
            texto: "Ideal quando: ➡️ requisitos são bem definidos e estáveis."
          },
          {
            tipo: "topico",
            titulo: "🟩 MODELO ITERATIVO",
            texto: "Palavras-chave: Ciclos • Flexibilidade • Feedback • Adaptabilidade • Melhoria contínua"
          },
          {
            tipo: "lista",
            titulo: "Características",
            itens: [
              "ciclos repetitivos",
              "planejamento, design, implementação e testes",
              "identificação precoce de problemas",
              "feedback dos stakeholders",
              "melhoria contínua"
            ]
          },
          {
            tipo: "destaque",
            texto: "Ideal quando: ➡️ há evolução dos requisitos, incerteza e necessidade de feedback contínuo."
          },
          {
            tipo: "topico",
            titulo: "🟨 MODELO INCREMENTAL",
            texto: "Palavras-chave: Incrementos • Entrega gradual • Flexibilidade • Feedback • Adaptabilidade"
          },
          {
            tipo: "lista",
            titulo: "Vantagens",
            itens: [
              "adaptação às mudanças",
              "entrega rápida de partes funcionais",
              "redução de riscos",
              "maior envolvimento do cliente",
              "melhor gerenciamento de prazos e orçamento"
            ]
          },
          {
            tipo: "lista",
            titulo: "Desvantagens",
            itens: [
              "maior complexidade de gerenciamento",
              "necessidade de integração contínua",
              "testes frequentes",
              "planejamento detalhado",
              "comunicação constante"
            ]
          },
          {
            tipo: "destaque",
            texto: "Ideal quando: ➡️ os requisitos estão em evolução e existe necessidade de entregar funcionalidades gradualmente."
          },
          {
            tipo: "subtitulo",
            texto: "🎯 Regra de ouro para a prova"
          },
          {
            tipo: "topico",
            titulo: "Cascata",
            texto: "\"Se os requisitos estão estáveis, posso planejar e seguir uma sequência.\""
          },
          {
            tipo: "topico",
            titulo: "Iterativo",
            texto: "\"Se preciso revisar, adaptar e receber feedback continuamente, trabalho em ciclos.\""
          },
          {
            tipo: "topico",
            titulo: "Incremental",
            texto: "\"Se quero entregar funcionalidades aos poucos e adaptar o sistema conforme recebo feedback, divido o sistema em incrementos.\""
          },
          {
            tipo: "destaque",
            texto: "Essas três ideias resumem a principal distinção apresentada no material: Cascata prioriza planejamento e controle; Iterativo prioriza adaptabilidade e feedback; Incremental combina estruturação com entrega gradual."
          }
        ]
      }
    ]
  },
  // aula 4
  {
    aula: "Métodos Ágeis",
    ideia_central: "Os métodos ágeis são abordagens iterativas e incrementais ao desenvolvimento de software, fundamentadas no Manifesto Ágil (2001), cujas duas aplicações concretas mais relevantes — o Scrum, de viés gerencial, e o Extreme Programming (XP), de viés técnico — organizam equipes e práticas para entregar valor contínuo ao cliente.",
    secoes: [
      {
        id: "visao_geral",
        titulo: "Visão Geral",
        blocos: [
          {
            tipo: "texto",
            texto: "O material trata dos **Métodos Ágeis** como abordagens iterativas e incrementais para o desenvolvimento de software, contrapondo-as aos **métodos tradicionais** (como Waterfall). O conteúdo está organizado em três grandes blocos:"
          },
          {
            tipo: "lista",
            itens: [
              "Fundamentos dos Métodos Ágeis — o que são, sua origem histórica, o Manifesto Ágil (valores e princípios), a comparação com métodos tradicionais e exemplos reais de empresas e instituições que os adotam.",
              "Scrum — uma metodologia de gerenciamento de projetos baseada em sprints, detalhando seus pilares, papéis, artefatos (Sprint Backlog e Burndown Chart) e reuniões (cerimônias).",
              "Extreme Programming (XP) — um método ágil focado em práticas técnicas de engenharia de software, com seus valores, práticas específicas e comparação direta com o Scrum."
            ]
          },
          {
            tipo: "texto",
            texto: "Esses três blocos se relacionam porque o Scrum e o XP são apresentados como **duas aplicações concretas** dos princípios gerais dos métodos ágeis: o Scrum com um viés mais **gerencial/organizacional**, e o XP com um viés mais **técnico/de engenharia de código**. O objetivo declarado do módulo é capacitar o leitor a entender os métodos ágeis, conhecer o Scrum e conhecer o XP."
          }
        ]
      },
      {
        id: "fundamentos",
        titulo: "Fundamentos dos Métodos Ágeis",
        blocos: [
          {
            tipo: "subtitulo",
            texto: "O que são Métodos Ágeis"
          },
          {
            tipo: "texto",
            texto: "Os **Métodos Ágeis** são abordagens **iterativas e incrementais** para o desenvolvimento de software que priorizam:"
          },
          {
            tipo: "lista",
            itens: [
              "Colaboração",
              "Flexibilidade",
              "Entrega contínua de valor ao cliente"
            ]
          },
          {
            tipo: "texto",
            texto: "Diferentemente dos métodos tradicionais — que seguem um processo **linear e rigidamente estruturado** — os métodos ágeis permitem **adaptações frequentes e rápidas** às mudanças nas necessidades dos clientes e no ambiente do projeto."
          },
          {
            tipo: "texto",
            texto: "Essa abordagem parte de um conjunto de princípios voltados a melhorar a eficiência e a eficácia do desenvolvimento de software:"
          },
          {
            tipo: "lista",
            itens: [
              "Entrega contínua de software funcional, em intervalos regulares (sprints/iterações curtas), permitindo feedback constante e ajustes rápidos;",
              "Colaboração com o cliente durante todo o processo, garantindo que suas necessidades sejam atendidas;",
              "Adaptação à mudança, permitindo respostas rápidas a alterações nos requisitos;",
              "Trabalho em equipe, promovendo um ambiente cooperativo e aberto."
            ]
          },
          {
            tipo: "subtitulo",
            texto: "O Manifesto Ágil (2001)"
          },
          {
            tipo: "texto",
            texto: "Criado em 2001 por um grupo de desenvolvedores experientes, o **Manifesto Ágil** estabelece **quatro valores fundamentais** e **doze princípios** que orientam as práticas ágeis, servindo de base para todos os métodos ágeis."
          },
          {
            tipo: "tabela",
            titulo: "Os quatro valores fundamentais do Manifesto Ágil",
            colunas: ["Valor", "Explicação"],
            linhas: [
              ["Indivíduos e interações mais que processos e ferramentas", "Valoriza a comunicação e a colaboração entre pessoas acima de processos rígidos."],
              ["Software em funcionamento mais que documentação abrangente", "Prioriza a entrega de software funcional em vez de extensa documentação."],
              ["Colaboração com o cliente mais que negociação de contratos", "Enfatiza a colaboração contínua com o cliente para garantir que o produto atenda às suas necessidades."],
              ["Responder a mudanças mais que seguir um plano", "Reconhece que mudanças são inevitáveis; é mais importante ser adaptável do que seguir um plano inflexível."]
            ]
          },
          {
            tipo: "texto",
            texto: "Esse documento é considerado crucial para os métodos ágeis, pois fornece diretrizes que ajudam as equipes a serem mais **flexíveis, colaborativas e focadas** na entrega contínua de valor."
          },
          {
            tipo: "lista",
            titulo: "Os doze princípios do Manifesto Ágil",
            itens: [
              "a) Satisfazer o cliente através da entrega contínua e adiantada de software de valor;",
              "b) Aceitar mudanças de requisitos, mesmo no final do desenvolvimento;",
              "c) Entregar software funcional frequentemente, com preferência por iterações curtas;",
              "d) Trabalho diário em conjunto entre desenvolvedores e stakeholders;",
              "e) Construir projetos em torno de indivíduos motivados, dando-lhes ambiente e suporte necessários;",
              "f) A conversa face a face é o método mais eficiente e eficaz de transmitir informações;",
              "g) Software funcional é a medida primária de progresso;",
              "h) Promover o desenvolvimento sustentável, mantendo um ritmo constante indefinidamente;",
              "i) Excelência técnica e bom design aumentam a agilidade;",
              "j) Simplicidade é essencial — maximizar a quantidade de trabalho **não** realizado;",
              "k) As melhores arquiteturas, requisitos e designs emergem de equipes auto-organizadas;",
              "l) Refletir regularmente sobre como se tornar mais eficaz, ajustando o comportamento conforme necessário."
            ]
          },
          {
            tipo: "imagem",
            src: "ilustracao_equipe_colaborativa.png",
            pasta: "imagens_analise_projeto\\aula_04",
            alt: "Ilustração de equipe trabalhando de forma colaborativa, associada ao trecho sobre comparação entre métodos ágeis e tradicionais (página 07).",
            num: 1
          },
          {
            tipo: "texto",
            texto: "Explicação da imagem (página 07; parte do conteúdo: Comparação entre métodos ágeis e tradicionais): a imagem, de caráter ilustrativo, acompanha um bloco de texto em destaque que resume a essência dos métodos ágeis — a prioridade é o envolvimento ativo do cliente e a colaboração intensa entre os membros da equipe de desenvolvimento; a flexibilidade e a adaptabilidade são características centrais, permitindo respostas rápidas a mudanças. O texto reforça que a adoção dos métodos ágeis se expandiu ao longo dos anos, impulsionada por benefícios como maior agilidade, flexibilidade e entrega de valor ao cliente de forma mais eficiente."
          },
          {
            tipo: "subtitulo",
            texto: "História dos Métodos Ágeis"
          },
          {
            tipo: "texto",
            texto: "Os métodos ágeis emergiram como **resposta à rigidez dos modelos tradicionais**, como o Waterfall, que limitavam a flexibilidade e a adaptabilidade nos projetos de software."
          },
          {
            tipo: "lista",
            itens: [
              "Na década de 1990, essa busca por alternativas mais dinâmicas impulsionou o desenvolvimento de novas metodologias.",
              "Ken Schwaber e Jeff Sutherland lideraram o desenvolvimento do Scrum.",
              "Kent Beck e Ward Cunningham criaram o Extreme Programming (XP).",
              "Essas e outras abordagens focaram em ciclos de desenvolvimento iterativos e incrementais, priorizando entregas frequentes em pequenos pedaços, permitindo feedbacks e adaptações constantes."
            ]
          },
          {
            tipo: "texto",
            texto: "Com a evolução dos métodos ágeis, surgiram ferramentas e frameworks complementares:"
          },
          {
            tipo: "lista",
            itens: [
              "Kanban — oferece visualização do fluxo de trabalho e limitação do trabalho em progresso para otimizar o processo;",
              "Lean — foca na eliminação de desperdícios e na otimização do desenvolvimento;",
              "DevOps — integra desenvolvimento e operações, visando entrega de software mais rápida e confiável."
            ]
          },
          {
            tipo: "destaque",
            texto: "Nota de rodapé do material: o DevOps não é apenas um conjunto de ferramentas/práticas, mas uma filosofia que engloba princípios e valores ágeis — embora essa descrição simplificada não seja falsa, apenas resumida."
          },
          {
            tipo: "subtitulo",
            texto: "Comparação entre Métodos Ágeis e Tradicionais"
          },
          {
            tipo: "texto",
            texto: "Os métodos tradicionais (**Waterfall, V-Model e RUP**) seguem uma sequência linear e estruturada, enquanto os métodos ágeis são iterativos e incrementais, permitindo maior flexibilidade e adaptabilidade."
          },
          {
            tipo: "destaque",
            texto: "Nota de rodapé sobre o V-Model: também conhecido como Modelo em V, é uma metodologia de desenvolvimento de software sequencial que se assemelha à forma da letra \"V\" quando representada em um gráfico. Essa estrutura visa garantir um ciclo de vida do software organizado e controlado, com foco na qualidade e na previsibilidade."
          },
          {
            tipo: "tabela",
            titulo: "Quadro 1 – Comparativo entre Métodos Tradicionais e Ágeis (página 08)",
            colunas: ["Aspecto", "Métodos Tradicionais (Waterfall, V-Model, RUP)", "Métodos Ágeis"],
            linhas: [
              ["Abordagem", "Sequencial e linear (Waterfall), iterativo fixo (V-Model), fases sobrepostas (RUP)", "Iterativa e incremental"],
              ["Flexibilidade", "Baixa, devido à rigidez do planejamento", "Alta, com capacidade de adaptação rápida"],
              ["Feedback do Cliente", "Limitado a fases específicas", "Contínuo e constante"],
              ["Documentação", "Extensa e detalhada", "Suficiente para a necessidade atual"],
              ["Entrega de Software", "Ao final do projeto", "Frequente, em pequenos incrementos"],
              ["Gerenciamento de Riscos", "Antecipado e formalizado", "Contínuo, com respostas rápidas"],
              ["Planejamento", "Extensivo no início do projeto", "Adaptável ao longo do projeto"],
              ["Colaboração", "Menos ênfase na colaboração", "Forte ênfase na colaboração entre todos os membros da equipe"],
              ["Mudança de Requisitos", "Dificilmente acomodada", "Facilmente acomodada"],
              ["Qualidade", "Verificada ao final", "Verificada continuamente"]
            ]
          },
          {
            tipo: "texto",
            texto: "Fonte: Autores (2024)."
          },
          {
            tipo: "subtitulo",
            texto: "Exemplos de Utilização de Métodos Ágeis"
          },
          {
            tipo: "texto",
            texto: "O material apresenta uma coletânea de organizações, de diferentes setores, que adotam métodos ágeis, demonstrando que a adoção não se limita a um único tipo de empresa."
          },
          {
            tipo: "lista",
            titulo: "Empresas de Tecnologia",
            itens: [
              "Spotify — utiliza o Scrum para gerenciar o desenvolvimento de produtos, com sprints curtos e entregas frequentes, respondendo rapidamente às necessidades dos usuários.",
              "Netflix — também adota o Scrum, focando na colaboração entre equipes e na rápida entrega de melhorias.",
              "ThoughtWorks (consultoria de software global) — utiliza Scrum e Kanban, mantendo altos padrões de qualidade e eficiência."
            ]
          },
          {
            tipo: "lista",
            titulo: "Empresas Tradicionais",
            itens: [
              "Banco Itaú — emprega o Scrum em projetos como aplicativos mobile e plataformas digitais, acelerando a entrega de funcionalidades.",
              "Volkswagen — adota Scrum e Kanban para gerenciar o desenvolvimento de software embarcado em veículos.",
              "Philips — utiliza métodos ágeis no desenvolvimento de produtos de saúde e eletrodomésticos inteligentes."
            ]
          },
          {
            tipo: "lista",
            titulo: "Startups",
            itens: [
              "Nubank — referência no uso de métodos ágeis, com foco em experimentação e rápida entrega de produtos/serviços.",
              "QuintoAndar — usa Scrum para gerenciar o desenvolvimento de app e plataforma web.",
              "Rappi — emprega métodos ágeis para escalar operações rapidamente."
            ]
          },
          {
            tipo: "lista",
            titulo: "Instituições Governamentais Brasileiras",
            itens: [
              "Ministério da Economia do Brasil — adota métodos ágeis em alguns projetos de desenvolvimento de software.",
              "Tribunal de Contas da União (TCU) — usa Scrum para gerenciar o desenvolvimento de sistemas internos, com foco em qualidade e segurança da informação.",
              "Prefeitura de São Paulo — aplica métodos ágeis no desenvolvimento de aplicativos e plataformas digitais."
            ]
          },
          {
            tipo: "exemplo",
            titulo: "Caso adicional — Universidade Federal do Ceará (UFC)",
            texto: "A UFC desenvolveu uma versão completamente nova do seu Ambiente Virtual de Aprendizagem, o Solar, utilizando Scrum e práticas ágeis como Behavior Driven Development (BDD), testes unitários e programação em par.",
            detalhe: "Essa filosofia foi mantida entre 2010 e 2016; após esse período, devido a problemas internos e desfalques na equipe, as práticas foram abandonadas."
          }
        ]
      },
      {
        id: "scrum",
        titulo: "SCRUM",
        blocos: [
          {
            tipo: "subtitulo",
            texto: "Definição e Pilares"
          },
          {
            tipo: "texto",
            texto: "O **Scrum** é uma metodologia de gerenciamento de projetos (de software) baseada em **ciclos curtos de desenvolvimento**, chamados **sprints**. Cada sprint tipicamente dura de **1 a 4 semanas** e possui um conjunto específico de objetivos que a equipe busca completar. Ao longo do sprint, a equipe trabalha colaborativamente para entregar valor ao cliente."
          },
          {
            tipo: "destaque",
            texto: "Nota de rodapé: sprints de uma semana são mais utilizadas em desenvolvimentos rápidos de pequenas aplicações; ciclos de 2 semanas são os mais comuns."
          },
          {
            tipo: "lista",
            titulo: "O Scrum é baseado em três pilares",
            itens: [
              "Transparência — todas as informações do projeto são visíveis para todos os membros da equipe e partes interessadas;",
              "Inspeção — a equipe revisa regularmente seu progresso e identifica áreas de melhoria;",
              "Adaptação — a equipe está disposta a mudar sua abordagem com base no feedback e em novas informações."
            ]
          },
          {
            tipo: "subtitulo",
            texto: "Características do Scrum"
          },
          {
            tipo: "texto",
            texto: "A divisão do projeto em sprints curtos permite maior flexibilidade e adaptabilidade às mudanças. As reuniões de sprint garantem comunicação e colaboração constantes entre a equipe, o Product Owner e os stakeholders. Papéis bem definidos facilitam o desenvolvimento das responsabilidades entre os membros."
          },
          {
            tipo: "subtitulo",
            texto: "a) Atores-chave do Scrum"
          },
          {
            tipo: "imagem",
            src: "diagrama_atores_chave_scrum.png",
            pasta: "imagens_analise_projeto\\aula_04",
            alt: "Diagrama dos Atores Chave do Scrum: figura central (equipe/quadro de trabalho) conectada a quatro caixas — Product Owner, Scrum Master, Time de Desenvolvimento e Stakeholders (página 12).",
            num: 2
          },
          {
            tipo: "texto",
            texto: "Explicação da imagem (página 12; parte do conteúdo: 2.1 Características do Scrum — Atores Chave do Scrum): o diagrama apresenta uma figura central (representando a equipe/quadro de trabalho) conectada, por meio de linhas, a quatro caixas de texto que descrevem os quatro papéis-chave do Scrum: (1) Product Owner (PO) — descrito como a \"voz\" do cliente no projeto, responsável por definir a visão do produto, priorizar os itens do backlog e garantir que o produto atenda às necessidades dos usuários; (2) Scrum Master (SM) — descrito como o guardião do processo Scrum, que facilita a implementação da metodologia, remove obstáculos para a equipe e garante que os princípios e valores do Scrum sejam seguidos; (3) Time de Desenvolvimento — descrito como a força motriz do projeto, composto por desenvolvedores, testadores e outros profissionais, responsável por transformar as ideias em um produto funcional e de alta qualidade; (4) Stakeholders — descritos como as partes interessadas no projeto, podendo incluir clientes, gerentes, investidores e qualquer outra pessoa com interesse no sucesso do projeto."
          },
          {
            tipo: "tabela",
            titulo: "Papéis do Scrum (resumo)",
            colunas: ["Papel", "Função"],
            linhas: [
              ["Product Owner (PO)", "\"Voz\" do cliente; define a visão do produto, prioriza o backlog e garante que o produto atenda às necessidades dos usuários."],
              ["Scrum Master (SM)", "Guardião do processo; facilita a implementação da metodologia, remove obstáculos e garante que os princípios do Scrum sejam seguidos."],
              ["Time de Desenvolvimento", "Força motriz do projeto; composto por desenvolvedores, testadores e outros profissionais, transforma ideias em produto funcional."],
              ["Stakeholders", "Partes interessadas no projeto (clientes, gerentes, investidores etc.)."]
            ]
          },
          {
            tipo: "subtitulo",
            texto: "b) Artefatos Scrum: Sprint Backlog e Burndown Chart"
          },
          {
            tipo: "texto",
            texto: "Os artefatos do Scrum fornecem **visibilidade sobre o progresso do projeto**."
          },
          {
            tipo: "texto",
            texto: "**Sprint Backlog:** contém o fluxo de desenvolvimento das funcionalidades da aplicação. Na prática, é comum organizá-lo em um quadro com colunas:"
          },
          {
            tipo: "lista",
            itens: [
              "\"To-Do\" (para fazer) — funcionalidades selecionadas para a sprint, escritas em post-its;",
              "\"Doing\" (fazendo) — quando um membro da equipe pega a funcionalidade para desenvolver;",
              "\"Done\" (feito) — quando a funcionalidade é encerrada e devidamente testada."
            ]
          },
          {
            tipo: "imagem",
            src: "figura_1_sprint_backlog_quadro_branco.png",
            pasta: "imagens_analise_projeto\\aula_04",
            alt: "Figura 1 – Exemplo de um Sprint Backlog utilizando um quadro branco e post-its (página 13).",
            num: 3
          },
          {
            tipo: "texto",
            texto: "Explicação da imagem — Figura 1 (página 13; parte do conteúdo: 2.1 Características do Scrum — Os artefatos Scrum): a figura mostra um quadro branco físico organizado em colunas verticais rotuladas (da esquerda para a direita): \"STORIES\" (uma coluna lateral com itens numerados, listando as histórias/funcionalidades do backlog), \"TO DO\", \"IN PROGRESS\", \"TESTING\" e uma coluna final rotulada com uma data (indicando o fim da sprint, \"12/22\"). Diversos post-its coloridos (laranja, rosa/magenta, azul-claro/turquesa e amarelo) estão distribuídos pelas colunas, representando tarefas em diferentes estágios de desenvolvimento — a maior concentração de post-its aparece nas colunas \"TO DO\" e \"TESTING\". A imagem ilustra concretamente a prática descrita no texto: escrever as funcionalidades em post-its e movê-los entre colunas conforme avançam no fluxo de trabalho (a fazer → fazendo → testando → feito)."
          },
          {
            tipo: "texto",
            texto: "**Burndown Chart:** é uma ferramenta gráfica utilizada em metodologias ágeis, como o Scrum, para **visualizar o progresso do trabalho restante** em um projeto ao longo do tempo. Permite acompanhar a equipe em relação aos seus objetivos e identificar possíveis problemas ou atrasos de forma proativa."
          },
          {
            tipo: "lista",
            itens: [
              "Eixo X: normalmente as iterações/sprints (ou, dentro de uma única sprint, os dias da sprint);",
              "Eixo Y: o esforço a ser realizado pela equipe, dado em pontos de complexidade."
            ]
          },
          {
            tipo: "texto",
            texto: "A complexidade de uma tarefa/requisito é medida conforme a experiência do time em desenvolver aquela funcionalidade: quanto mais complicada, maior a pontuação; quanto mais simples, menor."
          },
          {
            tipo: "texto",
            texto: "Como o gráfico é construído:"
          },
          {
            tipo: "lista",
            itens: [
              "1. Traça-se uma linha reta iniciando no eixo Y (no total de pontos das sprints, marcando o início das iterações) e terminando no eixo X (na posição da última iteração) — essa é a \"Linha de Trabalho Restante Ideal\".",
              "2. Em cada iteração, um conjunto de requisitos é selecionado e seus pontos de complexidade são atribuídos; o somatório desses pontos é plotado como um ponto no gráfico.",
              "3. Ao interligar esses pontos, cria-se a \"Linha de Trabalho Restante Real\".",
              "4. Se a linha real se mantiver abaixo da ideal, a equipe está em bom ritmo e deverá cumprir o cronograma; caso contrário, a equipe precisará melhorar o ritmo ou revisar o planejamento de tempo do projeto."
            ]
          },
          {
            tipo: "destaque",
            texto: "Nota de rodapé (nota 5 do material): esse é um ponto conflitante entre times desenvolvedores e contratantes/chefias, pois parte do princípio de que o escopo e seu dimensionamento podem não bater com o cronograma estipulado inicialmente. O ideal para métodos ágeis é o trabalho com \"escopos flexíveis\", discutidos entre stakeholders e desenvolvedores ao longo do desenvolvimento, de forma que o tempo empregado gere um produto adequado dentro de um prazo viável para a equipe. Essa discussão sobre tempo é um motivo recorrente de conflito entre o que o cliente deseja, o que a equipe pode entregar e o prazo necessário."
          },
          {
            tipo: "texto",
            texto: "O gráfico também pode ser usado para verificar o progresso **dentro de uma sprint** — nesse caso, o eixo X contém os dias da sprint, e a Linha de Trabalho Restante Ideal é traçada a partir do total de pontos do Sprint Backlog, enquanto a linha real reflete a evolução diária dos pontos remanescentes."
          },
          {
            tipo: "imagem",
            src: "figura_2_burndown_chart.png",
            pasta: "imagens_analise_projeto\\aula_04",
            alt: "Figura 2 - Exemplo de um Burndown Chart: Story Points Remaining (0 a 35) por Days in the Sprint (1 a 10), com Linha de Trabalho Restante Ideal e Linha de Trabalho Restante Real (página 14).",
            num: 4
          },
          {
            tipo: "texto",
            texto: "Explicação da imagem — Figura 2 (página 14; parte do conteúdo: 2.1 Características do Scrum — Os artefatos Scrum, Burndown Chart): o gráfico, intitulado \"Sprint Burn-Down Chart\", tem no eixo Y os \"Story Points Remaining in the Sprint Backlog\" (pontos de história restantes no Sprint Backlog), com escala de 0 a 35, e no eixo X os \"Days in the Sprint\" (dias da sprint), numerados de 1 a 10. Há duas linhas: uma linha tracejada (reta), representando a Linha de Trabalho Restante Ideal, que parte de aproximadamente 30 pontos no dia 1 e desce linearmente até 0 no dia 10; e uma linha sólida com marcadores em losango, representando a Linha de Trabalho Restante Real, que acompanha de perto a linha ideal, oscilando ligeiramente acima e abaixo dela ao longo dos dias, partindo também de cerca de 30 pontos no dia 1 e chegando a 0 (ou próximo disso) no dia 10. A figura ilustra visualmente o conceito explicado no texto: o acompanhamento diário do trabalho restante comparado ao ritmo ideal esperado."
          },
          {
            tipo: "texto",
            texto: "Embora se possa usar softwares como **Pivotal Tracker**, **Trello** ou **Jira** para criar e compartilhar o Sprint Backlog, a prática do uso de **quadros físicos** e a **interação presencial** entre os membros da equipe é incentivada na metodologia Scrum, para criar um laço de colaboração, companheirismo e responsabilidade entre os membros da equipe."
          },
          {
            tipo: "subtitulo",
            texto: "c) A Dinâmica das Reuniões (Cerimônias) no Scrum"
          },
          {
            tipo: "tabela",
            titulo: "Reuniões (cerimônias) do Scrum",
            colunas: ["Reunião", "Descrição"],
            linhas: [
              ["Scrum Daily", "Conversa aberta e colaborativa em que cada membro compartilha avanços, obstáculos e planos para o dia. O Scrum Master facilita a discussão e garante que todos estejam alinhados."],
              ["Sprint Planning", "Colaboração entre Product Owner, Scrum Master e equipe de desenvolvimento para definir o escopo do sprint e as prioridades. O PO apresenta o backlog do produto, a equipe estima o esforço de cada item e, juntos, definem os objetivos do sprint."],
              ["Sprint Review", "Oportunidade para a equipe mostrar o que foi realizado durante o sprint e receber feedback dos stakeholders. O PO valida o trabalho e os stakeholders podem sugerir melhorias ou novas ideias."],
              ["Sprint Retrospective", "Momento de aprendizado e crescimento para a equipe. O Scrum Master guia a discussão sobre o que deu certo, o que deu errado e como melhorar no próximo sprint."]
            ]
          },
          {
            tipo: "subtitulo",
            texto: "Relato de Experiência Prática (seção \"Saiba Mais\")"
          },
          {
            tipo: "texto",
            texto: "O material inclui um relato pessoal dos autores (Wellington Sarmento e Patrícia Paula), que participaram de equipes usando Scrum em uma universidade federal por **oito anos**. Pontos relevantes do relato:"
          },
          {
            tipo: "lista",
            itens: [
              "No primeiro ano, usaram quadros brancos com post-its; posteriormente, adotaram o Pivotal Tracker como software de apoio, mas nunca abandonaram as reuniões presenciais, por considerarem a interação direta essencial para uma boa equipe de trabalho.",
              "Vieram de processos tradicionais (incluindo Waterfall) e enfrentaram o desafio de criar um novo ambiente de aprendizagem para milhares de usuários, com uma equipe heterogênea em maturidade de processo.",
              "Já conheciam técnicas como Test Driven Development (TDD) e Pair Programming, mas ainda usavam gerenciamento tradicional até conhecerem um orientando do diretor executivo (Ari Amaral), que se tornou o Scrum Master/coach de agilidade da equipe.",
              "O coach priorizou a saúde mental da equipe, a harmonia interna, a responsabilidade com as tarefas e o compromisso com técnicas/tecnologias que melhorassem a produtividade sem gerar estresse constante.",
              "Wellington relata ter atuado como Product Owner, precisando aprender técnicas de gerência de backlog, priorização de tarefas, sprint planning, elaboração de User Stories e sprint review, tendo se certificado como PO.",
              "A mudança de filosofia para métodos ágeis não foi simples nem rápida — demandou tempo, esforço e investimento (mais de um ano).",
              "Ao longo dos anos, a equipe também usou Trello e Slack para gestão e comunicação inter-equipes; o aprendizado foi que o entrosamento de um time demanda tempo, boa gerência de conflitos, políticas de incentivo e valorização pessoal.",
              "O relato conclui com reflexões de Wellington Sarmento sobre a importância de gestores terem vivência prática do processo de desenvolvimento, tratando as pessoas como indivíduos (não apenas \"recursos\"), reforçando o valor ágil de \"indivíduos e interações mais que processos e ferramentas\"."
            ]
          }
        ]
      },
      {
        id: "xp",
        titulo: "Extreme Programming (XP)",
        blocos: [
          {
            tipo: "subtitulo",
            texto: "Definição e Valores Fundamentais"
          },
          {
            tipo: "texto",
            texto: "O **Extreme Programming (XP)**, ou **Programação Extrema**, surgiu em meados da **década de 90** como resposta à necessidade de maior agilidade e adaptabilidade no desenvolvimento de software. Foi idealizado por **Kent Beck** e sua equipe durante o **projeto C3** (*Chrysler Comprehensive Compensation System*)."
          },
          {
            tipo: "texto",
            texto: "O XP se baseia em **cinco valores fundamentais**:"
          },
          {
            tipo: "tabela",
            titulo: "Os cinco valores fundamentais do XP",
            colunas: ["Valor", "Descrição"],
            linhas: [
              ["Comunicação", "Base para um trabalho colaborativo e eficiente."],
              ["Simplicidade", "Buscar soluções descomplicadas e fáceis de entender."],
              ["Feedback", "Obter e fornecer informações constantes para aprimorar o processo."],
              ["Coragem", "Experimentar novas ideias e enfrentar desafios sem medo."],
              ["Respeito", "Valorizar as habilidades e opiniões de todos os membros da equipe."]
            ]
          },
          {
            tipo: "subtitulo",
            texto: "Práticas do Extreme Programming"
          },
          {
            tipo: "texto",
            texto: "A partir desses valores, o XP propõe um conjunto de práticas:"
          },
          {
            tipo: "lista",
            itens: [
              "a) Ciclos de Desenvolvimento Curtos — dividir o projeto em pequenas iterações, com entregas frequentes e feedback contínuo, permitindo ajuste rápido de curso;",
              "b) Programação em Pares — dois programadores trabalhando juntos na mesma estação de trabalho, promovendo colaboração e revisão de código em tempo real, aumentando a qualidade e acelerando a resolução de problemas;",
              "c) Testes Unitários — escrever testes automatizados para garantir a qualidade do código e prevenir falhas, assegurando que cada parte do software funcione corretamente isoladamente;",
              "d) Refatoração — reorganizar o código existente para torná-lo mais limpo, eficiente e fácil de manter, ajudando a manter a integridade e extensibilidade do software;",
              "e) Integração Contínua — integrar as mudanças no código à base principal com frequência, permitindo detecção precoce de problemas e reduzindo riscos de integração tardia;",
              "f) Metáfora da Sala de Reuniões — espaço aberto para comunicação e colaboração entre equipe e cliente, promovendo um ambiente de trabalho mais transparente e integrado;",
              "g) Histórias de Usuário — descrever as funcionalidades do software a partir da perspectiva do usuário, garantindo que o produto atenda às suas necessidades e mantendo o foco no valor entregue ao cliente;",
              "h) Planejamento em Tempo Real — adaptar o planejamento às mudanças do projeto e às prioridades do cliente, mantendo o desenvolvimento sempre alinhado às necessidades mais atuais;",
              "i) Liberação de Software com Frequência — entregar versões funcionais do software ao cliente com regularidade, permitindo feedback e solicitação de alterações, mantendo o cliente envolvido e informado."
            ]
          },
          {
            tipo: "subtitulo",
            texto: "Vantagens e Implementações do XP"
          },
          {
            tipo: "texto",
            texto: "Embora o XP seja frequentemente associado a projetos de grande porte, seus princípios podem ser adaptados a diferentes contextos e tamanhos de equipe. Empresas como **Google**, **Spotify** e **ThoughtWorks** já colhem os frutos da adoção do XP, relatando maior agilidade, qualidade de software aprimorada e equipes mais engajadas."
          },
          {
            tipo: "citacao",
            texto: "O sucesso do XP reside na sua capacidade de promover flexibilidade, adaptabilidade e foco no cliente. Através de um ciclo de desenvolvimento contínuo e da valorização da comunicação e do feedback, o XP permite que as equipes de software respondam às mudanças com rapidez e entreguem produtos que realmente atendam às necessidades dos usuários."
          },
          {
            tipo: "subtitulo",
            texto: "Comparativo entre Scrum e Extreme Programming"
          },
          {
            tipo: "texto",
            texto: "O XP é apresentado como **ideal para projetos que exigem alta qualidade de software e adaptabilidade a mudanças frequentes**, com um ambiente flexível e tecnicamente robusto. Já o Scrum é mais adequado para **projetos com requisitos bem definidos e necessidade de entregas em prazos fixos**, com uma abordagem gerencial estruturada, focada em organização e comunicação da equipe."
          },
          {
            tipo: "tabela",
            titulo: "Quadro 2 – Comparativo entre Métodos XP e Scrum (página 22)",
            colunas: ["Critério", "Extreme Programming (XP)", "Scrum"],
            linhas: [
              ["Foco", "Mergulha na engenharia de software, priorizando práticas técnicas rigorosas para garantir a qualidade do código e a entrega de um produto robusto.", "Assume uma visão mais gerencial, estruturando o fluxo de trabalho em sprints e definindo papéis como Product Owner e Scrum Master para facilitar a organização e a comunicação."],
              ["Planejamento", "Abraça o planejamento adaptativo, ajustando prioridades e escopo conforme o feedback e as necessidades do cliente.", "Baseia-se em um backlog de produto priorizado, definindo no início do sprint quais funcionalidades serão desenvolvidas, com pouca flexibilidade para alterações durante o ciclo."],
              ["Ciclos de Desenvolvimento", "Utiliza ciclos curtos de desenvolvimento, com entregas frequentes de versões funcionais do software.", "Emprega sprints de duração fixa, geralmente entre 1 e 4 semanas, com entregas ao final de cada um."],
              ["Métricas", "Valoriza métricas como velocidade de desenvolvimento, testes unitários e cobertura de código.", "Foca em métricas como velocidade de entrega, burndown chart e impedimentos."],
              ["Reuniões", "Realiza reuniões frequentes e informais, como reuniões de stand-up e planejamento diário.", "Possui um conjunto definido de reuniões cerimoniais (sprint planning, sprint review, sprint retrospective) para marcar início, meio e fim do sprint."]
            ]
          },
          {
            tipo: "texto",
            texto: "Fonte: Autores (2024)."
          },
          {
            tipo: "destaque",
            texto: "Nota importante para revisão: embora a coluna \"Foco\" do quadro descreva o XP como voltado à engenharia técnica e o Scrum como voltado à visão gerencial, essa é exatamente a distinção central entre os dois métodos explorada ao longo de todo o capítulo — o XP complementa o Scrum tecnicamente, enquanto o Scrum organiza o processo gerencialmente. Muitas equipes, inclusive, combinam práticas dos dois métodos (como fez a UFC, citada anteriormente, que usou Scrum + práticas como BDD, testes unitários e programação em par)."
          }
        ]
      },
      {
        id: "outros_metodos",
        titulo: "Conteúdo Complementar — Outros Métodos Ágeis",
        blocos: [
          {
            tipo: "texto",
            texto: "Conforme as Considerações Finais do material, além do Scrum e do XP existem outros métodos ágeis relevantes no desenvolvimento de software:"
          },
          {
            tipo: "lista",
            itens: [
              "Pair Programming (Programação em Pares): técnica em que dois programadores trabalham juntos na mesma estação de trabalho. Um escreve o código (driver) enquanto o outro revisa cada linha à medida que é escrita (observer/navigator); os papéis podem ser trocados frequentemente. Promove colaboração, troca de conhecimento e revisão contínua do código, resultando em software de maior qualidade e menos bugs, além de disseminar conhecimento entre a equipe. É uma das práticas centrais do XP e reflete os valores ágeis de comunicação e trabalho em equipe.",
              "Kanban: foca na visualização do fluxo de trabalho e na limitação do trabalho em progresso para otimizar a eficiência.",
              "Lean: derivado dos princípios de manufatura enxuta, busca eliminar desperdícios e otimizar processos.",
              "DevOps: integra desenvolvimento e operações, visando acelerar a entrega de software com maior confiabilidade."
            ]
          }
        ]
      },
      {
        id: "resumo_final",
        titulo: "Resumo Final para Revisão Rápida",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "Métodos Ágeis: abordagens iterativas e incrementais que priorizam colaboração, flexibilidade e entrega contínua de valor, em contraste com métodos tradicionais lineares (Waterfall, V-Model, RUP).",
              "Manifesto Ágil (2001): define 4 valores (indivíduos/interações > processos/ferramentas; software funcionando > documentação; colaboração com cliente > negociação de contratos; responder a mudanças > seguir um plano) e 12 princípios.",
              "História: métodos ágeis surgiram nos anos 1990 como reação à rigidez do Waterfall. Scrum → Ken Schwaber e Jeff Sutherland. XP → Kent Beck e Ward Cunningham.",
              "Ferramentas/frameworks complementares: Kanban (visualização do fluxo), Lean (eliminação de desperdícios), DevOps (integração dev + operações).",
              "Exemplos de adoção: empresas de tecnologia (Spotify, Netflix, ThoughtWorks), tradicionais (Itaú, Volkswagen, Philips), startups (Nubank, QuintoAndar, Rappi) e instituições governamentais brasileiras (Ministério da Economia, TCU, Prefeitura de SP), além do caso da UFC (Ambiente Solar, 2010–2016)."
            ]
          },
          {
            tipo: "topico",
            titulo: "Scrum",
            lista: [
              "Baseado em sprints (1 a 4 semanas) e em 3 pilares: transparência, inspeção, adaptação.",
              "4 papéis: Product Owner, Scrum Master, Time de Desenvolvimento, Stakeholders.",
              "Artefatos: Sprint Backlog (quadro To-Do/Doing/Done) e Burndown Chart (Linha Ideal vs. Linha Real de trabalho restante, em pontos de complexidade).",
              "4 cerimônias: Scrum Daily, Sprint Planning, Sprint Review, Sprint Retrospective.",
              "Incentiva quadros físicos e reuniões presenciais, mesmo com uso de softwares como Pivotal Tracker, Trello ou Jira."
            ]
          },
          {
            tipo: "topico",
            titulo: "Extreme Programming (XP)",
            lista: [
              "Criado por Kent Beck durante o projeto C3 (Chrysler).",
              "5 valores: comunicação, simplicidade, feedback, coragem, respeito.",
              "9 práticas principais: ciclos curtos, programação em pares, testes unitários, refatoração, integração contínua, metáfora da sala de reuniões, histórias de usuário, planejamento em tempo real, liberação frequente de software."
            ]
          },
          {
            tipo: "lista",
            itens: [
              "Scrum x XP: Scrum tem foco gerencial (papéis, sprints fixos, cerimônias); XP tem foco técnico/engenharia (qualidade de código, práticas técnicas, planejamento adaptativo, reuniões informais).",
              "Pair Programming: prática central do XP — driver (escreve) + observer/navigator (revisa), com troca frequente de papéis.",
              "Aprender métodos ágeis é considerado crucial para profissionais de software, pois promove flexibilidade, adaptabilidade, foco no cliente, maior qualidade e melhor organização das equipes diante da complexidade dos projetos."
            ]
          }
        ]
      }
    ]
  },

  //aula 5
  {
  aula: "Análise de Requisitos",
  ideia_central: "A Análise de Requisitos é o processo de elicitar (descobrir), analisar (organizar e priorizar) e classificar as necessidades dos stakeholders em Requisitos Funcionais (o que o sistema faz) e Requisitos Não Funcionais (as qualidades que o sistema deve ter), sendo a base para o sucesso de qualquer projeto de software.",
  secoes: [
    {
      id: "visao_geral",
      titulo: "Visão Geral",
      blocos: [
        {
          tipo: "texto",
          texto: "Este módulo trata do processo de **Análise de Requisitos** no desenvolvimento de *software*, cobrindo três grandes blocos de conteúdo, na mesma ordem em que aparecem no material:"
        },
        {
          tipo: "lista",
          itens: [
            "**Elicitação e Análise de Requisitos** – como descobrir, entender, organizar e priorizar as necessidades dos *stakeholders* (interessados no sistema), incluindo exemplos práticos (Sistema de Gerenciamento de Projetos e E-commerce), o conceito de MVP (Produto Mínimo Viável) e as ferramentas/técnicas usadas nesse processo.",
            "**Requisitos Funcionais** – o que o sistema deve fazer, com foco em *User Stories*, critérios de aceitação, priorização de requisitos e a discussão sobre Escopo Fixo x Escopo Variado, ilustrados com o exemplo de um Sistema de Prontuário Eletrônico.",
            "**Requisitos Não Funcionais** – as características de qualidade que o sistema deve possuir (desempenho, segurança, confiabilidade, usabilidade, escalabilidade, manutenibilidade, compatibilidade), também exemplificados com o Prontuário Eletrônico."
          ]
        },
        {
          tipo: "texto",
          texto: "A lógica geral do módulo é: primeiro descobrimos **o que os stakeholders precisam** (elicitação), depois **organizamos e refinamos** essas informações (análise), e então **classificamos** o resultado em requisitos funcionais (o que o sistema faz) e requisitos não funcionais (como o sistema deve se comportar em termos de qualidade). Essas duas categorias são apresentadas como complementares e igualmente importantes — comparadas, no material, à \"melodia principal\" e à \"harmonia\" de uma música."
        }
      ]
    },
    {
      id: "conceitos_principais",
      titulo: "Conceitos Principais",
      blocos: [
        {
          tipo: "subtitulo",
          texto: "O que são Requisitos"
        },
        {
          tipo: "texto",
          texto: "Os **Requisitos** são definidos como as expectativas e necessidades dos ***stakeholders*** — ou seja, de todos os que têm interesse no sistema: usuários, clientes, desenvolvedores, gestores e até o próprio sistema. Eles são a base fundamental para o sucesso de qualquer projeto de *software*, pois garantem que o sistema atenda às necessidades de todos os envolvidos."
        },
        {
          tipo: "texto",
          texto: "O material reforça um ponto importante: quando se fala em \"clientes\" ou \"*stakeholders*\", **não se trata apenas de gerentes ou administradores** responsáveis pelo setor da empresa onde o sistema será usado. Refere-se também — e principalmente — **aos que efetivamente vão usar o sistema no dia a dia**, pois são esses usuários reais que têm a vivência do negócio e, portanto, são essenciais para entender as necessidades de automatização de processos e de facilitação da tomada de decisão."
        },
        {
          tipo: "subtitulo",
          texto: "Elicitação de Requisitos"
        },
        {
          tipo: "texto",
          texto: "A **elicitação** é descrita como \"a arte de descobrir, ouvir e entender os requisitos de todas as partes interessadas no projeto\". É a etapa em que se descobre **o que o sistema realmente precisa fazer**, por meio de técnicas como entrevistas, questionários, *workshops* e observação, mapeando as necessidades, desejos e \"sonhos\" que o *software* deve realizar."
        },
        {
          tipo: "subtitulo",
          texto: "Análise de Requisitos"
        },
        {
          tipo: "texto",
          texto: "Uma vez que os requisitos brutos são coletados na elicitação, a **análise** entra em cena para:"
        },
        {
          tipo: "lista",
          itens: [
            "refinar, organizar e estruturar as informações",
            "cruzar os dados",
            "identificar inconsistências",
            "priorizar as necessidades",
            "definir as funcionalidades essenciais do *software*"
          ]
        },
        {
          tipo: "texto",
          texto: "O material usa a metáfora de \"lapidar uma pedra preciosa, revelando sua verdadeira essência\" para descrever esse processo."
        },
        {
          tipo: "subtitulo",
          texto: "As Duas Categorias de Requisitos"
        },
        {
          tipo: "texto",
          texto: "Os requisitos se dividem em duas categorias principais, apresentadas em um quadro comparativo no PDF:"
        },
        {
          tipo: "tabela",
          titulo: "Categorias de Requisitos",
          colunas: ["Categoria", "Definição", "Metáfora usada no PDF"],
          linhas: [
            ["Requisitos Funcionais", "Definem o que o *software* deve fazer, as suas funcionalidades, e como ele deve interagir com o usuário.", "\"A melodia principal da sinfonia do software\""],
            ["Requisitos Não Funcionais", "Descrevem as características que o *software* deve ter, como performance, segurança, usabilidade, confiabilidade e escalabilidade.", "\"A harmonia que completa a música\""]
          ]
        },
        {
          tipo: "imagem",
          id: "representacao_visual_comparacao_requisitos_funcionais_nao_funcionais",
          src: "representacao_visual_comparacao_requisitos_funcionais_nao_funcionais.png",
          pasta: "imagens_analise_projeto/aula_05",
          alt: "Dois quadros lado a lado, cada um com um ícone (pessoa / engrenagem com \"</>\"), contrastando visualmente requisitos funcionais e não funcionais como categorias complementares",
          num: 1
        },
        {
          tipo: "subtitulo",
          texto: "Benefícios de Investir em Elicitação e Análise de Requisitos"
        },
        {
          tipo: "texto",
          texto: "O PDF lista os seguintes benefícios de um bom processo de elicitação e análise:"
        },
        {
          tipo: "lista",
          itens: [
            "**Redução de retrabalho e custos**: evita o desenvolvimento de funcionalidades desnecessárias ou que não atendem às expectativas dos usuários.",
            "**Melhoria da qualidade do software**: atende às necessidades reais dos usuários, com menos *bugs* e falhas.",
            "**Aumento da satisfação do cliente**: o software entrega valor real e atende às expectativas.",
            "**Melhoria da comunicação e colaboração da equipe**: todos têm entendimento claro dos requisitos e trabalham juntos.",
            "**Maior agilidade no desenvolvimento**: o foco nas necessidades reais dos usuários permite um desenvolvimento mais rápido e eficiente."
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Ferramentas e Técnicas de Elicitação e Análise de Requisitos"
        },
        {
          tipo: "topico",
          titulo: "Técnicas",
          lista: [
            "**Entrevistas** – conversas individuais ou em grupo para coletar informações detalhadas com *stakeholders*",
            "**Questionários** – coleta estruturada de dados de um grupo maior de *stakeholders*",
            "**Workshops** – sessões colaborativas para discutir e refinar os requisitos com a equipe"
          ]
        },
        {
          tipo: "topico",
          titulo: "Ferramentas",
          lista: [
            "**Diagrama de Casos de Uso** – representação visual das interações entre os usuários e o sistema",
            "**Protótipos** – modelos interativos do *software* para auxiliar na visualização e validação dos requisitos",
            "**Ferramentas CASE** – *softwares* especializados para gerenciamento e documentação de requisitos"
          ]
        },
        {
          tipo: "destaque",
          texto: "A elicitação e a análise de requisitos são processos **dinâmicos e contínuos**. Novos requisitos podem surgir ao longo do projeto, e os existentes podem ser revisados e ajustados. A chave para o sucesso é manter a comunicação aberta e a colaboração constante entre todos os envolvidos."
        },
        {
          tipo: "subtitulo",
          texto: "Requisitos Funcionais — Aprofundamento"
        },
        {
          tipo: "texto",
          texto: "O processo de levantamento e análise de requisitos funcionais é descrito como **vital** para o bom entendimento do sistema — tanto a equipe técnica quanto os *stakeholders* precisam ter clareza sobre eles, pois tratam das funcionalidades que o sistema deverá possuir para solucionar o problema do cliente."
        },
        {
          tipo: "subtitulo",
          texto: "User Stories (Histórias de Usuário)"
        },
        {
          tipo: "texto",
          texto: "As **User Stories** são apresentadas como uma técnica essencial para que a comunicação entre a equipe técnica e os clientes seja clara e objetiva. Elas permitem identificar:"
        },
        {
          tipo: "lista",
          itens: [
            "os usuários que deverão estar no sistema",
            "os seus perfis de permissões para acesso às funcionalidades",
            "como o usuário deve proceder para executar uma ação",
            "com qual objetivo essa ação é executada"
          ]
        },
        {
          tipo: "texto",
          texto: "Tudo isso deve ser descrito em um **texto curto, claro e objetivo**, usando uma linguagem mais próxima do cliente do que do grupo técnico."
        },
        {
          tipo: "texto",
          texto: "O material destaca a importância de, nas *User Stories*, deixar claros os **campos de informação** em telas como cadastros ou autenticações (por exemplo, especificar que o usuário deve fornecer e-mail e senha para se autenticar). Isso ajuda desenvolvedores e *designers* de interação a saberem quais elementos devem estar presentes em determinada tela do sistema."
        },
        {
          tipo: "texto",
          texto: "Também é discutido que o uso do termo **\"tela do sistema\"** (ou \"tela do programa\") já representa uma **estratégia de análise baseada em abordagem visual**, em que o sistema é entendido tanto por desenvolvedores quanto por clientes a partir dos seus pontos de interação com o usuário — isto é, sua **interface com o usuário**. Essa estratégia permite discussões mais claras sobre as funcionalidades a partir das interfaces, tornando mais \"concretas\" definições que, de outra forma, seriam abstratas."
        },
        {
          tipo: "destaque",
          texto: "O processo de análise de requisitos pode parecer simples à primeira vista, mas essa simplicidade desaparece em sistemas muito complexos, com milhares ou dezenas de milhares de requisitos funcionais. Ajustar a comunicação entre desenvolvedores e clientes — evitando linguagem excessivamente técnica ou excessivamente ligada ao negócio do cliente — é essencial para obter bons resultados."
        },
        {
          tipo: "subtitulo",
          texto: "Priorização de Requisitos Funcionais"
        },
        {
          tipo: "texto",
          texto: "Outra questão central no levantamento de requisitos funcionais é a **definição de prioridades**:"
        },
        {
          tipo: "lista",
          itens: [
            "Algumas funcionalidades são **determinantes e urgentes**, precisando ser implementadas para que o sistema possa entrar em produção.",
            "Outras funcionalidades podem esperar para um **futuro próximo**, por se tratarem de processos que podem ser automatizados depois, ou melhorias de processo com urgência menor."
          ]
        },
        {
          tipo: "texto",
          texto: "O processo de priorização exige **intensa comunicação** entre a equipe técnica e os clientes, sendo fundamental para a criação do **cronograma de desenvolvimento do sistema**."
        },
        {
          tipo: "texto",
          texto: "O **cronograma** permite que gerentes e diretores acompanhem quando o *software* será adotado na instituição, e serve também, no caso de equipes terceirizadas, para definir os **contratos de prestação de serviço**. Esses contratos costumam ser baseados no **Documento de Requisitos do Sistema**, que estabelece:"
        },
        {
          tipo: "lista",
          itens: [
            "as funcionalidades do sistema (**escopo do projeto**)",
            "a descrição de cada funcionalidade",
            "as prioridades",
            "o cronograma de entrega"
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Escopo Fixo x Escopo Variado (opinião do autor Wellington W. F. Sarmento)"
        },
        {
          tipo: "texto",
          texto: "Em um boxe de \"Parada Obrigatória\" assinado pelo autor **Wellington W. F. Sarmento**, é discutida a questão de qual seria a melhor forma de definir o escopo de um projeto de *software*:"
        },
        {
          tipo: "lista",
          itens: [
            "O autor defende que o escopo do projeto **deve ser flexível** e discutido em diferentes momentos de iteração da produção do *software*, pois, por mais que se tente esgotar as funcionalidades na análise, **novas necessidades podem surgir** durante o desenvolvimento e o uso do sistema. Mudanças no negócio da empresa e nas prioridades gerenciais também podem ocorrer.",
            "Embora o processo de criação de *software* seja chamado de \"engenharia de software\" (sugerindo um processo racional, preciso, formal e procedimental), o autor argumenta que **não é possível ter o mesmo nível de precisão** na estimativa de tempo que se tem, por exemplo, na construção de um parafuso ou de uma roda de carro — produtos mais simples, com dados e funcionalidades bem estabelecidos e claros. Já no *software*, as funcionalidades podem não ser tão claras, e os dados para sua criação muitas vezes estão na \"cabeça das pessoas\", em suas experiências e conhecimentos sobre o negócio.",
            "Essa especificidade faz do *software* um \"produto peculiar\" em seu processo de construção. O autor usa a analogia de um **carro que mudaria constantemente** conforme surgem novas necessidades dos usuários e mudanças do mercado — mas que, em vez de ser trocado por outro, precisaria ser modificado continuamente."
          ]
        },
        {
          tipo: "texto",
          texto: "A partir dessa reflexão, são definidas duas filosofias contrapostas:"
        },
        {
          tipo: "tabela",
          titulo: "Escopo Variado x Escopo Fixo",
          colunas: ["Filosofia", "Definição"],
          linhas: [
            ["Escopo Variado de Produto", "Definição de requisitos funcionais de forma mais flexível e iterativa. Abordagem associada aos **Métodos Ágeis** de projeto de sistemas. É a filosofia que o autor declara preferir."],
            ["Escopo Fixo de Produto", "Os requisitos **não podem ser modificados** no decorrer do desenvolvimento; o escopo (as funcionalidades) não pode ser redimensionado ou eliminado."]
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Critérios de Aceitação"
        },
        {
          tipo: "texto",
          texto: "Os **critérios de aceitação** são definidos como um conjunto de condições que um *software* deve cumprir para ser aceito pelo cliente, usuário ou equipe de desenvolvimento. Eles definem o comportamento esperado e as funcionalidades que a *User Story* deve atender para ser considerada completa e funcional. Servem também como base para **validação e testes** do *software*, garantindo que a implementação está correta e conforme o esperado."
        },
        {
          tipo: "topico",
          titulo: "Características dos Critérios de Aceitação",
          lista: [
            "**Clareza** – devem ser claros e específicos, sem ambiguidades",
            "**Mensuráveis** – devem ser possíveis de medir ou testar",
            "**Relevantes** – devem estar diretamente relacionados à história de usuário",
            "**Objetivos** – devem ser objetivos, de forma que todos os envolvidos concordem sobre o que significa cumprir o critério"
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Requisitos Não Funcionais — Aprofundamento"
        },
        {
          tipo: "texto",
          texto: "Os **Requisitos Não Funcionais** desempenham papel crucial na definição das qualidades e restrições do sistema, garantindo que ele não apenas funcione corretamente, mas também atenda a diversos padrões de qualidade e desempenho. O PDF detalha cada característica:"
        },
        {
          tipo: "lista",
          itens: [
            "**Desempenho**: aspecto vital, assegura que o sistema responda rapidamente às solicitações dos usuários e possa lidar com múltiplas operações simultâneas sem degradação perceptível.",
            "**Segurança**: área crítica, exige medidas robustas para proteger os dados contra acesso não autorizado, perda e roubo. Inclui **controle de acesso baseado em papéis** (apenas usuários autenticados e autorizados acessam dados sensíveis), garantindo a confidencialidade das informações.",
            "**Confiabilidade**: refere-se à capacidade do sistema de estar disponível e funcional pelo menos **99,9% do tempo**, excluindo períodos de manutenção programada, garantindo que os usuários possam depender do sistema sem interrupções inesperadas.",
            "**Usabilidade**: exige que a interface do usuário seja intuitiva e fácil de usar, permitindo que profissionais utilizem o sistema sem necessidade de treinamento extensivo.",
            "**Escalabilidade**: assegura que o sistema possa crescer e se adaptar a um aumento no número de usuários e registros sem perda de desempenho.",
            "**Manutenibilidade**: garante que o sistema seja fácil de manter e atualizar, com documentação completa e clara do código e das funcionalidades.",
            "**Compatibilidade**: exige que o sistema seja acessível a partir de diferentes dispositivos e navegadores (*desktops*, *tablets*, *smartphones*), assegurando experiência de usuário consistente e eficiente."
          ]
        },
        {
          tipo: "texto",
          texto: "O PDF conclui que esses requisitos formam a **base para um software robusto**, capaz de evoluir e se adaptar às necessidades futuras dos usuários e das empresas."
        }
      ]
    },
    {
      id: "formulas_metodos",
      titulo: "Fórmulas e Métodos",
      blocos: [
        {
          tipo: "texto",
          texto: "O PDF não apresenta fórmulas matemáticas. Os únicos valores quantitativos concretos mencionados são **metas de qualidade**, já descritas nas seções de requisitos não funcionais:"
        },
        {
          tipo: "lista",
          itens: [
            "**Confiabilidade/Disponibilidade**: sistema deve estar disponível e funcional pelo menos **99,9% do tempo** (excluindo manutenção programada).",
            "**Desempenho** (no exemplo do Prontuário Eletrônico – Quadro 4): o sistema deve responder às solicitações dos usuários em **menos de 2 segundos** durante operações normais."
          ]
        }
      ]
    },
    {
      id: "exemplos",
      titulo: "Exemplos Explicativos",
      blocos: [
        {
          tipo: "exemplo",
          titulo: "Exemplo 1 – Desenvolvendo um Sistema de Gerenciamento de Projetos",
          texto: "**Elicitação** – Por meio de entrevistas com gerentes de projeto, foram identificadas as seguintes necessidades: a) Criar, editar e excluir projetos; b) Atribuir tarefas aos membros da equipe; c) Definir prazos e acompanhar o progresso das tarefas; d) Gerar relatórios de status do projeto. **Análise de Requisitos** – Os requisitos foram organizados em categorias funcionais (criar projeto, editar projeto e afins) e não funcionais (segurança, usabilidade, performance). Os requisitos críticos para o **MVP** (*Minimum Viable Product*) foram priorizados. O resultado está no Quadro 1, apresentado a seguir.",
          detalhe: "Fonte: Autores (2024)."
        },
        {
          tipo: "tabela",
          titulo: "Quadro 1 – Requisitos Funcionais e não funcionais do sistema",
          colunas: ["Identificador", "Requisito", "Descrição"],
          linhas: [
            ["Funcionais", "", ""],
            ["RF0001", "Criar Projeto", "Permitir aos usuários criarem novos projetos inserindo nome, descrição, prazo e membros da equipe."],
            ["RF0002", "Editar Projeto", "Permitir a edição de informações de projetos existentes, como nome, descrição, prazo e membros."],
            ["RF0003", "Excluir Projeto", "Permitir a exclusão de projetos que não são mais necessários."],
            ["RF0004", "Atribuir Tarefas", "Permitir a atribuição de tarefas específicas aos membros da equipe."],
            ["RF0005", "Definir Prazos", "Definir prazos para cada tarefa e para o projeto como um todo."],
            ["RF0006", "Acompanhar Progresso das Tarefas", "Visualizar o status atual das tarefas, incluindo tarefas concluídas, em andamento e pendentes."],
            ["RF0007", "Gerar Relatórios de Status do Projeto", "Gerar relatórios detalhados sobre o status do projeto, incluindo progresso das tarefas e cumprimento de prazos."],
            ["Não Funcionais", "", ""],
            ["RF0001", "Segurança", "Implementar controle de acesso baseado em papéis, garantindo que apenas usuários autorizados possam criar, editar ou excluir projetos e tarefas."],
            ["RF0002", "Usabilidade", "Interface intuitiva e fácil de usar para garantir que os usuários possam realizar suas tarefas sem dificuldade."],
            ["RF0003", "Performance", "O sistema deve ser capaz de lidar com múltiplos projetos e tarefas simultaneamente, sem degradação perceptível de desempenho."],
            ["RF0004", "Escalabilidade", "O sistema deve ser escalável para suportar um número crescente de usuários e projetos."],
            ["RF0005", "Confiabilidade", "Garantir que o sistema esteja disponível e funcional pelo menos 99,9% do tempo."]
          ]
        },
        {
          tipo: "destaque",
          texto: "Observação do PDF original: a numeração dos identificadores dos requisitos não funcionais reinicia em \"RF0001\", coexistindo com os identificadores dos requisitos funcionais (que também começam em RF0001). Essa é uma característica do documento original, mantida fielmente."
        },
        {
          tipo: "subtitulo",
          texto: "MVP (Minimum Viable Product) – Exemplo Prático no Scrum"
        },
        {
          tipo: "texto",
          texto: "Em um boxe de \"Parada Obrigatória\", o material aprofunda o conceito de **MVP** com um exemplo prático. O **Minimum Viable Product (MVP)**, ou **Produto Mínimo Viável**, é a versão mais simples e funcional de um produto, desenvolvida com o mínimo de esforço e tempo necessários para testar uma ideia no mercado. Seu objetivo principal é **validar hipóteses de negócio**, entender a aceitação do produto pelos usuários e coletar *feedback* valioso para aprimoramentos futuros, com o menor investimento possível."
        },
        {
          tipo: "exemplo",
          titulo: "Event Planner (software de gerenciamento de eventos)",
          texto: "**Objetivo do produto**: ajudar os usuários a planejar, organizar e gerenciar eventos de forma eficiente. **Funcionalidades principais identificadas**: criação de eventos, gestão de convidados, criação e atribuição de tarefas, e envio de convites por e-mail."
        },
        {
          tipo: "topico",
          titulo: "Ordem de construção do MVP (por prioridade)",
          lista: [
            "Criação de eventos — permitindo inserir título, data, hora e descrição do evento",
            "Gestão de convidados — possibilitando a inserção de nomes e e-mails",
            "Criação e atribuição de tarefas — permitindo criar tarefas relacionadas ao evento e atribuí-las aos membros da equipe",
            "Sistema de envio de convites por e-mail para os convidados"
          ]
        },
        {
          tipo: "topico",
          titulo: "Processo Scrum aplicado ao MVP",
          lista: [
            "Após cada *sprint*, a equipe Scrum realiza uma **Sprint Review** para coletar *feedback* dos usuários sobre as funcionalidades implementadas (facilidade de uso da criação de eventos, efetividade da gestão de convidados, utilidade da criação/atribuição de tarefas e funcionamento do envio de convites).",
            "Com base nesse *feedback*, a equipe **ajusta o backlog** do produto, prioriza melhorias e adiciona novas funcionalidades para os próximos *sprints*.",
            "O MVP no contexto do Scrum envolve a **implementação incremental** das funcionalidades essenciais, com foco na entrega rápida de valor ao usuário e na coleta contínua de *feedback*. Cada *sprint* adiciona uma camada de funcionalidade, permitindo ajustes baseados nas respostas dos usuários até alcançar uma versão completa e refinada do produto."
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo 2 – Criando um E-commerce",
          texto: "**Elicitação** – Realizada por meio de *workshops* com clientes e vendedores, para entender suas expectativas: a) Interface amigável e intuitiva para navegação e compra; b) Catálogo de produtos com fotos, descrições e preços detalhados; c) Carrinho de compras seguro e eficiente; d) Diversas opções de pagamento e entrega; e) Sistema de avaliações e comentários dos produtos. **Análise de Requisitos** – Os requisitos foram refinados, definindo funcionalidades específicas (pesquisa por produto, filtro por categoria e afins) e priorizando as necessidades de cada grupo de *stakeholders* (clientes, vendedores)."
        },
        {
          tipo: "subtitulo",
          texto: "Exemplo (Requisitos Funcionais e Não Funcionais) – Sistema de Prontuário Eletrônico"
        },
        {
          tipo: "texto",
          texto: "Esse exemplo é utilizado tanto na seção de Requisitos Funcionais quanto na de Requisitos Não Funcionais do PDF, com a mesma elicitação servindo de base para as duas análises."
        },
        {
          tipo: "exemplo",
          titulo: "Elicitação e Análise – Prontuário Eletrônico",
          texto: "**Elicitação** – Requisitos coletados de médicos, enfermeiros, pacientes e administradores do hospital: a) Cadastro e gestão de pacientes; b) Registro de consultas, histórico médico e exames; c) Prescrição de medicamentos e solicitação de exames; d) Integração com outros sistemas de saúde; e) Segurança robusta para proteger dados confidenciais. **Análise de Requisitos** – Durante a análise, foram consideradas as **exigências legais, éticas e de segurança da informação**, priorizando a **confidencialidade dos dados dos pacientes** e a **interoperabilidade** com outros sistemas."
        },
        {
          tipo: "tabela",
          titulo: "Quadro 2 – Requisitos Funcionais do Sistema (Prontuário Eletrônico)",
          colunas: ["Identificador", "Descrição", "Prioridade"],
          linhas: [
            ["RF0001", "**Cadastro de Pacientes**: Permitir o registro de novos pacientes com informações básicas (nome, idade, endereço, contatos e afins).", "Alta"],
            ["RF0002", "**Gestão de Pacientes**: Permitir a atualização, edição e exclusão dos dados cadastrais dos pacientes.", "Alta"],
            ["RF0003", "**Registro de Consultas**: Permitir o registro das consultas médicas com detalhes sobre o diagnóstico, procedimentos realizados e recomendações.", "Alta"],
            ["RF0004", "**Histórico Médico**: Manter um histórico detalhado das consultas, diagnósticos, tratamentos e procedimentos médicos dos pacientes.", "Alta"],
            ["RF0005", "**Registro de Exames**: Permitir o registro e visualização dos resultados de exames laboratoriais e de imagem.", "Média"],
            ["RF0006", "**Prescrição de Medicamentos**: Permitir que os médicos registrem prescrições de medicamentos diretamente no sistema.", "Alta"],
            ["RF0007", "**Solicitação de Exames**: Permitir que os médicos solicitem exames diretamente pelo sistema.", "Alta"],
            ["RF0008", "**Integração com Sistemas de Saúde**: Garantir a interoperabilidade com outros sistemas de saúde, facilitando a troca de informações médicas.", "Média"],
            ["RF0009", "**Controle de Acesso**: Implementar controle de acesso baseado em papéis para garantir que apenas usuários autorizados possam acessar ou modificar dados sensíveis.", "Alta"],
            ["RF0010", "**Auditoria de Acessos**: Registrar todas as operações realizadas no sistema para fins de auditoria e controle de segurança.", "Alta"],
            ["RF0011", "**Interface Amigável**: Desenvolver uma interface intuitiva e fácil de usar para médicos, enfermeiros e outros profissionais de saúde.", "Média"],
            ["RF0012", "**Notificações**: Enviar notificações aos usuários sobre consultas agendadas, resultados de exames prontos, e atualizações de prescrições.", "Média"],
            ["RF0013", "**Backup e Recuperação de Dados**: Garantir que os dados do sistema sejam regularmente copiados e possam ser recuperados em caso de falha.", "Alta"]
          ]
        },
        {
          tipo: "tabela",
          titulo: "Quadro 3 – User Stories para os Requisitos Funcionais RF0001 e RF0002",
          colunas: ["Identificador", "User Story", "Critérios de Aceitação"],
          linhas: [
            ["RF0001", "**Como** recepcionista do hospital, **eu quero** cadastrar novos pacientes com informações básicas (nome, idade, endereço, contatos etc.), **para que** possamos ter um registro completo dos pacientes que chegam ao hospital.", "1. O sistema deve permitir a entrada de informações básicas do paciente: nome, idade, endereço, número de contato e detalhes do plano de saúde.\n2. Deve haver validação para campos obrigatórios, como nome e número de contato.\n3. Ao salvar o cadastro, o sistema deve confirmar a criação do novo paciente e disponibilizar um número de identificação único."],
            ["RF0002", "**Como** recepcionista do hospital, **eu quero** atualizar, editar e excluir os dados cadastrais dos pacientes, **para que** possamos manter as informações dos pacientes sempre atualizadas e corretas.", "1. O sistema deve permitir a busca do paciente pelo nome ou número de identificação.\n2. Deve ser possível editar as informações básicas do paciente, como endereço e número de contato.\n3. O sistema deve registrar e exibir a data e o usuário que realizou a última atualização.\n4. Ao excluir um paciente, o sistema deve solicitar confirmação para evitar exclusões acidentais."]
          ]
        },
        {
          tipo: "tabela",
          titulo: "Quadro 4 – Requisitos Não Funcionais do Sistema de Prontuário Eletrônico",
          colunas: ["Identificador", "Descrição", "Prioridade"],
          linhas: [
            ["RNF0001", "**Segurança de Dados**: Implementar medidas de segurança para proteger os dados dos pacientes contra acesso não autorizado, perda e roubo.", "Alta"],
            ["RNF0002", "**Controle de Acesso**: Garantir que apenas usuários autenticados e autorizados possam acessar dados sensíveis, com diferentes níveis de permissão baseados em papéis.", "Alta"],
            ["RNF0002", "**Desempenho**: Assegurar que o sistema responda às solicitações de usuários em menos de 2 segundos durante operações normais.", "Alta"],
            ["RNF0002", "**Escalabilidade**: O sistema deve ser capaz de escalar para atender a um aumento no número de usuários e registros sem perda de desempenho.", "Média"],
            ["RNF0002", "**Confiabilidade**: O sistema deve estar disponível 99,9% do tempo, excluindo períodos de manutenção programada.", "Alta"],
            ["RNF0002", "**Usabilidade**: Desenvolver uma interface de usuário intuitiva e fácil de usar para garantir que médicos e enfermeiros possam usar o sistema sem necessidade de treinamento extensivo.", "Média"],
            ["RNF0002", "**Compatibilidade**: Assegurar que o sistema seja compatível com diferentes dispositivos e navegadores, incluindo desktops, tablets e smartphones.", "Média"],
            ["RNF0002", "**Manutenibilidade**: O sistema deve ser fácil de manter e atualizar, com documentação completa e clara do código e das funcionalidades.", "Média"],
            ["RNF0002", "**Auditabilidade**: Registrar todas as operações e acessos ao sistema para fins de auditoria e controle de segurança.", "Alta"],
            ["RNF0002", "**Backup e Recuperação**: Implementar mecanismos de backup regular e procedimentos de recuperação de dados em caso de falhas.", "Alta"]
          ]
        },
        {
          tipo: "destaque",
          texto: "Nota sobre a numeração: assim como no Quadro 1, o Quadro 4 do PDF apresenta uma inconsistência de numeração — apenas o primeiro item é identificado como RNF0001, e todos os demais aparecem repetidos como \"RNF0002\". Essa característica pertence ao documento original e foi mantida sem alteração para garantir fidelidade ao material."
        }
      ]
    },
    {
      id: "resumo_final",
      titulo: "Resumo Final para Revisão Rápida",
      blocos: [
        {
          tipo: "lista",
          titulo: "Pontos-chave para revisão",
          itens: [
            "**Requisitos** = expectativas e necessidades dos *stakeholders* (usuários, clientes, desenvolvedores, gestores, o próprio sistema).",
            "**Elicitação** = descobrir/ouvir/entender os requisitos (entrevistas, questionários, *workshops*, observação).",
            "**Análise** = refinar, organizar, cruzar dados, identificar inconsistências e **priorizar** os requisitos coletados.",
            "Duas categorias de requisitos: **Funcionais** — o que o sistema faz (a \"melodia\"); **Não funcionais** — características de qualidade: desempenho, segurança, confiabilidade, usabilidade, escalabilidade, manutenibilidade, compatibilidade (a \"harmonia\").",
            "Técnicas de elicitação: **entrevistas, questionários, workshops**.",
            "Ferramentas de apoio: **diagrama de casos de uso, protótipos, ferramentas CASE**.",
            "Benefícios de bons requisitos: menos retrabalho/custo, mais qualidade, mais satisfação do cliente, melhor comunicação da equipe, mais agilidade.",
            "**User Stories**: formato \"Como [usuário], eu quero [ação], para que [objetivo]\" — linguagem próxima do cliente, detalhando campos de tela e interface.",
            "**Critérios de aceitação**: condições que a User Story deve cumprir — devem ser claros, mensuráveis, relevantes e objetivos.",
            "**Priorização de requisitos funcionais**: requisitos urgentes/determinantes vs. requisitos para o futuro próximo; base para o cronograma e para o Documento de Requisitos do Sistema (que define escopo, descrição, prioridades e cronograma).",
            "**Escopo Variado de Produto** (flexível/iterativo, método ágil) x **Escopo Fixo de Produto** (requisitos imutáveis) — o autor do capítulo defende o escopo variado.",
            "**MVP (Produto Mínimo Viável)**: versão mais simples e funcional para testar uma ideia com o menor investimento, validando hipóteses de negócio e coletando *feedback*; construído de forma incremental, priorizando funcionalidades críticas primeiro (exemplo: *Event Planner*).",
            "Requisitos não funcionais essenciais e suas metas típicas: **confiabilidade ≥ 99,9% de disponibilidade**; **desempenho** com resposta em menos de 2 segundos (no exemplo do prontuário eletrônico).",
            "Os dois exemplos centrais do módulo: **Sistema de Gerenciamento de Projetos** / **E-commerce** (para ilustrar elicitação e análise) e **Sistema de Prontuário Eletrônico** (usado de forma mais aprofundada para exemplificar tanto requisitos funcionais quanto não funcionais, com quadros de requisitos e *User Stories*)."
          ]
        }
      ]
    }
  ]
  },

  // aula 6
  {
  aula: "Técnicas de Levantamento de Requisitos",
  ideia_central: "O Levantamento de Requisitos é a etapa da Engenharia de Requisitos que coleta e analisa, de forma contínua ao longo de todo o ciclo de vida do software, as necessidades dos stakeholders por meio de quatro técnicas principais — Entrevistas, Reuniões, Etnografia e Análise de Documentos —, cada uma com seus tipos, desafios e hard/soft skills necessárias.",
  secoes: [
    {
      id: "visao_geral",
      titulo: "Visão Geral",
      blocos: [
        {
          tipo: "texto",
          texto: "O módulo trata do **Levantamento de Requisitos**, etapa fundamental da **Engenharia de Requisitos** — a disciplina responsável por definir, documentar e gerenciar os requisitos de um sistema de software, do início até a manutenção. O Levantamento de Requisitos é a fase que coleta e analisa as necessidades e expectativas dos envolvidos no projeto, garantindo que o software atenda às necessidades reais dos usuários, evite funcionalidades desnecessárias, facilite a comunicação entre desenvolvedores, usuários e demais *stakeholders*, e reduza retrabalho e custos."
        },
        {
          tipo: "lista",
          titulo: "Quatro técnicas centrais, sempre apresentadas na mesma lógica (definição → tipos/metodologia → desafios → habilidades necessárias)",
          itens: [
            "**Entrevistas** — conversas individuais com cada stakeholder.",
            "**Reuniões** — discussões em grupo para alinhar expectativas.",
            "**Etnografia** — observação direta dos usuários em seu ambiente natural de trabalho.",
            "**Análise de documentos** — revisão de documentos já existentes (manuais, relatórios, registros)."
          ]
        },
        {
          tipo: "texto",
          texto: "O texto reforça que o Levantamento de Requisitos é um **processo contínuo**, que deve acompanhar todo o ciclo de vida do software para que os requisitos permaneçam atualizados e o sistema evolua de forma sustentável."
        }
      ]
    },
    {
      id: "entrevistas",
      titulo: "Entrevistas",
      blocos: [
        {
          tipo: "texto",
          texto: "As entrevistas são uma das técnicas **mais utilizadas** para levantamento de requisitos. Envolvem conversas diretas entre analistas de sistemas e *stakeholders*, com o objetivo de coletar informações detalhadas sobre necessidades e expectativas dos usuários."
        },
        {
          tipo: "subtitulo",
          texto: "Tipos de Entrevistas"
        },
        {
          tipo: "topico",
          titulo: "a) Entrevistas Estruturadas",
          texto: "Seguem um **roteiro rígido de perguntas predefinidas**. São úteis para obter informações **específicas e comparáveis** entre diferentes *stakeholders* — por exemplo, perguntar a cada gerente de projeto, com a mesma lista fixa de perguntas, quais funcionalidades ele espera de um sistema."
        },
        {
          tipo: "topico",
          titulo: "b) Entrevistas Semiestruturadas",
          texto: "Combinam **perguntas predefinidas** com a **flexibilidade** de explorar novos tópicos que surgem durante a conversa. Servem para aprofundar o entendimento de áreas específicas mantendo uma estrutura básica — o analista pode, por exemplo, partir de uma pergunta fixa sobre funcionalidades e depois pedir mais detalhes sobre um ponto que o entrevistado mencionou espontaneamente (como a importância de uma integração entre sistemas)."
        },
        {
          tipo: "topico",
          titulo: "c) Entrevistas Não Estruturadas",
          texto: "São **conversas abertas, sem roteiro rígido**, permitindo exploração livre das necessidades e expectativas dos *stakeholders*. São úteis para obter uma compreensão **ampla e profunda** das perspectivas dos usuários. O analista pode iniciar com uma pergunta geral e deixar a conversa seguir os tópicos que surgem naturalmente."
        },
        {
          tipo: "imagem",
          id: "representacao_visual_entrevista_nao_estruturada",
          src: "representacao_visual_entrevista_nao_estruturada.png",
          pasta: "imagens_analise_projeto/aula_06",
          alt: "Uma analista, sentada com papéis em mãos, entrevista um stakeholder e pergunta, em um balão de fala, sobre os desafios que ele enfrenta atualmente com o sistema existente. A cena ilustra concretamente como uma entrevista não estruturada pode começar com uma pergunta ampla e aberta, deixando o restante da conversa fluir conforme os tópicos trazidos pelo próprio entrevistado.",
          num: 1
        },
        {
          tipo: "texto",
          texto: "**Contexto complementar (indicado no PDF):** o material observa que entrevistas não são uma técnica exclusiva da Engenharia de Software — elas também são usadas como método científico em pesquisa qualitativa em áreas como Psicologia, Sociologia e Medicina."
        },
        {
          tipo: "subtitulo",
          texto: "Desafios das Entrevistas para Levantamento de Requisitos"
        },
        {
          tipo: "lista",
          itens: [
            "Estabelecer um **ambiente de confiança**, para que os entrevistados se sintam à vontade para compartilhar informações detalhadas e honestas.",
            "Entrevistados podem **não ter uma visão clara** das próprias necessidades ou ter dificuldade em **articulá-las tecnicamente**.",
            "Podem surgir **informações inconsistentes ou conflitantes** entre diferentes *stakeholders* — o analista precisa saber identificar e reconciliar essas discrepâncias para construir um conjunto de requisitos coeso e viável."
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Habilidades Necessárias para Conduzir Entrevistas"
        },
        {
          tipo: "texto",
          texto: "Para conduzir entrevistas eficazes, o profissional precisa desenvolver tanto **hard skills** quanto **soft skills**: **Hard skills** são habilidades **técnicas/específicas**, adquiridas por treinamento, experiência prática e educação formal (ex.: programação em `Python`/`Java`/`C++`, uso de ferramentas como `Excel`/`AutoCAD`/`Photoshop`, análise de dados com `SQL`/`R`/`MATLAB`, proficiência em línguas estrangeiras, competências técnicas de área). **Soft skills** são relacionadas a **comportamento, personalidade e habilidades sociais**, cruciais para o sucesso profissional (ex.: comunicação, empatia, trabalho em equipe, resolução de problemas, ética de trabalho)."
        },
        {
          tipo: "tabela",
          titulo: "Quadro 1 — Hard skills necessárias ao profissional que trabalha com requisitos (entrevistas)",
          colunas: ["Hard Skill", "Descrição"],
          linhas: [
            ["Conhecimento Técnico", "Compreensão técnica do domínio do problema e da tecnologia envolvida, para formular perguntas relevantes e entender respostas técnicas."],
            ["Documentação", "Capacidade de documentar respostas de maneira clara e organizada, usando ferramentas adequadas para registrar requisitos coletados."],
            ["Análise de Dados", "Habilidade de analisar informações coletadas para identificar padrões, inconsistências e áreas que precisam de mais esclarecimentos."]
          ]
        },
        {
          tipo: "tabela",
          titulo: "Quadro 2 — Soft skills necessárias ao profissional que trabalha com requisitos (entrevistas)",
          colunas: ["Soft Skill", "Descrição"],
          linhas: [
            ["Comunicação", "Comunicação verbal e escrita para formular perguntas claras, escutar ativamente e documentar respostas com precisão."],
            ["Empatia", "Compreender e valorizar as perspectivas e preocupações dos stakeholders, estabelecendo confiança e colaboração."],
            ["Negociação", "Reconciliar requisitos conflitantes entre diferentes stakeholders, buscando compromissos que satisfaçam a todos."],
            ["Pensamento Crítico", "Avaliar criticamente as respostas dos stakeholders, identificando problemas ou áreas que precisam de mais detalhes."],
            ["Gerenciamento do Tempo", "Gerenciar o tempo durante as entrevistas, garantindo que todas as questões importantes sejam abordadas sem fugir do foco."]
          ]
        },
        {
          tipo: "destaque",
          texto: "⚠️ Possível pegadinha de prova: no documento original, os títulos dos Quadros 1 e 2 estão trocados — ambos aparecem rotulados como \"Lista das hard skills...\", embora o Quadro 2 liste, na verdade, as soft skills. O conteúdo das tabelas acima já está corrigido conforme o cabeçalho real de cada uma (HARD SKILLS / SOFT SKILLS)."
        },
        {
          tipo: "texto",
          texto: "**Material complementar sugerido no PDF:** vídeos do Prof. Gilleanes Guedes — *\"Elicitação de Requisitos – Parte II – Entrevistas\"* e *\"Elicitação de Requisitos – Parte III – Questionários\"* (este último aborda a técnica de Questionário, não coberta neste material, mas apontada como importante para o Levantamento de Requisitos)."
        }
      ]
    },
    {
      id: "reunioes",
      titulo: "Reuniões",
      blocos: [
        {
          tipo: "texto",
          texto: "As reuniões são uma técnica essencial de levantamento de requisitos, envolvendo **discussões em grupo** com os *stakeholders* para identificar necessidades, alinhar expectativas e debater diferentes perspectivas. Permitem colaboração e geração de ideias, facilitando o consenso sobre os requisitos do sistema."
        },
        {
          tipo: "subtitulo",
          texto: "Tipos de Reuniões"
        },
        {
          tipo: "topico",
          titulo: "a) Reuniões de Brainstorming",
          texto: "Focadas na **geração de ideias e soluções de forma colaborativa**. Os participantes são incentivados a sugerir ideias livremente, sem julgamentos imediatos, em ambiente criativo e aberto."
        },
        {
          tipo: "exemplo",
          titulo: "Reunião de brainstorming",
          texto: "Uma equipe realiza uma sessão de brainstorming para identificar possíveis funcionalidades e melhorias para um novo sistema de gerenciamento de projetos."
        },
        {
          tipo: "topico",
          titulo: "b) Reuniões de Análise e Revisão",
          texto: "Usadas para **analisar e revisar os requisitos já coletados**, garantindo que estejam claros, completos e alinhados com os objetivos do projeto. Os participantes discutem e refinam os requisitos, identificando inconsistências ou áreas que precisam de mais detalhes."
        },
        {
          tipo: "topico",
          titulo: "c) Workshops",
          texto: "Sessões colaborativas **mais estruturadas**, que combinam elementos de brainstorming e de análise, geralmente com atividades práticas e exercícios para explorar e definir requisitos."
        },
        {
          tipo: "exemplo",
          titulo: "Workshop",
          texto: "Um workshop organizado para mapear os processos atuais de uma organização e identificar áreas de melhoria por meio de um novo sistema de software."
        },
        {
          tipo: "subtitulo",
          texto: "Desafios das Reuniões para Levantamento de Requisitos"
        },
        {
          tipo: "lista",
          itens: [
            "Garantir a **participação ativa e o engajamento** de todos os stakeholders — difícil quando há conflitos de agenda ou interesses divergentes.",
            "Manter o **foco e a produtividade**, evitando digressões e garantindo que todos os tópicos importantes sejam abordados."
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Habilidades Necessárias para Conduzir Reuniões"
        },
        {
          tipo: "tabela",
          titulo: "Quadro 3 — Hard skills para condução de reuniões",
          colunas: ["Hard Skill", "Descrição"],
          linhas: [
            ["Planejamento de Reuniões", "Planejar reuniões de forma eficaz, definindo agendas claras e objetivos específicos."],
            ["Facilitação de Grupos", "Conduzir e moderar discussões, assegurando que todos os participantes possam contribuir."],
            ["Documentação", "Registrar discussões e decisões tomadas durante a reunião de maneira clara e organizada."]
          ]
        },
        {
          tipo: "tabela",
          titulo: "Quadro 4 — Soft skills para condução de reuniões",
          colunas: ["Soft Skill", "Descrição"],
          linhas: [
            ["Comunicação", "Comunicação verbal e escrita para conduzir reuniões de forma clara e eficiente, promovendo entendimento mútuo."],
            ["Empatia", "Compreender e valorizar as perspectivas e preocupações dos stakeholders, criando um ambiente colaborativo."],
            ["Negociação", "Reconciliar requisitos conflitantes e interesses divergentes, facilitando a obtenção de consenso."],
            ["Pensamento Crítico", "Avaliar criticamente as discussões, identificando áreas que precisam de mais detalhes ou refinamentos."],
            ["Gerenciamento do Tempo", "Gerenciar o tempo durante as reuniões, garantindo que todos os tópicos importantes sejam abordados eficientemente."]
          ]
        },
        {
          tipo: "texto",
          texto: "**Contexto complementar (indicado no PDF):** as reuniões podem ser usadas tanto para a **organização das equipes** quanto para o **levantamento de requisitos propriamente dito** — nesse segundo caso, é comum usar entrevistas dentro da própria reunião para coletar dados dos clientes e do público-alvo do sistema."
        }
      ]
    },
    {
      id: "etnografia",
      titulo: "Etnografia",
      blocos: [
        {
          tipo: "texto",
          texto: "A etnografia é uma técnica de levantamento de requisitos que envolve a **observação direta dos usuários em seu ambiente natural de trabalho**. Permite aos analistas entenderem como os usuários interagem com o sistema existente e identificar oportunidades de melhoria com base em **comportamentos reais**."
        },
        {
          tipo: "subtitulo",
          texto: "Metodologia da Etnografia"
        },
        {
          tipo: "texto",
          texto: "A etnografia usa **métodos qualitativos** para coletar dados detalhados sobre o uso do sistema e as práticas de trabalho dos usuários, envolvendo **imersão** no ambiente de trabalho deles."
        },
        {
          tipo: "topico",
          titulo: "a) Observação Direta",
          texto: "O analista observa os usuários enquanto realizam suas tarefas, registrando como utilizam o sistema, as dificuldades encontradas e as soluções adotadas."
        },
        {
          tipo: "exemplo",
          titulo: "Etnografia (observação direta)",
          texto: "Um analista passa um dia em um hospital observando como médicos e enfermeiros utilizam o sistema de prontuário eletrônico, para entender melhor suas necessidades e desafios."
        },
        {
          tipo: "topico",
          titulo: "b) Entrevistas Contextuais",
          texto: "Além da observação, o analista pode conduzir entrevistas contextuais com os usuários, perguntando sobre suas atividades e experiências **enquanto elas ocorrem**. Essa abordagem permite obter *insights* adicionais e esclarecer aspectos observados durante a interação com o sistema."
        },
        {
          tipo: "subtitulo",
          texto: "Desafios da Etnografia para Levantamento de Requisitos"
        },
        {
          tipo: "lista",
          itens: [
            "Exige **tempo e recursos** para realizar observações detalhadas.",
            "Os usuários podem **alterar o comportamento** quando sabem que estão sendo observados, afetando a validade dos dados coletados (efeito observador).",
            "Pode ser **difícil interpretar dados qualitativos** de forma objetiva e utilizável para o desenvolvimento de requisitos."
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Habilidades Necessárias para Conduzir Etnografia"
        },
        {
          tipo: "tabela",
          titulo: "Quadro 5 — Hard skills para condução de etnografia",
          colunas: ["Hard Skill", "Descrição"],
          linhas: [
            ["Técnicas de Observação", "Realizar observações detalhadas e registrar dados de forma sistemática."],
            ["Documentação Qualitativa", "Documentar observações e entrevistas de maneira clara e organizada."],
            ["Análise Qualitativa", "Analisar dados qualitativos e identificar padrões e insights relevantes."]
          ]
        },
        {
          tipo: "destaque",
          texto: "⚠️ Possível pegadinha de prova: no PDF original, este quadro está rotulado como \"Quadro de soft skills...\", mas o cabeçalho da própria tabela mostra \"HARD SKILLS\" e todo o conteúdo (técnicas de observação, documentação, análise qualitativa) é de natureza técnica — trata-se, de fato, de um quadro de hard skills."
        },
        {
          tipo: "tabela",
          titulo: "Quadro 6 — Soft skills para condução de etnografia",
          colunas: ["Soft Skill", "Descrição"],
          linhas: [
            ["Empatia", "Compreender e valorizar as perspectivas dos usuários, estabelecendo um ambiente de confiança."],
            ["Comunicação", "Realizar entrevistas contextuais e documentar informações de maneira precisa."],
            ["Discrição", "Observar de forma não intrusiva, minimizando a alteração do comportamento dos usuários."],
            ["Pensamento Crítico", "Avaliar e interpretar dados qualitativos, identificando insights relevantes para o desenvolvimento de requisitos."],
            ["Gerenciamento do Tempo", "Planejar e realizar observações de forma eficiente, garantindo a coleta de dados abrangentes."]
          ]
        },
        {
          tipo: "texto",
          texto: "**Material complementar sugerido no PDF:** vídeo *\"Webinar - Levantamento de Requisitos com Observações/Etnografia\"*, de Leonardo Nascimento (Fatto Consultoria e Soluções), indicado como um bom material sobre a preparação necessária para conduzir uma pesquisa etnográfica de identificação de requisitos."
        }
      ]
    },
    {
      id: "analise_documentos",
      titulo: "Análise de Documentos",
      blocos: [
        {
          tipo: "texto",
          texto: "A análise de documentos é uma técnica que envolve a **revisão de documentos existentes** (manuais, relatórios, registros de uso) para identificar **requisitos implícitos e complementares**. É útil para entender o contexto do sistema atual e identificar necessidades que os usuários podem não mencionar explicitamente."
        },
        {
          tipo: "subtitulo",
          texto: "Tipos de Documentos Analisados"
        },
        {
          tipo: "topico",
          titulo: "a) Manuais e Documentação Técnica",
          texto: "Fornecem informações detalhadas sobre funcionalidades existentes e limitações do sistema."
        },
        {
          tipo: "exemplo",
          titulo: "Manual de usuário",
          texto: "A análise de um manual de usuário pode revelar requisitos funcionais e não funcionais que precisam ser mantidos ou melhorados no novo sistema."
        },
        {
          tipo: "topico",
          titulo: "b) Relatórios de Uso",
          texto: "Fornecem *insights* sobre como o sistema é utilizado na prática — quais funcionalidades são mais usadas e onde ocorrem problemas frequentes — ajudando a identificar áreas que precisam de melhorias ou novas funcionalidades."
        },
        {
          tipo: "topico",
          titulo: "c) Registros de Incidentes e Suporte",
          texto: "Revelam problemas recorrentes e necessidades não atendidas pelos usuários."
        },
        {
          tipo: "exemplo",
          titulo: "Análise de documentos (registros de suporte)",
          texto: "A análise de registros de suporte pode mostrar que os usuários solicitam frequentemente uma funcionalidade específica ausente no sistema atual."
        },
        {
          tipo: "subtitulo",
          texto: "Desafios da Análise de Documentos para Levantamento de Requisitos"
        },
        {
          tipo: "lista",
          itens: [
            "Necessidade de **acessar e interpretar grande quantidade de informações**.",
            "Documentos podem estar **incompletos ou desatualizados**, levando a uma compreensão incorreta dos requisitos.",
            "A análise de documentos pode **não capturar todas as necessidades** dos usuários, especialmente as que não estão documentadas."
          ]
        },
        {
          tipo: "texto",
          texto: "**Material complementar sugerido no PDF (contexto de métodos ágeis):** vídeo *\"Requisitos Ágeis - Como escrever histórias de usuário incríveis!\"*, do canal Agilizando!, indicado para quem quiser aprofundar o processo de criação de *User Stories* e sua importância para o Levantamento de Requisitos."
        }
      ]
    },
    {
      id: "formulas_metodos",
      titulo: "Fórmulas e Métodos",
      blocos: [
        {
          tipo: "texto",
          texto: "Este módulo não apresenta fórmulas matemáticas ou métodos de cálculo — seu conteúdo é conceitual e qualitativo, focado na descrição de técnicas de levantamento de requisitos (entrevistas, reuniões, etnografia e análise de documentos), seus tipos, desafios e habilidades necessárias."
        }
      ]
    },
    {
      id: "exemplos_explicativos",
      titulo: "Exemplos Explicativos",
      blocos: [
        {
          tipo: "texto",
          texto: "Os exemplos a seguir são os mesmos trazidos ao longo do PDF, reunidos e organizados por técnica."
        },
        {
          tipo: "exemplo",
          titulo: "Entrevista estruturada",
          texto: "Um analista usa uma lista fixa de perguntas para coletar, de cada gerente de projeto, dados comparáveis sobre requisitos funcionais de um sistema de gerenciamento de tarefas.",
          detalhe: "Perguntas como: \"Quais são as cinco funcionalidades mais importantes que você espera deste sistema?\" e \"Como você define o sucesso para este software?\"."
        },
        {
          tipo: "exemplo",
          titulo: "Entrevista semiestruturada",
          texto: "O analista parte de perguntas predefinidas sobre funcionalidades desejadas e, a partir da resposta do entrevistado, aprofunda com uma pergunta de acompanhamento sobre a importância da integração com outros sistemas."
        },
        {
          tipo: "exemplo",
          titulo: "Entrevista não estruturada",
          texto: "O analista inicia com uma pergunta geral e aberta e deixa a conversa fluir conforme os tópicos surgem.",
          detalhe: "Pergunta de abertura: \"Pode me falar sobre os desafios que você enfrenta atualmente com o sistema existente?\" (ver representação visual na seção de Entrevistas)."
        },
        {
          tipo: "exemplo",
          titulo: "Reunião de brainstorming",
          texto: "Uma equipe realiza uma sessão para identificar possíveis funcionalidades e melhorias para um novo sistema de gerenciamento de projetos."
        },
        {
          tipo: "exemplo",
          titulo: "Workshop",
          texto: "Organizado para mapear os processos atuais de uma organização e identificar áreas de melhoria por meio de um novo sistema de software."
        },
        {
          tipo: "exemplo",
          titulo: "Etnografia (observação direta)",
          texto: "Um analista passa um dia em um hospital observando médicos e enfermeiros usarem o sistema de prontuário eletrônico, para entender necessidades e desafios reais."
        },
        {
          tipo: "exemplo",
          titulo: "Análise de documentos (registros de suporte)",
          texto: "A análise revela que usuários solicitam repetidamente uma funcionalidade específica que ainda não existe no sistema atual."
        }
      ]
    },
    {
      id: "imagens_graficos_diagramas",
      titulo: "Imagens, Gráficos e Diagramas Importantes",
      blocos: [
        {
          tipo: "texto",
          texto: "O único elemento visual do PDF com valor informativo direto para o conteúdo — a ilustração da entrevista não estruturada — já foi referenciado em seu contexto natural, na seção de Entrevistas (Tipos de Entrevistas → Entrevistas Não Estruturadas). Os Quadros (tabelas) 1 a 6, por conterem dados totalmente representáveis em texto, foram transcritos como tabelas textuais fiéis dentro das seções correspondentes, sem necessidade de referência de imagem separada."
        },
        {
          tipo: "texto",
          texto: "Os demais elementos gráficos do documento (ícones de capa, clipe de prancheta, alvo, lata de lápis das seções \"Anotações\", sinal de \"Parada Obrigatória\", claquete de \"Multimídia\", chapéu de formatura dos exercícios) são puramente decorativos/ilustrativos de seção, sem conteúdo informativo próprio, e por isso não foram referenciados individualmente."
        }
      ]
    },
    {
      id: "resumo_final",
      titulo: "Resumo Final para Revisão Rápida",
      blocos: [
        {
          tipo: "lista",
          itens: [
            "**Levantamento de Requisitos** = etapa da Engenharia de Requisitos que coleta/analisa necessidades dos stakeholders; é um processo **contínuo** ao longo do ciclo de vida do software.",
            "**4 técnicas estudadas:** Entrevistas, Reuniões, Etnografia, Análise de Documentos."
          ]
        },
        {
          tipo: "topico",
          titulo: "Entrevistas",
          lista: [
            "Estruturada = roteiro rígido, respostas comparáveis.",
            "Semiestruturada = roteiro + flexibilidade para aprofundar.",
            "Não estruturada = conversa aberta, sem roteiro.",
            "Desafios: confiança, falta de clareza dos entrevistados, respostas conflitantes."
          ]
        },
        {
          tipo: "topico",
          titulo: "Reuniões",
          lista: [
            "Brainstorming = geração livre de ideias.",
            "Análise e Revisão = refinar requisitos já coletados.",
            "Workshop = mais estruturado, combina brainstorming + análise.",
            "Desafios: engajamento de todos, manter foco/produtividade."
          ]
        },
        {
          tipo: "topico",
          titulo: "Etnografia",
          lista: [
            "Observação direta + Entrevistas contextuais, no ambiente real do usuário.",
            "Desafios: tempo/recursos, efeito observador (mudança de comportamento), dificuldade de interpretar dados qualitativos."
          ]
        },
        {
          tipo: "topico",
          titulo: "Análise de Documentos",
          lista: [
            "Tipos: manuais/documentação técnica, relatórios de uso, registros de incidentes/suporte.",
            "Desafios: volume de informação, documentos incompletos/desatualizados, necessidades não documentadas."
          ]
        },
        {
          tipo: "lista",
          itens: [
            "**Hard skills** = técnicas, mensuráveis, adquiridas por treinamento/educação (ex.: conhecimento técnico, documentação, análise de dados/qualitativa, planejamento, facilitação, técnicas de observação).",
            "**Soft skills** = comportamentais/interpessoais (ex.: comunicação, empatia, negociação, pensamento crítico, gerenciamento do tempo, discrição)."
          ]
        },
        {
          tipo: "destaque",
          texto: "**Atenção:** no PDF original, os títulos dos Quadros 1, 2 e 5 estão trocados em relação ao conteúdo real das tabelas (ex.: Quadro 5 é rotulado \"soft skills\" mas lista hard skills) — cuidado ao revisar esse ponto para prova."
        },
        {
          tipo: "lista",
          itens: [
            "**Observação:** este módulo não contém fórmulas matemáticas; seu conteúdo é integralmente conceitual/qualitativo."
          ]
        }
      ]
    }
  ]
  },
  
  // aula 07
  
  ]};