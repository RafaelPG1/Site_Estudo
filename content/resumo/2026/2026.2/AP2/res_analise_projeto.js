/* =============================================
   NEXUS STUDY — res_analise_projeto.js
   Disciplina: analise de projeto
   ============================================= */

window.__nexusConteudo = {

aulas: [
  // aula 9
{
  aula: "Introdução a UML (Unified Modeling Language)",
  ideia_central: "A UML é uma linguagem de modelagem padronizada, mantida pela OMG, usada para especificar, visualizar, construir e documentar sistemas de software por meio de diagramas estruturais e comportamentais, como Caso de Uso, Classes, Estados, Sequência, Atividade e Componentes.",
  secoes: [
    {
      id: "introducao",
      titulo: "Introdução",
      blocos: [
        {
          tipo: "lista",
          titulo: "Objetivos do módulo",
          itens: [
            "Saber o que é UML;",
            "Conhecer os tipos de diagramas;",
            "Identificar quais os diagramas UML mais usados."
          ]
        },
        {
          tipo: "texto",
          texto: "Neste módulo, você mergulhará no mundo da **Unified Modeling Language (UML)**, uma ferramenta essencial no design e na construção de sistemas de software modernos. A UML é uma linguagem de modelagem padrão amplamente reconhecida, usada para **especificar, visualizar, construir e documentar** os artefatos de um sistema de software. Mais do que apenas uma ferramenta técnica, essa linguagem serve como uma **ponte de comunicação entre os desenvolvedores e outras partes interessadas**, permitindo uma compreensão clara e compartilhada do sistema em desenvolvimento."
        },
        {
          tipo: "texto",
          texto: "Este módulo começará com uma exploração das origens da Unified Modeling Language, sua evolução ao longo do tempo, e a importância de sua adoção em diversas indústrias. Além disso, você conhecerá os diferentes tipos de diagramas que compõem essa linguagem de modelagem e os seus propósitos específicos dentro do ciclo de vida do desenvolvimento de software. Serão apresentados alguns dos principais diagramas, como os de **Caso de Uso**, **Classes**, **Sequência** e **Atividade**, a partir da modelagem de um sistema fictício que será modelado."
        },
        {
          tipo: "texto",
          texto: "Ao final deste módulo, você estará capacitado a identificar e a utilizar os diagramas UML mais comuns, compreendendo as suas funcionalidades e a forma como se inter-relacionam no contexto de um projeto de software."
        }
      ]
    },
    {
      id: "intro_uml",
      titulo: "1 Introdução à Unified Modeling Language",
      blocos: [
        {
          tipo: "texto",
          texto: "A **Unified Modeling Language (UML)** é uma linguagem de modelagem que foi criada para fornecer uma **maneira padronizada de visualizar o design de um sistema**. Surgiu na **década de 1990** como uma fusão das melhores práticas de modelagem de diferentes metodologias orientadas a objetos. A UML rapidamente se tornou o **padrão de fato** para modelagem de sistemas, sendo adotada por profissionais de software ao redor do mundo."
        },
        {
          tipo: "texto",
          texto: "A entidade responsável por manter e evoluir a especificação da UML é a **Object Management Group (OMG)**, uma organização internacional que desenvolve padrões abertos e mantém várias especificações no domínio de Tecnologia da Informação."
        }
      ]
    },
    {
      id: "conceitos_adocao",
      titulo: "1.1 Conceitos básicos e adoção da UML",
      blocos: [
        {
          tipo: "texto",
          texto: "A **Unified Modeling Language (UML)** é baseada em uma arquitetura de **metamodelagem** desenvolvida pela **Object Management Group (OMG)**, que define os fundamentos e a estrutura da linguagem. Essa linguagem foi projetada para fornecer uma forma padronizada de visualizar o design de sistemas complexos, especialmente em projetos de software. Ela unifica as melhores práticas de diversas metodologias orientadas a objetos e é amplamente adotada em várias indústrias devido à sua versatilidade e à precisão."
        },
        {
          tipo: "topico",
          titulo: "Estereótipos (Stereotypes)",
          texto: "Entre os conceitos fundamentais da UML, estão os **Estereótipos (Stereotypes)**, que são usados para estender os elementos de modelagem da UML, permitindo a personalização de modelos. Os estereótipos ajudam a adaptar a UML para diferentes domínios e contextos, oferecendo uma forma de adicionar informações adicionais aos elementos do modelo."
        },
        {
          tipo: "topico",
          titulo: "Notação de Cardinalidade (Cardinality Notation)",
          texto: "Além dos estereótipos, a UML incorpora a **Notação de Cardinalidade (Cardinality Notation)**, que é usada para especificar quantidades em relacionamentos, como o número de instâncias de uma classe que podem se associar a instâncias de outra classe. Por exemplo, na modelagem de um sistema de biblioteca, um livro pode estar associado a um ou mais autores, e essa relação é indicada pela notação de cardinalidade, como **“1..*” (um para muitos)**. O diagrama de classes, correspondente a este exemplo, pode ser visto na Figura 1."
        },
        {
          tipo: "imagem",
          src: "figura_1_diagrama_de_classes_com_notacao_de_cardinalidade.png",
          pasta: "imagens_analise_projeto/aula_09",
          alt: "Figura 1 – Diagrama de Classes com Notação de Cardinalidade. Duas classes, Livro (atributos titulo, isbn e anoPublicacao; métodos adicionarAutor, removerAutor e getAutores) e Autor (atributos nome e nacionalidade; método escreverLivro), ligadas pela associação “tem”, com cardinalidade 1 do lado de Livro e 0..* do lado de Autor.",
          num: 1
        },
        {
          tipo: "topico",
          titulo: "Diagrama",
          texto: "Na UML, um **diagrama** é um elemento fundamental. Ele é definido como representação gráfica que descreve a estrutura ou o comportamento de um sistema, usando símbolos padronizados. Essa linguagem oferece vários tipos de diagramas, como **diagramas de classes**, **diagramas de casos de uso**, **diagramas de sequência**, entre outros, cada um com uma função específica dentro do processo de design de software."
        },
        {
          tipo: "texto",
          texto: "No contexto de design de software, a UML é uma ferramenta valiosa para criar modelos que servem como um guia para a implementação. Ela permite a visualização antecipada de problemas potenciais, além de facilitar a comunicação entre os membros da equipe de desenvolvimento e outras partes interessadas."
        },
        {
          tipo: "texto",
          texto: "Quanto à adoção da UML, ela é amplamente utilizada em diferentes métodos de desenvolvimento de software, desde metodologias tradicionais como o **Cascata (Waterfall)** até metodologias ágeis como o **Scrum**. Ela se adapta bem a diferentes abordagens de desenvolvimento devido à sua flexibilidade e à capacidade de representar tanto aspectos estruturais quanto comportamentais de sistemas complexos."
        },
        {
          tipo: "texto",
          texto: "A UML não só facilita a comunicação entre desenvolvedores, arquitetos e analistas, mas também serve como um **documento vivo** que pode ser mantido ao longo do ciclo de vida do software, garantindo que todos os *stakeholders* tenham uma visão clara e atualizada do sistema em desenvolvimento."
        }
      ]
    },
    {
      id: "versoes",
      titulo: "1.2 Versões da UML e as suas diferenças",
      blocos: [
        {
          tipo: "texto",
          texto: "A *Unified Modelling Language* evoluiu ao longo do tempo, com várias versões sendo lançadas para acomodar novas necessidades e melhorar a linguagem. O Quadro 1 apresenta uma comparação entre as versões principais da UML."
        },
        {
          tipo: "tabela",
          titulo: "Quadro 1 – Evolução temporal da UML",
          colunas: ["Versão", "Ano", "Descrição e Novidades"],
          linhas: [
            ["UML 1.1", "1997", "Primeira versão adotada pela OMG, padronizando os diferentes métodos de modelagem orientada a objetos (**OMT**, **Booch** e **OOSE**). Introduziu os principais diagramas estruturais e comportamentais."],
            ["UML 1.3", "1999", "Revisão para resolver inconsistências e ambiguidades, refinando os conceitos e a semântica dos elementos de modelagem."],
            ["UML 1.3", "2001", "Introduziu pequenas melhorias e correções na notação e nas definições dos elementos de modelagem, como os relacionamentos entre classes."],
            ["UML 1.5", "2003", "Foco na melhoria da interoperabilidade e clareza da especificação, incluindo a padronização do **XML Metadata Interchange (XMI)** para a troca de modelos UML entre diferentes ferramentas."],
            ["UML 2.0", "2005", "Grande revisão que introduziu uma arquitetura mais robusta e modular, dividida em quatro partes principais: Superestrutura, Infraestrutura, OCL e *Diagram Interchange*. Adicionou novos diagramas, como o de Componentes e Pacotes, e revisou a semântica dos diagramas existentes."],
            ["UML 2.1.1 e 2.1.2", "2007", "Melhorias incrementais para a especificação, corrigindo erros e aprimorando a documentação dos recursos introduzidos na versão 2.0."],
            ["UML 2.2", "2007", "Introduziu revisões adicionais na notação e nos **metamodelos**, aumentando a precisão e a usabilidade das ferramentas UML."],
            ["UML 2.3", "2010", "Foco em pequenas correções e otimizações, sem grandes mudanças estruturais na linguagem."],
            ["UML 2.4.1", "2011", "Simplificação e atualização da arquitetura de especificação, continuando o processo de refinamento iniciado nas versões anteriores."],
            ["UML 2.5", "2012-2015", "Redefinição significativa que simplificou a estrutura do documento de especificação, integrando Superestrutura e Infraestrutura em uma única especificação. Foco na clareza e simplificação da linguagem."],
            ["UML 2.5.1", "2017", "Revisão menor, com correções de inconsistências e melhorias na definição dos elementos de modelagem, mantendo a simplicidade introduzida na versão 2.5."]
          ]
        },
        {
          tipo: "lista",
          titulo: "Notas de rodapé do Quadro 1",
          itens: [
            "**OMT (Object Modeling Technique):** é uma técnica de modelagem orientada a objetos que foi desenvolvida para facilitar a análise e o design de sistemas complexos.",
            "**Booch:** o método Booch é uma abordagem abrangente para a análise e design de sistemas orientados a objetos.",
            "**OOSE (Object-Oriented Software Engineering):** é uma metodologia de engenharia de software orientada a objetos que introduziu o conceito de casos de uso (*use cases*), uma forma de capturar e descrever os requisitos funcionais de um sistema do ponto de vista do usuário final.",
            "**Metamodelos:** são modelos que descrevem a estrutura e a semântica dos próprios modelos UML. Em outras palavras, estes modelos definem conceitos e as regras que os modelos UML devem seguir."
          ]
        }
      ]
    },
    {
      id: "tipos_diagramas",
      titulo: "2 Tipos de diagramas da Unified Modeling Language",
      blocos: [
        {
          tipo: "texto",
          texto: "A UML oferece uma gama de diagramas que podem ser divididos em duas categorias principais: **Diagramas Estruturais** e **Diagramas Comportamentais ou Dinâmicos**."
        },
        {
          tipo: "lista",
          titulo: "As duas categorias",
          itens: [
            "**Diagramas Estruturais:** se concentram nos elementos estáticos do sistema, como classes, objetos e componentes.",
            "**Diagramas Comportamentais ou Dinâmicos:** se concentram no comportamento do sistema ao longo do tempo, incluindo a interação entre objetos e a transição de estados."
          ]
        }
      ]
    },
    {
      id: "funcionalidades",
      titulo: "2.1 Diagramas UML e as suas funcionalidades",
      blocos: [
        {
          tipo: "texto",
          texto: "O quadro a seguir (Quadro 2) oferece uma visão geral dos principais diagramas UML e as suas finalidades, destacando como elementos de um diagrama são usados em outros."
        },
        {
          tipo: "tabela",
          titulo: "Quadro 2 – Diagramas UML e as suas funcionalidades",
          colunas: ["Tipo de Diagrama", "Finalidade", "Relações com Outros Diagramas"],
          linhas: [
            ["Diagrama de Classes", "Define a estrutura estática do sistema, mostrando classes, atributos, métodos e relacionamentos.", "Classes definidas aqui são usadas em Diagramas de Objetos, Diagramas de Sequência e Diagramas de Componentes."],
            ["Diagrama de Objetos", "Representa uma instância do Diagrama de Classes em um momento específico.", "Mostra instâncias das classes definidas no Diagrama de Classes."],
            ["Diagrama de Componentes", "Mostra a organização e dependências dos componentes do sistema.", "Componentes podem conter classes definidas no Diagrama de Classes e ser implantados em Diagramas de Implantação."],
            ["Diagrama de Implantação", "Modela a distribuição física dos artefatos em nós da rede.", "Relaciona-se com Diagramas de Componentes e Diagramas de Estrutura Composta para mostrar como o sistema é distribuído fisicamente."],
            ["Diagrama de Pacotes", "Agrupa elementos relacionados do modelo.", "Pacotes podem agrupar classes, componentes e outros pacotes, influenciando a organização de outros diagramas."],
            ["Diagrama de Estrutura Composta", "Detalha a estrutura interna de um elemento, como uma classe ou componente.", "Complementa Diagramas de Classes e Diagramas de Componentes."],
            ["Diagrama de Perfil", "Permite a extensão da UML através de estereótipos personalizados.", "Estende Diagramas de Classes e outros diagramas estruturais com estereótipos específicos."],
            ["Diagrama de Caso de Uso", "Descreve as interações de atores externos com o sistema.", "Casos de uso influenciam a criação de Diagramas de Sequência, Diagramas de Atividade e Diagramas de Máquina de Estados."],
            ["Diagrama de Estados", "Mostra como os objetos mudam de estado em resposta a eventos.", "Relaciona-se com Diagramas de Classes (mostrando os estados de objetos) e Diagramas de Atividade."],
            ["Diagrama de Atividade", "Modela o fluxo de atividades dentro de um processo.", "Pode detalhar casos de uso ou etapas em um Diagrama de Sequência."],
            ["Diagrama de Sequência", "Descreve a interação entre objetos ao longo do tempo.", "As classes usadas vêm do Diagrama de Classes, e os objetos do Diagrama de Objetos são usados aqui."],
            ["Diagrama Visão Geral de Interação", "Dá uma visão geral das interações no sistema, combinando Diagramas de Sequência, de Atividade e de Tempo.", "Integra informações de outros diagramas de interação, oferecendo uma visão de alto nível do fluxo de controle."],
            ["Diagrama de Colaboração", "Mostra a relação entre objetos que colaboram para um comportamento específico.", "Complementa Diagramas de Sequência, mostrando uma visão alternativa das interações."],
            ["Diagrama de Tempo", "Modela o comportamento dos objetos ao longo do tempo.", "Usado em conjunto com Diagramas de Sequência e Diagramas de Máquina de Estados para detalhar o *timing* das interações."]
          ]
        }
      ]
    },
    {
      id: "ferramentas",
      titulo: "2.2 Ferramentas de criação dos diagramas UML",
      blocos: [
        {
          tipo: "texto",
          texto: "Existem diversas ferramentas que podem ser utilizadas para criar diagramas UML, variando entre soluções pagas, *freeware* e gratuitas e *open source*. A seguir, listamos algumas dessas ferramentas. A interface gráfica de cada uma dessas ferramentas pode ser vista na Figura 2, itens a, b e c, respectivamente (Modelio, ArgoUML e PlantText)."
        },
        {
          tipo: "lista",
          titulo: "Ferramentas",
          itens: [
            "**Pagas –** Enterprise Architect, Visual Paradigm, IBM Rational Rose;",
            "***Freeware* –** Lucidchart, Draw.io;",
            "**Gratuitas e Open Source –** Modelio, ArgoUML, PlantText (online para PlantUML)."
          ]
        },
        {
          tipo: "imagem",
          src: "figura_2_interfaces_do_modelio_argouml_e_planttext.png",
          pasta: "imagens_analise_projeto/aula_09",
          alt: "Figura 2 – Interfaces do Modelio (a), ArgoUML (b) e PlantText (c). Capturas de tela das três ferramentas: o Modelio com árvore de modelo, paleta e diagrama de componentes; o ArgoUML com diagrama de classes (Shape, Polygon, Point); o PlantText com o código textual à esquerda e o diagrama de atividade gerado à direita.",
          num: 2
        },
        {
          tipo: "topico",
          titulo: "O que é o PlantUML (nota de rodapé)",
          texto: "O **PlantUML** é uma linguagem de Domínio Específico voltada para a criação de diagramas UML. Seu modo de uso é similar ao Latex, ou seja, você cria o diagrama através de comandos textuais e um compilador gera o gráfico correspondente, para diferentes formatos, como PNG e SVG."
        }
      ]
    },
    {
      id: "caso_uso",
      titulo: "3 Conhecendo um pouco mais sobre os diagramas UML | 3.1 Diagrama de caso de uso",
      blocos: [
        {
          tipo: "texto",
          texto: "Para aprofundar o entendimento sobre UML, vamos explorar alguns dos principais diagramas UML usados no desenvolvimento de sistemas de informação. Nas seções a seguir, os diagramas de **Caso de Uso**, **Classes**, **Estados**, **Sequência**, **Atividades** e **Componentes** serão descritos e exemplificados."
        },
        {
          tipo: "subtitulo",
          texto: "3.1 Diagrama de caso de uso"
        },
        {
          tipo: "texto",
          texto: "Os **Diagramas de Caso de Uso** no UML são utilizados para representar as interações entre usuários (atores) e o sistema. Eles ajudam a capturar os requisitos funcionais de um sistema, mostrando **quem** (atores) realiza **o que** (casos de uso) no sistema. Os seus principais elementos são apresentados no Quadro 3."
        },
        {
          tipo: "tabela",
          titulo: "Quadro 3 – Elementos de um Diagrama de Caso de Uso",
          colunas: ["Elemento", "Descrição", "Representação Gráfica"],
          linhas: [
            ["Ator (*Actor*)", "Representa um papel desempenhado por um usuário ou outro sistema que interage com o sistema em questão.", "Boneco com o rótulo “Admin”."],
            ["Caso de Uso (*Use Case*)", "Descreve uma funcionalidade específica que o sistema oferece ao ator.", "Retângulo de cantos arredondados com o rótulo “Cadastrar”."],
            ["Sistema (*System*)", "Representado como um retângulo que engloba os casos de uso, mostrando que eles pertencem ao sistema.", "Retângulo com a aba “Sistema” contendo o caso de uso “Login”."],
            ["Associação (*Association*)", "Representa a interação entre um ator e um caso de uso. É representado por **uma seta com a ponta preenchida**, partindo do ator e chegando ao Caso de Uso.", "Seta do ator “User” para o caso de uso “Login”."],
            ["Generalização (*Generalization*)", "Representa uma herança entre atores ou entre casos de uso. Representado por uma seta de ponta vazada, partindo do elemento geral para o especializado. Os elementos generalizados podem ser atores ou casos de uso.", "Seta entre os atores “Admin” e “User”."],
            ["Inclusão (*Include*)", "Representa a inclusão de um caso de uso em outro. É usado para compartilhar comportamento comum entre casos de uso.", "Seta rotulada <<include>> de “Login” para “Autenticação”."],
            ["Extensão (*Extend*)", "Representa um ponto de extensão onde um caso de uso pode ser estendido por outro sob certas condições.", "Seta rotulada <<extend>> de “Recuperar Senha” para “Login”."]
          ]
        },
        {
          tipo: "imagem",
          src: "quadro_3_elementos_de_um_diagrama_de_caso_de_uso.png",
          pasta: "imagens_analise_projeto/aula_09",
          alt: "Quadro 3 – Elementos de um Diagrama de Caso de Uso. Tabela com sete elementos (ator, caso de uso, sistema, associação, generalização, inclusão e extensão), cada um com descrição e o símbolo gráfico correspondente, incluindo os estereótipos <<include>> e <<extend>> nas setas.",
          num: 3
        },
        {
          tipo: "texto",
          texto: "Um exemplo de diagrama de Caso de Uso, com todos os componentes apresentados no quadro, pode ser visto na Figura 3."
        },
        {
          tipo: "imagem",
          src: "figura_3_diagrama_de_caso_de_uso_usando_todos_os_componentes_descritos_no_quadro_3.png",
          pasta: "imagens_analise_projeto/aula_09",
          alt: "Figura 3 – Diagrama de Caso de Uso usando todos os componentes descritos no Quadro 3. O ator User se associa aos casos de uso Login e Cadastrar dentro do retângulo Sistema; Admin se liga a User por generalização; Login inclui Autenticação (<<include>>) e é estendido por Recuperar Senha (<<extend>>).",
          num: 4
        }
      ]
    },
    {
      id: "classes",
      titulo: "3.2 Diagrama de classes",
      blocos: [
        {
          tipo: "texto",
          texto: "Um **Diagrama de Classes** é uma representação visual que descreve a estrutura estática de um sistema, mostrando as suas **classes**, **atributos**, **métodos** e os **relacionamentos** entre essas classes. A Figura 4 oferece uma vista de um Diagrama de Classes genérico, em UML."
        },
        {
          tipo: "imagem",
          src: "figura_4_diagrama_de_classes_para_a_exemplificacao_dos_seus_componentes.png",
          pasta: "imagens_analise_projeto/aula_09",
          alt: "Figura 4 – Diagrama de Classes para a exemplificação dos seus componentes. Três classes genéricas (Classe_1, Classe_2, Classe_3) com atributos e métodos tipados; Classe_1 e Classe_2 ligadas pela associação “contém” (cardinalidades 1 e 0..*); Classe_2 e Classe_3 ligadas por uma linha que termina em losango preenchido.",
          num: 5
        },
        {
          tipo: "texto",
          texto: "Vejamos, a seguir, cada um dos componentes vistos no diagrama apresentado na Figura 4."
        },
        {
          tipo: "topico",
          titulo: "Nome da Classe",
          texto: "Cada classe no diagrama é representada por um **retângulo**, que é dividido em três seções. Na seção superior do retângulo que representa a classe está localizado o **nome da classe**, que deve ser único dentro do contexto do diagrama. Esse nome é essencial para identificar o papel que a classe desempenha no sistema."
        },
        {
          tipo: "topico",
          titulo: "Atributos",
          texto: "A seção do meio do retângulo que representa a classe contém os **atributos** da classe, que representam as **propriedades** ou **características** que cada instância dessa classe terá. Atributos podem incluir, por exemplo, um **identificador único (id)**, um **nome (nome)** ou outras propriedades relevantes ao contexto da classe."
        },
        {
          tipo: "topico",
          titulo: "Métodos",
          texto: "A seção inferior do retângulo lista os **métodos** da classe, que são as operações ou funções que as instâncias da classe podem realizar. Os métodos **definem o comportamento da classe** e como ela **interage com outras classes** ou com dados internos."
        },
        {
          tipo: "topico",
          titulo: "Cardinalidade entre as Classes",
          texto: "Um dos elementos importantes de um diagrama de classes é a **cardinalidade**, que descreve o **número de instâncias de uma classe que podem se relacionar às instâncias de outra classe**. Por exemplo, em um relacionamento de “classe se relaciona com pelo menos uma ou mais instâncias da outra classe” (**1..***) entre duas classes, a cardinalidade indicará que uma instância de uma classe pode estar associada a várias instâncias de outra classe."
        },
        {
          tipo: "texto",
          texto: "A cardinalidade é representada por notações como, por exemplo, **“1” (uma para uma)**, **“*” (uma para muitas)** ou **“1..*” (uma para pelo menos uma ou mais)**, ao lado das linhas que conectam as classes."
        }
      ]
    },
    {
      id: "estados",
      titulo: "3.3 Diagrama de estados",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Diagrama de Estados** é uma representação gráfica utilizada para modelar o comportamento dinâmico de um sistema, mostrando como os objetos mudam de estado em resposta a eventos específicos. Esse tipo de diagrama está intimamente relacionado ao conceito de **Máquina de Estados Finita**."
        },
        {
          tipo: "topico",
          titulo: "Máquina de Estados Finita (ou Autômato Finito)",
          texto: "Uma **Máquina de Estados Finita (ou Autômato Finito)** é um modelo matemático utilizado para representar sistemas que podem estar em um número finito de estados. A máquina transita de um estado para outro em resposta a eventos ou condições, tornando-se uma ferramenta poderosa para descrever o comportamento sequencial de sistemas reativos, onde o estado atual do sistema depende de estados anteriores e dos eventos ocorridos."
        },
        {
          tipo: "exemplo",
          titulo: "Sistema de abertura e fechamento de porta (door)",
          texto: "A Figura 5 apresenta uma máquina de estados finita simples, que representa um sistema de abertura e fechamento de porta (*door*). O sistema possui dois **estados**, “*opened*” e “*closed*”; duas **transições de estado** (representadas pelas setas e suas condições) e duas **condições de transição** ou **eventos** (“*open*” e “*close*”). A transição “open” ocorre quando a ação de abrir a porta é realizada, mudando o estado da porta de “*closed*” (fechado) para “*opened*” (aberto). Já a “close” ocorre quando a ação de fechar a porta é realizada, mudando o estado da porta de “*opened*” (aberto) para “*closed*” (fechado).",
          detalhe: "As condicionais de transição são ativadas pela **ação de entrada (*entry actions*)**, representada pelo “E:”, seguido das suas respectivas ações “*close door*” ou “*open door*”. Ou seja, se estou no estado “*opened*”, a ação de entrada (evento que pode ocorrer) é a de abrir a porta. Se estou no estado “*closed*”, a ação de entrada será o de fechar a porta."
        },
        {
          tipo: "imagem",
          src: "figura_5_maquina_de_estados_finita_de_um_sistema_de_abertura_e_fechamento_de_porta.png",
          pasta: "imagens_analise_projeto/aula_09",
          alt: "Figura 5 – Máquina de Estados Finita de um sistema de abertura e fechamento de porta. Dois círculos representam os estados “1 opened” (E: open door) e “2 closed” (E: close door), ligados por duas setas curvas rotuladas “open” e “close”; legendas laterais indicam state, transition, transition condition e entry action. Fonte: Wikimedia.",
          num: 6
        },
        {
          tipo: "destaque",
          texto: "PARADA OBRIGATÓRIA – Modelagem Formal: a Modelagem Formal refere-se ao uso de modelos matemáticos rigorosos para representar e analisar sistemas. No contexto de sistemas de software, uma modelagem formal como a Máquina de Estados proporciona precisão na definição do comportamento do sistema, permitindo a verificação de sua correção por meio de técnicas matemáticas e lógicas. Isso é especialmente útil para sistemas críticos onde erros podem ter consequências graves."
        },
        {
          tipo: "destaque",
          texto: "PARADA OBRIGATÓRIA – A relação entre uma Máquina de Estados e um Diagrama de Estados é que o diagrama serve como uma visualização intuitiva da máquina. Enquanto a Máquina de Estados fornece a base teórica e formal para a modelagem do comportamento do sistema, o diagrama permite que esse comportamento seja representado de forma clara e acessível, facilitando a compreensão e a comunicação entre os desenvolvedores, analistas e outras partes interessadas no projeto."
        },
        {
          tipo: "texto",
          texto: "O Diagrama de Estados é, portanto, uma representação gráfica dessa modelagem formal, onde os principais componentes são os seguintes:"
        },
        {
          tipo: "lista",
          titulo: "Componentes do Diagrama de Estados",
          itens: [
            "**Estados –** Representam as diferentes condições ou situações em que o objeto ou sistema pode estar. No diagrama, os estados são geralmente representados por retângulos com os nomes dos estados escritos dentro deles;",
            "**Transições –** São as linhas que conectam os estados e indicam a mudança de um estado para outro. Cada transição é acionada por um evento ou condição específica, que é rotulado na linha da transição;",
            "**Eventos –** São os gatilhos que causam a transição de um estado para outro. Eles podem ser ações do usuário, sinais do sistema ou qualquer condição que altere o estado do objeto;",
            "**Ações –** Opcionalmente, podem ser associadas às transições e representam atividades que ocorrem durante a transição de um estado para outro."
          ]
        },
        {
          tipo: "texto",
          texto: "No início do diagrama, é colocado um **círculo preenchido que representa** o **estado inicial** do sistema ou objeto, indicando o **ponto de partida do processo** de transição de estados. Este é o estado em que o objeto ou sistema se encontra antes de qualquer evento ocorrer. No final do diagrama, é colocado um **círculo alvo que representa** o **estado final**, que indica o ponto onde o processo ou **ciclo de estados** termina."
        },
        {
          tipo: "destaque",
          texto: "PARADA OBRIGATÓRIA – Nem todos os diagramas de transição de estados têm um estado final, mas quando presente, ele simboliza a conclusão do ciclo de vida do objeto ou sistema dentro daquele contexto."
        }
      ]
    },
    {
      id: "sequencia",
      titulo: "3.4 Diagrama de sequência",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Diagrama de Sequência** é usado para modelar a interação entre diferentes objetos ou componentes de um sistema ao **longo do tempo**. Ele é especialmente útil para **visualizar a ordem das mensagens trocadas entre os objetos durante a execução de um determinado processo ou caso de uso**. Justamente por “capturar” a interação entre os objetos de um sistema, este diagrama é classificado como sendo do **tipo comportamental ou dinâmico**. O Quadro 4 apresenta os seus principais componentes."
        },
        {
          tipo: "tabela",
          titulo: "Quadro 4 – Componentes de um Diagrama de Sequência",
          colunas: ["Elemento", "Descrição", "Representação Gráfica"],
          linhas: [
            ["Objetos (*Participants*)", "Representam as entidades que participam da interação. Podem ser classes, componentes ou instâncias específicas.", "Caixa de cantos arredondados com o nome, por exemplo “Usuário”."],
            ["Linha de Vida (*Lifeline*)", "Representa a existência de um objeto durante o tempo de interação. É uma **linha vertical tracejada** que desce a partir do objeto.", "Linha vertical tracejada abaixo da caixa “Banco de Dados”."],
            ["Mensagens (*Messages*)", "Representam a comunicação entre os objetos, indicando a **chamada de método ou mensagem síncrona ou uma mensagem assíncrona (ou método)**.", "(ver as duas linhas seguintes)"],
            ["Mensagens (*Messages*) – síncrona ou chamada de método", "Nos dois primeiros casos, a mensagem é representada por **um texto e uma seta com linha contínua** (*solid line*) com seta fechada (nota 7).", "Seta contínua com ponta fechada, rotulada “Mensagem” (Mensagem Síncrona ou chamada de método)."],
            ["Mensagens (*Messages*) – assíncrona", "No último caso, é representado por **texto com uma linha contínua com seta vazada**.", "Seta contínua com ponta vazada, rotulada “Mensagem” (Mensagem Assíncrona)."],
            ["Ativação (*Activation Bar*)", "Representa o período em que um objeto está ativo, ou seja, processando uma operação. É representado por uma **barra vertical** colocada sobre a linha de vida do objeto.", "Barras verticais sobre as linhas de vida de “Usuário” e “Sistema”, com as mensagens “Req Login”, “Form Login” e “Credenciais”."],
            ["Retorno (*Return Message*)", "Representa a resposta ou o retorno de uma mensagem, geralmente com um **valor** ou **confirmação** de conclusão.", "Seta tracejada rotulada “Confirmação” entre “Sistema” e “Usuário”."],
            ["Fragmentos de Controle – Alt", "**Alt:** Representa condições alternativas (*if/else*).", "Caixa “alt” com as condições [Credenciais Válidas] (Exibir Dashboard) e [Credenciais Inválidas] (Mostrar Erro), após a mensagem “Enviar Credenciais”."],
            ["Fragmentos de Controle – Loop", "*Loop:* Representa uma repetição de mensagens.", "Caixa “loop” com [Tentativas de Login] contendo a mensagem “Nova Tentativa de Login”."],
            ["Fragmentos de Controle – Opt", "*Opt:* Representa uma condição opcional.", "Caixa “opt” com [Código de Recuperação], com as mensagens “Código” e “Ok”, entre Usuário, Sistema e Mail Server, após a mensagem “Recuperar Senha”."]
          ]
        },
        {
          tipo: "imagem",
          src: "quadro_4_componentes_de_um_diagrama_de_sequencia.png",
          pasta: "imagens_analise_projeto/aula_09",
          alt: "Quadro 4 – Componentes de um Diagrama de Sequência. Tabela com objetos, linha de vida, mensagens síncronas e assíncronas, barra de ativação, retorno e os fragmentos de controle alt, loop e opt, cada um com seu símbolo e exemplos envolvendo Usuário, Sistema e Mail Server.",
          num: 7
        },
        {
          tipo: "texto",
          texto: "Nota de rodapé 7: no caso das mensagens síncronas, também é colocado o ***Activation Bar*** para definir o período da mensagem."
        }
      ]
    },
    {
      id: "atividade",
      titulo: "3.5 Diagrama de atividade",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Diagrama de Atividade** é utilizado para modelar o fluxo de atividades em um sistema ou processo. Ele representa o comportamento dinâmico de um sistema, mostrando o fluxo de controle de uma atividade para outra. É especialmente útil para **descrever processos** de negócios ou fluxos de trabalho detalhados."
        },
        {
          tipo: "texto",
          texto: "Os principais componentes de um diagrama de atividade podem ser vistos no Quadro 5."
        },
        {
          tipo: "tabela",
          titulo: "Quadro 5 – Componentes de um Diagrama de Atividade",
          colunas: ["Elemento", "Descrição", "Representação Gráfica"],
          linhas: [
            ["*Start* e *Stop*", "Representa o **início (*Start*)** e o **término (*Stop*)** de um processo. São representados por um círculo preenchido e um na forma de alvo, respectivamente.", "Círculo preenchido (Start) e círculo em forma de alvo (Stop)."],
            ["Atividade (*Activity*)", "Representa uma ação ou tarefa específica que ocorre no processo.", "Retângulo de cantos arredondados “Atividade 1”."],
            ["Transição (*Transition*)", "Representa o fluxo de controle entre atividades. Geralmente, é uma **seta** que conecta uma atividade a outra.", "Seta ligando “Atividade 1” a “Atividade 2”."],
            ["Decisão (*Decision Node*)", "Representa um ponto de bifurcação no fluxo de atividades, onde o fluxo segue por diferentes caminhos com base em uma condição. Também é possível representar, através de texto, os valores que levam a decisão por seguir um dado fluxo ou outro. Por exemplo, a Figura 10 apresenta uma condição com dois valores de ativação, “**sim**” e “**não**”.", "Hexágono “Condição?” com duas saídas, para “Atividade 1” e “Atividade 2”."],
            ["Merge (*Merge Node*)", "Combina diferentes fluxos em um único fluxo após uma decisão. O elemento que combina as atividades é representado por um **losango**.", "Losango com duas entradas e uma saída."],
            ["Paralelismo por *Fork*", "Elemento de representação de paralelismo em um sistema, **dividindo o fluxo das atividades** em múltiplos fluxos paralelos.", "“Atividade 1” entrando em uma barra horizontal, da qual saem duas setas."],
            ["Paralelismo por *Join*", "Elemento de representação de paralelismo em um sistema, **reunindo fluxos paralelos** em um único fluxo.", "“Atividade 2” e “Atividade 3” entrando em uma barra horizontal, da qual sai uma seta."]
          ]
        },
        {
          tipo: "imagem",
          src: "quadro_5_componentes_de_um_diagrama_de_atividade.png",
          pasta: "imagens_analise_projeto/aula_09",
          alt: "Quadro 5 – Componentes de um Diagrama de Atividade. Tabela com Start e Stop, atividade, transição, decisão (hexágono), merge (losango), fork e join (barras horizontais), com o símbolo gráfico de cada elemento.",
          num: 8
        },
        {
          tipo: "texto",
          texto: "Um exemplo de diagrama de atividade, com todos os componentes apresentados no quadro, pode ser visto na Figura 6."
        },
        {
          tipo: "imagem",
          src: "figura_6_diagrama_de_atividade_usando_todos_os_componentes_descritos_no_quadro_5.png",
          pasta: "imagens_analise_projeto/aula_09",
          alt: "Figura 6 – Diagrama de Atividade usando todos os componentes descritos no Quadro 5. Fluxo do círculo Start para “Início da Atividade”, decisão “Condição?” com Atividade 1 e Atividade 2, merge em losango, fork para Atividade 3 e Atividade 4 em paralelo, join, “Atividade Final” e círculo alvo (Stop).",
          num: 9
        },
        {
          tipo: "destaque",
          texto: "MULTIMÍDIA – Uma boa abordagem sobre UML pode ser vista no vídeo produzido pelo FreeCodeCamp.org, em seu canal do Youtube (em inglês). Fonte: FreeCodeCamp (2021)."
        }
      ]
    },
    {
      id: "componentes",
      titulo: "3.6 Diagrama de componentes",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Diagrama de Componentes** é um dos diagramas estruturais da UML, utilizado para ilustrar **a organização e as dependências entre os componentes de um sistema**."
        },
        {
          tipo: "texto",
          texto: "Esse diagrama desempenha um papel importante nas etapas avançadas do desenvolvimento de software, proporcionando uma compreensão clara de como os componentes do sistema estão organizados e interagem entre si em termos de arquitetura física. Além disso, ele é utilizado para auxiliar na definição da distribuição dos componentes do sistema em diferentes servidores ou ambientes de execução, contribuindo para o planejamento da implantação do sistema."
        },
        {
          tipo: "texto",
          texto: "No contexto de sistemas de informação, os **componentes** podem ser representados por **arquivos executáveis**, **bibliotecas**, **módulos**, ou quaisquer outras **unidades de código** que podem ser implantadas de forma independente."
        },
        {
          tipo: "tabela",
          titulo: "Quadro 6 – Elementos de um Diagrama de Componentes",
          colunas: ["Elemento", "Descrição", "Representação Gráfica"],
          linhas: [
            ["Componente", "Um **módulo** ou **parte do sistema** que encapsula uma funcionalidade específica. Representado por um **retângulo** com pequeno, com dois pequenos traços.", "Retângulo com o símbolo de componente, rotulado “Componente A”."],
            ["Interface", "Define um **contrato** ou **conjunto de operações** que o componente expõe para o ambiente externo. Representada por **círculos** (*lollipops*).", "“Componente A” ligado a uma elipse “Interface A”."],
            ["Dependência", "**Indica que um componente depende de outro** para funcionar. Mostrado por **setas pontilhadas** entre os componentes.", "Seta pontilhada rotulada “depende de”, de “Componente A” para “Componente B”."],
            ["Artefato", "Representa o **resultado de um processo de desenvolvimento**, como um **arquivo binário** ou ***script***. Associado a componentes para indicar implementação. Na figura ao lado, usamos a extensão “**JAR**”, que se refere a um componente Java.", "Caixa com canto dobrado, rotulada “Arquivo.jar”."]
          ]
        },
        {
          tipo: "imagem",
          src: "quadro_6_elementos_de_um_diagrama_de_componentes.png",
          pasta: "imagens_analise_projeto/aula_09",
          alt: "Quadro 6 – Elementos de um Diagrama de Componentes. Tabela com componente, interface, dependência e artefato, mostrando o retângulo com símbolo de componente, a interface ligada ao componente, a seta pontilhada “depende de” e o ícone de arquivo Arquivo.jar.",
          num: 10
        },
        {
          tipo: "exemplo",
          titulo: "Diagrama de Componentes do sistema de gerenciamento de biblioteca",
          texto: "No exemplo apresentado na Figura 7, o diagrama ilustra a relação entre os componentes do sistema de gerenciamento de biblioteca. O “**Gerenciador de Biblioteca**” utiliza o “**Sistema de Autenticação**”, que por sua vez depende de uma “**Base de Dados**”. Além disso, o diagrama mostra que os componentes são **implementados por artefatos específicos**, representando arquivos de código compilados."
        },
        {
          tipo: "imagem",
          src: "figura_7_exemplo_de_um_diagrama_de_componentes.png",
          pasta: "imagens_analise_projeto/aula_09",
          alt: "Figura 7 – Exemplo de um Diagrama de Componentes. Dentro do pacote “Gerenciamento de Biblioteca”, o componente Gerenciamento de Biblioteca usa o Sistema de Autenticação e expõe a Interface de Gerenciamento; o Sistema de Autenticação depende da Base de Dados e expõe a Interface de Autenticação; os dois componentes principais são implementados pelos artefatos biblioteca.jar e autenticacao.jar.",
          num: 11
        }
      ]
    },
    {
      id: "consideracoes_finais",
      titulo: "Considerações finais",
      blocos: [
        {
          tipo: "texto",
          texto: "Neste módulo, abordamos os fundamentos da **UML (*Unified Modeling Language*)**, explorando sua importância no desenvolvimento de sistemas de software. Você aprendeu sobre a história da UML, os seus conceitos básicos e os diversos tipos de diagramas utilizados."
        },
        {
          tipo: "texto",
          texto: "Para quem está começando, a UML pode parecer complexa, mas com prática, os seus benefícios se tornam evidentes, especialmente na clareza e na organização que ela traz ao processo de desenvolvimento."
        },
        {
          tipo: "texto",
          texto: "No próximo módulo, **MÓDULO 10: Diagramas UML I**, vamos aprofundar nossa compreensão, focando em diagramas específicos como o **Diagrama de Caso de Uso**, **Diagrama de Classes** e **Diagrama de Sequência**, e aprender como relacionar essas representações em código utilizando uma linguagem de programação."
        }
      ]
    }
  ]
},

