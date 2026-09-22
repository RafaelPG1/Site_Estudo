// ============================================================
// NEXUS STUDY — quiz/conteudo/2026.2/AP1/ques_estruturas_dados.js
// ============================================================
window.questoes = {

  // Questões de Banco de dados 
  questoes: [
    // 1 - Índices de lista
{
  aula: "Capítulo 1: Listas, Dicionários e outras Estruturas Python",
  tipo: "Explicativa",
  texto: "Em Python, toda lista é indexada a partir de 0, não de 1. Isso significa que o primeiro elemento fica na posição 0, o segundo na posição 1, e assim por diante. Se você tentar acessar uma posição que não existe, o Python levanta um erro chamado IndexError, porque está pedindo algo que a lista não tem.",
  question: "Dada a lista precos = [10, 20, 30], qual é o resultado de tentar executar precos[3]?",
  options: [
    "Retorna 30, o último valor da lista",
    "Retorna None, pois a posição está vazia",
    "Gera um IndexError, pois o maior índice válido é 2",
    "Retorna 0, o valor padrão para posições inexistentes"
  ],
  answer: 2,
  feedback: "Como a lista tem 3 elementos, os índices válidos são 0, 1 e 2. O índice 3 não existe, por isso o Python gera IndexError em vez de retornar um valor."
},

// 2 - Fatiamento de listas
{
  aula: "Capítulo 1: Listas, Dicionários e outras Estruturas Python",
  tipo: "Explicativa",
  texto: "O fatiamento (slice) de uma lista usa a notação lista[i:j], onde i é o índice inicial (incluído) e j é o índice final (não incluído). Ou seja, o slice sempre vai 'até, mas sem incluir' o segundo número.",
  question: "Se numeros = [5, 10, 15, 20, 25], o que numeros[1:3] retorna?",
  options: [
    "[10, 15]",
    "[10, 15, 20]",
    "[5, 10, 15]",
    "[15, 20]"
  ],
  answer: 0,
  feedback: "numeros[1:3] pega os índices 1 e 2 (10 e 15), parando antes do índice 3. Esse 'até, sem incluir' é uma das pegadinhas mais comuns de prova."
},

// 3 - Imutabilidade da tupla
{
  aula: "Capítulo 1: Listas, Dicionários e outras Estruturas Python",
  tipo: "Explicativa",
  texto: "Diferente da lista, a tupla é uma coleção ==ddl==imutável==: depois de criada, não é possível alterar, adicionar ou remover seus elementos. Por isso tuplas são úteis para representar dados que não devem mudar, como uma coordenada fixa.",
  question: "O que acontece ao executar coordenada = (10, 20) seguido de coordenada[0] = 99?",
  options: [
    "O primeiro valor da tupla muda para 99",
    "Python cria uma nova tupla automaticamente com o valor atualizado",
    "É gerado um TypeError, pois tuplas não suportam atribuição de item",
    "Nada acontece, o comando é ignorado silenciosamente"
  ],
  answer: 2,
  feedback: "Tentar alterar um item de uma tupla gera TypeError, porque a imutabilidade impede qualquer atribuição direta a uma posição existente."
},

// 4 - Referência vs cópia de lista
{
  aula: "Capítulo 1: Listas, Dicionários e outras Estruturas Python",
  tipo: "Contextualizada",
  texto: "Quando você escreve b = a com a sendo uma lista, b não recebe uma cópia dos dados: b passa a apontar para o mesmo objeto na memória que a. Assim, qualquer alteração feita através de b também aparece em a, porque na verdade existe apenas uma lista, com dois nomes. Para obter uma lista realmente independente, é preciso usar a.copy() ou a[:].",
  question: "Depois de executar a = [1, 2, 3], b = a e b.append(4), qual é o valor de a?",
  options: [
    "[1, 2, 3], pois b é independente de a",
    "[1, 2, 3, 4], pois a e b apontam para a mesma lista",
    "Um erro é gerado, pois listas não podem ser atribuídas assim",
    "[4], pois b substitui completamente a"
  ],
  answer: 1,
  feedback: "Como b = a não copia a lista, apenas cria uma segunda referência, o append feito em b também é visto em a. Para evitar isso, use b = a.copy()."
},

// 5 - Dicionário: get() e ordem de inserção
{
  aula: "Capítulo 1: Listas, Dicionários e outras Estruturas Python",
  tipo: "Contextualizada",
  texto: "Um dicionário guarda pares chave: valor e permite acesso direto por chave. Se você tentar acessar uma chave que não existe usando colchetes, o Python gera um KeyError. O método .get(chave) evita esse erro: se a chave não existir, ele retorna None (ou um valor padrão que você definir), em vez de quebrar o programa. Além disso, a partir do Python 3.7, dicionários mantêm a ordem em que os itens foram inseridos.",
  question: "Para acessar aluno['telefone'] sem correr o risco de gerar um KeyError caso a chave não exista, qual é a forma mais segura?",
  options: [
    "Usar aluno.telefone",
    "Usar aluno.get('telefone')",
    "Usar aluno[0]",
    "Usar del aluno['telefone'] antes de acessar"
  ],
  answer: 1,
  feedback: "O método .get() consulta a chave com segurança: se ela não existir, retorna None em vez de interromper o programa com um KeyError."
},

// 6 - Conjuntos e elementos hashable
{
  aula: "Capítulo 1: Listas, Dicionários e outras Estruturas Python",
  tipo: "Contextualizada",
  texto: "Um conjunto (set) é uma coleção não ordenada que elimina automaticamente valores repetidos e não permite acesso por índice, já que não existe uma posição fixa para cada elemento. Outra regra importante é que um set só pode conter elementos imutáveis (como números, strings e tuplas); uma lista, por ser mutável, não pode ser colocada dentro de um conjunto, pois listas não são 'hashable'.",
  question: "Por que o comando s = {1, [2, 3]} gera um erro em Python?",
  options: [
    "Porque conjuntos não podem ter mais de um elemento",
    "Porque uma lista não é hashable e não pode estar dentro de um set",
    "Porque faltou uma vírgula entre os elementos",
    "Porque o número 1 e a lista têm tipos incompatíveis para soma"
  ],
  answer: 1,
  feedback: "Sets exigem elementos imutáveis (hashable). Como listas podem ser alteradas a qualquer momento, elas não têm um 'hash' fixo, e por isso não podem ser colocadas dentro de um conjunto."
},

// 7 - Escolha de estrutura para coordenada fixa
{
  aula: "Capítulo 1: Listas, Dicionários e outras Estruturas Python",
  tipo: "Aplicação",
  texto: "Imagine que você está desenvolvendo um sistema de mapas e precisa guardar a localização fixa de um ponto de referência, como um marco geográfico, que nunca deve ser alterada durante a execução do programa. Entre as estruturas de dados de Python, uma se destaca justamente por impedir alterações acidentais depois da criação.",
  question: "Qual estrutura é a mais adequada para representar esse ponto de referência fixo?",
  options: [
    "Lista, porque permite adicionar novas coordenadas depois",
    "Tupla, porque é imutável e protege o valor contra alterações",
    "Dicionário, porque permite nomear a coordenada",
    "Conjunto, porque elimina coordenadas repetidas"
  ],
  answer: 1,
  feedback: "Como o ponto não deve mudar, a tupla é a escolha ideal: sua imutabilidade garante que o valor permaneça exatamente como foi definido."
},

// 8 - Remover e-mails duplicados
{
  aula: "Capítulo 1: Listas, Dicionários e outras Estruturas Python",
  tipo: "Aplicação",
  texto: "Suponha que você recebeu uma lista de e-mails cadastrados em um sistema, mas alguns endereços foram inseridos mais de uma vez por engano. Você precisa de uma forma rápida de obter apenas os e-mails únicos, sem se preocupar em programar manualmente a verificação de repetição.",
  question: "Qual comando resolve esse problema de forma mais direta, aproveitando uma característica natural de uma das estruturas de Python?",
  code: `emails = ["a@x.com", "b@x.com", "a@x.com", "c@x.com"]`,
  options: [
    "emails.sort()",
    "list(set(emails))",
    "emails.reverse()",
    "emails.pop(0)"
  ],
  answer: 1,
  feedback: "Transformar a lista em um set remove automaticamente as repetições, já que conjuntos não permitem elementos duplicados; depois, list() converte o resultado de volta para uma lista."
},

// 9 - Dicionário de estoque
{
  aula: "Capítulo 1: Listas, Dicionários e outras Estruturas Python",
  tipo: "Aplicação",
  texto: "Você está montando um pequeno controle de estoque em que cada produto tem uma quantidade associada, e precisa buscar rapidamente a quantidade de um produto específico pelo nome, sem precisar percorrer item por item procurando a posição certa.",
  question: "Qual estrutura de dados foi usada aqui e por que ela é adequada para esse cenário?",
  code: `estoque = {"caneta": 50, "caderno": 20, "borracha": 15}`,
  options: [
    "Lista, porque os produtos ficam em ordem alfabética automaticamente",
    "Tupla, porque os valores de estoque nunca mudam",
    "Dicionário, porque permite buscar o valor diretamente pelo nome do produto (chave)",
    "Conjunto, porque garante que não haja produtos repetidos"
  ],
  answer: 2,
  feedback: "O dicionário associa cada chave (nome do produto) a um valor (quantidade), permitindo acesso direto como estoque['caderno'], sem precisar varrer a estrutura inteira."
},

// 10 - Tupla de um elemento
{
  aula: "Capítulo 1: Listas, Dicionários e outras Estruturas Python",
  tipo: "Explicativa",
  texto: "Uma pegadinha clássica envolvendo tuplas é a criação de uma tupla com um único elemento. Escrever apenas (5) não cria uma tupla — é apenas o número 5 entre parênteses. Para que Python entenda que se trata de uma tupla de um elemento, é obrigatório colocar uma vírgula depois do valor, como em (5,).",
  question: "Qual é o tipo do valor resultante de t1 = (5)?",
  options: [
    "tuple, com um elemento",
    "int, pois os parênteses não criam uma tupla sozinhos",
    "list, pois parênteses e colchetes são equivalentes",
    "dict, pois parênteses também podem representar pares chave-valor"
  ],
  answer: 1,
  feedback: "Sem a vírgula, os parênteses apenas agrupam a expressão, então t1 continua sendo um int. Para criar uma tupla de um elemento, é necessário escrever (5,)."
},

// Capítulo 2 — Funções em Python

// 11 - Parâmetro vs argumento
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Explicativa",
  texto: "Em uma função, parâmetro é o nome da variável definida na assinatura da função, enquanto argumento é o valor real passado quando a função é chamada. Essa distinção é sutil, mas ajuda a entender exatamente o que está sendo definido e o que está sendo enviado.",
  question: "Em def saudacao(nome): ... saudacao('Maria'), o que é 'nome' e o que é 'Maria'?",
  options: [
    "'nome' é o argumento e 'Maria' é o parâmetro",
    "Ambos são parâmetros",
    "'nome' é o parâmetro e 'Maria' é o argumento",
    "Ambos são argumentos"
  ],
  answer: 2,
  feedback: "'nome' é o parâmetro, definido na função; 'Maria' é o argumento, o valor concreto passado na chamada."
},

// 12 - Parâmetro com valor padrão
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Explicativa",
  texto: "Uma função pode ter parâmetros com valor padrão (default), que são usados automaticamente quando o argumento correspondente não é informado na chamada. Isso torna alguns argumentos opcionais.",
  question: "Dado def saudacao(nome='visitante'): print(f'Olá, {nome}!'), o que saudacao() imprime?",
  options: [
    "Olá, None!",
    "Um erro, pois faltou o argumento obrigatório",
    "Olá, visitante!",
    "Olá, !"
  ],
  answer: 2,
  feedback: "Como nenhum argumento foi passado, Python usa o valor padrão 'visitante' definido na assinatura da função."
},

// 13 - return vs print
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Explicativa",
  texto: "print() apenas exibe um valor na tela, mas não devolve nada utilizável para quem chamou a função. Já ==dml==return== devolve um valor que pode ser guardado em uma variável e usado depois. Se uma função não tiver return, ela devolve None por padrão.",
  question: "O que acontece ao executar x = funcao(), sendo que funcao só contém um print(a + b) e nenhum return?",
  options: [
    "x recebe o resultado de a + b",
    "x recebe None, mesmo o valor tendo sido exibido na tela",
    "Um erro é gerado, pois a função não pode ser atribuída a uma variável",
    "x recebe uma string com o texto impresso"
  ],
  answer: 1,
  feedback: "print apenas mostra o valor na tela; sem um return explícito, a função sempre devolve None, mesmo que algo tenha sido impresso durante a execução."
},

// 14 - args e kwargs
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Contextualizada",
  texto: "Quando não sabemos quantos argumentos serão passados para uma função, usamos *args para capturar argumentos posicionais extras (empacotados como tupla) e **kwargs para capturar argumentos nomeados extras (empacotados como dicionário). Essas ferramentas dão flexibilidade à função, permitindo que ela aceite uma quantidade variável de entradas.",
  question: "Ao chamar soma_tudo(1, 2, 3, 4), qual é o tipo da variável numeros dentro da função e qual o resultado?",
  code: `def soma_tudo(*numeros):
    total = 0
    for n in numeros:
        total += n
    return total`,
  options: [
    "numeros é uma lista e o resultado é 10",
    "numeros é uma tupla e o resultado é 10",
    "numeros é um dicionário e o resultado é 4",
    "numeros é uma string e o resultado é '1234'"
  ],
  answer: 1,
  feedback: "*args sempre empacota os argumentos posicionais extras em uma tupla. Somando 1+2+3+4, o resultado é 10."
},

// 15 - Escopo local vs global
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Contextualizada",
  texto: "Toda variável criada dentro de uma função é local: existe apenas enquanto a função está sendo executada e não pode ser acessada fora dela. Já uma variável criada fora de qualquer função é global e pode ser lida de qualquer lugar do código, inclusive de dentro de funções — desde que você não crie uma variável local com o mesmo nome.",
  question: "No código x = 10 seguido de def funcao(): y = 5; print(x); funcao(); print(y), o que acontece na última linha, print(y)?",
  options: [
    "Imprime 5, pois y é global",
    "Gera um erro, pois y é uma variável local e não existe fora da função",
    "Imprime None, pois y não foi inicializada fora da função",
    "Imprime 10, o valor de x"
  ],
  answer: 1,
  feedback: "y foi criada dentro da função, então é uma variável local: ela deixa de existir assim que a função termina, e tentar acessá-la fora gera um erro."
},

// 16 - Palavra-chave global
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Contextualizada",
  texto: "Quando você atribui um valor a uma variável dentro de uma função, e essa variável tem o mesmo nome de uma variável global, o Python não altera a global — ele cria uma nova variável local com esse nome, que só existe dentro da função. Para realmente modificar a variável global de dentro da função, é necessário declarar explicitamente com a palavra-chave global antes de atribuir o novo valor.",
  question: "O que esse código imprime, considerando que a função não usa a palavra-chave global?",
  code: `x = 10
def funcao():
    x = 99
funcao()
print(x)`,
  options: [
    "99, porque a função alterou a variável global",
    "10, porque a atribuição dentro da função criou uma nova variável local, sem afetar a global",
    "Um erro, porque x já existe fora da função",
    "None, porque a função não tem return"
  ],
  answer: 1,
  feedback: "Sem global, x = 99 dentro da função cria uma variável local independente. A variável global x continua com o valor 10 depois da chamada da função."
},

// 17 - Argumentos nomeados vs posicionais
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Aplicação",
  texto: "Ao chamar uma função, é possível passar argumentos por posição (na ordem definida) ou por nome (explicitando qual parâmetro recebe qual valor). Quando se usa argumento nomeado, a ordem deixa de importar para ele — mas há uma regra: se você misturar os dois tipos na mesma chamada, os argumentos posicionais precisam vir antes dos nomeados.",
  question: "Dado def apresentar(nome, idade), qual das chamadas abaixo gera um erro de sintaxe?",
  options: [
    "apresentar('Carlos', 30)",
    "apresentar(idade=30, nome='Carlos')",
    "apresentar('Carlos', idade=30)",
    "apresentar(nome='Carlos', 30)"
  ],
  answer: 3,
  feedback: "Quando um argumento nomeado aparece antes de um posicional na chamada, o Python não sabe interpretar a ordem corretamente, e isso gera um erro de sintaxe."
},

// 18 - Retorno de múltiplos valores
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Aplicação",
  texto: "Uma função em Python pode devolver mais de um valor de uma vez, separando os valores por vírgula depois do return. Internamente, esse retorno é empacotado como uma tupla, e quando chamamos a função podemos 'desempacotar' os valores em variáveis separadas.",
  question: "Depois dessa chamada, quais são os valores de soma e sub?",
  code: `def calcular(a, b):
    return a + b, a - b

soma, sub = calcular(10, 4)`,
  options: [
    "soma = 6 e sub = 14",
    "soma = 14 e sub = 6",
    "soma = (14, 6) e sub = None",
    "Um erro é gerado, pois não é possível retornar dois valores"
  ],
  answer: 1,
  feedback: "return a + b, a - b devolve a tupla (14, 6), que é desempacotada automaticamente: soma recebe 14 e sub recebe 6."
},

// 19 - Código morto após return
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Aplicação",
  texto: "Assim que um return é executado, a função é encerrada imediatamente — nenhuma linha escrita depois dele, dentro do mesmo caminho de execução, chega a rodar. Isso é chamado de código morto quando aparece logo após um return alcançável.",
  question: "O print dentro dessa função chega a ser executado em algum caso?",
  code: `def verificar(n):
    if n < 0:
        return "negativo"
    return "não negativo"
    print("isso nunca é executado")`,
  options: [
    "Sim, sempre que n for negativo",
    "Sim, sempre que n for maior ou igual a zero",
    "Não, porque ele está depois de um return que sempre é alcançado antes dele",
    "Sim, mas apenas na primeira chamada da função"
  ],
  answer: 2,
  feedback: "Como todo caminho da função termina em um return antes de chegar ao print, essa linha é código morto: nunca será executada."
},

// 20 - Função chamando outra função
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Explicativa",
  texto: "Funções podem chamar outras funções dentro de seu próprio corpo, o que permite reaproveitar lógica já pronta. O resultado da função interna é usado como entrada para os cálculos da função externa.",
  question: "Qual é o resultado de quadruplo(3)?",
  code: `def dobro(n):
    return n * 2

def quadruplo(n):
    return dobro(dobro(n))`,
  options: [
    "6",
    "9",
    "12",
    "18"
  ],
  answer: 2,
  feedback: "dobro(3) retorna 6, e dobro(6) retorna 12. Como quadruplo chama dobro duas vezes em sequência, o resultado final é 12."
},

// Capítulo 3 — Recursão
// 21 - Caso base e caso recursivo
{
  aula: "Capítulo 3: Recursão",
  tipo: "Explicativa",
  texto: "Toda função recursiva precisa ter duas partes: um ==key==caso base==, que é a condição mais simples em que a função para de chamar a si mesma e devolve um valor direto, e um caso recursivo, em que a função chama a si mesma com um problema menor, mais próximo do caso base.",
  question: "No fatorial, qual trecho representa o caso base?",
  code: `def fatorial(n):
    if n == 0:
        return 1
    else:
        return n * fatorial(n - 1)`,
  options: [
    "return n * fatorial(n - 1)",
    "if n == 0: return 1",
    "def fatorial(n):",
    "n * fatorial(n - 1)"
  ],
  answer: 1,
  feedback: "O caso base é a condição if n == 0: return 1, pois nela a função devolve um valor diretamente, sem fazer nenhuma nova chamada recursiva."
},

// 22 - Erro sem caso base
{
  aula: "Capítulo 3: Recursão",
  tipo: "Explicativa",
  texto: "Se uma função recursiva não tiver um caso base, ou se o caso base nunca for alcançado, ela continuará chamando a si mesma indefinidamente, até que o programa não consiga mais empilhar novas chamadas e gere o erro RecursionError: maximum recursion depth exceeded.",
  question: "O que acontece ao chamar fatorial_errado(5)?",
  code: `def fatorial_errado(n):
    return n * fatorial_errado(n - 1)`,
  options: [
    "Retorna 120 normalmente",
    "Retorna 0, pois a recursão para automaticamente",
    "Gera um RecursionError, pois não existe caso base para parar as chamadas",
    "Retorna None, pois faltou return"
  ],
  answer: 2,
  feedback: "Sem nenhuma condição de parada, a função continua chamando a si mesma para sempre, até estourar o limite de profundidade da pilha de chamadas."
},

// 23 - Direção do caso base
{
  aula: "Capítulo 3: Recursão",
  tipo: "Explicativa",
  texto: "Não basta ter um caso base: o argumento da chamada recursiva precisa caminhar em direção a ele a cada chamada. Se o argumento estiver se afastando do valor do caso base em vez de se aproximar, a recursão nunca vai parar, mesmo existindo uma condição de parada escrita no código.",
  question: "Por que contagem_errada(1) nunca termina, mesmo tendo um caso base escrito (if n == 0)?",
  code: `def contagem_errada(n):
    if n == 0:
        return
    print(n)
    contagem_errada(n + 1)`,
  options: [
    "Porque falta um return na chamada recursiva",
    "Porque o argumento n aumenta a cada chamada, se afastando do caso base n == 0",
    "Porque a função imprime valores demais",
    "Porque print não pode ser usado dentro de recursão"
  ],
  answer: 1,
  feedback: "Como n cresce (n + 1) em vez de diminuir, ele nunca chega a 0. O caso base existe, mas é inalcançável do jeito que a função está escrita."
},

// 24 - Rastreando a execução do fatorial
{
  aula: "Capítulo 3: Recursão",
  tipo: "Contextualizada",
  texto: "Para acompanhar uma recursão passo a passo, é útil pensar em duas fases: a descida, onde cada chamada empilha uma nova chamada pendente até bater no caso base, e a subida, onde cada chamada pendente é resolvida na ordem inversa, de dentro para fora, até chegar ao resultado final.",
  question: "Ao rastrear fatorial(4), qual é a ordem em que as multiplicações realmente são calculadas?",
  options: [
    "4×3, depois 12×2, depois 24×1, depois 24×1 (de cima para baixo)",
    "1×1, depois 2×1, depois 3×2, depois 4×6 (de baixo para cima, começando pelo caso base)",
    "Todas ao mesmo tempo, pois recursão é paralela",
    "4×3×2×1 em uma única operação simultânea"
  ],
  answer: 1,
  feedback: "A recursão desce até fatorial(0)=1 (caso base) e depois sobe: 1×1=1, 2×1=2, 3×2=6, 4×6=24. O cálculo real acontece de baixo para cima."
},

// 25 - Dois casos base no Fibonacci
{
  aula: "Capítulo 3: Recursão",
  tipo: "Contextualizada",
  texto: "Nem toda função recursiva precisa ter apenas um caso base — às vezes são necessárias duas ou mais condições de parada. No Fibonacci, por exemplo, existem dois casos base (n == 0 e n == 1), porque a fórmula recursiva depende dos dois valores anteriores, e sem parar em ambos não seria possível calcular fibonacci(1) corretamente.",
  question: "Por que essa função precisa de dois casos base, em vez de apenas um como no fatorial?",
  code: `def fibonacci(n):
    if n == 0:
        return 0
    if n == 1:
        return 1
    return fibonacci(n - 1) + fibonacci(n - 2)`,
  options: [
    "Porque Fibonacci é mais lento que o fatorial",
    "Porque cada chamada recursiva depende de dois valores anteriores (n-1 e n-2), então é preciso garantir que ambos os pontos de partida (0 e 1) estejam definidos",
    "Porque o Python exige pelo menos dois casos base em qualquer função",
    "Não há motivo real, poderia funcionar com apenas um caso base"
  ],
  answer: 1,
  feedback: "Como cada chamada soma fibonacci(n-1) e fibonacci(n-2), é necessário ter os dois primeiros valores da sequência definidos diretamente, sem chamada recursiva."
},

// 26 - Esquecer return na chamada recursiva
{
  aula: "Capítulo 3: Recursão",
  tipo: "Contextualizada",
  texto: "Um erro comum em recursão é calcular corretamente a expressão, mas esquecer de usar return na chamada recursiva. Sem o return, o valor calculado é descartado, e a função acaba devolvendo None, mesmo que o cálculo interno estivesse certo.",
  question: "O que print(fatorial_sem_return(4)) exibe?",
  code: `def fatorial_sem_return(n):
    if n == 0:
        return 1
    n * fatorial_sem_return(n - 1)`,
  options: [
    "24, o valor correto do fatorial",
    "None, porque o resultado do cálculo nunca é devolvido para quem chamou",
    "0, porque n começa em 0",
    "Um RecursionError, pois falta o caso base"
  ],
  answer: 1,
  feedback: "Mesmo o cálculo n * fatorial_sem_return(n - 1) sendo feito corretamente, sem return esse valor é descartado, e a função sempre devolve None por padrão."
},

// 27 - Soma de lista com recursão
{
  aula: "Capítulo 3: Recursão",
  tipo: "Aplicação",
  texto: "Recursão também pode ser usada sobre estruturas de dados, como listas: em vez de reduzir um número, cada chamada trabalha com uma lista um pouco menor. O caso base costuma ser a lista vazia, e o caso recursivo combina o primeiro elemento com o resultado da recursão sobre o restante da lista.",
  question: "Ao chamar soma_lista([1, 2, 3, 4]), qual é o 'problema menor' resolvido em cada chamada recursiva?",
  code: `def soma_lista(lista):
    if len(lista) == 0:
        return 0
    return lista[0] + soma_lista(lista[1:])`,
  options: [
    "A mesma lista completa, repetida várias vezes",
    "Uma lista com um elemento a menos a cada chamada, até chegar à lista vazia",
    "Uma lista com o dobro de elementos a cada chamada",
    "A soma total, calculada de uma só vez sem recursão"
  ],
  answer: 1,
  feedback: "A cada chamada, lista[1:] remove o primeiro elemento, criando uma lista cada vez menor, até chegar à lista vazia, que é o caso base."
},

// 28 - Recursão vs iteração e memória
{
  aula: "Capítulo 3: Recursão",
  tipo: "Aplicação",
  texto: "Embora tudo que se faz com recursão também possa ser feito com um laço, as duas abordagens têm custos diferentes: a recursão usa mais memória, porque cada chamada fica na pilha de execução esperando o resultado da próxima, enquanto a iteração usa apenas uma variável sendo atualizada a cada volta do laço.",
  question: "Imagine que você precisa somar os números de 1 até um valor n muito grande (por exemplo, 1 milhão) em um sistema com pouca memória disponível. Qual abordagem é mais segura nesse cenário?",
  options: [
    "Recursão, porque é sempre mais rápida que iteração",
    "Iteração com um laço for, porque evita empilhar milhões de chamadas de função na memória",
    "Recursão, porque o Python otimiza automaticamente qualquer profundidade de chamadas",
    "Tanto faz, as duas abordagens usam exatamente a mesma quantidade de memória"
  ],
  answer: 1,
  feedback: "Para n muito grande, a recursão corre risco de estourar a pilha de chamadas (RecursionError). A versão iterativa evita esse problema, pois usa apenas uma variável total sendo atualizada."
},

// 29 - Relação entre recursão e pilha
{
  aula: "Capítulo 3: Recursão",
  tipo: "Aplicação",
  texto: "A recursão funciona de um jeito muito parecido com uma pilha: cada chamada de função fica 'pendurada', esperando o resultado da próxima chamada, e só é resolvida quando o caso base é atingido e as chamadas começam a ser desempilhadas na ordem inversa (a última que entrou é a primeira a ser resolvida).",
  question: "Pensando nessa relação, qual comportamento de pilha (LIFO) mais se parece com o funcionamento da recursão?",
  options: [
    "FIFO, pois a primeira chamada feita é a primeira a terminar",
    "LIFO, pois a última chamada feita (mais profunda) é a primeira a ser resolvida",
    "Não existe relação entre recursão e pilhas",
    "A recursão se comporta como uma fila, processando as chamadas na ordem de chegada"
  ],
  answer: 1,
  feedback: "Assim como em uma pilha, a última chamada recursiva feita (a mais profunda, perto do caso base) é resolvida primeiro, e as chamadas anteriores só terminam depois, na ordem inversa em que foram feitas."
},

// 30 - Complexidade do Fibonacci recursivo
{
  aula: "Capítulo 3: Recursão",
  tipo: "Contextualizada",
  texto: "A complexidade de uma função recursiva depende de quantas chamadas ela faz a cada nível. Quando uma função faz apenas uma chamada recursiva por nível (como o fatorial), a complexidade cresce de forma linear, O(n). Mas quando ela faz duas chamadas recursivas a cada nível, sem reaproveitar cálculos já feitos (como o Fibonacci recursivo simples), o número de chamadas cresce exponencialmente.",
  question: "Por que o Fibonacci recursivo simples é considerado ineficiente para valores grandes de n?",
  options: [
    "Porque ele usa listas, que são lentas",
    "Porque cada chamada gera duas novas chamadas, criando uma árvore de chamadas que cresce exponencialmente, O(2ⁿ)",
    "Porque ele não tem caso base definido",
    "Porque o Python não permite recursão em funções matemáticas"
  ],
  answer: 1,
  feedback: "Como cada chamada de fibonacci(n) gera duas outras chamadas (n-1 e n-2), sem guardar resultados já calculados, o total de chamadas cresce exponencialmente, tornando o algoritmo muito custoso para n grande."
},

