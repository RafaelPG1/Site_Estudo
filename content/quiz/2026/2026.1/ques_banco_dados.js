// ============================================================
// NEXUS STUDY — quiz/conteudo/2026/2026.1/banco_dados.js
// Convertido do formato v1 para v2
// Modos disponíveis no 2026.1: questoes apenas
// (AVA não existe para banco_dados no 2026.1)
// ============================================================

window.questoes = {

  questoes: [

    // ── Aula 1 — Introdução a Banco de Dados ───────────────

    {
      aula: "Aula 1 — Introdução a Banco de Dados",
      tipo: "Contextualizada",
      texto: "Uma quitanda familiar, fundada em 1982 pelo sr. Antônio, controlava suas operações por meio de cadernetas de papel: cada venda era anotada manualmente e o estoque era conferido ao final do dia de forma visual. Com o crescimento do negócio, erros de cálculo, perdas de cadernetas e dificuldade de consultar o histórico tornaram-se frequentes. Para modernizar a gestão, o filho do sr. Antônio — formado em Sistemas de Informação — implantou um sistema computacional de registro de vendas. Ao final de janeiro, o sistema processou automaticamente todas as vendas registradas e emitiu um relatório consolidado de faturamento mensal, permitindo ao proprietário visualizar o total arrecadado e comparar com os custos de fornecimento.",
      question: "Ao processar os dados brutos das vendas e gerar um relatório de faturamento mensal, o sistema transformou:",
      options: [
        "Fatos em metadados para garantir a integridade",
        "Dados em informação, gerando subsídios para o conhecimento e tomada de decisão",
        "Metadados em fatos, visando o armazenamento físico",
        "Conhecimento em dados primários, reduzindo a abstração"
      ],
      answer: 1,
      feedback: "Os registros brutos de cada venda (datas, quantidades, valores) são ==ddl==dados== isolados e sem significado imediato. Ao processá-los e consolidá-los em um relatório de faturamento mensal, o sistema os transformou em ==dml==informação== — um resultado organizado e com sentido que permite ao proprietário tomar decisões de negócio. Essa é exatamente a distinção fundamental entre **dado** e **informação** na teoria de sistemas de informação."
    },

    {
      aula: "Aula 1 — Introdução a Banco de Dados",
      tipo: "Contextualizada",
      texto: "Em um sistema de gestão de clientes, a equipe de desenvolvimento mantém uma tabela denominada Clientes com os campos IdCliente (chave primária, inteiro), Nome (texto) e Email (texto). Durante um sprint de desenvolvimento, o analista João recebeu a tarefa de cadastrar um novo cliente chamado 'José' com o identificador numérico 1 no banco de dados.",
      question: "Considerando a necessidade de inserir o novo cliente na tabela Clientes, o comando SQL que representa corretamente a operação de criação (Create) do CRUD é:",
      options: [
        "SELECT * FROM Clientes;",
        "UPDATE Clientes SET Nome = 'José';",
        "DELETE FROM Clientes WHERE Id = 1;",
        "INSERT INTO Clientes (IdCliente, Nome) VALUES (1, 'José');"
      ],
      answer: 3,
      feedback: "O ==key=='C' do CRUD== corresponde a **Create** (Criar), e o comando SQL para inserir um novo registro é o `INSERT INTO`. O comando especifica a tabela (`Clientes`), as colunas (`IdCliente, Nome`) e os valores (`1, 'José'`). As demais alternativas são: `SELECT` (Read), `UPDATE` (Update) e `DELETE` (Delete). ==danger==CREATE TABLE cria a estrutura da tabela, não insere dados.=="
    },

    {
      aula: "Aula 1 — Introdução a Banco de Dados",
      tipo: "Contextualizada",
      texto: "Uma empresa de médio porte utilizava um sistema baseado em File-Server para gerenciar seus dados de RH e financeiro. Nesse modelo, os arquivos ficavam armazenados em um servidor central, mas todo o processamento ocorria nos terminais dos usuários — o que exigia que arquivos inteiros fossem transferidos pela rede a cada consulta. Com o crescimento do quadro de funcionários e o aumento simultâneo de acessos, a rede corporativa passou a apresentar lentidão crítica, comprometendo a produtividade.",
      question: "Para resolver o problema de performance e permitir o multiuso eficiente, a equipe de TI deve migrar para um sistema:",
      options: [
        "Web-Server, onde os dados ficam obrigatoriamente em arquivos de texto",
        "Database-Server, onde o processamento ocorre no servidor, enviando apenas os resultados solicitados aos terminais",
        "Flat-File, para manter a lógica de ordenação física em pastas",
        "Metadados descentralizados, para evitar consultas ao catálogo do SGBD"
      ],
      answer: 1,
      feedback: "No modelo ==danger==File-Server==, os arquivos inteiros trafegam pela rede até o terminal para serem processados localmente — esse é o gargalo. No modelo ==dml==Database-Server==, o processamento das consultas ocorre no próprio servidor; apenas os resultados filtrados são enviados ao cliente. Isso reduz drasticamente o tráfego de rede e elimina o gargalo descrito."
    },

    {
      aula: "Aula 1 — Introdução a Banco de Dados",
      tipo: "Contextualizada",
      texto: "O DBA de uma instituição de ensino foi incumbido de projetar o banco de dados do novo sistema escolar. Em reunião com a equipe pedagógica, foram levantadas as seguintes necessidades: cada aluno deve ser identificado por uma matrícula única; o sistema deve armazenar o nome completo e o CPF de cada aluno. Ao documentar essas decisões, o DBA registrou que a tabela Alunos terá os campos Matricula (Chave Primária), Nome e CPF. Esse registro se concentra exclusivamente na estrutura lógica dos dados.",
      question: "No nível de abstração lógico, a definição da tabela Alunos pelo DBA foca em:",
      options: [
        "Descrever como os dados são armazenados fisicamente em blocos de memória",
        "Ocultar completamente quais dados existem para todos os usuários",
        "Definir quais dados estão armazenados e quais as relações entre eles",
        "Gerenciar apenas o consumo de CPU e memória RAM do servidor"
      ],
      answer: 2,
      feedback: "Na arquitetura ==ddl==ANSI/SPARC de três níveis==, o ==mark==nível conceitual (ou lógico)== descreve **quais dados existem** no banco e como se relacionam — sem se preocupar com detalhes físicos de armazenamento (nível interno) nem com visões específicas de cada usuário (nível externo). Definir que a tabela Alunos tem Matricula, Nome e CPF é exatamente o trabalho do nível lógico."
    },

    {
      aula: "Aula 1 — Introdução a Banco de Dados",
      tipo: "Contextualizada",
      texto: "No banco de dados de uma biblioteca pública, existem duas tabelas: Livros (campos: ID, Título, Ano, ID_Autor) e Autores (campos: ID, Nome, Nacionalidade). O campo ID da tabela Autores identifica de forma única cada autor. Já o campo ID_Autor na tabela Livros armazena o identificador do autor responsável por cada obra. A analista Patrícia verificou que todo livro cadastrado possui obrigatoriamente um autor correspondente na tabela Autores.",
      question: "O campo ID_Autor na tabela Livros é classificado como:",
      options: [
        "Chave Primária",
        "Atributo Multivalorado",
        "Chave Estrangeira",
        "Metadado Físico"
      ],
      answer: 2,
      feedback: "Uma ==key==Chave Estrangeira (Foreign Key)== é um campo em uma tabela que referencia a Chave Primária de outra tabela. O campo `ID_Autor` na tabela Livros referencia o campo `ID` da tabela Autores — garantindo que cada livro aponte para um autor válido. Esse mecanismo implementa a ==dml==integridade referencial== no banco de dados relacional."
    },

    {
      aula: "Aula 1 — Introdução a Banco de Dados",
      tipo: "Contextualizada",
      texto: "Durante a manutenção do banco de dados de uma empresa varejista, o analista Carlos executou um script de atualização e percebeu — tarde demais — que havia esquecido de incluir a cláusula WHERE no comando UPDATE. Como resultado, o campo de endereço de TODOS os clientes da tabela foi sobrescrito. Felizmente, Carlos havia iniciado uma transação explícita antes de executar o script e o SGBD ainda não havia confirmado as alterações fisicamente.",
      question: "Para evitar a perda permanente dos dados e restaurar o estado anterior do banco, Carlos deve utilizar o comando:",
      options: [
        "COMMIT",
        "BEGIN TRANSACTION",
        "SELECT @@ROWCOUNT",
        "ROLLBACK"
      ],
      answer: 3,
      feedback: "O comando ==dml==ROLLBACK== desfaz todas as operações realizadas dentro de uma transação ativa, restaurando o banco ao estado anterior ao início da transação. Como Carlos havia iniciado uma transação explícita e o `COMMIT` ainda não havia sido executado, o ROLLBACK cancela todas as alterações feitas pelo `UPDATE` sem `WHERE`. ==danger==O COMMIT confirmaria as alterações de forma permanente.=="
    },

    {
      aula: "Aula 1 — Introdução a Banco de Dados",
      tipo: "Explicativa",
      texto: "A evolução dos SGBDs acompanhou o desenvolvimento das linguagens de programação. Na década de 1960, surgiram os modelos hierárquico e em rede. Na década de 1970, Edgar Codd propôs o modelo relacional. Nas décadas seguintes, com a popularização de C++ e Java, surgiu a demanda por um modelo que permitisse organizar dados em estruturas de classes e atributos, com suporte a herança e encapsulamento.",
      question: "Qual modelo de banco de dados surgiu na década de 1990 para atender a essa demanda, permitindo a organização de dados por classes e atributos?",
      options: [
        "Modelo Relacional de Edgar Codd",
        "Modelo Entidade-Relacionamento de Peter Chen",
        "Modelo Orientado a Objetos (POO)",
        "Modelo NoSQL orientado a documentos"
      ],
      answer: 2,
      feedback: "Na década de 1990, com a dominância de linguagens orientadas a objetos como C++ e Java, surgiu o ==ddl==Modelo de Banco de Dados Orientado a Objetos==. Esse modelo permite representar dados como objetos com atributos e métodos, suportando ==mark==herança, encapsulamento e polimorfismo==. Isso reduzia o chamado //impedance mismatch// entre o código da aplicação e a estrutura do banco."
    },

    {
      aula: "Aula 1 — Introdução a Banco de Dados",
      tipo: "Contextualizada",
      texto: "Em um SGBD de e-commerce, a tabela Produtos possui os campos: ID (inteiro), Nome (Varchar(150)), Preco (Decimal(10,2)) e Estoque (Integer). Quando o desenvolvedor executa uma consulta SELECT, o SGBD precisa saber o tipo e o formato de armazenamento de cada coluna para interpretar corretamente os bytes lidos do disco. Essas informações estruturais ficam armazenadas em um repositório interno do SGBD, acessível automaticamente a cada operação.",
      question: "As informações sobre o tipo e o formato de armazenamento de cada campo da tabela ficam guardadas no:",
      options: [
        "Volume de armazenamento secundário",
        "Arquivo de Log de transações",
        "Catálogo de metadados",
        "Buffer de memória RAM"
      ],
      answer: 2,
      feedback: "O ==ddl==Catálogo de Metadados== (também chamado de dicionário de dados ou catálogo do sistema) é o repositório interno do SGBD onde ficam armazenadas as informações sobre a estrutura do banco — nomes de tabelas, tipos de colunas, restrições, índices e relacionamentos. São os **'dados sobre os dados'**. Essa é a característica de ==mark==autodescritibilidade== dos SGBDs modernos."
    },

    {
      aula: "Aula 1 — Introdução a Banco de Dados",
      tipo: "Contextualizada",
      texto: "Uma empresa de eletrônicos mantém uma tabela Produtos com os campos: ID, Nome, Categoria, Preco e Estoque. O gerente comercial solicitou ao desenvolvedor um relatório contendo apenas o nome e o preço de todos os produtos cadastrados, para comparar com a tabela de preços de um concorrente. Nenhum dado deveria ser alterado ou excluído — a operação era exclusivamente de leitura.",
      question: "O comando SQL que realiza a leitura e recuperação das informações solicitadas, correspondendo ao R (Read) do CRUD, é:",
      options: [
        "INSERT",
        "SELECT",
        "UPDATE",
        "DELETE"
      ],
      answer: 1,
      feedback: "O ==key=='R' do CRUD== corresponde a **Read** (Leitura/Consulta), e o comando SQL que realiza essa operação é o `SELECT`. Ele permite recuperar dados de uma ou mais tabelas, filtrando colunas e linhas conforme necessário — **sem alterar nenhum dado**. No caso: `SELECT Nome, Preco FROM Produtos;`"
    },

    {
      aula: "Aula 1 — Introdução a Banco de Dados",
      tipo: "Contextualizada",
      texto: "Um banco digital opera em ambiente de alta disponibilidade com centenas de transações simultâneas por segundo. O DBA Marcelo foi alertado por um auditor de que usuários estavam, em alguns momentos, visualizando saldos intermediários — valores que refletiam apenas parte de uma transferência ainda em processamento por outro usuário.",
      question: "Essa proteção contra acesso a estados inconsistentes ocorre no:",
      options: [
        "Nível Físico, via ponteiros de baixo nível",
        "Nível de Visão, através de mecanismos de segurança e isolamento",
        "Nível de Hardware, via controladores de disco SSD",
        "Nível de Metadados, alterando a estrutura da tabela em tempo real"
      ],
      answer: 1,
      feedback: "O ==mark==Nível de Visão (ou nível externo)== da arquitetura ANSI/SPARC é onde se controla o que cada usuário ou aplicação pode enxergar no banco. É nesse nível que se implementam ==dml==mecanismos de isolamento de transações== e restrições de acesso, garantindo que usuários não vejam estados intermediários de outras transações em andamento."
    },

    // ── Aula 2 — Características de um SGBD ───────────────

    {
      aula: "Aula 2 — Características de um SGBD",
      tipo: "Contextualizada",
      texto: "Uma multinacional do setor financeiro com operações em 23 países necessita implantar um novo sistema central de banco de dados. Os requisitos incluem: suporte a volumes massivos de dados (na ordem de petabytes), alta escalabilidade vertical e horizontal, suporte a procedimentos armazenados com linguagem procedural proprietária e certificações de segurança corporativa. A decisão final recaiu sobre o sistema conhecido mundialmente por sua robustez em ambientes de missão crítica e pelo uso da linguagem PL/SQL.",
      question: "O SGBD que atende a todas essas características e utiliza a linguagem PL/SQL é:",
      options: [
        "MySQL",
        "SQL Server",
        "Oracle",
        "PostgreSQL"
      ],
      answer: 2,
      feedback: "O ==mark==Oracle Database== é amplamente reconhecido por sua robustez em ambientes corporativos de missão crítica. Sua linguagem procedural proprietária é o ==ddl==PL/SQL== (Procedural Language/SQL), que estende o SQL padrão com estruturas de controle de fluxo, tratamento de exceções e procedimentos armazenados. É o SGBD de referência em instituições financeiras e grandes corporações globais."
    },

    {
      aula: "Aula 2 — Características de um SGBD",
      tipo: "Contextualizada",
      texto: "Em uma universidade pública, o setor financeiro e a secretaria acadêmica utilizam sistemas distintos. O sistema financeiro armazena nome, CPF e endereço dos alunos para cobranças. O sistema da secretaria armazena os mesmos campos para envio de documentos. Quando um aluno muda de endereço, ele precisa comparecer a dois guichês diferentes para atualizar o dado em cada sistema separadamente, causando inconsistências.",
      question: "A situação descrita caracteriza uma falha clássica em sistemas legados, conhecida como:",
      options: [
        "Independência programa-dados",
        "Abstração de dados",
        "Redundância e falta de integração de dados",
        "Controle de concorrência"
      ],
      answer: 2,
      feedback: "Quando o mesmo dado é armazenado em múltiplos sistemas independentes sem sincronização, ocorre ==danger==redundância de dados==. A falta de integração faz com que uma atualização em um sistema não se propague para os demais, gerando inconsistências. Esse é um dos principais problemas que os ==dml==SGBDs modernos resolvem== ao centralizar e integrar os dados."
    },

    {
      aula: "Aula 2 — Características de um SGBD",
      tipo: "Contextualizada",
      texto: "O DBA Renato identificou que as consultas ao banco de dados de um sistema de logística estavam levando mais de 30 segundos para retornar. A análise dos logs revelou dois gargalos principais: a fila de operações de escrita em disco estava com alta latência, e o uso de memória RAM havia atingido 97% da capacidade do servidor.",
      question: "Para otimizar a performance segundo os conceitos de hardware de um SGBD, o DBA deve focar em:",
      options: [
        "Aumentar o poder de processamento do processador de software",
        "Otimizar a leitura/gravação em disco e o consumo de memória RAM",
        "Reduzir o número de usuários para transformar o sistema em monousuário",
        "Excluir o catálogo de metadados para liberar espaço em disco"
      ],
      answer: 1,
      feedback: "Os dois principais componentes de hardware que impactam a performance de um SGBD são o ==key==disco== (responsável pela persistência e leitura dos dados) e a ==key==memória RAM== (usada para o buffer pool, cache de consultas e dados temporários). Latência alta em disco e RAM saturada são os gargalos clássicos de performance em bancos de dados."
    },

    {
      aula: "Aula 2 — Características de um SGBD",
      tipo: "Contextualizada",
      texto: "Em um sistema de gestão hospitalar, quando o médico solicita os exames de um paciente, a aplicação encaminha a requisição ao componente central do sistema, responsável por interpretar o pedido, verificar as permissões do usuário, localizar os dados no armazenamento físico e retornar o resultado. Sem esse componente, o médico precisaria interagir diretamente com os arquivos físicos no servidor.",
      question: "O componente de software responsável por tratar todas as requisições de acesso vindas do usuário ou de aplicações é:",
      options: [
        "Hardware",
        "Catálogo",
        "SGBD (Sistema Gerenciador de Banco de Dados)",
        "Memória RAM"
      ],
      answer: 2,
      feedback: "O ==ddl==SGBD== é o software intermediário que gerencia todo o acesso aos dados. Ele recebe as requisições das aplicações, interpreta os comandos SQL, verifica permissões, otimiza as consultas, localiza os dados no armazenamento físico e retorna os resultados. Sem o SGBD, seria necessário interagir diretamente com os arquivos físicos, tornando o desenvolvimento extremamente complexo e inseguro."
    },

    {
      aula: "Aula 2 — Características de um SGBD",
      tipo: "Contextualizada",
      texto: "A startup AirFly opera um sistema de reservas de passagens aéreas. Em um evento de Black Friday, centenas de usuários acessaram simultaneamente a última poltrona disponível no voo São Paulo–Recife das 18h. Dois usuários — Ana e Bruno — clicaram em 'Finalizar Compra' no mesmo instante, e ambos receberam, momentaneamente, a confirmação de que a poltrona estava disponível.",
      question: "A característica do SGBD que garante que apenas um dos usuários consiga finalizar a compra é o:",
      options: [
        "Suporte para múltiplas visões",
        "Isolamento programa-operação",
        "Controle de concorrência no processamento de transações multiusuários",
        "Natureza autodescritiva do catálogo"
      ],
      answer: 2,
      feedback: "O ==dml==Controle de Concorrência== é o mecanismo do SGBD que garante a execução correta de transações simultâneas, evitando conflitos quando múltiplos usuários acessam e modificam os mesmos dados ao mesmo tempo. O SGBD usa técnicas como ==key==bloqueio (locking)== para garantir que apenas uma das transações consiga reservar o último assento, enquanto a outra recebe 'indisponível'."
    },

    {
      aula: "Aula 2 — Características de um SGBD",
      tipo: "Explicativa",
      texto: "Uma equipe de desenvolvimento estava avaliando qual SGBD adotar para um novo sistema integrado à plataforma Microsoft Azure. O sistema precisaria utilizar uma linguagem de extensão do SQL com suporte nativo a variáveis, estruturas de controle de fluxo (IF, WHILE), tratamento de exceções e procedimentos armazenados — tudo integrado ao ecossistema Microsoft.",
      question: "O SQL Server, SGBD criado pela Microsoft, utiliza qual linguagem específica para manipulação e administração de dados?",
      options: [
        "PL/SQL",
        "T-SQL (Transaction SQL)",
        "PHP",
        "Java"
      ],
      answer: 1,
      feedback: "O SQL Server da Microsoft utiliza o ==ddl==T-SQL (Transact-SQL)== como sua linguagem procedural proprietária. O T-SQL estende o SQL padrão com suporte a variáveis, estruturas de controle de fluxo (`IF/ELSE`, `WHILE`), tratamento de erros (`TRY/CATCH`) e procedimentos armazenados. ==danger==Não confundir com PL/SQL, que é a linguagem procedural do Oracle.=="
    },

    {
      aula: "Aula 2 — Características de um SGBD",
      tipo: "Contextualizada",
      texto: "Um DBA especialista em performance foi contratado para otimizar o armazenamento de uma tabela de transações financeiras com bilhões de registros. Seu trabalho envolvia analisar e reorganizar estruturas como índices B-Tree, definir o tamanho em bytes de cada campo e configurar a organização dos blocos de disco — sem que essas alterações impactassem os programas que acessavam os dados.",
      question: "O nível de abstração que se preocupa com os detalhes complexos de armazenamento, como o tamanho em bytes de cada campo, é o:",
      options: [
        "Nível Externo",
        "Nível Conceitual",
        "Nível Lógico de Usuário",
        "Nível Interno (ou de armazenamento)"
      ],
      answer: 3,
      feedback: "Na arquitetura ANSI/SPARC, o ==mark==Nível Interno (físico ou de armazenamento)== é responsável pelos detalhes de como os dados são fisicamente armazenados no disco — incluindo estruturas de índices (B-Tree, Hash), organização dos blocos, tamanho em bytes de cada campo e métodos de acesso. É o nível mais baixo da arquitetura, invisível para os usuários finais."
    },

    {
      aula: "Aula 2 — Características de um SGBD",
      tipo: "Contextualizada",
      texto: "Uma prefeitura municipal precisava implantar um sistema de gestão de tributos dentro de um orçamento de TI bastante limitado. O processo licitatório exigia que a solução fosse economicamente viável (sem altos custos de licenciamento), que funcionasse em servidores de hardware convencional já existentes e que suportasse transações ACID e consultas SQL complexas.",
      question: "A vantagem do SGBD PostgreSQL, em relação a outros sistemas proprietários, que o torna adequado para esse cenário é:",
      options: [
        "Ser um produto exclusivo da Microsoft com integração ao Excel",
        "Exigir hardware avançado e caríssimo para funcionar",
        "Ser open source (software livre) e não exigir sistemas de hardware extremamente avançados",
        "Não suportar chaves estrangeiras ou consultas complexas"
      ],
      answer: 2,
      feedback: "O ==mark==PostgreSQL== é um SGBD relacional ==dml==open source (código aberto e gratuito)==, o que elimina custos de licenciamento — fator crítico em orçamentos públicos. Além disso, funciona eficientemente em hardware convencional. Apesar de gratuito, suporta completamente transações ACID, chaves estrangeiras, consultas SQL complexas, views e stored procedures."
    },

    {
      aula: "Aula 2 — Características de um SGBD",
      tipo: "Contextualizada",
      texto: "Uma equipe precisou migrar o banco de dados de Oracle para PostgreSQL para reduzir custos. Os programas em Java utilizavam referências aos campos pelo nome lógico (ex.: SELECT Nome, Salario FROM Funcionarios), sem qualquer referência à organização física dos dados em disco. Após a migração, o DBA reorganizou completamente a estrutura física de armazenamento, mas os programas em Java continuaram funcionando sem qualquer alteração no código-fonte.",
      question: "A característica que permite que um programa de aplicação trabalhe com dados invocando-os por seus nomes, sem considerar como são implementados fisicamente, é chamada de:",
      options: [
        "Dependência física",
        "Independência programa-dados (ou abstração)",
        "Redundância controlada",
        "Metadados estáticos"
      ],
      answer: 1,
      feedback: "A ==key==Independência programa-dados== é uma característica fundamental dos SGBDs que permite alterar a organização física dos dados sem precisar modificar os programas de aplicação. Os programas trabalham com nomes lógicos de tabelas e colunas (abstração), e o SGBD se encarrega de mapear esses nomes para a localização física real dos dados."
    },

    {
      aula: "Aula 2 — Características de um SGBD",
      tipo: "Contextualizada",
      texto: "Uma empresa contratou três profissionais: Fernanda, que usa o sistema de relatórios para consultar dados de vendas; Ricardo, que escreve programas em Java que se comunicam com o banco via JDBC para construir o módulo de pedidos; e Cláudio, que instala o SGBD, configura backups automáticos, cria usuários e monitora a performance.",
      question: "O profissional que escreve os códigos em Java ou C++ para acessar o banco é classificado, segundo as classes gerais de usuários de um SGBD, como:",
      options: [
        "Usuário Final",
        "Administrador de Banco de Dados (DBA)",
        "Desenvolvedor de Aplicações (Programador)",
        "Operador de Mainframe"
      ],
      answer: 2,
      feedback: "Na classificação de usuários de SGBDs: o ==dml==Desenvolvedor de Aplicações (Programador)== escreve programas em linguagens como Java, Python ou C++ para acessar o banco via APIs (JDBC, ODBC) — Ricardo. A ==mark==Usuária Final== usa o sistema sem programar — Fernanda. O ==key==DBA== administra a infraestrutura do banco — Cláudio."
    },

    // ── Aula 3 — Características de um Banco de Dados ─────

    {
      aula: "Aula 3 — Características de um Banco de Dados",
      tipo: "Contextualizada",
      texto: "O administrador do banco de dados de uma biblioteca municipal criou uma tabela chamada Emprestimos com as colunas: ID (inteiro, chave primária), Data_Emprestimo (date), Data_Devolucao (date) e Livro_ID (inteiro, chave estrangeira). Após criar a tabela, o administrador observou que ela estava vazia — nenhum empréstimo havia sido registrado ainda.",
      question: "A definição da estrutura da tabela Emprestimos — que não muda frequentemente — é chamada de:",
      options: [
        "Estado do banco de dados",
        "Comportamento da aplicação",
        "Esquema (ou Estrutura)",
        "Instância corrente"
      ],
      answer: 2,
      feedback: "O ==ddl==Esquema (schema)== de um banco de dados é a definição da sua estrutura — os nomes das tabelas, colunas, tipos de dados e restrições. É uma definição estável que raramente muda. Em contraste, o ==mark==Estado (ou instância)== é o conjunto de dados efetivamente armazenados em um determinado momento, que muda constantemente com inserções, atualizações e exclusões."
    },

    {
      aula: "Aula 3 — Características de um Banco de Dados",
      tipo: "Contextualizada",
      texto: "O sistema bancário do Banco Integra iniciou uma transferência de R$ 100,00 da conta de Pedro para a de Maria: o valor foi debitado da conta de Pedro com sucesso, mas antes que o crédito fosse efetuado na conta de Maria, o data center sofreu uma queda de energia. Ao reiniciar, a equipe de TI constatou que R$ 100,00 tinham saído da conta de Pedro, mas não tinham chegado à conta de Maria.",
      question: "O mecanismo que garante que a operação seja desfeita por completo após a falha, seguindo o princípio do 'tudo ou nada', é a propriedade ACID de:",
      options: [
        "Consistência",
        "Isolamento",
        "Durabilidade",
        "Atomicidade"
      ],
      answer: 3,
      feedback: "A ==key==Atomicidade== é a propriedade ACID que garante que uma transação seja tratada como uma unidade indivisível — ou todas as operações são executadas com sucesso (`COMMIT`), ou nenhuma delas é aplicada (`ROLLBACK`). Como houve falha no meio da transação, o sistema deve desfazer o débito de Pedro, restaurando o estado consistente anterior."
    },

    {
      aula: "Aula 3 — Características de um Banco de Dados",
      tipo: "Contextualizada",
      texto: "Em um sistema de internet banking, dois processos são executados simultaneamente: T1 está atualizando o saldo de uma conta corrente (debitando R$ 500,00) e T2 foi disparado para ler o saldo da mesma conta e gerar o histórico do cliente. O SGBD detectou o conflito e fez T2 aguardar a finalização de T1 antes de liberar a leitura do saldo.",
      question: "Qual propriedade ACID está sendo aplicada pelo SGBD ao impedir que T2 leia um estado intermediário gerado por T1?",
      options: [
        "Durabilidade",
        "Isolamento",
        "Atomicidade",
        "Escalabilidade"
      ],
      answer: 1,
      feedback: "O ==key==Isolamento== é a propriedade ACID que garante que transações concorrentes sejam executadas de forma independente entre si. Cada transação não deve enxergar os estados intermediários de outras transações em andamento. O SGBD impede que T2 leia o saldo 'sujo' (==danger==dirty read==) gerado por T1 ainda não confirmado."
    },

    {
      aula: "Aula 3 — Características de um Banco de Dados",
      tipo: "Contextualizada",
      texto: "A analista Débora criou as tabelas Alunos, Professores, Disciplinas e Matrículas com todos os campos e restrições definidos, executou o script DDL no SGBD de produção e o banco de dados existia estruturalmente mas não continha nenhum dado. Assim que o sistema entrou em produção e os primeiros registros foram inseridos, o banco de dados sofreu uma transformação importante.",
      question: "Ao inserir os primeiros registros de alunos e professores, o banco de dados sofreu uma mudança de:",
      options: [
        "Esquema físico",
        "Nível de visão",
        "Estado",
        "Metadados"
      ],
      answer: 2,
      feedback: "O ==mark==Estado (ou instância)== de um banco de dados é o conjunto de dados armazenados em um determinado momento. Quando as tabelas existem mas estão vazias, o banco está em um estado inicial vazio. Ao inserir os primeiros registros, o banco transita para um novo estado — com dados concretos. O ==ddl==Esquema== (estrutura das tabelas) permanece o mesmo."
    },

    {
      aula: "Aula 3 — Características de um Banco de Dados",
      tipo: "Contextualizada",
      texto: "Durante a Black Friday, o sistema de e-commerce da loja TechShop registrou um pico de 50.000 pedidos por hora. Ao finalizar uma compra, o usuário recebia a confirmação: 'Pedido realizado com sucesso! Número do pedido: #892341'. Milissegundos após o envio dessa confirmação, o servidor sofreu uma falha crítica de hardware. Quando o sistema voltou ao ar, o pedido #892341 estava devidamente registrado no banco de dados.",
      question: "A propriedade ACID que garante que os dados do pedido sejam persistidos permanentemente, mesmo após a falha do servidor, é:",
      options: [
        "Atomicidade",
        "Consistência",
        "Isolamento",
        "Durabilidade"
      ],
      answer: 3,
      feedback: "A ==key==Durabilidade== é a propriedade ACID que garante que, uma vez confirmada (`COMMIT`), uma transação persiste permanentemente no banco de dados — mesmo em caso de falhas de hardware, quedas de energia ou reinicializações. O pedido #892341 foi confirmado antes da falha, portanto seus dados devem estar permanentemente gravados e disponíveis após a recuperação."
    },

    {
      aula: "Aula 3 — Características de um Banco de Dados",
      tipo: "Aplicação",
      texto: "Analise o seguinte fragmento de operações em um banco de dados bancário:\n`read(A);` /* lê o saldo atual da conta A = R$ 1.000,00 */\n`A := A - 50;` /* subtrai R$ 50,00 */\n`write(A);` /* grava o novo saldo A = R$ 950,00 */\n[FALHA DO SISTEMA — energia cortada neste ponto]\nA operação complementar (creditar R$ 50,00 em outra conta) não chegou a ser executada. O mecanismo de recuperação não foi acionado para restaurar o valor original de A.",
      question: "Após esse cenário, sem o acionamento do sistema de recuperação, o banco de dados estará em um:",
      options: [
        "Estado durável",
        "Estado consistente",
        "Estado inconsistente",
        "Esquema relacional"
      ],
      answer: 2,
      feedback: "O banco de dados está em ==danger==estado inconsistente== quando as regras de integridade e as restrições de negócio não são satisfeitas. No cenário, R$ 50,00 saíram da conta A mas não chegaram à conta destino — o dinheiro 'desapareceu' do sistema. Sem o mecanismo de recuperação (que faria o `ROLLBACK`), a soma total dos saldos não se mantém, violando a regra fundamental de integridade financeira."
    },

    {
      aula: "Aula 3 — Características de um Banco de Dados",
      tipo: "Contextualizada",
      texto: "Em um sistema de controle de estoque de uma farmácia, o processo de venda de um medicamento envolve duas operações interdependentes: registrar a saída do produto no histórico de vendas (INSERT em Vendas) e atualizar o estoque do produto (UPDATE em Estoque). Essas operações devem sempre ocorrer juntas — nunca de forma isolada.",
      question: "A unidade lógica de trabalho que agrupa essas operações e garante a passagem de um estado consistente a outro é chamada de:",
      options: [
        "Tabela",
        "Atributo",
        "Transação",
        "Campo"
      ],
      answer: 2,
      feedback: "Uma ==dml==Transação== é uma unidade lógica de trabalho que agrupa um conjunto de operações que devem ser executadas de forma atômica — todas juntas ou nenhuma. O `INSERT` em Vendas e o `UPDATE` em Estoque formam uma única transação: se qualquer uma das operações falhar, todo o grupo é desfeito (`ROLLBACK`), garantindo que o banco sempre passe de um estado consistente para outro."
    },

    {
      aula: "Aula 3 — Características de um Banco de Dados",
      tipo: "Contextualizada",
      texto: "O Banco Central realizou uma auditoria nos sistemas de transferência interbancária do País. Os auditores verificaram que, após centenas de milhares de operações Pix entre diferentes contas e instituições, a soma total dos saldos de todas as contas do sistema permanecia matematicamente idêntica à soma inicial — o dinheiro transferido de uma conta chegava integralmente à conta destino.",
      question: "A propriedade ACID responsável por garantir que a soma total dos saldos permaneça a mesma após todas as transferências é:",
      options: [
        "Atomicidade",
        "Consistência",
        "Isolamento",
        "Durabilidade"
      ],
      answer: 1,
      feedback: "A ==key==Consistência== é a propriedade ACID que garante que uma transação leva o banco de um estado válido para outro estado igualmente válido, respeitando todas as regras de integridade e restrições de negócio. No sistema financeiro, a regra de que 'a soma total dos saldos deve ser constante' é uma restrição de integridade."
    },

    {
      aula: "Aula 3 — Características de um Banco de Dados",
      tipo: "Contextualizada",
      texto: "O servidor do banco de dados de uma distribuidora sofreu uma falha elétrica enquanto diversas transações estavam sendo processadas. Quando o sistema foi reiniciado, o DBA precisava garantir duas coisas: (1) que todas as transações parcialmente executadas antes da falha fossem completamente desfeitas, e (2) que todas as transações que haviam recebido COMMIT tivessem seus efeitos garantidos no disco.",
      question: "O componente do SGBD responsável por tratar falhas, garantindo tanto a atomicidade (desfazendo erros) quanto a durabilidade (garantindo gravações em disco), é o:",
      options: [
        "Processador de consultas",
        "Sistema de recuperação",
        "Interface gráfica",
        "Catálogo de dados"
      ],
      answer: 1,
      feedback: "O ==dml==Sistema de Recuperação (Recovery Manager)== é o componente do SGBD que entra em ação após falhas. Ele utiliza o ==key==Log de Transações== para: (1) fazer `UNDO` (desfazer) das transações parcialmente executadas sem `COMMIT`, e (2) fazer `REDO` (refazer) das transações confirmadas cujas alterações ainda não tinham sido gravadas fisicamente no disco."
    },

    {
      aula: "Aula 3 — Características de um Banco de Dados",
      tipo: "Contextualizada",
      texto: "Em um sistema de e-commerce, o processo de finalização de compra envolve duas operações: inserir o pedido na tabela Pedidos e atualizar o estoque do produto na tabela Estoque. Se o estoque for insuficiente, a transação inteira é abortada. Do ponto de vista do usuário, essas duas operações parecem ser uma única ação: 'fazer um pedido'.",
      question: "O conceito que define essas operações como uma 'única unidade indivisível' do ponto de vista do usuário é:",
      options: [
        "Persistência de dados",
        "Visão lógica de tabelas",
        "Atomicidade",
        "Redundância de arquivos"
      ],
      answer: 2,
      feedback: "A ==key==Atomicidade== define que uma transação é uma unidade indivisível de trabalho — 'tudo ou nada'. O `INSERT` em Pedidos e o `UPDATE` em Estoque formam uma transação atômica: ou ambas ocorrem com sucesso (`COMMIT`) ou nenhuma é aplicada (`ROLLBACK`). ==danger==Nunca haverá um estado intermediário onde um pedido existe sem atualização de estoque.=="
    },

    // ── Aula 4 — Arquiteturas de Banco de Dados ────────────

    {
      aula: "Aula 4 — Arquiteturas de Banco de Dados",
      tipo: "Contextualizada",
      texto: "A rede de supermercados FrescaMais possui servidores regionais em cada capital brasileira. O estoque de cada loja é gerenciado localmente pelo servidor da região, mas os dados são replicados periodicamente para o servidor central em Brasília. Um analista no escritório de Brasília precisava verificar o estoque de laranjas no CD de Curitiba e obteve o resultado sem precisar saber em qual servidor o dado residia fisicamente.",
      question: "A propriedade do banco de dados distribuído que permite ao usuário interagir com o sistema sem precisar saber onde o dado está fisicamente armazenado é:",
      options: [
        "Fragmentação Vertical",
        "Transparência de dados",
        "Arquitetura Centralizada",
        "Clusterização Monolítica"
      ],
      answer: 1,
      feedback: "A ==dml==Transparência de dados== é uma propriedade dos bancos de dados distribuídos que oculta do usuário os detalhes de como e onde os dados estão fisicamente armazenados. O usuário interage com o sistema como se fosse um banco de dados único e centralizado, sem precisar saber se o dado está em Curitiba, São Paulo ou Brasília."
    },

    {
      aula: "Aula 4 — Arquiteturas de Banco de Dados",
      tipo: "Contextualizada",
      texto: "A startup NutriApp precisava hospedar seu banco de dados. Sem capital para adquirir servidores físicos, a CTO decidiu contratar um serviço em nuvem onde o provedor seria responsável pela instalação do SGBD, configuração de backups automáticos, aplicação de patches de segurança e escalabilidade conforme a demanda. A equipe ficaria responsável apenas por definir o esquema das tabelas e gerenciar os dados.",
      question: "Este modelo de serviço em nuvem, onde o provedor gerencia o SGBD e a infraestrutura, é classificado como:",
      options: [
        "IaaS (Infraestrutura como um Serviço)",
        "SaaS (Software como um Serviço)",
        "DBaaS (Banco de Dados como um Serviço)",
        "Cloud File-Server"
      ],
      answer: 2,
      feedback: "O ==mark==DBaaS (Database as a Service)== é um modelo de serviço em nuvem onde o provedor gerencia toda a infraestrutura e o próprio SGBD — instalação, configuração, backups, patches, escalabilidade e alta disponibilidade. Exemplos populares: Amazon RDS, Google Cloud SQL, Azure Database. ==danger==Difere do IaaS (onde o cliente gerencia o SGBD) e do SaaS (onde o cliente usa uma aplicação completa).=="
    },

    {
      aula: "Aula 4 — Arquiteturas de Banco de Dados",
      tipo: "Contextualizada",
      texto: "O CapitalBank decidiu otimizar sua arquitetura de dados separando informações por finalidade. A tabela CONTA_CORRENTE foi dividida em dois fragmentos: o servidor de Auditoria recebeu as colunas Saldo e Limite (dados financeiros), enquanto o servidor de Marketing recebeu as colunas Nome e Endereço (dados de relacionamento). Para exibir informações completas de um correntista, o sistema precisava combinar os dados dos dois servidores.",
      question: "A técnica que divide a tabela por colunas em diferentes servidores, exigindo uma operação de junção para reconstruir a visão completa, é chamada de:",
      options: [
        "Fragmentação Horizontal",
        "Replicação de Tuplas",
        "Fragmentação Vertical",
        "Transparência de Replicação"
      ],
      answer: 2,
      feedback: "A ==dml==Fragmentação Vertical== divide uma tabela por colunas (atributos), distribuindo grupos de colunas em diferentes servidores. Ambos os fragmentos mantêm a chave primária para permitir a junção. Em contraste, a ==mark==Fragmentação Horizontal== divide uma tabela por linhas (tuplas), distribuindo subconjuntos de registros em diferentes servidores."
    },

    {
      aula: "Aula 4 — Arquiteturas de Banco de Dados",
      tipo: "Contextualizada",
      texto: "A plataforma MegaShop utiliza uma arquitetura de 3 camadas: a camada de apresentação (navegador), a camada de negócio (servidor de aplicação com regras de validação de crédito, cálculo de frete e processamento de pagamento) e a camada de dados (servidor de banco de dados). Durante a Black Friday, com tráfego 20 vezes acima do normal, usuários conseguiam navegar pelo catálogo mas não conseguiam finalizar o pagamento. O DBA confirmou que o servidor de banco de dados estava operando normalmente.",
      question: "O gargalo identificado durante a Black Friday está na:",
      options: [
        "Camada de Cliente (Front-end)",
        "Camada Interna do SGBD",
        "Camada de Interface Gráfica",
        "Camada Intermediária (Servidor de Aplicação)"
      ],
      answer: 3,
      feedback: "Na arquitetura de 3 camadas, a ==mark==Camada Intermediária (Servidor de Aplicação)== é responsável por processar as regras de negócio — validação de crédito, cálculo de frete e processamento de pagamento. Como o banco de dados (camada 3) estava normal e os usuários conseguiam navegar (camada 1 funcionando), o gargalo estava claramente na camada do meio."
    },

    {
      aula: "Aula 4 — Arquiteturas de Banco de Dados",
      tipo: "Contextualizada",
      texto: "Uma rede de lojas de materiais de construção com 500 filiais utilizava arquitetura Cliente-Servidor de duas camadas. O software instalado em cada computador dos vendedores continha, além da interface gráfica, toda a lógica de cálculo de impostos sobre as vendas. Quando o governo federal alterou as alíquotas do ICMS, o departamento de TI precisou atualizar o software em todos os 500 computadores da rede — processo que levou 3 dias e custou R$ 45.000,00 em mão de obra.",
      question: "A desvantagem que obrigou a atualização em cada um dos 500 computadores decorre de:",
      options: [
        "Alta escalabilidade",
        "Facilidade de manutenção centralizada",
        "Dependência da lógica de negócio residir no lado do cliente",
        "Transparência de rede"
      ],
      answer: 2,
      feedback: "Na arquitetura Cliente-Servidor de 2 camadas com ==danger=='fat client' (cliente gordo)==, a lógica de negócio fica instalada nos computadores clientes. Isso significa que qualquer alteração nas regras de negócio exige atualização em TODOS os computadores individualmente. Na arquitetura de 3 camadas, a lógica estaria centralizada no servidor de aplicação — ==dml==atualização em um único ponto.=="
    },

    {
      aula: "Aula 4 — Arquiteturas de Banco de Dados",
      tipo: "Explicativa",
      texto: "Nos primórdios da computação corporativa, grandes empresas e órgãos governamentais utilizavam computadores de grande porte para processar todos os dados da organização. Os funcionários interagiam por meio de terminais conectados ao computador central — dispositivos que possuíam apenas teclado e monitor, sem processador próprio nem capacidade de armazenamento local. Todo o processamento e armazenamento de dados ocorriam exclusivamente naquele único equipamento central.",
      question: "A arquitetura descrita, com processamento e armazenamento concentrados em um único mainframe e terminais sem poder de processamento próprio, é chamada de:",
      options: [
        "Cliente-Servidor de 3 camadas",
        "Arquitetura Distribuída",
        "Banco de Dados em Nuvem",
        "Arquitetura Centralizada"
      ],
      answer: 3,
      feedback: "A ==ddl==Arquitetura Centralizada== concentra todo o processamento, armazenamento e execução de programas em um único computador central (mainframe). Os usuários acessam o sistema por ==mark==terminais 'burros' (dumb terminals)==, que não possuem capacidade de processamento próprio — apenas exibem resultados e enviam entradas. É o modelo mais antigo de computação corporativa."
    },

    {
      aula: "Aula 4 — Arquiteturas de Banco de Dados",
      tipo: "Contextualizada",
      texto: "A empresa farmacêutica BioLab decidiu migrar toda a sua infraestrutura de banco de dados para a nuvem. O gestor de segurança levantou uma preocupação específica: com os dados hospedados em servidores de terceiros, a empresa perderia o controle físico direto sobre os discos onde as informações confidenciais de pesquisa e desenvolvimento — incluindo fórmulas patenteadas — estavam armazenadas.",
      question: "O risco de segurança e a responsabilidade legal levantados pelo gestor são características associadas à adoção de:",
      options: [
        "Sistemas Distribuídos",
        "Computação em Nuvem (Cloud)",
        "Arquitetura Cliente-Servidor",
        "Fragmentação Vertical"
      ],
      answer: 1,
      feedback: "A ==mark==Computação em Nuvem== apresenta desafios específicos de segurança e conformidade legal: os dados ficam armazenados em servidores de terceiros e a empresa perde o controle físico direto sobre a infraestrutura. Isso gera preocupações com: ==danger==soberania dos dados, conformidade com a LGPD, dependência do provedor e riscos de acesso não autorizado.=="
    },

    {
      aula: "Aula 4 — Arquiteturas de Banco de Dados",
      tipo: "Contextualizada",
      texto: "O sistema de gestão de uma universidade federal foi desenvolvido em arquitetura de três camadas. A camada intermediária é responsável por receber as requisições dos alunos, verificar se o aluno está dentro do prazo de matrícula, calcular se há pré-requisitos atendidos e, somente após essas validações, emitir o comando SQL ao banco de dados. Um professor questionou a necessidade dessa camada intermediária.",
      question: "Na arquitetura de três camadas, o componente que recebe as solicitações do usuário, aplica regras de negócio e envia os comandos SQL ao banco de dados é:",
      options: [
        "O Servidor de Banco de Dados",
        "O Terminal do Usuário",
        "O Servidor de Aplicação (ou Web)",
        "O Catálogo de Metadados"
      ],
      answer: 2,
      feedback: "Na arquitetura de 3 camadas, o ==dml==Servidor de Aplicação (ou Web)== é a camada intermediária responsável por centralizar a lógica de negócio. Ele recebe as requisições dos usuários, aplica as regras de negócio (verificação de prazos, pré-requisitos, validações), e só então interage com o banco de dados. Isso garante ==key==segurança, manutenibilidade e escalabilidade== do sistema."
    },

    {
      aula: "Aula 4 — Arquiteturas de Banco de Dados",
      tipo: "Contextualizada",
      texto: "O banco digital GlobalPay opera em três continentes e precisa garantir que seus clientes tenham acesso de baixa latência ao histórico de transações independentemente de onde estejam. A equipe de arquitetura decidiu manter a tabela TRANSACAO integralmente duplicada em servidores localizados em São Paulo, Frankfurt e Singapura. Se o servidor de Frankfurt sofrer uma falha, os clientes europeus são redirecionados para Singapura sem interrupção do serviço.",
      question: "A técnica de armazenamento utilizada, que mantém cópias idênticas de uma tabela em múltiplos servidores, é chamada de:",
      options: [
        "Fragmentação Horizontal",
        "Fragmentação Vertical",
        "Replicação de Dados",
        "Arquitetura Centralizada"
      ],
      answer: 2,
      feedback: "A ==dml==Replicação de Dados== consiste em manter cópias idênticas (réplicas) de um mesmo conjunto de dados em múltiplos servidores geograficamente distribuídos. Os benefícios são: (1) ==key==Alta disponibilidade== — se um servidor falha, os outros assumem; (2) ==key==Baixa latência== — cada usuário acessa o servidor mais próximo. É diferente da fragmentação, que divide os dados entre os servidores."
    },

    {
      aula: "Aula 4 — Arquiteturas de Banco de Dados",
      tipo: "Contextualizada",
      texto: "Uma empresa de software desenvolveu um sistema ERP que precisava funcionar com diferentes SGBDs dependendo do cliente: alguns usavam Oracle, outros SQL Server, outros MySQL. Para não reescrever o código de acesso ao banco a cada novo cliente, a equipe adotou um padrão de conectividade que permite ao programa cliente se conectar a qualquer SGBD por meio de uma interface de programação única e padronizada.",
      question: "O padrão de conectividade descrito, que permite que programas se conectem a diferentes SGBDs por meio de uma API padronizada, é o:",
      options: [
        "ODBC (Open Database Connectivity)",
        "Eliminação da necessidade de um servidor de banco de dados físico",
        "Transformação de bancos relacionais em bancos orientados a objetos",
        "Linguagem de consulta usada exclusivamente em mainframes"
      ],
      answer: 0,
      feedback: "O ==ddl==ODBC (Open Database Connectivity)== é um padrão de API que permite que aplicações se comuniquem com diferentes SGBDs por meio de uma interface padronizada. O código da aplicação permanece o mesmo; apenas o driver ODBC específico do SGBD muda. O ==mark==JDBC (Java Database Connectivity)== é o equivalente para aplicações Java."
    },

    // ── Aula 5 — Diagrama Entidade e Relacionamento ────────

    {
      aula: "Aula 5 — Diagrama Entidade e Relacionamento",
      tipo: "Contextualizada",
      texto: "Uma locadora de veículos contratou um analista para modelar seu banco de dados. Durante o levantamento de requisitos, identificou-se que a entidade Carro deveria ter o campo Acessórios. A gerente explicou que um único carro pode estar equipado com múltiplos acessórios simultaneamente, como rádio, ar-condicionado, GPS e teto solar.",
      question: "Considerando que um carro pode ter rádio, ar-condicionado e GPS simultaneamente, no DER o atributo Acessórios deve ser representado como:",
      options: [
        "Atributo Simples",
        "Atributo Chave",
        "Atributo Multivalorado",
        "Atributo Derivado"
      ],
      answer: 2,
      feedback: "Um ==type==Atributo Multivalorado== é aquele que pode conter múltiplos valores para uma mesma instância da entidade. No DER de Peter Chen, é representado por uma ==mark==elipse dupla (elipse dentro de elipse)==. No caso, um único carro pode ter vários acessórios simultaneamente — cada valor é independente e válido. ==danger==Diferente do Atributo Composto, que é formado por sub-partes distintas.=="
    },

    {
      aula: "Aula 5 — Diagrama Entidade e Relacionamento",
      tipo: "Contextualizada",
      texto: "Em um sistema de controle acadêmico, a entidade Aluno possui os atributos: Matricula (identificador único), Nome, Data_Nascimento e Idade. Um analista observou que manter o campo Idade poderia gerar inconsistências — pois a idade muda a cada aniversário e o banco precisaria ser atualizado constantemente. A solução proposta foi calcular a idade dinamicamente, com base na Data_Nascimento, toda vez que essa informação fosse consultada.",
      question: "O atributo Idade, que não é armazenado diretamente mas calculado com base na Data de Nascimento, é classificado como:",
      options: [
        "Monovalorado",
        "Composto",
        "Derivado",
        "Determinante"
      ],
      answer: 2,
      feedback: "Um ==type==Atributo Derivado== é aquele cujo valor pode ser calculado ou inferido a partir de outro atributo já armazenado. No DER de Peter Chen, é representado por uma ==mark==elipse tracejada (pontilhada)==. A Idade é derivada da Data_Nascimento: basta calcular a diferença entre a data atual e a data de nascimento. ==danger==Armazenar a Idade diretamente causaria inconsistências ao longo do tempo.=="
    },

    {
      aula: "Aula 5 — Diagrama Entidade e Relacionamento",
      tipo: "Contextualizada",
      texto: "O sistema de informação de uma clínica médica precisa registrar que, durante uma consulta específica entre o Dr. Rafael e o paciente João Silva, foram prescritos medicamentos. A analista percebeu que a relação de prescrição só faz sentido quando se conhece SIMULTANEAMENTE o médico que prescreveu, o paciente que recebeu e a consulta em que isso aconteceu — pois o mesmo médico pode prescrever o mesmo medicamento para pacientes diferentes em consultas diferentes.",
      question: "Para representar que a prescrição depende da ocorrência específica da consulta, envolvendo Médico, Paciente e Medicamento simultaneamente, o projetista deve utilizar um:",
      options: [
        "Relacionamento Binário Simples",
        "Autorrelacionamento",
        "Relacionamento Ternário",
        "Atributo Multivalorado"
      ],
      answer: 2,
      feedback: "Um ==ddl==Relacionamento Ternário== envolve exatamente três entidades participando simultaneamente de um mesmo relacionamento. É usado quando o significado do relacionamento só pode ser capturado pela combinação das três entidades ao mesmo tempo — um relacionamento binário entre quaisquer dois dos três pares não seria suficiente para representar a semântica correta."
    },

    {
      aula: "Aula 5 — Diagrama Entidade e Relacionamento",
      tipo: "Contextualizada",
      texto: "O regulamento interno de uma empresa estabelece que todo funcionário contratado deve ser obrigatoriamente alocado em um departamento para iniciar suas atividades. Não é permitido que um funcionário exista no sistema sem estar vinculado a um departamento — o campo ID_Departamento é obrigatório no cadastro e não pode ser deixado em branco.",
      question: "A regra que exige que todo funcionário esteja obrigatoriamente alocado em um departamento define, no DER, uma:",
      options: [
        "Restrição de Participação Parcial",
        "Restrição de Participação Total",
        "Cardinalidade 1:1 obrigatória bidirecional",
        "Entidade Isolada"
      ],
      answer: 1,
      feedback: "A ==key==Restrição de Participação Total== (também chamada de dependência existencial) indica que TODAS as instâncias de uma entidade devem obrigatoriamente participar de um relacionamento. No DER de Peter Chen, é representada por ==mark==linha dupla== entre a entidade e o relacionamento. A ==danger==Participação Parcial==, ao contrário, permite que algumas instâncias não participem do relacionamento."
    },

    {
      aula: "Aula 5 — Diagrama Entidade e Relacionamento",
      tipo: "Contextualizada",
      texto: "Durante o projeto do banco de dados de um sistema de CRM, o DBA definiu que a entidade Clientes teria um atributo chamado Endereço. Ficou estabelecido que o endereço deveria ser composto por quatro informações distintas: Rua, Número, Bairro e CEP — cada uma com seu próprio significado e possibilidade de consulta individual. Isso permitiria filtrar clientes por CEP ou Bairro.",
      question: "O atributo Endereço, formado pelas partes Rua, Número, Bairro e CEP, é caracterizado no DER como um:",
      options: [
        "Atributo Simples",
        "Atributo-Chave",
        "Atributo Composto",
        "Atributo Multivalorado"
      ],
      answer: 2,
      feedback: "Um ==type==Atributo Composto== é formado por sub-atributos que podem ser tratados de forma independente. No DER, o atributo Endereço se ramifica em Rua, Número, Bairro e CEP — cada parte com seu próprio significado e utilidade. ==danger==Diferente do Atributo Multivalorado (múltiplos valores do mesmo tipo), o Composto tem sub-partes logicamente distintas.=="
    },

    {
      aula: "Aula 5 — Diagrama Entidade e Relacionamento",
      tipo: "Explicativa",
      texto: "Uma empresa de varejo online decidiu criar um novo sistema de gestão de pedidos. Antes de escrever qualquer linha de código, a equipe de TI realizou reuniões com as áreas de negócio para entender as necessidades. Em seguida, as regras foram organizadas em uma representação estruturada que permitia visualizar as entidades do negócio, seus atributos e as relações entre elas — visando eliminar possíveis redundâncias e inconsistências antes da criação física do banco.",
      question: "A técnica de planejamento que transforma uma ideia conceitual em algo traduzível para termos computacionais, visando eliminar redundâncias antes da criação física do banco, é:",
      options: [
        "Engenharia Reversa",
        "Modelagem de Dados",
        "Compilação DML",
        "Normalização de Hardware"
      ],
      answer: 1,
      feedback: "A ==dml==Modelagem de Dados== é o processo de levantamento, análise e representação estruturada das informações de um domínio de negócio antes da implementação física do banco. Envolve a criação de modelos como o ==mark==Diagrama Entidade-Relacionamento (DER)==, que representa entidades, atributos e relacionamentos de forma visual e conceitual."
    },

    {
      aula: "Aula 5 — Diagrama Entidade e Relacionamento",
      tipo: "Explicativa",
      texto: "Um estudante de Banco de Dados está analisando um Diagrama Entidade-Relacionamento (DER) no modelo proposto por Peter Chen. No diagrama, ele observa três tipos diferentes de símbolos geométricos: figuras com quatro lados iguais e ângulos retos (retângulos), figuras com quatro lados iguais e ângulos de 45 graus (losangos), e figuras ovais (elipses).",
      question: "No DER padrão de Peter Chen, os símbolos Retângulo, Losango e Elipse representam, respectivamente:",
      options: [
        "Atributo, Entidade, Relacionamento",
        "Relacionamento, Entidade, Atributo",
        "Entidade, Relacionamento, Atributo",
        "Chave Primária, Tabela, Registro"
      ],
      answer: 2,
      feedback: "Na notação clássica de Peter Chen: o ==ddl==Retângulo== representa **Entidades** (objetos do mundo real); o ==dml==Losango== representa **Relacionamentos** (associações entre entidades); e a ==mark==Elipse== representa **Atributos** (propriedades das entidades ou dos relacionamentos). Essa notação é fundamental e deve ser memorizada para interpretação correta de diagramas."
    },

    {
      aula: "Aula 5 — Diagrama Entidade e Relacionamento",
      tipo: "Contextualizada",
      texto: "O analista de sistemas do departamento de RH de uma corporação precisava modelar o sistema de gestão de equipes. A regra de negócio estabelecia que cada funcionário poderia gerenciar outros funcionários — ou seja, um gerente é também um funcionário, e seus subordinados são igualmente funcionários da mesma empresa. O analista precisava criar uma associação entre a entidade Funcionário e ela mesma.",
      question: "O relacionamento em que uma entidade se associa a instâncias da própria entidade, como no caso de Funcionário gerenciando outros Funcionários, é chamado de:",
      options: [
        "Relacionamento Ternário",
        "Agregação",
        "Autorrelacionamento",
        "Entidade Associativa"
      ],
      answer: 2,
      feedback: "O ==ddl==Autorrelacionamento== (também chamado de relacionamento unário ou reflexivo) ocorre quando uma entidade se relaciona com instâncias de si mesma. É comum em hierarquias: um Funcionário 'gerencia' outros Funcionários, uma Categoria 'contém' subcategorias. O papel de cada participante no relacionamento é diferente (gerente vs. subordinado), mesmo sendo da mesma entidade."
    },

    {
      aula: "Aula 5 — Diagrama Entidade e Relacionamento",
      tipo: "Contextualizada",
      texto: "O analista de um sistema de vendas de uma distribuidora levantou as seguintes regras de negócio: um único pedido de venda pode conter vários produtos diferentes; e um produto pode aparecer em múltiplos pedidos diferentes ao longo do tempo. Ao modelar o relacionamento entre as entidades Venda e Produto no DER, o analista precisava determinar a razão de cardinalidade correta.",
      question: "'Uma venda pode conter vários produtos, e um produto pode estar presente em várias vendas'. A razão de cardinalidade deste relacionamento é:",
      options: [
        "1:1",
        "1:N",
        "N:1",
        "N:N (Muitos-para-Muitos)"
      ],
      answer: 3,
      feedback: "A ==key==Razão de Cardinalidade N:N== (Muitos-para-Muitos) ocorre quando uma instância de uma entidade pode se relacionar com muitas instâncias da outra, e vice-versa. No modelo relacional, relacionamentos N:N são implementados com uma ==dml==tabela associativa (ou tabela de junção)== que contém as chaves estrangeiras das duas entidades relacionadas."
    },

    {
      aula: "Aula 5 — Diagrama Entidade e Relacionamento",
      tipo: "Explicativa",
      texto: "O ISBN (International Standard Book Number) é um código numérico de 13 dígitos atribuído internacionalmente a cada edição de cada livro publicado no mundo. Por definição, nenhum dois livros podem compartilhar o mesmo ISBN — cada código identifica exatamente uma obra específica.",
      question: "No MER, o atributo ISBN, que identifica de forma única cada instância da entidade Livro, será definido como:",
      options: [
        "Atributo Composto",
        "Atributo-Chave (ou Chave Primária)",
        "Relacionamento Binário",
        "Valor Nulo"
      ],
      answer: 1,
      feedback: "O ==key==Atributo-Chave== (ou atributo identificador) é aquele que identifica de forma única cada instância de uma entidade. No DER de Peter Chen, é representado com o ==mark==nome sublinhado== dentro da elipse. O ISBN é o identificador perfeito para a entidade Livro: é único mundialmente, nunca nulo e não se repete. No modelo relacional, torna-se a Chave Primária da tabela."
    },

    // ── Aula 6 — Modelo Entidade Relacionamento ────────────

    {
      aula: "Aula 6 — Modelo Entidade Relacionamento",
      tipo: "Explicativa",
      texto: "O professor de Banco de Dados apresentou aos alunos a terminologia formal do Modelo Relacional proposta por Edgar Codd. Ele destacou que muitos profissionais utilizam termos do dia a dia ('tabela', 'linha', 'coluna') que têm equivalentes formais na teoria matemática dos conjuntos na qual o modelo relacional se fundamenta.",
      question: "Na terminologia formal do Modelo Relacional, os termos que correspondem, respectivamente, ao conjunto de valores permitidos para um atributo, a uma linha da tabela e à própria tabela são:",
      options: [
        "Atributo, Registro, Arquivo",
        "Domínio, Tupla, Relação",
        "Campo, Linha, Tabela",
        "Chave, Instância, Esquema"
      ],
      answer: 1,
      feedback: "O Modelo Relacional de Codd tem terminologia formal: ==type==Domínio== é o conjunto de valores permitidos para um atributo; ==mark==Tupla== é uma linha da tabela; ==ddl==Relação== é a própria tabela. Os termos informais equivalentes são: Domínio ≈ Tipo de dado, Tupla ≈ Linha/Registro, Relação ≈ Tabela."
    },

    {
      aula: "Aula 6 — Modelo Entidade Relacionamento",
      tipo: "Contextualizada",
      texto: "O DBA Thiago tentou executar: `DELETE FROM Clientes WHERE IdCliente = 1042`. O SGBD retornou uma mensagem de erro: 'Violação de restrição: não é possível excluir o registro pai quando existem registros filhos na tabela Vendas que referenciam este cliente.' Thiago verificou que o cliente de ID 1042 possuía 23 vendas registradas.",
      question: "A proteção que impediu a exclusão do cliente com vendas dependentes é garantida pela:",
      options: [
        "Restrição de Integridade de Entidade",
        "Restrição de Chave Primária",
        "Restrição de Integridade Referencial",
        "Independência Física dos Dados"
      ],
      answer: 2,
      feedback: "A ==key==Restrição de Integridade Referencial== garante que toda chave estrangeira em uma tabela filho deve referenciar um valor existente na chave primária da tabela pai. Ao excluir o cliente 1042, o SGBD detectou 23 registros na tabela Vendas referenciando esse cliente — excluir o pai criaria 23 ==danger=='registros órfãos'== (vendas sem cliente)."
    },

    {
      aula: "Aula 6 — Modelo Entidade Relacionamento",
      tipo: "Explicativa",
      texto: "Edgar Codd, criador do Modelo Relacional, estabeleceu 12 regras para que um sistema seja considerado verdadeiramente relacional. Uma dessas regras determina que todo valor armazenado em um banco de dados relacional deve ser acessível de forma determinística a partir de três informações: o nome da tabela, o valor que identifica unicamente a linha (chave primária) e o nome da coluna.",
      question: "A regra de Codd que garante que cada dado seja acessível através da combinação do nome da tabela, valor da chave primária e nome da coluna é a:",
      options: [
        "Regra da Independência de Distribuição",
        "Regra do Tratamento de Valores Nulos",
        "Regra do Acesso Lógico",
        "Regra da Independência Física"
      ],
      answer: 2,
      feedback: "A ==key==Regra do Acesso Lógico== (Regra 2 de Codd) estabelece que cada valor atômico em um banco de dados relacional deve ser acessível de forma única e determinística por meio de três informações: ==mark==nome da relação (tabela) + valor da chave primária (linha) + nome do atributo (coluna)==. Isso garante que nenhum dado seja inacessível ou ambíguo."
    },

    {
      aula: "Aula 6 — Modelo Entidade Relacionamento",
      tipo: "Contextualizada",
      texto: "Ao projetar o banco de dados de uma empresa, o analista identificou que dois atributos da tabela Funcionários são capazes de identificar de forma única cada funcionário: a Matricula (código interno) e o CPF (documento oficial). Ambos os atributos são únicos e não nulos. O projetista optou pela Matricula como chave primária, pois é um dado interno e controlado pela empresa. O CPF permaneceu na tabela como um atributo único, mas sem ser a chave primária.",
      question: "Nesse contexto, o CPF é classificado como:",
      options: [
        "Chave Estrangeira",
        "Super-chave Redundante",
        "Chave Candidata",
        "Tupla Órfã"
      ],
      answer: 2,
      feedback: "Uma ==key==Chave Candidata== é todo atributo (ou conjunto mínimo de atributos) capaz de identificar unicamente cada tupla de uma relação. Quando existem múltiplas chaves candidatas, o projetista escolhe uma como Chave Primária — as demais permanecem como ==mark==Chaves Alternativas==. No cenário, tanto Matricula quanto CPF são chaves candidatas: ambas identificam unicamente cada funcionário."
    },

    {
      aula: "Aula 6 — Modelo Entidade Relacionamento",
      tipo: "Contextualizada",
      texto: "Ao converter o DER de um sistema de livraria para o modelo relacional, o analista chegou ao relacionamento entre Venda e Produto: uma venda pode conter vários produtos, e um produto pode aparecer em várias vendas. Esse tipo de relacionamento (N:N) apresenta um desafio específico, pois não é possível representá-lo diretamente apenas com colunas nas tabelas existentes.",
      question: "Ao mapear um relacionamento Muitos-para-Muitos (N:N) do modelo DER para o modelo relacional, a prática correta é:",
      options: [
        "Criar uma chave estrangeira em apenas uma das duas tabelas originais",
        "Fundir as duas entidades em uma única tabela gigante",
        "Criar uma nova tabela cuja chave primária é a combinação das chaves estrangeiras das tabelas relacionadas",
        "Adicionar atributos multivalorados em ambas as tabelas"
      ],
      answer: 2,
      feedback: "No modelo relacional, relacionamentos N:N não podem ser representados com chaves estrangeiras simples — isso causaria repetição ou perda de dados. A solução correta é criar uma ==dml==Tabela Associativa (ou tabela de junção)== com as chaves primárias das duas entidades como chaves estrangeiras, formando uma chave primária composta. Ex.: `Venda_Produto(IdVenda FK, IdProduto FK)`."
    },

    {
      aula: "Aula 6 — Modelo Entidade Relacionamento",
      tipo: "Contextualizada",
      texto: "Durante a implementação do banco de dados de um sistema de controle de processos judiciais, o DBA tentou inserir um processo sem informar o número do processo — campo definido como chave primária. O SGBD rejeitou a operação com a mensagem: 'O valor de chave primária não pode ser nulo'.",
      question: "A restrição de integridade que estabelece que nenhum valor de chave primária pode ser nulo (null) é chamada de:",
      options: [
        "Restrição de Chave Estrangeira",
        "Restrição de Integridade de Entidade",
        "Restrição de Domínio",
        "Restrição de ACID"
      ],
      answer: 1,
      feedback: "A ==key==Restrição de Integridade de Entidade== estabelece duas regras fundamentais para a chave primária: (1) o valor nunca pode ser ==danger==NULL==, e (2) o valor deve ser **único** para cada tupla. Essas regras garantem que toda entidade possa ser identificada e referenciada de forma unívoca. ==danger==Diferente da Integridade Referencial (que trata de chaves estrangeiras).=="
    },

    {
      aula: "Aula 6 — Modelo Entidade Relacionamento",
      tipo: "Explicativa",
      texto: "O professor apresentou o conceito de super-chave, chave candidata e chave primária. Usou a tabela Funcionários com os atributos: ID, CPF, Nome, Departamento. O conjunto {ID, CPF, Nome} identifica unicamente cada funcionário — mas ao retirar o atributo 'Nome', o conjunto {ID, CPF} ainda identifica. Ao retirar 'CPF', {ID} também identifica. O conjunto original {ID, CPF, Nome} não é o conjunto mínimo — ele contém atributos desnecessários.",
      question: "Um conjunto de atributos que identifica unicamente uma tupla, mas pode conter atributos desnecessários (não mínimo), é classificado como:",
      options: [
        "Chave Candidata",
        "Chave Primária",
        "Super-chave",
        "Chave Estrangeira"
      ],
      answer: 2,
      feedback: "Uma ==key==Super-chave== é qualquer conjunto de atributos que identifica unicamente cada tupla de uma relação — mas pode conter atributos redundantes. Uma ==mark==Chave Candidata== é uma super-chave mínima: sem atributos redundantes. Uma ==mark==Chave Primária== é a chave candidata escolhida pelo projetista. A hierarquia é: **Super-chave ⊃ Chave Candidata ⊃ Chave Primária**."
    },

    {
      aula: "Aula 6 — Modelo Entidade Relacionamento",
      tipo: "Contextualizada",
      texto: "O departamento de RH solicitou ao DBA que configurasse restrições para o campo Salario na tabela Funcionarios. As regras eram: o salário deve ser um número real (com casas decimais), deve ser positivo, não pode ser menor que o salário mínimo vigente (R$ 1.212,00) e não pode ultrapassar o teto de R$ 50.000,00 mensais.",
      question: "Ao definir que a coluna Salário só aceita valores numéricos reais positivos entre R$ 1.212,00 e R$ 50.000,00, o DBA está definindo o:",
      options: [
        "Esquema da Relação",
        "Domínio do Atributo",
        "Grau da Relação",
        "Gatilho de Transação"
      ],
      answer: 1,
      feedback: "O ==type==Domínio de um atributo== é o conjunto de valores válidos que esse atributo pode assumir — incluindo tipo de dado, formato e restrições de valor. Ao definir que `Salario` deve ser `DECIMAL`, positivo, entre R$ 1.212,00 e R$ 50.000,00, o DBA está especificando o domínio do atributo. Qualquer valor fora desse conjunto será rejeitado com ==danger==violação de restrição de domínio==."
    },

    {
      aula: "Aula 6 — Modelo Entidade Relacionamento",
      tipo: "Contextualizada",
      texto: "Em um sistema acadêmico, existem as tabelas: ALUNOS (CodAluno PK, Nome, Email) e MATRICULA (CodMatricula PK, CodAlunoDisciplina FK, CodDisciplina FK, Periodo). O desenvolvedor tentou inserir na tabela MATRICULA um registro com CodAlunoDisciplina = 99. Porém, não existe nenhum aluno com CodAluno = 99 na tabela ALUNOS.",
      question: "Ao tentar inserir na tabela MATRICULA um aluno com código '99' que não existe na tabela ALUNOS, qual restrição será violada?",
      options: [
        "Integridade de Entidade",
        "Integridade Referencial",
        "Unicidade de Chave Primária",
        "Atomicidade de Transação"
      ],
      answer: 1,
      feedback: "A ==key==Integridade Referencial== garante que todo valor de chave estrangeira em uma tabela filho deve referenciar um valor existente na chave primária da tabela pai. O campo `CodAlunoDisciplina` em MATRICULA referencia `CodAluno` em ALUNOS. Ao tentar inserir o valor 99 inexistente, o SGBD rejeita a operação — não pode existir uma matrícula referenciando um ==danger==aluno inexistente (registro órfão)==."
    },

    {
      aula: "Aula 6 — Modelo Entidade Relacionamento",
      tipo: "Explicativa",
      texto: "Na teoria do Modelo Relacional, uma variável relacional (relvar) é composta por duas partes fundamentais: o cabeçalho e o corpo. O corpo é o conjunto dinâmico de tuplas (linhas de dados que mudam com cada INSERT/UPDATE/DELETE), enquanto o cabeçalho é a parte estática que define a estrutura da relação.",
      question: "O cabeçalho de uma variável relacional (relvar) no modelo formal é um conjunto de pares ordenados de:",
      options: [
        "Tupla e Valor",
        "Nome de Tabela e Chave",
        "Domínio e Nome (Atributo)",
        "Registro e Arquivo"
      ],
      answer: 2,
      feedback: "No modelo relacional formal, o ==ddl==cabeçalho de uma relvar== é definido como um conjunto de pares ordenados `{(nome_atributo, domínio)}`, onde cada par especifica o nome de um atributo e o domínio (conjunto de valores permitidos). O cabeçalho é a parte estrutural estática — equivale ao esquema da tabela. O ==mark==corpo== é o conjunto de tuplas que variam dinamicamente com as operações DML."
    },

    // ── Aula 7 — DER Estendido (EER) ───────────────────────

    {
      aula: "Aula 7 — DER Estendido (EER)",
      tipo: "Contextualizada",
      texto: "A empresa LogiTransp precisa modelar seu banco de dados de frota. O arquiteto identificou que a entidade Veículo é uma superclasse com duas especializações: Caminhão (com atributos Capacidade_Carga e NumEixos) e Carro_de_Passeio (com atributos NumPortas e Categoria_CNH). Ao revisar o cadastro, o arquiteto confirmou que todos os veículos registrados são obrigatoriamente ou caminhões ou carros de passeio — não existe nenhum veículo que não se enquadre em pelo menos uma dessas categorias.",
      question: "Como todos os veículos são obrigatoriamente um ou outro, e não existe veículo que não se encaixe em nenhuma subclasse, a especialização é classificada como:",
      options: [
        "Especialização Parcial",
        "Especialização Total",
        "Agregação Binária",
        "Associação Unária"
      ],
      answer: 1,
      feedback: "A ==dml==Especialização Total== (ou obrigatória) ocorre quando TODA instância da superclasse deve obrigatoriamente pertencer a pelo menos uma subclasse. No EER, é representada por ==mark==linha dupla== entre a superclasse e o símbolo de especialização. A ==danger==Especialização Parcial==, ao contrário, permite que algumas instâncias da superclasse não pertençam a nenhuma subclasse."
    },

    {
      aula: "Aula 7 — DER Estendido (EER)",
      tipo: "Contextualizada",
      texto: "Em um sistema de gestão universitária, o arquiteto definiu que a entidade Pessoa é superclasse das subclasses Aluno e Professor. Ao definir os atributos específicos de Aluno (Matricula, Curso, Semestre) e Professor (SIAPE, Titulacao, Departamento), o arquiteto observou que não era necessário declarar novamente os campos Nome, CPF e Email em nenhuma das subclasses.",
      question: "O conceito central do EER que permite que Aluno e Professor recebam automaticamente todos os atributos de Pessoa é chamado de:",
      options: [
        "Encapsulamento",
        "Agregação",
        "Herança de Propriedades",
        "Abstração de Hardware"
      ],
      answer: 2,
      feedback: "A ==key==Herança de Propriedades== é o mecanismo do EER pelo qual as subclasses herdam automaticamente todos os atributos, relacionamentos e restrições da superclasse. Assim, Aluno e Professor herdam ID, Nome, CPF, DataNascimento e Email de Pessoa, sem necessidade de redeclaração. Cada subclasse acrescenta apenas seus ==dml==atributos específicos==."
    },

    {
      aula: "Aula 7 — DER Estendido (EER)",
      tipo: "Contextualizada",
      texto: "Em um sistema de gestão de projetos de TI, vários programadores trabalham em vários projetos (relacionamento N:N), e para cada combinação específica de programador-projeto, é necessário registrar quais linguagens de programação foram utilizadas. A analista percebeu que não poderia simplesmente criar um relacionamento ternário direto, pois a linguagem só está vinculada à COMBINAÇÃO específica de programador e projeto.",
      question: "A técnica do EER que eleva o relacionamento N:N Programador-Projeto ao status de entidade, permitindo associá-lo a Linguagens, é:",
      options: [
        "Especialização Parcial",
        "Generalização Total",
        "Agregação",
        "Autorrelacionamento Ternário"
      ],
      answer: 2,
      feedback: "A ==dml==Agregação== é uma técnica do EER que trata um relacionamento como uma entidade de nível superior, permitindo que ele participe de outros relacionamentos. É usada exclusivamente quando um relacionamento N:N precisa se relacionar com outra entidade. No DER, a agregação é representada por um ==mark==retângulo envolvendo o losango do relacionamento e as entidades participantes==."
    },

    {
      aula: "Aula 7 — DER Estendido (EER)",
      tipo: "Contextualizada",
      texto: "No sistema de uma clínica médica, o relacionamento Consulta (entre Médico e Paciente) precisava ser associado a Medicamentos — pois uma consulta pode resultar na prescrição de vários medicamentos. Para resolver isso no EER, o arquiteto transformou o losango 'Consulta' em uma entidade associativa — representada visualmente por um losango dentro de um retângulo — que poderia participar de novos relacionamentos.",
      question: "A representação em que um relacionamento é promovido a entidade (losango dentro de retângulo) para participar de novos relacionamentos é chamada de:",
      options: [
        "Entidade Associativa",
        "Superclasse Disjunta",
        "Generalização Parcial",
        "Herança Múltipla"
      ],
      answer: 0,
      feedback: "A ==ddl==Entidade Associativa== (também chamada de entidade de relacionamento ou agregação) é a representação visual de um relacionamento promovido ao status de entidade — simbolizada por um ==mark==losango dentro de um retângulo== no DER. Isso permite que o relacionamento participe de outros relacionamentos como se fosse uma entidade comum."
    },

    {
      aula: "Aula 7 — DER Estendido (EER)",
      tipo: "Explicativa",
      texto: "O EER inclui dois processos complementares: a Especialização e a Generalização. Na Especialização, um arquiteto parte da entidade genérica Veículo e cria subclasses como Caminhão e Carro. Na Generalização, um arquiteto observa entidades distintas como Médico e Enfermeiro, identifica os atributos comuns e cria a superclasse ProfissionalDeSaude.",
      question: "Sobre os processos de Especialização e Generalização no EER, a afirmação correta é:",
      options: [
        "Especialização é uma síntese conceitual; Generalização é um refinamento",
        "Especialização é um refinamento conceitual; Generalização é uma síntese",
        "Ambas são formas de criar entidades associativas",
        "A Generalização cria subclasses, enquanto a Especialização cria superclasses"
      ],
      answer: 1,
      feedback: "Os dois processos têm direções opostas: a ==dml==Especialização== parte do geral para o específico **(top-down)** — refina uma superclasse em subclasses (Veículo → Caminhão, Carro). A ==mark==Generalização== parte do específico para o geral **(bottom-up)** — identifica atributos comuns em entidades distintas e cria uma superclasse (Médico + Enfermeiro → ProfissionalDeSaude)."
    },

    {
      aula: "Aula 7 — DER Estendido (EER)",
      tipo: "Contextualizada",
      texto: "O sistema de RH de uma empresa pública possui a superclasse Funcionário e duas subclasses: Motorista (com atributo CarteiraCNH) e Secretária (com atributo VelocidadeDigitacao). Percebeu-se que vários funcionários de alto escalão — como diretores e coordenadores — não se enquadram em nenhuma dessas duas subclasses, pois exercem funções distintas não contempladas no modelo atual.",
      question: "A especialização que permite a existência de funcionários que não pertencem a nenhuma subclasse (como o Diretor) é classificada como:",
      options: [
        "Total",
        "Parcial",
        "Associativa",
        "Recursiva"
      ],
      answer: 1,
      feedback: "A ==dml==Especialização Parcial== (ou opcional) permite que algumas instâncias da superclasse não pertençam a nenhuma subclasse — elas existem apenas como membros da superclasse genérica. No EER, é representada por ==mark==linha simples== entre a superclasse e o símbolo de especialização. Os diretores são Funcionários 'genéricos', sem especialização."
    },

    {
      aula: "Aula 7 — DER Estendido (EER)",
      tipo: "Contextualizada",
      texto: "Em um sistema de gestão de pedidos modelado com notação UML/EER, o arquiteto definiu a associação entre Pedido e ItemDePedido com a multiplicidade '1..*' no lado do ItemDePedido. Essa notação indica que para cada pedido, deve existir pelo menos um item. Um desenvolvedor júnior confundiu essa notação com '0..*' e implementou a lógica de forma errada, permitindo pedidos sem itens.",
      question: "A associação representada por '1..*' indica que:",
      options: [
        "O relacionamento é opcional (zero ou muitos)",
        "Existe exatamente um objeto envolvido",
        "Há pelo menos um objeto envolvido no relacionamento",
        "A chave primária deve ser nula"
      ],
      answer: 2,
      feedback: "Na notação UML de multiplicidade: ==mark=='0..*'== significa zero ou mais (opcional); ==key=='1..*'== significa **um ou mais** (obrigatório pelo menos um, sem limite superior); '1..1' significa exatamente um; '0..1' significa zero ou um. ==danger==A notação '1..*' ao lado de ItemDePedido indica que cada Pedido deve ter pelo menos 1 item.=="
    },

    {
      aula: "Aula 7 — DER Estendido (EER)",
      tipo: "Contextualizada",
      texto: "Ao converter o EER de um sistema universitário para o modelo relacional, o arquiteto tinha a superclasse Pessoa (PK: ID_Pessoa) e as subclasses Aluno (atributos: Matricula, Curso) e Professor (atributos: SIAPE, Titulacao). Decidiu-se mapear cada subclasse em uma tabela separada. A questão era: qual seria a chave primária das tabelas Aluno e Professor?",
      question: "No mapeamento de herança para o modelo relacional, a Chave Primária das tabelas das subclasses deve ser:",
      options: [
        "Um novo número aleatório sem relação com a superclasse",
        "O nome da subclasse",
        "A mesma Chave Primária da superclasse, atuando também como Chave Estrangeira",
        "Uma combinação de todos os atributos da subclasse"
      ],
      answer: 2,
      feedback: "No mapeamento de hierarquias de herança (estratégia de tabela por subclasse), cada subclasse gera uma tabela com apenas seus atributos específicos mais a chave primária da superclasse. Essa chave herdada atua como: (1) ==key==Chave Primária== da tabela da subclasse e (2) ==key==Chave Estrangeira== que referencia a tabela da superclasse. Ex.: `Aluno(ID_Pessoa PK FK, Matricula, Curso)`."
    },

    {
      aula: "Aula 7 — DER Estendido (EER)",
      tipo: "Explicativa",
      texto: "Em uma consultoria de TI, um arquiteto de dados estava debatendo em quais situações a técnica de Agregação poderia ser aplicada. Surgiu a dúvida: a agregação pode ser usada em qualquer tipo de relacionamento (1:1, 1:N ou N:N), ou existe uma restrição específica quanto ao tipo de relacionamento que pode ser 'elevado' ao status de entidade?",
      question: "A principal restrição para o uso da técnica de Agregação em um modelo conceitual é:",
      options: [
        "Só pode ser usada se as entidades forem idênticas",
        "Só pode ser usada quando o relacionamento base é Muitos-para-Muitos (N:N)",
        "Só pode ser usada em arquiteturas centralizadas de mainframe",
        "Proíbe a existência de chaves estrangeiras"
      ],
      answer: 1,
      feedback: "A técnica de Agregação no EER é aplicável exclusivamente a ==key==relacionamentos N:N==, pois é nesses casos que surge a necessidade de tratar o relacionamento como uma entidade de nível superior. Em relacionamentos 1:1 ou 1:N, a chave estrangeira simples já é suficiente. A agregação resolve o problema de ==mark=='relacionamentos que precisam se relacionar com outras entidades'.=="
    },

    {
      aula: "Aula 7 — DER Estendido (EER)",
      tipo: "Contextualizada",
      texto: "Um analista está modelando um sistema escolar com as seguintes regras: cada aluno pode estar matriculado em no máximo uma turma por vez (não existem alunos sem turma, e cada aluno pertence a exatamente uma turma); cada turma pode ter qualquer número de alunos matriculados (inclusive pode existir uma turma recém-criada sem alunos).",
      question: "As cardinalidades corretas próximas a Turma (quantas turmas um aluno pode ter) e próximas a Aluno (quantos alunos uma turma pode ter) são, respectivamente:",
      options: [
        "1..1 e 0..*",
        "0..* e 1..1",
        "*..* e 1..1",
        "0..1 e 0..1"
      ],
      answer: 0,
      feedback: "Analisando as regras de negócio: do lado de Turma (quantas turmas um Aluno pode ter): cada aluno pertence a exatamente uma turma → ==key==1..1==; do lado de Aluno (quantos alunos uma Turma pode ter): uma turma pode ter zero alunos (turma recém-criada) ou muitos → ==key==0..*==. Leitura: um Aluno pertence a exatamente **1 Turma (1..1)**, e uma Turma pode ter de **0 a muitos Alunos (0..*).**"
    },

    // ── Aula 8 — Introdução ao SQL ─────────────────────────

    {
      aula: "Aula 8 — Introdução ao SQL",
      tipo: "Contextualizada",
      texto: "O analista de banco de dados Fábio recebeu duas demandas: (1) remover definitivamente a tabela Log_Antigo do banco de dados de produção; (2) adicionar uma nova coluna WhatsApp (VARCHAR(15)) à tabela Clientes. Ao classificar essas operações para documentação técnica, Fábio precisava identificar à qual sublinguagem do SQL ambos os comandos pertenciam.",
      question: "Os comandos DROP TABLE e ALTER TABLE, utilizados para atender às demandas de Fábio, pertencem à sublinguagem:",
      options: [
        "DML (Linguagem de Manipulação de Dados)",
        "DCL (Linguagem de Controle de Dados)",
        "DDL (Linguagem de Definição de Dados)",
        "DQL (Linguagem de Consulta de Dados)"
      ],
      answer: 2,
      feedback: "A ==ddl==DDL (Data Definition Language)== é o subconjunto do SQL responsável por definir, modificar e remover a **estrutura (esquema)** dos objetos do banco — tabelas, índices, views. Os principais comandos DDL são: `CREATE` (criar), `ALTER` (modificar estrutura) e `DROP` (remover). ==danger==Como DROP TABLE e ALTER TABLE operam sobre a estrutura das tabelas (não sobre os dados), ambos pertencem à DDL.=="
    },

    {
      aula: "Aula 8 — Introdução ao SQL",
      tipo: "Contextualizada",
      texto: "Durante uma manutenção de urgência, o desenvolvedor Marcos executou `UPDATE Pedidos SET Status = 'Cancelado'`. Ao verificar o resultado, percebeu que havia esquecido a cláusula WHERE — o comando havia atualizado o status de TODOS os 15.000 pedidos na tabela. Por sorte, Marcos havia iniciado uma transação explícita antes de executar o script e ainda não havia confirmado as alterações.",
      question: "A operação de modificação de registros com UPDATE pertence ao subconjunto da SQL denominado:",
      options: [
        "DDL",
        "DML",
        "DCL",
        "DQL"
      ],
      answer: 1,
      feedback: "A ==dml==DML (Data Manipulation Language)== é o subconjunto do SQL que opera sobre os dados armazenados nas tabelas. Os principais comandos DML são: `INSERT` (inserir), `UPDATE` (atualizar), `DELETE` (excluir) e, em muitas classificações, `SELECT` (consultar). O `UPDATE` é tipicamente um comando DML transacional — suas alterações podem ser confirmadas (`COMMIT`) ou revertidas (`ROLLBACK`)."
    },

    {
      aula: "Aula 8 — Introdução ao SQL",
      tipo: "Contextualizada",
      texto: "Em uma empresa de consultoria financeira, o DBA Rodrigo recebeu a solicitação do Gerente de Compliance: somente o Gerente Financeiro e seus assistentes poderiam visualizar a coluna Salário da tabela Funcionários, e apenas o DBA teria permissão para inserir ou excluir registros nessa tabela. Para implementar essas restrições, Rodrigo precisava utilizar os comandos específicos que concedem e revogam privilégios de acesso.",
      question: "Os comandos GRANT (conceder permissão) e REVOKE (revogar permissão), utilizados pelo DBA para configurar os acessos, fazem parte da:",
      options: [
        "DML",
        "DQL",
        "DDL",
        "DCL (Linguagem de Controle de Dados)"
      ],
      answer: 3,
      feedback: "A ==key==DCL (Data Control Language)== é o subconjunto do SQL responsável pelo controle de acesso e segurança do banco de dados. Seus dois principais comandos são: ==dml==GRANT== (concede privilégios de acesso a usuários ou roles) e ==dml==REVOKE== (revoga privilégios previamente concedidos). É a linguagem de segurança e autorização do SQL."
    },

    {
      aula: "Aula 8 — Introdução ao SQL",
      tipo: "Explicativa",
      texto: "Ao modelar o banco de dados de um sistema de cadastro de usuários, o desenvolvedor precisava escolher o tipo de dado mais adequado para o campo Nome. Ele analisou duas opções: CHAR(100) e VARCHAR(100). Verificou que a maioria dos nomes brasileiros possui entre 10 e 40 caracteres. A escolha impactaria diretamente o espaço de armazenamento, especialmente em uma tabela com milhões de usuários.",
      question: "A principal característica do tipo VARCHAR(100), em comparação ao tipo CHAR(100), que o torna mais eficiente nesse cenário é:",
      options: [
        "Ocupar sempre 100 bytes, independente do nome escrito",
        "Permitir apenas números inteiros",
        "Armazenar sequências de caracteres com tamanho variável, economizando espaço em disco",
        "Não permitir valores nulos"
      ],
      answer: 2,
      feedback: "O ==type==CHAR(n)== é de tamanho **fixo**: sempre ocupa exatamente n bytes, preenchendo com espaços em branco se o valor for menor. O ==type==VARCHAR(n)== é de tamanho **variável**: ocupa apenas o espaço necessário para armazenar o valor real. Para nomes com média de 10-40 caracteres em um campo VARCHAR(100), o espaço economizado em disco é significativo — especialmente em tabelas com milhões de registros."
    },

    {
      aula: "Aula 8 — Introdução ao SQL",
      tipo: "Aplicação",
      texto: "Analise a seguinte sequência de comandos SQL:\n1. `BEGIN TRANSACTION;`\n2. `DELETE FROM Pedidos;`\n3. `ROLLBACK;`\nO DBA estava testando o comportamento da transação antes de decidir se confirmaria a exclusão dos dados ou a cancelaria.",
      question: "Após a execução dessa sequência, o que aconteceu com os dados da tabela Pedidos?",
      options: [
        "Serão excluídos permanentemente",
        "Serão excluídos, mas a tabela será renomeada",
        "Permanecerão intactos, pois a transação foi desfeita",
        "A tabela será removida do catálogo (DROP)"
      ],
      answer: 2,
      feedback: "A sequência demonstra o controle transacional: `BEGIN TRANSACTION` inicia uma transação explícita; `DELETE` remove os registros **apenas em memória/log** (as alterações ainda não são permanentes); `ROLLBACK` ==dml==desfaz completamente== todas as operações realizadas dentro da transação. Como o ==danger==COMMIT nunca foi executado==, a exclusão não foi confirmada e os dados permanecem intactos."
    },

    {
      aula: "Aula 8 — Introdução ao SQL",
      tipo: "Contextualizada",
      texto: "Em uma empresa de análise de dados, a analista Camila usa principalmente o comando SELECT com cláusulas como WHERE, GROUP BY, HAVING e ORDER BY para extrair relatórios do banco de dados de vendas. Ela nunca insere, atualiza ou deleta dados — sua função é exclusivamente consultar e recuperar informações para análise.",
      question: "O subconjunto da linguagem SQL utilizado exclusivamente para consulta e recuperação de informações, tendo o SELECT como principal comando, é:",
      options: [
        "DDL",
        "DML",
        "DQL (Linguagem de Consulta de Dados)",
        "DCL"
      ],
      answer: 2,
      feedback: "A ==dml==DQL (Data Query Language)== é o subconjunto do SQL dedicado exclusivamente à **consulta e recuperação de dados**, tendo o comando `SELECT` como seu único e principal componente. Enquanto alguns autores classificam o `SELECT` como parte da DML, muitos frameworks acadêmicos o separam como DQL para destacar sua natureza ==key==exclusivamente de leitura== — sem modificação de dados."
    },

    {
      aula: "Aula 8 — Introdução ao SQL",
      tipo: "Aplicação",
      texto: "No início de um projeto de banco de dados, a desenvolvedora Julia executou o seguinte comando:\n`CREATE TABLE Produtos (ID INT PRIMARY KEY, Nome VARCHAR(150) NOT NULL, Preco DECIMAL(10,2), Estoque INT DEFAULT 0);`\nEsse comando criou a tabela Produtos com quatro colunas, com restrições e valores padrão definidos.",
      question: "O comando CREATE TABLE é classificado como DDL porque:",
      options: [
        "Insere novos dados nas linhas da tabela",
        "Define e cria a estrutura (esquema) do objeto no banco de dados",
        "Apaga registros duplicados",
        "Concede permissão de leitura ao usuário"
      ],
      answer: 1,
      feedback: "O `CREATE TABLE` é um comando ==ddl==DDL (Data Definition Language)== porque sua função é **definir e criar a estrutura** do objeto no banco — especificando o nome da tabela, os nomes e tipos de dados das colunas, as restrições (`PRIMARY KEY`, `NOT NULL`) e valores padrão (`DEFAULT`). O DDL opera sobre o esquema (metaestrutura), não sobre os dados. ==danger==Após o CREATE TABLE, a tabela existe estruturalmente, mas está vazia.=="
    },

    {
      aula: "Aula 8 — Introdução ao SQL",
      tipo: "Contextualizada",
      texto: "O hospital Santa Cruz precisava digitalizar seu arquivo de exames de imagem. Cada exame de Raio-X é um arquivo de imagem de alta resolução com tamanho médio de 8 MB. O banco de dados precisaria armazenar tanto os metadados do exame (data, médico solicitante, CID) quanto o próprio arquivo da imagem digitalizada, de forma integrada e acessível pelo sistema de laudo médico.",
      question: "O tipo de dado SQL mais adequado para armazenar os arquivos binários das imagens de Raio-X é:",
      options: [
        "INT",
        "VARCHAR",
        "BLOB (Binary Large Object)",
        "DATETIME"
      ],
      answer: 2,
      feedback: "O ==type==BLOB (Binary Large Object)== é o tipo de dado SQL projetado para armazenar grandes volumes de dados binários — como imagens, arquivos de áudio, vídeos e PDFs. Para arquivos de imagem de Raio-X com ~8 MB cada, o BLOB é o único tipo adequado entre as alternativas. O equivalente para grandes textos é o ==mark==CLOB (Character Large Object)==."
    },

    {
      aula: "Aula 8 — Introdução ao SQL",
      tipo: "Explicativa",
      texto: "Em uma aula de linguagens de programação, o professor comparou SQL com linguagens procedurais como Python e Java. No Python, para encontrar o maior elemento de uma lista, o programador precisa escrever um algoritmo passo a passo. Em SQL, para obter o maior valor de uma coluna, basta escrever: `SELECT MAX(Preco) FROM Produtos`. O professor destacou que essa diferença fundamental é o que caracteriza a natureza da linguagem SQL.",
      question: "A característica da linguagem SQL que permite ao usuário especificar apenas o resultado desejado — sem definir como o SGBD deve obtê-lo — é chamada de natureza:",
      options: [
        "Procedural, onde o programador define o caminho físico e os algoritmos de busca",
        "Declarativa, onde o usuário especifica apenas o resultado e o SGBD decide a melhor forma de obtê-lo",
        "Que só funciona em sistemas de arquivos planos (Flat-Files)",
        "Que exige a declaração manual de todos os ponteiros de memória"
      ],
      answer: 1,
      feedback: "O SQL é uma ==key==linguagem declarativa==: o usuário declara **O QUE quer** (o resultado desejado), e o SGBD — por meio do ==dml==otimizador de consultas== — decide automaticamente **COMO** obter esse resultado da forma mais eficiente. Isso contrasta com linguagens ==danger==procedurais== como Python e Java, onde o programador define explicitamente o algoritmo passo a passo."
    },

    {
      aula: "Aula 8 — Introdução ao SQL",
      tipo: "Contextualizada",
      texto: "A empresa TechCorp abriu um processo seletivo para contratar um profissional especializado em banco de dados. O perfil incluía: instalar e configurar o SGBD nos servidores; criar e gerenciar usuários e perfis de acesso (GRANT/REVOKE); monitorar a performance das consultas e otimizar índices; implementar rotinas de backup e recuperação; e garantir a integridade referencial do banco de dados.",
      question: "O profissional responsável por instalar, configurar, monitorar a segurança e gerenciar a integridade dos SGBDs, utilizando amplamente a linguagem SQL, é denominado:",
      options: [
        "Cientista de Dados",
        "Desenvolvedor Front-End",
        "DBA (Database Administrator)",
        "Analista de Hardware"
      ],
      answer: 2,
      feedback: "O ==mark==DBA (Database Administrator / Administrador de Banco de Dados)== é o profissional responsável pela instalação, configuração, segurança, performance, backup/recuperação e integridade dos SGBDs. Todas as responsabilidades listadas — instalar o SGBD, gerenciar usuários com `GRANT/REVOKE`, monitorar performance, otimizar índices e implementar backups — são atribuições clássicas do DBA."
    },

  ],

  // Modo AVA não existe para banco_dados no semestre 2026.1
  ava: [],

};