// aula 10
{
  aula: "Diagramas UML I",
  ideia_central: "Aplicar a UML, com a linguagem PlantUML, na modelagem de um sistema fictício, o Sistema de Controle de Biblioteca (SCB), partindo do documento de visão e das User Stories para construir os diagramas de caso de uso, de classes e de sequência.",
  secoes: [
    {
      id: "introducao",
      titulo: "Introdução",
      blocos: [
        {
          tipo: "lista",
          titulo: "Objetivos do módulo",
          itens: [
            "Conhecer diagrama de casos de uso;",
            "Conhecer diagrama de classes;",
            "Conhecer diagrama de sequência."
          ]
        },
        {
          tipo: "texto",
          texto: "Neste módulo, abordaremos a criação de diagramas **Unified Modeling Language (UML)** como uma etapa essencial no desenvolvimento de sistemas orientados a objetos. Os principais tópicos tratados são os **diagramas de casos de uso**, **diagramas de classes** e **diagramas de sequência**, que desempenham papéis fundamentais na modelagem de sistemas. Iremos descrever com maior profundidade estes diagramas e o seu uso prático para o processo de modelagem de sistemas."
        },
        {
          tipo: "texto",
          texto: "O exemplo utilizado ao longo do módulo é um **Sistema de Controle de Biblioteca (SCB)**, o qual facilita a gestão de livros, usuários, empréstimos e devoluções. Através desse exemplo, os conceitos são aplicados para ilustrar como a modelagem com UML pode transformar requisitos funcionais em diagramas estruturados e dinâmicos, possibilitando uma visualização clara do comportamento e das interações entre as partes do sistema."
        },
        {
          tipo: "texto",
          texto: "Destacaremos o uso da linguagem **PlantUML** como uma ferramenta prática, que nos permite a criação de diagramas de forma ágil e flexível. É ressaltada sua utilidade para padronizar diagramas e facilitar a comunicação entre as equipes de desenvolvimento e os *stakeholders*."
        },
        {
          tipo: "texto",
          texto: "A importância do assunto abordado reside na capacidade de abstrair e representar de forma visual as interações e a estrutura do sistema, tornando a comunicação e o entendimento mais acessíveis e precisos para todas as partes envolvidas. O domínio dessas ferramentas melhora a eficiência do desenvolvimento e ajuda na antecipação de problemas de integração e implementação."
        }
      ]
    },
    {
      id: "diagramas_em_projetos",
      titulo: "1 Utilizando diagramas UML em projetos",
      blocos: [
        {
          tipo: "texto",
          texto: "No módulo anterior, apresentamos uma visão geral dos diagramas da *Unified Modelling Language (UML)*, detalhando um pouco mais alguns dos seus diagramas, para que você pudesse conhecê-los melhor e aplicá-los em sistemas reais."
        },
        {
          tipo: "texto",
          texto: "Neste módulo, iremos aplicar os conhecimentos trabalhados anteriormente em um cenário de projeto fictício de um sistema de controle de livros de uma biblioteca chamado **Sistema de Controle de Biblioteca (SCB)**."
        },
        {
          tipo: "texto",
          texto: "Será usada a linguagem **PlantUML** para definição dos diagramas e apresentaremos o código da aplicação, feito na linguagem de programação **Javascript** e com o ambiente de execução **Node.Js**, para que possamos trabalhar a passagem dos modelos do software para seu código, propriamente dito. No entanto, essa codificação em Javascript só será apresentada e discutida no **módulo 11**, quando terminaremos a modelagem do sistema."
        },
        {
          tipo: "destaque",
          texto: "LEITURA COMPLEMENTAR – Caso você não conheça a linguagem Javascript ou o ambiente de execução Node.js, sugerimos os seguintes tutoriais de introdução: 1. Para Javascript, sugerimos “The Modern Javascript” (Fonte: JavaScript.info); 2. Já para conhecer um pouco de Node.js, sugerimos o material presente no próprio site deste ambiente (Fonte: Nodejs.org)."
        },
        {
          tipo: "texto",
          texto: "Iniciaremos o projeto do software SCB, fazendo uma **elicitação** do sistema, definindo os seus requisitos funcionais e, por fim, realizando a modelagem UML."
        },
        {
          tipo: "texto",
          texto: "Vale ressaltarmos que a criação do sistema exigiria, também, a definição dos requisitos não-funcionais, porém, por motivos didáticos, iremos nos ater apenas aos aspectos funcionais, deixando de lado detalhes maiores de sua implementação."
        },
        {
          tipo: "texto",
          texto: "No lugar do documento de especificação dos Casos de Uso, iremos utilizar as **User Stories**, para podermos descrever de uma forma mais simples, direta e clara, cada um dos requisitos funcionais levantados."
        }
      ]
    },
    {
      id: "plantuml",
      titulo: "1.1 Um pouco sobre o PlantUML",
      blocos: [
        {
          tipo: "texto",
          texto: "Primeiramente, é importante esclarecermos uma questão sobre nós que estamos escrevendo este material. Além de professores da área de Engenharia de Software, nós que estamos elaborando este material para você, caro leitor, somos projetistas e programadores. Assim, além da teoria sobre o uso dos diagramas e ferramentas para UML, procuramos apresentar um pouco de nossa expertise na modelagem de sistemas."
        },
        {
          tipo: "texto",
          texto: "Todos os diagramas UML criados neste módulo serão feitos em **PlantUML**. Embora seja um pouco mais laborioso de usar ferramentas visuais como o **Modelio** ou o **Astah**, essa linguagem permite uma criação elegante de diagramas com **independência de plataforma**."
        },
        {
          tipo: "destaque",
          texto: "Um dos problemas que sofremos, como projetistas de software, quanto ao uso de ferramentas visuais para a construção de diagramas UML está relacionada à interoperatividade dos formatos de arquivo gerados por elas. Se usarmos, por exemplo, o Astah, não seria possível ler os nossos diagramas em outras ferramentas, como o ArgoUML ou o Modelio."
        },
        {
          tipo: "texto",
          texto: "Assim, decidimos que se pudéssemos construir nossos diagramas de uma forma mais “independente” de uma determinada plataforma, seria o ideal. Foi assim que escolhemos o PlantUML."
        },
        {
          tipo: "texto",
          texto: "O **PlantUML** é uma ferramenta de **código aberto** que permite a criação de diagramas a partir de uma **linguagem de script simples**. Ela também pode ser definida como uma linguagem para a criação de **diagramas-como-código**. Os Diagramas-como-código são **definições textuais** para a construção de diagramas. Podemos fazer uma analogia entre estas ferramentas e linguagens com o **HyperText Markup Language (HTML)** ou o **Markdown**, que permitem a descrição textual de elementos que serão desenhados na tela."
        },
        {
          tipo: "texto",
          texto: "A principal vantagem da linguagem PlantUML é sua **sintaxe intuitiva**, que permite a criação rápida e fácil de diagramas Unified Modeling Language e outros tipos de diagramas gráficos, como diagramas de sequência, diagramas de atividades, diagramas de classes, entre outros. A sintaxe do PlantUML é projetada para ser fácil de escrever e ler, permitindo que diagramas complexos sejam gerados a partir de descrições textuais simples."
        },
        {
          tipo: "texto",
          texto: "Um exemplo de código em PlantUML, para construção de um Diagrama de Sequência, pode ser visto no Quadro 1, a seguir. A imagem composta a partir do código PlantUML é apresentada na Figura 1."
        },
        {
          tipo: "lista",
          titulo: "Quadro 1 - Código PlantUML correspondente ao diagrama da Figura 1",
          itens: [
            "`@startuml`",
            "`participant \"Usuário\" as User`",
            "`participant \"Sistema\" as System`",
            "`participant \"Banco de Dados\" as DB`",
            "`User -> System: Requisitar Login`",
            "`System -> User: Exibir Formulário de Login`",
            "`User -> System: Enviar Credenciais`",
            "`System -> DB: Validar Credenciais`",
            "`alt Login Válido`",
            "`DB --> System: Credenciais Válidas`",
            "`System -> User: Exibir Dashboard`",
            "`else Login Inválido`",
            "`DB --> System: Credenciais Inválidas`",
            "`System -> User: Mostrar Erro`",
            "`end`",
            "`@enduml`"
          ]
        },
        {
          tipo: "imagem",
          src: "figura_1_diagrama_de_sequencia_correspondente_ao_codigo_plantuml_do_quadro_1.png",
          pasta: "imagens_analise_projeto/aula_10",
          alt: "Figura 1 – Diagrama de Sequência correspondente ao código PlantUML do Quadro 1. Três participantes (Usuário, Sistema e Banco de Dados) trocam as mensagens Requisitar Login, Exibir Formulário de Login, Enviar Credenciais e Validar Credenciais, seguidas de um fragmento alt: [Login Válido] com Credenciais Válidas e Exibir Dashboard, e [Login Inválido] com Credenciais Inválidas e Mostrar Erro.",
          num: 1
        },
        {
          tipo: "texto",
          texto: "Com o PlantUML, podemos ter um grau de flexibilidade maior, pois essa linguagem possui ambientes online, como o **PlantText** e integrados a **IDEs** (por exemplo: Eclipse, NetBeans ou XCode) e **editores de código** (por exemplo: Visual Studio Code, Atom ou Sublime Text) ou, ainda, **suítes de escritório**, como o Google Docs e o LibreOffice. Ela também possui uma **padronização visual** dos diagramas que também nos foi muito importante na hora de decidir por seu uso."
        },
        {
          tipo: "texto",
          texto: "Outra vantagem do PlantUML é que existem algumas ferramentas de **geração de código** a partir do PlantUML, que servem para diminuir a distância entre a modelagem gráfica de um sistema, usando UML, por exemplo, e o código gerado. Um exemplo de uma ferramenta desta natureza é o **puml2code**. No entanto, é importante saber que a tradução direta UML para código em linguagem de programação não é algo simples e nenhuma ferramenta que utilizamos se mostrou realmente eficaz, neste sentido."
        },
        {
          tipo: "destaque",
          texto: "Porém, é bom deixarmos claro que, para sistemas muito complexos, é importante escolher uma ferramenta que possa ser visual e, ao mesmo tempo, que gere um código padronizado, como o PlantUML. Isso pode simplificar o trabalho a ser executado, mantendo as vantagens de se trabalhar com uma linguagem padronizada."
        }
      ]
    },
    {
      id: "sintaxe_plantuml",
      titulo: "1.2 Elementos básicos da sintaxe do PlantUML",
      blocos: [
        {
          tipo: "texto",
          texto: "A sintaxe do PlantUML é concisa e permite a criação rápida de diagramas, o que é útil tanto para documentar sistemas como para planejar novos projetos. Abaixo, vamos explorar os elementos básicos da sintaxe dessa linguagem que você precisa conhecer para começar a criar os seus próprios diagramas."
        },
        {
          tipo: "texto",
          texto: "Os códigos apresentados nesta seção podem ser executados no ambiente online **PlantText**, para PlantUML."
        },
        {
          tipo: "destaque",
          texto: "MULTIMÍDIA – Sobre o uso do PlantText, sugerimos que você acesse o vídeo de apresentação deste editor. Fonte: Nichols (2014)."
        },
        {
          tipo: "topico",
          titulo: "a) Definição de um Diagrama",
          texto: "Todo diagrama em PlantUML começa com **@startuml** e termina com **@enduml**. Esses delimitadores informam ao processador da linguagem onde o código do diagrama começa e termina. O Código 1 apresenta um exemplo em PlantUML."
        },
        {
          tipo: "lista",
          titulo: "Código 1 – Pontos de início e fim de um código PlantUML",
          itens: [
            "`@startuml`",
            "`... (conteúdo do diagrama)`",
            "`@enduml`"
          ]
        },
        {
          tipo: "topico",
          titulo: "b) Nome do Diagrama",
          texto: "Você pode adicionar um nome ao diagrama, inserindo-o na mesma linha que o **@startuml**, separando por um espaço. No entanto, o nome atribuído **não será desenhado no diagrama**, mas sim, servirá como **nome para o arquivo de saída** do diagrama. Esse recurso não deverá funcionar com o PlantText, quando você tentar exportar o diagrama para um formato de imagem, porém, ele funcionará com a **extensão para PlantUML**, instalável no **Visual Studio Code**. O Código 2 apresenta um exemplo em PlantUML."
        },
        {
          tipo: "lista",
          titulo: "Código 2 – Exemplo de atribuição de um nome a um Diagrama",
          itens: [
            "`@startuml estados-do-sistema`",
            "`[*] --> Estado1`",
            "`Estado1 --> Estado2 : Transição`",
            "`Estado2 --> [*]`",
            "`@enduml`"
          ]
        },
        {
          tipo: "topico",
          titulo: "c) Título para o Diagrama",
          texto: "Para adicionar um **título** a um diagrama, você pode usar a palavra-chave **title**. O título será exibido no topo do diagrama. O Código 3 apresenta um exemplo em PlantUML."
        },
        {
          tipo: "lista",
          titulo: "Código 3 – Pontos de início e fim de um código PlantUML",
          itens: [
            "`@startuml`",
            "`title Diagrama de Classes - Sistema de Biblioteca`",
            "`class Livro`",
            "`class Usuario`",
            "`class Emprestimo`",
            "`Livro --> Emprestimo`",
            "`Usuario --> Emprestimo`",
            "`@enduml`"
          ]
        },
        {
          tipo: "topico",
          titulo: "d) Direção do Diagrama",
          texto: "É possível modificar a direção de um diagrama através da diretiva **direction**. Por padrão, os elementos em um diagrama são dispostos de **cima para baixo (top to Bottom)**, mas ao usar esse comando, a orientação pode mudar da **esquerda para direita (left to right)**. O Código 4 apresenta um diagrama de estado com a direção Default (4a) e a direção horizontal (left to right) (4b). O resultado da execução do código é apresentado no mesmo quadro onde está o código."
        },
        {
          tipo: "lista",
          titulo: "Código 4 – Diagrama com a direção padrão (top to down)",
          itens: [
            "(a) Direção Default (vertical): `@startuml top-to-bottom`, `[*] --> Estado1`, `Estado1 --> Estado2: Transição()`, `Estado2 --> [*]`, `@enduml`",
            "(b) Direção Horizontal (left to right): `@startuml horizontal`, `left to right direction`, `[*] --> Estado1`, `Estado1 --> Estado2: Transição()`, `Estado2 --> [*]`, `@enduml`"
          ]
        },
        {
          tipo: "imagem",
          src: "codigo_4_diagrama_com_a_direcao_padrao_top_to_down.png",
          pasta: "imagens_analise_projeto/aula_10",
          alt: "Código 4 – Diagrama com a direção padrão (top to down). Quadro com o código PlantUML e o resultado: em (a) Direção Default (vertical), o estado inicial leva a Estado1, que passa a Estado2 pela transição Transição(), e depois ao estado final, em coluna; em (b) Direção Horizontal (left to right), os mesmos elementos aparecem dispostos da esquerda para a direita.",
          num: 2
        },
        {
          tipo: "topico",
          titulo: "e) Estilos em Diagramas",
          texto: "O PlantUML permite **personalizar o estilo dos seus diagramas** utilizando o comando **skinparam**. Com isso, você pode alterar **cores**, **fontes**, **espessura de linhas**, e outros aspectos visuais para adaptar o diagrama ao seu gosto ou ao padrão da sua organização. O Código 5 é relativo a um Diagrama de Caso de Uso com o estilo padrão da linguagem (5a) e com estilo personalizado (5b)."
        },
        {
          tipo: "lista",
          titulo: "Código 5 – Diagrama de Caso de Uso com o estilo personalizado",
          itens: [
            "(a) Com estilo padrão da ferramenta: `@startuml`, `actor User`, `usecase \"Executar Primeira Tarefa\" as UC1`, `usecase \"Executar Segunda Tarefa\" as UC2`, `usecase \"Executar Última Tarefa\" as UC3`, `User --> UC1`, `User --> UC2`, `User --> UC3`, `@enduml`",
            "(b) Com estilo personalizado: `@startuml estilo-personalizado`, `left to right direction`, `skinparam backgroundColor #F0F8FF`, `skinparam usecase {` `BackgroundColor #D8BFD8` `BorderColor #4B0082` `FontColor #4B0082` `FontSize 14` `FontName Arial` `}`, `skinparam actor {` `BackgroundColor #8A2BE2` `BorderColor #4B0082` `FontColor #FFFFFF` `FontSize 14` `FontName Arial` `}`, `actor User`, `usecase \"Executar Primeira Tarefa\" as UC1`, `usecase \"Executar Segunda Tarefa\" as UC2`, `usecase \"Executar Última Tarefa\" as UC3`, `User --> UC1`, `User --> UC2`, `User --> UC3`, `@enduml`"
          ]
        },
        {
          tipo: "imagem",
          src: "codigo_5_diagrama_de_caso_de_uso_com_o_estilo_personalizado.png",
          pasta: "imagens_analise_projeto/aula_10",
          alt: "Código 5 – Diagrama de Caso de Uso com o estilo personalizado. Quadro com o código e o resultado: em (a), estilo padrão da ferramenta, o ator User liga-se a três casos de uso (Executar Primeira Tarefa, Executar Segunda Tarefa e Executar Última Tarefa) em tons de cinza; em (b), estilo personalizado, o mesmo diagrama aparece com fundo azul-claro, ator em roxo e casos de uso em lilás.",
          num: 3
        },
        {
          tipo: "destaque",
          texto: "LEITURA COMPLEMENTAR – A documentação do PlantUML é muito boa e contém um bom número de exemplos para que você possa entender melhor como usar os estilos em PlantUML e o comando skinparam. Fonte: Plantuml.com."
        },
        {
          tipo: "topico",
          titulo: "f) Temas para Diagramas",
          texto: "O comando **!theme** em PlantUML permite que você aplique um **tema pré-definido** ao seu diagrama, alterando automaticamente vários aspectos de estilo, como **cores**, **fontes** e **bordas**. Isso simplifica a personalização visual de diagramas, tornando-os consistentes com uma paleta ou estilo específico sem precisar ajustar manualmente cada parâmetro de estilo."
        },
        {
          tipo: "destaque",
          texto: "LEITURA COMPLEMENTAR – Exemplos de temas que podem ser utilizados em diagramas PlantUML são listados no link indicado. Fonte: Plantuml.com."
        },
        {
          tipo: "texto",
          texto: "O Código 6 apresenta um diagrama de atividade (UML) que usa o tema **Amiga**."
        },
        {
          tipo: "lista",
          titulo: "Código 6 – Diagrama de Atividade com o tema Amiga",
          itens: [
            "`@startuml`",
            "`!theme amiga`",
            "`start`",
            "`:init;`",
            "`-> test of color;`",
            "`if (color?) is (<color:red>red) then`",
            "`:print red;`",
            "`else`",
            "`:print not red;`",
            "`note right: no color`",
            "`endif`",
            "`partition End {`",
            "`:end;`",
            "`}`",
            "`-> this is the end;`",
            "`end`",
            "`@enduml`"
          ]
        },
        {
          tipo: "imagem",
          src: "codigo_6_diagrama_de_atividade_com_o_tema_amiga.png",
          pasta: "imagens_analise_projeto/aula_10",
          alt: "Código 6 – Diagrama de Atividade com o tema Amiga. Quadro com o código e o resultado: diagrama em fundo azul que parte do início, passa pela atividade init, chega à decisão color?, que se divide em print red e print not red (esta com a nota no color), reúne os fluxos, passa pela partição End com a atividade end e termina no nó final. Fonte: Theme Gallery.",
          num: 4
        },
        {
          tipo: "texto",
          texto: "Conforme formos construindo os diagramas UML do sistema proposto nas seções a seguir, iremos apresentar seu código PlantUML e mostrar como são construídos os seus elementos."
        },
        {
          tipo: "destaque",
          texto: "LEITURA COMPLEMENTAR – A fim de conhecer um pouco mais sobre esta linguagem de domínio específico, indicamos o texto “Drawing UML with PlantUML”. Fonte: Plantuml.com."
        },
        {
          tipo: "destaque",
          texto: "MULTIMÍDIA – Aqui está um ótimo curso sobre a linguagem PlantUML. Fonte: Awaragi (2021). O PlantUML pode ser utilizado de forma integrada ao Visual Studio Code, na forma de extensão. Sobre esse assunto, sugerimos o vídeo presente no link. Fonte: Rosal (2022)."
        }
      ]
    },
    {
      id: "definicoes_sistema",
      titulo: "2 Definições do sistema de exemplo e escolha dos diagramas",
      blocos: [
        {
          tipo: "texto",
          texto: "Vamos começar criando o **Documento de Visão do Sistema** e o **Documento de Especificação dos Requisitos**, usando **User Stories**. Em seguida, passaremos para a escolha dos diagramas UML que serão desenhados usando PlantUML. Serão apresentados os códigos usados para a criação desses diagramas e um comentário sobre os seus comandos."
        }
      ]
    },
    {
      id: "documento_visao",
      titulo: "2.1 Documento de visão do sistema: Sistema de Controle de Biblioteca",
      blocos: [
        {
          tipo: "topico",
          titulo: "2.1.1 Nome do Projeto",
          texto: "Sistema de Controle de Biblioteca (SCB)."
        },
        {
          tipo: "topico",
          titulo: "2.1.2 Objetivo",
          texto: "Desenvolver um sistema que permita a gestão eficiente do acervo de livros, usuários e operações de empréstimo e devolução em uma biblioteca. O sistema deve suportar o cadastro de livros e usuários, gerenciamento de empréstimos, reservas de livros e geração de multas por atraso."
        },
        {
          tipo: "topico",
          titulo: "2.1.3 Escopo",
          lista: [
            "a) Cadastro de livros e os seus exemplares disponíveis (título, autor, ISBN, categoria, quantidade em estoque);",
            "b) Cadastro de usuários (nome, CPF, endereço, e-mail, perfil de acesso);",
            "c) Empréstimo de livros para usuários registrados;",
            "d) Devolução de livros e cálculo automático de multas por atraso;",
            "e) Reserva de livros quando indisponíveis no acervo;",
            "f) Geração de relatórios de empréstimos, devoluções, multas e reservas."
          ]
        },
        {
          tipo: "topico",
          titulo: "2.1.4 Stakeholders",
          lista: [
            "a) **Bibliotecário** – Responsável pelo cadastro de livros, gerenciamento de empréstimos, devoluções e reservas;",
            "b) **Usuários da Biblioteca** – Estudantes, professores e outros membros que podem emprestar livros, realizar reservas e consultar o catálogo;",
            "c) **Equipe de TI** – Responsável pela manutenção e suporte técnico do sistema."
          ]
        },
        {
          tipo: "subtitulo",
          texto: "2.1.5 Requisitos Funcionais"
        },
        {
          tipo: "tabela",
          titulo: "Quadro 2 – Requisitos Funcionais",
          colunas: ["Código", "Requisito Funcional", "Descrição"],
          linhas: [
            ["RF01", "Inserir livro", "O sistema deve permitir o cadastro de novos livros, incluindo título, autor, ISBN, categoria, editora, ano de publicação, número de páginas e quantidade em estoque."],
            ["RF02", "Alterar livro", "O sistema deve permitir a alteração das informações dos livros já cadastrados."],
            ["RF03", "Remover livro", "O sistema deve permitir a remoção de livros do acervo."],
            ["RF04", "Consultar Catálogo", "O sistema deve permitir consultar os livros cadastrados, com possibilidade de filtros por título, autor, categoria, editora e ano de publicação."],
            ["RF05", "Inserir usuário", "O sistema deve permitir o cadastro de novos usuários, incluindo nome, CPF, endereço, email e perfil."],
            ["RF06", "Alterar usuário", "O sistema deve permitir a alteração das informações dos usuários já cadastrados."],
            ["RF07", "Remover usuário", "O sistema deve permitir a remoção de usuários do sistema."],
            ["RF08", "Listar usuários", "O sistema deve permitir a listagem de todos os usuários cadastrados, com filtros por nome, CPF e perfil."],
            ["RF09", "Realizar empréstimo", "O sistema deve permitir o registro de empréstimos de livros, incluindo a data de empréstimo, data prevista de devolução e usuário responsável."],
            ["RF10", "Registrar devolução", "O sistema deve permitir o registro da devolução de livros, calculando automaticamente as multas por atraso."],
            ["RF11", "Renovar empréstimo", "O sistema deve permitir a renovação de empréstimos, estendendo a data de devolução, caso o livro não esteja reservado."],
            ["RF12", "Realizar reserva", "O sistema deve permitir a reserva de livros que não estão disponíveis no momento."],
            ["RF13", "Cancelar reserva", "O sistema deve permitir o cancelamento de uma reserva de livro."],
            ["RF14", "Gerar relatórios de movimentação", "O sistema deve gerar relatórios detalhados sobre empréstimos, devoluções e reservas."]
          ]
        },
        {
          tipo: "subtitulo",
          texto: "2.1.6 Requisitos Não Funcionais"
        },
        {
          tipo: "tabela",
          titulo: "Quadro 3 – Requisitos Não Funcionais",
          colunas: ["Código", "Requisito Não Funcional", "Descrição"],
          linhas: [
            ["RN01", "Interface amigável", "O sistema deve ter uma interface intuitiva e fácil de usar."],
            ["RN02", "Acessibilidade", "O sistema deve ser acessível via interface web e suportar dispositivos móveis."],
            ["RN03", "Desempenho", "O sistema deve ser capaz de processar operações e consultas rapidamente, mesmo com um grande volume de dados."],
            ["RN04", "Escalabilidade", "O sistema deve ser escalável para suportar o aumento no número de registros e usuários."],
            ["RN05", "Segurança", "O sistema deve garantir a segurança e privacidade dos dados, utilizando autenticação e autorização robustas."],
            ["RN06", "Manutenção", "O sistema deve ser modular e permitir fácil manutenção e expansão."]
          ]
        },
        {
          tipo: "subtitulo",
          texto: "2.1.7 Restrições do Sistema"
        },
        {
          tipo: "tabela",
          titulo: "Quadro 4 – Restrições do Sistema",
          colunas: ["Tipo de Restrição", "Restrição", "Descrição"],
          linhas: [
            ["Técnica", "Banco de Dados Relacional", "O sistema deve utilizar um banco de dados relacional, como PostgreSQL ou MySQL, para garantir a integridade e consistência dos dados."],
            ["Técnica", "Desempenho", "O sistema deve ser capaz de processar operações de consulta e manipulação de dados em menos de 1 segundo para até 1.000.000 de registros, com tempo de resposta inferior a 2 segundos para operações comuns."],
            ["Técnica", "Segurança", "O sistema deve implementar autenticação segura com criptografia de senhas (bcrypt ou Argon2) e garantir acesso autorizado apenas para operações críticas."],
            ["Técnica", "Acessibilidade", "O sistema deve ser acessível via navegadores modernos e ser responsivo, adaptando-se a dispositivos móveis."],
            ["Técnica", "Escalabilidade", "O sistema deve ser escalável para suportar crescimento no número de registros e usuários, com suporte ao balanceamento de carga e replicação de banco de dados."],
            ["Operacional", "Ambiente de Produção", "O sistema deve ser implantado em um ambiente com backups diários, recuperação de desastres e monitoramento contínuo de desempenho."],
            ["Operacional", "Manutenção e Suporte", "Atualizações e manutenções devem ocorrer fora do horário de pico, com um plano de rollback em caso de falhas."],
            ["Operacional", "Integração com Sistemas Externos", "Integração com outros sistemas deve ser realizada via APIs RESTful seguras, com autenticação por token JWT."],
            ["Operacional", "Compatibilidade de Dados", "O sistema deve suportar importação e exportação de dados em formatos como CSV e JSON."],
            ["Negócio", "Capacidade de Usuários", "O sistema deve suportar até 500 usuários logados simultaneamente, sem degradação significativa no desempenho."],
            ["Negócio", "Suporte a Idiomas", "O sistema deve ser multilíngue, suportando português e inglês, com possibilidade de fácil adição de outros idiomas."],
            ["Negócio", "Conformidade com Normas", "O sistema deve estar em conformidade com legislações de proteção de dados, como a LGPD (nota 1) no Brasil."],
            ["Negócio", "Capacitação", "Antes da implantação, todos os bibliotecários e usuários administrativos devem ser treinados, com disponibilização de manuais e tutoriais."]
          ]
        },
        {
          tipo: "texto",
          texto: "Nota de rodapé 1: A **Lei Geral de Proteção de Dados Pessoais (LGPD)** ou **Lei no. 13.709/18** é uma legislação brasileira que estabelece regras sobre a coleta, armazenamento, tratamento e compartilhamento de dados pessoais, com o objetivo de proteger a privacidade e os direitos dos cidadãos. Esta lei foi sancionada em agosto de 2018 e entrou em vigor em setembro de 2020."
        }
      ]
    },
    {
      id: "especificacao_casos_uso",
      titulo: "2.2 Documento de especificação dos casos de uso",
      blocos: [
        {
          tipo: "texto",
          texto: "Serão usadas **User Stories** para a descrição dos Casos de Uso."
        },
        {
          tipo: "destaque",
          texto: "PARADA OBRIGATÓRIA – Note que um Caso de Uso, normalmente, seria descrito com os seus Fluxos Básicos e Alternativos, porém, escolhemos uma forma baseada nos Métodos Ágeis, para descrever os Casos de Uso, a fim de facilitar a comunicação entre o cliente e a equipe de desenvolvimento. Ao mesmo tempo, essa forma permite que se possa ter uma ideia mais clara e direta do que será feito no sistema, quanto às suas funcionalidades e à complexidade para a implementação destas."
        },
        {
          tipo: "topico",
          titulo: "Revisão: o que é uma User Story",
          texto: "Já havíamos conversado sobre User Story em nosso módulo sobre métodos ágeis, porém, chegou a hora de “colocarmos as mãos na massa” e, por isso, é importante revisar este assunto. Uma **User Story** é uma descrição simples e concisa de uma funcionalidade ou requisito do sistema, escritas da perspectiva do usuário final ou de outra parte interessada. Elas são amplamente utilizadas em metodologias ágeis de desenvolvimento de software, como o **Scrum** e o **XP (Extreme Programming)**, para capturar as necessidades e os desejos dos usuários de forma que a equipe de desenvolvimento possa entender e priorizar as funcionalidades a serem implementadas."
        },
        {
          tipo: "topico",
          titulo: "Estrutura de uma User Story",
          texto: "Uma User Story típica segue um formato padrão que ajuda a esclarecer quem é o usuário, qual é a sua necessidade ou desejo, e qual é o valor ou benefício que ele obtém. A estrutura comum é:"
        },
        {
          tipo: "lista",
          itens: [
            "a) Como [tipo de usuário]",
            "b) Eu quero [ação ou funcionalidade]",
            "c) Para que [objetivo ou benefício]"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de uma User Story",
          texto: "Como usuário da biblioteca, eu quero consultar o catálogo de livros, para que eu possa encontrar e reservar livros disponíveis.",
          detalhe: "Existem algumas variações quanto aos termos chave (“Como”, “Eu quero”, “Para que”) da User Story, porém, em linhas gerais, eles têm o sentido e a forma apresentados aqui."
        },
        {
          tipo: "lista",
          titulo: "Componentes de uma User Story",
          itens: [
            "a) **Usuário:** identifica quem está solicitando a funcionalidade. Pode ser um tipo de usuário específico, como \"cliente\", \"administrador\", \"bibliotecário\", ou até mesmo um sistema automatizado;",
            "b) **Ação ou Funcionalidade:** descreve o que o usuário deseja fazer ou qual funcionalidade ele quer que o sistema ofereça;",
            "c) **Objetivo ou Benefício:** explica por que o usuário quer essa funcionalidade e qual benefício espera obter, ajudando a equipe a entender o valor do requisito."
          ]
        },
        {
          tipo: "lista",
          titulo: "Características de Boas User Stories (INVEST)",
          itens: [
            "a) **Independent (Independente):** deve ser possível desenvolver a User Story independentemente de outras histórias;",
            "b) **Negotiable (Negociável):** a história não é um contrato rígido; os detalhes podem ser discutidos e ajustados;",
            "c) **Valuable (Valiosa):** deve agregar valor ao usuário ou ao sistema;",
            "d) **Estimable (Estimável):** deve ser possível estimar o esforço necessário para implementá-la;",
            "e) **Small (Pequena):** deve ser pequena o suficiente para ser desenvolvida em um curto período (geralmente em uma sprint, nota 2);",
            "f) **Testable (Testável):** deve haver uma maneira clara de verificar se a funcionalidade foi implementada corretamente."
          ]
        },
        {
          tipo: "texto",
          texto: "Nota de rodapé 2: *Sprint* é o ciclo de iteração do desenvolvimento de um sistema. Esse termo é utilizado em Metodologias Ágeis."
        },
        {
          tipo: "destaque",
          texto: "LEITURA COMPLEMENTAR – Para saber mais sobre User Stories, sugerimos o material online da Agile Expert, “O que são User Stories (Histórias de Usuário)?”. Fonte: Agile Expert (2021)."
        },
        {
          tipo: "texto",
          texto: "O Quadro 5, a seguir, apresenta os nomes dos Casos de Uso do sistema proposto, seus atores primários, suas pré-condições e as User Stories para sua descrição."
        },
        {
          tipo: "tabela",
          titulo: "Quadro 5 – Casos de Uso do Sistema de Controle de Biblioteca",
          colunas: ["Caso de Uso", "Ator Primário", "Pré-condição", "User Stories"],
          linhas: [
            ["Inserir Livro", "Bibliotecário", "O usuário deve estar autenticado como Bibliotecário.", "Como Bibliotecário, eu quero inserir um novo livro no sistema para atualizar o acervo."],
            ["Alterar Livro", "Bibliotecário", "O usuário deve estar autenticado como Bibliotecário.", "Como Bibliotecário, eu quero alterar as informações de um livro existente para corrigir ou atualizar os dados."],
            ["Remover Livro", "Bibliotecário", "O usuário deve estar autenticado como Bibliotecário.", "Como Bibliotecário, eu quero remover um livro do sistema para manter o acervo atualizado e evitar registros desnecessários."],
            ["Consultar Catálogo", "Usuário da Biblioteca", "O usuário deve estar autenticado no sistema.", "Como Usuário, eu quero consultar os livros na biblioteca para encontrar um livro específico."],
            ["Inserir Usuário", "Bibliotecário", "O usuário deve estar autenticado como Bibliotecário.", "Como Bibliotecário, eu quero cadastrar um novo usuário para que ele possa utilizar os serviços da biblioteca."],
            ["Alterar Usuário", "Bibliotecário", "O usuário deve estar autenticado como Bibliotecário.", "Como Bibliotecário, eu quero alterar as informações de um usuário existente para manter os dados atualizados."],
            ["Remover Usuário", "Bibliotecário", "O usuário deve estar autenticado como Bibliotecário.", "Como Bibliotecário, eu quero remover um usuário do sistema para manter a base de usuários organizada e evitar acessos desnecessários."],
            ["Listar Usuários", "Bibliotecário", "O usuário deve estar autenticado como Bibliotecário.", "Como Bibliotecário, eu quero listar todos os usuários cadastrados para verificar suas informações e histórico."],
            ["Realizar Empréstimo", "Bibliotecário", "O usuário deve estar autenticado como Bibliotecário.", "Como Bibliotecário, eu quero registrar o empréstimo de um livro para manter o controle sobre os itens retirados da biblioteca."],
            ["Registrar Devolução", "Bibliotecário", "O usuário deve estar autenticado como Bibliotecário.", "Como Bibliotecário, eu quero registrar a devolução de um livro para atualizar o acervo e calcular possíveis multas por atraso."],
            ["Renovar Empréstimo", "Usuário da Biblioteca", "O livro não deve estar reservado por outro usuário.", "Como Usuário, eu quero renovar o empréstimo de um livro para continuar usando o livro sem devolvê-lo à biblioteca."],
            ["Realizar Reserva", "Usuário da Biblioteca", "O usuário deve estar autenticado no sistema.", "Como Usuário, eu quero reservar um livro indisponível para garantir que eu possa pegá-lo quando estiver disponível."],
            ["Cancelar Reserva", "Usuário da Biblioteca", "O usuário deve estar autenticado no sistema.", "Como Usuário, eu quero cancelar uma reserva de livro para que possa desistir do empréstimo."],
            ["Gerar Relatórios de Movimentação", "Bibliotecário", "O usuário deve estar autenticado como Bibliotecário.", "Como Bibliotecário, eu quero gerar relatórios de movimentação de livros para analisar os empréstimos, devoluções e reservas."]
          ]
        }
      ]
    },
    {
      id: "diagrama_caso_uso",
      titulo: "3 Diagrama de caso de uso",
      blocos: [
        {
          tipo: "texto",
          texto: "Caso você tenha esquecido qual a função do Diagrama de Caso de Uso, mostraremos, a seguir, as suas principais funções, antes de mostrarmos o diagrama correspondente ao nosso Sistema de Controle de Biblioteca (SCB). Usaremos para exemplificar cada função do próprio sistema que estamos modelando."
        },
        {
          tipo: "lista",
          titulo: "Principais funções do Diagrama de Caso de Uso",
          itens: [
            "a) **Identificação de Funcionalidades** – Mapeia todas as principais funcionalidades do sistema, como \"Inserir Livro\", \"Realizar Empréstimo\" e \"Consultar Catálogo\", garantindo que todas as necessidades dos usuários sejam capturadas;",
            "b) **Comunicação com Stakeholders** – Serve como uma ferramenta clara e visual para comunicar aos bibliotecários, administradores e outros stakeholders quais funcionalidades o sistema oferecerá, assegurando que todos estejam alinhados quanto ao escopo do projeto;",
            "c) **Definição de Escopo** – Define o que está dentro e fora do escopo do projeto, delimitando exatamente quais interações e funcionalidades o sistema de biblioteca suportará;",
            "c) **Planejamento de Desenvolvimento** – Orienta a equipe de desenvolvimento na organização e priorização das tarefas, permitindo que cada caso de uso seja tratado como uma unidade funcional a ser implementada;",
            "d) **Verificação e Validação** – Durante os testes, o diagrama é usado para garantir que todas as funcionalidades planejadas foram implementadas e funcionam como esperadas, de acordo com as interações mapeadas;"
          ]
        },
        {
          tipo: "texto",
          texto: "Os casos de uso utilizados são os definidos na seção 2.2. O Diagrama de Caso de Uso do sistema é apresentado, juntamente ao seu código PlantUML, no Código 7."
        },
        {
          tipo: "imagem",
          src: "codigo_7_diagrama_de_caso_de_uso_do_scb.png",
          pasta: "imagens_analise_projeto/aula_10",
          alt: "Código 7 – Diagrama de Caso de Uso do SCB. Dentro do retângulo “Sistema de Controle de Biblioteca”, o ator Bibliotecário se liga a 11 casos de uso (Listar Usuários, Realizar Empréstimo, Registrar Devolução, Gerar Relatórios de Movimentação, Inserir Livro, Alterar Livro, Remover Livro, Inserir Usuário, Alterar Usuário, Remover Usuário e Consultar Catálogo); o ator Usuário da Biblioteca se liga a Consultar Catálogo, Cancelar Reserva, Renovar Empréstimo e Realizar Reserva.",
          num: 5
        },
        {
          tipo: "lista",
          titulo: "Código 7 – Linhas de abertura e fechamento do código PlantUML (o restante está nos Quadros 6 a 8)",
          itens: [
            "`@startuml dcu-controle-biblioteca`",
            "`left to right direction`",
            "`@enduml`"
          ]
        },
        {
          tipo: "texto",
          texto: "Os quadros 6 a 8 apresentam a explicação do código do Diagrama de Caso de Uso. Ele foi dividido em pedaços para facilitar sua apresentação."
        },
        {
          tipo: "tabela",
          titulo: "Quadro 6 – Explicação do Código PlantUML do Diagrama de Caso de Uso (parte 1)",
          colunas: ["Código", "Explicação"],
          linhas: [
            [
              "`actor \"Bibliotecário\" as Librarian` | `actor \"Usuário da Biblioteca\" as User`",
              "• `actor \"Bibliotecário\" as Librarian`: Define um ator chamado \"Bibliotecário\". O ator representa uma entidade externa ao sistema que interage com ele. Aqui, o ator \"Bibliotecário\" é identificado pelo nome alternativo `Librarian` que será usado no diagrama para referenciá-lo. • `actor \"Usuário da Biblioteca\" as User`: Define um segundo ator chamado \"Usuário da Biblioteca\", representando os usuários que utilizam o sistema. Este ator é referenciado como `User` no diagrama."
            ]
          ]
        },
        {
          tipo: "tabela",
          titulo: "Quadro 7 – Explicação do Código PlantUML do Diagrama de Caso de Uso (parte 2)",
          colunas: ["Código", "Explicação"],
          linhas: [
            [
              "`rectangle \"Sistema de Controle de Biblioteca\" {` | `usecase \"Inserir Livro\" as UC1` | `usecase \"Alterar Livro\" as UC2` | `usecase \"Remover Livro\" as UC3` | `usecase \"Consultar Catálogo\" as UC4` | `usecase \"Inserir Usuário\" as UC5` | `usecase \"Alterar Usuário\" as UC6` | `usecase \"Remover Usuário\" as UC7` | `usecase \"Listar Usuários\" as UC8` | `usecase \"Realizar Empréstimo\" as UC9` | `usecase \"Registrar Devolução\" as UC10` | `usecase \"Renovar Empréstimo\" as UC11` | `usecase \"Realizar Reserva\" as UC12` | `usecase \"Cancelar Reserva\" as UC13` | `usecase \"Gerar Relatórios de Movimentação\" as UC14` | `}`",
              "• `rectangle \"Sistema de Controle de Biblioteca\"`: Este bloco cria uma caixa (um retângulo) no diagrama que representa o sistema de controle de biblioteca. Dentro dessa caixa, são colocados todos os casos de uso que pertencem ao sistema. • `usecase \"Inserir Livro\" as UC1`: Define um caso de uso chamado \"Inserir Livro\", que é referenciado como `UC1` no diagrama. Esse caso de uso descreve uma funcionalidade específica do sistema que pode ser executada por um ator. • `usecase \"Alterar Livro\" as UC2` até `usecase \"Gerar Relatórios de Movimentação\" as UC14`: Segue o mesmo padrão, definindo outros casos de uso, cada um representando uma funcionalidade do sistema. Esses casos de uso são referenciados como `UC2`, `UC3`, ..., `UC14` no diagrama."
            ]
          ]
        },
        {
          tipo: "tabela",
          titulo: "Quadro 8 – Explicação do Código PlantUML do Diagrama de Caso de Uso (parte 3)",
          colunas: ["Código", "Explicação"],
          linhas: [
            [
              "`Librarian --> UC1` | `Librarian --> UC2` | `Librarian --> UC3` | `Librarian --> UC4` | `Librarian --> UC5` | `Librarian --> UC6` | `Librarian --> UC7` | `Librarian --> UC8` | `Librarian --> UC9` | `Librarian --> UC10` | `Librarian --> UC14` | `User --> UC4` | `User --> UC11` | `User --> UC12` | `User --> UC13`",
              "• `Librarian --> UC1`: Cria uma relação entre o ator ‘Librarian’ (Bibliotecário) e o caso de uso ‘UC1’ (Inserir Livro). A seta (`-->`) indica que o bibliotecário pode realizar a ação de inserir um livro no sistema. • Relacionamentos de ‘Librarian’ com outros Casos de Uso: Seguindo o mesmo padrão, o bibliotecário está relacionado a vários outros casos de uso, indicando que ele pode realizar essas ações no sistema. • Relacionamentos de ‘User’ com Casos de Uso: Similarmente, ‘User’ (Usuário da Biblioteca) está relacionado a casos de uso como ‘Renovar Empréstimo’, ‘Realizar Reserva’ e ‘Consultar Catálogo’, indicando que essas são ações que um usuário comum pode executar no sistema."
            ]
          ]
        }
      ]
    },
    {
      id: "diagrama_classes",
      titulo: "4 Diagrama de classes",
      blocos: [
        {
          tipo: "texto",
          texto: "Um **Diagrama de Classes** é uma representação visual das classes de um sistema e os seus relacionamentos. Ele mostra os **atributos**, **métodos** e as **interações** entre diferentes classes de um sistema, servindo como uma ferramenta essencial para o desenvolvimento de software. O diagrama auxilia na modelagem e no planejamento de sistemas complexos, fornecendo uma visão clara da estrutura e das responsabilidades das classes, além das interações entre elas. No desenvolvimento de um sistema, ele facilita a comunicação entre desenvolvedores e stakeholders, além de ajudar na identificação de possíveis melhorias e simplificações."
        },
        {
          tipo: "texto",
          texto: "O Código 8 apresenta o Diagrama de Classes do SCB, juntamente ao seu código PlantUML."
        },
        {
          tipo: "lista",
          titulo: "Código 8 – Diagrama de Classes do Sistema (código PlantUML)",
          itens: [
            "`@startuml dc-controle-biblioteca-completo`",
            "`' Vertical Layout`",
            "`top to bottom direction`",
            "`class Usuario {` `-nome` `-cpf` `-endereco` `-email` `+autenticar()` `+atualizarDados()` `}`",
            "`class Bibliotecario extends Usuario {` `+realizarEmprestimo()` `+atualizarCatalogo()` `}`",
            "`class UsuarioBiblioteca extends Usuario {` `+fazerReserva()` `+fazerEmprestimo()` `}`",
            "`class Livro {` `-titulo` `-autor` `-ISBN` `-categoria` `-editora` `-anoPublicacao` `+atualizarInformacoes()` `+consultar()` `}`",
            "`class Exemplar {` `-AACR2Codigo` `-disponivel` `+estaDisponivel()` `+atualizarInformacoes()` `+consultarExemplares()` `}`",
            "`class Emprestimo {` `-dataEmprestimo` `-dataDevolucaoPrevista` `-dataDevolucaoReal` `-multa` `+calcularMulta()` `}`",
            "`class Reserva {` `-dataReserva` `+consultarReservas()` `+reservar()` `}`",
            "`' Relacionamentos`",
            "`Bibliotecario \"1\" --> \"*\" Emprestimo : faz`",
            "`Bibliotecario \"1\" --> \"*\" Livro : gerencia`",
            "`Bibliotecario \"1\" --> \"*\" Exemplar : gerencia`",
            "`UsuarioBiblioteca \"1\" --> \"*\" Reserva : Faz`",
            "`UsuarioBiblioteca \"1\" --> \"*\" Emprestimo : Solicita`",
            "`Livro \"1\" --> \"*\" Exemplar : Possui`",
            "`Exemplar \"1\" --> \"*\" Emprestimo : Está em`",
            "`Exemplar \"1\" --> \"*\" Reserva : Está reservado em`",
            "`@enduml`"
          ]
        },
        {
          tipo: "imagem",
          src: "codigo_8_diagrama_de_classes_do_sistema.png",
          pasta: "imagens_analise_projeto/aula_10",
          alt: "Código 8 – Diagrama de Classes do Sistema. Usuario (nome, cpf, endereco, email; autenticar, atualizarDados) é generalizada por Bibliotecario e UsuarioBiblioteca. Bibliotecario (1) gerencia Livro e Exemplar e faz Emprestimo (*). Livro (1) possui Exemplar (*). Exemplar (1) está em Emprestimo (*) e está reservado em Reserva (*). UsuarioBiblioteca (1) faz Reserva (*) e solicita Emprestimo (*).",
          num: 6
        }
      ]
    },
    {
      id: "explicacao_classes",
      titulo: "4.1 Explicação do código",
      blocos: [
        {
          tipo: "texto",
          texto: "Cada classe define um conjunto de **atributos privados** e deve implementar métodos (**getters** e **setters**) para acessar e modificar esses atributos, garantindo o **encapsulamento**. A seguir, estão as principais classes e os seus papéis no sistema:"
        },
        {
          tipo: "topico",
          titulo: "a) Classe Usuário",
          lista: [
            "Representa um usuário genérico do sistema, com atributos comuns como nome, cpf, endereço e e email.",
            "Os métodos de autenticação e atualização de dados permitem que o usuário se autentique e modifique suas informações.",
            "Código: `class Usuario {` `-nome` `-cpf` `-endereco` `-email` `+autenticar( )` `+atualizarDados( )` `}`"
          ]
        },
        {
          tipo: "topico",
          titulo: "b) Classe Bibliotecário",
          lista: [
            "Herda da classe Usuário e adiciona métodos específicos para realizar empréstimos e atualizar o catálogo.",
            "Essa classe é responsável pelas operações administrativas relacionadas ao gerenciamento de empréstimos e às devoluções de exemplares.",
            "Código: `class Bibliotecario extends Usuario {` `+realizarEmprestimo( )` `+atualizarCatalogo( )` `}`"
          ]
        },
        {
          tipo: "topico",
          titulo: "c) Classe UsuarioBiblioteca",
          lista: [
            "Também herda da classe Usuario e adiciona métodos relacionados ao uso da biblioteca, como fazer reserva e empréstimo de exemplares.",
            "Essa classe representa um usuário regular da biblioteca que faz reservas e solicita empréstimos.",
            "Código: `class UsuarioBiblioteca extends Usuario {` `+fazerReserva( )` `+fazerEmprestimo( )` `}`"
          ]
        },
        {
          tipo: "topico",
          titulo: "d) Classe Livro",
          lista: [
            "Representa um livro, com atributos como título, autor, ISBN, categoria, editora e ano de publicação.",
            "Código: `class Livro {` `-titulo` `-autor` `-ISBN` `-categoria` `-editora` `-anoPublicacao` `+atualizarInformacoes( )` `+consultar( )` `}`"
          ]
        },
        {
          tipo: "topico",
          titulo: "e) Classe Exemplar",
          lista: [
            "Representa um exemplar específico de um livro, identificado pelo código AACR2 (nota 3). Ele possui o atributo disponibilidade para indicar se está disponível para empréstimo.",
            "Código: `class Exemplar {` `-AACR2Codigo` `-disponivel` `+estaDisponivel( )` `+atualizarInformacoes( )` `+consultarExemplares( )` `}`"
          ]
        },
        {
          tipo: "texto",
          texto: "Nota de rodapé 3: **AACR2** é o Código de Catalogação Anglo-Americano - 2ª edição, utilizado para criação de descrições bibliográficas e organização de exemplares em bibliotecas."
        },
        {
          tipo: "topico",
          titulo: "f) Classe Empréstimo",
          lista: [
            "Representa o empréstimo de um exemplar, contendo informações sobre a data do empréstimo, data de devolução prevista e real, e a multa (se aplicável).",
            "Inclui referências ao UsuarioBiblioteca que fez o empréstimo e ao Bibliotecario que registrou o empréstimo.",
            "Possui métodos para calcular a multa e acessar as informações de empréstimo.",
            "Código: `class Emprestimo {` `-dataEmprestimo` `-dataDevolucaoPrevista` `-dataDevolucaoReal` `-multa` `+calcularMulta( )` `}`"
          ]
        },
        {
          tipo: "topico",
          titulo: "g) Classe Reserva",
          lista: [
            "Representa a reserva de um exemplar, com informações sobre o usuário que fez a reserva e o exemplar reservado.",
            "Métodos para reservar e consultar as suas reservas estão incluídos.",
            "Código: `class Reserva {` `-dataReserva` `+consultarReservas( )` `+reservar( )` `}`"
          ]
        },
        {
          tipo: "texto",
          texto: "O uso de **atributos privados (-)** e **métodos públicos (+)** garante que o acesso aos dados seja controlado, seguindo os princípios de **encapsulamento**. Para cada atributo, deve haver um método **getter** (para obter o valor) e um **setter** (para definir o valor), o que facilita a manipulação dos dados de forma segura."
        },
        {
          tipo: "destaque",
          texto: "PARADA OBRIGATÓRIA – O que são métodos Getter e Setter? Métodos Getter e Setter são utilizados em programação orientada a objetos para acessar e modificar os valores dos atributos privados de uma classe. O método Getter recupera o valor de um atributo, enquanto o método Setter define ou altera o valor desse atributo. Eles ajudam a controlar o acesso e proteger os dados, mantendo o princípio de encapsulamento."
        },
        {
          tipo: "destaque",
          texto: "PARADA OBRIGATÓRIA – O que são Atributos Privados e Métodos Públicos? Atributos privados são variáveis internas de uma classe que não podem ser acessadas diretamente de fora da classe. Isso impede que outros objetos modifiquem os atributos diretamente, preservando a integridade dos dados. Por outro lado, métodos públicos são funções que podem ser acessadas por qualquer objeto. Os métodos públicos geralmente incluem os getters e setters que permitem controlar o acesso aos atributos privados, oferecendo uma interface para manipular os dados de forma segura."
        },
        {
          tipo: "texto",
          texto: "Os relacionamentos entre as classes indicam como os objetos interagem entre si. Vejamos, a seguir, os relacionamentos criados em nosso diagrama de classes."
        },
        {
          tipo: "lista",
          titulo: "Relacionamentos do diagrama de classes",
          itens: [
            "A) **Bibliotecário → Empréstimo**: O bibliotecário **registra os empréstimos**. Um bibliotecário pode registrar vários empréstimos, um empréstimo é registrado por apenas um bibliotecário.",
            "B) **Bibliotecário → Livro**: O Bibliotecário atualiza os dados dos Livros.",
            "C) **Bibliotecário → Exemplar**: O Bibliotecário atualiza os dados dos Exemplares dos livros.",
            "D) **UsuarioBiblioteca → Reserva**: Um Usuário da biblioteca **faz Reserva** de exemplares de livros.",
            "E) **UsuarioBiblioteca → Empréstimo**: Um usuário da biblioteca **solicita empréstimos**.",
            "F) **Livro → Exemplar**: Um livro **possui vários exemplares**.",
            "G) **Exemplar → Empréstimo**: O exemplar **pode constar em vários empréstimos**, mas um empréstimo se refere a apenas um exemplar por vez.",
            "E) **Exemplar → Reserva**: O exemplar **pode constar em várias reservas**, e cada reserva refere-se a um único exemplar."
          ]
        },
        {
          tipo: "lista",
          titulo: "Código PlantUML dos relacionamentos",
          itens: [
            "`Bibliotecario \"1\" --> \"*\" Emprestimo : faz`",
            "`Bibliotecario \"1\" --> \"*\" Livro : gerencia`",
            "`Bibliotecario \"1\" --> \"*\" Exemplar : gerencia`",
            "`UsuarioBiblioteca \"1\" --> \"*\" Reserva : Faz`",
            "`UsuarioBiblioteca \"1\" --> \"*\" Emprestimo : Solicita`",
            "`Livro \"1\" --> \"*\" Exemplar : Possui`",
            "`Exemplar \"1\" --> \"*\" Emprestimo : Está em`",
            "`Exemplar \"1\" --> \"*\" Reserva : Está reservado em`"
          ]
        }
      ]
    },
    {
      id: "diagrama_sequencia",
      titulo: "5 Diagrama de sequência",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Diagrama de Sequência** é uma ferramenta da modelagem orientada a objetos que mostra como os objetos ou entidades de um sistema **interagem entre si em uma sequência temporal**. Ele representa a troca de mensagens (chamadas de métodos ou funções) entre os participantes, organizadas em uma linha do tempo. Esse tipo de diagrama é fundamental para entender e documentar o **comportamento dinâmico** de um sistema, como as operações de negócio são realizadas e como os objetos se comunicam durante essas operações."
        },
        {
          tipo: "texto",
          texto: "Esse diagrama ajuda os desenvolvedores a visualizarem o fluxo de operações entre os diferentes componentes do sistema. Ele facilita o entendimento de como os objetos colaboram em diferentes cenários, como o de reserva de livros, empréstimo de exemplares e devolução no sistema de biblioteca. Esse diagrama permite verificar se o sistema está cumprindo corretamente os casos de uso e se as interações entre os objetos estão bem definidas, ajudando no desenvolvimento e na manutenção do sistema."
        },
        {
          tipo: "texto",
          texto: "O Código 9 apresenta o Diagrama de Sequência do SCB, juntamente ao seu código PlantUML."
        },
        {
          tipo: "lista",
          titulo: "Código 9 – Diagrama de Sequência do Sistema (código PlantUML)",
          itens: [
            "`@startuml dc-controle-biblioteca-sequence`",
            "`' Definição dos Participantes`",
            "`participant UsuarioBiblioteca`",
            "`participant Bibliotecario`",
            "`participant Livro`",
            "`participant Exemplar`",
            "`participant Emprestimo`",
            "`participant Reserva`",
            "`' Sequência para consultar livros`",
            "`UsuarioBiblioteca -> Livro: consultarCatalogoLivros()`",
            "`activate Livro`",
            "`Livro -> Exemplar: consultarExemplares()`",
            "`activate Exemplar`",
            "`Exemplar -> Livro: Exemplares`",
            "`deactivate Exemplar`",
            "`Livro -> UsuarioBiblioteca: Livro com seus exemplares`",
            "`deactivate Livro`",
            "`' Sequência de Reserva de livros`",
            "`UsuarioBiblioteca -> Reserva: solicitarReserva()`",
            "`activate Reserva`",
            "`Reserva -> Exemplar: verificarReservas()`",
            "`activate Exemplar`",
            "`Exemplar --> Reserva: retorna Exemplar`",
            "`deactivate Exemplar`",
            "`Reserva --> UsuarioBiblioteca: reserva realizada`",
            "`deactivate Reserva`",
            "`' Sequência de Empréstimo de livros`",
            "`UsuarioBiblioteca -> Bibliotecario: solicitarEmprestimo()`",
            "`activate Bibliotecario`",
            "`Bibliotecario -> Exemplar: verificarDisponiveis()`",
            "`activate Exemplar`",
            "`Exemplar -> Reserva: verificarReservas()`",
            "`activate Reserva`",
            "`Reserva --> Exemplar: retorna disponibilidade`",
            "`deactivate Reserva`",
            "`Exemplar -> Bibliotecario: retorna disponibilidade`",
            "`deactivate Exemplar`",
            "`Bibliotecario -> Emprestimo: registrarEmprestimo(emprestimo)`",
            "`activate Emprestimo`",
            "`Emprestimo --> Bibliotecario: emprestimo registrado`",
            "`deactivate Emprestimo`",
            "`Bibliotecario --> UsuarioBiblioteca: emprestimo realizado`",
            "`deactivate Bibliotecario`",
            "`' Sequência de Devolução de livros`",
            "`UsuarioBiblioteca -> Bibliotecario: solicitarDevolucao()`",
            "`activate Bibliotecario`",
            "`Bibliotecario -> Emprestimo: verificarEmprestimo()`",
            "`activate Emprestimo`",
            "`Emprestimo -> Emprestimo: calcularMulta`",
            "`Emprestimo -> Bibliotecario: multa`",
            "`Bibliotecario --> Emprestimo: registrarDevolucao()`",
            "`Emprestimo -> Exemplar: liberarExemplar()`",
            "`activate Exemplar`",
            "`Exemplar -> Emprestimo: liberado`",
            "`deactivate Exemplar`",
            "`Emprestimo --> Bibliotecario: devolucao registrada`",
            "`deactivate Emprestimo`",
            "`Bibliotecario --> UsuarioBiblioteca: devolucao realizada`",
            "`deactivate Bibliotecario`",
            "`' Sequência de Renovação de empréstimo`",
            "`UsuarioBiblioteca -> Bibliotecario: solicitarRenovacaoEmprestimo()`",
            "`activate Bibliotecario`",
            "`Bibliotecario -> Emprestimo: alterarEmprestimo`",
            "`activate Emprestimo`",
            "`Emprestimo -> Reserva: verificarReservas`",
            "`activate Reserva`",
            "`Reserva -> Emprestimo: pode renovar`",
            "`deactivate Reserva`",
            "`Emprestimo --> Bibliotecario: emprestimo renovado`",
            "`deactivate Emprestimo`",
            "`Bibliotecario --> UsuarioBiblioteca: renovacao realizada`",
            "`deactivate Bibliotecario`",
            "`@enduml`"
          ]
        },
        {
          tipo: "imagem",
          src: "codigo_9_diagrama_de_sequencia_do_sistema.png",
          pasta: "imagens_analise_projeto/aula_10",
          alt: "Código 9 – Diagrama de Sequência do Sistema. Seis participantes (UsuarioBiblioteca, Bibliotecario, Livro, Exemplar, Emprestimo e Reserva) com cinco blocos de mensagens em ordem: consulta de catálogo (UsuarioBiblioteca → Livro → Exemplar), reserva (UsuarioBiblioteca → Reserva → Exemplar), empréstimo (via Bibliotecario, Exemplar, Reserva e Emprestimo), devolução (Bibliotecario → Emprestimo, com calcularMulta e liberarExemplar) e renovação (Bibliotecario → Emprestimo → Reserva).",
          num: 7
        },
        {
          tipo: "texto",
          texto: "Esse diagrama de sequência fornece uma visão abrangente dos processos de reserva, empréstimo e devolução no sistema de biblioteca."
        }
      ]
    },
    {
      id: "explicacao_sequencia",
      titulo: "5.1 Explicação do código",
      blocos: [
        {
          tipo: "texto",
          texto: "O código começa com a definição das entidades (no caso, classes) envolvidas no processo de comunicação, chamadas de **Participants**, no PlantUML."
        },
        {
          tipo: "lista",
          titulo: "Definição dos participantes",
          itens: [
            "`participant UsuarioBiblioteca`",
            "`participant Bibliotecario`",
            "`participant Livro`",
            "`participant Exemplar`",
            "`participant Emprestimo`",
            "`participant Reserva`"
          ]
        },
        {
          tipo: "topico",
          titulo: "a) Processo de Reserva",
          lista: [
            "O UsuarioBiblioteca solicita uma reserva.",
            "O sistema de reserva verifica os exemplares possíveis e retorna um exemplar a ser reservado.",
            "O Usuário recebe a confirmação da reserva.",
            "Código: `' Sequência de Reserva de livros` `UsuarioBiblioteca -> Reserva: solicitarReserva( )` `activate Reserva` `Reserva -> Exemplar: verificarReservas( )` `activate Exemplar` `Exemplar --> Reserva: retorna Exemplar` `deactivate Exemplar` `Reserva --> UsuarioBiblioteca: reserva realizada` `deactivate Reserva`"
          ]
        },
        {
          tipo: "topico",
          titulo: "b) Processo de Empréstimo",
          lista: [
            "O UsuarioBiblioteca solicita um emprestimo ao Bibliotecario.",
            "O Bibliotecario verifica a disponibilidade dos Exemplares e as Reservas feitas para eles.",
            "O Bibliotecário registra o empréstimo com a classe Empréstimo.",
            "O Bibliotecário confirma o empréstimo ao UsuarioBiblioteca.",
            "Código: `' Sequência de Empréstimo de livros` `UsuarioBiblioteca -> Bibliotecario: solicitarEmprestimo( )` `activate Bibliotecario` `Bibliotecario -> Exemplar: verificarDisponiveis( )` `activate Exemplar` `Exemplar -> Reserva: verificarReservas( )` `activate Reserva` `Reserva --> Exemplar: retorna disponibilidade` `deactivate Reserva` `Exemplar -> Bibliotecario: retorna disponibilidade` `deactivate Exemplar` `Bibliotecario -> Emprestimo: registrarEmprestimo(emprestimo)` `activate Emprestimo` `Emprestimo --> Bibliotecario: emprestimo registrado` `deactivate Emprestimo` `Bibliotecario --> UsuarioBiblioteca: emprestimo realizado` `deactivate Bibliotecario`"
          ]
        },
        {
          tipo: "topico",
          titulo: "c) Processo de Devolução",
          lista: [
            "O UsuarioBiblioteca realiza uma devolução ao Bibliotecário.",
            "O Bibliotecário verifica informações do Empréstimo.",
            "É feito cálculo da multa, caso exista.",
            "O Bibliotecário registra a devolução com a classe Empréstimo.",
            "A classe Empréstimo registra liberação do Exemplar.",
            "O Bibliotecário confirma a devolução ao UsuarioBiblioteca.",
            "Código: `' Sequência de Devolução de livros` `UsuarioBiblioteca -> Bibliotecario: solicitarDevolucao( )` `activate Bibliotecario` `Bibliotecario -> Emprestimo: verificarEmprestimo( )` `activate Emprestimo` `Emprestimo -> Emprestimo: calcularMulta` `Emprestimo -> Bibliotecario: multa` `Bibliotecario --> Emprestimo: registrarDevolucao( )` `Emprestimo -> Exemplar: liberarExemplar( )` `activate Exemplar` `Exemplar -> Emprestimo: liberado` `deactivate Exemplar` `Emprestimo --> Bibliotecario: devolucao registrada` `deactivate Emprestimo` `Bibliotecario --> UsuarioBiblioteca: devolucao realizada` `deactivate Bibliotecario`"
          ]
        },
        {
          tipo: "topico",
          titulo: "d) Renovação de Empréstimo",
          lista: [
            "O UsuarioBiblioteca solicita uma renovação do empréstimo ao Bibliotecário.",
            "O Bibliotecario altera o empréstimo com a classe Empréstimo, verificando se há Reservas realizadas ou se pode renovar.",
            "A classe Empréstimo renova o empréstimo.",
            "O Bibliotecário confirma a renovação ao UsuarioBiblioteca.",
            "Código: `' Sequência de Renovação de empréstimo` `UsuarioBiblioteca -> Bibliotecario: solicitarRenovacaoEmprestimo( )` `activate Bibliotecario` `Bibliotecario -> Emprestimo: alterarEmprestimo` `activate Emprestimo` `Emprestimo -> Reserva: verificarReservas` `activate Reserva` `Reserva -> Emprestimo: pode renovar` `deactivate Reserva` `Emprestimo --> Bibliotecario: emprestimo renovado` `deactivate Emprestimo` `Bibliotecario --> UsuarioBiblioteca: renovacao realizada` `deactivate Bibliotecario`"
          ]
        },
        {
          tipo: "topico",
          titulo: "e) Consultando Catálogo de Livros",
          lista: [
            "O Usuário consulta Livros disponíveis.",
            "Usuário vê também os Exemplares dos Livros.",
            "Código: `' Sequência para consultar livros` `UsuarioBiblioteca -> Livro: consultarCatalogoLivros()` `activate Livro` `Livro -> Exemplar: consultarExemplares()` `activate Exemplar` `Exemplar -> Livro: Exemplares` `deactivate Exemplar` `Livro -> UsuarioBiblioteca: Livro com seus exemplares` `deactivate Livro`"
          ]
        }
      ]
    },
    {
      id: "consideracoes_finais",
      titulo: "Considerações finais",
      blocos: [
        {
          tipo: "texto",
          texto: "Conforme procuramos explicar neste módulo, os diagramas UML abordados são ferramentas fundamentais para a modelagem e entendimento de sistemas complexos. Ao utilizarmos esses diagramas, conseguimos representar de forma clara as interações entre usuários e o sistema, a estrutura das classes e o fluxo de informações, facilitando a comunicação entre a equipe de desenvolvimento e os stakeholders."
        },
        {
          tipo: "texto",
          texto: "A aplicação desses conceitos no Sistema de Controle de Biblioteca (SCB) nos permitiu visualizar como os requisitos funcionais são traduzidos em componentes tangíveis de software. A modelagem com PlantUML demonstrou-se uma ferramenta poderosa e flexível, que nos ajudou a padronizar nossos diagramas e a preparar uma base sólida para a implementação do sistema."
        },
        {
          tipo: "texto",
          texto: "No próximo módulo, continuaremos nossa jornada pela UML, explorando diagramas essenciais para entender o comportamento e a estrutura dos sistemas de maneira ainda mais aprofundada. Abordaremos o **Diagrama de Estados**, que nos permitirá compreender como as entidades do sistema mudam de estado; o **Diagrama de Atividades**, focado nos fluxos de trabalho e processos do sistema; o **Diagrama de Componentes**, que detalha a organização física dos componentes de software."
        },
        {
          tipo: "texto",
          texto: "Essas próximas etapas serão cruciais para completarmos nossa modelagem e garantirmos que todos os aspectos dinâmicos e estruturais do sistema estejam devidamente representados. Bons estudos!"
        }
      ]
    }
  ]
},

