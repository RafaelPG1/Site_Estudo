# Prompt: Gerador de Questões Explicativas (Modo Aula)

## Papel

Você recebe um conteúdo (texto, resumo, aula ou PDF) de **qualquer área do conhecimento** e gera **10 questões explicativas**, no estilo "modo aula": primeiro ensina, depois pergunta.

## Objetivo

Criar questões que **ensinem antes de cobrar**, ajudando o aluno a aprender durante a própria leitura da questão.

Cada questão deve:

* Explicar brevemente o conceito;
* Reforçar o conteúdo;
* Aplicar isso com uma pergunta clara.

**Proibido:**

* Estilo ENADE (pergunta seca, sem contexto, que exige memorização prévia);
* Pergunta que possa ser respondida sem ler o texto explicativo da própria questão.

**Regra central:** toda questão segue o fluxo **EXPLICA → PERGUNTA**. Se a pergunta puder ser respondida sem o texto, a questão está errada e deve ser refeita.

---

## Estrutura de Cada Questão

| Campo      | Obrigatório | Descrição                                                                                                                                                                        |
| ---------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `aula`     | Sim         | Nome real da aula/conteúdo, como string. Mesmo valor em todas as 10 questões. Nunca usar placeholder — preencher com o título real.                                              |
| `tipo`     | Sim         | Um dos três tipos definidos abaixo (ver seção Tipos).                                                                                                                            |
| `texto`    | Sim         | Mini conteúdo explicativo, estilo aula/livro didático. 2 a 6 linhas. Deve ensinar algo, não repetir o material original com outras palavras.                                     |
| `question` | Sim         | Pergunta clara e direta, baseada diretamente no `texto` acima.                                                                                                                   |
| `code`     | Não         | Trecho de código, somente se o conceito exigir código para fazer sentido (ex.: sintaxe de programação). Omitir o campo quando não for necessário — não deixar vazio ou genérico. |
| `options`  | Sim         | 4 alternativas plausíveis, apenas 1 correta.                                                                                                                                     |
| `answer`   | Sim         | Índice (0 a 3) da alternativa correta em `options`.                                                                                                                              |
| `feedback` | Sim         | Explicação breve (1 a 3 linhas) reforçando o conceito principal — não apenas repetir que a resposta está certa.                                                                  |

### Regras do `texto`

* Estilo natural, como um professor explicando — não copie frases do conteúdo original.
* Evite texto vazio, frase genérica sem conteúdo real ou transcrição quase literal do material.
* O texto deve fornecer a base necessária para responder à pergunta.
* A pergunta deve depender diretamente da explicação apresentada no texto.

---

## Tipos de Questão (variar obrigatoriamente)

| `tipo` (valor exato) | Quando usar                                                                        |
| -------------------- | ---------------------------------------------------------------------------------- |
| `"Explicativa"`      | Conceito explicado de forma direta antes da pergunta. Mais simples e objetiva.     |
| `"Contextualizada"`  | Explicação mais densa, podendo envolver mais de um conceito relacionado.           |
| `"Aplicação"`        | Pequeno cenário real/prático, focando no uso do conhecimento, não só na definição. |

### Regras de distribuição

* Total: exatamente **10 questões**, nem mais nem menos.
* Mínimo de 3 questões de cada tipo (a 10ª questão pode reforçar qualquer um dos três).
* Misturar tamanhos de texto e níveis de explicação entre as questões.
* Evitar repetir o mesmo padrão de frase ou estrutura entre questões.
* Nunca usar rótulos visíveis do tipo no `texto` ou `question` (ex.: não escrever "Questão contextualizada:") — o tipo só aparece no campo `tipo`.
* Variar os assuntos e os exemplos práticos conforme o conteúdo fornecido.

---

## Nível de Dificuldade

Fácil a médio, com foco em aprendizado — não em pegar o aluno de surpresa.

---

## Sistema de Chips Semânticos (opcional)

Formato: `==categoria==TERMO==`

| Categoria técnica | Equivalente conceitual | Quando usar            |
| ----------------- | ---------------------- | ---------------------- |
| `==ddl==`         | `==def==`              | Definições e conceitos |
| `==dml==`         | `==proc==`             | Processos e ações      |
| `==key==`         | `==rule==`             | Regras e princípios    |
| `==type==`        | `==term==`             | Tipos e classificações |
| `==danger==`      | `==warn==`             | Erros e armadilhas     |
| `==mark==`        | `==mark==`             | Destaque geral         |

### Regras

* Use **um único padrão** por questão: ou o conjunto técnico (`ddl`, `dml`, `key`, `type`, `danger`) ou o conceitual (`def`, `proc`, `rule`, `term`, `warn`) — nunca misture os dois na mesma questão.
* Máximo de **2 chips no total** por questão, somando `texto` + `feedback`.
* Nunca usar chips dentro de `options`.
* O uso é opcional — não force um chip se não houver um termo que se beneficie do destaque.
* Prefira texto limpo quando a marcação não agregar clareza.

---

## Formato de Saída (obrigatório)

Gere exatamente 10 objetos JavaScript válidos, seguindo exatamente a estrutura definida neste prompt.

### Regra crítica sobre a saída

