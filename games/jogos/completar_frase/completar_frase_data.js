/* ============================================================
   NEXUS STUDY — completar_frase_data.js
   Questões organizadas por semestre e disciplina
   Disciplinas: POO, Redes, Design de Sistemas, Banco de Dados
   ============================================================ */

const DISCIPLINAS = {
  poo: {
    nome: 'Programação Orientada a Objetos',
    apelido: 'P.O.O.',
    emoji: '☕',
    cor: '#f59e0b',
    sigla: 'POO'
  },
  redes: {
    nome: 'Redes de Computadores',
    apelido: 'Redes',
    emoji: '🌐',
    cor: '#3b82f6',
    sigla: 'REDES'
  },
  design: {
    nome: 'Design de Sistemas de Informação',
    apelido: 'Design',
    emoji: '◈',
    cor: '#a855f7',
    sigla: 'DESIGN'
  },
  banco_dados: {
    nome: 'Fundamentos de Banco de Dados',
    apelido: 'Banco de Dados',
    emoji: '⬡',
    cor: '#10b981',
    sigla: 'BD'
  }
};

/* ─────────────────────────────────────────────────────────
   SEMESTRES disponíveis para filtro
───────────────────────────────────────────────────────── */
const SEMESTRES = {
  '1': '1º Semestre',
  '2': '2º Semestre',
  '3': '3º Semestre',
  '4': '4º Semestre',
};

