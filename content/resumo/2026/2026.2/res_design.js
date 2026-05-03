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
}

  ]
};