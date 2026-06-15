/* ============================================================
   NEXUS STUDY — content/game/vdd_falso/vdd_falso_data.js

   Banco de perguntas de Verdadeiro ou Falso por semestre
   e disciplina.

   Estrutura:
     {
       [semestre]: {
         [discId]: [
           {
             id:         string,   — identificador único (discId_aula_N)
             aula:       number,   — número da aula de origem
             enunciado:  string,
             resposta:   true|false,
             explicacao: string
           }
         ]
       }
     }

   Semestres disponíveis:
     • '2026.2' — Design (aulas 9–10), Banco de Dados (aulas 9–10)
     • '2026.1' — (sem conteúdo — o jogo exibirá a tela "empty")
   ============================================================ */

export const VDD_FALSO_DATA = {

  /* ════════════════════════════════════════════════════════
     SEMESTRE 2026.2
     ════════════════════════════════════════════════════════ */
  '2026.2': {

    /* ── Design — Aula 9: Prototipagem e Norma ISO 9241
                   Aula 10: Design de Interfaces e Prototipação ── */
    design: [

      // ── Aula 9 ──────────────────────────────────────────────
      // Questões 1
      {
        id: 'design_9_1',
        aula: 9,
        enunciado: "O Modelo Cascata é um modelo de desenvolvimento sequencial, onde cada etapa só começa após a anterior ser concluída.",
        resposta: true,
        explicacao: "O Cascata segue um fluxo linear: Requisitos → Projeto → Implementação → Testes → Manutenção."
      },

      // Questões 2
      {
        id: 'design_9_2',
        aula: 9,
        enunciado: "O Modelo Espiral não utiliza protótipos em seu processo de desenvolvimento.",
        resposta: false,
        explicacao: "O Modelo Espiral destaca justamente o uso de protótipos e análise de riscos em cada ciclo."
      },

      // Questões 3
      {
        id: 'design_9_3',
        aula: 9,
        enunciado: "No Modelo Estrela, o desenvolvimento sempre deve começar pela etapa de requisitos.",
        resposta: false,
        explicacao: "O Modelo Estrela tem a avaliação no centro e pode começar em qualquer etapa."
      },

      // Questões 4
      {
        id: 'design_9_4',
        aula: 9,
        enunciado: "O Modelo de Shneiderman é baseado em três pilares: especificação, prototipagem e testes de usabilidade.",
        resposta: true,
        explicacao: "Esses três pilares definem o modelo de Shneiderman, focado na análise de interface, funcionalidade e facilidade de uso."
      },
      // Questões 5
      {
        id: 'design_9_5',
        aula: 9,
        enunciado: "O Manifesto Ágil prioriza documentação extensa em vez de software funcionando.",
        resposta: false,
        explicacao: "O Ágil valoriza software funcional acima de documentação abrangente."
      },

      // Questões 6
      {
        id: 'design_9_6',
        aula: 9,
        enunciado: "O Design Thinking possui cinco princípios: centrado no usuário, cocriativo, sequencial, evidente e holístico.",
        resposta: true,
        explicacao: "Esses são os cinco princípios que fundamentam a abordagem do Design Thinking."
      },
      // Questões 7
      {
        id: 'design_9_7',
        aula: 9,
        enunciado: "A norma ISO 9241 trata exclusivamente de segurança da informação em sistemas digitais.",
        resposta: false,
        explicacao: "A ISO 9241 trata de usabilidade e ergonomia em sistemas interativos, não de segurança da informação."
      },

      // Questões 8
      {
        id: 'design_9_8',
        aula: 9,
        enunciado: "Segundo a ISO 9241, eficiência refere-se à capacidade do usuário de atingir seus objetivos.",
        resposta: false,
        explicacao: "Eficácia é atingir objetivos. Eficiência é atingi-los com menor esforço. São conceitos distintos."
      },
      // Questões 9
      {
        id: 'design_9_9',
        aula: 9,
        enunciado: "A ISO 9241 (Parte 10) define sete princípios de diálogo, entre eles tolerância a erros e individualização.",
        resposta: true,
        explicacao: "Os sete princípios são: adequação à tarefa, autodescrição, controle, conformidade, tolerância a erros, individualização e aprendizado."
      },
      // Questões 10
      {
        id: 'design_9_10',
        aula: 9,
        enunciado: "Os modelos Cascata e Espiral são classificados como modelos centrados no usuário.",
        resposta: false,
        explicacao: "Cascata e Espiral são modelos centrados no produto. Os centrados no usuário são o Modelo Estrela, Shneiderman e Design Thinking."
      },

      // ── Aula 10 ─────────────────────────────────────────────
      // Questões 11
      {
        id: 'design_10_1',
        aula: 10,
        enunciado: "O Design Centrado no Usuário (DCU) coloca o sistema e suas funcionalidades técnicas como foco principal do desenvolvimento.",
        resposta: false,
        explicacao: "O DCU coloca o usuário como foco principal, priorizando usabilidade, ergonomia e intuitividade."
      },
      // Questões 12
      {
        id: 'design_10_2',
        aula: 10,
        enunciado: "Modelos conceituais representam como o sistema funciona na teoria, utilizando metáforas do mundo real.",
        resposta: true,
        explicacao: "Modelos conceituais usam ideias e associações, incluindo metáforas, para facilitar o entendimento do sistema pelo usuário."
      },
      // Questões 13
      {
        id: 'design_10_3',
        aula: 10,
        enunciado: "A interação por conversação engloba comandos de clique e teclado.",
        resposta: false,
        explicacao: "Comandos de clique e teclado são do tipo instrução. Conversação refere-se à interação com IA, chat e voz."
      },
      // Questões 14
      {
        id: 'design_10_4',
        aula: 10,
        enunciado: "Uma barreira de usabilidade impede completamente o usuário de concluir uma tarefa.",
        resposta: true,
        explicacao: "Barreiras impedem a tarefa. Obstáculos dificultam mas permitem concluir. Ruídos causam dúvida ou confusão."
      },
      // Questões 15
      {
        id: 'design_10_5',
        aula: 10,
        enunciado: "Ruídos de usabilidade são problemas que impedem completamente a execução de uma tarefa.",
        resposta: false,
        explicacao: "Ruídos causam dúvida ou confusão, mas não impedem a tarefa. Quem impede são as barreiras."
      },
      // Questões 16
      {
        id: 'design_10_6',
        aula: 10,
        enunciado: "A prototipação tem como objetivo representar o sistema antes da implementação para testar ideias e reduzir custos.",
        resposta: true,
        explicacao: "Protótipos servem para testar ideias, identificar problemas e economizar tempo e custo antes do desenvolvimento final."
      },
      // Questões 17
      {
        id: 'design_10_7',
        aula: 10,
        enunciado: "Protótipos de baixa fidelidade são mais indicados para focar em detalhes visuais do produto final.",
        resposta: false,
        explicacao: "Baixa fidelidade gera mais ideias e é simples. Alta fidelidade é que foca em detalhes, sendo próxima do produto final."
      },
      // Questões 18
      {
        id: 'design_10_8',
        aula: 10,
        enunciado: "Um protótipo vertical cobre muitas funções com pouco nível de detalhe em cada uma.",
        resposta: false,
        explicacao: "Protótipo vertical abrange menos funções, mas com muito detalhamento. O horizontal é que cobre muitas funções com pouco detalhe."
      },
      // Questões 29
      {
        id: 'design_10_9',
        aula: 10,
        enunciado: "O wireframe é uma representação estrutural da interface, sem cores ou imagens, focada na organização do layout.",
        resposta: true,
        explicacao: "O wireframe funciona como o 'esqueleto' do sistema, mostrando botões, menus e layout sem elementos visuais finais."
      },
      // Questões 20
      {
        id: 'design_10_10',
        aula: 10,
        enunciado: "Um mockup e um wireframe são equivalentes, pois ambos representam a interface em baixa fidelidade.",
        resposta: false,
        explicacao: "Wireframe é baixa fidelidade (estrutura). Mockup é alta fidelidade, com cores, imagens e tipografia, simulando o produto final."
      },

      // Aula 11
      
      // 21 - media queries
      {
        id: 'design_11_1',
        aula: 11,
        enunciado: 'Media queries são uma técnica do CSS3 que permite aplicar estilos diferentes conforme o tamanho da tela.',
        resposta: true,
        explicacao: 'Media queries são exatamente isso: recursos do CSS3 usados para aplicar regras de estilo condicionadas ao tamanho ou características da tela.'
      },

      // 22 - layout fluido
      {
        id: 'design_11_2',
        aula: 11,
        enunciado: 'No layout fluido, recomenda-se o uso de medidas fixas como px e cm para garantir precisão no posicionamento dos elementos.',
        resposta: false,
        explicacao: 'O layout fluido usa medidas relativas como % e em. Medidas fixas (px, cm, mm) devem ser evitadas, pois impedem a adaptação proporcional ao tamanho da tela.'
      },

      // 23 - viewport
      {
        id: 'design_11_3',
        aula: 11,
        enunciado: 'A meta tag viewport com o atributo content="width=device-width, initial-scale=1" controla o zoom e a escala de exibição em dispositivos móveis.',
        resposta: true,
        explicacao: 'Essa é a configuração padrão da viewport. Ela evita que o navegador encolha o site e define a escala inicial corretamente para mobile.'
      },

      // 24 - mobile first
      {
        id: 'design_11_4',
        aula: 11,
        enunciado: 'A metodologia Mobile First consiste em criar o layout para desktops primeiro e depois adaptá-lo para telas menores usando max-width.',
        resposta: false,
        explicacao: 'Mobile First é o oposto: começa-se pelo design para telas pequenas e usa-se min-width nas media queries para expandir progressivamente para telas maiores.'
      },

      // 25 - breakpoints
      {
        id: 'design_11_5',
        aula: 11,
        enunciado: 'Breakpoints são pontos de resolução onde o layout muda de comportamento, sendo 768px um valor comumente associado a tablets.',
        resposta: true,
        explicacao: 'Conforme o conteúdo da aula, 768px é um breakpoint padrão para tablets, enquanto 480px é usado para celulares maiores e 960px+ para desktops.'
      },

      // 26 - ordem queries
      {
        id: 'design_11_6',
        aula: 11,
        enunciado: 'A ordem das media queries no CSS não interfere no resultado final, pois o navegador sempre aplica a regra mais específica independentemente da posição.',
        resposta: false,
        explicacao: 'A ordem das media queries importa. A última regra declarada pode sobrescrever as anteriores, o que pode causar comportamentos inesperados se a ordem estiver incorreta.'
      },

      // 27 - design responsivo
      {
        id: 'design_11_7',
        aula: 11,
        enunciado: 'Design responsivo vai além de redimensionar o site: envolve reorganizar e adaptar elementos para melhorar a experiência do usuário em cada dispositivo.',
        resposta: true,
        explicacao: 'Essa é a ideia central da aula. Responsividade não é apenas reduzir tamanho, mas reorganizar, adaptar e otimizar a interface para cada tipo de tela.'
      },

      // 28 - menu responsivo
      {
        id: 'design_11_8',
        aula: 11,
        enunciado: 'Em um menu responsivo, a versão mobile exibe os itens de navegação horizontalmente, enquanto o desktop utiliza o menu hambúrguer.',
        resposta: false,
        explicacao: 'É o contrário: no mobile usa-se o menu hambúrguer (ícone que esconde os itens), enquanto no desktop o menu é exibido horizontalmente.'
      },

      // 29 - medidas relativas
      {
        id: 'design_11_9',
        aula: 11,
        enunciado: 'No layout fluido, a unidade % é indicada para larguras e a unidade em é indicada para fontes.',
        resposta: true,
        explicacao: 'Conforme a aula, % é usado para definir larguras de forma proporcional e em para tamanhos de fonte, ambos permitindo adaptação relativa ao contexto.'
      },

      // 30 - mobile first vantagens
      {
        id: 'design_11_10',
        aula: 11,
        enunciado: 'Uma das vantagens da abordagem Mobile First é que ela resulta em interfaces mais limpas e com melhor desempenho, pois foca no essencial desde o início.',
        resposta: true,
        explicacao: 'A aula lista como vantagens do Mobile First: foco no essencial, melhor desempenho e interface mais limpa, justamente por partir das restrições do mobile.'
      },

    ],

    /* ── Banco de Dados — Aula 9: Definindo um Banco de Dados
                           Aula 10: Manipulando um Banco de Dados ── */
    banco_dados: [

      // ── Aula 9 ──────────────────────────────────────────────

      // Questão 1
      {
        id: 'bd_9_1',
        aula: 9,
        enunciado: "DDL (Data Definition Language) é o subconjunto da SQL responsável por criar, alterar e remover estruturas de um banco de dados.",
        resposta: true,
        explicacao: "A DDL engloba os comandos CREATE, ALTER e DROP, usados para definir e modificar estruturas como tabelas e bancos de dados."
      },
      // Questão 2
      {
        id: 'bd_9_2',
        aula: 9,
        enunciado: "O comando CREATE é utilizado para inserir novos registros dentro de uma tabela existente.",
        resposta: false,
        explicacao: "CREATE é usado para criar estruturas (bancos, tabelas, views). Para inserir registros usa-se INSERT."
      },
      // Questão 3
      {
        id: 'bd_9_3',
        aula: 9,
        enunciado: "O comando DROP TABLE remove apenas os dados da tabela, mantendo sua estrutura para uso futuro.",
        resposta: false,
        explicacao: "DROP TABLE remove permanentemente a estrutura e os dados. Para apagar só os dados, usa-se DELETE ou TRUNCATE."
      },
      // Questão 4
      {
        id: 'bd_9_4',
        aula: 9,
        enunciado: "Uma chave primária pode conter valores nulos, desde que sejam únicos na tabela.",
        resposta: false,
        explicacao: "A chave primária não aceita valores nulos (NULL) e deve ser única para cada registro."
      },
      // Questão 5
      {
        id: 'bd_9_5',
        aula: 9,
        enunciado: "A chave estrangeira cria um relacionamento entre tabelas, exigindo que seu valor exista na tabela referenciada.",
        resposta: true,
        explicacao: "A FOREIGN KEY referencia a chave primária de outra tabela, garantindo integridade referencial."
      },
      // Questão 6
      {
        id: 'bd_9_6',
        aula: 9,
        enunciado: "O comando ALTER TABLE permite adicionar novas colunas a uma tabela já existente.",
        resposta: true,
        explicacao: "ALTER TABLE é usado para modificar estruturas existentes, incluindo adicionar ou alterar colunas e restrições."
      },
      // Questão 7
      {
        id: 'bd_9_7',
        aula: 9,
        enunciado: "A opção RESTRICT impede a exclusão de um registro se existirem dependências vinculadas a ele.",
        resposta: true,
        explicacao: "RESTRICT bloqueia a operação caso existam dependências. CASCADE, ao contrário, remove as dependências automaticamente."
      },
      // Questão 8
      {
        id: 'bd_9_8',
        aula: 9,
        enunciado: "O catálogo de um banco de dados é composto por um único esquema fixo.",
        resposta: false,
        explicacao: "O catálogo é um conjunto de esquemas e contém metadados sobre as estruturas do banco, incluindo o INFORMATION_SCHEMA."
      },
      // Questão 9
      {
        id: 'bd_9_9',
        aula: 9,
        enunciado: "O tipo de dado VARCHAR armazena texto com tamanho fixo, independentemente do conteúdo inserido.",
        resposta: false,
        explicacao: "VARCHAR armazena texto de tamanho variável. CHAR é que possui tamanho fixo."
      },
      // Questão 10
      {
        id: 'bd_9_10',
        aula: 9,
        enunciado: "Ao adicionar uma nova coluna com ALTER TABLE, os registros existentes recebem NULL nessa coluna por padrão.",
        resposta: true,
        explicacao: "Como os registros já existentes não possuem valor para a nova coluna, eles recebem NULL por padrão."
      },

      // ── Aula 10 ─────────────────────────────────────────────
      // Questão 11
      {
        id: 'bd_10_1',
        aula: 10,
        enunciado: "DML (Data Manipulation Language) é responsável por manipular os dados armazenados, por meio dos comandos SELECT, INSERT, UPDATE e DELETE.",
        resposta: true,
        explicacao: "A DML é o subconjunto da SQL voltado para buscar, inserir, atualizar e excluir dados nas tabelas."
      },
      // Questão 12
      {
        id: 'bd_10_2',
        aula: 10,
        enunciado: "Executar DELETE FROM tabela sem a cláusula WHERE remove apenas o primeiro registro da tabela.",
        resposta: false,
        explicacao: "Sem WHERE, o DELETE apaga todos os registros da tabela, não apenas o primeiro."
      },
      // Questão 13
      {
        id: 'bd_10_3',
        aula: 10,
        enunciado: "A palavra-chave DISTINCT no SELECT é usada para eliminar valores duplicados no resultado da consulta.",
        resposta: true,
        explicacao: "SELECT DISTINCT retorna apenas valores únicos, removendo as duplicatas do resultado."
      },
      // Questão 14
      {
        id: 'bd_10_4',
        aula: 10,
        enunciado: "O comando UPDATE sem a cláusula WHERE atualiza apenas o registro mais recente da tabela.",
        resposta: false,
        explicacao: "Sem WHERE, o UPDATE altera todos os registros da tabela, não apenas um."
      },
      // Questão 15
      {
        id: 'bd_10_5',
        aula: 10,
        enunciado: "Na estrutura básica de uma consulta SQL, a cláusula WHERE é obrigatória para que o SELECT funcione.",
        resposta: false,
        explicacao: "WHERE é opcional. A estrutura mínima válida é SELECT coluna FROM tabela."
      },
      // Questão 16
      {
        id: 'bd_10_6',
        aula: 10,
        enunciado: "O operador lógico AND retorna resultados apenas quando todas as condições da consulta são verdadeiras.",
        resposta: true,
        explicacao: "AND exige que todas as condições sejam satisfeitas. OR basta que uma seja verdadeira."
      },
      // Questão 17
      {
        id: 'bd_10_7',
        aula: 10,
        enunciado: "Em SQL, o operador <> é utilizado para verificar se dois valores são iguais.",
        resposta: false,
        explicacao: "O operador <> significa 'diferente de'. Para verificar igualdade usa-se =."
      },
      // Questão 18
      {
        id: 'bd_10_8',
        aula: 10,
        enunciado: "No comando INSERT, a ordem dos valores informados deve corresponder à ordem das colunas da tabela.",
        resposta: true,
        explicacao: "Os valores devem ser inseridos na mesma sequência das colunas, respeitando também os tipos de dados."
      },
      // Questão 19
      {
        id: 'bd_10_9',
        aula: 10,
        enunciado: "Na DML procedural, o usuário informa apenas o que deseja obter, sem precisar especificar como.",
        resposta: false,
        explicacao: "Na DML procedural o usuário informa o que quer e como obter. A não procedural (SQL padrão) é que exige apenas o que se quer."
      },
      // Questão 20
      {
        id: 'bd_10_10',
        aula: 10,
        enunciado: "Em SQL, parênteses têm prioridade sobre os demais operadores aritméticos em uma expressão.",
        resposta: true,
        explicacao: "Assim como na matemática, parênteses alteram a precedência dos operadores aritméticos em SQL."
      },

      // 21 - cláusula WHERE
      {
        id: 'bd_11_1',
        aula: 11,
        enunciado: 'A cláusula WHERE é obrigatória em toda consulta SQL que utilize SELECT, UPDATE ou DELETE.',
        resposta: false,
        explicacao: 'WHERE não é obrigatória. Sua ausência faz com que todos os registros da tabela sejam retornados ou afetados, mas a consulta continua válida.'
      },

      // 22 - operador LIKE
      {
        id: 'bd_11_2',
        aula: 11,
        enunciado: 'No operador LIKE, o curinga % representa exatamente um caractere, enquanto _ representa qualquer sequência de caracteres.',
        resposta: false,
        explicacao: 'É o contrário: % representa qualquer sequência de caracteres (zero ou mais), e _ representa exatamente um único caractere.'
      },

      // 23 - operador BETWEEN
      {
        id: 'bd_11_3',
        aula: 11,
        enunciado: 'A expressão WHERE credito BETWEEN 10 AND 20 é equivalente a WHERE credito >= 10 AND credito <= 20.',
        resposta: true,
        explicacao: 'BETWEEN é inclusivo em ambos os extremos, sendo equivalente ao uso combinado de >= e <= com AND.'
      },

      // 24 - operador IN
      {
        id: 'bd_11_4',
        aula: 11,
        enunciado: 'O operador IN pode substituir múltiplas condições OR que verificam igualdade sobre o mesmo campo.',
        resposta: true,
        explicacao: 'WHERE campo IN (v1, v2, v3) é equivalente a WHERE campo = v1 OR campo = v2 OR campo = v3, tornando a consulta mais concisa.'
      },

      // 25 - valor NULL
      {
        id: 'bd_11_5',
        aula: 11,
        enunciado: 'NULL em SQL é equivalente a zero ou a uma string vazia, representando ausência de dado.',
        resposta: false,
        explicacao: 'NULL é distinto de zero e de string vazia. Comparações com NULL resultam em UNKNOWN, nem verdadeiro nem falso, por isso usa-se IS NULL em vez de = NULL.'
      },

      // 26 - função COUNT
      {
        id: 'bd_11_6',
        aula: 11,
        enunciado: 'A função COUNT(*) retorna a quantidade total de registros de uma tabela, incluindo linhas com valores nulos.',
        resposta: true,
        explicacao: 'COUNT(*) conta todas as linhas da tabela independentemente de haver valores nulos, diferente de COUNT(coluna), que ignora os nulos daquela coluna.'
      },

      // 27 - ORDER BY padrão
      {
        id: 'bd_11_7',
        aula: 11,
        enunciado: 'Quando ORDER BY é utilizado sem especificar ASC ou DESC, a ordenação padrão aplicada é a decrescente.',
        resposta: false,
        explicacao: 'O padrão do ORDER BY é ASC (crescente). Para ordenação decrescente é necessário informar explicitamente DESC.'
      },

      // 28 - GROUP BY regra
      {
        id: 'bd_11_8',
        aula: 11,
        enunciado: 'Em uma consulta com GROUP BY, todo campo presente no SELECT deve estar no GROUP BY ou dentro de uma função de agregação.',
        resposta: true,
        explicacao: 'Essa é uma regra fundamental do GROUP BY. Campos fora de funções agregadas e ausentes no GROUP BY causam erro na execução da consulta.'
      },

      // 29 - ordem execução
      {
        id: 'bd_11_9',
        aula: 11,
        enunciado: 'Em uma consulta SQL, a ordem de execução real pelo banco de dados é: SELECT → FROM → WHERE.',
        resposta: false,
        explicacao: 'A ordem real de execução é FROM (define a origem), WHERE (filtra os dados) e por último SELECT (seleciona e exibe o resultado).'
      },

      // 30 - funções agregação
      {
        id: 'bd_11_10',
        aula: 11,
        enunciado: 'As funções AVG, SUM, MIN e MAX são funções de agregação que realizam cálculos sobre conjuntos de registros.',
        resposta: true,
        explicacao: 'Essas funções, junto com COUNT, compõem as funções de agregação do SQL e operam sobre múltiplos registros para retornar um único valor calculado.'
      }
    ],

    poo: [

    // Aula 12 — Introdução ao JavaFX

    // Questão 1
    {
      id: 'poo_12_1',
      aula: 12,
      enunciado: 'JavaFX é um framework moderno para criação de interfaces gráficas em Java, sendo considerado o substituto mais atual do Swing.',
      resposta: true,
      explicacao: 'JavaFX foi desenvolvido como evolução do Swing, oferecendo suporte a CSS, FXML e uma abordagem mais moderna para construção de GUIs em Java.'
    },

    // 2 - hierarquia Stage Scene
    {
      id: 'poo_12_2',
      aula: 12,
      enunciado: 'No JavaFX, a Scene representa a janela principal da aplicação, enquanto o Stage define o conteúdo exibido nela.',
      resposta: false,
      explicacao: 'É o contrário: Stage é a janela principal e Scene é o conteúdo exibido dentro do Stage. A hierarquia correta é Stage → Scene → Nodes.'
    },

    // 3 - nodes
    {
      id: 'poo_12_3',
      aula: 12,
      enunciado: 'No JavaFX, botões, labels, campos de texto e imagens são todos considerados Nodes e herdam da classe Node.',
      resposta: true,
      explicacao: 'Qualquer elemento visual exibido na tela é um Node. Button, Label, TextField e ImageView são exemplos de componentes que herdam da classe Node.'
    },

    // 4 - Stage cenas
    {
      id: 'poo_12_4',
      aula: 12,
      enunciado: 'Um Stage pode exibir múltiplas Scenes simultaneamente, permitindo que diferentes telas sejam mostradas ao mesmo tempo.',
      resposta: false,
      explicacao: 'Um Stage só pode ter uma Scene ativa por vez. É possível trocar a Scene dinamicamente, mas não exibir mais de uma ao mesmo tempo.'
    },

    // 5 - layouts
    {
      id: 'poo_12_5',
      aula: 12,
      enunciado: 'O layout VBox organiza elementos na horizontal, enquanto o HBox os organiza na vertical.',
      resposta: false,
      explicacao: 'É o contrário: VBox organiza elementos verticalmente e HBox organiza horizontalmente. BorderPane divide em 5 regiões e GridPane usa estrutura de tabela.'
    },

    // 6 - MVC
    {
      id: 'poo_12_6',
      aula: 12,
      enunciado: 'Na arquitetura MVC aplicada ao JavaFX, o Controller é responsável por gerenciar as ações do usuário, enquanto o Model cuida dos dados e regras de negócio.',
      resposta: true,
      explicacao: 'No MVC, Model = dados e regras, View = interface gráfica, Controller = controle das ações. Essa separação garante baixo acoplamento e facilidade de manutenção.'
    },

    // 7 - FXML
    {
      id: 'poo_12_7',
      aula: 12,
      enunciado: 'O FXML é um arquivo baseado em XML que define a interface gráfica do JavaFX, permitindo separar o design da lógica de programação.',
      resposta: true,
      explicacao: 'FXML permite descrever a interface de forma declarativa, separando o código de apresentação do código Java. Pode ser editado visualmente com ferramentas como o Scene Builder.'
    },

    // 8 - eventos lambda
    {
      id: 'poo_12_8',
      aula: 12,
      enunciado: 'No JavaFX, o tratamento de eventos como cliques e digitação é feito exclusivamente por meio de classes anônimas, sem suporte a expressões lambda.',
      resposta: false,
      explicacao: 'O JavaFX utiliza expressões lambda para tratar eventos, tornando o código mais conciso. Por exemplo: btn.setOnAction(e -> { ... }).'
    },

    // 9 - coordenadas fixas
    {
      id: 'poo_12_9',
      aula: 12,
      enunciado: 'A boa prática no JavaFX recomenda evitar o posicionamento de elementos com coordenadas fixas (X, Y), preferindo o uso de layouts para organização automática.',
      resposta: true,
      explicacao: 'Posicionamento por coordenadas fixas dificulta a adaptação da interface. Os layouts (VBox, HBox, GridPane, BorderPane) organizam os elementos automaticamente de forma mais flexível.'
    },

    // 10 - POO no JavaFX
    {
      id: 'poo_12_10',
      aula: 12,
      enunciado: 'O JavaFX aplica conceitos de POO como herança, encapsulamento e polimorfismo, sendo possível representar cada tela como uma classe e cada componente como um objeto.',
      resposta: true,
      explicacao: 'A estrutura do JavaFX é orientada a objetos por natureza: componentes são objetos, telas podem ser classes e a arquitetura favorece a aplicação de princípios como SOLID.'
    },

    // Aula 13: JavaFX Avançado

    // 11 - FXML definição
    {
      id: 'poo_13_1',
      aula: 13,
      enunciado: 'O FXML funciona como o HTML da aplicação JavaFX: define a estrutura da interface sem conter lógica de programação.',
      resposta: true,
      explicacao: 'FXML é baseado em XML e serve exclusivamente para descrever a interface gráfica. Toda a lógica fica no Controller, mantendo a separação de responsabilidades.'
    },

    // 12 - Controller papel
    {
      id: 'poo_13_2',
      aula: 13,
      enunciado: 'No JavaFX, o Controller é responsável por definir a estrutura visual da interface, organizando os componentes na tela.',
      resposta: false,
      explicacao: 'A estrutura visual é responsabilidade do FXML (View). O Controller recebe eventos, processa dados e atualiza a interface, sendo o elo entre View e Model.'
    },

    // 13 - Binding automático
    {
      id: 'poo_13_3',
      aula: 13,
      enunciado: 'O Binding no JavaFX cria uma ligação automática entre dados e interface, eliminando a necessidade de atualização manual a cada mudança.',
      resposta: true,
      explicacao: 'Com Binding, quando um valor muda, a interface é atualizada automaticamente em tempo real, reduzindo a quantidade de código manual necessário.'
    },

    // 14 - fluxo MVC
    {
      id: 'poo_13_4',
      aula: 13,
      enunciado: 'No fluxo MVC do JavaFX, a ordem correta de comunicação é: Model → Controller → View.',
      resposta: false,
      explicacao: 'O fluxo correto é View → Controller → Model. A ação parte da interface (View), é tratada pelo Controller e então afeta os dados no Model.'
    },

    // 15 - Model responsabilidade
    {
      id: 'poo_13_5',
      aula: 13,
      enunciado: 'A classe Model no MVC representa os dados do sistema e é responsável pela lógica de dados, como atributos e métodos relacionados à entidade.',
      resposta: true,
      explicacao: 'O Model encapsula os dados da aplicação. No exemplo da aula, a classe Usuario com atributo nome e método getNome() ilustra essa responsabilidade.'
    },

    // 16 - anotação FXML
    {
      id: 'poo_13_6',
      aula: 13,
      enunciado: 'A anotação @FXML no Controller é usada para vincular atributos e métodos Java aos componentes e eventos definidos no arquivo FXML.',
      resposta: true,
      explicacao: 'Com @FXML, o JavaFX injeta automaticamente os componentes declarados no FXML (como TextField e Label) nos atributos correspondentes do Controller.'
    },

    // 17 - binding desabilitar
    {
      id: 'poo_13_7',
      aula: 13,
      enunciado: 'É possível usar Binding para desabilitar um botão automaticamente enquanto um campo de texto estiver vazio, sem necessidade de verificação manual por evento.',
      resposta: true,
      explicacao: 'O exemplo da aula mostra btnSalvar.disableProperty().bind(txtNome.textProperty().isEmpty()), que desativa o botão reativamente sempre que o campo estiver vazio.'
    },

    // 18 - eventos captura
    {
      id: 'poo_13_8',
      aula: 13,
      enunciado: 'No JavaFX, os eventos gerados pelo usuário, como cliques e digitações, são capturados diretamente pelo Model, que os processa e atualiza a View.',
      resposta: false,
      explicacao: 'Os eventos são capturados pelo Controller, não pelo Model. O fluxo é: usuário gera evento → Controller captura e processa → Model e View são atualizados conforme necessário.'
    },

    // 19 - organização projeto
    {
      id: 'poo_13_9',
      aula: 13,
      enunciado: 'A estrutura de projeto recomendada no JavaFX avançado separa os arquivos em pacotes distintos para view, controller e model, refletindo a arquitetura MVC.',
      resposta: true,
      explicacao: 'A organização sugerida na aula é: view/ para arquivos FXML, controller/ para as classes de controle e model/ para as classes de dados, aplicando MVC na estrutura de diretórios.'
    },

    // 20 - FXML lógica
    {
      id: 'poo_13_10',
      aula: 13,
      enunciado: 'Um arquivo FXML pode conter tanto a definição da interface quanto a lógica de validação dos dados, centralizando as responsabilidades em um único lugar.',
      resposta: false,
      explicacao: 'O FXML não contém lógica de programação. Toda validação e processamento ficam no Controller. A separação entre interface e lógica é justamente a principal vantagem do uso do FXML.'
    },
    
    ],

  },

  /* ════════════════════════════════════════════════════════
     SEMESTRE 2026.1
     (sem conteúdo — o jogo exibirá a tela "empty"
      com a mensagem de semestre não disponível)
     ════════════════════════════════════════════════════════ */
  '2026.1': {},

};