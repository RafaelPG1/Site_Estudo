Aqui está o prompt atualizado com a correção das imagens:

Você receberá um RESUMO de conteúdo de UMA aula.
Sua tarefa é organizar esse resumo EXATAMENTE na estrutura JavaScript de objeto de aula mostrada abaixo.
⚠️ REGRAS ABSOLUTAS:
NÃO simplificar o conteúdo (é RESUMO, não simplificação)
NÃO remover informações importantes
NÃO escrever nada fora da estrutura
NÃO adicionar explicações antes ou depois
NÃO criar novos campos além dos mostrados abaixo
NÃO copiar textos do exemplo (como "id-unico", "Nome da Seção")
NÃO envolver a resposta em blocos de código markdown (não usar ```)
NÃO retornar aulas: [...] — retornar APENAS o objeto { } da aula, pronto para ser colado dentro do array
═══════════════════ COMO PREENCHER ═══════════════════
aula → título da aula extraído ou inferido do resumo
ideia_central → 1 frase objetiva que resume a ideia principal da aula
secoes → dividir o conteúdo em partes lógicas
Para cada seção:
id → identificador curto baseado no tema (ex: "visao", "conceitos", "metodos")
titulo → nome real da seção
blocos → organizar o conteúdo nos tipos abaixo
═══════════════════ TIPOS DE BLOCOS ═══════════════════
texto:
{
tipo: "texto",
texto: "explicação completa"
}
lista:
{
tipo: "lista",
titulo: "opcional",
itens: [
"item completo",
"outro item"
]
}
topico:
{
tipo: "topico",
titulo: "subtítulo",
texto: "explicação"
}
ou
{
tipo: "topico",
titulo: "subtítulo",
lista: [
"ponto 1",
"ponto 2"
]
}
subtitulo:
{
tipo: "subtitulo",
texto: "texto curto"
}
exemplo:
{
tipo: "exemplo",
titulo: "nome do exemplo",
texto: "explicação",
detalhe: "opcional"
}
tabela:
{
tipo: "tabela",
titulo: "nome",
colunas: ["col1", "col2"],
linhas: [
["valor1", "valor2"]
]
}
destaque:
{
tipo: "destaque",
texto: "informação importante para prova"
}
imagem:
{
tipo: "imagem",
src: "nome_do_arquivo.png",
pasta: "imagens_<disciplina>/aula_<N>",
alt: "descrição da imagem",
num: 1
}
— Use apenas quando o resumo mencionar explicitamente uma figura/imagem com nome de arquivo.
— O campo pasta SEMPRE deve ser preenchido com "imagens_<disciplina>/aula_<N>" (ex: "imagens_design/aula_12").
— num é o número da figura (1, 2, 3…).
═══════════════════ REGRAS DE CONTEÚDO ═══════════════════
Manter o nível de detalhe do resumo
Pode reorganizar, mas NÃO reduzir demais
Preservar: ✔ conceitos ✔ definições ✔ explicações ✔ exemplos ✔ métodos
Usar negrito para termos importantes e backticks para trechos de código dentro dos textos
NÃO:
❌ resumir demais
❌ cortar partes importantes
❌ transformar tudo em frases curtas
═══════════════════ EXEMPLO MÍNIMO ═══════════════════
Entrada:
"Aula sobre variáveis. Variável é um espaço na memória para guardar dados. Tipos: inteiro, texto, booleano."
Saída esperada:
{
aula: "Aula — Variáveis",
ideia_central: "Variáveis são espaços na memória usados para armazenar dados de diferentes tipos.",
secoes: [
{
id: "conceitos",
titulo: "🧠 Conceitos Principais",
blocos: [
{
tipo: "topico",
titulo: "O que é uma Variável",
texto: "Espaço na memória para guardar dados."
},
{
tipo: "lista",
titulo: "Tipos:",
itens: [
"Inteiro",
"Texto",
"Booleano"
]
}
]
}
]
}
═══════════════════ SAÍDA FINAL ═══════════════════
Retorne APENAS o objeto abaixo, sem nenhum texto antes ou depois,
sem aulas: [...], sem comentários, sem markdown:
{
aula: "...",
ideia_central: "...",
secoes: [ ... ]
}
═══════════════════ OBJETIVO ═══════════════════
Organizar o conteúdo da aula em um único objeto JavaScript { },
completo e pronto para ser colado dentro do array aulas[] do arquivo res_*.js.