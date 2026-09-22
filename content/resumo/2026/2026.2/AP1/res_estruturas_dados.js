/* =============================================
   NEXUS STUDY — res_analise_projeto.js
   Disciplina: analise de projeto
   ============================================= */

window.__nexusConteudo = {
  aulas: [
  // tudo
  {
  aula: "Aula 1 — Estrutura de Dados: Listas, Funções, Recursão, Classes, Complexidade, Pilhas e Filas (Material Completo para AP1)",
  ideia_central: "Material completo de revisão para a AP1 de Estrutura de Dados, cobrindo estruturas de dados em Python (listas, tuplas, dicionários, conjuntos), funções, recursão, classes e objetos, análise de complexidade (Big O), pilhas e filas, com pegadinhas de prova, exercícios comentados e um simulado completo com gabarito.",
  secoes: [
    {
      id: "estruturas-python",
      titulo: "Capítulo 1 — Listas, Dicionários e outras estruturas Python",
      blocos: [
        { tipo: "subtitulo", texto: "Por que existem várias estruturas?" },
        { tipo: "texto", texto: "Em programação, quase tudo que fazemos é guardar e organizar dados. Python nos dá quatro estruturas básicas para isso: **listas**, **tuplas**, **dicionários** e **conjuntos**. Cada uma existe porque resolve um problema diferente." },
        { tipo: "lista", itens: [
          "Quero uma coleção que eu possa **alterar** livremente → lista",
          "Quero uma coleção que **não deve mudar** → tupla",
          "Quero associar uma informação a um **nome/chave** → dicionário",
          "Quero garantir que **não existam repetições** → conjunto"
        ]},
        { tipo: "destaque", texto: "Entender qual estrutura usar em cada situação é uma das coisas mais cobradas em prova (geralmente em forma de \"qual estrutura é mais adequada para...\")." },

        { tipo: "subtitulo", texto: "Listas (list)" },
        { tipo: "topico", titulo: "O que é", texto: "Uma lista é uma **coleção ordenada e mutável** de elementos. \"Ordenada\" significa que os elementos têm uma posição fixa (índice). \"Mutável\" significa que você pode alterar, adicionar ou remover elementos depois de criada.\n`frutas = [\"maçã\", \"banana\", \"uva\"]`" },
        { tipo: "topico", titulo: "Índices", texto: "O índice sempre começa em **0**.\n`frutas = [\"maçã\", \"banana\", \"uva\"]`\n`print(frutas[0])   # maçã`\n`print(frutas[1])   # banana`\n`print(frutas[-1])  # uva (índice negativo conta do final)`" },
        { tipo: "destaque", texto: "Pegadinha de prova: `frutas[3]` nesse exemplo gera erro (`IndexError`), porque só existem os índices 0, 1 e 2. Muita gente confunde índice com \"quantidade de elementos\"." },
        { tipo: "tabela", titulo: "Operações e métodos mais importantes de listas", colunas: ["Método/Operação", "O que faz", "Exemplo"], linhas: [
          ["append(x)", "adiciona x no final", "lista.append(10)"],
          ["insert(i, x)", "insere x na posição i", "lista.insert(0, \"a\")"],
          ["remove(x)", "remove a primeira ocorrência do valor x", "lista.remove(\"banana\")"],
          ["pop()", "remove e retorna o último elemento", "lista.pop()"],
          ["pop(i)", "remove e retorna o elemento do índice i", "lista.pop(0)"],
          ["len(lista)", "retorna o tamanho da lista", "len(lista)"],
          ["sort()", "ordena a lista no lugar (in-place)", "lista.sort()"],
          ["sorted(lista)", "retorna uma nova lista ordenada", "nova = sorted(lista)"],
          ["reverse()", "inverte a ordem da lista", "lista.reverse()"],
          ["in", "verifica se um elemento existe", "\"uva\" in frutas"],
          ["+", "concatena duas listas", "[1,2] + [3,4] → [1,2,3,4]"],
          ["*", "repete a lista", "[1,2] * 2 → [1,2,1,2]"],
          ["lista[i:j]", "fatiamento (slice) — do índice i até j-1", "lista[1:3]"]
        ]},
        { tipo: "exemplo", titulo: "Exemplo comentado de operações em lista", texto: "`notas = [7.5, 8.0, 6.5]`\n`notas.append(9.0)        # notas agora é [7.5, 8.0, 6.5, 9.0]`\n`notas.remove(6.5)        # remove o valor 6.5 -> [7.5, 8.0, 9.0]`\n`print(len(notas))        # 3`\n`print(notas[1:3])        # [8.0, 9.0] -> pega do índice 1 até o 2 (o 3 não entra!)`" },
        { tipo: "destaque", texto: "Pegadinha clássica do slice: `lista[1:3]` NÃO inclui o índice 3. O segundo número do slice é sempre \"até, mas sem incluir\"." },
        { tipo: "topico", titulo: "Listas são mutáveis — cuidado com isso!", texto: "`a = [1, 2, 3]`\n`b = a          # b aponta para a MESMA lista, não é uma cópia!`\n`b.append(4)`\n`print(a)       # [1, 2, 3, 4]  -> a também mudou!`\nIsso acontece porque `a` e `b` são duas variáveis apontando para o **mesmo objeto na memória**. Se você quiser uma cópia de verdade:\n`b = a.copy()      # ou b = a[:]`\n`b.append(4)`\n`print(a)          # [1, 2, 3]  -> a não mudou`\n`print(b)          # [1, 2, 3, 4]`" },
        { tipo: "destaque", texto: "Esse é um dos erros/pegadinhas mais cobrados em prova de estrutura de dados: `b = a` não copia a lista, cria uma segunda referência ao mesmo objeto." },

        { tipo: "subtitulo", texto: "Tuplas (tuple)" },
        { tipo: "topico", titulo: "O que é", texto: "Uma tupla é uma **coleção ordenada e imutável**. Uma vez criada, você **não pode** alterar, adicionar ou remover elementos.\n`coordenada = (10, 20)`" },
        { tipo: "topico", titulo: "Por que usar tupla em vez de lista?", lista: [
          "Quando os dados **não devem mudar** (ex: coordenadas, dias da semana, uma data fixa)",
          "Tuplas são **mais rápidas e ocupam menos memória** que listas",
          "É comum usar tupla como **chave de dicionário** (lista não pode ser chave, porque chave precisa ser imutável)",
          "É comum retornar **múltiplos valores** de uma função como tupla"
        ]},
        { tipo: "exemplo", titulo: "Retorno de múltiplos valores com tupla", texto: "`def calcular(a, b):`\n`    return a + b, a - b   # retorna uma tupla (soma, subtração)`\n\n`soma, sub = calcular(10, 4)`\n`print(soma, sub)   # 14 6`" },
        { tipo: "topico", titulo: "O que NÃO pode fazer", texto: "`t = (1, 2, 3)`\n`t[0] = 99        # ERRO! TypeError: 'tuple' object does not support item assignment`\n`t.append(4)      # ERRO! tupla não tem append`" },
        { tipo: "exemplo", titulo: "Pegadinha: tupla de um elemento", texto: "`t1 = (5)         # isso NÃO é uma tupla, é só o número 5 entre parênteses!`\n`t2 = (5,)        # isso SIM é uma tupla com 1 elemento -> precisa da vírgula!`\n`print(type(t1))  # <class 'int'>`\n`print(type(t2))  # <class 'tuple'>`", detalhe: "Essa é uma pegadinha muito comum em prova!" },

        { tipo: "subtitulo", texto: "Dicionários (dict)" },
        { tipo: "topico", titulo: "O que é", texto: "Um dicionário guarda dados no formato **chave: valor**. Em vez de acessar por posição (índice), você acessa por **chave**.\n`aluno = {`\n`    \"nome\": \"João\",`\n`    \"idade\": 20,`\n`    \"curso\": \"Engenharia\"`\n`}`" },
        { tipo: "topico", titulo: "Acessando e alterando valores", texto: "`print(aluno[\"nome\"])       # João`\n`aluno[\"idade\"] = 21        # altera o valor da chave idade`\n`aluno[\"cidade\"] = \"Rio\"    # cria uma nova chave, se não existir`" },
        { tipo: "destaque", texto: "Pegadinha: acessar uma chave que não existe com `aluno[\"telefone\"]` dá erro (`KeyError`). Para evitar isso com segurança, use `.get()`: `print(aluno.get(\"telefone\"))` (retorna None) ou `print(aluno.get(\"telefone\", \"N/A\"))` (retorna \"N/A\", um valor padrão)." },
        { tipo: "tabela", titulo: "Métodos importantes de dicionários", colunas: ["Método", "O que faz"], linhas: [
          [".keys()", "retorna todas as chaves"],
          [".values()", "retorna todos os valores"],
          [".items()", "retorna pares (chave, valor)"],
          [".get(chave)", "retorna o valor ou None se não existir"],
          [".pop(chave)", "remove a chave e retorna o valor"],
          ["del dic[chave]", "remove a chave"],
          ["in", "verifica se uma chave existe"],
          ["len(dic)", "quantidade de pares chave-valor"]
        ]},
        { tipo: "topico", titulo: "Percorrendo um dicionário", texto: "`aluno = {\"nome\": \"João\", \"idade\": 20}`\n\n`for chave in aluno:`\n`    print(chave)              # imprime só as chaves: nome, idade`\n\n`for chave, valor in aluno.items():`\n`    print(chave, \"->\", valor)  # nome -> João / idade -> 20`" },
        { tipo: "destaque", texto: "Pegadinha: `for x in dicionario` percorre as **chaves**, não os valores! Muita gente esquece isso e acha que vai vir o valor." },
        { tipo: "texto", texto: "Dicionários a partir do Python 3.7+ mantêm a ordem de inserção. Isso significa que se você percorrer um dicionário, os itens aparecem na ordem em que foram inseridos (isso é frequentemente perguntado como \"dicionário tem ordem?\" — a resposta moderna é: sim, mantém a ordem de inserção, mas **não é indexado por posição como lista**)." },

        { tipo: "subtitulo", texto: "Conjuntos (set)" },
        { tipo: "topico", titulo: "O que é", texto: "Um conjunto é uma coleção **não ordenada** e que **não permite elementos repetidos**.\n`numeros = {1, 2, 3, 3, 2}`\n`print(numeros)   # {1, 2, 3}  -> repetidos somem automaticamente`" },
        { tipo: "topico", titulo: "Para que serve", texto: "Remover duplicatas de uma lista rapidamente:\n`lista = [1, 2, 2, 3, 3, 3]`\n`sem_repetidos = list(set(lista))`\n`print(sem_repetidos)   # [1, 2, 3]`\n\nFazer operações matemáticas de conjunto: união, interseção, diferença:\n`a = {1, 2, 3}`\n`b = {2, 3, 4}`\n\n`print(a | b)   # união -> {1, 2, 3, 4}`\n`print(a & b)   # interseção -> {2, 3}`\n`print(a - b)   # diferença -> {1}`" },
        { tipo: "topico", titulo: "Cuidados", lista: [
          "Conjuntos **não têm índice** (não dá pra fazer `conjunto[0]`, porque não têm ordem garantida)",
          "Só aceitam elementos **imutáveis** dentro deles (número, string, tupla — não pode colocar uma lista dentro de um set)"
        ]},
        { tipo: "exemplo", titulo: "Erro: elemento não hashable em set", texto: "`s = {1, [2,3]}   # ERRO! list não é \"hashable\" (não pode ser elemento de um set)`" },

        { tipo: "subtitulo", texto: "Percorrendo as estruturas (resumo prático)" },
        { tipo: "exemplo", titulo: "Percorrendo lista, tupla, dicionário e conjunto", texto: "`lista = [1, 2, 3]`\n`tupla = (1, 2, 3)`\n`dicionario = {\"a\": 1, \"b\": 2}`\n`conjunto = {1, 2, 3}`\n\n`for item in lista:       print(item)`          # 1 2 3\n`for item in tupla:       print(item)`          # 1 2 3\n`for chave in dicionario: print(chave)`         # a b\n`for item in conjunto:    print(item)`          # 1 2 3 (ordem não garantida)\n\n# Percorrer com índice (útil quando você precisa da posição)\n`for i in range(len(lista)):`\n`    print(i, lista[i])`\n\n# enumerate: forma mais \"pythônica\" de ter índice + valor\n`for i, valor in enumerate(lista):`\n`    print(i, valor)`" },

        { tipo: "subtitulo", texto: "Tabela comparativa (decore esta tabela — cai muito em prova!)" },
        { tipo: "tabela", titulo: "Comparação entre estruturas de dados Python", colunas: ["Estrutura", "Ordenada?", "Mutável?", "Permite repetição?", "Acesso por", "Sintaxe"], linhas: [
          ["Lista", "Sim", "Sim", "Sim", "Índice", "[1, 2, 3]"],
          ["Tupla", "Sim", "Não", "Sim", "Índice", "(1, 2, 3)"],
          ["Dicionário", "Sim (inserção)", "Sim", "Chaves não podem repetir", "Chave", "{\"a\": 1}"],
          ["Conjunto", "Não", "Sim", "Não", "Não há acesso por posição", "{1, 2, 3}"]
        ]},

        { tipo: "subtitulo", texto: "Erros comuns e pegadinhas de prova (resumo)" },
        { tipo: "lista", itens: [
          "Confundir `lista[1:3]` achando que inclui o índice 3.",
          "Esquecer que `b = a` (lista) não cria cópia — cria uma segunda referência para o mesmo objeto.",
          "Achar que `(5)` é uma tupla (precisa da vírgula: `(5,)`).",
          "Tentar alterar uma tupla (TypeError).",
          "Achar que `for x in dicionario` traz o valor, quando na verdade traz a chave.",
          "Acessar uma chave inexistente com `dic[\"chave\"]` e receber KeyError (usar `.get()` evita isso).",
          "Achar que dicionário e conjunto têm índice numérico — eles não têm.",
          "Achar que `set` pode conter listas — não pode."
        ]},

           ]
    },
    {
      id: "funcoes-python",
      titulo: "Capítulo 2 — Funções em Python",
      blocos: [
        { tipo: "subtitulo", texto: "O que é uma função" },
        { tipo: "texto", texto: "Uma função é um **bloco de código reutilizável** que executa uma tarefa específica. Em vez de repetir o mesmo código várias vezes, escrevemos uma vez dentro de uma função e a \"chamamos\" sempre que precisarmos.\n`def saudacao():`\n`    print(\"Olá!\")`\n\n`saudacao()   # chama a função -> imprime \"Olá!\"`\n`saudacao()   # chama de novo -> imprime \"Olá!\" outra vez`" },
        { tipo: "lista", itens: [
          "`def` → palavra-chave que indica o início de uma função",
          "`saudacao` → nome da função",
          "`()` → onde ficam os parâmetros (aqui está vazio)",
          "O código dentro é chamado de **corpo da função**, e precisa estar indentado"
        ]},

        { tipo: "subtitulo", texto: "Parâmetros e argumentos" },
        { tipo: "texto", texto: "**Parâmetro** é o nome da variável definida na função. **Argumento** é o valor real passado quando a função é chamada.\n`def saudacao(nome):     # \"nome\" é o parâmetro`\n`    print(f\"Olá, {nome}!\")`\n\n`saudacao(\"Maria\")       # \"Maria\" é o argumento`" },
        { tipo: "topico", titulo: "Parâmetros com valor padrão (default)", texto: "`def saudacao(nome=\"visitante\"):`\n`    print(f\"Olá, {nome}!\")`\n\n`saudacao()          # Olá, visitante!  (usa o valor padrão)`\n`saudacao(\"Ana\")      # Olá, Ana!`" },
        { tipo: "topico", titulo: "Múltiplos parâmetros e argumentos nomeados", texto: "`def apresentar(nome, idade):`\n`    print(f\"{nome} tem {idade} anos\")`\n\n`apresentar(\"Carlos\", 30)          # por posição`\n`apresentar(idade=30, nome=\"Carlos\")  # por nome (ordem não importa aqui)`" },
        { tipo: "destaque", texto: "Pegadinha: se você usar argumento nomeado, a ordem deixa de importar. Mas se misturar posicional com nomeado, os posicionais devem vir primeiro: `apresentar(\"Carlos\", idade=30)` é OK; `apresentar(nome=\"Carlos\", 30)` gera ERRO de sintaxe!" },
        { tipo: "topico", titulo: "*args e **kwargs (parâmetros variáveis)", texto: "Às vezes não sabemos quantos argumentos serão passados.\n`def soma_tudo(*numeros):     # *args recebe uma quantidade variável de argumentos como tupla`\n`    total = 0`\n`    for n in numeros:`\n`        total += n`\n`    return total`\n\n`print(soma_tudo(1, 2, 3))       # 6`\n`print(soma_tudo(1, 2, 3, 4, 5)) # 15`\n\n`def mostrar_dados(**dados):   # **kwargs recebe argumentos nomeados como dicionário`\n`    for chave, valor in dados.items():`\n`        print(chave, \":\", valor)`\n\n`mostrar_dados(nome=\"Ana\", idade=22)`\n# nome : Ana\n# idade : 22" },

        { tipo: "subtitulo", texto: "Retorno (return)" },
        { tipo: "texto", texto: "`return` é o que a função **devolve** para quem a chamou. Se não houver `return`, a função devolve `None`.\n`def soma(a, b):`\n`    return a + b`\n\n`resultado = soma(3, 4)`\n`print(resultado)     # 7`" },
        { tipo: "destaque", texto: "Pegadinha muito comum: confundir `print` com `return`.\n`def soma_errada(a, b):`\n`    print(a + b)     # apenas mostra na tela, não devolve o valor`\n\n`x = soma_errada(2, 3)   # imprime \"5\" na tela`\n`print(x)                 # None! porque a função não tem return`\nIsso é cobrado com frequência em prova: \"o que acontece se eu usar o valor retornado de uma função que só tem print?\" → a resposta é `None`." },
        { tipo: "topico", titulo: "return encerra a função imediatamente", texto: "`def verificar(n):`\n`    if n < 0:`\n`        return \"negativo\"`\n`    return \"não negativo\"`\n`    print(\"isso nunca é executado\")  # código morto (nunca roda)`\nQualquer código depois de um `return` executado **não roda**." },

        { tipo: "subtitulo", texto: "Escopo de variáveis" },
        { tipo: "texto", texto: "**Escopo** é a \"área\" onde uma variável existe e pode ser usada.\n- **Variável local**: criada dentro de uma função, só existe dentro dela\n- **Variável global**: criada fora de funções, pode ser lida de qualquer lugar\n`x = 10   # variável global`\n\n`def funcao():`\n`    y = 5   # variável local`\n`    print(x)   # OK, pode ler a variável global`\n`    print(y)`\n\n`funcao()`\n`print(x)      # OK, 10`\n`print(y)      # ERRO! y não existe fora da função`" },
        { tipo: "topico", titulo: "Cuidado: variável local com mesmo nome de uma global", texto: "`x = 10`\n\n`def funcao():`\n`    x = 99          # isso cria uma NOVA variável local x, não altera a global!`\n`    print(x)         # 99`\n\n`funcao()`\n`print(x)             # 10  -> a global não mudou!`\n\nSe você quiser alterar a variável global dentro da função, precisa da palavra-chave `global`:\n`x = 10`\n\n`def funcao():`\n`    global x`\n`    x = 99`\n\n`funcao()`\n`print(x)   # 99 -> agora sim mudou`" },
        { tipo: "destaque", texto: "Esse é um dos temas mais cobrados em \"interpretação de código\" nas provas: sem `global`, atribuir a uma variável dentro da função cria uma nova variável local." },

        { tipo: "subtitulo", texto: "Funções com diferentes tipos de parâmetros — resumo" },
        { tipo: "exemplo", titulo: "Exemplo combinando a, b=10, *args, **kwargs", texto: "`def exemplo(a, b=10, *args, **kwargs):`\n`    print(\"a:\", a)`\n`    print(\"b:\", b)`\n`    print(\"args:\", args)`\n`    print(\"kwargs:\", kwargs)`\n\n`exemplo(1, 2, 3, 4, x=5, y=6)`\n# a: 1\n# b: 2\n# args: (3, 4)\n# kwargs: {'x': 5, 'y': 6}" },

        { tipo: "subtitulo", texto: "Funções que chamam outras funções" },
        { tipo: "exemplo", titulo: "dobro e quadruplo", texto: "`def dobro(n):`\n`    return n * 2`\n\n`def quadruplo(n):`\n`    return dobro(dobro(n))   # chama dobro duas vezes`\n\n`print(quadruplo(3))   # 12`" },

        { tipo: "subtitulo", texto: "Erros comuns e pegadinhas de prova" },
        { tipo: "lista", itens: [
          "Confundir `print()` (mostra na tela) com `return` (devolve um valor utilizável).",
          "Achar que uma variável criada dentro da função existe fora dela.",
          "Esquecer que sem `global`, atribuir a uma variável dentro da função cria uma nova variável local.",
          "Esquecer o `return`, fazendo a função \"sumir\" com o resultado (retorna None).",
          "Colocar código depois de um `return` achando que ele vai executar.",
          "Confundir a ordem de argumentos nomeados vs posicionais."
        ]},
]
    },
    {
      id: "recursao",
      titulo: "Capítulo 3 — Recursão",
      blocos: [
        { tipo: "destaque", texto: "Este é um dos temas que mais confunde iniciantes, mas com o raciocínio certo fica bem simples. Vá com calma nesta parte." },

        { tipo: "subtitulo", texto: "O que é recursão" },
        { tipo: "texto", texto: "**Recursão** é quando uma função **chama a si mesma** para resolver um problema, dividindo-o em versões menores do mesmo problema." },
        { tipo: "exemplo", titulo: "Analogia da fila de pessoas", texto: "Pense assim: para saber o tamanho de uma fila de pessoas, ao invés de contar tudo de uma vez, você pode perguntar à pessoa da frente \"quantas pessoas tem atrás de mim?\" e ela pergunta à próxima, e assim por diante, até que a última pessoa da fila responda \"0, não tem ninguém atrás de mim\". Essa resposta final volta subindo a fila, e cada pessoa soma 1 até chegar à resposta completa.", detalhe: "Isso é exatamente a lógica da recursão: o problema grande é resolvido usando a solução de um problema um pouco menor, até chegar em um problema tão pequeno que a resposta é óbvia." },

        { tipo: "subtitulo", texto: "As duas partes obrigatórias de toda função recursiva" },
        { tipo: "texto", texto: "Toda função recursiva **precisa** ter:" },
        { tipo: "lista", itens: [
          "**Caso base**: a condição mais simples, onde a função não chama mais a si mesma e simplesmente retorna um valor direto. É o que \"para\" a recursão.",
          "**Caso recursivo**: a parte onde a função chama a si mesma, mas com um problema menor (mais perto do caso base)."
        ]},
        { tipo: "destaque", texto: "Se você esquecer o caso base (ou ele nunca for alcançado), a função vai chamar a si mesma infinitamente, até o programa travar com o erro `RecursionError: maximum recursion depth exceeded`." },
        { tipo: "exemplo", titulo: "Exemplo clássico: fatorial", texto: "O fatorial de `n` (escrito `n!`) é `n × (n-1) × (n-2) × ... × 1`. Por definição, `0! = 1`.\n`def fatorial(n):`\n`    if n == 0:              # CASO BASE`\n`        return 1`\n`    else:                    # CASO RECURSIVO`\n`        return n * fatorial(n - 1)`\n\n`print(fatorial(4))   # 24`", detalhe: "Caso base: `n == 0` → retorna 1 diretamente, sem chamar `fatorial` de novo. Caso recursivo: para qualquer `n` maior que 0, o resultado é `n` vezes o fatorial de `n-1` (um problema menor)." },

        { tipo: "subtitulo", texto: "Acompanhando a execução passo a passo (muito importante!)" },
        { tipo: "texto", texto: "Saber \"seguir\" uma recursão manualmente é uma das habilidades mais cobradas em prova. Vamos rastrear `fatorial(4)`:\n`fatorial(4)`\n`  = 4 * fatorial(3)`\n`              = 3 * fatorial(2)`\n`                          = 2 * fatorial(1)`\n`                                      = 1 * fatorial(0)`\n`                                                  = 1        <- caso base, PARA aqui`\n`                                      = 1 * 1 = 1`\n`                          = 2 * 1 = 2`\n`              = 3 * 2 = 6`\n`  = 4 * 6 = 24`" },
        { tipo: "destaque", texto: "Repare no padrão: a recursão primeiro **desce** (chamando a si mesma repetidamente, empilhando chamadas pendentes) até bater no caso base, e depois **sobe**, resolvendo cada chamada pendente na ordem inversa. Isso acontece porque cada chamada de função fica \"pendurada\", esperando o resultado da próxima chamada, numa estrutura parecida com uma **pilha de chamadas** (o mecanismo é o mesmo das pilhas do Capítulo 6)." },
        { tipo: "topico", titulo: "Dica prática para rastrear em prova", texto: "Desenhe uma \"escada\": escreva cada chamada em uma linha, indentando uma linha a mais a cada chamada nova. Quando bater no caso base, comece a \"voltar\", calculando de baixo para cima." },

        { tipo: "subtitulo", texto: "Exemplos de diferentes funções recursivas" },
        { tipo: "exemplo", titulo: "Soma de 1 até n", texto: "`def soma_ate(n):`\n`    if n == 0:                  # caso base`\n`        return 0`\n`    return n + soma_ate(n - 1)  # caso recursivo`\n\n`print(soma_ate(5))   # 5+4+3+2+1+0 = 15`" },
        { tipo: "exemplo", titulo: "Fibonacci", texto: "A sequência de Fibonacci é: 0, 1, 1, 2, 3, 5, 8, 13... (cada número é a soma dos dois anteriores).\n`def fibonacci(n):`\n`    if n == 0:                                  # caso base 1`\n`        return 0`\n`    if n == 1:                                  # caso base 2`\n`        return 1`\n`    return fibonacci(n - 1) + fibonacci(n - 2)  # caso recursivo`\n\n`print(fibonacci(5))   # 5`", detalhe: "Repare que Fibonacci tem dois casos base — isso é comum e válido: às vezes é preciso mais de uma condição de parada." },
        { tipo: "exemplo", titulo: "Contagem regressiva", texto: "`def contagem_regressiva(n):`\n`    if n <= 0:`\n`        print(\"Fim!\")`\n`        return`\n`    print(n)`\n`    contagem_regressiva(n - 1)`\n\n`contagem_regressiva(3)`\n# 3\n# 2\n# 1\n# Fim!" },
        { tipo: "exemplo", titulo: "Soma dos elementos de uma lista (recursão sobre estruturas)", texto: "`def soma_lista(lista):`\n`    if len(lista) == 0:                     # caso base: lista vazia`\n`        return 0`\n`    return lista[0] + soma_lista(lista[1:])  # primeiro elemento + soma do resto`\n\n`print(soma_lista([1, 2, 3, 4]))   # 10`", detalhe: "Aqui o \"problema menor\" é uma lista com um elemento a menos a cada chamada." },
        { tipo: "exemplo", titulo: "Potência (exponenciação)", texto: "`def potencia(base, expoente):`\n`    if expoente == 0:                       # caso base`\n`        return 1`\n`    return base * potencia(base, expoente - 1)  # caso recursivo`\n\n`print(potencia(2, 4))   # 16 (2*2*2*2)`" },

        { tipo: "subtitulo", texto: "Como identificar erros comuns em recursão" },
        { tipo: "exemplo", titulo: "Erro 1: esquecer o caso base", texto: "`def fatorial_errado(n):`\n`    return n * fatorial_errado(n - 1)   # nunca para!`\n\n`fatorial_errado(5)   # RecursionError: maximum recursion depth exceeded`" },
        { tipo: "exemplo", titulo: "Erro 2: caso base que nunca é alcançado", texto: "`def contagem_errada(n):`\n`    if n == 0:`\n`        return`\n`    print(n)`\n`    contagem_errada(n + 1)    # ERRO: está se afastando do caso base, nunca chega em 0!`\n\n`contagem_errada(1)   # nunca para (vai crescer para sempre)`", detalhe: "Dica de prova: sempre pergunte \"essa chamada recursiva está caminhando NA DIREÇÃO do caso base?\" Se o argumento estiver se afastando (ao invés de se aproximar) do valor do caso base, a recursão nunca termina." },
        { tipo: "exemplo", titulo: "Erro 3: esquecer o return na chamada recursiva", texto: "`def fatorial_sem_return(n):`\n`    if n == 0:`\n`        return 1`\n`    n * fatorial_sem_return(n - 1)   # faltou o \"return\" aqui!`\n\n`print(fatorial_sem_return(4))   # None! O resultado do cálculo se perde`", detalhe: "Sem `return`, o valor calculado (`n * fatorial_sem_return(n-1)`) é descartado, e a função devolve `None` por padrão." },

        { tipo: "subtitulo", texto: "Recursão e complexidade" },
        { tipo: "texto", texto: "A complexidade de uma função recursiva depende de **quantas vezes** ela chama a si mesma e **quanto trabalho** é feito em cada chamada." },
        { tipo: "lista", itens: [
          "`fatorial(n)` faz uma chamada recursiva por nível, então é O(n) — complexidade linear.",
          "`fibonacci(n)` (na versão simples mostrada acima) faz duas chamadas recursivas a cada chamada, criando uma \"árvore\" de chamadas que cresce exponencialmente: complexidade O(2ⁿ) — isso é muito ineficiente para valores grandes de n. É um exemplo clássico usado em prova para mostrar que recursão nem sempre é eficiente.",
          "`soma_lista(lista)` faz uma chamada recursiva por elemento da lista, complexidade O(n)."
        ]},
        { tipo: "destaque", texto: "Recursão não é automaticamente eficiente — depende de quantas chamadas são geradas." },

        { tipo: "subtitulo", texto: "Recursão vs Iteração (laço for/while)" },
        { tipo: "texto", texto: "Tudo que se faz com recursão também pode ser feito com um laço (`for` ou `while`), e vice-versa. A escolha entre elas depende do problema." },
        { tipo: "tabela", titulo: "Recursão vs Iteração", colunas: ["Aspecto", "Recursão", "Iteração (loop)"], linhas: [
          ["Legibilidade", "Muitas vezes mais clara para problemas \"naturalmente recursivos\" (árvores, divisão de problemas)", "Mais direta para problemas simples e repetitivos"],
          ["Uso de memória", "Usa mais memória (cada chamada fica na pilha de execução)", "Usa menos memória"],
          ["Risco", "Pode estourar a pilha (RecursionError) se muito profunda", "Não tem esse risco"]
        ]},
        { tipo: "exemplo", titulo: "Comparando as duas formas para somar de 1 até n", texto: "`# Recursivo`\n`def soma_recursiva(n):`\n`    if n == 0:`\n`        return 0`\n`    return n + soma_recursiva(n - 1)`\n\n`# Iterativo`\n`def soma_iterativa(n):`\n`    total = 0`\n`    for i in range(1, n + 1):`\n`        total += i`\n`    return total`", detalhe: "Ambas retornam o mesmo resultado, mas a versão recursiva cria n chamadas de função empilhadas, enquanto a iterativa usa apenas uma variável total sendo atualizada." },

        { tipo: "subtitulo", texto: "Erros comuns e pegadinhas de prova" },
        { tipo: "lista", itens: [
          "Esquecer o caso base → recursão infinita.",
          "Caso base que nunca é alcançado (o argumento se afasta em vez de se aproximar).",
          "Esquecer o `return` na chamada recursiva, perdendo o valor calculado.",
          "Confundir \"quantas vezes a função é chamada\" com \"qual é o resultado final\" — em prova, muitas vezes pedem para você contar quantas chamadas acontecem.",
          "Achar que recursão é sempre mais eficiente que loop — muitas vezes é o contrário (ver Fibonacci acima).",
          "Errar a ordem de execução: achar que o print ou cálculo acontece na \"descida\", quando na verdade pode acontecer na \"subida\" (depois do retorno da chamada recursiva)."
        ]},

]
    },
    {
      id: "classes-objetos",
      titulo: "Capítulo 4 — Classes e Objetos em Python",
      blocos: [
        { tipo: "subtitulo", texto: "Por que usar classes?" },
        { tipo: "texto", texto: "Até agora vimos estruturas \"prontas\" (listas, dicionários...). Mas, e se quisermos criar nosso **próprio tipo de dado**, com características e comportamentos específicos? É para isso que servem as **classes**.\nUma **classe** é como uma \"planta\" ou \"molde\" que define quais características (atributos) e ações (métodos) um tipo de objeto vai ter. Um **objeto** é uma \"instância\" concreta criada a partir dessa planta." },
        { tipo: "exemplo", titulo: "Analogia do carro", texto: "A classe `Carro` é a planta de fábrica que define que todo carro tem cor, modelo, velocidade, e pode acelerar ou frear. Cada carro específico que sai da fábrica (o carro vermelho do João, o carro azul da Maria) é um objeto — uma instância da classe `Carro`." },

        { tipo: "subtitulo", texto: "Criando uma classe simples" },
        { tipo: "exemplo", titulo: "Classe Cachorro", texto: "`class Cachorro:`\n`    def __init__(self, nome, raca):`\n`        self.nome = nome`\n`        self.raca = raca`\n\n`    def latir(self):`\n`        print(f\"{self.nome} está latindo: Au au!\")`" },
        { tipo: "lista", titulo: "Entendendo cada parte da classe Cachorro", itens: [
          "`class Cachorro:` → define uma nova classe chamada Cachorro",
          "`def __init__(self, nome, raca):` → o construtor, um método especial chamado automaticamente quando um objeto é criado",
          "`self` → representa o próprio objeto que está sendo criado/usado",
          "`self.nome = nome` → cria um atributo chamado nome, guardando o valor recebido",
          "`def latir(self):` → um método, ou seja, uma função que pertence à classe"
        ]},

        { tipo: "subtitulo", texto: "Criando e usando objetos" },
        { tipo: "exemplo", titulo: "Objetos rex e bidu", texto: "`rex = Cachorro(\"Rex\", \"Labrador\")   # cria um objeto (instância) da classe Cachorro`\n`rex.latir()                          # Rex está latindo: Au au!`\n`print(rex.nome)                      # Rex`\n`print(rex.raca)                      # Labrador`\n\n`bidu = Cachorro(\"Bidu\", \"Poodle\")   # outro objeto, independente do rex`\n`bidu.latir()                         # Bidu está latindo: Au au!`", detalhe: "Repare: rex e bidu são dois objetos diferentes, cada um com seus próprios valores de nome e raca, mesmo vindo da mesma classe. Isso é exatamente como uma lista de \"moldes\" gerando várias \"cópias personalizadas\"." },

        { tipo: "subtitulo", texto: "Entendendo o self" },
        { tipo: "texto", texto: "`self` é a forma como um método se refere **ao próprio objeto** que o está chamando. É sempre o **primeiro parâmetro** de qualquer método de uma classe (por convenção, chamado de self, mas tecnicamente poderia ter outro nome).\nQuando você escreve `rex.latir()`, o Python \"por trás dos panos\" está fazendo algo equivalente a `Cachorro.latir(rex)` — ou seja, o objeto rex é passado automaticamente como self." },
        { tipo: "exemplo", titulo: "Classe Contador com atributos independentes por objeto", texto: "`class Contador:`\n`    def __init__(self):`\n`        self.valor = 0            # self.valor pertence a ESTE objeto específico`\n\n`    def incrementar(self):`\n`        self.valor += 1            # altera o atributo deste objeto`\n\n`c1 = Contador()`\n`c2 = Contador()`\n\n`c1.incrementar()`\n`c1.incrementar()`\n`c2.incrementar()`\n\n`print(c1.valor)   # 2`\n`print(c2.valor)   # 1  -> cada objeto tem seu próprio \"valor\", são independentes!`" },
        { tipo: "destaque", texto: "Pegadinha de prova: esquecer o `self` no método causa erro.\n`class Errado:`\n`    def metodo():          # faltou o self!`\n`        print(\"oi\")`\n\n`obj = Errado()`\n`obj.metodo()   # TypeError: metodo() takes 0 positional arguments but 1 was given`\nIsso acontece porque o Python sempre tenta passar o objeto automaticamente como primeiro argumento." },

        { tipo: "subtitulo", texto: "Atributos: de instância vs de classe" },
        { tipo: "lista", itens: [
          "**Atributo de instância**: pertence a cada objeto individualmente (definido dentro do __init__ com self.)",
          "**Atributo de classe**: é compartilhado por todos os objetos daquela classe"
        ]},
        { tipo: "exemplo", titulo: "Classe Aluno com atributo de classe e de instância", texto: "`class Aluno:`\n`    escola = \"Colégio ABC\"          # atributo de CLASSE (compartilhado)`\n\n`    def __init__(self, nome):`\n`        self.nome = nome            # atributo de INSTÂNCIA (individual)`\n\n`a1 = Aluno(\"Ana\")`\n`a2 = Aluno(\"Bruno\")`\n\n`print(a1.escola)   # Colégio ABC`\n`print(a2.escola)   # Colégio ABC`\n`print(a1.nome)     # Ana`\n`print(a2.nome)     # Bruno`", detalhe: "Se alterarmos Aluno.escola, o valor muda para todos os objetos. Mas se alterarmos a1.nome, isso afeta só a1." },

        { tipo: "subtitulo", texto: "Métodos com parâmetros" },
        { tipo: "exemplo", titulo: "Classe ContaBancaria", texto: "`class ContaBancaria:`\n`    def __init__(self, titular, saldo=0):`\n`        self.titular = titular`\n`        self.saldo = saldo`\n\n`    def depositar(self, valor):`\n`        self.saldo += valor`\n\n`    def sacar(self, valor):`\n`        if valor > self.saldo:`\n`            print(\"Saldo insuficiente!\")`\n`        else:`\n`            self.saldo -= valor`\n\n`    def mostrar_saldo(self):`\n`        print(f\"Saldo de {self.titular}: R$ {self.saldo}\")`\n\n`conta = ContaBancaria(\"Maria\", 100)`\n`conta.depositar(50)`\n`conta.sacar(30)`\n`conta.mostrar_saldo()   # Saldo de Maria: R$ 120`" },

        { tipo: "subtitulo", texto: "O que é o construtor __init__" },
        { tipo: "texto", texto: "`__init__` é chamado **automaticamente** toda vez que um objeto é criado com `NomeDaClasse(...)`. Serve para inicializar os atributos do objeto logo na criação.\n`class Ponto:`\n`    def __init__(self, x, y):`\n`        self.x = x`\n`        self.y = y`\n\n`p = Ponto(3, 4)    # __init__ é chamado aqui, com x=3 e y=4`\n`print(p.x, p.y)     # 3 4`" },
        { tipo: "destaque", texto: "Pegadinha: `__init__` não \"retorna\" o objeto explicitamente (não usa `return valor`) — ele apenas configura o objeto que o Python já criou. Se você colocar um `return valor` dentro do `__init__`, isso gera erro (só é permitido `return None`, ou seja, `return` sem valor)." },

        { tipo: "subtitulo", texto: "Método especial __str__ (bônus útil)" },
        { tipo: "exemplo", titulo: "Classe Pessoa com __str__", texto: "`class Pessoa:`\n`    def __init__(self, nome, idade):`\n`        self.nome = nome`\n`        self.idade = idade`\n\n`    def __str__(self):`\n`        return f\"{self.nome}, {self.idade} anos\"`\n\n`p = Pessoa(\"Carlos\", 25)`\n`print(p)   # Carlos, 25 anos (sem __str__, isso imprimiria algo como <__main__.Pessoa object at 0x...>)`" },

        { tipo: "subtitulo", texto: "Comparando classes com dicionários" },
        { tipo: "texto", texto: "Uma pergunta comum de prova é: \"por que usar classe em vez de dicionário para representar um objeto?\"\n`# Com dicionário`\n`aluno = {\"nome\": \"Ana\", \"nota\": 8}`\n\n`# Com classe`\n`class Aluno:`\n`    def __init__(self, nome, nota):`\n`        self.nome = nome`\n`        self.nota = nota`\n\n`    def aprovado(self):`\n`        return self.nota >= 6`\n\n`a = Aluno(\"Ana\", 8)`\n`print(a.aprovado())   # True`", detalhe: "A vantagem da classe é poder agrupar dados e comportamentos (métodos) juntos, e criar regras específicas (como aprovado()), coisa que um dicionário puro não faz sozinho." },

        { tipo: "subtitulo", texto: "Erros comuns e pegadinhas de prova" },
        { tipo: "lista", itens: [
          "Esquecer o self como primeiro parâmetro dos métodos.",
          "Esquecer de usar self. ao acessar um atributo dentro de um método (ex: escrever nome em vez de self.nome).",
          "Confundir atributo de classe com atributo de instância (achar que alterar um afeta o outro sempre).",
          "Achar que __init__ \"retorna\" o objeto (na verdade ele apenas o inicializa).",
          "Esquecer os parênteses ao instanciar: obj = Classe (isso não cria objeto, apenas referencia a própria classe) vs obj = Classe() (isso sim cria um objeto).",
          "Achar que dois objetos criados a partir da mesma classe compartilham os atributos de instância (eles não compartilham, cada um tem os seus)."
        ]},

]
    },
    {
      id: "complexidade",
      titulo: "Capítulo 5 — Análise de Complexidade e Eficiência de Algoritmos",
      blocos: [
        { tipo: "destaque", texto: "Este é, provavelmente, o assunto mais cobrado e mais temido da prova. Vamos com calma, passo a passo, até você conseguir olhar para um código e \"ver\" a complexidade dele." },

        { tipo: "subtitulo", texto: "O que é eficiência de um algoritmo?" },
        { tipo: "texto", texto: "Um algoritmo é uma sequência de passos para resolver um problema. Existem várias formas de resolver o mesmo problema, e algumas são mais rápidas ou usam menos memória que outras. Eficiência é justamente medir isso: o quão bem um algoritmo se comporta conforme o tamanho da entrada de dados cresce.\nPor exemplo: procurar um nome numa lista de 10 elementos é rápido de qualquer jeito. Mas procurar em uma lista de 10 milhões de elementos já mostra diferença enorme entre um algoritmo bom e um ruim." },

        { tipo: "subtitulo", texto: "O que é complexidade?" },
        { tipo: "texto", texto: "Complexidade é uma forma de expressar como o tempo (ou espaço) de execução de um algoritmo cresce conforme a quantidade de dados de entrada (geralmente chamada de n) aumenta.\nNão medimos o tempo em segundos (porque isso depende do computador, da linguagem, etc.), medimos em quantas operações o algoritmo realiza em função de n." },

        { tipo: "subtitulo", texto: "Notação Big O" },
        { tipo: "texto", texto: "Big O é a notação usada para descrever a complexidade de um algoritmo, focando no pior caso e no comportamento quando n fica muito grande. Escrevemos como O(alguma coisa em função de n)." },
        { tipo: "lista", titulo: "Regras importantes para calcular o Big O de um trecho de código", itens: [
          "Ignoramos constantes multiplicativas: O(2n) vira O(n). O(500) vira O(1).",
          "Mantemos apenas o termo dominante: O(n² + n) vira O(n²), porque quando n é muito grande, o n² domina completamente o n.",
          "Focamos no pior caso (o cenário mais demorado possível)."
        ]},

        { tipo: "subtitulo", texto: "As complexidades mais importantes (da mais rápida para a mais lenta)" },
        { tipo: "topico", titulo: "O(1) — Tempo constante", texto: "O algoritmo faz a mesma quantidade de operações independente do tamanho da entrada.\n`def primeiro_elemento(lista):`\n`    return lista[0]   # sempre 1 operação, não importa se a lista tem 10 ou 10 milhões de itens`" },
        { tipo: "topico", titulo: "O(log n) — Tempo logarítmico", texto: "O algoritmo divide o problema pela metade a cada passo. É extremamente eficiente mesmo para entradas grandes. Típico de busca binária.\n`def busca_binaria(lista, alvo):`\n`    inicio, fim = 0, len(lista) - 1`\n`    while inicio <= fim:`\n`        meio = (inicio + fim) // 2`\n`        if lista[meio] == alvo:`\n`            return meio`\n`        elif lista[meio] < alvo:`\n`            inicio = meio + 1`\n`        else:`\n`            fim = meio - 1`\n`    return -1`\nA cada repetição do while, a área de busca é cortada pela metade — por isso é logarítmico (log₂ n)." },
        { tipo: "topico", titulo: "O(n) — Tempo linear", texto: "O algoritmo faz uma quantidade de operações proporcional ao tamanho da entrada — geralmente um laço simples que passa por todos os elementos uma vez.\n`def somar_lista(lista):`\n`    total = 0`\n`    for numero in lista:      # roda n vezes, onde n = len(lista)`\n`        total += numero`\n`    return total`" },
        { tipo: "topico", titulo: "O(n log n) — Tempo linearítmico", texto: "Comum em algoritmos de ordenação eficientes (merge sort, quick sort, o próprio sorted() do Python). Combina um laço (n) com uma divisão logarítmica (log n).\n`lista = [5, 3, 8, 1, 9]`\n`lista_ordenada = sorted(lista)   # O(n log n) internamente`" },
        { tipo: "topico", titulo: "O(n²) — Tempo quadrático", texto: "Geralmente aparece quando há dois laços aninhados, cada um rodando n vezes.\n`def tem_duplicado(lista):`\n`    for i in range(len(lista)):           # roda n vezes`\n`        for j in range(len(lista)):       # para cada i, roda n vezes de novo`\n`            if i != j and lista[i] == lista[j]:`\n`                return True`\n`    return False`\nTotal de operações: aproximadamente n × n = n²." },
        { tipo: "topico", titulo: "O(n³) — Tempo cúbico", texto: "Três laços aninhados, cada um dependendo do tamanho de n.\n`def exemplo_cubico(n):`\n`    contador = 0`\n`    for i in range(n):`\n`        for j in range(n):`\n`            for k in range(n):`\n`                contador += 1`\n`    return contador`\nTotal de operações: n × n × n = n³." },

        { tipo: "subtitulo", texto: "Comparando as complexidades (decore essa ordem!)" },
        { tipo: "destaque", texto: "Da mais eficiente para a menos eficiente, à medida que n cresce: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ)" },
        { tipo: "tabela", titulo: "Crescimento aproximado do número de operações conforme n aumenta", colunas: ["n", "O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(n³)"], linhas: [
          ["10", "1", "~3", "10", "~33", "100", "1.000"],
          ["100", "1", "~7", "100", "~664", "10.000", "1.000.000"],
          ["1.000", "1", "~10", "1.000", "~9.966", "1.000.000", "1.000.000.000"]
        ]},
        { tipo: "texto", texto: "Note como O(n²) e O(n³) crescem absurdamente mais rápido que O(n) e O(log n). Essa tabela ajuda a entender por que escolher o algoritmo certo importa tanto quando os dados são grandes." },

        { tipo: "subtitulo", texto: "Como identificar a complexidade observando o código — guia prático" },
        { tipo: "topico", titulo: "Regra 1: Um laço simples percorrendo n elementos → O(n)", texto: "`for i in range(n):`\n`    print(i)`\nUma operação simples dentro de um laço que roda n vezes = O(n)." },
        { tipo: "topico", titulo: "Regra 2: Dois laços aninhados, ambos dependendo de n → O(n²)", texto: "`for i in range(n):`\n`    for j in range(n):`\n`        print(i, j)`\nPara cada uma das n voltas do laço externo, o laço interno roda mais n vezes → n × n = n²." },
        { tipo: "destaque", texto: "Atenção — pegadinha comum: nem todo laço aninhado é O(n²)! Se o laço interno não depende do tamanho de n (por exemplo, sempre roda um número fixo de vezes), a complexidade não sobe:\n`for i in range(n):        # O(n)`\n`    for j in range(5):    # sempre roda 5 vezes, não depende de n`\n`        print(i, j)`\nIsso é O(n × 5), que simplifica para O(n) (constantes são descartadas), não O(n²)!" },
        { tipo: "topico", titulo: "Regra 3: Laços sequenciais (um depois do outro) se SOMAM, não se multiplicam", texto: "`for i in range(n):     # O(n)`\n`    print(i)`\n\n`for j in range(n):     # O(n)`\n`    print(j)`\nIsso é O(n) + O(n) = O(2n), que simplifica para O(n) (porque descartamos a constante 2). É diferente de laços aninhados, que se multiplicam." },
        { tipo: "topico", titulo: "Regra 4: Condições (if/else) geralmente não aumentam a complexidade", texto: "`def verificar(lista):`\n`    if len(lista) > 0:              # O(1)`\n`        return lista[0]              # O(1)`\n`    else:`\n`        return None                  # O(1)`\nUm if normalmente é O(1), a menos que dentro dele existam laços. A complexidade do bloco é a do pior caminho possível entre os ramos do if.\n\n`def exemplo(lista, n):`\n`    if len(lista) > 100:`\n`        for i in range(n):          # esse ramo é O(n)`\n`            print(i)`\n`    else:`\n`        print(\"lista pequena\")       # esse ramo é O(1)`\nNesse caso, a complexidade do código todo é O(n), porque consideramos o pior caso possível (o caminho que faz mais operações)." },
        { tipo: "topico", titulo: "Regra 5: Operações dentro de laços contam proporcionalmente", texto: "Se dentro de um laço houver uma operação que já é O(n) (como buscar um elemento em uma lista com in), a complexidade se multiplica:\n`def contem_todos(lista1, lista2):`\n`    for item in lista1:              # roda n vezes`\n`        if item in lista2:           # o \"in\" em uma lista é O(n) também!`\n`            print(\"encontrado\")`\nAqui temos O(n) (laço externo) × O(n) (a busca in dentro do laço) = O(n²), mesmo sem parecer visualmente um \"laço duplo\" — essa é uma pegadinha muito comum!" },
        { tipo: "topico", titulo: "Regra 6: Chamadas de função dentro de laços", texto: "Se você chama uma função dentro de um laço, é preciso saber a complexidade daquela função e multiplicar.\n`def funcao_o_n(lista):`\n`    for item in lista:`\n`        print(item)          # O(n)`\n\n`def funcao_externa(lista):`\n`    for item in lista:         # roda n vezes`\n`        funcao_o_n(lista)      # cada chamada é O(n)`\nTotal: O(n) × O(n) = O(n²)." },
        { tipo: "topico", titulo: "Regra 7: Complexidade de recursão", texto: "Para achar a complexidade de uma função recursiva, pense em: quantas chamadas são feitas no total, e quanto trabalho cada uma faz.\n- Se a recursão faz uma chamada por nível, reduzindo o problema em 1 a cada vez (como o fatorial), a complexidade é O(n).\n- Se a recursão divide o problema pela metade a cada chamada (como busca binária recursiva), a complexidade é O(log n).\n- Se a recursão faz duas ou mais chamadas a cada nível, sem reaproveitar cálculos (como o Fibonacci recursivo simples), a complexidade cresce exponencialmente: O(2ⁿ).\n`def fatorial(n):              # O(n): uma chamada recursiva por nível`\n`    if n == 0:`\n`        return 1`\n`    return n * fatorial(n - 1)`\n\n`def fibonacci(n):              # O(2^n): duas chamadas recursivas por nível`\n`    if n <= 1:`\n`        return n`\n`    return fibonacci(n - 1) + fibonacci(n - 2)`" },

        { tipo: "subtitulo", texto: "Exemplos completos com análise passo a passo" },
        { tipo: "exemplo", titulo: "Exemplo 1", texto: "`def exemplo1(lista):`\n`    soma = 0                      # O(1)`\n`    for numero in lista:          # O(n)`\n`        soma += numero             # O(1) dentro do laço`\n`    return soma                    # O(1)`", detalhe: "Análise: a única parte que depende do tamanho da entrada é o laço for, que roda n vezes fazendo uma operação simples em cada iteração. As linhas fora do laço são O(1) e não afetam o resultado final. Complexidade total: O(n)" },
        { tipo: "exemplo", titulo: "Exemplo 2", texto: "`def exemplo2(matriz):`\n`    total = 0`\n`    for linha in matriz:              # roda n vezes (n = número de linhas)`\n`        for valor in linha:            # roda m vezes (m = número de colunas)`\n`            total += valor`\n`    return total`", detalhe: "Análise: dois laços aninhados. Se a matriz for n x n (quadrada), isso é O(n²). Se as dimensões forem diferentes (n linhas, m colunas), tecnicamente é O(n × m), mas frequentemente simplificamos para O(n²) quando as dimensões são proporcionais. Complexidade total: O(n²) (assumindo matriz quadrada)" },
        { tipo: "exemplo", titulo: "Exemplo 3 — pegadinha", texto: "`def exemplo3(lista):`\n`    print(lista[0])          # O(1)`\n`    print(lista[-1])         # O(1)`\n`    for item in lista:        # O(n)`\n`        print(item)`", detalhe: "Análise: as duas primeiras linhas são O(1) cada (acesso direto por índice, não depende do tamanho da lista). O laço é O(n). Somando: O(1) + O(1) + O(n) = O(n + 2), que simplifica para O(n)." },
        { tipo: "exemplo", titulo: "Exemplo 4 — laço com passo diferente de 1", texto: "`def exemplo4(n):`\n`    i = 1`\n`    while i < n:`\n`        print(i)`\n`        i = i * 2          # dobra a cada iteração!`", detalhe: "Análise: como i dobra a cada iteração em vez de aumentar de 1 em 1, o número de iterações necessárias para i ultrapassar n é muito menor — especificamente, é log₂(n). Complexidade total: O(log n)" },
        { tipo: "exemplo", titulo: "Exemplo 5 — laços aninhados independentes", texto: "`def exemplo5(lista):`\n`    for i in range(len(lista)):        # O(n)`\n`        for j in range(3):              # sempre roda 3 vezes, fixo`\n`            print(lista[i])`", detalhe: "Análise: o laço interno não depende de n, sempre roda exatamente 3 vezes. Então temos O(n × 3) = O(n) (a constante 3 é descartada)." },

        { tipo: "subtitulo", texto: "Erros comuns e pegadinhas de prova" },
        { tipo: "lista", itens: [
          "Achar que todo laço duplo é O(n²) — só é, se ambos os laços dependerem do tamanho de n.",
          "Esquecer que operações como `x in lista` já são O(n) por si só (não são O(1)!). Já `x in dicionario` ou `x in conjunto` são O(1) em média — essa é uma pegadinha muito comum sobre a diferença de desempenho entre estruturas!",
          "Somar complexidades de laços sequenciais como se fossem multiplicadas (laços um após o outro se somam, não se multiplicam).",
          "Esquecer de considerar o pior caso ao analisar um if/else.",
          "Confundir Big O do melhor caso com o do pior caso (Big O tradicionalmente representa o pior caso).",
          "Achar que recursão é sempre O(n) — depende de quantas chamadas recursivas acontecem por nível.",
          "Esquecer de simplificar (ex: escrever O(2n + 3) em vez de simplificar para O(n))."
        ]},
]
    },
    {
      id: "pilhas-filas",
      titulo: "Capítulo 6 — Pilhas e Filas",
      blocos: [
        { tipo: "subtitulo", texto: "O que são estruturas de dados lineares" },
        { tipo: "texto", texto: "Estruturas de dados lineares são aquelas em que os elementos ficam organizados em sequência, um após o outro — cada elemento tem no máximo um \"próximo\" e um \"anterior\" (diferente de estruturas como árvores, que ramificam). Listas, pilhas e filas são exemplos de estruturas lineares.\nO que diferencia pilha e fila de uma lista comum é a regra de acesso: em uma lista você pode acessar qualquer posição livremente, mas pilhas e filas restringem onde você pode inserir e remover elementos, o que as torna ideais para representar certos tipos de problemas do mundo real." },

        { tipo: "subtitulo", texto: "Pilha (Stack) — LIFO" },
        { tipo: "topico", titulo: "O que é", texto: "Uma pilha segue a regra LIFO — Last In, First Out (\"o último a entrar é o primeiro a sair\")." },
        { tipo: "exemplo", titulo: "Analogia da pilha de pratos", texto: "Pense em uma pilha de pratos. Você só consegue colocar um prato novo no topo, e só consegue retirar o prato que está no topo. O primeiro prato que você colocou (lá no fundo da pilha) só sai por último." },
        { tipo: "tabela", titulo: "Operações principais de uma pilha", colunas: ["Operação", "O que faz"], linhas: [
          ["push(x)", "insere x no topo da pilha"],
          ["pop()", "remove e retorna o elemento do topo"],
          ["peek() / top()", "apenas olha o elemento do topo, sem remover"],
          ["is_empty()", "verifica se a pilha está vazia"]
        ]},
        { tipo: "exemplo", titulo: "Implementando uma pilha em Python (usando lista)", texto: "Em Python, a forma mais simples de implementar uma pilha é usando uma lista, tratando o final da lista como o topo da pilha:\n`class Pilha:`\n`    def __init__(self):`\n`        self.itens = []`\n\n`    def push(self, valor):`\n`        self.itens.append(valor)        # adiciona no final -> topo da pilha`\n\n`    def pop(self):`\n`        if self.is_empty():`\n`            print(\"Pilha vazia!\")`\n`            return None`\n`        return self.itens.pop()          # remove e retorna o último elemento -> topo`\n\n`    def peek(self):`\n`        if self.is_empty():`\n`            return None`\n`        return self.itens[-1]             # olha o último elemento sem remover`\n\n`    def is_empty(self):`\n`        return len(self.itens) == 0`\n\n`    def tamanho(self):`\n`        return len(self.itens)`\n\nUsando a pilha:\n`p = Pilha()`\n`p.push(1)`\n`p.push(2)`\n`p.push(3)`\n`print(p.itens)     # [1, 2, 3]  -> o topo é o último elemento (3)`\n\n`print(p.pop())      # 3  -> remove o topo`\n`print(p.itens)      # [1, 2]`\n\n`print(p.peek())     # 2  -> olha o topo sem remover`\n`print(p.itens)      # [1, 2]  -> continua igual, pois peek não remove`" },
        { tipo: "destaque", texto: "Por que usar o final da lista como topo, e não o começo? Porque `append()` e `pop()` (sem argumento) no final da lista são operações O(1). Se usássemos o início da lista como topo, teríamos que usar `insert(0, x)` e `pop(0)`, que são O(n) (porque todos os outros elementos precisam ser deslocados). Essa é uma pegadinha de prova sobre eficiência de implementação!" },
        { tipo: "topico", titulo: "Aplicações reais de pilha", lista: [
          "Botão \"Desfazer\" (Ctrl+Z) de editores de texto",
          "Histórico de navegação do navegador (voltar página)",
          "Verificação de parênteses balanceados em expressões matemáticas",
          "Chamadas de função na memória (pilha de execução) — é exatamente o mecanismo por trás da recursão vista no Capítulo 3!"
        ]},
        { tipo: "exemplo", titulo: "Exemplo prático: verificar parênteses balanceados", texto: "`def parenteses_balanceados(expressao):`\n`    pilha = []`\n`    for caractere in expressao:`\n`        if caractere == \"(\":`\n`            pilha.append(caractere)`\n`        elif caractere == \")\":`\n`            if len(pilha) == 0:          # fechou sem ter aberto`\n`                return False`\n`            pilha.pop()`\n`    return len(pilha) == 0                # se sobrou algo, não fechou tudo`\n\n`print(parenteses_balanceados(\"(a+b)*(c-d)\"))   # True`\n`print(parenteses_balanceados(\"(a+b*(c-d)\"))    # False (falta fechar)`\n`print(parenteses_balanceados(\"a+b)\"))          # False (fechou sem abrir)`" },

        { tipo: "subtitulo", texto: "Fila (Queue) — FIFO" },
        { tipo: "topico", titulo: "O que é", texto: "Uma fila segue a regra FIFO — First In, First Out (\"o primeiro a entrar é o primeiro a sair\")." },
        { tipo: "exemplo", titulo: "Analogia da fila de banco", texto: "Uma fila de banco. Quem chega primeiro é atendido primeiro. Novos clientes entram no final da fila, e o atendimento acontece sempre pelo início da fila." },
        { tipo: "tabela", titulo: "Operações principais de uma fila", colunas: ["Operação", "O que faz"], linhas: [
          ["enqueue(x)", "insere x no final da fila"],
          ["dequeue()", "remove e retorna o elemento do início da fila"],
          ["peek()/front()", "olha o elemento da frente sem remover"],
          ["is_empty()", "verifica se a fila está vazia"]
        ]},
        { tipo: "exemplo", titulo: "Implementação simples (mas ineficiente!) usando lista", texto: "Cuidado: implementar fila com lista comum tem uma armadilha de eficiência. Veja:\n`class FilaComLista:`\n`    def __init__(self):`\n`        self.itens = []`\n\n`    def enqueue(self, valor):`\n`        self.itens.append(valor)        # O(1) - adiciona no final`\n\n`    def dequeue(self):`\n`        if self.is_empty():`\n`            return None`\n`        return self.itens.pop(0)          # O(n) - remove do início, todo mundo desloca!`\n\n`    def is_empty(self):`\n`        return len(self.itens) == 0`", detalhe: "`self.itens.pop(0)` remove o primeiro elemento, mas isso obriga o Python a deslocar todos os outros elementos uma posição para trás — isso é O(n), tornando a fila ineficiente para muitas operações." },
        { tipo: "exemplo", titulo: "Solução melhor: usar collections.deque", texto: "Uma estrutura do Python otimizada para inserção/remoção rápida (O(1)) em ambas as extremidades:\n`from collections import deque`\n\n`class Fila:`\n`    def __init__(self):`\n`        self.itens = deque()`\n\n`    def enqueue(self, valor):`\n`        self.itens.append(valor)          # O(1) - adiciona no final`\n\n`    def dequeue(self):`\n`        if self.is_empty():`\n`            return None`\n`        return self.itens.popleft()        # O(1) - remove do início!`\n\n`    def peek(self):`\n`        if self.is_empty():`\n`            return None`\n`        return self.itens[0]`\n\n`    def is_empty(self):`\n`        return len(self.itens) == 0`\n\nUsando a fila:\n`f = Fila()`\n`f.enqueue(\"Ana\")`\n`f.enqueue(\"Bruno\")`\n`f.enqueue(\"Carla\")`\n\n`print(f.dequeue())    # Ana  -> primeiro a entrar, primeiro a sair`\n`print(f.dequeue())    # Bruno`\n`print(f.itens)         # deque(['Carla'])`" },
        { tipo: "topico", titulo: "Aplicações reais de fila", lista: [
          "Fila de impressão de documentos",
          "Fila de atendimento (banco, call center)",
          "Gerenciamento de tarefas em processamento (a primeira tarefa adicionada é a primeira executada)",
          "Algoritmos de busca em largura (BFS) em grafos e árvores"
        ]},

        { tipo: "subtitulo", texto: "Pilha vs Fila — comparação direta" },
        { tipo: "tabela", titulo: "Pilha vs Fila", colunas: ["Aspecto", "Pilha (Stack)", "Fila (Queue)"], linhas: [
          ["Regra", "LIFO (último a entrar, primeiro a sair)", "FIFO (primeiro a entrar, primeiro a sair)"],
          ["Inserção", "No topo", "No final"],
          ["Remoção", "Do topo", "Do início"],
          ["Analogia", "Pilha de pratos", "Fila de banco"],
          ["Implementação eficiente em Python", "lista (append/pop)", "collections.deque (append/popleft)"],
          ["Exemplo de uso", "Desfazer (Ctrl+Z), pilha de chamadas de função", "Fila de impressão, atendimento"]
        ]},

        { tipo: "subtitulo", texto: "Relação entre pilha e recursão" },
        { tipo: "destaque", texto: "Vale reforçar essa conexão, porque é comum aparecer em prova: quando uma função chama a si mesma (recursão), cada chamada é empilhada na memória do computador (a chamada \"pai\" fica esperando o resultado da chamada \"filha\"). Quando o caso base é atingido, as chamadas começam a ser desempilhadas (resolvidas) na ordem inversa — exatamente como o comportamento LIFO de uma pilha! Se a recursão for profunda demais (sem atingir o caso base), a pilha de chamadas \"estoura\" — e é exatamente esse o erro RecursionError: maximum recursion depth exceeded visto no Capítulo 3." },

        { tipo: "subtitulo", texto: "Erros comuns e pegadinhas de prova" },
        { tipo: "lista", itens: [
          "Confundir qual é o topo da pilha (é sempre o último elemento inserido, não o primeiro).",
          "Confundir qual é a frente da fila (é sempre o primeiro elemento inserido, não o último).",
          "Usar pop(0) numa fila implementada com lista comum, achando que é eficiente (na verdade é O(n); o correto é usar deque com popleft()).",
          "Achar que pop() sem argumento em uma lista remove o primeiro elemento (na verdade remove o último).",
          "Tentar fazer pop() ou dequeue() em uma estrutura vazia sem verificar antes (is_empty()), o que pode gerar erro ou comportamento inesperado.",
          "Confundir push/pop (pilha) com enqueue/dequeue (fila) na hora de nomear operações em prova."
        ]},

        { tipo: "subtitulo", texto: "Questões de interpretação — Capítulo 6" },
        { tipo: "exemplo", titulo: "Exercício 1", texto: "Qual é a saída?\n`pilha = []`\n`pilha.append(1)`\n`pilha.append(2)`\n`pilha.append(3)`\n`print(pilha.pop())`\n`print(pilha.pop())`\n`print(pilha)`", detalhe: "Saída:\n3\n2\n[1]\nComo é uma pilha (LIFO), pop() sempre remove o último elemento inserido. Primeiro remove o 3, depois o 2, sobrando apenas o 1." },
        { tipo: "exemplo", titulo: "Exercício 2", texto: "Qual é a saída?\n`from collections import deque`\n`fila = deque()`\n`fila.append(\"A\")`\n`fila.append(\"B\")`\n`fila.append(\"C\")`\n`print(fila.popleft())`\n`print(fila.popleft())`\n`print(fila)`", detalhe: "Saída:\nA\nB\ndeque(['C'])\nComo é uma fila (FIFO), popleft() remove sempre o primeiro elemento inserido. Primeiro sai \"A\", depois \"B\", sobrando \"C\"." },
        { tipo: "exemplo", titulo: "Exercício 3", texto: "Implemente uma função `inverter_com_pilha(lista)` que inverte a ordem de uma lista usando uma pilha.", detalhe: "`def inverter_com_pilha(lista):`\n`    pilha = []`\n`    for item in lista:`\n`        pilha.append(item)          # empilha todos os itens`\n\n`    invertida = []`\n`    while pilha:                     # enquanto a pilha não estiver vazia`\n`        invertida.append(pilha.pop())   # desempilha (LIFO) e adiciona na nova lista`\n\n`    return invertida`\n\n`print(inverter_com_pilha([1, 2, 3, 4]))   # [4, 3, 2, 1]`\nA ideia funciona porque empilhar tudo e depois desempilhar naturalmente inverte a ordem, já que o último a entrar é o primeiro a sair." },
        { tipo: "exemplo", titulo: "Exercício 4", texto: "Qual estrutura (pilha ou fila) você usaria para simular um sistema de atendimento de banco, onde clientes são atendidos na ordem de chegada? Justifique.", detalhe: "Fila, porque a regra é FIFO — o primeiro cliente a chegar deve ser o primeiro a ser atendido, exatamente como a fila funciona." },
        { tipo: "exemplo", titulo: "Exercício 5", texto: "Qual estrutura você usaria para implementar a funcionalidade \"Desfazer\" (Ctrl+Z) de um editor de texto? Justifique.", detalhe: "Pilha, porque a última ação realizada deve ser a primeira a ser desfeita — isso é exatamente o comportamento LIFO." }
      ]
    },
    
    {
      id: "ordenacao",
      titulo: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
      blocos: [
        { tipo: "subtitulo", texto: "Por que estudar algoritmos de ordenação?" },
        { tipo: "texto", texto: "Ordenar dados é uma das operações mais comuns em programação. Python já tem sorted() e .sort() prontos (vistos no Capítulo 1), mas entender como um algoritmo de ordenação funciona por dentro é importante porque:" },
        { tipo: "lista", itens: [
          "Ajuda a entender complexidade na prática (Capítulo 5)",
          "É um dos assuntos clássicos de prova de Estrutura de Dados",
          "Mostra trade-offs entre simplicidade de código e eficiência"
        ]},
        { tipo: "texto", texto: "Nesta primeira parte, vemos a ideia conceitual de quatro algoritmos: Bubble Sort, Selection Sort, Insertion Sort e Merge Sort — o \"como funciona\" de cada um, sem entrar ainda em pseudocódigo linha a linha (isso normalmente fica pra Parte 2, se a aula continuar)." },

        { tipo: "subtitulo", texto: "Bubble Sort (Ordenação por Bolha)" },

        { tipo: "topico", titulo: "A ideia", texto: "O Bubble Sort percorre a lista repetidamente, comparando pares de elementos vizinhos e trocando de lugar quando estão na ordem errada. A cada passagem completa pela lista, o maior elemento \"borbulha\" até o final — daí o nome. Pense em bolhas de ar subindo na água: a cada rodada, o elemento \"mais pesado\" (maior) vai afundando pro fundo (final da lista), enquanto os \"mais leves\" sobem aos poucos." },
        { tipo: "exemplo", titulo: "Como funciona, passo a passo — Bubble Sort", texto: "Lista inicial: [5, 3, 8, 1].\n\n1ª passagem (compara vizinhos, troca se estiver fora de ordem):\n- Compara 5 e 3 → troca → [3, 5, 8, 1]\n- Compara 5 e 8 → já em ordem → [3, 5, 8, 1]\n- Compara 8 e 1 → troca → [3, 5, 1, 8]\n\nRepare que o 8 (maior elemento) já foi parar no final — isso sempre acontece na primeira passagem completa.\n\n2ª passagem:\n- Compara 3 e 5 → já em ordem\n- Compara 5 e 1 → troca → [3, 1, 5, 8]\n\n3ª passagem:\n- Compara 3 e 1 → troca → [1, 3, 5, 8]\n\nLista ordenada!", detalhe: "Cada passagem completa reduz em 1 o número de elementos ainda não garantidamente ordenados, pois o maior de cada rodada já vai parar na posição final correta." },
        { tipo: "topico", titulo: "Características principais", lista: [
          "A cada passagem completa, o maior elemento \"restante\" vai para sua posição final",
          "É o algoritmo mais simples de entender e implementar, mas também um dos menos eficientes",
          "Complexidade: O(n²) no pior caso e no caso médio (dois \"laços\" — uma passagem dentro da outra)"
        ]},
        { tipo: "destaque", texto: "Bubble Sort troca elementos vizinhos (posições adjacentes). Ele nunca compara elementos que não estão lado a lado numa mesma comparação." },

        { tipo: "subtitulo", texto: "Selection Sort (Ordenação por Seleção)" },

        { tipo: "topico", titulo: "A ideia", texto: "O Selection Sort divide a lista mentalmente em duas partes: a parte já ordenada (no início) e a parte não ordenada (no resto). A cada passagem, ele procura o menor elemento de toda a parte não ordenada e o coloca na primeira posição livre da parte ordenada. É como organizar cartas na mão: você olha todas as cartas que ainda não organizou, escolhe a menor, e coloca ela na próxima posição da fileira já organizada." },
        { tipo: "exemplo", titulo: "Como funciona, passo a passo — Selection Sort", texto: "Lista inicial: [5, 3, 8, 1].\n\n1ª passagem: procura o menor de [5, 3, 8, 1] → é o 1 → troca com a primeira posição → [1, 3, 8, 5]\n\n2ª passagem: procura o menor de [3, 8, 5] (ignorando o 1, que já está no lugar certo) → é o 3 → já está na posição certa → [1, 3, 8, 5]\n\n3ª passagem: procura o menor de [8, 5] → é o 5 → troca → [1, 3, 5, 8]\n\nLista ordenada!" },
        { tipo: "topico", titulo: "Características principais", lista: [
          "Ao contrário do Bubble Sort (que troca vizinhos várias vezes), o Selection Sort faz no máximo uma troca por passagem — ele só troca depois de encontrar o menor elemento de toda a parte não ordenada",
          "Complexidade: O(n²) — para cada posição, é preciso varrer o restante da lista procurando o menor",
          "É geralmente mais eficiente que o Bubble Sort na prática (menos trocas), mesmo tendo a mesma complexidade Big O"
        ]},
        { tipo: "destaque", texto: "O Selection Sort sempre percorre todo o restante da lista pra achar o menor elemento, mesmo que a lista já esteja quase ordenada — por isso ele não tem \"melhor caso\" mais rápido, é sempre O(n²)." },

        { tipo: "subtitulo", texto: "Insertion Sort (Ordenação por Inserção)" },

        { tipo: "topico", titulo: "A ideia", texto: "O Insertion Sort também divide a lista em uma parte ordenada (início) e uma não ordenada (resto), mas o funcionamento é diferente do Selection Sort: ele pega o primeiro elemento da parte não ordenada e o insere na posição correta dentro da parte já ordenada, empurrando os elementos maiores para a direita se necessário. É exatamente como organizar cartas de baralho na mão, uma a uma: você pega a próxima carta do monte e a encaixa na posição certa entre as cartas que já estão organizadas na sua mão." },
        { tipo: "exemplo", titulo: "Como funciona, passo a passo — Insertion Sort", texto: "Lista inicial: [5, 3, 8, 1].\n\nConsidera-se [5] como parte já \"ordenada\" (um único elemento sempre está ordenado sozinho).\n\nPasso 1: pega o 3 → compara com o 5 → 3 é menor, então insere antes → [3, 5, 8, 1]\n\nPasso 2: pega o 8 → compara com o 5 → 8 é maior, fica onde está → [3, 5, 8, 1]\n\nPasso 3: pega o 1 → compara com o 8 → menor, desloca; compara com o 5 → menor, desloca; compara com o 3 → menor, desloca; insere no início → [1, 3, 5, 8]\n\nLista ordenada!" },
        { tipo: "topico", titulo: "Características principais", lista: [
          "Muito eficiente quando a lista já está quase ordenada (no melhor caso, é O(n))",
          "Complexidade: O(n²) no pior caso (lista em ordem inversa), mas O(n) no melhor caso (lista já ordenada)",
          "É o algoritmo geralmente usado como base de comparação, por ser simples e ter bom desempenho em listas pequenas ou quase ordenadas"
        ]},
        { tipo: "destaque", texto: "Diferente do Bubble e do Selection Sort, o Insertion Sort é o único dos três que tem melhor caso O(n) — isso costuma ser cobrado como \"qual desses algoritmos é mais rápido se a lista já estiver quase ordenada?\"." },

        { tipo: "subtitulo", texto: "Merge Sort (Ordenação por Intercalação)" },

        { tipo: "topico", titulo: "A ideia", texto: "O Merge Sort usa a estratégia de dividir para conquistar (divide and conquer): ele divide a lista repetidamente ao meio até sobrar só listas de 1 elemento (que, por definição, já estão \"ordenadas\"), e depois vai juntando (mesclando) essas listinhas de volta, sempre em ordem, até reconstruir a lista completa ordenada. Esse é o mesmo tipo de raciocínio \"dividir o problema em partes menores\" que vimos na Recursão (Capítulo 3) — o Merge Sort é, inclusive, normalmente implementado de forma recursiva." },
        { tipo: "exemplo", titulo: "Como funciona, conceitualmente — Merge Sort", texto: "Lista inicial: [5, 3, 8, 1].\n\nFase de divisão (quebra ao meio repetidamente):\n[5, 3, 8, 1]\n  /        \\\n[5, 3]    [8, 1]\n /  \\      /  \\\n[5] [3]  [8] [1]\n\nFase de intercalação (junta de volta em ordem):\n[5] e [3] → mescla → [3, 5]\n[8] e [1] → mescla → [1, 8]\n\n[3, 5] e [1, 8] → mescla → [1, 3, 5, 8]\n\nLista ordenada!", detalhe: "O \"mesclar\" funciona comparando o primeiro elemento de cada metade e sempre colocando o menor primeiro na lista resultado — repetindo isso até esgotar as duas metades." },
        { tipo: "topico", titulo: "Características principais", lista: [
          "Sempre O(n log n), tanto no melhor quanto no pior caso — é isso que o torna mais confiável e eficiente que Bubble, Selection e Insertion Sort para listas grandes",
          "O \"log n\" vem da divisão pela metade repetida (igual à busca binária, vista no Capítulo 5); o \"n\" vem do trabalho de mesclar as partes",
          "Usa mais memória que os outros três, porque precisa criar listas temporárias durante a mesclagem"
        ]},
        { tipo: "destaque", texto: "Merge Sort não compara elementos vizinhos da lista original como o Bubble Sort — ele primeiro divide a lista inteira, e só depois faz as comparações durante a mesclagem das partes." },

        { tipo: "subtitulo", texto: "Comparação entre os quatro algoritmos" },

        { tipo: "tabela", titulo: "Comparação entre Bubble, Selection, Insertion e Merge Sort", colunas: ["Algoritmo", "Ideia central", "Melhor caso", "Pior caso", "Trocas/Memória extra"], linhas: [
          ["Bubble Sort", "Troca vizinhos repetidamente", "O(n²)*", "O(n²)", "Muitas trocas, sem memória extra"],
          ["Selection Sort", "Busca o menor e posiciona", "O(n²)", "O(n²)", "Poucas trocas, sem memória extra"],
          ["Insertion Sort", "Insere cada elemento na posição certa", "O(n)", "O(n²)", "Depende, sem memória extra"],
          ["Merge Sort", "Divide ao meio e mescla", "O(n log n)", "O(n log n)", "Usa memória extra (listas temporárias)"]
        ]},
        { tipo: "texto", texto: "*Algumas implementações de Bubble Sort conseguem detectar se a lista já está ordenada e parar mais cedo, chegando a O(n) no melhor caso — mas a versão \"clássica\" simples costuma ser tratada como O(n²) em qualquer caso." },
        { tipo: "lista", titulo: "Erros comuns e pegadinhas de prova — Algoritmos de Ordenação", itens: [
          "Achar que Bubble Sort e Selection Sort funcionam do mesmo jeito — Bubble troca vizinhos várias vezes por passagem; Selection troca no máximo uma vez por passagem (só depois de achar o menor).",
          "Achar que todo algoritmo O(n²) tem o mesmo desempenho na prática — Insertion Sort costuma ser mais rápido que Bubble Sort em listas quase ordenadas, mesmo tendo o mesmo Big O no pior caso.",
          "Esquecer que o Merge Sort precisa de memória extra para as listas temporárias da mesclagem — isso é frequentemente perguntado como desvantagem dele frente aos outros.",
          "Confundir \"dividir pela metade\" (Merge Sort) com \"percorrer a lista repetidamente\" (Bubble, Selection, Insertion) — são estratégias bem diferentes.",
          "Achar que Merge Sort é sempre a melhor escolha — para listas muito pequenas, o overhead de dividir e mesclar pode não compensar frente a um Insertion Sort simples."
        ]}
      ]
    },
    {
      id: "memoizacao",
      titulo: "Capítulo 8 — Memoização",
      blocos: [
        { tipo: "subtitulo", texto: "O problema da recursão que recalcula tudo" },

        { tipo: "texto", texto: "Lembra do Fibonacci recursivo do Capítulo 3?" },
        { tipo: "exemplo", titulo: "Fibonacci recursivo simples (sem memoização)", texto: "`def fibonacci(n):`\n`    if n <= 1:`\n`        return n`\n`    return fibonacci(n - 1) + fibonacci(n - 2)`", detalhe: "Vimos que essa versão é O(2ⁿ) — extremamente ineficiente para valores grandes de n. O motivo é que ela recalcula os mesmos valores várias vezes. Por exemplo, para calcular fibonacci(5), a função acaba calculando fibonacci(3) duas vezes, fibonacci(2) três vezes, e assim por diante — um desperdício enorme de trabalho repetido." },
        { tipo: "exemplo", titulo: "Árvore de chamadas de fibonacci(5)", texto: "fibonacci(5)\n├── fibonacci(4)\n│   ├── fibonacci(3)\n│   │   ├── fibonacci(2)\n│   │   └── fibonacci(1)\n│   └── fibonacci(2) <- calculado de novo!\n└── fibonacci(3) <- calculado de novo, com toda a sua sub-árvore!" },

        { tipo: "subtitulo", texto: "O que é memoização?" },

        { tipo: "texto", texto: "Memoização é uma técnica de otimização que consiste em guardar (cachear) o resultado de chamadas de função já calculadas, para que, se a mesma entrada aparecer de novo, a função simplesmente retorne o valor guardado em vez de recalcular tudo. O nome vem de \"memorandum\" (um lembrete) — a função \"anota\" os resultados que já calculou para não ter que refazer o trabalho." },
        { tipo: "destaque", texto: "Não confundir com \"memorização\" no sentido comum — memoização é o termo técnico correto em Ciência da Computação para essa técnica específica de cache de resultados de função." },

        { tipo: "subtitulo", texto: "Como implementar memoização (na mão, com dicionário)" },

        { tipo: "texto", texto: "A forma mais comum de implementar memoização manualmente é usando um dicionário para guardar os resultados já calculados, usando o parâmetro de entrada como chave:" },
        { tipo: "exemplo", titulo: "Fibonacci com memoização manual (dicionário)", texto: "`def fibonacci_memo(n, cache={}):`\n`    if n in cache:                 # já calculamos esse valor antes?`\n`        return cache[n]             # se sim, retorna direto do cache`\n`    if n <= 1:                     # caso base`\n`        return n`\n`    resultado = fibonacci_memo(n - 1, cache) + fibonacci_memo(n - 2, cache)`\n`    cache[n] = resultado            # guarda o resultado antes de retornar`\n`    return resultado`\n\n`print(fibonacci_memo(10))   # 55`" },
        { tipo: "topico", titulo: "O que mudou em relação à versão original", lista: [
          "Existe um cache (dicionário) que guarda pares n: resultado_de_fibonacci(n)",
          "Antes de calcular, a função verifica se aquele valor já foi calculado (if n in cache)",
          "Se já foi, retorna o valor guardado imediatamente — sem fazer nenhuma chamada recursiva nova",
          "Se não foi, calcula normalmente e guarda o resultado no cache antes de retornar, para que futuras chamadas com o mesmo n sejam instantâneas"
        ]},
        { tipo: "destaque", texto: "Usar um dicionário mutável (cache={}) como valor padrão de parâmetro é uma prática que funciona aqui, mas normalmente é desencorajada em Python fora desse contexto específico, porque o dicionário é criado uma única vez e compartilhado entre chamadas — é justamente esse comportamento \"estranho\" que a memoização está aproveitando de propósito." },

        { tipo: "subtitulo", texto: "Uma alternativa pronta: functools.lru_cache" },

        { tipo: "texto", texto: "Python tem um decorador pronto que faz memoização automaticamente, sem precisar criar o dicionário na mão:" },
        { tipo: "exemplo", titulo: "Fibonacci com @lru_cache", texto: "`from functools import lru_cache`\n\n`@lru_cache(maxsize=None)`\n`def fibonacci_lru(n):`\n`    if n <= 1:`\n`        return n`\n`    return fibonacci_lru(n - 1) + fibonacci_lru(n - 2)`\n\n`print(fibonacci_lru(10))   # 55`" },
        { tipo: "lista", itens: [
          "@lru_cache é um decorador — ele \"envolve\" a função, adicionando o comportamento de cache automaticamente",
          "maxsize=None significa que o cache pode crescer sem limite (guarda todos os resultados já calculados)",
          "Por baixo dos panos, o lru_cache funciona de um jeito parecido com o dicionário manual visto acima"
        ]},

        { tipo: "subtitulo", texto: "Impacto da memoização na complexidade" },

        { tipo: "texto", texto: "Sem memoização, fibonacci(n) é O(2ⁿ) — cada chamada gera duas novas chamadas, formando uma árvore que cresce exponencialmente. Com memoização, fibonacci(n) passa a ser O(n) — porque cada valor de n só é calculado uma única vez; todas as chamadas repetidas são resolvidas em O(1) direto do cache." },
        { tipo: "destaque", texto: "Essa é uma das demonstrações mais cobradas em prova: \"como a memoização muda a complexidade do Fibonacci recursivo?\" — a resposta é que ela reduz de exponencial (O(2ⁿ)) para linear (O(n)), ao custo de gastar memória extra para guardar o cache (trade-off clássico entre tempo e espaço)." },

        { tipo: "subtitulo", texto: "Memoização não serve para qualquer recursão" },

        { tipo: "texto", texto: "Memoização só ajuda quando a função é chamada repetidamente com os mesmos argumentos — se cada chamada recursiva sempre recebe um valor de entrada diferente (como no fatorial(n), onde cada chamada usa um n que nunca se repete durante uma mesma execução), não há nada repetido para \"economizar\", então a memoização não traz ganho de desempenho nesse caso." },
        { tipo: "exemplo", titulo: "Fatorial — caso onde memoização não ajuda", texto: "`def fatorial(n):`\n`    if n == 0:`\n`        return 1`\n`    return n * fatorial(n - 1)`", detalhe: "Aqui, fatorial(3) chama fatorial(2), que chama fatorial(1), que chama fatorial(0) — nenhum valor de n se repete dentro dessa execução, então não há chamadas redundantes para evitar." },
        { tipo: "lista", titulo: "Erros comuns e pegadinhas de prova — Memoização", itens: [
          "Achar que memoização e recursão são a mesma coisa — memoização é uma técnica de otimização que pode ser aplicada sobre uma função recursiva (ou até iterativa), não é um tipo de recursão.",
          "Achar que toda função recursiva se beneficia de memoização — só funções que recalculam os mesmos valores repetidamente ganham vantagem (como Fibonacci); funções como o fatorial não ganham nada, porque nunca repetem uma entrada.",
          "Esquecer de guardar o resultado no cache antes de retornar — se você esquecer o cache[n] = resultado, a função nunca vai de fato economizar chamadas futuras.",
          "Confundir o cache com uma simples variável — o cache precisa guardar múltiplos resultados (por isso é um dicionário, associando entrada → resultado), não um único valor.",
          "Achar que memoização reduz o uso de memória — na verdade é o contrário: ela gasta mais memória (para guardar o cache) em troca de economizar tempo de processamento. É um trade-off tempo × espaço."
        ]}
      ]
    },
    {
      id: "revisao-final",
      titulo: "Revisão Final para a Prova",
      blocos: [
        { tipo: "destaque", texto: "Use esta seção como \"cola\" de última hora antes da prova — reúne o essencial de cada capítulo." },
        { tipo: "topico", titulo: "Listas, Tuplas, Dicionários e Conjuntos", lista: [
          "Lista: ordenada, mutável, permite repetição, acesso por índice [i].",
          "Tupla: ordenada, imutável, acesso por índice. Tupla de 1 elemento precisa de vírgula: (5,).",
          "Dicionário: chave: valor, acesso por chave, `for x in dic` percorre chaves.",
          "Conjunto: não ordenado, sem repetição, sem acesso por índice.",
          "`b = a` (lista) não copia, cria uma segunda referência ao mesmo objeto. Use .copy() ou [:] para copiar de verdade.",
          "`lista[i:j]` não inclui o índice j."
        ]},
        { tipo: "topico", titulo: "Funções", lista: [
          "`return` devolve valor; `print` só mostra na tela. Sem `return`, a função devolve None.",
          "Variável criada dentro da função é local (some ao fim da função).",
          "Atribuir a uma variável já existente fora da função, dentro da função, cria uma variável local nova, a menos que se use `global`.",
          "`*args` recebe argumentos extras como tupla; `**kwargs` como dicionário."
        ]},
        { tipo: "topico", titulo: "Recursão", lista: [
          "Toda recursão precisa de caso base (para parar) e caso recursivo (que caminha em direção ao caso base).",
          "Sem caso base (ou caso base inalcançável) → RecursionError.",
          "Esquecer `return` na chamada recursiva perde o valor calculado.",
          "A execução \"desce\" até o caso base e depois \"sobe\" resolvendo cada chamada pendente — mecanismo de pilha.",
          "Fibonacci recursivo simples é O(2ⁿ): recursão nem sempre é eficiente."
        ]},
        { tipo: "topico", titulo: "Classes e Objetos", lista: [
          "Classe é o molde; objeto é a instância criada a partir dele.",
          "`self` representa o próprio objeto, é sempre o primeiro parâmetro dos métodos.",
          "`__init__` é o construtor, chamado automaticamente ao criar um objeto com Classe(...).",
          "Atributo de instância (self.x) é individual de cada objeto; atributo de classe é compartilhado por todos."
        ]},
        { tipo: "topico", titulo: "Complexidade (Big O)", lista: [
          "Big O descreve como o algoritmo se comporta conforme n cresce, focando no pior caso.",
          "Descartamos constantes e mantemos só o termo dominante.",
          "Ordem de eficiência: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ).",
          "Laço simples → O(n). Laços aninhados dependentes de n → O(n²) (ou O(n³) com três).",
          "Laços sequenciais somam; laços aninhados multiplicam.",
          "`x in lista` é O(n); `x in dicionario`/`x in conjunto` é O(1) em média.",
          "Recursão com 1 chamada por nível → O(n); dividindo pela metade → O(log n); duas chamadas por nível sem reaproveitamento → O(2ⁿ)."
        ]},
        { tipo: "topico", titulo: "Pilhas e Filas", lista: [
          "Pilha (LIFO): push/pop no topo (final da lista em Python). Ideal para desfazer ações, chamadas de função.",
          "Fila (FIFO): enqueue no final, dequeue no início. Use collections.deque para eficiência (popleft() é O(1), enquanto list.pop(0) é O(n)).",
          "Pilha de execução de funções é o mecanismo por trás da recursão."
        ]},
        { tipo: "topico", titulo: "Algoritmos de Ordenação", lista: [
          "Bubble Sort: troca vizinhos repetidamente; maior elemento \"borbulha\" até o final a cada passagem; O(n²).",
          "Selection Sort: busca o menor elemento restante e posiciona; no máximo uma troca por passagem; O(n²) sempre (mesmo em lista quase ordenada).",
          "Insertion Sort: insere cada elemento na posição correta da parte já ordenada; O(n²) no pior caso, mas O(n) no melhor caso (lista quase ordenada).",
          "Merge Sort: divide a lista ao meio recursivamente e depois mescla em ordem; sempre O(n log n); usa memória extra."
        ]},
        { tipo: "topico", titulo: "Memoização", lista: [
          "Técnica que guarda (cacheia) resultados já calculados de uma função, evitando recálculo.",
          "Implementação manual: dicionário associando entrada → resultado.",
          "Implementação pronta: decorador @lru_cache de functools.",
          "Transforma o Fibonacci recursivo de O(2ⁿ) para O(n).",
          "Só é útil quando há chamadas repetidas com os mesmos argumentos (não ajuda em funções como o fatorial).",
          "Trade-off: economiza tempo de processamento, mas gasta mais memória (cache)."
        ]}
      ]
    }
  ]
  }

  ]};