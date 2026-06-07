  /* =============================================
   NEXUS STUDY — res_design.js
   Disciplina: Design de Sistemas
   ============================================= */

window.__nexusConteudo = {
  aulas: [
  // Aula 9 — Prototipagem e Norma ISO 9241
  {
  aula: "Aula 9 — Prototipagem e Norma ISO 9241",
  ideia_central: "Os modelos de ciclo de vida de software evoluíram de abordagens sequenciais e rígidas para métodos centrados no usuário, culminando no Design Thinking e na Norma ISO 9241, que estabelece princípios de ergonomia, usabilidade e interação humano-computador para garantir interfaces mais eficientes e agradáveis.",
  secoes: [
  {
  id: "visao",
  titulo: "🧭 Visão Geral do Conteúdo",
  blocos: [
  {
  tipo: "texto",
  texto: "O material aborda os principais modelos de ciclo de vida de software, diferenciando abordagens centradas no produto e centradas no usuário. Também apresenta conceitos de Design Thinking, desenvolvimento ágil e os princípios da Norma ISO 9241, focada em usabilidade e ergonomia de interfaces."
  },
  {
  tipo: "texto",
  texto: "O conteúdo busca mostrar como os processos de desenvolvimento evoluíram: de modelos rígidos e sequenciais, para abordagens mais flexíveis, até métodos focados na experiência e necessidades do usuário."
  },
  {
  tipo: "lista",
  titulo: "Temas principais:",
  itens: [
  "Modelos tradicionais de desenvolvimento: Cascata, Espiral, Iterativo",
  "Modelos centrados no usuário: Modelo Estrela, Modelo de Shneiderman",
  "Design Thinking",
  "Norma ISO 9241",
  "Usabilidade e ergonomia de interfaces"
  ]
  }
  ]
  },
      {
        id: "ciclo_vida",
        titulo: "🔄 Ciclo de Vida de Software",
        blocos: [
          {
            tipo: "texto",
            texto: "O **ciclo de vida** representa o conjunto de etapas utilizadas no desenvolvimento de um software, desde o planejamento até sua utilização final."
          },
          {
            tipo: "lista",
            titulo: "Objetivos:",
            itens: [
              "Organizar o desenvolvimento",
              "Controlar custos e prazos",
              "Garantir qualidade",
              "Reduzir erros",
              "Melhorar a experiência do usuário"
            ]
          },
          {
            tipo: "tabela",
            titulo: "Duas abordagens principais",
            colunas: ["Abordagem", "Foco"],
            linhas: [
              ["Centrada no produto", "Construção do sistema"],
              ["Centrada no usuário", "Experiência e necessidades do usuário"]
            ]
          }
        ]
      },

      {
        id: "modelos_produto",
        titulo: "🏗️ Modelos Centrados no Produto",
        blocos: [
          {
            tipo: "subtitulo",
            texto: "Modelo Cascata"
          },
          {
            tipo: "texto",
            texto: "É um modelo sequencial, rígido e linear. Uma etapa só começa quando a anterior termina."
          },
          {
            tipo: "lista",
            titulo: "Etapas:",
            itens: [
              "Definição de requisitos",
              "Projeto",
              "Implementação e testes unitários",
              "Testes de integração",
              "Operação e manutenção"
            ]
          },
          {
            tipo: "topico",
            titulo: "Características",
            lista: [
              "Forte controle organizacional",
              "Fácil gerenciamento",
              "Processo previsível"
            ]
          },
          {
            tipo: "topico",
            titulo: "Desvantagens",
            lista: [
              "Pouca flexibilidade",
              "Mudanças são difíceis",
              "Usuário participa apenas no início",
              "Problemas podem ser descobertos somente no final",
              "Alto retrabalho"
            ]
          },
          {
            tipo: "topico",
            titulo: "Quando funciona melhor",
            lista: [
              "Projetos simples",
              "Requisitos muito bem definidos"
            ]
          },
          {
            tipo: "imagem",
            src: "figura_modelo_cascata_iso9241.png",
            pasta: "imagens_design/aula_09",
            alt: "Figura 1 — Modelo cascata: fluxo sequencial evidenciando que cada etapa depende da conclusão da anterior",
            num: 1
          },

          {
            tipo: "subtitulo",
            texto: "Modelo Espiral"
          },
          {
            tipo: "texto",
            texto: "Modelo que combina prototipagem, análise de riscos e interação com o cliente. O desenvolvimento ocorre em ciclos."
          },
          {
            tipo: "lista",
            titulo: "Etapas:",
            itens: [
              "Planejamento",
              "Análise de riscos",
              "Engenharia",
              "Avaliação do cliente"
            ]
          },
          {
            tipo: "topico",
            titulo: "Características",
            lista: [
              "Uso de protótipos",
              "Feedback constante",
              "Redução de riscos"
            ]
          },
          {
            tipo: "topico",
            titulo: "Vantagens",
            lista: [
              "Maior flexibilidade",
              "Correção antecipada de erros",
              "Participação do cliente"
            ]
          },
          {
            tipo: "topico",
            titulo: "Desvantagens",
            lista: [
              "Mais complexo",
              "Pode aumentar custos"
            ]
          },
          {
            tipo: "imagem",
            src: "figura_modelo_espiral_iso9241.png",
            pasta: "imagens_design/aula_09",
            alt: "Figura 2 — Modelo espiral: ciclo de planejamento, análise de riscos, engenharia e avaliação do cliente",
            num: 2
          },

          {
            tipo: "subtitulo",
            texto: "Modelo Iterativo"
          },
          {
            tipo: "texto",
            texto: "Baseado em repetição, refinamento contínuo e melhoria incremental. O software evolui em várias versões."
          },
          {
            tipo: "lista",
            titulo: "Estrutura principal:",
            itens: [
              "Planejamento inicial",
              "Modelagem de negócios",
              "Requisitos",
              "Análise e design",
              "Implementação",
              "Testes",
              "Avaliação",
              "Implantação"
            ]
          },
          {
            tipo: "topico",
            titulo: "Características",
            lista: [
              "Correção contínua",
              "Fácil adaptação",
              "Reutilização",
              "Participação do usuário"
            ]
          },
          {
            tipo: "topico",
            titulo: "Diferença para o modelo espiral",
            texto: "No modelo iterativo, as repetições podem ocorrer antes da implementação e existe evolução contínua do sistema."
          },
          {
            tipo: "imagem",
            src: "figura_modelo_iterativo_iso9241.png",
            pasta: "imagens_design/aula_09",
            alt: "Figura 3 — Modelo iterativo: processo iterativo com repetição contínua entre planejamento, implementação, testes e implantação",
            num: 3
          }
        ]
      },

      {
        id: "modelos_usuario",
        titulo: "👤 Modelos Centrados no Usuário",
        blocos: [
          {
            tipo: "texto",
            texto: "Esses modelos priorizam usabilidade, experiência do usuário, facilidade de uso e aspectos cognitivos e emocionais."
          },

          {
            tipo: "subtitulo",
            texto: "Modelo Estrela"
          },
          {
            tipo: "texto",
            texto: "Modelo centrado na **avaliação constante do usuário**. A avaliação é o núcleo do processo."
          },
          {
            tipo: "topico",
            titulo: "Características",
            lista: [
              "Qualquer etapa pode iniciar o projeto",
              "Forte participação do usuário",
              "Alta flexibilidade"
            ]
          },
          {
            tipo: "lista",
            titulo: "Etapas:",
            itens: [
              "Implementação",
              "Análise de tarefas",
              "Prototipagem",
              "Projeto conceitual",
              "Especificação de requisitos",
              "Avaliação"
            ]
          },
          {
            tipo: "topico",
            titulo: "Desvantagem",
            texto: "Pouca adoção por empresas."
          },
          {
            tipo: "imagem",
            src: "figura_modelo_estrela_iso9241.png",
            pasta: "imagens_design/aula_09",
            alt: "Figura 4 — Modelo estrela: avaliação como elemento central do desenvolvimento centrado no usuário",
            num: 4
          },

          {
            tipo: "subtitulo",
            texto: "Modelo de Shneiderman"
          },
          {
            tipo: "tabela",
            titulo: "Três pilares do modelo",
            colunas: ["Pilar", "Função"],
            linhas: [
              ["Especificação", "Define layout, cores, dispositivos e ações"],
              ["Prototipagem", "Criação de protótipos para avaliação"],
              ["Testes de usabilidade", "Avaliação da interação e facilidade de uso"]
            ]
          },
          {
            tipo: "topico",
            titulo: "Objetivos",
            lista: [
              "Melhorar interação humano-computador",
              "Garantir usabilidade",
              "Facilitar navegação"
            ]
          },
          {
            tipo: "imagem",
            src: "figura_modelo_shneiderman_iso9241.png",
            pasta: "imagens_design/aula_09",
            alt: "Figura 5 — Modelo de Shneiderman: pilares de especificação, prototipagem e testes de usabilidade",
            num: 5
          }
        ]
      },

      {
        id: "agil",
        titulo: "⚡ Desenvolvimento Ágil",
        blocos: [
          {
            tipo: "texto",
            texto: "O **Manifesto Ágil** (2001) foi criado para substituir modelos rígidos como o cascata."
          },
          {
            tipo: "lista",
            titulo: "Princípios centrais do Manifesto Ágil:",
            itens: [
              "Pessoas e interações acima de processos",
              "Software funcionando acima de documentação extensa",
              "Colaboração do cliente acima de contratos rígidos",
              "Respostas rápidas às mudanças"
            ]
          },
          {
            tipo: "topico",
            titulo: "Objetivo",
            texto: "Criar desenvolvimento mais leve, flexível e colaborativo."
          }
        ]
      },

      {
        id: "design_thinking",
        titulo: "💡 Design Thinking",
        blocos: [
          {
            tipo: "texto",
            texto: "Abordagem focada no ser humano, na criatividade, na inovação e na empatia. Vai além da funcionalidade técnica."
          },
          {
            tipo: "topico",
            titulo: "Empatia",
            texto: "Entender emoções, desejos e necessidades do usuário."
          },
          {
            tipo: "topico",
            titulo: "Interdisciplinaridade",
            texto: "Integra design, gestão, engenharia, tecnologia e negócios."
          },
          {
            tipo: "topico",
            titulo: "Experimentação",
            texto: "Estimula criatividade, testes, protótipos e inovação."
          },
          {
            tipo: "tabela",
            titulo: "Princípios do Design Thinking",
            colunas: ["Princípio", "Explicação"],
            linhas: [
              ["Centrado no usuário", "Desenvolvedor pensa como o cliente"],
              ["Cocriativo", "Soluções criadas colaborativamente"],
              ["Sequencial", "Processo dividido em etapas"],
              ["Evidente", "Experiência deve ser memorável"],
              ["Holístico", "Visão geral do projeto"]
            ]
          }
        ]
      },

      {
        id: "usabilidade",
        titulo: "🖱️ Usabilidade",
        blocos: [
          {
            tipo: "texto",
            texto: "Usabilidade é a facilidade com que um usuário consegue utilizar um sistema."
          },
          {
            tipo: "lista",
            titulo: "Aspectos analisados:",
            itens: [
              "Facilidade de aprendizagem",
              "Eficiência",
              "Satisfação",
              "Prevenção de erros",
              "Intuitividade"
            ]
          }
        ]
      },

      {
        id: "iso9241",
        titulo: "📋 Norma ISO 9241",
        blocos: [
          {
            tipo: "texto",
            texto: "Norma internacional voltada para ergonomia, usabilidade e interação humano-computador. Objetivo: garantir interfaces mais eficientes e agradáveis."
          },
          {
            tipo: "tabela",
            titulo: "Conceitos Fundamentais da ISO 9241",
            colunas: ["Conceito", "Definição"],
            linhas: [
              ["Usuário", "Pessoa que utiliza o sistema"],
              ["Contexto", "Ambiente e condições de uso"],
              ["Eficácia", "Usuário consegue atingir objetivo"],
              ["Eficiência", "Objetivo atingido com pouco esforço"],
              ["Satisfação", "Qualidade da experiência do usuário"]
            ]
          }
        ]
      },

      {
        id: "iso_parte10",
        titulo: "🔟 Parte 10 da ISO 9241 — Princípios de Diálogo",
        blocos: [
          {
            tipo: "destaque",
            texto: "📌 A Parte 10 é a mais importante da norma para provas."
          },

          {
            tipo: "topico",
            titulo: "1. Adequação à tarefa",
            lista: [
              "Facilitar execução das tarefas",
              "Reduzir esforço",
              "Fornecer ajuda adequada"
            ]
          },

          {
            tipo: "topico",
            titulo: "2. Autodescrição",
            lista: [
              "A interface deve explicar-se sozinha",
              "Fornecer feedback imediato",
              "Evitar necessidade de manuais"
            ]
          },

          {
            tipo: "topico",
            titulo: "3. Controle",
            lista: [
              "O usuário deve controlar ações",
              "Desfazer operações",
              "Retomar tarefas",
              "Controlar velocidade da interação"
            ]
          },

          {
            tipo: "topico",
            titulo: "4. Conformidade com expectativas",
            lista: [
              "Seguir padrões conhecidos",
              "Manter consistência",
              "Usar linguagem familiar"
            ]
          },

          {
            tipo: "topico",
            titulo: "5. Tolerância a erros",
            lista: [
              "Prevenir erros",
              "Ajudar na correção",
              "Avisar consequências importantes"
            ]
          },

          {
            tipo: "topico",
            titulo: "6. Adequação à individualização",
            lista: [
              "Permitir personalização",
              "Adaptação ao usuário",
              "Ajustes conforme experiência e preferências"
            ]
          },

          {
            tipo: "topico",
            titulo: "7. Adequação ao aprendizado",
            lista: [
              "Facilitar aprendizado",
              "Permitir reaprendizagem",
              "Ensinar durante o uso"
            ]
          }
        ]
      },

      {
        id: "iso_partes_11a17",
        titulo: "📑 Partes 11 a 17 da ISO 9241",
        blocos: [
          {
            tipo: "tabela",
            titulo: "Demais partes da norma",
            colunas: ["Parte", "Tema"],
            linhas: [
              ["Parte 11", "Especificação da usabilidade"],
              ["Parte 12", "Apresentação da informação"],
              ["Parte 13", "Condução do usuário"],
              ["Parte 14", "Diálogo por menu"],
              ["Parte 15", "Linguagem de comandos"],
              ["Parte 16", "Manipulação direta"],
              ["Parte 17", "Formulários"]
            ]
          }
        ]
      },

      {
        id: "formulas_metodos",
        titulo: "📐 Fórmulas e Métodos",
        blocos: [
          {
            tipo: "texto",
            texto: "O conteúdo não possui fórmulas matemáticas, mas apresenta métodos e princípios importantes."
          },
          {
            tipo: "topico",
            titulo: "Método Cascata",
            texto: "Fluxo linear e sequencial."
          },
          {
            tipo: "topico",
            titulo: "Método Espiral",
            lista: [
              "Prototipagem",
              "Testes",
              "Análise de riscos"
            ]
          },
          {
            tipo: "topico",
            titulo: "Método Iterativo",
            texto: "Repetição contínua para melhoria do sistema."
          },
          {
            tipo: "topico",
            titulo: "Design Thinking",
            lista: [
              "Empatia",
              "Colaboração",
              "Experimentação"
            ]
          },
          {
            tipo: "topico",
            titulo: "ISO 9241",
            lista: [
              "Ergonomia",
              "Usabilidade",
              "Interação humano-computador"
            ]
          }
        ]
      },

      {
        id: "exemplos",
        titulo: "💬 Exemplos Explicativos",
        blocos: [
          {
            tipo: "exemplo",
            titulo: "Modelo Cascata",
            texto: "Um sistema só passa para testes após concluir completamente a implementação.",
            detalhe: "Problema: se surgir erro de usabilidade no final, o sistema pode precisar ser refeito."
          },
          {
            tipo: "exemplo",
            titulo: "Modelo Espiral",
            texto: "Protótipos são apresentados ao cliente em várias etapas.",
            detalhe: "Benefício: erros são encontrados mais cedo."
          },
          {
            tipo: "exemplo",
            titulo: "Adequação ao Aprendizado (ISO 9241)",
            texto: "O Word permite adicionar palavras ao dicionário.",
            detalhe: "Isso facilita aprendizado, adaptação e personalização da experiência."
          },
          {
            tipo: "exemplo",
            titulo: "Controle (ISO 9241)",
            texto: "O Photoshop permite desfazer ações pelo histórico.",
            detalhe: "Isso aumenta o controle do usuário, a liberdade criativa e a segurança."
          }
        ]
      },

      {
        id: "resumo",
        titulo: "🧾 Resumo Final para Revisão Rápida",
        blocos: [
          {
            tipo: "subtitulo",
            texto: "Modelos Centrados no Produto"
          },
          {
            tipo: "topico",
            titulo: "Cascata",
            lista: ["Sequencial", "Rígido", "Pouca flexibilidade"]
          },
          {
            tipo: "topico",
            titulo: "Espiral",
            lista: ["Prototipagem", "Análise de riscos", "Feedback do cliente"]
          },
          {
            tipo: "topico",
            titulo: "Iterativo",
            lista: ["Repetição contínua", "Melhoria gradual"]
          },

          {
            tipo: "subtitulo",
            texto: "Modelos Centrados no Usuário"
          },
          {
            tipo: "lista",
            titulo: "Foco:",
            itens: ["Experiência do usuário", "Usabilidade", "Necessidades humanas"]
          },
          {
            tipo: "topico",
            titulo: "Modelo Estrela",
            texto: "Avaliação constante do usuário como núcleo do processo."
          },
          {
            tipo: "topico",
            titulo: "Modelo de Shneiderman",
            lista: ["Especificação", "Prototipagem", "Testes de usabilidade"]
          },

          {
            tipo: "subtitulo",
            texto: "Design Thinking"
          },
          {
            tipo: "lista",
            titulo: "Características:",
            itens: ["Empatia", "Criatividade", "Colaboração", "Interdisciplinaridade"]
          },
          {
            tipo: "lista",
            titulo: "Princípios:",
            itens: ["Centrado no usuário", "Cocriativo", "Sequencial", "Evidente", "Holístico"]
          },

          {
            tipo: "subtitulo",
            texto: "ISO 9241"
          },
          {
            tipo: "lista",
            titulo: "Conceitos:",
            itens: ["Eficácia", "Eficiência", "Satisfação"]
          },
          {
            tipo: "lista",
            titulo: "7 Princípios da Parte 10:",
            itens: [
              "Adequação à tarefa",
              "Autodescrição",
              "Controle",
              "Conformidade com expectativas",
              "Tolerância a erros",
              "Adequação à individualização",
              "Adequação ao aprendizado"
            ]
          },

          {
            tipo: "destaque",
            texto: "📌 Pontos mais importantes para provas: diferença entre modelos centrados no produto e no usuário · características do modelo cascata · papel da prototipagem no modelo espiral · participação do usuário no modelo estrela · princípios do Design Thinking · Manifesto Ágil · conceitos de eficácia, eficiência e satisfação · os 7 princípios da ISO 9241 Parte 10."
          }
        ]
      }
    ]
  },
  //Aula 10 — Design de Interfaces e Prototipação
  {
  aula: "Aula 10 — Design de Interfaces e Prototipação",
  ideia_central: "O design de interfaces eficaz exige abordagem centrada no usuário, com atenção a usabilidade, ergonomia e comunicabilidade, e se materializa por meio de modelos conceituais, físicos e ferramentas de prototipação como wireframes, mockups e plataformas como NinjaMock e Figma.",
  secoes: [
  {
  id: "visao",
  titulo: "🧭 Visão Geral do Conteúdo",
  blocos: [
  {
  tipo: "texto",
  texto: "O material aborda os principais conceitos relacionados ao design de interfaces, design centrado no usuário e prototipação de sistemas."
  },
  {
  tipo: "lista",
  titulo: "Foco principal:",
  itens: [
  "Compreender como criar interfaces intuitivas",
  "Estruturar modelos conceituais",
  "Transformar ideias em protótipos",
  "Aplicar wireframes e mockups",
  "Utilizar ferramentas práticas como NinjaMock e Figma",
  "Melhorar a experiência do usuário (UX)"
  ]
  },
  {
  tipo: "lista",
  titulo: "O desenvolvimento de interfaces deve considerar:",
  itens: [
  "Usabilidade",
  "Ergonomia",
  "Interação homem-máquina",
  "Comunicação visual",
  "Organização de componentes",
  "Experiência do usuário"
  ]
  }
  ]
  },
      {
        id: "design_centrado_usuario",
        titulo: "👤 Design Centrado no Usuário",
        blocos: [
          {
            tipo: "texto",
            texto: "O design centrado no usuário busca desenvolver sistemas focados nas necessidades reais das pessoas."
          },
          {
            tipo: "topico",
            titulo: "Objetivos principais",
            lista: [
              "Garantir usabilidade",
              "Melhorar a ergonomia",
              "Criar interfaces intuitivas",
              "Facilitar a aprendizagem do sistema",
              "Reduzir necessidade de manuais",
              "Simular elementos do mundo real para gerar familiaridade"
            ]
          },
          {
            tipo: "topico",
            titulo: "Responsabilidades do designer",
            lista: [
              "Analisar comportamento dos usuários",
              "Compreender contexto de uso",
              "Considerar limitações tecnológicas e financeiras",
              "Definir requisitos funcionais e não funcionais",
              "Estruturar funções da equipe",
              "Organizar sequência de exibição dos elementos"
            ]
          },
          {
            tipo: "subtitulo",
            texto: "Conceitos importantes"
          },
          {
            tipo: "topico",
            titulo: "Usabilidade",
            texto: "Capacidade do sistema permitir que o usuário realize tarefas de forma eficiente."
          },
          {
            tipo: "topico",
            titulo: "Ergonomia",
            texto: "Adequação da interface às capacidades humanas físicas e cognitivas."
          },
          {
            tipo: "topico",
            titulo: "Comunicabilidade",
            texto: "Clareza da comunicação entre sistema e usuário."
          },
          {
            tipo: "topico",
            titulo: "Interação intuitiva",
            texto: "Usuário aprende utilizando o sistema naturalmente."
          }
        ]
      },

      {
        id: "modelos_conceituais",
        titulo: "🧠 Modelos Conceituais",
        blocos: [
          {
            tipo: "texto",
            texto: "Modelos conceituais representam funções, relações e interações de um sistema."
          },
          {
            tipo: "topico",
            titulo: "Eles ajudam:",
            lista: [
              "No entendimento do sistema",
              "No desenvolvimento das interfaces",
              "Na representação da interação usuário-sistema"
            ]
          },
          {
            tipo: "topico",
            titulo: "Características",
            lista: [
              "Utilizam associações mentais",
              "Representam conexões semânticas",
              "Criam metáforas visuais",
              "Aproximam sistema e mundo real"
            ]
          },
          {
            tipo: "topico",
            titulo: "Ferramentas utilizadas",
            lista: [
              "Diagramas UML",
              "Diagramas de caso de uso",
              "Diagramas de sequência",
              "Modelos entidade-relacionamento",
              "Rich Picture"
            ]
          },
          {
            tipo: "subtitulo",
            texto: "UML (Unified Modeling Language)"
          },
          {
            tipo: "texto",
            texto: "Linguagem de modelagem baseada em orientação a objetos."
          },
          {
            tipo: "topico",
            titulo: "Utilizada para:",
            lista: [
              "Representar estruturas",
              "Descrever comportamentos",
              "Organizar aspectos do software"
            ]
          },
          {
            tipo: "imagem",
            src: "figura_rich_picture_modelo.png",
            pasta: "imagens_design/aula_10",
            alt: "Figura 1 — Exemplo de modelo Rich Picture: demonstra relações conceituais entre entidades e conexões do sistema",
            num: 1
          }
        ]
      },

      {
        id: "tipos_interacao",
        titulo: "🖱️ Tipos de Interação nos Modelos Conceituais",
        blocos: [
          {
            tipo: "topico",
            titulo: "Instrução",
            lista: [
              "Usuário envia comandos ao sistema",
              "Cliques",
              "Voz",
              "Teclado",
              "Botões",
              "Setas"
            ]
          },
          {
            tipo: "topico",
            titulo: "Conversação",
            lista: [
              "Interação por diálogo usando texto, voz ou inteligência artificial"
            ]
          },
          {
            tipo: "topico",
            titulo: "Manipulação e navegação",
            lista: [
              "Usuário manipula objetos virtuais diretamente",
              "Exemplos: arrastar, mover, reorganizar elementos"
            ]
          },
          {
            tipo: "topico",
            titulo: "Exploração e pesquisa",
            texto: "Sistema guia o usuário passo a passo."
          }
        ]
      },

      {
        id: "modelos_fisicos",
        titulo: "🏗️ Modelos Físicos",
        blocos: [
          {
            tipo: "texto",
            texto: "O design físico transforma o modelo conceitual em algo concreto."
          },
          {
            tipo: "topico",
            titulo: "Pode ser:",
            lista: [
              "Protótipo",
              "Interface final",
              "Produto implementado"
            ]
          },
          {
            tipo: "subtitulo",
            texto: "Tipos de design físico"
          },
          {
            tipo: "topico",
            titulo: "Operacional",
            lista: [
              "Define o funcionamento do sistema",
              "Define a estrutura dos dados",
              "Define o armazenamento"
            ]
          },
          {
            tipo: "topico",
            titulo: "Representacional",
            lista: [
              "Define a aparência visual",
              "Define a estética",
              "Define os elementos gráficos"
            ]
          },
          {
            tipo: "topico",
            titulo: "De interação",
            lista: [
              "Define a organização funcional",
              "Define a sequência das ações",
              "Define o fluxo de uso"
            ]
          }
        ]
      },

      {
        id: "problemas_usabilidade",
        titulo: "⚠️ Problemas de Usabilidade",
        blocos: [
          {
            tipo: "topico",
            titulo: "Barreiras",
            lista: [
              "Impedem realização da tarefa",
              "Exemplo: formato incompatível de arquivo"
            ]
          },
          {
            tipo: "topico",
            titulo: "Obstáculos",
            lista: [
              "Usuário consegue realizar a ação, mas com dificuldade",
              "Exemplo: excesso de propagandas"
            ]
          },
          {
            tipo: "topico",
            titulo: "Ruídos",
            lista: [
              "Geram dúvidas ou confusão",
              "Exemplo: informações pouco claras"
            ]
          },
          {
            tipo: "subtitulo",
            texto: "Classificação dos problemas"
          },
          {
            tipo: "topico",
            titulo: "Gerais",
            texto: "Afetam qualquer usuário."
          },
          {
            tipo: "topico",
            titulo: "Especializados",
            texto: "Afetam usuários experientes."
          },
          {
            tipo: "topico",
            titulo: "Intuitivos",
            texto: "Afetam iniciantes."
          },
          {
            tipo: "topico",
            titulo: "Acessibilidade",
            texto: "Afetam usuários com necessidades especiais."
          }
        ]
      },

      {
        id: "prototipagem",
        titulo: "🧪 Conceitos de Prototipagem",
        blocos: [
          {
            tipo: "texto",
            texto: "A prototipagem cria representações visuais do sistema antes da implementação final."
          },
          {
            tipo: "topico",
            titulo: "Objetivos da prototipagem",
            lista: [
              "Obter feedback rápido",
              "Economizar tempo e dinheiro",
              "Testar alternativas",
              "Encontrar erros antes da programação",
              "Validar experiência do usuário",
              "Apresentar ideias para investidores"
            ]
          }
        ]
      },

      {
        id: "cenarios",
        titulo: "📖 Cenários",
        blocos: [
          {
            tipo: "texto",
            texto: "Cenários são descrições narrativas de interação usuário-sistema."
          },
          {
            tipo: "topico",
            titulo: "Elementos dos cenários",
            lista: [
              "Usuário",
              "Situação",
              "Sequência de ações",
              "Respostas do sistema",
              "Contexto de uso"
            ]
          },
          {
            tipo: "topico",
            titulo: "Objetivo",
            texto: "Planejar e analisar experiências de uso."
          },
          {
            tipo: "exemplo",
            titulo: "Cenário de caixa eletrônico",
            texto: "Fluxo completo de uso do caixa eletrônico: 1) usuário insere cartão; 2) sistema valida; 3) senha é digitada; 4) usuário escolhe saque; 5) sistema libera dinheiro; 6) operação finalizada.",
            detalhe: "Objetivo: representar interação completa e validar fluxo de uso."
          }
        ]
      },

      {
        id: "storyboard",
        titulo: "🎬 Storyboard",
        blocos: [
          {
            tipo: "texto",
            texto: "Storyboard é a representação gráfica da narrativa."
          },
          {
            tipo: "topico",
            titulo: "Funções",
            lista: [
              "Representar telas",
              "Mostrar conexões",
              "Ilustrar fluxo de interação"
            ]
          },
          {
            tipo: "topico",
            titulo: "Origem",
            lista: [
              "Cinema",
              "Organização de cenas"
            ]
          },
          {
            tipo: "imagem",
            src: "figura_storyboard_realidade_aumentada.png",
            pasta: "imagens_design/aula_10",
            alt: "Figura 2 — Storyboard simulando realidade aumentada: ilustra representação gráfica de interações e sequência narrativa",
            num: 2
          }
        ]
      },

      {
        id: "wireframe",
        titulo: "🔲 Wireframe",
        blocos: [
          {
            tipo: "texto",
            texto: "Wireframe é um esqueleto visual da interface."
          },
          {
            tipo: "topico",
            titulo: "Características",
            lista: [
              "Simples",
              "Sem cores",
              "Sem detalhes visuais",
              "Foco na estrutura"
            ]
          },
          {
            tipo: "topico",
            titulo: "Objetivos",
            lista: [
              "Organizar componentes",
              "Definir arquitetura",
              "Planejar navegação"
            ]
          },
          {
            tipo: "destaque",
            texto: "📌 O wireframe é a base dos protótipos de alta fidelidade."
          },
          {
            tipo: "imagem",
            src: "figura_wireframe_mobile_first.png",
            pasta: "imagens_design/aula_10",
            alt: "Figura 3 — Wireframe de interface mobile first: apresenta estrutura básica de uma interface sem elementos gráficos avançados",
            num: 3
          }
        ]
      },

      {
        id: "mockup",
        titulo: "🎨 Mockup",
        blocos: [
          {
            tipo: "texto",
            texto: "Mockup é um protótipo visual próximo do produto final."
          },
          {
            tipo: "topico",
            titulo: "Características",
            lista: [
              "Alta fidelidade",
              "Aparência detalhada",
              "Dimensões precisas",
              "Representação estética realista"
            ]
          },
          {
            tipo: "topico",
            titulo: "Aplicações",
            lista: [
              "Aplicativos",
              "Sistemas",
              "Sites",
              "Jogos digitais"
            ]
          }
        ]
      },

      {
        id: "fidelidade",
        titulo: "📐 Fidelidade do Protótipo",
        blocos: [
          {
            tipo: "topico",
            titulo: "Baixa fidelidade",
            lista: [
              "Poucos detalhes",
              "Rascunhos",
              "Papel",
              "Foco em ideias gerais",
              "Vantagem: estimula discussões abertas"
            ]
          },
          {
            tipo: "topico",
            titulo: "Alta fidelidade",
            lista: [
              "Muitos detalhes",
              "Aparência final",
              "Interações completas",
              "Vantagem: testes mais precisos"
            ]
          }
        ]
      },

      {
        id: "horizontal_vertical",
        titulo: "↔️ Prototipação Horizontal e Vertical",
        blocos: [
          {
            tipo: "topico",
            titulo: "Horizontal",
            lista: [
              "Muitas funções",
              "Pouco detalhamento",
              "Objetivo: visão geral do sistema"
            ]
          },
          {
            tipo: "topico",
            titulo: "Vertical",
            lista: [
              "Menos funções",
              "Grande aprofundamento",
              "Objetivo: analisar detalhes específicos"
            ]
          }
        ]
      },

      {
        id: "ferramentas",
        titulo: "🛠️ Prototipação na Prática — Ferramentas",
        blocos: [
          {
            tipo: "lista",
            titulo: "Ferramentas de prototipação apresentadas no material:",
            itens: [
              "Figma",
              "Adobe XD",
              "Framer",
              "Axure",
              "Sketch",
              "Fluid",
              "Proto.io",
              "Justinmind",
              "NinjaMock"
            ]
          }
        ]
      },

      {
        id: "ninjamock",
        titulo: "📱 Construção de Wireframe no NinjaMock",
        blocos: [
          {
            tipo: "topico",
            titulo: "Objetivo",
            texto: "Criar um wireframe mobile first."
          },
          {
            tipo: "topico",
            titulo: "Mobile First",
            texto: "Desenvolvimento iniciado para telas pequenas."
          },
          {
            tipo: "topico",
            titulo: "Estrutura utilizada",
            lista: [
              "Header",
              "Botões",
              "Menus",
              "Textos",
              "Rodapé"
            ]
          },
          {
            tipo: "imagem",
            src: "figura_wireframe_ninjamock.png",
            pasta: "imagens_design/aula_10",
            alt: "Figura 4 — Wireframe tela inicial no NinjaMock: exemplo prático de wireframe desenvolvido na plataforma NinjaMock",
            num: 4
          },
          {
            tipo: "imagem",
            src: "figura_wireframe_completo.png",
            pasta: "imagens_design/aula_10",
            alt: "Figura 5 — Wireframe completo no NinjaMock: demonstra conjunto completo de telas wireframe conectadas",
            num: 5
          }
        ]
      },

      {
        id: "figma",
        titulo: "🖥️ Construção de Mockup no Figma",
        blocos: [
          {
            tipo: "subtitulo",
            texto: "Preparação do ambiente"
          },
          {
            tipo: "topico",
            titulo: "Etapas de preparação",
            lista: [
              "Criação de frames",
              "Definição de tamanhos",
              "Escolha de cores",
              "Organização visual"
            ]
          },
          {
            tipo: "subtitulo",
            texto: "Recursos utilizados"
          },
          {
            tipo: "topico",
            titulo: "Recursos",
            lista: [
              "Ícones",
              "Imagens",
              "Componentes",
              "Scrolling",
              "Interações"
            ]
          },
          {
            tipo: "subtitulo",
            texto: "Atalhos importantes"
          },
          {
            tipo: "topico",
            titulo: "Atalhos",
            lista: [
              "`CTRL + SHIFT + K` → inserir imagens",
              "`CTRL + D` → duplicar telas"
            ]
          },
          {
            tipo: "imagem",
            src: "figura_ambiente_figma.png",
            pasta: "imagens_design/aula_10",
            alt: "Figura 6 — Ambiente de trabalho Figma: apresenta organização inicial do ambiente de design no Figma",
            num: 6
          },
          {
            tipo: "imagem",
            src: "figura_mockup_alta_fidelidade.png",
            pasta: "imagens_design/aula_10",
            alt: "Figura 7 — Mockup de alta fidelidade: exemplo de protótipo visual próximo da interface final",
            num: 7
          }
        ]
      },

      {
        id: "interacoes_figma",
        titulo: "🔗 Interações no Figma",
        blocos: [
          {
            tipo: "texto",
            texto: "O Figma permite criar conexões entre telas usando tipos de interação específicos."
          },
          {
            tipo: "topico",
            titulo: "Tipos de interação disponíveis",
            lista: [
              "Touch Down",
              "Touch Up",
              "Vertical Scrolling"
            ]
          },
          {
            tipo: "topico",
            titulo: "Isso possibilita:",
            lista: [
              "Navegação simulada",
              "Testes de usabilidade",
              "Validação de fluxo"
            ]
          },
          {
            tipo: "imagem",
            src: "figura_interacoes_figma.png",
            pasta: "imagens_design/aula_10",
            alt: "Figura 8 — Interações entre as telas no Figma: demonstra conexões e fluxo de navegação entre telas",
            num: 8
          },
          {
            tipo: "imagem",
            src: "figura_preview_prototipo.png",
            pasta: "imagens_design/aula_10",
            alt: "Figura 9 — Modo de visualização do protótipo no Figma: mostra pré-visualização funcional do protótipo criado",
            num: 9
          }
        ]
      },

      {
        id: "formulas_metodos",
        titulo: "📋 Fórmulas e Métodos",
        blocos: [
          {
            tipo: "texto",
            texto: "O conteúdo não apresenta fórmulas matemáticas, mas apresenta métodos e classificações importantes."
          },
          {
            tipo: "topico",
            titulo: "Método Cascata",
            texto: "Fluxo linear e sequencial."
          },
          {
            tipo: "topico",
            titulo: "Método Espiral",
            lista: [
              "Prototipagem",
              "Testes",
              "Análise de riscos"
            ]
          },
          {
            tipo: "topico",
            titulo: "Método Iterativo",
            texto: "Repetição contínua para melhoria do sistema."
          },
          {
            tipo: "topico",
            titulo: "Design Thinking",
            lista: [
              "Empatia",
              "Colaboração",
              "Experimentação"
            ]
          },
          {
            tipo: "topico",
            titulo: "ISO 9241",
            lista: [
              "Ergonomia",
              "Usabilidade",
              "Interação humano-computador"
            ]
          },
          {
            tipo: "subtitulo",
            texto: "Método de prototipação — Etapas gerais"
          },
          {
            tipo: "lista",
            titulo: "Etapas:",
            itens: [
              "1. Definir objetivos",
              "2. Escolher tipo de protótipo",
              "3. Criar estrutura",
              "4. Validar com usuários",
              "5. Ajustar interface",
              "6. Refinar fidelidade"
            ]
          }
        ]
      },

      {
        id: "resumo",
        titulo: "🧾 Resumo Final para Revisão Rápida",
        blocos: [
          {
            tipo: "texto",
            texto: "O **design centrado no usuário** prioriza: usabilidade, ergonomia e experiência do usuário. Os **modelos conceituais** representam: funções, conexões e interações. A **UML** é usada para modelagem de software. Os **modelos físicos** transformam ideias em interfaces concretas."
          },
          {
            tipo: "topico",
            titulo: "Problemas de usabilidade",
            lista: [
              "Barreiras",
              "Obstáculos",
              "Ruídos"
            ]
          },
          {
            tipo: "topico",
            titulo: "A prototipagem ajuda a:",
            lista: [
              "Validar ideias",
              "Reduzir custos",
              "Melhorar UX"
            ]
          },
          {
            tipo: "tabela",
            titulo: "Tipos de protótipos",
            colunas: ["Tipo", "Característica"],
            linhas: [
              ["Cenário", "Narrativa textual"],
              ["Storyboard", "Narrativa visual"],
              ["Wireframe", "Estrutura básica"],
              ["Mockup", "Visual detalhado"]
            ]
          },
          {
            tipo: "tabela",
            titulo: "Fidelidade",
            colunas: ["Tipo", "Característica"],
            linhas: [
              ["Baixa fidelidade", "Poucos detalhes"],
              ["Alta fidelidade", "Próximo do produto final"]
            ]
          },
          {
            tipo: "tabela",
            titulo: "Horizontal vs Vertical",
            colunas: ["Tipo", "Característica"],
            linhas: [
              ["Horizontal", "Muitas funções, pouco detalhe"],
              ["Vertical", "Poucas funções, muito detalhe"]
            ]
          },
          {
            tipo: "topico",
            titulo: "Ferramentas importantes",
            lista: [
              "Figma",
              "NinjaMock",
              "Adobe XD",
              "Framer",
              "Sketch"
            ]
          },
          {
            tipo: "destaque",
            texto: "📌 Conceitos que mais caem em provas: Design centrado no usuário · Modelos conceituais · Wireframe · Mockup · Fidelidade (baixa e alta) · Usabilidade · Storyboard · Protótipos horizontais e verticais."
          }
        ]
      }
    ]
  },
  // Aula 11 — Design Responsivo
  {
  aula: "Aula 11 — Design Responsivo",
  ideia_central: "O Design Responsivo é a metodologia que permite interfaces web se adaptarem automaticamente a diferentes tamanhos de tela, sendo implementado por meio de Media Queries, Layout Fluido, Meta Tag Viewport, Breakpoints e a abordagem Mobile First, tornando-se obrigatório no desenvolvimento moderno diante do crescimento do acesso à internet por dispositivos móveis.",
  secoes: [
  {
  id: "visao",
  titulo: "🧭 Visão Geral do Conteúdo",
  blocos: [
  {
  tipo: "texto",
  texto: "O módulo aborda os principais fundamentos do Design Responsivo, metodologia essencial no desenvolvimento moderno de interfaces web. O objetivo principal é permitir que sites e sistemas funcionem corretamente em diferentes tamanhos de tela — principalmente em dispositivos móveis."
  },
  {
  tipo: "lista",
  titulo: "Conteúdos estudados:",
  itens: [
  "Conceito de Design Responsivo",
  "Media Queries",
  "Meta Tag Viewport",
  "Layout Fluido",
  "Mobile First",
  "Breakpoints",
  "Adaptação de layouts para diferentes dispositivos",
  "Técnicas práticas de CSS responsivo"
  ]
  },
  {
  tipo: "texto",
  texto: "O material enfatiza que o crescimento do acesso à internet por smartphones tornou obrigatório o desenvolvimento de interfaces adaptáveis."
  }
  ]
  },
      {
        id: "design_responsivo",
        titulo: "📱 Conceitos do Design Responsivo",
        blocos: [
          {
            tipo: "subtitulo",
            texto: "O que é Design Responsivo?"
          },
          {
            tipo: "texto",
            texto: "Design Responsivo é a capacidade de uma interface web se adaptar automaticamente a diferentes tamanhos de tela. O conceito foi popularizado por **Ethan Marcotte**, que trouxe a ideia da arquitetura para o desenvolvimento web."
          },
          {
            tipo: "topico",
            titulo: "Objetivo principal",
            lista: [
              "Boa usabilidade",
              "Acessibilidade",
              "Organização visual",
              "Adaptação automática",
              "Melhor experiência do usuário"
            ]
          },
          {
            tipo: "subtitulo",
            texto: "Características principais"
          },
          {
            tipo: "texto",
            texto: "Um site responsivo deve:"
          },
          {
            tipo: "lista",
            itens: [
              "Reorganizar elementos",
              "Redimensionar conteúdos",
              "Alterar posicionamentos",
              "Adaptar menus",
              "Modificar grids",
              "Melhorar leitura e navegação"
            ]
          },
          {
            tipo: "destaque",
            texto: "📌 Responsividade NÃO significa apenas 'diminuir' ou 'esticar' o layout. O desenvolvedor precisa: reorganizar os elementos, redesenhar partes da interface e alterar comportamentos conforme a tela."
          },
          {
            tipo: "subtitulo",
            texto: "Crescimento do uso mobile"
          },
          {
            tipo: "texto",
            texto: "Segundo a PNAD Contínua citada no material: o celular tornou-se o principal dispositivo de acesso à internet, e milhões de domicílios utilizam smartphones como principal meio de navegação. Isso explica por que interfaces modernas devem priorizar dispositivos móveis."
          }
        ]
      },

      {
        id: "media_queries",
        titulo: "🎛️ Media Queries",
        blocos: [
          {
            tipo: "subtitulo",
            texto: "Conceito"
          },
          {
            tipo: "texto",
            texto: "Media Queries são recursos do CSS3 usados para aplicar estilos condicionais dependendo do tamanho da tela. São implementadas através da regra `@media`."
          },
          {
            tipo: "topico",
            titulo: "Função das Media Queries",
            lista: [
              "Alterar tamanho de elementos",
              "Mudar alinhamentos",
              "Ocultar componentes",
              "Reorganizar grids",
              "Adaptar menus",
              "Mudar tipografia",
              "Alterar posicionamentos"
            ]
          },
          {
            tipo: "subtitulo",
            texto: "Exemplo básico"
          },
          {
            tipo: "texto",
            texto: "Quando a largura da tela for menor ou igual a 600px:\n```css\n@media only screen and (max-width: 600px) {\n    body {\n        background-color: lightblue;\n    }\n}```"
          },
          {
            tipo: "topico",
            titulo: "Explicação do funcionamento",
            texto: "A condição `(max-width: 600px)` significa: aplicar o CSS SOMENTE em telas com até 600px de largura."
          },
          {
            tipo: "imagem",
            src: "figura_layout_fluido_sem_media_queries.png",
            pasta: "imagens_design/aula_11",
            alt: "Figura 1 — Layout fluido sem media queries: mostra um layout que possui fluidez, porém sem reorganização adequada dos elementos. Os textos ficam sobrepostos, demonstrando que apenas flexibilidade não resolve problemas de responsividade",
            num: 1
          },
          {
            tipo: "imagem",
            src: "figura_resultado_media_queries.png",
            pasta: "imagens_design/aula_11",
            alt: "Figura 2 — Resultado do uso do media queries: demonstra como os elementos passam a ocupar 100% da largura em telas pequenas, reorganizando o conteúdo verticalmente e melhorando a legibilidade",
            num: 2
          },
          {
            tipo: "subtitulo",
            texto: "Código explicado no material"
          },
          {
            tipo: "texto",
            texto: "```css\n.noticia {\n    float: left;\n    width: 25%;\n}\n\n@media (max-width: 400px) {\n    .noticia {\n        float: left;\n        width: 25%;\n    }\n}```"
          },
          {
            tipo: "topico",
            titulo: "Objetivo",
            texto: "Fazer os elementos se reorganizarem em telas menores."
          }
        ]
      },

      {
        id: "breakpoints",
        titulo: "📏 Breakpoints",
        blocos: [
          {
            tipo: "subtitulo",
            texto: "Conceito"
          },
          {
            tipo: "texto",
            texto: "Breakpoints são pontos específicos do tamanho da tela em que o layout muda de comportamento."
          },
          {
            tipo: "topico",
            titulo: "Exemplos de breakpoints",
            lista: [
              "Smartphone",
              "Tablet",
              "Notebook",
              "Desktop"
            ]
          },
          {
            tipo: "topico",
            titulo: "Objetivo dos Breakpoints",
            lista: [
              "Reorganização da interface",
              "Mudança de número de colunas",
              "Adaptação visual",
              "Melhoria da experiência do usuário"
            ]
          },
          {
            tipo: "imagem",
            src: "figura_breakpoint_600px.png",
            pasta: "imagens_design/aula_11",
            alt: "Figura 3 — Exemplo de breakpoint definido para a largura máxima de 600px: ilustra como o layout altera a quantidade de colunas quando a largura máxima da tela é atingida",
            num: 3
          },
          {
            tipo: "subtitulo",
            texto: "Código do breakpoint"
          },
          {
            tipo: "texto",
            texto: "```css\n@media (max-width: 600px) {\n    .noticia {\n        width: 50%;\n    }\n}```"
          },
          {
            tipo: "topico",
            titulo: "Resultado",
            lista: [
              "Os elementos passam a ocupar 50% da largura",
              "Duas colunas em determinadas resoluções"
            ]
          },
          {
            tipo: "destaque",
            texto: "📌 A ordem dos breakpoints importa. O último breakpoint escrito sobrescreve os anteriores."
          },
          {
            tipo: "subtitulo",
            texto: "Principais atributos usados"
          },
          {
            tipo: "topico",
            titulo: "width",
            texto: "Largura da janela."
          },
          {
            tipo: "topico",
            titulo: "device-width",
            texto: "Largura física do dispositivo."
          },
          {
            tipo: "topico",
            titulo: "height",
            texto: "Altura da tela."
          }
        ]
      },

      {
        id: "meta_viewport",
        titulo: "🔖 Meta Tag Viewport",
        blocos: [
          {
            tipo: "subtitulo",
            texto: "Conceito"
          },
          {
            tipo: "texto",
            texto: "A Meta Tag Viewport controla como a página será renderizada em dispositivos móveis."
          },
          {
            tipo: "topico",
            titulo: "Sem ela:",
            lista: [
              "O navegador reduz automaticamente o site",
              "O layout fica pequeno",
              "A experiência piora"
            ]
          },
          {
            tipo: "subtitulo",
            texto: "Código padrão"
          },
          {
            tipo: "texto",
            texto: "```html\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">```"
          },
          {
            tipo: "subtitulo",
            texto: "Explicação dos parâmetros"
          },
          {
            tipo: "topico",
            titulo: "width=device-width",
            texto: "Define a largura da página igual à largura do dispositivo."
          },
          {
            tipo: "topico",
            titulo: "initial-scale=1",
            texto: "Define o nível inicial de zoom."
          },
          {
            tipo: "subtitulo",
            texto: "Diferença entre zoom mobile e desktop"
          },
          {
            tipo: "topico",
            titulo: "Page Scale (mobile)",
            lista: [
              "Amplia apenas a visualização",
              "Não altera o layout"
            ]
          },
          {
            tipo: "topico",
            titulo: "Page Zoom (desktop)",
            lista: [
              "Altera o viewport",
              "Muda o tamanho renderizado da página"
            ]
          }
        ]
      },

      {
        id: "layout_fluido",
        titulo: "🌊 Layout Fluido",
        blocos: [
          {
            tipo: "texto",
            texto: "Layout Fluido utiliza medidas relativas em vez de medidas absolutas."
          },
          {
            tipo: "topico",
            titulo: "Medidas absolutas — evitar:",
            lista: [
              "px",
              "cm",
              "mm",
              "pt"
            ]
          },
          {
            tipo: "topico",
            titulo: "Medidas flexíveis — preferir:",
            lista: [
              "%",
              "em",
              "rem"
            ]
          },
          {
            tipo: "topico",
            titulo: "Objetivo",
            texto: "Permitir adaptação automática do layout."
          },
          {
            tipo: "subtitulo",
            texto: "Exemplo"
          },
          {
            tipo: "texto",
            texto: "```css\nbody {\n    width:100%;\n}\n\narticle {\n    width:75%;\n    padding:10%;\n}```"
          },
          {
            tipo: "topico",
            titulo: "Explicação",
            lista: [
              "O body ocupa toda a largura",
              "O article ocupa 75%",
              "O padding adapta proporcionalmente"
            ]
          },
          {
            tipo: "topico",
            titulo: "Vantagens",
            lista: [
              "Flexibilidade",
              "Melhor responsividade",
              "Adaptação natural",
              "Menos necessidade de media queries"
            ]
          }
        ]
      },

      {
        id: "mobile_first",
        titulo: "📲 Mobile First",
        blocos: [
          {
            tipo: "texto",
            texto: "Mobile First é uma metodologia que propõe desenvolver primeiro para telas pequenas. Depois: adapta-se para tablets e adapta-se para desktops."
          },
          {
            tipo: "topico",
            titulo: "Criador",
            texto: "Luke Wroblewski"
          },
          {
            tipo: "subtitulo",
            texto: "Objetivos do Mobile First"
          },
          {
            tipo: "topico",
            titulo: "1. Priorizar o essencial",
            texto: "Telas pequenas obrigam foco no conteúdo importante."
          },
          {
            tipo: "topico",
            titulo: "2. Melhorar desempenho",
            texto: "Menos elementos desnecessários."
          },
          {
            tipo: "topico",
            titulo: "3. Melhorar usabilidade",
            texto: "Layouts mais limpos e organizados."
          },
          {
            tipo: "imagem",
            src: "figura_comparativo_mobile_first.png",
            pasta: "imagens_design/aula_11",
            alt: "Figura 4 — Comparativo do desktop first com o mobile first: compara o desenvolvimento tradicional desktop first com a metodologia mobile first, mostrando como o fluxo de adaptação muda",
            num: 4
          },
          {
            tipo: "imagem",
            src: "figura_site_mobile_first.png",
            pasta: "imagens_design/aula_11",
            alt: "Figura 5 — Exemplo de site desenvolvido em mobile first: demonstra um layout inicialmente projetado para smartphones antes da adaptação para telas maiores",
            num: 5
          }
        ]
      },

      {
        id: "breakpoints_pratica",
        titulo: "⚙️ Breakpoints na Prática",
        blocos: [
          {
            tipo: "texto",
            texto: "O material apresenta exemplos reais de adaptação de layout usando media queries."
          },
          {
            tipo: "subtitulo",
            texto: "7.1 Alteração do Logo"
          },
          {
            tipo: "topico",
            titulo: "Objetivo",
            texto: "Trocar o logo mobile pelo logo desktop em telas maiores."
          },
          {
            tipo: "texto",
            texto: "```css\n@media screen and (min-width: 480px) {\n    .logo {\n        width: 214px;\n        background: url(../img/logo.png) center center/214px no-repeat;\n    }\n\n    .btn {\n        font-size: 2em;\n    }\n}```"
          },
          {
            tipo: "imagem",
            src: "figura_alteracao_logo.png",
            pasta: "imagens_design/aula_11",
            alt: "Figura 6 — Comparativo após a media screen para a alteração de logo: mostra a substituição do logo simplificado mobile por um logo completo para desktop",
            num: 6
          },
          {
            tipo: "subtitulo",
            texto: "7.2 Variação da Grid"
          },
          {
            tipo: "topico",
            titulo: "Objetivo",
            texto: "Alterar quantidade de colunas conforme o tamanho da tela."
          },
          {
            tipo: "tabela",
            titulo: "Colunas por dispositivo",
            colunas: ["Dispositivo", "Colunas"],
            linhas: [
              ["Smartphone", "1 coluna"],
              ["Tablet", "2 colunas"],
              ["Desktop", "3 colunas"]
            ]
          },
          {
            tipo: "texto",
            texto: "```css\n@media screen and (min-width: 768px) {\n    .servico {\n        width: 49%;\n        float: left;\n    }\n}```"
          },
          {
            tipo: "imagem",
            src: "figura_variacao_grid.png",
            pasta: "imagens_design/aula_11",
            alt: "Figura 7 — Comparativo após a media screen de variação de grid: ilustra a reorganização das colunas conforme o aumento da largura da tela",
            num: 7
          },
          {
            tipo: "subtitulo",
            texto: "7.3 Escala e alinhamento de botões"
          },
          {
            tipo: "topico",
            titulo: "Objetivo",
            texto: "Reposicionar botões em telas maiores."
          },
          {
            tipo: "topico",
            titulo: "Alterações realizadas",
            lista: [
              "Alinhamento à direita",
              "Redução de tamanho",
              "Reorganização visual"
            ]
          },
          {
            tipo: "texto",
            texto: "```css\n@media screen and (min-width: 960px) {\n    .buttons {\n        width: 30%;\n        float: right;\n    }\n}```"
          },
          {
            tipo: "imagem",
            src: "figura_botoes_responsivos.png",
            pasta: "imagens_design/aula_11",
            alt: "Figura 8 — Comparativo após a alteração de escala e alinhamentos dos botões: mostra como os botões são redimensionados e reposicionados em telas maiores",
            num: 8
          },
          {
            tipo: "subtitulo",
            texto: "7.4 Menu Hambúrguer → Menu Horizontal"
          },
          {
            tipo: "topico",
            titulo: "Objetivo",
            texto: "Substituir o menu hambúrguer por menu horizontal em desktops."
          },
          {
            tipo: "texto",
            texto: "```css\n@media screen and (min-width: 1280px) {\n\n    .btn-menu {\n        display: none;\n    }\n\n    .menu {\n        display: block !important;\n    }\n}```"
          },
          {
            tipo: "topico",
            titulo: "Importância do !important",
            texto: "Força a substituição do comportamento anterior."
          },
          {
            tipo: "imagem",
            src: "figura_interface_desktop.png",
            pasta: "imagens_design/aula_11",
            alt: "Figura 9 — Interface gráfica desktop: apresenta o resultado final do layout responsivo adaptado para telas desktop",
            num: 9
          }
        ]
      },

      {
        id: "conceitos_prova",
        titulo: "📌 Conceitos Fundamentais para Provas",
        blocos: [
          {
            tipo: "topico",
            titulo: "Design Responsivo",
            texto: "Capacidade do layout adaptar-se a diferentes telas."
          },
          {
            tipo: "topico",
            titulo: "Media Queries",
            texto: "CSS condicional para responsividade."
          },
          {
            tipo: "topico",
            titulo: "Layout Fluido",
            texto: "Uso de medidas relativas."
          },
          {
            tipo: "topico",
            titulo: "Mobile First",
            texto: "Desenvolvimento iniciado pelo mobile."
          },
          {
            tipo: "topico",
            titulo: "Breakpoints",
            texto: "Pontos de mudança do layout."
          },
          {
            tipo: "topico",
            titulo: "Meta Viewport",
            texto: "Controla renderização em dispositivos móveis."
          }
        ]
      },

      {
        id: "resumo",
        titulo: "🧾 Resumo Final para Revisão Rápida",
        blocos: [
          {
            tipo: "topico",
            titulo: "Principais ideias",
            lista: [
              "Responsividade é obrigatória no desenvolvimento moderno",
              "Media Queries controlam adaptações condicionais",
              "Layout fluido usa medidas relativas",
              "Mobile First melhora foco e desempenho",
              "Breakpoints ajustam layouts em diferentes resoluções",
              "Meta Viewport controla renderização mobile",
              "Menus, grids e botões precisam ser reorganizados conforme a tela"
            ]
          },
          {
            tipo: "subtitulo",
            texto: "Fórmulas/estruturas importantes para memorizar"
          },
          {
            tipo: "topico",
            titulo: "Media Query",
            texto: "```css\n@media screen and (max-width: 600px)```"
          },
          {
            tipo: "topico",
            titulo: "Meta Viewport",
            texto: "```html\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">```"
          },
          {
            tipo: "topico",
            titulo: "Medidas recomendadas",
            lista: ["%", "em", "rem"]
          },
          {
            tipo: "topico",
            titulo: "Medidas evitadas",
            lista: ["px", "cm", "mm", "pt"]
          },
          {
            tipo: "destaque",
            texto: "📌 Dicas para prova: Responsividade ≠ apenas reduzir tamanho · Mobile First começa pelo menor dispositivo · Layout fluido depende de medidas relativas · Breakpoints devem ser organizados corretamente no CSS · O último breakpoint pode sobrescrever o anterior · Menu hambúrguer é comum no mobile · Desktop geralmente utiliza menu horizontal."
          }
        ]
      }
    ]
  },
  // Aula 12 — CSS e HTML Comandos Básicos
  {
  aula: "Aula 12 — CSS e HTML Comandos Básicos",
  ideia_central: "HTML estrutura o conteúdo de páginas web por meio de tags semânticas, enquanto o CSS estiliza essa estrutura com seletores e propriedades, permitindo separação entre forma e aparência.",
  secoes: [
  {
    id: "visao",
    titulo: "🧭 Visão Geral",
    blocos: [
      {
        tipo: "texto",
        texto: "O material apresenta os conceitos fundamentais de **HTML5**, **CSS** e **Web Semântica**, com foco prático no uso do **Visual Studio Code (VSCode)** para estruturar e estilizar páginas web do zero."
      },
      {
        tipo: "lista",
        titulo: "A aula aborda:",
        itens: [
          "Estrutura básica do HTML5",
          "Criação de listas, tabelas e imagens",
          "Aplicação de estilos externos com CSS",
          "Uso de classes e seletores CSS",
          "Conceitos de Web Semântica"
        ]
      },
      {
        tipo: "lista",
        titulo: "Objetivos principais:",
        itens: [
          "Entender a estrutura básica do HTML5",
          "Aprender comandos essenciais do CSS",
          "Relacionar HTML + CSS",
          "Aplicar conceitos de Web Semântica"
        ]
      }
    ]
  },

  {
    id: "html",
    titulo: "🧠 HTML — Conceitos Principais",
    blocos: [

      {
        tipo: "topico",
        titulo: "O que é HTML",
        lista: [
          "**Linguagem de marcação** — não é linguagem de programação",
          "Utilizada para **estruturar páginas web** com base em **tags**",
          "Não executa lógica — apenas organiza conteúdo visual e semântico"
        ]
      },

      {
        tipo: "topico",
        titulo: "📄 Estrutura Básica do HTML5",
        texto: "A estrutura padrão gerada automaticamente pelo VSCode com o atalho `!`:"
      },
      {
        tipo: "imagem",
        src: "fig_html_estrutura_basica_html5.png",
        pasta: "imagens_design/aula_12",
        alt: "Figura 1 — Estrutura básica de uma página HTML5 gerada pelo VSCode",
        num: 1
      },
      {
        tipo: "tabela",
        titulo: "Elementos da Estrutura",
        colunas: ["Elemento", "Função"],
        linhas: [
          ["<!DOCTYPE html>", "Declara o tipo do documento (HTML5) — não é uma tag"],
          ["<html lang=\"pt-BR\">", "Elemento raiz — agrupa todo o documento; define o idioma"],
          ["<head>", "Contém metadados, título, links externos — não visível ao usuário"],
          ["<body>", "Área visível: textos, imagens, vídeos, tabelas, menus"]
        ]
      },

      {
        tipo: "topico",
        titulo: "🔤 Tags de Título e Texto",
        lista: [
          "`<h1>` até `<h6>` → títulos e subtítulos em hierarquia (`<h1>` = maior importância)",
          "`<p>` → parágrafo de texto"
        ]
      },

      {
        tipo: "topico",
        titulo: "📋 Listas HTML",
        lista: [
          "`<ul>` + `<li>` → lista **não ordenada** (com marcadores)",
          "`<ol>` + `<li>` → lista **ordenada** (numeração automática)"
        ]
      },

      {
        tipo: "topico",
        titulo: "🖼️ Inserção de Imagens",
        lista: [
          "Tag: `<img src=\"\">`",
          "Atributo `src` define o caminho da imagem",
          "Exemplo: `<img src=\"assets/img/html.jpg\">`"
        ]
      },

      {
        tipo: "tabela",
        titulo: "📊 Estrutura de Tabelas HTML",
        colunas: ["Tag", "Função"],
        linhas: [
          ["<table>", "Cria a tabela"],
          ["<thead>", "Cabeçalho da tabela"],
          ["<tbody>", "Corpo da tabela"],
          ["<tr>", "Linha da tabela"],
          ["<th>", "Título da coluna (negrito por padrão)"],
          ["<td>", "Célula de dado"]
        ]
      },

      {
        tipo: "exemplo",
        titulo: "Estrutura mínima de tabela",
        texto: "<table>\n  <thead>\n    <tr>\n      <th>Produto</th>\n    </tr>\n  </thead>\n</table>",
        detalhe: "👉 `<thead>` agrupa o cabeçalho; `<tbody>` agrupa as linhas de dados"
      }

    ]
  },

  {
    id: "css",
    titulo: "🎨 CSS — Conceitos Principais",
    blocos: [

      {
        tipo: "topico",
        titulo: "O que é CSS",
        lista: [
          "**Cascading Style Sheets** — estiliza páginas HTML",
          "Permite **reutilização de estilos** e **separação entre estrutura e aparência**",
          "Reduz retrabalho ao centralizar regras de estilo"
        ]
      },

      {
        tipo: "topico",
        titulo: "🔗 Vinculação do CSS ao HTML",
        texto: "O CSS externo é conectado dentro do `<head>` via tag `<link>`:",
        codigo: "<link rel=\"stylesheet\" href=\"assets/css/style.css\">"
      },

      {
        tipo: "topico",
        titulo: "⚙️ Sintaxe CSS",
        texto: "Estrutura básica de uma regra CSS:"
      },
      {
        tipo: "exemplo",
        titulo: "Regra CSS",
        texto: "seletor {\n  propriedade: valor;\n}",
        detalhe: "👉 Exemplo: `body { background: red; }` → fundo vermelho na página inteira"
      },

      {
        tipo: "tabela",
        titulo: "📌 Propriedades CSS Importantes",
        colunas: ["Propriedade", "Função"],
        linhas: [
          ["font-family", "Define a fonte do texto (ex: Verdana)"],
          ["text-transform", "Transforma letras: uppercase | lowercase | capitalize"],
          ["padding", "Espaçamento interno ao elemento"],
          ["margin", "Espaçamento externo ao elemento"],
          ["border", "Define borda (espessura, estilo, cor)"],
          ["border-radius", "Arredonda as bordas do elemento"],
          ["width", "Define a largura do elemento"],
          ["background-color", "Define a cor de fundo"],
          ["float", "Posicionamento flutuante (ex: float: right)"],
          ["display: flex", "Organiza elementos horizontal e flexivelmente — muito usado em menus e layouts modernos"]
        ]
      }

    ]
  },

  {
    id: "semantica",
    titulo: "🌐 Web Semântica",
    blocos: [

      {
        tipo: "topico",
        titulo: "O que é Web Semântica",
        lista: [
          "Busca **dar significado** aos conteúdos da página",
          "Facilita o entendimento por **buscadores** (SEO)",
          "Melhora **indexação** e organização da página",
          "Autores relacionados: **Tim Berners-Lee**, **James Hendler**, **Ora Lassila**"
        ]
      },

      {
        tipo: "tabela",
        titulo: "Elementos Semânticos",
        colunas: ["Tag", "Função"],
        linhas: [
          ["<section>", "Divide o conteúdo em seções temáticas"],
          ["<nav>", "Menu de navegação — conjunto de links"],
          ["<footer>", "Rodapé da página"],
          ["<div>", "Container genérico — muito usado para organização visual e aplicação de CSS"]
        ]
      }

    ]
  },

  {
    id: "classes",
    titulo: "🏷️ Classes CSS",
    blocos: [
      {
        tipo: "topico",
        titulo: "Por que usar classes",
        lista: [
          "Permitem **reutilização de estilos** em múltiplos elementos",
          "Organizam o código CSS",
          "Seletor CSS: `.menu { }` — o ponto indica classe",
          "Aplicação no HTML: `<div class=\"menu\">`"
        ]
      }
    ]
  },

  {
    id: "metodos",
    titulo: "⚙️ Métodos e Técnicas",
    blocos: [

      {
        tipo: "topico",
        titulo: "📌 1. Criar Estrutura do Projeto",
        lista: [
          "1. Criar pasta do projeto",
          "2. Criar `index.html`",
          "3. Criar pasta `assets/css/`",
          "4. Criar `style.css`",
          "5. Vincular CSS ao HTML com `<link>`"
        ]
      },

      {
        tipo: "topico",
        titulo: "📌 2. Menu Horizontal com Flexbox",
        lista: [
          "HTML: `<nav><ul><li>...</li></ul></nav>`",
          "CSS: `display: flex; list-style: none;`"
        ]
      },

      {
        tipo: "topico",
        titulo: "📌 3. Layout em Colunas com Float",
        lista: [
          "`.floatleft { width: 70%; float: left; }`",
          "`.floatright { width: 30%; float: right; }`"
        ]
      }

    ]
  },

  {
    id: "exemplos",
    titulo: "📊 Exemplos Explicativos",
    blocos: [

      {
        tipo: "exemplo",
        titulo: "Exemplo 1 — Título",
        texto: "<h1>Testando</h1>",
        detalhe: "👉 Exibe o título principal da página"
      },

      {
        tipo: "exemplo",
        titulo: "Exemplo 2 — Parágrafo",
        texto: "<p>Lorem</p>",
        detalhe: "👉 Exibe texto em parágrafo"
      },

      {
        tipo: "exemplo",
        titulo: "Exemplo 3 — Lista",
        texto: "<ul>\n  <li>Títulos</li>\n</ul>",
        detalhe: "👉 Lista com marcadores"
      },

      {
        tipo: "exemplo",
        titulo: "Exemplo 4 — CSS no Body",
        texto: "body {\n  background: red;\n}",
        detalhe: "👉 Aplica fundo vermelho em toda a página"
      },

      {
        tipo: "exemplo",
        titulo: "Exemplo 5 — Imagem com Bordas Arredondadas",
        texto: "img {\n  border-radius: 40px;\n}",
        detalhe: "👉 Arredonda as bordas de todas as imagens da página"
      },

      {
        tipo: "texto",
        texto: "Layout final do exercício prático — combina menu horizontal, colunas, lista, imagem e tabela estilizada usando HTML semântico + CSS:"
      },
      {
        tipo: "imagem",
        src: "fig_layout_html_css_menu_colunas.png",
        pasta: "imagens_design/aula_12",
        alt: "Figura 2 — Layout exemplo com menu horizontal, colunas, lista, imagem e tabela estilizada",
        num: 2
      }

    ]
  },

  {
    id: "resumo",
    titulo: "⚡ Resumo Final para Revisão Rápida",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Tags HTML importantes",
        colunas: ["Tag", "Função"],
        linhas: [
          ["<h1>", "Título principal"],
          ["<p>", "Parágrafo"],
          ["<ul>", "Lista não ordenada"],
          ["<img>", "Imagem"],
          ["<table>", "Tabela"],
          ["<section>", "Seção semântica"],
          ["<nav>", "Navegação"],
          ["<div>", "Container genérico"]
        ]
      },
      {
        tipo: "tabela",
        titulo: "Propriedades CSS importantes",
        colunas: ["Propriedade", "Função"],
        linhas: [
          ["padding", "Espaço interno"],
          ["margin", "Espaço externo"],
          ["border", "Borda"],
          ["width", "Largura"],
          ["float", "Flutuação"],
          ["display: flex", "Layout flexível"]
        ]
      },
      {
        tipo: "destaque",
        texto: "📌 Mais cobrados em prova: Estrutura HTML5 · Diferença entre HTML e CSS · Tags semânticas (`<nav>`, `<section>`, `<footer>`) · `padding` vs `margin` · Tabelas HTML · Classes CSS · `display: flex` · Web Semântica (Tim Berners-Lee)"
      }
    ]
  }
  ]
  },
  // Aula 13 - Landing page com HTML
  {
  aula: "Aula 13 — Landing Page com HTML",
  ideia_central: "Uma landing page é construída com HTML5 semântico, CSS, tipografia, cores e formulários — combinando estrutura, estilo e elementos visuais para criar páginas focadas em conversão e marketing digital.",
  secoes: [
  {
    id: "visao",
    titulo: "🧭 Visão Geral",
    blocos: [
      {
        tipo: "texto",
        texto: "O material apresenta a construção de uma **landing page utilizando HTML5**, abordando organização do projeto, estruturação semântica, escolha de elementos visuais, imagens, cores, tipografia, tabelas e formulários HTML. A proposta é revisar conceitos fundamentais do desenvolvimento web front-end de forma prática."
      },
      {
        tipo: "texto",
        texto: "Uma **landing page** é uma página web focada em: marketing digital, conversão de visitantes, captura de leads e apresentação direta de informações."
      },
      {
        tipo: "texto",
        texto: "O conteúdo também reforça conceitos de **Web Semântica**, organização estrutural do HTML5 e a separação entre **estrutura (HTML)** e **estilo (CSS)**."
      },
      {
        tipo: "lista",
        titulo: "A aula aborda:",
        itens: [
          "O que é uma landing page e suas características",
          "Organização de pastas do projeto",
          "Escolha de imagens, cores, background e tipografia",
          "Estruturação semântica com HTML5",
          "Menu de navegação e grid layout",
          "Tabelas e formulários HTML",
          "Meta viewport e responsividade"
        ]
      }
    ]
  },

  {
    id: "landing_page",
    titulo: "📄 O que é uma Landing Page",
    blocos: [
      {
        tipo: "texto",
        texto: "Uma **landing page** é uma página única criada para divulgação, marketing, captação de contatos e promoção de produtos ou serviços. Sua comunicação é direta e visual, com poucos elementos distrativos."
      },
      {
        tipo: "lista",
        titulo: "Características principais:",
        itens: [
          "Foco direto em conversão",
          "Conteúdo objetivo",
          "Poucos elementos distrativos",
          "Comunicação visual simples e clara"
        ]
      },
      {
        tipo: "lista",
        titulo: "Muito usada em:",
        itens: [
          "Campanhas digitais",
          "Anúncios",
          "Lançamentos de produtos",
          "Páginas pessoais",
          "Divulgação de serviços"
        ]
      }
    ]
  },

  {
    id: "organizacao",
    titulo: "📁 Estruturação do Projeto",
    blocos: [
      {
        tipo: "topico",
        titulo: "🔹 Organização de pastas",
        texto: "O projeto deve ser organizado **antes do desenvolvimento**, separando estrutura, estilo e imagens:",
        codigo: "Landing page/\n│\n├── index.html\n│\n└── assets/\n    ├── css/\n    │   └── style.css\n    │\n    └── img/"
      },
      {
        tipo: "lista",
        titulo: "Benefícios da organização:",
        itens: [
          "Manutenção",
          "Organização",
          "Reutilização",
          "Escalabilidade do projeto"
        ]
      }
    ]
  },

  {
    id: "visual",
    titulo: "🎨 Elementos Visuais",
    blocos: [
      {
        tipo: "subtitulo",
        texto: "Imagens"
      },
      {
        tipo: "texto",
        texto: "As imagens em uma landing page devem ser simples, objetivas e visualmente limpas. O material utiliza o site **Undraw** para baixar imagens **SVG** gratuitas."
      },
      {
        tipo: "lista",
        titulo: "As imagens em uma landing page devem:",
        itens: [
          "Reforçar a mensagem",
          "Melhorar a experiência visual",
          "Facilitar compreensão"
        ]
      },
      {
        tipo: "topico",
        titulo: "🔹 Formato SVG",
        lista: [
          "Mantém qualidade",
          "É leve",
          "Permite escalabilidade",
          "É ideal para web"
        ]
      },
      {
        tipo: "subtitulo",
        texto: "Cores"
      },
      {
        tipo: "texto",
        texto: "A escolha das cores envolve aspectos como psicologia das cores, temperatura, contraste, composição visual e identidade visual. O material utiliza o **Adobe Color** para gerar paletas baseadas em imagem."
      },
      {
        tipo: "lista",
        titulo: "Aspectos envolvidos na escolha das cores:",
        itens: [
          "Psicologia das cores",
          "Temperatura",
          "Contraste",
          "Composição visual",
          "Identidade visual"
        ]
      },
      {
        tipo: "tabela",
        titulo: "🔹 Paleta de cores utilizada no projeto",
        colunas: ["Cor", "Código Hex"],
        linhas: [
          ["Rosa",        "#F26D78"],
          ["Roxo",        "#635EF2"],
          ["Roxo escuro", "#5D59D9"],
          ["Azul escuro", "#414059"],
          ["Cinza claro", "#E4E4F2"]
        ]
      },
      {
        tipo: "topico",
        titulo: "🔹 RGB e Hexadecimal",
        texto: "As cores HTML utilizam o sistema **RGB** com representação hexadecimal no formato `#RRGGBB`, onde RR = vermelho, GG = verde, BB = azul.",
        codigo: "#RRGGBB"
      },
      {
        tipo: "imagem",
        src: "figura_esquema_cores.png",
        pasta: "imagens_design/aula_13",
        alt: "Figura 1 — Esquema de cores do projeto extraído automaticamente de uma imagem usando Adobe Color",
        pagina: 6,
        parte_do_conteudo: "Escolha da cor",
        explicacao: "Apresenta a paleta de cores extraída automaticamente de uma imagem usando Adobe Color.",
        id_figura: "figura_esquema_cores",
        num: 1
      },
      {
        tipo: "subtitulo",
        texto: "Background"
      },
      {
        tipo: "texto",
        texto: "O material apresenta o uso de backgrounds SVG personalizados usando o site **SvgBackgrounds**. O background contribui para estética, identidade visual, profundidade visual e modernização da interface."
      },
      {
        tipo: "lista",
        titulo: "Os backgrounds podem alterar:",
        itens: [
          "Cores",
          "Ângulo",
          "Movimento",
          "Espessura"
        ]
      },
      {
        tipo: "imagem",
        src: "figura_background_svg.png",
        pasta: "imagens_design/aula_13",
        alt: "Figura 2 — Background SVG utilizado como fundo visual da landing page",
        pagina: 7,
        parte_do_conteudo: "Escolha do background",
        explicacao: "Mostra o padrão SVG utilizado como fundo visual da landing page.",
        id_figura: "figura_background_svg",
        num: 2
      },
      {
        tipo: "subtitulo",
        texto: "Tipografia"
      },
      {
        tipo: "texto",
        texto: "A tipografia é um elemento essencial da comunicação visual. A escolha inadequada pode prejudicar leitura, usabilidade e experiência do usuário. O material utiliza o **Google Fonts** para importar fontes online gratuitamente."
      },
      {
        tipo: "lista",
        titulo: "A escolha inadequada pode prejudicar:",
        itens: [
          "Leitura",
          "Usabilidade",
          "Experiência do usuário"
        ]
      },
      {
        tipo: "lista",
        titulo: "As fontes transmitem sensações:",
        itens: [
          "Profissionalismo",
          "Modernidade",
          "Informalidade",
          "Criatividade"
        ]
      }
    ]
  },

  {
    id: "html5",
    titulo: "🧠 HTML5 e Web Semântica",
    blocos: [
      {
        tipo: "topico",
        titulo: "🔹 Estrutura básica do HTML5",
        codigo: "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n  <title>Landing Page</title>\n</head>\n<body>\n</body>\n</html>"
      },
      {
        tipo: "imagem",
        src: "figura_estrutura_html5.png",
        pasta: "imagens_design/aula_13",
        alt: "Figura 3 — Estrutura inicial obrigatória de um documento HTML5",
        pagina: 8,
        parte_do_conteudo: "Estruturando com HTML 5",
        explicacao: "Apresenta a estrutura inicial obrigatória de um documento HTML5.",
        id_figura: "figura_estrutura_html5",
        num: 3
      },
      {
        tipo: "topico",
        titulo: "🔹 Web Semântica",
        texto: "A Web Semântica busca criar páginas organizadas, compreensíveis, acessíveis e semanticamente corretas."
      },
      {
        tipo: "lista",
        titulo: "Objetivos da Web Semântica:",
        itens: [
          "Interpretação humana",
          "Interpretação por mecanismos de busca",
          "Acessibilidade",
          "Manutenção do código"
        ]
      },
      {
        tipo: "tabela",
        titulo: "🔹 Principais tags semânticas",
        colunas: ["Tag", "Função"],
        linhas: [
          ["`<section>`",  "Separa seções temáticas do conteúdo"],
          ["`<nav>`",      "Menu de navegação"],
          ["`<article>`",  "Conteúdo independente (notícia, postagem, bloco de serviço)"],
          ["`<aside>`",    "Conteúdo secundário"],
          ["`<footer>`",   "Rodapé da página"],
          ["`<div>`",      "Agrupamento genérico para organização visual e CSS"]
        ]
      },
      {
        tipo: "imagem",
        src: "figura_web_semantica_site.png",
        pasta: "imagens_design/aula_13",
        alt: "Figura 4 — Print de tela demonstrando separação semântica de conteúdos usando tags HTML",
        pagina: 16,
        parte_do_conteudo: "Web Semântica",
        explicacao: "Utilizada para demonstrar separação semântica de conteúdos utilizando tags HTML apropriadas.",
        id_figura: "figura_web_semantica_site",
        num: 4
      }
    ]
  },

  {
    id: "estrutura_pagina",
    titulo: "🏗️ Estrutura da Landing Page",
    blocos: [
      {
        tipo: "topico",
        titulo: "🔹 Menu de Navegação",
        texto: "A navegação é estruturada com `<nav>` para organizar os links internos da página:",
        codigo: "<nav>\n  <ul>\n    <li><a href=\"#\">Home</a></li>\n  </ul>\n</nav>"
      },
      {
        tipo: "topico",
        titulo: "🔹 Grid Layout",
        texto: "O conteúdo é organizado em uma estrutura de grid que divide a página em linhas, colunas e áreas organizadas, facilitando alinhamento, responsividade e organização visual."
      },
      {
        tipo: "topico",
        titulo: "🔹 Tag `<article>`",
        texto: "A tag `<article>` representa conteúdo independente. Exemplos: notícia, postagem, bloco de serviço. No projeto, cada serviço utiliza um `<article>` contendo imagem, título e descrição para separar visualmente os blocos de conteúdo."
      },
      {
        tipo: "lista",
        titulo: "Seções do projeto de landing page:",
        itens: [
          "Menu de navegação",
          "Seção introdutória",
          "Grid de serviços (com `<article>`)",
          "Tabela de preços",
          "Formulário de contato",
          "Rodapé (`<footer>`)"
        ]
      }
    ]
  },

  {
    id: "footer",
    titulo: "🔻 Footer",
    blocos: [
      {
        tipo: "texto",
        texto: "A tag `<footer>` define o rodapé da página."
      },
      {
        tipo: "lista",
        titulo: "Uso comum — contém:",
        itens: [
          "Copyright",
          "Contatos",
          "Links",
          "Informações finais"
        ]
      }
    ]
  },

  {
    id: "formulas_metodos",
    titulo: "🔧 Fórmulas e Métodos",
    blocos: [
      {
        tipo: "topico",
        titulo: "🔹 Estrutura básica HTML5",
        codigo: "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n</head>\n<body>\n</body>\n</html>"
      },
      {
        tipo: "topico",
        titulo: "🔹 Estrutura de menu",
        codigo: "<nav>\n  <ul>\n    <li><a href=\"#\">Home</a></li>\n  </ul>\n</nav>"
      },
      {
        tipo: "topico",
        titulo: "🔹 Estrutura de tabela",
        codigo: "<table>\n  <thead>\n  </thead>\n  <tbody>\n  </tbody>\n</table>"
      },
      {
        tipo: "topico",
        titulo: "🔹 Estrutura de formulário",
        codigo: "<form>\n  <input type=\"email\">\n  <input type=\"submit\">\n</form>"
      },
      {
        tipo: "topico",
        titulo: "🔹 Meta viewport",
        codigo: "<meta name=\"viewport\"\ncontent=\"width=device-width, initial-scale=1\">"
      },
      {
        tipo: "topico",
        titulo: "🔹 Importação de fontes",
        texto: "Utiliza bibliotecas como Google Fonts."
      },
      {
        tipo: "topico",
        titulo: "🔹 Uso de imagens SVG",
        codigo: "<img src=\"assets/img/imagem.svg\">"
      }
    ]
  },

  {
    id: "tabelas",
    titulo: "📊 Tabelas HTML",
    blocos: [
      {
        tipo: "texto",
        texto: "As tabelas organizam dados em linhas e colunas, sendo úteis para exibir preços, comparações e informações estruturadas."
      },
      {
        tipo: "tabela",
        titulo: "🔹 Estrutura da tabela",
        colunas: ["Elemento", "Função"],
        linhas: [
          ["`<table>`",  "Cria a tabela"],
          ["`<thead>`",  "Cabeçalho da tabela"],
          ["`<tbody>`",  "Corpo da tabela"],
          ["`<tr>`",     "Linha da tabela"],
          ["`<th>`",     "Cabeçalho da coluna (negrito por padrão)"],
          ["`<td>`",     "Dado da célula"]
        ]
      },
      {
        tipo: "topico",
        titulo: "🔹 Estrutura básica",
        codigo: "<table>\n  <thead>\n  </thead>\n  <tbody>\n  </tbody>\n</table>"
      }
    ]
  },

  {
    id: "formularios",
    titulo: "📝 Formulários HTML",
    blocos: [
      {
        tipo: "texto",
        texto: "Os formulários permitem a entrada de dados do usuário, sendo usados para cadastro, login, contato e envio de informações. O elemento principal é a tag `<form>`."
      },
      {
        tipo: "topico",
        titulo: "🔹 Estrutura básica",
        codigo: "<form>\n  <input type=\"email\">\n  <input type=\"submit\">\n</form>"
      },
      {
        tipo: "tabela",
        titulo: "🔹 Tipos de Input",
        colunas: ["Tipo", "Função"],
        linhas: [
          ["text",     "Campo de texto livre"],
          ["email",    "Valida formato de e-mail"],
          ["password", "Oculta os caracteres digitados"],
          ["date",     "Permite selecionar uma data"],
          ["file",     "Permite envio de arquivos"],
          ["radio",    "Permite apenas **uma** opção entre as apresentadas"],
          ["checkbox", "Permite **múltiplas** seleções"],
          ["range",    "Cria controle deslizante"],
          ["submit",   "Envia o formulário"],
          ["reset",    "Limpa o formulário"]
        ]
      },
      {
        tipo: "destaque",
        texto: "📌 Para prova: diferença entre `radio` (uma única opção) e `checkbox` (múltiplas opções)."
      }
    ]
  },

  {
    id: "responsividade",
    titulo: "📱 Responsividade — Meta Viewport",
    blocos: [
      {
        tipo: "texto",
        texto: "O **meta viewport** é essencial para o design responsivo, adaptando a página a dispositivos móveis."
      },
      {
        tipo: "topico",
        titulo: "🔹 Tag meta viewport",
        codigo: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"
      },
      {
        tipo: "lista",
        titulo: "O que faz:",
        itens: [
          "Ajusta a largura da página à tela do dispositivo",
          "Define o nível de zoom inicial como 1 (sem zoom)"
        ]
      }
    ]
  },

  {
    id: "exemplos",
    titulo: "📊 Exemplos Explicativos",
    blocos: [
      {
        tipo: "exemplo",
        titulo: "Exemplo — Landing Page",
        texto: "O projeto cria uma página contendo:",
        lista: [
          "Menu",
          "Seção introdutória",
          "Grid de serviços",
          "Tabela de preços",
          "Formulário",
          "Rodapé"
        ]
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo — Grid de serviços",
        texto: "Cada serviço utiliza `<article>` contendo imagem, título e descrição.",
        detalhe: "👉 Objetivo: separar conteúdos visualmente."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo — Formulário",
        texto: "O formulário coleta:",
        lista: [
          "E-mail",
          "Senha",
          "Arquivos",
          "Opções",
          "Interesses"
        ]
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo — Web Semântica",
        texto: "O conteúdo mostra como usar `<section>`, `<nav>`, `<article>` e `<footer>` para organizar corretamente o HTML."
      }
    ]
  },

  {
    id: "resumo",
    titulo: "⚡ Resumo Final para Revisão Rápida",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Tags semânticas importantes",
        colunas: ["Tag", "Função"],
        linhas: [
          ["`<section>`",  "Seção temática"],
          ["`<nav>`",      "Menu de navegação"],
          ["`<article>`",  "Conteúdo independente"],
          ["`<aside>`",    "Conteúdo secundário"],
          ["`<footer>`",   "Rodapé"]
        ]
      },
      {
        tipo: "tabela",
        titulo: "Inputs de formulário",
        colunas: ["Tipo", "Função"],
        linhas: [
          ["text / email / password", "Entradas de texto"],
          ["date / file",             "Seleção de data e arquivo"],
          ["radio",                   "Uma única opção"],
          ["checkbox",                "Múltiplas opções"],
          ["range",                   "Controle deslizante"],
          ["submit / reset",          "Enviar / Limpar formulário"]
        ]
      },
      {
        tipo: "tabela",
        titulo: "Elementos de tabela",
        colunas: ["Tag", "Função"],
        linhas: [
          ["`<table>`", "Tabela"],
          ["`<tr>`",    "Linha"],
          ["`<th>`",    "Cabeçalho"],
          ["`<td>`",    "Dado"]
        ]
      },
      {
        tipo: "topico",
        titulo: "🔹 Cores — RGB e Hexadecimal",
        texto: "As cores utilizam o sistema RGB com representação hexadecimal:",
        codigo: "#RRGGBB"
      },
      {
        tipo: "topico",
        titulo: "🔹 Responsividade — Meta viewport",
        codigo: "<meta name=\"viewport\"\ncontent=\"width=device-width, initial-scale=1\">"
      },
      {
        tipo: "destaque",
        texto: "📌 Mais cobrados em prova: Web Semântica · Estrutura HTML5 · Formulários e tipos de input · Diferença entre radio e checkbox · Tabelas HTML · Organização de landing page · Uso de `<section>`, `<article>`, `<nav>` e `<footer>` · Conceito de responsividade · Estrutura de grids · Função do meta viewport."
      }
    ]
  }
  ]
  },
  // Aula 14 — Formatando com CSS
  {
  aula: "Aula 14 — Formatando com CSS",
  ideia_central: "CSS é a linguagem responsável pela aparência visual das páginas HTML, permitindo estilizar cores, fontes, layouts, espaçamentos e responsividade de forma separada da estrutura.",
  secoes: [
  {
    id: "visao",
    titulo: "🧭 Visão Geral",
    blocos: [
      {
        tipo: "texto",
        texto: "O material apresenta os principais fundamentos de **CSS (Cascading Style Sheets)** aplicados ao desenvolvimento de uma **landing page**, mostrando como separar **estrutura (HTML)** de **estilo visual (CSS)**."
      },
      {
        tipo: "lista",
        titulo: "Temas centrais abordados:",
        itens: [
          "Vinculação do CSS ao HTML",
          "Uso de bibliotecas externas de fontes",
          "Seletores CSS",
          "Classes e IDs",
          "Variáveis CSS",
          "Estilização de menus",
          "Criação de layouts com CSS Grid",
          "Estilização de tabelas e formulários",
          "Organização visual e responsividade básica"
        ]
      }
    ]
  },

  {
    id: "o_que_e_css",
    titulo: "🎨 O que é CSS",
    blocos: [
      {
        tipo: "texto",
        texto: "**CSS** significa **Cascading Style Sheets** (Folhas de Estilo em Cascata). Sua função é definir a aparência visual das páginas HTML."
      },
      {
        tipo: "lista",
        titulo: "O CSS define:",
        itens: [
          "Aparência",
          "Cores",
          "Espaçamento",
          "Fontes",
          "Alinhamentos",
          "Grids",
          "Responsividade",
          "Efeitos visuais"
        ]
      },
      {
        tipo: "lista",
        titulo: "O CSS trabalha separado do HTML, permitindo:",
        itens: [
          "Organização",
          "Reaproveitamento",
          "Manutenção mais fácil",
          "Melhor padronização visual"
        ]
      }
    ]
  },

  {
    id: "vinculacao",
    titulo: "🔗 Vinculando HTML e CSS",
    blocos: [
      {
        tipo: "texto",
        texto: "O HTML precisa estar conectado ao arquivo `.css` para que os estilos sejam aplicados."
      },
      {
        tipo: "topico",
        titulo: "🔹 Código de vinculação",
        codigo: "<link rel=\"stylesheet\" href=\"assets/css/style.css\">"
      },
      {
        tipo: "lista",
        titulo: "Importância:",
        itens: [
          "Separação entre conteúdo e design",
          "Facilita manutenção",
          "Permite reutilização do estilo"
        ]
      },
      {
        tipo: "topico",
        titulo: "🔹 Testando o vínculo do CSS",
        texto: "Para verificar se o CSS está realmente conectado ao HTML, utiliza-se um teste simples: se a página mudar de cor, o vínculo funcionou.",
        codigo: "body {\n    background-color: red;\n}"
      }
    ]
  },

  {
    id: "fontes",
    titulo: "✏️ Google Fonts e Tipografia",
    blocos: [
      {
        tipo: "texto",
        texto: "O material mostra como importar fontes externas usando o **Google Fonts**."
      },
      {
        tipo: "lista",
        titulo: "Fontes utilizadas no projeto:",
        itens: [
          "**Lato** → títulos",
          "**Nunito** → textos"
        ]
      },
      {
        tipo: "topico",
        titulo: "🔹 Aplicação das fontes",
        codigo: "body {\n    font-family: 'Nunito', sans-serif;\n}\n\nh1, h2, h3, h4, h5, h6 {\n    font-family: 'Lato', sans-serif;\n}"
      },
      {
        tipo: "topico",
        titulo: "🔹 Tipografia no Design",
        texto: "A escolha tipográfica impacta diretamente a legibilidade, leitura, experiência do usuário e estética visual. Fontes inadequadas podem dificultar a leitura, gerar poluição visual e reduzir acessibilidade."
      },
      {
        tipo: "topico",
        titulo: "🔹 text-transform",
        texto: "Transforma texto em maiúsculo.",
        codigo: "h1 {\n    text-transform: uppercase;\n}"
      }
    ]
  },

  {
    id: "seletores",
    titulo: "🎯 Seletores CSS",
    blocos: [
      {
        tipo: "subtitulo",
        texto: "Seletores de Classe"
      },
      {
        tipo: "texto",
        texto: "Classes usam `.` no CSS. São reutilizáveis e podem ser aplicadas em vários elementos."
      },
      {
        tipo: "topico",
        titulo: "🔹 Exemplo de classe",
        codigo: ".bg {\n    background-image: url('../img/background-primary.svg');\n}"
      },
      {
        tipo: "topico",
        titulo: "🔹 Uso no HTML",
        codigo: "<section class=\"bg\">"
      },
      {
        tipo: "subtitulo",
        texto: "Seletores de ID"
      },
      {
        tipo: "texto",
        texto: "IDs usam `#`. São identificadores únicos, usados em navegação e ideais para landing pages."
      },
      {
        tipo: "topico",
        titulo: "🔹 Exemplo de ID",
        codigo: "<section id=\"intro\">"
      },
      {
        tipo: "imagem",
        src: "figura_css_ids_sections.png",
        pasta: "imagens_design/aula_14",
        alt: "Figura 1 — Adicionando os identificadores de ID às seções HTML para navegação interna",
        num: 1
      },
      {
        tipo: "imagem",
        src: "figura_css_linkagem_ids.png",
        pasta: "imagens_design/aula_14",
        alt: "Figura 2 — Linkando conteúdos com href='#id' para conectar itens do menu às seções",
        num: 2
      }
    ]
  },

  {
    id: "backgrounds",
    titulo: "🖼️ Backgrounds",
    blocos: [
      {
        tipo: "topico",
        titulo: "🔹 background-image",
        texto: "Define imagem de fundo.",
        codigo: "background-image: url('../img/background-primary.svg');"
      },
      {
        tipo: "topico",
        titulo: "🔹 background-size: cover",
        texto: "Faz a imagem ocupar toda a área, cortando o excesso quando necessário.",
        codigo: "background-size: cover;"
      },
      {
        tipo: "topico",
        titulo: "🔹 background-position",
        texto: "Centraliza a imagem.",
        codigo: "background-position: center center;"
      }
    ]
  },

  {
    id: "layout",
    titulo: "📐 Layout e Posicionamento",
    blocos: [
      {
        tipo: "subtitulo",
        texto: "Classe .content"
      },
      {
        tipo: "topico",
        titulo: "🔹 Código",
        codigo: ".content {\n    max-width: 1200px;\n    margin: 0 auto;\n}"
      },
      {
        tipo: "topico",
        titulo: "🔹 max-width",
        texto: "Define a largura máxima do elemento."
      },
      {
        tipo: "topico",
        titulo: "🔹 margin: 0 auto",
        texto: "Centraliza o elemento horizontalmente."
      },
      {
        tipo: "subtitulo",
        texto: "Containers"
      },
      {
        tipo: "topico",
        titulo: "🔹 Código",
        codigo: ".container {\n    padding: 3% 4%;\n    text-align: center;\n}"
      }
    ]
  },

  {
    id: "variaveis",
    titulo: "🔑 Variáveis CSS",
    blocos: [
      {
        tipo: "texto",
        texto: "Variáveis CSS são definidas em `:root` e podem ser reutilizadas em todo o arquivo."
      },
      {
        tipo: "topico",
        titulo: "🔹 Definição",
        codigo: ":root {\n    --cor-cinza: #e4e4f2;\n    --cor-azulescuro: #414059;\n    --gap: 30px;\n}"
      },
      {
        tipo: "topico",
        titulo: "🔹 Uso",
        codigo: "color: var(--cor-cinza);"
      },
      {
        tipo: "lista",
        titulo: "Vantagens das variáveis:",
        itens: [
          "Reutilização",
          "Padronização",
          "Manutenção rápida",
          "Consistência visual"
        ]
      }
    ]
  },

  {
    id: "flexbox_menu",
    titulo: "↔️ Flexbox no Menu",
    blocos: [
      {
        tipo: "texto",
        texto: "O menu utiliza **Flexbox** para distribuir seus elementos."
      },
      {
        tipo: "topico",
        titulo: "🔹 Código",
        codigo: "display: flex;\njustify-content: space-between;"
      },
      {
        tipo: "topico",
        titulo: "🔹 display: flex",
        texto: "Transforma elementos em layout flexível."
      },
      {
        tipo: "topico",
        titulo: "🔹 justify-content: space-between",
        texto: "Distribui elementos com um no início e outro no fim."
      },
      {
        tipo: "subtitulo",
        texto: "Menu Fixo"
      },
      {
        tipo: "topico",
        titulo: "🔹 Código",
        codigo: "position: fixed;\ntop: 0;"
      },
      {
        tipo: "texto",
        texto: "O menu permanece fixo enquanto a página rola."
      },
      {
        tipo: "subtitulo",
        texto: "Limpeza visual do menu"
      },
      {
        tipo: "topico",
        titulo: "🔹 Removendo marcadores da lista",
        codigo: "list-style: none;"
      },
      {
        tipo: "topico",
        titulo: "🔹 Removendo sublinhado dos links",
        codigo: "a {\n    text-decoration: none;\n}"
      }
    ]
  },

  {
    id: "grid",
    titulo: "⚙️ CSS Grid",
    blocos: [
      {
        tipo: "texto",
        texto: "O material introduz o **Grid Layout** para criação de layouts com colunas."
      },
      {
        tipo: "topico",
        titulo: "🔹 Grid de 2 colunas",
        texto: "Cria 2 colunas iguais.",
        codigo: ".grid1 {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n}"
      },
      {
        tipo: "topico",
        titulo: "🔹 Grid de 3 colunas",
        texto: "Cria 3 colunas proporcionais.",
        codigo: ".grid2 {\n    grid-template-columns: 1fr 1fr 1fr;\n}"
      },
      {
        tipo: "topico",
        titulo: "🔹 Unidade fr (fraction)",
        texto: "`1fr` representa uma fração do espaço disponível."
      },
      {
        tipo: "imagem",
        src: "figura_css_grid_classes.png",
        pasta: "imagens_design/aula_14",
        alt: "Figura 3 — Vinculando as classes aos seus elementos para funcionamento correto de grids com múltiplas colunas",
        num: 3
      }
    ]
  },

  {
    id: "responsividade",
    titulo: "📱 Responsividade Básica",
    blocos: [
      {
        tipo: "texto",
        texto: "Imagens recebem propriedades para evitar distorções e se adaptar ao tamanho da coluna."
      },
      {
        tipo: "topico",
        titulo: "🔹 Código",
        codigo: "max-width: 100%;\nheight: auto;"
      }
    ]
  },

  {
    id: "tabelas",
    titulo: "📊 Estilização de Tabelas",
    blocos: [
      {
        tipo: "topico",
        titulo: "🔹 border-collapse",
        texto: "Une bordas da tabela.",
        codigo: "border-collapse: collapse;"
      },
      {
        tipo: "topico",
        titulo: "🔹 Estilo das células",
        codigo: "table td, table th {\n    border: 1px solid gray;\n    padding: 5px;\n}"
      }
    ]
  },

  {
    id: "formulas_metodos",
    titulo: "🔧 Fórmulas e Métodos",
    blocos: [
      {
        tipo: "topico",
        titulo: "🔹 Vincular CSS externo",
        codigo: "<link rel=\"stylesheet\" href=\"style.css\">"
      },
      {
        tipo: "topico",
        titulo: "🔹 Importar fontes",
        lista: [
          "Acessar Google Fonts",
          "Escolher fonte",
          "Copiar `<link>`",
          "Aplicar `font-family`"
        ]
      },
      {
        tipo: "topico",
        titulo: "🔹 Criar variável CSS",
        codigo: ":root {\n    --nome: valor;\n}\n\ncolor: var(--nome);"
      },
      {
        tipo: "topico",
        titulo: "🔹 Criar Grid — 2 colunas",
        codigo: "grid-template-columns: 1fr 1fr;"
      },
      {
        tipo: "topico",
        titulo: "🔹 Criar Grid — 3 colunas",
        codigo: "grid-template-columns: 1fr 1fr 1fr;"
      },
      {
        tipo: "topico",
        titulo: "🔹 Centralizar conteúdo",
        codigo: "margin: 0 auto;"
      },
      {
        tipo: "topico",
        titulo: "🔹 Fixar menu",
        codigo: "position: fixed;"
      },
      {
        tipo: "topico",
        titulo: "🔹 Remover sublinhado",
        codigo: "text-decoration: none;"
      }
    ]
  },

  {
    id: "exemplos",
    titulo: "📊 Exemplos Explicativos",
    blocos: [
      {
        tipo: "exemplo",
        titulo: "Exemplo 1 — Classe reutilizável",
        texto: "A classe `.bg` pode ser usada em sections, divs e containers.",
        codigo: ".bg {\n    background-image: url(...);\n}"
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo 2 — ID para navegação",
        texto: "Ao clicar no link do menu, a página rola até a seção correspondente.",
        codigo: "<section id=\"servicos\">\n\n<a href=\"#servicos\">"
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo 3 — Grid",
        texto: "Resultado: texto à esquerda, imagem à direita.",
        codigo: "display: grid;\ngrid-template-columns: 1fr 1fr;"
      }
    ]
  },

  {
    id: "resumo",
    titulo: "⚡ Resumo Final para Revisão Rápida",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Conceitos principais",
        colunas: ["Conceito", "Resumo"],
        linhas: [
          ["CSS",              "Estiliza páginas HTML; separa conteúdo e aparência"],
          ["Vinculação CSS",   "`<link rel='stylesheet' href='style.css'>`"],
          ["Classes",         "Reutilizáveis; usam `.`"],
          ["IDs",             "Únicos; usados em navegação com `#`"],
          ["Variáveis CSS",   "Definidas em `:root`; usadas com `var(--nome)`"],
          ["Flexbox",         "`display: flex` — usado em menus e alinhamentos"],
          ["Grid 2 colunas",  "`grid-template-columns: 1fr 1fr`"],
          ["Grid 3 colunas",  "`grid-template-columns: 1fr 1fr 1fr`"],
          ["Menu fixo",       "`position: fixed`"],
          ["Responsividade",  "`max-width: 100%; height: auto`"],
          ["Sem bullets",     "`list-style: none`"],
          ["Sem sublinhado",  "`text-decoration: none`"]
        ]
      },
      {
        tipo: "destaque",
        texto: "📌 Mais cobrados em prova: diferença entre class e id · CSS Grid · Flexbox · variáveis CSS · vinculação HTML/CSS · Google Fonts · responsividade · propriedades de layout · background-image · padding, margin e border · navegação com IDs."
      },
      {
        tipo: "imagem",
        src: "figura_css_resultado_final.png",
        pasta: "imagens_design/aula_14",
        alt: "Figura 4 — Landing page totalmente estilizada com menu, grids, imagens, tabela e rodapé",
        num: 4
      }
    ]
  }
  ]
  },
  // Aula 15 - Revisão Projeto de Design para Web
  {
  aula: "Aula 15 - Revisão Projeto de Design para Web",
  ideia_central: "Um bom projeto web deve ser responsivo, centrado no usuário, organizado semanticamente, acessível, visualmente consistente, ergonomicamente adequado e otimizado para diferentes dispositivos.",
  secoes: [
    {
      id: "visao_geral",
      titulo: "Visão geral do conteúdo",
      blocos: [
        {
          tipo: "texto",
          texto: "O material apresenta uma revisão prática dos principais conceitos de **Design para Web**, focando no desenvolvimento de um site utilizando a metodologia **Mobile First**."
        },
        {
          tipo: "lista",
          titulo: "A aula integra conceitos de",
          itens: [
            "Design de interfaces",
            "HTML5",
            "CSS3",
            "Responsividade",
            "JavaScript/JQuery",
            "Ergonomia",
            "Engenharia semiótica",
            "Psicologia cognitiva",
            "Tipografia",
            "Cores",
            "Testes de interfaces",
            "Hospedagem de sites"
          ]
        },
        {
          tipo: "destaque",
          texto: "O projeto desenvolvido durante o módulo consiste na criação de uma interface web responsiva, começando por telas pequenas (smartphones) e depois adaptando para tablets e desktops através de **Media Queries**."
        }
      ]
    },
    {
      id: "mobile_first",
      titulo: "Mobile First",
      blocos: [
        {
          tipo: "texto",
          texto: "O conceito de **Mobile First** consiste em desenvolver primeiro para dispositivos móveis e, posteriormente, adaptar o layout para telas maiores."
        },
        {
          tipo: "lista",
          titulo: "Características",
          itens: [
            "Foco em telas pequenas",
            "Priorização de conteúdo essencial",
            "Melhor desempenho",
            "Responsividade gradual",
            "Adaptação progressiva via breakpoints"
          ]
        },
        {
          tipo: "lista",
          titulo: "Vantagens",
          itens: [
            "Melhor experiência em smartphones",
            "Organização mais eficiente do layout",
            "Código mais limpo",
            "Maior compatibilidade"
          ]
        },
        {
          tipo: "imagem",
          src: "figura_wireframe_mobile_first.png",
          pasta: "imagens_design/aula_15",
          alt: "Wireframe inicial da interface mobile first representando a organização visual do layout antes da implementação",
          num: 1
        }
      ]
    },
    {
      id: "design_centrado_usuario",
      titulo: "Design Centrado no Usuário",
      blocos: [
        {
          tipo: "lista",
          titulo: "O conteúdo reforça a importância do",
          itens: [
            "Foco no usuário",
            "Ergonomia",
            "Usabilidade",
            "Acessibilidade",
            "Comunicabilidade"
          ]
        },
        {
          tipo: "lista",
          titulo: "O projeto deve considerar",
          itens: [
            "Necessidades do usuário",
            "Facilidade de navegação",
            "Clareza visual",
            "Consistência",
            "Conforto cognitivo"
          ]
        }
      ]
    },
    {
      id: "ergonomia",
      titulo: "Ergonomia de Interfaces",
      blocos: [
        {
          tipo: "tabela",
          titulo: "Critérios ergonômicos",
          colunas: ["Critério", "Função"],
          linhas: [
            ["Compatibilidade", "Interface coerente com expectativas do usuário"],
            ["Condução", "Orientação da navegação"],
            ["Carga de trabalho", "Redução do esforço mental"],
            ["Homogeneidade", "Padrões consistentes"],
            ["Controle explícito", "Usuário controla ações"],
            ["Adaptabilidade", "Interface flexível"],
            ["Gestão de erros", "Prevenção e tratamento de erros"]
          ]
        }
      ]
    },
    {
      id: "engenharia_semiotica",
      titulo: "Engenharia Semiótica",
      blocos: [
        {
          tipo: "texto",
          texto: "A engenharia semiótica analisa a comunicação entre designer, sistema e usuário."
        },
        {
          tipo: "lista",
          titulo: "A interface transmite mensagens através de",
          itens: [
            "Signos visuais",
            "Símbolos",
            "Comportamentos",
            "Feedbacks"
          ]
        },
        {
          tipo: "topico",
          titulo: "Etapas da inspeção semiótica",
          lista: [
            "1. Inspeção de signos metalinguísticos",
            "2. Inspeção de signos estáticos",
            "3. Inspeção de signos dinâmicos",
            "4. Comparação das metamensagens",
            "5. Avaliação da metacomunicação"
          ]
        }
      ]
    },
    {
      id: "psicologia_cognitiva",
      titulo: "Psicologia Cognitiva no Design",
      blocos: [
        {
          tipo: "tabela",
          titulo: "Fatores cognitivos importantes",
          colunas: ["Conceito", "Objetivo"],
          linhas: [
            ["Atenção seletiva", "Direcionar foco do usuário"],
            ["Vigilância", "Detectar informações importantes"],
            ["Memória de curto prazo", "Facilitar retenção momentânea"],
            ["Memória de longo prazo", "Facilitar aprendizado"],
            ["Interpretação", "Compreensão visual"],
            ["Categorização", "Organização mental"]
          ]
        }
      ]
    },
    {
      id: "elementos_compositivos",
      titulo: "Elementos Compositivos do Design",
      blocos: [
        {
          tipo: "subtitulo",
          texto: "Tipografia"
        },
        {
          tipo: "lista",
          titulo: "Fontes escolhidas",
          itens: [
            "**Lato Black 900** → títulos",
            "**Nunito Regular 400** → textos"
          ]
        },
        {
          tipo: "lista",
          titulo: "Objetivos da tipografia",
          itens: [
            "Melhorar leitura",
            "Criar hierarquia visual",
            "Reforçar identidade visual"
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Cores"
        },
        {
          tipo: "lista",
          titulo: "As cores possuem",
          itens: [
            "Valor emocional",
            "Valor psicológico",
            "Valor semiótico"
          ]
        },
        {
          tipo: "lista",
          titulo: "O esquema de cores deve considerar",
          itens: [
            "Contraste",
            "Harmonia",
            "Temperatura",
            "Significado visual"
          ]
        },
        {
          tipo: "imagem",
          src: "figura_esquema_cores.png",
          pasta: "imagens_design/aula_15",
          alt: "Paleta de cores utilizada no projeto demonstrando a definição da identidade visual",
          num: 2
        },
        {
          tipo: "subtitulo",
          texto: "Imagens e Ícones"
        },
        {
          tipo: "texto",
          texto: "Os ícones foram implementados usando **FontAwesome**."
        },
        {
          tipo: "lista",
          titulo: "Objetivos",
          itens: [
            "Melhorar comunicação visual",
            "Reforçar significados",
            "Facilitar navegação"
          ]
        }
      ]
    },
    {
      id: "html5",
      titulo: "Estrutura HTML5",
      blocos: [
        {
          tipo: "lista",
          titulo: "O HTML é utilizado para",
          itens: [
            "Estruturar conteúdo",
            "Organizar elementos semânticos",
            "Definir hierarquia da página"
          ]
        },
        {
          tipo: "tabela",
          titulo: "Elementos utilizados",
          colunas: ["Elemento", "Função"],
          linhas: [
            ["``", "Cabeçalho"],
            ["``", "Navegação"],
            ["``", "Conteúdo principal"],
            ["``", "Conteúdo independente"],
            ["``", "Agrupamento temático"],
            ["``", "Rodapé"]
          ]
        },
        {
          tipo: "topico",
          titulo: "Estrutura HTML básica",
          texto: "Uso: estrutura inicial da página.\n\n`\n\n\n  Mobile First\n\n\n\n`"
        },
        {
          tipo: "topico",
          titulo: "Inclusão do CSS",
          texto: "Uso: vincular arquivo CSS externo.\n\n``"
        },
        {
          tipo: "imagem",
          src: "figura_interface_mobile.png",
          pasta: "imagens_design/aula_15",
          alt: "Resultado final da versão mobile do site após aplicação do HTML e CSS",
          num: 3
        }
      ]
    },
    {
      id: "css3",
      titulo: "CSS3",
      blocos: [
        {
          tipo: "lista",
          titulo: "O CSS é responsável pela",
          itens: [
            "Estilização",
            "Layout",
            "Responsividade",
            "Animações visuais",
            "Formatação gráfica"
          ]
        },
        {
          tipo: "lista",
          titulo: "Conceitos importantes",
          itens: [
            "Classes",
            "Seletores",
            "Responsividade",
            "Hover",
            "Background",
            "Grid",
            "Float",
            "Media queries"
          ]
        },
        {
          tipo: "topico",
          titulo: "Background com CSS",
          texto: "Uso: inserir imagem de fundo fixa.\n\n`.banner {\n  background: url(../img/background-primary.svg) no-repeat fixed;\n}`"
        },
        {
          tipo: "topico",
          titulo: "Botão responsivo (hambúrguer circular)",
          texto: "Uso: criar botão hambúrguer circular.\n\n`.btn-menu {\n  width: 56px;\n  height: 56px;\n  border-radius: 36px;\n}`"
        },
        {
          tipo: "topico",
          titulo: "Ocultar menu",
          texto: "Uso: esconder menu até ação do usuário.\n\n`.menu {\n  display: none;\n}`"
        },
        {
          tipo: "topico",
          titulo: "Grid responsiva",
          texto: "Uso: organizar conteúdo em colunas.\n\n`.servico {\n  width: 49%;\n  float: left;\n}`"
        }
      ]
    },
    {
      id: "menu_hamburger_jquery",
      titulo: "Menu Hambúrguer e JQuery",
      blocos: [
        {
          tipo: "subtitulo",
          texto: "Menu Hambúrguer"
        },
        {
          tipo: "lista",
          titulo: "O menu mobile utiliza",
          itens: [
            "Botão hambúrguer",
            "Menu oculto",
            "JavaScript/JQuery"
          ]
        },
        {
          tipo: "lista",
          titulo: "Funcionamento",
          itens: [
            "Botão abre o menu",
            "Botão close fecha o menu",
            "Menu ocupa tela inteira no mobile"
          ]
        },
        {
          tipo: "subtitulo",
          texto: "JQuery"
        },
        {
          tipo: "texto",
          texto: "O JQuery é uma biblioteca JavaScript usada para simplificar scripts, manipular elementos e criar interatividade."
        },
        {
          tipo: "lista",
          titulo: "No projeto foi usado para",
          itens: [
            "Mostrar menu",
            "Ocultar menu"
          ]
        },
        {
          tipo: "topico",
          titulo: "Mostrar menu com JQuery",
          texto: "Uso: abrir menu ao clicar no botão hambúrguer.\n\n`$(\".btn-menu\").click(function() {\n  $(\".menu\").show();\n});`"
        },
        {
          tipo: "topico",
          titulo: "Esconder menu com JQuery",
          texto: "Uso: fechar menu ao clicar no botão close.\n\n`$(\".btn-close\").click(function() {\n  $(\".menu\").hide();\n});`"
        }
      ]
    },
    {
      id: "responsividade_breakpoints",
      titulo: "Responsividade e Breakpoints",
      blocos: [
        {
          tipo: "texto",
          texto: "A responsividade adapta o layout conforme o tamanho da tela, utilizando **Media Queries** e **Breakpoints**."
        },
        {
          tipo: "topico",
          titulo: "Tablet — @media screen and (min-width: 768px)",
          lista: [
            "Transformar grid em 2 colunas",
            "Reorganizar formulário",
            "Ajustar tamanhos"
          ]
        },
        {
          tipo: "topico",
          titulo: "Desktop — @media screen and (min-width: 960px)",
          lista: [
            "Layout em 3 colunas",
            "Reorganizar botões",
            "Ampliar tipografia"
          ]
        },
        {
          tipo: "topico",
          titulo: "WideScreen — @media screen and (min-width: 1280px)",
          lista: [
            "Remover menu hambúrguer",
            "Exibir menu horizontal",
            "Melhorar navegação desktop"
          ]
        },
        {
          tipo: "imagem",
          src: "figura_responsividade_mobile_desktop.png",
          pasta: "imagens_design/aula_15",
          alt: "Comparação do layout mobile com o desktop evidenciando as adaptações responsivas",
          num: 4
        }
      ]
    },
    {
      id: "hospedagem",
      titulo: "Hospedagem Gratuita",
      blocos: [
        {
          tipo: "texto",
          texto: "Foi utilizada a plataforma **Netlify Drop** para hospedagem gratuita do projeto."
        },
        {
          tipo: "lista",
          titulo: "Funções",
          itens: [
            "Deploy do site",
            "Hospedagem gratuita",
            "Geração de domínio"
          ]
        },
        {
          tipo: "topico",
          titulo: "Etapas de publicação",
          lista: [
            "1. Cadastro na plataforma",
            "2. Upload da pasta do projeto",
            "3. Deploy",
            "4. Geração de URL"
          ]
        }
      ]
    },
    {
      id: "testes_interface",
      titulo: "Testes de Interface",
      blocos: [
        {
          tipo: "lista",
          titulo: "O conteúdo aborda",
          itens: [
            "Testes funcionais",
            "Performance",
            "Acessibilidade",
            "SEO",
            "Boas práticas"
          ]
        },
        {
          tipo: "destaque",
          texto: "Ferramenta utilizada: **Lighthouse** (Chrome DevTools)"
        },
        {
          tipo: "tabela",
          titulo: "Categorias avaliadas pelo Lighthouse",
          colunas: ["Categoria", "Objetivo"],
          linhas: [
            ["Performance", "Velocidade"],
            ["Accessibility", "Acessibilidade"],
            ["Best Practices", "Boas práticas"],
            ["SEO", "Otimização para buscas"],
            ["PWA", "Compatibilidade moderna"]
          ]
        },
        {
          tipo: "lista",
          titulo: "Problemas comuns detectados",
          itens: [
            "Ausência de atributo alt em imagens",
            "Links quebrados",
            "Falta de meta description"
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
          titulo: "Menu Mobile",
          texto: "O menu hambúrguer economiza espaço e melhora a navegação mobile, aparecendo apenas em telas pequenas.",
          detalhe: "Em telas grandes é substituído por menu horizontal."
        },
        {
          tipo: "exemplo",
          titulo: "Grid Responsiva",
          texto: "No mobile os serviços aparecem verticalmente; no tablet em duas colunas; no desktop em três colunas.",
          detalhe: "Isso melhora organização, aproveitamento do espaço e leitura."
        },
        {
          tipo: "exemplo",
          titulo: "Responsividade via Media Queries",
          texto: "Através das Media Queries o layout muda automaticamente, elementos redimensionam, botões reorganizam posição e o menu adapta seu comportamento conforme o breakpoint ativo."
        }
      ]
    },
    {
      id: "resumo",
      titulo: "Resumo Final para Revisão Rápida",
      blocos: [
        {
          tipo: "tabela",
          titulo: "Ferramentas utilizadas",
          colunas: ["Ferramenta", "Função"],
          linhas: [
            ["VSCode", "Desenvolvimento"],
            ["Chrome", "Visualização"],
            ["Window Resizer", "Simulação de telas"],
            ["FontAwesome", "Ícones"],
            ["Google Fonts", "Tipografia"],
            ["Netlify", "Hospedagem"],
            ["Lighthouse", "Testes"]
          ]
        },
        {
          tipo: "topico",
          titulo: "Mobile First",
          lista: [
            "Desenvolvimento começa pelo mobile",
            "Adaptação gradual para telas maiores"
          ]
        },
        {
          tipo: "topico",
          titulo: "HTML5",
          lista: [
            "Estrutura e semântica da página",
            "Tags principais: header, nav, main, article, section, footer"
          ]
        },
        {
          tipo: "topico",
          titulo: "CSS3",
          lista: [
            "Layout, cores, responsividade e estilização"
          ]
        },
        {
          tipo: "topico",
          titulo: "Responsividade — Breakpoints usados",
          lista: [
            "768px → tablet",
            "960px → desktop",
            "1280px → widescreen"
          ]
        },
        {
          tipo: "topico",
          titulo: "JQuery",
          lista: [
            "Abrir menu",
            "Fechar menu",
            "Criar interatividade"
          ]
        },
        {
          tipo: "lista",
          titulo: "Testes importantes",
          itens: [
            "Acessibilidade",
            "Performance",
            "SEO",
            "Boas práticas",
            "Responsividade"
          ]
        }
      ]
    }
  ]
  }

  ],

  simplificado: [
  // Aula 9 — Prototipagem e Norma ISO 9241
  {
    aula: "Aula 9 — Prototipagem e Norma ISO 9241",

    ideia_central: "Os modelos de ciclo de vida evoluíram de abordagens sequenciais e rígidas para métodos centrados no usuário, culminando no Design Thinking e na Norma ISO 9241, que estabelece princípios de ergonomia, usabilidade e interação humano-computador.",

    secoes: [

      {
        id: "ciclo-vida-modelos",
        titulo: "📌 Ciclo de Vida e Modelos de Desenvolvimento",

        blocos: [

          // 1 - modelos centrados no produto
          {
            tipo: "topico",
            titulo: "🔹 Modelos Centrados no Produto",
            lista: [
              "**Cascata** → sequencial e rígido; uma etapa só começa quando a anterior termina; pouca flexibilidade; usuário participa apenas no início",
              "**Espiral** → combina prototipagem, análise de riscos e feedback do cliente em ciclos; mais flexível; pode aumentar custos",
              "**Iterativo** → baseado em repetição e melhoria incremental; software evolui em várias versões; fácil adaptação; participação do usuário"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_modelo_cascata_iso9241.png",
            pasta: "imagens_design/aula_09",
            num: "1",
            alt: "Figura 1 — Modelo cascata: fluxo sequencial evidenciando que cada etapa depende da conclusão da anterior"
          },

          {
            tipo: "imagem",
            src: "figura_modelo_espiral_iso9241.png",
            pasta: "imagens_design/aula_09",
            num: "2",
            alt: "Figura 2 — Modelo espiral: ciclo de planejamento, análise de riscos, engenharia e avaliação do cliente"
          },

          {
            tipo: "imagem",
            src: "figura_modelo_iterativo_iso9241.png",
            pasta: "imagens_design/aula_09",
            num: "3",
            alt: "Figura 3 — Modelo iterativo: processo iterativo com repetição contínua entre planejamento, implementação, testes e implantação"
          },

          // 2 - modelos centrados no usuário
          {
            tipo: "topico",
            titulo: "🔹 Modelos Centrados no Usuário",
            lista: [
              "**Modelo Estrela** → avaliação constante como núcleo; qualquer etapa pode iniciar o projeto; alta flexibilidade; pouca adoção por empresas",
              "**Modelo de Shneiderman** → três pilares: especificação (layout, cores, ações), prototipagem e testes de usabilidade"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_modelo_estrela_iso9241.png",
            pasta: "imagens_design/aula_09",
            num: "4",
            alt: "Figura 4 — Modelo estrela: avaliação como elemento central do desenvolvimento centrado no usuário"
          },

          {
            tipo: "imagem",
            src: "figura_modelo_shneiderman_iso9241.png",
            pasta: "imagens_design/aula_09",
            num: "5",
            alt: "Figura 5 — Modelo de Shneiderman: pilares de especificação, prototipagem e testes de usabilidade"
          },

          // 3 - ágil e design thinking
          {
            tipo: "topico",
            titulo: "🔹 Desenvolvimento Ágil e Design Thinking",
            lista: [
              "**Manifesto Ágil (2001)** → pessoas e interações acima de processos; software funcionando acima de documentação; colaboração do cliente; respostas rápidas às mudanças",
              "**Design Thinking** → focado no ser humano; empatia, criatividade, colaboração e experimentação",
              "Princípios do DT: centrado no usuário, cocriativo, sequencial, evidente, holístico"
            ]
          }

        ]
      },

      {
        id: "iso9241",
        titulo: "📌 Norma ISO 9241",

        blocos: [

          // 4 - conceitos fundamentais
          {
            tipo: "topico",
            titulo: "🔹 Conceitos Fundamentais",
            lista: [
              "Norma voltada para ergonomia, usabilidade e interação humano-computador",
              "**Eficácia** → usuário consegue atingir o objetivo",
              "**Eficiência** → objetivo atingido com pouco esforço",
              "**Satisfação** → qualidade da experiência do usuário"
            ]
          },

          // 5 - parte 10 (7 princípios)
          {
            tipo: "topico",
            titulo: "🔹 Parte 10 — 7 Princípios de Diálogo",
            lista: [
              "1. **Adequação à tarefa** → facilitar execução, reduzir esforço, fornecer ajuda",
              "2. **Autodescrição** → interface explica-se sozinha; feedback imediato; evita manuais",
              "3. **Controle** → usuário controla ações, desfaz operações, controla velocidade",
              "4. **Conformidade com expectativas** → padrões conhecidos, consistência, linguagem familiar",
              "5. **Tolerância a erros** → prevenir, ajudar na correção, avisar consequências",
              "6. **Adequação à individualização** → permite personalização e adaptação ao usuário",
              "7. **Adequação ao aprendizado** → facilita aprendizado e ensina durante o uso"
            ]
          },

          // 6 - partes 11 a 17
          {
            tipo: "topico",
            titulo: "🔹 Partes 11 a 17 da ISO 9241",
            lista: [
              "**Parte 11** → especificação da usabilidade",
              "**Parte 12** → apresentação da informação",
              "**Parte 13** → condução do usuário",
              "**Parte 14** → diálogo por menu",
              "**Parte 15** → linguagem de comandos",
              "**Parte 16** → manipulação direta",
              "**Parte 17** → formulários"
            ]
          }

        ]
      }

    ]
  },

  // Aula 10 — Design de Interfaces e Prototipação
  {
    aula: "Aula 10 — Design de Interfaces e Prototipação",

    ideia_central: "O design de interfaces eficaz exige abordagem centrada no usuário, com atenção a usabilidade, ergonomia e comunicabilidade, materializando-se por meio de modelos conceituais, físicos e ferramentas como wireframes, mockups, NinjaMock e Figma.",

    secoes: [

      {
        id: "design-modelos",
        titulo: "📌 Design Centrado no Usuário e Modelos",

        blocos: [

          // 1 - design centrado no usuário
          {
            tipo: "topico",
            titulo: "🔹 Design Centrado no Usuário",
            lista: [
              "**Usabilidade** → sistema permite tarefas de forma eficiente",
              "**Ergonomia** → adequação às capacidades físicas e cognitivas humanas",
              "**Comunicabilidade** → clareza da comunicação entre sistema e usuário",
              "**Interação intuitiva** → usuário aprende utilizando o sistema naturalmente",
              "Designer deve: analisar comportamento, considerar contexto, definir requisitos, organizar sequência de elementos"
            ]
          },

          // 2 - modelos conceituais
          {
            tipo: "topico",
            titulo: "🔹 Modelos Conceituais",
            lista: [
              "Representam funções, relações e interações do sistema",
              "Utilizam associações mentais, metáforas visuais e conexões semânticas",
              "Ferramentas: diagramas UML, casos de uso, sequência, ER, Rich Picture",
              "**UML** → linguagem de modelagem baseada em orientação a objetos"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_rich_picture_modelo.png",
            pasta: "imagens_design/aula_10",
            num: "1",
            alt: "Figura 1 — Exemplo de modelo Rich Picture: demonstra relações conceituais entre entidades e conexões do sistema"
          },

          // 3 - tipos de interação
          {
            tipo: "topico",
            titulo: "🔹 Tipos de Interação",
            lista: [
              "**Instrução** → cliques, voz, teclado, botões",
              "**Conversação** → diálogo por texto, voz ou IA",
              "**Manipulação e navegação** → arrastar, mover, reorganizar objetos virtuais",
              "**Exploração e pesquisa** → sistema guia o usuário passo a passo"
            ]
          },

          // 4 - modelos físicos e problemas de usabilidade
          {
            tipo: "topico",
            titulo: "🔹 Modelos Físicos e Problemas de Usabilidade",
            lista: [
              "**Design operacional** → funcionamento, estrutura e armazenamento",
              "**Design representacional** → aparência visual e elementos gráficos",
              "**Design de interação** → organização funcional e fluxo de uso",
              "**Barreiras** → impedem realização da tarefa",
              "**Obstáculos** → tarefa realizada com dificuldade",
              "**Ruídos** → geram dúvidas ou confusão"
            ]
          }

        ]
      },

      {
        id: "prototipagem",
        titulo: "📌 Prototipagem",

        blocos: [

          // 5 - tipos de protótipo
          {
            tipo: "topico",
            titulo: "🔹 Tipos de Protótipos",
            lista: [
              "**Cenário** → descrição narrativa textual de interação usuário-sistema",
              "**Storyboard** → representação gráfica da narrativa; origem no cinema",
              "**Wireframe** → esqueleto visual; sem cores nem detalhes; foco na estrutura; base dos protótipos de alta fidelidade",
              "**Mockup** → protótipo visual próximo do produto final; alta fidelidade; dimensões precisas"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_storyboard_realidade_aumentada.png",
            pasta: "imagens_design/aula_10",
            num: "2",
            alt: "Figura 2 — Storyboard simulando realidade aumentada: ilustra representação gráfica de interações e sequência narrativa"
          },

          {
            tipo: "imagem",
            src: "figura_wireframe_mobile_first.png",
            pasta: "imagens_design/aula_10",
            num: "3",
            alt: "Figura 3 — Wireframe de interface mobile first: apresenta estrutura básica de uma interface sem elementos gráficos avançados"
          },

          // 6 - fidelidade e orientação
          {
            tipo: "topico",
            titulo: "🔹 Fidelidade e Orientação do Protótipo",
            lista: [
              "**Baixa fidelidade** → poucos detalhes; rascunhos em papel; estimula discussões abertas",
              "**Alta fidelidade** → aparência final; interações completas; testes mais precisos",
              "**Horizontal** → muitas funções, pouco detalhamento; visão geral do sistema",
              "**Vertical** → menos funções, grande aprofundamento; analisa detalhes específicos"
            ]
          },

          // 7 - ferramentas NinjaMock e Figma
          {
            tipo: "topico",
            titulo: "🔹 Ferramentas — NinjaMock e Figma",
            lista: [
              "**NinjaMock** → criação de wireframes mobile first com header, botões, menus, textos e rodapé",
              "**Figma** → criação de mockups de alta fidelidade; suporta ícones, imagens, componentes, scrolling e interações",
              "Atalhos Figma: `CTRL+SHIFT+K` inserir imagens; `CTRL+D` duplicar telas",
              "Interações Figma: Touch Down, Touch Up, Vertical Scrolling — permitem navegação simulada"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_wireframe_ninjamock.png",
            pasta: "imagens_design/aula_10",
            num: "4",
            alt: "Figura 4 — Wireframe tela inicial no NinjaMock: exemplo prático de wireframe desenvolvido na plataforma NinjaMock"
          },

          {
            tipo: "imagem",
            src: "figura_wireframe_completo.png",
            pasta: "imagens_design/aula_10",
            num: "5",
            alt: "Figura 5 — Wireframe completo no NinjaMock: demonstra conjunto completo de telas wireframe conectadas"
          },

          {
            tipo: "imagem",
            src: "figura_ambiente_figma.png",
            pasta: "imagens_design/aula_10",
            num: "6",
            alt: "Figura 6 — Ambiente de trabalho Figma: apresenta organização inicial do ambiente de design no Figma"
          },

          {
            tipo: "imagem",
            src: "figura_mockup_alta_fidelidade.png",
            pasta: "imagens_design/aula_10",
            num: "7",
            alt: "Figura 7 — Mockup de alta fidelidade: exemplo de protótipo visual próximo da interface final"
          },

          {
            tipo: "imagem",
            src: "figura_interacoes_figma.png",
            pasta: "imagens_design/aula_10",
            num: "8",
            alt: "Figura 8 — Interações entre as telas no Figma: demonstra conexões e fluxo de navegação entre telas"
          },

          {
            tipo: "imagem",
            src: "figura_preview_prototipo.png",
            pasta: "imagens_design/aula_10",
            num: "9",
            alt: "Figura 9 — Modo de visualização do protótipo no Figma: mostra pré-visualização funcional do protótipo criado"
          }

        ]
      }

    ]
  },

  // Aula 11 — Design Responsivo
  {
    aula: "Aula 11 — Design Responsivo",

    ideia_central: "Design Responsivo é a metodologia que permite interfaces web se adaptarem automaticamente a diferentes telas, implementada por Media Queries, Layout Fluido, Meta Tag Viewport, Breakpoints e Mobile First.",

    secoes: [

      {
        id: "responsivo-conceitos",
        titulo: "📌 Conceitos do Design Responsivo",

        blocos: [

          // 1 - conceito e características
          {
            tipo: "topico",
            titulo: "🔹 Design Responsivo",
            lista: [
              "Popularizado por **Ethan Marcotte**",
              "Capacidade de interface web se adaptar automaticamente a diferentes tamanhos de tela",
              "Responsividade ≠ apenas reduzir ou esticar o layout; exige reorganizar elementos, redesenhar partes e alterar comportamentos",
              "Crescimento do uso mobile tornou responsividade obrigatória no desenvolvimento moderno"
            ]
          },

          // 2 - media queries
          {
            tipo: "topico",
            titulo: "🔹 Media Queries",
            lista: [
              "Recurso do `CSS3` para aplicar estilos condicionais conforme o tamanho da tela",
              "Implementadas com a regra `@media`",
              "Permitem: alterar tamanhos, mudar alinhamentos, ocultar componentes, reorganizar grids, adaptar menus",
              "Exemplo: `@media only screen and (max-width: 600px) { body { background-color: lightblue; } }`"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_layout_fluido_sem_media_queries.png",
            pasta: "imagens_design/aula_11",
            num: "1",
            alt: "Figura 1 — Layout fluido sem media queries: mostra um layout que possui fluidez, porém sem reorganização adequada dos elementos. Os textos ficam sobrepostos, demonstrando que apenas flexibilidade não resolve problemas de responsividade"
          },

          {
            tipo: "imagem",
            src: "figura_resultado_media_queries.png",
            pasta: "imagens_design/aula_11",
            num: "2",
            alt: "Figura 2 — Resultado do uso do media queries: demonstra como os elementos passam a ocupar 100% da largura em telas pequenas, reorganizando o conteúdo verticalmente e melhorando a legibilidade"
          },

          // 3 - breakpoints
          {
            tipo: "topico",
            titulo: "🔹 Breakpoints",
            lista: [
              "Pontos específicos do tamanho da tela em que o layout muda de comportamento",
              "Exemplos: smartphone, tablet, notebook, desktop",
              "A ordem dos breakpoints importa: o último escrito sobrescreve os anteriores",
              "Atributos: `width` (largura da janela), `device-width` (largura física), `height` (altura da tela)"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_breakpoint_600px.png",
            pasta: "imagens_design/aula_11",
            num: "3",
            alt: "Figura 3 — Exemplo de breakpoint definido para a largura máxima de 600px: ilustra como o layout altera a quantidade de colunas quando a largura máxima da tela é atingida"
          },

          // 4 - meta viewport e layout fluido
          {
            tipo: "topico",
            titulo: "🔹 Meta Tag Viewport e Layout Fluido",
            lista: [
              "**Meta Viewport** → controla renderização em dispositivos móveis; sem ela o navegador reduz o site automaticamente",
              "Código: `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`",
              "**Layout Fluido** → usa medidas relativas (`%`, `em`, `rem`) em vez de absolutas (`px`, `cm`, `pt`)",
              "**Mobile First** → criado por **Luke Wroblewski**; desenvolve primeiro para telas pequenas; prioriza conteúdo essencial e melhora desempenho"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_comparativo_mobile_first.png",
            pasta: "imagens_design/aula_11",
            num: "4",
            alt: "Figura 4 — Comparativo do desktop first com o mobile first: compara o desenvolvimento tradicional desktop first com a metodologia mobile first, mostrando como o fluxo de adaptação muda"
          },

          {
            tipo: "imagem",
            src: "figura_site_mobile_first.png",
            pasta: "imagens_design/aula_11",
            num: "5",
            alt: "Figura 5 — Exemplo de site desenvolvido em mobile first: demonstra um layout inicialmente projetado para smartphones antes da adaptação para telas maiores"
          }

        ]
      },

      {
        id: "breakpoints-pratica",
        titulo: "📌 Breakpoints na Prática",

        blocos: [

          // 5 - adaptações práticas
          {
            tipo: "topico",
            titulo: "🔹 Adaptações por Breakpoint",
            lista: [
              "**Logo** → `min-width: 480px` troca logo mobile pelo desktop",
              "**Grid** → smartphone: 1 coluna; tablet: 2 colunas; desktop: 3 colunas",
              "**Botões** → `min-width: 960px` reposiciona à direita e reduz tamanho",
              "**Menu** → `min-width: 1280px` oculta botão hambúrguer (`display: none`) e exibe menu horizontal (`display: block !important`)"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_alteracao_logo.png",
            pasta: "imagens_design/aula_11",
            num: "6",
            alt: "Figura 6 — Comparativo após a media screen para a alteração de logo: mostra a substituição do logo simplificado mobile por um logo completo para desktop"
          },

          {
            tipo: "imagem",
            src: "figura_variacao_grid.png",
            pasta: "imagens_design/aula_11",
            num: "7",
            alt: "Figura 7 — Comparativo após a media screen de variação de grid: ilustra a reorganização das colunas conforme o aumento da largura da tela"
          },

          {
            tipo: "imagem",
            src: "figura_botoes_responsivos.png",
            pasta: "imagens_design/aula_11",
            num: "8",
            alt: "Figura 8 — Comparativo após a alteração de escala e alinhamentos dos botões: mostra como os botões são redimensionados e reposicionados em telas maiores"
          },

          {
            tipo: "imagem",
            src: "figura_interface_desktop.png",
            pasta: "imagens_design/aula_11",
            num: "9",
            alt: "Figura 9 — Interface gráfica desktop: apresenta o resultado final do layout responsivo adaptado para telas desktop"
          }

        ]
      }

    ]
  },

  // Aula 12 — CSS e HTML Comandos Básicos
  {
    aula: "Aula 12 — CSS e HTML Comandos Básicos",

    ideia_central: "HTML estrutura o conteúdo de páginas web por meio de tags semânticas, enquanto o CSS estiliza essa estrutura com seletores e propriedades, permitindo separação entre forma e aparência.",

    secoes: [

      {
        id: "html-estrutura",
        titulo: "📌 HTML — Estrutura e Tags",

        blocos: [

          // 1 - conceito e estrutura
          {
            tipo: "topico",
            titulo: "🔹 HTML — Conceito e Estrutura Básica",
            lista: [
              "**Linguagem de marcação** → não é linguagem de programação; apenas organiza conteúdo",
              "`<!DOCTYPE html>` → declara tipo do documento; não é uma tag",
              "`<html lang=\"pt-BR\">` → elemento raiz; define idioma",
              "`<head>` → metadados, título, links externos; não visível ao usuário",
              "`<body>` → área visível: textos, imagens, vídeos, tabelas, menus"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_html_estrutura_basica_html5.png",
            pasta: "imagens_design/aula_12",
            num: "1",
            alt: "Figura 1 — Estrutura básica de uma página HTML5 gerada pelo VSCode"
          },

          // 2 - tags principais
          {
            tipo: "topico",
            titulo: "🔹 Tags Principais",
            lista: [
              "`<h1>` a `<h6>` → títulos em hierarquia (`<h1>` = maior importância)",
              "`<p>` → parágrafo de texto",
              "`<ul>` + `<li>` → lista não ordenada (marcadores) | `<ol>` + `<li>` → lista ordenada (numeração)",
              "`<img src=\"\">` → inserção de imagens pelo atributo `src`",
              "`<table>` → tabela | `<thead>` cabeçalho | `<tbody>` corpo | `<tr>` linha | `<th>` título coluna | `<td>` célula"
            ]
          },

          // 3 - web semântica
          {
            tipo: "topico",
            titulo: "🔹 Web Semântica",
            lista: [
              "Dá significado aos conteúdos; facilita buscadores (SEO) e acessibilidade",
              "Autores: **Tim Berners-Lee**, James Hendler, Ora Lassila",
              "`<section>` → seção temática | `<nav>` → menu de navegação | `<footer>` → rodapé | `<div>` → container genérico"
            ]
          }

        ]
      },

      {
        id: "css-conceitos",
        titulo: "📌 CSS — Conceitos e Propriedades",

        blocos: [

          // 4 - css conceito e sintaxe
          {
            tipo: "topico",
            titulo: "🔹 CSS — Conceito, Vinculação e Sintaxe",
            lista: [
              "**CSS** → Cascading Style Sheets; estiliza páginas HTML; separa estrutura de aparência",
              "Vinculação no `<head>`: `<link rel=\"stylesheet\" href=\"assets/css/style.css\">`",
              "Sintaxe: `seletor { propriedade: valor; }`",
              "**Classes** → reutilizáveis; seletor CSS usa `.`; aplicação no HTML usa `class=\"nome\"`"
            ]
          },

          // 5 - propriedades CSS
          {
            tipo: "topico",
            titulo: "🔹 Propriedades CSS Importantes",
            lista: [
              "`font-family` → define fonte | `text-transform` → uppercase / lowercase / capitalize",
              "`padding` → espaçamento interno | `margin` → espaçamento externo",
              "`border` → borda | `border-radius` → arredonda bordas",
              "`width` → largura | `background-color` → cor de fundo",
              "`float` → posicionamento flutuante | `display: flex` → layout flexível para menus e layouts modernos"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_layout_html_css_menu_colunas.png",
            pasta: "imagens_design/aula_12",
            num: "2",
            alt: "Figura 2 — Layout exemplo com menu horizontal, colunas, lista, imagem e tabela estilizada"
          }

        ]
      }

    ]
  },

  // Aula 13 — Landing Page com HTML
  {
    aula: "Aula 13 — Landing Page com HTML",

    ideia_central: "Uma landing page é construída com HTML5 semântico, CSS, tipografia, cores e formulários — combinando estrutura, estilo e elementos visuais para criar páginas focadas em conversão.",

    secoes: [

      {
        id: "landing-estrutura",
        titulo: "📌 Landing Page e Estrutura do Projeto",

        blocos: [

          // 1 - landing page e organização
          {
            tipo: "topico",
            titulo: "🔹 Landing Page e Organização de Projeto",
            lista: [
              "**Landing page** → página única para marketing, captação de leads e promoção; comunicação direta e visual",
              "Organização de pastas: `index.html` + `assets/css/style.css` + `assets/img/`",
              "Benefícios da organização: manutenção, reutilização e escalabilidade"
            ]
          },

          // 2 - elementos visuais
          {
            tipo: "topico",
            titulo: "🔹 Elementos Visuais",
            lista: [
              "**Imagens SVG** → leves, escaláveis e ideais para web; fonte: Undraw",
              "**Cores** → envolvem psicologia, temperatura, contraste e identidade visual; ferramenta: Adobe Color",
              "Cores em HTML: sistema `RGB` com representação hexadecimal `#RRGGBB`",
              "**Backgrounds SVG** → personalizados via SvgBackgrounds; contribuem para estética e profundidade visual",
              "**Tipografia** → escolha impacta leitura e UX; fontes importadas via Google Fonts"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_esquema_cores.png",
            pasta: "imagens_design/aula_13",
            num: "1",
            alt: "Figura 1 — Esquema de cores do projeto extraído automaticamente de uma imagem usando Adobe Color"
          },

          {
            tipo: "imagem",
            src: "figura_background_svg.png",
            pasta: "imagens_design/aula_13",
            num: "2",
            alt: "Figura 2 — Background SVG utilizado como fundo visual da landing page"
          }

        ]
      },

      {
        id: "html5-semantica-formularios",
        titulo: "📌 HTML5, Semântica e Formulários",

        blocos: [

          // 3 - HTML5 e web semântica
          {
            tipo: "topico",
            titulo: "🔹 HTML5 e Web Semântica",
            lista: [
              "`<section>` → seção temática | `<nav>` → menu | `<article>` → conteúdo independente",
              "`<aside>` → conteúdo secundário | `<footer>` → rodapé | `<div>` → agrupamento genérico",
              "Web Semântica: interpretação por humanos e buscadores; melhora acessibilidade e SEO"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_estrutura_html5.png",
            pasta: "imagens_design/aula_13",
            num: "3",
            alt: "Figura 3 — Estrutura inicial obrigatória de um documento HTML5"
          },

          {
            tipo: "imagem",
            src: "figura_web_semantica_site.png",
            pasta: "imagens_design/aula_13",
            num: "4",
            alt: "Figura 4 — Print de tela demonstrando separação semântica de conteúdos usando tags HTML"
          },

          // 4 - tabelas e formulários
          {
            tipo: "topico",
            titulo: "🔹 Tabelas e Formulários HTML",
            lista: [
              "Tabela: `<table>` → `<thead>` → `<tbody>` → `<tr>` → `<th>` (cabeçalho) → `<td>` (dado)",
              "Formulário: tag `<form>` com `<input>` de vários tipos",
              "`text` / `email` / `password` → entradas de texto | `date` / `file` → data e arquivo",
              "`radio` → **uma única opção** | `checkbox` → **múltiplas opções**",
              "`range` → controle deslizante | `submit` → enviar | `reset` → limpar",
              "**Meta viewport:** `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`"
            ]
          }

        ]
      }

    ]
  },

  // Aula 14 — Formatando com CSS
  {
    aula: "Aula 14 — Formatando com CSS",

    ideia_central: "CSS define a aparência visual das páginas HTML, permitindo estilizar cores, fontes, layouts, espaçamentos e responsividade de forma separada da estrutura.",

    secoes: [

      {
        id: "css-seletores-variaveis",
        titulo: "📌 CSS — Seletores, Variáveis e Tipografia",

        blocos: [

          // 1 - vinculação e fontes
          {
            tipo: "topico",
            titulo: "🔹 Vinculação e Tipografia",
            lista: [
              "Vinculação: `<link rel=\"stylesheet\" href=\"assets/css/style.css\">`",
              "Teste de vínculo: `body { background-color: red; }`",
              "**Google Fonts** → importa fontes externas; Lato (títulos) e Nunito (textos)",
              "`font-family: 'Nunito', sans-serif` → corpo | `font-family: 'Lato', sans-serif` → títulos",
              "`text-transform: uppercase` → transforma texto em maiúsculo"
            ]
          },

          // 2 - classes, IDs e variáveis
          {
            tipo: "topico",
            titulo: "🔹 Classes, IDs e Variáveis CSS",
            lista: [
              "**Classes** → reutilizáveis; CSS usa `.nome`; HTML usa `class=\"nome\"`",
              "**IDs** → únicos; CSS usa `#nome`; HTML usa `id=\"nome\"`; ideais para navegação interna com `href=\"#id\"`",
              "**Variáveis CSS** → definidas em `:root { --nome: valor; }`; usadas com `var(--nome)`",
              "Vantagens das variáveis: reutilização, padronização, manutenção rápida e consistência visual"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_css_ids_sections.png",
            pasta: "imagens_design/aula_14",
            num: "1",
            alt: "Figura 1 — Adicionando os identificadores de ID às seções HTML para navegação interna"
          },

          {
            tipo: "imagem",
            src: "figura_css_linkagem_ids.png",
            pasta: "imagens_design/aula_14",
            num: "2",
            alt: "Figura 2 — Linkando conteúdos com href='#id' para conectar itens do menu às seções"
          }

        ]
      },

      {
        id: "css-layout",
        titulo: "📌 Layout, Flexbox e Grid",

        blocos: [

          // 3 - backgrounds e layout
          {
            tipo: "topico",
            titulo: "🔹 Backgrounds e Layout",
            lista: [
              "`background-image: url(...)` → define imagem de fundo",
              "`background-size: cover` → imagem ocupa toda a área",
              "`background-position: center center` → centraliza a imagem",
              "`max-width: 1200px; margin: 0 auto` → limita largura e centraliza conteúdo horizontalmente"
            ]
          },

          // 4 - flexbox e menu
          {
            tipo: "topico",
            titulo: "🔹 Flexbox e Menu",
            lista: [
              "`display: flex` → layout flexível",
              "`justify-content: space-between` → um elemento no início, outro no fim",
              "`position: fixed; top: 0` → menu permanece fixo durante scroll",
              "`list-style: none` → remove marcadores | `text-decoration: none` → remove sublinhado dos links"
            ]
          },

          // 5 - CSS grid
          {
            tipo: "topico",
            titulo: "🔹 CSS Grid",
            lista: [
              "`display: grid` → ativa grid layout",
              "`grid-template-columns: 1fr 1fr` → 2 colunas iguais",
              "`grid-template-columns: 1fr 1fr 1fr` → 3 colunas proporcionais",
              "`1fr` → uma fração do espaço disponível",
              "Responsividade de imagens: `max-width: 100%; height: auto`"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_css_grid_classes.png",
            pasta: "imagens_design/aula_14",
            num: "3",
            alt: "Figura 3 — Vinculando as classes aos seus elementos para funcionamento correto de grids com múltiplas colunas"
          },

          {
            tipo: "imagem",
            src: "figura_css_resultado_final.png",
            pasta: "imagens_design/aula_14",
            num: "4",
            alt: "Figura 4 — Landing page totalmente estilizada com menu, grids, imagens, tabela e rodapé"
          }

        ]
      }

    ]
  },

  // Aula 15 — Revisão Projeto de Design para Web
  {
    aula: "Aula 15 — Revisão Projeto de Design para Web",

    ideia_central: "Um bom projeto web deve ser responsivo, centrado no usuário, organizado semanticamente, acessível, visualmente consistente, ergonomicamente adequado e otimizado para diferentes dispositivos.",

    secoes: [

      {
        id: "mobile-first-design",
        titulo: "📌 Mobile First, Design e Elementos Visuais",

        blocos: [

          // 1 - mobile first
          {
            tipo: "topico",
            titulo: "🔹 Mobile First",
            lista: [
              "Desenvolve primeiro para dispositivos móveis; adapta progressivamente para telas maiores via breakpoints",
              "Breakpoints usados: `768px` tablet | `960px` desktop | `1280px` widescreen",
              "Vantagens: melhor experiência mobile, código mais limpo, maior compatibilidade"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_wireframe_mobile_first.png",
            pasta: "imagens_design/aula_15",
            num: "1",
            alt: "Wireframe inicial da interface mobile first representando a organização visual do layout antes da implementação"
          },

          // 2 - design centrado no usuário e ergonomia
          {
            tipo: "topico",
            titulo: "🔹 Design Centrado no Usuário e Ergonomia",
            lista: [
              "Foco em: ergonomia, usabilidade, acessibilidade, comunicabilidade e conforto cognitivo",
              "**Compatibilidade** → coerente com expectativas | **Condução** → orienta navegação",
              "**Carga de trabalho** → reduz esforço mental | **Homogeneidade** → padrões consistentes",
              "**Controle explícito** → usuário controla ações | **Adaptabilidade** → interface flexível"
            ]
          },

          // 3 - engenharia semiótica e psicologia cognitiva
          {
            tipo: "topico",
            titulo: "🔹 Engenharia Semiótica e Psicologia Cognitiva",
            lista: [
              "**Engenharia semiótica** → analisa comunicação entre designer, sistema e usuário; interface transmite signos visuais, símbolos e feedbacks",
              "**Atenção seletiva** → direcionar foco | **Memória de curto prazo** → facilitar retenção momentânea",
              "**Categorização** → organização mental | **Interpretação** → compreensão visual"
            ]
          },

          // 4 - elementos compositivos
          {
            tipo: "topico",
            titulo: "🔹 Tipografia, Cores e Ícones",
            lista: [
              "Fontes: **Lato Black 900** (títulos) e **Nunito Regular 400** (textos)",
              "Cores: valor emocional, psicológico e semiótico; considerar contraste, harmonia e temperatura",
              "**FontAwesome** → biblioteca de ícones para melhorar comunicação visual"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_esquema_cores.png",
            pasta: "imagens_design/aula_15",
            num: "2",
            alt: "Paleta de cores utilizada no projeto demonstrando a definição da identidade visual"
          }

        ]
      },

      {
        id: "html-css-jquery",
        titulo: "📌 HTML5, CSS3, jQuery e Hospedagem",

        blocos: [

          // 5 - HTML e CSS
          {
            tipo: "topico",
            titulo: "🔹 HTML5 e CSS3",
            lista: [
              "Tags HTML5: `<header>` | `<nav>` | `<main>` | `<article>` | `<section>` | `<footer>`",
              "CSS3 define: layout, cores, responsividade, hover, grids e animações visuais",
              "`background: url(...) no-repeat fixed` → fundo fixo",
              "`.btn-menu { border-radius: 36px; }` → botão hambúrguer circular",
              "`.menu { display: none; }` → menu oculto até ação do usuário"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_interface_mobile.png",
            pasta: "imagens_design/aula_15",
            num: "3",
            alt: "Resultado final da versão mobile do site após aplicação do HTML e CSS"
          },

          // 6 - jQuery e menu hambúrguer
          {
            tipo: "topico",
            titulo: "🔹 Menu Hambúrguer e jQuery",
            lista: [
              "**jQuery** → biblioteca JS para simplificar scripts e criar interatividade",
              "Abrir menu: `$(\".btn-menu\").click(function() { $(\".menu\").show(); });`",
              "Fechar menu: `$(\".btn-close\").click(function() { $(\".menu\").hide(); });`",
              "Em widescreen (`1280px`): oculta hambúrguer e exibe menu horizontal"
            ]
          },

          // 7 - hospedagem e testes
          {
            tipo: "topico",
            titulo: "🔹 Hospedagem e Testes com Lighthouse",
            lista: [
              "**Netlify Drop** → hospedagem gratuita; upload da pasta → deploy → URL gerada",
              "**Lighthouse** (Chrome DevTools) → avalia: Performance, Accessibility, Best Practices, SEO, PWA",
              "Problemas comuns: ausência de `alt` em imagens, links quebrados, falta de meta description",
              "Ferramentas do projeto: VSCode, Chrome, Window Resizer, FontAwesome, Google Fonts, Netlify"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_responsividade_mobile_desktop.png",
            pasta: "imagens_design/aula_15",
            num: "4",
            alt: "Comparação do layout mobile com o desktop evidenciando as adaptações responsivas"
          }

        ]
      }

    ]
  },
  ]
};