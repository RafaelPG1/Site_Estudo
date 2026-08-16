/* =============================================
   NEXUS STUDY — res_analise_projeto.js
   Disciplina: analise de projeto
   ============================================= */

window.__nexusConteudo = {
  aulas: [
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
  
    

  ]};