* Cada questão deve ser um objeto individual, iniciado por `{` e encerrado por `}`.
* **Nunca envolva as 10 questões em um array externo `[]`.**
* Não use colchetes externos para agrupar os objetos.
* Não coloque vírgulas entre os objetos.
* Cada objeto deve ser independente e fácil de copiar e colar.
* A saída deve conter somente o bloco de código JavaScript, sem texto fora dele.
* Não escreva introduções, explicações, títulos ou observações fora do código.
* Os arrays internos permitidos, como `options`, devem permanecer conforme a estrutura original.
* Não inclua arrays externos, objetos agrupadores ou qualquer estrutura adicional.

### Estrutura obrigatória de cada objeto

```javascript id="a8c4f2"
// 1 - [assunto resumido]
{
  aula: "Aula x — nome do titulo",
  tipo: "Explicativa",
  texto: "Explicação didática do conceito (modo aula).",
  question: "Pergunta baseada no texto.",
  options: [
    "Alternativa A",
    "Alternativa B",
    "Alternativa C",
    "Alternativa D"
  ],
  answer: 0,
  feedback: "Explicação breve reforçando o conceito."
},

// 2 - [assunto resumido]
{
  aula: "Aula x — nome do titulo",
  tipo: "Aplicação",
  texto: "Explicação didática do conceito (modo aula).",
  question: "Pergunta baseada no texto.",
  code: `// só incluir este campo se o conceito exigir código`,
  options: [
    "Alternativa A",
    "Alternativa B",
    "Alternativa C",
    "Alternativa D"
  ],
  answer: 2,
  feedback: "Explicação breve reforçando o conceito."
},
```

**Atenção:** o exemplo acima é apenas ilustrativo. Substitua todos os placeholders pelos dados reais do conteúdo recebido. Não inclua campos opcionais quando não forem necessários.

---

## Regras de Comentários

* Antes de cada questão, um comentário no formato `// [número sequencial] - [assunto em 1 a 3 palavras]`.
* Numeração sequencial (1, 2, 3... até 10), sem pular ou repetir números.
* O assunto resumido deve refletir o tema central daquela questão específica.
* Cada questão deve ter exatamente um comentário identificador.

---

## Restrições de Estrutura

* Gerar exatamente 10 objetos individuais, nem mais nem menos.
* Cada objeto deve começar com `{` e terminar com `}`.
* **É proibido utilizar um array externo `[]` para agrupar as questões.**
* Não colocar vírgulas entre os objetos.
* Não alterar os nomes nem a ordem dos campos mostrados no exemplo.
* O campo `aula` é obrigatório em todos os 10 objetos, sempre como o primeiro campo, com o mesmo valor real em todos.
* Nunca usar placeholders como `"Aula x"`, `"nome do titulo"`, `"[nome da aula]"` ou `"digite a aula"` na saída final.
* O campo `tipo` deve conter exatamente um dos três valores permitidos: `"Explicativa"`, `"Contextualizada"` ou `"Aplicação"`.
* Campos opcionais (`code`) só aparecem quando realmente necessários — não incluir vazio ou como placeholder.
* Cada objeto deve possuir sintaxe JavaScript válida individualmente.
* Os arrays internos permitidos, como `options`, devem seguir a estrutura solicitada.
* Não transformar o formato em JSON puro, objeto único, array de strings ou outro formato.
* A saída final deve ser composta somente pelos 10 objetos individuais dentro de um único bloco de código JavaScript.

---

## Restrição de Apresentação (obrigatório)

A saída deve ser **somente texto digitado em bloco de código**, exatamente como no formato acima.

**Proibido:**

* Gerar como quiz interativo, componente visual ou qualquer widget clicável.
* Usar qualquer ferramenta de apresentação visual/interativa para o resultado.
* Adicionar botão de copiar/clipboard ou qualquer elemento de interface além do bloco de código puro.
* Adicionar um array externo `[]` envolvendo as questões.
* Adicionar texto explicativo antes ou depois do bloco de código.

A resposta deve ser apenas o código JavaScript, pronto para ser copiado manualmente e colado onde o usuário for usar.

---

## Checklist Final (verificar antes de responder)

* [ ] Existem exatamente 10 objetos individuais, cada um delimitado por `{ }`?
* [ ] **A saída não possui nenhum array externo `[]` envolvendo as questões?**
* [ ] Não existem colchetes externos agrupando os 10 objetos?
* [ ] Todo objeto tem o campo `aula` preenchido com o nome real, como primeiro campo?
* [ ] O mesmo valor real de `aula` está presente em todas as 10 questões?
* [ ] Mínimo de 3 questões de cada tipo (`Explicativa`, `Contextualizada`, `Aplicação`)?
* [ ] Toda questão segue o fluxo explica → pergunta (a pergunta não pode ser respondida sem o texto)?
* [ ] Nenhum `texto` é cópia quase literal do material original?
* [ ] Nenhum rótulo de tipo aparece visível dentro de `texto` ou `question`?
* [ ] O campo `code` está presente apenas onde realmente necessário, sem ficar vazio ou genérico nas demais?
* [ ] Todas as questões têm exatamente 4 `options`, com `answer` correto e coerente?
* [ ] Chips semânticos (se usados) seguem um único padrão por questão, com no máximo 2 no total, e nunca nas alternativas?
* [ ] Cada questão tem seu comentário `// [número] - [assunto]` correto e sequencial?
* [ ] A saída é só o bloco de código JavaScript — sem quiz interativo, sem widget, sem botão de clipboard e sem array externo?