// Capítulo 4 — Classes e Objetos em Python
// 31 - Classe vs objeto
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Explicativa",
  texto: "Uma classe funciona como um molde que define quais atributos (características) e métodos (ações) um tipo de objeto vai ter. Um objeto é uma instância concreta criada a partir desse molde — cada objeto tem seus próprios valores, mesmo compartilhando a mesma estrutura definida pela classe.",
  question: "Se a classe Cachorro define que todo cachorro tem nome e raça, o que representa rex = Cachorro('Rex', 'Labrador')?",
  options: [
    "Uma nova classe chamada rex",
    "Um objeto (instância) da classe Cachorro, com valores próprios de nome e raça",
    "Um método da classe Cachorro",
    "Um atributo de classe compartilhado por todos os cachorros"
  ],
  answer: 1,
  feedback: "rex é um objeto, uma instância concreta criada a partir do molde Cachorro, com seus próprios valores de nome ('Rex') e raça ('Labrador')."
},

// 32 - Self obrigatório nos métodos
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Explicativa",
  texto: "self é sempre o primeiro parâmetro de qualquer método de uma classe, e representa o próprio objeto que está chamando aquele método. Quando você escreve objeto.metodo(), o Python automaticamente passa o objeto como self — por isso, esquecer de declarar self na definição do método causa erro.",
  question: "Por que esse código gera um TypeError ao chamar obj.metodo()?",
  code: `class Errado:
    def metodo():
        print("oi")

obj = Errado()
obj.metodo()`,
  options: [
    "Porque o método não tem nenhum parâmetro além de self",
    "Porque falta o parâmetro self na definição de metodo, mas o Python tenta passar obj automaticamente como primeiro argumento",
    "Porque a classe Errado não tem __init__",
    "Porque print não pode ser usado dentro de métodos"
  ],
  answer: 1,
  feedback: "O Python sempre passa o objeto automaticamente como primeiro argumento de um método. Sem o self na definição, esse argumento extra causa um erro de quantidade de parâmetros."
},

// 33 - Construtor __init__
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Explicativa",
  texto: "__init__ é o construtor de uma classe: um método especial chamado automaticamente toda vez que um novo objeto é criado com NomeDaClasse(...). Sua função é inicializar os atributos do objeto logo na criação, mas ele nunca deve devolver um valor explícito além de None.",
  question: "Quando exatamente o método __init__ da classe Ponto é executado?",
  code: `class Ponto:
    def __init__(self, x, y):
        self.x = x
        self.y = y`,
  options: [
    "Apenas quando chamamos p.__init__() manualmente",
    "Automaticamente, toda vez que um novo objeto é criado com Ponto(x, y)",
    "Apenas na primeira vez que a classe é usada no programa",
    "Nunca é executado automaticamente, precisa ser chamado à parte"
  ],
  answer: 1,
  feedback: "O __init__ roda automaticamente sempre que um objeto é instanciado com Ponto(...), sem precisar de chamada explícita."
},

// 34 - Atributo de instância vs de classe
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Contextualizada",
  texto: "Existem dois tipos de atributos em uma classe: o ==term==atributo de instância==, definido dentro do __init__ com self., que pertence individualmente a cada objeto; e o atributo de classe, definido fora de qualquer método, que é compartilhado por todos os objetos daquela classe.",
  question: "Se alterarmos a1.nome para 'Ana Paula', o que acontece com a2.nome?",
  code: `class Aluno:
    escola = "Colégio ABC"
    def __init__(self, nome):
        self.nome = nome

a1 = Aluno("Ana")
a2 = Aluno("Bruno")`,
  options: [
    "a2.nome também muda para 'Ana Paula', pois nome é atributo de classe",
    "a2.nome continua 'Bruno', pois nome é um atributo de instância, individual de cada objeto",
    "Um erro é gerado, pois não é permitido alterar atributos depois da criação",
    "a2.nome vira None, pois a1 e a2 compartilham memória"
  ],
  answer: 1,
  feedback: "Como nome é definido com self. dentro do __init__, ele é um atributo de instância: pertence individualmente a cada objeto, então alterar a1 não afeta a2."
},

// 35 - Método especial __str__
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Contextualizada",
  texto: "Por padrão, ao tentar imprimir um objeto comum, o Python mostra algo pouco legível, como <__main__.Pessoa object at 0x...>. O método especial __str__ permite personalizar essa representação em texto do objeto: quando definido, print(objeto) chama automaticamente esse método e exibe o texto retornado por ele.",
  question: "O que print(p) exibe nesse caso?",
  code: `class Pessoa:
    def __init__(self, nome, idade):
        self.nome = nome
        self.idade = idade
    def __str__(self):
        return f"{self.nome}, {self.idade} anos"

p = Pessoa("Carlos", 25)`,
  options: [
    "<__main__.Pessoa object at 0x...>, pois __str__ não afeta o print",
    "Carlos, 25 anos",
    "Um erro, pois print não funciona com objetos de classes personalizadas",
    "None, pois __str__ sempre retorna None"
  ],
  answer: 1,
  feedback: "Como a classe define __str__, o Python usa o texto retornado por esse método ao imprimir o objeto, exibindo 'Carlos, 25 anos' em vez da representação padrão."
},

// 36 - Classe vs dicionário
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Contextualizada",
  texto: "Tanto um dicionário quanto uma classe podem guardar dados relacionados a algo, como nome e nota de um aluno. A diferença é que a classe também pode conter métodos, ou seja, comportamentos associados a esses dados — como uma função que calcula se o aluno foi aprovado — algo que um dicionário puro não oferece diretamente.",
  question: "Qual é a principal vantagem de usar essa classe Aluno em vez de um simples dicionário {'nome': 'Ana', 'nota': 8}?",
  code: `class Aluno:
    def __init__(self, nome, nota):
        self.nome = nome
        self.nota = nota
    def aprovado(self):
        return self.nota >= 6`,
  options: [
    "A classe ocupa menos memória que o dicionário em qualquer situação",
    "A classe permite associar comportamentos (métodos), como aprovado(), diretamente aos dados do aluno",
    "Dicionários não podem guardar números, apenas texto",
    "Não existe diferença real entre as duas abordagens"
  ],
  answer: 1,
  feedback: "Além de guardar dados como um dicionário, a classe permite definir métodos, como aprovado(), que operam diretamente sobre os atributos do objeto, algo que um dicionário sozinho não faz."
},

// 37 - Contadores independentes
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Aplicação",
  texto: "Cada objeto criado a partir de uma classe tem seus próprios atributos de instância, completamente independentes dos atributos de outros objetos da mesma classe, mesmo que ambos tenham sido criados a partir do mesmo molde.",
  question: "Depois dessas chamadas, quais são os valores de c1.valor e c2.valor?",
  code: `class Contador:
    def __init__(self):
        self.valor = 0
    def incrementar(self):
        self.valor += 1

c1 = Contador()
c2 = Contador()
c1.incrementar()
c1.incrementar()
c2.incrementar()`,
  options: [
    "c1.valor = 3 e c2.valor = 3, pois ambos compartilham o mesmo contador",
    "c1.valor = 2 e c2.valor = 1, pois cada objeto tem seu próprio valor independente",
    "c1.valor = 1 e c2.valor = 2, pois a ordem das chamadas é invertida",
    "Um erro é gerado, pois dois objetos não podem chamar o mesmo método"
  ],
  answer: 1,
  feedback: "c1 e c2 são objetos independentes: c1.incrementar() foi chamado duas vezes (valor = 2), enquanto c2.incrementar() foi chamado apenas uma vez (valor = 1)."
},

// 38 - Conta bancária com métodos
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Aplicação",
  texto: "Uma classe pode ter métodos que recebem parâmetros para alterar o estado do objeto, como depositar ou sacar valores de uma conta bancária. Cada chamada de método modifica os atributos daquele objeto específico, mantendo o estado atualizado.",
  question: "Qual é o saldo final de conta depois dessas duas operações?",
  code: `class ContaBancaria:
    def __init__(self, titular, saldo=0):
        self.titular = titular
        self.saldo = saldo
    def depositar(self, valor):
        self.saldo += valor
    def sacar(self, valor):
        if valor > self.saldo:
            print("Saldo insuficiente!")
        else:
            self.saldo -= valor

conta = ContaBancaria("Maria", 100)
conta.depositar(50)
conta.sacar(30)`,
  options: [
    "100",
    "150",
    "120",
    "80"
  ],
  answer: 2,
  feedback: "O saldo começa em 100, sobe para 150 após o depósito de 50, e desce para 120 após o saque de 30 (150 - 30 = 120)."
},

// 39 - Esquecer parênteses ao instanciar
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Aplicação",
  texto: "Um erro comum ao trabalhar com classes é esquecer os parênteses na hora de criar um objeto. Escrever obj = Classe (sem parênteses) não cria um objeto novo — apenas faz obj apontar para a própria classe, como se fosse um apelido para ela. Para realmente instanciar um objeto, é necessário escrever obj = Classe().",
  question: "Se você escrever obj = Cachorro (sem os parênteses), o que obj realmente representa?",
  options: [
    "Um novo objeto Cachorro, criado com valores padrão",
    "Uma referência à própria classe Cachorro, não um objeto",
    "Um erro de sintaxe, pois isso é proibido em Python",
    "Uma cópia vazia da classe Cachorro"
  ],
  answer: 1,
  feedback: "Sem os parênteses, nenhum objeto é instanciado: obj apenas se torna outro nome para a classe Cachorro em si, não para uma instância dela."
},

// 40 - Uso incorreto de self dentro de método
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Explicativa",
  texto: "Dentro de um método, é necessário sempre usar self. para acessar ou alterar um atributo do objeto. Escrever apenas o nome da variável, sem self., cria (ou tenta acessar) uma variável local dentro do método, que não tem relação com o atributo do objeto.",
  question: "Depois de chamar p = Pessoa('Ana'); p.mudar_nome('Bia'), qual é o valor de p.nome?",
  code: `class Pessoa:
    def __init__(self, nome):
        self.nome = nome
    def mudar_nome(self, novo_nome):
        nome = novo_nome`,
  options: [
    "'Bia', pois o método alterou o atributo",
    "'Ana', pois o método criou apenas uma variável local nome, sem afetar self.nome",
    "Um erro é gerado, pois novo_nome não existe",
    "None, pois o atributo foi apagado"
  ],
  answer: 1,
  feedback: "Como o método usa nome = novo_nome em vez de self.nome = novo_nome, ele apenas cria uma variável local que desaparece ao final do método; o atributo real, self.nome, permanece 'Ana'."
},

// Capítulo 5 — Análise de Complexidade e Eficiência de Algoritmos
// 51 - Simplificação de constantes no Big O
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Explicativa",
  texto: "Ao calcular a notação Big O, ignoramos constantes multiplicativas e mantemos apenas o termo que domina o crescimento quando n fica muito grande. Por exemplo, O(2n) é simplificado para O(n), e O(n² + n) é simplificado para O(n²), porque o termo n² cresce muito mais rápido que n.",
  question: "Como simplificamos a complexidade O(3n + 7)?",
  options: [
    "O(3n)",
    "O(n)",
    "O(7)",
    "O(n²)"
  ],
  answer: 1,
  feedback: "Descartamos a constante multiplicativa 3 e a constante aditiva 7, restando apenas o termo que cresce com n: O(n)."
},

// 42 - Tempo constante O(1)
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Explicativa",
  texto: "Um algoritmo é ==type==O(1)==, ou tempo constante, quando realiza a mesma quantidade de operações independentemente do tamanho da entrada. Acessar diretamente um elemento pelo índice, por exemplo, sempre leva a mesma quantidade de passos, seja a lista pequena ou enorme.",
  question: "Por que essa função é considerada O(1), mesmo funcionando com listas de qualquer tamanho?",
  code: `def primeiro_elemento(lista):
    return lista[0]`,
  options: [
    "Porque ela sempre acessa a mesma posição (índice 0), independente de quantos elementos a lista tenha",
    "Porque listas pequenas são sempre mais rápidas de acessar",
    "Porque a função não usa nenhum laço, o que sempre garante O(n)",
    "Porque return é uma operação O(n) por padrão"
  ],
  answer: 0,
  feedback: "Acessar lista[0] é sempre uma única operação direta, não importa se a lista tem 3 ou 3 milhões de elementos — por isso a complexidade é constante, O(1)."
},

// 43 - Laços aninhados O(n²)
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Explicativa",
  texto: "Quando dois laços estão aninhados e ambos dependem do tamanho da entrada n, a complexidade se multiplica: para cada uma das n voltas do laço externo, o laço interno roda outras n vezes, totalizando n × n = n² operações.",
  question: "Qual é a complexidade desse trecho de código?",
  code: `for i in range(n):
    for j in range(n):
        print(i, j)`,
  options: [
    "O(n)",
    "O(2n)",
    "O(n²)",
    "O(log n)"
  ],
  answer: 2,
  feedback: "Como os dois laços dependem de n e estão aninhados, a complexidade é O(n²): o laço interno roda n vezes para cada uma das n voltas do laço externo."
},

// 44 - Laço interno com quantidade fixa
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Contextualizada",
  texto: "Nem todo laço aninhado resulta em O(n²). Se o laço interno não depende do tamanho de n — por exemplo, sempre executa uma quantidade fixa de vezes —, a complexidade continua sendo O(n), porque essa quantidade fixa é tratada como uma constante e descartada na simplificação do Big O.",
  question: "Qual é a complexidade real desse código, mesmo parecendo um laço duplo?",
  code: `for i in range(n):
    for j in range(5):
        print(i, j)`,
  options: [
    "O(n²), porque há dois laços aninhados",
    "O(5n), sem simplificação possível",
    "O(n), porque o laço interno sempre roda 5 vezes, uma constante independente de n",
    "O(1), porque o valor 5 é pequeno"
  ],
  answer: 2,
  feedback: "O laço interno roda sempre 5 vezes, independente do valor de n. Isso resulta em O(n × 5), que simplifica para O(n), pois constantes são descartadas."
},

// 45 - Laços sequenciais somam
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Contextualizada",
  texto: "Diferente de laços aninhados (que multiplicam), dois laços sequenciais — um depois do outro, sem estar um dentro do outro — têm suas complexidades somadas. Se cada laço é O(n), o total é O(n) + O(n) = O(2n), que se simplifica para O(n) depois de descartar a constante.",
  question: "Qual é a complexidade total desse código com dois laços separados, cada um rodando n vezes?",
  code: `for i in range(n):
    print(i)
for j in range(n):
    print(j)`,
  options: [
    "O(n²), pois os dois laços se multiplicam",
    "O(n), pois laços sequenciais somam, e a constante 2 é descartada",
    "O(2n²), pois os dois laços se combinam de forma quadrática",
    "O(log n), pois há dois laços independentes"
  ],
  answer: 1,
  feedback: "Como os laços não estão um dentro do outro, suas complexidades se somam: O(n) + O(n) = O(2n), que simplifica para O(n)."
},

// 46 - x in lista vs x in dicionario/conjunto
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Contextualizada",
  texto: "Verificar se um elemento existe usando o operador in tem custo diferente dependendo da estrutura: em uma lista, x in lista é O(n), pois no pior caso é preciso percorrer todos os elementos até encontrar (ou não encontrar) o valor. Já em dicionários e conjuntos, x in dic ou x in conjunto é O(1) em média, graças à forma como esses tipos organizam os dados internamente (hashing).",
  question: "Se lista2 for uma lista comum, qual é a complexidade total dessa função, considerando o laço e a busca dentro dele?",
  code: `def contem_todos(lista1, lista2):
    for item in lista1:
        if item in lista2:
            print("encontrado")`,
  options: [
    "O(n), pois só existe um laço explícito no código",
    "O(n²), pois o laço roda n vezes e, dentro dele, o in em uma lista também é O(n)",
    "O(1), pois in é sempre uma operação rápida",
    "O(log n), pois buscas sempre são logarítmicas"
  ],
  answer: 1,
  feedback: "Mesmo sem um segundo laço visível, o item in lista2 já é O(n) por si só. Multiplicando pelo laço externo (também O(n)), o total é O(n²) — uma pegadinha clássica de prova."
},

// 47 - Escolher set para busca frequente
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Aplicação",
  texto: "Imagine que você precisa verificar repetidamente, milhares de vezes, se um determinado código de produto já foi processado antes, dentro de um sistema que recebe uma quantidade grande de pedidos. A estrutura escolhida para guardar os códigos já processados vai impactar diretamente o desempenho dessas verificações.",
  question: "Para minimizar o custo de cada verificação 'esse código já foi processado?', qual estrutura é mais eficiente para guardar os códigos processados?",
  options: [
    "Uma lista, porque mantém a ordem de chegada dos códigos",
    "Um conjunto (set), porque a verificação in é O(1) em média, muito mais rápida que O(n) de uma lista",
    "Uma tupla, porque é imutável e mais rápida por padrão",
    "Não faz diferença, todas as estruturas têm o mesmo desempenho para busca"
  ],
  answer: 1,
  feedback: "Como a busca in em um set é O(1) em média (contra O(n) em uma lista), usar um conjunto reduz drasticamente o tempo total quando há muitas verificações repetidas."
},

// 48 - Busca binária O(log n)
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Aplicação",
  texto: "Alguns algoritmos reduzem o problema pela metade a cada passo, em vez de percorrer elemento por elemento. Esse comportamento gera uma complexidade logarítmica, O(log n), muito mais eficiente que uma busca linear (O(n)) para listas grandes, porque a quantidade de passos necessários cresce muito devagar conforme n aumenta.",
  question: "Se você precisa buscar um valor em uma lista JÁ ORDENADA com 1 milhão de elementos, por que a busca binária é preferível a percorrer a lista item por item?",
  code: `def busca_binaria(lista, alvo):
    inicio, fim = 0, len(lista) - 1
    while inicio <= fim:
        meio = (inicio + fim) // 2
        if lista[meio] == alvo:
            return meio
        elif lista[meio] < alvo:
            inicio = meio + 1
        else:
            fim = meio - 1
    return -1`,
  options: [
    "Porque a busca binária sempre encontra o valor na primeira tentativa",
    "Porque a cada passo ela corta a área de busca pela metade, exigindo muito menos comparações (O(log n)) do que examinar todos os elementos (O(n))",
    "Porque listas ordenadas não podem ser percorridas item por item",
    "Porque a busca binária não depende do tamanho da lista"
  ],
  answer: 1,
  feedback: "Como cada passo da busca binária elimina metade das possibilidades restantes, o número de comparações necessárias cresce de forma logarítmica, muito menor que uma varredura linear completa."
},

// 49 - Pior caso em if/else
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Aplicação",
  texto: "Ao calcular a complexidade de um trecho com if/else, consideramos o pior caso possível entre os caminhos, ou seja, o ramo que realiza mais operações. Mesmo que na prática esse ramo nem sempre seja executado, a notação Big O tradicionalmente representa o comportamento no cenário mais custoso.",
  question: "Qual é a complexidade total dessa função, considerando a definição tradicional de Big O?",
  code: `def exemplo(lista, n):
    if len(lista) > 100:
        for i in range(n):
            print(i)
    else:
        print("lista pequena")`,
  options: [
    "O(1), pois o caminho mais comum (else) é rápido",
    "O(n), pois consideramos o pior caso, que é o ramo com o laço",
    "O(n²), pois há um if dentro do laço",
    "Não é possível determinar a complexidade de uma função com if/else"
  ],
  answer: 1,
  feedback: "Big O foca no pior caso possível: mesmo que o ramo else seja O(1), o ramo if pode executar um laço O(n), e é esse cenário mais custoso que define a complexidade da função."
},

// 50 - Complexidade de recursões diferentes
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Contextualizada",
  texto: "A complexidade de uma função recursiva depende de dois fatores: quantas chamadas ela faz por nível e quanto o problema diminui a cada chamada. Uma recursão que faz uma chamada por nível, reduzindo o problema em uma unidade a cada vez (como o fatorial), tem complexidade O(n). Já uma recursão que divide o problema pela metade a cada chamada (como uma busca binária recursiva) tem complexidade O(log n), muito mais eficiente.",
  question: "Entre uma função recursiva que reduz n em 1 a cada chamada e outra que divide n pela metade a cada chamada, qual tende a ser mais eficiente para valores grandes de entrada, e por quê?",
  options: [
    "A que reduz em 1, porque faz menos contas em cada chamada",
    "A que divide pela metade, porque precisa de muito menos chamadas até atingir o caso base, resultando em O(log n) em vez de O(n)",
    "As duas são igualmente eficientes, pois ambas são recursivas",
    "A que reduz em 1, porque recursão linear é sempre mais rápida que recursão logarítmica"
  ],
  answer: 1,
  feedback: "Dividir o problema pela metade a cada chamada reduz drasticamente o número de chamadas necessárias, chegando a O(log n), enquanto reduzir apenas 1 por vez exige O(n) chamadas — uma diferença enorme para entradas grandes."
},

// Capítulo 6 — Pilhas e Filas
// 51 - Regra LIFO da pilha
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Explicativa",
  texto: "Uma pilha segue a regra ==rule==LIFO== (Last In, First Out): o último elemento inserido é sempre o primeiro a ser removido. Pense em uma pilha de pratos — você só pode tirar o prato que está no topo, nunca um do meio ou do fundo.",
  question: "Se a próxima operação for pilha.pop(), qual elemento será removido?",
  code: `pilha = []
pilha.append(1)
pilha.append(2)
pilha.append(3)`,
  options: [
    "1, pois foi o primeiro a entrar",
    "2, pois está no meio",
    "3, pois foi o último a entrar e a pilha é LIFO",
    "Todos os elementos, pois pop() esvazia a pilha"
  ],
  answer: 2,
  feedback: "Como a pilha segue a regra LIFO, o elemento 3, que foi inserido por último, é removido primeiro pelo pop()."
},

// 52 - Regra FIFO da fila
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Explicativa",
  texto: "Uma fila segue a regra FIFO (First In, First Out): o primeiro elemento inserido é o primeiro a ser removido, exatamente como uma fila de banco, onde quem chega primeiro é atendido primeiro.",
  question: "Qual valor fila.popleft() retorna primeiro?",
  code: `from collections import deque
fila = deque()
fila.append("Ana")
fila.append("Bruno")
fila.append("Carla")`,
  options: [
    "'Carla', pois foi a última a entrar",
    "'Ana', pois foi a primeira a entrar e a fila é FIFO",
    "'Bruno', pois está no meio da fila",
    "Um erro, pois popleft() não existe em deque"
  ],
  answer: 1,
  feedback: "Como a fila segue a regra FIFO, 'Ana', que entrou primeiro, também é a primeira a sair quando chamamos popleft()."
},

// 53 - peek não remove elemento
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Explicativa",
  texto: "A operação peek() (também chamada de top() em pilhas) apenas consulta o elemento que está na posição de acesso (topo da pilha ou frente da fila), sem removê-lo da estrutura. Isso é diferente de pop() ou dequeue(), que removem o elemento consultado.",
  question: "Depois de chamar p.peek() duas vezes seguidas, o que acontece com p.itens?",
  code: `class Pilha:
    def __init__(self):
        self.itens = []
    def peek(self):
        return self.itens[-1] if self.itens else None

p = Pilha()
p.itens = [1, 2, 3]`,
  options: [
    "Fica [1, 2], pois cada peek() remove um elemento",
    "Fica [1], pois peek() remove dois elementos de uma vez",
    "Continua [1, 2, 3], pois peek() apenas consulta, sem remover nada",
    "Fica vazio, pois peek() esvazia a pilha"
  ],
  answer: 2,
  feedback: "peek() apenas olha o elemento do topo (nesse caso, sempre retornando 3), sem alterar o conteúdo da pilha. Por isso p.itens permanece [1, 2, 3] após as duas chamadas."
},

// 54 - Eficiência de append/pop no final da lista
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Contextualizada",
  texto: "Ao implementar uma pilha usando uma lista Python, escolhemos tratar o final da lista como o topo, usando append() para inserir e pop() (sem argumento) para remover. Essa escolha não é por acaso: ambas as operações no final de uma lista são O(1). Se usássemos o início da lista como topo, precisaríamos de insert(0, x) e pop(0), que são O(n), pois obrigam todos os outros elementos a serem deslocados de posição.",
  question: "Por que implementar uma pilha usando o final da lista (append/pop) é mais eficiente do que usar o início (insert(0, x)/pop(0))?",
  options: [
    "Porque o final da lista sempre ocupa menos memória",
    "Porque append() e pop() no final são O(1), enquanto insert(0, x) e pop(0) são O(n), já que deslocam todos os outros elementos",
    "Porque o Python proíbe inserir elementos no início de uma lista",
    "Não existe diferença de desempenho entre as duas abordagens"
  ],
  answer: 1,
  feedback: "Inserir ou remover no início de uma lista exige deslocar todos os elementos restantes (O(n)), enquanto operar no final não afeta os demais elementos, sendo O(1) — por isso o final da lista é escolhido como topo da pilha."
},

// 55 - Ineficiência da fila com lista comum
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Contextualizada",
  texto: "Implementar uma fila com uma lista comum parece simples, mas esconde uma armadilha de eficiência: usar itens.pop(0) para remover o elemento da frente da fila é uma operação O(n), porque todos os elementos restantes precisam ser deslocados uma posição para trás. Para evitar esse problema, usa-se collections.deque, que oferece popleft() em O(1).",
  question: "Qual é o principal problema de desempenho dessa implementação de fila usando uma lista comum?",
  code: `class FilaComLista:
    def __init__(self):
        self.itens = []
    def enqueue(self, valor):
        self.itens.append(valor)
    def dequeue(self):
        return self.itens.pop(0)`,
  options: [
    "enqueue() é O(n), pois append() sempre é lento",
    "dequeue() é O(n), pois itens.pop(0) precisa deslocar todos os elementos restantes",
    "A fila não pode armazenar mais de 10 elementos",
    "Não há problema, essa implementação já é eficiente"
  ],
  answer: 1,
  feedback: "O gargalo está em itens.pop(0): remover o primeiro elemento de uma lista exige deslocar todos os outros, tornando essa operação O(n) — por isso deque com popleft() (O(1)) é a alternativa recomendada."
},

// 56 - Relação entre pilha e recursão
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Contextualizada",
  texto: "A execução de uma função recursiva se comporta exatamente como uma pilha: cada chamada fica 'empilhada', esperando o resultado da chamada seguinte, e só é resolvida quando o caso base é atingido — momento em que as chamadas começam a ser 'desempilhadas' na ordem inversa. Se a recursão for profunda demais e nunca atingir o caso base, essa pilha de chamadas estoura, gerando o erro RecursionError.",
  question: "Por que o erro RecursionError: maximum recursion depth exceeded está diretamente relacionado ao conceito de pilha?",
  options: [
    "Porque o Python usa uma fila, não uma pilha, para controlar as chamadas de função",
    "Porque cada chamada de função recursiva ocupa um espaço na pilha de execução, e chamadas demais sem atingir o caso base esgotam esse espaço",
    "Porque RecursionError só ocorre quando se usa a estrutura Pilha explicitamente no código",
    "Porque recursão sempre usa memória O(1), então esse erro nunca deveria acontecer"
  ],
  answer: 1,
  feedback: "Cada chamada recursiva pendente ocupa espaço na pilha de execução do programa. Se o caso base nunca é atingido, essas chamadas se acumulam até estourar o limite da pilha, causando o RecursionError."
},

// 57 - Verificação de parênteses balanceados
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Aplicação",
  texto: "Um uso clássico de pilha é verificar se os parênteses de uma expressão estão balanceados: a cada '(' encontrado, empilhamos um marcador; a cada ')' encontrado, desempilhamos. Se tentarmos desempilhar uma pilha vazia, é sinal de um fechamento sem abertura correspondente. Ao final, se a pilha não estiver vazia, é sinal de que algo ficou sem fechar.",
  question: "Qual é o resultado de parenteses_balanceados('(a+b*(c-d)') e por quê?",
  code: `def parenteses_balanceados(expressao):
    pilha = []
    for caractere in expressao:
        if caractere == "(":
            pilha.append(caractere)
        elif caractere == ")":
            if len(pilha) == 0:
                return False
            pilha.pop()
    return len(pilha) == 0`,
  options: [
    "True, porque todos os parênteses foram usados corretamente",
    "False, porque sobra um '(' sem fechar correspondente na pilha ao final da expressão",
    "False, porque a expressão tem letras, e a função só aceita números",
    "True, porque a pilha nunca fica vazia durante a execução"
  ],
  answer: 1,
  feedback: "Nessa expressão há dois '(' e apenas um ')'. Ao final, a pilha ainda tem um elemento não desempilhado, então a função retorna False, indicando parênteses não balanceados."
},

