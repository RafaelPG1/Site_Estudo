/* =============================================
   CONTENT — content/atlas/python.js
   Localização: content/atlas/python.js

   Contém APENAS o conteúdo da disciplina Python.
   Todos os metadados (title, desc, type, time,
   icon, theme) foram movidos para atlas/manifest.js.
   ============================================= */

'use strict';

window.__nexusatlas = {

  secoes: [

    /* ══════════════════════════════════════════
       INTRODUÇÃO
    ══════════════════════════════════════════ */
    {
      titulo: 'Introdução',
      blocos: [
        {
          tipo: 'texto',
          texto: 'Esta documentação reúne todo o conteúdo de Python organizado em três Mundos, do mais básico ao mais avançado. O objetivo é servir como material de consulta rápida e revisão — cada seção é independente e pode ser usada como referência pontual.'
        },
        {
          tipo: 'tabela',
          cabecalho: ['Mundo', 'Foco principal'],
          linhas: [
            ['Mundo 1', 'Sintaxe básica: entrada/saída, variáveis, tipos, operadores, strings, módulos, condições simples, formatação ANSI'],
            ['Mundo 2', 'Tempo (`datetime`, `time`), condições aninhadas, laços de repetição (`for`, `while`, `break`)'],
            ['Mundo 3', 'Estruturas de dados (tuplas, listas, dicionários), ordenação avançada, funções'],
          ]
        },
        {
          tipo: 'alerta',
          icone: '💡',
          texto: 'Use `Ctrl+F` (ou `Cmd+F`) para localizar rapidamente um tópico específico dentro desta página.'
        }
      ]
    },

    /* ══════════════════════════════════════════
       MUNDO 1 — FUNDAMENTOS
    ══════════════════════════════════════════ */
    {
      titulo: 'Mundo 1 — Fundamentos',
      blocos: [

        /* — Comandos básicos — */
        { tipo: 'subtitulo', texto: '📌 Comandos Básicos: print() e input()' },
        {
          tipo: 'texto',
          texto: 'Todo programa precisa, no mínimo, mostrar informações na tela e — muitas vezes — receber dados de quem está usando. Em Python, isso é feito com duas funções fundamentais.'
        },
        {
          tipo: 'texto',
          texto: '**`print()`** — exibe informações na tela.'
        },
        {
          tipo: 'codigo',
          codigo:
`print("Olá, mundo!")
# Saída: Olá, mundo!

nome = "Ana"
idade = 25
print(f"{nome} tem {idade} anos.")
# Saída: Ana tem 25 anos.`
        },
        {
          tipo: 'texto',
          texto: '**`input()`** — recebe informações do usuário (geralmente usada com `print`). O valor digitado é **sempre retornado como string**.'
        },
        {
          tipo: 'codigo',
          codigo:
`nome = input("Qual seu nome? ")
print(f"Bem-vindo, {nome}!")

# Para números, é necessário converter:
idade = int(input("Sua idade: "))`
        },
        {
          tipo: 'alerta',
          icone: '⚠️',
          texto: 'Erro comum: esquecer que `input()` sempre retorna texto. Se você precisa de um número, converta com `int()` ou `float()`.'
        },

        /* — Variáveis — */
        { tipo: 'subtitulo', texto: '🧠 Variáveis' },
        {
          tipo: 'texto',
          texto: 'Variáveis armazenam valores que podem ser reutilizados no código. Em Python não é necessário declarar o tipo — ele é identificado automaticamente.'
        },
        {
          tipo: 'codigo',
          codigo:
`nome = "Carlos"
idade = 30
altura = 1.78
ativo = True`
        },
        {
          tipo: 'destaque',
          texto: 'Boa prática: use nomes descritivos (`idade` em vez de `i`) e siga o padrão `snake_case` (`nome_completo`, não `nomeCompleto`).'
        },

        /* — Tipos primitivos — */
        { tipo: 'subtitulo', texto: '🔢 Tipos Primitivos' },
        {
          tipo: 'texto',
          texto: 'Categorias básicas de dados reconhecidas nativamente pelo Python.'
        },
        {
          tipo: 'tabela',
          cabecalho: ['Tipo', 'Descrição', 'Exemplo'],
          linhas: [
            ['`int`', 'números inteiros', '`10`, `5`, `-3`'],
            ['`float`', 'números decimais', '`3.14`, `2.5`'],
            ['`bool`', 'valores lógicos', '`True`, `False`'],
            ['`str`', 'texto entre aspas', '`"olá"`'],
          ]
        },
        {
          tipo: 'codigo',
          codigo:
`a = 10
print(type(a))  # <class 'int'>`
        },

        /* — Peculiaridades de strings — */
        { tipo: 'subtitulo', texto: '🧪 Peculiaridades de Strings' },
        {
          tipo: 'texto',
          texto: 'Strings possuem métodos próprios para verificar características do texto. Todos retornam `True` ou `False`. Exemplo base: `a = "Legal"`.'
        },
        {
          tipo: 'tabela',
          cabecalho: ['Método', 'Verifica'],
          linhas: [
            ['`a.isspace()`', 'True se for composto só por espaços'],
            ['`a.isnumeric()`', 'True se tiver apenas números'],
            ['`a.isalpha()`', 'True se tiver apenas letras'],
            ['`a.isalnum()`', 'True se tiver letras e/ou números'],
            ['`a.isupper()`', 'True se estiver tudo em maiúsculas'],
            ['`a.islower()`', 'True se estiver tudo em minúsculas'],
            ['`a.istitle()`', 'True se cada palavra começar com maiúscula'],
          ]
        },
        {
          tipo: 'codigo',
          codigo:
`idade = input("Digite sua idade: ")

if idade.isnumeric():
    print("Idade válida!")
else:
    print("Por favor, digite apenas números.")`
        },

        /* — Operações aritméticas — */
        { tipo: 'subtitulo', texto: '➕ Operações Aritméticas e Ordem de Precedência' },
        {
          tipo: 'tabela',
          cabecalho: ['Operador', 'Operação'],
          linhas: [
            ['`+`', 'adição'],
            ['`-`', 'subtração'],
            ['`*`', 'multiplicação'],
            ['`/`', 'divisão'],
            ['`**`', 'exponenciação'],
            ['`//`', 'divisão inteira'],
            ['`%`', 'resto da divisão (módulo)'],
          ]
        },
        {
          tipo: 'tabela',
          cabecalho: ['Ordem', 'Operadores'],
          linhas: [
            ['1º', '`()`'],
            ['2º', '`**`'],
            ['3º', '`*`, `/`, `//`, `%`'],
            ['4º', '`+`, `-`'],
          ]
        },
        {
          tipo: 'codigo',
          codigo:
`resultado = (2 + 3) * 4 ** 2 // 5
print(resultado)
# Passo a passo: (5) * 16 // 5 = 80 // 5 = 16`
        },
        {
          tipo: 'destaque',
          texto: 'Dica: assim como na matemática, use parênteses para deixar a intenção do cálculo clara e evitar erros de prioridade.'
        },

        /* — Operadores relacionais — */
        { tipo: 'subtitulo', texto: '🟰 Operadores Relacionais' },
        {
          tipo: 'texto',
          texto: 'Comparam dois valores e retornam `True` ou `False`. São a base para criar condições.'
        },
        {
          tipo: 'tabela',
          cabecalho: ['Operação', 'Sinal', 'Significado'],
          linhas: [
            ['Igualdade', '`==`', 'é igual a'],
            ['Diferença', '`!=`', 'é diferente de'],
            ['Maior que', '`>`', 'é maior que'],
            ['Menor que', '`<`', 'é menor que'],
            ['Maior ou igual', '`>=`', 'é maior ou igual a'],
            ['Menor ou igual', '`<=`', 'é menor ou igual a'],
          ]
        },
        {
          tipo: 'alerta',
          icone: '⚠️',
          texto: 'Erro comum: confundir `=` (atribuição) com `==` (comparação).'
        },

        /* — Módulos — */
        { tipo: 'subtitulo', texto: '📦 Módulos' },
        {
          tipo: 'texto',
          texto: 'Módulos são bibliotecas externas (ou internas do Python) que adicionam funcionalidades prontas ao código, evitando reescrever tudo do zero.'
        },
        {
          tipo: 'texto',
          texto: '**`import`** — traz bibliotecas externas para o código.'
        },
        {
          tipo: 'codigo',
          codigo:
`import math
print(math.sqrt(16))  # 4.0`
        },
        {
          tipo: 'texto',
          texto: '**`from biblioteca import codigo`** — importa apenas uma parte específica de uma biblioteca, evitando carregar tudo. Útil para deixar o programa mais leve e direto.'
        },
        {
          tipo: 'codigo',
          codigo:
`from math import sqrt
print(sqrt(16))  # 4.0`
        },

        { tipo: 'subtitulo', texto: '📐 math — Funções matemáticas' },
        {
          tipo: 'tabela',
          cabecalho: ['Função', 'Descrição'],
          linhas: [
            ['`ceil()`', 'arredonda para cima'],
            ['`floor()`', 'arredonda para baixo'],
            ['`trunc()`', 'retorna a parte inteira'],
            ['`pow(x, y)`', 'x elevado a y'],
            ['`sqrt()`', 'raiz quadrada'],
            ['`factorial()`', 'fatorial'],
            ['`radians()`', 'converte graus em radianos'],
            ['`sin()`, `cos()`, `tan()`', 'funções trigonométricas (usam radianos)'],
            ['`hypot()`', 'calcula a hipotenusa'],
          ]
        },
        {
          tipo: 'codigo',
          codigo:
`import math

cateto_a = 3
cateto_b = 4
hipotenusa = math.hypot(cateto_a, cateto_b)
print(f"A hipotenusa mede {hipotenusa}")  # 5.0`
        },

        { tipo: 'subtitulo', texto: '🎲 random — Aleatoriedade' },
        {
          tipo: 'tabela',
          cabecalho: ['Função', 'Descrição'],
          linhas: [
            ['`choice(lista)`', 'escolhe um item aleatório da lista'],
            ['`shuffle(lista)`', 'embaralha os itens da lista'],
            ['`randint(x, y)`', 'gera número aleatório entre x e y'],
          ]
        },
        {
          tipo: 'codigo',
          codigo:
`import random

participantes = ["Ana", "Bruno", "Carla"]
sorteado = random.choice(participantes)
print(f"O sorteado foi: {sorteado}")`
        },

        { tipo: 'subtitulo', texto: '🎵 pygame — Jogos e multimídia' },
        {
          tipo: 'texto',
          texto: 'Usado para criar jogos, animações e reproduzir áudio.'
        },
        {
          tipo: 'codigo',
          codigo:
`from pygame import mixer

mixer.init()                    # Inicia o módulo
mixer.music.load("nome.mp3")    # Carrega o arquivo de áudio
mixer.music.play()              # Reproduz a música
input()                         # Aguarda entrada do usuário (evita que o programa feche)
event.wait()                    # Espera por um evento do pygame`
        },
        {
          tipo: 'alerta',
          icone: '🎵',
          texto: 'Essas funções são usadas especificamente para reproduzir arquivos `.mp3`.'
        },

        /* — Manipulação de strings — */
        { tipo: 'subtitulo', texto: '✏️ Manipulação de Texto (Strings)' },
        {
          tipo: 'texto',
          texto: '**Fatiamento (slicing)** — permite acessar partes específicas de uma string através de índices. Sintaxe geral: `string[início:fim:passo]`.'
        },
        {
          tipo: 'codigo',
          codigo:
`frase = "curso em video"

frase[9]         # caractere na posição 9         -> "v"
frase[9:14]      # caracteres da posição 9 a 13    -> "video"
frase[9:14:2]    # da posição 9 a 13, pulando 2     -> "vdo"
frase[:5]        # do início até a posição 4        -> "curso"
frase[9:]        # da posição 9 até o fim            -> "video"
frase[5::3]      # da posição 5 até o fim, pulando 3 -> "e ie"`
        },

        { tipo: 'subtitulo', texto: 'Análise de Strings' },
        {
          tipo: 'tabela',
          cabecalho: ['Função/Método', 'Descrição'],
          linhas: [
            ['`len(frase)`', 'quantidade de caracteres'],
            ['`frase.count("o")`', 'quantas vezes "o" aparece'],
            ['`frase.count("o", 0, 13)`', 'conta "o" entre os índices 0 e 12'],
            ['`frase.find("deo")`', 'retorna o índice onde "deo" começa (`11`)'],
            ['`frase.find("python")`', 'retorna `-1` se não encontrar'],
            ['`"curso" in frase`', 'verifica se "curso" existe na frase'],
          ]
        },

        { tipo: 'subtitulo', texto: 'Transformações de String' },
        {
          tipo: 'tabela',
          cabecalho: ['Método', 'Descrição'],
          linhas: [
            ['`frase.replace(x, y)`', 'substitui x por y'],
            ['`frase.upper()`', 'transforma em maiúsculas'],
            ['`frase.lower()`', 'transforma em minúsculas'],
            ['`frase.capitalize()`', 'apenas o 1º caractere em maiúsculo'],
            ['`frase.title()`', 'cada palavra com inicial maiúscula'],
            ['`frase.strip()`', 'remove espaços do início e fim'],
            ['`frase.lstrip()`', 'remove espaços apenas do início'],
            ['`frase.rstrip()`', 'remove espaços apenas do fim'],
          ]
        },

        { tipo: 'subtitulo', texto: 'Divisão, Junção e outras operações' },
        {
          tipo: 'texto',
          texto: '**Divisão — `split()`**: separa a string por espaços (ou outro delimitador) e cria uma lista.'
        },
        {
          tipo: 'codigo',
          codigo:
`frase = "curso em video"
palavras = frase.split()
print(palavras)  # ['curso', 'em', 'video']`
        },
        {
          tipo: 'texto',
          texto: '**Junção — `join()`**: junta os caracteres/itens usando um separador.'
        },
        {
          tipo: 'codigo',
          codigo:
`print(" - ".join(frase))
# Junta caractere a caractere usando "-" como separador`
        },
        {
          tipo: 'texto',
          texto: '**Adicionar item a uma lista** e **preencher com zeros à esquerda**:'
        },
        {
          tipo: 'codigo',
          codigo:
`numeros = []
numero = 5
numeros.append(numero)

codigo = "7"
print(codigo.zfill(3))  # "007"`
        },

        { tipo: 'subtitulo', texto: '🧾 Alinhamento de Texto em print()' },
        {
          tipo: 'texto',
          texto: 'Usando f-strings, é possível alinhar conteúdo dentro de um espaço de largura fixa. `n` representa a largura total reservada para o texto.'
        },
        {
          tipo: 'tabela',
          cabecalho: ['Símbolo', 'Nome', 'Alinhamento'],
          linhas: [
            ['`:<n`', 'Esquerda', 'alinha à esquerda'],
            ['`:>n`', 'Direita', 'alinha à direita'],
            ['`:^n`', 'Centralizado', 'alinha ao centro'],
          ]
        },
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
# 3º Lu             <- fim`
        },
        {
          tipo: 'destaque',
          texto: 'Útil para deixar colunas alinhadas visualmente, mesmo com textos de tamanhos diferentes — muito usado em relatórios e tabelas no terminal.'
        },

        /* — Condições — */
        { tipo: 'subtitulo', texto: '🔀 Condições' },
        {
          tipo: 'texto',
          texto: '**Condição simples** — executa um bloco de código somente se a condição for verdadeira.'
        },
        {
          tipo: 'codigo',
          codigo:
`if condicao:
    # código executado se for verdadeiro`
        },
        {
          tipo: 'texto',
          texto: '**Condição composta** — executa um bloco se a condição for verdadeira, e outro se for falsa.'
        },
        {
          tipo: 'codigo',
          codigo:
`idade = int(input("Digite sua idade: "))

if idade >= 18:
    print("Você é maior de idade.")
else:
    print("Você é menor de idade.")`
        },

        /* — ANSI — */
        { tipo: 'subtitulo', texto: '🎨 ANSI — Formatação no Terminal' },
        {
          tipo: 'texto',
          texto: 'Sequências especiais de escape que permitem colorir e estilizar texto exibido no terminal. Sintaxe geral: `\\033[estilo;texto;fundo m`.'
        },
        {
          tipo: 'tabela',
          cabecalho: ['Código', 'Estilo'],
          linhas: [
            ['`0`', 'normal'],
            ['`1`', 'negrito'],
            ['`4`', 'sublinhado'],
            ['`7`', 'inverte as cores'],
          ]
        },
        {
          tipo: 'tabela',
          cabecalho: ['Código', 'Cor do texto (padrão)'],
          linhas: [
            ['`30`', 'preto'], ['`31`', 'vermelho'], ['`32`', 'verde'], ['`33`', 'amarelo'],
            ['`34`', 'azul'], ['`35`', 'roxo (magenta)'], ['`36`', 'ciano'], ['`37`', 'branco'],
          ]
        },
        {
          tipo: 'tabela',
          cabecalho: ['Código', 'Cor do texto (brilhante)'],
          linhas: [
            ['`90`', 'preto claro (cinza)'], ['`91`', 'vermelho claro'], ['`92`', 'verde claro'], ['`93`', 'amarelo claro'],
            ['`94`', 'azul claro'], ['`95`', 'roxo claro (magenta claro)'], ['`96`', 'ciano claro'], ['`97`', 'branco brilhante'],
          ]
        },
        {
          tipo: 'tabela',
          cabecalho: ['Código', 'Cor de fundo (padrão)'],
          linhas: [
            ['`40`', 'preto'], ['`41`', 'vermelho'], ['`42`', 'verde'], ['`43`', 'amarelo'],
            ['`44`', 'azul'], ['`45`', 'roxo'], ['`46`', 'ciano'], ['`47`', 'branco'],
          ]
        },
        {
          tipo: 'tabela',
          cabecalho: ['Código', 'Cor de fundo (brilhante)'],
          linhas: [
            ['`100`', 'preto claro (cinza)'], ['`101`', 'vermelho claro'], ['`102`', 'verde claro'], ['`103`', 'amarelo claro'],
            ['`104`', 'azul claro'], ['`105`', 'roxo claro'], ['`106`', 'ciano claro'], ['`107`', 'branco brilhante'],
          ]
        },
        {
          tipo: 'codigo',
          codigo:
`print("\\033[1;31mErro: operação inválida\\033[0m")`
        },
        {
          tipo: 'alerta',
          icone: '⚠️',
          texto: 'Sempre finalize com `\\033[0m` para resetar a formatação e não "contaminar" o restante da saída do terminal.'
        },
      ]
    },

    /* ══════════════════════════════════════════
       MUNDO 2 — CONTROLE DE FLUXO
    ══════════════════════════════════════════ */
    {
      titulo: 'Mundo 2 — Controle de Fluxo',
      blocos: [

        /* — datetime — */
        { tipo: 'subtitulo', texto: '📅 Módulo datetime' },
        {
          tipo: 'texto',
          texto: 'Usado para trabalhar com datas e horários no Python.'
        },
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
print(datetime.now().time())  # Ex: 17:42:10.123456`
        },
        {
          tipo: 'tabela',
          cabecalho: ['Função', 'Descrição', 'Exemplo de saída'],
          linhas: [
            ['`date.today()`', 'retorna a data atual completa', '`2025-07-25`'],
            ['`date.today().year`', 'retorna somente o ano atual', '`2025`'],
            ['`date.today().month`', 'retorna o mês atual', '`7`'],
            ['`date.today().day`', 'retorna o dia do mês atual', '`25`'],
            ['`datetime.now()`', 'retorna data e hora atuais completas', '`2025-07-25 17:42:10.123456`'],
            ['`datetime.now().hour`', 'retorna a hora atual', '`17`'],
            ['`datetime.now().minute`', 'retorna os minutos atuais', '`42`'],
            ['`datetime.now().second`', 'retorna os segundos atuais', '`10`'],
            ['`datetime.now().time()`', 'retorna somente o horário', '`17:42:10.123456`'],
          ]
        },
        {
          tipo: 'texto',
          texto: '**Exemplo prático — registro de log:**'
        },
        {
          tipo: 'codigo',
          codigo:
`from datetime import datetime

evento = "Login realizado"
agora = datetime.now()
print(f"[{agora}] {evento}")`
        },

        /* — time — */
        { tipo: 'subtitulo', texto: '⏱️ Módulo time' },
        {
          tipo: 'texto',
          texto: 'Usado para controlar o tempo de execução do programa — criar pausas, medir duração, etc. `time.sleep(segundos)` faz o programa esperar o número de segundos especificado antes de continuar.'
        },
        {
          tipo: 'codigo',
          codigo:
`import time

for i in range(5, 0, -1):
    print(i)
    time.sleep(1)   # pausa 1 segundo a cada iteração
print("Tempo esgotado!")`
        },

        /* — Condições aninhadas — */
        { tipo: 'subtitulo', texto: '🔄 Condições Aninhadas' },
        {
          tipo: 'texto',
          texto: 'São estruturas de decisão dentro de outras, permitindo avaliar múltiplas condições em sequência.'
        },
        {
          tipo: 'codigo',
          codigo:
`if condicao_1:
    pass  # Bloco 1
elif condicao_2:
    pass  # Bloco 2
else:
    pass  # Bloco 3`
        },
        {
          tipo: 'lista',
          itens: [
            '**if**: executa o bloco se a condição for verdadeira.',
            '**elif** (else if): executa o bloco se a condição do `if` for falsa e a condição do `elif` for verdadeira.',
            '**else**: executa o bloco se todas as condições anteriores forem falsas.',
          ]
        },
        {
          tipo: 'texto',
          texto: '**Exemplo prático — classificação por nota:**'
        },
        {
          tipo: 'codigo',
          codigo:
`nota = float(input("Digite sua nota: "))

if nota >= 9:
    print("Conceito A")
elif nota >= 7:
    print("Conceito B")
elif nota >= 5:
    print("Conceito C")
else:
    print("Reprovado")`
        },
        {
          tipo: 'destaque',
          texto: 'Boa prática: ordene as condições da mais específica/restritiva para a mais geral, evitando que uma condição "engula" as seguintes.'
        },

        /* — for — */
        { tipo: 'subtitulo', texto: '🔁 Estrutura de Repetição for' },
        {
          tipo: 'texto',
          texto: 'Utiliza um contador para repetir um bloco de código um número definido de vezes.'
        },
        {
          tipo: 'codigo',
          codigo:
`for c in range(0, 10):
    pass  # Bloco de código`
        },
        {
          tipo: 'lista',
          itens: [
            '`range(0, 10)`: cria uma sequência de números de 0 a 9.',
            'O bloco é repetido para cada valor gerado pelo `range`.',
          ]
        },
        {
          tipo: 'codigo',
          codigo:
`for i in range(1, 6):
    print(f"Repetição número {i}")`
        },

        /* — while — */
        { tipo: 'subtitulo', texto: '🔁 Estrutura de Repetição while' },
        {
          tipo: 'texto',
          texto: 'Repete o bloco de código enquanto uma condição for verdadeira.'
        },
        {
          tipo: 'codigo',
          codigo:
`while not variavel:
    pass  # Bloco de código`
        },
        {
          tipo: 'texto',
          texto: '**Exemplo prático — validação de senha:**'
        },
        {
          tipo: 'codigo',
          codigo:
`senha_correta = False

while not senha_correta:
    senha = input("Digite a senha: ")
    if senha == "1234":
        senha_correta = True
        print("Acesso liberado!")
    else:
        print("Senha incorreta, tente novamente.")`
        },

        /* — break — */
        { tipo: 'subtitulo', texto: '🛑 Laços de Repetição: usando break' },
        {
          tipo: 'texto',
          texto: 'A palavra-chave `break` permite interromper um laço de repetição antes que sua condição seja totalmente atendida.'
        },
        {
          tipo: 'codigo',
          codigo:
`while True:
    comando = input("Digite 'sair' para encerrar: ")
    if comando == "sair":
        print("Encerrando o programa...")
        break  # Interrompe o laço imediatamente
    print(f"Você digitou: {comando}")`
        },
        {
          tipo: 'alerta',
          icone: '⚠️',
          texto: 'Usar `while True` sem uma condição de `break` clara pode gerar um loop infinito, travando o programa.'
        },
      ]
    },

    /* ══════════════════════════════════════════
       MUNDO 3 — ESTRUTURAS DE DADOS E FUNÇÕES
    ══════════════════════════════════════════ */
    {
      titulo: 'Mundo 3 — Estruturas de Dados e Funções',
      blocos: [

        /* — Tuplas — */
        { tipo: 'subtitulo', texto: '🔒 Tuplas ( )' },
        {
          tipo: 'texto',
          texto: 'Estruturas de dados **imutáveis** — uma vez criadas, não podem ser modificadas (não é possível adicionar, remover ou alterar itens). Usam parênteses `()`.'
        },
        {
          tipo: 'codigo',
          codigo:
`lanche = ("hambúrguer", "suco", "pizza", "pudim")
print(lanche)
# Resultado: ('hambúrguer', 'suco', 'pizza', 'pudim')`
        },

        { tipo: 'subtitulo', texto: 'Percorrendo Tuplas com for' },
        {
          tipo: 'texto',
          texto: '**1. Iterando por valor:**'
        },
        {
          tipo: 'codigo',
          codigo:
`for comida in lanche:
    print(comida)
# hambúrguer / suco / pizza / pudim`
        },
        {
          tipo: 'texto',
          texto: '**2. Iterando por índice e valor — usando `enumerate()`:**'
        },
        {
          tipo: 'codigo',
          codigo:
`for pos, comida in enumerate(lanche):
    print(f"{comida} está na posição {pos}")
# hambúrguer está na posição 0
# suco está na posição 1
# pizza está na posição 2
# pudim está na posição 3`
        },
        {
          tipo: 'texto',
          texto: '**3. Iterando com `range()` e `len()`:**'
        },
        {
          tipo: 'codigo',
          codigo:
`for i in range(0, len(lanche)):
    print(f"Comi {lanche[i]} na posição {i}")`
        },
        {
          tipo: 'destaque',
          texto: 'Prefira `enumerate()` em vez de `range(len(...))` — é mais legível e mais "pythônico".'
        },

        { tipo: 'subtitulo', texto: 'Operações com Tuplas' },
        {
          tipo: 'texto',
          texto: '**Ordenar uma tupla** — como tuplas são imutáveis, `sorted()` retorna uma nova lista ordenada (a tupla original não é alterada).'
        },
        {
          tipo: 'codigo',
          codigo:
`print(sorted(lanche))
# Resultado: ['hambúrguer', 'pizza', 'pudim', 'suco']`
        },
        {
          tipo: 'texto',
          texto: '**Juntar duas tuplas:**'
        },
        {
          tipo: 'codigo',
          codigo:
`a = (2, 3, 4)
b = (5, 6, 7)
c = a + b
print(c)
# Resultado: (2, 3, 4, 5, 6, 7)`
        },
        {
          tipo: 'texto',
          texto: '**Funções úteis, máximo/mínimo e tipos diferentes:**'
        },
        {
          tipo: 'codigo',
          codigo:
`tupla = (2, 4, 2, 9, 2)
print(tupla.count(2))   # conta o valor 2 -> 3
print(tupla.index(4))   # posição do valor 4 -> 1

numeros = (8, 3, 6, 2)
print(max(numeros))  # 8
print(min(numeros))  # 2

pessoa = ("Rafael", 18, "M", 1.77)
print(pessoa)`
        },
        {
          tipo: 'texto',
          texto: '**Deletar uma tupla por completo:**'
        },
        {
          tipo: 'codigo',
          codigo: `del tupla`
        },
        {
          tipo: 'alerta',
          icone: '⚠️',
          texto: 'Não existe `tupla.remove()` ou `tupla.append()` — qualquer tentativa de alterar item a item gera `TypeError`. O único jeito de "modificar" é criar uma tupla nova.'
        },

        /* — Listas — */
        { tipo: 'subtitulo', texto: '📚 Listas [ ]' },
        {
          tipo: 'texto',
          texto: 'Estruturas de dados **mutáveis** que armazenam uma sequência ordenada de itens, podendo conter diferentes tipos. Usam colchetes `[]`.'
        },
        {
          tipo: 'codigo',
          codigo:
`lista = ["maçã", "banana", "laranja"]
print(lista)
# Resultado: ['maçã', 'banana', 'laranja']`
        },

        { tipo: 'subtitulo', texto: 'Operações com Listas' },
        {
          tipo: 'texto',
          texto: '**Adicionar elementos:**'
        },
        {
          tipo: 'codigo',
          codigo:
`lista = ["maçã", "banana", "laranja"]

lista.append("uva")       # adiciona no final
lista.insert(1, "kiwi")   # adiciona na posição 1
print(lista)
# Resultado: ['maçã', 'kiwi', 'banana', 'laranja', 'uva']`
        },
        {
          tipo: 'texto',
          texto: '**Remover elementos:**'
        },
        {
          tipo: 'tabela',
          cabecalho: ['Comando', 'Remove por...'],
          linhas: [
            ['`del lista[i]`', 'índice'],
            ['`lista.pop(i)`', 'índice (e retorna o valor removido)'],
            ['`lista.remove(valor)`', 'valor (precisa existir na lista)'],
            ['`lista.pop()`', 'último item'],
            ['`lista.clear()`', 'todos os itens'],
          ]
        },
        {
          tipo: 'texto',
          texto: '**Criar listas automaticamente e ordenar:**'
        },
        {
          tipo: 'codigo',
          codigo:
`valores = list(range(4, 11))
print(valores)
# Resultado: [4, 5, 6, 7, 8, 9, 10]

valores = [5, 1, 8, 3]
valores.sort()               # ordem crescente -> [1, 3, 5, 8]
valores.sort(reverse=True)    # ordem decrescente -> [8, 5, 3, 1]`
        },

        { tipo: 'subtitulo', texto: 'Ligações vs Cópias' },
        {
          tipo: 'texto',
          texto: 'Um dos pontos mais importantes ao trabalhar com listas: atribuir uma lista a outra variável não cria uma cópia — cria uma segunda referência ao mesmo objeto.'
        },
        {
          tipo: 'codigo',
          codigo:
`a = [1, 2, 3]
b = a            # ligação: 'b' e 'a' apontam para a MESMA lista

a[0] = 99
print(b)
# Resultado: [99, 2, 3] -> 'b' também mudou

c = a[:]         # cópia: 'c' recebe uma cópia independente de 'a'
a[0] = 100
print(c)
# Resultado: [99, 2, 3] -> 'c' não muda, pois é uma cópia feita ANTES da alteração`
        },
        {
          tipo: 'alerta',
          icone: '⚠️',
          texto: 'Erro comum: achar que `b = a` cria uma lista nova. Para copiar de verdade, use `a[:]`, `list(a)` ou `a.copy()`.'
        },

        { tipo: 'subtitulo', texto: 'Listas dentro de Listas (Matrizes)' },
        {
          tipo: 'codigo',
          codigo:
`pessoas = [["Rafael", 18], ["Maria", 19]]

print(pessoas[0][0])   # Rafael
print(pessoas[1][1])   # 19
print(pessoas[1])      # ['Maria', 19]`
        },
        {
          tipo: 'texto',
          texto: '**Adicionar itens em listas internas:**'
        },
        {
          tipo: 'codigo',
          codigo:
`grupo = [[], []]
grupo[0].append("João")
grupo[1].append("Ana")
print(grupo)
# Resultado: [['João'], ['Ana']]`
        },

        { tipo: 'subtitulo', texto: 'Função enumerate()' },
        {
          tipo: 'texto',
          texto: 'Permite acessar o índice e o valor de uma lista (ou iterável) ao mesmo tempo dentro de um `for`.'
        },
        {
          tipo: 'codigo',
          codigo:
`valores = [10, 20, 30]
for i, v in enumerate(valores):
    print(f"Na posição {i} encontrei o valor {v}")`
        },

        /* — Dicionários — */
        { tipo: 'subtitulo', texto: '🗂️ Dicionários { }' },
        {
          tipo: 'texto',
          texto: 'Dicionários são estruturas compostas por pares **chave:valor**, onde a chave é única (normalmente uma string) e funciona como um índice nomeado — ao contrário das listas, que usam posições numéricas.'
        },
        {
          tipo: 'codigo',
          codigo:
`dados = dict()                            # opção 1 — dicionário vazio
dados = {"nome": "Pedro", "idade": 25}    # opção 2 — já com valores
print(dados)
# Resultado: {'nome': 'Pedro', 'idade': 25}`
        },

        { tipo: 'subtitulo', texto: 'Operações com Dicionários' },
        {
          tipo: 'texto',
          texto: '**Adicionar, remover e substituir:**'
        },
        {
          tipo: 'codigo',
          codigo:
`dados = {"nome": "Pedro", "idade": 25}

dados["sexo"] = "M"               # adiciona novo par
print(dados)

del dados["idade"]                 # remove um par
print(dados)

dados["nome"] = "Rafael"           # substitui um valor existente
print(dados)`
        },
        {
          tipo: 'texto',
          texto: '**Exemplo completo e funções úteis:**'
        },
        {
          tipo: 'codigo',
          codigo:
`filme = {
    "titulo": "Star Wars",
    "ano": 1977,
    "diretor": "George Lucas"
}

print(filme.values())
# dict_values(['Star Wars', 1977, 'George Lucas'])

print(filme.keys())
# dict_keys(['titulo', 'ano', 'diretor'])

print(filme.items())
# dict_items([('titulo', 'Star Wars'), ('ano', 1977), ('diretor', 'George Lucas')])`
        },
        {
          tipo: 'tabela',
          cabecalho: ['Método', 'Retorna'],
          linhas: [
            ['`filme.values()`', 'todos os valores'],
            ['`filme.keys()`', 'todas as chaves'],
            ['`filme.items()`', 'pares chave-valor como tuplas'],
          ]
        },
        {
          tipo: 'texto',
          texto: '**Percorrer um dicionário com `for`:**'
        },
        {
          tipo: 'codigo',
          codigo:
`for k, v in filme.items():
    print(f"O {k} é {v}")
# O titulo é Star Wars
# O ano é 1977
# O diretor é George Lucas`
        },

        { tipo: 'subtitulo', texto: 'Combinando Dicionários e Listas' },
        {
          tipo: 'texto',
          texto: '**Lista de dicionários:**'
        },
        {
          tipo: 'codigo',
          codigo:
`locadora = []

filme1 = {"titulo": "Star Wars", "ano": 1977, "diretor": "George Lucas"}
filme2 = {"titulo": "Avengers", "ano": 2012, "diretor": "Joss Whedon"}
filme3 = {"titulo": "Matrix", "ano": 1999, "diretor": "Wachowski"}

locadora.append(filme1)
locadora.append(filme2)
locadora.append(filme3)

print(locadora[0]["ano"])        # 1977
print(locadora[2]["titulo"])      # Matrix
print(locadora[1]["diretor"])     # Joss Whedon`
        },
        {
          tipo: 'alerta',
          icone: '⚠️',
          texto: 'Erro comum: `brasil["UF"]` quando `brasil` é uma lista de dicionários gera `list indices must be integers`. É preciso acessar primeiro o índice da lista e só depois a chave: `brasil[0]["UF"]`.'
        },

        { tipo: 'subtitulo', texto: 'A importância do .copy()' },
        {
          tipo: 'texto',
          texto: 'Sem `.copy()`, todos os dicionários adicionados a uma lista apontariam para o mesmo objeto na memória — alterar um, alteraria todos. Com `.copy()`, cada item da lista se torna um dicionário independente.'
        },
        {
          tipo: 'codigo',
          codigo:
`estado = {}
brasil = []

estado["uf"] = "Minas Gerais"
estado["sigla"] = "MG"
brasil.append(estado.copy())   # cópia real

estado["uf"] = "Bahia"
estado["sigla"] = "BA"
brasil.append(estado.copy())

print(brasil)
# [{'uf': 'Minas Gerais', 'sigla': 'MG'}, {'uf': 'Bahia', 'sigla': 'BA'}]`
        },
        {
          tipo: 'destaque',
          texto: 'Boa prática: sempre que reutilizar a mesma variável de dicionário dentro de um laço para acumular dados em uma lista, use `.copy()`. Esse é um dos erros mais comuns e difíceis de detectar para quem está aprendendo.'
        },

        /* — itemgetter — */
        { tipo: 'subtitulo', texto: '📦 Módulo operator — Ordenação Avançada' },
        {
          tipo: 'texto',
          texto: '`from operator import itemgetter` importa a função usada para ordenar listas de tuplas, dicionários ou listas de listas com base em um ou mais índices/chaves específicos.'
        },
        {
          tipo: 'codigo',
          codigo:
`from operator import itemgetter

lista = [("João", 20), ("Maria", 18), ("Pedro", 22)]
ordenada = sorted(lista, key=itemgetter(1))
print(ordenada)
# Resultado: [('Maria', 18), ('João', 20), ('Pedro', 22)]`
        },
        {
          tipo: 'alerta',
          icone: '🔎',
          texto: '`itemgetter(1)` indica que a ordenação deve ser feita pelo segundo item de cada tupla (índice 1 — no caso, a idade).'
        },

        /* — Funções — */
        { tipo: 'subtitulo', texto: '🧠 Funções' },
        {
          tipo: 'texto',
          texto: 'Funções são rotinas reutilizáveis que executam comandos específicos. Servem para organizar o código, evitar repetição e facilitar manutenção e leitura.'
        },
        {
          tipo: 'texto',
          texto: '**Função básica, sem parâmetros:**'
        },
        {
          tipo: 'codigo',
          codigo:
`def mostraLinha():
    print('----------------')

mostraLinha()  # chamada da função`
        },
        {
          tipo: 'texto',
          texto: '**Função com parâmetro:**'
        },
        {
          tipo: 'codigo',
          codigo:
`def mensagem(msg):
    print('----------------')
    print(msg)
    print('----------------')

mensagem('Sistema de Alunos')`
        },
        {
          tipo: 'texto',
          texto: '**Função com cálculo simples — chamada posicional vs nomeada:**'
        },
        {
          tipo: 'codigo',
          codigo:
`def soma(a, b):
    s = a + b
    print(s)

soma(4, 5)         # chamada posicional
soma(a=4, b=5)     # chamada nomeada — mais clara em funções com muitos parâmetros`
        },
        {
          tipo: 'texto',
          texto: '**Desempacotando múltiplos valores — `*args`:**'
        },
        {
          tipo: 'codigo',
          codigo:
`def contador(*num):
    print(num)

contador(2, 1, 7)
# Resultado: (2, 1, 7)`
        },
        {
          tipo: 'destaque',
          texto: 'O `*num` permite passar uma quantidade variável de argumentos. Internamente, eles chegam agrupados em uma tupla.'
        },
        {
          tipo: 'texto',
          texto: '**Função que modifica uma lista (efeito colateral):**'
        },
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
# Resultado: [14, 4, 10]`
        },
        {
          tipo: 'alerta',
          icone: '⚠️',
          texto: 'Como listas são mutáveis, a função altera a lista original diretamente — não é criada uma cópia. Isso é diferente do comportamento de tipos imutáveis (`int`, `str`) passados como parâmetro.'
        },

        { tipo: 'subtitulo', texto: 'Recursos Avançados de Funções' },
        {
          tipo: 'texto',
          texto: '**Ajuda interativa — `help()`**: manual interativo embutido no Python.'
        },
        {
          tipo: 'codigo',
          codigo:
`help()

# Consultar documentação de uma função específica:
print(input.__doc__)`
        },
        {
          tipo: 'texto',
          texto: '**Docstrings**: comentários especiais dentro de uma função que explicam seu funcionamento. São usados pelo próprio `help()`.'
        },
        {
          tipo: 'codigo',
          codigo:
`def soma(a, b):
    """
    Recebe dois números e imprime a soma.
    """
    print(a + b)`
        },
        {
          tipo: 'destaque',
          texto: 'Boa prática: sempre documente funções complexas com docstrings — facilita a manutenção futura e ajuda outras pessoas (ou você mesmo, semanas depois) a entender o propósito da função.'
        },
        {
          tipo: 'texto',
          texto: '**Parâmetros opcionais (valores padrão):**'
        },
        {
          tipo: 'codigo',
          codigo:
`def soma(a=0, b=0, c=0):
    s = a + b + c
    print(s)

soma(3, 2, 5)   # 10
soma(8, 4)       # 12 (c assume o valor padrão 0)`
        },

        { tipo: 'subtitulo', texto: 'Escopo de Variáveis' },
        {
          tipo: 'texto',
          texto: '**Escopo local**: variáveis declaradas dentro da função só existem ali dentro.'
        },
        {
          tipo: 'codigo',
          codigo:
`def teste(b):
    a = 8     # local
    b += 4
    c = 2     # local
    print(f'A dentro vale: {a}')
    print(f'B dentro vale: {b}')
    print(f'C dentro vale: {c}')

a = 5         # global
teste(a)
print(f'A fora vale: {a}')

# Saída:
# A dentro vale: 8
# B dentro vale: 9
# C dentro vale: 2
# A fora vale: 5   <- o 'a' global NÃO foi alterado`
        },
        {
          tipo: 'texto',
          texto: '**Escopo global**: usando a palavra-chave `global`, a função pode alterar uma variável que existe fora dela.'
        },
        {
          tipo: 'codigo',
          codigo:
`def teste(b):
    global a
    a = 8
    b += 4
    c = 2
    print(f'A dentro vale: {a}')
    print(f'B dentro vale: {b}')
    print(f'C dentro vale: {c}')

a = 5
teste(a)
print(f'A fora vale: {a}')

# Saída:
# A dentro vale: 8
# B dentro vale: 9
# C dentro vale: 2
# A fora vale: 8   <- agora o 'a' global FOI alterado`
        },
        {
          tipo: 'destaque',
          texto: 'Boa prática: evite usar `global` sempre que possível — prefira `return` para passar valores de volta. O uso excessivo de variáveis globais torna o código mais difícil de rastrear e depurar.'
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
# Resultado: 10`
        },
        {
          tipo: 'destaque',
          texto: '`return` envia o valor de volta para quem chamou a função, permitindo reutilizá-lo (diferente de `print`, que só exibe na tela).'
        },
        {
          tipo: 'texto',
          texto: '**Exemplo com múltiplas chamadas e retornos:**'
        },
        {
          tipo: 'codigo',
          codigo:
`r1 = somar(3, 2, 5)
r2 = somar(1, 7)
r3 = somar(4)
print(f'Meus cálculos deram {r1}, {r2} e {r3}')
# Resultado: Meus cálculos deram 10, 8 e 4`
        },
      ]
    },

    /* ══════════════════════════════════════════
       RESUMO GERAL
    ══════════════════════════════════════════ */
    {
      titulo: 'Resumo Geral',
      blocos: [
        {
          tipo: 'tabela',
          cabecalho: ['Mundo', 'Tópicos cobertos'],
          linhas: [
            ['Mundo 1 — Fundamentos', 'print/input, variáveis, tipos primitivos, peculiaridades de strings, aritmética e precedência, operadores relacionais, módulos (math, random, pygame), manipulação de strings, condições simples, ANSI'],
            ['Mundo 2 — Controle de Fluxo', 'datetime, time, condições aninhadas (if/elif/else), laços for e while, break'],
            ['Mundo 3 — Estruturas de Dados e Funções', 'tuplas, listas (incluindo ligações vs cópias e matrizes), dicionários (incluindo .copy()), itemgetter, funções (parâmetros, *args, escopo, return, docstrings)'],
          ]
        },
        {
          tipo: 'lista',
          itens: [
            '**Tuplas** são imutáveis; **listas** são mutáveis; **dicionários** mapeiam chave→valor.',
            'Use `enumerate()` para percorrer com índice e valor ao mesmo tempo.',
            'Cuidado com referências: `b = a` não copia uma lista, apenas cria um segundo "apontador" para o mesmo objeto.',
            'Em laços que acumulam dicionários em listas, sempre use `.copy()`.',
            'Prefira `return` a `global` para manter funções previsíveis e fáceis de testar.',
          ]
        },
        {
          tipo: 'destaque',
          texto: 'Esta documentação cobre o caminho completo de Python desde a sintaxe básica até estruturas de dados e funções — use como referência de consulta sempre que precisar relembrar uma sintaxe ou comportamento específico.'
        }
      ]
    },

  ]
};