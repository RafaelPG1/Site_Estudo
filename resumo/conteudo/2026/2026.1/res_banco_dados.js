/* =============================================
   NEXUS STUDY — res_banco_dados.js
   Disciplina: Banco de Dados
   ============================================= */

window.__nexusConteudo = {
  aulas: [

    /* ─────────────────────────────────────────
       AULA 1 — Introdução a Banco de Dados
    ───────────────────────────────────────── */
    {
      aula: "Aula 1 — Introdução a Banco de Dados",
      ideia_central: "Bancos de dados evoluíram do armazenamento manual para SGBDs modernos, organizando dados de forma estruturada, persistente e compartilhada.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "Principais tópicos:",
              itens: [
                "Contexto histórico dos bancos de dados",
                "Definição de **banco de dados** e **SGBD**",
                "Distinção entre dado, fato, informação e metadado",
                "Elementos básicos: tabela, registro, campo e **chaves**",
                "Operações básicas: **CRUD** e controle de transações",
                "Níveis de abstração: físico · lógico · visão"
              ]
            }
          ]
        },

        {
          id: "conceitos",
          titulo: "🧠 Conceitos Principais",
          blocos: [

            {
              tipo: "subtitulo",
              texto: "História dos SGBDs"
            },

            {
              tipo: "topico",
              titulo: "🔹 Antes da Computação",
              lista: [
                "Dados armazenados manualmente: cadernetas · fichas físicas · pastas",
                "Problemas: atualização trabalhosa · relatórios demorados · alto risco de inconsistência"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Anos 60 — Primeiros SGBDs",
              lista: [
                "Surgem os primeiros sistemas gerenciadores de banco de dados",
                "Características: acesso por ponteiros de baixo nível · estruturas rígidas · processamento limitado"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Anos 70 — Modelo Relacional",
              lista: [
                "**Edgar Frank Codd** publica o artigo que introduz o Modelo Relacional",
                "Dados organizados em tabelas com base matemática (Teoria dos Conjuntos e Álgebra Relacional)",
                "**Peter Chen** propõe o Modelo ER (Entidade-Relacionamento) para modelagem conceitual",
                "Surge o **SQL** como linguagem padrão para bancos relacionais"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Anos 80–2000 — Comercialização e NoSQL",
              lista: [
                "Anos 80: Oracle e IBM DB2 tornam os SGBDs comercialmente populares",
                "Anos 90: Orientação a Objetos — dados organizados por classes e atributos",
                "Anos 2000: **NoSQL** — alta escalabilidade, flexibilidade, Big Data",
                "Tipos NoSQL: documentos · grafos · chave-valor · colunas"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Conceitos de SGBD"
            },

            {
              tipo: "topico",
              titulo: "🔹 Banco de Dados (BD)",
              lista: [
                "Coleção de dados relacionados que representam um aspecto do mundo real",
                "Propriedades: **persistência** · organização estruturada · compartilhamento controlado"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 SGBD — Sistema Gerenciador de Banco de Dados",
              lista: [
                "Software responsável por: **definir** · construir · manipular · compartilhar um banco de dados",
                "Funções: definição de dados · armazenamento físico · manipulação · controle de acesso · controle de concorrência"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Dado, Informação e Metadado"
            },

            {
              tipo: "topico",
              titulo: "🔹 Hierarquia do Conhecimento",
              lista: [
                "**Dado** → elemento bruto, sem significado isolado",
                "**Fato** → conjunto de dados relacionados, ocorrência do mundo real",
                "**Informação** → dados processados e organizados com significado",
                "**Conhecimento** → informação interpretada, gera aprendizado",
                "**Metadado** → dados sobre dados (estrutura, tipo, restrições) — ficam no catálogo do SGBD"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Elementos e Estrutura Relacional"
            },

            {
              tipo: "topico",
              titulo: "🔹 Arquiteturas de Servidor",
              lista: [
                "**File Server** → processamento no cliente, baixa performance em grandes volumes",
                "**Database Server** → processamento no servidor, multiusuário eficiente",
                "**Web Server** → disponibiliza recursos via internet, pode integrar banco de dados"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Estrutura de uma Tabela",
              lista: [
                "**Tabela** → representa uma entidade (conjunto de linhas e colunas)",
                "**Registro (Tupla)** → instância da entidade, conjunto de campos",
                "**Campo (Atributo)** → característica da entidade (Nome, CPF, Endereço)"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Chaves",
              lista: [
                "**Chave Primária (PK)** → identificador único, não pode repetir, não pode ser nulo",
                "**Chave Estrangeira (FK)** → relaciona tabelas, pode repetir, referencia PK de outra tabela"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Níveis de Abstração"
            },

            {
              tipo: "topico",
              titulo: "🔹 Três Níveis",
              lista: [
                "**Físico** → como os dados são armazenados (bytes, blocos, arquivos) — usuário comum não acessa",
                "**Lógico** → quais dados existem, tipos e relacionamentos — responsabilidade do DBA",
                "**Visão (Conceitual)** → o que cada usuário enxerga, interface gráfica, restrições de acesso"
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
              titulo: "🔹 CRUD — Operações Básicas",
              lista: [
                "**C** — Create (Inserção)",
                "**R** — Read (Consulta)",
                "**U** — Update (Atualização)",
                "**D** — Delete (Exclusão)"
              ],
              codigo: "INSERT INTO Clientes (...)\nSELECT IdCliente, Nome FROM Clientes;\nUPDATE Clientes SET Nome = 'José' WHERE IdCliente = 1;\nDELETE FROM Clientes WHERE IdCliente = 1;"
            },
            {
              tipo: "topico",
              titulo: "🔹 Controle de Transação",
              lista: [
                "**BEGIN TRANSACTION** → inicia transação lógica",
                "**@@ROWCOUNT** → verifica quantidade de registros afetados",
                "**COMMIT** → confirma alteração",
                "**ROLLBACK** → desfaz operação",
                "Boas práticas: sempre usar WHERE · validar antes de confirmar"
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
              titulo: "Exemplo 1 — Dado vs Informação",
              texto: "Dado bruto: 'Perna'. Informação: 'Total de vendas no mês = R$ 50.000'. O dado sozinho não tem significado; a informação é processada e tem propósito.",
              detalhe: "👉 Metadados ficam no catálogo do SGBD e descrevem essa estrutura"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Modelo Relacional",
              texto: "Tabela ALUNO com colunas: Matrícula (PK), Nome, CPF, Telefone. Cada linha é um aluno diferente.",
              detalhe: "👉 A Chave Primária (Matrícula) garante que nenhum aluno se repita"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — CRUD na prática",
              texto: "Inserir cliente → INSERT. Ver lista → SELECT. Mudar endereço → UPDATE. Cancelar cadastro → DELETE.",
              detalhe: ""
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Níveis de abstração",
              texto: "Usuário vê apenas nome e saldo (visão). DBA vê tabelas e relacionamentos (lógico). Sistema armazena em blocos de disco (físico).",
              detalhe: "👉 Cada nível oculta a complexidade do nível inferior"
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
                "**BD** = coleção organizada de dados; **SGBD** = software que gerencia o BD",
                "Modelo Relacional (Codd, anos 70): tabelas · tuplas · atributos",
                "Modelo ER (Peter Chen, anos 70): modelagem conceitual com entidades e relacionamentos",
                "SQL = linguagem padrão para bancos relacionais",
                "Hierarquia: Dado → Fato → Informação → Conhecimento",
                "**Metadados** ficam no catálogo do SGBD",
                "**PK** = identificador único (não nulo); **FK** = ligação entre tabelas",
                "CRUD: INSERT · SELECT · UPDATE · DELETE",
                "3 níveis de abstração: físico · lógico · visão"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: BD é o conteúdo estruturado; SGBD é o mecanismo que controla, acessa e manipula esse conteúdo. A abstração em três níveis garante que cada usuário veja apenas o que precisa."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 2 — Características de um SGBD
    ───────────────────────────────────────── */
    {
      aula: "Aula 2 — Características de um SGBD",
      ideia_central: "O SGBD é um software que gerencia bancos de dados com independência de dados, múltiplas visões, controle de concorrência e arquitetura de três esquemas (ANSI/SPARC).",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "Principais tópicos:",
              itens: [
                "Definição técnica de BD e SGBD",
                "Quatro componentes de um SGBD: **dados · hardware · software · usuários**",
                "Diferença entre SGBD e processamento tradicional de arquivos",
                "Natureza autodescritiva e **metadados**",
                "**Independência programa-dados** e abstração",
                "Arquitetura de três esquemas: **interno · conceitual · externo**",
                "Principais SGBDs do mercado"
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
              titulo: "🔹 Definição de SGBD",
              lista: [
                "Software de propósito geral que facilita: **definição** · construção · manipulação · compartilhamento de bancos de dados",
                "Opera como camada intermediária entre usuário, hardware e dados"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Quatro Componentes Básicos"
            },

            {
              tipo: "topico",
              titulo: "🔹 Dados",
              lista: [
                "Em sistemas multiusuários: **integrados** (redução de redundância) e **compartilhados** (acesso simultâneo)",
                "Integração = unificação de arquivos; Compartilhamento = acesso simultâneo controlado"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Hardware",
              lista: [
                "Armazenamento secundário: HD e SSD; Memória RAM; Processador (CPU)",
                "Pontos críticos: leitura/gravação em disco · consumo de CPU · consumo de memória"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Software (SGBD)",
              lista: [
                "Processa requisições · controla acesso · garante integridade",
                "⚠ No mercado, 'Banco de Dados' é usado como sinônimo de SGBD — tecnicamente incorreto"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Usuários",
              lista: [
                "**Desenvolvedores** → criam aplicações, utilizam Java/C++, enviam SQL ao SGBD",
                "**Usuários finais** → acessam via interface, executam consultas básicas",
                "**DBA** → garante segurança, controla desempenho, gerencia riscos e otimizações"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Principais Características"
            },

            {
              tipo: "topico",
              titulo: "🔹 Natureza Autodescritiva",
              lista: [
                "O SGBD mantém os dados e seus **metadados** no mesmo catálogo",
                "Metadados descrevem: estrutura das tabelas · tipos de dados · restrições"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Independência Programa-Dados",
              lista: [
                "A estrutura dos dados fica **separada das aplicações**",
                "Permite modificar o banco sem alterar os programas que o usam",
                "Abstração: usuários interagem com representações conceituais sem conhecer detalhes físicos"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Múltiplas Visões",
              lista: [
                "Diferentes usuários podem ter diferentes perspectivas (views) do mesmo banco",
                "Cada visão mostra apenas o subconjunto relevante para aquele usuário"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Controle de Concorrência e Transações",
              lista: [
                "Em ambientes multiusuários, vários usuários acessam simultaneamente",
                "SGBD deve garantir integridade e evitar inconsistências em acessos simultâneos"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Arquitetura de Três Esquemas (ANSI/SPARC)"
            },

            {
              tipo: "topico",
              titulo: "🔹 Nível Interno",
              lista: [
                "Próximo ao armazenamento físico",
                "Define como os dados são armazenados: estrutura física · tamanho em bytes · caminhos de acesso"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Nível Conceitual",
              lista: [
                "Representação lógica global do banco",
                "Descreve entidades · relacionamentos · restrições — sem detalhar o físico"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Nível Externo",
              lista: [
                "Visão do usuário — mostra apenas parte do banco",
                "Simplifica a interação e aplica restrições de acesso"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Principais SGBDs do Mercado"
            },

            {
              tipo: "tabela",
              titulo: "🔹 Comparativo de SGBDs",
              colunas: ["SGBD", "Origem", "Linguagem", "Característica Principal"],
              linhas: [
                ["Oracle",     "1970–1980",  "PL/SQL", "Alta escalabilidade, grandes volumes"],
                ["SQL Server", "Microsoft 1989", "T-SQL", "Alta segurança, integração Microsoft"],
                ["MySQL",      "Open source", "SQL",   "Popular em aplicações web"],
                ["PostgreSQL", "Open source (BSD)", "SQL", "Consultas complexas, sem hardware avançado"]
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
              titulo: "🔹 SGBD vs Processamento Tradicional",
              lista: [
                "**Tradicional** → cada aplicação mantém seus próprios arquivos, alta redundância, difícil consistência",
                "**SGBD** → repositório único, acesso compartilhado, redução de redundância"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Fluxo da Arquitetura de Três Níveis",
              lista: [
                "1. Usuário faz requisição no nível externo (sua visão)",
                "2. SGBD traduz para o nível conceitual (estrutura lógica geral)",
                "3. SGBD acessa o nível interno (armazenamento físico real)",
                "4. Resultado sobe os níveis de volta ao usuário"
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
              titulo: "Exemplo 1 — Integração de dados",
              texto: "Em um sistema universitário: a especialidade do professor não precisa estar duplicada na tabela Disciplina, pois pode ser obtida por relacionamento com a tabela Professor.",
              detalhe: "👉 Isso é integração: eliminar redundância sem perder informação"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Controle de Concorrência",
              texto: "Dois usuários tentam comprar o último produto em estoque ao mesmo tempo. O SGBD controla para que apenas um consiga.",
              detalhe: "👉 Sem controle de concorrência, ambos poderiam ser aprovados — gerando inconsistência"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Abstração de dados",
              texto: "Um aluno acessa o portal e vê apenas sua nota. O DBA vê todas as tabelas. O servidor armazena blocos de bytes. Três visões diferentes, mesmo banco.",
              detalhe: ""
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Independência programa-dados",
              texto: "O DBA adiciona uma nova coluna 'Email' na tabela Aluno. Os sistemas que usam o banco (site, app) continuam funcionando normalmente, pois a estrutura está separada da aplicação.",
              detalhe: ""
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
                "SGBD = software que **define, constrói, manipula e compartilha** bancos de dados",
                "4 componentes: **dados · hardware · software · usuários**",
                "Natureza autodescritiva: SGBD guarda dados **e metadados** no catálogo",
                "Independência programa-dados: estrutura separada das aplicações",
                "Múltiplas visões: cada usuário vê apenas seu subconjunto",
                "Controle de concorrência: garante integridade em acessos simultâneos",
                "3 níveis ANSI/SPARC: **interno** (físico) · **conceitual** (lógico) · **externo** (visão do usuário)",
                "SGBDs populares: Oracle · SQL Server · MySQL · PostgreSQL"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: O SGBD reduz redundância, garante independência entre programas e dados, e usa a arquitetura de três níveis para separar o físico do lógico e do que o usuário enxerga."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 3 — Características de um Banco de Dados
    ───────────────────────────────────────── */
    {
      aula: "Aula 3 — Características de um Banco de Dados",
      ideia_central: "Um banco de dados possui estrutura (esquema), estado (dados atuais) e comportamento (mudanças de estado via transações), que devem obedecer às propriedades ACID.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "Principais tópicos:",
              itens: [
                "Diferença entre banco de dados e SGBD",
                "**Esquema** (estrutura) vs **Estado** (dados atuais)",
                "Conceito de **comportamento** e transação",
                "Propriedades **ACID**: Atomicidade · Consistência · Isolamento · Durabilidade",
                "Aplicação prática das propriedades em uma transação"
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
              titulo: "🔹 Esquema (Estrutura)",
              lista: [
                "Representa a **configuração lógica do banco**: tabelas · campos · tipos de dados · relacionamentos · restrições",
                "É definido na fase de projeto — **não muda com frequência**",
                "✔ Esquema = descrição do banco, não os dados em si"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Estado",
              lista: [
                "Conjunto de dados armazenados em um **determinado momento**",
                "Estado inicial = banco vazio; Estado corrente = dados presentes agora",
                "✔ Distinção: Esquema → estrutura fixa; Estado → conteúdo variável"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Comportamento",
              lista: [
                "Corresponde às **mudanças de estado ao longo do tempo**",
                "Ocorre por eventos do mini-mundo, operações executadas e interações dos usuários",
                "Mudança de estado = comportamento observado"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Transação",
              lista: [
                "Conjunto de operações que formam uma **unidade lógica de trabalho**",
                "Leva o banco de um estado consistente a outro estado consistente",
                "Deve ocorrer **totalmente ou não ocorrer** (tudo ou nada)"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Propriedades ACID"
            },

            {
              tipo: "topico",
              titulo: "⚛ Atomicidade",
              lista: [
                "**Tudo ou nada** — se falhar, todas as alterações são desfeitas; se concluir, todas são confirmadas",
                "Garantida por: log de transações e mecanismos de recuperação"
              ]
            },

            {
              tipo: "topico",
              titulo: "✅ Consistência",
              lista: [
                "Uma transação deve **manter as regras do banco** e preservar restrições",
                "Se o banco começa consistente, deve terminar consistente"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔒 Isolamento",
              lista: [
                "Transações simultâneas **não devem interferir entre si**",
                "O efeito deve parecer uma execução serial",
                "Garantido por: controle de concorrência e bloqueios"
              ]
            },

            {
              tipo: "topico",
              titulo: "💾 Durabilidade",
              lista: [
                "Após confirmação, as alterações **persistem mesmo com falhas**",
                "Garantida por: escrita em disco · logs · backup"
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
              titulo: "🔹 Operações de uma Transação",
              lista: [
                "**read(X)** → lê valor do disco para memória",
                "**write(X)** → grava valor da memória para o disco"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Modelo de Transação Bancária",
              lista: [
                "1. read(A) — lê saldo da conta A",
                "2. A := A - 50 — subtrai R$50",
                "3. write(A) — grava novo saldo de A",
                "4. read(B) — lê saldo da conta B",
                "5. B := B + 50 — adiciona R$50",
                "6. write(B) — grava novo saldo de B"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 ACID aplicado à transação bancária",
              lista: [
                "**Consistência** → A + B permanece constante antes e depois",
                "**Atomicidade** → se falhar antes do write(B), tudo deve ser desfeito",
                "**Durabilidade** → após commit, valores persistem",
                "**Isolamento** → outra transação não pode ler valores intermediários"
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
              titulo: "Exemplo 1 — Esquema vs Estado",
              texto: "Esquema: tabela ALUNO com campos (Matrícula, Nome, CPF). Estado: João (001, João, 123.456.789-00) e Maria (002, Maria, 987.654.321-00). O esquema nunca muda; o estado muda toda vez que alunos são inseridos ou removidos.",
              detalhe: ""
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Atomicidade na prática",
              texto: "Transferência de turma: remover aluno da Turma A + inserir na Turma B. Se a inserção falhar, a remoção também é desfeita. O aluno não pode ficar sem turma.",
              detalhe: "👉 Sem atomicidade, o aluno desapareceria do sistema"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Isolamento na prática",
              texto: "Dois caixas tentam sacar do mesmo saldo ao mesmo tempo. O isolamento garante que um espere o outro terminar, evitando que ambos leiam o saldo 'cheio' e saquem além do disponível.",
              detalhe: ""
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Durabilidade na prática",
              texto: "Após confirmar um pagamento (COMMIT), o sistema sofre queda de energia. Ao reiniciar, o pagamento ainda está registrado graças aos logs gravados em disco.",
              detalhe: "👉 Resultado: o dado persiste independentemente de falhas"
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
                "**Esquema** = estrutura fixa do banco (tabelas, tipos, restrições)",
                "**Estado** = conteúdo atual do banco (muda ao longo do tempo)",
                "**Comportamento** = mudanças de estado causadas por transações",
                "**Transação** = unidade lógica de trabalho (tudo ou nada)",
                "**A**tomicidade → tudo ou nada",
                "**C**onsistência → mantém regras válidas",
                "**I**solamento → sem interferência entre transações simultâneas",
                "**D**urabilidade → persiste após falhas"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: As propriedades ACID garantem que transações sejam confiáveis. Atomicidade e consistência protegem a integridade; isolamento evita conflitos; durabilidade garante que dados confirmados não sejam perdidos."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 4 — Arquiteturas de Banco de Dados
    ───────────────────────────────────────── */
    {
      aula: "Aula 4 — Arquiteturas de Banco de Dados",
      ideia_central: "A arquitetura de um banco de dados define como os componentes (interface, regras de negócio e dados) são distribuídos entre máquinas, evoluindo de centralizada para nuvem.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "Principais tópicos:",
              itens: [
                "Conceito e evolução das arquiteturas de banco de dados",
                "**Arquitetura Centralizada**: tudo em um host",
                "**Cliente-Servidor 2 camadas**: cliente + SGBD",
                "**Cliente-Servidor 3 camadas**: interface · lógica · dados",
                "**Sistemas Distribuídos**: replicação e fragmentação",
                "**Banco em Nuvem**: IaaS · PaaS · DBaaS"
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
              titulo: "🔹 Arquitetura Centralizada",
              lista: [
                "Todo o processamento em uma única máquina (host)",
                "✔ Vantagens: alto controle de segurança · backup centralizado · controle de concorrência eficiente",
                "✗ Desvantagens: alto custo · gargalo no host · baixa escalabilidade · indisponibilidade total se host falhar"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Arquitetura Cliente-Servidor — 2 Camadas",
              lista: [
                "**Cliente (front-end)**: interface + parte da aplicação",
                "**Servidor (back-end)**: SGBD, processamento de consultas, controle de transações",
                "Comunicação via ODBC (Open Database Connectivity) ou JDBC (Java Database Connectivity)",
                "✔ Vantagens: simplicidade · redução de tráfego · boa para apps locais",
                "✗ Desvantagens: escalabilidade limitada · forte dependência do servidor"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Arquitetura Cliente-Servidor — 3 Camadas",
              lista: [
                "**Camada Cliente** → interface gráfica",
                "**Camada de Aplicação** → regras de negócio, segurança, filtragem",
                "**Camada de Dados** → SGBD",
                "Fluxo: Cliente → Servidor de Aplicação → Servidor de Banco",
                "✔ Vantagens: melhor escalabilidade · maior segurança · ideal para aplicações Web"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Banco de Dados Distribuído",
              lista: [
                "Banco armazenado em **múltiplos nós geograficamente distribuídos**",
                "Não compartilham memória ou disco — comunicação via rede",
                "**Transparência**: usuário não sabe onde os dados estão ou se estão replicados"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Técnicas de Distribuição",
              lista: [
                "**Replicação** → cópias idênticas em diferentes nós, aumenta disponibilidade, exige sincronização",
                "**Fragmentação Horizontal** → divide por linhas (tuplas)",
                "**Fragmentação Vertical** → divide por atributos (colunas)",
                "**Fragmentação + Replicação** → combinação das duas técnicas"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Banco de Dados em Nuvem",
              lista: [
                "Banco executado em infraestrutura de terceiros (provedores de nuvem)",
                "**IaaS** → aluguel de máquinas virtuais, cliente gerencia o banco",
                "**PaaS** → infraestrutura + plataforma gerenciada",
                "**DBaaS** → banco como serviço, cliente paga por uso, provedor gerencia tudo"
              ]
            },

            {
              tipo: "tabela",
              titulo: "🔹 Comparativo das Arquiteturas",
              colunas: ["Arquitetura", "Controle", "Escalabilidade", "Custo", "Ideal para"],
              linhas: [
                ["Centralizada",   "Alto",   "Baixa",  "Alto",   "Mainframes, ambientes críticos"],
                ["2 Camadas",      "Médio",  "Média",  "Médio",  "Aplicações locais"],
                ["3 Camadas",      "Alto",   "Alta",   "Médio",  "Aplicações web modernas"],
                ["Distribuída",    "Complexo","Alta",  "Variado","Alta disponibilidade geográfica"],
                ["Nuvem (DBaaS)",  "Baixo",  "Alta",   "Por uso","Startups e escalabilidade rápida"]
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
              titulo: "🔹 Fluxo da Arquitetura de 3 Camadas",
              lista: [
                "1. Usuário interage com a **interface** (camada cliente)",
                "2. Requisição vai para o **servidor de aplicação** (regras de negócio)",
                "3. Servidor de aplicação consulta o **SGBD** (camada de dados)",
                "4. Resultado retorna pelo mesmo caminho inverso"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Como escolher a arquitetura certa",
              lista: [
                "**Centralizada** → controle total necessário, ambiente único",
                "**2 Camadas** → equipe pequena, sistema simples e local",
                "**3 Camadas** → aplicação web, muitos usuários, segurança importante",
                "**Distribuída** → dados espalhados geograficamente, alta disponibilidade",
                "**Nuvem** → escalabilidade sob demanda, custo variável, equipe remota"
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
              titulo: "Exemplo 1 — Arquitetura 2 camadas",
              texto: "Sistema de caixa de supermercado local: o computador do caixa (cliente) envia queries diretamente ao servidor do banco na mesma rede. Simples e eficiente para uma única loja.",
              detalhe: ""
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Arquitetura 3 camadas",
              texto: "Site de e-commerce: navegador do usuário (interface) → servidor Node.js com regras de negócio (aplicação) → banco PostgreSQL (dados). Cada camada pode escalar independentemente.",
              detalhe: "👉 Se o tráfego aumentar, adiciona-se mais servidores de aplicação sem mexer no banco"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Banco Distribuído",
              texto: "Rede de bancos com agências em SP, RJ e MG. Cada agência tem seu nó local. Dados dos clientes de SP ficam principalmente no nó de SP, mas estão replicados para garantir disponibilidade.",
              detalhe: ""
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — DBaaS na prática",
              texto: "Startup usa o Amazon RDS para hospedar seu banco MySQL. Não precisa comprar servidor, não faz backup manualmente. Paga apenas pelo que usa e pode aumentar capacidade com um clique.",
              detalhe: "👉 Desvantagem: dependência do provedor e questões de privacidade dos dados"
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
                "**Centralizada** → tudo em um host, alto controle, baixa escalabilidade",
                "**2 Camadas** → cliente + SGBD, ODBC/JDBC, boa para apps locais",
                "**3 Camadas** → interface · lógica · dados; ideal para web",
                "**Distribuída** → vários nós, transparência, replicação e fragmentação",
                "**Nuvem** → IaaS · PaaS · DBaaS; escalabilidade e custo por uso",
                "Transparência nos sistemas distribuídos: usuário não sabe onde os dados estão",
                "DBaaS: banco como serviço gerenciado pelo provedor"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: A arquitetura de 3 camadas separa interface, lógica e dados, permitindo escalabilidade e segurança para aplicações web. Sistemas distribuídos usam replicação e fragmentação para garantir disponibilidade geográfica."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 5 — Diagrama Entidade-Relacionamento (DER)
    ───────────────────────────────────────── */
    {
      aula: "Aula 5 — Diagrama Entidade-Relacionamento (DER)",
      ideia_central: "O MER, criado por Peter Chen, modela dados do mundo real usando entidades, atributos e relacionamentos, evoluindo do modelo conceitual para o lógico e físico.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "Principais tópicos:",
              itens: [
                "**MER** — Modelo Entidade-Relacionamento: origem e propósito",
                "Tipos de modelos: **conceitual · lógico · físico**",
                "Entidades e tipos de **atributos**",
                "Relacionamentos: binário · ternário · autorrelacionamento",
                "**Cardinalidade**: 1:1 · 1:N · N:N",
                "Figuras do DER: retângulo · elipse · losango e variações"
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
              titulo: "🔹 MER — Modelo Entidade-Relacionamento",
              lista: [
                "Criado por **Peter Chen (1976)** — modelo conceitual de alto nível",
                "Não trata detalhes de implementação — representa a **semântica dos dados**",
                "Composto por três elementos: **Entidades · Atributos · Relacionamentos**"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Modelos: Conceitual → Lógico → Físico",
              lista: [
                "**Conceitual** → abstrato, independente de SGBD, foco no negócio",
                "**Lógico** → derivado do conceitual, define estrutura, campos e tipos de dados",
                "**Físico** → implementação no SGBD: tabelas · índices · triggers · DDL"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Entidades e Atributos"
            },

            {
              tipo: "topico",
              titulo: "🔹 Entidade",
              lista: [
                "Objeto do mundo real com existência independente: física (Pessoa, Produto) ou conceitual (Venda)",
                "Representação no DER: **Retângulo**",
                "**Entidade Fraca** → depende de outra para existir (Retângulo Duplo)"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Tipos de Atributos",
              lista: [
                "**Simples** → não pode ser subdividido (ex: Nome, Sexo) — Elipse",
                "**Composto** → pode ser dividido (ex: Endereço → Rua, Número, CEP)",
                "**Multivalorado** → vários valores (ex: Telefones) — Elipse Dupla",
                "**Derivado** → calculado a partir de outro (ex: Idade ← Data de Nascimento) — Elipse Pontilhada",
                "**Identificador (Chave)** → identifica unicamente a entidade — Elipse Sublinhada"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Relacionamentos"
            },

            {
              tipo: "topico",
              titulo: "🔹 Tipos de Relacionamento",
              lista: [
                "**Binário** → entre duas entidades (ex: Funcionário — Trabalha no — Setor)",
                "**Ternário** → entre três entidades simultaneamente",
                "**Autorrelacionamento** → entidade se relaciona com ela mesma (ex: Funcionário Chefe ↔ Subordinado)",
                "Representação: **Losango** (normal) ou **Losango Duplo** (relacionamento identificador de entidade fraca)"
              ]
            },

            {
              tipo: "tabela",
              titulo: "🔹 Figuras do DER e seus Significados",
              colunas: ["Figura", "Representa"],
              linhas: [
                ["Retângulo",          "Entidade"],
                ["Retângulo Duplo",    "Entidade Fraca"],
                ["Elipse",             "Atributo"],
                ["Elipse Sublinhada",  "Atributo Identificador (Chave Primária)"],
                ["Elipse Dupla",       "Atributo Multivalorado"],
                ["Elipse Pontilhada",  "Atributo Derivado"],
                ["Losango",            "Relacionamento"],
                ["Losango Duplo",      "Relacionamento Identificador (Entidade Fraca)"],
                ["Linha",              "Participação (conexão)"],
                ["1, N, 0",            "Cardinalidade"]
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Cardinalidade"
            },

            {
              tipo: "topico",
              titulo: "🔹 Tipos de Cardinalidade",
              lista: [
                "**1:1** → Um-para-Um: cada ocorrência de A se relaciona com no máximo uma de B",
                "**1:N** → Um-para-Muitos: uma ocorrência de A se relaciona com várias de B",
                "**N:N** → Muitos-para-Muitos: várias ocorrências de A se relacionam com várias de B",
                "**0:N** → Participação opcional: pode haver zero ocorrências"
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
              titulo: "🔹 Processo de Modelagem",
              lista: [
                "1. Levantar requisitos com usuários do negócio",
                "2. Identificar entidades (objetos do mundo real)",
                "3. Definir atributos de cada entidade",
                "4. Identificar o atributo-chave de cada entidade",
                "5. Mapear relacionamentos entre entidades (verbos)",
                "6. Definir cardinalidades",
                "7. Criar o modelo conceitual (DER)",
                "8. Derivar o modelo lógico (tabelas)",
                "9. Implementar o modelo físico (DDL no SGBD)"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Benefícios de uma boa modelagem",
              lista: [
                "Redução de redundâncias · evita inconsistências",
                "Facilita manutenção · melhora desempenho e organização"
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
              titulo: "Exemplo 1 — Entidade e Atributos",
              texto: "Entidade ALUNO com atributos: Matrícula (identificador, sublinhado), Nome (simples), Endereço (composto: Rua + CEP), Telefones (multivalorado), Idade (derivado de Data de Nascimento).",
              detalhe: ""
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Cardinalidade 1:N",
              texto: "Um PROFESSOR leciona várias DISCIPLINAS. Mas cada DISCIPLINA é lecionada por apenas um professor. Cardinalidade: PROFESSOR 1 ←→ N DISCIPLINA.",
              detalhe: "👉 A FK (cod_professor) fica na tabela DISCIPLINA"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Cardinalidade N:N",
              texto: "Um ALUNO se matricula em várias DISCIPLINAS. Uma DISCIPLINA tem vários ALUNOS. Isso cria uma tabela intermediária: MATRÍCULA (CodAluno, CodDisciplina).",
              detalhe: ""
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Entidade Fraca",
              texto: "ITEM_PEDIDO depende de PEDIDO para existir. Sem o pedido, o item não faz sentido. Representado por Retângulo Duplo e Losango Duplo.",
              detalhe: "👉 A chave de ITEM_PEDIDO inclui a chave de PEDIDO"
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
                "**MER** = criado por Peter Chen (1976), modelo conceitual com entidades, atributos e relacionamentos",
                "**Retângulo** → Entidade; **Elipse** → Atributo; **Losango** → Relacionamento",
                "Atributos: simples · composto · multivalorado (elipse dupla) · derivado (pontilhado) · chave (sublinhado)",
                "**Cardinalidade**: 1:1 · 1:N · N:N · 0:N",
                "Modelagem: Conceitual → Lógico → Físico",
                "N:N gera sempre uma **tabela intermediária** no modelo lógico",
                "Entidade Fraca = depende de outra entidade (retângulo duplo)"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: O DER é a representação gráfica do MER. Cada figura tem um significado específico. A cardinalidade define como as entidades se relacionam e determina como as tabelas serão criadas no banco físico."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 6 — Modelo Relacional (MER → Relacional)
    ───────────────────────────────────────── */
    {
      aula: "Aula 6 — Modelo Relacional de Banco de Dados",
      ideia_central: "O Modelo Relacional organiza dados em tabelas com restrições de chave e integridade referencial. A conversão do MER para o Relacional é etapa fundamental no desenvolvimento de banco de dados.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "Principais tópicos:",
              itens: [
                "Estrutura do modelo relacional: **relação · tupla · atributo · domínio**",
                "Restrições: **chave candidata · chave primária · superchave**",
                "**Integridade de entidade** e **integridade referencial**",
                "**Chave Estrangeira (FK)** e consistência entre tabelas",
                "Conversão do **MER para o Modelo Relacional**",
                "Mapeamento de entidades e relacionamentos"
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
              titulo: "🔹 Estrutura Fundamental",
              lista: [
                "**Relação (Tabela)** → conjunto de dados em linhas e colunas",
                "**Tupla (Linha)** → representa um registro completo",
                "**Atributo (Coluna)** → característica da entidade",
                "**Domínio** → conjunto de valores possíveis de um atributo (tipo + formato + regras)"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Esquema de Relação",
              lista: [
                "Representação estrutural: `Aluno (CodAluno, Nome, RG, CPF, Telefone, Endereço)`",
                "**Grau da relação** = número de atributos (ex: 6 colunas → grau 6)"
              ],
              codigo: "Aluno (CodAluno, Nome, RG, CPF, Telefone, Endereço)"
            },

            {
              tipo: "subtitulo",
              texto: "Restrições do Modelo Relacional"
            },

            {
              tipo: "topico",
              titulo: "🔹 Restrição de Chave",
              lista: [
                "**Chave Candidata** → conjunto mínimo de atributos que identifica uma tupla",
                "**Chave Primária (PK)** → principal identificador, não pode repetir, não pode ser NULL",
                "**Superchave** → conjunto maior que ainda identifica unicamente (ex: CodAluno + CPF)"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Restrição de Entidade",
              lista: [
                "**Chave primária NUNCA pode ser NULL**",
                "Garantia: toda linha é identificável de forma única"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Integridade Referencial — Chave Estrangeira (FK)",
              lista: [
                "Liga tabelas diferentes, referenciando a PK de outra tabela",
                "**Pode ser NULL** · deve existir na tabela referenciada",
                "Não pode matricular aluno inexistente · não pode excluir aluno em uso sem tratamento"
              ],
              codigo: "Matrícula → CodAluno (referência à tabela Aluno)"
            },

            {
              tipo: "subtitulo",
              texto: "Conversão MER → Modelo Relacional"
            },

            {
              tipo: "topico",
              titulo: "🔹 Mapeamento de Entidades",
              lista: [
                "Cada entidade vira uma **tabela**",
                "Atributos → colunas; Chave primária → mantida"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Mapeamento de Relacionamentos N:N",
              lista: [
                "Criar uma **nova tabela** com as chaves estrangeiras das entidades participantes",
                "Pode incluir atributos próprios do relacionamento",
                "**Chave primária composta** (ex: Matrícula com CodAluno + CodTurma)"
              ],
              codigo: "Matrícula (CodAluno, CodTurma)\n-- Chave primária composta"
            },

            {
              tipo: "topico",
              titulo: "🔹 Mapeamento de Relacionamentos 1:N",
              lista: [
                "**Opção 1** → criar tabela separada (igual ao N:N)",
                "**Opção 2 (mais eficiente)** → inserir FK na tabela do lado N",
                "Vantagem: melhor desempenho · Desvantagem: pode gerar campos NULL"
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
              titulo: "🔹 Regras de Conversão MER → Relacional",
              lista: [
                "1. Cada **entidade forte** → uma tabela",
                "2. Cada **entidade fraca** → tabela com FK da entidade forte",
                "3. Relacionamento **1:1** → FK em qualquer um dos lados",
                "4. Relacionamento **1:N** → FK no lado N",
                "5. Relacionamento **N:N** → nova tabela com FK de ambas as entidades",
                "6. Atributos compostos → expandir em múltiplas colunas",
                "7. Atributos multivalorados → nova tabela separada"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Conceitos Essenciais Resumidos",
              lista: [
                "**Relação** = tabela · **Tupla** = linha · **Atributo** = coluna · **Domínio** = tipo + regras",
                "**PK** = identificação única (não nula) · **FK** = ligação entre tabelas",
                "**Integridade referencial** = consistência entre relações"
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
              titulo: "Exemplo 1 — Domínio de atributo",
              texto: "Atributo Idade: domínio = inteiros de 15 a 80. Atributo CPF: domínio = formato '000.000.000-00'. O SGBD rejeita qualquer valor fora do domínio.",
              detalhe: ""
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Integridade referencial",
              texto: "Tabela MATRÍCULA tem FK CodAluno. Se tentar inserir uma matrícula com CodAluno = 999 e esse aluno não existir na tabela ALUNO, o SGBD rejeita a operação.",
              detalhe: "👉 Isso é integridade referencial em ação"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Chave Primária Composta",
              texto: "Tabela MATRÍCULA: (CodAluno + CodTurma) formam a PK composta. Um aluno não pode se matricular duas vezes na mesma turma, mas pode estar em turmas diferentes.",
              detalhe: ""
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Conversão 1:N",
              texto: "Entidade DEPARTAMENTO (1) e FUNCIONARIO (N). Na conversão, a FK CodDepartamento vai para a tabela FUNCIONARIO — cada funcionário sabe a qual departamento pertence.",
              detalhe: "👉 Não precisa de tabela intermediária em relacionamentos 1:N"
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
                "**Relação** = tabela; **Tupla** = linha; **Atributo** = coluna; **Domínio** = tipo + regras",
                "**PK** → não pode repetir, não pode ser NULL",
                "**FK** → pode ser NULL, deve referenciar PK existente",
                "**Integridade de entidade** → PK nunca é NULL",
                "**Integridade referencial** → FK aponta para valores existentes",
                "Conversão N:N → sempre cria tabela intermediária com FK compostas",
                "Conversão 1:N → FK vai para o lado N (mais eficiente)",
                "**Grau** da relação = número de colunas da tabela"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: O modelo relacional organiza dados em tabelas e usa PK + FK para garantir integridade. A conversão do MER define como relacionamentos viram tabelas ou chaves estrangeiras, dependendo da cardinalidade."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 7 — Diagrama EER (Modelo Estendido)
    ───────────────────────────────────────── */
    {
      aula: "Aula 7 — Diagrama Entidade-Relacionamento Estendido (EER)",
      ideia_central: "O EER é uma extensão do MER que adiciona herança, superclasses, subclasses, agregação e generalização/especialização para modelar sistemas mais complexos.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "Principais tópicos:",
              itens: [
                "**EER** como extensão do MER tradicional",
                "**Associação**: binária · unária (recursiva)",
                "**Agregação**: relacionamento tratado como entidade",
                "**Generalização** e **Especialização**: hierarquia entre entidades",
                "**Herança** de atributos entre superclasse e subclasses",
                "Representação gráfica no Diagrama EER (DEER)"
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
              titulo: "🔹 Por que o EER existe",
              lista: [
                "O MER funciona bem para casos simples, mas tem limitações para representar hierarquias e herança",
                "O EER adiciona novos recursos semânticos: **herança de atributos · superclasses · subclasses**"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Associação",
              lista: [
                "Representa um **vínculo entre entidades/classes**",
                "**Binária** → entre duas entidades (ex: Aluno — Curso)",
                "**Unária (Recursiva)** → entidade se relaciona com ela mesma (ex: Funcionário supervisiona Funcionário)",
                "Pode ser n-ária (envolver mais de duas entidades)"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Agregação",
              lista: [
                "Permite tratar um **relacionamento como uma entidade** independente",
                "Usado quando um relacionamento tem atributos próprios ou precisa se relacionar com outros elementos",
                "Ex: Matrícula (Aluno ↔ Curso) tem relação com Professor — a Matrícula vira entidade intermediária"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Generalização e Especialização"
            },

            {
              tipo: "topico",
              titulo: "🔹 Superclasse e Subclasse",
              lista: [
                "**Superclasse** → entidade mais genérica (ex: Funcionário)",
                "**Subclasse** → entidade mais específica, **herda atributos da superclasse** (ex: Professor, Técnico, Secretária)",
                "Subclasses podem ter atributos próprios adicionais"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Especialização",
              lista: [
                "Processo de **criar subclasses a partir de uma superclasse** (top-down)",
                "Ex: Funcionário → Professor, Técnico, Secretária"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Generalização",
              lista: [
                "Processo **inverso**: unir entidades específicas em uma mais geral (bottom-up)",
                "Ex: Professor + Técnico → Funcionário"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Herança",
              lista: [
                "Subclasses **herdam** todos os atributos e relacionamentos da superclasse",
                "Podem também ter seus próprios atributos exclusivos",
                "Permite reaproveitamento de dados e redução de redundância"
              ]
            },

            {
              tipo: "tabela",
              titulo: "🔹 Comparativo MER vs EER",
              colunas: ["Aspecto", "MER", "EER"],
              linhas: [
                ["Hierarquia",    "Não suporta",  "Superclasse / Subclasse"],
                ["Herança",       "Não suporta",  "Subclasses herdam atributos"],
                ["Agregação",     "Não suporta",  "Relacionamento como entidade"],
                ["Complexidade",  "Casos simples","Sistemas complexos"],
                ["Precisão",      "Básica",       "Alta precisão semântica"]
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
              titulo: "🔹 Quando usar cada conceito EER",
              lista: [
                "**Especialização** → quando subgrupos da entidade têm atributos distintos",
                "**Generalização** → quando entidades distintas compartilham muitos atributos",
                "**Agregação** → quando um relacionamento precisa participar de outro relacionamento",
                "**Associação Recursiva** → quando uma entidade se relaciona com instâncias de si mesma"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Hierarquia de Especialização",
              lista: [
                "Superclasse → nível mais alto (mais genérico)",
                "Subclasses → nível abaixo (mais específico, com herança)",
                "Pode ter múltiplos níveis de hierarquia"
              ],
              codigo: "Funcionário\n  ├── Professor\n  ├── Técnico\n  └── Secretária"
            }
          ]
        },

        {
          id: "exemplos",
          titulo: "💡 Exemplos Explicativos",
          blocos: [
            {
              tipo: "exemplo",
              titulo: "Exemplo 1 — Especialização",
              texto: "Entidade PESSOA com atributos (CPF, Nome, Endereço). Especializações: CLIENTE (possui CódigoCliente) e FUNCIONÁRIO (possui Matrícula, Salário). Ambos herdam CPF, Nome e Endereço.",
              detalhe: "👉 Evita duplicar CPF e Nome em duas tabelas separadas"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Generalização",
              texto: "Percebe-se que MÉDICO e ENFERMEIRO têm Nome, CRM/CRE e Especialidade. Generaliza-se criando PROFISSIONAL DE SAÚDE como superclasse com Nome e Especialidade.",
              detalhe: ""
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Agregação",
              texto: "PROFESSOR leciona DISCIPLINA para um ALUNO. O relacionamento 'leciona' entre Professor e Disciplina precisa se relacionar com Aluno. A matrícula vira uma entidade agregada.",
              detalhe: "👉 A agregação torna o relacionamento 'visível' como objeto no diagrama"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Associação Recursiva",
              texto: "Entidade FUNCIONÁRIO com autorrelacionamento 'supervisiona'. Um gerente (papel: supervisor) supervisiona vários funcionários (papel: subordinado) — mesma entidade, papéis distintos.",
              detalhe: ""
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
                "**EER** = extensão do MER para modelagens mais complexas",
                "**Associação** = ligação entre entidades (binária, unária, n-ária)",
                "**Agregação** = relacionamento tratado como entidade independente",
                "**Especialização** = criar subclasses a partir de superclasse (top-down)",
                "**Generalização** = unir entidades em uma mais genérica (bottom-up)",
                "**Herança** = subclasses recebem todos os atributos da superclasse",
                "MER resolve o básico; EER resolve o complexo — mais fidelidade ao mundo real"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: O EER introduz hierarquia com superclasses e subclasses. Especialização é top-down (genérico → específico); generalização é bottom-up (específico → genérico). Herança evita redundância nos atributos compartilhados."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 8 — Introdução ao SQL
    ───────────────────────────────────────── */
    {
      aula: "Aula 8 — Introdução ao SQL",
      ideia_central: "SQL é a linguagem declarativa padrão para bancos relacionais, dividida em subconjuntos (DDL, DML, DQL, DCL, DTL) que cobrem desde a criação de estruturas até o controle de transações.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "Principais tópicos:",
              itens: [
                "Definição e origem do **SQL**",
                "Subconjuntos: **DDL · DML · DQL · DCL · DTL**",
                "Diferença entre **DDL** (estrutura) e **DML** (dados)",
                "Tipos de dados: CHAR · VARCHAR · INT · FLOAT · DATE · BLOB",
                "Estrutura do banco: tabelas · chave primária · relacionamentos",
                "Processo de construção de um banco com SQL"
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
              titulo: "🔹 SQL — Definição",
              lista: [
                "**Structured Query Language** — linguagem padrão para bancos relacionais (ANSI e ISO)",
                "**Linguagem declarativa** → você informa *o que quer*, não *como fazer*",
                "Criada na IBM (anos 70) — Projeto System R; evolução: SQL-86 · SQL-92 · SQL-99"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Subconjuntos da Linguagem SQL"
            },

            {
              tipo: "topico",
              titulo: "📌 DDL — Data Definition Language",
              lista: [
                "**Função**: definir estrutura do banco",
                "Comandos: **CREATE · ALTER · DROP**",
                "⚠ Alterações são **automáticas e permanentes** (sem ROLLBACK)"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 DML — Data Manipulation Language",
              lista: [
                "**Função**: manipular dados dentro das estruturas",
                "Comandos: **INSERT · UPDATE · DELETE**",
                "✔ Não são automáticos → **podem ser desfeitos** com ROLLBACK"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 DQL — Data Query Language",
              lista: [
                "**Função**: consultar dados",
                "Comando: **SELECT**"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 DCL — Data Control Language",
              lista: [
                "**Função**: controle de acesso e permissões",
                "Comandos: **GRANT** (concede) · **REVOKE** (revoga)"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 DTL — Data Transaction Language",
              lista: [
                "**Função**: controle de transações",
                "Comandos: **COMMIT** (confirma) · **ROLLBACK** (desfaz)"
              ]
            },

            {
              tipo: "tabela",
              titulo: "🔹 DDL vs DML",
              colunas: ["Aspecto", "DDL", "DML"],
              linhas: [
                ["Função",       "Criar estrutura",    "Manipular dados"],
                ["Tipo de ação", "Estrutural",         "Operacional"],
                ["Confirmação",  "Automática",         "Manual (COMMIT)"],
                ["Reversível?",  "Não",                "Sim (ROLLBACK)"],
                ["Exemplo",      "CREATE TABLE",       "INSERT"]
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Estrutura e Tipos de Dados"
            },

            {
              tipo: "tabela",
              titulo: "🔹 Tipos de Dados Principais",
              colunas: ["Tipo", "Descrição"],
              linhas: [
                ["CHAR(n)",    "Texto de tamanho fixo"],
                ["VARCHAR(n)", "Texto de tamanho variável"],
                ["TEXT",       "Texto longo"],
                ["INT / INTEGER", "Número inteiro"],
                ["FLOAT / DOUBLE", "Número decimal"],
                ["DATE",       "Data"],
                ["TIME",       "Hora"],
                ["BLOB",       "Dados binários (imagem, áudio)"]
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Chave Primária (PK) em SQL",
              lista: [
                "Identificador único de cada registro",
                "Deve ser: **única · não nula · imutável**",
                "Pode ser gerada automaticamente com **AUTO INCREMENT**"
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
              titulo: "🔹 Processo de construção do banco com SQL",
              lista: [
                "1. Modelagem (DER / MER)",
                "2. Criação da estrutura com **DDL** (CREATE DATABASE, CREATE TABLE)",
                "3. Inserção de dados com **DML** (INSERT INTO)",
                "4. Consultas com **DQL** (SELECT)",
                "5. Controle de acesso com **DCL** (GRANT / REVOKE)",
                "6. Confirmação de transações com **DTL** (COMMIT / ROLLBACK)"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Componentes de um Banco de Dados em funcionamento",
              lista: [
                "Tabelas (estrutura de dados)",
                "Catálogo do sistema (metadados)",
                "Arquivos de configuração",
                "Logs de transações"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Operações CRUD com SQL",
              lista: [
                "**INSERT** → Create (inserir registro)",
                "**SELECT** → Read (consultar dados)",
                "**UPDATE** → Update (atualizar dados)",
                "**DELETE** → Delete (excluir registro)"
              ],
              codigo: "INSERT INTO Clientes (Nome, CPF) VALUES ('Ana', '111.111.111-11');\nSELECT * FROM Clientes;\nUPDATE Clientes SET Nome = 'Ana Lima' WHERE IdCliente = 1;\nDELETE FROM Clientes WHERE IdCliente = 1;"
            }
          ]
        },

        {
          id: "exemplos",
          titulo: "💡 Exemplos Explicativos",
          blocos: [
            {
              tipo: "exemplo",
              titulo: "Exemplo 1 — DDL na prática",
              texto: "CREATE TABLE Aluno (Id INT PRIMARY KEY AUTO_INCREMENT, Nome VARCHAR(100) NOT NULL, CPF CHAR(14) UNIQUE). Isso cria a estrutura — ainda sem nenhum dado.",
              detalhe: "👉 DDL define o molde; DML preenche com dados"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — DML na prática",
              texto: "INSERT INTO Aluno (Nome, CPF) VALUES ('João', '123.456.789-00'). UPDATE Aluno SET Nome = 'João Silva' WHERE Id = 1. Ambos são DML — manipulam dados, não estrutura.",
              detalhe: ""
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — SQL declarativo",
              texto: "O comando SELECT * FROM Aluno WHERE Cidade = 'SP' diz o que você quer (alunos de SP), mas não como o banco deve buscá-los. O SGBD decide o algoritmo de busca mais eficiente.",
              detalhe: "👉 Isso é o que torna SQL uma linguagem declarativa"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — GRANT e REVOKE",
              texto: "GRANT SELECT ON Aluno TO 'professor'. O professor pode consultar a tabela, mas não inserir nem deletar. REVOKE retira essa permissão quando necessário.",
              detalhe: "👉 DCL controla quem pode fazer o quê no banco"
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
                "**SQL** = linguagem declarativa padrão para bancos relacionais (IBM, anos 70)",
                "**DDL** → CREATE · ALTER · DROP (estrutura, permanente e automático)",
                "**DML** → INSERT · UPDATE · DELETE (dados, reversível com ROLLBACK)",
                "**DQL** → SELECT (consulta)",
                "**DCL** → GRANT · REVOKE (permissões de acesso)",
                "**DTL** → COMMIT · ROLLBACK (controle de transações)",
                "DDL constrói o banco; DML trabalha com os dados dentro dele",
                "PK = único e não nulo; pode usar AUTO INCREMENT",
                "SQL não mostra o caminho — o SGBD decide como executar (otimização)"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: SQL divide-se em 5 subconjuntos. DDL e DML são os mais cobrados: DDL cria e altera estruturas (permanente), DML insere e modifica dados (reversível). Saber qual comando pertence a qual subconjunto é essencial."
            }
          ]
        }

      ]
    }

  ]
  
};