// 58 - Escolher pilha para desfazer ações
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Aplicação",
  texto: "Ao escolher entre pilha e fila para resolver um problema, o critério principal é a ordem de acesso exigida: se a última coisa feita precisa ser a primeira a ser desfeita ou processada, o comportamento é LIFO (pilha); se a primeira coisa feita precisa ser a primeira a ser processada, o comportamento é FIFO (fila).",
  question: "Para implementar a funcionalidade 'Desfazer' (Ctrl+Z) de um editor de texto, onde a última ação realizada deve ser a primeira a ser desfeita, qual estrutura é a mais adequada?",
  options: [
    "Fila, porque as ações devem ser desfeitas na ordem em que foram feitas",
    "Pilha, porque a última ação realizada deve ser a primeira a sair, comportamento LIFO",
    "Conjunto, porque evita desfazer a mesma ação duas vezes",
    "Dicionário, porque permite nomear cada ação realizada"
  ],
  answer: 1,
  feedback: "Como a ação mais recente deve ser desfeita primeiro, esse é exatamente o comportamento LIFO de uma pilha: cada ação é empilhada, e o Ctrl+Z desempilha a última realizada."
},

// 59 - Fila para atendimento de banco
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Aplicação",
  texto: "Sistemas de atendimento, como filas de banco ou call center, seguem naturalmente a ordem de chegada: quem chega primeiro deve ser atendido primeiro. Esse é exatamente o comportamento FIFO, o oposto do comportamento LIFO das pilhas.",
  question: "Para simular um sistema de atendimento de banco, em que clientes devem ser atendidos na ordem em que chegaram, qual estrutura é a mais adequada e por quê?",
  options: [
    "Pilha, porque o último cliente a chegar deve ser atendido primeiro",
    "Fila, porque segue a regra FIFO, atendendo os clientes na mesma ordem de chegada",
    "Lista comum, pois pilha e fila não fazem diferença nesse caso",
    "Conjunto, porque garante que não haja clientes repetidos na fila"
  ],
  answer: 1,
  feedback: "Como a ordem de chegada precisa ser respeitada no atendimento, a fila (FIFO) é a estrutura correta: o primeiro cliente a entrar é o primeiro a ser atendido."
},

// 60 - Inverter lista usando pilha
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Explicativa",
  texto: "Uma aplicação interessante de pilha é inverter a ordem de uma lista: basta empilhar todos os elementos, na ordem original, e depois desempilhá-los um a um. Como a pilha é LIFO, o último elemento empilhado (que era o último da lista original) sai primeiro, e assim a ordem acaba invertida naturalmente.",
  question: "Por que esse algoritmo consegue inverter a ordem da lista original apenas empilhando e desempilhando os elementos?",
  code: `def inverter_com_pilha(lista):
    pilha = []
    for item in lista:
        pilha.append(item)
    invertida = []
    while pilha:
        invertida.append(pilha.pop())
    return invertida`,
  options: [
    "Porque append() sempre inverte a ordem dos elementos automaticamente",
    "Porque a pilha é LIFO: o último elemento empilhado (o último da lista original) é o primeiro a ser desempilhado, invertendo a ordem naturalmente",
    "Porque pop() reorganiza a lista em ordem alfabética",
    "Porque while pilha percorre a lista de trás para frente sem usar pop()"
  ],
  answer: 1,
  feedback: "Como pop() sempre remove o último elemento inserido (comportamento LIFO), desempilhar tudo devolve os elementos na ordem inversa à que foram empilhados, invertendo a lista original."
},

// 61 - Ideia do Bubble Sort
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Explicativa",
  texto: "O Bubble Sort percorre a lista repetidamente comparando pares de elementos vizinhos e trocando-os de lugar quando estão fora de ordem. A cada passagem completa, o maior elemento ainda não posicionado vai parando no final da lista, como uma bolha subindo até a superfície.",
  question: "Em uma lista [5, 3, 8, 1], o que acontece com o elemento 8 já na primeira passagem completa do Bubble Sort?",
  options: [
    "Ele é comparado apenas com o primeiro elemento da lista",
    "Ele vai parar na posição final da lista, pois é o maior elemento",
    "Ele permanece na posição original, sem ser comparado",
    "Ele é movido para o início da lista"
  ],
  answer: 1,
  feedback: "Como o Bubble Sort compara vizinhos e troca quando necessário, o maior valor encontrado numa passagem sempre acaba \"empurrado\" até a última posição ainda não fixada."
},

// 62 - Característica do Selection Sort
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Explicativa",
  texto: "O Selection Sort separa a lista em uma parte ordenada e outra não ordenada. A cada passagem, ele varre toda a parte não ordenada em busca do menor elemento e faz, no máximo, uma única troca para colocá-lo na posição correta.",
  question: "Qual é a principal diferença no número de trocas entre o Selection Sort e o Bubble Sort?",
  options: [
    "O Selection Sort nunca faz trocas, apenas comparações",
    "O Selection Sort faz no máximo uma troca por passagem, enquanto o Bubble Sort pode trocar vários pares de vizinhos na mesma passagem",
    "Os dois fazem exatamente o mesmo número de trocas",
    "O Bubble Sort faz apenas uma troca por passagem, como o Selection Sort"
  ],
  answer: 1,
  feedback: "O Selection Sort só troca depois de encontrar o menor elemento de toda a parte não ordenada, enquanto o Bubble Sort troca a cada par de vizinhos fora de ordem que encontra."
},

// 63 - Melhor caso do Insertion Sort
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Explicativa",
  texto: "O Insertion Sort pega cada elemento da parte não ordenada e o insere na posição correta dentro da parte já ordenada, deslocando os maiores para a direita quando necessário. Quando a lista já está quase ordenada, poucos deslocamentos são necessários, o que torna esse algoritmo muito rápido nesse cenário.",
  question: "Por que o Insertion Sort tem complexidade O(n) no melhor caso, diferente do Bubble Sort e do Selection Sort?",
  options: [
    "Porque ele usa menos memória que os outros dois",
    "Porque, se a lista já estiver ordenada, cada elemento é inserido sem precisar deslocar nada, exigindo apenas uma passagem",
    "Porque ele divide a lista ao meio, como o Merge Sort",
    "Porque ele não faz nenhuma comparação entre elementos"
  ],
  answer: 1,
  feedback: "Bubble e Selection sempre varrem a lista inteira mesmo se ela já estiver ordenada, mas o Insertion Sort consegue perceber que não há nada para deslocar e termina em tempo linear nesse caso."
},

// 64 - Estratégia do Merge Sort
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Contextualizada",
  texto: "O Merge Sort usa a estratégia de dividir para conquistar: primeiro quebra a lista ao meio recursivamente até sobrarem apenas listas de 1 elemento, e depois vai mesclando essas listinhas de volta, sempre comparando o primeiro elemento de cada metade e colocando o menor primeiro no resultado. Essa lógica de \"quebrar o problema em partes menores\" é a mesma usada na recursão em geral.",
  question: "Ao contrário do Bubble, Selection e Insertion Sort, o que o Merge Sort faz antes de começar a comparar elementos de fato?",
  options: [
    "Ele ordena a lista inteira de uma vez, sem dividir nada",
    "Ele divide a lista inteira repetidamente ao meio até chegar a listas de um único elemento",
    "Ele troca os elementos vizinhos, como o Bubble Sort",
    "Ele procura o menor elemento da lista toda"
  ],
  answer: 1,
  feedback: "As comparações só acontecem na fase de mesclagem; antes disso, o Merge Sort apenas divide a lista original em partes cada vez menores."
},

// 65 - Trocas: Bubble vs Selection
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Contextualizada",
  texto: "Mesmo tendo a mesma complexidade O(n²) no pior e no caso médio, Bubble Sort e Selection Sort se comportam de forma diferente na prática: o Bubble Sort pode realizar várias trocas dentro de uma única passagem, enquanto o Selection Sort limita-se a, no máximo, uma troca por passagem, já que só troca depois de identificar o menor elemento restante.",
  question: "Dois algoritmos podem ter o mesmo Big O e ainda assim se comportar de forma diferente na prática. Isso se aplica ao Bubble e ao Selection Sort porque:",
  options: [
    "O Selection Sort geralmente faz menos trocas que o Bubble Sort, mesmo com a mesma complexidade O(n²)",
    "O Bubble Sort nunca faz mais de uma troca, assim como o Selection Sort",
    "Os dois algoritmos têm complexidades diferentes, então a comparação não faz sentido",
    "Big O mede exatamente o número de trocas realizadas, então eles são idênticos na prática"
  ],
  answer: 0,
  feedback: "Big O descreve o crescimento assintótico, não o número exato de operações — por isso dois algoritmos O(n²) podem ter desempenhos práticos bem diferentes."
},

// 66 - Comparação de complexidades na tabela
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Contextualizada",
  texto: "Dos quatro algoritmos vistos, três (Bubble, Selection e Insertion) têm pior caso O(n²), enquanto o Merge Sort mantém O(n log n) tanto no melhor quanto no pior caso, graças à divisão pela metade repetida (o \"log n\") combinada com o trabalho de mesclar as partes (o \"n\").",
  question: "Para uma lista muito grande e em ordem totalmente aleatória, qual algoritmo tende a ser mais eficiente considerando o pior caso?",
  options: [
    "Bubble Sort, por ser o mais simples de implementar",
    "Selection Sort, porque faz poucas trocas",
    "Insertion Sort, porque tem melhor caso O(n)",
    "Merge Sort, porque garante O(n log n) mesmo no pior caso"
  ],
  answer: 3,
  feedback: "Para listas grandes e sem nenhuma ordem prévia, o pior caso é o que mais importa — e o Merge Sort é o único dos quatro que garante O(n log n) mesmo nesse cenário."
},

// 67 - Aplicação: lista quase ordenada
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Aplicação",
  texto: "Imagine um sistema que recebe diariamente uma lista de preços já quase ordenada, com apenas 2 ou 3 itens fora do lugar em relação ao dia anterior. Nesse cenário, o Insertion Sort tende a fazer pouquíssimos deslocamentos, aproximando-se do seu melhor caso O(n).",
  question: "Nesse cenário de lista quase ordenada, qual algoritmo dos quatro estudados tende a apresentar o melhor desempenho?",
  options: [
    "Bubble Sort, pois sempre percorre a lista inteira independentemente da ordem",
    "Selection Sort, pois sempre busca o menor elemento em toda a parte não ordenada",
    "Insertion Sort, pois se aproxima do seu melhor caso O(n) quando a lista já está quase ordenada",
    "Merge Sort, pois divide a lista pela metade independentemente da ordem"
  ],
  answer: 2,
  feedback: "O Insertion Sort é o único dos quatro cujo melhor caso é O(n), e ele acontece justamente quando a lista já está (quase) ordenada."
},

// 68 - Aplicação: lista grande e desordenada
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Aplicação",
  texto: "Uma aplicação precisa ordenar um milhão de registros vindos em ordem completamente aleatória, e a equipe quer garantir um tempo de execução previsível, sem risco de \"piores casos\" muito lentos.",
  question: "Para esse cenário de grande volume de dados totalmente desordenados, qual algoritmo seria a escolha mais segura entre os quatro estudados?",
  options: [
    "Bubble Sort, por ser o mais simples de implementar",
    "Selection Sort, porque faz poucas trocas",
    "Merge Sort, porque mantém O(n log n) garantido, independentemente da ordem inicial",
    "Insertion Sort, porque tem melhor caso O(n)"
  ],
  answer: 2,
  feedback: "Como os dados estão totalmente desordenados, o melhor caso do Insertion Sort não se aplica — e o Merge Sort é o único que garante desempenho previsível (O(n log n)) mesmo no pior cenário."
},

// 69 - Aplicação: trade-off de memória no Merge Sort
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Aplicação",
  texto: "Um sistema embarcado com memória muito limitada precisa ordenar pequenas listas de sensores. O Merge Sort, apesar de eficiente em tempo, precisa criar listas temporárias durante a mesclagem, consumindo memória extra — algo que pode ser um problema nesse tipo de ambiente restrito.",
  question: "Nesse cenário de memória limitada e listas pequenas, por que o Merge Sort pode não ser a melhor escolha, mesmo sendo o mais eficiente em tempo?",
  options: [
    "Porque o Merge Sort tem complexidade pior que o Bubble Sort",
    "Porque o Merge Sort precisa de memória extra para as listas temporárias da mesclagem, o que pesa mais em ambientes restritos",
    "Porque o Merge Sort não funciona corretamente em listas pequenas",
    "Porque o Merge Sort sempre precisa de mais trocas que o Selection Sort"
  ],
  answer: 1,
  feedback: "Esse é o trade-off clássico do Merge Sort: ele ganha em tempo (O(n log n) garantido), mas gasta memória extra — o que pode pesar justamente em sistemas com poucos recursos."
},

// 70 - Reforço: Bubble Sort compara só vizinhos
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Explicativa",
  texto: "Uma pegadinha comum é achar que o Bubble Sort pode comparar quaisquer dois elementos da lista. Na verdade, ele só compara elementos que estão em posições adjacentes (lado a lado) em cada passagem — ele nunca \"pula\" elementos para comparar posições distantes.",
  question: "Em uma passagem do Bubble Sort sobre a lista [3, 5, 8, 1], quais comparações diretas o algoritmo realiza?",
  options: [
    "Compara 3 com 8, e depois 5 com 1",
    "Compara apenas o primeiro elemento com o último",
    "Compara 3 com 5, depois 5 com 8, depois 8 com 1 — sempre elementos vizinhos",
    "Compara todos os elementos entre si, dois a dois"
  ],
  answer: 2,
  feedback: "O Bubble Sort trabalha exclusivamente com pares de posições adjacentes, avançando pela lista uma comparação de vizinhos por vez."
},

// 71 - O que é memoização
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Explicativa",
  texto: "Memoização é uma técnica de otimização que guarda (cacheia) o resultado de chamadas de função já calculadas. Se a mesma entrada aparecer de novo, a função retorna o valor guardado em vez de recalcular tudo do zero, economizando tempo de processamento.",
  question: "O que exatamente a memoização evita que uma função recursiva faça?",
  options: [
    "Evita que a função use variáveis locais",
    "Evita que a função recalcule resultados para entradas que já foram calculadas antes",
    "Evita que a função seja chamada mais de uma vez no total",
    "Evita que a função retorne um valor numérico"
  ],
  answer: 1,
  feedback: "A ideia central da memoização é simples: se uma entrada já foi processada antes, não vale a pena repetir o trabalho — basta consultar o valor guardado."
},

// 72 - Fibonacci sem memoização é exponencial
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Explicativa",
  texto: "A versão recursiva simples do Fibonacci, sem memoização, recalcula os mesmos valores várias vezes — por exemplo, ao calcular fibonacci(5), o algoritmo acaba calculando fibonacci(3) duas vezes e fibonacci(2) três vezes. Isso faz com que sua complexidade seja O(2ⁿ), extremamente ineficiente para valores grandes de n.",
  question: "Por que o Fibonacci recursivo simples é considerado ineficiente para valores grandes de n?",
  options: [
    "Porque ele usa um laço for muito grande",
    "Porque ele recalcula repetidamente os mesmos valores, gerando uma árvore de chamadas que cresce exponencialmente",
    "Porque ele não usa recursão de verdade",
    "Porque ele armazena todos os valores em um dicionário desnecessário"
  ],
  answer: 1,
  feedback: "O desperdício de trabalho repetido é exatamente o que torna essa versão O(2ⁿ) — e é justamente esse problema que a memoização resolve."
},

// 73 - Como funciona o cache manual
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Explicativa",
  texto: "Na implementação manual de memoização com dicionário, antes de calcular um resultado a função verifica se aquele valor já está no cache. Se estiver, retorna direto o valor guardado; se não estiver, calcula normalmente e só então guarda o resultado no cache antes de retornar.",
  question: "Qual é o papel do dicionário (cache) na memoização manual do Fibonacci?",
  options: [
    "Guardar apenas o último valor calculado, substituindo o anterior a cada chamada",
    "Associar cada entrada n já calculada ao seu respectivo resultado, para consultas futuras",
    "Armazenar o código-fonte da função",
    "Contar quantas vezes a função foi chamada"
  ],
  answer: 1,
  feedback: "O cache funciona como uma tabela de \"entrada → resultado já calculado\", permitindo que chamadas repetidas com o mesmo n sejam resolvidas instantaneamente."
},

// 74 - lru_cache como alternativa pronta
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Contextualizada",
  texto: "Python oferece o decorador @lru_cache, do módulo functools, que adiciona memoização automática a uma função sem precisar criar um dicionário manualmente. Usando maxsize=None, o cache pode crescer sem limite, guardando todos os resultados já calculados durante a execução.",
  question: "Qual é a principal vantagem de usar @lru_cache em vez de implementar o cache manualmente com um dicionário?",
  options: [
    "@lru_cache torna a função mais lenta, mas mais legível",
    "@lru_cache adiciona o comportamento de cache automaticamente, sem precisar escrever a lógica de verificação e armazenamento na mão",
    "@lru_cache só funciona com números inteiros",
    "@lru_cache elimina a necessidade de casos base na função recursiva"
  ],
  answer: 1,
  feedback: "O decorador encapsula toda a lógica de cache (verificar, retornar do cache ou calcular e guardar) que, na versão manual, precisaria ser escrita explicitamente com um dicionário."
},

// 75 - Impacto na complexidade: trade-off tempo x espaço
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Contextualizada",
  texto: "Com memoização, o Fibonacci recursivo deixa de ser O(2ⁿ) e passa a ser O(n), já que cada valor de n só é calculado uma única vez — todas as chamadas repetidas passam a ser resolvidas em O(1), direto do cache. Esse ganho de tempo, porém, tem um custo: a memória extra usada para armazenar o cache.",
  question: "Ao aplicar memoização no Fibonacci recursivo, que tipo de troca (trade-off) está sendo feito?",
  options: [
    "Troca-se precisão pelo resultado, tornando os cálculos aproximados",
    "Troca-se tempo de processamento por memória extra: o algoritmo fica mais rápido, mas passa a consumir mais espaço",
    "Troca-se recursão por iteração, eliminando completamente as chamadas de função",
    "Troca-se legibilidade do código por desempenho, sem nenhum outro impacto"
  ],
  answer: 1,
  feedback: "Esse é o trade-off clássico da memoização: reduzir o tempo de execução (de exponencial para linear) ao custo de gastar memória extra guardando os resultados já calculados."
},

// 76 - Memoização não ajuda o fatorial
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Contextualizada",
  texto: "A memoização só traz ganho de desempenho quando a função é chamada repetidamente com os mesmos argumentos. No cálculo do fatorial(n), por exemplo, cada chamada recursiva usa um valor de n diferente e único dentro de uma mesma execução — não havendo nenhuma chamada repetida, não há nada para \"economizar\" com o cache.",
  question: "Por que aplicar memoização na função fatorial(n) não traz nenhum ganho de desempenho?",
  options: [
    "Porque o fatorial não é uma função recursiva",
    "Porque cada chamada recursiva do fatorial usa um valor de n diferente, então nunca há uma chamada repetida para ser evitada",
    "Porque o Python não permite usar dicionários dentro de funções recursivas",
    "Porque o fatorial já é mais rápido que o Fibonacci em qualquer caso"
  ],
  answer: 1,
  feedback: "Memoização só ajuda quando há chamadas redundantes com os mesmos argumentos, como no Fibonacci. No fatorial, como cada n aparece uma única vez, o cache fica praticamente vazio de repetições."
},

// 77 - Aplicação: Fibonacci de valores grandes
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Aplicação",
  texto: "Um sistema precisa calcular fibonacci(40) repetidas vezes ao longo da execução do programa, em diferentes momentos. Sem memoização, cada chamada recalcularia toda a árvore de subchamadas do zero, o que seria extremamente custoso.",
  question: "Nesse cenário, qual seria a melhor estratégia para tornar os cálculos de fibonacci(40) eficientes ao longo da execução do programa?",
  options: [
    "Reescrever o fatorial em vez do Fibonacci",
    "Aplicar memoização (manual ou com @lru_cache), já que os mesmos valores serão recalculados repetidamente",
    "Aumentar o valor de n para reduzir o número de chamadas",
    "Remover o caso base da função recursiva"
  ],
  answer: 1,
  feedback: "Como fibonacci(40) será chamado várias vezes e internamente recalcula os mesmos subvalores, esse é exatamente o tipo de cenário onde a memoização reduz drasticamente o tempo de execução."
},

// 78 - Aplicação: função sem argumentos repetidos
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Aplicação",
  texto: "Uma função recursiva percorre uma lista de tarefas processando cada item uma única vez, sempre com um índice diferente e crescente, sem nunca revisitar um índice já processado durante a mesma execução.",
  question: "Faz sentido aplicar memoização nessa função que percorre a lista de tarefas?",
  options: [
    "Sim, porque toda função recursiva se beneficia de memoização",
    "Não, porque como cada índice é processado uma única vez, não há chamadas repetidas para serem evitadas pelo cache",
    "Sim, mas apenas se a lista tiver mais de 1000 itens",
    "Não, porque memoização só funciona com números inteiros"
  ],
  answer: 1,
  feedback: "Assim como no fatorial, se não há repetição de argumentos dentro da mesma execução, o cache nunca é reaproveitado — logo, memoização não traz nenhum ganho real nesse caso."
},

// 79 - Aplicação: escolher lru_cache vs dicionário manual
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Aplicação",
  texto: "Um estudante está implementando memoização em uma função recursiva simples e quer uma solução rápida de escrever, sem se preocupar em criar e gerenciar manualmente um dicionário de cache dentro do código.",
  question: "Nesse cenário, qual abordagem seria mais prática para o estudante aplicar memoização rapidamente?",
  options: [
    "Criar manualmente um dicionário como parâmetro padrão da função",
    "Usar o decorador @lru_cache do módulo functools, que adiciona o cache automaticamente",
    "Reescrever a função inteira de forma iterativa",
    "Remover a recursão e usar apenas laços for"
  ],
  answer: 1,
  feedback: "O @lru_cache existe justamente para casos assim: ele entrega o comportamento de cache pronto, sem exigir que o programador escreva a lógica de verificação e armazenamento manualmente."
},

