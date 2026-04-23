/* ═══════════════════════════════════════════════════
   cards_data.js — Conteúdo dos flashcards
   IDs de disciplina espelham o global.js
   games/conteudo/flashcard/cards_data.js
═══════════════════════════════════════════════════ */

export const CARDS_DATA = {

  design: [
    {
      id: 'd1',
      frente: 'O que é a Norma ISO 9241 e qual seu foco principal?',
      verso: 'É uma norma internacional voltada à <strong>usabilidade e ergonomia de interfaces</strong>. Seu foco é garantir que sistemas sejam eficientes, eficazes e satisfatórios para o usuário.',
      dica: 'Pense em ergonomia + experiência do usuário',
    },
    {
      id: 'd2',
      frente: 'Quais são os 7 princípios de diálogo da ISO 9241 (Parte 10)?',
      verso: '<strong>1.</strong> Adequação à tarefa<br><strong>2.</strong> Autodescrição<br><strong>3.</strong> Controlabilidade<br><strong>4.</strong> Conformidade com as expectativas do usuário<br><strong>5.</strong> Tolerância a erros<br><strong>6.</strong> Adequação à individualização<br><strong>7.</strong> Adequação ao aprendizado',
      dica: 'A, A, C, C, T, I, A — memorize a inicial de cada um',
    },
    {
      id: 'd3',
      frente: 'O que diferencia os modelos de desenvolvimento centrados no produto dos centrados no usuário?',
      verso: 'Modelos centrados no <strong>produto</strong> focam na entrega técnica do sistema (ex: cascata, espiral). Já os centrados no <strong>usuário</strong> priorizam a experiência, necessidades e satisfação de quem vai usar o sistema.',
      dica: 'Produto → sistema pronto. Usuário → sistema útil.',
    },
    {
      id: 'd4',
      frente: 'O que é Design Thinking e qual seu diferencial?',
      verso: 'É uma abordagem inovadora de desenvolvimento que parte de <strong>entrevistas e observação dos usuários</strong> para identificar necessidades reais antes de criar soluções. O diferencial é que a solução nasce da necessidade, não de suposições.',
      dica: 'Entender antes de criar',
    },
    {
      id: 'd5',
      frente: 'O que é o Manifesto Ágil e como ele se relaciona com o foco no usuário?',
      verso: 'É um conjunto de valores e princípios que priorizam <strong>pessoas e interações</strong> sobre processos e ferramentas, e <strong>colaboração com o cliente</strong> sobre negociação de contratos. Reforça a ideia de desenvolvimento centrado no usuário.',
      dica: 'Ágil = adaptável e colaborativo',
    },
    {
      id: 'd6',
      frente: 'O que é tolerância a erros segundo a ISO 9241? Dê um exemplo.',
      verso: 'É o princípio que diz que o sistema deve <strong>prevenir ou corrigir erros</strong> automaticamente, ou orientar o usuário a corrigi-los. Exemplo: alerta de senha inválida ou autocorreção de digitação.',
      dica: 'O sistema protege o usuário dos próprios erros',
    },
    {
      id: 'd7',
      frente: 'O que é individualização na ISO 9241? Dê um exemplo.',
      verso: 'É a capacidade do sistema de ser <strong>personalizado pelo usuário</strong> conforme suas preferências e necessidades. Exemplo: alterar idioma, tema ou layout da interface.',
      dica: 'Cada usuário configura do seu jeito',
    },
  ],

  banco_dados: [
    {
      id: 'b1',
      frente: 'O que é DDL e qual seu papel no SQL?',
      verso: '<strong>DDL (Data Definition Language)</strong> é a linguagem de definição de dados do SQL. Ela permite <strong>criar, modificar e remover estruturas</strong> do banco de dados, como tabelas e esquemas.',
      dica: 'DDL = estrutura, não dados',
    },
    {
      id: 'b2',
      frente: 'Quais são os principais comandos DDL e o que cada um faz?',
      verso: '<strong>CREATE</strong> — cria banco ou tabela<br><strong>ALTER</strong> — modifica estrutura existente<br><strong>DROP</strong> — remove banco ou tabela definitivamente',
      dica: 'Criar → Alterar → Remover',
    },
    {
      id: 'b3',
      frente: 'Qual é a estrutura básica do comando CREATE TABLE?',
      verso: '<code>CREATE TABLE tabela (<br>&nbsp;&nbsp;campo tipo [restrições],<br>&nbsp;&nbsp;PRIMARY KEY (...),<br>&nbsp;&nbsp;FOREIGN KEY (...) REFERENCES ...<br>);</code>',
      dica: 'Nome → tipo → restrição → chaves',
    },
    {
      id: 'b4',
      frente: 'O que é chave primária (PRIMARY KEY) e quais suas regras?',
      verso: 'É o campo que <strong>identifica unicamente</strong> cada registro de uma tabela. Regras: não pode ser nulo, não pode se repetir e cada tabela deve ter apenas uma.',
      dica: 'Único + não nulo = PRIMARY KEY',
    },
    {
      id: 'b5',
      frente: 'O que é chave estrangeira (FOREIGN KEY) e para que serve?',
      verso: 'É um campo que <strong>referencia a chave primária de outra tabela</strong>, criando um relacionamento entre elas. Garante a <strong>integridade referencial</strong>, ou seja, o valor deve existir na tabela referenciada.',
      dica: 'Conecta duas tabelas com consistência',
    },
    {
      id: 'b6',
      frente: 'Qual a diferença entre CASCADE e RESTRICT ao remover dados?',
      verso: '<strong>CASCADE</strong>: ao deletar um registro pai, os filhos relacionados também são deletados automaticamente.<br><strong>RESTRICT</strong>: impede a exclusão se houver registros filhos dependentes.',
      dica: 'CASCADE = arrasta tudo. RESTRICT = bloqueia.',
    },
    {
      id: 'b7',
      frente: 'Por que o comando DROP exige cuidado extremo?',
      verso: 'Porque ele <strong>remove a estrutura definitivamente</strong>, sem possibilidade de recuperação. Um <code>DROP DATABASE</code> apaga o banco inteiro e todos os seus dados permanentemente.',
      dica: 'DROP não tem Ctrl+Z',
    },
  ],

};