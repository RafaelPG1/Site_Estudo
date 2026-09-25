/* =============================================
   NEXUS STUDY — redes2.js
   Disciplina: Redes 2
   ============================================= */

window.__nexusConteudo = {
  aulas: [
    // aula 1
    {
aula: "Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
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
  ]
    },
    // aula 2
    {
      aula: "Camadas físicas e de enlace",
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
    },
    // aula 3
    {
      aula: "Padrões IEEE e Redes locais (LANs)",
      ideia_central: "Os padrões IEEE 802 organizam a comunicação em redes locais, definindo mecanismos diferentes de acesso ao meio, transmissão e endereçamento para Ethernet, Wi-Fi e Bluetooth, enquanto o estudo das LANs envolve topologias, infraestrutura, endereçamento MAC/IP e criação de sub-redes.",
      secoes: [
        {
          id: "visao_geral",
          titulo: "Visão geral do conteúdo",
          blocos: [
            {
              tipo: "texto",
              texto: "O material aborda dois grandes temas relacionados."
            },
            {
              tipo: "topico",
              titulo: "1. Padrões IEEE 802",
              texto: "Com destaque para:",
              lista: [
                "IEEE 802.3 — Ethernet",
                "IEEE 802.11 — Wi-Fi",
                "IEEE 802.15 — Bluetooth"
              ]
            },
            {
              tipo: "topico",
              titulo: "2. Redes locais (LANs)",
              texto: "Envolvendo:",
              lista: [
                "conceito e características de uma LAN",
                "topologias",
                "equipamentos de infraestrutura",
                "endereçamento MAC e IP",
                "IPv4 e IPv6",
                "estrutura de endereçamento",
                "criação de sub-redes e cálculo de hosts"
              ]
            },
            {
              tipo: "destaque",
              texto: "O ponto central é compreender como os padrões IEEE organizam a comunicação em redes locais e como Ethernet, Wi-Fi e Bluetooth utilizam mecanismos diferentes para acesso ao meio, transmissão e endereçamento."
            }
          ]
        },
        {
          id: "projeto_ieee_802",
          titulo: "Padrões IEEE 802",
          blocos: [
            {
              tipo: "subtitulo",
              texto: "Projeto IEEE 802"
            },
            {
              tipo: "texto",
              texto: "Por volta de **1980**, a Computer Society do IEEE iniciou o **Projeto 802** com o objetivo de padronizar a intercomunicação entre equipamentos de diferentes fabricantes."
            },
            {
              tipo: "texto",
              texto: "O objetivo não era substituir os modelos **OSI** ou **Internet**, mas especificar funções conjuntas das camadas **Física** e **Enlace** para redes LAN."
            },
            {
              tipo: "lista",
              titulo: "A camada de Enlace foi dividida em duas subcamadas",
              itens: [
                "LLC — Logical Link Control",
                "MAC — Media Access Control"
              ]
            },
            {
              tipo: "texto",
              texto: "Em **1986/1987**, o padrão foi adotado pela ANSI. Em 1987, a ISO aprovou-o como padrão internacional sob a denominação **ISO 8802**."
            },
            {
              tipo: "topico",
              titulo: "LLC",
              texto: "A **LLC** é responsável pelo controle lógico da comunicação entre dispositivos. Suas funções apresentadas no material incluem:",
              lista: [
                "controle de fluxo, evitando sobrecarga de dados no receptor",
                "controle de erros, buscando garantir confiabilidade na transmissão",
                "parte do framing, relacionado à definição da unidade de dados transmitida"
              ]
            },
            {
              tipo: "destaque",
              texto: "Uma característica importante é que o LLC é **independente do tipo de LAN**. Portanto, a mesma ideia de LLC pode ser utilizada em tecnologias como Ethernet e Wi-Fi."
            },
            {
              tipo: "topico",
              titulo: "MAC",
              texto: "A subcamada **MAC** é responsável pelo acesso ao meio físico e pela definição do formato dos quadros para cada tecnologia. Suas funções incluem:",
              lista: [
                "definir métodos de acesso ao meio",
                "participar do framing",
                "utilizar o endereçamento físico MAC"
              ]
            },
            {
              tipo: "destaque",
              texto: "Diferentemente do LLC, o MAC é **específico para cada tecnologia de LAN**. Assim, Ethernet possui seu protocolo MAC, enquanto Wi-Fi possui outro."
            },
            {
              tipo: "tabela",
              titulo: "Principais padrões",
              colunas: ["Padrão", "Tecnologia", "Característica apresentada"],
              linhas: [
                ["IEEE 802.3", "Ethernet", "Redes locais, com evolução para velocidades muito altas"],
                ["IEEE 802.11", "Wi-Fi", "Redes sem fio"],
                ["IEEE 802.15", "Bluetooth", "Comunicação sem fio de curto alcance"]
              ]
            }
          ]
        },
        {
          id: "ieee_802_3_ethernet",
          titulo: "IEEE 802.3 — Ethernet",
          blocos: [
            {
              tipo: "texto",
              texto: "O **IEEE 802.3** define a Ethernet, apresentada no material como a tecnologia de rede local mais utilizada."
            },
            {
              tipo: "lista",
              titulo: "O padrão estabelece",
              itens: [
                "formato dos frames",
                "métodos de detecção de colisão e controle de acesso ao meio",
                "tipos de cabos e meios físicos"
              ]
            },
            {
              tipo: "subtitulo",
              texto: "Frame Ethernet"
            },
            {
              tipo: "lista",
              titulo: "O frame Ethernet possui sete campos principais",
              itens: [
                "Preâmbulo",
                "SFD",
                "Endereço de destino",
                "Endereço de origem",
                "Comprimento/Tipo",
                "Dados e preenchimento",
                "CRC"
              ]
            },
            {
              tipo: "destaque",
              texto: "A Ethernet não possui mecanismo próprio para reconhecimento dos frames recebidos. Por isso, é apresentada como um meio **não confiável**, sendo as confirmações implementadas nas camadas superiores."
            },
            {
              tipo: "imagem",
              src: "representacao_visual_formato_frame_ethernet.png",
              pasta: "imagens_redes2/aula_03",
              alt: "Formato do frame Ethernet: Preâmbulo, SFD, endereço de destino, endereço de origem, comprimento ou tipo, dados e preenchimento e CRC",
              num: 1
            },
            {
              tipo: "exemplo",
              titulo: "Representação visual: formato do frame Ethernet",
              texto: "A representação mostra, em sequência, Preâmbulo, SFD, endereço de destino, endereço de origem, comprimento ou tipo, dados e preenchimento e CRC. Também diferencia o cabeçalho associado à camada física.",
              detalhe: "Página: 9. Parte do conteúdo: IEEE 802.3 — Ethernet. id: representacao_visual_formato_frame_ethernet"
            },
            {
              tipo: "tabela",
              titulo: "Campos do frame",
              colunas: ["Campo", "Tamanho", "Função"],
              linhas: [
                ["Preâmbulo", "7 bytes", "Sequência usada para sincronizar transmissor e receptor. É adicionada pela camada física e não faz parte formal do frame."],
                ["SFD", "1 byte", "Indica o início do frame."],
                ["Endereço de destino (DA)", "6 bytes", "Endereço MAC da estação ou estações de destino."],
                ["Endereço de origem (SA)", "6 bytes", "Endereço MAC da estação transmissora."],
                ["Comprimento/Tipo", "2 bytes", "Pode indicar o protocolo encapsulado ou o comprimento dos dados."],
                ["Dados (Payload)", "46–1500 bytes", "Dados provenientes das camadas superiores."],
                ["CRC/FCS", "4 bytes", "Verificação para detectar corrupção dos dados."]
              ]
            },
            {
              tipo: "subtitulo",
              texto: "CSMA/CD"
            },
            {
              tipo: "texto",
              texto: "A Ethernet padrão utiliza o **CSMA/CD — Carrier Sense Multiple Access with Collision Detection**, com estratégia **1-persistent**."
            },
            {
              tipo: "topico",
              titulo: "Carrier Sense (CS)",
              texto: "Antes de transmitir, a estação verifica se o meio está livre."
            },
            {
              tipo: "topico",
              titulo: "Multiple Access (MA)",
              texto: "Várias estações compartilham o mesmo meio físico."
            },
            {
              tipo: "topico",
              titulo: "Collision Detection (CD)",
              texto: "Se duas estações transmitirem simultaneamente, ocorre uma colisão. As estações interrompem a transmissão, aguardam um tempo aleatório (**backoff**) e tentam novamente."
            },
            {
              tipo: "topico",
              titulo: "1-persistent",
              texto: "Quando o meio está livre, a estação transmite imediatamente. Quando está ocupado, ela espera até ficar livre e transmite logo em seguida. Isso aumenta a possibilidade de colisões quando várias estações estão esperando, mas proporciona alta utilização do meio."
            },
            {
              tipo: "destaque",
              texto: "O material destaca que o **CSMA/CD 1-persistent** corresponde ao método de acesso da primeira geração de Ethernet de **10 Mbps**."
            },
            {
              tipo: "subtitulo",
              texto: "Implementações Ethernet"
            },
            {
              tipo: "texto",
              texto: "A Ethernet possui diferentes implementações da camada física para atender diferentes necessidades de **distância, custo e velocidade**. Todas mantêm o mesmo formato de frame na camada de enlace, mas a forma de transmitir os bits no meio físico varia."
            },
            {
              tipo: "tabela",
              titulo: "Implementações Ethernet",
              colunas: ["Velocidade", "Padrão", "Meio físico", "Codificação", "Distância máxima"],
              linhas: [
                ["10 Mbps", "10BASE-T", "UTP Cat 3", "Manchester", "~100 m"],
                ["100 Mbps", "100BASE-TX", "UTP Cat 5", "4B/5B + NRZI", "~100 m"],
                ["1 Gbps", "1000BASE-T", "UTP Cat 5e/6", "PAM-5", "~100 m"],
                ["1 Gbps", "1000BASE-SX", "Fibra multimodo", "8B/10B", "~550 m"],
                ["10 Gbps", "10GBASE-SR", "Fibra multimodo", "64B/66B", "~300 m"],
                ["10 Gbps", "10GBASE-T", "Cat 6a/7", "PAM-16", "~100 m"],
                ["40/100 Gbps", "40GBASE-SR4 / 100GBASE-SR10", "Fibra multimodo", "64B/66B", "~100–150 m"]
              ]
            }
          ]
        },
        {
          id: "ieee_802_11_wifi",
          titulo: "IEEE 802.11 — Wi-Fi",
          blocos: [
            {
              tipo: "texto",
              texto: "O **IEEE 802.11** estabelece especificações para redes LAN sem fio, ou **WLANs**."
            },
            {
              tipo: "subtitulo",
              texto: "Arquitetura BSS"
            },
            {
              tipo: "texto",
              texto: "A **BSS — Basic Service Set** é a unidade básica de uma WLAN. Pode assumir duas formas:"
            },
            {
              tipo: "lista",
              itens: [
                "Ad hoc: não existe AP; as estações comunicam-se diretamente.",
                "Infraestrutura: existe um AP (Access Point) centralizando a comunicação."
              ]
            },
            {
              tipo: "imagem",
              src: "representacao_visual_bss_ad_hoc_infraestrutura.png",
              pasta: "imagens_redes2/aula_03",
              alt: "Comparação entre BSS ad hoc sem AP e BSS de infraestrutura com Access Point",
              num: 2
            },
            {
              tipo: "exemplo",
              titulo: "Representação visual: BSS ad hoc e BSS com AP",
              texto: "A representação compara uma BSS sem AP, na qual as estações se comunicam diretamente, com uma BSS de infraestrutura contendo um Access Point.",
              detalhe: "Página: 15. Parte do conteúdo: IEEE 802.11 — Arquitetura. id: representacao_visual_bss_ad_hoc_infraestrutura"
            },
            {
              tipo: "subtitulo",
              texto: "ESS"
            },
            {
              tipo: "texto",
              texto: "A **ESS — Extended Service Set** é formada por duas ou mais BSSs interligadas por um sistema de distribuição, normalmente uma LAN com fio, como Ethernet. Os **APs** conectam as BSSs entre si."
            },
            {
              tipo: "imagem",
              src: "representacao_visual_ess_bsss_interligadas.png",
              pasta: "imagens_redes2/aula_03",
              alt: "ESS formada por várias BSSs interligadas, cada uma com seu AP, por um sistema de distribuição",
              num: 3
            },
            {
              tipo: "exemplo",
              titulo: "Representação visual: ESS com BSSs interligadas",
              texto: "A representação mostra várias BSSs, cada uma com seu AP, conectadas por um sistema de distribuição. O sistema também aparece conectado a um servidor ou gateway.",
              detalhe: "Página: 16. Parte do conteúdo: IEEE 802.11 — Arquitetura. id: representacao_visual_ess_bsss_interligadas"
            }
          ]
        },
        {
          id: "subcamada_mac_80211",
          titulo: "Subcamada MAC do IEEE 802.11",
          blocos: [
            {
              tipo: "lista",
              titulo: "O IEEE 802.11 estabelece duas funções na subcamada MAC",
              itens: [
                "DCF — Distributed Coordination Function",
                "PCF — Point Coordination Function"
              ]
            },
            {
              tipo: "imagem",
              src: "figura_14_3_subcamadas_mac_ieee_802_11.png",
              pasta: "imagens_redes2/aula_03",
              alt: "Diagrama da camada de Enlace dividida em LLC e MAC, com PCF e DCF dentro da MAC",
              num: 4
            },
            {
              tipo: "exemplo",
              titulo: "Figura 14.3: Subcamadas MAC no padrão IEEE 802.11",
              texto: "O diagrama mostra a camada de Enlace dividida em LLC e MAC. Dentro da MAC aparecem PCF e DCF, enquanto a camada física fica abaixo. O diagrama também relaciona essas funções ao IEEE 802.1 e aos diferentes mecanismos da camada física 802.11.",
              detalhe: "Página: 17. Parte do conteúdo: Subcamada MAC. id: figura_14_3_subcamadas_mac_ieee_802_11"
            },
            {
              tipo: "subtitulo",
              texto: "PCF"
            },
            {
              tipo: "texto",
              texto: "A **PCF** é opcional. Utiliza um ponto coordenador, geralmente o AP, para controlar quem pode transmitir. O funcionamento é baseado em **polling**:"
            },
            {
              tipo: "lista",
              itens: [
                "o AP concede permissão",
                "uma estação transmite",
                "o AP controla a próxima estação"
              ]
            },
            {
              tipo: "texto",
              texto: "Isso evita colisões e torna a transmissão mais previsível, sendo apresentado como útil para tráfego sensível a tempo, como voz e vídeo."
            },
            {
              tipo: "destaque",
              texto: "Apesar dessas características, o material informa que a PCF é pouco utilizada na prática, pois aumenta a complexidade e a maioria das redes comerciais utiliza DCF."
            },
            {
              tipo: "subtitulo",
              texto: "DCF e CSMA/CA"
            },
            {
              tipo: "texto",
              texto: "A **DCF é obrigatória** em qualquer rede IEEE 802.11. Utiliza **CSMA/CA — Carrier Sense Multiple Access with Collision Avoidance**."
            },
            {
              tipo: "lista",
              titulo: "Funcionamento",
              itens: [
                "a estação escuta o canal",
                "se o canal estiver ocupado, espera um tempo aleatório (backoff)",
                "se estiver livre, transmite"
              ]
            },
            {
              tipo: "destaque",
              texto: "O objetivo é **evitar colisões**, pois no Wi-Fi não é possível detectar uma colisão enquanto a estação transmite, diferentemente da Ethernet por cabo apresentada anteriormente."
            }
          ]
        },
        {
          id: "fragmentacao_wifi",
          titulo: "Fragmentação no Wi-Fi",
          blocos: [
            {
              tipo: "texto",
              texto: "O ambiente sem fio apresenta elevado nível de ruído. Quando um frame é corrompido, ele precisa ser retransmitido. Por isso, o protocolo recomenda dividir um frame grande em **frames menores**."
            },
            {
              tipo: "destaque",
              texto: "A vantagem apresentada é que retransmitir um frame pequeno é mais eficiente do que retransmitir um frame grande."
            },
            {
              tipo: "imagem",
              src: "figura_14_7_formato_frame_wifi.png",
              pasta: "imagens_redes2/aula_03",
              alt: "Formato do frame 802.11 com FC, Duration, quatro campos de endereço, Sequence Control, Frame Body e FCS",
              num: 5
            },
            {
              tipo: "exemplo",
              titulo: "Figura 14.7: Formato do frame",
              texto: "A figura mostra o formato do frame 802.11, incluindo FC, Duration, quatro campos de endereço, Sequence Control, Frame Body e FCS. O campo Frame Control é detalhado em subcampos.",
              detalhe: "Página: 20. Parte do conteúdo: IEEE 802.11 — Fragmentação e frame. id: figura_14_7_formato_frame_wifi"
            }
          ]
        },
        {
          id: "frame_ieee_80211",
          titulo: "Frame IEEE 802.11",
          blocos: [
            {
              tipo: "lista",
              titulo: "Os principais campos apresentados são",
              itens: [
                "Frame Control: tipo e controle do quadro",
                "Duration/ID: duração da transmissão utilizada para configurar o NAV",
                "Address 1 a 4: endereços MAC",
                "Sequence Control: controle de fragmentação e sequência",
                "Frame Body: dados",
                "FCS: verificação de erros"
              ]
            },
            {
              tipo: "destaque",
              texto: "O **NAV (Network Allocation Vector)** é um temporizador lógico utilizado para indicar por quanto tempo o canal de rádio estará reservado ou ocupado."
            },
            {
              tipo: "tabela",
              titulo: "Frame Control",
              colunas: ["Subcampo", "Bits", "Função"],
              linhas: [
                ["Protocol Version", "0–1", "Versão do protocolo 802.11"],
                ["Type", "2–3", "Management, Control, Data ou reservado"],
                ["Subtype", "4–7", "Subfunção específica do tipo"],
                ["To DS", "8", "Indica se vai para o sistema de distribuição"],
                ["From DS", "9", "Indica se vem do sistema de distribuição"],
                ["More Fragments", "10", "Indica existência de mais fragmentos"],
                ["Retry", "11", "Indica retransmissão"],
                ["Power Management", "12", "Indica modo de economia de energia"],
                ["More Data", "13", "Indica existência de mais quadros armazenados"],
                ["Protected Frame", "14", "Indica proteção por criptografia"],
                ["Rsvd", "15", "Reservado"]
              ]
            }
          ]
        },
        {
          id: "tipos_frames_wifi",
          titulo: "Tipos de frames no Wi-Fi",
          blocos: [
            {
              tipo: "texto",
              texto: "O IEEE 802.11 define três categorias."
            },
            {
              tipo: "topico",
              titulo: "Frames de gerenciamento",
              texto: "Utilizados para iniciar a comunicação entre estações e APs."
            },
            {
              tipo: "topico",
              titulo: "Frames de controle",
              texto: "Utilizados para acessar o canal e confirmar frames."
            },
            {
              tipo: "topico",
              titulo: "Frames de dados",
              texto: "Utilizados para transportar dados e informações de controle."
            }
          ]
        },
        {
          id: "estacao_oculta",
          titulo: "Estação oculta",
          blocos: [
            {
              tipo: "texto",
              texto: "O **problema da estação oculta** ocorre quando duas estações não conseguem enxergar diretamente uma à outra, mas ambas conseguem transmitir para uma mesma estação."
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo apresentado",
              texto: "B transmite para A; C também deseja transmitir para A; C não percebe que B está transmitindo; A recebe simultaneamente os sinais de B e C; ocorre uma colisão."
            },
            {
              tipo: "destaque",
              texto: "A consequência é redução da capacidade da rede devido ao aumento de colisões."
            },
            {
              tipo: "imagem",
              src: "representacao_visual_estacao_oculta.png",
              pasta: "imagens_redes2/aula_03",
              alt: "Áreas de alcance de B e C, com A na região de sobreposição, ilustrando o problema da estação oculta",
              num: 6
            },
            {
              tipo: "exemplo",
              titulo: "Representação visual: problema de estação oculta",
              texto: "A representação mostra as áreas de alcance de B e C, com A na região de sobreposição. B e C não possuem visibilidade direta suficiente entre si, mas ambos alcançam A.",
              detalhe: "Página: 24. Parte do conteúdo: IEEE 802.11 — Problema de estação oculta. id: representacao_visual_estacao_oculta"
            },
            {
              tipo: "subtitulo",
              texto: "Solução RTS/CTS"
            },
            {
              tipo: "texto",
              texto: "O material apresenta o handshake **RTS/CTS** como solução baseada em CSMA/CA:"
            },
            {
              tipo: "lista",
              itens: [
                "B envia RTS (Request to Send) para A.",
                "A responde com CTS (Clear to Send).",
                "O CTS informa a duração da transmissão.",
                "C recebe o CTS e entende que o canal está ocupado.",
                "C aguarda, evitando a colisão."
              ]
            }
          ]
        },
        {
          id: "estacao_exposta",
          titulo: "Estação exposta",
          blocos: [
            {
              tipo: "texto",
              texto: "O **problema da estação exposta** acontece quando uma estação deixa de transmitir porque percebe o canal ocupado, mesmo que sua transmissão não causasse interferência no destinatário."
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo",
              texto: "A transmite para B; C deseja transmitir para D; C escuta A e decide não transmitir; entretanto, C poderia transmitir para D sem interferir em A → B."
            },
            {
              tipo: "destaque",
              texto: "A consequência é o uso ineficiente do canal e a redução da taxa de transmissão."
            },
            {
              tipo: "imagem",
              src: "representacao_visual_estacao_exposta.png",
              pasta: "imagens_redes2/aula_03",
              alt: "Alcances de A, B, C e D evidenciando que C deixa de transmitir mesmo tendo comunicação potencialmente independente com D",
              num: 7
            },
            {
              tipo: "exemplo",
              titulo: "Representação visual: problema de estação exposta",
              texto: "A representação mostra os alcances de A, B, C e D e evidencia que C deixa de transmitir mesmo tendo uma comunicação potencialmente independente com D.",
              detalhe: "Página: 26. Parte do conteúdo: IEEE 802.11 — Problema de estação exposta. id: representacao_visual_estacao_exposta"
            },
            {
              tipo: "subtitulo",
              texto: "Por que RTS/CTS não resolve completamente?"
            },
            {
              tipo: "texto",
              texto: "O material apresenta a situação:"
            },
            {
              tipo: "lista",
              itens: [
                "A envia RTS para B.",
                "B responde com CTS.",
                "C consegue ouvir o RTS de A, mas não consegue ouvir o CTS de B porque está fora do alcance.",
                "C envia RTS para D.",
                "A está transmitindo e não escuta o RTS de C.",
                "D responde com CTS.",
                "O problema é que o canal de comunicação está ocupado."
              ]
            },
            {
              tipo: "imagem",
              src: "representacao_visual_rts_cts_estacao_exposta.png",
              pasta: "imagens_redes2/aula_03",
              alt: "Sequência temporal entre B, A, C e D mostrando RTS, CTS e dados, indicando o ponto de colisão",
              num: 8
            },
            {
              tipo: "exemplo",
              titulo: "Representação visual: RTS/CTS e estação exposta",
              texto: "O diagrama apresenta uma sequência temporal entre B, A, C e D, mostrando RTS, CTS e dados e indicando o ponto de colisão.",
              detalhe: "Página: 27. Parte do conteúdo: Problema de estação exposta. id: representacao_visual_rts_cts_estacao_exposta"
            }
          ]
        },
        {
          id: "camada_fisica_80211",
          titulo: "Camada física do IEEE 802.11",
          blocos: [
            {
              tipo: "texto",
              texto: "A camada física trata das especificações para transmissão de dados em WLANs."
            },
            {
              tipo: "lista",
              titulo: "O material destaca",
              itens: [
                "técnicas: como o sinal é espalhado e transmitido",
                "modulações: como a informação é codificada no sinal"
              ]
            }
          ]
        },
        {
          id: "bluetooth_ieee_802_15",
          titulo: "IEEE 802.15 — Bluetooth",
          blocos: [
            {
              tipo: "texto",
              texto: "O Bluetooth é apresentado como uma tecnologia para redes sem fio utilizada para conectar dispositivos de diferentes funções, como:"
            },
            {
              tipo: "lista",
              itens: ["telefones", "notebooks", "computadores", "câmeras", "impressoras", "outros dispositivos"]
            },
            {
              tipo: "destaque",
              texto: "A rede Bluetooth é apresentada como uma rede **ad hoc**, criada para substituir cabos entre dispositivos próximos, como mouse, teclado, celular, fones e impressoras."
            }
          ]
        },
        {
          id: "arquitetura_bluetooth",
          titulo: "Arquitetura Bluetooth",
          blocos: [
            {
              tipo: "topico",
              titulo: "Piconet",
              texto: "Uma **Piconet** é uma pequena rede formada por até 8 dispositivos: 1 dispositivo primário; até 7 dispositivos secundários. O material também utiliza as denominações mestre e escravos."
            },
            {
              tipo: "topico",
              titulo: "Scatternet",
              texto: "Uma **Scatternet** é formada pela interconexão de várias piconets. Um dispositivo pode ser primário em uma piconet e secundário em outra."
            },
            {
              tipo: "imagem",
              src: "representacao_visual_piconet_scatternet.png",
              pasta: "imagens_redes2/aula_03",
              alt: "Piconet com dispositivo primário e secundários, e Scatternet com interconexão de piconets",
              num: 9
            },
            {
              tipo: "exemplo",
              titulo: "Representação visual: Piconet e Scatternet",
              texto: "A primeira representação mostra uma piconet com um dispositivo primário conectado a dispositivos secundários. A segunda mostra a interconexão de piconets e um dispositivo atuando como primário em uma delas e secundário em outra.",
              detalhe: "Página: 30. Parte do conteúdo: Arquitetura da Rede Bluetooth. id: representacao_visual_piconet_scatternet"
            }
          ]
        },
        {
          id: "modulacao_bluetooth",
          titulo: "Modulação Bluetooth",
          blocos: [
            {
              tipo: "texto",
              texto: "A modulação converte bits digitais em sinais de rádio."
            },
            {
              tipo: "topico",
              titulo: "GFSK — Gaussian Frequency Shift Keying",
              texto: "O Bluetooth utiliza GFSK:",
              lista: [
                "bit 1 → frequência aumenta em relação à portadora",
                "bit 0 → frequência diminui em relação à portadora"
              ]
            },
            {
              tipo: "texto",
              texto: "A frequência da portadora é a frequência central do canal. Os bits são representados por pequenos desvios para cima ou para baixo dessa frequência."
            }
          ]
        },
        {
          id: "tecnica_espalhamento_bluetooth",
          titulo: "Técnica de espalhamento Bluetooth",
          blocos: [
            {
              tipo: "texto",
              texto: "O Bluetooth utiliza **FHSS — Frequency Hopping Spread Spectrum**."
            },
            {
              tipo: "lista",
              titulo: "Sua função é",
              itens: ["reduzir interferência", "aumentar a confiabilidade da transmissão"]
            },
            {
              tipo: "destaque",
              texto: "A transmissão muda de frequência **1.600 vezes por segundo**, permitindo que vários dispositivos compartilhem a faixa de **2,4 GHz** com menor ocorrência de colisões."
            }
          ]
        },
        {
          id: "enlaces_sco_acl",
          titulo: "Enlaces SCO e ACL",
          blocos: [
            {
              tipo: "topico",
              titulo: "SCO — Synchronous Connection-Oriented",
              texto: "Características:",
              lista: [
                "enlace físico dedicado",
                "transmissão síncrona",
                "orientado para voz",
                "baixa latência",
                "utiliza slots de tempo predeterminados",
                "usado principalmente para áudio em tempo real"
              ]
            },
            {
              tipo: "topico",
              titulo: "ACL — Asynchronous Connectionless",
              texto: "Características:",
              lista: [
                "transmissão assíncrona",
                "orientada para dados",
                "maior taxa de transmissão que SCO",
                "latência variável",
                "permite retransmissão de pacotes em caso de erro",
                "utilizada para transferência de dados"
              ]
            },
            {
              tipo: "destaque",
              texto: "Diferença fundamental: SCO → voz/tempo real/baixa latência. ACL → dados/retransmissão/latência variável."
            }
          ]
        },
        {
          id: "camadas_bluetooth",
          titulo: "Camadas Bluetooth",
          blocos: [
            {
              tipo: "lista",
              titulo: "O material relaciona",
              itens: [
                "L2CAP → equivalente à subcamada LLC",
                "Baseband → equivalente à subcamada MAC"
              ]
            },
            {
              tipo: "destaque",
              texto: "A camada Baseband controla o acesso ao meio, sincroniza transmissões e organiza frames. O material ressalta que as camadas Bluetooth não coincidem exatamente com as do modelo Internet."
            },
            {
              tipo: "imagem",
              src: "representacao_visual_camadas_bluetooth.png",
              pasta: "imagens_redes2/aula_03",
              alt: "Esquema com Aplicações, Perfis, L2CAP, Baseband e Rádio, com componentes de áudio, dados e controle",
              num: 10
            },
            {
              tipo: "exemplo",
              titulo: "Representação visual: Camadas no Bluetooth",
              texto: "O esquema apresenta Aplicações, Perfis, L2CAP, Baseband e Rádio, além de indicar componentes relacionados a áudio, dados e controle.",
              detalhe: "Página: 34. Parte do conteúdo: Bluetooth — Camada de enlace. id: representacao_visual_camadas_bluetooth"
            },
            {
              tipo: "topico",
              titulo: "L2CAP",
              texto: "É utilizado somente nos enlaces ACL, não nos enlaces SCO. Funções:",
              lista: [
                "multiplexação: vários canais virtuais utilizam o mesmo enlace físico",
                "segmentação e remontagem: divide pacotes grandes e os recompõe",
                "QoS: fornece prioridade e parâmetros específicos de transmissão"
              ]
            }
          ]
        },
        {
          id: "frame_bluetooth",
          titulo: "Frame Bluetooth",
          blocos: [
            {
              tipo: "lista",
              titulo: "O frame Bluetooth apresentado possui",
              itens: [
                "Access Code: 72 bits",
                "Cabeçalho: 54 bits",
                "Payload: tamanho variável"
              ]
            },
            {
              tipo: "destaque",
              texto: "O Access Code contém bits de sincronização e normalmente a identificação da estação primária, permitindo diferenciar frames provenientes de diferentes piconets."
            },
            {
              tipo: "imagem",
              src: "figura_14_24_formato_frame_banda_base_bluetooth.png",
              pasta: "imagens_redes2/aula_03",
              alt: "Código de acesso de 72 bits, cabeçalho de 54 bits e payload de 0 a N bits do frame Bluetooth",
              num: 11
            },
            {
              tipo: "exemplo",
              titulo: "Figura 14.24: Tipos de formato de um frame da camada banda base bluetooth",
              texto: "A figura apresenta o código de acesso de 72 bits, cabeçalho de 54 bits e payload de 0 a N bits. O cabeçalho contém endereço, tipo, F, A, S e HEC. Também são apresentados os valores de N para frames de 1, 3 e 5 slots.",
              detalhe: "Página: 36. Parte do conteúdo: Bluetooth — Camada física, formato do frame. id: figura_14_24_formato_frame_banda_base_bluetooth"
            },
            {
              tipo: "lista",
              titulo: "No cabeçalho",
              itens: [
                "Endereço: identificação",
                "Tipo: define o tipo de dados",
                "F (Flow): controle de fluxo",
                "A (Acknowledge): confirmação de recebimento",
                "S (Sequence): sequência",
                "HEC: checksum para detecção de erros"
              ]
            }
          ]
        },
        {
          id: "cenario_atual_padroes",
          titulo: "Cenário atual dos padrões",
          blocos: [
            {
              tipo: "texto",
              texto: "O material apresenta três tecnologias em evolução."
            },
            {
              tipo: "topico",
              titulo: "Ethernet — IEEE 802.3df-2024",
              texto: "O padrão é apresentado como definindo parâmetros de MAC, PHY e gerenciamento para transferências Ethernet de **400 Gb/s e 800 Gb/s**."
            },
            {
              tipo: "topico",
              titulo: "Wi-Fi — IEEE 802.11be / Wi-Fi 7",
              texto: "Apresentado como aprovado em 2024, com velocidades de até **46 Gbps**, canais de **320 MHz**, **4K-QAM** e operação **Multi-Link (MLO)**."
            },
            {
              tipo: "topico",
              titulo: "Bluetooth 6.1",
              texto: "Apresentado como lançado em maio de 2025, com foco em melhorias de privacidade e eficiência energética."
            }
          ]
        },
        {
          id: "ethernet_400_800gb",
          titulo: "Ethernet 400/800 Gb/s",
          blocos: [
            {
              tipo: "lista",
              titulo: "No cenário apresentado",
              itens: [
                "meio físico: fibra óptica e, quando aplicável, cobre de par trançado de alta categoria",
                "codificação: PAM4",
                "distância: dezenas de metros em cobre até aproximadamente 10 km em fibra, dependendo da variante",
                "não há CSMA/CD nas altas velocidades apresentadas",
                "utiliza full-duplex e switches para eliminar colisões"
              ]
            },
            {
              tipo: "topico",
              titulo: "PAM4",
              texto: "**PAM4 — Pulse Amplitude Modulation, 4 níveis** utiliza quatro níveis de tensão em vez de apenas dois. Cada símbolo pode representar 2 bits:"
            },
            {
              tipo: "tabela",
              titulo: "Codificação PAM4",
              colunas: ["Bits", "Nível"],
              linhas: [
                ["00", "0"],
                ["01", "1"],
                ["10", "2"],
                ["11", "3"]
              ]
            },
            {
              tipo: "destaque",
              texto: "Assim, enquanto NRZ transmite 1 bit por pulso, o PAM4 transmite **2 bits por pulso**, aumentando a taxa de dados sem dobrar a frequência."
            }
          ]
        },
        {
          id: "full_duplex_colisoes",
          titulo: "Full-duplex e colisões",
          blocos: [
            {
              tipo: "topico",
              titulo: "Half-duplex",
              texto: "No modo antigo:",
              lista: [
                "o meio era compartilhado",
                "apenas um dispositivo transmitia por vez",
                "duas transmissões simultâneas provocavam colisão",
                "por isso era necessário CSMA/CD"
              ]
            },
            {
              tipo: "topico",
              titulo: "Full-duplex",
              texto: "No modo atual:",
              lista: [
                "existem canais separados para envio e recebimento",
                "os dois dispositivos podem transmitir simultaneamente",
                "não há compartilhamento do mesmo canal",
                "portanto, não ocorrem colisões"
              ]
            }
          ]
        },
        {
          id: "wifi_7",
          titulo: "Wi-Fi 7",
          blocos: [
            {
              tipo: "lista",
              titulo: "O material apresenta o Wi-Fi 7 como baseado em",
              itens: [
                "frequências de 2,4 GHz, 5 GHz e 6 GHz",
                "OFDMA",
                "4096-QAM",
                "CSMA/CA",
                "MLO",
                "agendamento",
                "beamforming"
              ]
            },
            {
              tipo: "destaque",
              texto: "A distância apresentada é de até **30 m em ambientes internos**, podendo chegar a **100 m em campo aberto**."
            },
            {
              tipo: "topico",
              titulo: "OFDMA",
              texto: "O canal é dividido em várias subportadoras menores. Cada dispositivo recebe apenas parte dessas subportadoras, permitindo que vários dispositivos se comuniquem simultaneamente."
            },
            {
              tipo: "topico",
              titulo: "4096-QAM",
              texto: "Combina amplitude e fase. O número 4096 representa 4096 estados diferentes, permitindo que cada símbolo carregue 12 bits. Quanto maior o QAM, maior a taxa de dados, mas também maior a sensibilidade ao ruído."
            },
            {
              tipo: "subtitulo",
              texto: "Melhorias do Wi-Fi 7"
            },
            {
              tipo: "topico",
              titulo: "MLO",
              texto: "Utiliza vários canais/bandas simultaneamente, proporcionando maior velocidade e menor latência."
            },
            {
              tipo: "topico",
              titulo: "Scheduling",
              texto: "Organiza quem transmite e quando."
            },
            {
              tipo: "topico",
              titulo: "Beamforming",
              texto: "Concentra o sinal na direção do dispositivo, melhorando alcance e eficiência."
            }
          ]
        },
        {
          id: "csma_cd_vs_csma_ca",
          titulo: "CSMA/CD × CSMA/CA",
          blocos: [
            {
              tipo: "tabela",
              titulo: "Comparação entre CSMA/CD e CSMA/CA",
              colunas: ["Característica", "CSMA/CD", "CSMA/CA"],
              linhas: [
                ["Colisão", "Detecta depois que ocorre", "Procura evitar antes"],
                ["Principal ambiente", "Redes com fio", "Redes sem fio"],
                ["Funcionamento", "Interrompe após colisão", "Detecta o canal e aguarda antes de transmitir"],
                ["Quadros", "Reenvia após conflito", "Utiliza intenção de transmissão antes dos dados"],
                ["IEEE", "802.3 Ethernet", "802.11 Wi-Fi"]
              ]
            },
            {
              tipo: "imagem",
              src: "representacao_visual_comparacao_csma_cd_csma_ca.png",
              pasta: "imagens_redes2/aula_03",
              alt: "Comparação entre tratamento de colisões, tipo de rede, eficiência, transmissão de quadros e padrões IEEE associados a CSMA/CD e CSMA/CA",
              num: 12
            },
            {
              tipo: "exemplo",
              titulo: "Representação visual: diferença entre CSMA/CD e CSMA/CA",
              texto: "A tabela compara o tratamento das colisões, o tipo de rede, a eficiência, a transmissão de quadros e os padrões IEEE associados a cada mecanismo.",
              detalhe: "Página: 46. Parte do conteúdo: Comparação dos métodos de acesso. id: representacao_visual_comparacao_csma_cd_csma_ca"
            }
          ]
        },
        {
          id: "bluetooth_6_1",
          titulo: "Bluetooth 6.1",
          blocos: [
            {
              tipo: "lista",
              titulo: "O cenário apresentado para Bluetooth 6.1 inclui",
              itens: [
                "frequência de 2,4 GHz",
                "GFSK e outras formas de modulação",
                "alcance geral de 10 m a 100 m, dependendo da potência",
                "ausência de detecção de colisões",
                "uso de FHSS para minimizar interferências",
                "coordenação por piconet"
              ]
            },
            {
              tipo: "subtitulo",
              texto: "Modulações"
            },
            {
              tipo: "topico",
              titulo: "GFSK",
              texto: "Modulação básica do Bluetooth clássico; altera ligeiramente a frequência para representar os bits."
            },
            {
              tipo: "topico",
              titulo: "π/4-DQPSK",
              texto: "Altera a fase da onda e cada símbolo carrega 2 bits."
            },
            {
              tipo: "topico",
              titulo: "8DPSK",
              texto: "Utiliza 8 variações de fase e cada símbolo carrega 3 bits; proporciona maior velocidade, mas é mais sensível ao ruído."
            }
          ]
        },
        {
          id: "redes_locais_lan",
          titulo: "Redes Locais — LANs",
          blocos: [
            {
              tipo: "texto",
              texto: "Uma **LAN (Local Area Network)** conecta dispositivos próximos, como:"
            },
            {
              tipo: "lista",
              itens: ["salas", "prédios", "campus"]
            },
            {
              tipo: "lista",
              titulo: "Características apresentadas",
              itens: [
                "altas velocidades, de Mbps a Gbps",
                "baixa taxa de erros",
                "padronização pelo IEEE 802",
                "Ethernet como tecnologia mais comum",
                "baixo custo",
                "escalabilidade",
                "altas velocidades de transmissão"
              ]
            }
          ]
        },
        {
          id: "topologias_rede",
          titulo: "Topologias de rede",
          blocos: [
            {
              tipo: "texto",
              texto: "O material apresenta seis topologias."
            },
            {
              tipo: "lista",
              itens: ["Star", "Mesh", "Árvore", "Ponto a ponto", "Anel", "Barramento"]
            },
            {
              tipo: "imagem",
              src: "representacao_visual_topologias_rede.png",
              pasta: "imagens_redes2/aula_03",
              alt: "Seis formas de organização das conexões entre dispositivos: Star, Mesh, Árvore, Ponto a ponto, Anel e Barramento",
              num: 13
            },
            {
              tipo: "exemplo",
              titulo: "Representação visual: Topologias de Rede",
              texto: "A representação apresenta seis formas de organização das conexões entre dispositivos: Star, Mesh, Árvore, Ponto a ponto, Anel e Barramento.",
              detalhe: "Página: 53. Parte do conteúdo: Topologias de Rede. id: representacao_visual_topologias_rede"
            }
          ]
        },
        {
          id: "infraestrutura_lan",
          titulo: "Infraestrutura de uma LAN",
          blocos: [
            {
              tipo: "texto",
              texto: "A infraestrutura de uma LAN é formada por elementos **físicos e lógicos** que permitem a comunicação entre dispositivos."
            },
            {
              tipo: "subtitulo",
              texto: "Equipamentos ativos"
            },
            {
              tipo: "topico",
              titulo: "Switch",
              texto: "Conecta dispositivos dentro da LAN e encaminha quadros com base no **endereço MAC**."
            },
            {
              tipo: "topico",
              titulo: "Roteador",
              texto: "Interliga a LAN com outras redes, como a Internet."
            },
            {
              tipo: "topico",
              titulo: "Access Point",
              texto: "Expande a rede de forma sem fio."
            },
            {
              tipo: "subtitulo",
              texto: "Dispositivos de acesso"
            },
            {
              tipo: "lista",
              titulo: "São os nós finais que utilizam os recursos da rede",
              itens: [
                "computadores",
                "notebooks",
                "impressoras de rede",
                "câmeras IP",
                "servidores"
              ]
            },
            {
              tipo: "imagem",
              src: "representacao_visual_infraestrutura_lan.png",
              pasta: "imagens_redes2/aula_03",
              alt: "Esquema com Internet conectada a um roteador, roteador conectado a um switch e switch distribuindo tráfego para computadores",
              num: 14
            },
            {
              tipo: "exemplo",
              titulo: "Representação visual: infraestrutura de redes locais",
              texto: "O esquema mostra Internet conectada a um roteador, o roteador conectado a um switch e o switch distribuindo o tráfego para computadores.",
              detalhe: "Página: 54. Parte do conteúdo: Infraestrutura de redes locais. id: representacao_visual_infraestrutura_lan"
            }
          ]
        },
        {
          id: "enderecamento_mac",
          titulo: "Endereçamento MAC",
          blocos: [
            {
              tipo: "texto",
              texto: "O IEEE também padroniza o esquema de endereçamento das LANs. O identificador é o **MAC (Media Access Control)**, também chamado de endereço Ethernet."
            },
            {
              tipo: "lista",
              titulo: "Cada MAC possui",
              itens: ["48 bits", "6 bytes"]
            },
            {
              tipo: "texto",
              texto: "Ele identifica exclusivamente uma interface de rede (**NIC**)."
            },
            {
              tipo: "destaque",
              texto: "O IEEE atribui blocos de endereços aos fabricantes, que devem gerar endereços exclusivos para os dispositivos produzidos. Assim, a placa de rede sai de fábrica com um endereço MAC gravado pelo fabricante."
            }
          ]
        },
        {
          id: "tipos_enderecamento_mac",
          titulo: "Tipos de endereçamento MAC",
          blocos: [
            {
              tipo: "texto",
              texto: "O esquema IEEE apresentado suporta três tipos de endereços, relacionados a três tipos de entrega."
            },
            {
              tipo: "imagem",
              src: "figura_13_9_tres_tipos_enderecos_mac.png",
              pasta: "imagens_redes2/aula_03",
              alt: "Três tipos de entrega de endereços MAC: Unicast, Broadcast e Multicast",
              num: 15
            },
            {
              tipo: "exemplo",
              titulo: "Figura 13.9: Os três tipos de endereços MAC e os significados correspondentes",
              texto: "A tabela apresenta três tipos de entrega: Unicast, Broadcast e Multicast, relacionando cada um à quantidade de computadores que devem receber o pacote.",
              detalhe: "Página: 57. Parte do conteúdo: Endereçamento IEEE (MAC). id: figura_13_9_tres_tipos_enderecos_mac"
            },
            {
              tipo: "tabela",
              titulo: "Tipos de entrega MAC",
              colunas: ["Tipo", "Significado"],
              linhas: [
                ["Unicast", "Identifica unicamente um computador, que deve receber uma cópia do pacote."],
                ["Broadcast", "Corresponde a todos os computadores, e cada um recebe uma cópia do pacote."],
                ["Multicast", "Identifica um subconjunto de computadores, e cada computador desse grupo recebe uma cópia."]
              ]
            }
          ]
        },
        {
          id: "mac_vs_ip",
          titulo: "MAC × IP",
          blocos: [
            {
              tipo: "topico",
              titulo: "MAC",
              texto: "Identifica fisicamente a interface de rede dentro de uma LAN."
            },
            {
              tipo: "topico",
              titulo: "IP",
              texto: "Identifica logicamente um dispositivo e permite comunicação entre redes diferentes."
            },
            {
              tipo: "destaque",
              texto: "A analogia apresentada é: MAC como o CPF da placa de rede, representando sua identidade física; IP como um endereço residencial, representando sua localização na rede."
            },
            {
              tipo: "lista",
              titulo: "As versões apresentadas são",
              itens: ["IPv4", "IPv6"]
            }
          ]
        },
        {
          id: "ipv4",
          titulo: "IPv4",
          blocos: [
            {
              tipo: "lista",
              titulo: "Características",
              itens: [
                "32 bits",
                "dividido em 4 octetos",
                "cada octeto varia de 0 a 255"
              ]
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo apresentado",
              texto: "192.168.1.10"
            },
            {
              tipo: "destaque",
              texto: "O material apresenta o IPv4 como a versão mais utilizada do protocolo IP."
            }
          ]
        },
        {
          id: "ipv6",
          titulo: "IPv6",
          blocos: [
            {
              tipo: "texto",
              texto: "O IPv6 foi criado para substituir o IPv4 devido ao **esgotamento dos endereços**."
            },
            {
              tipo: "lista",
              titulo: "Características",
              itens: ["128 bits", "representação em hexadecimal"]
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo",
              texto: "2001:db8:85a3::8a2e:370:7334"
            },
            {
              tipo: "tabela",
              titulo: "Diferença fundamental",
              colunas: ["IPv4", "IPv6"],
              linhas: [
                ["32 bits", "128 bits"],
                ["4 octetos", "Hexadecimal"],
                ["Ex.: 192.168.1.10", "Ex.: 2001:db8:85a3::8a2e:370:7334"]
              ]
            }
          ]
        },
        {
          id: "estrutura_endereco_ip",
          titulo: "Estrutura do endereço IP",
          blocos: [
            {
              tipo: "texto",
              texto: "Um endereço IPv4 ou IPv6 possui duas partes principais:"
            },
            {
              tipo: "lista",
              itens: [
                "Identificação da rede — indica a qual rede o dispositivo pertence.",
                "Identificação do host — identifica o dispositivo dentro daquela rede."
              ]
            },
            {
              tipo: "destaque",
              texto: "A **máscara de sub-rede**, ou prefixo de rede, determina quais bits pertencem à rede e quais pertencem ao host."
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo",
              texto: "192.168.10.0/24. Máscara: 255.255.255.0. Representação binária: 11111111.11111111.11111111.00000000. Nesse exemplo, o prefixo /24 indica que os primeiros 24 bits correspondem à rede."
            }
          ]
        },
        {
          id: "sub_redes",
          titulo: "Sub-redes",
          blocos: [
            {
              tipo: "texto",
              texto: "Uma **sub-rede (subnet)** é a divisão de uma rede maior em redes menores."
            },
            {
              tipo: "lista",
              titulo: "Benefícios apresentados",
              itens: [
                "melhor organização dos dispositivos",
                "maior desempenho",
                "maior controle e segurança",
                "redução do tráfego de broadcast"
              ]
            },
            {
              tipo: "subtitulo",
              texto: "Criação de sub-redes"
            },
            {
              tipo: "texto",
              texto: "Para criar sub-redes, utilizam-se alguns bits que originalmente pertenciam à parte de hosts."
            },
            {
              tipo: "destaque",
              texto: "A fórmula apresentada é: Quantidade de sub-redes = 2^m, onde m = quantidade de bits emprestados da parte de host."
            }
          ]
        },
        {
          id: "exemplo_divisao_subredes",
          titulo: "Exemplo de divisão em sub-redes",
          blocos: [
            {
              tipo: "exemplo",
              titulo: "Cenário apresentado",
              texto: "O material apresenta uma empresa com 192.168.0.0/24. Os últimos 8 bits são destinados aos hosts. A empresa precisa de 4 sub-redes, uma para cada departamento: Financeiro; Comercial; Recursos Humanos; Jurídico."
            },
            {
              tipo: "texto",
              texto: "Para obter 4 sub-redes: 2² = 4. Portanto, são utilizados **2 bits** da parte originalmente destinada aos hosts."
            },
            {
              tipo: "destaque",
              texto: "A nova máscara é: /26"
            }
          ]
        },
        {
          id: "quantidade_hosts_subrede",
          titulo: "Quantidade de hosts por sub-rede",
          blocos: [
            {
              tipo: "texto",
              texto: "Depois de utilizar 2 bits para identificar as sub-redes, permanecem **6 bits para hosts**."
            },
            {
              tipo: "destaque",
              texto: "A fórmula apresentada é: Hosts = 2^n − 2, onde n = número de bits disponíveis para hosts; −2 = exclusão do endereço da rede e do endereço de broadcast."
            },
            {
              tipo: "exemplo",
              titulo: "Neste exemplo",
              texto: "2⁶ − 2 = 64 − 2 = 62 hosts válidos por sub-rede."
            }
          ]
        },
        {
          id: "distribuicao_quatro_subredes",
          titulo: "Distribuição das quatro sub-redes",
          blocos: [
            {
              tipo: "imagem",
              src: "distribuicao_192_168_0_0_24_quatro_subredes_26.png",
              pasta: "imagens_redes2/aula_03",
              alt: "Divisão da rede 192.168.0.0/24 em quatro sub-redes /26, com endereços de rede, broadcast e intervalos de IPs válidos",
              num: 16
            },
            {
              tipo: "exemplo",
              titulo: "Representação visual: divisão da rede 192.168.0.0/24 em quatro sub-redes /26",
              texto: "A tabela apresenta as quatro sub-redes, seus endereços de rede, endereços de broadcast e intervalos de IPs válidos.",
              detalhe: "Página: 65. Parte do conteúdo: Estrutura de Endereçamento IP — quantidade de hosts por sub-rede"
            },
            {
              tipo: "tabela",
              titulo: "Sub-redes da rede 192.168.0.0/24",
              colunas: ["Sub-rede", "Endereço de rede", "Broadcast", "IPs válidos"],
              linhas: [
                ["1 — Financeiro", "192.168.0.0", "192.168.0.63", ".1 a .62"],
                ["2 — Comercial", "192.168.0.64", "192.168.0.127", ".65 a .126"],
                ["3 — RH", "192.168.0.128", "192.168.0.191", ".129 a .190"],
                ["4 — Jurídico", "192.168.0.192", "192.168.0.255", ".193 a .254"]
              ]
            },
            {
              tipo: "destaque",
              texto: "A organização mostra que cada sub-rede /26 possui 64 endereços no total, dos quais 62 são destinados a hosts válidos, enquanto um identifica a rede e outro corresponde ao broadcast."
            }
          ]
        },
        {
          id: "formulas_memorizar",
          titulo: "Fórmulas e informações para memorizar",
          blocos: [
            {
              tipo: "topico",
              titulo: "Sub-redes",
              texto: "Quantidade de sub-redes = 2^m",
              lista: ["m = bits emprestados da parte de host"]
            },
            {
              tipo: "topico",
              titulo: "Hosts",
              texto: "Hosts válidos = 2^n − 2",
              lista: [
                "n = bits restantes para hosts",
                "−2 = endereço da rede + endereço de broadcast"
              ]
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo do material",
              texto: "Rede original: 192.168.0.0/24. Necessidade: 4 sub-redes. Cálculo: 2² = 4. Nova máscara: /26. Bits para hosts: 6. Hosts válidos: 2⁶ − 2 = 62."
            }
          ]
        },
        {
          id: "pontos_essenciais_revisao",
          titulo: "Pontos essenciais para revisão",
          blocos: [
            {
              tipo: "topico",
              titulo: "IEEE 802",
              lista: [
                "Projeto iniciado por volta de 1980.",
                "Objetivo: padronizar a intercomunicação entre equipamentos de diferentes fabricantes.",
                "Atua principalmente sobre funções das camadas Física e Enlace em LANs.",
                "A camada de Enlace é dividida em LLC e MAC.",
                "LLC é independente da tecnologia de LAN.",
                "MAC é específico da tecnologia."
              ]
            },
            {
              tipo: "topico",
              titulo: "Ethernet — IEEE 802.3",
              lista: [
                "Tecnologia de LAN.",
                "Utiliza frames.",
                "Ethernet tradicional utiliza CSMA/CD.",
                "CSMA/CD detecta colisões depois que ocorrem.",
                "Frame Ethernet possui Preâmbulo, SFD, endereços, Comprimento/Tipo, Dados/Preenchimento e CRC.",
                "Altas velocidades atuais apresentadas utilizam full-duplex e switching, eliminando colisões.",
                "PAM4 representa 2 bits por símbolo."
              ]
            },
            {
              tipo: "topico",
              titulo: "Wi-Fi — IEEE 802.11",
              lista: [
                "Tecnologia WLAN.",
                "BSS é a unidade básica.",
                "BSS pode ser ad hoc ou de infraestrutura.",
                "ESS conecta várias BSSs.",
                "DCF é obrigatória.",
                "PCF é opcional.",
                "Wi-Fi utiliza CSMA/CA.",
                "CSMA/CA procura evitar colisões.",
                "NAV indica o período em que o canal está reservado.",
                "Problemas importantes: estação oculta e estação exposta.",
                "RTS/CTS é apresentado como solução para estação oculta, mas não resolve completamente o problema de estação exposta.",
                "Wi-Fi 7 utiliza, no material, OFDMA, 4096-QAM, MLO, scheduling e beamforming."
              ]
            },
            {
              tipo: "topico",
              titulo: "Bluetooth — IEEE 802.15",
              lista: [
                "Rede ad hoc para dispositivos próximos.",
                "Piconet: até 8 dispositivos, com 1 primário e até 7 secundários.",
                "Scatternet: interconexão de várias piconets.",
                "GFSK: modulação básica apresentada.",
                "FHSS: troca de frequência para reduzir interferências.",
                "SCO: principalmente voz e áudio em tempo real.",
                "ACL: dados e retransmissão.",
                "L2CAP: equivalente à LLC.",
                "Baseband: equivalente à MAC.",
                "Modulações apresentadas: GFSK, π/4-DQPSK e 8DPSK."
              ]
            },
            {
              tipo: "topico",
              titulo: "LAN",
              lista: [
                "Conecta dispositivos próximos.",
                "Possui alta velocidade e baixa taxa de erros.",
                "Ethernet é apresentada como a tecnologia mais comum.",
                "Switch → conecta dispositivos dentro da LAN e encaminha por MAC.",
                "Roteador → conecta diferentes redes.",
                "AP → fornece/expande conectividade sem fio."
              ]
            },
            {
              tipo: "topico",
              titulo: "Endereçamento",
              lista: [
                "MAC: identidade física da interface.",
                "MAC possui 48 bits / 6 bytes.",
                "Unicast → um destinatário.",
                "Broadcast → todos.",
                "Multicast → grupo de destinatários.",
                "IP: identificação lógica.",
                "IPv4 → 32 bits.",
                "IPv6 → 128 bits.",
                "Máscara/prefixo separa rede e host."
              ]
            },
            {
              tipo: "topico",
              titulo: "Sub-redes",
              lista: [
                "Dividem uma rede maior em redes menores.",
                "Benefícios: organização, desempenho, controle/segurança e redução de broadcast.",
                "2^m → quantidade de sub-redes.",
                "2^n − 2 → hosts válidos.",
                "No exemplo: /24 → /26; 4 sub-redes; 2 bits emprestados; 6 bits para hosts; 62 hosts válidos por sub-rede."
              ]
            },
            {
              tipo: "subtitulo",
              texto: "Resumo mental"
            },
            {
              tipo: "lista",
              itens: [
                "IEEE 802 → padronização → LLC + MAC",
                "802.3 → Ethernet → CSMA/CD tradicional → cabo → colisão detectada",
                "802.11 → Wi-Fi → CSMA/CA → rádio → colisão evitada",
                "802.15 → Bluetooth → curto alcance → piconet/scatternet → FHSS",
                "LAN → dispositivos próximos → switch/AP/roteador",
                "MAC → identidade física",
                "IP → identificação lógica",
                "IPv4 → 32 bits",
                "IPv6 → 128 bits",
                "Sub-rede → rede maior dividida em redes menores",
                "2^m → sub-redes",
                "2^n − 2 → hosts válidos"
              ]
            }
          ]
        }
      ]
    },
    // aula 4
    {
  aula: "Redes Metropolitanas (MANs)",
  ideia_central: "As Redes Metropolitanas (MANs) interligam LANs distribuídas em uma cidade por meio de arquiteturas como Metro Ethernet, MPLS e anéis ópticos resilientes, sustentadas por uma infraestrutura física e lógica específica, podendo também ser implementadas sem fio (WMAN).",
  secoes: [
    {
      id: "objetivos",
      titulo: "Objetivos de Aprendizagem",
      blocos: [
        {
          tipo: "lista",
          itens: [
            "Compreender o conceito de Redes Metropolitanas (MANs) e sua importância na interligação de redes locais.",
            "Identificar os componentes da infraestrutura de uma MAN, distinguindo elementos da planta externa e equipamentos ativos.",
            "Explicar o funcionamento das principais tecnologias empregadas em MANs, como Metro Ethernet, MPLS, CWDM e DWDM.",
            "Comparar redes LAN, MAN e WAN quanto à área de cobertura, infraestrutura, desempenho e aplicações."
          ]
        }
      ]
    },
    {
      id: "introducao",
      titulo: "Introdução — O que é uma MAN (Metropolitan Area Network)?",
      blocos: [
        {
          tipo: "texto",
          texto: "Uma MAN (Metropolitan Area Network) é uma rede de alta velocidade que conecta diversas LANs distribuídas em uma mesma cidade ou região metropolitana. Geralmente utiliza fibra óptica e tecnologias como Metro Ethernet para oferecer comunicação rápida, confiável e integrada entre diferentes unidades de uma organização, suportando simultaneamente serviços de dados, voz e vídeo."
        },
        {
          tipo: "topico",
          titulo: "Posicionamento na Hierarquia de Redes",
          lista: [
            "LAN (Local): Abrangência de um cômodo, prédio ou conjunto de prédios próximos.",
            "MAN (Metropolitana): Cobertura em nível de cidade.",
            "WAN (Wide Area): Cobertura regional, nacional ou global."
          ]
        }
      ]
    },
    {
      id: "arquiteturas",
      titulo: "Arquiteturas de Transporte de Dados",
      blocos: [
        {
          tipo: "texto",
          texto: "As arquiteturas de MAN evoluíram para suprir a necessidade de altíssima largura de banda, isolamento de tráfego corporativo e tolerância a falhas na infraestrutura urbana."
        },
        {
          tipo: "lista",
          itens: [
            "Metro Ethernet (Carrier Ethernet)",
            "MANs Ethernet baseadas em MPLS",
            "Anéis Ópticos e Resiliência (RPR / ERPS)"
          ]
        }
      ]
    },
    {
      id: "metro_ethernet",
      titulo: "Metro Ethernet",
      blocos: [
        {
          tipo: "texto",
          texto: "Metro Ethernet (Carrier Ethernet): É a extensão do protocolo Ethernet para abranger distâncias metropolitanas (10km a 50km)."
        },
        {
          tipo: "topico",
          titulo: "Como funciona",
          lista: [
            "A operadora de telecomunicações usa switches de alta capacidade e fibras ópticas urbanas para criar \"redes locais virtuais\" pela cidade.",
            "Não exige adaptadores ou roteadores industriais complexos do lado do cliente.",
            "Conectar duas sedes fica tão simples quanto plugar um cabo num switch.",
            "É fácil contratar mais velocidade apenas mudando uma configuração lógica no sistema do provedor."
          ]
        }
      ]
    },
    {
      id: "mpls",
      titulo: "MANs Ethernet Baseadas em MPLS",
      blocos: [
        {
          tipo: "texto",
          texto: "Embora o cliente utilize um serviço Ethernet, a operadora precisa transportar o tráfego de milhares de clientes pela mesma infraestrutura. Para realizar esse transporte de forma eficiente, ela utiliza o MPLS (Multiprotocol Label Switching). Assim, em uma MAN Ethernet baseada em MPLS, o cliente utiliza Ethernet, enquanto a operadora utiliza o MPLS para encaminhar os dados dentro do seu backbone. Em outras palavras, a Metro Ethernet representa o serviço oferecido ao cliente, enquanto o MPLS é a tecnologia utilizada internamente pela operadora para garantir desempenho, escalabilidade, qualidade de serviço e confiabilidade na comunicação entre as redes."
        },
        {
          tipo: "texto",
          texto: "Comutação por Rótulos (MPLS): O MPLS (Multiprotocol Label Switching) é uma técnica de transporte de dados que opera entre a Camada 2 (Enlace) e a Camada 3 (Rede) do modelo OSI."
        },
        {
          tipo: "lista",
          itens: [
            "Adiciona um cabeçalho curto (rótulo/etiqueta) ao pacote de dados assim que ele entra na rede metropolitana. Os roteadores intermediários (Label Switch Routers) comutam o pacote baseando-se apenas nesse rótulo."
          ]
        },
        {
          tipo: "imagem",
          id: "figura_mpls_label_switched_path_lsp",
          src: "mpls_label_switched_path_lsp.png",
          pasta: "imagens_redes2/aula_04",
          alt: "Diagrama MPLS - Label-Switched Path (LSP) mostrando o caminho de rótulos entre a rede 192.168.0.0/24 e a rede 10.0.0.0/24 através dos roteadores R1 (Edge LSR), R2, R3, R4 (Intermediate LSR) e R5 (Edge LSR), com tabelas de FIB e LFIB indicando label-in, label-out e via em cada roteador.",
          num: 1
        },
        {
          tipo: "topico",
          titulo: "Funcionamento (cinco etapas)",
          lista: [
            "Envio dos dados: Um computador envia um quadro Ethernet para outro dispositivo localizado em outra filial da empresa.",
            "Entrada na rede da operadora: Ao entrar na rede da operadora, o tráfego Ethernet é identificado e preparado para ser transportado pela infraestrutura metropolitana.",
            "Adição do Label: O primeiro roteador MPLS adiciona um Label (rótulo) ao pacote. Esse rótulo identifica o caminho que deverá ser seguido dentro da rede da operadora.",
            "Encaminhamento pela rede MPLS: Durante o percurso, os roteadores da rede MPLS não precisam analisar o endereço IP do pacote. Eles observam apenas o Label, substituindo-o por outro quando necessário e encaminhando rapidamente o pacote para o próximo equipamento. Esse processo é conhecido como Label Swapping.",
            "Entrega ao destino: Ao chegar ao último roteador da rede MPLS, o Label é removido. Em seguida, o quadro Ethernet é entregue normalmente à rede de destino. Para o cliente, todo esse processo é transparente."
          ]
        },
        {
          tipo: "topico",
          titulo: "Por que utilizar MPLS em uma MAN Ethernet?",
          texto: "A utilização do MPLS traz diversas vantagens para a operadora e para os clientes.",
          lista: [
            "Maior eficiência: Os roteadores analisam apenas os Labels, tornando o encaminhamento dos pacotes mais rápido.",
            "Engenharia de Tráfego (Traffic Engineering): Permite escolher caminhos mais adequados para cada tipo de tráfego, considerando critérios como utilização da rede, largura de banda e congestionamento.",
            "Qualidade de Serviço (QoS): O MPLS permite priorizar aplicações que necessitam de baixa latência, como: Voz sobre IP (VoIP); Videoconferência; Streaming.",
            "Escalabilidade: A mesma infraestrutura pode atender milhares de clientes sem comprometer o desempenho da rede.",
            "VPNs MPLS: O MPLS permite criar redes privadas virtuais (VPNs), possibilitando que diferentes empresas utilizem a mesma infraestrutura física da operadora com isolamento lógico entre suas redes."
          ]
        }
      ]
    },
    {
      id: "aneis_opticos",
      titulo: "Anéis Ópticos e Resiliência (RPR / ERPS)",
      blocos: [
        {
          tipo: "texto",
          texto: "RPR (Resilient Packet Ring - IEEE 802.17): Arquitetura histórica de anel duplo de fibra óptica projetada para transporte eficiente de pacotes."
        },
        {
          tipo: "texto",
          texto: "ERPS (Ethernet Ring Protection Switching - ITU-T G.8032): O padrão moderno usado em redes Metro Ethernet que garante proteção em anel sem precisar do antigo SDH."
        },
        {
          tipo: "topico",
          titulo: "Como funciona o mecanismo de autorrecuperação (Self-Healing)",
          lista: [
            "Em condições normais, um link no anel fica \"bloqueado\" de forma lógica para evitar que os dados fiquem dando voltas infinitas (loop).",
            "Quando ocorre um rompimento físico de cabo em algum ponto da cidade, os switches das pontas percebem a queda em menos de 50 milissegundos.",
            "O bloqueio é liberado e os dados passam a fluir pelo caminho oposto do anel."
          ]
        },
        {
          tipo: "exemplo",
          titulo: "Acidentes em vias públicas urbanas",
          texto: "Em vias públicas urbanas é muito comum ocorrerem acidentes de trânsito em postes ou escavações que cortam cabos. O anel garante que os serviços (como bancos e hospitais) não fiquem fora do ar."
        }
      ]
    },
    {
      id: "infraestrutura",
      titulo: "Infraestrutura Física e Lógica",
      blocos: [
        {
          tipo: "texto",
          texto: "A infraestrutura de uma MAN é dividida em Planta Externa (Passiva) e Equipamentos Ativos."
        },
        {
          tipo: "topico",
          titulo: "Planta Externa (Passiva)",
          texto: "É composta pelos elementos que não necessitam de energia elétrica e têm como função suportar ou conduzir o sinal óptico.",
          lista: [
            "Fibra Óptica Monomodo (SMF): Utilizada em 100% das redes metropolitanas devido ao baixo nível de atenuação do sinal de luz em longas distâncias.",
            "Mecanismos de Passagem: Dutos subterrâneos, caixas de inspeção (manholes) e posteamento público.",
            "DIOs (Distribuidores Internos Ópticos) e Caixas de Emenda: Ponto de fusão e organização dos cabos de fibra."
          ]
        },
        {
          tipo: "topico",
          titulo: "Equipamentos Ativos e Nós da Rede",
          texto: "São os equipamentos que necessitam de alimentação elétrica e processam, regeneram, amplificam ou encaminham os sinais.",
          lista: [
            "PoPs (Points of Presence): Central de distribuição onde os equipamentos concentradores ficam alojados com redundância de energia (Nobreaks/Geradores) e climatização.",
            "Switches Metro Ethernet / Roteadores MPLS: Processam o tráfego com alta capacidade de comutação.",
            "Amplificadores ópticos (EDFA); Repetidores ópticos; Transceptores ópticos (SFP, SFP+, QSFP); Multiplexadores/Demultiplexadores DWDM ativos."
          ]
        }
      ]
    },
    {
      id: "multiplexacao",
      titulo: "Multiplexação Óptica (CWDM e DWDM)",
      blocos: [
        {
          tipo: "texto",
          texto: "Multiplexação Óptica (CWDM e DWDM): Para evitar o lançamento contínuo de novos cabos de fibra nas ruas, utilizam-se técnicas de multiplexação que dividem o feixe de luz em múltiplos comprimentos de onda (cores):"
        },
        {
          tipo: "lista",
          itens: [
            "CWDM (Coarse WDM): Espaçamento maior entre canais. Suporta até 18 canais por par de fibra. Custo acessível.",
            "DWDM (Dense WDM): Espaçamento muito denso. Permite transmitir mais de 80 canais em um único filamento de fibra, atingindo taxas superiores a Terabits por segundo."
          ]
        },
        {
          tipo: "tabela",
          titulo: "Comparação entre CWDM e DWDM",
          colunas: ["Característica", "CWDM (Coarse Wavelength Division Multiplexing)", "DWDM (Dense Wavelength Division Multiplexing)"],
          linhas: [
            ["Significado", "Multiplexação por Divisão de Comprimento de Onda Grossa", "Multiplexação por Divisão de Comprimento de Onda Densa"],
            ["Espaçamento entre canais", "Grande (canais mais espaçados)", "Muito pequeno (canais muito próximos)"],
            ["Número de canais", "Até 18 canais por par de fibra", "Mais de 80 canais (podendo chegar a centenas, dependendo da tecnologia)"],
            ["Capacidade de transmissão", "Média", "Muito alta (atinge taxas superiores a Tb/s)"],
            ["Custo de implantação", "Baixo", "Alto"],
            ["Complexidade", "Menor", "Maior"],
            ["Equipamentos utilizados", "Mais simples e econômicos", "Mais sofisticados e de maior precisão"],
            ["Alcance", "Curto a médio alcance", "Médio a longo alcance"],
            ["Aplicações típicas", "Redes metropolitanas (MANs), provedores regionais, empresas e universidades", "Backbones de operadoras, redes de longa distância (WANs) e grandes data centers"],
            ["Principal vantagem", "Baixo custo e facilidade de implantação", "Elevada capacidade de transmissão e melhor aproveitamento da fibra óptica"],
            ["Principal desvantagem", "Menor capacidade de expansão", "Maior custo de implantação e manutenção"]
          ]
        }
      ]
    },
    {
      id: "wman",
      titulo: "WMAN (Wireless Metropolitan Area Network)",
      blocos: [
        {
          tipo: "texto",
          texto: "A WMAN (Wireless Metropolitan Area Network) é uma Rede Metropolitana sem Fio, ou seja, uma rede que conecta diferentes redes locais (LANs) distribuídas em uma cidade ou região metropolitana utilizando tecnologias de comunicação sem fio, em vez de cabos. Enquanto uma MAN tradicional utiliza principalmente fibra óptica, a WMAN utiliza ondas de rádio para transmitir os dados."
        },
        {
          tipo: "topico",
          titulo: "Por que surgiu a WMAN?",
          texto: "Nem sempre é possível instalar fibra óptica entre dois pontos devido a fatores como:",
          lista: [
            "alto custo de implantação;",
            "obstáculos geográficos;",
            "áreas rurais ou de difícil acesso;",
            "necessidade de implantação rápida."
          ]
        },
        {
          tipo: "texto",
          texto: "Nesses casos, a comunicação pode ser realizada por meio de enlaces sem fio."
        },
        {
          tipo: "topico",
          titulo: "Principais componentes de uma WMAN",
          lista: [
            "Estações Base (Base Stations): São os equipamentos responsáveis por transmitir e receber o sinal de rádio. Funcionam como \"torres de comunicação\", atendendo uma determinada área da cidade.",
            "Antenas: Realizam a transmissão e recepção das ondas eletromagnéticas. Podem ser instaladas em: torres; prédios; postes; morros.",
            "Equipamentos do usuário (CPE): O CPE (Customer Premises Equipment) é o equipamento instalado no cliente. Sua função é receber o sinal da estação base e conectá-lo à rede local da empresa ou residência.",
            "Backbone: As estações base normalmente são conectadas ao backbone da operadora."
          ]
        },
        {
          tipo: "topico",
          titulo: "WiMAX (IEEE 802.16)",
          texto: "É a tecnologia mais conhecida para implementação de WMANs. Foi desenvolvida para oferecer acesso em banda larga sem fio em áreas metropolitanas.",
          lista: [
            "cobertura de vários quilômetros;",
            "altas taxas de transmissão;",
            "suporte a múltiplos usuários;",
            "comunicação ponto-multiponto."
          ]
        },
        {
          tipo: "topico",
          titulo: "Vantagens da WMAN",
          lista: [
            "Implantação rápida;",
            "Menor custo quando comparada à instalação de fibra óptica;",
            "Flexibilidade para expansão;",
            "Cobertura de grandes áreas;",
            "Ideal para locais onde o cabeamento é inviável."
          ]
        },
        {
          tipo: "topico",
          titulo: "Desvantagens da WMAN",
          lista: [
            "Menor estabilidade quando comparada à fibra óptica;",
            "Interferências causadas por obstáculos e condições climáticas;",
            "Menor capacidade de transmissão em relação às redes ópticas;",
            "Necessidade de visada direta em alguns tipos de enlace."
          ]
        }
      ]
    },
    {
      id: "sonet_sdh",
      titulo: "SONET e SDH",
      blocos: [
        {
          tipo: "texto",
          texto: "As tecnologias SONET (Synchronous Optical Network) e SDH (Synchronous Digital Hierarchy) foram a espinha dorsal de redes metropolitanas e de longa distância durante as décadas de 1980 e 1990 aproximadamente. No entanto, foram gradualmente substituídas por Metro Ethernet, MPLS e DWDM."
        },
        {
          tipo: "destaque",
          texto: "A razão fundamental para essa substituição foi a mudança drástica no perfil do tráfego de comunicação: a transição de um mundo focado em voz (comutação de circuitos) para um mundo dominado por dados (comutação de pacotes IP)."
        }
      ]
    }
  ]
    },
    // aula 5
    {
      aula: "Introdução a redes móveis e redes ad hoc",
      ideia_central: "As redes sem fio se dividem em Redes Celulares Móveis, baseadas em infraestrutura hierárquica e evoluídas ao longo de gerações (1G a 5G), e Redes Ad-hoc Sem Fio, descentralizadas e compostas por diversas categorias (WPAN, WLAN, WMAN, WMN, WSN, MANET/VANET), cada uma exigindo estratégias específicas de gerenciamento de mobilidade, recursos, segurança e identidade.",
      secoes: [
        {
          id: "objetivos",
          titulo: "Objetivos de Aprendizagem",
          blocos: [
            {
              tipo: "lista",
              itens: [
                "Compreender os conceitos fundamentais das redes sem fio, móveis e ad hoc.",
                "Diferenciar redes com infraestrutura das redes ad hoc, reconhecendo suas características, vantagens e limitações.",
                "Explicar a evolução das tecnologias de redes móveis e sua influência no desenvolvimento das comunicações sem fio."
              ]
            }
          ]
        },
        {
          id: "visao_geral_sem_fio",
          titulo: "Redes Sem Fio: Visão Geral",
          blocos: [
            {
              tipo: "lista",
              itens: [
                "Conectam dispositivos sem a necessidade de cabos físicos.",
                "Utilizam ondas de rádio, infravermelho ou micro-ondas para comunicação.",
                "Dividem-se em dois grandes grupos: Redes Celulares Móveis e Redes Ad-hoc Sem Fio."
              ]
            },
            {
              tipo: "topico",
              titulo: "Além das já estudadas",
              lista: [
                "WPAN: Bluetooth, NFC",
                "WLAN: Wi-Fi",
                "WMAN: WiMAX"
              ]
            },
            {
              tipo: "topico",
              titulo: "Redes Celulares Móveis",
              lista: [
                "Baseadas em uma infraestrutura hierárquica (estações rádio base, torres, antenas).",
                "Permitem mobilidade contínua entre células (handover)."
              ]
            },
            {
              tipo: "topico",
              titulo: "Redes Ad-hoc Sem Fio",
              lista: [
                "Estrutura descentralizada",
                "Os dispositivos comunicam-se diretamente entre si.",
                "Cada nó atua como emissor, receptor e roteador.",
                "Características: Autoconfiguração e autogestão; Alta mobilidade dos nós; Escalabilidade limitada e desafios de segurança."
              ]
            }
          ]
        },
        {
          id: "comunicacao_redes_sem_fio",
          titulo: "Comunicação em Redes Sem Fios",
          blocos: [
            {
              tipo: "lista",
              itens: [
                "Nas redes sem fio, os dados são transmitidos através do ar, permitindo a comunicação remota sem necessidade de cabos físicos.",
                "Utilizam ondas eletromagnéticas (como ondas de rádio) para transportar informações.",
                "Os bits de informação são convertidos em ondas eletromagnéticas dentro de uma faixa de radiofrequência (RF).",
                "As ondas de rádio podem percorrer longas distâncias e atravessar obstáculos, como paredes e edifícios."
              ]
            }
          ]
        },
        {
          id: "evolucao_redes_moveis",
          titulo: "A Evolução das Redes Móveis",
          blocos: [
            {
              tipo: "lista",
              itens: [
                "Em 1926 surgiu o início do serviço de telefonia móvel.",
                "Em 1947 surgiram as teorias sobre redes de telefonia celular, porém somente em 1973 realizada a primeira chamada de um telefone celular móvel para um telefone fixo, marcando o início da era dos celulares."
              ]
            },
            {
              tipo: "imagem",
              id: "figura_martin_cooper_primeiro_celular",
              src: "figura_martin_cooper_primeiro_celular.png",
              pasta: "imagens_redes2/aula_05",
              alt: "Martin Cooper (Motorola) com o primeiro celular funcional, dispositivo volumoso com antena externa e teclado numérico, ilustrando a primeira chamada móvel de 1973.",
              num: 1
            },
            {
              tipo: "imagem",
              id: "diagrama_evolucao_redes_celulares_geracoes",
              src: "diagrama_evolucao_redes_celulares_geracoes.png",
              pasta: "imagens_redes2/aula_05",
              alt: "Diagrama mostrando a Rede Celular Móvel se ramificando em Rede Celular Analógica (levando à geração 1G) e Rede Celular Digital (ramificando-se em 2G, 3G, 4G e 5G).",
              num: 2
            },
            {
              tipo: "topico",
              titulo: "Redes analógicas (1G)",
              lista: [
                "Implantadas entre 1970 e 1980.",
                "Transmissão somente sinais analógicos (voz) utilizando a técnica FDMA (Frequency Division Multiple Access)"
              ]
            },
            {
              tipo: "topico",
              titulo: "Segunda Geração (2G)",
              lista: [
                "Lançada em meados 1991, com comunicação digital.",
                "Vantagens: Melhor qualidade de sinal; Implementação de medidas de segurança.",
                "Possibilidade de criptografia."
              ]
            },
            {
              tipo: "topico",
              titulo: "Evolução do 2G ao 3G",
              texto: "Etapas intermediárias:",
              lista: [
                "2G → 2.5G: aumento da taxa de dados (56 → 114 kbit/s).",
                "2.5G → 2.75G (EDGE): melhoria da transmissão de dados.",
                "2.75G → 3G (UMTS): rede totalmente digital e multimídia.",
                "Aplicações: SMS e internet móvel."
              ]
            },
            {
              tipo: "topico",
              titulo: "Terceira Geração (3G)",
              texto: "Final da década de 1990 a início dos anos 2000",
              lista: [
                "Demandas que motivaram o 3G: Compatibilidade com o sistema 2G.",
                "Suporte a comunicações multimídia.",
                "Maior eficiência e velocidade (até 2 Mbps).",
                "Base para serviços de internet móvel global."
              ]
            },
            {
              tipo: "topico",
              titulo: "Quarta Geração (4G)",
              lista: [
                "Lançado em 2009",
                "Baseada em IP (Internet Protocol).",
                "Integra voz, dados e streaming multimídia.",
                "Oferece conexão a qualquer hora e lugar."
              ]
            },
            {
              tipo: "topico",
              titulo: "Quinta Geração (5G)",
              texto: "Lançado em 2019. Velocidade: até 10 Gbps (10 a 50 vezes mais que a 4G).",
              lista: [
                "Benefícios: Menor latência (tempo de resposta).",
                "Baixo consumo de energia.",
                "Maior número de dispositivos conectados (IoT).",
                "Cenário atual: 5.5G e 6G (em desenvolvimento)"
              ]
            }
          ]
        },
        {
          id: "gerenciamento_redes_moveis",
          titulo: "Gerenciamento de Redes Móveis",
          blocos: [
            {
              tipo: "texto",
              texto: "As redes móveis são um tipo especial de sistema sem fio."
            },
            {
              tipo: "topico",
              titulo: "Características principais",
              lista: [
                "Reutilização de frequência.",
                "Mobilidade com roaming.",
                "Transações de handoff/handover (transferência entre células).",
                "Cobrem grandes áreas divididas em células.",
                "As frequências de transmissão são reutilizadas entre células com mínima interferência."
              ]
            },
            {
              tipo: "topico",
              titulo: "Desafios das Redes Móveis",
              lista: [
                "Controle de acesso ao meio: muitos usuários compartilham o mesmo canal.",
                "Largura de banda limitada: reduzida devido ao alto número de conexões.",
                "Alta complexidade: gerenciamento de mobilidade em grandes áreas.",
                "Limitações de energia: dispositivos móveis dependem de baterias.",
                "Segurança: cobertura ampla facilita tentativas de ataques externos."
              ]
            },
            {
              tipo: "topico",
              titulo: "Principais Propriedades de Gerenciamento",
              lista: [
                "Gestão da Mobilidade: rastreia e atualiza a posição dos usuários.",
                "Gerenciamento de Recursos: controla o uso eficiente de banda e potência.",
                "Gerenciamento de Segurança: protege contra acessos e ataques indevidos.",
                "Gerenciamento de Identidades: autentica e identifica usuários na rede."
              ]
            },
            {
              tipo: "imagem",
              id: "diagrama_gerenciamento_redes_moveis",
              src: "diagrama_gerenciamento_redes_moveis.png",
              pasta: "imagens_redes2/aula_05",
              alt: "Diagrama de Gerenciamento de redes móveis em quatro colunas: Gestão da Mobilidade (Paging, Roaming, Atualização da Localização); Gerenciamento de Recursos (Controle de congestionamento, Controle de energia, Taxa de alocação, Planejamento das células, Precificação dos serviços); Gerenciamento de Segurança (Propriedades de segurança, Tipos de ataques); Gerenciamento de Identidades (SIM, AuC).",
              num: 3
            },
            {
              tipo: "topico",
              titulo: "Estrutura da Rede Celular",
              lista: [
                "Composta por várias estações-base (células individuais).",
                "Cada estação-base (célula) cobre uma pequena área geográfica.",
                "Cada área possui um identificador de localização.",
                "A integração das células permite ampla cobertura regional.",
                "Um conjunto de estações-base forma uma área local ou área de roteamento."
              ]
            },
            {
              tipo: "topico",
              titulo: "Procedimento de Atualização de Localização",
              lista: [
                "O dispositivo móvel detecta o código da área de cobertura.",
                "Quando o código é diferente do anterior, o dispositivo: Realiza uma atualização de localização.",
                "Envia uma requisição de atualização à rede.",
                "Inclui o último código de localização armazenado.",
                "Esse processo permite à rede saber onde o usuário está para manter o serviço ativo."
              ]
            },
            {
              tipo: "topico",
              titulo: "Gestão da Mobilidade",
              texto: "Objetivo: manter o rastreamento e a conectividade dos usuários para garantir o acesso a serviços (voz, SMS, dados etc.).",
              lista: [
                "Componentes principais:",
                "Paging: localização do dispositivo quando há uma chamada ou serviço a ser entregue.",
                "Roaming: permite ao usuário utilizar a rede em diferentes áreas geográficas.",
                "Atualização da localização: o dispositivo informa à rede quando muda de área.",
                "Cada usuário possui uma TMSI (Temporary Mobile Subscriber Identity), uma identidade temporária atribuída sempre que o usuário muda de área."
              ]
            },
            {
              tipo: "topico",
              titulo: "Paging — como funciona",
              texto: "O Paging é o processo de localização de um dispositivo móvel (como um smartphone) dentro da rede quando há uma tentativa de comunicação com ele — por exemplo, quando alguém liga para o seu número.",
              lista: [
                "Quando o celular está ocioso (sem tráfego de dados ou chamadas ativas), ele não mantém comunicação constante com a rede. Assim, quando uma chamada ou mensagem chega, a rede precisa descobrir em qual célula (ou conjunto de células) o dispositivo está registrado.",
                "Para isso, ela envia uma mensagem de \"paging\" por várias torres dentro da área onde o aparelho foi visto pela última vez.",
                "Assim que o telefone recebe essa mensagem, ele responde, e a conexão é estabelecida."
              ]
            },
            {
              tipo: "topico",
              titulo: "Roaming — como funciona",
              texto: "O Roaming é o processo que permite ao usuário utilizar sua rede móvel fora de sua área de registro original, ou seja, em outras regiões geográficas ou até países, mantendo o mesmo número e serviços.",
              lista: [
                "Quando o usuário sai da área de cobertura da sua operadora \"doméstica\" (Home Network) e entra em outra área — pertencente a uma rede parceira (Visited Network) —, o celular registra-se automaticamente nessa nova rede.",
                "Isso é possível porque as operadoras firmam acordos de roaming, permitindo o uso compartilhado de infraestrutura.",
                "Obs: pode ser necessário a contratação de pacotes de serviços que variam de preços de acordo com os serviços e países."
              ]
            },
            {
              tipo: "topico",
              titulo: "Gerenciamento de Recursos",
              texto: "Objetivo: garantir qualidade de serviço (QoS) e eficiência no uso dos recursos da rede.",
              lista: [
                "Principais funções:",
                "Controle de congestionamento: evita sobrecarga da rede (descarte de chamadas, redução da taxa de transmissão, etc.).",
                "Controle de energia: otimiza o consumo e reduz interferências.",
                "Taxa de alocação: busca equilibrar energia e taxa de transmissão sem gerar \"starvation\".",
                "Planejamento das células: inclui alocação de largura de banda, planejamento de estações-base, controle de energia e setorização.",
                "Precificação dos serviços: regula a demanda e gera receita, considerando a limitação física dos recursos da rede."
              ]
            },
            {
              tipo: "topico",
              titulo: "Gerenciamento de Segurança",
              texto: "Objetivo: proteger a infraestrutura e os dados transmitidos.",
              lista: [
                "Propriedades de segurança: Autenticação, integridade, confidencialidade e controle de acesso.",
                "Detecção de vírus, malwares e localização do dispositivo.",
                "Principais tipos de ataques: Negação de serviço (DoS), jamming (ataque cibernético que interfere ou bloqueia intencionalmente a comunicação em redes sem fio), acesso não autorizado, bisbilhotagem, falsificação de mensagens, replay, homem no meio e sequestro de sessão."
              ]
            },
            {
              tipo: "topico",
              titulo: "Gerenciamento de Identidade",
              texto: "Objetivo: garante que somente usuários autorizados possam acessar a rede e que suas informações pessoais sejam protegidas durante a comunicação. Cada usuário de uma rede móvel possui uma identidade única armazenada no cartão SIM (Subscriber Identity Module).",
              lista: [
                "Funções do Gerenciamento de Identidade:",
                "Autenticação: confirma que o usuário é realmente quem diz ser.",
                "Autorização: define quais serviços o usuário pode acessar (voz, dados, roaming, etc.).",
                "Privacidade: protege as informações pessoais e evita que terceiros rastreiem o usuário.",
                "Rastreamento seguro: mantém a capacidade de localizar o dispositivo para entrega de chamadas e mensagens, sem expor dados sensíveis."
              ]
            }
          ]
        },
        {
          id: "evolucao_redes_ad_hoc",
          titulo: "Evolução das Redes Sem Fio Ad Hoc",
          blocos: [
            {
              tipo: "destaque",
              texto: "Obs: uma tecnologia pode pertencer a mais de um tipo de rede."
            },
            {
              tipo: "imagem",
              id: "diagrama_evolucao_redes_sem_fio_ad_hoc",
              src: "diagrama_evolucao_redes_sem_fio_ad_hoc.png",
              pasta: "imagens_redes2/aula_05",
              alt: "Diagrama ramificando a Rede Sem Fio Ad-hoc em Rede sem fio de área pessoal (WPAN), Rede sem fio de área local (WLAN), Rede sem fio de área metropolitana (WMAN), Rede sem fio de área mesh (WMN), Rede de sensores sem fio (WSN) e Redes móveis Ad-hoc (MANET). A WPAN se ramifica em Comunicação por infravermelho (IrDA), Bluetooth, Comunicação por Campo de Proximidade (NFC), Banda ultralarga (UWB), Wireless USB (WUSB), Z-Wave e ZigBee. A MANET se ramifica em Redes Veiculares Ad-hoc (VANET) e Redes VANET Inteligentes.",
              num: 4
            },
            {
              tipo: "topico",
              titulo: "Redes de Área Pessoal (WPAN – Wireless Personal Area Network)",
              texto: "Primeira evolução prática das redes ad hoc. Projetadas para curta distância (até 10 metros), conectando dispositivos pessoais.",
              lista: [
                "Exemplos de tecnologias:",
                "Bluetooth – Comunicação entre dispositivos próximos, muito usada em áudio, periféricos e compartilhamento de dados.",
                "IrDA (Infravermelho) – Comunicação óptica ponto a ponto, usada em controles remotos e dispositivos mais antigos.",
                "NFC (Near Field Communication) – Comunicação por campo de proximidade, comum em pagamentos por aproximação e cartões inteligentes.",
                "UWB (Ultra Wideband) – Comunicação de alta velocidade e precisão, usada em rastreamento de localização e transferência de dados.",
                "Wireless USB (WUSB) – Versão sem fio do USB tradicional, projetada para conexões de alta taxa de transmissão.",
                "ZigBee – Voltado à automação residencial e industrial, com baixo consumo de energia e alta confiabilidade em topologias mesh.",
                "Z-Wave – Focado em IoT e automação doméstica, permitindo o controle remoto de dispositivos como lâmpadas, portas e sensores de segurança."
              ]
            },
            {
              tipo: "tabela",
              titulo: "Comparação de tecnologias WPAN/WLAN",
              colunas: ["Tecnologia", "Alcance", "Velocidade", "Consumo"],
              linhas: [
                ["Bluetooth", "10 m", "média", "baixo"],
                ["ZigBee", "100 m", "baixa", "muito baixo"],
                ["NFC", "centímetros", "baixa", "muito baixo"],
                ["Wi-Fi", "dezenas de metros", "muito alta", "maior"]
              ]
            },
            {
              tipo: "topico",
              titulo: "Redes de Área Local (WLAN – Wireless Local Area Network)",
              lista: [
                "Expansão da cobertura para ambientes maiores, como casas, escolas e empresas.",
                "O padrão Wi-Fi é o principal exemplo.",
                "Ainda que possa operar em modo ad hoc, muitas vezes utiliza pontos de acesso (modo infraestrutura)."
              ]
            },
            {
              tipo: "imagem",
              id: "diagrama_wlan_modo_infraestrutura",
              src: "diagrama_wlan_modo_infraestrutura.png",
              pasta: "imagens_redes2/aula_05",
              alt: "Diagrama mostrando laptop, computador desktop e tablet conectados sem fio a um roteador central (BSS), que se conecta a uma Rede Local Cabeada e depois à Internet.",
              num: 5
            },
            {
              tipo: "topico",
              titulo: "Redes de Área Metropolitana (WMAN – Wireless Metropolitan Area Network)",
              lista: [
                "Abrangem áreas urbanas inteiras, conectando múltiplas WLANs.",
                "Um exemplo clássico é o WiMAX, projetado para prover acesso de banda larga sem fio em larga escala (6 a 9km).",
                "Embora tenha sido uma alternativa promissora para a conexão de banda larga, o WiMAX foi amplamente substituído pelo 4G LTE em aplicações comerciais, que se tornou o padrão para a tecnologia móvel na época."
              ]
            },
            {
              tipo: "imagem",
              id: "diagrama_cobertura_wimax_wifi",
              src: "diagrama_cobertura_wimax_wifi.png",
              pasta: "imagens_redes2/aula_05",
              alt: "Diagrama de uma torre WiMAX irradiando ondas de cobertura sobre área urbana, hotspots, áreas externas, residências e veículos, com legenda distinguindo cobertura WiMAX de Wi-Fi.",
              num: 6
            },
            {
              tipo: "topico",
              titulo: "Redes Mesh (WMN – Wireless Mesh Network)",
              lista: [
                "Evoluíram das redes ad hoc com a introdução de nós roteadores fixos.",
                "Cada nó colabora para retransmitir o sinal, aumentando a confiabilidade e cobertura da rede.",
                "São amplamente usadas em cidades inteligentes e ambientes corporativos"
              ]
            },
            {
              tipo: "imagem",
              id: "diagrama_rede_mesh_wmn",
              src: "diagrama_rede_mesh_wmn.png",
              pasta: "imagens_redes2/aula_05",
              alt: "Diagrama de Roteadores Mesh interconectados formando uma malha, com um Roteador Mesh Gateway central conectado à Internet, e laptops e smartphones conectados aos roteadores mesh nas extremidades.",
              num: 7
            },
            {
              tipo: "topico",
              titulo: "Redes de Sensores Sem Fio (WSN – Wireless Sensor Network)",
              lista: [
                "Criadas para monitoramento e coleta de dados (temperatura, pressão, umidade etc.).",
                "Utilizam sensores interconectados que transmitem informações de forma autônoma.",
                "Tecnologias como ZigBee e Z-Wave são exemplos."
              ]
            },
            {
              tipo: "imagem",
              id: "ilustracao_casa_inteligente_wsn",
              src: "ilustracao_casa_inteligente_wsn.png",
              pasta: "imagens_redes2/aula_05",
              alt: "Ilustração de uma casa conectada a ícones de sensores e dispositivos IoT ao redor dela — segurança, Wi-Fi, luminosidade, água, energia solar, controle de energia, temperatura, iluminação, TV e proteção.",
              num: 8
            },
            {
              tipo: "topico",
              titulo: "Redes Móveis Ad Hoc (MANET – Mobile Ad Hoc Network)",
              texto: "É uma rede de dispositivos sem fio que se comunicam diretamente uns com os outros sem a necessidade de uma infraestrutura fixa, como roteadores ou torres de celular. Cada dispositivo pode funcionar como roteador, encaminhando tráfego para outros nós na rede.",
              lista: [
                "Muito usadas em operações militares, resgate, eventos temporários e ambientes sem infraestrutura fixa."
              ]
            },
            {
              tipo: "topico",
              titulo: "Redes Veiculares Ad Hoc (VANET e VANET Inteligentes)",
              lista: [
                "São uma especialização das MANETs aplicadas a veículos.",
                "Permitem comunicação entre carros e com a infraestrutura viária (semáforos, sensores de trânsito).",
                "As VANET Inteligentes evoluem com o uso de IA e IoT, visando maior segurança e eficiência no tráfego"
              ]
            }
          ]
        },
        {
          id: "amazon_go",
          titulo: "Exemplo — Supermercado Amazon Go",
          blocos: [
            {
              tipo: "exemplo",
              titulo: "supermercado amazon go",
              texto: "As lojas Amazon Go utilizam uma infraestrutura de rede altamente integrada, baseada em Wi-FI corporativo, IoT e IA. Câmeras, balanças, sensores de movimento e prateleiras inteligentes se conectam via Wi-Fi tradicional e protocolos IoT (como Zigbee e Bluetooth Low Energy). A rede sem fio é gerenciada centralmente, com alta largura de banda e baixa latência para comunicação entre dispositivos e servidores locais. Parte do processamento dos dados é feita localmente, dentro da loja, para reduzir o tempo de resposta. Uso de servidores de borda analisam as imagens e sensores em tempo real (quem pegou o quê, quem saiu da loja, etc.).",
              detalhe: "As informações processadas localmente são sincronizadas com a nuvem da Amazon Web Services (AWS), onde ocorre o aprendizado contínuo dos algoritmos de visão computacional e comportamento de compra."
            }
          ]
        },
        {
          id: "gerenciamento_redes_ad_hoc",
          titulo: "Gerenciamento de Redes Sem Fio Ad Hoc",
          blocos: [
            {
              tipo: "texto",
              texto: "As redes Ad Hoc são sistemas autônomos, dinâmicos e descentralizados, onde cada nó atua simultaneamente como cliente e roteador, transmitindo dados de forma colaborativa. Por isso, o gerenciamento dessas redes deve lidar de forma integrada com mobilidade, recursos, segurança e desempenho, mantendo a conectividade mesmo sem uma infraestrutura fixa."
            },
            {
              tipo: "imagem",
              id: "diagrama_gerenciamento_redes_ad_hoc",
              src: "diagrama_gerenciamento_redes_ad_hoc.png",
              pasta: "imagens_redes2/aula_05",
              alt: "Diagrama de Gerenciamento de Redes Sem Fio Ad Hoc em oito blocos: Gerenciamento de Mobilidade (Roteamento, Localização); Gerenciamento de Recursos (Espectro, Energia); Gerenciamento de Segurança (Ataques, Alternativas); Autogerenciamento (Detecção, Recuperação); Gerenciamento da Escalabilidade (Hierarquia); Gerenciamento da Confiança (Sobrevivência); Gerenciamento Integrado (Roaming, Handoff); Gerenciamento de Serviços (QoS).",
              num: 9
            },
            {
              tipo: "topico",
              titulo: "Gerenciamento de Mobilidade",
              texto: "Objetivo: garantir que os nós móveis permaneçam conectados mesmo com mudanças de posição. A mobilidade é o núcleo das redes Ad Hoc, pois os nós mudam constantemente de posição. Para manter a comunicação ativa, a rede utiliza protocolos de roteamento dinâmico (como AODV e DSR), que reconstroem rotas sempre que a topologia muda. Esse gerenciamento se apoia em dois processos interligados:",
              lista: [
                "Atualização de localização: cada nó informa periodicamente sua posição à rede, permitindo que os outros saibam por onde enviar os dados.",
                "Handoff/Handover: quando um nó sai da área de cobertura de outro, a rede realiza uma troca suave de rota para manter a conexão ativa.",
                "Assim, o gerenciamento de mobilidade garante continuidade da comunicação e estabilidade da rede, mesmo com deslocamentos constantes dos dispositivos."
              ]
            },
            {
              tipo: "topico",
              titulo: "Gerenciamento de Recursos",
              texto: "Objetivo: otimizar o uso dos recursos limitados, como energia e espectro de frequência. Nas redes Ad Hoc, os recursos são limitados — principalmente energia, banda e capacidade de processamento. O gerenciamento de recursos envolve:",
              lista: [
                "Economia de energia: como os dispositivos geralmente são alimentados por bateria, algoritmos de economia (como modo sleep ou balanceamento de carga) ajudam a prolongar a vida útil dos nós.",
                "Gerenciamento de espectro: o uso eficiente das faixas de frequência evita interferências entre os nós e melhora o desempenho global.",
                "Controle de tráfego: garante que os recursos sejam alocados conforme a prioridade dos dados (por exemplo, priorizando mensagens críticas).",
                "Esses elementos trabalham em conjunto para equilibrar desempenho, eficiência energética e estabilidade da rede."
              ]
            },
            {
              tipo: "topico",
              titulo: "Gerenciamento de Segurança",
              texto: "Objetivo: proteger a rede contra ataques e acessos não autorizados. Como não há uma estrutura central (como um servidor), a segurança é distribuída e cooperativa. Envolve três camadas principais que atuam de forma integrada:",
              lista: [
                "Autenticação: confirma se um nó é realmente quem diz ser.",
                "Criptografia: protege os dados durante a transmissão.",
                "Confiança entre nós: como cada nó encaminha pacotes de outros, a rede precisa avaliar o nível de confiança de cada participante (para evitar nós maliciosos).",
                "Esse gerenciamento é essencial para evitar ataques como falsificação, espionagem, buracos negros e negação de serviço."
              ]
            },
            {
              tipo: "topico",
              titulo: "Autogerenciamento",
              texto: "Objetivo: tornar a rede autônoma, com capacidade de se adaptar a falhas e mudanças. A rede deve ser capaz de se configurar, se adaptar e se recuperar sozinha, sem intervenção humana. Inclui três funções interligadas:",
              lista: [
                "Autoconfiguração: os nós se identificam e definem automaticamente endereços e rotas.",
                "Autoadaptação: ajusta o funcionamento conforme mudanças no ambiente (interferência, queda de nó, nova conexão).",
                "Autorreparo: detecta falhas e reconstrói rotas ou substitui nós inativos.",
                "Isso garante que a rede continue operando de forma resiliente e inteligente, mesmo diante de falhas."
              ]
            },
            {
              tipo: "topico",
              titulo: "Gerenciamento da Escalabilidade",
              texto: "Objetivo: manter a eficiência da rede mesmo com o aumento de nós conectados. À medida que o número de nós aumenta, a rede deve evitar sobrecarga de sinal e perda de desempenho. Para isso, aplica:",
              lista: [
                "Clusterização (agrupamento): divide a rede em pequenos grupos com líderes responsáveis pela coordenação.",
                "Hierarquia de controle: reduz o tráfego global e facilita a tomada de decisão local.",
                "Assim, mesmo com centenas de nós, a rede continua eficiente e organizada."
              ]
            },
            {
              tipo: "topico",
              titulo: "Gerenciamento da Confiança",
              texto: "Objetivo: assegurar a confiabilidade e resiliência da rede diante de falhas ou ataques. A confiança é a base para o funcionamento colaborativo da rede. Cada nó deve decidir em quem confiar para retransmitir mensagens. São usados mecanismos de reputação, nos quais os nós observam o comportamento uns dos outros:",
              lista: [
                "Se um nó encaminha corretamente pacotes → ganha confiança.",
                "Se atrapalha ou omite transmissões → perde reputação.",
                "Isso fortalece a resiliência e a sobrevivência da rede, mesmo sob ataques."
              ]
            },
            {
              tipo: "topico",
              titulo: "Gerenciamento Integrado",
              texto: "Objetivo: coordenar a comunicação entre diferentes tipos de redes e dispositivos. Responsável por garantir interoperabilidade entre diferentes redes e tecnologias (Wi-Fi, Bluetooth, 4G, 5G, etc.). Atua com os mecanismos de:",
              lista: [
                "Roaming: o usuário muda de uma área de cobertura para outra sem perder conexão.",
                "Handoff: troca automática de ponto de acesso durante uma chamada ou transmissão de dados.",
                "Também coordena políticas de segurança e controle de acesso entre diferentes redes."
              ]
            },
            {
              tipo: "topico",
              titulo: "Gerenciamento de Serviços",
              texto: "Objetivo: garantir a Qualidade de Serviço (QoS) nas aplicações da rede. Controla latência, perda de pacotes e largura de banda, garantindo que serviços críticos tenham prioridade. Está diretamente ligado ao gerenciamento de recursos e à mobilidade, pois a variação de rotas pode impactar o desempenho. Implementa mecanismos de priorização e agendamento, ajustando a transmissão conforme o tipo de dado (voz, vídeo, texto)."
            }
          ]
        }
      ]
    },
    // aula 6
    {
      aula: "Introdução à Segurança de Redes",
      ideia_central: "A aula apresenta os fundamentos da segurança de redes de computadores, cobrindo vulnerabilidades, ameaças e ataques, mecanismos de proteção como criptografia, autenticação, firewalls e VPNs, além da legislação brasileira sobre crimes cibernéticos.",
      secoes: [
        {
          id: "objetivos",
          titulo: "Objetivos de Aprendizagem",
          blocos: [
            {
              tipo: "lista",
              itens: [
                "Compreender os princípios fundamentais da segurança de redes de computadores.",
                "Identificar as principais ameaças, vulnerabilidades e ataques que podem comprometer uma rede.",
                "Explicar os mecanismos básicos de proteção, como autenticação, criptografia, firewalls e controle de acesso.",
                "Reconhecer a importância das políticas e boas práticas de segurança para garantir a confidencialidade, integridade e disponibilidade das informações."
              ]
            }
          ]
        },
        {
          id: "vulnerabilidades",
          titulo: "Principais Vulnerabilidades em uma Rede",
          blocos: [
            {
              tipo: "texto",
              texto: "**\"Vulnerabilidade de Rede\"** se refere a uma fraqueza ou falha em uma rede de computadores que pode ser explorada por atacantes para comprometer a segurança dos sistemas conectados. Essas vulnerabilidades podem permitir acessos não autorizados, roubos de dados, interrupções de serviço ou execução de atividades maliciosas dentro da rede."
            },
            {
              tipo: "imagem",
              id: "representacao_visual_elo_fraco_corrente",
              src: "representacao_visual_elo_fraco_corrente.png",
              pasta: "imagens_redes2/aula_06",
              alt: "Corrente de elos verdes com um elo trincado sendo examinado por uma lupa segurada por uma mão, simbolizando uma vulnerabilidade como um elo fraco em uma rede",
              num: 1
            },
            {
              tipo: "lista",
              titulo: "Principais Vulnerabilidades em uma rede",
              itens: [
                "Falta de Criptografia: Riscos de transmissão de dados em texto aberto.",
                "Configurações Padrão: Riscos de usar configurações e senhas padrão de fábrica.",
                "Senhas Fracas: Importância de senhas fortes e políticas de autenticação.",
                "Ausência de Firewalls e Controle de Acesso: Consequências de redes expostas.",
                "Software Desatualizado: Vulnerabilidades em versões antigas de software."
              ]
            }
          ]
        },
        {
          id: "vulnerabilidade_ameaca_ataque",
          titulo: "Vulnerabilidade x Ameaça x Ataque",
          blocos: [
            {
              tipo: "topico",
              titulo: "Vulnerabilidade",
              texto: "É uma fraqueza. Exemplo: software desatualizado."
            },
            {
              tipo: "topico",
              titulo: "Ameaça",
              texto: "Algo ou alguém que pode explorar a fraqueza. Exemplo: um vírus conhecido que se aproveita da falta de atualizações."
            },
            {
              tipo: "topico",
              titulo: "Ataque",
              texto: "Ato de exploração de uma vulnerabilidade, em que a ameaça se materializa. Exemplo: o vírus infecta o sistema explorando a falha do software desatualizado."
            }
          ]
        },
        {
          id: "hackers",
          titulo: "Hackers",
          blocos: [
            {
              tipo: "texto",
              texto: "O termo **\"hacker\"** refere-se a uma pessoa com profundo conhecimento técnico em informática, redes e sistemas de segurança, capaz de explorar, modificar e manipular sistemas e softwares de maneira criativa e inovadora."
            },
            {
              tipo: "lista",
              titulo: "Tipos de Hackers",
              itens: [
                "Hackers \"White Hat\" (Chapéu Branco): Utilizam suas habilidades para proteger sistemas e encontrar falhas de segurança com a permissão dos proprietários, sendo conhecidos como \"hackers éticos.\"",
                "Hackers \"Black Hat\" (Chapéu Preto): Atuam de forma ilegal ou maliciosa, explorando vulnerabilidades para roubar dados, causar prejuízos ou ganhar acesso não autorizado a sistemas.",
                "Hackers \"Grey Hat\" (Chapéu Cinza): Operam entre os limites legais e ilegais, muitas vezes explorando sistemas sem permissão, mas sem intenção maliciosa. Podem, por exemplo, identificar falhas e notificá-las aos proprietários.",
                "Outros tipos: Hacktivistas (motivados por causas políticas), Script Kiddies (amadores sem conhecimento profundo), e Hackers de Estado (envolvidos em espionagem cibernética)."
              ]
            }
          ]
        },
        {
          id: "tipos_ataques",
          titulo: "Principais Tipos de Ataques",
          blocos: [
            {
              tipo: "topico",
              titulo: "Malware",
              texto: "Um programa ou código criado para danificar, roubar dados ou causar instabilidade em um sistema. Inclui vírus, worms, cavalos de Troia, spyware e ransomware. O malware geralmente se espalha por e-mails, sites infectados ou downloads."
            },
            {
              tipo: "topico",
              titulo: "Ransomware",
              texto: "Tipo específico de malware que criptografa os dados da vítima e exige um resgate financeiro para liberar o acesso. Esse tipo de ataque tem sido responsável por grandes prejuízos financeiros e operacionais para empresas."
            },
            {
              tipo: "topico",
              titulo: "Ataque de Engenharia Social",
              texto: "Técnica onde o atacante manipula pessoas para obter informações sensíveis ou para realizar ações específicas. Isso pode ocorrer por meio de interações telefônicas, e-mails falsos, ou até mesmo interações presenciais, explorando a confiança das vítimas."
            },
            {
              tipo: "topico",
              titulo: "Phishing",
              texto: "Uma técnica de engenharia social onde o atacante se passa por uma entidade confiável para enganar a vítima e obter informações confidenciais, como senhas e dados bancários."
            },
            {
              tipo: "topico",
              titulo: "Ataque de Negação de Serviço (Distributed Denial of Service - DDoS)",
              texto: "O atacante sobrecarrega o servidor, sistema ou rede com um grande volume de tráfego, tornando-o indisponível para usuários legítimos."
            },
            {
              tipo: "topico",
              titulo: "Ataque de Força Bruta",
              texto: "Consiste em tentar inúmeras combinações de senhas até encontrar a correta e obter acesso a um sistema. Esse ataque pode ser automatizado e é particularmente eficaz contra senhas fracas."
            },
            {
              tipo: "topico",
              titulo: "SQL Injection",
              texto: "Ocorre quando um atacante insere código SQL malicioso em um campo de entrada para manipular um banco de dados e obter, alterar ou excluir dados confidenciais. Esse ataque é comum em sites que não possuem validação adequada dos dados de entrada."
            },
            {
              tipo: "topico",
              titulo: "Ataque Man-in-the-Middle",
              texto: "O atacante intercepta e possivelmente altera a comunicação entre duas partes sem o conhecimento delas. O objetivo é roubar dados, como informações de login e dados bancários, durante a transmissão."
            }
          ]
        },
        {
          id: "barreiras",
          titulo: "Tipos de Barreiras e Medidas de Segurança",
          blocos: [
            {
              tipo: "lista",
              itens: [
                "Segurança Física: Controle de acesso a locais físicos, segurança de hardware, biometria, câmeras de vigilância e alarmes.",
                "Segurança Lógica: Criptografia, firewalls, antivírus, sistemas de detecção e prevenção de intrusões (IDS/IPS), autenticação multifator.",
                "Controles de Acesso: Políticas de acesso, permissões e privilégios de usuário, gerenciamento de senhas.",
                "Backups e Recuperação de Desastres: Importância de backups regulares e de planos de recuperação em caso de falha ou ataque.",
                "Monitoramento e Auditoria: Ferramentas de monitoramento de rede, registros de log e auditorias de segurança periódicas.",
                "Políticas e Treinamento de Segurança: Importância de uma política de segurança, conscientização e treinamento dos colaboradores."
              ]
            }
          ]
        },
        {
          id: "legislacao",
          titulo: "Legislação Brasileira",
          blocos: [
            {
              tipo: "lista",
              itens: [
                "Lei Carolina Dieckmann (Lei nº 12.737/2012): Introduziu no Código Penal o crime de invasão de dispositivo de informática.",
                "LGPD (Lei Geral de Proteção de Dados Pessoais, Lei nº 13.709/2018): Regula como os dados pessoais podem ser coletados, armazenados e compartilhados, garantindo a privacidade dos cidadãos.",
                "Lei nº 14.155/2021: Alterou o Código Penal e tornou mais graves crimes como invasão de dispositivo eletrônicos, furto e estelionato cometidos por meios eletrônicos.",
                "Lei nº 14.811/2024 criminalizou o bullying e o cyberbullying, estabelecendo penalidades para a conduta, que antes poderia ser enquadrada em outros crimes como difamação e ameaça."
              ]
            }
          ]
        },
        {
          id: "wannacry",
          titulo: "WannaCry",
          blocos: [
            {
              tipo: "exemplo",
              titulo: "WannaCry",
              texto: "WannaCry foi um ransomware (software de sequestro de dados) que causou um ataque global em maio de 2017. Ele criptografava arquivos dos computadores infectados e exigia pagamento em Bitcoin para liberar o acesso. O vírus se espalhou automaticamente usando a vulnerabilidade EternalBlue, explorando uma falha no protocolo SMBv1 do Windows (compartilhamento de arquivos em rede). Essa falha havia sido descoberta pela NSA e vazou por um grupo chamado Shadow Brokers. O ataque afetou mais de 200 mil computadores em mais de 150 países, incluindo hospitais, empresas e órgãos públicos.",
              detalhe: "Na tela de resgate, aparecia o texto: \"Oops! Your files have been encrypted! If you wanna cry, pay us in Bitcoin.\""
            }
          ]
        },
        {
          id: "criptografia_intro",
          titulo: "Introdução à Criptografia",
          blocos: [
            {
              tipo: "subtitulo",
              texto: "História da criptografia"
            },
            {
              tipo: "texto",
              texto: "A história da criptografia remonta à Antiguidade e evoluiu consideravelmente ao longo dos séculos."
            },
            {
              tipo: "lista",
              itens: [
                "Código de César (c. 58 a.C.), onde as letras de uma mensagem eram deslocadas por um número fixo no alfabeto.",
                "Em 1466, o criptógrafo Leon Battista Alberti criou o \"ciframento de Alberti\".",
                "A máquina de Cifra de Vigenère, criada em 1586, ofereceu uma cifra polialfabética que era muito difícil de quebrar até o século XIX.",
                "Primeira e Segunda Guerra Mundial, o uso de criptografia se intensificou, com sistemas como o código Enigma da Alemanha, que usava uma máquina de cifra complexa."
              ]
            },
            {
              tipo: "imagem",
              id: "representacao_visual_cifra_cesar_tabela_substituicao",
              src: "representacao_visual_cifra_cesar_tabela_substituicao.png",
              pasta: "imagens_redes2/aula_06",
              alt: "Esquema com deslocamento de letras do alfabeto ilustrando o código de César, e uma tabela quadrada completa de A a Z representando a substituição alfabética usada em cifras polialfabéticas como a de Vigenère",
              num: 2
            },
            {
              tipo: "subtitulo",
              texto: "História da criptografia - Era Digital (Século XX até hoje)"
            },
            {
              tipo: "topico",
              titulo: "Criptografia Simétrica",
              lista: [
                "Algoritmo AES (Advanced Encryption Standard)",
                "Algoritmo DES (Data Encryption Standard)",
                "Triple DES (3DES)"
              ]
            },
            {
              tipo: "topico",
              titulo: "Criptografia Assimétrica",
              lista: [
                "Algoritmo RSA",
                "Algoritmo ECC (Elliptic Curve Cryptography)",
                "Algoritmo DSA (Digital Signature Algorithm)"
              ]
            },
            {
              tipo: "topico",
              titulo: "Funções Hash",
              lista: [
                "SHA-2 (Secure Hash Algorithm 2)",
                "SHA-3"
              ]
            },
            {
              tipo: "topico",
              titulo: "Assinaturas Digitais",
              texto: "Aplicação da criptografia, apresentada como uma das categorias que compõem a era digital da criptografia."
            },
            {
              tipo: "subtitulo",
              texto: "O que é a técnica de criptografia?"
            },
            {
              tipo: "texto",
              texto: "A técnica de criptografia é o conjunto de métodos e algoritmos usados para proteger informações, tornando-as ilegíveis para pessoas não autorizadas. O objetivo da criptografia é garantir a confidencialidade, integridade e, em alguns casos, a autenticidade das informações. Existem duas categorias principais de criptografia: **Criptografia simétrica** e **Criptografia assimétrica**."
            },
            {
              tipo: "topico",
              titulo: "Criptografia simétrica",
              texto: "Chave única: Usa uma única chave para criptografar e descriptografar os dados. Tanto o remetente quanto o destinatário devem conhecer essa chave secreta. Exemplo: o AES (Advanced Encryption Standard)."
            },
            {
              tipo: "topico",
              titulo: "Criptografia assimétrica",
              texto: "Chaves públicas e privadas: Usa um par de chaves — uma chave pública (para criptografar) e uma chave privada (para descriptografar). A chave pública pode ser compartilhada com qualquer pessoa, enquanto a chave privada deve ser mantida em segredo. Exemplo: o RSA (Rivest-Shamir-Adleman)."
            },
            {
              tipo: "texto",
              texto: "A criptografia também pode envolver técnicas como o hashing (geração de resumos fixos de dados) e o uso de assinaturas digitais para garantir que os dados não foram alterados."
            },
            {
              tipo: "topico",
              titulo: "Aplicações Práticas da Criptografia",
              lista: [
                "Segurança de redes: Uso de criptografia para proteger redes Wi-Fi (WPA2, WPA3).",
                "Segurança em comunicações: Uso de SSL/TLS para proteger conexões web.",
                "Proteção de arquivos: Criptografia de discos e dados (BitLocker, VeraCrypt)."
              ]
            }
          ]
        },
        {
          id: "criptografia_simetrica",
          titulo: "Criptografia Simétrica",
          blocos: [
            {
              tipo: "texto",
              texto: "A criptografia é o processo de codificar informações para impedir o acesso não autorizado. Na criptografia simétrica, é usada a mesma chave para criptografar e descriptografar."
            },
            {
              tipo: "topico",
              titulo: "Como funciona",
              lista: [
                "O remetente usa uma chave secreta e um algoritmo para cifrar o texto (texto plano → texto cifrado).",
                "O destinatário usa a mesma chave e o mesmo algoritmo para decifrar o texto (texto cifrado → texto plano).",
                "A segurança depende da proteção da chave: se ela for descoberta, todo o sistema fica vulnerável."
              ]
            },
            {
              tipo: "topico",
              titulo: "Como o Destinatário Recebe a Chave",
              lista: [
                "Pode ser entregue fisicamente (canal seguro) ou via canal criptografado (ex.: VPN).",
                "Em sistemas modernos, a chave simétrica é trocada usando criptografia assimétrica: O emissor cifra a chave com a chave pública do destinatário. O destinatário decifra com sua chave privada."
              ]
            },
            {
              tipo: "texto",
              texto: "Dentro da criptografia simétrica, existem dois grandes tipos de funcionamento quanto à forma como os dados são processados: **Criptografia de Bloco** e **Criptografia de Fluxo**."
            },
            {
              tipo: "subtitulo",
              texto: "Criptografia Simétrica de Fluxo"
            },
            {
              tipo: "texto",
              texto: "A Criptografia de Fluxo (ou `Stream Cipher`, em inglês) é um tipo de criptografia simétrica em que os dados são cifrados bit a bit ou byte a byte, ao invés de blocos inteiros de dados como na criptografia de bloco."
            },
            {
              tipo: "lista",
              itens: [
                "Ela gera uma sequência de chave pseudoaleatória (chamada keystream), que é combinada com os dados originais usando uma operação, geralmente o XOR.",
                "Cada bit ou byte do dado é cifrado individualmente, o que permite que a criptografia seja rápida e eficiente, especialmente em transmissões contínuas de dados, como streaming ou comunicação em tempo real.",
                "Exemplo: RC4, um dos algoritmos de fluxo mais usados historicamente (agora considerado inseguro)."
              ]
            },
            {
              tipo: "subtitulo",
              texto: "Criptografia Simétrica com Divisão em Blocos"
            },
            {
              tipo: "texto",
              texto: "Na criptografia por divisão de blocos (como DES, 3DES e AES), os dados são divididos em partes fixas chamadas \"blocos\". Cada bloco é processado como uma unidade durante a criptografia."
            },
            {
              tipo: "topico",
              titulo: "DES (Data Encryption Standard)",
              lista: [
                "Utiliza blocos de 64 bits e uma chave de 56 bits (apesar de tecnicamente ter 64 bits, 8 são de paridade).",
                "Aplica uma sequência de 16 rodadas de substituição e permutação.",
                "Permutação significa reorganizar a ordem dos bits em um bloco de dados segundo uma tabela predefinida.",
                "Hoje é considerado inseguro devido ao tamanho pequeno da chave (facilmente quebrável por força bruta).",
                "⚠️ Obsoleto, mas importante historicamente."
              ]
            },
            {
              tipo: "texto",
              texto: "O DES é baseado no algoritmo de Feistel, chamado de Rede de Feistel (Feistel Network) e funciona da seguinte forma:"
            },
            {
              tipo: "imagem",
              id: "diagrama_rede_feistel_des",
              src: "diagrama_rede_feistel_des.png",
              pasta: "imagens_redes2/aula_06",
              alt: "Diagrama da Rede de Feistel do DES mostrando o bloco de 64 bits dividido em metades R e L de 32 bits, passando por rodadas sucessivas com aplicação de função e XOR, troca de metades, repetição por mais 13 rodadas, até produzir o texto cifrado C",
              num: 3
            },
            {
              tipo: "tabela",
              titulo: "Etapas do algoritmo de Feistel (DES)",
              colunas: ["Etapa", "Descrição"],
              linhas: [
                ["1ª etapa", "Divide o bloco de 64 bits em L0 e R0 (32 bits cada)"],
                ["2ª etapa", "Aplica a função F sobre R com uma chave k, o resultado é combina com L através do XOR"],
                ["3ª etapa", "Troca as metades (swap)"],
                ["4ª etapa", "Repete 16 vezes com subchaves diferentes"],
                ["5ª etapa", "Junta L e R novamente → texto cifrado"]
              ]
            },
            {
              tipo: "topico",
              titulo: "Triple DES (3DES ou TDEA)",
              lista: [
                "Criado para reforçar a segurança do DES.",
                "Aplica o algoritmo DES três vezes sobre cada bloco de dados, usando 3 chaves: Criptografa com a primeira chave; Descriptografa com a segunda chave; Criptografa com a terceira chave.",
                "Mais seguro que o DES, mas mais lento, pois executa o processo três vezes."
              ]
            },
            {
              tipo: "topico",
              titulo: "Algoritmo AES (Advanced Encryption Standard)",
              lista: [
                "Substituto moderno do DES.",
                "Usa blocos de 128 bits e chaves de 128, 192 ou 256 bits.",
                "Funciona por meio de várias rodadas (10, 12 ou 14) com operações matemáticas e substituições complexas (baseadas em álgebra finita).",
                "É rápido, seguro e amplamente usado (ex: Wi-Fi, VPNs, criptografia de discos)."
              ]
            }
          ]
        },
        {
          id: "criptografia_assimetrica",
          titulo: "Criptografia Assimétrica",
          blocos: [
            {
              tipo: "topico",
              titulo: "Algoritmo RSA (Rivest-Shamir-Adleman)",
              lista: [
                "Baseado na dificuldade de fatorar grandes números primos.",
                "Um par de chaves é gerado a partir de dois números primos grandes.",
                "Pode ser usado para criptografar mensagens e assinaturas digitais.",
                "Funcionamento básico: O emissor criptografa com a chave pública do destinatário. O destinatário descriptografa com sua chave privada.",
                "Muito usado em HTTPS, e-mails, VPNs etc."
              ]
            },
            {
              tipo: "subtitulo",
              texto: "Algoritmo RSA — 1. Princípio básico"
            },
            {
              tipo: "lista",
              itens: [
                "RSA se baseia na dificuldade de fatoração de números grandes em fatores primos.",
                "Cada usuário possui: Chave pública (e, n) → usada para cifrar mensagens, pode ser compartilhada. Chave privada (d, n) → usada para decifrar mensagens, deve ser mantida em sigilo.",
                "A segurança depende de escolher dois números primos grandes, que formam `n = p × q`."
              ]
            },
            {
              tipo: "subtitulo",
              texto: "Algoritmo RSA — 2. Etapas do algoritmo"
            },
            {
              tipo: "topico",
              titulo: "1) Geração de chaves",
              lista: [
                "Escolha dois números primos grandes `p` e `q`.",
                "Calcule `n = p × q` → usado na chave pública e privada.",
                "Calcule a função totiente de Euler: `φ(n) = (p-1)(q-1)`.",
                "Escolha um número `e` tal que `1 < e < φ(n)` e `e` seja coprimo de `φ(n)` → este será o expoente público.",
                "Calcule `d` tal que `(d × e) mod φ(n) = 1` → este será o expoente privado.",
                "Chave pública: `(e, n)`",
                "Chave privada: `(d, n)`"
              ]
            },
            {
              tipo: "topico",
              titulo: "2) Criptografia",
              lista: [
                "Mensagem `M` (representada como número) é cifrada assim: `C = M^e mod n`",
                "`C` é o texto cifrado que pode ser enviado."
              ]
            },
            {
              tipo: "topico",
              titulo: "3) Descriptografia",
              lista: [
                "Para recuperar a mensagem original `M`: `M = C^d mod n`",
                "Apenas a chave privada `d` consegue fazer isso de forma eficiente."
              ]
            }
          ]
        },
        {
          id: "hash_e_assinaturas",
          titulo: "Funções Hash e Assinaturas Digitais",
          blocos: [
            {
              tipo: "texto",
              texto: "Uma função hash é um algoritmo que transforma uma entrada (mensagem, arquivo, senha, etc.) em uma sequência fixa de bits, chamada de resumo (ou hash digest)."
            },
            {
              tipo: "lista",
              titulo: "Principais características",
              itens: [
                "A mesma entrada gera sempre a mesma saída.",
                "Rápida de calcular.",
                "Irreversível: não dá para obter a entrada original a partir do hash.",
                "Pequenas mudanças na entrada causam grandes mudanças no hash.",
                "Única: é extremamente difícil (quase impossível) encontrar duas entradas diferentes com o mesmo hash (isso se chama colisão). Uma colisão acontece quando duas entradas diferentes geram o mesmo hash."
              ]
            },
            {
              tipo: "texto",
              texto: "Exemplo de algoritimos que geram hash: SHA-2 (Secure Hash Algorithm 2) e SHA-3"
            },
            {
              tipo: "subtitulo",
              texto: "Assinaturas Digitais - Criptografia Assimétrica"
            },
            {
              tipo: "texto",
              texto: "As assinaturas digitais são uma aplicação da criptografia assimétrica para garantir a autenticidade, integridade e não-repúdio de uma mensagem ou documento eletrônico."
            },
            {
              tipo: "lista",
              itens: [
                "Autenticidade – você sabe quem assinou.",
                "Integridade – o conteúdo não foi alterado.",
                "Não repúdio – o autor não pode negar que assinou."
              ]
            },
            {
              tipo: "topico",
              titulo: "Como funciona",
              lista: [
                "O remetente aplica uma função hash à mensagem, criando um resumo de tamanho fixo (por exemplo, SHA-256).",
                "Esse hash é único para aquela mensagem; qualquer alteração na mensagem muda o hash.",
                "O remetente criptografa o hash usando sua chave privada. O resultado é a assinatura digital.",
                "O remetente envia a mensagem original e a assinatura digital para o destinatário.",
                "O destinatário aplica a mesma função hash à mensagem recebida, obtendo o hash local.",
                "Em seguida, decifra a assinatura digital usando a chave pública do remetente, obtendo o hash enviado.",
                "Se os dois hashes coincidirem → a mensagem é autêntica e íntegra.",
                "Se não coincidirem → a mensagem foi alterada ou a assinatura é falsa."
              ]
            }
          ]
        },
        {
          id: "metodos_autenticacao",
          titulo: "Métodos de Autenticação",
          blocos: [
            {
              tipo: "lista",
              itens: [
                "Os métodos de autenticação permitem verifica a identidade de um usuário para conceder acesso a sistemas ou serviços.",
                "Os mais comuns são: algo que o usuário sabe (senha, PIN), algo que ele possui (token, celular) e algo que ele é (biometria, como digital ou rosto).",
                "Outros métodos incluem a autenticação multifatorial (MFA), que combina múltiplos fatores, e o Logon Único (SSO), que permite acessar vários aplicativos com um único login."
              ]
            },
            {
              tipo: "topico",
              titulo: "Senha (Password)",
              texto: "Método mais tradicional, baseado em algo que o usuário sabe."
            },
            {
              tipo: "lista",
              itens: [
                "Vantagens: Fácil de implementar e usar.",
                "Desvantagens: Vulnerável a ataques de força bruta, phishing, vazamento de dados.",
                "Boas práticas: Uso de senhas fortes (combinação de letras, números e símbolos). Troca periódica de senhas. Não reutilizar senhas em diferentes sistemas."
              ]
            },
            {
              tipo: "topico",
              titulo: "Token",
              texto: "Baseado em algo que o usuário possui. Pode ser físico ou digital."
            },
            {
              tipo: "lista",
              itens: [
                "Tipos: Hardware token: dispositivo que gera códigos temporários (ex: cartão ou chaveiro).",
                "Tipos: Software token: aplicativo no celular que gera códigos temporários (ex: Google Authenticator, Authy).",
                "Vantagens: Mais seguro que senha simples, difícil de replicar.",
                "Desvantagens: Pode ser perdido, danificado ou roubado."
              ]
            },
            {
              tipo: "topico",
              titulo: "Biometria",
              texto: "Baseado em algo que o usuário é."
            },
            {
              tipo: "lista",
              itens: [
                "Exemplos: Impressão digital, Reconhecimento facial, Reconhecimento de íris, Voz",
                "Vantagens: Difícil de falsificar, não precisa memorizar nada.",
                "Desvantagens: Custo elevado, risco de violação de privacidade, dados biométricos não podem ser alterados se comprometidos"
              ]
            },
            {
              tipo: "topico",
              titulo: "Autenticação Multifator (MFA – Multi-Factor Authentication)",
              texto: "Combina dois ou mais fatores de autenticação para aumentar a segurança."
            },
            {
              tipo: "lista",
              itens: [
                "Fatores típicos: Conhecimento: senha ou PIN; Posse: token, smartphone; Inerência: biometria.",
                "Vantagens: Reduz drasticamente o risco de acesso não autorizado.",
                "Desvantagens: Mais complexo, exige hardware ou software adicional."
              ]
            }
          ]
        },
        {
          id: "firewalls",
          titulo: "Firewalls",
          blocos: [
            {
              tipo: "subtitulo",
              texto: "Principal ferramenta de defesa: Firewalls"
            },
            {
              tipo: "texto",
              texto: "Um firewall é uma ferramenta essencial de segurança que atua como uma barreira entre uma rede confiável (interna) e uma não confiável (externa, como a Internet). Ele controla o tráfego de entrada e saída com base em regras predefinidas, permitindo ou bloqueando pacotes de dados."
            },
            {
              tipo: "lista",
              itens: [
                "O firewall analisa os cabeçalhos dos pacotes (IP, porta de origem/destino, protocolo);",
                "Verifica se o pacote atende às regras configuradas pelo administrador;",
                "Decide se o pacote será permitido, bloqueado ou redirecionado."
              ]
            },
            {
              tipo: "imagem",
              id: "diagrama_fluxo_usuario_firewall_internet",
              src: "diagrama_fluxo_usuario_firewall_internet.png",
              pasta: "imagens_redes2/aula_06",
              alt: "Usuário em um computador conectado a um bloco central identificado como FIREWALL, que se conecta a uma nuvem rotulada INTERNET, com setas duplas indicando tráfego de dados em ambos os sentidos",
              num: 4
            },
            {
              tipo: "lista",
              titulo: "Principais funções de um firewall",
              itens: [
                "Filtragem de Pacotes: Inspeciona cada pacote de dados que tenta entrar ou sair da rede.",
                "Controle de Acesso: Define quais serviços ou portas estão disponíveis.",
                "Proteção contra Ameaças: Bloqueia tentativas de acesso não autorizado e ataques comuns, como varreduras de porta."
              ]
            },
            {
              tipo: "imagem",
              id: "diagrama_classificacao_firewall_software_hardware",
              src: "diagrama_classificacao_firewall_software_hardware.png",
              pasta: "imagens_redes2/aula_06",
              alt: "Diagrama hierárquico com o termo Firewall no topo, ramificando-se em duas caixas abaixo: Softwares e Hardware",
              num: 5
            },
            {
              tipo: "tabela",
              titulo: "Firewalls de software",
              colunas: ["Sistema Operacional", "Exemplo de Firewall", "Descrição breve"],
              linhas: [
                ["Windows", "Windows Defender Firewall", "Integrado ao Windows, controla conexões de entrada e saída com base em regras."],
                ["Linux", "iptables / firewalld / UFW", "Firewalls baseados em filtragem de pacotes e inspeção de estado."],
                ["macOS", "Application Firewall (PF)", "Protege o sistema bloqueando conexões não autorizadas de aplicativos."],
                ["Multiplataforma", "pfSense", "Firewall de software baseado em FreeBSD, muito usado em redes corporativas."]
              ]
            },
            {
              tipo: "tabela",
              titulo: "Firewalls de hardware",
              colunas: ["Fabricante / Modelo", "Tipo / Uso", "Principais Recursos"],
              linhas: [
                ["Cisco ASA (Adaptive Security Appliance)", "Firewall corporativo", "Suporte a VPN, IDS/IPS, controle de acesso e NAT."],
                ["Fortinet FortiGate", "Firewall de próxima geração (NGFW)", "Integra antivírus, filtragem de conteúdo, VPN e inspeção SSL."],
                ["Sophos XG Firewall", "Firewall corporativo", "Proteção contra ameaças avançadas, filtragem web e controle de aplicações."],
                ["Palo Alto Networks", "NGFW / Firewall de alto desempenho", "Detecção de malware, análise de tráfego e políticas baseadas em identidade."],
                ["pfSense", "Appliance / Equipamento baseado em software livre", "Pode ser instalado em hardware dedicado, com suporte a VPN, NAT e IDS."],
                ["WatchGuard Firebox", "Firewall corporativo", "Interface intuitiva, monitoramento de ameaças e proteção de perímetro."]
              ]
            },
            {
              tipo: "tabela",
              titulo: "Firewall de Software x Firewall de Hardware",
              colunas: ["Característica", "Firewall de Software", "Firewall de Hardware"],
              linhas: [
                ["Instalação", "Em cada computador/servidor", "Em um equipamento dedicado"],
                ["Nível de proteção", "Protege o dispositivo individual", "Protege toda a rede"],
                ["Custo", "Geralmente gratuito ou de baixo custo", "Maior custo (equipamento dedicado)"],
                ["Manutenção", "Requer atualização em cada máquina", "Centralizada"],
                ["Desempenho", "Pode afetar o desempenho do sistema", "Alto desempenho, pois tem hardware otimizado"]
              ]
            }
          ]
        },
        {
          id: "vpn",
          titulo: "VPN (Virtual Private Network)",
          blocos: [
            {
              tipo: "texto",
              texto: "Uma VPN (Rede Privada Virtual) é uma tecnologia que cria uma conexão segura e criptografada entre dois pontos de uma rede pública (como a internet), permitindo a transmissão de dados como se os dispositivos estivessem em uma rede privada local (LAN). Em outras palavras, a VPN estabelece um \"túnel seguro\" entre o usuário e a rede de destino, protegendo as informações contra interceptações e acessos não autorizados."
            },
            {
              tipo: "lista",
              titulo: "As VPNs garantem três princípios fundamentais da Segurança da Informação",
              itens: [
                "Confidencialidade: Os dados transmitidos são criptografados, impedindo que terceiros leiam ou acessem o conteúdo das comunicações.",
                "Integridade: As informações não podem ser alteradas ou corrompidas durante o envio; mecanismos de verificação asseguram que o conteúdo recebido é idêntico ao que foi enviado.",
                "Autenticidade: O sistema confirma a identidade das partes envolvidas na comunicação (cliente e servidor), evitando falsificações e ataques de impersonação."
              ]
            },
            {
              tipo: "subtitulo",
              texto: "Estrutura de Túneis e Encapsulamento de Pacotes"
            },
            {
              tipo: "texto",
              texto: "A VPN cria um túnel virtual onde os dados são encapsulados (ou \"envelopados\") dentro de outros pacotes IP antes de serem enviados pela internet. Funciona da seguinte maneira:"
            },
            {
              tipo: "lista",
              itens: [
                "O dado original é preparado para envio (ex.: uma requisição a um servidor).",
                "O protocolo VPN encapsula esse dado em um novo pacote com cabeçalhos adicionais.",
                "O pacote é criptografado e enviado pela internet.",
                "Ao chegar ao destino, o pacote é descriptografado e desencapsulado, restaurando os dados originais."
              ]
            },
            {
              tipo: "destaque",
              texto: "Esse encapsulamento impede que terceiros vejam o conteúdo real das comunicações."
            }
          ]
        },
        {
          id: "protocolos_seguros",
          titulo: "Protocolos Seguros",
          blocos: [
            {
              tipo: "texto",
              texto: "Com o aumento dos ataques cibernéticos e da troca constante de informações pela internet, surgiram protocolos que garantem comunicação segura entre dispositivos e sistemas. Esses protocolos aplicam criptografia, autenticação e verificação de integridade para proteger os dados durante a transmissão. Os três mais utilizados são SSL/TLS, IPSec e SSH. Cada um atua em diferentes camadas do modelo OSI e é projetado para tipos específicos de comunicação."
            },
            {
              tipo: "topico",
              titulo: "SSL/TLS – Segurança em Comunicações Web (HTTPS)",
              texto: "O SSL (Secure Sockets Layer) e seu sucessor, o TLS (Transport Layer Security), são protocolos que garantem segurança nas comunicações entre cliente e servidor, especialmente em sites acessados por navegador. Quando você acessa um site iniciado por `https://`, significa que há uma camada de criptografia TLS protegendo a conexão."
            },
            {
              tipo: "lista",
              titulo: "Como funciona (SSL/TLS)",
              itens: [
                "Atua na camada de transporte (Camada 4 do modelo OSI).",
                "Cria um canal seguro entre o navegador e o servidor.",
                "Utiliza certificados digitais (X.509) para autenticar a identidade do site.",
                "Garante três princípios: Confidencialidade, Autenticidade, Integridade."
              ]
            },
            {
              tipo: "topico",
              titulo: "IPSec – Criptografia e Autenticação no Nível IP",
              texto: "O IPSec (Internet Protocol Security) é um conjunto de protocolos que protege a comunicação no nível da camada de rede (Camada 3). É amplamente usado em VPNs corporativas, pois protege diretamente os pacotes IP transmitidos entre dois hosts, roteadores ou gateways."
            },
            {
              tipo: "lista",
              titulo: "Como funciona (IPSec)",
              itens: [
                "Adiciona camadas de segurança aos pacotes IP, realizando: Autenticação (verifica origem do pacote); Criptografia (protege o conteúdo); Verificação de integridade (detecta alterações no caminho).",
                "Pode operar em dois modos: Modo Transporte: protege apenas o conteúdo do pacote (usado entre hosts). Modo Túnel: encapsula o pacote inteiro (usado em VPNs site-to-site)."
              ]
            },
            {
              tipo: "topico",
              titulo: "SSH – Acesso Remoto Seguro",
              texto: "O SSH (Secure Shell) é um protocolo que permite acesso remoto criptografado a servidores e dispositivos de rede. Substitui métodos antigos como o Telnet, que transmitiam dados em texto simples."
            },
            {
              tipo: "lista",
              titulo: "Como funciona (SSH)",
              itens: [
                "Atua na camada de aplicação (Camada 7).",
                "Cria uma sessão segura entre cliente e servidor usando chaves assimétricas.",
                "Após a autenticação, toda a comunicação é criptografada.",
                "Permite: Acesso remoto a terminais; Transferência segura de arquivos (SCP, SFTP); Execução remota de comandos."
              ]
            }
          ]
        }
      ]
    },



  ],

