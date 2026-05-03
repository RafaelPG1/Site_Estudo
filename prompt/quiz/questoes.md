
Você receberá um conteúdo como entrada (texto, resumo, aula ou PDF) de QUALQUER ÁREA do conhecimento.

Sua tarefa é gerar 10 questões de FIXAÇÃO EXPLICATIVA (modo aula), seguindo rigorosamente os padrões abaixo.

---

🎯 OBJETIVO

Criar questões que ENSINEM antes de cobrar, ajudando o aluno a aprender durante a leitura.

Cada questão deve:

✔ Explicar brevemente o conceito  
✔ Reforçar o conteúdo  
✔ Aplicar com uma pergunta clara  

⚠️ IMPORTANTE:

❌ NÃO usar estilo ENADE  
❌ NÃO fazer perguntas secas  
✔ Sempre ensinar antes de perguntar  

---

📚 ESTRUTURA OBRIGATÓRIA

Cada questão deve conter:

1. texto (OBRIGATÓRIO — parte mais importante)

- Deve ser um mini conteúdo explicativo
- Estilo: aula / livro didático
- Linguagem simples e natural
- Tamanho ideal: 2 a 6 linhas
- Deve ENSINAR algo antes da pergunta

✔ O texto deve:

- explicar um conceito
- ou esclarecer uma ideia
- ou apresentar uma situação simples

❌ Evitar:

- texto vazio
- frase genérica sem conteúdo
- copiar exatamente o conteúdo original

---

2. question

- Pergunta clara e direta
- Sempre baseada no texto

---

3. options

- 4 alternativas
- Apenas 1 correta
- Todas plausíveis

---

4. feedback

- Explicação breve (1 a 3 linhas)
- Reforça o conceito principal

---

🏷️ TIPOS DE QUESTÃO (OBRIGATÓRIO VARIAR)

Cada questão deve possuir o campo `tipo`.

Use exatamente estes valores de string:

"Explicativa"     → Conceito explicado antes da pergunta. Mais didática e direta.
"Contextualizada" → Explicação mais densa. Pode envolver mais de um conceito.
"Aplicação"       → Pequeno cenário real. Foco em uso prático do conhecimento.

⚠️ REGRAS:

✔ Misturar os três tipos  
✔ Mínimo de 3 questões por tipo  
✔ Não repetir padrão  

---

🧩 ESTILO DAS QUESTÕES (MODO LUZIA)

As questões devem seguir um fluxo natural de aprendizado:

✔ Primeiro explica  
✔ Depois pergunta  

Cada questão deve parecer um pequeno trecho de aula.

⚠️ IMPORTANTE:

❌ NÃO usar rótulos visíveis no texto (tipo "Questão contextualizada")  
✔ O tipo é apenas no campo `tipo`  

---

📌 REGRA CENTRAL

Toda questão deve seguir:

EXPLICA → PERGUNTA

⚠️ Se a pergunta puder ser respondida sem ler o texto, a questão está errada.

---

⚖️ DISTRIBUIÇÃO

Total: 10 questões

✔ Mínimo de 3 questões por tipo  
✔ Misturar tamanhos de texto  
✔ Misturar níveis de explicação  
✔ Evitar repetição  

---

🧠 NÍVEL

- Fácil a médio  
- Foco em aprendizado  

---

⚠️ REGRAS IMPORTANTES

✔ Linguagem natural (como professor explicando)  
✔ Não copiar frases do conteúdo original  
✔ Alternativas equilibradas  
✔ Não exigir conhecimento externo  

---

🧩 SISTEMA DE CHIPS SEMÂNTICOS

Formato:

==categoria==TERMO==

📊 Categorias disponíveis:

| Categoria  | Equivalente | Quando usar               |
|------------|-------------|---------------------------|
| ==ddl==    | ==def==     | Definições e conceitos    |
| ==dml==    | ==proc==    | Processos e ações         |
| ==key==    | ==rule==    | Regras e princípios       |
| ==type==   | ==term==    | Tipos e classificações    |
| ==danger== | ==warn==    | Erros e armadilhas        |
| ==mark==   | ==mark==    | Destaque geral            |

⚠️ REGRAS CRÍTICAS:

✔ Use apenas UM padrão por questão:
  - Conteúdo técnico → ddl, dml, key, type, danger  
  - Conteúdo conceitual → def, proc, rule, term, warn  

🚫 Nunca misturar padrões na mesma questão  

⚠️ LIMITE DE USO:

- Opcional  
- Máximo 2 chips no TOTAL por questão (texto + feedback somados)  
- Não usar nas alternativas  

---

📦 FORMATO DE SAÍDA (OBRIGATÓRIO)

Gerar diretamente em JavaScript válido:

```javascript
[
  {
    aula; "digite a aula viu, cada aula por favor"
    tipo: "Explicativa",

    texto: "Explicação didática do conceito (modo aula).",

    question: "Pergunta baseada no texto.",

    code: `// usar apenas se necessário`,

    options: [
      "Alternativa A",
      "Alternativa B",
      "Alternativa C",
      "Alternativa D"
    ],

    answer: 0,

    feedback: "Explicação breve reforçando o conceito."
  }
]
```


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