/* =============================================
   NEXUS STUDY — res_design.js
   Disciplina: Design de Sistemas
   ============================================= */

window.__nexusConteudo = {
  aulas: [
    // Aula 9 — Prototipagem e Norma ISO 9241
    {
      aula: "Aula 9 — Prototipagem e Norma ISO 9241",
      ideia_central: "Evolução do foco no desenvolvimento → de produto para usuário, priorizando experiência, usabilidade e satisfação.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Ciclos de vida de software**, divididos em: **Centrados no produto** (tradicionais) e **Centrados no usuário** (modernos)",
                "**Modelos de desenvolvimento** (cascata, espiral, iterativo, estrela, Shneiderman)",
                "**Design Thinking** como abordagem inovadora",
                "**Norma ISO 9241**, voltada à **usabilidade e ergonomia de interfaces**"
              ]
            }
          ]
        },

        {
          id: "conceitos",
          titulo: "🧠 Conceitos Principais",
          blocos: [

            {
              tipo: "topico",
              titulo: "🔹 Ciclo de vida de software",
              texto: "É o **modelo que define as etapas de desenvolvimento** de um sistema, desde planejamento até uso."
            },

            {
              tipo: "topico",
              titulo: "🔹 Engenharia de Software",
              lista: [
                "Conjunto de: **Técnicas**, **Ferramentas** e **Procedimentos**",
                "Objetivo: construir software com **qualidade, custo e prazo controlados**"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Modelos centrados no produto"
            },

            {
              tipo: "topico",
              titulo: "📌 Modelo Cascata",
              lista: [
                "Fluxo **sequencial**",
                "Etapas: 1. Requisitos → 2. Projeto → 3. Implementação → 4. Testes → 5. Manutenção",
                "✔ Vantagem: Organização e controle",
                "❌ Desvantagens: Pouca flexibilidade · Usuário pouco envolvido · Erros detectados tarde"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Modelo Espiral",
              lista: [
                "Desenvolvimento em ciclos (loops)",
                "Envolve: Planejamento · Análise de riscos · Engenharia · Avaliação do cliente",
                "✔ Destaque: Uso de **protótipos** · Redução de riscos"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Modelo Iterativo",
              lista: [
                "Baseado em **repetições (iterações)**",
                "✔ Características: Correção contínua de erros · Adaptação a mudanças · Participação do usuário"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Modelos centrados no usuário"
            },

            {
              tipo: "topico",
              titulo: "📌 Conceito principal",
              lista: [
                "Foco em: **Usabilidade** · **Experiência do usuário** · **Aspectos cognitivos e emocionais**"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Modelo Estrela",
              lista: [
                "Avaliação é o centro",
                "Pode começar em qualquer etapa",
                "✔ Destaque: Forte interação com usuário"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Modelo de Shneiderman",
              lista: [
                "Baseado em 3 pilares: **1. Especificação** · **2. Prototipagem** · **3. Testes de usabilidade**",
                "✔ Analisa: Interface · Funcionalidade · Facilidade de uso"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Manifesto Ágil",
              lista: [
                "Pessoas > processos",
                "Software funcional > documentação",
                "Colaboração do cliente",
                "Adaptação a mudanças"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Design Thinking",
              lista: [
                "Abordagem **centrada no ser humano**, baseada em: Empatia · Criatividade · Experimentação",
                "Características: Interdisciplinar · Foco nas necessidades reais do usuário",
                "Integra: Negócio · Tecnologia · Experiência humana",
                "Princípios: 1. Centrado no usuário · 2. Cocriativo · 3. Sequencial · 4. Evidente · 5. Holístico"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Norma ISO 9241",
              lista: [
                "Norma internacional de **usabilidade e ergonomia** em sistemas interativos",
                "**Usuário** → quem interage com o sistema",
                "**Contexto de uso** → ambiente, tarefas, ferramentas",
                "**Eficácia** → atingir objetivos",
                "**Eficiência** → com menor esforço",
                "**Satisfação** → experiência do usuário"
              ]
            }
          ]
        },

        {
          id: "metodos",
          titulo: "📊 Métodos e Princípios",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Métricas de Usabilidade (ISO 9241)",
              lista: [
                "**Eficácia** → resultado alcançado",
                "**Eficiência** → esforço utilizado",
                "**Satisfação** → percepção do usuário"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Princípios de Diálogo (ISO 9241 — Parte 10)",
              lista: [
                "1. **Adequação à tarefa** → sistema ajuda na tarefa",
                "2. **Autodescrição** → interface clara e compreensível",
                "3. **Controle** → usuário controla ações",
                "4. **Conformidade** → consistente com expectativas",
                "5. **Tolerância a erros** → previne e trata erros",
                "6. **Individualização** → adaptação ao usuário",
                "7. **Aprendizado** → fácil de aprender"
              ]
            }
          ]
        },

        {
          id: "exemplos",
          titulo: "💡 Exemplos Explicativos",
          blocos: [
            {
              tipo: "exemplo",
              titulo: "Exemplo 1 — Tolerância a erros",
              texto: "Sistema impede erro de digitação ou corrige automaticamente.",
              detalhe: "👉 Ex: alerta de senha inválida"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Controle do usuário",
              texto: "Possibilidade de desfazer ações.",
              detalhe: "👉 Ex: botão 'Desfazer' (Ctrl+Z)"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Individualização",
              texto: "Personalização da interface.",
              detalhe: "👉 Ex: alterar idioma ou tema"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Design Thinking",
              texto: "Desenvolver app baseado em entrevistas com usuários.",
              detalhe: "👉 Solução baseada em necessidade real, não suposição"
            }
          ]
        },

        {
          id: "resumo",
          titulo: "🧾 Resumo Final para Revisão Rápida",
          blocos: [
            {
              tipo: "lista",
              itens: [
                "**Ciclo de vida** define como o software é desenvolvido",
                "Modelos tradicionais: Cascata (linear) · Espiral (com protótipos) · Iterativo (repetições)",
                "Evolução → foco no **usuário**: Modelo estrela · Shneiderman · Design Thinking",
                "**Design Thinking**: Empatia + criatividade + colaboração",
                "**ISO 9241**: Norma de usabilidade — baseada em eficácia · eficiência · satisfação",
                "**7 princípios**: tarefa · autodescrição · controle · consistência · erros · personalização · aprendizado"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: Hoje o desenvolvimento não é mais sobre o sistema — é sobre o usuário."
            }
          ]
        }

      ]
    },

    //Aula 10 — Design de Interfaces e Prototipação
    {
      aula: "Aula 10 — Design de Interfaces e Prototipação",
      ideia_central: "Primeiro modela → depois prototipa → depois implementa. Quanto melhor o protótipo, menos erros no sistema final.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Design Centrado no Usuário (DCU)** como abordagem principal",
                "**Modelos conceituais e físicos** de sistemas",
                "**Problemas de usabilidade**: barreiras, obstáculos e ruídos",
                "**Prototipação**: conceitos, classificações e tipos",
                "**Construção prática**: wireframe e mockup"
              ]
            }
          ]
        },

        {
          id: "conceitos",
          titulo: "🧠 Conceitos Principais",
          blocos: [

            {
              tipo: "topico",
              titulo: "🔹 Design Centrado no Usuário (DCU)",
              lista: [
                "Abordagem que coloca o **usuário como foco principal** do sistema",
                "**Usabilidade** → facilidade de uso",
                "**Ergonomia** → conforto na interação",
                "**Comunicabilidade** → clareza das informações",
                "**Intuitividade** → uso sem necessidade de manual"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Papel do Designer",
              lista: [
                "Analisar comportamento e contexto do usuário",
                "Definir requisitos funcionais e não funcionais",
                "Considerar limitações técnicas e financeiras",
                "Planejar a interação e estrutura do sistema"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Modelos Conceituais",
              lista: [
                "Representam **como o sistema funciona na teoria**",
                "Conjunto de ideias e associações que ajudam a entender o sistema",
                "Representam funções e conexões · Usam **metáforas do mundo real**",
                "✔ Ferramentas: Diagramas (classe, caso de uso, sequência) · UML"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Tipos de Interação (Modelos Conceituais)",
              lista: [
                "**Instrução** → comandos (clique, teclado, voz)",
                "**Conversação** → interação com IA (chat, voz)",
                "**Manipulação/Navegação** → interação direta com elementos",
                "**Exploração/Pesquisa** → sistema guia o usuário"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Modelos Físicos",
              lista: [
                "Transformam o modelo conceitual em algo concreto",
                "**Operacional** → funcionamento do sistema",
                "**Representacional** → aparência visual",
                "**Interação** → fluxo de uso"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Problemas de Usabilidade"
            },

            {
              tipo: "topico",
              titulo: "⚠ Tipos de Problemas",
              lista: [
                "**Barreiras** → impedem a conclusão da tarefa",
                "**Obstáculos** → dificultam, mas permitem concluir",
                "**Ruídos** → causam dúvida ou confusão"
              ]
            },

            {
              tipo: "topico",
              titulo: "⚠ Classificação dos Problemas",
              lista: [
                "**Principais** → afetam todo o sistema",
                "**Secundários** → afetam partes específicas",
                "Por tipo de usuário: Geral · Especialista · Iniciante · Acessibilidade"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Prototipação"
            },

            {
              tipo: "topico",
              titulo: "🔹 O que é Prototipação",
              lista: [
                "**Representação do sistema antes da implementação**",
                "Objetivos: Testar ideias · Identificar problemas · Economizar tempo e custo · Melhorar UX"
              ]
            },

            {
              tipo: "tabela",
              titulo: "🔹 Classificação por Fidelidade",
              colunas: ["Tipo", "Característica", "Foco"],
              linhas: [
                ["Baixa fidelidade", "Simples, rascunho",          "Gera mais ideias"],
                ["Alta fidelidade",  "Detalhado, próximo do final", "Foca em detalhes"]
              ]
            },

            {
              tipo: "tabela",
              titulo: "🔹 Classificação por Estrutura",
              colunas: ["Tipo", "Descrição"],
              linhas: [
                ["Horizontal", "Muitas funções, pouco detalhamento"],
                ["Vertical",   "Menos funções, muito detalhamento"]
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Cenários",
              lista: [
                "Narrativas de uso do sistema",
                "Descrevem o **passo a passo da interação** usuário-sistema"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Storyboard",
              lista: [
                "Representação **visual** dos cenários",
                "Mostra a sequência de telas e interações"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Wireframe",
              lista: [
                "Estrutura básica da interface (botões, menus, layout)",
                "Sem cores ou imagens → foco em **organização**",
                "✔ Funciona como o 'esqueleto' do sistema"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Mockup",
              lista: [
                "Interface visual **detalhada e próxima do produto final**",
                "Inclui: Cores · Imagens · Tipografia",
                "✔ Alta fidelidade → simula o produto final"
              ]
            }

          ]
        },

        {
          id: "metodos",
          titulo: "📊 Métodos e Processos",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Fluxo de desenvolvimento centrado no usuário",
              lista: [
                "1. Analisar usuário e contexto",
                "2. Definir requisitos",
                "3. Criar modelo conceitual",
                "4. Criar modelo físico",
                "5. Prototipar (baixa → alta fidelidade)",
                "6. Testar e identificar problemas de usabilidade",
                "7. Implementar"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Escolha do tipo de protótipo",
              lista: [
                "**Cenário** → descrever fluxo em texto",
                "**Storyboard** → visualizar sequência de telas",
                "**Wireframe** → definir estrutura e layout",
                "**Mockup** → validar design visual final"
              ]
            }
          ]
        },

        {
          id: "exemplos",
          titulo: "💡 Exemplos Explicativos",
          blocos: [
            {
              tipo: "exemplo",
              titulo: "Exemplo 1 — Cenário (caixa eletrônico)",
              texto: "Usuário insere cartão → digita senha → escolhe saque → recebe dinheiro. Mostra o fluxo completo e o feedback do sistema.",
              detalhe: "👉 Narrativa que guia o design da interface"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Wireframe",
              texto: "Esboço com botões, menus e layout, sem cores ou imagens.",
              detalhe: "👉 Define a estrutura antes de pensar no visual"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Mockup",
              texto: "Interface completa com cores, imagens e tipografia definidas.",
              detalhe: "👉 Simula o produto final para validação"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Problema: Barreira",
              texto: "Botão de confirmação invisível impede o usuário de concluir o cadastro.",
              detalhe: "👉 Barreira → tarefa impossível de realizar"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 5 — Problema: Ruído",
              texto: "Mensagem de erro genérica que não explica o que deu errado.",
              detalhe: "👉 Ruído → causa confusão, mas não impede a tarefa"
            }
          ]
        },

        {
          id: "resumo",
          titulo: "🧾 Resumo Final para Revisão Rápida",
          blocos: [
            {
              tipo: "lista",
              itens: [
                "**DCU** → usuário no centro: usabilidade · ergonomia · comunicabilidade · intuitividade",
                "**Modelo conceitual** → ideia teórica do sistema (UML, diagramas)",
                "**Modelo físico** → implementação visual e funcional (operacional · representacional · interação)",
                "**Problemas de usabilidade** → Barreiras (impedem) · Obstáculos (dificultam) · Ruídos (confundem)",
                "**Prototipação** → testar antes de desenvolver",
                "Tipos: **Cenário** (texto) · **Storyboard** (visual narrativo) · **Wireframe** (estrutura) · **Mockup** (visual final)",
                "Fidelidade: **Baixa** (ideias) · **Alta** (detalhes)",
                "Estrutura: **Horizontal** (abrangente) · **Vertical** (profundo)"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: Primeiro modela → depois prototipa → depois implementa. Quanto melhor o protótipo, menos erros no sistema final e melhor a experiência do usuário."
            }
          ]
        }

      ]
    },
    // Aula 11 — Design Responsivo
    {
aula: "Aula 11 — Design Responsivo",
ideia_central: "Não basta reduzir o tamanho do site — é necessário reorganizar, adaptar e otimizar a interface para cada tipo de dispositivo.",
secoes: [
  {
    id: "visao",
    titulo: "🧭 Visão Geral",
    blocos: [
      {
        tipo: "texto",
        texto: "O design responsivo é uma abordagem essencial no desenvolvimento web moderno que permite que sites se adaptem a diferentes tamanhos de tela (celulares, tablets e desktops). Com o aumento do uso de dispositivos móveis, tornou-se indispensável criar interfaces que se ajustem automaticamente, mantenham boa usabilidade e preservem o design visual."
      },
      {
        tipo: "lista",
        titulo: "A aula aborda:",
        itens: [
          "Conceitos fundamentais do design responsivo",
          "Técnicas como media queries, layout fluido, viewport",
          "Metodologia Mobile First",
          "Uso de breakpoints"
        ]
      }
    ]
  },

  {
    id: "conceitos",
    titulo: "🧠 Conceitos Principais",
    blocos: [

      {
        tipo: "topico",
        titulo: "📱 Design Responsivo",
        lista: [
          "Capacidade de um site se adaptar a diferentes telas",
          "Não é apenas redimensionar → envolve **reorganizar elementos**",
          "Objetivo: melhorar experiência do usuário (UX)"
        ]
      },

      {
        tipo: "topico",
        titulo: "🎯 Media Queries",
        lista: [
          "Técnica do **CSS3**",
          "Permite aplicar estilos diferentes conforme o tamanho da tela",
          "Alterar tamanho, posição e visibilidade",
          "Criar comportamentos diferentes conforme a resolução"
        ]
      },

      {
        tipo: "exemplo",
        titulo: "Exemplo — Media Query",
        texto: "@media (max-width: 600px) {\n  body {\n    background-color: lightblue;\n  }\n}",
        detalhe: "👉 Aplica estilo somente quando a tela tiver no máximo 600px de largura"
      },

      {
        tipo: "topico",
        titulo: "📏 Meta Tag Viewport",
        lista: [
          "Define como a página será exibida em dispositivos móveis",
          "Evita que o navegador 'encolha' o site",
          "Controla o zoom e escala"
        ]
      },

      {
        tipo: "exemplo",
        titulo: "Código padrão — Viewport",
        texto: '<meta name="viewport" content="width=device-width, initial-scale=1">',
        detalhe: "👉 Deve ser incluído no <head> de toda página responsiva"
      },

      {
        tipo: "topico",
        titulo: "🌊 Layout Fluido (Flexível)",
        lista: [
          "Usa **medidas relativas** (%) ao invés de fixas (px)",
          "Adapta-se automaticamente ao tamanho da tela",
          "Ideia principal: layout proporcional ao tamanho da tela"
        ]
      },

      {
        tipo: "exemplo",
        titulo: "Exemplo — Layout Fluido",
        texto: "body {\n  width: 100%;\n}\narticle {\n  width: 75%;\n}",
        detalhe: "👉 Elementos ocupam proporção da tela, não tamanho fixo"
      },

      {
        tipo: "topico",
        titulo: "📲 Mobile First",
        lista: [
          "Estratégia que começa o design pelas **telas pequenas**",
          "Depois adapta para telas maiores",
          "**Vantagens**: foco no essencial · melhor desempenho · interface mais limpa"
        ]
      },

      {
        tipo: "topico",
        titulo: "🔄 Breakpoints",
        lista: [
          "Pontos onde o **layout muda** conforme o tamanho da tela",
          "Função: ajustar layout em diferentes resoluções"
        ]
      },

      {
        tipo: "exemplo",
        titulo: "Exemplo — Breakpoint",
        texto: "@media (max-width: 600px) {\n  .noticia {\n    width: 50%;\n  }\n}",
        detalhe: "👉 A partir de 600px, o elemento .noticia ocupa 50% da largura"
      }

    ]
  },

  {
    id: "metodos",
    titulo: "⚙️ Métodos e Técnicas",
    blocos: [

      {
        tipo: "topico",
        titulo: "📌 1. Uso de Media Queries",
        lista: [
          "Adaptar layout por tamanho de tela",
          "Exemplo: `@media screen and (min-width: 768px) { .elemento { width: 50%; } }`"
        ]
      },

      {
        tipo: "topico",
        titulo: "📌 2. Layout com Medidas Relativas",
        lista: [
          "`%` → largura",
          "`em` → fontes",
          "**Evitar**: `px`, `cm`, `mm`"
        ]
      },

      {
        tipo: "topico",
        titulo: "📌 3. Estrutura Mobile First",
        lista: [
          "1. Criar layout mobile",
          "2. Adicionar media queries com `min-width`",
          "3. Expandir para telas maiores"
        ]
      },

      {
        tipo: "tabela",
        titulo: "📌 4. Breakpoints Comuns",
        colunas: ["Breakpoint", "Dispositivo"],
        linhas: [
          ["480px",   "Celulares maiores"],
          ["768px",   "Tablets"],
          ["960px+",  "Desktops"],
          ["1280px+", "Telas grandes"]
        ]
      },

      {
        tipo: "lista",
        titulo: "⚠️ Observações importantes:",
        itens: [
          "A **ordem das media queries importa**",
          "A última regra pode **sobrescrever** as anteriores",
          "Evitar **excesso de media queries**"
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
        titulo: "Exemplo 1 — Problema sem Media Queries",
        texto: "Layout fluido → elementos se sobrepõem sem media queries para controlar o comportamento.",
        detalhe: "👉 Solução: aplicar media queries para reorganizar os elementos"
      },

      {
        tipo: "exemplo",
        titulo: "Exemplo 2 — Grid Responsivo",
        texto: "Mobile: 1 coluna · Tablet: 2 colunas · Desktop: 3 colunas",
        detalhe: "👉 O número de colunas muda conforme o breakpoint ativo"
      },

      {
        tipo: "exemplo",
        titulo: "Exemplo 3 — Menu Responsivo",
        texto: "Mobile → menu hambúrguer ☰ | Desktop → menu horizontal",
        detalhe: "👉 A estrutura do menu muda completamente entre dispositivos"
      },

      {
        tipo: "exemplo",
        titulo: "Exemplo 4 — Troca de Logo",
        texto: "Mobile → símbolo simples | Desktop → logo completo",
        detalhe: "👉 Elementos visuais podem ser trocados conforme o tamanho da tela"
      }

    ]
  },

  {
    id: "resumo",
    titulo: "⚡ Resumo Final para Revisão Rápida",
    blocos: [
      {
        tipo: "lista",
        itens: [
          "**Design Responsivo** → Adapta o layout a diferentes telas",
          "**Media Queries** → Aplicam estilos condicionais (CSS)",
          "**Viewport** → Controla escala e exibição no mobile",
          "**Layout Fluido** → Usa medidas relativas (% e em)",
          "**Mobile First** → Começa pelo mobile e evolui para desktop",
          "**Breakpoints** → Pontos onde o layout muda"
        ]
      },
      {
        tipo: "destaque",
        texto: "📌 Ideia-chave para prova: Não basta reduzir o tamanho do site — é necessário reorganizar, adaptar e otimizar a interface para cada tipo de dispositivo. Design responsivo envolve media queries, layout fluido, viewport e a metodologia Mobile First."
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