// ============================================================
// NEXUS STUDY — quiz/conteudo/2026.2/AP1/ques_analise_projeto.js
// ============================================================
window.questoes = {

questoes: [

// ===== AULA 9 =====
// 1 - Conceito de UML
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Explicativa",
  texto: "A UML é uma linguagem de modelagem padronizada, criada na década de 1990 a partir da fusão das melhores práticas de metodologias orientadas a objetos. Sua especificação é mantida pela OMG (Object Management Group). Ela serve para especificar, visualizar, construir e documentar sistemas de software, funcionando também como ponte de comunicação entre desenvolvedores e demais interessados.",
  question: "Qual alternativa descreve corretamente a UML?",
  options: [
    "Uma linguagem de programação criada para compilar sistemas orientados a objetos.",
    "Um banco de dados para armazenar requisitos de software.",
    "Uma linguagem de modelagem padrão, mantida pela OMG, para especificar, visualizar, construir e documentar sistemas.",
    "Uma metodologia ágil exclusiva para projetos que usam Scrum."
  ],
  answer: 2,
  feedback: "A UML não é linguagem de programação nem metodologia. Ela é adotada tanto em métodos tradicionais, como o Cascata, quanto em ágeis, como o Scrum."
},
// 2 - Estereótipos
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Explicativa",
  texto: "Entre os conceitos fundamentais da UML estão os estereótipos. Eles estendem os elementos de modelagem da linguagem, permitindo adaptar a UML a diferentes domínios e contextos ao acrescentar informações adicionais aos elementos do modelo. Nos diagramas de caso de uso, por exemplo, aparecem como <<include>> e <<extend>>.",
  question: "Para que servem os estereótipos (stereotypes) na UML?",
  options: [
    "Para estender os elementos de modelagem e personalizar modelos para diferentes contextos.",
    "Para definir quantas instâncias de uma classe podem se relacionar.",
    "Para transformar o diagrama em código executável automaticamente.",
    "Para indicar a versão da UML em que o diagrama foi criado."
  ],
  answer: 0,
  feedback: "Quem indica quantidades nos relacionamentos é a notação de cardinalidade, e não o estereótipo."
},
// 3 - Cardinalidade
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Aplicação",
  texto: "A notação de cardinalidade especifica quantas instâncias de uma classe podem se associar a instâncias de outra. Ela aparece ao lado das linhas que ligam as classes, como em 1, 0..* ou 1..*, onde o asterisco indica muitos.",
  question: "Em um sistema de biblioteca, um livro pode ter um ou mais autores. Qual notação de cardinalidade, do lado de Autor, representa essa regra?",
  options: [
    "0",
    "1",
    "1..*",
    "*..0"
  ],
  answer: 2,
  feedback: "A notação 1..* significa pelo menos um, podendo haver vários. É a que expressa um livro associado a um ou mais autores."
},
// 4 - Versões da UML
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Contextualizada",
  texto: "A UML evoluiu em versões. A 1.1 (1997) foi a primeira adotada pela OMG e unificou os métodos OMT, Booch e OOSE. A 2.0 (2005) trouxe uma grande revisão, com os diagramas de Componentes e Pacotes. A 2.5 (2012-2015) simplificou a especificação, integrando Superestrutura e Infraestrutura em um único documento.",
  question: "Qual versão da UML integrou Superestrutura e Infraestrutura em uma única especificação, simplificando o documento?",
  options: [
    "UML 1.1.",
    "UML 1.5.",
    "UML 2.0.",
    "UML 2.5."
  ],
  answer: 3,
  feedback: "A UML 2.0 dividiu a especificação em Superestrutura, Infraestrutura, OCL e Diagram Interchange. A 2.5 fez a integração das duas primeiras."
},
// 5 - Categorias de diagramas
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Explicativa",
  texto: "Os diagramas da UML se dividem em duas categorias. Os estruturais mostram os elementos estáticos do sistema, como classes, objetos e componentes. Os comportamentais, ou dinâmicos, mostram o comportamento ao longo do tempo, incluindo a interação entre objetos e a transição de estados.",
  question: "Qual par de diagramas pertence, respectivamente, às categorias estrutural e comportamental?",
  options: [
    "Sequência e Classes.",
    "Classes e Sequência.",
    "Estados e Componentes.",
    "Atividade e Objetos."
  ],
  answer: 1,
  feedback: "Classes descrevem a estrutura estática, e Sequência descreve interações ao longo do tempo. Componentes e Objetos são estruturais. Estados e Atividade são comportamentais."
},
// 6 - Classes e Objetos
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Contextualizada",
  texto: "O Diagrama de Classes define a estrutura estática do sistema, com classes, atributos, métodos e relacionamentos. Já o Diagrama de Objetos representa uma instância desse diagrama em um momento específico, mostrando objetos reais criados a partir das classes.",
  question: "Uma equipe quer mostrar quais livros e quais usuários existiam no sistema em uma data específica. Qual diagrama é o mais adequado?",
  options: [
    "Diagrama de Classes.",
    "Diagrama de Objetos.",
    "Diagrama de Implantação.",
    "Diagrama de Perfil."
  ],
  answer: 1,
  feedback: "O Diagrama de Objetos mostra instâncias das classes em um momento específico. O de Classes mostra apenas a estrutura geral."
},
// 7 - Include e Extend
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Aplicação",
  texto: "No diagrama de caso de uso, <<include>> indica que um caso de uso incorpora outro para compartilhar comportamento comum. Já <<extend>> indica um ponto de extensão, em que um caso de uso pode ser estendido por outro apenas sob certas condições.",
  question: "No exemplo da aula, Recuperar Senha só ocorre quando o usuário não consegue entrar pelo Login. Que relacionamento liga Recuperar Senha a Login?",
  options: [
    "<<include>>, porque o comportamento é sempre executado.",
    "Generalização, porque Login herda de Recuperar Senha.",
    "Associação, porque os dois são atores.",
    "<<extend>>, porque a execução ocorre apenas sob certa condição."
  ],
  answer: 3,
  feedback: "Como é um comportamento condicional, usa-se <<extend>>. O <<include>> serve para comportamento obrigatório e compartilhado, como a Autenticação dentro do Login."
},
// 8 - Máquina de estados
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Explicativa",
  texto: "Uma Máquina de Estados Finita é um modelo matemático para sistemas que assumem um número finito de estados. Ela muda de estado em resposta a eventos ou condições. O Diagrama de Estados é a representação gráfica dessa modelagem formal, com estado inicial (círculo preenchido), estados, transições e eventos.",
  question: "Qual é a relação entre a Máquina de Estados e o Diagrama de Estados?",
  options: [
    "São a mesma coisa e não têm diferença alguma.",
    "O diagrama é uma visualização intuitiva da máquina, que fornece a base formal do comportamento.",
    "A máquina é uma ferramenta de desenho, e o diagrama é um modelo matemático.",
    "O diagrama serve apenas para sistemas sem eventos."
  ],
  answer: 1,
  feedback: "A máquina fornece a base teórica e formal, e o diagrama a torna clara e acessível para desenvolvedores, analistas e stakeholders."
},
// 9 - Fragmento alt
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Aplicação",
  texto: "No Diagrama de Sequência, a linha de vida é uma linha vertical tracejada abaixo do objeto. As mensagens síncronas usam seta contínua com ponta fechada, e as assíncronas usam seta contínua com ponta vazada. Os fragmentos de controle organizam a lógica: alt representa condições alternativas (if/else), loop representa repetição e opt representa condição opcional.",
  question: "Após o usuário enviar as credenciais, o sistema deve exibir o Dashboard se forem válidas e mostrar erro se forem inválidas. Qual fragmento representa isso?",
  options: [
    "loop.",
    "opt.",
    "alt.",
    "fork."
  ],
  answer: 2,
  feedback: "São caminhos alternativos (if/else), então usa-se alt. O fork é do diagrama de atividade."
},
// 10 - Fork e Join
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Contextualizada",
  texto: "O Diagrama de Atividade modela o fluxo de atividades de um processo. A decisão (hexágono) bifurca o fluxo conforme uma condição, e o merge (losango) reúne fluxos após a decisão. Para paralelismo, o fork divide o fluxo em vários fluxos simultâneos e o join reúne esses fluxos paralelos em um só.",
  question: "Em um processo, duas tarefas devem ocorrer ao mesmo tempo e só depois o fluxo segue em frente. Quais elementos do diagrama de atividade usar?",
  options: [
    "Fork para dividir e join para reunir os fluxos paralelos.",
    "Decisão para dividir e merge para reunir.",
    "Start para dividir e Stop para reunir.",
    "Dois estados finais, um para cada tarefa."
  ],
  answer: 0,
  feedback: "Decisão e merge tratam de caminhos alternativos. Para atividades simultâneas, o par correto é fork e join."
},
// ===== AULA 10 =====
// 1 - PlantUML
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Explicativa",
  texto: "O PlantUML é uma ferramenta de código aberto para criar diagramas a partir de uma linguagem de script simples. Ele segue a ideia de diagramas-como-código: o diagrama é definido por texto, de modo parecido com o HTML ou o Markdown. Por ser textual, é independente de plataforma e evita o problema de formatos de arquivo incompatíveis entre ferramentas visuais.",
  question: "Qual é uma vantagem do PlantUML apontada na aula em relação a ferramentas visuais como o Astah?",
  options: [
    "Gera código de programação perfeito a partir do diagrama.",
    "Depende de um único programa para abrir os diagramas.",
    "Permite criar diagramas por texto, com independência de plataforma e padronização visual.",
    "Só funciona em ambientes online."
  ],
  answer: 2,
  feedback: "A aula lembra que a geração de código a partir de UML não é simples e nenhuma ferramenta usada foi realmente eficaz. O PlantUML também funciona em IDEs, editores e suítes de escritório."
},
// 2 - Estrutura básica PlantUML
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Aplicação",
  texto: "Todo diagrama em PlantUML começa com @startuml e termina com @enduml. Esses delimitadores informam ao processador onde o código do diagrama começa e termina. Entre eles, escrevem-se os elementos e as relações.",
  question: "Qual trecho está estruturado corretamente como um diagrama de estados simples em PlantUML?",
  code: "A)\n[*] --> Estado1\nEstado1 --> Estado2 : Transição\n\nB)\n@startuml\n[*] --> Estado1\nEstado1 --> Estado2 : Transição\nEstado2 --> [*]\n@enduml",
  options: [
    "O trecho A, pois dispensa delimitadores.",
    "Nenhum dos dois, pois o PlantUML não suporta diagramas de estado.",
    "Os dois, pois os delimitadores são opcionais.",
    "O trecho B, pois está entre @startuml e @enduml."
  ],
  answer: 3,
  feedback: "Sem @startuml e @enduml o processador não sabe onde o diagrama começa e termina. O trecho B é o completo."
},
// 3 - Nome e título
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Contextualizada",
  texto: "Há duas formas de nomear um diagrama. O nome colocado na linha do @startuml, separado por espaço, não aparece no desenho e serve como nome do arquivo de saída. Já o comando title adiciona um título exibido no topo do diagrama.",
  question: "Uma equipe escreveu @startuml estados-do-sistema e não viu esse texto no desenho. O que aconteceu?",
  options: [
    "O código tem um erro de sintaxe e deve ser descartado.",
    "O nome não é desenhado e serve como nome do arquivo de saída; para exibir texto no topo, usa-se title.",
    "O PlantUML ignora qualquer nome colocado no @startuml.",
    "O nome só aparece se o diagrama estiver na direção left to right."
  ],
  answer: 1,
  feedback: "O nome é para o arquivo gerado. O título visível é feito com title."
},
// 4 - Direction, skinparam e theme
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Explicativa",
  texto: "O PlantUML permite ajustar a aparência. A diretiva left to right direction muda a orientação padrão (de cima para baixo) para a esquerda para a direita. O comando skinparam personaliza cores, fontes e espessura de linhas. O comando !theme aplica um tema pré-definido, como o Amiga, mudando vários estilos de uma vez.",
  question: "Qual comando altera cores, fontes e espessura de linhas de um diagrama PlantUML?",
  options: [
    "title.",
    "skinparam.",
    "participant.",
    "direction apenas."
  ],
  answer: 1,
  feedback: "O skinparam personaliza elementos individualmente. O !theme aplica um conjunto pronto de estilos, e direction muda só a orientação."
},
// 5 - User Story
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Explicativa",
  texto: "Uma User Story é uma descrição simples e concisa de uma funcionalidade, escrita da perspectiva do usuário ou de outra parte interessada. É muito usada em métodos ágeis, como Scrum e XP. Segue a estrutura: Como [tipo de usuário], eu quero [ação], para que [objetivo ou benefício].",
  question: "Qual alternativa é uma User Story bem estruturada?",
  options: [
    "Criar tabela Livro no banco de dados.",
    "Como bibliotecário, eu quero inserir um novo livro para atualizar o acervo.",
    "O sistema deve responder em menos de 1 segundo.",
    "Livro, Autor e Exemplar."
  ],
  answer: 1,
  feedback: "Ela traz quem pede (bibliotecário), o que quer (inserir livro) e por quê (atualizar o acervo). As outras são tarefa técnica, requisito não funcional e lista de classes."
},
// 6 - INVEST
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Aplicação",
  texto: "Boas User Stories seguem o INVEST: Independent, Negotiable, Valuable, Estimable, Small e Testable. Ou seja, devem ser independentes, negociáveis, valiosas, estimáveis, pequenas o bastante para uma sprint e testáveis.",
  question: "Uma história descreve 'o sistema completo de biblioteca' e levaria meses para ser feita. Qual característica do INVEST ela viola principalmente?",
  options: [
    "Valuable.",
    "Testable.",
    "Negotiable.",
    "Small."
  ],
  answer: 3,
  feedback: "Uma história deve ser pequena o suficiente para ser desenvolvida em um curto período, geralmente uma sprint."
},
// 7 - Requisitos funcionais e não funcionais
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Contextualizada",
  texto: "No Sistema de Controle de Biblioteca (SCB), os requisitos funcionais descrevem o que o sistema faz, como RF10 (Registrar devolução, calculando multas por atraso). Os requisitos não funcionais descrevem qualidades do sistema, como desempenho, segurança e acessibilidade. Por motivos didáticos, a aula modela apenas os aspectos funcionais.",
  question: "Qual item do SCB é um requisito não funcional?",
  options: [
    "Realizar reserva de livros indisponíveis.",
    "Renovar empréstimo se o livro não estiver reservado.",
    "Gerar relatórios de movimentação.",
    "O sistema deve ser escalável para suportar aumento de registros e usuários."
  ],
  answer: 3,
  feedback: "Escalabilidade é uma qualidade do sistema, e não uma funcionalidade. As demais são requisitos funcionais (RF12, RF11 e RF14)."
},
// 8 - Encapsulamento
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Explicativa",
  texto: "No Diagrama de Classes do SCB, os atributos são privados (-) e os métodos são públicos (+). Para acessar um atributo privado, usam-se getters, que obtêm o valor, e setters, que o definem ou alteram. Assim o acesso aos dados é controlado, preservando o encapsulamento.",
  question: "Qual é a função de um método getter?",
  options: [
    "Alterar o valor de um atributo privado.",
    "Apagar o objeto da memória.",
    "Recuperar o valor de um atributo privado.",
    "Criar uma nova classe filha."
  ],
  answer: 2,
  feedback: "O getter recupera o valor, e o setter o define ou altera. Juntos controlam o acesso e protegem os dados."
},
// 9 - Relacionamentos de classes
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Aplicação",
  texto: "No modelo do SCB, um Livro possui vários Exemplares, e cada Exemplar pertence a um único livro. Um Exemplar pode constar em vários Empréstimos ao longo do tempo, mas cada Empréstimo se refere a um único exemplar por vez.",
  question: "Qual cardinalidade descreve corretamente a relação entre Livro e Exemplar?",
  options: [
    "Um livro para muitos exemplares.",
    "Um exemplar para muitos livros.",
    "Um livro para um único exemplar.",
    "Muitos livros para muitos exemplares."
  ],
  answer: 0,
  feedback: "Livro possui vários exemplares (1 para muitos). Livro é o título, e Exemplar é a cópia física emprestada ou reservada."
},
// 10 - Diagrama de sequência do SCB
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Contextualizada",
  texto: "O Diagrama de Sequência mostra como objetos interagem em uma sequência temporal, por meio da troca de mensagens organizadas em uma linha do tempo. Por isso é fundamental para entender o comportamento dinâmico, como reserva, empréstimo, devolução e renovação no SCB, e para verificar se os casos de uso estão sendo cumpridos.",
  question: "Por que o Diagrama de Sequência ajuda a entender o processo de empréstimo de um exemplar?",
  options: [
    "Porque lista apenas os atributos de cada classe.",
    "Porque mostra a distribuição física dos servidores.",
    "Porque define o salário dos bibliotecários.",
    "Porque exibe a ordem das mensagens trocadas entre os objetos durante o processo."
  ],
  answer: 3,
  feedback: "Ele captura a interação entre objetos ao longo do tempo. Atributos aparecem no Diagrama de Classes, e servidores no de Implantação."
},
// ===== AULA 11 =====
// 1 - Diagrama de estados
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Explicativa",
  texto: "O Diagrama de Estados descreve os estados pelos quais uma entidade passa e as transições entre eles, causadas por eventos. É usado para detalhar o comportamento dinâmico de um objeto específico ao longo do seu ciclo de vida. No SCB, ele representa o ciclo de vida de um exemplar de livro: Disponível, Reservado e Emprestado.",
  question: "No SCB, qual é o objeto cujo ciclo de vida é modelado pelo Diagrama de Estados?",
  options: [
    "O bibliotecário.",
    "O exemplar do livro.",
    "O servidor de banco de dados.",
    "O relatório de movimentação."
  ],
  answer: 1,
  feedback: "O diagrama mostra como o exemplar muda entre Disponível, Reservado e Emprestado em resposta a eventos."
},
// 2 - Transições
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Contextualizada",
  texto: "Em um Diagrama de Estados, cada seta é uma transição acionada por um evento. No exemplo do SCB, um exemplar Disponível vai para Reservado quando ocorre o evento reservar(). Esse acionamento ligado ao evento é o que dá sentido à mudança de estado.",
  question: "Um exemplar está Disponível e um usuário o reserva. O que acontece no Diagrama de Estados?",
  options: [
    "O exemplar sai do sistema, pois chegou ao estado final.",
    "O exemplar permanece Disponível, pois eventos não alteram estados.",
    "O exemplar passa a Emprestado imediatamente.",
    "Ocorre uma transição de Disponível para Reservado, acionada pelo evento reservar()."
  ],
  answer: 3,
  feedback: "Transições conectam estados e são acionadas por eventos. Reserva leva a Reservado, e o empréstimo é outro evento."
},
// 3 - Diagrama de atividades
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Explicativa",
  texto: "O Diagrama de Atividades representa o fluxo de trabalho ou processo de um sistema, mostrando como as atividades se organizam e quais condições permitem avançar de uma etapa para outra. É especialmente útil para modelar sequências de ações e tomadas de decisão.",
  question: "Para que serve o Diagrama de Atividades?",
  options: [
    "Para representar fluxos de trabalho e processos, com ações e decisões.",
    "Para mostrar a hierarquia de pastas do projeto.",
    "Para listar os atributos privados de cada classe.",
    "Para definir o banco de dados relacional utilizado."
  ],
  answer: 0,
  feedback: "No SCB ele é usado para o processo de empréstimo de um livro, da solicitação do usuário ao registro ou aviso de indisponibilidade."
},
// 4 - Decisão no empréstimo
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Aplicação",
  texto: "No diagrama de atividades do empréstimo no SCB, o usuário solicita o empréstimo e o sistema verifica a disponibilidade. Dependendo do resultado, o fluxo segue para o registro do empréstimo ou para o aviso de indisponibilidade.",
  question: "Qual elemento do diagrama de atividades representa a verificação 'o exemplar está disponível?' com dois caminhos possíveis?",
  options: [
    "Nó de decisão.",
    "Join.",
    "Estado final.",
    "Artefato."
  ],
  answer: 0,
  feedback: "A decisão bifurca o fluxo conforme uma condição, como sim ou não. Join serve para reunir fluxos paralelos."
},
// 5 - Diagrama de componentes
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Explicativa",
  texto: "O Diagrama de Componentes mostra a arquitetura física do sistema, com os componentes de software e suas interações. Dá uma visão de alto nível de como os módulos e suas dependências se relacionam e onde as funcionalidades estão alocadas. No SCB, aparecem o aplicativo web, a API e o banco de dados.",
  question: "Qual informação o Diagrama de Componentes do SCB deixa clara?",
  options: [
    "O ciclo de vida de um exemplar.",
    "O passo a passo do empréstimo.",
    "A arquitetura geral: aplicativo web, API e banco de dados e como eles interagem.",
    "A ordem temporal das mensagens entre objetos."
  ],
  answer: 2,
  feedback: "O ciclo de vida é do Diagrama de Estados, o passo a passo é do de Atividades e as mensagens são do de Sequência."
},
// 6 - Dependências entre componentes
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Contextualizada",
  texto: "No Diagrama de Componentes, a dependência indica que um componente precisa de outro para funcionar. Em uma arquitetura em camadas, o aplicativo web envia requisições à API, e a API acessa o banco de dados. Ou seja, cada camada depende da seguinte.",
  question: "Em uma arquitetura com aplicativo web, API e banco de dados, o que significa o aplicativo web depender da API?",
  options: [
    "Que o aplicativo web acessa o banco de dados diretamente e a API é opcional.",
    "Que a API é um artefato compilado do aplicativo web.",
    "Que o aplicativo web não consegue cumprir suas funções sem usar a API.",
    "Que os dois componentes são a mesma classe."
  ],
  answer: 2,
  feedback: "A dependência mostra que um componente precisa do outro para funcionar, e isso ajuda a planejar a implantação do sistema."
},
// 7 - Node.js
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Explicativa",
  texto: "O Node.js é uma plataforma que permite executar código JavaScript no lado do servidor. Foi desenvolvido com base no motor V8 do Google Chrome e trata operações de entrada e saída (I/O) de forma assíncrona e orientada a eventos. É adequado para aplicações com muitas requisições, como APIs RESTful.",
  question: "O que o Node.js permite fazer, segundo a aula?",
  options: [
    "Criar diagramas UML automaticamente.",
    "Executar código JavaScript no lado do servidor, com I/O assíncrono e orientado a eventos.",
    "Substituir o banco de dados relacional.",
    "Rodar apenas dentro do navegador do usuário."
  ],
  answer: 1,
  feedback: "No SCB, o Node.js foi usado para a transição dos modelos UML para uma implementação básica."
},
// 8 - MVC
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Contextualizada",
  texto: "O MVC organiza a aplicação em três camadas para separar responsabilidades. A Model cuida da lógica de dados e da interação com o banco de dados, a View apresenta a interface ao usuário, e a Controller atua como intermediária, processando requisições e coordenando a comunicação entre Model e View.",
  question: "Qual camada do MVC processa as requisições e coordena a comunicação entre Model e View?",
  options: [
    "Model.",
    "View.",
    "Database.",
    "Controller."
  ],
  answer: 3,
  feedback: "A Controller é a intermediária. A separação de responsabilidades deixa o código mais modular e fácil de manter."
},
// 9 - Estrutura do projeto
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Aplicação",
  texto: "A estrutura do projeto SCB separa responsabilidades: Models (book.js, loan.js, user.js) definem dados e validações, Controllers (bookController.js, loanController.js) têm a lógica de controle, Routes (bookRoutes.js, loanRoutes.js) mapeiam URLs para métodos dos Controllers, app.js é o ponto de entrada e config/db.js gerencia a conexão com o banco.",
  question: "A equipe precisa definir qual URL chama qual método do controlador de empréstimos. Em qual arquivo deve fazer isso?",
  options: [
    "book.js.",
    "config/db.js.",
    "loanRoutes.js.",
    "package.json."
  ],
  answer: 2,
  feedback: "Os arquivos de rotas mapeiam URLs para métodos dos controladores. O package.json guarda dependências e scripts."
},
// 10 - loanController
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Aplicação",
  texto: "O loanController gerencia a criação de empréstimos: verifica a disponibilidade do exemplar e, se estiver disponível, registra o empréstimo no sistema. Isso transpõe para o código o fluxo do diagrama de atividades e o ciclo de vida do exemplar.",
  question: "Antes de registrar um empréstimo, qual verificação o loanController deve fazer?",
  options: [
    "Se o exemplar está disponível.",
    "Se o usuário já leu o livro.",
    "Se o livro tem mais de 200 páginas.",
    "Se existe um diagrama de componentes."
  ],
  answer: 0,
  feedback: "Registrar empréstimo de exemplar indisponível quebraria o fluxo modelado. O Model Book ajuda a verificar e atualizar a disponibilidade."
},
// ===== AULA 12 =====
// 1 - O que são padrões de projeto
{
  aula: "Aula 12 - Introdução",
  tipo: "Explicativa",
  texto: "Padrões de projeto são soluções reutilizáveis para problemas recorrentes no design de software. Em vez de um código pronto, oferecem uma estrutura genérica, uma espécie de receita. Isso cria uma linguagem comum entre desenvolvedores e arquitetos e facilita escalabilidade e flexibilidade.",
  question: "O que é um padrão de projeto?",
  options: [
    "Um trecho de código que deve ser copiado sem alteração.",
    "Uma biblioteca obrigatória de qualquer linguagem de programação.",
    "Um tipo de diagrama UML.",
    "Uma solução reutilizável e genérica para um problema recorrente de design."
  ],
  answer: 3,
  feedback: "Padrões não são código específico: descrevem uma estrutura genérica de solução, adaptável a cada contexto."
},
// 2 - Componentes de um padrão
{
  aula: "Aula 12 - Introdução",
  tipo: "Explicativa",
  texto: "Cada padrão de projeto descreve três coisas: um problema particular que ocorre com frequência, a solução para esse problema e as consequências de aplicá-la. Essas consequências incluem vantagens e também limitações, como mais classes ou dependência global.",
  question: "O que cada padrão de projeto descreve?",
  options: [
    "O custo de licenciamento, o fabricante e a versão.",
    "Um problema recorrente, a solução e as consequências de aplicá-la.",
    "Apenas o código-fonte em JavaScript.",
    "O diagrama de implantação do sistema."
  ],
  answer: 1,
  feedback: "Conhecer as consequências evita aplicar o padrão onde ele só aumentaria a complexidade."
},
// 3 - Gang of Four
{
  aula: "Aula 12 - Introdução",
  tipo: "Contextualizada",
  texto: "O termo Gang of Four (GoF) se refere a Erich Gamma, Richard Helm, Ralph Johnson e John Vlissides, autores do livro Design Patterns: Elements of Reusable Object-Oriented Software, de 1994. Nele documentaram 23 padrões fundamentais, organizados em três categorias.",
  question: "Quantos padrões o GoF documentou no livro de 1994 e em quantas categorias eles foram organizados?",
  options: [
    "23 padrões em 3 categorias.",
    "5 padrões em 3 categorias.",
    "23 padrões em 5 categorias.",
    "12 padrões em 2 categorias."
  ],
  answer: 0,
  feedback: "São 23 padrões, organizados em Criacionais, Estruturais e Comportamentais."
},
// 4 - Categorias
{
  aula: "Aula 12 - Introdução",
  tipo: "Explicativa",
  texto: "Os padrões criacionais cuidam da criação flexível e controlada de objetos (Factory Method, Singleton, Builder). Os estruturais cuidam da composição e organização de classes e objetos (Adapter, Decorator, Facade). Os comportamentais cuidam da interação entre componentes e da distribuição de responsabilidades (Observer, Strategy, Command).",
  question: "Qual categoria de padrões trata da criação flexível e controlada de objetos?",
  options: [
    "Estruturais.",
    "Comportamentais.",
    "Criacionais.",
    "Arquiteturais."
  ],
  answer: 2,
  feedback: "Criacionais focam em como os objetos são criados. Estruturais, em como são compostos, e comportamentais, em como interagem."
},
// 5 - Classificar Adapter
{
  aula: "Aula 12 - Introdução",
  tipo: "Aplicação",
  texto: "O padrão Adapter permite que interfaces incompatíveis trabalhem juntas, adaptando a interface de uma classe para que funcione com outra. Ele atua na composição entre classes e objetos.",
  question: "Um sistema novo precisa usar uma biblioteca antiga cuja interface é incompatível com o resto do código. O padrão Adapter resolve isso e pertence a qual categoria?",
  options: [
    "Criacional.",
    "Comportamental.",
    "Apenas à UML, e não ao GoF.",
    "Estrutural."
  ],
  answer: 3,
  feedback: "O Adapter é estrutural, assim como Decorator e Facade, pois organiza como classes e objetos se combinam."
},
// 6 - Observer
{
  aula: "Aula 12 - Introdução",
  tipo: "Aplicação",
  texto: "O Observer define uma dependência um-para-muitos entre objetos: quando um objeto muda de estado, todos os dependentes são notificados automaticamente. É um padrão comportamental, pois trata da interação entre objetos.",
  question: "Quando o estoque de um produto muda, vários painéis devem ser atualizados automaticamente. Qual padrão GoF se encaixa nessa necessidade?",
  options: [
    "Singleton.",
    "Observer.",
    "Builder.",
    "Prototype."
  ],
  answer: 1,
  feedback: "Observer notifica os dependentes sempre que o estado do objeto observado muda. Singleton, Builder e Prototype são criacionais."
},
// 7 - Características
{
  aula: "Aula 12 - Introdução",
  tipo: "Contextualizada",
  texto: "Entre as características dos padrões estão a reutilização de código, a flexibilidade e manutenibilidade, a organização e estrutura, e a comunicabilidade. Esta última cria uma linguagem comum entre equipes, permitindo falar do design de forma clara e direta.",
  question: "Dois desenvolvedores dizem 'vamos usar um Observer aqui' e se entendem sem explicar a estrutura. Qual característica dos padrões isso ilustra?",
  options: [
    "Reutilização de código.",
    "Persistência de dados.",
    "Comunicabilidade.",
    "Escalabilidade de hardware."
  ],
  answer: 2,
  feedback: "O nome do padrão funciona como vocabulário compartilhado, facilitando a comunicação do design."
},
// 8 - Singleton
{
  aula: "Aula 12 - Introdução",
  tipo: "Explicativa",
  texto: "O Singleton é um padrão criacional que garante que uma classe tenha apenas uma instância e fornece um ponto de acesso global a ela. É útil para recursos compartilhados, como conexão com banco de dados, serviço de log ou configuração global.",
  question: "O que o padrão Singleton garante?",
  options: [
    "Que uma classe tenha várias instâncias independentes.",
    "Que objetos sejam clonados a partir de um protótipo.",
    "Que um objeto complexo seja construído em etapas.",
    "Que uma classe tenha apenas uma instância, com ponto de acesso global."
  ],
  answer: 3,
  feedback: "Clonar é o Prototype, e construir em etapas é o Builder."
},
// 9 - Singleton em código
{
  aula: "Aula 12 - Introdução",
  tipo: "Aplicação",
  texto: "No exemplo do serviço de log, o construtor do Logger verifica se já existe uma instância em Logger.instance. Se existir, retorna essa instância em vez de criar outra. Assim, qualquer parte da aplicação que crie um Logger acessa o mesmo objeto e o mesmo histórico de logs.",
  question: "No código a seguir, o que ocorre ao executar new Logger() duas vezes?",
  code: "class Logger {\n  constructor() {\n    if (Logger.instance) {\n      return Logger.instance;\n    }\n    this.logs = [];\n    Logger.instance = this;\n  }\n  log(msg) {\n    this.logs.push(msg);\n    console.log(msg);\n  }\n}",
  options: [
    "Duas instâncias diferentes, cada uma com seu histórico.",
    "Um erro, pois o construtor não pode retornar valores.",
    "A mesma instância nas duas chamadas, com histórico compartilhado.",
    "A primeira instância é apagada e substituída pela segunda."
  ],
  answer: 2,
  feedback: "Na segunda chamada, Logger.instance já existe e é retornada. Por isso o histórico é compartilhado."
},
// 10 - Cautela com Singleton
{
  aula: "Aula 12 - Introdução",
  tipo: "Contextualizada",
  texto: "Apesar de útil, o Singleton deve ser usado com cautela, pois introduz uma dependência global. Isso pode dificultar testes e manutenção, e em projetos grandes o uso excessivo torna o código difícil de gerenciar.",
  question: "Por que o uso excessivo de Singleton é considerado um risco em projetos grandes?",
  options: [
    "Porque impede a criação de qualquer objeto.",
    "Porque deixa o código mais lento em qualquer situação.",
    "Porque só funciona com JavaScript.",
    "Porque cria dependência global, dificultando testes e manutenção."
  ],
  answer: 3,
  feedback: "A dependência global dificulta isolar componentes para testar e torna o sistema mais difícil de manter."
},
// ===== AULA 13 =====
// 1 - Padrões de criação
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Explicativa",
  texto: "Os padrões de criação, ou criacionais, resolvem problemas recorrentes na criação de objetos indo além do uso convencional de construtores. Permitem criar objetos de forma flexível, controlada e independente de classes específicas. A aula trata de cinco: Abstract Factory, Builder, Factory Method, Prototype e Singleton.",
  question: "Qual é o objetivo geral dos padrões de criação?",
  options: [
    "Organizar a interface gráfica das telas.",
    "Substituir completamente o uso de classes.",
    "Criar objetos de forma flexível, controlada e independente de classes específicas.",
    "Documentar requisitos funcionais do sistema."
  ],
  answer: 2,
  feedback: "Eles tornam o código mais reutilizável e fácil de manter, ao reduzir a dependência de construtores diretos."
},
// 2 - Abstract Factory
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Explicativa",
  texto: "O Abstract Factory fornece uma interface para criar famílias de objetos relacionados ou dependentes sem especificar suas classes concretas. Ele garante que objetos da mesma família sejam usados juntos e reduz o acoplamento, pois o cliente só conhece interfaces. No exemplo, CarFactory define métodos abstratos para motor e rodas, e SedanFactory e SUVFactory os implementam.",
  question: "O que o Abstract Factory oferece?",
  options: [
    "Uma interface para criar famílias de objetos relacionados sem especificar suas classes concretas.",
    "Uma única instância global de uma classe.",
    "Uma cópia superficial de um objeto existente.",
    "A construção de um objeto em etapas encadeadas."
  ],
  answer: 0,
  feedback: "Garantir instância única é o Singleton, copiar é o Prototype e construir por etapas é o Builder."
},
// 3 - Abstract Factory em GUI
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Contextualizada",
  texto: "O Abstract Factory é indicado quando há famílias de objetos inter-relacionados, como em interfaces gráficas onde botões, caixas de texto e menus precisam manter um estilo visual uniforme. Uma desvantagem é que adicionar novos tipos de produto exige modificar todas as fábricas existentes.",
  question: "Uma aplicação precisa alternar entre o tema claro e o escuro, e botões, menus e caixas devem sempre combinar entre si. Qual padrão se encaixa melhor?",
  options: [
    "Prototype.",
    "Singleton.",
    "Abstract Factory.",
    "Builder."
  ],
  answer: 2,
  feedback: "Cada tema seria uma fábrica concreta, garantindo que os elementos da mesma família sejam usados juntos."
},
// 4 - Builder
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Explicativa",
  texto: "O Builder separa a construção de um objeto complexo da sua representação, permitindo que o mesmo processo de construção gere diferentes representações. É ideal quando o objeto é construído em etapas e o cliente controla o processo sem conhecer os detalhes internos.",
  question: "Quando o padrão Builder é mais indicado?",
  options: [
    "Quando é necessário garantir uma única instância global.",
    "Quando é preciso construir objetos complexos em várias etapas, com diferentes configurações.",
    "Quando se quer apenas clonar um objeto simples.",
    "Quando as classes concretas devem ser sempre conhecidas pelo cliente."
  ],
  answer: 1,
  feedback: "Exemplos: documentos com várias seções, gráficos personalizáveis ou veículos configuráveis. Em projetos simples, ele pode só aumentar a complexidade."
},
// 5 - Builder em código
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Aplicação",
  texto: "No exemplo da aula, a classe HouseBuilder constrói uma casa em etapas (buildWalls, buildDoors, buildWindows). Cada método retorna o próprio builder, o que permite chamadas encadeadas (fluent interface). Por fim, getHouse devolve o objeto totalmente configurado.",
  question: "Para o código abaixo funcionar com chamadas encadeadas, o que cada método de etapa precisa retornar?",
  code: "const house = new HouseBuilder()\n  .buildWalls()\n  .buildDoors()\n  .buildWindows()\n  .getHouse();",
  options: [
    "O objeto house já pronto.",
    "Nada (undefined).",
    "Um número com a quantidade de etapas.",
    "O próprio builder (this)."
  ],
  answer: 3,
  feedback: "Retornar this permite encadear a próxima chamada. Só o getHouse devolve o objeto final."
},
// 6 - Factory Method
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Contextualizada",
  texto: "O Factory Method define uma interface para criar um objeto, mas deixa as subclasses decidirem qual tipo será criado. Assim, o código cliente fica desacoplado das implementações concretas. No exemplo, AnimalFactory declara createAnimal, e DogFactory e CatFactory criam Dog e Cat.",
  question: "Um gerenciador de arquivos precisa suportar novos formatos sem alterar o código principal. Como o Factory Method ajuda?",
  options: [
    "Obrigando o código principal a conhecer todos os formatos.",
    "Limitando o sistema a um único formato.",
    "Permitindo criar uma nova subclasse que implementa o método de fábrica para o novo formato.",
    "Clonando sempre o primeiro arquivo aberto."
  ],
  answer: 2,
  feedback: "Novos formatos entram por novas subclasses, sem mexer no código principal. O custo é o aumento no número de classes."
},
// 7 - Desvantagem do Factory Method
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Aplicação",
  texto: "A principal desvantagem do Factory Method é o aumento no número de classes, já que cada tipo de objeto exige uma nova fábrica. Em sistemas maiores, isso pode dificultar a organização do código.",
  question: "Um projeto tem 20 tipos de produto e criou uma fábrica para cada um. Qual desvantagem do Factory Method aparece?",
  options: [
    "A perda da flexibilidade de criação.",
    "O excesso de classes, pois cada tipo exige uma fábrica própria.",
    "A impossibilidade de usar subclasses.",
    "A existência de uma única instância global."
  ],
  answer: 1,
  feedback: "É o custo de organizar a criação por subclasses. Vale a pena quando a extensibilidade é importante."
},
// 8 - Prototype
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Explicativa",
  texto: "O Prototype cria novos objetos copiando ou clonando uma instância existente, o protótipo. É útil quando se usam modelos padrão para criar vários objetos parecidos, permitindo alterações pontuais em cada cópia sem mexer no modelo original. No exemplo, o objeto carPrototype tem um método clone que usa Object.assign, que faz uma cópia superficial.",
  question: "O que o padrão Prototype faz?",
  code: "const carPrototype = {\n  brand: 'X', color: 'red',\n  clone() { return Object.assign({}, this); }\n};\nconst car1 = carPrototype.clone();\ncar1.color = 'blue';",
  options: [
    "Garante que só exista um objeto car no sistema.",
    "Cria objetos novos copiando um protótipo existente, permitindo alterar cada cópia.",
    "Impede qualquer alteração depois da criação.",
    "Decide em tempo de execução qual subclasse instanciar."
  ],
  answer: 1,
  feedback: "No código, car1 é uma cópia do protótipo e a mudança de cor não afeta o modelo. A instância única é do Singleton."
},
// 9 - Limitação do Prototype
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Contextualizada",
  texto: "Apesar de eficiente, o Prototype tem dificuldade com clonagens profundas, principalmente quando os objetos têm referências complexas ou dependem de recursos externos. Object.assign faz cópia superficial: objetos internos continuam compartilhados entre o original e a cópia.",
  question: "Um protótipo contém uma lista interna de itens. Após clonar com cópia superficial, o que pode acontecer?",
  options: [
    "A lista é duplicada automaticamente e nunca é compartilhada.",
    "O clone não pode ser criado.",
    "O original e o clone podem compartilhar a mesma lista, e mudanças afetam os dois.",
    "A lista é apagada do original."
  ],
  answer: 2,
  feedback: "Na cópia superficial, referências internas são compartilhadas. Para evitar isso, é preciso clonagem profunda."
},
// 10 - Singleton em código
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Aplicação",
  texto: "No Singleton, a classe Database guarda a única instância em um atributo estático, Database.instance. O construtor verifica se ela já existe e, se existir, a retorna. Dessa forma, tanto db1 quanto db2 referenciam o mesmo objeto. O padrão pode dificultar testes e exigir sincronização em ambientes multithreaded.",
  question: "Considerando o código abaixo, qual é o resultado de db1 === db2?",
  code: "class Database {\n  constructor() {\n    if (Database.instance) return Database.instance;\n    Database.instance = this;\n  }\n}\nconst db1 = new Database();\nconst db2 = new Database();\nconsole.log(db1 === db2);",
  options: [
    "false, pois são duas instâncias.",
    "Um erro de sintaxe.",
    "undefined.",
    "true, pois ambos referenciam a mesma instância."
  ],
  answer: 3,
  feedback: "O segundo new Database() retorna a instância já guardada, então db1 e db2 são o mesmo objeto."
},
  
],


};