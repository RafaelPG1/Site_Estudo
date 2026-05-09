/* =============================================
   NEXUS STUDY — res_banco_dados.js
   Disciplina: Banco de Dados
   ============================================= */

window.__nexusConteudo = {
  aulas: [
    //Aula 9 — Definindo um Banco de Dados
    {
      aula: "Aula 9 — Definindo um Banco de Dados",
      ideia_central: "A DDL permite criar, modificar e remover estruturas em um banco de dados relacional.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "Principais tópicos:",
              itens: [
                "Conceito de banco de dados",
                "Estrutura de **esquema e catálogo**",
                "Comandos DDL: **CREATE** · **ALTER** · **DROP**",
                "Criação e manipulação de bancos de dados e tabelas",
                "Definição de **chaves primárias e estrangeiras**"
              ]
            }
          ]
        },

        {
          id: "conceitos",
          titulo: "🧠 Conceitos Principais",
          blocos: [

            {
              tipo: "topico",
              titulo: "🔹 SQL e DDL",
              lista: [
                "**SQL (Structured Query Language)** é a linguagem padrão para bancos relacionais",
                "A **DDL** é um subconjunto da SQL responsável por: Criar estruturas · Alterar estruturas · Remover estruturas"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Banco de dados relacional",
              lista: [
                "Organizado em: **Tabelas (relações)** · **Linhas (tuplas)** · **Colunas (atributos)**"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Esquema (Schema)",
              lista: [
                "Conjunto de objetos do banco: Tabelas · Views · Restrições",
                "Representa a **estrutura lógica do banco**",
                "✔ Inclui: Tipos de dados · Relações · Regras de integridade"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Catálogo",
              lista: [
                "Conjunto de **esquemas**",
                "Contém informações sobre: Estruturas do banco · Metadados",
                "✔ Possui o **INFORMATION_SCHEMA** → guarda informações sobre o banco"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Comandos DDL"
            },

            {
              tipo: "topico",
              titulo: "📌 CREATE",
              lista: [
                "Usado para **criar estruturas**",
                "✔ Pode criar: Banco de dados · Tabelas · Índices · Views"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 ALTER",
              lista: [
                "Usado para **modificar estruturas existentes**",
                "✔ Permite: Adicionar colunas · Alterar tipos de dados · Adicionar/remover restrições"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 DROP",
              lista: [
                "Usado para **remover estruturas**",
                "⚠ Atenção: Remove permanentemente (sem recuperação fácil)"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 CREATE DATABASE",
              lista: [
                "Cria um banco de dados",
                "✔ Pode definir: Usuário proprietário · Configurações do banco"
              ],
              codigo: "CREATE DATABASE nome_base;"
            },

            {
              tipo: "topico",
              titulo: "🔹 CREATE TABLE",
              lista: [
                "Cria uma tabela com: Campos (colunas) · Tipos de dados · Restrições"
              ],
              codigo: "CREATE TABLE nome_tabela (\n  campo tipo restrição\n);"
            },

            {
              tipo: "tabela",
              titulo: "🔹 Tipos de dados principais",
              colunas: ["Tipo", "Descrição"],
              linhas: [
                ["CHAR(n)",    "Texto fixo"],
                ["VARCHAR(n)", "Texto variável"],
                ["INTEGER",    "Número inteiro"],
                ["SMALLINT",   "Inteiro menor"],
                ["DECIMAL",    "Número com casas decimais"],
                ["FLOAT",      "Número real"],
                ["DATE",       "Data"],
                ["TIME",       "Hora"],
                ["BLOB",       "Arquivos (imagem, áudio, etc.)"]
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 ALTER DATABASE",
              lista: ["Modifica propriedades do banco"],
              codigo: "ALTER DATABASE Exemplo RENAME TO BDAcademico;"
            },

            {
              tipo: "topico",
              titulo: "🔹 ALTER TABLE",
              lista: [
                "Permite modificar tabela existente",
                "⚠ Novas colunas podem receber **NULL** por padrão"
              ],
              codigo: "ALTER TABLE tabela ADD coluna tipo;"
            },

            {
              tipo: "topico",
              titulo: "🔹 DROP TABLE",
              lista: [
                "Remove uma tabela completamente",
                "✔ `DROP TABLE` → remove estrutura + dados",
                "✔ `DELETE` → remove apenas dados"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 DROP DATABASE",
              lista: [
                "Remove todo o banco de dados",
                "⚠ Muito perigoso: Exclusão definitiva"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 CASCADE vs RESTRICT",
              lista: [
                "**CASCADE** → remove dependências automaticamente",
                "**RESTRICT** → impede exclusão se houver dependência"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Chave Primária (PRIMARY KEY)",
              lista: [
                "Identifica **unicamente** cada registro",
                "✔ Regras: Não pode ser nula · Deve ser única"
              ],
              codigo: "PRIMARY KEY (id)"
            },

            {
              tipo: "topico",
              titulo: "🔹 Chave Estrangeira (FOREIGN KEY)",
              lista: [
                "Cria relacionamento entre tabelas",
                "✔ Regra: Valor deve existir na tabela referenciada"
              ],
              codigo: "FOREIGN KEY (cod_curso) REFERENCES cursos(cod_curso)"
            },

            {
              tipo: "topico",
              titulo: "🔹 Integridade referencial",
              lista: [
                "Garante que dados relacionados sejam consistentes",
                "Não existam referências inválidas"
              ]
            }
          ]
        },

        {
          id: "metodos",
          titulo: "📊 Fórmulas e Métodos",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Estrutura geral de criação de tabela",
              codigo: "CREATE TABLE tabela (\n  campo tipo [restrições],\n  PRIMARY KEY (...),\n  FOREIGN KEY (...) REFERENCES ...\n);"
            },
            {
              tipo: "topico",
              titulo: "🔹 Método de modelagem básica",
              lista: [
                "1. Definir entidades (tabelas)",
                "2. Definir atributos (colunas)",
                "3. Definir tipos de dados",
                "4. Definir chave primária",
                "5. Criar relacionamentos (chaves estrangeiras)",
                "6. Aplicar restrições"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Processo de definição de banco",
              lista: [
                "1. Criar banco → `CREATE DATABASE`",
                "2. Criar tabelas → `CREATE TABLE`",
                "3. Ajustar estrutura → `ALTER`",
                "4. Remover (se necessário) → `DROP`"
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
              titulo: "Exemplo 1 — Criação de tabela",
              texto: "Criar tabela de alunos: Define campos · Define tipos · Define chave primária.",
              detalhe: "👉 Resultado: estrutura organizada para armazenar dados"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Alteração de tabela",
              texto: "Adicionar campo 'CTPS': Novo atributo inserido · Pode gerar valores NULL.",
              detalhe: ""
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Chave primária",
              texto: "Campo matrícula: Identifica aluno · Não pode repetir.",
              detalhe: ""
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Chave estrangeira",
              texto: "Campo curso: Deve existir na tabela cursos · Garante consistência.",
              detalhe: ""
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 5 — DROP perigoso",
              texto: "Excluir banco: Remove tudo definitivamente.",
              detalhe: "👉 Uso exige cuidado extremo"
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
                "**DDL** = cria, altera e remove estruturas",
                "Comandos principais: **CREATE** → cria · **ALTER** → modifica · **DROP** → exclui",
                "Estrutura do banco: Esquema → organização lógica · Catálogo → conjunto de esquemas",
                "**CREATE TABLE**: Define colunas + tipos + restrições",
                "Tipos de dados: Texto · números · datas · binários",
                "**ALTER TABLE**: Adiciona ou modifica colunas",
                "**DROP**: Remove permanentemente (⚠ cuidado)",
                "**PRIMARY KEY**: Identifica registros (único e não nulo)",
                "**FOREIGN KEY**: Cria relacionamento entre tabelas"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: DDL define a estrutura do banco, enquanto chaves garantem organização e integridade dos dados."
            }
          ]
        }

      ]
    },
    //Aula 10 — Manipulando um Banco de Dados
    {
      aula: "Aula 10 — Manipulando um Banco de Dados",
      ideia_central: "A DML permite buscar, inserir, atualizar e excluir dados em um banco de dados relacional usando SQL.",
      secoes: [
 
        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "Principais tópicos:",
              itens: [
                "Conceito de **DML (Data Manipulation Language)**",
                "Comandos principais: **SELECT** · **INSERT** · **UPDATE** · **DELETE**",
                "Estrutura de consultas SQL",
                "Tipos de DML: procedural e não procedural",
                "Uso de **operadores** para otimizar consultas"
              ]
            }
          ]
        },
 
        {
          id: "conceitos",
          titulo: "🧠 Conceitos Principais",
          blocos: [
 
            {
              tipo: "topico",
              titulo: "🔹 DML (Data Manipulation Language)",
              lista: [
                "Subconjunto da SQL responsável por **manipular os dados armazenados**",
                "Funções principais: Buscar dados · Inserir dados · Atualizar dados · Excluir dados"
              ]
            },
 
            {
              tipo: "topico",
              titulo: "🔹 Tipos de DML — Procedural",
              lista: [
                "O usuário informa **o que quer** e **como obter**",
                "Mais controle, porém mais complexo"
              ]
            },
 
            {
              tipo: "topico",
              titulo: "🔹 Tipos de DML — Não Procedural (SQL)",
              lista: [
                "O usuário informa **apenas o que quer**",
                "Mais simples, porém pode ser menos otimizado",
                "✔ É o modelo utilizado pelo SQL"
              ]
            },
 
            {
              tipo: "topico",
              titulo: "🔹 Consulta (Query)",
              lista: [
                "Comando para **buscar informações** no banco",
                "Base da maioria das operações em SQL"
              ]
            },
 
            {
              tipo: "topico",
              titulo: "🔹 Estrutura Básica de uma Consulta SQL",
              lista: [
                "**SELECT** → define o que será retornado",
                "**FROM** → indica a tabela",
                "**WHERE** → filtra os dados"
              ],
              codigo: "SELECT coluna\nFROM tabela\nWHERE condição;"
            },
 
            {
              tipo: "topico",
              titulo: "🔹 Duplicatas em SQL",
              lista: [
                "SQL permite **valores repetidos** por padrão",
                "Para remover duplicatas use **DISTINCT**"
              ],
              codigo: "SELECT DISTINCT coluna\nFROM tabela;"
            },
 
            {
              tipo: "subtitulo",
              texto: "Comandos DML"
            },
 
            {
              tipo: "topico",
              titulo: "📌 INSERT — Inserir dados",
              lista: [
                "Insere novos registros na tabela",
                "✔ Valores devem respeitar o tipo de dado",
                "✔ Ordem dos valores deve corresponder às colunas"
              ],
              codigo: "INSERT INTO tabela VALUES (valor1, valor2, ...);\n\n-- Com especificação de colunas:\nINSERT INTO tabela (coluna1, coluna2)\nVALUES (valor1, valor2);"
            },
 
            {
              tipo: "topico",
              titulo: "📌 DELETE — Excluir dados",
              lista: [
                "Remove registros da tabela",
                "⚠ Sem WHERE → apaga **todos os registros**",
                "✔ Remove **linhas completas** (não apenas colunas)"
              ],
              codigo: "DELETE FROM tabela\nWHERE condição;\n\n-- Sem WHERE (apaga tudo!):\nDELETE FROM tabela;"
            },
 
            {
              tipo: "topico",
              titulo: "📌 UPDATE — Atualizar dados",
              lista: [
                "Modifica registros existentes",
                "⚠ Sem WHERE → altera **todos os registros**",
                "✔ Permite atualizar múltiplas colunas ao mesmo tempo"
              ],
              codigo: "UPDATE tabela\nSET coluna = valor\nWHERE condição;\n\n-- Múltiplas colunas:\nUPDATE tabela\nSET coluna1 = valor1, coluna2 = valor2\nWHERE condição;"
            },
 
            {
              tipo: "topico",
              titulo: "📌 SELECT — Consultar dados",
              lista: [
                "Recupera dados do banco",
                "✔ Pode incluir filtros com WHERE"
              ],
              codigo: "SELECT nome\nFROM alunos;"
            },
 
            {
              tipo: "subtitulo",
              texto: "Operadores para Consultas"
            },
 
            {
              tipo: "tabela",
              titulo: "🔹 Operadores Aritméticos",
              colunas: ["Operador", "Função"],
              linhas: [
                ["+", "Soma"],
                ["-", "Subtração"],
                ["*", "Multiplicação"],
                ["/", "Divisão"]
              ]
            },
 
            {
              tipo: "topico",
              titulo: "🔹 Precedência de Operadores",
              lista: [
                "**Parênteses** têm prioridade sobre os demais operadores",
                "⚠ Sem parênteses → ordem pode mudar o resultado"
              ],
              codigo: "SELECT salario * 12 AS salario_anual\nFROM empregados;\n\n-- Com parênteses (prioridade):\nSELECT 12 * (salario + 500)\nFROM empregados;"
            },
 
            {
              tipo: "tabela",
              titulo: "🔹 Operadores de Comparação",
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
              tipo: "tabela",
              titulo: "🔹 Operadores Lógicos",
              colunas: ["Operador", "Função"],
              linhas: [
                ["AND", "Todas as condições devem ser verdadeiras"],
                ["OR",  "Pelo menos uma condição deve ser verdadeira"],
                ["NOT", "Inverte a condição"]
              ]
            },
 
            {
              tipo: "topico",
              titulo: "🔹 Exemplos de Operadores Lógicos",
              lista: [
                "**AND** → mais restritivo (filtra menos registros)",
                "**OR** → mais amplo (filtra mais registros)"
              ],
              codigo: "-- AND (ambas as condições):\nWHERE credito = 4 AND disciplina = 'BD'\n\n-- OR (qualquer uma das condições):\nWHERE credito = 4 OR disciplina = 'BD'"
            }
 
          ]
        },
 
        {
          id: "metodos",
          titulo: "📊 Fórmulas e Métodos",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Estrutura completa de consulta",
              codigo: "SELECT coluna1, coluna2\nFROM tabela\nWHERE condição;"
            },
            {
              tipo: "topico",
              titulo: "🔹 CRUD em SQL",
              lista: [
                "**C**reate → `INSERT INTO`",
                "**R**ead   → `SELECT`",
                "**U**pdate → `UPDATE`",
                "**D**elete → `DELETE`"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Boas práticas com WHERE",
              lista: [
                "1. Sempre usar WHERE no DELETE para não apagar tudo",
                "2. Sempre usar WHERE no UPDATE para não alterar tudo",
                "3. Combinar operadores lógicos para refinar filtros",
                "4. Usar parênteses para garantir a ordem correta dos operadores"
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
              titulo: "Exemplo 1 — Consulta simples",
              texto: "Buscar nomes dos alunos: Retorna apenas uma coluna com os nomes.",
              detalhe: "👉 SELECT nome FROM alunos;"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Inserção de dados",
              texto: "Adicionar novo curso com código, nome, carga horária e valor.",
              detalhe: "👉 INSERT INTO cursos VALUES (11,'Sistemas de Informação',180,1149);"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Exclusão de dados",
              texto: "Remover um aluno específico pelo número de matrícula.",
              detalhe: "👉 DELETE FROM alunos WHERE matricula = 911113;"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Atualização de dados",
              texto: "Renomear o curso de código 11 para um nome mais descritivo.",
              detalhe: "👉 UPDATE cursos SET nome='SI - Sistemas de Informação' WHERE codigo = 11;"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 5 — Uso de operadores aritméticos",
              texto: "Calcular salário anual com bônus de 500 por mês para cada empregado.",
              detalhe: "👉 SELECT nome, salario, 12*(salario+500) FROM empregados;"
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
                "**DML** = manipula dados (buscar, inserir, atualizar, excluir)",
                "**SELECT** → consultar · **INSERT** → inserir · **UPDATE** → atualizar · **DELETE** → excluir",
                "Estrutura SQL: `SELECT` · `FROM` · `WHERE`",
                "⚠ **DELETE sem WHERE** → apaga todos os registros",
                "⚠ **UPDATE sem WHERE** → altera todos os registros",
                "**Operadores aritméticos** → cálculos em consultas",
                "**Operadores de comparação** → filtros com =, >, <, <>, etc.",
                "**Operadores lógicos** → combinar condições com AND, OR, NOT",
                "**DISTINCT** → remove duplicatas no resultado da consulta"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: SQL DML = CRUD | WHERE = controle total da consulta | Operadores = refinar e otimizar resultados."
            }
          ]
        }
 
      ]
    },
    //Aula 11 — Refinando Consultas em um Banco de Dados • Parte 1
    {
      aula: "Aula 11 — Refinando Consultas em um Banco de Dados • Parte 1",
      ideia_central: "Não basta consultar dados — é preciso refiná-los usando filtros, operadores, funções de agregação e ordenação para obter exatamente o que se deseja.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "Principais tópicos:",
              itens: [
                "Filtrar dados com **WHERE**",
                "Operadores especiais: **LIKE** · **BETWEEN** · **IN** · **IS NULL**",
                "Ordenar resultados com **ORDER BY**",
                "Realizar cálculos com **funções de agregação**",
                "Agrupar dados com **GROUP BY**"
              ]
            }
          ]
        },

        {
          id: "conceitos",
          titulo: "🧠 Conceitos Principais",
          blocos: [

            {
              tipo: "topico",
              titulo: "🔹 Estrutura Básica de uma Consulta SQL",
              lista: [
                "**SELECT** → define o que será retornado",
                "**FROM** → indica a tabela",
                "**WHERE** → filtra os dados"
              ],
              codigo: "SELECT colunas\nFROM tabela\nWHERE condição;"
            },

            {
              tipo: "topico",
              titulo: "🔹 Ordem de Execução Real da Consulta",
              lista: [
                "**1º FROM** → define a origem dos dados",
                "**2º WHERE** → filtra os registros",
                "**3º SELECT** → mostra o resultado"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Cláusula WHERE",
              lista: [
                "Restringe os dados retornados pela consulta",
                "Seleciona apenas registros que satisfazem uma condição",
                "✔ Não é obrigatória",
                "✔ Muito usada em SELECT, UPDATE e DELETE"
              ],
              codigo: "SELECT * FROM alunos WHERE cod_curso = 10;"
            },

            {
              tipo: "subtitulo",
              texto: "Operadores da Cláusula WHERE"
            },

            {
              tipo: "topico",
              titulo: "📌 LIKE — Busca Textual",
              lista: [
                "Permite buscar **padrões em textos** usando curingas",
                "**%** → qualquer sequência de caracteres",
                "**_** → exatamente 1 caractere",
                "✔ Usado para pesquisas flexíveis em strings"
              ],
              codigo: "-- Começa com Jorge:\nWHERE nome LIKE 'Jorge%'\n\n-- Contém Santos:\nWHERE nome LIKE '%Santos%'\n\n-- Segunda letra é 'u':\nWHERE nome LIKE '_u%'"
            },

            {
              tipo: "topico",
              titulo: "📌 BETWEEN — Intervalo de Valores",
              lista: [
                "Filtra valores dentro de um **intervalo fechado**",
                "✔ Muito usado com datas e números",
                "✔ Equivale a: >= valor_inicial AND <= valor_final"
              ],
              codigo: "WHERE dat_nasc BETWEEN '1980-01-01' AND '1989-12-31';"
            },

            {
              tipo: "topico",
              titulo: "📌 IN — Lista de Valores",
              lista: [
                "Filtra valores dentro de uma **lista predefinida**",
                "✔ Equivalente a vários OR encadeados"
              ],
              codigo: "WHERE mat_alu IN (922155, 926465, 915550);\n\n-- Equivale a:\n-- mat_alu = 922155 OR mat_alu = 926465 OR mat_alu = 915550"
            },

            {
              tipo: "topico",
              titulo: "📌 IS NULL — Valores Nulos",
              lista: [
                "Verifica se um campo **não possui valor**",
                "⚠ NULL ≠ vazio ou zero",
                "⚠ Comparações com NULL resultam em UNKNOWN (nem verdadeiro nem falso)"
              ],
              codigo: "WHERE email IS NULL;"
            },

            {
              tipo: "subtitulo",
              texto: "Funções de Agregação"
            },

            {
              tipo: "tabela",
              titulo: "🔹 Principais Funções de Agregação",
              colunas: ["Função", "Descrição"],
              linhas: [
                ["COUNT", "Conta registros"],
                ["SUM",   "Soma valores"],
                ["AVG",   "Calcula a média"],
                ["MIN",   "Retorna o menor valor"],
                ["MAX",   "Retorna o maior valor"]
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 GROUP BY — Agrupamento de Dados",
              lista: [
                "Agrupa registros com base em **um ou mais campos**",
                "✔ Usado para relatórios e estatísticas por categoria",
                "⚠ Campos no SELECT devem estar no GROUP BY ou dentro de funções agregadas"
              ],
              codigo: "SELECT cod_curso, AVG(credito)\nFROM alunos\nGROUP BY cod_curso;"
            },

            {
              tipo: "topico",
              titulo: "🔹 ORDER BY — Ordenação de Resultados",
              lista: [
                "Ordena os resultados da consulta",
                "**ASC** → crescente (padrão)",
                "**DESC** → decrescente",
                "✔ Pode ordenar por múltiplas colunas"
              ],
              codigo: "-- Crescente:\nORDER BY nome ASC;\n\n-- Decrescente:\nORDER BY credito DESC;\n\n-- Múltiplas colunas:\nORDER BY credito DESC, nome ASC;"
            }

          ]
        },

        {
          id: "metodos",
          titulo: "📊 Fórmulas e Métodos",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Estrutura completa de consulta",
              codigo: "SELECT colunas\nFROM tabela\nWHERE condição\nGROUP BY coluna\nORDER BY coluna ASC/DESC;"
            },
            {
              tipo: "topico",
              titulo: "🔹 Funções de Agregação",
              lista: [
                "**COUNT** → `SELECT COUNT(*) FROM tabela;`",
                "**SUM** → `SELECT SUM(coluna) FROM tabela;`",
                "**AVG** → `SELECT AVG(coluna) FROM tabela;`",
                "**MIN/MAX** → `SELECT MIN(coluna), MAX(coluna) FROM tabela;`"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Boas práticas com WHERE e operadores",
              lista: [
                "1. Usar LIKE com % e _ para buscas flexíveis em texto",
                "2. Usar BETWEEN para intervalos de datas e números",
                "3. Usar IN para substituir vários OR encadeados",
                "4. Usar IS NULL (nunca = NULL) para verificar campos sem valor",
                "5. Combinar GROUP BY com funções de agregação para relatórios"
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
              titulo: "Exemplo 1 — Filtro com LIKE",
              texto: "Buscar todos os alunos cujo nome começa com 'Jorge'.",
              detalhe: "👉 SELECT * FROM alunos WHERE nome LIKE 'Jorge%';"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Intervalo com BETWEEN",
              texto: "Retornar alunos nascidos na década de 80.",
              detalhe: "👉 SELECT * FROM alunos WHERE dat_nasc BETWEEN '1980-01-01' AND '1989-12-31';"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Lista com IN",
              texto: "Buscar alunos por lista de matrículas específicas.",
              detalhe: "👉 SELECT * FROM alunos WHERE mat_alu IN (922155, 926465);"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Contagem com COUNT",
              texto: "Descobrir a quantidade total de alunos cadastrados.",
              detalhe: "👉 SELECT COUNT(*) FROM alunos;"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 5 — Agrupamento com GROUP BY",
              texto: "Calcular a média de créditos por curso.",
              detalhe: "👉 SELECT cod_curso, AVG(credito) FROM alunos GROUP BY cod_curso;"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 6 — Ordenação com ORDER BY",
              texto: "Listar alunos em ordem decrescente de nome.",
              detalhe: "👉 SELECT * FROM alunos ORDER BY nome DESC;"
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
                "**WHERE** → filtra dados da consulta",
                "**LIKE** → busca por padrão em texto usando % e _",
                "**BETWEEN** → filtra intervalo de valores (datas e números)",
                "**IN** → filtra por lista de valores (substitui vários OR)",
                "**IS NULL** → verifica campos sem valor (NULL ≠ zero ou vazio)",
                "**COUNT** → conta registros · **SUM** → soma · **AVG** → média",
                "**MIN** → menor valor · **MAX** → maior valor",
                "**GROUP BY** → agrupa registros por campo",
                "**ORDER BY** → ordena resultados (ASC crescente / DESC decrescente)"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: WHERE = filtro | LIKE/BETWEEN/IN/IS NULL = operadores especiais | Agregação = COUNT/SUM/AVG/MIN/MAX | GROUP BY = agrupar | ORDER BY = ordenar."
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
            "Ignora valores NULL automaticamente"
          ],
          codigo: "SELECT AVG(coluna)\nFROM tabela;"
        },
        {
          tipo: "topico",
          titulo: "📌 SUM() — Soma",
          lista: [
            "Soma todos os valores de uma coluna",
            "Ignora valores NULL"
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
            "⚠ `COUNT(DISTINCT *)` é **inválido** no SQL padrão"
          ],
          codigo: "SELECT COUNT(*) FROM tabela;            -- conta tudo\nSELECT COUNT(col) FROM tabela;          -- ignora NULL\nSELECT COUNT(DISTINCT col) FROM tabela; -- únicos"
        },
        {
          tipo: "topico",
          titulo: "📌 MAX() e MIN()",
          lista: [
            "**MAX** → retorna o maior valor da coluna",
            "**MIN** → retorna o menor valor da coluna",
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
    }
 
  ] 
};