professor: [
    {
aula: "Revisão para AP1 — Redes de Computadores II",
ideia_central: "Consolidar os principais conceitos de camada física, camada de enlace, controle de fluxo/ARQ, redes locais e sem fio, endereçamento IP, redes metropolitanas com MPLS e redes móveis para a prova AP1.",
secoes: [
{
id: "camada_fisica",
titulo: "Camada Física — Sinais, Impedimentos e Capacidade de Canal",
blocos: [
{ tipo: "subtitulo", texto: "Impedimentos de transmissão" },
{ tipo: "texto", texto: "Durante a transmissão de um sinal, três fenômenos podem comprometer a qualidade da comunicação." },
{
tipo: "lista",
titulo: "Impedimentos de transmissão",
itens: [
"Atenuação: perda de energia (potência) do sinal à medida que ele se propaga pelo meio. O sinal perde parte de sua energia para 'vencer' a resistência do meio de transmissão — por isso, quanto maior a distância entre transmissor e receptor, mais fraco o sinal chega ao destino.",
"Distorção: alteração da forma original do sinal. Em sinais compostos por várias frequências, cada componente pode se propagar com velocidade ou atraso diferente, fazendo com que cheguem ao destino em momentos distintos — isso altera a fase e, consequentemente, o formato do sinal.",
"Ruído: qualquer sinal indesejado que se mistura ao sinal transmitido, podendo alterar ou corromper a informação (ex.: interferência eletromagnética)."
]
},
{ tipo: "destaque", texto: "Não confundir: atenuação = perda de energia; distorção = mudança de forma/fase; ruído = interferência externa somada ao sinal." },
{ tipo: "subtitulo", texto: "Decibel (dB)" },
{ tipo: "texto", texto: "O decibel mede a variação relativa de potência entre dois pontos (não é uma medida absoluta): dB = 10 · log10(P2/P1)." },
{
tipo: "lista",
itens: [
"dB positivo → houve amplificação",
"dB negativo → houve atenuação",
"dB = 0 → a potência permaneceu igual"
]
},
{ tipo: "subtitulo", texto: "Relação Sinal-Ruído (SNR)" },
{ tipo: "texto", texto: "A SNR (Signal-to-Noise Ratio) mede a relação entre a potência do sinal desejado e a potência do ruído presente no canal. Quanto maior a SNR, melhor a qualidade da transmissão. SNR = P_sinal / P_ruído ; SNR_dB = 10 · log10(SNR)." },
{ tipo: "subtitulo", texto: "Limite teórico da taxa de dados: Nyquist x Shannon" },
{ tipo: "texto", texto: "A velocidade máxima de transmissão depende de três fatores: largura de banda do canal, número de níveis do sinal e qualidade do canal (ruído)." },
{
tipo: "tabela",
titulo: "Nyquist x Shannon",
colunas: ["Teorema", "Aplica-se a", "Fórmula", "O que considera"],
linhas: [
["Nyquist", "Canal ideal, sem ruído", "Taxa = 2·B·log₂L", "Largura de banda (B) e número de níveis do sinal (L)"],
["Shannon", "Canal real, com ruído", "Capacidade = B·log₂(1+SNR)", "Largura de banda (B) e relação sinal-ruído (SNR)"]
]
},
{
tipo: "lista",
titulo: "Pontos-chave para a prova",
itens: [
"Aumentar o número de níveis de sinal pode permitir transmitir mais bits por símbolo (mais capacidade) — efeito estudado por Nyquist.",
"Aumentar o ruído sempre reduz a taxa máxima possível de transmissão — nunca aumenta a capacidade, por mais 'informação' que pareça carregar.",
"A taxa de transmissão nunca depende de um único fator isolado (como só o tipo de cabo): ela é resultado da combinação de largura de banda, níveis de sinal e ruído."
]
},
{ tipo: "subtitulo", texto: "Modos de operação em redes sem fio" },
{ tipo: "texto", texto: "Redes sem fio (padrão IEEE 802.11) organizam sua unidade básica de comunicação — o BSS (Basic Service Set) — em dois modos." },
{ tipo: "topico", titulo: "Modo infraestrutura", texto: "Existe um Access Point (AP) centralizando toda a comunicação; os dispositivos se conectam ao AP, e não diretamente entre si." },
{ tipo: "topico", titulo: "Modo ad hoc", texto: "Não existe AP; os dispositivos se comunicam diretamente entre si, formando uma rede temporária e descentralizada." },
{ tipo: "texto", texto: "A imagem compara lado a lado o BSS ad hoc (estações ligadas entre si, sem nenhum ponto central) e o BSS de infraestrutura (todas as estações ligadas a um Access Point central) — o contraste visual ajuda a fixar por que o modo infraestrutura depende de um único ponto de falha (o AP) enquanto o ad hoc não tem essa dependência, mas também não tem coordenação centralizada." },
{
tipo: "imagem",
id: "representacao_visual_bss_ad_hoc_infraestrutura",
src: "representacao_visual_bss_ad_hoc_infraestrutura.png",
pasta: "imagens_redes2/aula_03",
alt: "Comparação lado a lado entre BSS ad hoc (estações interligadas sem ponto central) e BSS de infraestrutura (estações ligadas a um Access Point central)",
num: 2
},
{ tipo: "texto", texto: "A mobilidade dos usuários em redes de infraestrutura exige mecanismos de gerenciamento de conexão quando eles se deslocam entre diferentes pontos de acesso (ver Handover, seção Redes Móveis). Já o meio de transmissão sem fio (o ar) é compartilhado e está sujeito a ruído, atenuação e colisões — por isso redes sem fio não podem contar com detecção de colisão da mesma forma que redes cabeadas (ver CSMA/CA, seção WLAN)." }
]
},
{
id: "camada_enlace",
titulo: "Camada de Enlace — Detecção e Correção de Erros",
blocos: [
{ tipo: "subtitulo", texto: "Funções da camada de enlace" },
{ tipo: "texto", texto: "A camada de enlace tem cinco funções principais." },
{
tipo: "lista",
itens: [
"Framing — organiza os bits recebidos da camada física em quadros (frames).",
"Endereçamento — identifica origem e destino dentro da rede local (endereço MAC).",
"Controle de fluxo — evita que o receptor seja sobrecarregado quando absorve dados mais lentamente do que o emissor produz.",
"Controle de erros — detecta e trata frames corrompidos, duplicados ou perdidos.",
"Controle de acesso ao meio — define qual dispositivo tem o direito de transmitir quando vários compartilham o mesmo link."
]
},
{ tipo: "subtitulo", texto: "Tipos de erro" },
{
tipo: "lista",
itens: [
"Erro de bit: um único bit é alterado (0 → 1 ou 1 → 0).",
"Erro em rajada (burst error): dois ou mais bits consecutivos são corrompidos — é o tipo de erro mais frequente em redes de computadores reais, geralmente causado por ruído de curta duração."
]
},
{ tipo: "subtitulo", texto: "Detecção x Correção de erros" },
{ tipo: "texto", texto: "Para lidar com erros, o transmissor adiciona bits redundantes à mensagem original. Existem duas abordagens." },
{ tipo: "topico", titulo: "Detecção de erros", texto: "Permite identificar que ocorreu um erro (mas não corrigi-lo sozinho) — ex.: paridade, checksum, CRC." },
{
tipo: "topico",
titulo: "Correção de erros",
texto: "Permite recuperar a informação corrompida. Pode ocorrer de duas formas:",
lista: [
"FEC (Forward Error Correction) — correção sem retransmissão; o próprio receptor corrige o erro (ex.: Código de Hamming).",
"ARQ (Automatic Repeat reQuest) — correção com retransmissão; o receptor detecta o erro e solicita reenvio."
]
},
{ tipo: "subtitulo", texto: "Bit de paridade" },
{ tipo: "texto", texto: "Técnica mais simples: adiciona 1 bit extra para tornar a quantidade total de bits '1' par (paridade par) ou ímpar (paridade ímpar)." },
{
tipo: "exemplo",
titulo: "Bit de paridade",
texto: "Mensagem 1011001 → quantidade de 1's = 4 (já é par) → bit de paridade = 0 → mensagem transmitida: 10110010.",
detalhe: "Limitação: detecta apenas erros de 1 bit (ou uma quantidade ímpar de bits alterados); falha se exatamente 2 bits errarem ao mesmo tempo, pois a paridade se mantém."
},
{ tipo: "subtitulo", texto: "Checksum" },
{ tipo: "texto", texto: "Divide a mensagem em blocos de bits e soma esses blocos usando aritmética de complemento de 1 (bits invertidos: 0→1, 1→0). O resultado, após o processo de complemento, é enviado junto com a mensagem. No receptor, a soma é refeita para verificar se o resultado corresponde ao esperado — se não corresponder, há erro." },
{
tipo: "lista",
itens: [
"É usado tipicamente em camadas mais altas (ex.: cabeçalhos IP, TCP, UDP).",
"Mais simples e com menor custo computacional que o CRC, mas também menos robusto para detectar certos padrões de erro."
]
},
{ tipo: "subtitulo", texto: "CRC — Cyclic Redundancy Check" },
{ tipo: "texto", texto: "O CRC funciona como uma 'assinatura matemática' da mensagem. Baseia-se em polinômios e utiliza um polinômio gerador G(x), conhecido tanto pelo emissor quanto pelo receptor." },
{
tipo: "topico",
titulo: "No emissor",
lista: [
"Obtém a mensagem original em bits.",
"Adiciona zeros à direita (quantidade de zeros = grau do polinômio gerador).",
"Divide essa sequência pelo polinômio gerador usando divisão binária / operação XOR (divisão módulo 2, em vez das operações tradicionais de adição/subtração).",
"O resto da divisão é o CRC.",
"O CRC é anexado à mensagem original."
]
},
{ tipo: "destaque", texto: "Quadro transmitido = mensagem original + CRC." },
{
tipo: "topico",
titulo: "No receptor",
lista: [
"Recebe mensagem + CRC.",
"Divide novamente pelo mesmo polinômio gerador.",
"O resto dessa divisão é chamado de síndrome: síndrome = 0 → considera-se que não houve erro (palavra aceita); síndrome ≠ 0 → erro detectado (dados descartados)."
]
},
{ tipo: "texto", texto: "O CRC é usado, por exemplo, no quadro Ethernet, no campo CRC/FCS (4 bytes), ao final do quadro, dedicado à verificação de erros." },
{ tipo: "texto", texto: "O material traz dois diagramas complementares — um do codificador e outro do decodificador CRC. O primeiro mostra a divisão binária módulo 2 no emissor: a mensagem com zeros à direita sendo dividida pelo polinômio gerador via operações XOR sucessivas até sobrar o resto (o CRC). O segundo mostra o processo espelhado no receptor, destacando que o resultado da nova divisão é chamado de síndrome — o elemento central para decidir se a palavra é aceita (síndrome = 0) ou descartada (síndrome ≠ 0). Vale desenhar esse processo manualmente com um exemplo pequeno (mensagem de poucos bits) para fixar a mecânica do XOR." },
{
tipo: "imagem",
id: "crc_codificador",
src: "crc_codificador.png",
pasta: "imagens_redes2/aula_02",
alt: "Diagrama do codificador CRC: divisão binária módulo 2 da mensagem com zeros à direita pelo polinômio gerador, via XOR, até obter o resto (CRC)",
num: 7
},
{
tipo: "imagem",
id: "crc_decodificador",
src: "crc_decodificador.png",
pasta: "imagens_redes2/aula_02",
alt: "Diagrama do decodificador CRC: nova divisão da mensagem recebida pelo polinômio gerador, gerando a síndrome que decide aceitação ou descarte",
num: 8
},
{ tipo: "subtitulo", texto: "Distância de Hamming e Código de Hamming" },
{ tipo: "texto", texto: "Distância de Hamming: número de posições de bits diferentes entre duas palavras binárias de mesmo tamanho. Serve para medir a diferença entre palavras de código e indicar quantos erros seriam necessários para transformar uma palavra em outra." },
{
tipo: "exemplo",
titulo: "Distância de Hamming",
texto: "Palavra A = 1011001; Palavra B = 1010001 → apenas 1 posição diferente.",
detalhe: "Distância de Hamming = 1."
},
{ tipo: "texto", texto: "Código de Hamming (criado por Richard Hamming em 1950): utiliza bits de paridade posicionados estrategicamente para aumentar a distância entre palavras válidas, permitindo não só detectar, mas corrigir erros — é um exemplo clássico de FEC." },
{
tipo: "lista",
itens: [
"O código de Hamming clássico tem distância mínima 3, o que permite corrigir 1 erro de bit e detectar até 2 erros de bits.",
"Os bits de paridade ocupam posições que são potências de 2: posição 1, 2, 4, 8, 16... As demais posições carregam os bits de dados.",
"P1 (posição 1) → cobre as posições 1, 3, 5, 7, 9...",
"P2 (posição 2) → cobre as posições 2, 3, 6, 7, 10, 11...",
"P4 (posição 4) → cobre as posições 4, 5, 6, 7, 12, 13, 14, 15...",
"Relação entre os bits: n = 2^m − 1 e k = n − m, onde k = número de bits de dados, m (= r) = número de bits de verificação/redundância, n = número total de bits."
]
},
{ tipo: "texto", texto: "Há duas imagens complementares sobre o código de Hamming. A primeira mostra, posição por posição, qual bit de paridade cobre qual conjunto de posições (P1, P2, P4...) — essencial para entender por que essas posições específicas (potências de 2) conseguem, juntas, 'apontar' a posição exata de um bit errado (cada combinação de paridades erradas forma, em binário, o índice do bit corrompido). A segunda imagem mostra um exemplo numérico completo: a distribuição de bits de dados e de paridade lado a lado, com o cálculo de cada paridade até formar a palavra final transmitida — é o tipo de exemplo que vale refazer à mão para garantir que o cálculo das paridades ficou claro antes da prova." },
{
tipo: "imagem",
id: "cobertura_bits_paridade_hamming",
src: "cobertura_bits_paridade_hamming.png",
pasta: "imagens_redes2/aula_02",
alt: "Diagrama posição a posição mostrando quais posições cada bit de paridade (P1, P2, P4...) cobre em uma palavra de código de Hamming",
num: 9
},
{
tipo: "imagem",
id: "exemplo_codigo_hamming",
src: "exemplo_codigo_hamming.png",
pasta: "imagens_redes2/aula_02",
alt: "Exemplo numérico completo do código de Hamming, com a distribuição de bits de dados e paridade e o cálculo de cada paridade até a palavra final",
num: 10
},
{ tipo: "subtitulo", texto: "Comparação entre as técnicas" },
{
tipo: "tabela",
colunas: ["Técnica", "O que faz", "Detecta ou corrige?", "Base do cálculo"],
linhas: [
["Paridade", "Adiciona 1 bit", "Detecta (1 bit)", "Contagem de 1's"],
["Checksum", "Soma blocos de dados", "Detecta", "Aritmética de complemento de 1"],
["CRC", "Divisão polinomial", "Detecta", "Divisão binária / XOR"],
["Hamming", "Bits de paridade posicionados", "Corrige (FEC)", "Posições em potências de 2"],
["ARQ", "Retransmissão", "Corrige (via reenvio)", "Depende de CRC/checksum + timeout"]
]
},
{ tipo: "destaque", texto: "Diferença essencial CRC x Checksum: o Checksum usa operações aritméticas (soma/complemento) sobre os dados; o CRC usa divisão polinomial binária (XOR). Nenhum dos dois corrige sozinho — ambos apenas detectam, cabendo a mecanismos de retransmissão (ARQ) ou correção (FEC/Hamming) tratar o erro identificado." }
]
},
{
id: "controle_fluxo_arq",
titulo: "Controle de Fluxo e Protocolos ARQ",
blocos: [
{ tipo: "subtitulo", texto: "Conceitos-base" },
{
tipo: "lista",
itens: [
"Controle de fluxo: conjunto de procedimentos para controlar quanto o emissor pode enviar antes de receber confirmação, evitando sobrecarregar o receptor.",
"ACK (Acknowledgment): confirmação de recebimento correto.",
"NACK (Negative Acknowledgment): confirmação negativa (indica erro).",
"Timeout: tempo limite de espera por uma resposta; se expirar sem ACK, o emissor retransmite.",
"Piggybacking: técnica em que informações de controle (ACKs/NAKs) 'pegam carona' nos próprios frames de dados, em vez de serem enviadas em mensagens separadas."
]
},
{ tipo: "subtitulo", texto: "Protocolos para canais sem ruído" },
{ tipo: "texto", texto: "Consideram que os bits chegam ao destino sem erros — por isso não implementam controle de erros, apenas controle de fluxo quando necessário." },
{ tipo: "topico", titulo: "Protocolo mais simples possível", texto: "Unidirecional, sem controle de fluxo nem de erros; o emissor envia continuamente e o receptor processa imediatamente." },
{ tipo: "topico", titulo: "Stop-and-Wait", texto: "Adiciona controle de fluxo. Funcionamento: (1) emissor envia um frame; (2) espera o ACK; (3) só então envia o próximo. Isso impede que o receptor fique sobrecarregado — mas pressupõe um canal ideal, sem erros, o que é impraticável em redes reais." },
{ tipo: "texto", texto: "O diagrama mostra a sequência de envio de frames e confirmações lado a lado — dá para visualizar claramente o 'tempo morto' do canal entre o envio de um frame e a chegada do ACK, que é justamente a raiz da ineficiência desse protocolo." },
{
tipo: "imagem",
id: "stop_and_wait_sem_ruido",
src: "stop_and_wait_sem_ruido.png",
pasta: "imagens_redes2/aula_02",
alt: "Diagrama de sequência do protocolo Stop-and-Wait sem controle de erros, mostrando o tempo ocioso do canal entre envio do frame e chegada do ACK",
num: 11
},
{ tipo: "subtitulo", texto: "Protocolos ARQ para canais com ruído" },
{ tipo: "texto", texto: "Quando há possibilidade de corrupção dos dados, são necessários controle de erros e controle de fluxo, normalmente via mecanismos ARQ." },
{
tipo: "topico",
titulo: "Stop-and-Wait ARQ",
lista: [
"Versão do Stop-and-Wait preparada para lidar com erros.",
"Cada frame recebe um número de sequência, permitindo identificar frames perdidos ou duplicados.",
"O emissor mantém uma cópia do frame, espera o ACK, usa um timer; se o timer expira sem ACK, retransmite.",
"O próprio ACK pode ser perdido/corrompido, por isso também carrega redundância e número de sequência.",
"Desvantagem: ineficiente, pois apenas um frame aguarda confirmação por vez — o canal fica ocioso boa parte do tempo."
]
},
{ tipo: "texto", texto: "O diagrama detalha o ciclo completo — envio do frame, espera pela confirmação e, quando necessário, a retransmissão após o timeout. A diferença visual principal em relação ao Stop-and-Wait 'sem ruído' é a seta extra de retransmissão quando o ACK não chega a tempo." },
{
tipo: "imagem",
id: "stop_and_wait_arq",
src: "stop_and_wait_arq.png",
pasta: "imagens_redes2/aula_02",
alt: "Diagrama do ciclo completo do Stop-and-Wait ARQ, incluindo a retransmissão do frame após expiração do timeout",
num: 12
},
{
tipo: "topico",
titulo: "Go-Back-N ARQ",
lista: [
"Utiliza janela deslizante: o transmissor pode enviar até N frames sem esperar ACK, mantendo-os em buffer.",
"Usa ACKs acumulativos: o receptor informa qual é o próximo frame esperado (ex.: se recebeu corretamente até o frame 4, envia ACK = 5).",
"Se ocorre erro no frame i: o receptor descarta esse frame e todos os seguintes, mesmo que alguns tenham chegado corretos. O transmissor então retransmite a partir do frame com erro.",
"Ideia-chave: ocorreu erro → volta e retransmite a partir daquele frame."
]
},
{ tipo: "texto", texto: "O diagrama representa a janela de transmissão se deslocando e mostra o que acontece quando um frame dentro dela chega com erro — visualmente, todos os frames à direita do erro (mesmo os corretos) ficam 'descartados' e precisam ser reenviados. É a melhor forma de fixar por que esse protocolo é menos eficiente que o Selective Repeat." },
{
tipo: "imagem",
id: "go_back_n_arq",
src: "go_back_n_arq.png",
pasta: "imagens_redes2/aula_02",
alt: "Diagrama da janela deslizante do Go-Back-N ARQ, mostrando o descarte de todos os frames após um erro, mesmo os corretos",
num: 13
},
{
tipo: "topico",
titulo: "Selective Repeat ARQ",
lista: [
"Também usa janela deslizante, mas é mais eficiente que o Go-Back-N.",
"Diferença central: somente os frames perdidos ou corrompidos são retransmitidos — os frames corretos não são descartados.",
"O receptor possui uma janela de recebimento, pode receber frames fora de ordem, armazena temporariamente os corretos enquanto aguarda o frame faltante, e envia ACK individual para cada frame recebido corretamente.",
"Ideia-chave: ocorreu erro → retransmite somente o frame problemático."
]
},
{ tipo: "texto", texto: "O diagrama mostra frames sendo tratados individualmente — dá para ver que, mesmo com um frame perdido ou corrompido no meio da sequência, os frames seguintes continuam sendo aceitos e armazenados pelo receptor (janela de recebimento), em vez de descartados como no Go-Back-N." },
{
tipo: "imagem",
id: "selective_repeat_arq",
src: "selective_repeat_arq.png",
pasta: "imagens_redes2/aula_02",
alt: "Diagrama do Selective Repeat ARQ mostrando o tratamento individual de cada frame e o armazenamento dos frames corretos na janela de recebimento",
num: 14
},
{ tipo: "subtitulo", texto: "Tabela comparativa" },
{
tipo: "tabela",
colunas: ["Protocolo", "Frames em voo", "Comportamento após erro"],
linhas: [
["Protocolo mais simples", "Contínuo, sem controle", "Sem tratamento de erro"],
["Stop-and-Wait", "1 por vez", "Sem tratamento de erro (canal ideal)"],
["Stop-and-Wait ARQ", "1 por vez", "Retransmite o próprio frame após timeout"],
["Go-Back-N ARQ", "Vários (janela)", "Retransmite o frame com erro e todos os posteriores"],
["Selective Repeat ARQ", "Vários (janela)", "Retransmite somente o(s) frame(s) com problema"]
]
}
]
},
{
id: "redes_locais_lan",
titulo: "Redes Locais (LAN) — Dispositivos e Ethernet",
blocos: [
{ tipo: "subtitulo", texto: "Dispositivos de interconexão" },
{
tipo: "lista",
itens: [
"Hub: dispositivo de camada física que opera como repetidor — recebe o sinal elétrico em uma porta e o retransmite (repete) para todas as demais portas, sem qualquer inteligência sobre endereços. Isso cria um único domínio de colisão compartilhado por todas as portas.",
"Switch: conecta dispositivos dentro da LAN e encaminha quadros com base no endereço MAC (camada de enlace) — filtra e envia diretamente para a porta do destinatário, isolando domínios de colisão por porta.",
"Roteador: interliga a LAN com outras redes (como a Internet), encaminhando com base no endereço IP (camada de rede).",
"Access Point (AP): expande a rede de forma sem fio."
]
},
{ tipo: "destaque", texto: "Atenção: não confundir os três níveis — Hub = camada física (repete sinal elétrico); Switch = camada de enlace (encaminha por MAC); Roteador = camada de rede (encaminha por IP)." },
{ tipo: "subtitulo", texto: "Ethernet e CSMA/CD" },
{ tipo: "texto", texto: "A Ethernet padrão (tecnologia mais comum de LAN, padronizada pelo IEEE 802) utiliza o CSMA/CD — Carrier Sense Multiple Access with Collision Detection, com estratégia 1-persistent. Esse método corresponde à primeira geração de Ethernet (10 Mbps) e permite que a estação detecte a colisão enquanto transmite pelo cabo — algo possível porque, em um meio cabeado, é viável monitorar o próprio sinal durante a transmissão." },
{ tipo: "texto", texto: "Formato geral do quadro Ethernet: Preâmbulo, SFD, endereço de destino, endereço de origem, comprimento/tipo, dados e preenchimento, e CRC/FCS (4 bytes, para verificação de erros)." },
{ tipo: "texto", texto: "Nas velocidades mais altas de Ethernet moderna, o CSMA/CD deixou de ser necessário, já que a comunicação passou a ser predominantemente full-duplex (sem disputa pelo mesmo meio compartilhado)." }
]
},
{
id: "redes_locais_sem_fio",
titulo: "Redes Locais Sem Fio (WLAN) — IEEE 802.11",
blocos: [
{ tipo: "subtitulo", texto: "DCF e CSMA/CA" },
{ tipo: "texto", texto: "A DCF (Distributed Coordination Function) é obrigatória em qualquer rede IEEE 802.11 e utiliza o CSMA/CA — Carrier Sense Multiple Access with Collision Avoidance." },
{
tipo: "lista",
titulo: "Funcionamento",
itens: [
"A estação escuta o canal.",
"Se o canal estiver ocupado, espera um tempo aleatório (backoff).",
"Se estiver livre, transmite."
]
},
{ tipo: "texto", texto: "O objetivo é evitar colisões, pois em Wi-Fi não é possível detectar uma colisão enquanto se transmite — diferentemente da Ethernet cabeada (CSMA/CD). Por isso o Wi-Fi trabalha na lógica de 'evitar' (CA), e não de 'detectar' (CD)." },
{ tipo: "subtitulo", texto: "Problema da estação oculta (hidden terminal)" },
{ tipo: "texto", texto: "Ocorre quando duas estações não conseguem se enxergar diretamente, mas ambas conseguem transmitir para a mesma estação (ex.: o mesmo AP)." },
{
tipo: "exemplo",
titulo: "Estação oculta",
texto: "B transmite para A; C também deseja transmitir para A; C não percebe que B já está transmitindo (fora do alcance de B); A recebe simultaneamente os sinais de B e C → colisão.",
detalhe: "Consequência: redução da capacidade da rede devido ao aumento de colisões."
},
{ tipo: "texto", texto: "O diagrama desenha os círculos de alcance de B e C, com A posicionada exatamente na região de sobreposição entre os dois círculos — visualmente fica claro que B e C não se enxergam (seus círculos não se sobrepõem entre si), mas ambos alcançam A. É esse desenho de círculos de alcance que explica de forma mais intuitiva por que o termo é 'estação oculta': B está oculta para C, e vice-versa." },
{
tipo: "imagem",
id: "representacao_visual_estacao_oculta",
src: "representacao_visual_estacao_oculta.png",
pasta: "imagens_redes2/aula_03",
alt: "Diagrama com os círculos de alcance de B e C sobrepostos apenas na região onde está A, ilustrando o problema da estação oculta",
num: 6
},
{ tipo: "subtitulo", texto: "Solução RTS/CTS" },
{ tipo: "texto", texto: "Handshake baseado em CSMA/CA usado para mitigar o problema da estação oculta." },
{
tipo: "lista",
itens: [
"B envia RTS (Request to Send) para A.",
"A responde com CTS (Clear to Send), que informa a duração da transmissão.",
"C recebe o CTS e entende que o canal está ocupado, aguardando (evitando a colisão)."
]
},
{ tipo: "texto", texto: "O NAV (Network Allocation Vector) é o temporizador lógico usado para indicar por quanto tempo o canal de rádio ficará reservado/ocupado — mecanismo associado ao RTS/CTS." },
{ tipo: "texto", texto: "A imagem mostra o formato do frame 802.11, com os campos FC (Frame Control), Duration, quatro campos de endereço, Sequence Control, Frame Body e FCS. O campo Duration é justamente o que carrega o valor usado para atualizar o NAV das estações vizinhas — a ligação entre esse campo do quadro e o mecanismo de reserva de canal explicado acima é um bom ponto de atenção para questões que cruzem 'estrutura do frame' com 'controle de acesso ao meio'." },
{
tipo: "imagem",
id: "figura_14_7_formato_frame_wifi",
src: "figura_14_7_formato_frame_wifi.png",
pasta: "imagens_redes2/aula_03",
alt: "Formato do frame 802.11 com os campos FC, Duration, quatro campos de endereço, Sequence Control, Frame Body e FCS",
num: 5
},
{ tipo: "subtitulo", texto: "Problema da estação exposta (exposed terminal)" },
{ tipo: "texto", texto: "Ocorre quando uma estação deixa de transmitir por perceber o canal ocupado, mesmo que sua transmissão não causasse interferência real no destinatário pretendido." },
{
tipo: "exemplo",
titulo: "Estação exposta",
texto: "A transmite para B; C deseja transmitir para D; C escuta A e decide não transmitir — mas C poderia transmitir para D sem interferir em A→B.",
detalhe: "Consequência: uso ineficiente do canal e redução da taxa de transmissão."
},
{ tipo: "texto", texto: "O diagrama posiciona A, B, C e D em sequência (A—B—C—D), com os círculos de alcance de cada um sobrepostos apenas com os vizinhos imediatos. Isso deixa visualmente evidente que C está dentro do alcance de A (por isso 'escuta' a transmissão A→B) mas D está fora do alcance de A — logo, uma transmissão C→D não afetaria A→B, embora C se abstenha por precaução." },
{
tipo: "imagem",
id: "representacao_visual_estacao_exposta",
src: "representacao_visual_estacao_exposta.png",
pasta: "imagens_redes2/aula_03",
alt: "Diagrama com A, B, C e D em sequência e seus círculos de alcance sobrepostos apenas com os vizinhos imediatos, ilustrando o problema da estação exposta",
num: 7
},
{ tipo: "destaque", texto: "Importante: o RTS/CTS não resolve completamente o problema da estação exposta. Situação típica: A envia RTS para B; B responde com CTS; C ouve o RTS de A, mas não ouve o CTS de B (está fora de alcance); C então envia RTS para D; como A está transmitindo, não escuta o RTS de C; D responde com CTS — mas o canal já está ocupado, gerando conflito." },
{ tipo: "texto", texto: "O diagrama mostra uma linha do tempo com os quatro dispositivos (B, A, C, D) e as trocas de RTS/CTS/dados de cada um, com o ponto exato de colisão marcado. É um bom material para treinar a leitura de diagramas de sequência temporal, formato comum em provas sobre protocolos de acesso ao meio." },
{
tipo: "imagem",
id: "representacao_visual_rts_cts_estacao_exposta",
src: "representacao_visual_rts_cts_estacao_exposta.png",
pasta: "imagens_redes2/aula_03",
alt: "Linha do tempo com B, A, C e D trocando RTS/CTS/dados, marcando o ponto de colisão mesmo com o uso de RTS/CTS",
num: 8
},
{ tipo: "subtitulo", texto: "CSMA/CD x CSMA/CA" },
{
tipo: "tabela",
colunas: ["Característica", "CSMA/CD", "CSMA/CA"],
linhas: [
["Tipo de rede", "Cabeada (Ethernet)", "Sem fio (Wi-Fi)"],
["Tratamento de colisão", "Detecta depois que ocorre", "Procura evitar antes de ocorrer"],
["Padrão IEEE associado", "802.3", "802.11"],
["Meio", "Cabo", "Rádio (ar)"],
["Mecanismo típico", "Monitoramento do sinal durante a transmissão", "Backoff aleatório + (opcional) RTS/CTS"]
]
},
{ tipo: "destaque", texto: "Mnemônico: 802.3 → Ethernet → CSMA/CD → cabo → colisão detectada. 802.11 → Wi-Fi → CSMA/CA → rádio → colisão evitada." },
{ tipo: "subtitulo", texto: "Classificação de redes sem fio por alcance" },
{
tipo: "tabela",
colunas: ["Categoria", "Nome", "Alcance", "Exemplos/padrões"],
linhas: [
["WPAN", "Wireless Personal Area Network", "Curtíssimo (cm a poucos metros)", "Bluetooth, NFC, IrDA, UWB, ZigBee, Z-Wave"],
["WLAN", "Wireless Local Area Network", "Local (dezenas de metros)", "Wi-Fi — IEEE 802.11"],
["WMAN", "Wireless Metropolitan Area Network", "Metropolitano (km)", "WiMAX — IEEE 802.16"]
]
},
{ tipo: "texto", texto: "A WLAN pode operar em modo ad hoc, mas normalmente utiliza pontos de acesso (modo infraestrutura) — ver seção Camada Física." }
]
},
{
id: "enderecamento_ip",
titulo: "Endereçamento IP e Sub-redes",
blocos: [
{ tipo: "subtitulo", texto: "IPv4" },
{
tipo: "lista",
itens: [
"Endereço de 32 bits, representado em 4 octetos decimais separados por pontos (ex.: 192.168.10.1).",
"Possui uma parte de rede (identifica a rede) e uma parte de host (identifica o dispositivo dentro daquela rede).",
"Espaço de endereçamento: cerca de 4,3 bilhões de endereços — hoje já esgotado, o que motivou a criação do IPv6."
]
},
{ tipo: "subtitulo", texto: "IPv6" },
{
tipo: "lista",
itens: [
"Endereço de 128 bits, representado em hexadecimal, separado por dois-pontos (ex.: 2001:0db8:85a3:0000:0000:8a2e:0370:7334).",
"Criado para resolver a escassez de endereços do IPv4, oferecendo um espaço de endereçamento muito maior.",
"Características adicionais: autoconfiguração e melhor suporte à segurança nativa (IPSec)."
]
},
{ tipo: "subtitulo", texto: "Comparação IPv4 x IPv6" },
{
tipo: "tabela",
colunas: ["Característica", "IPv4", "IPv6"],
linhas: [
["Tamanho", "32 bits", "128 bits"],
["Representação", "Decimal", "Hexadecimal"],
["Separador", "Pontos", "Dois-pontos"],
["Principal motivação", "—", "Esgotamento do espaço IPv4"]
]
},
{ tipo: "subtitulo", texto: "Máscara de sub-rede e CIDR" },
{ tipo: "texto", texto: "A máscara de sub-rede (ou prefixo de rede, notação /n) determina quais bits do endereço pertencem à rede e quais pertencem ao host. Uma sub-rede (subnet) é a divisão de uma rede maior em redes menores." },
{ tipo: "texto", texto: "Para criar sub-redes, 'toma-se emprestado' um número de bits (m) que originalmente pertenciam à parte de host: Quantidade de sub-redes = 2^m. Hosts válidos por sub-rede = 2^(bits restantes de host) − 2 (subtraem-se 2 endereços: o endereço de rede e o endereço de broadcast, que não podem ser atribuídos a hosts)." },
{ tipo: "subtitulo", texto: "Exemplo completo de divisão em sub-redes" },
{
tipo: "exemplo",
titulo: "Divisão de 192.168.0.0/24 em 4 sub-redes",
texto: "Cenário: uma empresa possui a rede 192.168.0.0/24 (24 bits de rede, 8 bits de host) e precisa dividi-la em 4 sub-redes de mesmo tamanho, uma para cada setor (ex.: Financeiro, Comercial, RH, Jurídico).",
detalhe: "1. Para obter 4 sub-redes: 2² = 4 → são necessários 2 bits emprestados da parte de host. 2. Nova máscara: /24 + 2 = /26 → 255.255.255.192. 3. Bits restantes para host: 8 − 2 = 6 bits. 4. Endereços totais por sub-rede: 2⁶ = 64. 5. Hosts válidos por sub-rede: 2⁶ − 2 = 62."
},
{ tipo: "destaque", texto: "Regra geral para qualquer questão de subnetting: identifique quantos bits (m) satisfazem 2^m ≥ número de sub-redes desejado; some m à máscara original para obter a nova máscara; hosts válidos = 2^(bits de host restantes) − 2." },
{ tipo: "texto", texto: "A imagem apresenta as quatro sub-redes resultantes em uma tabela/diagrama, com o endereço de rede, o endereço de broadcast e a faixa de IPs válidos de cada uma lado a lado. Isso deixa claro, na prática, que cada bloco de 64 endereços 'pula' de 64 em 64 (ex.: 192.168.0.0, 192.168.0.64, 192.168.0.128, 192.168.0.192) — um padrão útil para resolver rapidamente questões de subnetting sem precisar recalcular tudo em binário." },
{
tipo: "imagem",
id: "distribuicao_192_168_0_0_24_quatro_subredes_26",
src: "distribuicao_192_168_0_0_24_quatro_subredes_26.png",
pasta: "imagens_redes2/aula_03",
alt: "Tabela/diagrama com as quatro sub-redes resultantes de 192.168.0.0/24 dividida em /26, mostrando endereço de rede, broadcast e faixa de IPs válidos de cada uma",
num: 16
}
]
},
{
id: "redes_man_mpls",
titulo: "Redes Metropolitanas (MAN) e MPLS",
blocos: [
{ tipo: "subtitulo", texto: "Metro Ethernet" },
{ tipo: "texto", texto: "Muitas operadoras oferecem serviço Ethernet ao cliente para interligar filiais dentro de uma cidade. Do ponto de vista do cliente, é simples — como 'plugar um cabo em um switch' — mas internamente a operadora precisa transportar o tráfego de milhares de clientes por uma mesma infraestrutura, mantendo isolamento lógico entre eles. É aí que entra o MPLS." },
{ tipo: "subtitulo", texto: "MPLS — Multiprotocol Label Switching" },
{ tipo: "texto", texto: "O MPLS é uma técnica de transporte de dados que opera entre a Camada 2 (Enlace) e a Camada 3 (Rede) do modelo OSI — por isso é frequentemente chamado de 'camada 2,5'." },
{
tipo: "topico",
titulo: "Como funciona",
lista: [
"Adiciona um rótulo (label) curto ao pacote assim que ele entra na rede metropolitana.",
"Os roteadores intermediários (Label Switch Routers — LSR) comutam o pacote baseando-se apenas nesse rótulo, sem precisar analisar o endereço IP a cada salto.",
"O rótulo é trocado a cada salto — processo chamado Label Swapping.",
"Ao chegar ao último roteador da rede MPLS, o rótulo é removido e o quadro é entregue normalmente ao destino — todo o processo é transparente para o cliente."
]
},
{
tipo: "topico",
titulo: "Etapas do funcionamento",
lista: [
"Envio dos dados (quadro Ethernet do cliente).",
"Entrada na rede da operadora.",
"Adição do Label pelo primeiro roteador MPLS (define o caminho, ou LSP — Label Switched Path).",
"Encaminhamento pela rede MPLS via Label Swapping.",
"Entrega ao destino, com remoção do Label."
]
},
{ tipo: "texto", texto: "O diagrama mostra um Label-Switched Path (LSP) completo, ligando a rede 192.168.0.0/24 até a rede 10.0.0.0/24 através de cinco roteadores: R1 e R5 nas pontas (Edge LSR, que adicionam/removem o rótulo) e R2, R3, R4 no meio do caminho (Intermediate LSR, que só trocam o rótulo). Cada roteador é mostrado com suas tabelas FIB e LFIB, indicando o rótulo de entrada, o rótulo de saída e a próxima rota — é a melhor forma de visualizar o que significa 'Label Swapping' na prática: o rótulo muda a cada salto, mas o pacote nunca precisa ser reanalisado pelo IP de destino no meio do caminho." },
{
tipo: "imagem",
id: "figura_mpls_label_switched_path_lsp",
src: "mpls_label_switched_path_lsp.png",
pasta: "imagens_redes2/aula_04",
alt: "Diagrama de um Label-Switched Path ligando 192.168.0.0/24 a 10.0.0.0/24 através de R1 a R5, com as tabelas FIB e LFIB de cada roteador",
num: 1
},
{
tipo: "topico",
titulo: "Vantagens do MPLS",
lista: [
"Maior eficiência: encaminhamento mais rápido, pois analisa apenas rótulos.",
"Engenharia de tráfego: permite escolher caminhos mais adequados conforme utilização da rede, largura de banda e congestionamento.",
"QoS (Qualidade de Serviço): prioriza aplicações sensíveis a latência, como VoIP, videoconferência e streaming.",
"Escalabilidade: a mesma infraestrutura atende milhares de clientes sem comprometer o desempenho.",
"VPNs MPLS: permite isolamento lógico entre diferentes empresas usando a mesma infraestrutura física."
]
},
{ tipo: "subtitulo", texto: "WMAN e WiMAX" },
{ tipo: "texto", texto: "A WMAN (Wireless Metropolitan Area Network) é a versão sem fio de uma MAN: conecta LANs distribuídas por uma cidade usando ondas de rádio em vez de fibra óptica. Surge como alternativa quando não é viável instalar fibra (alto custo, obstáculos geográficos, áreas rurais, necessidade de implantação rápida)." },
{
tipo: "topico",
titulo: "Componentes de uma WMAN",
lista: [
"Estações-base: transmitem e recebem o sinal de rádio, cobrindo uma área da cidade.",
"Antenas: realizam a transmissão/recepção das ondas (instaladas em torres, prédios, postes, morros).",
"CPE (Customer Premises Equipment): equipamento no cliente, recebe o sinal da estação base e conecta à rede local.",
"Backbone: as estações-base normalmente se conectam ao backbone da operadora."
]
},
{ tipo: "texto", texto: "WiMAX (IEEE 802.16) é a tecnologia mais conhecida para implementar WMANs, oferecendo acesso em banda larga sem fio com cobertura de vários quilômetros, altas taxas de transmissão, suporte a múltiplos usuários e comunicação ponto-multiponto. Apesar de promissor, foi amplamente substituído pelo 4G LTE nas aplicações comerciais de banda larga móvel." },
{
tipo: "lista",
titulo: "Vantagens da WMAN",
itens: ["Implantação rápida", "Menor custo que fibra óptica", "Flexibilidade para expansão", "Cobertura de grandes áreas", "Ideal onde o cabeamento é inviável"]
},
{
tipo: "lista",
titulo: "Desvantagens da WMAN",
itens: ["Menor estabilidade que a fibra", "Sujeita a interferências (obstáculos, clima)", "Menor capacidade de transmissão", "Pode exigir visada direta em certos enlaces"]
},
{ tipo: "subtitulo", texto: "WLAN x WMAN" },
{
tipo: "tabela",
colunas: ["Aspecto", "WLAN", "WMAN"],
linhas: [
["Abrangência", "Local (sala, prédio)", "Metropolitana (cidade/região)"],
["Padrão IEEE", "802.11", "802.16"],
["Tecnologia típica", "Wi-Fi", "WiMAX"],
["Uso típico", "Redes domésticas/corporativas", "Interligação de LANs pela cidade"]
]
}
]
},
{
id: "redes_moveis",
titulo: "Redes Móveis e Celulares",
blocos: [
{ tipo: "subtitulo", texto: "Estrutura da rede celular" },
{ tipo: "texto", texto: "Uma rede celular é composta por várias estações-base (células), cada uma cobrindo uma pequena área geográfica. Cada área possui um identificador de localização, e a integração das células permite ampla cobertura regional. Um conjunto de estações-base forma uma área local (área de roteamento)." },
{ tipo: "subtitulo", texto: "Gestão da mobilidade" },
{ tipo: "texto", texto: "O objetivo da gestão da mobilidade é manter o rastreamento e a conectividade dos usuários, garantindo acesso contínuo a serviços (voz, SMS, dados)." },
{ tipo: "texto", texto: "O material organiza o gerenciamento de redes móveis em quatro colunas: Gestão da Mobilidade (Paging, Roaming, Atualização da Localização), Gerenciamento de Recursos (controle de congestionamento, controle de energia, alocação de taxa, planejamento de células, precificação), Gerenciamento de Segurança (propriedades de segurança, tipos de ataques) e Gerenciamento de Identidades (SIM, AuC). Vale notar que o Handover/Handoff não aparece nessa coluna específica — ele é tratado à parte, como parte da continuidade da comunicação durante o deslocamento, e não como um item de 'localização' propriamente dito. Isso ajuda a diferenciar: Paging/Roaming/Atualização de localização = saber onde o usuário está; Handover = manter a chamada ativa enquanto ele se move." },
{
tipo: "imagem",
id: "diagrama_gerenciamento_redes_moveis",
src: "diagrama_gerenciamento_redes_moveis.png",
pasta: "imagens_redes2/aula_05",
alt: "Diagrama em quatro colunas: Gestão da Mobilidade, Gerenciamento de Recursos, Gerenciamento de Segurança e Gerenciamento de Identidades, com seus respectivos itens",
num: 3
},
{
tipo: "topico",
titulo: "Paging",
lista: [
"Processo de localizar um dispositivo móvel dentro da rede quando há uma tentativa de comunicação com ele (ex.: uma chamada recebida).",
"Quando o celular está ocioso, ele não mantém comunicação constante com a rede. Ao chegar uma chamada, a rede envia uma mensagem de paging por várias torres na área onde o aparelho foi visto pela última vez.",
"Assim que o telefone recebe a mensagem, responde, e a conexão é estabelecida.",
"Ponto-chave: permite localizar o dispositivo sem precisar conhecer sua posição exata continuamente."
]
},
{
tipo: "topico",
titulo: "Roaming",
lista: [
"Processo que permite ao usuário utilizar sua rede móvel fora da área de registro original (Home Network), em outras regiões ou países, mantendo o mesmo número e serviços.",
"Ao entrar em área de uma rede parceira (Visited Network), o celular se registra automaticamente — possível graças a acordos de roaming entre operadoras, que permitem uso compartilhado de infraestrutura."
]
},
{
tipo: "topico",
titulo: "Atualização de localização (location update)",
lista: [
"O dispositivo móvel detecta o código da área de cobertura; quando esse código muda em relação ao anterior, ele realiza uma atualização de localização, enviando uma requisição à rede com o último código armazenado.",
"Esse processo ocorre independentemente de haver uma chamada ativa — é um procedimento periódico/reativo à mudança de área, não vinculado ao estabelecimento de uma chamada."
]
},
{
tipo: "topico",
titulo: "Handover / Handoff",
lista: [
"Transição de uma chamada (ou transmissão de dados) em andamento de uma célula/ponto de acesso para outro, mantendo a comunicação ativa.",
"Não é um cadastro permanente — é uma troca dinâmica que ocorre durante a comunicação, garantindo continuidade quando o usuário se desloca entre áreas de cobertura."
]
},
{ tipo: "subtitulo", texto: "Identidade temporária — TMSI" },
{ tipo: "texto", texto: "Cada usuário recebe uma TMSI (Temporary Mobile Subscriber Identity), uma identidade temporária atribuída sempre que o usuário muda de área — usada para preservar a identidade real do assinante durante a comunicação com a rede." },
{ tipo: "subtitulo", texto: "Diferenciação rápida entre os quatro conceitos" },
{
tipo: "tabela",
colunas: ["Conceito", "Quando ocorre", "Função"],
linhas: [
["Paging", "Ao chegar uma chamada/serviço", "Localizar o dispositivo dentro da área"],
["Roaming", "Usuário fora da área da operadora de origem", "Permitir uso da rede em outra região/país"],
["Atualização de localização", "Mudança de área de cobertura", "Informar à rede a nova posição, mesmo sem chamada ativa"],
["Handover/Handoff", "Durante uma comunicação ativa", "Trocar de célula/AP sem interromper a chamada"]
]
}
]
},
{
id: "quadro_resumo_geral",
titulo: "Quadro-resumo geral",
blocos: [
{
tipo: "lista",
titulo: "Quadro-resumo geral",
itens: [
"Atenuação = perda de energia · Distorção = mudança de forma/fase · Ruído = interferência externa.",
"Nyquist (canal ideal) = 2B·log₂L · Shannon (canal com ruído) = B·log₂(1+SNR).",
"Paridade → 1 bit · Checksum → soma de blocos (complemento de 1) · CRC → divisão binária/XOR · Hamming → paridade posicional + correção de 1 bit (FEC).",
"Stop-and-Wait ARQ → 1 frame por vez · Go-Back-N → retransmite a partir do erro · Selective Repeat → retransmite só o frame com problema.",
"Hub → camada física, repete para todas as portas · Switch → camada de enlace, encaminha por MAC · Roteador → camada de rede, encaminha por IP.",
"CSMA/CD (Ethernet/802.3, cabo) → detecta colisão · CSMA/CA (Wi-Fi/802.11, rádio) → evita colisão via backoff e (opcionalmente) RTS/CTS.",
"Estação oculta → duas estações não se veem, colidem no destino comum (RTS/CTS ajuda) · Estação exposta → estação deixa de transmitir sem necessidade (RTS/CTS não resolve totalmente).",
"IPv4 = 32 bits, decimal · IPv6 = 128 bits, hexadecimal.",
"Sub-redes: 2^m = quantidade de sub-redes · 2^(bits de host) − 2 = hosts válidos.",
"MPLS = comutação por rótulos entre as camadas 2 e 3, usado para escalabilidade, QoS e VPNs em MANs Ethernet.",
"WLAN (802.11/Wi-Fi, local) x WMAN (802.16/WiMAX, metropolitana).",
"Paging localiza · Roaming permite uso fora da área de origem · Atualização de localização informa mudança de área · Handover troca de célula durante chamada ativa."
]
}
]
}
]
    }
  ],

  extra: {
  mapasMentais: [
    {
      titulo: "Revisão de Redes 2",
      pasta: "redes2/mapa_mental",
      src: "revisao_redes_II.png"   // confirme que o arquivo existe exatamente aqui
    }
  ],
  videos: [
    {
      titulo: "Revisão de Redes 2",
      pasta: "redes2/videos",              // era "url", troque para "pasta"
      src: "revisao_redes_II.mp4"
    }
  ],
}



};