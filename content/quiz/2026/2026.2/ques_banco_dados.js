// ============================================================
// NEXUS STUDY — quiz/conteudo/2026/2026.2/banco_dados.js
// ============================================================
window.questoes = {

  // Questões de Banco de dados 
  questoes: [
    // ── Aula 9 ──────────────────────────────────────────────

    // 1 - DDL conceito
    {
      aula: "Aula 9 — Definindo um Banco de Dados",
      tipo: "Explicativa",

      texto: "A linguagem SQL é dividida em subconjuntos, cada um com uma finalidade específica. Um desses subconjuntos é a DDL — Data Definition Language, ou Linguagem de Definição de Dados. Ela é responsável exclusivamente por criar, modificar e remover a estrutura do banco de dados, como tabelas, índices e views. Ou seja, a DDL cuida do 'esqueleto' do banco — não dos dados em si.",

      question: "De acordo com o papel da DDL em SQL, qual das alternativas descreve corretamente sua função?",

      options: [
        "Inserir, atualizar e consultar registros armazenados nas tabelas do banco.",
        "Criar, modificar e remover estruturas do banco de dados, como tabelas e índices.",
        "Controlar o acesso de usuários e permissões dentro do banco de dados.",
        "Realizar operações matemáticas e de agregação sobre os dados armazenados."
      ],

      answer: 1,

      feedback: "A ==ddl==DDL== define a estrutura do banco — não manipula dados. Comandos como CREATE, ALTER e ==danger==DROP== pertencem a ela."
    },

    // 2 - esquema e catálogo
    {
      aula: "Aula 9 — Definindo um Banco de Dados",
      tipo: "Explicativa",

      texto: "Quando se cria um banco de dados relacional, é preciso definir como as informações serão organizadas. O conceito de esquema representa a estrutura lógica do banco: quais tabelas existem, quais colunas cada uma tem, quais restrições se aplicam. Já o catálogo é um nível acima — ele agrupa múltiplos esquemas e armazena metadados sobre toda essa estrutura, incluindo o famoso INFORMATION_SCHEMA.",

      question: "Qual é a relação correta entre esquema e catálogo em um banco de dados relacional?",

      options: [
        "O esquema contém os catálogos, e cada catálogo representa uma tabela específica.",
        "Esquema e catálogo são termos sinônimos e representam a mesma estrutura no banco.",
        "O catálogo agrupa múltiplos esquemas e armazena metadados; o esquema representa a estrutura lógica do banco.",
        "O catálogo armazena os dados dos usuários, enquanto o esquema armazena apenas os índices."
      ],

      answer: 2,

      feedback: "O ==mark==catálogo== é o conjunto de esquemas e contém o INFORMATION_SCHEMA. O ==mark==esquema== define a estrutura lógica: tabelas, views e restrições."
    },

    // 3 - CREATE TABLE
    {
      aula: "Aula 9 — Definindo um Banco de Dados",
      tipo: "Explicativa",

      texto: "O comando CREATE TABLE é usado para criar uma nova tabela no banco de dados. Na sua definição, são especificados o nome de cada campo, o tipo de dado que ele aceita e as restrições que devem ser respeitadas. Toda essa definição fica registrada na estrutura do banco, pronta para receber dados.",

      question: "Qual é a estrutura básica correta de um comando CREATE TABLE em SQL?",

      code: `-- Qual opção representa a sintaxe correta?

    -- A)
    MAKE TABLE alunos (matricula INTEGER, nome VARCHAR(100));

    -- B)
    CREATE TABLE alunos (matricula INTEGER, nome VARCHAR(100));

    -- C)
    BUILD TABLE alunos WITH (matricula INTEGER, nome VARCHAR(100));

    -- D)
    NEW TABLE alunos SET (matricula INTEGER, nome VARCHAR(100));`,

      options: [
        "A opção A — usando MAKE TABLE",
        "A opção B — usando CREATE TABLE",
        "A opção C — usando BUILD TABLE",
        "A opção D — usando NEW TABLE"
      ],

      answer: 1,

      feedback: "A sintaxe correta em SQL é ==ddl==CREATE TABLE==, seguida do nome da tabela e dos campos entre parênteses. Os demais comandos não existem na linguagem SQL padrão."
    },

    // 4 - tipos de dados
    {
      aula: "Aula 9 — Definindo um Banco de Dados",
      tipo: "Contextualizada",

      texto: "Em SQL, cada coluna de uma tabela precisa ter um tipo de dado definido. Esse tipo determina que tipo de informação aquele campo pode armazenar. Por exemplo, textos de tamanho variável são guardados com VARCHAR(n), enquanto números inteiros usam INTEGER. Para valores monetários ou que exigem casas decimais, usa-se DECIMAL. Já arquivos binários como imagens e áudios são armazenados no tipo BLOB.",

      question: "Um sistema precisa armazenar o nome de um produto (texto variável), seu preço (com centavos) e uma foto do item. Quais tipos de dados são mais adequados para esses três campos, respectivamente?",

      options: [
        "CHAR, INTEGER, DATE",
        "VARCHAR, DECIMAL, BLOB",
        "TEXT, FLOAT, INTEGER",
        "VARCHAR, SMALLINT, CHAR"
      ],

      answer: 1,

      feedback: "==type==VARCHAR== é ideal para textos de tamanho variável, DECIMAL para valores com casas decimais e ==type==BLOB== para arquivos binários como imagens."
    },

    // 5 - PRIMARY KEY
    {
      aula: "Aula 9 — Definindo um Banco de Dados",
      tipo: "Contextualizada",

      texto: "A chave primária é uma restrição fundamental em qualquer tabela de banco de dados relacional. Ela garante que cada linha da tabela possa ser identificada de forma única. Para isso, o campo definido como PRIMARY KEY não pode conter valores nulos nem valores repetidos — cada registro precisa ter um identificador exclusivo.",

      question: "Uma tabela de produtos foi criada com o campo cod_produto como PRIMARY KEY. O que acontece se alguém tentar inserir dois produtos com o mesmo valor nesse campo?",

      options: [
        "O banco aceita a inserção, mas exibe um aviso ao usuário.",
        "O segundo registro substitui automaticamente o primeiro.",
        "O banco rejeita a inserção, pois a PRIMARY KEY não permite valores duplicados.",
        "O banco aceita somente se o campo nome_produto for diferente entre os dois registros."
      ],

      answer: 2,

      feedback: "A ==key==PRIMARY KEY== garante unicidade obrigatória: valores duplicados são rejeitados pelo banco. Ela também impede valores nulos, pois cada registro deve ser identificável."
    },

    // 6 - ALTER TABLE
    {
      aula: "Aula 9 — Definindo um Banco de Dados",
      tipo: "Contextualizada",

      texto: "Quando uma tabela precisa ser modificada depois de criada — seja para adicionar uma nova coluna, alterar um tipo de dado ou incluir uma restrição — o comando ALTER TABLE é utilizado. Uma situação comum é quando um novo requisito surge após o sistema já estar em produção, e é preciso adicionar campos sem apagar os dados existentes.",

      question: "Uma empresa precisou adicionar a coluna email à tabela clientes, que já continha registros cadastrados. Após executar o ALTER TABLE, qual será o valor do campo email nos registros já existentes?",

      options: [
        "Será preenchido automaticamente com um valor padrão definido pelo banco.",
        "Receberá o valor vazio (''), pois campos de texto não aceitam NULL.",
        "Receberá valor NULL, pois nenhum valor padrão foi especificado.",
        "O banco cancelará a operação para preservar a integridade dos dados existentes."
      ],

      answer: 2,

      feedback: "Ao adicionar uma coluna com ==ddl==ALTER TABLE==, os registros já existentes recebem ==danger==NULL== por padrão, a menos que um valor DEFAULT seja especificado no comando."
    },

    // 7 - FOREIGN KEY
    {
      aula: "Aula 9 — Definindo um Banco de Dados",
      tipo: "Aplicação",

      texto: "Uma desenvolvedora está criando um sistema de cursos online. Ela precisa criar duas tabelas: cursos e alunos. A tabela alunos deve ter um campo cod_curso que referencia a tabela cursos — garantindo que nenhum aluno seja vinculado a um curso inexistente. Para isso, ela usará o conceito de chave estrangeira.",

      question: "Qual trecho de código representa corretamente a definição da FOREIGN KEY na tabela alunos?",

      code: `-- Tabela base já existente:
    CREATE TABLE cursos (
      cod_curso INTEGER NOT NULL,
      nome_curso VARCHAR(100),
      PRIMARY KEY (cod_curso)
    );

    -- Opções para criar a tabela alunos:

    -- A)
    CREATE TABLE alunos (
      matricula INTEGER NOT NULL,
      nome VARCHAR(100),
      cod_curso INTEGER,
      PRIMARY KEY (matricula),
      PRIMARY KEY (cod_curso) REFERENCES cursos(cod_curso)
    );

    -- B)
    CREATE TABLE alunos (
      matricula INTEGER NOT NULL,
      nome VARCHAR(100),
      cod_curso INTEGER,
      PRIMARY KEY (matricula),
      FOREIGN KEY (cod_curso) REFERENCES cursos(cod_curso)
    );

    -- C)
    CREATE TABLE alunos (
      matricula INTEGER NOT NULL,
      nome VARCHAR(100),
      cod_curso INTEGER,
      PRIMARY KEY (matricula),
      LINK KEY (cod_curso) TO cursos(cod_curso)
    );

    -- D)
    CREATE TABLE alunos (
      matricula INTEGER NOT NULL,
      nome VARCHAR(100),
      cod_curso INTEGER REFERENCES PRIMARY KEY
    );`,

      options: [
        "Opção A — usando dois PRIMARY KEY",
        "Opção B — usando FOREIGN KEY com REFERENCES",
        "Opção C — usando LINK KEY",
        "Opção D — usando REFERENCES PRIMARY KEY"
      ],

      answer: 1,

      feedback: "A sintaxe correta é ==key==FOREIGN KEY==, seguida de REFERENCES tabela(campo). Ela cria o vínculo entre as tabelas e garante integridade referencial. As demais opções usam sintaxes inválidas."
    },

    // 8 - DROP vs DELETE
    {
      aula: "Aula 9 — Definindo um Banco de Dados",
      tipo: "Aplicação",

      texto: "Imagine que um analista precisa remover do banco uma tabela chamada turmas_antigas. Essa tabela não tem nenhuma dependência com outras tabelas. Ele tem duas opções: usar DROP TABLE ou usar DELETE FROM. Embora ambas pareçam remover dados, elas funcionam de maneiras muito diferentes.",

      question: "Qual é a diferença fundamental entre DROP TABLE e DELETE FROM ao serem aplicados à tabela turmas_antigas?",

      options: [
        "DROP TABLE remove apenas os dados; DELETE FROM remove dados e estrutura.",
        "Ambos removem dados e estrutura, diferindo apenas na velocidade de execução.",
        "DROP TABLE remove dados e estrutura definitivamente; DELETE FROM remove apenas os dados, mantendo a estrutura.",
        "DELETE FROM é mais perigoso porque não pode ser desfeito, enquanto DROP TABLE pode ser revertido."
      ],

      answer: 2,

      feedback: "==danger==DROP TABLE== elimina a tabela inteira — estrutura e dados. ==dml==DELETE FROM== apaga somente os registros, mantendo a estrutura da tabela intacta para novos dados."
    },

    // 9 - ordem criação tabelas
    {
      aula: "Aula 9 — Definindo um Banco de Dados",
      tipo: "Aplicação",

      texto: "Durante a modelagem de um sistema de vendas, um desenvolvedor precisa definir a ordem correta para criar as tabelas. A tabela pedidos possui uma FOREIGN KEY que referencia a tabela clientes. Se ele tentar criar pedidos antes de clientes, o banco retornará um erro — pois não é possível referenciar uma tabela que ainda não existe.",

      question: "Qual é a ordem correta para criar essas tabelas sem gerar erros de integridade referencial?",

      options: [
        "Criar pedidos primeiro, depois clientes, pois a chave estrangeira cria a tabela referenciada automaticamente.",
        "Criar clientes primeiro, depois pedidos — pois a tabela referenciada pela FOREIGN KEY precisa existir antes.",
        "A ordem não importa; o banco resolve as dependências automaticamente durante a criação.",
        "Criar as duas tabelas simultaneamente em um único comando CREATE TABLE."
      ],

      answer: 1,

      feedback: "A ==key==FOREIGN KEY== referencia uma tabela que já deve existir no banco. Por isso, a tabela ==mark==pai== (clientes) deve ser criada antes da tabela ==mark==filha== (pedidos)."
    },

    // 10 - RESTRICT vs CASCADE
    {
      aula: "Aula 9 — Definindo um Banco de Dados",
      tipo: "Explicativa",

      texto: "Quando se tenta remover uma tabela que possui outras tabelas dependentes dela via chave estrangeira, o banco pode se comportar de duas formas distintas, dependendo da opção informada. Com RESTRICT, o banco bloqueia a operação enquanto existirem dependências. Já com CASCADE, a exclusão é propagada automaticamente para os objetos dependentes.",

      question: "Um DBA tentou executar DROP TABLE departamentos, mas a tabela funcionarios possui uma FOREIGN KEY que a referencia. O que acontece se ele usar DROP TABLE departamentos RESTRICT?",

      options: [
        "O banco remove departamentos e automaticamente atualiza os registros de funcionarios.",
        "O banco bloqueia a operação e retorna um erro, pois existem dependências na tabela funcionarios.",
        "O banco remove apenas os dados de departamentos, mantendo a estrutura e as dependências.",
        "O banco cria um backup automático de departamentos antes de removê-la."
      ],

      answer: 1,

      feedback: "==mark==RESTRICT== protege a integridade referencial: impede a exclusão enquanto houver tabelas dependentes. Para remover com dependências, seria necessário usar ==mark==CASCADE==."
    },

    // ── Aula 10 — Manipulando um Banco de Dados ──────────────────────────────────────────────

    // 11 - DDL vs DML
    {
      aula: "Aula 10 — Manipulando um Banco de Dados",
      tipo: "Explicativa",

      texto: "A DML — Data Manipulation Language — é o subconjunto da SQL responsável por trabalhar com os dados armazenados nas tabelas. Diferente da DDL, que cuida da estrutura, a DML cuida do conteúdo: ela permite buscar, inserir, atualizar e excluir registros. Os quatro comandos principais da DML são SELECT, INSERT, UPDATE e DELETE.",

      question: "Qual é a principal diferença entre DDL e DML em SQL?",

      options: [
        "DDL manipula dados armazenados; DML define a estrutura das tabelas.",
        "DDL define a estrutura do banco; DML manipula os dados armazenados.",
        "Ambas servem para consultar dados, diferindo apenas na sintaxe.",
        "DDL é usada apenas em bancos NoSQL; DML é exclusiva de bancos relacionais."
      ],

      answer: 1,

      feedback: "==ddl==DDL== cuida do esqueleto do banco (tabelas, índices). ==dml==DML== cuida dos dados dentro dessas estruturas — inserindo, consultando, atualizando e excluindo registros."
    },

    // 12 - cláusula WHERE
    {
      aula: "Aula 10 — Manipulando um Banco de Dados",
      tipo: "Explicativa",

      texto: "A estrutura básica de uma consulta SQL é composta por três cláusulas principais: SELECT, FROM e WHERE. O SELECT define quais colunas serão retornadas. O FROM indica de qual tabela os dados serão buscados. O WHERE aplica um filtro, retornando apenas os registros que atendem à condição especificada.",

      question: "Em uma consulta SQL com SELECT, FROM e WHERE, qual é a função da cláusula WHERE?",

      options: [
        "Definir quais colunas serão exibidas no resultado da consulta.",
        "Indicar de qual tabela os dados serão recuperados.",
        "Filtrar os registros, retornando apenas os que atendem à condição definida.",
        "Ordenar os resultados em ordem crescente ou decrescente."
      ],

      answer: 2,

      feedback: "==dml==WHERE== é a cláusula de filtragem da consulta. Sem ela, todos os registros da tabela são retornados. Com ela, apenas os que satisfazem a condição aparecem no resultado."
    },

    // 13 - INSERT INTO
    {
      aula: "Aula 10 — Manipulando um Banco de Dados",
      tipo: "Contextualizada",

      texto: "O comando INSERT é usado para adicionar novos registros em uma tabela. Ele pode ser usado de duas formas: inserindo valores para todas as colunas na ordem em que foram definidas, ou especificando explicitamente quais colunas receberão valores. A segunda forma é mais segura, pois não depende da ordem das colunas na tabela.",

      question: "Um desenvolvedor precisa inserir um novo curso na tabela cursos, informando apenas o código e o nome. Qual comando está correto?",

      code: `-- A)
    VALUES (11, 'Sistemas de Informação') INTO cursos;

    -- B)
    INSERT cursos SET (11, 'Sistemas de Informação');

    -- C)
    INSERT INTO cursos (codigo, nome) VALUES (11, 'Sistemas de Informação');

    -- D)
    ADD INTO cursos (codigo, nome) VALUES (11, 'Sistemas de Informação');`,

      options: [
        "Opção A — usando VALUES antes de INTO",
        "Opção B — usando INSERT com SET",
        "Opção C — usando INSERT INTO com colunas especificadas",
        "Opção D — usando ADD INTO"
      ],

      answer: 2,

      feedback: "A sintaxe correta é ==dml==INSERT INTO== tabela (colunas) VALUES (valores). Especificar as colunas é uma boa prática pois torna o comando independente da ordem definida na criação da tabela."
    },

    // 14 - DELETE sem WHERE
    {
      aula: "Aula 10 — Manipulando um Banco de Dados",
      tipo: "Contextualizada",

      texto: "O comando DELETE remove registros de uma tabela. Ele é controlado pela cláusula WHERE: quando presente, apaga apenas os registros que atendem à condição. Quando ausente, o DELETE age sobre todos os registros da tabela — mantendo a estrutura, mas esvaziando completamente o conteúdo.",

      question: "Um analista executou o comando DELETE FROM alunos sem nenhuma cláusula WHERE. O que acontece com a tabela alunos?",

      options: [
        "Apenas o primeiro registro é removido, como comportamento padrão de segurança.",
        "O banco solicita confirmação antes de apagar todos os registros.",
        "Todos os registros são removidos, mas a estrutura da tabela permanece intacta.",
        "A tabela inteira é removida, incluindo sua estrutura e definições."
      ],

      answer: 2,

      feedback: "==danger==DELETE sem WHERE== apaga todos os dados da tabela, mas preserva sua estrutura. Para remover a tabela inteira (dados e estrutura), seria necessário usar DROP TABLE."
    },

    // 15 - SELECT DISTINCT
    {
      aula: "Aula 10 — Manipulando um Banco de Dados",
      tipo: "Contextualizada",

      texto: "O SELECT DISTINCT é usado quando se deseja eliminar valores repetidos no resultado de uma consulta. Por padrão, o SQL retorna todas as linhas, incluindo duplicatas. Ao adicionar DISTINCT logo após o SELECT, o banco garante que cada valor apareça apenas uma vez no resultado final.",

      question: "Uma consulta retornou os valores: 'SP', 'RJ', 'SP', 'MG', 'RJ'. Qual comando foi provavelmente usado para obter esse resultado com duplicatas?",

      options: [
        "SELECT DISTINCT estado FROM enderecos;",
        "SELECT estado FROM enderecos;",
        "SELECT UNIQUE estado FROM enderecos;",
        "SELECT estado WITHOUT REPEAT FROM enderecos;"
      ],

      answer: 1,

      feedback: "O ==dml==SELECT== simples retorna todas as linhas, incluindo repetições. Para eliminar duplicatas, é necessário usar SELECT ==mark==DISTINCT==, que filtra valores únicos no resultado."
    },

    // 16 - UPDATE com WHERE
    {
      aula: "Aula 10 — Manipulando um Banco de Dados",
      tipo: "Aplicação",

      texto: "O comando UPDATE permite modificar valores em registros já existentes. Ele utiliza a cláusula SET para definir quais colunas serão alteradas e os novos valores. A cláusula WHERE limita quais registros serão afetados. Sem o WHERE, todos os registros da tabela recebem a atualização — o que raramente é o comportamento desejado.",

      question: "Um gestor precisa atualizar apenas o nome do curso de código 11 na tabela cursos. Qual comando executa essa ação corretamente?",

      code: `-- A)
    UPDATE cursos SET nome = 'SI' WHERE codigo = 11;

    -- B)
    UPDATE cursos SET nome = 'SI';

    -- C)
    MODIFY cursos SET nome = 'SI' WHERE codigo = 11;

    -- D)
    UPDATE cursos WHERE codigo = 11 VALUES nome = 'SI';`,

      options: [
        "Opção A — UPDATE com SET e WHERE corretos",
        "Opção B — UPDATE sem WHERE",
        "Opção C — usando MODIFY",
        "Opção D — usando VALUES no lugar de SET"
      ],

      answer: 0,

      feedback: "A opção A usa ==dml==UPDATE== com SET e WHERE corretamente. A opção B atualizaria todos os registros. MODIFY e VALUES na posição da opção D não são sintaxes válidas em SQL padrão."
    },

    // 17 - operadores aritméticos
    {
      aula: "Aula 10 — Manipulando um Banco de Dados",
      tipo: "Aplicação",

      texto: "Os operadores aritméticos em SQL podem ser usados diretamente nas colunas do SELECT para calcular novos valores sem modificar os dados originais. É comum usar o alias AS para dar um nome ao resultado calculado. A precedência segue a matemática padrão: parênteses têm prioridade sobre multiplicação e divisão, que têm prioridade sobre soma e subtração.",

      question: "Uma empresa quer calcular o salário anual de cada empregado, somando um bônus fixo de R$ 500 ao salário mensal antes de multiplicar por 12. Qual expressão SQL está correta?",

      options: [
        "SELECT salario * 12 + 500 AS salario_anual FROM empregados;",
        "SELECT 12 * (salario + 500) AS salario_anual FROM empregados;",
        "SELECT (salario * 12) + 500 AS salario_anual FROM empregados;",
        "SELECT salario + 500 AS salario_anual * 12 FROM empregados;"
      ],

      answer: 1,

      feedback: "Os ==mark==parênteses== garantem que o bônus seja somado antes da multiplicação. Sem eles, a precedência matemática faria a multiplicação primeiro — alterando o resultado final."
    },

    // 18 - operadores lógicos
    {
      aula: "Aula 10 — Manipulando um Banco de Dados",
      tipo: "Aplicação",

      texto: "Os operadores lógicos AND, OR e NOT permitem combinar múltiplas condições em uma cláusula WHERE. O AND exige que todas as condições sejam verdadeiras — é mais restritivo. O OR aceita registros que satisfaçam ao menos uma condição — é mais amplo. O NOT inverte o resultado de uma condição.",

      question: "Um professor quer listar alunos que estejam matriculados na disciplina 'BD' E que tenham 4 créditos. Qual operador lógico deve ser usado e por quê?",

      options: [
        "OR, pois basta uma das condições ser verdadeira para o aluno aparecer.",
        "NOT, pois o professor quer excluir alunos de outras disciplinas.",
        "AND, pois ambas as condições precisam ser verdadeiras ao mesmo tempo.",
        "OR, pois o AND tornaria a consulta muito lenta em tabelas grandes."
      ],

      answer: 2,

      feedback: "O operador ==dml==AND== exige que todas as condições sejam verdadeiras simultaneamente. Como o professor quer alunos que atendam aos dois critérios ao mesmo tempo, AND é o operador correto."
    },

    // 19 - operador diferente
    {
      aula: "Aula 10 — Manipulando um Banco de Dados",
      tipo: "Explicativa",

      texto: "Os operadores de comparação em SQL são usados na cláusula WHERE para filtrar registros com base em condições. Entre eles, o operador <> significa 'diferente de' — equivalente ao != em outras linguagens. Outros operadores comuns são = (igual), > (maior), < (menor), >= (maior ou igual) e <= (menor ou igual).",

      question: "Um desenvolvedor quer buscar todos os produtos cujo estoque seja diferente de zero. Qual operador de comparação deve ser usado na condição WHERE?",

      options: [
        "WHERE estoque = 0",
        "WHERE estoque NOT 0",
        "WHERE estoque <> 0",
        "WHERE estoque != NULL"
      ],

      answer: 2,

      feedback: "O operador ==mark==<>== significa 'diferente de' em SQL padrão. Para buscar registros onde o estoque não seja zero, a condição correta é WHERE estoque <> 0."
    },

    // 20 - CRUD completo
    {
      aula: "Aula 10 — Manipulando um Banco de Dados",
      tipo: "Aplicação",

      texto: "No dia a dia do desenvolvimento com SQL, os quatro comandos DML — SELECT, INSERT, UPDATE e DELETE — formam o chamado CRUD (Create, Read, Update, Delete). Cada operação tem seu papel bem definido: SELECT lê, INSERT cria, UPDATE modifica e DELETE remove. Saber qual usar em cada situação é fundamental para manipular dados corretamente.",

      question: "Um sistema de biblioteca precisa registrar um novo livro, depois corrigir o título cadastrado errado e, por fim, remover um livro descartado do acervo. Qual sequência de comandos DML representa essas três ações, respectivamente?",

      options: [
        "SELECT → UPDATE → DELETE",
        "INSERT → UPDATE → DELETE",
        "INSERT → DELETE → UPDATE",
        "UPDATE → INSERT → DELETE"
      ],

      answer: 1,

      feedback: "==dml==INSERT== registra o novo livro, ==dml==UPDATE== corrige o título e ==dml==DELETE== remove o livro descartado. Essa sequência representa o fluxo clássico de manipulação de dados com DML."
    },

    // ── Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1 ──────────────────────────────────────────────

    // 21 - ordem execução SQL
    {
      aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
      tipo: "Explicativa",

      texto: "Em SQL, toda consulta começa definindo de onde os dados vêm. A cláusula FROM indica a tabela de origem, e a cláusula SELECT define quais colunas serão exibidas. Apesar de o SELECT aparecer primeiro no código, o banco de dados processa FROM antes de qualquer outra coisa — ele precisa saber a fonte dos dados antes de filtrar ou exibir qualquer coluna.",

      question: "Qual é a ordem real de execução em uma consulta SQL básica com SELECT, FROM e WHERE?",

      options: [
        "SELECT → FROM → WHERE",
        "FROM → WHERE → SELECT",
        "WHERE → SELECT → FROM",
        "SELECT → WHERE → FROM"
      ],

      answer: 1,

      feedback: "O banco executa FROM primeiro (define a tabela), depois WHERE (filtra os dados) e por último SELECT (exibe o resultado)."
    },

    // 22 - operador LIKE
    {
      aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
      tipo: "Aplicação",

      texto: "Imagine que você gerencia um sistema escolar e precisa encontrar todos os alunos cujo nome começa com a letra 'M'. Digitar o nome exato de cada um seria inviável. O operador LIKE resolve isso por meio de curingas: o símbolo % representa qualquer sequência de caracteres, e o _ representa exatamente um caractere. Assim, é possível fazer buscas flexíveis sem conhecer o valor completo.",

      question: "Qual cláusula retorna todos os alunos cujo nome começa com 'M'?",

      options: [
        "WHERE nome = 'M'",
        "WHERE nome LIKE 'M%'",
        "WHERE nome LIKE '%M'",
        "WHERE nome IN ('M')"
      ],

      answer: 1,

      feedback: "LIKE 'M%' significa: começa com 'M' seguido de qualquer sequência de caracteres. O % é o curinga que substitui zero ou mais caracteres."
    },

    // 23 - operador BETWEEN
    {
      aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
      tipo: "Contextualizada",

      texto: "O operador BETWEEN permite filtrar valores dentro de um intervalo, incluindo os extremos. É muito útil com datas e números. A expressão WHERE salario BETWEEN 3000 AND 6000 equivale a escrever WHERE salario >= 3000 AND salario <= 6000 — ambas retornam o mesmo resultado, mas o BETWEEN é mais legível e conciso. Isso é especialmente conveniente quando você precisa selecionar registros de um período específico.",

      question: "Qual consulta retorna alunos nascidos entre 1990 e 1999 (inclusive)?",

      options: [
        "WHERE dat_nasc > '1990-01-01' AND dat_nasc < '1999-12-31'",
        "WHERE dat_nasc BETWEEN '1990-01-01' AND '1999-12-31'",
        "WHERE dat_nasc IN ('1990-01-01', '1999-12-31')",
        "WHERE dat_nasc LIKE '199%'"
      ],

      answer: 1,

      feedback: "O BETWEEN inclui os valores extremos do intervalo, equivalendo a >= início AND <= fim. Perfeito para filtros de data e faixa numérica."
    },

    // 24 - IS NULL
    {
      aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
      tipo: "Contextualizada",

      texto: "Em bancos de dados, NULL é um valor especial que significa ausência de informação — não é zero, não é uma string vazia, é simplesmente desconhecido. Por isso, comparar campos com NULL usando = nunca funciona: a expressão WHERE email = NULL sempre retorna UNKNOWN, e nenhuma linha aparece. A forma correta é usar IS NULL para verificar se um campo não possui valor.",

      question: "Qual instrução retorna corretamente os alunos que não possuem e-mail cadastrado?",

      options: [
        "WHERE email = NULL",
        "WHERE email = ''",
        "WHERE email IS NULL",
        "WHERE email NOT EXISTS"
      ],

      answer: 2,

      feedback: "NULL não pode ser comparado com =. A forma correta é IS NULL, pois NULL representa ausência de valor — qualquer comparação com = retorna UNKNOWN."
    },

    // 25 - função COUNT
    {
      aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
      tipo: "Aplicação",

      texto: "As funções de agregação realizam cálculos sobre um conjunto de linhas e retornam um único valor resumido. A função COUNT(*) conta o total de registros retornados pela consulta. Ela é amplamente usada para saber quantos itens existem em uma tabela ou quantos atendem a uma condição. Por exemplo, SELECT COUNT(*) FROM pedidos WHERE status = 'pendente' retorna quantos pedidos ainda estão pendentes.",

      question: "Um gerente precisa saber quantos funcionários existem no departamento de TI. Qual função deve usar?",

      options: [
        "SUM(funcionario)",
        "AVG(departamento)",
        "COUNT(*)",
        "MIN(departamento)"
      ],

      answer: 2,

      feedback: "A função COUNT(*) conta o número de registros retornados pela consulta, sendo ideal para obter totais e quantidades."
    },

    // 26 - função AVG
    {
      aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
      tipo: "Explicativa",

      texto: "Além de contar registros, o SQL oferece funções para calcular valores numéricos sobre um conjunto de dados. SUM soma todos os valores de uma coluna, AVG calcula a média, MIN retorna o menor valor e MAX o maior. Essas funções são chamadas de funções de agregação porque agregam muitas linhas em um único resultado numérico.",

      question: "Qual função SQL retorna a média dos valores de uma coluna numérica?",

      options: [
        "SUM",
        "COUNT",
        "AVG",
        "MAX"
      ],

      answer: 2,

      feedback: "AVG (average) calcula a média aritmética dos valores de uma coluna. SUM soma, COUNT conta e MAX/MIN retornam extremos."
    },

    // 27 - GROUP BY uso
    {
      aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
      tipo: "Aplicação",

      texto: "Imagine que você precisa saber a média de créditos dos alunos por curso, e não de todos os alunos juntos. Para isso, usa-se o GROUP BY, que agrupa os registros com base nos valores de uma coluna. Cada grupo recebe o cálculo da função de agregação separadamente. Sem o GROUP BY, a função retornaria apenas um valor global para toda a tabela.",

      question: "Qual consulta calcula a média de créditos separada por curso?",

      options: [
        "SELECT AVG(credito) FROM alunos WHERE cod_curso;",
        "SELECT cod_curso, AVG(credito) FROM alunos GROUP BY cod_curso;",
        "SELECT cod_curso, AVG(credito) FROM alunos ORDER BY cod_curso;",
        "SELECT AVG(credito), cod_curso FROM alunos HAVING cod_curso;"
      ],

      answer: 1,

      feedback: "O GROUP BY cod_curso agrupa os registros por curso e aplica o AVG separadamente em cada grupo, gerando uma média por curso."
    },

    // 28 - GROUP BY regra
    {
      aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
      tipo: "Contextualizada",

      texto: "Ao usar GROUP BY, existe uma regra importante: toda coluna listada no SELECT que não esteja dentro de uma função de agregação (COUNT, SUM, AVG, etc.) deve obrigatoriamente aparecer na cláusula GROUP BY. Caso contrário, o banco de dados não sabe qual valor representar para aquele campo dentro de cada grupo.",

      question: "Por que a consulta abaixo está incorreta? SELECT nome, cod_curso, COUNT(*) FROM alunos GROUP BY cod_curso;",

      options: [
        "COUNT(*) não pode ser usado com GROUP BY",
        "A coluna 'nome' está no SELECT mas não está no GROUP BY",
        "GROUP BY deve vir antes do SELECT",
        "cod_curso não pode ser agrupado com COUNT"
      ],

      answer: 1,

      feedback: "A coluna nome está no SELECT mas não no GROUP BY nem dentro de função de agregação — isso viola a regra do agrupamento. O banco não sabe qual nome exibir para cada grupo."
    },

    // 29 - ORDER BY múltiplo
    {
      aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
      tipo: "Explicativa",

      texto: "A cláusula ORDER BY define a ordem em que os resultados serão exibidos. Por padrão, a ordenação é crescente (ASC), mas é possível usar DESC para ordem decrescente. Também é possível ordenar por múltiplas colunas: o banco ordena pela primeira, e em caso de empate, pela segunda, e assim por diante.",

      question: "O que a cláusula ORDER BY credito DESC, nome ASC faz?",

      options: [
        "Ordena por nome primeiro, e em caso de empate, por crédito",
        "Ordena por crédito de forma crescente e nome de forma decrescente",
        "Ordena por crédito de forma decrescente e, em empate, por nome crescente",
        "Filtra os registros com maior crédito e menor nome"
      ],

      answer: 2,

      feedback: "O ORDER BY com múltiplas colunas ordena pela primeira coluna indicada e usa as seguintes para desempate. DESC = decrescente, ASC = crescente."
    },

    // 30 - estrutura completa SQL
    {
      aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
      tipo: "Aplicação",

      texto: "Em uma consulta SQL completa, as cláusulas têm uma ordem específica que deve ser respeitada: primeiro o SELECT com as colunas, depois o FROM com a tabela, o WHERE para filtros, o GROUP BY para agrupamentos e o ORDER BY para ordenação. Misturar essa ordem causa erro de sintaxe. Conhecer essa sequência é essencial para escrever consultas corretas.",

      question: "Qual é a ordem correta das cláusulas em uma consulta SQL com todas as opções?",

      options: [
        "SELECT → WHERE → FROM → GROUP BY → ORDER BY",
        "FROM → SELECT → WHERE → ORDER BY → GROUP BY",
        "SELECT → FROM → WHERE → GROUP BY → ORDER BY",
        "WHERE → FROM → SELECT → GROUP BY → ORDER BY"
      ],

      answer: 2,

      feedback: "A estrutura correta é: SELECT → FROM → WHERE → GROUP BY → ORDER BY. Qualquer outra ordem gera erro de sintaxe no SQL."
    },

    // ── Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2 ──────────────────────────────────────────────

    // 31 - funções agregação
    {
      aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
      tipo: "Explicativa",

      texto: "As funções de agregação em SQL são usadas para resumir um conjunto de valores em um único resultado. Em vez de ver linha por linha, você obtém um número que representa todo o grupo — como a média de notas de uma turma, o total de vendas do mês ou a quantidade de clientes cadastrados. As principais funções são: AVG (média), SUM (soma), COUNT (contagem), MAX (maior valor) e MIN (menor valor).",

      question: "Qual função de agregação deve ser usada para descobrir o maior salário registrado em uma tabela de funcionários?",

      options: [
        "AVG(salario), pois calcula o valor médio dos salários",
        "SUM(salario), pois soma todos os salários da tabela",
        "MAX(salario), pois retorna o maior valor da coluna",
        "COUNT(salario), pois conta quantos salários existem"
      ],

      answer: 2,

      feedback: "A função ==dml==MAX== retorna o maior valor presente em uma coluna. Para encontrar o menor, usaríamos MIN. AVG calcula média, SUM soma e COUNT conta registros."
    },

    // 32 - AVG com WHERE
    {
      aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
      tipo: "Aplicação",

      texto: "Imagine que você precisa calcular a média de créditos apenas dos alunos de um curso específico, sem misturar com alunos de outros cursos. Para isso, combina-se a função AVG com a cláusula WHERE: primeiro o banco filtra somente os alunos daquele curso, e depois calcula a média sobre esse subconjunto filtrado. É como separar as fichas antes de fazer a conta.",

      question: "Um analista quer saber a média de créditos dos alunos do curso de código 10. Qual consulta resolve isso corretamente?",

      code: `-- Opção A
    SELECT AVG(tot_cred) FROM alunos;

    -- Opção B
    SELECT AVG(tot_cred) FROM alunos WHERE cod_curso = 10;

    -- Opção C
    SELECT tot_cred FROM alunos WHERE cod_curso = 10;

    -- Opção D
    SELECT SUM(tot_cred) FROM alunos WHERE cod_curso = 10;`,

      options: [
        "Opção A, pois AVG já calcula a média geral automaticamente",
        "Opção B, pois filtra primeiro os alunos do curso 10 e então calcula a média",
        "Opção C, pois retorna os créditos de cada aluno do curso",
        "Opção D, pois soma os créditos dos alunos do curso 10"
      ],

      answer: 1,

      feedback: "A opção B está correta: o WHERE restringe os registros ao curso 10 antes de a função AVG calcular a média. Sem o WHERE, a média seria geral — de todos os cursos."
    },

    // 33 - alias AS
    {
      aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
      tipo: "Explicativa",

      texto: "Quando você usa uma função de agregação no SELECT, o banco de dados exibe o resultado com um cabeçalho pouco amigável, como 'AVG(tot_cred)'. Para melhorar isso, existe o operador AS, que permite dar um apelido (alias) ao resultado. É só uma questão de apresentação: o valor calculado continua o mesmo, mas o nome que aparece na coluna fica muito mais legível.",

      question: "O que acontece quando usamos AS na consulta `SELECT AVG(tot_cred) AS media_creditos FROM alunos`?",

      options: [
        "O banco cria uma nova coluna permanente chamada media_creditos na tabela alunos",
        "O valor calculado por AVG é alterado para coincidir com o nome media_creditos",
        "O resultado é exibido com o cabeçalho media_creditos no lugar de AVG(tot_cred)",
        "A consulta passa a calcular apenas os créditos de alunos chamados media_creditos"
      ],

      answer: 2,

      feedback: "O AS define apenas o rótulo da coluna no resultado da consulta, sem alterar os dados nem a estrutura da tabela. É um recurso puramente de apresentação."
    },

    // 34 - GROUP BY conceito
    {
      aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
      tipo: "Explicativa",

      texto: "A cláusula GROUP BY serve para dividir os registros de uma tabela em grupos antes de aplicar uma função de agregação. Sem ela, a agregação considera todos os registros como um único bloco. Com ela, cada grupo recebe seu próprio cálculo. Por exemplo: em vez de calcular a média geral de créditos de todos os alunos, você calcula a média separada para cada curso.",

      question: "Qual é a função principal da cláusula GROUP BY em uma consulta SQL?",

      options: [
        "Ordenar os registros em ordem crescente ou decrescente",
        "Filtrar os registros que não atendem a uma condição",
        "Dividir os registros em grupos para que a agregação seja calculada separadamente em cada um",
        "Eliminar valores duplicados do resultado da consulta"
      ],

      answer: 2,

      feedback: "O ==rule==GROUP BY== agrupa os registros por um critério definido, permitindo que funções como AVG, SUM e COUNT operem sobre cada grupo de forma independente."
    },

    // 35 - GROUP BY regra SELECT
    {
      aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
      tipo: "Contextualizada",

      texto: "O GROUP BY tem uma regra importante que costuma causar erro em quem está aprendendo: toda coluna que aparece no SELECT e não está dentro de uma função de agregação precisa, obrigatoriamente, estar também no GROUP BY. Isso porque o banco precisa saber como agrupar aquela coluna. Se ela não estiver no agrupamento, o banco não sabe qual valor exibir para o grupo — e retorna erro.",

      question: "Por que a consulta abaixo causaria um erro de execução?",

      code: `SELECT cod_curso, nome_aluno, AVG(credito)
    FROM alunos
    GROUP BY cod_curso;`,

      options: [
        "Porque AVG não pode ser usada junto com GROUP BY",
        "Porque nome_aluno aparece no SELECT mas não está no GROUP BY nem em função de agregação",
        "Porque cod_curso deveria estar dentro de uma função de agregação",
        "Porque WHERE é obrigatório quando se usa GROUP BY"
      ],

      answer: 1,

      feedback: "A coluna nome_aluno está no SELECT mas fora de qualquer função de agregação e ausente do GROUP BY. Isso viola a regra do agrupamento: o banco não consegue determinar qual nome exibir para cada grupo de curso."
    },

    // 36 - HAVING introdução
    {
      aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
      tipo: "Explicativa",

      texto: "Após agrupar registros com GROUP BY e calcular agregações, muitas vezes queremos filtrar apenas os grupos que atendem a algum critério — como mostrar só os cursos cuja média de créditos seja maior que 100. Para isso, existe o HAVING. Ele funciona como um WHERE, mas voltado para grupos: o WHERE filtra linhas antes do agrupamento, e o HAVING filtra grupos depois.",

      question: "Qual é a diferença fundamental entre WHERE e HAVING em uma consulta com GROUP BY?",

      options: [
        "WHERE filtra grupos após o agrupamento; HAVING filtra linhas antes",
        "WHERE e HAVING fazem a mesma coisa, mas HAVING é mais moderno",
        "WHERE filtra linhas individuais antes do agrupamento; HAVING filtra grupos depois da agregação",
        "HAVING só pode ser usado com a função COUNT; WHERE funciona com qualquer função"
      ],

      answer: 2,

      feedback: "WHERE atua sobre linhas antes de qualquer agrupamento. ==rule==HAVING== atua sobre os grupos já formados, podendo usar funções de agregação em sua condição — algo que o WHERE não permite."
    },

    // 37 - HAVING aplicação
    {
      aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
      tipo: "Aplicação",

      texto: "Você está analisando os dados de uma escola e precisa listar apenas as turmas cuja média de notas seja superior a 7. Primeiro os registros são agrupados por turma, depois a média é calculada para cada grupo, e só então os grupos com média abaixo de 7 são descartados. Esse descarte de grupos é feito exatamente pelo HAVING.",

      question: "Qual consulta implementa corretamente o filtro de turmas com média de notas acima de 7?",

      code: `-- Opção A
    SELECT turma, AVG(nota)
    FROM alunos
    WHERE AVG(nota) > 7
    GROUP BY turma;

    -- Opção B
    SELECT turma, AVG(nota)
    FROM alunos
    GROUP BY turma
    HAVING AVG(nota) > 7;

    -- Opção C
    SELECT turma, AVG(nota)
    FROM alunos
    HAVING AVG(nota) > 7;

    -- Opção D
    SELECT turma, AVG(nota)
    FROM alunos
    GROUP BY turma
    WHERE nota > 7;`,

      options: [
        "Opção A, pois WHERE pode filtrar por função de agregação",
        "Opção B, pois agrupa primeiro e depois filtra os grupos com HAVING",
        "Opção C, pois HAVING pode ser usado sem GROUP BY",
        "Opção D, pois WHERE filtra os grupos após o agrupamento"
      ],

      answer: 1,

      feedback: "A opção B está correta. Funções de agregação não podem ser usadas no WHERE — esse é um erro muito comum. O ==dml==HAVING== é o lugar certo para filtrar grupos após o agrupamento."
    },

    // 38 - NULL em agregação
    {
      aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
      tipo: "Contextualizada",

      texto: "Quando uma coluna possui registros com valor NULL, as funções de agregação têm um comportamento bem definido: elas simplesmente ignoram esses valores. Se uma tabela tem créditos de 100, NULL e 200, a função AVG calcula (100 + 200) / 2 = 150 — o NULL não entra na conta. A única exceção é COUNT(*), que conta todas as linhas, inclusive as que têm NULL em alguma coluna.",

      question: "Uma tabela de alunos possui os valores 100, NULL e 200 na coluna tot_cred. Qual será o resultado de `SELECT AVG(tot_cred) FROM alunos`?",

      options: [
        "133, pois AVG divide a soma por todos os registros, incluindo o NULL como zero",
        "150, pois AVG ignora o NULL e calcula a média apenas entre 100 e 200",
        "NULL, pois a presença de qualquer NULL torna o resultado indefinido",
        "0, pois o NULL é tratado como zero nas funções de agregação"
      ],

      answer: 1,

      feedback: "As funções de agregação ignoram NULL automaticamente. Por isso, AVG soma 100 + 200 e divide por 2, resultando em 150. Só COUNT(*) conta linhas com NULL — as demais funções as descartam."
    },

    // 39 - DISTINCT simples
    {
      aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
      tipo: "Explicativa",

      texto: "Quando consultamos uma coluna que tem muitos valores repetidos — como o código do curso de cada aluno — o resultado pode vir cheio de duplicatas. O DISTINCT resolve isso: ele elimina as repetições e exibe cada valor apenas uma vez. É importante saber que o DISTINCT age somente no resultado da consulta, sem apagar nada do banco de dados.",

      question: "O que o DISTINCT faz ao ser usado em `SELECT DISTINCT cod_curso FROM alunos`?",

      options: [
        "Remove permanentemente os registros duplicados da tabela alunos",
        "Exibe cada código de curso apenas uma vez no resultado, sem alterar a tabela",
        "Ordena os cursos em ordem crescente e remove os menores",
        "Conta quantas vezes cada código de curso aparece na tabela"
      ],

      answer: 1,

      feedback: "==proc==DISTINCT== age apenas na exibição do resultado, filtrando duplicatas sem modificar os dados armazenados. A tabela continua exatamente igual após a consulta."
    },

    // 40 - COUNT DISTINCT
    {
      aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
      tipo: "Aplicação",

      texto: "Às vezes, um aluno pode aparecer várias vezes em uma tabela de histórico — por exemplo, se cursou a mesma disciplina em anos diferentes. Se quisermos contar quantos alunos únicos cursaram determinada disciplina, não podemos usar COUNT simples, pois ele contaria o mesmo aluno mais de uma vez. A solução é combinar COUNT com DISTINCT: COUNT(DISTINCT mat_alu) conta cada matrícula apenas uma vez, independentemente de quantas vezes ela apareça.",

      question: "Por que usar `COUNT(DISTINCT mat_alu)` no lugar de `COUNT(mat_alu)` ao contar alunos únicos em um histórico escolar?",

      options: [
        "Porque COUNT(mat_alu) ignora os valores NULL, enquanto DISTINCT não ignora",
        "Porque COUNT(DISTINCT mat_alu) evita que o mesmo aluno seja contado mais de uma vez quando há registros repetidos",
        "Porque DISTINCT transforma a contagem em soma dos valores únicos encontrados",
        "Porque COUNT(mat_alu) só funciona com campos do tipo texto, e DISTINCT corrige isso"
      ],

      answer: 1,

      feedback: "COUNT(DISTINCT coluna) descarta duplicatas antes de contar, garantindo que cada valor único seja contabilizado apenas uma vez. É ideal para cenários com históricos ou registros repetidos de um mesmo elemento."
    },

    // ── Aula 13 - Consultas Aninhadas e Junções ──────────────────────────────────────────────

    // 41 - subconsulta definição
    {
      aula: "Aula 13 - Consultas Aninhadas e Junções",
      tipo: "Explicativa",

      texto: "Em SQL, é possível escrever uma consulta dentro de outra consulta. Essa técnica é chamada de consulta aninhada, subconsulta ou subquery. O resultado da consulta interna serve de base para a consulta externa, permitindo filtros mais sofisticados sem a necessidade de criar tabelas temporárias manualmente. As subconsultas aparecem com mais frequência nas cláusulas WHERE, HAVING e FROM.",

      question: "Qual é o nome dado a uma instrução SELECT que aparece dentro de outra instrução SELECT?",

      options: [
        "Junção interna",
        "Consulta aninhada",
        "Produto cartesiano",
        "Visão materializada"
      ],

      answer: 1,

      feedback: "Uma consulta dentro de outra consulta é chamada de consulta aninhada, subconsulta ou subquery. Ela permite usar o resultado de uma consulta como entrada para outra."
    },

    // 42 - tipo I características
    {
      aula: "Aula 13 - Consultas Aninhadas e Junções",
      tipo: "Explicativa",

      texto: "As subconsultas do ==type==Tipo I== executam apenas uma única vez, antes da consulta principal. Elas são independentes: não fazem nenhuma referência à consulta externa. O resultado gerado é como uma lista fixa que a consulta principal consulta em seguida. Por isso, são muito usadas com os operadores IN e NOT IN.",

      question: "Qual característica diferencia diretamente uma subconsulta Tipo I das demais?",

      options: [
        "Ela executa uma vez para cada linha da consulta externa",
        "Ela depende dos valores retornados pela consulta externa",
        "Ela executa apenas uma vez e não depende da consulta externa",
        "Ela só pode ser usada na cláusula FROM"
      ],

      answer: 2,

      feedback: "A subconsulta Tipo I executa uma única vez e de forma independente. Seu resultado é armazenado e depois usado pela consulta externa, geralmente com IN ou NOT IN."
    },

    // 43 - NOT IN diferença conjuntos
    {
      aula: "Aula 13 - Consultas Aninhadas e Junções",
      tipo: "Explicativa",

      texto: "O operador NOT IN funciona como uma operação de diferença entre conjuntos. Ele retorna apenas os registros da primeira tabela que não aparecem na segunda. É útil quando se quer encontrar elementos sem correspondência: cursos sem alunos, produtos sem vendas, ou funcionários sem departamento atribuído.",

      question: "Em qual situação o operador NOT IN é mais indicado?",

      options: [
        "Quando se quer combinar registros relacionados de duas tabelas",
        "Quando se quer encontrar registros que não possuem correspondência em outra tabela",
        "Quando se precisa calcular a média de um conjunto de valores",
        "Quando a subconsulta precisa executar várias vezes"
      ],

      answer: 1,

      feedback: "NOT IN implementa a lógica de diferença entre conjuntos: retorna os elementos da tabela principal que não aparecem no resultado da subconsulta."
    },

    // 44 - tipo II correlacionada
    {
      aula: "Aula 13 - Consultas Aninhadas e Junções",
      tipo: "Explicativa",

      texto: "As subconsultas do ==type==Tipo II== são chamadas de correlacionadas porque dependem diretamente da consulta externa. Ao contrário do Tipo I, elas não executam uma única vez: executam repetidamente, uma vez para cada linha que a consulta externa processa. Isso cria um comportamento semelhante a dois laços encaixados, onde o laço interno depende do valor atual do laço externo.",

      question: "Por que as subconsultas Tipo II são chamadas de correlacionadas?",

      options: [
        "Porque usam sempre o operador IN",
        "Porque executam apenas uma vez, antes da consulta externa",
        "Porque dependem dos valores da consulta externa e executam uma vez por linha",
        "Porque criam tabelas derivadas na cláusula FROM"
      ],

      answer: 2,

      feedback: "As subconsultas correlacionadas dependem da consulta externa e executam repetidamente, uma vez para cada linha processada pelo laço externo."
    },

    // 45 - EXISTS e NOT EXISTS
    {
      aula: "Aula 13 - Consultas Aninhadas e Junções",
      tipo: "Contextualizada",

      texto: "Nas subconsultas Tipo II, dois operadores são especialmente importantes: EXISTS e NOT EXISTS. O EXISTS retorna verdadeiro quando a subconsulta encontra pelo menos uma linha. O NOT EXISTS retorna verdadeiro quando a subconsulta não encontra nenhuma linha. Esses operadores são ideais para verificar a existência ou ausência de relacionamentos entre registros de tabelas diferentes.",

      question: "Qual operador deve ser usado quando se quer retornar registros da consulta externa apenas quando a subconsulta NÃO encontrar nenhuma correspondência?",

      options: [
        "IN",
        "EXISTS",
        "NOT EXISTS",
        "NOT IN aplicado no FROM"
      ],

      answer: 2,

      feedback: "NOT EXISTS retorna verdadeiro quando a subconsulta não encontra nenhuma linha. É o operador indicado para localizar registros sem correspondência em outra tabela."
    },

    // 46 - subconsulta no FROM
    {
      aula: "Aula 13 - Consultas Aninhadas e Junções",
      tipo: "Explicativa",

      texto: "Em SQL, toda consulta SELECT retorna uma tabela como resultado. Isso significa que é possível usar uma subconsulta diretamente na cláusula FROM, como se ela fosse uma tabela real. Esse tipo de subconsulta cria o que chamamos de tabela derivada ou visão inline. Para usá-la, é obrigatório atribuir um alias com AS.",

      question: "Qual nome é dado à tabela gerada por uma subconsulta usada dentro da cláusula FROM?",

      options: [
        "Tabela primária",
        "Tabela derivada ou visão inline",
        "Tabela estrangeira",
        "Produto cartesiano"
      ],

      answer: 1,

      feedback: "Quando uma subconsulta aparece na cláusula FROM, ela gera uma tabela temporária chamada tabela derivada ou visão inline, que deve receber um alias obrigatório."
    },

    // 47 - produto cartesiano
    {
      aula: "Aula 13 - Consultas Aninhadas e Junções",
      tipo: "Contextualizada",

      texto: "Quando duas tabelas são listadas na cláusula FROM sem nenhum critério de junção, o banco de dados combina cada linha da primeira tabela com cada linha da segunda. Esse resultado é chamado de produto cartesiano. O volume de linhas cresce rapidamente: se a tabela A tem 100 linhas e a tabela B tem 50, o produto cartesiano terá 5.000 linhas. Por isso, sempre se usa o WHERE para definir a relação entre as tabelas.",

      question: "O que acontece quando duas tabelas são combinadas no FROM sem nenhum filtro de relação?",

      options: [
        "Apenas os registros com correspondência são retornados",
        "O banco retorna somente os valores NULL",
        "Cada linha de uma tabela é combinada com cada linha da outra, gerando o produto cartesiano",
        "O SQL retorna um erro de sintaxe"
      ],

      answer: 2,

      feedback: "Sem um filtro de relação, o SQL combina todas as linhas de uma tabela com todas as linhas da outra, resultando no produto cartesiano, que pode gerar um volume muito grande de registros."
    },

    // 48 - INNER JOIN
    {
      aula: "Aula 13 - Consultas Aninhadas e Junções",
      tipo: "Aplicação",

      texto: "O INNER JOIN é a junção mais comum em SQL. Ele combina registros de duas tabelas com base em uma condição definida na cláusula ON, mas retorna apenas as linhas que possuem correspondência nos dois lados. Se um registro de uma tabela não tiver par na outra, ele simplesmente não aparece no resultado. É como a interseção entre dois conjuntos.",

      question: "Um sistema universitário precisa listar apenas os alunos que possuem um curso cadastrado. Qual tipo de junção é mais adequado?",

      options: [
        "LEFT JOIN",
        "FULL OUTER JOIN",
        "INNER JOIN",
        "RIGHT JOIN"
      ],

      answer: 2,

      feedback: "O INNER JOIN retorna somente os registros com correspondência nas duas tabelas. Alunos sem curso cadastrado não aparecem, pois não há par na tabela de cursos."
    },

    // 49 - LEFT JOIN
    {
      aula: "Aula 13 - Consultas Aninhadas e Junções",
      tipo: "Aplicação",

      texto: "O LEFT JOIN garante que todos os registros da tabela da esquerda sejam retornados, independentemente de existir correspondência na tabela da direita. Quando não há correspondência, os campos da tabela da direita aparecem preenchidos com NULL. Isso é útil quando se quer manter todos os registros de uma tabela mesmo que alguns não tenham relacionamento com a outra.",

      question: "Um relatório precisa listar todos os alunos, incluindo os que ainda não foram vinculados a nenhum curso. Qual junção preserva esses alunos no resultado?",

      options: [
        "INNER JOIN",
        "LEFT JOIN",
        "RIGHT JOIN",
        "FULL OUTER JOIN"
      ],

      answer: 1,

      feedback: "O LEFT JOIN mantém todos os registros da tabela esquerda. Para alunos sem curso, os campos do curso aparecem como NULL, mas o aluno continua presente no resultado."
    },

    // 50 - FULL OUTER JOIN
    {
      aula: "Aula 13 - Consultas Aninhadas e Junções",
      tipo: "Contextualizada",

      texto: "O ==type==FULL OUTER JOIN== é a junção mais abrangente disponível em SQL. Ele retorna todos os registros das duas tabelas, independentemente de existir correspondência entre elas. Onde houver par, os dados aparecem completos. Onde não houver, os campos da tabela sem correspondência ficam com NULL. É como realizar um LEFT JOIN e um RIGHT JOIN ao mesmo tempo.",

      question: "Em qual situação o FULL OUTER JOIN é mais indicado em relação aos demais tipos de junção?",

      options: [
        "Quando se quer apenas os registros com correspondência nos dois lados",
        "Quando se quer todos os registros de ambas as tabelas, com ou sem correspondência",
        "Quando se quer apenas os registros sem correspondência na tabela da esquerda",
        "Quando a consulta precisa executar uma subconsulta correlacionada"
      ],

      answer: 1,

      feedback: "O FULL OUTER JOIN retorna todos os registros das duas tabelas. Registros sem par ficam com NULL nos campos da tabela oposta, combinando o comportamento do LEFT e RIGHT JOIN."
    }
  ],


  enade: [
// aula: Aula 9 — Definindo um Banco de Dados

// 1 - integridade referencial
{
  tipo: "Asserção + Justificativa",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 2 - comandos DDL
{
  tipo: "Múltiplas afirmativas",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 3 - CREATE TABLE e chaves
{
  tipo: "Análise de código SQL",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 4 - CASCADE e RESTRICT
{
  tipo: "Conceitual",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 5 - ALTER TABLE
{
  tipo: "Asserção + Justificativa",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 6 - tipos de dados
{
  tipo: "Múltiplas afirmativas",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 7 - ALTER TABLE script
{
  tipo: "Análise de código SQL",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 8 - DROP DATABASE
{
  tipo: "Asserção + Justificativa",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 9 - PRIMARY KEY e FOREIGN KEY
{
  tipo: "Múltiplas afirmativas",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 10 - DROP TABLE com dependências
{
  tipo: "Análise de código SQL",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// aula: Aula 10 — Manipulando um Banco de Dados

// 11 - INSERT sem colunas
{
  tipo: "Asserção + Justificativa",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  conteudo: "DML — Linguagem de Manipulação de Dados em SQL",
  texto: "Uma equipe de desenvolvimento de um sistema de RH percebeu que vários registros de funcionários estavam sendo inseridos sem o campo de departamento preenchido. Ao investigar, o analista constatou que o comando INSERT utilizado não especificava as colunas de destino, o que gerava inconsistências nos dados armazenados.",
  question: "Analise as asserções a seguir e a relação proposta entre elas:",
  assertions: [
    "Ao utilizar ==dml==INSERT INTO tabela VALUES (...)== sem especificar os nomes das colunas, os valores informados devem corresponder exatamente à ordem e ao tipo de todas as colunas definidas na tabela.",
    "[PORQUE] A sintaxe do ==dml==INSERT== sem lista de colunas exige que o banco de dados associe cada valor posicionalmente à estrutura completa da tabela, não permitindo omissões sem causar erro ou inconsistência."
  ],
  options: [
    "As asserções I e II são verdadeiras, e II justifica I",
    "As asserções I e II são verdadeiras, mas II não justifica I",
    "A asserção I é verdadeira e a II é falsa",
    "A asserção I é falsa e a II é verdadeira"
  ],
  answer: 0,
  feedback: "Correto: A. Quando o ==dml==INSERT== não lista as colunas, o banco espera valores para **todas** as colunas na ordem exata de criação da tabela (I). A asserção II justifica diretamente esse comportamento, explicando o mecanismo posicional que fundamenta a restrição."
},

// 12 - DELETE
{
  tipo: "Múltiplas afirmativas",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  conteudo: "DML — Linguagem de Manipulação de Dados em SQL",
  texto: "Um professor de banco de dados pediu que os alunos avaliassem afirmativas sobre o comando DELETE em SQL. O objetivo era verificar se eles compreendiam a diferença entre excluir registros com e sem cláusula WHERE, além das características do comando em relação à estrutura da tabela.",
  question: "Avalie as afirmativas a seguir sobre o comando ==dml==DELETE== em SQL:",
  assertions: [
    "O comando ==dml==DELETE FROM tabela== sem a cláusula ==rule==WHERE== remove todos os registros da tabela, mas preserva a estrutura (colunas, restrições e índices).",
    "O comando ==dml==DELETE== pode remover uma coluna específica de um registro, desde que o nome da coluna seja informado após a palavra-chave DELETE.",
    "A cláusula ==rule==WHERE== no ==dml==DELETE== permite filtrar quais registros serão removidos, garantindo precisão na exclusão dos dados.",
    "O ==dml==DELETE== pertence à DML e, portanto, opera sobre os dados da tabela, não sobre sua estrutura."
  ],
  questionContinuation: "São corretas apenas as afirmativas:",
  options: [
    "I, III e IV, apenas",
    "I e III, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "Correto: A (I, III e IV). A afirmativa II está **errada**: o ==dml==DELETE== remove **linhas inteiras** — nunca colunas isoladas. Para remover uma coluna, utiliza-se o ==ddl==ALTER TABLE==. As demais afirmativas descrevem corretamente o comportamento do DELETE sem WHERE, o papel do WHERE e a categorização do comando na **DML**."
},

// 13 - UPDATE e SELECT script
{
  tipo: "Análise de código SQL",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  conteudo: "DML — Linguagem de Manipulação de Dados em SQL",
  texto: "Durante o desenvolvimento de um sistema de cursos online, um analista executou os seguintes comandos SQL para manipular os dados das tabelas `alunos` e `cursos`:",
  question: "Avalie as afirmativas sobre o script a seguir:",
  code:
`UPDATE cursos
SET nome = 'SI - Sistemas de Informação'
WHERE codigo = 11;

UPDATE empregados
SET salario = salario * 1.10;

DELETE FROM alunos
WHERE matricula = 911113;

SELECT nome, salario, 12 * (salario + 500)
FROM empregados;`,
  assertions: [
    "O primeiro ==dml==UPDATE== altera apenas o registro cujo `codigo` é igual a 11, pois a cláusula ==rule==WHERE== restringe o escopo da atualização.",
    "O segundo ==dml==UPDATE== aplica um reajuste de 10% no salário de **todos** os empregados, pois não possui cláusula ==warn==WHERE==.",
    "O ==dml==DELETE== remove apenas a coluna `matricula` do aluno com matrícula 911113, mantendo os demais dados do registro.",
    "A expressão `12 * (salario + 500)` no ==dml==SELECT== calcula o salário anual considerando um bônus mensal de 500, com os parênteses garantindo a precedência correta da operação."
  ],
  questionContinuation: "São corretas as afirmativas:",
  options: [
    "I, II e IV, apenas",
    "I e IV, apenas",
    "II e III, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "Correto: A (I, II e IV). A afirmativa III está **errada**: o ==dml==DELETE== remove a **linha inteira** do aluno — não apenas uma coluna. Para remover a coluna, seria necessário ==ddl==ALTER TABLE==. As afirmativas I (WHERE restritivo), II (UPDATE sem WHERE afeta todos) e IV (precedência dos parênteses) estão corretas."
},

// 14 - precedência de operadores
{
  tipo: "Asserção + Justificativa",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  conteudo: "DML — Linguagem de Manipulação de Dados em SQL",
  texto: "Um analista de sistemas precisava gerar um relatório de salários anuais dos empregados, considerando um bônus fixo mensal de R$ 500,00. Ele escreveu a seguinte expressão na cláusula SELECT: `12 * salario + 500`. O gerente revisou e apontou que o resultado estava incorreto para a maioria dos registros.",
  question: "Analise as asserções a seguir e a relação proposta entre elas:",
  assertions: [
    "A expressão `12 * salario + 500` **não** calcula corretamente o salário anual com bônus mensal, pois a multiplicação tem precedência sobre a soma, resultando em `(12 * salario) + 500` em vez de `12 * (salario + 500)`.",
    "[PORQUE] Em SQL, assim como na matemática, os operadores aritméticos seguem uma ==rule==ordem de precedência== em que multiplicação e divisão são avaliadas antes de adição e subtração, podendo o uso de parênteses alterar essa ordem."
  ],
  options: [
    "As asserções I e II são verdadeiras, e II justifica I",
    "As asserções I e II são verdadeiras, mas II não justifica I",
    "A asserção I é verdadeira e a II é falsa",
    "A asserção I é falsa e a II é verdadeira"
  ],
  answer: 0,
  feedback: "Correto: A. A expressão sem parênteses aplica o bônus de 500 apenas uma vez ao total anual, não mensalmente (I). A asserção II justifica exatamente isso: a ==rule==precedência de operadores== em SQL faz com que `*` seja avaliado antes de `+`, e parênteses são a solução para forçar a ordem desejada."
},

// 15 - operadores lógicos
{
  tipo: "Múltiplas afirmativas",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  conteudo: "DML — Linguagem de Manipulação de Dados em SQL",
  texto: "Em uma aula prática de banco de dados, os alunos precisavam montar consultas SQL usando operadores lógicos para filtrar registros de uma tabela de disciplinas. O professor avaliou as respostas verificando a compreensão dos operadores AND, OR e NOT.",
  question: "Avalie as afirmativas a seguir sobre os ==proc==operadores lógicos== em SQL:",
  assertions: [
    "O operador ==rule==AND== retorna apenas os registros em que **todas** as condições combinadas são verdadeiras, tornando o filtro mais restritivo.",
    "O operador ==rule==OR== retorna registros em que **pelo menos uma** das condições é verdadeira, tornando o filtro mais amplo que o AND.",
    "O operador ==rule==NOT== é equivalente ao operador ==rule==AND== com condição negada, produzindo sempre o mesmo resultado em qualquer contexto.",
    "A consulta `WHERE credito = 4 AND disciplina = 'BD'` retorna apenas registros em que **ambas** as condições são satisfeitas simultaneamente."
  ],
  questionContinuation: "São corretas apenas as afirmativas:",
  options: [
    "I, II e IV, apenas",
    "I e II, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "Correto: A (I, II e IV). A afirmativa III está **errada**: ==rule==NOT== **inverte** uma condição individualmente (ex: `NOT disciplina = 'BD'`), enquanto ==rule==AND== combina duas condições exigindo que ambas sejam verdadeiras — são operadores com funções e semânticas distintas, não equivalentes. As afirmativas I, II e IV descrevem corretamente o comportamento dos operadores lógicos."
},

// 16 - SELECT DISTINCT
{
  tipo: "Conceitual",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  conteudo: "DML — Linguagem de Manipulação de Dados em SQL",
  texto: "Em um sistema de gestão acadêmica, o administrador precisava gerar uma lista de alunos sem repetição de nomes, já que vários alunos homônimos geravam duplicatas nos relatórios. Ele questionou a equipe sobre qual recurso SQL deveria ser usado para eliminar os valores repetidos no resultado da consulta.",
  question: "Assinale a alternativa que descreve corretamente o uso do ==proc==SELECT DISTINCT== em SQL:",
  options: [
    "==proc==SELECT DISTINCT== remove fisicamente os registros duplicados da tabela, garantindo que apenas uma ocorrência de cada valor permaneça armazenada.",
    "==proc==SELECT DISTINCT== elimina linhas duplicadas **apenas no resultado da consulta**, sem alterar os dados armazenados na tabela.",
    "==proc==SELECT DISTINCT== é equivalente ao uso de ==rule==WHERE== com operador de igualdade, pois ambos filtram registros com base em valores específicos.",
    "==proc==SELECT DISTINCT== só pode ser aplicado a colunas do tipo texto (VARCHAR ou CHAR), não sendo compatível com colunas numéricas."
  ],
  answer: 1,
  feedback: "Correto: B. O ==proc==SELECT DISTINCT== age **apenas no resultado da consulta**, suprimindo linhas duplicadas na exibição sem modificar os dados físicos do banco. Ele não remove dados, não é equivalente ao WHERE e funciona com qualquer tipo de dado — numérico, texto ou data."
},

// 17 - UPDATE script análise
{
  tipo: "Análise de código SQL",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  conteudo: "DML — Linguagem de Manipulação de Dados em SQL",
  texto: "Uma analista de dados de uma empresa de varejo recebeu a tarefa de corrigir e analisar uma série de comandos SQL escritos por um estagiário. Ela identificou inconsistências no uso do UPDATE e precisava apontar quais comandos produziriam os resultados esperados.",
  question: "Analise o script SQL e avalie as afirmativas:",
  code:
`-- Comando A
UPDATE produtos
SET preco = preco * 1.05
WHERE categoria = 'Eletronicos';

-- Comando B
UPDATE produtos
SET preco = 0;

-- Comando C
UPDATE produtos
SET preco = 150.00, estoque = 0
WHERE cod_produto = 37;

-- Comando D
UPDATE produtos
SET WHERE preco > 100;`,
  assertions: [
    "O Comando A aplica um reajuste de 5% apenas nos produtos da categoria 'Eletrônicos', graças à cláusula ==rule==WHERE== que restringe o escopo.",
    "O Comando B zerará o preço de **todos** os produtos da tabela, pois não possui cláusula ==warn==WHERE==.",
    "O Comando C atualiza corretamente duas colunas ao mesmo tempo para o produto de código 37, usando ==proc==SET== com separação por vírgula.",
    "O Comando D possui sintaxe válida em SQL padrão e filtrará corretamente os produtos com preço acima de 100."
  ],
  questionContinuation: "São corretas as afirmativas:",
  options: [
    "I, II e III, apenas",
    "I e III, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "Correto: A (I, II e III). O Comando D possui **sintaxe inválida**: não é possível usar ==rule==WHERE== sem a cláusula ==proc==SET== devidamente preenchida — a instrução `UPDATE ... SET WHERE` não especifica o que alterar. Os comandos A, B e C estão sintaticamente corretos, embora B seja perigoso por alterar todos os registros."
},

// 18 - DELETE sem WHERE
{
  tipo: "Asserção + Justificativa",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  conteudo: "DML — Linguagem de Manipulação de Dados em SQL",
  texto: "Em um sistema de folha de pagamento, um desenvolvedor júnior executou o comando `DELETE FROM funcionarios` sem adicionar nenhuma condição. Imediatamente após a execução, percebeu o erro e tentou desfazer a operação acessando o banco diretamente — mas os dados não estavam mais acessíveis. O incidente foi registrado como falha crítica.",
  question: "Analise as asserções a seguir e a relação proposta entre elas:",
  assertions: [
    "O comando ==warn==DELETE FROM funcionarios== sem cláusula ==rule==WHERE== remove **todos os registros** da tabela `funcionarios`, esvaziando completamente seu conteúdo.",
    "[PORQUE] Na linguagem ==proc==DML==, o ==warn==DELETE== sem filtro opera sobre o conjunto completo de linhas da tabela, pois a ausência do ==rule==WHERE== é interpretada como uma condição sempre verdadeira para todos os registros."
  ],
  options: [
    "As asserções I e II são verdadeiras, e II justifica I",
    "As asserções I e II são verdadeiras, mas II não justifica I",
    "A asserção I é verdadeira e a II é falsa",
    "A asserção I é falsa e a II é verdadeira"
  ],
  answer: 0,
  feedback: "Correto: A. O ==warn==DELETE== sem WHERE apaga todos os registros (I), e a asserção II explica o mecanismo por trás disso: a ausência de ==rule==WHERE== equivale a uma condição universalmente verdadeira, fazendo o comando agir sobre **todas as linhas** da tabela. A II justifica I de forma direta e precisa."
},

// 19 - estrutura SELECT
{
  tipo: "Múltiplas afirmativas",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  conteudo: "DML — Linguagem de Manipulação de Dados em SQL",
  texto: "Em uma prova prática de banco de dados, os alunos precisavam identificar as características da estrutura básica de uma consulta SQL com SELECT, FROM e WHERE. O professor avaliava tanto o conhecimento sintático quanto o entendimento semântico de cada cláusula.",
  question: "Avalie as afirmativas a seguir sobre a estrutura de uma consulta ==proc==SELECT==:",
  assertions: [
    "A cláusula ==proc==FROM== indica a tabela (ou tabelas) de onde os dados serão recuperados, sendo obrigatória em toda consulta SQL que acesse dados de tabelas.",
    "A cláusula ==rule==WHERE== é obrigatória em toda consulta ==proc==SELECT==; sem ela, o banco de dados retorna um erro de sintaxe.",
    "A cláusula ==proc==SELECT== define **quais colunas** serão exibidas no resultado da consulta, podendo incluir expressões aritméticas e aliases.",
    "É possível escrever `SELECT * FROM tabela` para retornar **todas as colunas** da tabela sem precisar listá-las individualmente."
  ],
  questionContinuation: "São corretas apenas as afirmativas:",
  options: [
    "I, III e IV, apenas",
    "I e III, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "Correto: A (I, III e IV). A afirmativa II está **errada**: a cláusula ==rule==WHERE== é **opcional** — sua ausência não gera erro; apenas significa que nenhum filtro será aplicado e todos os registros serão retornados. As afirmativas I (FROM obrigatório), III (SELECT define colunas e aceita expressões) e IV (SELECT * retorna todas as colunas) estão corretas."
},

// 20 - INSERT variações
{
  tipo: "Análise de código SQL",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  conteudo: "DML — Linguagem de Manipulação de Dados em SQL",
  texto: "Uma empresa de e-commerce precisava inserir novos produtos no banco de dados. O analista responsável escreveu quatro variações do comando INSERT para testes, e a equipe precisava identificar quais estavam sintaticamente corretas e quais poderiam causar erros.",
  question: "Analise os comandos INSERT a seguir e avalie as afirmativas:",
  code:
`-- Inserção 1
INSERT INTO produtos VALUES (101, 'Notebook', 3500.00);

-- Inserção 2
INSERT INTO produtos (cod_produto, descricao)
VALUES (102, 'Mouse');

-- Inserção 3
INSERT INTO produtos (descricao, cod_produto)
VALUES (103, 'Teclado');

-- Inserção 4
INSERT INTO produtos (cod_produto, descricao, preco)
VALUES (104, 'Monitor');`,
  assertions: [
    "A Inserção 1 só será executada corretamente se a tabela `produtos` possuir exatamente 3 colunas na mesma ordem: `cod_produto`, `descricao` e `preco`.",
    "A Inserção 2 é válida desde que as colunas não listadas aceitem valores `NULL` ou possuam valor `DEFAULT` definido.",
    "A Inserção 3 causará erro pois os valores estão na ordem errada: o número 103 será inserido na coluna `descricao` (texto) e 'Teclado' em `cod_produto` (inteiro).",
    "A Inserção 4 é válida pois lista 3 colunas e fornece 3 valores, satisfazendo a correspondência entre colunas e valores."
  ],
  questionContinuation: "São corretas as afirmativas:",
  options: [
    "I, II e III, apenas",
    "I e II, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "Correto: A (I, II e III). A afirmativa IV está **errada**: a Inserção 4 lista 3 colunas (`cod_produto`, `descricao`, `preco`) mas fornece apenas **2 valores** — há uma incompatibilidade entre a quantidade de colunas e valores, o que causará erro de sintaxe. As afirmativas I (posicionamento obrigatório), II (colunas omitidas aceitam NULL/DEFAULT) e III (tipos incompatíveis causam erro) estão corretas."
},

// aula: Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1

// 21 - cláusula WHERE
{
  tipo: "Conceitual contextualizada",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  conteudo: "Refinamento de Consultas em SQL",
  texto: "Uma empresa de logística mantém um banco de dados com milhares de registros de entregas. A equipe de análise precisa consultar apenas as entregas realizadas para um determinado cliente, evitando carregar todos os dados desnecessariamente.",
  question: "Considerando a estrutura de uma consulta SQL e a necessidade de restringir os dados retornados, qual cláusula deve ser utilizada para aplicar essa ==def==filtragem==?",
  options: [
    "GROUP BY, pois organiza os registros por critério definido",
    "ORDER BY, pois seleciona apenas os registros relevantes",
    "WHERE, pois permite definir uma condição que os registros devem satisfazer",
    "SELECT, pois determina quais colunas serão exibidas no resultado"
  ],
  answer: 2,
  feedback: "Correto: C. A cláusula **WHERE** é responsável por ==def==filtrar== os registros retornados, selecionando apenas aqueles que satisfazem a condição especificada. SELECT define colunas, ORDER BY ordena e GROUP BY agrupa — nenhum desses restringe linhas diretamente."
},

// 22 - operador LIKE
{
  tipo: "Análise aplicada",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  conteudo: "Refinamento de Consultas em SQL",
  texto: "Um sistema de gestão universitária permite que a secretaria busque alunos pelo nome, mesmo sem digitá-lo por completo. A consulta deve retornar todos os alunos cujo sobrenome contenha a palavra 'Santos', independentemente do que venha antes ou depois.",
  question: "Qual das consultas abaixo atende corretamente a esse requisito?",
  code: `-- Opção A
SELECT * FROM alunos WHERE nome LIKE 'Santos';

-- Opção B
SELECT * FROM alunos WHERE nome LIKE '%Santos%';

-- Opção C
SELECT * FROM alunos WHERE nome LIKE 'Santos%';

-- Opção D
SELECT * FROM alunos WHERE nome LIKE '_Santos';`,
  options: [
    "Opção A, pois busca pelo nome exato 'Santos'",
    "Opção B, pois o uso de % antes e depois localiza 'Santos' em qualquer posição do texto",
    "Opção C, pois retorna registros que começam com 'Santos'",
    "Opção D, pois o _ substitui qualquer sequência de caracteres antes de 'Santos'"
  ],
  answer: 1,
  feedback: "Correto: B. O operador ==dml==LIKE== com `'%Santos%'` utiliza o curinga `%` em ambos os lados, localizando a sequência 'Santos' em qualquer posição da string. A opção C retornaria apenas nomes que *começam* com Santos, e `_` representa exatamente 1 caractere, não uma sequência."
},

// 23 - operador BETWEEN
{
  tipo: "Asserção + Justificativa",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  conteudo: "Refinamento de Consultas em SQL",
  texto: "Uma analista de RH precisa listar todos os funcionários nascidos entre 1985 e 1994. Ela utiliza o operador BETWEEN para construir a condição na cláusula WHERE.",
  question: "Analise as afirmativas a seguir sobre o comportamento do ==rule==BETWEEN==:",
  assertions: [
    "I. A condição `WHERE dat_nasc BETWEEN '1985-01-01' AND '1994-12-31'` é equivalente a `dat_nasc >= '1985-01-01' AND dat_nasc <= '1994-12-31'`, incluindo os limites do intervalo.",
    "[PORQUE] II. O operador BETWEEN é exclusivo, ou seja, não inclui os valores dos extremos definidos."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 2,
  feedback: "Correto: C. A afirmativa I está **correta**: BETWEEN é inclusivo e equivale ao uso de >= e <=. A afirmativa II está ==warn==errada==, pois afirma que BETWEEN exclui os extremos — o que é uma armadilha conceitual comum. BETWEEN sempre inclui os valores limite."
},

// 24 - operador IN
{
  tipo: "Múltiplas afirmativas",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  conteudo: "Refinamento de Consultas em SQL",
  texto: "Em um sistema de controle acadêmico, um professor deseja consultar informações de três alunos específicos cujas matrículas são 922155, 926465 e 915550. Ele considera diferentes formas de construir essa consulta.",
  question: "Avalie as afirmativas abaixo sobre o uso do operador ==rule==IN==:",
  assertions: [
    "I. A cláusula `WHERE mat_alu IN (922155, 926465, 915550)` retorna os registros cujos valores de mat_alu correspondem a qualquer um dos valores listados.",
    "II. O operador IN é funcionalmente equivalente ao encadeamento de condições com OR para cada valor da lista.",
    "III. O operador IN não pode ser usado com valores do tipo texto, sendo restrito a campos numéricos.",
    "IV. Utilizar IN com uma lista extensa de valores pode ser substituído por uma subconsulta para maior legibilidade."
  ],
  options: [
    "I, II e IV, apenas",
    "I e III, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "Correto: A. As afirmativas **I, II e IV** são verdadeiras. O ==dml==IN== aceita listas de qualquer tipo compatível com o campo, inclusive texto — portanto, III está errada. A afirmativa IV reflete boa prática com subconsultas quando a lista é dinâmica."
},

// 25 - IS NULL
{
  tipo: "Conceitual contextualizada",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  conteudo: "Refinamento de Consultas em SQL",
  texto: "Durante uma auditoria de dados em um sistema hospitalar, a equipe identificou que alguns pacientes não possuem e-mail cadastrado. Para localizar esses registros, um desenvolvedor escreveu a seguinte consulta: `SELECT * FROM pacientes WHERE email = NULL`. Porém, a consulta não retornou nenhum resultado, mesmo havendo registros sem e-mail.",
  question: "Qual é a explicação correta para o comportamento inesperado da consulta?",
  options: [
    "A consulta está correta, mas a tabela não possui registros com e-mail vazio",
    "O operador = não pode ser usado com NULL, pois comparações com NULL resultam em UNKNOWN; a forma correta é `IS NULL`",
    "NULL é equivalente a uma string vazia, e por isso a condição deveria ser `WHERE email = ''`",
    "A cláusula WHERE não suporta comparações com campos do tipo texto"
  ],
  answer: 1,
  feedback: "Correto: B. O ==warn==NULL== não pode ser comparado com `=`, pois qualquer comparação com NULL retorna **UNKNOWN** — nem verdadeiro nem falso — e o WHERE só retorna registros com condição verdadeira. A sintaxe correta é ==rule==IS NULL==. NULL também não equivale a string vazia ou zero."
},

// 26 - funções de agregação
{
  tipo: "Análise aplicada",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  conteudo: "Refinamento de Consultas em SQL",
  texto: "Uma loja virtual quer analisar seu desempenho de vendas. O banco de dados possui uma tabela `pedidos` com os campos: `id_pedido`, `valor_total` e `status`. A gerência solicita um relatório com: total de pedidos realizados, soma dos valores, e o maior e menor valor de pedido.",
  question: "Qual consulta retorna corretamente todas essas informações em uma única instrução?",
  code: `-- Opção A
SELECT COUNT(*), SUM(valor_total), MAX(valor_total), MIN(valor_total)
FROM pedidos;

-- Opção B
SELECT COUNT(id_pedido), AVG(valor_total), valor_total
FROM pedidos;

-- Opção C
SELECT SUM(*), COUNT(valor_total), MAX(*), MIN(*)
FROM pedidos;

-- Opção D
SELECT COUNT(*), SUM(valor_total)
FROM pedidos
GROUP BY valor_total;`,
  options: [
    "Opção A",
    "Opção B",
    "Opção C",
    "Opção D"
  ],
  answer: 0,
  feedback: "Correto: A. A ==dml==COUNT(*)== conta todos os registros, ==dml==SUM== soma os valores, e MAX/MIN retornam os extremos. A opção B inclui `valor_total` fora de agregação sem GROUP BY. A opção C usa `SUM(*)` e `MAX(*)`, que são sintaxes inválidas. A opção D agrupa por valor, o que distorce o relatório."
},

// 27 - GROUP BY regras
{
  tipo: "Asserção + Justificativa",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  conteudo: "Refinamento de Consultas em SQL",
  texto: "Um desenvolvedor está criando um relatório que exibe a média de créditos por curso em uma universidade. Ele escreve a seguinte consulta: `SELECT cod_curso, nome_aluno, AVG(credito) FROM alunos GROUP BY cod_curso`. Ao executar, o banco de dados retorna um erro.",
  question: "Analise as afirmativas sobre a regra do ==rule==GROUP BY==:",
  assertions: [
    "I. A consulta está incorreta porque `nome_aluno` aparece no SELECT sem estar no GROUP BY nem dentro de uma função de agregação.",
    "[PORQUE] II. Todo campo presente no SELECT que não seja uma função de agregação deve obrigatoriamente aparecer na cláusula GROUP BY."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "Correto: A. Ambas as afirmativas são **verdadeiras** e II justifica I. A ==rule==regra do GROUP BY== exige que campos não agregados no SELECT estejam presentes no agrupamento. `nome_aluno` não está em nenhuma função agregada nem no GROUP BY, causando o erro."
},

// 28 - ORDER BY
{
  tipo: "Múltiplas afirmativas",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  conteudo: "Refinamento de Consultas em SQL",
  texto: "Um sistema de biblioteca precisa exibir livros ordenados por data de publicação (do mais recente para o mais antigo) e, em caso de empate na data, por título em ordem alfabética crescente.",
  question: "Sobre o uso do ==dml==ORDER BY== para atender esse requisito, avalie:",
  assertions: [
    "I. A cláusula ORDER BY pode receber múltiplas colunas como critério de ordenação.",
    "II. O padrão de ordenação, quando não especificado, é ASC (crescente).",
    "III. A consulta `ORDER BY data_pub DESC, titulo ASC` atende ao requisito descrito.",
    "IV. O ORDER BY é executado antes do WHERE na ordem interna de processamento do SQL."
  ],
  options: [
    "I, II e III, apenas",
    "I e III, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "Correto: A. As afirmativas I, II e III são **verdadeiras**. O ==dml==ORDER BY== suporta múltiplas colunas e o padrão é ASC. A afirmativa IV está ==warn==errada==: ORDER BY é processado após FROM, WHERE, GROUP BY e SELECT — é a última etapa da execução lógica."
},

// 29 - ordem de execução SQL
{
  tipo: "Conceitual contextualizada",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  conteudo: "Refinamento de Consultas em SQL",
  texto: "Durante uma aula de banco de dados, o professor explica que a ordem em que escrevemos uma consulta SQL não corresponde à ordem em que o banco de dados a executa internamente. Um aluno fica confuso sobre qual cláusula é processada primeiro.",
  question: "Considerando a ordem real de ==rule==execução lógica== de uma consulta SQL com SELECT, FROM, WHERE, GROUP BY e ORDER BY, qual sequência está correta?",
  options: [
    "SELECT → FROM → WHERE → GROUP BY → ORDER BY",
    "FROM → WHERE → GROUP BY → SELECT → ORDER BY",
    "WHERE → FROM → SELECT → GROUP BY → ORDER BY",
    "FROM → SELECT → WHERE → ORDER BY → GROUP BY"
  ],
  answer: 1,
  feedback: "Correto: B. A ordem lógica de execução é: **FROM** (define a fonte), ==rule==WHERE== (filtra linhas), **GROUP BY** (agrupa), **SELECT** (projeta colunas) e **ORDER BY** (ordena o resultado final). Compreender essa sequência é essencial para escrever consultas corretas e evitar erros de referência."
},

// 30 - LIKE curingas
{
  tipo: "Análise aplicada",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  conteudo: "Refinamento de Consultas em SQL",
  texto: "Um sistema de RH armazena nomes de colaboradores. A equipe precisa encontrar todos cujo nome tenha exatamente a letra 'u' na segunda posição, independentemente do restante do nome.",
  question: "Qual padrão no operador ==dml==LIKE== atende corretamente a esse critério?",
  code: `-- Analise as opções:
-- A: WHERE nome LIKE '%u%'
-- B: WHERE nome LIKE '_u%'
-- C: WHERE nome LIKE 'u_%'
-- D: WHERE nome LIKE '__u%'`,
  options: [
    "WHERE nome LIKE '%u%', pois localiza 'u' em qualquer posição",
    "WHERE nome LIKE '_u%', pois _ representa exatamente 1 caractere antes de 'u'",
    "WHERE nome LIKE 'u_%', pois começa com 'u' seguido de qualquer caractere",
    "WHERE nome LIKE '__u%', pois posiciona 'u' na terceira posição"
  ],
  answer: 1,
  feedback: "Correto: B. O curinga ==rule==_== (underscore) representa exatamente **1 caractere**. Portanto, `'_u%'` garante que o primeiro caractere seja qualquer um e o segundo seja 'u', com qualquer sequência após. A opção A busca 'u' em qualquer posição; C exige 'u' na primeira posição; D posiciona 'u' na terceira."
},

// aula: Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2

// 31 - AVG básico
{
  tipo: "Conceitual contextualizada",
  aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
  conteudo: "Funções de Agregação em SQL",
  texto: "Um coordenador pedagógico precisa calcular a média geral de créditos totais dos alunos matriculados no curso de código 10. Ele não quer ver os registros individuais — apenas o valor médio resultante para subsidiar um relatório de desempenho acadêmico.",
  question: "Qual consulta SQL retorna corretamente a média dos créditos totais apenas dos alunos do curso 10?",
  code:
`-- Opção A
SELECT AVG(tot_cred)
FROM alunos
WHERE cod_curso = 10;

-- Opção B
SELECT SUM(tot_cred)
FROM alunos
WHERE cod_curso = 10;

-- Opção C
SELECT AVG(tot_cred)
FROM alunos
GROUP BY cod_curso;

-- Opção D
SELECT COUNT(tot_cred)
FROM alunos
WHERE cod_curso = 10;`,
  options: [
    "Opção A, pois aplica AVG sobre os registros filtrados pelo curso 10",
    "Opção B, pois SUM calcula o valor acumulado dos créditos",
    "Opção C, pois GROUP BY separa os cursos e calcula a média de cada um",
    "Opção D, pois COUNT retorna a quantidade de registros com crédito"
  ],
  answer: 0,
  feedback: "Correto: A. A função ==dml==AVG== calcula a média de uma coluna, e a cláusula WHERE restringe o cálculo apenas aos alunos do curso 10. A opção C calcula a média por curso, mas retorna todos os cursos — não apenas o 10. SUM e COUNT respondem perguntas diferentes: soma total e contagem de registros, respectivamente."
},

// 32 - alias AS
{
  tipo: "Asserção + Justificativa",
  aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
  conteudo: "Funções de Agregação em SQL",
  texto: "Durante a elaboração de relatórios automáticos em um sistema de gestão acadêmica, um desenvolvedor percebeu que os cabeçalhos das colunas calculadas apareciam como expressões brutas — por exemplo, 'AVG(tot_cred)' — tornando os relatórios pouco legíveis para os coordenadores. Ele adicionou o operador AS para resolver o problema.",
  question: "Analise as asserções a seguir e a relação proposta entre elas:",
  assertions: [
    "O uso de ==dml==AS== em uma consulta SQL permite renomear colunas calculadas no resultado, tornando o cabeçalho mais legível sem alterar os dados retornados.",
    "[PORQUE] O operador ==dml==AS== é um alias de apresentação: ele modifica apenas o rótulo exibido na saída da consulta, não afetando o processamento interno nem os valores calculados pela função de agregação."
  ],
  options: [
    "As asserções I e II são verdadeiras, e II justifica I",
    "As asserções I e II são verdadeiras, mas II não justifica I",
    "A asserção I é verdadeira e a II é falsa",
    "A asserção I é falsa e a II é verdadeira"
  ],
  answer: 0,
  feedback: "Correto: A. O ==dml==AS== renomeia colunas apenas na exibição do resultado (I), e a asserção II justifica exatamente isso ao explicar que se trata de um alias de apresentação — sem impacto nos dados ou no cálculo. A relação de justificativa entre as asserções é direta e precisa."
},

// 33 - GROUP BY agrupamento
{
  tipo: "Análise de código SQL",
  aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
  conteudo: "Funções de Agregação em SQL",
  texto: "Uma universidade quer gerar um relatório com a média de créditos totais por curso. O banco de dados possui a tabela `alunos` com os campos `cod_curso` e `tot_cred`. O analista escreveu a seguinte consulta:",
  question: "Avalie as afirmativas sobre a consulta abaixo:",
  code:
`SELECT cod_curso, AVG(tot_cred) AS media_tot_cred
FROM alunos
GROUP BY cod_curso;`,
  assertions: [
    "A consulta está sintaticamente correta: `cod_curso` aparece no SELECT e também no GROUP BY, respeitando a regra de agrupamento.",
    "Sem a cláusula GROUP BY, a mesma consulta calcularia a média geral de todos os alunos, independente do curso.",
    "A cláusula GROUP BY divide os registros em subconjuntos por valor de `cod_curso` antes de aplicar a função AVG a cada grupo.",
    "O alias `media_tot_cred` substitui o valor calculado por um texto fixo, impedindo que os valores numéricos sejam exibidos."
  ],
  questionContinuation: "São corretas as afirmativas:",
  options: [
    "I, II e III, apenas",
    "I e III, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "Correto: A (I, II e III). A afirmativa IV está **errada**: o alias ==dml==AS== renomeia apenas o cabeçalho da coluna — não substitui nem oculta os valores numéricos retornados. As demais descrevem corretamente o funcionamento do ==rule==GROUP BY== e o comportamento da consulta com e sem agrupamento."
},

// 34 - HAVING vs WHERE
{
  tipo: "Conceitual contextualizada",
  aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
  conteudo: "Funções de Agregação em SQL",
  texto: "Uma analista de dados precisa identificar quais cursos possuem média de créditos totais superior a 100. Ela já sabe que deve usar GROUP BY para agrupar por curso, mas tem dúvida sobre onde aplicar o filtro sobre a média: na cláusula WHERE ou na cláusula HAVING.",
  question: "Qual alternativa descreve corretamente a diferença entre ==rule==WHERE== e ==rule==HAVING== nesse contexto?",
  options: [
    "WHERE e HAVING produzem o mesmo resultado quando aplicados a funções de agregação, diferindo apenas na posição dentro da consulta.",
    "WHERE filtra linhas antes do agrupamento e não aceita funções de agregação; HAVING filtra grupos após o agrupamento e aceita funções de agregação.",
    "HAVING substitui completamente o WHERE em consultas com GROUP BY, tornando o WHERE desnecessário.",
    "WHERE filtra grupos com base em funções de agregação; HAVING filtra linhas individualmente antes da agregação."
  ],
  answer: 1,
  feedback: "Correto: B. ==rule==WHERE== atua sobre linhas individuais antes do agrupamento e não pode receber funções de agregação como `AVG()`. ==rule==HAVING== atua sobre grupos após o agrupamento e é o local correto para filtros baseados em funções agregadas. As demais alternativas invertem ou confundem os papéis das duas cláusulas."
},

// 35 - HAVING script
{
  tipo: "Análise de código SQL",
  aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
  conteudo: "Funções de Agregação em SQL",
  texto: "Um sistema de controle acadêmico precisa listar apenas os cursos cuja média de créditos totais dos alunos seja superior a 100. O analista escreveu a seguinte consulta para atender a esse requisito:",
  question: "Avalie as afirmativas sobre o script SQL a seguir:",
  code:
`SELECT cod_curso, AVG(tot_cred) AS media_tot_cred
FROM alunos
GROUP BY cod_curso
HAVING AVG(tot_cred) > 100;`,
  assertions: [
    "A cláusula HAVING filtra os grupos formados pelo GROUP BY, retornando apenas os cursos cuja média de créditos supera 100.",
    "Seria possível substituir o HAVING por WHERE nessa consulta, pois ambos filtram registros com base em condições numéricas.",
    "A consulta respeita a ordem correta das cláusulas SQL: FROM, GROUP BY, HAVING, SELECT.",
    "Caso nenhum curso tenha média superior a 100, a consulta retorna um resultado vazio, sem erro de execução."
  ],
  questionContinuation: "São corretas as afirmativas:",
  options: [
    "I e IV, apenas",
    "I, II e IV, apenas",
    "II e III, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "Correto: A (I e IV). A afirmativa II está **errada**: usar ==rule==WHERE== com função de agregação como `AVG()` causa erro de sintaxe — WHERE não aceita funções agregadas. A afirmativa III está **errada**: a ordem de escrita correta é FROM → WHERE → GROUP BY → HAVING → SELECT, mas a *execução lógica* é diferente da escrita — e a consulta apresentada está escrita corretamente, não na ordem de execução. As afirmativas I e IV descrevem comportamentos corretos do ==rule==HAVING==."
},

// 36 - NULL em agregação
{
  tipo: "Asserção + Justificativa",
  aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
  conteudo: "Funções de Agregação em SQL",
  texto: "Uma equipe de auditoria percebeu que a média calculada pela função AVG em uma coluna de créditos estava diferente do esperado. Ao investigar, descobriram que vários registros possuíam o valor NULL nessa coluna. O engenheiro de dados explicou que esse comportamento era esperado pelo padrão SQL.",
  question: "Analise as asserções a seguir e a relação proposta entre elas:",
  assertions: [
    "A função ==dml==AVG== ignora automaticamente os valores NULL no cálculo da média, considerando apenas os registros com valores não nulos.",
    "[PORQUE] As funções de agregação SQL — exceto ==dml==COUNT(*)== — descartam valores NULL antes de processar os dados, pois NULL representa ausência de valor e não pode participar de operações aritméticas com resultado determinístico."
  ],
  options: [
    "As asserções I e II são verdadeiras, e II justifica I",
    "As asserções I e II são verdadeiras, mas II não justifica I",
    "A asserção I é verdadeira e a II é falsa",
    "A asserção I é falsa e a II é verdadeira"
  ],
  answer: 0,
  feedback: "Correto: A. AVG ignora NULLs (I), e a asserção II justifica esse comportamento explicando a regra geral das funções de agregação: todas descartam NULL, exceto **COUNT(*)** que conta linhas independentemente. A distinção entre `COUNT(*)` e `COUNT(coluna)` é um ponto-chave: o segundo também ignora NULLs."
},

// 37 - COUNT variações
{
  tipo: "Múltiplas afirmativas",
  aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
  conteudo: "Funções de Agregação em SQL",
  texto: "Um desenvolvedor está elaborando relatórios sobre uma tabela `historicos_escolares` que contém os campos `mat_alu`, `cod_disc`, `ano` e `nota`. Alguns alunos cursaram a mesma disciplina mais de uma vez em anos diferentes, e alguns registros possuem o campo `nota` preenchido com NULL.",
  question: "Avalie as afirmativas a seguir sobre as variações do ==dml==COUNT==:",
  assertions: [
    "COUNT(*) retorna o número total de linhas da tabela ou do grupo, incluindo aquelas com valores NULL em qualquer coluna.",
    "COUNT(nota) retorna apenas a quantidade de registros em que o campo `nota` possui valor não nulo, ignorando os NULLs.",
    "COUNT(DISTINCT mat_alu) conta o número de matrículas únicas, evitando que o mesmo aluno seja contabilizado mais de uma vez.",
    "COUNT(DISTINCT *) é uma sintaxe válida e equivalente ao uso de SELECT DISTINCT antes da contagem."
  ],
  questionContinuation: "São corretas apenas as afirmativas:",
  options: [
    "I, II e III, apenas",
    "I e III, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "Correto: A (I, II e III). A afirmativa IV está **errada**: ==dml==COUNT(DISTINCT *)== é uma sintaxe **inválida** em SQL — não é possível combinar DISTINCT com o curinga `*` dentro de COUNT. As afirmativas I, II e III descrevem corretamente os três comportamentos distintos do COUNT: total de linhas, valores não nulos e valores únicos."
},

// 38 - DISTINCT simples
{
  tipo: "Conceitual contextualizada",
  aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
  conteudo: "Funções de Agregação em SQL",
  texto: "Um sistema de gestão acadêmica armazena na tabela `alunos` o código do curso de cada aluno. Como muitos alunos pertencem ao mesmo curso, a coluna `cod_curso` apresenta vários valores repetidos. O coordenador solicita uma lista com os códigos de curso existentes, sem repetições.",
  question: "Qual é o comportamento correto do ==proc==SELECT DISTINCT== ao ser aplicado nesse cenário?",
  options: [
    "SELECT DISTINCT remove permanentemente os registros duplicados da tabela `alunos`, mantendo apenas uma linha por curso.",
    "SELECT DISTINCT elimina as linhas repetidas apenas no resultado da consulta, sem alterar os dados armazenados na tabela.",
    "SELECT DISTINCT é equivalente ao GROUP BY cod_curso em todos os contextos, podendo ser usado de forma intercambiável.",
    "SELECT DISTINCT só funciona corretamente quando combinado com ORDER BY, pois depende da ordenação para identificar duplicatas."
  ],
  answer: 1,
  feedback: "Correto: B. O ==proc==SELECT DISTINCT== age exclusivamente sobre o **resultado da consulta**, suprimindo linhas duplicadas na exibição sem modificar os dados físicos da tabela. Embora DISTINCT e GROUP BY possam produzir resultados similares em alguns casos, não são intercambiáveis em todos os contextos — especialmente quando há funções de agregação envolvidas."
},

// 39 - ordem execução completa
{
  tipo: "Múltiplas afirmativas",
  aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
  conteudo: "Funções de Agregação em SQL",
  texto: "Em uma prova prática de banco de dados, o professor apresentou a seguinte consulta e pediu que os alunos identificassem a ordem real de execução lógica e o papel de cada cláusula:",
  question: "Avalie as afirmativas sobre a ordem de execução lógica da consulta abaixo:",
  code:
`SELECT cod_curso, AVG(tot_cred) AS media
FROM alunos
WHERE email IS NOT NULL
GROUP BY cod_curso
HAVING AVG(tot_cred) > 80
ORDER BY cod_curso ASC;`,
  assertions: [
    "A cláusula WHERE é executada antes do GROUP BY, filtrando alunos sem e-mail antes que o agrupamento seja formado.",
    "A cláusula HAVING é executada antes do WHERE, pois atua sobre os grupos, que são formados antes da filtragem de linhas.",
    "A cláusula SELECT é executada após o GROUP BY e o HAVING, projetando apenas as colunas e expressões definidas.",
    "A cláusula ORDER BY é a última a ser executada na ordem lógica, ordenando o resultado final após todas as demais operações."
  ],
  questionContinuation: "São corretas apenas as afirmativas:",
  options: [
    "I, III e IV, apenas",
    "I e IV, apenas",
    "II e III, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "Correto: A (I, III e IV). A afirmativa II está **errada**: a ordem lógica correta é FROM → ==rule==WHERE== → GROUP BY → HAVING → SELECT → ORDER BY. O WHERE filtra *antes* do agrupamento, e o HAVING filtra *depois*. Inverter essa ordem é um erro conceitual clássico. As demais afirmativas descrevem corretamente os papéis de WHERE, SELECT e ORDER BY na sequência de execução."
},

// 40 - consulta integrada HAVING
{
  tipo: "Análise de código SQL",
  aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
  conteudo: "Funções de Agregação em SQL",
  texto: "Uma analista de dados recebeu a tarefa de identificar erros em quatro variações de uma consulta que deveria retornar os cursos com média de créditos superior a 80, considerando apenas alunos com e-mail cadastrado.",
  question: "Analise os scripts e avalie as afirmativas:",
  code:
`-- Script 1
SELECT cod_curso, AVG(tot_cred)
FROM alunos
WHERE email IS NOT NULL
GROUP BY cod_curso
HAVING AVG(tot_cred) > 80;

-- Script 2
SELECT cod_curso, AVG(tot_cred)
FROM alunos
WHERE email IS NOT NULL AND AVG(tot_cred) > 80
GROUP BY cod_curso;

-- Script 3
SELECT cod_curso, AVG(tot_cred)
FROM alunos
GROUP BY cod_curso
HAVING AVG(tot_cred) > 80
WHERE email IS NOT NULL;

-- Script 4
SELECT cod_curso, COUNT(DISTINCT mat_alu)
FROM alunos
WHERE email IS NOT NULL
GROUP BY cod_curso
HAVING COUNT(DISTINCT mat_alu) > 5;`,
  assertions: [
    "O Script 1 está correto: filtra alunos sem e-mail antes do agrupamento via WHERE, e filtra grupos com média insuficiente via HAVING.",
    "O Script 2 causará erro pois funções de agregação como AVG não são permitidas na cláusula WHERE.",
    "O Script 3 está correto pois WHERE e HAVING podem aparecer em qualquer ordem após o GROUP BY.",
    "O Script 4, embora use COUNT(DISTINCT) no lugar de AVG, é sintaticamente válido e retornaria os cursos com mais de 5 alunos únicos com e-mail cadastrado."
  ],
  questionContinuation: "São corretas as afirmativas:",
  options: [
    "I, II e IV, apenas",
    "I e II, apenas",
    "II e III, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "Correto: A (I, II e IV). A afirmativa III está **errada**: o Script 3 coloca WHERE após o ==rule==HAVING==, violando a ordem obrigatória das cláusulas SQL — WHERE deve sempre preceder GROUP BY e HAVING. Isso causa erro de sintaxe. Os Scripts 1 e 4 são válidos e funcionais, e o Script 2 comete o erro clássico de usar ==dml==AVG== dentro do WHERE, o que é proibido."
},

// aula: Aula 13 - Consultas Aninhadas e Junções

// 41 - subconsulta Tipo I
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Análise aplicada",
  texto: "Uma equipe de desenvolvimento precisa recuperar dados de alunos que obtiveram média maior ou igual a 7 no ano de 2001, cruzando informações entre as tabelas 'alunos' e 'historicos_escolares'. O desenvolvedor responsável optou por utilizar uma subconsulta na cláusula WHERE para resolver o problema.",
  question: "Analise o trecho de código abaixo e assinale a alternativa que descreve corretamente o comportamento da consulta:",
  code: `SELECT nom_alu, cod_curso, tot_cred
FROM alunos
WHERE mat_alu IN (
  SELECT mat_alu
  FROM historicos_escolares
  WHERE media >= 7 AND ano = 2001
);`,
  options: [
    "A subconsulta executa repetidamente para cada linha da consulta externa, pois depende dos valores da tabela 'alunos'.",
    "A subconsulta executa uma única vez, retornando um conjunto de matrículas que é reutilizado pela consulta principal.",
    "O operador IN é substituível por EXISTS sem qualquer alteração no resultado ou no comportamento de execução.",
    "A consulta retorna todos os alunos da tabela 'alunos', independentemente de seus registros em 'historicos_escolares'."
  ],
  answer: 1,
  feedback: "Correto: B. Este é um exemplo clássico de ==ddl==subconsulta Tipo I==: ela executa apenas uma vez, de forma independente da consulta externa, gerando um conjunto de resultados que é então consumido pelo operador ==dml==IN==. Diferente da Tipo II (correlacionada), aqui não há referência à tabela externa dentro da subconsulta."
},

// 42 - Tipo I vs Tipo II
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Asserção + Justificativa",
  texto: "Em bancos de dados relacionais, as subconsultas podem ser classificadas em dois tipos principais com comportamentos distintos de execução. Compreender essa diferença é fundamental para prever o desempenho de uma consulta em cenários com grandes volumes de dados.",
  question: "Avalie a asserção e a justificativa a seguir sobre ==ddl==subconsultas correlacionadas==:",
  assertions: [
    "I. Uma subconsulta do Tipo II (correlacionada) executa uma vez para cada linha processada pela consulta externa.",
    "[PORQUE] II. A subconsulta correlacionada referencia colunas da consulta externa, criando uma dependência que impede sua execução isolada."
  ],
  options: [
    "As afirmativas I e II são verdadeiras, e II justifica I.",
    "As afirmativas I e II são verdadeiras, mas II não justifica I.",
    "A afirmativa I é verdadeira e a II é falsa.",
    "A afirmativa I é falsa e a II é verdadeira."
  ],
  answer: 0,
  feedback: "Correto: A. Ambas são verdadeiras e a II justifica a I. Exatamente porque a subconsulta ==ddl==correlacionada== referencia valores da consulta externa, ela precisa ser reavaliada a cada linha, tornando sua execução repetida uma consequência direta dessa dependência."
},

// 43 - operador NOT IN
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Conceitual contextualizada",
  texto: "Em um sistema acadêmico, o setor de planejamento precisa identificar quais cursos não possuem nenhum aluno vinculado. Para isso, um analista de dados propõe duas abordagens distintas usando SQL: uma com NOT IN e outra com NOT EXISTS. Ambas buscam o mesmo resultado, mas diferem em funcionamento interno.",
  question: "Sobre o operador ==dml==NOT IN== aplicado a subconsultas, assinale a alternativa correta:",
  options: [
    "NOT IN e NOT EXISTS sempre produzem resultados idênticos, inclusive quando existem valores NULL na subconsulta.",
    "NOT IN realiza uma operação equivalente à diferença entre conjuntos, retornando registros da tabela principal ausentes no resultado da subconsulta.",
    "NOT IN é uma variação do INNER JOIN e depende da existência de chaves estrangeiras para funcionar corretamente.",
    "NOT IN executa a subconsulta múltiplas vezes, tornando-o mais eficiente que NOT EXISTS em grandes volumes de dados."
  ],
  answer: 1,
  feedback: "Correto: B. O operador ==dml==NOT IN== implementa conceitualmente uma diferença de conjuntos (Tabela A − Tabela B), retornando apenas os elementos da consulta principal que não aparecem no resultado da subconsulta. Atenção: quando a subconsulta pode retornar valores ==danger==NULL==, o comportamento do NOT IN pode ser inesperado — nenhuma linha é retornada, pois NULL não é comparável diretamente."
},

// 44 - subconsulta no FROM
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Múltiplas afirmativas",
  texto: "Um desenvolvedor está construindo um relatório de desempenho acadêmico. Para modularizar a lógica e evitar repetição de código, ele decide utilizar uma subconsulta dentro da cláusula FROM, criando uma tabela derivada com as médias calculadas por curso. Essa técnica é conhecida como visão inline.",
  question: "Sobre o uso de ==ddl==subconsultas na cláusula FROM==, avalie as afirmativas:",
  assertions: [
    "I. Uma subconsulta no FROM gera uma tabela temporária chamada tabela derivada, que pode ser referenciada na consulta externa por meio de um alias.",
    "II. O uso de funções agregadas como AVG ou COUNT dentro de subconsultas no FROM geralmente exige o uso de GROUP BY para agrupar os resultados corretamente.",
    "III. Subconsultas no FROM executam repetidamente para cada linha da consulta externa, assim como as subconsultas correlacionadas.",
    "IV. A técnica de subconsulta no FROM favorece a legibilidade e a modularização das consultas SQL."
  ],
  options: [
    "I, II e IV, apenas.",
    "I e III, apenas.",
    "II e III, apenas.",
    "I, II, III e IV."
  ],
  answer: 0,
  feedback: "Correto: A. As afirmativas I, II e IV são verdadeiras. A III é falsa: subconsultas no FROM não são correlacionadas — elas executam uma única vez e geram uma ==ddl==tabela derivada== estática. O comportamento de execução repetida é exclusivo das subconsultas ==type==Tipo II (correlacionadas)==."
},

// 45 - INNER JOIN
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Análise aplicada",
  texto: "Em um sistema de gestão universitária, as tabelas 'alunos' e 'cursos' estão relacionadas pela chave estrangeira 'cod_curso'. Alguns alunos foram cadastrados sem curso definido (cod_curso NULL), e alguns cursos não possuem alunos vinculados. Um relatório precisa listar apenas os alunos que possuem curso válido cadastrado.",
  question: "Qual tipo de junção deve ser utilizado para retornar ==key==somente os registros com correspondência nas duas tabelas==?",
  code: `SELECT a.nom_alu, c.nom_curso
FROM alunos a
________ cursos c
ON a.cod_curso = c.cod_curso;`,
  options: [
    "LEFT JOIN, pois garante que todos os alunos sejam retornados, inclusive os sem curso.",
    "FULL OUTER JOIN, pois combina todos os registros de ambas as tabelas.",
    "INNER JOIN, pois retorna apenas os registros com correspondência nas duas tabelas.",
    "RIGHT JOIN, pois prioriza os registros da tabela 'cursos'."
  ],
  answer: 2,
  feedback: "Correto: C. O ==dml==INNER JOIN== funciona como a interseção entre dois conjuntos: retorna apenas os registros que possuem correspondência válida nas duas tabelas. Alunos com cod_curso ==danger==NULL== e cursos sem alunos são excluídos do resultado, que é exatamente o comportamento desejado no cenário."
},

// 46 - LEFT JOIN comportamento
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Asserção + Justificativa",
  texto: "Um analista precisa gerar uma lista completa de todos os alunos, incluindo aqueles que ainda não foram associados a nenhum curso. Para isso, ele utiliza LEFT JOIN entre as tabelas 'alunos' (esquerda) e 'cursos' (direita).",
  question: "Avalie a asserção e a justificativa sobre o comportamento do ==dml==LEFT JOIN==:",
  assertions: [
    "I. Quando um aluno não possui curso correspondente na tabela 'cursos', os campos relacionados ao curso são preenchidos com NULL no resultado.",
    "[PORQUE] II. O LEFT JOIN preserva todos os registros da tabela à esquerda, independentemente de existir correspondência na tabela à direita."
  ],
  options: [
    "As afirmativas I e II são verdadeiras, e II justifica I.",
    "As afirmativas I e II são verdadeiras, mas II não justifica I.",
    "A afirmativa I é verdadeira e a II é falsa.",
    "A afirmativa I é falsa e a II é verdadeira."
  ],
  answer: 0,
  feedback: "Correto: A. O ==dml==LEFT JOIN== garante que todos os registros da tabela esquerda sejam mantidos. Quando não há correspondência na direita, os campos ausentes recebem ==danger==NULL==. A afirmativa II explica diretamente o porquê do comportamento descrito em I."
},

// 47 - RIGHT JOIN vs LEFT JOIN
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Conceitual contextualizada",
  texto: "Durante uma revisão de código, dois desenvolvedores discutem a equivalência entre RIGHT JOIN e LEFT JOIN. Um deles afirma que é sempre possível reescrever um RIGHT JOIN como um LEFT JOIN simplesmente invertendo a ordem das tabelas na cláusula FROM. O outro discorda, alegando que os tipos de junção têm comportamentos fundamentalmente diferentes.",
  question: "Sobre a relação entre ==dml==RIGHT JOIN== e ==dml==LEFT JOIN==, assinale a alternativa correta:",
  options: [
    "RIGHT JOIN e LEFT JOIN são completamente distintos e não podem produzir resultados equivalentes em nenhuma situação.",
    "Um RIGHT JOIN pode ser reescrito como LEFT JOIN invertendo a ordem das tabelas, pois ambos preservam todos os registros de uma das tabelas envolvidas.",
    "RIGHT JOIN sempre retorna mais registros que LEFT JOIN, pois considera as duas tabelas simultaneamente.",
    "A diferença entre RIGHT e LEFT JOIN está apenas na sintaxe; internamente, o banco de dados executa a mesma operação."
  ],
  answer: 1,
  feedback: "Correto: B. O ==dml==RIGHT JOIN== preserva todos os registros da tabela à direita, enquanto o ==dml==LEFT JOIN== preserva os da esquerda. Como a lógica é simétrica, inverter a ordem das tabelas em um LEFT JOIN produz o mesmo resultado que um RIGHT JOIN. Essa equivalência é amplamente aceita e utilizada na prática."
},

// 48 - FULL OUTER JOIN
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Múltiplas afirmativas",
  texto: "Um relatório de auditoria acadêmica precisa consolidar informações de duas tabelas: 'alunos' e 'cursos'. O objetivo é identificar tanto alunos sem curso associado quanto cursos sem alunos matriculados, exibindo NULL nos campos sem correspondência.",
  question: "Sobre o ==dml==FULL OUTER JOIN==, avalie as afirmativas:",
  assertions: [
    "I. O FULL OUTER JOIN retorna todos os registros de ambas as tabelas, preenchendo com NULL os campos sem correspondência em qualquer um dos lados.",
    "II. O FULL OUTER JOIN pode ser considerado a união entre um LEFT JOIN e um RIGHT JOIN aplicados sobre as mesmas tabelas.",
    "III. Registros sem correspondência em nenhuma das tabelas são ignorados pelo FULL OUTER JOIN, assim como no INNER JOIN.",
    "IV. O FULL OUTER JOIN é útil para identificar inconsistências de dados entre tabelas relacionadas."
  ],
  options: [
    "I, II e III, apenas.",
    "I, II e IV, apenas.",
    "II e IV, apenas.",
    "I, II, III e IV."
  ],
  answer: 1,
  feedback: "Correto: B. As afirmativas I, II e IV são verdadeiras. A III é falsa: o ==dml==FULL OUTER JOIN== não ignora registros sem correspondência — esse é exatamente o comportamento do ==dml==INNER JOIN==. O FULL OUTER JOIN faz o oposto: inclui todos os registros, dos dois lados, com ==danger==NULL== onde não houver match."
},

// 49 - produto cartesiano
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Análise aplicada",
  texto: "Um desenvolvedor júnior escreveu a seguinte consulta para listar alunos e seus cursos em um sistema acadêmico. Ao executar a consulta, percebeu que o resultado continha muito mais linhas do que o esperado, com combinações sem sentido entre alunos e cursos.",
  question: "Analise o código abaixo e identifique a causa do problema:",
  code: `SELECT a.nom_alu, c.nom_curso
FROM alunos a, cursos c;`,
  options: [
    "A consulta está incorreta sintaticamente e não deveria ser executada pelo banco de dados.",
    "A ausência de uma cláusula WHERE com a condição de junção gerou um produto cartesiano, combinando cada aluno com cada curso.",
    "O problema é que a consulta usa vírgula no FROM em vez de JOIN, o que impede qualquer tipo de junção.",
    "O resultado excessivo ocorre porque a tabela 'alunos' possui índices que duplicam os registros automaticamente."
  ],
  answer: 1,
  feedback: "Correto: B. A consulta realiza um ==danger==produto cartesiano==: ao listar duas tabelas no FROM sem uma condição de junção no WHERE, o banco de dados combina cada linha da tabela A com cada linha da tabela B. Para corrigir, seria necessário adicionar ==dml==WHERE a.cod_curso = c.cod_curso== ou utilizar INNER JOIN com a cláusula ON."
},

// 50 - EXISTS vs IN
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Múltiplas afirmativas",
  texto: "Uma empresa de software está migrando consultas antigas que utilizam o operador IN para versões mais eficientes com EXISTS. O time de banco de dados discute as diferenças conceituais e práticas entre os dois operadores, especialmente no contexto de subconsultas correlacionadas.",
  question: "Sobre os operadores ==ddl==EXISTS== e ==ddl==IN== em subconsultas SQL, avalie as afirmativas:",
  assertions: [
    "I. O operador EXISTS retorna verdadeiro assim que a subconsulta encontrar a primeira linha correspondente, podendo ser mais eficiente que IN em alguns cenários.",
    "II. O operador IN é geralmente associado a subconsultas Tipo I (independentes), enquanto EXISTS é frequentemente utilizado em subconsultas Tipo II (correlacionadas).",
    "III. NOT EXISTS e NOT IN sempre produzem resultados idênticos, podendo ser utilizados de forma intercambiável sem restrições.",
    "IV. O operador EXISTS verifica apenas a existência de linhas no resultado da subconsulta, sem se preocupar com os valores retornados por ela."
  ],
  options: [
    "I e II, apenas.",
    "I, II e III, apenas.",
    "I, II e IV, apenas.",
    "I, II, III e IV."
  ],
  answer: 2,
  feedback: "Correto: C. As afirmativas I, II e IV são verdadeiras. A III é falsa: ==danger==NOT IN== e ==danger==NOT EXISTS== diferem quando a subconsulta pode retornar valores NULL. Com NULL presente, NOT IN não retorna nenhum registro (pois NULL não é comparável), enquanto NOT EXISTS se comporta conforme o esperado. Essa é uma armadilha clássica em SQL."
}

  ],


  fixacao: [
// aula: Aula 9 - Definindo um Banco de Dados

// 1 - DDL conceito
{
  tipo: "Direta",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 2 - primary key
{
  tipo: "Curta",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 3 - script foreign key
{
  tipo: "Código",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 4 - DROP vs DELETE
{
  tipo: "Direta",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 5 - CASCADE vs RESTRICT
{
  tipo: "Contexto",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 6 - CHAR vs VARCHAR
{
  tipo: "Curta",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 7 - ALTER TABLE
{
  tipo: "Contexto",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 8 - integridade referencial
{
  tipo: "Aplicação",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 9 - ALTER TABLE script
{
  tipo: "Código",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// 10 - esquema e catálogo
{
  tipo: "Contexto",
  aula: "Aula 9 — Definindo um Banco de Dados",
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

// aula: Aula 10 - Manipulando um Banco de Dados

// 11 - INSERT INTO
{
  tipo: "Curta",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  texto: "Sobre os comandos da linguagem DML em SQL.",
  question: "Qual comando SQL é utilizado para inserir novos registros em uma tabela?",
  options: [
    "UPDATE",
    "SELECT",
    "INSERT INTO",
    "ALTER TABLE"
  ],
  answer: 2,
  feedback: "O comando INSERT INTO é responsável por adicionar novos registros a uma tabela existente. UPDATE modifica dados já existentes, e SELECT apenas consulta."
},

// 12 - cláusula WHERE
{
  tipo: "Direta",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  texto: "Sobre a estrutura básica de uma consulta SQL.",
  question: "Qual cláusula define a condição de filtragem em uma consulta SELECT?",
  options: [
    "FROM",
    "ORDER BY",
    "GROUP BY",
    "WHERE"
  ],
  answer: 3,
  feedback: "A cláusula WHERE é responsável por filtrar os registros retornados pela consulta, aplicando condições que os dados devem satisfazer para serem incluídos no resultado."
},

// 13 - DELETE sem WHERE
{
  tipo: "Contexto",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  texto: "Um analista executou um comando DELETE sem especificar a cláusula WHERE em uma tabela com 10.000 registros.",
  question: "Qual será o resultado dessa operação?",
  options: [
    "Apenas o primeiro registro será removido",
    "O comando retornará erro por falta da cláusula WHERE",
    "Todos os registros da tabela serão excluídos",
    "A estrutura da tabela será removida junto com os dados"
  ],
  answer: 2,
  feedback: "DELETE sem WHERE remove todos os registros da tabela, mas preserva sua estrutura. Para remover a estrutura, seria necessário usar DROP TABLE."
},

// 14 - DISTINCT
{
  tipo: "Código",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  texto: "Analise o comando SQL abaixo e identifique seu comportamento:",
  question: "O que será retornado pela consulta a seguir?",
  code: `SELECT DISTINCT departamento
FROM funcionarios;`,
  options: [
    "Todos os registros da tabela, incluindo duplicatas",
    "Apenas o primeiro registro de cada departamento em ordem alfabética",
    "Os nomes de departamento sem repetição",
    "Um erro, pois DISTINCT não é compatível com SELECT"
  ],
  answer: 2,
  feedback: "DISTINCT elimina os valores duplicados do resultado. A consulta retorna cada valor de departamento uma única vez, sem repetições."
},

// 15 - UPDATE com WHERE
{
  tipo: "Código",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  texto: "Um desenvolvedor escreveu o seguinte comando para reajustar salários:",
  question: "Qual será o efeito do comando abaixo na tabela?",
  code: `UPDATE empregados
SET salario = salario * 1.10
WHERE departamento = 'TI';`,
  options: [
    "Todos os salários da empresa serão aumentados em 10%",
    "Apenas os salários do departamento TI serão aumentados em 10%",
    "O comando criará uma nova coluna chamada salario na tabela",
    "O comando excluirá os registros do departamento TI"
  ],
  answer: 1,
  feedback: "O WHERE restringe a operação ao departamento TI. Sem o WHERE, todos os registros seriam atualizados. O SET define o novo valor multiplicando o salário atual por 1.10."
},

// 16 - precedência operadores
{
  tipo: "Aplicação",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  texto: "Um sistema de RH precisa exibir o salário anual de cada funcionário, somando um bônus fixo de R$ 600 ao salário mensal antes de multiplicar por 12.",
  question: "Qual expressão SQL calcula corretamente esse valor?",
  options: [
    "SELECT salario * 12 + 600 FROM empregados",
    "SELECT 12 * salario + 600 FROM empregados",
    "SELECT 12 * (salario + 600) FROM empregados",
    "SELECT salario + 600 * 12 FROM empregados"
  ],
  answer: 2,
  feedback: "Os parênteses garantem que o bônus seja somado ao salário mensal antes da multiplicação. Sem parênteses, a precedência dos operadores faria a multiplicação ocorrer primeiro, alterando o resultado."
},

// 17 - operador AND
{
  tipo: "Curta",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  texto: "Sobre os operadores lógicos disponíveis em SQL.",
  question: "Qual operador lógico retorna resultados apenas quando TODAS as condições especificadas são verdadeiras simultaneamente?",
  options: [
    "OR",
    "NOT",
    "AND",
    "BETWEEN"
  ],
  answer: 2,
  feedback: "AND é o operador mais restritivo: exige que todas as condições sejam verdadeiras para que o registro seja incluído no resultado. OR basta que uma seja verdadeira."
},

// 18 - INSERT colunas específicas
{
  tipo: "Contexto",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  texto: "Uma equipe precisava inserir um novo curso no banco, mas só conhecia parte das colunas da tabela. Eles optaram por especificar as colunas no comando INSERT.",
  question: "Qual sintaxe representa corretamente essa abordagem?",
  options: [
    "INSERT VALUES ('SI', 180) INTO cursos",
    "INSERT INTO cursos VALUES ('SI', 180)",
    "INSERT INTO cursos (nome, carga) VALUES ('SI', 180)",
    "INSERT cursos SET nome = 'SI', carga = 180"
  ],
  answer: 2,
  feedback: "Ao especificar as colunas no INSERT INTO, é possível inserir dados em apenas parte das colunas da tabela. As colunas omitidas receberão NULL ou seu valor DEFAULT."
},

// 19 - AND aplicado
{
  tipo: "Aplicação",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  texto: "Um analista precisa buscar todos os produtos com preço maior que R$ 100 e que pertençam à categoria 'Eletrônicos'.",
  question: "Qual comando SQL atende corretamente essa necessidade?",
  options: [
    "SELECT * FROM produtos WHERE preco > 100 OR categoria = 'Eletrônicos'",
    "SELECT * FROM produtos WHERE preco > 100 AND categoria = 'Eletrônicos'",
    "SELECT * FROM produtos WHERE preco > 100 NOT categoria = 'Eletrônicos'",
    "SELECT * FROM produtos WHERE preco > 100, categoria = 'Eletrônicos'"
  ],
  answer: 1,
  feedback: "AND combina as duas condições exigindo que ambas sejam verdadeiras. OR retornaria produtos que satisfaçam qualquer uma das condições, ampliando o resultado indesejavelmente."
},

// 20 - UPDATE registro específico
{
  tipo: "Contexto",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  texto: "Uma desenvolvedora precisava atualizar o e-mail de um cliente específico sem alterar os demais registros da tabela.",
  question: "Qual estrutura de comando garante que apenas o registro desejado seja modificado?",
  options: [
    "UPDATE clientes SET email = 'novo@email.com'",
    "UPDATE clientes SET email = 'novo@email.com' WHERE id_cliente = 42",
    "INSERT INTO clientes SET email = 'novo@email.com' WHERE id_cliente = 42",
    "DELETE FROM clientes WHERE id_cliente = 42 AND SET email = 'novo@email.com'"
  ],
  answer: 1,
  feedback: "O UPDATE com WHERE restringe a atualização ao registro que satisfaz a condição. Sem WHERE, todos os registros da tabela teriam o e-mail alterado para o mesmo valor."
},

// aula: Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1

// 21 - ordem execução SQL
{
  tipo: "Direta",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  texto: "Considere a estrutura de execução de uma consulta SQL.",
  question: "Qual é a ordem correta de execução das cláusulas em uma consulta SQL básica?",
  options: [
    "SELECT → FROM → WHERE",
    "FROM → WHERE → SELECT",
    "WHERE → FROM → SELECT",
    "SELECT → WHERE → FROM"
  ],
  answer: 1,
  feedback: "A ordem real de execução é: FROM (define a origem), WHERE (filtra os dados) e só então SELECT (projeta as colunas desejadas)."
},

// 22 - cláusula WHERE
{
  tipo: "Contexto",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  texto: "Um sistema universitário armazena alunos em uma tabela. O administrador precisa listar apenas alunos vinculados ao curso de código 10.",
  question: "Qual consulta SQL retorna corretamente esses alunos?",
  options: [
    "SELECT * FROM alunos ORDER BY cod_curso = 10;",
    "SELECT * FROM alunos WHERE cod_curso = 10;",
    "SELECT * FROM alunos GROUP BY cod_curso = 10;",
    "SELECT cod_curso FROM alunos HAVING cod_curso = 10;"
  ],
  answer: 1,
  feedback: "A cláusula WHERE é usada para filtrar registros com base em uma condição. As demais opções utilizam cláusulas incorretas para filtragem simples."
},

// 23 - operador LIKE
{
  tipo: "Código",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  texto: "Analise a consulta abaixo:",
  question: "O que essa consulta retorna?",
  code: `SELECT * FROM alunos\nWHERE nome LIKE 'Jorge%';`,
  options: [
    "Alunos cujo nome termina com 'Jorge'",
    "Alunos cujo nome contém 'Jorge' em qualquer posição",
    "Alunos cujo nome começa com 'Jorge'",
    "Alunos cujo nome tem exatamente 5 letras após 'Jorge'"
  ],
  answer: 2,
  feedback: "O curinga % representa qualquer sequência de caracteres. Posicionado após 'Jorge', indica que o nome deve começar com essa string."
},

// 24 - curinga underscore
{
  tipo: "Direta",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  texto: "Sobre os curingas do operador LIKE no SQL:",
  question: "O que o caractere underscore _ representa no LIKE?",
  options: [
    "Qualquer sequência de caracteres",
    "Exatamente um caractere",
    "O início de uma string",
    "Um espaço em branco"
  ],
  answer: 1,
  feedback: "O _ substitui exatamente um caractere. Já o % substitui qualquer sequência (zero ou mais caracteres)."
},

// 25 - operador BETWEEN
{
  tipo: "Contexto",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  texto: "Uma analista precisa encontrar todos os alunos nascidos durante a década de 1980.",
  question: "Qual operador SQL é mais adequado para esse filtro por intervalo de datas?",
  options: [
    "LIKE",
    "IN",
    "BETWEEN",
    "IS NULL"
  ],
  answer: 2,
  feedback: "BETWEEN filtra valores dentro de um intervalo inclusivo, sendo ideal para datas e números. Equivale a >= valor_inicial AND <= valor_final."
},

// 26 - operador IN
{
  tipo: "Código",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  texto: "Observe a consulta a seguir:",
  question: "O operador IN nessa consulta é equivalente a qual expressão?",
  code: `SELECT * FROM alunos\nWHERE mat_alu IN (922155, 926465, 915550);`,
  options: [
    "mat_alu BETWEEN 922155 AND 915550",
    "mat_alu = 922155 OR mat_alu = 926465 OR mat_alu = 915550",
    "mat_alu LIKE 922155 AND mat_alu LIKE 926465",
    "mat_alu >= 922155 AND mat_alu <= 915550"
  ],
  answer: 1,
  feedback: "O IN é um atalho para múltiplos OR. Verifica se o valor do campo corresponde a algum item da lista fornecida."
},

// 27 - valor NULL
{
  tipo: "Direta",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  texto: "Sobre valores nulos em SQL:",
  question: "Qual afirmação sobre NULL é correta?",
  options: [
    "NULL é equivalente ao valor zero",
    "NULL é equivalente a uma string vazia",
    "Comparações com NULL resultam em UNKNOWN",
    "NULL pode ser comparado com = normalmente"
  ],
  answer: 2,
  feedback: "NULL representa ausência de valor. Comparações diretas com NULL (usando =) não funcionam — o resultado é UNKNOWN, por isso se usa IS NULL."
},

// 28 - IS NULL
{
  tipo: "Aplicação",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  texto: "Uma empresa quer saber quantos clientes estão cadastrados sem e-mail informado.",
  question: "Qual cláusula deve ser usada para identificar registros sem valor no campo email?",
  options: [
    "WHERE email = ''",
    "WHERE email = NULL",
    "WHERE email IS NULL",
    "WHERE email BETWEEN NULL AND NULL"
  ],
  answer: 2,
  feedback: "Para verificar ausência de valor usa-se IS NULL. A comparação com = NULL sempre retorna UNKNOWN e nunca encontra registros."
},

// 29 - função COUNT
{
  tipo: "Código",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  texto: "Analise a função abaixo aplicada a uma tabela:",
  question: "O que a função COUNT(*) retorna nesse contexto?",
  code: `SELECT COUNT(*) FROM alunos;`,
  options: [
    "A soma de todos os valores numéricos",
    "O maior valor da tabela",
    "O número total de registros na tabela",
    "A média dos campos numéricos"
  ],
  answer: 2,
  feedback: "COUNT(*) conta todos os registros da tabela, independentemente de valores nulos."
},

// 30 - GROUP BY
{
  tipo: "Contexto",
  aula: "Aula 11 - Refinando Consultas em um Banco de Dados • Parte 1",
  texto: "Um relatório precisa exibir a média de créditos de alunos, separada por cada curso.",
  question: "Qual cláusula SQL permite agrupar os resultados por curso antes de calcular a média?",
  options: [
    "ORDER BY",
    "WHERE",
    "HAVING",
    "GROUP BY"
  ],
  answer: 3,
  feedback: "GROUP BY agrupa os registros por um campo. Combinado com AVG(), gera estatísticas por categoria — nesse caso, por curso."
},

// aula: Aula 12 - Refinando Consultas em um Banco de Dados • Parte 2

// 31 - funções agregadas
{
  aula: "Aula 12 - Refinando Consultas em um Banco de Dados • Parte 2",
  tipo: "Direta",
  texto: "Funções de agregação processam valores de uma coluna e retornam um único resultado.",
  question: "Qual função SQL é usada para calcular a soma total de valores de uma coluna?",
  options: [
    "AVG()",
    "COUNT()",
    "SUM()",
    "MAX()"
  ],
  answer: 2,
  feedback: "SUM() é a função responsável por somar todos os valores de uma coluna. AVG() calcula a média, COUNT() conta registros e MAX() retorna o maior valor."
},

// 32 - GROUP BY
{
  aula: "Aula 12 - Refinando Consultas em um Banco de Dados • Parte 2",
  tipo: "Contexto",
  texto: "Um analista precisa descobrir a média de créditos dos alunos separada por curso, e não a média geral de todos os alunos juntos.",
  question: "Qual cláusula SQL deve ser usada para dividir os registros em grupos antes de aplicar a agregação?",
  options: [
    "ORDER BY",
    "WHERE",
    "HAVING",
    "GROUP BY"
  ],
  answer: 3,
  feedback: "GROUP BY é a cláusula que divide os registros em grupos antes da aplicação das funções agregadas, permitindo calcular resultados separados por categoria."
},

// 33 - HAVING vs WHERE
{
  aula: "Aula 12 - Refinando Consultas em um Banco de Dados • Parte 2",
  tipo: "Direta",
  texto: "WHERE e HAVING são cláusulas de filtragem, mas atuam em momentos diferentes da execução.",
  question: "Qual é a diferença fundamental entre WHERE e HAVING no SQL?",
  options: [
    "WHERE filtra grupos e HAVING filtra linhas individuais",
    "WHERE filtra linhas individuais e HAVING filtra grupos",
    "WHERE e HAVING são equivalentes e podem ser usadas intercambiavelmente",
    "WHERE só funciona com agregações e HAVING sem elas"
  ],
  answer: 1,
  feedback: "WHERE filtra linhas individuais antes do agrupamento, enquanto HAVING filtra grupos após a aplicação do GROUP BY. Elas atuam em etapas distintas da execução."
},

// 34 - ordem execução
{
  aula: "Aula 12 - Refinando Consultas em um Banco de Dados • Parte 2",
  tipo: "Aplicação",
  texto: "A ordem de execução lógica do SQL é frequentemente cobrada em provas e difere da ordem de escrita da consulta.",
  question: "Qual é a ordem correta de execução lógica de uma consulta SQL com todas as cláusulas?",
  options: [
    "SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY",
    "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY",
    "FROM → GROUP BY → WHERE → HAVING → SELECT → ORDER BY",
    "SELECT → WHERE → FROM → GROUP BY → HAVING → ORDER BY"
  ],
  answer: 1,
  feedback: "A ordem de execução lógica é: FROM (seleciona tabelas), WHERE (filtra linhas), GROUP BY (agrupa), HAVING (filtra grupos), SELECT (define resultado) e ORDER BY (ordena). Isso difere da ordem em que escrevemos a consulta."
},

// 35 - valores NULL
{
  aula: "Aula 12 - Refinando Consultas em um Banco de Dados • Parte 2",
  tipo: "Contexto",
  texto: "Uma tabela possui três registros na coluna créditos: 100, NULL e 200. Uma consulta executa AVG(creditos) sobre ela.",
  question: "Qual será o resultado da função AVG() nessa situação?",
  options: [
    "133,33 — pois considera NULL como zero",
    "150 — pois NULL é ignorado no cálculo",
    "NULL — pois existe um valor nulo na coluna",
    "0 — pois a função não consegue processar NULL"
  ],
  answer: 1,
  feedback: "Funções de agregação como AVG() ignoram valores NULL automaticamente. O cálculo será feito apenas sobre os valores não nulos: (100 + 200) / 2 = 150."
},

// 36 - COUNT e NULL
{
  aula: "Aula 12 - Refinando Consultas em um Banco de Dados • Parte 2",
  tipo: "Direta",
  texto: "O comportamento do COUNT() varia dependendo do argumento utilizado.",
  question: "Qual forma do COUNT() conta todas as linhas, inclusive aquelas com valores NULL?",
  options: [
    "COUNT(coluna)",
    "COUNT(DISTINCT coluna)",
    "COUNT(*)",
    "COUNT(ALL coluna)"
  ],
  answer: 2,
  feedback: "COUNT(*) conta todas as linhas da tabela, independentemente de haver NULL em qualquer coluna. Já COUNT(coluna) ignora os valores NULL daquela coluna específica."
},

// 37 - DISTINCT básico
{
  aula: "Aula 12 - Refinando Consultas em um Banco de Dados • Parte 2",
  tipo: "Código",
  texto: "Observe a consulta abaixo executada sobre uma tabela com os seguintes valores na coluna cod_curso: 10, 10, 20, 20, 30.",
  question: "Quantas linhas serão retornadas pela consulta abaixo?",
  code: `SELECT DISTINCT cod_curso
FROM alunos;`,
  options: [
    "5 linhas, pois retorna todos os registros",
    "2 linhas, pois agrupa os valores repetidos",
    "3 linhas, pois elimina as duplicatas",
    "1 linha, pois DISTINCT sempre retorna um único valor"
  ],
  answer: 2,
  feedback: "DISTINCT elimina valores duplicados. Com os valores 10, 10, 20, 20, 30, restam apenas três valores únicos: 10, 20 e 30. Por isso, serão retornadas 3 linhas."
},

// 38 - COUNT DISTINCT
{
  aula: "Aula 12 - Refinando Consultas em um Banco de Dados • Parte 2",
  tipo: "Aplicação",
  texto: "Um sistema registra o histórico escolar dos alunos. Um aluno pode ter cursado a mesma disciplina mais de uma vez ao longo dos anos.",
  question: "Para contar quantos alunos distintos cursaram uma disciplina em determinado ano, qual consulta é mais adequada?",
  options: [
    "SELECT COUNT(*) FROM historicos WHERE cod_disc = 200070 AND ano = 2001",
    "SELECT COUNT(mat_alu) FROM historicos WHERE cod_disc = 200070 AND ano = 2001",
    "SELECT COUNT(DISTINCT mat_alu) FROM historicos WHERE cod_disc = 200070 AND ano = 2001",
    "SELECT DISTINCT COUNT(mat_alu) FROM historicos WHERE cod_disc = 200070 AND ano = 2001"
  ],
  answer: 2,
  feedback: "COUNT(DISTINCT mat_alu) conta apenas as matrículas únicas, evitando que um mesmo aluno seja contado mais de uma vez caso tenha cursado a disciplina repetidamente."
},

// 39 - alias
{
  aula: "Aula 12 - Refinando Consultas em um Banco de Dados • Parte 2",
  tipo: "Curta",
  texto: "O uso de alias melhora a legibilidade dos resultados de consultas SQL.",
  question: "Qual é a finalidade do uso de AS em uma função de agregação no SELECT?",
  options: [
    "Criar uma nova coluna permanente na tabela",
    "Dar um nome personalizado ao resultado calculado",
    "Filtrar os valores antes da agregação",
    "Ordenar os resultados em ordem alfabética"
  ],
  answer: 1,
  feedback: "AS (alias) é usado para nomear o resultado de uma função agregada, substituindo o nome técnico automático como AVG(tot_cred) por algo mais legível como media_total_credito."
},

// 40 - DISTINCT restrição
{
  aula: "Aula 12 - Refinando Consultas em um Banco de Dados • Parte 2",
  tipo: "Direta",
  texto: "Embora DISTINCT possa ser combinado com funções de agregação, existem restrições em sua utilização.",
  question: "Qual das combinações abaixo é inválida no SQL padrão?",
  options: [
    "COUNT(DISTINCT mat_alu)",
    "AVG(DISTINCT tot_cred)",
    "COUNT(DISTINCT *)",
    "SUM(DISTINCT valor)"
  ],
  answer: 2,
  feedback: "COUNT(DISTINCT *) é inválido no SQL padrão. O DISTINCT dentro de funções de agregação exige uma coluna específica. COUNT(*) e COUNT(DISTINCT coluna) são válidos, mas não COUNT(DISTINCT *)."
},

// aula: Aula 13 - Consultas Aninhadas e Junções

// 41 - subconsulta
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Direta",
  texto: "Subconsultas são instruções SELECT utilizadas dentro de outra instrução SELECT.",
  question: "Qual é outro nome comumente utilizado para se referir a uma consulta aninhada?",
  options: [
    "Consulta derivada",
    "Subquery",
    "Consulta composta",
    "Query encadeada"
  ],
  answer: 1,
  feedback: "Consultas aninhadas também são chamadas de subqueries ou subconsultas. Os outros termos não são nomenclaturas padronizadas para esse conceito."
},

// 42 - Tipo I
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Direta",
  texto: "As subconsultas do Tipo I possuem comportamento bem definido quanto à sua execução.",
  question: "Quantas vezes uma subconsulta do Tipo I é executada durante uma consulta?",
  options: [
    "Uma vez para cada linha da consulta externa",
    "Nenhuma vez, pois é apenas declarativa",
    "Apenas uma vez",
    "Duas vezes, para validação"
  ],
  answer: 2,
  feedback: "A subconsulta Tipo I executa apenas uma vez, gerando um conjunto de resultados que é então usado pela consulta principal. Isso a diferencia da Tipo II, que executa repetidamente."
},

// 43 - operador IN
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Contexto",
  texto: "Um desenvolvedor precisa filtrar alunos cujas matrículas estejam presentes em uma tabela de históricos escolares.",
  question: "Qual operador é mais adequado para utilizar na cláusula WHERE dessa subconsulta Tipo I?",
  options: [
    "EXISTS",
    "BETWEEN",
    "IN",
    "LIKE"
  ],
  answer: 2,
  feedback: "O operador IN é característico das subconsultas Tipo I. Ele verifica se um valor está contido no conjunto retornado pela subconsulta interna."
},

// 44 - NOT IN
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Aplicação",
  texto: "Uma universidade deseja listar todos os cursos que não possuem nenhum aluno matriculado.",
  question: "Qual operador permite implementar essa lógica de diferença entre conjuntos em uma subconsulta?",
  options: [
    "NOT EXISTS apenas",
    "NOT IN ou NOT EXISTS",
    "LEFT JOIN apenas",
    "INNER JOIN com filtro NULL"
  ],
  answer: 1,
  feedback: "Tanto NOT IN quanto NOT EXISTS implementam a lógica de diferença entre conjuntos, retornando registros da primeira tabela que não possuem correspondência na segunda."
},

// 45 - Tipo II
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Direta",
  texto: "As subconsultas correlacionadas possuem uma dependência com a consulta externa.",
  question: "O que caracteriza uma subconsulta do Tipo II (correlacionada)?",
  options: [
    "Executa uma única vez e usa o operador IN",
    "Não possui relação com a consulta externa",
    "Depende da consulta externa e executa uma vez por linha",
    "Sempre retorna um único valor numérico"
  ],
  answer: 2,
  feedback: "A subconsulta Tipo II é correlacionada: ela referencia a consulta externa e é executada uma vez para cada linha processada pela consulta principal."
},

// 46 - EXISTS
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Direta",
  texto: "O operador EXISTS é utilizado em subconsultas correlacionadas para verificar a existência de registros.",
  question: "Quando o operador EXISTS retorna verdadeiro?",
  options: [
    "Quando a subconsulta retorna exatamente uma linha",
    "Quando a subconsulta retorna uma ou mais linhas",
    "Quando a subconsulta não retorna nenhuma linha",
    "Quando o valor comparado é diferente de NULL"
  ],
  answer: 1,
  feedback: "EXISTS retorna verdadeiro sempre que a subconsulta interna retornar pelo menos uma linha, independentemente de quantas sejam."
},

// 47 - subconsulta FROM
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Contexto",
  texto: "Em SQL, é possível utilizar o resultado de uma consulta como se fosse uma tabela dentro de outra consulta.",
  question: "Como é chamada a tabela gerada por uma subconsulta utilizada na cláusula FROM?",
  options: [
    "Tabela virtual permanente",
    "Tabela derivada ou visão inline",
    "Tabela espelhada",
    "Relação estática"
  ],
  answer: 1,
  feedback: "Quando uma subconsulta é usada no FROM, ela gera uma tabela temporária chamada tabela derivada, também conhecida como visão inline."
},

// 48 - INNER JOIN
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Aplicação",
  texto: "Um sistema precisa listar apenas os alunos que possuem curso cadastrado e válido no banco de dados.",
  question: "Qual tipo de JOIN deve ser utilizado para garantir que apenas registros com correspondência nas duas tabelas sejam retornados?",
  options: [
    "LEFT JOIN",
    "FULL OUTER JOIN",
    "RIGHT JOIN",
    "INNER JOIN"
  ],
  answer: 3,
  feedback: "O INNER JOIN retorna apenas os registros que possuem correspondência nas duas tabelas. Alunos sem curso válido não apareceriam no resultado."
},

// 49 - LEFT JOIN
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Contexto",
  texto: "Um banco de dados possui uma tabela de alunos e uma tabela de cursos. Alguns alunos ainda não foram vinculados a nenhum curso.",
  question: "Ao realizar um LEFT JOIN entre alunos e cursos, o que acontece com os alunos sem curso associado?",
  options: [
    "Eles são excluídos do resultado",
    "Eles aparecem com os campos do curso preenchidos como NULL",
    "Eles aparecem somente se tiverem matrícula ativa",
    "Eles são agrupados em uma linha separada"
  ],
  answer: 1,
  feedback: "No LEFT JOIN, todos os registros da tabela esquerda são mantidos. Quando não há correspondência na tabela direita, os campos relacionados são preenchidos com NULL."
},

// 50 - FULL OUTER JOIN
{
  aula: "Aula 13 - Consultas Aninhadas e Junções",
  tipo: "Direta",
  texto: "Diferentes tipos de JOIN determinam quais registros são retornados com base na existência ou ausência de correspondência entre tabelas.",
  question: "Qual JOIN retorna todos os registros de ambas as tabelas, incluindo os que não possuem correspondência?",
  options: [
    "INNER JOIN",
    "LEFT JOIN",
    "RIGHT JOIN",
    "FULL OUTER JOIN"
  ],
  answer: 3,
  feedback: "O FULL OUTER JOIN é o único que retorna todos os registros das duas tabelas, tanto os que possuem correspondência quanto os que não possuem, preenchendo com NULL onde necessário."
},
  ],

};