// aula 11
{
  aula: "Diagramas UML II e Implementação Básica",
  ideia_central: "Completar a modelagem UML do Sistema de Controle de Biblioteca (SCB) com os diagramas de Estados, Atividades e Componentes e mostrar como traduzir os modelos em uma implementação inicial em Node.js, organizada no padrão MVC.",
  secoes: [
    {
      id: "introducao",
      titulo: "Introdução",
      blocos: [
        {
          tipo: "lista",
          titulo: "Objetivos do módulo",
          itens: [
            "Conhecer diagrama de estados;",
            "Conhecer diagrama de atividades;",
            "Conhecer diagrama de componentes;",
            "Demonstrar a transição dos modelos UML para uma implementação básica em uma linguagem de programação."
          ]
        },
        {
          tipo: "texto",
          texto: "No módulo anterior, apresentamos o sistema fictício **Sistema de Controle de Biblioteca (SCB)**, onde definimos os seus requisitos funcionais, especificamos as suas **User Stories** e construímos a sua modelagem inicial em UML, incluindo os diagramas de **Casos de Uso**, **Classes** e **Sequência**."
        },
        {
          tipo: "texto",
          texto: "Neste módulo, continuaremos nossa jornada de modelagem, explorando novos diagramas para aprofundar nossa compreensão do sistema. Vamos trabalhar com os diagramas de **Estados**, **Atividades** e **Componentes**, essenciais para mapear as interações e a arquitetura do SCB."
        },
        {
          tipo: "texto",
          texto: "Além disso, faremos a transição dos modelos para uma implementação inicial em **Node.js**, mostrando como poderíamos transformar as abstrações da modelagem em código. Boa leitura!"
        }
      ]
    },
    {
      id: "diagrama_estados",
      titulo: "1 Diagrama de estados",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Diagrama de Estados** em UML é uma representação gráfica que descreve os diferentes **estados** pelos quais uma entidade do sistema pode passar e as **transições** que ocorrem entre esses estados em resposta a **eventos**. Em modelagem de sistemas de software, ele é usado para detalhar o **comportamento dinâmico de um objeto específico**, mostrando como ele reage a diversas condições e ações ao longo de seu **ciclo de vida**. Esse diagrama é especialmente útil para sistemas onde é necessário acompanhar o estado de objetos complexos, como o status de um pedido, um processo."
        },
        {
          tipo: "texto",
          texto: "Com relação ao nosso sistema proposto no módulo anterior, Sistema de Controle de Biblioteca (SCB), usaremos o diagrama de estados para representar o **ciclo de vida de um exemplar de livro** na biblioteca, considerando transições como \"**Disponível**\", \"**Reservado**\" e \"**Emprestado**\". Esse diagrama ajuda a entender como a entidade muda de estado em resposta a eventos."
        },
        {
          tipo: "texto",
          texto: "No Quadro 1, apresentamos o código PlantUML do Diagrama de Estados, e a Figura 1 ilustra a representação gráfica desse ciclo."
        },
        {
          tipo: "lista",
          titulo: "Quadro 1 – Código PlantUML do diagrama de estados do sistema SCB",
          itens: [
            "`@startuml`",
            "`title Diagrama de Estados - Exemplar do Livro`",
            "`left to right direction`",
            "`[*] --> Disponível`",
            "`Disponível --> Reservado : reservar( )`",
            "`Reservado --> Disponível : cancelarReserva( )`",
            "`Disponível --> Emprestado : emprestar( )`",
            "`Emprestado --> Disponível : devolver( )`",
            "`Emprestado --> Reservado : reservarAoDevolver( )`",
            "`@enduml`"
          ]
        },
        {
          tipo: "imagem",
          src: "figura_1_diagrama_de_estados_do_scb.png",
          pasta: "imagens_analise_projeto/aula_11",
          alt: "Figura 1 – Diagrama de Estados do SCB. Diagrama de Estados - Exemplar do Livro: o estado inicial leva a Disponível; Disponível vai a Reservado por reservar() e a Emprestado por emprestar(); Emprestado volta a Disponível por devolver() e vai a Reservado por reservarAoDevolver(); Reservado volta a Disponível por cancelarReserva().",
          num: 1
        },
        {
          tipo: "destaque",
          texto: "MULTIMÍDIA – Para aprofundar mais os seus conhecimentos na criação de Diagramas de Estados, sugerimos o ótimo vídeo desenvolvido pelo canal sobre Engenharia de Software de Ingrid Marçal. Fonte: Marçal (2020)."
        }
      ]
    },
    {
      id: "diagrama_atividades",
      titulo: "2 Diagrama de atividades",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Diagrama de Atividades** em UML é ideal para representar o **fluxo de trabalho** ou os **processos** dentro de um sistema, mostrando como as atividades se organizam e quais condições devem ser atendidas para avançarmos de uma etapa para outra. Ele é especialmente útil para modelar **sequências de ações** e **tomadas de decisão**."
        },
        {
          tipo: "texto",
          texto: "Para o sistema SCB, vamos utilizar o diagrama de atividades para representar o **processo de empréstimo de um livro**, incluindo a solicitação do usuário, a verificação de disponibilidade e o registro do empréstimo ou aviso de indisponibilidade. Esse diagrama proporciona uma visão clara das ações e decisões envolvidas nesse fluxo."
        },
        {
          tipo: "texto",
          texto: "O Quadro 2 apresenta o código PlantUML do Diagrama de Atividades, e a Figura 2 mostra sua representação visual."
        },
        {
          tipo: "lista",
          titulo: "Quadro 2 – Código PlantUML do Diagrama de Atividades do SCB",
          itens: [
            "`@startuml`",
            "`title Diagrama de Atividades - Processo de Empréstimo de Livro`",
            "`start`",
            "`:Usuário solicita empréstimo;`",
            "`if (Exemplar disponível?) then (sim)`",
            "`if (Livro com \\n Reserva?) then (sim)`",
            "`if (Usuário fez\\n reserva) then (sim)`",
            "`:Emprestar livro \\n ao usuário;`",
            "`else (não)`",
            "`:Informar usuário \\n sobre a\\n indisponibilidade;`",
            "`endif`",
            "`else (não)`",
            "`:Emprestar livro \\n ao usuário;`",
            "`endif`",
            "`else (não)`",
            "`:Informar usuário \\n sobre a\\n indisponibilidade;`",
            "`endif`",
            "`stop`",
            "`@enduml`"
          ]
        },
        {
          tipo: "imagem",
          src: "figura_2_diagrama_de_atividades_do_scb.png",
          pasta: "imagens_analise_projeto/aula_11",
          alt: "Figura 2 – Diagrama de Atividades do SCB. Diagrama de Atividades - Processo de Empréstimo de Livro: do início, “Usuário solicita empréstimo” leva à decisão “Exemplar disponível?”. Se não, informa o usuário sobre a indisponibilidade. Se sim, a decisão “Livro com Reserva?”: se não, empresta o livro ao usuário; se sim, a decisão “Usuário fez reserva”: sim leva a emprestar o livro e não leva a informar a indisponibilidade. Losangos (merge) reúnem os fluxos antes do nó final.",
          num: 2
        },
        {
          tipo: "destaque",
          texto: "MULTIMÍDIA – Para aprofundar mais os seus conhecimentos na criação de Diagramas de Atividades, sugerimos o ótimo vídeo desenvolvido pelo canal da Bóson Treinamentos. Fonte: Bóson Treinamentos (2022)."
        }
      ]
    },
    {
      id: "diagrama_componentes",
      titulo: "3 Diagrama de componentes",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Diagrama de Componentes** em UML nos ajuda a entender a **arquitetura física** do sistema, representando os **componentes de software** e as suas **interações**. Esse diagrama fornece uma visão de alto nível da estrutura do sistema, indicando como os módulos e as suas dependências se relacionam, e onde as funcionalidades estão alocadas."
        },
        {
          tipo: "texto",
          texto: "No SCB, usaremos o diagrama de componentes para mostrar como organizamos os principais módulos do sistema e como eles interagem, incluindo o **aplicativo web**, a **API** e o **banco de dados**. Esse diagrama nos permite visualizar a arquitetura geral e a distribuição das responsabilidades entre os componentes."
        },
        {
          tipo: "texto",
          texto: "O Quadro 3 contém o código PlantUML do Diagrama de Componentes, e a Figura 3 exibe sua representação gráfica."
        },
        {
          tipo: "lista",
          titulo: "Quadro 3 – Código PlantUML do Diagrama de Componentes do SCB",
          itens: [
            "`@startuml`",
            "`title Diagrama de Componentes - SCB`",
            "`package \"Sistema de Controle de Biblioteca\" {`",
            "`[App Web] - [API]`",
            "`[API] - [Banco de Dados]`",
            "`[API] - [Serviço de Autenticação]`",
            "`[App Web] <<Cliente>>`",
            "`[API] <<Servidor RESTful>>`",
            "`[Banco de Dados] <<MySQL ou PostgreSQL>>`",
            "`}`",
            "`/home/wwagner/projetos/diagramas-uml/out/diagrama-de-componentes/diagrama-de-componentes.png`",
            "`@enduml`"
          ]
        },
        {
          tipo: "imagem",
          src: "figura_3_diagrama_de_componentes_do_scb.png",
          pasta: "imagens_analise_projeto/aula_11",
          alt: "Figura 3 – Diagrama de Componentes do SCB. Dentro do pacote “Sistema de Controle de Biblioteca”, quatro componentes em linha: App Web («Cliente»), API («Servidor RESTful»), Serviço de Autenticação e Banco de Dados («MySQL ou PostgreSQL»). App Web e API se ligam por uma linha, API e Serviço de Autenticação por outra, e a API se liga ao Banco de Dados por uma linha em arco.",
          num: 3
        },
        {
          tipo: "destaque",
          texto: "MULTIMÍDIA – Para aprofundar mais os seus conhecimentos na criação de Diagramas de Componentes, sugerimos o ótimo vídeo desenvolvido pelo canal Estudo na Web. Fonte: Estudo na Web (2017)."
        }
      ]
    },
    {
      id: "implementacao_basica",
      titulo: "4 Implementação básica",
      blocos: [
        {
          tipo: "texto",
          texto: "Nesta etapa do nosso material, abordaremos a implementação inicial do sistema utilizando **Node.js**, um passo importante para a transição da modelagem teórica para o desenvolvimento prático."
        },
        {
          tipo: "destaque",
          texto: "PARADA OBRIGATÓRIA – O Node.js é uma plataforma de desenvolvimento de software que permite executar código JavaScript no lado do servidor, possibilitando a construção de aplicações rápidas e escaláveis. Desenvolvido com base no motor V8 do Google Chrome, o Node.js é conhecido por seu desempenho eficiente, já que é projetado para lidar com operações de I/O (entrada e saída) de maneira assíncrona e orientada a eventos. Isso significa que ele é especialmente adequado para aplicações que demandam alta taxa de requisição e resposta em tempo real, como APIs RESTful, chats em tempo real e sistemas de streaming de dados. Como foi dito anteriormente, a linguagem de programação utilizada no Node.js é o JavaScript, originalmente criado para desenvolvimento no lado do cliente (front-end) dos navegadores. Com o Node.js, o JavaScript se expandiu para o lado do servidor, permitindo que desenvolvedores usem a mesma linguagem para o front-end e o back-end das aplicações. Fontes (respectivamente): V8.dev; Borghi (2023); AWS. Amazon; MDN Web.docs; Wikipadia (2020)."
        },
        {
          tipo: "texto",
          texto: "A partir dos diagramas construídos para o Sistema de Controle de Bibliotecas, organizamos o projeto em **módulos de código** que correspondem aos elementos e interações descritos durante a análise e o projeto."
        },
        {
          tipo: "texto",
          texto: "Esse processo permite que a equipe de desenvolvimento avance para a codificação de forma estruturada, garantindo que o sistema atenda aos requisitos definidos e que cada componente cumpra seu papel dentro da arquitetura planejada. Iniciaremos pela definição da estrutura básica do projeto, organizando os arquivos de forma modular, o que facilita a manutenção, a expansão e a compreensão do sistema."
        }
      ]
    },
    {
      id: "estrutura_projeto_nodejs",
      titulo: "4.1 Estrutura do projeto em Node.js",
      blocos: [
        {
          tipo: "texto",
          texto: "Com a modelagem completa, partimos para a implementação inicial do projeto em Node.js. Escolhemos essa plataforma por ser bastante versátil e utilizada em projetos para web."
        },
        {
          tipo: "texto",
          texto: "A seguir (Quadro 4) mostramos a estrutura básica do projeto, que organiza os arquivos e separa as responsabilidades entre **controladores**, **modelos** e **rotas**, fornecendo uma base sólida para a equipe de desenvolvimento expandir o sistema."
        },
        {
          tipo: "lista",
          titulo: "Quadro 4 – Estrutura do projeto em Node.js",
          itens: [
            "`scb/`",
            "`├── controllers/`",
            "`│ ├── bookController.js`",
            "`│ ├── loanController.js`",
            "`├── models/`",
            "`│ ├── book.js`",
            "`│ ├── loan.js`",
            "`│ ├── user.js`",
            "`├── routes/`",
            "`│ ├── bookRoutes.js`",
            "`│ ├── loanRoutes.js`",
            "`├── app.js`",
            "`├── config/`",
            "`│ └── db.js`",
            "`└── package.json`"
          ]
        },
        {
          tipo: "texto",
          texto: "A divisão de pastas apresentada no Quadro 4 reflete a decisão de arquitetura que decidimos utilizar para a implementação de nosso sistema. Estamos usando o **Model-View-Controller (MVC)** em nosso sistema SCB."
        },
        {
          tipo: "topico",
          titulo: "Arquitetura MVC",
          texto: "A arquitetura ou modelo arquitetural **MVC** é um padrão que organiza a estrutura de uma aplicação em três camadas principais: **Model**, **View** e **Controller**. Esse modelo facilita a **separação de responsabilidades**, tornando o código mais modular e facilitando a manutenção e a expansão da aplicação."
        },
        {
          tipo: "destaque",
          texto: "MULTIMÍDIA – Para aprofundar mais os seus conhecimentos sobre MVC, sugerimos o ótimo vídeo desenvolvido pelo canal sobre Engenharia de Software de Ingrid Marçal. Fonte: Marçal (2021)."
        },
        {
          tipo: "texto",
          texto: "No contexto de uma aplicação web como o sistema que estamos desenvolvendo, cada camada tem uma função específica: a **Model** lida com a lógica de dados e interações com o banco de dados, a **View** é responsável por apresentar a interface ao usuário, e a **Controller** atua como intermediária, processando as requisições e coordenando a comunicação entre a Model e a View."
        },
        {
          tipo: "lista",
          titulo: "No projeto, os arquivos estão organizados para seguir esse modelo",
          itens: [
            "1) **Models** – Contém os arquivos `book.js`, `loan.js` e `user.js`, que definem as estruturas de dados e interações com o banco de dados para os livros, empréstimos e usuários, respectivamente. Aqui, são definidos atributos, métodos e validações dos dados;",
            "2) **Controllers** – Nos arquivos `bookController.js` e `loanController.js`, encontramos a lógica de controle da aplicação. Eles processam as requisições do usuário, acessam os modelos (Models) para buscar ou modificar dados e retornam uma resposta adequada;",
            "3) **Routes** – Os arquivos `bookRoutes.js` e `loanRoutes.js` contêm as definições das rotas da aplicação, mapeando URLs para os métodos nos Controllers, o que permite que o sistema organize e distribua requisições entre as diferentes funcionalidades;",
            "4) **app.js** – Este arquivo é o ponto de entrada da aplicação. Ele configura o servidor, importa as rotas e inicializa o sistema;",
            "5) **config/db.js** – Gerencia a configuração da conexão com o banco de dados, garantindo que a aplicação se conecte de forma correta e segura;",
            "6) **package.json** – Esse arquivo contém as configurações do projeto, incluindo as dependências e scripts necessários para rodar o ambiente Node.js."
          ]
        },
        {
          tipo: "texto",
          texto: "Cada uma dessas partes trabalha em conjunto para organizar o fluxo de dados e o controle da aplicação de forma clara e escalável."
        }
      ]
    },
    {
      id: "codigo_modelo_book",
      titulo: "4.2 Exemplo de código para o modelo Book",
      blocos: [
        {
          tipo: "texto",
          texto: "O modelo **Book** define a estrutura e o comportamento de um exemplar de livro, implementando métodos para verificar e atualizar o estado de disponibilidade do exemplar. O código deste modelo pode ser visto no Quadro 5."
        },
        {
          tipo: "lista",
          titulo: "Quadro 5 – Código do modelo BOOK",
          itens: [
            "`// models/book.js`",
            "`const mongoose = require('mongoose');`",
            "`const bookSchema = new mongoose.Schema({`",
            "`title: String,`",
            "`author: String,`",
            "`ISBN: String,`",
            "`status: { type: String, enum: ['Disponível', 'Reservado', 'Emprestado'], default: 'Disponível' }`",
            "`});`",
            "`bookSchema.methods.reserve = function() {`",
            "`if (this.status === 'Disponível') {`",
            "`this.status = 'Reservado';`",
            "`return true;`",
            "`}`",
            "`return false;`",
            "`};`",
            "`bookSchema.methods.borrow = function() {`",
            "`if (this.status === 'Disponível') {`",
            "`this.status = 'Emprestado';`",
            "`return true;`",
            "`}`",
            "`return false;`",
            "`};`",
            "`module.exports = mongoose.model('Book', bookSchema);`"
          ]
        }
      ]
    },
    {
      id: "codigo_loan_controller",
      titulo: "4.3 Controlador de empréstimos loanController",
      blocos: [
        {
          tipo: "texto",
          texto: "O **loanController** gerencia a criação de empréstimos, verificando a disponibilidade do exemplar e registrando o empréstimo no sistema. O código deste Controller pode ser visto no Quadro 6."
        },
        {
          tipo: "lista",
          titulo: "Quadro 6 – Código do controller loanController",
          itens: [
            "`// controllers/loanController.js`",
            "`const Book = require('../models/book');`",
            "`const Loan = require('../models/loan');`",
            "`exports.createLoan = async (req, res) => {`",
            "`try {`",
            "`const book = await Book.findById(req.body.bookId);`",
            "`if (book.borrow()) {`",
            "`const loan = new Loan({`",
            "`userId: req.body.userId,`",
            "`bookId: book._id,`",
            "`loanDate: new Date(),`",
            "`returnDate: null`",
            "`});`",
            "`await loan.save();`",
            "`await book.save();`",
            "`res.status(200).json({ message: 'Empréstimo realizado com sucesso!' });`",
            "`} else {`",
            "`res.status(400).json({ message: 'Livro não disponível para empréstimo.' });`",
            "`}`",
            "`} catch (error) {`",
            "`res.status(500).json({ error: 'Erro ao processar o empréstimo.' });`",
            "`}`",
            "`};`"
          ]
        },
        {
          tipo: "texto",
          texto: "Como o principal mote deste texto é apresentar a transição entre a modelagem e a implementação do sistema, não apresentaremos todo o código para o SCB. Esse sistema necessita de maiores aprofundamentos em seus requisitos para que fosse, de fato, interessante colocá-lo em produção, porém, a intenção não é apresentar um sistema completamente viável, mas sim, as etapas da sua análise, modelagem e implementação."
        },
        {
          tipo: "destaque",
          texto: "MULTIMÍDIA – Para aprofundar mais os seus conhecimentos sobre Node.Js, sugerimos uma ótima playlist de vídeos, desenvolvida pelo canal de Victor Lima, da Ciência da Computação. Fonte: Lima (2018)."
        }
      ]
    },
    {
      id: "consideracoes_finais",
      titulo: "Considerações finais",
      blocos: [
        {
          tipo: "texto",
          texto: "Neste módulo, expandimos a modelagem UML do SCB e mostramos como traduzir os diagramas em uma implementação inicial com Node.js. Os diagramas de Estados, Atividades e Componentes nos permitiram entender as interações e a estrutura do sistema de forma mais aprofundada, e o código exemplificou como essas abstrações podem ser aplicadas na prática."
        },
        {
          tipo: "texto",
          texto: "No próximo módulo, iniciaremos nossa jornada aos **Padrões de projetos**, recursos importantes para melhoria da qualidade dos sistemas e simplificação da complexidade dos códigos desenvolvidos. Bons estudos!"
        }
      ]
    }
  ]
},

