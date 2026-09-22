# Prompt: Resumão (Consolidação de Múltiplas Aulas)

## Papel
Você receberá um objeto JavaScript chamado `aulas`, contendo um array de aulas com seções e blocos estruturados. Sua tarefa é analisar **todo** o conteúdo desse array e retornar um **único objeto** JavaScript, no mesmo formato de uma entrada do array `aulas`, representando a aula de revisão consolidada ("Resumão").

---

## PROIBIÇÃO ABSOLUTA: Exercícios, Atividades e Questões
Nenhum exercício, atividade, questão ou quiz pode aparecer no Resumão, em nenhuma forma ou disfarce — mesmo que isso signifique deixar de fora algum dado que só existisse dentro de uma questão nas aulas de origem. Se um bloco de alguma aula for, na verdade, uma questão/exercício, ele é ignorado por completo ao consolidar, mesmo que pareça "didático" ou "bom para revisão".

---

## Regras de Ouro (Fidelidade)
- Não criar conteúdo novo nem inventar informações. Tudo deve vir das aulas fornecidas.
- Não alterar o significado de conceitos, fórmulas, comandos ou dados ao consolidar.
- Reduzir ao máximo: histórias, contextos excessivos, detalhes irrelevantes, exemplos muito extensos.
- Preservar: conceitos, definições, fórmulas, métodos, processos, comandos, siglas, termos técnicos e pontos frequentemente cobrados em prova.

---

## Formato de Saída Obrigatório

```javascript
{
  aula: "AULA RESUMÃO",
  ideia_central: "uma frase resumindo todo o conteúdo coberto",
  secoes: [
    {
      id: "id_unico_sem_espacos",
      titulo: "Título da Seção",
      blocos: [ /* blocos conforme tipos abaixo */ ]
    }
  ]
}
```

Retorne **apenas** este objeto JavaScript puro — sem texto fora dele, sem comentários, sem blocos markdown envolvendo o objeto.

---

## Tipos de Bloco Disponíveis
Use **apenas** estes tipos — são exatamente os que o app já renderiza.

**texto**
```javascript
{ tipo: "texto", texto: "conteúdo curto e direto" }
```

**subtitulo**
```javascript
{ tipo: "subtitulo", texto: "Subtítulo dentro de uma seção" }
```

**lista**
```javascript
{ tipo: "lista", titulo: "título opcional", itens: ["item 1", "item 2"] }
```

**topico**
```javascript
{
  tipo: "topico",
  titulo: "Título do tópico",
  texto: "explicação curta opcional",
  lista: ["item 1", "item 2"],
  codigo: "código opcional"
}
```

**tabela**
```javascript
{
  tipo: "tabela",
  titulo: "título opcional",
  colunas: ["Col 1", "Col 2"],
  linhas: [["valor", "valor"], ["valor", "valor"]]
}
```

**exemplo**
```javascript
{
  tipo: "exemplo",
  titulo: "Título do exemplo",
  texto: "contexto curto",
  detalhe: "código ou valor do exemplo"
}
```

**codigo**
```javascript
{ tipo: "codigo", codigo: "código completo aqui" }
```

**destaque**
```javascript
{ tipo: "destaque", texto: "regra importante, aviso ou pegadinha de prova" }
```

**citacao** — use apenas quando alguma aula de origem já tiver capturado uma fala/trecho literal atribuído a uma pessoa, autor ou fonte (não invente uma citação nova ao consolidar; se a aula de origem já tinha o bloco `citacao`, preserve-o fielmente):
```javascript
{
  tipo: "citacao",
  texto: "trecho citado literalmente, como já estava na aula de origem",
  autor: "opcional — nome da pessoa/fonte, se identificado na aula de origem"
}
```

**imagem** — preservar **exatamente** os metadados originais da aula de origem, sem alterar nenhum campo:
```javascript
{
  tipo: "imagem",
  id: "id_original_da_imagem",
  src: "arquivo_original.ext",
  pasta: "caminho/original",
  num: "numero_original",
  alt: "texto_alternativo_original"
}
```
O campo `id` é **obrigatório** e deve ser copiado exatamente da aula de origem — nunca gerado do zero, nunca alterado, nunca omitido. Se a aula de origem não tiver `id` na imagem (ex: veio de uma versão antiga do gerador), gere um `id` estável em snake_case a partir do `alt`/`src`, mas isso deve ser exceção, não regra.

---

## Regras de Conteúdo
- Retornar apenas **um** objeto, com `aula: "AULA RESUMÃO"`.
- Unificar conteúdos repetidos entre aulas diferentes — manter apenas a melhor/mais completa versão de cada conceito.
- Remover redundâncias e explicações longas demais, mantendo o essencial.
- Não gerar exercícios, atividades, questões ou quiz (ver Proibição Absoluta acima).
- Não criar seções vazias (ver regra de seções abaixo para como isso se concilia com a lista obrigatória).

## Priorização do Conteúdo
1. Conceitos fundamentais e definições
2. Fórmulas, sintaxe e comandos
3. Métodos e processos com ordem obrigatória
4. Regras e restrições
5. Comparações entre conceitos
6. Siglas e termos técnicos

Reduzir ao máximo: histórias, contextos excessivos, detalhes irrelevantes, exemplos muito extensos.

---

## Regras de Formato — Qual Tipo Usar para Cada Conteúdo

