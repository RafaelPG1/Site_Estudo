/* =============================================
   NEXUS STUDY — res_banco_dados.js
   Disciplina: Banco de Dados
   ============================================= */

window.__nexusConteudo = {
  aulas: [
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
    }
  ]
};