// aula 12
{
  aula: "Introdução a Padrões de Projetos",
  ideia_central: "Os Padrões de Projeto são soluções reutilizáveis para problemas recorrentes no design de software, catalogadas pelo Gang of Four em 23 padrões divididos em três categorias (Criacionais, Estruturais e Comportamentais), com o Singleton como exemplo prático.",
  secoes: [
    {
      id: "introducao",
      titulo: "Introdução",
      blocos: [
        {
          tipo: "lista",
          titulo: "Objetivos do módulo",
          itens: [
            "Saber o que são padrões de projeto;",
            "Explorar as características de padrões de projeto;",
            "Saber o que são os padrões *Gang of Four*."
          ]
        },
        {
          tipo: "texto",
          texto: "Nos anos 1990, a engenharia de software passou por uma revolução com a publicação do famoso livro \"*Design Patterns: Elements of Reusable Object-Oriented Software*\" por quatro autores, conhecidos como o **Gang of Four (GoF)**. Eles apresentaram ao mundo um conjunto de **soluções reutilizáveis** para problemas comuns em design de software, codificados em **padrões de projeto**. Esses padrões servem como uma espécie de \"**caixa de ferramentas**\" que desenvolvedores e arquitetos podem usar para resolver desafios frequentes de maneira elegante e eficaz."
        },
        {
          tipo: "texto",
          texto: "No contexto da **Análise e Projeto de Sistemas (APS)**, os padrões de projeto fornecem uma estrutura para transformar as ideias levantadas durante a análise em uma implementação prática e eficiente. Eles são uma forma de garantir que soluções bem-sucedidas, testadas e refinadas ao longo do tempo possam ser aplicadas em novos contextos, evitando que cada desenvolvedor tenha que \"reinventar a roda\"."
        },
        {
          tipo: "texto",
          texto: "Neste módulo, introduziremos os padrões de projeto mais comuns e a história por trás deles. Mostraremos o que caracteriza um padrão de projeto, as suas principais vantagens e as razões pelas quais se tornaram uma parte tão importante do desenvolvimento de software moderno. Também exploraremos o conjunto de padrões apresentados pelo *Gang of Four*, um marco na literatura da engenharia de software. Boa leitura!"
        }
      ]
    },
    {
      id: "o_que_sao_padroes",
      titulo: "1 O que são padrões de projeto",
      blocos: [
        {
          tipo: "texto",
          texto: "Os **Padrões de Projeto** são **soluções reutilizáveis para problemas recorrentes no design de software**. Ao invés de apresentar um código específico, eles fornecem uma **estrutura genérica** para resolver problemas de design de forma elegante e eficiente. Cada padrão descreve um **problema particular** que ocorre com frequência, a **solução** para esse problema e as **consequências** de aplicá-la. Dessa forma, os padrões de projeto promovem uma **linguagem comum entre desenvolvedores e arquitetos**, facilitando a comunicação e a colaboração."
        },
        {
          tipo: "texto",
          texto: "Em essência, um padrão de projeto é uma espécie de \"**receita**\" para construir soluções de design robustas e fáceis de manter, facilitando a **escalabilidade** e a **flexibilidade** do software. Eles surgiram a partir da necessidade de criar soluções que fossem tanto adaptáveis a mudanças quanto fáceis de entender para outros desenvolvedores."
        }
      ]
    },
    {
      id: "gang_of_four",
      titulo: "2 Introdução ao Gang of Four",
      blocos: [
        {
          tipo: "texto",
          texto: "O termo \"*Gang of Four*\", ou **GoF**, se refere aos quatro autores — **Erich Gamma, Richard Helm, Ralph Johnson e John Vlissides** — que publicaram o livro que definiu os padrões de projeto modernos em **1994**. Seu título é *Design Patterns: Elements of Reusable Object-Oriented Software* (ver Figura 1). Neste livro, eles documentaram **23 padrões de projeto fundamentais**, organizando-os em **três categorias principais**. São elas: **Padrões Criacionais**, **Padrões Estruturais** e **Padrões Comportamentais**."
        },
        {
          tipo: "imagem",
          src: "figura_1_capa_do_livro_do_gof.png",
          pasta: "imagens_analise_projeto/aula_12",
          alt: "Figura 1 – Capa do Livro do GoF. Capa do livro “Design Patterns: Elements of Reusable Object-Oriented Software”, com os nomes dos autores (Erich Gamma, Richard Helm, Ralph Johnson e John Vlissides) e uma ilustração. Fonte: Portal do Digital Ocean.",
          num: 1
        },
        {
          tipo: "texto",
          texto: "Esses 23 padrões se tornaram um ponto de referência obrigatório para engenheiros de software ao redor do mundo, estabelecendo um vocabulário comum e uma estrutura sólida para resolver problemas recorrentes de design de software. No Quadro 1, apresentamos estes padrões e um pequeno descritivo para que você possa conhecê-los."
        },
        {
          tipo: "tabela",
          titulo: "Quadro 1 – Os 23 padrões propostos pelo GoF",
          colunas: ["Categoria", "Padrão", "Descrição"],
          linhas: [
            ["Criacionais", "Factory Method", "Define uma interface para criação de objetos, mas permite que subclasses decidam quais classes instanciar, promovendo flexibilidade na criação de instâncias."],
            ["Criacionais", "Abstract Factory", "Fornece uma interface para criar famílias de objetos relacionados ou dependentes, sem especificar as suas classes concretas."],
            ["Criacionais", "Builder", "Separa a construção de um objeto complexo da sua representação final, permitindo diferentes representações do objeto serem criadas com o mesmo processo de construção."],
            ["Criacionais", "Prototype", "Especifica os tipos de objetos a serem criados usando uma instância-protótipo e cria objetos copiando este protótipo."],
            ["Criacionais", "Singleton", "Garante que uma classe tenha apenas uma instância e fornece um ponto de acesso global a ela."],
            ["Estruturais", "Adapter", "Permite que interfaces incompatíveis trabalhem juntas ao adaptar uma interface de uma classe para que ela funcione com outra."],
            ["Estruturais", "Bridge", "Desacopla uma abstração de sua implementação, permitindo que as duas evoluam de maneira independente."],
            ["Estruturais", "Composite", "Composição de objetos em estruturas de árvore para representar hierarquias de parte-todo, onde os clientes podem tratar objetos individuais e composições de maneira uniforme."],
            ["Estruturais", "Decorator", "Permite adicionar funcionalidades a objetos individualmente, de maneira flexível, através de uma classe decoradora que \"envolve\" o objeto original."],
            ["Estruturais", "Facade", "Fornece uma interface simplificada para um conjunto complexo de classes, facilitando a interação com o sistema."],
            ["Estruturais", "Flyweight", "Reduz o uso de memória compartilhando o maior número possível de dados entre objetos similares, ideal para lidar com grande quantidade de objetos de maneira eficiente."],
            ["Estruturais", "Proxy", "Fornece um substituto ou placeholder para outro objeto, controlando o acesso a ele, frequentemente para adicionar funcionalidades de segurança ou controle de acesso."],
            ["Comportamentais", "Chain of Responsibility", "Permite que um pedido percorra uma cadeia de objetos, onde cada um tem a oportunidade de tratá-lo, promovendo um acoplamento flexível entre remetentes e receptores de pedidos."],
            ["Comportamentais", "Command", "Encapsula uma solicitação como um objeto, permitindo parametrizar clientes com diferentes solicitações e realizar operações reversíveis."],
            ["Comportamentais", "Interpreter", "Define uma gramática para uma linguagem e um interpretador para interpretar as sentenças dessa linguagem, ideal para situações onde comandos ou instruções necessitam ser processados."],
            ["Comportamentais", "Iterator", "Fornece uma maneira de acessar os elementos de uma coleção de forma sequencial sem expor a estrutura subjacente da coleção."],
            ["Comportamentais", "Mediator", "Define um objeto que encapsula como um conjunto de objetos interage, promovendo o baixo acoplamento ao evitar a comunicação direta entre objetos."],
            ["Comportamentais", "Memento", "Permite capturar e restaurar o estado interno de um objeto sem violar seu encapsulamento, útil para implementar funcionalidades como \"desfazer\"."],
            ["Comportamentais", "Observer", "Define uma dependência um-para-muitos entre objetos, onde a mudança de estado de um objeto notifica automaticamente todos os objetos dependentes dele."],
            ["Comportamentais", "State", "Permite que um objeto altere seu comportamento quando seu estado interno muda, fazendo com que pareça que a classe do objeto mudou."],
            ["Comportamentais", "Strategy", "Define uma família de algoritmos, encapsula cada um deles e permite que sejam intercambiáveis, facilitando a escolha de algoritmos conforme o contexto."],
            ["Comportamentais", "Template Method", "Define o esqueleto de um algoritmo em uma operação, permitindo que subclasses redefinam certos passos do algoritmo sem mudar sua estrutura."],
            ["Comportamentais", "Visitor", "Representa uma operação a ser realizada sobre elementos de uma estrutura de objetos, permitindo adicionar novas operações sem alterar as classes dos elementos sobre os quais opera."]
          ]
        },
        {
          tipo: "texto",
          texto: "O livro do GoF representa uma síntese de anos de experiência prática e pesquisa acadêmica, codificando práticas que se provaram eficazes ao longo do tempo."
        },
        {
          tipo: "destaque",
          texto: "MULTIMÍDIA – Aqui o vídeo de um canal que gosto bastante, o 4while: Design Patterns - Video #2 - Conhecendo os padrões GOF. Fonte: 4while (2016)."
        },
        {
          tipo: "destaque",
          texto: "LEITURA COMPLEMENTAR – Embora seja em inglês, sugerimos a leitura do artigo “Gang of Four (GOF) Design Patterns”, do portal Geeks Forge Geeks. Este artigo aborda de uma forma simples e prática o tema discutido nesta seção. Fonte: Geeksforgeeks.org."
        }
      ]
    },
    {
      id: "caracteristicas",
      titulo: "3 Características de padrões de projeto",
      blocos: [
        {
          tipo: "texto",
          texto: "Os padrões de projeto têm várias características que os tornam ferramentas valiosas no desenvolvimento de software."
        },
        {
          tipo: "texto",
          texto: "Nesta seção, apresentamos algumas dessas características, porém, voltaremos a elas quando estivermos apresentando diferentes tipos de padrões. Note, nossa intenção não é que você busque decorar o que faz um padrão de projeto ser interessante, mas que possa compreender seu funcionamento, aplicação e, assim, possa de fato entender as suas características."
        },
        {
          tipo: "lista",
          titulo: "Características dos padrões de projeto",
          itens: [
            "**Reutilização de código** – Ao adotar padrões de projeto, é possível economizar tempo e esforço, pois muitos problemas de design comuns já têm soluções bem definidas.",
            "**Flexibilidade e manutenibilidade** – Os padrões de projeto facilitam a criação de sistemas que podem ser adaptados e mantidos facilmente.",
            "**Comunicabilidade** – Os padrões de projeto criam uma linguagem comum entre equipes de desenvolvimento, permitindo que a comunicação sobre o design do software seja clara e direta.",
            "**Organização e estrutura** – Eles oferecem uma estrutura para organizar o código, facilitando a identificação de responsabilidades e a definição de interações entre diferentes partes do sistema."
          ]
        }
      ]
    },
    {
      id: "categorias",
      titulo: "3.1 Principais categorias dos padrões de projeto",
      blocos: [
        {
          tipo: "texto",
          texto: "Os padrões de projeto podem ser organizados em **três categorias principais**, como citamos na seção anterior. Cada uma focada em resolver diferentes aspectos de **criação**, **estrutura** e **comportamento** de objetos e classes dentro de um sistema."
        },
        {
          tipo: "topico",
          titulo: "Padrões Criacionais",
          texto: "Primeiro, os **Padrões Criacionais** abordam a **criação flexível e controlada de objetos**. Eles buscam reduzir a dependência direta de construtores, permitindo que sistemas se adaptem facilmente a novos tipos de objetos sem exigir modificações extensas no código. Padrões como **Factory Method**, **Singleton** e **Builder** são usados para garantir que a criação de objetos seja eficiente e organizada, especialmente em sistemas que precisam de diferentes instâncias ou de um controle rigoroso sobre a criação e o ciclo de vida dos seus objetos."
        },
        {
          tipo: "topico",
          titulo: "Padrões Estruturais",
          texto: "À medida que os objetos são criados, surge a necessidade de organizá-los de maneira coesa e escalável, o que leva ao uso dos **Padrões Estruturais**. Esses padrões tratam da **composição e da organização dos elementos dentro do sistema**, permitindo que classes e objetos se combinem em estruturas mais complexas sem comprometer a legibilidade ou a manutenibilidade do código. Padrões como **Adapter**, **Decorator** e **Facade** ajudam a compor sistemas em módulos bem definidos e facilitam a adição de novas funcionalidades. Eles permitem, por exemplo, que objetos com interfaces incompatíveis se comuniquem de forma harmoniosa ou que funcionalidades adicionais sejam integradas sem necessidade de alterar o código principal."
        },
        {
          tipo: "topico",
          titulo: "Padrões Comportamentais",
          texto: "Finalmente, para que esses objetos e classes colaborem de forma eficaz, os **Padrões Comportamentais** entram em ação. Esses padrões se concentram na **interação entre os componentes do sistema**, promovendo a flexibilidade e a descentralização do controle de fluxo. Eles oferecem maneiras de distribuir responsabilidades entre os objetos, promovendo um design onde o comportamento do sistema pode ser modificado em tempo de execução sem afetar a estrutura subjacente. Padrões como **Observer**, **Strategy** e **Command** são exemplos de como gerenciar essas interações, facilitando a criação de sistemas adaptáveis e responsivos, onde objetos podem reagir a eventos ou alterar sua lógica de maneira dinâmica."
        },
        {
          tipo: "imagem",
          src: "representacao_visual_essas_tres_categorias_de_padroes_de_projeto.png",
          pasta: "imagens_analise_projeto/aula_12",
          alt: "Representação visual das três categorias de padrões de projeto: três peças de quebra-cabeça encaixadas (Criacional, Estrutural e Comportamental), acompanhadas do texto “Se complementam para formar uma base sólida e escalável no desenvolvimento de software. Cada categoria resolve um conjunto específico de problemas, e, juntas, oferecem ferramentas para que desenvolvedores criem sistemas que são flexíveis, bem-organizados e preparados para evoluir ao longo do tempo.”",
          num: 2
        },
        {
          tipo: "destaque",
          texto: "ESSAS TRÊS CATEGORIAS (Criacional, Estrutural e Comportamental) se complementam para formar uma base sólida e escalável no desenvolvimento de software. Cada categoria resolve um conjunto específico de problemas, e, juntas, oferecem ferramentas para que desenvolvedores criem sistemas que são flexíveis, bem-organizados e preparados para evoluir ao longo do tempo."
        }
      ]
    },
    {
      id: "exemplo_singleton",
      titulo: "3.2 Um exemplo para compreender melhor os conceitos",
      blocos: [
        {
          tipo: "texto",
          texto: "Vamos explorar o padrão **Singleton**, que é um dos padrões de projeto GoF e faz parte da categoria dos **padrões criacionais**. O Singleton é útil quando precisamos garantir que uma classe tenha **apenas uma instância** e que exista um **ponto de acesso global** para essa instância."
        },
        {
          tipo: "lista",
          titulo: "O padrão Singleton é ideal quando você deseja:",
          itens: [
            "Garantir que apenas uma instância de uma classe seja criada;",
            "Ter um ponto de acesso controlado para essa instância, especialmente útil quando ela representa um recurso compartilhado, como uma conexão com um banco de dados, um serviço de log ou uma configuração global."
          ]
        }
      ]
    },
    {
      id: "pratica_singleton",
      titulo: "3.3 Exemplo prático do Singleton",
      blocos: [
        {
          tipo: "texto",
          texto: "Imagine que estamos desenvolvendo uma aplicação onde precisamos de um **serviço de log** – registro de atividade – centralizado. Queremos que o serviço seja único, permitindo que diferentes partes da aplicação façam uso dele **sem criar diferentes instâncias**."
        },
        {
          tipo: "texto",
          texto: "Aqui está como poderíamos implementar um Singleton para o serviço de log em linguagem de programação **JavaScript**:"
        },
        {
          tipo: "lista",
          titulo: "Quadro 2 – Esboço da implementação do padrão Singleton em Javascript",
          itens: [
            "`class Logger {`",
            "`// Atributo estático para armazenar a instância única`",
            "`static instance;`",
            "`constructor( ) {`",
            "`// Se já existe uma instância, retorna ela`",
            "`if (Logger.instance) {`",
            "`return Logger.instance;`",
            "`}`",
            "`// Caso contrário, cria a instância e armazena no atributo estático`",
            "`Logger.instance = this;`",
            "`// Propriedade para armazenar logs`",
            "`this.logs = [ ];`",
            "`}`",
            "`// Método para adicionar mensagens ao log`",
            "`log(message) {`",
            "`const timestamp = new Date( ).toISOString( );`",
            "`this.logs.push(`[${timestamp}] ${message}`);`",
            "`console.log(`[Logger]: ${message}`);`",
            "`}`",
            "`// Método para exibir todos os logs armazenados`",
            "`printLogHistory( ) {`",
            "`console.log(\"--- Log History ---\");`",
            "`this.logs.forEach(log => console.log(log));`",
            "`console.log(\"-------------------\");`",
            "`}`",
            "`}`",
            "`// Testando o Singleton`",
            "`const logger1 = new Logger( );`",
            "`const logger2 = new Logger( );`",
            "`logger1.log(\"Primeira mensagem de log.\"); // Registra a primeira mensagem`",
            "`logger2.log(\"Segunda mensagem de log.\"); // Registra a segunda mensagem`",
            "`// Vamos verificar se as duas variáveis são a mesma instância`",
            "`console.log(logger1 === logger2); // true, indicando que logger1 e logger2 são a mesma instância`",
            "`// Exibe o histórico de logs (ambos loggers compartilham os mesmos registros)`",
            "`logger1.printLogHistory( );`"
          ]
        },
        {
          tipo: "texto",
          texto: "No construtor do **Logger**, verificamos se já existe uma instância atribuída à propriedade `Logger.instance`; caso exista, retornamos essa instância em vez de criar uma nova, garantindo que sempre estamos acessando a mesma instância ao criar um Logger. O método `log()` adiciona uma mensagem ao histórico de logs e a exibe no console, tornando-o acessível de qualquer parte da aplicação que faça referência ao Logger. Com todos os logs armazenados na mesma instância, o histórico é compartilhado, permitindo que diferentes componentes da aplicação tenham uma visão centralizada dos registros de log."
        },
        {
          tipo: "destaque",
          texto: "PARADA OBRIGATÓRIA – Embora seja útil, o padrão Singleton deve ser usado com cautela, pois introduz uma dependência global que pode dificultar o teste e a manutenção do sistema. Em projetos grandes, o uso excessivo de Singleton pode tornar o código difícil de gerenciar."
        },
        {
          tipo: "destaque",
          texto: "MULTIMÍDIA – Aqui deixamos um vídeo do canal Geekific sobre Padrões de Projetos. What are Design Patterns? | Introduction to Design Patterns and Principles. Fonte: Geekific (2021)."
        }
      ]
    },
    {
      id: "consideracoes_finais",
      titulo: "Considerações finais",
      blocos: [
        {
          tipo: "texto",
          texto: "Neste módulo, exploramos o conceito de padrões de projeto, revisitando sua origem e relevância para a engenharia de software moderna. Os padrões de projeto fornecem soluções reutilizáveis e elegantes para problemas recorrentes, atuando como uma caixa de ferramentas que facilita o trabalho de desenvolvedores e arquitetos ao criar sistemas flexíveis, robustos e fáceis de manter. Discutimos como esses padrões promovem uma linguagem comum entre equipes e tornam o processo de desenvolvimento mais eficiente, ajudando a transformar as ideias levantadas na análise em implementações práticas."
        },
        {
          tipo: "texto",
          texto: "Vimos também as três categorias principais dos padrões GoF: **Criacionais**, **Estruturais** e **Comportamentais**. Cada uma delas atende a diferentes aspectos do design de software, desde a criação de objetos até a composição e a interação entre componentes. Observamos ainda o exemplo do padrão **Singleton**, que faz parte dos padrões criacionais, aplicando-o a um serviço de log para mostrar como ele controla a criação de uma única instância e centraliza registros de atividade."
        },
        {
          tipo: "texto",
          texto: "No próximo módulo, nos aprofundaremos especificamente nos **Padrões Criacionais**. Abordaremos os padrões **Abstract Factory**, **Builder**, **Factory Method**, **Prototype** e **Singleton**, explorando como cada um pode ser utilizado para criar objetos de forma eficiente e flexível. Esses padrões criacionais são fundamentais para garantir que a criação de instâncias seja organizada e que o sistema possa se adaptar a novos tipos de objetos sem comprometer sua estrutura, oferecendo uma base sólida para que avancem na aplicação prática dos conceitos de design de software. Bons estudos!"
        }
      ]
    }
  ]
},

