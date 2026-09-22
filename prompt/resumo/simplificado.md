# Prompt: Estrutura Simplificado (Resumo Condensado por Aula)

## Papel
Você receberá um conteúdo de estudo (resumo, aula, PDF ou texto). Sua tarefa é transformar esse conteúdo **exclusivamente** na estrutura `simplificado[]` — um resumo condensado, mantido próximo do original, sem introduções, conclusões ou comentários fora do formato pedido.

---

## Regras Absolutas de Saída
- **NÃO** gerar `aulas[]` (formato diferente, não é este).
- **NÃO** escrever introduções.
- **NÃO** escrever conclusões.
- **NÃO** adicionar comentários fora dos comentários solicitados (ver seção "Comentários Obrigatórios").
- **NÃO** adicionar explicações sobre o que foi feito.
- **NÃO** alterar a estrutura definida neste prompt.
- **NÃO** retornar markdown fora da estrutura.
- **NÃO** criar quiz interativo.
- **NÃO** criar botão de clipboard ou qualquer elemento de interface.
- **NÃO** criar blocos além dos tipos definidos (`topico`, `lista`, `imagem`).
- Retornar **somente** o bloco `simplificado: [...]`.

---

## PROIBIÇÃO ABSOLUTA: Questões e Exercícios
Nenhuma questão, exercício, alternativa (A/B/C/D), gabarito ou item avaliativo pode aparecer em nenhum bloco, em nenhuma forma ou disfarce — mesmo que isso signifique deixar de fora algum dado que só existisse dentro de uma questão do conteúdo original.

- Não transcrever enunciados de questões, mesmo parcialmente ou parafraseados.
- Não transformar uma questão em `topico`, `lista` ou qualquer outro bloco.
- Se um trecho do conteúdo original for uma questão/exercício, **ignore-o por completo** ao montar o simplificado — extraia apenas o conteúdo teórico daquele trecho, se houver algum fora do bloco de questão.

---

## Estrutura Obrigatória

```javascript
{
  aula: "Título",
  ideia_central: "Uma frase que resume o conceito mais importante da aula.",
  secoes: [
    {
      id: "id-unico",
      titulo: "Nome da Seção",
      blocos: [
        {
          tipo: "topico",
          titulo: "Subtítulo do tópico",
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
          id: "id_original_da_imagem",
          src: "arquivo_original.ext",
          pasta: "caminho/original",
          num: "numero_original",
          alt: "texto_alternativo_original"
        }
      ]
    }
  ]
}
```

**Atenção:** o bloco `tipo: "imagem"` tem **apenas um formato válido** — o mostrado acima, com `id`, `src`, `pasta`, `num` e `alt`. Não existe uma versão alternativa desse bloco com `titulo`/`descricao` — use sempre e somente os campos de metadados listados.

---

## Regras de Conteúdo
- Cada aula do conteúdo recebido vira **uma** entrada no array `simplificado`.
- Cada aula deve preservar todos os conceitos importantes (exceto conteúdo de questões/exercícios — ver proibição acima).
- O objetivo é um resumo condensado, sem perder informação relevante.
- Nunca transformar conceitos importantes em explicações longas — cada item deve ser uma frase curta.
- Nunca escrever parágrafos.
- Priorizar: definições, conceitos, fórmulas, métodos, processos e relações importantes.
- Remover redundâncias e unificar explicações repetidas.
- Preservar siglas, nomes técnicos e terminologia original, sem traduzir ou simplificar o termo em si.
- Usar `**negrito**` para termos-chave.
- Usar `` `backtick` `` para códigos, comandos, protocolos, siglas ou tecnologias, quando fizer sentido.
- O campo `ideia_central` deve capturar a essência da aula em uma única frase.
- O conteúdo deve ser suficiente para revisão rápida antes de provas.

---

## Organização das Seções
- Criar entre **1 e 3 seções** por aula.
- Agrupar conteúdos semelhantes na mesma seção.
- Não criar seções vazias — se não houver conteúdo suficiente para uma segunda ou terceira seção, use só 1.
- Não repetir o mesmo conceito em múltiplas seções da mesma aula.
- Cada seção deve representar um agrupamento lógico e coerente do conteúdo.

---

## Regras dos Blocos

### Bloco `topico`
Usar quando existir um subtítulo ou assunto claramente identificável dentro da seção.
- Cada item da `lista` deve conter apenas uma informação relevante.
- Formato obrigatório:
```javascript
{
  tipo: "topico",
  titulo: "Nome",
  lista: [ "..." ]
}
```

