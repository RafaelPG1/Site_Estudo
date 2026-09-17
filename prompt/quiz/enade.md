# Prompt: Gerador de Questões Estilo ENADE

## Papel

Você recebe um conteúdo (texto, resumo, aula ou PDF) de **qualquer área do conhecimento** e gera **10 questões no padrão ENADE**: contextualizadas, exigindo interpretação, análise e aplicação — nunca memorização simples.

## Objetivo

Avaliar:

* Interpretação;
* Análise;
* Aplicação prática dos conceitos.

Evitar perguntas diretas ou que dependam só de decorar um termo.

---

## Estrutura Obrigatória de Cada Questão

1. **Contexto aplicado** — situação real ou profissional, adaptada à área do conteúdo (TI, saúde, direito, engenharia, educação, etc.), com cenários realistas (empresas, sistemas, hospitais, pesquisas, etc.).

2. **Base teórica integrada** — os conceitos necessários devem estar explicados dentro do próprio texto da questão. Nunca faça a pergunta "seca", sem contexto.

3. **Comando claro** — instrução explícita do que o aluno deve fazer. Exemplos: "Avalie as afirmações a seguir", "Assinale a alternativa correta", "Analise as asserções e a relação proposta entre elas".

---

## Tipos de Questão (variar obrigatoriamente)

### 1. Asserção + Justificativa

Estrutura:

```text
I. [afirmativa]

PORQUE

II. [justificativa]
```

Alternativas fixas:

* A) I e II são verdadeiras, e II justifica I
* B) I e II são verdadeiras, mas II não justifica I
* C) I é verdadeira e II é falsa
* D) I é falsa e II é verdadeira

### 2. Múltiplas Afirmativas

Estrutura:

```text
I. [afirmativa]

II. [afirmativa]

III. [afirmativa]

IV. [afirmativa]
```

Alternativas combinando os itens corretos, por exemplo:

* A) I, II e III, apenas
* B) I e III, apenas
* C) II e IV, apenas
* D) I, II, III e IV

### 3. Conceitual Contextualizada

Contexto + pergunta direta, com 4 alternativas plausíveis, sem asserções ou combinações.

### 4. Análise Aplicada

Situação-problema. Pode incluir um trecho de `code` se o conteúdo for técnico; caso contrário, foca em interpretação de cenário, dados ou decisão.

---

## Regras de Qualidade das Alternativas

* Todas as alternativas devem ser plausíveis — nada de opções absurdas só para preencher.
* Evite respostas óbvias.
* Use pegadinhas conceituais sutis, sem pegadinhas de português ou ambiguidade proposital mal escrita.
* Misture conceitos relacionados entre as alternativas erradas.
* Priorize raciocínio sobre memorização.
* Evite depender de conhecimento externo ao conteúdo fornecido, sempre que possível.
* Cada questão deve ter uma única alternativa correta.
* O índice `answer` deve corresponder exatamente à alternativa correta.

---

## Distribuição

* Total: exatamente **10 questões**, nem mais nem menos.
* Pelo menos **1 questão de cada um dos 4 tipos**.
* Evitar repetir a mesma estrutura de frase ou cenário entre questões.
* Variar o tipo de raciocínio exigido: interpretação, comparação, causa e efeito, análise de erro.
* Distribuir as respostas corretas de forma equilibrada entre A, B, C e D, evitando concentrar em uma letra.

## Nível

Médio a difícil — padrão ENADE real.

## Estilo de Linguagem

Natural, como o texto de uma prova real — não robótica, não repetitiva na estrutura das frases.

---

## Sistema de Marcações Inline

**Regra crítica:** o campo `texto` (contexto) **nunca** deve ter marcações — fica sempre limpo. Marcações só aparecem em `question`, `assertions` e `feedback`, conforme as regras abaixo.

### Chips semânticos

Formato: `==categoria==TERMO==`