// aula 13
{
  aula: "Padrões de criação",
  ideia_central: "Os padrões de criação (Abstract Factory, Builder, Factory Method, Prototype e Singleton) oferecem formas flexíveis, controladas e independentes de classes concretas para criar objetos, promovendo código reutilizável e fácil de manter, ao custo de maior complexidade e de mais classes em certos contextos.",
  secoes: [
    {
      id: "introducao",
      titulo: "Introdução",
      blocos: [
        {
          tipo: "lista",
          titulo: "Objetivos",
          itens: [
            "Conhecer o padrão **Abstract Factory**;",
            "Conhecer o padrão **Builder**;",
            "Conhecer o padrão **Factory Method**;",
            "Conhecer o padrão **Prototype**;",
            "Conhecer o padrão **Singleton**."
          ]
        },
        {
          tipo: "texto",
          texto: "Os **padrões de criação**, ou **padrões criacionais**, oferecem soluções para problemas recorrentes na criação de objetos, indo além do uso convencional de construtores. Esses padrões permitem criar objetos de forma mais flexível, controlada e independente de classes específicas, promovendo código mais reutilizável e fácil de manter."
        },
        {
          tipo: "texto",
          texto: "Neste módulo, exploraremos cinco padrões de criação amplamente utilizados: **Abstract Factory**, **Builder**, **Factory Method**, **Prototype** e **Singleton**. Cada um desses padrões atende a cenários específicos no desenvolvimento de software. Por exemplo, o **Abstract Factory** é comumente utilizado em sistemas de interface gráfica para criar elementos como botões e menus com estilos consistentes, enquanto o **Builder** é amplamente empregado na criação de objetos complexos, como relatórios configuráveis. O **Factory Method** é útil para implementar extensibilidade, como em um editor de texto que suporta diversos formatos de arquivo. O **Prototype** facilita a criação de clones em sistemas que exigem múltiplas instâncias de objetos similares, como jogos, e o **Singleton** é indispensável para gerenciar recursos únicos, como conexões a bancos de dados."
        },
        {
          tipo: "texto",
          texto: "Além de apresentar os conceitos e vantagens de cada padrão, abordaremos também as suas desvantagens e limitações, como a complexidade adicional em certos contextos e o aumento no número de classes. A análise de códigos e os exemplos práticos ajudarão a consolidar os conhecimentos e a entender como esses padrões podem ser aplicados em projetos reais. Boa leitura!"
        }
      ]
    },
    {
      id: "abstract_factory",
      titulo: "1 Conhecendo o Abstract Factory",
      blocos: [
        {
          tipo: "texto",
          texto: "O padrão **Abstract Factory** fornece uma interface para criar famílias de objetos relacionados ou dependentes sem especificar as suas classes concretas. Esse padrão é útil quando um sistema precisa ser independente de como seus produtos são criados. Ele ajuda a organizar a criação de objetos, promovendo código mais reutilizável e fácil de manter."
        },
        {
          tipo: "texto",
          texto: "Além disso, o **Abstract Factory** promove a consistência ao assegurar que objetos de uma mesma família sejam utilizados juntos. Ele contribui para a redução do acoplamento entre as partes do sistema, pois os clientes interagem apenas com interfaces definidas pelo padrão, sem conhecimento sobre as implementações concretas."
        },
        {
          tipo: "destaque",
          texto: "O Abstract Factory é particularmente adequado para projetos que requerem famílias de objetos inter-relacionados, como sistemas de interface gráfica em que botões, caixas de texto e menus precisam manter um estilo visual uniforme. Esse padrão assegura que as variações sejam tratadas de maneira consistente e flexível."
        },
        {
          tipo: "texto",
          texto: "No Quadro 1, a classe base `CarFactory` define métodos abstratos para criar componentes do carro, como motor e rodas. As subclasses `SedanFactory` e `SUVFactory` implementam essas interfaces para criar componentes específicos para cada tipo de carro. O exemplo demonstra a criação de um motor de sedan, evidenciando como a fábrica abstrai o tipo específico do objeto criado."
        },
        {
          tipo: "lista",
          titulo: "Quadro 1 – Padrão Abstract Factory escrito em Javascript",
          itens: [
            "`class CarFactory {`",
            "`  createEngine( ) { }`",
            "`  createWheels( ) { }`",
            "`}`",
            "`class SedanFactory extends CarFactory {`",
            "`  createEngine( ) {`",
            "`    return new SedanEngine( );`",
            "`  }`",
            "`  createWheels( ) {`",
            "`    return new SedanWheels( );`",
            "`  }`",
            "`}`",
            "`class SUVFactory extends CarFactory {`",
            "`  createEngine( ) {`",
            "`    return new SUVEngine( );`",
            "`  }`",
            "`  createWheels( ) {`",
            "`    return new SUVWheels();`",
            "`  }`",
            "`}`",
            "`class SedanEngine {`",
            "`  constructor( ) {`",
            "`    console.log(\"Engine for a sedan created.\");`",
            "`  }`",
            "`}`",
            "`class SUVEngine {`",
            "`  constructor( ) {`",
            "`    console.log(\"Engine for an SUV created.\");`",
            "`  }`",
            "`}`",
            "`// Uso do padrão`",
            "`const sedanFactory = new SedanFactory( );`",
            "`sedanFactory.createEngine( ); // Output: \"Engine for a sedan created.\"`"
          ]
        },
        {
          tipo: "texto",
          texto: "Fonte: Autores (2024)."
        },
        {
          tipo: "texto",
          texto: "Uma das desvantagens do **Abstract Factory** é que a adição de novos tipos de produtos pode ser trabalhosa, pois exige a modificação de todas as fábricas existentes para suportar o novo tipo. Isso pode aumentar a complexidade e o esforço de manutenção do sistema."
        },
        {
          tipo: "topico",
          titulo: "Multimídia",
          texto: "Esta exposição sucinta de padrões de projeto não se pretende como absoluta ou definitiva, muito pelo contrário. Acreditamos que haja muito mais para você aprender e usar, em relação aos padrões. Porém, é preciso sempre ter em mente que a melhor forma de aprender sobre um padrão é tendo uma necessidade real para seu uso. Por isso, achamos interessante trabalhar com exemplos e mostrar os pontos positivos e negativos dos padrões. Agora, para poder conhecer um pouco mais sobre o padrão Abstract Factory, sugerimos que você assista ao vídeo “Padrões de Projeto | Abstract Factory”, publicado no canal de Youtube “Leonardo Giraldi | dev”. Fonte: Giraldi (2024)."
        }
      ]
    },
    {
      id: "builder",
      titulo: "2 Conhecendo o Builder",
      blocos: [
        {
          tipo: "texto",
          texto: "O padrão **Builder** separa a construção de um objeto complexo da sua representação, permitindo que o mesmo processo de construção crie diferentes representações. Esse padrão é útil em situações em que a criação de um objeto requer vários passos, proporcionando flexibilidade e reutilização."
        },
        {
          tipo: "texto",
          texto: "Ele é ideal para situações em que um objeto precisa ser construído em etapas. Isso permite que o cliente controle o processo de construção sem expor os detalhes internos e facilita a reutilização do código para criar diferentes versões de um mesmo objeto."
        },
        {
          tipo: "texto",
          texto: "O **Builder** é mais adequado para cenários que envolvem a criação de objetos complexos, como documentos estruturados em várias seções, gráficos personalizáveis ou veículos configuráveis com diferentes especificações. Ele é especialmente útil para sistemas que exigem múltiplas configurações de um mesmo tipo de objeto."
        },
        {
          tipo: "texto",
          texto: "No Quadro 2, a classe `HouseBuilder` separa a construção do objeto `house` em etapas como `buildWalls`, `buildDoors` e `buildWindows`. Cada método retorna o próprio **Builder**, permitindo chamadas encadeadas (*fluent interface*). Por fim, o método `getHouse` retorna o objeto totalmente configurado."
        },
        {
          tipo: "lista",
          titulo: "Quadro 2 – Padrão Builder escrito em Javascript",
          itens: [
            "`class HouseBuilder {`",
            "`  constructor( ) {`",
            "`    this.house = { };`",
            "`  }`",
            "`  buildWalls( ) {`",
            "`    this.house.walls = \"Walls built\";`",
            "`    return this;`",
            "`  }`",
            "`  buildDoors( ) {`",
            "`    this.house.doors = \"Doors installed\";`",
            "`    return this;`",
            "`  }`",
            "`  buildWindows( ) {`",
            "`    this.house.windows = \"Windows added\";`",
            "`    return this;`",
            "`  }`",
            "`  getHouse( ) {`",
            "`    return this.house;`",
            "`  }`",
            "`}`",
            "`// Uso do padrão`",
            "`const house = new HouseBuilder().buildWalls().buildDoors().buildWindows().getHouse();`",
            "`console.log(house); // Output: { walls: 'Walls built', doors: 'Doors installed', windows: 'Windows added' }`"
          ]
        },
        {
          tipo: "texto",
          texto: "Fonte: Autores (2024)."
        },
        {
          tipo: "texto",
          texto: "Apesar das suas vantagens, o padrão **Builder** pode aumentar a complexidade do código, quando o número de etapas ou variações de construção é muito elevado, tornando-se menos vantajoso para projetos simples."
        },
        {
          tipo: "topico",
          titulo: "Multimídia",
          texto: "Agora, para poder conhecer um pouco mais sobre o padrão Builder, sugerimos que você assista ao vídeo “GOF BUILDER - Entenda de forma FÁCIL e OBJETIVA como ele funciona”, publicado no canal de Youtube “Pisani da ArcH”. Fonte: Pisani (2020)."
        }
      ]
    },
    {
      id: "factory_method",
      titulo: "3 Conhecendo o Factory Method",
      blocos: [
        {
          tipo: "texto",
          texto: "O padrão **Factory Method** define uma interface para criar um objeto, mas permite que subclasses alterem o tipo de objeto que será criado. Ele promove flexibilidade ao delegar a decisão de qual classe instanciar para subclasses, deixando o código cliente desacoplado de implementações concretas."
        },
        {
          tipo: "texto",
          texto: "Esse padrão é particularmente vantajoso em sistemas que exigem extensibilidade, como aplicações de gerenciamento de arquivos que suportam diferentes formatos. Novos formatos podem ser adicionados sem alterar o código principal, apenas criando subclasses que implementam o método de fábrica."
        },
        {
          tipo: "texto",
          texto: "No Quadro 3, a classe base `AnimalFactory` define o método abstrato `createAnimal`, enquanto as subclasses `DogFactory` e `CatFactory` implementam esse método para criar objetos específicos. O exemplo mostra como uma `DogFactory` cria uma instância de `Dog`, encapsulando a lógica de criação."
        },
        {
          tipo: "lista",
          titulo: "Quadro 3 – Padrão Factory Method escrito em Javascript",
          itens: [
            "`class AnimalFactory {`",
            "`  createAnimal( ) { }`",
            "`}`",
            "`class DogFactory extends AnimalFactory {`",
            "`  createAnimal( ) {`",
            "`    return new Dog( );`",
            "`  }`",
            "`}`",
            "`class CatFactory extends AnimalFactory {`",
            "`  createAnimal( ) {`",
            "`    return new Cat() ;`",
            "`  }`",
            "`}`",
            "`class Dog {`",
            "`  speak( ) {`",
            "`    console.log(\"Woof!\");`",
            "`  }`",
            "`}`",
            "`class Cat {`",
            "`  speak( ) {`",
            "`    console.log(\"Meow!\");`",
            "`  }`",
            "`}`",
            "`// Uso do padrão`",
            "`const dogFactory = new DogFactory( );`",
            "`const dog = dogFactory.createAnimal( );`",
            "`dog.speak(); // Output: \"Woof!\"`"
          ]
        },
        {
          tipo: "texto",
          texto: "Fonte: Autores (2024)."
        },
        {
          tipo: "texto",
          texto: "A principal desvantagem do **Factory Method** é o aumento no número de classes, já que cada tipo de objeto exige uma nova fábrica. Isso pode dificultar a organização do código em sistemas maiores."
        },
        {
          tipo: "topico",
          titulo: "Multimídia",
          texto: "Agora, para poder conhecer um exemplo prático de uso do padrão Factory Method, sugerimos que você assista ao vídeo “Factory Method - Design Patterns (GoF) - em #JavaScript”, publicado no canal de Youtube “Brazilian Dev”. Fonte: Brazilian (2023)."
        }
      ]
    },
    {
      id: "prototype",
      titulo: "4 Conhecendo o Prototype",
      blocos: [
        {
          tipo: "texto",
          texto: "O padrão **Prototype** permite a criação de novos objetos, copiando ou \"clonando\" uma instância existente, ou protótipo. Ele é ideal para situações em que a criação de objetos complexos precisa ser eficiente e flexível, especialmente quando as configurações básicas podem ser reaproveitadas."
        },
        {
          tipo: "texto",
          texto: "Este padrão é útil em sistemas que utilizam modelos padrão para instanciar múltiplos objetos similares. Por exemplo, jogos podem usar protótipos para criar personagens ou itens com configurações predefinidas, permitindo modificações pontuais sem comprometer o modelo inicial."
        },
        {
          tipo: "texto",
          texto: "No Quadro 4, o objeto `carPrototype` define um método `clone` que utiliza `Object.assign` para criar uma cópia superficial. O exemplo mostra a criação de dois carros, a partir do mesmo protótipo, destacando a possibilidade de alterações específicas em cada instância."
        },
        {
          tipo: "lista",
          titulo: "Quadro 4 – Padrão Prototype escrito em Javascript",
          itens: [
            "`const carPrototype = {`",
            "`  clone( ) {`",
            "`    return Object.assign({ }, this);`",
            "`  }`",
            "`};`",
            "`const car1 = Object.create(carPrototype);`",
            "`car1.make = \"Toyota\";`",
            "`car1.model = \"Corolla\";`",
            "`const car2 = car1.clone( );`",
            "`car2.model = \"Camry\";`",
            "`console.log(car1); // Output: { make: 'Toyota', model: 'Corolla' }`",
            "`console.log(car2); // Output: { make: 'Toyota', model: 'Camry' }`"
          ]
        },
        {
          tipo: "texto",
          texto: "Fonte: Autores (2024)."
        },
        {
          tipo: "texto",
          texto: "Apesar de ser eficiente, o **Prototype** pode apresentar dificuldades em gerenciar clonagens profundas, especialmente quando os objetos possuem referências complexas ou dependem de recursos externos."
        },
        {
          tipo: "topico",
          titulo: "Multimídia",
          texto: "Agora, para poder conhecer um pouco mais sobre o padrão Prototype, sugerimos que você assista aos vídeos “Prototype Teoria - Padrões de Projeto - Parte 8/45” e “Prototype Prática - Padrões de Projeto - Parte 9/45”, publicado no canal de Youtube “Otávio Miranda”. Fonte: Miranda (2020b). Fonte: Miranda (2020c)."
        }
      ]
    },
    {
      id: "singleton",
      titulo: "5 Conhecendo o Singleton",
      blocos: [
        {
          tipo: "texto",
          texto: "O padrão **Singleton** garante que uma classe tenha apenas uma instância e fornece um ponto de acesso global para essa instância. Ele é frequentemente usado para gerenciar recursos compartilhados, como conexões de banco de dados ou serviços de log."
        },
        {
          tipo: "destaque",
          texto: "Este padrão é mais adequado em situações em que é necessário centralizar o acesso a recursos únicos, como em sistemas distribuídos que precisam gerenciar configurações globais ou estados compartilhados."
        },
        {
          tipo: "texto",
          texto: "No Quadro 5, a classe `Database` utiliza um atributo estático `Database.instance` para armazenar a única instância criada. O construtor verifica a existência dessa instância, retornando-a se já estiver disponível, garantindo que tanto `db1` quanto `db2` referenciem o mesmo objeto."
        },
        {
          tipo: "lista",
          titulo: "Quadro 5 – Padrão Singleton escrito em Javascript",
          itens: [
            "`class Database {`",
            "`  constructor( ) {`",
            "`    if (Database.instance) {`",
            "`      return Database.instance;`",
            "`    }`",
            "`    Database.instance = this;`",
            "`    this.connection = \"Database connection established.\";`",
            "`  }`",
            "`}`",
            "`const db1 = new Database( );`",
            "`const db2 = new Database( );`",
            "`console.log(db1 === db2); // Output: true, ambas as variáveis referem-se à mesma instância`"
          ]
        },
        {
          tipo: "texto",
          texto: "Fonte: Autores (2024)."
        },
        {
          tipo: "texto",
          texto: "Embora útil, o **Singleton** pode criar problemas de manutenção e testes, pois a dependência global dificulta o isolamento de componentes e pode introduzir desafios em ambientes **multithreaded**, exigindo controle adicional para sincronização."
        },
        {
          tipo: "topico",
          titulo: "Multimídia",
          texto: "Agora, para poder conhecer um pouco mais sobre o padrão Singleton, sugerimos que você assista aos vídeos “Singleton Teoria - Padrões de Projeto - Parte 4/45” e “Singleton Prática - Padrões de Projeto - Parte 5/45 ”, publicado no canal de Youtube “Otávio Miranda”. Fonte: Miranda (2020a). Fonte: Miranda (2020d)."
        }
      ]
    },
    {
      id: "consideracoes_finais",
      titulo: "Considerações finais",
      blocos: [
        {
          tipo: "texto",
          texto: "Neste módulo, aprofundamos o estudo dos padrões de criação, discutindo como eles auxiliam na criação flexível e eficiente de objetos. Aprendemos que os padrões **Abstract Factory**, **Builder**, **Factory Method**, **Prototype** e **Singleton** oferecem métodos eficazes para organizar a criação de instâncias, promovendo uma base sólida e sustentável no design de software. Bons estudos!"
        }
      ]
    }
  ]
}

],


};