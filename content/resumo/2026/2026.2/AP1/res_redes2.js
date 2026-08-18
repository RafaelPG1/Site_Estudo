/* =============================================
   NEXUS STUDY — redes2.js
   Disciplina: Redes 2
   ============================================= */

window.__nexusConteudo = {
  aulas: [
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

  ]};