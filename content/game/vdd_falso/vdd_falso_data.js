/* ============================================================
   NEXUS STUDY — content/game/vdd_falso/vdd_falso_data.js

   Banco de perguntas de Verdadeiro ou Falso por disciplina.
   Estrutura:
     {
       [discId]: [
         { enunciado: string, resposta: true|false, explicacao: string }
       ]
     }
   ============================================================ */

export const VDD_FALSO_DATA = {

  /* ── Design — Aula 9: Prototipagem e Norma ISO 9241 / Aula 10: Design de Interfaces e Prototipação ── */
  design: [

    // Questão 1 — Modelo Cascata
    {
      enunciado: "O Modelo Cascata é um modelo de desenvolvimento sequencial, onde cada etapa só começa após a anterior ser concluída.",
      resposta: true,
      explicacao: "O Cascata segue um fluxo linear: Requisitos → Projeto → Implementação → Testes → Manutenção."
    },
    // Questão 2 — Modelo Espiral
    {
      enunciado: "O Modelo Espiral não utiliza protótipos em seu processo de desenvolvimento.",
      resposta: false,
      explicacao: "O Modelo Espiral destaca justamente o uso de protótipos e análise de riscos em cada ciclo."
    },
    // Questão 3 — Modelo Estrela
    {
      enunciado: "No Modelo Estrela, o desenvolvimento sempre deve começar pela etapa de requisitos.",
      resposta: false,
      explicacao: "O Modelo Estrela tem a avaliação no centro e pode começar em qualquer etapa."
    },
    // Questão 4 — Modelo de Shneiderman
    {
      enunciado: "O Modelo de Shneiderman é baseado em três pilares: especificação, prototipagem e testes de usabilidade.",
      resposta: true,
      explicacao: "Esses três pilares definem o modelo de Shneiderman, focado na análise de interface, funcionalidade e facilidade de uso."
    },
    // Questão 5 — Manifesto Ágil
    {
      enunciado: "O Manifesto Ágil prioriza documentação extensa em vez de software funcionando.",
      resposta: false,
      explicacao: "O Ágil valoriza software funcional acima de documentação abrangente."
    },
    // Questão 6 — Design Thinking princípios
    {
      enunciado: "O Design Thinking possui cinco princípios: centrado no usuário, cocriativo, sequencial, evidente e holístico.",
      resposta: true,
      explicacao: "Esses são os cinco princípios que fundamentam a abordagem do Design Thinking."
    },
    // Questão 7 — ISO 9241 definição
    {
      enunciado: "A norma ISO 9241 trata exclusivamente de segurança da informação em sistemas digitais.",
      resposta: false,
      explicacao: "A ISO 9241 trata de usabilidade e ergonomia em sistemas interativos, não de segurança da informação."
    },
    // Questão 8 — Eficácia vs Eficiência
    {
      enunciado: "Segundo a ISO 9241, eficiência refere-se à capacidade do usuário de atingir seus objetivos.",
      resposta: false,
      explicacao: "Eficácia é atingir objetivos. Eficiência é atingi-los com menor esforço. São conceitos distintos."
    },
    // Questão 9 — Princípios de Diálogo ISO 9241
    {
      enunciado: "A ISO 9241 (Parte 10) define sete princípios de diálogo, entre eles tolerância a erros e individualização.",
      resposta: true,
      explicacao: "Os sete princípios são: adequação à tarefa, autodescrição, controle, conformidade, tolerância a erros, individualização e aprendizado."
    },
    // Questão 10 — Modelos centrados no usuário
    {
      enunciado: "Os modelos Cascata e Espiral são classificados como modelos centrados no usuário.",
      resposta: false,
      explicacao: "Cascata e Espiral são modelos centrados no produto. Os centrados no usuário são o Modelo Estrela, Shneiderman e Design Thinking."
    },

    // Questão 11 — DCU
    {
      enunciado: "O Design Centrado no Usuário (DCU) coloca o sistema e suas funcionalidades técnicas como foco principal do desenvolvimento.",
      resposta: false,
      explicacao: "O DCU coloca o usuário como foco principal, priorizando usabilidade, ergonomia e intuitividade."
    },
    // Questão 12 — Modelos Conceituais
    {
      enunciado: "Modelos conceituais representam como o sistema funciona na teoria, utilizando metáforas do mundo real.",
      resposta: true,
      explicacao: "Modelos conceituais usam ideias e associações, incluindo metáforas, para facilitar o entendimento do sistema pelo usuário."
    },
    // Questão 13 — Tipos de Interação
    {
      enunciado: "A interação por conversação engloba comandos de clique e teclado.",
      resposta: false,
      explicacao: "Comandos de clique e teclado são do tipo instrução. Conversação refere-se à interação com IA, chat e voz."
    },
    // Questão 14 — Problemas de Usabilidade
    {
      enunciado: "Uma barreira de usabilidade impede completamente o usuário de concluir uma tarefa.",
      resposta: true,
      explicacao: "Barreiras impedem a tarefa. Obstáculos dificultam mas permitem concluir. Ruídos causam dúvida ou confusão."
    },
    // Questão 15 — Ruído
    {
      enunciado: "Ruídos de usabilidade são problemas que impedem completamente a execução de uma tarefa.",
      resposta: false,
      explicacao: "Ruídos causam dúvida ou confusão, mas não impedem a tarefa. Quem impede são as barreiras."
    },
    // Questão 16 — Prototipação
    {
      enunciado: "A prototipação tem como objetivo representar o sistema antes da implementação para testar ideias e reduzir custos.",
      resposta: true,
      explicacao: "Protótipos servem para testar ideias, identificar problemas e economizar tempo e custo antes do desenvolvimento final."
    },
    // Questão 17 — Fidelidade
    {
      enunciado: "Protótipos de baixa fidelidade são mais indicados para focar em detalhes visuais do produto final.",
      resposta: false,
      explicacao: "Baixa fidelidade gera mais ideias e é simples. Alta fidelidade é que foca em detalhes, sendo próxima do produto final."
    },
    // Questão 18 — Estrutura horizontal x vertical
    {
      enunciado: "Um protótipo vertical cobre muitas funções com pouco nível de detalhe em cada uma.",
      resposta: false,
      explicacao: "Protótipo vertical abrange menos funções, mas com muito detalhamento. O horizontal é que cobre muitas funções com pouco detalhe."
    },
    // Questão 19 — Wireframe
    {
      enunciado: "O wireframe é uma representação estrutural da interface, sem cores ou imagens, focada na organização do layout.",
      resposta: true,
      explicacao: "O wireframe funciona como o 'esqueleto' do sistema, mostrando botões, menus e layout sem elementos visuais finais."
    },
    // Questão 20 — Mockup
    {
      enunciado: "Um mockup e um wireframe são equivalentes, pois ambos representam a interface em baixa fidelidade.",
      resposta: false,
      explicacao: "Wireframe é baixa fidelidade (estrutura). Mockup é alta fidelidade, com cores, imagens e tipografia, simulando o produto final."
    },
  ],

  /* ── Banco de Dados — Aula 9: Definindo um Banco de Dados / Aula 10: Manipulando um Banco de Dados ── */
  banco_dados: [

    // Questão 1 — DDL definição
    {
      enunciado: "DDL (Data Definition Language) é o subconjunto da SQL responsável por criar, alterar e remover estruturas de um banco de dados.",
      resposta: true,
      explicacao: "A DDL engloba os comandos CREATE, ALTER e DROP, usados para definir e modificar estruturas como tabelas e bancos de dados."
    },
    // Questão 2 — Comando SELECT
    {
      enunciado: "O comando CREATE é utilizado para inserir novos registros dentro de uma tabela existente.",
      resposta: false,
      explicacao: "CREATE é usado para criar estruturas (bancos, tabelas, views). Para inserir registros usa-se INSERT."
    },
    // Questão 3 — DROP TABLE
    {
      enunciado: "O comando DROP TABLE remove apenas os dados da tabela, mantendo sua estrutura para uso futuro.",
      resposta: false,
      explicacao: "DROP TABLE remove permanentemente a estrutura e os dados. Para apagar só os dados, usa-se DELETE ou TRUNCATE."
    },
    // Questão 4 — Chave Primária
    {
      enunciado: "Uma chave primária pode conter valores nulos, desde que sejam únicos na tabela.",
      resposta: false,
      explicacao: "A chave primária não aceita valores nulos (NULL) e deve ser única para cada registro."
    },
    // Questão 5 — Chave Estrangeira
    {
      enunciado: "A chave estrangeira cria um relacionamento entre tabelas, exigindo que seu valor exista na tabela referenciada.",
      resposta: true,
      explicacao: "A FOREIGN KEY referencia a chave primária de outra tabela, garantindo integridade referencial."
    },
    // Questão 6 — ALTER TABLE
    {
      enunciado: "O comando ALTER TABLE permite adicionar novas colunas a uma tabela já existente.",
      resposta: true,
      explicacao: "ALTER TABLE é usado para modificar estruturas existentes, incluindo adicionar ou alterar colunas e restrições."
    },
    // Questão 7 — CASCADE vs RESTRICT
    {
      enunciado: "A opção RESTRICT impede a exclusão de um registro se existirem dependências vinculadas a ele.",
      resposta: true,
      explicacao: "RESTRICT bloqueia a operação caso existam dependências. CASCADE, ao contrário, remove as dependências automaticamente."
    },
    // Questão 8 — Esquema e Catálogo
    {
      enunciado: "O catálogo de um banco de dados é composto por um único esquema fixo.",
      resposta: false,
      explicacao: "O catálogo é um conjunto de esquemas e contém metadados sobre as estruturas do banco, incluindo o INFORMATION_SCHEMA."
    },
    // Questão 9 — Tipos de dados
    {
      enunciado: "O tipo de dado VARCHAR armazena texto com tamanho fixo, independentemente do conteúdo inserido.",
      resposta: false,
      explicacao: "VARCHAR armazena texto de tamanho variável. CHAR é que possui tamanho fixo."
    },
    // Questão 10 — Novas colunas
    {
      enunciado: "Ao adicionar uma nova coluna com ALTER TABLE, os registros existentes recebem NULL nessa coluna por padrão.",
      resposta: true,
      explicacao: "Como os registros já existentes não possuem valor para a nova coluna, eles recebem NULL por padrão."
    },

    // Questão 11 — DML definição
    {
      enunciado: "DML (Data Manipulation Language) é responsável por manipular os dados armazenados, por meio dos comandos SELECT, INSERT, UPDATE e DELETE.",
      resposta: true,
      explicacao: "A DML é o subconjunto da SQL voltado para buscar, inserir, atualizar e excluir dados nas tabelas."
    },
    // Questão 12 — DELETE sem WHERE
    {
      enunciado: "Executar DELETE FROM tabela sem a cláusula WHERE remove apenas o primeiro registro da tabela.",
      resposta: false,
      explicacao: "Sem WHERE, o DELETE apaga todos os registros da tabela, não apenas o primeiro."
    },
    // Questão 13 — SELECT DISTINCT
    {
      enunciado: "A palavra-chave DISTINCT no SELECT é usada para eliminar valores duplicados no resultado da consulta.",
      resposta: true,
      explicacao: "SELECT DISTINCT retorna apenas valores únicos, removendo as duplicatas do resultado."
    },
    // Questão 14 — UPDATE sem WHERE
    {
      enunciado: "O comando UPDATE sem a cláusula WHERE atualiza apenas o registro mais recente da tabela.",
      resposta: false,
      explicacao: "Sem WHERE, o UPDATE altera todos os registros da tabela, não apenas um."
    },
    // Questão 15 — Estrutura SELECT
    {
      enunciado: "Na estrutura básica de uma consulta SQL, a cláusula WHERE é obrigatória para que o SELECT funcione.",
      resposta: false,
      explicacao: "WHERE é opcional. A estrutura mínima válida é SELECT coluna FROM tabela."
    },
    // Questão 16 — Operadores lógicos
    {
      enunciado: "O operador lógico AND retorna resultados apenas quando todas as condições da consulta são verdadeiras.",
      resposta: true,
      explicacao: "AND exige que todas as condições sejam satisfeitas. OR basta que uma seja verdadeira."
    },
    // Questão 17 — Operador de comparação
    {
      enunciado: "Em SQL, o operador <> é utilizado para verificar se dois valores são iguais.",
      resposta: false,
      explicacao: "O operador <> significa 'diferente de'. Para verificar igualdade usa-se =."
    },
    // Questão 18 — INSERT
    {
      enunciado: "No comando INSERT, a ordem dos valores informados deve corresponder à ordem das colunas da tabela.",
      resposta: true,
      explicacao: "Os valores devem ser inseridos na mesma sequência das colunas, respeitando também os tipos de dados."
    },
    // Questão 19 — DML procedural
    {
      enunciado: "Na DML procedural, o usuário informa apenas o que deseja obter, sem precisar especificar como.",
      resposta: false,
      explicacao: "Na DML procedural o usuário informa o que quer e como obter. A não procedural (SQL padrão) é que exige apenas o que se quer."
    },
    // Questão 20 — Operadores aritméticos
    {
      enunciado: "Em SQL, parênteses têm prioridade sobre os demais operadores aritméticos em uma expressão.",
      resposta: true,
      explicacao: "Assim como na matemática, parênteses alteram a precedência dos operadores aritméticos em SQL."
    },

  ],
};