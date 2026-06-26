/* =============================================
   CONTENT — content/atlas/python.js
   Localização: content/atlas/python.js

   Contém APENAS o conteúdo da disciplina Python.
   ============================================= */

window.__nexusatlas = {
  secoes: [

    /* ─────────────────────────────────────────
       1. Fundamentos
    ───────────────────────────────────────── */
    {
      titulo: 'Fundamentos',
      icone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
      desc: 'print(), input(), variáveis e tipos primitivos de dados.',
      blocos: [
        { tipo: 'subtitulo', texto: 'Comandos básicos' },
        { tipo: 'texto', texto: '`print()` — Exibe informações na tela. Exemplo: `print("Olá, mundo!")`' },
        { tipo: 'texto', texto: '`input()` — Recebe informações do usuário (geralmente usado com `print`).' },

        { tipo: 'subtitulo', texto: 'Variáveis' },
        { tipo: 'texto', texto: 'Variáveis armazenam valores que podem ser reutilizados no código.' },

        { tipo: 'subtitulo', texto: 'Tipos Primitivos' },
        { tipo: 'texto', texto: 'Categoria básica de dados:' },
        {
          tipo: 'tabela',
          cabecalho: ['Tipo', 'Descrição', 'Exemplo'],
          linhas: [
            ['`int`',   'números inteiros',  'ex: `10`, `5`'],
            ['`float`', 'números decimais',  'ex: `3.14`, `2.5`'],
            ['`bool`',  'valores lógicos',   '`True`, `False`'],
            ['`str`',   'texto entre aspas', 'ex: `"olá"`'],
          ],
        },
      ],
    },

    /* ─────────────────────────────────────────
       2. Strings
    ───────────────────────────────────────── */
    {
      titulo: 'Strings',
      icone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>`,
      desc: 'Peculiaridades, fatiamento, análise, transformações e formatação de texto.',
      blocos: [
        { tipo: 'subtitulo', texto: 'Peculiaridades de Strings' },
        { tipo: 'texto', texto: 'Características específicas de cada tipo. Exemplo: `a = "Legal"`' },
        {
          tipo: 'tabela',
          cabecalho: ['Método', 'Resultado'],
          linhas: [
            ['`type(a)`',      'Tipo primitivo'],
            ['`a.isspace()`',  'True se for só espaços'],
            ['`a.isnumeric()`','True se tiver só números'],
            ['`a.isalpha()`',  'True se tiver só letras'],
            ['`a.isalnum()`',  'True se tiver letras e/ou números'],
            ['`a.isupper()`',  'True se estiver só em maiúsculas'],
            ['`a.islower()`',  'True se estiver só em minúsculas'],
            ['`a.istitle()`',  'True se começar com maiúscula'],
          ],
        },

        { tipo: 'subtitulo', texto: 'Fatiamento' },
        {
          tipo: 'codigo',
          codigo:
`frase = "curso em video"
frase[9]         # Caractere na posição 9 ("v")
frase[9:14]      # Caractere do 9 até o 13 ("video")
frase[9:14:2]    # Caractere do 9 ao 13, pulando de 2 em 2 ("vdo")
frase[:5]        # Caractere do início até o 4 ("curso")
frase[9:]        # Caractere do 9 até o fim ("video")
frase[5::3]      # Caractere do 5 até o fim, pulando 3 ("e ie")`,
        },

        { tipo: 'subtitulo', texto: 'Análise' },
        {
          tipo: 'tabela',
          cabecalho: ['Expressão', 'Descrição'],
          linhas: [
            ['`len(frase)`',            'quantidade de caracteres'],
            ['`frase.count("o")`',      'quantas vezes "o" aparece'],
            ['`frase.count("o", 0, 13)`','conta "o" entre índice 0 e 12'],
            ['`frase.find("deo")`',     'retorna índice de onde "deo" começa → 11'],
            ['`frase.find("python")`',  'retorna -1 (não encontrado)'],
            ['`"curso" in frase`',      'verifica se "curso" existe na frase'],
          ],
        },

        { tipo: 'subtitulo', texto: 'Transformações' },
        {
          tipo: 'tabela',
          cabecalho: ['Método', 'Descrição'],
          linhas: [
            ['`frase.replace(x, y)`',  'substitui `x` por `y`'],
            ['`frase.upper()`',        'transforma em maiúsculas'],
            ['`frase.lower()`',        'transforma em minúsculas'],
            ['`frase.capitalize()`',   'só o 1º caractere maiúsculo'],
            ['`frase.title()`',        'todas as palavras com letra maiúscula'],
            ['`frase.strip()`',        'remove espaços extras do início e fim'],
            ['`frase.lstrip()`',       'remove espaços do início'],
            ['`frase.rstrip()`',       'remove espaços do fim'],
          ],
        },

        { tipo: 'subtitulo', texto: 'Divisão e junção' },
        { tipo: 'texto', texto: '`split()` → separa por espaço e cria lista' },
        { tipo: 'texto', texto: '`" - ".join(frase)` → junta usando hífen ("-") como separador' },

        { tipo: 'subtitulo', texto: 'Utilitários de string' },
        { tipo: 'texto', texto: '`numeros.append(numero)` → adiciona um número em uma lista' },
        { tipo: 'texto', texto: '`.zfill(n)` → preenchimento com zeros à esquerda' },

        { tipo: 'subtitulo', texto: 'Alinhamento de texto em print()' },
        { tipo: 'texto', texto: 'Ao usar f-strings, você pode alinhar o conteúdo em um espaço fixo usando os seguintes símbolos dentro das chaves `{}`.' },
        {
          tipo: 'tabela',
          cabecalho: ['Símbolo', 'Nome', 'Alinha o conteúdo', 'Exemplo', 'Saída'],
          linhas: [
            ['`:<n`', 'Esquerda',    'À esquerda', "`f\"{'Texto':<10}\"`", '`Texto     `'],
            ['`:>n`', 'Direita',     'À direita',  "`f\"{'Texto':>10}\"`", '`     Texto`'],
            ['`:^n`', 'Centralizado','Ao centro',  "`f\"{'Texto':^10}\"`", '`  Texto   `'],
          ],
        },
        { tipo: 'alerta', icone: '🔹', texto: 'Onde `n` é a largura total reservada para o texto.' },
        {
          tipo: 'codigo',
          codigo:
`nomes = ["Ana", "João", "Carolina", "Lu"]

for i, nome in enumerate(nomes):
    print(f"{i}º {nome:<15} <- fim")

# Saída:
# 0º Ana            <- fim
# 1º João           <- fim
# 2º Carolina       <- fim
# 3º Lu             <- fim`,
        },
        { tipo: 'alerta', icone: '🧠', texto: 'Isso é útil para deixar colunas alinhadas visualmente, mesmo com textos de tamanhos diferentes.' },

        { tipo: 'subtitulo', texto: 'ANSI – Formatação no Terminal' },
        { tipo: 'texto', texto: 'Escape Sequence: `\\033[style;text;backgroundm`' },
        {
          tipo: 'tabela',
          cabecalho: ['Código', 'Estilo de texto'],
          linhas: [
            ['`0`', 'normal'],
            ['`1`', 'negrito'],
            ['`4`', 'sublinhado'],
            ['`7`', 'inverte as cores'],
          ],
        },
        {
          tipo: 'tabela',
          cabecalho: ['Código', 'Texto (cor padrão)'],
          linhas: [
            ['`30`','preto'],['`31`','vermelho'],['`32`','verde'],['`33`','amarelo'],
            ['`34`','azul'],['`35`','roxo (magenta)'],['`36`','ciano'],['`37`','branco'],
          ],
        },
        {
          tipo: 'tabela',
          cabecalho: ['Código', 'Texto (cor brilhante / clara)'],
          linhas: [
            ['`90`','preto claro (cinza)'],['`91`','vermelho claro'],['`92`','verde claro'],
            ['`93`','amarelo claro'],['`94`','azul claro'],['`95`','roxo claro (magenta claro)'],
            ['`96`','ciano claro'],['`97`','branco brilhante'],
          ],
        },
        {
          tipo: 'tabela',
          cabecalho: ['Código', 'Fundo (cor padrão)'],
          linhas: [
            ['`40`','fundo preto'],['`41`','fundo vermelho'],['`42`','fundo verde'],
            ['`43`','fundo amarelo'],['`44`','fundo azul'],['`45`','fundo roxo'],
            ['`46`','fundo ciano'],['`47`','fundo branco'],
          ],
        },
        {
          tipo: 'tabela',
          cabecalho: ['Código', 'Fundo (cor brilhante / clara)'],
          linhas: [
            ['`100`','fundo preto claro (cinza)'],['`101`','fundo vermelho claro'],
            ['`102`','fundo verde claro'],['`103`','fundo amarelo claro'],
            ['`104`','fundo azul claro'],['`105`','fundo roxo claro'],
            ['`106`','fundo ciano claro'],['`107`','fundo branco brilhante'],
          ],
        },
      ],
    },

    /* ─────────────────────────────────────────
       3. Operadores
    ───────────────────────────────────────── */
    {
      titulo: 'Operadores',
      icone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
      desc: 'Operadores aritméticos, relacionais e ordem de precedência.',
      blocos: [
        { tipo: 'subtitulo', texto: 'Operadores Aritméticos' },
        {
          tipo: 'tabela',
          cabecalho: ['Operador', 'Descrição'],
          linhas: [
            ['`+`',  'adição'],
            ['`-`',  'subtração'],
            ['`*`',  'multiplicação'],
            ['`/`',  'divisão'],
            ['`**`', 'exponenciação'],
            ['`//`', 'divisão inteira'],
            ['`%`',  'resto da divisão (módulo)'],
          ],
        },

        { tipo: 'subtitulo', texto: 'Ordem de Precedência' },
        {
          tipo: 'tabela',
          cabecalho: ['Prioridade', 'Operador'],
          linhas: [
            ['1º', '`()`'],
            ['2º', '`**`'],
            ['3º', '`*`, `/`, `//`, `%`'],
            ['4º', '`+`, `-`'],
          ],
        },

        { tipo: 'subtitulo', texto: 'Operadores Relacionais' },
        {
          tipo: 'tabela',
          cabecalho: ['Operação', 'Sinal', 'Significado'],
          linhas: [
            ['Igualdade',      '`==`', 'É igual a'],
            ['Diferença',      '`!=`', 'É diferente de'],
            ['Maior que',      '`>`',  'É maior que'],
            ['Menor que',      '`<`',  'É menor que'],
            ['Maior ou igual', '`>=`', 'É maior ou igual a'],
            ['Menor ou igual', '`<=`', 'É menor ou igual a'],
          ],
        },
      ],
    },

    /* ─────────────────────────────────────────
       4. Controle de Fluxo
    ───────────────────────────────────────── */
    {
      titulo: 'Controle de Fluxo',
      icone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>`,
      desc: 'Condições if/elif/else, laços for e while, e controle com break.',
      blocos: [
        { tipo: 'subtitulo', texto: 'Condição Simples' },
        {
          tipo: 'codigo',
          codigo:
`if condição:
    # código`,
        },
        { tipo: 'texto', texto: 'Executa um bloco se a condição for verdadeira.' },

        { tipo: 'subtitulo', texto: 'Condição Composta' },
        {
          tipo: 'codigo',
          codigo:
`if condição:
    # se verdadeiro
else:
    # se falso`,
        },
        { tipo: 'texto', texto: 'Executa um bloco se for verdadeira e outro se for falsa.' },

        { tipo: 'subtitulo', texto: 'Condições Aninhadas (elif)' },
        {
          tipo: 'codigo',
          codigo:
`if variavel():
    # Bloco 1
elif outra_condicao:
    # Bloco 2
else:
    # Bloco 3`,
        },
        { tipo: 'texto', texto: '**if**: Executa o bloco de código se a condição for verdadeira.' },
        { tipo: 'texto', texto: '**elif**: (else if) Executa se a condição do `if` for falsa e a condição do `elif` for verdadeira.' },
        { tipo: 'texto', texto: '**else**: Executa se todas as condições anteriores forem falsas.' },

        { tipo: 'subtitulo', texto: 'Estrutura de Repetição for' },
        {
          tipo: 'codigo',
          codigo:
`for c in range(0, 10):
    # Bloco de código`,
        },
        { tipo: 'texto', texto: '`range(0, 10)`: Cria uma sequência de números de 0 a 9. O código dentro do bloco será repetido para cada valor gerado pela função `range`.' },

        { tipo: 'subtitulo', texto: 'Estrutura de Repetição while' },
        {
          tipo: 'codigo',
          codigo:
`while not variavel:
    # Bloco de código`,
        },
        { tipo: 'texto', texto: 'Repetirá o bloco de código enquanto uma condição for verdadeira.' },

        { tipo: 'subtitulo', texto: 'Usando break' },
        {
          tipo: 'codigo',
          codigo:
`while not variavel:
    if outra_condicao:
        break  # Interrompe o laço
    # Bloco de código`,
        },
        { tipo: 'texto', texto: '`break`: Encerra imediatamente o laço, mesmo que a condição do `while` ainda não tenha sido atendida.' },
      ],
    },

    /* ─────────────────────────────────────────
       5. Tuplas
    ───────────────────────────────────────── */
    {
      titulo: 'Tuplas',
      icone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/></svg>`,
      desc: 'Estruturas imutáveis com parênteses: definição, iteração e operações.',
      blocos: [
        { tipo: 'subtitulo', texto: 'Definição e exemplo' },
        { tipo: 'texto', texto: 'Estruturas de dados **imutáveis** (não podem ser modificadas). Usam parênteses `()`. Sintaxe: `tupla = (item1, item2, ...)`' },
        {
          tipo: 'codigo',
          codigo:
`lanche = ("hambúrguer", "suco", "pizza", "pudim")
print(lanche)
# Resultado: ('hambúrguer', 'suco', 'pizza', 'pudim')`,
        },

        { tipo: 'subtitulo', texto: 'For com Tuplas' },
        {
          tipo: 'codigo',
          codigo:
`lanche = ("hambúrguer", "suco", "pizza", "pudim")

# 1. Iterar por valor:
for comida in lanche:
    print(comida)

# 2. Iterar por índice e valor:
for pos, comida in enumerate(lanche):
    print(f"{comida} está na posição {pos}")

# 3. Usando range():
for i in range(0, len(lanche)):
    print(f"Comi {lanche[i]} na posição {i}")`,
        },

        { tipo: 'subtitulo', texto: 'Operações com Tuplas' },
        {
          tipo: 'codigo',
          codigo:
`# Ordenar (retorna lista, não modifica a tupla)
print(sorted(lanche))
# Resultado: ['hambúrguer', 'pizza', 'pudim', 'suco']

# Juntar
a = (2, 3, 4)
b = (5, 6, 7)
c = a + b
print(c)
# Resultado: (2, 3, 4, 5, 6, 7)

# count e index
tupla = (2, 4, 2, 9, 2)
print(tupla.count(2))   # Conta quantas vezes aparece o valor 2 → 3
print(tupla.index(4))   # Mostra a posição do valor 4 → 1

# Máximo e Mínimo
numeros = (8, 3, 6, 2)
print(max(numeros))  # 8
print(min(numeros))  # 2

# Tipos diferentes
pessoa = ("Rafael", 18, "M", 1.77)
print(pessoa)

# Deletar
del tupla`,
        },
      ],
    },

    /* ─────────────────────────────────────────
       6. Listas
    ───────────────────────────────────────── */
    {
      titulo: 'Listas',
      icone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
      desc: 'Estruturas mutáveis com colchetes: criação, operações, matrizes e enumerate.',
      blocos: [
        { tipo: 'subtitulo', texto: 'Definição' },
        { tipo: 'texto', texto: 'Estruturas de dados que armazenam uma sequência ordenada de itens, que podem ser de diferentes tipos. Listas são estruturas **mutáveis** (podem ser modificadas). Usam colchetes `[]`.' },
        {
          tipo: 'codigo',
          codigo:
`lista = ["maçã", "banana", "laranja"]
print(lista)
# Resultado: ['maçã', 'banana', 'laranja']`,
        },

        { tipo: 'subtitulo', texto: 'Adicionar Elementos' },
        {
          tipo: 'codigo',
          codigo:
`lista = ["maçã", "banana", "laranja"]

lista.append("uva")       # Adiciona no final
lista.insert(1, "kiwi")   # Adiciona na posição 1
print(lista)
# Resultado: ['maçã', 'kiwi', 'banana', 'laranja', 'uva']`,
        },

        { tipo: 'subtitulo', texto: 'Remover Elementos' },
        {
          tipo: 'codigo',
          codigo:
`lista = ["maçã", "banana", "laranja"]

del lista[2]              # Remove o elemento da posição 2
lista.pop(1)              # Remove o elemento da posição 1
lista.remove("laranja")   # Remove pelo valor
lista.pop()               # Remove o último elemento
lista.clear()             # Limpa a lista inteira`,
        },

        { tipo: 'subtitulo', texto: 'Criar listas automaticamente' },
        {
          tipo: 'codigo',
          codigo:
`valores = list(range(4, 11))
print(valores)
# Resultado: [4, 5, 6, 7, 8, 9, 10]`,
        },

        { tipo: 'subtitulo', texto: 'Ordenação' },
        {
          tipo: 'codigo',
          codigo:
`valores = [5, 1, 8, 3]
valores.sort()              # Ordem crescente  → [1, 3, 5, 8]
valores.sort(reverse=True)  # Ordem decrescente → [8, 5, 3, 1]`,
        },

        { tipo: 'subtitulo', texto: 'Ligações vs Cópias' },
        {
          tipo: 'codigo',
          codigo:
`a = [1, 2, 3]
b = a            # Ligação: 'b' e 'a' apontam para a mesma lista

a[0] = 99
print(b)
# Resultado: [99, 2, 3] — 'b' também mudou porque está ligado à mesma lista

c = a[:]         # Cópia: 'c' recebe uma cópia independente de 'a'
a[0] = 100
print(c)
# Resultado: [99, 2, 3] — 'c' não muda, pois é uma cópia feita antes da alteração`,
        },

        { tipo: 'subtitulo', texto: 'Listas dentro de Listas (Matriz)' },
        {
          tipo: 'codigo',
          codigo:
`pessoas = [["Rafael", 18], ["Maria", 19]]

print(pessoas[0][0])   # Rafael
print(pessoas[1][1])   # 19
print(pessoas[1])      # ['Maria', 19]

# Adicionar em listas internas
grupo = [[], []]
grupo[0].append("João")
grupo[1].append("Ana")
print(grupo)
# Resultado: [['João'], ['Ana']]`,
        },

        { tipo: 'subtitulo', texto: 'Função enumerate()' },
        { tipo: 'texto', texto: 'Permite **acessar o índice e o valor** de uma lista (ou iterável) **ao mesmo tempo** dentro de um `for`.' },
        {
          tipo: 'codigo',
          codigo:
`valores = [10, 20, 30]
for i, v in enumerate(valores):
    print(f"Na posição {i} encontrei o valor {v}")
# Resultado:
# Na posição 0 encontrei o valor 10
# Na posição 1 encontrei o valor 20
# Na posição 2 encontrei o valor 30`,
        },
      ],
    },

    /* ─────────────────────────────────────────
       7. Dicionários
    ───────────────────────────────────────── */
    {
      titulo: 'Dicionários',
      icone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
      desc: 'Pares chave:valor, operações, iteração com for e combinação com listas.',
      blocos: [
        { tipo: 'subtitulo', texto: 'O que são?' },
        { tipo: 'destaque', texto: 'Dicionários são estruturas compostas por pares `chave:valor`, onde a **chave** é única (normalmente uma string) e serve como um **índice literal** (em vez de posições numéricas como em listas).' },

        { tipo: 'subtitulo', texto: 'Criação de Dicionário' },
        {
          tipo: 'codigo',
          codigo:
`dados = dict()                          # opção 1
dados = {"nome": "Pedro", "idade": 25}  # opção 2
print(dados)
# Resultado: {'nome': 'Pedro', 'idade': 25}`,
        },

        { tipo: 'subtitulo', texto: 'Adicionar, remover e substituir' },
        {
          tipo: 'codigo',
          codigo:
`dados = {"nome": "Pedro", "idade": 25}

# Adicionar novo par
dados["sexo"] = "M"

# Remover
del dados["idade"]

# Substituir valor
dados["nome"] = "Rafael"`,
        },

        { tipo: 'subtitulo', texto: 'Funções úteis' },
        {
          tipo: 'codigo',
          codigo:
`filme = {
    'titulo': 'Star Wars',
    'ano': 1977,
    'diretor': 'George Lucas'
}

print(filme.values())
# dict_values(['Star Wars', 1977, 'George Lucas'])

print(filme.keys())
# dict_keys(['titulo', 'ano', 'diretor'])

print(filme.items())
# dict_items([('titulo', 'Star Wars'), ('ano', 1977), ('diretor', 'George Lucas')])`,
        },

        { tipo: 'subtitulo', texto: 'Percorrer com for' },
        {
          tipo: 'codigo',
          codigo:
`for k, v in filme.items():
    print(f"O {k} é {v}")
# O titulo é Star Wars
# O ano é 1977
# O diretor é George Lucas`,
        },

        { tipo: 'subtitulo', texto: 'Dicionário + Lista' },
        {
          tipo: 'codigo',
          codigo:
`locadora = []

filme1 = {"titulo": "Star Wars", "ano": 1977, "diretor": "George Lucas"}
filme2 = {"titulo": "Avengers", "ano": 2012, "diretor": "Joss Whedon"}
filme3 = {"titulo": "Matrix",   "ano": 1999, "diretor": "Wachowski"}

locadora.append(filme1)
locadora.append(filme2)
locadora.append(filme3)

print(locadora[0]["ano"])       # 1977
print(locadora[2]["titulo"])    # Matrix
print(locadora[1]["diretor"])   # Joss Whedon`,
        },

        { tipo: 'subtitulo', texto: 'Exemplo com copy() (laço de entrada)' },
        {
          tipo: 'codigo',
          codigo:
`estado = dict()
brasil = list()

for c in range(0, 3):
    estado["uf"]    = str(input("Unidade Federativa: "))
    estado["sigla"] = str(input("Sigla do Estado: "))
    brasil.append(estado.copy())  # Copia real`,
        },
        { tipo: 'alerta', icone: '🧠', texto: 'Sem `copy()`, todos os itens adicionados na lista apontariam para o mesmo dicionário — mudaria um e todos mudariam. Com `copy()`, cada posição da lista tem um dicionário independente.' },
        { tipo: 'alerta', icone: '⚠️', texto: '`brasil["UF"]` → Erro: "list indices must be integers" — você precisa usar o índice da lista primeiro, depois a chave do dicionário.' },
      ],
    },

    /* ─────────────────────────────────────────
       8. Funções
    ───────────────────────────────────────── */
    {
      titulo: 'Funções',
      icone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l4-4-4-4"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
      desc: 'Definição, parâmetros, escopo de variáveis, return e docstrings.',
      blocos: [
        { tipo: 'subtitulo', texto: 'O que são?' },
        { tipo: 'destaque', texto: 'Funções são **rotinas reutilizáveis** que executam comandos específicos. Servem para **organizar o código, evitar repetição** e facilitar a manutenção.' },

        { tipo: 'subtitulo', texto: 'Criando funções simples' },
        {
          tipo: 'codigo',
          codigo:
`def mostraLinha():
    print('----------------')

mostraLinha()`,
        },

        { tipo: 'subtitulo', texto: 'Função com parâmetro' },
        {
          tipo: 'codigo',
          codigo:
`def mensagem(msg):
    print('----------------')
    print(msg)
    print('----------------')

mensagem('Sistema de Alunos')`,
        },

        { tipo: 'subtitulo', texto: 'Função com cálculo' },
        {
          tipo: 'codigo',
          codigo:
`def soma(a, b):
    s = a + b
    print(s)

soma(4, 5)
soma(a=4, b=5)  # Chamando com nome dos parâmetros`,
        },

        { tipo: 'subtitulo', texto: 'Desempacotar valores (*args)' },
        {
          tipo: 'codigo',
          codigo:
`def contador(*num):
    print(num)

contador(2, 1, 7)
# O *num permite passar quantidade variável de argumentos. O resultado será uma tupla.`,
        },

        { tipo: 'subtitulo', texto: 'Função que modifica uma lista' },
        {
          tipo: 'codigo',
          codigo:
`def dobra(lista):
    pos = 0
    while pos < len(lista):
        lista[pos] *= 2
        pos += 1

valores = [7, 2, 5]
dobra(valores)
print(valores)
# Resultado: [14, 4, 10]`,
        },

        { tipo: 'subtitulo', texto: 'Docstrings' },
        { tipo: 'texto', texto: 'São **comentários especiais** dentro de uma função que explicam seu funcionamento. São usados pelo `help()`.' },
        {
          tipo: 'codigo',
          codigo:
`def soma(a, b):
    """
    Recebe dois números e imprime a soma.
    """
    print(a + b)

print(input.__doc__)  # Consultar docstring de uma função nativa`,
        },

        { tipo: 'subtitulo', texto: 'Parâmetros Opcionais' },
        {
          tipo: 'codigo',
          codigo:
`def soma(a=0, b=0, c=0):
    s = a + b + c
    print(s)

soma(3, 2, 5)
soma(8, 4)
# Ao definir um valor padrão (c=0), ele se torna opcional na chamada.`,
        },

        { tipo: 'subtitulo', texto: 'Escopo de Variáveis' },
        {
          tipo: 'codigo',
          codigo:
`# Escopo Local — variáveis declaradas dentro da função só existem ali
def teste(b):
    a = 8     # local
    b += 4
    c = 2     # local
    print(f'A dentro vale: {a}')
    print(f'B dentro vale: {b}')

a = 5         # global
teste(a)
print(f'A fora vale: {a}')  # Continua 5

# Escopo Global — usando global, a função altera uma variável fora dela
def teste(b):
    global a
    a = 8
    b += 4
    print(f'A dentro vale: {a}')

a = 5
teste(a)
print(f'A fora vale: {a}')  # Agora é 8`,
        },

        { tipo: 'subtitulo', texto: 'Retornando valores com return' },
        {
          tipo: 'codigo',
          codigo:
`def somar(a=0, b=0, c=0):
    s = a + b + c
    return s

resp = somar(3, 2, 5)
print(resp)

r1 = somar(3, 2, 5)
r2 = somar(1, 7)
r3 = somar(4)
print(f'Meus cálculos deram {r1}, {r2} e {r3}')`,
        },
      ],
    },

    /* ─────────────────────────────────────────
       9. Módulos
    ───────────────────────────────────────── */
    {
      titulo: 'Módulos',
      icone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
      desc: 'import, math, random, datetime, time, pygame e itemgetter.',
      blocos: [
        { tipo: 'subtitulo', texto: 'import e from…import' },
        { tipo: 'texto', texto: '`import` — Traz bibliotecas externas para o código.' },
        { tipo: 'texto', texto: '`from biblioteca import codigo` — Importa **apenas uma parte específica** (`codigo`) de uma biblioteca, evitando carregar tudo. Útil para deixar o programa mais leve e direto.' },

        { tipo: 'subtitulo', texto: 'math — Funções matemáticas' },
        {
          tipo: 'tabela',
          cabecalho: ['Função', 'Descrição'],
          linhas: [
            ['`ceil()`',          'arredonda pra cima'],
            ['`floor()`',         'arredonda pra baixo'],
            ['`trunc()`',         'parte inteira'],
            ['`pow(x, y)`',       'x elevado a y'],
            ['`sqrt()`',          'raiz quadrada'],
            ['`factorial()`',     'fatorial'],
            ['`radians()`',       'graus → radianos'],
            ['`sin()`, `cos()`, `tan()`', 'funções trigonométricas (usam radianos)'],
            ['`hypot()`',         'calcula hipotenusa'],
          ],
        },

        { tipo: 'subtitulo', texto: 'random — Aleatoriedade' },
        {
          tipo: 'tabela',
          cabecalho: ['Função', 'Descrição'],
          linhas: [
            ['`choice(lista)`',  'escolhe item aleatório'],
            ['`shuffle(lista)`', 'embaralha a lista'],
            ['`randint(x, y)`',  'número aleatório entre X e Y'],
          ],
        },

        { tipo: 'subtitulo', texto: 'datetime — Datas e horas' },
        {
          tipo: 'codigo',
          codigo:
`from datetime import datetime, date, time

print(date.today())           # Ex: 2025-07-25
print(date.today().year)      # Ex: 2025
print(date.today().month)     # Ex: 7
print(date.today().day)       # Ex: 25

print(datetime.now())         # Ex: 2025-07-25 17:42:10.123456
print(datetime.now().hour)    # Ex: 17
print(datetime.now().minute)  # Ex: 42
print(datetime.now().second)  # Ex: 10
print(datetime.now().time())  # Ex: 17:42:10.123456`,
        },
        {
          tipo: 'tabela',
          cabecalho: ['Função', 'Descrição', 'Exemplo'],
          linhas: [
            ['`date.today()`',        'Data atual completa',        '`2025-07-25`'],
            ['`date.today().year`',   'Somente o ano atual',        '`2025`'],
            ['`date.today().month`',  'O mês atual',                '`7`'],
            ['`date.today().day`',    'O dia do mês atual',         '`25`'],
            ['`datetime.now()`',      'Data e hora atual completas','`2025-07-25 17:42:10.123456`'],
            ['`datetime.now().hour`', 'Hora atual',                 '`17`'],
            ['`datetime.now().minute`','Minutos atuais',            '`42`'],
            ['`datetime.now().second`','Segundos atuais',           '`10`'],
            ['`datetime.now().time()`','Somente o horário',         '`17:42:10.123456`'],
          ],
        },

        { tipo: 'subtitulo', texto: 'time — Controle de execução' },
        {
          tipo: 'codigo',
          codigo:
`import time
time.sleep(2)`,
        },
        { tipo: 'texto', texto: '`time.sleep(segundos)`: Faz o programa **esperar** pelo número de segundos especificado antes de continuar. Ex: `time.sleep(2)` pausa o programa por **2 segundos**.' },

        { tipo: 'subtitulo', texto: 'pygame — Jogos e multimídia' },
        {
          tipo: 'codigo',
          codigo:
`from pygame import mixer

mixer.init()                    # Inicia modulo
mixer.music.load("nome.mp3")    # Carrega arquivo
mixer.music.play()              # Reproduz música
input()                         # Aguarda entrada do usuário
event.wait()                    # Espera por um evento`,
        },
        { tipo: 'alerta', icone: '🎵', texto: 'Essas funções são usadas para tocar música .mp3' },

        { tipo: 'subtitulo', texto: 'operator.itemgetter — Ordenação avançada' },
        { tipo: 'texto', texto: '`from operator import itemgetter` — Importa a função `itemgetter` do módulo `operator`, que serve para **ordenar listas de tuplas, dicionários ou listas de listas** com base em **um ou mais índices/chaves**.' },
        {
          tipo: 'codigo',
          codigo:
`from operator import itemgetter

lista = [("João", 20), ("Maria", 18), ("Pedro", 22)]
ordenada = sorted(lista, key=itemgetter(1))
print(ordenada)
# Resultado: [('Maria', 18), ('João', 20), ('Pedro', 22)]`,
        },
        { tipo: 'alerta', icone: '🔎', texto: 'O `itemgetter(1)` indica que a ordenação será feita pelo segundo item da tupla (índice 1).' },
      ],
    },

  ],
};