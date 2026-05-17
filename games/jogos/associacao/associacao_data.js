/* ============================================================
   NEXUS STUDY — content/game/associacao/associacao_data.js

   ESTRUTURA:
   {
     [semestre]: {
       [discId]: {
         questao_1: [ { id, pergunta, resposta }, … ],  ← 4 pares
         questao_2: [ … ],
         …
         questao_6: [ … ],
       }
     }
   }

   REGRAS OBRIGATÓRIAS:
     • Cada disciplina deve ter EXATAMENTE 6 questões (questao_1 … questao_6).
     • Cada questão deve ter EXATAMENTE 4 pares.
     • Total por disciplina: 6 × 4 = 24 pares.
     • CONFIG.ITEMS_PER_ROUND = 6 → o loader achata as questões em um
       array de 24 pares e divide em 4 rodadas de 6 automaticamente.
     • Cada questao_X representa um bloco temático coeso; a divisão em
       rodadas de 6 é responsabilidade exclusiva do loader (carregarItens).
   ============================================================ */

export const ASSOCIACAO_DATA = {

  '2026.2': {

    /* ══════════════════════════════════════════════════════════
       POO — 6 questões × 4 pares = 24 pares
    ══════════════════════════════════════════════════════════ */
    poo: {

      /* Questão 1 — Classe e objeto */
      questao_1: [
        { id: 'poo_1a', pergunta: 'Classe',    resposta: 'Molde que define atributos e comportamentos dos objetos' },
        { id: 'poo_1b', pergunta: 'Objeto',    resposta: 'Instância concreta criada a partir de uma classe' },
        { id: 'poo_1c', pergunta: 'Atributo',  resposta: 'Variável que armazena o estado interno de um objeto' },
        { id: 'poo_1d', pergunta: 'Método',    resposta: 'Função definida dentro de uma classe que representa um comportamento' },
      ],

      /* Questão 2 — Construtores e referências */
      questao_2: [
        { id: 'poo_2a', pergunta: 'Construtor', resposta: 'Método especial invocado automaticamente ao criar um objeto' },
        { id: 'poo_2b', pergunta: 'this',       resposta: 'Referência ao objeto atual dentro de um método de instância' },
        { id: 'poo_2c', pergunta: 'new',        resposta: 'Operador que aloca memória e invoca o construtor da classe' },
        { id: 'poo_2d', pergunta: 'null',       resposta: 'Valor que indica ausência de referência a um objeto' },
      ],

      /* Questão 3 — Modificadores de acesso */
      questao_3: [
        { id: 'poo_3a', pergunta: 'private',   resposta: 'Modificador que restringe acesso à própria classe' },
        { id: 'poo_3b', pergunta: 'public',    resposta: 'Modificador que permite acesso de qualquer classe ou pacote' },
        { id: 'poo_3c', pergunta: 'protected', resposta: 'Modificador que permite acesso na classe e em suas subclasses' },
        { id: 'poo_3d', pergunta: 'static',    resposta: 'Membro que pertence à classe, compartilhado por todos os objetos' },
      ],

      /* Questão 4 — Pilares da POO */
      questao_4: [
        { id: 'poo_4a', pergunta: 'Encapsulamento', resposta: 'Princípio que oculta detalhes internos expondo só a interface pública' },
        { id: 'poo_4b', pergunta: 'Herança',        resposta: 'Capacidade de uma classe reutilizar atributos e métodos de outra' },
        { id: 'poo_4c', pergunta: 'Polimorfismo',   resposta: 'Capacidade de tratar objetos de subclasses como instâncias da superclasse' },
        { id: 'poo_4d', pergunta: 'Abstração',      resposta: 'Simplificação de entidades complexas expondo apenas o essencial' },
      ],

      /* Questão 5 — Classes especiais */
      questao_5: [
        { id: 'poo_5a', pergunta: 'abstract',   resposta: 'Classe que não pode ser instanciada; serve de base para subclasses' },
        { id: 'poo_5b', pergunta: 'interface',  resposta: 'Define contrato de métodos que as classes concretas devem implementar' },
        { id: 'poo_5c', pergunta: 'final',      resposta: 'Modificador que impede herança da classe ou sobrescrita do método' },
        { id: 'poo_5d', pergunta: 'super',      resposta: 'Referência à superclasse usada para acessar seus membros ou construtor' },
      ],

      /* Questão 6 — Avançado */
      questao_6: [
        { id: 'poo_6a', pergunta: 'Sobrescrita',  resposta: 'Redefinição de um método herdado com a mesma assinatura na subclasse' },
        { id: 'poo_6b', pergunta: 'Sobrecarga',   resposta: 'Criação de métodos com mesmo nome mas parâmetros diferentes na mesma classe' },
        { id: 'poo_6c', pergunta: 'Acoplamento',  resposta: 'Grau de dependência entre classes; deve ser mantido baixo' },
        { id: 'poo_6d', pergunta: 'Coesão',       resposta: 'Grau em que os membros de uma classe estão relacionados entre si; deve ser alto' },
      ],
    },

    /* ══════════════════════════════════════════════════════════
       DESIGN — 6 questões × 4 pares = 24 pares
    ══════════════════════════════════════════════════════════ */
    design: {

      /* Questão 1 — Fundamentos de UX/UI */
      questao_1: [
        { id: 'design_1a', pergunta: 'UX',             resposta: 'Disciplina focada em como o usuário interage e se sente ao usar o produto' },
        { id: 'design_1b', pergunta: 'UI',             resposta: 'Conjunto de elementos visuais e interativos com os quais o usuário opera' },
        { id: 'design_1c', pergunta: 'Usabilidade',    resposta: 'Facilidade com que o usuário consegue atingir seus objetivos no produto' },
        { id: 'design_1d', pergunta: 'Acessibilidade', resposta: 'Prática de projetar produtos utilizáveis por pessoas com diferentes habilidades' },
      ],

      /* Questão 2 — Pesquisa e personas */
      questao_2: [
        { id: 'design_2a', pergunta: 'Personas',        resposta: 'Representações fictícias de usuários típicos baseadas em pesquisa real' },
        { id: 'design_2b', pergunta: 'Mapa de empatia', resposta: 'Ferramenta que organiza o que o usuário pensa, sente, vê e ouve' },
        { id: 'design_2c', pergunta: 'Mapa de jornada', resposta: 'Representação visual da experiência completa do usuário com o produto' },
        { id: 'design_2d', pergunta: 'Entrevista',      resposta: 'Técnica de pesquisa qualitativa que coleta percepções diretamente do usuário' },
      ],

      /* Questão 3 — Prototipação */
      questao_3: [
        { id: 'design_3a', pergunta: 'Wireframe',       resposta: 'Esboço de baixa fidelidade da estrutura de uma tela sem cores ou detalhes' },
        { id: 'design_3b', pergunta: 'Protótipo',       resposta: 'Modelo interativo de alta fidelidade para testes antes do desenvolvimento' },
        { id: 'design_3c', pergunta: 'Mockup',          resposta: 'Representação estática de alta fidelidade com cores e tipografia reais' },
        { id: 'design_3d', pergunta: 'Fluxo de telas',  resposta: 'Diagrama que mostra as transições entre telas e as ações que as disparam' },
      ],

      /* Questão 4 — Princípios visuais */
      questao_4: [
        { id: 'design_4a', pergunta: 'Contraste',   resposta: 'Diferença visual entre elementos que cria hierarquia e destaque' },
        { id: 'design_4b', pergunta: 'Proximidade', resposta: 'Princípio Gestalt: elementos relacionados devem estar visualmente próximos' },
        { id: 'design_4c', pergunta: 'Alinhamento', resposta: 'Organização dos elementos em relação a um eixo comum para criar ordem' },
        { id: 'design_4d', pergunta: 'Repetição',   resposta: 'Uso consistente de padrões visuais para unificar a identidade do produto' },
      ],

      /* Questão 5 — Arquitetura e sistemas */
      questao_5: [
        { id: 'design_5a', pergunta: 'Arquitetura da informação', resposta: 'Organização hierárquica do conteúdo para facilitar a navegação do usuário' },
        { id: 'design_5b', pergunta: 'Sistema de design',         resposta: 'Conjunto de padrões visuais reutilizáveis que garante consistência no produto' },
        { id: 'design_5c', pergunta: 'Componente',                resposta: 'Elemento de interface reutilizável com comportamento e estilo definidos' },
        { id: 'design_5d', pergunta: 'Token de design',           resposta: 'Variável que armazena valores de estilo como cor, espaçamento e tipografia' },
      ],

      /* Questão 6 — Avaliação e testes */
      questao_6: [
        { id: 'design_6a', pergunta: 'Teste de usabilidade', resposta: 'Método que observa o usuário executando tarefas reais no produto' },
        { id: 'design_6b', pergunta: 'Avaliação heurística', resposta: 'Inspeção de usabilidade conduzida por especialistas sem participação de usuários' },
        { id: 'design_6c', pergunta: 'Taxa de conclusão',    resposta: 'Métrica que mede a proporção de usuários que completam uma tarefa com sucesso' },
        { id: 'design_6d', pergunta: 'NPS',                  resposta: 'Índice de satisfação baseado na probabilidade de o usuário recomendar o produto' },
      ],
    },

    /* ══════════════════════════════════════════════════════════
       BANCO DE DADOS — 6 questões × 4 pares = 24 pares
    ══════════════════════════════════════════════════════════ */
    banco_dados: {

      /* Questão 1 — Conceitos fundamentais */
      questao_1: [
        { id: 'bd_1a', pergunta: 'Banco de dados', resposta: 'Coleção organizada de dados armazenados e acessados eletronicamente' },
        { id: 'bd_1b', pergunta: 'SGBD',           resposta: 'Software que gerencia e controla o acesso ao banco de dados' },
        { id: 'bd_1c', pergunta: 'Tabela',         resposta: 'Estrutura que organiza dados em linhas e colunas no banco relacional' },
        { id: 'bd_1d', pergunta: 'Registro',       resposta: 'Linha de uma tabela que representa uma ocorrência da entidade' },
      ],

      /* Questão 2 — Chaves e relacionamentos */
      questao_2: [
        { id: 'bd_2a', pergunta: 'Chave Primária',    resposta: 'Coluna que identifica unicamente cada registro em uma tabela' },
        { id: 'bd_2b', pergunta: 'Chave Estrangeira', resposta: 'Coluna que referencia a chave primária de outra tabela' },
        { id: 'bd_2c', pergunta: 'DER',               resposta: 'Diagrama que representa entidades, atributos e relacionamentos do banco' },
        { id: 'bd_2d', pergunta: 'Cardinalidade',     resposta: 'Define a quantidade de ocorrências que uma entidade pode ter em um relacionamento' },
      ],

      /* Questão 3 — DML básico */
      questao_3: [
        { id: 'bd_3a', pergunta: 'SELECT', resposta: 'Comando SQL para recuperar dados de uma ou mais tabelas' },
        { id: 'bd_3b', pergunta: 'INSERT', resposta: 'Comando SQL para adicionar novos registros em uma tabela' },
        { id: 'bd_3c', pergunta: 'UPDATE', resposta: 'Comando SQL para modificar registros existentes em uma tabela' },
        { id: 'bd_3d', pergunta: 'DELETE', resposta: 'Comando SQL para remover registros de uma tabela' },
      ],

      /* Questão 4 — Cláusulas e filtros */
      questao_4: [
        { id: 'bd_4a', pergunta: 'WHERE',    resposta: 'Cláusula SQL que filtra registros de acordo com uma condição' },
        { id: 'bd_4b', pergunta: 'JOIN',     resposta: 'Comando que combina registros de duas ou mais tabelas por campo comum' },
        { id: 'bd_4c', pergunta: 'GROUP BY', resposta: 'Cláusula que agrupa registros com valores iguais em uma coluna' },
        { id: 'bd_4d', pergunta: 'ORDER BY', resposta: 'Cláusula que ordena o resultado da consulta por uma ou mais colunas' },
      ],

      /* Questão 5 — Objetos avançados */
      questao_5: [
        { id: 'bd_5a', pergunta: 'View',             resposta: 'Consulta armazenada reutilizável como tabela virtual no banco' },
        { id: 'bd_5b', pergunta: 'Trigger',          resposta: 'Objeto que executa automaticamente uma ação em resposta a evento DML' },
        { id: 'bd_5c', pergunta: 'Stored Procedure', resposta: 'Bloco de código SQL armazenado no banco e executado sob demanda' },
        { id: 'bd_5d', pergunta: 'Índice',           resposta: 'Estrutura que acelera a recuperação de registros em uma tabela' },
      ],

      /* Questão 6 — Normalização e ACID */
      questao_6: [
        { id: 'bd_6a', pergunta: 'Normalização', resposta: 'Processo para eliminar redundâncias e dependências indevidas nas tabelas' },
        { id: 'bd_6b', pergunta: 'Atomicidade',  resposta: 'Propriedade ACID: transação executada por completo ou desfeita totalmente' },
        { id: 'bd_6c', pergunta: 'Consistência', resposta: 'Propriedade ACID: transação leva o banco de um estado válido a outro válido' },
        { id: 'bd_6d', pergunta: 'Isolamento',   resposta: 'Propriedade ACID: transações concorrentes não interferem entre si' },
      ],
    },

    /* ══════════════════════════════════════════════════════════
       REDES — 6 questões × 4 pares = 24 pares
    ══════════════════════════════════════════════════════════ */
    redes: {

      /* Questão 1 — Conceitos de rede */
      questao_1: [
        { id: 'red_1a', pergunta: 'Rede de computadores', resposta: 'Conjunto de dispositivos interconectados que compartilham recursos e dados' },
        { id: 'red_1b', pergunta: 'Protocolo',            resposta: 'Conjunto de regras que governa a comunicação entre dispositivos em rede' },
        { id: 'red_1c', pergunta: 'Endereço IP',          resposta: 'Identificador numérico único atribuído a cada dispositivo em uma rede' },
        { id: 'red_1d', pergunta: 'Largura de banda',     resposta: 'Capacidade máxima de transmissão de dados em um canal de rede' },
      ],

      /* Questão 2 — Dispositivos de rede */
      questao_2: [
        { id: 'red_2a', pergunta: 'Roteador', resposta: 'Dispositivo que encaminha pacotes entre redes distintas usando a camada 3' },
        { id: 'red_2b', pergunta: 'Switch',   resposta: 'Dispositivo que conecta hosts dentro da mesma rede local pela camada 2' },
        { id: 'red_2c', pergunta: 'Hub',      resposta: 'Dispositivo que retransmite dados para todas as portas sem filtragem' },
        { id: 'red_2d', pergunta: 'Firewall', resposta: 'Sistema que monitora e controla o tráfego com base em regras de segurança' },
      ],

      /* Questão 3 — Modelo OSI */
      questao_3: [
        { id: 'red_3a', pergunta: 'Modelo OSI',           resposta: 'Modelo de referência que divide a comunicação em rede em 7 camadas distintas' },
        { id: 'red_3b', pergunta: 'Camada física',        resposta: 'Camada OSI responsável pela transmissão dos bits no meio físico' },
        { id: 'red_3c', pergunta: 'Camada de rede',       resposta: 'Camada OSI responsável pelo endereçamento e roteamento dos pacotes' },
        { id: 'red_3d', pergunta: 'Camada de transporte', resposta: 'Camada OSI que garante entrega confiável e controle de fluxo fim a fim' },
      ],

      /* Questão 4 — Protocolos */
      questao_4: [
        { id: 'red_4a', pergunta: 'TCP',   resposta: 'Protocolo de transporte orientado a conexão que garante entrega dos dados' },
        { id: 'red_4b', pergunta: 'UDP',   resposta: 'Protocolo de transporte sem conexão, mais rápido e sem garantia de entrega' },
        { id: 'red_4c', pergunta: 'HTTP',  resposta: 'Protocolo de comunicação usado para transferência de páginas web' },
        { id: 'red_4d', pergunta: 'HTTPS', resposta: 'Versão segura do HTTP que usa criptografia TLS para proteger os dados' },
      ],

      /* Questão 5 — Serviços de rede */
      questao_5: [
        { id: 'red_5a', pergunta: 'DNS',  resposta: 'Serviço que traduz nomes de domínio em endereços IP correspondentes' },
        { id: 'red_5b', pergunta: 'DHCP', resposta: 'Protocolo que atribui endereços IP automaticamente a dispositivos na rede' },
        { id: 'red_5c', pergunta: 'NAT',  resposta: 'Técnica que traduz endereços IP privados para um endereço público compartilhado' },
        { id: 'red_5d', pergunta: 'VPN',  resposta: 'Rede privada virtual que cria túnel criptografado sobre rede pública' },
      ],

      /* Questão 6 — Endereçamento e segurança */
      questao_6: [
        { id: 'red_6a', pergunta: 'Máscara de sub-rede', resposta: 'Valor que divide o endereço IP em parte de rede e parte de host' },
        { id: 'red_6b', pergunta: 'Sub-rede',            resposta: 'Divisão lógica de uma rede maior para melhorar organização e segurança' },
        { id: 'red_6c', pergunta: 'Endereço MAC',        resposta: 'Identificador físico único gravado na placa de rede do dispositivo' },
        { id: 'red_6d', pergunta: 'Criptografia',        resposta: 'Técnica que codifica dados para que apenas destinatários autorizados os leiam' },
      ],
    },

  },

};