/* =============================================
   NEXUS STUDY — res_design.js
   Disciplina: Design de Sistemas
   ============================================= */

window.__nexusConteudo = {
  aulas: [
    {
      aula: "Aula 1 — O Design com Foco no Usuário",
      ideia_central: "Design centrado no usuário vai além da estética: busca criar sistemas funcionais, intuitivos e desejáveis, integrando IHC, Usabilidade, UX e Ergonomia.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**O que é design** e por que vai além da estética",
                "**IHC, Usabilidade e UX** — diferenças e relações",
                "**Disciplinas de apoio**: Design de Interação, Design de Interface e Arquitetura da Informação",
                "**Ergonomia em sistemas** e os **8 critérios de Scapin e Bastien**"
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
              titulo: "🔹 O que é Design?",
              texto: "Projetar, compor visualmente e colocar em prática um **plano intencional**. Não basta ser bonito — precisa ser funcional e cumprir um objetivo."
            },

            {
              tipo: "topico",
              titulo: "🔹 IHC — Interação Humano-Computador",
              lista: [
                "Surgiu na **década de 1970**",
                "Origem: Ergonomia, Psicologia Cognitiva, Design e Computação",
                "Estuda a **relação completa** entre sistema e usuário",
                "⚠ Interface (IU) é a parte visível; IHC é o estudo da interação como um todo"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Usabilidade (NBR 9241-11)",
              lista: [
                "Medida pela qual um produto pode ser usado com **eficácia, eficiência e satisfação**",
                "Considera: Cognição · Memória · Percepção · Atenção · Tomada de decisão",
                "📌 Hoje, usabilidade é o **mínimo esperado**"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 UX — Experiência do Usuário",
              lista: [
                "Vai além da eficiência",
                "Inclui: **Prazer · Emoção · Afetividade · Encantamento · Desejabilidade**",
                "UX analisa se o usuário se encanta a ponto de querer continuar usando o sistema"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Disciplinas de apoio ao design"
            },

            {
              tipo: "topico",
              titulo: "📌 Design de Interação",
              lista: [
                "Estuda como ocorre a interação entre usuário e sistema",
                "Envolve: Elementos físicos e digitais · Consistência · Padronização · Controle do usuário"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Design de Interface",
              lista: [
                "Foco no **ambiente visual** da interação",
                "Elementos: Ícones · Botões · Textos · Feedback · Condução",
                "Interface deve ser: Fluida · Consistente · Intuitiva · Adequada ao público-alvo",
                "**Princípios (Sobral)**: Visibilidade · Consistência · Familiaridade · Affordance"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Arquitetura da Informação",
              lista: [
                "Organiza o **conteúdo** do sistema",
                "Envolve: Estruturação · Legibilidade · Categorização · Menus bem rotulados"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Ergonomia — Critérios de Scapin e Bastien"
            },

            {
              tipo: "topico",
              titulo: "🔹 Os 8 Critérios Ergonômicos",
              lista: [
                "**1. Compatibilidade** → interface adequada às características do usuário (memória, idade, habilidades)",
                "**2. Condução** → interface orienta o usuário com feedback e agrupamento",
                "**3. Carga de Trabalho** → evita excesso de informação (brevidade, concisão, baixa densidade)",
                "**4. Homogeneidade** → mantém padrões de códigos, nomes e formatos",
                "**5. Significado dos Códigos** → símbolos representam corretamente sua função",
                "**6. Controle Explícito** → usuário pode interromper, suspender e confirmar ações",
                "**7. Adaptabilidade** → sistema se adapta ao nível do usuário (iniciante, intermediário, avançado)",
                "**8. Gestão de Erros** → prevê, informa e permite correção de erros"
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
              titulo: "🔹 Hierarquia dos conceitos",
              lista: [
                "**IHC** → estudo da interação completa",
                "**Usabilidade** → eficácia + eficiência + satisfação (mínimo esperado)",
                "**UX** → mais amplo: inclui emoção e encantamento"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Princípios do Bom Design (Sobral)",
              lista: [
                "**Visibilidade** → usuário reconhece facilmente as funções",
                "**Consistência** → elementos mantêm padrão visual",
                "**Familiaridade** → uso de ícones e padrões conhecidos",
                "**Affordance** → interface 'ensina' a usar sem manual"
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
              titulo: "Exemplo 1 — Gestão de Erros",
              texto: "Sistema prevê e informa erros antes que causem dano.",
              detalhe: "👉 Ex: mensagem de confirmação antes de excluir um arquivo"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Adaptabilidade",
              texto: "Interface se ajusta ao nível do usuário.",
              detalhe: "👉 Ex: atalhos de teclado para avançados, tutorial para iniciantes"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Significado dos Códigos",
              texto: "Ícones representam visualmente sua função.",
              detalhe: "👉 Ex: ícone de lixeira para excluir"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — UX além da usabilidade",
              texto: "Sistema funciona E encanta o usuário.",
              detalhe: "👉 Ex: animações agradáveis, feedback positivo ao completar uma tarefa"
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
                "**Design** = planejamento intencional (funcional + estético)",
                "**IHC** estuda a interação completa · **Interface** é só a parte visível",
                "**Usabilidade** = eficácia + eficiência + satisfação",
                "**UX** amplia para emoção, encantamento e desejabilidade",
                "Disciplinas: **Design de Interação · Interface · Arquitetura da Informação**",
                "**8 critérios de Scapin e Bastien**: base para avaliação ergonômica de interfaces"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: O foco do designer deve ser sempre o usuário — o design eficiente combina funcionalidade, usabilidade e experiência."
            }
          ]
        }

      ]
    },

    {
      aula: "Aula 2 — Comunicação e Semiótica",
      ideia_central: "Sistemas interativos são metacomunicadores: comunicam ao usuário as decisões e intenções do designer por meio de signos visuais.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Comunicabilidade** — capacidade do sistema se fazer entender",
                "**Modelo de Jakobson** aplicado à IHC",
                "**Evolução da Web** (1.0 → 4.0) e seus impactos na comunicação",
                "**Semiótica e Fenomenologia** — estudo dos signos",
                "**Engenharia Semiótica** como disciplina da IHC",
                "**MAC e Inspeção Semiótica** — métodos de avaliação"
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
              titulo: "🔹 Comunicabilidade",
              texto: "Capacidade de um sistema comunicar ao usuário **como ele funciona, o que pode ser feito e como deve ser usado**. Base: Modelo de Jakobson (1960)."
            },

            {
              tipo: "topico",
              titulo: "🔹 Modelo de Jakobson na IHC",
              lista: [
                "**Emissor** → o designer",
                "**Mensagem** → a interface",
                "**Receptor** → o usuário",
                "Também envolve: Código · Canal · Contexto"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Evolução da Web"
            },

            {
              tipo: "topico",
              titulo: "📌 Web 1.0 → 4.0",
              lista: [
                "**Web 1.0** → estática, sites corporativos, usuário passivo",
                "**Web 2.0** → interação, redes sociais, usuário criando conteúdo",
                "**Web 3.0** → semântica, dados organizados de forma inteligente",
                "**Web 4.0** → mobilidade, ubiquidade, Inteligência Artificial"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Semiótica (Peirce, 1839–1914)",
              lista: [
                "Ciência que estuda os **signos**",
                "Estuda: como signos representam algo · como são interpretados · como produzem significado"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Fenomenologia",
              lista: [
                "Estudo da **experiência humana**",
                "Relaciona-se com: Estética · Ética · Lógica",
                "Ajuda a entender como o usuário **percebe e interpreta** a interface"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Engenharia Semiótica",
              lista: [
                "Disciplina da IHC centrada na comunicação",
                "Ideia central: **Sistemas são metacomunicadores**",
                "O sistema comunica as decisões e intenções do designer ao usuário",
                "Se a comunicação falha → problema de **comunicabilidade**"
              ]
            }
          ]
        },

        {
          id: "metodos",
          titulo: "📊 Métodos de Avaliação",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 MAC — Método de Avaliação de Comunicabilidade",
              lista: [
                "**Etapa 1**: Preparação do teste",
                "**Etapa 2**: Coleta de dados",
                "**Etapa 3**: Análise dos dados",
                "Objetivo: identificar ruídos na comunicação e quebras de entendimento"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Inspeção Semiótica",
              lista: [
                "Método analítico baseado na análise dos signos da interface",
                "**Signos metalinguísticos**: textos explicativos, tutoriais, ajuda",
                "**Signos estáticos**: ícones, layout, cores, elementos fixos",
                "**Signos dinâmicos**: animações, feedback, mudanças de estado",
                "Finaliza com apreciação da qualidade da metacomunicação"
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
              titulo: "Exemplo 1 — Comunicabilidade bem-sucedida",
              texto: "Usuário entende intuitivamente como navegar no sistema.",
              detalhe: "👉 Ex: botões com ícones reconhecíveis que dispensam texto explicativo"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Falha de comunicabilidade",
              texto: "Usuário não consegue entender a função de um elemento.",
              detalhe: "👉 Ex: ícone ambíguo que gera dúvida sobre a ação que executa"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Signo dinâmico",
              texto: "Feedback visual que comunica o estado do sistema.",
              detalhe: "👉 Ex: barra de progresso ao carregar um arquivo"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Web 2.0 como comunicação bidirecional",
              texto: "Usuário deixa de ser passivo e passa a criar conteúdo.",
              detalhe: "👉 Ex: postagens em redes sociais, comentários, avaliações"
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
                "**Comunicabilidade** = capacidade do sistema transmitir sua intenção ao usuário",
                "**Jakobson**: designer (emissor) → interface (mensagem) → usuário (receptor)",
                "**Web** evoluiu de passiva (1.0) para inteligente e adaptativa (4.0)",
                "**Semiótica** (Peirce) estuda como signos produzem significado",
                "**Engenharia Semiótica**: sistemas são metacomunicadores",
                "**MAC** e **Inspeção Semiótica** avaliam falhas na comunicação"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: O sistema não apenas executa funções — ele comunica ao usuário as intenções do designer por meio de signos visuais."
            }
          ]
        }

      ]
    },

    {
      aula: "Aula 3 — Alfabeto Visual",
      ideia_central: "Assim como existe um alfabeto verbal, existe um alfabeto visual — dominar seus 10 elementos básicos é essencial para criar interfaces eficientes e comunicativas.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Alfabetismo visual** — o que significa dominar a linguagem das imagens",
                "**Três níveis de mensagem visual**: representacional, abstrato e simbólico",
                "**Os 10 elementos básicos** da leitura visual",
                "**Aplicação prática** dos elementos em interfaces gráficas"
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
              titulo: "🔹 Alfabetismo Visual",
              texto: "Domínio consciente dos elementos visuais: conhecê-los, entender seus significados, saber combiná-los e analisar composições."
            },

            {
              tipo: "topico",
              titulo: "🔹 Diferença: Visual vs. Verbal",
              lista: [
                "O alfabeto visual é **menos rígido** que o verbal",
                "É mais **interpretativo** e culturalmente influenciado",
                "Igualmente estruturado — tem seus próprios 'ingredientes'"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Três níveis de mensagem visual"
            },

            {
              tipo: "topico",
              titulo: "📌 Representacional",
              lista: [
                "Representa o mundo real da forma mais **fiel** possível",
                "✔ Fácil reconhecimento · Pouca abstração",
                "👉 Ex: fotografia de um objeto real"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Abstrato",
              lista: [
                "**Simplificação** da realidade",
                "Redução de detalhes · Ênfase em formas e cores",
                "Usado para intensificar significado"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Simbólico",
              lista: [
                "**Redução radical** da representação",
                "✔ Elementos mínimos · Fácil memorização",
                "👉 Ex: ícones de interface"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Os 10 elementos básicos da leitura visual"
            },

            {
              tipo: "topico",
              titulo: "🔹 Ponto, Linha e Forma",
              lista: [
                "**Ponto** → unidade mínima, direciona o olhar, base do pontilhismo",
                "**Linha** → energética, direcional; diagonal transmite tensão e instabilidade",
                "**Forma** → Quadrado (estabilidade) · Triângulo (tensão) · Círculo (proteção)"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Direção, Tom e Cor",
              lista: [
                "**Direção** → Horizontal/Vertical (equilíbrio) · Diagonal (instabilidade) · Curva (suavidade)",
                "**Tom** → variação entre luz e sombra, cria profundidade",
                "**Cor** → forte impacto emocional; considera aspectos físicos, fisiológicos e culturais"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Textura, Escala, Dimensão e Movimento",
              lista: [
                "**Textura** → percebida visualmente, cria contraste e enriquece superfícies",
                "**Escala** → relação de tamanho, define peso visual e hierarquia",
                "**Dimensão** → ilusão de profundidade com perspectiva (3D em plano 2D)",
                "**Movimento** → ilusão de dinamismo por repetição, desfoque e animação"
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
              titulo: "🔹 Análise e Síntese no Design",
              lista: [
                "**Análise** → investigação do problema",
                "**Síntese** → criação da solução visual",
                "O computador ampliou possibilidades, mas os fundamentos visuais continuam os mesmos"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Aplicação prática dos elementos",
              lista: [
                "Interfaces criativas usam os elementos de forma **coerente e intencional**",
                "Estética deve sempre estar **alinhada à usabilidade**",
                "Cada elemento transmite uma **metamensagem** específica"
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
              titulo: "Exemplo 1 — Forma e significado",
              texto: "Formas transmitem mensagens inconscientes ao usuário.",
              detalhe: "👉 Ex: botões arredondados (círculo) transmitem proteção; botões quadrados transmitem solidez"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Nível simbólico",
              texto: "Ícones são representações simbólicas de ações.",
              detalhe: "👉 Ex: ícone de casa para 'voltar ao início', lupa para 'buscar'"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Linha diagonal",
              texto: "Diagonais criam sensação de tensão e dinamismo.",
              detalhe: "👉 Ex: banners com texto inclinado para transmitir urgência ou promoção"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Escala e hierarquia",
              texto: "Tamanho diferente cria hierarquia visual clara.",
              detalhe: "👉 Ex: título maior que subtítulo, que é maior que o corpo do texto"
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
                "**Alfabetismo visual** = domínio consciente dos elementos visuais",
                "**3 níveis de mensagem**: Representacional (real) · Abstrato (simplificado) · Simbólico (mínimo)",
                "**10 elementos básicos**: Ponto · Linha · Forma · Direção · Tom · Cor · Textura · Escala · Dimensão · Movimento",
                "Cada elemento transmite uma **metamensagem** específica ao usuário",
                "O alfabeto visual é menos rígido que o verbal, mas igualmente estruturado"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: Não existe elemento visual 'neutro' — cada escolha (cor, forma, linha, escala) comunica algo ao observador."
            }
          ]
        }

      ]
    },

    {
      aula: "Aula 4 — Psicologia Cognitiva e Gestalt da Forma",
      ideia_central: "Interfaces eficientes respeitam como o cérebro humano percebe, organiza e memoriza informações — a Psicologia Cognitiva e a Gestalt fornecem as bases para isso.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Psicologia Cognitiva** aplicada à IHC — atenção e memória",
                "**Processo de ação** do usuário: análise, planificação e controle",
                "**Gestalt da Forma** — como o cérebro organiza estímulos visuais",
                "**8 pilares da Gestalt** aplicáveis a interfaces gráficas"
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
              titulo: "🔹 Psicologia Cognitiva na IHC",
              texto: "Estuda os processos mentais do pensamento humano. Na IHC, o foco principal está em **atenção e memória**."
            },

            {
              tipo: "topico",
              titulo: "🔹 Tipos de Atenção",
              lista: [
                "**Seletiva** → foco em um estímulo ignorando outros",
                "**Vigilância** → manter atenção por longos períodos",
                "**Sondagem** → busca ativa por informações no ambiente",
                "**Dividida** → realizar mais de uma tarefa ao mesmo tempo",
                "📌 Em interfaces: excesso de informação **reduz foco**"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Memória",
              lista: [
                "**Curta duração** → temporária e limitada",
                "**Longa duração** → armazenamento permanente",
                "Interfaces devem: Reduzir carga cognitiva · Evitar exigir memorização excessiva"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Processo de Ação do Usuário",
              lista: [
                "**1. Análise da situação** → ativação, observação, categorização, interpretação",
                "**2. Planificação das ações** → avaliação de possibilidades, definição da tarefa e procedimentos",
                "**3. Controle das ações** → baseado em habilidades, regras e conhecimentos"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Gestalt da Forma"
            },

            {
              tipo: "topico",
              titulo: "🔹 Premissa da Gestalt",
              texto: "**O todo é maior que a soma das partes.** O cérebro organiza estímulos automaticamente buscando padrões simples e estáveis."
            },

            {
              tipo: "topico",
              titulo: "🔹 Princípios Fundamentais",
              lista: [
                "**Tendência à estruturação** → cérebro organiza estímulos automaticamente",
                "**Segregação Figura-Fundo** → separação entre elemento principal e plano de fundo",
                "**Constância Perceptiva** → reconhecimento de objetos mesmo com mudanças",
                "**Pregnância** → preferência por formas simples, estáveis e organizadas"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Os 8 Pilares da Gestalt em Interfaces",
              lista: [
                "**Unidades** → elementos percebidos como partes organizadas",
                "**Unificação** → agrupamento que gera sensação de conjunto",
                "**Continuidade** → o olhar segue linhas e direções naturalmente",
                "**Proximidade** → elementos próximos são percebidos como relacionados",
                "**Semelhança** → elementos semelhantes são agrupados mentalmente",
                "**Segregação** → diferenciação clara entre figura e fundo",
                "**Fechamento** → tendência a completar formas incompletas",
                "**Pregnância da Forma** → preferência por formas simples e organizadas"
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
              titulo: "🔹 Aplicação da Gestalt no Design",
              lista: [
                "**Proximidade**: agrupar elementos relacionados visualmente",
                "**Semelhança**: usar cor/forma iguais para itens da mesma categoria",
                "**Fechamento**: criar formas incompletas que o cérebro completa",
                "**Continuidade**: guiar o olhar ao longo de uma sequência lógica"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Reduzindo carga cognitiva",
              lista: [
                "Organizar informações em **grupos claros**",
                "Evitar exigir que o usuário memorize caminhos ou dados",
                "Usar **padrões familiares** para facilitar reconhecimento"
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
              titulo: "Exemplo 1 — Proximidade",
              texto: "Elementos próximos são percebidos como relacionados.",
              detalhe: "👉 Ex: label próxima ao campo de formulário indica que pertencem ao mesmo grupo"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Figura-Fundo",
              texto: "Contraste entre elemento principal e fundo guia a atenção.",
              detalhe: "👉 Ex: modal com fundo escurecido isola o conteúdo importante"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Fechamento",
              texto: "O cérebro completa formas mesmo que incompletas.",
              detalhe: "👉 Ex: logotipos com partes faltando que o cérebro 'fecha' automaticamente"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Atenção dividida prejudicada",
              texto: "Excesso de elementos simultâneos reduz foco.",
              detalhe: "👉 Ex: página com muitos pop-ups, banners e animações ao mesmo tempo"
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
                "**Psicologia Cognitiva** foca em atenção e memória na IHC",
                "**Atenção**: seletiva · vigilância · sondagem · dividida",
                "**Processo de ação**: análise → planificação → controle",
                "**Gestalt**: o todo é maior que a soma das partes",
                "**4 princípios fundamentais**: estruturação · figura-fundo · constância · pregnância",
                "**8 pilares aplicáveis**: unidades, unificação, continuidade, proximidade, semelhança, segregação, fechamento, pregnância"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: O cérebro organiza automaticamente — o designer deve usar isso a seu favor: agrupar, contrastar e simplificar."
            }
          ]
        }

      ]
    },

    {
      aula: "Aula 5 — O Elemento Cor",
      ideia_central: "A cor é uma ferramenta poderosa de comunicação visual — sua escolha deve ser estratégica, baseada em psicologia, cultura e objetivo do projeto.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Fatores** que influenciam a escolha de cores (fisiológicos, psicológicos, culturais)",
                "**Psicologia das cores** — cores quentes vs. frias e seus efeitos",
                "**Significados** das principais cores",
                "**Regra 60-30-10** para equilíbrio visual",
                "**Esquemas de cores** baseados no círculo cromático",
                "**RGB vs. CMYK** — quando usar cada um"
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
              titulo: "🔹 Fatores para Escolha de Cores",
              lista: [
                "**Fisiológicos** → como o olho humano percebe as cores",
                "**Psicológicos** → impacto emocional das cores",
                "**Culturais** → significados variam entre culturas",
                "**Contextuais** → objetivo do projeto",
                "**Público-alvo** → idade, preferências, hábitos"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Psicologia das Cores",
              lista: [
                "**Cores quentes** (vermelho, amarelo) → comprimento de onda maior, exigem mais energia: estímulo e agitação",
                "**Cores frias** (azul, verde, violeta) → comprimento de onda menor: calma e relaxamento",
                "Significado **não é universal** — varia por cultura, religião e experiência pessoal"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Significados das Cores",
              lista: [
                "**Azul** → paz, confiança, serenidade, harmonia",
                "**Amarelo** → alerta, energia, euforia, esperança",
                "**Vermelho** → paixão, perigo, energia, ação",
                "**Verde** → saúde, natureza, equilíbrio, esperança",
                "**Laranja** → alegria, entusiasmo, criatividade",
                "**Violeta** → calma, dignidade, espiritualidade"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Processo de criação de esquema de cores"
            },

            {
              tipo: "topico",
              titulo: "📌 Regra 60-30-10",
              lista: [
                "**60%** → Cor dominante (fundo / base)",
                "**30%** → Cor secundária (textos / elementos)",
                "**10%** → Cor de destaque (detalhes)",
                "✔ Garante equilíbrio visual e organização"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Esquemas baseados no círculo cromático",
              lista: [
                "**Cores análogas** → harmonia",
                "**Cores complementares** → contraste",
                "**Tríade** → equilíbrio vibrante",
                "**Monocromático** → variações de uma cor"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 RGB vs. CMYK",
              lista: [
                "**RGB** (luz) → telas digitais · mais variedade de cores",
                "**CMYK** (pigmento) → impressão · menor gama de cores",
                "📌 Regra: Digital → RGB · Impressão → CMYK"
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
              titulo: "🔹 Boas práticas no uso da cor",
              lista: [
                "Nunca escolher cores aleatoriamente",
                "Pensar sempre no **público-alvo**",
                "Considerar **emoção e cultura** envolvidas",
                "Manter **equilíbrio visual** (regra 60-30-10)",
                "Usar **contraste** para destacar e **harmonia** para conforto"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Ferramentas de apoio",
              lista: [
                "**Adobe Color** → gera paletas monocromáticas, complementares e tríades",
                "Facilita tomada de decisão visual e testes de combinação"
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
              titulo: "Exemplo 1 — Influência cultural das cores",
              texto: "A mesma cor pode ter significados opostos em culturas diferentes.",
              detalhe: "👉 Ex: branco = pureza no Ocidente · morte na cultura hindu"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Regra 60-30-10",
              texto: "Três cores em proporções estratégicas criam equilíbrio.",
              detalhe: "👉 Ex: fundo neutro (60%) + texto escuro (30%) + botão colorido (10%)"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Cores quentes em chamadas de ação",
              texto: "Cores quentes atraem atenção e estimulam ação.",
              detalhe: "👉 Ex: botão 'Comprar agora' em vermelho ou laranja"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Cor transmitindo confiança",
              texto: "Azul é amplamente usado para transmitir segurança.",
              detalhe: "👉 Ex: logos de bancos, apps financeiros e redes sociais profissionais"
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
                "Cor = **comunicação + emoção** — nunca escolha aleatória",
                "Fatores: **fisiológico · psicológico · cultural · contextual · público-alvo**",
                "**Cores quentes** estimulam · **Cores frias** acalmam",
                "**Regra 60-30-10**: dominante · secundária · destaque",
                "**Esquemas**: análogo (harmonia) · complementar (contraste) · tríade · monocromático",
                "**RGB** para digital · **CMYK** para impressão"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: A cor deve ser escolhida com base na mensagem a transmitir — combina psicologia, cultura e técnica (círculo cromático)."
            }
          ]
        }

      ]
    },

    {
      aula: "Aula 6 — Tipografia",
      ideia_central: "A tipografia deve ser escolhida estrategicamente — impacta diretamente a legibilidade, o conforto visual e a experiência do usuário.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Importância da tipografia** na experiência do usuário",
                "**Serifadas vs. Sem serifa** — quando usar cada uma",
                "**Alinhamento tipográfico** e seus efeitos",
                "**Tamanho de fonte** por dispositivo e público-alvo",
                "**Quantidade de caracteres por linha** para legibilidade",
                "**Peso tipográfico** (font-weight) e suas variações"
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
              titulo: "🔹 Impacto da Tipografia na UX",
              texto: "A escolha da fonte influencia **legibilidade, conforto visual e compreensão da informação**. Uma tipografia bem aplicada facilita a navegação e reduz esforço de leitura."
            },

            {
              tipo: "topico",
              titulo: "🔹 Serifadas vs. Sem Serifa",
              lista: [
                "**Serifadas** → traços nas extremidades · indicadas para textos longos impressos · transmitem tradição e formalidade",
                "**Sem serifa (Sans Serif)** → sem traços · indicadas para telas · transmitem modernidade e simplicidade",
                "📌 Hoje: CSS @font-face e Google Fonts ampliam as opções disponíveis"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Alinhamento Tipográfico",
              lista: [
                "**Esquerda** (recomendado) → mais natural para leitura ocidental",
                "**Justificado** → pode causar 'caminhos de rato' por espaços irregulares",
                "**Centralizado** → uso recomendado apenas para títulos e frases curtas"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Tamanho da Fonte",
              lista: [
                "**Padrão desktop**: 16px · **Mobile**: pode começar em 12px",
                "**< 7 anos**: 24 · **7–8 anos**: 18 · **8–9 anos**: 14 · **10–11 anos**: 12 · **Adultos**: 10",
                "Unidade **EM** é recomendada para responsividade · **px** é mais preciso porém menos flexível"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Quantidade de Caracteres por Linha",
              lista: [
                "**Desktop**: ideal de **50 a 80 caracteres**",
                "**Mobile**: ideal de **30 a 35 caracteres**",
                "Linhas muito longas → cansam · Linhas muito curtas → quebram ritmo"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Peso Tipográfico (Font Weight)",
              lista: [
                "**Light** → fino · **Regular** → normal · **Bold** → negrito · **Black** → muito pesado",
                "**Condensed** → mais estreito · **Extended** → mais largo · **Outline** → contorno",
                "CSS: `font-weight: normal;` · Fontes pagas oferecem mais variações"
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
              titulo: "🔹 Decisão tipográfica estratégica",
              lista: [
                "Considerar: **objetivo do projeto · público-alvo · dispositivo · tipo de conteúdo**",
                "O mesmo texto pode ter experiências totalmente diferentes dependendo da tipografia escolhida"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Boas práticas",
              lista: [
                "Usar **sem serifa** para interfaces digitais",
                "Preferir **alinhamento à esquerda** em textos longos",
                "Ajustar **tamanho e espaçamento** conforme dispositivo",
                "Controlar **comprimento de linha** para conforto de leitura"
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
              titulo: "Exemplo 1 — Serifada em texto longo",
              texto: "Fontes com serifa facilitam a leitura de textos extensos impressos.",
              detalhe: "👉 Ex: livros e jornais usam Times New Roman ou Georgia"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Justificado problemático",
              texto: "Texto justificado sem hifenização cria espaços irregulares.",
              detalhe: "👉 Ex: parágrafos com 'rios brancos' que distraem a leitura em telas"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Tamanho por público",
              texto: "Fontes maiores facilitam leitura de crianças pequenas.",
              detalhe: "👉 Ex: apps infantis usam fontes de 24px ou mais para crianças menores de 7 anos"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Responsividade com EM",
              texto: "Unidade EM se adapta proporcionalmente ao tamanho base do dispositivo.",
              detalhe: "👉 Ex: 1.5em = 1.5× o tamanho base, ajustando automaticamente em mobile e desktop"
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
                "**Serifada** → impressos e textos longos · **Sans Serif** → telas e interfaces digitais",
                "**Alinhamento esquerda** é o mais recomendado para textos na web",
                "**Desktop**: 16px · **Mobile**: 12px · use **EM** para responsividade",
                "**50–80 caracteres/linha** no desktop · **30–35** no mobile",
                "**Peso** (Light · Regular · Bold · Black) cria hierarquia visual",
                "Tipografia impacta diretamente **legibilidade · conforto · UX**"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: Tipografia não é só estética — ela define se o usuário consegue ou não ler e compreender o conteúdo com conforto."
            }
          ]
        }

      ]
    },

    {
      aula: "Aula 7 — A Imagem",
      ideia_central: "A imagem é um elemento fundamental da comunicação visual — seu uso estratégico, combinado com semiótica, composição e texto, determina a eficiência da mensagem.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Conceito e função comunicativa** da imagem",
                "**Semiótica aplicada**: ícone, índice e símbolo",
                "**Percepção e composição visual** — posição e interpretação",
                "**Bitmap vs. Vetor** e **Fotografia vs. Ilustração**",
                "**Formatos de imagem** e suas aplicações (PNG, JPG, GIF, etc.)",
                "**Relação imagem + texto**: redundância, informatividade, complexidade"
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
              titulo: "🔹 Função da Imagem",
              texto: "A imagem é um **signo visual** com forte poder simbólico e emocional. Substitui experiências reais na mente do observador e atua junto ao texto reforçando significado."
            },

            {
              tipo: "subtitulo",
              texto: "Semiótica — Tipos de signos"
            },

            {
              tipo: "topico",
              titulo: "📌 Ícone",
              lista: [
                "Relação por **semelhança** — representa visualmente o objeto",
                "👉 Ex: ícone da Torre Eiffel representa Paris"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Índice (indício)",
              lista: [
                "Relação de **causa ou evidência** — indica algo indiretamente",
                "👉 Ex: fumaça → fogo · pegadas → alguém passou"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Símbolo",
              lista: [
                "Relação **cultural/convenção** — depende de interpretação social",
                "👉 Ex: pomba branca → paz · cruz → cristianismo"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Composição Visual",
              lista: [
                "**Central** → neutra · **Deslocada** → dinâmica",
                "**Pequena** → isolamento · **Cortada** → impacto/força",
                "Uma imagem pode ter **múltiplos significados** dependendo da composição"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Classificação e formatos"
            },

            {
              tipo: "topico",
              titulo: "📌 Bitmap vs. Vetor",
              lista: [
                "**Bitmap** → baseado em pixels · usado em fotografias",
                "**Vetor** → baseado em fórmulas matemáticas · usado em ilustrações e logotipos"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Formatos de imagem",
              lista: [
                "**BMP** → sem perda, mas arquivos grandes",
                "**GIF** → compacto, sem perda, máx. 256 cores · ideal para gráficos simples",
                "**PNG** → alta qualidade com transparência · ideal para imagens com fundo transparente",
                "**JPEG** → boa compressão com perda · ideal para fotos",
                "**TIFF** → altíssima qualidade · ideal para impressão"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Relação Imagem + Texto",
              lista: [
                "**Redundância** → texto mais importante, imagem complementa",
                "**Informatividade** → imagem mais importante (ex: infográficos)",
                "**Complexidade** → texto e imagem com mesmo peso",
                "**Ancoragem** → texto direciona a interpretação da imagem",
                "**Relais** → texto e imagem se complementam mutuamente"
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
              titulo: "🔹 Boas práticas no meio digital",
              lista: [
                "Escolher o **formato adequado** ao uso (PNG para transparência, JPEG para fotos)",
                "**Otimizar tamanho** para reduzir tempo de carregamento",
                "Considerar: velocidade da internet · peso da imagem · experiência do usuário"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Fotografia vs. Ilustração",
              lista: [
                "**Fotografia** → realismo alto, credibilidade, mensagem direta",
                "**Ilustração** → mais criativa, estimula imaginação, comunicação conceitual",
                "Escolha depende do **objetivo e contexto** do projeto"
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
              titulo: "Exemplo 1 — Ícone em interface",
              texto: "Ícones usam semelhança visual para representar ações.",
              detalhe: "👉 Ex: ícone de lupa representa 'busca', ícone de sino representa 'notificações'"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Ancoragem",
              texto: "Texto ao lado de uma imagem direciona sua interpretação.",
              detalhe: "👉 Ex: foto de pessoa sorrindo + 'Satisfação garantida' → reforça confiança"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Escolha de formato",
              texto: "Formato errado prejudica qualidade ou desempenho.",
              detalhe: "👉 Ex: usar BMP em site = carregamento lento · usar PNG em vez de JPEG para foto = arquivo desnecessariamente grande"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Imagem cortada",
              texto: "Cortar uma imagem cria impacto visual e sensação de força.",
              detalhe: "👉 Ex: rosto parcialmente visível em banner cria tensão e curiosidade"
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
                "Imagem = **signo visual** com poder simbólico e emocional",
                "**Semiótica**: Ícone (semelhança) · Índice (causa/evidência) · Símbolo (convenção cultural)",
                "**Bitmap** (pixels, fotos) vs. **Vetor** (matemático, ilustrações)",
                "**Formatos**: PNG (transparência) · JPEG (fotos) · GIF (gráficos simples) · TIFF (impressão)",
                "**Relação texto+imagem**: redundância · informatividade · complexidade · ancoragem · relais",
                "A imagem não comunica sozinha — depende de **contexto e composição**"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: Toda imagem é um signo — ícone, índice ou símbolo — e seu significado depende do contexto e da relação com o texto."
            }
          ]
        }

      ]
    },

    {
      aula: "Aula 8 — O Layout",
      ideia_central: "O layout é a organização estratégica dos elementos visuais — responsável por garantir clareza, usabilidade e impacto visual nas interfaces.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Conceito de layout** e sua função na interface",
                "**Contraste vs. harmonia** — dinâmica da composição",
                "**Técnicas visuais** em pares opostos (polaridades)",
                "**Três pilares do layout** em interfaces gráficas",
                "**Grid (grade)** e sua importância para organização e responsividade",
                "**Comportamento do usuário** e padrões de leitura"
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
              titulo: "🔹 Definição de Layout",
              texto: "**Organização hierárquica dos elementos visuais** — integra cores, tipografia e imagens para garantir legibilidade, usabilidade e comunicação eficiente."
            },

            {
              tipo: "topico",
              titulo: "🔹 Contraste vs. Harmonia",
              lista: [
                "**Harmonia (Nivelamento)** → elementos alinhados, sensação de estabilidade",
                "**Contraste (Aguçamento)** → elementos fora do eixo, sensação de dinamismo",
                "**Ambiguidade** → nem harmônico nem contrastante → ⚠️ deve ser evitada"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Tipos de Contraste",
              lista: [
                "**Tom** → claro vs. escuro",
                "**Cor** → diferença de cores",
                "**Forma** → regular vs. irregular",
                "**Escala** → grande vs. pequeno",
                "📌 Contraste só existe com **oposição entre elementos**"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Técnicas visuais — polaridades"
            },

            {
              tipo: "topico",
              titulo: "📌 Pares opostos fundamentais",
              lista: [
                "**Equilíbrio × Instabilidade** → estável/seguro vs. tensão/movimento",
                "**Simetria × Assimetria** → espelho vs. diferentes mas equilibrados",
                "**Regularidade × Irregularidade** → padrão constante vs. surpresa visual",
                "**Simplicidade × Complexidade** → fácil percepção vs. muitos elementos organizados",
                "**Unidade × Fragmentação** → percepção do todo vs. partes relacionadas",
                "**Economia × Profusão** → poucos elementos vs. riqueza visual",
                "**Minimização × Exagero** → 'menos é mais' vs. ampliação de características"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Três Pilares do Layout em Interfaces",
              lista: [
                "**1. Navegação** → regra dos 3 cliques · acesso rápido às informações",
                "**2. Lógica visual** → organização intuitiva com princípios visuais",
                "**3. Templates** → estrutura padrão reutilizável que mantém consistência"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Grid (Grade de Layout)",
              lista: [
                "Estrutura com linhas e colunas para organizar e garantir consistência",
                "**Vantagens**: organização clara · rapidez no desenvolvimento · padronização",
                "Grid não limita criatividade — serve como **guia**",
                "**Grid de 12 colunas** é o mais comum (permite várias divisões)",
                "Para responsividade: usar medidas em **porcentagem (%)**",
                "**Fórmula**: objeto ÷ largura total = % · Ex: 300px ÷ 960px = 31,25%"
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
              titulo: "🔹 Comportamento do usuário na leitura",
              lista: [
                "Padrão ocidental: **esquerda → direita · cima → baixo**",
                "Elementos principais devem estar no **topo ou à esquerda**",
                "Usar contraste, cor e peso visual para guiar o olhar"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Layout estruturado vs. não estruturado",
              lista: [
                "**Estruturado** → mais fácil de entender",
                "**Não estruturado** → mais criativo, porém mais complexo",
                "Técnicas de livros e revistas (**grid, regra dos terços, peso visual**) também se aplicam ao digital"
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
              titulo: "Exemplo 1 — Contraste de escala",
              texto: "Elemento grande ao lado de pequeno cria destaque imediato.",
              detalhe: "👉 Ex: título enorme com subtítulo pequeno hierarquiza visualmente o conteúdo"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Regra dos 3 cliques",
              texto: "Usuário deve chegar a qualquer conteúdo em no máximo 3 cliques.",
              detalhe: "👉 Ex: menu bem estruturado com categorias claras e acesso direto"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Grid de 12 colunas",
              texto: "Grade de 12 colunas permite dividir o layout de várias formas.",
              detalhe: "👉 Ex: 3 colunas de 4 (conteúdo triplo) ou 1+11 (sidebar + principal)"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Fórmula de responsividade",
              texto: "Converter pixels em porcentagem garante adaptação a diferentes telas.",
              detalhe: "👉 Ex: coluna de 300px em tela de 960px = 300÷960 = 31,25% da largura"
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
                "**Layout** = organização hierárquica de cores, tipografia e imagens",
                "**Harmonia** (estabilidade) e **Contraste** (dinamismo) — ambos necessários",
                "**Ambiguidade** visual deve sempre ser evitada",
                "**7 pares de técnicas visuais**: equilíbrio/instabilidade · simetria/assimetria · regularidade/irregularidade · etc.",
                "**3 pilares**: Navegação (3 cliques) · Lógica visual · Templates",
                "**Grid** organiza sem limitar · 12 colunas · usar % para responsividade"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: Um bom layout não depende só dos elementos, mas de COMO eles são organizados — contraste, hierarquia e grid são suas ferramentas principais."
            }
          ]
        }

      ]
    }

  ],

simplificado: [

  /* índice 0 → Aula 1 */
  {
    aula: "Aula 1 — O Design com Foco no Usuário",
    ideia_central: "Design não é só deixar algo bonito — é criar algo com um propósito que funcione de verdade.",
    secoes: [
      {
        id: "design",
        titulo: "🎨 O que é Design?",
        blocos: [
          {
            tipo: "topico",
            titulo: "🔹 Design e Design de Sistemas",
            texto: "Design é criar com **propósito**: precisa ser bonito E funcional, cumprir um objetivo. O designer combina palavras, imagens e sons para criar experiências que fazem sentido.",
            lista: [
              "O erro mais comum é o desenvolvedor focar só na tecnologia e **esquecer o usuário**",
              "Design de Sistemas cria produtos que facilitam a interação entre pessoas e computadores"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 IHC · Usabilidade · UX",
            lista: [
              "**IHC** → surgiu nos anos 70, misturando Ergonomia, Psicologia, Design e Computação. Estuda a relação entre o usuário e o sistema como um todo. A Interface (IU) é só a parte visível — o IHC vai além disso.",
              "**Usabilidade** → eficácia + eficiência + satisfação. Considera memória, atenção e percepção. Hoje é o **mínimo esperado**.",
              "**UX** → vai além: prazer, emoção, encantamento, desejabilidade. Pergunta: *o usuário quer continuar usando?*"
            ]
          }
        ]
      },
      {
        id: "disciplinas",
        titulo: "🧩 Disciplinas com Foco no Usuário",
        blocos: [
          {
            tipo: "topico",
            titulo: "📌 Design de Interação",
            lista: [
              "Estuda como a interação ocorre entre usuário e sistema",
              "Considera: consistência, padronização, controle do usuário e compatibilidade com o que ele espera"
            ]
          },
          {
            tipo: "topico",
            titulo: "📌 Design de Interface",
            lista: [
              "Foco no ambiente visual — ícones, botões, textos, feedbacks. A interface precisa ser fluida, intuitiva e adequada ao público.",
              "**Visibilidade** → o usuário reconhece facilmente as funções",
              "**Consistência** → elementos mantêm padrão visual",
              "**Familiaridade** → usa ícones e padrões já conhecidos",
              "**Affordance** → a interface 'ensina' a usar sem precisar de manual"
            ]
          },
          {
            tipo: "topico",
            titulo: "📌 Arquitetura da Informação",
            lista: [
              "Organiza o conteúdo — menus, categorias, estrutura de navegação",
              "Uma boa arquitetura melhora toda a experiência"
            ]
          }
        ]
      },
      {
        id: "ergonomia",
        titulo: "⚙️ Ergonomia — 8 Critérios de Bastien e Scapin",
        blocos: [
          {
            tipo: "destaque",
            texto: "A ergonomia organiza a interface de forma metódica para melhorar a usabilidade. A base vem de **Bastien e Scapin (1993)**, que definiram 8 critérios:"
          },
          {
            tipo: "lista",
            itens: [
              "**1. Compatibilidade** → considera memória, idade e habilidades do usuário",
              "**2. Condução** → orienta com feedback imediato e agrupamento claro",
              "**3. Carga de Trabalho** → evita excesso de informação. O objetivo é reduzir o esforço de quem usa",
              "**4. Homogeneidade** → mantém padrões visuais e de comportamento em situações semelhantes",
              "**5. Significado dos Códigos** → ícones representam corretamente sua função. Ex: lixeira = excluir",
              "**6. Controle Explícito** → usuário pode interromper, suspender ou confirmar ações",
              "**7. Adaptabilidade** → ajuda para iniciantes, atalhos para avançados",
              "**8. Gestão de Erros** → prevê erros, avisa claramente e permite correção. Ex: confirmação antes de excluir"
            ]
          }
        ]
      }
    ]
  },

  /* índice 1 → Aula 2 */
  {
    aula: "Aula 2 — Comunicação e Semiótica",
    ideia_central: "O sistema comunica as decisões do designer ao usuário — se essa comunicação falha, o usuário se perde.",
    secoes: [
      {
        id: "comunicabilidade",
        titulo: "📡 Comunicabilidade",
        blocos: [
          {
            tipo: "topico",
            titulo: "🔹 O que é Comunicabilidade?",
            texto: "É a capacidade de um sistema **se fazer entender** pelo usuário — garantir que ele entenda como o sistema funciona e o que pode fazer com ele.",
            lista: [
              "**Designer** → manda a mensagem",
              "**Interface** → é a mensagem em si",
              "**Usuário** → quem recebe"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Evolução da Web",
            lista: [
              "**Web 1.0** → sites estáticos, usuário só lê",
              "**Web 2.0** → redes sociais, usuário cria conteúdo",
              "**Web 3.0** → interpreta e organiza informações de forma inteligente",
              "**Web 4.0** → Inteligência Artificial, sistemas que se adaptam sozinhos"
            ]
          }
        ]
      },
      {
        id: "semiotica",
        titulo: "🔣 Semiótica e Engenharia Semiótica",
        blocos: [
          {
            tipo: "topico",
            titulo: "🔹 Semiótica e Fenomenologia",
            lista: [
              "**Semiótica** → estuda os signos: como um símbolo representa algo e como é interpretado. Ex: uma lixeira significa 'excluir'",
              "**Fenomenologia** → estuda como o usuário percebe e sente a interface (estética, ética, lógica)"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Engenharia Semiótica",
            texto: "É uma área dentro do IHC que estuda a comunicação entre sistema e usuário. O sistema comunica as decisões do designer ao usuário por meio de **ícones, navegação, feedback e padrões visuais**. Se essa comunicação falha, o usuário se perde."
          }
        ]
      },
      {
        id: "avaliacao",
        titulo: "📊 Como Avaliar a Comunicação",
        blocos: [
          {
            tipo: "topico",
            titulo: "🔹 Método MAC",
            lista: [
              "**Etapa 1**: Preparação do teste",
              "**Etapa 2**: Coleta de dados",
              "**Etapa 3**: Análise — encontrar onde a comunicação está quebrando"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Inspeção Semiótica — 3 tipos de signos",
            lista: [
              "**Metalinguísticos** → textos de ajuda, tutoriais, instruções",
              "**Estáticos** → ícones, layout, cores, elementos fixos",
              "**Dinâmicos** → animações, feedbacks, mudanças de tela"
            ]
          }
        ]
      }
    ]
  },

  /* índice 2 → Aula 3 */
  {
    aula: "Aula 3 — Alfabeto Visual",
    ideia_central: "Assim como aprendemos letras para ler um texto, existe um alfabeto para ler imagens — dominar seus elementos é essencial para criar interfaces eficientes.",
    secoes: [
      {
        id: "alfabetismo",
        titulo: "👁️ Alfabetismo Visual",
        blocos: [
          {
            tipo: "topico",
            titulo: "🔹 O que é Alfabetismo Visual?",
            texto: "Quem domina o alfabeto visual consegue **entender o que uma imagem comunica**, criar composições com intenção e saber combinar elementos. É menos rígido que o verbal e depende mais de contexto e cultura.",
          },
          {
            tipo: "topico",
            titulo: "🔹 3 Tipos de Mensagem Visual",
            lista: [
              "**Representacional** → próxima da realidade, fácil de reconhecer. Ex: fotografia",
              "**Abstrato** → simplificação com foco em formas e cores, mais subjetivo",
              "**Simbólico** → redução ao mínimo. Ex: ícones de interface. Fácil de memorizar"
            ]
          },
          {
            tipo: "destaque",
            texto: "📌 Esses três tipos podem se misturar dependendo do contexto."
          }
        ]
      },
      {
        id: "elementos",
        titulo: "🧱 Os 10 Elementos Básicos",
        blocos: [
          {
            tipo: "topico",
            titulo: "🔹 Elementos estruturais",
            lista: [
              "**Ponto** → menor unidade visual, direciona o olhar. Em conjunto cria textura.",
              "**Linha** → transmite energia; diagonal passa tensão e instabilidade",
              "**Forma** → Círculo (proteção) · Quadrado (estabilidade) · Triângulo (tensão)",
              "**Direção** → Horizontal/vertical (equilíbrio) · Diagonal (instabilidade) · Curva (suavidade)"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Elementos expressivos",
            lista: [
              "**Tom** → variação entre luz e sombra, cria profundidade",
              "**Cor** → grande impacto emocional, depende de cultura e contexto",
              "**Textura** → enriquece superfícies e cria contraste",
              "**Escala** → define peso visual e hierarquia entre elementos",
              "**Dimensão** → cria ilusão de profundidade em plano 2D",
              "**Movimento** → ilusão de dinamismo por repetição, desfoque ou animação"
            ]
          },
          {
            tipo: "destaque",
            texto: "📌 Interfaces bem feitas usam esses elementos de forma **intencional e coerente** — estética e usabilidade precisam andar juntas."
          }
        ]
      }
    ]
  },

  /* índice 3 → Aula 4 */
  {
    aula: "Aula 4 — Psicologia Cognitiva e Gestalt da Forma",
    ideia_central: "Para criar uma boa interface, é preciso entender como o ser humano percebe, memoriza e toma decisões.",
    secoes: [
      {
        id: "psicologia",
        titulo: "🧠 Psicologia Cognitiva",
        blocos: [
          {
            tipo: "topico",
            titulo: "🔹 O que é Psicologia Cognitiva?",
            lista: [
              "**Psicologia Cognitiva** → estuda os processos mentais — atenção, memória, percepção, raciocínio e tomada de decisão",
              "**Gestalt** → estuda como o cérebro organiza o que vê"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Atenção — 4 tipos",
            lista: [
              "**Seletiva** → foca em um estímulo e ignora o resto",
              "**Vigilância** → mantém atenção por longos períodos",
              "**Sondagem** → busca ativa por informações",
              "**Dividida** → realiza mais de uma tarefa ao mesmo tempo",
              "📌 Excesso de informação na tela **reduz o foco** do usuário"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Memória e Processo de Ação",
            lista: [
              "**Curta duração** → temporária e limitada · **Longa duração** → permanente",
              "A interface deve evitar exigir que o usuário memorize muita coisa. Quanto menos esforço mental, melhor.",
              "**3 etapas da ação**: Análise da situação → Planejamento → Controle",
              "A interface precisa facilitar esse fluxo, não atrapalhar."
            ]
          }
        ]
      },
      {
        id: "gestalt",
        titulo: "🔷 Gestalt da Forma",
        blocos: [
          {
            tipo: "topico",
            titulo: "🔹 Premissa",
            texto: "**O todo é maior que a soma das partes.** O cérebro organiza automaticamente o que vê, buscando formas simples e estáveis."
          },
          {
            tipo: "topico",
            titulo: "🔹 Princípios fundamentais",
            lista: [
              "**Pregnância** → o cérebro prefere formas simples e organizadas",
              "**Figura-Fundo** → separa automaticamente o elemento principal do plano de fundo",
              "**Constância Perceptiva** → reconhece objetos mesmo com mudanças visuais"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Os 8 Pilares aplicados em interfaces",
            lista: [
              "**Unidades** → elementos percebidos como partes organizadas",
              "**Unificação** → agrupamento que gera sensação de conjunto",
              "**Continuidade** → o olhar segue linhas e direções naturalmente",
              "**Proximidade** → elementos próximos parecem relacionados",
              "**Semelhança** → elementos parecidos são agrupados mentalmente",
              "**Segregação** → diferenciação clara entre figura e fundo",
              "**Fechamento** → tendência a completar formas incompletas",
              "**Pregnância da Forma** → preferência por formas simples e limpas"
            ]
          }
        ]
      }
    ]
  },

  /* índice 4 → Aula 5 */
  {
    aula: "Aula 5 — O Elemento Cor",
    ideia_central: "A cor comunica antes mesmo do usuário ler qualquer texto — mas precisa ser escolhida com critério.",
    secoes: [
      {
        id: "psicologia-cor",
        titulo: "🎨 Psicologia das Cores",
        blocos: [
          {
            tipo: "topico",
            titulo: "🔹 Fatores para escolha de cor",
            lista: [
              "**Fisiológicos** → como o olho percebe a cor",
              "**Psicológicos** → impacto emocional que causa",
              "**Culturais** → o mesmo vermelho pode ter significados opostos em culturas diferentes",
              "**Público-alvo** e **objetivo do projeto**"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Cores quentes vs. frias",
            lista: [
              "**Cores quentes** (vermelho, amarelo) → estimulam, agitam, chamam atenção",
              "**Cores frias** (azul, verde, violeta) → acalmam e relaxam",
              "O significado também muda por cultura. Ex: o branco representa pureza no ocidente, mas luto em algumas culturas orientais"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Significados principais",
            lista: [
              "**Azul** → paz, confiança, serenidade",
              "**Amarelo** → alerta, energia, esperança",
              "**Vermelho** → paixão, perigo, ação",
              "**Verde** → saúde, equilíbrio, natureza",
              "**Laranja** → alegria, criatividade, entusiasmo",
              "**Violeta** → calma, dignidade, espiritualidade"
            ]
          }
        ]
      },
      {
        id: "esquema",
        titulo: "🖌️ Como Montar um Esquema de Cores",
        blocos: [
          {
            tipo: "topico",
            titulo: "📌 Passos para montar o esquema",
            lista: [
              "**1º passo** → escolher a cor principal — vem da marca ou do objetivo do projeto",
              "**2º passo** → aplicar a Regra 60-30-10: 60% cor dominante (fundo/base) · 30% cor secundária (textos/elementos) · 10% cor de destaque (detalhes)",
              "**3º passo** → definir o esquema com base no círculo cromático: Análogas (harmonia) · Complementares (contraste) · Tríade (equilíbrio vibrante) · Monocromático (variações de uma cor)"
            ]
          },
          {
            tipo: "destaque",
            texto: "📌 **RGB** para telas digitais · **CMYK** para impressão"
          },
          {
            tipo: "topico",
            titulo: "✅ Boas práticas",
            lista: [
              "Nunca escolher cor só pelo visual",
              "Pensar no público e na emoção que quer transmitir",
              "Usar contraste para destacar e harmonia para conforto",
              "Testar combinações antes de aplicar"
            ]
          }
        ]
      }
    ]
  },

  /* índice 5 → Aula 6 */
  {
    aula: "Aula 6 — Tipografia",
    ideia_central: "A tipografia impacta diretamente a experiência do usuário — uma boa escolha facilita a leitura, uma escolha errada cansa e confunde.",
    secoes: [
      {
        id: "tipos",
        titulo: "🔤 Tipos e Alinhamento",
        blocos: [
          {
            tipo: "topico",
            titulo: "🔹 Serifadas vs. Sem Serifa",
            lista: [
              "**Serifadas** → traços nas extremidades · melhores para textos longos · transmitem tradição",
              "**Sans Serif** → sem traços · melhores para telas digitais · transmitem modernidade"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Alinhamento",
            lista: [
              "**À esquerda** → mais natural para leitura, **mais recomendado**",
              "**Justificado** → pode criar espaços irregulares e dificultar leitura na web",
              "**Centralizado** → ótimo para títulos e frases curtas, evitar em textos longos"
            ]
          }
        ]
      },
      {
        id: "tamanho",
        titulo: "📐 Tamanho, Linha e Peso",
        blocos: [
          {
            tipo: "topico",
            titulo: "🔹 Tamanho da fonte",
            lista: [
              "**Desktop** → padrão 16px · **Mobile** → pode começar em 12px",
              "O tamanho ideal varia conforme a **faixa etária** do público",
              "Usar **EM** para responsividade · **px** é mais preciso mas menos flexível"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Caracteres por linha",
            lista: [
              "**Desktop** → 50 a 80 caracteres · **Mobile** → 30 a 35 caracteres",
              "Linhas muito longas cansam · Linhas muito curtas quebram o ritmo de leitura"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Peso da fonte",
            lista: [
              "**Light** → fino · **Regular** → normal · **Bold** → negrito · **Black** → muito pesado",
              "Cada variação transmite uma sensação diferente"
            ]
          },
          {
            tipo: "destaque",
            texto: "📌 A escolha da tipografia deve sempre considerar o objetivo do projeto, o público-alvo, o dispositivo e o tipo de conteúdo. O mesmo texto pode ter experiências totalmente diferentes dependendo da fonte usada."
          }
        ]
      }
    ]
  },

  /* índice 6 → Aula 7 */
  {
    aula: "Aula 7 — A Imagem",
    ideia_central: "A imagem não é decoração — é um signo visual com poder simbólico e emocional que, junto ao texto, reforça o significado da mensagem.",
    secoes: [
      {
        id: "signos",
        titulo: "🔣 Tipos de Signos (Semiótica)",
        blocos: [
          {
            tipo: "topico",
            titulo: "🔹 Os 3 tipos",
            texto: "A imagem não é só decoração — ela é um signo visual com poder simbólico e emocional. Ela substitui experiências reais na mente de quem vê e, em conjunto com o texto, reforça o significado da mensagem.",
            lista: [
              "**Ícone** → representa por semelhança. Ex: ícone da Torre Eiffel = Paris",
              "**Índice** → representa por causa ou evidência. Ex: fumaça → fogo",
              "**Símbolo** → representa por convenção cultural. Ex: pomba branca = paz"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Composição e significado",
            texto: "A posição da imagem muda o que ela comunica:",
            lista: [
              "**Central** → sensação neutra · **Deslocada** → sensação dinâmica",
              "**Pequena** → isolamento · **Cortada** → impacto e força"
            ]
          }
        ]
      },
      {
        id: "formatos",
        titulo: "🖼️ Tipos e Formatos",
        blocos: [
          {
            tipo: "topico",
            titulo: "🔹 Bitmap vs. Vetor",
            lista: [
              "**Bitmap** → baseado em pixels · usado em fotografias",
              "**Vetor** → fórmulas matemáticas · ilustrações · redimensiona sem perda de qualidade"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Fotografia vs. Ilustração",
            lista: [
              "**Fotografia** → realista, direta, mais credibilidade",
              "**Ilustração** → criativa, interpretativa, estimula a imaginação"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Formatos principais",
            lista: [
              "**PNG** → alta qualidade, suporta transparência",
              "**JPEG** → boa compressão, perde qualidade",
              "**GIF** → compacto, para gráficos simples",
              "**TIFF** → alta qualidade, usado em impressão"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Relação imagem + texto",
            lista: [
              "**Redundância** → texto principal, imagem complementa",
              "**Informatividade** → imagem principal (ex: infográficos)",
              "**Complexidade** → texto e imagem com mesmo peso",
              "**Ancoragem** → texto direciona a interpretação da imagem",
              "**Relais** → texto e imagem se completam mutuamente"
            ]
          },
          {
            tipo: "destaque",
            texto: "📌 No meio digital, a imagem precisa ser otimizada — formato certo, tamanho adequado e qualidade suficiente — para não prejudicar o carregamento e a experiência do usuário."
          }
        ]
      }
    ]
  },

  /* índice 7 → Aula 8 */
  {
    aula: "Aula 8 — O Layout",
    ideia_central: "Layout é a organização hierárquica dos elementos visuais — integra cores, tipografia e imagens para garantir legibilidade, usabilidade e comunicação eficiente.",
    secoes: [
      {
        id: "contraste",
        titulo: "⚖️ Contraste e Harmonia",
        blocos: [
          {
            tipo: "topico",
            titulo: "🔹 Os três estados",
            lista: [
              "**Harmonia** → gera equilíbrio e estabilidade",
              "**Contraste** → gera destaque e dinamismo",
              "**Ambiguidade** → nem um nem outro → ⚠️ **deve ser evitada**"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Tipos de contraste",
            lista: [
              "**Tom** → claro vs. escuro · **Cor** → diferença de cores",
              "**Forma** → regular vs. irregular · **Escala** → grande vs. pequeno"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Técnicas visuais — pares opostos",
            lista: [
              "**Equilíbrio × Instabilidade** → estável vs tensão visual",
              "**Simetria × Assimetria** → espelho vs diferentes mas equilibrados",
              "**Regularidade × Irregularidade** → padrão constante vs surpresa visual",
              "**Simplicidade × Complexidade** → fácil percepção vs muitos elementos",
              "**Unidade × Fragmentação** → percepção do todo vs partes separadas",
              "**Economia × Profusão** → poucos elementos vs riqueza visual",
              "**Minimalismo × Exagero** → menos é mais vs amplificação visual"
            ]
          }
        ]
      },
      {
        id: "pilares",
        titulo: "🏛️ Pilares e Grid",
        blocos: [
          {
            tipo: "topico",
            titulo: "🔹 Os 3 pilares do layout em interfaces",
            lista: [
              "**Navegação** → regra dos 3 cliques: o usuário não deve precisar de mais de 3 cliques para encontrar qualquer informação",
              "**Lógica visual** → organização intuitiva com princípios visuais",
              "**Templates** → estrutura padrão que mantém consistência"
            ]
          },
          {
            tipo: "topico",
            titulo: "🔹 Grid — a grade que organiza tudo",
            lista: [
              "O grid é uma estrutura de linhas e colunas que organiza os elementos da interface. Não limita a criatividade, serve como guia.",
              "Grid mais comum: **12 colunas** (permite várias divisões)",
              "Para responsividade usar medidas em **porcentagem (%)**",
              "**Fórmula**: objeto ÷ largura total = % · Ex: 300px ÷ 960px = 31,25%"
            ]
          },
          {
            tipo: "destaque",
            texto: "📌 No padrão ocidental o olhar segue **esquerda → direita · cima → baixo** — elementos importantes devem estar no topo ou à esquerda da tela."
          }
        ]
      }
    ]
  }

]

};
