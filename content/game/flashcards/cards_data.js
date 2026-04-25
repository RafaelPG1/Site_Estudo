/* ═══════════════════════════════════════════════════
   cards_data.js — Conteúdo dos flashcards
   Organizado por semestre → disciplina
   content/game/flashcards/cards_data.js
═══════════════════════════════════════════════════ */

const _CARDS_POR_SEMESTRE = {

  '2026.2': {

    design: [

      // ─────────────────────────────────────────────────────────
      // Aula 9 · Prototipagem e Norma ISO 9241
      // ─────────────────────────────────────────────────────────

      // d1 · O que é a Norma ISO 9241
      {
        id: 'd1',
        frente: 'O que é a Norma ISO 9241 e qual seu foco principal?',
        verso: 'Norma internacional voltada à <strong>usabilidade e ergonomia de interfaces</strong>. Garante que sistemas sejam <strong>eficazes, eficientes e satisfatórios</strong> para o usuário.',
        dica: 'Ergonomia + experiência do usuário',
      },

      // d2 · 7 princípios de diálogo da ISO 9241 (Parte 10)
      {
        id: 'd2',
        frente: 'Quais são os 7 princípios de diálogo da ISO 9241 (Parte 10)?',
        verso: '<strong>1.</strong> Adequação à tarefa<br><strong>2.</strong> Autodescrição<br><strong>3.</strong> Controlabilidade<br><strong>4.</strong> Conformidade com expectativas<br><strong>5.</strong> Tolerância a erros<br><strong>6.</strong> Adequação à individualização<br><strong>7.</strong> Adequação ao aprendizado',
        dica: 'A-A-C-C-T-I-A — inicial de cada princípio',
      },

      // d3 · Modelos centrados no produto vs centrados no usuário
      {
        id: 'd3',
        frente: 'Qual a diferença entre modelos de desenvolvimento centrados no produto e centrados no usuário?',
        verso: 'Centrados no <strong>produto</strong> focam na entrega técnica (ex: cascata, espiral). Centrados no <strong>usuário</strong> priorizam experiência, necessidades e satisfação de quem usa.',
        dica: 'Produto = sistema pronto. Usuário = sistema útil.',
      },

      // d4 · O que é Design Thinking
      {
        id: 'd4',
        frente: 'O que é Design Thinking e qual seu diferencial?',
        verso: 'Abordagem centrada no ser humano baseada em <strong>empatia, criatividade e experimentação</strong>. O diferencial é que a solução nasce de <strong>necessidades reais</strong> identificadas por entrevistas e observação.',
        dica: 'Entender antes de criar',
      },

      // d5 · 5 princípios do Design Thinking
      {
        id: 'd5',
        frente: 'Quais são os 5 princípios do Design Thinking?',
        verso: '<strong>1.</strong> Centrado no usuário<br><strong>2.</strong> Cocriativo<br><strong>3.</strong> Sequencial<br><strong>4.</strong> Evidente<br><strong>5.</strong> Holístico',
        dica: 'C-C-S-E-H',
      },

      // d6 · Manifesto Ágil e foco no usuário
      {
        id: 'd6',
        frente: 'O que é o Manifesto Ágil e como ele prioriza o usuário?',
        verso: 'Conjunto de valores que prioriza <strong>pessoas e interações</strong> sobre processos, <strong>software funcional</strong> sobre documentação e <strong>colaboração com o cliente</strong> sobre negociação de contratos.',
        dica: 'Ágil = adaptável e colaborativo',
      },

      // d7 · Modelo Cascata e suas desvantagens
      {
        id: 'd7',
        frente: 'O que define o Modelo Cascata e quais suas desvantagens?',
        verso: 'Modelo de fluxo <strong>sequencial</strong> com etapas fixas (requisitos → projeto → implementação → testes → manutenção). Desvantagens: <strong>pouca flexibilidade</strong>, usuário pouco envolvido e erros detectados tarde.',
        dica: 'Linear demais = inflexível',
      },

      // d8 · Modelo Espiral
      {
        id: 'd8',
        frente: 'O que diferencia o Modelo Espiral dos demais modelos tradicionais?',
        verso: 'Desenvolve em <strong>ciclos (loops)</strong> com planejamento, análise de riscos, engenharia e avaliação do cliente. Destaque: uso de <strong>protótipos</strong> e redução de riscos.',
        dica: 'Espiral = ciclos + protótipos',
      },

      // d9 · Modelo Estrela
      {
        id: 'd9',
        frente: 'O que é o Modelo Estrela e qual seu elemento central?',
        verso: 'Modelo centrado no usuário onde a <strong>avaliação</strong> é o elemento central. Pode começar em qualquer etapa e tem forte <strong>interação com o usuário</strong> ao longo do processo.',
        dica: 'Avaliação no centro, qualquer ponto de entrada',
      },

      // d10 · Três métricas de usabilidade da ISO 9241
      {
        id: 'd10',
        frente: 'Quais são as três métricas de usabilidade definidas pela ISO 9241?',
        verso: '<strong>Eficácia</strong> — atingir os objetivos;<br><strong>Eficiência</strong> — com menor esforço;<br><strong>Satisfação</strong> — percepção positiva do usuário.',
        dica: 'Eficácia + Eficiência + Satisfação',
      },

      // ─────────────────────────────────────────────────────────
      // Aula 10 · Design de Interfaces e Prototipação
      // ─────────────────────────────────────────────────────────

      // d11 · Design Centrado no Usuário (DCU) e princípios
      {
        id: 'd11',
        frente: 'O que é Design Centrado no Usuário (DCU) e quais seus princípios?',
        verso: 'Abordagem que coloca o usuário como foco principal. Princípios: <strong>usabilidade</strong>, <strong>ergonomia</strong>, <strong>comunicabilidade</strong> e <strong>intuitividade</strong>.',
        dica: 'U-E-C-I — o usuário no centro',
      },

      // d12 · Modelo conceitual em design de interfaces
      {
        id: 'd12',
        frente: 'O que é um modelo conceitual em design de interfaces?',
        verso: 'Conjunto de ideias e associações que representa <strong>como o sistema funciona na teoria</strong>. Usa <strong>metáforas do mundo real</strong> e ferramentas como diagramas UML para facilitar o entendimento.',
        dica: 'Conceitual = teoria + metáforas',
      },

      // d13 · 4 tipos de interação dos modelos conceituais
      {
        id: 'd13',
        frente: 'Quais são os 4 tipos de interação dos modelos conceituais?',
        verso: '<strong>Instrução</strong> — comandos (clique, teclado, voz)<br><strong>Conversação</strong> — interação com IA (chat, voz)<br><strong>Manipulação/Navegação</strong> — interação direta com elementos<br><strong>Exploração/Pesquisa</strong> — sistema guia o usuário',
        dica: 'I-C-M-E',
      },

      // d14 · Modelo conceitual vs modelo físico
      {
        id: 'd14',
        frente: 'Qual a diferença entre modelo conceitual e modelo físico?',
        verso: '<strong>Modelo conceitual</strong> representa como o sistema funciona na teoria (funções e conexões). <strong>Modelo físico</strong> transforma isso em algo concreto: operacional, representacional e de interação.',
        dica: 'Conceitual = teoria. Físico = implementação.',
      },

      // d15 · Três tipos de problemas de usabilidade
      {
        id: 'd15',
        frente: 'Quais são os três tipos de problemas de usabilidade?',
        verso: '<strong>Barreiras</strong> — impedem a conclusão da tarefa;<br><strong>Obstáculos</strong> — dificultam, mas permitem concluir;<br><strong>Ruídos</strong> — causam dúvida ou confusão.',
        dica: 'B-O-R: bloqueio total, parcial, confusão',
      },

      // d16 · O que é prototipação
      {
        id: 'd16',
        frente: 'O que é prototipação e qual seu objetivo principal?',
        verso: 'É a <strong>representação do sistema antes da implementação</strong>. Objetivos: testar ideias, identificar problemas, <strong>economizar tempo e custo</strong> e melhorar a experiência do usuário (UX).',
        dica: 'Testar antes de construir',
      },

      // d17 · Baixa vs alta fidelidade
      {
        id: 'd17',
        frente: 'Qual a diferença entre protótipo de baixa e alta fidelidade?',
        verso: '<strong>Baixa fidelidade</strong> — simples, em rascunho, gera mais ideias e variedade.<br><strong>Alta fidelidade</strong> — detalhado, próximo do produto final, foca em refinamento.',
        dica: 'Baixa = explorar. Alta = refinar.',
      },

      // d18 · Protótipo horizontal vs vertical
      {
        id: 'd18',
        frente: 'Qual a diferença entre protótipo horizontal e vertical?',
        verso: '<strong>Horizontal</strong> — cobre muitas funções com pouco detalhamento (abrangente).<br><strong>Vertical</strong> — cobre menos funções com muito detalhamento (profundo).',
        dica: 'Horizontal = largo. Vertical = fundo.',
      },

      // d19 · Wireframe vs Mockup
      {
        id: 'd19',
        frente: 'O que é wireframe e o que o diferencia do mockup?',
        verso: '<strong>Wireframe</strong> — estrutura básica da interface, sem cores ou imagens, foco na organização (esqueleto).<br><strong>Mockup</strong> — interface visual detalhada com cores, imagens e tipografia, próxima do produto final.',
        dica: 'Wireframe = esqueleto. Mockup = visual completo.',
      },

      // d20 · Storyboard na prototipação
      {
        id: 'd20',
        frente: 'O que é um storyboard no contexto de prototipação?',
        verso: 'Representação <strong>visual e sequencial</strong> dos cenários de uso. Mostra a sequência de telas e interações como uma narrativa ilustrada.',
        dica: 'Storyboard = cenário em quadrinhos',
      },

    ],

    banco_dados: [

      // ─────────────────────────────────────────────────────────
      // Aula 9 · Definindo um Banco de Dados
      // ─────────────────────────────────────────────────────────

      // b1 · O que é DDL
      {
        id: 'b1',
        frente: 'O que é DDL e qual seu papel no SQL?',
        verso: '<strong>DDL (Data Definition Language)</strong> é o subconjunto do SQL responsável por <strong>criar, modificar e remover estruturas</strong> do banco de dados, como tabelas e esquemas.',
        dica: 'DDL = estrutura, não dados',
      },

      // b2 · Três principais comandos DDL
      {
        id: 'b2',
        frente: 'Quais são os três principais comandos DDL e o que cada um faz?',
        verso: '<strong>CREATE</strong> — cria estruturas;<br><strong>ALTER</strong> — modifica estruturas existentes;<br><strong>DROP</strong> — remove estruturas definitivamente.',
        dica: 'Criar → Alterar → Remover',
      },

      // b3 · Esquema vs Catálogo
      {
        id: 'b3',
        frente: 'Qual a diferença entre Esquema (Schema) e Catálogo em um banco de dados?',
        verso: '<strong>Esquema</strong> é o conjunto de objetos do banco (tabelas, views, restrições), representando a estrutura lógica. <strong>Catálogo</strong> é um conjunto de esquemas e armazena metadados via <strong>INFORMATION_SCHEMA</strong>.',
        dica: 'Esquema = estrutura. Catálogo = conjunto de esquemas.',
      },

      // b4 · Chave primária (PRIMARY KEY)
      {
        id: 'b4',
        frente: 'O que é chave primária (PRIMARY KEY) e quais suas regras?',
        verso: 'Campo que <strong>identifica unicamente</strong> cada registro da tabela. Regras: <strong>não pode ser nula</strong>, <strong>não pode se repetir</strong> e cada tabela deve ter apenas uma.',
        dica: 'Único + não nulo = PRIMARY KEY',
      },

      // b5 · Chave estrangeira (FOREIGN KEY)
      {
        id: 'b5',
        frente: 'O que é chave estrangeira (FOREIGN KEY) e para que serve?',
        verso: 'Campo que <strong>referencia a chave primária de outra tabela</strong>, criando relacionamento entre elas. Garante a <strong>integridade referencial</strong>: o valor deve existir na tabela referenciada.',
        dica: 'Conecta tabelas com consistência',
      },

      // b6 · CASCADE vs RESTRICT
      {
        id: 'b6',
        frente: 'Qual a diferença entre CASCADE e RESTRICT ao excluir registros?',
        verso: '<strong>CASCADE</strong>: ao deletar o registro pai, os filhos relacionados são deletados automaticamente.<br><strong>RESTRICT</strong>: impede a exclusão se houver registros filhos dependentes.',
        dica: 'CASCADE = arrasta tudo. RESTRICT = bloqueia.',
      },

      // b7 · DROP TABLE vs DELETE
      {
        id: 'b7',
        frente: 'Qual a diferença entre DROP TABLE e DELETE?',
        verso: '<strong>DROP TABLE</strong> remove a <strong>estrutura e os dados</strong> da tabela permanentemente.<br><strong>DELETE</strong> remove apenas os <strong>dados</strong>, mantendo a estrutura da tabela.',
        dica: 'DROP = estrutura + dados. DELETE = só dados.',
      },

      // b8 · Estrutura básica do CREATE TABLE
      {
        id: 'b8',
        frente: 'Qual a estrutura básica do comando CREATE TABLE?',
        verso: '<code>CREATE TABLE tabela (<br>&nbsp;&nbsp;campo tipo [restrições],<br>&nbsp;&nbsp;PRIMARY KEY (...),<br>&nbsp;&nbsp;FOREIGN KEY (...) REFERENCES ...<br>);</code>',
        dica: 'Nome → tipo → restrição → chaves',
      },

      // b9 · O que o ALTER TABLE permite fazer
      {
        id: 'b9',
        frente: 'O que o comando ALTER TABLE permite fazer?',
        verso: 'Modificar uma tabela existente: <strong>adicionar colunas</strong>, <strong>alterar tipos de dados</strong> e <strong>adicionar ou remover restrições</strong>. Novas colunas podem receber <strong>NULL</strong> por padrão.',
        dica: 'ALTER = modifica sem recriar a tabela',
      },

      // b10 · Principais tipos de dados em SQL
      {
        id: 'b10',
        frente: 'Quais são os principais tipos de dados em SQL e para que servem?',
        verso: '<strong>CHAR/VARCHAR</strong> — texto fixo/variável;<br><strong>INTEGER/SMALLINT</strong> — números inteiros;<br><strong>DECIMAL/FLOAT</strong> — números decimais;<br><strong>DATE/TIME</strong> — data e hora;<br><strong>BLOB</strong> — arquivos binários (imagem, áudio).',
        dica: 'Texto, número, data, binário',
      },

      // ─────────────────────────────────────────────────────────
      // Aula 10 · Manipulando um Banco de Dados
      // ─────────────────────────────────────────────────────────

      // b11 · O que é DML e seus quatro comandos
      {
        id: 'b11',
        frente: 'O que é DML e quais são seus quatro comandos principais?',
        verso: '<strong>DML (Data Manipulation Language)</strong> é o subconjunto do SQL que manipula dados armazenados. Comandos: <strong>SELECT</strong> (consultar), <strong>INSERT</strong> (inserir), <strong>UPDATE</strong> (atualizar), <strong>DELETE</strong> (excluir).',
        dica: 'CRUD em SQL = DML',
      },

      // b12 · DML procedural vs não procedural
      {
        id: 'b12',
        frente: 'Qual a diferença entre DML procedural e não procedural?',
        verso: '<strong>Procedural</strong> — o usuário informa o que quer <strong>e como obter</strong> (mais controle, mais complexo).<br><strong>Não procedural</strong> — o usuário informa <strong>apenas o que quer</strong> (mais simples, base do SQL).',
        dica: 'SQL = não procedural',
      },

      // b13 · Estrutura básica de uma consulta SQL
      {
        id: 'b13',
        frente: 'Qual é a estrutura básica de uma consulta SQL e o que cada cláusula faz?',
        verso: '<code>SELECT coluna FROM tabela WHERE condição;</code><br><strong>SELECT</strong> — define o que retornar;<br><strong>FROM</strong> — indica a tabela;<br><strong>WHERE</strong> — filtra os dados.',
        dica: 'Seleciona → de onde → com qual filtro',
      },

      // b14 · INSERT com especificação de colunas
      {
        id: 'b14',
        frente: 'Como o INSERT funciona e qual a sintaxe com especificação de colunas?',
        verso: 'Insere novos registros na tabela.<br><code>INSERT INTO tabela (coluna1, coluna2) VALUES (valor1, valor2);</code><br>Os valores devem respeitar o <strong>tipo de dado</strong> e a <strong>ordem das colunas</strong>.',
        dica: 'INTO → quais colunas → quais valores',
      },

      // b15 · Risco do DELETE sem WHERE
      {
        id: 'b15',
        frente: 'Qual o risco do DELETE sem cláusula WHERE?',
        verso: 'Sem WHERE, o DELETE <strong>apaga todos os registros</strong> da tabela sem confirmação. Sempre usar WHERE para especificar quais linhas remover.',
        dica: 'Sem WHERE = apaga tudo',
      },

      // b16 · Risco do UPDATE sem WHERE
      {
        id: 'b16',
        frente: 'Qual o risco do UPDATE sem cláusula WHERE?',
        verso: 'Sem WHERE, o UPDATE <strong>altera todos os registros</strong> da tabela. Sempre usar WHERE para restringir quais linhas serão modificadas.',
        dica: 'Sem WHERE = altera tudo',
      },

      // b17 · SELECT DISTINCT
      {
        id: 'b17',
        frente: 'Como funciona o SELECT DISTINCT e quando usá-lo?',
        verso: 'Remove <strong>valores duplicados</strong> do resultado da consulta.<br><code>SELECT DISTINCT coluna FROM tabela;</code><br>Usado quando o SQL retorna repetições indesejadas.',
        dica: 'DISTINCT = sem repetição',
      },

      // b18 · Operadores lógicos do SQL
      {
        id: 'b18',
        frente: 'Quais são os operadores lógicos do SQL e como cada um funciona?',
        verso: '<strong>AND</strong> — todas as condições devem ser verdadeiras (mais restritivo);<br><strong>OR</strong> — pelo menos uma condição verdadeira (mais amplo);<br><strong>NOT</strong> — inverte a condição.',
        dica: 'AND = todos. OR = algum. NOT = inverte.',
      },

      // b19 · Operadores de comparação do SQL
      {
        id: 'b19',
        frente: 'Quais são os operadores de comparação do SQL?',
        verso: '<strong>=</strong> igual, <strong>&gt;</strong> maior, <strong>&gt;=</strong> maior ou igual, <strong>&lt;</strong> menor, <strong>&lt;=</strong> menor ou igual, <strong>&lt;&gt;</strong> diferente.',
        dica: '= > >= < <= <>',
      },

      // b20 · Operadores aritméticos no SELECT
      {
        id: 'b20',
        frente: 'Como usar operadores aritméticos no SELECT? Dê um exemplo.',
        verso: 'Permitem calcular valores diretamente na consulta.<br><code>SELECT salario * 12 AS salario_anual FROM empregados;</code><br>Operadores: <strong>+ - * /</strong>. Parênteses têm prioridade.',
        dica: 'SELECT pode calcular — parênteses primeiro',
      },

    ],

    redes: [],
    poo:   [],

  },

};

export function getCardsData(semestre) {
  return _CARDS_POR_SEMESTRE[semestre] ?? {};
}