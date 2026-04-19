// ============================================================
// NEXUS STUDY — quiz/conteudo/2026/2026.1/ques_poo.js
// Programação Orientada a Objetos — Questões 2026.1
// Convertido do formato v1 para v2
// ============================================================

window.questoes = {

  // ── Questões de Aula (Aulas 1–8) ─────────────────────────

  questoes: [

    // ── Aula 1 — Introdução e Ferramentas ────────────────────

    {
      aula: "Aula 1 — Introdução e Ferramentas",
      tipo: "Contextualizada",
      texto: "Uma equipe de desenvolvedores está migrando um sistema procedural legado para o paradigma de Orientação a Objetos. No sistema antigo, os dados dos clientes (nome, CPF, saldo) ficam armazenados em variáveis globais separadas, e as funções que operam sobre esses dados estão dispersas pelo código.",
      question: "Qual é o principal benefício arquitetural esperado após a migração para POO?",
      options: [
        "O código se torna mais lento, pois criar objetos consome mais memória do que variáveis simples.",
        "Os dados e os comportamentos relacionados passam a ser agrupados em unidades coesas chamadas objetos, reduzindo o acoplamento e facilitando a manutenção.",
        "A POO elimina completamente a necessidade de funções, substituindo-as por variáveis globais mais organizadas.",
        "O paradigma orientado a objetos exige que todos os métodos sejam públicos, aumentando a acessibilidade do sistema.",
        "A migração para POO garante automaticamente que o código seja executado mais rápido pelo processador."
      ],
      answer: 1,
      feedback: "A POO une ==key==dados (atributos)== e ==key==comportamentos (métodos)== em objetos coesos. Isso promove menor acoplamento entre os módulos, maior coesão interna e facilita a evolução do sistema sem quebrar outras partes."
    },

    {
      aula: "Aula 1 — Introdução e Ferramentas",
      tipo: "Contextualizada",
      texto: "Um arquiteto de software analisa um sistema procedural onde os dados de clientes (arrays de strings e inteiros) estão separados das funções que calculam descontos. Ele propõe a transição para POO para mitigar a baixa confiabilidade e o alto custo de evolução.",
      question: "Ao projetar a classe <code>Cliente</code> sob o paradigma de Orientação a Objetos, qual implicação arquitetural é esperada?",
      options: [
        "Aumento do acoplamento entre os módulos de cálculo e os dados do cliente.",
        "Separação rigorosa entre o estado (conhecimento) e o comportamento (serviços) do cliente.",
        "Unificação de dados (atributos) e funções (métodos) em unidades coesas chamadas objetos, promovendo acoplamento mais fraco entre componentes independentes.",
        "Eliminação completa da necessidade de abstração, focando apenas em detalhes irrelevantes de implementação.",
        "Uso exclusivo de lógica linear sequencial para garantir que o estado interno não seja alterado."
      ],
      answer: 2,
      feedback: "A POO unifica ==key==dados e funções em objetos==, resultando em maior coesão e ==mark==acoplamento mais fraco== entre módulos. As outras opções contradizem os princípios básicos de POO ou as motivações de design descritas nas fontes."
    },

    {
      aula: "Aula 1 — Introdução e Ferramentas",
      tipo: "Contextualizada",
      texto: "Uma desenvolvedora está criando um sistema de biblioteca digital para gerenciamento de acervo. Ela modela a classe <code>Livro</code> com os atributos <code>titulo</code>, <code>autor</code> e <code>numeroDePaginas</code>, e os métodos <code>abrir()</code>, <code>fechar()</code> e <code>exibirDetalhes()</code>.",
      question: "Na anatomia desta classe, o que os atributos e os métodos representam, respectivamente, dentro do paradigma de Orientação a Objetos?",
      options: [
        "Os comportamentos do objeto e os dados fixos que nunca mudam.",
        "As ações que o objeto realiza e as variáveis que definem seu estado interno.",
        "O estado interno (o que o objeto conhece/é) e os comportamentos/serviços (o que o objeto faz).",
        "Sequências lineares de instruções e a ocultação total de informações do sistema.",
        "As dependências externas do objeto e os métodos de acesso à memória."
      ],
      answer: 2,
      feedback: "==key==Atributos== representam o estado do objeto — o que ele conhece ou é (ex: título, autor). ==key==Métodos== representam o comportamento — o que o objeto sabe fazer (ex: exibirDetalhes). A alternativa B inverte esses conceitos."
    },

    {
      aula: "Aula 1 — Introdução e Ferramentas",
      tipo: "Contextualizada",
      texto: "Em um sistema de Gestão Hospitalar, a equipe de desenvolvimento modela a classe <code>Paciente</code> para monitoramento em tempo real. A classe possui os atributos <code>registroGeral</code> e <code>frequenciaCardiaca</code>, além de métodos que processam e exibem os dados coletados pelos sensores.",
      question: "Na anatomia desta classe, o que os atributos e métodos representam, respectivamente?",
      options: [
        "Comportamentos essenciais e estados internos fixos.",
        "Serviços que o objeto faz e as variáveis que definem sua condição (dados que o objeto conhece).",
        "O estado interno (conhecimento do objeto) e os comportamentos/serviços (ações que o objeto faz).",
        "Sequências lineares de instruções e a ocultação total de informações.",
        "A variável de configuração e o protocolo de integridade de dados."
      ],
      answer: 2,
      feedback: "==key==Atributos== representam o estado (o que o objeto conhece) e ==key==métodos== representam o comportamento (o que o objeto faz). A alternativa B inverte os conceitos."
    },

    {
      aula: "Aula 1 — Introdução e Ferramentas",
      tipo: "Análise de Código",
      texto: "Durante o onboarding de novos desenvolvedores em uma empresa de software, o time técnico apresenta o seguinte trecho de código como exemplo de estrutura básica em Java:",
      miniEnunciado: "Analise a estrutura da classe e o método apresentados:",
      code:
`public class Principal {
    public static void main(String[] args) {
        int releaseAmbiente = 17;
        if (releaseAmbiente >= 17) {
            System.out.println("Ambiente em conformidade técnica.");
        }
    }
}`,
      question: "Sobre a estrutura desta classe e o método <code>main</code>, é correto afirmar que:",
      options: [
        "O nome do arquivo físico não precisa coincidir com o identificador da classe <code>Principal</code>.",
        "O parâmetro <code>String[] args</code> é obrigatório para que a JVM localize o ponto de entrada, mas seu conteúdo vem apenas de variáveis de ambiente.",
        "O modificador <code>static</code> permite que o método seja invocado pela JVM sem a necessidade de instanciar a classe <code>Principal</code>.",
        "A variável <code>releaseAmbiente</code> possui tipagem dinâmica, podendo mudar de <code>int</code> para <code>String</code> posteriormente.",
        "O <code>System.out.println</code> é um componente de versionamento que sinaliza alterações no código."
      ],
      answer: 2,
      feedback: "O método ==key==main== é o ponto de entrada do programa e o modificador ==key==static== permite sua execução sem que seja necessário criar uma instância da classe. A alternativa A está errada conforme as convenções de nomenclatura. D está incorreta pois Java usa ==mark==tipagem estática e forte==."
    },

    // ── Aula 2 — Sintaxe, Tipagem e Estruturas de Controle ───

    {
      aula: "Aula 2 — Sintaxe, Tipagem e Estruturas de Controle",
      tipo: "Contextualizada",
      texto: "Um desenvolvedor de uma fintech está implementando um módulo de câmbio internacional. Durante o processamento, os valores monetários são calculados com precisão decimal usando o tipo <code>double</code>. Para uma etapa específica de auditoria, o sistema precisa trabalhar apenas com centavos inteiros, descartando as casas decimais.",
      question: "Qual técnica de conversão deve ser utilizada e qual o risco associado?",
      options: [
        "Promoção Implícita; risco de NullPointerException.",
        "Casting Explícito; risco de perda de informação (a parte decimal é descartada).",
        "Inferência de Tipo com <code>var</code>; risco de erro em tempo de execução.",
        "Divisão Inteira automática; risco de estouro de memória Stack.",
        "Comparação por <code>==</code>; risco de identidade de objeto."
      ],
      answer: 1,
      feedback: "O ==key==casting explícito== é necessário para converter um tipo maior (<code>double</code>) em um menor (<code>int</code>), e o programador assume o risco da ==mark==perda da parte decimal==."
    },

    {
      aula: "Aula 2 — Sintaxe, Tipagem e Estruturas de Controle",
      tipo: "Análise de Código",
      texto: "Uma plataforma de ensino online implementa um módulo de controle de acesso. O trecho a seguir gerencia o status de uma conta de usuário e verifica se ele está ativo antes de persistir dados:",
      miniEnunciado: "Analise o código e as afirmações a seguir:",
      code:
`String status = (nota >= 7) ? "Aprovado" : "Reprovado"; // Linha 1
if (usuario != null && usuario.isAtivo()) { salvar(); }   // Linha 2`,
      assertions: [
        "A Linha 1 utiliza um Operador Ternário, uma forma condensada de if-else que retorna valor.",
        "A Linha 2 utiliza curto-circuito com o operador &&; se usuario for nulo, a segunda parte não é testada, evitando erro.",
        "O uso de var na Linha 1 tornaria a tipagem fraca."
      ],
      question: "Está(ão) correta(s):",
      options: [
        "Apenas I está correta.",
        "Apenas II está correta.",
        "I e II estão corretas.",
        "II e III estão corretas.",
        "Todas estão corretas."
      ],
      answer: 2,
      feedback: "A afirmação III está incorreta porque o ==key==var== mantém a ==mark==tipagem forte==, apenas deduz o tipo no momento da atribuição. I e II descrevem corretamente o ==key==operador ternário== e o ==key==curto-circuito==."
    },

    {
      aula: "Aula 2 — Sintaxe, Tipagem e Estruturas de Controle",
      tipo: "Contextualizada",
      texto: "Em um sistema de e-commerce, ao finalizar uma compra, o cliente digita um cupom de desconto. O sistema precisa verificar se o texto digitado (\"NATAL10\") corresponde ao cupom cadastrado no banco de dados, que também é uma String de mesmo conteúdo, mas criada em contexto diferente.",
      question: "Qual a forma correta e segura de realizar essa comparação em Java?",
      options: [
        "<code>if (cupomDigitado == cupomCadastrado)</code> pois o String Pool garante o mesmo endereço.",
        "<code>if (cupomDigitado.equals(cupomCadastrado))</code> pois verifica o conteúdo do texto letra por letra.",
        "<code>if (cupomDigitado.compare(cupomCadastrado))</code> para evitar NullPointerException.",
        "Usando o operador <code>!=</code> para verificar a imutabilidade do objeto na Heap.",
        "Atribuindo <code>var resultado = cupomDigitado</code> e comparando na memória Stack."
      ],
      answer: 1,
      feedback: "O operador ==key====== compara endereços de memória. Para comparar conteúdo de Strings, deve-se usar ==key==.equals()==."
    },

    {
      aula: "Aula 2 — Sintaxe, Tipagem e Estruturas de Controle",
      tipo: "Análise de Código",
      texto: "Um sistema de monitoramento térmico industrial coleta leituras de sensores de temperatura e classifica o ambiente automaticamente. O trecho abaixo foi implementado utilizando a sintaxe moderna do Java:",
      miniEnunciado: "Observe a sintaxe moderna de switch utilizada:",
      code:
`String tipo = switch (temperatura) {
    case 0, 10 -> "Frio";
    case 20, 30 -> "Agradável";
    default -> "Quente";
};`,
      question: "Esta sintaxe, introduzida no Java moderno (Java 14+), oferece qual vantagem técnica em relação ao <code>switch</code> tradicional?",
      options: [
        "Permite o uso de tipos primitivos como <code>long</code> e <code>float</code> nos casos.",
        "Elimina a necessidade de <code>break</code> repetitivos e pode retornar valores diretamente (Arrow Syntax).",
        "Garante que a variável <code>tipo</code> seja armazenada na memória Stack em vez da Heap.",
        "Funciona como uma \"Guard Clause\", retornando imediatamente para o método chamador.",
        "Permite o sombreamento (shadowing) de atributos da classe dentro dos casos."
      ],
      answer: 1,
      feedback: "O ==key==switch moderno com Arrow Syntax== é mais conciso, evita o erro comum de esquecer o ==mark==break== e permite ==mark==atribuição direta== de valor."
    },

    {
      aula: "Aula 2 — Sintaxe, Tipagem e Estruturas de Controle",
      tipo: "Contextualizada",
      texto: "Durante uma revisão de código em uma startup de tecnologia, o tech lead identifica um problema no módulo de cadastro de usuários. Um desenvolvedor júnior declarou <code>int x;</code> dentro de um bloco <code>if</code> e tentou imprimir o valor de <code>x</code> fora desse bloco. O compilador apontou erro antes mesmo da execução.",
      question: "Qual o conceito de gerenciamento de variáveis justifica o erro de compilação?",
      options: [
        "Variáveis locais (de método ou bloco) não recebem valor padrão e seu escopo limita-se às chaves <code>{ }</code> onde foram criadas.",
        "Ocorreu um NullPointerException pois tipos primitivos são sempre referências na Stack.",
        "O Java identificou um Shadowing (sombreamento), impedindo a leitura do atributo da classe.",
        "A variável deveria ter sido declarada com <code>var</code> para ter escopo global.",
        "O Garbage Collector removeu a variável da Heap antes da impressão."
      ],
      answer: 0,
      feedback: "Variáveis de bloco ==key==nascem e morrem dentro das chaves==, e ==mark==variáveis locais não são inicializadas automaticamente== com zero ou nulo."
    },

    // ── Aula 3 — Métodos e Encapsulamento ────────────────────

    {
      aula: "Aula 3 — Métodos e Encapsulamento",
      tipo: "Contextualizada",
      texto: "Um sistema de folha de pagamento de uma grande empresa possui a classe <code>Funcionario</code>. Durante os testes de integração, a equipe identificou que valores negativos de salário estavam sendo persistidos no banco de dados por erro de entrada. O arquiteto determinou que o estado do objeto deve ser protegido contra modificações externas inválidas.",
      question: "Qual pilar da POO e quais ferramentas técnicas devem ser aplicados para resolver esse problema?",
      options: [
        "Herança e modificador <code>protected</code>.",
        "Polimorfismo e sobrescrita de métodos.",
        "Encapsulamento, utilizando atributos <code>private</code> e métodos <code>setter</code> com validação lógica.",
        "Abstração, definindo uma interface <code>Pagável</code>.",
        "Sobrecarga de construtores com a palavra-chave <code>static</code>."
      ],
      answer: 2,
      feedback: "O ==key==encapsulamento== protege os dados. Atributos ==key==private== e métodos ==mark==set com validação== permitem impedir valores inválidos (ex: salário negativo) antes de gravá-los."
    },

    {
      aula: "Aula 3 — Métodos e Encapsulamento",
      tipo: "Análise de Código",
      texto: "Em um sistema de gestão de usuários, o desenvolvedor implementa o método abaixo para atualizar dados de um cadastro. O método recebe um tipo primitivo e um objeto como parâmetros:",
      miniEnunciado: "Analise o método e o comportamento da passagem de parâmetros:",
      code:
`public void atualizar(int idade, Usuario user) {
    idade = 30;
    user.setNome("Ana");
}`,
      question: "O método é chamado passando a variável <code>int i = 20</code> e um objeto <code>Usuario u</code> com nome \"José\". Após a execução do método, quais serão os valores de <code>i</code> e do nome em <code>u</code> no código chamador?",
      options: [
        "<code>i</code> será 30 e o nome será \"Ana\".",
        "<code>i</code> será 20 e o nome será \"José\".",
        "<code>i</code> será 20 e o nome será \"Ana\".",
        "O código não compila por causa da tipagem forte.",
        "Ambos causarão um erro de <code>shadowing</code>."
      ],
      answer: 2,
      feedback: "Em Java, a passagem é ==key==por valor==. Para ==mark==primitivos==, o método recebe uma cópia (não altera o original). Para ==mark==objetos==, recebe uma cópia da referência, permitindo alterar o estado do objeto apontado."
    },

    {
      aula: "Aula 3 — Métodos e Encapsulamento",
      tipo: "Contextualizada",
      texto: "Uma biblioteca de manipulação de imagens para aplicações mobile é desenvolvida por uma equipe. Para facilitar o uso da API pelos desenvolvedores clientes, o time decide oferecer flexibilidade no método de redimensionamento: um aceita dois inteiros (largura, altura), outro aceita um <code>double</code> (fator de escala) e um terceiro aceita um objeto <code>Dimensoes</code>. Todos os três se chamam <code>redimensionar()</code>.",
      question: "Este cenário exemplifica qual conceito de POO e qual seu benefício?",
      options: [
        "Sobrescrita (Override); permite mudar o comportamento da classe pai.",
        "Encapsulamento; esconde a implementação do redimensionamento.",
        "Sobrecarga (Overloading); permite criar métodos com mesmo nome, diferenciados pela assinatura (parâmetros), facilitando o uso da API.",
        "Polimorfismo dinâmico; decide em tempo de execução qual método chamar.",
        "Acoplamento rígido; garante que o estado seja imutável."
      ],
      answer: 2,
      feedback: "==key==Sobrecarga (Overloading)== é a criação de métodos com mesmo nome e ==mark==parâmetros diferentes== dentro da mesma classe, resolvida em tempo de compilação."
    },

    {
      aula: "Aula 3 — Métodos e Encapsulamento",
      tipo: "Contextualizada",
      texto: "Um desenvolvedor está criando a classe <code>Produto</code> para um sistema de estoque, seguindo o padrão JavaBean adotado pela equipe. Ele define o atributo <code>private double preco</code> e, conforme as boas práticas do padrão, precisa expor esse valor para leitura por outros módulos do sistema.",
      question: "Seguindo a convenção de nomes Java, como deve ser a assinatura do método de leitura?",
      options: [
        "<code>public double preco()</code>",
        "<code>public void setPreco(double p)</code>",
        "<code>public double getPreco()</code>",
        "<code>private double readPreco()</code>",
        "<code>public boolean isPreco()</code>"
      ],
      answer: 2,
      feedback: "A convenção ==key==JavaBean== dita o uso de ==key==get== seguido do nome do atributo com a primeira letra maiúscula para leitura. Para escrita usa-se ==mark==set==, e para booleanos, ==mark==is==."
    },

    {
      aula: "Aula 3 — Métodos e Encapsulamento",
      tipo: "Análise de Código",
      texto: "Em um sistema bancário de alto volume de transações, o método <code>transferir</code> da classe <code>Conta</code> é responsável por mover valores entre contas de forma segura.",
      miniEnunciado: "Analise a implementação do método a seguir:",
      code:
`public void transferir(double valor, Conta destino) {
    if (this.saldo >= valor) {
        this.sacar(valor);
        destino.depositar(valor);
    }
}`,
      question: "Qual a função técnica da palavra-chave <code>this</code> utilizada neste contexto?",
      options: [
        "Invocar o Garbage Collector para limpar o saldo.",
        "Referenciar o objeto atual da instância, diferenciando atributos de variáveis locais e permitindo chamadas de métodos internos.",
        "Tornar o método acessível de forma estática sem o operador <code>new</code>.",
        "Garantir que a transferência seja realizada apenas entre classes do mesmo pacote.",
        "Atuar como um \"decorator\" de propriedade, similar ao <code>@property</code> do Python."
      ],
      answer: 1,
      feedback: "==key==this== refere-se ao ==mark==objeto atual==. É usado para desambiguidade e clareza ao acessar membros da própria instância, diferenciando atributos de variáveis locais com mesmo nome."
    },

    // ── Aula 4 — Construtores, Membros Estáticos e Herança ───

    {
      aula: "Aula 4 — Construtores, Membros Estáticos e Herança",
      tipo: "Contextualizada",
      texto: "No desenvolvimento de um RPG multiplayer online, a equipe de backend modela os personagens jogáveis. A classe <code>Personagem</code> possui atributos como <code>nome</code> e <code>nivel</code>. Os designers de jogo definem que todo herói recém-criado deve iniciar obrigatoriamente no nível 1, garantindo o balanceamento.",
      question: "Qual estrutura de código garante que o objeto nasça com este estado válido?",
      options: [
        "Um método estático chamado <code>main</code>.",
        "Um construtor com a assinatura <code>public Personagem(String nome)</code>, que inicializa os atributos.",
        "Uma interface que define o contrato de nascimento do objeto.",
        "O uso de <code>var</code> no momento da instanciação.",
        "Um modificador de acesso <code>protected</code> no atributo <code>nivel</code>."
      ],
      answer: 1,
      feedback: "O ==key==construtor== é o bloco executado no momento do ==mark==new== para garantir que o objeto ==mark==nasça com um estado válido==. Ele é chamado automaticamente na instanciação."
    },

    {
      aula: "Aula 4 — Construtores, Membros Estáticos e Herança",
      tipo: "Análise de Código",
      texto: "Durante a revisão de código de um sistema de gerenciamento de usuários, a equipe analisa a seguinte classe de configuração:",
      miniEnunciado: "Observe a classe e identifique o problema de compilação:",
      code:
`public class Config {
    public static int limiteUsuarios = 100;
    public String versao = "1.0";
    public static void exibir() {
        System.out.println(limiteUsuarios); // Linha A
        System.out.println(versao);         // Linha B
    }
}`,
      question: "Ao tentar compilar esta classe, o que ocorrerá e por quê?",
      options: [
        "Compila com sucesso; métodos estáticos acessam tudo.",
        "Erro na Linha A; <code>limiteUsuarios</code> deveria ser <code>private</code>.",
        "Erro na Linha B; métodos estáticos não enxergam variáveis de instância pois elas só existem após o <code>new</code>.",
        "Erro em ambas; o <code>main</code> está ausente.",
        "Sucesso, mas o Garbage Collector removerá <code>versao</code> da memória Stack."
      ],
      answer: 2,
      feedback: "Membros ==key==static== pertencem à classe e ==mark==não podem acessar diretamente membros de instância==, que dependem de um objeto criado com <code>new</code> para existir na memória."
    },

    {
      aula: "Aula 4 — Construtores, Membros Estáticos e Herança",
      tipo: "Contextualizada",
      texto: "Um arquiteto de software está desenhando o módulo de frota de um sistema de logística. Ele identifica que as classes <code>Carro</code>, <code>Moto</code> e <code>Caminhao</code> possuem atributos comuns como <code>placa</code> e <code>ano</code>, além de comportamentos compartilhados. Para evitar repetição de código e facilitar a manutenção, ele decide criar uma superclasse <code>Veiculo</code>.",
      question: "Como é chamada essa relação e qual a regra fundamental para aplicá-la corretamente em Java?",
      options: [
        "Composição; regra do \"tem-um\".",
        "Generalização; regra do \"é-um\" (ex: Carro É UM Veiculo).",
        "Encapsulamento; regra da \"porta aberta\".",
        "Polimorfismo; regra da \"assinatura idêntica\".",
        "Implementação; regra do \"contrato de software\"."
      ],
      answer: 1,
      feedback: "A ==key==herança== representa generalização e deve seguir a relação semântica ==mark==é-um==. Carro É UM Veículo — isso valida o uso de herança. Já Carro TEM UM Motor indica composição."
    },

    {
      aula: "Aula 4 — Construtores, Membros Estáticos e Herança",
      tipo: "Contextualizada",
      texto: "Um sistema de vendas online possui a classe <code>Pedido</code> com um atributo <code>static int totalPedidos = 0</code>, que é incrementado toda vez que um novo pedido é criado no construtor. O gerente de produto percebe que, ao consultar <code>Pedido.totalPedidos</code> a qualquer momento, o valor reflete com precisão todos os objetos já instanciados durante a sessão.",
      question: "Por que membros <code>static</code> têm esse comportamento compartilhado entre todas as instâncias?",
      options: [
        "Porque membros <code>static</code> são copiados para cada objeto no momento do <code>new</code>.",
        "Porque membros <code>static</code> pertencem à classe em si, e não a nenhum objeto específico, sendo compartilhados por todas as instâncias.",
        "Porque o Java armazena atributos estáticos em cada objeto para garantir consistência.",
        "Porque o construtor cria um novo <code>static</code> a cada chamada do <code>new</code>.",
        "Porque atributos <code>static</code> são imutáveis por definição e nunca mudam de valor."
      ],
      answer: 1,
      feedback: "Membros ==key==static== pertencem à ==mark==classe (molde)==, não a objetos individuais. São armazenados uma única vez no Metaspace e compartilhados por todas as instâncias."
    },

    {
      aula: "Aula 4 — Construtores, Membros Estáticos e Herança",
      tipo: "Contextualizada",
      texto: "No desenvolvimento de um sistema de torneios de e-sports, a classe <code>Jogador</code> precisa ser criada de duas formas: apenas com o apelido (nick), quando o jogador ainda não está em uma equipe, ou com nick e equipe. O desenvolvedor aplica encadeamento de construtores usando <code>this(nick, \"Sem Equipe\")</code> no construtor simples.",
      question: "Qual a vantagem dessa técnica e qual a restrição imposta pelo Java?",
      options: [
        "Aumenta o uso de memória; deve ser a última linha do bloco.",
        "Facilita a manutenção evitando repetição (DRY); a chamada <code>this()</code> deve ser obrigatoriamente a primeira linha do construtor.",
        "Permite herança múltipla; deve ser estática.",
        "Cria um objeto na Stack; impede o uso de <code>super()</code>.",
        "Reduz o tempo de compilação; exige modificador <code>private</code>."
      ],
      answer: 1,
      feedback: "O uso de ==key==this()== para encadear construtores reduz ==mark==duplicação de lógica (DRY)==, mas o Java exige que seja a ==mark==primeira instrução== do construtor."
    },

    // ── Aula 5 — Herança, Reuso e Membros static ─────────────

    {
      aula: "Aula 5 — Herança, Reuso e Membros static",
      tipo: "Contextualizada",
      texto: "Em um sistema financeiro, a classe <code>ContaPoupanca</code> estende a classe <code>ContaBanco</code>. Durante a implementação dos cálculos de rendimento, o desenvolvedor percebe que precisa acessar o atributo <code>saldo</code> definido na classe pai. No entanto, tornar esse atributo público exporia dados sensíveis a qualquer parte do sistema.",
      question: "Qual modificador de acesso na classe pai permite esse equilíbrio entre encapsulamento e reuso?",
      options: [
        "<code>public</code>",
        "<code>private</code>",
        "<code>protected</code>",
        "<code>default</code> (sem modificador)",
        "<code>static</code>"
      ],
      answer: 2,
      feedback: "O modificador ==key==protected== torna o membro visível para a ==mark==própria classe, subclasses e classes do mesmo pacote==, sendo ideal para herança sem expor dados publicamente."
    },

    {
      aula: "Aula 5 — Herança, Reuso e Membros static",
      tipo: "Contextualizada",
      texto: "Em um sistema de RH, a classe <code>Gerente</code> estende <code>Funcionario</code>. Ao implementar o construtor de <code>Gerente</code>, o desenvolvedor precisa repassar o nome recebido ao construtor da classe pai para que os atributos herdados sejam corretamente inicializados.",
      question: "Qual a sintaxe correta e a justificativa técnica para essa obrigatoriedade?",
      options: [
        "<code>this.nome = nome;</code> para garantir o sombreamento.",
        "<code>super(nome);</code> na primeira linha, para garantir que os \"alicerces\" do objeto pai sejam montados antes da especialização do filho.",
        "<code>Funcionario(nome);</code> chamando o método diretamente como se fosse estático.",
        "Não é necessário, pois construtores são herdados automaticamente em Java.",
        "<code>extends(nome);</code> para vincular o Bytecode das duas classes."
      ],
      answer: 1,
      feedback: "Construtores ==mark==não são herdados==. Deve-se usar ==key==super()== na ==mark==primeira linha== do construtor filho para inicializar a superclasse antes de qualquer especialização."
    },

    {
      aula: "Aula 5 — Herança, Reuso e Membros static",
      tipo: "Contextualizada",
      texto: "Em um sistema de simulação de zoológico virtual, a classe <code>Animal</code> define o método <code>emitirSom()</code> com uma implementação genérica. A classe <code>Cachorro</code> herda de <code>Animal</code> e reimplementa esse método para exibir \"Au Au\", utilizando a anotação <code>@Override</code> para sinalizar explicitamente ao compilador a intenção de especialização.",
      question: "Como é chamado esse mecanismo e o que ele permite?",
      options: [
        "Sobrecarga; permite múltiplos métodos com nomes diferentes.",
        "Sobrescrita; permite que a subclasse forneça uma implementação específica para um método já definido na superclasse.",
        "Abstração; permite esconder a complexidade do latido.",
        "Encapsulamento; protege o som do animal.",
        "Composição; estabelece que Cachorro tem um Som."
      ],
      answer: 1,
      feedback: "A ==key==sobrescrita (@Override)== especializa o comportamento herdado, mantendo a ==mark==mesma assinatura== do método da superclasse mas fornecendo uma implementação diferente."
    },

    {
      aula: "Aula 5 — Herança, Reuso e Membros static",
      tipo: "Contextualizada",
      texto: "Uma equipe de desenvolvimento está projetando a classe <code>Smartphone</code> para um sistema de inventário de dispositivos. O tech lead sugere que ela herde comportamentos tanto de <code>Telefone</code> quanto de <code>Camera</code>, pois um smartphone é ambos. Um desenvolvedor tenta escrever <code>public class Smartphone extends Telefone, Camera</code>.",
      question: "Qual será o resultado e qual a alternativa recomendada pelas boas práticas?",
      options: [
        "Funciona normalmente, pois Java suporta herança múltipla baseada em estado.",
        "Erro de compilação; Java proíbe herança múltipla de classes para evitar o \"erro do diamante\". Recomenda-se o uso de Interfaces ou Composição.",
        "Funciona apenas se <code>Telefone</code> e <code>Camera</code> forem classes estáticas.",
        "Erro de execução; o JRE não consegue alocar duas superclasses na Heap.",
        "Funciona se o desenvolvedor utilizar o modificador <code>protected</code> em ambos os pais."
      ],
      answer: 1,
      feedback: "Java não permite ==key==herança múltipla de classes== para evitar o ==mark==problema do diamante==. O reuso deve ser buscado via ==mark==interfaces ou composição==."
    },

    {
      aula: "Aula 5 — Herança, Reuso e Membros static",
      tipo: "Contextualizada",
      texto: "O Banco Central atualiza a taxa de juros de referência, e o sistema bancário de uma instituição financeira precisa refletir essa mudança imediatamente para todas as contas cadastradas. A classe <code>Banco</code> possui o atributo <code>public static double taxaJuros = 0.05;</code>, e o sistema realiza a atualização para <code>0.06</code>.",
      question: "O que acontece com todas as instâncias de contas já criadas?",
      options: [
        "Nada, pois cada conta tem sua própria cópia da taxa na memória Heap.",
        "Todas as instâncias verão o novo valor de <code>0.06</code> simultaneamente, pois atributos estáticos são compartilhados através da Classe.",
        "O código não compila, pois membros estáticos são imutáveis (final) por padrão.",
        "Apenas as novas contas criadas após a alteração terão a nova taxa.",
        "Ocorre um erro de runtime (\"Static Access Exception\")."
      ],
      answer: 1,
      feedback: "Membros ==key==static== pertencem à ==mark==classe (molde)== e são compartilhados entre todas as instâncias. Alterar o valor impacta todos os objetos simultaneamente."
    },

    // ── Aula 6 — Polimorfismo e Abstração ────────────────────

    {
      aula: "Aula 6 — Polimorfismo e Abstração",
      tipo: "Contextualizada",
      texto: "Uma plataforma de pagamentos digitais precisa processar diferentes modalidades de transação de forma unificada. O módulo principal recebe uma <code>List&lt;Pagamento&gt;</code>, que pode conter instâncias de <code>Pix</code>, <code>Cartao</code> e <code>Boleto</code>. O código percorre a lista chamando <code>p.pagar(valor)</code> para cada item sem verificar o tipo concreto.",
      question: "Este cenário ilustra qual conceito e qual mecanismo da JVM?",
      options: [
        "Encapsulamento e Ocultação de Informação.",
        "Polimorfismo e Dynamic Method Dispatch (despacho dinâmico de métodos), onde a JVM decide em tempo de execução qual implementação executar.",
        "Herança Rígida e Alocação Estática no Metaspace.",
        "Abstração e Casting Explícito obrigatório.",
        "Sobrecarga e Verificação de Tipo em tempo de compilação."
      ],
      answer: 1,
      feedback: "O ==key==polimorfismo== permite tratar diferentes objetos por uma interface comum, e o ==key==Dynamic Method Dispatch== decide em ==mark==tempo de execução== qual implementação de método executar."
    },

    {
      aula: "Aula 6 — Polimorfismo e Abstração",
      tipo: "Contextualizada",
      texto: "Em um sistema de simulação de ecossistemas, o arquiteto define que a classe <code>Animal</code> deve servir apenas como modelo base — nenhum objeto do tipo genérico \"Animal\" deve ser instanciado diretamente. Ao mesmo tempo, todo animal concreto do sistema deve obrigatoriamente implementar o método <code>emitirSom()</code>.",
      question: "Qual a definição técnica correta para essa classe e seu método?",
      options: [
        "Classe Privada com método Final.",
        "Classe Estática com método Nativo.",
        "Classe Abstrata com método Abstrato (sem implementação na classe base).",
        "Interface com atributos Protegidos.",
        "Classe Concreta com Sobrecarga de construtores."
      ],
      answer: 2,
      feedback: "==key==Classes abstratas== não podem ser instanciadas e servem para definir modelos incompletos. Métodos ==key==abstract== forçam as subclasses a fornecerem implementação concreta."
    },

    {
      aula: "Aula 6 — Polimorfismo e Abstração",
      tipo: "Contextualizada",
      texto: "Em uma API de mapas urbanos, diferentes tipos de estabelecimentos precisam fornecer sua localização geográfica. Define-se <code>public interface Localizavel { void getCoordenadas(); }</code>. As classes <code>Restaurante</code>, <code>Escola</code> e <code>Parque</code> implementam essa interface, cada uma com sua própria lógica de obtenção de coordenadas.",
      question: "No contexto de engenharia de software, o que a interface representa e qual seu principal benefício?",
      options: [
        "Representa um \"Molde Físico\" e aumenta o acoplamento.",
        "Representa um \"Contrato de Software\" e promove o desacoplamento, permitindo que o código dependa de contratos e não de implementações.",
        "Representa uma \"Classe Pai\" e permite armazenar estado (variáveis) compartilhado.",
        "Representa uma \"Guard Clause\" para evitar NullPointerException.",
        "Representa um \"Bytecode\" otimizado para o compilador."
      ],
      answer: 1,
      feedback: "Interfaces funcionam como ==key==contratos de software==. Elas garantem comportamentos sem impor como devem ser feitos, promovendo ==mark==desacoplamento== e facilitando a extensão do sistema."
    },

    {
      aula: "Aula 6 — Polimorfismo e Abstração",
      tipo: "Contextualizada",
      texto: "Em um sistema de automação residencial, a classe <code>ControleRemoto</code> é projetada para comandar qualquer dispositivo inteligente da casa. Ela depende apenas da interface <code>Dispositivo</code>, chamando <code>dispositivo.ligar()</code> sem conhecer a implementação concreta, seja uma <code>TV</code> ou um <code>ArCondicionado</code>.",
      question: "De acordo com os princípios de design discutidos, essa abordagem facilita qual aspecto do desenvolvimento?",
      options: [
        "Aumento da carga cognitiva do desenvolvedor.",
        "Manutenibilidade e Escalabilidade, pois novos dispositivos podem ser adicionados ao sistema sem alterar o código do <code>ControleRemoto</code>.",
        "Performance, pois elimina a memória Heap.",
        "Depuração (Debugging), pois as interfaces gravam logs automáticos.",
        "Tipagem dinâmica, transformando Java em uma linguagem similar ao Python."
      ],
      answer: 1,
      feedback: "O ==key==desacoplamento via abstração== permite que o sistema evolua com novos componentes (novas implementações da interface) sem quebrar as estruturas existentes — princípio ==mark==Aberto/Fechado (OCP)==."
    },

    {
      aula: "Aula 6 — Polimorfismo e Abstração",
      tipo: "Contextualizada",
      texto: "Uma equipe de arquitetura de software discute quando utilizar uma Classe Abstrata versus uma Interface no projeto de um novo módulo. O tech lead pede que um desenvolvedor explique a diferença fundamental entre as duas construções em Java, tanto em termos de estrutura quanto de regras de herança.",
      question: "Qual a diferença fundamental entre uma Classe Abstrata e uma Interface em relação à estrutura e herança em Java?",
      options: [
        "Interfaces podem ser instanciadas; Classes Abstratas não.",
        "Classes Abstratas podem ter estado (atributos) e métodos concretos; Interfaces definem apenas comportamentos e permitem múltiplas implementações por uma única classe.",
        "Não há diferença; ambos são sinônimos de polimorfismo estático.",
        "Classes Abstratas usam a palavra <code>implements</code>; Interfaces usam <code>extends</code>.",
        "Interfaces são limitadas a um único uso por projeto; Classes Abstratas são globais."
      ],
      answer: 1,
      feedback: "==key==Classes abstratas== podem ter atributos e métodos concretos. ==key==Interfaces== são focadas puramente em contratos de comportamento e superam a limitação de herança única, permitindo que uma classe implemente múltiplas interfaces."
    },

    // ── Aula 7 — Revisão Geral ────────────────────────────────

    {
      aula: "Aula 7 — Revisão Geral",
      tipo: "Contextualizada",
      texto: "Uma empresa de segurança digital desenvolve um sistema de autenticação multifator. Para proteger as credenciais dos usuários, a equipe decide que a senha nunca deve ser acessada diretamente por módulos externos. O desenvolvedor cria a classe <code>Usuario</code> com o atributo de senha como <code>private</code> e implementa um método <code>validarSenha(String tentativa)</code> que retorna <code>true</code> ou <code>false</code>.",
      question: "Este cenário aplica quais conceitos fundamentais, respectivamente?",
      options: [
        "Herança e Polimorfismo.",
        "Abstração e static.",
        "Encapsulamento e Métodos (comportamento).",
        "Bytecode e JDK.",
        "Construtores e Shadowing."
      ],
      answer: 2,
      feedback: "O uso de modificador ==key==private== para proteger o dado é ==key==encapsulamento==, e a validação é um ==mark==comportamento definido por método==."
    },

    {
      aula: "Aula 7 — Revisão Geral",
      tipo: "Afirmativas",
      texto: "Em uma aula de revisão de POO, o professor apresenta três afirmações sobre os pilares do paradigma. Os alunos devem analisar cada uma e identificar quais estão corretas:",
      assertions: [
        "O polimorfismo permite que uma lista de FormaGeometrica contenha Circulo e Quadrado.",
        "A abstração foca nos detalhes internos de como o motor do carro funciona.",
        "O construtor padrão desaparece se o programador definir manualmente um construtor com parâmetros."
      ],
      question: "Está(ão) correta(s):",
      options: [
        "I e II apenas.",
        "I e III apenas.",
        "II e III apenas.",
        "I, II e III.",
        "Apenas I."
      ],
      answer: 1,
      feedback: "A afirmação II está incorreta porque a ==key==abstração== foca no ==mark==essencial e ignora detalhes de implementação==. I está correta pois o polimorfismo trata diferentes objetos por um tipo base. III está correta — o ==key==construtor padrão== some quando o programador define um construtor com parâmetros."
    },

    {
      aula: "Aula 7 — Revisão Geral",
      tipo: "Contextualizada",
      texto: "Um analista de sistemas recebe o seguinte requisito: \"O sistema bancário permite saques, depósitos e emissão de extratos. Cada tipo de conta (Corrente e Poupança) tem sua própria regra de cálculo de taxa mensal.\"",
      question: "Para modelar esse sistema usando as melhores práticas de POO, deve-se:",
      options: [
        "Criar uma única classe <code>Banco</code> com muitos <code>if-else</code> para cada tipo de conta.",
        "Criar uma classe abstrata <code>Conta</code> com o método abstrato <code>calcularTaxa()</code> e estendê-la nas contas específicas.",
        "Usar apenas variáveis globais <code>static</code> para armazenar todos os saldos.",
        "Definir todas as classes como <code>final</code> para impedir o reuso de código.",
        "Substituir a POO por programação procedural linear para aumentar a performance."
      ],
      answer: 1,
      feedback: "O uso de ==key==classes abstratas e herança== permite especializar o comportamento (taxas) mantendo uma base comum, eliminando <code>if-else</code> e facilitando a manutenção."
    },

    {
      aula: "Aula 7 — Revisão Geral",
      tipo: "Contextualizada",
      texto: "Durante um treinamento de nivelamento em Java, o instrutor explica como a JVM gerencia a memória durante a execução de um programa. Ele destaca a diferença entre a memória Stack, usada para execução rápida, e a Heap, usada para armazenamento dinâmico de objetos.",
      question: "Qual afirmação está correta sobre a relação entre a memória Stack e as referências de objetos?",
      options: [
        "O objeto completo reside na Stack para acesso rápido.",
        "A Stack guarda apenas o endereço (ponteiro/referência) do objeto, enquanto os dados reais do objeto ficam na Heap.",
        "A Stack é limpa pelo Garbage Collector; a Heap não.",
        "O Metaspace substitui a Stack em versões modernas do Java.",
        "Atributos estáticos residem na Stack por serem temporários."
      ],
      answer: 1,
      feedback: "A ==key==Stack== guarda variáveis locais e ==mark==referências (endereços)==. Os dados reais do objeto ficam na ==key==Heap==. O ==mark==Garbage Collector== atua na Heap, não na Stack."
    },

    {
      aula: "Aula 7 — Revisão Geral",
      tipo: "Contextualizada",
      texto: "Uma equipe de desenvolvimento discute as características que diferenciam Java de linguagens de script como Python e JavaScript. Um dos pontos levantados é a tipagem da linguagem, que impacta diretamente na segurança do código e na detecção precoce de erros pelo compilador.",
      question: "O que caracteriza a \"Tipagem Forte\" do Java?",
      options: [
        "Variáveis podem mudar de tipo a qualquer momento como no Python.",
        "É obrigatório declarar o tipo da variável, e o compilador impede operações entre tipos incompatíveis (ex: somar String com int diretamente sem conversão).",
        "O uso obrigatório de modificadores <code>public</code> em todos os métodos.",
        "A necessidade de usar ferramentas externas para compilar o código.",
        "A impossibilidade de usar herança múltipla."
      ],
      answer: 1,
      feedback: "A ==key==tipagem forte== do Java exige declaração explícita e rigor na ==mark==compatibilidade de tipos==. O compilador impede operações inválidas antes mesmo da execução."
    },

    // ── Aula 8 — Tratamento de Exceções ──────────────────────

    {
      aula: "Aula 8 — Tratamento de Exceções",
      tipo: "Contextualizada",
      texto: "Em um sistema de caixa eletrônico, um cliente tenta realizar um saque de R$ 500,00 em uma conta com saldo de R$ 200,00. O requisito funcional exige que o sistema não trave nem encerre abruptamente, mas sim informe ao usuário que a operação não é possível e permaneça disponível para novas interações.",
      question: "Como esse evento é classificado tecnicamente em Java e qual a estrutura básica para lidar com ele?",
      options: [
        "É um Bytecode malformado; usa-se <code>javac</code>.",
        "É uma Exceção; utiliza-se o bloco <code>try-catch</code> para capturar e tratar o erro.",
        "É um Shadowing; utiliza-se a palavra-chave <code>this</code>.",
        "É um erro de herança; utiliza-se <code>extends</code>.",
        "É um erro de Tipagem Dinâmica; utiliza-se <code>casting</code>."
      ],
      answer: 1,
      feedback: "==key==Exceções== são erros em tempo de execução que interrompem o fluxo. O ==key==try== tenta o código perigoso e o ==key==catch== trata a falha, mantendo o sistema funcional."
    },

    {
      aula: "Aula 8 — Tratamento de Exceções",
      tipo: "Contextualizada",
      texto: "Um desenvolvedor está implementando um módulo de leitura de arquivos de configuração para um sistema corporativo. Ao revisar o código com o tech lead, surge a dúvida sobre o uso correto das palavras-chave <code>throw</code> e <code>throws</code> no contexto do método que lê os arquivos.",
      question: "Qual a diferença técnica entre elas?",
      options: [
        "<code>throw</code> indica que o método pode falhar; <code>throws</code> lança o erro.",
        "<code>throw</code> é usado para lançar uma exceção manualmente dentro do código; <code>throws</code> é usado na assinatura do método para declarar que ele pode gerar aquela exceção.",
        "<code>throw</code> captura o erro; <code>throws</code> finaliza o programa.",
        "Ambas são opcionais e não afetam a compilação de exceções checadas.",
        "<code>throw</code> é para erros estáticos; <code>throws</code> para erros de instância."
      ],
      answer: 1,
      feedback: "==key==throw== é a ==mark==ação de disparar a exceção==. ==key==throws== é o aviso obrigatório na ==mark==assinatura do método== para exceções checadas que ele não trata internamente."
    },

    {
      aula: "Aula 8 — Tratamento de Exceções",
      tipo: "Contextualizada",
      texto: "Um desenvolvedor de um sistema bancário percebe que as exceções genéricas do Java não descrevem com clareza os erros de regra de negócio. Para resolver isso, ele cria a classe <code>SaldoInsuficienteException</code> que herda de <code>Exception</code>, permitindo que o sistema identifique e trate especificamente tentativas de saques acima do saldo disponível.",
      question: "Como é chamada essa prática e qual a vantagem?",
      options: [
        "Polimorfismo de erro; aumenta a velocidade da JVM.",
        "Exceção Personalizada; permite criar mensagens claras e tratamentos específicos para regras de negócio do sistema.",
        "Encapsulamento de falha; esconde o erro do usuário final.",
        "Sobrecarga de erro; permite múltiplos <code>catch</code> genéricos.",
        "Abstração de erro; elimina a necessidade de <code>try-catch</code>."
      ],
      answer: 1,
      feedback: "Criar ==key==exceções personalizadas== (subclasses de <code>Exception</code>) permite ==mark==tratamentos específicos para regras de negócio==, tornando o código mais expressivo e fácil de depurar."
    },

    {
      aula: "Aula 8 — Tratamento de Exceções",
      tipo: "Análise de Código",
      texto: "Em um sistema de integração com banco de dados, o desenvolvedor implementa um módulo de processamento de transações que abre conexões com recursos externos.",
      miniEnunciado: "Analise o trecho e o papel de cada bloco:",
      code:
`try {
    conexao.abrir();
    processar();
} catch (SQLException e) {
    log(e);
} finally {
    conexao.fechar();
}`,
      question: "Qual o papel fundamental do bloco <code>finally</code> neste código?",
      options: [
        "Executar apenas se ocorrer um erro na abertura.",
        "Substituir o uso de <code>throws</code> na assinatura do método.",
        "Garantir que o recurso (conexão) seja fechado independentemente de ter ocorrido uma exceção ou não.",
        "Reiniciar o método <code>main</code> automaticamente.",
        "Transformar a exceção em uma <code>RuntimeException</code> não checada."
      ],
      answer: 2,
      feedback: "O bloco ==key==finally== ==mark==sempre executa==, com ou sem exceção. É ideal para ==mark==liberação de recursos== como fechar arquivos ou conexões com banco de dados."
    },

    {
      aula: "Aula 8 — Tratamento de Exceções",
      tipo: "Contextualizada",
      texto: "Durante os testes de um sistema de e-commerce, a equipe de QA identifica uma falha recorrente: ao tentar acessar atributos de um objeto de pedido que não foi corretamente inicializado, o sistema lança um erro em tempo de execução. Ao investigar, o desenvolvedor confirma que a variável de pedido está com valor <code>null</code>.",
      question: "Como esse erro é classificado e qual a boa prática para evitá-lo?",
      options: [
        "Exceção Checada (Checked); deve-se usar <code>throws</code>.",
        "Erro de Compilação; deve-se inicializar na Stack.",
        "Exceção Não Checada (Unchecked/RuntimeException); deve-se realizar verificações preventivas (ex: <code>if (obj != null)</code>) antes do uso.",
        "Erro de Escopo; deve-se usar o modificador <code>public</code>.",
        "Erro de Casting; deve-se usar promoção implícita."
      ],
      answer: 2,
      feedback: "O ==key==NullPointerException== é uma exceção ==mark==não checada (unchecked)==. A ==mark==verificação preventiva== com <code>if (obj != null)</code> é a melhor prática, pois o compilador não obriga o tratamento com try-catch."
    },

  ],

  // ── Questões de AVA ───────────────────────────────────────

ava: [

    {
      aula: "Programação Orientada a Objetos",
      tipo: "Asserção",
      texto: "Uma equipe de desenvolvimento está criando um sistema de simulação de tráfego urbano para uma metrópole. Eles precisam modelar computacionalmente elementos reais como semáforos, veículos e pedestres, garantindo que dezenas de carros possam existir simultaneamente na simulação com características e velocidades próprias. A Programação Orientada a Objetos (POO) baseia-se na criação de modelos que representam elementos do mundo real ou do domínio do problema computacional. Para que esse mapeamento ocorra de forma eficiente, a POO apoia-se fortemente nos conceitos de classes e objetos, que constituem a base estrutural e comportamental da maioria das aplicações modernas.\n\nConsiderando a arquitetura de sistemas orientados a objetos e a construção do referido simulador, avalie as asserções a seguir e a relação proposta entre elas:",
      assertions: [
        "Em um sistema orientado a objetos, uma classe atua como um molde abstrato, enquanto um objeto é uma instância concreta operando de forma ativa na memória.",
        "A classe define os atributos e métodos compartilhados estruturalmente, permitindo a materialização de múltiplas entidades independentes mantendo estados internos próprios."
      ],
      question: "A respeito dessas asserções, assinale a opção correta.",
      options: [
        "A asserção I é proposição falsa, e a II é verdadeira.",
        "As asserções I e II são verdadeiras, mas a II não justifica a I.",
        "A asserção I é proposição verdadeira, e a II é falsa.",
        "As asserções I e II são verdadeiras, e a II é uma justificativa da I."
      ],
      answer: 3,
      feedback: "✓ Resposta correta: D) As asserções I e II são verdadeiras, e a II é uma justificativa da I.\n\nPor que está certa:\nA asserção I está correta pois a classe é de fato um molde abstrato e o objeto é uma instância concreta em memória. A asserção II justifica a I porque explica o mecanismo que permite isso: a classe define estrutura compartilhada, mas cada objeto mantém seus próprios estados internos — o que explica como múltiplos carros podem coexistir com características independentes."
    },

    {
      aula: "Programação Orientada a Objetos",
      tipo: "Afirmativas",
      texto: "O desenvolvimento de sistemas de software pode ser orientado por diferentes formas de pensar e estruturar soluções, conhecidas como paradigmas de programação. A Programação Orientada a Objetos (POO) consolidou-se como um dos principais paradigmas modernos na área de tecnologia e engenharia de software. Em vez de focar primariamente na lógica algorítmica estrita e na decomposição de funções, a POO propõe que o software seja projetado como uma coleção de entidades que interagem entre si, buscando uma modelagem mais próxima da forma como compreendemos e organizamos o mundo real.\n\nAvalie as afirmações a seguir.",
      assertions: [
        "O paradigma orientado a objetos estrutura o sistema aproximando-o do mundo real, utilizando abstrações que agrupam características (estados/atributos) e comportamentos (ações/métodos) em unidades fundamentais chamadas de objetos.",
        "Uma premissa essencial desse paradigma é o isolamento completo e inflexível de código, o que na prática desencoraja o reuso de estruturas e exige que cada entidade do programa seja construída integralmente do zero.",
        "A construção de sistemas sob o paradigma da orientação a objetos é baseada na colaboração entre diferentes entidades, onde a dinâmica do programa ocorre principalmente por meio da troca de mensagens ou invocação de métodos entre os objetos.",
        "O foco central da abordagem orientada a objetos é a resolução de problemas através da quebra do sistema em um fluxo linear de procedimentos matemáticos, priorizando funções que não mantêm nenhum tipo de estado interno."
      ],
      question: "É correto o que se afirma em:",
      options: [
        "II e IV, apenas.",
        "I, III e IV, apenas.",
        "I e III, apenas.",
        "I, II e III, apenas."
      ],
      answer: 2,
      feedback: "✓ Resposta correta: C) I e III, apenas.\n\nPor que está certa:\nI está correta — a POO agrupa atributos e comportamentos em objetos que modelam o mundo real. III está correta — os objetos colaboram por meio de troca de mensagens/invocação de métodos. II está errada pois a POO incentiva o reuso (herança, composição). IV está errada pois descreve o paradigma procedural/funcional, não a POO."
    },

    {
      aula: "Programação Orientada a Objetos",
      tipo: "Contextualizada",
      texto: "Um engenheiro de software de um banco digital precisa garantir que o atributo \"saldo\" da classe ContaCorrente não possa ser alterado de forma irrestrita por outras classes do sistema, prevenindo fraudes ou falhas lógicas que deixem o saldo negativo sem validação prévia. O pilar do encapsulamento defende o isolamento estrito de dados sensíveis. Modificadores de acesso como private, protected e public controlam a visibilidade de membros da classe. O acesso seguro e validado ocorre primordialmente por meio de métodos padronizados de leitura e escrita.",
      question: "Analise a necessidade arquitetural de segurança da conta bancária descrita e assinale a alternativa que apresenta a solução técnica correta em linguagem Java.",
      options: [
        "O escopo protected garante que componentes externos não modifiquem o saldo atual.",
        "O uso de métodos construtores estáticos anula a necessidade de regras de saques.",
        "O encapsulamento completo da conta exige que a declaração da classe seja private.",
        "O atributo saldo deve ser private e modificado unicamente por métodos controlados."
      ],
      answer: 3,
      feedback: "✓ Resposta correta: D) O atributo saldo deve ser private e modificado unicamente por métodos controlados.\n\nPor que está certa:\nO encapsulamento correto exige que atributos sensíveis sejam declarados como private, impedindo acesso direto externo. O acesso deve ocorrer apenas por meio de métodos (getters/setters) que podem conter validações — como impedir saldo negativo. As outras alternativas estão erradas: protected ainda permite acesso por subclasses e classes do mesmo pacote; classes não podem ser private (exceto internas); construtores estáticos não resolvem o problema de validação de acesso."
    },

    {
      aula: "Programação Orientada a Objetos",
      tipo: "Análise de Código",
      texto: "O reuso de software é um dos maiores benefícios práticos apontados na adoção da Programação Orientada a Objetos (POO). Na linguagem Java, essa característica é promovida de forma estrutural por meio de mecanismos relacionais entre classes, destacando-se a herança. Ao permitir que novas classes sejam construídas estendendo os atributos e métodos de classes previamente testadas e implementadas, a herança minimiza a duplicação de código, reduz a probabilidade de introdução de erros e simplifica significativamente a manutenção e a expansão arquitetural do sistema.",
      miniEnunciado: "Considere o trecho de código Java a seguir, que ilustra um modelo simplificado de folha de pagamento para funcionários de uma empresa:",
      code:
`public class Funcionario {
  protected String nome;
  protected double salarioBase;
  public Funcionario(String nome, double salarioBase) {
    this.nome = nome;
    this.salarioBase = salarioBase;
  }
  public double calcularPagamento() { return salarioBase; }
}

public class Gerente extends Funcionario {
  private double bonusProdutividade;
  public Gerente(String nome, double salarioBase, double bonusProdutividade) {
    super(nome, salarioBase);
    this.bonusProdutividade = bonusProdutividade;
  }
  @Override
  public double calcularPagamento() {
    return super.calcularPagamento() + bonusProdutividade;
  }
}`,
      assertions: [
        "A palavra-chave extends estabelece uma relação de herança, permitindo que a classe Gerente reaproveite estruturalmente os atributos nome e salarioBase criados na classe Funcionario, evitando a duplicação de declaração de variáveis.",
        "A chamada super.calcularPagamento() dentro do método sobrescrito na classe Gerente é um exemplo de reuso de comportamento, pois a subclasse aproveita a lógica de cálculo já validada na superclasse e apenas adiciona a sua regra específica (o bônus).",
        "O paradigma da orientação a objetos determina que a herança é a única maneira aceitável e eficiente de se obter reuso de código em Java, substituindo totalmente outras abordagens modulares, como a composição de objetos."
      ],
      question: "É correto o que se afirma em:",
      options: [
        "I, apenas.",
        "II e III, apenas.",
        "I e II, apenas.",
        "I, II e III."
      ],
      answer: 2,
      feedback: "✓ Resposta correta: C) I e II, apenas.\n\nPor que está certa:\nI está correta — extends estabelece herança e Gerente reutiliza os atributos de Funcionario. II está correta — super.calcularPagamento() reutiliza a lógica da superclasse. III está errada — a herança não é a única forma de reuso; a composição de objetos é uma alternativa igualmente válida e muitas vezes preferida (princípio \"Prefira composição à herança\")."
    },

    {
      aula: "Programação Orientada a Objetos",
      tipo: "Análise de Código",
      texto: "Uma montadora de veículos precisa criar um catálogo digital de sua frota. O analista de sistemas responsável decidiu modelar os diferentes tipos de transporte utilizando uma taxonomia baseada em herança, garantindo o reuso de propriedades gerais para automóveis, caminhões e motocicletas. A reutilização de código é uma das vantagens centrais da Programação Orientada a Objetos. Em linguagens como Java, esse recurso pode ser implementado por meio da herança.",
      miniEnunciado: "Considere o seguinte código base criado pelo analista:",
      code:
`public class Veiculo {
  private String marca;
  public Veiculo(String marca) { this.marca = marca; }
}

public class Carro extends Veiculo {
  public Carro(String marca) { super(marca); }
}`,
      assertions: [
        "A classe Carro herda de forma direta atributos e métodos declarados na classe Veiculo.",
        "A palavra-chave extends é utilizada nativamente em Java para indicar a herança.",
        "A classe Veiculo não pode ser instanciada diretamente por agir como uma Interface."
      ],
      question: "É correto o que se afirma em:",
      options: [
        "I, apenas.",
        "II, apenas.",
        "I e II apenas.",
        "I, II e III."
      ],
      answer: 2,
      feedback: "✓ Resposta correta: C) I e II apenas.\n\nPor que está certa:\nI está correta — Carro herda atributos e métodos de Veiculo via extends. II está correta — extends é a palavra-chave Java para herança. III está errada — Veiculo é uma classe concreta comum, não uma interface. Ela PODE ser instanciada diretamente com new Veiculo(\"Toyota\"). Para não poder ser instanciada, precisaria ser declarada como abstract ou interface."
    },

    {
      aula: "Programação Orientada a Objetos",
      tipo: "Asserção",
      texto: "A Programação Orientada a Objetos (POO) baseia-se na criação de modelos que representam elementos do mundo real ou do domínio do problema computacional. Para que esse mapeamento ocorra de forma eficiente, a POO apoia-se fortemente nos conceitos de classes e objetos, que constituem a base estrutural e comportamental da maioria das aplicações modernas desenvolvidas sob esse paradigma.\n\nConsiderando as informações apresentadas, avalie as asserções a seguir e a relação proposta entre elas.",
      assertions: [
        "Em um sistema orientado a objetos, uma classe atua como um molde ou especificação abstrata, enquanto um objeto é uma instância concreta gerada a partir dessa especificação, operando de forma ativa na memória do computador durante a execução do programa.",
        "[PORQUE] A classe define os atributos (estado) e os métodos (comportamento) que serão compartilhados de forma estrutural, permitindo a materialização de múltiplas entidades independentes que mantêm seus próprios estados internos com base no mesmo modelo."
      ],
      question: "A respeito dessas asserções, assinale a opção correta.",
      options: [
        "As asserções I e II são proposições verdadeiras, mas a II não é uma justificativa correta da I.",
        "A asserção I é uma proposição verdadeira, e a II é uma proposição falsa.",
        "As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I.",
        "As asserções I e II são proposições falsas."
      ],
      answer: 2,
      feedback: "✓ Resposta correta: C) As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I.\n\nPor que está certa:\nA primeira asserção é verdadeira — classe é um molde abstrato e objeto é uma instância concreta em memória. A segunda asserção também é verdadeira e justifica a primeira: é exatamente porque a classe define atributos e métodos compartilhados estruturalmente que múltiplos objetos independentes (cada um com seu estado próprio) podem ser criados a partir do mesmo modelo."
    },

    {
      aula: "Programação Orientada a Objetos",
      tipo: "Análise de Código",
      texto: "Um desenvolvedor sênior foi encarregado de refatorar o sistema de folha de pagamento de uma empresa, visando reduzir redundâncias. Ele optou por aplicar conceitos avançados de Orientação a Objetos para otimizar o código legado e facilitar futuras integrações. O reuso de software é um dos maiores benefícios práticos na adoção da POO. Na linguagem Java, essa característica é promovida de forma estrutural por meio de mecanismos relacionais entre classes, destacando-se a herança, que minimiza a duplicação de código.",
      miniEnunciado: "Analise o trecho a seguir:",
      code:
`public class Funcionario {
  protected String nome;
  protected double salarioBase;
  public Funcionario(String nome, double salarioBase) {
    this.nome = nome;
    this.salarioBase = salarioBase;
  }
  public double calcularPagamento() { return salarioBase; }
}

public class Gerente extends Funcionario {
  private double bonusProdutividade;
  public Gerente(String nome, double salarioBase, double bonusProdutividade) {
    super(nome, salarioBase);
    this.bonusProdutividade = bonusProdutividade;
  }
  @Override
  public double calcularPagamento() {
    return super.calcularPagamento() + bonusProdutividade;
  }
}`,
      assertions: [
        "A palavra-chave extends estabelece uma relação de herança, permitindo que a classe Gerente reaproveite estruturalmente os atributos criados na classe Funcionario.",
        "A chamada super.calcularPagamento() na classe Gerente é um exemplo de reuso de comportamento, aproveitando a lógica de cálculo já validada na superclasse.",
        "O paradigma determina que a herança é a única maneira aceitável e eficiente de se obter reuso de código em Java, substituindo outras abordagens modulares."
      ],
      question: "Escolha a alternativa correta.",
      options: [
        "Apenas a afirmação I está correta.",
        "Apenas as afirmações II e III estão corretas.",
        "Apenas as afirmações I e II estão corretas.",
        "As afirmações I, II e III estão corretas."
      ],
      answer: 2,
      feedback: "✓ Resposta correta: C) Apenas as afirmações I e II estão corretas.\n\nPor que está certa:\nI está correta — extends cria herança e Gerente reutiliza os atributos de Funcionario. II está correta — super.calcularPagamento() é reuso de comportamento da superclasse. III está errada — a herança não é a única forma de reuso em Java; composição de objetos é outra abordagem igualmente válida e amplamente utilizada."
    },

    {
      aula: "Programação Orientada a Objetos",
      tipo: "Afirmativas",
      texto: "O encapsulamento é um dos pilares da Programação Orientada a Objetos, permitindo que os detalhes internos de implementação de um objeto sejam ocultados do mundo externo. Na linguagem Java, esse controle de visibilidade é implementado por meio dos modificadores de acesso, palavras-chave que definem o nível de acessibilidade de classes, atributos, métodos e construtores. A escolha correta desses modificadores é fundamental para garantir a segurança, a coesão e o acoplamento adequado na arquitetura do software.\n\nA partir das informações apresentadas e dos conceitos de modificadores de acesso na linguagem Java, avalie as afirmações a seguir.",
      assertions: [
        "O modificador public representa o nível mais permissivo de visibilidade, permitindo que a classe ou o membro seja acessado a partir de qualquer outra classe, independentemente do pacote em que se encontre.",
        "O modificador private aplica a restrição máxima de visibilidade, garantindo que o membro declarado possa ser acessado ou modificado unicamente dentro do escopo da própria classe onde foi criado.",
        "O modificador protected estabelece um nível de acesso intermediário, permitindo que a visibilidade ocorra para todas as classes pertencentes ao mesmo pacote e, também, para classes filhas (subclasses) localizadas em pacotes distintos.",
        "A ausência de uma palavra-chave de modificador caracteriza o acesso default (padrão ou de pacote), que possui as mesmas regras de visibilidade do protected, estendendo o acesso para subclasses em qualquer lugar do projeto."
      ],
      question: "É correto o que se afirma em:",
      options: [
        "III e IV, apenas.",
        "I, II e III, apenas.",
        "I e II, apenas.",
        "I, III e IV, apenas."
      ],
      answer: 1,
      feedback: "✓ Resposta correta: B) I, II e III, apenas.\n\nPor que está certa:\nI está correta — public é o modificador mais permissivo, acessível de qualquer lugar. II está correta — private restringe o acesso apenas à própria classe. III está correta — protected permite acesso no mesmo pacote e em subclasses de outros pacotes. IV está errada — o acesso default (sem modificador) NÃO é igual ao protected; ele permite acesso apenas dentro do mesmo pacote, mas NÃO estende para subclasses em pacotes diferentes."
    },

    {
      aula: "Programação Orientada a Objetos",
      tipo: "Contextualizada",
      texto: "No desenvolvimento de um gateway de pagamentos que suportará múltiplas operadoras de cartão de crédito, a equipe de arquitetura exige que haja um alto nível de desacoplamento. Cada operadora terá sua própria implementação técnica, mas o núcleo do sistema deve se comunicar com elas de forma padronizada. No desenvolvimento de sistemas orientados a objetos, abstrações são amplamente utilizadas para definir contratos de comportamento estritos entre diferentes componentes de software, sem expor os detalhes lógicos de como as operações são realizadas internamente na memória.",
      question: "Considerando a necessidade de padronização arquitetural descrita para o gateway de pagamentos, assinale a alternativa que define corretamente o papel estrutural de uma Interface na linguagem Java.",
      options: [
        "Forçar a implementação exclusiva de múltiplos construtores padronizados.",
        "Instanciar objetos de forma direta para contornar restrições de memória.",
        "Substituir totalmente o uso de classes abstratas no paradigma de objetos.",
        "Estabelecer assinaturas de métodos que as classes concretas implementarão."
      ],
      answer: 3,
      feedback: "✓ Resposta correta: D) Estabelecer assinaturas de métodos que as classes concretas implementarão.\n\nPor que está certa:\nUma interface em Java define um contrato — ela declara as assinaturas dos métodos (sem implementação) que as classes concretas devem implementar. Isso garante padronização e desacoplamento: o núcleo do gateway se comunica com a interface, sem precisar conhecer a implementação específica de cada operadora. As outras alternativas estão erradas: interfaces não podem ter construtores, não instanciam objetos e não substituem totalmente classes abstratas."
    },

    {
      aula: "Programação Orientada a Objetos",
      tipo: "Asserção",
      texto: "A essência da Programação Orientada a Objetos reside na distinção fundamental e na relação intrínseca entre classes e objetos. Uma classe pode ser compreendida como uma planta arquitetônica ou um gabarito estrutural que define os dados e as operações pertinentes a uma entidade. Quando um programa entra em execução, essa planta é utilizada para construir objetos na memória, sendo que cada objeto atua como uma entidade independente, armazenando seu próprio conjunto de dados (estado) que pode ser manipulado pelos métodos definidos na classe.",
      miniEnunciado: "Considere o seguinte código Java, que simula as operações de uma conta bancária:",
      code:
`public class ContaBancaria {
  private String titular;
  private double saldo;
  public ContaBancaria(String titular, double saldoInicial) {
    this.titular = titular;
    this.saldo = saldoInicial;
  }
  public void depositar(double valor) { this.saldo += valor; }
  public void exibirInformacoes() {
    System.out.println("Titular: " + this.titular + " | Saldo: " + this.saldo);
  }
  public static void main(String[] args) {
    ContaBancaria minhaConta = new ContaBancaria("Maria", 100.0);
    minhaConta.depositar(50.0);
    minhaConta.exibirInformacoes();
  }
}`,
      assertions: [
        "A execução do método main resultará na impressão da mensagem \"Titular: Maria | Saldo: 150.0\" no console, evidenciando a alteração do estado interno do objeto após a invocação do método depositar.",
        "[PORQUE] A instrução new ContaBancaria(\"Maria\", 100.0) instanciou um objeto alocando em memória seus atributos próprios de forma encapsulada, o que permitiu que o método depositar(50.0) acessasse e somasse o valor fornecido estritamente ao saldo pertencente a essa instância específica."
      ],
      question: "A respeito dessas asserções, assinale a opção correta.",
      options: [
        "As asserções I e II são proposições verdadeiras, mas a II não é uma justificativa correta da I.",
        "A asserção I é uma proposição verdadeira, e a II é uma proposição falsa.",
        "As asserções I e II são proposições falsas.",
        "As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I."
      ],
      answer: 3,
      feedback: "✓ Resposta correta: D) As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I.\n\nPor que está certa:\nA primeira asserção é verdadeira — o código inicia com saldo 100.0, deposita 50.0 e imprime 150.0. A segunda também é verdadeira e justifica a primeira: o new instancia o objeto com seus atributos encapsulados em memória, e é exatamente por isso que depositar() opera sobre o saldo daquela instância específica, resultando na saída correta."
    },

    {
      aula: "Programação Orientada a Objetos",
      tipo: "Afirmativas",
      texto: "Em um sistema de gestão escolar orientado a objetos, a equipe de desenvolvimento precisa modelar diferentes tipos de usuários — professores, alunos e coordenadores — que compartilham comportamentos comuns, mas também possuem responsabilidades específicas. Para isso, o arquiteto de software propõe o uso de herança como mecanismo principal de estruturação das classes. Herança é um mecanismo fundamental da POO que permite que uma classe (subclasse) adquira atributos e métodos de outra classe (superclasse), promovendo reuso e possibilitando polimorfismo no sistema.\n\nNo que se refere à herança na Programação Orientada a Objetos, avalie as afirmativas a seguir:",
      assertions: [
        "Herança pode ser utilizada como base para a implementação de polimorfismo.",
        "Herança permite reutilização de código entre classes relacionadas.",
        "Todo método herdado é obrigatoriamente sobrescrito na subclasse."
      ],
      question: "Assinale a opção correta.",
      options: [
        "II, apenas.",
        "I e II, apenas.",
        "I, apenas.",
        "I, II e III."
      ],
      answer: 1,
      feedback: "✓ Resposta correta: B) I e II, apenas.\n\nPor que está certa:\nI está correta — a herança é base para o polimorfismo, pois uma subclasse pode sobrescrever métodos da superclasse e objetos podem ser referenciados pelo tipo da superclasse. II está correta — herança permite que subclasses reutilizem código da superclasse. III está errada — a subclasse NÃO é obrigada a sobrescrever métodos herdados; ela pode utilizá-los diretamente sem nenhuma alteração."
    },

    {
      aula: "Programação Orientada a Objetos",
      tipo: "Análise de Código",
      texto: "No desenvolvimento de um sistema de cadastro de clientes para uma clínica veterinária, a equipe de TI precisou modelar a entidade Animal de forma que seus dados internos não pudessem ser acessados ou alterados diretamente por outras partes do sistema. Para isso, o desenvolvedor adotou uma abordagem que oculta o estado interno do objeto e fornece métodos específicos para leitura e escrita controlada dos dados.",
      miniEnunciado: "Considere o seguinte código em Java:",
      code:
`public class Animal {
  private String nome;
  public String getNome() { return nome; }
  public void setNome(String nome) { this.nome = nome; }
}`,
      question: "Considerando os princípios da Programação Orientada a Objetos e a forma como os atributos são manipulados na classe apresentada, o código exemplifica principalmente o conceito de:",
      options: [
        "Polimorfismo",
        "Herança",
        "Abstração",
        "Encapsulamento"
      ],
      answer: 3,
      feedback: "✓ Resposta correta: D) Encapsulamento.\n\nPor que está certa:\nO código declara o atributo nome como private (ocultando o estado interno) e fornece métodos públicos getNome() e setNome() para controlar o acesso — isso é encapsulamento. Polimorfismo envolve múltiplas formas de um método; herança envolve extends/relação entre classes; abstração envolve ocultar complexidade por meio de classes abstratas/interfaces."
    },

    {
      aula: "Programação Orientada a Objetos",
      tipo: "Análise de Código",
      texto: "Uma empresa de locação de veículos está desenvolvendo um sistema orientado a objetos para gerenciar sua frota. O analista de sistemas criou uma hierarquia de classes para representar os diferentes tipos de veículos disponíveis para aluguel, utilizando herança para reaproveitar características comuns.",
      miniEnunciado: "Considere o seguinte código:",
      code:
`public class Veiculo {
  private String marca;
  public Veiculo(String marca) { this.marca = marca; }
}

public class Carro extends Veiculo {
  public Carro(String marca) { super(marca); }
}`,
      assertions: [
        "A classe Carro herda atributos e métodos da classe Veiculo.",
        "A palavra-chave extends é utilizada em Java para indicar herança.",
        "A classe Veiculo não pode ser instanciada diretamente."
      ],
      question: "No que se refere ao código exibido acima, é correto o que se afirma em:",
      options: [
        "II e III apenas",
        "I apenas",
        "I e II apenas",
        "I, II e III"
      ],
      answer: 2,
      feedback: "✓ Resposta correta: C) I e II apenas.\n\nPor que está certa:\nI está correta — Carro herda de Veiculo via extends, obtendo seus atributos e métodos. II está correta — extends é a palavra-chave Java para declarar herança. III está errada — Veiculo é uma classe concreta comum e PODE ser instanciada diretamente (ex: new Veiculo(\"Ford\")). Para não poder ser instanciada, precisaria ser declarada como abstract."
    },

    {
      aula: "Programação Orientada a Objetos",
      tipo: "Análise de Código",
      texto: "Uma plataforma de streaming de áudio deseja implementar um módulo de reprodução que suporte diferentes fontes de som — como cachorros, gatos e pássaros — em uma seção de sons da natureza. O desenvolvedor percebeu que, embora todos os animais emitam sons, cada espécie possui sua própria forma de fazê-lo. Para tratar esses animais de maneira uniforme no código, ele utilizou uma referência do tipo base Animal.",
      miniEnunciado: "Considere o seguinte trecho de código:",
      code:
`Animal a;
a = new Cachorro();
a.emitirSom();
a = new Gato();
a.emitirSom();`,
      question: "O código apresentado ilustra um exemplo do conceito de programação orientada a objetos denominado:",
      options: [
        "Herança.",
        "Abstração.",
        "Encapsulamento.",
        "Polimorfismo."
      ],
      answer: 3,
      feedback: "✓ Resposta correta: D) Polimorfismo.\n\nPor que está certa:\nO polimorfismo permite que uma referência do tipo Animal aponte para objetos de tipos diferentes (Cachorro, Gato) e que o método emitirSom() se comporte de forma diferente para cada tipo em tempo de execução. É o polimorfismo de subtipo (ou polimorfismo de inclusão), onde a mesma chamada de método produz resultados distintos dependendo do objeto real referenciado."
    },

    {
      aula: "Programação Orientada a Objetos",
      tipo: "Contextualizada",
      texto: "Uma empresa de tecnologia financeira está desenvolvendo um sistema de processamento de pagamentos que precisa integrar múltiplos métodos — cartão de crédito, PIX, boleto e carteiras digitais. O arquiteto de software propôs o uso de um mecanismo da Programação Orientada a Objetos que permita definir um contrato comum para todos os métodos de pagamento, garantindo que cada implementação forneça os comportamentos esperados pelo sistema, sem que o núcleo do processamento precise conhecer os detalhes de cada meio de pagamento. Em Java, o conceito de interface é fundamental para o design de sistemas desacoplados e extensíveis. Uma interface define um contrato que as classes concretas devem cumprir, sem especificar como as operações serão realizadas internamente.",
      question: "Em Java, uma interface é utilizada para:",
      options: [
        "criar objetos diretamente",
        "definir atributos privados compartilhados entre classes",
        "substituir completamente as classes abstratas",
        "definir métodos que devem ser implementados por outras classes"
      ],
      answer: 3,
      feedback: "✓ Resposta correta: D) definir métodos que devem ser implementados por outras classes.\n\nPor que está certa:\nUma interface em Java define assinaturas de métodos (contrato) que as classes que a implementam são obrigadas a fornecer implementação concreta. Interfaces não podem criar objetos diretamente (não têm construtores), não definem atributos privados de instância, e não substituem completamente classes abstratas — ambos coexistem com propósitos complementares."
    },

  ],

};