// ============================================================
// NEXUS STUDY — quiz/conteudo/2026/2026.2/banco_dados.js
// ============================================================
window.questoes = {

  // Questões de Banco de dados 
  questoes: [
   {
    tipo: "Direta",
    texto: "Sobre os subconjuntos da linguagem SQL e sua classificação.",
    question: "O que é ==ddl==DDL== (Data Definition Language) e quais comandos pertencem a ela?",
    options: [
      "Linguagem de manipulação de dados; inclui ==dml==INSERT==, ==dml==UPDATE== e ==dml==DELETE==",
      "Linguagem de definição de estruturas; inclui ==ddl==CREATE==, ==ddl==ALTER== e ==danger==DROP==",
      "Linguagem de consulta; inclui ==dml==SELECT==, WHERE e JOIN",
      "Linguagem de controle de acesso; inclui GRANT e REVOKE"
    ],
    answer: 1,
    feedback: "A ==ddl==DDL== é responsável por criar, modificar e remover estruturas do banco de dados. Seus principais comandos são ==ddl==CREATE==, ==ddl==ALTER== e ==danger==DROP== — distintos dos comandos ==dml==DML==, que manipulam dados."
  },
  {
    tipo: "Curta",
    texto: "Sobre as restrições aplicadas a colunas no momento da criação de uma tabela.",
    question: "Qual é a principal característica de uma ==key==PRIMARY KEY== em SQL?",
    options: [
      "Permite valores nulos e pode se repetir ao longo da tabela",
      "Referencia um campo em outra tabela para garantir integridade referencial",
      "Identifica unicamente cada registro; não pode ser nula nem repetida",
      "Define o tipo de dado armazenado na coluna"
    ],
    answer: 2,
    feedback: "A ==key==PRIMARY KEY== é a chave de identificação única de cada registro. Ela impõe duas regras fundamentais: unicidade (sem repetição) e `NOT NULL` obrigatório."
  },
  {
    tipo: "Código",
    texto: "Analise o script SQL abaixo, criado para um sistema de pedidos:",
    question: "Qual afirmativa sobre o script é INCORRETA?",
    code:
`CREATE TABLE clientes (
  id_cliente  INTEGER      NOT NULL,
  nome        VARCHAR(100) NOT NULL,
  email       VARCHAR(150),
  PRIMARY KEY (id_cliente)
);
 
CREATE TABLE pedidos (
  num_pedido  INTEGER  NOT NULL,
  data_pedido DATE     NOT NULL,
  id_cliente  INTEGER  NOT NULL,
  PRIMARY KEY (num_pedido),
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);`,
    options: [
      "O campo `email` aceita valores `NULL` pois não possui restrição `NOT NULL`",
      "A ==key==FOREIGN KEY== em 'pedidos' impede inserção de pedidos com `id_cliente` inexistente em 'clientes'",
      "A ==key==PRIMARY KEY== de 'pedidos' garante que `num_pedido` seja único e não nulo",
      "O campo `id_cliente` na tabela 'pedidos' pode receber `NULL` por ser uma chave estrangeira"
    ],
    answer: 3,
    feedback: "INCORRETA: o campo `id_cliente` em 'pedidos' possui `NOT NULL` explicitamente declarado, portanto não aceita `NULL`. ==key==FOREIGN KEY==, por si só, não impede `NULL` — mas a restrição `NOT NULL` sim."
  },
  {
    tipo: "Direta",
    texto: "Sobre os comandos de remoção em SQL.",
    question: "Qual é a diferença fundamental entre ==danger==DROP TABLE== e ==dml==DELETE==?",
    options: [
      "==danger==DROP TABLE== remove apenas os dados; ==dml==DELETE== remove estrutura e dados",
      "Ambos removem apenas os dados, preservando a estrutura da tabela",
      "==danger==DROP TABLE== remove estrutura e dados permanentemente; ==dml==DELETE== remove apenas os dados",
      "==dml==DELETE== só funciona com cláusula WHERE; ==danger==DROP TABLE== não aceita condições"
    ],
    answer: 2,
    feedback: "==danger==DROP TABLE== elimina a tabela por completo — estrutura e dados — de forma permanente. ==dml==DELETE== remove registros (linhas) da tabela, mas preserva sua estrutura para uso futuro."
  },
  {
    tipo: "Contexto",
    texto: "Um DBA precisou remover a tabela 'departamentos', mas ela era referenciada por chaves estrangeiras em outras três tabelas. Ele considerou usar ==mark==CASCADE== ou ==mark==RESTRICT== na operação.",
    question: "Qual é o comportamento correto de cada opção nesse cenário?",
    options: [
      "==mark==CASCADE== bloqueia a exclusão enquanto houver dependências; ==mark==RESTRICT== propaga a exclusão automaticamente",
      "==mark==CASCADE== propaga a exclusão para os objetos dependentes; ==mark==RESTRICT== bloqueia a operação se houver dependências",
      "Ambas produzem o mesmo resultado, diferindo apenas no tempo de execução",
      "==mark==RESTRICT== cria cópia de segurança antes de excluir; ==mark==CASCADE== apenas renomeia as referências"
    ],
    answer: 1,
    feedback: "==mark==CASCADE== propaga a exclusão automaticamente para todos os objetos dependentes. ==mark==RESTRICT== (padrão implícito) bloqueia a operação enquanto existirem dependências — protegendo a integridade do banco."
  },
  {
    tipo: "Curta",
    texto: "Sobre os tipos de dados disponíveis na linguagem SQL.",
    question: "Qual a diferença entre os tipos ==type==CHAR(n)== e ==type==VARCHAR(n)==?",
    options: [
      "==type==CHAR== armazena números inteiros; ==type==VARCHAR== armazena texto",
      "==type==CHAR== tem tamanho fixo, preenchendo com espaços; ==type==VARCHAR== tem tamanho variável, ocupando só o necessário",
      "==type==CHAR== é para texto longo; ==type==VARCHAR== é limitado a 10 caracteres",
      "==type==CHAR== e ==type==VARCHAR== são sinônimos em SQL padrão"
    ],
    answer: 1,
    feedback: "==type==CHAR(n)== sempre ocupa exatamente `n` caracteres, preenchendo com espaços quando necessário. ==type==VARCHAR(n)== ocupa apenas o espaço do valor inserido, até o limite `n` — mais eficiente para campos com tamanho variável."
  },
  {
    tipo: "Contexto",
    texto: "Após a criação de uma tabela 'funcionarios', o analista precisou adicionar dois novos campos — 'telefone' e 'ramal' — sem recriar a tabela e sem perder os dados já cadastrados.",
    question: "Qual comando deve ser utilizado e o que acontece com os registros existentes?",
    options: [
      "==ddl==CREATE TABLE==; os registros existentes são copiados automaticamente para a nova tabela",
      "==danger==DROP TABLE== seguido de ==ddl==CREATE TABLE==; não é possível adicionar colunas sem recriar",
      "==ddl==ALTER TABLE==; os registros existentes recebem `NULL` nas novas colunas por padrão",
      "==dml==INSERT INTO==; os novos campos são preenchidos com zero por padrão"
    ],
    answer: 2,
    feedback: "==ddl==ALTER TABLE== permite modificar tabelas existentes sem perder dados. Quando novas colunas são adicionadas sem valor `DEFAULT`, os registros já existentes recebem `NULL` nessas colunas."
  },
  {
    tipo: "Direta",
    texto: "Sobre os conceitos de organização em bancos de dados relacionais.",
    question: "O que é o ==mark==INFORMATION_SCHEMA== em um banco de dados?",
    options: [
      "Uma tabela criada pelo usuário para armazenar informações de configuração do sistema",
      "Um índice especial que acelera consultas em tabelas grandes",
      "Um conjunto de metadados que armazena informações sobre a estrutura do próprio banco",
      "Um comando ==ddl==DDL== equivalente ao ==ddl==ALTER TABLE== para renomear bancos"
    ],
    answer: 2,
    feedback: "O ==mark==INFORMATION_SCHEMA== é um componente do catálogo que armazena metadados — informações sobre a estrutura do banco, como tabelas, colunas, restrições e tipos de dados existentes."
  },
  {
    tipo: "Aplicação",
    texto: "Um sistema de biblioteca foi modelado com as tabelas 'livros' e 'emprestimos'. A tabela 'emprestimos' possui uma ==key==FOREIGN KEY== referenciando 'livros'. Um bibliotecário tentou excluir um livro que tinha empréstimos ativos registrados.",
    question: "O que acontece ao tentar excluir esse livro sem especificar ==mark==CASCADE==?",
    options: [
      "O livro é excluído e os empréstimos associados são automaticamente removidos",
      "O banco cria uma cópia de segurança do livro antes de excluí-lo",
      "A exclusão é bloqueada pelo banco, pois existem registros dependentes na tabela 'emprestimos'",
      "Os empréstimos são atualizados com `NULL` no campo do livro e a exclusão prossegue"
    ],
    answer: 2,
    feedback: "A ==key==FOREIGN KEY== implementa integridade referencial. Sem ==mark==CASCADE==, o comportamento padrão é ==mark==RESTRICT==: a exclusão é bloqueada enquanto existirem registros dependentes na tabela filha."
  },
  {
    tipo: "Código",
    texto: "Um analista executou os seguintes comandos para ajustar a estrutura de um banco em produção:",
    question: "Qual das afirmativas sobre o script abaixo é CORRETA?",
    code:
`ALTER TABLE produtos
  ADD COLUMN peso DECIMAL(8,3);
 
ALTER TABLE produtos
  ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE;
 
DROP TABLE temporarios CASCADE;`,
    options: [
      "O campo `peso` será preenchido com zero nos registros existentes por ser numérico",
      "O campo `ativo` receberá `NULL` nos registros existentes pois possui `DEFAULT`",
      "O campo `peso` receberá `NULL` nos registros existentes, pois não tem `DEFAULT` nem `NOT NULL`",
      "==danger==DROP TABLE== não aceita ==mark==CASCADE== junto ao nome da tabela — gerará erro de sintaxe"
    ],
    answer: 2,
    feedback: "Sem `DEFAULT` e sem `NOT NULL`, novas colunas adicionadas via ==ddl==ALTER TABLE== recebem `NULL` nos registros já existentes. O campo `ativo` receberá `TRUE` (seu `DEFAULT`). ==mark==CASCADE== no ==danger==DROP TABLE== é sintaxe válida."
  },
  {
    tipo: "Contexto",
    texto: "Em uma entrevista técnica para DBA júnior, o candidato foi questionado sobre os conceitos de ==mark==Esquema== e ==mark==Catálogo== em bancos de dados relacionais.",
    question: "Qual alternativa descreve corretamente esses conceitos?",
    options: [
      "==mark==Esquema== e ==mark==Catálogo== são sinônimos; ambos representam o conjunto de tabelas do banco",
      "O ==mark==Catálogo== contém apenas as tabelas de dados do usuário; o ==mark==Esquema== armazena os metadados",
      "O ==mark==Esquema== representa a estrutura lógica do banco (tabelas, views, restrições); o ==mark==Catálogo== é um conjunto de esquemas e contém metadados via ==mark==INFORMATION_SCHEMA==",
      "O ==mark==Esquema== define os tipos de dados das colunas; o ==mark==Catálogo== armazena os registros inseridos pelos usuários"
    ],
    answer: 2,
    feedback: "O ==mark==Esquema== é a estrutura lógica do banco (tabelas, views, restrições, tipos). O ==mark==Catálogo== é um conjunto de esquemas e expõe os metadados através do ==mark==INFORMATION_SCHEMA==. São conceitos distintos e complementares."
  },
  {
    tipo: "Direta",
    texto: "Sobre o tipo de dado ==type==DECIMAL== em SQL e sua utilização.",
    question: "O que representa a declaração ==type==DECIMAL(10, 2)== em uma coluna SQL?",
    options: [
      "Um número inteiro de até 10 dígitos, sem casas decimais",
      "Um número com até 10 dígitos no total e 2 casas decimais",
      "Um número com exatamente 2 dígitos inteiros e 10 casas decimais",
      "Um número binário de 10 bits com precisão de 2 bytes"
    ],
    answer: 1,
    feedback: "==type==DECIMAL(10, 2)== define um número com até 10 dígitos no total, sendo 2 deles após a vírgula. É o tipo ideal para valores monetários — diferente do ==type==BLOB==, que armazena dados binários como imagens e arquivos."
  }
  ],

  ava: [
    {
      question: "Qual tipo de dado SQL armazena texto de tamanho variável?",
      options: ["CHAR", "INTEGER", "VARCHAR", "BLOB"],
      answer: 2,
      feedback: "==type==VARCHAR== armazena texto de comprimento variável, enquanto CHAR tem tamanho fixo."
    },
    {
      question: "O que o comando ==ddl==ALTER TABLE== permite fazer?",
      options: [
        "Apenas remover colunas",
        "Adicionar, alterar ou remover colunas e restrições",
        "Criar uma nova tabela com base em outra",
        "Somente renomear a tabela"
      ],
      answer: 1,
      feedback: "==ddl==ALTER TABLE== permite modificar a estrutura de uma tabela existente de diversas formas."
    },
    {
      question: "O que é o INFORMATION_SCHEMA em um banco de dados?",
      options: [
        "Uma tabela de dados do usuário",
        "Um conjunto de metadados sobre a estrutura do banco",
        "Um tipo de índice especial",
        "Um comando para verificar erros"
      ],
      answer: 1,
      feedback: "O ==mark==INFORMATION_SCHEMA== armazena metadados — informações sobre a estrutura do próprio banco."
    }
  ],


  enade: [
 
    // ══════════════════════════════════════════════════════
    // AULA 9 — DDL: Linguagem de Definição de Dados em SQL
    // Conceitos: CREATE, ALTER, DROP, PRIMARY KEY, FOREIGN KEY,
    // CASCADE, RESTRICT, tipos de dados, esquema, catálogo.
    // ══════════════════════════════════════════════════════
 
    // ── Questão 1 ─────────────────────────────────────────
    {
      tipo: "Asserção + Justificativa",
      aula: "Aula 9",
      conteudo: "DDL — Linguagem de Definição de Dados em SQL",
      texto: "Uma empresa de logística passou por uma auditoria de qualidade de dados e identificou que pedidos estavam sendo cadastrados com códigos de cliente inexistentes no banco de dados. A equipe de TI foi acionada para reforçar a integridade dos dados entre as tabelas `pedidos` e `clientes`, garantindo que nenhum pedido pudesse referenciar um cliente que não existisse no sistema.",
      question: "Analise as asserções a seguir e a relação proposta entre elas:",
      assertions: [
        "A definição de uma ==key==FOREIGN KEY== na tabela `pedidos` referenciando a tabela `clientes` impede que sejam inseridos pedidos com códigos de cliente inexistentes.",
        "[PORQUE] A ==key==FOREIGN KEY== implementa a integridade referencial, que assegura que todo valor da coluna referenciadora exista na coluna referenciada da tabela pai."
      ],
      options: [
        "As asserções I e II são verdadeiras, e II justifica I",
        "As asserções I e II são verdadeiras, mas II não justifica I",
        "A asserção I é verdadeira e a II é falsa",
        "A asserção I é falsa e a II é verdadeira"
      ],
      answer: 0,
      feedback: "Correto: A. A ==key==FOREIGN KEY== bloqueia inserções com valores que não existem na tabela referenciada (I). A asserção II explica exatamente o mecanismo que fundamenta esse comportamento — a **integridade referencial** — justificando I de forma direta e precisa."
    },
 
    // ── Questão 2 ─────────────────────────────────────────
    {
      tipo: "Múltiplas afirmativas",
      aula: "Aula 9",
      conteudo: "DDL — Linguagem de Definição de Dados em SQL",
      texto: "Durante o projeto de um sistema hospitalar, o DBA precisou definir a estrutura completa do banco de dados utilizando comandos DDL. A equipe tinha dúvidas sobre as diferenças entre os comandos disponíveis e sobre o comportamento padrão de cada um deles ao ser executado.",
      question: "Avalie as afirmativas a seguir sobre os comandos ==ddl==DDL== em SQL:",
      assertions: [
        "O comando ==ddl==CREATE TABLE== permite definir colunas, tipos de dados e restrições como ==key==PRIMARY KEY==, ==key==FOREIGN KEY== e `NOT NULL` em uma única instrução.",
        "O comando ==ddl==DROP TABLE== remove permanentemente a estrutura e os dados da tabela, sendo diferente do ==dml==DELETE==, que remove apenas os dados sem afetar a estrutura.",
        "O comando ==ddl==ALTER TABLE== pode ser usado para adicionar novas colunas a uma tabela existente, sendo que essas colunas recebem valor `NULL` por padrão nos registros já cadastrados.",
        "O ==mark==INFORMATION_SCHEMA== é uma tabela comum do usuário onde se armazenam os dados operacionais do sistema hospitalar."
      ],
      questionContinuation: "São corretas apenas as afirmativas:",
      options: [
        "I, II e III, apenas",
        "I e III, apenas",
        "II e IV, apenas",
        "I, II, III e IV"
      ],
      answer: 0,
      feedback: "Correto: A (I, II e III). A afirmativa IV está **errada**: o ==mark==INFORMATION_SCHEMA== é um conjunto de **metadados** sobre a estrutura do banco — não uma tabela de dados operacionais do usuário. As afirmativas I, II e III descrevem corretamente o comportamento de ==ddl==CREATE TABLE==, ==danger==DROP TABLE== e ==ddl==ALTER TABLE==."
    },
 
    // ── Questão 3 ─────────────────────────────────────────
    {
      tipo: "Análise de código SQL",
      aula: "Aula 9",
      conteudo: "DDL — Linguagem de Definição de Dados em SQL",
      texto: "Um sistema de controle de vendas foi modelado com as seguintes tabelas. Analise o script SQL criado pelo analista responsável pelo projeto:",
      question: "Avalie as afirmativas sobre o script a seguir:",
      code:
`CREATE TABLE produtos (
  cod_produto  INTEGER      NOT NULL,
  descricao    VARCHAR(200) NOT NULL,
  preco        DECIMAL(10,2),
  PRIMARY KEY (cod_produto)
);
 
CREATE TABLE vendas (
  num_venda    INTEGER      NOT NULL,
  data_venda   DATE         NOT NULL,
  cod_produto  INTEGER      NOT NULL,
  quantidade   INTEGER      NOT NULL,
  PRIMARY KEY (num_venda),
  FOREIGN KEY (cod_produto) REFERENCES produtos(cod_produto)
);`,
      assertions: [
        "O campo `preco` pode receber valor `NULL` pois não possui a restrição `NOT NULL`, ao contrário de `descricao` e `cod_produto`.",
        "A ==key==PRIMARY KEY== da tabela `vendas` garante que o campo `num_venda` seja único e não nulo em todos os registros.",
        "A ==key==FOREIGN KEY== em `vendas` impede que sejam cadastradas vendas com `cod_produto` que não exista previamente na tabela `produtos`.",
        "O tipo ==type==DECIMAL(10,2)== indica que o campo `preco` armazena números inteiros de até 10 dígitos."
      ],
      questionContinuation: "São corretas as afirmativas:",
      options: [
        "I, II e III, apenas",
        "I, II, III e IV",
        "II e III, apenas",
        "I e IV, apenas"
      ],
      answer: 0,
      feedback: "Correto: A (I, II e III). A afirmativa IV está **errada**: ==type==DECIMAL(10,2)== indica número com até 10 dígitos no total e 2 casas decimais — não um inteiro. As demais são verdadeiras: `preco` aceita NULL por ausência de NOT NULL; ==key==PRIMARY KEY== garante unicidade e não nulidade; e a ==key==FOREIGN KEY== assegura integridade referencial."
    },
 
    // ── Questão 4 ─────────────────────────────────────────
    {
      tipo: "Conceitual",
      aula: "Aula 9",
      conteudo: "DDL — Linguagem de Definição de Dados em SQL",
      texto: "Uma equipe de banco de dados precisou remover uma tabela que possuía relacionamentos com outras três tabelas via chaves estrangeiras. O DBA precisou decidir entre utilizar ==mark==CASCADE== ou ==mark==RESTRICT== ao executar o ==danger==DROP TABLE==, considerando o impacto em cada cenário para o ambiente de produção.",
      question: "Sobre o comportamento das opções ==mark==CASCADE== e ==mark==RESTRICT== no contexto do ==ddl==DROP TABLE==, assinale a alternativa correta:",
      options: [
        "==mark==RESTRICT== remove automaticamente as dependências; CASCADE solicita confirmação do usuário antes de cada exclusão.",
        "==mark==CASCADE== propaga a exclusão para objetos dependentes automaticamente; RESTRICT bloqueia a operação se houver dependências.",
        "Ambas produzem o mesmo resultado final, diferindo apenas no tempo de execução.",
        "CASCADE apenas renomeia as referências nas tabelas dependentes; RESTRICT cria uma cópia de segurança antes de remover."
      ],
      answer: 1,
      feedback: "Correto: B. ==mark==CASCADE== propaga a exclusão automaticamente para os objetos dependentes. ==mark==RESTRICT== bloqueia a operação enquanto existirem dependências, protegendo a integridade do banco. As demais alternativas invertem ou distorcem esse comportamento — atenção especial à alternativa A, que inverte os papéis das duas opções."
    },
 
    // ── Questão 5 ─────────────────────────────────────────
    {
      tipo: "Asserção + Justificativa",
      aula: "Aula 9",
      conteudo: "DDL — Linguagem de Definição de Dados em SQL",
      texto: "Em um sistema universitário, a coordenação de TI identificou que duas colunas da tabela `alunos` precisavam ser adicionadas após a criação inicial da tabela: o campo `telefone` e o campo `email`. O DBA optou por utilizar o comando ==ddl==ALTER TABLE== para incluir essas colunas sem recriar a tabela completa.",
      question: "Analise as asserções a seguir e a relação proposta entre elas:",
      assertions: [
        "Ao adicionar novas colunas por meio do ==ddl==ALTER TABLE==, os registros já existentes na tabela recebem valor `NULL` nessas colunas por padrão, caso nenhum valor padrão seja especificado.",
        "[PORQUE] O ==ddl==ALTER TABLE== modifica a estrutura da tabela existente sem apagar os dados já cadastrados, exigindo que as novas colunas sejam compatíveis com os registros atuais."
      ],
      options: [
        "As asserções I e II são verdadeiras, e II justifica I",
        "As asserções I e II são verdadeiras, mas II não justifica I",
        "A asserção I é verdadeira e a II é falsa",
        "A asserção I é falsa e a II é verdadeira"
      ],
      answer: 0,
      feedback: "Correto: A. Novos campos adicionados via ==ddl==ALTER TABLE== recebem `NULL` por padrão nos registros existentes (I). A asserção II justifica esse comportamento: como o ==ddl==ALTER TABLE== preserva os dados, é necessário um valor compatível para os registros já presentes — e `NULL` é o valor padrão quando nenhum outro é especificado."
    },
 
    // ── Questão 6 ─────────────────────────────────────────
    {
      tipo: "Múltiplas afirmativas",
      aula: "Aula 9",
      conteudo: "DDL — Linguagem de Definição de Dados em SQL",
      texto: "Um professor de banco de dados aplicou um exercício em que os alunos precisavam identificar as características dos tipos de dados SQL. As respostas foram apresentadas em forma de afirmativas para avaliação coletiva da turma.",
      question: "Avalie as afirmativas a seguir sobre tipos de dados em SQL:",
      assertions: [
        "O tipo ==type==CHAR(n)== armazena cadeias de caracteres de tamanho **fixo**, preenchendo com espaços quando o valor inserido tiver menos que `n` caracteres.",
        "O tipo ==type==VARCHAR(n)== armazena cadeias de caracteres de tamanho **variável**, ocupando apenas o espaço necessário para o valor inserido, até o limite `n`.",
        "O tipo ==type==DATE== armazena apenas a parte de data (ano, mês e dia), enquanto `DATETIME` ou `TIMESTAMP` incluem também o horário.",
        "O tipo ==type==BLOB== é utilizado para armazenar dados numéricos de alta precisão, como valores monetários em sistemas financeiros."
      ],
      questionContinuation: "São corretas apenas as afirmativas:",
      options: [
        "I, II e III, apenas",
        "I e II, apenas",
        "II, III e IV, apenas",
        "I, II, III e IV"
      ],
      answer: 0,
      feedback: "Correto: A (I, II e III). A afirmativa IV está **errada**: ==type==BLOB== (Binary Large Object) é usado para armazenar dados binários como imagens, áudios e arquivos — não valores numéricos de precisão. Para dados monetários, os tipos adequados são ==type==DECIMAL== ou ==type==NUMERIC==. As afirmativas I, II e III descrevem corretamente o comportamento dos seus respectivos tipos."
    },
 
    // ── Questão 7 ─────────────────────────────────────────
    {
      tipo: "Conceitual",
      aula: "Aula 9",
      conteudo: "DDL — Linguagem de Definição de Dados em SQL",
      texto: "Em um banco de dados relacional, os conceitos de **esquema** e **catálogo** são fundamentais para a organização e o gerenciamento das estruturas de dados. Um novo analista de sistemas foi questionado sobre esses conceitos durante uma entrevista técnica.",
      question: "Assinale a alternativa que descreve corretamente a diferença entre ==mark==Esquema== e ==mark==Catálogo== em um banco de dados relacional:",
      options: [
        "O Esquema é o conjunto de todos os catálogos do banco, e o Catálogo é a menor unidade, contendo apenas as tabelas de dados do usuário.",
        "O ==mark==Esquema== representa a estrutura lógica do banco (tabelas, views, restrições); o Catálogo é um conjunto de esquemas e armazena metadados via INFORMATION_SCHEMA.",
        "Esquema e Catálogo são sinônimos em SQL padrão, representando ambos o conjunto de tabelas e views disponíveis no banco.",
        "O Catálogo define os tipos de dados das tabelas, enquanto o Esquema armazena os dados operacionais inseridos pelos usuários do sistema."
      ],
      answer: 1,
      feedback: "Correto: B. O ==mark==Esquema== representa a estrutura lógica do banco (tabelas, views, restrições e tipos de dados). O ==mark==Catálogo== é um conjunto de esquemas e contém metadados acessíveis pelo ==mark==INFORMATION_SCHEMA==. As demais alternativas invertem ou confundem os conceitos."
    },
 
    // ── Questão 8 ─────────────────────────────────────────
    {
      tipo: "Análise de código SQL",
      aula: "Aula 9",
      conteudo: "DDL — Linguagem de Definição de Dados em SQL",
      texto: "Um analista precisou ajustar a estrutura de um banco de dados existente após novos requisitos de negócio. Ele executou os seguintes comandos em sequência:",
      question: "Avalie as afirmativas sobre o script SQL a seguir:",
      code:
`-- Script de modificação da tabela funcionarios
ALTER TABLE funcionarios
  ADD COLUMN ctps VARCHAR(20);
 
ALTER TABLE funcionarios
  ADD COLUMN data_admissao DATE NOT NULL DEFAULT '2024-01-01';
 
ALTER TABLE departamentos
  RENAME TO depto;`,
      assertions: [
        "O campo `ctps` será acrescentado à tabela `funcionarios` com valor `NULL` nos registros existentes, pois nenhuma restrição `NOT NULL` ou valor padrão foi especificado.",
        "O campo `data_admissao` terá o valor `'2024-01-01'` preenchido automaticamente nos registros já existentes, pois foi definido com `DEFAULT`.",
        "O terceiro comando ==ddl==ALTER TABLE== remove permanentemente a tabela `departamentos` e todos os seus dados.",
        "Todos os três comandos pertencem à categoria ==ddl==DDL== da linguagem SQL, pois modificam estruturas do banco de dados sem inserir ou consultar dados."
      ],
      questionContinuation: "São corretas as afirmativas:",
      options: [
        "I, II e IV, apenas",
        "I e II, apenas",
        "III e IV, apenas",
        "I, II, III e IV"
      ],
      answer: 0,
      feedback: "Correto: A (I, II e IV). A afirmativa III está **errada**: `RENAME TO` apenas renomeia a tabela — não a remove nem apaga seus dados. Quem remove permanentemente é o ==danger==DROP TABLE==. As afirmativas I e II estão corretas sobre o comportamento do `DEFAULT` e do `NULL`, e IV está correta pois todos os comandos são ==ddl==DDL==."
    },
 
    // ── Questão 9 ─────────────────────────────────────────
    {
      tipo: "Asserção + Justificativa",
      aula: "Aula 9",
      conteudo: "DDL — Linguagem de Definição de Dados em SQL",
      texto: "Durante uma manutenção emergencial em um sistema bancário, um administrador de banco de dados executou o comando ==danger==DROP DATABASE== no ambiente de produção ao invés do ambiente de homologação, resultando na perda completa de todos os dados do sistema. O incidente gerou uma revisão dos procedimentos de segurança operacional da empresa.",
      question: "Analise as asserções a seguir e a relação proposta entre elas:",
      assertions: [
        "O comando ==danger==DROP DATABASE== remove permanentemente todo o banco de dados, incluindo todos os esquemas, tabelas, dados e demais objetos a ele associados, sem possibilidade de recuperação direta pelo SGBD.",
        "[PORQUE] Diferentemente do ==dml==DELETE==, que opera sobre registros de uma tabela, o ==danger==DROP DATABASE== é um comando ==ddl==DDL== que atua na estrutura do banco, eliminando definitivamente todos os seus objetos e não deixando rastros recuperáveis pelo próprio banco."
      ],
      options: [
        "As asserções I e II são verdadeiras, e II justifica I",
        "As asserções I e II são verdadeiras, mas II não justifica I",
        "A asserção I é verdadeira e a II é falsa",
        "A asserção I é falsa e a II é verdadeira"
      ],
      answer: 0,
      feedback: "Correto: A. O ==danger==DROP DATABASE== elimina tudo de forma definitiva (I), e a asserção II contextualiza e justifica esse comportamento ao diferenciá-lo do ==dml==DELETE== e ao explicar que se trata de um comando ==ddl==DDL== que age sobre a estrutura — não apenas sobre dados de uma tabela."
    },
 
    // ── Questão 10 ─────────────────────────────────────────
    {
      tipo: "Múltiplas afirmativas",
      aula: "Aula 9",
      conteudo: "DDL — Linguagem de Definição de Dados em SQL",
      texto: "Em uma prova prática de banco de dados, os alunos precisavam modelar um sistema de biblioteca com as tabelas `livros`, `autores` e `emprestimos`. A questão avaliava o conhecimento sobre ==key==PRIMARY KEY== e ==key==FOREIGN KEY== e suas implicações na integridade do banco de dados.",
      question: "Avalie as afirmativas a seguir sobre ==key==PRIMARY KEY== e ==key==FOREIGN KEY==:",
      assertions: [
        "Uma ==key==PRIMARY KEY== pode ser composta por mais de uma coluna, formando uma **chave primária composta**, que garante unicidade pela combinação dos valores das colunas envolvidas.",
        "Uma ==key==FOREIGN KEY== em `emprestimos` referenciando `livros` impede que um livro seja excluído da tabela `livros` enquanto existirem empréstimos associados a ele, a menos que seja usado ==mark==CASCADE==.",
        "Uma coluna definida como ==key==PRIMARY KEY== aceita valores `NULL`, desde que o valor seja único em toda a tabela.",
        "A ==key==FOREIGN KEY== cria um relacionamento lógico entre duas tabelas, sendo que a coluna referenciadora deve ter o mesmo tipo de dado que a coluna referenciada na tabela pai."
      ],
      questionContinuation: "São corretas apenas as afirmativas:",
      options: [
        "I, II e IV, apenas",
        "I e IV, apenas",
        "II e III, apenas",
        "I, II, III e IV"
      ],
      answer: 0,
      feedback: "Correto: A (I, II e IV). A afirmativa III está **errada**: ==key==PRIMARY KEY== **nunca** aceita `NULL` — esta é uma de suas regras fundamentais, independentemente de unicidade. As afirmativas I (chave composta), II (restrição de exclusão via ==mark==RESTRICT== implícito) e IV (compatibilidade de tipos) estão corretas."
    },
 
    // ── Questão 11 ─────────────────────────────────────────
    {
      tipo: "Análise de código SQL",
      aula: "Aula 9",
      conteudo: "DDL — Linguagem de Definição de Dados em SQL",
      texto: "Um estudante de banco de dados estava desenvolvendo o modelo físico de um sistema de recursos humanos. Após a criação inicial das tabelas, ele percebeu que precisava remover a tabela `cargos`, mas essa tabela era referenciada por `funcionarios` via ==key==FOREIGN KEY==. Ele então escreveu os seguintes comandos para resolver o problema:",
      question: "Analise o script SQL e avalie as afirmativas:",
      code:
`-- Tentativa 1
DROP TABLE cargos;
 
-- Tentativa 2
DROP TABLE cargos RESTRICT;
 
-- Tentativa 3
DROP TABLE cargos CASCADE;
 
-- Tentativa 4
DELETE FROM cargos;`,
      assertions: [
        "As tentativas 1 e 2 falharão se existirem registros em `funcionarios` referenciando `cargos`, pois ambas respeitam a integridade referencial.",
        "A tentativa 3 removerá a tabela `cargos` e automaticamente eliminará ou propagará a remoção nos objetos dependentes, incluindo a ==key==FOREIGN KEY== em `funcionarios`.",
        "A tentativa 4 remove permanentemente a estrutura da tabela `cargos`, liberando o espaço de metadados no catálogo do banco de dados.",
        "Apenas a tentativa 3 resolve o problema de remover a tabela `cargos` com dependências existentes em `funcionarios`."
      ],
      questionContinuation: "São corretas as afirmativas:",
      options: [
        "I, II e IV, apenas",
        "I e II, apenas",
        "II e III, apenas",
        "I, II, III e IV"
      ],
      answer: 0,
      feedback: "Correto: A (I, II e IV). A afirmativa III está **errada**: o ==dml==DELETE== remove apenas os **dados (linhas)** da tabela, não a estrutura. Quem remove a estrutura é o ==danger==DROP TABLE==. As afirmativas I (comportamento de RESTRICT implícito e explícito), II (comportamento de ==mark==CASCADE==) e IV (única solução para o cenário com dependências) estão corretas."
    },
 
    // ── Questão 12 ─────────────────────────────────────────
    {
      tipo: "Conceitual",
      aula: "Aula 9",
      conteudo: "DDL — Linguagem de Definição de Dados em SQL",
      texto: "Em um processo seletivo para DBA júnior, o candidato foi questionado sobre os subconjuntos da linguagem SQL e a categorização dos seus principais comandos. O avaliador queria verificar se o candidato compreendia a diferença entre DDL, DML e suas aplicações práticas.",
      question: "Assinale a alternativa que classifica corretamente os comandos SQL apresentados:",
      options: [
        "==ddl==CREATE TABLE==, ALTER TABLE e DROP TABLE pertencem à DDL; já INSERT INTO, DELETE e SELECT pertencem à DML.",
        "CREATE TABLE e INSERT INTO pertencem à DDL, pois ambos criam ou modificam estruturas; DELETE e ==danger==DROP TABLE== pertencem à DML, pois ambos removem elementos do banco.",
        "Todos os comandos citados pertencem à DDL, pois a DDL abrange toda a linguagem SQL utilizada na administração de bancos de dados relacionais.",
        "SELECT, CREATE TABLE e ALTER TABLE pertencem à DML; DROP TABLE e DELETE pertencem à DDL."
      ],
      answer: 0,
      feedback: "Correto: A. A ==ddl==DDL== (Data Definition Language) inclui os comandos que **definem e modificam estruturas**: ==ddl==CREATE TABLE==, ==ddl==ALTER TABLE==, ==danger==DROP TABLE==. A ==dml==DML== (Data Manipulation Language) inclui os comandos que **manipulam dados**: ==dml==INSERT INTO==, ==dml==SELECT==, ==dml==DELETE==, UPDATE. A alternativa B confunde ==dml==INSERT== (DML) com DDL, e ==danger==DROP== (DDL) com DML."
    }
 
  ]
};