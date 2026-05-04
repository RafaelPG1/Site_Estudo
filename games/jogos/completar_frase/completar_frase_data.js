/* ============================================================
   NEXUS STUDY — completar_frase_data.js

   ESTRUTURA:
   {
     [semestre]: {                        — ex.: '2026.2'
       [discId]: [
         {
           id:        string,   — identificador único (discId_completar_N)
           aula:      number,   — número da aula de origem
           nivel:     'Fácil' | 'Médio' | 'Difícil'
           frase:     string,   — contém '______' como lacuna
           letras:    string,   — dica visual da quantidade de letras
           dica:      string,   — pista contextual para ajudar o jogador
           resposta:  string    — normalização ignora acentos
         }
       ]
     }
   }

   NOTA: cores, ícones e metadados das disciplinas são obtidos
   via getDisciplinasDeSemestre() do global.js — não redefina aqui.
   ============================================================ */

const completarFraseData = {

  '2026.2': {

    /* ── POO ── */
    poo: [
      {
        id: 'poo_completar_1', aula: 1, nivel: 'Fácil',
        frase:   'Em POO, o ______ é o molde que define a estrutura e o comportamento dos objetos.',
        letras:  '[ 6 letras ]',
        dica:    'Pense em uma "planta baixa" de uma casa — ela não é a casa, mas descreve como construí-la.',
        resposta: 'classe'
      },
      {
        id: 'poo_completar_2', aula: 1, nivel: 'Fácil',
        frase:   'Uma instância concreta criada a partir de uma classe é chamada de ______.',
        letras:  '[ 6 letras ]',
        dica:    'É o produto final gerado a partir do molde; existe na memória e tem estado próprio.',
        resposta: 'objeto'
      },
      {
        id: 'poo_completar_3', aula: 1, nivel: 'Fácil',
        frase:   'O método especial invocado automaticamente ao criar um objeto é o ______.',
        letras:  '[ 10 letras ]',
        dica:    'Seu nome em Java coincide com o nome da classe e não declara tipo de retorno.',
        resposta: 'construtor'
      },
      {
        id: 'poo_completar_4', aula: 1, nivel: 'Fácil',
        frase:   'Em Java, a palavra-chave ______ referencia o objeto atual dentro de um método de instância.',
        letras:  '[ 4 letras ]',
        dica:    'É um pronome em inglês que significa "este" — aponta para quem está sendo executado.',
        resposta: 'this'
      },
      {
        id: 'poo_completar_5', aula: 2, nivel: 'Médio',
        frase:   'O modificador de acesso ______ restringe a visibilidade de um membro à própria classe.',
        letras:  '[ 7 letras ]',
        dica:    'É o modificador mais restritivo; nenhuma outra classe, nem subclasses, enxergam o membro.',
        resposta: 'private'
      },
      {
        id: 'poo_completar_6', aula: 2, nivel: 'Médio',
        frase:   'Métodos de acesso que leem e escrevem atributos privados são chamados de getters e ______.',
        letras:  '[ 7 letras ]',
        dica:    'O verbo "set" em inglês significa "definir" — esses métodos definem o valor de um atributo.',
        resposta: 'setters'
      },
      {
        id: 'poo_completar_7', aula: 2, nivel: 'Médio',
        frase:   'O modificador ______ permite acesso ao membro de qualquer classe ou pacote.',
        letras:  '[ 6 letras ]',
        dica:    'É o modificador mais permissivo; não impõe nenhuma restrição de acesso.',
        resposta: 'public'
      },
      {
        id: 'poo_completar_8', aula: 3, nivel: 'Difícil',
        frase:   'Um atributo declarado com ______ pertence à classe e não a cada objeto individualmente.',
        letras:  '[ 6 letras ]',
        dica:    'Todos os objetos da classe compartilham o mesmo valor; existe mesmo sem instâncias.',
        resposta: 'static'
      },
      {
        id: 'poo_completar_9', aula: 3, nivel: 'Difícil',
        frase:   'O tipo de dado que armazena um conjunto de constantes nomeadas em Java é o ______.',
        letras:  '[ 4 letras ]',
        dica:    'Útil para representar categorias fixas como dias da semana ou estações do ano.',
        resposta: 'enum'
      },
      {
        id: 'poo_completar_10', aula: 4, nivel: 'Fácil',
        frase:   'A capacidade de uma classe herdar atributos e métodos de outra classe é a ______.',
        letras:  '[ 7 letras ]',
        dica:    'Em Java usa-se a palavra-chave extends; a classe filha reutiliza código da classe mãe.',
        resposta: 'heranca'
      },
      {
        id: 'poo_completar_11', aula: 4, nivel: 'Fácil',
        frase:   'O princípio que oculta detalhes internos expondo somente a interface pública é o ______.',
        letras:  '[ 14 letras ]',
        dica:    'Combina modificadores de acesso com getters/setters para proteger o estado interno.',
        resposta: 'encapsulamento'
      },
      {
        id: 'poo_completar_12', aula: 5, nivel: 'Médio',
        frase:   'A redefinição de um método da superclasse na subclasse é chamada de ______.',
        letras:  '[ 11 letras ]',
        dica:    'Em Java, a anotação @Override indica que o método redefine um da classe pai.',
        resposta: 'sobrescrita'
      },
      {
        id: 'poo_completar_13', aula: 5, nivel: 'Médio',
        frase:   'Quando múltiplos métodos têm o mesmo nome mas assinaturas distintas, ocorre a ______.',
        letras:  '[ 10 letras ]',
        dica:    'Permite que o mesmo nome de método aceite diferentes tipos ou quantidades de parâmetros.',
        resposta: 'sobrecarga'
      },
      {
        id: 'poo_completar_14', aula: 5, nivel: 'Médio',
        frase:   'A capacidade de tratar objetos de subclasses como instâncias da superclasse é o ______.',
        letras:  '[ 12 letras ]',
        dica:    'Permite escrever código genérico que funciona com qualquer subclasse sem saber o tipo exato.',
        resposta: 'polimorfismo'
      },
      {
        id: 'poo_completar_15', aula: 5, nivel: 'Médio',
        frase:   'Em Java, a palavra-chave ______ é usada para invocar o construtor da superclasse.',
        letras:  '[ 5 letras ]',
        dica:    'Deve ser a primeira instrução do construtor da subclasse quando utilizada.',
        resposta: 'super'
      },
      {
        id: 'poo_completar_16', aula: 6, nivel: 'Difícil',
        frase:   'Uma classe que não pode ser instanciada diretamente é declarada com o modificador ______.',
        letras:  '[ 8 letras ]',
        dica:    'Serve como base para outras classes; pode ter métodos concretos e abstratos.',
        resposta: 'abstract'
      },
      {
        id: 'poo_completar_17', aula: 6, nivel: 'Difícil',
        frase:   'Em Java, uma ______ define um contrato de métodos que as classes concretas devem implementar.',
        letras:  '[ 9 letras ]',
        dica:    'Uma classe pode implementar várias delas ao mesmo tempo, diferente da herança simples.',
        resposta: 'interface'
      },
      {
        id: 'poo_completar_18', aula: 6, nivel: 'Difícil',
        frase:   'A palavra-chave ______ impede que um método seja sobrescrito por subclasses.',
        letras:  '[ 5 letras ]',
        dica:    'Também pode ser aplicada a classes para impedir que sejam herdadas.',
        resposta: 'final'
      },
      {
        id: 'poo_completar_19', aula: 7, nivel: 'Fácil',
        frase:   'A relação em que um objeto contém outros objetos como parte de sua estrutura é a ______.',
        letras:  '[ 10 letras ]',
        dica:    'Mais forte que agregação — os objetos filhos não existem sem o objeto pai.',
        resposta: 'composicao'
      },
      {
        id: 'poo_completar_20', aula: 7, nivel: 'Médio',
        frase:   'O padrão de projeto que garante uma única instância global de uma classe é o ______.',
        letras:  '[ 9 letras ]',
        dica:    'O construtor é privado; o acesso é feito por um método estático que retorna a instância única.',
        resposta: 'singleton'
      },
      {
        id: 'poo_completar_21', aula: 8, nivel: 'Médio',
        frase:   'O princípio SOLID que define que uma classe deve ter apenas uma razão para mudar é a Responsabilidade ______.',
        letras:  '[ 5 letras ]',
        dica:    'O "S" de SOLID — classes focadas em uma coisa só são mais fáceis de testar e manter.',
        resposta: 'unica'
      },
      {
        id: 'poo_completar_22', aula: 8, nivel: 'Médio',
        frase:   'O padrão criacional que delega a criação de objetos a subclasses é o ______.',
        letras:  '[ 14 letras ]',
        dica:    'A superclasse define a estrutura; as subclasses decidem qual classe concreta instanciar.',
        resposta: 'factory method'
      },
      {
        id: 'poo_completar_23', aula: 8, nivel: 'Difícil',
        frase:   'O padrão estrutural que adiciona comportamentos a objetos de forma dinâmica é o ______.',
        letras:  '[ 9 letras ]',
        dica:    'Alternativa à herança para extensão de funcionalidades — envolve o objeto original.',
        resposta: 'decorator'
      },
      {
        id: 'poo_completar_24', aula: 8, nivel: 'Difícil',
        frase:   'O princípio SOLID que diz que módulos devem depender de abstrações é a Inversão de ______.',
        letras:  '[ 11 letras ]',
        dica:    'O "D" de SOLID — use interfaces e classes abstratas como ponto de acoplamento.',
        resposta: 'dependencia'
      },
    ],

    /* ── REDES ── */
    redes: [
      {
        id: 'redes_completar_1', aula: 1, nivel: 'Fácil',
        frase:   'O modelo de referência que organiza a comunicação em sete camadas é o modelo ______.',
        letras:  '[ 3 letras ]',
        dica:    'Criado pela ISO; cada camada tem responsabilidade específica e se comunica só com as adjacentes.',
        resposta: 'osi'
      },
      {
        id: 'redes_completar_2', aula: 1, nivel: 'Fácil',
        frase:   'O endereço lógico que identifica unicamente um dispositivo em uma rede é o endereço ______.',
        letras:  '[ 2 letras ]',
        dica:    'Na versão 4, é composto por quatro octetos separados por pontos — ex.: 192.168.0.1.',
        resposta: 'ip'
      },
      {
        id: 'redes_completar_3', aula: 1, nivel: 'Fácil',
        frase:   'O dispositivo que conecta redes distintas e encaminha pacotes entre elas é o ______.',
        letras:  '[ 8 letras ]',
        dica:    'Opera na camada 3 (rede) do modelo OSI e toma decisões com base em tabelas de encaminhamento.',
        resposta: 'roteador'
      },
      {
        id: 'redes_completar_4', aula: 1, nivel: 'Fácil',
        frase:   'O endereço físico gravado na interface de rede de cada dispositivo é o endereço ______.',
        letras:  '[ 3 letras ]',
        dica:    'É composto por 48 bits em notação hexadecimal e opera na camada de enlace.',
        resposta: 'mac'
      },
      {
        id: 'redes_completar_5', aula: 2, nivel: 'Médio',
        frase:   'A unidade de dados transmitida na camada de enlace do modelo OSI é chamada de ______.',
        letras:  '[ 6 letras ]',
        dica:    'Encapsula o pacote da camada de rede e inclui endereços MAC de origem e destino.',
        resposta: 'quadro'
      },
      {
        id: 'redes_completar_6', aula: 2, nivel: 'Médio',
        frase:   'O protocolo responsável pela transferência de páginas web é o ______.',
        letras:  '[ 4 letras ]',
        dica:    'Trabalha na camada de aplicação; a versão segura adiciona TLS ao seu nome.',
        resposta: 'http'
      },
      {
        id: 'redes_completar_7', aula: 2, nivel: 'Médio',
        frase:   'O protocolo que atribui automaticamente endereços IP aos dispositivos da rede é o ______.',
        letras:  '[ 4 letras ]',
        dica:    'Elimina a necessidade de configuração manual de IP; usa broadcast para descobrir o servidor.',
        resposta: 'dhcp'
      },
      {
        id: 'redes_completar_8', aula: 3, nivel: 'Difícil',
        frase:   'A topologia em que todos os dispositivos se conectam a um nó central é a topologia ______.',
        letras:  '[ 7 letras ]',
        dica:    'O nó central costuma ser um switch; se ele falhar, toda a rede cai.',
        resposta: 'estrela'
      },
      {
        id: 'redes_completar_9', aula: 3, nivel: 'Difícil',
        frase:   'O campo do cabeçalho IP que limita o número máximo de saltos de um pacote é o ______.',
        letras:  '[ 3 letras ]',
        dica:    'Cada roteador decrementa esse valor em 1; quando chega a 0, o pacote é descartado.',
        resposta: 'ttl'
      },
      {
        id: 'redes_completar_10', aula: 4, nivel: 'Fácil',
        frase:   'O protocolo orientado a conexão que garante entrega confiável e ordenada dos dados é o ______.',
        letras:  '[ 3 letras ]',
        dica:    'Estabelece conexão via handshake de três vias (SYN, SYN-ACK, ACK) antes de transmitir.',
        resposta: 'tcp'
      },
      {
        id: 'redes_completar_11', aula: 4, nivel: 'Fácil',
        frase:   'O serviço que traduz nomes de domínio em endereços IP é o ______.',
        letras:  '[ 3 letras ]',
        dica:    'Funciona como a "agenda telefônica" da internet; sem ele você precisaria memorizar IPs.',
        resposta: 'dns'
      },
      {
        id: 'redes_completar_12', aula: 5, nivel: 'Médio',
        frase:   'O protocolo de transporte sem conexão, mais rápido mas sem garantia de entrega, é o ______.',
        letras:  '[ 3 letras ]',
        dica:    'Ideal para streaming e jogos online onde velocidade importa mais que confiabilidade.',
        resposta: 'udp'
      },
      {
        id: 'redes_completar_13', aula: 5, nivel: 'Médio',
        frase:   'A técnica que divide uma rede em sub-redes menores usando uma máscara é o ______.',
        letras:  '[ 10 letras ]',
        dica:    'Permite gerenciar endereços IP de forma eficiente e segmentar o tráfego de rede.',
        resposta: 'subnetting'
      },
      {
        id: 'redes_completar_14', aula: 5, nivel: 'Médio',
        frase:   'A técnica que permite múltiplos dispositivos compartilharem um único IP público é o ______.',
        letras:  '[ 3 letras ]',
        dica:    'O roteador doméstico usa isso para que todos os seus dispositivos acessem a internet.',
        resposta: 'nat'
      },
      {
        id: 'redes_completar_15', aula: 6, nivel: 'Difícil',
        frase:   'O protocolo seguro que adiciona criptografia TLS ao HTTP é o ______.',
        letras:  '[ 5 letras ]',
        dica:    'Identificado pelo cadeado no navegador; usa a porta 443 por padrão.',
        resposta: 'https'
      },
      {
        id: 'redes_completar_16', aula: 6, nivel: 'Difícil',
        frase:   'O protocolo de roteamento que usa o algoritmo de estado de enlace é o ______.',
        letras:  '[ 4 letras ]',
        dica:    'Cada roteador mantém um mapa completo da topologia e usa Dijkstra para calcular rotas.',
        resposta: 'ospf'
      },
      {
        id: 'redes_completar_17', aula: 6, nivel: 'Difícil',
        frase:   'A camada do modelo OSI responsável pelo controle de erros e fluxo entre nós adjacentes é a camada de ______.',
        letras:  '[ 6 letras ]',
        dica:    'É a camada 2; divide-se em LLC (controle lógico) e MAC (controle de acesso ao meio).',
        resposta: 'enlace'
      },
    ],

    /* ── DESIGN ── */
    design: [
      {
        id: 'design_completar_1', aula: 1, nivel: 'Fácil',
        frase:   'A sigla UX representa a experiência do ______.',
        letras:  '[ 7 letras ]',
        dica:    '"U" de User em inglês — foca em como as pessoas se sentem ao interagir com o produto.',
        resposta: 'usuario'
      },
      {
        id: 'design_completar_2', aula: 1, nivel: 'Fácil',
        frase:   'Uma representação esquemática de baixa fidelidade de uma interface é chamada de ______.',
        letras:  '[ 9 letras ]',
        dica:    'Não tem cores nem imagens reais — apenas formas simples para definir layout e hierarquia.',
        resposta: 'wireframe'
      },
      {
        id: 'design_completar_3', aula: 1, nivel: 'Fácil',
        frase:   'O perfil semifictício que representa o usuário típico de um sistema é chamado de ______.',
        letras:  '[ 7 letras ]',
        dica:    'Tem nome, idade, objetivos e frustrações — criado com base em pesquisa com usuários reais.',
        resposta: 'persona'
      },
      {
        id: 'design_completar_4', aula: 2, nivel: 'Fácil',
        frase:   'Um modelo navegável e interativo que simula o comportamento real de uma interface é o ______.',
        letras:  '[ 9 letras ]',
        dica:    'Pode ser de baixa ou alta fidelidade; serve para testar fluxos antes do desenvolvimento.',
        resposta: 'prototipo'
      },
      {
        id: 'design_completar_5', aula: 2, nivel: 'Médio',
        frase:   'A capacidade de uma interface ser utilizada por pessoas com diferentes necessidades é a ______.',
        letras:  '[ 14 letras ]',
        dica:    'Inclui suporte a leitores de tela, contraste adequado e navegação por teclado.',
        resposta: 'acessibilidade'
      },
      {
        id: 'design_completar_6', aula: 2, nivel: 'Médio',
        frase:   'O processo de avaliar um sistema observando usuários reais em tarefas é o teste de ______.',
        letras:  '[ 11 letras ]',
        dica:    'Mede quão fácil e eficiente é usar o produto; identifica pontos de atrito na interface.',
        resposta: 'usabilidade'
      },
      {
        id: 'design_completar_7', aula: 3, nivel: 'Médio',
        frase:   'O princípio gestáltico que tende a agrupar visualmente elementos próximos é o de ______.',
        letras:  '[ 11 letras ]',
        dica:    'Nosso cérebro percebe elementos perto uns dos outros como relacionados ou do mesmo grupo.',
        resposta: 'proximidade'
      },
      {
        id: 'design_completar_8', aula: 3, nivel: 'Difícil',
        frase:   'O critério internacional de acessibilidade para conteúdo web publicado pelo W3C é o ______.',
        letras:  '[ 4 letras ]',
        dica:    'Define três níveis de conformidade: A, AA e AAA; amplamente exigido em sites governamentais.',
        resposta: 'wcag'
      },
      {
        id: 'design_completar_9', aula: 9, nivel: 'Fácil',
        frase:   'O método de inovação centrado no humano com etapas de empatia, definição e ideação é o ______.',
        letras:  '[ 14 letras ]',
        dica:    'Popularizado pela IDEO e pela d.school de Stanford; une empatia e prototipagem rápida.',
        resposta: 'design thinking'
      },
      {
        id: 'design_completar_10', aula: 9, nivel: 'Médio',
        frase:   'O conjunto padronizado de componentes, cores e tipografia de uma interface compõe um ______ de design.',
        letras:  '[ 7 letras ]',
        dica:    'Garante consistência visual; exemplos famosos são o Material Design e o Fluent Design.',
        resposta: 'sistema'
      },
      {
        id: 'design_completar_11', aula: 9, nivel: 'Médio',
        frase:   'A técnica que compara duas variações de uma interface com grupos distintos de usuários é o teste ______.',
        letras:  '[ 3 letras ]',
        dica:    'Uma letra do alfabeto para cada variação — mede qual versão produz melhor resultado.',
        resposta: 'a/b'
      },
      {
        id: 'design_completar_12', aula: 10, nivel: 'Médio',
        frase:   'A organização hierárquica do conteúdo de um sistema para facilitar a navegação é a ______ da informação.',
        letras:  '[ 11 letras ]',
        dica:    'Define categorias, menus e hierarquias — impacta diretamente a facilidade de encontrar conteúdo.',
        resposta: 'arquitetura'
      },
      {
        id: 'design_completar_13', aula: 10, nivel: 'Médio',
        frase:   'O mapeamento visual de todas as etapas percorridas pelo usuário em um sistema é o ______ de usuário.',
        letras:  '[ 5 letras ]',
        dica:    'Mostra cada tela e decisão do usuário do início ao fim de uma tarefa.',
        resposta: 'fluxo'
      },
      {
        id: 'design_completar_14', aula: 10, nivel: 'Difícil',
        frase:   'A avaliação de usabilidade conduzida por especialistas sem participação de usuários é a avaliação ______.',
        letras:  '[ 10 letras ]',
        dica:    'Os avaliadores percorrem a interface comparando com princípios de usabilidade estabelecidos.',
        resposta: 'heuristica'
      },
      {
        id: 'design_completar_15', aula: 10, nivel: 'Difícil',
        frase:   'As 10 heurísticas de usabilidade mais utilizadas foram propostas por Jakob ______.',
        letras:  '[ 7 letras ]',
        dica:    'Consultor dinamarquês de usabilidade; cofundou o Nielsen Norman Group com Don Norman.',
        resposta: 'nielsen'
      },
    ],

    /* ── BANCO DE DADOS ── */
    banco_dados: [
      {
        id: 'banco_dados_completar_1', aula: 1, nivel: 'Fácil',
        frase:   'Em um banco relacional, os dados são organizados em estruturas chamadas ______.',
        letras:  '[ 7 letras ]',
        dica:    'Organizadas em linhas e colunas — parecidas visualmente com planilhas.',
        resposta: 'tabelas'
      },
      {
        id: 'banco_dados_completar_2', aula: 1, nivel: 'Fácil',
        frase:   'Cada linha de uma tabela relacional é chamada de ______ ou tupla.',
        letras:  '[ 8 letras ]',
        dica:    'Representa um único item ou entrada de dados — ex.: um cliente específico no cadastro.',
        resposta: 'registro'
      },
      {
        id: 'banco_dados_completar_3', aula: 1, nivel: 'Fácil',
        frase:   'O comando SQL utilizado para recuperar dados de uma tabela é o ______.',
        letras:  '[ 6 letras ]',
        dica:    'Sempre acompanhado de FROM; você pode escolher colunas específicas ou usar * para todas.',
        resposta: 'select'
      },
      {
        id: 'banco_dados_completar_4', aula: 1, nivel: 'Fácil',
        frase:   'A coluna que identifica unicamente cada registro em uma tabela é a chave ______.',
        letras:  '[ 8 letras ]',
        dica:    'Não pode conter valores nulos ou duplicados — garante a identidade de cada linha.',
        resposta: 'primaria'
      },
      {
        id: 'banco_dados_completar_5', aula: 1, nivel: 'Fácil',
        frase:   'O software responsável por gerenciar e controlar o acesso a um banco de dados é o ______.',
        letras:  '[ 4 letras ]',
        dica:    'Exemplos: MySQL, PostgreSQL, Oracle — todos são softwares dessa categoria.',
        resposta: 'sgbd'
      },
      {
        id: 'banco_dados_completar_6', aula: 2, nivel: 'Médio',
        frase:   'A cláusula SQL usada para filtrar registros de acordo com uma condição é o ______.',
        letras:  '[ 5 letras ]',
        dica:    'Vem após o FROM; aceita operadores como =, >, <, LIKE e AND/OR.',
        resposta: 'where'
      },
      {
        id: 'banco_dados_completar_7', aula: 2, nivel: 'Médio',
        frase:   'O diagrama que representa entidades, atributos e relacionamentos de um banco é o ______.',
        letras:  '[ 3 letras ]',
        dica:    'Técnica de modelagem conceitual; usa retângulos para entidades e losangos para relacionamentos.',
        resposta: 'der'
      },
      {
        id: 'banco_dados_completar_8', aula: 2, nivel: 'Médio',
        frase:   'A coluna que referencia a chave primária de outra tabela é chamada de chave ______.',
        letras:  '[ 11 letras ]',
        dica:    'Garante a integridade referencial — impede valores que não existam na tabela referenciada.',
        resposta: 'estrangeira'
      },
      {
        id: 'banco_dados_completar_9', aula: 3, nivel: 'Difícil',
        frase:   'O processo de estruturar tabelas para eliminar redundâncias e dependências indevidas é a ______.',
        letras:  '[ 12 letras ]',
        dica:    'Passa por formas normais (1FN, 2FN, 3FN…); o objetivo é ter dados sem repetição desnecessária.',
        resposta: 'normalizacao'
      },
      {
        id: 'banco_dados_completar_10', aula: 3, nivel: 'Difícil',
        frase:   'A linguagem SQL usada para criar e alterar estruturas de tabelas é a ______.',
        letras:  '[ 3 letras ]',
        dica:    'Inclui comandos como CREATE, ALTER e DROP — manipula a estrutura, não os dados.',
        resposta: 'ddl'
      },
      {
        id: 'banco_dados_completar_11', aula: 9, nivel: 'Fácil',
        frase:   'O comando SQL que combina registros de duas ou mais tabelas por um campo comum é o ______.',
        letras:  '[ 4 letras ]',
        dica:    'Existem variações: INNER, LEFT, RIGHT e FULL — cada uma define quais linhas incluir.',
        resposta: 'join'
      },
      {
        id: 'banco_dados_completar_12', aula: 9, nivel: 'Médio',
        frase:   'A propriedade ACID que garante que uma transação é executada por completo ou desfeita totalmente é a ______.',
        letras:  '[ 11 letras ]',
        dica:    'O "A" de ACID — ou tudo acontece, ou nada acontece; não existe meio-termo.',
        resposta: 'atomicidade'
      },
      {
        id: 'banco_dados_completar_13', aula: 9, nivel: 'Médio',
        frase:   'Um objeto de banco que executa automaticamente uma ação em resposta a um evento DML é o ______.',
        letras:  '[ 7 letras ]',
        dica:    'Dispara automaticamente antes ou depois de INSERT, UPDATE ou DELETE.',
        resposta: 'trigger'
      },
      {
        id: 'banco_dados_completar_14', aula: 9, nivel: 'Médio',
        frase:   'Uma consulta SQL armazenada no banco que pode ser reutilizada como tabela virtual é a ______.',
        letras:  '[ 4 letras ]',
        dica:    'Não armazena dados fisicamente; executa a query toda vez que é consultada.',
        resposta: 'view'
      },
      {
        id: 'banco_dados_completar_15', aula: 10, nivel: 'Médio',
        frase:   'A estrutura que acelera buscas em uma coluna evitando varredura completa da tabela é o ______.',
        letras:  '[ 6 letras ]',
        dica:    'Funciona como o índice de um livro — aponta direto para onde o dado está.',
        resposta: 'indice'
      },
      {
        id: 'banco_dados_completar_16', aula: 10, nivel: 'Difícil',
        frase:   'O bloco SQL que agrupa múltiplos comandos executados de forma atômica é a ______.',
        letras:  '[ 10 letras ]',
        dica:    'Encerrada com COMMIT para confirmar ou ROLLBACK para desfazer todas as operações.',
        resposta: 'transacao'
      },
      {
        id: 'banco_dados_completar_17', aula: 10, nivel: 'Difícil',
        frase:   'A propriedade ACID que garante que os dados permanecem corretos após uma transação é a ______.',
        letras:  '[ 12 letras ]',
        dica:    'O "C" de ACID — o banco deve sair de um estado válido e entrar em outro estado válido.',
        resposta: 'consistencia'
      },
      {
        id: 'banco_dados_completar_18', aula: 10, nivel: 'Difícil',
        frase:   'O conjunto de instruções armazenadas no banco que pode ser reutilizado como função é a ______.',
        letras:  '[ 9 letras ]',
        dica:    'Diferente de uma função, pode executar INSERT/UPDATE/DELETE e não precisa retornar valor.',
        resposta: 'procedure'
      },
    ],

  },

};

/* ── Expõe globalmente E exporta como módulo ES ── */
if (typeof window !== 'undefined') window.completarFraseData = completarFraseData;