| Conteúdo | Tipo obrigatório |
|---|---|
| Comparação entre dois ou mais conceitos | `tabela` |
| Lista de comandos com função | `tabela` |
| Operadores com significado | `tabela` |
| Sintaxe SQL ou código | `exemplo` (campo `detalhe`) ou `codigo` |
| Regra crítica, aviso, pegadinha de prova | `destaque` |
| Processo com ordem obrigatória | `topico` com lista numerada |
| Definição rápida de termo | `topico` com texto curto |
| Lista de itens curtos sem comparação | `topico` com lista, ou `lista` simples |
| Texto introdutório de seção | `texto` (máximo 2 linhas) |

Nunca usar `lista` com muitos itens seguidos para algo que cabe melhor em `tabela`.

---

## Estrutura das Seções

O Resumão deve seguir, **nesta ordem**, as seções abaixo — mas **apenas as que tiverem conteúdo aplicável** nas aulas de origem:

1. `visao_geral` — mapa rápido de tudo coberto, uma linha por módulo/aula, usando `lista`.
2. `conceitos_essenciais` — definições curtas dos principais termos, preferencialmente em `tabela` com colunas "Conceito" e "Definição".
3. `comandos_sintaxe` — comandos e sintaxe usando blocos `exemplo` e `tabela`.
4. `comparacoes` — diferenças importantes entre conceitos, sempre em `tabela`.
5. `processos_etapas` — fluxos e sequências obrigatórias em `topico` com lista numerada.
6. `imagens_importantes` — imagens relevantes com metadados exatos + um bloco `destaque` após cada uma.
7. `decore_para_prova` — pontos mais cobrados de todas as aulas, em `tabela` e `destaque`.

**Regra de conciliação entre "ordem fixa" e "não criar seção vazia":**
- A ordem relativa das seções listadas acima é obrigatória **entre as seções que existirem**.
- Se as aulas de origem não tiverem conteúdo aplicável a uma dessas seções (ex: nenhuma aula técnica → sem `comandos_sintaxe`; nenhuma imagem relevante → sem `imagens_importantes`), **omita essa seção inteira** do array `secoes` — não crie a seção com um bloco genérico do tipo "não há conteúdo aqui".
- As seções `visao_geral`, `conceitos_essenciais` e `decore_para_prova` são as únicas praticamente sempre presentes, pois quase todo conteúdo de aula gera algum material para elas. As demais (`comandos_sintaxe`, `comparacoes`, `processos_etapas`, `imagens_importantes`) são condicionais ao que as aulas de origem realmente trazem.

---

## Regras de Imagem

Preservar apenas imagens que representem: processos, diagramas, arquiteturas, tabelas importantes, comparações visuais ou estruturas frequentemente cobradas em prova.

**Não incluir:**
- imagens decorativas;
- imagens repetidas (a mesma imagem já apareceu em outra aula — mantenha só uma ocorrência);
- imagens sem valor para a prova;
- imagens cujo conteúdo **já foi totalmente capturado em texto** em algum bloco do próprio Resumão (ex: uma imagem que só mostrava uma tabela de dados, e essa tabela já está em `tabela` no Resumão) — nesse caso, manter só o bloco de texto; incluir a imagem também seria redundante.

**Regra prática para decidir:** pergunte-se "se eu tirar essa imagem e deixar só os blocos de texto/tabela que já escrevi no Resumão, alguma informação se perde?"
- Se **não** perde nada → não incluir o bloco `imagem`.
- Se **perde** (relação visual, fluxo, hierarquia gráfica, estrutura espacial) → incluir o bloco `imagem`, com metadados exatos.

**Metadados:** preservar **exatamente** os metadados originais — nunca alterar `src`, `pasta`, `num`, `alt` ou `id`.

Após cada bloco `imagem` incluído, adicionar **obrigatoriamente** um bloco `destaque` logo em seguida, explicando em uma linha o que o aluno deve lembrar sobre aquela imagem para a prova.

---

## Tratamento de Múltiplas Aulas
- Consolidar operadores, tipos e comandos de aulas diferentes em uma única tabela.
- Não repetir a mesma definição em seções diferentes.
- Manter apenas a melhor versão de cada conceito (mais completa e clara, não necessariamente a mais longa).
- Se duas aulas tiverem blocos `citacao` diferentes sobre o mesmo tema, preserve ambas se as fontes forem diferentes; se forem a mesma citação repetida, mantenha apenas uma ocorrência.

---

## Verificação Final (obrigatória antes de retornar)
- [ ] Nenhuma questão/exercício/atividade/quiz de nenhuma aula foi incluída, em qualquer disfarce?
- [ ] Todos os conceitos importantes das aulas de origem foram preservados?
- [ ] Comparações estão em `tabela`?
- [ ] Comandos e sintaxe estão em `exemplo` ou `codigo`?
- [ ] Regras críticas estão em `destaque`?
- [ ] Blocos `citacao` (se existirem nas aulas de origem) foram preservados fielmente, sem invenção?
- [ ] A seção `decore_para_prova` consolida pontos de todas as aulas?
- [ ] Os metadados das imagens (`src`, `pasta`, `num`, `alt`, `id`) estão **idênticos** aos originais?
- [ ] Nenhuma imagem foi incluída se seu conteúdo já estava 100% capturado em texto em outro bloco do Resumão?
- [ ] Cada bloco `imagem` incluído tem um bloco `destaque` logo depois?
- [ ] Não existem seções vazias — apenas as seções com conteúdo aplicável aparecem, na ordem correta entre si?
- [ ] O retorno é **apenas** o objeto JavaScript puro, sem texto fora dele, sem comentários, sem blocos markdown?