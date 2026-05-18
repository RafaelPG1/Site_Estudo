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
              texto: "O material aborda os principais **modelos de ciclo de vida de software**, diferenciando abordagens **centradas no produto** e **centradas no usuário**. Também apresenta conceitos de **Design Thinking**, desenvolvimento ágil e os princípios da **Norma ISO 9241**, focada em usabilidade e ergonomia de interfaces."
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
              texto: "O material aborda os principais conceitos relacionados ao **design de interfaces**, **design centrado no usuário** e **prototipação de sistemas**."
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
          id: "metodo_prototipacao",
          titulo: "📋 Método de Prototipação — Etapas",
          blocos: [
            {
              tipo: "lista",
              titulo: "Etapas gerais do método de prototipação:",
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
              texto: "O módulo aborda os principais fundamentos do **Design Responsivo**, metodologia essencial no desenvolvimento moderno de interfaces web. O objetivo principal é permitir que sites e sistemas funcionem corretamente em diferentes tamanhos de tela — principalmente em dispositivos móveis."
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
          id: "resumo",
          titulo: "🧾 Resumo Final para Revisão Rápida",
          blocos: [
            {
              tipo: "tabela",
              titulo: "Conceitos fundamentais",
              colunas: ["Conceito", "Definição"],
              linhas: [
                ["Design Responsivo", "Capacidade do layout adaptar-se a diferentes telas"],
                ["Media Queries", "CSS condicional para responsividade"],
                ["Layout Fluido", "Uso de medidas relativas"],
                ["Mobile First", "Desenvolvimento iniciado pelo mobile"],
                ["Breakpoints", "Pontos de mudança do layout"],
                ["Meta Viewport", "Controla renderização em dispositivos móveis"]
              ]
            },
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
              lista: ["px", "cm", "mm"]
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
          titulo: "Exemplo 2 — CSS no Body",
          texto: "body {\n  background: red;\n}",
          detalhe: "👉 Aplica fundo vermelho em toda a página"
        },

        {
          tipo: "exemplo",
          titulo: "Exemplo 3 — Imagem com Bordas Arredondadas",
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
          texto: "O projeto deve ser organizado antes do desenvolvimento, separando estrutura, estilo e imagens:",
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
          texto: "O material apresenta o uso de backgrounds SVG personalizados usando o site **SvgBackgrounds**. O background contribui para estética, identidade visual, profundidade e modernização da interface."
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

    

  ]
};