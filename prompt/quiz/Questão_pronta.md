Você receberá como entrada um conjunto de QUESTÕES JÁ PRONTAS.

Sua tarefa NÃO é criar, reescrever, melhorar ou gerar novas questões.

Sua única função é:

**PEGAR AS QUESTÕES FORNECIDAS E TRANSFORMÁ-LAS EM UM ARRAY JAVASCRIPT VÁLIDO, SEGUINDO EXATAMENTE A ESTRUTURA ABAIXO.**

---

# 🎯 OBJETIVO

Converter as questões existentes para um formato `.js` organizado e padronizado.

⚠️ REGRA PRINCIPAL:

**NÃO ALTERE O CONTEÚDO DAS QUESTÕES.**

Preserve exatamente, sempre que possível:

* texto
* pergunta
* alternativas
* resposta correta
* feedback
* código
* tipo
* aula
* informações conceituais

Não invente informações.

Não crie novas questões.

Não remova questões.

Não altere o significado das questões.

Não melhore a escrita.

Não resuma.

Não transforme uma questão em outra.

Apenas faça a conversão/formatação para JavaScript.

---

# 📚 ESTRUTURA OBRIGATÓRIA

Cada questão deve ser convertida para este formato:

```javascript
{
  aula: "Nome da aula",
  tipo: "Explicativa",
  texto: "Texto da questão.",
  question: "Pergunta da questão.",
  code: ``,
  options: [
    "Alternativa A",
    "Alternativa B",
    "Alternativa C",
    "Alternativa D"
  ],
  answer: 0,
  feedback: "Feedback da questão."
}
```

---

# 🏷️ CAMPO `aula`

Todas as questões pertencentes à mesma aula devem possuir:

```javascript
aula: "Nome da aula"
```

Use o nome da aula fornecido no conteúdo de entrada.

Se o nome da aula estiver claramente identificado, preserve-o.

Se houver mais de uma aula no conteúdo, mantenha a aula correspondente em cada questão.

NÃO invente nomes de aulas.

---

# 🏷️ CAMPO `tipo`

Preserve o tipo original da questão quando ele estiver disponível.

Os valores permitidos são:

```javascript
"Explicativa"
"Contextualizada"
"Aplicação"
```

Se o tipo já estiver informado, NÃO altere.

Se não estiver informado, tente identificar o tipo com base na própria questão, sem alterar o conteúdo.

---

# 📝 CAMPO `texto`

Coloque no campo `texto` o texto explicativo existente na questão.

NÃO crie um novo texto.

NÃO reescreva.

NÃO resuma.

Apenas adapte para uma string JavaScript válida, caso seja necessário escapar aspas ou quebras de linha.

---

# ❓ CAMPO `question`

Coloque no campo `question` exatamente a pergunta existente.

NÃO modifique a pergunta.

---

# 💻 CAMPO `code`

Se a questão possuir código:

```javascript
code: `código aqui`
```

Preserve o código exatamente como fornecido.

Se a questão não possuir código, use:

```javascript
code: ``
```

NÃO invente código.

NÃO adicione código apenas para preencher o campo.

---

# 🔘 CAMPO `options`

Cada questão deve possuir suas alternativas dentro de:

```javascript
options: [
  "Alternativa A",
  "Alternativa B",
  "Alternativa C",
  "Alternativa D"
]
```

Preserve as alternativas fornecidas.

NÃO altere a ordem das alternativas.

NÃO reescreva as alternativas.

NÃO crie alternativas novas.

NÃO remova alternativas.

---

# ✅ CAMPO `answer`

O campo `answer` deve indicar o índice da alternativa correta.

Use índice começando em `0`:

```text
A = 0
B = 1
C = 2
D = 3
```

Exemplo:

Se a alternativa correta for B:

```javascript
answer: 1
```

Se a alternativa correta for D:

```javascript
answer: 3
```

Preserve a resposta correta da questão original.

---

# 💬 CAMPO `feedback`

Coloque no campo `feedback` o feedback já existente.

NÃO crie um novo feedback.

NÃO reescreva.

NÃO resuma.

Se não existir feedback na questão original, use:

```javascript
feedback: ""
```

---

# 🧩 SISTEMA DE CHIPS SEMÂNTICOS

Se as questões fornecidas já possuírem chips semânticos, preserve-os exatamente.

Formato:

```text
==categoria==TERMO==
```

Categorias disponíveis:

