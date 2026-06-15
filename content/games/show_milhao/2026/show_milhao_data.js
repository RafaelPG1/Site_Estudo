/* ═══════════════════════════════════════════════════
   show_milhao_data.js — Perguntas do Show do Milhão
   Organizado por semestre → disciplina

   IMPORTANTE: exporta `SHOW_MILHAO_DATA` (objeto nomeado)
   pois o show_milhao.js acessa via:
     modulo.SHOW_MILHAO_DATA?.[sem]?.[disc]
═══════════════════════════════════════════════════ */

export const SHOW_MILHAO_DATA = {

  '2026.1-AP2': {

    poo: [
 // Aula 12 - Introdução ao JavaFX
    // questão 1
    {
      id: "poo_01",
      aula: "Aula 12 - Introdução ao JavaFX",
      texto: "O JavaFX é considerado substituto de qual framework anterior para interfaces gráficas em Java?",
      alternativas: {
        A: "AWT",
        B: "Swing",
        C: "SWT",
        D: "Spring"
      },
      correta: "B",
      nivel: "Fácil"
    },

    // questão 2
    {
      id: "poo_02",
      aula: "Aula 12 - Introdução ao JavaFX",
      texto: "Na hierarquia do JavaFX, qual é a ordem correta dos elementos principais?",
      alternativas: {
        A: "Scene → Stage → Nodes",
        B: "Nodes → Scene → Stage",
        C: "Stage → Scene → Nodes",
        D: "Scene → Nodes → Stage"
      },
      correta: "C",
      nivel: "Fácil"
    },

    // questão 3
    {
      id: "poo_03",
      aula: "Aula 12 - Introdução ao JavaFX",
      texto: "Qual layout do JavaFX organiza elementos de forma vertical?",
      alternativas: {
        A: "HBox",
        B: "GridPane",
        C: "BorderPane",
        D: "VBox"
      },
      correta: "D",
      nivel: "Fácil"
    },

    // questão 4
    {
      id: "poo_04",
      aula: "Aula 12 - Introdução ao JavaFX",
      texto: "O que é o Stage no JavaFX?",
      alternativas: {
        A: "O conjunto de elementos visuais da tela",
        B: "A área onde os formulários são exibidos",
        C: "A janela principal da aplicação",
        D: "O arquivo de configuração da interface"
      },
      correta: "C",
      nivel: "Fácil"
    },

    // questão 5
    {
      id: "poo_05",
      aula: "Aula 12 - Introdução ao JavaFX",
      texto: "Na arquitetura MVC do JavaFX, qual camada é responsável pelos dados e regras de negócio?",
      alternativas: {
        A: "View",
        B: "Controller",
        C: "Stage",
        D: "Model"
      },
      correta: "D",
      nivel: "Médio"
    },

    // questão 6
    {
      id: "poo_06",
      aula: "Aula 12 - Introdução ao JavaFX",
      texto: "Qual a principal vantagem do uso de FXML no JavaFX?",
      alternativas: {
        A: "Aumenta a velocidade de execução do programa",
        B: "Separa o design da interface do código Java",
        C: "Substitui completamente o uso de classes Java",
        D: "Permite criar banco de dados diretamente na interface"
      },
      correta: "B",
      nivel: "Médio"
    },

    // questão 7
    {
      id: "poo_07",
      aula: "Aula 12 - Introdução ao JavaFX",
      texto: "Como os eventos são tratados no JavaFX?",
      alternativas: {
        A: "Através de herança múltipla entre classes",
        B: "Por meio de expressões lambda",
        C: "Usando arquivos de configuração XML",
        D: "Somente com interfaces anônimas"
      },
      correta: "B",
      nivel: "Médio"
    },

    // questão 8
    {
      id: "poo_08",
      aula: "Aula 12 - Introdução ao JavaFX",
      texto: "Qual método inicia a execução de uma aplicação JavaFX?",
      alternativas: {
        A: "run()",
        B: "main()",
        C: "launch()",
        D: "start()"
      },
      correta: "C",
      nivel: "Médio"
    },

    // questão 9
    {
      id: "poo_09",
      aula: "Aula 12 - Introdução ao JavaFX",
      texto: "Qual layout do JavaFX divide a tela em 5 regiões distintas?",
      alternativas: {
        A: "VBox",
        B: "GridPane",
        C: "HBox",
        D: "BorderPane"
      },
      correta: "D",
      nivel: "Difícil"
    },

    // questão 10
    {
      id: "poo_10",
      aula: "Aula 12 - Introdução ao JavaFX",
      texto: "Por que é considerada má prática usar coordenadas fixas (X, Y) para posicionar elementos no JavaFX?",
      alternativas: {
        A: "Porque o JavaFX não suporta coordenadas numéricas",
        B: "Porque prejudica a organização automática e a responsividade da interface",
        C: "Porque aumenta o consumo de memória da aplicação",
        D: "Porque impede o uso de eventos na interface"
      },
      correta: "B",
      nivel: "Difícil"
    },
    
    // Aula 13 - JavaFX Avançado
    // questão 11
    {
      id: "poo_11",
      aula: "Aula 13 - JavaFX Avançado",
      texto: "No FXML, qual atributo associa um componente visual ao seu Controller?",
      alternativas: {
        A: "fx:link",
        B: "fx:controller",
        C: "fx:bind",
        D: "fx:class"
      },
      correta: "B",
      nivel: "Fácil"
    },
    
    // questão 12
    {
      id: "poo_12",
      aula: "Aula 13 - JavaFX Avançado",
      texto: "O que o Binding faz no JavaFX?",
      alternativas: {
        A: "Define o estilo visual dos componentes",
        B: "Liga dados à interface e atualiza valores automaticamente",
        C: "Cria eventos de clique nos botões",
        D: "Carrega arquivos FXML dinamicamente"
      },
      correta: "B",
      nivel: "Fácil"
    },
    
    // questão 13
    {
      id: "poo_13",
      aula: "Aula 13 - JavaFX Avançado",
      texto: "Na arquitetura MVC do JavaFX avançado, o FXML representa qual camada?",
      alternativas: {
        A: "Model",
        B: "Controller",
        C: "View",
        D: "Service"
      },
      correta: "C",
      nivel: "Fácil"
    },
    
    // questão 14
    {
      id: "poo_14",
      aula: "Aula 13 - JavaFX Avançado",
      texto: "Qual anotação é usada no Controller para referenciar componentes definidos no FXML?",
      alternativas: {
        A: "@Inject",
        B: "@Component",
        C: "@Override",
        D: "@FXML"
      },
      correta: "D",
      nivel: "Fácil"
    },
    
    // questão 15
    {
      id: "poo_15",
      aula: "Aula 13 - JavaFX Avançado",
      texto: "Qual é o fluxo correto de comunicação na arquitetura MVC do JavaFX?",
      alternativas: {
        A: "Model → View → Controller",
        B: "Controller → View → Model",
        C: "View → Controller → Model",
        D: "Model → Controller → View"
      },
      correta: "C",
      nivel: "Médio"
    },
    
    // questão 16
    {
      id: "poo_16",
      aula: "Aula 13 - JavaFX Avançado",
      texto: "O que a instrução btnSalvar.disableProperty().bind(txtNome.textProperty().isEmpty()) faz?",
      alternativas: {
        A: "Oculta o botão quando o campo está vazio",
        B: "Desabilita o botão automaticamente enquanto o campo estiver vazio",
        C: "Apaga o conteúdo do campo ao clicar no botão",
        D: "Habilita o botão somente após validação manual"
      },
      correta: "B",
      nivel: "Médio"
    },
    
    // questão 17
    {
      id: "poo_17",
      aula: "Aula 13 - JavaFX Avançado",
      texto: "Qual é a responsabilidade da classe Controller no JavaFX avançado?",
      alternativas: {
        A: "Definir o layout visual da interface",
        B: "Armazenar os dados da aplicação",
        C: "Receber eventos, processar dados e atualizar a interface",
        D: "Carregar arquivos CSS para estilização"
      },
      correta: "C",
      nivel: "Médio"
    },
    
    // questão 18
    {
      id: "poo_18",
      aula: "Aula 13 - JavaFX Avançado",
      texto: "Qual classe Java é usada para carregar um arquivo FXML e criar a cena?",
      alternativas: {
        A: "SceneLoader",
        B: "FXMLLoader",
        C: "StageBuilder",
        D: "ViewLoader"
      },
      correta: "B",
      nivel: "Médio"
    },
    
    // questão 19
    {
      id: "poo_19",
      aula: "Aula 13 - JavaFX Avançado",
      texto: "Qual é o principal benefício de usar Binding no lugar de atualização manual da interface?",
      alternativas: {
        A: "Aumenta a segurança contra acessos não autorizados",
        B: "Reduz a quantidade de código e mantém atualização em tempo real",
        C: "Melhora o desempenho gráfico da aplicação",
        D: "Substitui a necessidade de usar FXML"
      },
      correta: "B",
      nivel: "Difícil"
    },
    
    // questão 20
    {
      id: "poo_20",
      aula: "Aula 13 - JavaFX Avançado",
      texto: "Por que a separação entre FXML e Controller é considerada uma boa prática no JavaFX avançado?",
      alternativas: {
        A: "Porque o FXML não suporta lógica de programação e essa limitação força boas práticas",
        B: "Porque facilita a manutenção, permite reutilização e aplica o princípio de separação de responsabilidades",
        C: "Porque reduz o tamanho do arquivo final compilado",
        D: "Porque o Controller só funciona quando separado do arquivo FXML"
      },
      correta: "B",
      nivel: "Difícil"
    },
    ],

    redes: [],


  design: [
    {
      id: "ds_01",
      aula: "Aula 9 - Prototipagem e Norma ISO 9241",
      texto: "Qual modelo de desenvolvimento de software possui fluxo sequencial com etapas fixas?",
      alternativas: {
        A: "Modelo Estrela",
        B: "Modelo Espiral",
        C: "Modelo Cascata",
        D: "Modelo Iterativo"
      },
      correta: "C",
      nivel: "Fácil"
    },
    {
      id: "ds_02",
      aula: "Aula 9 - Prototipagem e Norma ISO 9241",
      texto: "A norma ISO 9241 trata principalmente de qual tema?",
      alternativas: {
        A: "Segurança de redes",
        B: "Usabilidade e ergonomia de sistemas interativos",
        C: "Gerenciamento de banco de dados",
        D: "Modelagem orientada a objetos"
      },
      correta: "B",
      nivel: "Fácil"
    },
    {
      id: "ds_03",
      aula: "Aula 9 - Prototipagem e Norma ISO 9241",
      texto: "Qual abordagem de desenvolvimento é centrada em empatia, criatividade e experimentação?",
      alternativas: {
        A: "Modelo Cascata",
        B: "Manifesto Ágil",
        C: "Design Thinking",
        D: "Modelo Espiral"
      },
      correta: "C",
      nivel: "Fácil"
    },
    {
      id: "ds_04",
      aula: "Aula 9 - Prototipagem e Norma ISO 9241",
      texto: "No modelo Estrela, qual etapa ocupa o centro do processo?",
      alternativas: {
        A: "Implementação",
        B: "Prototipagem",
        C: "Avaliação",
        D: "Especificação"
      },
      correta: "C",
      nivel: "Fácil"
    },
    {
      id: "ds_05",
      aula: "Aula 9 - Prototipagem e Norma ISO 9241",
      texto: "Quais são as três métricas de usabilidade definidas pela ISO 9241?",
      alternativas: {
        A: "Velocidade, precisão e conforto",
        B: "Eficácia, eficiência e satisfação",
        C: "Aprendizado, memória e desempenho",
        D: "Funcionalidade, estética e acessibilidade"
      },
      correta: "B",
      nivel: "Médio"
    },
    {
      id: "ds_06",
      aula: "Aula 9 - Prototipagem e Norma ISO 9241",
      texto: "O modelo de Shneiderman é baseado em quais três pilares?",
      alternativas: {
        A: "Planejamento, desenvolvimento e testes",
        B: "Empatia, prototipagem e validação",
        C: "Especificação, prototipagem e testes de usabilidade",
        D: "Requisitos, projeto e manutenção"
      },
      correta: "C",
      nivel: "Médio"
    },
    {
      id: "ds_07",
      aula: "Aula 9 - Prototipagem e Norma ISO 9241",
      texto: "Qual princípio da ISO 9241 garante que o sistema previne e trata erros do usuário?",
      alternativas: {
        A: "Individualização",
        B: "Controle",
        C: "Tolerância a erros",
        D: "Conformidade"
      },
      correta: "C",
      nivel: "Médio"
    },
    {
      id: "ds_08",
      aula: "Aula 9 - Prototipagem e Norma ISO 9241",
      texto: "O Manifesto Ágil prioriza qual aspecto em relação à documentação?",
      alternativas: {
        A: "Documentação completa e detalhada",
        B: "Processos formais bem definidos",
        C: "Software funcional entregue rapidamente",
        D: "Contratos rígidos com o cliente"
      },
      correta: "C",
      nivel: "Médio"
    },
    {
      id: "ds_09",
      aula: "Aula 9 - Prototipagem e Norma ISO 9241",
      texto: "Quantos princípios de diálogo são definidos pela parte 10 da ISO 9241?",
      alternativas: {
        A: "5",
        B: "6",
        C: "8",
        D: "7"
      },
      correta: "D",
      nivel: "Difícil"
    },
    {
      id: "ds_10",
      aula: "Aula 9 - Prototipagem e Norma ISO 9241",
      texto: "Qual característica diferencia os modelos centrados no usuário dos modelos tradicionais de desenvolvimento?",
      alternativas: {
        A: "Uso de linguagens de programação mais modernas",
        B: "Maior foco em custo e prazo de entrega",
        C: "Prioridade a aspectos cognitivos, emocionais e de experiência do usuário",
        D: "Aplicação exclusiva de testes automatizados"
      },
      correta: "C",
      nivel: "Difícil"
    },
    {
      id: "ds_11",
      aula: "Aula 10 - Design de Interfaces e Prototipação",
      texto: "O que é um wireframe no contexto de prototipação?",
      alternativas: {
        A: "Interface visual com cores e imagens finais",
        B: "Narrativa textual do fluxo de uso",
        C: "Estrutura básica da interface sem elementos visuais",
        D: "Sequência de telas em formato de quadrinhos"
      },
      correta: "C",
      nivel: "Fácil"
    },
    {
      id: "ds_12",
      aula: "Aula 10 - Design de Interfaces e Prototipação",
      texto: "Qual tipo de protótipo é mais simples, semelhante a um rascunho?",
      alternativas: {
        A: "Alta fidelidade",
        B: "Mockup",
        C: "Storyboard",
        D: "Baixa fidelidade"
      },
      correta: "D",
      nivel: "Fácil"
    },
    {
      id: "ds_13",
      aula: "Aula 10 - Design de Interfaces e Prototipação",
      texto: "Qual problema de usabilidade impede completamente a realização de uma tarefa?",
      alternativas: {
        A: "Ruído",
        B: "Obstáculo",
        C: "Barreira",
        D: "Conflito"
      },
      correta: "C",
      nivel: "Fácil"
    },
    {
      id: "ds_14",
      aula: "Aula 10 - Design de Interfaces e Prototipação",
      texto: "O mockup representa qual estágio da prototipação?",
      alternativas: {
        A: "Rascunho inicial sem detalhes visuais",
        B: "Diagrama de fluxo de dados",
        C: "Interface visual detalhada próxima do produto final",
        D: "Narrativa textual do sistema"
      },
      correta: "C",
      nivel: "Fácil"
    },
    {
      id: "ds_15",
      aula: "Aula 10 - Design de Interfaces e Prototipação",
      texto: "Qual tipo de protótipo cobre muitas funções com pouco detalhamento?",
      alternativas: {
        A: "Vertical",
        B: "Alta fidelidade",
        C: "Cenário",
        D: "Horizontal"
      },
      correta: "D",
      nivel: "Médio"
    },
    {
      id: "ds_16",
      aula: "Aula 10 - Design de Interfaces e Prototipação",
      texto: "No Design Centrado no Usuário, o que representa a comunicabilidade?",
      alternativas: {
        A: "Conforto físico na interação com o sistema",
        B: "Clareza das informações transmitidas pela interface",
        C: "Facilidade de aprender a usar o sistema",
        D: "Velocidade de resposta do sistema"
      },
      correta: "B",
      nivel: "Médio"
    },
    {
      id: "ds_17",
      aula: "Aula 10 - Design de Interfaces e Prototipação",
      texto: "O modelo conceitual usa metáforas do mundo real com qual finalidade?",
      alternativas: {
        A: "Reduzir o custo de desenvolvimento",
        B: "Facilitar o entendimento do sistema pelo usuário",
        C: "Aumentar a performance do sistema",
        D: "Substituir os testes de usabilidade"
      },
      correta: "B",
      nivel: "Médio"
    },
    {
      id: "ds_18",
      aula: "Aula 10 - Design de Interfaces e Prototipação",
      texto: "Qual tipo de interação descreve o uso de chat ou assistente de voz para interagir com o sistema?",
      alternativas: {
        A: "Instrução",
        B: "Exploração",
        C: "Manipulação",
        D: "Conversação"
      },
      correta: "D",
      nivel: "Médio"
    },
    {
      id: "ds_19",
      aula: "Aula 10 - Design de Interfaces e Prototipação",
      texto: "Qual é a ordem correta do processo de desenvolvimento segundo a ideia central da aula?",
      alternativas: {
        A: "Prototipa → Modela → Implementa",
        B: "Implementa → Modela → Prototipa",
        C: "Modela → Prototipa → Implementa",
        D: "Prototipa → Implementa → Modela"
      },
      correta: "C",
      nivel: "Difícil"
    },
    {
      id: "ds_20",
      aula: "Aula 10 - Design de Interfaces e Prototipação",
      texto: "Qual a diferença entre protótipo vertical e horizontal?",
      alternativas: {
        A: "Vertical cobre muitas funções; horizontal aprofunda poucas",
        B: "Horizontal cobre muitas funções com pouco detalhe; vertical aprofunda menos funções com muito detalhe",
        C: "Ambos cobrem as mesmas funções, mas com fidelidades diferentes",
        D: "Vertical é sempre de alta fidelidade; horizontal é sempre de baixa fidelidade"
      },
      correta: "B",
      nivel: "Difícil"
    },
    {
      id: "ds_21",
      aula: "Aula 11 - Design Responsivo",
      texto: "O que é design responsivo?",
      alternativas: {
        A: "Um framework de desenvolvimento back-end",
        B: "A capacidade de um site se adaptar a diferentes tamanhos de tela",
        C: "Uma técnica de compressão de imagens",
        D: "Um padrão de cores para interfaces mobile"
      },
      correta: "B",
      nivel: "Fácil"
    },
    {
      id: "ds_22",
      aula: "Aula 11 - Design Responsivo",
      texto: "Qual tecnologia CSS permite aplicar estilos diferentes conforme o tamanho da tela?",
      alternativas: {
        A: "Flexbox",
        B: "Viewport",
        C: "Media Queries",
        D: "Bootstrap"
      },
      correta: "C",
      nivel: "Fácil"
    },
    {
      id: "ds_23",
      aula: "Aula 11 - Design Responsivo",
      texto: "Qual é a principal vantagem da metodologia Mobile First?",
      alternativas: {
        A: "Prioriza funcionalidades avançadas para desktop",
        B: "Foca no essencial e resulta em interface mais limpa",
        C: "Reduz a quantidade de media queries necessárias",
        D: "Aumenta a resolução de imagens no mobile"
      },
      correta: "B",
      nivel: "Fácil"
    },
    {
      id: "ds_24",
      aula: "Aula 11 - Design Responsivo",
      texto: "No layout fluido, qual tipo de medida é utilizado ao invés de pixels?",
      alternativas: {
        A: "Centímetros (cm)",
        B: "Pontos (pt)",
        C: "Medidas relativas como porcentagem (%)",
        D: "Milímetros (mm)"
      },
      correta: "C",
      nivel: "Fácil"
    },
    {
      id: "ds_25",
      aula: "Aula 11 - Design Responsivo",
      texto: "Qual breakpoint é comumente associado ao tamanho de tablets?",
      alternativas: {
        A: "480px",
        B: "768px",
        C: "1280px",
        D: "320px"
      },
      correta: "B",
      nivel: "Médio"
    },
    {
      id: "ds_26",
      aula: "Aula 11 - Design Responsivo",
      texto: "Qual é a função da meta tag viewport no design responsivo?",
      alternativas: {
        A: "Definir a paleta de cores da página",
        B: "Controlar zoom e escala da página em dispositivos móveis",
        C: "Carregar fontes externas no mobile",
        D: "Habilitar o modo escuro automaticamente"
      },
      correta: "B",
      nivel: "Médio"
    },
    {
      id: "ds_27",
      aula: "Aula 11 - Design Responsivo",
      texto: "Na metodologia Mobile First, qual propriedade de media query é usada para expandir o layout?",
      alternativas: {
        A: "max-width",
        B: "screen-size",
        C: "min-width",
        D: "max-height"
      },
      correta: "C",
      nivel: "Médio"
    },
    {
      id: "ds_28",
      aula: "Aula 11 - Design Responsivo",
      texto: "O que são breakpoints no design responsivo?",
      alternativas: {
        A: "Erros de layout identificados durante os testes",
        B: "Pontos onde o layout muda conforme o tamanho da tela",
        C: "Limites de largura máxima para imagens",
        D: "Pausas no carregamento da página"
      },
      correta: "B",
      nivel: "Médio"
    },
    {
      id: "ds_29",
      aula: "Aula 11 - Design Responsivo",
      texto: "Por que a ordem das media queries importa no CSS?",
      alternativas: {
        A: "Media queries fora de ordem aumentam o tempo de carregamento",
        B: "O navegador ignora media queries fora de sequência",
        C: "A última regra declarada pode sobrescrever as anteriores",
        D: "Media queries só funcionam em ordem decrescente de tamanho"
      },
      correta: "C",
      nivel: "Difícil"
    },
    {
      id: "ds_30",
      aula: "Aula 11 - Design Responsivo",
      texto: "O design responsivo vai além de redimensionar o site. O que ele envolve de fato?",
      alternativas: {
        A: "Apenas escalar proporcionalmente os elementos da página",
        B: "Reorganizar, adaptar e otimizar a interface para cada tipo de dispositivo",
        C: "Criar versões separadas do site para cada resolução",
        D: "Remover funcionalidades para dispositivos menores"
      },
      correta: "B",
      nivel: "Difícil"
    },
    ],


    banco_dados: [
      {
        id: "bd_01",
        aula: "Aula 9 - Definindo um Banco de Dados",
        texto: "Qual subconjunto da SQL é responsável por criar, modificar e remover estruturas em um banco de dados?",
        alternativas: {
          A: "DML",
          B: "DCL",
          C: "DDL",
          D: "DQL"
        },
        correta: "C",
        nivel: "Fácil"
      },
      {
        id: "bd_02",
        aula: "Aula 9 - Definindo um Banco de Dados",
        texto: "Qual comando SQL é utilizado para criar uma nova tabela em um banco de dados?",
        alternativas: {
          A: "ALTER TABLE",
          B: "CREATE TABLE",
          C: "DROP TABLE",
          D: "INSERT TABLE"
        },
        correta: "B",
        nivel: "Fácil"
      },
      {
        id: "bd_03",
        aula: "Aula 9 - Definindo um Banco de Dados",
        texto: "O tipo de dado VARCHAR(n) em SQL armazena qual tipo de informação?",
        alternativas: {
          A: "Número inteiro",
          B: "Data",
          C: "Texto de tamanho fixo",
          D: "Texto de tamanho variável"
        },
        correta: "D",
        nivel: "Fácil"
      },
      {
        id: "bd_04",
        aula: "Aula 9 - Definindo um Banco de Dados",
        texto: "O que é um esquema (schema) em um banco de dados relacional?",
        alternativas: {
          A: "Um arquivo de backup do banco",
          B: "Conjunto de objetos como tabelas, views e restrições",
          C: "Um tipo especial de índice",
          D: "O conjunto de todos os catálogos"
        },
        correta: "B",
        nivel: "Fácil"
      },
      {
        id: "bd_05",
        aula: "Aula 9 - Definindo um Banco de Dados",
        texto: "Qual a diferença entre DROP TABLE e DELETE em SQL?",
        alternativas: {
          A: "DROP TABLE remove apenas os dados; DELETE remove a estrutura",
          B: "Ambos removem apenas os dados da tabela",
          C: "DROP TABLE remove estrutura e dados; DELETE remove apenas os dados",
          D: "Ambos removem a estrutura e os dados"
        },
        correta: "C",
        nivel: "Médio"
      },
      {
        id: "bd_06",
        aula: "Aula 9 - Definindo um Banco de Dados",
        texto: "Qual cláusula impede a exclusão de uma estrutura caso ela possua dependências?",
        alternativas: {
          A: "CASCADE",
          B: "RESTRICT",
          C: "NOT NULL",
          D: "UNIQUE"
        },
        correta: "B",
        nivel: "Médio"
      },
      {
        id: "bd_07",
        aula: "Aula 9 - Definindo um Banco de Dados",
        texto: "Ao adicionar uma nova coluna a uma tabela existente com ALTER TABLE, qual valor ela recebe por padrão?",
        alternativas: {
          A: "Zero",
          B: "Vazio",
          C: "NULL",
          D: "Um valor aleatório"
        },
        correta: "C",
        nivel: "Médio"
      },
      {
        id: "bd_08",
        aula: "Aula 9 - Definindo um Banco de Dados",
        texto: "Qual é a função da FOREIGN KEY em uma tabela SQL?",
        alternativas: {
          A: "Identificar unicamente cada registro da tabela",
          B: "Impedir valores nulos em uma coluna",
          C: "Criar relacionamento entre duas tabelas",
          D: "Definir o tipo de dado de uma coluna"
        },
        correta: "C",
        nivel: "Médio"
      },
      {
        id: "bd_09",
        aula: "Aula 9 - Definindo um Banco de Dados",
        texto: "Em um banco de dados relacional, o que o INFORMATION_SCHEMA armazena?",
        alternativas: {
          A: "Os dados dos usuários cadastrados",
          B: "Metadados e informações sobre as estruturas do banco",
          C: "Backups automáticos das tabelas",
          D: "Logs de transações realizadas"
        },
        correta: "B",
        nivel: "Difícil"
      },
      {
        id: "bd_10",
        aula: "Aula 9 - Definindo um Banco de Dados",
        texto: "Qual das opções representa corretamente a hierarquia de organização em um banco de dados relacional?",
        alternativas: {
          A: "Tabela → Catálogo → Esquema",
          B: "Catálogo → Esquema → Tabela",
          C: "Esquema → Catálogo → Tabela",
          D: "Tabela → Esquema → Catálogo"
        },
        correta: "B",
        nivel: "Difícil"
      },
      {
        id: "bd_11",
        aula: "Aula 10 - Manipulando um Banco de Dados",
        texto: "Qual comando SQL é utilizado para inserir novos registros em uma tabela?",
        alternativas: {
          A: "UPDATE",
          B: "SELECT",
          C: "INSERT INTO",
          D: "ADD INTO"
        },
        correta: "C",
        nivel: "Fácil"
      },
      {
        id: "bd_12",
        aula: "Aula 10 - Manipulando um Banco de Dados",
        texto: "O que acontece ao executar um DELETE sem a cláusula WHERE?",
        alternativas: {
          A: "Retorna um erro de sintaxe",
          B: "Exclui apenas o primeiro registro",
          C: "Não executa nenhuma ação",
          D: "Apaga todos os registros da tabela"
        },
        correta: "D",
        nivel: "Fácil"
      },
      {
        id: "bd_13",
        aula: "Aula 10 - Manipulando um Banco de Dados",
        texto: "Qual comando é responsável por atualizar dados existentes em uma tabela?",
        alternativas: {
          A: "INSERT",
          B: "MODIFY",
          C: "UPDATE",
          D: "CHANGE"
        },
        correta: "C",
        nivel: "Fácil"
      },
      {
        id: "bd_14",
        aula: "Aula 10 - Manipulando um Banco de Dados",
        texto: "O que a cláusula DISTINCT faz em uma consulta SQL?",
        alternativas: {
          A: "Ordena os resultados em ordem crescente",
          B: "Remove registros duplicados do resultado",
          C: "Filtra resultados por uma condição",
          D: "Conta o número de registros"
        },
        correta: "B",
        nivel: "Fácil"
      },
      {
        id: "bd_15",
        aula: "Aula 10 - Manipulando um Banco de Dados",
        texto: "Qual operador lógico exige que todas as condições sejam verdadeiras para retornar um resultado?",
        alternativas: {
          A: "OR",
          B: "NOT",
          C: "AND",
          D: "IN"
        },
        correta: "C",
        nivel: "Médio"
      },
      {
        id: "bd_16",
        aula: "Aula 10 - Manipulando um Banco de Dados",
        texto: "O que a expressão 12 * (salario + 500) calcula em uma consulta SQL?",
        alternativas: {
          A: "O salário multiplicado por 12, somado a 500",
          B: "O salário anual considerando um bônus mensal de 500",
          C: "O valor de 500 somado ao salário e multiplicado por 1",
          D: "A média salarial anual sem bônus"
        },
        correta: "B",
        nivel: "Médio"
      },
      {
        id: "bd_17",
        aula: "Aula 10 - Manipulando um Banco de Dados",
        texto: "Na DML não procedural, o usuário precisa especificar:",
        alternativas: {
          A: "O que quer e como obter",
          B: "Apenas como obter os dados",
          C: "Apenas o que quer",
          D: "O tipo de dado e a estrutura"
        },
        correta: "C",
        nivel: "Médio"
      },
      {
        id: "bd_18",
        aula: "Aula 10 - Manipulando um Banco de Dados",
        texto: "Qual operador de comparação representa 'diferente de' em SQL?",
        alternativas: {
          A: "!=!",
          B: ">>",
          C: "<>",
          D: "=/="
        },
        correta: "C",
        nivel: "Médio"
      },
      {
        id: "bd_19",
        aula: "Aula 10 - Manipulando um Banco de Dados",
        texto: "Qual é a ordem correta das partes em uma instrução UPDATE com condição?",
        alternativas: {
          A: "SET → UPDATE → WHERE",
          B: "UPDATE → WHERE → SET",
          C: "WHERE → SET → UPDATE",
          D: "UPDATE → SET → WHERE"
        },
        correta: "D",
        nivel: "Difícil"
      },
      {
        id: "bd_20",
        aula: "Aula 10 - Manipulando um Banco de Dados",
        texto: "Ao usar INSERT INTO com especificação de colunas, o que é obrigatório respeitar?",
        alternativas: {
          A: "Os valores devem estar em ordem alfabética",
          B: "A ordem e o tipo dos valores devem corresponder às colunas especificadas",
          C: "Todos os campos da tabela devem ser informados",
          D: "Os valores numéricos devem vir antes dos textuais"
        },
        correta: "B",
        nivel: "Difícil"
      },
      {
        id: "bd_21",
        aula: "Aula 11 - Refinando Consultas em um Banco de Dados",
        texto: "Qual operador SQL é usado para buscar padrões em campos de texto?",
        alternativas: {
          A: "BETWEEN",
          B: "IN",
          C: "LIKE",
          D: "IS NULL"
        },
        correta: "C",
        nivel: "Fácil"
      },
      {
        id: "bd_22",
        aula: "Aula 11 - Refinando Consultas em um Banco de Dados",
        texto: "O que o símbolo % representa no operador LIKE?",
        alternativas: {
          A: "Exatamente um caractere",
          B: "Qualquer sequência de caracteres",
          C: "Um número qualquer",
          D: "Um espaço em branco"
        },
        correta: "B",
        nivel: "Fácil"
      },
      {
        id: "bd_23",
        aula: "Aula 11 - Refinando Consultas em um Banco de Dados",
        texto: "Qual função de agregação retorna a quantidade de registros em uma tabela?",
        alternativas: {
          A: "SUM",
          B: "AVG",
          C: "MAX",
          D: "COUNT"
        },
        correta: "D",
        nivel: "Fácil"
      },
      {
        id: "bd_24",
        aula: "Aula 11 - Refinando Consultas em um Banco de Dados",
        texto: "Qual cláusula é usada para ordenar os resultados de uma consulta SQL?",
        alternativas: {
          A: "GROUP BY",
          B: "ORDER BY",
          C: "SORT BY",
          D: "ARRANGE BY"
        },
        correta: "B",
        nivel: "Fácil"
      },
      {
        id: "bd_25",
        aula: "Aula 11 - Refinando Consultas em um Banco de Dados",
        texto: "O operador BETWEEN 'valor1' AND 'valor2' é equivalente a qual condição?",
        alternativas: {
          A: "campo > valor1 AND campo < valor2",
          B: "campo >= valor1 AND campo <= valor2",
          C: "campo = valor1 OR campo = valor2",
          D: "campo >= valor1 OR campo <= valor2"
        },
        correta: "B",
        nivel: "Médio"
      },
      {
        id: "bd_26",
        aula: "Aula 11 - Refinando Consultas em um Banco de Dados",
        texto: "Qual é a ordem real de execução de uma consulta SQL com WHERE e SELECT?",
        alternativas: {
          A: "SELECT → FROM → WHERE",
          B: "WHERE → SELECT → FROM",
          C: "FROM → WHERE → SELECT",
          D: "FROM → SELECT → WHERE"
        },
        correta: "C",
        nivel: "Médio"
      },
      {
        id: "bd_27",
        aula: "Aula 11 - Refinando Consultas em um Banco de Dados",
        texto: "Ao usar GROUP BY, quais campos podem aparecer no SELECT?",
        alternativas: {
          A: "Qualquer campo da tabela",
          B: "Apenas campos que estejam no GROUP BY ou dentro de funções agregadas",
          C: "Apenas campos numéricos",
          D: "Apenas campos que não estejam no GROUP BY"
        },
        correta: "B",
        nivel: "Médio"
      },
      {
        id: "bd_28",
        aula: "Aula 11 - Refinando Consultas em um Banco de Dados",
        texto: "O que o operador IS NULL verifica em uma consulta SQL?",
        alternativas: {
          A: "Se o campo contém o valor zero",
          B: "Se o campo contém uma string vazia",
          C: "Se o campo não possui nenhum valor",
          D: "Se o campo possui valor duplicado"
        },
        correta: "C",
        nivel: "Médio"
      },
      {
        id: "bd_29",
        aula: "Aula 11 - Refinando Consultas em um Banco de Dados",
        texto: "Uma comparação direta com NULL em SQL retorna qual resultado?",
        alternativas: {
          A: "TRUE",
          B: "FALSE",
          C: "UNKNOWN",
          D: "ERROR"
        },
        correta: "C",
        nivel: "Difícil"
      },
      {
        id: "bd_30",
        aula: "Aula 11 - Refinando Consultas em um Banco de Dados",
        texto: "Qual consulta retorna corretamente a média de créditos agrupada por curso?",
        alternativas: {
          A: "SELECT AVG(credito) FROM alunos WHERE cod_curso;",
          B: "SELECT cod_curso, AVG(credito) FROM alunos GROUP BY cod_curso;",
          C: "SELECT cod_curso, AVG(credito) FROM alunos ORDER BY cod_curso;",
          D: "SELECT AVG(credito), cod_curso FROM alunos HAVING cod_curso;"
        },
        correta: "B",
        nivel: "Difícil"
      },

      ],

  },

};