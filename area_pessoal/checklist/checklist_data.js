/* =============================================
   NEXUS STUDY — checklist/checklist_data.js
   Conteúdo pré-definido do Checklist por semestre e disciplina.

   ► Estrutura: CHECKLIST_ITENS[semestre][discId]
   ► O semestre deve ser igual ao definido em global.js (ex: '2026.1')
   ► O discId deve ser igual ao id em _DISCIPLINAS do global.js
   ► Os ids dos itens DEVEM incluir o semestre para não colidir no localStorage
     Padrão sugerido: 'SEMESTRE_DISCID_CATEGORIA_NUMERO'
     Ex: '2026_1_poo_f1'  (use _ no lugar de .)
   ============================================= */

export const CHECKLIST_ITENS = {

  /* ══════════════════════════════════════════
     SEMESTRE 2026.1
  ══════════════════════════════════════════ */
  '2026.1': {

    /* ─── POO ─────────────────────────────── */
    'poo': {
      categorias: [
        {
          nome: '1. Fundamentos e Paradigma POO',
          icone: '🧱',
          itens: [
            { id: '2026_1_poo_01', texto: 'Conceito de POO: Unificação de dados (atributos) e funções (métodos) em unidades coesas chamadas objetos.' },
            { id: '2026_1_poo_02', texto: 'Vantagens arquiteturais: Promoção de acoplamento fraco e coesão forte.' },
            { id: '2026_1_poo_03', texto: 'Abstração: Processo de isolar características essenciais para um contexto, ignorando detalhes irrelevantes.' },
            { id: '2026_1_poo_04', texto: 'Convenções de Nomenclatura: Uso de PascalCase para classes e camelCase para membros.' },
          ]
        },
        {
          nome: '2. Sintaxe e Tipagem',
          icone: '🔤',
          itens: [
            { id: '2026_1_poo_05', texto: 'Tipos Primitivos: Uso de int, long (sufixo L), double (padrão), float (sufixo f), char (Unicode) e boolean.' },
            { id: '2026_1_poo_06', texto: 'Inferência de Tipo: Uso da palavra-chave var para dedução de tipo pelo compilador (Java 10+).' },
            { id: '2026_1_poo_07', texto: 'Conversão de Tipos (Casting): Diferença entre promoção implícita (segura) e casting explícito (risco de perda de dados).' },
            { id: '2026_1_poo_08', texto: 'Operadores Especiais: Divisão inteira, pós/pré-incremento e curto-circuito lógico (&&).' },
          ]
        },
        {
          nome: '3. Estruturas de Controle e Fluxo',
          icone: '🔀',
          itens: [
            { id: '2026_1_poo_09', texto: 'Decisões: Uso de if/else, "Guard Clauses" para código limpo e o Operador Ternário.' },
            { id: '2026_1_poo_10', texto: 'Switch Case Moderno: Uso da "Arrow Syntax" (Java 14+) para retorno direto de valores sem break.' },
            { id: '2026_1_poo_11', texto: 'Repetições: Diferença entre while (teste prévio), do-while (garante uma execução) e loops for (clássico e for-each).' },
          ]
        },
        {
          nome: '4. Gestão de Memória e Objetos',
          icone: '🧠',
          itens: [
            { id: '2026_1_poo_12', texto: 'Stack vs. Heap: Compreensão da memória de execução rápida (Stack) para variáveis locais e referências, contra a memória global (Heap) para objetos.' },
            { id: '2026_1_poo_13', texto: 'Referências: Entendimento de que a variável atua como um "controle remoto" para o objeto físico na Heap.' },
            { id: '2026_1_poo_14', texto: 'Tratamento de Nulos: Identificação de NullPointerException e verificações preventivas.' },
            { id: '2026_1_poo_15', texto: 'Strings e Imutabilidade: Uso do String Pool para eficiência e comparação correta de conteúdo via .equals() em vez de ==.' },
          ]
        },
        {
          nome: '5. Métodos e Comportamento',
          icone: '⚙️',
          itens: [
            { id: '2026_1_poo_16', texto: 'Princípio DRY: Uso de métodos para evitar repetição de lógica.' },
            { id: '2026_1_poo_17', texto: 'Anatomia do Método: Definição de modificador, tipo de retorno, nome e parâmetros.' },
            { id: '2026_1_poo_18', texto: 'Passagem de Parâmetros: Em Java a passagem é sempre por valor (cópia do valor para primitivos e cópia da referência para objetos).' },
            { id: '2026_1_poo_19', texto: 'Sobrecarga (Overloading): Criação de múltiplos métodos com o mesmo nome, mas assinaturas diferentes.' },
          ]
        },
        {
          nome: '6. Encapsulamento e Modificadores',
          icone: '🔒',
          itens: [
            { id: '2026_1_poo_20', texto: 'Ocultação de Informação: Proteção do estado interno contra modificações externas imprevistas.' },
            { id: '2026_1_poo_21', texto: 'Modificadores de Acesso: Uso de public, private, protected e o nível padrão (default).' },
            { id: '2026_1_poo_22', texto: 'Getters e Setters: Implementação do padrão JavaBean para leitura e escrita controlada de atributos.' },
            { id: '2026_1_poo_23', texto: 'Palavra-chave this: Referência ao objeto atual para desambiguidade e chamadas internas.' },
          ]
        },
        {
          nome: '7. Membros Estáticos e Construtores',
          icone: '🏗️',
          itens: [
            { id: '2026_1_poo_24', texto: 'Construtores: Uso para inicializar objetos e garantir estado válido no nascimento.' },
            { id: '2026_1_poo_25', texto: 'Membros static: Atributos e métodos que pertencem à classe (molde) e são compartilhados entre todas as instâncias.' },
            { id: '2026_1_poo_26', texto: 'Constantes: Uso de static final para blindar valores imutáveis.' },
          ]
        },
        {
          nome: '8. Herança e Polimorfismo',
          icone: '🌳',
          itens: [
            { id: '2026_1_poo_27', texto: 'Herança (extends): Relação "é-um" para reuso de código e especialização de classes.' },
            { id: '2026_1_poo_28', texto: 'Sobrescrita (@Override): Modificação de comportamento herdado da classe pai.' },
            { id: '2026_1_poo_29', texto: 'Palavra-chave super: Acesso a construtores e métodos da superclasse.' },
            { id: '2026_1_poo_30', texto: 'Herança vs. Composição: Preferência pela relação "tem-um" (composição) quando possível.' },
            { id: '2026_1_poo_31', texto: 'Polimorfismo: Capacidade de tratar objetos de diferentes subclasses através de uma interface comum via Dynamic Method Dispatch.' },
          ]
        },
        {
          nome: '9. Abstração Avançada',
          icone: '🎭',
          itens: [
            { id: '2026_1_poo_32', texto: 'Classes Abstratas: Modelos incompletos que não podem ser instanciados e servem como base para especialização.' },
            { id: '2026_1_poo_33', texto: 'Interfaces: Definição de contratos de software com comportamentos obrigatórios, sem possuir estado.' },
            { id: '2026_1_poo_34', texto: 'Desacoplamento: Uso de interfaces para que o código dependa de contratos e não de implementações específicas.' },
          ]
        },
        {
          nome: '10. Tratamento de Exceções',
          icone: '⚠️',
          itens: [
            { id: '2026_1_poo_35', texto: 'Blocos try, catch e finally: Estrutura para monitorar, capturar e finalizar o tratamento de erros.' },
            { id: '2026_1_poo_36', texto: 'Tipos de Exceções: Diferença entre exceções checadas (Checked) e não checadas (Unchecked/Runtime).' },
            { id: '2026_1_poo_37', texto: 'Lançamento de Erros: Uso de throw para disparar exceções e throws na assinatura do método.' },
            { id: '2026_1_poo_38', texto: 'Exceções Personalizadas: Criação de classes próprias estendendo Exception para erros específicos de negócio.' },
          ]
        },
        {
          nome: '11. Engenharia e Debugging',
          icone: '🐛',
          itens: [
            { id: '2026_1_poo_39', texto: 'Validação Lógica: Uso de procedimentos de inspeção de fluxo como Breakpoints, Step Over e Step Into.' },
            { id: '2026_1_poo_40', texto: 'Análise de Pilha (Call Stack): Visualização do encadeamento de métodos para identificar a origem de exceções.' },
          ]
        },
      ]
    },

    /* ─── BANCO DE DADOS ──────────────────── */
    'banco_dados': {
      categorias: [
        {
          nome: 'Módulo 1: Fundamentos e Contexto Histórico',
          icone: '📜',
          itens: [
            { id: '2026_1_bd_01', texto: 'Evolução dos Bancos de Dados: Diferenciar as décadas de 60 (surgimento do termo), 70 (modelo relacional de Codd e modelo ER de Peter Chen), 80 (comercialização e SQL), 90 (orientação a objetos) e 2000 (NoSQL para Big Data).' },
            { id: '2026_1_bd_02', texto: 'Pirâmide do Conhecimento: Distinguir Dado (elemento bruto), Fato (registro do mundo real), Informação (dado lapidado com significado), Conhecimento (informação trabalhada que produz saber) e Metadados (descrição da estrutura armazenada no catálogo).' },
            { id: '2026_1_bd_03', texto: 'Conceitos de Sistemas: Definir SBD (SGBD + Banco de Dados) e o papel do SGBD como software de propósito geral que facilita definir, construir, manipular e compartilhar dados.' },
            { id: '2026_1_bd_04', texto: 'Operações CRUD: Identificar as quatro operações básicas e seus comandos: Create (INSERT), Read (SELECT), Update (UPDATE) e Delete (DELETE).' },
          ]
        },
        {
          nome: 'Módulo 2: Elementos, Arquitetura e Mercado',
          icone: '🏛️',
          itens: [
            { id: '2026_1_bd_05', texto: 'Pilares do SGBD: Identificar os componentes fundamentais: Dados, Hardware (armazenamento secundário, CPU, RAM), Software e Usuários.' },
            { id: '2026_1_bd_06', texto: 'Classes de Usuários: Diferenciar Programadores (escrevem código de acesso), Usuários Finais (acesso interativo via interfaces) e o DBA (administrador responsável por segurança, suporte e performance).' },
            { id: '2026_1_bd_07', texto: 'Independência de Dados: Compreender a Independência Programa-Dados (catálogo separado do software) e a Independência Programa-Operação (invocar dados sem conhecer a implementação da operação).' },
            { id: '2026_1_bd_08', texto: 'Arquitetura ANSI/SPARC (Três Esquemas): Níveis Interno (detalhes físicos e bytes), Conceitual (estrutura global e tipos de dados) e Externo (visões específicas para grupos de usuários).' },
            { id: '2026_1_bd_09', texto: 'SGBDs de Mercado: Conhecer linguagens proprietárias como PL/SQL (Oracle) e T-SQL (SQL Server), além de sistemas open source como MySQL e PostgreSQL.' },
          ]
        },
        {
          nome: 'Módulo 3: Características e Dinâmica do BD',
          icone: '⚡',
          itens: [
            { id: '2026_1_bd_10', texto: 'Estrutura vs. Estado: Diferenciar Esquema/Estrutura (configuração lógica estável) de Estado/Instância (conjunto de dados em um momento específico).' },
            { id: '2026_1_bd_11', texto: 'Transação: Definir como uma unidade lógica de trabalho que leva o banco de um estado consistente a outro.' },
            { id: '2026_1_bd_12', texto: 'Propriedades ACID: Atomicidade (tudo ou nada), Consistência (preservação das regras de integridade), Isolamento (transações simultâneas não se interferem) e Durabilidade (persistência após Commit).' },
          ]
        },
        {
          nome: 'Módulo 4: Arquiteturas de Implementação',
          icone: '🖧',
          itens: [
            { id: '2026_1_bd_13', texto: 'Modelos de Camadas: Diferenciar Centralizada (Mainframe), Cliente-Servidor de 2 camadas (processamento dividido) e 3 camadas (introdução do Servidor de Aplicação/Web para regras de negócio).' },
            { id: '2026_1_bd_14', texto: 'Sistemas Distribuídos: Entender o conceito de Nós e as técnicas de Replicação (cópias em múltiplos nós) e Fragmentação (Horizontal: linhas; Vertical: colunas).' },
            { id: '2026_1_bd_15', texto: 'Transparência e Nuvem: Garantir a Transparência de Dados e distinguir modelos de nuvem: IaaS (infraestrutura), PaaS (plataforma), SaaS (software) e DBaaS (banco de dados como serviço).' },
          ]
        },
        {
          nome: 'Módulo 5: Modelagem Conceitual (DER)',
          icone: '📐',
          itens: [
            { id: '2026_1_bd_16', texto: 'Fases do Projeto: Fluxo do Conceitual (visão global) → Lógico (dependente do modelo, ex: relacional) → Físico (scripts SQL/DDL).' },
            { id: '2026_1_bd_17', texto: 'Entidades e Atributos: Identificar entidades (Físicas ou Conceituais) e tipos de atributos: Simples, Composto (desmembrável), Multivalorado (múltiplos valores), Derivado (calculado) e Chave (identificador único).' },
            { id: '2026_1_bd_18', texto: 'Relacionamentos e Cardinalidade: Identificar graus (Binário, Ternário), Autorrelacionamento e razões de cardinalidade (1:1, 1:N, N:M).' },
            { id: '2026_1_bd_19', texto: 'Restrições Estruturais: Definir números mínimo e máximo de participações e a Restrição de Participação (Total ou Parcial).' },
          ]
        },
        {
          nome: 'Módulo 6: Modelo Relacional Formal (MER)',
          icone: '🗂️',
          itens: [
            { id: '2026_1_bd_20', texto: 'Terminologia Formal: Substituir termos comuns pelos técnicos: Relação (Tabela), Tupla (Linha), Atributo (Coluna) e Domínio (conjunto de valores atômicos).' },
            { id: '2026_1_bd_21', texto: 'Grau e Chaves: Definir o Grau (número de colunas) e distinguir Super-chave, Chave Candidata (super-chave mínima) e Chave Primária (PK).' },
            { id: '2026_1_bd_22', texto: 'Integridade: Aplicar a Integridade de Entidade (PK nunca nula) e a Integridade Referencial (Chave Estrangeira - FK deve referenciar uma PK válida).' },
            { id: '2026_1_bd_23', texto: 'Mapeamento: Converter Conjuntos Entidade (CE) em relações e tratar o mapeamento de relacionamentos (CR) para o modelo lógico.' },
          ]
        },
        {
          nome: 'Módulo 7: Modelagem Estendida (EER)',
          icone: '🔬',
          itens: [
            { id: '2026_1_bd_24', texto: 'Abstrações: Aplicar Especialização (refinamento conceitual) e Generalização (síntese em nível mais alto).' },
            { id: '2026_1_bd_25', texto: 'Classificações e Herança: Diferenciar especialização Total de Parcial e compreender a Herança de Propriedades (subclasse herda atributos da superclasse).' },
            { id: '2026_1_bd_26', texto: 'Agregação: Utilizar a técnica para tratar um relacionamento M:N como um objeto de alto nível associado a outras entidades.' },
            { id: '2026_1_bd_27', texto: 'Entidade Associativa: Reconhecer a redefinição de um relacionamento que passa a ser tratado como entidade.' },
          ]
        },
        {
          nome: 'Módulo 8: Introdução ao SQL',
          icone: '🔍',
          itens: [
            { id: '2026_1_bd_28', texto: 'Natureza da Linguagem: A SQL é uma linguagem declarativa, onde se especifica o resultado desejado e não o caminho para obtê-lo.' },
            { id: '2026_1_bd_29', texto: 'Subconjuntos do SQL: DDL (CREATE, ALTER, DROP), DML (INSERT, UPDATE, DELETE), DQL (SELECT), DCL (GRANT/REVOKE) e DTL (COMMIT/ROLLBACK).' },
            { id: '2026_1_bd_30', texto: 'Tipos de Dados Práticos: Uso de CHAR, VARCHAR, INT, FLOAT, DATE e BLOB na criação de tabelas.' },
          ]
        },
      ]
    },

    /* ─── DESIGN ──────────────────────────── */
    'design': {
      categorias: [
        {
          nome: '1. Design Centrado no Usuário',
          icone: '👤',
          itens: [
            { id: '2026_1_dsg_01', texto: 'Conceitos de Design: Entender o design como um plano intencional voltado para a funcionalidade e não apenas estética.' },
            { id: '2026_1_dsg_02', texto: 'IHC, Usabilidade e UX: Diferenciar a Interação Humano-Computador (estudo da relação), Interface (meio de uso), Usabilidade (eficácia e eficiência) e User Experience (prazer e emoção no uso).' },
            { id: '2026_1_dsg_03', texto: 'Disciplinas Auxiliares: Estudar o papel do Design de Interação, Design de Interface e Arquitetura da Informação.' },
            { id: '2026_1_dsg_04', texto: 'Critérios Ergonômicos de Scapin e Bastien: Memorizar os 8 critérios: compatibilidade, condução, carga de trabalho, homogeneidade, significado dos códigos, controle explícito, adaptabilidade e gestão de erros.' },
          ]
        },
        {
          nome: '2. Comunicação e Engenharia Semiótica',
          icone: '📡',
          itens: [
            { id: '2026_1_dsg_05', texto: 'Modelos de Comunicação: Conhecer os seis elementos de Jakobson (emissor, receptor, canal, mensagem, código e referente) e como evitar ruídos na interação homem-máquina.' },
            { id: '2026_1_dsg_06', texto: 'Semiótica de Peirce: Diferenciar os signos em Ícone (analogia), Índice (causalidade) e Símbolo (convenção).' },
            { id: '2026_1_dsg_07', texto: 'Engenharia Semiótica: Entender o sistema como um artefato de metacomunicação onde o designer "ensina" o usuário a usar a interface.' },
            { id: '2026_1_dsg_08', texto: 'Métodos de Avaliação: Estudar o Método de Avaliação de Comunicabilidade (MAC) e o Método de Inspeção Semiótica (MIS).' },
          ]
        },
        {
          nome: '3. Alfabetismo e Alfabeto Visual',
          icone: '🖼️',
          itens: [
            { id: '2026_1_dsg_09', texto: 'Níveis de Mensagem: Identificar imagens nos níveis representacional (fiel ao real), abstrato (simplificação) e simbólico (mínimo irredutível).' },
            { id: '2026_1_dsg_10', texto: 'Elementos Básicos da Linguagem Visual: Estudar a função de: ponto, linha, forma, direção, tom, cor, textura, escala, dimensão e movimento.' },
          ]
        },
        {
          nome: '4. Psicologia Cognitiva e Gestalt',
          icone: '🧩',
          itens: [
            { id: '2026_1_dsg_11', texto: 'Engenharia Cognitiva: Compreender os processos de atenção (seletiva, vigilância, sondagem e dividida) e os tipos de memória (curta e longa duração).' },
            { id: '2026_1_dsg_12', texto: 'Princípios da Gestalt: Entender a tendência à estruturação e a segregação figura-fundo.' },
            { id: '2026_1_dsg_13', texto: '8 Pilares da Gestalt Aplicados: Saber aplicar Unidade, Segregação, Unificação, Fechamento, Continuidade, Proximidade, Semelhança e Pregnância da forma em interfaces.' },
          ]
        },
        {
          nome: '5. O Elemento Cor',
          icone: '🎨',
          itens: [
            { id: '2026_1_dsg_14', texto: 'Sistemas de Cores: Diferenciar RGB (síntese aditiva para telas) de CMYK (síntese subtrativa para impressão).' },
            { id: '2026_1_dsg_15', texto: 'Propriedades da Cor: Definir Matiz, Luminosidade e Saturação.' },
            { id: '2026_1_dsg_16', texto: 'Harmonias e Contrastes: Usar o círculo cromático para identificar cores análogas e complementares, além de entender a temperatura da cor (quentes vs. frias).' },
            { id: '2026_1_dsg_17', texto: 'Psicodinâmica: Estudar os significados culturais e psicológicos das cores (ex: azul para confiança, vermelho para atenção).' },
            { id: '2026_1_dsg_18', texto: 'Regra 60-30-10: Técnica para distribuição de cores no layout.' },
          ]
        },
        {
          nome: '6. Tipografia',
          icone: '🔡',
          itens: [
            { id: '2026_1_dsg_19', texto: 'História e Evolução: Conhecer a origem desde a escrita cuneiforme até a invenção dos tipos móveis por Gutenberg.' },
            { id: '2026_1_dsg_20', texto: 'Anatomia do Tipo: Identificar partes como haste, trave, bojo, olho, serifa, altura-x, ascendentes e descendentes.' },
            { id: '2026_1_dsg_21', texto: 'Classificação: Diferenciar estilos como Antigo, Transicional, Moderno, Egípcio, Decorativo e Caligráfico.' },
            { id: '2026_1_dsg_22', texto: 'Tipografia Digital: Critérios de alinhamento, legibilidade em telas (uso de fontes sans serif), tamanhos e unidades de medida (pixels vs. em).' },
          ]
        },
        {
          nome: '7. Imagem e Interação Verbal',
          icone: '📷',
          itens: [
            { id: '2026_1_dsg_23', texto: 'Formatos de Arquivo: Escolher entre Bitmap e Vetor, e formatos específicos como JPG, GIF, PNG e TIFF conforme a necessidade de compressão ou transparência.' },
            { id: '2026_1_dsg_24', texto: 'Fotografia vs. Ilustração: Quando usar cada uma para passar credibilidade ou criatividade.' },
            { id: '2026_1_dsg_25', texto: 'Relação Imagem e Palavra: Estudar as técnicas de ancoragem (texto guia o sentido) e relais (texto e imagem se complementam).' },
          ]
        },
        {
          nome: '8. Layout e Organização Espacial',
          icone: '📏',
          itens: [
            { id: '2026_1_dsg_26', texto: 'Dinâmicas de Contraste: Diferenciar o nivelamento (harmonia/eixos) do aguçamento (contraste/tensão) e evitar a ambiguidade.' },
            { id: '2026_1_dsg_27', texto: 'Técnicas Visuais: Polaridades como Simetria vs. Assimetria, Simplicidade vs. Complexidade e Minimalismo vs. Exagero.' },
            { id: '2026_1_dsg_28', texto: 'Grids: Uso de grades (especialmente de 12 colunas) para garantir consistência e facilitar o design responsivo.' },
            { id: '2026_1_dsg_29', texto: 'Lógica Visual: Determinar caminhos de navegação (regra dos três cliques) e criar templates hierárquicos.' },
          ]
        },
      ]
    },

    /* ─── REDES ───────────────────────────── */
    'redes': {
      categorias: [
        {
          nome: 'Módulo 1: Fundamentos e Aplicações',
          icone: '🌐',
          itens: [
            { id: '2026_1_rd_01', texto: 'Contexto da Era da Informação: Entender a convergência entre processamento, distribuição e transporte de dados.' },
            { id: '2026_1_rd_02', texto: 'Definição de Rede: Compreender os pilares de autonomia das máquinas e a capacidade de interconexão para troca de dados.' },
            { id: '2026_1_rd_03', texto: 'Redes vs. Sistemas Distribuídos: Diferenciar a visibilidade do hardware nas redes da transparência (coerência) via middleware nos sistemas distribuídos.' },
            { id: '2026_1_rd_04', texto: 'Aplicações Comerciais: Estudar o compartilhamento de recursos para eliminar a "tirania da geografia", o papel das VPNs e tecnologias de colaboração como VoIP e e-commerce.' },
            { id: '2026_1_rd_05', texto: 'Modelo Cliente-Servidor: Identificar o papel do servidor (provedor de serviço) e do cliente (solicitante).' },
            { id: '2026_1_rd_06', texto: 'Aplicações Domésticas: Compreender a Lei de Metcalfe (valor da rede vs. número de usuários), entretenimento digital e bibliotecas digitais.' },
            { id: '2026_1_rd_07', texto: 'Modelo Peer-to-Peer (P2P): Analisar a comunicação direta e descentralizada, como no BitTorrent.' },
            { id: '2026_1_rd_08', texto: 'Internet das Coisas (IoT): O papel dos sensores e etiquetas RFID na computação ubíqua.' },
            { id: '2026_1_rd_09', texto: 'Questões Sociais e Éticas: Analisar desafios de privacidade (cookies), segurança (phishing/botnets) e a neutralidade da rede.' },
          ]
        },
        {
          nome: 'Módulo 2: Classificação e Hardware de Rede',
          icone: '🖥️',
          itens: [
            { id: '2026_1_rd_10', texto: 'Tecnologias de Transmissão: Diferenciar redes de Broadcast (canal compartilhado) de redes Ponto a Ponto (enlaces individuais).' },
            { id: '2026_1_rd_11', texto: 'Endereçamento em Broadcast: Definir Unicasting (1 para 1), Multicasting (1 para grupo) e o conceito de broadcasting (1 para todos).' },
            { id: '2026_1_rd_12', texto: 'Escala Física das Redes: PAN (área pessoal, ~1m — ex: Bluetooth), LAN (prédios/campus — Ethernet e WiFi), MAN (abrangência urbana — TV a cabo, WiMAX), WAN (países/continentes — roteadores e backbones).' },
            { id: '2026_1_rd_13', texto: 'Redes Sem Fio vs. Móveis: Compreender que uma rede pode ser sem fio mas fixa, ou móvel mas com fios.' },
            { id: '2026_1_rd_14', texto: 'Redes Interligadas (Internets): O papel do Gateway como a máquina que conecta e traduz redes incompatíveis.' },
          ]
        },
        {
          nome: 'Módulo 3: Meios de Transmissão e Dispositivos',
          icone: '📡',
          itens: [
            { id: '2026_1_rd_15', texto: 'Camada Física e Bits: Entender o foco na movimentação física de sinais elétricos ou ópticos para garantir que o bit "1" chegue como "1".' },
            { id: '2026_1_rd_16', texto: 'Meios Guiados: Fio de Cobre (uso em LANs e "última milha" via DSL) e Fibra Óptica (essencial para backbones e FTTH; imune a interferências e com baixo atraso).' },
            { id: '2026_1_rd_17', texto: 'Meios Não Guiados: Transmissão via rádio (WiFi - 802.11) e satélites (propriedade inerente de broadcast).' },
            { id: '2026_1_rd_18', texto: 'Dispositivos de Conexão: Modems (conversão digital/analógica), Ponto de Acesso (AP), Switch Ethernet (encaminhamento por endereço) e Roteadores (escolha do melhor caminho).' },
          ]
        },
        {
          nome: 'Módulo 4: Arquitetura em Camadas e Modelo OSI',
          icone: '📚',
          itens: [
            { id: '2026_1_rd_19', texto: 'Conceitos de Camadas: Entender a organização em camadas para reduzir a complexidade, definindo interfaces e entidades pares.' },
            { id: '2026_1_rd_20', texto: 'Funções das 7 Camadas OSI: 1-Física (bits brutos), 2-Enlace (framing e controle de erros), 3-Rede (roteamento e endereçamento), 4-Transporte (comunicação fim a fim), 5-Sessão (diálogos e sincronização), 6-Apresentação (sintaxe, compressão, criptografia), 7-Aplicação (HTTP, SMTP, FTP).' },
          ]
        },
        {
          nome: 'Módulo 5: Modelo TCP/IP e Protocolos de Transporte',
          icone: '🔗',
          itens: [
            { id: '2026_1_rd_21', texto: 'Pilha TCP/IP: Estudar as camadas de Aplicação, Transporte, Rede (Internet) e Enlace/Física.' },
            { id: '2026_1_rd_22', texto: 'Encapsulamento: Compreender como cada camada adiciona cabeçalhos aos dados.' },
            { id: '2026_1_rd_23', texto: 'TCP (Transmission Control Protocol): Confiável, orientado à conexão, com controle de fluxo e sequenciamento.' },
            { id: '2026_1_rd_24', texto: 'UDP (User Datagram Protocol): Simples, não confiável e sem conexão; ideal para VoIP e velocidade.' },
            { id: '2026_1_rd_25', texto: 'Aperto de Mão (Three-way Handshake): O processo de estabelecimento de conexão no TCP.' },
          ]
        },
        {
          nome: 'Módulo 6: Topologias e Desempenho',
          icone: '🕸️',
          itens: [
            { id: '2026_1_rd_26', texto: 'Topologias Físicas: Barramento (cabo central), Estrela (switch central), Anel (circulação unidirecional), Árvore (estrutura hierárquica) e Malha/Mesh (redundância total).' },
            { id: '2026_1_rd_27', texto: 'Métricas de Performance: Vazão (Throughput em Mbps/Gbps), Atrasos (propagação vs. transporte) e Qualidade de Serviço (QoS) para gerenciar Jitter.' },
            { id: '2026_1_rd_28', texto: 'Multiplexação Estatística: Alocação dinâmica de canais por demanda.' },
          ]
        },
        {
          nome: 'Módulo 7: Padronização e Comunicação de Dados',
          icone: '📋',
          itens: [
            { id: '2026_1_rd_29', texto: 'Órgãos de Padronização: Funções da ISO (modelos teóricos), IEEE (802.3 Ethernet / 802.11 WiFi) e IETF (RFCs da Internet).' },
            { id: '2026_1_rd_30', texto: 'Cinco Componentes da Comunicação: Mensagem, Emissor, Receptor, Meio de Transmissão e Protocolo.' },
            { id: '2026_1_rd_31', texto: 'Eficácia do Sistema: Critérios de Entrega, Precisão, Sincronização e Jitter.' },
            { id: '2026_1_rd_32', texto: 'Sinais Analógicos vs. Digitais: Diferenciar continuidade (infinitos valores) de discretização (0 e 1).' },
            { id: '2026_1_rd_33', texto: 'Atributos da Onda Seno: Definir Amplitude, Frequência (Hertz) e Fase.' },
            { id: '2026_1_rd_34', texto: 'Sinais Periódicos vs. Não Periódicos: Padrões repetitivos vs. variações constantes.' },
          ]
        },
      ]
    },

  },

  /* ══════════════════════════════════════════
     SEMESTRE 2026.2
  ══════════════════════════════════════════ */
  '2026.2': {

    'poo': {
      categorias: [
        {
          nome: 'Fundamentos',
          icone: '📐',
          itens: [
            { id: '2026_2_poo_f1', texto: 'Revisar conceitos de classes e objetos' },
            { id: '2026_2_poo_f2', texto: 'Entender herança e polimorfismo' },
            { id: '2026_2_poo_f3', texto: 'Praticar encapsulamento e abstração' },
            { id: '2026_2_poo_f4', texto: 'Estudar interfaces e classes abstratas' },
          ]
        },
        {
          nome: 'Exercícios',
          icone: '💻',
          itens: [
            { id: '2026_2_poo_e1', texto: 'Lista 1 — Classes básicas' },
            { id: '2026_2_poo_e2', texto: 'Lista 2 — Herança e polimorfismo' },
            { id: '2026_2_poo_e3', texto: 'Lista 3 — Coleções e generics' },
            { id: '2026_2_poo_e4', texto: 'Projeto final da disciplina' },
          ]
        },
        {
          nome: 'Avaliações',
          icone: '📋',
          itens: [
            { id: '2026_2_poo_a1', texto: 'Revisar prova 1' },
            { id: '2026_2_poo_a2', texto: 'Revisar prova 2' },
            { id: '2026_2_poo_a3', texto: 'Simulado antes da prova final' },
          ]
        }
      ]
    },

    'redes': {
      categorias: [
        {
          nome: 'Modelo OSI / TCP-IP',
          icone: '🌐',
          itens: [
            { id: '2026_2_red_o1', texto: 'Memorizar as 7 camadas do modelo OSI' },
            { id: '2026_2_red_o2', texto: 'Entender o encapsulamento de pacotes' },
            { id: '2026_2_red_o3', texto: 'Diferenciar TCP de UDP' },
          ]
        },
        {
          nome: 'Protocolos',
          icone: '📡',
          itens: [
            { id: '2026_2_red_p1', texto: 'Estudar HTTP / HTTPS' },
            { id: '2026_2_red_p2', texto: 'Entender DNS e DHCP' },
            { id: '2026_2_red_p3', texto: 'Praticar subnetting e máscaras' },
          ]
        },
        {
          nome: 'Avaliações',
          icone: '📋',
          itens: [
            { id: '2026_2_red_a1', texto: 'Revisar prova 1' },
            { id: '2026_2_red_a2', texto: 'Simulado antes da prova final' },
          ]
        }
      ]
    },

    'design': {
      categorias: [
        {
          nome: 'Fundamentos',
          icone: '🎨',
          itens: [
            { id: '2026_2_des_f1', texto: 'Estudar princípios de UX/UI' },
            { id: '2026_2_des_f2', texto: 'Entender fluxos de usuário' },
            { id: '2026_2_des_f3', texto: 'Praticar prototipagem no Figma' },
          ]
        },
        {
          nome: 'Projetos',
          icone: '🖼️',
          itens: [
            { id: '2026_2_des_p1', texto: 'Entrega do projeto de wireframe' },
            { id: '2026_2_des_p2', texto: 'Entrega do protótipo interativo' },
          ]
        },
        {
          nome: 'Avaliações',
          icone: '📋',
          itens: [
            { id: '2026_2_des_a1', texto: 'Revisar prova 1' },
            { id: '2026_2_des_a2', texto: 'Simulado antes da prova final' },
          ]
        }
      ]
    },

  },

  /* ══════════════════════════════════════════
     SEMESTRE 2027.1
  ══════════════════════════════════════════ */
  '2027.1': {

    'poo': {
      categorias: [
        {
          nome: 'Fundamentos',
          icone: '📐',
          itens: [
            { id: '2027_1_poo_f1', texto: 'Conteúdo do semestre 2027.1' },
          ]
        }
      ]
    },

  },

};