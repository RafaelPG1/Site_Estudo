window.__nexusConteudo = {
  aulas: [
    {
aula: "Redes de Computadores II — Apresentação da disciplina, ementa, metodologia e revisão de conceitos básicos",
  ideia_central: "A aula introduz a disciplina Redes de Computadores II, apresentando sua ementa e metodologia, e revisa os conceitos fundamentais de Redes I necessários para o restante do curso, como componentes de rede, endereçamento IP, modelos cliente-servidor e P2P, tipos e topologias de redes, modelo em camadas (OSI e TCP/IP) e os processos de encapsulamento e desencapsulamento.",
  secoes: [
    {
      id: "visao",
      titulo: "Visão geral do conteúdo",
      blocos: [
        {
          tipo: "texto",
          texto: "A aula começa apresentando a disciplina **Redes de Computadores II** e, em seguida, faz uma revisão dos principais conceitos estudados anteriormente em Redes I."
        },
        {
          tipo: "lista",
          titulo: "A disciplina aborda, entre outros assuntos",
          itens: [
            "Camadas física e de enlace",
            "Protocolos e padrões **IEEE**",
            "Redes **LAN, MAN** e redes sem fio",
            "Mobilidade e redes móveis",
            "**Segurança de redes**, incluindo criptografia, autenticação, firewalls, VPNs e SSL/TLS",
            "Multimídia em redes, como **streaming, VoIP e QoS**",
            "Implantação e administração de servidores",
            "Servidores **Web, DNS, arquivos, e-mail e impressão**",
            "Introdução à **virtualização de serviços**",
            "Sistemas operacionais de rede",
            "**Análise de tráfego**"
          ]
        },
        {
          tipo: "texto",
          texto: "O objetivo geral é desenvolver conhecimentos teóricos e práticos que permitam **implantar, administrar e monitorar redes de computadores de maneira segura e eficiente**."
        },
        {
          tipo: "lista",
          titulo: "A primeira aula revisa principalmente",
          itens: [
            "O que é uma rede de computadores",
            "Componentes de uma rede",
            "Comunicação entre dispositivos",
            "Tipos e topologias de redes",
            "Endereçamento IPv4 e IPv6",
            "Modelos cliente-servidor e P2P",
            "Serviços de rede",
            "Modelo em camadas",
            "Modelos **OSI e TCP/IP**",
            "Encapsulamento e desencapsulamento"
          ]
        }
      ]
    },
    {
      id: "rede_conceito",
      titulo: "O que é uma rede de computadores?",
      blocos: [
        {
          tipo: "texto",
          texto: "Uma **rede de computadores** é um conjunto de dispositivos interconectados com o objetivo de **trocar informações e compartilhar recursos**."
        },
        {
          tipo: "topico",
          titulo: "Por que as redes surgiram?",
          lista: [
            "Trocar informações de maneira **rápida e de baixo custo**",
            "Compartilhar recursos de **hardware**",
            "Compartilhar recursos de **software**"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de compartilhamento de recursos em uma empresa",
          texto: "Em uma empresa, vários computadores podem utilizar a mesma impressora, o mesmo servidor de arquivos, sistemas hospedados em um servidor, acesso à Internet e serviços internos de rede."
        }
      ]
    },
    {
      id: "componentes",
      titulo: "Componentes básicos de uma rede",
      blocos: [
        {
          tipo: "texto",
          texto: "Uma infraestrutura de rede possui diferentes elementos. Os principais apresentados na aula são os dispositivos finais (hosts), os dispositivos de interconexão e os meios de transmissão."
        },
        {
          tipo: "topico",
          titulo: "Dispositivos finais — Hosts",
          texto: "São os equipamentos que **utilizam efetivamente a rede**. Eles podem enviar dados, receber dados e processar dados."
        },
        {
          tipo: "lista",
          titulo: "Exemplos de hosts",
          itens: [
            "Computadores",
            "Notebooks",
            "Servidores",
            "Smartphones",
            "Impressoras de rede",
            "Dispositivos IoT"
          ]
        },
        {
          tipo: "topico",
          titulo: "Dispositivos de interconexão",
          texto: "São responsáveis por **conectar os dispositivos finais** e organizar o caminho que os dados percorrem pela rede."
        },
        {
          tipo: "lista",
          titulo: "Exemplos de dispositivos de interconexão",
          itens: [
            "**Hub**",
            "**Switch**",
            "**Roteador**",
            "**Access Point (AP)**"
          ]
        },
        {
          tipo: "destaque",
          texto: "Para prova: não confunda **host** com dispositivo de interconexão. O host é o equipamento que utiliza a rede; os dispositivos de interconexão ajudam a conectar e encaminhar a comunicação."
        }
      ]
    },
    {
      id: "meios_transmissao",
      titulo: "Meios de transmissão",
      blocos: [
        {
          tipo: "texto",
          texto: "Os meios de transmissão são os **caminhos pelos quais os dados trafegam** entre dispositivos. Eles podem ser físicos ou sem fio."
        },
        {
          tipo: "topico",
          titulo: "Meios guiados",
          texto: "Utilizam um meio físico para transportar os sinais.",
          lista: [
            "**Par trançado**",
            "**Cabo coaxial**",
            "**Fibra óptica**"
          ]
        },
        {
          tipo: "topico",
          titulo: "Meios não guiados",
          texto: "Não utilizam um cabo físico entre os pontos de comunicação.",
          lista: [
            "Ondas de rádio",
            "Micro-ondas",
            "Infravermelho",
            "Satélite"
          ]
        },
        {
          tipo: "destaque",
          texto: "Memorize: **Guiado = cabo.** **Não guiado = transmissão sem fio.**"
        }
      ]
    },
    {
      id: "protocolos",
      titulo: "Protocolos de comunicação",
      blocos: [
        {
          tipo: "texto",
          texto: "Os dispositivos de uma rede precisam seguir **regras e padrões** para conseguir se comunicar. Essas regras são chamadas de **protocolos de comunicação**."
        },
        {
          tipo: "lista",
          titulo: "Os protocolos determinam, entre outras coisas",
          itens: [
            "Como os dados são organizados",
            "Como são transmitidos",
            "Como são recebidos",
            "Como devem ser interpretados"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Protocolos envolvidos ao acessar um site",
          texto: "Quando você acessa um site, diferentes protocolos participam da comunicação. O PDF cita, por exemplo: **HTTP/HTTPS** para navegação Web, **SMTP/IMAP/POP3** para e-mail, **FTP** para transferência de arquivos e **VoIP** para comunicação de voz e vídeo."
        }
      ]
    },
    {
      id: "etapas_comunicacao",
      titulo: "Etapas da comunicação em uma rede",
      blocos: [
        {
          tipo: "texto",
          texto: "A comunicação entre dispositivos pode ser entendida através de várias etapas."
        },
        {
          tipo: "topico",
          titulo: "1. Endereçamento",
          texto: "Cada dispositivo precisa possuir um identificador para poder ser localizado na rede. Um exemplo é o **Endereço IP**, podendo ser IPv4 ou IPv6."
        },
        {
          tipo: "topico",
          titulo: "2. Divisão da mensagem em pacotes",
          texto: "Uma informação grande, como vídeo, arquivo ou mensagem, é dividida em partes menores chamadas **pacotes**. Os pacotes carregam, além dos dados, informações de controle, como endereço de origem, endereço de destino e número de sequência."
        },
        {
          tipo: "topico",
          titulo: "3. Transmissão",
          texto: "Os pacotes percorrem o meio de transmissão: cabo, fibra óptica, Wi-Fi etc."
        },
        {
          tipo: "topico",
          titulo: "4. Roteamento e comutação",
          texto: "**Roteadores e switches** ajudam a direcionar os dados para o destino. Eles utilizam endereços e tabelas de encaminhamento."
        },
        {
          tipo: "topico",
          titulo: "5. Entrega e remontagem",
          texto: "No destino, os pacotes são recebidos e organizados novamente. O conteúdo precisa ser remontado na ordem correta e podem ser verificadas condições relacionadas a erros. O PDF cita o **TCP** como protocolo que garante que os dados cheguem completos e sem perdas."
        },
        {
          tipo: "topico",
          titulo: "6. Interpretação pela aplicação",
          texto: "Depois que os dados chegam, o programa responsável interpreta essas informações."
        },
        {
          tipo: "tabela",
          titulo: "Protocolos/serviços e sua utilização",
          colunas: ["Protocolo/serviço", "Utilização"],
          linhas: [
            ["HTTP/HTTPS", "Web"],
            ["SMTP/IMAP/POP3", "E-mail"],
            ["FTP", "Transferência de arquivos"],
            ["VoIP", "Voz e vídeo"]
          ]
        }
      ]
    },
    {
      id: "tipos_redes",
      titulo: "Tipos de redes",
      blocos: [
        {
          tipo: "texto",
          texto: "A aula apresenta três classificações importantes: **LAN**, **MAN** e **WAN**."
        },
        {
          tipo: "imagem",
          src: "tipos_redes_lan_man_wan.png",
          pasta: "imagens_redes2/aula_01",
          alt: "A figura compara visualmente LAN, MAN e WAN, mostrando a diferença principalmente na abrangência geográfica. LAN representa uma área local, MAN uma área metropolitana e WAN uma área ampla. (Página 16)",
          num: 1
        },
        {
          tipo: "topico",
          titulo: "LAN — Local Area Network",
          texto: "É uma rede de **área local**. Normalmente está associada a uma área relativamente limitada, como residência, laboratório, escritório ou prédio."
        },
        {
          tipo: "topico",
          titulo: "MAN — Metropolitan Area Network",
          texto: "É uma rede de **área metropolitana**. Possui uma abrangência maior que uma LAN, podendo conectar diferentes locais dentro de uma região metropolitana."
        },
        {
          tipo: "topico",
          titulo: "WAN — Wide Area Network",
          texto: "É uma rede de **área ampla**. Sua abrangência pode ser muito grande, conectando redes localizadas em diferentes regiões ou países."
        },
        {
          tipo: "destaque",
          texto: "Para memorizar: **LAN → Local**, **MAN → Metropolitana**, **WAN → Ampla**."
        }
      ]
    },
    {
      id: "topologias",
      titulo: "Topologias de rede",
      blocos: [
        {
          tipo: "texto",
          texto: "**Topologia de rede** representa a forma como os dispositivos estão organizados e conectados."
        },
        {
          tipo: "lista",
          titulo: "O material apresenta",
          itens: [
            "**Estrela**",
            "**Malha (Mesh)**",
            "**Árvore**",
            "**Ponto a ponto**",
            "**Anel**",
            "**Barramento**"
          ]
        },
        {
          tipo: "imagem",
          src: "topologias_rede.png",
          pasta: "imagens_redes2/aula_01",
          alt: "A figura mostra seis formas de organização dos dispositivos em uma rede: estrela, malha, árvore, ponto a ponto, anel e barramento. (Página 17)",
          num: 2
        },
        {
          tipo: "topico",
          titulo: "Estrela",
          texto: "Os dispositivos estão conectados a um **ponto central**. Visualmente, os computadores ficam distribuídos ao redor de um elemento central."
        },
        {
          tipo: "topico",
          titulo: "Malha — Mesh",
          texto: "Existem **múltiplas conexões entre os dispositivos**, criando diferentes caminhos possíveis."
        },
        {
          tipo: "topico",
          titulo: "Árvore",
          texto: "A estrutura possui uma organização **hierárquica**, semelhante aos galhos de uma árvore."
        },
        {
          tipo: "topico",
          titulo: "Ponto a ponto",
          texto: "Representa uma conexão **direta entre dispositivos**."
        },
        {
          tipo: "topico",
          titulo: "Anel",
          texto: "Os dispositivos formam uma estrutura fechada, em que cada elemento se conecta formando um **anel**."
        },
        {
          tipo: "topico",
          titulo: "Barramento",
          texto: "Os dispositivos compartilham um **meio de transmissão principal**, ao qual os equipamentos estão conectados."
        },
        {
          tipo: "destaque",
          texto: "Atenção para prova: o importante nesta aula é reconhecer visualmente e conceitualmente as diferentes topologias."
        }
      ]
    },
    {
      id: "ipv4",
      titulo: "Endereçamento IP — IPv4",
      blocos: [
        {
          tipo: "texto",
          texto: "O **endereçamento IP** permite identificar dispositivos dentro de uma rede. O PDF aborda dois formatos: **IPv4** e **IPv6**."
        },
        {
          tipo: "texto",
          texto: "O IPv4 possui **32 bits**. Sua representação normalmente utiliza **4 octetos em decimal**, separados por pontos. Um endereço IPv4 possui uma **parte de rede** e uma **parte de host**. A parte de rede identifica a rede, enquanto a parte de host identifica o dispositivo dentro daquela rede."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de endereço IPv4",
          texto: "192.168.10.1/8"
        },
        {
          tipo: "topico",
          titulo: "Estrutura do IPv4",
          texto: "**IPv4 = 32 bits = 4 octetos**. Exemplo: `192 . 168 . 10 . 1`"
        }
      ]
    },
    {
      id: "ipv6",
      titulo: "IPv6",
      blocos: [
        {
          tipo: "texto",
          texto: "O IPv6 foi criado para substituir o IPv4 principalmente devido à **escassez de endereços IPv4**."
        },
        {
          tipo: "lista",
          titulo: "Características apresentadas no material",
          itens: [
            "**128 bits**",
            "Representação em **hexadecimal**",
            "Espaço de endereçamento muito maior",
            "Autoconfiguração",
            "Melhor suporte à segurança com **IPSec**"
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de endereço IPv6",
          texto: "2001:0db8:85a3:0000:0000:8a2e:0370:7334"
        },
        {
          tipo: "tabela",
          titulo: "Comparação IPv4 x IPv6",
          colunas: ["Característica", "IPv4", "IPv6"],
          linhas: [
            ["Tamanho", "32 bits", "128 bits"],
            ["Representação", "Decimal", "Hexadecimal"],
            ["Separação", "Pontos", "Dois-pontos"],
            ["Principal problema", "Espaço limitado", "Criado para ampliar enormemente o espaço"],
            ["Situação", "Ainda dominante", "Presente em dispositivos e provedores modernos"]
          ]
        },
        {
          tipo: "destaque",
          texto: "Memorize: **IPv4 → 32 bits**, **IPv6 → 128 bits**. Essa diferença é especialmente importante para provas."
        }
      ]
    },
    {
      id: "cliente_servidor",
      titulo: "Modelo Cliente-Servidor",
      blocos: [
        {
          tipo: "texto",
          texto: "No modelo **cliente-servidor**, existem dois papéis principais: cliente e servidor."
        },
        {
          tipo: "topico",
          titulo: "Cliente",
          texto: "É o dispositivo que **solicita um serviço**."
        },
        {
          tipo: "topico",
          titulo: "Servidor",
          texto: "É o dispositivo que recebe a solicitação, processa a solicitação e envia uma resposta.",
          lista: [
            "Recebe a solicitação",
            "Processa a solicitação",
            "Envia uma resposta"
          ]
        },
        {
          tipo: "lista",
          titulo: "Um servidor pode fornecer diversos serviços, como",
          itens: [
            "Arquivos",
            "Impressão",
            "Comunicação",
            "Web",
            "Banco de dados"
          ]
        },
        {
          tipo: "texto",
          texto: "Como o servidor pode concentrar muitas solicitações, ele precisa apresentar características adequadas de desempenho, disponibilidade, hardware e software. Isso pode aumentar o custo da infraestrutura."
        },
        {
          tipo: "destaque",
          texto: "Principal característica do modelo cliente-servidor: **Administração centralizada.**"
        }
      ]
    },
    {
      id: "p2p",
      titulo: "Modelo Peer-to-Peer — P2P",
      blocos: [
        {
          tipo: "texto",
          texto: "No modelo **Peer-to-Peer**, ou **P2P**, não existe necessariamente um servidor especializado. Os dispositivos possuem papéis semelhantes e podem fornecer serviços e consumir serviços."
        },
        {
          tipo: "topico",
          titulo: "Vantagens",
          lista: [
            "Instalação simples",
            "Baixo custo",
            "Escalabilidade",
            "Disponibilidade"
          ]
        },
        {
          tipo: "topico",
          titulo: "Desvantagens",
          lista: [
            "Menor desempenho em modelos P2P tradicionais",
            "Administração descentralizada",
            "Maior dificuldade de gerenciamento",
            "Dificuldade para garantir segurança"
          ]
        },
        {
          tipo: "texto",
          texto: "Pode ser utilizado em pequenas redes nas quais o desempenho não seja a principal preocupação."
        },
        {
          tipo: "tabela",
          titulo: "Cliente-Servidor x P2P",
          colunas: ["Característica", "Cliente-Servidor", "P2P"],
          linhas: [
            ["Estrutura", "Centralizada", "Descentralizada"],
            ["Função dos nós", "Cliente consome, servidor fornece", "Todos fornecem e consomem"],
            ["Exemplos", "Web, e-mail, bancos de dados", "Torrent, blockchain"],
            ["Vantagem", "Controle e gerenciamento mais fáceis", "Escalabilidade e resiliência"],
            ["Desvantagem", "Dependência do servidor", "Gerenciamento e segurança mais difíceis"]
          ]
        },
        {
          tipo: "destaque",
          texto: "Dica de prova: **Cliente-servidor → centralização.** **P2P → descentralização.**"
        }
      ]
    },
    {
      id: "servicos_rede",
      titulo: "Serviços de rede",
      blocos: [
        {
          tipo: "texto",
          texto: "**Serviços de rede** são recursos ou funcionalidades disponibilizados através da rede para permitir que dispositivos e usuários se comuniquem, compartilhem informações e utilizem aplicações."
        },
        {
          tipo: "lista",
          titulo: "Entre os serviços revisados estão",
          itens: [
            "Web",
            "Correio eletrônico",
            "Transferência de arquivos",
            "Serviços de nomes"
          ]
        },
        {
          tipo: "topico",
          titulo: "Serviço Web",
          texto: "O serviço **Web (WWW — World Wide Web)** é composto por documentos ou páginas que podem conter textos, imagens, áudio e vídeo. Esses conteúdos estão inter-relacionados. O principal protocolo associado ao serviço Web apresentado na aula é o **HTTP**."
        },
        {
          tipo: "lista",
          titulo: "Exemplos de servidores Web",
          itens: ["Apache", "Microsoft IIS"]
        },
        {
          tipo: "lista",
          titulo: "Exemplos de navegadores",
          itens: ["Mozilla Firefox", "Microsoft Internet Explorer"]
        },
        {
          tipo: "topico",
          titulo: "Correio eletrônico",
          texto: "O serviço de **e-mail** permite enviar e receber mensagens digitais. O material cita protocolos relacionados ao serviço: **SMTP**, **POP**, **MIME** e **IMAP** (apresentado no PDF como \"IMAPI\"). Existe uma distinção entre o software utilizado pelo usuário e o servidor responsável pelo armazenamento e encaminhamento das mensagens."
        },
        {
          tipo: "topico",
          titulo: "Transferência de arquivos",
          texto: "O serviço de transferência de arquivos permite copiar arquivos através da rede. O protocolo associado ao serviço no material é o **FTP**."
        },
        {
          tipo: "topico",
          titulo: "Download",
          texto: "Transferência: **Servidor → Cliente**"
        },
        {
          tipo: "topico",
          titulo: "Upload",
          texto: "Transferência: **Cliente → Servidor**"
        },
        {
          tipo: "destaque",
          texto: "Memorize: **Download = baixar**, **Upload = enviar**."
        },
        {
          tipo: "topico",
          titulo: "Serviço de nomes — DNS",
          texto: "Em uma rede, os dispositivos são identificados internamente por números, enquanto os usuários normalmente preferem utilizar **nomes**, que são mais fáceis de memorizar. O serviço de nomes faz a tradução entre nome e endereço numérico (**Nome ↔ endereço numérico**). Na Internet, essa função é realizada pelo **DNS — Domain Name System**."
        },
        {
          tipo: "texto",
          texto: "Por que o DNS é útil? Imagine acessar um serviço utilizando um nome em vez de precisar memorizar um endereço IP. Além disso, se o endereço IP do servidor mudar, o nome pode continuar sendo utilizado."
        }
      ]
    },
    {
      id: "modelo_camadas",
      titulo: "Modelo em camadas",
      blocos: [
        {
          tipo: "texto",
          texto: "O **modelo em camadas** é uma forma de organizar e compreender a comunicação de redes dividindo o processo em partes. Cada camada possui **funções específicas**."
        },
        {
          tipo: "topico",
          titulo: "Facilita o entendimento",
          texto: "A comunicação é dividida em partes menores e mais fáceis de estudar."
        },
        {
          tipo: "topico",
          titulo: "Permite compatibilidade",
          texto: "Fabricantes diferentes podem desenvolver equipamentos e softwares capazes de trabalhar juntos."
        },
        {
          tipo: "topico",
          titulo: "Separa responsabilidades",
          texto: "Cada camada fica responsável por uma parte específica da comunicação."
        }
      ]
    },
    {
      id: "osi",
      titulo: "Modelo OSI",
      blocos: [
        {
          tipo: "texto",
          texto: "O **modelo OSI** possui **7 camadas**. Foi criado pela **ISO — International Organization for Standardization**. O material destaca que ele é principalmente **didático** e pouco utilizado diretamente na prática, mas é excelente para compreender conceitualmente as redes."
        },
        {
          tipo: "imagem",
          src: "modelo_osi_7_camadas.png",
          pasta: "imagens_redes2/aula_01",
          alt: "A figura apresenta as sete camadas do modelo OSI e a principal responsabilidade atribuída a cada uma. (Página 30)",
          num: 3
        },
        {
          tipo: "topico",
          titulo: "7 — Aplicação",
          texto: "Fornece a **interface para o usuário e os serviços de rede**. É a camada mais próxima das aplicações utilizadas pelo usuário."
        },
        {
          tipo: "topico",
          titulo: "6 — Apresentação",
          texto: "Responsável por aspectos relacionados à tradução dos dados, criptografia e compressão."
        },
        {
          tipo: "topico",
          titulo: "5 — Sessão",
          texto: "Controla os **diálogos** entre aplicações: início, manutenção e encerramento."
        },
        {
          tipo: "topico",
          titulo: "4 — Transporte",
          texto: "Responsável pela confiabilidade da comunicação e pelo controle de fluxo."
        },
        {
          tipo: "topico",
          titulo: "3 — Rede",
          texto: "Responsável por endereçamento lógico e roteamento."
        },
        {
          tipo: "topico",
          titulo: "2 — Enlace",
          texto: "Responsável por controle de acesso ao meio e detecção de erros. O material relaciona essa camada a Ethernet (IEEE 802.3), Wi-Fi (802.11) e switches."
        },
        {
          tipo: "topico",
          titulo: "1 — Física",
          texto: "Responsável pela **transmissão dos bits no meio físico**. Exemplos apresentados: cabos UTP e fibra óptica."
        },
        {
          tipo: "destaque",
          texto: "Decore a sequência do OSI de cima para baixo: **7 Aplicação, 6 Apresentação, 5 Sessão, 4 Transporte, 3 Rede, 2 Enlace, 1 Física**. Uma forma simples de raciocinar é: Aplicação → dados → sessão → transporte → rede → enlace → meio físico."
        }
      ]
    },
    {
      id: "tcpip",
      titulo: "Modelo TCP/IP",
      blocos: [
        {
          tipo: "texto",
          texto: "O **TCP/IP** é o modelo prático utilizado na Internet."
        },
        {
          tipo: "lista",
          titulo: "Características apresentadas",
          itens: [
            "Criado pelo **Departamento de Defesa dos EUA (DoD)**",
            "Utilizado na Internet",
            "Mais enxuto que o OSI",
            "Cobre funções equivalentes às apresentadas no OSI"
          ]
        },
        {
          tipo: "imagem",
          src: "modelo_tcp_ip_5_camadas.png",
          pasta: "imagens_redes2/aula_01",
          alt: "A figura mostra as cinco camadas do modelo TCP/IP e evidencia que a camada de Aplicação reúne funções que aparecem separadas nas camadas Aplicação, Apresentação e Sessão do OSI. (Página 31)",
          num: 4
        },
        {
          tipo: "topico",
          titulo: "5 — Aplicação",
          texto: "Agrupa as funções de Aplicação, Apresentação e Sessão do OSI. Fornece interface com o usuário e serviços de rede, incluindo a apresentação dos dados."
        },
        {
          tipo: "topico",
          titulo: "4 — Transporte",
          texto: "Responsável por confiabilidade e controle de fluxo."
        },
        {
          tipo: "topico",
          titulo: "3 — Rede/Internet",
          texto: "Responsável por endereçamento lógico e roteamento."
        },
        {
          tipo: "topico",
          titulo: "2 — Enlace",
          texto: "Responsável por controle de acesso ao meio, detecção de erros, Ethernet, Wi-Fi e switches."
        },
        {
          tipo: "topico",
          titulo: "1 — Física",
          texto: "Responsável pela transmissão de bits e utilização do meio físico. Exemplos: cabos UTP e fibra óptica."
        }
      ]
    },
    {
      id: "osi_tcpip_comparacao",
      titulo: "OSI x TCP/IP",
      blocos: [
        {
          tipo: "texto",
          texto: "A relação apresentada na aula pode ser resumida na tabela a seguir."
        },
        {
          tipo: "tabela",
          titulo: "Correspondência entre camadas OSI e TCP/IP",
          colunas: ["OSI", "TCP/IP"],
          linhas: [
            ["Aplicação", "Aplicação"],
            ["Apresentação", "Aplicação"],
            ["Sessão", "Aplicação"],
            ["Transporte", "Transporte"],
            ["Rede", "Rede/Internet"],
            ["Enlace", "Enlace"],
            ["Física", "Física"]
          ]
        },
        {
          tipo: "destaque",
          texto: "O ponto mais importante: as três primeiras camadas do OSI — **Aplicação + Apresentação + Sessão** — são agrupadas na camada **Aplicação do TCP/IP**. Por isso: **OSI = 7 camadas** e **TCP/IP = 5 camadas**."
        }
      ]
    },
    {
      id: "encapsulamento",
      titulo: "Encapsulamento e desencapsulamento",
      blocos: [
        {
          tipo: "texto",
          texto: "No modelo TCP/IP, quando um dado precisa ser enviado de um dispositivo para outro, ele passa pelas **cinco camadas**. Em cada camada, informações adicionais são adicionadas ao dado. Esse processo é chamado de **encapsulamento**."
        },
        {
          tipo: "imagem",
          src: "encapsulamento_tcp_ip.png",
          pasta: "imagens_redes2/aula_01",
          alt: "O conteúdo mostra a transformação progressiva dos dados durante o envio: dados da aplicação → segmento/datagrama → pacote → quadro → sinais transmitidos pelo meio físico. (Página 32)",
          num: 5
        },
        {
          tipo: "topico",
          titulo: "1. Aplicação",
          texto: "A aplicação gera os dados. Exemplos: mensagem, página Web, e-mail."
        },
        {
          tipo: "topico",
          titulo: "2. Transporte",
          texto: "Os dados são divididos em **segmentos**, quando utilizado TCP, ou **datagramas**, quando utilizado UDP. São adicionadas informações de controle, como portas de origem e destino e controle de fluxo."
        },
        {
          tipo: "topico",
          titulo: "3. Rede/Internet",
          texto: "Os segmentos são encapsulados em **pacotes**. São adicionados o endereço IP de origem e o endereço IP de destino."
        },
        {
          tipo: "topico",
          titulo: "4. Enlace",
          texto: "Os pacotes são transformados em **quadros (frames)**. São adicionados endereços físicos **MAC** e informações relacionadas ao controle de erros."
        },
        {
          tipo: "topico",
          titulo: "5. Física",
          texto: "Os quadros são transformados em sinais elétricos, ópticos ou de rádio. Esses sinais são transmitidos pelo meio físico."
        },
        {
          tipo: "destaque",
          texto: "Sequência para decorar: **Dados → Segmento/Datagrama → Pacote → Quadro → Bits/Sinais**"
        },
        {
          tipo: "texto",
          texto: "No dispositivo receptor ocorre o processo inverso: o **desencapsulamento**. O receptor remove/interpreta as informações adicionadas durante o envio e entrega os dados à aplicação."
        },
        {
          tipo: "topico",
          titulo: "Ordem no receptor",
          lista: [
            "**Física** → converte sinais em bits",
            "**Enlace** → organiza os bits em quadros",
            "**Rede** → interpreta os endereços IP e entrega ao transporte",
            "**Transporte** → reordena e verifica a integridade",
            "**Aplicação** → apresenta a informação ao usuário"
          ]
        },
        {
          tipo: "destaque",
          texto: "Memorize: no **emissor**, encapsula-se, ou seja, adicionam-se informações. No **receptor**, desencapsula-se, ou seja, retiram-se/interpretam-se as informações."
        }
      ]
    },
    {
      id: "formulas_metodos",
      titulo: "Fórmulas e métodos",
      blocos: [
        {
          tipo: "texto",
          texto: "Esta aula não apresenta fórmulas matemáticas relevantes. O foco é conceitual. Entretanto, existem algumas **sequências e métodos que precisam ser memorizados**."
        },
        {
          tipo: "topico",
          titulo: "Estrutura do IPv4",
          texto: "**IPv4 = 32 bits**, **4 octetos**. Exemplo: `192.168.10.1`"
        },
        {
          tipo: "topico",
          titulo: "Estrutura do IPv6",
          texto: "**IPv6 = 128 bits**, representado em **hexadecimal**. Exemplo: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`"
        },
        {
          tipo: "topico",
          titulo: "Camadas OSI",
          lista: [
            "7 → Aplicação",
            "6 → Apresentação",
            "5 → Sessão",
            "4 → Transporte",
            "3 → Rede",
            "2 → Enlace",
            "1 → Física"
          ]
        },
        {
          tipo: "topico",
          titulo: "Camadas TCP/IP",
          lista: [
            "5 → Aplicação",
            "4 → Transporte",
            "3 → Rede/Internet",
            "2 → Enlace",
            "1 → Física"
          ]
        },
        {
          tipo: "topico",
          titulo: "Encapsulamento",
          lista: [
            "Aplicação",
            "→ Segmento/Datagrama",
            "→ Pacote",
            "→ Quadro",
            "→ Sinais"
          ]
        }
      ]
    },
    {
      id: "exemplos",
      titulo: "Exemplos explicativos",
      blocos: [
        {
          tipo: "exemplo",
          titulo: "Exemplo 1 — Acessando um site",
          texto: "Imagine que um computador acesse uma página Web. O processo pode ser entendido através dos seguintes passos.",
          detalhe: "1. O usuário solicita uma página. 2. A aplicação gera os dados. 3. A camada de transporte organiza os dados e acrescenta informações de controle. 4. A camada de rede adiciona os endereços IP. 5. A camada de enlace cria os quadros e utiliza endereços MAC. 6. A camada física transforma os dados em sinais. 7. Os sinais percorrem o meio de transmissão. 8. O dispositivo de destino recebe os sinais. 9. O processo de desencapsulamento acontece. 10. A aplicação finalmente apresenta a página ao usuário."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo 2 — Download e upload",
          texto: "Se um arquivo está armazenado em um servidor, a transferência Servidor → Cliente é chamada de **Download**. Se o usuário envia um arquivo para o servidor, a transferência Cliente → Servidor é chamada de **Upload**."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo 3 — Cliente-servidor",
          texto: "Um computador solicita uma página Web. O computador atua como **cliente**; o servidor Web recebe a solicitação; o servidor processa a solicitação; o servidor envia a resposta. Isso caracteriza o modelo **cliente-servidor**."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo 4 — DNS",
          texto: "Em vez de o usuário precisar memorizar um endereço numérico, ele pode utilizar um nome. O **DNS** realiza a tradução entre o nome e o endereço utilizado pela rede."
        }
      ]
    },
    {
      id: "resumo",
      titulo: "Resumo final para revisão rápida",
      blocos: [
        {
          tipo: "destaque",
          texto: "O que é uma rede? **Conjunto de dispositivos interconectados para trocar informações e compartilhar recursos.**"
        },
        {
          tipo: "topico",
          titulo: "Componentes",
          lista: [
            "**Hosts:** utilizam a rede.",
            "**Dispositivos de interconexão:** conectam e encaminham a comunicação.",
            "**Meios de transmissão:** transportam os dados."
          ]
        },
        {
          tipo: "topico",
          titulo: "Meios de transmissão",
          lista: [
            "**Guiados:** par trançado, coaxial, fibra óptica.",
            "**Não guiados:** rádio, micro-ondas, infravermelho, satélite."
          ]
        },
        {
          tipo: "topico",
          titulo: "Tipos de rede",
          lista: [
            "**LAN → Local**",
            "**MAN → Metropolitana**",
            "**WAN → Ampla**"
          ]
        },
        {
          tipo: "topico",
          titulo: "IPv4 x IPv6",
          lista: [
            "**IPv4 → 32 bits → decimal**",
            "**IPv6 → 128 bits → hexadecimal**"
          ]
        },
        {
          tipo: "topico",
          titulo: "Cliente-servidor x P2P",
          lista: [
            "**Cliente-servidor → centralizado**",
            "**P2P → descentralizado**"
          ]
        },
        {
          tipo: "topico",
          titulo: "Serviços",
          lista: [
            "**Web → HTTP**",
            "**E-mail → SMTP, POP, IMAP**",
            "**Transferência de arquivos → FTP**",
            "**Nomes → DNS**"
          ]
        },
        {
          tipo: "topico",
          titulo: "OSI",
          lista: [
            "**7 Aplicação**",
            "**6 Apresentação**",
            "**5 Sessão**",
            "**4 Transporte**",
            "**3 Rede**",
            "**2 Enlace**",
            "**1 Física**"
          ]
        },
        {
          tipo: "topico",
          titulo: "Funções-chave do OSI",
          lista: [
            "**Aplicação:** serviços/interface",
            "**Apresentação:** tradução, criptografia, compressão",
            "**Sessão:** controle do diálogo",
            "**Transporte:** confiabilidade e fluxo",
            "**Rede:** IP e roteamento",
            "**Enlace:** acesso ao meio e erros",
            "**Física:** bits e meio físico"
          ]
        },
        {
          tipo: "topico",
          titulo: "TCP/IP",
          lista: [
            "**5 Aplicação**",
            "**4 Transporte**",
            "**3 Rede/Internet**",
            "**2 Enlace**",
            "**1 Física**"
          ]
        },
        {
          tipo: "texto",
          texto: "A camada **Aplicação do TCP/IP** reúne as funções de **Aplicação + Apresentação + Sessão do OSI**."
        },
        {
          tipo: "destaque",
          texto: "Decore esta sequência de encapsulamento: **DADOS → SEGMENTO/DATAGRAMA → PACOTE → QUADRO → SINAIS**. No emissor, os dados são **encapsulados**. No receptor, ocorre o **desencapsulamento**."
        },
        {
          tipo: "lista",
          titulo: "🎯 Pontos com maior potencial de cobrança — priorize se tiver pouco tempo para estudar",
          itens: [
            "As 7 camadas do modelo OSI e suas funções",
            "As 5 camadas do TCP/IP e suas funções",
            "Diferenças entre OSI e TCP/IP",
            "Encapsulamento e desencapsulamento",
            "IPv4 = 32 bits x IPv6 = 128 bits",
            "LAN x MAN x WAN",
            "Cliente-servidor x P2P",
            "Topologias de rede",
            "DNS, HTTP, FTP e protocolos de e-mail",
            "Dispositivos finais x dispositivos de interconexão x meios de transmissão"
          ]
        }
      ]
    }
  ]},
  {aula: "Redes de Computadores II — Aula 2: Camadas Física e de Enlace",
  ideia_central: "A aula aborda as funções das camadas Física e de Enlace do modelo OSI, cobrindo sinais analógicos e digitais, suas características, formas de transmissão, perdas e degradações do sinal, limites teóricos da taxa de dados (Nyquist e Shannon), desempenho de rede, e os mecanismos de detecção e correção de erros e controle de fluxo utilizados na camada de Enlace, incluindo os protocolos ARQ.",
  secoes: [
    {
      id: "visao",
      titulo: "Visão geral do conteúdo",
      blocos: [
        {
          tipo: "texto",
          texto: "Material: **Redes de Computadores II — Aula 2: Camadas física e de enlace**, com 69 páginas. O conteúdo aborda as funções das camadas Física e de Enlace, sinais, transmissão, desempenho, erros, mecanismos de correção, controle de fluxo e protocolos ARQ."
        },
        {
          tipo: "texto",
          texto: "A aula trata de duas camadas do modelo **OSI**: a **Camada Física**, responsável pela transmissão e recepção de **bits**, transformando-os em sinais elétricos, ópticos ou eletromagnéticos e transportando-os pelo meio físico; e a **Camada de Enlace**, que organiza os bits em **frames (quadros)** e acrescenta mecanismos para endereçamento, controle de fluxo, controle de erros e acesso ao meio."
        },
        {
          tipo: "texto",
          texto: "A primeira parte da aula concentra-se na **Camada Física** e nos conceitos relacionados à transmissão de sinais. Depois, o conteúdo passa para a **Camada de Enlace**, especialmente mecanismos de confiabilidade e controle de fluxo."
        }
      ]
    },
    {
      id: "camada_fisica",
      titulo: "Camada Física",
      blocos: [
        {
          tipo: "texto",
          texto: "A **Camada Física** é a primeira camada do modelo OSI. Sua responsabilidade é transmitir e receber **bits** através do meio de transmissão, convertendo-os em sinais adequados à tecnologia utilizada: sinais elétricos, sinais ópticos e sinais eletromagnéticos."
        },
        {
          tipo: "destaque",
          texto: "A principal diferença para a camada de enlace é: **Física → preocupa-se com como os bits são representados e transportados.** **Enlace → preocupa-se com a organização e o controle dos dados.**"
        },
        {
          tipo: "topico",
          titulo: "Principais funções da camada Física",
          lista: [
            "Converte bits em sinais",
            "Transmite e recebe bits",
            "Define características físicas da transmissão",
            "Especifica cabos, conectores e interfaces",
            "Determina a taxa de transmissão",
            "Define a sincronização entre transmissor e receptor",
            "Especifica o modo de transmissão: **Simplex**, **Half-duplex**, **Full-duplex**"
          ]
        }
      ]
    },
    {
      id: "sinais_analogicos",
      titulo: "Sinais analógicos",
      blocos: [
        {
          tipo: "texto",
          texto: "Um **sinal analógico** possui infinitos níveis de intensidade ao longo do tempo. Sua variação é **contínua**, passando por todos os valores entre dois pontos. Graficamente, aparece como uma **curva contínua**."
        },
        {
          tipo: "imagem",
          src: "sinais_analogicos.png",
          pasta: "imagens_redes2/aula_02",
          alt: "Representação gráfica de um sinal analógico como uma variação contínua ao longo do tempo, ajudando a visualizar a diferença entre valores contínuos e discretos. (Página 7)",
          num: 1
        },
        {
          tipo: "topico",
          titulo: "Sinais analógicos periódicos",
          lista: [
            "**Simples:** representados por uma única onda senoidal e não podem ser decompostos em sinais mais simples.",
            "**Compostos:** formados pela combinação de várias ondas senoidais."
          ]
        },
        {
          tipo: "texto",
          texto: "A **onda senoidal** é apresentada no material como a forma mais fundamental de um sinal analógico periódico."
        }
      ]
    },
    {
      id: "sinais_digitais",
      titulo: "Sinais digitais",
      blocos: [
        {
          tipo: "texto",
          texto: "Um **sinal digital** possui um número limitado de valores, normalmente representados por **0 e 1**. Sua variação é **discreta**, acontecendo em saltos entre valores definidos. Graficamente, pode aparecer como degraus ou mudanças abruptas."
        },
        {
          tipo: "imagem",
          src: "sinais_digitais.png",
          pasta: "imagens_redes2/aula_02",
          alt: "Representa a variação discreta de um sinal digital, associada aos valores definidos para representar os dados. (Página 8)",
          num: 2
        },
        {
          tipo: "tabela",
          titulo: "Diferença essencial entre sinal analógico e digital",
          colunas: ["Analógico", "Digital"],
          linhas: [
            ["Variação contínua", "Variação discreta"],
            ["Infinitos níveis possíveis", "Número limitado de valores"],
            ["Representado por curvas", "Pode ser representado por degraus"]
          ]
        }
      ]
    },
    {
      id: "caracteristicas_analogicas",
      titulo: "Características dos sinais analógicos",
      blocos: [
        {
          tipo: "topico",
          titulo: "Amplitude",
          texto: "A **amplitude máxima (A)** é o valor absoluto da maior intensidade do sinal. Ela é proporcional à energia transportada pelo sinal."
        },
        {
          tipo: "imagem",
          src: "amplitude_sinal_analogico.png",
          pasta: "imagens_redes2/aula_02",
          alt: "Mostra graficamente a amplitude de um sinal, auxiliando na compreensão da intensidade máxima da onda. (Página 10)",
          num: 3
        },
        {
          tipo: "topico",
          titulo: "Período",
          texto: "O **período (T)** é o tempo, em segundos, necessário para completar **um ciclo**."
        },
        {
          tipo: "topico",
          titulo: "Frequência",
          texto: "A **frequência** representa o número de períodos/ciclos realizados em **1 segundo**."
        },
        {
          tipo: "topico",
          titulo: "Fase",
          texto: "A **fase** descreve a posição da forma de onda em relação ao instante **0**."
        },
        {
          tipo: "topico",
          titulo: "Comprimento de onda",
          texto: "O **comprimento de onda** relaciona o período ou a frequência com a velocidade de propagação. É a **distância física percorrida pela onda durante um ciclo completo**."
        }
      ]
    },
    {
      id: "largura_banda",
      titulo: "Largura de banda",
      blocos: [
        {
          tipo: "texto",
          texto: "Em um sinal composto, a **largura de banda** corresponde ao intervalo de frequências contido no sinal. Normalmente, é obtida pela diferença entre duas frequências."
        },
        {
          tipo: "texto",
          texto: "O material também apresenta que, pela análise de Fourier, um sinal digital possui **largura de banda infinita**, pois sua representação produz um conjunto infinito de ondas senoidais com frequências crescentes."
        }
      ]
    },
    {
      id: "transmissao_digital",
      titulo: "Transmissão de sinais digitais",
      blocos: [
        {
          tipo: "texto",
          texto: "O material apresenta duas formas principais: Banda Base e Banda Larga."
        },
        {
          tipo: "topico",
          titulo: "Banda Base",
          texto: "O sinal digital é transmitido **diretamente**, sem conversão para sinal analógico.",
          lista: [
            "Utiliza canal passa-baixas",
            "A faixa de frequência começa em **0 Hz**",
            "É comum em redes locais, como Ethernet",
            "Exemplo apresentado: cabo de rede conectando computadores"
          ]
        },
        {
          tipo: "imagem",
          src: "transmissao_banda_base.png",
          pasta: "imagens_redes2/aula_02",
          alt: "Representa visualmente o processo de transmissão de um sinal digital em banda base. (Página 17)",
          num: 4
        },
        {
          tipo: "topico",
          titulo: "Banda Larga",
          texto: "O sinal digital é convertido em sinal analógico através de **modulação**.",
          lista: [
            "Utiliza canal passa-faixa",
            "A faixa de frequência não começa em 0 Hz",
            "Permite transmissão em meios compartilhados e longas distâncias",
            "O material apresenta como exemplo a Internet por fibra óptica"
          ]
        },
        {
          tipo: "imagem",
          src: "transmissao_banda_larga.png",
          pasta: "imagens_redes2/aula_02",
          alt: "Representa a transmissão em banda larga, associada à conversão do sinal digital por modulação. (Página 18)",
          num: 5
        }
      ]
    },
    {
      id: "taxa_transferencia",
      titulo: "Taxa de transferência",
      blocos: [
        {
          tipo: "texto",
          texto: "Como muitos sinais digitais são **não periódicos**, frequência e período não são as características mais adequadas para descrevê-los. Utiliza-se então a **taxa de transferência**: número de bits enviados em 1 segundo. Sua unidade é **bits por segundo (bps)**."
        },
        {
          tipo: "topico",
          titulo: "Unidades utilizadas",
          texto: "O material utiliza a base decimal.",
          lista: [
            "**1 kb = 1.000 bits**",
            "**1 Mb = 1.000.000 bits**",
            "**1 Gb = 1.000.000.000 bits**"
          ]
        }
      ]
    },
    {
      id: "perdas_transmissao",
      titulo: "Perdas na transmissão",
      blocos: [
        {
          tipo: "texto",
          texto: "Os meios de transmissão não são perfeitos. Portanto, o sinal recebido pode ser diferente daquele que foi enviado. O material destaca três causas principais: **Atenuação**, **Distorção** e **Ruído**."
        },
        {
          tipo: "imagem",
          src: "perda_transmissao.png",
          pasta: "imagens_redes2/aula_02",
          alt: "Representa a alteração sofrida pelo sinal durante sua passagem pelo meio de transmissão, contextualizando as perdas apresentadas na aula. (Página 21)",
          num: 6
        },
        {
          tipo: "topico",
          titulo: "Atenuação",
          texto: "É a **perda de energia** do sinal durante sua propagação pelo meio. O sinal perde parte de sua energia para superar a resistência do meio de transmissão."
        },
        {
          tipo: "topico",
          titulo: "Distorção",
          texto: "É a **alteração da forma original do sinal**. Em sinais compostos, diferentes frequências podem sofrer velocidades ou atrasos diferentes, fazendo com que seus componentes cheguem em momentos distintos. Isso altera a fase e, consequentemente, o formato do sinal."
        },
        {
          tipo: "topico",
          titulo: "Ruído",
          texto: "É qualquer **sinal indesejado** que se mistura ao sinal transmitido e pode alterar ou corromper a informação."
        }
      ]
    },
    {
      id: "decibel",
      titulo: "Decibel (dB)",
      blocos: [
        {
          tipo: "texto",
          texto: "O **decibel (dB)** é utilizado para medir a variação de potência de um sinal. Ele não representa a potência absoluta, mas a **relação entre a potência do sinal em dois pontos**."
        },
        {
          tipo: "lista",
          itens: [
            "**+ dB:** houve amplificação.",
            "**− dB:** houve atenuação.",
            "**0 dB:** a potência permaneceu igual."
          ]
        },
        {
          tipo: "topico",
          titulo: "Fórmula",
          texto: "dB = 10·log₁₀(P₂/P₁), onde P₁ = potência em um ponto e P₂ = potência em outro ponto."
        }
      ]
    },
    {
      id: "snr",
      titulo: "Relação Sinal/Ruído — SNR",
      blocos: [
        {
          tipo: "texto",
          texto: "Durante uma transmissão, o receptor recebe o **sinal**, que contém a informação desejada, e o **ruído**, que representa uma interferência indesejada. O objetivo é que o sinal seja significativamente mais forte que o ruído. A **SNR (Signal-to-Noise Ratio)** mede essa relação."
        },
        {
          tipo: "topico",
          titulo: "Fórmulas",
          texto: "SNR = potência média do sinal / potência média do ruído. Para expressar em decibéis: SNR_dB = 10·log₁₀(SNR)."
        }
      ]
    },
    {
      id: "limite_taxa_dados",
      titulo: "Limite da taxa de dados",
      blocos: [
        {
          tipo: "texto",
          texto: "A velocidade máxima de transmissão de dados depende principalmente de: **largura de banda do canal**, **número de níveis do sinal** e **qualidade do canal**."
        },
        {
          tipo: "texto",
          texto: "Quanto maior a largura de banda, maior tende a ser a quantidade de dados transmitida. Quanto maior o número de níveis distintos, maior a quantidade de bits que pode ser representada por símbolo. Quanto maior o ruído, maior tende a ser a possibilidade de erros e menor a taxa máxima de transmissão."
        },
        {
          tipo: "topico",
          titulo: "Teorema de Nyquist",
          texto: "Aplica-se a **canais ideais, sem ruído**. Relaciona a taxa máxima de dados com a largura de banda e o número de níveis do sinal: Taxa de Transferência = 2 × largura de banda × log₂ L, onde **L** representa o número de níveis do sinal utilizados para representar os dados."
        },
        {
          tipo: "topico",
          titulo: "Teorema de Shannon",
          texto: "Aplica-se a **canais reais, com ruído**. Relaciona a capacidade máxima com a largura de banda e a SNR: Capacidade = largura de banda × log₂(1+SNR)."
        },
        {
          tipo: "destaque",
          texto: "Para prova: **Nyquist → canal ideal/sem ruído → largura de banda + níveis do sinal.** **Shannon → canal real/com ruído → largura de banda + SNR.**"
        }
      ]
    },
    {
      id: "hertz",
      titulo: "Hertz",
      blocos: [
        {
          tipo: "texto",
          texto: "**Hertz (Hz)** é a unidade de frequência. Representa quantas vezes um evento se repete em um segundo e, em redes e telecomunicações, é utilizado para medir a frequência de sinais eletromagnéticos ou elétricos."
        }
      ]
    },
    {
      id: "desempenho_rede",
      titulo: "Desempenho da rede",
      blocos: [
        {
          tipo: "topico",
          titulo: "Throughput",
          texto: "O **throughput** representa a rapidez com que os dados podem ser **realmente enviados pela rede**. É importante diferenciar a capacidade/taxa teórica de uma rede da quantidade de dados que efetivamente consegue transmitir."
        },
        {
          tipo: "topico",
          titulo: "Latência",
          texto: "A **latência ou retardo** corresponde ao tempo necessário para que uma mensagem inteira chegue ao destino, desde o momento em que o primeiro bit é enviado. O material apresenta: Latência = tempo de propagação + tempo de transmissão + tempo de fila + retardo de processamento."
        },
        {
          tipo: "topico",
          titulo: "Tempo de propagação",
          texto: "É o tempo necessário para um **bit** percorrer a distância entre origem e destino. Tempo de propagação = Distância / Velocidade de propagação."
        },
        {
          tipo: "topico",
          titulo: "Tempo de transmissão",
          texto: "É o tempo necessário para o transmissor colocar **todos os bits da mensagem** no meio de transmissão. Depende de quantidade de bits e taxa de transmissão do canal. O material apresenta a fórmula: Tempo de transmissão = Tamanho da mensagem / Largura de banda."
        }
      ]
    },
    {
      id: "camada_enlace",
      titulo: "Camada de Enlace",
      blocos: [
        {
          tipo: "texto",
          texto: "A camada de Enlace recebe o fluxo de bits e organiza esses dados em unidades chamadas **frames (quadros)**."
        },
        {
          tipo: "topico",
          titulo: "1. Framing",
          texto: "Divide o fluxo de bits recebido da camada de rede em **frames** gerenciáveis."
        },
        {
          tipo: "topico",
          titulo: "2. Endereçamento",
          texto: "Adiciona um cabeçalho ao frame contendo os endereços do emissor e receptor."
        },
        {
          tipo: "topico",
          titulo: "3. Controle de fluxo",
          texto: "Evita que um receptor seja sobrecarregado quando consegue absorver dados em uma velocidade menor que a velocidade de produção do emissor."
        },
        {
          tipo: "topico",
          titulo: "4. Controle de erros",
          texto: "Adiciona mecanismos de detecção e retransmissão para frames corrompidos, duplicados ou perdidos."
        },
        {
          tipo: "topico",
          titulo: "5. Controle de acesso ao meio",
          texto: "Quando vários dispositivos compartilham um mesmo link, determina qual dispositivo terá o controle do meio em determinado momento."
        }
      ]
    },
    {
      id: "erros_correcao",
      titulo: "Erros e métodos de correção",
      blocos: [
        {
          tipo: "texto",
          texto: "Durante a transmissão, o sinal pode sofrer ruído, interferências eletromagnéticas, atenuação e distorção. Esses fenômenos podem comprometer a integridade dos dados."
        },
        {
          tipo: "topico",
          titulo: "Erro de bit",
          texto: "Ocorre quando **um único bit** é alterado: 0 → 1 ou 1 → 0."
        },
        {
          tipo: "topico",
          titulo: "Erro em rajada",
          texto: "Ocorre quando **dois ou mais bits consecutivos** são corrompidos. O material destaca que esse é o tipo de erro mais frequente em redes de computadores."
        },
        {
          tipo: "texto",
          texto: "Para identificar ou recuperar dados corrompidos, o transmissor pode adicionar **bits redundantes**. Existem duas estratégias principais: **Detecção de erros**, que permite identificar que ocorreu um erro, e **Correção de erros**, que permite recuperar/corrigir a informação."
        },
        {
          tipo: "lista",
          titulo: "A correção pode ocorrer",
          itens: [
            "**sem retransmissão — FEC**",
            "**com retransmissão — ARQ**"
          ]
        },
        {
          tipo: "lista",
          titulo: "Principais técnicas apresentadas no material",
          itens: [
            "**Bit de Paridade**",
            "**Checksum**",
            "**CRC**",
            "**Códigos de Hamming**",
            "**ARQ**"
          ]
        }
      ]
    },
    {
      id: "bit_paridade",
      titulo: "Bit de paridade",
      blocos: [
        {
          tipo: "texto",
          texto: "Adiciona **1 bit extra** para fazer com que a quantidade de bits 1 seja par ou ímpar."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de bit de paridade",
          texto: "Mensagem: `1011001`. Quantidade de 1s = 4. Como já é par, Bit de paridade = 0.",
          detalhe: "Mensagem transmitida: `10110010`"
        }
      ]
    },
    {
      id: "checksum",
      titulo: "Checksum",
      blocos: [
        {
          tipo: "texto",
          texto: "O **checksum** divide a mensagem em blocos de bits e soma esses blocos. O resultado, após o processo de complemento, é enviado junto com a mensagem. No receptor, a soma é refeita para verificar se o resultado corresponde ao esperado."
        },
        {
          tipo: "texto",
          texto: "O material também apresenta o uso da **aritmética de complemento de 1**, na qual os bits são invertidos: 0 → 1, 1 → 0."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de cálculo de checksum",
          texto: "Há um exemplo de cálculo usando o texto \"Forouzan\", ASCII e palavras de 16 bits."
        }
      ]
    },
    {
      id: "crc",
      titulo: "CRC — Cyclic Redundancy Check",
      blocos: [
        {
          tipo: "texto",
          texto: "O **CRC** funciona como uma espécie de assinatura matemática da mensagem. Baseia-se em polinômios e utiliza um **polinômio gerador (G(x))** conhecido pelo emissor e pelo receptor."
        },
        {
          tipo: "topico",
          titulo: "No emissor",
          lista: [
            "Obtém a mensagem original em bits",
            "Adiciona zeros à direita",
            "A quantidade de zeros corresponde ao grau do polinômio gerador",
            "Divide a sequência pelo polinômio gerador usando divisão binária/XOR",
            "O resto da divisão é o **CRC**",
            "O CRC é anexado à mensagem"
          ]
        },
        {
          tipo: "destaque",
          texto: "Resultado: **quadro transmitido = mensagem original + CRC**"
        },
        {
          tipo: "topico",
          titulo: "No receptor",
          lista: [
            "Recebe mensagem + CRC",
            "Divide novamente pelo mesmo polinômio gerador",
            "Se o resto for **0**, o material considera que não houve erro",
            "Se o resto for **diferente de 0**, um erro é detectado"
          ]
        },
        {
          tipo: "imagem",
          src: "crc_codificador.png",
          pasta: "imagens_redes2/aula_02",
          alt: "Mostra o processo de divisão binária de módulo 2 utilizado no codificador CRC, no qual operações XOR são usadas para obter os bits de verificação. (Página 48)",
          num: 7
        },
        {
          tipo: "topico",
          titulo: "Divisão módulo 2",
          texto: "A divisão do CRC utiliza **XOR** em vez das operações tradicionais de adição/subtração. O material descreve um processo sucessivo em que partes do dividendo são combinadas com o divisor por XOR até chegar ao resto, que forma os bits de verificação."
        },
        {
          tipo: "imagem",
          src: "crc_decodificador.png",
          pasta: "imagens_redes2/aula_02",
          alt: "Representa o processo realizado pelo receptor para verificar a palavra recebida e obter a síndrome utilizada na identificação de erros. (Página 49)",
          num: 8
        },
        {
          tipo: "lista",
          titulo: "No decodificador, o resto da divisão é chamado de síndrome",
          itens: [
            "síndrome formada apenas por 0 → palavra aceita",
            "síndrome diferente de zero → dados descartados"
          ]
        }
      ]
    },
    {
      id: "distancia_hamming",
      titulo: "Distância de Hamming",
      blocos: [
        {
          tipo: "texto",
          texto: "A **distância de Hamming** é o número de posições de bits diferentes entre duas palavras binárias de mesmo tamanho."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de distância de Hamming",
          texto: "Palavra A: `1011001`. Palavra B: `1010001`. Existe apenas uma posição diferente. Logo, d = 1."
        },
        {
          tipo: "lista",
          titulo: "Ela serve para",
          itens: [
            "Medir a diferença entre palavras de código",
            "Indicar quantos erros seriam necessários para transformar uma palavra em outra"
          ]
        }
      ]
    },
    {
      id: "codigo_hamming",
      titulo: "Código de Hamming",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Código de Hamming** utiliza bits de paridade para aumentar a distância entre palavras válidas, permitindo detectar e corrigir erros."
        },
        {
          tipo: "texto",
          texto: "O material apresenta que o código de Hamming clássico possui **distância mínima 3**, possibilitando **corrigir 1 erro de bit** e **detectar até 2 erros de bits**. Foi criado por **Richard Hamming em 1950**."
        },
        {
          tipo: "texto",
          texto: "Os bits de paridade são colocados em posições específicas e cada um verifica determinados conjuntos de posições. A combinação dos resultados permite identificar a posição de um erro de um bit."
        },
        {
          tipo: "topico",
          titulo: "Posições dos bits de paridade",
          texto: "Os bits de paridade ficam em posições que são **potências de 2**: posição 1, posição 2, posição 4, posição 8, etc. As demais posições são utilizadas pelos bits de dados."
        },
        {
          tipo: "imagem",
          src: "cobertura_bits_paridade_hamming.png",
          pasta: "imagens_redes2/aula_02",
          alt: "Representa quais posições são verificadas por cada bit de paridade no Código de Hamming. (Página 53)",
          num: 9
        },
        {
          tipo: "lista",
          titulo: "Cobertura dos bits de paridade",
          itens: [
            "**P1 → posição 1:** cobre 1, 3, 5, 7, 9...",
            "**P2 → posição 2:** cobre 2, 3, 6, 7, 10, 11...",
            "**P4 → posição 4:** cobre 4, 5, 6, 7, 12, 13, 14, 15..."
          ]
        },
        {
          tipo: "imagem",
          src: "exemplo_codigo_hamming.png",
          pasta: "imagens_redes2/aula_02",
          alt: "Apresenta visualmente a distribuição dos bits de dados e de paridade e o cálculo das paridades para formar a palavra transmitida. (Página 54)",
          num: 10
        },
        {
          tipo: "topico",
          titulo: "Relação entre bits",
          texto: "O material apresenta: n = 2^m − 1 e k = n − m, onde k = número de bits de dados; m = número de bits de verificação/redundância; n = número total de bits; r = m = número de bits de verificação."
        }
      ]
    },
    {
      id: "arq",
      titulo: "ARQ — Automatic Repeat Request",
      blocos: [
        {
          tipo: "texto",
          texto: "O **ARQ** utiliza retransmissão para lidar com erros."
        },
        {
          tipo: "topico",
          titulo: "Funcionamento básico",
          lista: [
            "O emissor envia um frame",
            "O receptor verifica se há erro",
            "Se estiver correto → envia **ACK**",
            "Se houver erro/perda → pode enviar **NACK** ou não responder",
            "Se o emissor não receber ACK dentro do **timeout**, retransmite o frame"
          ]
        },
        {
          tipo: "lista",
          titulo: "Termos importantes",
          itens: [
            "**ACK:** Acknowledgment → confirmação.",
            "**NACK:** Negative Acknowledgment → confirmação negativa.",
            "**Timeout:** tempo limite de espera por uma resposta."
          ]
        }
      ]
    },
    {
      id: "controle_fluxo",
      titulo: "Controle de fluxo",
      blocos: [
        {
          tipo: "texto",
          texto: "O **controle de fluxo** é o conjunto de procedimentos utilizado para controlar quanto o emissor pode enviar antes de receber confirmação dos dados transmitidos. Ele evita que um emissor envie dados mais rapidamente do que o receptor consegue processar."
        },
        {
          tipo: "texto",
          texto: "Em protocolos reais, informações de controle como **ACKs e NAKs** podem ser incorporadas aos próprios frames de dados através de uma técnica chamada **piggybacking**."
        }
      ]
    },
    {
      id: "protocolos_canais_sem_ruido",
      titulo: "Protocolos para canais sem ruído",
      blocos: [
        {
          tipo: "texto",
          texto: "Consideram que os bits transmitidos chegam ao destino sem erros. Portanto, não precisam de controle de erros e concentram-se no controle de fluxo, quando necessário."
        },
        {
          tipo: "topico",
          titulo: "Protocolo mais simples possível",
          texto: "É unidirecional e não possui controle de erros nem controle de fluxo. O emissor envia frames continuamente e o receptor consegue processá-los imediatamente."
        },
        {
          tipo: "topico",
          titulo: "Stop-and-Wait",
          texto: "Adiciona controle de fluxo. Funcionamento: 1) emissor envia um frame; 2) espera o ACK; 3) depois do ACK, envia o próximo frame. Isso impede que o receptor fique sobrecarregado."
        },
        {
          tipo: "imagem",
          src: "stop_and_wait_sem_ruido.png",
          pasta: "imagens_redes2/aula_02",
          alt: "Representa a sequência de envio de frames e confirmações no protocolo Stop-and-Wait. (Página 60)",
          num: 11
        },
        {
          tipo: "destaque",
          texto: "Limitação: o Stop-and-Wait é considerado impraticável em redes reais quando há ruído, pois o modelo apresentado pressupõe um canal sem erros."
        }
      ]
    },
    {
      id: "protocolos_canais_com_ruido",
      titulo: "Protocolos para canais com ruído",
      blocos: [
        {
          tipo: "texto",
          texto: "Quando existe possibilidade de corrupção dos dados, são necessários: **controle de erros**, **controle de fluxo**, normalmente mecanismos de **ARQ**."
        },
        {
          tipo: "lista",
          titulo: "O material apresenta três tipos principais",
          itens: [
            "**Stop-and-Wait ARQ**",
            "**Go-Back-N ARQ**",
            "**Selective Repeat ARQ**"
          ]
        }
      ]
    },
    {
      id: "stop_and_wait_arq",
      titulo: "Stop-and-Wait ARQ",
      blocos: [
        {
          tipo: "texto",
          texto: "É uma versão do Stop-and-Wait preparada para lidar com erros. Cada frame recebe um **número de sequência**, permitindo identificar frames perdidos ou duplicados."
        },
        {
          tipo: "lista",
          titulo: "O emissor",
          itens: [
            "Mantém uma cópia do frame",
            "Espera o ACK correspondente",
            "Utiliza um timer",
            "Se o timer expirar sem ACK, retransmite o frame"
          ]
        },
        {
          tipo: "texto",
          texto: "O próprio ACK também pode ser perdido ou corrompido, por isso possui informações de redundância e número de sequência."
        },
        {
          tipo: "imagem",
          src: "stop_and_wait_arq.png",
          pasta: "imagens_redes2/aula_02",
          alt: "Representa o funcionamento do Stop-and-Wait ARQ, incluindo envio, espera por confirmação e retransmissão quando necessário. (Página 63)",
          num: 12
        },
        {
          tipo: "destaque",
          texto: "Principal desvantagem: é **ineficiente**, porque somente um frame aguarda confirmação por vez. Dessa forma, o canal pode permanecer ocioso durante boa parte do tempo."
        }
      ]
    },
    {
      id: "go_back_n",
      titulo: "Go-Back-N ARQ",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Go-Back-N ARQ** utiliza uma **janela deslizante**. Isso permite transmitir vários frames antes de esperar confirmações. O transmissor pode enviar até **N frames** sem esperar ACK, mantendo-os em um buffer."
        },
        {
          tipo: "topico",
          titulo: "ACKs acumulativos",
          texto: "O receptor informa qual é o próximo frame esperado."
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo de ACK acumulativo",
          texto: "Se recebeu corretamente até o frame 4: ACK = 5. Isso significa que o receptor espera o frame 5."
        },
        {
          tipo: "topico",
          titulo: "O que acontece com um erro?",
          texto: "Se o receptor detectar erro no frame i: descarta esse frame; descarta os seguintes; mesmo que alguns dos seguintes tenham chegado corretamente. Depois, o transmissor retransmite a partir do frame com erro."
        },
        {
          tipo: "imagem",
          src: "go_back_n_arq.png",
          pasta: "imagens_redes2/aula_02",
          alt: "Representa a janela de transmissão e o comportamento do protocolo diante de frames enviados e confirmados. (Página 66)",
          num: 13
        },
        {
          tipo: "destaque",
          texto: "Ideia principal: **Go-Back-N → ocorreu um erro → volta e retransmite a partir daquele frame.**"
        }
      ]
    },
    {
      id: "selective_repeat",
      titulo: "Selective Repeat ARQ",
      blocos: [
        {
          tipo: "texto",
          texto: "O **Selective Repeat ARQ** também utiliza janela deslizante, mas é mais eficiente que o Go-Back-N."
        },
        {
          tipo: "destaque",
          texto: "Sua principal diferença: **Somente os frames perdidos ou corrompidos são retransmitidos.** Os frames corretos não precisam ser descartados."
        },
        {
          tipo: "topico",
          titulo: "Funcionamento",
          texto: "O emissor pode enviar vários frames e mantém cópias em buffer até receber as confirmações."
        },
        {
          tipo: "lista",
          titulo: "O receptor",
          itens: [
            "Possui uma janela de recebimento",
            "Pode receber frames fora de ordem",
            "Armazena temporariamente frames corretos enquanto aguarda o frame faltante",
            "Envia ACK individual para cada frame recebido corretamente"
          ]
        },
        {
          tipo: "imagem",
          src: "selective_repeat_arq.png",
          pasta: "imagens_redes2/aula_02",
          alt: "Representa o funcionamento do Selective Repeat, em que frames podem ser tratados individualmente e apenas os que apresentam problemas são retransmitidos. (Página 69)",
          num: 14
        },
        {
          tipo: "destaque",
          texto: "Quando um frame não é confirmado dentro do timeout: **somente esse frame é retransmitido.**"
        }
      ]
    },
    {
      id: "comparacao_protocolos",
      titulo: "Comparação dos protocolos",
      blocos: [
        {
          tipo: "tabela",
          titulo: "Comparação dos protocolos de controle de fluxo e erro",
          colunas: ["Protocolo", "Característica principal"],
          linhas: [
            ["Protocolo mais simples", "Sem controle de fluxo e sem controle de erros"],
            ["Stop-and-Wait", "Envia um frame e espera ACK"],
            ["Stop-and-Wait ARQ", "Stop-and-Wait + tratamento de erros + retransmissão"],
            ["Go-Back-N ARQ", "Vários frames em janela; retransmite a partir do erro"],
            ["Selective Repeat ARQ", "Vários frames em janela; retransmite somente os frames com erro/perdidos"]
          ]
        },
        {
          tipo: "destaque",
          texto: "Para memorizar: **Stop-and-Wait:** 1 frame → espera → ACK → próximo. **Go-Back-N:** vários frames → erro → volta a partir do erro. **Selective Repeat:** vários frames → erro → retransmite somente o que deu problema."
        }
      ]
    },
    {
      id: "resumo",
      titulo: "Resumo final para revisão rápida",
      blocos: [
        {
          tipo: "topico",
          titulo: "🟦 Camada Física",
          texto: "**Responsável por:** bits + sinais + meio físico.",
          lista: [
            "Transmite/recebe bits",
            "Trabalha com sinais elétricos, ópticos e eletromagnéticos",
            "Define cabos, conectores, interfaces, sincronização e taxa",
            "Modos: **simplex, half-duplex e full-duplex**"
          ]
        },
        {
          tipo: "topico",
          titulo: "🟦 Sinais",
          texto: "**Analógico:** contínuo. **Digital:** discreto, normalmente 0 e 1.",
          lista: [
            "Amplitude",
            "Período",
            "Frequência",
            "Fase",
            "Comprimento de onda",
            "Largura de banda"
          ]
        },
        {
          tipo: "topico",
          titulo: "🟦 Transmissão digital",
          texto: "**Banda Base:** sinal digital transmitido diretamente. **Banda Larga:** sinal digital convertido por modulação."
        },
        {
          tipo: "topico",
          titulo: "🟦 Problemas na transmissão",
          texto: "**Atenuação:** perda de energia. **Distorção:** alteração da forma do sinal. **Ruído:** interferência indesejada."
        },
        {
          tipo: "topico",
          titulo: "🟦 dB",
          texto: "dB = 10·log₁₀(P₂/P₁). Positivo → amplificação; negativo → atenuação; zero → mesma potência."
        },
        {
          tipo: "topico",
          titulo: "🟦 SNR",
          texto: "SNR = P_sinal / P_ruído. SNR_dB = 10·log₁₀(SNR). Quanto mais forte o sinal em relação ao ruído, melhor a relação sinal/ruído."
        },
        {
          tipo: "topico",
          titulo: "🟦 Nyquist × Shannon",
          texto: "**Nyquist:** canal ideal, sem ruído → 2B·log₂L. **Shannon:** canal real, com ruído → B·log₂(1+SNR)."
        },
        {
          tipo: "topico",
          titulo: "🟦 Desempenho",
          texto: "**Throughput:** quantidade/rapidez efetivamente obtida na transmissão. **Latência:** L = T_prop + T_trans + T_fila + T_proc. **Tempo de propagação:** T_prop = distância/velocidade. **Tempo de transmissão:** depende do tamanho da mensagem e da taxa do canal."
        },
        {
          tipo: "topico",
          titulo: "🟩 Camada de Enlace",
          texto: "Principais funções: **Framing → Endereçamento → Controle de fluxo → Controle de erros → Controle de acesso ao meio.**"
        },
        {
          tipo: "topico",
          titulo: "🟩 Erros",
          texto: "**Erro de bit:** um bit alterado. **Erro em rajada:** dois ou mais bits consecutivos corrompidos."
        },
        {
          tipo: "topico",
          titulo: "🟩 Detecção/correção",
          lista: [
            "**Paridade:** adiciona um bit.",
            "**Checksum:** soma blocos e verifica o resultado.",
            "**CRC:** divisão binária/XOR e verificação do resto.",
            "**Hamming:** adiciona bits de paridade e pode corrigir erro de 1 bit.",
            "**ARQ:** detecta e solicita retransmissão."
          ]
        },
        {
          tipo: "topico",
          titulo: "🟩 Hamming",
          texto: "Bits de paridade ficam nas posições **1, 2, 4, 8, 16...**, ou seja, posições que são **potências de 2**. Código clássico: distância mínima = **3**; corrige **1 erro**; detecta até **2 erros**."
        },
        {
          tipo: "topico",
          titulo: "🟩 ARQ",
          texto: "**ACK:** confirmação. **NACK:** confirmação negativa. **Timeout:** tempo limite.",
          lista: [
            "**Stop-and-Wait ARQ:** um frame por vez.",
            "**Go-Back-N ARQ:** vários frames → ocorreu erro → retransmite a partir do erro.",
            "**Selective Repeat ARQ:** vários frames → ocorreu erro → retransmite somente o frame problemático."
          ]
        },
        {
          tipo: "destaque",
          texto: "Ponto-chave para prova: a grande diferença entre **Go-Back-N** e **Selective Repeat** é justamente o que acontece depois de um erro: o Go-Back-N retransmite o frame com problema e os posteriores; o Selective Repeat retransmite somente os frames perdidos/corrompidos."
        }
      ]
    }
  ]
}

  ]};