// 80 - Reforço: cache mutável como parâmetro padrão
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Explicativa",
  texto: "Na implementação manual de memoização, é comum usar um dicionário mutável como valor padrão de parâmetro (cache={}). Isso funciona porque esse dicionário é criado uma única vez e compartilhado entre todas as chamadas da função — um comportamento normalmente evitado em Python, mas que a memoização aproveita de propósito.",
  question: "Por que usar cache={} como parâmetro padrão funciona bem especificamente no contexto de memoização, mesmo sendo uma prática geralmente desencorajada em Python?",
  options: [
    "Porque em memoização os parâmetros padrão nunca são realmente usados",
    "Porque o comportamento de compartilhar o mesmo dicionário entre chamadas é justamente o que a memoização precisa para funcionar",
    "Porque dicionários mutáveis são sempre recriados a cada chamada em Python",
    "Porque isso impede que a função seja chamada mais de uma vez"
  ],
  answer: 1,
  feedback: "O \"efeito colateral\" de compartilhar o dicionário entre chamadas — normalmente uma armadilha em Python — é exatamente o mecanismo que permite ao cache persistir os resultados entre as chamadas recursivas."
}


  ],


  enade: [
    // ============================================================
// CAPÍTULO 1 — Listas, Dicionários e outras estruturas Python
// ============================================================

// 1 - Aliasing em listas
{
  aula: "Capítulo 1: Listas, Dicionários e outras estruturas Python",
  tipo: "Asserção + Justificativa",
  texto: "Um estagiário de desenvolvimento está implementando um sistema de cadastro de produtos para um pequeno comércio. Ele criou uma lista chamada estoque_original contendo os nomes dos produtos e, para gerar uma lista de \"produtos em promoção\", executou o comando promocao = estoque_original e depois adicionou itens a promocao usando append().",
  question: "Sobre o comportamento desse código em Python, considere as afirmações:",
  assertions: [
    "Ao final da execução, a lista estoque_original também terá sido alterada com os novos itens adicionados a promocao.",
    "PORQUE o comando promocao = estoque_original cria uma nova ==dml==cópia== independente da lista, de modo que ambas passam a coexistir na memória sem qualquer vínculo."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 2,
  feedback: "Quando fazemos promocao = estoque_original, não é criada uma cópia da lista; ambas as variáveis passam a apontar para o mesmo objeto na memória (==danger==aliasing==). Por isso, qualquer alteração via append() em uma delas reflete na outra. Para copiar de fato, seria necessário usar **.copy()** ou [:]."
},

// 2 - Escolha de estruturas de dados
{
  aula: "Capítulo 1: Listas, Dicionários e outras estruturas Python",
  tipo: "Múltiplas Afirmativas",
  texto: "Em uma reunião de planejamento de um sistema de gestão acadêmica, a equipe de desenvolvimento discute qual estrutura de dados do Python utilizar para armazenar diferentes tipos de informação: os CPFs únicos dos alunos matriculados, as notas de um boletim (que podem repetir), e os dados de um aluno específico organizados por campo (nome, idade, curso).",
  question: "Avalie as afirmativas sobre a escolha de estruturas de dados nesse cenário:",
  assertions: [
    "I. Para armazenar os CPFs únicos, evitando duplicidade automaticamente, o uso de um ==type==conjunto== é mais adequado do que uma lista.",
    "II. As notas de um boletim, por poderem se repetir e precisarem manter a ordem de lançamento, são melhor representadas por uma lista.",
    "III. Os dados de um aluno específico são mais bem representados por uma tupla, pois nunca deverão ser lidos, apenas descartados após o uso.",
    "IV. Um dicionário seria adequado para representar os dados de um aluno, pois permite associar cada informação a um nome de campo."
  ],
  options: [
    "I e III, apenas",
    "I, II e IV, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "Conjuntos evitam duplicados automaticamente, listas mantêm ordem e permitem repetição, e dicionários associam valores a chaves nomeadas. A afirmativa III está incorreta porque uma tupla pode e deve ser lida normalmente; sua característica central é a **imutabilidade**, não a impossibilidade de leitura."
},

// 3 - Tupla como retorno de função
{
  aula: "Capítulo 1: Listas, Dicionários e outras estruturas Python",
  tipo: "Conceitual Contextualizada",
  texto: "Um analista de dados está escrevendo uma função em Python que calcula, a partir de uma lista de vendas mensais, tanto o valor total vendido quanto a média de vendas do período. Ele precisa devolver os dois valores de uma só vez para quem chamar a função, e não quer que esses valores sejam acidentalmente alterados depois de calculados.",
  question: "Qual estrutura de dados é mais adequada para o analista utilizar como retorno dessa função, considerando as boas práticas apresentadas no conteúdo?",
  options: [
    "Uma lista, pois é mutável e permite alterar os valores depois, o que garante flexibilidade.",
    "Um dicionário, pois toda função que retorna mais de um valor deve necessariamente usar chaves nomeadas.",
    "Uma tupla, pois é uma estrutura ordenada, mais eficiente que a lista, e sua imutabilidade evita alterações acidentais nos valores já calculados.",
    "Um conjunto, pois remove automaticamente valores repetidos entre o total e a média."
  ],
  answer: 2,
  feedback: "É comum retornar múltiplos valores de uma função como **tupla**, já que ela é ordenada, ocupa menos memória que a lista, e sua imutabilidade impede que os valores calculados sejam alterados acidentalmente depois do retorno."
},

// 4 - Fatiamento (slice) de listas
{
  aula: "Capítulo 1: Listas, Dicionários e outras estruturas Python",
  tipo: "Análise Aplicada",
  texto: "Durante a correção de um relatório financeiro automatizado, um desenvolvedor encontrou o trecho de código a seguir, responsável por extrair lançamentos de uma lista de transações do dia.",
  question: "Analise o trecho de código e identifique o que a variável recentes conterá ao final da execução.",
  code: `transacoes = [150.0, 320.5, 89.9, 400.0, 75.25]
recentes = transacoes[1:3]
print(recentes)`,
  options: [
    "[150.0, 320.5, 89.9]",
    "[320.5, 89.9]",
    "[320.5, 89.9, 400.0]",
    "[150.0, 320.5]"
  ],
  answer: 1,
  feedback: "O fatiamento lista[i:j] pega os elementos do índice i até j-1, **sem incluir o índice j**. Por isso, transacoes[1:3] retorna os elementos dos índices 1 e 2 (320.5 e 89.9), sem incluir o índice 3."
},

// 5 - KeyError e o método .get()
{
  aula: "Capítulo 1: Listas, Dicionários e outras estruturas Python",
  tipo: "Análise Aplicada",
  texto: "Um sistema de RH consulta um dicionário contendo os dados de cada funcionário para exibir informações no painel administrativo. Em alguns cadastros mais antigos, o campo \"telefone\" não foi preenchido e, portanto, essa chave não existe no dicionário.",
  question: "Considerando o trecho de código abaixo, o que ocorre ao ser executado para um funcionário cujo dicionário não possui a chave \"telefone\"?",
  code: `funcionario = {"nome": "Carla", "cargo": "Analista"}
print(funcionario["telefone"])`,
  options: [
    "O programa imprime uma string vazia, pois dicionários preenchem automaticamente chaves ausentes.",
    "O programa ignora a linha e continua a execução normalmente, sem exibir nada.",
    "O programa imprime None, pois é o valor padrão do Python para chaves ausentes.",
    "O programa é interrompido com um erro do tipo KeyError, pois a chave \"telefone\" não existe no dicionário."
  ],
  answer: 3,
  feedback: "Acessar uma chave inexistente diretamente com dic[\"chave\"] gera um **KeyError**. Para evitar esse erro e obter um valor padrão (ou None) quando a chave não existe, o correto seria usar o método ==dml==.get()==, como em funcionario.get(\"telefone\", \"N/A\")."
},

// 6 - Conjuntos e hashabilidade
{
  aula: "Capítulo 1: Listas, Dicionários e outras estruturas Python",
  tipo: "Múltiplas Afirmativas",
  texto: "Um programador está desenvolvendo um módulo para remover automaticamente números de telefone duplicados de uma lista de contatos importada de uma planilha, e decidiu utilizar conjuntos (sets) do Python para essa finalidade.",
  question: "Sobre o uso de conjuntos nesse contexto, avalie as afirmativas:",
  assertions: [
    "I. Os conjuntos garantem que, ao converter a lista de telefones para um ==type==conjunto==, os valores repetidos sejam automaticamente eliminados.",
    "II. Seria possível armazenar, dentro desse mesmo conjunto, uma lista com múltiplos números de um mesmo contato, sem qualquer restrição do Python.",
    "III. Os elementos de um conjunto não podem ser acessados por índice numérico, como ocorre em uma lista.",
    "IV. Após a remoção dos duplicados, é garantido que a ordem original dos telefones na lista será mantida no conjunto resultante."
  ],
  options: [
    "I, II e IV, apenas",
    "II e IV, apenas",
    "I e III, apenas",
    "I, III e IV, apenas"
  ],
  answer: 2,
  feedback: "Conjuntos só aceitam elementos hashináveis (imutáveis), por isso não é possível inserir uma lista dentro de um set — isso gera erro. Além disso, sets **não possuem ordem garantida** e não permitem acesso por índice, diferente das listas."
},

// 7 - Ordem de inserção em dicionários
{
  aula: "Capítulo 1: Listas, Dicionários e outras estruturas Python",
  tipo: "Asserção + Justificativa",
  texto: "Em uma discussão técnica sobre versões do Python, um desenvolvedor afirma que dicionários no Python nunca mantêm qualquer relação de ordem entre seus elementos, sendo equivalentes, nesse aspecto, aos conjuntos.",
  question: "Considere as afirmações a seguir sobre essa discussão:",
  assertions: [
    "A afirmação do desenvolvedor está desatualizada, pois, a partir do Python 3.7, os dicionários mantêm a ordem de inserção dos seus itens.",
    "PORQUE, internamente, o Python passou a implementar dicionários usando uma estrutura que preserva a sequência de inserção dos pares ==key==chave-valor==, em vez de descartar essa informação como ocorria em versões anteriores."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "Desde o Python 3.7, dicionários **mantêm a ordem de inserção** dos pares chave-valor, graças a uma mudança na implementação interna da estrutura, que passou a preservar essa sequência em vez de descartá-la."
},

// 8 - Remoção de duplicados
{
  aula: "Capítulo 1: Listas, Dicionários e outras estruturas Python",
  tipo: "Conceitual Contextualizada",
  texto: "Uma equipe de marketing exportou uma lista de e-mails de clientes a partir de diferentes campanhas, e o arquivo final ficou com diversos e-mails repetidos. O time de dados precisa eliminar rapidamente essas repetições antes de enviar a lista para o setor de comunicação, sem se preocupar em manter a ordem original de exportação.",
  question: "Qual é a forma mais direta, entre as estruturas de dados estudadas, de resolver esse problema em Python?",
  options: [
    "Percorrer a lista manualmente com um laço for e comparar cada e-mail com todos os outros, um a um.",
    "Converter a lista de e-mails em uma tupla, já que tuplas não aceitam elementos repetidos.",
    "Converter a lista em um dicionário, usando os e-mails como chave e qualquer valor fixo como conteúdo, pois é a única estrutura sem repetição.",
    "Converter a lista de e-mails em um conjunto (com set()) e, se necessário, transformar o resultado de volta em lista."
  ],
  answer: 3,
  feedback: "A forma mais direta é converter a lista em um **conjunto**, já que ele elimina duplicados automaticamente (list(set(lista))). Tuplas, diferente do afirmado, aceitam elementos repetidos normalmente."
},

// 9 - Cópia real de listas
{
  aula: "Capítulo 1: Listas, Dicionários e outras estruturas Python",
  tipo: "Análise Aplicada",
  texto: "Para corrigir o problema de aliasing identificado anteriormente em um sistema de estoque, um outro desenvolvedor decidiu alterar a forma como a lista de promoção é criada a partir da lista original.",
  question: "Assinale a alternativa que corrige corretamente o problema, garantindo que alterações em promocao não afetem estoque_original.",
  code: `estoque_original = ["caneta", "caderno", "lapis"]
promocao = ???
promocao.append("borracha")`,
  options: [
    "promocao = estoque_original",
    "promocao = estoque_original.copy()",
    "promocao = estoque_original[0]",
    "promocao = estoque_original + estoque_original"
  ],
  answer: 1,
  feedback: "Usar **.copy()** (ou a notação equivalente [:]) cria uma cópia independente da lista, de modo que alterações em promocao não afetam estoque_original. A alternativa A mantém o problema de aliasing, pois apenas cria uma segunda referência para o mesmo objeto."
},

// 10 - Tabela comparativa de estruturas
{
  aula: "Capítulo 1: Listas, Dicionários e outras estruturas Python",
  tipo: "Múltiplas Afirmativas",
  texto: "Um professor de Estrutura de Dados apresentou aos alunos uma tabela comparativa entre listas, tuplas, dicionários e conjuntos, e pediu que eles avaliassem algumas afirmações sobre as características dessas estruturas em Python.",
  question: "Avalie as afirmativas a seguir:",
  assertions: [
    "I. Listas e tuplas são estruturas ordenadas, ou seja, seus elementos possuem uma posição fixa que pode ser acessada por índice.",
    "II. Apenas listas e dicionários são estruturas mutáveis; tuplas e conjuntos jamais permitem qualquer tipo de modificação após a criação.",
    "III. Dicionários organizam seus dados por meio de chaves, que não podem se repetir, embora os valores associados a elas possam se repetir livremente.",
    "IV. Conjuntos permitem elementos repetidos internamente, mas o Python os exibe apenas uma vez ao imprimir a estrutura."
  ],
  options: [
    "I e III, apenas",
    "I, II e III, apenas",
    "I, III e IV, apenas",
    "II e IV, apenas"
  ],
  answer: 0,
  feedback: "Conjuntos, apesar de exigirem elementos hashináveis, são estruturas **mutáveis** (permitem .add() e .remove()), o que torna II incorreta. Além disso, duplicados em um conjunto não ficam \"escondidos\" internamente — eles simplesmente não existem na estrutura, tornando IV falsa também."
},

// ============================================================
// CAPÍTULO 2 — Funções em Python
// ============================================================

// 1 - print vs return
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Análise Aplicada",
  texto: "Um estudante de programação, ao revisar o código de uma calculadora simples que desenvolveu para um trabalho da faculdade, notou um comportamento inesperado ao tentar utilizar o resultado de uma função em outro cálculo.",
  question: "Considere a função abaixo e o trecho de código que a utiliza. Qual será o valor impresso na última linha?",
  code: `def calcular_total(preco, quantidade):
    print(preco * quantidade)

total = calcular_total(10, 3)
print(total)`,
  options: [
    "30, pois é o resultado da multiplicação exibido corretamente.",
    "None, pois a função apenas exibe o valor na tela com print, mas não o devolve com return.",
    "Um erro de execução, pois a função não pode ser usada como se retornasse algo.",
    "30, seguido de um novo cálculo automático feito pelo Python."
  ],
  answer: 1,
  feedback: "A função calcular_total apenas usa print, sem return, por isso ela devolve **None** por padrão. A linha print(total) exibirá None, mesmo que a multiplicação já tenha sido exibida na tela durante a chamada da função."
},

// 2 - Escopo e a palavra-chave global
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Asserção + Justificativa",
  texto: "Em um sistema de controle de estoque escrito em Python, um desenvolvedor definiu uma variável global chamada quantidade_total para armazenar o total de itens, e criou uma função para incrementar esse valor sempre que um novo item é cadastrado.",
  question: "Considere as afirmações a seguir sobre esse cenário:",
  assertions: [
    "Se, dentro da função, o desenvolvedor escrever apenas quantidade_total = quantidade_total + 1, sem usar a palavra-chave global, o valor da variável global não será alterado como esperado.",
    "PORQUE, sem a palavra-chave ==key==global==, o Python interpreta essa atribuição como a criação de uma nova variável local dentro da função, distinta da variável global de mesmo nome."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "Ao atribuir um valor a uma variável dentro de uma função sem declarar global, o Python cria uma **variável local** com o mesmo nome, deixando a variável global intocada — inclusive gerando erro se a variável local for lida antes de receber valor."
},

// 3 - *args para quantidade variável de argumentos
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Conceitual Contextualizada",
  texto: "Uma desenvolvedora está criando uma função em Python para calcular a soma de notas de avaliação de alunos, mas o número de avaliações realizadas varia de aluno para aluno: alguns fizeram 3 provas, outros fizeram 5. Ela quer uma única função capaz de aceitar qualquer quantidade de notas como argumento.",
  question: "Qual recurso da linguagem Python é mais adequado para essa desenvolvedora utilizar na definição da função?",
  options: [
    "A criação de uma função separada para cada quantidade possível de notas.",
    "Um parâmetro comum com valor padrão, como def somar(nota=0).",
    "O uso de **kwargs, pois qualquer conjunto de valores numéricos deve obrigatoriamente ser recebido como argumento nomeado.",
    "O uso de *args, que permite receber uma quantidade variável de argumentos posicionais, reunidos automaticamente em uma tupla."
  ],
  answer: 3,
  feedback: "O ==dml==*args== permite que a função receba uma quantidade variável de argumentos posicionais, reunidos automaticamente em uma tupla dentro da função. O **kwargs seria usado se os argumentos fossem passados de forma nomeada (chave=valor), o que não é o caso descrito."
},

// 4 - Argumentos nomeados e posicionais
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Múltiplas Afirmativas",
  texto: "Um programador está revisando o código de uma função utilizada em um sistema de cadastro de pacientes, que recebe nome e idade como parâmetros, e testando diferentes formas de chamá-la.",
  question: "Considerando a função def cadastrar(nome, idade): ..., avalie as afirmativas sobre as formas de chamada:",
  assertions: [
    "I. A chamada cadastrar(\"Ana\", 30) é válida e passa os argumentos por posição, na ordem em que os parâmetros foram definidos.",
    "II. A chamada cadastrar(idade=30, nome=\"Ana\") é válida, pois argumentos nomeados podem ser passados em qualquer ordem.",
    "III. A chamada cadastrar(nome=\"Ana\", 30) é válida, pois o Python sempre processa primeiro os argumentos nomeados e depois os posicionais.",
    "IV. A chamada cadastrar(\"Ana\", idade=30) é válida, pois mistura um argumento posicional com um nomeado, desde que o posicional venha primeiro."
  ],
  options: [
    "I e III, apenas",
    "I, II e IV, apenas",
    "I, II, III e IV",
    "II e III, apenas"
  ],
  answer: 1,
  feedback: "É possível misturar argumentos posicionais e nomeados, **desde que os posicionais venham antes** dos nomeados. A chamada da afirmativa III é inválida, pois tenta colocar um argumento posicional (30) depois de um nomeado, gerando erro de sintaxe."
},

// 5 - Parâmetros com valor padrão
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Análise Aplicada",
  texto: "Uma função de um sistema de e-commerce calcula o frete de um pedido, aplicando um desconto padrão de 10% quando nenhum valor de desconto é informado explicitamente pelo vendedor.",
  question: "Dado o código abaixo, qual será a saída ao executá-lo?",
  code: `def calcular_frete(valor, desconto=0.10):
    return valor - (valor * desconto)

print(calcular_frete(100))
print(calcular_frete(100, 0.20))`,
  options: [
    "100 e 100, pois o desconto nunca é aplicado sem ser informado explicitamente.",
    "90.0 e 80.0, aplicando o desconto padrão na primeira chamada e o desconto informado na segunda.",
    "Erro de execução, pois a primeira chamada não informa todos os argumentos obrigatórios.",
    "90.0 e 90.0, pois o valor padrão do parâmetro sempre prevalece, mesmo quando outro valor é passado."
  ],
  answer: 1,
  feedback: "Quando um parâmetro tem **valor padrão**, ele só é utilizado se nenhum argumento correspondente for passado na chamada. Na primeira chamada o desconto padrão de 10% é aplicado; na segunda, o valor 0.20 informado substitui o padrão."
},

// 6 - Código morto após return
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Análise Aplicada",
  texto: "Um desenvolvedor júnior escreveu uma função para validar a idade de um usuário em um formulário de cadastro, mas um colega revisor notou que uma parte do código nunca seria executada.",
  question: "Analise o trecho de código abaixo e identifique o problema apontado pelo revisor.",
  code: `def validar_idade(idade):
    if idade < 18:
        return "menor de idade"
        print("Cadastro rejeitado")
    return "maior de idade"

resultado = validar_idade(15)`,
  options: [
    "A função contém um erro de sintaxe e não executa.",
    "A variável resultado receberá o valor None, pois a função não possui return válido.",
    "O código funciona normalmente e imprime \"Cadastro rejeitado\" antes de retornar o resultado.",
    "O print(\"Cadastro rejeitado\") nunca será executado, pois vem depois do return dentro do mesmo bloco, e o return encerra a função imediatamente."
  ],
  answer: 3,
  feedback: "Assim que uma instrução **return** é executada, a função é encerrada imediatamente, e qualquer código escrito depois dela, dentro do mesmo bloco, se torna código morto — nunca é executado."
},

// 7 - **kwargs para argumentos nomeados variáveis
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Asserção + Justificativa",
  texto: "Em um módulo de geração de relatórios, uma função foi definida para aceitar informações adicionais e opcionais sobre um funcionário, como cargo, departamento e data de contratação, sem que o número exato dessas informações seja conhecido de antemão.",
  question: "Considere as afirmações a seguir sobre o uso de **kwargs nesse contexto:",
  assertions: [
    "O uso de **kwargs como parâmetro é adequado para essa função, pois permite receber uma quantidade variável de argumentos nomeados.",
    "PORQUE, dentro da função, os argumentos recebidos via **kwargs ficam disponíveis organizados automaticamente em uma ==type==tupla==, na ordem em que foram passados."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 2,
  feedback: "O **kwargs é adequado para receber uma quantidade variável de argumentos nomeados, mas eles ficam disponíveis dentro da função como um **dicionário**, e não como uma tupla — essa organização em tupla é característica do *args."
},

// 8 - Escopo local de variáveis
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Conceitual Contextualizada",
  texto: "Um programador está depurando um sistema em que uma variável chamada saldo é definida dentro de uma função de cálculo bancário, mas, ao tentar acessar essa mesma variável fora da função, para exibi-la em um relatório, o programa gera um erro informando que o nome saldo não está definido.",
  question: "Qual é a explicação mais adequada, entre as apresentadas, para esse comportamento?",
  options: [
    "A variável saldo é local à função, existindo apenas durante a execução dela; fora da função, ela simplesmente não existe.",
    "O Python apaga automaticamente todas as variáveis do programa ao final de cada execução, independentemente de onde foram criadas.",
    "A variável só pode ser acessada fora da função se o nome da função for exatamente igual ao nome da variável.",
    "O erro ocorre porque toda variável criada dentro de uma função deve obrigatoriamente ser declarada global antes de ser usada, mesmo internamente."
  ],
  answer: 0,
  feedback: "Uma variável criada dentro de uma função tem **escopo local**: só existe durante a execução da função e não pode ser acessada fora dela, a menos que seu valor seja devolvido com return ou declarada como global."
},

// 9 - Revisão geral sobre funções
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Múltiplas Afirmativas",
  texto: "Antes de uma avaliação, um grupo de estudantes revisa os principais conceitos sobre funções em Python discutidos em aula, elaborando uma lista de afirmações para verificar seu entendimento.",
  question: "Avalie as afirmativas a seguir sobre funções em Python:",
  assertions: [
    "I. Uma função que não possui nenhuma instrução return devolve automaticamente o valor None quando chamada.",
    "II. Parâmetro e argumento são termos equivalentes: parâmetro é o nome usado na definição da função, e argumento é o valor real passado na chamada.",
    "III. Assim que uma função encontra sua primeira instrução return, ela é interrompida imediatamente, ignorando qualquer código restante dentro do mesmo bloco.",
    "IV. Uma função só pode chamar outras funções previamente definidas; jamais é possível uma função chamar a si mesma."
  ],
  options: [
    "I, II e III, apenas",
    "II e IV, apenas",
    "I e III, apenas",
    "I, III e IV, apenas"
  ],
  answer: 2,
  feedback: "A afirmativa II está incorreta: embora relacionados, parâmetro e argumento não são termos **equivalentes** — um é o nome definido na função, o outro é o valor concreto passado na chamada. A afirmativa IV também é falsa, pois uma função pode chamar a si mesma (recursão)."
},

// 10 - Funções chamando outras funções
{
  aula: "Capítulo 2: Funções em Python",
  tipo: "Análise Aplicada",
  texto: "Em um módulo de processamento de pedidos, duas funções foram criadas: uma que dobra um valor numérico e outra que aplica essa duplicação duas vezes seguidas, reaproveitando a primeira função.",
  question: "Considerando o código abaixo, qual será a saída impressa?",
  code: `def dobro(n):
    return n * 2

def quadruplo(n):
    return dobro(dobro(n))

print(quadruplo(5))`,
  options: [
    "10, pois apenas uma chamada a dobro é realmente executada.",
    "20, pois o valor 5 é multiplicado por 2 duas vezes seguidas (5 → 10 → 20).",
    "25, pois o Python eleva o valor ao quadrado ao chamar a função quadruplo.",
    "Um erro de execução, pois uma função não pode chamar outra função dentro do seu corpo."
  ],
  answer: 1,
  feedback: "A função quadruplo chama dobro duas vezes: primeiro dobro(5) resulta em 10, e depois dobro(10) resulta em 20. Uma função pode perfeitamente **chamar outra função** dentro de seu corpo, reaproveitando lógica já implementada."
},

// ============================================================
// CAPÍTULO 3 — Recursão
// ============================================================

// 1 - Rastreamento de fatorial
{
  aula: "Capítulo 3: Recursão",
  tipo: "Análise Aplicada",
  texto: "Em uma aula prática de lógica de programação, um professor pediu aos alunos que rastreassem manualmente a execução de uma função recursiva de fatorial para um valor pequeno, a fim de entender o mecanismo de \"descida e subida\" das chamadas.",
  question: "Considerando a função abaixo, qual é o valor retornado pela chamada fatorial(3), e quantas chamadas recursivas (incluindo a chamada inicial) são realizadas até o caso base ser atingido?",
  code: `def fatorial(n):
    if n == 0:
        return 1
    else:
        return n * fatorial(n - 1)`,
  options: [
    "Retorna 3, com um total de 3 chamadas até o caso base.",
    "Retorna 9, com um total de 4 chamadas até o caso base.",
    "Retorna 6, com um total de 4 chamadas até o caso base.",
    "Retorna 6, com um total de 3 chamadas até o caso base."
  ],
  answer: 2,
  feedback: "A execução gera as chamadas fatorial(3) → fatorial(2) → fatorial(1) → fatorial(0), totalizando **4 chamadas** até o caso base (n==0) ser atingido. Na subida, o resultado é calculado como 1×1×2×3 = 6."
},

// 2 - Caso base ausente
{
  aula: "Capítulo 3: Recursão",
  tipo: "Asserção + Justificativa",
  texto: "Um estudante implementou uma função recursiva para calcular a soma dos números de 1 até n, mas esqueceu de incluir uma condição de parada para quando n chega a zero.",
  question: "Considere as afirmações a seguir sobre esse código:",
  assertions: [
    "Ao ser executada, essa função entrará em um erro do tipo RecursionError, indicando que a profundidade máxima de recursão foi excedida.",
    "PORQUE toda função recursiva sem um ==key==caso base== bem definido continuará chamando a si mesma indefinidamente, até que a pilha de chamadas do programa se esgote."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "Sem um caso base, a função recursiva nunca \"sabe\" quando parar, continuando a chamar a si mesma indefinidamente. Isso esgota a pilha de chamadas do programa, resultando no erro **RecursionError**."
},

// 3 - Recursão vs iteração para grandes volumes
{
  aula: "Capítulo 3: Recursão",
  tipo: "Conceitual Contextualizada",
  texto: "Um desenvolvedor precisa implementar uma função que soma todos os números de 1 até um valor n muito grande (por exemplo, n = 100.000) em um sistema que processa grandes volumes de dados repetidamente, com forte restrição de uso de memória.",
  question: "Considerando as características de recursão e iteração discutidas no conteúdo, qual seria a abordagem mais recomendada para esse cenário específico?",
  options: [
    "Utilizar uma função recursiva, pois toda recursão é automaticamente mais eficiente em memória do que um laço.",
    "Utilizar uma função iterativa com um laço for ou while, pois ela usa menos memória e evita o risco de estourar a pilha de chamadas para valores grandes de n.",
    "Utilizar recursão, pois esse tipo de problema (soma sequencial) é impossível de ser resolvido com laços comuns.",
    "Utilizar recursão obrigatoriamente, pois a linguagem Python não permite laços para operações matemáticas repetitivas."
  ],
  answer: 1,
  feedback: "Para valores grandes de n, a abordagem **iterativa** é mais recomendada, pois usa menos memória (apenas uma variável acumuladora) e não corre o risco de RecursionError por excesso de chamadas empilhadas, diferente da versão recursiva."
},

// 4 - Elementos obrigatórios da recursão
{
  aula: "Capítulo 3: Recursão",
  tipo: "Múltiplas Afirmativas",
  texto: "Em uma prova de estrutura de dados, os alunos foram convidados a avaliar afirmações sobre os componentes obrigatórios de uma função recursiva, tomando como referência a função de Fibonacci recursiva simples.",
  question: "Avalie as afirmativas a seguir:",
  assertions: [
    "I. A função de Fibonacci recursiva simples possui dois casos base, o que é perfeitamente válido em uma função recursiva.",
    "II. Cada chamada da função de Fibonacci recursiva simples realiza duas novas chamadas recursivas, o que faz sua complexidade crescer exponencialmente.",
    "III. Se o argumento passado a uma chamada recursiva estiver se afastando do valor do caso base em vez de se aproximar, a recursão eventualmente terminará, apenas de forma mais lenta.",
    "IV. Uma função recursiva pode ser convertida em uma versão iterativa equivalente, embora a legibilidade das duas versões possa ser diferente para certos tipos de problema."
  ],
  options: [
    "I e III, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV",
    "I, II e IV, apenas"
  ],
  answer: 3,
  feedback: "A afirmativa III está incorreta: se o argumento se afasta do caso base em vez de se aproximar, a recursão **nunca termina** naturalmente, levando a um RecursionError, e não apenas a uma execução mais lenta."
},

// 5 - Recursão sobre listas e caso base
{
  aula: "Capítulo 3: Recursão",
  tipo: "Análise Aplicada",
  texto: "Um programador implementou uma função recursiva para somar todos os elementos de uma lista de valores de vendas, reduzindo o problema a cada chamada.",
  question: "Dado o código abaixo, o que aconteceria se a lista de entrada fosse vazia, isto é, soma_lista([])?",
  code: `def soma_lista(lista):
    if len(lista) == 0:
        return 0
    return lista[0] + soma_lista(lista[1:])`,
  options: [
    "O programa gera um erro do tipo IndexError, pois lista[0] não existe em uma lista vazia.",
    "A função entra em recursão infinita, pois lista[1:] de uma lista vazia gera uma nova lista vazia repetidamente.",
    "A função retorna None, pois nenhuma instrução return é executada para esse caso.",
    "A função retorna 0 imediatamente, pois o caso base foi definido justamente para tratar o cenário de lista vazia."
  ],
  answer: 3,
  feedback: "O caso base if len(lista) == 0: return 0 trata exatamente essa situação: quando a lista está vazia, a função **retorna imediatamente** 0, sem realizar nenhuma chamada recursiva adicional."
},

// 6 - Esquecer o return na chamada recursiva
{
  aula: "Capítulo 3: Recursão",
  tipo: "Análise Aplicada",
  texto: "Um estudante reescreveu a função de fatorial durante uma prova, mas cometeu um deslize sutil ao omitir uma palavra-chave em uma das linhas.",
  question: "Analise o código abaixo e identifique o resultado da chamada fatorial_sem_return(3).",
  code: `def fatorial_sem_return(n):
    if n == 0:
        return 1
    n * fatorial_sem_return(n - 1)

print(fatorial_sem_return(3))`,
  options: [
    "6, pois o Python calcula o valor mesmo sem o return explícito.",
    "Um erro de execução, pois toda função recursiva precisa obrigatoriamente de return em todas as suas linhas.",
    "None, pois a chamada recursiva n * fatorial_sem_return(n - 1) calcula um valor, mas ele é descartado por não haver return nessa linha.",
    "1, pois apenas o caso base é considerado no resultado final."
  ],
  answer: 2,
  feedback: "Sem a palavra-chave **return** na chamada recursiva, o valor calculado é simplesmente descartado, e a função devolve None por padrão — o resultado do cálculo se perde, mesmo que as multiplicações tenham ocorrido internamente."
},

// 7 - Complexidade exponencial do Fibonacci recursivo
{
  aula: "Capítulo 3: Recursão",
  tipo: "Asserção + Justificativa",
  texto: "Em uma discussão sobre desempenho de algoritmos, um programador defende a substituição de uma função recursiva de Fibonacci simples por uma versão iterativa em um sistema que precisa calcular valores para índices relativamente altos (n > 35).",
  question: "Considere as afirmações a seguir:",
  assertions: [
    "A substituição proposta é uma boa prática de desempenho, pois a versão recursiva simples de Fibonacci apresenta complexidade exponencial.",
    "PORQUE cada chamada da função recursiva simples de Fibonacci gera duas novas chamadas recursivas, formando uma ==dml==árvore de chamadas== que cresce exponencialmente conforme n aumenta."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "A versão recursiva simples de Fibonacci tem complexidade **O(2ⁿ)**, pois cada chamada gera duas novas chamadas, sem reaproveitar cálculos já feitos, o que justifica a preferência por uma versão iterativa em cenários de n relativamente alto."
},

// 8 - Relação entre pilha de execução e recursão
{
  aula: "Capítulo 3: Recursão",
  tipo: "Conceitual Contextualizada",
  texto: "Um estudante está tentando entender por que, ao chamar uma função recursiva muito profunda (por exemplo, calcular fatorial(100000)), o Python interrompe a execução com um erro, mesmo que a lógica da função esteja matematicamente correta.",
  question: "Qual é a explicação mais adequada para esse comportamento, considerando a relação entre recursão e a pilha de execução?",
  options: [
    "O erro ocorre porque o Python não permite valores de entrada maiores que 1000 em nenhuma função.",
    "Cada chamada recursiva pendente fica armazenada na pilha de execução do programa; quando há chamadas demais sem atingir o caso base, essa pilha se esgota, gerando o erro.",
    "O erro ocorre porque a função fatorial não pode ser usada para números maiores que 100.",
    "O Python converte automaticamente a recursão em iteração, então o erro só pode ser causado por um problema na lógica da função."
  ],
  answer: 1,
  feedback: "Cada chamada recursiva **pendente** fica armazenada na pilha de execução do programa. Quando a profundidade de chamadas é grande demais, essa pilha se esgota, gerando o RecursionError — o mesmo mecanismo relacionado à estrutura de pilha do capítulo seguinte."
},

// 9 - Direção do caso base
{
  aula: "Capítulo 3: Recursão",
  tipo: "Múltiplas Afirmativas",
  texto: "Durante a correção de exercícios, um professor apresentou duas versões de uma função de contagem regressiva e pediu que os alunos avaliassem o comportamento de cada uma.",
  question: "Considere as duas funções abaixo e avalie as afirmativas:",
  code: `def contagem_certa(n):
    if n <= 0:
        print("Fim!")
        return
    print(n)
    contagem_certa(n - 1)

def contagem_errada(n):
    if n == 0:
        return
    print(n)
    contagem_errada(n + 1)`,
  assertions: [
    "I. A função contagem_certa(3) termina normalmente, imprimindo 3, 2, 1 e \"Fim!\".",
    "II. A função contagem_errada(1) nunca atinge seu caso base, pois o argumento se afasta cada vez mais do valor de parada.",
    "III. Ambas as funções possuem exatamente o mesmo comportamento, apenas com nomes de variáveis diferentes.",
    "IV. A função contagem_errada eventualmente causará um RecursionError, mesmo que demore algumas chamadas para isso ocorrer."
  ],
  options: [
    "I III e IV, apenas",
    "II III e IV, apenas",
    "I, II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 2,
  feedback: "Em contagem_errada, o argumento n cresce (n + 1) em vez de se aproximar de 0, então o caso base nunca é alcançado, o que eventualmente provoca um **RecursionError**. Isso torna a afirmativa III falsa, já que as funções têm comportamentos opostos."
},

// 10 - Recursão vs iteração equivalentes
{
  aula: "Capítulo 3: Recursão",
  tipo: "Análise Aplicada",
  texto: "Um professor apresentou duas implementações diferentes para calcular a soma dos números de 1 até n, uma recursiva e outra iterativa, e pediu aos alunos que analisassem as diferenças estruturais entre elas.",
  question: "Considerando as duas funções abaixo, avalie a alternativa correta sobre suas diferenças.",
  code: `def soma_recursiva(n):
    if n == 0:
        return 0
    return n + soma_recursiva(n - 1)

def soma_iterativa(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total`,
  options: [
    "As duas funções produzem resultados diferentes para o mesmo valor de n, pois seguem lógicas matemáticas distintas.",
    "Ambas produzem o mesmo resultado, mas soma_recursiva cria n chamadas de função empilhadas na memória, enquanto soma_iterativa usa apenas uma variável sendo atualizada em um laço.",
    "A versão iterativa é sempre mais lenta, pois depende de um laço, enquanto a recursiva executa instantaneamente sem custo de memória.",
    "Apenas a versão recursiva pode ser usada para valores grandes de n, pois a iterativa tem um limite fixo de repetições."
  ],
  answer: 1,
  feedback: "Ambas chegam ao mesmo resultado, mas por caminhos diferentes: a versão recursiva empilha uma chamada de função para cada valor de n, consumindo mais memória, enquanto a iterativa apenas atualiza uma **variável acumuladora** dentro de um laço."
},

// ============================================================
// CAPÍTULO 4 — Classes e Objetos em Python
// ============================================================

// 1 - Classe vs dicionário
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Conceitual Contextualizada",
  texto: "Um desenvolvedor está decidindo como representar os dados de um produto (nome, preço e quantidade em estoque) em um sistema de controle de inventário. Ele considera usar apenas dicionários para cada produto, mas um colega sugere criar uma classe Produto, já que, além dos dados, também será necessário calcular o valor total em estoque e verificar se o produto está com estoque baixo.",
  question: "Qual é a principal vantagem de usar uma classe em vez de um dicionário nesse cenário, segundo os conceitos de programação orientada a objetos?",
  options: [
    "Uma classe é sempre mais rápida de acessar do que um dicionário, independentemente do que armazena.",
    "Dicionários não podem armazenar números, apenas texto, o que inviabiliza seu uso para dados de estoque.",
    "Uma classe elimina completamente a necessidade de armazenar dados, pois tudo é calculado automaticamente.",
    "Uma classe permite associar, no mesmo objeto, tanto os dados (atributos) quanto os comportamentos (métodos), como calcular valor total ou verificar estoque baixo, algo que um dicionário simples não faz por si só."
  ],
  answer: 3,
  feedback: "A principal vantagem das classes é permitir que **atributos e métodos** convivam no mesmo objeto: além de armazenar os dados, a classe também pode definir comportamentos, algo que um dicionário puro não oferece nativamente."
},

// 2 - O parâmetro self
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Análise Aplicada",
  texto: "Um estudante criou uma classe para representar clientes de um sistema bancário, mas ao testar o método que exibe o saldo, recebeu um erro inesperado.",
  question: "Analise o código abaixo e identifique a causa do erro ao executar cliente.exibir_saldo().",
  code: `class Cliente:
    def __init__(self, nome, saldo):
        self.nome = nome
        self.saldo = saldo

    def exibir_saldo():
        print(f"Saldo: {self.saldo}")

cliente = Cliente("Marcos", 500)
cliente.exibir_saldo()`,
  options: [
    "Não há erro; o código imprime corretamente o saldo do cliente.",
    "O erro ocorre porque o atributo saldo foi definido como número, e não como texto.",
    "O erro ocorre porque o método exibir_saldo não possui o parâmetro self, que é passado automaticamente pelo Python ao chamar o método a partir de um objeto.",
    "O erro ocorre porque a classe Cliente não possui o método __str__ definido."
  ],
  answer: 2,
  feedback: "Todo método de uma classe precisa receber o próprio objeto como primeiro parâmetro, convencionalmente chamado de **self**, pois o Python o passa automaticamente ao chamar cliente.exibir_saldo(). Sem esse parâmetro, ocorre um TypeError."
},

// 3 - Atributo de classe vs instância
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Asserção + Justificativa",
  texto: "Em uma classe Funcionario usada em um sistema de recursos humanos, foi definido um atributo empresa = \"TechCorp\" diretamente no corpo da classe (fora do __init__), compartilhado como o nome da empresa para todos os funcionários, além dos atributos individuais nome e salario definidos dentro do __init__.",
  question: "Considere as afirmações a seguir sobre esse cenário:",
  assertions: [
    "Se o valor do atributo empresa for alterado através da própria classe (Funcionario.empresa = \"NovaTech\"), essa mudança será refletida em todos os objetos já criados que não tenham sobrescrito esse atributo individualmente.",
    "PORQUE o atributo empresa é um ==key==atributo de classe==, compartilhado por todos os objetos, enquanto nome e salario são atributos de instância, individuais de cada objeto."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "Atributos de **classe** (definidos fora do __init__) são compartilhados por todos os objetos daquela classe. Já os atributos de instância, como nome e salario, são individuais e não são afetados por alterações no atributo de classe."
},

// 4 - Independência de objetos
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Múltiplas Afirmativas",
  texto: "Um professor apresentou a classe Contador, com um atributo valor inicializado em zero no construtor e um método para incrementá-lo, e criou dois objetos distintos a partir dela para demonstrar um conceito importante de orientação a objetos.",
  question: "Considerando o código abaixo, avalie as afirmativas:",
  code: `class Contador:
    def __init__(self):
        self.valor = 0

    def incrementar(self):
        self.valor += 1

c1 = Contador()
c2 = Contador()
c1.incrementar()
c1.incrementar()
c2.incrementar()`,
  assertions: [
    "I. Ao final da execução, c1.valor será igual a 2 e c2.valor será igual a 1.",
    "II. Como c1 e c2 vêm da mesma classe, alterar c1.valor obrigatoriamente altera c2.valor para o mesmo número.",
    "III. Cada objeto instanciado a partir de Contador possui seu próprio atributo valor, independente dos demais objetos.",
    "IV. Se um terceiro objeto c3 fosse criado com c3 = Contador(), seu atributo valor começaria em 0, sem qualquer relação com os valores já acumulados em c1 ou c2."
  ],
  options: [
    "I e II, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV",
    "I, III e IV, apenas"
  ],
  answer: 3,
  feedback: "Cada objeto instanciado possui seus próprios **atributos de instância**, totalmente independentes dos demais — por isso c1.valor e c2.valor evoluem separadamente, e um novo objeto c3 sempre começaria do zero definido no __init__."
},

