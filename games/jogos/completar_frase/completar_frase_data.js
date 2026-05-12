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
           resposta:  string    — normalização ignora acentos
           tips:      string[]  — array com UMA dica por questão
         }
       ]
     }
   }

   NOTA: cores, ícones e metadados das disciplinas são obtidos
   via getDisciplinasDeSemestre() do global.js — não redefina aqui.

   IMPORTANTE: O campo `letras` foi REMOVIDO — a contagem de letras
   é calculada automaticamente em runtime a partir de `resposta`.
   Cada questão possui exatamente UMA dica no array `tips`.
   ============================================================ */

const completarFraseData = {

  '2026.2': {

    /* ── POO ── */
    poo: [
      {
        id: 'poo_completar_1', aula: 1, nivel: 'Fácil',
        frase:   'Em POO, o ______ é o molde que define a estrutura e o comportamento dos objetos.',
        resposta: 'classe',
        tips: ['Pense em uma "planta baixa" — ela descreve como construir algo, mas não é o objeto em si.']
      },
      {
        id: 'poo_completar_2', aula: 1, nivel: 'Fácil',
        frase:   'Uma instância concreta criada a partir de uma classe é chamada de ______.',
        resposta: 'objeto',
        tips: ['É o produto gerado a partir do molde; existe na memória e possui estado próprio.']
      },
      {
        id: 'poo_completar_3', aula: 1, nivel: 'Fácil',
        frase:   'O método especial invocado automaticamente ao criar um objeto é o ______.',
        resposta: 'construtor',
        tips: ['Em Java seu nome coincide com o da classe e é chamado junto ao operador `new`.']
      },
      {
        id: 'poo_completar_4', aula: 1, nivel: 'Fácil',
        frase:   'Em Java, a palavra-chave ______ referencia o objeto atual dentro de um método de instância.',
        resposta: 'this',
        tips: ['É um pronome em inglês; serve para distinguir atributos de parâmetros com mesmo nome.']
      },
      {
        id: 'poo_completar_5', aula: 2, nivel: 'Médio',
        frase:   'O modificador de acesso ______ restringe a visibilidade de um membro à própria classe.',
        resposta: 'private',
        tips: ['É o modificador mais restritivo — nem subclasses enxergam o membro diretamente.']
      },
      {
        id: 'poo_completar_6', aula: 2, nivel: 'Médio',
        frase:   'Métodos de acesso que leem e escrevem atributos privados são chamados de getters e ______.',
        resposta: 'setters',
        tips: ['O verbo "set" em inglês significa "definir"; esses métodos seguem a convenção setNomeAtributo(valor).']
      },
      {
        id: 'poo_completar_7', aula: 2, nivel: 'Médio',
        frase:   'O modificador ______ permite acesso ao membro de qualquer classe ou pacote.',
        resposta: 'public',
        tips: ['É o modificador mais permissivo — não impõe nenhuma restrição de acesso.']
      },
      {
        id: 'poo_completar_8', aula: 3, nivel: 'Difícil',
        frase:   'Um atributo declarado com ______ pertence à classe e não a cada objeto individualmente.',
        resposta: 'static',
        tips: ['Todos os objetos da classe compartilham o mesmo valor; pode ser acessado pelo nome da classe.']
      },
      {
        id: 'poo_completar_9', aula: 3, nivel: 'Difícil',
        frase:   'O tipo de dado que armazena um conjunto de constantes nomeadas em Java é o ______.',
        resposta: 'enum',
        tips: ['Abreviação de "enumeration"; útil para categorias fixas como dias da semana ou estações.']
      },
      {
        id: 'poo_completar_10', aula: 4, nivel: 'Fácil',
        frase:   'A capacidade de uma classe herdar atributos e métodos de outra classe é a ______.',
        resposta: 'heranca',
        tips: ['Em Java usa-se `extends`; estabelece uma relação "é um" entre a classe filha e a mãe.']
      },
      {
        id: 'poo_completar_11', aula: 4, nivel: 'Fácil',
        frase:   'O princípio que oculta detalhes internos expondo somente a interface pública é o ______.',
        resposta: 'encapsulamento',
        tips: ['Combina modificadores de acesso com getters/setters para proteger o estado interno do objeto.']
      },
      {
        id: 'poo_completar_12', aula: 5, nivel: 'Médio',
        frase:   'A redefinição de um método da superclasse na subclasse é chamada de ______.',
        resposta: 'sobrescrita',
        tips: ['Em Java a anotação @Override indica que o método substitui um da classe pai com a mesma assinatura.']
      },
      {
        id: 'poo_completar_13', aula: 5, nivel: 'Médio',
        frase:   'Quando múltiplos métodos têm o mesmo nome mas assinaturas distintas, ocorre a ______.',
        resposta: 'sobrecarga',
        tips: ['O compilador decide qual versão usar pelos argumentos passados — mesma classe, assinaturas diferentes.']
      },
      {
        id: 'poo_completar_14', aula: 5, nivel: 'Médio',
        frase:   'A capacidade de tratar objetos de subclasses como instâncias da superclasse é o ______.',
        resposta: 'polimorfismo',
        tips: ['Do grego "muitas formas" — um mesmo método pode ter comportamentos distintos dependendo do objeto.']
      },
      {
        id: 'poo_completar_15', aula: 5, nivel: 'Médio',
        frase:   'Em Java, a palavra-chave ______ é usada para invocar o construtor da superclasse.',
        resposta: 'super',
        tips: ['Deve ser a primeira instrução do construtor da subclasse; também acessa métodos sobrescritos do pai.']
      },
      {
        id: 'poo_completar_16', aula: 6, nivel: 'Difícil',
        frase:   'Uma classe que não pode ser instanciada diretamente é declarada com o modificador ______.',
        resposta: 'abstract',
        tips: ['Serve como base para subclasses; pode ter métodos sem corpo que as filhas são obrigadas a implementar.']
      },
      {
        id: 'poo_completar_17', aula: 6, nivel: 'Difícil',
        frase:   'Em Java, uma ______ define um contrato de métodos que as classes concretas devem implementar.',
        resposta: 'interface',
        tips: ['Uma classe pode implementar várias ao mesmo tempo; usa-se a palavra-chave `implements`.']
      },
      {
        id: 'poo_completar_18', aula: 6, nivel: 'Difícil',
        frase:   'A palavra-chave ______ impede que um método seja sobrescrito por subclasses.',
        resposta: 'final',
        tips: ['Aplicada a classes, impede herança; aplicada a variáveis, torna o valor constante.']
      },
      {
        id: 'poo_completar_19', aula: 7, nivel: 'Fácil',
        frase:   'A relação em que um objeto contém outros objetos como parte de sua estrutura é a ______.',
        resposta: 'composicao',
        tips: ['Relação "tem um" com dependência total de ciclo de vida — o objeto filho não existe sem o pai.']
      },
      {
        id: 'poo_completar_20', aula: 7, nivel: 'Médio',
        frase:   'A relação em que objetos podem existir independentemente mesmo associados é a ______.',
        resposta: 'agregacao',
        tips: ['Relação "tem um" mais fraca — o objeto filho sobrevive mesmo sem o pai.']
      },
    ],

    /* ── DESIGN ── */
    design: [
      {
        id: 'design_completar_1', aula: 1, nivel: 'Fácil',
        frase:   'O processo de criar produtos que oferecem experiências relevantes e significativas é chamado de ______.',
        resposta: 'design',
        tips: ['Vai além da estética — envolve funcionalidade, usabilidade e compreensão do comportamento humano.']
      },
      {
        id: 'design_completar_2', aula: 1, nivel: 'Fácil',
        frase:   'A disciplina focada em como o usuário interage e se sente ao usar um produto é a ______ do usuário.',
        resposta: 'experiencia',
        tips: ['Sua sigla em inglês é UX; considera emoções e percepções ao longo de toda a jornada de uso.']
      },
      {
        id: 'design_completar_3', aula: 2, nivel: 'Fácil',
        frase:   'O esboço rápido e de baixa fidelidade de uma tela ou interface é chamado de ______.',
        resposta: 'wireframe',
        tips: ['Foca na estrutura dos elementos sem cores ou detalhes visuais — é o esqueleto da tela.']
      },
      {
        id: 'design_completar_4', aula: 2, nivel: 'Médio',
        frase:   'O modelo interativo de alta fidelidade usado para testar a experiência antes do desenvolvimento é o ______.',
        resposta: 'prototipo',
        tips: ['Simula o comportamento do produto final sem precisar codificá-lo; permite testes com usuários reais.']
      },
      {
        id: 'design_completar_5', aula: 3, nivel: 'Fácil',
        frase:   'A facilidade com que um usuário consegue usar um produto para atingir seus objetivos é a ______.',
        resposta: 'usabilidade',
        tips: ['Medida por eficácia, eficiência e satisfação; Jakob Nielsen propôs 10 heurísticas para avaliá-la.']
      },
      {
        id: 'design_completar_6', aula: 3, nivel: 'Médio',
        frase:   'A prática de projetar produtos acessíveis a pessoas com diferentes habilidades é a ______.',
        resposta: 'acessibilidade',
        tips: ['As diretrizes WCAG definem critérios de conformidade; beneficia todos os usuários, não só pessoas com deficiência.']
      },
      {
        id: 'design_completar_7', aula: 4, nivel: 'Fácil',
        frase:   'Representações fictícias de usuários típicos criadas para guiar decisões de design são as ______.',
        resposta: 'personas',
        tips: ['Baseadas em pesquisa real; têm nome, objetivos e frustrações típicos para humanizar o usuário-alvo.']
      },
      {
        id: 'design_completar_8', aula: 5, nivel: 'Médio',
        frase:   'O método de pesquisa que observa o usuário usando o produto em tarefas reais é o ______ de usabilidade.',
        resposta: 'teste',
        tips: ['O objetivo é observar comportamentos, não obter opiniões; mesmo 5 usuários revelam a maioria dos problemas.']
      },
      {
        id: 'design_completar_9', aula: 6, nivel: 'Médio',
        frase:   'O conjunto de padrões visuais reutilizáveis que garante consistência em um produto é o ______ de design.',
        resposta: 'sistema',
        tips: ['Inclui componentes, tokens de cor e tipografia; exemplos: Material Design e Human Interface Guidelines.']
      },
      {
        id: 'design_completar_10', aula: 7, nivel: 'Fácil',
        frase:   'A representação visual da jornada completa do usuário com um produto ou serviço é o ______ de jornada.',
        resposta: 'mapa',
        tips: ['Exibe fases, emoções e pontos de contato; ajuda a identificar momentos de frustração e oportunidades.']
      },
      {
        id: 'design_completar_11', aula: 9, nivel: 'Médio',
        frase:   'O princípio de design que diz que elementos relacionados devem estar visualmente próximos é a ______.',
        resposta: 'proximidade',
        tips: ['Um dos princípios Gestalt; agrupa itens relacionados sem precisar de linhas ou caixas separadoras.']
      },
      {
        id: 'design_completar_12', aula: 10, nivel: 'Médio',
        frase:   'A organização hierárquica do conteúdo de um sistema para facilitar a navegação é a ______ da informação.',
        resposta: 'arquitetura',
        tips: ['Define categorias e menus; card sorting é uma técnica usada para descobrir como usuários categorizam conteúdo.']
      },
      {
        id: 'design_completar_13', aula: 10, nivel: 'Médio',
        frase:   'O mapeamento visual de todas as etapas percorridas pelo usuário em um sistema é o ______ de usuário.',
        resposta: 'fluxo',
        tips: ['Mostra cada tela e decisão do início ao fim de uma tarefa; difere do mapa de jornada por focar na interface.']
      },
      {
        id: 'design_completar_14', aula: 10, nivel: 'Difícil',
        frase:   'A avaliação de usabilidade conduzida por especialistas sem participação de usuários é a avaliação ______.',
        resposta: 'heuristica',
        tips: ['Especialistas percorrem a interface comparando com princípios de usabilidade; mais rápida que testes com usuários.']
      },
      {
        id: 'design_completar_15', aula: 10, nivel: 'Difícil',
        frase:   'As 10 heurísticas de usabilidade mais utilizadas foram propostas por Jakob ______.',
        resposta: 'nielsen',
        tips: ['Consultor dinamarquês que cofundou o Nielsen Norman Group; publicou as heurísticas originalmente em 1994.']
      },
    ],

    /* ── BANCO DE DADOS ── */
    banco_dados: [
      {
        id: 'banco_dados_completar_1', aula: 1, nivel: 'Fácil',
        frase:   'Em um banco relacional, os dados são organizados em estruturas chamadas ______.',
        resposta: 'tabelas',
        tips: ['Organizadas em linhas e colunas, representam entidades como clientes ou pedidos.']
      },
      {
        id: 'banco_dados_completar_2', aula: 1, nivel: 'Fácil',
        frase:   'Cada linha de uma tabela relacional é chamada de ______ ou tupla.',
        resposta: 'registro',
        tips: ['Representa um único item de dados; "tupla" é o termo formal da álgebra relacional para o mesmo conceito.']
      },
      {
        id: 'banco_dados_completar_3', aula: 1, nivel: 'Fácil',
        frase:   'O comando SQL utilizado para recuperar dados de uma tabela é o ______.',
        resposta: 'select',
        tips: ['Sempre acompanhado de FROM; pode ser combinado com WHERE, ORDER BY e JOIN para consultas complexas.']
      },
      {
        id: 'banco_dados_completar_4', aula: 1, nivel: 'Fácil',
        frase:   'A coluna que identifica unicamente cada registro em uma tabela é a chave ______.',
        resposta: 'primaria',
        tips: ['Não pode ter valores nulos ou duplicados; é a base para relacionamentos com outras tabelas.']
      },
      {
        id: 'banco_dados_completar_5', aula: 1, nivel: 'Fácil',
        frase:   'O software responsável por gerenciar e controlar o acesso a um banco de dados é o ______.',
        resposta: 'sgbd',
        tips: ['Sigla de Sistema Gerenciador de Banco de Dados; exemplos: MySQL, PostgreSQL e Oracle.']
      },
      {
        id: 'banco_dados_completar_6', aula: 2, nivel: 'Médio',
        frase:   'A cláusula SQL usada para filtrar registros de acordo com uma condição é o ______.',
        resposta: 'where',
        tips: ['Vem após o FROM e aceita operadores como =, >, LIKE e AND/OR; difere de HAVING, que filtra grupos.']
      },
      {
        id: 'banco_dados_completar_7', aula: 2, nivel: 'Médio',
        frase:   'O diagrama que representa entidades, atributos e relacionamentos de um banco é o ______.',
        resposta: 'der',
        tips: ['Sigla de Diagrama Entidade-Relacionamento; usa retângulos para entidades e losangos para relacionamentos.']
      },
      {
        id: 'banco_dados_completar_8', aula: 2, nivel: 'Médio',
        frase:   'A coluna que referencia a chave primária de outra tabela é chamada de chave ______.',
        resposta: 'estrangeira',
        tips: ['Em inglês: Foreign Key (FK); garante a integridade referencial entre tabelas relacionadas.']
      },
      {
        id: 'banco_dados_completar_9', aula: 3, nivel: 'Difícil',
        frase:   'O processo de estruturar tabelas para eliminar redundâncias e dependências indevidas é a ______.',
        resposta: 'normalizacao',
        tips: ['Passa por formas normais (1FN, 2FN, 3FN…) para reduzir anomalias de inserção, atualização e exclusão.']
      },
      {
        id: 'banco_dados_completar_10', aula: 3, nivel: 'Difícil',
        frase:   'A linguagem SQL usada para criar e alterar estruturas de tabelas é a ______.',
        resposta: 'ddl',
        tips: ['Sigla de Data Definition Language; inclui CREATE, ALTER e DROP — manipula estrutura, não dados.']
      },
      {
        id: 'banco_dados_completar_11', aula: 9, nivel: 'Fácil',
        frase:   'O comando SQL que combina registros de duas ou mais tabelas por um campo comum é o ______.',
        resposta: 'join',
        tips: ['Existem variações: INNER, LEFT, RIGHT e FULL — cada uma define quais linhas incluir no resultado.']
      },
      {
        id: 'banco_dados_completar_12', aula: 9, nivel: 'Médio',
        frase:   'A propriedade ACID que garante que uma transação é executada por completo ou desfeita totalmente é a ______.',
        resposta: 'atomicidade',
        tips: ['O "A" de ACID — ou tudo acontece, ou nada acontece; evita estados inconsistentes após falhas.']
      },
      {
        id: 'banco_dados_completar_13', aula: 9, nivel: 'Médio',
        frase:   'Um objeto de banco que executa automaticamente uma ação em resposta a um evento DML é o ______.',
        resposta: 'trigger',
        tips: ['Em inglês "gatilho"; dispara antes ou depois de INSERT, UPDATE ou DELETE sem chamada explícita.']
      },
      {
        id: 'banco_dados_completar_14', aula: 9, nivel: 'Médio',
        frase:   'Uma consulta SQL armazenada no banco que pode ser reutilizada como tabela virtual é a ______.',
        resposta: 'view',
        tips: ['Não armazena dados fisicamente; útil para simplificar consultas e controlar acesso a colunas sensíveis.']
      },
      {
        id: 'banco_dados_completar_15', aula: 10, nivel: 'Médio',
        frase:   'A estrutura que acelera buscas em uma coluna evitando varredura completa da tabela é o ______.',
        resposta: 'indice',
        tips: ['Funciona como o índice de um livro; acelera leituras mas pode desacelerar escritas.']
      },
      {
        id: 'banco_dados_completar_16', aula: 10, nivel: 'Difícil',
        frase:   'O bloco SQL que agrupa múltiplos comandos executados de forma atômica é a ______.',
        resposta: 'transacao',
        tips: ['Encerrada com COMMIT para confirmar ou ROLLBACK para desfazer; garante as propriedades ACID.']
      },
      {
        id: 'banco_dados_completar_17', aula: 10, nivel: 'Difícil',
        frase:   'A propriedade ACID que garante que os dados permanecem corretos após uma transação é a ______.',
        resposta: 'consistencia',
        tips: ['O "C" de ACID — o banco deve sair de um estado válido e entrar em outro estado válido.']
      },
      {
        id: 'banco_dados_completar_18', aula: 10, nivel: 'Difícil',
        frase:   'O conjunto de instruções armazenadas no banco que pode ser reutilizado como função é a ______.',
        resposta: 'procedure',
        tips: ['Abreviação de "stored procedure"; pode executar DML e não precisa retornar valor, diferente de uma função.']
      },
    ],

  },

};

/* ── Expõe globalmente ── */
if (typeof window !== 'undefined') window.completarFraseData = completarFraseData;