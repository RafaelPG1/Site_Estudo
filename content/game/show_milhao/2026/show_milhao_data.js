/* ═══════════════════════════════════════════════════
   show_milhao_data.js — Perguntas do Show do Milhão
   Organizado por semestre → disciplina

   IMPORTANTE: exporta `SHOW_MILHAO_DATA` (objeto nomeado)
   pois o show_milhao.js acessa via:
     modulo.SHOW_MILHAO_DATA?.[sem]?.[disc]
═══════════════════════════════════════════════════ */

export const SHOW_MILHAO_DATA = {

  '2026.2': {

    poo: [

      // ─────────────────────────────────────────────────────────
      // POO — Programação Orientada a Objetos ☕
      // ─────────────────────────────────────────────────────────

      {
        id: 'poo_001',
        texto: 'O que é encapsulamento em POO?',
        alternativas: {
          A: 'Herdar atributos de outra classe',
          B: 'Ocultar detalhes internos e expor apenas o necessário',
          C: 'Criar múltiplas instâncias de uma classe',
          D: 'Definir métodos abstratos',
        },
        correta: 'B',
        nivel: 'Fácil',
      },
      {
        id: 'poo_002',
        texto: 'Qual palavra-chave em Java é usada para herança?',
        alternativas: {
          A: 'implements',
          B: 'extends',
          C: 'inherits',
          D: 'super',
        },
        correta: 'B',
        nivel: 'Fácil',
      },
      {
        id: 'poo_003',
        texto: 'O que é polimorfismo?',
        alternativas: {
          A: 'Capacidade de um objeto assumir várias formas',
          B: 'Processo de ocultar dados',
          C: 'Criação de interfaces gráficas',
          D: 'Uso de múltiplos construtores',
        },
        correta: 'A',
        nivel: 'Médio',
      },
      {
        id: 'poo_004',
        texto: 'Qual é a diferença entre classe abstrata e interface em Java?',
        alternativas: {
          A: 'Não há diferença',
          B: 'Interface pode ter atributos; classe abstrata não',
          C: 'Classe abstrata pode ter implementação; interface (pré-Java 8) só assinaturas',
          D: 'Interface só pode ser usada com herança múltipla',
        },
        correta: 'C',
        nivel: 'Difícil',
      },
      {
        id: 'poo_005',
        texto: 'O que é um construtor em POO?',
        alternativas: {
          A: 'Método chamado ao destruir um objeto',
          B: 'Método especial chamado na criação de um objeto',
          C: 'Atributo estático da classe',
          D: 'Interface de inicialização',
        },
        correta: 'B',
        nivel: 'Fácil',
      },
      {
        id: 'poo_006',
        texto: "O que significa 'static' em um método Java?",
        alternativas: {
          A: 'O método não pode ser sobrescrito',
          B: 'O método pertence à instância',
          C: 'O método pertence à classe, não à instância',
          D: 'O método é privado',
        },
        correta: 'C',
        nivel: 'Médio',
      },
      {
        id: 'poo_007',
        texto: 'Qual princípio SOLID define que uma classe deve ter apenas uma razão para mudar?',
        alternativas: {
          A: 'Open/Closed Principle',
          B: 'Single Responsibility Principle',
          C: 'Liskov Substitution Principle',
          D: 'Interface Segregation Principle',
        },
        correta: 'B',
        nivel: 'Médio',
      },
      {
        id: 'poo_008',
        texto: 'Em Java, todas as classes herdam implicitamente de qual classe?',
        alternativas: {
          A: 'Class',
          B: 'Base',
          C: 'Object',
          D: 'Root',
        },
        correta: 'C',
        nivel: 'Médio',
      },
      {
        id: 'poo_009',
        texto: 'O que é sobrecarga (overloading) de métodos?',
        alternativas: {
          A: 'Reescrever um método herdado na subclasse',
          B: 'Definir vários métodos com o mesmo nome e parâmetros diferentes na mesma classe',
          C: 'Chamar o método da superclasse',
          D: 'Criar um método com retorno void',
        },
        correta: 'B',
        nivel: 'Médio',
      },
      {
        id: 'poo_010',
        texto: 'Qual modificador de acesso em Java torna um atributo visível apenas dentro da própria classe?',
        alternativas: {
          A: 'public',
          B: 'protected',
          C: 'default',
          D: 'private',
        },
        correta: 'D',
        nivel: 'Fácil',
      },
    ],

    redes: [

      // ─────────────────────────────────────────────────────────
      // REDES — Redes de Computadores I 🌐
      // ─────────────────────────────────────────────────────────

      {
        id: 'redes_001',
        texto: 'Qual camada do modelo OSI é responsável pelo endereçamento IP?',
        alternativas: { A: 'Enlace', B: 'Transporte', C: 'Rede', D: 'Sessão' },
        correta: 'C',
        nivel: 'Médio',
      },
      {
        id: 'redes_002',
        texto: 'O protocolo TCP difere do UDP principalmente por:',
        alternativas: {
          A: 'Usar endereços IP diferentes',
          B: 'Garantir entrega ordenada e confiável dos pacotes',
          C: 'Funcionar apenas em redes locais',
          D: 'Não usar portas',
        },
        correta: 'B',
        nivel: 'Médio',
      },
      {
        id: 'redes_003',
        texto: 'Qual é a função do protocolo DNS?',
        alternativas: {
          A: 'Criptografar dados na rede',
          B: 'Atribuir endereços IP automaticamente',
          C: 'Traduzir nomes de domínio em endereços IP',
          D: 'Rotear pacotes entre redes',
        },
        correta: 'C',
        nivel: 'Fácil',
      },
      {
        id: 'redes_004',
        texto: 'Quantos bits compõem um endereço IPv4?',
        alternativas: { A: '64', B: '128', C: '16', D: '32' },
        correta: 'D',
        nivel: 'Fácil',
      },
      {
        id: 'redes_005',
        texto: 'O modelo TCP/IP possui quantas camadas?',
        alternativas: { A: '7', B: '5', C: '4', D: '3' },
        correta: 'C',
        nivel: 'Médio',
      },
      {
        id: 'redes_006',
        texto: 'Qual protocolo é usado para envio de e-mails?',
        alternativas: { A: 'FTP', B: 'HTTP', C: 'SMTP', D: 'IMAP' },
        correta: 'C',
        nivel: 'Médio',
      },
      {
        id: 'redes_007',
        texto: 'O que é uma sub-rede (subnet)?',
        alternativas: {
          A: 'Uma rede física separada',
          B: 'Divisão lógica de uma rede IP em segmentos menores',
          C: 'Protocolo de roteamento',
          D: 'Tipo de cabeamento',
        },
        correta: 'B',
        nivel: 'Difícil',
      },
      {
        id: 'redes_008',
        texto: 'Qual dispositivo opera na camada de rede e encaminha pacotes entre redes diferentes?',
        alternativas: { A: 'Switch', B: 'Hub', C: 'Roteador', D: 'Repetidor' },
        correta: 'C',
        nivel: 'Fácil',
      },
      {
        id: 'redes_009',
        texto: 'O protocolo DHCP serve para:',
        alternativas: {
          A: 'Resolver nomes de domínio',
          B: 'Atribuir endereços IP automaticamente aos dispositivos',
          C: 'Transferir arquivos',
          D: 'Monitorar o tráfego de rede',
        },
        correta: 'B',
        nivel: 'Médio',
      },
      {
        id: 'redes_010',
        texto: 'Qual porta padrão o protocolo HTTPS utiliza?',
        alternativas: { A: '80', B: '21', C: '443', D: '8080' },
        correta: 'C',
        nivel: 'Médio',
      },
    ],

    design: [

      // ─────────────────────────────────────────────────────────
      // DESIGN — Design de Sistemas de Informação 🎨
      // ─────────────────────────────────────────────────────────

      {
        id: 'design_001',
        texto: 'O que é um diagrama de casos de uso na UML?',
        alternativas: {
          A: 'Representa a estrutura de banco de dados',
          B: 'Descreve as interações entre atores e o sistema',
          C: 'Mostra o fluxo de dados interno',
          D: 'Define as classes e atributos do sistema',
        },
        correta: 'B',
        nivel: 'Fácil',
      },
      {
        id: 'design_002',
        texto: 'O que significa UML?',
        alternativas: {
          A: 'Unified Modeling Language',
          B: 'Universal Model Library',
          C: 'Unique Method Language',
          D: 'Unified Management Layer',
        },
        correta: 'A',
        nivel: 'Fácil',
      },
      {
        id: 'design_003',
        texto: 'Qual diagrama UML representa o comportamento de um objeto ao longo do tempo?',
        alternativas: {
          A: 'Diagrama de Classes',
          B: 'Diagrama de Sequência',
          C: 'Diagrama de Estados',
          D: 'Diagrama de Componentes',
        },
        correta: 'C',
        nivel: 'Médio',
      },
      {
        id: 'design_004',
        texto: 'O que é prototipagem no design de sistemas?',
        alternativas: {
          A: 'Fase de testes automatizados',
          B: 'Criação de versões preliminares para validação com usuários',
          C: 'Documentação final do sistema',
          D: 'Deploy em produção',
        },
        correta: 'B',
        nivel: 'Médio',
      },
      {
        id: 'design_005',
        texto: 'Em qual notação é comum representar processos, fluxos e armazenamentos de dados?',
        alternativas: {
          A: 'UML',
          B: 'DFD (Diagrama de Fluxo de Dados)',
          C: 'ER',
          D: 'BPMN',
        },
        correta: 'B',
        nivel: 'Médio',
      },
      {
        id: 'design_006',
        texto: "O princípio de 'coesão alta' em design de sistemas significa:",
        alternativas: {
          A: 'Módulos com muitas responsabilidades diferentes',
          B: 'Módulos com responsabilidades bem definidas e relacionadas',
          C: 'Alta dependência entre módulos',
          D: 'Uso intenso de herança',
        },
        correta: 'B',
        nivel: 'Difícil',
      },
      {
        id: 'design_007',
        texto: 'O que é um wireframe?',
        alternativas: {
          A: 'Código-fonte da interface',
          B: 'Esboço estrutural de baixa fidelidade de uma tela',
          C: 'Banco de dados relacional',
          D: 'Diagrama de sequência',
        },
        correta: 'B',
        nivel: 'Fácil',
      },
      {
        id: 'design_008',
        texto: 'Qual é o objetivo principal da análise de requisitos?',
        alternativas: {
          A: 'Testar o sistema em produção',
          B: 'Entender e documentar o que o sistema deve fazer',
          C: 'Otimizar o banco de dados',
          D: 'Criar o diagrama de classes',
        },
        correta: 'B',
        nivel: 'Fácil',
      },
      {
        id: 'design_009',
        texto: 'O padrão MVC separa a aplicação em:',
        alternativas: {
          A: 'Módulo, Variável e Código',
          B: 'Model, View e Controller',
          C: 'Memória, Visão e Controle',
          D: 'Master, Value e Class',
        },
        correta: 'B',
        nivel: 'Médio',
      },
      {
        id: 'design_010',
        texto: 'O que é acoplamento baixo (low coupling) em design de software?',
        alternativas: {
          A: 'Módulos muito dependentes entre si',
          B: 'Ausência de módulos no sistema',
          C: 'Módulos independentes com poucas dependências entre si',
          D: 'Uso exclusivo de interfaces',
        },
        correta: 'C',
        nivel: 'Difícil',
      },
    ],

    banco_dados: [

      // ─────────────────────────────────────────────────────────
      // BANCO DE DADOS — Fundamentos de Banco de Dados 🗄️
      // ─────────────────────────────────────────────────────────

      {
        id: 'bd_001',
        texto: 'O que é uma chave primária em um banco de dados relacional?',
        alternativas: {
          A: 'Atributo que referencia outra tabela',
          B: 'Identificador único de cada registro em uma tabela',
          C: 'Campo obrigatoriamente numérico',
          D: 'Índice de busca secundário',
        },
        correta: 'B',
        nivel: 'Fácil',
      },
      {
        id: 'bd_002',
        texto: 'Qual comando SQL é usado para consultar dados em uma tabela?',
        alternativas: { A: 'INSERT', B: 'UPDATE', C: 'SELECT', D: 'DELETE' },
        correta: 'C',
        nivel: 'Fácil',
      },
      {
        id: 'bd_003',
        texto: 'O que significa a sigla SGBD?',
        alternativas: {
          A: 'Sistema de Gerenciamento de Banco de Dados',
          B: 'Serviço Geral de Busca de Dados',
          C: 'Subgrupo de Gerência em Banco Distribuído',
          D: 'Sistema Global de Base de Dados',
        },
        correta: 'A',
        nivel: 'Fácil',
      },
      {
        id: 'bd_004',
        texto: 'O que é normalização de banco de dados?',
        alternativas: {
          A: 'Processo de aumentar a redundância dos dados',
          B: 'Técnica para organizar dados e eliminar redundâncias',
          C: 'Criação de índices em todas as colunas',
          D: 'Backup automático dos dados',
        },
        correta: 'B',
        nivel: 'Médio',
      },
      {
        id: 'bd_005',
        texto: 'Qual propriedade ACID garante que uma transação seja concluída totalmente ou desfeita?',
        alternativas: { A: 'Consistência', B: 'Isolamento', C: 'Durabilidade', D: 'Atomicidade' },
        correta: 'D',
        nivel: 'Difícil',
      },
      {
        id: 'bd_006',
        texto: 'O que é uma chave estrangeira (Foreign Key)?',
        alternativas: {
          A: 'Atributo que identifica unicamente um registro',
          B: 'Campo que referencia a chave primária de outra tabela',
          C: 'Índice de texto completo',
          D: 'Restrição de valor único',
        },
        correta: 'B',
        nivel: 'Médio',
      },
      {
        id: 'bd_007',
        texto: 'Qual cláusula SQL é usada para filtrar registros?',
        alternativas: { A: 'ORDER BY', B: 'GROUP BY', C: 'HAVING', D: 'WHERE' },
        correta: 'D',
        nivel: 'Fácil',
      },
      {
        id: 'bd_008',
        texto: 'Em um modelo Entidade-Relacionamento, o que é uma entidade?',
        alternativas: {
          A: 'Uma coluna de uma tabela',
          B: 'Um objeto do mundo real com existência independente',
          C: 'Um relacionamento entre tabelas',
          D: 'Um tipo de índice',
        },
        correta: 'B',
        nivel: 'Médio',
      },
      {
        id: 'bd_009',
        texto: 'Qual comando SQL remove todos os registros de uma tabela sem apagar sua estrutura?',
        alternativas: { A: 'DROP TABLE', B: 'DELETE FROM', C: 'TRUNCATE', D: 'REMOVE' },
        correta: 'C',
        nivel: 'Médio',
      },
      {
        id: 'bd_010',
        texto: 'O que é um JOIN no SQL?',
        alternativas: {
          A: 'Inserir dados em uma tabela',
          B: 'Combinar registros de duas ou mais tabelas com base em uma condição',
          C: 'Criar um índice composto',
          D: 'Agrupar resultados por coluna',
        },
        correta: 'B',
        nivel: 'Médio',
      },
    ],

  },

};