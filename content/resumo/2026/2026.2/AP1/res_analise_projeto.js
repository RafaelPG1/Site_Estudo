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
  ideia_central: "A aula apresenta os Métodos Ágeis como abordagens iterativas e incrementais de desenvolvimento de software, fundamentadas no Manifesto Ágil, comparando-os aos métodos tradicionais e detalhando exemplos de aplicação, além de explicar em profundidade as metodologias Scrum e Extreme Programming (XP).",
  secoes: [
    {
      id: "visao_geral",
      titulo: "Visão geral do conteúdo",
      blocos: [
        {
          tipo: "destaque",
          texto: "Base do resumo: exclusivamente o conteúdo do PDF *Aula 4 Métodos Ágeis*. O material possui 28 páginas e aborda Métodos Ágeis, Manifesto Ágil, comparação com métodos tradicionais, exemplos de utilização, Scrum e Extreme Programming (XP)."
        },
        {
          tipo: "texto",
          texto: "Os **Métodos Ágeis** são apresentados no PDF como abordagens **iterativas e incrementais** para o desenvolvimento de software, com prioridade para colaboração, flexibilidade, entrega contínua de valor ao cliente, adaptação às mudanças, comunicação entre os envolvidos e desenvolvimento de software funcional."
        },
        {
          tipo: "lista",
          titulo: "Prioridades dos Métodos Ágeis",
          itens: [
            "colaboração",
            "flexibilidade",
            "entrega contínua de valor ao cliente",
            "adaptação às mudanças",
            "comunicação entre os envolvidos",
            "desenvolvimento de software funcional"
          ]
        },
        {
          tipo: "texto",
          texto: "Eles surgem como alternativa aos métodos tradicionais, caracterizados no material por processos mais **lineares, estruturados e rígidos**."
        },
        {
          tipo: "topico",
          titulo: "Dois métodos principais abordados no PDF",
          lista: [
            "**Scrum** — apresentado como uma metodologia de gerenciamento de projetos baseada em ciclos curtos chamados **sprints**.",
            "**Extreme Programming (XP)** — apresentado como uma abordagem com forte ênfase em práticas técnicas de desenvolvimento, qualidade, comunicação e feedback."
          ]
        },
        {
          tipo: "destaque",
          texto: "Relação geral: Métodos Ágeis → Manifesto Ágil → princípios e valores → diferentes métodos/práticas → Scrum e XP."
        },
        {
          tipo: "texto",
          texto: "Além desses dois, o material menciona **Kanban, Lean, DevOps e Pair Programming**."
        }
      ]
    },
    {
      id: "o_que_sao_metodos_ageis",
      titulo: "O que são Métodos Ágeis",
      blocos: [
        {
          tipo: "texto",
          texto: "Os Métodos Ágeis são abordagens **iterativas e incrementais** para desenvolvimento de software. Seu objetivo é permitir que o desenvolvimento aconteça em ciclos menores, com entregas frequentes e possibilidade de adaptação durante o projeto."
        },
        {
          tipo: "subtitulo",
          texto: "Principais características"
        },
        {
          tipo: "topico",
          titulo: "Colaboração",
          texto: "A colaboração entre os integrantes da equipe e o cliente possui papel central. O cliente participa do processo para que suas necessidades e expectativas sejam consideradas durante o desenvolvimento."
        },
        {
          tipo: "topico",
          titulo: "Flexibilidade",
          texto: "A equipe pode adaptar o projeto conforme mudanças nos requisitos, novas informações, necessidades dos clientes e oportunidades identificadas durante o desenvolvimento.",
          lista: [
            "mudanças nos requisitos",
            "novas informações",
            "necessidades dos clientes",
            "oportunidades identificadas durante o desenvolvimento"
          ]
        },
        {
          tipo: "topico",
          titulo: "Entrega contínua",
          texto: "O software funcional é entregue em intervalos regulares, normalmente por meio de **iterações ou sprints curtas**. Isso permite obter feedback e realizar ajustes rapidamente."
        },
        {
          tipo: "topico",
          titulo: "Trabalho em equipe",
          texto: "O material enfatiza a colaboração entre os membros da equipe, buscando um ambiente cooperativo e aberto."
        }
      ]
    },
    {
      id: "manifesto_agil",
      titulo: "Manifesto Ágil",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Manifesto Ágil**, criado em **2001**, é apresentado como a base sobre a qual os métodos ágeis são construídos. Ele estabelece **4 valores fundamentais** e **12 princípios**."
        },
        {
          tipo: "subtitulo",
          texto: "Os quatro valores fundamentais"
        },
        {
          tipo: "topico",
          titulo: "1. Indivíduos e interações mais que processos e ferramentas",
          texto: "O foco deve estar nas **pessoas, comunicação e colaboração**, em vez de priorizar processos rígidos e ferramentas."
        },
        {
          tipo: "topico",
          titulo: "2. Software em funcionamento mais que documentação abrangente",
          texto: "A prioridade é entregar **software funcional**, em vez de concentrar esforços em documentação extensa."
        },
        {
          tipo: "topico",
          titulo: "3. Colaboração com o cliente mais que negociação de contratos",
          texto: "O cliente deve colaborar continuamente com a equipe para ajudar a garantir que o produto final atenda às suas necessidades."
        },
        {
          tipo: "topico",
          titulo: "4. Responder a mudanças mais que seguir um plano",
          texto: "Mudanças são consideradas inevitáveis. Por isso, a capacidade de adaptação é mais importante do que seguir rigidamente um plano inflexível."
        },
        {
          tipo: "exemplo",
          titulo: "Representação visual: os quatro valores fundamentais do Manifesto Ágil",
          texto: "A representação organiza os quatro valores em quatro blocos, associados visualmente a símbolos de pessoas, software/código, colaboração e planejamento/mudança. Ela reforça que os valores priorizam pessoas e interações, software funcionando, colaboração com o cliente e resposta às mudanças.",
          detalhe: "Página: 7 do PDF. Parte do conteúdo: Manifesto Ágil. id: representacao_visual_quatro_valores_manifesto_agil"
        }
      ]
    },
    {
      id: "doze_principios",
      titulo: "Os 12 princípios do Manifesto Ágil",
      blocos: [
        {
          tipo: "texto",
          texto: "O PDF apresenta os seguintes princípios que fundamentam a aplicação prática dos valores do Manifesto Ágil."
        },
        {
          tipo: "lista",
          titulo: "Os 12 princípios",
          itens: [
            "**Satisfazer o cliente** por meio da entrega contínua e adiantada de software de valor.",
            "**Aceitar mudanças nos requisitos**, inclusive no final do desenvolvimento.",
            "**Entregar software funcional frequentemente**, preferindo iterações curtas.",
            "Manter **desenvolvedores e stakeholders trabalhando juntos diariamente**.",
            "Construir projetos em torno de **indivíduos motivados**, oferecendo ambiente e suporte.",
            "Considerar a **conversa face a face** como o meio mais eficiente e eficaz de transmitir informações.",
            "Utilizar o **software funcional como principal medida de progresso**.",
            "Promover **desenvolvimento sustentável**, mantendo um ritmo constante indefinidamente.",
            "Valorizar **excelência técnica e bom design**, pois aumentam a agilidade.",
            "Buscar a **simplicidade**, maximizando a quantidade de trabalho que não precisa ser realizado.",
            "Considerar que as melhores **arquiteturas, requisitos e designs** surgem de equipes auto-organizadas.",
            "Fazer **reflexões regulares** sobre como melhorar a eficácia da equipe, ajustando e aperfeiçoando seu comportamento."
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Para memorizar"
        },
        {
          tipo: "destaque",
          texto: "Os princípios enfatizam principalmente: cliente + mudanças + entregas frequentes + colaboração + pessoas + comunicação + software funcional + sustentabilidade + qualidade técnica + simplicidade + auto-organização + melhoria contínua."
        }
      ]
    },
    {
      id: "historia_metodos_ageis",
      titulo: "História dos Métodos Ágeis",
      blocos: [
        {
          tipo: "texto",
          texto: "Os métodos ágeis surgiram como uma resposta à **rigidez dos modelos tradicionais**, especialmente modelos como o **Waterfall**. Na década de 1990, aumentou a busca por formas mais dinâmicas de desenvolvimento."
        },
        {
          tipo: "lista",
          titulo: "Criadores destacados pelo PDF",
          itens: [
            "**Ken Schwaber e Jeff Sutherland** → desenvolvimento do **Scrum**",
            "**Kent Beck e Ward Cunningham** → criação do **Extreme Programming (XP)**"
          ]
        },
        {
          tipo: "texto",
          texto: "Essas abordagens passaram a trabalhar com ciclos **iterativos e incrementais**, realizando entregas frequentes em pequenos pedaços. Isso permitia receber feedback, realizar adaptações, responder às mudanças e envolver mais ativamente o cliente."
        },
        {
          tipo: "lista",
          titulo: "O que os ciclos iterativos e incrementais permitiam",
          itens: [
            "receber feedback",
            "realizar adaptações",
            "responder às mudanças",
            "envolver mais ativamente o cliente"
          ]
        },
        {
          tipo: "texto",
          texto: "Ao longo do tempo, a utilização dos métodos ágeis se expandiu. O material associa essa expansão a benefícios como maior agilidade, maior flexibilidade, adaptação às mudanças, entrega mais eficiente de valor, melhoria contínua da qualidade e maior satisfação do cliente."
        },
        {
          tipo: "lista",
          titulo: "Benefícios associados à expansão dos métodos ágeis",
          itens: [
            "maior agilidade",
            "maior flexibilidade",
            "adaptação às mudanças",
            "entrega mais eficiente de valor",
            "melhoria contínua da qualidade",
            "maior satisfação do cliente"
          ]
        },
        {
          tipo: "texto",
          texto: "Também surgiram ferramentas e frameworks que complementam essas práticas, como **Kanban, Lean e DevOps**."
        },
        {
          tipo: "topico",
          titulo: "Kanban",
          lista: [
            "visualização do fluxo de trabalho",
            "limitação do trabalho em progresso",
            "otimização do processo"
          ]
        },
        {
          tipo: "topico",
          titulo: "Lean",
          lista: [
            "eliminação de desperdícios",
            "otimização do desenvolvimento"
          ]
        },
        {
          tipo: "topico",
          titulo: "DevOps",
          texto: "Integra desenvolvimento e operações. Seu objetivo, segundo o material, é uma entrega de software **mais rápida e confiável**.",
          lista: [
            "desenvolvimento",
            "operações"
          ]
        }
      ]
    },
    {
      id: "ageis_vs_tradicionais",
      titulo: "Métodos Ágeis × Métodos Tradicionais",
      blocos: [
        {
          tipo: "texto",
          texto: "Os métodos tradicionais apresentados no PDF incluem **Waterfall**, **V-Model** e **RUP**. Eles são caracterizados como abordagens mais estruturadas, enquanto os métodos ágeis são **iterativos e incrementais**."
        },
        {
          tipo: "lista",
          titulo: "Métodos tradicionais citados",
          itens: [
            "Waterfall",
            "V-Model",
            "RUP"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Quadro 1 — Comparativo entre Métodos Tradicionais e Ágeis",
          texto: "O quadro compara as duas abordagens em relação a abordagem, flexibilidade, feedback, documentação, entrega, riscos, planejamento, colaboração, requisitos e qualidade.",
          detalhe: "Página: 10 do PDF. Parte do conteúdo: Comparação entre métodos ágeis e tradicionais. id: quadro_1_comparativo_metodos_tradicionais_ageis"
        },
        {
          tipo: "tabela",
          titulo: "Quadro 1 — Comparativo entre Métodos Tradicionais e Ágeis",
          colunas: ["Aspecto", "Métodos tradicionais", "Métodos ágeis"],
          linhas: [
            ["Abordagem", "Sequencial e linear no Waterfall; iterativo fixo no V-Model; fases sobrepostas no RUP", "Iterativa e incremental"],
            ["Flexibilidade", "Baixa devido à rigidez do planejamento", "Alta, com adaptação rápida"],
            ["Feedback do cliente", "Limitado a fases específicas", "Contínuo e constante"],
            ["Documentação", "Extensa e detalhada", "Suficiente para a necessidade atual"],
            ["Entrega de software", "Ao final do projeto", "Frequente, em pequenos incrementos"],
            ["Gerenciamento de riscos", "Antecipado e formalizado", "Contínuo, com respostas rápidas"],
            ["Planejamento", "Extensivo no início", "Adaptável ao longo do projeto"],
            ["Colaboração", "Menor ênfase", "Forte ênfase na colaboração"],
            ["Mudança de requisitos", "Dificilmente acomodada", "Facilmente acomodada"],
            ["Qualidade", "Verificada ao final", "Verificada continuamente"]
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Diferença central para prova"
        },
        {
          tipo: "destaque",
          texto: "Tradicional: planejamento mais rígido → mudanças mais difíceis → entrega concentrada no final. Ágil: planejamento adaptável → mudanças mais facilmente acomodadas → entregas frequentes → feedback contínuo."
        }
      ]
    },
    {
      id: "exemplos_utilizacao_tecnologia",
      titulo: "Exemplos de utilização de Métodos Ágeis — Empresas de tecnologia",
      blocos: [
        {
          tipo: "texto",
          texto: "O material apresenta organizações de diferentes tipos que utilizam métodos ágeis, começando pelas empresas de tecnologia."
        },
        {
          tipo: "exemplo",
          titulo: "Spotify",
          texto: "Utiliza **Scrum**, com sprints curtos, entregas frequentes, novas funcionalidades e resposta rápida às necessidades dos usuários.",
          detalhe: "sprints curtos; entregas frequentes; novas funcionalidades; resposta rápida às necessidades dos usuários"
        },
        {
          tipo: "exemplo",
          titulo: "Netflix",
          texto: "Também utiliza **Scrum**, com destaque para colaboração entre equipes, entrega rápida de melhorias, e atualizações e inovações constantes.",
          detalhe: "colaboração entre equipes; entrega rápida de melhorias; atualizações e inovações constantes"
        },
        {
          tipo: "exemplo",
          titulo: "ThoughtWorks",
          texto: "Utiliza métodos como **Scrum** e **Kanban**. O objetivo apresentado é desenvolver soluções mantendo padrões de qualidade e eficiência."
        },
        {
          tipo: "exemplo",
          titulo: "Representação visual: logotipos de Spotify, Netflix e ThoughtWorks associados aos exemplos de empresas de tecnologia",
          texto: "Os logotipos identificam visualmente as três empresas apresentadas no texto como exemplos de organizações que utilizam métodos ágeis.",
          detalhe: "Página: 11 do PDF. Parte do conteúdo: Empresas de Tecnologia. id: representacao_visual_empresas_tecnologia_agil"
        }
      ]
    },
    {
      id: "empresas_tradicionais",
      titulo: "Empresas tradicionais",
      blocos: [
        {
          tipo: "exemplo",
          titulo: "Banco Itaú",
          texto: "Utiliza **Scrum** em projetos como aplicativos mobile e plataformas digitais. O material relaciona a adoção dos métodos ágeis à aceleração das entregas e à melhoria da experiência do cliente.",
          detalhe: "aplicativos mobile; plataformas digitais"
        },
        {
          tipo: "exemplo",
          titulo: "Volkswagen",
          texto: "Utiliza **Scrum** e **Kanban**, aplicados ao desenvolvimento de software embarcado nos veículos."
        },
        {
          tipo: "exemplo",
          titulo: "Philips",
          texto: "Utiliza métodos ágeis no desenvolvimento de produtos de saúde e eletrodomésticos inteligentes. O material destaca flexibilidade, adaptabilidade e inovação rápida.",
          detalhe: "produtos de saúde; eletrodomésticos inteligentes"
        },
        {
          tipo: "texto",
          texto: "Os logotipos dessas três empresas (Banco Itaú, Volkswagen e Philips) aparecem junto aos respectivos exemplos na página 11 do PDF."
        }
      ]
    },
    {
      id: "startups",
      titulo: "Startups",
      blocos: [
        {
          tipo: "exemplo",
          titulo: "Nubank",
          texto: "É apresentado como referência no uso de métodos ágeis, com foco em experimentação, rápida entrega de produtos e serviços, e adaptação às demandas do mercado financeiro.",
          detalhe: "experimentação; rápida entrega de produtos e serviços; adaptação às demandas do mercado financeiro"
        },
        {
          tipo: "exemplo",
          titulo: "QuintoAndar",
          texto: "Utiliza **Scrum** no desenvolvimento do aplicativo e da plataforma web."
        },
        {
          tipo: "exemplo",
          titulo: "Rappi",
          texto: "Utiliza métodos ágeis para escalar rapidamente suas operações, responder à demanda, adaptar-se às mudanças do mercado e atender às necessidades dos clientes.",
          detalhe: "escalar rapidamente suas operações; responder à demanda; adaptar-se às mudanças do mercado; atender às necessidades dos clientes"
        },
        {
          tipo: "exemplo",
          titulo: "Representação visual: logotipos de Nubank, QuintoAndar e Rappi associados aos exemplos de startups",
          texto: "Os elementos visuais identificam as três startups utilizadas no material como exemplos de adoção de métodos ágeis.",
          detalhe: "Página: 12 do PDF. Parte do conteúdo: Startups. id: representacao_visual_startups_metodos_ageis"
        }
      ]
    },
    {
      id: "instituicoes_governamentais",
      titulo: "Instituições governamentais brasileiras",
      blocos: [
        {
          tipo: "texto",
          texto: "O PDF também apresenta exemplos no setor público."
        },
        {
          tipo: "exemplo",
          titulo: "Ministério da Economia",
          texto: "Adota métodos ágeis em alguns projetos de desenvolvimento de software, buscando maior agilidade e eficiência na entrega de serviços públicos."
        },
        {
          tipo: "exemplo",
          titulo: "Tribunal de Contas da União (TCU)",
          texto: "Utiliza **Scrum** no desenvolvimento de sistemas internos, com foco em qualidade, segurança da informação, eficiência e segurança.",
          detalhe: "qualidade; segurança da informação; eficiência; segurança"
        },
        {
          tipo: "exemplo",
          titulo: "Prefeitura de São Paulo",
          texto: "Aplica métodos ágeis no desenvolvimento de aplicativos mobile e plataformas digitais. O objetivo apresentado é realizar entregas mais rápidas e eficazes de serviços públicos.",
          detalhe: "aplicativos mobile; plataformas digitais"
        },
        {
          tipo: "exemplo",
          titulo: "Universidade Federal do Ceará",
          texto: "O material apresenta um caso específico da UFC: desenvolvimento de uma nova versão do Ambiente Virtual de Aprendizagem **Solar**, utilizando **Scrum**, **Behavior Driven Development (BDD)**, testes unitários e programação em par. O grupo manteve essa filosofia durante criação e manutenção do ambiente entre **2010 e 2016**. Posteriormente, devido a problemas internos e desfalques na equipe, as práticas foram abandonadas.",
          detalhe: "desenvolvimento de uma nova versão do Ambiente Virtual de Aprendizagem Solar; utilização de Scrum; utilização de Behavior Driven Development (BDD); testes unitários; programação em par"
        },
        {
          tipo: "exemplo",
          titulo: "Representação visual: identificação da Universidade Federal do Ceará associada ao exemplo do Solar",
          texto: "O elemento visual identifica a Universidade Federal do Ceará no trecho que apresenta o desenvolvimento do Solar utilizando Scrum, BDD, testes unitários e programação em par.",
          detalhe: "Página: 13 do PDF. Parte do conteúdo: Instituições Governamentais Brasileiras. id: representacao_visual_ufc_solar"
        }
      ]
    },
    {
      id: "scrum_visao_geral",
      titulo: "Scrum",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Scrum** é apresentado como uma metodologia de gerenciamento de projetos de software baseada em ciclos curtos de desenvolvimento chamados **sprints**. Cada sprint normalmente dura **1 a 4 semanas**, possui objetivos específicos, envolve trabalho colaborativo e busca entregar valor ao cliente."
        },
        {
          tipo: "lista",
          titulo: "Características de cada sprint",
          itens: [
            "normalmente dura 1 a 4 semanas",
            "possui objetivos específicos",
            "envolve trabalho colaborativo",
            "busca entregar valor ao cliente"
          ]
        },
        {
          tipo: "destaque",
          texto: "O PDF informa que sprints de **uma semana** são mais utilizadas em desenvolvimentos rápidos de pequenas aplicações, enquanto ciclos de **duas semanas** são os mais comuns."
        }
      ]
    },
    {
      id: "tres_pilares_scrum",
      titulo: "Os três pilares do Scrum",
      blocos: [
        {
          tipo: "texto",
          texto: "O Scrum é baseado em três pilares."
        },
        {
          tipo: "topico",
          titulo: "1. Transparência",
          texto: "As informações do projeto devem estar visíveis para membros da equipe e partes interessadas.",
          lista: [
            "membros da equipe",
            "partes interessadas"
          ]
        },
        {
          tipo: "topico",
          titulo: "2. Inspeção",
          texto: "A equipe revisa regularmente o progresso e identifica pontos que podem ser melhorados."
        },
        {
          tipo: "topico",
          titulo: "3. Adaptação",
          texto: "A equipe modifica sua abordagem com base em feedback e novas informações.",
          lista: [
            "feedback",
            "novas informações"
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Para memorizar"
        },
        {
          tipo: "destaque",
          texto: "Scrum = Transparência + Inspeção + Adaptação."
        }
      ]
    },
    {
      id: "caracteristicas_scrum",
      titulo: "Características do Scrum",
      blocos: [
        {
          tipo: "texto",
          texto: "A divisão do projeto em **sprints curtos** proporciona maior flexibilidade e adaptabilidade."
        },
        {
          tipo: "texto",
          texto: "As reuniões de sprint promovem comunicação e colaboração entre equipe, Product Owner e stakeholders. Além disso, os papéis são definidos para facilitar a distribuição das responsabilidades."
        },
        {
          tipo: "lista",
          titulo: "Envolvidos nas reuniões de sprint",
          itens: [
            "equipe",
            "Product Owner",
            "stakeholders"
          ]
        }
      ]
    },
    {
      id: "atores_chave_scrum",
      titulo: "Atores-chave do Scrum",
      blocos: [
        {
          tipo: "exemplo",
          titulo: "Representação visual: atores-chave do Scrum",
          texto: "A representação apresenta quatro participantes/papéis ligados ao projeto: Product Owner, Scrum Master, Time de Desenvolvimento e Stakeholders.",
          detalhe: "Página: 14 do PDF. Parte do conteúdo: Características do Scrum — Atores-chave. id: representacao_visual_atores_chave_scrum"
        },
        {
          tipo: "topico",
          titulo: "Product Owner (PO)",
          texto: "É a **\"voz\" do cliente** no projeto.",
          lista: [
            "definir a visão do produto",
            "priorizar itens do backlog",
            "garantir que o produto atenda às necessidades dos usuários"
          ]
        },
        {
          tipo: "topico",
          titulo: "Scrum Master (SM)",
          texto: "É o **guardião do processo Scrum**.",
          lista: [
            "facilitar a implementação da metodologia",
            "remover obstáculos para a equipe",
            "garantir que princípios e valores do Scrum sejam seguidos"
          ]
        },
        {
          tipo: "topico",
          titulo: "Time de Desenvolvimento",
          texto: "É apresentado como a **força motriz do projeto**. Pode ser composto por desenvolvedores, testadores e outros profissionais. Sua responsabilidade é transformar ideias em um produto funcional e de alta qualidade.",
          lista: [
            "desenvolvedores",
            "testadores",
            "outros profissionais"
          ]
        },
        {
          tipo: "topico",
          titulo: "Stakeholders",
          texto: "São as **partes interessadas no projeto**.",
          lista: [
            "clientes",
            "gerentes",
            "investidores",
            "outras pessoas interessadas no sucesso do projeto"
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Decore esta diferença"
        },
        {
          tipo: "tabela",
          titulo: "Papéis e principais responsabilidades",
          colunas: ["Papel", "Principal responsabilidade"],
          linhas: [
            ["Product Owner", "Visão do produto e priorização do backlog"],
            ["Scrum Master", "Facilitar Scrum e remover obstáculos"],
            ["Time de Desenvolvimento", "Transformar ideias em produto"],
            ["Stakeholders", "Pessoas interessadas no sucesso do projeto"]
          ]
        }
      ]
    },
    {
      id: "artefatos_scrum_sprint_backlog",
      titulo: "Artefatos do Scrum — Sprint Backlog",
      blocos: [
        {
          tipo: "texto",
          texto: "O PDF destaca dois artefatos: **Sprint Backlog** e **Burndown Chart**. Eles fornecem visibilidade sobre o progresso do projeto."
        },
        {
          tipo: "texto",
          texto: "O **Sprint Backlog** apresenta o fluxo de desenvolvimento das funcionalidades selecionadas para uma sprint. O material apresenta um exemplo utilizando um quadro com post-its."
        },
        {
          tipo: "texto",
          texto: "As funcionalidades podem passar por três estados: `To-Do` → `Doing` → `Done`."
        },
        {
          tipo: "topico",
          titulo: "To-Do",
          texto: "Funcionalidades que ainda precisam ser feitas."
        },
        {
          tipo: "topico",
          titulo: "Doing",
          texto: "Funcionalidades que estão sendo desenvolvidas."
        },
        {
          tipo: "topico",
          titulo: "Done",
          texto: "Funcionalidades concluídas e devidamente testadas."
        },
        {
          tipo: "exemplo",
          titulo: "Figura 1 — Exemplo de um Sprint Backlog utilizando um quadro branco e post-its",
          texto: "A figura apresenta um quadro físico dividido em colunas de trabalho, com post-its distribuídos conforme o estado das tarefas. Visualmente, o quadro demonstra o fluxo das funcionalidades durante a sprint, desde tarefas ainda não iniciadas até tarefas em andamento, em teste e concluídas.",
          detalhe: "Página: 15 do PDF. Parte do conteúdo: Artefatos Scrum — Sprint Backlog. id: figura_1_exemplo_sprint_backlog"
        }
      ]
    },
    {
      id: "burndown_chart",
      titulo: "Burndown Chart",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Burndown Chart** é uma ferramenta gráfica utilizada para visualizar o **trabalho restante ao longo do tempo**. Ele permite acompanhar o progresso da equipe, verificar a relação com os objetivos, identificar problemas e identificar atrasos de forma proativa."
        },
        {
          tipo: "lista",
          titulo: "O que o Burndown Chart permite",
          itens: [
            "acompanhar o progresso da equipe",
            "verificar a relação com os objetivos",
            "identificar problemas",
            "identificar atrasos de forma proativa"
          ]
        },
        {
          tipo: "topico",
          titulo: "Eixos",
          texto: "Normalmente: eixo X representa iterações ou sprints; eixo Y representa esforço a ser realizado, expresso em **pontos de complexidade**. A complexidade é determinada de acordo com a experiência do time no desenvolvimento daquela funcionalidade: funcionalidade muito complicada recebe pontuação alta; funcionalidade simples recebe pontuação baixa."
        },
        {
          tipo: "topico",
          titulo: "Linha de Trabalho Restante Ideal",
          texto: "É uma linha reta que começa no eixo Y com o total de pontos da sprint e termina no eixo X na posição correspondente à última iteração. Ela representa a evolução **ideal** do trabalho restante."
        },
        {
          tipo: "topico",
          titulo: "Linha de Trabalho Restante Real",
          texto: "A equipe seleciona requisitos em cada iteração e atribui seus pontos de complexidade. O somatório desses pontos é colocado no gráfico. Ao conectar esses pontos, forma-se a **Linha de Trabalho Restante Real**."
        },
        {
          tipo: "topico",
          titulo: "Interpretação",
          texto: "Se a linha real permanecer **abaixo da linha ideal**, o material indica que a equipe está trabalhando em um bom ritmo e deverá cumprir o cronograma. Caso contrário, a equipe precisará melhorar seu ritmo ou rever o planejamento de tempo do projeto."
        },
        {
          tipo: "topico",
          titulo: "Burndown dentro de uma sprint",
          texto: "O gráfico também pode acompanhar o progresso **dentro de uma única sprint**. Nesse caso, X representa os dias da sprint e Y representa os pontos de complexidade. A linha ideal começa a partir do número total de pontos do Sprint Backlog. A linha real representa a evolução diária dos pontos restantes."
        },
        {
          tipo: "exemplo",
          titulo: "Figura 2 — Exemplo de um Burndown Chart",
          texto: "O gráfico apresenta no eixo X os dias da sprint, de 1 a 10, e no eixo Y os pontos de história restantes no Sprint Backlog. Há uma linha ideal descendente e uma linha real representando a evolução observada dos pontos restantes. Ambas chegam a aproximadamente zero no décimo dia.",
          detalhe: "Página: 16 do PDF. Parte do conteúdo: Artefatos Scrum — Burndown Chart. id: figura_2_exemplo_burndown_chart"
        },
        {
          tipo: "subtitulo",
          texto: "Ponto importante para prova"
        },
        {
          tipo: "destaque",
          texto: "Burndown Chart = trabalho restante ao longo do tempo. Não confundir com uma representação do trabalho já realizado: o eixo vertical apresentado pelo material representa o trabalho/pontos que ainda permanecem."
        }
      ]
    },
    {
      id: "ferramentas_apoio_sprint_backlog",
      titulo: "Ferramentas de apoio ao Sprint Backlog",
      blocos: [
        {
          tipo: "texto",
          texto: "O material menciona softwares que podem ser utilizados para criação e compartilhamento do Sprint Backlog."
        },
        {
          tipo: "lista",
          titulo: "Softwares mencionados",
          itens: [
            "Pivotal Tracker",
            "Trello",
            "Jira"
          ]
        },
        {
          tipo: "texto",
          texto: "Apesar disso, o PDF destaca que a prática de utilizar **quadros físicos e interação presencial** é incentivada no Scrum para fortalecer colaboração, companheirismo e responsabilidade entre os membros da equipe."
        },
        {
          tipo: "lista",
          titulo: "O que os quadros físicos e a interação presencial fortalecem",
          itens: [
            "colaboração",
            "companheirismo",
            "responsabilidade entre os membros da equipe"
          ]
        }
      ]
    },
    {
      id: "experiencia_adocao_metodos_ageis",
      titulo: "Experiência de adoção de Métodos Ágeis",
      blocos: [
        {
          tipo: "texto",
          texto: "O PDF apresenta um relato de experiência de adoção de Scrum em uma universidade federal. Inicialmente, a equipe utilizava quadros brancos e post-its. Depois, passou a utilizar o **Pivotal Tracker** para apoiar a gestão dos projetos."
        },
        {
          tipo: "texto",
          texto: "Mesmo com a utilização de software, as reuniões presenciais continuaram sendo consideradas importantes para discussões **face a face**."
        },
        {
          tipo: "lista",
          titulo: "Pontos destacados no relato",
          itens: [
            "valorização da equipe",
            "redução do estresse",
            "harmonia interna",
            "responsabilidade pelas tarefas",
            "busca por técnicas e tecnologias que aumentem a produtividade sem manter a equipe sob estresse constante"
          ]
        }
      ]
    },
    {
      id: "papel_po_relato",
      titulo: "Papel do Product Owner no relato",
      blocos: [
        {
          tipo: "texto",
          texto: "No caso relatado, uma das pessoas assumiu a função de **Product Owner**. Para isso, passou a trabalhar com gerenciamento de backlog, priorização de tarefas, Sprint Planning, User Stories, Sprint Review e técnicas ágeis para definição de requisitos."
        },
        {
          tipo: "lista",
          titulo: "Atividades assumidas pelo Product Owner no relato",
          itens: [
            "gerenciamento de backlog",
            "priorização de tarefas",
            "Sprint Planning",
            "User Stories",
            "Sprint Review",
            "técnicas ágeis para definição de requisitos"
          ]
        },
        {
          tipo: "destaque",
          texto: "O material destaca que a adoção dos métodos ágeis exige tempo, esforço e investimento, não sendo uma mudança que necessariamente ocorre em apenas um ano."
        }
      ]
    },
    {
      id: "equipe_auto_organizada",
      titulo: "Equipe auto-organizada e valorização humana",
      blocos: [
        {
          tipo: "texto",
          texto: "Um dos pontos enfatizados no relato é que o time deve ocupar uma posição central na produção. O material afirma que ninguém sabe melhor quanto pode produzir em uma sprint do que o próprio time que trabalhará nela."
        },
        {
          tipo: "lista",
          titulo: "O que a gerência deve fazer",
          itens: [
            "ouvir a equipe",
            "discutir sugestões",
            "considerar suas dificuldades",
            "dar espaço para participação"
          ]
        },
        {
          tipo: "texto",
          texto: "O primeiro passo para adoção dos métodos ágeis em uma empresa é apresentado como a necessidade de convencer a cadeia de comando de que esses métodos funcionam e de que a busca por **equipes auto-organizáveis** é essencial."
        },
        {
          tipo: "texto",
          texto: "O texto também defende que gestores e diretores precisam compreender o processo de desenvolvimento e conversar com as equipes, em vez de enxergar as pessoas apenas como \"recursos\"."
        },
        {
          tipo: "destaque",
          texto: "Isso está diretamente relacionado ao valor do Manifesto Ágil: \"Indivíduos e interações mais do que processos e ferramentas.\""
        }
      ]
    },
    {
      id: "reunioes_scrum",
      titulo: "Reuniões do Scrum",
      blocos: [
        {
          tipo: "texto",
          texto: "O PDF apresenta quatro reuniões principais."
        },
        {
          tipo: "topico",
          titulo: "Scrum Daily",
          texto: "É uma conversa aberta e colaborativa na qual cada membro compartilha avanços, obstáculos e planos para o dia. O **Scrum Master** facilita a discussão.",
          lista: [
            "avanços",
            "obstáculos",
            "planos para o dia"
          ]
        },
        {
          tipo: "topico",
          titulo: "Sprint Planning",
          texto: "Participam Product Owner, Scrum Master e equipe de desenvolvimento. Os objetivos são definir o escopo da sprint, definir prioridades, analisar o backlog, estimar esforço e estabelecer os objetivos da sprint.",
          lista: [
            "definir o escopo da sprint",
            "definir prioridades",
            "analisar o backlog",
            "estimar esforço",
            "estabelecer os objetivos da sprint"
          ]
        },
        {
          tipo: "topico",
          titulo: "Sprint Review",
          texto: "Serve para apresentar o que foi realizado e receber feedback dos stakeholders. O Product Owner valida o trabalho e os stakeholders podem sugerir melhorias e novas ideias.",
          lista: [
            "apresentar o que foi realizado",
            "receber feedback dos stakeholders"
          ]
        },
        {
          tipo: "topico",
          titulo: "Sprint Retrospective",
          texto: "É um momento de aprendizado e melhoria. A equipe reflete sobre o que deu certo, o que deu errado e como melhorar no próximo sprint.",
          lista: [
            "o que deu certo",
            "o que deu errado",
            "como melhorar no próximo sprint"
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Memorize a sequência"
        },
        {
          tipo: "destaque",
          texto: "Planning → desenvolvimento da Sprint → Review → Retrospective."
        },
        {
          tipo: "tabela",
          titulo: "Função principal de cada reunião",
          colunas: ["Reunião", "Ideia principal"],
          linhas: [
            ["Daily", "Acompanhar avanços, obstáculos e planos"],
            ["Planning", "Planejar a sprint"],
            ["Review", "Apresentar o resultado e receber feedback"],
            ["Retrospective", "Refletir e melhorar o processo"]
          ]
        }
      ]
    },
    {
      id: "extreme_programming_xp",
      titulo: "Extreme Programming — XP",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Extreme Programming (XP)**, ou Programação Extrema, surgiu em meados da década de 1990 como resposta à necessidade de maior agilidade e adaptabilidade no desenvolvimento de software. Foi idealizado por **Kent Beck e sua equipe** durante o projeto **C3 (Chrysler Comprehensive Compensation System)**."
        }
      ]
    },
    {
      id: "cinco_valores_xp",
      titulo: "Os cinco valores do XP",
      blocos: [
        {
          tipo: "texto",
          texto: "O XP possui cinco valores fundamentais."
        },
        {
          tipo: "topico",
          titulo: "1. Comunicação",
          texto: "É a base para um trabalho colaborativo e eficiente."
        },
        {
          tipo: "topico",
          titulo: "2. Simplicidade",
          texto: "Busca soluções descomplicadas e fáceis de entender.",
          lista: [
            "descomplicadas",
            "fáceis de entender"
          ]
        },
        {
          tipo: "topico",
          titulo: "3. Feedback",
          texto: "Busca obter e fornecer informações constantemente para melhorar o processo."
        },
        {
          tipo: "topico",
          titulo: "4. Coragem",
          texto: "Relacionada a experimentar novas ideias e enfrentar desafios.",
          lista: [
            "experimentar novas ideias",
            "enfrentar desafios"
          ]
        },
        {
          tipo: "topico",
          titulo: "5. Respeito",
          texto: "Valoriza habilidades, opiniões e participação dos membros da equipe.",
          lista: [
            "habilidades",
            "opiniões",
            "participação dos membros da equipe"
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Para memorizar"
        },
        {
          tipo: "destaque",
          texto: "XP = Comunicação + Simplicidade + Feedback + Coragem + Respeito."
        }
      ]
    },
    {
      id: "praticas_xp",
      titulo: "Práticas do Extreme Programming",
      blocos: [
        {
          tipo: "topico",
          titulo: "Ciclos de desenvolvimento curtos",
          texto: "O projeto é dividido em pequenas iterações. Isso possibilita entregas frequentes, feedback contínuo e ajustes rápidos.",
          lista: [
            "entregas frequentes",
            "feedback contínuo",
            "ajustes rápidos"
          ]
        },
        {
          tipo: "topico",
          titulo: "Programação em pares",
          texto: "Dois programadores trabalham juntos na mesma estação de trabalho. O material relaciona a prática à colaboração, revisão do código em tempo real, aumento da qualidade e resolução de problemas.",
          lista: [
            "colaboração",
            "revisão do código em tempo real",
            "aumento da qualidade",
            "resolução de problemas"
          ]
        },
        {
          tipo: "topico",
          titulo: "Testes unitários",
          texto: "São testes automatizados destinados a garantir a qualidade do código, prevenir falhas e verificar cada parte do software isoladamente.",
          lista: [
            "garantir a qualidade do código",
            "prevenir falhas",
            "verificar cada parte do software isoladamente"
          ]
        },
        {
          tipo: "topico",
          titulo: "Refatoração",
          texto: "Consiste em reorganizar o código existente para torná-lo mais limpo, mais eficiente e mais fácil de manter. A refatoração contínua ajuda a manter integridade e extensibilidade do software.",
          lista: [
            "mais limpo",
            "mais eficiente",
            "mais fácil de manter"
          ]
        },
        {
          tipo: "topico",
          titulo: "Integração contínua",
          texto: "Consiste em integrar frequentemente as mudanças do código à base principal. Isso permite detectar problemas precocemente, reduzir riscos de integração tardia e manter o software em estado funcional.",
          lista: [
            "detectar problemas precocemente",
            "reduzir riscos de integração tardia",
            "manter o software em estado funcional"
          ]
        },
        {
          tipo: "topico",
          titulo: "Metáfora da Sala de Reuniões",
          texto: "É apresentada como um espaço aberto para comunicação, colaboração entre equipe e cliente, transparência e integração.",
          lista: [
            "comunicação",
            "colaboração entre equipe e cliente",
            "transparência",
            "integração"
          ]
        },
        {
          tipo: "topico",
          titulo: "Histórias de Usuário",
          texto: "Descrevem as funcionalidades do software a partir da **perspectiva do usuário**. Seu objetivo é manter o foco nas necessidades do usuário e no valor entregue ao cliente."
        },
        {
          tipo: "topico",
          titulo: "Planejamento em Tempo Real",
          texto: "Adapta o planejamento às mudanças do projeto e prioridades do cliente.",
          lista: [
            "mudanças do projeto",
            "prioridades do cliente"
          ]
        },
        {
          tipo: "topico",
          titulo: "Liberação de software com frequência",
          texto: "Consiste em entregar versões funcionais regularmente ao cliente. Isso permite feedback, solicitação de alterações e participação contínua do cliente.",
          lista: [
            "feedback",
            "solicitação de alterações",
            "participação contínua do cliente"
          ]
        }
      ]
    },
    {
      id: "vantagens_implementacao_xp",
      titulo: "Vantagens e implementação do XP",
      blocos: [
        {
          tipo: "texto",
          texto: "O material afirma que, embora o XP seja frequentemente associado a projetos grandes, seus princípios podem ser adaptados a diferentes contextos e diferentes tamanhos de equipe."
        },
        {
          tipo: "texto",
          texto: "O PDF cita **Google, Spotify e ThoughtWorks** como empresas que adotaram XP e são apresentadas como tendo obtido maior agilidade, melhoria da qualidade do software e equipes mais engajadas."
        },
        {
          tipo: "lista",
          titulo: "Resultados obtidos pelas empresas citadas",
          itens: [
            "maior agilidade",
            "melhoria da qualidade do software",
            "equipes mais engajadas"
          ]
        },
        {
          tipo: "texto",
          texto: "O sucesso do XP é relacionado à sua capacidade de promover flexibilidade, adaptabilidade, foco no cliente, comunicação, feedback e desenvolvimento contínuo."
        },
        {
          tipo: "lista",
          titulo: "Capacidades relacionadas ao sucesso do XP",
          itens: [
            "flexibilidade",
            "adaptabilidade",
            "foco no cliente",
            "comunicação",
            "feedback",
            "desenvolvimento contínuo"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Representação visual: equipe trabalhando diante de um quadro dividido em \"To do\", \"Doing\" e \"Done\"",
          texto: "A ilustração mostra duas pessoas trabalhando juntas diante de um quadro organizado em estados de tarefas. A representação reforça visualmente a ideia de colaboração e organização do trabalho apresentada no trecho sobre o sucesso do XP.",
          detalhe: "Página: 23 do PDF. Parte do conteúdo: Vantagens e implementações do XP. id: representacao_visual_equipe_xp_quadro_tarefas"
        }
      ]
    },
    {
      id: "scrum_vs_xp",
      titulo: "Scrum × Extreme Programming",
      blocos: [
        {
          tipo: "texto",
          texto: "O PDF apresenta uma comparação direta entre Scrum e XP. Antes do quadro, o material destaca que **XP** é considerado adequado para projetos que exigem alta qualidade de software e adaptação frequente, enquanto **Scrum** é apresentado como mais adequado para projetos com requisitos bem definidos e necessidade de entregas em prazos fixos."
        },
        {
          tipo: "texto",
          texto: "O Scrum possui uma abordagem gerencial mais estruturada, enquanto o XP mergulha mais diretamente nas práticas de engenharia de software."
        },
        {
          tipo: "exemplo",
          titulo: "Quadro 2 — Comparativo entre Métodos XP e Scrum",
          texto: "O quadro compara XP e Scrum em cinco critérios: foco, planejamento, ciclos de desenvolvimento, métricas e reuniões.",
          detalhe: "Página: 24 do PDF. Parte do conteúdo: Comparativo entre Scrum e Extreme Programming. id: quadro_2_comparativo_xp_scrum"
        },
        {
          tipo: "tabela",
          titulo: "Quadro 2 — Comparativo entre Métodos XP e Scrum",
          colunas: ["Critério", "XP", "Scrum"],
          linhas: [
            ["Foco", "Engenharia de software, práticas técnicas rigorosas, qualidade do código e produto robusto", "Visão mais gerencial, organização do fluxo em sprints e definição de papéis"],
            ["Planejamento", "Adaptativo, ajustando prioridades e escopo conforme feedback e necessidades do cliente", "Backlog priorizado e definição das funcionalidades no início da sprint, com pouca flexibilidade para alterações durante o ciclo"],
            ["Ciclos de desenvolvimento", "Ciclos curtos com entregas frequentes de versões funcionais", "Sprints de duração fixa, geralmente de 1 a 4 semanas"],
            ["Métricas", "Velocidade de desenvolvimento, testes unitários e cobertura de código", "Velocidade de entrega, Burndown Chart e impedimentos"],
            ["Reuniões", "Frequentes e informais, como stand-up e planejamento diário", "Reuniões cerimoniais como Sprint Planning, Sprint Review e Sprint Retrospective"]
          ]
        }
      ]
    },
    {
      id: "diferenca_essencial_scrum_xp",
      titulo: "Diferença essencial entre Scrum e XP",
      blocos: [
        {
          tipo: "texto",
          texto: "Uma forma de organizar o conteúdo do próprio PDF para revisão é separar os dois métodos pela sua ênfase principal."
        },
        {
          tipo: "topico",
          titulo: "Scrum — Ênfase gerencial e organizacional",
          lista: [
            "sprints",
            "Product Owner",
            "Scrum Master",
            "backlog",
            "Sprint Planning",
            "Sprint Review",
            "Sprint Retrospective",
            "Burndown Chart",
            "organização e comunicação"
          ]
        },
        {
          tipo: "topico",
          titulo: "XP — Ênfase técnica e engenharia de software",
          lista: [
            "programação em pares",
            "testes unitários",
            "refatoração",
            "integração contínua",
            "ciclos curtos",
            "histórias de usuário",
            "liberações frequentes",
            "qualidade do código"
          ]
        }
      ]
    },
    {
      id: "pair_programming",
      titulo: "Pair Programming / Programação em Pares",
      blocos: [
        {
          tipo: "texto",
          texto: "Nas considerações finais, o PDF retoma a **Programação em Pares**. Dois programadores trabalham na mesma estação: um escreve o código (**driver**), outro revisa cada linha (**observer** ou **navigator**). Os papéis podem ser trocados frequentemente."
        },
        {
          tipo: "lista",
          titulo: "Benefícios associados à prática",
          itens: [
            "colaboração",
            "troca de conhecimento",
            "revisão contínua",
            "maior qualidade",
            "menos bugs",
            "disseminação de conhecimento",
            "maior coesão da equipe",
            "capacidade coletiva para resolver problemas complexos"
          ]
        },
        {
          tipo: "destaque",
          texto: "A Programação em Pares é apresentada como uma das práticas centrais do Extreme Programming."
        }
      ]
    },
    {
      id: "relacao_conceitos",
      titulo: "Relação entre os principais conceitos",
      blocos: [
        {
          tipo: "texto",
          texto: "O conteúdo pode ser organizado mentalmente da seguinte forma: Métodos Ágeis → são iterativos e incrementais → priorizam colaboração, flexibilidade e entrega contínua de valor → têm como base o Manifesto Ágil → Manifesto Ágil possui 4 valores + 12 princípios → diferentes métodos e práticas podem aplicar esses princípios → dois métodos destacados no PDF: Scrum e XP."
        },
        {
          tipo: "topico",
          titulo: "Scrum",
          lista: [
            "gerenciamento",
            "sprints",
            "papéis",
            "reuniões",
            "backlog",
            "acompanhamento do progresso"
          ]
        },
        {
          tipo: "topico",
          titulo: "XP",
          lista: [
            "engenharia de software",
            "qualidade",
            "programação em pares",
            "testes",
            "refatoração",
            "integração contínua",
            "feedback"
          ]
        },
        {
          tipo: "texto",
          texto: "Também aparecem Kanban (visualização do fluxo + limitação do trabalho em progresso), Lean (eliminação de desperdícios + otimização) e DevOps (integração entre desenvolvimento e operações + entrega mais rápida e confiável)."
        }
      ]
    },
    {
      id: "pontos_atencao_prova",
      titulo: "Pontos que merecem atenção para a prova",
      blocos: [
        {
          tipo: "subtitulo",
          texto: "Manifesto Ágil"
        },
        {
          tipo: "destaque",
          texto: "Memorize os 4 valores: 1. Indivíduos e interações > processos e ferramentas. 2. Software em funcionamento > documentação abrangente. 3. Colaboração com o cliente > negociação de contratos. 4. Responder a mudanças > seguir um plano."
        },
        {
          tipo: "subtitulo",
          texto: "Scrum"
        },
        {
          tipo: "topico",
          titulo: "3 pilares",
          lista: [
            "Transparência",
            "Inspeção",
            "Adaptação"
          ]
        },
        {
          tipo: "topico",
          titulo: "Principais papéis",
          lista: [
            "Product Owner",
            "Scrum Master",
            "Time de Desenvolvimento",
            "Stakeholders"
          ]
        },
        {
          tipo: "topico",
          titulo: "Sprint",
          lista: [
            "ciclo curto",
            "geralmente 1–4 semanas",
            "objetivos específicos",
            "entrega de valor"
          ]
        },
        {
          tipo: "topico",
          titulo: "Artefatos destacados",
          lista: [
            "Sprint Backlog",
            "Burndown Chart"
          ]
        },
        {
          tipo: "topico",
          titulo: "Reuniões",
          lista: [
            "Daily",
            "Sprint Planning",
            "Sprint Review",
            "Sprint Retrospective"
          ]
        },
        {
          tipo: "subtitulo",
          texto: "XP"
        },
        {
          tipo: "topico",
          titulo: "5 valores",
          lista: [
            "Comunicação",
            "Simplicidade",
            "Feedback",
            "Coragem",
            "Respeito"
          ]
        },
        {
          tipo: "topico",
          titulo: "Principais práticas",
          lista: [
            "ciclos curtos",
            "programação em pares",
            "testes unitários",
            "refatoração",
            "integração contínua",
            "metáfora da sala de reuniões",
            "histórias de usuário",
            "planejamento em tempo real",
            "liberação frequente de software"
          ]
        }
      ]
    },
    {
      id: "resumo_final",
      titulo: "Resumo final para revisão rápida",
      blocos: [
        {
          tipo: "topico",
          titulo: "Métodos Ágeis",
          lista: [
            "São iterativos e incrementais.",
            "Priorizam colaboração, flexibilidade e entrega contínua de valor.",
            "Permitem adaptação frequente às mudanças.",
            "O cliente participa continuamente do processo."
          ]
        },
        {
          tipo: "topico",
          titulo: "Manifesto Ágil",
          lista: [
            "Criado em 2001.",
            "Possui 4 valores e 12 princípios.",
            "Valoriza pessoas, software funcional, colaboração e adaptação."
          ]
        },
        {
          tipo: "topico",
          titulo: "Métodos tradicionais × ágeis",
          lista: [
            "Tradicionais → maior rigidez, planejamento inicial extensivo, mudanças mais difíceis e entrega ao final.",
            "Ágeis → maior flexibilidade, planejamento adaptável, mudanças mais facilmente acomodadas e entregas frequentes."
          ]
        },
        {
          tipo: "topico",
          titulo: "Scrum",
          lista: [
            "Foco apresentado como mais gerencial.",
            "Trabalha com sprints.",
            "Sprint geralmente dura 1 a 4 semanas.",
            "Três pilares: transparência, inspeção e adaptação.",
            "PO → visão e priorização.",
            "SM → processo e remoção de obstáculos.",
            "Time → desenvolvimento do produto.",
            "Stakeholders → partes interessadas.",
            "Sprint Backlog → funcionalidades da sprint e seu fluxo.",
            "Burndown Chart → trabalho restante ao longo do tempo."
          ]
        },
        {
          tipo: "topico",
          titulo: "XP",
          lista: [
            "Surgiu em meados dos anos 1990.",
            "Associado a Kent Beck e sua equipe.",
            "Cinco valores: comunicação, simplicidade, feedback, coragem e respeito.",
            "Forte ênfase em práticas técnicas.",
            "Práticas importantes: programação em pares, testes unitários, refatoração, integração contínua, histórias de usuário e liberações frequentes."
          ]
        },
        {
          tipo: "destaque",
          texto: "Scrum → organização e gerenciamento. XP → práticas técnicas e qualidade do software."
        },
        {
          tipo: "topico",
          titulo: "Outros conceitos",
          lista: [
            "Kanban: visualização do fluxo e limitação do trabalho em progresso.",
            "Lean: eliminação de desperdícios e otimização.",
            "DevOps: integração entre desenvolvimento e operações.",
            "Pair Programming: dois programadores trabalhando juntos, com alternância entre quem escreve e quem revisa."
          ]
        },
        {
          tipo: "texto",
          texto: "O material conclui destacando que a agilidade permite adaptação rápida às mudanças, colaboração próxima com clientes, entrega contínua de valor, melhoria da eficiência e melhor organização das equipes."
        }
      ]
    }
  ]
  },
  //aula 5
  {
  aula: "Análise de Requisitos",
  ideia_central: "A Análise de Requisitos é uma etapa fundamental do desenvolvimento de software que parte da elicitação das necessidades dos stakeholders e, por meio da análise, organiza essas necessidades em requisitos funcionais (o que o sistema faz) e requisitos não funcionais (as características e qualidades que o sistema deve possuir), utilizando técnicas como User Stories e critérios de aceitação para garantir clareza, priorização e sucesso do projeto.",
  secoes: [
    {
      id: "visao_geral",
      titulo: "Visão geral do conteúdo",
      blocos: [
        {
          tipo: "texto",
          texto: "A **Análise de Requisitos** é apresentada no PDF como uma etapa fundamental para o sucesso de um projeto de software."
        },
        {
          tipo: "texto",
          texto: "Os requisitos representam as **expectativas e necessidades dos stakeholders** — pessoas que possuem interesse no sistema."
        },
        {
          tipo: "lista",
          titulo: "Exemplos de stakeholders",
          itens: [
            "usuários",
            "clientes",
            "desenvolvedores",
            "gestores",
            "outras partes envolvidas"
          ]
        },
        {
          tipo: "texto",
          texto: "O módulo aborda principalmente três frentes de conteúdo."
        },
        {
          tipo: "lista",
          itens: [
            "Elicitação e análise de requisitos",
            "Requisitos funcionais",
            "Requisitos não funcionais"
          ]
        },
        {
          tipo: "destaque",
          texto: "A relação entre esses assuntos é: Necessidades dos stakeholders → Elicitação → Análise → Organização e priorização → Requisitos funcionais e não funcionais → Desenvolvimento do sistema."
        },
        {
          tipo: "texto",
          texto: "O PDF destaca que requisitos bem definidos ajudam a alcançar diversos benefícios para o projeto."
        },
        {
          tipo: "lista",
          itens: [
            "reduzir retrabalho",
            "reduzir custos",
            "melhorar a qualidade",
            "aumentar a satisfação dos clientes",
            "melhorar comunicação e colaboração",
            "tornar o desenvolvimento mais ágil e eficiente"
          ]
        }
      ]
    },
    {
      id: "elicitacao_e_analise",
      titulo: "Elicitação e análise de requisitos",
      blocos: [
        {
          tipo: "topico",
          titulo: "O que é elicitação de requisitos?",
          texto: "A **elicitação** é o processo de **descobrir, ouvir e compreender os requisitos das partes interessadas**."
        },
        {
          tipo: "texto",
          texto: "Seu objetivo é identificar necessidades, desejos, expectativas e informações necessárias para definir o que o software deverá realizar."
        },
        {
          tipo: "lista",
          titulo: "O que a elicitação busca identificar",
          itens: [
            "necessidades",
            "desejos",
            "expectativas",
            "informações necessárias para definir o que o software deverá realizar"
          ]
        },
        {
          tipo: "lista",
          titulo: "Técnicas de elicitação apresentadas no PDF",
          itens: [
            "entrevistas",
            "questionários",
            "workshops",
            "observação"
          ]
        },
        {
          tipo: "topico",
          titulo: "Entrevistas",
          texto: "Consistem em conversas individuais com stakeholders para coletar informações em profundidade."
        },
        {
          tipo: "topico",
          titulo: "Questionários",
          texto: "Permitem coletar dados de um grupo maior de stakeholders de maneira estruturada."
        },
        {
          tipo: "topico",
          titulo: "Workshops",
          texto: "São sessões colaborativas utilizadas para discutir e refinar requisitos com a equipe."
        },
        {
          tipo: "topico",
          titulo: "Observação",
          texto: "É utilizada para compreender as necessidades a partir da observação das atividades relacionadas ao sistema."
        },
        {
          tipo: "subtitulo",
          texto: "O que acontece depois da elicitação?"
        },
        {
          tipo: "texto",
          texto: "Depois que os requisitos são coletados, eles ainda estão em uma forma **bruta**."
        },
        {
          tipo: "texto",
          texto: "A etapa de **análise de requisitos** serve para refinar as informações, organizar os dados, estruturar os requisitos, cruzar informações, identificar inconsistências, priorizar necessidades e definir funcionalidades essenciais."
        },
        {
          tipo: "lista",
          titulo: "Para que serve a análise de requisitos",
          itens: [
            "refinar as informações",
            "organizar os dados",
            "estruturar os requisitos",
            "cruzar informações",
            "identificar inconsistências",
            "priorizar necessidades",
            "definir funcionalidades essenciais"
          ]
        },
        {
          tipo: "destaque",
          texto: "Elicitação = descobrir/coletar. Análise = organizar, refinar, verificar e priorizar. Essa diferença é muito importante."
        }
      ]
    },
    {
      id: "tipos_de_requisitos",
      titulo: "Dois grandes tipos de requisitos",
      blocos: [
        {
          tipo: "texto",
          texto: "O PDF divide os requisitos em duas categorias principais: requisitos funcionais e requisitos não funcionais."
        },
        {
          tipo: "topico",
          titulo: "Requisitos funcionais",
          texto: "Definem **o que o software deve fazer**. Relacionam-se às funcionalidades, operações e interações do sistema com o usuário.",
          lista: [
            "funcionalidades",
            "operações",
            "interações do sistema com o usuário"
          ]
        },
        {
          tipo: "topico",
          titulo: "Requisitos não funcionais",
          texto: "Descrevem **as características que o software deve possuir**. O material apresenta exemplos como desempenho, segurança, usabilidade, confiabilidade e escalabilidade.",
          lista: [
            "desempenho",
            "segurança",
            "usabilidade",
            "confiabilidade",
            "escalabilidade"
          ]
        },
        {
          tipo: "imagem",
          src: "representacao_visual_requisitos_funcionais_nao_funcionais.png",
          pasta: "imagens_analise_de_requisitos/aula_5",
          alt: "Comparação entre requisitos funcionais e requisitos não funcionais: de um lado os requisitos funcionais associados ao que o software deve fazer, às funcionalidades e à interação com o usuário; do outro os requisitos não funcionais associados às características do software, como performance, segurança, usabilidade, confiabilidade e escalabilidade. (Página 6 do PDF)",
          num: 1
        }
      ]
    },
    {
      id: "ferramentas_elicitacao_analise",
      titulo: "Ferramentas utilizadas na elicitação e análise",
      blocos: [
        {
          tipo: "texto",
          texto: "O PDF apresenta seis técnicas/ferramentas principais utilizadas na elicitação e análise de requisitos."
        },
        {
          tipo: "tabela",
          titulo: "Técnicas/Ferramentas de elicitação e análise",
          colunas: ["Técnica/Ferramenta", "Função apresentada no PDF"],
          linhas: [
            ["Entrevistas", "Conversas individuais ou em grupo para coletar informações detalhadas"],
            ["Questionários", "Coleta estruturada de dados de um grupo maior de stakeholders"],
            ["Workshops", "Sessões colaborativas para discutir e refinar requisitos"],
            ["Diagrama de Casos de Uso", "Representação visual das interações entre usuários e sistema"],
            ["Protótipos", "Modelos interativos para visualizar e validar requisitos"],
            ["Ferramentas CASE", "Softwares especializados para gerenciamento e documentação de requisitos"]
          ]
        }
      ]
    },
    {
      id: "beneficios_elicitacao_analise",
      titulo: "Benefícios de uma boa elicitação e análise",
      blocos: [
        {
          tipo: "texto",
          texto: "Investir corretamente nessas etapas proporciona diversos benefícios ao projeto."
        },
        {
          tipo: "topico",
          titulo: "Redução de retrabalho e custos",
          texto: "Evita desenvolver funcionalidades desnecessárias ou que não atendem às expectativas dos usuários."
        },
        {
          tipo: "topico",
          titulo: "Melhoria da qualidade",
          texto: "O software tende a atender melhor às necessidades reais dos usuários, apresentando menos bugs e falhas."
        },
        {
          tipo: "topico",
          titulo: "Maior satisfação do cliente",
          texto: "O sistema entrega valor real e atende melhor às expectativas."
        },
        {
          tipo: "topico",
          titulo: "Melhor comunicação e colaboração",
          texto: "Todos os envolvidos passam a ter um entendimento mais claro dos requisitos."
        },
        {
          tipo: "topico",
          titulo: "Maior agilidade",
          texto: "O desenvolvimento pode ser mais rápido e eficiente quando está focado nas necessidades reais dos usuários."
        }
      ]
    },
    {
      id: "exemplo_gerenciamento_projetos",
      titulo: "Exemplo: Sistema de Gerenciamento de Projetos",
      blocos: [
        {
          tipo: "texto",
          texto: "O PDF apresenta um exemplo de elicitação e análise para um **Sistema de Gerenciamento de Projetos**."
        },
        {
          tipo: "exemplo",
          titulo: "Elicitação",
          texto: "Por meio de entrevistas com gerentes de projeto, foram identificadas necessidades como criar, editar e excluir projetos; atribuir tarefas aos membros da equipe; definir prazos; acompanhar o progresso das tarefas; e gerar relatórios de status do projeto.",
          detalhe: "Necessidades identificadas: criar, editar e excluir projetos; atribuir tarefas aos membros da equipe; definir prazos; acompanhar o progresso das tarefas; gerar relatórios de status do projeto."
        },
        {
          tipo: "texto",
          texto: "Na etapa de **Análise**, os requisitos são organizados em funcionais, como criar e editar projetos, e não funcionais, como segurança, usabilidade e performance. Os requisitos críticos são priorizados para o **MVP (Minimum Viable Product)**."
        },
        {
          tipo: "imagem",
          src: "quadro_1_requisitos_sistema_gerenciamento_projetos.png",
          pasta: "imagens_analise_de_requisitos/aula_5",
          alt: "Quadro 1 – Requisitos Funcionais e não funcionais do sistema de gerenciamento de projetos, separando os requisitos em funcionais (operações que o sistema deve realizar) e não funcionais (características como segurança, usabilidade, performance, escalabilidade e confiabilidade). (Página 8 do PDF)",
          num: 2
        },
        {
          tipo: "tabela",
          titulo: "Quadro 1 — Requisitos Funcionais do Sistema de Gerenciamento de Projetos",
          colunas: ["Identificador", "Requisito", "Descrição"],
          linhas: [
            ["RF0001", "Criar Projeto", "Permitir criar projetos informando nome, descrição, prazo e membros"],
            ["RF0002", "Editar Projeto", "Permitir editar informações de projetos existentes"],
            ["RF0003", "Excluir Projeto", "Permitir excluir projetos que não são mais necessários"],
            ["RF0004", "Atribuir Tarefas", "Permitir atribuir tarefas aos membros da equipe"],
            ["RF0005", "Definir Prazos", "Definir prazos para tarefas e para o projeto"],
            ["RF0006", "Acompanhar Progresso das Tarefas", "Visualizar tarefas concluídas, em andamento e pendentes"],
            ["RF0007", "Gerar Relatórios de Status do Projeto", "Gerar relatórios sobre progresso e cumprimento de prazos"]
          ]
        },
        {
          tipo: "tabela",
          titulo: "Quadro 1 — Requisitos Não Funcionais do Sistema de Gerenciamento de Projetos",
          colunas: ["Identificador", "Requisito", "Descrição"],
          linhas: [
            ["RF0001", "Segurança", "Controle de acesso baseado em papéis"],
            ["RF0002", "Usabilidade", "Interface intuitiva e fácil de usar"],
            ["RF0003", "Performance", "Suportar múltiplos projetos e tarefas simultaneamente sem degradação perceptível"],
            ["RF0004", "Escalabilidade", "Suportar número crescente de usuários e projetos"],
            ["RF0005", "Confiabilidade", "Sistema disponível e funcional pelo menos 99,9% do tempo"]
          ]
        }
      ]
    },
    {
      id: "mvp",
      titulo: "MVP — Minimum Viable Product",
      blocos: [
        {
          tipo: "texto",
          texto: "O **MVP (Minimum Viable Product)** é definido como a versão **mais simples e funcional de um produto**, desenvolvida utilizando o mínimo de esforço e tempo necessário para testar uma ideia no mercado."
        },
        {
          tipo: "lista",
          titulo: "Objetivos do MVP",
          itens: [
            "validar hipóteses de negócio",
            "entender a aceitação dos usuários",
            "coletar feedback",
            "realizar isso com o menor investimento possível"
          ]
        }
      ]
    },
    {
      id: "exemplo_mvp_event_planner",
      titulo: "Exemplo de MVP — Event Planner",
      blocos: [
        {
          tipo: "exemplo",
          titulo: "Event Planner",
          texto: "O PDF utiliza um projeto chamado **Event Planner**, um software para planejar, organizar e gerenciar eventos.",
          detalhe: "Objetivo: planejar, organizar e gerenciar eventos."
        },
        {
          tipo: "lista",
          titulo: "Principais funcionalidades identificadas",
          itens: [
            "criação de eventos",
            "gestão de convidados",
            "criação e atribuição de tarefas",
            "envio de convites por e-mail"
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Ordem de implementação apresentada"
        },
        {
          tipo: "topico",
          titulo: "1. Criação de eventos",
          texto: "Permite inserir título, data, hora e descrição.",
          lista: ["título", "data", "hora", "descrição"]
        },
        {
          tipo: "topico",
          titulo: "2. Gestão de convidados",
          texto: "Permite inserir nomes e e-mails.",
          lista: ["nomes", "e-mails"]
        },
        {
          tipo: "topico",
          titulo: "3. Criação e atribuição de tarefas",
          texto: "Permite criar tarefas relacionadas ao evento e atribuí-las aos membros da equipe."
        },
        {
          tipo: "topico",
          titulo: "4. Envio de convites",
          texto: "Implementação do sistema de envio de convites por e-mail."
        },
        {
          tipo: "texto",
          texto: "Após cada sprint, a equipe realiza uma **Sprint Review** para obter feedback dos usuários."
        },
        {
          tipo: "lista",
          titulo: "O feedback pode envolver",
          itens: [
            "facilidade de uso da criação de eventos",
            "efetividade da gestão de convidados",
            "utilidade das tarefas",
            "funcionamento dos convites"
          ]
        },
        {
          tipo: "texto",
          texto: "Com base no feedback, o backlog é ajustado, melhorias são priorizadas e novas funcionalidades podem ser adicionadas."
        },
        {
          tipo: "destaque",
          texto: "Ideia central: o MVP é desenvolvido **incrementalmente**, com cada sprint adicionando funcionalidades e permitindo ajustes baseados no feedback dos usuários."
        }
      ]
    },
    {
      id: "exemplo_ecommerce",
      titulo: "Exemplo: criação de um E-commerce",
      blocos: [
        {
          tipo: "texto",
          texto: "O segundo exemplo apresenta a criação de um **E-commerce**."
        },
        {
          tipo: "exemplo",
          titulo: "Elicitação",
          texto: "Foram realizados workshops com clientes e vendedores para identificar expectativas.",
          detalhe: "Participantes: clientes e vendedores."
        },
        {
          tipo: "lista",
          titulo: "Expectativas identificadas",
          itens: [
            "interface amigável e intuitiva",
            "catálogo com fotos, descrições e preços",
            "carrinho de compras seguro e eficiente",
            "diversas opções de pagamento e entrega",
            "sistema de avaliações e comentários"
          ]
        },
        {
          tipo: "texto",
          texto: "Na **Análise**, os requisitos são refinados e transformados em funcionalidades específicas, como pesquisa por produto e filtro por categoria. Também são priorizadas as necessidades de cada grupo de stakeholders: clientes e vendedores."
        },
        {
          tipo: "lista",
          titulo: "Funcionalidades específicas resultantes da análise",
          itens: [
            "pesquisa por produto",
            "filtro por categoria"
          ]
        }
      ]
    },
    {
      id: "processos_continuos",
      titulo: "Elicitação e análise são processos contínuos",
      blocos: [
        {
          tipo: "texto",
          texto: "Um ponto importante do PDF é que a elicitação e análise **não acontecem apenas uma vez**. São processos dinâmicos e contínuos."
        },
        {
          tipo: "lista",
          titulo: "Durante o projeto",
          itens: [
            "novos requisitos podem surgir",
            "requisitos existentes podem ser revisados",
            "requisitos podem ser ajustados"
          ]
        },
        {
          tipo: "destaque",
          texto: "Para o sucesso do processo, é importante manter comunicação aberta e colaboração constante entre os envolvidos."
        }
      ]
    },
    {
      id: "requisitos_funcionais_user_stories",
      titulo: "Requisitos funcionais e User Stories",
      blocos: [
        {
          tipo: "texto",
          texto: "Os **requisitos funcionais** são as funcionalidades que o sistema deve possuir para solucionar o problema do cliente. Tanto a equipe técnica quanto os stakeholders devem ter clareza sobre esses requisitos."
        },
        {
          tipo: "topico",
          titulo: "User Stories (Histórias de Usuário)",
          texto: "O PDF apresenta as **User Stories** como uma técnica que pode ajudar a tornar a comunicação entre equipe técnica e clientes mais clara e objetiva."
        },
        {
          tipo: "lista",
          titulo: "Uma User Story permite identificar",
          itens: [
            "quem é o usuário",
            "quais são suas permissões",
            "qual ação ele deve realizar",
            "qual é o objetivo dessa ação"
          ]
        },
        {
          tipo: "lista",
          titulo: "A linguagem deve ser",
          itens: [
            "curta",
            "clara",
            "objetiva",
            "mais próxima da linguagem do cliente do que da linguagem técnica"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Estrutura de User Story",
          texto: "O material apresenta a estrutura: \"Como [usuário], eu quero [ação], para que [objetivo].\" No exemplo do sistema de prontuário: \"Como recepcionista do hospital, eu quero cadastrar novos pacientes com informações básicas, para que possamos ter um registro completo dos pacientes que chegam ao hospital.\"",
          detalhe: "Essa estrutura relaciona: Usuário → ação desejada → finalidade/benefício."
        },
        {
          tipo: "topico",
          titulo: "User Stories e telas do sistema",
          texto: "O PDF destaca que é importante deixar claros os **campos de informação presentes nas telas**. Por exemplo, uma tela de autenticação pode precisar de endereço de e-mail e senha. Essa abordagem permite que desenvolvedores e designers compreendam quais elementos precisam existir na interface.",
          lista: ["endereço de e-mail", "senha"]
        },
        {
          tipo: "texto",
          texto: "O uso da ideia de **\"tela do sistema\"** permite uma abordagem mais visual para analisar o sistema a partir de seus pontos de interação com o usuário. Isso torna definições abstratas sobre funcionalidades mais concretas e facilita a discussão entre clientes e desenvolvedores."
        },
        {
          tipo: "imagem",
          src: "representacao_visual_user_stories_interface.png",
          pasta: "imagens_analise_de_requisitos/aula_5",
          alt: "Ilustração de uma pessoa utilizando um computador, associada à discussão sobre User Stories e interface, apoiando o conceito de interação do usuário com o sistema. (Página 11 do PDF)",
          num: 3
        }
      ]
    },
    {
      id: "stakeholders_usuarios_reais",
      titulo: "Stakeholders e usuários reais",
      blocos: [
        {
          tipo: "texto",
          texto: "O termo **stakeholders** não se limita aos gerentes ou administradores. O PDF enfatiza que também devem ser considerados aqueles que **realmente utilizarão o sistema no dia a dia**. Esses usuários são importantes porque possuem experiência prática com o negócio."
        },
        {
          tipo: "lista",
          titulo: "Eles podem fornecer informações fundamentais para",
          itens: [
            "definir funcionalidades",
            "compreender necessidades de automatização",
            "facilitar tomadas de decisão",
            "determinar como os dados devem ser coletados",
            "determinar como as informações devem ser fornecidas pelo sistema"
          ]
        }
      ]
    },
    {
      id: "priorizacao_documento_requisitos",
      titulo: "Priorização dos requisitos funcionais e Documento de Requisitos",
      blocos: [
        {
          tipo: "texto",
          texto: "Nem todas as funcionalidades possuem a mesma urgência."
        },
        {
          tipo: "lista",
          titulo: "Algumas podem ser",
          itens: [
            "determinantes",
            "urgentes",
            "necessárias para colocar o sistema em produção"
          ]
        },
        {
          tipo: "lista",
          titulo: "Outras podem ficar para posteriormente, pois",
          itens: [
            "podem esperar",
            "representam melhorias",
            "possuem menor urgência"
          ]
        },
        {
          tipo: "destaque",
          texto: "A priorização exige **intensa comunicação entre equipe técnica e clientes**. Ela é fundamental para criar o **cronograma de desenvolvimento**."
        },
        {
          tipo: "texto",
          texto: "O cronograma permite que gestores e diretores acompanhem quando o software poderá ser adotado. Quando o desenvolvimento é terceirizado, o cronograma também pode participar da definição dos contratos."
        },
        {
          tipo: "texto",
          texto: "O **Documento de Requisitos do Sistema** estabelece as diretrizes principais do projeto."
        },
        {
          tipo: "lista",
          titulo: "O Documento de Requisitos do Sistema estabelece",
          itens: [
            "funcionalidades do sistema",
            "escopo do projeto",
            "descrição",
            "prioridades",
            "cronograma de entrega"
          ]
        }
      ]
    },
    {
      id: "escopo_fixo_variado",
      titulo: "Escopo fixo × Escopo variado",
      blocos: [
        {
          tipo: "texto",
          texto: "O PDF apresenta uma discussão importante sobre o escopo de software."
        },
        {
          tipo: "topico",
          titulo: "Escopo Variado de Produto",
          texto: "O material defende uma definição de escopo **flexível e discutida em diferentes momentos da produção**. Isso ocorre porque novas necessidades podem surgir, o cliente pode identificar novas necessidades durante o uso, o negócio da empresa pode mudar e prioridades gerenciais podem mudar. Por isso, os requisitos funcionais podem precisar ser modificados durante o desenvolvimento.",
          lista: [
            "novas necessidades podem surgir",
            "o cliente pode identificar novas necessidades durante o uso",
            "o negócio da empresa pode mudar",
            "prioridades gerenciais podem mudar"
          ]
        },
        {
          tipo: "topico",
          titulo: "Escopo Fixo de Produto",
          texto: "No escopo fixo, os requisitos não podem ser modificados durante o desenvolvimento, as funcionalidades não podem ser redimensionadas e funcionalidades não podem ser eliminadas.",
          lista: [
            "os requisitos não podem ser modificados durante o desenvolvimento",
            "as funcionalidades não podem ser redimensionadas",
            "funcionalidades não podem ser eliminadas"
          ]
        },
        {
          tipo: "tabela",
          titulo: "Comparação: Escopo Variado × Escopo Fixo",
          colunas: ["Escopo Variado", "Escopo Fixo"],
          linhas: [
            ["Flexível", "Rígido"],
            ["Requisitos podem mudar", "Requisitos não devem ser modificados"],
            ["Funcionalidades podem ser redimensionadas", "Funcionalidades não podem ser redimensionadas"],
            ["Relacionado à abordagem iterativa dos Métodos Ágeis", "Mantém o escopo definido"]
          ]
        },
        {
          tipo: "destaque",
          texto: "O PDF defende o **Escopo Variado de Produto** como uma abordagem mais adequada à natureza peculiar do desenvolvimento de software apresentada no material."
        }
      ]
    },
    {
      id: "exemplo_prontuario_eletronico",
      titulo: "Exemplo: Sistema de Prontuário Eletrônico",
      blocos: [
        {
          tipo: "texto",
          texto: "O material utiliza como exemplo um **Sistema de Prontuário Eletrônico**."
        },
        {
          tipo: "exemplo",
          titulo: "Elicitação",
          texto: "Na elicitação, são considerados médicos, enfermeiros, pacientes e administradores do hospital.",
          detalhe: "Stakeholders considerados: médicos, enfermeiros, pacientes, administradores do hospital."
        },
        {
          tipo: "lista",
          titulo: "Necessidades levantadas",
          itens: [
            "cadastro e gestão de pacientes",
            "registro de consultas",
            "histórico médico",
            "exames",
            "prescrição de medicamentos",
            "solicitação de exames",
            "integração com outros sistemas de saúde",
            "segurança para proteger dados confidenciais"
          ]
        },
        {
          tipo: "texto",
          texto: "Na **análise**, também são consideradas exigências legais, exigências éticas e segurança da informação."
        },
        {
          tipo: "lista",
          titulo: "Necessidades priorizadas",
          itens: [
            "confidencialidade dos dados",
            "interoperabilidade com outros sistemas"
          ]
        },
        {
          tipo: "imagem",
          src: "quadro_2_requisitos_funcionais_prontuario.png",
          pasta: "imagens_analise_de_requisitos/aula_5",
          alt: "Quadro 2 – Requisitos Funcionais do Sistema de Prontuário Eletrônico, apresentando identificadores, descrições e respectivas prioridades. (Página 15 do PDF)",
          num: 4
        },
        {
          tipo: "tabela",
          titulo: "Quadro 2 — Requisitos Funcionais do Prontuário Eletrônico",
          colunas: ["ID", "Requisito", "Prioridade"],
          linhas: [
            ["RF0001", "Cadastro de Pacientes", "Alta"],
            ["RF0002", "Gestão de Pacientes", "Alta"],
            ["RF0003", "Registro de Consultas", "Alta"],
            ["RF0004", "Histórico Médico", "Alta"],
            ["RF0005", "Registro de Exames", "Média"],
            ["RF0006", "Prescrição de Medicamentos", "Alta"],
            ["RF0007", "Solicitação de Exames", "Alta"],
            ["RF0008", "Integração com Sistemas de Saúde", "Média"],
            ["RF0009", "Controle de Acesso", "Alta"],
            ["RF0010", "Auditoria de Acessos", "Alta"],
            ["RF0011", "Interface Amigável", "Média"],
            ["RF0012", "Notificações", "Média"],
            ["RF0013", "Backup e Recuperação de Dados", "Alta"]
          ]
        },
        {
          tipo: "lista",
          titulo: "O que cada requisito representa",
          itens: [
            "Cadastro de Pacientes: registrar novos pacientes com informações básicas.",
            "Gestão de Pacientes: atualizar, editar e excluir dados.",
            "Registro de Consultas: registrar diagnóstico, procedimentos e recomendações.",
            "Histórico Médico: manter histórico de consultas, diagnósticos, tratamentos e procedimentos.",
            "Registro de Exames: registrar e visualizar resultados.",
            "Prescrição de Medicamentos: permitir que médicos registrem prescrições.",
            "Solicitação de Exames: permitir solicitação de exames pelo sistema.",
            "Integração: permitir interoperabilidade com outros sistemas de saúde.",
            "Controle de Acesso: restringir acesso/modificação de dados sensíveis a usuários autorizados.",
            "Auditoria: registrar operações realizadas.",
            "Interface Amigável: fornecer interface intuitiva.",
            "Notificações: informar sobre consultas, exames e atualizações.",
            "Backup e Recuperação: copiar dados regularmente e permitir sua recuperação em caso de falha."
          ]
        },
        {
          tipo: "imagem",
          src: "quadro_3_user_stories_rf0001_rf0002.png",
          pasta: "imagens_analise_de_requisitos/aula_5",
          alt: "Quadro 3 – User Stories para os Requisitos Funcionais RF0001 e RF0002, relacionadas ao cadastro e à gestão de pacientes, juntamente com seus critérios de aceitação. (Página 16 do PDF)",
          num: 5
        },
        {
          tipo: "exemplo",
          titulo: "RF0001 — Cadastro de pacientes (User Story)",
          texto: "Como recepcionista do hospital, eu quero cadastrar novos pacientes com informações básicas, para que exista um registro completo dos pacientes que chegam ao hospital.",
          detalhe: "Critérios de aceitação: 1) Permitir entrada de nome, idade, endereço, número de contato e detalhes do plano de saúde. 2) Validar campos obrigatórios, como nome e número de contato. 3) Após salvar, confirmar a criação e disponibilizar um número de identificação único."
        },
        {
          tipo: "lista",
          titulo: "Critérios de aceitação — RF0001 Cadastro de pacientes",
          itens: [
            "Permitir entrada de nome, idade, endereço, número de contato e detalhes do plano de saúde.",
            "Validar campos obrigatórios, como nome e número de contato.",
            "Após salvar, confirmar a criação e disponibilizar um número de identificação único."
          ]
        },
        {
          tipo: "exemplo",
          titulo: "RF0002 — Gestão de pacientes (User Story)",
          texto: "Como recepcionista do hospital, eu quero atualizar, editar e excluir os dados cadastrais, para que as informações permaneçam atualizadas e corretas.",
          detalhe: "Critérios de aceitação: 1) Buscar paciente por nome ou número de identificação. 2) Editar informações básicas, como endereço e número de contato. 3) Registrar e exibir data da última atualização e usuário responsável pela atualização. 4) Ao excluir um paciente, solicitar confirmação para evitar exclusões acidentais."
        },
        {
          tipo: "lista",
          titulo: "Critérios de aceitação — RF0002 Gestão de pacientes",
          itens: [
            "Buscar paciente por nome ou número de identificação.",
            "Editar informações básicas, como endereço e número de contato.",
            "Registrar e exibir data da última atualização e usuário responsável pela atualização.",
            "Ao excluir um paciente, solicitar confirmação para evitar exclusões acidentais."
          ]
        }
      ]
    },
    {
      id: "criterios_aceitacao",
      titulo: "Critérios de aceitação",
      blocos: [
        {
          tipo: "texto",
          texto: "Os **critérios de aceitação** são condições que o software precisa cumprir para que uma User Story seja considerada aceita pelo cliente, usuário e equipe de desenvolvimento."
        },
        {
          tipo: "lista",
          titulo: "Eles definem",
          itens: [
            "comportamento esperado",
            "funcionalidades que a User Story precisa atender",
            "condições para considerar a história completa e funcional"
          ]
        },
        {
          tipo: "texto",
          texto: "Também servem como base para validação e testes do software."
        },
        {
          tipo: "subtitulo",
          texto: "Características dos critérios de aceitação"
        },
        {
          tipo: "topico",
          titulo: "Clareza",
          texto: "Devem ser claros e específicos, sem ambiguidades."
        },
        {
          tipo: "topico",
          titulo: "Mensuráveis",
          texto: "Devem poder ser medidos ou testados."
        },
        {
          tipo: "topico",
          titulo: "Relevantes",
          texto: "Devem estar diretamente relacionados à User Story."
        },
        {
          tipo: "topico",
          titulo: "Objetivos",
          texto: "Devem permitir que os envolvidos concordem sobre o que significa cumprir o critério."
        },
        {
          tipo: "destaque",
          texto: "Para memorizar: Critérios de aceitação = condições claras, mensuráveis, relevantes e objetivas para verificar se uma User Story foi cumprida."
        }
      ]
    },
    {
      id: "requisitos_nao_funcionais",
      titulo: "Requisitos não funcionais",
      blocos: [
        {
          tipo: "texto",
          texto: "Os **Requisitos Não Funcionais (RNF)** definem qualidades, características e restrições que o sistema deve possuir."
        },
        {
          tipo: "texto",
          texto: "Eles garantem que o sistema não apenas funcione, mas também atenda a determinados padrões de qualidade e desempenho."
        },
        {
          tipo: "lista",
          titulo: "O PDF destaca principalmente",
          itens: [
            "desempenho",
            "segurança",
            "confiabilidade",
            "usabilidade",
            "escalabilidade",
            "manutenibilidade",
            "compatibilidade"
          ]
        },
        {
          tipo: "topico",
          titulo: "Desempenho",
          texto: "O sistema deve responder rapidamente, suportar múltiplas operações simultâneas e evitar degradação perceptível de desempenho. No exemplo do prontuário eletrônico, o requisito especifica resposta às solicitações em **menos de 2 segundos durante operações normais**."
        },
        {
          tipo: "topico",
          titulo: "Segurança",
          texto: "É necessário proteger os dados contra acesso não autorizado, perda e roubo. O PDF destaca o **controle de acesso baseado em papéis**, permitindo acesso a dados sensíveis somente a usuários autenticados e autorizados."
        },
        {
          tipo: "topico",
          titulo: "Confiabilidade",
          texto: "O sistema deve permanecer disponível e funcional por **pelo menos 99,9% do tempo**, excluindo períodos de manutenção programada."
        },
        {
          tipo: "topico",
          titulo: "Usabilidade",
          texto: "A interface deve ser intuitiva e fácil de utilizar. No exemplo, médicos e enfermeiros devem conseguir usar o sistema sem treinamento extensivo."
        },
        {
          tipo: "topico",
          titulo: "Escalabilidade",
          texto: "O sistema deve conseguir crescer com aumento de usuários e aumento de registros, sem perda de desempenho."
        },
        {
          tipo: "topico",
          titulo: "Manutenibilidade",
          texto: "O sistema deve ser fácil de manter e atualizar. O material relaciona isso à existência de documentação completa e clara do código e das funcionalidades."
        },
        {
          tipo: "topico",
          titulo: "Compatibilidade",
          texto: "O sistema deve funcionar em diferentes dispositivos e navegadores. O exemplo cita desktops, tablets e smartphones.",
          lista: ["desktops", "tablets", "smartphones"]
        },
        {
          tipo: "imagem",
          src: "quadro_4_requisitos_nao_funcionais_prontuario.png",
          pasta: "imagens_analise_de_requisitos/aula_5",
          alt: "Quadro 4 – Requisitos Não Funcionais do Sistema de Prontuário Eletrônico, organizados em identificador, descrição e prioridade, relacionados a segurança, acesso, desempenho, escalabilidade, confiabilidade, usabilidade, compatibilidade, manutenção, auditoria e recuperação de dados. (Página 20 do PDF)",
          num: 6
        },
        {
          tipo: "tabela",
          titulo: "Quadro 4 — Requisitos Não Funcionais do Prontuário Eletrônico",
          colunas: ["Requisito", "Prioridade"],
          linhas: [
            ["Segurança de Dados — proteger os dados contra acesso não autorizado, perda e roubo", "Alta"],
            ["Controle de Acesso — acesso apenas por usuários autenticados/autorizados, com níveis baseados em papéis", "Alta"],
            ["Desempenho — responder em menos de 2 segundos durante operações normais", "Alta"],
            ["Escalabilidade — suportar aumento de usuários e registros sem perda de desempenho", "Média"],
            ["Confiabilidade — disponibilidade de 99,9%, excluindo manutenção programada", "Alta"],
            ["Usabilidade — interface intuitiva, sem necessidade de treinamento extensivo", "Média"],
            ["Compatibilidade — compatível com diferentes dispositivos e navegadores", "Média"],
            ["Manutenibilidade — fácil manutenção e atualização, com documentação completa e clara", "Média"],
            ["Auditabilidade — registrar operações e acessos para auditoria e segurança", "Alta"],
            ["Backup e Recuperação — backup regular e procedimentos de recuperação em caso de falhas", "Alta"]
          ]
        }
      ]
    },
    {
      id: "funcional_x_nao_funcional",
      titulo: "Funcional × Não funcional — diferença fundamental",
      blocos: [
        {
          tipo: "texto",
          texto: "Essa é uma das distinções mais importantes do conteúdo."
        },
        {
          tipo: "tabela",
          titulo: "Requisito funcional × Requisito não funcional",
          colunas: ["Requisito funcional", "Requisito não funcional"],
          linhas: [
            ["Define o que o sistema faz", "Define como o sistema deve ser/funcionar"],
            ["Está ligado às funcionalidades", "Está ligado às características e restrições"],
            ["Ex.: cadastrar paciente", "Ex.: sistema responder em menos de 2 segundos"],
            ["Ex.: registrar consulta", "Ex.: disponibilidade de 99,9%"],
            ["Ex.: solicitar exame", "Ex.: controle de acesso"],
            ["Ex.: gerar relatório", "Ex.: compatibilidade com dispositivos"]
          ]
        },
        {
          tipo: "destaque",
          texto: "Regra simples para memorizar: FUNCIONAL → FUNÇÃO → o que faz. NÃO FUNCIONAL → QUALIDADE/CARACTERÍSTICA → como deve funcionar."
        }
      ]
    },
    {
      id: "consideracoes_processo_requisitos",
      titulo: "Considerações sobre o processo de requisitos",
      blocos: [
        {
          tipo: "texto",
          texto: "O PDF destaca que a análise de requisitos possui desafios importantes."
        },
        {
          tipo: "lista",
          titulo: "É necessário lidar com",
          itens: [
            "ambiguidade",
            "incerteza",
            "necessidades diferentes dos stakeholders",
            "alinhamento entre os envolvidos",
            "interpretação correta das necessidades",
            "priorização"
          ]
        },
        {
          tipo: "destaque",
          texto: "A priorização é particularmente difícil porque precisa equilibrar: necessidades dos usuários × tempo disponível × recursos disponíveis."
        },
        {
          tipo: "lista",
          titulo: "Por isso, a análise de requisitos exige uma abordagem",
          itens: [
            "meticulosa",
            "colaborativa",
            "contínua"
          ]
        }
      ]
    },
    {
      id: "relacao_geral_entre_conceitos",
      titulo: "Relação geral entre os conceitos",
      blocos: [
        {
          tipo: "texto",
          texto: "O conteúdo inteiro pode ser organizado em um fluxo lógico contínuo, conforme apresentado no PDF."
        },
        {
          tipo: "lista",
          titulo: "Fluxo do processo de requisitos",
          itens: [
            "Stakeholders fornecem necessidades, expectativas e desejos",
            "Elicitação utiliza entrevistas, questionários, workshops, observação etc.",
            "Geração de requisitos brutos",
            "Análise refina, organiza, estrutura, identifica inconsistências e prioriza",
            "Definição de Requisitos, divididos em Funcionais e Não funcionais",
            "Requisitos Funcionais definem o que o sistema faz e originam User Stories",
            "Requisitos Não funcionais definem características que o sistema deve possuir (desempenho, segurança, usabilidade, confiabilidade, escalabilidade etc.)",
            "User Stories originam Critérios de aceitação",
            "Critérios de aceitação sustentam a Validação e testes"
          ]
        }
      ]
    },
    {
      id: "pontos_atencao_prova",
      titulo: "Pontos que merecem atenção para a prova",
      blocos: [
        {
          tipo: "topico",
          titulo: "Elicitação",
          texto: "É o processo de **descobrir, ouvir e entender** as necessidades dos stakeholders."
        },
        {
          tipo: "topico",
          titulo: "Análise",
          texto: "É responsável por **refinar, organizar, estruturar, verificar e priorizar** as informações coletadas."
        },
        {
          tipo: "topico",
          titulo: "Técnicas e ferramentas",
          lista: [
            "Entrevistas",
            "Questionários",
            "Workshops",
            "Observação",
            "Diagramas de casos de uso",
            "Protótipos",
            "Ferramentas CASE"
          ]
        },
        {
          tipo: "topico",
          titulo: "Requisitos funcionais",
          texto: "Definem **o que o sistema deve fazer**."
        },
        {
          tipo: "topico",
          titulo: "Requisitos não funcionais",
          texto: "Definem **características, qualidades e restrições do sistema**."
        },
        {
          tipo: "topico",
          titulo: "User Stories",
          texto: "Ajudam a comunicar funcionalidades usando uma linguagem próxima do cliente. Estrutura apresentada: \"Como [usuário], eu quero [ação], para que [objetivo].\""
        },
        {
          tipo: "topico",
          titulo: "Critérios de aceitação",
          texto: "Definem as condições que precisam ser cumpridas para uma User Story ser considerada completa e funcional.",
          lista: ["Claros", "Mensuráveis", "Relevantes", "Objetivos"]
        },
        {
          tipo: "topico",
          titulo: "Stakeholders",
          texto: "Não são apenas gestores e administradores. O PDF destaca também os **usuários reais do sistema**, que possuem experiência prática com o negócio."
        },
        {
          tipo: "topico",
          titulo: "Priorização",
          texto: "É necessária porque algumas funcionalidades são mais urgentes ou determinantes que outras."
        },
        {
          tipo: "topico",
          titulo: "Documento de Requisitos",
          texto: "Estabelece funcionalidades, escopo, descrição, prioridades e cronograma.",
          lista: ["funcionalidades", "escopo", "descrição", "prioridades", "cronograma"]
        },
        {
          tipo: "topico",
          titulo: "Escopo variado",
          texto: "Permite modificar requisitos e funcionalidades durante o desenvolvimento."
        },
        {
          tipo: "topico",
          titulo: "Escopo fixo",
          texto: "Não permite modificar, redimensionar ou eliminar requisitos durante o desenvolvimento."
        },
        {
          tipo: "topico",
          titulo: "MVP",
          texto: "É a versão mais simples e funcional do produto, criada para testar uma ideia, validar hipóteses e obter feedback com menor investimento."
        }
      ]
    },
    {
      id: "revisao_rapida",
      titulo: "Revisão rápida",
      blocos: [
        {
          tipo: "topico",
          titulo: "Elicitação",
          texto: "Coletar e compreender necessidades."
        },
        {
          tipo: "topico",
          titulo: "Análise",
          texto: "Refinar, organizar, verificar e priorizar."
        },
        {
          tipo: "topico",
          titulo: "Requisitos funcionais",
          texto: "O que o sistema faz."
        },
        {
          tipo: "topico",
          titulo: "Requisitos não funcionais",
          texto: "Características que o sistema deve possuir."
        },
        {
          tipo: "topico",
          titulo: "User Story",
          texto: "Usuário + ação + objetivo."
        },
        {
          tipo: "topico",
          titulo: "Critérios de aceitação",
          texto: "Condições objetivas para verificar se a User Story foi cumprida."
        },
        {
          tipo: "topico",
          titulo: "MVP",
          texto: "Versão mais simples e funcional para validar uma ideia e obter feedback."
        },
        {
          tipo: "topico",
          titulo: "Escopo variado",
          texto: "Pode mudar durante o desenvolvimento."
        },
        {
          tipo: "topico",
          titulo: "Escopo fixo",
          texto: "Não deve ser modificado durante o desenvolvimento."
        },
        {
          tipo: "topico",
          titulo: "Stakeholders",
          texto: "Todos os interessados no sistema, incluindo os usuários que realmente o utilizarão."
        },
        {
          tipo: "topico",
          titulo: "Principais RNFs do material",
          texto: "Desempenho + Segurança + Confiabilidade + Usabilidade + Escalabilidade + Manutenibilidade + Compatibilidade."
        },
        {
          tipo: "destaque",
          texto: "Números importantes do PDF: 99,9% → disponibilidade apresentada para confiabilidade. Menos de 2 segundos → desempenho especificado no exemplo do prontuário eletrônico."
        }
      ]
    }
  ]
  },
  // aula 6
  {
  aula: "Técnicas de Levantamento de Requisitos",
  ideia_central: "O levantamento de requisitos é uma etapa fundamental da Engenharia de Requisitos que utiliza quatro técnicas principais — entrevistas, reuniões, etnografia e análise de documentos — para coletar, compreender e alinhar as necessidades dos stakeholders com o software a ser desenvolvido, exigindo do profissional uma combinação de hard skills e soft skills.",
  secoes: [
    {
      id: "introducao",
      titulo: "Introdução ao Levantamento de Requisitos",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Levantamento de Requisitos** é uma etapa fundamental da **Engenharia de Requisitos** e do desenvolvimento de software. A Engenharia de Requisitos é apresentada como a disciplina responsável por **definir, documentar e gerenciar os requisitos de um sistema de software**. Para isso, utiliza técnicas e ferramentas que ajudam a garantir que o software atenda às expectativas dos usuários desde sua concepção até sua implementação e manutenção."
        },
        {
          tipo: "destaque",
          texto: "O levantamento de requisitos funciona como uma **ponte entre aquilo que os usuários e stakeholders precisam e o software que será desenvolvido**."
        },
        {
          tipo: "topico",
          titulo: "Objetivos do levantamento de requisitos",
          lista: [
            "coletar as necessidades dos envolvidos",
            "compreender suas expectativas",
            "identificar funcionalidades importantes",
            "identificar características necessárias ao sistema",
            "evitar o desenvolvimento de recursos desnecessários",
            "melhorar a comunicação entre desenvolvedores e usuários",
            "alinhar todos os envolvidos aos objetivos do projeto",
            "otimizar tempo e recursos",
            "reduzir retrabalho",
            "reduzir custos desnecessários",
            "diminuir riscos de falhas e frustrações",
            "contribuir para um software de maior qualidade"
          ]
        },
        {
          tipo: "lista",
          titulo: "Quatro técnicas principais destacadas no material",
          itens: [
            "Entrevistas",
            "Reuniões",
            "Etnografia",
            "Análise de documentos existentes"
          ]
        },
        {
          tipo: "imagem",
          src: "capa_tecnicas_levantamento_requisitos",
          pasta: "imagens_engenharia_software/aula_6",
          alt: "Capa do módulo 'Técnicas de levantamento de requisitos', com composição visual relacionada ao uso de computador e tecnologia (Página 1 do PDF)",
          num: 1
        }
      ]
    },
    {
      id: "visao_geral_tecnicas",
      titulo: "Visão geral das quatro técnicas",
      blocos: [
        {
          tipo: "tabela",
          titulo: "Visão geral das quatro técnicas",
          colunas: ["Técnica", "Ideia principal"],
          linhas: [
            ["Entrevistas", "Conversar diretamente com stakeholders para obter informações detalhadas"],
            ["Reuniões", "Reunir diferentes stakeholders para discutir, alinhar e chegar a consensos"],
            ["Etnografia", "Observar os usuários diretamente em seu ambiente natural de trabalho"],
            ["Análise de documentos", "Examinar documentos existentes para descobrir requisitos explícitos, implícitos e complementares"]
          ]
        },
        {
          tipo: "texto",
          texto: "Essas técnicas não devem ser vistas como necessariamente isoladas. O material apresenta diferentes maneiras de obter informações sobre as necessidades reais dos usuários. Além disso, o levantamento de requisitos é um **processo contínuo**, realizado ao longo do ciclo de vida do software. Os requisitos precisam permanecer atualizados para que o sistema continue atendendo às necessidades dos usuários e possa evoluir de maneira sustentável."
        }
      ]
    },
    {
      id: "entrevistas",
      titulo: "Entrevistas",
      blocos: [
        {
          tipo: "subtitulo",
          texto: "O que são entrevistas?"
        },
        {
          tipo: "texto",
          texto: "As entrevistas são uma das técnicas mais utilizadas no levantamento de requisitos. Elas consistem em **conversas diretas entre analistas de sistemas e stakeholders**, com o objetivo de coletar informações detalhadas sobre: necessidades; expectativas; problemas; perspectivas dos usuários."
        },
        {
          tipo: "lista",
          titulo: "Três tipos principais de entrevistas apresentados no material",
          itens: [
            "entrevistas estruturadas",
            "entrevistas semiestruturadas",
            "entrevistas não estruturadas"
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Entrevistas estruturadas"
        },
        {
          tipo: "texto",
          texto: "As entrevistas estruturadas utilizam um **roteiro rígido de perguntas previamente definidas**. Isso significa que o entrevistador segue uma sequência de perguntas estabelecida antes da entrevista."
        },
        {
          tipo: "topico",
          titulo: "Principal característica",
          texto: "Permitir a obtenção de informações específicas, organizadas e comparáveis entre diferentes stakeholders."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de entrevista estruturada",
          texto: "Um analista pode entrevistar diferentes gerentes de projeto utilizando exatamente as mesmas perguntas para descobrir quais funcionalidades eles desejam em um sistema de gerenciamento de tarefas.",
          detalhe: "Entre as perguntas apresentadas estão: quais são as funcionalidades mais importantes esperadas do sistema; como o entrevistado define o sucesso do software."
        },
        {
          tipo: "destaque",
          texto: "Resumindo: **Estruturada = roteiro definido + perguntas previamente estabelecidas + maior padronização.**"
        },
        {
          tipo: "subtitulo",
          texto: "Entrevistas semiestruturadas"
        },
        {
          tipo: "texto",
          texto: "As entrevistas semiestruturadas combinam: perguntas previamente definidas; liberdade para explorar novos assuntos durante a conversa. Existe uma estrutura inicial, mas o entrevistador pode fazer perguntas adicionais conforme as respostas do entrevistado."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de entrevista semiestruturada",
          texto: "O analista pode perguntar inicialmente sobre as funcionalidades desejadas e, caso o entrevistado mencione a necessidade de integração com outros sistemas, aprofundar o assunto perguntando: quais sistemas precisam ser integrados; por que essa integração é importante."
        },
        {
          tipo: "destaque",
          texto: "Resumindo: **Semiestruturada = roteiro inicial + flexibilidade para aprofundar assuntos.**"
        },
        {
          tipo: "subtitulo",
          texto: "Entrevistas não estruturadas"
        },
        {
          tipo: "texto",
          texto: "As entrevistas não estruturadas são **conversas abertas**, sem um roteiro rígido. O entrevistador possui maior liberdade para acompanhar os assuntos que surgem naturalmente durante a conversa."
        },
        {
          tipo: "topico",
          titulo: "Objetivo",
          texto: "Obter uma compreensão ampla, profunda e livre das perspectivas dos usuários."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de entrevista não estruturada",
          texto: "O analista pode iniciar com uma pergunta geral sobre os problemas enfrentados pelo usuário no sistema atual e, a partir da resposta, continuar explorando os assuntos que surgirem."
        },
        {
          tipo: "destaque",
          texto: "Resumindo: **Não estruturada = conversa aberta + pouca rigidez + exploração livre.**"
        },
        {
          tipo: "tabela",
          titulo: "Comparação dos tipos de entrevista",
          colunas: ["Tipo", "Roteiro", "Flexibilidade", "Principal característica"],
          linhas: [
            ["Estruturada", "Rígido", "Baixa", "Perguntas previamente definidas"],
            ["Semiestruturada", "Parcial", "Média/alta", "Permite aprofundar novos assuntos"],
            ["Não estruturada", "Não rígido", "Alta", "Conversa aberta e exploratória"]
          ]
        },
        {
          tipo: "destaque",
          texto: "Para memorizar: **Estruturada → segue o roteiro.** **Semiestruturada → segue o roteiro, mas pode explorar.** **Não estruturada → conversa livre.**"
        },
        {
          tipo: "imagem",
          src: "representacao_visual_entrevista_stakeholders",
          pasta: "imagens_engenharia_software/aula_6",
          alt: "Ilustração mostrando pessoas em uma situação de conversa/interação, associada ao conteúdo sobre entrevistas e levantamento de informações (Página 7 do PDF)",
          num: 2
        }
      ]
    },
    {
      id: "desafios_entrevistas",
      titulo: "Desafios das entrevistas",
      blocos: [
        {
          tipo: "texto",
          texto: "Realizar entrevistas para levantamento de requisitos apresenta diversos desafios."
        },
        {
          tipo: "topico",
          titulo: "Criar um ambiente de confiança",
          texto: "É necessário criar um ambiente em que os entrevistados se sintam confortáveis para compartilhar informações de maneira detalhada, honesta e aberta. Sem confiança, informações importantes podem deixar de ser apresentadas."
        },
        {
          tipo: "topico",
          titulo: "O usuário pode não saber expressar suas próprias necessidades",
          texto: "O entrevistado pode não ter clareza sobre aquilo que realmente precisa, ter dificuldade para explicar suas necessidades e não saber transformar suas necessidades em termos técnicos. Portanto, o analista precisa interpretar e aprofundar as respostas."
        },
        {
          tipo: "topico",
          titulo: "Informações conflitantes",
          texto: "Stakeholders diferentes podem fornecer informações inconsistentes, divergentes e conflitantes. O analista precisa identificar essas diferenças e **reconciliá-las**, buscando construir um conjunto de requisitos coeso e viável."
        }
      ]
    },
    {
      id: "habilidades_entrevistas",
      titulo: "Habilidades necessárias para entrevistas",
      blocos: [
        {
          tipo: "texto",
          texto: "Para conduzir entrevistas eficazes, o profissional precisa desenvolver tanto **hard skills** quanto **soft skills**."
        },
        {
          tipo: "subtitulo",
          texto: "Hard Skills"
        },
        {
          tipo: "topico",
          titulo: "O que são hard skills?",
          texto: "São habilidades técnicas, específicas, adquiridas por treinamento, desenvolvidas por experiência prática, desenvolvidas por educação formal, e que podem ser medidas. Elas estão relacionadas ao conhecimento técnico necessário para realizar determinadas tarefas."
        },
        {
          tipo: "lista",
          titulo: "Exemplos gerais de hard skills apresentados",
          itens: [
            "programação em Python, Java ou C++",
            "utilização de ferramentas como Excel, AutoCAD e Photoshop",
            "análise de dados usando SQL, R ou MATLAB",
            "proficiência em idiomas estrangeiros",
            "conhecimentos específicos de áreas como contabilidade, engenharia e redação técnica"
          ]
        },
        {
          tipo: "tabela",
          titulo: "Quadro 1 – Hard Skills para profissionais de requisitos",
          colunas: ["Hard Skill", "Descrição"],
          linhas: [
            ["Conhecimento Técnico", "Compreender tecnicamente o domínio do problema e a tecnologia envolvida para formular perguntas relevantes e entender as respostas"],
            ["Documentação", "Documentar respostas de maneira clara e organizada utilizando ferramentas adequadas"],
            ["Análise de Dados", "Analisar informações coletadas para identificar padrões, inconsistências e pontos que precisam de esclarecimento"]
          ]
        },
        {
          tipo: "destaque",
          texto: "Ideia principal: o profissional não precisa apenas **conversar** com o usuário. Ele precisa conseguir: **entender → registrar → analisar** as informações obtidas."
        },
        {
          tipo: "subtitulo",
          texto: "Soft Skills"
        },
        {
          tipo: "topico",
          titulo: "O que são soft skills?",
          texto: "As soft skills estão relacionadas ao comportamento, personalidade, relacionamento social, maneira de trabalhar e maneira de interagir com outras pessoas. São habilidades interpessoais e pessoais importantes para o sucesso profissional."
        },
        {
          tipo: "lista",
          titulo: "Exemplos gerais de soft skills apresentados",
          itens: [
            "comunicação",
            "empatia",
            "trabalho em equipe",
            "resolução de problemas",
            "ética de trabalho"
          ]
        },
        {
          tipo: "tabela",
          titulo: "Quadro 2 – Soft Skills para profissionais de requisitos",
          colunas: ["Soft Skill", "Descrição"],
          linhas: [
            ["Comunicação", "Fazer perguntas claras, ouvir ativamente e registrar respostas com precisão"],
            ["Empatia", "Compreender e valorizar as perspectivas e preocupações dos stakeholders"],
            ["Pensamento Crítico", "Avaliar criticamente as respostas e identificar problemas ou necessidade de mais detalhes"],
            ["Gerenciamento do Tempo", "Administrar o tempo da entrevista para abordar os pontos importantes sem perder o foco"],
            ["Negociação", "Reconciliar requisitos conflitantes e buscar compromissos que atendam às necessidades dos envolvidos"]
          ]
        },
        {
          tipo: "destaque",
          texto: "Para memorizar: **Entrevista eficaz = conhecimento técnico + documentação + análise + comunicação + empatia + pensamento crítico + tempo + negociação.**"
        },
        {
          tipo: "imagem",
          src: "multimidia_entrevistas_elicitacao",
          pasta: "imagens_engenharia_software/aula_6",
          alt: "Área visual destacada para conteúdo multimídia relacionado às entrevistas e à elicitação de requisitos, incluindo referência ao material de Gilleanes Guedes (Página 13 do PDF)",
          num: 3
        }
      ]
    },
    {
      id: "reunioes",
      titulo: "Reuniões",
      blocos: [
        {
          tipo: "texto",
          texto: "As reuniões são outra técnica essencial de levantamento de requisitos. Elas envolvem **discussões em grupo com stakeholders** para: identificar necessidades; alinhar expectativas; discutir diferentes perspectivas; colaborar; gerar ideias; buscar consenso sobre os requisitos."
        },
        {
          tipo: "texto",
          texto: "Diferentemente da entrevista, que pode concentrar-se em uma conversa individual, a reunião permite que **vários envolvidos participem simultaneamente**."
        },
        {
          tipo: "lista",
          titulo: "Três tipos de reuniões apresentados no material",
          itens: [
            "brainstorming",
            "análise e revisão",
            "workshops"
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Brainstorming"
        },
        {
          tipo: "texto",
          texto: "O brainstorming é voltado para a **geração colaborativa de ideias e soluções**. Os participantes são incentivados a apresentar ideias livremente, **sem julgamentos imediatos**. Isso cria um ambiente criativo, aberto e colaborativo."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de brainstorming",
          texto: "Uma equipe pode realizar brainstorming para identificar possíveis funcionalidades, melhorias e novas ideias para um sistema de gerenciamento de projetos."
        },
        {
          tipo: "destaque",
          texto: "Memorize: **Brainstorming → gerar ideias.**"
        },
        {
          tipo: "subtitulo",
          texto: "Reuniões de análise e revisão"
        },
        {
          tipo: "texto",
          texto: "São utilizadas para **analisar e revisar requisitos que já foram coletados**. O objetivo é verificar se os requisitos estão claros, completos e alinhados aos objetivos do projeto. Durante a reunião, os participantes podem: discutir requisitos; refiná-los; encontrar inconsistências; identificar pontos que precisam de mais detalhes."
        },
        {
          tipo: "destaque",
          texto: "Memorize: **Análise e revisão → verificar e melhorar requisitos.**"
        },
        {
          tipo: "subtitulo",
          texto: "Workshops"
        },
        {
          tipo: "texto",
          texto: "Os workshops são sessões colaborativas mais estruturadas. Eles combinam elementos de brainstorming, análise e atividades práticas. São utilizados para explorar e definir requisitos."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de workshop",
          texto: "Um workshop pode ser utilizado para: mapear os processos atuais de uma organização; identificar problemas; identificar oportunidades de melhoria; definir como um novo sistema poderia contribuir."
        },
        {
          tipo: "destaque",
          texto: "Memorize: **Workshop → colaboração estruturada + atividades práticas.**"
        },
        {
          tipo: "tabela",
          titulo: "Comparação das reuniões",
          colunas: ["Tipo", "Principal objetivo"],
          linhas: [
            ["Brainstorming", "Gerar ideias"],
            ["Análise e revisão", "Avaliar e refinar requisitos"],
            ["Workshop", "Explorar e definir requisitos por meio de colaboração estruturada"]
          ]
        }
      ]
    },
    {
      id: "desafios_reunioes",
      titulo: "Desafios das reuniões",
      blocos: [
        {
          tipo: "texto",
          texto: "As reuniões também possuem dificuldades."
        },
        {
          tipo: "topico",
          titulo: "Participação dos stakeholders",
          texto: "É necessário garantir a participação ativa e o envolvimento de todos os stakeholders. Isso pode ser complicado devido a: conflitos de agenda; interesses diferentes; baixa participação."
        },
        {
          tipo: "topico",
          titulo: "Manter o foco",
          texto: "Outro desafio é manter a reunião produtiva, objetiva e focada nos assuntos importantes. É necessário evitar que a discussão se desvie excessivamente dos objetivos definidos."
        }
      ]
    },
    {
      id: "habilidades_reunioes",
      titulo: "Habilidades para conduzir reuniões",
      blocos: [
        {
          tipo: "texto",
          texto: "O material divide novamente as habilidades em **hard skills** e **soft skills**."
        },
        {
          tipo: "tabela",
          titulo: "Quadro 3 – Hard Skills para condução de reuniões",
          colunas: ["Hard Skill", "Descrição"],
          linhas: [
            ["Planejamento de Reuniões", "Definir agendas claras e objetivos específicos"],
            ["Facilitação de Grupos", "Conduzir e moderar discussões garantindo oportunidade de participação"],
            ["Documentação", "Registrar discussões e decisões de maneira clara e organizada"]
          ]
        },
        {
          tipo: "tabela",
          titulo: "Quadro 4 – Soft Skills para condução de reuniões",
          colunas: ["Soft Skill", "Descrição"],
          linhas: [
            ["Comunicação", "Conduzir a reunião de forma clara e eficiente"],
            ["Empatia", "Compreender e valorizar perspectivas e preocupações dos stakeholders"],
            ["Pensamento Crítico", "Avaliar as discussões e identificar pontos que precisam de refinamento"],
            ["Gerenciamento do Tempo", "Garantir que os assuntos importantes sejam tratados eficientemente"],
            ["Negociação", "Resolver conflitos entre requisitos e interesses diferentes, buscando consenso"]
          ]
        }
      ]
    },
    {
      id: "relacao_reunioes_entrevistas",
      titulo: "Relação entre reuniões e entrevistas",
      blocos: [
        {
          tipo: "texto",
          texto: "O material destaca que reuniões podem ser utilizadas tanto para organização das equipes quanto para o levantamento propriamente dito dos requisitos. No levantamento, entrevistas também podem ser utilizadas para obter informações dos clientes e do público-alvo."
        },
        {
          tipo: "texto",
          texto: "Além disso, o texto observa que a entrevista não é exclusiva da Engenharia de Software. Ela também é utilizada em áreas como: Psicologia; Sociologia; Medicina. É uma técnica presente na metodologia científica de pesquisa qualitativa."
        }
      ]
    },
    {
      id: "etnografia",
      titulo: "Etnografia",
      blocos: [
        {
          tipo: "texto",
          texto: "A **etnografia** é uma técnica de levantamento de requisitos baseada na **observação direta dos usuários em seu ambiente natural de trabalho**. O objetivo é entender: como os usuários trabalham; como utilizam o sistema existente; como interagem com o sistema; quais dificuldades enfrentam; quais oportunidades de melhoria existem."
        },
        {
          tipo: "destaque",
          texto: "Diferença fundamental: enquanto a entrevista depende principalmente **do que o usuário fala**, a etnografia busca observar **o que o usuário realmente faz**."
        },
        {
          tipo: "subtitulo",
          texto: "Metodologia da etnografia"
        },
        {
          tipo: "texto",
          texto: "A etnografia utiliza **métodos qualitativos** para coletar informações detalhadas sobre: utilização do sistema; práticas de trabalho; atividades diárias; interações dos usuários. O analista realiza uma espécie de imersão no ambiente de trabalho dos usuários."
        },
        {
          tipo: "subtitulo",
          texto: "Observação direta"
        },
        {
          tipo: "texto",
          texto: "Na observação direta, o analista acompanha os usuários enquanto eles executam suas tarefas. Durante essa observação, registra: como utilizam o sistema; dificuldades encontradas; soluções adotadas; comportamentos; atividades realizadas."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de observação direta",
          texto: "O material apresenta o caso de um analista que passa um dia em um hospital observando médicos e enfermeiros utilizando um sistema de prontuário eletrônico.",
          detalhe: "A observação permite compreender melhor as necessidades e dificuldades desses profissionais."
        },
        {
          tipo: "subtitulo",
          texto: "Entrevistas contextuais"
        },
        {
          tipo: "texto",
          texto: "Além da observação, o analista pode realizar **entrevistas contextuais**. Nesse caso, as perguntas são feitas enquanto o usuário está realizando suas atividades. Isso permite: obter informações adicionais; entender melhor o que está acontecendo; esclarecer comportamentos observados; relacionar as respostas diretamente ao contexto da atividade."
        },
        {
          tipo: "destaque",
          texto: "Memorize: **Etnografia = observar + compreender o contexto + eventualmente perguntar durante a atividade.**"
        },
        {
          tipo: "imagem",
          src: "multimidia_etnografia_requisitos",
          pasta: "imagens_engenharia_software/aula_6",
          alt: "Área visual destacada indicando conteúdo multimídia relacionado à observação/etnografia no levantamento de requisitos (Página 14 do PDF)",
          num: 4
        }
      ]
    },
    {
      id: "desafios_etnografia",
      titulo: "Desafios da etnografia",
      blocos: [
        {
          tipo: "texto",
          texto: "A etnografia apresenta alguns desafios importantes."
        },
        {
          tipo: "topico",
          titulo: "1. Tempo e recursos",
          texto: "Observações detalhadas podem exigir bastante tempo, disponibilidade e recursos."
        },
        {
          tipo: "topico",
          titulo: "2. Alteração do comportamento",
          texto: "Os usuários podem modificar seu comportamento simplesmente porque sabem que estão sendo observados. Isso pode prejudicar a validade dos dados coletados."
        },
        {
          tipo: "topico",
          titulo: "3. Interpretação dos dados",
          texto: "Os dados obtidos são predominantemente qualitativos. Por isso, pode ser difícil transformá-los em informações objetivas, úteis e aplicáveis ao desenvolvimento dos requisitos."
        }
      ]
    },
    {
      id: "habilidades_etnografia",
      titulo: "Habilidades necessárias para etnografia",
      blocos: [
        {
          tipo: "tabela",
          titulo: "Quadro 5 – Hard Skills para etnografia",
          colunas: ["Hard Skill", "Descrição"],
          linhas: [
            ["Técnicas de Observação", "Observar detalhadamente e registrar os dados de maneira sistemática"],
            ["Documentação Qualitativa", "Registrar observações e entrevistas de forma clara e organizada"],
            ["Análise Qualitativa", "Analisar dados qualitativos e identificar padrões e insights relevantes"]
          ]
        },
        {
          tipo: "tabela",
          titulo: "Quadro 6 – Soft Skills para etnografia",
          colunas: ["Soft Skill", "Descrição"],
          linhas: [
            ["Empatia", "Compreender e valorizar as perspectivas dos usuários"],
            ["Comunicação", "Realizar entrevistas contextuais e documentar informações corretamente"],
            ["Pensamento Crítico", "Interpretar dados qualitativos e identificar informações relevantes"],
            ["Gerenciamento do Tempo", "Planejar e realizar observações de maneira eficiente"],
            ["Discrição", "Observar de forma não intrusiva para minimizar alterações no comportamento dos usuários"]
          ]
        },
        {
          tipo: "destaque",
          texto: "Ponto importante: a **discrição** é especialmente importante na etnografia porque o analista precisa evitar interferir no comportamento que está tentando observar."
        }
      ]
    },
    {
      id: "analise_documentos",
      titulo: "Análise de documentos",
      blocos: [
        {
          tipo: "texto",
          texto: "A **análise de documentos** é outra técnica de levantamento de requisitos. Consiste em revisar documentos existentes, como: manuais; relatórios; registros de uso. O objetivo é encontrar: requisitos implícitos; requisitos complementares; informações sobre o sistema atual; necessidades que os usuários talvez não mencionem diretamente."
        },
        {
          tipo: "subtitulo",
          texto: "Tipos de documentos analisados"
        },
        {
          tipo: "topico",
          titulo: "Manuais e documentação técnica",
          texto: "Os documentos técnicos do sistema atual podem mostrar: funcionalidades existentes; limitações; características do sistema. A análise de um manual de usuário, por exemplo, pode revelar requisitos funcionais e não funcionais que precisam ser mantidos ou melhorados no novo sistema."
        },
        {
          tipo: "topico",
          titulo: "Relatórios de uso",
          texto: "Os relatórios de uso mostram como o sistema é utilizado na prática. Eles podem ajudar a descobrir: quais funcionalidades são mais utilizadas; onde aparecem problemas frequentes; quais áreas precisam de melhorias; quais novas funcionalidades podem ser necessárias."
        },
        {
          tipo: "topico",
          titulo: "Registros de incidentes e suporte",
          texto: "Registros de incidentes, solicitações de suporte e problemas relatados pelos usuários podem revelar problemas recorrentes e necessidades ainda não atendidas."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de registros de suporte",
          texto: "Se os registros de suporte mostrarem que usuários solicitam repetidamente uma determinada funcionalidade que não existe, isso pode indicar uma necessidade importante para o novo sistema."
        }
      ]
    },
    {
      id: "desafios_analise_documentos",
      titulo: "Desafios da análise de documentos",
      blocos: [
        {
          tipo: "texto",
          texto: "A análise documental apresenta alguns problemas."
        },
        {
          tipo: "topico",
          titulo: "Grande quantidade de informações",
          texto: "Pode ser necessário acessar e interpretar uma quantidade muito grande de documentos."
        },
        {
          tipo: "topico",
          titulo: "Documentos incompletos",
          texto: "Um documento pode não conter todas as informações necessárias."
        },
        {
          tipo: "topico",
          titulo: "Documentos desatualizados",
          texto: "Documentos antigos podem não representar corretamente o funcionamento atual do sistema. Isso pode levar a uma compreensão incorreta dos requisitos."
        },
        {
          tipo: "topico",
          titulo: "Necessidades não documentadas",
          texto: "Nem todas as necessidades dos usuários aparecem em documentos. Por isso, a análise documental pode não ser suficiente sozinha para descobrir tudo aquilo que os usuários precisam."
        }
      ]
    },
    {
      id: "metodos_ageis",
      titulo: "Métodos ágeis e levantamento de requisitos",
      blocos: [
        {
          tipo: "texto",
          texto: "O material também relaciona o levantamento de requisitos aos **métodos ágeis**. Os métodos ágeis procuram soluções criativas e produtivas nas diferentes fases do desenvolvimento de software, incluindo a área de levantamento de requisitos."
        },
        {
          tipo: "destaque",
          texto: "O PDF também recomenda material complementar sobre **User Stories**, destacando sua importância no processo de levantamento de requisitos."
        }
      ]
    },
    {
      id: "comparacao_geral",
      titulo: "Comparação geral e complementaridade das técnicas",
      blocos: [
        {
          tipo: "tabela",
          titulo: "Comparação geral das quatro técnicas",
          colunas: ["Técnica", "Como funciona", "Principal vantagem", "Principal desafio"],
          linhas: [
            ["Entrevista", "Conversa com stakeholders", "Informações detalhadas", "Usuário pode ter dificuldade de expressar necessidades"],
            ["Reunião", "Discussão em grupo", "Colaboração e consenso", "Conflitos e dificuldade de manter o foco"],
            ["Etnografia", "Observação no ambiente real", "Mostra práticas reais", "Exige tempo e pode alterar o comportamento observado"],
            ["Análise documental", "Estudo de documentos existentes", "Revela informações implícitas/complementares", "Documentos podem estar incompletos ou desatualizados"]
          ]
        },
        {
          tipo: "texto",
          texto: "Uma ideia importante do material é que cada técnica consegue revelar um tipo diferente de informação."
        },
        {
          tipo: "topico",
          titulo: "Entrevista",
          texto: "Mostra principalmente: **O que o stakeholder diz que precisa.**"
        },
        {
          tipo: "topico",
          titulo: "Reunião",
          texto: "Permite descobrir: **O que diferentes stakeholders pensam juntos e onde existe consenso ou conflito.**"
        },
        {
          tipo: "topico",
          titulo: "Etnografia",
          texto: "Permite observar: **Como o usuário realmente trabalha e utiliza o sistema.**"
        },
        {
          tipo: "topico",
          titulo: "Análise documental",
          texto: "Permite encontrar: **O que já está registrado e quais informações podem estar implícitas nos documentos existentes.**"
        },
        {
          tipo: "destaque",
          texto: "Portanto, combinar técnicas pode proporcionar uma visão mais completa dos requisitos."
        }
      ]
    },
    {
      id: "hard_soft_skills_gerais",
      titulo: "Hard Skills × Soft Skills e sua importância",
      blocos: [
        {
          tipo: "texto",
          texto: "Essa distinção aparece várias vezes no PDF."
        },
        {
          tipo: "topico",
          titulo: "Hard Skills",
          texto: "São as habilidades **técnicas e específicas**.",
          lista: [
            "conhecimento técnico",
            "documentação",
            "análise de dados",
            "planejamento",
            "facilitação",
            "técnicas de observação",
            "análise qualitativa"
          ]
        },
        {
          tipo: "topico",
          titulo: "Soft Skills",
          texto: "São habilidades **comportamentais e interpessoais**.",
          lista: [
            "comunicação",
            "empatia",
            "pensamento crítico",
            "gerenciamento do tempo",
            "negociação",
            "discrição"
          ]
        },
        {
          tipo: "destaque",
          texto: "Forma fácil de memorizar: **Hard Skill = saber fazer tecnicamente.** **Soft Skill = saber lidar com pessoas e situações.**"
        },
        {
          tipo: "tabela",
          titulo: "Comparação das habilidades por técnica",
          colunas: ["Técnica", "Hard Skills principais", "Soft Skills principais"],
          linhas: [
            ["Entrevistas", "Conhecimento técnico, documentação, análise de dados", "Comunicação, empatia, pensamento crítico, tempo, negociação"],
            ["Reuniões", "Planejamento, facilitação, documentação", "Comunicação, empatia, pensamento crítico, tempo, negociação"],
            ["Etnografia", "Observação, documentação qualitativa, análise qualitativa", "Empatia, comunicação, pensamento crítico, tempo, discrição"]
          ]
        },
        {
          tipo: "texto",
          texto: "Essa comparação mostra que algumas habilidades aparecem repetidamente porque são fundamentais para o trabalho com requisitos."
        },
        {
          tipo: "subtitulo",
          texto: "Importância da comunicação"
        },
        {
          tipo: "texto",
          texto: "A comunicação aparece como uma habilidade fundamental em praticamente todo o processo. O profissional precisa conseguir:"
        },
        {
          tipo: "lista",
          itens: [
            "fazer perguntas claras",
            "ouvir os stakeholders",
            "compreender respostas",
            "identificar problemas",
            "registrar informações",
            "comunicar decisões",
            "lidar com opiniões diferentes",
            "negociar conflitos"
          ]
        },
        {
          tipo: "texto",
          texto: "Isso é especialmente importante porque diferentes stakeholders podem possuir necessidades e interesses divergentes."
        },
        {
          tipo: "subtitulo",
          texto: "Importância da empatia"
        },
        {
          tipo: "texto",
          texto: "A empatia é apresentada como a capacidade de: compreender a perspectiva dos usuários; valorizar suas preocupações; criar confiança; favorecer a colaboração. No levantamento de requisitos, o analista não deve considerar apenas aquilo que é tecnicamente conveniente. É necessário compreender **a perspectiva de quem realmente utiliza ou será afetado pelo sistema**."
        },
        {
          tipo: "subtitulo",
          texto: "Importância do pensamento crítico"
        },
        {
          tipo: "texto",
          texto: "O pensamento crítico permite que o profissional não aceite automaticamente toda informação recebida. É necessário: avaliar respostas; identificar inconsistências; perceber pontos que precisam de esclarecimento; interpretar dados; identificar padrões; buscar informações adicionais quando necessário. Essa habilidade aparece nas entrevistas, reuniões e etnografia."
        },
        {
          tipo: "subtitulo",
          texto: "Importância do gerenciamento do tempo"
        },
        {
          tipo: "texto",
          texto: "O gerenciamento do tempo aparece nas diferentes técnicas porque o levantamento precisa ser eficiente. O profissional deve conseguir: manter o foco; abordar assuntos importantes; evitar desvios; organizar observações; planejar reuniões; aproveitar adequadamente o tempo dos stakeholders."
        },
        {
          tipo: "subtitulo",
          texto: "Importância da negociação"
        },
        {
          tipo: "texto",
          texto: "A negociação é especialmente importante quando existem: requisitos conflitantes; interesses divergentes; diferentes expectativas entre stakeholders. O objetivo é encontrar **compromissos que permitam satisfazer as necessidades dos envolvidos**, sempre buscando um requisito coerente e viável para o projeto."
        }
      ]
    },
    {
      id: "visuais_e_quadros",
      titulo: "Visuais e quadros presentes no PDF",
      blocos: [
        {
          tipo: "texto",
          texto: "O material possui diversos elementos visuais além do texto, catalogados a seguir com página e identificador."
        },
        {
          tipo: "topico",
          titulo: "Capa do módulo (Página 1)",
          texto: "A capa apresenta o título 'Técnicas de levantamento de requisitos', com uma composição visual relacionada ao uso de computador e tecnologia. id: `capa_tecnicas_levantamento_requisitos`."
        },
        {
          tipo: "topico",
          titulo: "Ilustração relacionada à entrevista (Página 7)",
          texto: "Há uma ilustração mostrando pessoas em uma situação de conversa/interação, associada ao conteúdo sobre entrevistas e levantamento de informações. A representação reforça visualmente a ideia de **interação entre pessoas durante o processo de obtenção de informações**. id: `representacao_visual_entrevista_stakeholders`."
        },
        {
          tipo: "topico",
          titulo: "Quadro 1 (Página 10)",
          texto: "'Lista das hard skills necessárias ao profissional que trabalha com requisitos'. Apresenta as hard skills: Conhecimento Técnico; Documentação; Análise de Dados, cada uma acompanhada de sua respectiva descrição. id: `quadro_1_hard_skills_requisitos`."
        },
        {
          tipo: "topico",
          titulo: "Quadro 2 (Página 10)",
          texto: "'Lista das hard skills necessárias ao profissional que trabalha com requisitos' — apesar do título apresentado no documento, este quadro contém as **soft skills**: Comunicação; Empatia; Pensamento Crítico; Gerenciamento do Tempo; Negociação. id: `quadro_2_soft_skills_requisitos`."
        },
        {
          tipo: "topico",
          titulo: "Quadro 3 (Página 12)",
          texto: "'Quadro de hard skills para condução de reuniões'. Apresenta: Planejamento de Reuniões; Facilitação de Grupos; Documentação. id: `quadro_3_hard_skills_reunioes`."
        },
        {
          tipo: "topico",
          titulo: "Quadro 4 (Página 12)",
          texto: "'Quadro de soft skills para condução de reuniões'. Apresenta: Comunicação; Empatia; Pensamento Crítico; Gerenciamento do Tempo; Negociação. id: `quadro_4_soft_skills_reunioes`."
        },
        {
          tipo: "topico",
          titulo: "Seção multimídia sobre entrevistas (Página 13)",
          texto: "O material apresenta uma área visual destacada para conteúdo multimídia relacionado às entrevistas e à elicitação de requisitos, incluindo referência ao material de Gilleanes Guedes. id: `multimidia_entrevistas_elicitacao`."
        },
        {
          tipo: "topico",
          titulo: "Seção multimídia sobre etnografia (Página 14)",
          texto: "Há uma área visual destacada indicando conteúdo multimídia relacionado à observação/etnografia no levantamento de requisitos. id: `multimidia_etnografia_requisitos`."
        },
        {
          tipo: "topico",
          titulo: "Quadro 5 (Página 15)",
          texto: "'Quadro de soft skills para condução de reuniões' — o próprio título do quadro aparece dessa maneira no material, embora seu conteúdo corresponda às **hard skills para etnografia**: Técnicas de Observação; Documentação Qualitativa; Análise Qualitativa. id: `quadro_5_hard_skills_etnografia`."
        },
        {
          tipo: "topico",
          titulo: "Quadro 6 (Página 15)",
          texto: "'Quadro de soft skills para condução de reuniões'. O quadro apresenta as soft skills necessárias para etnografia: Empatia; Comunicação; Pensamento Crítico; Gerenciamento do Tempo; Discrição. id: `quadro_6_soft_skills_etnografia`."
        }
      ]
    },
    {
      id: "pontos_fundamentais",
      titulo: "Pontos fundamentais para estudar",
      blocos: [
        {
          tipo: "texto",
          texto: "Se a prova cobrar os conceitos centrais dessa aula, estes são os pontos que você precisa dominar:"
        },
        {
          tipo: "topico",
          titulo: "Levantamento de requisitos",
          texto: "É a etapa responsável por **coletar e analisar as necessidades e expectativas dos envolvidos no projeto**."
        },
        {
          tipo: "topico",
          titulo: "Quatro técnicas",
          texto: "**Entrevistas → Reuniões → Etnografia → Análise de documentos.**"
        },
        {
          tipo: "topico",
          titulo: "Entrevistas",
          lista: [
            "Estruturadas → roteiro rígido",
            "Semiestruturadas → roteiro + flexibilidade",
            "Não estruturadas → conversa aberta"
          ]
        },
        {
          tipo: "topico",
          titulo: "Reuniões",
          lista: [
            "Brainstorming → gerar ideias",
            "Análise e revisão → revisar/refinar requisitos",
            "Workshop → colaboração estruturada e atividades práticas"
          ]
        },
        {
          tipo: "topico",
          titulo: "Etnografia",
          texto: "**Observar o usuário em seu ambiente natural de trabalho.** Possui: observação direta; entrevistas contextuais."
        },
        {
          tipo: "topico",
          titulo: "Análise de documentos",
          texto: "Analisa principalmente: manuais/documentação técnica; relatórios de uso; registros de incidentes e suporte."
        },
        {
          tipo: "topico",
          titulo: "Hard Skills",
          texto: "**Técnicas/conhecimentos que podem ser desenvolvidos e medidos.**"
        },
        {
          tipo: "topico",
          titulo: "Soft Skills",
          texto: "**Habilidades comportamentais e interpessoais.**"
        },
        {
          tipo: "topico",
          titulo: "Desafios",
          lista: [
            "conflitos entre stakeholders",
            "dificuldade de expressar necessidades",
            "falta de participação",
            "perda de foco",
            "alteração de comportamento durante observação",
            "documentos incompletos",
            "documentos desatualizados",
            "interpretação de dados qualitativos"
          ]
        }
      ]
    },
    {
      id: "mapa_mental",
      titulo: "Mapa mental da aula",
      blocos: [
        {
          tipo: "texto",
          texto: "`TÉCNICAS DE LEVANTAMENTO DE REQUISITOS` — estrutura hierárquica apresentada no material:"
        },
        {
          tipo: "topico",
          titulo: "LEVANTAMENTO DE REQUISITOS",
          lista: [
            "Coletar necessidades",
            "Compreender expectativas",
            "Identificar funcionalidades",
            "Reduzir retrabalho",
            "Melhorar qualidade"
          ]
        },
        {
          tipo: "topico",
          titulo: "ENTREVISTAS",
          lista: [
            "Estruturadas → Roteiro rígido",
            "Semiestruturadas → Roteiro + flexibilidade",
            "Não estruturadas → Conversa aberta"
          ]
        },
        {
          tipo: "topico",
          titulo: "REUNIÕES",
          lista: [
            "Brainstorming → Gerar ideias",
            "Análise e revisão → Refinar requisitos",
            "Workshops → Colaboração estruturada"
          ]
        },
        {
          tipo: "topico",
          titulo: "ETNOGRAFIA",
          lista: [
            "Observação direta",
            "Entrevistas contextuais",
            "Ambiente natural",
            "Práticas reais dos usuários"
          ]
        },
        {
          tipo: "topico",
          titulo: "ANÁLISE DE DOCUMENTOS",
          lista: [
            "Manuais",
            "Relatórios de uso",
            "Incidentes e suporte"
          ]
        },
        {
          tipo: "topico",
          titulo: "HABILIDADES — HARD SKILLS",
          lista: [
            "Conhecimento técnico",
            "Documentação",
            "Análise",
            "Observação"
          ]
        },
        {
          tipo: "topico",
          titulo: "HABILIDADES — SOFT SKILLS",
          lista: [
            "Comunicação",
            "Empatia",
            "Pensamento crítico",
            "Gerenciamento do tempo",
            "Negociação",
            "Discrição"
          ]
        }
      ]
    },
    {
      id: "resumo_final",
      titulo: "Resumo final da Aula 6",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Levantamento de Requisitos** é uma etapa crítica da Engenharia de Requisitos porque permite compreender as necessidades dos usuários e stakeholders antes e durante o desenvolvimento do software. O PDF apresenta quatro técnicas principais."
        },
        {
          tipo: "texto",
          texto: "**Entrevistas** permitem obter informações detalhadas diretamente dos stakeholders. Podem ser estruturadas, semiestruturadas ou não estruturadas."
        },
        {
          tipo: "texto",
          texto: "**Reuniões** possibilitam a participação de vários stakeholders, facilitando colaboração, discussão, geração de ideias, revisão e consenso. Entre seus formatos estão brainstorming, análise e revisão e workshops."
        },
        {
          tipo: "texto",
          texto: "**Etnografia** busca compreender o trabalho real dos usuários por meio da observação direta em seu ambiente natural, podendo utilizar entrevistas contextuais para complementar as observações."
        },
        {
          tipo: "texto",
          texto: "**Análise de documentos** examina materiais já existentes, como manuais, relatórios de uso e registros de incidentes e suporte, permitindo descobrir requisitos implícitos e complementares."
        },
        {
          tipo: "texto",
          texto: "Para executar essas técnicas adequadamente, o profissional precisa combinar **hard skills**, relacionadas aos conhecimentos e capacidades técnicas, com **soft skills**, relacionadas à comunicação, empatia, pensamento crítico, negociação, gerenciamento do tempo e outras capacidades interpessoais."
        },
        {
          tipo: "destaque",
          texto: "Por fim, o material reforça que o levantamento de requisitos não deve ser tratado como uma atividade isolada: ele é um **processo contínuo ao longo do ciclo de vida do software**, exigindo comunicação eficaz, precisão, colaboração e atualização constante dos requisitos."
        }
      ]
    }
  ]
  },

  ]};