/* ============================================================
   NEXUS STUDY — games/conteudo/flashcards/flashcards.js

   Formato dos decks de flashcard.
   Cada chave é o id da disciplina (mesmo valor de ?disc= na URL).

   Estrutura de cada card:
     id      → número único dentro do deck
     frente  → pergunta ou termo (exibido na frente do card)
     verso   → resposta ou definição (exibido ao virar)
     dica    → (opcional) texto de apoio exibido na frente
     tags    → (opcional) array de strings para filtros futuros

   Como adicionar uma disciplina:
     1. Adicione uma nova chave em DECKS com o id da disciplina
     2. Preencha o array de cards (recomendado: 20–60 cards por deck)
     3. O jogo carrega automaticamente pelo ?disc= na URL
   ============================================================ */

export const DECKS = {

  /* ── EXEMPLO — substitua pelo id real da sua disciplina ── */
  'exemplo': {
    cards: [
      {
        id: 1,
        frente: 'O que é encapsulamento?',
        verso:  'Mecanismo que protege os dados internos de um objeto, expondo apenas o necessário por meio de métodos públicos (getters/setters).',
        dica:   'Relacionado a controle de acesso',
      },
      {
        id: 2,
        frente: 'Diferença entre classe e objeto',
        verso:  'Classe é o molde/definição; objeto é uma instância concreta criada a partir desse molde com valores próprios.',
      },
      {
        id: 3,
        frente: 'O que é herança?',
        verso:  'Mecanismo pelo qual uma classe (filha) herda atributos e métodos de outra classe (pai), permitindo reutilização e especialização de código.',
        tags:   ['herança', 'hierarquia'],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     DESIGN — Aula 9: Prototipagem e Norma ISO 9241 (2026.2)
     ══════════════════════════════════════════════════════════ */
  'design': {
    cards: [
      {
        id: 1,
        frente: 'Qual a principal diferença entre modelos de ciclo de vida centrados no produto e centrados no usuário?',
        verso:  'Modelos centrados no produto seguem etapas sequenciais com pouco envolvimento do usuário (ex: cascata). Modelos centrados no usuário priorizam usabilidade, experiência e aspectos cognitivos/emocionais, com forte interação com o usuário ao longo de todo o processo.',
        dica:   'Pense em quem fica no centro: o sistema ou a pessoa que usa',
        tags:   ['ciclo de vida', 'usabilidade'],
      },
      {
        id: 2,
        frente: 'O que é o Modelo Cascata e quais são suas desvantagens?',
        verso:  'Modelo sequencial com etapas fixas: Requisitos → Projeto → Implementação → Testes → Manutenção. Desvantagens: pouca flexibilidade, usuário pouco envolvido e erros só detectados nas fases finais.',
        dica:   'Fluxo linear, uma etapa por vez',
        tags:   ['cascata', 'modelos'],
      },
      {
        id: 3,
        frente: 'O que diferencia o Modelo Estrela dos demais modelos de desenvolvimento?',
        verso:  'A avaliação fica no centro do modelo e o desenvolvimento pode começar em qualquer etapa — não há ordem obrigatória. O destaque é a forte interação com o usuário em todos os momentos.',
        dica:   'A avaliação é o ponto central, e qualquer etapa pode ser a primeira',
        tags:   ['estrela', 'centrado no usuário'],
      },
      {
        id: 4,
        frente: 'Quais são os 3 pilares do Modelo de Shneiderman?',
        verso:  '1. Especificação — define os requisitos da interface\n2. Prototipagem — cria modelos para teste\n3. Testes de usabilidade — avalia interface, funcionalidade e facilidade de uso',
        dica:   'Especifica → Prototipa → Testa',
        tags:   ['Shneiderman', 'usabilidade'],
      },
      {
        id: 5,
        frente: 'O que é Design Thinking e quais são seus 5 princípios?',
        verso:  'Abordagem centrada no ser humano baseada em empatia, criatividade e experimentação. Seus 5 princípios são:\n1. Centrado no usuário\n2. Cocriativo\n3. Sequencial\n4. Evidente\n5. Holístico',
        dica:   'Interdisciplinar, foco nas necessidades reais do usuário',
        tags:   ['design thinking', 'inovação'],
      },
      {
        id: 6,
        frente: 'O que define a Norma ISO 9241?',
        verso:  'Norma internacional que trata de usabilidade e ergonomia em sistemas interativos. Baseia-se em três métricas: Eficácia (atingir objetivos), Eficiência (com menor esforço) e Satisfação (percepção do usuário).',
        dica:   'Norma de usabilidade — três pilares: eficácia, eficiência, satisfação',
        tags:   ['ISO 9241', 'norma', 'usabilidade'],
      },
      {
        id: 7,
        frente: 'Quais são os 7 princípios de diálogo da ISO 9241 (Parte 10)?',
        verso:  '1. Adequação à tarefa\n2. Autodescrição (interface clara)\n3. Controle pelo usuário\n4. Conformidade (consistência)\n5. Tolerância a erros\n6. Individualização (personalização)\n7. Aprendizado (fácil de aprender)',
        dica:   'Pense nas qualidades de uma interface ideal para o usuário',
        tags:   ['ISO 9241', 'princípios de diálogo'],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     BANCO DE DADOS — Aula 9: Definindo um Banco de Dados (2026.2)
     ══════════════════════════════════════════════════════════ */
  'bd': {
    cards: [
      {
        id: 1,
        frente: 'O que é DDL e quais são seus três comandos principais?',
        verso:  'DDL (Data Definition Language) é o subconjunto da SQL responsável por gerenciar estruturas do banco. Os três comandos principais são:\n• CREATE — cria estruturas\n• ALTER — modifica estruturas existentes\n• DROP — remove estruturas permanentemente',
        dica:   'DDL define a forma, não os dados em si',
        tags:   ['DDL', 'SQL'],
      },
      {
        id: 2,
        frente: 'Qual a diferença entre Esquema (Schema) e Catálogo em um banco de dados?',
        verso:  'Esquema é o conjunto de objetos de um banco (tabelas, views, restrições) — representa a estrutura lógica. Catálogo é o conjunto de esquemas e contém metadados sobre o banco, incluindo o INFORMATION_SCHEMA.',
        dica:   'Catálogo contém esquemas; esquemas contêm tabelas e objetos',
        tags:   ['schema', 'catálogo', 'estrutura'],
      },
      {
        id: 3,
        frente: 'Qual a diferença entre DROP TABLE e DELETE?',
        verso:  'DROP TABLE remove permanentemente a estrutura da tabela junto com todos os dados — a tabela deixa de existir. DELETE remove apenas os dados (registros), mantendo a estrutura da tabela intacta.',
        dica:   'DROP = estrutura + dados | DELETE = só os dados',
        tags:   ['DROP', 'DELETE', 'DDL'],
      },
      {
        id: 4,
        frente: 'O que é uma Chave Primária (PRIMARY KEY) e quais são suas regras?',
        verso:  'Campo ou conjunto de campos que identifica unicamente cada registro de uma tabela. Regras obrigatórias: não pode ter valor NULL e o valor deve ser único em toda a tabela.\nSintaxe: PRIMARY KEY (campo)',
        dica:   'Identidade única de cada linha — nunca nula, nunca repetida',
        tags:   ['primary key', 'chave primária', 'integridade'],
      },
      {
        id: 5,
        frente: 'O que é uma Chave Estrangeira (FOREIGN KEY) e para que serve?',
        verso:  'Campo que cria um relacionamento entre duas tabelas. O valor inserido deve existir na tabela referenciada, garantindo integridade referencial — evita referências inválidas entre registros.\nSintaxe: FOREIGN KEY (campo) REFERENCES tabela(campo)',
        dica:   'Liga duas tabelas e garante consistência nos dados relacionados',
        tags:   ['foreign key', 'chave estrangeira', 'relacionamento'],
      },
      {
        id: 6,
        frente: 'Qual a diferença entre CASCADE e RESTRICT na exclusão de registros?',
        verso:  'CASCADE remove automaticamente todos os registros dependentes quando o registro pai é excluído. RESTRICT impede a exclusão do registro pai se houver registros dependentes — protege a integridade referencial.',
        dica:   'CASCADE propaga a exclusão; RESTRICT bloqueia',
        tags:   ['CASCADE', 'RESTRICT', 'integridade referencial'],
      },
      {
        id: 7,
        frente: 'Qual a estrutura básica do comando CREATE TABLE?',
        verso:  'CREATE TABLE nome_tabela (\n  campo tipo [restrições],\n  PRIMARY KEY (campo),\n  FOREIGN KEY (campo) REFERENCES outra_tabela(campo)\n);\n\nDefine: nome da tabela, colunas com tipos de dados (CHAR, VARCHAR, INTEGER, DATE…), chave primária e relacionamentos.',
        dica:   'Sempre: nome → colunas → chaves → restrições',
        tags:   ['CREATE TABLE', 'DDL', 'sintaxe'],
      },
    ],
  },

};