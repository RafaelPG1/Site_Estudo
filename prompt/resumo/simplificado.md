Você receberá um conteúdo de estudo (resumo, aula, PDF ou texto).
Sua tarefa é transformar esse conteúdo EXCLUSIVAMENTE na estrutura `simplificado[]`.

⚠️ REGRAS ABSOLUTAS:
- NÃO gerar aulas[]
- NÃO escrever nada fora da estrutura
- NÃO adicionar comentários ou explicações
- Retornar SOMENTE o bloco simplificado: [...]

═══════════════════ ESTRUTURA OBRIGATÓRIA ═══════════════════

simplificado: [
  {
    aula: "Aula X — Título",
    ideia_central: "Uma frase que resume o conceito mais importante da aula.",
    secoes: [
      {
        id: "id-unico",
        titulo: "📌 Nome da Seção",
        blocos: [
          {
            tipo: "topico",
            titulo: "🔹 Subtítulo do tópico",
            lista: [
              "**Termo** → explicação curta",
              "**Conceito** → definição direta"
            ]
          },
          {
            tipo: "lista",
            itens: [
              "Ponto direto sem subtítulo",
              "`codigo` quando necessário"
            ]
          }
        ]
      }
    ]
  }
]

═══════════════════ REGRAS DE CONTEÚDO ═══════════════════

- Cada aula do conteúdo recebido vira UMA entrada no array
- Criar entre 1 e 3 seções por aula conforme a densidade do conteúdo
- Cada item deve ser UMA frase curta — nunca parágrafos
- Usar **negrito** para termos-chave e `backtick` para código/siglas
- Usar tipo "topico" quando o bloco tiver um subtítulo identificável
- Usar tipo "lista" para enumerações sem subtítulo
- Preservar TODOS os conceitos importantes — não sacrificar conteúdo por brevidade
- O campo ideia_central deve capturar a essência da aula em 1 frase impactante

═══════════════════ SAÍDA FINAL ═══════════════════

Retorne EXATAMENTE:
simplificado: [...]


Adicione comentários na saída seguindo estas regras:

* No topo do conteúdo, adicionar:
  // aula: [nome da aula]

* Para cada item gerado (independente da estrutura), adicionar um comentário imediatamente antes contendo:
  // [número] - [assunto resumido]

Regras:

* O número deve ser sequencial (1, 2, 3...)
* O assunto resumido deve ter de 1 a 3 palavras
* O assunto deve representar o tema principal do item
* NÃO alterar a estrutura original solicitada
* NÃO transformar o formato (JSON, array, objeto, etc.)
* Apenas inserir os comentários acima de cada item

Exemplo genérico:

// aula: exemplo

// 1 - conceito chave
{ ... },

// 2 - definição
{ ... }

QUERO SOMENTE DIGITADO, NADA DE CRIAR UM QUIZ INTERATIVO SOMENTE TEXTO DIGITADO. nada de clipboard