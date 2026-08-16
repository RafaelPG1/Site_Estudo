Você receberá o conteúdo completo de UMA aula.
Sua tarefa é organizar esse conteúdo EXATAMENTE na estrutura JavaScript de objeto de aula mostrada abaixo.

═══════════════════ CONTRATO DE SAÍDA (MAIS IMPORTANTE DE TUDO) ═══════════════════
⚠️ O PRIMEIRO CARACTERE da sua resposta DEVE ser `{`.
⚠️ NÃO escreva NADA antes do `{` — nem saudação, nem "Aqui está", nem comentário, nem quebra de linha, nem espaço.
⚠️ O ÚLTIMO CARACTERE da sua resposta DEVE ser `}` (o fechamento do objeto da aula).
⚠️ NÃO escreva NADA depois do `}` — nem explicações, nem observações finais.
⚠️ NÃO use blocos de código markdown (nada de ``` no início ou no fim).
⚠️ NÃO escreva "aulas: [ ... ]" — apenas o objeto único { }, pronto para ser colado dentro do array aulas[] já existente.
⚠️ NÃO escreva `const aula = ` nem qualquer atribuição de variável — apenas o objeto puro.
Se você perceber que está prestes a escrever qualquer texto fora dessas regras, PARE e corrija antes de responder.

═══════════════════ REGRAS ABSOLUTAS DE FIDELIDADE ═══════════════════
TRANSCREVA o conteúdo integralmente — cada conceito, definição, exemplo, método, detalhe.
NÃO resuma, NÃO simplifique, NÃO reduza, NÃO omita NADA.
Se o conteúdo original tem 10 pontos, o objeto final deve ter 10 pontos.
NÃO parafraseie de forma que perca precisão técnica — use as palavras originais quando necessário.
NÃO crie novos campos além dos mostrados abaixo.
NÃO copie textos do exemplo (como "id-unico", "Nome da Seção") — eles são apenas ilustrativos.

═══════════════════ COMO PREENCHER ═══════════════════
aula → título da aula extraído ou inferido do conteúdo
ideia_central → 1 frase objetiva que resume a ideia principal da aula
secoes → dividir o conteúdo em partes lógicas, cobrindo TODO o material recebido

Para cada seção:
id → identificador curto baseado no tema (ex: "visao", "conceitos", "metodos")
titulo → nome real da seção
blocos → organizar TODO o conteúdo nos tipos abaixo, sem deixar nada de fora

═══════════════════ TIPOS DE BLOCOS ═══════════════════
texto — para parágrafos explicativos completos:
{
  tipo: "texto",
  texto: "explicação completa, mantendo todos os detalhes originais"
}

lista — para conjuntos de itens:
{
  tipo: "lista",
  titulo: "opcional",
  itens: [
    "item completo com todo seu conteúdo original",
    "outro item completo"
  ]
}

topico — para subtópicos com explicação ou lista:
{
  tipo: "topico",
  titulo: "subtítulo",
  texto: "explicação completa"
}
ou
{
  tipo: "topico",
  titulo: "subtítulo",
  lista: [
    "ponto 1 completo",
    "ponto 2 completo"
  ]
}

subtitulo — para separar subseções:
{
  tipo: "subtitulo",
  texto: "texto curto"
}

exemplo — para exemplos, casos e ilustrações:
{
  tipo: "exemplo",
  titulo: "nome do exemplo",
  texto: "explicação completa",
  detalhe: "opcional — informação adicional do exemplo"
}

tabela — para dados em formato tabular:
{
  tipo: "tabela",
  titulo: "nome",
  colunas: ["col1", "col2"],
  linhas: [
    ["valor1", "valor2"]
  ]
}

destaque — para informações marcadas como importantes:
{
  tipo: "destaque",
  texto: "informação importante para prova"
}

imagem — use APENAS quando o conteúdo mencionar explicitamente uma figura/imagem com nome de arquivo:
{
  tipo: "imagem",
  src: "nome_do_arquivo.png",
  pasta: "imagens_<disciplina>/aula_<N>",
  alt: "descrição da imagem",
  num: 1
}
O campo pasta SEMPRE deve seguir o padrão "imagens_<disciplina>/aula_<N>" (ex: "imagens_design/aula_12").
num é o número sequencial da figura (1, 2, 3…).

═══════════════════ REGRAS DE CONTEÚDO ═══════════════════
✅ OBRIGATÓRIO preservar:
Todos os conceitos e definições, com suas explicações completas
Todos os exemplos, com seus detalhes e contexto
Todos os métodos e procedimentos, passo a passo
Todos os termos técnicos, fórmulas, nomes e nomenclaturas
Todas as listas, com cada item completo
Todas as observações, notas, ressalvas e destaques
A estrutura lógica e sequência do conteúdo original
Usar negrito para termos importantes e backticks para trechos de código dentro dos textos

❌ PROIBIDO:
Resumir parágrafos longos em frases curtas
Fundir itens distintos em um único item
Cortar exemplos ou simplificá-los
Omitir qualquer parte do conteúdo recebido
Transformar explicações detalhadas em tópicos vagos

═══════════════════ VERIFICAÇÃO ANTES DE RESPONDER ═══════════════════
Antes de gerar a saída, confirme mentalmente:
1. Todo parágrafo do conteúdo original foi mapeado para algum bloco?
2. Todos os exemplos foram incluídos com seus detalhes?
3. Todas as listas estão completas, com todos os itens?
4. Nenhum conceito ou definição foi omitido ou reduzido?
5. Minha resposta vai começar exatamente com `{` e terminar exatamente com `}`, sem nenhum caractere antes ou depois?

Se a resposta a qualquer uma dessas perguntas for "não", corrija antes de responder.

═══════════════════ FORMATO FINAL EXATO (repetindo o mais importante) ═══════════════════
Retorne SOMENTE o objeto abaixo. A resposta inteira deve ser este objeto, começando em `{` e terminando em `}` — nenhum caractere, palavra, comentário ou marcação antes ou depois:
{
  aula: "...",
  ideia_central: "...",
  secoes: [ ... ]
}