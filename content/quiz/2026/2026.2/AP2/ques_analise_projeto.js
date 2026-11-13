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

enade: [

// ===== AULA 9 =====
// 1 - UML e métodos ágeis
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Asserção + Justificativa",
  texto: "Uma startup que trabalha com Scrum discute se faz sentido adotar a UML, já que os métodos ágeis priorizam software funcionando em vez de documentação extensa.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "A ==def==UML== pode ser adotada tanto em métodos tradicionais, como o Cascata, quanto em métodos ágeis, como o Scrum.",
    "PORQUE a UML é uma linguagem de modelagem padronizada para especificar, visualizar, construir e documentar sistemas, e não uma metodologia de desenvolvimento."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "As duas são verdadeiras e a II justifica a I: por ser uma **linguagem de modelagem** e não uma metodologia nem uma linguagem de programação, a UML se encaixa em qualquer processo. Sua especificação é mantida pela ==term==OMG==."
},
// 2 - Versões da UML
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Múltiplas Afirmativas",
  texto: "Um professor de Engenharia de Software resume a evolução da UML ao longo das décadas para uma turma que está começando a estudar modelagem.",
  question: "Avalie as afirmações a seguir sobre as versões da UML e assinale a alternativa correta.",
  assertions: [
    "A versão 1.1, de 1997, foi a primeira adotada pela OMG e unificou os métodos OMT, Booch e OOSE.",
    "A versão 2.0, de 2005, trouxe uma grande revisão da linguagem, com os diagramas de ==term==Componentes== e Pacotes.",
    "A versão 2.5 dividiu a especificação em Superestrutura e Infraestrutura, que antes formavam um único documento.",
    "A especificação da UML é mantida pela OMG (Object Management Group)."
  ],
  options: [
    "I, II e III, apenas",
    "I, II e IV, apenas",
    "II, III e IV, apenas",
    "I, III e IV, apenas"
  ],
  answer: 1,
  feedback: "A afirmativa III inverte os fatos: foi a UML 2.0 que dividiu a especificação, e a **UML 2.5** integrou Superestrutura e Infraestrutura em um único documento, simplificando-o."
},
// 3 - Escolha do diagrama para stakeholders
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Conceitual Contextualizada",
  texto: "Em uma reunião com stakeholders não técnicos, o analista precisa validar o escopo funcional de um novo sistema, mostrando como os usuários e o administrador interagem com ele, sem entrar em detalhes de implementação.",
  question: "Qual diagrama da UML atende melhor a essa necessidade, e por quê?",
  options: [
    "Diagrama de Classes, porque detalha os atributos e os métodos de cada entidade.",
    "Diagrama de Componentes, porque mostra os módulos do sistema e suas dependências.",
    "Diagrama de Caso de Uso, porque mostra os atores e as funcionalidades de forma acessível.",
    "Diagrama de Implantação, porque mostra a distribuição física dos artefatos nos nós."
  ],
  answer: 2,
  feedback: "O **Diagrama de Caso de Uso** mostra quem (atores) faz o quê (casos de uso), captura requisitos funcionais e é de fácil compreensão para quem não é técnico. Os demais são ==def==estruturais== e tratam de detalhes internos."
},
// 4 - Classes x Objetos
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Asserção + Justificativa",
  texto: "Uma equipe precisa documentar quais livros e usuários existiam em um sistema de biblioteca em uma data específica, e discute se o Diagrama de Classes já seria suficiente.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "O ==def==Diagrama de Objetos== mostra a estrutura estática geral do sistema e é equivalente ao Diagrama de Classes.",
    "PORQUE o Diagrama de Objetos representa instâncias do Diagrama de Classes em um momento específico."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 3,
  feedback: "A I é falsa: a estrutura estática geral é papel do **Diagrama de Classes**. A II é verdadeira e mostra justamente a diferença: o Diagrama de Objetos exibe objetos reais, criados a partir das classes, em um instante."
},
// 5 - Relacionamentos em caso de uso
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Análise Aplicada",
  texto: "No diagrama de caso de uso de um sistema de biblioteca, o caso Login incorpora obrigatoriamente o caso Autenticação. O caso Recuperar Senha só ocorre quando o usuário não consegue entrar. Além disso, o ator Admin é um tipo especial do ator User.",
  question: "Quais relacionamentos conectam, respectivamente, Login e Autenticação, Recuperar Senha e Login, e Admin e User?",
  options: [
    "<<include>>, <<extend>> e generalização.",
    "<<extend>>, <<include>> e generalização.",
    "<<include>>, <<extend>> e associação.",
    "Generalização, <<include>> e <<extend>>."
  ],
  answer: 0,
  feedback: "O ==rule==<<include>>== indica comportamento obrigatório e compartilhado, o <<extend>> indica comportamento condicional, e a **generalização** representa herança entre atores, com seta de ponta vazada do geral para o especializado."
},
// 6 - Diagrama de sequência
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma desenvolvedora modela o fluxo de login de um sistema em um Diagrama de Sequência e precisa usar corretamente a notação da UML.",
  question: "Avalie as afirmações a seguir e assinale a alternativa correta.",
  assertions: [
    "A ==term==linha de vida== é uma linha vertical tracejada que desce a partir do objeto.",
    "As mensagens síncronas usam seta contínua com ponta fechada, e as assíncronas usam seta contínua com ponta vazada.",
    "O fragmento alt representa repetição de mensagens, enquanto o loop representa condições alternativas.",
    "O fragmento opt representa repetição, e o loop representa uma condição opcional."
  ],
  options: [
    "I, II e IV, apenas",
    "II, III e IV, apenas",
    "I e II, apenas",
    "I, II e III, apenas"
  ],
  answer: 2,
  feedback: "As afirmativas III e IV trocam os fragmentos. O **alt** representa condições alternativas (if/else), o **loop** representa repetição e o **opt** representa uma condição opcional."
},
// 7 - Fork, join, decisão e merge
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Asserção + Justificativa",
  texto: "Ao modelar um processo de matrícula em um Diagrama de Atividade, uma analista precisa representar duas tarefas simultâneas, que só devem ser consideradas concluídas quando ambas terminarem.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "O ==term==merge== é o elemento usado para dividir o fluxo em tarefas simultâneas.",
    "PORQUE o fork divide o fluxo em vários fluxos paralelos, e o join reúne esses fluxos em um só."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 3,
  feedback: "A I é falsa: o **merge** reúne fluxos alternativos após uma decisão. Para paralelismo, o par correto é fork e join, como diz a II."
},
// 8 - Máquina de estados finita
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Conceitual Contextualizada",
  texto: "Uma equipe quer garantir que o comportamento de uma porta automática, com os estados opened e closed e os eventos open e close, seja especificado de modo formal antes de produzir um diagrama para comunicar o projeto a analistas e stakeholders.",
  question: "Qual é a relação entre a Máquina de Estados Finita e o Diagrama de Estados nesse caso?",
  options: [
    "O diagrama é o modelo matemático, e a máquina é apenas a sua representação gráfica.",
    "A máquina fornece a base formal do comportamento, e o diagrama a torna visualmente clara e acessível.",
    "Os dois são equivalentes e dispensam a definição de eventos e transições.",
    "A máquina só se aplica a sistemas com número infinito de estados."
  ],
  answer: 1,
  feedback: "A **Máquina de Estados Finita** é o modelo matemático, com número finito de estados e mudanças por eventos. O ==def==Diagrama de Estados== é a sua visualização, útil para desenvolvedores, analistas e stakeholders."
},
// 9 - Fluxo com decisão e paralelismo
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Análise Aplicada",
  texto: "Em um processo de matrícula, o sistema decide se o aluno é calouro ou veterano, e cada caso segue um caminho alternativo. Depois, o fluxo segue unificado. Em seguida, a secretaria gera o boleto e envia o e-mail de boas-vindas ao mesmo tempo, e o processo só continua quando as duas tarefas terminam.",
  question: "Que elementos do Diagrama de Atividade representam, respectivamente, a bifurcação em caminhos alternativos, a reunião desses caminhos, o início do paralelismo e a sincronização ao final do paralelismo?",
  options: [
    "Decisão, merge, fork e join.",
    "Fork, join, decisão e merge.",
    "Decisão, join, fork e merge.",
    "Merge, decisão, join e fork."
  ],
  answer: 0,
  feedback: "A **decisão** bifurca conforme uma condição e o ==def==merge== reúne os caminhos alternativos. Já o fork cria fluxos simultâneos e o join sincroniza esses fluxos paralelos."
},
// 10 - Implantação, artefatos e categorias
{
  aula: "Aula 9 - Introdução a UML (Unified Modeling Language)",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma arquiteta de software revisa a documentação UML de um sistema e confere se os conceitos de implantação e as categorias de diagramas foram usados corretamente.",
  question: "Avalie as afirmações a seguir e assinale a alternativa correta.",
  assertions: [
    "O ==def==Diagrama de Implantação== mostra a distribuição física dos artefatos em nós da rede.",
    "Um artefato, como o arquivo compilado autenticacao.jar, representa o resultado do processo de desenvolvimento e se associa ao componente que o implementa.",
    "Os Diagramas de Componentes e de Implantação são comportamentais, pois descrevem a interação entre objetos ao longo do tempo.",
    "Os Diagramas de Estados e de Atividade pertencem à categoria dos diagramas comportamentais."
  ],
  options: [
    "II e III, apenas",
    "I, III e IV, apenas",
    "I, II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 2,
  feedback: "A III é falsa: Componentes e Implantação são **estruturais**, pois mostram elementos estáticos. Os comportamentais mostram o comportamento ao longo do tempo, como Sequência, Estados e Atividade."
},
// ===== AULA 10 =====
// 1 - PlantUML
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Asserção + Justificativa",
  texto: "Uma equipe de desenvolvimento quer versionar seus diagramas junto com o código-fonte e avalia o uso do PlantUML no lugar de uma ferramenta visual.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "O ==def==PlantUML== permite criar diagramas a partir de um script textual, no estilo diagramas-como-código.",
    "PORQUE todo diagrama em PlantUML começa com @startuml e termina com @enduml."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 1,
  feedback: "Ambas são verdadeiras, mas a II é só um detalhe de sintaxe e não explica a I. O que viabiliza o **diagrama como código** é o fato de ele ser definido por texto, o que dá independência de plataforma e evita formatos de arquivo incompatíveis."
},
// 2 - User Stories e requisitos
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Múltiplas Afirmativas",
  texto: "Na modelagem do Sistema de Controle de Biblioteca (SCB), a equipe escreve User Stories e classifica os requisitos antes de desenhar os diagramas.",
  question: "Avalie as afirmações a seguir e assinale a alternativa correta.",
  assertions: [
    "Uma ==def==User Story== segue a estrutura: Como [tipo de usuário], eu quero [ação], para que [objetivo ou benefício].",
    "No INVEST, o I indica Independent, e o S indica Small, ou seja, pequena o bastante para ser desenvolvida em uma sprint.",
    "Requisitos não funcionais descrevem o que o sistema faz, como registrar devolução calculando multas por atraso.",
    "Por motivos didáticos, a aula modela apenas os aspectos funcionais do SCB."
  ],
  options: [
    "I e II, apenas",
    "I, II e III, apenas",
    "I, II e IV, apenas",
    "II, III e IV, apenas"
  ],
  answer: 2,
  feedback: "A III é falsa: o que o sistema faz é requisito **funcional**. Os não funcionais descrevem qualidades, como desempenho, segurança, acessibilidade e escalabilidade."
},
// 3 - INVEST: Independent
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Conceitual Contextualizada",
  texto: "Uma equipe tem a história: Como bibliotecário, eu quero registrar a devolução com cálculo de multa por atraso, para manter o acervo e as cobranças atualizados. A história é pequena e testável, mas só pode ser desenvolvida depois que outra história, a de cadastro de usuários, estiver concluída.",
  question: "Qual característica do INVEST está comprometida nessa situação?",
  options: [
    "Independent, pois a história não pode ser desenvolvida sem que outra seja concluída antes.",
    "Small, pois a história é grande demais para caber em uma sprint.",
    "Testable, pois não há como verificar se a funcionalidade foi implementada.",
    "Valuable, pois a história não traz benefício a nenhuma parte interessada."
  ],
  answer: 0,
  feedback: "O I de **INVEST** significa independente: boas histórias podem ser desenvolvidas sem depender de outras. A história descrita é pequena, testável e valiosa, mas está ==warn==acoplada== à de cadastro."
},
// 4 - Nome e título em PlantUML
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Asserção + Justificativa",
  texto: "Um desenvolvedor escreveu @startuml estados-do-sistema no início do seu código PlantUML e estranhou não ver esse texto no desenho gerado.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "Em PlantUML, o nome escrito na linha do ==term==@startuml== é exibido no topo do diagrama.",
    "PORQUE o comando title adiciona um título exibido no topo do diagrama."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 3,
  feedback: "A I é falsa: o nome após @startuml **não aparece no desenho** e serve como nome do arquivo de saída. A II é verdadeira, pois é o title que exibe texto no topo."
},
// 5 - Código de estados com direção
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Análise Aplicada",
  texto: "Um desenvolvedor escreveu o código PlantUML a seguir para o ciclo de vida de um exemplar de livro e o renderizou.",
  question: "Qual afirmação descreve corretamente o diagrama gerado?",
  code: `@startuml
left to right direction
[*] --> Disponivel
Disponivel --> Reservado : reservar()
Reservado --> Emprestado : emprestar()
Emprestado --> Disponivel : devolver()
@enduml`,
  options: [
    "Será desenhado de cima para baixo, e um exemplar Disponivel pode ir direto para Emprestado.",
    "Será desenhado da esquerda para a direita, e, após devolver(), o exemplar volta a Disponivel.",
    "Não será gerado, pois falta o comando title no início do código.",
    "Será desenhado da esquerda para a direita, e o exemplar vai a um estado final após devolver()."
  ],
  answer: 1,
  feedback: "A diretiva ==key==left to right direction== muda a orientação padrão (de cima para baixo) para a **horizontal**. A transição ==dml==devolver()== leva Emprestado de volta a Disponivel, e não há transição para estado final nem de Disponivel direto a Emprestado."
},
// 6 - Classes
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Múltiplas Afirmativas",
  texto: "A equipe do SCB revisa o Diagrama de Classes antes de iniciar a implementação e confere as decisões de modelagem.",
  question: "Avalie as afirmações a seguir e assinale a alternativa correta.",
  assertions: [
    "Os atributos são privados (-) e os métodos são públicos (+), e os getters e setters controlam o acesso preservando o ==def==encapsulamento==.",
    "Um exemplar pode pertencer a vários livros ao mesmo tempo.",
    "O empréstimo e a reserva se referem ao exemplar, e não ao título.",
    "O getter recupera o valor de um atributo privado, e o setter define ou altera esse valor."
  ],
  options: [
    "I, II e III, apenas",
    "II, III e IV, apenas",
    "I, III e IV, apenas",
    "I, II e IV, apenas"
  ],
  answer: 2,
  feedback: "A II é falsa: um Livro possui vários **Exemplares**, e cada exemplar pertence a um único livro. O livro é o título, e o exemplar é a cópia física emprestada ou reservada."
},
// 7 - Sequência para verificar caso de uso
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Conceitual Contextualizada",
  texto: "A equipe do SCB precisa verificar se o caso de uso Renovar Empréstimo, cuja pré-condição é o livro não estar reservado por outro usuário, está sendo cumprido na ordem correta das interações entre UsuarioBiblioteca, Bibliotecario e Exemplar.",
  question: "Qual diagrama atende melhor a essa verificação, e por quê?",
  options: [
    "Diagrama de Classes, porque mostra os atributos privados de cada classe.",
    "Diagrama de Componentes, porque mostra a arquitetura física do sistema.",
    "Diagrama de Estados, porque descreve o fluxo de qualquer processo de negócio.",
    "Diagrama de Sequência, porque exibe a ordem temporal das mensagens trocadas entre os objetos."
  ],
  answer: 3,
  feedback: "O **Diagrama de Sequência** organiza as mensagens em uma linha do tempo e ajuda a verificar se os casos de uso estão sendo cumpridos. O de Estados trata do ciclo de vida de um único objeto."
},
// 8 - Escopo
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Asserção + Justificativa",
  texto: "No início do projeto do SCB, o gerente precisa deixar claro com o cliente o que será e o que não será entregue.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "O Diagrama de Caso de Uso é útil para a ==def==definição de escopo== do projeto.",
    "PORQUE ele mostra as interações e as funcionalidades suportadas pelo sistema, deixando claro o que está dentro e fora do projeto."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "As duas são verdadeiras e a II justifica a I: ao mostrar **atores e funcionalidades**, o diagrama delimita o escopo e também ajuda a capturar requisitos funcionais."
},
// 9 - Requisitos não funcionais
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Análise Aplicada",
  texto: "A equipe do SCB listou os seguintes itens: (1) RF10, registrar devolução calculando multas por atraso; (2) o sistema deve ser escalável para suportar o aumento de registros e de usuários; (3) RF12, realizar reserva de livros indisponíveis; (4) o sistema deve proteger os dados dos usuários, garantindo segurança.",
  question: "Quais desses itens são requisitos não funcionais?",
  options: [
    "Somente (1) e (3).",
    "(2) e (4).",
    "(3) e (4).",
    "(1) e (2)."
  ],
  answer: 1,
  feedback: "Escalabilidade e segurança descrevem **qualidades do sistema**, e por isso são ==term==não funcionais==. Registrar devolução e realizar reserva são funcionalidades, ou seja, requisitos funcionais."
},
// 10 - Sintaxe do PlantUML
{
  aula: "Aula 10 - Diagramas Estruturais",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma desenvolvedora está aprendendo a sintaxe do PlantUML e revisa o que cada elemento faz.",
  question: "Avalie as afirmações a seguir e assinale a alternativa correta.",
  assertions: [
    "Todo diagrama começa com @startuml e termina com @enduml, delimitadores que informam ao processador onde o código começa e termina.",
    "O comando ==proc==skinparam== personaliza cores, fontes e espessura de linhas, e o !theme aplica um tema pré-definido.",
    "A diretiva left to right direction muda a orientação padrão, que é de cima para baixo.",
    "O nome na linha do @startuml aparece no topo do diagrama e dispensa o comando title."
  ],
  options: [
    "I, II, III e IV",
    "II, III e IV, apenas",
    "I e IV, apenas",
    "I, II e III, apenas"
  ],
  answer: 3,
  feedback: "A IV é falsa: o nome após @startuml **não é desenhado**, e o título visível exige o comando title."
},
// ===== AULA 11 =====
// 1 - Estados x Sequência
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Asserção + Justificativa",
  texto: "A equipe do SCB quer detalhar como um exemplar de livro muda de situação ao longo do tempo, passando por Disponível, Reservado e Emprestado.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "O ==def==Diagrama de Estados== é adequado para detalhar o ciclo de vida de um objeto específico, como o exemplar do livro.",
    "PORQUE ele mostra a ordem temporal das mensagens trocadas entre vários objetos, como o Diagrama de Sequência."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 2,
  feedback: "A I é verdadeira. A II é falsa porque descreve o **Diagrama de Sequência**. O Diagrama de Estados mostra os estados de uma entidade e as transições causadas por eventos."
},
// 2 - Diagramas comportamentais e de componentes
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Múltiplas Afirmativas",
  texto: "Ao documentar o SCB, a equipe distribui as informações entre diferentes diagramas e precisa conferir o papel de cada um.",
  question: "Avalie as afirmações a seguir e assinale a alternativa correta.",
  assertions: [
    "No Diagrama de Estados do exemplar, as transições são acionadas por eventos, como ==proc==reservar()== e emprestar().",
    "O Diagrama de Atividades modela fluxos de trabalho com ações e decisões, como o processo de empréstimo.",
    "O Diagrama de Componentes mostra a arquitetura física, como aplicativo web, API e banco de dados, e suas dependências.",
    "O Diagrama de Componentes mostra o ciclo de vida de um objeto ao longo do tempo."
  ],
  options: [
    "I, II e III, apenas",
    "I, II e IV, apenas",
    "II, III e IV, apenas",
    "I, III e IV, apenas"
  ],
  answer: 0,
  feedback: "A IV é falsa: o ciclo de vida de um objeto é tema do **Diagrama de Estados**. O Diagrama de Componentes dá uma visão de alto nível dos módulos e de onde as funcionalidades estão alocadas."
},
// 3 - Estados em loja virtual
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Conceitual Contextualizada",
  texto: "Em uma loja virtual, o pedido passa pelas situações Aguardando pagamento, Pago, Enviado e Entregue, conforme eventos como a confirmação do pagamento e o despacho. A equipe precisa documentar exatamente como o pedido muda de situação.",
  question: "Qual diagrama atende melhor a essa necessidade, e por quê?",
  options: [
    "Diagrama de Componentes, porque mostra os módulos e as suas dependências.",
    "Diagrama de Estados, porque mostra como um objeto muda de estado em resposta a eventos.",
    "Diagrama de Classes, porque representa as transições entre as situações do pedido.",
    "Diagrama de Implantação, porque mostra o fluxo do pedido pelos nós físicos da rede."
  ],
  answer: 1,
  feedback: "O **Diagrama de Estados** descreve os estados de uma entidade e as transições entre eles, causadas por eventos, ao longo do seu ciclo de vida. O pedido da loja se encaixa nesse modelo."
},
// 4 - MVC
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Asserção + Justificativa",
  texto: "Ao estruturar o projeto Node.js do SCB, a equipe adota o padrão MVC para separar as responsabilidades da aplicação.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "No padrão ==def==MVC==, a Controller é a camada responsável pela interface apresentada ao usuário.",
    "PORQUE a Controller atua como intermediária, processando requisições e coordenando a comunicação entre Model e View."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 3,
  feedback: "A I é falsa: quem apresenta a interface é a **View**. A Model cuida da lógica de dados e do banco, e a Controller, como diz a II, faz a intermediação entre as duas."
},
// 5 - Código de atividade
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Análise Aplicada",
  texto: "O processo de empréstimo do SCB foi descrito em PlantUML como um Diagrama de Atividades, conforme o código a seguir.",
  question: "Qual afirmação sobre o fluxo descrito é correta?",
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
    "O empréstimo é registrado sempre, independentemente da disponibilidade.",
    "O fluxo usa fork e join, pois os dois ramos são executados em paralelo.",
    "A decisão bifurca o fluxo: registra se disponível ou avisa a indisponibilidade.",
    "O ramo não retorna ao início, e o processo continua sem nenhum encerramento."
  ],
  answer: 2,
  feedback: "O nó de ==key==decisão== (if) bifurca o fluxo conforme a condição, e cada ramo leva a uma atividade diferente, antes do **stop**. Fork e join só são usados para paralelismo."
},
// 6 - Node.js, MVC e estrutura
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma desenvolvedora recém-chegada à equipe do SCB revisa as tecnologias e a organização do projeto Node.js antes de começar a programar.",
  question: "Avalie as afirmações a seguir e assinale a alternativa correta.",
  assertions: [
    "O ==def==Node.js== executa JavaScript no lado do servidor, é baseado no motor V8 e trata o I/O de forma assíncrona e orientada a eventos.",
    "Na camada Model ficam a lógica de dados e a interação com o banco, enquanto a View apresenta a interface ao usuário.",
    "Os arquivos de rotas mapeiam URLs para métodos dos controladores, e o app.js é o ponto de entrada da aplicação.",
    "O package.json define as rotas da aplicação e a conexão com o banco de dados."
  ],
  options: [
    "I, II e III, apenas",
    "II, III e IV, apenas",
    "I e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A IV é falsa: o **package.json** guarda dependências e scripts do projeto. As rotas ficam em arquivos como loanRoutes.js, e a conexão com o banco, em config/db.js."
},
// 7 - loanController
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Asserção + Justificativa",
  texto: "Na implementação do SCB, o código do loanController foi escrito a partir dos diagramas de atividades e de estados.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "No SCB, o ==proc==loanController== verifica a disponibilidade do exemplar antes de registrar o empréstimo.",
    "PORQUE o Node.js foi desenvolvido com base no motor V8 do Google Chrome."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 1,
  feedback: "As duas são verdadeiras, mas **sem relação de causa**. A verificação de disponibilidade vem do fluxo modelado no Diagrama de Atividades, e o motor V8 é só uma característica do ambiente de execução."
},
// 8 - Arquivos do projeto
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Conceitual Contextualizada",
  texto: "Uma pessoa recém-chegada à equipe do SCB precisa descobrir onde o servidor é configurado, as rotas são importadas e o sistema é iniciado, e também onde está a lógica de conexão com o banco de dados.",
  question: "Quais arquivos ela deve consultar, respectivamente?",
  options: [
    "book.js e loanController.js.",
    "package.json e loanRoutes.js.",
    "bookRoutes.js e user.js.",
    "app.js e config/db.js."
  ],
  answer: 3,
  feedback: "O **app.js** é o ponto de entrada: configura o servidor, importa as rotas e inicia o sistema. O ==def==config/db.js== gerencia a conexão com o banco de dados."
},
// 9 - Código de estados
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Análise Aplicada",
  texto: "O ciclo de vida do exemplar de livro foi descrito em PlantUML, conforme o código a seguir.",
  question: "Um exemplar Disponivel é reservado, depois emprestado e, por fim, devolvido. Qual é a sequência de estados percorrida?",
  code: `@startuml
[*] --> Disponivel
Disponivel --> Reservado : reservar()
Disponivel --> Emprestado : emprestar()
Reservado --> Emprestado : emprestar()
Emprestado --> Disponivel : devolver()
@enduml`,
  options: [
    "Disponivel, Reservado, Emprestado, Disponivel.",
    "Disponivel, Emprestado, Reservado, Disponivel.",
    "Disponivel, Reservado, Disponivel, Emprestado.",
    "Disponivel, Reservado, Emprestado, estado final."
  ],
  answer: 0,
  feedback: "Cada evento aciona uma **transição**: ==dml==reservar()== leva a Reservado, emprestar() leva a Emprestado e devolver() retorna a Disponivel. O código não define estado final."
},
// 10 - Componentes e dependências
{
  aula: "Aula 11 - Diagramas Comportamentais",
  tipo: "Múltiplas Afirmativas",
  texto: "A arquiteta do SCB apresenta ao time o Diagrama de Componentes do sistema, com aplicativo web, API e banco de dados.",
  question: "Avalie as afirmações a seguir e assinale a alternativa correta.",
  assertions: [
    "No Diagrama de Componentes, a ==def==dependência== indica que um componente precisa de outro para funcionar.",
    "Em uma arquitetura em camadas, o aplicativo web envia requisições à API, e a API acessa o banco de dados.",
    "Na arquitetura do SCB, o aplicativo web depende diretamente do banco de dados, sem passar pela API.",
    "Essa visão ajuda a planejar a implantação do sistema."
  ],
  options: [
    "I e III, apenas",
    "II e III, apenas",
    "I, II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 2,
  feedback: "A III é falsa: no exemplo, cada camada depende da seguinte (**web, API e banco**). A dependência mostra o que cada componente precisa para funcionar."
},
// ===== AULA 12 =====
// 1 - Linguagem comum
{
  aula: "Aula 12 - Introdução",
  tipo: "Asserção + Justificativa",
  texto: "Dois desenvolvedores de equipes diferentes dizem vamos usar um Observer aqui e se entendem de imediato, sem precisar explicar a estrutura da solução.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "Os ==def==padrões de projeto== criam uma linguagem comum entre desenvolvedores e arquitetos.",
    "PORQUE cada padrão tem um nome e descreve um problema recorrente, a solução e as consequências de aplicá-la, o que permite falar do design de forma clara."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "As duas são verdadeiras e a II justifica a I: o nome do padrão funciona como **vocabulário compartilhado**, e essa característica é chamada de comunicabilidade."
},
// 2 - GoF
{
  aula: "Aula 12 - Introdução",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma professora apresenta o livro Design Patterns: Elements of Reusable Object-Oriented Software e o seu papel na engenharia de software.",
  question: "Avalie as afirmações a seguir e assinale a alternativa correta.",
  assertions: [
    "O livro, de 1994, escrito pelo ==term==Gang of Four==, documentou 23 padrões organizados em Criacionais, Estruturais e Comportamentais.",
    "Adapter, Decorator e Facade são exemplos de padrões estruturais.",
    "Observer, Strategy e Command são exemplos de padrões criacionais.",
    "Padrões de projeto são soluções genéricas, e não código pronto para ser copiado."
  ],
  options: [
    "I, II e III, apenas",
    "I, II e IV, apenas",
    "II, III e IV, apenas",
    "I e III, apenas"
  ],
  answer: 1,
  feedback: "A III é falsa: Observer, Strategy e Command são **comportamentais**, pois tratam da interação entre componentes. Os criacionais, como Factory Method, Singleton e Builder, tratam da criação de objetos."
},
// 3 - Observer
{
  aula: "Aula 12 - Introdução",
  tipo: "Conceitual Contextualizada",
  texto: "Em uma aplicação de bolsa de valores, vários gráficos precisam ser atualizados automaticamente sempre que o preço de um ativo muda, sem que o ativo precise conhecer os detalhes de cada gráfico.",
  question: "Qual padrão de projeto atende melhor a essa necessidade, e a qual categoria ele pertence?",
  options: [
    "Singleton, criacional, porque garante um único ponto de acesso ao ativo.",
    "Facade, estrutural, porque simplifica a interface de um conjunto de classes.",
    "Observer, comportamental, porque cria dependência um-para-muitos com notificação automática.",
    "Prototype, criacional, porque copia objetos já existentes para novos gráficos."
  ],
  answer: 2,
  feedback: "O **Observer** define uma dependência um-para-muitos: quando o objeto observado muda de estado, os dependentes são notificados automaticamente. É um padrão ==term==comportamental==."
},
// 4 - Singleton é criacional
{
  aula: "Aula 12 - Introdução",
  tipo: "Asserção + Justificativa",
  texto: "Um estudante classifica os padrões do GoF por categoria e inclui o Singleton entre os padrões que cuidam da composição de classes e objetos.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "O padrão ==def==Singleton== é um padrão estrutural, pois organiza a composição entre classes e objetos.",
    "PORQUE o Singleton garante que uma classe tenha apenas uma instância e fornece um ponto de acesso global a ela."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 3,
  feedback: "A I é falsa: o Singleton é **criacional**, pois controla como o objeto é criado. A II descreve corretamente o seu objetivo."
},
// 5 - Memento e Facade
{
  aula: "Aula 12 - Introdução",
  tipo: "Análise Aplicada",
  texto: "Em um editor de texto, o usuário quer desfazer a última alteração, e o sistema precisa restaurar o estado anterior do documento sem violar o encapsulamento. Em outro módulo, um sistema de pedidos usa cinco classes para calcular frete, validar estoque, emitir nota e cobrar o cliente, mas os clientes do sistema só querem chamar uma operação simples, finalizarPedido().",
  question: "Que padrões atendem, respectivamente, ao desfazer e à interface simplificada?",
  options: [
    "Memento e Observer.",
    "Memento e Facade.",
    "Strategy e Facade.",
    "Facade e Memento."
  ],
  answer: 1,
  feedback: "O ==def==Memento== captura e restaura o estado interno de um objeto, o que é útil para desfazer. O **Facade** é estrutural e oferece uma interface simplificada para um conjunto complexo de classes."
},
// 6 - Singleton
{
  aula: "Aula 12 - Introdução",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma equipe discute o uso do Singleton em um sistema que terá uma conexão com banco de dados compartilhada e um serviço de log.",
  question: "Avalie as afirmações a seguir e assinale a alternativa correta.",
  assertions: [
    "O Singleton garante uma única instância da classe e um ponto de acesso global a ela.",
    "É útil para recursos compartilhados, como conexão com banco de dados, serviço de log e configuração global.",
    "O Singleton introduz uma ==warn==dependência global==, o que pode dificultar testes e manutenção.",
    "Em ambientes multithreaded, o Singleton dispensa qualquer cuidado com sincronização."
  ],
  options: [
    "I, II e III, apenas",
    "I, II e IV, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A IV é falsa: o Singleton pode **exigir sincronização** em ambientes multithreaded. O uso excessivo em projetos grandes torna o código difícil de gerenciar."
},
// 7 - Strategy
{
  aula: "Aula 12 - Introdução",
  tipo: "Conceitual Contextualizada",
  texto: "Uma loja virtual precisa calcular o frete de formas diferentes, como correios, transportadora e retirada na loja, e trocar o algoritmo conforme o contexto sem alterar o código que utiliza o cálculo.",
  question: "Qual padrão de projeto atende melhor a essa necessidade, e por quê?",
  options: [
    "Observer, porque notifica os dependentes quando o frete muda.",
    "Singleton, porque garante um único cálculo de frete para todo o sistema.",
    "Memento, porque restaura o valor de frete calculado anteriormente.",
    "Strategy, porque define uma família de algoritmos intercambiáveis."
  ],
  answer: 3,
  feedback: "O **Strategy** é comportamental: encapsula cada algoritmo e permite trocá-los conforme o contexto. Notificar dependentes é papel do ==term==Observer==."
},
// 8 - Cautela com Singleton
{
  aula: "Aula 12 - Introdução",
  tipo: "Asserção + Justificativa",
  texto: "Em um projeto grande, a equipe percebeu que o Singleton passou a ser usado em dezenas de classes e que os testes ficaram difíceis de isolar.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "O uso do Singleton exige ==rule==cautela== em projetos grandes.",
    "PORQUE ele elimina a dependência global entre as partes da aplicação, o que facilita testes e manutenção."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 2,
  feedback: "A I é verdadeira. A II é falsa: o Singleton **introduz** uma dependência global, o que dificulta isolar componentes para testar e manter o sistema."
},
// 9 - Código Singleton
{
  aula: "Aula 12 - Introdução",
  tipo: "Análise Aplicada",
  texto: "No serviço de log do exemplo da aula, o construtor do Logger verifica se já existe uma instância antes de criar outra. Observe o código a seguir.",
  question: "Qual será a saída do console.log ao final da execução?",
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
b.log("fim");
console.log(a.logs.length, a === b);`,
  options: [
    "1 false",
    "2 true",
    "2 false",
    "1 true"
  ],
  answer: 1,
  feedback: "Na segunda chamada, ==key==Logger.instance== já existe e é retornada, então a e b são a **mesma instância**. As duas mensagens vão para o mesmo histórico (tamanho 2), e a === b é true."
},
// 10 - Categorias de padrões
{
  aula: "Aula 12 - Introdução",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma arquiteta de software prepara um quadro-resumo com as categorias de padrões do GoF para uma capacitação da equipe.",
  question: "Avalie as afirmações a seguir e assinale a alternativa correta.",
  assertions: [
    "Os padrões ==type==criacionais== cuidam da criação flexível e controlada de objetos.",
    "Os padrões estruturais cuidam da composição e da organização de classes e objetos.",
    "Os padrões comportamentais cuidam da interação entre componentes e da distribuição de responsabilidades.",
    "Cada padrão fornece o código-fonte pronto para ser copiado em qualquer linguagem."
  ],
  options: [
    "I, II e IV, apenas",
    "II, III e IV, apenas",
    "I e IV, apenas",
    "I, II e III, apenas"
  ],
  answer: 3,
  feedback: "A IV é falsa: um padrão descreve **problema, solução e consequências** de forma genérica, como uma receita, e não código específico."
},
// ===== AULA 13 =====
// 1 - Abstract Factory
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Asserção + Justificativa",
  texto: "Uma equipe avalia o uso do Abstract Factory em uma aplicação com interface gráfica que precisa manter um estilo visual uniforme entre botões, caixas de texto e menus.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "O ==def==Abstract Factory== garante que objetos da mesma família sejam usados juntos.",
    "PORQUE adicionar novos tipos de produto exige modificar todas as fábricas existentes."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 1,
  feedback: "As duas são verdadeiras, mas a II é uma **desvantagem** do padrão e não explica a garantia de uso conjunto da família, que decorre de a fábrica criar todos os produtos relacionados."
},
// 2 - Criacionais variados
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma professora revisa com a turma os principais padrões de criação antes da avaliação.",
  question: "Avalie as afirmações a seguir e assinale a alternativa correta.",
  assertions: [
    "O Abstract Factory cria uma única instância global de uma classe.",
    "O ==def==Builder== separa a construção de um objeto complexo da sua representação, permitindo construí-lo em etapas.",
    "No Factory Method, as subclasses decidem qual tipo de objeto será criado, e a principal desvantagem é o aumento no número de classes.",
    "O Prototype cria novos objetos copiando ou clonando uma instância existente."
  ],
  options: [
    "I, II e III, apenas",
    "I, III e IV, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 2,
  feedback: "A I é falsa: a instância única é do **Singleton**. O Abstract Factory fornece uma interface para criar famílias de objetos relacionados sem especificar suas classes concretas."
},
// 3 - Abstract Factory para temas
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Conceitual Contextualizada",
  texto: "Uma aplicação precisa alternar entre um tema claro e um tema escuro, e os botões, os menus e as caixas de texto devem sempre combinar entre si, independentemente do tema escolhido.",
  question: "Qual padrão de criação atende melhor a essa necessidade, e por quê?",
  options: [
    "Abstract Factory, pois cada tema pode ser uma fábrica concreta que cria elementos da mesma família.",
    "Singleton, pois garante uma única instância de botão para a aplicação inteira.",
    "Prototype, pois clona o primeiro botão criado, ainda que ele seja de outro tema.",
    "Builder, pois constrói a tela em etapas sem se preocupar com a coerência visual."
  ],
  answer: 0,
  feedback: "No **Abstract Factory**, cada tema seria uma fábrica concreta, e o cliente só conhece as interfaces. Isso reduz o ==term==acoplamento== e garante que os elementos da mesma família sejam usados juntos."
},
// 4 - Builder
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Asserção + Justificativa",
  texto: "Um desenvolvedor precisa criar rapidamente cópias de um objeto simples e considera usar o padrão Builder para isso.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "O ==def==Builder== é o padrão indicado quando se quer clonar rapidamente um objeto simples.",
    "PORQUE o Builder separa a construção de um objeto complexo da sua representação, permitindo construí-lo em etapas."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 3,
  feedback: "A I é falsa: clonar é o papel do **Prototype**. A II é verdadeira, e mostra que o Builder é indicado para objetos complexos em várias etapas, podendo até aumentar a complexidade em projetos simples."
},
// 5 - Fluent interface com erro
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Análise Aplicada",
  texto: "Um desenvolvedor implementou o padrão Builder para montar uma casa em etapas e usou chamadas encadeadas (fluent interface), mas esqueceu de um detalhe em um dos métodos.",
  question: "O que ocorre ao executar o código a seguir?",
  code: `class HouseBuilder {
  constructor() { this.house = {}; }
  buildWalls()   { this.house.walls = true;   return this; }
  buildDoors()   { this.house.doors = true; }
  buildWindows() { this.house.windows = true; return this; }
  getHouse()     { return this.house; }
}
const house = new HouseBuilder()
  .buildWalls()
  .buildDoors()
  .buildWindows()
  .getHouse();`,
  options: [
    "Funciona normalmente, e house recebe paredes, portas e janelas.",
    "Ocorre erro, pois buildDoors não retorna o builder e a chamada seguinte falha.",
    "Funciona, mas house fica sem as paredes, que foram descartadas.",
    "Ocorre erro de sintaxe, pois métodos de uma classe não podem ser encadeados."
  ],
  answer: 1,
  feedback: "Para encadear, cada método de etapa precisa ==key==retornar this==. Como buildDoors devolve undefined, a chamada .buildWindows() é feita sobre undefined e gera um **TypeError** em tempo de execução."
},
// 6 - Prototype
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma equipe usa o padrão Prototype para criar objetos a partir de um modelo padrão e precisa entender os limites dessa abordagem.",
  question: "Avalie as afirmações a seguir e assinale a alternativa correta.",
  assertions: [
    "O ==def==Prototype== cria novos objetos copiando ou clonando uma instância existente.",
    "O Object.assign faz cópia superficial, e objetos internos continuam compartilhados entre o original e a cópia.",
    "Após clonar com cópia superficial um protótipo que tem uma lista interna, alterar a lista no clone nunca afeta o original.",
    "O Prototype tem dificuldade com clonagens profundas, principalmente com referências complexas ou recursos externos."
  ],
  options: [
    "I, II e III, apenas",
    "I, III e IV, apenas",
    "I, II e IV, apenas",
    "II, III e IV, apenas"
  ],
  answer: 2,
  feedback: "A III é falsa: na **cópia superficial** as referências internas são compartilhadas, então mudar a lista no clone também a altera no original. Para evitar isso, é preciso clonagem profunda."
},
// 7 - Factory Method
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Conceitual Contextualizada",
  texto: "Um gerenciador de arquivos precisa passar a suportar novos formatos sem que o código principal seja alterado a cada novo formato incluído.",
  question: "Qual padrão de criação atende melhor a essa necessidade, e com qual custo?",
  options: [
    "Factory Method, pois cada novo formato entra como uma subclasse com o método de fábrica, ao custo de mais classes.",
    "Singleton, pois garante um único formato aceito pelo sistema.",
    "Prototype, pois clona sempre o primeiro arquivo aberto como modelo.",
    "Builder, pois obriga o código principal a conhecer todos os formatos."
  ],
  answer: 0,
  feedback: "No **Factory Method**, as subclasses decidem qual tipo será criado, e o cliente fica desacoplado das implementações concretas. O custo é o ==warn==aumento no número de classes==, pois cada tipo exige uma nova fábrica."
},
// 8 - Singleton: instância
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Asserção + Justificativa",
  texto: "A classe Database guarda a única instância em Database.instance e, no construtor, retorna essa instância se ela já existir. O código cria db1 e db2 com new Database() e compara os dois objetos.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "Ao criar db1 e db2 com new Database(), a comparação db1 === db2 resulta em ==key==false==.",
    "PORQUE o construtor retorna a instância já guardada em Database.instance quando ela existe."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 3,
  feedback: "A I é falsa: como o construtor retorna a instância existente, db1 e db2 são o **mesmo objeto** e db1 === db2 resulta em ==dml==true==. A II descreve corretamente o mecanismo."
},
// 9 - Prototype: cópia superficial
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Análise Aplicada",
  texto: "Um objeto protótipo tem uma propriedade simples e uma lista interna, e um método clone que usa Object.assign. A equipe clona o protótipo e altera o clone.",
  question: "Qual será a saída do console.log ao final do código?",
  code: `const proto = {
  nome: "base",
  itens: ["a"],
  clone() { return Object.assign({}, this); }
};
const c = proto.clone();
c.nome = "copia";
c.itens.push("b");
console.log(proto.nome, proto.itens.length);`,
  options: [
    "copia 2",
    "base 2",
    "base 1",
    "copia 1"
  ],
  answer: 1,
  feedback: "A propriedade ==type==nome== é um valor simples, então mudar o clone não afeta o original (base). Já itens é uma referência compartilhada pela **cópia superficial**, e o push no clone aumenta a lista do protótipo para 2 elementos."
},
// 10 - Revisão de padrões de criação
{
  aula: "Aula 13 - Padrões de criação",
  tipo: "Múltiplas Afirmativas",
  texto: "Ao final do módulo, a equipe monta um resumo com as características dos padrões de criação estudados.",
  question: "Avalie as afirmações a seguir e assinale a alternativa correta.",
  assertions: [
    "O ==def==Abstract Factory== reduz o acoplamento, pois o cliente só conhece interfaces.",
    "No Factory Method, as subclasses decidem qual tipo de objeto será criado.",
    "No Builder, as chamadas encadeadas (fluent interface) funcionam quando cada método de etapa retorna o próprio builder.",
    "O Singleton é indicado para criar várias instâncias independentes da mesma classe."
  ],
  options: [
    "I, II e IV, apenas",
    "II, III e IV, apenas",
    "I e IV, apenas",
    "I, II e III, apenas"
  ],
  answer: 3,
  feedback: "A IV é falsa: o **Singleton** garante uma única instância com ponto de acesso global. As demais descrevem corretamente Abstract Factory, Factory Method e Builder."
},

],

ava: [

// aula: Atividade 3 - Aulas 9 e 10

// 1 - UML x processo de desenvolvimento
{
  aula: "Atividade 3 - Aulas 9 e 10",
  tipo: "",
  texto: "O diretor de tecnologia de uma //startup// optou por adotar o //framework// Scrum (Metodologia Ágil) para o projeto. Contudo, um analista júnior argumenta que \"Se não formos utilizar o processo RUP (//Rational Unified Process//), é proibido e tecnicamente impossível utilizar a UML para desenhar o diagrama de classes do sistema\".",
  question: "Avalie criticamente a declaração do analista com base nos preceitos da Unified Modeling Language e escolha a alternativa correta:",
  code: "",
  options: [
    "Incorreta, já que a UML proíbe o uso de métodos ágeis.",
    "Incorreta, porque a UML dita um ciclo de vida em cascata próprio.",
    "Correta, pois UML e RUP são inseparáveis.",
    "Incorreta, pois a UML é uma linguagem e é independente de processos.",
    "Correta, a UML foi criada exclusivamente para o método RUP."
  ],
  answer: 3,
  feedback: "",
  chips: []
},

// 2 - Diagrama de Implantação
{
  aula: "Atividade 3 - Aulas 9 e 10",
  tipo: "",
  texto: "Durante a fase de projeto de uma arquitetura de microsserviços distribuídos em nuvem, a equipe de operações precisa documentar a topologia física do hardware (como roteadores, servidores Linux e //firewalls//) e demonstrar quais artefatos de software estarão rodando em cada nó dessa rede.",
  question: "Identifique qual diagrama estrutural atende a essa necessidade específica e assinale a alternativa correspondente:",
  code: "",
  options: [
    "Requer o de Objetos.",
    "Exige-se o de Estruturas.",
    "Usa-se o Diagrama de Pacotes.",
    "Indica-se o Diagrama de Componentes.",
    "A equipe deve escolher o Diagrama de Implantação."
  ],
  answer: 4,
  feedback: "",
  chips: []
},

// 3 - Natureza e propósito da UML
{
  aula: "Atividade 3 - Aulas 9 e 10",
  tipo: "",
  texto: "Uma equipe de desenvolvimento está fazendo a transição de um paradigma estruturado tradicional para a Análise e Projeto Orientado a Objetos (OO). O líder do projeto determinou a adoção da UML como padrão oficial da empresa para a documentação do novo sistema.",
  question: "Considerando os fundamentos metodológicos da disciplina, assinale a alternativa que define corretamente a natureza e o propósito da UML:",
  code: "",
  options: [
    "Configura-se como uma linguagem de programação que compila diagramas em código binário nativo.",
    "Consiste em uma metodologia de desenvolvimento ágil que dita as etapas e prazos rigorosos para a equipe de engenharia.",
    "É um servidor de aplicação projetado para executar modelos de dados relacionais.",
    "Trata-se de um banco de dados NoSQL orientado a documentos.",
    "Trata-se de uma linguagem de modelagem visual utilizada para especificar, visualizar, construir e documentar artefatos de um software."
  ],
  answer: 4,
  feedback: "",
  chips: []
},

// 4 - Composição x Agregação
{
  aula: "Atividade 3 - Aulas 9 e 10",
  tipo: "",
  texto: "O projetista do sistema precisa modelar o vínculo entre `Carro` e seu `Motor` no contexto do sistema de uma fábrica (onde, ao descartar o carro, o chassi e o motor vinculado a ele deixam de existir logicamente no registro físico integrador). Em contraste, há também a relação entre `Departamento` e `Professor` (onde o departamento pode ser extinto, mas o professor continua vinculado à instituição e vivo no banco de dados).",
  question: "Sobre os tipos de associação de \"parte/todo\", avalie a distinção entre Composição e Agregação e escolha a alternativa correta:",
  code: "",
  options: [
    "O losango negro ilustra a agregação, com ciclo de vida independente.",
    "A agregação impõe que as partes morram com o todo.",
    "A composição é indicada por um losango vazado",
    "A composição demonstra dependência vital, usando losango cheio.",
    "Ambas utilizam o losango sem preenchimento."
  ],
  answer: 3,
  feedback: "",
  chips: []
},

// 5 - Generalização
{
  aula: "Atividade 3 - Aulas 9 e 10",
  tipo: "",
  texto: "No levantamento de requisitos para um Sistema Acadêmico Universitário, o Analista identificou as entidades `Pessoa`, `Aluno` e `Professor`. Verificou-se que `Aluno` e `Professor` compartilham características fundamentais e métodos provenientes da entidade `Pessoa` (como //Nome//, //CPF// e //Endereço//).",
  question: "Assinale a alternativa que indica corretamente o tipo de relacionamento UML utilizado para representar essa estrutura de abstração:",
  code: "",
  options: [
    "A estrutura descrita exige um relacionamento de Composição entre as classes listadas.",
    "Recomenda-se aplicar a Agregação para demonstrar a ideia de parte e todo.",
    "Deve ser utilizada a Dependência, pois a classe pai necessita de seus filhos.",
    "Trata-se de uma Associação simples bidirecional operando entre as três entidades.",
    "O relacionamento adequado para esta situação é a Generalização, indicando herança conceitual."
  ],
  answer: 4,
  feedback: "",
  chips: []
},

// 6 - Diagrama de Pacotes
{
  aula: "Atividade 3 - Aulas 9 e 10",
  tipo: "",
  texto: "Um grande ERP corporativo recém-mapeado gerou mais de 250 classes no sistema. Para evitar a complexidade visual extrema no documento final, a equipe de gerência de configuração decidiu agrupar logicamente essas classes em grandes módulos, como \"Faturamento\", \"Recursos Humanos\" e \"Logística\".",
  question: "Identifique o diagrama estrutural específico desenhado para representar a organização desse agrupamento hierárquico lógico e assinale a alternativa correta:",
  code: "",
  options: [
    "O analista deve optar pela criação do Diagrama de Pacotes.",
    "A equipe necessita aplicar as regras estruturais do famoso Diagrama de Componentes",
    "A melhor escolha para esta topologia é construir o Diagrama de Implantação.",
    "O engenheiro de software deve elaborar detalhadamente o Diagrama de Estruturas Compostas.",
    "O modelo exigido pela arquitetura descrita é o Diagrama de Máquina de Estados."
  ],
  answer: 0,
  feedback: "",
  chips: []
},

// 7 - Diagrama de Componentes (asserção e razão)
{
  aula: "Atividade 3 - Aulas 9 e 10",
  tipo: "",
  texto: "Para garantir a modularidade do software, a equipe adota um modelo baseado em componentes autônomos. As interfaces entre eles são desenhadas usando o formato //lollipop// (interface fornecida) e //socket// (interface requerida). I. O Diagrama de Componentes ilustra a organização física e as dependências estruturais entre os módulos de software. PORQUE II. Esse diagrama oculta a implementação interna (caixa preta) da classe e expõe o sistema apenas por meio de serviços e interfaces contratualizadas.",
  question: "Analise as asserções e a relação semântica entre elas, e assinale a opção correta:",
  code: "",
  options: [
    "A primeira é verdadeira e a segunda é falsa.",
    "Ambas são verdadeiras e sem qualquer relação causal.",
    "As duas asserções são verdadeiras e estão interligadas.",
    "As duas asserções são proposições falsas.",
    "A primeira é falsa, mas a segunda é verdadeira."
  ],
  answer: 2,
  feedback: "",
  chips: []
},

// 8 - Multiplicidade
{
  aula: "Atividade 3 - Aulas 9 e 10",
  tipo: "",
  texto: "No levantamento de uma Livraria, o Analista anotou uma regra de negócio imutável: //\"No sistema, um Livro precisa, obrigatoriamente, ter sido escrito por pelo menos um autor registrado, mas pode ter sido concebido por vários autores em conjunto\"//.",
  question: "Ao traduzir esta regra para um Diagrama de Classes UML padrão, assinale a alternativa que demonstra a multiplicidade que deve ser anotada na ponta da associação conectada à classe `Autor`.",
  code: "",
  options: [
    "O projetista precisará anotar o limite rigoroso de ...",
    "A representação correta será sempre a de 0...",
    "Utiliza-se a notação exata de 0..1.",
    "Deve-se empregar a multiplicidade 1..1.",
    "A UML exige que se utilize a multiplicidade de 1..*"
  ],
  answer: 4,
  feedback: "",
  chips: []
},


  // aula: Atividade 4 - Aulas 11, 12 e 13

// 1 - Contêineres x VMs
{
  aula: "Atividade 4 - Aulas 11, 12 e 13",
  tipo: "",
  texto: "Avaliando a governança e a arquitetura sistêmica empresarial, uma companhia planeja modernizar a escalabilidade de seus //softwares//. O time de engenharia sugere migrar toda a infraestrutura tradicional baseada em Máquinas Virtuais (VMs) hospedadas por Hypervisor para um ambiente descentralizado de microsserviços empacotados em Contêineres. Matriz de Decisão Arquitetural:",
  question: "Com base nos fundamentos de arquitetura e organização corporativa ilustrados na tabela do projeto, analise a proposta de modificação técnica e escolha a alternativa correta.",
  code: `| Parâmetro Físico | Máquinas Virtuais (VMs) | Contêineres (OS-level) |
|---|---|---|
| Isolamento Base | Virtualização de Hardware | Restrito ao Espaço do Usuário |
| Camadas de Carga | App + Bibliotecas + OS | App + Bibliotecas |
| Tempo Computado | Arranque Lento (Minutos) | Arranque Rápido (Milissegundos) |`,
  options: [
    "Os contêineres reduzem fortemente a sobrecarga computacional da infraestrutura comercial justamente ao dispensarem a duplicação do sistema operacional visitante e compartilharem ativamente o kernel nativo.",
    "O arcabouço tecnológico guiado por um hypervisor nativo suprime toda a alocação de dispositivos na rede corporativa, o que assegura definitivamente ganhos significativos no trânsito ininterrupto geral de I/O.",
    "A orquestração balizada no padrão de contêineres paralelos degrada por completo a escalabilidade da nuvem local, pelo fato de exigir uma gama excessiva de hipervisores lógicos inseridos no espaço restrito.",
    "O emprego exclusivo de arranjos virtualizados puros acelera de modo considerável a disponibilidade dos programas da empresa, vez que as soluções albergadas armazenam previamente suas pilhas operacionais.",
    "As máquinas abstratas disponibilizam um isolamento inferior entre as tarefas integradas, visto que processam as diferentes solicitações simultâneas rigorosamente sob o mesmo espaço primário compartilhado."
  ],
  answer: 0,
  feedback: "a VM carrega aplicação, bibliotecas e um SO completo (arranque lento). O contêiner carrega só aplicação e bibliotecas e compartilha o kernel do host (arranque em milissegundos). Não duplicar o SO convidado reduz a sobrecarga. O hypervisor intermedeia dispositivos (pode adicionar sobrecarga de I/O), contêineres não exigem hypervisors, VMs têm arranque lento e oferecem isolamento mais forte que contêineres.",
  chips: []
},

// 2 - Thrashing
{
  aula: "Atividade 4 - Aulas 11, 12 e 13",
  tipo: "",
  texto: "Um analista de Sistemas de Informação gerencia um servidor Linux de comércio eletrônico. Durante a //Black Friday//, o sistema tornou-se extremamente lento. O profissional utilizou ferramentas de monitoramento para diagnosticar a anomalia no nível do Sistema Operacional, visando atuar de forma proativa na resolução estrutural do problema organizacional e técnico. Log de Monitoramento (Extrato Consolidado via comando vmstat):",
  question: "Considerando os princípios de gerência de memória em sistemas operacionais modernos, analise o log de monitoramento de desempenho e assinale a alternativa correta sobre o estado do servidor e a ação mitigadora correspondente.",
  code: `[Memória Física Total: 16 GB | Memória Livre RAM: 25 MB]
[Espaço de Swap Total: 32 GB | Swap em Uso Ativo: 31 GB]
[Taxa de Paginação (Page Faults): 8500 páginas / segundo]
[Uso Geral da CPU: 95% em estado de Espera de E/S (I/O Wait)]`,
  options: [
    "O log evidencia um quadro crítico de paginação excessiva (thrashing) no sistema operacional, sendo necessário otimizar o consumo de memória das aplicações ou ampliar a capacidade física do servidor.",
    "O processador principal executa instruções de núcleo descontroladamente, indicando que o administrador precisa limitar as chamadas de software utilizando um balanceador de carga em hardware externo.",
    "O servidor experimenta um severo vazamento de descritores de arquivos na área de troca, demandando a reconfiguração estrutural dos setores de armazenamento magnético para restabelecer o desempenho.",
    "O escalonador global foi sobrecarregado por inúmeras interrupções de hardware concorrentes, exigindo a adoção imediata de algoritmos de alocação de tempo baseados em níveis de prioridade estática.",
    "O relatório demonstra a ocorrência de impasses lógicos complexos entre as threads ativas, o que torna imperativa a reinicialização forçada dos serviços afetados para liberar os registradores travados."
  ],
  answer: 0,
  feedback: "RAM quase esgotada (25 MB livres), swap quase cheio (31/32 GB), 8500 page faults/s e 95% de I/O Wait caracterizam thrashing: o sistema gasta mais tempo trocando páginas com o disco do que executando trabalho útil. Mitigação: reduzir a demanda de memória ou ampliar a RAM. A CPU está em espera de E/S (não executando código de núcleo), não há evidência de vazamento de descritores, sobrecarga de interrupções ou deadlock.",
  chips: []
},

// 3 - Condição de corrida
{
  aula: "Atividade 4 - Aulas 11, 12 e 13",
  tipo: "",
  texto: "Uma equipe de TI está desenvolvendo um módulo de gestão financeira de alta criticidade. O sistema utiliza múltiplas //threads// para atualizar o saldo bancário dos clientes. Durante a avaliação da qualidade e resiliência da solução, a auditoria notou que as transações concorrentes originavam saldos finais matematicamente incorretos. Pseudocódigo do Módulo Financeiro em Execução Paralela:",
  question: "A partir da análise técnica da interação paralela entre as linhas de execução ilustradas no pseudocódigo, interprete a falha de projeto de software e assinale a alternativa correta.",
  code: `Variável Global Compartilhada: Saldo_Conta = 1000

Thread_A (Efetua Depósito de R$ 200)     Thread_B (Efetua Depósito de R$ 300)
1. Ler Saldo_Conta (valor lido: 1000)     1. Ler Saldo_Conta (valor lido: 1000)
2. Novo_Saldo = Saldo_Conta + 200         2. Novo_Saldo = Saldo_Conta + 300
3. Saldo_Conta = Novo_Saldo               3. Saldo_Conta = Novo_Saldo`,
  options: [
    "As duas linhas de execução entraram em quadro crítico de inanição em virtude da concorrência, demandando o uso de algoritmos de envelhecimento para assegurar recursos equitativos a cada transação.",
    "O agendador de tarefas interrompeu o tempo de quantum de ambas as rotinas prematuramente, o que indica a necessidade de reestruturar o código nativo para viabilizar o processamento em lotes paralelos.",
    "O sistema padece de uma condição de corrida por total ausência de exclusão mútua, resultando na sobreposição indevida de dados ao atualizar a mesma variável compartilhada alocada na memória RAM.",
    "A arquitetura atual gera elevada fragmentação nos registradores lógicos do processador base, forçando o desenvolvedor a subdividir as transações em pequenos blocos de processamento direto na CPU.",
    "O pseudocódigo exemplifica um impasse irrecuperável entre todos os processos de depósito, exigindo a estruturação de um grafo de alocação para prevenir o congelamento irreversível das requisições."
  ],
  answer: 2,
  feedback: "as duas threads leem 1000 antes de qualquer gravação. A_calcula 1200 e B calcula 1300; quem gravar por último sobrescreve a outra, e o saldo fica 1200 ou 1300 em vez de 1500. É uma condição de corrida (race condition) por falta de exclusão mútua na região crítica. Correção: mutex, semáforo ou operação atômica. Não há inanição, problema de quantum, fragmentação de registradores nem deadlock (ambas terminam).",
  chips: []
},

// 4 - Inanição e envelhecimento
{
  aula: "Atividade 4 - Aulas 11, 12 e 13",
  tipo: "",
  texto: "Para acelerar e priorizar a experiência de atendimento direto ao cliente, um analista inseriu o algoritmo de \"Prioridade Preemptiva\" no servidor organizacional. Após uma semana, verificou-se que pesados processamentos em //background// (fechamentos financeiros) simplesmente estagnaram sem jamais conseguirem concluir suas rotinas computacionais. Tabela do Escalonador de Processos (Extrato Log em Milissegundos):",
  question: "Avalie criticamente as métricas dispostas na tabela de execução e escolha a alternativa correta que resolve adequadamente essa disfunção no algoritmo de escalonamento.",
  code: `| ID | Carga de Trabalho | Prioridade (1=Alta) | Estado | Espera Fila |
|---|---|---|---|---|
| P1 | Autenticação Web | 1 | Em CPU | 5 ms |
| P2 | Consulta de API | 1 | Pronto | 10 ms |
| P3 | Fechamento Mês | 9 | Pronto | 95.800 ms |`,
  options: [
    "O desenvolvedor deve sobrepor fisicamente a frequência natural do processador para extinguir gargalos obstrutivos nas requisições, destinando os ciclos remanescentes à transferência ininterrupta na rede.",
    "O administrador deve implementar o mecanismo de envelhecimento visando elevar gradualmente a prioridade dos processos secundários, resolvendo definitivamente o atual quadro crítico de inanição sistêmica.",
    "A corporação precisa abandonar temporariamente as políticas preemptivas e adotar rotinas estritamente ordenadas, exigindo que o chip processe integralmente uma tarefa pesada antes de iniciar processamentos.",
    "O projeto deve isolar requisições de relatórios gerenciais complexos num contêiner inteiramente apartado, burlando assim a inaceitável indisponibilidade que se origina da ininterrupta espera extrema por I/O.",
    "A equipe técnica necessita configurar uma alternância cíclica engessada associada a um quantum extremamente largo, reduzindo drasticamente as latências decorrentes de intensas comutações de base no núcleo."
  ],
  answer: 1,
  feedback: "P3 (prioridade 9) espera 95.800 ms sem ser escalonado, enquanto P1 e P2 (prioridade 1) monopolizam a CPU: é inanição (starvation). A solução clássica é o envelhecimento (aging), que eleva gradualmente a prioridade conforme o tempo de espera. Overclock não resolve política de escalonamento, execução não preemptiva prejudicaria o atendimento ao cliente, P3 está em estado Pronto (não bloqueado por I/O) e Round Robin com quantum largo se aproxima de FCFS.",
  chips: []
},

// 5 - Esgotamento de inodes
{
  aula: "Atividade 4 - Aulas 11, 12 e 13",
  tipo: "",
  texto: "Ao auditar a infraestrutura de dados de uma corporação, um Analista de Sistemas constata que um servidor de armazenamento (NAS) Linux bloqueia a criação de novos arquivos de pequenos //logs// textuais do sistema, embora os //dashboards// apontem uma sobra massiva de armazenamento livre no hardware. Saída formatada do terminal administrativo de sistemas:",
  question: "Com base nas características estruturais de um sistema de arquivos do padrão Unix, interprete o extrato emitido no terminal de configuração e escolha a alternativa correta para o diagnóstico do incidente.",
  code: `[~]# df -h /dados
Filesystem   Size  Used  Avail  Use%  Mounted on
/dev/sdb1    2.0T  1.5T  500G   75%   /dados

[~]# df -i /dados
Filesystem   Inodes   IUsed    IFree  IUse%  Mounted on
/dev/sdb1    1000000  1000000  0      100%   /dados`,
  options: [
    "A pasta destino foi acometida por uma violação profunda das permissões operacionais na estrutura nativa, modificando bruscamente os atributos hierárquicos para o estado exclusivo de leitura em rede.",
    "A tabela descritora de índices (i-nodes) esgotou toda a sua capacidade máxima em razão da proliferação de pequenos arquivos, impedindo a vinculação lógica de novas estruturas e ponteiros na partição.",
    "O limite máximo de conexões lógicas estourou a cota global do protocolo de transferência do armazenamento, bloqueando efetivamente o canal de comunicação direta com os setores persistentes do servidor.",
    "A fragmentação externa dos setores físicos originou uma descontinuidade crítica entre os blocos, compelindo o administrador a formatar e desfragmentar a unidade antes de tentar registrar informações.",
    "O sistema de arquivos corrompeu o índice de blocos livres situado na trilha magnética central, fazendo com que a controladora de hardware invalide fisicamente as novas operações de escrita no disco local."
  ],
  answer: 1,
  feedback: "o `df -h` mostra 500 GB livres, então espaço em blocos não é o problema. O `df -i` mostra IFree = 0 e IUse% = 100%: todos os inodes foram consumidos. Cada arquivo precisa de um inode, então não dá para criar novos arquivos mesmo com espaço sobrando (típico de milhões de pequenos arquivos, como logs). Solução: apagar/compactar arquivos pequenos ou recriar o sistema de arquivos com mais inodes.",
  chips: []
},
],
};