// 5 - Método especial __str__
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Análise Aplicada",
  texto: "Um desenvolvedor está exibindo informações de pedidos de um sistema de e-commerce e notou que, ao imprimir um objeto Pedido diretamente, a saída no console não é legível para o usuário final, mostrando algo como <__main__.Pedido object at 0x7f...>.",
  question: "Qual modificação na classe Pedido resolveria esse problema, exibindo uma descrição legível ao usar print(pedido)?",
  options: [
    "Adicionar um método chamado imprimir() e chamá-lo manualmente em vez de usar print().",
    "Definir o método especial __str__ na classe, retornando uma string formatada com as informações relevantes do pedido.",
    "Transformar todos os atributos da classe em atributos de classe, em vez de atributos de instância.",
    "Remover o construtor __init__ da classe, pois ele é o responsável por esse comportamento padrão."
  ],
  answer: 1,
  feedback: "O método especial **__str__** permite definir como um objeto deve ser convertido em texto ao ser exibido com print() ou str(). Sem ele, o Python usa uma representação padrão pouco legível, mostrando o endereço de memória do objeto."
},

// 6 - Instanciação sem parênteses
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Conceitual Contextualizada",
  texto: "Durante a revisão de um código de um sistema de biblioteca, um desenvolvedor júnior escreveu livro = Livro (sem os parênteses) na tentativa de criar um novo objeto a partir da classe Livro, e ficou confuso ao notar que o comportamento não era o esperado.",
  question: "O que efetivamente ocorre ao executar livro = Livro, sem os parênteses, em vez de livro = Livro()?",
  options: [
    "A variável livro passa a referenciar a própria classe Livro, e não uma instância dela; o construtor __init__ não é executado.",
    "Um erro de sintaxe interrompe a execução do programa imediatamente.",
    "O Python gera automaticamente um objeto com todos os atributos preenchidos com None.",
    "Um novo objeto é criado normalmente, pois os parênteses são opcionais na criação de objetos em Python."
  ],
  answer: 0,
  feedback: "Sem os parênteses, livro = Livro não cria uma instância: a variável passa a **referenciar a própria classe**, e o construtor __init__ não é chamado. Para criar de fato um objeto, é necessário usar Livro() com os parênteses."
},

// 7 - Métodos com validação de saldo
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Análise Aplicada",
  texto: "Um sistema bancário simplificado utiliza a classe ContaBancaria abaixo para representar as contas dos clientes.",
  question: "Considerando o código a seguir, o que será impresso ao final da execução?",
  code: `class ContaBancaria:
    def __init__(self, titular, saldo=0):
        self.titular = titular
        self.saldo = saldo

    def depositar(self, valor):
        self.saldo += valor

    def sacar(self, valor):
        if valor > self.saldo:
            print("Saldo insuficiente!")
        else:
            self.saldo -= valor

conta = ContaBancaria("Júlia", 200)
conta.depositar(100)
conta.sacar(500)
print(conta.saldo)`,
  options: [
    "300, pois o saque de 500 é realizado normalmente, mesmo excedendo o saldo.",
    "-200, pois o Python permite saldo negativo automaticamente em qualquer operação de saque.",
    "Um erro de execução interrompe o programa antes de chegar ao print final.",
    "\"Saldo insuficiente!\" é impresso, e o saldo final permanece 300, pois o saque não é realizado quando o valor solicitado excede o saldo disponível."
  ],
  answer: 3,
  feedback: "Como o valor do saque (500) é maior que o saldo disponível (300, após o depósito), o método sacar imprime \"Saldo insuficiente!\" e **não realiza a subtração**, mantendo o saldo em 300."
},

// 8 - O construtor __init__
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Múltiplas Afirmativas",
  texto: "Em uma revisão sobre o construtor de classes em Python, os alunos discutiram diferentes afirmações sobre o método __init__.",
  question: "Avalie as afirmativas a seguir sobre o método __init__:",
  assertions: [
    "I. O __init__ é chamado automaticamente pelo Python toda vez que um novo objeto é criado a partir da classe.",
    "II. É permitido usar return valor dentro do __init__ para devolver explicitamente o objeto recém-criado a quem o instanciou.",
    "III. O __init__ é comumente utilizado para inicializar os atributos de instância de um objeto logo em sua criação.",
    "IV. Uma classe pode ter apenas atributos definidos no __init__; qualquer atributo definido fora dele deixa de existir para os objetos."
  ],
  options: [
    "I e III, apenas",
    "I, II e III, apenas",
    "II e IV, apenas",
    "I, III e IV, apenas"
  ],
  answer: 0,
  feedback: "Dentro do __init__, não é permitido usar return valor — apenas return sem valor é aceito, pois o método apenas **inicializa** o objeto já criado pelo Python. Atributos de classe, definidos fora do __init__, continuam existindo e acessíveis normalmente, o que torna IV falsa."
},

// 9 - Método booleano aprovado()
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Análise Aplicada",
  texto: "Um sistema acadêmico utiliza a classe Aluno abaixo para verificar automaticamente se um estudante foi aprovado em uma disciplina, com base em sua nota final.",
  question: "Considerando o código a seguir, qual será o resultado impresso?",
  code: `class Aluno:
    def __init__(self, nome, nota):
        self.nome = nome
        self.nota = nota

    def aprovado(self):
        return self.nota >= 6

a1 = Aluno("Pedro", 5.5)
a2 = Aluno("Marina", 7.0)
print(a1.aprovado(), a2.aprovado())`,
  options: [
    "True True",
    "False True",
    "False False",
    "True False"
  ],
  answer: 1,
  feedback: "O método aprovado() retorna o resultado da comparação self.nota >= 6. Para Pedro (nota 5.5), a comparação é falsa; para Marina (nota 7.0), é verdadeira. Assim, a saída é **False True**."
},

// 10 - Individualidade de atributos de instância
{
  aula: "Capítulo 4: Classes e Objetos em Python",
  tipo: "Conceitual Contextualizada",
  texto: "Um sistema de cadastro de veículos usa uma classe Carro, na qual cada objeto representa um veículo diferente, com atributos como cor e velocidade_atual definidos dentro do __init__. Um usuário do sistema pergunta se, ao criar dois objetos Carro e alterar a velocidade de um deles, o outro também seria afetado.",
  question: "Com base no funcionamento de atributos de instância em Python, qual é a resposta correta a essa pergunta?",
  options: [
    "Sim, pois todos os objetos de uma mesma classe compartilham obrigatoriamente os mesmos valores de atributos.",
    "Depende de o atributo velocidade_atual ter sido declarado antes ou depois do atributo cor no construtor.",
    "Não, pois cada objeto criado a partir da classe Carro possui seus próprios atributos de instância, armazenados de forma independente para cada objeto.",
    "Sim, mas apenas se os dois objetos forem criados na mesma linha de código."
  ],
  answer: 2,
  feedback: "Atributos de instância são armazenados **individualmente** para cada objeto. Alterar a velocidade de um carro específico não afeta o atributo de outro objeto distinto da mesma classe, mesmo que ambos venham do mesmo \"molde\"."
},

// ============================================================
// CAPÍTULO 5 — Análise de Complexidade e Eficiência de Algoritmos
// ============================================================

// 1 - Laço simples O(n)
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Análise Aplicada",
  texto: "Um desenvolvedor precisa avaliar a complexidade de uma função que calcula a soma de todos os valores de uma lista de transações financeiras, antes de decidir se ela pode ser usada em um sistema que processa milhões de registros.",
  question: "Qual é a complexidade, em notação Big O, da função abaixo?",
  code: `def somar_transacoes(lista):
    total = 0
    for valor in lista:
        total += valor
    return total`,
  options: [
    "O(1), pois a soma é uma operação matemática simples.",
    "O(n²), pois há uma operação de soma dentro de um laço.",
    "O(log n), pois o valor de total muda a cada iteração.",
    "O(n), pois o laço percorre cada elemento da lista exatamente uma vez, proporcional ao tamanho da entrada."
  ],
  answer: 3,
  feedback: "O laço percorre cada elemento da lista **uma única vez**, realizando uma operação simples (O(1)) em cada iteração, resultando em uma complexidade total de O(n), proporcional ao tamanho da entrada."
},

// 2 - Laço aninhado independente de n
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Asserção + Justificativa",
  texto: "Um analista está avaliando a complexidade de um trecho de código que processa uma lista de pedidos, mas contém um laço aninhado em que o laço interno sempre executa exatamente 4 vezes, independentemente do tamanho da lista.",
  question: "Considere as afirmações a seguir sobre esse trecho de código:",
  assertions: [
    "A complexidade final desse trecho de código é O(n), e não O(n²), mesmo havendo dois laços aninhados na estrutura.",
    "PORQUE todo laço aninhado, independentemente de suas características, deve obrigatoriamente ser classificado como ==type==O(n²)=="
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 2,
  feedback: "Nem todo laço aninhado é O(n²): quando o laço interno **não depende do tamanho de n** (nesse caso, sempre roda 4 vezes), a complexidade é O(n × 4), que simplifica para O(n), pois constantes multiplicativas são descartadas."
},

// 3 - Estruturas de dados e busca eficiente
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Conceitual Contextualizada",
  texto: "Uma equipe de desenvolvimento está otimizando um sistema de verificação de CPFs cadastrados, que atualmente realiza a busca de cada CPF informado dentro de uma lista com milhões de registros usando o operador in. O sistema está apresentando lentidão perceptível conforme a base de dados cresce.",
  question: "Considerando os conceitos de complexidade estudados, qual seria a alteração mais indicada para melhorar significativamente o desempenho dessa verificação?",
  options: [
    "Manter a lista, mas ordenar seus elementos, o que automaticamente torna qualquer busca O(1).",
    "Substituir a lista por uma tupla, pois tuplas são sempre mais rápidas que listas para qualquer tipo de busca.",
    "Substituir a lista por um dicionário ou conjunto, já que a operação in tem complexidade O(1) em média nessas estruturas, contra O(n) em uma lista.",
    "Substituir o operador in por um laço for manual, pois isso reduz a complexidade da busca para O(log n)."
  ],
  answer: 2,
  feedback: "A operação x in lista tem complexidade **O(n)**. Já x in dicionario ou x in conjunto tem complexidade O(1) em média, graças à forma como essas estruturas são organizadas internamente — uma pegadinha clássica sobre desempenho entre estruturas."
},

// 4 - Regras gerais de Big O
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Múltiplas Afirmativas",
  texto: "Em uma prova de estrutura de dados, os alunos avaliaram um conjunto de afirmações sobre as regras gerais de análise de complexidade (notação Big O) apresentadas em aula.",
  question: "Avalie as afirmativas a seguir:",
  assertions: [
    "I. Dois laços sequenciais (um depois do outro), cada um percorrendo n elementos, resultam em uma complexidade que se soma, e não se multiplica, simplificando para O(n).",
    "II. A notação Big O tradicionalmente representa o melhor caso possível de execução de um algoritmo, e não o pior caso.",
    "III. Uma chamada de função dentro de um laço deve ter sua complexidade multiplicada pela quantidade de vezes que o laço é executado.",
    "IV. Um bloco if/else, quando não contém laços internos, é geralmente classificado como O(1)."
  ],
  options: [
    "I, II e III, apenas",
    "I, III e IV, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "A notação Big O representa tradicionalmente o **pior caso** de execução de um algoritmo, e não o melhor caso, o que torna a afirmativa II incorreta. As demais seguem corretamente as regras de soma, multiplicação e complexidade constante."
},

// 5 - Busca binária O(log n)
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Análise Aplicada",
  texto: "Um sistema de biblioteca digital implementou uma função para localizar um livro específico em um catálogo já ordenado alfabeticamente, dividindo repetidamente a área de busca pela metade a cada tentativa.",
  question: "Qual é a complexidade dessa função de busca, considerando a estratégia descrita?",
  code: `def busca_binaria(lista, alvo):
    inicio, fim = 0, len(lista) - 1
    while inicio <= fim:
        meio = (inicio + fim) // 2
        if lista[meio] == alvo:
            return meio
        elif lista[meio] < alvo:
            inicio = meio + 1
        else:
            fim = meio - 1
    return -1`,
  options: [
    "O(n), pois o laço while sempre percorre todos os elementos da lista antes de encontrar o valor.",
    "O(log n), pois, a cada repetição do laço, a área de busca é cortada pela metade, reduzindo drasticamente o número de comparações necessárias.",
    "O(n²), pois há uma divisão dentro de um laço, o que caracteriza um comportamento quadrático.",
    "O(1), pois a função sempre encontra o valor em uma única operação, independentemente do tamanho da lista."
  ],
  answer: 1,
  feedback: "A cada repetição do laço while, a área de busca é **cortada pela metade**, caracterizando uma complexidade logarítmica, O(log n) — muito mais eficiente que uma busca linear (O(n)) para listas grandes."
},

// 6 - Complexidade de diferentes recursões
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Conceitual Contextualizada",
  texto: "Um professor pediu que os alunos avaliassem a complexidade de três funções recursivas diferentes apresentadas em aula: uma que realiza uma chamada recursiva por nível reduzindo o problema em 1 (como o fatorial), outra que divide o problema pela metade a cada chamada (como uma busca binária recursiva), e uma terceira que realiza duas chamadas recursivas a cada nível, sem reaproveitar cálculos (como o Fibonacci recursivo simples).",
  question: "Qual alternativa associa corretamente cada tipo de função recursiva descrita à sua complexidade correspondente, na ordem apresentada (fatorial, busca binária recursiva, Fibonacci recursivo)?",
  options: [
    "O(log n), O(n), O(2ⁿ)",
    "O(n), O(log n), O(2ⁿ)",
    "O(2ⁿ), O(n), O(log n)",
    "O(n), O(2ⁿ), O(log n)"
  ],
  answer: 1,
  feedback: "Uma chamada recursiva por nível resulta em **O(n)** (fatorial); dividir o problema pela metade a cada chamada resulta em O(log n) (busca binária recursiva); duas chamadas por nível sem reaproveitamento resulta em O(2ⁿ) (Fibonacci recursivo simples)."
},

// 7 - Operação in dentro de um laço
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Análise Aplicada",
  texto: "Um desenvolvedor implementou uma função para verificar quantos itens de uma lista de pedidos também aparecem em uma segunda lista de itens em promoção, e um colega revisor apontou que, apesar de não haver um laço \"visivelmente duplo\" no código, a complexidade real é maior do que parece.",
  question: "Qual é a complexidade real da função abaixo, e por quê?",
  code: `def contem_todos(lista1, lista2):
    contador = 0
    for item in lista1:
        if item in lista2:
            contador += 1
    return contador`,
  options: [
    "O(n), pois existe apenas um laço for explícito no código.",
    "O(log n), pois o operador in realiza uma busca eficiente internamente, semelhante a uma busca binária.",
    "O(1), pois a operação in é sempre considerada de tempo constante em Python, independentemente da estrutura usada.",
    "O(n²), pois o laço for percorre lista1 (O(n)) e, para cada item, a operação in em lista2 também é O(n), multiplicando as duas complexidades."
  ],
  answer: 3,
  feedback: "Embora exista apenas um laço for explícito, a operação item in lista2 também é O(n), pois lista2 é uma lista comum. Assim, temos O(n) × O(n), resultando em **O(n²)** — uma pegadinha comum sobre desempenho."
},

// 8 - Comparação entre complexidades
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Múltiplas Afirmativas",
  texto: "Antes de uma prova, um grupo de estudantes organizou um resumo comparando diferentes complexidades de algoritmos, com base na ordem de eficiência apresentada em aula: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ).",
  question: "Avalie as afirmativas a seguir, considerando essa ordem de eficiência:",
  assertions: [
    "I. Um algoritmo O(n log n), como os utilizados em algoritmos de ordenação eficientes, é sempre mais eficiente do que um algoritmo O(n²), para valores suficientemente grandes de n.",
    "II. A notação O(2n + 3) deve ser simplificada para O(n), descartando constantes multiplicativas e termos aditivos que não dominam o crescimento.",
    "III. Um algoritmo O(n³), com três laços aninhados dependentes de n, é sempre mais eficiente do que um algoritmo O(n²), pois processa mais operações por execução.",
    "IV. Ao somar complexidades de trechos diferentes de um mesmo algoritmo, como O(n²) seguido de O(n), o termo dominante prevalece, simplificando o resultado para O(n²)."
  ],
  options: [
    "I III e IV, apenas",
    "I, II e IV, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "Um algoritmo O(n³) realiza **mais operações**, e não menos, do que um O(n²) conforme n cresce, tornando-o menos eficiente, e não mais — o que torna III incorreta. As demais seguem corretamente as regras de simplificação e comparação."
},

// 9 - Matriz quadrada O(n²)
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Asserção + Justificativa",
  texto: "Um programador está analisando uma função que percorre todos os elementos de uma matriz quadrada (com o mesmo número de linhas e colunas) para calcular a soma total de seus valores, utilizando dois laços for aninhados, um para as linhas e outro para as colunas.",
  question: "Considere as afirmações a seguir sobre essa função:",
  assertions: [
    "A complexidade dessa função é O(n²), considerando n como a dimensão da matriz quadrada.",
    "PORQUE o laço externo percorre n linhas e, para cada linha, o laço interno percorre novamente n colunas, ==dml==multiplicando== as duas execuções."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "Como a matriz é quadrada, o laço externo executa n vezes e, para cada execução, o laço interno também executa n vezes, resultando em n × n = **O(n²)** operações no total."
},

// 10 - Laço com passo dobrando (O(log n))
{
  aula: "Capítulo 5: Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Análise Aplicada",
  texto: "Um desenvolvedor está analisando uma função que processa lotes de dados, dobrando o índice de controle a cada iteração do laço, em vez de incrementá-lo em 1.",
  question: "Qual é a complexidade da função abaixo, considerando n como o valor do parâmetro de entrada?",
  code: `def processar(n):
    i = 1
    while i < n:
        print(i)
        i = i * 2`,
  options: [
    "O(log n), pois, como i dobra a cada iteração, o número de repetições necessárias para superar n cresce de forma muito mais lenta que n.",
    "O(n), pois o laço while sempre depende diretamente do valor de n para determinar quantas vezes será executado.",
    "O(n²), pois a multiplicação dentro do laço caracteriza um comportamento quadrático.",
    "O(1), pois a variável i muda de valor apenas uma vez por iteração, sem relação com o tamanho de n."
  ],
  answer: 0,
  feedback: "Como i dobra a cada iteração em vez de aumentar em passos de 1, o número de iterações necessárias para que i ultrapasse n é aproximadamente log₂(n), caracterizando uma complexidade **O(log n)**."
},

// ============================================================
// CAPÍTULO 6 — Pilhas e Filas
// ============================================================

// 1 - Escolha entre pilha e fila
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Conceitual Contextualizada",
  texto: "Uma equipe de desenvolvimento está implementando duas funcionalidades distintas em um sistema: um editor de texto que precisa oferecer a opção de desfazer a última ação realizada pelo usuário (Ctrl+Z), e um sistema de atendimento de suporte técnico, no qual os chamados devem ser resolvidos exatamente na ordem em que chegaram.",
  question: "Considerando as características de pilhas (LIFO) e filas (FIFO), qual estrutura é mais adequada para cada uma dessas funcionalidades, respectivamente?",
  options: [
    "Fila para o \"desfazer\" e pilha para o atendimento de chamados.",
    "Pilha para ambas as funcionalidades, pois qualquer sistema sequencial deve utilizar a lógica LIFO.",
    "Fila para ambas as funcionalidades, já que ambas envolvem uma sequência de eventos ao longo do tempo.",
    "Pilha para o \"desfazer\" e fila para o atendimento de chamados, pois a última ação deve ser desfeita primeiro, enquanto os chamados devem ser atendidos na ordem de chegada."
  ],
  answer: 3,
  feedback: "O \"desfazer\" segue a lógica **LIFO** (a última ação feita deve ser a primeira desfeita), característica de uma pilha. Já o atendimento de chamados segue a lógica FIFO, característica de uma fila."
},

// 2 - Rastreamento de pilha com lista
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Análise Aplicada",
  texto: "Um sistema de histórico de navegação de um aplicativo utiliza uma lista Python para simular uma pilha de páginas visitadas, adicionando e removendo elementos sempre pelo mesmo lado da estrutura.",
  question: "Considerando o código abaixo, qual será a saída impressa ao final?",
  code: `historico = []
historico.append("Inicio")
historico.append("Produtos")
historico.append("Carrinho")
print(historico.pop())
print(historico.pop())
print(historico)`,
  options: [
    "\"Inicio\", \"Produtos\" e [\"Carrinho\"]",
    "\"Carrinho\", \"Inicio\" e [\"Produtos\"]",
    "\"Carrinho\", \"Produtos\" e [\"Inicio\"]",
    "\"Inicio\", \"Carrinho\" e [\"Produtos\"]"
  ],
  answer: 2,
  feedback: "Como pop() sem argumento remove o **último elemento inserido** (comportamento LIFO), a primeira chamada remove \"Carrinho\", a segunda remove \"Produtos\", restando apenas [\"Inicio\"] na lista."
},

// 3 - Eficiência de fila implementada com lista
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Asserção + Justificativa",
  texto: "Um desenvolvedor implementou uma fila de atendimento utilizando uma lista Python comum, removendo sempre o primeiro elemento com o método pop(0) sempre que um cliente é atendido.",
  question: "Considere as afirmações a seguir sobre essa implementação:",
  assertions: [
    "Essa implementação de fila apresenta um problema de eficiência quando o volume de atendimentos é muito grande.",
    "PORQUE o método ==dml==pop(0)== em uma lista Python é uma operação O(n), pois obriga o deslocamento de todos os demais elementos uma posição para trás."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "O método pop(0) tem complexidade **O(n)**, pois remove o primeiro elemento e obriga todos os demais a serem deslocados. Para filas com grande volume de operações, isso torna a implementação ineficiente, sendo recomendado collections.deque com popleft() (O(1))."
},

// 4 - Comparação entre pilha e fila
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Múltiplas Afirmativas",
  texto: "Em uma revisão de conceitos sobre estruturas de dados lineares, os alunos avaliaram um conjunto de afirmações sobre as diferenças entre pilhas e filas.",
  question: "Avalie as afirmativas a seguir:",
  assertions: [
    "I. Em uma pilha, tanto a inserção (push) quanto a remoção (pop) ocorrem pelo mesmo lado da estrutura, geralmente chamado de topo.",
    "II. Em uma fila, a inserção (enqueue) ocorre no final, enquanto a remoção (dequeue) ocorre no início da estrutura.",
    "III. A estrutura collections.deque do Python é recomendada para implementar pilhas, mas nunca deve ser utilizada para implementar filas.",
    "IV. A pilha de chamadas de funções, usada internamente pelo mecanismo de recursão, segue a mesma lógica de funcionamento de uma pilha (LIFO)."
  ],
  options: [
    "I III e IV, apenas",
    "I, II e IV, apenas",
    "II III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "A estrutura collections.deque é eficiente tanto para pilhas quanto para **filas**, já que permite inserção e remoção O(1) em ambas as extremidades — por isso a afirmativa III está incorreta, pois é justamente a solução recomendada para filas implementadas com listas comuns."
},

