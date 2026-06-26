# Prompt — Reorganização temática de disciplina (atlas)

Cole este prompt seguido do conteúdo completo do arquivo `content/atlas/<disciplina>.js`
(o objeto `window.__nexusatlas = { secoes: [...] }` inteiro).

---

Você vai reorganizar o conteúdo de uma disciplina de estudo. O conteúdo está no
formato `window.__nexusatlas = { secoes: [ { titulo, blocos: [...] }, ... ] }`,
usado por um app de anotações pessoais (atlas).

## Contexto do problema

Hoje as seções estão organizadas em **ordem cronológica de aprendizado**
(ex.: "Mundo 1", "Mundo 2", "Mundo 3", evoluindo no tempo), em vez de por
**estrutura temática do conteúdo**. Isso causa um problema concreto: um
mesmo tópico (ex. "listas") pode estar fragmentado entre seções diferentes,
porque foi estudado em momentos diferentes. Quando eu quero adicionar
conteúdo novo sobre um tópico já existente, não há um lugar único e óbvio
para colocá-lo.

## Sua tarefa

Reorganize as `secoes` para que a estrutura reflita a **árvore temática real
do assunto**, não a ordem em que foi estudado. Critérios:

1. **Agrupe por tema/conceito, não por cronologia.** Tudo que pertence ao
   mesmo conceito (ex.: todas as variações e usos de "listas") deve ficar
   dentro da mesma seção ou em seções-irmãs adjacentes, mesmo que no
   original estivesse espalhado em "mundos"/módulos diferentes.

2. **Ordene por dependência conceitual, não por data de estudo.** A ordem
   final deve ser a que faz mais sentido para alguém aprendender do zero
   (pré-requisitos antes do que depende deles), não a ordem em que eu
   pessoalmente aprendi.

3. **Granularidade de seção = um tópico coeso.** Se uma seção atual mistura
   2+ temas não relacionados só porque foram anotados juntos no mesmo dia,
   separe em seções distintas. Se vários "mundos" tratam do mesmo tema em
   profundidades crescentes, **funda essas partes numa seção só**, com os
   blocos internos progredindo do básico ao avançado (use blocos
   `subtitulo` para marcar essa progressão dentro da seção, ex.:
   "Conceito básico", "Métodos comuns", "Casos avançados").

4. **Pense em manutenção futura.** A pergunta que a estrutura final precisa
   responder bem é: "se eu aprender uma forma nova de usar X amanhã, onde
   eu coloco isso?" — deve haver exatamente uma seção óbvia para qualquer
   tópico novo dentro do escopo já existente. Se não houver, é sinal de que
   falta uma seção dedicada para esse tema.

5. **Não invente uma divisão genérica de curso (ex.: "Fundamentos /
   Intermediário / Avançado") só por convenção.** A divisão deve nascer do
   que o conteúdo real contém. Pode haver quantas seções fizerem sentido.

## Regras de preservação de conteúdo (importante)

- **Você pode mover, agrupar, dividir, renomear e reordenar livremente.**
  Isso é esperado e é o objetivo principal da tarefa.
- **Você NÃO deve reescrever, resumir ou alterar o texto/código/itens
  dentro dos blocos**, exceto no caso abaixo.
- **Excepcionalmente**, se ao reorganizar você perceber uma lacuna real de
  conteúdo (ex.: um tópico mencionado mas nunca explicado, um exemplo de
  código quebrado, uma seção que claramente faltava algo para fazer
  sentido como unidade), você pode complementar ou corrigir o mínimo
  necessário — com critério, não por iniciativa de "melhorar" o que já
  está completo e correto.
- **Nunca insira no conteúdo qualquer nota, comentário ou bloco dizendo que
  algo foi alterado, adicionado ou gerado por IA.** O arquivo de saída deve
  parecer 100% anotação minha. Qualquer alteração de conteúdo (além de
  reorganização estrutural) deve ser **reportada fora do arquivo, na sua
  resposta de texto**, listando exatamente o quê e onde.
- Mantenha o formato técnico exato: cada seção é
{

titulo: string,

icone: "<svg>...</svg>",   ← NOVO: SVG inline, ~24×24px, stroke="currentColor"

desc: string,              ← NOVO: uma frase curta (máx 80 chars) resumindo

o que a seção cobre, para exibir nos cards

blocos: [...]

}
  O `icone` deve ser um SVG inline temático para o assunto da seção 
  (ex: para "Variáveis e Tipos", um ícone de caixa ou tag; para "Funções", 
  f(x); para "Listas", uma lista). Use sempre `stroke="currentColor"` e 
  `fill="none"` para herdar a cor do tema. Tamanho: `width="24" height="24"`.
  O `desc` é obrigatório — escreva você mesmo com base no conteúdo da seção.

  Cada bloco dentro de `blocos` segue um destes tipos:
  `texto` (`{tipo:'texto', texto}`), `subtitulo` (`{tipo:'subtitulo', texto}`),
  `lista` (`{tipo:'lista', itens:[...]}`), `tabela`
  (`{tipo:'tabela', cabecalho:[...], linhas:[[...]]}`), `codigo`
  (`{tipo:'codigo', codigo}`), `alerta` (`{tipo:'alerta', texto, icone?}`),
  `destaque` (`{tipo:'destaque', texto}`), `imagem` (`{tipo:'imagem', 
  src:'nome-do-arquivo.png', legenda?:'texto opcional'}`).
  Não invente tipos novos.
— imagens ficam em content/atlas/imagens/<id-da-disciplina>/; use legenda quando o contexto da imagem não for óbvio pelo texto ao redor.. Não invente tipos novos.

## Formato da sua resposta

Responda em duas partes:

1. **Resumo da reorganização** (texto corrido, fora do código): que
   estrutura temática você identificou, como agrupou, o que foi fundido ou
   dividido, e — se for o caso — lista exata de qualquer conteúdo que você
   complementou/corrigiu além de reorganizar (com a localização exata, tipo
   "na seção X, bloco de código Y, corrigi tal erro" ou "adicionei um bloco
   explicando Z, que estava implícito mas não estava escrito").

2. **Arquivo completo reorganizado**, em um bloco de código, no formato
   exato `window.__nexusatlas = { secoes: [ ... ] };` pronto para substituir
   o arquivo original.

Conteúdo a reorganizar:

```javascript
[COLE AQUI O CONTEÚDO COMPLETO DE content/atlas/<disciplina>.js]
```