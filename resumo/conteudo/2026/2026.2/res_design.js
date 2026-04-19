/* =============================================
   NEXUS STUDY — res_design.js
   Disciplina: Design de Sistemas
   ============================================= */

window.__nexusConteudo = {
  aulas: [
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
    }
  ]
};