// 5 - Verificação de parênteses balanceados
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Análise Aplicada",
  texto: "Um editor de código-fonte utiliza um algoritmo baseado em pilha para verificar automaticamente se os parênteses de uma expressão digitada pelo programador estão corretamente balanceados, destacando erros de sintaxe em tempo real.",
  question: "Considerando a função abaixo, qual será o resultado retornado para a expressão \"(a+b*(c-d)\"?",
  code: `def parenteses_balanceados(expressao):
    pilha = []
    for caractere in expressao:
        if caractere == "(":
            pilha.append(caractere)
        elif caractere == ")":
            if len(pilha) == 0:
                return False
            pilha.pop()
    return len(pilha) == 0`,
  options: [
    "True, pois a expressão contém parênteses de abertura e fechamento em quantidade suficiente.",
    "Um erro de execução, pois a expressão contém caracteres não numéricos.",
    "True, pois a função só verifica a quantidade de parênteses de abertura, ignorando o fechamento.",
    "False, pois ao final da expressão ainda resta um parêntese de abertura não fechado na pilha."
  ],
  answer: 3,
  feedback: "A expressão possui dois parênteses de abertura e apenas um de fechamento. Ao final do laço, a pilha ainda contém um elemento pendente, então len(pilha) == 0 é **falso**, e a função retorna False."
},

// 6 - Por que o topo da pilha é o final da lista
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Conceitual Contextualizada",
  texto: "Um desenvolvedor está implementando uma pilha em Python usando uma lista e precisa decidir se o \"topo\" da pilha será representado pelo início ou pelo final da lista, considerando o desempenho da aplicação.",
  question: "Qual é a justificativa correta, apresentada no conteúdo, para se optar por representar o topo da pilha como o final da lista, e não o início?",
  options: [
    "Porque os métodos append() e pop() (sem argumento), usados no final da lista, são operações O(1), enquanto insert(0, x) e pop(0), usados no início, são operações O(n).",
    "Porque listas em Python só permitem adicionar elementos no final, nunca no início, em qualquer circunstância.",
    "Porque o Python não permite o uso do índice 0 para armazenar dados em nenhuma estrutura de dados.",
    "Porque representar o topo no início da lista tornaria o código sintaticamente inválido."
  ],
  answer: 0,
  feedback: "Os métodos append() e pop() no **final da lista** são operações O(1), pois não exigem deslocamento de elementos. Já insert(0, x) e pop(0), usados no início, são O(n) — por isso o final da lista é a escolha eficiente para representar o topo de uma pilha."
},

// 7 - Fila implementada com deque
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Análise Aplicada",
  texto: "Um sistema de atendimento de call center foi reimplementado utilizando a estrutura collections.deque, em substituição a uma lista comum, para representar a fila de clientes aguardando atendimento.",
  question: "Considerando o código abaixo, qual será a saída impressa?",
  code: `from collections import deque

fila = deque()
fila.append("Cliente A")
fila.append("Cliente B")
fila.append("Cliente C")
print(fila.popleft())
print(fila.popleft())
print(fila)`,
  options: [
    "\"Cliente C\", \"Cliente B\" e deque(['Cliente A'])",
    "\"Cliente A\", \"Cliente B\" e deque(['Cliente C'])",
    "\"Cliente A\", \"Cliente C\" e deque(['Cliente B'])",
    "\"Cliente C\", \"Cliente A\" e deque(['Cliente B'])"
  ],
  answer: 1,
  feedback: "O método popleft() remove sempre o **primeiro elemento inserido** (comportamento FIFO). Por isso, a primeira chamada remove \"Cliente A\", a segunda remove \"Cliente B\", restando apenas \"Cliente C\" na fila."
},

// 8 - Relação entre recursão e pilha
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Asserção + Justificativa",
  texto: "Um professor afirma, em sala de aula, que o mecanismo interno responsável pelo funcionamento da recursão em uma linguagem de programação está diretamente relacionado ao conceito de pilha estudado no capítulo sobre estruturas lineares.",
  question: "Considere as afirmações a seguir sobre essa relação:",
  assertions: [
    "A afirmação do professor está correta: o comportamento de \"descida e subida\" das chamadas recursivas segue exatamente a lógica LIFO de uma pilha.",
    "PORQUE cada chamada recursiva pendente é empilhada na memória do computador, e as chamadas são resolvidas na ordem inversa em que foram feitas, à medida que o ==key==caso base== é atingido."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "Quando uma função recursiva chama a si mesma, cada chamada pendente fica **empilhada** na memória, aguardando o resultado da próxima. Ao atingir o caso base, essas chamadas são resolvidas na ordem inversa, exatamente como o comportamento LIFO de uma pilha."
},

// 9 - Aplicações reais de pilhas e filas
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma equipe de arquitetura de software está decidindo, para diferentes funcionalidades de um sistema, se deve utilizar uma estrutura de pilha ou de fila, e revisou algumas afirmações sobre aplicações reais dessas estruturas antes de decidir.",
  question: "Avalie as afirmativas a seguir sobre aplicações reais de pilhas e filas:",
  assertions: [
    "I. O histórico de navegação de um navegador, que permite \"voltar\" para a página anterior, funciona de forma semelhante a uma pilha.",
    "II. Um algoritmo de busca em largura (BFS) em grafos utiliza tipicamente uma fila para controlar a ordem de visita dos elementos.",
    "III. Uma fila de impressão de documentos deve processar o último documento enviado antes de qualquer outro, seguindo a lógica LIFO.",
    "IV. A pilha de chamadas de funções na memória do computador é um exemplo de aplicação real do comportamento LIFO."
  ],
  options: [
    "I III e IV, apenas",
    "II III e IV, apenas",
    "I II III, apenas",
    "I, II e IV, apenas"
  ],
  answer: 3,
  feedback: "Uma fila de impressão segue a lógica **FIFO**, processando primeiro o documento enviado primeiro, e não o último — o que torna III incorreta. As demais aplicações estão corretamente associadas às suas respectivas estruturas."
},

// 10 - Inversão de lista com pilha
{
  aula: "Capítulo 6: Pilhas e Filas",
  tipo: "Análise Aplicada",
  texto: "Um desenvolvedor precisa implementar uma função que inverta a ordem dos elementos de uma lista, e decidiu utilizar o comportamento natural de uma pilha para resolver esse problema, em vez de usar o método reverse() já existente em Python.",
  question: "Considerando a função abaixo, explique por que ela consegue inverter corretamente a ordem dos elementos da lista original.",
  code: `def inverter_com_pilha(lista):
    pilha = []
    for item in lista:
        pilha.append(item)
    invertida = []
    while pilha:
        invertida.append(pilha.pop())
    return invertida`,
  options: [
    "Porque o método pop() remove elementos aleatoriamente, o que coincidentemente inverte a lista nesse caso específico.",
    "Porque, ao empilhar todos os itens e depois desempilhá-los, o último elemento inserido na pilha é o primeiro a ser removido (LIFO), fazendo com que a nova lista fique na ordem inversa da original.",
    "Porque a função ordena a lista numericamente antes de invertê-la.",
    "Porque o laço while pilha: sempre executa exatamente uma vez, adicionando todos os elementos de uma só vez à lista invertida."
  ],
  answer: 1,
  feedback: "Ao empilhar todos os elementos e depois desempilhá-los, o comportamento **LIFO** da pilha faz com que o último elemento inserido seja o primeiro a ser removido, o que naturalmente gera a lista na ordem inversa da original."
},

// 61 - Escolha de algoritmo por cenário (Conceitual Contextualizada)
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Conceitual Contextualizada",
  texto: "Uma pequena loja virtual mantém uma lista de preços de produtos que é atualizada diariamente. Na maioria dos dias, apenas dois ou três produtos mudam de posição em relação ao dia anterior, permanecendo o restante da lista praticamente na mesma ordem.",
  question: "Considerando as características dos algoritmos de ordenação estudados, qual deles tende a apresentar o melhor desempenho nesse cenário específico?",
  options: [
    "Bubble Sort, pois sempre realiza o mesmo número fixo de passagens, independentemente da ordem",
    "Selection Sort, pois localiza o menor elemento em tempo constante",
    "Insertion Sort, pois se aproxima do seu melhor caso O(n) quando a lista já está quase ordenada",
    "Merge Sort, pois sua complexidade O(n log n) é sempre a mais baixa entre os quatro, em qualquer situação"
  ],
  answer: 2,
  feedback: "O **melhor caso O(n) do Insertion Sort** ocorre justamente quando poucos elementos estão fora de posição, exigindo poucos deslocamentos — cenário raro para Bubble e Selection Sort, que sempre percorrem a lista inteira."
},

// 62 - Trade-offs entre os quatro algoritmos (Múltiplas Afirmativas)
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma equipe de desenvolvimento está avaliando qual algoritmo de ordenação utilizar em diferentes módulos de um sistema, considerando fatores como previsibilidade de desempenho, consumo de memória e comportamento em listas quase ordenadas.",
  question: "Analise as afirmativas a seguir sobre os algoritmos de ordenação estudados:",
  assertions: [
    "I. O Merge Sort garante complexidade O(n log n) tanto no melhor quanto no pior caso, mas exige memória extra para as listas temporárias da mesclagem.",
    "II. O Selection Sort realiza, no máximo, uma troca por passagem, o que reduz o número total de trocas em comparação ao Bubble Sort.",
    "III. O Bubble Sort é capaz de comparar elementos que não estão em posições adjacentes, o que acelera sua convergência.",
    "IV. O Insertion Sort apresenta pior caso O(n²), semelhante ao Bubble e ao Selection Sort."
  ],
  options: [
    "I, II e III, apenas",
    "I, II e IV, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "A afirmativa III está incorreta: o **Bubble Sort compara exclusivamente elementos vizinhos**, nunca posições distantes. As demais afirmativas refletem corretamente as características dos algoritmos."
},

// 63 - Comportamento do Selection Sort (Asserção + Justificativa)
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Asserção + Justificativa",
  texto: "Um professor de Estrutura de Dados propôs aos alunos que comparassem o número de comparações realizadas pelo Selection Sort em uma lista já ordenada e em uma lista completamente desordenada, ambas de mesmo tamanho.",
  question: "Avalie as afirmações a seguir e a relação proposta entre elas.",
  assertions: [
    "I. O Selection Sort realiza exatamente o mesmo número de comparações, independentemente de a lista já estar ordenada ou não.",
    "PORQUE",
    "II. Em cada passagem, o algoritmo sempre percorre toda a parte não ordenada restante em busca do menor elemento, mesmo que ela já esteja em ordem."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "Diferentemente do Insertion Sort, o **Selection Sort não possui melhor caso mais rápido**: ele sempre varre toda a parte não ordenada para encontrar o menor elemento, o que explica seu número constante de comparações."
},

// 64 - Ordenação de grande volume de dados (Análise Aplicada)
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Análise Aplicada",
  texto: "Uma empresa de análise de dados processa diariamente um arquivo com mais de um milhão de registros financeiros que chegam em ordem completamente aleatória. A equipe de engenharia precisa garantir que o tempo de ordenação seja previsível, mesmo no cenário mais desfavorável possível.",
  question: "Considerando a exigência de desempenho previsível no pior caso para um grande volume de dados desordenados, qual dos algoritmos estudados seria a escolha mais adequada?",
  options: [
    "Insertion Sort, pois seu melhor caso O(n) garante velocidade em qualquer situação",
    "Bubble Sort, por ser o algoritmo mais simples de implementar e depurar",
    "Selection Sort, pois realiza poucas trocas em relação ao número de comparações",
    "Merge Sort, pois mantém complexidade O(n log n) tanto no melhor quanto no pior caso"
  ],
  answer: 3,
  feedback: "Como os dados chegam totalmente desordenados, o **melhor caso do Insertion Sort não se aplica**, e apenas o Merge Sort garante desempenho previsível (O(n log n)) independentemente da ordem inicial dos dados."
},

// 65 - Diferença estrutural entre Bubble e Merge Sort (Conceitual Contextualizada)
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Conceitual Contextualizada",
  texto: "Durante uma aula prática, um estudante afirmou que todos os algoritmos de ordenação funcionam basicamente do mesmo jeito: percorrendo a lista repetidamente e comparando elementos vizinhos até que ela fique ordenada.",
  question: "Assinale a alternativa que aponta corretamente por que essa afirmação está incorreta em relação ao Merge Sort.",
  options: [
    "Porque o Merge Sort não realiza nenhuma comparação entre elementos durante sua execução",
    "Porque o Merge Sort primeiro divide a lista repetidamente ao meio, e só depois compara elementos durante a fase de mesclagem",
    "Porque o Merge Sort compara apenas o primeiro e o último elemento da lista original",
    "Porque o Merge Sort é implementado exclusivamente de forma iterativa, sem recursão"
  ],
  answer: 1,
  feedback: "O **Merge Sort segue a estratégia de dividir para conquistar**: primeiro fragmenta a lista em partes menores, e só na etapa de mesclagem é que as comparações efetivamente ocorrem — diferente de Bubble, Selection e Insertion, que comparam desde o início."
},

// 66 - Características gerais dos algoritmos (Múltiplas Afirmativas)
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Múltiplas Afirmativas",
  texto: "Em uma prova de Estrutura de Dados, os alunos precisam identificar corretamente as características de cada algoritmo de ordenação estudado, sem confundir seus comportamentos.",
  question: "Analise as afirmativas a seguir sobre os algoritmos de ordenação estudados:",
  assertions: [
    "I. O Insertion Sort é o único, entre os quatro estudados, cujo melhor caso é O(n).",
    "II. O Bubble Sort pode realizar mais de uma troca dentro de uma mesma passagem pela lista.",
    "III. O Merge Sort não consome memória adicional além da lista original.",
    "IV. O Selection Sort divide a lista mentalmente em uma parte ordenada e uma não ordenada."
  ],
  options: [
    "I e II, apenas",
    "I, II e IV, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "A afirmativa III está incorreta: o **Merge Sort precisa de listas temporárias durante a mesclagem**, consumindo memória extra — justamente uma de suas principais desvantagens frente aos outros três algoritmos."
},

// 67 - Merge Sort não é sempre a melhor escolha (Asserção + Justificativa)
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Asserção + Justificativa",
  texto: "Um desenvolvedor, ao estudar complexidade de algoritmos, concluiu que deveria sempre utilizar o Merge Sort em seus projetos, independentemente do contexto de aplicação.",
  question: "Avalie as afirmações a seguir e a relação proposta entre elas.",
  assertions: [
    "I. O Merge Sort é sempre a melhor escolha de algoritmo de ordenação, em qualquer cenário de desenvolvimento.",
    "PORQUE",
    "II. Ele garante complexidade O(n log n) tanto no melhor quanto no pior caso, superando a complexidade de Bubble, Selection e Insertion Sort no pior caso."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 3,
  feedback: "A afirmativa I é falsa: em sistemas com **memória muito restrita**, o consumo extra do Merge Sort pode torná-lo inadequado, mesmo sendo verdade (II) que sua complexidade é mais estável que a dos demais."
},

// 68 - Restrição de memória em sistema embarcado (Análise Aplicada)
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Análise Aplicada",
  texto: "Um sistema embarcado de baixo custo, utilizado para coletar e ordenar pequenas listas de leituras de sensores (geralmente com menos de 20 valores), possui memória RAM extremamente limitada, insuficiente para alocar estruturas temporárias de tamanho significativo.",
  question: "Considerando as restrições de memória e o tamanho reduzido das listas, qual das opções a seguir representa a análise mais adequada para essa aplicação?",
  options: [
    "Evitar o Merge Sort nesse caso, pois seu uso de memória extra para mesclagem pode ser inviável em um ambiente tão restrito, sendo Insertion Sort uma alternativa mais adequada para listas pequenas",
    "Utilizar exclusivamente o Merge Sort, pois sua complexidade O(n log n) é sempre superior às demais, independentemente do tamanho da lista",
    "Utilizar o Selection Sort, pois ele consome mais memória que o Merge Sort e por isso é mais indicado para sistemas com folga de RAM",
    "A restrição de memória não deve influenciar a escolha do algoritmo, já que todos os quatro algoritmos possuem exatamente o mesmo consumo de memória"
  ],
  answer: 0,
  feedback: "Para **listas pequenas em ambientes com memória restrita**, o custo das estruturas temporárias do Merge Sort pode pesar mais do que seu ganho teórico de complexidade, tornando algoritmos sem memória extra, como o Insertion Sort, mais adequados."
},

// 69 - Mesmo Big O, comportamentos diferentes (Conceitual Contextualizada)
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Conceitual Contextualizada",
  texto: "Ao comparar Bubble Sort e Selection Sort, um aluno concluiu que, como ambos possuem complexidade O(n²) no pior caso, eles necessariamente apresentam desempenho prático idêntico em qualquer lista.",
  question: "Assinale a alternativa que melhor explica por que essa conclusão está equivocada.",
  options: [
    "Porque o Selection Sort, na verdade, possui complexidade O(n log n), diferente do Bubble Sort",
    "Porque, apesar do mesmo Big O, o Selection Sort tende a realizar menos trocas que o Bubble Sort, já que troca no máximo uma vez por passagem",
    "Porque o Bubble Sort nunca chega a O(n²), sendo sempre mais rápido que o Selection Sort",
    "Porque Big O mede exatamente o tempo de execução em segundos, e não o crescimento assintótico"
  ],
  answer: 1,
  feedback: "**Big O descreve o crescimento assintótico**, não o número exato de operações — por isso dois algoritmos com o mesmo Big O, como Bubble e Selection Sort, podem se comportar de forma diferente na prática, especialmente quanto ao número de trocas."
},

// 70 - Identificação de algoritmo por comportamento (Análise Aplicada)
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Análise Aplicada",
  texto: "Durante a depuração de um algoritmo de ordenação, um estagiário observou que, a cada passagem completa pela lista, o algoritmo comparava apenas pares de elementos em posições consecutivas, trocando-os quando necessário, e que o maior valor ainda não posicionado sempre terminava na última posição livre ao final de cada passagem.",
  question: "Com base apenas nesse comportamento observado, qual dos quatro algoritmos estudados está sendo executado?",
  options: [
    "Merge Sort, pois ele sempre posiciona o maior elemento por último",
    "Bubble Sort, pois ele compara exclusivamente elementos adjacentes e desloca o maior valor até o final a cada passagem",
    "Selection Sort, pois ele também finaliza cada passagem com o maior elemento posicionado corretamente",
    "Insertion Sort, pois ele desloca elementos maiores para a direita durante sua execução"
  ],
  answer: 1,
  feedback: "O comportamento descrito — **comparações restritas a pares adjacentes** e o maior elemento \"borbulhando\" até o final a cada passagem — é característica exclusiva do Bubble Sort entre os quatro algoritmos estudados."
},

// 71 - Redução de complexidade via cache (Conceitual Contextualizada)
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Conceitual Contextualizada",
  texto: "Um sistema acadêmico precisa calcular o n-ésimo termo da sequência de Fibonacci diversas vezes ao longo de sua execução, usando a implementação recursiva simples vista anteriormente, sem qualquer otimização.",
  question: "Assinale a alternativa que descreve corretamente o impacto de aplicar memoização nesse cálculo.",
  options: [
    "A complexidade permanece O(2ⁿ), pois memoização apenas reorganiza a ordem das chamadas, sem eliminar recálculos",
    "A complexidade é reduzida para O(log n), pois o cache elimina metade das chamadas recursivas a cada nível",
    "A complexidade é reduzida de O(2ⁿ) para O(n), pois cada valor de n passa a ser calculado uma única vez",
    "A complexidade aumenta para O(n²), pois o cache precisa ser percorrido inteiramente a cada nova chamada"
  ],
  answer: 2,
  feedback: "Com **memoização**, cada valor de n é calculado apenas uma vez e chamadas repetidas são resolvidas em O(1) via cache, o que reduz a complexidade do Fibonacci recursivo de exponencial para linear."
},

// 72 - Características gerais da memoização (Múltiplas Afirmativas)
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Múltiplas Afirmativas",
  texto: "Um grupo de estudantes está revisando os conceitos de memoização para uma avaliação, comparando a implementação manual com dicionário e o uso do decorador @lru_cache.",
  question: "Analise as afirmativas a seguir sobre memoização:",
  assertions: [
    "I. O cache associa cada entrada já calculada ao seu respectivo resultado, permitindo consultas futuras instantâneas.",
    "II. O @lru_cache automatiza o comportamento de cache, evitando que o programador precise implementar manualmente a lógica de verificação e armazenamento.",
    "III. A memoização reduz o consumo total de memória de um programa, já que evita recálculos.",
    "IV. A memoização não traz ganho de desempenho em funções cujos argumentos nunca se repetem durante a execução, como o fatorial."
  ],
  options: [
    "I, II e III, apenas",
    "I, II e IV, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 1,
  feedback: "A afirmativa III está incorreta: a memoização **troca memória por tempo**, ou seja, aumenta o consumo de memória (para guardar o cache) em troca de reduzir o tempo de processamento — nunca o contrário."
},

// 73 - Justificativa da complexidade linear (Asserção + Justificativa)
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Asserção + Justificativa",
  texto: "Um aluno afirmou, durante uma discussão em sala, que o Fibonacci memoizado é muito mais eficiente do que a versão recursiva simples, mas teve dificuldade em explicar exatamente por quê.",
  question: "Avalie as afirmações a seguir e a relação proposta entre elas.",
  assertions: [
    "I. O Fibonacci implementado com memoização possui complexidade O(n).",
    "PORQUE",
    "II. Cada valor de n é calculado apenas uma vez, e todas as chamadas repetidas com o mesmo valor são resolvidas em tempo constante, diretamente do cache."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "A afirmativa II descreve exatamente o mecanismo que explica a afirmativa I: como **cada n é calculado uma única vez** e o restante das chamadas vem do cache em O(1), a complexidade total passa a ser linear."
},

// 74 - Reaproveitamento de cálculos em produção (Análise Aplicada)
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Análise Aplicada",
  texto: "Um sistema de análise financeira precisa calcular fibonacci(40) em diferentes módulos da aplicação, sempre que um determinado relatório é gerado. Atualmente, cada módulo chama uma função recursiva simples, sem nenhum tipo de cache, o que tem tornado a geração dos relatórios perceptivelmente lenta.",
  question: "Considerando o cenário descrito, qual seria a estratégia mais adequada para melhorar o desempenho desses cálculos sem alterar a lógica matemática do Fibonacci?",
  options: [
    "Reescrever a função para calcular o fatorial em vez do Fibonacci, pois o fatorial é naturalmente mais rápido",
    "Aumentar o valor de n solicitado nos relatórios, reduzindo assim o número de chamadas recursivas necessárias",
    "Aplicar memoização (manual ou via @lru_cache) à função, já que os mesmos valores de n tendem a ser recalculados repetidamente entre os módulos",
    "Remover o caso base da função recursiva para simplificar o código e acelerar a execução"
  ],
  answer: 2,
  feedback: "Como os **mesmos valores são recalculados repetidamente** em diferentes módulos, esse é exatamente o cenário em que a memoização traz maior ganho, evitando que o trabalho já feito seja refeito a cada chamada."
},

// 75 - Quando memoização não ajuda (Conceitual Contextualizada)
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Conceitual Contextualizada",
  texto: "Um estudante decidiu aplicar memoização em todas as funções recursivas de seu projeto, incluindo uma função de fatorial, acreditando que qualquer função recursiva se beneficiaria automaticamente dessa técnica.",
  question: "Assinale a alternativa que explica corretamente por que aplicar memoização na função de fatorial não traz ganho de desempenho.",
  options: [
    "Porque o fatorial não pode ser implementado de forma recursiva, apenas iterativa",
    "Porque, no fatorial, cada chamada recursiva utiliza um valor de n diferente e único dentro da mesma execução, não havendo chamadas repetidas para serem evitadas",
    "Porque a memoização só funciona em linguagens que não suportam recursão, como o Python",
    "Porque o fatorial já possui complexidade O(1), tornando qualquer otimização desnecessária"
  ],
  answer: 1,
  feedback: "A memoização só traz ganho quando há **chamadas repetidas com os mesmos argumentos**, como no Fibonacci. No fatorial, cada n aparece uma única vez durante a execução, então o cache nunca é reaproveitado."
},

// 76 - Implementação manual do cache (Múltiplas Afirmativas)
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma desenvolvedora está implementando memoização manualmente em Python, usando um dicionário como parâmetro padrão de uma função recursiva, e revisando com a equipe os detalhes técnicos dessa abordagem.",
  question: "Analise as afirmativas a seguir sobre a implementação manual de memoização com dicionário:",
  assertions: [
    "I. Usar um dicionário mutável como parâmetro padrão funciona nesse contexto porque ele é criado uma única vez e compartilhado entre as chamadas da função.",
    "II. O uso do decorador @lru_cache exige obrigatoriamente que o parâmetro maxsize seja definido explicitamente, sem valor padrão.",
    "III. O dicionário de cache associa cada entrada já processada ao seu respectivo resultado calculado.",
    "IV. A memoização, seja manual ou via @lru_cache, representa uma troca de memória por tempo de execução."
  ],
  options: [
    "I, III e IV, apenas",
    "I, II e III, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa II está incorreta: o `@lru_cache` **não exige que `maxsize` seja definido**, podendo ser usado com seu valor padrão; as demais afirmativas descrevem corretamente características da memoização."
},

// 77 - Importância de armazenar no cache (Asserção + Justificativa)
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Asserção + Justificativa",
  texto: "Ao revisar o código de um colega, um desenvolvedor percebeu que a função de memoização manual verificava corretamente se o valor já estava no cache, mas às vezes esquecia de armazenar o resultado antes de retornar.",
  question: "Avalie as afirmações a seguir e a relação proposta entre elas.",
  assertions: [
    "I. Em uma implementação manual de memoização, é fundamental armazenar o resultado no cache antes de a função retornar.",
    "PORQUE",
    "II. Sem esse armazenamento, chamadas futuras com a mesma entrada não conseguem reaproveitar o resultado já calculado, perdendo o benefício da técnica."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "Se o `cache[n] = resultado` for esquecido, a **função nunca chega a economizar chamadas futuras**, já que o valor nunca fica de fato salvo — o que confirma a relação de causa e efeito entre as duas afirmativas."
},

// 78 - Função sem argumentos repetidos (Análise Aplicada)
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Análise Aplicada",
  texto: "Uma função recursiva percorre uma lista de tarefas de um sistema de gerenciamento de projetos, processando cada item por meio de um índice que sempre aumenta, nunca revisitando um índice já processado dentro da mesma execução.",
  question: "Um desenvolvedor propõe aplicar memoização a essa função para \"garantir mais desempenho\". Avaliando o comportamento descrito, essa proposta é adequada?",
  options: [
    "Sim, pois qualquer função recursiva se beneficia de memoização, independentemente de seus argumentos se repetirem ou não",
    "Não, pois, como cada índice é processado uma única vez, não existem chamadas repetidas para o cache reaproveitar, tornando a memoização inútil nesse caso",
    "Sim, mas apenas se a lista de tarefas tiver mais de mil itens, quando o cache passa a compensar",
    "Não, pois memoização só pode ser aplicada a funções que envolvam cálculos matemáticos, como o Fibonacci"
  ],
  answer: 1,
  feedback: "Assim como no fatorial, quando **não há repetição de argumentos** dentro da mesma execução, o cache nunca é reaproveitado, e a memoização não traz nenhum ganho real de desempenho."
},

// 79 - Trade-off tempo x espaço em ambiente restrito (Conceitual Contextualizada)
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Conceitual Contextualizada",
  texto: "Um sistema embarcado com pouquíssima memória disponível precisa executar cálculos recursivos que envolvem muitos valores repetidos, mas a equipe de desenvolvimento está insegura sobre aplicar memoização, temendo o impacto no consumo de memória do dispositivo.",
  question: "Assinale a alternativa que descreve corretamente o trade-off envolvido na decisão de aplicar ou não memoização nesse cenário.",
  options: [
    "Memoização reduz tanto o tempo de execução quanto o consumo de memória, então não há trade-off relevante a considerar",
    "Memoização reduz o tempo de execução ao custo de aumentar o consumo de memória, exigindo uma análise cuidadosa em ambientes com pouca RAM disponível",
    "Memoização aumenta o tempo de execução para economizar memória, sendo sempre recomendada em sistemas embarcados",
    "Memoização não tem relação com uso de memória, apenas com a complexidade de tempo do algoritmo"
  ],
  answer: 1,
  feedback: "A memoização representa um **trade-off clássico entre tempo e espaço**: ela acelera a execução evitando recálculos, mas exige memória extra para manter o cache — algo que pode pesar em sistemas com recursos limitados."
},