/* ─────────────────────────────────────────────────────────
   BANCO DE QUESTÕES
   Cada questão possui:
     disciplina : chave de DISCIPLINAS
     semestre   : '1' | '2' | '3' | '4'
     nivel      : 'Fácil' | 'Médio' | 'Difícil'
     frase      : string com '______' como lacuna
     letras     : dica visual da quantidade de letras
     resposta   : string (normalização ignora acentos)
───────────────────────────────────────────────────────── */
const perguntas = [

  /* ══════════════════════════════════════════════
     POO — 1º Semestre: fundamentos
  ══════════════════════════════════════════════ */
  {
    disciplina: 'poo', semestre: '1', nivel: 'Fácil',
    frase: 'Em POO, o ______ é o molde que define a estrutura e o comportamento dos objetos.',
    letras: '[ 6 letras ]', resposta: 'classe'
  },
  {
    disciplina: 'poo', semestre: '1', nivel: 'Fácil',
    frase: 'Uma instância concreta criada a partir de uma classe é chamada de ______.',
    letras: '[ 6 letras ]', resposta: 'objeto'
  },
  {
    disciplina: 'poo', semestre: '1', nivel: 'Fácil',
    frase: 'O método especial invocado automaticamente ao criar um objeto é o ______.',
    letras: '[ 10 letras ]', resposta: 'construtor'
  },
  {
    disciplina: 'poo', semestre: '1', nivel: 'Fácil',
    frase: 'Em Java, a palavra-chave ______ referencia o objeto atual dentro de um método de instância.',
    letras: '[ 4 letras ]', resposta: 'this'
  },
  {
    disciplina: 'poo', semestre: '1', nivel: 'Médio',
    frase: 'O modificador de acesso ______ restringe a visibilidade de um membro à própria classe.',
    letras: '[ 7 letras ]', resposta: 'private'
  },
  {
    disciplina: 'poo', semestre: '1', nivel: 'Médio',
    frase: 'Métodos de acesso que leem e escrevem atributos privados são chamados de getters e ______.',
    letras: '[ 7 letras ]', resposta: 'setters'
  },
  {
    disciplina: 'poo', semestre: '1', nivel: 'Médio',
    frase: 'O modificador ______ permite acesso ao membro de qualquer classe ou pacote.',
    letras: '[ 6 letras ]', resposta: 'public'
  },
  {
    disciplina: 'poo', semestre: '1', nivel: 'Difícil',
    frase: 'Um atributo declarado com ______ pertence à classe e não a cada objeto individualmente.',
    letras: '[ 6 letras ]', resposta: 'static'
  },
  {
    disciplina: 'poo', semestre: '1', nivel: 'Difícil',
    frase: 'O tipo de dado que armazena um conjunto de constantes nomeadas em Java é o ______.',
    letras: '[ 4 letras ]', resposta: 'enum'
  },

  /* ══════════════════════════════════════════════
     POO — 2º Semestre: herança e polimorfismo
  ══════════════════════════════════════════════ */
  {
    disciplina: 'poo', semestre: '2', nivel: 'Fácil',
    frase: 'A capacidade de uma classe herdar atributos e métodos de outra classe é a ______.',
    letras: '[ 7 letras ]', resposta: 'heranca'
  },
  {
    disciplina: 'poo', semestre: '2', nivel: 'Fácil',
    frase: 'O princípio que oculta detalhes internos expondo somente a interface pública é o ______.',
    letras: '[ 14 letras ]', resposta: 'encapsulamento'
  },
  {
    disciplina: 'poo', semestre: '2', nivel: 'Médio',
    frase: 'A redefinição de um método da superclasse na subclasse é chamada de ______.',
    letras: '[ 11 letras ]', resposta: 'sobrescrita'
  },
  {
    disciplina: 'poo', semestre: '2', nivel: 'Médio',
    frase: 'Quando múltiplos métodos têm o mesmo nome mas assinaturas distintas, ocorre a ______.',
    letras: '[ 10 letras ]', resposta: 'sobrecarga'
  },
  {
    disciplina: 'poo', semestre: '2', nivel: 'Médio',
    frase: 'A capacidade de tratar objetos de subclasses como instâncias da superclasse é o ______.',
    letras: '[ 12 letras ]', resposta: 'polimorfismo'
  },
  {
    disciplina: 'poo', semestre: '2', nivel: 'Médio',
    frase: 'Em Java, a palavra-chave ______ é usada para invocar o construtor da superclasse.',
    letras: '[ 5 letras ]', resposta: 'super'
  },
  {
    disciplina: 'poo', semestre: '2', nivel: 'Difícil',
    frase: 'Uma classe que não pode ser instanciada diretamente é declarada com o modificador ______.',
    letras: '[ 8 letras ]', resposta: 'abstract'
  },
  {
    disciplina: 'poo', semestre: '2', nivel: 'Difícil',
    frase: 'Em Java, uma ______ define um contrato de métodos que as classes concretas devem implementar.',
    letras: '[ 9 letras ]', resposta: 'interface'
  },
  {
    disciplina: 'poo', semestre: '2', nivel: 'Difícil',
    frase: 'A palavra-chave ______ impede que um método seja sobrescrito por subclasses.',
    letras: '[ 5 letras ]', resposta: 'final'
  },

  /* ══════════════════════════════════════════════
     POO — 3º Semestre: padrões e boas práticas
  ══════════════════════════════════════════════ */
  {
    disciplina: 'poo', semestre: '3', nivel: 'Fácil',
    frase: 'A relação em que um objeto contém outros objetos como parte de sua estrutura é a ______.',
    letras: '[ 10 letras ]', resposta: 'composicao'
  },
  {
    disciplina: 'poo', semestre: '3', nivel: 'Médio',
    frase: 'O padrão de projeto que garante uma única instância global de uma classe é o ______.',
    letras: '[ 9 letras ]', resposta: 'singleton'
  },
  {
    disciplina: 'poo', semestre: '3', nivel: 'Médio',
    frase: 'O princípio SOLID que define que uma classe deve ter apenas uma razão para mudar é a Responsabilidade ______.',
    letras: '[ 5 letras ]', resposta: 'unica'
  },
  {
    disciplina: 'poo', semestre: '3', nivel: 'Médio',
    frase: 'O padrão criacional que delega a criação de objetos a subclasses é o ______.',
    letras: '[ 12 letras ]', resposta: 'factory method'
  },
  {
    disciplina: 'poo', semestre: '3', nivel: 'Difícil',
    frase: 'O padrão estrutural que adiciona comportamentos a objetos de forma dinâmica é o ______.',
    letras: '[ 9 letras ]', resposta: 'decorator'
  },
  {
    disciplina: 'poo', semestre: '3', nivel: 'Difícil',
    frase: 'O princípio SOLID que diz que módulos devem depender de abstrações, não de implementações, é a Inversão de ______.',
    letras: '[ 11 letras ]', resposta: 'dependencia'
  },

  /* ══════════════════════════════════════════════
     REDES — 1º Semestre: fundamentos
  ══════════════════════════════════════════════ */
  {
    disciplina: 'redes', semestre: '1', nivel: 'Fácil',
    frase: 'O modelo de referência que organiza a comunicação em sete camadas é o modelo ______.',
    letras: '[ 3 letras ]', resposta: 'osi'
  },
  {
    disciplina: 'redes', semestre: '1', nivel: 'Fácil',
    frase: 'O endereço lógico que identifica unicamente um dispositivo em uma rede é o endereço ______.',
    letras: '[ 2 letras ]', resposta: 'ip'
  },
  {
    disciplina: 'redes', semestre: '1', nivel: 'Fácil',
    frase: 'O dispositivo que conecta redes distintas e encaminha pacotes entre elas é o ______.',
    letras: '[ 8 letras ]', resposta: 'roteador'
  },
  {
    disciplina: 'redes', semestre: '1', nivel: 'Fácil',
    frase: 'O endereço físico gravado na interface de rede de cada dispositivo é o endereço ______.',
    letras: '[ 3 letras ]', resposta: 'mac'
  },
  {
    disciplina: 'redes', semestre: '1', nivel: 'Médio',
    frase: 'A unidade de dados transmitida na camada de enlace do modelo OSI é chamada de ______.',
    letras: '[ 6 letras ]', resposta: 'quadro'
  },
  {
    disciplina: 'redes', semestre: '1', nivel: 'Médio',
    frase: 'O protocolo responsável pela transferência de páginas web é o ______.',
    letras: '[ 4 letras ]', resposta: 'http'
  },
  {
    disciplina: 'redes', semestre: '1', nivel: 'Médio',
    frase: 'O protocolo que atribui automaticamente endereços IP aos dispositivos da rede é o ______.',
    letras: '[ 4 letras ]', resposta: 'dhcp'
  },
  {
    disciplina: 'redes', semestre: '1', nivel: 'Difícil',
    frase: 'A topologia em que todos os dispositivos se conectam a um nó central é a topologia ______.',
    letras: '[ 7 letras ]', resposta: 'estrela'
  },
  {
    disciplina: 'redes', semestre: '1', nivel: 'Difícil',
    frase: 'O campo do cabeçalho IP que limita o número máximo de saltos de um pacote é o ______.',
    letras: '[ 3 letras ]', resposta: 'ttl'
  },

  /* ══════════════════════════════════════════════
     REDES — 2º Semestre: protocolos e segurança
  ══════════════════════════════════════════════ */
  {
    disciplina: 'redes', semestre: '2', nivel: 'Fácil',
    frase: 'O protocolo orientado a conexão que garante entrega confiável e ordenada dos dados é o ______.',
    letras: '[ 3 letras ]', resposta: 'tcp'
  },
  {
    disciplina: 'redes', semestre: '2', nivel: 'Fácil',
    frase: 'O serviço que traduz nomes de domínio em endereços IP é o ______.',
    letras: '[ 3 letras ]', resposta: 'dns'
  },
  {
    disciplina: 'redes', semestre: '2', nivel: 'Médio',
    frase: 'O protocolo de transporte sem conexão, mais rápido mas sem garantia de entrega, é o ______.',
    letras: '[ 3 letras ]', resposta: 'udp'
  },
  {
    disciplina: 'redes', semestre: '2', nivel: 'Médio',
    frase: 'A técnica que divide uma rede em sub-redes menores usando uma máscara é o ______.',
    letras: '[ 10 letras ]', resposta: 'subnetting'
  },
  {
    disciplina: 'redes', semestre: '2', nivel: 'Médio',
    frase: 'A técnica que permite múltiplos dispositivos compartilharem um único IP público é o ______.',
    letras: '[ 3 letras ]', resposta: 'nat'
  },
  {
    disciplina: 'redes', semestre: '2', nivel: 'Difícil',
    frase: 'O protocolo seguro que adiciona criptografia TLS ao HTTP é o ______.',
    letras: '[ 5 letras ]', resposta: 'https'
  },
  {
    disciplina: 'redes', semestre: '2', nivel: 'Difícil',
    frase: 'O protocolo de roteamento que usa o algoritmo de estado de enlace é o ______.',
    letras: '[ 4 letras ]', resposta: 'ospf'
  },
  {
    disciplina: 'redes', semestre: '2', nivel: 'Difícil',
    frase: 'A camada do modelo OSI responsável pelo controle de erros e fluxo entre nós adjacentes é a camada de ______.',
    letras: '[ 6 letras ]', resposta: 'enlace'
  },

  /* ══════════════════════════════════════════════
     DESIGN — 1º Semestre: fundamentos de UX/UI
  ══════════════════════════════════════════════ */
  {
    disciplina: 'design', semestre: '1', nivel: 'Fácil',
    frase: 'A sigla UX representa a experiência do ______.',
    letras: '[ 7 letras ]', resposta: 'usuario'
  },
  {
    disciplina: 'design', semestre: '1', nivel: 'Fácil',
    frase: 'Uma representação esquemática de baixa fidelidade de uma interface é chamada de ______.',
    letras: '[ 9 letras ]', resposta: 'wireframe'
  },
  {
    disciplina: 'design', semestre: '1', nivel: 'Fácil',
    frase: 'O perfil semifictício que representa o usuário típico de um sistema é chamado de ______.',
    letras: '[ 7 letras ]', resposta: 'persona'
  },
  {
    disciplina: 'design', semestre: '1', nivel: 'Fácil',
    frase: 'Um modelo navegável e interativo que simula o comportamento real de uma interface é o ______.',
    letras: '[ 9 letras ]', resposta: 'prototipo'
  },
  {
    disciplina: 'design', semestre: '1', nivel: 'Médio',
    frase: 'A capacidade de uma interface ser utilizada por pessoas com diferentes necessidades é a ______.',
    letras: '[ 14 letras ]', resposta: 'acessibilidade'
  },
  {
    disciplina: 'design', semestre: '1', nivel: 'Médio',
    frase: 'O processo de avaliar um sistema observando usuários reais em tarefas é o teste de ______.',
    letras: '[ 11 letras ]', resposta: 'usabilidade'
  },
  {
    disciplina: 'design', semestre: '1', nivel: 'Médio',
    frase: 'O princípio gestáltico que tende a agrupar visualmente elementos próximos é o de ______.',
    letras: '[ 11 letras ]', resposta: 'proximidade'
  },
  {
    disciplina: 'design', semestre: '1', nivel: 'Difícil',
    frase: 'O critério internacional de acessibilidade para conteúdo web publicado pelo W3C é o ______.',
    letras: '[ 4 letras ]', resposta: 'wcag'
  },

  /* ══════════════════════════════════════════════
     DESIGN — 2º Semestre: metodologias e sistemas
  ══════════════════════════════════════════════ */
  {
    disciplina: 'design', semestre: '2', nivel: 'Fácil',
    frase: 'O método de inovação centrado no humano com etapas de empatia, definição e ideação é o ______.',
    letras: '[ 14 letras ]', resposta: 'design thinking'
  },
  {
    disciplina: 'design', semestre: '2', nivel: 'Médio',
    frase: 'O conjunto padronizado de componentes, cores e tipografia de uma interface compõe um ______ de design.',
    letras: '[ 7 letras ]', resposta: 'sistema'
  },
  {
    disciplina: 'design', semestre: '2', nivel: 'Médio',
    frase: 'A técnica que compara duas variações de uma interface com grupos distintos de usuários é o teste ______.',
    letras: '[ 3 letras ]', resposta: 'a/b'
  },
  {
    disciplina: 'design', semestre: '2', nivel: 'Médio',
    frase: 'A organização hierárquica do conteúdo de um sistema para facilitar a navegação é a ______ da informação.',
    letras: '[ 11 letras ]', resposta: 'arquitetura'
  },
  {
    disciplina: 'design', semestre: '2', nivel: 'Médio',
    frase: 'O mapeamento visual de todas as etapas percorridas pelo usuário em um sistema é o ______ de usuário.',
    letras: '[ 5 letras ]', resposta: 'fluxo'
  },
  {
    disciplina: 'design', semestre: '2', nivel: 'Difícil',
    frase: 'A avaliação de usabilidade conduzida por especialistas sem participação de usuários é a avaliação ______.',
    letras: '[ 10 letras ]', resposta: 'heuristica'
  },
  {
    disciplina: 'design', semestre: '2', nivel: 'Difícil',
    frase: 'As 10 heurísticas de usabilidade mais utilizadas foram propostas por Jakob ______.',
    letras: '[ 7 letras ]', resposta: 'nielsen'
  },

  /* ══════════════════════════════════════════════
     BANCO DE DADOS — 1º Semestre: fundamentos
  ══════════════════════════════════════════════ */
  {
    disciplina: 'banco_dados', semestre: '1', nivel: 'Fácil',
    frase: 'Em um banco relacional, os dados são organizados em estruturas chamadas ______.',
    letras: '[ 7 letras ]', resposta: 'tabelas'
  },
  {
    disciplina: 'banco_dados', semestre: '1', nivel: 'Fácil',
    frase: 'Cada linha de uma tabela relacional é chamada de ______ ou tupla.',
    letras: '[ 8 letras ]', resposta: 'registro'
  },
  {
    disciplina: 'banco_dados', semestre: '1', nivel: 'Fácil',
    frase: 'O comando SQL utilizado para recuperar dados de uma tabela é o ______.',
    letras: '[ 6 letras ]', resposta: 'select'
  },
  {
    disciplina: 'banco_dados', semestre: '1', nivel: 'Fácil',
    frase: 'A coluna que identifica unicamente cada registro em uma tabela é a chave ______.',
    letras: '[ 8 letras ]', resposta: 'primaria'
  },
  {
    disciplina: 'banco_dados', semestre: '1', nivel: 'Fácil',
    frase: 'O software responsável por gerenciar e controlar o acesso a um banco de dados é o ______.',
    letras: '[ 4 letras ]', resposta: 'sgbd'
  },
  {
    disciplina: 'banco_dados', semestre: '1', nivel: 'Médio',
    frase: 'A cláusula SQL usada para filtrar registros de acordo com uma condição é o ______.',
    letras: '[ 5 letras ]', resposta: 'where'
  },
  {
    disciplina: 'banco_dados', semestre: '1', nivel: 'Médio',
    frase: 'O diagrama que representa entidades, atributos e relacionamentos de um banco é o ______.',
    letras: '[ 3 letras ]', resposta: 'der'
  },
  {
    disciplina: 'banco_dados', semestre: '1', nivel: 'Médio',
    frase: 'A coluna que referencia a chave primária de outra tabela é chamada de chave ______.',
    letras: '[ 11 letras ]', resposta: 'estrangeira'
  },
  {
    disciplina: 'banco_dados', semestre: '1', nivel: 'Difícil',
    frase: 'O processo de estruturar tabelas para eliminar redundâncias e dependências indevidas é a ______.',
    letras: '[ 12 letras ]', resposta: 'normalizacao'
  },
  {
    disciplina: 'banco_dados', semestre: '1', nivel: 'Difícil',
    frase: 'A linguagem SQL usada para criar e alterar estruturas de tabelas é a ______.',
    letras: '[ 3 letras ]', resposta: 'ddl'
  },

  /* ══════════════════════════════════════════════
     BANCO DE DADOS — 2º Semestre: SQL avançado e ACID
  ══════════════════════════════════════════════ */
  {
    disciplina: 'banco_dados', semestre: '2', nivel: 'Fácil',
    frase: 'O comando SQL que combina registros de duas ou mais tabelas por um campo comum é o ______.',
    letras: '[ 4 letras ]', resposta: 'join'
  },
  {
    disciplina: 'banco_dados', semestre: '2', nivel: 'Médio',
    frase: 'A propriedade ACID que garante que uma transação é executada por completo ou desfeita totalmente é a ______.',
    letras: '[ 11 letras ]', resposta: 'atomicidade'
  },
  {
    disciplina: 'banco_dados', semestre: '2', nivel: 'Médio',
    frase: 'Um objeto de banco que executa automaticamente uma ação em resposta a um evento DML é o ______.',
    letras: '[ 7 letras ]', resposta: 'trigger'
  },
  {
    disciplina: 'banco_dados', semestre: '2', nivel: 'Médio',
    frase: 'Uma consulta SQL armazenada no banco que pode ser reutilizada como tabela virtual é a ______.',
    letras: '[ 4 letras ]', resposta: 'view'
  },
  {
    disciplina: 'banco_dados', semestre: '2', nivel: 'Médio',
    frase: 'A estrutura que acelera buscas em uma coluna evitando varredura completa da tabela é o ______.',
    letras: '[ 6 letras ]', resposta: 'indice'
  },
  {
    disciplina: 'banco_dados', semestre: '2', nivel: 'Difícil',
    frase: 'O bloco SQL que agrupa múltiplos comandos executados de forma atômica é a ______.',
    letras: '[ 10 letras ]', resposta: 'transacao'
  },
  {
    disciplina: 'banco_dados', semestre: '2', nivel: 'Difícil',
    frase: 'A propriedade ACID que garante que os dados permanecem corretos após uma transação é a ______.',
    letras: '[ 11 letras ]', resposta: 'consistencia'
  },
  {
    disciplina: 'banco_dados', semestre: '2', nivel: 'Difícil',
    frase: 'O conjunto de instruções armazenadas no banco que pode ser reutilizado como função é a ______.',
    letras: '[ 9 letras ]', resposta: 'procedure'
  }
];