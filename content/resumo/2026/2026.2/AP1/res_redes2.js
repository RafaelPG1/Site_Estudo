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
  ]}

  ]};