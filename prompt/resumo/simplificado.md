Você receberá um conteúdo de estudo (resumo, aula, PDF ou texto).

Sua tarefa é transformar esse conteúdo EXCLUSIVAMENTE na estrutura `simplificado[]`.

⚠️ REGRAS ABSOLUTAS

* NÃO gerar aulas[]
* NÃO gerar questões
* NÃO gerar exercícios
* NÃO gerar exemplos extras que não existam no conteúdo
* NÃO escrever introduções
* NÃO escrever conclusões
* NÃO adicionar comentários fora dos comentários solicitados
* NÃO adicionar explicações sobre o que foi feito
* NÃO alterar a estrutura definida
* NÃO retornar markdown fora da estrutura
* NÃO criar quiz interativo
* NÃO criar clipboard
* NÃO criar blocos extras
* Retornar SOMENTE o bloco simplificado: [...]

═══════════════════ ESTRUTURA OBRIGATÓRIA ═══════════════════

simplificado: [
{
aula: "Aula X — Título",

```
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
          "Ponto direto",
          "Outro ponto importante",
          "`codigo` quando necessário"
        ]
      },

      {
        tipo: "imagem",

        titulo: "Nome da figura ou tema principal",

        descricao: "Resumo curto do que a imagem demonstra"
      }

    ]
  }
]
```

}
]

═══════════════════ REGRAS DE CONTEÚDO ═══════════════════

* Cada aula do conteúdo recebido vira UMA entrada no array.
* Cada aula deve preservar todos os conceitos importantes.
* O objetivo é criar um resumo condensado sem perder informação relevante.
* Nunca transformar conceitos importantes em explicações longas.
* Cada item deve ser uma frase curta.
* Nunca escrever parágrafos.
* Priorizar definições, conceitos, fórmulas, métodos, processos e relações importantes.
* Remover redundâncias.
* Unificar explicações repetidas.
* Preservar siglas, nomes técnicos e terminologia original.
* Usar **negrito** para termos-chave.
* Usar `backtick` para códigos, comandos, protocolos, siglas ou tecnologias quando fizer sentido.
* O campo ideia_central deve capturar a essência da aula em apenas uma frase.
* O conteúdo deve ser suficiente para revisão rápida antes de provas.

═══════════════════ ORGANIZAÇÃO DAS SEÇÕES ═══════════════════

* Criar entre 1 e 3 seções por aula.
* Agrupar conteúdos semelhantes na mesma seção.
* Não criar seções vazias.
* Não repetir conceitos em múltiplas seções.
* Cada seção deve representar um agrupamento lógico do conteúdo.

═══════════════════ REGRAS DOS BLOCOS ═══════════════════

Bloco "topico":

* Utilizar quando existir um subtítulo ou assunto claramente identificável.
* Cada item da lista deve conter apenas uma informação relevante.
* Formato obrigatório:

{
tipo: "topico",
titulo: "🔹 Nome",
lista: [...]
}

Bloco "lista":

* Utilizar para enumerações ou informações sem subtítulo claro.
* Cada item deve conter apenas um conceito ou informação.
* Formato obrigatório:

{
tipo: "lista",
itens: [...]
}

═══════════════════ IMAGENS E DIAGRAMAS ═══════════════════

* Imagens são opcionais.
* NÃO criar seções exclusivas para imagens.
* NÃO descrever imagens decorativas.
* NÃO descrever imagens repetidas.
* NÃO descrever imagens sem valor didático.

Incluir imagem apenas quando representar:

* diagramas;
* fluxogramas;
* arquiteturas;
* mapas mentais;
* gráficos importantes;
* tabelas comparativas;
* esquemas técnicos;
* processos visuais relevantes.

Formato obrigatório:

{
tipo: "imagem",
titulo: "Nome da figura ou tema principal",
descricao: "Resumo curto do que a imagem demonstra"
}

Regras adicionais:

* Máximo de 1 imagem por seção.
* A descrição deve possuir apenas uma frase curta.
* Se a informação puder ser resumida facilmente em texto, não gerar bloco de imagem.
* Em caso de dúvida, priorizar texto.
* Nunca gerar URLs.
* Nunca gerar markdown de imagem.
* Nunca copiar imagens.

═══════════════════ COMENTÁRIOS OBRIGATÓRIOS ═══════════════════

No início de cada aula adicionar:

// aula: [nome da aula]

Antes de cada item principal gerado adicionar:

// [número] - [assunto resumido]

Regras:

* Numeração sequencial.
* Começar em 1 para cada aula.
* O assunto resumido deve possuir entre 1 e 3 palavras.
* O assunto deve representar o tema principal do item.
* Não alterar a estrutura.
* Apenas inserir os comentários acima dos itens.

Exemplo:

// aula: Redes de Computadores

// 1 - modelo osi
{
...
},

// 2 - protocolo tcp
{
...
}

═══════════════════ QUALIDADE FINAL ═══════════════════

Antes de finalizar:

* Verificar se todos os conceitos importantes foram preservados.
* Verificar se não existem parágrafos longos.
* Verificar se não existem repetições.
* Verificar se a estrutura está correta.
* Verificar se não existe conteúdo fora do bloco simplificado.
* Verificar se nenhuma aula foi omitida.
* Verificar se as imagens incluídas são realmente necessárias.

═══════════════════ SAÍDA FINAL ═══════════════════

Retorne EXATAMENTE:

simplificado: [...]
