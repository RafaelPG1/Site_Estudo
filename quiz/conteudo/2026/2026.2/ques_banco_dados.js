// ============================================================
// NEXUS STUDY — quiz/conteudo/2026/2026.2/banco_dados.js
// ============================================================
window.questoes = {

  // Questões de Banco de dados 
  questoes: [
      // ── Questão 1 ── Explicativa
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
 
  // ── Questão 2 ── Explicativa
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
 
  // ── Questão 3 ── Explicativa
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
 
  // ── Questão 4 ── Contextualizada
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
 
  // ── Questão 5 ── Contextualizada
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
 
  // ── Questão 6 ── Contextualizada
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
 
  // ── Questão 7 ── Aplicação
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
 
  // ── Questão 8 ── Aplicação
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
 
  // ── Questão 9 ── Aplicação
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
 
  // ── Questão 10 ── Explicativa
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
 
  // ── Questão 11 ── Contextualizada
  {
    aula: "Aula 9 — Definindo um Banco de Dados",
    tipo: "Contextualizada",
 
    texto: "O tipo de dado CHAR(n) armazena strings de tamanho fixo — sempre ocupa n caracteres, preenchendo com espaços quando necessário. Já o VARCHAR(n) armazena strings de tamanho variável — ocupa apenas o espaço necessário até o limite n. Essa diferença impacta tanto no armazenamento quanto na performance do banco em diferentes situações.",
 
    question: "Uma tabela armazena o campo sigla_estado, que sempre terá exatamente 2 caracteres (ex: 'SP', 'RJ'). Qual tipo de dado é mais adequado para esse campo?",
 
    options: [
      "VARCHAR(2), pois aceita qualquer tamanho até 2 caracteres.",
      "CHAR(2), pois o tamanho é sempre fixo e não há desperdício de espaço variável.",
      "INTEGER, pois identificadores de estado são numéricos no banco.",
      "BLOB, pois siglas são consideradas dados binários no SQL padrão."
    ],
 
    answer: 1,
 
    feedback: "Quando o tamanho do valor é sempre fixo, ==type==CHAR(n)== é mais adequado que VARCHAR(n). Para 'SP' e 'RJ' com exatamente 2 caracteres, CHAR(2) é a escolha correta."
  },
 
  // ── Questão 12 ── Aplicação
  {
    aula: "Aula 9 — Definindo um Banco de Dados",
    tipo: "Aplicação",
 
    texto: "Um desenvolvedor júnior recebeu a tarefa de modelar fisicamente um banco de dados acadêmico. Ele precisava criar as tabelas seguindo a sequência lógica de um projeto: primeiro definir as entidades, depois seus atributos, tipos de dados, chaves e relacionamentos. Esse processo é chamado de definição do modelo físico e é implementado por meio de comandos DDL.",
 
    question: "Qual é a sequência correta para definir fisicamente um banco de dados do zero?",
 
    options: [
      "Criar as chaves estrangeiras → criar as tabelas → criar o banco → definir os tipos de dados.",
      "Inserir os dados → criar as tabelas → definir o banco → criar os índices.",
      "Criar o banco → criar as tabelas com colunas, tipos e restrições → ajustar com ALTER → remover com DROP se necessário.",
      "Definir os relacionamentos → inserir dados de teste → criar o banco → adicionar as tabelas."
    ],
 
    answer: 2,
 
    feedback: "A ordem correta é: ==ddl==CREATE DATABASE== → ==ddl==CREATE TABLE== (com colunas, tipos e chaves) → ALTER para ajustes → DROP apenas quando necessário. Dados não fazem parte da DDL."
  },
  
  // ── Questão 13 ── Explicativa
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

  // ── Questão 14 ── Explicativa
  {
    aula: "Aula 10 — Manipulando um Banco de Dados",
    tipo: "Explicativa",

    texto: "Em SQL, existem duas abordagens de DML: a procedural e a não procedural. Na abordagem procedural, o usuário define não só o que quer, mas também como o banco deve buscar os dados — exige mais conhecimento técnico. Já na abordagem não procedural, que é a mais comum no SQL padrão, o usuário informa apenas o que quer, e o banco decide como executar internamente.",

    question: "Qual é a característica da DML não procedural, abordagem padrão do SQL?",

    options: [
      "O usuário define o que quer e também o caminho exato para obter os dados.",
      "O usuário programa manualmente os algoritmos de busca dentro do banco.",
      "O usuário informa apenas o que quer, e o banco decide como executar a operação.",
      "O banco exige que o usuário declare a ordem de acesso às tabelas antes de cada consulta."
    ],

    answer: 2,

    feedback: "Na DML ==mark==não procedural==, o usuário descreve apenas o resultado desejado. O banco gerencia internamente como recuperar os dados, tornando o SQL mais simples e acessível."
  },

  // ── Questão 15 ── Explicativa
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

  // ── Questão 16 ── Contextualizada
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

  // ── Questão 17 ── Contextualizada
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

  // ── Questão 18 ── Contextualizada
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

  // ── Questão 19 ── Aplicação
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

  // ── Questão 20 ── Aplicação
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

  // ── Questão 21 ── Aplicação
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

  // ── Questão 22 ── Explicativa
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

  // ── Questão 23 ── Contextualizada
  {
    aula: "Aula 10 — Manipulando um Banco de Dados",
    tipo: "Contextualizada",

    texto: "Em SQL, o SELECT pode retornar uma ou mais colunas de uma tabela. Quando se deseja retornar todas as colunas disponíveis, usa-se o asterisco (*) no lugar dos nomes das colunas. Quando se quer apenas algumas colunas específicas, elas são listadas separadas por vírgula. Essa seleção precisa de dados não altera os dados originais — apenas os exibe.",

    question: "Um analista executou SELECT * FROM clientes. O que esse comando retorna?",

    options: [
      "Apenas a primeira coluna da tabela clientes.",
      "Apenas os registros duplicados da tabela.",
      "Todas as colunas e todos os registros da tabela clientes.",
      "A estrutura da tabela clientes, sem os dados armazenados."
    ],

    answer: 2,

    feedback: "O ==dml==SELECT *== retorna todas as colunas de todos os registros da tabela indicada no FROM. É útil para explorar os dados, mas em produção é recomendável especificar apenas as colunas necessárias."
  },

  // ── Questão 24 ── Aplicação
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
 
    // ── Questão 2 ─────────────────────────────────────────
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
 
    // ── Questão 3 ─────────────────────────────────────────
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
 
    // ── Questão 4 ─────────────────────────────────────────
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
 
    // ── Questão 5 ─────────────────────────────────────────
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
 
    // ── Questão 6 ─────────────────────────────────────────
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
 
    // ── Questão 7 ─────────────────────────────────────────
    {
      tipo: "Conceitual",
      aula: "Aula 9 — Definindo um Banco de Dados",
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
 
    // ── Questão 9 ─────────────────────────────────────────
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
 
    // ── Questão 10 ─────────────────────────────────────────
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
 
    // ── Questão 11 ─────────────────────────────────────────
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
 
    // ── Questão 12 ─────────────────────────────────────────
    {
      tipo: "Conceitual",
      aula: "Aula 9 — Definindo um Banco de Dados",
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
    },

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

{
  tipo: "Conceitual",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  conteudo: "DML — Linguagem de Manipulação de Dados em SQL",
  texto: "Em uma entrevista técnica para desenvolvedor back-end, o candidato foi questionado sobre a diferença entre DML procedural e DML não procedural. O avaliador queria entender se o candidato compreendia não apenas os comandos SQL, mas também o modelo de interação com o banco de dados que cada abordagem representa.",
  question: "Assinale a alternativa que descreve corretamente a diferença entre ==term==DML Procedural== e ==term==DML Não Procedural==:",
  options: [
    "Na ==term==DML Procedural==, o usuário informa apenas **o que** quer obter; na Não Procedural, o usuário define também **como** os dados serão recuperados.",
    "Na ==term==DML Não Procedural==, o usuário informa apenas **o que** deseja; na Procedural, o usuário especifica também **como** os dados devem ser obtidos.",
    "Ambas as abordagens são equivalentes em SQL padrão, diferindo apenas na sintaxe utilizada para os comandos SELECT e INSERT.",
    "A ==term==DML Procedural== é utilizada exclusivamente para comandos de escrita (INSERT, UPDATE, DELETE), enquanto a Não Procedural é reservada para consultas (SELECT)."
  ],
  answer: 1,
  feedback: "Correto: B. Na ==term==DML Não Procedural== (modelo adotado pelo SQL), o usuário informa **apenas o que quer** — o banco decide como obter. Na ==term==DML Procedural==, o usuário especifica também **o caminho de acesso**, tendo mais controle, porém maior complexidade. As demais alternativas invertem ou confundem os conceitos."
},

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

{
  tipo: "Conceitual",
  aula: "Aula 10 — Manipulando um Banco de Dados",
  conteudo: "DML — Linguagem de Manipulação de Dados em SQL",
  texto: "Durante uma reunião de revisão de código, o líder técnico de uma startup questionou os desenvolvedores sobre a correta categorização dos comandos SQL. O objetivo era garantir que a equipe compreendesse quais comandos pertencem à DML e quais à DDL, evitando confusões em contextos de controle de transações e auditoria de banco de dados.",
  question: "Assinale a alternativa que classifica corretamente os comandos SQL apresentados:",
  options: [
    "==proc==SELECT==, ==proc==INSERT==, ==proc==UPDATE== e ==proc==DELETE== pertencem à DML; ==ddl==CREATE TABLE==, ==ddl==ALTER TABLE== e ==ddl==DROP TABLE== pertencem à DDL.",
    "==proc==INSERT== e ==ddl==CREATE TABLE== pertencem à DDL, pois ambos **criam** algo no banco; ==proc==DELETE== e ==ddl==DROP TABLE== pertencem à DML, pois ambos **removem** algo.",
    "Todos os comandos citados pertencem à DML, pois a DML abrange toda instrução SQL executada pelo usuário final no banco de dados.",
    "==proc==SELECT== pertence à DDL por ser somente leitura; ==proc==INSERT==, ==proc==UPDATE== e ==proc==DELETE== pertencem à DML por modificarem dados."
  ],
  answer: 0,
  feedback: "Correto: A. A ==proc==DML== (Data Manipulation Language) abrange os comandos que **manipulam dados**: SELECT, INSERT, UPDATE e DELETE. A ==ddl==DDL== (Data Definition Language) abrange os comandos que **definem estruturas**: CREATE TABLE, ALTER TABLE e DROP TABLE. A alternativa B comete o erro clássico de classificar pelo efeito superficial ('cria' ou 'remove') em vez da camada de atuação (dados vs. estrutura)."
}
 
  ],

  fixacao: [

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
  {
    tipo: "Direta",
    aula: "Aula 9 — Definindo um Banco de Dados",
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
  {
    tipo: "Direta",
    aula: "Aula 9 — Definindo um Banco de Dados",
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
  },
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
  {
    tipo: "Direta",
    aula: "Aula 10 — Manipulando um Banco de Dados",
    texto: "Sobre os tipos de DML e sua forma de operação.",
    question: "Qual é a característica da DML não procedural, como o SQL?",
    options: [
      "O usuário especifica o que quer e como o banco deve obtê-lo",
      "Requer definição explícita dos índices antes de cada consulta",
      "O usuário especifica apenas o que quer, sem indicar como obter",
      "É utilizada exclusivamente para operações de exclusão e atualização"
    ],
    answer: 2,
    feedback: "Na DML não procedural, o usuário informa apenas o resultado desejado. O banco de dados decide internamente a melhor forma de obtê-lo, tornando a linguagem mais simples de usar."
  },
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
  {
    tipo: "Direta",
    aula: "Aula 10 — Manipulando um Banco de Dados",
    texto: "Sobre o operador de comparação para valores diferentes em SQL.",
    question: "Qual operador é utilizado em SQL para verificar se dois valores são diferentes?",
    options: [
      "!=",
      "NOT =",
      "<>",
      "≠"
    ],
    answer: 2,
    feedback: "O operador <> é o padrão SQL para 'diferente de'. Embora != seja aceito em alguns SGBDs, o <> é o operador definido pelo padrão SQL ANSI para comparação de desigualdade."
  },
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

  
  ],
};