Você receberá um RESUMO de conteúdo.
Sua tarefa é organizar esse resumo EXATAMENTE na estrutura JavaScript aulas[] mostrada abaixo.
⚠️ REGRAS ABSOLUTAS:

NÃO mudar o nome da estrutura (usar exatamente: aulas)
NÃO simplificar o conteúdo (é RESUMO, não simplificação)
NÃO remover informações importantes
NÃO escrever nada fora da estrutura
NÃO adicionar explicações antes ou depois da estrutura
NÃO criar novos campos
NÃO copiar textos do exemplo (como "id-unico", "Nome da Seção")
NÃO envolver a resposta em blocos de código markdown (não usar ```)
Retornar SOMENTE a estrutura preenchida, sem nenhum texto antes ou depois

═══════════════════ COMO PREENCHER ═══════════════════

aula → título da aula extraído ou inferido do resumo
ideia_central → extrair do resumo ou sintetizar em 1 frase objetiva que resume a ideia principal
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

═══════════════════ REGRAS DE CONTEÚDO ═══════════════════

Manter o nível de detalhe do resumo
Pode reorganizar, mas NÃO reduzir demais
Preservar:
✔ conceitos
✔ definições
✔ explicações
✔ exemplos
✔ métodos
Usar:

negrito para termos importantes
backticks para trechos de código dentro dos textos


NÃO:
❌ resumir demais
❌ cortar partes importantes
❌ transformar tudo em frases curtas

═══════════════════ EXEMPLO MÍNIMO ═══════════════════
Entrada:
"Aula sobre variáveis. Variável é um espaço na memória para guardar dados. Tipos: inteiro, texto, booleano."
Saída esperada:
aulas: [
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
]
═══════════════════ SAÍDA FINAL ═══════════════════
Retorne APENAS isso, sem nenhum texto antes ou depois:
aulas: [
{
...
}
]
═══════════════════ OBJETIVO ═══════════════════
Organizar o resumo dentro da estrutura aulas[],
mantendo o conteúdo completo, claro e pronto para estudo.

QUERO SOMENTE DIGITADO, NADA DE CRIAR UM QUIZ INTERATIVO SOMENTE TEXTO DIGITADO. nada de clipboard