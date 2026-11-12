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

fixacao: [
  // ===== AULA 9 =====
// 1 - Entidade responsável
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Direta",
  texto: "A UML é um padrão aberto, e alguém precisa manter sua especificação atualizada.",
  question: "Qual entidade mantém e evolui a especificação da UML?",
  options: [
    "ISO (International Organization for Standardization).",
    "W3C (World Wide Web Consortium).",
    "OMG (Object Management Group).",
    "IEEE (Institute of Electrical and Electronics Engineers)."
  ],
  answer: 2,
  feedback: "A OMG desenvolve padrões abertos em TI e mantém a especificação da UML."
},
// 2 - Caso de uso
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Direta",
  texto: "Cada diagrama da UML responde a uma necessidade diferente de modelagem.",
  question: "Qual diagrama descreve as interações de atores externos com o sistema?",
  options: [
    "Diagrama de Caso de Uso.",
    "Diagrama de Classes.",
    "Diagrama de Componentes.",
    "Diagrama de Pacotes."
  ],
  answer: 0,
  feedback: "O Diagrama de Caso de Uso mostra quem (atores) faz o quê (casos de uso) no sistema, capturando requisitos funcionais."
},
// 3 - Diagrama de implantação
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Direta",
  texto: "Alguns diagramas tratam da parte física do sistema, e não da lógica das classes.",
  question: "O que o Diagrama de Implantação modela?",
  options: [
    "A distribuição física dos artefatos em nós da rede.",
    "O fluxo de atividades de um processo.",
    "A troca de mensagens entre objetos no tempo.",
    "Os estados de um objeto ao longo do ciclo de vida."
  ],
  answer: 0,
  feedback: "A implantação mostra onde cada artefato fica instalado e se relaciona com o Diagrama de Componentes."
},
// 4 - Linha de vida
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Direta",
  texto: "No Diagrama de Sequência, a existência de um objeto durante a interação tem uma representação própria.",
  question: "Como é representada a linha de vida (lifeline)?",
  options: [
    "Por um losango abaixo do objeto.",
    "Por uma linha vertical tracejada que desce a partir do objeto.",
    "Por uma barra horizontal sobre o objeto.",
    "Por um círculo preenchido ao lado do objeto."
  ],
  answer: 1,
  feedback: "A linha vertical tracejada indica o tempo de existência do objeto. A barra de ativação mostra quando ele está processando."
},
// 5 - UML 2.0
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Contexto",
  texto: "A UML 2.0, lançada em 2005, foi uma grande revisão da linguagem, com arquitetura mais robusta e modular.",
  question: "Quais diagramas foram adicionados nessa versão?",
  options: [
    "Classes e Objetos.",
    "Componentes e Pacotes.",
    "Caso de Uso e Sequência.",
    "Estados e Atividades."
  ],
  answer: 1,
  feedback: "A UML 2.0 trouxe os diagramas de Componentes e Pacotes e revisou a semântica dos já existentes."
},
// 6 - Ferramentas
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Contexto",
  texto: "Existem ferramentas pagas, freeware e gratuitas de código aberto para criar diagramas UML.",
  question: "Qual das ferramentas a seguir é paga?",
  options: [
    "Draw.io.",
    "Modelio.",
    "ArgoUML.",
    "Enterprise Architect."
  ],
  answer: 3,
  feedback: "Enterprise Architect, Visual Paradigm e IBM Rational Rose são pagas. Modelio, ArgoUML e PlantText são gratuitas e open source."
},
// 7 - Generalização
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Contexto",
  texto: "No exemplo de caso de uso da aula, o ator Admin se liga ao ator User por uma seta de ponta vazada, que parte do elemento geral para o especializado.",
  question: "Qual relacionamento essa seta representa?",
  options: [
    "Inclusão.",
    "Extensão.",
    "Generalização.",
    "Associação."
  ],
  answer: 2,
  feedback: "A generalização representa herança entre atores ou entre casos de uso. A associação liga ator e caso de uso."
},
// 8 - Máquina de porta
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Aplicação",
  texto: "Em uma máquina de estados de porta, existem dois estados, opened e closed, e dois eventos, open e close. A porta está no estado closed.",
  question: "O que acontece quando o evento open ocorre?",
  options: [
    "A porta permanece closed.",
    "A porta vai para um estado final e a máquina termina.",
    "A porta vai para o estado opened.",
    "O evento é ignorado até que close ocorra."
  ],
  answer: 2,
  feedback: "A transição open leva a porta de closed para opened. A transição close faz o caminho contrário."
},
// 9 - Merge
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Aplicação",
  texto: "Em um diagrama de atividade, um processo se divide em dois caminhos após uma decisão. Depois que cada caminho é executado, o processo continua em um único fluxo.",
  question: "Qual elemento reúne os caminhos alternativos em um só fluxo?",
  options: [
    "Fork.",
    "Merge, representado por um losango.",
    "Join, representado por uma barra.",
    "Start, representado por um círculo preenchido."
  ],
  answer: 1,
  feedback: "O merge combina fluxos alternativos após uma decisão. Fork e join tratam de paralelismo."
},
// 10 - Artefato
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Aplicação",
  texto: "Em um diagrama de componentes, a equipe quer indicar que o componente Sistema de Autenticação é implementado pelo arquivo compilado autenticacao.jar.",
  question: "Como esse arquivo é representado no diagrama?",
  options: [
    "Como um artefato.",
    "Como uma interface (lollipop).",
    "Como uma dependência.",
    "Como um estereótipo."
  ],
  answer: 0,
  feedback: "O artefato representa o resultado do processo de desenvolvimento, como um arquivo binário ou script, e se associa ao componente que o implementa."
},
// ===== AULA 10 =====
// 1 - User Story
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Direta",
  texto: "Uma User Story tem três partes: Como, Eu quero e Para que.",
  question: "O que a parte 'Para que' da User Story informa?",
  options: [
    "O tipo de usuário que pede a funcionalidade.",
    "A ação que o usuário deseja realizar.",
    "O objetivo ou benefício esperado.",
    "O esforço estimado em horas."
  ],
  answer: 2,
  feedback: "O 'Para que' explica o valor da funcionalidade, ajudando a equipe a entender o motivo do requisito."
},
// 2 - INVEST
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Direta",
  texto: "O acrônimo INVEST resume as características de boas User Stories.",
  question: "O que significa a letra T do INVEST?",
  options: [
    "Testável.",
    "Total.",
    "Técnica.",
    "Temporária."
  ],
  answer: 0,
  feedback: "Testável: deve haver uma forma clara de verificar se a funcionalidade foi implementada corretamente."
},
// 3 - Escopo
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Direta",
  texto: "O Diagrama de Caso de Uso tem várias funções em um projeto de software.",
  question: "Qual dessas funções delimita o que está dentro e fora do projeto?",
  options: [
    "Definição de escopo.",
    "Geração automática de código.",
    "Cálculo de multas.",
    "Escolha do banco de dados."
  ],
  answer: 0,
  feedback: "Ao mostrar as interações e funcionalidades suportadas, o diagrama delimita o escopo do sistema."
},
// 4 - Pré-condição
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Contexto",
  texto: "No SCB, cada caso de uso tem ator, pré-condição e User Story. Renovar Empréstimo é feito pelo usuário da biblioteca.",
  question: "Qual é a pré-condição do caso de uso Renovar Empréstimo?",
  options: [
    "O usuário deve ser bibliotecário.",
    "O livro não deve estar reservado por outro usuário.",
    "O livro deve ter sido emprestado há mais de um ano.",
    "O usuário não pode ter multas pagas."
  ],
  answer: 1,
  feedback: "Se houver reserva por outro usuário, a renovação não é permitida. Isso também aparece no requisito RF11."
},
// 5 - Encapsulamento
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Contexto",
  texto: "No Diagrama de Classes do SCB, os atributos são privados (-) e os métodos são públicos (+), com getters e setters para acessar os dados.",
  question: "Qual princípio essa escolha reforça?",
  options: [
    "Herança.",
    "Polimorfismo.",
    "Cardinalidade.",
    "Encapsulamento."
  ],
  answer: 3,
  feedback: "O acesso controlado aos atributos protege a integridade dos dados e preserva o encapsulamento."
},
// 6 - Livro e Exemplar
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Aplicação",
  texto: "A biblioteca possui três cópias físicas do mesmo título, e cada cópia pode ser emprestada separadamente.",
  question: "Como isso deve ser modelado no Diagrama de Classes do SCB?",
  options: [
    "Três classes Livro independentes.",
    "Uma classe Livro com três atributos de empréstimo.",
    "Uma classe Usuário com três livros.",
    "Uma classe Livro associada a três instâncias de Exemplar."
  ],
  answer: 3,
  feedback: "Um Livro possui vários Exemplares. O empréstimo e a reserva se referem ao exemplar, e não ao título."
},
// 7 - Escolha do diagrama
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Aplicação",
  texto: "A equipe quer mostrar, passo a passo e na ordem em que acontecem, as mensagens trocadas entre UsuarioBiblioteca, Bibliotecario e Exemplar durante um empréstimo.",
  question: "Qual diagrama é o mais indicado?",
  options: [
    "Diagrama de Sequência.",
    "Diagrama de Classes.",
    "Diagrama de Componentes.",
    "Diagrama de Caso de Uso."
  ],
  answer: 0,
  feedback: "O Diagrama de Sequência exibe a ordem temporal das mensagens entre os objetos."
},
// 8 - Título e nome
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Código",
  texto: "Um desenvolvedor escreveu o código PlantUML a seguir para documentar o SCB.",
  question: "O que aparece escrito no topo do desenho, e o que 'casos-scb' representa?",
  code: `@startuml casos-scb
title Casos de Uso - SCB
actor Bibliotecario
usecase "Inserir Livro" as UC1
Bibliotecario --> UC1
@enduml`,
  options: [
    "No topo aparece casos-scb, e o título é o nome do arquivo.",
    "No topo aparece Casos de Uso - SCB, e casos-scb é o nome do arquivo de saída.",
    "Nada aparece no topo, pois o título só vale com skinparam.",
    "No topo aparece UC1, e casos-scb é o ator."
  ],
  answer: 1,
  feedback: "O comando title exibe o título no topo. O nome após @startuml não é desenhado e serve como nome do arquivo gerado."
},
// 9 - Direção
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Código",
  texto: "O trecho a seguir descreve uma máquina de estados simples em PlantUML.",
  question: "Como os elementos serão dispostos no diagrama gerado?",
  code: `@startuml horizontal
left to right direction
[*] --> Estado1
Estado1 --> Estado2 : Transição()
Estado2 --> [*]
@enduml`,
  options: [
    "De cima para baixo, que é o padrão.",
    "Em círculo, sem direção definida.",
    "Da direita para a esquerda.",
    "Da esquerda para a direita."
  ],
  answer: 3,
  feedback: "A diretiva left to right direction altera a orientação padrão (top to bottom) para a horizontal."
},
// 10 - Fragmento alt
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Código",
  texto: "O código PlantUML abaixo é parte de um Diagrama de Sequência de login.",
  question: "O que o bloco alt ... else ... end representa?",
  code: `User -> System: Enviar Credenciais
System -> DB: Validar Credenciais
alt Login Válido
  DB --> System: Credenciais Válidas
  System -> User: Exibir Dashboard
else Login Inválido
  DB --> System: Credenciais Inválidas
  System -> User: Mostrar Erro
end`,
  options: [
    "Uma repetição de mensagens, como um loop.",
    "Uma etapa opcional que pode ser ignorada.",
    "Dois caminhos alternativos, como um if/else.",
    "Mensagens executadas ao mesmo tempo."
  ],
  answer: 2,
  feedback: "O fragmento alt representa condições alternativas. Loop repete mensagens, e opt representa uma condição opcional."
},
// ===== AULA 11 =====
// 1 - MVC
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Direta",
  texto: "O MVC divide a aplicação em camadas com responsabilidades distintas.",
  question: "Qual camada do MVC apresenta a interface ao usuário?",
  options: [
    "Model.",
    "Controller.",
    "View.",
    "Route."
  ],
  answer: 2,
  feedback: "A View apresenta a interface. A Model cuida dos dados e a Controller coordena as requisições."
},
// 2 - package.json
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Direta",
  texto: "No projeto Node.js do SCB, cada arquivo tem uma função na organização do código.",
  question: "O que o arquivo package.json contém?",
  options: [
    "A lógica de controle dos empréstimos.",
    "O mapeamento das URLs da aplicação.",
    "A definição das tabelas do banco de dados.",
    "As configurações do projeto, como dependências e scripts."
  ],
  answer: 3,
  feedback: "O package.json guarda dependências e scripts. Rotas ficam em arquivos como loanRoutes.js, e a conexão com o banco, em config/db.js."
},
// 3 - Node.js
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Direta",
  texto: "A implementação inicial do SCB foi feita em JavaScript com um ambiente de execução específico.",
  question: "O que o Node.js permite?",
  options: [
    "Executar JavaScript no lado do servidor.",
    "Desenhar diagramas UML por script.",
    "Compilar código Java para a web.",
    "Armazenar dados sem banco de dados."
  ],
  answer: 0,
  feedback: "O Node.js, baseado no motor V8, executa JavaScript no servidor e lida com I/O de forma assíncrona e orientada a eventos."
},
// 4 - Componentes
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Contexto",
  texto: "O diagrama de componentes do SCB mostra o aplicativo web, a API e o banco de dados, e como eles se relacionam.",
  question: "Qual visão esse diagrama oferece do sistema?",
  options: [
    "Do ciclo de vida de um objeto.",
    "Da arquitetura física e das dependências entre módulos.",
    "Da sequência temporal das mensagens.",
    "Dos atributos privados de cada classe."
  ],
  answer: 1,
  feedback: "Ele dá uma visão de alto nível da estrutura e da alocação das funcionalidades entre os módulos."
},
// 5 - Model
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Contexto",
  texto: "No SCB, o modelo Book define a estrutura e o comportamento de um exemplar de livro, com métodos para verificar e atualizar sua disponibilidade.",
  question: "Em qual camada do MVC esse código se encaixa?",
  options: [
    "View.",
    "Model.",
    "Controller.",
    "Router."
  ],
  answer: 1,
  feedback: "A Model lida com dados e regras ligadas a eles, como a disponibilidade do exemplar."
},
// 6 - Rotas
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Contexto",
  texto: "Quando o usuário envia uma requisição para uma URL, o sistema precisa saber qual método de qual controlador deve tratá-la.",
  question: "Qual elemento do projeto faz esse mapeamento?",
  options: [
    "Os arquivos de rotas (Routes).",
    "Os arquivos de modelo (Models).",
    "O arquivo package.json.",
    "O diagrama de componentes."
  ],
  answer: 0,
  feedback: "Arquivos como bookRoutes.js e loanRoutes.js ligam URLs a métodos dos controladores."
},
// 7 - app.js
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Aplicação",
  texto: "Uma pessoa nova na equipe quer saber onde o servidor do SCB é configurado, as rotas são importadas e o sistema é iniciado.",
  question: "Qual arquivo ela deve abrir?",
  options: [
    "config/db.js.",
    "book.js.",
    "loanController.js.",
    "app.js."
  ],
  answer: 3,
  feedback: "O app.js é o ponto de entrada da aplicação: configura o servidor, importa as rotas e inicializa o sistema."
},
// 8 - Diagrama de estados
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Aplicação",
  texto: "Uma loja virtual precisa modelar o status de um pedido, que passa por Aguardando pagamento, Pago, Enviado e Entregue conforme eventos.",
  question: "Qual diagrama representa melhor essa situação?",
  options: [
    "Diagrama de Componentes.",
    "Diagrama de Estados.",
    "Diagrama de Implantação.",
    "Diagrama de Classes."
  ],
  answer: 1,
  feedback: "O Diagrama de Estados mostra como um objeto muda de estado em resposta a eventos ao longo do seu ciclo de vida."
},
// 9 - Código: estados
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Código",
  texto: "O diagrama de estados do exemplar de livro foi escrito em PlantUML como no trecho abaixo.",
  question: "Em qual estado o exemplar fica depois do evento devolver()?",
  code: `@startuml
[*] --> Disponivel
Disponivel --> Reservado : reservar()
Disponivel --> Emprestado : emprestar()
Reservado --> Emprestado : emprestar()
Emprestado --> Disponivel : devolver()
@enduml`,
  options: [
    "Reservado.",
    "Emprestado.",
    "Disponivel.",
    "Estado final."
  ],
  answer: 2,
  feedback: "A transição devolver() leva o exemplar de Emprestado de volta a Disponivel."
},
// 10 - Código: atividade
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Código",
  texto: "O processo de empréstimo foi descrito em PlantUML com um diagrama de atividades.",
  question: "O que o fluxo faz quando o exemplar NÃO está disponível?",
  code: `@startuml
start
:Usuário solicita empréstimo;
if (Exemplar disponível?) then (sim)
  :Registrar empréstimo;
else (não)
  :Avisar indisponibilidade;
endif
stop
@enduml`,
  options: [
    "Registra o empréstimo mesmo assim.",
    "Encerra sem nenhuma ação.",
    "Volta ao início do processo.",
    "Segue para o aviso de indisponibilidade."
  ],
  answer: 3,
  feedback: "O nó de decisão bifurca o fluxo: no ramo não, a atividade é avisar a indisponibilidade, e o processo termina."
},
// ===== AULA 12 =====
// 1 - Ano do GoF
{
  aula: "Aula 12 - Introdução",
  tipo: "Direta",
  texto: "O livro Design Patterns: Elements of Reusable Object-Oriented Software marcou a engenharia de software.",
  question: "Em que ano ele foi publicado?",
  options: [
    "1984.",
    "1994.",
    "2004.",
    "2014."
  ],
  answer: 1,
  feedback: "O livro do Gang of Four foi publicado em 1994 e documentou 23 padrões fundamentais."
},
// 2 - Facade
{
  aula: "Aula 12 - Introdução",
  tipo: "Direta",
  texto: "Os padrões do GoF se dividem em categorias conforme o problema que resolvem.",
  question: "A qual categoria pertence o padrão Facade?",
  options: [
    "Criacional.",
    "Comportamental.",
    "Arquitetural.",
    "Estrutural."
  ],
  answer: 3,
  feedback: "Facade é estrutural: fornece uma interface simplificada para um conjunto complexo de classes."
},
// 3 - Strategy
{
  aula: "Aula 12 - Introdução",
  tipo: "Direta",
  texto: "Entre os padrões comportamentais, alguns tratam de algoritmos e outros de notificações.",
  question: "O que o padrão Strategy faz?",
  options: [
    "Notifica automaticamente objetos dependentes.",
    "Garante uma única instância de uma classe.",
    "Define uma família de algoritmos intercambiáveis.",
    "Cria objetos por cópia de um protótipo."
  ],
  answer: 2,
  feedback: "Strategy encapsula cada algoritmo e permite trocá-los conforme o contexto. Notificar dependentes é papel do Observer."
},
// 4 - Receita genérica
{
  aula: "Aula 12 - Introdução",
  tipo: "Contexto",
  texto: "Um desenvolvedor iniciante pergunta por que não existe um arquivo pronto de cada padrão de projeto para copiar e colar nos sistemas.",
  question: "Qual é a explicação correta?",
  options: [
    "Porque padrões são protegidos por direitos autorais.",
    "Porque padrões só valem para uma linguagem específica.",
    "Porque padrões são apenas diagramas sem uso prático.",
    "Porque padrões são estruturas genéricas de solução, e não código específico."
  ],
  answer: 3,
  feedback: "Cada padrão descreve problema, solução e consequências de forma genérica, para ser adaptado a cada contexto."
},
// 5 - Memento
{
  aula: "Aula 12 - Introdução",
  tipo: "Contexto",
  texto: "Em um editor de texto, o usuário deseja desfazer a última alteração. O sistema precisa restaurar o estado anterior do documento sem violar o encapsulamento.",
  question: "Qual padrão do GoF atende essa necessidade?",
  options: [
    "Memento.",
    "Singleton.",
    "Adapter.",
    "Builder."
  ],
  answer: 0,
  feedback: "O Memento captura e restaura o estado interno de um objeto, sendo útil em funcionalidades de desfazer."
},
// 6 - Uso do Singleton
{
  aula: "Aula 12 - Introdução",
  tipo: "Contexto",
  texto: "O Singleton garante uma única instância e um ponto de acesso global, o que combina com certos recursos compartilhados.",
  question: "Em qual situação o Singleton é mais indicado?",
  options: [
    "Criar vários tipos de produtos relacionados.",
    "Construir um relatório em várias etapas.",
    "Centralizar o acesso a um serviço de log ou a uma conexão com banco.",
    "Copiar objetos já configurados."
  ],
  answer: 2,
  feedback: "Recursos compartilhados e únicos, como log, banco de dados e configuração global, são o cenário típico do Singleton."
},
// 7 - Facade em uso
{
  aula: "Aula 12 - Introdução",
  tipo: "Aplicação",
  texto: "Um sistema de pedidos usa cinco classes diferentes para calcular frete, validar estoque, emitir nota e cobrar o cliente. Os clientes do sistema só querem chamar uma operação simples, finalizarPedido().",
  question: "Qual padrão estrutural ajuda a oferecer essa interface simplificada?",
  options: [
    "Decorator.",
    "Facade.",
    "Proxy.",
    "Flyweight."
  ],
  answer: 1,
  feedback: "O Facade esconde a complexidade do conjunto de classes por trás de uma interface única e simples."
},
// 8 - Observer em uso
{
  aula: "Aula 12 - Introdução",
  tipo: "Aplicação",
  texto: "Em um aplicativo de bolsa de valores, vários gráficos precisam ser atualizados automaticamente sempre que o preço de um ativo muda.",
  question: "Qual padrão se encaixa nessa necessidade?",
  options: [
    "Prototype.",
    "Factory Method.",
    "Observer.",
    "Interpreter."
  ],
  answer: 2,
  feedback: "O Observer cria uma dependência um-para-muitos: quando o objeto observado muda, os dependentes são notificados."
},
// 9 - Código: Singleton
{
  aula: "Aula 12 - Introdução",
  tipo: "Código",
  texto: "A classe Logger do exemplo da aula verifica se já existe uma instância antes de criar outra.",
  question: "Qual será a saída do console.log no final do código?",
  code: `class Logger {
  constructor() {
    if (Logger.instance) return Logger.instance;
    this.logs = [];
    Logger.instance = this;
  }
  log(msg) { this.logs.push(msg); }
}

const a = new Logger();
const b = new Logger();
a.log("início");
console.log(b.logs.length);`,
  options: [
    "0.",
    "1.",
    "2.",
    "undefined."
  ],
  answer: 1,
  feedback: "a e b são a mesma instância. A mensagem registrada por a aparece em b, então o tamanho do histórico é 1."
},
// 10 - Código: sem Singleton
{
  aula: "Aula 12 - Introdução",
  tipo: "Código",
  texto: "Um desenvolvedor tentou aplicar o Singleton em uma classe de configuração, mas esqueceu a verificação da instância no construtor.",
  question: "Qual será o resultado impresso?",
  code: `class Config {
  constructor() {
    this.valor = 1;
  }
}

const c1 = new Config();
const c2 = new Config();
console.log(c1 === c2);`,
  options: [
    "true.",
    "Erro de sintaxe.",
    "undefined.",
    "false."
  ],
  answer: 3,
  feedback: "Sem a verificação de Config.instance, cada new cria um objeto novo. Por isso c1 e c2 são diferentes e o resultado é false."
},
// ===== AULA 13 =====
// 1 - Abstract Factory
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Direta",
  texto: "Entre os padrões de criação, um deles se destaca por tratar de conjuntos de objetos que combinam entre si.",
  question: "O que o Abstract Factory cria?",
  options: [
    "Famílias de objetos relacionados, sem especificar suas classes concretas.",
    "Uma única instância global.",
    "Cópias de um objeto existente.",
    "Objetos complexos construídos passo a passo."
  ],
  answer: 0,
  feedback: "Ele fornece uma interface para criar famílias de objetos relacionados e reduz o acoplamento do cliente com as classes concretas."
},
// 2 - Prototype
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Direta",
  texto: "Alguns padrões de criação evitam construir objetos do zero.",
  question: "Como o padrão Prototype cria novos objetos?",
  options: [
    "Por herança de uma classe abstrata.",
    "Copiando ou clonando uma instância existente.",
    "Chamando uma fábrica de subclasses.",
    "Encadeando métodos de construção."
  ],
  answer: 1,
  feedback: "O Prototype usa uma instância como modelo e cria novos objetos por clonagem, permitindo ajustes em cada cópia."
},
// 3 - Limitação do Singleton
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Direta",
  texto: "Todo padrão traz benefícios e custos, e o Singleton não é exceção.",
  question: "Qual é uma dificuldade associada ao Singleton?",
  options: [
    "Obriga a criar uma classe nova para cada produto.",
    "Impede o uso de herança.",
    "Dependência global que dificulta testes e pode exigir sincronização em ambientes multithreaded.",
    "Só funciona com JavaScript."
  ],
  answer: 2,
  feedback: "A dependência global dificulta isolar componentes para testar, e o acesso concorrente pode exigir controle adicional."
},
// 4 - Fluent interface
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Contexto",
  texto: "No exemplo do Builder, o código cliente escreve algo como builder.buildWalls().buildDoors().buildWindows().getHouse(), encadeando as chamadas.",
  question: "O que torna esse encadeamento possível?",
  options: [
    "Cada método de etapa retorna o próprio builder.",
    "Cada método de etapa retorna a casa pronta.",
    "O construtor é estático.",
    "O método getHouse é chamado primeiro."
  ],
  answer: 0,
  feedback: "Retornar o próprio builder é o que forma a chamada encadeada (fluent interface). Só getHouse devolve o objeto final."
},
// 5 - Quem decide
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Contexto",
  texto: "No exemplo do Factory Method, AnimalFactory declara o método createAnimal, e DogFactory e CatFactory o implementam.",
  question: "Quem decide qual classe concreta será instanciada?",
  options: [
    "O código cliente, com um if.",
    "O banco de dados.",
    "O construtor da classe base.",
    "As subclasses da fábrica."
  ],
  answer: 3,
  feedback: "O Factory Method delega às subclasses a decisão do tipo criado, deixando o código cliente desacoplado das implementações."
},
// 6 - Desvantagem Abstract Factory
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Contexto",
  texto: "Um sistema usa Abstract Factory com SedanFactory e SUVFactory. A equipe agora quer adicionar um novo tipo de produto, o câmbio, a todos os carros.",
  question: "Qual é a consequência disso?",
  options: [
    "Basta criar uma classe nova, sem alterar as fábricas.",
    "É preciso modificar todas as fábricas existentes.",
    "O padrão deixa de funcionar.",
    "O Singleton precisa ser usado."
  ],
  answer: 1,
  feedback: "Adicionar tipos de produto é trabalhoso no Abstract Factory, pois exige alterar todas as fábricas para suportar o novo tipo."
},
// 7 - Builder em uso
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Aplicação",
  texto: "Uma empresa gera relatórios com várias seções opcionais, como cabeçalho, gráficos, tabelas e rodapé, e cada cliente escolhe uma combinação diferente.",
  question: "Qual padrão de criação é o mais adequado?",
  options: [
    "Singleton.",
    "Prototype.",
    "Factory Method.",
    "Builder."
  ],
  answer: 3,
  feedback: "O Builder constrói objetos complexos em etapas, permitindo diferentes configurações pelo mesmo processo de construção."
},
// 8 - Prototype em uso
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Aplicação",
  texto: "Um jogo precisa criar centenas de inimigos com a mesma configuração inicial, mudando apenas alguns detalhes, como posição e cor, em cada um.",
  question: "Qual padrão ajuda a criar esses inimigos de forma eficiente?",
  options: [
    "Prototype.",
    "Abstract Factory.",
    "Singleton.",
    "Builder."
  ],
  answer: 0,
  feedback: "Clonar um protótipo já configurado e alterar pontualmente cada cópia evita reconstruir tudo do zero."
},
// 9 - Código: Builder com erro
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Código",
  texto: "Um desenvolvedor implementou o Builder, mas os métodos de etapa não retornam nada.",
  question: "O que acontece ao executar o código?",
  code: `class HouseBuilder {
  constructor() { this.house = {}; }
  buildWalls()   { this.house.walls = true; }
  buildDoors()   { this.house.doors = 2; }
  getHouse()     { return this.house; }
}

const house = new HouseBuilder()
  .buildWalls()
  .buildDoors()
  .getHouse();`,
  options: [
    "A casa é criada normalmente com paredes e portas.",
    "A casa é criada, mas sem portas.",
    "Ocorre um erro, pois buildWalls() retorna undefined e não permite encadear buildDoors().",
    "Ocorre um erro no construtor da classe."
  ],
  answer: 2,
  feedback: "Sem return this nos métodos de etapa, a chamada encadeada falha, pois o resultado seria undefined."
},
// 10 - Código: Prototype
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Código",
  texto: "No exemplo do Prototype, a cópia é feita com Object.assign, que gera uma cópia superficial. O protótipo abaixo tem uma lista interna.",
  question: "Qual será a saída do console.log?",
  code: `const proto = { nome: "base", itens: ["a"] };
const copia = Object.assign({}, proto);

copia.itens.push("b");
console.log(proto.itens.length);`,
  options: [
    "1.",
    "0.",
    "2.",
    "undefined."
  ],
  answer: 2,
  feedback: "Na cópia superficial, a lista interna é compartilhada. Ao adicionar b na cópia, o protótipo também é afetado, e o tamanho passa a ser 2."
},
],

};