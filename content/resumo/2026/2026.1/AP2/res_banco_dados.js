/* =============================================
   NEXUS STUDY — res_banco_dados.js
   Disciplina: Banco de Dados
   ============================================= */

window.__nexusConteudo = {
  aulas: [
    //Aula 9 — Definindo um Banco de Dados
    {
    aula: "Aula 9 — DDL: Data Definition Language",
    ideia_central: "A DDL (Data Definition Language) e o subconjunto da SQL responsavel pela definicao e estruturacao de bancos de dados, utilizando os comandos CREATE, ALTER e DROP para criar, modificar e remover estruturas, garantindo integridade por meio de chaves primarias e estrangeiras.",
    secoes: [
    {
      id: "visao",
      titulo: "📖 Visão Geral do Conteúdo",
      blocos: [
        {
          tipo: "texto",
          texto: "Este modulo aborda os conceitos da DDL (Data Definition Language), subconjunto da SQL responsavel pela definicao e estruturacao de bancos de dados."
        },
        {
          tipo: "lista",
          titulo: "O conteudo apresenta:",
          itens: [
            "Conceito de DDL",
            "Definicao de esquema e catalogo",
            "Criacao de bancos e tabelas",
            "Alteracao de estruturas",
            "Remocao de bancos e tabelas",
            "Criacao de chaves primarias e estrangeiras",
            "Principais tipos de dados SQL"
          ]
        },
        {
          tipo: "lista",
          titulo: "Comandos centrais estudados:",
          itens: [
            "`CREATE`",
            "`ALTER`",
            "`DROP`"
          ]
        },
        {
          tipo: "destaque",
          texto: "O modulo tambem enfatiza a importancia das restricoes de integridade para garantir consistencia dos dados."
        }
      ]
    },

    {
      id: "ddl",
      titulo: "🧠 DDL — Data Definition Language",
      blocos: [
        {
          tipo: "texto",
          texto: "A DDL e a parte da SQL responsavel pela definicao da estrutura do banco de dados."
        },
        {
          tipo: "topico",
          titulo: "Ela permite:",
          lista: [
            "Criar estruturas",
            "Alterar estruturas",
            "Remover estruturas"
          ]
        },
        {
          tipo: "topico",
          titulo: "A DDL define:",
          lista: [
            "Tabelas",
            "Esquemas",
            "Dominios",
            "Indices",
            "Restricoes",
            "Permissoes",
            "Armazenamento fisico"
          ]
        },
        {
          tipo: "tabela",
          titulo: "Principais comandos DDL",
          colunas: ["Comando", "Funcao"],
          linhas: [
            ["CREATE", "Criar objetos"],
            ["ALTER",  "Modificar objetos"],
            ["DROP",   "Remover objetos"]
          ]
        }
      ]
    },

    {
      id: "comandos_ddl",
      titulo: "⚙️ Comandos DDL",
      blocos: [
        {
          tipo: "topico",
          titulo: "CREATE",
          texto: "Utilizado para criacao de:",
          lista: [
            "Bancos de dados",
            "Tabelas",
            "Views",
            "Procedimentos",
            "Indices"
          ]
        },
        {
          tipo: "topico",
          titulo: "ALTER",
          texto: "Usado para modificar objetos existentes.",
          lista: [
            "Adicionar colunas",
            "Remover colunas",
            "Alterar tipos",
            "Adicionar restricoes"
          ]
        },
        {
          tipo: "topico",
          titulo: "DROP",
          texto: "Remove objetos do banco.",
          lista: [
            "Pode excluir: tabelas, bancos, esquemas, indices"
          ]
        },
        {
          tipo: "destaque",
          texto: "O comando DROP e destrutivo e exige cuidado."
        }
      ]
    },

    {
      id: "esquema_catalogo",
      titulo: "🗂️ Esquema e Catálogo",
      blocos: [
        {
          tipo: "topico",
          titulo: "Esquema (Schema)",
          texto: "Um esquema e um agrupamento logico de objetos do banco de dados.",
          lista: [
            "Inclui: tabelas, views, restricoes, dominios, permissoes",
            "Exemplo: `CREATE SCHEMA Exemplo;`"
          ]
        },
        {
          tipo: "topico",
          titulo: "Catalogo",
          texto: "O catalogo e uma colecao de esquemas.",
          lista: [
            "Todo catalogo possui `INFORMATION_SCHEMA`",
            "Esse esquema especial contem metadados do banco"
          ]
        }
      ]
    },

    {
      id: "create_database",
      titulo: "🏗️ CREATE DATABASE",
      blocos: [
        {
          tipo: "texto",
          texto: "Cria um banco de dados."
        },
        {
          tipo: "topico",
          titulo: "Sintaxe:",
          lista: [
            "`CREATE DATABASE nome_base;`"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo — Criar banco de dados",
          texto: "Cria um banco de dados chamado Exemplo.",
          detalhe: "CREATE DATABASE Exemplo;"
        },
        {
          tipo: "imagem",
          src: "fig_create_database_postgres.png",
          pasta: "imagens_banco_dados/aula_09",
          num: "1",
          alt: "Criacao de banco de dados no PostgreSQL utilizando DDL"
        },
        {
          tipo: "imagem",
          src: "fig_create_database_gui.png",
          pasta: "imagens_banco_dados/aula_09",
          num: "2",
          alt: "Criacao de banco usando interface grafica do PostgreSQL"
        }
      ]
    },

    {
      id: "create_table",
      titulo: "📋 CREATE TABLE",
      blocos: [
        {
          tipo: "texto",
          texto: "Cria tabelas. E necessario definir colunas, tipos e restricoes."
        },
        {
          tipo: "topico",
          titulo: "Sintaxe:",
          lista: [
            "`CREATE TABLE nome_tabela (`",
            "`    campo atributo`",
            "`);`"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo — Criar tabela alunos",
          texto: "Cria a tabela alunos com matricula inteira e nome variavel.",
          detalhe: "CREATE TABLE alunos (mat_alu INTEGER, nom_alu VARCHAR(50));"
        },
        {
          tipo: "imagem",
          src: "fig_create_table_alunos.png",
          pasta: "imagens_banco_dados/aula_09",
          num: "3",
          alt: "Criacao da tabela alunos no banco de dados Exemplo usando CREATE TABLE"
        }
      ]
    },

    {
      id: "tipos_dados",
      titulo: "🔢 Tipos de Dados SQL",
      blocos: [
        {
          tipo: "texto",
          texto: "Os tipos de dados definem quais valores uma coluna aceita."
        },
        {
          tipo: "topico",
          titulo: "CHAR(n)",
          texto: "Texto com tamanho fixo. Sempre ocupa n caracteres.",
          lista: [
            "Exemplo: `CHAR(10)` — sempre ocupa 10 caracteres"
          ]
        },
        {
          tipo: "topico",
          titulo: "VARCHAR(n)",
          texto: "Texto com tamanho variavel. Mais utilizado em nomes e descricoes.",
          lista: [
            "Exemplo: `VARCHAR(50)`"
          ]
        },
        {
          tipo: "topico",
          titulo: "INTEGER",
          lista: [
            "Numero inteiro de 32 bits",
            "Sintaxe: `INTEGER`"
          ]
        },
        {
          tipo: "topico",
          titulo: "SMALLINT",
          lista: [
            "Inteiro menor (16 bits)",
            "Sintaxe: `SMALLINT`"
          ]
        },
        {
          tipo: "topico",
          titulo: "DECIMAL / NUMERIC",
          lista: [
            "Numeros com casas decimais",
            "Exemplo: `DECIMAL(10,2)`"
          ]
        },
        {
          tipo: "topico",
          titulo: "FLOAT",
          lista: [
            "Numero de ponto flutuante"
          ]
        },
        {
          tipo: "topico",
          titulo: "DATE",
          lista: [
            "Armazena datas"
          ]
        },
        {
          tipo: "topico",
          titulo: "TIME",
          lista: [
            "Armazena horarios"
          ]
        },
        {
          tipo: "topico",
          titulo: "BLOB",
          texto: "Armazena arquivos binarios.",
          lista: [
            "Imagens",
            "Videos",
            "Audios"
          ]
        },
        {
          tipo: "imagem",
          src: "quadro_tipos_sql.png",
          pasta: "imagens_banco_dados/aula_09",
          num: "Quadro 1",
          alt: "Quadro com os principais tipos de dados utilizados na definicao de tabelas SQL"
        }
      ]
    },

    {
      id: "alter",
      titulo: "✏️ ALTER DATABASE e ALTER TABLE",
      blocos: [
        {
          tipo: "topico",
          titulo: "ALTER DATABASE",
          texto: "Permite alterar propriedades do banco.",
          lista: [
            "Exemplo: `ALTER DATABASE Exemplo RENAME TO BDAcademico;`"
          ]
        },
        {
          tipo: "topico",
          titulo: "ALTER TABLE",
          texto: "Usado para modificar tabelas existentes.",
          lista: [
            "Adicionar colunas",
            "Remover colunas",
            "Alterar atributos",
            "Adicionar restricoes"
          ]
        },
        {
          tipo: "topico",
          titulo: "Adicionando coluna — sintaxe:",
          lista: [
            "`ALTER TABLE tabela`",
            "`ADD coluna atributo;`"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo — Adicionar coluna CTPS",
          texto: "Adiciona a coluna CTPS do tipo VARCHAR(8) na tabela alunos.",
          detalhe: "ALTER TABLE Exemplo.alunos ADD CTPS VARCHAR(8);"
        },
        {
          tipo: "destaque",
          texto: "Valores NULL em ALTER TABLE: ao adicionar colunas, registros antigos recebem NULL. NOT NULL nao e permitido sem valor padrao (DEFAULT)."
        }
      ]
    },

    {
      id: "drop",
      titulo: "🗑️ DROP TABLE e DROP DATABASE",
      blocos: [
        {
          tipo: "topico",
          titulo: "DROP TABLE",
          texto: "Remove tabelas do banco.",
          lista: [
            "Exemplo: `DROP TABLE curriculos CASCADE;`"
          ]
        },
        {
          tipo: "topico",
          titulo: "CASCADE",
          texto: "Remove:",
          lista: [
            "A tabela",
            "Dependencias",
            "Restricoes",
            "Views relacionadas"
          ]
        },
        {
          tipo: "topico",
          titulo: "RESTRICT",
          lista: [
            "So remove se nao houver dependencias"
          ]
        },
        {
          tipo: "tabela",
          titulo: "Diferenca entre DELETE e DROP",
          colunas: ["DELETE", "DROP"],
          linhas: [
            ["Remove registros",    "Remove estrutura"],
            ["Mantem tabela",       "Exclui tabela"],
            ["Pode usar WHERE",     "Estrutura desaparece"]
          ]
        },
        {
          tipo: "topico",
          titulo: "DROP DATABASE",
          texto: "Remove completamente um banco de dados.",
          lista: [
            "Exemplo: `DROP DATABASE Exemplo;`"
          ]
        },
        {
          tipo: "destaque",
          texto: "DROP DATABASE realiza exclusao fisica e geralmente irreversivel. Exige extremo cuidado."
        },
        {
          tipo: "imagem",
          src: "fig_drop_database.png",
          pasta: "imagens_banco_dados/aula_09",
          num: "4",
          alt: "Exemplo de remocao de banco de dados no PostgreSQL usando DROP DATABASE"
        }
      ]
    },

    {
      id: "chaves",
      titulo: "🔑 Chave Primária e Chave Estrangeira",
      blocos: [
        {
          tipo: "topico",
          titulo: "Chave Primaria — PRIMARY KEY",
          texto: "Identifica unicamente cada registro.",
          lista: [
            "Unica — nao pode se repetir",
            "Nao nula — nao aceita NULL",
            "Identifica registros de forma exclusiva"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo — PRIMARY KEY simples",
          texto: "Define mat_alu como chave primaria.",
          detalhe: "PRIMARY KEY (mat_alu)"
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo — PRIMARY KEY nomeada (PostgreSQL)",
          texto: "Define a restricao com nome usando CONSTRAINT.",
          detalhe: "CONSTRAINT alu_pk PRIMARY KEY (mat_alu)"
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo — CREATE TABLE com chave primaria",
          texto: "Cria a tabela alunos com chave primaria definida via CONSTRAINT.",
          detalhe: "CREATE TABLE alunos (mat_alu INTEGER, nom_alu VARCHAR(50), CONSTRAINT alu_pk PRIMARY KEY(mat_alu));"
        },
        {
          tipo: "imagem",
          src: "fig_primary_key.png",
          pasta: "imagens_banco_dados/aula_09",
          num: "5",
          alt: "Exemplo de definicao de chave primaria em uma tabela SQL"
        },
        {
          tipo: "topico",
          titulo: "Chave Estrangeira — FOREIGN KEY",
          texto: "Mantem integridade referencial e relaciona tabelas.",
          lista: [
            "Garante que o valor referenciado exista",
            "Impede referencias invalidas",
            "Exemplo: aluno so pode possuir curso existente"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo — FOREIGN KEY",
          texto: "Relaciona o campo cod_curso da tabela atual com a tabela cursos.",
          detalhe: "FOREIGN KEY (cod_curso) REFERENCES cursos(cod_curso)"
        },
        {
          tipo: "imagem",
          src: "fig_foreign_key.png",
          pasta: "imagens_banco_dados/aula_09",
          num: "6",
          alt: "Exemplo de relacionamento entre tabelas usando chave estrangeira e integridade referencial"
        }
      ]
    },

    {
      id: "formulas",
      titulo: "📐 Fórmulas e Métodos",
      blocos: [
        {
          tipo: "topico",
          titulo: "Metodo de Criacao de Banco",
          lista: [
            "`CREATE DATABASE nome;`"
          ]
        },
        {
          tipo: "topico",
          titulo: "Metodo de Criacao de Tabela",
          lista: [
            "`CREATE TABLE tabela (`",
            "`    campo tipo`",
            "`);`"
          ]
        },
        {
          tipo: "topico",
          titulo: "Metodo de Alteracao",
          lista: [
            "`ALTER TABLE tabela`",
            "`ADD coluna tipo;`"
          ]
        },
        {
          tipo: "topico",
          titulo: "Metodo de Remocao",
          lista: [
            "Remover tabela: `DROP TABLE tabela;`",
            "Remover banco: `DROP DATABASE banco;`"
          ]
        },
        {
          tipo: "topico",
          titulo: "Metodo de Chave Primaria",
          lista: [
            "`PRIMARY KEY (campo)`"
          ]
        },
        {
          tipo: "topico",
          titulo: "Metodo de Chave Estrangeira",
          lista: [
            "`FOREIGN KEY (campo)`",
            "`REFERENCES tabela(campo)`"
          ]
        },
        {
          tipo: "topico",
          titulo: "Metodo de Definicao de Tipos",
          lista: [
            "Texto fixo: `CHAR(10)`",
            "Texto variavel: `VARCHAR(50)`",
            "Numero decimal: `DECIMAL(10,2)`"
          ]
        }
      ]
    },

    {
      id: "exemplos",
      titulo: "💡 Exemplos Explicativos",
      blocos: [
        {
          tipo: "exemplo",
          titulo: "Criar banco de dados",
          texto: "Cria o banco de dados chamado Exemplo.",
          detalhe: "CREATE DATABASE Exemplo;"
        },
        {
          tipo: "exemplo",
          titulo: "Criar tabela alunos",
          texto: "Cria a tabela alunos com matricula e nome.",
          detalhe: "CREATE TABLE alunos (mat_alu INTEGER, nom_alu VARCHAR(50));"
        },
        {
          tipo: "exemplo",
          titulo: "Criar tabela com chave primaria",
          texto: "Cria a tabela alunos definindo chave primaria via CONSTRAINT.",
          detalhe: "CREATE TABLE alunos (mat_alu INTEGER, nom_alu VARCHAR(50), CONSTRAINT alu_pk PRIMARY KEY(mat_alu));"
        },
        {
          tipo: "exemplo",
          titulo: "Adicionar coluna",
          texto: "Adiciona a coluna CTPS na tabela alunos.",
          detalhe: "ALTER TABLE Exemplo.alunos ADD CTPS VARCHAR(8);"
        },
        {
          tipo: "exemplo",
          titulo: "Renomear banco",
          texto: "Renomeia o banco Exemplo para BDAcademico.",
          detalhe: "ALTER DATABASE Exemplo RENAME TO BDAcademico;"
        },
        {
          tipo: "exemplo",
          titulo: "Remover tabela",
          texto: "Remove a tabela curriculos e suas dependencias.",
          detalhe: "DROP TABLE curriculos CASCADE;"
        },
        {
          tipo: "exemplo",
          titulo: "Criar chave estrangeira",
          texto: "Relaciona cod_curso com a tabela cursos.",
          detalhe: "FOREIGN KEY (cod_curso) REFERENCES cursos(cod_curso)"
        }
      ]
    },

    {
      id: "resumo",
      titulo: "🧾 Resumo Final para Revisão Rápida",
      blocos: [
        {
          tipo: "lista",
          itens: [
            "**DDL** — define estrutura do banco",
            "**CREATE** — cria objetos",
            "**ALTER** — modifica objetos",
            "**DROP** — remove objetos",
            "`CREATE DATABASE` — cria bancos",
            "`CREATE TABLE` — cria tabelas",
            "`ALTER TABLE` — modifica tabelas",
            "`DROP TABLE` — remove tabelas",
            "`DROP DATABASE` — remove bancos",
            "**CHAR** — texto fixo",
            "**VARCHAR** — texto variavel",
            "**INTEGER** — numero inteiro",
            "**DECIMAL** — numero decimal",
            "**DATE** — datas",
            "**BLOB** — arquivos binarios",
            "**PRIMARY KEY** — unica e nao nula",
            "**FOREIGN KEY** — cria relacionamento e garante integridade referencial",
            "**CASCADE** — remove dependencias junto",
            "**RESTRICT** — impede exclusao com dependencias",
            "**DROP** e destrutivo e exige cuidado"
          ]
        },
        {
          tipo: "lista",
          titulo: "Pontos mais importantes para prova:",
          itens: [
            "Diferenca entre DDL e DML",
            "Funcao dos comandos CREATE, ALTER e DROP",
            "Estrutura do CREATE TABLE",
            "Principais tipos de dados SQL",
            "Diferenca entre CHAR e VARCHAR",
            "Conceito de esquema e catalogo",
            "Chave primaria e suas caracteristicas",
            "Chave estrangeira e integridade referencial",
            "Diferenca entre DELETE e DROP",
            "Uso de CASCADE e RESTRICT"
          ]
        }
      ]
    }
    ]
    },
    //Aula 10 — Manipulando um Banco de Dados
    {
    aula: "Aula 10 — Manipulando um Banco de Dados",
    ideia_central: "A DML (Data Manipulation Language) e seus comandos SELECT, INSERT, UPDATE e DELETE permitem consultar, inserir, alterar e excluir dados em bancos de dados relacionais, sendo os operadores aritmeticos, de comparacao e logicos ferramentas essenciais para otimizar essas operacoes.",
    secoes: [
    {
      id: "visao",
      titulo: "📖 Visão Geral do Conteúdo",
      blocos: [
        {
          tipo: "texto",
          texto: "Este modulo apresenta os principais conceitos da DML (Data Manipulation Language), subconjunto da linguagem SQL responsavel pela manipulacao dos dados armazenados em bancos de dados."
        },
        {
          tipo: "lista",
          titulo: "Principais comandos estudados:",
          itens: [
            "**SELECT**",
            "**INSERT**",
            "**DELETE**",
            "**UPDATE**"
          ]
        },
        {
          tipo: "lista",
          titulo: "O modulo tambem aborda:",
          itens: [
            "Estrutura basica de consultas SQL",
            "Operadores aritmeticos",
            "Operadores de comparacao",
            "Operadores logicos"
          ]
        },
        {
          tipo: "lista",
          titulo: "O objetivo principal e ensinar como:",
          itens: [
            "Consultar dados",
            "Inserir registros",
            "Atualizar informacoes",
            "Excluir registros",
            "Otimizar consultas SQL"
          ]
        }
      ]
    },

    {
      id: "dml",
      titulo: "🧠 DML — Data Manipulation Language",
      blocos: [
        {
          tipo: "texto",
          texto: "A DML e o subconjunto da SQL responsavel pela manipulacao dos dados armazenados no banco."
        },
        {
          tipo: "topico",
          titulo: "Ela permite:",
          lista: [
            "Buscar informacoes",
            "Inserir novos registros",
            "Alterar dados",
            "Excluir registros"
          ]
        },
        {
          tipo: "tabela",
          titulo: "Principais comandos DML",
          colunas: ["Comando", "Funcao"],
          linhas: [
            ["SELECT", "Consultar dados"],
            ["INSERT", "Inserir registros"],
            ["UPDATE", "Alterar registros"],
            ["DELETE", "Excluir registros"]
          ]
        },
        {
          tipo: "imagem",
          src: "quadro_comandos_dml.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Quadro 1",
          alt: "Quadro com os principais comandos de manipulacao de registros da DML"
        },
        {
          tipo: "topico",
          titulo: "Tipos de DML",
          texto: "O conteudo apresenta dois tipos principais:"
        },
        {
          tipo: "topico",
          titulo: "DML Procedural",
          lista: [
            "O usuario informa quais dados deseja",
            "O usuario informa como obte-los"
          ]
        },
        {
          tipo: "topico",
          titulo: "DML Nao-Procedural",
          lista: [
            "O usuario informa apenas quais dados deseja",
            "O SGBD decide como obter os dados",
            "A SQL e considerada predominantemente nao-procedural"
          ]
        }
      ]
    },

    {
      id: "query",
      titulo: "🔎 Query (Consulta)",
      blocos: [
        {
          tipo: "texto",
          texto: "Uma query e um comando utilizado para recuperar informacoes do banco de dados."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de query basica",
          texto: "Recupera os nomes dos alunos da tabela alunos.",
          detalhe: "SELECT nome FROM alunos;"
        }
      ]
    },

    {
      id: "estrutura_sql",
      titulo: "📋 Estrutura Básica das Consultas SQL",
      blocos: [
        {
          tipo: "texto",
          texto: "As consultas SQL possuem tres clausulas principais: SELECT, FROM e WHERE."
        },
        {
          tipo: "topico",
          titulo: "Estrutura geral:",
          lista: [
            "`SELECT colunas`",
            "`FROM tabela`",
            "`WHERE condicao;`"
          ]
        },
        {
          tipo: "topico",
          titulo: "SELECT",
          texto: "Define quais colunas serao exibidas.",
          lista: [
            "Exemplo: `SELECT nom_alu FROM alunos;` — retorna os nomes dos alunos"
          ]
        },
        {
          tipo: "imagem",
          src: "fig_select_nomes.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Figura 1",
          alt: "Exemplo de selecao dos nomes de alunos na tabela alunos usando SELECT e FROM"
        },
        {
          tipo: "imagem",
          src: "fig_resultado_select.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Figura 2",
          alt: "Resultado da selecao dos nomes de alunos na tabela alunos"
        },
        {
          tipo: "topico",
          titulo: "FROM",
          texto: "Define a tabela utilizada na consulta.",
          lista: [
            "Exemplo: `FROM alunos`"
          ]
        },
        {
          tipo: "topico",
          titulo: "WHERE",
          texto: "Filtra registros.",
          lista: [
            "Exemplo: `WHERE cod_curso = 10`"
          ]
        },
        {
          tipo: "topico",
          titulo: "Duplicidade em SQL",
          texto: "A SQL permite registros duplicados nos resultados. Para eliminar duplicatas utiliza-se DISTINCT.",
          lista: [
            "Sintaxe: `SELECT DISTINCT coluna FROM tabela;`"
          ]
        },
        {
          tipo: "imagem",
          src: "fig_select_codigos.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Figura 3",
          alt: "Exemplo de selecao dos codigos dos cursos de todos os alunos"
        },
        {
          tipo: "imagem",
          src: "fig_duplicidade_sql.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Figura 4",
          alt: "Resultado mostrando repeticao de registros em consultas SQL sem DISTINCT"
        }
      ]
    },

    {
      id: "insert",
      titulo: "➕ Comando INSERT",
      blocos: [
        {
          tipo: "texto",
          texto: "O comando INSERT adiciona novos registros na tabela."
        },
        {
          tipo: "topico",
          titulo: "Estrutura:",
          lista: [
            "`INSERT INTO tabela`",
            "`VALUES (...);`"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de INSERT",
          texto: "Insere um novo curso na tabela cursos.",
          detalhe: "INSERT INTO cursos VALUES (11, 'Sistemas de Informacao', 180, 1149);"
        },
        {
          tipo: "imagem",
          src: "fig_insert.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Figura 5",
          alt: "Exemplo de insercao de dados na tabela cursos usando o comando INSERT"
        },
        {
          tipo: "topico",
          titulo: "INSERT com definicao de colunas",
          texto: "Tambem e possivel especificar os campos explicitamente. Isso evita erros relacionados a ordem dos atributos.",
          lista: [
            "Exemplo: `INSERT INTO cursos (cod_curso, nome_curso, tot_cred, cod_coord) VALUES (11, 'Sistemas de Informacao', 180, 1149);`"
          ]
        },
        {
          tipo: "imagem",
          src: "fig_insert_colunas.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Figura 6",
          alt: "Exemplo de variacao do comando INSERT especificando explicitamente os campos"
        }
      ]
    },

    {
      id: "delete",
      titulo: "🗑️ Comando DELETE",
      blocos: [
        {
          tipo: "texto",
          texto: "Usado para excluir registros."
        },
        {
          tipo: "topico",
          titulo: "Estrutura:",
          lista: [
            "`DELETE FROM tabela`",
            "`WHERE condicao;`"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de DELETE",
          texto: "Exclui o aluno com matricula 911113.",
          detalhe: "DELETE FROM alunos WHERE mat_alu = 911113;"
        },
        {
          tipo: "imagem",
          src: "fig_delete.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Figura 7",
          alt: "Exemplo de exclusao de registros usando o comando DELETE com WHERE"
        },
        {
          tipo: "destaque",
          texto: "DELETE sem WHERE: `DELETE FROM alunos;` — remove TODOS os registros da tabela. A tabela continua existindo, porem vazia."
        },
        {
          tipo: "destaque",
          texto: "Os comandos DELETE e UPDATE podem causar grandes prejuizos quando executados incorretamente. Principal risco: esquecer a clausula WHERE."
        }
      ]
    },

    {
      id: "update",
      titulo: "✏️ Comando UPDATE",
      blocos: [
        {
          tipo: "texto",
          texto: "Usado para atualizar registros existentes."
        },
        {
          tipo: "topico",
          titulo: "Estrutura:",
          lista: [
            "`UPDATE tabela`",
            "`SET coluna = valor`",
            "`WHERE condicao;`"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de UPDATE",
          texto: "Atualiza o nome do curso com codigo 11.",
          detalhe: "UPDATE cursos SET nome_curso = 'SI – Sistemas de Informacao' WHERE cod_curso = 11;"
        },
        {
          tipo: "imagem",
          src: "fig_update.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Figura 8",
          alt: "Exemplo de alteracao de dados existentes usando o comando UPDATE"
        },
        {
          tipo: "destaque",
          texto: "UPDATE sem WHERE: `UPDATE cursos SET nome_curso = 'Novo Nome';` — atualiza TODOS os registros da tabela."
        }
      ]
    },

    {
      id: "operadores_introducao",
      titulo: "🛠️ Operadores para Otimização de Consultas",
      blocos: [
        {
          tipo: "texto",
          texto: "Os operadores ajudam a otimizar consultas SQL."
        },
        {
          tipo: "topico",
          titulo: "Os operadores permitem:",
          lista: [
            "Criar filtros",
            "Refinar buscas",
            "Realizar calculos",
            "Melhorar consultas SQL"
          ]
        },
        {
          tipo: "lista",
          titulo: "Os principais tipos estudados foram:",
          itens: [
            "Operadores aritmeticos",
            "Operadores de comparacao",
            "Operadores logicos"
          ]
        }
      ]
    },

    {
      id: "operadores_aritmeticos",
      titulo: "➗ Operadores Aritméticos",
      blocos: [
        {
          tipo: "texto",
          texto: "Utilizados em calculos matematicos. So funcionam em colunas numericas."
        },
        {
          tipo: "tabela",
          titulo: "Operadores aritmeticos",
          colunas: ["Operador", "Funcao"],
          linhas: [
            ["+", "Soma"],
            ["-", "Subtracao"],
            ["*", "Multiplicacao"],
            ["/", "Divisao"]
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de operador aritmetico",
          texto: "Calcula o salario anual multiplicando o salario mensal por 12.",
          detalhe: "SELECT nome, salario, salario*12 AS salario_anual FROM empregados;"
        },
        {
          tipo: "topico",
          titulo: "Precedencia de Operadores",
          texto: "A SQL segue prioridade matematica.",
          lista: [
            "Exemplo: `12 * salario + 500` — primeiro multiplica, depois soma"
          ]
        },
        {
          tipo: "topico",
          titulo: "Uso de Parenteses",
          texto: "Os parenteses alteram a ordem de execucao.",
          lista: [
            "Exemplo: `12 * (salario + 500)` — soma primeiro, multiplica depois"
          ]
        }
      ]
    },

    {
      id: "operadores_comparacao",
      titulo: "⚖️ Operadores de Comparação",
      blocos: [
        {
          tipo: "texto",
          texto: "Usados para comparar valores."
        },
        {
          tipo: "tabela",
          titulo: "Operadores de comparacao",
          colunas: ["Operador", "Significado"],
          linhas: [
            ["=",  "Igual"],
            [">",  "Maior"],
            [">=", "Maior ou igual"],
            ["<",  "Menor"],
            ["<=", "Menor ou igual"],
            ["<>", "Diferente"]
          ]
        },
        {
          tipo: "imagem",
          src: "tabela_operadores_comparacao.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Tabela 1",
          alt: "Tabela com os operadores de comparacao utilizados em filtros SQL"
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de operador de comparacao",
          texto: "Retorna matriculas maiores ou iguais a 911113.",
          detalhe: "SELECT * FROM alunos WHERE mat_alu >= 911113;"
        },
        {
          tipo: "imagem",
          src: "fig_operador_maior_igual.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Figura 9",
          alt: "Exemplo de Select usando o operador maior ou igual em consultas SQL"
        }
      ]
    },

    {
      id: "operadores_logicos",
      titulo: "🔗 Operadores Lógicos",
      blocos: [
        {
          tipo: "texto",
          texto: "Combinam condicoes em consultas SQL."
        },
        {
          tipo: "tabela",
          titulo: "Operadores logicos",
          colunas: ["Operador", "Funcao"],
          linhas: [
            ["AND", "Ambas as condicoes devem ser verdadeiras"],
            ["OR",  "Pelo menos uma deve ser verdadeira"],
            ["NOT", "Inverte a condicao"]
          ]
        },
        {
          tipo: "imagem",
          src: "tabela_operadores_logicos.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Tabela 2",
          alt: "Tabela com os operadores logicos AND, OR e NOT"
        },
        {
          tipo: "topico",
          titulo: "Operador AND — mais restritivo",
          texto: "As duas condicoes precisam ser verdadeiras.",
          lista: [
            "Exemplo: `WHERE tot_cred = 4 AND nom_disc = 'BANCO DE DADOS'`"
          ]
        },
        {
          tipo: "imagem",
          src: "fig_operador_and.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Figura 10",
          alt: "Exemplo de Select usando o operador comparativo AND para filtro restritivo"
        },
        {
          tipo: "topico",
          titulo: "Operador OR — mais amplo",
          texto: "Basta uma condicao ser verdadeira.",
          lista: [
            "Exemplo: `WHERE tot_cred = 4 OR nom_disc = 'BANCO DE DADOS'`"
          ]
        },
        {
          tipo: "imagem",
          src: "fig_operador_or.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Figura 11",
          alt: "Exemplo de Select usando o operador comparativo OR para consultas mais amplas"
        },
        {
          tipo: "topico",
          titulo: "Operador NOT",
          texto: "Inverte o resultado logico.",
          lista: [
            "Exemplo: `WHERE NOT cod_curso = 10` — seleciona registros que NAO pertencem ao curso 10"
          ]
        }
      ]
    },

    {
      id: "formulas",
      titulo: "📐 Fórmulas e Métodos",
      blocos: [
        {
          tipo: "topico",
          titulo: "Estrutura Basica SQL",
          lista: [
            "`SELECT colunas`",
            "`FROM tabela`",
            "`WHERE condicao;`"
          ]
        },
        {
          tipo: "topico",
          titulo: "Metodo de Insercao",
          lista: [
            "`INSERT INTO tabela`",
            "`VALUES (...);`"
          ]
        },
        {
          tipo: "topico",
          titulo: "Metodo de Exclusao",
          lista: [
            "`DELETE FROM tabela`",
            "`WHERE condicao;`"
          ]
        },
        {
          tipo: "topico",
          titulo: "Metodo de Atualizacao",
          lista: [
            "`UPDATE tabela`",
            "`SET coluna = valor`",
            "`WHERE condicao;`"
          ]
        },
        {
          tipo: "topico",
          titulo: "Metodos de Comparacao",
          lista: [
            "**Igual:** `WHERE idade = 20`",
            "**Maior:** `WHERE idade > 20`",
            "**Diferente:** `WHERE idade <> 20`"
          ]
        },
        {
          tipo: "topico",
          titulo: "Metodos Logicos",
          lista: [
            "**AND:** `WHERE idade > 18 AND cidade = 'Quixada'`",
            "**OR:** `WHERE idade > 18 OR cidade = 'Quixada'`"
          ]
        },
        {
          tipo: "topico",
          titulo: "Metodo Aritmetico",
          lista: [
            "Exemplo: `SELECT salario * 12 FROM empregados;`"
          ]
        }
      ]
    },

    {
      id: "exemplos",
      titulo: "💡 Exemplos Explicativos",
      blocos: [
        {
          tipo: "exemplo",
          titulo: "Buscar nomes de alunos",
          texto: "Retorna os nomes de todos os alunos da tabela.",
          detalhe: "SELECT nom_alu FROM alunos;"
        },
        {
          tipo: "exemplo",
          titulo: "Buscar codigos de cursos",
          texto: "Retorna os codigos de cursos de todos os alunos.",
          detalhe: "SELECT cod_curso FROM alunos;"
        },
        {
          tipo: "exemplo",
          titulo: "Inserir curso",
          texto: "Insere um novo registro na tabela cursos.",
          detalhe: "INSERT INTO cursos VALUES (11, 'Sistemas de Informacao', 180, 1149);"
        },
        {
          tipo: "exemplo",
          titulo: "Excluir aluno",
          texto: "Remove o aluno com matricula 911113.",
          detalhe: "DELETE FROM alunos WHERE mat_alu = 911113;"
        },
        {
          tipo: "exemplo",
          titulo: "Atualizar curso",
          texto: "Altera o nome do curso com codigo 11.",
          detalhe: "UPDATE cursos SET nome_curso = 'SI – Sistemas de Informacao' WHERE cod_curso = 11;"
        },
        {
          tipo: "exemplo",
          titulo: "Calcular salario anual",
          texto: "Usa operador aritmetico para calcular salario anual.",
          detalhe: "SELECT nome, salario, salario*12 AS salario_anual FROM empregados;"
        },
        {
          tipo: "exemplo",
          titulo: "Filtro usando comparacao",
          texto: "Retorna alunos com matricula maior ou igual a 911113.",
          detalhe: "SELECT * FROM alunos WHERE mat_alu >= 911113;"
        },
        {
          tipo: "exemplo",
          titulo: "Filtro usando AND",
          texto: "Retorna registros onde ambas as condicoes sao verdadeiras.",
          detalhe: "WHERE tot_cred = 4 AND nom_disc = 'BANCO DE DADOS'"
        },
        {
          tipo: "exemplo",
          titulo: "Filtro usando OR",
          texto: "Retorna registros onde pelo menos uma condicao e verdadeira.",
          detalhe: "WHERE tot_cred = 4 OR nom_disc = 'BANCO DE DADOS'"
        }
      ]
    },

    {
      id: "resumo",
      titulo: "🧾 Resumo Final para Revisão Rápida",
      blocos: [
        {
          tipo: "lista",
          itens: [
            "**DML** — responsavel pela manipulacao dos dados",
            "**SELECT** — consulta dados",
            "**INSERT** — adiciona registros",
            "**UPDATE** — altera registros",
            "**DELETE** — remove registros",
            "**WHERE** — filtra resultados",
            "**DISTINCT** — remove duplicatas",
            "**Operadores aritmeticos:** +, -, *, /",
            "**Operadores de comparacao:** =, >, >=, <, <=, <>",
            "**Operadores logicos:** AND, OR, NOT",
            "**AND** e mais restritivo — ambas as condicoes devem ser verdadeiras",
            "**OR** e mais amplo — basta uma condicao ser verdadeira",
            "Parenteses alteram precedencia matematica",
            "DELETE e UPDATE sem WHERE podem afetar toda a tabela"
          ]
        },
        {
          tipo: "lista",
          titulo: "Pontos mais importantes para prova:",
          itens: [
            "Diferenca entre SELECT, INSERT, UPDATE e DELETE",
            "Estrutura basica das consultas SQL",
            "Funcao da clausula WHERE",
            "Diferenca entre AND e OR",
            "Operadores de comparacao",
            "Operadores aritmeticos",
            "Precedencia matematica em SQL",
            "Perigo de UPDATE e DELETE sem WHERE",
            "Conceito de DML",
            "Uso do DISTINCT para eliminar duplicatas"
          ]
        }
      ]
    }
    ]
    },
    //Aula 11 — Refinando Consultas em um Banco de Dados • Parte 1
    {
      aula: "Aula 11 — Refinando Consultas em um Banco de Dados • Parte 1",
      ideia_central: "A cláusula WHERE e seus operadores (LIKE, BETWEEN, IN, IS NULL), combinados com funções de agregação e as cláusulas GROUP BY e ORDER BY, permitem transformar consultas SQL simples em consultas inteligentes e úteis para aplicações reais.",
      secoes: [
        {
          id: "visao",
          titulo: "📖 Visão Geral do Conteúdo",
          blocos: [
            {
              tipo: "texto",
              texto: "Este módulo aborda técnicas para refinar consultas SQL, permitindo selecionar, filtrar, agrupar, ordenar e calcular dados dentro de bancos de dados relacionais."
            },
            {
              tipo: "lista",
              titulo: "Principais temas estudados:",
              itens: [
                "**Cláusula WHERE**",
                "**Operadores:** LIKE, BETWEEN, IN, IS NULL",
                "**Funções de agregação:** COUNT, SUM, AVG, MIN, MAX",
                "**Agrupamento** com GROUP BY",
                "**Ordenação** com ORDER BY"
              ]
            },
            {
              tipo: "destaque",
              texto: "O foco principal do conteúdo é mostrar como transformar consultas simples em consultas mais inteligentes e úteis para aplicações reais."
            }
          ]
        },

        {
          id: "conceitos_sql",
          titulo: "🧠 Conceitos Principais — SQL e Refinamento de Consultas",
          blocos: [
            {
              tipo: "topico",
              titulo: "A linguagem SQL permite:",
              lista: [
                "Inserir dados",
                "Alterar registros",
                "Excluir informações",
                "Consultar dados"
              ]
            },
            {
              tipo: "texto",
              texto: "Em aplicações reais, normalmente não queremos todos os registros da tabela, mas apenas aqueles que atendem determinados critérios. Para isso, utilizamos cláusulas de refinamento."
            }
          ]
        },

        {
          id: "clausulas",
          titulo: "📋 Principais Cláusulas SQL",
          blocos: [
            {
              tipo: "topico",
              titulo: "SELECT",
              texto: "Responsável por definir quais colunas serão exibidas.",
              lista: [
                "Exemplo: `SELECT nome, idade`"
              ]
            },
            {
              tipo: "topico",
              titulo: "FROM",
              texto: "Define de qual tabela os dados serão recuperados.",
              lista: [
                "Exemplo: `FROM alunos`"
              ]
            },
            {
              tipo: "topico",
              titulo: "WHERE",
              texto: "Filtra registros conforme condições específicas. É uma das cláusulas mais importantes da SQL.",
              lista: [
                "Exemplo: `WHERE idade > 18`"
              ]
            },
            {
              tipo: "topico",
              titulo: "GROUP BY",
              texto: "Agrupa registros que possuem valores iguais em determinadas colunas. Muito usada com funções de agregação."
            },
            {
              tipo: "topico",
              titulo: "HAVING",
              texto: "Filtra resultados após agrupamentos. Utilizada junto com GROUP BY."
            },
            {
              tipo: "topico",
              titulo: "ORDER BY",
              texto: "Ordena os resultados.",
              lista: [
                "Crescente: **ASC**",
                "Decrescente: **DESC**"
              ]
            }
          ]
        },

        {
          id: "where",
          titulo: "🔍 Cláusula WHERE",
          blocos: [
            {
              tipo: "texto",
              texto: "A cláusula WHERE é usada para aplicar condições nas consultas."
            },
            {
              tipo: "topico",
              titulo: "Estrutura geral:",
              lista: [
                "`SELECT colunas`",
                "`FROM tabela`",
                "`WHERE condicao;`"
              ]
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo — Filtrar alunos de um curso",
              texto: "Retorna apenas os alunos do curso 10.",
              detalhe: "SELECT * FROM alunos WHERE cod_curso = 10;"
            },
            {
              tipo: "destaque",
              texto: "Ordem operacional das consultas SQL: embora escrevamos SELECT, FROM, WHERE — o banco processa na ordem FROM, WHERE, SELECT. Isso é importante para entender como a consulta funciona internamente."
            }
          ]
        },

        {
          id: "like",
          titulo: "🔤 Operador LIKE",
          blocos: [
            {
              tipo: "texto",
              texto: "O operador LIKE é utilizado para buscas textuais. Permite localizar padrões em strings."
            },
            {
              tipo: "topico",
              titulo: "Sintaxe:",
              lista: [
                "`WHERE campo LIKE 'valor'`"
              ]
            },
            {
              tipo: "topico",
              titulo: "Uso do % (coringa)",
              texto: "O símbolo % representa qualquer sequência de caracteres.",
              lista: [
                "**Texto exato:** `LIKE 'Carlos'` — busca exatamente Carlos",
                "**Contém texto:** `LIKE '%Santos%'` — busca qualquer texto contendo Santos",
                "**Termina com:** `LIKE '%Silva'` — busca textos terminando em Silva",
                "**Começa com:** `LIKE 'Jorge%'` — busca textos iniciando com Jorge"
              ]
            },
            {
              tipo: "imagem",
              src: "fig_like_consulta_sql.png",
              pasta: "imagens_banco_dados/aula_11",
              num: "1",
              alt: "Exemplo de consulta SQL usando o operador Like com % para buscas por padroes textuais em nomes"
            },
            {
              tipo: "topico",
              titulo: "Operador _ (underscore)",
              texto: "Representa exatamente um caractere.",
              lista: [
                "`LIKE '_este'` — aceita: teste, veste, peste",
                "`LIKE 'b_m'` — aceita: bom, bem"
              ]
            },
            {
              tipo: "imagem",
              src: "fig_like_underscore.png",
              pasta: "imagens_banco_dados/aula_11",
              num: "2",
              alt: "Exemplo de consulta SQL usando o operador Like com underscore para representar exatamente um caractere"
            }
          ]
        },

        {
          id: "between",
          titulo: "📏 Operador BETWEEN",
          blocos: [
            {
              tipo: "texto",
              texto: "Usado para trabalhar com intervalos. Muito comum com datas."
            },
            {
              tipo: "topico",
              titulo: "Sintaxe:",
              lista: [
                "`WHERE campo BETWEEN valor1 AND valor2`"
              ]
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo — Intervalo de datas de nascimento",
              texto: "Retorna alunos nascidos entre essas datas.",
              detalhe: "SELECT * FROM alunos WHERE dat_nasc BETWEEN '1980-01-01' AND '1989-12-31';"
            },
            {
              tipo: "imagem",
              src: "fig_between_datas.png",
              pasta: "imagens_banco_dados/aula_11",
              num: "3",
              alt: "Exemplo de consulta SQL usando o operador de comparacao BETWEEN com intervalos de datas"
            }
          ]
        },

        {
          id: "in",
          titulo: "📋 Operador IN",
          blocos: [
            {
              tipo: "texto",
              texto: "Usado para verificar se um valor pertence a uma lista."
            },
            {
              tipo: "topico",
              titulo: "Sintaxe:",
              lista: [
                "`WHERE campo IN (valor1, valor2, valor3)`"
              ]
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo — Filtrar matriculas especificas",
              texto: "Funciona como varios OR. Equivale a: WHERE mat_alu = 922155 OR mat_alu = 926465 OR mat_alu = 915550.",
              detalhe: "WHERE mat_alu IN (922155, 926465, 915550);"
            },
            {
              tipo: "imagem",
              src: "fig_in_consulta.png",
              pasta: "imagens_banco_dados/aula_11",
              num: "4",
              alt: "Exemplo de consulta SQL utilizando o operador de comparacao IN para filtragem baseada em multiplos valores"
            }
          ]
        },

        {
          id: "is_null",
          titulo: "⚠️ Operador IS NULL",
          blocos: [
            {
              tipo: "texto",
              texto: "Usado para verificar campos sem valor."
            },
            {
              tipo: "destaque",
              texto: "NULL nao significa zero; NULL nao significa espaco vazio; significa ausencia de valor."
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo — Buscar alunos sem e-mail",
              texto: "Retorna alunos cujo campo e-mail nao possui valor.",
              detalhe: "SELECT nom_alu, email FROM alunos WHERE email IS NULL;"
            },
            {
              tipo: "imagem",
              src: "fig_is_null.png",
              pasta: "imagens_banco_dados/aula_11",
              num: "5",
              alt: "Exemplo de consulta SQL utilizando o operador IS NULL para buscar registros com campos sem valor"
            },
            {
              tipo: "topico",
              titulo: "Problemas com NULL",
              texto: "Operacoes envolvendo NULL geram resultado desconhecido (UNKNOWN).",
              lista: [
                "Exemplo: `1 < NULL` — nao e verdadeiro; nao e falso; e desconhecido"
              ]
            }
          ]
        },

        {
          id: "agregacao",
          titulo: "📊 Funções de Agregação",
          blocos: [
            {
              tipo: "texto",
              texto: "Sao funcoes usadas para calculos estatisticos."
            },
            {
              tipo: "tabela",
              titulo: "Principais funcoes de agregacao",
              colunas: ["Funcao", "Objetivo"],
              linhas: [
                ["COUNT", "Contar registros"],
                ["SUM",   "Somar valores"],
                ["AVG",   "Media"],
                ["MIN",   "Menor valor"],
                ["MAX",   "Maior valor"]
              ]
            },
            {
              tipo: "imagem",
              src: "quadro_funcoes_agregacao.png",
              pasta: "imagens_banco_dados/aula_11",
              num: "6",
              alt: "Quadro com a relacao das funcoes de agregacao: COUNT, SUM, AVG, MIN e MAX"
            },
            {
              tipo: "topico",
              titulo: "COUNT — Contar registros",
              lista: [
                "Conta todas as linhas da tabela, incluindo linhas com valores NULL.",
                "Exemplo: `SELECT COUNT(*) FROM alunos;`"
              ]
            },
            {
              tipo: "topico",
              titulo: "SUM — Somar valores",
              lista: [
                "Realiza soma de valores numericos.",
                "Ignora valores NULL.",
                "Funciona apenas com numeros.",
                "Exemplo: `SELECT SUM(tot_cred) FROM alunos;`"
              ]
            },
            {
              tipo: "topico",
              titulo: "MIN — Menor valor",
              lista: [
                "Retorna o menor valor.",
                "Exemplo: `SELECT MIN(tot_cred) FROM alunos;`"
              ]
            },
            {
              tipo: "topico",
              titulo: "MAX — Maior valor",
              lista: [
                "Retorna o maior valor.",
                "Exemplo: `SELECT MAX(tot_cred) FROM alunos;`"
              ]
            },
            {
              tipo: "topico",
              titulo: "AVG — Media",
              lista: [
                "Calcula a media.",
                "Pode usar **ALL** — considera repetidos.",
                "Pode usar **DISTINCT** — ignora repetidos.",
                "Exemplo: `SELECT AVG(tot_cred) FROM alunos;`"
              ]
            }
          ]
        },

        {
          id: "groupby",
          titulo: "📂 Agrupamento com GROUP BY",
          blocos: [
            {
              tipo: "texto",
              texto: "GROUP BY agrupa registros. Muito utilizado junto com funcoes agregadas."
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo — Media de creditos por curso",
              texto: "Separa alunos por curso e calcula a media dos creditos de cada curso.",
              detalhe: "SELECT cod_curso, AVG(tot_cred) FROM alunos GROUP BY cod_curso;"
            },
            {
              tipo: "imagem",
              src: "fig_group_by.png",
              pasta: "imagens_banco_dados/aula_11",
              num: "7",
              alt: "Exemplo de Select com funcao de agregacao e agrupamento GROUP BY"
            },
            {
              tipo: "destaque",
              texto: "Regra importante do GROUP BY: todo campo no SELECT deve estar no GROUP BY ou dentro de uma funcao agregada."
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo de consulta INCORRETA com GROUP BY",
              texto: "mat_alu nao esta agrupado nem agregado — isso gera erro.",
              detalhe: "SELECT mat_alu, cod_curso, AVG(tot_cred) FROM alunos GROUP BY cod_curso;"
            },
            {
              tipo: "imagem",
              src: "fig_group_by_incorreto.png",
              pasta: "imagens_banco_dados/aula_11",
              num: "8",
              alt: "Exemplo de Select incorreto usando GROUP BY com campo nao agrupado nem agregado"
            }
          ]
        },

        {
          id: "orderby",
          titulo: "🔃 Ordenação com ORDER BY",
          blocos: [
            {
              tipo: "texto",
              texto: "Usado para ordenar resultados."
            },
            {
              tipo: "topico",
              titulo: "Ordem crescente:",
              lista: [
                "`ORDER BY nome ASC`"
              ]
            },
            {
              tipo: "topico",
              titulo: "Ordem decrescente:",
              lista: [
                "`ORDER BY nome DESC`"
              ]
            },
            {
              tipo: "imagem",
              src: "fig_order_by_desc.png",
              pasta: "imagens_banco_dados/aula_11",
              num: "9",
              alt: "Exemplo de Select com ORDER BY demonstrando ordenacao decrescente de registros"
            },
            {
              tipo: "topico",
              titulo: "Ordenacao por multiplas colunas",
              texto: "Primeiro ordena creditos; depois desempata usando nome.",
              lista: [
                "Exemplo: `ORDER BY tot_cred DESC, nom_alu ASC`"
              ]
            },
            {
              tipo: "imagem",
              src: "fig_order_by_multiplos.png",
              pasta: "imagens_banco_dados/aula_11",
              num: "10",
              alt: "Exemplo de Select com ORDER BY utilizando mais de um campo para ordenacao"
            }
          ]
        },

        {
          id: "formulas",
          titulo: "📐 Fórmulas e Métodos",
          blocos: [
            {
              tipo: "topico",
              titulo: "Estrutura Basica de Consulta SQL",
              lista: [
                "`SELECT colunas`",
                "`FROM tabela`",
                "`WHERE condicao`",
                "`GROUP BY campo`",
                "`ORDER BY campo;`"
              ]
            },
            {
              tipo: "topico",
              titulo: "Metodos de Filtragem",
              lista: [
                "**Igualdade:** `WHERE idade = 20`",
                "**Intervalo:** `WHERE idade BETWEEN 18 AND 30`",
                "**Lista:** `WHERE cidade IN ('Fortaleza', 'Quixadá')`",
                "**Texto:** `WHERE nome LIKE '%Silva%'`"
              ]
            },
            {
              tipo: "topico",
              titulo: "Metodos de Agregacao",
              lista: [
                "**Contagem:** `COUNT(*)`",
                "**Soma:** `SUM(valor)`",
                "**Media:** `AVG(valor)`",
                "**Minimo:** `MIN(valor)`",
                "**Maximo:** `MAX(valor)`"
              ]
            },
            {
              tipo: "topico",
              titulo: "Metodo de Agrupamento",
              texto: "`GROUP BY coluna` — usado para separar registros em grupos e calcular estatisticas por categoria."
            },
            {
              tipo: "topico",
              titulo: "Metodo de Ordenacao",
              lista: [
                "`ORDER BY coluna ASC` — crescente",
                "`ORDER BY coluna DESC` — decrescente"
              ]
            }
          ]
        },

        {
          id: "exemplos",
          titulo: "💡 Exemplos Explicativos",
          blocos: [
            {
              tipo: "exemplo",
              titulo: "Buscar alunos de um curso",
              texto: "Retorna todos os registros de alunos do curso 10.",
              detalhe: "SELECT * FROM alunos WHERE cod_curso = 10;"
            },
            {
              tipo: "exemplo",
              titulo: "Buscar nomes iniciando com Jorge",
              texto: "Utiliza o operador LIKE com % para localizar nomes que comecam com Jorge.",
              detalhe: "SELECT * FROM alunos WHERE nom_alu LIKE 'Jorge%';"
            },
            {
              tipo: "exemplo",
              titulo: "Buscar intervalo de datas",
              texto: "Retorna alunos nascidos entre 1980 e 1989.",
              detalhe: "SELECT * FROM alunos WHERE dat_nasc BETWEEN '1980-01-01' AND '1989-12-31';"
            },
            {
              tipo: "exemplo",
              titulo: "Buscar registros em lista",
              texto: "Filtra alunos por matriculas especificas usando o operador IN.",
              detalhe: "SELECT * FROM alunos WHERE mat_alu IN (922155, 926465, 915550);"
            },
            {
              tipo: "exemplo",
              titulo: "Buscar valores nulos",
              texto: "Retorna alunos que nao possuem e-mail cadastrado.",
              detalhe: "SELECT nom_alu, email FROM alunos WHERE email IS NULL;"
            },
            {
              tipo: "exemplo",
              titulo: "Contar registros",
              texto: "Conta todas as linhas da tabela alunos.",
              detalhe: "SELECT COUNT(*) FROM alunos;"
            },
            {
              tipo: "exemplo",
              titulo: "Somar creditos",
              texto: "Soma o total de creditos de todos os alunos.",
              detalhe: "SELECT SUM(tot_cred) FROM alunos;"
            },
            {
              tipo: "exemplo",
              titulo: "Media por curso",
              texto: "Calcula a media de creditos separada por curso usando GROUP BY.",
              detalhe: "SELECT cod_curso, AVG(tot_cred) FROM alunos GROUP BY cod_curso;"
            },
            {
              tipo: "exemplo",
              titulo: "Ordenar resultados",
              texto: "Ordena os alunos pelo nome em ordem decrescente.",
              detalhe: "SELECT * FROM alunos ORDER BY nom_alu DESC;"
            }
          ]
        },

        {
          id: "resumo",
          titulo: "🧾 Resumo Final para Revisão Rápida",
          blocos: [
            {
              tipo: "lista",
              itens: [
                "**WHERE** — filtra registros",
                "**LIKE** — busca padroes em textos",
                "**%** — qualquer sequencia de caracteres",
                "**_** — exatamente um caractere",
                "**BETWEEN** — intervalo de valores",
                "**IN** — lista de possibilidades",
                "**IS NULL** — verifica ausencia de valor",
                "**COUNT** — conta registros",
                "**SUM** — soma valores",
                "**AVG** — calcula media",
                "**MIN** — menor valor",
                "**MAX** — maior valor",
                "**GROUP BY** — agrupa registros",
                "**ORDER BY** — ordena resultados",
                "**ASC** — crescente",
                "**DESC** — decrescente",
                "Todo campo no SELECT deve estar no GROUP BY ou em funcao agregada",
                "NULL nao e zero nem vazio — e ausencia de valor",
                "Funcoes agregadas ignoram NULL em varios casos"
              ]
            },
            {
              tipo: "lista",
              titulo: "Pontos mais importantes para prova:",
              itens: [
                "Diferenca entre LIKE, IN, BETWEEN e IS NULL",
                "Uso correto do % e _",
                "Funcoes agregadas e finalidade de cada uma",
                "Regra obrigatoria do GROUP BY",
                "Ordenacao crescente e decrescente",
                "Diferenca entre COUNT(*) e outras agregacoes — COUNT(*) conta todas as linhas inclusive com NULL; as demais ignoram NULL",
                "Entendimento de NULL em SQL",
                "Ordem logica de execucao das clausulas SQL: FROM, WHERE, SELECT"
              ]
            }
          ]
        }
      ]
    },
    // Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2
    {
      aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",
      ideia_central: "Funções de agregação resumem grandes conjuntos de dados em valores únicos; HAVING filtra grupos após agrupamento; DISTINCT elimina duplicatas — ferramentas essenciais para transformar dados brutos em informações úteis.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "Principais tópicos desta aula:",
              itens: [
                "**Funções de agregação** — resumir dados em um único valor",
                "**Alias (AS)** — renomear campos calculados",
                "**GROUP BY** — agrupar registros antes de agregar",
                "**HAVING** — filtrar grupos (como WHERE, mas pós-agrupamento)",
                "**Ordem de execução SQL** — muito cobrada em prova",
                "**Valores NULL em agregações** — comportamento especial",
                "**DISTINCT** — eliminar duplicatas no resultado",
                "**DISTINCT em funções de agregação** — contar/somar sem repetição"
              ]
            },
            {
              tipo: "topico",
              titulo: "Funções de agregação — contexto de uso",
              texto: "Permitem resumir grandes conjuntos de dados em valores únicos. São muito utilizadas para:",
              lista: [
                "Relatórios",
                "Estatísticas",
                "Indicadores de negócio",
                "Consultas analíticas"
              ]
            },
            {
              tipo: "topico",
              titulo: "Cláusula DISTINCT — quando é importante",
              lista: [
                "Existem registros repetidos",
                "Deseja-se visualizar apenas valores únicos",
                "É necessário evitar contagens duplicadas"
              ]
            },
            {
              tipo: "topico",
              titulo: "Objetivo principal da aula — ensinar como:",
              lista: [
                "Aplicar agregações básicas",
                "Agrupar resultados",
                "Filtrar grupos",
                "Tratar valores nulos",
                "Eliminar redundâncias"
              ]
            }
          ]
        },

        {
          id: "agregacao",
          titulo: "🧠 Funções de Agregação",
          blocos: [
            {
              tipo: "texto",
              texto: "Funções de agregação processam **diversos valores de uma coluna** e retornam **um único resultado**. Operam sobre uma coluna inteira, não sobre linhas isoladas."
            },
            {
              tipo: "tabela",
              titulo: "🔹 Principais Funções",
              colunas: ["Função", "Descrição", "Uso típico"],
              linhas: [
                ["AVG(col)",   "Calcula a média",        "Média salarial, nota, créditos"],
                ["SUM(col)",   "Soma total",              "Total vendido, soma financeira"],
                ["COUNT(*)",   "Conta todas as linhas",   "Quantidade de registros"],
                ["COUNT(col)", "Conta valores não nulos", "Campos preenchidos"],
                ["MAX(col)",   "Maior valor",             "Maior salário, data mais recente"],
                ["MIN(col)",   "Menor valor",             "Menor preço, data mais antiga"]
              ]
            },
            {
              tipo: "topico",
              titulo: "📌 AVG() — Média",
              lista: [
                "Calcula o valor médio de uma coluna numérica",
                "Ignora valores NULL automaticamente",
                "Uso: média salarial, média de notas, média de créditos"
              ],
              codigo: "SELECT AVG(coluna)\nFROM tabela;"
            },
            {
              tipo: "topico",
              titulo: "📌 SUM() — Soma",
              lista: [
                "Soma todos os valores de uma coluna",
                "Ignora valores NULL",
                "Uso: total vendido, soma de créditos, total financeiro"
              ],
              codigo: "SELECT SUM(coluna)\nFROM tabela;"
            },
            {
              tipo: "topico",
              titulo: "📌 COUNT() — Contagem",
              lista: [
                "`COUNT(*)` → conta **todas** as linhas, inclusive com NULL",
                "`COUNT(coluna)` → conta apenas valores **não nulos**",
                "`COUNT(DISTINCT coluna)` → conta valores **únicos**",
                "⚠ `COUNT(DISTINCT *)` é **inválido** no SQL padrão",
                "Uso: quantidade de alunos, número de vendas, total de registros"
              ],
              codigo: "SELECT COUNT(*) FROM tabela;            -- conta tudo\nSELECT COUNT(col) FROM tabela;          -- ignora NULL\nSELECT COUNT(DISTINCT col) FROM tabela; -- únicos"
            },
            {
              tipo: "topico",
              titulo: "📌 MAX() e MIN()",
              lista: [
                "**MAX** → retorna o maior valor da coluna — uso: maior salário, maior nota, data mais recente",
                "**MIN** → retorna o menor valor da coluna — uso: menor nota, menor preço, data mais antiga",
                "Funcionam com números, datas e textos"
              ],
              codigo: "SELECT MAX(coluna), MIN(coluna)\nFROM tabela;"
            }
          ]
        },

        {
          id: "alias",
          titulo: "📊 Agregação Básica e Alias (AS)",
          blocos: [
            {
              tipo: "texto",
              texto: "É o uso direto de funções agregadas sobre registros filtrados, normalmente combinado com **WHERE** para restringir o conjunto."
            },
            {
              tipo: "topico",
              titulo: "🔹 Exemplo — Média com filtro WHERE",
              lista: [
                "Busca a tabela `alunos`",
                "Filtra alunos do curso 10",
                "Calcula a média de `tot_cred`"
              ],
              codigo: "SELECT AVG(tot_cred)\nFROM alunos\nWHERE cod_curso = 10;"
            },
            {
              tipo: "imagem",
              src: "fig_selecao_media_creditos.png",
              pasta: "imagens_banco_dados/aula_12",
              num: "1",
              alt: "Seleção de alunos com a média dos totais de créditos usando critério código do curso = 10"
            },
            {
              tipo: "topico",
              titulo: "🔹 Alias (AS) — Renomear o resultado",
              texto: "Melhora a leitura do resultado ao dar um nome descritivo ao campo calculado.",
              lista: [
                "Sem alias: o cabeçalho exibe `AVG(tot_cred)` — difícil de ler",
                "Com alias: o cabeçalho exibe `media_total_credito` — claro e objetivo"
              ],
              codigo: "SELECT AVG(tot_cred) AS media_total_credito\nFROM alunos\nWHERE cod_curso = 10;"
            },
            {
              tipo: "imagem",
              src: "fig_selecao_media_alias.png",
              pasta: "imagens_banco_dados/aula_12",
              num: "2",
              alt: "Seleção de alunos com média de créditos e alias para nomear o campo calculado"
            }
          ]
        },

        {
          id: "groupby",
          titulo: "📂 Agrupamento com GROUP BY",
          blocos: [
            {
              tipo: "texto",
              texto: "Permite dividir os registros em grupos antes de aplicar as funções de agregação. Cada grupo recebe seu próprio valor calculado."
            },
            {
              tipo: "topico",
              titulo: "🔹 Estrutura",
              codigo: "SELECT coluna, agregacao(coluna)\nFROM tabela\nGROUP BY coluna;"
            },
            {
              tipo: "topico",
              titulo: "🔹 Exemplo — Média de créditos por curso",
              lista: [
                "SQL divide os registros por `cod_curso`",
                "Cria um grupo para cada curso",
                "Calcula a média separadamente para cada grupo"
              ],
              codigo: "SELECT cod_curso,\n       AVG(tot_cred) AS media_tot_cred\nFROM alunos\nGROUP BY cod_curso;"
            },
            {
              tipo: "tabela",
              titulo: "Exemplo prático de agrupamento",
              colunas: ["Curso (entrada)", "Créditos", "→", "Curso (resultado)", "Média"],
              linhas: [
                ["10", "80",  "→", "10", "90"],
                ["10", "100", "→", "20", "130"],
                ["20", "120", "→", "",   ""],
                ["20", "140", "→", "",   ""]
              ]
            },
            {
              tipo: "imagem",
              src: "fig_agregacao_group_by.png",
              pasta: "imagens_banco_dados/aula_12",
              num: "3",
              alt: "Exemplo de agregação com agrupamento — GROUP BY divide registros e calcula média por grupo"
            },
            {
              tipo: "destaque",
              texto: "📌 Sem GROUP BY, toda a tabela é tratada como **um único grupo** — a agregação retorna um valor global."
            }
          ]
        },

        {
          id: "having",
          titulo: "🔍 Cláusula HAVING",
          blocos: [
            {
              tipo: "texto",
              texto: "Filtra os **grupos** criados pelo GROUP BY — assim como WHERE filtra linhas individuais, HAVING filtra grupos após o agrupamento."
            },
            {
              tipo: "tabela",
              titulo: "🔹 WHERE vs HAVING",
              colunas: ["Cláusula", "Atua sobre", "Momento"],
              linhas: [
                ["WHERE",  "Linhas individuais", "Antes do agrupamento"],
                ["HAVING", "Grupos",             "Após o agrupamento"]
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Exemplo — Cursos com média maior que 100",
              lista: [
                "Agrupa registros por curso",
                "Calcula a média de créditos de cada grupo",
                "Remove grupos cuja média seja ≤ 100"
              ],
              codigo: "SELECT cod_curso,\n       AVG(tot_cred) AS media_tot_cred\nFROM alunos\nGROUP BY cod_curso\nHAVING AVG(tot_cred) > 100;"
            },
            {
              tipo: "imagem",
              src: "fig_exemplo_clausula_having.png",
              pasta: "imagens_banco_dados/aula_12",
              num: "4",
              alt: "Exemplo de cláusula HAVING filtrando grupos após agrupamento"
            },
            {
              tipo: "destaque",
              texto: "📌 Regra para prova: todo atributo usado no HAVING **sem** função de agregação deve estar no GROUP BY."
            }
          ]
        },

        {
          id: "execucao",
          titulo: "⚙️ Ordem de Execução SQL",
          blocos: [
            {
              tipo: "texto",
              texto: "A ordem de **escrita** da query é diferente da ordem de **execução** interna do banco. Muito cobrado em prova."
            },
            {
              tipo: "tabela",
              titulo: "🔹 Ordem lógica de execução",
              colunas: ["Passo", "Cláusula", "O que faz"],
              linhas: [
                ["1º", "FROM",     "Seleciona a(s) tabela(s)"],
                ["2º", "WHERE",    "Filtra linhas individuais"],
                ["3º", "GROUP BY", "Agrupa os registros filtrados"],
                ["4º", "HAVING",   "Filtra os grupos"],
                ["5º", "SELECT",   "Define o resultado final"],
                ["6º", "ORDER BY", "Ordena o resultado"]
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Ordem de escrita da query",
              codigo: "SELECT\nFROM\nWHERE\nGROUP BY\nHAVING\nORDER BY"
            }
          ]
        },

        {
          id: "nulos",
          titulo: "⚠️ Valores NULL em Agregações",
          blocos: [
            {
              tipo: "texto",
              texto: "Valores NULL recebem tratamento especial nas funções de agregação."
            },
            {
              tipo: "topico",
              titulo: "🔹 Regra geral",
              lista: [
                "**AVG, SUM, MAX, MIN, COUNT(coluna)** → **ignoram** NULL",
                "**COUNT(*)** → **conta** todas as linhas, inclusive com NULL"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Exemplo com NULL",
              texto: "Tabela com créditos: 100, NULL, 200. A consulta abaixo retorna 150 — o NULL é ignorado.",
              codigo: "SELECT AVG(tot_cred)\nFROM alunos;\n-- Resultado: 150  (NULL ignorado)"
            },
            {
              tipo: "destaque",
              texto: "📌 Para prova: se **todos** os valores da coluna forem NULL → COUNT() retorna 0; AVG/SUM/MAX/MIN retornam NULL."
            }
          ]
        },

        {
          id: "distinct",
          titulo: "🔄 Cláusula DISTINCT",
          blocos: [
            {
              tipo: "texto",
              texto: "Remove **duplicatas** do resultado de uma consulta. Útil quando existem registros repetidos e deseja-se visualizar apenas valores únicos."
            },
            {
              tipo: "topico",
              titulo: "🔹 Sem DISTINCT × Com DISTINCT",
              lista: [
                "Sem DISTINCT: pode retornar cursos 10, 10, 20, 20, 30",
                "Com DISTINCT: retorna apenas 10, 20, 30"
              ],
              codigo: "-- Sem DISTINCT (com duplicatas):\nSELECT cod_curso FROM alunos;\n\n-- Com DISTINCT (valores únicos):\nSELECT DISTINCT cod_curso FROM alunos;"
            },
            {
              tipo: "topico",
              titulo: "🔹 Utilidade — evita repetição de:",
              lista: [
                "Cursos",
                "Departamentos",
                "Categorias",
                "Códigos"
              ]
            },
            {
              tipo: "imagem",
              src: "fig_consulta_sem_distinct.png",
              pasta: "imagens_banco_dados/aula_12",
              num: "5",
              alt: "Consulta simples de código de cursos — resultado com duplicatas"
            },
            {
              tipo: "imagem",
              src: "fig_consulta_com_distinct.png",
              pasta: "imagens_banco_dados/aula_12",
              num: "6",
              alt: "Consulta usando DISTINCT — duplicatas eliminadas do resultado"
            },
            {
              tipo: "topico",
              titulo: "🔹 DISTINCT em Funções de Agregação",
              lista: [
                "Remove duplicatas **antes** de aplicar a agregação",
                "Útil para contar itens únicos (ex: alunos que cursaram uma disciplina mais de uma vez)",
                "Quando usar: matrículas repetidas, vendas duplicadas, registros históricos",
                "⚠ `COUNT(DISTINCT *)` é **inválido** — usar sempre com nome de coluna",
                "Palavra-chave **ALL** (padrão) mantém duplicatas — normalmente desnecessária"
              ],
              codigo: "-- Conta alunos únicos na disciplina 200070 no ano de 2001:\nSELECT COUNT(DISTINCT mat_alu)\nFROM historicos_escolares\nWHERE cod_disc = 200070\n  AND ano = 2001;"
            },
            {
              tipo: "imagem",
              src: "fig_distinct_agregacao_count.png",
              pasta: "imagens_banco_dados/aula_12",
              num: "7",
              alt: "Consulta usando DISTINCT numa função de agregação COUNT — contagem sem duplicidade"
            }
          ]
        },

        {
          id: "formulas",
          titulo: "📐 Fórmulas e Métodos",
          blocos: [
            {
              tipo: "topico",
              titulo: "Média",
              texto: "`AVG(coluna)` — calcular valor médio."
            },
            {
              tipo: "topico",
              titulo: "Soma",
              texto: "`SUM(coluna)` — totalizar valores."
            },
            {
              tipo: "topico",
              titulo: "Contagem",
              lista: [
                "`COUNT(*)` — conta todas as linhas",
                "`COUNT(coluna)` — conta valores não nulos",
                "`COUNT(DISTINCT coluna)` — conta valores únicos"
              ]
            },
            {
              tipo: "topico",
              titulo: "Máximo",
              texto: "`MAX(coluna)` — maior valor."
            },
            {
              tipo: "topico",
              titulo: "Mínimo",
              texto: "`MIN(coluna)` — menor valor."
            },
            {
              tipo: "topico",
              titulo: "Agrupamento",
              texto: "`GROUP BY coluna` — divide registros em grupos."
            },
            {
              tipo: "topico",
              titulo: "Filtro de grupos",
              texto: "`HAVING condição` — filtra grupos após agrupamento."
            },
            {
              tipo: "topico",
              titulo: "Remoção de duplicatas",
              texto: "`DISTINCT` — elimina duplicatas do resultado."
            }
          ]
        },

        {
          id: "exemplos",
          titulo: "💡 Exemplos Explicativos",
          blocos: [
            {
              tipo: "exemplo",
              titulo: "Exemplo 1 — Média geral",
              texto: "Calcular a média de notas de todos os alunos sem filtro.",
              detalhe: "👉 SELECT AVG(nota) FROM alunos;"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Média por turma (GROUP BY)",
              texto: "Calcular a média de notas separada por turma.",
              detalhe: "👉 SELECT turma, AVG(nota) FROM alunos GROUP BY turma;"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Filtrar grupos (HAVING)",
              texto: "Mostrar apenas turmas com média superior a 7.",
              detalhe: "👉 SELECT turma, AVG(nota) FROM alunos GROUP BY turma HAVING AVG(nota) > 7;"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Valores únicos (DISTINCT)",
              texto: "Listar todas as cidades dos clientes sem repetição.",
              detalhe: "👉 SELECT DISTINCT cidade FROM clientes;"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 5 — Contagem de alunos únicos",
              texto: "Contar alunos distintos que cursaram uma disciplina, mesmo que tenham cursado mais de uma vez.",
              detalhe: "👉 SELECT COUNT(DISTINCT mat_alu) FROM historicos_escolares WHERE cod_disc = 200070 AND ano = 2001;"
            }
          ]
        },

        {
          id: "resumo",
          titulo: "🧾 Resumo Final para Revisão Rápida",
          blocos: [
            {
              tipo: "lista",
              itens: [
                "**AVG** → média · **SUM** → soma · **COUNT** → contagem · **MAX** → maior · **MIN** → menor",
                "**COUNT(*)** conta tudo (inclusive NULL) · **COUNT(col)** ignora NULL",
                "**Alias (AS)** → renomeia campos calculados para melhor leitura",
                "**GROUP BY** → divide registros em grupos para agregação separada",
                "**HAVING** → filtra grupos após agrupamento (WHERE filtra linhas antes)",
                "**NULL** → ignorado por AVG/SUM/MAX/MIN/COUNT(col); COUNT(*) inclui",
                "**DISTINCT** → remove duplicatas do resultado ou de dentro de agregações",
                "**COUNT(DISTINCT col)** → válido · **COUNT(DISTINCT *)** → inválido"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Ordem de execução (decorar para prova)",
              codigo: "1º FROM → 2º WHERE → 3º GROUP BY → 4º HAVING → 5º SELECT → 6º ORDER BY"
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave: O refinamento de consultas transforma dados brutos em informações úteis para análise e tomada de decisão. WHERE filtra linhas | GROUP BY agrupa | HAVING filtra grupos | DISTINCT elimina duplicatas."
            }
          ]
        }

      ]
    },
    // Aula 13 - Consultas Aninhadas e Junções
    {
    aula: "Aula 13 — Consultas Aninhadas e Junções",
    ideia_central: "Consultas aninhadas permitem usar o resultado de um SELECT dentro de outro; JOINs combinam tabelas relacionadas — técnicas essenciais para recuperar informações complexas de bancos de dados relacionais.",
    secoes: [
    {
    id: "visao",
    titulo: "📖 Visão Geral",
    blocos: [
    {
    tipo: "texto",
    texto: "O material aborda técnicas avançadas de consultas em SQL, focando em consultas aninhadas (subqueries) e junções (JOINs) entre tabelas, com uso de chaves primárias, chaves estrangeiras e operadores relacionais."
    },
    {
    tipo: "lista",
    titulo: "Objetivo principal — mostrar como recuperar informações complexas utilizando:",
    itens: [
    "Consultas dentro de consultas",
    "Combinação de múltiplas tabelas",
    "Filtros avançados",
    "Operadores de comparação"
    ]
    },
    {
    tipo: "lista",
    titulo: "Principais tópicos desta aula:",
    itens: [
    "Consultas Aninhadas Tipo I — subconsulta independente, executa uma vez, usa IN / NOT IN",
    "Consultas Aninhadas Tipo II — subconsulta correlacionada, executa várias vezes, usa EXISTS / NOT EXISTS",
    "Subconsultas na cláusula FROM — geram tabelas derivadas (visões inline)",
    "Produto Cartesiano — combinação de todas as linhas de duas tabelas",
    "INNER JOIN — apenas registros com correspondência nas duas tabelas",
    "LEFT JOIN — todos da esquerda, sem correspondência vira NULL",
    "RIGHT JOIN — todos da direita, sem correspondência vira NULL",
    "FULL OUTER JOIN — todos os registros das duas tabelas"
    ]
    }
    ]
    },
    {
      id: "subqueries",
      titulo: "🧠 Consultas Aninhadas (Subqueries)",
      blocos: [
        {
          tipo: "texto",
          texto: "Uma **consulta aninhada** é uma instrução `SELECT` escrita dentro de outra instrução `SELECT`. Também chamadas de **subconsultas** ou **subqueries**, elas permitem que o resultado de uma consulta seja usado como base para outra."
        },
        {
          tipo: "topico",
          titulo: "🔹 Onde podem aparecer",
          lista: [
            "Cláusula `WHERE`",
            "Cláusula `HAVING`",
            "Cláusula `FROM`"
          ]
        },
        {
          tipo: "topico",
          titulo: "🔹 Estrutura básica",
          codigo: "SELECT ...\nFROM ...\nWHERE campo IN (\n  SELECT ...\n);"
        }
      ]
    },

    {
      id: "tipo1",
      titulo: "📌 Consultas Aninhadas Tipo I",
      blocos: [
        {
          tipo: "texto",
          texto: "As consultas Tipo I executam **apenas uma vez**, funcionam como um procedimento independente e **não dependem da consulta externa**. Normalmente utilizam os operadores `IN` e `NOT IN`. A consulta interna gera um conjunto de resultados que será utilizado pela consulta externa."
        },
        {
          tipo: "topico",
          titulo: "🔹 Fluxo de execução",
          lista: [
            "1. A subconsulta executa primeiro",
            "2. O resultado é armazenado",
            "3. A consulta principal usa esse resultado como filtro"
          ]
        },
        {
          tipo: "topico",
          titulo: "🔹 Características importantes",
          lista: [
            "Não há referência à consulta externa",
            "Boa para filtros simples",
            "Muito usada em `SELECT`, `DELETE` e verificações com `IN` e `NOT IN`"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo — Alunos aprovados (Tipo I com IN)",
          texto: "A subconsulta retorna as matrículas dos alunos com média ≥ 7 no ano de 2001:",
          detalhe: "SELECT mat_alu\nFROM historicos_escolares\nWHERE media >= 7 AND ano = 2001"
        },
        {
          tipo: "texto",
          texto: "A consulta principal usa esse resultado para exibir nome, curso e total de créditos dos alunos aprovados:",
          codigo: "SELECT nom_alu, cod_curso, tot_cred\nFROM alunos\nWHERE mat_alu IN (\n  SELECT mat_alu\n  FROM historicos_escolares\n  WHERE media >= 7 AND ano = 2001\n);"
        },
        {
          tipo: "imagem",
          src: "figura_consulta_tipo1_sql.png",
          pasta: "imagens_banco_dados/aula_13",
          alt: "Exemplo de consulta aninhada Tipo I utilizando IN para filtrar alunos com média maior ou igual a 7",
          pagina: 8,
          parte_do_conteudo: "Consultas Aninhadas Tipo I",
          explicacao: "Demonstra uma subconsulta utilizando IN para filtrar alunos com média maior ou igual a 7.",
          id_figura: "figura_consulta_tipo1_sql",
          num: 1
        },
        {
          tipo: "topico",
          titulo: "🔹 Uso com DELETE",
          texto: "As subconsultas Tipo I também podem ser usadas para exclusões condicionais.",
          lista: [
            "Excluir alunos com média menor que 7",
            "Verificar os dados em outra tabela"
          ]
        },
        {
          tipo: "topico",
          titulo: "🔹 Operador NOT IN — diferença entre conjuntos",
          texto: "O operador `NOT IN` retorna elementos que **não existem** em outra tabela. Funciona como uma operação de diferença entre conjuntos (`Tabela A - Tabela B`): retorna apenas os elementos presentes na primeira tabela que não aparecem na segunda.",
          lista: [
            "Cursos sem alunos",
            "Produtos sem vendas",
            "Funcionários sem departamento"
          ]
        },
        {
          tipo: "imagem",
          src: "figura_not_in_diferenca.png",
          pasta: "imagens_banco_dados/aula_13",
          alt: "Exemplo de consulta usando NOT IN para encontrar registros inexistentes em outra tabela — diferença entre conjuntos",
          pagina: 10,
          parte_do_conteudo: "Operador NOT IN",
          explicacao: "Mostra como encontrar registros inexistentes em outra tabela utilizando diferença entre conjuntos.",
          id_figura: "figura_not_in_diferenca",
          num: 2
        }
      ]
    },

    {
      id: "tipo2",
      titulo: "📌 Consultas Aninhadas Tipo II (Correlacionadas)",
      blocos: [
        {
          tipo: "texto",
          texto: "As consultas Tipo II são mais complexas. Também chamadas de **subconsultas correlacionadas**, elas **dependem da consulta externa** e executam **várias vezes** — uma vez para cada linha da consulta principal."
        },
        {
          tipo: "topico",
          titulo: "🔹 Fluxo de execução",
          lista: [
            "1. A consulta externa seleciona uma linha",
            "2. A consulta interna executa usando os valores dessa linha",
            "3. O processo se repete para cada linha — funciona como um laço externo + laço interno"
          ]
        },
        {
          tipo: "tabela",
          titulo: "🔹 Diferença entre Tipo I e Tipo II",
          colunas: ["Tipo I", "Tipo II"],
          linhas: [
            ["Executa uma vez", "Executa várias vezes"],
            ["Não depende da externa", "Depende da externa"],
            ["Mais simples", "Mais complexa"],
            ["Usa muito IN", "Usa muito EXISTS"]
          ]
        },
        {
          tipo: "topico",
          titulo: "🔹 Operadores EXISTS e NOT EXISTS",
          lista: [
            "**EXISTS** → retorna verdadeiro quando a subconsulta retorna uma ou mais linhas",
            "**NOT EXISTS** → retorna verdadeiro quando a subconsulta não retorna linhas"
          ]
        },
        {
          tipo: "topico",
          titulo: "🔹 Estrutura com EXISTS",
          codigo: "SELECT ...\nFROM tabelaA\nWHERE EXISTS (\n  SELECT *\n  FROM tabelaB\n  WHERE tabelaA.id = tabelaB.id\n);"
        },
        {
          tipo: "topico",
          titulo: "🔹 Estrutura com NOT EXISTS",
          codigo: "SELECT ...\nFROM tabelaA\nWHERE NOT EXISTS (\n  SELECT *\n  FROM tabelaB\n  WHERE tabelaA.id = tabelaB.id\n);"
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo — Cursos sem alunos (NOT EXISTS)",
          texto: "A consulta percorre os cursos e, para cada um, verifica se existe algum aluno relacionado. Se não existir, o curso é retornado."
        },
        {
          tipo: "imagem",
          src: "figura_subconsulta_correlacionada.png",
          pasta: "imagens_banco_dados/aula_13",
          alt: "Exemplo de consulta aninhada Tipo II demonstrando NOT EXISTS e execução repetida da subconsulta",
          pagina: 12,
          parte_do_conteudo: "Consultas correlacionadas",
          explicacao: "Demonstra o funcionamento de NOT EXISTS e execução repetida da subconsulta.",
          id_figura: "figura_subconsulta_correlacionada",
          num: 3
        }
      ]
    },

    {
      id: "subquery_from",
      titulo: "📂 Subconsultas na Cláusula FROM",
      blocos: [
        {
          tipo: "texto",
          texto: "O SQL permite usar subconsultas dentro do `FROM`. Qualquer consulta SQL retorna uma relação (tabela), e essa tabela pode ser usada dentro de outra consulta. As subconsultas no `FROM` geram **tabelas temporárias**, também chamadas de **tabelas derivadas** ou **visões inline**."
        },
        {
          tipo: "topico",
          titulo: "🔹 Estrutura",
          codigo: "SELECT ...\nFROM (\n  SELECT ...\n) AS alias;"
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo — Média geral dos alunos",
          texto: "Uma subconsulta calcula a média geral dos alunos. A consulta externa utiliza esse resultado como tabela."
        },
        {
          tipo: "topico",
          titulo: "🔹 Uso com GROUP BY",
          texto: "Quando há funções agregadas (`AVG`, `SUM`, `COUNT`) dentro da subconsulta do `FROM`, geralmente o `GROUP BY` é necessário para que cada grupo gere uma linha na tabela derivada."
        },
        {
          tipo: "lista",
          titulo: "Vantagens:",
          itens: [
            "Organização da consulta",
            "Reutilização de resultados intermediários",
            "Legibilidade",
            "Modularização da consulta"
          ]
        },
        {
          tipo: "imagem",
          src: "figura_subconsulta_from.png",
          pasta: "imagens_banco_dados/aula_13",
          alt: "Exemplo de subconsulta na cláusula FROM criando tabela derivada com cálculo de média e aliases",
          pagina: 14,
          parte_do_conteudo: "Subconsulta no FROM",
          explicacao: "Mostra a criação de uma tabela derivada usando cálculo de média e aliases.",
          id_figura: "figura_subconsulta_from",
          num: 4
        }
      ]
    },

    {
      id: "joins",
      titulo: "🔗 Junções (JOINs)",
      blocos: [
        {
          tipo: "texto",
          texto: "Junções servem para **combinar tabelas relacionadas**. A relação geralmente ocorre por **chave primária** e **chave estrangeira**."
        },
        {
          tipo: "subtitulo",
          texto: "Produto Cartesiano"
        },
        {
          tipo: "texto",
          texto: "O produto cartesiano combina cada linha da tabela A com cada linha da tabela B."
        },
        {
          tipo: "lista",
          titulo: "Características:",
          itens: [
            "Gera muitas combinações",
            "Pode produzir resultados gigantes",
            "Normalmente precisa de filtros"
          ]
        },
        {
          tipo: "topico",
          titulo: "🔹 Estrutura",
          codigo: "SELECT ...\nFROM tabela1, tabela2\nWHERE tabela1.id = tabela2.id;"
        },
        {
          tipo: "topico",
          titulo: "🔹 Relação entre tabelas no WHERE",
          texto: "No `WHERE` definimos a relação entre as tabelas.",
          lista: [
            "Exemplo de chave estrangeira: `alunos.cod_curso → cursos.cod_curso`"
          ]
        },
        {
          tipo: "imagem",
          src: "figura_produto_cartesiano.png",
          pasta: "imagens_banco_dados/aula_13",
          alt: "Exemplo de consulta utilizando produto cartesiano com relação por chave estrangeira",
          pagina: 16,
          parte_do_conteudo: "Produto Cartesiano",
          explicacao: "Demonstra combinação de tabelas usando relação por chave estrangeira.",
          id_figura: "figura_produto_cartesiano",
          num: 5
        },
        {
          tipo: "subtitulo",
          texto: "INNER JOIN"
        },
        {
          tipo: "texto",
          texto: "O `INNER JOIN` retorna **apenas os registros que possuem correspondência nas duas tabelas**. Se não houver relação, o registro não aparece. Funciona como uma **interseção de conjuntos**."
        },
        {
          tipo: "topico",
          titulo: "🔹 Estrutura",
          codigo: "SELECT ...\nFROM tabelaA\nINNER JOIN tabelaB\nON tabelaA.id = tabelaB.id;"
        },
        {
          tipo: "topico",
          titulo: "🔹 Cuidados com NULL",
          lista: [
            "Valores `NULL` não combinam automaticamente",
            "Para tratar valores nulos, usar `IS NULL` ou `IS NOT NULL`"
          ]
        },
        {
          tipo: "imagem",
          src: "figura_inner_join.png",
          pasta: "imagens_banco_dados/aula_13",
          alt: "Exemplo de consulta utilizando INNER JOIN retornando apenas registros relacionados nas duas tabelas",
          pagina: 18,
          parte_do_conteudo: "INNER JOIN",
          explicacao: "Demonstra retorno apenas de registros relacionados nas duas tabelas.",
          id_figura: "figura_inner_join",
          num: 6
        },
        {
          tipo: "imagem",
          src: "figura_teoria_conjuntos_inner.png",
          pasta: "imagens_banco_dados/aula_13",
          alt: "Comparativo do INNER JOIN com teoria dos conjuntos — interseção entre tabelas",
          pagina: 19,
          parte_do_conteudo: "INNER JOIN",
          explicacao: "Representa visualmente a interseção entre conjuntos.",
          id_figura: "figura_teoria_conjuntos_inner",
          num: 7
        },
        {
          tipo: "subtitulo",
          texto: "Junção Externa (OUTER JOIN)"
        },
        {
          tipo: "texto",
          texto: "A junção externa **mantém registros mesmo sem correspondência** na outra tabela. Os campos sem correspondência recebem o valor `NULL`."
        },
        {
          tipo: "lista",
          titulo: "Tipos:",
          itens: [
            "`LEFT JOIN`",
            "`RIGHT JOIN`",
            "`FULL OUTER JOIN`"
          ]
        },
        {
          tipo: "topico",
          titulo: "🔹 LEFT JOIN",
          lista: [
            "Retorna **todos** os registros da tabela esquerda",
            "Mesmo sem correspondência na tabela direita",
            "Quando não houver correspondência, os campos da direita ficam `NULL`"
          ],
          codigo: "SELECT ...\nFROM tabelaA\nLEFT JOIN tabelaB\nON tabelaA.id = tabelaB.id;"
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo — LEFT JOIN",
          texto: "Aluno sem curso: o aluno aparece no resultado, mas os campos do curso ficam NULL."
        },
        {
          tipo: "imagem",
          src: "figura_left_join.png",
          pasta: "imagens_banco_dados/aula_13",
          alt: "Comparativo do LEFT JOIN com teoria dos conjuntos — todos os elementos da esquerda são mantidos",
          pagina: 20,
          parte_do_conteudo: "LEFT JOIN",
          explicacao: "Mostra como todos os elementos da esquerda são mantidos.",
          id_figura: "figura_left_join",
          num: 8
        },
        {
          tipo: "topico",
          titulo: "🔹 RIGHT JOIN",
          lista: [
            "É o inverso do LEFT JOIN",
            "Retorna **todos** os registros da tabela direita",
            "Mesmo sem correspondência na tabela esquerda",
            "Quando não houver correspondência, os campos da esquerda ficam `NULL`"
          ],
          codigo: "SELECT ...\nFROM tabelaA\nRIGHT JOIN tabelaB\nON tabelaA.id = tabelaB.id;"
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo — RIGHT JOIN",
          texto: "Cursos sem alunos: os cursos aparecem no resultado, mas os dados dos alunos ficam NULL."
        },
        {
          tipo: "imagem",
          src: "figura_right_join.png",
          pasta: "imagens_banco_dados/aula_13",
          alt: "Comparativo do RIGHT JOIN com teoria dos conjuntos — todos os elementos da direita são mantidos",
          pagina: 22,
          parte_do_conteudo: "RIGHT JOIN",
          explicacao: "Mostra como todos os elementos da direita são mantidos.",
          id_figura: "figura_right_join",
          num: 9
        },
        {
          tipo: "topico",
          titulo: "🔹 FULL OUTER JOIN",
          lista: [
            "Retorna **todos** os registros das duas tabelas",
            "Inclui correspondentes",
            "Inclui não correspondentes",
            "Quando não houver correspondência, os campos ausentes ficam `NULL`"
          ],
          codigo: "SELECT ...\nFROM tabelaA\nFULL OUTER JOIN tabelaB\nON tabelaA.id = tabelaB.id;"
        },
        {
          tipo: "imagem",
          src: "figura_full_outer_join.png",
          pasta: "imagens_banco_dados/aula_13",
          alt: "Comparativo do FULL OUTER JOIN — união completa das tabelas incluindo registros sem correspondência",
          pagina: 24,
          parte_do_conteudo: "FULL OUTER JOIN",
          explicacao: "Representa a união completa das tabelas, incluindo registros sem correspondência.",
          id_figura: "figura_full_outer_join",
          num: 10
        }
      ]
    },

    {
      id: "formulas_metodos",
      titulo: "🔧 Fórmulas e Métodos",
      blocos: [
        {
          tipo: "topico",
          titulo: "🔹 Estrutura básica de subconsulta",
          codigo: "SELECT ...\nFROM ...\nWHERE campo IN (\n  SELECT ...\n);"
        },
        {
          tipo: "topico",
          titulo: "🔹 Estrutura com EXISTS",
          codigo: "SELECT ...\nFROM tabelaA\nWHERE EXISTS (\n  SELECT *\n  FROM tabelaB\n  WHERE tabelaA.id = tabelaB.id\n);"
        },
        {
          tipo: "topico",
          titulo: "🔹 Estrutura com NOT EXISTS",
          codigo: "SELECT ...\nFROM tabelaA\nWHERE NOT EXISTS (\n  SELECT *\n  FROM tabelaB\n  WHERE tabelaA.id = tabelaB.id\n);"
        },
        {
          tipo: "topico",
          titulo: "🔹 INNER JOIN",
          codigo: "SELECT ...\nFROM A\nINNER JOIN B\nON A.id = B.id;"
        },
        {
          tipo: "topico",
          titulo: "🔹 LEFT JOIN",
          codigo: "SELECT ...\nFROM A\nLEFT JOIN B\nON A.id = B.id;"
        },
        {
          tipo: "topico",
          titulo: "🔹 RIGHT JOIN",
          codigo: "SELECT ...\nFROM A\nRIGHT JOIN B\nON A.id = B.id;"
        },
        {
          tipo: "topico",
          titulo: "🔹 FULL OUTER JOIN",
          codigo: "SELECT ...\nFROM A\nFULL OUTER JOIN B\nON A.id = B.id;"
        }
      ]
    },

    {
      id: "exemplos",
      titulo: "💡 Exemplos Explicativos",
      blocos: [
        {
          tipo: "exemplo",
          titulo: "Exemplo — Alunos aprovados",
          texto: "Objetivo: encontrar alunos com média ≥ 7.",
          lista: [
            "1. Buscar matrículas aprovadas na tabela de históricos",
            "2. Filtrar os alunos com `IN`"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo — Cursos sem alunos",
          texto: "Objetivo: encontrar cursos sem alunos vinculados.",
          lista: [
            "Usar `NOT IN`",
            "Usar `NOT EXISTS`"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo — LEFT JOIN",
          texto: "Situação: aluno possui curso inexistente. Resultado: aluno continua aparecendo; curso fica `NULL`."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo — INNER JOIN",
          texto: "Situação: apenas alunos com curso válido. Resultado: alunos sem curso não aparecem."
        }
      ]
    },

    {
      id: "resumo",
      titulo: "🧾 Resumo Final para Revisão Rápida",
      blocos: [
        {
          tipo: "subtitulo",
          texto: "Subconsultas"
        },
        {
          tipo: "texto",
          texto: "Consulta dentro de consulta. Também chamadas de: subqueries, subconsultas, consultas aninhadas."
        },
        {
          tipo: "lista",
          titulo: "Tipos:",
          itens: [
            "**Tipo I** → independente, executa uma vez, usa `IN` / `NOT IN`",
            "**Tipo II** → correlacionada, executa várias vezes, usa `EXISTS` / `NOT EXISTS`",
            "**Subconsulta no FROM** → cria tabela derivada (visão inline)"
          ]
        },
        {
          tipo: "subtitulo",
          texto: "JOINs"
        },
        {
          tipo: "lista",
          itens: [
            "**INNER JOIN** → apenas registros relacionados; interseção entre tabelas",
            "**LEFT JOIN** → todos da esquerda; sem correspondência → NULL",
            "**RIGHT JOIN** → todos da direita; sem correspondência → NULL",
            "**FULL OUTER JOIN** → todos os registros das duas tabelas, correspondentes ou não"
          ]
        },
        {
          tipo: "tabela",
          titulo: "Operadores importantes",
          colunas: ["Operador", "Função"],
          linhas: [
            ["IN",         "Verifica existência em uma lista de resultados"],
            ["NOT IN",     "Verifica ausência em uma lista de resultados"],
            ["EXISTS",     "Retorna verdadeiro se a subconsulta retornar linhas"],
            ["NOT EXISTS", "Retorna verdadeiro se a subconsulta não retornar linhas"]
          ]
        },
        {
          tipo: "destaque",
          texto: "📌 Conceitos-chave para prova: diferença entre Tipo I e Tipo II; funcionamento de EXISTS; diferença entre INNER, LEFT, RIGHT e FULL OUTER JOIN; relação entre chave primária e chave estrangeira; comportamento de valores NULL nas junções; uso de tabelas derivadas no FROM."
        }
      ]
    }
    ]
    },
    // Aula 14 - BDOO e BDOR
    {
  aula: "Aula 14 — BDOO e BDOR",
  ideia_central: "Bancos de dados orientados a objetos (BDOO) e objeto-relacionais (BDOR) surgiram para superar as limitações dos bancos relacionais tradicionais frente a dados complexos, incorporando encapsulamento, herança e polimorfismo.",
  secoes: [
  {
    id: "visao",
    titulo: "🧭 Visão Geral",
    blocos: [
      {
        tipo: "texto",
        texto: "O material aborda os conceitos de **BDOO (Banco de Dados Orientado a Objetos)** e **BDOR (Banco de Dados Objeto-Relacional)**, explicando por que os bancos relacionais tradicionais passaram a ter limitações, como a orientação a objetos influenciou os bancos de dados, e como implementar recursos orientados a objetos em bancos relacionais."
      },
      {
        tipo: "lista",
        titulo: "Temas abordados:",
        itens: [
          "Limitações dos bancos relacionais tradicionais frente a dados complexos",
          "Conceitos fundamentais da computação orientada a objetos",
          "Encapsulamento",
          "Herança",
          "Polimorfismo",
          "Padrão ODMG",
          "Tipos definidos pelo usuário",
          "Herança de tipos e tabelas",
          "Tipos de referência em SQL",
          "Exemplos DDL e DML"
        ]
      }
    ]
  },

  {
    id: "relacional_vs_oo",
    titulo: "⚖️ Banco Relacional x Banco Orientado a Objetos",
    blocos: [
      {
        tipo: "texto",
        texto: "Os bancos relacionais tradicionais trabalham principalmente com tipos simples. Com a evolução tecnológica, surgiram dados complexos que geraram limitações nos SGBDs relacionais tradicionais."
      },
      {
        tipo: "lista",
        titulo: "Bancos relacionais tradicionais trabalham com:",
        itens: [
          "Números",
          "Textos",
          "Datas",
          "Tipos simples"
        ]
      },
      {
        tipo: "lista",
        titulo: "Com a evolução, surgiram dados complexos:",
        itens: [
          "Imagens",
          "Vídeos",
          "Mapas",
          "Multimídia",
          "Objetos complexos"
        ]
      },
      {
        tipo: "topico",
        titulo: "🔹 Problema principal",
        texto: "Linguagens orientadas a objetos possuem tipos mais ricos, estruturas complexas, métodos e encapsulamento. Já o SQL tradicional não manipula facilmente objetos complexos. Isso criou incompatibilidade entre aplicações orientadas a objetos e bancos relacionais."
      }
    ]
  },

  {
    id: "bdoo",
    titulo: "🗄️ BDOO — Banco de Dados Orientado a Objetos",
    blocos: [
      {
        tipo: "texto",
        texto: "O BDOO surgiu para unir **persistência de dados** com o **paradigma orientado a objetos**. No BDOO, os dados são armazenados como objetos, os objetos possuem atributos e métodos, e existem relações entre objetos."
      },
      {
        tipo: "lista",
        titulo: "Características do BDOO:",
        itens: [
          "Encapsulamento",
          "Herança",
          "Polimorfismo",
          "Reutilização",
          "Objetos complexos",
          "Integração com linguagens OO"
        ]
      }
    ]
  },

  {
    id: "encapsulamento",
    titulo: "🔒 Encapsulamento",
    blocos: [
      {
        tipo: "texto",
        texto: "**Encapsulamento** significa esconder detalhes internos e permitir acesso apenas pela interface do objeto."
      },
      {
        tipo: "topico",
        titulo: "🔹 Estrutura de um objeto",
        lista: [
          "Dados (atributos/variáveis)",
          "Procedimentos (métodos)"
        ]
      },
      {
        tipo: "topico",
        titulo: "🔹 Classe",
        texto: "Uma **classe** define atributos, métodos e o comportamento dos objetos."
      },
      {
        tipo: "topico",
        titulo: "🔹 Benefícios do encapsulamento",
        lista: [
          "**Reutilização** — classes podem ser reaproveitadas",
          "**Independência de dados** — mudanças internas não afetam o código externo",
          "**Redução de manutenção** — menos impacto em alterações futuras"
        ]
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo — Classe Point",
        texto: "A classe `Point` possui variáveis X e Y, e métodos Distância e MesmaCoord. Os detalhes internos ficam ocultos."
      },
      {
        tipo: "imagem",
        src: "figura_bdoo_classe_metodos.png",
        pasta: "imagens_banco_dados/aula_14",
        alt: "Figura 1 — Exemplo de classe com suas variáveis e métodos",
        num: 1
      },
      {
        tipo: "imagem",
        src: "figura_bdoo_reutilizacao_classes.png",
        pasta: "imagens_banco_dados/aula_14",
        alt: "Figura 2 — Exemplo de classe utilizando variáveis e métodos de outra — reutilização e encapsulamento",
        num: 2
      }
    ]
  },

  {
    id: "heranca",
    titulo: "🧬 Herança",
    blocos: [
      {
        tipo: "texto",
        texto: "**Herança** permite criar subclasses que reutilizam atributos e métodos da superclasse."
      },
      {
        tipo: "topico",
        titulo: "🔹 Conceitos",
        lista: [
          "**Superclasse** — classe pai",
          "**Subclasse** — classe filha"
        ]
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo — CorPonto herda de Point",
        texto: "A subclasse `CorPonto` herda coordenadas e métodos da classe `Point`, e adiciona os atributos cor e brilho."
      },
      {
        tipo: "lista",
        titulo: "Benefícios da herança:",
        itens: [
          "Reutilização",
          "Redução de código",
          "Organização hierárquica",
          "Manutenção facilitada"
        ]
      },
      {
        tipo: "imagem",
        src: "figura_bdoo_heranca_hierarquia.png",
        pasta: "imagens_banco_dados/aula_14",
        alt: "Figura 3 — Hierarquia de classe com a subclasse CorPonto",
        num: 3
      },
      {
        tipo: "imagem",
        src: "figura_bdoo_subclasse_corponto.png",
        pasta: "imagens_banco_dados/aula_14",
        alt: "Figura 4 — Exemplo da hierarquia de classe com atributos herdados e novos atributos da subclasse CorPonto",
        num: 4
      }
    ]
  },

  {
    id: "polimorfismo",
    titulo: "🔄 Polimorfismo",
    blocos: [
      {
        tipo: "texto",
        texto: "**Polimorfismo** significa \"várias formas\". Um método pode possuir implementações diferentes e comportar-se de forma diferente conforme a subclasse."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo — Método MesmaCoord",
        texto: "Na classe `Point`, o método `MesmaCoord` compara coordenadas. Na classe `CorPonto`, o mesmo método compara coordenadas e cor."
      },
      {
        tipo: "topico",
        titulo: "🔹 Vinculação",
        lista: [
          "**Vinculação estática** — ocorre na compilação; mais eficiente",
          "**Vinculação dinâmica** — ocorre na execução; mais flexível; chamada de \"vinculação tardia\""
        ]
      },
      {
        tipo: "topico",
        titulo: "🔹 Verificação de tipos",
        texto: "O SGBD garante compatibilidade entre objetos e métodos, prevenindo erros de tipo."
      },
      {
        tipo: "imagem",
        src: "figura_bdoo_processamento_mensagem.png",
        pasta: "imagens_banco_dados/aula_14",
        alt: "Figura 5 — Processamento de uma mensagem entre objetos e classes no paradigma orientado a objetos",
        num: 5
      }
    ]
  },

  {
    id: "odmg",
    titulo: "📋 ODMG — Object Database Management Group",
    blocos: [
      {
        tipo: "texto",
        texto: "O **ODMG** foi criado para padronizar bancos orientados a objetos."
      },
      {
        tipo: "topico",
        titulo: "🔹 Modelo de Objetos",
        texto: "Define tipos, objetos e construtores."
      },
      {
        tipo: "topico",
        titulo: "🔹 ODL — Object Definition Language",
        texto: "Usada para definir objetos e criar esquemas. Equivalente ao DDL nos bancos relacionais."
      },
      {
        tipo: "topico",
        titulo: "🔹 OQL — Object Query Language",
        texto: "Linguagem de consulta baseada em SQL que adiciona herança, polimorfismo, objetos complexos e relacionamentos."
      },
      {
        tipo: "topico",
        titulo: "🔹 Binding (Acoplamento)",
        texto: "Responsável por mapear objetos da aplicação para o banco e converter estruturas OO para persistência."
      }
    ]
  },

  {
    id: "bdor",
    titulo: "🗃️ BDOR — Banco de Dados Objeto-Relacional",
    blocos: [
      {
        tipo: "texto",
        texto: "O **BDOR** combina o modelo relacional com recursos orientados a objetos. O objetivo é manter a robustez do modelo relacional com suporte a objetos complexos."
      },
      {
        tipo: "lista",
        titulo: "Benefícios:",
        itens: [
          "Tipos complexos",
          "Integração com OO",
          "Maior poder de modelagem",
          "Reutilização"
        ]
      }
    ]
  },

  {
    id: "tipos_usuario",
    titulo: "🧩 Tipos Definidos pelo Usuário",
    blocos: [
      {
        tipo: "texto",
        texto: "O SQL objeto-relacional permite criar **tipos personalizados** para modelagem mais rica."
      },
      {
        tipo: "topico",
        titulo: "🔹 Exemplo",
        codigo: "create type Pessoa (\n    ID varchar(20),\n    nome varchar(20),\n    endereço varchar(20)\n);"
      },
      {
        tipo: "lista",
        titulo: "Vantagens:",
        itens: [
          "Modelagem mais rica",
          "Representação mais próxima do mundo real",
          "Reutilização de estruturas"
        ]
      }
    ]
  },

  {
    id: "arrays_tipos_complexos",
    titulo: "📦 Arrays e Tipos Complexos",
    blocos: [
      {
        tipo: "texto",
        texto: "Alguns SGBDs suportam ARRAY, tabelas como atributos e coleções."
      },
      {
        tipo: "topico",
        titulo: "🔹 PostgreSQL",
        codigo: "INTEGER[]"
      },
      {
        tipo: "topico",
        titulo: "🔹 Oracle",
        codigo: "VARRAY(10) OF INTEGER"
      }
    ]
  },

  {
    id: "heranca_tipo",
    titulo: "🔗 Herança de Tipo",
    blocos: [
      {
        tipo: "texto",
        texto: "Permite criar **subtipos** a partir de tipos existentes."
      },
      {
        tipo: "topico",
        titulo: "🔹 Exemplo",
        codigo: "create type Aluno under Pessoa"
      },
      {
        tipo: "texto",
        texto: "`Aluno` herda ID, nome e endereço de `Pessoa`, e adiciona o atributo formação."
      },
      {
        tipo: "topico",
        titulo: "🔹 Conceitos importantes",
        lista: [
          "**Subtipo** — classe derivada",
          "**Supertipo** — classe base"
        ]
      }
    ]
  },

  {
    id: "heranca_tabela",
    titulo: "📂 Herança de Tabela",
    blocos: [
      {
        tipo: "texto",
        texto: "Uma tabela pode herdar de outra tabela."
      },
      {
        tipo: "topico",
        titulo: "🔹 Exemplo PostgreSQL",
        codigo: "create table alunos\ninherits pessoas;"
      },
      {
        tipo: "texto",
        texto: "A tabela `alunos` recebe automaticamente os atributos de `pessoas`."
      },
      {
        tipo: "lista",
        titulo: "Vantagens:",
        itens: [
          "Reutilização estrutural",
          "Especialização",
          "Organização hierárquica"
        ]
      }
    ]
  },

  {
    id: "referencias",
    titulo: "🔍 Tipos de Referência em SQL",
    blocos: [
      {
        tipo: "texto",
        texto: "Os tipos de referência permitem criar referências entre objetos, funcionando de forma semelhante a ponteiros ou referências de objetos."
      },
      {
        tipo: "topico",
        titulo: "🔹 Exemplo",
        codigo: "diretor ref(Pessoa)"
      },
      {
        tipo: "topico",
        titulo: "🔹 REF FROM",
        texto: "Permite usar a chave primária como referência do objeto."
      },
      {
        tipo: "topico",
        titulo: "🔹 Expressões de Caminho — SQL:1999",
        texto: "Permitem acessar atributos do objeto referenciado, simplificando consultas e reduzindo joins explícitos.",
        codigo: "diretor->nome"
      },
      {
        tipo: "topico",
        titulo: "🔹 DEREF",
        texto: "Retorna o objeto referenciado.",
        codigo: "select deref(diretor).nome"
      },
      {
        tipo: "lista",
        titulo: "Benefícios das expressões de caminho:",
        itens: [
          "Simplifica consultas",
          "Reduz joins explícitos",
          "Melhora legibilidade"
        ]
      }
    ]
  },

  {
    id: "ddl_dml",
    titulo: "🛠️ DDL e DML",
    blocos: [
      {
        tipo: "topico",
        titulo: "🔹 DDL — Data Definition Language",
        texto: "Usado para criar estruturas, definir tabelas e definir tipos.",
        lista: [
          "CREATE",
          "ALTER",
          "DROP"
        ]
      },
      {
        tipo: "topico",
        titulo: "🔹 DML — Data Manipulation Language",
        texto: "Usado para inserir, atualizar e consultar dados.",
        lista: [
          "INSERT",
          "UPDATE",
          "SELECT"
        ]
      }
    ]
  },

  {
    id: "formulas_metodos",
    titulo: "🔧 Fórmulas e Métodos",
    blocos: [
      {
        tipo: "topico",
        titulo: "🔹 Criar tipo personalizado",
        codigo: "create type Pessoa (...);"
      },
      {
        tipo: "topico",
        titulo: "🔹 Criar tabela baseada em tipo",
        codigo: "create table pessoas of Pessoa;"
      },
      {
        tipo: "topico",
        titulo: "🔹 Inserir dados",
        codigo: "insert into pessoas values (...);"
      },
      {
        tipo: "topico",
        titulo: "🔹 Criar herança de tipo",
        codigo: "create type Aluno under Pessoa"
      },
      {
        tipo: "topico",
        titulo: "🔹 Criar herança de tabela",
        codigo: "create table alunos\ninherits pessoas;"
      },
      {
        tipo: "topico",
        titulo: "🔹 Criar referência",
        codigo: "diretor ref(Pessoa)"
      },
      {
        tipo: "topico",
        titulo: "🔹 Acessar objeto referenciado",
        codigo: "diretor->nome"
      },
      {
        tipo: "topico",
        titulo: "🔹 Recuperar referência com DEREF",
        codigo: "select deref(diretor).nome"
      }
    ]
  },

  {
    id: "exemplos",
    titulo: "💡 Exemplos Explicativos",
    blocos: [
      {
        tipo: "exemplo",
        titulo: "Exemplo 1 — Encapsulamento",
        texto: "Classe `Point` com atributos X e Y e métodos Distância e MesmaCoord. Os detalhes internos ficam ocultos, acessíveis apenas pela interface."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo 2 — Herança",
        texto: "Classe `CorPonto` herda coordenadas e métodos da classe `Point`, e adiciona os atributos cor e brilho."
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo 3 — Herança de Tipo SQL",
        texto: "Professor herda atributos de Pessoa e adiciona o atributo salário.",
        detalhe: "create type Professor under Pessoa"
      },
      {
        tipo: "exemplo",
        titulo: "Exemplo 4 — Referência",
        texto: "Departamento possui `diretor` como referência para `Pessoa`. Isso evita joins manuais para acessar os dados do diretor."
      }
    ]
  },

  {
    id: "resumo",
    titulo: "⚡ Resumo Final para Revisão Rápida",
    blocos: [
      {
        tipo: "tabela",
        titulo: "BDOO vs BDOR",
        colunas: ["Característica", "BDOO", "BDOR"],
        linhas: [
          ["Base",         "Orientado a objetos puro",        "Relacional + OO"],
          ["Padrão",       "ODMG",                            "SQL:1999"],
          ["Linguagem",    "ODL / OQL",                       "SQL estendido"],
          ["Foco",         "Objetos, métodos, herança",       "Tipos, referências, herança de tabela"]
        ]
      },
      {
        tipo: "tabela",
        titulo: "Pilares da OO",
        colunas: ["Conceito", "Definição"],
        linhas: [
          ["Encapsulamento", "Esconde detalhes internos; acesso pela interface"],
          ["Herança",        "Subclasses reutilizam atributos e métodos da superclasse"],
          ["Polimorfismo",   "Mesmo método com implementações diferentes por subclasse"]
        ]
      },
      {
        tipo: "tabela",
        titulo: "Recursos do BDOR em SQL",
        colunas: ["Recurso", "Sintaxe"],
        linhas: [
          ["Criar tipo",           "`create type Pessoa (...)`"],
          ["Herança de tipo",      "`create type Aluno under Pessoa`"],
          ["Herança de tabela",    "`create table alunos inherits pessoas`"],
          ["Referência",           "`diretor ref(Pessoa)`"],
          ["Expressão de caminho", "`diretor->nome`"],
          ["DEREF",                "`select deref(diretor).nome`"]
        ]
      },
      {
        tipo: "tabela",
        titulo: "ODMG — Componentes",
        colunas: ["Componente", "Função"],
        linhas: [
          ["Modelo de Objetos", "Define tipos, objetos e construtores"],
          ["ODL",               "Define objetos e esquemas — equivalente ao DDL"],
          ["OQL",               "Consulta baseada em SQL com suporte a herança e polimorfismo"],
          ["Binding",           "Mapeia objetos da aplicação para o banco"]
        ]
      },
      {
        tipo: "destaque",
        texto: "📌 Mais cobrados em prova: diferença entre BDOO e BDOR · encapsulamento · herança · polimorfismo · ODMG (ODL e OQL) · tipos definidos pelo usuário · herança de tipo · herança de tabela · tipos de referência · expressões de caminho (diretor->nome) · DEREF · DDL e DML."
      }
    ]
  }
  ]
    },

    // Aula 15 - Projeto de Banco de Dados
    {
  aula: "Aula 15 - Projeto de Banco de Dados",
  ideia_central: "Um banco de dados bem projetado depende de boa modelagem, regras de negócio corretas, relacionamentos bem definidos, normalização adequada e implementação física consistente.",
  secoes: [
    {
      id: "visao_geral",
      titulo: "Visão geral do conteúdo",
      blocos: [
        {
          tipo: "texto",
          texto: "A aula aborda o processo completo de **projeto de banco de dados**, desde a definição do problema até a implementação prática utilizando SQL."
        },
        {
          tipo: "lista",
          titulo: "Conteúdo dividido em",
          itens: [
            "Planejamento do banco de dados",
            "Definição do escopo",
            "Modelagem conceitual",
            "Modelagem lógica",
            "Modelagem física",
            "Construção do banco",
            "Comandos DDL",
            "Comandos DML",
            "Operações de manipulação de dados"
          ]
        },
        {
          tipo: "destaque",
          texto: "O foco principal é mostrar como transformar necessidades do negócio em um banco de dados estruturado, organizado e funcional."
        }
      ]
    },
    {
      id: "conceitos_principais",
      titulo: "Conceitos principais",
      blocos: [
        {
          tipo: "subtitulo",
          texto: "Projeto de Banco de Dados"
        },
        {
          tipo: "texto",
          texto: "O projeto de banco de dados é o processo de planejamento e organização das informações que serão armazenadas."
        },
        {
          tipo: "lista",
          titulo: "Objetivos principais",
          itens: [
            "Evitar redundância de dados",
            "Garantir integridade das informações",
            "Melhorar desempenho",
            "Organizar relacionamentos entre dados",
            "Facilitar consultas e manutenção"
          ]
        },
        {
          tipo: "destaque",
          texto: "O material enfatiza que um projeto bem estruturado é essencial principalmente em sistemas grandes e corporativos."
        },
        {
          tipo: "subtitulo",
          texto: "SGBD (Sistema Gerenciador de Banco de Dados)"
        },
        {
          tipo: "lista",
          titulo: "Responsabilidades do SGBD",
          itens: [
            "Armazenar dados",
            "Manipular informações",
            "Controlar acessos",
            "Garantir segurança",
            "Executar consultas"
          ]
        },
        {
          tipo: "topico",
          titulo: "SGBDs Gratuitos/Open Source",
          lista: [
            "PostgreSQL",
            "MySQL"
          ]
        },
        {
          tipo: "topico",
          titulo: "SGBDs Comerciais",
          lista: [
            "Oracle",
            "DB2",
            "SQL Server",
            "Sybase",
            "Informix"
          ]
        }
      ]
    },
    {
      id: "etapas_projeto",
      titulo: "Etapas do Projeto de Banco de Dados",
      blocos: [
        {
          tipo: "topico",
          titulo: "1. Definir o objetivo do banco",
          texto: "É necessário entender qual problema será resolvido, quais informações serão armazenadas e quais relatórios serão necessários."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplos de objetivos",
          texto: "Controle de clubes, campeonatos, jogadores e premiações."
        },
        {
          tipo: "topico",
          titulo: "2. Identificar entidades",
          texto: "Entidades representam objetos do mundo real. Cada entidade normalmente vira uma tabela."
        },
        {
          tipo: "lista",
          titulo: "Exemplos de entidades",
          itens: [
            "Cliente",
            "Clube",
            "Jogador",
            "Federação",
            "Campeonato"
          ]
        },
        {
          tipo: "topico",
          titulo: "3. Identificar atributos",
          texto: "Atributos são características das entidades."
        },
        {
          tipo: "exemplo",
          titulo: "Atributos da entidade Jogador",
          texto: "nome, RG, data_nascimento"
        },
        {
          tipo: "topico",
          titulo: "4. Definir identificadores (chaves)",
          texto: "Cada entidade precisa de um atributo que identifique registros de forma única. Esses identificadores são chamados de **Chaves primárias (Primary Key)**."
        },
        {
          tipo: "lista",
          titulo: "Exemplos de identificadores",
          itens: [
            "jogador_id",
            "clube_id",
            "federacao_id"
          ]
        },
        {
          tipo: "topico",
          titulo: "5. Definir relacionamentos",
          texto: "Relacionamentos mostram como entidades se conectam."
        },
        {
          tipo: "lista",
          titulo: "Exemplos de relacionamentos",
          itens: [
            "Um clube possui vários jogadores",
            "Uma federação possui vários clubes",
            "Um jogador recebe vários prêmios"
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Cardinalidade"
        },
        {
          tipo: "texto",
          texto: "Define quantas ocorrências podem existir entre entidades."
        },
        {
          tipo: "tabela",
          titulo: "Tipos de cardinalidade",
          colunas: ["Tipo", "Significado"],
          linhas: [
            ["1:1", "Um para um"],
            ["1:N", "Um para muitos"],
            ["N:M", "Muitos para muitos"]
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Cardinalidade 1:N",
          texto: "Um clube pode possuir vários jogadores → 1:N"
        },
        {
          tipo: "subtitulo",
          texto: "Normalização"
        },
        {
          tipo: "texto",
          texto: "Processo usado para eliminar redundância, evitar inconsistências e organizar melhor os dados."
        },
        {
          tipo: "lista",
          titulo: "Objetivos da normalização",
          itens: [
            "Evitar repetição desnecessária",
            "Reduzir anomalias de atualização",
            "Melhorar integridade"
          ]
        },
        {
          tipo: "destaque",
          texto: "O material cita normalização até a **3ª Forma Normal (3FN)**."
        }
      ]
    },
    {
      id: "escopo",
      titulo: "Definição do Escopo",
      blocos: [
        {
          tipo: "texto",
          texto: "O projeto utilizado como exemplo foi um banco de dados da CBF."
        },
        {
          tipo: "lista",
          titulo: "O sistema deveria armazenar",
          itens: [
            "Federações",
            "Clubes",
            "Campeonatos",
            "Jogadores",
            "Posições",
            "Prêmios"
          ]
        },
        {
          tipo: "lista",
          titulo: "Regras de negócio definidas no escopo",
          itens: [
            "Cada clube pertence a uma federação",
            "Jogadores pertencem a clubes",
            "Jogadores possuem posições",
            "Campeonatos possuem clubes participantes",
            "Jogadores podem receber vários prêmios"
          ]
        }
      ]
    },
    {
      id: "modelo_conceitual",
      titulo: "Modelo Conceitual",
      blocos: [
        {
          tipo: "texto",
          texto: "O modelo conceitual representa a visão geral do negócio, incluindo entidades, atributos, relacionamentos e regras de negócio."
        },
        {
          tipo: "lista",
          titulo: "Características",
          itens: [
            "Independente de tecnologia",
            "Fácil entendimento",
            "Usado com usuários e analistas",
            "Não depende do SGBD",
            "Alto nível de abstração",
            "Fácil comunicação entre usuários e desenvolvedores",
            "Foca nas regras do negócio"
          ]
        },
        {
          tipo: "lista",
          titulo: "Elementos principais",
          itens: [
            "Entidades",
            "Atributos",
            "Relacionamentos"
          ]
        },
        {
          tipo: "imagem",
          src: "figura_modelo_conceitual_cbf.png",
          pasta: "imagens_banco_de_dados/aula_1",
          alt: "Modelo conceitual do sistema da CBF mostrando entidades, atributos e relacionamentos sem detalhes técnicos",
          num: 1
        }
      ]
    },
    {
      id: "modelo_logico",
      titulo: "Modelo Lógico",
      blocos: [
        {
          tipo: "texto",
          texto: "Transforma o modelo conceitual em estruturas compatíveis com bancos relacionais."
        },
        {
          tipo: "lista",
          titulo: "Define",
          itens: [
            "Tabelas",
            "Chaves primárias",
            "Chaves estrangeiras",
            "Relacionamentos",
            "Entidades associativas"
          ]
        },
        {
          tipo: "lista",
          titulo: "Características",
          itens: [
            "Deriva do modelo conceitual",
            "Possui chaves primárias",
            "Possui chaves estrangeiras",
            "Utiliza normalização",
            "Segue padrões de nomenclatura"
          ]
        },
        {
          tipo: "topico",
          titulo: "Chave Primária (PK)",
          texto: "Identifica unicamente cada registro. Exemplo: `PRIMARY KEY (jogador_id)`"
        },
        {
          tipo: "topico",
          titulo: "Chave Estrangeira (FK)",
          texto: "Cria relacionamento entre tabelas. Exemplo: `FOREIGN KEY (clube_id) REFERENCES Clube(clube_id)`"
        },
        {
          tipo: "imagem",
          src: "image_modelo_logico.png",
          pasta: "imagens_banco_de_dados/aula_1",
          alt: "Modelo lógico com tabelas, chaves primárias, estrangeiras e entidades associativas do sistema da CBF",
          num: 2
        }
      ]
    },
    {
      id: "modelo_fisico",
      titulo: "Modelo Físico",
      blocos: [
        {
          tipo: "texto",
          texto: "Representa a implementação real no SGBD."
        },
        {
          tipo: "lista",
          titulo: "Define",
          itens: [
            "Tipos de dados",
            "Índices",
            "Restrições",
            "Tabelas físicas",
            "Armazenamento"
          ]
        },
        {
          tipo: "lista",
          titulo: "Características",
          itens: [
            "Depende do SGBD",
            "Define tipos dos campos",
            "Define campos obrigatórios",
            "Define índices",
            "Implementa relacionamentos reais"
          ]
        },
        {
          tipo: "topico",
          titulo: "Relacionamento Identificado",
          texto: "A chave estrangeira faz parte da chave primária."
        },
        {
          tipo: "topico",
          titulo: "Relacionamento Não Identificado",
          texto: "A chave estrangeira NÃO faz parte da chave primária."
        },
        {
          tipo: "imagem",
          src: "image_modelo_fisico.png",
          pasta: "imagens_banco_de_dados/aula_1",
          alt: "Modelo físico com tipos de dados, relacionamentos identificados e não identificados e campos obrigatórios",
          num: 3
        }
      ]
    },
    {
      id: "ddl_dml",
      titulo: "DDL e DML",
      blocos: [
        {
          tipo: "subtitulo",
          texto: "DDL — Data Definition Language"
        },
        {
          tipo: "texto",
          texto: "Comandos usados para criar tabelas, alterar estruturas e remover objetos."
        },
        {
          tipo: "lista",
          titulo: "Principais comandos DDL",
          itens: [
            "CREATE",
            "ALTER",
            "DROP"
          ]
        },
        {
          tipo: "subtitulo",
          texto: "DML — Data Manipulation Language"
        },
        {
          tipo: "texto",
          texto: "Comandos usados para manipular dados."
        },
        {
          tipo: "lista",
          titulo: "Principais comandos DML",
          itens: [
            "INSERT",
            "UPDATE",
            "DELETE",
            "SELECT"
          ]
        }
      ]
    },
    {
      id: "formulas_metodos",
      titulo: "Fórmulas e Métodos SQL",
      blocos: [
        {
          tipo: "topico",
          titulo: "Estrutura geral do CREATE TABLE",
          texto: "Uso: criar tabelas.\n\n`CREATE TABLE nome_tabela (\n    coluna tipo,\n    PRIMARY KEY(coluna)\n);`"
        },
        {
          tipo: "topico",
          titulo: "Inserção de dados",
          texto: "Uso: inserir registros.\n\n`INSERT INTO tabela(coluna1, coluna2)\nVALUES(valor1, valor2);`"
        },
        {
          tipo: "topico",
          titulo: "Atualização de dados",
          texto: "Uso: modificar registros existentes.\n\n`UPDATE tabela\nSET coluna = valor\nWHERE condicao;`"
        },
        {
          tipo: "topico",
          titulo: "Exclusão de dados",
          texto: "Uso: remover registros.\n\n`DELETE FROM tabela\nWHERE condicao;`"
        },
        {
          tipo: "topico",
          titulo: "Consulta com JOIN",
          texto: "Uso: relacionar dados entre tabelas.\n\n`SELECT *\nFROM tabela1\nINNER JOIN tabela2\nON tabela1.id = tabela2.id;`"
        },
        {
          tipo: "topico",
          titulo: "Consulta com GROUP BY",
          texto: "Uso: agrupar resultados e gerar relatórios.\n\n`SELECT federacao.sigla, COUNT(clube_id)\nFROM clube\nINNER JOIN federacao\nON clube.federacao_federacao_id = federacao.federacao_id\nGROUP BY federacao.sigla;`"
        }
      ]
    },
    {
      id: "exemplos",
      titulo: "Exemplos Explicativos",
      blocos: [
        {
          tipo: "exemplo",
          titulo: "Relacionamento Federação → Clube",
          texto: "Uma federação possui vários clubes; um clube pertence a apenas uma federação.",
          detalhe: "Cardinalidade: 1:N"
        },
        {
          tipo: "exemplo",
          titulo: "Relacionamento N:M — Clube ↔ Campeonato",
          texto: "Um clube participa de vários campeonatos; um campeonato possui vários clubes.",
          detalhe: "Cardinalidade N:M. Esse tipo normalmente gera uma entidade associativa."
        },
        {
          tipo: "exemplo",
          titulo: "Integridade referencial",
          texto: "Um jogador só pode existir se o clube existir e a posição existir. Isso é garantido pelas chaves estrangeiras."
        }
      ]
    },
    {
      id: "construcao_banco",
      titulo: "Construção do Banco e Ferramentas",
      blocos: [
        {
          tipo: "imagem",
          src: "image_geracao_ddl.png",
          pasta: "imagens_banco_de_dados/aula_1",
          alt: "Geração automática de scripts SQL no MySQLWorkbench",
          num: 4
        },
        {
          tipo: "imagem",
          src: "image_conversao_sqlines.png",
          pasta: "imagens_banco_de_dados/aula_1",
          alt: "Conversão de scripts MySQL para PostgreSQL usando a ferramenta SQLines",
          num: 5
        },
        {
          tipo: "imagem",
          src: "image_pgadmin_criacao_bd.png",
          pasta: "imagens_banco_de_dados/aula_1",
          alt: "Criação de um novo banco de dados no PostgreSQL via PGAdmin",
          num: 6
        },
        {
          tipo: "imagem",
          src: "image_consulta_clubes_federacao.png",
          pasta: "imagens_banco_de_dados/aula_1",
          alt: "Consulta de clubes por federação demonstrando uso de JOIN e GROUP BY para geração de relatórios",
          num: 7
        },
        {
          tipo: "lista",
          titulo: "Ferramentas citadas",
          itens: [
            "MySQLWorkbench — geração de scripts DDL",
            "PostgreSQL — SGBD open source utilizado",
            "PGAdmin — interface gráfica para PostgreSQL",
            "SQLines — conversão de scripts entre diferentes SGBDs"
          ]
        }
      ]
    },
    {
      id: "resumo",
      titulo: "Resumo Final para Revisão Rápida",
      blocos: [
        {
          tipo: "lista",
          titulo: "Pontos mais importantes",
          itens: [
            "Projeto de banco de dados organiza dados de forma estruturada",
            "Objetivos: evitar redundância, garantir integridade, melhorar desempenho"
          ]
        },
        {
          tipo: "topico",
          titulo: "Etapas do projeto",
          lista: [
            "1. Definir objetivo",
            "2. Identificar entidades",
            "3. Definir atributos",
            "4. Definir chaves",
            "5. Definir relacionamentos",
            "6. Normalizar"
          ]
        },
        {
          tipo: "tabela",
          titulo: "Modelos",
          colunas: ["Modelo", "Objetivo"],
          linhas: [
            ["Conceitual", "Visão do negócio"],
            ["Lógico", "Estrutura relacional"],
            ["Físico", "Implementação real"]
          ]
        },
        {
          tipo: "lista",
          titulo: "Conceitos fundamentais",
          itens: [
            "Entidade",
            "Atributo",
            "Relacionamento",
            "Cardinalidade",
            "Chave primária",
            "Chave estrangeira",
            "Normalização"
          ]
        },
        {
          tipo: "tabela",
          titulo: "Relacionamentos",
          colunas: ["Tipo", "Exemplo"],
          linhas: [
            ["1:N", "Federação → Clube"],
            ["N:M", "Clube ↔ Campeonato"]
          ]
        }
      ]
    }
  ]
    }
  ],

  simplificado: [

  // Aula 9 — DDL: Data Definition Language
  {
    aula: "Aula 9 — DDL: Data Definition Language",

    ideia_central: "DDL é o subconjunto da SQL responsável por criar, modificar e remover estruturas de bancos de dados, garantindo integridade por meio de chaves primárias e estrangeiras.",

    secoes: [

      {
        id: "ddl-conceito",
        titulo: "📌 DDL e Comandos Principais",

        blocos: [

          // 1 - conceito DDL
          {
            tipo: "topico",
            titulo: "🔹 DDL — Data Definition Language",
            lista: [
              "**DDL** → define a estrutura do banco de dados",
              "**CREATE** → cria objetos (bancos, tabelas, views, índices)",
              "**ALTER** → modifica objetos existentes",
              "**DROP** → remove objetos do banco"
            ]
          },

          // 2 - esquema e catálogo
          {
            tipo: "topico",
            titulo: "🔹 Esquema e Catálogo",
            lista: [
              "**Esquema (Schema)** → agrupamento lógico de objetos do banco (tabelas, views, restrições, domínios)",
              "**Catálogo** → coleção de esquemas; contém `INFORMATION_SCHEMA` com metadados do banco",
              "Exemplo: `CREATE SCHEMA Exemplo;`"
            ]
          },

          // 3 - create database e table
          {
            tipo: "topico",
            titulo: "🔹 CREATE DATABASE e CREATE TABLE",
            lista: [
              "Criar banco: `CREATE DATABASE nome;`",
              "Criar tabela: `CREATE TABLE tabela (campo tipo);`",
              "Exemplo: `CREATE TABLE alunos (mat_alu INTEGER, nom_alu VARCHAR(50));`"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_create_database_postgres.png",
            pasta: "imagens_banco_dados/aula_09",
            num: "1",
            alt: "Criacao de banco de dados no PostgreSQL utilizando DDL"
          },

          {
            tipo: "imagem",
            src: "fig_create_table_alunos.png",
            pasta: "imagens_banco_dados/aula_09",
            num: "3",
            alt: "Criacao da tabela alunos no banco de dados Exemplo usando CREATE TABLE"
          }

        ]
      },

      {
        id: "tipos-chaves",
        titulo: "📌 Tipos de Dados e Restrições de Integridade",

        blocos: [

          // 4 - tipos de dados
          {
            tipo: "topico",
            titulo: "🔹 Principais Tipos de Dados SQL",
            lista: [
              "**CHAR(n)** → texto de tamanho fixo, sempre ocupa n caracteres",
              "**VARCHAR(n)** → texto de tamanho variável",
              "**INTEGER** → número inteiro 32 bits",
              "**SMALLINT** → inteiro menor, 16 bits",
              "**DECIMAL(p,s)** / **NUMERIC** → número com casas decimais",
              "**FLOAT** → ponto flutuante",
              "**DATE** → armazena datas",
              "**TIME** → armazena horários",
              "**BLOB** → arquivos binários (imagens, vídeos, áudios)"
            ]
          },

          {
            tipo: "imagem",
            src: "quadro_tipos_sql.png",
            pasta: "imagens_banco_dados/aula_09",
            num: "Quadro 1",
            alt: "Quadro com os principais tipos de dados utilizados na definicao de tabelas SQL"
          },

          // 5 - chave primária
          {
            tipo: "topico",
            titulo: "🔹 PRIMARY KEY — Chave Primária",
            lista: [
              "**Única** → não pode se repetir",
              "**Não nula** → não aceita NULL",
              "Sintaxe simples: `PRIMARY KEY (campo)`",
              "Sintaxe nomeada: `CONSTRAINT alu_pk PRIMARY KEY (mat_alu)`"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_primary_key.png",
            pasta: "imagens_banco_dados/aula_09",
            num: "5",
            alt: "Exemplo de definicao de chave primaria em uma tabela SQL"
          },

          // 6 - chave estrangeira
          {
            tipo: "topico",
            titulo: "🔹 FOREIGN KEY — Chave Estrangeira",
            lista: [
              "**Integridade referencial** → garante que o valor referenciado exista",
              "Impede referências inválidas entre tabelas",
              "Sintaxe: `FOREIGN KEY (campo) REFERENCES tabela(campo)`"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_foreign_key.png",
            pasta: "imagens_banco_dados/aula_09",
            num: "6",
            alt: "Exemplo de relacionamento entre tabelas usando chave estrangeira e integridade referencial"
          }

        ]
      },

      {
        id: "alter-drop",
        titulo: "📌 ALTER e DROP",

        blocos: [

          // 7 - alter
          {
            tipo: "topico",
            titulo: "🔹 ALTER DATABASE e ALTER TABLE",
            lista: [
              "Renomear banco: `ALTER DATABASE Exemplo RENAME TO BDAcademico;`",
              "Adicionar coluna: `ALTER TABLE tabela ADD coluna tipo;`",
              "Ao adicionar coluna, registros antigos recebem `NULL`",
              "`NOT NULL` sem `DEFAULT` não é permitido em ALTER TABLE"
            ]
          },

          // 8 - drop e diferenças
          {
            tipo: "topico",
            titulo: "🔹 DROP TABLE e DROP DATABASE",
            lista: [
              "`DROP TABLE tabela CASCADE;` → remove tabela e dependências (views, restrições)",
              "`DROP TABLE tabela RESTRICT;` → só remove se não houver dependências",
              "`DROP DATABASE banco;` → exclusão física e geralmente irreversível",
              "**DELETE** → remove registros, mantém estrutura da tabela",
              "**DROP** → remove a estrutura completamente"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_drop_database.png",
            pasta: "imagens_banco_dados/aula_09",
            num: "4",
            alt: "Exemplo de remocao de banco de dados no PostgreSQL usando DROP DATABASE"
          }

        ]
      }

    ]
  },

  // Aula 10 — Manipulando um Banco de Dados
  {
    aula: "Aula 10 — Manipulando um Banco de Dados",

    ideia_central: "DML é o subconjunto SQL que manipula dados por meio dos comandos SELECT, INSERT, UPDATE e DELETE, com operadores aritméticos, de comparação e lógicos para otimizar consultas.",

    secoes: [

      {
        id: "dml-comandos",
        titulo: "📌 DML e Comandos Principais",

        blocos: [

          // 1 - conceito DML
          {
            tipo: "topico",
            titulo: "🔹 DML — Data Manipulation Language",
            lista: [
              "**DML** → manipula dados armazenados no banco",
              "**DML Procedural** → usuário define quais dados e como obtê-los",
              "**DML Não-Procedural** → usuário define apenas quais dados; o SGBD decide como — SQL é predominantemente não-procedural",
              "**SELECT** → consulta dados",
              "**INSERT** → insere registros",
              "**UPDATE** → altera registros",
              "**DELETE** → exclui registros"
            ]
          },

          {
            tipo: "imagem",
            src: "quadro_comandos_dml.png",
            pasta: "imagens_banco_dados/aula_10",
            num: "Quadro 1",
            alt: "Quadro com os principais comandos de manipulacao de registros da DML"
          },

          // 2 - estrutura básica SELECT
          {
            tipo: "topico",
            titulo: "🔹 Estrutura Básica das Consultas SQL",
            lista: [
              "`SELECT colunas FROM tabela WHERE condição;`",
              "**SELECT** → define quais colunas exibir",
              "**FROM** → define a tabela da consulta",
              "**WHERE** → filtra registros",
              "**DISTINCT** → elimina duplicatas: `SELECT DISTINCT coluna FROM tabela;`"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_select_nomes.png",
            pasta: "imagens_banco_dados/aula_10",
            num: "Figura 1",
            alt: "Exemplo de selecao dos nomes de alunos na tabela alunos usando SELECT e FROM"
          },

          // 3 - insert update delete
          {
            tipo: "topico",
            titulo: "🔹 INSERT, UPDATE e DELETE",
            lista: [
              "**INSERT:** `INSERT INTO tabela VALUES (...);`",
              "Inserção com colunas explícitas evita erros de ordem de atributos",
              "**UPDATE:** `UPDATE tabela SET coluna = valor WHERE condição;`",
              "**DELETE:** `DELETE FROM tabela WHERE condição;`",
              "UPDATE e DELETE **sem WHERE** afetam todos os registros da tabela"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_insert.png",
            pasta: "imagens_banco_dados/aula_10",
            num: "Figura 5",
            alt: "Exemplo de insercao de dados na tabela cursos usando o comando INSERT"
          },

          {
            tipo: "imagem",
            src: "fig_delete.png",
            pasta: "imagens_banco_dados/aula_10",
            num: "Figura 7",
            alt: "Exemplo de exclusao de registros usando o comando DELETE com WHERE"
          },

          {
            tipo: "imagem",
            src: "fig_update.png",
            pasta: "imagens_banco_dados/aula_10",
            num: "Figura 8",
            alt: "Exemplo de alteracao de dados existentes usando o comando UPDATE"
          }

        ]
      },

      {
        id: "operadores",
        titulo: "📌 Operadores SQL",

        blocos: [

          // 4 - operadores aritméticos
          {
            tipo: "topico",
            titulo: "🔹 Operadores Aritméticos",
            lista: [
              "Funcionam apenas em colunas numéricas",
              "`+` soma, `-` subtração, `*` multiplicação, `/` divisão",
              "SQL segue precedência matemática: `*` e `/` antes de `+` e `-`",
              "Parênteses alteram a ordem: `12 * (salario + 500)`",
              "Exemplo: `SELECT salario * 12 AS salario_anual FROM empregados;`"
            ]
          },

          // 5 - operadores de comparação
          {
            tipo: "topico",
            titulo: "🔹 Operadores de Comparação",
            lista: [
              "`=` igual, `<>` diferente",
              "`>` maior, `>=` maior ou igual",
              "`<` menor, `<=` menor ou igual",
              "Exemplo: `WHERE mat_alu >= 911113`"
            ]
          },

          {
            tipo: "imagem",
            src: "tabela_operadores_comparacao.png",
            pasta: "imagens_banco_dados/aula_10",
            num: "Tabela 1",
            alt: "Tabela com os operadores de comparacao utilizados em filtros SQL"
          },

          // 6 - operadores lógicos
          {
            tipo: "topico",
            titulo: "🔹 Operadores Lógicos",
            lista: [
              "**AND** → mais restritivo; ambas as condições devem ser verdadeiras",
              "**OR** → mais amplo; basta uma condição ser verdadeira",
              "**NOT** → inverte o resultado lógico",
              "Exemplo AND: `WHERE tot_cred = 4 AND nom_disc = 'BANCO DE DADOS'`",
              "Exemplo OR: `WHERE tot_cred = 4 OR nom_disc = 'BANCO DE DADOS'`",
              "Exemplo NOT: `WHERE NOT cod_curso = 10`"
            ]
          },

          {
            tipo: "imagem",
            src: "tabela_operadores_logicos.png",
            pasta: "imagens_banco_dados/aula_10",
            num: "Tabela 2",
            alt: "Tabela com os operadores logicos AND, OR e NOT"
          }

        ]
      }

    ]
  },

    // Aula 11 — Refinando Consultas Parte 1
  {
    aula: "Aula 11 — Refinando Consultas em um Banco de Dados • Parte 1",

    ideia_central: "A cláusula WHERE e seus operadores (LIKE, BETWEEN, IN, IS NULL), combinados com funções de agregação e as cláusulas GROUP BY e ORDER BY, permitem transformar consultas SQL simples em consultas inteligentes e úteis para aplicações reais.",

    secoes: [

      {
        id: "clausulas-where",
        titulo: "📌 Cláusulas de Filtragem",

        blocos: [

          // 1 - cláusulas SQL
          {
            tipo: "topico",
            titulo: "🔹 Principais Cláusulas SQL",
            lista: [
              "**SELECT** → define quais colunas exibir",
              "**FROM** → define a tabela da consulta",
              "**WHERE** → filtra registros por condição",
              "**GROUP BY** → agrupa registros com valores iguais; usado com funções de agregação",
              "**HAVING** → filtra resultados após agrupamento",
              "**ORDER BY ASC** → ordem crescente; **DESC** → ordem decrescente"
            ]
          },

          // 2 - ordem de execução
          {
            tipo: "topico",
            titulo: "🔹 Ordem de Execução Interna",
            lista: [
              "Escrevemos: `SELECT → FROM → WHERE`",
              "Banco processa: `FROM → WHERE → SELECT`"
            ]
          },

          // 3 - operador LIKE
          {
            tipo: "topico",
            titulo: "🔹 Operador LIKE",
            lista: [
              "Busca padrões textuais em strings",
              "`%` → qualquer sequência de caracteres",
              "`_` → exatamente um caractere",
              "`LIKE 'Jorge%'` → começa com Jorge",
              "`LIKE '%Silva'` → termina com Silva",
              "`LIKE '%Santos%'` → contém Santos",
              "`LIKE '_este'` → aceita: teste, veste, peste"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_like_consulta_sql.png",
            pasta: "imagens_banco_dados/aula_11",
            num: "1",
            alt: "Exemplo de consulta SQL usando o operador Like com % para buscas por padroes textuais em nomes"
          },

          {
            tipo: "imagem",
            src: "fig_like_underscore.png",
            pasta: "imagens_banco_dados/aula_11",
            num: "2",
            alt: "Exemplo de consulta SQL usando o operador Like com underscore para representar exatamente um caractere"
          },

          // 4 - between e in
          {
            tipo: "topico",
            titulo: "🔹 Operadores BETWEEN e IN",
            lista: [
              "**BETWEEN** → intervalo de valores; muito comum com datas",
              "Sintaxe: `WHERE campo BETWEEN valor1 AND valor2`",
              "**IN** → verifica se valor pertence a uma lista; equivale a múltiplos OR",
              "Sintaxe: `WHERE campo IN (valor1, valor2, valor3)`"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_between_datas.png",
            pasta: "imagens_banco_dados/aula_11",
            num: "3",
            alt: "Exemplo de consulta SQL usando o operador de comparacao BETWEEN com intervalos de datas"
          },

          {
            tipo: "imagem",
            src: "fig_in_consulta.png",
            pasta: "imagens_banco_dados/aula_11",
            num: "4",
            alt: "Exemplo de consulta SQL utilizando o operador de comparacao IN para filtragem baseada em multiplos valores"
          },

          // 5 - IS NULL
          {
            tipo: "topico",
            titulo: "🔹 Operador IS NULL",
            lista: [
              "**NULL** → ausência de valor; não é zero nem espaço vazio",
              "Sintaxe: `WHERE campo IS NULL`",
              "Operações com NULL geram resultado UNKNOWN",
              "Exemplo: `1 < NULL` → não é verdadeiro nem falso, é desconhecido"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_is_null.png",
            pasta: "imagens_banco_dados/aula_11",
            num: "5",
            alt: "Exemplo de consulta SQL utilizando o operador IS NULL para buscar registros com campos sem valor"
          }

        ]
      },

      {
        id: "agregacao-agrupamento",
        titulo: "📌 Funções de Agregação, GROUP BY e ORDER BY",

        blocos: [

          // 6 - funções de agregação
          {
            tipo: "topico",
            titulo: "🔹 Funções de Agregação",
            lista: [
              "**COUNT(*)** → conta todas as linhas, inclusive com NULL",
              "**SUM(col)** → soma valores numéricos; ignora NULL",
              "**AVG(col)** → calcula média; pode usar ALL (considera repetidos) ou DISTINCT (ignora repetidos)",
              "**MIN(col)** → retorna o menor valor",
              "**MAX(col)** → retorna o maior valor"
            ]
          },

          {
            tipo: "imagem",
            src: "quadro_funcoes_agregacao.png",
            pasta: "imagens_banco_dados/aula_11",
            num: "6",
            alt: "Quadro com a relacao das funcoes de agregacao: COUNT, SUM, AVG, MIN e MAX"
          },

          // 7 - GROUP BY
          {
            tipo: "topico",
            titulo: "🔹 GROUP BY",
            lista: [
              "Agrupa registros antes de aplicar funções de agregação",
              "Cada grupo recebe seu próprio valor calculado",
              "**Regra obrigatória:** todo campo no SELECT deve estar no GROUP BY ou dentro de função de agregação",
              "Exemplo: `SELECT cod_curso, AVG(tot_cred) FROM alunos GROUP BY cod_curso;`"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_group_by.png",
            pasta: "imagens_banco_dados/aula_11",
            num: "7",
            alt: "Exemplo de Select com funcao de agregacao e agrupamento GROUP BY"
          },

          {
            tipo: "imagem",
            src: "fig_group_by_incorreto.png",
            pasta: "imagens_banco_dados/aula_11",
            num: "8",
            alt: "Exemplo de Select incorreto usando GROUP BY com campo nao agrupado nem agregado"
          },

          // 8 - ORDER BY
          {
            tipo: "topico",
            titulo: "🔹 ORDER BY",
            lista: [
              "`ORDER BY coluna ASC` → crescente (padrão)",
              "`ORDER BY coluna DESC` → decrescente",
              "Múltiplas colunas: `ORDER BY tot_cred DESC, nom_alu ASC` → desempata pelo segundo campo"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_order_by_desc.png",
            pasta: "imagens_banco_dados/aula_11",
            num: "9",
            alt: "Exemplo de Select com ORDER BY demonstrando ordenacao decrescente de registros"
          },

          {
            tipo: "imagem",
            src: "fig_order_by_multiplos.png",
            pasta: "imagens_banco_dados/aula_11",
            num: "10",
            alt: "Exemplo de Select com ORDER BY utilizando mais de um campo para ordenacao"
          }

        ]
      }

    ]
  },

  // Aula 12 — Refinando Consultas Parte 2
  {
    aula: "Aula 12 — Refinando Consultas em um Banco de Dados • Parte 2",

    ideia_central: "Funções de agregação resumem grandes conjuntos de dados em valores únicos; HAVING filtra grupos após agrupamento; DISTINCT elimina duplicatas — ferramentas essenciais para transformar dados brutos em informações úteis.",

    secoes: [

      {
        id: "agregacao-alias",
        titulo: "📌 Funções de Agregação e Alias",

        blocos: [

          // 1 - funções de agregação
          {
            tipo: "topico",
            titulo: "🔹 Funções de Agregação",
            lista: [
              "Processam diversos valores de uma coluna e retornam um único resultado",
              "**AVG(col)** → média; ignora NULL",
              "**SUM(col)** → soma total; ignora NULL",
              "**COUNT(*)** → conta todas as linhas inclusive com NULL",
              "**COUNT(col)** → conta apenas valores não nulos",
              "**COUNT(DISTINCT col)** → conta valores únicos",
              "**MAX(col)** → maior valor",
              "**MIN(col)** → menor valor",
              "`COUNT(DISTINCT *)` é **inválido** no SQL padrão"
            ]
          },

          // 2 - alias
          {
            tipo: "topico",
            titulo: "🔹 Alias (AS)",
            lista: [
              "Renomeia campos calculados para melhor leitura do resultado",
              "Sem alias: cabeçalho exibe `AVG(tot_cred)`",
              "Com alias: cabeçalho exibe `media_total_credito`",
              "Sintaxe: `SELECT AVG(tot_cred) AS media_total_credito FROM alunos WHERE cod_curso = 10;`"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_selecao_media_creditos.png",
            pasta: "imagens_banco_dados/aula_12",
            num: "1",
            alt: "Seleção de alunos com a média dos totais de créditos usando critério código do curso = 10"
          },

          {
            tipo: "imagem",
            src: "fig_selecao_media_alias.png",
            pasta: "imagens_banco_dados/aula_12",
            num: "2",
            alt: "Seleção de alunos com média de créditos e alias para nomear o campo calculado"
          }

        ]
      },

      {
        id: "groupby-having-execucao",
        titulo: "📌 GROUP BY, HAVING e Ordem de Execução",

        blocos: [

          // 3 - GROUP BY
          {
            tipo: "topico",
            titulo: "🔹 GROUP BY",
            lista: [
              "Divide registros em grupos antes da agregação",
              "Cada grupo recebe seu próprio valor calculado",
              "Sem GROUP BY: toda a tabela é tratada como um único grupo",
              "Sintaxe: `SELECT cod_curso, AVG(tot_cred) AS media_tot_cred FROM alunos GROUP BY cod_curso;`"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_agregacao_group_by.png",
            pasta: "imagens_banco_dados/aula_12",
            num: "3",
            alt: "Exemplo de agregação com agrupamento — GROUP BY divide registros e calcula média por grupo"
          },

          // 4 - HAVING
          {
            tipo: "topico",
            titulo: "🔹 HAVING",
            lista: [
              "Filtra grupos após agrupamento (WHERE filtra linhas antes do agrupamento)",
              "**WHERE** → atua sobre linhas individuais, antes do GROUP BY",
              "**HAVING** → atua sobre grupos, após o GROUP BY",
              "Regra: atributo no HAVING sem função de agregação deve estar no GROUP BY",
              "Exemplo: `HAVING AVG(tot_cred) > 100`"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_exemplo_clausula_having.png",
            pasta: "imagens_banco_dados/aula_12",
            num: "4",
            alt: "Exemplo de cláusula HAVING filtrando grupos após agrupamento"
          },

          // 5 - ordem de execução
          {
            tipo: "topico",
            titulo: "🔹 Ordem de Execução SQL",
            lista: [
              "1º `FROM` → seleciona tabelas",
              "2º `WHERE` → filtra linhas individuais",
              "3º `GROUP BY` → agrupa registros filtrados",
              "4º `HAVING` → filtra os grupos",
              "5º `SELECT` → define o resultado final",
              "6º `ORDER BY` → ordena o resultado"
            ]
          },

          // 6 - NULL em agregações
          {
            tipo: "topico",
            titulo: "🔹 Valores NULL em Agregações",
            lista: [
              "**AVG, SUM, MAX, MIN, COUNT(col)** → ignoram NULL",
              "**COUNT(*)** → conta todas as linhas inclusive com NULL",
              "Se todos os valores forem NULL: COUNT() retorna 0; AVG/SUM/MAX/MIN retornam NULL"
            ]
          }

        ]
      },

      {
        id: "distinct",
        titulo: "📌 DISTINCT",

        blocos: [

          // 7 - DISTINCT
          {
            tipo: "topico",
            titulo: "🔹 Cláusula DISTINCT",
            lista: [
              "Remove duplicatas do resultado da consulta",
              "Sintaxe: `SELECT DISTINCT coluna FROM tabela;`",
              "**DISTINCT em agregações** → remove duplicatas antes de aplicar a função",
              "`COUNT(DISTINCT col)` → válido; conta valores únicos",
              "`COUNT(DISTINCT *)` → **inválido**",
              "**ALL** (padrão implícito) → mantém duplicatas"
            ]
          },

          {
            tipo: "imagem",
            src: "fig_consulta_sem_distinct.png",
            pasta: "imagens_banco_dados/aula_12",
            num: "5",
            alt: "Consulta simples de código de cursos — resultado com duplicatas"
          },

          {
            tipo: "imagem",
            src: "fig_consulta_com_distinct.png",
            pasta: "imagens_banco_dados/aula_12",
            num: "6",
            alt: "Consulta usando DISTINCT — duplicatas eliminadas do resultado"
          },

          {
            tipo: "imagem",
            src: "fig_distinct_agregacao_count.png",
            pasta: "imagens_banco_dados/aula_12",
            num: "7",
            alt: "Consulta usando DISTINCT numa função de agregação COUNT — contagem sem duplicidade"
          }

        ]
      }

    ]
  },

  // Aula 13 — Consultas Aninhadas e Junções
  {
    aula: "Aula 13 — Consultas Aninhadas e Junções",

    ideia_central: "Consultas aninhadas permitem usar o resultado de um SELECT dentro de outro; JOINs combinam tabelas relacionadas — técnicas essenciais para recuperar informações complexas de bancos de dados relacionais.",

    secoes: [

      {
        id: "subqueries",
        titulo: "📌 Consultas Aninhadas (Subqueries)",

        blocos: [

          // 1 - conceito e tipo I
          {
            tipo: "topico",
            titulo: "🔹 Conceito e Tipo I — Independente",
            lista: [
              "**Subconsulta** → instrução SELECT dentro de outro SELECT",
              "Pode aparecer em: `WHERE`, `HAVING`, `FROM`",
              "**Tipo I** → independente da consulta externa; executa uma vez; usa `IN` / `NOT IN`",
              "Fluxo: subconsulta executa primeiro → resultado é usado como filtro pela consulta principal",
              "**NOT IN** → diferença entre conjuntos; retorna elementos que não existem na outra tabela"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_consulta_tipo1_sql.png",
            pasta: "imagens_banco_dados/aula_13",
            num: "1",
            alt: "Exemplo de consulta aninhada Tipo I utilizando IN para filtrar alunos com média maior ou igual a 7"
          },

          {
            tipo: "imagem",
            src: "figura_not_in_diferenca.png",
            pasta: "imagens_banco_dados/aula_13",
            num: "2",
            alt: "Exemplo de consulta usando NOT IN para encontrar registros inexistentes em outra tabela — diferença entre conjuntos"
          },

          // 2 - tipo II
          {
            tipo: "topico",
            titulo: "🔹 Tipo II — Correlacionada",
            lista: [
              "**Tipo II** → depende da consulta externa; executa uma vez por linha da consulta principal",
              "Fluxo: consulta externa seleciona linha → interna executa com valores dessa linha → repete para cada linha",
              "**EXISTS** → verdadeiro se a subconsulta retornar uma ou mais linhas",
              "**NOT EXISTS** → verdadeiro se a subconsulta não retornar linhas",
              "Tipo I: executa uma vez, não depende da externa, usa IN | Tipo II: executa várias vezes, depende da externa, usa EXISTS"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_subconsulta_correlacionada.png",
            pasta: "imagens_banco_dados/aula_13",
            num: "3",
            alt: "Exemplo de consulta aninhada Tipo II demonstrando NOT EXISTS e execução repetida da subconsulta"
          },

          // 3 - subconsulta no FROM
          {
            tipo: "topico",
            titulo: "🔹 Subconsulta na Cláusula FROM",
            lista: [
              "Gera **tabela derivada** (visão inline) — tabela temporária usada pela consulta externa",
              "Requer alias obrigatório: `FROM (SELECT ...) AS alias`",
              "Com funções agregadas na subconsulta, geralmente exige `GROUP BY`",
              "Vantagens: organização, reutilização de resultados intermediários, legibilidade"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_subconsulta_from.png",
            pasta: "imagens_banco_dados/aula_13",
            num: "4",
            alt: "Exemplo de subconsulta na cláusula FROM criando tabela derivada com cálculo de média e aliases"
          }

        ]
      },

      {
        id: "joins",
        titulo: "📌 Junções (JOINs)",

        blocos: [

          // 4 - produto cartesiano e INNER JOIN
          {
            tipo: "topico",
            titulo: "🔹 Produto Cartesiano e INNER JOIN",
            lista: [
              "**Produto Cartesiano** → combina cada linha da tabela A com cada linha da tabela B; gera muitas combinações; precisa de filtros no WHERE",
              "**INNER JOIN** → retorna apenas registros com correspondência nas duas tabelas; funciona como interseção de conjuntos",
              "Valores NULL não combinam automaticamente no INNER JOIN",
              "Sintaxe: `FROM A INNER JOIN B ON A.id = B.id`"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_produto_cartesiano.png",
            pasta: "imagens_banco_dados/aula_13",
            num: "5",
            alt: "Exemplo de consulta utilizando produto cartesiano com relação por chave estrangeira"
          },

          {
            tipo: "imagem",
            src: "figura_inner_join.png",
            pasta: "imagens_banco_dados/aula_13",
            num: "6",
            alt: "Exemplo de consulta utilizando INNER JOIN retornando apenas registros relacionados nas duas tabelas"
          },

          {
            tipo: "imagem",
            src: "figura_teoria_conjuntos_inner.png",
            pasta: "imagens_banco_dados/aula_13",
            num: "7",
            alt: "Comparativo do INNER JOIN com teoria dos conjuntos — interseção entre tabelas"
          },

          // 5 - outer joins
          {
            tipo: "topico",
            titulo: "🔹 LEFT JOIN, RIGHT JOIN e FULL OUTER JOIN",
            lista: [
              "**LEFT JOIN** → todos os registros da tabela esquerda; sem correspondência na direita → NULL",
              "**RIGHT JOIN** → inverso do LEFT; todos da direita; sem correspondência na esquerda → NULL",
              "**FULL OUTER JOIN** → todos os registros das duas tabelas; sem correspondência em qualquer lado → NULL"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_left_join.png",
            pasta: "imagens_banco_dados/aula_13",
            num: "8",
            alt: "Comparativo do LEFT JOIN com teoria dos conjuntos — todos os elementos da esquerda são mantidos"
          },

          {
            tipo: "imagem",
            src: "figura_right_join.png",
            pasta: "imagens_banco_dados/aula_13",
            num: "9",
            alt: "Comparativo do RIGHT JOIN com teoria dos conjuntos — todos os elementos da direita são mantidos"
          },

          {
            tipo: "imagem",
            src: "figura_full_outer_join.png",
            pasta: "imagens_banco_dados/aula_13",
            num: "10",
            alt: "Comparativo do FULL OUTER JOIN — união completa das tabelas incluindo registros sem correspondência"
          }

        ]
      }

    ]
  },
  // Aula 14 — BDOO e BDOR
  {
    aula: "Aula 14 — BDOO e BDOR",

    ideia_central: "Bancos de dados orientados a objetos (BDOO) e objeto-relacionais (BDOR) surgiram para superar as limitações dos bancos relacionais tradicionais frente a dados complexos, incorporando encapsulamento, herança e polimorfismo.",

    secoes: [

      {
        id: "relacional-vs-oo",
        titulo: "📌 Banco Relacional x Banco Orientado a Objetos",

        blocos: [

          // 1 - limitações relacionais
          {
            tipo: "topico",
            titulo: "🔹 Limitações dos Bancos Relacionais",
            lista: [
              "Relacionais tradicionais trabalham com tipos simples: números, textos, datas",
              "Com a evolução surgiram dados complexos: imagens, vídeos, mapas, multimídia",
              "SQL tradicional não manipula facilmente objetos complexos",
              "Isso criou incompatibilidade entre aplicações orientadas a objetos e bancos relacionais"
            ]
          },

          // 2 - BDOO
          {
            tipo: "topico",
            titulo: "🔹 BDOO — Banco de Dados Orientado a Objetos",
            lista: [
              "Une **persistência de dados** com o **paradigma orientado a objetos**",
              "Dados armazenados como objetos com atributos e métodos",
              "Características: encapsulamento, herança, polimorfismo, reutilização, integração com linguagens OO"
            ]
          },

          // 3 - BDOR
          {
            tipo: "topico",
            titulo: "🔹 BDOR — Banco de Dados Objeto-Relacional",
            lista: [
              "Combina modelo relacional com recursos orientados a objetos",
              "Mantém robustez relacional com suporte a objetos complexos",
              "Benefícios: tipos complexos, maior poder de modelagem, reutilização"
            ]
          }

        ]
      },

      {
        id: "pilares-oo",
        titulo: "📌 Pilares da Orientação a Objetos",

        blocos: [

          // 4 - encapsulamento
          {
            tipo: "topico",
            titulo: "🔹 Encapsulamento",
            lista: [
              "Esconde detalhes internos; acesso apenas pela interface do objeto",
              "Objeto possui: dados (atributos) e procedimentos (métodos)",
              "**Classe** → define atributos, métodos e comportamento dos objetos",
              "Benefícios: reutilização, independência de dados, redução de manutenção"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_bdoo_classe_metodos.png",
            pasta: "imagens_banco_dados/aula_14",
            num: "1",
            alt: "Figura 1 — Exemplo de classe com suas variáveis e métodos"
          },

          {
            tipo: "imagem",
            src: "figura_bdoo_reutilizacao_classes.png",
            pasta: "imagens_banco_dados/aula_14",
            num: "2",
            alt: "Figura 2 — Exemplo de classe utilizando variáveis e métodos de outra — reutilização e encapsulamento"
          },

          // 5 - herança
          {
            tipo: "topico",
            titulo: "🔹 Herança",
            lista: [
              "Subclasses reutilizam atributos e métodos da superclasse",
              "**Superclasse** → classe pai; **Subclasse** → classe filha",
              "Exemplo: `CorPonto` herda coordenadas de `Point` e adiciona cor e brilho",
              "Benefícios: reutilização, redução de código, organização hierárquica"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_bdoo_heranca_hierarquia.png",
            pasta: "imagens_banco_dados/aula_14",
            num: "3",
            alt: "Figura 3 — Hierarquia de classe com a subclasse CorPonto"
          },

          {
            tipo: "imagem",
            src: "figura_bdoo_subclasse_corponto.png",
            pasta: "imagens_banco_dados/aula_14",
            num: "4",
            alt: "Figura 4 — Exemplo da hierarquia de classe com atributos herdados e novos atributos da subclasse CorPonto"
          },

          // 6 - polimorfismo
          {
            tipo: "topico",
            titulo: "🔹 Polimorfismo",
            lista: [
              "Mesmo método com implementações diferentes por subclasse",
              "Exemplo: `MesmaCoord` em `Point` compara coordenadas; em `CorPonto` compara coordenadas e cor",
              "**Vinculação estática** → ocorre na compilação; mais eficiente",
              "**Vinculação dinâmica** → ocorre na execução; mais flexível; chamada de vinculação tardia",
              "O SGBD garante compatibilidade entre objetos e métodos"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_bdoo_processamento_mensagem.png",
            pasta: "imagens_banco_dados/aula_14",
            num: "5",
            alt: "Figura 5 — Processamento de uma mensagem entre objetos e classes no paradigma orientado a objetos"
          }

        ]
      },

      {
        id: "odmg-bdor-sql",
        titulo: "📌 ODMG e Recursos do BDOR em SQL",

        blocos: [

          // 7 - ODMG
          {
            tipo: "topico",
            titulo: "🔹 ODMG — Object Database Management Group",
            lista: [
              "Padrão criado para padronizar bancos orientados a objetos",
              "**Modelo de Objetos** → define tipos, objetos e construtores",
              "**ODL (Object Definition Language)** → define objetos e esquemas; equivalente ao DDL relacional",
              "**OQL (Object Query Language)** → consulta baseada em SQL com suporte a herança, polimorfismo e objetos complexos",
              "**Binding** → mapeia objetos da aplicação para o banco"
            ]
          },

          // 8 - tipos e herança SQL
          {
            tipo: "topico",
            titulo: "🔹 Tipos Definidos pelo Usuário e Herança em SQL",
            lista: [
              "**Tipo personalizado:** `CREATE TYPE Pessoa (ID varchar(20), nome varchar(20), endereço varchar(20));`",
              "**Herança de tipo:** `CREATE TYPE Aluno UNDER Pessoa` → Aluno herda atributos de Pessoa",
              "**Herança de tabela (PostgreSQL):** `CREATE TABLE alunos INHERITS pessoas;`",
              "Arrays: PostgreSQL usa `INTEGER[]`; Oracle usa `VARRAY(10) OF INTEGER`"
            ]
          },

          // 9 - referências SQL
          {
            tipo: "topico",
            titulo: "🔹 Tipos de Referência em SQL",
            lista: [
              "Permitem criar referências entre objetos, como ponteiros",
              "Sintaxe: `diretor ref(Pessoa)`",
              "**REF FROM** → usa chave primária como referência do objeto",
              "**Expressões de caminho (SQL:1999):** `diretor->nome` → acessa atributo do objeto referenciado sem join explícito",
              "**DEREF** → retorna o objeto referenciado: `SELECT DEREF(diretor).nome`"
            ]
          }

        ]
      }

    ]
  },

  // Aula 15 — Projeto de Banco de Dado
  {
    aula: "Aula 15 — Projeto de Banco de Dados",

    ideia_central: "Um banco de dados bem projetado depende de boa modelagem, regras de negócio corretas, relacionamentos bem definidos, normalização adequada e implementação física consistente.",

    secoes: [

      {
        id: "etapas-projeto",
        titulo: "📌 Etapas do Projeto de Banco de Dados",

        blocos: [

          // 1 - conceito e objetivos
          {
            tipo: "topico",
            titulo: "🔹 Conceito e Objetivos",
            lista: [
              "**Projeto de BD** → processo de planejamento e organização das informações a serem armazenadas",
              "Objetivos: evitar redundância, garantir integridade, melhorar desempenho, facilitar consultas e manutenção",
              "**SGBD** → armazena dados, controla acessos, garante segurança e executa consultas",
              "SGBDs gratuitos: `PostgreSQL`, `MySQL`; Comerciais: `Oracle`, `SQL Server`, `DB2`"
            ]
          },

          // 2 - etapas
          {
            tipo: "topico",
            titulo: "🔹 Etapas do Projeto",
            lista: [
              "1. **Definir objetivo** → qual problema será resolvido e quais informações serão armazenadas",
              "2. **Identificar entidades** → objetos do mundo real; cada entidade vira uma tabela",
              "3. **Identificar atributos** → características das entidades",
              "4. **Definir chaves (PK)** → atributo que identifica registros de forma única",
              "5. **Definir relacionamentos** → como as entidades se conectam",
              "6. **Normalizar** → eliminar redundância e evitar inconsistências (até 3FN)"
            ]
          },

          // 3 - cardinalidade
          {
            tipo: "topico",
            titulo: "🔹 Cardinalidade",
            lista: [
              "**1:1** → um para um",
              "**1:N** → um para muitos; exemplo: um clube possui vários jogadores",
              "**N:M** → muitos para muitos; exemplo: clube ↔ campeonato; gera entidade associativa"
            ]
          }

        ]
      },

      {
        id: "modelos",
        titulo: "📌 Modelos Conceitual, Lógico e Físico",

        blocos: [

          // 4 - modelo conceitual
          {
            tipo: "topico",
            titulo: "🔹 Modelo Conceitual",
            lista: [
              "Visão geral do negócio; independente de tecnologia e SGBD",
              "Elementos: entidades, atributos e relacionamentos",
              "Alto nível de abstração; facilita comunicação entre usuários e desenvolvedores",
              "Foca nas regras do negócio"
            ]
          },

          {
            tipo: "imagem",
            src: "figura_modelo_conceitual_cbf.png",
            pasta: "imagens_banco_de_dados/aula_1",
            num: "1",
            alt: "Modelo conceitual do sistema da CBF mostrando entidades, atributos e relacionamentos sem detalhes técnicos"
          },

          // 5 - modelo lógico
          {
            tipo: "topico",
            titulo: "🔹 Modelo Lógico",
            lista: [
              "Transforma o modelo conceitual em estruturas relacionais",
              "Define: tabelas, PKs, FKs, relacionamentos, entidades associativas",
              "Utiliza normalização e padrões de nomenclatura",
              "**PK:** `PRIMARY KEY (jogador_id)` | **FK:** `FOREIGN KEY (clube_id) REFERENCES Clube(clube_id)`"
            ]
          },

          {
            tipo: "imagem",
            src: "image_modelo_logico.png",
            pasta: "imagens_banco_de_dados/aula_1",
            num: "2",
            alt: "Modelo lógico com tabelas, chaves primárias, estrangeiras e entidades associativas do sistema da CBF"
          },

          // 6 - modelo físico
          {
            tipo: "topico",
            titulo: "🔹 Modelo Físico",
            lista: [
              "Implementação real no SGBD; depende do banco escolhido",
              "Define: tipos de dados, índices, restrições, campos obrigatórios, armazenamento",
              "**Relacionamento identificado** → FK faz parte da PK",
              "**Relacionamento não identificado** → FK não faz parte da PK"
            ]
          },

          {
            tipo: "imagem",
            src: "image_modelo_fisico.png",
            pasta: "imagens_banco_de_dados/aula_1",
            num: "3",
            alt: "Modelo físico com tipos de dados, relacionamentos identificados e não identificados e campos obrigatórios"
          }

        ]
      },

      {
        id: "ddl-dml-ferramentas",
        titulo: "📌 DDL, DML e Ferramentas",

        blocos: [

          // 7 - DDL e DML
          {
            tipo: "topico",
            titulo: "🔹 DDL e DML",
            lista: [
              "**DDL** → cria e gerencia estruturas: `CREATE`, `ALTER`, `DROP`",
              "**DML** → manipula dados: `INSERT`, `UPDATE`, `DELETE`, `SELECT`",
              "Consulta com JOIN: `SELECT * FROM tabela1 INNER JOIN tabela2 ON tabela1.id = tabela2.id`",
              "Relatório com GROUP BY: `SELECT federacao.sigla, COUNT(clube_id) FROM clube INNER JOIN federacao ON ... GROUP BY federacao.sigla`"
            ]
          },

          // 8 - ferramentas
          {
            tipo: "topico",
            titulo: "🔹 Ferramentas Utilizadas",
            lista: [
              "**MySQLWorkbench** → geração automática de scripts DDL",
              "**PostgreSQL** → SGBD open source utilizado no projeto",
              "**PGAdmin** → interface gráfica para PostgreSQL",
              "**SQLines** → conversão de scripts entre diferentes SGBDs"
            ]
          },

          {
            tipo: "imagem",
            src: "image_geracao_ddl.png",
            pasta: "imagens_banco_de_dados/aula_1",
            num: "4",
            alt: "Geração automática de scripts SQL no MySQLWorkbench"
          },

          {
            tipo: "imagem",
            src: "image_conversao_sqlines.png",
            pasta: "imagens_banco_de_dados/aula_1",
            num: "5",
            alt: "Conversão de scripts MySQL para PostgreSQL usando a ferramenta SQLines"
          },

          {
            tipo: "imagem",
            src: "image_pgadmin_criacao_bd.png",
            pasta: "imagens_banco_de_dados/aula_1",
            num: "6",
            alt: "Criação de um novo banco de dados no PostgreSQL via PGAdmin"
          },

          {
            tipo: "imagem",
            src: "image_consulta_clubes_federacao.png",
            pasta: "imagens_banco_de_dados/aula_1",
            num: "7",
            alt: "Consulta de clubes por federação demonstrando uso de JOIN e GROUP BY para geração de relatórios"
          }

        ]
      }

    ]
  },



],

  resumao: [
   {
  aula: "AULA RESUMÃO",
  ideia_central: "DDL define estruturas, DML manipula dados, refinamentos e JOINs recuperam informações complexas, BDOO/BDOR incorporam orientação a objetos, e um bom projeto de banco passa por modelagem conceitual, lógica e física.",
  secoes: [
    {
      id: "visao_geral",
      titulo: "Visão Geral",
      blocos: [
        {
          tipo: "lista",
          titulo: "Mapa rápido por módulo:",
          itens: [
            "Aula 9 — DDL: CREATE, ALTER, DROP · chaves primária e estrangeira · tipos de dados SQL",
            "Aula 10 — DML: SELECT, INSERT, UPDATE, DELETE · operadores aritméticos, comparação e lógicos",
            "Aula 11 — Refinando parte 1: WHERE, LIKE, BETWEEN, IN, IS NULL · funções de agregação · GROUP BY · ORDER BY",
            "Aula 12 — Refinando parte 2: HAVING · DISTINCT · alias AS · ordem de execução SQL · NULL em agregações",
            "Aula 13 — Subqueries e JOINs: Tipo I (IN/NOT IN) · Tipo II (EXISTS/NOT EXISTS) · tabelas derivadas · INNER/LEFT/RIGHT/FULL OUTER JOIN",
            "Aula 14 — BDOO e BDOR: encapsulamento · herança · polimorfismo · ODMG (ODL/OQL) · tipos definidos pelo usuário · herança de tipo e tabela · referências",
            "Aula 15 — Projeto de BD: modelagem conceitual/lógica/física · cardinalidade · normalização · DDL e DML aplicados"
          ]
        }
      ]
    },
    {
      id: "conceitos_essenciais",
      titulo: "Conceitos Essenciais",
      blocos: [
        {
          tipo: "tabela",
          colunas: ["Conceito", "Definição"],
          linhas: [
            ["DDL", "Subconjunto SQL que define estruturas — CREATE, ALTER, DROP"],
            ["DML", "Subconjunto SQL que manipula dados — SELECT, INSERT, UPDATE, DELETE"],
            ["Esquema", "Agrupamento lógico de objetos do banco (tabelas, views, restrições)"],
            ["Catálogo", "Coleção de esquemas; contém INFORMATION_SCHEMA com metadados"],
            ["PRIMARY KEY", "Identifica unicamente cada registro — única e não nula"],
            ["FOREIGN KEY", "Garante integridade referencial entre tabelas"],
            ["CASCADE", "Remove dependências junto com o objeto excluído"],
            ["RESTRICT", "Impede exclusão se houver dependências"],
            ["NULL", "Ausência de valor — não é zero nem espaço vazio"],
            ["DISTINCT", "Elimina duplicatas do resultado da consulta"],
            ["Alias (AS)", "Renomeia campos calculados no resultado"],
            ["Subquery Tipo I", "Subconsulta independente, executa uma vez, usa IN / NOT IN"],
            ["Subquery Tipo II", "Subconsulta correlacionada, executa por linha, usa EXISTS / NOT EXISTS"],
            ["Tabela derivada", "Resultado de subconsulta usada no FROM como tabela temporária"],
            ["Produto cartesiano", "Combinação de todas as linhas de duas tabelas sem filtro de relacionamento"],
            ["BDOO", "Banco orientado a objetos — dados como objetos com atributos e métodos"],
            ["BDOR", "Banco objeto-relacional — modelo relacional com recursos OO"],
            ["Encapsulamento", "Oculta detalhes internos; acesso apenas pela interface do objeto"],
            ["Herança", "Subclasse reutiliza atributos e métodos da superclasse"],
            ["Polimorfismo", "Mesmo método com implementações diferentes por subclasse"],
            ["ODL", "Object Definition Language — define objetos e esquemas no ODMG"],
            ["OQL", "Object Query Language — consulta baseada em SQL com suporte a herança e polimorfismo"],
            ["Binding", "Mapeia objetos da aplicação para o banco de dados"],
            ["Cardinalidade", "Define quantas ocorrências existem entre entidades (1:1, 1:N, N:M)"],
            ["Normalização", "Processo para eliminar redundância e evitar inconsistências (até 3FN)"]
          ]
        }
      ]
    },
    {
      id: "comandos_sintaxe",
      titulo: "Comandos e Sintaxe",
      blocos: [
        {
          tipo: "subtitulo",
          texto: "DDL"
        },
        {
          tipo: "exemplo",
          titulo: "CREATE DATABASE",
          texto: "Cria um banco de dados.",
          detalhe: "CREATE DATABASE nome;"
        },
        {
          tipo: "exemplo",
          titulo: "CREATE TABLE com PRIMARY KEY",
          texto: "Cria tabela com chave primária nomeada.",
          detalhe: "CREATE TABLE alunos (\n  mat_alu INTEGER,\n  nom_alu VARCHAR(50),\n  CONSTRAINT alu_pk PRIMARY KEY (mat_alu)\n);"
        },
        {
          tipo: "exemplo",
          titulo: "ALTER TABLE",
          texto: "Adiciona coluna a tabela existente. Registros antigos recebem NULL.",
          detalhe: "ALTER TABLE alunos ADD CTPS VARCHAR(8);"
        },
        {
          tipo: "exemplo",
          titulo: "DROP TABLE / DROP DATABASE",
          texto: "Remove tabela com dependências (CASCADE) ou banco inteiro.",
          detalhe: "DROP TABLE curriculos CASCADE;\nDROP DATABASE nome;"
        },
        {
          tipo: "exemplo",
          titulo: "FOREIGN KEY",
          texto: "Relaciona tabelas garantindo integridade referencial.",
          detalhe: "FOREIGN KEY (cod_curso) REFERENCES cursos(cod_curso)"
        },
        {
          tipo: "subtitulo",
          texto: "DML"
        },
        {
          tipo: "exemplo",
          titulo: "SELECT",
          texto: "Estrutura básica de consulta.",
          detalhe: "SELECT colunas\nFROM tabela\nWHERE condição;"
        },
        {
          tipo: "exemplo",
          titulo: "INSERT",
          texto: "Inserir registro com colunas explícitas.",
          detalhe: "INSERT INTO cursos (cod_curso, nome_curso, tot_cred, cod_coord)\nVALUES (11, 'Sistemas de Informação', 180, 1149);"
        },
        {
          tipo: "exemplo",
          titulo: "UPDATE",
          texto: "Atualizar registros — sempre usar WHERE.",
          detalhe: "UPDATE cursos\nSET nome_curso = 'SI – Sistemas de Informação'\nWHERE cod_curso = 11;"
        },
        {
          tipo: "exemplo",
          titulo: "DELETE",
          texto: "Excluir registros — sempre usar WHERE.",
          detalhe: "DELETE FROM alunos WHERE mat_alu = 911113;"
        },
        {
          tipo: "destaque",
          texto: "UPDATE e DELETE sem WHERE afetam TODOS os registros da tabela. Principal pegadinha de prova."
        },
        {
          tipo: "subtitulo",
          texto: "Refinamento de consultas"
        },
        {
          tipo: "exemplo",
          titulo: "LIKE",
          texto: "% = qualquer sequência de caracteres. _ = exatamente um caractere.",
          detalhe: "WHERE nom_alu LIKE 'Jorge%'   -- começa com Jorge\nWHERE nom_alu LIKE '%Santos%'  -- contém Santos\nWHERE campo   LIKE '_este'     -- 1 char antes de 'este'"
        },
        {
          tipo: "exemplo",
          titulo: "BETWEEN / IN / IS NULL",
          texto: "Filtros de intervalo, lista e ausência de valor.",
          detalhe: "WHERE dat_nasc BETWEEN '1980-01-01' AND '1989-12-31'\nWHERE mat_alu IN (922155, 926465, 915550)\nWHERE email IS NULL"
        },
        {
          tipo: "exemplo",
          titulo: "GROUP BY + HAVING",
          texto: "Agrupa e filtra grupos. Alias melhora legibilidade.",
          detalhe: "SELECT cod_curso, AVG(tot_cred) AS media_tot_cred\nFROM alunos\nGROUP BY cod_curso\nHAVING AVG(tot_cred) > 100;"
        },
        {
          tipo: "exemplo",
          titulo: "ORDER BY",
          texto: "Ordenação crescente e decrescente, com múltiplas colunas.",
          detalhe: "ORDER BY tot_cred DESC, nom_alu ASC"
        },
        {
          tipo: "subtitulo",
          texto: "Subqueries"
        },
        {
          tipo: "exemplo",
          titulo: "Subquery Tipo I — IN",
          texto: "Subconsulta independente. Executa uma vez.",
          detalhe: "SELECT nom_alu, cod_curso, tot_cred\nFROM alunos\nWHERE mat_alu IN (\n  SELECT mat_alu\n  FROM historicos_escolares\n  WHERE media >= 7 AND ano = 2001\n);"
        },
        {
          tipo: "exemplo",
          titulo: "Subquery Tipo II — EXISTS",
          texto: "Subconsulta correlacionada. Executa para cada linha da consulta externa.",
          detalhe: "SELECT *\nFROM tabelaA\nWHERE EXISTS (\n  SELECT *\n  FROM tabelaB\n  WHERE tabelaA.id = tabelaB.id\n);"
        },
        {
          tipo: "exemplo",
          titulo: "Subconsulta no FROM",
          texto: "Gera tabela derivada (visão inline).",
          detalhe: "SELECT *\nFROM (\n  SELECT cod_curso, AVG(tot_cred) AS media\n  FROM alunos\n  GROUP BY cod_curso\n) AS sub;"
        },
        {
          tipo: "subtitulo",
          texto: "JOINs"
        },
        {
          tipo: "codigo",
          codigo: "-- INNER JOIN: só registros relacionados\nFROM A INNER JOIN B ON A.id = B.id\n\n-- LEFT JOIN: todos da esquerda; direita NULL se sem correspondência\nFROM A LEFT JOIN B ON A.id = B.id\n\n-- RIGHT JOIN: todos da direita; esquerda NULL se sem correspondência\nFROM A RIGHT JOIN B ON A.id = B.id\n\n-- FULL OUTER JOIN: todos os registros das duas tabelas\nFROM A FULL OUTER JOIN B ON A.id = B.id"
        },
        {
          tipo: "subtitulo",
          texto: "BDOR — SQL objeto-relacional"
        },
        {
          tipo: "codigo",
          codigo: "-- Criar tipo personalizado\nCREATE TYPE Pessoa (\n  ID VARCHAR(20),\n  nome VARCHAR(20),\n  endereco VARCHAR(20)\n);\n\n-- Herança de tipo\nCREATE TYPE Aluno UNDER Pessoa;\n\n-- Tabela baseada em tipo\nCREATE TABLE pessoas OF Pessoa;\n\n-- Herança de tabela (PostgreSQL)\nCREATE TABLE alunos INHERITS pessoas;\n\n-- Referência e expressão de caminho\ndiretor REF(Pessoa)\nSELECT diretor->nome ...\nSELECT DEREF(diretor).nome ..."
        }
      ]
    },
    {
      id: "comparacoes",
      titulo: "Comparações",
      blocos: [
        {
          tipo: "tabela",
          titulo: "Comparações fundamentais",
          colunas: ["A", "B", "Diferença principal"],
          linhas: [
            ["DDL", "DML", "DDL define estruturas; DML manipula dados"],
            ["DELETE", "DROP", "DELETE remove registros (tabela existe); DROP remove a estrutura"],
            ["CHAR", "VARCHAR", "CHAR é tamanho fixo; VARCHAR é variável (mais eficiente)"],
            ["AND", "OR", "AND exige ambas verdadeiras; OR basta uma"],
            ["WHERE", "HAVING", "WHERE filtra linhas antes do agrupamento; HAVING filtra grupos depois"],
            ["COUNT(*)", "COUNT(col)", "COUNT(*) inclui NULL; COUNT(col) ignora NULL"],
            ["INNER JOIN", "LEFT JOIN", "INNER só retorna correspondências; LEFT mantém todos da esquerda"],
            ["LEFT JOIN", "RIGHT JOIN", "LEFT = todos da esquerda; RIGHT = todos da direita"],
            ["FULL OUTER JOIN", "INNER JOIN", "FULL retorna tudo (com NULL nos sem par); INNER só os pares"],
            ["Subquery Tipo I", "Subquery Tipo II", "Tipo I executa uma vez (IN); Tipo II executa por linha (EXISTS)"],
            ["IN", "EXISTS", "IN compara com lista de valores; EXISTS verifica existência de linhas"],
            ["NOT IN", "NOT EXISTS", "NOT IN falha se lista contiver NULL; NOT EXISTS é mais seguro"],
            ["BDOO", "BDOR", "BDOO = OO puro (ODMG/OQL); BDOR = relacional + OO (SQL:1999)"],
            ["Modelo conceitual", "Modelo lógico", "Conceitual = visão negócio (independente de SGBD); Lógico = estrutura relacional com PKs e FKs"],
            ["Modelo lógico", "Modelo físico", "Lógico = independente de SGBD; Físico = implementação real com tipos, índices e restrições"],
            ["Rel. identificado", "Rel. não identificado", "Identificado: FK faz parte da PK; Não identificado: FK não faz parte da PK"]
          ]
        }
      ]
    },
    {
      id: "processos_etapas",
      titulo: "Processos e Etapas",
      blocos: [
        {
          tipo: "topico",
          titulo: "Ordem de execução SQL",
          texto: "A ordem de escrita difere da ordem de execução interna — muito cobrado em prova.",
          lista: [
            "1. FROM — seleciona a(s) tabela(s)",
            "2. WHERE — filtra linhas individuais",
            "3. GROUP BY — agrupa os registros filtrados",
            "4. HAVING — filtra os grupos",
            "5. SELECT — define o resultado final",
            "6. ORDER BY — ordena o resultado"
          ]
        },
        {
          tipo: "topico",
          titulo: "Etapas do projeto de banco de dados",
          lista: [
            "1. Definir o objetivo do banco (qual problema resolver)",
            "2. Identificar entidades (objetos do mundo real → tabelas)",
            "3. Identificar atributos (características de cada entidade)",
            "4. Definir identificadores — chaves primárias (PK)",
            "5. Definir relacionamentos e cardinalidade (1:1, 1:N, N:M)",
            "6. Normalizar (eliminar redundância — até 3ª Forma Normal)",
            "7. Modelo conceitual → lógico → físico",
            "8. Implementação com DDL e DML"
          ]
        },
        {
          tipo: "topico",
          titulo: "Fluxo de execução de subquery Tipo I",
          lista: [
            "1. A subconsulta executa primeiro (independentemente)",
            "2. O resultado é armazenado como lista de valores",
            "3. A consulta principal usa esse resultado como filtro (IN / NOT IN)"
          ]
        },
        {
          tipo: "topico",
          titulo: "Fluxo de execução de subquery Tipo II",
          lista: [
            "1. A consulta externa seleciona uma linha",
            "2. A consulta interna executa usando valores dessa linha",
            "3. Processo repete para cada linha da consulta externa",
            "4. EXISTS retorna verdadeiro se a interna retornar ao menos uma linha"
          ]
        }
      ]
    },
    {
      id: "imagens_importantes",
      titulo: "Imagens Importantes",
      blocos: [
        {
          tipo: "imagem",
          src: "quadro_tipos_sql.png",
          pasta: "imagens_banco_dados/aula_09",
          num: "Quadro 1",
          alt: "Quadro com os principais tipos de dados utilizados na definicao de tabelas SQL"
        },
        {
          tipo: "destaque",
          texto: "Memorize os tipos SQL e suas diferenças: CHAR (fixo) vs VARCHAR (variável), INTEGER vs SMALLINT (tamanho), DATE/TIME, BLOB (binário)."
        },
        {
          tipo: "imagem",
          src: "fig_primary_key.png",
          pasta: "imagens_banco_dados/aula_09",
          num: "5",
          alt: "Exemplo de definicao de chave primaria em uma tabela SQL"
        },
        {
          tipo: "destaque",
          texto: "PRIMARY KEY: única + não nula. Pode ser definida inline ou via CONSTRAINT com nome."
        },
        {
          tipo: "imagem",
          src: "fig_foreign_key.png",
          pasta: "imagens_banco_dados/aula_09",
          num: "6",
          alt: "Exemplo de relacionamento entre tabelas usando chave estrangeira e integridade referencial"
        },
        {
          tipo: "destaque",
          texto: "FOREIGN KEY garante integridade referencial — impede que um aluno referencie um curso inexistente."
        },
        {
          tipo: "imagem",
          src: "quadro_comandos_dml.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Quadro 1",
          alt: "Quadro com os principais comandos de manipulacao de registros da DML"
        },
        {
          tipo: "destaque",
          texto: "Os quatro comandos DML: SELECT (consulta), INSERT (insere), UPDATE (altera), DELETE (remove)."
        },
        {
          tipo: "imagem",
          src: "tabela_operadores_comparacao.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Tabela 1",
          alt: "Tabela com os operadores de comparacao utilizados em filtros SQL"
        },
        {
          tipo: "destaque",
          texto: "Operador de diferença em SQL é <> (não != como em algumas linguagens)."
        },
        {
          tipo: "imagem",
          src: "tabela_operadores_logicos.png",
          pasta: "imagens_banco_dados/aula_10",
          num: "Tabela 2",
          alt: "Tabela com os operadores logicos AND, OR e NOT"
        },
        {
          tipo: "destaque",
          texto: "AND é mais restritivo; OR é mais amplo. NOT inverte. Parênteses controlam precedência."
        },
        {
          tipo: "imagem",
          src: "quadro_funcoes_agregacao.png",
          pasta: "imagens_banco_dados/aula_11",
          num: "6",
          alt: "Quadro com a relacao das funcoes de agregacao: COUNT, SUM, AVG, MIN e MAX"
        },
        {
          tipo: "destaque",
          texto: "Cinco funções de agregação: COUNT, SUM, AVG, MIN, MAX. Apenas COUNT(*) não ignora NULL."
        },
        {
          tipo: "imagem",
          src: "fig_agregacao_group_by.png",
          pasta: "imagens_banco_dados/aula_12",
          num: "3",
          alt: "Exemplo de agregação com agrupamento — GROUP BY divide registros e calcula média por grupo"
        },
        {
          tipo: "destaque",
          texto: "Sem GROUP BY, toda a tabela é tratado como um único grupo. Com GROUP BY, cada grupo recebe seu próprio valor calculado."
        },
        {
          tipo: "imagem",
          src: "fig_exemplo_clausula_having.png",
          pasta: "imagens_banco_dados/aula_12",
          num: "4",
          alt: "Exemplo de cláusula HAVING filtrando grupos após agrupamento"
        },
        {
          tipo: "destaque",
          texto: "HAVING filtra grupos após agrupamento. Todo atributo no HAVING sem função agregada deve estar no GROUP BY."
        },
        {
          tipo: "imagem",
          src: "figura_consulta_tipo1_sql.png",
          pasta: "imagens_banco_dados/aula_13",
          num: 1,
          alt: "Exemplo de consulta aninhada Tipo I utilizando IN para filtrar alunos com média maior ou igual a 7"
        },
        {
          tipo: "destaque",
          texto: "Subquery Tipo I com IN: subconsulta executa uma vez e retorna lista usada pela consulta externa."
        },
        {
          tipo: "imagem",
          src: "figura_subconsulta_correlacionada.png",
          pasta: "imagens_banco_dados/aula_13",
          num: 3,
          alt: "Exemplo de consulta aninhada Tipo II demonstrando NOT EXISTS e execução repetida da subconsulta"
        },
        {
          tipo: "destaque",
          texto: "Subquery Tipo II com NOT EXISTS: executa para cada linha da externa. Mais seguro que NOT IN quando há NULLs."
        },
        {
          tipo: "imagem",
          src: "figura_inner_join.png",
          pasta: "imagens_banco_dados/aula_13",
          num: 6,
          alt: "Exemplo de consulta utilizando INNER JOIN retornando apenas registros relacionados nas duas tabelas"
        },
        {
          tipo: "destaque",
          texto: "INNER JOIN = interseção. Se não há correspondência, o registro não aparece em nenhum dos lados."
        },
        {
          tipo: "imagem",
          src: "figura_left_join.png",
          pasta: "imagens_banco_dados/aula_13",
          num: 8,
          alt: "Comparativo do LEFT JOIN com teoria dos conjuntos — todos os elementos da esquerda são mantidos"
        },
        {
          tipo: "destaque",
          texto: "LEFT JOIN: todos da esquerda aparecem. Sem correspondência na direita → campos da direita ficam NULL."
        },
        {
          tipo: "imagem",
          src: "figura_full_outer_join.png",
          pasta: "imagens_banco_dados/aula_13",
          num: 10,
          alt: "Comparativo do FULL OUTER JOIN — união completa das tabelas incluindo registros sem correspondência"
        },
        {
          tipo: "destaque",
          texto: "FULL OUTER JOIN: todos os registros das duas tabelas. Sem par → campos ausentes ficam NULL."
        },
        {
          tipo: "imagem",
          src: "figura_bdoo_heranca_hierarquia.png",
          pasta: "imagens_banco_dados/aula_14",
          num: 3,
          alt: "Figura 3 — Hierarquia de classe com a subclasse CorPonto"
        },
        {
          tipo: "destaque",
          texto: "Herança OO: subclasse herda atributos e métodos da superclasse e pode adicionar novos."
        },
        {
          tipo: "imagem",
          src: "image_modelo_logico.png",
          pasta: "imagens_banco_de_dados/aula_1",
          num: 2,
          alt: "Modelo lógico com tabelas, chaves primárias, estrangeiras e entidades associativas do sistema da CBF"
        },
        {
          tipo: "destaque",
          texto: "Modelo lógico: tabelas com PKs e FKs definidas. Relacionamentos N:M geram entidade associativa."
        },
        {
          tipo: "imagem",
          src: "image_modelo_fisico.png",
          pasta: "imagens_banco_de_dados/aula_1",
          num: 3,
          alt: "Modelo físico com tipos de dados, relacionamentos identificados e não identificados e campos obrigatórios"
        },
        {
          tipo: "destaque",
          texto: "Modelo físico: implementação real no SGBD com tipos, índices e restrições. Depende do SGBD escolhido."
        }
      ]
    },
    {
      id: "decore_para_prova",
      titulo: "Decore para a Prova",
      blocos: [
        {
          tipo: "tabela",
          titulo: "Pontos mais cobrados — todas as aulas",
          colunas: ["Ponto", "O que saber"],
          linhas: [
            ["Ordem de execução SQL", "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY"],
            ["NULL", "Não é zero, não é espaço — ausência de valor. Operação com NULL = UNKNOWN"],
            ["GROUP BY — regra obrigatória", "Todo campo no SELECT deve estar no GROUP BY ou dentro de função agregada"],
            ["HAVING vs WHERE", "WHERE filtra linhas antes do agrupamento; HAVING filtra grupos depois"],
            ["COUNT(*) vs COUNT(col)", "COUNT(*) conta tudo inclusive NULL; COUNT(col) ignora NULL; COUNT(DISTINCT *) é inválido"],
            ["LIKE coringas", "% = qualquer sequência de caracteres; _ = exatamente 1 caractere"],
            ["UPDATE/DELETE sem WHERE", "Afeta TODOS os registros da tabela — principal armadilha de prova"],
            ["DROP DATABASE", "Exclusão física, geralmente irreversível — exige extremo cuidado"],
            ["PRIMARY KEY", "Única + não nula. Definida com CONSTRAINT para ter nome"],
            ["FOREIGN KEY", "Garante integridade referencial — impede referência inválida"],
            ["CASCADE vs RESTRICT", "CASCADE remove junto; RESTRICT impede exclusão se houver dependência"],
            ["CHAR vs VARCHAR", "CHAR é tamanho fixo (ocupa sempre n bytes); VARCHAR é variável"],
            ["DELETE vs DROP", "DELETE remove registros (tabela continua); DROP remove a estrutura"],
            ["Subquery Tipo I vs II", "I = independente, executa uma vez, usa IN; II = correlacionada, executa por linha, usa EXISTS"],
            ["NOT IN com NULL", "Se a lista contiver NULL, NOT IN retorna vazio — prefira NOT EXISTS"],
            ["EXISTS vs IN", "EXISTS verifica existência de linhas; IN compara com lista de valores"],
            ["INNER vs LEFT JOIN", "INNER = interseção (só pares); LEFT = todos da esquerda + NULL onde não há par"],
            ["FULL OUTER JOIN", "Todos os registros das duas tabelas; campos sem par ficam NULL"],
            ["Pilares OO", "Encapsulamento (oculta detalhes) + Herança (reutiliza) + Polimorfismo (várias formas)"],
            ["ODMG", "ODL = define objetos; OQL = consulta com herança; Binding = mapeia OO ↔ BD"],
            ["Herança SQL", "CREATE TYPE sub UNDER super; CREATE TABLE filho INHERITS pai"],
            ["Expressão de caminho", "diretor->nome acessa atributo do objeto referenciado sem JOIN explícito"],
            ["DEREF", "SELECT DEREF(diretor).nome — retorna o objeto referenciado"],
            ["Modelos de projeto", "Conceitual (negócio, sem SGBD) → Lógico (relacional, PKs/FKs) → Físico (SGBD real, tipos)"],
            ["Cardinalidade N:M", "Gera entidade associativa (tabela intermediária com FKs para ambas as entidades)"],
            ["Normalização", "Elimina redundância e anomalias de atualização; material cobre até 3FN"]
          ]
        },
        {
          tipo: "destaque",
          texto: "DML procedural: usuário diz QUAIS dados e COMO obtê-los. DML não-procedural (SQL): usuário diz apenas QUAIS dados; o SGBD decide como obtê-los."
        },
        {
          tipo: "destaque",
          texto: "Ao adicionar coluna com ALTER TABLE, registros antigos recebem NULL. NOT NULL sem DEFAULT não é permitido."
        }
      ]
    }
  ]
}
  ]



  
};