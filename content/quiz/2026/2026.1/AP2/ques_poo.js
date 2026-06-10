// ============================================================
// NEXUS STUDY — quiz/conteudo/2026/AP2/poo.js
// Questões de Programação Orientada a Objetos (POO)
// Formato v1: question, options, answer, feedback, code, etc.
// ============================================================

window.questoes = {

  /* ── QUESTÕES PRÁTICAS ──────────────────────────────── */
  questoes: [
    // aula 12: Introdução ao JavaFX

    // 1 - o que é JavaFX
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Explicativa",

      texto: "O JavaFX é um framework moderno da linguagem Java voltado para a criação de interfaces gráficas (GUI). Ele surgiu como substituto do Swing, trazendo suporte a estilização via CSS e separação entre interface e lógica por meio do FXML. Com ele, é possível construir aplicações visuais interativas seguindo boas práticas de programação.",

      question: "Qual é a principal vantagem do JavaFX em relação ao Swing?",

      options: [
        "O JavaFX é mais antigo e por isso mais estável",
        "O JavaFX oferece suporte a CSS e FXML, tornando-o mais moderno e organizado",
        "O JavaFX elimina completamente a necessidade de usar Java",
        "O JavaFX só funciona para aplicações web"
      ],

      answer: 1,

      feedback: "O JavaFX é considerado mais moderno por suportar ==def==CSS== para estilização e FXML para separação entre design e código, algo que o Swing não oferece nativamente."
    },

    // 2 - hierarquia Stage Scene Nodes
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Explicativa",

      texto: "Toda aplicação JavaFX é organizada em três camadas: o Stage, que representa a janela; a Scene, que é o conteúdo exibido dentro da janela; e os Nodes, que são os elementos visuais como botões, textos e campos. Essa hierarquia segue sempre a ordem: Stage → Scene → Nodes.",

      question: "Em uma aplicação JavaFX, qual elemento representa a janela principal do programa?",

      options: [
        "Node",
        "Scene",
        "Stage",
        "Label"
      ],

      answer: 2,

      feedback: "O ==def==Stage== é a janela principal da aplicação. Dentro dele existe uma Scene, e dentro da Scene estão os Nodes — os elementos visuais."
    },

    // 3 - Scene dinâmica
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Contextualizada",

      texto: "A Scene no JavaFX funciona como o espaço onde toda a interface é montada. Ela define o tamanho da área visível e pode ser trocada dinamicamente durante a execução do programa. Isso significa que, sem fechar a janela (Stage), é possível substituir um formulário de login por uma tela principal, por exemplo, simplesmente carregando uma nova Scene.",

      question: "Por que a possibilidade de trocar a Scene dinamicamente é útil no JavaFX?",

      options: [
        "Porque evita que o programa precise de mais de um Stage para exibir telas diferentes",
        "Porque obriga o usuário a reiniciar o programa a cada mudança de tela",
        "Porque a Scene define o número máximo de Nodes permitidos",
        "Porque sem isso o Stage não consegue exibir elementos visuais"
      ],

      answer: 0,

      feedback: "Trocar a Scene dinamicamente permite navegar entre diferentes telas da aplicação sem precisar criar ou fechar múltiplas janelas, tornando a experiência mais fluida."
    },

    // 4 - Nodes componentes
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Explicativa",

      texto: "No JavaFX, tudo que aparece na tela é chamado de Node. Botões, rótulos de texto, campos de entrada, imagens — todos são tipos de Node. Eles compartilham uma classe base comum chamada Node, o que permite aplicar propriedades e comportamentos de forma uniforme em diferentes componentes.",

      question: "O que têm em comum elementos como Button, Label e TextField no JavaFX?",

      options: [
        "Todos são subclasses da classe Stage",
        "Todos herdam da classe Node",
        "Todos precisam ser declarados dentro do FXML obrigatoriamente",
        "Todos só funcionam dentro de um VBox"
      ],

      answer: 1,

      feedback: "Button, Label e TextField são exemplos de Nodes. Todos herdam da classe ==def==Node==, que é a base de qualquer elemento visual no JavaFX."
    },

    // 5 - layouts organização
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Aplicação",

      texto: "Imagine que você precisa criar uma tela de cadastro com um campo de nome, um campo de e-mail e um botão de confirmação, todos alinhados verticalmente. No JavaFX, em vez de posicionar cada elemento com coordenadas fixas de X e Y, você utiliza um layout chamado VBox. Ele organiza automaticamente os componentes em coluna, facilitando a manutenção e evitando problemas com diferentes tamanhos de tela.",

      question: "Para organizar elementos em coluna de forma automática no JavaFX, qual layout deve ser utilizado?",

      options: [
        "HBox",
        "GridPane",
        "BorderPane",
        "VBox"
      ],

      answer: 3,

      feedback: "O ==proc==VBox== empilha os elementos verticalmente de forma automática. O HBox faz o mesmo, mas na horizontal. Usar layouts é preferível a posicionamento fixo."
    },

    // 6 - MVC divisão
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Contextualizada",

      texto: "A arquitetura MVC divide uma aplicação em três partes bem definidas: o Model, responsável pelos dados e regras de negócio; a View, que cuida da interface visual; e o Controller, que conecta as ações do usuário à lógica do sistema. No JavaFX, essa separação ajuda a manter o código organizado, com baixo acoplamento entre as partes, facilitando testes e futuras manutenções.",

      question: "No padrão MVC aplicado ao JavaFX, qual componente é responsável por processar as ações do usuário e coordenar a resposta do sistema?",

      options: [
        "Model",
        "Node",
        "View",
        "Controller"
      ],

      answer: 3,

      feedback: "O ==def==Controller== é o intermediário entre a View e o Model. Ele recebe os eventos disparados pelo usuário na interface e decide como o sistema deve reagir."
    },

    // 7 - FXML separação
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Explicativa",

      texto: "O FXML é um formato de arquivo baseado em XML usado pelo JavaFX para descrever a interface gráfica de forma separada do código Java. Com ele, designers podem trabalhar na estrutura visual usando ferramentas como o Scene Builder, enquanto desenvolvedores cuidam da lógica no código. Isso reduz o acoplamento entre design e programação.",

      question: "Qual é o principal benefício de usar FXML no desenvolvimento de interfaces com JavaFX?",

      options: [
        "Eliminar a necessidade de usar Java no projeto",
        "Separar a definição da interface visual do código de lógica",
        "Aumentar a velocidade de execução da aplicação",
        "Substituir o uso de layouts como VBox e HBox"
      ],

      answer: 1,

      feedback: "O FXML permite que a ==rule==interface seja descrita separadamente da lógica==, favorecendo a divisão de responsabilidades e o trabalho colaborativo entre design e desenvolvimento."
    },

    // 8 - eventos lambda
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Aplicação",

      texto: "Quando um usuário clica em um botão, o JavaFX precisa saber o que fazer. Para isso, usamos eventos. No JavaFX moderno, os eventos são definidos com expressões lambda, que permitem escrever a ação de forma compacta diretamente no código. Por exemplo: ao chamar setOnAction em um botão e passar uma expressão lambda, você define o comportamento que ocorre no momento do clique.",

      question: "No JavaFX, como é chamado o método usado para definir a ação de um botão quando ele é clicado?",

      options: [
        "addClickListener",
        "setOnAction",
        "handleEvent",
        "onClick"
      ],

      answer: 1,

      feedback: "O método ==proc==setOnAction== é usado para associar um comportamento a um botão. Ele recebe uma expressão lambda que define o que acontece quando o usuário clica."
    },

    // 9 - POO e JavaFX
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Contextualizada",

      texto: "O JavaFX foi projetado para trabalhar em harmonia com a Programação Orientada a Objetos. Cada tela pode ser representada como uma classe, os componentes visuais são objetos, e é possível aplicar herança para reutilizar comportamentos comuns entre telas. Encapsulamento e polimorfismo também aparecem naturalmente ao trabalhar com Nodes e Controllers, facilitando a aplicação dos princípios SOLID.",

      question: "Como o JavaFX se relaciona com os conceitos de Programação Orientada a Objetos?",

      options: [
        "O JavaFX ignora POO e usa uma abordagem procedural",
        "Cada tela, componente e controller pode ser modelado como uma classe ou objeto, aplicando herança e encapsulamento",
        "O JavaFX só permite uso de POO por meio do FXML",
        "A POO é usada apenas nos Nodes, não nas telas"
      ],

      answer: 1,

      feedback: "O JavaFX foi construído sobre POO: telas são classes, componentes são objetos e conceitos como ==rule==herança e encapsulamento== aparecem naturalmente em toda a estrutura da aplicação."
    },

    // 10 - fluxo de inicialização
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Aplicação",

      texto: "Ao criar uma aplicação JavaFX, existe um fluxo padrão de inicialização. O método main chama launch(), que por sua vez aciona o método start(). Dentro do start(), o desenvolvedor cria a Scene com os elementos desejados, associa essa Scene ao Stage e chama show() para exibir a janela. Entender esse fluxo é essencial para estruturar qualquer projeto JavaFX corretamente.",

      question: "Qual é a ordem correta do fluxo de inicialização de uma aplicação JavaFX?",

      options: [
        "start() → launch() → show()",
        "Scene → Stage → Node → launch()",
        "launch() → start() → criação da Scene → Stage exibe com show()",
        "main() → show() → start() → launch()"
      ],

      answer: 2,

      feedback: "O fluxo correto é: ==proc==launch()== inicia a aplicação, chama start(), onde a Scene é montada e associada ao Stage, que então é exibido com show()."
    },

    // aula 13: JavaFX Avançado

    // 11 - papel do FXML
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Explicativa",

      texto: "O FXML é um arquivo baseado em XML que descreve a estrutura visual de uma aplicação JavaFX. Ele funciona de forma parecida com o HTML em páginas web: define o que aparece na tela, mas não contém nenhuma lógica de programação. Toda a lógica fica em uma classe separada chamada Controller, mantendo a interface limpa e organizada.",

      question: "Qual é a função do FXML dentro de uma aplicação JavaFX?",

      options: [
        "Executar a lógica de validação dos dados do formulário",
        "Definir a estrutura visual da interface sem conter lógica de programação",
        "Substituir completamente o uso de classes Java no projeto",
        "Conectar diretamente o banco de dados à interface"
      ],

      answer: 1,

      feedback: "O ==def==FXML== descreve a interface gráfica de forma declarativa, separando o design da lógica. A lógica fica no Controller, que é referenciado pelo FXML via atributo fx:controller."
    },

    // 12 - responsabilidades do Controller
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Explicativa",

      texto: "O Controller é a classe Java responsável por controlar o comportamento da interface. Ele recebe os eventos disparados pelo usuário, como cliques e digitações, processa as informações necessárias e atualiza os elementos visuais conforme o resultado. É ele quem faz a ponte entre o que o usuário vê e o que o sistema executa.",

      question: "Qual das alternativas descreve corretamente a responsabilidade do Controller no JavaFX?",

      options: [
        "Armazenar os dados permanentes da aplicação no banco",
        "Definir o layout e as cores da interface gráfica",
        "Receber eventos, processar dados e atualizar a interface",
        "Carregar o arquivo FXML e criar a Scene principal"
      ],

      answer: 2,

      feedback: "O ==def==Controller== é o intermediário entre a View e o Model. Ele captura eventos do usuário, executa a lógica necessária e reflete o resultado de volta na interface."
    },

    // 13 - fluxo MVC
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Contextualizada",

      texto: "Na arquitetura MVC aplicada ao JavaFX, cada parte do sistema tem uma responsabilidade clara. A View, definida no FXML, é o que o usuário enxerga. O Controller recebe as ações do usuário e coordena o que deve acontecer. O Model contém os dados e as regras do negócio, como uma classe Usuario com atributos e métodos. O fluxo segue sempre a ordem: View → Controller → Model.",

      question: "No fluxo MVC do JavaFX, quando o usuário clica em um botão de salvar, qual é a sequência correta de comunicação?",

      options: [
        "Model → View → Controller",
        "Controller → View → Model",
        "View → Controller → Model",
        "FXML → Model → Stage"
      ],

      answer: 2,

      feedback: "O fluxo correto é ==rule==View → Controller → Model==. A interface captura a ação, o Controller a processa e, se necessário, acessa ou atualiza o Model com os dados."
    },

    // 14 - anotação @FXML
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Aplicação",

      texto: "Imagine que você criou um campo de texto no FXML com o atributo fx:id='txtNome' e precisa acessar esse campo dentro do Controller para ler o que o usuário digitou. Para isso, você declara o campo no Controller usando a anotação @FXML antes da variável. Essa anotação informa ao JavaFX que aquele atributo deve ser ligado automaticamente ao componente definido no arquivo FXML.",

      question: "Para que serve a anotação @FXML utilizada em atributos e métodos do Controller?",

      options: [
        "Para marcar que o método será executado em segundo plano",
        "Para indicar que o atributo ou método está vinculado a um elemento definido no arquivo FXML",
        "Para tornar o componente invisível na interface",
        "Para declarar que a variável é estática e compartilhada entre telas"
      ],

      answer: 1,

      feedback: "A anotação ==def==@FXML== conecta os atributos e métodos do Controller aos elementos declarados no arquivo FXML, permitindo que o código Java acesse e manipule os componentes visuais."
    },

    // 15 - binding automático
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Explicativa",

      texto: "O Binding é um recurso do JavaFX que cria uma ligação automática entre propriedades de dois componentes. Quando uma propriedade muda, a outra é atualizada automaticamente, sem necessidade de código manual. Por exemplo, é possível vincular o texto de um Label ao texto digitado em um TextField, fazendo com que o Label exiba em tempo real o que o usuário escreve.",

      question: "Qual é o principal benefício de usar Binding no JavaFX em vez de atualizar manualmente os componentes?",

      options: [
        "Aumentar a segurança dos dados digitados pelo usuário",
        "Eliminar a necessidade de usar o Controller na aplicação",
        "Reduzir o código necessário e manter a interface atualizada automaticamente",
        "Melhorar o desempenho do carregamento do arquivo FXML"
      ],

      answer: 2,

      feedback: "O ==def==Binding== cria uma sincronização automática entre propriedades. Quando o valor de uma muda, a outra acompanha sem que seja necessário escrever código de atualização manual."
    },

    // 16 - binding desabilitar botão
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Aplicação",

      texto: "Uma boa prática de usabilidade é desabilitar um botão enquanto um campo obrigatório ainda estiver vazio, evitando que o usuário tente salvar sem preencher as informações. No JavaFX, isso pode ser feito com Binding: basta vincular a propriedade disableProperty do botão à propriedade isEmpty do TextField. Assim, o botão fica desativado automaticamente sempre que o campo estiver em branco.",

      question: "O que acontece quando a propriedade disableProperty de um botão é vinculada via Binding à propriedade isEmpty de um TextField?",

      options: [
        "O botão some da tela enquanto o campo está vazio",
        "O botão muda de cor quando o campo é preenchido",
        "O botão fica desabilitado automaticamente enquanto o campo estiver vazio",
        "O botão é removido do layout ao detectar o campo vazio"
      ],

      answer: 2,

      feedback: "Ao usar ==proc==Binding com disableProperty e isEmpty==, o botão é desativado automaticamente enquanto o campo estiver vazio e reativado assim que o usuário digitar algo, sem nenhum código de evento adicional."
    },

    // 17 - classe Model
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Contextualizada",

      texto: "Na arquitetura MVC, o Model é a camada responsável por representar os dados da aplicação. No JavaFX, isso geralmente é feito com classes Java comuns que contêm atributos privados e métodos de acesso. Por exemplo, uma classe Usuario pode ter o atributo nome e um método getNome(). O Controller cria objetos dessa classe para armazenar e manipular as informações coletadas da interface.",

      question: "Qual é o papel da classe Model dentro da arquitetura MVC no JavaFX?",

      options: [
        "Definir a aparência visual dos componentes da tela",
        "Gerenciar os eventos de clique e digitação do usuário",
        "Representar e armazenar os dados da aplicação",
        "Carregar e exibir o arquivo FXML na janela principal"
      ],

      answer: 2,

      feedback: "O ==def==Model== encapsula os dados da aplicação. Ele não sabe nada sobre a interface — apenas contém atributos, construtores e métodos de acesso que o Controller utiliza para manipular as informações."
    },

    // 18 - validação no Controller
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Aplicação",

      texto: "Quando um usuário clica em salvar em um formulário, o Controller precisa verificar se os dados estão corretos antes de prosseguir. Esse processo é chamado de validação. No JavaFX, o Controller acessa o valor do campo com getText(), verifica se está vazio usando isEmpty() e, dependendo do resultado, exibe uma mensagem de erro ou de sucesso em um Label da interface.",

      question: "No fluxo de validação de um formulário JavaFX, o que o Controller deve fazer quando detecta que o campo de nome está vazio?",

      options: [
        "Criar um novo Stage e abrir uma segunda janela automaticamente",
        "Ignorar o campo e salvar os outros dados normalmente",
        "Exibir uma mensagem de erro na interface e interromper o processamento",
        "Reiniciar a aplicação para limpar os campos"
      ],

      answer: 2,

      feedback: "Quando o campo está vazio, o Controller deve informar o usuário por meio de um Label ou alerta e usar ==proc==return== para interromper a execução do método, evitando que dados inválidos sejam processados."
    },

    // 19 - carregamento do FXML no Main
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Explicativa",

      texto: "A classe principal de uma aplicação JavaFX com FXML usa o FXMLLoader para carregar o arquivo de interface. Esse carregador lê o FXML, constrói todos os componentes declarados nele e já conecta o Controller automaticamente. O resultado é uma Scene pronta, que é então associada ao Stage e exibida com o método show().",

      question: "Qual é a função do FXMLLoader na classe principal de uma aplicação JavaFX?",

      options: [
        "Validar se o arquivo FXML possui erros de sintaxe antes de compilar",
        "Ler o arquivo FXML, montar os componentes e conectar o Controller automaticamente",
        "Substituir o uso do Stage ao carregar a interface",
        "Converter o FXML em um arquivo HTML para exibição no navegador"
      ],

      answer: 1,

      feedback: "O ==proc==FXMLLoader== lê o arquivo FXML e reconstrói toda a estrutura visual em memória, incluindo a ligação com o Controller indicado pelo atributo fx:controller. O resultado é usado para criar a Scene."
    },

    // 20 - organização do projeto MVC
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Contextualizada",

      texto: "Um projeto JavaFX bem estruturado segue uma organização de pastas que reflete a arquitetura MVC. O arquivo Main.java fica na raiz do projeto, os arquivos FXML ficam na pasta view, os Controllers ficam na pasta controller e as classes de dados ficam na pasta model. Essa separação física torna o projeto mais fácil de entender, manter e expandir com o tempo.",

      question: "Por que organizar os arquivos de um projeto JavaFX em pastas separadas para view, controller e model é considerado uma boa prática?",

      options: [
        "Porque o JavaFX exige essa estrutura para compilar o projeto corretamente",
        "Porque separa visualmente as responsabilidades, facilitando a manutenção e o entendimento do código",
        "Porque essa estrutura reduz automaticamente o tamanho do arquivo gerado",
        "Porque sem essa organização o FXMLLoader não consegue localizar os arquivos"
      ],

      answer: 1,

      feedback: "A organização em pastas reflete a ==rule==separação de responsabilidades do MVC==. Ela não é imposta pelo JavaFX, mas é uma convenção que torna o projeto mais legível, escalável e fácil de manter em equipe."
    }
  ],


  /* ── QUESTÕES AVA ───────────────────────────────────── */
  fixacao: [

    // aula 12: Introdução ao JavaFX

    // 1 - o que é JavaFX
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Direta",

      texto: "JavaFX é o framework moderno da linguagem Java para criação de interfaces gráficas desktop.",

      question: "Qual framework o JavaFX veio substituir no ecossistema Java?",

      options: [
        "Spring",
        "Hibernate",
        "Swing",
        "JSF"
      ],

      answer: 2,

      feedback: "O JavaFX foi criado como substituto mais moderno do Swing, trazendo suporte a CSS, FXML e melhor integração com POO."
    },

    // 2 - hierarquia básica
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Direta",

      texto: "A estrutura básica de uma aplicação JavaFX segue uma hierarquia de três elementos principais.",

      question: "Qual é a ordem correta da hierarquia de elementos no JavaFX?",

      options: [
        "Scene → Stage → Nodes",
        "Nodes → Scene → Stage",
        "Stage → Scene → Nodes",
        "Stage → Nodes → Scene"
      ],

      answer: 2,

      feedback: "A hierarquia correta é Stage (janela) → Scene (conteúdo) → Nodes (elementos visuais). Cada nível contém o seguinte."
    },

    // 3 - função do Stage
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Curta",

      texto: "O Stage é o elemento de mais alto nível em uma aplicação JavaFX.",

      question: "Quantas Scenes um Stage pode exibir ao mesmo tempo?",

      options: [
        "Ilimitadas, conforme a memória disponível",
        "Duas, uma principal e uma secundária",
        "Apenas uma Scene ativa por vez",
        "Três, uma por aba da aplicação"
      ],

      answer: 2,

      feedback: "O Stage suporta apenas uma Scene ativa por vez. Para navegar entre telas, a Scene é trocada dinamicamente no mesmo Stage."
    },

    // 4 - layouts disponíveis
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Contexto",

      texto: "Um desenvolvedor precisa organizar três botões lado a lado horizontalmente em uma tela JavaFX, sem usar coordenadas fixas.",

      question: "Qual layout é mais adequado para organizar elementos na horizontal de forma automática?",

      options: [
        "VBox",
        "GridPane",
        "HBox",
        "BorderPane"
      ],

      answer: 2,

      feedback: "O HBox organiza os elementos horizontalmente de forma automática. O VBox faz o equivalente na vertical. Ambos evitam o uso de coordenadas fixas."
    },

    // 5 - Nodes e componentes
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Direta",

      texto: "No JavaFX, todos os elementos visuais que aparecem na tela compartilham uma classe base comum.",

      question: "Qual é a classe base de todos os elementos visuais no JavaFX?",

      options: [
        "Scene",
        "Component",
        "Widget",
        "Node"
      ],

      answer: 3,

      feedback: "Todos os elementos visuais do JavaFX, como Button, Label e TextField, herdam da classe Node, que é a base do grafo de cena."
    },

    // 6 - FXML propósito
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Contexto",

      texto: "Em uma equipe com designers e desenvolvedores trabalhando juntos em um projeto JavaFX, o arquiteto decidiu usar FXML para definir as telas.",

      question: "Qual é o principal benefício do FXML nesse cenário de equipe mista?",

      options: [
        "Permite que os designers editem a interface visualmente sem depender do código Java dos desenvolvedores",
        "Elimina a necessidade de usar o Controller para tratar eventos",
        "Aumenta a velocidade de execução ao compilar a interface previamente",
        "Permite que a interface seja executada diretamente no navegador"
      ],

      answer: 0,

      feedback: "O FXML separa a definição visual do código Java. Ferramentas como o Scene Builder permitem que designers editem a interface sem tocar no código Java."
    },

    // 7 - eventos com lambda
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Código",

      texto: "O trecho abaixo define o comportamento de um botão em JavaFX:",

      code: `btn.setOnAction(e -> {
    System.out.println("Clicado!");
  });`,

      question: "O que o trecho de código acima faz quando o botão é pressionado?",

      options: [
        "Remove o botão da tela após o primeiro clique",
        "Exibe a mensagem 'Clicado!' no console ao pressionar o botão",
        "Cria uma nova Scene com um botão adicional",
        "Lança uma exceção indicando que o evento não foi registrado"
      ],

      answer: 1,

      feedback: "O método setOnAction associa uma expressão lambda ao evento de clique. Quando o botão é pressionado, o bloco é executado e imprime 'Clicado!' no console."
    },

    // 8 - MVC camadas
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Direta",

      texto: "O padrão arquitetural MVC divide a aplicação em três camadas com responsabilidades distintas.",

      question: "No padrão MVC, qual camada é responsável pelos dados e pelas regras de negócio?",

      options: [
        "View",
        "Controller",
        "Model",
        "Stage"
      ],

      answer: 2,

      feedback: "O Model é a camada responsável pelos dados e regras de negócio. A View cuida da interface e o Controller conecta as ações do usuário à lógica do sistema."
    },

    // 9 - POO no JavaFX
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Contexto",

      texto: "Um desenvolvedor organizou seu projeto JavaFX criando uma classe separada para cada tela do sistema, encapsulando os componentes e ações dentro de cada uma.",

      question: "Qual princípio de Programação Orientada a Objetos essa abordagem reforça principalmente?",

      options: [
        "Abstração, pois as telas ocultam detalhes de implementação do usuário final",
        "Encapsulamento, pois os componentes e comportamentos ficam agrupados dentro de suas classes",
        "Polimorfismo, pois cada tela pode ser substituída por outra sem alterar o Stage",
        "Herança, pois todas as telas estendem obrigatoriamente a classe Application"
      ],

      answer: 1,

      feedback: "Criar uma classe por tela reforça o encapsulamento: cada classe agrupa e protege seus próprios componentes e comportamentos, isolando sua implementação."
    },

    // 10 - fluxo de inicialização
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Código",

      texto: "O código abaixo representa a estrutura mínima de uma aplicação JavaFX:",

      code: `public class App extends Application {
    @Override
    public void start(Stage stage) {
      Label label = new Label("Olá!");
      Scene scene = new Scene(label, 300, 200);
      stage.setScene(scene);
      stage.show();
    }

    public static void main(String[] args) {
      launch(args);
    }
  }`,

      question: "Qual método é responsável por iniciar o ciclo de vida da aplicação JavaFX neste código?",

      options: [
        "start()",
        "show()",
        "main()",
        "launch()"
      ],

      answer: 3,

      feedback: "O método launch() é o ponto de entrada do ciclo de vida JavaFX. Ele é chamado dentro do main() e internamente aciona o método start(), onde a interface é montada."
    },

    // aula 13: JavaFX Avançado

    // 11 - função do FXML avançado
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Direta",

      texto: "No JavaFX avançado, o FXML é comparado ao HTML de uma aplicação web.",

      question: "O que essa comparação indica sobre o papel do FXML?",

      options: [
        "Que o FXML pode ser executado diretamente em navegadores como o Chrome",
        "Que o FXML define a estrutura visual da interface de forma declarativa, sem conter lógica",
        "Que o FXML substitui completamente o uso de classes Java na aplicação",
        "Que o FXML é interpretado pelo servidor antes de ser enviado ao cliente"
      ],

      answer: 1,

      feedback: "Assim como o HTML descreve a estrutura de uma página web sem conter lógica de programação, o FXML descreve a estrutura visual da interface JavaFX de forma declarativa."
    },

    // 12 - anotação @FXML
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Código",

      texto: "O trecho abaixo mostra parte de um Controller JavaFX:",

      code: `public class FormController {
    @FXML
    private TextField txtNome;

    @FXML
    private void salvar() {
      System.out.println(txtNome.getText());
    }
  }`,

      question: "Para que serve a anotação @FXML nos atributos e métodos deste Controller?",

      options: [
        "Para declarar que o atributo é público e acessível por outras classes",
        "Para indicar que o elemento deve ser vinculado ao componente correspondente definido no arquivo FXML",
        "Para marcar o método como thread-safe e executá-lo em background",
        "Para substituir o construtor padrão da classe ao carregar o FXML"
      ],

      answer: 1,

      feedback: "A anotação @FXML instrui o FXMLLoader a injetar automaticamente o componente do FXML (identificado por fx:id ou onAction) no atributo ou método correspondente do Controller."
    },

    // 13 - Binding conceito
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Direta",

      texto: "O Binding é um dos recursos mais práticos do JavaFX avançado para criar interfaces reativas.",

      question: "O que o Binding faz entre duas propriedades de componentes JavaFX?",

      options: [
        "Copia o valor de uma propriedade para a outra apenas uma vez, no momento da inicialização",
        "Cria uma ligação automática entre as propriedades, atualizando uma quando a outra muda",
        "Sincroniza as propriedades com o banco de dados da aplicação em tempo real",
        "Bloqueia as propriedades para evitar alterações manuais pelo Controller"
      ],

      answer: 1,

      feedback: "O Binding cria uma ligação automática entre propriedades. Quando o valor de uma muda, a outra é atualizada automaticamente, sem necessidade de código de atualização manual."
    },

    // 14 - Binding na prática
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Código",

      texto: "O trecho abaixo foi escrito para melhorar a usabilidade de um formulário JavaFX:",

      code: `btnSalvar.disableProperty().bind(
    txtNome.textProperty().isEmpty()
  );`,

      question: "Qual é o comportamento gerado por esse Binding?",

      options: [
        "O botão é removido da tela quando o campo de nome está vazio",
        "O botão muda de cor conforme o usuário digita no campo",
        "O botão fica desabilitado enquanto o campo de nome estiver vazio e é reativado automaticamente quando preenchido",
        "O campo de nome é limpo automaticamente ao clicar no botão"
      ],

      answer: 2,

      feedback: "O Binding vincula disableProperty do botão à propriedade isEmpty do TextField. Enquanto o campo estiver vazio, a propriedade retorna true e o botão permanece desabilitado — sem necessidade de listener adicional."
    },

    // 15 - Controller responsabilidades
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Contexto",

      texto: "Em um sistema de cadastro JavaFX, o usuário preenche um formulário e clica em 'Salvar'. O sistema valida os dados, cria um objeto e exibe uma mensagem de confirmação.",

      question: "Qual componente da arquitetura MVC é responsável por executar esse fluxo?",

      options: [
        "O Model, pois contém os dados e as regras de validação",
        "O FXML, pois define os campos e o botão do formulário",
        "O Controller, pois recebe o evento de clique, valida os dados e atualiza a interface",
        "O Stage, pois controla o ciclo de vida da janela durante o salvamento"
      ],

      answer: 2,

      feedback: "O Controller é o responsável por coordenar o fluxo: captura o evento de clique, valida os dados, instancia o objeto do Model e atualiza a interface com a mensagem de resultado."
    },

    // 16 - FXMLLoader função
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Curta",

      texto: "O FXMLLoader é utilizado na classe principal de aplicações JavaFX que usam arquivos FXML.",

      question: "Qual é a principal função do FXMLLoader ao carregar um arquivo FXML?",

      options: [
        "Converter o arquivo FXML em HTML para exibição no navegador",
        "Ler o FXML, construir os componentes visuais e conectar o Controller automaticamente",
        "Validar a sintaxe do FXML antes de compilar o projeto Java",
        "Substituir o Stage ao gerenciar a exibição das telas"
      ],

      answer: 1,

      feedback: "O FXMLLoader lê o arquivo FXML, constrói os componentes declarados nele e instancia e conecta o Controller referenciado pelo atributo fx:controller, tudo de forma automática."
    },

    // 17 - fluxo MVC avançado
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Direta",

      texto: "No JavaFX com MVC, a comunicação entre as camadas segue uma direção definida.",

      question: "Qual é o fluxo correto de comunicação entre as camadas no padrão MVC do JavaFX?",

      options: [
        "Model → Controller → View",
        "View → Model → Controller",
        "Controller → View → Model",
        "View → Controller → Model"
      ],

      answer: 3,

      feedback: "O fluxo correto é View → Controller → Model. A View captura a ação do usuário, repassa ao Controller que processa e, quando necessário, interage com o Model para obter ou persistir dados."
    },

    // 18 - validação com return
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Código",

      texto: "O método abaixo implementa validação sequencial em um Controller JavaFX:",

      code: `@FXML
  private void salvar() {
    if (txtNome.getText().isEmpty()) {
      lblMensagem.setText("Nome obrigatório.");
      return;
    }
    if (txtEmail.getText().isEmpty()) {
      lblMensagem.setText("E-mail obrigatório.");
      return;
    }
    lblMensagem.setText("Salvo com sucesso!");
  }`,

      question: "Se tanto o campo nome quanto o campo e-mail estiverem vazios, qual mensagem será exibida no Label?",

      options: [
        "As duas mensagens serão exibidas juntas no Label",
        "Nenhuma mensagem será exibida pois o método lança uma exceção",
        "Apenas 'Nome obrigatório.' será exibido, pois o return interrompe o método no primeiro campo inválido",
        "'Salvo com sucesso!' será exibido, pois o método ignora campos vazios"
      ],

      answer: 2,

      feedback: "A validação sequencial com return interrompe o método assim que encontra o primeiro campo inválido. Como nome é verificado antes, apenas sua mensagem de erro é exibida, mesmo que e-mail também esteja vazio."
    },

    // 19 - Model independência
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Contexto",

      texto: "A equipe de desenvolvimento criou a classe Usuario como Model, com atributos privados e getters públicos, sem nenhuma referência a componentes JavaFX como TextField ou Label.",

      question: "Qual vantagem essa decisão de design traz para o projeto?",

      options: [
        "Permite que a classe Usuario atualize diretamente os componentes da tela sem passar pelo Controller",
        "Torna a classe reutilizável e testável de forma independente da interface gráfica",
        "Garante que os dados da classe sejam persistidos automaticamente pelo JavaFX",
        "Elimina a necessidade de usar o FXMLLoader para carregar as telas relacionadas"
      ],

      answer: 1,

      feedback: "Manter o Model desacoplado da interface permite reutilizá-lo em outros contextos, como testes unitários, serviços e outras camadas, sem depender de componentes visuais do JavaFX."
    },

    // 20 - organização MVC pastas
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Contexto",

      texto: "Um projeto JavaFX organizado em MVC possui a seguinte estrutura de pastas: src/Main.java, src/view/cadastro.fxml, src/controller/CadastroController.java e src/model/Cliente.java.",

      question: "Qual é o benefício direto dessa organização de pastas para a equipe de desenvolvimento?",

      options: [
        "O JavaFX passa a compilar o projeto mais rapidamente por encontrar os arquivos com facilidade",
        "Cada desenvolvedor pode trabalhar em sua camada sem interferir nas demais, e a manutenção fica mais clara",
        "O FXMLLoader encontra os arquivos FXML automaticamente sem precisar do caminho informado no código",
        "A organização em pastas elimina a necessidade de usar a anotação @FXML nos Controllers"
      ],

      answer: 1,

      feedback: "A organização em pastas por responsabilidade reflete a separação do MVC fisicamente no projeto. Isso facilita a navegação, permite que membros da equipe trabalhem em camadas diferentes e torna a manutenção mais intuitiva."
    },

  ],

  enade: [

    // aula 12: Introdução ao JavaFX

    // 1 - estrutura hierárquica
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Asserção + Justificativa",

      texto: "Uma equipe de desenvolvimento está migrando um sistema desktop legado, construído com Swing, para JavaFX. Durante o planejamento, o arquiteto responsável explica aos desenvolvedores juniores como a estrutura do JavaFX é organizada e por que ela favorece a manutenção de aplicações complexas.",

      question: "Avalie a seguinte asserção e sua justificativa sobre a estrutura do JavaFX:",

      assertions: [
        "I. No JavaFX, o ==ddl==Stage== representa a janela da aplicação e só pode conter uma Scene ativa por vez.",
        "[PORQUE] II. Essa restrição existe porque a Scene define a área de exibição e os Nodes que compõem a interface, e ter múltiplas Scenes simultâneas causaria conflito de renderização."
      ],

      options: [
        "I e II são verdadeiras, e II justifica corretamente I",
        "I e II são verdadeiras, mas II não justifica I",
        "I é verdadeira e II é falsa",
        "I é falsa e II é verdadeira"
      ],

      answer: 0,

      feedback: "Correto: A. O **Stage** aceita apenas uma Scene ativa por vez e a justificativa é tecnicamente coerente: a ==ddl==Scene== encapsula o grafo de Nodes que é renderizado, tornando inviável a coexistência de múltiplas Scenes na mesma janela simultaneamente."
    },

    // 2 - layouts e posicionamento
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Múltiplas afirmativas",

      texto: "Durante o desenvolvimento de um sistema de gestão acadêmica em JavaFX, o time discute as melhores práticas para organização visual dos componentes. O líder técnico recomenda o uso de layouts em vez de posicionamento manual com coordenadas absolutas.",

      question: "Analise as afirmativas a seguir sobre layouts no JavaFX e assinale a alternativa que contém apenas as corretas:",

      assertions: [
        "I. O VBox organiza os componentes verticalmente de forma automática, sem necessidade de coordenadas fixas.",
        "II. O HBox e o VBox são intercambiáveis: ambos organizam elementos tanto na vertical quanto na horizontal conforme configuração.",
        "III. O GridPane permite organizar elementos em formato de tabela, sendo útil para formulários mais complexos.",
        "IV. O BorderPane divide a tela em 5 regiões distintas, sendo uma opção adequada para estruturas de tela com cabeçalho, menu lateral e conteúdo central."
      ],

      options: [
        "I, II e III, apenas",
        "I, III e IV, apenas",
        "II e IV, apenas",
        "I, II, III e IV"
      ],

      answer: 1,

      feedback: "Correto: B. As afirmativas I, III e IV estão corretas. A afirmativa II está **errada**: ==ddl==HBox== organiza apenas horizontalmente e ==ddl==VBox== apenas verticalmente — eles não são intercambiáveis nem configuráveis para trocar de eixo."
    },

    // 3 - MVC responsabilidades
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Conceitual contextualizada",

      texto: "Uma empresa de software adotou o padrão arquitetural MVC para organizar seu novo sistema desktop em JavaFX. Após a entrega do primeiro módulo, o analista de qualidade identificou que regras de negócio estavam sendo implementadas diretamente nos arquivos FXML, e que o Controller acumulava também a responsabilidade de persistência de dados.",

      question: "Considerando o padrão ==mark==MVC== e os problemas identificados pelo analista, assinale a alternativa que descreve corretamente a separação de responsabilidades esperada:",

      options: [
        "O FXML deve conter regras de negócio simples para reduzir a carga do Controller, que deve focar apenas na persistência.",
        "O Model deve conter os dados e regras de negócio, o Controller deve coordenar as ações do usuário, e o FXML deve definir apenas a estrutura visual.",
        "O Controller pode acumular responsabilidades de Model quando as regras de negócio são simples, sem prejudicar a arquitetura.",
        "O FXML e o Controller podem ser unificados quando a aplicação possui poucas telas, mantendo o Model separado."
      ],

      answer: 1,

      feedback: "Correto: B. No padrão MVC, o **Model** concentra dados e regras, o ==ddl==Controller== processa eventos e coordena a resposta, e a View (FXML) cuida exclusivamente da apresentação visual. Misturar essas responsabilidades viola o princípio de separação e aumenta o acoplamento."
    },

    // 4 - FXML e Scene Builder
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Asserção + Justificativa",

      texto: "Em um projeto de sistema hospitalar desenvolvido em JavaFX, a equipe optou por usar FXML para definir as telas do sistema. Um desenvolvedor questionou essa decisão, argumentando que seria mais simples construir a interface diretamente no código Java.",

      question: "Avalie a asserção e a justificativa a seguir sobre o uso de ==mark==FXML==:",

      assertions: [
        "I. O FXML permite que a definição da interface gráfica seja feita de forma separada do código Java, favorecendo a divisão de trabalho entre designers e desenvolvedores.",
        "[PORQUE] II. Como o FXML é baseado em XML e não contém lógica de programação, ferramentas visuais como o Scene Builder conseguem interpretá-lo e permitir edição direta da interface sem necessidade de compilação."
      ],

      options: [
        "I e II são verdadeiras, e II justifica corretamente I",
        "I e II são verdadeiras, mas II não justifica I",
        "I é verdadeira e II é falsa",
        "I é falsa e II é verdadeira"
      ],

      answer: 0,

      feedback: "Correto: A. Ambas as afirmativas são verdadeiras e a II justifica a I. O fato de o ==ddl==FXML== ser baseado em XML e não conter lógica é exatamente o que permite sua edição visual por ferramentas como o Scene Builder, reforçando a separação entre **design e código**."
    },

    // 5 - eventos e lambda
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Análise aplicada",

      texto: "Um desenvolvedor está implementando um formulário de login em JavaFX. Ao clicar no botão 'Entrar', o sistema deve verificar se os campos de usuário e senha foram preenchidos. O trecho de código abaixo foi escrito pelo desenvolvedor para capturar o evento de clique:",

      code: `btnEntrar.setOnAction(e -> {
    String usuario = txtUsuario.getText();
    String senha = txtSenha.getText();
    if (usuario.isEmpty() || senha.isEmpty()) {
      lblErro.setText("Preencha todos os campos.");
      return;
    }
    lblErro.setText("Acesso liberado.");
  });`,

      question: "Analise o trecho de código e assinale a alternativa que descreve corretamente o comportamento implementado:",

      options: [
        "O evento é capturado pelo Stage e repassado ao Controller, que atualiza o Label diretamente na Scene.",
        "A expressão lambda é associada ao evento de clique do botão; ao disparar, verifica os campos e exibe mensagens distintas conforme o preenchimento.",
        "O método setOnAction substitui a necessidade de um Controller, centralizando toda a lógica da interface no próprio botão.",
        "A expressão lambda executa de forma assíncrona, garantindo que a interface não congele durante a validação dos campos."
      ],

      answer: 1,

      feedback: "Correto: B. O ==dml==setOnAction== associa uma expressão lambda ao evento de clique. Quando disparado, o código verifica os campos usando `isEmpty()` e atualiza o **Label** com mensagens diferentes para cada situação. Não há execução assíncrona nem eliminação do Controller por esse mecanismo."
    },

    // 6 - Nodes e herança
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Múltiplas afirmativas",

      texto: "Em uma aula sobre JavaFX, o professor apresenta o conceito de Node e explica sua relação com os princípios de Programação Orientada a Objetos. Ele afirma que compreender a hierarquia de classes do JavaFX é fundamental para usar o framework com eficiência.",

      question: "Com base nos conceitos de Nodes no JavaFX e sua relação com POO, avalie as afirmativas:",

      assertions: [
        "I. Button, Label, TextField e ImageView são todos subtipos de Node, pois herdam da classe base Node.",
        "II. Por herdarem da mesma classe, todos os Nodes compartilham propriedades comuns como visibilidade, opacidade e posicionamento.",
        "III. A herança entre componentes JavaFX e a classe Node é um exemplo de polimorfismo, já que objetos de tipos diferentes podem ser tratados como Node.",
        "IV. A classe Node é abstrata e, portanto, não pode ser instanciada diretamente — apenas suas subclasses concretas podem ser usadas na interface."
      ],

      options: [
        "I e II, apenas",
        "I, II e III, apenas",
        "II e IV, apenas",
        "I, II, III e IV"
      ],

      answer: 3,

      feedback: "Correto: D. Todas as afirmativas são verdadeiras. O ==ddl==Node== é a classe base abstrata de todos os elementos visuais do JavaFX, e sua hierarquia exemplifica **herança**, **encapsulamento** e **polimorfismo** — pilares centrais da POO aplicados ao framework."
    },

    // 7 - fluxo de inicialização
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Conceitual contextualizada",

      texto: "Um estudante de desenvolvimento de software está analisando o código de uma aplicação JavaFX escrita por um colega. Ao tentar entender o fluxo de execução, ele identifica os métodos main(), launch() e start(), mas não sabe ao certo em qual ordem são executados e qual é a responsabilidade de cada um.",

      question: "Assinale a alternativa que descreve corretamente o fluxo de inicialização de uma aplicação ==mark==JavaFX==:",

      options: [
        "O método start() é chamado diretamente pelo sistema operacional, que então invoca launch() para carregar a Scene.",
        "O main() chama launch(), que internamente aciona start(); dentro do start() a Scene é criada e associada ao Stage, que é exibido com show().",
        "O launch() inicializa o Stage e a Scene automaticamente, cabendo ao start() apenas definir o título da janela.",
        "O main() cria o Stage diretamente e chama show(); o launch() e o start() são opcionais em aplicações simples."
      ],

      answer: 1,

      feedback: "Correto: B. O fluxo correto é: `main()` → ==dml==launch()== → `start()`. Dentro do `start()`, o desenvolvedor monta a **Scene** com os Nodes desejados, associa ao Stage e chama `show()` para exibir a janela. Nenhuma etapa é opcional."
    },

    // 8 - POO e JavaFX
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Asserção + Justificativa",

      texto: "Durante uma revisão de código, um desenvolvedor sênior elogia a arquitetura de um sistema JavaFX desenvolvido por um trainee. O trainee havia criado uma classe separada para cada tela do sistema, encapsulando os componentes e comportamentos de cada uma delas. O sênior destacou que essa abordagem facilita a aplicação dos princípios SOLID.",

      question: "Avalie a asserção e a justificativa sobre a relação entre ==mark==JavaFX== e Programação Orientada a Objetos:",

      assertions: [
        "I. Representar cada tela como uma classe separada em JavaFX favorece o encapsulamento, pois os componentes e comportamentos ficam agrupados e isolados dentro de sua respectiva classe.",
        "[PORQUE] II. O JavaFX foi projetado para integrar-se com POO, e os princípios SOLID — especialmente o de Responsabilidade Única — são naturalmente aplicáveis quando cada tela, componente e controller possui uma função bem definida."
      ],

      options: [
        "I e II são verdadeiras, e II justifica corretamente I",
        "I e II são verdadeiras, mas II não justifica I",
        "I é verdadeira e II é falsa",
        "I é falsa e II é verdadeira"
      ],

      answer: 0,

      feedback: "Correto: A. Ambas as afirmativas são verdadeiras e relacionadas. O **encapsulamento** por tela é um reflexo direto do ==key==Princípio da Responsabilidade Única== do SOLID, que o JavaFX suporta por ser projetado sobre os pilares da POO."
    },

    // 9 - Scene vs Stage
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Análise aplicada",

      texto: "Um desenvolvedor está construindo um sistema de biblioteca em JavaFX. Ele precisa implementar a navegação entre três telas: tela de busca, tela de detalhes do livro e tela de empréstimo. Para isso, ele planeja criar um único Stage e trocar a Scene conforme o usuário navega entre as telas.",

      question: "Analise a abordagem de navegação descrita e assinale a alternativa que avalia corretamente sua viabilidade e adequação no contexto do ==mark==JavaFX==:",

      options: [
        "A abordagem é inviável, pois cada tela exige um Stage separado; reutilizar o mesmo Stage causa conflitos de renderização.",
        "A abordagem é válida e recomendada: o JavaFX permite trocar a Scene do Stage dinamicamente, e essa técnica é adequada para navegação entre telas sem criar múltiplas janelas.",
        "A abordagem é tecnicamente possível, mas desaconselhada: trocar Scenes dinamicamente consome mais memória do que abrir múltiplos Stages.",
        "A abordagem só funciona se cada Scene for carregada a partir de um arquivo FXML separado; Scenes criadas por código Java não podem ser trocadas dinamicamente."
      ],

      answer: 1,

      feedback: "Correto: B. Trocar a ==ddl==Scene== dinamicamente no mesmo Stage é uma prática válida e comum no JavaFX. Permite navegar entre telas sem abrir novas janelas, aproveitando a capacidade do Stage de **substituir a Scene ativa** a qualquer momento da execução."
    },

    // 10 - comparação Swing e JavaFX
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      tipo: "Múltiplas afirmativas",

      texto: "Em um processo seletivo para uma vaga de desenvolvedor Java desktop, um candidato é questionado sobre as diferenças entre Swing e JavaFX. O recrutador quer avaliar se o candidato compreende as motivações técnicas que levaram ao desenvolvimento do JavaFX como substituto do Swing.",

      question: "Analise as afirmativas sobre as diferenças entre Swing e JavaFX e assinale a alternativa correta:",

      assertions: [
        "I. O JavaFX oferece suporte nativo a CSS para estilização de componentes, enquanto o Swing não possui esse recurso de forma nativa.",
        "II. O JavaFX introduz o FXML como mecanismo de separação entre interface e lógica, algo que o Swing não fornece.",
        "III. O Swing é considerado mais moderno que o JavaFX por ser mais estável e amplamente utilizado em novos projetos.",
        "IV. O JavaFX integra-se mais naturalmente com os princípios de POO ao representar componentes como objetos dentro de uma hierarquia baseada na classe Node."
      ],

      options: [
        "I e II, apenas",
        "I, II e IV, apenas",
        "II, III e IV, apenas",
        "I, II, III e IV"
      ],

      answer: 1,

      feedback: "Correto: B. As afirmativas I, II e IV são verdadeiras. A afirmativa III está **errada**: o ==danger==Swing== é o framework mais antigo — o JavaFX é o substituto moderno, com suporte a CSS, FXML e melhor integração com POO."
    },

    // aula 13: JavaFX Avançado

    // 11 - papel do Controller
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Asserção + Justificativa",

      texto: "Uma equipe de desenvolvimento está revisando um sistema JavaFX legado onde toda a lógica de validação e manipulação de dados estava implementada diretamente nos arquivos FXML, por meio de scripts embutidos. O arquiteto recomendou migrar essa lógica para classes Controller dedicadas.",

      question: "Avalie a asserção e a justificativa a seguir sobre o papel do ==mark==Controller== no JavaFX:",

      assertions: [
        "I. O Controller é a camada responsável por receber os eventos da interface, processar os dados e atualizar os componentes visuais conforme o resultado.",
        "[PORQUE] II. O FXML não deve conter lógica de programação, pois sua função é exclusivamente declarativa — descrever a estrutura e os elementos visuais da interface."
      ],

      options: [
        "I e II são verdadeiras, e II justifica corretamente I",
        "I e II são verdadeiras, mas II não justifica I",
        "I é verdadeira e II é falsa",
        "I é falsa e II é verdadeira"
      ],

      answer: 0,

      feedback: "Correto: A. Ambas são verdadeiras e complementares. O ==ddl==FXML== tem papel declarativo — sem lógica — e é exatamente essa limitação que justifica a existência do **Controller** como camada separada para processar eventos e coordenar a resposta do sistema."
    },

    // 12 - anotação @FXML
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Análise aplicada",

      texto: "Um desenvolvedor está implementando o Controller de uma tela de cadastro. No arquivo FXML, ele declarou um TextField com fx:id='txtNome' e um Button com onAction='#salvar'. No Controller, ele escreveu o seguinte código:",

      code: `public class CadastroController {

    @FXML
    private TextField txtNome;

    @FXML
    private void salvar() {
      String nome = txtNome.getText();
      System.out.println("Nome: " + nome);
    }
  }`,

      question: "Analise o código e assinale a alternativa que descreve corretamente o papel da anotação ==mark==@FXML== nesse contexto:",

      options: [
        "A anotação @FXML transforma o atributo em estático, permitindo seu acesso por qualquer classe do projeto sem instanciar o Controller.",
        "A anotação @FXML indica ao JavaFX que o atributo ou método deve ser vinculado ao elemento correspondente definido no arquivo FXML pelo fx:id ou onAction.",
        "A anotação @FXML é obrigatória apenas nos métodos, sendo opcional nos atributos quando o fx:id possui o mesmo nome da variável.",
        "A anotação @FXML substitui o construtor da classe Controller, inicializando automaticamente todos os componentes ao carregar o FXML."
      ],

      answer: 1,

      feedback: "Correto: B. A anotação ==ddl==@FXML== instrui o **FXMLLoader** a injetar automaticamente o componente visual definido no FXML (por fx:id ou onAction) no atributo ou método correspondente do Controller. Sem ela, a referência permanece nula em tempo de execução."
    },

    // 13 - Binding propriedades
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Múltiplas afirmativas",

      texto: "Durante um treinamento interno sobre JavaFX avançado, o instrutor demonstrou o uso de Binding para criar interfaces mais reativas. Ele comparou a abordagem com e sem Binding, mostrando como a vinculação automática de propriedades reduz a quantidade de código de atualização manual.",

      question: "Com base no conceito de ==mark==Binding== no JavaFX, avalie as afirmativas:",

      assertions: [
        "I. O Binding cria uma ligação unidirecional ou bidirecional entre propriedades, de forma que quando o valor de uma muda, a outra é atualizada automaticamente.",
        "II. Sem o uso de Binding, o desenvolvedor precisa escrever listeners ou atualizar manualmente os componentes a cada mudança de estado.",
        "III. O Binding só pode ser aplicado entre componentes do mesmo tipo; por exemplo, não é possível vincular a propriedade de texto de um TextField a um Label.",
        "IV. Uma aplicação prática do Binding é desabilitar um botão automaticamente enquanto um campo de texto estiver vazio, sem necessidade de código de evento adicional."
      ],

      options: [
        "I, II e III, apenas",
        "I, II e IV, apenas",
        "II e IV, apenas",
        "I, II, III e IV"
      ],

      answer: 1,

      feedback: "Correto: B. As afirmativas I, II e IV são verdadeiras. A III está **errada**: o ==dml==Binding== é flexível e pode vincular propriedades de tipos compatíveis entre componentes diferentes — como a propriedade de texto de um `TextField` à propriedade de texto de um `Label`."
    },

    // 14 - fluxo MVC avançado
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Conceitual contextualizada",

      texto: "Em um sistema de recursos humanos desenvolvido em JavaFX, a tela de cadastro de funcionários é composta por campos de nome, cargo e salário. Ao clicar em 'Salvar', o Controller valida os dados, cria um objeto da classe Funcionario e o encaminha para a camada de persistência. O arquivo FXML define apenas os componentes visuais e referencia o Controller via fx:controller.",

      question: "Analisando o cenário descrito, qual alternativa representa corretamente o fluxo de comunicação esperado dentro do padrão ==mark==MVC==:",

      options: [
        "View → Model → Controller → persistência",
        "Controller → View → Model → persistência",
        "View → Controller → Model → persistência",
        "FXML → Stage → Controller → Model"
      ],

      answer: 2,

      feedback: "Correto: C. No padrão MVC aplicado ao JavaFX, o fluxo correto é: a **View** (FXML) captura a ação do usuário e a repassa ao ==ddl==Controller==, que valida os dados, instancia o objeto do **Model** e o encaminha para as camadas seguintes como persistência."
    },

    // 15 - validação no Controller
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Análise aplicada",

      texto: "Um desenvolvedor implementou o método de validação abaixo em um Controller JavaFX para um formulário de cadastro de clientes:",

      code: `@FXML
  private void salvar() {
    String nome = txtNome.getText();
    String email = txtEmail.getText();

    if (nome.isEmpty()) {
      lblMensagem.setText("Nome obrigatório.");
      return;
    }

    if (email.isEmpty()) {
      lblMensagem.setText("E-mail obrigatório.");
      return;
    }

    lblMensagem.setText("Cadastro realizado!");
  }`,

      question: "Analise o comportamento do método e assinale a alternativa que identifica corretamente uma limitação ou característica relevante dessa implementação:",

      options: [
        "O método não funciona corretamente porque a anotação @FXML não pode ser aplicada a métodos void.",
        "A validação sequencial com return interrompe a execução ao primeiro campo inválido, exibindo apenas uma mensagem de erro por vez, mesmo que múltiplos campos estejam vazios.",
        "O uso de isEmpty() em Strings Java lança uma exceção quando o campo está vazio, tornando o código instável.",
        "O método salvar() é chamado diretamente pelo Stage ao detectar inatividade do usuário, e não pelo evento de clique do botão."
      ],

      answer: 1,

      feedback: "Correto: B. A estrutura de validação com ==dml==return== sequencial interrompe o método no primeiro campo inválido encontrado. Isso significa que, se nome e e-mail estiverem vazios, **apenas a mensagem do nome será exibida**. Essa é uma limitação real da abordagem e um ponto importante de análise de qualidade."
    },

    // 16 - FXMLLoader e inicialização
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Asserção + Justificativa",

      texto: "Em um sistema de ponto eletrônico desenvolvido em JavaFX, a classe principal carrega a tela inicial por meio do FXMLLoader. O desenvolvedor percebeu que, ao usar o FXMLLoader, o Controller associado à tela era instanciado automaticamente, sem que ele precisasse criar o objeto manualmente.",

      question: "Avalie a asserção e a justificativa sobre o comportamento do ==mark==FXMLLoader==:",

      assertions: [
        "I. O FXMLLoader é responsável por ler o arquivo FXML, construir os componentes visuais declarados nele e instanciar automaticamente o Controller referenciado pelo atributo fx:controller.",
        "[PORQUE] II. Como o FXML contém a referência ao Controller via fx:controller, o FXMLLoader consegue identificar, instanciar e injetar os componentes anotados com @FXML no Controller sem intervenção manual do desenvolvedor."
      ],

      options: [
        "I e II são verdadeiras, e II justifica corretamente I",
        "I e II são verdadeiras, mas II não justifica I",
        "I é verdadeira e II é falsa",
        "I é falsa e II é verdadeira"
      ],

      answer: 0,

      feedback: "Correto: A. Ambas são verdadeiras e a II explica o mecanismo pelo qual a I ocorre. O ==dml==FXMLLoader== lê o atributo `fx:controller`, instancia a classe correspondente e injeta os componentes marcados com **@FXML**, eliminando a necessidade de instanciação manual pelo desenvolvedor."
    },

    // 17 - Binding desabilitar botão
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Conceitual contextualizada",

      texto: "Em um formulário de login JavaFX, o desenvolvedor deseja que o botão 'Entrar' permaneça desabilitado enquanto o campo de usuário estiver vazio. Para isso, ele utiliza Binding para vincular a propriedade disableProperty do botão à propriedade isEmpty do TextField, em vez de escrever um listener de evento.",

      question: "Assinale a alternativa que explica corretamente por que essa abordagem com ==mark==Binding== é preferível ao uso de um listener de evento nesse cenário:",

      options: [
        "Porque o Binding executa em thread separada, garantindo que a interface não trave durante a verificação do campo.",
        "Porque o Binding elimina a necessidade de criar o botão manualmente no FXML, gerando-o de forma dinâmica conforme o estado do campo.",
        "Porque o Binding cria uma sincronização declarativa e automática entre as propriedades, dispensando a escrita de código de evento para reagir a cada mudança no campo.",
        "Porque listeners de evento no JavaFX não conseguem monitorar propriedades de TextField, tornando o Binding a única opção viável."
      ],

      answer: 2,

      feedback: "Correto: C. O ==dml==Binding== cria uma **sincronização automática e declarativa** entre propriedades. Ao vincular `disableProperty` à `isEmpty`, o botão reage imediatamente a qualquer mudança no campo sem que o desenvolvedor precise escrever código de listener explícito para cada alteração."
    },

    // 18 - Model e encapsulamento
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Múltiplas afirmativas",

      texto: "Em um sistema de controle de estoque em JavaFX, a equipe criou uma classe Produto como Model, com atributos privados e métodos de acesso públicos. O Controller instancia objetos dessa classe ao processar os dados do formulário, antes de enviá-los à camada de serviço.",

      question: "Analise as afirmativas sobre o papel do ==mark==Model== na arquitetura MVC do JavaFX:",

      assertions: [
        "I. A classe Model deve encapsular os dados da aplicação com atributos privados e fornecer acesso por meio de métodos públicos como getters e setters.",
        "II. O Model pode acessar diretamente os componentes da View para atualizar a interface quando os dados mudam, sem passar pelo Controller.",
        "III. O Controller é responsável por instanciar objetos do Model com os dados coletados da interface e repassá-los às camadas seguintes.",
        "IV. Manter o Model independente da interface facilita a reutilização da lógica de dados em outros contextos, como testes unitários."
      ],

      options: [
        "I e III, apenas",
        "II e IV, apenas",
        "I, III e IV, apenas",
        "I, II, III e IV"
      ],

      answer: 2,

      feedback: "Correto: C. As afirmativas I, III e IV são corretas. A II está **errada**: o ==danger==Model== nunca deve acessar diretamente a View — isso viola o princípio de separação de responsabilidades do MVC e cria acoplamento indevido entre camadas."
    },

    // 19 - organização de projeto MVC
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Asserção + Justificativa",

      texto: "Um desenvolvedor recém-contratado recebeu a tarefa de dar manutenção em um sistema JavaFX. Ao abrir o projeto, ele encontrou todos os arquivos misturados em um único pacote: Controllers, classes de modelo, arquivos FXML e a classe Main, todos no mesmo diretório. O desenvolvedor propôs reorganizar o projeto em pacotes separados por responsabilidade.",

      question: "Avalie a asserção e a justificativa sobre a organização de projetos JavaFX com ==mark==MVC==:",

      assertions: [
        "I. Organizar os arquivos em pacotes separados (view, controller, model) é uma boa prática que melhora a legibilidade, a manutenibilidade e a escalabilidade do projeto.",
        "[PORQUE] II. O JavaFX exige que os arquivos FXML, Controllers e classes de modelo estejam em diretórios específicos para que o FXMLLoader consiga localizar e carregar corretamente os recursos da aplicação."
      ],

      options: [
        "I e II são verdadeiras, e II justifica corretamente I",
        "I e II são verdadeiras, mas II não justifica I",
        "I é verdadeira e II é falsa",
        "I é falsa e II é verdadeira"
      ],

      answer: 2,

      feedback: "Correto: C. A afirmativa I é verdadeira — a organização em pacotes é uma ==key==boa prática== reconhecida. Porém, a II é falsa: o JavaFX **não exige** essa estrutura de diretórios. O FXMLLoader localiza arquivos pelo caminho de recurso informado pelo desenvolvedor, e não por convenção de pastas obrigatória."
    },

    // 20 - integração MVC completa
    {
      aula: "Aula 13 — JavaFX Avançado",
      tipo: "Múltiplas afirmativas",

      texto: "Uma startup desenvolveu um sistema de agendamento médico em JavaFX seguindo rigorosamente a arquitetura MVC com uso de FXML, Controllers e classes de modelo. Durante uma auditoria técnica, o revisor analisou as práticas adotadas pela equipe e listou observações sobre a implementação.",

      question: "Com base nas boas práticas de JavaFX avançado com ==mark==MVC==, Binding e eventos, avalie as afirmativas:",

      assertions: [
        "I. Usar Binding para desabilitar o botão de agendamento enquanto campos obrigatórios estiverem vazios melhora a usabilidade sem adicionar código de evento extra.",
        "II. Centralizar toda a lógica de negócio no Controller, incluindo persistência e validações complexas, é recomendado pois reduz o número de classes no projeto.",
        "III. O uso de @FXML para injetar componentes no Controller mantém o código desacoplado do FXML, pois elimina a necessidade de referências diretas no arquivo XML.",
        "IV. Separar a lógica em Model, View e Controller facilita a escrita de testes unitários, pois o Model pode ser testado independentemente da interface gráfica."
      ],

      options: [
        "I e IV, apenas",
        "I, III e IV, apenas",
        "II e III, apenas",
        "I, II e IV, apenas"
      ],

      answer: 0,

      feedback: "Correto: A. As afirmativas I e IV são corretas. A II está **errada**: centralizar lógica de negócio e persistência no Controller viola o ==danger==princípio da Responsabilidade Única==. A III também está errada: `@FXML` não elimina a referência no FXML — pelo contrário, depende do `fx:id` declarado lá para fazer a injeção."
    }

  ],

  ava: []

};