| Categoria    | Equivalente | Quando usar            |
| ------------ | ----------- | ---------------------- |
| `==ddl==`    | `==def==`   | Definições e conceitos |
| `==dml==`    | `==proc==`  | Processos e ações      |
| `==key==`    | `==rule==`  | Regras e princípios    |
| `==type==`   | `==term==`  | Tipos e classificações |
| `==danger==` | `==warn==`  | Erros e armadilhas     |
| `==mark==`   | `==mark==`  | Destaque geral         |

⚠️ NÃO adicione chips que não existam nas questões originais.

⚠️ NÃO remova chips existentes.

⚠️ NÃO altere chips existentes.

⚠️ NÃO coloque chips nas alternativas.

---

# 🧾 COMENTÁRIOS OBRIGATÓRIOS

No topo do arquivo, adicione:

```javascript
// aula: [nome da aula]
```

Para cada questão, coloque imediatamente antes do objeto:

```javascript
// 1 - conceito chave
```

O número deve ser sequencial:

```text
// 1 - ...
// 2 - ...
// 3 - ...
// 4 - ...
```

O assunto resumido deve possuir de 1 a 3 palavras e representar o tema principal da questão.

Exemplo:

```javascript
// aula: Introdução a Banco de Dados

// 1 - banco dados
{
  ...
},

// 2 - chave primária
{
  ...
},

// 3 - relacionamentos
{
  ...
}
```

Os comentários são apenas comentários JavaScript e NÃO fazem parte do conteúdo das questões.

---

# 📦 FORMATO FINAL OBRIGATÓRIO

A saída deve ser SOMENTE um conteúdo JavaScript válido:

```javascript
// aula: Nome da aula

[
  // 1 - primeiro assunto
  {
    aula: "Nome da aula",
    tipo: "Explicativa",
    texto: "Texto existente.",
    question: "Pergunta existente.",
    code: ``,
    options: [
      "Alternativa A",
      "Alternativa B",
      "Alternativa C",
      "Alternativa D"
    ],
    answer: 0,
    feedback: "Feedback existente."
  },

  // 2 - segundo assunto
  {
    aula: "Nome da aula",
    tipo: "Aplicação",
    texto: "Texto existente.",
    question: "Pergunta existente.",
    code: ``,
    options: [
      "Alternativa A",
      "Alternativa B",
      "Alternativa C",
      "Alternativa D"
    ],
    answer: 2,
    feedback: "Feedback existente."
  }
]
```

---

# 🚨 REGRAS CRÍTICAS

1. NÃO criar questões.
2. NÃO gerar questões adicionais.
3. NÃO excluir questões existentes.
4. NÃO alterar o conteúdo das questões.
5. NÃO corrigir português.
6. NÃO melhorar a escrita.
7. NÃO resumir.
8. NÃO mudar alternativas.
9. NÃO mudar a ordem das alternativas.
10. NÃO mudar a resposta correta.
11. NÃO inventar feedback.
12. NÃO inventar código.
13. NÃO inventar informações.
14. NÃO criar quiz interativo.
15. NÃO criar HTML.
16. NÃO criar CSS.
17. NÃO criar interface.
18. NÃO criar botões.
19. NÃO criar clipboard.
20. NÃO criar sistema de copiar/colar.
21. NÃO criar arquivos adicionais.
22. NÃO adicionar explicações fora do JavaScript.
23. NÃO usar Markdown fora do bloco de código.
24. A saída deve conter SOMENTE o conteúdo JavaScript solicitado.

---

# 🔒 PRESERVAÇÃO DO CONTEÚDO

A prioridade máxima é:

**CONTEÚDO ORIGINAL > FORMATAÇÃO**

Se houver alguma informação que não se encaixe perfeitamente na estrutura, NÃO descarte a informação.

Faça a adaptação mínima necessária para manter o conteúdo dentro do objeto JavaScript.

O resultado deve continuar representando exatamente as questões recebidas.

---

# ✅ RESULTADO ESPERADO

Entrada:

QUESTÕES JÁ PRONTAS

↓

Processamento:

APENAS ORGANIZAR E CONVERTER

↓

Saída:

ARRAY JAVASCRIPT VÁLIDO

↓

Sem:

❌ novas questões
❌ alterações de conteúdo
❌ quiz interativo
❌ HTML
❌ interface
❌ clipboard
❌ explicações adicionais

**ENTREGUE SOMENTE O JAVASCRIPT FINAL.**
