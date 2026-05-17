Vou ler o prompt atual e melhorá-lo para garantir que todo o conteúdo seja preservado integralmente, sem cortes ou simplificações.Aqui está o prompt corrigido e reforçado para garantir preservação integral do conteúdo:

Você receberá o conteúdo completo de UMA aula.
Sua tarefa é organizar esse conteúdo EXATAMENTE na estrutura JavaScript de objeto de aula mostrada abaixo.
⚠️ REGRAS ABSOLUTAS DE FIDELIDADE:

TRANSCREVA o conteúdo integralmente — cada conceito, definição, exemplo, método, detalhe
NÃO resuma, NÃO simplifique, NÃO reduza, NÃO omita NADA
Se o conteúdo original tem 10 pontos, o objeto final deve ter 10 pontos
NÃO parafraseie de forma que perca precisão técnica — use as palavras originais quando necessário
NÃO escreva nada fora da estrutura
NÃO adicione explicações antes ou depois
NÃO crie novos campos além dos mostrados abaixo
NÃO copie textos do exemplo (como "id-unico", "Nome da Seção")
NÃO envolva a resposta em blocos de código markdown (não use ```)
NÃO retorne aulas: [...] — retorne APENAS o objeto { } da aula, pronto para ser colado dentro do array

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

Todo parágrafo do conteúdo original foi mapeado para algum bloco?
Todos os exemplos foram incluídos com seus detalhes?
Todas as listas estão completas, com todos os itens?
Nenhum conceito ou definição foi omitido ou reduzido?

Se a resposta a qualquer dessas perguntas for "não", revise o objeto antes de retornar.
═══════════════════ SAÍDA FINAL ═══════════════════
Retorne APENAS o objeto abaixo, sem nenhum texto antes ou depois,
sem aulas: [...], sem comentários, sem markdown:
{
  aula: "...",
  ideia_central: "...",
  secoes: [ ... ]
}
═══════════════════ OBJETIVO ═══════════════════
Organizar TODO o conteúdo da aula em um único objeto JavaScript { },
completo, fiel e sem perdas, pronto para ser colado dentro do array aulas[] do arquivo res_*.js.

As principais mudanças feitas:

"RESUMO de conteúdo" → "conteúdo completo" — o prompt original sugeria que a entrada já seria um resumo, o que justificava cortes. Agora deixa claro que o input é o conteúdo bruto.
Regras de fidelidade reforçadas — adicionei exemplos concretos do que conta como omissão proibida (fundir itens, cortar exemplos, reduzir explicações).
Checklist de verificação — antes de gerar a saída, o modelo precisa confirmar que nada foi perdido.
Lista do que preservar expandida — agora inclui explicitamente: observações, ressalvas, notas, fórmulas, nomenclaturas e sequência lógica.