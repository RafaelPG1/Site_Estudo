window.__nexusConteudo = {

  aulas: [
    {
  aula: "Camada de Aplicação — Protocolos, Paradigmas e Serviços",
  ideia_central: "A Camada de Aplicação é a interface direta entre o usuário e a rede, definindo os protocolos e paradigmas que sustentam todos os serviços da Internet, como HTTP, FTP, SMTP, DNS e P2P.",
  secoes: [
    {
      id: "visao_geral",
      titulo: "Visão Geral do Conteúdo",
      blocos: [
        {
          tipo: "texto",
          texto: "Este conteúdo cobre a **Camada de Aplicação** da pilha TCP/IP, a camada mais próxima do usuário."
        },
        {
          tipo: "lista",
          titulo: "Principais tópicos abordados",
          itens: [
            "Conceitos fundamentais e paradigmas de comunicação",
            "Interface Socket",
            "Protocolo HTTP (WWW, Cookies, Proxy)",
            "Protocolo FTP",
            "Correio Eletrônico (SMTP, POP, IMAP, MIME)",
            "Sistema de Nomes de Domínio (DNS)",
            "Paradigma Peer-to-Peer (P2P), DHT, Chord e BitTorrent",
            "Acesso Remoto (TELNET e SSH)",
            "Comparação dos modelos OSI vs. TCP/IP",
            "Introdução à Programação Socket"
          ]
        }
      ]
    },
    {
      id: "conceitos_fundamentais",
      titulo: "Camada de Aplicação — Conceitos Fundamentais",
      blocos: [
        {
          tipo: "texto",
          texto: "A **Camada de Aplicação** é a **5ª camada** da pilha TCP/IP e representa a interface direta entre o usuário e a rede. Toda a infraestrutura da Internet existe para suportar os serviços definidos nessa camada."
        },
        {
          tipo: "tabela",
          titulo: "Características da Camada de Aplicação",
          colunas: ["Característica", "Descrição"],
          linhas: [
            ["Conexão Lógica", "As duas pontas comunicam-se como se houvesse uma conexão direta imaginária, ignorando roteadores e links físicos intermediários"],
            ["Flexibilidade", "É a única camada que não fornece serviços para outras camadas — apenas recebe serviços da camada de transporte. Isso permite criar e remover protocolos facilmente"],
            ["Protocolos Padronizados", "Protocolos essenciais (HTTP, SMTP, DNS) são normalmente integrados ao Sistema Operacional"]
          ]
        },
        {
          tipo: "destaque",
          texto: "Ponto-chave para prova: A camada de aplicação é a única que não serve às camadas inferiores — ela só consome serviços."
        }
      ]
    },
    {
      id: "paradigmas",
      titulo: "Paradigmas de Comunicação",
      blocos: [
        {
          tipo: "texto",
          texto: "Existem dois paradigmas principais (e um misto) que definem como os programas se comunicam na rede."
        },
        {
          tipo: "topico",
          titulo: "Cliente-Servidor",
          lista: [
            "O **Servidor** deve estar **sempre ativo**, aguardando solicitações.",
            "O **Cliente** inicia a comunicação apenas quando necessário.",
            "Arquitetura **centralizada**: múltiplos clientes acessam um único servidor via Internet."
          ]
        },
        {
          tipo: "topico",
          titulo: "Peer-to-Peer (P2P)",
          lista: [
            "**Não há servidor centralizado.**",
            "A responsabilidade é **compartilhada entre os nós (peers)**, que podem agir como clientes e servidores simultaneamente.",
            "Arquitetura **descentralizada**."
          ]
        },
        {
          tipo: "topico",
          titulo: "Paradigma Misto",
          lista: [
            "Aplicações que usam servidores para **encontrar o endereço** de um par e, em seguida, realizam a troca de dados **diretamente** entre os peers.",
            "Exemplo clássico: **Skype antigo**."
          ]
        }
      ]
    },
    {
      id: "socket",
      titulo: "A Interface Socket",
      blocos: [
        {
          tipo: "texto",
          texto: "Para que um aplicativo se comunique com a rede, ele precisa de uma **API (Interface de Programação de Aplicativos)**. A mais comum é a **Interface Socket**."
        },
        {
          tipo: "tabela",
          titulo: "Conceitos da Interface Socket",
          colunas: ["Conceito", "Descrição"],
          linhas: [
            ["Abstração de E/S", "O socket permite enviar/receber dados usando comandos simples de leitura e escrita, como se fosse um arquivo ou teclado"],
            ["Identificação", "Um socket é definido univocamente por: Endereço IP (identifica a máquina) + Número de Porta (identifica o processo)"],
            ["Escopo", "IPv4 possui 32 bits; o número de porta possui 16 bits (permitindo até 65.535 portas)"]
          ]
        },
        {
          tipo: "destaque",
          texto: "Analogia: O socket para um programador é como teclado/arquivo — você simplesmente 'lê' e 'escreve' dados, sem se preocupar com os detalhes físicos da rede."
        },
        {
          tipo: "imagem",
          src: "socket_interface_diagram.png",
          pasta: "imagens_redes/aula_15",
          alt: "Posicionamento da interface socket e estrutura do endereço — mostra que o socket funciona como teclado (entrada), monitor (saída) ou arquivo (entrada e saída), voltado para a rede",
          num: 1
        }
      ]
    },
    {
      id: "http",
      titulo: "World Wide Web (WWW) e Protocolo HTTP",
      blocos: [
        {
          tipo: "texto",
          texto: "**WWW** é um repositório distribuído de informações onde páginas Web são acessadas pelo **protocolo HTTP**."
        },
        {
          tipo: "tabela",
          titulo: "Características do HTTP e WWW",
          colunas: ["Característica", "Descrição"],
          linhas: [
            ["Hipertexto/Hipermídia", "Links para recuperar documentos automaticamente; páginas podem conter texto, áudio e vídeo"],
            ["Arquitetura", "Serviço cliente-servidor distribuído; um único documento pode exigir múltiplas transações HTTP (imagens, scripts externos)"],
            ["Porta Padrão", "HTTP usa a porta 80 sobre TCP"]
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Conexões HTTP: Não Persistente vs. Persistente"
        },
        {
          tipo: "tabela",
          titulo: "Tipos de Conexão HTTP",
          colunas: ["Tipo", "Comportamento", "Desvantagem / Vantagem"],
          linhas: [
            ["Não Persistente", "Abre e fecha uma conexão TCP para cada objeto solicitado", "Alta carga no servidor (múltiplos handshakes)"],
            ["Persistente (padrão HTTP/1.1)", "O servidor mantém a conexão aberta após enviar a resposta", "Economiza RTT (tempo de ida e volta) e buffers no servidor"]
          ]
        },
        {
          tipo: "destaque",
          texto: "RTT (Round-Trip Time): Tempo que um pacote leva para ir do cliente ao servidor e voltar."
        },
        {
          tipo: "subtitulo",
          texto: "Formatos de Mensagem HTTP"
        },
        {
          tipo: "topico",
          titulo: "Mensagem de Pedido (Request)",
          lista: [
            "Linha de solicitação: **Método + URL + Versão HTTP**",
            "Linhas de cabeçalho",
            "Corpo (opcional)"
          ]
        },
        {
          tipo: "topico",
          titulo: "Mensagem de Resposta (Response)",
          lista: [
            "Linha de estado: **Versão + Código de Estado + Frase**",
            "Linhas de cabeçalho",
            "Corpo (conteúdo HTML, imagem etc.)"
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Métodos HTTP"
        },
        {
          tipo: "tabela",
          titulo: "Métodos HTTP",
          colunas: ["Método", "Ação"],
          linhas: [
            ["GET", "Solicita um documento ao servidor"],
            ["HEAD", "Solicita informações sobre um documento, mas não o documento em si"],
            ["PUT", "Envia (publica) um documento do cliente para o servidor"],
            ["POST", "Envia alguma informação do cliente para o servidor (processamento)"],
            ["TRACE", "Ecoa a solicitação recebida (diagnóstico)"],
            ["DELETE", "Remove a página Web"],
            ["CONNECT", "Reservado"],
            ["OPTIONS", "Consulta opções disponíveis"]
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Códigos de Estado Comuns"
        },
        {
          tipo: "tabela",
          titulo: "Códigos de Estado HTTP",
          colunas: ["Código", "Significado"],
          linhas: [
            ["200 OK", "Requisição bem-sucedida"],
            ["404 Not Found", "Recurso não encontrado"],
            ["301 Moved Permanently", "Recurso movido permanentemente"],
            ["500 Internal Server Error", "Erro interno do servidor"]
          ]
        },
        {
          tipo: "imagem",
          src: "http_message_structure.png",
          pasta: "imagens_redes/aula_15",
          alt: "Estrutura lado a lado de uma mensagem de pedido (esquerda) e resposta (direita): linha de solicitação/estado, cabeçalhos, linha em branco e corpo",
          num: 2
        },
        {
          tipo: "imagem",
          src: "http_methods_table.png",
          pasta: "imagens_redes/aula_15",
          alt: "Tabela oficial com todos os métodos HTTP e suas respectivas ações",
          num: 3
        }
      ]
    },
    {
      id: "cookies",
      titulo: "Mecanismo de Cookies",
      blocos: [
        {
          tipo: "texto",
          texto: "Como o HTTP é um protocolo **sem estado** (stateless), os **Cookies** foram criados para permitir que servidores 'lembrem' informações sobre os clientes entre requisições."
        },
        {
          tipo: "tabela",
          titulo: "Aspectos dos Cookies",
          colunas: ["Aspecto", "Descrição"],
          linhas: [
            ["Funcionamento", "O servidor envia um cabeçalho `Set-Cookie` na resposta; o navegador armazena e reenvia em pedidos futuros"],
            ["Uso Prático", "Carrinhos de compra (e-commerce), autenticação de sessões, personalização de portais"],
            ["Privacidade", "Controverso: permite rastreamento do comportamento dos usuários por agências de publicidade"]
          ]
        },
        {
          tipo: "destaque",
          texto: "Ponto-chave: HTTP é stateless por padrão. Cookies são o mecanismo que adiciona estado a essa comunicação."
        }
      ]
    },
    {
      id: "proxy",
      titulo: "Servidor Proxy (Cache Web)",
      blocos: [
        {
          tipo: "texto",
          texto: "Um **Servidor Proxy** atua como intermediário entre o cliente e o servidor Web, mantendo em **cache** cópias das respostas recentes."
        },
        {
          tipo: "tabela",
          titulo: "Características do Servidor Proxy",
          colunas: ["Característica", "Descrição"],
          linhas: [
            ["Duplo Papel", "Funciona como **servidor** para o cliente original e como **cliente** para o servidor Web de destino"],
            ["Benefícios", "Reduz a carga no servidor original, diminui tráfego de rede e melhora a latência"],
            ["Hierarquia", "Pode ser instalado no computador do usuário, na LAN corporativa ou no provedor de Internet (ISP)"]
          ]
        },
        {
          tipo: "imagem",
          src: "proxy_server_diagram.png",
          pasta: "imagens_redes/aula_15",
          alt: "Múltiplos clientes numa rede local enviando requisições ao servidor proxy, que se conecta à Internet e aos servidores Web destino, ilustrando a centralização do cache",
          num: 4
        }
      ]
    },
    {
      id: "ftp",
      titulo: "Protocolo FTP (File Transfer Protocol)",
      blocos: [
        {
          tipo: "texto",
          texto: "O **FTP** é o padrão para transferência de arquivos entre estações, lidando com problemas de heterogeneidade de sistemas operacionais."
        },
        {
          tipo: "tabela",
          titulo: "Aspectos do FTP",
          colunas: ["Aspecto", "Detalhes"],
          linhas: [
            ["Porta de Controle", "Porta **21** — usada para comandos e autenticação"],
            ["Porta de Dados", "Porta **20** — usada para a transferência real do arquivo"],
            ["Eficiência", "A conexão de controle é simples (ASCII), enquanto a de dados usa regras complexas para diferentes tipos de arquivos"],
            ["Segurança", "⚠️ Envia senhas em texto às claras. Recomenda-se **SSL-FTP** (criptografado)"]
          ]
        },
        {
          tipo: "destaque",
          texto: "Ponto-chave: FTP usa duas conexões separadas — uma para controle (porta 21) e uma para dados (porta 20)."
        }
      ]
    },
    {
      id: "email",
      titulo: "Correio Eletrônico (E-mail)",
      blocos: [
        {
          tipo: "texto",
          texto: "O e-mail é uma transação de **mão única** que exige servidores intermediários, pois o destinatário não está necessariamente online o tempo todo."
        },
        {
          tipo: "subtitulo",
          texto: "Três Agentes Envolvidos"
        },
        {
          tipo: "tabela",
          titulo: "Agentes do Sistema de E-mail",
          colunas: ["Agente", "Sigla", "Função", "Exemplo"],
          linhas: [
            ["Agente de Usuário", "UA", "Interface com o usuário para ler/compor e-mails", "Outlook, Thunderbird"],
            ["Agente de Transferência", "MTA", "Transfere a mensagem entre servidores", "Servidor SMTP"],
            ["Agente de Acesso", "MAA", "Permite ao destinatário recuperar suas mensagens", "POP ou IMAP"]
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Protocolos de E-mail"
        },
        {
          tipo: "tabela",
          titulo: "Protocolos de E-mail",
          colunas: ["Protocolo", "Tipo", "Função"],
          linhas: [
            ["SMTP (porta 25)", "Push", "'Empurra' a mensagem do cliente para o servidor"],
            ["POP (porta 110)", "Pull", "'Puxa' mensagens do servidor para o cliente (remove do servidor)"],
            ["IMAP (porta 143)", "Pull", "Similar ao POP, mas mantém as mensagens no servidor (sincronização)"]
          ]
        },
        {
          tipo: "imagem",
          src: "email_flow_diagram.png",
          pasta: "imagens_redes/aula_15",
          alt: "Fluxo completo de e-mail: Alice (remetente) → UA → MTA via SMTP → Internet → MTA servidor destino via SMTP → MAA via POP/IMAP → Bob (destinatário)",
          num: 5
        },
        {
          tipo: "subtitulo",
          texto: "Extensões MIME"
        },
        {
          tipo: "texto",
          texto: "O sistema de e-mail original suporta apenas **ASCII de 7 bits**. O **MIME** (Multipurpose Internet Mail Extensions) permite o envio de dados não-ASCII (imagens, vídeo, acentos, etc.)."
        },
        {
          tipo: "tabela",
          titulo: "Mecanismos MIME",
          colunas: ["Mecanismo", "Descrição"],
          linhas: [
            ["Transformação", "Converte dados binários em NVT ASCII no remetente e realiza o inverso no receptor"],
            ["Codificação Base64", "Divide blocos de 6 bits e mapeia para ASCII de 8 bits → gera overhead de 25%"],
            ["Quoted-Printable", "Útil para mensagens majoritariamente ASCII com poucos caracteres especiais (acentos), convertidos para hexadecimal"]
          ]
        },
        {
          tipo: "exemplo",
          titulo: "MIME na prática",
          texto: "Quando você envia um anexo de imagem por e-mail, o MIME converte os bytes binários da imagem para uma representação ASCII que pode trafegar pelo protocolo."
        }
      ]
    },
    {
      id: "dns",
      titulo: "Sistema de Nomes de Domínio (DNS)",
      blocos: [
        {
          tipo: "texto",
          texto: "O **DNS** mapeia nomes de domínio amigáveis (`www.google.com`) para endereços IP numéricos exigidos pela pilha TCP/IP."
        },
        {
          tipo: "tabela",
          titulo: "Características do DNS",
          colunas: ["Característica", "Descrição"],
          linhas: [
            ["Distribuição", "Base de dados distribuída globalmente para evitar pontos únicos de falha"],
            ["Espaço Hierárquico", "Organizado em árvore invertida com até 128 níveis; cada nó tem um rótulo (label) de até 63 caracteres"],
            ["Zonas", "Parte contígua da árvore sob a autoridade de um servidor específico; o servidor primário mantém o arquivo de zona em disco"]
          ]
        },
        {
          tipo: "imagem",
          src: "dns_hierarchy_tree.png",
          pasta: "imagens_redes/aula_15",
          alt: "Árvore hierárquica do DNS com Servidor Raiz no topo, seguido por servidores TLD (edu, com, us) e domínios de segundo nível (fhda.edu, bk.edu, mcgraw.com, irwin.com)",
          num: 6
        },
        {
          tipo: "subtitulo",
          texto: "Tipos de Resolução DNS"
        },
        {
          tipo: "tabela",
          titulo: "Tipos de Resolução DNS",
          colunas: ["Tipo", "Como funciona"],
          linhas: [
            ["Recursiva", "O servidor local **assume toda a responsabilidade**: consulta outros servidores até obter o IP final e devolve a resposta pronta ao cliente"],
            ["Iterativa", "O servidor responde ao solicitante com o **endereço do próximo servidor** que pode saber a resposta; o cliente faz a nova consulta ele mesmo"],
            ["Caching", "Servidores armazenam mapeamentos recentes para acelerar consultas futuras, marcando-as como **não autoritativas**"]
          ]
        },
        {
          tipo: "destaque",
          texto: "Diferença-chave: Na recursiva, o servidor 'resolve tudo pra você'. Na iterativa, ele 'te manda pro próximo'."
        }
      ]
    },
    {
      id: "p2p",
      titulo: "Paradigma Peer-to-Peer (P2P)",
      blocos: [
        {
          tipo: "subtitulo",
          texto: "DHT — Tabelas de Hash Distribuídas"
        },
        {
          tipo: "texto",
          texto: "Redes P2P **estruturadas** utilizam **DHT** para organizar a localização de arquivos sem depender de servidores centrais."
        },
        {
          tipo: "tabela",
          titulo: "Conceitos da DHT",
          colunas: ["Conceito", "Descrição"],
          linhas: [
            ["Espaço de Endereços", "Peers e dados são mapeados em um anel lógico de tamanho **2^m** (geralmente m = 160)"],
            ["Mapeamento", "Função de hash **SHA-1** gera o ID do nó a partir do seu IP e a Chave a partir do nome do arquivo"],
            ["Responsabilidade", "O nó cujo ID é o mais próximo da chave (**sucessor**) armazena a referência para aquele arquivo"]
          ]
        },
        {
          tipo: "imagem",
          src: "dht_ring_diagram.png",
          pasta: "imagens_redes/aula_15",
          alt: "Anel DHT com espaço de IDs de tamanho 2^5 (m=5), mostrando como o arquivo 'Liberdade' tem sua chave calculada por hash(nome)=14 e é armazenado no nó N17",
          num: 7
        },
        {
          tipo: "subtitulo",
          texto: "Algoritmo Chord"
        },
        {
          tipo: "texto",
          texto: "O **Chord** é um protocolo de DHT com tabelas de roteamento eficientes chamadas **Tabelas de Derivação (finger tables)**."
        },
        {
          tipo: "tabela",
          titulo: "Aspectos do Chord",
          colunas: ["Aspecto", "Descrição"],
          linhas: [
            ["Roteamento", "Cada nó conhece apenas **m** outros nós sucessores estratégicos → qualquer busca é resolvida em **tempo logarítmico O(log N)**"],
            ["Estabilização", "Os nós verificam periodicamente seus sucessores e antecessores para lidar com entrada/saída dinâmica de peers"],
            ["Busca", "Realizada via **RPC** (Chamada de Procedimento Remoto) entre os nós do anel"]
          ]
        }
      ]
    },
    {
      id: "bittorrent",
      titulo: "Protocolo BitTorrent",
      blocos: [
        {
          tipo: "texto",
          texto: "O **BitTorrent** é focado no compartilhamento colaborativo de arquivos grandes, dividindo-os em pequenos **pedaços (chunks)**."
        },
        {
          tipo: "tabela",
          titulo: "Conceitos do BitTorrent",
          colunas: ["Conceito", "Descrição"],
          linhas: [
            ["Enxame (Swarm)", "Conjunto de todos os peers compartilhando um arquivo"],
            ["Seeds", "Peers com o arquivo **completo**"],
            ["Leeches", "Peers que ainda estão **obtendo partes** do arquivo"],
            ["Tit-for-tat", "Estratégia de troca: um peer fornece pedaços **apenas para quem também lhe envia dados** — garante equidade"],
            ["Tracker", "Entidade que monitora o enxame e fornece lista de vizinhos para novos peers"]
          ]
        },
        {
          tipo: "destaque",
          texto: "Evolução: Versões modernas do BitTorrent usam DHT para eliminar trackers centrais, tornando o sistema totalmente descentralizado."
        },
        {
          tipo: "imagem",
          src: "bittorrent_swarm_diagram.png",
          pasta: "imagens_redes/aula_15",
          alt: "Tracker central e 11 peers, cada um com diferentes pedaços do arquivo (de 5 pedaços no total), ilustrando o conceito de enxame, seeds e leeches",
          num: 8
        }
      ]
    },
    {
      id: "telnet",
      titulo: "Acesso Remoto — TELNET",
      blocos: [
        {
          tipo: "texto",
          texto: "O **TELNET** permite que um usuário acesse um computador remoto como se estivesse fisicamente em um terminal local."
        },
        {
          tipo: "tabela",
          titulo: "Características do TELNET",
          colunas: ["Característica", "Descrição"],
          linhas: [
            ["Heterogeneidade", "Resolve diferenças entre SOs (ex: DOS vs UNIX) através do **NVT (Terminal Virtual de Rede)**"],
            ["NVT ASCII", "Conjunto universal de **8 bits** para dados e controle"],
            ["Vulnerabilidade", "⚠️ Envia usuário e senha em texto às claras → substituído pelo SSH"]
          ]
        }
      ]
    },
    {
      id: "ssh",
      titulo: "Acesso Seguro — SSH (Secure Shell)",
      blocos: [
        {
          tipo: "texto",
          texto: "O **SSH** fornece uma conexão segura sobre uma rede insegura, com autenticação e criptografia."
        },
        {
          tipo: "tabela",
          titulo: "Componentes do SSH",
          colunas: ["Componente", "Função"],
          linhas: [
            ["SSH-TRANS", "Cria um canal seguro sobre TCP, garantindo privacidade e integridade das mensagens"],
            ["SSH-AUTH", "Autentica o cliente em relação ao servidor (métodos similares ao SSL)"],
            ["SSH-CONN (Port Forwarding)", "Cria um **túnel seguro** para proteger outros protocolos vulneráveis (SMTP, FTP)"]
          ]
        },
        {
          tipo: "imagem",
          src: "ssh_tunnel_ftp_diagram.png",
          pasta: "imagens_redes/aula_15",
          alt: "SSH criando um túnel entre Cliente SSH e Servidor SSH, por dentro do qual o tráfego FTP trafega de forma segura — ilustra port forwarding",
          num: 9
        }
      ]
    },
    {
      id: "osi_vs_tcpip",
      titulo: "Modelos de Referência — OSI vs. TCP/IP",
      blocos: [
        {
          tipo: "tabela",
          titulo: "Comparativo OSI vs. TCP/IP",
          colunas: ["Aspecto", "OSI (7 camadas)", "TCP/IP (5 camadas)"],
          linhas: [
            ["Tipo", "Modelo **teórico** e burocrático", "Modelo **prático** e flexível"],
            ["Camadas extras", "Sessão e Apresentação (frequentemente **vazias** na prática)", "As funções de topo são incorporadas na **Camada de Aplicação**"],
            ["Crítica ao TCP/IP", "—", "Não distingue claramente serviço, interface e protocolo"]
          ]
        },
        {
          tipo: "imagem",
          src: "osi_tcpip_comparison.png",
          pasta: "imagens_redes/aula_15",
          alt: "Comparativo lado a lado das 7 camadas OSI (Física, Enlace, Rede, Transporte, Sessão, Apresentação, Aplicação) versus as 5 camadas TCP/IP, com a camada de Aplicação absorvendo as 3 camadas superiores do OSI",
          num: 10
        }
      ]
    },
    {
      id: "formulas",
      titulo: "Fórmulas e Métodos",
      blocos: [
        {
          tipo: "topico",
          titulo: "RTT e HTTP Não Persistente",
          lista: [
            "Cada objeto requer **1 RTT para o handshake TCP + 1 RTT para a requisição HTTP** = **2 RTT por objeto**",
            "Com conexão persistente, o handshake é feito uma única vez."
          ]
        },
        {
          tipo: "topico",
          titulo: "Overhead MIME Base64",
          lista: [
            "Codificação Base64 converte cada **3 bytes** (24 bits) em **4 caracteres ASCII** (32 bits)",
            "**Overhead = 33%** de aumento no tamanho (às vezes citado como ~25% no material)"
          ]
        },
        {
          tipo: "topico",
          titulo: "DHT — Tamanho do Espaço",
          lista: [
            "Espaço de endereços: **2^m** posições no anel lógico",
            "Geralmente **m = 160** (usando SHA-1)",
            "Busca no Chord: **O(log N)** saltos, onde N é o número de nós"
          ]
        }
      ]
    },
    {
      id: "exemplos",
      titulo: "Exemplos Explicativos",
      blocos: [
        {
          tipo: "exemplo",
          titulo: "Exemplo 1 — Mensagem de Resposta HTTP",
          texto: "HTTP/1.1 200 OK\nDate: Mon, 31 Mar 2026 12:00:00 GMT\nServer: Apache/2.4.41\nContent-Type: text/html\n\n\n  Ola, mundo\n",
          detalhe: "Linha 1: Versão HTTP + Código de Estado | Linhas 2-4: Cabeçalhos informativos | Linhas 6-8: Corpo da resposta (conteúdo HTML)"
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo 2 — Resolução DNS Recursiva",
          texto: "1. Usuário digita `www.unicatolicaquixada.edu.br`\n2. PC consulta servidor DNS local\n3. DNS local não sabe → consulta servidor raiz\n4. Servidor raiz indica servidor TLD `.br`\n5. TLD `.br` indica servidor autoritativo de `unicatolicaquixada.edu.br`\n6. Servidor autoritativo retorna o IP\n7. DNS local entrega o IP ao PC (e guarda em cache)"
        },
        {
          tipo: "exemplo",
          titulo: "Exemplo 3 — DHT: Onde fica o arquivo 'Liberdade'?",
          texto: "hash('Liberdade') = 14\nhash(IP do peer 110.34.56.20) = 5 → Nó N5 no anel\nNó responsável: **N17** (sucessor mais próximo da chave 14 no anel)\nN17 armazena a referência: (110.34.56.20, porta 5200)"
        }
      ]
    },
    {
      id: "revisao",
      titulo: "Resumo Final para Revisão Rápida",
      blocos: [
        {
          tipo: "subtitulo",
          texto: "Tabela de Protocolos e Portas"
        },
        {
          tipo: "tabela",
          titulo: "Protocolos, Portas e Funções",
          colunas: ["Protocolo", "Porta", "Transporte", "Função"],
          linhas: [
            ["HTTP", "80", "TCP", "Web"],
            ["HTTPS", "443", "TCP", "Web segura"],
            ["FTP Controle", "21", "TCP", "Comandos FTP"],
            ["FTP Dados", "20", "TCP", "Transferência FTP"],
            ["SMTP", "25", "TCP", "Envio de e-mail"],
            ["POP3", "110", "TCP", "Recebimento e-mail (remove do servidor)"],
            ["IMAP", "143", "TCP", "Recebimento e-mail (mantém no servidor)"],
            ["DNS", "53", "UDP/TCP", "Resolução de nomes"],
            ["TELNET", "23", "TCP", "Acesso remoto inseguro"],
            ["SSH", "22", "TCP", "Acesso remoto seguro"]
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Comparações Importantes para Prova"
        },
        {
          tipo: "tabela",
          titulo: "Comparações para Prova",
          colunas: ["Conceito A", "Conceito B", "Diferença Principal"],
          linhas: [
            ["HTTP Não Persistente", "HTTP Persistente", "Um cria nova conexão TCP por objeto; outro reutiliza a conexão"],
            ["SMTP", "POP/IMAP", "SMTP é push (envia); POP/IMAP é pull (recebe)"],
            ["POP", "IMAP", "POP remove mensagens do servidor; IMAP mantém sincronizadas"],
            ["DNS Recursivo", "DNS Iterativo", "Recursivo: servidor resolve tudo; Iterativo: cliente faz cada consulta"],
            ["TELNET", "SSH", "TELNET trafega em texto às claras; SSH usa criptografia"],
            ["FTP", "SSH/SFTP", "FTP transmite senha sem criptografia; SFTP é seguro"],
            ["Cliente-Servidor", "P2P", "CS tem servidor central sempre ativo; P2P distribui responsabilidade"],
            ["OSI (7)", "TCP/IP (5)", "OSI é teórico; TCP/IP é prático (absorve Sessão e Apresentação na Aplicação)"]
          ]
        },
        {
          tipo: "subtitulo",
          texto: "Conceitos-Chave em uma Linha"
        },
        {
          tipo: "lista",
          itens: [
            "**Socket** = IP + Porta → identifica unicamente um processo em um host",
            "**HTTP é stateless** → Cookies adicionam estado",
            "**Proxy** = age como servidor para o cliente E como cliente para o servidor Web",
            "**FTP = 2 conexões** (controle porta 21 + dados porta 20)",
            "**MIME** = permite enviar binários/acentos por e-mail (que só aceita ASCII)",
            "**DNS** = 'lista telefônica' da Internet (nome → IP)",
            "**DHT** = localização de arquivos P2P sem servidor central",
            "**BitTorrent Tit-for-tat** = só recebo de quem também me envia",
            "**SSH-CONN** = tunelamento → protege outros protocolos dentro do SSH",
            "**Camada de Aplicação TCP/IP** = única que não serve outras camadas; só consome da camada de transporte"
          ]
        }
      ]
    }
  ]
    }
  ],

  simplificado: [
  // aula: Camada de Aplicação — Protocolos, Paradigmas e Serviços
  {
    aula: "Aula 1 — Camada de Aplicação: Protocolos, Paradigmas e Serviços",

    ideia_central: "A Camada de Aplicação é a interface direta entre o usuário e a rede, definindo os protocolos e paradigmas que sustentam todos os serviços da Internet, como HTTP, FTP, SMTP, DNS e P2P.",

    secoes: [
      {
        id: "conceitos_paradigmas",
        titulo: "📌 Conceitos Fundamentais e Paradigmas",
        blocos: [

          // 1 - camada aplicação
          {
            tipo: "topico",
            titulo: "🔹 Camada de Aplicação",
            lista: [
              "**5ª camada** da pilha TCP/IP — interface direta entre usuário e rede",
              "**Conexão lógica** → as pontas comunicam-se ignorando roteadores intermediários",
              "**Única camada** que não fornece serviços a outras camadas — só consome da camada de transporte",
              "Protocolos essenciais (`HTTP`, `SMTP`, `DNS`) normalmente integrados ao Sistema Operacional"
            ]
          },

          // 2 - paradigmas
          {
            tipo: "topico",
            titulo: "🔹 Paradigmas de Comunicação",
            lista: [
              "**Cliente-Servidor** → servidor sempre ativo; cliente inicia a comunicação; arquitetura centralizada",
              "**P2P** → sem servidor centralizado; peers atuam como cliente e servidor simultaneamente; arquitetura descentralizada",
              "**Paradigma Misto** → servidor localiza o endereço do par; troca de dados ocorre diretamente entre peers (ex: Skype antigo)"
            ]
          },

          // 3 - socket
          {
            tipo: "topico",
            titulo: "🔹 Interface Socket",
            lista: [
              "**API** mais comum para comunicação de aplicações com a rede",
              "Identificado unicamente por: **Endereço IP** (identifica a máquina) + **Número de Porta** (identifica o processo)",
              "`IPv4` possui 32 bits; porta possui 16 bits (até 65.535 portas)",
              "Abstrai a rede como operação de leitura/escrita, similar a um arquivo"
            ]
          },

          {
            tipo: "imagem",
            src: "socket_interface_diagram.png",
            pasta: "imagens_redes/aula_15",
            num: "1",
            alt: "Posicionamento da interface socket e estrutura do endereço — mostra que o socket funciona como teclado (entrada), monitor (saída) ou arquivo (entrada e saída), voltado para a rede"
          }

        ]
      },

      {
        id: "http_cookies_proxy",
        titulo: "📌 HTTP, Cookies e Proxy",
        blocos: [

          // 4 - http
          {
            tipo: "topico",
            titulo: "🔹 Protocolo HTTP",
            lista: [
              "**Porta 80** sobre `TCP`; base da WWW (repositório distribuído de informações)",
              "**Não Persistente** → nova conexão `TCP` por objeto; custo: múltiplos handshakes (2 RTT por objeto)",
              "**Persistente** (`HTTP/1.1`) → conexão mantida aberta após resposta; economiza RTT",
              "**RTT** (Round-Trip Time) = tempo de ida e volta de um pacote entre cliente e servidor"
            ]
          },

          // 5 - métodos http
          {
            tipo: "topico",
            titulo: "🔹 Métodos e Códigos HTTP",
            lista: [
              "**GET** → solicita documento | **HEAD** → solicita metadados do documento",
              "**POST** → envia dados para processamento | **PUT** → publica documento no servidor",
              "**DELETE** → remove página | **TRACE** → diagnóstico (ecoa solicitação)",
              "**200 OK** → sucesso | **301 Moved Permanently** → recurso movido",
              "**404 Not Found** → recurso inexistente | **500 Internal Server Error** → erro no servidor"
            ]
          },

          {
            tipo: "imagem",
            src: "http_message_structure.png",
            pasta: "imagens_redes/aula_15",
            num: "2",
            alt: "Estrutura lado a lado de uma mensagem de pedido (esquerda) e resposta (direita): linha de solicitação/estado, cabeçalhos, linha em branco e corpo"
          },

          // 6 - cookies
          {
            tipo: "topico",
            titulo: "🔹 Cookies",
            lista: [
              "`HTTP` é **stateless** por padrão — cookies adicionam estado à comunicação",
              "Servidor envia cabeçalho `Set-Cookie`; navegador armazena e reenvia em pedidos futuros",
              "Usos: carrinhos de compra, autenticação de sessão, personalização",
              "Controverso: permite rastreamento de comportamento por agências de publicidade"
            ]
          },

          // 7 - proxy
          {
            tipo: "topico",
            titulo: "🔹 Servidor Proxy (Cache Web)",
            lista: [
              "Intermediário entre cliente e servidor Web — mantém **cache** de respostas recentes",
              "Duplo papel: **servidor** para o cliente original e **cliente** para o servidor destino",
              "Benefícios: reduz carga no servidor, diminui tráfego e melhora latência",
              "Pode ser instalado no host do usuário, na LAN corporativa ou no `ISP`"
            ]
          },

          {
            tipo: "imagem",
            src: "proxy_server_diagram.png",
            pasta: "imagens_redes/aula_15",
            num: "4",
            alt: "Múltiplos clientes numa rede local enviando requisições ao servidor proxy, que se conecta à Internet e aos servidores Web destino, ilustrando a centralização do cache"
          }

        ]
      },

      {
        id: "ftp_email_dns",
        titulo: "📌 FTP, E-mail e DNS",
        blocos: [

          // 8 - ftp
          {
            tipo: "topico",
            titulo: "🔹 Protocolo FTP",
            lista: [
              "Padrão para transferência de arquivos entre sistemas heterogêneos",
              "**Porta 21** → conexão de controle (comandos e autenticação)",
              "**Porta 20** → conexão de dados (transferência real do arquivo)",
              "⚠️ Envia senhas em texto às claras → recomenda-se `SSL-FTP`"
            ]
          },

          // 9 - email
          {
            tipo: "topico",
            titulo: "🔹 Correio Eletrônico (E-mail)",
            lista: [
              "**UA** (Agente de Usuário) → interface para ler/compor e-mails (ex: Outlook)",
              "**MTA** (Agente de Transferência) → transfere mensagem entre servidores via `SMTP`",
              "**MAA** (Agente de Acesso) → permite ao destinatário recuperar mensagens (`POP` ou `IMAP`)",
              "`SMTP` porta **25** → Push (envia mensagem ao servidor)",
              "`POP` porta **110** → Pull (baixa e remove mensagens do servidor)",
              "`IMAP` porta **143** → Pull (mantém mensagens no servidor; sincronização)"
            ]
          },

          {
            tipo: "imagem",
            src: "email_flow_diagram.png",
            pasta: "imagens_redes/aula_15",
            num: "5",
            alt: "Fluxo completo de e-mail: Alice (remetente) → UA → MTA via SMTP → Internet → MTA servidor destino via SMTP → MAA via POP/IMAP → Bob (destinatário)"
          },

          // 10 - mime
          {
            tipo: "topico",
            titulo: "🔹 Extensões MIME",
            lista: [
              "E-mail original suporta apenas **ASCII de 7 bits** — `MIME` permite envio de binários e acentos",
              "**Base64** → divide blocos de 6 bits e mapeia para ASCII de 8 bits; overhead de ~33%",
              "**Quoted-Printable** → para mensagens majoritariamente ASCII com poucos caracteres especiais (convertidos para hexadecimal)"
            ]
          },

          // 11 - dns
          {
            tipo: "topico",
            titulo: "🔹 DNS — Sistema de Nomes de Domínio",
            lista: [
              "Mapeia nomes amigáveis (`www.google.com`) para endereços IP numéricos",
              "Base de dados **distribuída** globalmente — evita ponto único de falha",
              "Espaço **hierárquico** em árvore invertida com até 128 níveis; rótulo de até 63 caracteres",
              "**Zona** → parte contígua da árvore sob autoridade de um servidor específico"
            ]
          },

          // 12 - resolução dns
          {
            tipo: "topico",
            titulo: "🔹 Tipos de Resolução DNS",
            lista: [
              "**Recursiva** → servidor local resolve tudo e devolve a resposta pronta ao cliente",
              "**Iterativa** → servidor retorna o endereço do próximo servidor; cliente faz cada nova consulta",
              "**Caching** → servidores armazenam mapeamentos recentes (não autoritativos) para acelerar consultas futuras"
            ]
          },

          {
            tipo: "imagem",
            src: "dns_hierarchy_tree.png",
            pasta: "imagens_redes/aula_15",
            num: "6",
            alt: "Árvore hierárquica do DNS com Servidor Raiz no topo, seguido por servidores TLD (edu, com, us) e domínios de segundo nível (fhda.edu, bk.edu, mcgraw.com, irwin.com)"
          }

        ]
      },

      {
        id: "p2p_telnet_ssh_osi",
        titulo: "📌 P2P, Acesso Remoto e Modelos de Referência",
        blocos: [

          // 13 - dht
          {
            tipo: "topico",
            titulo: "🔹 P2P — DHT (Tabelas de Hash Distribuídas)",
            lista: [
              "Redes P2P **estruturadas** localizam arquivos sem servidores centrais",
              "Espaço de endereços: anel lógico de **2^m** posições (geralmente m = 160 com `SHA-1`)",
              "**ID do nó** = `hash(IP)` | **Chave do arquivo** = `hash(nome do arquivo)`",
              "Responsável pelo arquivo: nó **sucessor** mais próximo da chave no anel"
            ]
          },

          {
            tipo: "imagem",
            src: "dht_ring_diagram.png",
            pasta: "imagens_redes/aula_15",
            num: "7",
            alt: "Anel DHT com espaço de IDs de tamanho 2^5 (m=5), mostrando como o arquivo 'Liberdade' tem sua chave calculada por hash(nome)=14 e é armazenado no nó N17"
          },

          // 14 - chord
          {
            tipo: "topico",
            titulo: "🔹 Algoritmo Chord",
            lista: [
              "Protocolo `DHT` com **Tabelas de Derivação (finger tables)** para roteamento eficiente",
              "Cada nó conhece **m** outros nós estratégicos → busca em tempo **O(log N)**",
              "Busca via **RPC** (Chamada de Procedimento Remoto) entre nós do anel",
              "**Estabilização** periódica para lidar com entrada/saída dinâmica de peers"
            ]
          },

          // 15 - bittorrent
          {
            tipo: "topico",
            titulo: "🔹 BitTorrent",
            lista: [
              "Compartilhamento colaborativo de arquivos grandes divididos em **chunks (pedaços)**",
              "**Enxame (Swarm)** → conjunto de todos os peers compartilhando um arquivo",
              "**Seeds** → peers com arquivo completo | **Leeches** → peers ainda obtendo partes",
              "**Tit-for-tat** → peer fornece pedaços apenas para quem também lhe envia dados (equidade)",
              "**Tracker** → monitora o enxame e fornece lista de vizinhos para novos peers",
              "Versões modernas usam `DHT` para eliminar trackers centrais"
            ]
          },

          {
            tipo: "imagem",
            src: "bittorrent_swarm_diagram.png",
            pasta: "imagens_redes/aula_15",
            num: "8",
            alt: "Tracker central e 11 peers, cada um com diferentes pedaços do arquivo (de 5 pedaços no total), ilustrando o conceito de enxame, seeds e leeches"
          },

          // 16 - telnet ssh
          {
            tipo: "topico",
            titulo: "🔹 TELNET e SSH",
            lista: [
              "`TELNET` → acesso remoto via **NVT** (Terminal Virtual de Rede); ⚠️ trafega credenciais em texto às claras",
              "`SSH` → acesso remoto **seguro** com autenticação e criptografia sobre `TCP`",
              "**SSH-TRANS** → cria canal seguro garantindo privacidade e integridade",
              "**SSH-AUTH** → autentica o cliente no servidor",
              "**SSH-CONN** → cria **túnel seguro** para proteger outros protocolos vulneráveis (`FTP`, `SMTP`)"
            ]
          },

          {
            tipo: "imagem",
            src: "ssh_tunnel_ftp_diagram.png",
            pasta: "imagens_redes/aula_15",
            num: "9",
            alt: "SSH criando um túnel entre Cliente SSH e Servidor SSH, por dentro do qual o tráfego FTP trafega de forma segura — ilustra port forwarding"
          },

          // 17 - osi vs tcpip
          {
            tipo: "topico",
            titulo: "🔹 OSI vs. TCP/IP",
            lista: [
              "**OSI** → 7 camadas; modelo **teórico**; camadas Sessão e Apresentação frequentemente vazias na prática",
              "**TCP/IP** → 5 camadas; modelo **prático**; Aplicação absorve Sessão e Apresentação",
              "Crítica ao TCP/IP: não distingue claramente serviço, interface e protocolo"
            ]
          },

          {
            tipo: "imagem",
            src: "osi_tcpip_comparison.png",
            pasta: "imagens_redes/aula_15",
            num: "10",
            alt: "Comparativo lado a lado das 7 camadas OSI (Física, Enlace, Rede, Transporte, Sessão, Apresentação, Aplicação) versus as 5 camadas TCP/IP, com a camada de Aplicação absorvendo as 3 camadas superiores do OSI"
          },

          // 18 - tabela portas
          {
            tipo: "topico",
            titulo: "🔹 Protocolos, Portas e Transportes",
            lista: [
              "`HTTP` → porta **80** / `TCP` → Web",
              "`HTTPS` → porta **443** / `TCP` → Web segura",
              "`FTP` controle → porta **21** / `TCP` | dados → porta **20** / `TCP`",
              "`SMTP` → porta **25** / `TCP` → envio de e-mail",
              "`POP3` → porta **110** / `TCP` → recebimento (remove do servidor)",
              "`IMAP` → porta **143** / `TCP` → recebimento (mantém no servidor)",
              "`DNS` → porta **53** / `UDP`/`TCP` → resolução de nomes",
              "`TELNET` → porta **23** / `TCP` → acesso remoto inseguro",
              "`SSH` → porta **22** / `TCP` → acesso remoto seguro"
            ]
          }

        ]
      }
    ]
  }
  ]

};