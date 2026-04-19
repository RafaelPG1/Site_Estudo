// ============================================================
// NEXUS STUDY — quiz/conteudo/2026/2026.1/ques_redes.js
// Redes de Computadores I — Questões 2026.1
// Convertido do formato v1 para v2
// ============================================================

window.questoes = {

  // ── Questões de Aula ──────────────────────────────────────

  questoes: [

    // ── Aula 01/02 — Fundamentos e Classificação de Redes ───

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Uma startup de tecnologia está desenvolvendo um novo sistema de compartilhamento de arquivos de vídeo em altíssima resolução. Para economizar custos com infraestrutura de servidores centrais e aproveitar a capacidade de processamento e upload dos próprios usuários, a equipe de engenharia decide que cada nó da rede deve ser capaz de fornecer e consumir dados simultaneamente, sem uma hierarquia rígida.",
      question: "Esse cenário descreve a aplicação de qual modelo de organização?",
      options: [
        "Modelo Cliente-Servidor.",
        "Redes de Área Pessoal (PAN).",
        "Modelo Peer-to-Peer (P2P).",
        "Sistemas Distribuídos Transparentes.",
        "Redes Privadas Virtuais (VPN)."
      ],
      answer: 2,
      feedback: "No modelo ==key==Peer-to-Peer (P2P)== não há uma divisão estrita entre quem provê e quem consome o dado — a responsabilidade é ==mark==compartilhada entre todos os nós==, sem hierarquia central."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Um hospital universitário implementou um sistema onde cada computador opera de forma independente, sem um controle central obrigatório, mas todos estão interconectados por fibra óptica para trocar prontuários médicos. Os usuários precisam lidar explicitamente com diferentes sistemas operacionais e máquinas reais para acessar os dados.",
      question: "De acordo com as definições técnicas de arquitetura, esse sistema é classificado como:",
      options: [
        "Sistema Distribuído.",
        "Rede de Computadores.",
        "Computação em Nuvem Centralizada.",
        "Middleware de Coesão.",
        "Mainframe de Processamento Único."
      ],
      answer: 1,
      feedback: "Uma ==key==Rede de Computadores== consiste em computadores ==mark==autônomos interconectados== onde o usuário lida explicitamente com o hardware e há ausência de um middleware que traga coesão e transparência ao conjunto."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Uma grande rede de supermercados deseja substituir os códigos de barras de seus produtos por etiquetas que permitam o inventário em tempo real sem a necessidade de contato visual ou manual com o item. A solução adotada utiliza chips passivos embutidos nas embalagens, que reportam automaticamente dados de identificação e localização via sinal de radiofrequência para leitores espalhados pelo estoque.",
      question: "Esse cenário é um exemplo prático de qual tecnologia?",
      options: [
        "Redes de TV a Cabo (MAN).",
        "Identificação por Radiofrequência (RFID).",
        "Telefonia IP (VoIP).",
        "Bibliotecas Digitais.",
        "Virtual Private Networks (VPN)."
      ],
      answer: 1,
      feedback: "O ==key==RFID (Identificação por Radiofrequência)== utiliza ==mark==chips passivos== para monitoramento e identificação automática, sendo um pilar da computação ubíqua e da Internet das Coisas."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Um engenheiro de software precisa decidir entre implementar a lógica de um novo sistema de reservas aéreas como uma rede de computadores pura ou como um sistema distribuído. O sistema será acessado por milhares de agências ao redor do mundo e precisa apresentar-se como uma plataforma única e coesa, independentemente de quantas máquinas físicas estejam envolvidas no processamento.",
      question: "Considerando a diferenciação arquitetural entre esses dois conceitos, qual critério seria determinante para escolher o sistema distribuído?",
      options: [
        "A necessidade de os usuários operarem máquinas autônomas e independentes.",
        "A interconexão física obrigatória via cabos de cobre para evitar latência.",
        "A existência de um middleware que ofereça transparência e faça o conjunto parecer um sistema único e coerente.",
        "A capacidade de trocar informações apenas por ondas eletromagnéticas ou satélites.",
        "A presença de roteadores especializados para escolher as melhores interfaces de saída."
      ],
      answer: 2,
      feedback: "A principal diferença arquitetural é que ==key==sistemas distribuídos== possuem um ==key==middleware== que garante ==mark==coesão e transparência==, fazendo com que o hardware seja invisível para o usuário, ao contrário das redes de computadores."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Uma empresa de advocacia com escritórios em Singapura e Nova York precisa garantir que seus advogados acessem documentos confidenciais de clientes de qualquer localidade, como se estivessem operando um servidor local. Graças à infraestrutura de redes, os arquivos localizados fisicamente em um continente são acessados em tempo real por profissionais no outro lado do globo, eliminando a necessidade de deslocamentos ou envio físico de documentos.",
      question: "Esse benefício das redes de computadores é conhecido como:",
      options: [
        "Economia de Escala de Hardware.",
        "Eliminação da \"tirania da geografia\".",
        "Neutralidade da Rede.",
        "Entretenimento Digital IPTV.",
        "Algoritmo de Roteamento Dinâmico."
      ],
      answer: 1,
      feedback: "O ==key==compartilhamento de recursos== em rede permite que dados em locais distantes sejam acessados como se fossem locais, removendo as limitações geográficas — conceito chamado de ==mark==eliminação da \"tirania da geografia\"==."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Durante uma auditoria de TI em uma empresa do setor financeiro, descobriu-se que funcionários estavam utilizando o BitTorrent para baixar arquivos pessoais no ambiente de trabalho. Além do alto consumo de banda, o gestor de segurança identificou que essa tecnologia opera sem um banco de dados centralizado para controle de conteúdo — cada usuário conectado pode simultaneamente baixar e distribuir partes de arquivos para outros participantes da rede.",
      question: "Essa característica de descentralização é típica de qual modelo?",
      options: [
        "Modelos Cliente-Servidor tradicionais.",
        "Redes de Área Pessoal (PAN).",
        "Redes Sociais Controladas.",
        "Sistemas Peer-to-Peer (P2P).",
        "Redes Metropolitanas (MAN) de TV."
      ],
      answer: 3,
      feedback: "O ==key==BitTorrent== é um exemplo moderno de sistema ==key==P2P==, caracterizado pela ==mark==descentralização e ausência de um banco de dados de conteúdo central==. Cada nó é simultaneamente cliente e servidor."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Uma operadora de internet de grande porte passou a oferecer velocidades de download significativamente menores para serviços de streaming de concorrentes, enquanto o acesso à sua própria plataforma de vídeo permanecia sem restrições. Usuários e entidades reguladoras questionaram a legalidade dessa prática, argumentando que o tráfego de todos os provedores de conteúdo deveria ser tratado de forma igualitária pelos operadores de infraestrutura.",
      question: "Esse debate envolve qual conceito central das questões sociais e éticas das redes modernas?",
      options: [
        "Privacidade de Cookies.",
        "Anonimato Digital.",
        "Neutralidade da Rede.",
        "Segurança de Phishing.",
        "Autonomia de Máquinas."
      ],
      answer: 2,
      feedback: "A ==key==Neutralidade da Rede== é o princípio que determina que todo conteúdo deve ser tratado de forma ==mark==igualitária pelos operadores de infraestrutura==, sem discriminação por origem, destino ou tipo de conteúdo."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Ao estudar o crescimento das redes sociais e da internet, pesquisadores observaram que plataformas como o Facebook se tornaram exponencialmente mais valiosas à medida que novos usuários ingressavam. Esse fenômeno é explicado por um princípio econômico que descreve a relação entre o número de participantes de uma rede e o valor que ela gera para cada um de seus membros.",
      question: "A \"Lei de Metcalfe\", citada no contexto das aplicações domésticas de redes, afirma:",
      options: [
        "O valor de uma rede cresce linearmente com o número de usuários.",
        "O custo da rede diminui à medida que a largura de banda aumenta.",
        "O valor de uma rede cresce proporcionalmente ao quadrado do número de usuários.",
        "A velocidade da rede dobra a cada 18 meses.",
        "Redes sem fio são sempre menos eficientes que redes cabeadas."
      ],
      answer: 2,
      feedback: "A ==key==Lei de Metcalfe== indica que o valor de uma rede cresce ==mark==proporcionalmente ao quadrado do número de usuários==. Isso explica por que grandes plataformas se tornam exponencialmente mais valiosas conforme crescem."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Um edifício inteligente utiliza sensores de temperatura, câmeras e etiquetas RFID para controle de acesso e automação de ambientes. O administrador da rede constatou que dispositivos domésticos mal protegidos — como lâmpadas Wi-Fi e termostatos conectados — foram comprometidos por agentes maliciosos e passaram a enviar requisições coordenadas a servidores externos, sobrecarregando-os e tornando-os indisponíveis para usuários legítimos.",
      question: "Esse problema de segurança, onde dispositivos IoT infectados são utilizados para ataques coordenados, é tecnicamente conhecido como:",
      options: [
        "Middleware Malicioso.",
        "Fragmentação de Dados.",
        "Botnets.",
        "Unicasting.",
        "Virtual Private Network (VPN)."
      ],
      answer: 2,
      feedback: "==key==Botnets== são redes de dispositivos infectados usados para ==mark==ataques coordenados== (como DDoS), um dos grandes desafios de segurança na era da IoT e da conectividade massiva."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Para reduzir custos operacionais com deslocamentos e ligações internacionais, uma multinacional com filiais em quatro continentes implementou um sistema integrado de videoconferência e comunicação de voz sobre rede de dados. Com isso, as reuniões antes realizadas presencialmente passaram a ocorrer de forma remota, e as chamadas telefônicas entre filiais deixaram de ser roteadas pelas companhias telefônicas tradicionais.",
      question: "Qual é o componente principal dessa solução e quais custos tradicionais ela visa substituir?",
      options: [
        "Substituem custos de energia e usam a rede de telefonia analógica tradicional.",
        "Substituem custos de viagens e usam a rede de dados em vez da companhia telefônica.",
        "Substituem custos de servidores e usam o modelo P2P exclusivo.",
        "Substituem custos de segurança física e usam RFID em todos os funcionários.",
        "Substituem custos de licenciamento de software e usam redes sociais."
      ],
      answer: 1,
      feedback: "Tecnologias de ==key==VoIP e videoconferência== eliminam ==mark==custos de viagens== e as chamadas são realizadas pela ==mark==rede de dados== em vez das companhias telefônicas tradicionais."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Um engenheiro de redes foi contratado para projetar a conectividade de um novo campus universitário onde os prédios estão distribuídos em um raio de 800 metros entre si. Os requisitos do projeto exigem alta velocidade de transferência (até 10 Gbps entre os edifícios) e o menor atraso possível para as aplicações acadêmicas e administrativas.",
      question: "De acordo com a escala física das redes, qual é a classificação correta para esse projeto?",
      options: [
        "Personal Area Network (PAN).",
        "Metropolitan Area Network (MAN).",
        "Local Area Network (LAN).",
        "Wide Area Network (WAN).",
        "Internet Planetária."
      ],
      answer: 2,
      feedback: "As ==key==LANs== operam dentro de um único prédio ou campus de ==mark==até alguns quilômetros==, com altas velocidades e baixo atraso. Um campus com prédios a 800 metros se enquadra nessa classificação."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Em uma rede de laboratório, todas as máquinas compartilham um único canal de comunicação. Quando qualquer computador envia um pacote, ele é fisicamente recebido por todos os outros dispositivos conectados ao mesmo canal. Contudo, apenas o equipamento cujo endereço corresponde ao campo de destino do pacote efetua o processamento da informação; os demais simplesmente ignoram o dado recebido.",
      question: "Esse tipo de tecnologia de transmissão é conhecido como:",
      options: [
        "Ponto a Ponto.",
        "Broadcast.",
        "Roteamento de Malha.",
        "Unicasting Direto.",
        "Gateway de Tradução."
      ],
      answer: 1,
      feedback: "Redes de ==key==broadcast== utilizam um único ==mark==canal compartilhado== onde todas as máquinas recebem o pacote, mas um campo de endereço identifica o destinatário. Os demais nós ignoram o dado."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Um executivo em viagem de negócios utiliza seu smartphone para conectar-se simultaneamente a fones de ouvido sem fio e a um smartwatch enquanto caminha pelo hotel. Todos esses dispositivos trocam dados em um raio inferior a um metro, sem depender de infraestrutura de rede externa.",
      question: "Essa rede, que opera no alcance de uma pessoa, é classificada como:",
      options: [
        "Local Area Network (LAN).",
        "Wide Area Network (WAN).",
        "Metropolitan Area Network (MAN).",
        "Personal Area Network (PAN).",
        "Virtual Private Network (VPN)."
      ],
      answer: 3,
      feedback: "As ==key==PANs (Personal Area Networks)== permitem a comunicação no ==mark==alcance de uma pessoa (geralmente até 10 metros)== e o ==mark==Bluetooth== é a tecnologia emblemática para isso."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Uma empresa de telecomunicações está expandindo sua rede de fibra óptica transcontinental para interligar data centers na América do Sul, Europa e Ásia. No projeto, máquinas especializadas analisam os pacotes de dados recebidos e executam algoritmos para selecionar a melhor interface de saída, encaminhando os dados por rotas eficientes através de dezenas de nós intermediários ao longo dos continentes.",
      question: "Considerando o hardware de rede de longa distância, quais são os dois componentes fundamentais da \"sub-rede de comunicação\" descritos nesse cenário?",
      options: [
        "Pontos de Acesso e Switches Ethernet.",
        "Linhas de Transmissão e Elementos de Comutação (Roteadores).",
        "Bluetooth Mestre e Smartcards Escravos.",
        "Modems DSL e Cabos de TV Analógica.",
        "Gateways de Tradução e Cookies de Sessão."
      ],
      answer: 1,
      feedback: "Uma ==key==WAN== interconecta hosts utilizando uma sub-rede composta por ==key==linhas de transmissão== (fibra, cobre, rádio) e ==key==elementos de comutação (roteadores)==, que selecionam a melhor interface de saída para cada pacote."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Uma prefeitura municipal decidiu interconectar digitalmente todas as 47 escolas e 23 postos de saúde espalhados por uma cidade de médio porte, cujos pontos mais distantes estão a aproximadamente 10 km do centro administrativo. Para reduzir custos, o projeto aproveitará a infraestrutura de cabos de TV já instalada ao longo das principais avenidas da cidade.",
      question: "Essa rede é classificada como:",
      options: [
        "LAN (Rede Local).",
        "PAN (Rede Pessoal).",
        "MAN (Rede Metropolitana).",
        "WAN (Rede de Longa Distância).",
        "Ad Hoc (Rede Temporária)."
      ],
      answer: 2,
      feedback: "Uma ==key==MAN (Metropolitan Area Network)== abrange uma cidade inteira (~dezenas de quilômetros). O exemplo clássico é exatamente a ==mark==rede de TV a cabo evoluída para internet== em escala municipal."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Uma multinacional com filiais em São Paulo, Tóquio e Londres precisa garantir que os funcionários de diferentes países trabalhem de forma integrada, acessando os mesmos sistemas internos como se estivessem na mesma rede local. Alugar linhas dedicadas transcontinentais seria inviável financeiramente, por isso a empresa optou por uma solução que utiliza a infraestrutura pública da Internet para criar canais virtuais criptografados e seguros entre os escritórios.",
      question: "Essa solução técnica é chamada de:",
      options: [
        "Backbone de Alta Velocidade.",
        "Virtual Private Network (VPN).",
        "Gateway de Interconexão.",
        "WiMAX (802.16).",
        "Ethernet Comutada."
      ],
      answer: 1,
      feedback: "A ==key==VPN (Virtual Private Network)== cria ==mark==links virtuais criptografados== sobre a infraestrutura pública da Internet, oferecendo flexibilidade e custo reduzido em relação a linhas dedicadas."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Um prédio tombado pelo patrimônio histórico não pode receber perfurações em suas paredes para passar cabos de rede. A equipe de TI instalou então uma antena Wi-Fi no escritório para conectar os computadores desktop à rede corporativa. Apesar de usar tecnologia sem fio, as máquinas permanecem em posição fixa sobre as mesas, sem qualquer mobilidade.",
      question: "Como essa configuração é classificada quanto ao tipo de rede e à mobilidade dos dispositivos?",
      options: [
        "Com fio e Fixa.",
        "Com fio e Móvel.",
        "Sem fio e Móvel.",
        "Sem fio e Fixa.",
        "Bluetooth Ponto a Ponto."
      ],
      answer: 3,
      feedback: "O dispositivo usa ==key==rede sem fio== (Wi-Fi), mas é ==key==fixo== (desktop em posição imóvel). A ==mark==computação móvel== implica deslocamento do dispositivo, o que não ocorre com desktops fixos mesmo usando Wi-Fi."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Um profissional utiliza diariamente dois tipos de tecnologia sem fio: o Bluetooth para conectar fones de ouvido e um teclado ao seu notebook, e o WiFi para acessar a internet em cafeterias e salas de reunião. Embora ambas as tecnologias utilizem ondas de rádio para transmissão, elas foram projetadas para escalas de uso e contextos de aplicação bem distintos.",
      question: "Qual é a principal diferença de escala entre as tecnologias Bluetooth e WiFi?",
      options: [
        "O Bluetooth é para redes de longa distância (WAN), enquanto o WiFi é para redes locais (LAN).",
        "O Bluetooth foca na escala de rede pessoal (PAN), enquanto o WiFi opera em escala local (LAN).",
        "O WiFi é imune a interferências, enquanto o Bluetooth exige fios de cobre.",
        "O WiFi só funciona em ambientes fechados, enquanto o Bluetooth cobre cidades inteiras.",
        "Não há diferença técnica, pois ambos utilizam fibras ópticas para transmissão."
      ],
      answer: 1,
      feedback: "==key==Bluetooth== foca na escala de ==mark==rede pessoal (PAN)== — alcance de metros para dispositivos individuais. ==key==WiFi== opera em escala de ==mark==rede local (LAN)== — cobrindo prédios, escritórios e campus."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Uma empresa de e-commerce deseja expandir seu alcance de vendas pela internet. O diretor de TI apresenta duas opções de modelo de serviço: no primeiro, um servidor centralizado de alto custo processa todas as requisições dos clientes; no segundo, a lógica de negócio é distribuída por vários servidores espalhados geograficamente, mas toda a infraestrutura aparece aos usuários como uma única plataforma coesa. O diretor argumenta que o segundo modelo é um Sistema Distribuído.",
      question: "Qual das seguintes características, segundo o resumo, é exclusiva dos Sistemas Distribuídos e o diferencia de uma simples rede de computadores?",
      options: [
        "A presença de múltiplos computadores autônomos interconectados por cabos.",
        "A necessidade de o usuário conhecer e acessar cada máquina individualmente.",
        "A existência de um software intermediário (middleware) que cria transparência e a ilusão de um sistema único.",
        "O uso obrigatório de ondas eletromagnéticas como meio de transmissão.",
        "A capacidade de armazenar dados localmente em cada nó da rede."
      ],
      answer: 2,
      feedback: "O ==key==middleware== é o componente essencial que diferencia um ==key==Sistema Distribuído== de uma rede simples — ele garante ==mark==coesão, transparência e faz o hardware invisível para o usuário==."
    },

    {
      aula: "Aula 01/02 — Fundamentos e Classificação de Redes",
      tipo: "Contextualizada",
      texto: "Um gestor de TI de uma rede de clínicas médicas precisa apresentar aos acionistas os benefícios estratégicos de migrar toda a infraestrutura de dados para uma rede corporativa. Entre os pontos levantados, ele destaca que médicos em cidades distintas poderão compartilhar prontuários eletrônicos armazenados em um único servidor, assim como impressoras de alto custo poderão ser compartilhadas entre múltiplos consultórios no mesmo andar, reduzindo despesas operacionais.",
      question: "Os dois benefícios descritos pelo gestor — acesso remoto a dados e compartilhamento de equipamentos — se enquadram em qual vantagem fundamental das redes de computadores, segundo o resumo?",
      options: [
        "Aplicação do modelo P2P para descentralização do sistema.",
        "Uso de VPN para criptografar os dados entre os consultórios.",
        "Compartilhamento de recursos, eliminando a tirania da geografia e promovendo economia de escala.",
        "Implementação de middleware para garantir transparência total ao usuário.",
        "Utilização da Lei de Metcalfe para justificar o investimento financeiro."
      ],
      answer: 2,
      feedback: "O ==key==compartilhamento de recursos== — servidores, impressoras e dados — independentemente da localização é um dos principais benefícios das redes, promovendo tanto ==mark==economia de escala== quanto ==mark==eliminação da tirania da geografia==."
    },

    // ── Aula 03/04 — Meios, Dispositivos e Modelos ──────────

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Em um escritório moderno que passou por recente modernização, o antigo cabeamento coletivo foi substituído por uma arquitetura em que cada computador possui seu próprio cabo físico conectado a um dispositivo central. Esse equipamento recebe os pacotes e, consultando uma tabela de endereços, encaminha os dados exclusivamente para a porta à qual o destinatário está conectado, evitando que os outros computadores recebam pacotes desnecessários.",
      question: "Qual é esse hardware central responsável pelo encaminhamento inteligente?",
      options: [
        "Modem DSL.",
        "Roteador WAN.",
        "Switch Ethernet.",
        "Antena de Satélite.",
        "Gateway de Protocolos."
      ],
      answer: 2,
      feedback: "O ==key==Switch Ethernet== é um dispositivo com várias portas que encaminha pacotes ==mark==apenas para a porta correta== com base no endereço de destino, evitando tráfego desnecessário nas demais portas."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Em uma residência, o roteador doméstico conecta dispositivos Wi-Fi (smartphones e notebooks) a uma rede Ethernet cabeada que por sua vez se liga ao modem do provedor. Internamente, o roteador precisa fazer com que essas duas redes — com padrões de comunicação distintos — funcionem de forma integrada, traduzindo os dados entre os diferentes formatos de pacote utilizados por cada tecnologia.",
      question: "Qual é o nome técnico do dispositivo ou função que realiza essa conexão e tradução entre redes quase sempre incompatíveis?",
      options: [
        "Switch.",
        "Roteador.",
        "Gateway.",
        "Modem.",
        "Access Point."
      ],
      answer: 2,
      feedback: "O ==key==Gateway== é o nome geral para o dispositivo que oferece ==mark==conexão e tradução entre redes incompatíveis==, convertendo dados entre diferentes formatos e protocolos de comunicação."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Uma expedição científica instalada na Antártida precisa enviar diariamente grandes volumes de dados climáticos para uma universidade na Europa. A região não dispõe de nenhuma infraestrutura terrestre de cabos de fibra óptica ou torres de rádio. A solução adotada utiliza uma antena no solo que transmite os dados para um equipamento em órbita, o qual redistribui o sinal para uma vasta área geográfica no destino.",
      question: "Quais são as características fundamentais dessa tecnologia de transmissão?",
      options: [
        "Curto alcance (1 metro) e paradigma mestre-escravo.",
        "Alcance metropolitano (10 km) via WiMAX.",
        "Cobertura de áreas sem infraestrutura terrestre e propriedade de transmissão broadcast.",
        "Conexão direta entre dois roteadores via cabo de cobre par trançado.",
        "Uso de switches para encaminhamento inteligente de pacotes locais."
      ],
      answer: 2,
      feedback: "Sistemas ==key==via satélite== funcionam com ==mark==transmissão broadcast inerente== e são fundamentais para cobrir ==mark==áreas geográficas onde o transporte terrestre é inviável==."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Uma operadora de internet deseja expandir seus serviços para um bairro recém-construído. Após analisar as alternativas disponíveis, a empresa optou pela tecnologia FTTH (Fiber to the Home), que leva a fibra óptica diretamente às residências dos usuários finais, garantindo velocidades superiores a 100 Mbps.",
      question: "Comparada ao tradicional fio de cobre, qual é a principal vantagem técnica da fibra óptica para o desempenho da rede?",
      options: [
        "Menor custo de instalação em curtas distâncias.",
        "Imunidade a interferências eletromagnéticas e baixíssimo atraso.",
        "Capacidade de transmitir apenas sinais analógicos de voz.",
        "Reutilização obrigatória da infraestrutura de telefonia antiga.",
        "Facilidade em realizar emendas manuais sem equipamentos especializados."
      ],
      answer: 1,
      feedback: "A ==key==fibra óptica== é inerentemente ==mark==imune a ruídos elétricos== e oferece desempenho superior em ==mark==largura de banda e atraso== em relação aos cabos de cobre."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Um pesquisador instalado em uma estação científica remota no interior da Amazônia precisa enviar diariamente grandes volumes de dados meteorológicos e de monitoramento ambiental para centros de processamento localizados em São Paulo e Lisboa. A região não possui cobertura de rede celular, não há torres de rádio nas proximidades e nenhum cabo de fibra óptica chega àquela localidade.",
      question: "Qual tecnologia de transmissão é a mais indicada para garantir a conectividade nessa região geográfica isolada?",
      options: [
        "Ethernet comutada via par trançado.",
        "Redes celulares de curto alcance.",
        "Sistemas via satélite de transmissão broadcast.",
        "Linhas DSL reutilizadas de telefonia.",
        "Conexão Dial-up de 56 kbps."
      ],
      answer: 2,
      feedback: "Sistemas de ==key==satélite== são ideais para cobrir ==mark==áreas onde o transporte terrestre é inviável==, funcionando como redes de radiodifusão com cobertura global."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Uma empresa com escritórios regionais distribuídos por cidades do interior contratou um provedor de internet para fornecer acesso de banda larga. O provedor optou por uma tecnologia que aproveita a extensa malha de fios de cobre já existente da rede telefônica convencional, evitando a necessidade de instalar novos cabos até cada localidade atendida.",
      question: "Qual é a característica específica de aproveitamento de recursos que define essa tecnologia?",
      options: [
        "Substituição total de todos os fios de cobre por fibras ópticas.",
        "Uso exclusivo de sinais de rádio para evitar atenuação.",
        "Reutilização da infraestrutura telefônica existente para transportar dados digitais.",
        "Transmissão de dados apenas em um sentido (simplex).",
        "Limitação obrigatória da velocidade a 56 kbps."
      ],
      answer: 2,
      feedback: "O ==key==DSL== permite que a rede de dados utilize a ==mark==\"última milha\" dos fios de cobre das companhias telefônicas==, evitando a necessidade de instalar nova infraestrutura física."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Em uma planta industrial com grandes motores elétricos e equipamentos de soldagem, a equipe de TI registra um alto índice de erros na transmissão de bits pela rede interna baseada em fios de cobre. Os campos eletromagnéticos gerados pelos motores corrompem os sinais elétricos nos cabos, fazendo com que bits '1' sejam recebidos como '0' e vice-versa, comprometendo a integridade dos dados.",
      question: "Para resolver o problema de precisão na entrega dos dados nesse ambiente hostil, qual mudança na infraestrutura física seria a mais eficaz?",
      options: [
        "Aumentar a tensão elétrica nos cabos de par trançado.",
        "Substituir o cabeamento de cobre por fibra óptica.",
        "Instalar antenas WiFi potentes próximas aos motores.",
        "Reduzir o tempo de duração de cada bit para nanosegundos.",
        "Utilizar modems de rádio em frequências compartilhadas."
      ],
      answer: 1,
      feedback: "A ==key==fibra óptica== utiliza ==mark==luz para transmissão==, sendo totalmente ==mark==imune às interferências eletromagnéticas== que afetam o sinal elétrico nos cabos de cobre."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Uma universidade instalou uma rede sem fio baseada no padrão IEEE 802.11 (WiFi) em todos os seus campi para permitir que alunos e professores se conectem com notebooks e smartphones. No centro dessa infraestrutura estão dispositivos responsáveis por gerenciar os clientes sem fio e conectá-los à rede cabeada do campus, funcionando como estação-base para a comunicação compartilhada na área de cobertura.",
      question: "Qual é o principal componente que gerencia essa comunicação em uma rede local sem fio?",
      options: [
        "Modem DSL.",
        "Ponto de Acesso (Access Point).",
        "Cabo Coaxial de TV.",
        "Gateway de Tradução.",
        "Backbone de fibra internacional."
      ],
      answer: 1,
      feedback: "O ==key==Ponto de Acesso (Access Point)== atua como uma ==mark==estação-base== que gerencia os dispositivos wireless e os conecta à rede cabeada externa."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Na camada física de uma rede de dados, engenheiros definem padrões técnicos que estabelecem quais níveis de tensão elétrica representam o valor binário '1' e quais representam o valor '0'. Esses padrões, junto com especificações de conectores, pinagens e características elétricas, compõem a base da transmissão bruta de informações entre dispositivos.",
      question: "Qual é o objetivo central ao definir esses padrões técnicos na transmissão bruta?",
      options: [
        "Garantir que a lógica do quadro de dados seja verificada pelo hardware.",
        "Assegurar que um bit '1' enviado seja interpretado corretamente como '1' no destino.",
        "Impedir que o sinal viaje simultaneamente nos dois sentidos do cabo.",
        "Priorizar o tráfego de vídeo sobre o tráfego de texto no meio físico.",
        "Eliminar a necessidade de conectores e pinagens padronizadas."
      ],
      answer: 1,
      feedback: "O foco da ==key==camada física== é a ==mark==movimentação bruta de sinais== e a garantia da ==mark==integridade bit a bit==: um '1' enviado deve ser recebido como '1' no destino."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "As principais operadoras de telecomunicações do Brasil mantêm redes tronco (backbones) que cruzam o território nacional e se conectam a cabos submarinos internacionais. Esses sistemas são responsáveis por transportar o tráfego agregado de milhões de usuários, unindo milhares de roteadores e data centers em escala nacional e intercontinental.",
      question: "Qual é o meio de transmissão predominante nessas redes de backbone devido à sua alta largura de banda?",
      options: [
        "Satélites de órbita baixa.",
        "Cabos de cobre par trançado.",
        "Fibras ópticas de alta velocidade.",
        "Ondas de rádio infravermelho.",
        "Conexões Dial-up tradicionais."
      ],
      answer: 2,
      feedback: "A ==key==fibra óptica== excede o cobre em todas as dimensões de desempenho — ==mark==largura de banda, alcance e imunidade a ruídos== — sendo essencial para as conexões de backbone nacional e intercontinental."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Um condomínio residencial já possuía toda a infraestrutura de TV a cabo instalada, com cabeamento coaxial chegando a cada apartamento. O provedor de internet local aproveitou essa estrutura existente para oferecer acesso à web aos moradores, sem precisar instalar novos cabos. Um dispositivo específico é instalado em cada unidade para viabilizar essa conexão.",
      question: "Como esse dispositivo consegue transportar dados de internet utilizando a infraestrutura de TV a cabo?",
      options: [
        "Convertendo sinais digitais em ondas de som audíveis pela linha telefônica.",
        "Utilizando canais de TV a cabo que não estão sendo usados para a programação.",
        "Criando uma rede sem fio metropolitana baseada em satélites.",
        "Transmitindo bits através das tubulações de água e esgoto.",
        "Exigindo que o usuário instale uma antena parabólica dedicada em cada cômodo."
      ],
      answer: 1,
      feedback: "O ==key==modem a cabo== aproveita o ==mark==espectro não utilizado da rede de televisão== para o transporte de dados digitais, reutilizando a infraestrutura coaxial existente."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Ao projetar uma rede sem fio para um grande armazém de logística, um engenheiro percebe que os coletores de dados portáteis (PDAs) perdem frequentemente a conexão quando se movem atrás de prateleiras metálicas de grande porte. O sinal de rádio não consegue atravessar ou contornar adequadamente essas estruturas, resultando em falhas de transmissão e quedas de conexão em certas zonas do armazém.",
      question: "Qual conceito físico explica essa degradação e qual seria uma solução possível de acordo com os dispositivos de rede?",
      options: [
        "Atenuação do sinal no vácuo; solução: usar cabos coaxiais nos PDAs.",
        "Interferência de frequência; solução: usar exclusivamente modems DSL.",
        "Obstrução e reflexão do sinal; solução: instalar múltiplos Pontos de Acesso (APs) para cobertura.",
        "Latência de processamento; solução: aumentar a memória RAM dos coletores.",
        "Falha no protocolo de voz; solução: substituir o rádio por fibra óptica em cada PDA."
      ],
      answer: 2,
      feedback: "Sinais de rádio (meios ==key==não guiados==) são afetados por ==mark==obstáculos físicos e reflexões==. A solução é instalar ==key==múltiplos Access Points== estrategicamente posicionados para garantir cobertura completa."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Um provedor de internet (ISP) opera uma rede de longa distância com dezenas de pontos de presença espalhados pelo país. Quando um pacote de dados de um cliente chega a um desses pontos, um computador especializado analisa o endereço de destino e executa um algoritmo para determinar por qual interface de saída o dado deve seguir para alcançar o destino final de forma eficiente.",
      question: "Qual é o nome desse dispositivo e de sua função principal?",
      options: [
        "Switch; função de enquadramento de bits.",
        "Roteador; função de roteamento e escolha de caminho.",
        "Modem; função de modulação analógica.",
        "Gateway; função de tradução de voz humana.",
        "Access Point; função de gerar sinal de rádio."
      ],
      answer: 1,
      feedback: "==key==Roteadores== são especialistas em ==mark==decidir caminhos em redes complexas (WANs)== através de ==mark==algoritmos de roteamento==, analisando o endereço IP de destino de cada pacote."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Uma empresa de software legado utiliza internamente uma rede baseada em uma arquitetura proprietária desenvolvida na década de 1990, com formatos de pacotes e regras de comunicação completamente distintas do padrão TCP/IP da Internet. Para que os desenvolvedores possam acessar repositórios e APIs externas sem substituir toda a infraestrutura interna, é necessário um equipamento capaz de converter e traduzir os dados entre os dois ambientes incompatíveis.",
      question: "Esse dispositivo responsável pela conversão e tradução entre redes incompatíveis é chamado de:",
      options: [
        "Roteador Unicast.",
        "Switch de Alta Velocidade.",
        "Gateway.",
        "Antena de Satélite.",
        "Hub de Barramento."
      ],
      answer: 2,
      feedback: "O ==key==Gateway== é o termo geral para o dispositivo que oferece ==mark==conexão e tradução entre redes incompatíveis==, convertendo formatos de pacote e protocolos distintos."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Muitos usuários residenciais acessam a internet por meio de conexões via linha telefônica ou TV a cabo. Para viabilizar esse acesso, um dispositivo específico é instalado entre o computador do usuário e o meio físico de transmissão. Esse equipamento precisa converter os dados produzidos pelo computador — que trabalha exclusivamente com sinais digitais binários — em sinais compatíveis com o meio físico utilizado pelo provedor.",
      question: "Qual é a função técnica primordial que o Modem (Modulador-Demodulador) desempenha para o computador?",
      options: [
        "Escolher a melhor rota para o pacote na internet.",
        "Armazenar todos os arquivos do usuário em nuvem.",
        "Converter bits digitais do computador em sinais analógicos compatíveis com o meio físico.",
        "Impedir que vírus entrem na rede local.",
        "Traduzir o idioma das páginas web para o usuário."
      ],
      answer: 2,
      feedback: "A função do ==key==Modem (Modulador-Demodulador)== é a ==mark==conversão entre dados digitais e os sinais (elétricos ou de rádio) do canal físico==, tornando possível o tráfego de dados pela infraestrutura existente."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Uma empresa de consultoria em expansão reformou seu prédio e equipou todas as salas de reunião e andares com conectividade sem fio. O objetivo é que os funcionários possam mover-se livremente com seus notebooks entre qualquer ambiente do edifício sem perder a conexão à rede corporativa. Para isso, o administrador instalou múltiplos dispositivos espalhados estrategicamente pelo prédio, cada um gerenciando os clientes wireless de sua área e conectando-os à rede cabeada existente.",
      question: "Esses dispositivos responsáveis por gerenciar a comunicação sem fio e repassar os dados para a rede cabeada são:",
      options: [
        "Switches de Backbone.",
        "Gateways de Protocolo.",
        "Pontos de Acesso (Access Points).",
        "Roteadores de Borda.",
        "Modems de Fibra Óptica."
      ],
      answer: 2,
      feedback: "O ==key==Access Point (Ponto de Acesso)== é o componente central que ==mark==gerencia dispositivos wireless em uma LAN== e os conecta à rede cabeada existente."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Quatro pesquisadores de campo estão em uma área remota realizando um levantamento topográfico. Sem infraestrutura de rede disponível, eles precisam compartilhar arquivos de mapas e coordenadas entre seus notebooks em tempo real. Para isso, configuraram seus dispositivos para se comunicarem diretamente entre si via sinal de rádio Wi-Fi, sem nenhum equipamento central de infraestrutura.",
      question: "Essa configuração de rede sem fio sem dispositivo central é conhecida como:",
      options: [
        "Rede baseada em Ponto de Acesso.",
        "Rede Ad-hoc.",
        "Rede de Satélite Planetária.",
        "Sistema de Tradução Gateway.",
        "Ethernet Comutada."
      ],
      answer: 1,
      feedback: "O modo ==key==ad-hoc== permite que dispositivos próximos ==mark==se comuniquem diretamente, sem a necessidade de um AP central== ou qualquer infraestrutura de rede prévia."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Em uma empresa de médio porte, o administrador de rede utiliza dois tipos distintos de dispositivos de interconexão: um para conectar os computadores internamente no escritório (segmento local), e outro para conectar esse escritório à internet e às filiais em outras cidades. Cada dispositivo possui características e capacidades adequadas à sua escala de atuação.",
      question: "Qual é a principal diferença de funcionamento entre um Switch e um Roteador, considerando a escala de atuação de cada um?",
      options: [
        "O Switch conecta computadores em uma rede local (LAN), enquanto o Roteador interconecta redes distintas (WAN).",
        "O Switch só aceita fibras ópticas, enquanto o Roteador só funciona com cabos de telefone.",
        "O Roteador é um dispositivo passivo sem energia, enquanto o Switch é um computador potente.",
        "O Switch escolhe caminhos globais na Internet, enquanto o Roteador apenas repassa pacotes para a porta vizinha.",
        "Ambos são o mesmo dispositivo, mudando apenas o nome conforme o fabricante."
      ],
      answer: 0,
      feedback: "==key==Switches== operam internamente em ==mark==LANs== usando endereços MAC. ==key==Roteadores== operam na ==mark==interconexão de redes distintas (WAN)== usando endereços IP e algoritmos de roteamento."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "O setor administrativo de um hospital opera com computadores conectados por cabos Ethernet, enquanto os médicos utilizam tablets sem fio para acessar prontuários durante as visitas aos leitos. Para que os dados circulem de forma transparente entre a rede cabeada e os dispositivos móveis, o administrador precisa de um equipamento específico que faça o repasse dos pacotes entre os dois meios de transmissão.",
      question: "Qual dispositivo realiza esse repasse de pacotes entre o meio sem fio e o cabeado?",
      options: [
        "Gateway de Tradução de Arquitetura.",
        "Ponto de Acesso (Access Point).",
        "Modem de TV a Cabo.",
        "Roteador de Satélite.",
        "Antena Celular de Longo Alcance."
      ],
      answer: 1,
      feedback: "O ==key==Access Point== tem a função específica de ==mark==encaminhar pacotes entre máquinas sem fio e a rede cabeada externa==, integrando os dois meios de transmissão de forma transparente."
    },

    {
      aula: "Aula 03/04 — Meios, Dispositivos e Modelos",
      tipo: "Contextualizada",
      texto: "Em uma linha de montagem automatizada, robôs e sensores precisam trocar comandos e leituras em tempo real. O engenheiro responsável analisa o meio de comunicação mais adequado e observa que o fio de cobre sofre com a atenuação do sinal ao longo de grandes distâncias dentro da planta. Ele considera que a atenuação é a perda gradual de intensidade e amplitude do sinal durante a propagação, o que compromete a confiabilidade da rede.",
      question: "Qual é o efeito direto da atenuação em um meio guiado de cobre e qual recurso pode ser utilizado para compensá-la?",
      options: [
        "A atenuação aumenta a largura de banda; o recurso para compensar é reduzir o número de nós na rede.",
        "A atenuação converte sinais analógicos em digitais; o recurso para compensar é usar um gateway.",
        "A atenuação provoca a perda progressiva de intensidade do sinal; o recurso para compensar é o uso de amplificadores.",
        "A atenuação causa colisões de pacotes; o recurso para compensar é substituir o switch por um hub.",
        "A atenuação elimina interferências eletromagnéticas; o recurso para compensar é usar cabos coaxiais."
      ],
      answer: 2,
      feedback: "A ==key==atenuação== é a ==mark==perda gradual de intensidade, potência ou amplitude do sinal== ao longo do meio. Para cabos de cobre, ==key==amplificadores== são utilizados para regenerar o sinal ao longo do trajeto."
    },

    // ── Aula 05 — Topologias e Desempenho ────────────────────

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Uma grande operadora de telecomunicações mantém uma rede de longa distância composta por dezenas de roteadores interconectados por linhas de fibra óptica de alta velocidade. Durante uma tempestade, o cabo que conecta os nós de Brasília e Goiânia foi rompido. Apesar disso, o tráfego entre essas cidades continuou fluindo normalmente, sendo automaticamente redirecionado por São Paulo e Belo Horizonte.",
      question: "Essa característica de resiliência e redirecionamento automático é típica de qual configuração de dispositivos?",
      options: [
        "Topologia em Barramento com cabos de cobre.",
        "Topologia em Estrela centralizada em um único Switch.",
        "Topologia em Malha (Mesh) com roteamento dinâmico.",
        "Conexão Dial-up ponto a ponto temporária.",
        "Rede Ad-hoc sem infraestrutura."
      ],
      answer: 2,
      feedback: "Redes em ==key==topologia malha (Mesh)== possuem ==mark==conexões redundantes== e utilizam ==key==roteamento dinâmico== para encontrar caminhos alternativos automaticamente em caso de falhas."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Durante um evento de transmissão ao vivo de grande audiência, centenas de computadores de uma emissora passaram a enviar dados simultaneamente para o servidor de streaming. O roteador central, incapaz de processar todos os pacotes recebidos, começou a encher seus buffers de memória e a descartar os pacotes excedentes. Os computadores da rede perceberam as perdas e reduziram automaticamente sua taxa de envio.",
      question: "Qual é o nome do fenômeno que levou ao descarte de pacotes nesse cenário?",
      options: [
        "Unicasting Direto.",
        "Roteamento Estático.",
        "Congestionamento.",
        "Modulação de Amplitude.",
        "Conversão de Protocolos."
      ],
      answer: 2,
      feedback: "O ==key==congestionamento== surge quando a ==mark==demanda supera a capacidade de entrega da rede==, resultando em sobrecarga dos buffers e descarte de pacotes."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Uma agência de publicidade reformulou recentemente sua rede local. Na nova configuração, todos os computadores estão conectados individualmente a um hardware central (switch), que encaminha os dados especificamente para o destinatário final. Durante uma semana de trabalho intensa, o cabo de conexão do computador de um designer rompeu-se acidentalmente. O restante da agência continuou operando normalmente, enquanto apenas a máquina do designer ficou sem acesso à rede.",
      question: "Qual topologia está sendo utilizada e qual sua principal vantagem demonstrada nesse incidente?",
      options: [
        "Topologia em Barramento; facilidade de instalação.",
        "Topologia em Estrela; isolamento de falhas.",
        "Topologia em Anel; latência determinística.",
        "Topologia em Malha; redundância de caminhos.",
        "Topologia Ponto a Ponto; simplicidade de design."
      ],
      answer: 1,
      feedback: "Na ==key==topologia estrela== cada dispositivo conecta-se ao switch central de forma ==mark==independente==. Se um cabo falha, ==mark==apenas aquela conexão é afetada==, enquanto o restante da rede continua operando."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Um provedor de backbone global é responsável por garantir a continuidade do tráfego de dados intercontinental mesmo diante de falhas físicas na infraestrutura. Para isso, a rede foi projetada com múltiplas conexões entre os nós, de forma que, se um cabo submarino ou um roteador de grande porte sofrer uma avaria, os pacotes sejam automaticamente redirecionados por rotas alternativas sem interrupção do serviço.",
      question: "Qual topologia e qual funcionalidade técnica são fundamentais para garantir essa resiliência?",
      options: [
        "Topologia em Árvore e alocação estática.",
        "Topologia em Barramento e difusão de sinal.",
        "Topologia em Malha (Mesh) e roteamento dinâmico.",
        "Topologia em Anel e regeneração de sinal.",
        "Topologia Estrela e comutação por hardware."
      ],
      answer: 2,
      feedback: "A ==key==topologia malha (Mesh)== oferece ==mark==conexões redundantes== e o ==key==roteamento dinâmico== permite encontrar novos caminhos em caso de falhas, garantindo alta disponibilidade."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Durante uma transmissão de videoaula ao vivo para alunos de uma universidade federal, os participantes começaram a reportar que a imagem \"congela\" momentaneamente a cada poucos minutos e o áudio fica fora de sincronia com os movimentos do professor. O administrador da rede verificou que a largura de banda disponível era suficiente para a transmissão, mas identificou que o tempo de entrega dos pacotes variava de forma irregular entre cada envio.",
      question: "Esse problema de desempenho, causado pela variação irregular no tempo de entrega dos pacotes, é tecnicamente conhecido como:",
      options: [
        "Throughput (Vazão).",
        "Propagation Delay (Atraso de Propagação).",
        "Jitter (Variação de Atraso).",
        "Multiplexação Estatística.",
        "Retransmissão por Erro."
      ],
      answer: 2,
      feedback: "O ==key==Jitter== é o ==mark==atraso desigual na entrega de pacotes==, o que prejudica a suavidade de aplicações em tempo real como áudio e vídeo mesmo quando a largura de banda é suficiente."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "O engenheiro de redes de uma empresa multinacional precisa decidir como distribuir a capacidade de um link de comunicação entre os diferentes departamentos. Ele opta por um modelo dinâmico que aloca o recurso conforme a demanda real de cada setor — ao contrário de reservar fatias fixas de capacidade para cada departamento, independente do uso efetivo.",
      question: "Qual é o nome dessa técnica e qual o risco associado se a demanda total exceder a capacidade do link?",
      options: [
        "Alocação Estática; risco de desperdício de banda.",
        "Multiplexação Estatística; risco de congestionamento e descarte de pacotes.",
        "Comutação em Estrela; risco de falha no nó central.",
        "Regeneração em Anel; risco de latência determinística.",
        "Padronização IEEE 802.3; risco de incompatibilidade de hardware."
      ],
      answer: 1,
      feedback: "A ==key==Multiplexação Estatística== aloca o canal ==mark==dinamicamente sob demanda==. O risco é o ==mark==congestionamento== quando a demanda supera a capacidade, levando ao descarte de pacotes."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Uma empresa está modernizando toda a sua infraestrutura de rede e adquirindo equipamentos de diferentes fabricantes: switches da marca A, access points da marca B e roteadores da marca C. O gerente técnico exige que todos os componentes adquiridos obedeçam obrigatoriamente aos padrões IEEE 802.3 (Ethernet cabeada) e IEEE 802.11 (Wi-Fi), independentemente do fabricante escolhido.",
      question: "Qual é o objetivo principal dessa exigência no contexto organizacional?",
      options: [
        "Garantir que a rede opere apenas com cabos de cobre.",
        "Permitir a criação de modelos teóricos proprietários.",
        "Garantir a compatibilidade e interoperabilidade entre dispositivos de diferentes fabricantes.",
        "Aumentar o atraso de propagação para evitar erros.",
        "Eliminar a necessidade de protocolos de software."
      ],
      answer: 2,
      feedback: "Órgãos como o ==key==IEEE== garantem que interfaces e protocolos sejam ==mark==universais e padronizados==, permitindo que produtos de ==mark==marcas distintas funcionem juntos== (interoperabilidade)."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Durante um período de pico de acessos em uma empresa de e-commerce (como uma Black Friday), o roteador central passou a receber um volume de pacotes muito superior à sua capacidade de processamento. Os buffers de memória do equipamento ficaram completamente cheios, forçando o descarte dos pacotes que continuavam chegando. Os servidores e computadores da rede, ao perceberem as perdas, reduziram automaticamente a taxa de envio de dados.",
      question: "Esse cenário descreve um problema de:",
      options: [
        "Baixa Amplitude de Pico.",
        "Congestionamento (Sobrecarga).",
        "Falha na Padronização ISO.",
        "Erro de Fase na Onda Seno.",
        "Incompatibilidade de Gateway."
      ],
      answer: 1,
      feedback: "O ==key==congestionamento== ocorre quando o ==mark==volume de tráfego supera a capacidade de entrega==, levando ao preenchimento dos buffers e descarte de pacotes."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Um laboratório universitário de pesquisa em redes utiliza uma topologia legada onde todas as máquinas são conectadas por meio de um único cabo coaxial que percorre toda a sala em linha reta. Durante um experimento, um aluno acidentalmente cortou o cabo central ao reposicioná-lo na bancada.",
      question: "Qual foi a consequência imediata para a rede após o corte do cabo?",
      options: [
        "Apenas as máquinas antes do corte continuaram funcionando.",
        "A rede continuou operando normalmente via rádio.",
        "Ocorreu a interrupção total da comunicação em toda a rede.",
        "A rede automaticamente mudou para uma topologia em anel.",
        "A velocidade da rede dobrou devido à diminuição do tamanho do cabo."
      ],
      answer: 2,
      feedback: "Na ==key==topologia barramento==, um rompimento no ==mark==cabo central (backbone) resulta na falha total da rede==, pois todas as máquinas dependem desse único meio compartilhado."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Uma rede de sensores industriais opera em um ambiente com muitos motores elétricos que geram intenso ruído eletromagnético. Para garantir a integridade dos dados, o sistema utiliza códigos redundantes que permitem identificar quando um bit foi corrompido durante a transmissão. Ao detectar um erro, o sistema solicita que o transmissor reenvie o pacote comprometido.",
      question: "Quais são as duas métricas de confiabilidade aplicadas nesse sistema?",
      options: [
        "Amplitude e Frequência.",
        "Detecção de Erros e Retransmissão.",
        "Sincronização e Jitter.",
        "Unicasting e Multicasting.",
        "Vazão e Throughput."
      ],
      answer: 1,
      feedback: "O uso de códigos redundantes para localizar falhas é a ==key==detecção de erros==, e o pedido de novo envio do pacote corrompido é a ==key==retransmissão== — dois mecanismos fundamentais de confiabilidade."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Uma empresa de tecnologia conectou seus escritórios em São Paulo e em Lisboa por meio de um cabo de fibra óptica submarino. A distância entre os dois pontos é de aproximadamente 5.000 km, e a velocidade de propagação da luz dentro da fibra é de aproximadamente 200.000 km/s.",
      question: "Qual seria o tempo mínimo para que um sinal chegue ao destino e como isso afeta aplicações de tempo real?",
      options: [
        "25 microssegundos; não afeta o tempo real.",
        "25 milissegundos; pode causar atrasos perceptíveis em voz e jogos.",
        "250 milissegundos; inviabiliza qualquer comunicação digital.",
        "2,5 segundos; requer o uso obrigatório de satélites.",
        "Zero segundos; a luz na fibra é instantânea."
      ],
      answer: 1,
      feedback: "Cálculo: 5.000 ÷ 200.000 = ==key==0,025s = 25ms==. O ==key==atraso de propagação== é o tempo para o sinal percorrer o meio físico e é crítico para ==mark==aplicações em tempo real como voz e jogos==."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "O departamento de TI de uma universidade avalia qual topologia adotar para a rede de um novo bloco acadêmico. A equipe analisa uma configuração em que os dispositivos são conectados em cascata, formando uma estrutura hierárquica onde switches de andar se conectam a um switch central, criando níveis organizados por departamentos e setores.",
      question: "Essa organização hierárquica em níveis de switches, derivada da topologia em estrela, é denominada:",
      options: [
        "Topologia em Anel com token de controle.",
        "Topologia em Barramento compartilhado.",
        "Topologia em Árvore (cascata hierárquica).",
        "Topologia em Malha com caminhos redundantes.",
        "Topologia Ponto a Ponto unicast."
      ],
      answer: 2,
      feedback: "A ==key==topologia árvore== é uma estrutura ==mark==hierárquica baseada na estrela==, onde switches são conectados em níveis (cascata), facilitando o gerenciamento e a segmentação da rede por setores."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Em uma fábrica de semicondutores, a rede de controle de qualidade utiliza uma topologia em anel onde os dados percorrem os nós em sequência. O técnico de TI observa que cada nó da rede não apenas recebe a informação, mas também a regenera e retransmite para o próximo dispositivo do circuito, garantindo a integridade do sinal ao longo de todo o trajeto.",
      question: "Qual é a característica da topologia em anel que torna cada nó um elemento ativo na manutenção do sinal e qual mecanismo essa topologia utiliza para controlar o acesso ao meio?",
      options: [
        "Cada nó armazena os dados em cache; o controle é feito por endereços IP estáticos.",
        "Cada nó atua como repetidor do sinal; o controle de acesso é feito por token.",
        "Cada nó comprime os dados antes de repassar; o controle é por broadcast contínuo.",
        "Cada nó seleciona o melhor caminho; o controle é por algoritmo de roteamento dinâmico.",
        "Cada nó verifica erros e descarta pacotes corrompidos; o controle é por colisão CSMA/CD."
      ],
      answer: 1,
      feedback: "Na ==key==topologia anel==, cada nó atua como ==mark==repetidor do sinal==, e o controle de acesso ao meio é feito por ==key==token== — mecanismo que garante ==mark==latência previsível (determinística)==."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Um gerente de TI precisa apresentar ao conselho administrativo de uma empresa os fatores que devem guiar a escolha da topologia de rede para o novo data center. Ele lista três dimensões que são diretamente impactadas pela topologia escolhida: a facilidade de expansão futura, os custos com cabos e equipamentos, e a capacidade de manter o funcionamento mesmo diante de falhas em componentes individuais.",
      question: "Segundo o resumo, quais são os três impactos diretos da escolha da topologia de rede?",
      options: [
        "Velocidade de transmissão, tipo de protocolo e custo do servidor.",
        "Escalabilidade, custo e tolerância a falhas.",
        "Segurança, criptografia e endereçamento IP.",
        "Latência, jitter e largura de banda disponível.",
        "Tipo de cabeamento, frequência de rádio e número de usuários simultâneos."
      ],
      answer: 1,
      feedback: "Os três impactos diretos da escolha de topologia são: ==key==escalabilidade== (facilidade de crescimento), ==key==custo== (cabos e equipamentos) e ==key==tolerância a falhas== (capacidade de continuar funcionando)."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Uma empresa de streaming de vídeo percebe que, durante horários de pico, usuários relatam travamentos e lentidão na reprodução, mesmo tendo contratado planos de internet de alta velocidade. O administrador de rede investiga e descobre que o volume real de dados efetivamente entregues aos clientes por segundo é significativamente menor do que a capacidade teórica contratada pela empresa junto ao provedor.",
      question: "A métrica que representa a quantidade real de dados transmitidos com sucesso por unidade de tempo, diferente da capacidade máxima teórica do link, é denominada:",
      options: [
        "Jitter (variação de atraso entre pacotes).",
        "Throughput ou Vazão.",
        "Atraso de Propagação no meio físico.",
        "Multiplexação Estatística do canal.",
        "QoS (Qualidade de Serviço) priorizada."
      ],
      answer: 1,
      feedback: "O ==key==Throughput (Vazão)== é a ==mark==quantidade real de dados transmitidos com sucesso por unidade de tempo==, sempre menor ou igual à capacidade teórica do link por fatores como congestionamento e erros."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Uma startup de jogos online recebe reclamações de usuários que experimentam atrasos imprevisíveis e irregulares durante as partidas, mesmo quando a largura de banda disponível é suficiente. O desenvolvedor analisa os logs e verifica que os pacotes de atualização do jogo chegam em intervalos de tempo completamente irregulares: ora com 10ms de atraso, ora com 80ms, sem padrão definido.",
      question: "Esse problema, onde o atraso na entrega de pacotes varia de forma irregular e imprevisível, é crítico para aplicações em tempo real e recebe o nome técnico de:",
      options: [
        "Throughput baixo (vazão insuficiente).",
        "Atraso de processamento nos roteadores.",
        "Jitter (variação do atraso).",
        "Congestionamento por buffers cheios.",
        "Perda de pacotes por retransmissão."
      ],
      answer: 2,
      feedback: "O ==key==Jitter== é a ==mark==variação no tempo de atraso (latência) na chegada de pacotes==, medido em milissegundos. Aplicações como jogos, voz e vídeo são especialmente sensíveis pois precisam de entrega consistente."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Um analista de redes precisa escolher entre dois modelos de distribuição de largura de banda para o link corporativo. Na primeira opção, cada departamento recebe uma fatia fixa e exclusiva da capacidade, independentemente de usá-la ou não. Na segunda opção, a capacidade total é dividida dinamicamente conforme a demanda real de cada setor a cada momento, evitando que recursos fiquem ociosos.",
      question: "A segunda opção descrita, que aloca o canal dinamicamente sob demanda para evitar desperdício de banda, é chamada de:",
      options: [
        "Alocação Estática com fatias fixas por departamento.",
        "Roteamento Dinâmico com tabelas de prioridade.",
        "Multiplexação Estatística com uso sob demanda.",
        "QoS com priorização de tráfego de voz.",
        "VLAN com segmentação lógica do tráfego."
      ],
      answer: 2,
      feedback: "A ==key==Multiplexação Estatística== aloca o canal sob ==mark==demanda real==, evitando o desperdício de banda da alocação estática onde fatias ficam ociosas quando não utilizadas."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Em uma rede corporativa, a equipe de infraestrutura precisa garantir que as ligações telefônicas via VoIP e as videoconferências tenham prioridade sobre o tráfego de downloads e backups automáticos, mesmo compartilhando o mesmo link físico. Para isso, configuram mecanismos nos roteadores que identificam o tipo de tráfego e ajustam dinamicamente a ordem e a velocidade de entrega dos pacotes.",
      question: "Esse conjunto de mecanismos que prioriza determinados tipos de tráfego para garantir melhor desempenho em aplicações sensíveis a atraso é denominado:",
      options: [
        "Detecção e Correção de Erros (FEC).",
        "Qualidade de Serviço (QoS).",
        "Topologia em Malha com roteamento dinâmico.",
        "Padronização IEEE 802.11 para redes sem fio.",
        "Multiplexação Estatística com fatias fixas."
      ],
      answer: 1,
      feedback: "A ==key==QoS (Qualidade de Serviço)== define mecanismos que ==mark==priorizam determinados tipos de tráfego==. VoIP e vídeo precisam de ==mark==baixa latência==, enquanto downloads precisam de alta vazão."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Uma empresa de logística utiliza uma topologia em anel em sua rede de controle de veículos. O gerente de TI avalia migrar para outra topologia que ofereça maior previsibilidade no tempo de entrega dos dados, pois o sistema atual já oferece latência determinística — uma característica crítica para o controle em tempo real dos veículos autônomos da frota.",
      question: "Qual característica da topologia em anel, segundo o resumo, torna-a especialmente indicada para sistemas que precisam de tempo real?",
      options: [
        "Redundância de caminhos e roteamento dinâmico entre nós.",
        "Transmissão em broadcast para todos os nós simultaneamente.",
        "Latência previsível (determinística) garantida pelo mecanismo de token.",
        "Isolamento de falhas independente em cada dispositivo conectado.",
        "Hierarquia de switches em cascata para segmentação por setores."
      ],
      answer: 2,
      feedback: "A ==key==topologia anel== utiliza ==key==token== para controle de acesso e oferece ==mark==latência previsível (determinística)==, sendo ideal para sistemas de tempo real onde cada nó sabe exatamente quando terá vez de transmitir."
    },

    {
      aula: "Aula 05 — Topologias e Desempenho",
      tipo: "Contextualizada",
      texto: "Uma empresa de telecomunicações precisa interligar dois data centers localizados em cidades diferentes, garantindo uma conexão dedicada e exclusiva entre eles. O projeto exige que toda a capacidade do link seja utilizada apenas para a comunicação entre esses dois pontos, sem compartilhamento com outros dispositivos ou nós intermediários.",
      question: "Essa configuração, onde há uma conexão direta e exclusiva entre dois dispositivos apenas, corresponde a qual topologia de rede?",
      options: [
        "Topologia em Estrela, pois há um nó central gerenciando a conexão.",
        "Topologia em Barramento, pois o cabo é compartilhado entre os dois pontos.",
        "Topologia Ponto a Ponto, pois a comunicação é exclusiva entre dois dispositivos.",
        "Topologia em Malha, pois existem múltiplos caminhos redundantes.",
        "Topologia em Árvore, pois há hierarquia entre os dois data centers."
      ],
      answer: 2,
      feedback: "A ==key==topologia ponto a ponto== estabelece uma ==mark==conexão direta e exclusiva (unicast) entre dois dispositivos apenas==, sem compartilhamento. É a base para conexões WAN entre cidades."
    },

    // ── Aula 06 — Comunicação de Dados e Sinais ──────────────

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Dois computadores em uma sala de servidores estão conectados por um cabo de fibra óptica em perfeito estado físico. Apesar disso, eles não conseguem trocar informações: um utiliza um sistema operacional configurado em russo com padrões de estruturação de dados proprietários, e o outro opera com um sistema em português seguindo padrões completamente distintos. Não existe um \"idioma\" comum para a troca de mensagens entre as máquinas.",
      question: "De acordo com os fundamentos da comunicação, qual componente está ausente nesse cenário?",
      options: [
        "Emissor.",
        "Meio de Transmissão.",
        "Protocolo.",
        "Mensagem.",
        "Receptor."
      ],
      answer: 2,
      feedback: "O ==key==protocolo== é o conjunto de regras que governa a comunicação. Sem ele, dispositivos conectados fisicamente ==mark==não conseguem se comunicar==, assim como dois humanos que falam idiomas diferentes."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Um sistema hospitalar de monitoramento cardíaco transmite os dados de batimentos em tempo real para o tablet do médico plantonista. Durante uma falha momentânea na rede, os pacotes ficaram armazenados em um buffer e chegaram ao destino com atraso de um minuto. Embora os dados fossem tecnicamente corretos e chegassem ao destinatário certo, o médico não pôde utilizá-los para tomar uma decisão de emergência.",
      question: "Qual característica fundamental de desempenho da comunicação foi violada nesse cenário?",
      options: [
        "Entrega (Delivery).",
        "Precisão (Accuracy).",
        "Sincronização (Timeliness).",
        "Modulação de Amplitude.",
        "Fase da Onda."
      ],
      answer: 2,
      feedback: "A ==key==Sincronização (Timeliness)== exige que os dados sejam entregues em ==mark==instantes de tempo adequados==. Dados tardios são inúteis em aplicações de tempo real — dados corretos mas com 1 minuto de atraso não servem para emergências médicas."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Em um estúdio de gravação musical, um microfone capta a voz de uma cantora. O sinal elétrico gerado pelo microfone varia de forma contínua ao longo do tempo, assumindo valores de intensidade que podem ser qualquer número real dentro de um determinado intervalo — não existe um conjunto finito de valores possíveis para esse sinal.",
      question: "Esse tipo de sinal, que varia continuamente e assume infinitos valores possíveis, é classificado como:",
      options: [
        "Sinal Digital.",
        "Sinal Analógico.",
        "Sinal Binário Não Periódico.",
        "Pulso de Tensão Discreto.",
        "Protocolo de Dados."
      ],
      answer: 1,
      feedback: "==key==Sinais analógicos== são ==mark==contínuos e possuem infinitos valores== em sua trajetória. A voz humana captada por microfone é o exemplo clássico de sinal analógico."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Em um ambiente hospitalar com tomógrafos, aparelhos de ressonância magnética e outros equipamentos de alto consumo energético, os campos eletromagnéticos gerados são intensos. A equipe de TI precisa decidir qual tipo de sinal utilizar para transmitir dados médicos críticos por toda a instalação, garantindo que ruídos do ambiente não comprometam a integridade das informações.",
      question: "Qual a principal vantagem técnica dos sinais digitais em relação aos analógicos nesse cenário específico?",
      options: [
        "Sinais digitais possuem infinitos níveis de intensidade.",
        "Sinais digitais são mais fáceis de ouvir pelo ouvido humano.",
        "Sinais digitais são menos suscetíveis a ruídos e permitem uma reconstrução mais fiel.",
        "Sinais digitais exigem cabos de cobre mais grossos.",
        "Sinais digitais nunca variam no tempo."
      ],
      answer: 2,
      feedback: "==key==Sinais digitais== são ==mark==discretos (apenas 0 ou 1)== e muito menos sensíveis a interferências, facilitando a ==mark==recuperação fiel da informação original== mesmo em ambientes com intenso ruído eletromagnético."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Um técnico de telecomunicações analisa um transmissor de rádio AM utilizado em uma estação. Ao medir o sinal portador, ele registra que a onda seno completa exatamente 1.000 ciclos idênticos em um segundo de observação.",
      question: "De acordo com os atributos de sinais analógicos periódicos, quais são o Período (T) e a Frequência (f) dessa onda?",
      options: [
        "T = 1s; f = 1.000 Hz.",
        "T = 0,001s; f = 1.000 Hz.",
        "T = 1.000s; f = 1 Hz.",
        "T = 0,1s; f = 10 Hz.",
        "T = 1.000 Hz; f = 0,001s."
      ],
      answer: 1,
      feedback: "A ==key==frequência (f)== é o número de ciclos por segundo: ==mark==f = 1.000 Hz==. O ==key==período (T)== é o inverso da frequência: ==mark==T = 1/1000 = 0,001s==."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Uma equipe de engenharia monitora a qualidade de uma transmissão de rádio entre dois postos avançados separados por longa distância. Com o aumento da distância, os técnicos observam que a \"força\" do sinal recebido diminui progressivamente, embora a frequência da onda permaneça constante. Esse enfraquecimento está diretamente relacionado à perda de energia ao longo do percurso.",
      question: "Qual atributo da onda seno está sendo afetado pela perda de energia durante a propagação?",
      options: [
        "Fase.",
        "Período.",
        "Amplitude de Pico.",
        "Frequência.",
        "Jitter."
      ],
      answer: 2,
      feedback: "A ==key==Amplitude de Pico== é o valor absoluto da intensidade máxima do sinal, diretamente ==mark==proporcional à energia transportada== pela onda. É ela que diminui com a distância (atenuação)."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Um técnico em eletrônica analisa dois sinais distintos em seu osciloscópio. O primeiro, proveniente de um sensor de temperatura industrial, exibe um padrão de onda que se repete identicamente a cada 5 segundos. O segundo, capturado de uma linha de comunicação de chat entre usuários, apresenta formas de onda completamente irregulares, sem qualquer repetição previsível ao longo do tempo.",
      question: "Como são classificados esses dois tipos de sinais, respectivamente?",
      options: [
        "Analógico e Digital.",
        "Periódico e Não Periódico.",
        "Simplex e Full-duplex.",
        "Sincronizado e Com Jitter.",
        "Hertz e Volts."
      ],
      answer: 1,
      feedback: "==key==Sinais periódicos== repetem um ciclo em um intervalo determinado (sensor de temperatura). ==key==Sinais não periódicos== mudam ==mark==sem padrão repetitivo== (comunicação de chat)."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Em um laboratório de comunicações, um professor demonstra dois geradores de onda seno com a mesma frequência. O primeiro gerador inicia seu ciclo exatamente no instante zero, atingindo imediatamente o valor máximo. O segundo gerador, porém, começa a produzir o mesmo padrão de onda apenas um quarto de período após o primeiro, ou seja, existe um deslocamento temporal entre as duas ondas.",
      question: "Qual atributo descreve essa diferença entre as duas ondas e qual o valor aproximado em graus para o deslocamento do segundo gerador?",
      options: [
        "Amplitude; 90 graus.",
        "Frequência; 45 graus.",
        "Fase; 90 graus.",
        "Período; 180 graus.",
        "Jitter; 0 graus."
      ],
      answer: 2,
      feedback: "A ==key==Fase== descreve a posição da onda em relação ao tempo zero. Um deslocamento de ==mark==1/4 de período equivale a 90 graus== (360° ÷ 4 = 90°)."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "O sistema de transferência eletrônica de um banco processa milhares de transações por segundo. Durante uma análise, descobriu-se que ruído na fiação interna do data center estava corrompendo bits durante a transmissão — um bit '0' estava sendo recebido como '1' em alguns pacotes, alterando valores monetários das transações. O banco exige que todos os dados cheguem com Precisão (Accuracy) absoluta.",
      question: "De acordo com as características fundamentais da comunicação, o que o sistema deve fazer ao detectar um bit corrompido?",
      options: [
        "Aceitar o dado para não gerar atraso (Jitter).",
        "Ignorar o erro, pois a entrega (Delivery) foi feita ao destinatário correto.",
        "Detectar a alteração e, se possível, corrigir o dado ou solicitar retransmissão, pois dados alterados são inúteis.",
        "Mudar a frequência da transmissão para sinais analógicos periódicos.",
        "Aumentar a fase do sinal em 180 graus para anular o ruído."
      ],
      answer: 2,
      feedback: "A ==key==Precisão (Accuracy)== exige que o sistema entregue dados ==mark==com exatidão==. Dados alterados e não corrigidos perdem sua utilidade — o sistema deve detectar e ==mark==corrigir ou solicitar retransmissão==."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Durante uma aula de redes, o professor utiliza a seguinte analogia para explicar os componentes da comunicação de dados: dois diplomatas de países diferentes precisam negociar um acordo importante por telefone. O aparelho telefônico e os fios que o conectam funcionam perfeitamente. No entanto, a negociação é impossível porque os dois diplomatas falam idiomas completamente diferentes e não chegam a um acordo sobre qual língua usar na conversa.",
      question: "Nessa analogia pedagógica, o hardware (telefone e fios) e o idioma representam, respectivamente, quais elementos da comunicação de dados?",
      options: [
        "Mensagem e Meio.",
        "Emissor e Receptor.",
        "Meio de Transmissão e Protocolo.",
        "Jitter e Precisão.",
        "Sinal Analógico e Sinal Digital."
      ],
      answer: 2,
      feedback: "O ==key==meio de transmissão== (telefone e fios) provê o caminho físico, e o ==key==protocolo== (idioma) provê as ==mark==regras e a inteligência da troca de informações==."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Um engenheiro de áudio analisa o sinal captado por um microfone durante uma gravação. Ele observa no osciloscópio que o sinal apresenta uma forma de onda senoidal perfeita que se repete com exatidão a cada 0,002 segundos desde o início da medição. O engenheiro precisa calcular a frequência desse sinal para ajustar o equalizador corretamente.",
      question: "Com base no período de 0,002 segundos observado, qual é a frequência desse sinal e o que representa cada um desses atributos em uma onda periódica?",
      options: [
        "f = 2 Hz; o período é o número de ciclos por segundo e a frequência é o tempo de um ciclo.",
        "f = 500 Hz; o período é o tempo de duração de um ciclo completo e a frequência é o número de ciclos por segundo.",
        "f = 0,002 Hz; o período é a amplitude máxima e a frequência é o deslocamento temporal.",
        "f = 200 Hz; o período é a fase da onda e a frequência é a amplitude de pico.",
        "f = 50 Hz; o período é a energia do sinal e a frequência é a velocidade de propagação."
      ],
      answer: 1,
      feedback: "Fórmula: ==key==f = 1/T==. Com T = 0,002s → ==mark==f = 1/0,002 = 500 Hz==. O ==key==período== é o tempo de um ciclo completo; a ==key==frequência== indica quantos ciclos ocorrem por segundo."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Durante um processo de digitalização de acervo fotográfico histórico em um museu, o técnico de informática explica ao curador que cada imagem é representada computacionalmente como uma grade organizada de elementos individuais, onde cada elemento armazena um valor numérico binário que define a tonalidade e a cor daquele ponto específico da imagem.",
      question: "O elemento individual descrito — a menor unidade de uma imagem digital — é chamado de:",
      options: [
        "Bit, pois representa o valor binário 0 ou 1 de cor.",
        "Frame, pois é a unidade de uma sequência de vídeo.",
        "Pixel, pois é a menor unidade que compõe a grade da imagem.",
        "Amostra, pois representa o valor do sinal em um instante.",
        "Byte, pois agrupa 8 bits de informação de cor."
      ],
      answer: 2,
      feedback: "O ==key==pixel== é a menor unidade que compõe a grade de uma imagem digital. Cada pixel armazena um ==mark==valor binário de cor== que pode ser monocromático (1 bit) ou colorido (sistema RGB)."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Uma produtora de conteúdo digital discute com seu time técnico o padrão de gravação de vídeo para uma série de documentários. O diretor questiona a diferença prática entre gravar em 24 FPS (usado no cinema) e 60 FPS (usado em transmissões de alta fluidez). O técnico explica que essa escolha afeta diretamente a percepção de movimento e o volume de dados gerado.",
      question: "O que representa a taxa de quadros (FPS — Frames Per Second) na representação digital de vídeo?",
      options: [
        "A quantidade de bits por pixel que define a profundidade de cor da imagem.",
        "O número de amostras de áudio capturadas por segundo durante a gravação.",
        "O número de imagens (frames) exibidas por segundo, que determina a fluidez do movimento.",
        "A resolução horizontal em pixels de cada quadro individual do vídeo.",
        "O tamanho em megabytes de cada arquivo de imagem gerado pela câmera."
      ],
      answer: 2,
      feedback: "A ==key==taxa de quadros (FPS)== determina quantas ==mark==imagens (frames) são exibidas por segundo==, definindo a fluidez do movimento. 24 FPS é padrão cinema; 60 FPS proporciona alta fluidez."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Em um estúdio de radiodifusão, o engenheiro de som precisa converter a voz dos locutores, captada pelo microfone como um sinal elétrico contínuo, em dados digitais que possam ser processados, armazenados e transmitidos pelos sistemas de broadcast digital. O processo envolve capturar o valor do sinal em instantes regulares de tempo para criar uma representação numérica do áudio.",
      question: "O processo de capturar o valor de um sinal analógico contínuo em instantes regulares de tempo para convertê-lo em representação digital é denominado:",
      options: [
        "Modulação — processo de inserir dados em uma onda portadora.",
        "Codificação ASCII — conversão de caracteres em padrões binários.",
        "Amostragem — captura do valor do sinal em instantes regulares.",
        "Digitalização RGB — conversão de cores em valores de 8 bits.",
        "Multiplexação — compartilhamento do canal entre múltiplos sinais."
      ],
      answer: 2,
      feedback: "A ==key==amostragem== é o processo de capturar o ==mark==valor do sinal em instantes regulares de tempo==, permitindo a reconstrução do sinal analógico original a partir de uma representação digital."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Uma equipe de desenvolvimento de um sistema de comunicação para dispositivos IoT precisa representar diferentes tipos de dados — textos de configuração, imagens de câmeras e medições de sensores — em um único formato que todos os componentes do sistema possam processar de forma uniforme. O arquiteto do sistema propõe que todos os dados sejam convertidos para o mesmo formato fundamental antes de serem transmitidos.",
      question: "Qual é o formato fundamental para o qual todos os tipos de dados (texto, imagem, áudio, vídeo) são convertidos para serem transmitidos e processados digitalmente?",
      options: [
        "Formato ASCII de 7 bits, pois suporta todos os caracteres necessários.",
        "Formato RGB de 24 bits, pois representa qualquer cor com precisão.",
        "Bits (0 e 1), pois toda informação digital é reduzida a dois estados.",
        "Formato Unicode de 32 bits, pois abrange todos os idiomas do mundo.",
        "Formato hexadecimal, pois é mais compacto que o binário puro."
      ],
      answer: 2,
      feedback: "Na comunicação de dados, toda informação é convertida em ==key==bits (0 e 1)==, o que permite que diferentes tipos de dados (texto, imagem, áudio, vídeo) sejam ==mark==transmitidos no mesmo sistema digital==."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Durante uma transmissão de dados em uma linha de comunicação industrial, o técnico observa que o sinal recebido apresenta distorções que não estavam presentes no sinal original enviado. Ao analisar o problema, ele identifica três categorias distintas de problemas: em uma delas, o sinal perde energia progressivamente ao longo do cabo; em outra, diferentes frequências do sinal chegam em momentos diferentes, alterando sua forma; e na terceira, interferências externas acrescentam variações indesejadas ao sinal.",
      question: "Como são denominados, respectivamente, esses três problemas de transmissão: perda de energia, chegada em tempos diferentes das frequências e interferência externa?",
      options: [
        "Jitter, Multiplexação e Crosstalk.",
        "Atenuação, Distorção e Ruído.",
        "SNR, Amplificação e Modulação.",
        "Throughput, Latência e Congestionamento.",
        "Codificação, Decodificação e Compressão."
      ],
      answer: 1,
      feedback: "As três principais deficiências na transmissão são: ==key==Atenuação== (perda de energia, compensada com amplificadores), ==key==Distorção== (frequências chegando em tempos diferentes) e ==key==Ruído== (interferência externa ao sinal)."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Um engenheiro de telecomunicações analisa dois canais de comunicação distintos. No primeiro canal, o sinal útil é muito mais intenso do que os ruídos presentes, resultando em transmissões claras e confiáveis. No segundo canal, a intensidade do ruído se aproxima da intensidade do sinal útil, tornando a comunicação degradada e propensa a erros de interpretação dos bits.",
      question: "A métrica que expressa a relação entre a intensidade do sinal útil e a intensidade do ruído presente no canal de comunicação, determinando a qualidade da transmissão, é denominada:",
      options: [
        "Throughput — quantidade de dados transmitidos por segundo.",
        "Jitter — variação no tempo de chegada dos pacotes.",
        "SNR (Signal-to-Noise Ratio) — Relação Sinal-Ruído.",
        "Latência — tempo total de entrega de um pacote ao destino.",
        "Frequência — número de ciclos do sinal por segundo."
      ],
      answer: 2,
      feedback: "A ==key==SNR (Signal-to-Noise Ratio)== define a qualidade da comunicação. ==mark==SNR alta== indica boa qualidade (sinal muito mais forte que o ruído). ==mark==SNR baixa== indica qualidade ruim (ruído próximo ao sinal)."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Uma equipe de TI analisa os sistemas de comunicação de três dispositivos distintos em uma fábrica: (1) um sensor de temperatura que apenas envia leituras para o servidor central, sem nunca receber dados; (2) um rádio walkie-talkie, onde o operador precisa apertar um botão para falar e só pode ouvir quando para de falar; (3) um telefone IP, onde dois funcionários conversam simultaneamente sem interrupções.",
      question: "Qual é a classificação correta do fluxo de dados de cada um dos três dispositivos, respectivamente?",
      options: [
        "Full-Duplex, Simplex e Half-Duplex.",
        "Simplex, Half-Duplex e Full-Duplex.",
        "Half-Duplex, Full-Duplex e Simplex.",
        "Simplex, Full-Duplex e Half-Duplex.",
        "Half-Duplex, Simplex e Full-Duplex."
      ],
      answer: 1,
      feedback: "==key==Simplex== → uma única direção (sensor apenas envia). ==key==Half-Duplex== → duas direções, mas não simultâneas (walkie-talkie). ==key==Full-Duplex== → duas direções simultâneas (telefone IP)."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Um desenvolvedor de software precisa escolher um padrão de codificação para um sistema de mensagens que será utilizado em 47 países diferentes, suportando caracteres do alfabeto latino, cirílico, árabe, chinês e japonês. Ele analisa dois padrões disponíveis: o primeiro suporta apenas 128 símbolos com 7 bits, enquanto o segundo utiliza até 32 bits e abrange praticamente todos os idiomas e símbolos do mundo.",
      question: "Qual padrão de codificação atende ao requisito multilíngue do sistema e por quê o primeiro padrão seria insuficiente?",
      options: [
        "ASCII, pois 128 símbolos são suficientes para qualquer idioma.",
        "RGB, pois codifica caracteres por valores de cor em 24 bits.",
        "Unicode, pois suporta praticamente todos os idiomas com até 32 bits, enquanto o ASCII com 7 bits só cobre 128 símbolos.",
        "Binário puro, pois converte qualquer caractere diretamente para 0 e 1.",
        "SNR, pois define a qualidade da transmissão em múltiplos idiomas."
      ],
      answer: 2,
      feedback: "O ==key==ASCII== usa 7 bits e representa apenas ==mark==128 símbolos (suficiente apenas para o inglês básico)==. O ==key==Unicode== utiliza até 32 bits e abrange ==mark==praticamente todos os idiomas e símbolos do mundo==."
    },

    {
      aula: "Aula 06 — Comunicação de Dados e Sinais",
      tipo: "Contextualizada",
      texto: "Em um sistema de transmissão de dados de alta velocidade, um engenheiro observa que o sinal recebido apresenta uma forma diferente do sinal original enviado, mesmo sem perda de energia e sem interferências externas identificáveis. Após análise, ele descobre que o cabo utilizado transporta diferentes frequências do sinal em velocidades ligeiramente distintas, fazendo com que componentes do sinal cheguem ao destino em momentos diferentes e se recombinem de forma distorcida.",
      question: "Esse problema de transmissão, onde a forma do sinal é alterada porque diferentes frequências chegam em momentos distintos, é classificado como:",
      options: [
        "Atenuação, pois o sinal perdeu energia ao longo do cabo.",
        "Ruído de impulso, pois interferências externas corromperam os bits.",
        "Distorção, pois frequências do sinal chegam em tempos diferentes alterando sua forma.",
        "Crosstalk, pois sinais de cabos vizinhos se misturaram ao sinal original.",
        "Jitter, pois os pacotes chegaram com variação no tempo de entrega."
      ],
      answer: 2,
      feedback: "A ==key==Distorção== ocorre quando ==mark==frequências do sinal chegam em tempos diferentes==, alterando a forma do sinal. Difere da atenuação (perda de energia) e do ruído (interferência externa)."
    },

  ],

  // ── Questões de AVA ───────────────────────────────────────

  ava: [

    {
      aula: "Redes de Computadores I",
      tipo: "Contextualizada",
      texto: "Em um sistema de comunicação de dados, diversas entidades participam do processo de transmissão da informação entre dispositivos conectados em rede. Esse processo envolve componentes responsáveis por enviar, transportar e receber os dados, além de regras que definem como a comunicação deve ocorrer.",
      question: "Considerando os elementos fundamentais de um sistema de comunicação de dados, assinale a alternativa que apresenta corretamente o componente responsável por definir as regras da comunicação entre os dispositivos na rede.",
      options: [
        "Protocolo.",
        "Receptor.",
        "Mensagem.",
        "Meio de transmissão."
      ],
      answer: 0,
      feedback: "O ==key==protocolo== é o componente responsável por definir as ==mark==regras que governam a comunicação== entre dispositivos, incluindo formato, sincronização, sequenciamento e controle de erros. Os demais — receptor, mensagem e meio — têm papéis distintos na comunicação."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Contextualizada",
      texto: "O crescimento da Internet ao longo das últimas décadas provocou um aumento significativo na quantidade de dispositivos conectados à rede. Esse crescimento evidenciou limitações do protocolo IPv4, principalmente relacionadas ao número de endereços disponíveis para identificação dos dispositivos na Internet. Como resposta a esse problema, foi desenvolvido o IPv6, que amplia significativamente o espaço de endereçamento.",
      question: "Considerando as diferenças entre os protocolos IPv4 e IPv6 no que se refere ao tamanho do espaço de endereçamento, assinale a alternativa correta.",
      options: [
        "O IPv4 utiliza endereços de 64 bits, enquanto o IPv6 utiliza endereços de 32 bits.",
        "O IPv4 utiliza endereços de 128 bits, enquanto o IPv6 utiliza endereços de 64 bits.",
        "O IPv4 utiliza endereços de 32 bits, enquanto o IPv6 utiliza endereços de 128 bits.",
        "O IPv4 e o IPv6 utilizam endereços de 64 bits, diferenciando-se apenas na forma de codificação."
      ],
      answer: 2,
      feedback: "O ==key==IPv4== usa endereços de ==mark==32 bits== (~4,3 bilhões de endereços). O ==key==IPv6== foi desenvolvido com ==mark==128 bits==, gerando um espaço de endereçamento vastamente superior (~3,4 × 10³⁸ endereços), resolvendo o esgotamento."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Contextualizada",
      texto: "Uma organização utiliza uma rede em que diversos computadores acessam serviços centralizados, como banco de dados, armazenamento de arquivos e aplicações corporativas hospedadas em servidores dedicados. Nesse modelo, os dispositivos dos usuários solicitam serviços e os servidores processam e respondem às requisições.",
      question: "Esse modelo de organização da rede é denominado",
      options: [
        "rede híbrida.",
        "rede distribuída.",
        "arquitetura cliente-servidor.",
        "arquitetura ponto a ponto (P2P)."
      ],
      answer: 2,
      feedback: "Na ==key==arquitetura cliente-servidor==, há uma separação clara de papéis: ==mark==clientes solicitam recursos== e ==mark==servidores dedicados processam e respondem== de forma centralizada. Difere do P2P onde todos os nós têm papéis equivalentes."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Asserção",
      texto: "Uma rede é um conjunto de dispositivos conectados. A existência de vários dispositivos, gera um problema relacionado a como conectá-los para tornar possível a comunicação um a um. Uma solução seria criar uma conexão ponto a ponto entre todos os pares possíveis de dispositivos (uma topologia de malha) ou entre um dispositivo central e todos os demais dispositivos (uma topologia estrela). Esses métodos, entretanto, não são práticos e há um desperdício quando aplicado a redes muito grandes. O número e o comprimento dos links exigem uma infraestrutura maior não eficiente em termos de custos e a maioria desses links ficaria ociosa a maior parte do tempo. Outras topologias que empregam conexões multiponto, por exemplo, barramento, também podem ser descartadas em decorrência das distâncias entre os dispositivos e o número total. Uma solução mais apropriada é a comutação. Uma rede comutada é formada por uma série de nós interligados, chamados comutadores. Os comutadores são dispositivos capazes de criar conexões temporárias entre dois ou mais dispositivos conectados ao comutador. Em uma rede comutada, parte dos nós são diretamente conectados aos sistemas finais e outros são utilizados para roteamento de pacotes.",
      source: "FOROUZAN, Behrouz A.; MOSHARRAF, Firouz. Redes de computadores: uma abordagem top-down. AMGH Editora, 2013. (adaptada)",
      miniEnunciado: "Considere o texto acima e os métodos de comutação estudados, e analise as afirmações a seguir.",
      assertions: [
        "A comutação de pacotes permite que os dados sejam divididos em pequenas unidades chamadas pacotes, que podem seguir caminhos diferentes até o destino.",
        "[PORQUE] Na comutação de pacotes, os dados são transmitidos por um canal exclusivo estabelecido previamente entre origem e destino durante toda a comunicação."
      ],
      question: "Assinale a alternativa correta.",
      options: [
        "As asserções I e II são proposições falsas.",
        "A asserção I é uma proposição falsa, e a II é uma proposição verdadeira.",
        "A asserção I é uma proposição verdadeira, e a II é uma proposição falsa.",
        "As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I."
      ],
      answer: 2,
      feedback: "A asserção I é verdadeira — na ==key==comutação de pacotes==, os dados são divididos em pacotes que podem percorrer ==mark==rotas diferentes==. A asserção II é ==mark==falsa== — o canal exclusivo pré-estabelecido descreve a ==key==comutação de circuitos==, não a de pacotes."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Asserção",
      texto: "Quando um computador em algum ponto do mundo precisa se comunicar com outro computador em outra parte do mundo, normalmente, utilizam a Internet. Para que a comunicação ocorra, o pacote transmitido pelo computador transmissor pode passar por várias LANs ou WANs antes de atingir o computador de destino. Para tornar possível esse nível de comunicação, foi desenvolvido um esquema de endereçamento global, denominado endereçamento lógico ou endereçamento IP. A última nomenclatura referencia o protocolo IP usado na internet.",
      source: "FOROUZAN, Behrouz A.; MOSHARRAF, Firouz. Redes de computadores: uma abordagem top-down. AMGH Editora, 2013. (adaptada)",
      miniEnunciado: "Considere o texto acima e o conteúdo estudado sobre endereçamento, analise as afirmações a seguir.",
      assertions: [
        "O endereço IP é utilizado para identificar logicamente um dispositivo em uma rede e permitir o roteamento dos pacotes entre diferentes redes.",
        "[PORQUE] O endereço IP é estruturado de forma linear, permitindo identificar a rede e do dispositivo dentro dela, o que possibilita o encaminhamento eficiente de pacotes por roteadores entre redes semelhantes."
      ],
      question: "Assinale a alternativa correta.",
      options: [
        "As asserções I e II são proposições falsas.",
        "A asserção I é uma proposição falsa, e a II é uma proposição verdadeira.",
        "A asserção I é uma proposição verdadeira, e a II é uma proposição falsa.",
        "As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I."
      ],
      answer: 2,
      feedback: "A asserção I é verdadeira — o ==key==endereço IP== identifica logicamente um dispositivo e possibilita o roteamento. A asserção II é ==mark==falsa== — o IP tem estrutura ==key==hierárquica== (rede + host), não linear; e roteadores encaminham entre redes ==mark==distintas==, não semelhantes."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Afirmativas",
      texto: "Um administrador de redes precisa avaliar o desempenho da infraestrutura de comunicação de uma empresa para garantir qualidade no acesso a sistemas corporativos e serviços de videoconferência.",
      miniEnunciado: "Considere as afirmações a seguir sobre métricas de desempenho em redes.",
      assertions: [
        "Largura de banda representa a capacidade máxima de transmissão de dados em um meio de comunicação.",
        "Throughput representa a taxa real de dados transmitidos efetivamente pela rede.",
        "Jitter representa a variação no atraso entre pacotes consecutivos.",
        "Perda de pacotes corresponde à quantidade de dados descartados durante a transmissão na rede."
      ],
      question: "É correto apenas o que se afirma em",
      options: [
        "I e II.",
        "II e III.",
        "III e IV.",
        "I, II, III e IV."
      ],
      answer: 3,
      feedback: "Todas as afirmações estão corretas: ==key==Largura de banda== é a capacidade máxima teórica. ==key==Throughput== é a taxa real (sempre ≤ largura de banda). ==key==Jitter== é a variação no atraso entre pacotes. ==key==Perda de pacotes== são os dados descartados durante a transmissão."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Contextualizada",
      texto: "Uma rede é a interligação de um conjunto de dispositivos capazes de se comunicar. Nessa definição, os dispositivos podem ser classificados como dispositivos finais, como computadores, servidores e smartphones, ou como dispositivos de interconexão, como roteadores, que conectam diferentes redes, e switches (ou comutadores), que interligam dispositivos dentro de uma mesma rede. Esses dispositivos são conectados por meio de transmissão com ou sem fio, como cabos ou o próprio ar.",
      source: "FOROUZAN, Behrouz A.; MOSHARRAF, Firouz. Redes de computadores: uma abordagem top-down. AMGH Editora, 2013. (adaptada)",
      question: "Com base no trecho apresentado e nos conceitos de redes de computadores estudados, assinale a alternativa correta.",
      options: [
        "Os hosts são responsáveis exclusivamente pela interligação entre redes distintas.",
        "Os meios de transmissão sem fio impedem a comunicação entre dispositivos de rede diferentes.",
        "Dispositivos de conexão, como switches e roteadores, exercem a mesma função que os hosts (dispositivos finais) dentro de uma rede.",
        "Dispositivos de conexão, como roteadores e switches, possuem funções específicas de interligação e encaminhamento de dados na rede."
      ],
      answer: 3,
      feedback: "==key==Roteadores== interligam redes distintas usando endereços IP; ==key==switches== interligam dispositivos dentro de uma mesma rede usando endereços MAC. Ambos têm ==mark==funções específicas e distintas== dos hosts (dispositivos finais)."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Afirmativas",
      texto: "A comunicação de dados consiste na troca de informações entre dois ou mais dispositivos por meio de um canal de transmissão, que pode ser, por exemplo, um cabo condutor. Para que essa comunicação ocorra de forma eficiente, é necessário que os dispositivos estejam inseridos em um sistema de comunicação, composto por uma combinação de hardware (equipamentos físicos) e software (programas), responsáveis por viabilizar o envio, a recepção e o processamento dos dados.",
      source: "FOROUZAN, Behrouz A. Comunicação de dados e redes de computadores. AMGH Editora, 2010. (adaptada)",
      miniEnunciado: "Sabendo que a comunicação de dados em redes de computadores é formada por cinco componentes, avalie as afirmativas a seguir.",
      assertions: [
        "A mensagem corresponde à informação que será transmitida entre os dispositivos.",
        "O emissor é o dispositivo responsável por enviar os dados, enquanto o receptor é o dispositivo que os recebe.",
        "O meio de transmissão é o caminho físico ou lógico pelo qual a mensagem trafega entre emissor e receptor.",
        "O protocolo define as regras que controlam a comunicação, como formato, sincronização e controle de erros."
      ],
      question: "É correto o que se afirma em",
      options: [
        "I e II.",
        "I, II e III.",
        "II, III e IV.",
        "I, II, III e IV."
      ],
      answer: 3,
      feedback: "Os cinco componentes de um sistema de comunicação são: ==key==mensagem== (informação), ==key==emissor== (quem envia), ==key==receptor== (quem recebe), ==key==meio de transmissão== (caminho) e ==key==protocolo== (regras). Todas as afirmativas descrevem corretamente esses componentes."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Afirmativas",
      texto: "A comunicação de dados consiste na troca de informações entre dois ou mais dispositivos por meio de um canal de transmissão. A eficácia de um sistema de comunicações de dados depende de quatro características fundamentais: entrega, precisão, sincronização e jitter.",
      source: "FOROUZAN, Behrouz A. Comunicação de dados e redes de computadores. AMGH Editora, 2010. (adaptado)",
      miniEnunciado: "Sobre o sistema de comunicação de dados, avalie as assertivas a seguir.",
      assertions: [
        "A precisão garante que os dados cheguem ao destino correto, evitando que sejam recebidos por dispositivos indevidos.",
        "A entrega assegura que os dados sejam entregues sem erros ou alterações durante a transmissão.",
        "A sincronização refere-se à necessidade de os dados chegarem dentro de um intervalo de tempo adequado, especialmente em aplicações em tempo real.",
        "O jitter corresponde à variação no tempo de chegada dos pacotes, podendo impactar negativamente aplicações sensíveis a atraso."
      ],
      question: "É correto o que se afirma em",
      options: [
        "I e II.",
        "II e III.",
        "III e IV.",
        "I, II, III e IV."
      ],
      answer: 2,
      feedback: "As afirmativas I e II estão com as definições ==mark==trocadas==. ==key==Entrega== garante que os dados cheguem ao destinatário correto; ==key==precisão== assegura que chegam sem erros. III e IV estão corretas: ==key==sincronização== (tempo adequado) e ==key==jitter== (variação no atraso)."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Contextualizada",
      texto: "A comunicação de dados também influencia a forma como essa troca de dados ocorre, determinando características como velocidade, alcance e direção do fluxo de comunicação. Existem três modos distintos de transmissão do fluxo de dados:\n\n• Simplex: fluxo unidirecional — transmissão em apenas um sentido.\n• Half-duplex: fluxo bidirecional alternado — não simultâneo.\n• Full-duplex: fluxo bidirecional simultâneo.",
      source: "FOROUZAN, Behrouz A. Comunicação de dados e redes de computadores. AMGH Editora, 2010.",
      question: "Com base na análise dos modos de transmissão e nos conceitos de comunicação de dados, assinale a alternativa correta.",
      options: [
        "No modo simplex, a comunicação ocorre em um único sentido.",
        "No modo half-duplex, a comunicação ocorre em ambos os sentidos simultaneamente.",
        "No modo full-duplex, a comunicação ocorre em apenas um sentido, sem possibilidade de resposta.",
        "No modo simplex, os dispositivos alternam o envio de dados em intervalos de tempo definidos."
      ],
      answer: 0,
      feedback: "No modo ==key==simplex==, a transmissão é ==mark==unidirecional== — apenas um dispositivo envia e o outro apenas recebe (ex: teclado → computador). O half-duplex é bidirecional não simultâneo; o full-duplex é bidirecional simultâneo."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Contextualizada",
      texto: "A topologia de uma rede corresponde à representação geométrica das conexões entre os dispositivos e os enlaces que compõem uma rede. Entre as topologias básicas, destacam-se: malha, estrela, barramento e anel. Uma determinada topologia é caracterizada pela conexão de cada dispositivo a todos os outros dispositivos da rede, garantindo alta redundância e confiabilidade, porém com elevado custo de implementação.",
      question: "Com base na descrição apresentada, assinale a alternativa que contém a topologia correspondente.",
      options: [
        "Topologia em barramento.",
        "Topologia em anel.",
        "Topologia em estrela.",
        "Topologia em malha."
      ],
      answer: 3,
      feedback: "Na ==key==topologia malha (mesh)==, cada dispositivo é conectado diretamente a todos os outros. Isso cria ==mark==múltiplos caminhos redundantes== garantindo alta confiabilidade, mas exige n(n-1)/2 conexões — elevando o custo."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Contextualizada",
      texto: "Hoje em dia, quando falamos de redes, geralmente estamos nos referindo a duas categorias principais: redes locais e redes de ampla abrangência, geograficamente distribuídas. A categoria na qual uma rede pertence é determinada pelo seu tamanho. Uma LAN normalmente cobre uma área geográfica menor que 3 km; uma WAN pode ter uma cobertura mundial. As redes de tamanho intermediário a esses são, em geral, conhecidas como redes de abrangência metropolitana (MAN) e abrangem uma cobertura de dezenas de quilômetros.",
      source: "FOROUZAN, Behrouz A. Comunicação de dados e redes de computadores. AMGH Editora, 2010.",
      question: "Com base no texto apresentado, uma rede que interliga dispositivos em um prédio comercial, cobrindo uma área de aproximadamente 30 metros, é classificada como",
      options: [
        "LAN, por abranger uma área restrita e de baixa complexidade.",
        "MAN, por cobrir uma área intermediária entre redes locais e redes de longa distância.",
        "WAN, por permitir comunicação entre diferentes regiões dentro de uma mesma cidade.",
        "PAN, por conectar dispositivos pessoais em curta distância."
      ],
      answer: 0,
      feedback: "Uma ==key==LAN (Local Area Network)== cobre áreas limitadas (até ~3 km), como prédios e campus. Uma rede em um prédio cobrindo 30 metros ==mark==enquadra-se como LAN==. MAN cobre cidades; WAN é nacional/mundial; PAN cobre metros."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Contextualizada",
      texto: "Um meio de transmissão, em termos gerais, pode ser definido como qualquer coisa capaz de transportar informações de uma origem a um destino. Em comunicação de dados, a definição de informações e meios de transmissão é mais específica. O meio de transmissão geralmente pode ser o espaço livre, um cabo metálico ou um cabo de fibra óptica. A informação normalmente é um sinal, resultado da conversão de dados.",
      source: "FOROUZAN, Behrouz A. Comunicação de dados e redes de computadores. AMGH Editora, 2010.",
      question: "Com base no texto apresentado, assinale a alternativa correta.",
      options: [
        "O meio de transmissão em redes de computadores é exclusivamente físico, como cabos metálicos, não incluindo o espaço livre.",
        "A informação transmitida em redes de computadores ocorre diretamente na forma de dados, sem necessidade de conversão.",
        "O meio de transmissão é responsável por transportar sinais, podendo ser representado por cabos ou pelo espaço livre.",
        "A comunicação de dados ocorre apenas por meio de cabos de fibra óptica, devido à maior velocidade de transmissão."
      ],
      answer: 2,
      feedback: "O ==key==meio de transmissão== pode ser o ==mark==espaço livre, cabo metálico ou fibra óptica==. A informação é transmitida na forma de ==mark==sinais (resultado da conversão dos dados)==, não diretamente como dados brutos."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Contextualizada",
      texto: "Entre os meios de transmissão guiados, que são aqueles que requerem um condutor físico para interligar um dispositivo a outro, temos: cabo de par trançado, cabo coaxial e cabo de fibra óptica. Um sinal trafegando por qualquer um desses meios é direcionado e contido por limites físicos do meio. Cabos de par trançado e coaxiais usam condutores metálicos (cobre) que aceitam e transportam sinais na forma de corrente elétrica. A fibra óptica é um cabo que aceita e transporta sinais na forma de luz.",
      source: "FOROUZAN, Behrouz A. Comunicação de dados e redes de computadores. AMGH Editora, 2010.",
      question: "Com base no texto e nos conhecimentos sobre desempenho dos meios de transmissão guiados, assinale a alternativa correta.",
      options: [
        "O cabo de par trançado é formado por pares de fios de cobre entrelaçados, o que reduz interferências eletromagnéticas e é amplamente utilizado em redes locais devido ao seu baixo custo e facilidade de instalação.",
        "O cabo coaxial é composto por fibras de vidro que transmitem dados por meio de pulsos de luz, sendo totalmente imune a interferências externas.",
        "A fibra óptica utiliza sinais elétricos para transmissão de dados, o que a torna mais suscetível a ruídos e interferências eletromagnéticas.",
        "Todos os meios guiados utilizam o mesmo princípio de transmissão de dados, diferenciando-se apenas pelo material externo do cabo."
      ],
      answer: 0,
      feedback: "O ==key==par trançado== usa pares de fios de cobre entrelaçados para ==mark==cancelar interferências eletromagnéticas (cross-talk)==, sendo o meio mais comum em LANs por seu baixo custo. A fibra óptica usa ==mark==luz (não sinais elétricos)== e o coaxial usa cobre (não fibra de vidro)."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Contextualizada",
      texto: "Em uma empresa, o administrador de rede precisa configurar um roteador para permitir a comunicação entre a rede local (LAN) da organização e outras redes externas, como a Internet. Durante essa configuração inicial, são definidos parâmetros como endereçamento IP, rotas e interfaces de rede, garantindo que os dados sejam encaminhados corretamente entre diferentes redes.",
      question: "Considerando o papel do roteador em uma rede de computadores, assinale a alternativa que representa corretamente sua principal função.",
      options: [
        "Converter sinais analógicos em digitais.",
        "Interligar redes distintas e encaminhar pacotes com base em endereços IP.",
        "Controlar o acesso físico ao meio de transmissão.",
        "Encaminhar quadros com base em endereços MAC dentro da rede local."
      ],
      answer: 1,
      feedback: "O ==key==roteador== opera na ==mark==camada de rede (camada 3 do OSI)== e sua função principal é ==mark==interligar redes distintas e encaminhar pacotes com base em endereços IP e tabelas de roteamento==. Encaminhar por MAC é função do switch."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Contextualizada",
      texto: "Uma empresa está expandindo sua rede corporativa e precisa segmentar o tráfego entre diferentes departamentos, mantendo alta performance e reduzindo a dependência de roteadores dedicados. Para isso, o administrador de rede avalia o uso de switches que operam em diferentes camadas do modelo OSI, considerando suas funcionalidades de comutação e roteamento.",
      question: "Com base no cenário apresentado e nos conceitos de redes de computadores, assinale a alternativa que diferencia corretamente um switch de camada 2 de um switch de camada 3.",
      options: [
        "O switch de camada 2 utiliza endereços MAC para encaminhamento de quadros, enquanto o switch de camada 3 pode encaminhar pacotes com base em endereços IP.",
        "O switch de camada 2 e o switch de camada 3 possuem exatamente as mesmas funções.",
        "O switch de camada 2 utiliza endereços IP para encaminhar quadros dentro da rede local.",
        "O switch de camada 2 realiza roteamento entre redes distintas, enquanto o switch de camada 3 apenas encaminha quadros."
      ],
      answer: 0,
      feedback: "O ==key==switch de camada 2== comuta quadros usando ==mark==tabela de endereços MAC==, operando na mesma rede. O ==key==switch de camada 3== adiciona capacidade de ==mark==roteamento por endereços IP== entre sub-redes, reduzindo a necessidade de roteadores dedicados."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Contextualizada",
      texto: "Suponha que um gestor de TI de uma empresa esteja avaliando o desempenho do subsistema de armazenamento. Durante a análise, ele identificou que o servidor realiza, em média, 6 operações de I/O por transação, sendo que cada operação de I/O no disco consome aproximadamente 15 ms. Em um intervalo de 30 minutos, foram registradas 5.400 transações.",
      question: "Com base nas informações apresentadas, o gestor concluiu que o throughput médio do disco (em transações por segundo) e a utilização média do disco (em valor percentual) são, respectivamente:",
      options: [
        "3 e 45.",
        "3 e 27.",
        "6 e 27.",
        "6 e 45."
      ],
      answer: 1,
      feedback: "==key==Throughput== = 5.400 ÷ (30 × 60) = ==mark==3 transações/segundo==. ==key==Utilização== = 3 transações/s × 6 operações × 15 ms = 270 ms/s → ==mark==270 ÷ 1000 = 27%==."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Contextualizada",
      texto: "Em sistemas de comunicação modernos, como telefonia móvel, redes de computadores e aplicações multimídia, informações do mundo físico — como voz e imagens — precisam ser capturadas, processadas e transmitidas por dispositivos digitais. Para que isso seja possível, esses sistemas realizam a conversão entre sinais analógicos e digitais.",
      question: "Considerando o cenário apresentado e os fundamentos da comunicação de dados, assinale a alternativa que expressa corretamente a principal finalidade da conversão analógico-digital.",
      options: [
        "Eliminar completamente o ruído do sinal original.",
        "Evitar o uso de protocolos de comunicação.",
        "Reduzir a latência da rede a zero.",
        "Permitir o processamento e a transmissão de informações em sistemas digitais."
      ],
      answer: 3,
      feedback: "A ==key==conversão analógico-digital (ADC)== transforma sinais contínuos do mundo físico (voz, imagens) em ==mark==representações discretas (bits)== que podem ser processadas, armazenadas e transmitidas por sistemas digitais."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Contextualizada",
      texto: "Os sistemas de comunicação podem ser classificados de acordo com a direção em que ocorre a transmissão de dados entre os dispositivos.",
      question: "Um sistema de comunicação em que a transmissão ocorre em ambos os sentidos, porém não simultaneamente, é classificado como:",
      options: [
        "Full-duplex.",
        "Half-duplex.",
        "Simplex.",
        "Padrão."
      ],
      answer: 1,
      feedback: "O ==key==half-duplex== permite comunicação ==mark==bidirecional, mas apenas em um sentido por vez==. Os dispositivos alternam entre enviar e receber (ex: walkie-talkie). Full-duplex é simultâneo; simplex é apenas um sentido."
    },

    {
      aula: "Redes de Computadores I",
      tipo: "Contextualizada",
      texto: "Durante a transmissão de dados em longas distâncias, a qualidade do sinal pode ser comprometida pela presença de interferências externas, como sinais eletromagnéticos provenientes de outros dispositivos, que se somam ao sinal original e podem causar distorções na informação transmitida.",
      question: "O fenômeno descrito, que corresponde à alteração indesejada do sinal devido à interferência externa, é denominado como",
      options: [
        "Jitter.",
        "Atenuação.",
        "Latência.",
        "Ruído."
      ],
      answer: 3,
      feedback: "O ==key==ruído (noise)== é qualquer ==mark==sinal indesejado que se soma ao sinal original== durante a transmissão, causando distorções. Jitter é variação no atraso; atenuação é perda de potência; latência é o atraso total."
    },

  ],

};