// 80 - Depuração de cache mal implementado (Análise Aplicada)
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Análise Aplicada",
  texto: "Ao testar uma função de Fibonacci memoizada manualmente, um estudante percebeu que, mesmo após várias chamadas com valores repetidos de n, o tempo de execução continuava alto, como se o cache nunca estivesse sendo efetivamente utilizado. Ao inspecionar o código, ele viu que a verificação `if n in cache: return cache[n]` estava presente, mas a linha responsável por salvar o novo resultado no dicionário havia sido removida por engano.",
  question: "Com base no comportamento descrito, qual é a explicação mais provável para a memoização não estar funcionando como esperado?",
  options: [
    "O dicionário usado como cache não suporta números inteiros como chave, apenas strings",
    "Como o resultado nunca é armazenado no cache antes de retornar, cada chamada recalcula o valor do zero, anulando o benefício da memoização",
    "A função está usando recursão em vez de iteração, o que impede qualquer forma de cache",
    "O parâmetro `n` está sendo passado por valor, e não por referência, impedindo o cache de funcionar"
  ],
  answer: 1,
  feedback: "Sem a linha que faz `cache[n] = resultado`, a **etapa de armazenamento nunca ocorre**, então a verificação `if n in cache` nunca encontra nada salvo, e a função continua recalculando tudo do zero em toda chamada."
}
  ],


fixacao: [
    // Capítulo 1 — Listas, Dicionários e outras estruturas Python
    // 1 - Índices de lista
{
  aula: "Capítulo 1 - Listas, Dicionários e outras estruturas Python",
  tipo: "Direta",
  texto: "Considere uma lista comum criada em Python.",
  question: "Qual é o índice do primeiro elemento de uma lista em Python?",
  options: [
    "0",
    "1",
    "-1",
    "Depende do tamanho da lista"
  ],
  answer: 0,
  feedback: "Em Python, os índices de listas sempre começam em 0."
},

// 2 - Slice de lista
{
  aula: "Capítulo 1 - Listas, Dicionários e outras estruturas Python",
  tipo: "Contexto",
  texto: "Uma lista notas = [7.5, 8.0, 6.5, 9.0] foi criada para guardar as notas de um aluno.",
  question: "O que o comando notas[1:3] retorna?",
  options: [
    "[7.5, 8.0]",
    "[8.0, 6.5]",
    "[8.0, 6.5, 9.0]",
    "[6.5, 9.0]"
  ],
  answer: 1,
  feedback: "O slice [1:3] pega os índices 1 e 2, mas não inclui o índice 3."
},

// 3 - Referência vs cópia
{
  aula: "Capítulo 1 - Listas, Dicionários e outras estruturas Python",
  tipo: "Aplicação",
  texto: "Um programador criou a lista original = [10, 20, 30] e depois fez copia = original, pretendendo trabalhar em uma lista separada.",
  question: "O que acontece se copia.append(40) for executado nesse cenário?",
  options: [
    "Apenas 'copia' é alterada, pois é uma lista independente",
    "Apenas 'original' é alterada",
    "Tanto 'original' quanto 'copia' são alteradas, pois apontam para o mesmo objeto",
    "Ocorre um erro, pois listas não podem ser reatribuídas dessa forma"
  ],
  answer: 2,
  feedback: "Ao fazer copia = original, ambas as variáveis apontam para o mesmo objeto na memória; para copiar de fato, seria necessário usar .copy() ou [:]."
},

// 4 - Tupla de um elemento
{
  aula: "Capítulo 1 - Listas, Dicionários e outras estruturas Python",
  tipo: "Direta",
  texto: "Um estudante escreveu t = (7) achando que criou uma tupla.",
  question: "Qual é o tipo real da variável t nesse caso?",
  options: [
    "tuple",
    "list",
    "dict",
    "int"
  ],
  answer: 3,
  feedback: "Sem a vírgula, (7) é apenas o número 7 entre parênteses, então o tipo é int; para criar uma tupla seria necessário (7,)."
},

// 5 - Chave inexistente em dicionário
{
  aula: "Capítulo 1 - Listas, Dicionários e outras estruturas Python",
  tipo: "Contexto",
  texto: "Um sistema de cadastro guarda dados em aluno = {'nome': 'João', 'idade': 20} e tenta acessar aluno['telefone'].",
  question: "O que acontece ao executar esse acesso direto?",
  options: [
    "Gera um erro do tipo KeyError",
    "Retorna None automaticamente",
    "Retorna uma string vazia",
    "Cria a chave 'telefone' com valor padrão"
  ],
  answer: 0,
  feedback: "Acessar uma chave inexistente diretamente com colchetes gera KeyError; para evitar isso, usa-se o método .get()."
},

// 6 - Remover duplicatas
{
  aula: "Capítulo 1 - Listas, Dicionários e outras estruturas Python",
  tipo: "Aplicação",
  texto: "Uma lista de códigos de produtos contém valores repetidos e precisa ser filtrada rapidamente para eliminar as repetições, sem se importar com a ordem final.",
  question: "Qual estrutura é mais indicada para remover duplicatas dessa lista de forma simples?",
  options: [
    "Transformar a lista em tupla",
    "Transformar a lista em conjunto (set)",
    "Transformar a lista em dicionário",
    "Ordenar a lista com sort()"
  ],
  answer: 1,
  feedback: "Conjuntos não permitem elementos repetidos, então convertê-los para set remove duplicatas facilmente."
},

// 7 - Percorrendo dicionário
{
  aula: "Capítulo 1 - Listas, Dicionários e outras estruturas Python",
  tipo: "Código",
  texto: "Considere o trecho de código abaixo, que percorre um dicionário de configurações.",
  question: "O que será impresso na tela ao executar esse código?",
  code: `config = {"tema": "escuro", "idioma": "pt-br"}\nfor item in config:\n    print(item)`,
  options: [
    "escuro e pt-br",
    "('tema', 'escuro') e ('idioma', 'pt-br')",
    "tema e idioma",
    "Um erro de execução"
  ],
  answer: 2,
  feedback: "Percorrer um dicionário com 'for item in dicionario' itera sobre as chaves, não sobre os valores."
},

// 8 - Estrutura não ordenada
{
  aula: "Capítulo 1 - Listas, Dicionários e outras estruturas Python",
  tipo: "Direta",
  texto: "Entre as estruturas básicas do Python, uma delas se destaca por não manter uma ordem garantida entre seus elementos.",
  question: "Qual estrutura de dados não garante ordem entre seus elementos?",
  options: [
    "Lista",
    "Tupla",
    "Dicionário",
    "Conjunto"
  ],
  answer: 3,
  feedback: "O conjunto (set) é a única estrutura entre as citadas que não garante ordem para seus elementos."
},

// 9 - Mutabilidade de tupla
{
  aula: "Capítulo 1 - Listas, Dicionários e outras estruturas Python",
  tipo: "Contexto",
  texto: "Durante uma revisão de prova, um colega afirmou que tuplas podem ser alteradas depois de criadas, assim como listas.",
  question: "Essa afirmação está correta?",
  options: [
    "Não, tuplas são imutáveis e não podem ser alteradas após criadas",
    "Sim, tuplas são mutáveis como listas",
    "Sim, mas apenas se a tupla tiver mais de um elemento",
    "Não, mas apenas dicionários podem ser alterados livremente"
  ],
  answer: 0,
  feedback: "Tuplas são imutáveis: uma vez criadas, não é possível adicionar, remover ou alterar seus elementos."
},

// 10 - Escolha de estrutura para dados fixos
{
  aula: "Capítulo 1 - Listas, Dicionários e outras estruturas Python",
  tipo: "Aplicação",
  texto: "Um sistema precisa armazenar as coordenadas geográficas (latitude, longitude) de um ponto que nunca deve ser modificado durante a execução do programa.",
  question: "Qual estrutura é mais adequada para representar essas coordenadas?",
  options: [
    "Lista, por ser mutável e flexível",
    "Tupla, por ser imutável e adequada a dados fixos",
    "Conjunto, por não permitir repetição",
    "Dicionário, por associar chaves a valores"
  ],
  answer: 1,
  feedback: "Como as coordenadas não devem mudar, a tupla é mais adequada, pois é imutável e mais eficiente que a lista para esse caso."
},

// Capítulo 2 — Funções em Python
// 1 - print vs return
{
  aula: "Capítulo 2 - Funções em Python",
  tipo: "Direta",
  texto: "Uma função foi definida apenas com um print dentro dela, sem nenhuma instrução return.",
  question: "O que a função retorna quando chamada e o valor é armazenado em uma variável?",
  options: [
    "None",
    "O valor exibido pelo print",
    "Um erro de sintaxe",
    "0"
  ],
  answer: 0,
  feedback: "Sem return, a função sempre devolve None, mesmo que ela mostre algo na tela com print."
},

// 2 - Parâmetro com valor padrão
{
  aula: "Capítulo 2 - Funções em Python",
  tipo: "Contexto",
  texto: "A função def saudacao(nome='visitante'): print(f'Olá, {nome}!') foi definida em um programa.",
  question: "O que acontece ao chamar saudacao() sem nenhum argumento?",
  options: [
    "Ocorre um erro, pois falta o argumento obrigatório",
    "Imprime 'Olá, visitante!', usando o valor padrão",
    "Imprime 'Olá, None!'",
    "A função não executa nada"
  ],
  answer: 1,
  feedback: "Quando nenhum argumento é passado, o parâmetro assume o valor padrão definido na função."
},

// 3 - Escopo local sem 'global'
{
  aula: "Capítulo 2 - Funções em Python",
  tipo: "Aplicação",
  texto: "Em um programa, x = 10 é definido fora de qualquer função, e dentro de uma função existe a linha x = 99 sem uso da palavra-chave global.",
  question: "O que acontece com o valor de x fora da função após ela ser executada?",
  options: [
    "x passa a valer 99 em todo o programa",
    "A execução gera um erro de sintaxe",
    "x continua valendo 10, pois foi criada uma variável local separada",
    "x se torna indefinido (undefined)"
  ],
  answer: 2,
  feedback: "Sem a palavra-chave global, a atribuição dentro da função cria uma nova variável local, sem afetar a global."
},

// 4 - Tipo de *args
{
  aula: "Capítulo 2 - Funções em Python",
  tipo: "Direta",
  texto: "Uma função foi definida usando def soma_tudo(*numeros): ...",
  question: "Qual é o tipo de dado recebido pelo parâmetro numeros dentro da função?",
  options: [
    "Lista",
    "Dicionário",
    "Conjunto",
    "Tupla"
  ],
  answer: 3,
  feedback: "O parâmetro *args recebe os argumentos extras como uma tupla."
},

// 5 - Ordem de argumentos nomeados e posicionais
{
  aula: "Capítulo 2 - Funções em Python",
  tipo: "Contexto",
  texto: "Um programador tentou chamar uma função assim: apresentar(nome='Carlos', 30), misturando argumento nomeado com posicional.",
  question: "O que acontece nesse caso?",
  options: [
    "Ocorre um erro de sintaxe, pois argumentos posicionais devem vir antes dos nomeados",
    "A função é executada normalmente, pois a ordem não importa",
    "O Python ignora o argumento nomeado",
    "O valor 30 é atribuído automaticamente ao primeiro parâmetro"
  ],
  answer: 0,
  feedback: "Quando se mistura argumento nomeado com posicional, os posicionais precisam vir sempre antes, senão ocorre erro de sintaxe."
},

// 6 - Código morto após return
{
  aula: "Capítulo 2 - Funções em Python",
  tipo: "Aplicação",
  texto: "Uma função contém um return no meio do bloco de código, seguido por outras instruções logo abaixo dele, no mesmo nível de execução.",
  question: "O que acontece com as instruções escritas depois do return, quando ele é executado?",
  options: [
    "Elas são executadas normalmente antes de a função encerrar",
    "Elas nunca são executadas, pois o return encerra a função imediatamente",
    "Elas são executadas apenas se não houver erro",
    "Elas substituem o valor do return"
  ],
  answer: 1,
  feedback: "O return encerra a execução da função imediatamente; qualquer código depois dele nunca roda."
},

// 7 - kwargs em ação
{
  aula: "Capítulo 2 - Funções em Python",
  tipo: "Código",
  texto: "Considere o trecho de código a seguir.",
  question: "O que será impresso ao executar esse código?",
  code: `def mostrar_dados(**dados):\n    for chave, valor in dados.items():\n        print(chave, ":", valor)\n\nmostrar_dados(nome="Ana", idade=22)`,
  options: [
    "Um erro, pois **dados não é uma sintaxe válida",
    "nome idade (sem os valores)",
    "nome : Ana e idade : 22",
    "Ana e 22, sem as chaves"
  ],
  answer: 2,
  feedback: "**kwargs recebe os argumentos nomeados como um dicionário, e o laço imprime cada par chave-valor."
},

// 8 - Palavra-chave global
{
  aula: "Capítulo 2 - Funções em Python",
  tipo: "Direta",
  texto: "Um programador quer que uma atribuição feita dentro de uma função altere de fato uma variável definida fora dela.",
  question: "Qual palavra-chave deve ser usada dentro da função para isso ser possível?",
  options: [
    "local",
    "static",
    "return",
    "global"
  ],
  answer: 3,
  feedback: "A palavra-chave global permite que a função altere diretamente a variável definida fora dela."
},

// 9 - Valor de args em chamada mista
{
  aula: "Capítulo 2 - Funções em Python",
  tipo: "Contexto",
  texto: "Uma função foi chamada como exemplo(1, 2, 3, 4, x=5, y=6), com a assinatura def exemplo(a, b=10, *args, **kwargs).",
  question: "Qual será o valor de args dentro da função nessa chamada?",
  options: [
    "(3, 4)",
    "(1, 2, 3, 4)",
    "{'x': 5, 'y': 6}",
    "(2, 3, 4)"
  ],
  answer: 0,
  feedback: "Depois de a=1 e b=2 serem preenchidos, os argumentos posicionais restantes (3 e 4) vão para args como tupla."
},

// 10 - Retorno de múltiplos valores
{
  aula: "Capítulo 2 - Funções em Python",
  tipo: "Aplicação",
  texto: "Uma função precisa devolver ao mesmo tempo a soma e a subtração de dois números para quem a chamou.",
  question: "Qual é a forma mais natural de fazer isso em Python?",
  options: [
    "Usando duas instruções return separadas",
    "Retornando os dois valores separados por vírgula, que formam uma tupla",
    "Usando uma variável global para cada valor",
    "Imprimindo os dois valores com print, sem usar return"
  ],
  answer: 1,
  feedback: "Separar os valores por vírgula no return cria automaticamente uma tupla com os dois resultados."
},

// Capítulo 3 — Recursão
// 1 - Definição de caso base
{
  aula: "Capítulo 3 - Recursão",
  tipo: "Direta",
  texto: "Toda função recursiva precisa ter uma condição especial para não chamar a si mesma indefinidamente.",
  question: "Como essa condição é chamada?",
  options: [
    "Caso base",
    "Caso recursivo",
    "Condição de parada externa",
    "Laço de repetição"
  ],
  answer: 0,
  feedback: "O caso base é a condição mais simples, que não chama mais a função e encerra a recursão."
},

// 2 - Rastreamento de fatorial
{
  aula: "Capítulo 3 - Recursão",
  tipo: "Contexto",
  texto: "Considere a função def fatorial(n): return 1 if n == 0 else n * fatorial(n-1).",
  question: "Qual é o valor retornado por fatorial(4)?",
  options: [
    "4",
    "24",
    "12",
    "16"
  ],
  answer: 1,
  feedback: "4 * 3 * 2 * 1 * fatorial(0) = 4 * 3 * 2 * 1 * 1 = 24."
},

// 3 - Caso base inalcançável
{
  aula: "Capítulo 3 - Recursão",
  tipo: "Aplicação",
  texto: "Uma função recursiva foi escrita para contar de 1 até n, mas o argumento passado nas chamadas recursivas se afasta do valor do caso base em vez de se aproximar.",
  question: "O que provavelmente acontece ao executar essa função?",
  options: [
    "A função funciona normalmente, apenas mais devagar",
    "A função retorna None em todas as chamadas",
    "Ocorre RecursionError, pois o caso base nunca é alcançado",
    "A função retorna 0 automaticamente"
  ],
  answer: 2,
  feedback: "Se o argumento nunca se aproxima do caso base, a recursão nunca para, estourando a pilha de chamadas."
},

// 4 - Esquecer return na chamada recursiva
{
  aula: "Capítulo 3 - Recursão",
  tipo: "Direta",
  texto: "Uma função recursiva calcula um valor internamente, mas a linha da chamada recursiva não possui a palavra-chave return antes dela.",
  question: "O que acontece com o resultado calculado nesse caso?",
  options: [
    "Ele é retornado normalmente",
    "Ele gera um erro de sintaxe",
    "Ele é impresso automaticamente na tela",
    "Ele é perdido, e a função retorna None"
  ],
  answer: 3,
  feedback: "Sem return, o valor calculado é descartado e a função devolve None por padrão."
},

// 5 - Complexidade do Fibonacci recursivo
{
  aula: "Capítulo 3 - Recursão",
  tipo: "Contexto",
  texto: "A função fibonacci(n) foi implementada fazendo duas chamadas recursivas a cada nível: fibonacci(n-1) + fibonacci(n-2).",
  question: "Como essa característica afeta a complexidade da função?",
  options: [
    "Torna a complexidade exponencial, O(2ⁿ)",
    "Torna a complexidade O(n), pois é apenas uma soma",
    "Não afeta a complexidade, que continua O(1)",
    "Torna a complexidade O(log n), pois divide o problema"
  ],
  answer: 0,
  feedback: "Duas chamadas por nível, sem reaproveitamento de resultados, geram uma árvore de chamadas que cresce exponencialmente."
},

// 6 - Problema menor em soma_lista
{
  aula: "Capítulo 3 - Recursão",
  tipo: "Aplicação",
  texto: "Uma função soma_lista(lista) soma os elementos usando lista[0] + soma_lista(lista[1:]) a cada chamada, com uma lista vazia como caso base.",
  question: "O que define o 'problema menor' resolvido a cada chamada recursiva nesse caso?",
  options: [
    "O valor da soma calculada até o momento",
    "Uma lista com um elemento a menos a cada chamada",
    "O índice do elemento atual, que aumenta a cada chamada",
    "O tamanho fixo definido no início da função"
  ],
  answer: 1,
  feedback: "A cada chamada, a lista passada fica menor (lista[1:]), aproximando-se do caso base de lista vazia."
},

// 7 - Fatorial sem return
{
  aula: "Capítulo 3 - Recursão",
  tipo: "Código",
  texto: "Analise a função a seguir.",
  question: "O que será impresso ao executar esse código?",
  code: `def fatorial_sem_return(n):\n    if n == 0:\n        return 1\n    n * fatorial_sem_return(n - 1)\n\nprint(fatorial_sem_return(4))`,
  options: [
    "24",
    "4",
    "None",
    "Um erro de execução"
  ],
  answer: 2,
  feedback: "Como falta o return na chamada recursiva, o valor calculado é descartado e a função retorna None."
},

// 8 - Desvantagem da recursão
{
  aula: "Capítulo 3 - Recursão",
  tipo: "Direta",
  texto: "Comparando recursão e iteração para resolver o mesmo problema, um dos aspectos costuma pesar contra a recursão.",
  question: "Qual é uma desvantagem típica da recursão em relação à iteração?",
  options: [
    "A recursão é sempre mais rápida em tempo de execução",
    "A recursão nunca pode resolver problemas resolvidos por loops",
    "A recursão é mais difícil de escrever em qualquer situação",
    "A recursão usa mais memória, pois cada chamada fica na pilha de execução"
  ],
  answer: 3,
  feedback: "Cada chamada recursiva permanece na pilha de execução até ser resolvida, consumindo mais memória que um loop."
},

// 9 - Relação entre recursão e pilha
{
  aula: "Capítulo 3 - Recursão",
  tipo: "Contexto",
  texto: "Durante a execução de uma função recursiva, cada chamada pendente fica 'esperando' o resultado da próxima chamada, e as chamadas são resolvidas na ordem inversa quando o caso base é atingido.",
  question: "Esse comportamento da recursão se assemelha ao funcionamento de qual estrutura de dados?",
  options: [
    "Pilha (LIFO)",
    "Fila (FIFO)",
    "Dicionário",
    "Conjunto"
  ],
  answer: 0,
  feedback: "A recursão usa o mesmo mecanismo de uma pilha: as chamadas mais recentes são resolvidas primeiro (LIFO)."
},

// 10 - Múltiplos casos base
{
  aula: "Capítulo 3 - Recursão",
  tipo: "Aplicação",
  texto: "Uma implementação de fibonacci(n) usa duas condições de parada: uma para n == 0 e outra para n == 1.",
  question: "Por que é comum uma função recursiva ter mais de um caso base?",
  options: [
    "Porque isso é proibido, e o correto é ter sempre um único caso base",
    "Porque, dependendo do problema, mais de uma condição pode ser necessária para cobrir todos os pontos de parada",
    "Porque cada chamada recursiva precisa de um novo caso base próprio",
    "Porque isso reduz a complexidade da função para O(1)"
  ],
  answer: 1,
  feedback: "Alguns problemas, como Fibonacci, precisam de mais de uma condição de parada para cobrir todos os cenários possíveis."
},

// Capítulo 4 — Classes e Objetos em Python
// 1 - Parâmetro self
{
  aula: "Capítulo 4 - Classes e Objetos em Python",
  tipo: "Direta",
  texto: "Em Python, todo método definido dentro de uma classe precisa de um parâmetro especial na primeira posição.",
  question: "Como esse parâmetro é chamado, por convenção?",
  options: [
    "self",
    "this",
    "obj",
    "instance"
  ],
  answer: 0,
  feedback: "Por convenção, o primeiro parâmetro de um método representa o próprio objeto e é chamado de self."
},

// 2 - Construtor __init__
{
  aula: "Capítulo 4 - Classes e Objetos em Python",
  tipo: "Contexto",
  texto: "Ao criar um objeto com Cachorro('Rex', 'Labrador'), um método especial da classe é chamado automaticamente.",
  question: "Qual é o nome desse método, responsável por inicializar os atributos do objeto?",
  options: [
    "__new__",
    "__init__",
    "__str__",
    "__main__"
  ],
  answer: 1,
  feedback: "O __init__ é o construtor, chamado automaticamente sempre que um objeto é criado."
},

// 3 - Atributos de instância independentes
{
  aula: "Capítulo 4 - Classes e Objetos em Python",
  tipo: "Aplicação",
  texto: "Uma classe Contador possui um atributo self.valor iniciado em 0 no __init__, e um método incrementar que soma 1 a esse valor. Dois objetos, c1 e c2, são criados, e c1.incrementar() é chamado duas vezes, enquanto c2.incrementar() é chamado uma vez.",
  question: "Quais serão os valores de c1.valor e c2.valor após essas chamadas?",
  options: [
    "Ambos terão o mesmo valor, pois compartilham o atributo",
    "c1.valor será 2 e c2.valor será 1, pois cada objeto tem seu próprio atributo",
    "c1.valor será 1 e c2.valor será 2",
    "Ocorrerá um erro, pois valor não pode ser alterado fora do __init__"
  ],
  answer: 1,
  feedback: "Atributos de instância são independentes para cada objeto, então cada um mantém seu próprio contador."
},

// 4 - Atributo de classe compartilhado
{
  aula: "Capítulo 4 - Classes e Objetos em Python",
  tipo: "Direta",
  texto: "Uma classe Aluno define escola = 'Colégio ABC' fora do __init__, como atributo direto da classe.",
  question: "Como esse tipo de atributo é chamado, e o que acontece se ele for alterado por meio da classe?",
  options: [
    "Atributo de instância; a mudança afeta apenas um objeto específico",
    "Atributo privado; não pode ser acessado pelos objetos",
    "Método estático; não armazena valores",
    "Atributo de classe; a mudança é refletida em todos os objetos que não o sobrescreveram individualmente"
  ],
  answer: 3,
  feedback: "Um atributo definido diretamente na classe é compartilhado por todos os objetos criados a partir dela."
},

// 5 - Método sem self
{
  aula: "Capítulo 4 - Classes e Objetos em Python",
  tipo: "Contexto",
  texto: "Uma classe foi definida com um método assim: def metodo(): print('oi'), sem incluir o parâmetro self.",
  question: "O que acontece ao chamar obj.metodo(), sendo obj uma instância dessa classe?",
  options: [
    "Ocorre um TypeError, pois o Python tenta passar o objeto automaticamente como argumento",
    "O método é executado normalmente, ignorando o self",
    "O método retorna None sem erro",
    "O Python cria automaticamente o self ausente"
  ],
  answer: 0,
  feedback: "O Python sempre tenta passar o objeto como primeiro argumento, então a ausência do self causa um TypeError."
},

// 6 - Classe vs dicionário
{
  aula: "Capítulo 4 - Classes e Objetos em Python",
  tipo: "Aplicação",
  texto: "Um programador está decidindo entre representar um aluno como um dicionário {'nome': 'Ana', 'nota': 8} ou como uma instância de uma classe Aluno com um método aprovado().",
  question: "Qual é uma vantagem de usar a classe nesse cenário?",
  options: [
    "Dicionários não podem armazenar números, apenas texto",
    "A classe permite associar comportamentos (métodos) diretamente aos dados do objeto",
    "Classes ocupam sempre menos memória que dicionários",
    "Não há diferença prática entre as duas abordagens"
  ],
  answer: 1,
  feedback: "Classes permitem juntar dados e comportamentos (métodos) em um mesmo objeto, algo que um dicionário simples não oferece."
},

// 7 - Instanciar sem parênteses
{
  aula: "Capítulo 4 - Classes e Objetos em Python",
  tipo: "Código",
  texto: "Observe o trecho de código a seguir.",
  question: "O que acontece ao executar esse código?",
  code: `class Ponto:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\np = Ponto\nprint(p)`,
  options: [
    "Um objeto Ponto é criado normalmente, com x e y indefinidos",
    "Ocorre um erro, pois faltam os argumentos x e y",
    "p passa a referenciar a própria classe Ponto, não um objeto, e nenhum erro ocorre nessa linha",
    "Um TypeError é lançado imediatamente na linha de atribuição"
  ],
  answer: 2,
  feedback: "Sem os parênteses, p = Ponto apenas referencia a classe, não cria um objeto; nenhum erro ocorre até tentar usar p como instância."
},

// 8 - Finalidade do __str__
{
  aula: "Capítulo 4 - Classes e Objetos em Python",
  tipo: "Direta",
  texto: "Uma classe Pessoa define um método especial chamado __str__, que retorna uma string formatada com nome e idade.",
  question: "Para que serve esse método especial?",
  options: [
    "Para inicializar os atributos do objeto",
    "Para criar uma cópia do objeto",
    "Para comparar dois objetos entre si",
    "Para definir como o objeto será exibido quando usado com print()"
  ],
  answer: 3,
  feedback: "O __str__ define a representação em texto do objeto, usada automaticamente por funções como print()."
},

// 9 - Return dentro do __init__
{
  aula: "Capítulo 4 - Classes e Objetos em Python",
  tipo: "Contexto",
  texto: "Um programador tentou colocar return self.x dentro do método __init__ de uma classe, esperando que isso retornasse um valor útil.",
  question: "O que acontece nesse caso?",
  options: [
    "Ocorre um erro, pois __init__ não pode retornar um valor diferente de None",
    "O valor é retornado normalmente ao criar o objeto",
    "O Python ignora silenciosamente o return, sem qualquer efeito",
    "O objeto criado passa a ser igual ao valor retornado"
  ],
  answer: 0,
  feedback: "O __init__ apenas inicializa o objeto; tentar retornar um valor diferente de None gera erro."
},

// 10 - Molde vs instância
{
  aula: "Capítulo 4 - Classes e Objetos em Python",
  tipo: "Aplicação",
  texto: "Em uma analogia comum, uma classe Carro define que todo carro tem cor, modelo e velocidade, e pode acelerar ou frear.",
  question: "Nessa analogia, o que representa um carro específico, como o carro vermelho do João?",
  options: [
    "Um método da classe Carro",
    "Um objeto (instância) criado a partir da classe Carro",
    "Um atributo de classe compartilhado",
    "A própria classe Carro"
  ],
  answer: 1,
  feedback: "A classe é o molde; cada carro específico criado a partir dela é um objeto, ou instância, dessa classe."
},

// Capítulo 5 — Análise de Complexidade e Eficiência de Algoritmos
// 1 - Complexidade O(1)
{
  aula: "Capítulo 5 - Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Direta",
  texto: "Uma função apenas acessa lista[0] e retorna esse valor, independentemente do tamanho da lista.",
  question: "Qual é a complexidade dessa função?",
  options: [
    "O(1)",
    "O(n)",
    "O(log n)",
    "O(n²)"
  ],
  answer: 0,
  feedback: "Acessar um elemento por índice é sempre uma operação de tempo constante, O(1)."
},

// 2 - Laços aninhados dependentes de n
{
  aula: "Capítulo 5 - Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Contexto",
  texto: "Uma função percorre uma lista de tamanho n com um laço for, e dentro desse laço existe outro laço for que também percorre todos os n elementos.",
  question: "Qual é a complexidade típica dessa função?",
  options: [
    "O(n)",
    "O(n²)",
    "O(log n)",
    "O(2n)"
  ],
  answer: 1,
  feedback: "Dois laços aninhados, ambos dependendo de n, resultam em aproximadamente n × n operações, ou seja, O(n²)."
},

// 3 - Laço interno fixo
{
  aula: "Capítulo 5 - Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Aplicação",
  texto: "Em um sistema, uma função percorre uma lista de tamanho n com um laço externo, mas o laço interno sempre executa exatamente 5 vezes, independentemente do tamanho da lista.",
  question: "Qual é a complexidade dessa função, considerando que o laço interno não depende de n?",
  options: [
    "Não há problema, pois pop(0) é sempre O(1) em listas Python",
    "O(5n), que não pode ser simplificado",
    "O(n), pois a constante 5 é descartada no Big O",
    "O(log n), pois o laço interno é pequeno"
  ],
  answer: 2,
  feedback: "Como o laço interno não depende de n, temos O(n × 5), que simplifica para O(n) ao descartar a constante."
},

// 4 - Busca binária
{
  aula: "Capítulo 5 - Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Direta",
  texto: "Um algoritmo de busca divide repetidamente a área de busca pela metade a cada passo, até encontrar o elemento desejado.",
  question: "Qual é a complexidade típica desse tipo de busca?",
  options: [
    "O(n)",
    "O(n²)",
    "O(1)",
    "O(log n)"
  ],
  answer: 3,
  feedback: "Dividir o problema pela metade a cada passo é característico da complexidade logarítmica, O(log n)."
},

// 5 - Laços sequenciais somam
{
  aula: "Capítulo 5 - Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Contexto",
  texto: "Um programa executa um laço for percorrendo uma lista de tamanho n, e logo depois, fora do primeiro laço, executa outro laço for percorrendo a mesma lista novamente.",
  question: "Como essas duas complexidades se combinam nesse caso?",
  options: [
    "Elas se somam, resultando em O(n) após simplificação, pois são laços sequenciais, não aninhados",
    "Elas se multiplicam, resultando em O(n²)",
    "Apenas o segundo laço conta para a complexidade final",
    "O resultado é sempre O(1), pois os laços são independentes"
  ],
  answer: 0,
  feedback: "Laços sequenciais somam suas complexidades: O(n) + O(n) = O(2n), que simplifica para O(n)."
},

// 6 - Operação in dentro de laço
{
  aula: "Capítulo 5 - Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Aplicação",
  texto: "Uma função percorre uma lista1 de tamanho n com um laço for, e para cada item verifica se ele está presente em uma lista2 (também de tamanho n) usando o operador in.",
  question: "Qual é a complexidade total dessa função, considerando que 'in' em uma lista também é O(n)?",
  options: [
    "O(n), pois o 'in' não conta para a complexidade",
    "O(n²), pois o laço externo é O(n) e o 'in' dentro dele também é O(n)",
    "O(log n), pois há uma busca envolvida",
    "O(1), pois 'in' é sempre uma operação rápida"
  ],
  answer: 1,
  feedback: "Multiplicando o laço externo O(n) pela busca 'in' também O(n), a complexidade total é O(n²), mesmo sem laços aninhados visíveis."
},

// 7 - Complexidade com if
{
  aula: "Capítulo 5 - Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Código",
  texto: "Analise a função a seguir.",
  question: "Qual é a complexidade dessa função, considerando o pior caso?",
  code: `def exemplo(lista, n):\n    if len(lista) > 100:\n        for i in range(n):\n            print(i)\n    else:\n        print("lista pequena")`,
  options: [
    "O(1), pois o else é sempre mais rápido",
    "O(log n), pois depende do tamanho da lista",
    "O(n), pois o pior caso é o ramo que executa o laço",
    "O(n²), pois há uma condição envolvida"
  ],
  answer: 2,
  feedback: "A complexidade de um if é dada pelo pior caso entre os ramos; aqui o ramo com o laço é O(n), então essa é a complexidade total."
},

// 8 - Ordem de eficiência
{
  aula: "Capítulo 5 - Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Direta",
  texto: "Um professor pediu para os alunos decorarem a ordem das complexidades, da mais eficiente para a menos eficiente.",
  question: "Qual das alternativas representa corretamente essa ordem, da mais rápida para a mais lenta?",
  options: [
    "O(n²) < O(n) < O(log n) < O(1)",
    "O(2ⁿ) < O(n²) < O(n) < O(1)",
    "O(n) < O(log n) < O(1) < O(n²)",
    "O(1) < O(log n) < O(n) < O(n²)"
  ],
  answer: 3,
  feedback: "A ordem correta, da mais eficiente para a menos eficiente, é O(1) < O(log n) < O(n) < O(n²) < O(n³) < O(2ⁿ)."
},

// 9 - in em conjunto vs lista
{
  aula: "Capítulo 5 - Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Contexto",
  texto: "Um algoritmo precisa verificar repetidamente, dentro de um laço, se um valor já foi processado antes, e o programador está decidindo entre guardar os valores em uma lista ou em um conjunto (set).",
  question: "Do ponto de vista de eficiência da operação 'in', qual estrutura é mais adequada para essa verificação repetida?",
  options: [
    "Conjunto (set), pois a busca 'in' é O(1) em média",
    "Lista, pois a busca 'in' é O(1) em qualquer estrutura",
    "Tupla, pois é imutável e por isso mais rápida para busca",
    "Não há diferença de desempenho entre lista e conjunto para o 'in'"
  ],
  answer: 0,
  feedback: "A busca 'in' em conjuntos (e dicionários) é O(1) em média, enquanto em listas é O(n)."
},

// 10 - Complexidade de recursão tipo fatorial
{
  aula: "Capítulo 5 - Análise de Complexidade e Eficiência de Algoritmos",
  tipo: "Aplicação",
  texto: "Uma função recursiva de fatorial faz exatamente uma chamada recursiva por nível, reduzindo o problema em 1 a cada chamada, até chegar ao caso base.",
  question: "Qual é a complexidade dessa função recursiva?",
  options: [
    "O(1), pois cada chamada faz pouco trabalho",
    "O(n), pois o número de chamadas cresce linearmente com n",
    "O(n²), pois cada chamada gera outras duas chamadas",
    "O(2ⁿ), como no Fibonacci recursivo simples"
  ],
  answer: 1,
  feedback: "Uma chamada recursiva por nível, reduzindo o problema em 1, resulta em n chamadas no total, ou seja, O(n)."
},

// Capítulo 6 — Pilhas e Filas
// 1 - Regra da pilha
{
  aula: "Capítulo 6 - Pilhas e Filas",
  tipo: "Direta",
  texto: "Uma pilha (stack) segue uma regra específica sobre a ordem de entrada e saída dos elementos.",
  question: "Qual é a regra que define o funcionamento de uma pilha?",
  options: [
    "LIFO — o último a entrar é o primeiro a sair",
    "FIFO — o primeiro a entrar é o primeiro a sair",
    "Ordem aleatória de entrada e saída",
    "Ordenação automática pelo valor dos elementos"
  ],
  answer: 0,
  feedback: "A pilha segue a regra LIFO (Last In, First Out): o último elemento inserido é o primeiro a ser removido."
},

// 2 - Fila e atendimento bancário
{
  aula: "Capítulo 6 - Pilhas e Filas",
  tipo: "Contexto",
  texto: "Um sistema de atendimento bancário precisa garantir que o primeiro cliente a chegar seja o primeiro a ser atendido, e os novos clientes entram sempre no final da fila de espera.",
  question: "Qual estrutura de dados representa corretamente esse comportamento?",
  options: [
    "Pilha, pois segue a regra LIFO",
    "Fila, pois segue a regra FIFO",
    "Lista comum sem restrições de acesso",
    "Conjunto, pois evita repetição de clientes"
  ],
  answer: 1,
  feedback: "A fila segue a regra FIFO (First In, First Out), adequada para atendimento por ordem de chegada."
},

// 3 - Ineficiência do pop(0) em fila
{
  aula: "Capítulo 6 - Pilhas e Filas",
  tipo: "Aplicação",
  texto: "Um programador implementou uma fila usando uma lista comum, removendo elementos com self.itens.pop(0) sempre que um cliente é atendido, em um sistema que processa milhares de operações por segundo.",
  question: "Qual é o principal problema dessa implementação, do ponto de vista de eficiência?",
  options: [
    "Não há problema, pois pop(0) é sempre O(1) em listas Python",
    "append() no final da lista é o verdadeiro gargalo de desempenho",
    "pop(0) é O(n), pois todos os elementos restantes precisam ser deslocados, tornando a fila lenta para muitas operações",
    "O problema é que listas não podem armazenar clientes como strings"
  ],
  answer: 2,
  feedback: "Remover o primeiro elemento de uma lista com pop(0) é O(n), pois todos os demais elementos precisam ser deslocados; o ideal é usar collections.deque."
},

// 4 - Topo da pilha
{
  aula: "Capítulo 6 - Pilhas e Filas",
  tipo: "Direta",
  texto: "Em uma pilha implementada com uma lista Python, o topo é representado pelo final da lista, por questões de eficiência.",
  question: "Qual elemento é considerado o 'topo' da pilha nesse caso?",
  options: [
    "O primeiro elemento inserido na lista",
    "Um elemento escolhido aleatoriamente",
    "O elemento do meio da lista",
    "O último elemento inserido na lista"
  ],
  answer: 3,
  feedback: "O topo da pilha corresponde ao final da lista, pois append() e pop() nessa posição são operações O(1)."
},

// 5 - Deque para filas eficientes
{
  aula: "Capítulo 6 - Pilhas e Filas",
  tipo: "Contexto",
  texto: "Para implementar uma fila eficiente em Python, é comum usar a estrutura collections.deque em vez de uma lista comum.",
  question: "Por que o deque é mais indicado para implementar filas do que uma lista comum?",
  options: [
    "Porque popleft() e append() são O(1) em ambas as extremidades do deque",
    "Porque deque não permite elementos repetidos, como um conjunto",
    "Porque deque ordena os elementos automaticamente por valor",
    "Porque listas comuns não podem armazenar strings"
  ],
  answer: 0,
  feedback: "O deque foi otimizado para inserções e remoções rápidas em ambas as extremidades, ao contrário da lista comum."
},

// 6 - Pilha para desfazer ações
{
  aula: "Capítulo 6 - Pilhas e Filas",
  tipo: "Aplicação",
  texto: "Um editor de texto precisa implementar a funcionalidade 'Desfazer' (Ctrl+Z), de forma que a última ação realizada seja sempre a primeira a ser desfeita.",
  question: "Qual estrutura de dados é mais adequada para implementar essa funcionalidade?",
  options: [
    "Fila, pois segue a ordem de chegada das ações",
    "Pilha, pois a última ação inserida é a primeira a ser removida (LIFO)",
    "Dicionário, pois cada ação tem uma chave única",
    "Conjunto, pois evita ações repetidas"
  ],
  answer: 1,
  feedback: "O comportamento LIFO da pilha é exatamente o que se espera do 'Desfazer': a última ação é a primeira a ser revertida."
},

// 7 - Trace de operações em pilha
{
  aula: "Capítulo 6 - Pilhas e Filas",
  tipo: "Código",
  texto: "Considere o trecho de código a seguir, que manipula uma pilha implementada com lista.",
  question: "Qual será a saída impressa por esse código, na ordem em que aparece?",
  code: `pilha = []\npilha.append(1)\npilha.append(2)\npilha.append(3)\nprint(pilha.pop())\nprint(pilha.pop())\nprint(pilha)`,
  options: [
    "1, 2, [3]",
    "3, 2, [1]",
    "1, 2, [3, 2, 1]",
    "3, 1, [2]"
  ],
  answer: 1,
  feedback: "pop() remove sempre o último elemento inserido: primeiro sai o 3, depois o 2, restando apenas o 1 na pilha."
},

// 8 - Pilha de execução de funções
{
  aula: "Capítulo 6 - Pilhas e Filas",
  tipo: "Direta",
  texto: "Toda vez que uma função é chamada, incluindo em recursão, o Python guarda informações sobre essa chamada em uma estrutura de memória interna.",
  question: "Qual é o nome dessa estrutura, que segue o mesmo princípio de uma pilha (LIFO)?",
  options: [
    "Fila de execução",
    "Árvore de chamadas",
    "Tabela hash de funções",
    "Pilha de execução (call stack)"
  ],
  answer: 3,
  feedback: "As chamadas de função ficam guardadas na pilha de execução (call stack), que segue o comportamento LIFO."
},

// 9 - Parênteses balanceados
{
  aula: "Capítulo 6 - Pilhas e Filas",
  tipo: "Contexto",
  texto: "Um algoritmo verifica se uma expressão matemática tem parênteses balanceados, empilhando cada '(' encontrado e removendo um elemento da pilha a cada ')' encontrado.",
  question: "O que indica que a expressão NÃO está balanceada, segundo essa lógica?",
  options: [
    "A pilha ficar vazia ou não vazia ao final, ou tentar remover de uma pilha já vazia durante o processo",
    "A pilha nunca poder ficar vazia durante a execução",
    "O algoritmo sempre retornar True, independentemente do resultado",
    "A expressão conter apenas letras, sem números"
  ],
  answer: 0,
  feedback: "Se sobrar algo na pilha ao final, ou se tentar remover de uma pilha vazia (fechamento sem abertura), a expressão não está balanceada."
},

// 10 - Fila em BFS
{
  aula: "Capítulo 6 - Pilhas e Filas",
  tipo: "Aplicação",
  texto: "Um algoritmo de busca em largura (BFS) precisa visitar os vizinhos de um nó na ordem em que foram descobertos, processando primeiro os nós mais antigos na lista de pendências.",
  question: "Qual estrutura de dados é normalmente utilizada para controlar a ordem de visita nesse tipo de algoritmo?",
  options: [
    "Pilha, pois é mais rápida para qualquer tipo de busca",
    "Fila, pois segue a ordem FIFO, adequada para processar nós na ordem de descoberta",
    "Conjunto, pois evita visitar o mesmo nó duas vezes, e isso já resolve o problema de ordem",
    "Dicionário, pois permite acesso direto por chave"
  ],
  answer: 1,
  feedback: "A busca em largura (BFS) usa uma fila para garantir que os nós sejam processados na ordem em que foram descobertos (FIFO)."
},

// 61 - Definição do Bubble Sort
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Direta",
  texto: "O Bubble Sort é um dos algoritmos de ordenação mais simples de entender.",
  question: "Qual é a principal característica do Bubble Sort?",
  options: [
    "Ele divide a lista pela metade repetidamente",
    "Ele compara elementos vizinhos e os troca quando estão fora de ordem",
    "Ele sempre insere o elemento na posição correta usando busca binária",
    "Ele escolhe aleatoriamente pares de elementos para comparar"
  ],
  answer: 1,
  feedback: "O Bubble Sort percorre a lista repetidamente comparando pares de elementos adjacentes e trocando-os quando necessário, fazendo o maior valor \"borbulhar\" até o final."
},