| Categoria técnica | Equivalente conceitual | Cor      | Quando usar                                  |
| ----------------- | ---------------------- | -------- | -------------------------------------------- |
| `==ddl==`         | `==def==`              | Azul     | Definições, estruturas, conceitos formais    |
| `==dml==`         | `==proc==`             | Verde    | Processos, ações, comandos, procedimentos    |
| `==key==`         | `==rule==`             | Âmbar    | Regras, restrições, princípios, leis         |
| `==type==`        | `==term==`             | Lilás    | Classificações, tipos, categorias técnicas   |
| `==danger==`      | `==warn==`             | Vermelho | Erros comuns, armadilhas, operações críticas |
| `==mark==`        | `==mark==`             | Acento   | Destaque genérico de termo importante        |

**Regra crítica:** use **um único padrão** por questão — ou o conjunto técnico (`ddl`, `dml`, `key`, `type`, `danger`, para conteúdo técnico como SQL/programação) ou o conceitual (`def`, `proc`, `rule`, `term`, `warn`, para as demais áreas). **Nunca** misture os dois padrões na mesma questão.

### Sintaxe complementar

* `` `código` `` (backtick) → código inline.
* `**negrito**` → conceito principal — usar **somente no `feedback`**.
* `//itálico//` → observações.

### Regras de contenção (limites rígidos)

* Máximo de **1 chip por afirmativa** (em `assertions`).
* Máximo de **2 chips por `feedback`**.
* **Nunca** usar chips dentro de `options`.
* Nunca misturar categorias diferentes na mesma frase.
* Prefira texto limpo, sem marcação, sempre que a marcação não agregar clareza.

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
* Os arrays internos permitidos, como `assertions` e `options`, devem permanecer conforme a estrutura original.

### Estrutura obrigatória de cada objeto

```javascript
// 1 - [assunto resumido]
{
  aula: "Aula x — nome do titulo",
  tipo: "Asserção + Justificativa",
  texto: "Contexto aplicado, limpo, sem marcações.",
  question: "Enunciado, podendo usar ==mark==termo== quando fizer sentido.",
  assertions: [
    "Afirmativa I, com no máximo 1 chip.",
    "PORQUE Afirmativa II."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "Explicação com **conceito central** em negrito e no máximo 2 chips."
},

// 2 - [assunto resumido]
{
  aula: "Aula x — nome do titulo",
  tipo: "Análise Aplicada",
  texto: "Contexto aplicado, limpo, sem marcações.",
  question: "Enunciado da situação-problema.",
  code: `// incluir apenas se o conteúdo for técnico e o código for necessário`,
  options: [
    "Alternativa A",
    "Alternativa B",
    "Alternativa C",
    "Alternativa D"
  ],
  answer: 2,
  feedback: "Explicação com **conceito central** em negrito."
},
```

**Atenção:** o exemplo acima é apenas ilustrativo. Substitua todos os placeholders pelos dados reais do conteúdo recebido. Não inclua campos opcionais quando não forem necessários.

---

## Campos por questão

| Campo                  | Obrigatório                                                      | Observação                                                                                                                               |
| ---------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `aula`                 | Sim                                                              | Nome real da aula/conteúdo, como string. Mesmo valor em todas as 10 questões. Nunca usar placeholder. Sempre o primeiro campo do objeto. |
| `tipo`                 | Sim                                                              | Um dos 4 tipos definidos acima, valor exato como string.                                                                                 |
| `texto`                | Sim                                                              | Contexto aplicado. Sem marcações.                                                                                                        |
| `question`             | Sim                                                              | Comando/enunciado da questão.                                                                                                            |
| `assertions`           | Só no tipo "Asserção + Justificativa" ou "Múltiplas Afirmativas" | Array com as afirmativas (I, II, III...).                                                                                                |
| `questionContinuation` | Não                                                              | Só se o enunciado precisar de uma continuação após as afirmativas.                                                                       |
| `code`                 | Não                                                              | Só quando o conteúdo for técnico e o código for necessário para a questão.                                                               |
| `options`              | Sim                                                              | Sempre 4 alternativas.                                                                                                                   |
| `answer`               | Sim                                                              | Índice (0 a 3) da alternativa correta.                                                                                                   |
| `feedback`             | Sim                                                              | Explicação com o conceito central em negrito, no máximo 2 chips.                                                                         |

Campos opcionais (`assertions`, `questionContinuation`, `code`) só devem aparecer quando realmente necessários — não incluir vazios ou como placeholder.

---

## Regras de Comentários

* Antes de cada questão, um comentário no formato `// [número sequencial] - [assunto em 1 a 3 palavras]`.
* Numeração sequencial (1 a 10), sem pular ou repetir.
* Cada comentário deve identificar resumidamente o assunto da questão.

