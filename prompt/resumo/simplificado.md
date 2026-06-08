<!-- simplificado -->
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

* Preservar imagens relevantes existentes no conteúdo original.
* NÃO inventar imagens.
* NÃO criar imagens novas.
* NÃO gerar descrições substituindo imagens existentes.
* Sempre que o conteúdo original possuir metadados da imagem, preservar exatamente os valores informados.

Formato obrigatório:

{
tipo: "imagem",
src: "arquivo_original.ext",
pasta: "caminho/original",
num: "numero_original",
alt: "texto_alternativo_original"
}

Regras:

* O campo `src` é obrigatório.
* O campo `pasta` é obrigatório.
* O campo `num` é obrigatório.
* O campo `alt` é obrigatório.
* Nunca remover esses campos.
* Nunca renomear arquivos.
* Nunca alterar caminhos.
* Nunca alterar numeração.
* Nunca resumir ou reescrever o valor de `alt`.
* Utilizar exatamente os dados existentes no conteúdo recebido.
* Se uma imagem relevante existir no conteúdo original, ela deve ser preservada no simplificado.
* Se a imagem não possuir os metadados necessários, não invente valores.
* Nunca gerar URLs.
* Nunca gerar markdown de imagem.
* Nunca converter imagem em texto quando os metadados já estiverem disponíveis.

Exemplo:

{
tipo: "imagem",
src: "fig_create_database_postgres.png",
pasta: "imagens_banco_dados/aula_09",
num: "1",
alt: "Criacao de banco de dados no PostgreSQL utilizando DDL"
}

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