// 62 - Número de trocas do Selection Sort
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Contexto",
  texto: "No Selection Sort, cada passagem busca o menor elemento entre os que ainda não foram posicionados corretamente.",
  question: "Quantas trocas, no máximo, o Selection Sort realiza em cada passagem?",
  options: [
    "Nenhuma, ele apenas reorganiza por comparação sem trocar",
    "Uma, feita somente depois de encontrar o menor elemento restante",
    "Uma para cada par de elementos comparado",
    "Depende do tamanho da lista, sem limite fixo"
  ],
  answer: 1,
  feedback: "O Selection Sort varre toda a parte não ordenada em busca do menor valor e realiza, no máximo, uma única troca por passagem para posicioná-lo corretamente."
},

// 63 - Melhor caso do Insertion Sort
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Direta",
  texto: "O Insertion Sort insere cada elemento na posição correta dentro da parte já ordenada da lista.",
  question: "Qual é a complexidade do Insertion Sort no melhor caso, quando a lista já está ordenada?",
  options: [
    "O(1)",
    "O(n)",
    "O(n log n)",
    "O(n²)"
  ],
  answer: 1,
  feedback: "Quando a lista já está ordenada, o Insertion Sort não precisa deslocar elementos, percorrendo-a apenas uma vez — o que resulta em complexidade O(n)."
},

// 64 - Estratégia do Merge Sort
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Contexto",
  texto: "O Merge Sort segue a estratégia de dividir para conquistar, quebrando o problema original em partes menores.",
  question: "Como o Merge Sort organiza a lista antes de começar a comparar elementos?",
  options: [
    "Ele percorre a lista trocando elementos vizinhos repetidamente",
    "Ele divide a lista repetidamente ao meio até restarem listas de um único elemento",
    "Ele seleciona o menor elemento da lista inteira a cada rodada",
    "Ele mantém a lista original intacta e cria apenas uma cópia ordenada"
  ],
  answer: 1,
  feedback: "Antes de comparar qualquer elemento, o Merge Sort divide a lista repetidamente ao meio, até chegar a listas de um único elemento, para só então mesclá-las em ordem."
},

// 65 - Complexidade do Merge Sort
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Direta",
  texto: "Diferente dos outros três algoritmos estudados, o Merge Sort mantém a mesma complexidade em qualquer cenário.",
  question: "Qual é a complexidade do Merge Sort tanto no melhor quanto no pior caso?",
  options: [
    "O(n)",
    "O(n²)",
    "O(n log n)",
    "O(2ⁿ)"
  ],
  answer: 2,
  feedback: "Graças à divisão pela metade (log n) combinada com o custo de mesclar as partes (n), o Merge Sort mantém O(n log n) tanto no melhor quanto no pior caso."
},

// 66 - Aplicação: escolha para dados aleatórios grandes
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Aplicação",
  texto: "Um sistema precisa ordenar centenas de milhares de registros que chegam em ordem totalmente aleatória, sem nenhuma organização prévia.",
  question: "Entre os algoritmos estudados, qual tende a apresentar o desempenho mais previsível nesse cenário?",
  options: [
    "Bubble Sort, por ser o mais simples de implementar",
    "Insertion Sort, pois seu melhor caso é O(n)",
    "Merge Sort, pois garante O(n log n) mesmo no pior caso",
    "Selection Sort, pois realiza poucas trocas"
  ],
  answer: 2,
  feedback: "Como os dados não têm nenhuma ordem prévia, o melhor caso do Insertion Sort não se aplica, e o Merge Sort é o único que garante desempenho previsível (O(n log n)) independentemente da ordem inicial."
},

// 67 - Aplicação: lista quase ordenada
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Aplicação",
  texto: "Uma planilha de notas é atualizada diariamente, mas costuma ter apenas um ou dois valores fora de posição em relação ao dia anterior.",
  question: "Nesse cenário de lista quase ordenada, qual algoritmo tende a ser mais eficiente?",
  options: [
    "Bubble Sort, pois sempre percorre a lista inteira, independentemente da ordem",
    "Selection Sort, pois busca o menor elemento em cada passagem",
    "Insertion Sort, pois se aproxima do seu melhor caso O(n) quando a lista já está quase ordenada",
    "Merge Sort, pois divide a lista pela metade em qualquer situação"
  ],
  answer: 2,
  feedback: "O Insertion Sort é o único dos quatro cujo melhor caso é O(n), e isso ocorre justamente quando a lista já está (quase) ordenada, exigindo poucos deslocamentos."
},

// 68 - Desvantagem do Merge Sort
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Contexto",
  texto: "Apesar de eficiente em tempo de execução, o Merge Sort não é a escolha ideal em todos os cenários.",
  question: "Qual é a principal desvantagem do Merge Sort em relação aos outros três algoritmos estudados?",
  options: [
    "Ele tem complexidade pior no pior caso",
    "Ele precisa de memória extra para as listas temporárias criadas durante a mesclagem",
    "Ele não funciona corretamente em listas com números repetidos",
    "Ele exige que a lista já esteja parcialmente ordenada"
  ],
  answer: 1,
  feedback: "O Merge Sort precisa criar listas temporárias durante a fase de mesclagem, o que aumenta o consumo de memória — um trade-off importante frente aos outros algoritmos, que não usam memória extra."
},

// 69 - Diferença entre Bubble e Selection Sort
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Direta",
  texto: "Bubble Sort e Selection Sort têm a mesma complexidade O(n²), mas se comportam de formas diferentes.",
  question: "Qual é a principal diferença prática entre o Bubble Sort e o Selection Sort?",
  options: [
    "O Selection Sort nunca faz trocas, apenas comparações",
    "O Bubble Sort pode realizar várias trocas em uma única passagem, enquanto o Selection Sort faz no máximo uma",
    "O Bubble Sort é mais rápido em qualquer cenário, independentemente do tamanho da lista",
    "O Selection Sort compara apenas o primeiro e o último elemento da lista"
  ],
  answer: 1,
  feedback: "Mesmo com o mesmo Big O, o Bubble Sort troca pares de vizinhos sempre que estão fora de ordem, enquanto o Selection Sort só troca uma vez por passagem, depois de encontrar o menor elemento restante."
},

// 70 - Comparações do Bubble Sort
{
  aula: "Capítulo 7 — Algoritmos de Ordenação (Parte 1)",
  tipo: "Direta",
  texto: "Uma dúvida comum é sobre quais elementos o Bubble Sort de fato compara durante sua execução.",
  question: "Em cada comparação realizada pelo Bubble Sort, quais elementos são analisados?",
  options: [
    "Sempre o primeiro e o último elemento da lista",
    "Elementos escolhidos aleatoriamente entre a lista",
    "Apenas elementos em posições adjacentes (vizinhas)",
    "O menor e o maior elemento encontrados até o momento"
  ],
  answer: 2,
  feedback: "O Bubble Sort compara exclusivamente elementos em posições vizinhas, nunca elementos distantes entre si, avançando pela lista uma comparação por vez."
},

// 71 - Definição de memoização
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Direta",
  texto: "Memoização é uma técnica usada para tornar funções recursivas mais eficientes.",
  question: "O que é memoização?",
  options: [
    "Uma técnica que transforma qualquer função recursiva em iterativa",
    "Uma técnica que guarda resultados já calculados para evitar recálculos futuros",
    "Uma técnica que reduz o número de parâmetros de uma função",
    "Uma técnica exclusiva para ordenação de listas"
  ],
  answer: 1,
  feedback: "Memoização consiste em cachear (guardar) o resultado de chamadas já calculadas, retornando o valor salvo em vez de recalcular quando a mesma entrada aparece novamente."
},

// 72 - Complexidade do Fibonacci sem memoização
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Contexto",
  texto: "A versão recursiva simples do Fibonacci recalcula os mesmos valores diversas vezes durante sua execução.",
  question: "Qual é a complexidade do Fibonacci recursivo simples, sem memoização?",
  options: [
    "O(n)",
    "O(n log n)",
    "O(n²)",
    "O(2ⁿ)"
  ],
  answer: 3,
  feedback: "Sem memoização, a árvore de chamadas do Fibonacci cresce exponencialmente, já que os mesmos valores são recalculados repetidamente — resultando em complexidade O(2ⁿ)."
},

// 73 - Código: cache manual do Fibonacci
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Código",
  texto: "Observe a implementação manual de memoização abaixo, usando um dicionário como cache.",
  question: "O que a linha `if n in cache: return cache[n]` faz nessa função?",
  code: `def fibonacci_memo(n, cache={}):
    if n in cache:
        return cache[n]
    if n <= 1:
        return n
    resultado = fibonacci_memo(n - 1, cache) + fibonacci_memo(n - 2, cache)
    cache[n] = resultado
    return resultado`,
  options: [
    "Verifica se n é menor que zero e interrompe a execução",
    "Verifica se o resultado para aquele n já foi calculado antes e, se sim, o retorna direto do cache",
    "Adiciona um novo valor ao cache antes de qualquer cálculo",
    "Reinicia o cache sempre que a função é chamada"
  ],
  answer: 1,
  feedback: "Essa verificação evita recálculos: se o valor de n já estiver no dicionário cache, a função retorna o resultado salvo imediatamente, sem fazer novas chamadas recursivas."
},

// 74 - lru_cache
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Direta",
  texto: "Python oferece um decorador pronto para aplicar memoização sem precisar criar um dicionário manualmente.",
  question: "Qual é o nome do decorador do módulo functools usado para aplicar memoização automática?",
  options: [
    "@cache_memo",
    "@auto_cache",
    "@lru_cache",
    "@fast_cache"
  ],
  answer: 2,
  feedback: "O decorador @lru_cache, do módulo functools, adiciona automaticamente o comportamento de cache a uma função, sem precisar implementar a lógica manualmente."
},

// 75 - Aplicação: sistema que recalcula Fibonacci repetidamente
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Aplicação",
  texto: "Um sistema chama a função fibonacci(35) diversas vezes durante sua execução, em módulos diferentes, sem nenhum tipo de cache implementado.",
  question: "Qual seria a melhor estratégia para melhorar o desempenho desse sistema?",
  options: [
    "Substituir o Fibonacci pelo cálculo do fatorial",
    "Aplicar memoização à função, já que os mesmos valores de n são recalculados repetidamente",
    "Remover o caso base da função para simplificar o código",
    "Aumentar o valor de n para reduzir o número de chamadas"
  ],
  answer: 1,
  feedback: "Como os mesmos valores de n são recalculados repetidamente entre os módulos, aplicar memoização evita que o trabalho já feito seja refeito, reduzindo bastante o tempo de execução."
},

// 76 - Fatorial e memoização
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Contexto",
  texto: "No cálculo do fatorial(n), cada chamada recursiva utiliza um valor de n diferente, que nunca se repete dentro da mesma execução.",
  question: "Por que aplicar memoização ao fatorial não traz ganho de desempenho?",
  options: [
    "Porque o fatorial não pode ser implementado de forma recursiva",
    "Porque não há chamadas repetidas com o mesmo argumento para o cache reaproveitar",
    "Porque o Python não permite usar dicionários em funções recursivas",
    "Porque o fatorial já tem complexidade O(1)"
  ],
  answer: 1,
  feedback: "Memoização só traz ganho quando há chamadas repetidas com os mesmos argumentos. Como cada n do fatorial aparece uma única vez, o cache nunca é reaproveitado."
},

// 77 - Impacto na complexidade
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Direta",
  texto: "A memoização muda significativamente a complexidade do Fibonacci recursivo.",
  question: "Qual é a complexidade do Fibonacci recursivo depois de aplicar memoização?",
  options: [
    "O(1)",
    "O(n)",
    "O(n²)",
    "O(2ⁿ)"
  ],
  answer: 1,
  feedback: "Com memoização, cada valor de n é calculado apenas uma vez, e as chamadas repetidas são resolvidas em O(1) via cache, resultando em complexidade total O(n)."
},

// 78 - Código: esquecer de salvar no cache
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Código",
  texto: "Veja a função abaixo, onde a linha responsável por salvar o resultado no cache foi removida por engano.",
  question: "Qual será o efeito prático dessa função em relação à memoização?",
  code: `def fibonacci_memo(n, cache={}):
    if n in cache:
        return cache[n]
    if n <= 1:
        return n
    resultado = fibonacci_memo(n - 1, cache) + fibonacci_memo(n - 2, cache)
    return resultado`,
  options: [
    "A função continuará funcionando normalmente, pois o cache é preenchido automaticamente",
    "A função vai gerar um erro de execução por causa da linha ausente",
    "A função nunca vai armazenar resultados no cache, então continuará recalculando tudo a cada chamada",
    "A função vai retornar resultados incorretos para valores pares de n"
  ],
  answer: 2,
  feedback: "Sem a linha `cache[n] = resultado`, nenhum valor é salvo no dicionário, então a verificação `if n in cache` nunca encontra nada — a função perde totalmente o benefício da memoização."
},

// 79 - Trade-off da memoização
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Contexto",
  texto: "A memoização traz ganhos de desempenho, mas não é uma otimização totalmente gratuita.",
  question: "Qual é o principal custo (trade-off) de aplicar memoização em uma função?",
  options: [
    "Perda de precisão nos resultados calculados",
    "Aumento no consumo de memória, usada para armazenar o cache",
    "Impossibilidade de usar a função de forma recursiva",
    "Redução da legibilidade do código, sem nenhum outro impacto"
  ],
  answer: 1,
  feedback: "A memoização troca tempo de processamento por memória extra: o algoritmo fica mais rápido, mas passa a consumir mais espaço para guardar os resultados já calculados."
},

// 80 - Aplicação: função sem repetição de argumentos
{
  aula: "Capítulo 8 — Memoização",
  tipo: "Aplicação",
  texto: "Uma função recursiva percorre uma lista de pedidos de um sistema de e-commerce, processando cada item por meio de um índice que sempre aumenta, nunca revisitando um índice já processado.",
  question: "Faz sentido aplicar memoização a essa função?",
  options: [
    "Sim, pois toda função recursiva se beneficia automaticamente de memoização",
    "Não, pois como cada índice é processado uma única vez, não há chamadas repetidas para o cache aproveitar",
    "Sim, mas apenas se a lista tiver mais de mil pedidos",
    "Não, pois memoização só pode ser usada em cálculos matemáticos"
  ],
  answer: 1,
  feedback: "Assim como no fatorial, quando não há repetição de argumentos dentro da mesma execução, o cache nunca é reaproveitado, e a memoização não traz nenhum ganho real de desempenho."
}
],


};