### Bloco `lista`
Usar para enumerações ou informações sem um subtítulo claro associado.
- Cada item deve conter apenas um conceito ou informação.
- Formato obrigatório:
```javascript
{
  tipo: "lista",
  itens: [ "..." ]
}
```

---

## Imagens e Diagramas

- Preservar imagens relevantes já existentes no conteúdo original.
- **Não** inventar imagens novas.
- **Não** criar descrições substituindo imagens existentes.
- **Não** converter uma imagem em texto quando os metadados dela já estiverem disponíveis — o bloco `imagem` é preservado como está, não reescrito como `topico`/`lista`.

### Campos obrigatórios do bloco `imagem`
| Campo | Obrigatório | Regra |
|---|---|---|
| `id` | Sim | Copiar exatamente do conteúdo original. Nunca gerar um novo, nunca alterar. Se a imagem de origem realmente não tiver `id` (formato antigo), gerar um estável em snake_case a partir de `alt`/`src` — exceção, não regra. |
| `src` | Sim | Nunca renomear o arquivo. |
| `pasta` | Sim | Nunca alterar o caminho. |
| `num` | Sim | Nunca alterar a numeração. |
| `alt` | Sim | Nunca resumir, reescrever ou traduzir o valor — usar exatamente como está no conteúdo original. |

**Regras adicionais:**
- Nunca remover nenhum desses campos.
- Utilizar exatamente os dados existentes no conteúdo recebido — nunca inventar valores.
- Se uma imagem não possuir os metadados necessários no conteúdo original, não invente os valores faltantes (e avalie se ainda faz sentido incluir o bloco sem eles).
- Nunca gerar URLs.
- Nunca gerar markdown de imagem (`![alt](src)`).
- Se uma imagem relevante existir no conteúdo original, ela deve ser preservada no simplificado — a menos que seu conteúdo já esteja 100% redundante com um bloco `topico`/`lista` já presente na mesma aula (ex: a imagem só mostrava uma lista de itens que já foi transcrita) — nesse caso, avalie se realmente vale manter os dois.

**Exemplo:**
```javascript
{
  tipo: "imagem",
  id: "fig_1_create_database_postgres",
  src: "fig_create_database_postgres.png",
  pasta: "imagens_banco_dados/aula_09",
  num: "1",
  alt: "Criacao de banco de dados no PostgreSQL utilizando DDL"
}
```

---

## Comentários Obrigatórios

No início de cada aula, adicionar:
```
// aula: [nome da aula]
```

Antes de cada item principal gerado (cada bloco dentro de `blocos`), adicionar:
```
// [número] - [assunto resumido]
```

**Regras:**
- Numeração sequencial, começando em **1 para cada aula** (reinicia a cada nova entrada do array).
- O assunto resumido deve ter entre 1 e 3 palavras.
- O assunto deve representar o tema principal daquele item específico.
- Não alterar a estrutura — apenas inserir os comentários acima dos itens.

**Exemplo:**
```javascript
// aula: Redes de Computadores

// 1 - modelo osi
{
  ...
},

// 2 - protocolo tcp
{
  ...
}
```

---

## Qualidade Final (verificar antes de responder)
- [ ] Nenhuma questão/exercício/alternativa/gabarito foi incluído, em nenhum bloco?
- [ ] Todos os conceitos importantes foram preservados (exceto conteúdo de questões)?
- [ ] Não existem parágrafos longos — todos os itens são frases curtas?
- [ ] Não existem repetições do mesmo conceito entre seções?
- [ ] A estrutura está correta, seguindo exatamente o formato definido (sem campos extras, sem versões alternativas do bloco `imagem`)?
- [ ] Não existe conteúdo fora do bloco `simplificado: [...]`?
- [ ] Nenhuma aula do conteúdo original foi omitida?
- [ ] O bloco `imagem` sempre usa `id`, `src`, `pasta`, `num`, `alt` — nunca `titulo`/`descricao`?
- [ ] As imagens incluídas são realmente necessárias (não redundantes com texto já presente)?
- [ ] Os comentários `// aula: [nome]` e `// [número] - [assunto]` estão presentes e corretos, reiniciando a numeração a cada aula?

---

## Saída Final
Retorne **exatamente**:
```
simplificado: [...]
```
Sem nenhum texto, explicação ou marcação fora dessa estrutura.