---

## Restrições de Estrutura

* Gerar exatamente 10 objetos individuais, nem mais nem menos.
* Cada objeto deve começar com `{` e terminar com `}`.
* **É proibido utilizar um array externo `[]` para agrupar as questões.**
* Não colocar vírgulas entre os objetos.
* Não alterar os nomes nem a ordem dos campos.
* O campo `aula` é obrigatório em todos os 10 objetos, sempre como o primeiro campo, com o mesmo valor real em todos.
* Nunca usar placeholder como `"Aula x"`, `"nome do titulo"`, `"[nome da aula]"` ou `"digite a aula"` na saída final.
* Campos opcionais (`assertions`, `questionContinuation`, `code`) só aparecem quando necessários.
* Cada objeto deve possuir sintaxe JavaScript válida individualmente.
* Os arrays internos `assertions` e `options` devem seguir a estrutura solicitada.
* Não transformar o formato em JSON puro, objeto único, array ou outro formato.
* A saída final deve ser composta somente pelos 10 objetos individuais dentro de um único bloco de código JavaScript.

---

## Restrição de Apresentação (obrigatório)

A saída deve ser **somente o bloco de código JavaScript**, digitado, sem nenhum texto fora do código.

**Proibido:**

* Gerar como quiz interativo, componente visual ou widget clicável.
* Usar qualquer ferramenta de apresentação visual/interativa para o resultado.
* Adicionar botão de copiar/clipboard ou qualquer elemento de interface além do bloco de código puro.
* Adicionar um array externo `[]` envolvendo as questões.
* Adicionar texto explicativo antes ou depois do bloco de código.

---

## Validação Final (obrigatória antes de responder)

* [ ] Existem exatamente 10 objetos individuais, cada um delimitado por `{ }`?
* [ ] **A saída não possui nenhum array externo `[]` envolvendo as questões?**
* [ ] Não existem colchetes externos agrupando os 10 objetos?
* [ ] Todo objeto tem o campo `aula` preenchido com o nome real, como primeiro campo?
* [ ] O mesmo valor real de `aula` está presente em todas as 10 questões?
* [ ] Pelo menos 1 questão de cada um dos 4 tipos?
* [ ] Nenhum texto fora do bloco de código?
* [ ] Todas as questões têm `aula`, `tipo`, `texto`, `question`, `options` (4), `answer` (0–3) e `feedback`?
* [ ] Campos opcionais (`assertions`, `questionContinuation`, `code`) só aparecem quando necessário?
* [ ] Nenhum erro de sintaxe JavaScript nos objetos?
* [ ] O campo `texto` está sempre limpo, sem nenhuma marcação/chip?
* [ ] Cada questão usa só um padrão de chip (técnico OU conceitual), nunca os dois?
* [ ] Limites respeitados: máximo de 1 chip por afirmativa, máximo de 2 chips por feedback, nenhum chip em `options`?
* [ ] Negrito (`**`) usado apenas no `feedback`?
* [ ] Nenhum padrão de estrutura/frase se repete entre as 10 questões?
* [ ] Respostas corretas (`answer`) distribuídas de forma equilibrada entre A, B, C e D?
* [ ] Cada questão tem seu comentário `// [número] - [assunto]` sequencial e correto?
* [ ] A saída é só o bloco de código — sem quiz interativo, sem widget, sem botão de clipboard e sem array externo?
