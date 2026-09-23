// ============================================================
// NEXUS STUDY — quiz/conteudo/2026.2/AP1/redes2.js
// ============================================================
window.questoes = {

  // Questões de Banco de dados 
  questoes: [
    // 1 - Componentes de rede
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Explicativa",
  texto: "Uma rede de computadores é formada por três tipos de elementos que trabalham juntos: os ==def==hosts==, que são os dispositivos finais que efetivamente usam a rede (computadores, smartphones, impressoras); os dispositivos de interconexão, que conectam e organizam o caminho dos dados (switch, roteador, hub, AP); e os meios de transmissão, que são os caminhos físicos ou sem fio por onde os dados trafegam.",
  question: "Um roteador, cuja função é conectar dispositivos e encaminhar o caminho dos dados pela rede, é classificado como qual tipo de elemento?",
  options: [
    "Um host, pois processa dados da rede",
    "Um dispositivo de interconexão",
    "Um meio de transmissão guiado",
    "Um meio de transmissão não guiado"
  ],
  answer: 1,
  feedback: "Roteadores, switches, hubs e access points são dispositivos de interconexão: eles não geram nem consomem dados como um host, mas organizam o encaminhamento da comunicação."
},

// 2 - Meios guiados e não guiados
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Explicativa",
  texto: "Os meios de transmissão se dividem em duas categorias. Os meios guiados usam um cabo físico para levar o sinal, como par trançado, cabo coaxial e fibra óptica. Já os meios não guiados não dependem de cabo, transmitindo o sinal pelo ar ou espaço, como ondas de rádio, micro-ondas, infravermelho e satélite.",
  question: "Uma empresa decide instalar uma rede Wi-Fi para evitar passar cabos pelo escritório. Esse tipo de conexão utiliza qual categoria de meio de transmissão?",
  options: [
    "Meio guiado, pois usa cabo coaxial",
    "Meio guiado, pois usa fibra óptica",
    "Meio não guiado, pois não depende de cabo físico",
    "Meio não guiado, pois usa par trançado sem fio"
  ],
  answer: 2,
  feedback: "Wi-Fi transmite dados por ondas de rádio, sem necessidade de cabo físico entre os pontos, o que o caracteriza como meio não guiado."
},

// 3 - Tipos de redes (LAN, MAN, WAN)
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Contextualizada",
  texto: "As redes podem ser classificadas de acordo com sua abrangência geográfica. A LAN (Local Area Network) cobre áreas pequenas, como uma residência ou um escritório. A MAN (Metropolitan Area Network) tem alcance maior, conectando pontos dentro de uma região metropolitana. Já a WAN (Wide Area Network) pode conectar redes em diferentes cidades, estados ou até países, sendo a de maior abrangência entre as três.",
  question: "Uma empresa com filiais em diferentes estados do Brasil interliga todas as suas unidades por meio de uma única infraestrutura de rede. Essa rede corporativa deve ser classificada como qual tipo?",
  options: [
    "LAN, pois interliga computadores de uma mesma empresa",
    "MAN, pois abrange uma região metropolitana",
    "WAN, pois conecta redes em regiões distantes entre si",
    "P2P, pois todos os dispositivos têm o mesmo papel"
  ],
  answer: 2,
  feedback: "Quando a rede conecta localidades em diferentes regiões ou estados, ultrapassando os limites de uma área metropolitana, ela é classificada como WAN."
},

// 4 - IPv4 x IPv6
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Contextualizada",
  texto: "Existem dois formatos principais de endereçamento IP. O IPv4 possui ==key==32 bits==, representado por 4 octetos decimais separados por pontos (ex: 192.168.10.1), e sofre com a escassez de endereços disponíveis. O IPv6 foi criado justamente para resolver esse problema: possui ==key==128 bits==, é representado em hexadecimal e oferece um espaço de endereçamento muito maior, além de recursos como autoconfiguração e melhor suporte a segurança.",
  question: "Um provedor de Internet está enfrentando dificuldades para atribuir endereços IP a novos clientes, pois os endereços disponíveis estão se esgotando. Qual protocolo de endereçamento resolve esse problema, e por quê?",
  options: [
    "IPv4, porque usa notação decimal mais simples",
    "IPv6, porque possui 128 bits, oferecendo um espaço de endereçamento muito maior",
    "IPv4, porque é o padrão mais usado atualmente",
    "IPv6, porque reduz o tamanho do endereço para 32 bits"
  ],
  answer: 1,
  feedback: "O IPv6 usa 128 bits, contra os 32 bits do IPv4, ampliando enormemente a quantidade de endereços disponíveis e resolvendo o problema de escassez."
},

// 5 - Cliente-servidor
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Aplicação",
  texto: "No modelo cliente-servidor, o cliente é o dispositivo que solicita um serviço, enquanto o servidor recebe a solicitação, processa e envia uma resposta. Esse modelo tem como principal característica a administração centralizada, já que o servidor concentra os recursos e precisa ter boa capacidade de desempenho e disponibilidade.",
  question: "Um funcionário abre o navegador e digita o endereço do site da intranet da empresa para consultar documentos armazenados em um servidor central. Esse cenário representa qual modelo de rede?",
  options: [
    "P2P, pois o funcionário compartilha recursos com outros usuários",
    "Cliente-servidor, pois o funcionário solicita e o servidor responde",
    "P2P, pois não há centralização de recursos",
    "Cliente-servidor, mas com administração descentralizada"
  ],
  answer: 1,
  feedback: "O funcionário atua como cliente ao solicitar os documentos, e o servidor centraliza o armazenamento e responde à solicitação — característica típica do modelo cliente-servidor centralizado."
},

// 6 - P2P
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Aplicação",
  texto: "No modelo Peer-to-Peer (P2P), não existe um servidor especializado: cada dispositivo pode fornecer e consumir serviços ao mesmo tempo. Isso traz vantagens como baixo custo e escalabilidade, mas também desvantagens, como maior dificuldade de gerenciamento e de garantia de segurança, já que a administração é descentralizada.",
  question: "Em um programa de compartilhamento de arquivos, cada usuário conectado pode tanto baixar partes de um arquivo de outros usuários quanto disponibilizar partes de arquivos que já possui, sem depender de um servidor central. Esse funcionamento é característico de qual modelo?",
  options: [
    "Cliente-servidor, pois há centralização dos arquivos",
    "P2P, pois os dispositivos fornecem e consomem serviços simultaneamente",
    "Cliente-servidor, pois exige hardware robusto",
    "P2P, mas apenas quando há um servidor de backup"
  ],
  answer: 1,
  feedback: "No P2P, como no exemplo do Torrent, todos os nós podem atuar simultaneamente como fornecedores e consumidores de recursos, sem depender de um servidor central — o que gera descentralização."
},

// 7 - Modelo OSI
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Explicativa",
  texto: "O modelo OSI organiza a comunicação de redes em 7 camadas, cada uma com uma função específica. A camada de Transporte é responsável pela confiabilidade da comunicação e pelo controle de fluxo, enquanto a camada de Rede cuida do endereçamento lógico (IP) e do roteamento dos dados até o destino.",
  question: "Qual camada do modelo OSI é responsável por garantir que os dados cheguem de forma confiável ao destino, controlando o fluxo da comunicação?",
  options: [
    "Camada de Rede",
    "Camada de Enlace",
    "Camada de Transporte",
    "Camada de Sessão"
  ],
  answer: 2,
  feedback: "A camada de Transporte cuida da confiabilidade e do controle de fluxo da comunicação, sendo associada a protocolos como o TCP."
},

// 8 - OSI x TCP/IP
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Contextualizada",
  texto: "O modelo TCP/IP é mais enxuto que o OSI, possuindo apenas 5 camadas em vez de 7. Isso acontece porque as três camadas superiores do OSI — Aplicação, Apresentação e Sessão — são agrupadas em uma única camada de Aplicação no modelo TCP/IP. As demais camadas (Transporte, Rede/Internet, Enlace e Física) mantêm funções equivalentes entre os dois modelos.",
  question: "Um protocolo que, no modelo OSI, atuaria na camada de Sessão controlando o diálogo entre aplicações, em qual camada do modelo TCP/IP ele estaria localizado?",
  options: [
    "Camada de Transporte do TCP/IP",
    "Camada de Rede/Internet do TCP/IP",
    "Camada de Aplicação do TCP/IP",
    "Camada de Enlace do TCP/IP"
  ],
  answer: 2,
  feedback: "As funções de Sessão, Apresentação e Aplicação do OSI ficam todas concentradas na camada de Aplicação do modelo TCP/IP, que por isso tem apenas 5 camadas no total."
},

// 9 - Encapsulamento
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Aplicação",
  texto: "Quando um dispositivo envia dados pela rede no modelo TCP/IP, ocorre o processo de ==proc==encapsulamento==: em cada camada são adicionadas informações de controle. A sequência é: dados da aplicação → segmento/datagrama (Transporte) → pacote (Rede, com endereços IP) → quadro (Enlace, com endereços MAC) → sinais (Física). No receptor, ocorre o processo inverso, o desencapsulamento, removendo essas informações camada por camada.",
  question: "Durante o envio de um e-mail, a camada de Enlace adiciona endereços MAC e transforma os pacotes recebidos da camada de Rede em qual unidade de dados?",
  options: [
    "Segmento",
    "Datagrama",
    "Quadro",
    "Sinal"
  ],
  answer: 2,
  feedback: "Na camada de Enlace, os pacotes vindos da camada de Rede são encapsulados em quadros (frames), recebendo endereços MAC e informações de controle de erro."
},

// 10 - DNS
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Explicativa",
  texto: "Como os dispositivos de uma rede são identificados por números (endereços IP), mas as pessoas preferem usar nomes fáceis de memorizar, existe o serviço de nomes. Na Internet, essa função é feita pelo DNS (Domain Name System), que traduz um nome em um endereço numérico. Isso também permite que, se o IP de um servidor mudar, o nome continue funcionando normalmente para o usuário.",
  question: "Ao digitar o nome de um site no navegador em vez de digitar diretamente o endereço IP do servidor, qual serviço é responsável por traduzir esse nome para o endereço numérico correspondente?",
  options: [
    "FTP",
    "DNS",
    "SMTP",
    "HTTP"
  ],
  answer: 1,
  feedback: "O DNS faz a tradução entre nomes de domínio e endereços IP, permitindo que o usuário use nomes fáceis de memorizar em vez de números."
},
// 11 - Sinais analógicos e digitais
{
  aula: "Aula 3 — Camadas físicas e de enlace",
  tipo: "Explicativa",
  texto: "Um sinal ==def==analógico== varia de forma contínua, passando por infinitos valores ao longo do tempo, como uma onda senoidal. Já um sinal ==def==digital== varia de forma discreta, assumindo um número limitado de valores, normalmente representados por 0 e 1, formando degraus em vez de uma curva contínua.",
  question: "Um sinal que assume apenas os valores 0 e 1, mudando de forma abrupta entre eles, é classificado como qual tipo de sinal?",
  options: [
    "Analógico, pois representa dados binários",
    "Digital, pois possui variação discreta e número limitado de valores",
    "Analógico, pois é transmitido por cabo de par trançado",
    "Digital, pois sempre é transmitido por fibra óptica"
  ],
  answer: 1,
  feedback: "Sinais digitais possuem variação discreta, com um número limitado de valores possíveis (geralmente 0 e 1), diferente dos sinais analógicos, que variam continuamente."
},

// 12 - Banda base e banda larga
{
  aula: "Aula 3 — Camadas físicas e de enlace",
  tipo: "Contextualizada",
  texto: "Existem duas formas principais de transmitir um sinal digital pelo meio físico. Na Banda Base, o sinal digital é enviado diretamente, sem conversão, usando um canal passa-baixas cuja faixa de frequência começa em 0 Hz — é o caso típico de redes Ethernet locais. Na Banda Larga, o sinal digital é convertido em sinal analógico por modulação, utilizando um canal passa-faixa que não começa em 0 Hz, permitindo transmissão em meios compartilhados e por longas distâncias, como na Internet por fibra óptica.",
  question: "Uma operadora precisa transmitir dados digitais por fibra óptica ao longo de dezenas de quilômetros, convertendo o sinal digital através de modulação. Essa transmissão está sendo feita em qual modalidade?",
  options: [
    "Banda Base, pois usa canal passa-baixas",
    "Banda Larga, pois envolve modulação e permite longas distâncias",
    "Banda Base, pois é típica de redes Ethernet",
    "Banda Larga, pois a frequência começa em 0 Hz"
  ],
  answer: 1,
  feedback: "A Banda Larga converte o sinal digital em analógico por modulação, usando canal passa-faixa, o que permite transmissão por longas distâncias e em meios compartilhados, como ocorre na Internet por fibra óptica."
},

// 13 - Atenuação, distorção e ruído
{
  aula: "Aula 3 — Camadas físicas e de enlace",
  tipo: "Explicativa",
  texto: "Durante a propagação pelo meio de transmissão, o sinal pode sofrer três tipos principais de perdas. A ==warn==atenuação== é a perda de energia do sinal ao longo do percurso. A distorção é a alteração da forma original do sinal, geralmente porque diferentes frequências se propagam em velocidades distintas. Já o ruído é qualquer sinal indesejado que se mistura ao sinal transmitido, podendo corromper a informação.",
  question: "Um sinal percorre um cabo muito longo e chega ao destino com potência muito menor do que a enviada, embora sua forma original tenha sido mantida. Esse fenômeno é chamado de quê?",
  options: [
    "Distorção",
    "Ruído",
    "Atenuação",
    "Interferência de fase"
  ],
  answer: 2,
  feedback: "A atenuação é a perda de energia do sinal durante sua propagação pelo meio, reduzindo sua potência sem necessariamente alterar sua forma."
},

// 14 - Nyquist x Shannon
{
  aula: "Aula 3 — Camadas físicas e de enlace",
  tipo: "Contextualizada",
  texto: "Existem dois teoremas para calcular a taxa máxima de transmissão de dados. O Teorema de Nyquist se aplica a canais ideais, sem ruído, relacionando a taxa máxima com a largura de banda e o número de níveis do sinal (Taxa = 2 × B × log₂L). O Teorema de Shannon se aplica a canais reais, com ruído, relacionando a capacidade máxima com a largura de banda e a relação sinal/ruído (Capacidade = B × log₂(1+SNR)).",
  question: "Um engenheiro precisa calcular a capacidade máxima de um canal real, que sofre interferência de ruído ao longo da transmissão. Qual teorema ele deve utilizar?",
  options: [
    "Teorema de Nyquist, pois considera o número de níveis do sinal",
    "Teorema de Shannon, pois considera a relação sinal/ruído de canais reais",
    "Teorema de Nyquist, pois se aplica a qualquer tipo de canal",
    "Nenhum dos dois, pois ruído não pode ser calculado matematicamente"
  ],
  answer: 1,
  feedback: "O Teorema de Shannon é utilizado para canais reais, que possuem ruído, calculando a capacidade máxima a partir da largura de banda e da SNR (relação sinal/ruído)."
},

// 15 - Latência e seus componentes
{
  aula: "Aula 3 — Camadas físicas e de enlace",
  tipo: "Aplicação",
  texto: "A latência representa o tempo total necessário para que uma mensagem chegue ao destino, sendo composta por quatro fatores: tempo de propagação (tempo para o bit percorrer a distância física), tempo de transmissão (tempo para colocar todos os bits no meio), tempo de fila e retardo de processamento. O tempo de propagação depende da distância e da velocidade de propagação no meio; já o tempo de transmissão depende do tamanho da mensagem e da largura de banda do canal.",
  question: "Um técnico percebe que, ao dobrar o tamanho de um arquivo enviado pela mesma rede, o tempo necessário para colocar todos os bits no meio de transmissão também aumenta. Esse tempo, que depende do tamanho da mensagem e da largura de banda, é chamado de quê?",
  options: [
    "Tempo de propagação",
    "Tempo de fila",
    "Retardo de processamento",
    "Tempo de transmissão"
  ],
  answer: 3,
  feedback: "O tempo de transmissão é calculado pela fórmula Tamanho da mensagem / Largura de banda, e por isso aumenta quando o tamanho do arquivo enviado aumenta."
},

// 16 - Funções da camada de Enlace
{
  aula: "Aula 3 — Camadas físicas e de enlace",
  tipo: "Explicativa",
  texto: "A camada de Enlace organiza o fluxo de bits recebido em frames (quadros) e executa cinco funções principais: framing (divisão em frames), endereçamento (adiciona endereços de emissor e receptor), controle de fluxo (evita sobrecarga do receptor), controle de erros (detecta e trata frames corrompidos) e controle de acesso ao meio (define quem transmite quando o link é compartilhado).",
  question: "Quando vários dispositivos compartilham o mesmo meio de transmissão e é preciso definir qual deles pode transmitir em determinado momento, qual função da camada de Enlace está sendo executada?",
  options: [
    "Framing",
    "Controle de fluxo",
    "Controle de acesso ao meio",
    "Endereçamento"
  ],
  answer: 2,
  feedback: "O controle de acesso ao meio é a função responsável por determinar qual dispositivo terá o direito de utilizar o meio compartilhado em cada momento."
},

// 17 - Bit de paridade
{
  aula: "Aula 3 — Camadas físicas e de enlace",
  tipo: "Aplicação",
  texto: "O bit de paridade é uma técnica simples de detecção de erros: adiciona-se 1 bit extra à mensagem para fazer com que a quantidade total de bits 1 seja par (ou ímpar, dependendo da convenção adotada). Se a mensagem original já possui uma quantidade par de 1s, o bit de paridade adicionado é 0; se possui uma quantidade ímpar, o bit adicionado é 1.",
  question: "Uma mensagem binária possui 5 bits com valor 1. Usando paridade par, qual deve ser o valor do bit de paridade adicionado para tornar a quantidade total de 1s par?",
  options: [
    "0, pois a quantidade já é par",
    "1, pois a quantidade de 1s é ímpar e precisa ser ajustada para par",
    "0, pois bit de paridade sempre é 0 em mensagens ímpares",
    "1, pois todo bit de paridade deve ser 1"
  ],
  answer: 1,
  feedback: "Como a mensagem tem 5 bits em 1 (quantidade ímpar), é necessário adicionar um bit de paridade igual a 1 para que o total de bits 1 passe a ser par (6)."
},

// 18 - CRC
{
  aula: "Aula 3 — Camadas físicas e de enlace",
  tipo: "Contextualizada",
  texto: "O CRC (Cyclic Redundancy Check) funciona como uma assinatura matemática da mensagem. O emissor adiciona zeros à direita da mensagem original e divide essa sequência pelo polinômio gerador usando divisão binária com XOR; o resto dessa divisão é o CRC, que é anexado à mensagem transmitida. No receptor, a mensagem recebida (com o CRC) é dividida novamente pelo mesmo polinômio gerador, gerando um resultado chamado síndrome.",
  question: "No receptor, após dividir a mensagem recebida pelo polinômio gerador, a síndrome resultante é diferente de zero. O que isso indica?",
  options: [
    "Que a mensagem foi recebida corretamente",
    "Que houve amplificação do sinal",
    "Que um erro foi detectado na transmissão",
    "Que o polinômio gerador utilizado estava incorreto"
  ],
  answer: 2,
  feedback: "Quando a síndrome (resto da divisão no receptor) é diferente de zero, isso indica que um erro foi detectado e os dados recebidos são descartados."
},

// 19 - Go-Back-N x Selective Repeat
{
  aula: "Aula 3 — Camadas físicas e de enlace",
  tipo: "Contextualizada",
  texto: "Tanto o Go-Back-N ARQ quanto o Selective Repeat ARQ usam janela deslizante para enviar vários frames antes de receber confirmações. A diferença está no que acontece após um erro: no Go-Back-N, ao detectar erro em um frame, o receptor descarta esse frame e todos os seguintes, mesmo que já tenham chegado corretamente, e o emissor retransmite a partir do frame com erro. Já no Selective Repeat, o receptor armazena os frames corretos recebidos fora de ordem e apenas o frame perdido ou corrompido precisa ser retransmitido.",
  question: "Em uma transmissão usando janela deslizante, o frame 3 chega corrompido, mas os frames 4 e 5 chegam corretamente. Ao usar Selective Repeat ARQ, o que acontece com os frames 4 e 5?",
  options: [
    "São descartados junto com o frame 3",
    "São armazenados pelo receptor enquanto se aguarda a retransmissão do frame 3",
    "São retransmitidos junto com o frame 3",
    "São ignorados até que toda a janela seja reenviada"
  ],
  answer: 1,
  feedback: "No Selective Repeat ARQ, os frames corretos recebidos fora de ordem são armazenados pelo receptor, e apenas o frame com erro (no caso, o frame 3) precisa ser retransmitido."
},

// 20 - Stop-and-Wait ARQ
{
  aula: "Aula 3 — Camadas físicas e de enlace",
  tipo: "Aplicação",
  texto: "No Stop-and-Wait ARQ, cada frame recebe um número de sequência e o emissor mantém uma cópia do frame enviado enquanto aguarda o ACK correspondente, usando um timer. Se o timer expirar sem que o ACK chegue, o emissor retransmite o frame. A principal desvantagem desse protocolo é a ineficiência: como apenas um frame pode estar em trânsito por vez, o canal fica ocioso durante boa parte do tempo.",
  question: "Um emissor envia um frame e o timer configurado expira sem que nenhum ACK tenha sido recebido. Segundo o funcionamento do Stop-and-Wait ARQ, qual ação o emissor deve tomar?",
  options: [
    "Enviar o próximo frame da fila, ignorando o anterior",
    "Aguardar indefinidamente até que o ACK chegue",
    "Retransmitir o frame que não foi confirmado",
    "Descartar a cópia do frame e encerrar a transmissão"
  ],
  answer: 2,
  feedback: "Se o timer expira sem receber o ACK correspondente, o emissor retransmite o frame, já que mantinha uma cópia dele guardada justamente para esse cenário."
},
// 21 - LLC e MAC
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Explicativa",
  texto: "O Projeto IEEE 802 dividiu a camada de Enlace em duas subcamadas. A ==def==LLC== (Logical Link Control) cuida do controle de fluxo, controle de erros e parte do framing, sendo independente da tecnologia de LAN utilizada. Já a ==def==MAC== (Media Access Control) é específica de cada tecnologia, definindo o método de acesso ao meio e o formato dos quadros.",
  question: "Uma mesma lógica de controle de fluxo e de erros pode ser reaproveitada tanto em redes Ethernet quanto em redes Wi-Fi, já que essa subcamada não depende da tecnologia de LAN. A qual subcamada isso se refere?",
  options: [
    "MAC, pois define o acesso ao meio",
    "LLC, pois é independente da tecnologia de LAN",
    "MAC, pois é comum a todas as tecnologias",
    "Camada Física, pois trata da transmissão de bits"
  ],
  answer: 1,
  feedback: "A LLC é independente do tipo de LAN, podendo ser reaproveitada em diferentes tecnologias, enquanto a MAC é específica para cada uma delas, como Ethernet ou Wi-Fi."
},

// 22 - CSMA/CD
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Explicativa",
  texto: "A Ethernet tradicional utiliza o CSMA/CD (Carrier Sense Multiple Access with Collision Detection). Antes de transmitir, a estação verifica se o meio está livre (Carrier Sense). Várias estações compartilham o mesmo meio (Multiple Access). Se duas transmitirem ao mesmo tempo, ocorre uma colisão, detectada pelas estações, que interrompem a transmissão e aguardam um tempo aleatório antes de tentar novamente (Collision Detection).",
  question: "Duas estações em uma rede Ethernet tradicional transmitem simultaneamente e uma colisão ocorre. Segundo o funcionamento do CSMA/CD, o que as estações fazem em seguida?",
  options: [
    "Continuam transmitindo até o fim do quadro, ignorando a colisão",
    "Interrompem a transmissão e aguardam um tempo aleatório antes de tentar novamente",
    "Trocam de meio de transmissão imediatamente",
    "Aguardam um sinal do roteador para retomar a transmissão"
  ],
  answer: 1,
  feedback: "No CSMA/CD, ao detectar uma colisão, as estações interrompem a transmissão e aguardam um tempo aleatório (backoff) antes de tentar transmitir novamente."
},

// 23 - CSMA/CD x CSMA/CA
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Contextualizada",
  texto: "Ethernet e Wi-Fi utilizam estratégias diferentes para lidar com colisões. O CSMA/CD, usado na Ethernet tradicional (redes com fio), detecta a colisão depois que ela ocorre e interrompe a transmissão. Já o CSMA/CA, usado no Wi-Fi (redes sem fio), procura evitar a colisão antes que ela aconteça, pois em ambientes sem fio não é possível detectar uma colisão enquanto se transmite.",
  question: "Em uma rede Wi-Fi, por que o mecanismo de acesso ao meio se preocupa em evitar colisões antes de transmitir, em vez de detectá-las durante a transmissão como na Ethernet?",
  options: [
    "Porque o Wi-Fi utiliza cabos de fibra óptica",
    "Porque, em redes sem fio, não é possível detectar uma colisão enquanto a estação está transmitindo",
    "Porque o CSMA/CA é mais antigo que o CSMA/CD",
    "Porque o Wi-Fi não permite múltiplos dispositivos no mesmo canal"
  ],
  answer: 1,
  feedback: "Diferentemente da Ethernet com fio, no ambiente sem fio a estação não consegue detectar uma colisão enquanto transmite, por isso o CSMA/CA foca em evitar a colisão antecipadamente."
},

// 24 - BSS e ESS
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Contextualizada",
  texto: "No IEEE 802.11, a BSS (Basic Service Set) é a unidade básica de uma rede Wi-Fi, podendo ser ad hoc (sem AP, com estações se comunicando diretamente) ou de infraestrutura (com um AP centralizando a comunicação). Quando duas ou mais BSSs são interligadas por um sistema de distribuição, como uma LAN com fio, forma-se uma ESS (Extended Service Set), permitindo que dispositivos se movam entre diferentes áreas cobertas por APs distintos.",
  question: "Em um prédio com vários Access Points conectados entre si por uma rede Ethernet, permitindo que um usuário se mova entre andares sem perder a conexão Wi-Fi, essa estrutura é chamada de quê?",
  options: [
    "BSS ad hoc",
    "ESS",
    "Piconet",
    "Scatternet"
  ],
  answer: 1,
  feedback: "Quando várias BSSs (cada uma com seu AP) são interligadas por um sistema de distribuição, formam uma ESS, permitindo cobertura contínua em uma área maior."
},

// 25 - Estação oculta e RTS/CTS
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Aplicação",
  texto: "O problema da estação oculta ocorre quando duas estações não conseguem se enxergar diretamente, mas ambas conseguem transmitir para uma terceira estação em comum, causando colisões nessa estação central. A solução apresentada é o handshake RTS/CTS: a estação que deseja transmitir envia um RTS (Request to Send), o destinatário responde com um CTS (Clear to Send) informando a duração da transmissão, e as demais estações que ouvem o CTS entendem que o canal está ocupado e aguardam.",
  question: "As estações B e C não conseguem se enxergar diretamente, mas ambas alcançam a estação A. B começa a transmitir para A e, graças ao handshake RTS/CTS, C recebe o CTS enviado por A. O que C faz ao receber esse CTS?",
  options: [
    "Ignora o CTS e transmite normalmente para A",
    "Aguarda, pois entende que o canal está ocupado pela duração informada",
    "Envia imediatamente seu próprio RTS para A",
    "Interrompe a comunicação entre A e B enviando um NACK"
  ],
  answer: 1,
  feedback: "Ao receber o CTS enviado por A (mesmo sem enxergar B diretamente), C entende que o canal ficará ocupado pela duração indicada e aguarda, evitando a colisão típica do problema de estação oculta."
},

// 26 - Piconet e Scatternet
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Explicativa",
  texto: "No Bluetooth, uma Piconet é uma pequena rede formada por até 8 dispositivos: 1 dispositivo primário (mestre) e até 7 secundários (escravos). Quando várias piconets se interligam, formando uma rede maior em que um dispositivo pode ser primário em uma piconet e secundário em outra, essa estrutura é chamada de Scatternet.",
  question: "Um fone de ouvido Bluetooth atua como dispositivo secundário conectado a um celular (que é o primário) em uma piconet, mas esse mesmo celular também atua como secundário em outra piconet, conectado ao computador de um colega. Essa interligação entre as duas piconets forma qual estrutura?",
  options: [
    "Uma ESS",
    "Uma BSS ad hoc",
    "Uma Scatternet",
    "Uma sub-rede"
  ],
  answer: 2,
  feedback: "Quando várias piconets se interconectam, com um dispositivo atuando como primário em uma e secundário em outra, forma-se uma Scatternet."
},

// 27 - Endereço MAC
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Explicativa",
  texto: "O endereço MAC identifica exclusivamente uma interface de rede (NIC) dentro de uma LAN. Ele possui 48 bits (6 bytes) e é gravado pelo fabricante na placa de rede. Existem três tipos de entrega associados ao endereçamento MAC: Unicast, que identifica um único computador destinatário; Broadcast, que envia uma cópia para todos os computadores da rede; e Multicast, que envia uma cópia para um subconjunto específico de computadores.",
  question: "Um servidor de streaming de vídeo envia o mesmo conteúdo apenas para um grupo específico de dispositivos inscritos, sem alcançar todos os computadores da rede. Esse tipo de entrega é chamado de quê?",
  options: [
    "Unicast",
    "Broadcast",
    "Multicast",
    "Anycast"
  ],
  answer: 2,
  feedback: "O Multicast entrega uma cópia da informação apenas para um subconjunto de dispositivos (o grupo inscrito), diferente do Broadcast, que alcança todos, e do Unicast, que alcança apenas um destinatário."
},

// 28 - MAC x IP
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Contextualizada",
  texto: "O endereço MAC identifica fisicamente a interface de rede dentro de uma LAN, funcionando como uma identidade fixa gravada pelo fabricante — uma analogia usada é compará-lo ao CPF da placa de rede. Já o endereço IP identifica logicamente um dispositivo, permitindo a comunicação entre redes diferentes, funcionando como um endereço residencial que pode mudar conforme a localização do dispositivo na rede.",
  question: "Um notebook mantém o mesmo endereço MAC gravado em sua placa de rede, mas recebe um novo endereço IP toda vez que se conecta a uma rede Wi-Fi diferente. Isso ilustra qual diferença entre MAC e IP?",
  options: [
    "MAC muda conforme a rede; IP é fixo",
    "MAC é a identidade física fixa da interface; IP é a identificação lógica que pode variar conforme a rede",
    "MAC e IP são sempre idênticos no mesmo dispositivo",
    "MAC identifica a rede; IP identifica o fabricante"
  ],
  answer: 1,
  feedback: "O MAC é a identidade física da interface de rede, gravada pelo fabricante e normalmente fixa, enquanto o IP é a identificação lógica do dispositivo na rede, podendo mudar conforme o local ou a rede à qual ele se conecta."
},

// 29 - Cálculo de sub-redes
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Aplicação",
  texto: "Para dividir uma rede em sub-redes, utilizam-se bits emprestados da parte de host. A quantidade de sub-redes criadas é dada por 2^m, onde m é o número de bits emprestados. Por exemplo, ao emprestar 2 bits de uma rede /24, obtém-se uma nova máscara /26, permitindo criar 2² = 4 sub-redes.",
  question: "Uma empresa possui a rede 192.168.0.0/24 e precisa dividi-la em exatamente 8 sub-redes para atender seus departamentos. Quantos bits da parte de host ela deve emprestar para conseguir esse número de sub-redes?",
  options: [
    "2 bits, pois 2² = 4",
    "3 bits, pois 2³ = 8",
    "4 bits, pois 2⁴ = 16",
    "1 bit, pois 2¹ = 2"
  ],
  answer: 1,
  feedback: "A fórmula é Quantidade de sub-redes = 2^m. Para obter 8 sub-redes, é necessário emprestar 3 bits, já que 2³ = 8."
},

// 30 - Hosts válidos por sub-rede
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Aplicação",
  texto: "Depois de definir quantos bits são emprestados para criar sub-redes, os bits restantes da parte de host determinam quantos endereços válidos existem em cada sub-rede. A fórmula é Hosts válidos = 2^n − 2, onde n é o número de bits restantes para hosts, e o −2 exclui o endereço da própria rede e o endereço de broadcast, que não podem ser atribuídos a dispositivos.",
  question: "Uma sub-rede com máscara /26 possui 6 bits restantes destinados a hosts. Quantos endereços IP válidos podem ser atribuídos a dispositivos nessa sub-rede?",
  options: [
    "64, pois 2⁶ = 64",
    "62, pois 2⁶ − 2 = 62",
    "60, pois é preciso subtrair 4 endereços reservados",
    "32, pois metade dos endereços é reservada"
  ],
  answer: 1,
  feedback: "Com 6 bits para hosts, o total de endereços é 2⁶ = 64, mas dois deles (o endereço de rede e o de broadcast) não podem ser atribuídos a dispositivos, restando 62 hosts válidos."
},
// 31 - Definição de MAN
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Explicativa",
  texto: "Uma MAN (Metropolitan Area Network) é uma rede de alta velocidade que interliga diversas LANs distribuídas em uma mesma cidade ou região metropolitana, geralmente utilizando fibra óptica e tecnologias como Metro Ethernet. Na hierarquia de redes, ela fica entre a LAN, com cobertura local (um prédio ou conjunto de prédios), e a WAN, com cobertura regional, nacional ou global.",
  question: "Uma operadora de telecomunicações interliga, por meio de fibra óptica, as filiais de uma empresa espalhadas por diferentes bairros da mesma cidade. Essa rede é classificada em qual nível da hierarquia?",
  options: [
    "LAN, pois conecta apenas uma empresa",
    "MAN, pois sua cobertura está em nível de cidade",
    "WAN, pois utiliza fibra óptica",
    "WMAN, pois não depende de cabos"
  ],
  answer: 1,
  feedback: "A MAN tem cobertura em nível de cidade, interligando diferentes LANs de uma mesma região metropolitana, diferente da LAN (cobertura local) e da WAN (cobertura regional, nacional ou global)."
},

// 32 - Metro Ethernet
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Explicativa",
  texto: "O Metro Ethernet (Carrier Ethernet) é a extensão do protocolo Ethernet para distâncias metropolitanas, geralmente de 10 a 50 km. A operadora usa switches de alta capacidade e fibras ópticas urbanas para criar redes locais virtuais pela cidade, sem exigir adaptadores complexos do lado do cliente — conectar duas sedes fica tão simples quanto plugar um cabo em um switch.",
  question: "Uma empresa quer conectar duas filiais na mesma cidade usando uma tecnologia que estende o Ethernet, sem precisar de equipamentos industriais complexos do lado do cliente. Qual tecnologia atende a essa necessidade?",
  options: [
    "WiMAX",
    "Metro Ethernet",
    "SONET",
    "DWDM"
  ],
  answer: 1,
  feedback: "O Metro Ethernet estende o protocolo Ethernet para distâncias metropolitanas, permitindo conectar sedes de forma simples, como se fosse plugar um cabo em um switch, sem exigir equipamentos complexos do cliente."
},

// 33 - MPLS
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Contextualizada",
  texto: "Embora o cliente utilize um serviço Ethernet, a operadora precisa transportar o tráfego de milhares de clientes pela mesma infraestrutura, e para isso utiliza o ==key==MPLS==, uma técnica que opera entre as camadas de Enlace e Rede. O MPLS adiciona um rótulo curto ao pacote assim que ele entra na rede, e os roteadores intermediários (Label Switch Routers) encaminham o pacote observando apenas esse rótulo, substituindo-o quando necessário — processo chamado de Label Swapping.",
  question: "Dentro do backbone de uma operadora, um roteador intermediário precisa encaminhar rapidamente um pacote para o próximo equipamento. Segundo o funcionamento do MPLS, o que esse roteador analisa para tomar a decisão de encaminhamento?",
  options: [
    "O endereço IP completo de origem e destino",
    "Apenas o Label (rótulo) associado ao pacote",
    "O conteúdo do payload do pacote",
    "O endereço MAC de origem"
  ],
  answer: 1,
  feedback: "No MPLS, os roteadores intermediários não analisam o endereço IP do pacote; eles observam apenas o Label, substituindo-o quando necessário e encaminhando o pacote rapidamente — o processo de Label Swapping."
},

// 34 - Vantagens do MPLS
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Aplicação",
  texto: "O uso do MPLS em uma MAN Ethernet traz diversas vantagens: maior eficiência no encaminhamento (já que os roteadores analisam apenas rótulos), Engenharia de Tráfego (escolha de caminhos conforme congestionamento), Qualidade de Serviço para priorizar aplicações sensíveis a latência, escalabilidade para atender milhares de clientes, e a possibilidade de criar VPNs MPLS, permitindo que diferentes empresas compartilhem a mesma infraestrutura física com isolamento lógico entre suas redes.",
  question: "Duas empresas concorrentes contratam serviços da mesma operadora de telecomunicações e utilizam a mesma infraestrutura física de fibra óptica, mas seus dados trafegam de forma isolada, sem que uma empresa tenha acesso aos dados da outra. Qual recurso do MPLS torna isso possível?",
  options: [
    "Engenharia de Tráfego",
    "VPNs MPLS, que criam isolamento lógico entre redes na mesma infraestrutura",
    "Qualidade de Serviço (QoS)",
    "Multiplexação DWDM"
  ],
  answer: 1,
  feedback: "As VPNs MPLS permitem que diferentes empresas compartilhem a mesma infraestrutura física da operadora, mantendo isolamento lógico entre suas redes, garantindo privacidade e segurança dos dados."
},

// 35 - ERPS e self-healing
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Aplicação",
  texto: "O ERPS (Ethernet Ring Protection Switching) é o padrão moderno de proteção em anel usado em redes Metro Ethernet. Em condições normais, um link do anel fica bloqueado logicamente para evitar loops infinitos de dados. Quando ocorre o rompimento físico de um cabo, os switches das pontas percebem a queda em menos de 50 milissegundos, o bloqueio é liberado, e os dados passam a fluir pelo caminho oposto do anel, garantindo que serviços críticos não fiquem fora do ar.",
  question: "Uma escavação na via pública rompe acidentalmente um cabo de fibra óptica que atende uma rede em anel protegida por ERPS. O que acontece com o tráfego de dados nesse cenário?",
  options: [
    "A rede fica totalmente fora do ar até o reparo físico do cabo",
    "Os dados passam a fluir pelo caminho oposto do anel após a detecção da falha em menos de 50 ms",
    "O tráfego é redirecionado manualmente por um técnico da operadora",
    "A rede reduz a velocidade, mas mantém o mesmo caminho de antes"
  ],
  answer: 1,
  feedback: "O ERPS detecta rompimentos em menos de 50 milissegundos e libera o bloqueio lógico, permitindo que os dados passem a fluir pelo caminho oposto do anel, mantendo os serviços no ar mesmo após a falha física."
},

// 36 - Planta externa x equipamentos ativos
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Contextualizada",
  texto: "A infraestrutura de uma MAN se divide em dois grupos. A Planta Externa (Passiva) é composta por elementos que não necessitam de energia elétrica, como a fibra óptica monomodo, dutos, caixas de inspeção e DIOs, servindo apenas para suportar ou conduzir o sinal óptico. Já os Equipamentos Ativos, como switches Metro Ethernet, roteadores MPLS e amplificadores ópticos, necessitam de alimentação elétrica e processam, regeneram ou encaminham os sinais.",
  question: "Uma caixa de emenda utilizada para organizar e fundir cabos de fibra óptica ao longo de uma rota urbana, sem necessitar de energia elétrica para funcionar, pertence a qual categoria da infraestrutura?",
  options: [
    "Equipamentos ativos",
    "Planta externa (passiva)",
    "Nós de processamento",
    "Backbone MPLS"
  ],
  answer: 1,
  feedback: "Elementos como caixas de emenda, dutos e DIOs não necessitam de energia elétrica e apenas suportam ou conduzem o sinal óptico, sendo classificados como parte da planta externa (passiva)."
},

// 37 - CWDM x DWDM
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Contextualizada",
  texto: "Para evitar o lançamento contínuo de novos cabos de fibra nas ruas, utilizam-se técnicas de multiplexação óptica que dividem o feixe de luz em múltiplos comprimentos de onda. O CWDM (Coarse WDM) tem espaçamento maior entre canais, suporta até 18 canais por par de fibra e possui custo acessível, sendo usado em MANs e redes regionais. Já o DWDM (Dense WDM) tem espaçamento muito denso, permite mais de 80 canais em uma única fibra, atingindo taxas superiores a Tb/s, sendo usado em backbones e redes de longa distância.",
  question: "Um backbone de operadora precisa transmitir mais de 80 canais em um único filamento de fibra óptica, alcançando taxas superiores a Terabits por segundo. Qual técnica de multiplexação atende a essa necessidade?",
  options: [
    "CWDM, pelo baixo custo",
    "DWDM, pela alta densidade de canais e capacidade",
    "CWDM, por suportar até 18 canais",
    "ERPS, por garantir resiliência"
  ],
  answer: 1,
  feedback: "O DWDM permite transmitir mais de 80 canais em uma única fibra, atingindo taxas superiores a Tb/s, sendo mais indicado para backbones e redes de longa distância que exigem altíssima capacidade."
},

// 38 - WMAN
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Aplicação",
  texto: "A WMAN (Wireless Metropolitan Area Network) conecta LANs distribuídas em uma cidade utilizando ondas de rádio em vez de cabos. Ela surge como alternativa quando não é possível instalar fibra óptica, seja por alto custo, obstáculos geográficos, áreas de difícil acesso ou necessidade de implantação rápida. A tecnologia mais conhecida para WMANs é o WiMAX (IEEE 802.16), que oferece cobertura de vários quilômetros e comunicação ponto-multiponto.",
  question: "Uma prefeitura precisa levar conectividade de banda larga a uma região montanhosa de difícil acesso, onde a instalação de fibra óptica seria muito cara e demorada. Qual solução é mais adequada para esse cenário?",
  options: [
    "Metro Ethernet, pois é mais barato que fibra",
    "WMAN com WiMAX, pois dispensa cabeamento físico",
    "DWDM, pois aumenta a capacidade da fibra existente",
    "SONET, pois é mais simples de instalar"
  ],
  answer: 1,
  feedback: "A WMAN, usando tecnologias como o WiMAX, utiliza ondas de rádio em vez de cabos, sendo ideal para áreas de difícil acesso ou onde a instalação de fibra óptica é inviável ou muito cara."
},

// 39 - Componentes da WMAN
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Explicativa",
  texto: "Uma WMAN possui componentes específicos: as Estações Base, equipamentos que transmitem e recebem o sinal de rádio, funcionando como torres de comunicação; as Antenas, que realizam a transmissão e recepção das ondas eletromagnéticas; e o CPE (Customer Premises Equipment), o equipamento instalado no cliente que recebe o sinal da estação base e o conecta à rede local da empresa ou residência.",
  question: "O equipamento instalado dentro de uma empresa que recebe o sinal de rádio vindo da estação base e o conecta à rede interna local é chamado de quê?",
  options: [
    "Estação Base",
    "Antena de transmissão",
    "CPE (Customer Premises Equipment)",
    "Backbone"
  ],
  answer: 2,
  feedback: "O CPE é o equipamento instalado no cliente, responsável por receber o sinal da estação base e conectá-lo à rede local da empresa ou residência."
},

// 40 - SONET/SDH e a transição
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Contextualizada",
  texto: "As tecnologias SONET e SDH foram a espinha dorsal de redes metropolitanas e de longa distância nas décadas de 1980 e 1990, mas foram gradualmente substituídas por Metro Ethernet, MPLS e DWDM. A razão fundamental dessa substituição foi a mudança no perfil do tráfego de comunicação: a transição de um mundo focado em voz, baseado em comutação de circuitos, para um mundo dominado por dados, baseado em comutação de pacotes IP.",
  question: "Por que tecnologias como SONET e SDH, que dominaram as redes metropolitanas nas décadas de 1980 e 1990, perderam espaço para Metro Ethernet, MPLS e DWDM?",
  options: [
    "Porque o custo de instalação de fibra óptica aumentou",
    "Porque o tráfego de comunicação migrou de voz baseada em circuitos para dados baseados em pacotes IP",
    "Porque o SONET não suportava fibra óptica monomodo",
    "Porque as operadoras pararam de investir em redes metropolitanas"
  ],
  answer: 1,
  feedback: "A principal razão da substituição foi a mudança no perfil do tráfego: das redes de voz por comutação de circuitos para redes de dados baseadas em comutação de pacotes IP, para as quais Metro Ethernet, MPLS e DWDM são mais adequados."
},
// 41 - Redes celulares x ad hoc
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Explicativa",
  texto: "As redes sem fio se dividem em dois grandes grupos. As Redes Celulares Móveis dependem de uma infraestrutura hierárquica fixa (estações rádio base, torres, antenas) e permitem mobilidade contínua entre células através do handover. Já as Redes Ad-hoc Sem Fio têm estrutura descentralizada: os dispositivos se comunicam diretamente entre si, e cada nó atua simultaneamente como emissor, receptor e roteador.",
  question: "Em uma operação de resgate após um desastre natural, os socorristas usam dispositivos que se comunicam diretamente entre si, sem depender de torres de celular ou qualquer infraestrutura fixa. Esse cenário representa qual tipo de rede sem fio?",
  options: [
    "Rede celular móvel, pois usa ondas de rádio",
    "Rede ad hoc sem fio, pois não depende de infraestrutura fixa",
    "Rede celular móvel, pois permite handover entre células",
    "Nenhuma das duas, pois exige fibra óptica"
  ],
  answer: 1,
  feedback: "Redes ad hoc sem fio são descentralizadas e não dependem de infraestrutura fixa, com os dispositivos se comunicando diretamente entre si e atuando também como roteadores — ideal para cenários como operações de resgate."
},

// 42 - Evolução das gerações móveis
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Contextualizada",
  texto: "As redes móveis evoluíram ao longo de gerações. O 1G, implantado entre 1970 e 1980, transmitia apenas sinais analógicos de voz usando FDMA. O 2G, lançado em 1991, trouxe comunicação digital, melhor qualidade de sinal e criptografia. O 3G, no final dos anos 1990, trouxe suporte a comunicações multimídia com velocidades de até 2 Mbps. O 4G, lançado em 2009, é baseado em IP e integra voz, dados e streaming. Já o 5G, lançado em 2019, oferece velocidades de até 10 Gbps, menor latência e suporte a um grande número de dispositivos IoT.",
  question: "Uma cidade inteligente precisa conectar milhares de sensores IoT simultaneamente, com baixíssima latência e altíssima velocidade de transmissão. Qual geração de rede móvel foi projetada especificamente para atender esse tipo de demanda?",
  options: [
    "2G, pela introdução da criptografia",
    "3G, pelo suporte a multimídia",
    "4G, por ser baseado em IP",
    "5G, pela menor latência e maior número de dispositivos conectados"
  ],
  answer: 3,
  feedback: "O 5G foi projetado com foco em menor latência, velocidades de até 10 Gbps e suporte a um número muito maior de dispositivos conectados simultaneamente, características essenciais para aplicações de IoT em larga escala."
},

// 43 - Paging
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Aplicação",
  texto: "O Paging é o processo pelo qual a rede localiza um dispositivo móvel quando há uma tentativa de comunicação com ele. Como o celular ocioso não mantém comunicação constante com a rede, quando uma chamada chega, a rede envia uma mensagem de paging por várias torres na área onde o aparelho foi visto pela última vez, e assim que o telefone recebe essa mensagem, ele responde e a conexão é estabelecida.",
  question: "Um smartphone está em modo ocioso, sem chamadas ou dados ativos, quando alguém liga para o número desse aparelho. Qual processo a rede utiliza para localizar o dispositivo e estabelecer a conexão?",
  options: [
    "Roaming",
    "Handover",
    "Paging",
    "Atualização de localização"
  ],
  answer: 2,
  feedback: "O Paging é o processo específico usado pela rede para localizar um dispositivo móvel ocioso quando surge uma chamada ou serviço a ser entregue, enviando mensagens pelas torres da área onde ele foi visto por último."
},

// 44 - Roaming
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Aplicação",
  texto: "O Roaming permite que o usuário utilize sua rede móvel fora da área de registro original, mantendo o mesmo número e serviços. Quando o usuário sai da cobertura de sua operadora doméstica (Home Network) e entra em uma rede parceira (Visited Network), o celular se registra automaticamente nessa nova rede, algo possível graças aos acordos de roaming firmados entre as operadoras.",
  question: "Um usuário brasileiro viaja para outro país e consegue continuar usando o mesmo número de celular para fazer e receber chamadas, mesmo estando conectado à rede de uma operadora local diferente da sua. Esse recurso é chamado de quê?",
  options: [
    "Paging",
    "Handoff",
    "Roaming",
    "Clusterização"
  ],
  answer: 2,
  feedback: "O Roaming permite que o usuário utilize a rede móvel fora de sua área de registro original, incluindo outros países, mantendo o mesmo número e serviços graças aos acordos entre operadoras."
},

// 45 - Categorias de redes ad hoc
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Contextualizada",
  texto: "As redes ad hoc sem fio se dividem em várias categorias conforme o alcance e a aplicação. A WPAN cobre curtas distâncias (até 10 metros), com tecnologias como Bluetooth e NFC. A WLAN expande a cobertura para ambientes como casas e empresas, com o Wi-Fi como principal exemplo. A WMN (rede mesh) usa nós roteadores fixos que colaboram para retransmitir o sinal, aumentando cobertura e confiabilidade. Já a MANET é formada por dispositivos móveis que se comunicam diretamente, sem infraestrutura fixa, sendo muito usada em operações militares e situações emergenciais.",
  question: "Uma cidade inteligente instala diversos roteadores fixos que colaboram entre si para retransmitir o sinal Wi-Fi por toda a área urbana, aumentando a cobertura e a confiabilidade da rede. Essa estrutura é um exemplo de qual categoria de rede ad hoc?",
  options: [
    "WPAN",
    "WMN (rede mesh)",
    "MANET",
    "WSN"
  ],
  answer: 1,
  feedback: "A WMN (Wireless Mesh Network) é formada por nós roteadores fixos que colaboram para retransmitir o sinal, aumentando a confiabilidade e a cobertura da rede — muito usada em cidades inteligentes, como no exemplo."
},

// 46 - VANET
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Explicativa",
  texto: "A VANET (Vehicular Ad Hoc Network) é uma especialização das MANETs aplicada a veículos, permitindo comunicação entre carros e com a infraestrutura viária, como semáforos e sensores de trânsito. As VANET Inteligentes evoluem com o uso de Inteligência Artificial e IoT, buscando maior segurança e eficiência no tráfego urbano.",
  question: "Um veículo autônomo troca informações em tempo real com semáforos inteligentes e com outros carros próximos para evitar colisões e otimizar o fluxo do tráfego, sem depender de uma infraestrutura de rede fixa centralizada. Esse tipo de comunicação é um exemplo de qual tecnologia?",
  options: [
    "WPAN",
    "VANET",
    "WMAN",
    "WSN"
  ],
  answer: 1,
  feedback: "A VANET é a especialização das MANETs voltada para veículos, permitindo comunicação entre carros e com a infraestrutura viária, característica central do cenário descrito."
},

// 47 - Gerenciamento de mobilidade em redes ad hoc
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Explicativa",
  texto: "Nas redes ad hoc, o gerenciamento de mobilidade é essencial, pois os nós mudam constantemente de posição. A rede utiliza protocolos de roteamento dinâmico, como AODV e DSR, que reconstroem rotas sempre que a topologia muda. Esse gerenciamento se apoia em dois processos: a atualização de localização, em que cada nó informa periodicamente sua posição, e o handoff/handover, que realiza a troca suave de rota quando um nó sai da área de cobertura de outro.",
  question: "Em uma rede ad hoc formada por drones em movimento constante, a topologia da rede muda a todo momento conforme os drones se deslocam. Que tipo de protocolo é utilizado para reconstruir as rotas de comunicação automaticamente diante dessas mudanças?",
  options: [
    "Protocolos de multiplexação óptica",
    "Protocolos de roteamento dinâmico, como AODV e DSR",
    "Protocolos de controle de acesso ao meio, como CSMA/CD",
    "Protocolos de criptografia simétrica"
  ],
  answer: 1,
  feedback: "Protocolos de roteamento dinâmico, como AODV e DSR, são utilizados em redes ad hoc para reconstruir as rotas automaticamente sempre que a topologia da rede muda devido à mobilidade dos nós."
},

// 48 - Gerenciamento da confiança
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Aplicação",
  texto: "Nas redes ad hoc, como não há uma estrutura central, o gerenciamento da confiança usa mecanismos de reputação: cada nó observa o comportamento dos demais, e um nó que encaminha corretamente os pacotes ganha confiança, enquanto um nó que atrapalha ou omite transmissões perde reputação. Isso fortalece a resiliência da rede mesmo diante de ataques.",
  question: "Em uma rede ad hoc, um determinado nó frequentemente descarta pacotes que deveria retransmitir para outros nós, prejudicando a comunicação da rede. Segundo o mecanismo de gerenciamento da confiança, o que tende a acontecer com a reputação desse nó?",
  options: [
    "A reputação aumenta, pois ele está economizando energia",
    "A reputação diminui, pois ele atrapalha ou omite transmissões",
    "A reputação permanece igual, pois não há mecanismo de reputação em redes ad hoc",
    "O nó é automaticamente promovido a coordenador da rede"
  ],
  answer: 1,
  feedback: "No gerenciamento da confiança, um nó que atrapalha ou omite transmissões perde reputação perante os demais, o que ajuda a rede a identificar e isolar comportamentos maliciosos ou falhos."
},

// 49 - Gerenciamento da escalabilidade
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Explicativa",
  texto: "À medida que o número de nós de uma rede ad hoc aumenta, é preciso evitar sobrecarga de sinal e perda de desempenho. Para isso, o gerenciamento da escalabilidade aplica a clusterização, que divide a rede em pequenos grupos com líderes responsáveis pela coordenação, e a hierarquia de controle, que reduz o tráfego global e facilita a tomada de decisão local.",
  question: "Uma rede ad hoc com centenas de nós é dividida em pequenos grupos, cada um com um líder responsável por coordenar a comunicação dentro do grupo, reduzindo o tráfego global da rede. Essa estratégia é chamada de quê?",
  options: [
    "Handoff",
    "Clusterização",
    "Paging",
    "Roaming"
  ],
  answer: 1,
  feedback: "A clusterização divide a rede em pequenos grupos com líderes responsáveis pela coordenação, sendo uma das estratégias do gerenciamento da escalabilidade para manter a eficiência mesmo com muitos nós conectados."
},

// 50 - WiMAX e substituição pelo 4G
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Contextualizada",
  texto: "O WiMAX foi um exemplo clássico de WMAN, projetado para prover acesso de banda larga sem fio em larga escala, cobrindo de 6 a 9 km. Apesar de ter sido uma alternativa promissora para conexão de banda larga, o WiMAX foi amplamente substituído pelo 4G LTE em aplicações comerciais, que se tornou o padrão da tecnologia móvel na época.",
  question: "Uma tecnologia projetada para oferecer banda larga sem fio em larga escala, cobrindo de 6 a 9 km, foi amplamente substituída por outra tecnologia que se tornou o padrão comercial de conectividade móvel. Qual tecnologia substituiu o WiMAX nesse cenário?",
  options: [
    "3G",
    "Bluetooth",
    "4G LTE",
    "ZigBee"
  ],
  answer: 2,
  feedback: "Apesar de promissor, o WiMAX foi amplamente substituído pelo 4G LTE em aplicações comerciais, que se tornou o padrão da tecnologia móvel na época."
},
// 51 - Vulnerabilidade x Ameaça x Ataque
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Explicativa",
  texto: "Na segurança de redes, três conceitos costumam ser confundidos. A ==def==vulnerabilidade== é uma fraqueza existente no sistema, como um software desatualizado. A ameaça é algo ou alguém capaz de explorar essa fraqueza, como um vírus conhecido. Já o ataque é o momento em que a ameaça se concretiza, explorando de fato a vulnerabilidade — por exemplo, quando o vírus efetivamente infecta o sistema.",
  question: "Uma empresa mantém um servidor com um sistema operacional desatualizado, mas nenhum incidente ocorreu até o momento. Essa falha no software desatualizado representa qual dos três conceitos?",
  options: [
    "Uma ameaça",
    "Um ataque",
    "Uma vulnerabilidade",
    "Um ataque de força bruta"
  ],
  answer: 2,
  feedback: "O software desatualizado, por si só, é uma vulnerabilidade — uma fraqueza que existe no sistema. Ela só se torna ataque quando alguma ameaça a explora de fato."
},

// 52 - Phishing e engenharia social
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Aplicação",
  texto: "Ataques de engenharia social manipulam pessoas para obter informações sensíveis, explorando a confiança das vítimas. O phishing é uma técnica específica de engenharia social em que o atacante se passa por uma entidade confiável, como um banco, para enganar a vítima e obter dados como senhas e informações bancárias.",
  question: "Um usuário recebe um e-mail que aparenta ser do seu banco, pedindo para clicar em um link e confirmar seus dados de acesso à conta. Esse ataque é um exemplo clássico de qual técnica?",
  options: [
    "SQL Injection",
    "Phishing",
    "Ataque de força bruta",
    "DDoS"
  ],
  answer: 1,
  feedback: "O phishing consiste justamente em o atacante se passar por uma entidade confiável, como um banco, para enganar a vítima e obter informações sensíveis, como senhas e dados bancários."
},

// 53 - Criptografia simétrica x assimétrica
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Contextualizada",
  texto: "Existem duas categorias principais de criptografia. Na criptografia simétrica, uma única chave é usada tanto para cifrar quanto para decifrar os dados, e tanto remetente quanto destinatário precisam conhecer essa chave secreta — exemplo: o AES. Na criptografia assimétrica, usa-se um par de chaves: a pública, que pode ser compartilhada e serve para cifrar, e a privada, mantida em segredo, que serve para decifrar — exemplo: o RSA.",
  question: "Um site permite que qualquer visitante envie uma mensagem cifrada usando uma chave amplamente divulgada, mas apenas o dono do site, que guarda a chave correspondente em sigilo, consegue decifrar essas mensagens. Esse funcionamento é característico de qual tipo de criptografia?",
  options: [
    "Criptografia simétrica, como o AES",
    "Criptografia assimétrica, como o RSA",
    "Função hash, como o SHA-256",
    "Criptografia de fluxo, como o RC4"
  ],
  answer: 1,
  feedback: "O uso de uma chave pública, compartilhada livremente para cifrar, e de uma chave privada, mantida em sigilo para decifrar, é característico da criptografia assimétrica, como no algoritmo RSA."
},

// 54 - Função hash
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Explicativa",
  texto: "Uma função hash transforma qualquer entrada (mensagem, arquivo, senha) em uma sequência fixa de bits, chamada resumo. Ela é irreversível — não é possível obter a entrada original a partir do hash — e pequenas mudanças na entrada causam grandes mudanças no resultado. Além disso, é extremamente difícil encontrar duas entradas diferentes que gerem o mesmo hash, fenômeno chamado de colisão.",
  question: "Ao alterar apenas uma letra em um documento antes de gerar seu hash com SHA-256, o resultado obtido é completamente diferente do hash original, mesmo que o restante do texto permaneça idêntico. Essa característica das funções hash é chamada de quê?",
  options: [
    "Irreversibilidade",
    "Colisão",
    "Efeito avalanche (pequenas mudanças causam grandes mudanças no hash)",
    "Assinatura digital"
  ],
  answer: 2,
  feedback: "A característica de que pequenas alterações na entrada causam grandes mudanças no hash resultante é fundamental para funções hash, e ajuda a detectar até a menor modificação em um arquivo ou mensagem."
},

// 55 - Assinatura digital
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Aplicação",
  texto: "Uma assinatura digital garante autenticidade, integridade e não repúdio. O remetente aplica uma função hash à mensagem, criptografa esse hash com sua chave privada (gerando a assinatura) e envia mensagem e assinatura ao destinatário. O destinatário calcula o hash da mensagem recebida e o compara com o hash obtido ao decifrar a assinatura usando a chave pública do remetente. Se os dois hashes coincidirem, a mensagem é autêntica e íntegra.",
  question: "Ao verificar um documento assinado digitalmente, o destinatário calcula o hash da mensagem recebida e o compara com o hash obtido ao decifrar a assinatura com a chave pública do remetente. Os dois valores não coincidem. O que isso indica?",
  options: [
    "A mensagem é autêntica e não foi alterada",
    "A mensagem foi alterada ou a assinatura é falsa",
    "A chave pública do remetente está incorreta apenas por formatação",
    "A função hash utilizada não é compatível com assinaturas"
  ],
  answer: 1,
  feedback: "Quando os hashes não coincidem, isso indica que a mensagem foi alterada em algum ponto do caminho ou que a assinatura digital é falsa, comprometendo a integridade ou a autenticidade dos dados."
},

// 56 - Autenticação multifator
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Contextualizada",
  texto: "Os métodos de autenticação se baseiam em três tipos de fatores: algo que o usuário sabe (senha, PIN), algo que ele possui (token, celular) e algo que ele é (biometria). A Autenticação Multifator (MFA) combina dois ou mais desses fatores para aumentar a segurança, reduzindo drasticamente o risco de acesso não autorizado, mesmo que um dos fatores seja comprometido.",
  question: "Um sistema exige que o usuário digite sua senha e, em seguida, confirme um código temporário enviado por um aplicativo autenticador no celular. Esse mecanismo combina quais dois fatores de autenticação?",
  options: [
    "Dois fatores de posse (token e celular)",
    "Algo que o usuário sabe (senha) e algo que ele possui (código do aplicativo)",
    "Dois fatores de conhecimento (senha e PIN)",
    "Biometria e conhecimento"
  ],
  answer: 1,
  feedback: "O sistema combina o fator conhecimento (a senha, que o usuário sabe) com o fator posse (o código gerado no aplicativo do celular, algo que o usuário possui), caracterizando a Autenticação Multifator."
},

// 57 - Firewall
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Explicativa",
  texto: "Um firewall atua como uma barreira entre uma rede confiável (interna) e uma rede não confiável (externa, como a Internet). Ele analisa os cabeçalhos dos pacotes — endereço IP, porta de origem/destino e protocolo — e verifica se cada pacote atende às regras configuradas pelo administrador, decidindo se ele será permitido, bloqueado ou redirecionado.",
  question: "Um administrador de rede configura regras para que pacotes vindos de determinados endereços IP sejam automaticamente rejeitados antes de chegar aos computadores da empresa. Qual equipamento de segurança é responsável por aplicar esse tipo de controle?",
  options: [
    "VPN",
    "Firewall",
    "Servidor DNS",
    "Assinatura digital"
  ],
  answer: 1,
  feedback: "O firewall é responsável por analisar os cabeçalhos dos pacotes e aplicar regras definidas pelo administrador, decidindo se cada pacote será permitido, bloqueado ou redirecionado."
},

// 58 - Firewall de software x hardware
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Contextualizada",
  texto: "Existem dois tipos principais de firewall. O firewall de software é instalado em cada computador ou servidor individualmente, protegendo apenas aquele dispositivo, com custo geralmente baixo, mas podendo afetar o desempenho da máquina. Já o firewall de hardware é um equipamento dedicado que protege toda a rede de uma vez, tem manutenção centralizada e alto desempenho, mas com custo de implantação maior.",
  question: "Uma empresa deseja proteger toda a sua rede corporativa de uma só vez, com manutenção centralizada e sem depender da instalação individual em cada computador, mesmo que isso implique um investimento inicial maior. Qual tipo de firewall atende melhor a essa necessidade?",
  options: [
    "Firewall de software instalado em cada máquina",
    "Firewall de hardware, dedicado e centralizado",
    "Antivírus com módulo de firewall integrado",
    "Nenhum firewall, apenas VPN"
  ],
  answer: 1,
  feedback: "O firewall de hardware protege toda a rede de uma vez, com manutenção centralizada e alto desempenho, sendo mais adequado quando se deseja evitar a instalação individual em cada dispositivo, apesar do custo mais elevado."
},

// 59 - VPN
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Aplicação",
  texto: "Uma VPN cria uma conexão segura e criptografada entre dois pontos de uma rede pública, como a Internet, formando um túnel seguro. Ela garante confidencialidade (dados criptografados), integridade (informações não alteradas durante o envio) e autenticidade (confirmação da identidade das partes envolvidas), protegendo os dados contra interceptações e acessos não autorizados.",
  question: "Um funcionário em home office precisa acessar os sistemas internos da empresa pela Internet, com a garantia de que os dados trafeguem de forma criptografada e protegida contra interceptações, como se estivesse fisicamente na rede local da empresa. Qual tecnologia atende a essa necessidade?",
  options: [
    "Firewall de hardware",
    "VPN",
    "Função hash",
    "Ataque de força bruta"
  ],
  answer: 1,
  feedback: "A VPN cria um túnel seguro e criptografado entre o usuário e a rede de destino pela Internet, permitindo que ele acesse os recursos internos como se estivesse fisicamente conectado à rede local, com confidencialidade e integridade dos dados."
},

// 60 - SSL/TLS, IPSec e SSH
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Contextualizada",
  texto: "Existem diferentes protocolos seguros que atuam em camadas distintas do modelo OSI. O SSL/TLS protege comunicações web (HTTPS), atuando na camada de Transporte e utilizando certificados digitais para autenticar sites. O IPSec protege pacotes IP diretamente na camada de Rede, sendo muito usado em VPNs corporativas. Já o SSH permite acesso remoto criptografado a servidores, atuando na camada de Aplicação e substituindo protocolos antigos e inseguros como o Telnet.",
  question: "Um administrador de sistemas precisa acessar remotamente um servidor Linux para executar comandos, de forma criptografada, substituindo o antigo protocolo Telnet que transmitia dados em texto simples. Qual protocolo ele deve utilizar?",
  options: [
    "SSL/TLS",
    "IPSec",
    "SSH",
    "HTTP"
  ],
  answer: 2,
  feedback: "O SSH foi criado justamente para substituir métodos antigos como o Telnet, oferecendo acesso remoto criptografado a servidores e dispositivos de rede, incluindo execução remota de comandos."
},

  ],


  enade: [
    // 1 - Modelo OSI x TCP/IP
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Asserção + Justificativa",
  texto: "Um professor de Redes de Computadores II pede que os alunos comparem os dois principais modelos de referência estudados na disciplina, discutindo tanto a quantidade de camadas quanto a forma como cada um organiza as responsabilidades da comunicação.",
  question: "Considere as afirmações a seguir sobre o ==term==modelo OSI== e o modelo TCP/IP.",
  assertions: [
    "I. O modelo OSI possui sete camadas e é utilizado principalmente com finalidade didática, sendo pouco aplicado diretamente na prática.",
    "PORQUE II. No modelo TCP/IP, as funções das camadas de Aplicação, Apresentação e Sessão do OSI são agrupadas em uma única camada de Aplicação."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 1,
  feedback: "Ambas as afirmativas são corretas, mas não há relação de causa e consequência entre elas: o fato de o **OSI ser didático** decorre de sua granularidade conceitual, enquanto o agrupamento das camadas no TCP/IP é uma característica independente relacionada à simplificação prática do modelo, e não uma justificativa para a primeira afirmação."
},

// 2 - Encapsulamento de dados
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma equipe de suporte técnico está treinando novos analistas para entender o caminho percorrido por um dado desde a aplicação de origem até o dispositivo de destino em uma rede TCP/IP.",
  question: "Sobre o processo de encapsulamento e desencapsulamento, avalie as afirmativas a seguir.",
  assertions: [
    "I. Na camada de Transporte, os dados são organizados em segmentos, quando o protocolo utilizado é o ==proc==TCP==, ou em datagramas, quando o protocolo é o UDP.",
    "II. Na camada de Rede/Internet, são adicionados os endereços físicos MAC de origem e destino.",
    "III. Na camada de Enlace, os pacotes são transformados em quadros, recebendo informações relacionadas ao controle de erros.",
    "IV. No dispositivo receptor, o processo ocorre na ordem inversa do emissor, iniciando pela camada Física e finalizando na camada de Aplicação."
  ],
  options: [
    "I, III e IV, apenas",
    "I e III, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa II está incorreta porque os **endereços MAC** são adicionados na camada de Enlace, e não na camada de Rede/Internet, que é responsável pelos endereços IP de origem e destino. As demais afirmativas descrevem corretamente as etapas do encapsulamento e do desencapsulamento."
},

// 3 - Cliente-servidor x P2P
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Conceitual Contextualizada",
  texto: "Uma pequena empresa de contabilidade está decidindo como organizar o compartilhamento de arquivos entre seus cinco computadores. O responsável de TI avalia duas opções: manter um servidor central dedicado ao armazenamento dos arquivos ou permitir que os próprios computadores compartilhem arquivos diretamente entre si, sem um equipamento especializado.",
  question: "Considerando as características dos modelos de rede estudados, qual das alternativas descreve corretamente uma diferença entre essas duas abordagens?",
  options: [
    "No modelo cliente-servidor, a administração é centralizada e o servidor concentra as solicitações, exigindo maior investimento em hardware e software; no modelo P2P, a administração é descentralizada e todos os dispositivos podem fornecer e consumir serviços.",
    "No modelo cliente-servidor, todos os dispositivos possuem papéis semelhantes e podem fornecer e consumir serviços simultaneamente, o que reduz o custo de infraestrutura em comparação ao P2P.",
    "No modelo P2P, existe sempre um dispositivo especializado responsável por processar e responder todas as solicitações da rede, semelhante ao papel do servidor.",
    "A principal vantagem do modelo P2P é a facilidade de gerenciamento centralizado, o que o torna preferível em ambientes corporativos de grande porte."
  ],
  answer: 0,
  feedback: "O **modelo cliente-servidor** é caracterizado pela administração centralizada, na qual o servidor concentra as solicitações e por isso demanda maior investimento em desempenho e disponibilidade. Já o modelo P2P é descentralizado, com dispositivos que fornecem e consomem serviços ao mesmo tempo, o que facilita a instalação, mas dificulta o gerenciamento e a segurança."
},

// 4 - Endereçamento IPv4
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Análise Aplicada",
  texto: "Um técnico de redes está configurando o endereçamento dos dispositivos de uma empresa recém-instalada. Ele precisa explicar a um estagiário como funciona a estrutura do endereço atribuído a cada computador da rede local.",
  question: "O estagiário recebeu o endereço 192.168.10.1 atribuído a um computador da empresa. Com base na estrutura do endereçamento IPv4 apresentada na disciplina, qual afirmação está correta sobre esse endereço?",
  options: [
    "O endereço é representado em hexadecimal e possui 128 bits, divididos em oito grupos separados por dois-pontos.",
    "O endereço possui 32 bits, representados por quatro octetos em decimal separados por pontos, sendo composto por uma parte de rede e uma parte de host.",
    "O endereço pertence exclusivamente ao padrão IPv6, criado para substituir o IPv4 devido à escassez de endereços.",
    "O endereço não pode identificar de forma alguma a rede à qual o dispositivo pertence, servindo apenas para identificar o host individualmente."
  ],
  answer: 1,
  feedback: "O endereço apresentado segue o padrão **IPv4**, composto por 32 bits representados em quatro octetos decimais separados por pontos. Esse endereço possui uma parte que identifica a rede e outra que identifica o host dentro dela, diferentemente do IPv6, que usa 128 bits em notação hexadecimal."
},

// 5 - Serviço de nomes DNS
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Asserção + Justificativa",
  texto: "Ao explicar por que os usuários digitam nomes de sites em vez de números para acessar páginas na Internet, um instrutor de redes apresenta o funcionamento do serviço de nomes utilizado globalmente.",
  question: "Avalie as afirmações a seguir sobre o serviço de nomes na Internet.",
  assertions: [
    "I. O ==def==DNS== permite que os usuários utilizem nomes de fácil memorização em vez de endereços numéricos para acessar serviços de rede.",
    "PORQUE II. Mesmo que o endereço IP de um servidor seja alterado, o nome associado a ele pode continuar sendo utilizado pelos usuários."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "Ambas as afirmativas estão corretas, e a segunda justifica a primeira: a utilidade do **DNS** está justamente em desacoplar o nome amigável do endereço numérico, permitindo que o endereço IP mude sem que o usuário precise memorizar um novo identificador."
},

// 6 - Topologias de rede
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Múltiplas Afirmativas",
  texto: "Durante uma visita técnica, um analista de infraestrutura precisa identificar corretamente as topologias físicas utilizadas em diferentes setores de uma empresa, com base na forma como os dispositivos estão organizados e conectados.",
  question: "Sobre as topologias de rede apresentadas na disciplina, avalie as afirmativas a seguir.",
  assertions: [
    "I. Na topologia em estrela, os dispositivos estão conectados a um ponto central, por onde passa a comunicação entre eles.",
    "II. Na topologia em malha, existem múltiplas conexões entre os dispositivos, criando diferentes caminhos possíveis para os dados.",
    "III. Na topologia em barramento, os dispositivos compartilham um único meio de transmissão principal ao qual estão conectados.",
    "IV. Na topologia em anel, os dispositivos são organizados de forma hierárquica, semelhante aos galhos de uma árvore."
  ],
  options: [
    "I, II e III, apenas",
    "I e III, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa IV está incorreta porque a organização hierárquica, semelhante a galhos de uma árvore, descreve a **topologia em árvore**, e não a topologia em anel, na qual os dispositivos formam uma estrutura fechada conectada em sequência circular."
},

// 7 - LAN, MAN e WAN
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Conceitual Contextualizada",
  texto: "Uma empresa de tecnologia possui três cenários de conectividade: a rede interna de um único escritório, a interligação de várias filiais espalhadas por diferentes bairros de uma mesma cidade e a conexão entre a matriz no Brasil e uma filial localizada em outro país.",
  question: "Considerando as classificações de redes quanto à abrangência geográfica estudadas na disciplina, qual alternativa associa corretamente cada cenário ao seu tipo de rede?",
  options: [
    "A rede do escritório é uma LAN, a interligação das filiais na mesma cidade é uma MAN e a conexão entre países é uma WAN.",
    "A rede do escritório é uma WAN, a interligação das filiais na mesma cidade é uma LAN e a conexão entre países é uma MAN.",
    "Todos os três cenários descritos correspondem a uma mesma classificação, chamada de MAN, independentemente da distância envolvida.",
    "A rede do escritório é uma MAN, a interligação das filiais na mesma cidade é uma WAN e a conexão entre países é uma LAN."
  ],
  answer: 0,
  feedback: "A **LAN** corresponde a redes de área local, como a de um único escritório; a **MAN** abrange uma área metropolitana, como a interligação de filiais em uma mesma cidade; e a WAN cobre áreas amplas, conectando redes em diferentes regiões ou países."
},

// 8 - Hosts x dispositivos de interconexão
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Análise Aplicada",
  texto: "Ao montar a infraestrutura de uma nova filial, um técnico separa os equipamentos recebidos em duas categorias antes de iniciar a instalação: aqueles que efetivamente utilizam a rede para enviar, receber e processar dados, e aqueles que têm a função de conectar os demais dispositivos e organizar o caminho percorrido pelos dados.",
  question: "Entre os equipamentos listados a seguir, qual conjunto é composto exclusivamente por dispositivos de interconexão, e não por hosts?",
  options: [
    "Switch, roteador e access point.",
    "Notebook, servidor de arquivos e impressora de rede.",
    "Smartphone, dispositivo IoT e computador desktop.",
    "Servidor, roteador e notebook."
  ],
  answer: 0,
  feedback: "Switches, roteadores e access points são classificados como **dispositivos de interconexão**, pois sua função é conectar os equipamentos e organizar o caminho dos dados, diferentemente dos hosts, como notebooks, servidores e smartphones, que efetivamente utilizam a rede para enviar, receber e processar informações."
},

// 9 - Meios de transmissão
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Asserção + Justificativa",
  texto: "Um engenheiro de redes está planejando a infraestrutura física de um novo prédio comercial, avaliando quais tipos de meio de transmissão utilizar em diferentes trechos da instalação, alguns dentro do prédio e outros para conectar áreas externas.",
  question: "Avalie as afirmações a seguir sobre os meios de transmissão utilizados em redes de computadores.",
  assertions: [
    "I. Os meios guiados, como o par trançado, o cabo coaxial e a fibra óptica, utilizam um ==term==meio físico== para transportar os sinais entre os dispositivos.",
    "PORQUE II. As ondas de rádio, as micro-ondas e o infravermelho são classificados como meios guiados, pois necessitam de um cabo físico para realizar a transmissão dos dados."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 2,
  feedback: "A primeira afirmativa está correta, pois os meios guiados realmente utilizam um meio físico para transportar sinais. Já a segunda é falsa, pois ondas de rádio, micro-ondas e infravermelho são classificados como **meios não guiados**, já que não dependem de um cabo físico entre os pontos de comunicação."
},

// 10 - Protocolos de serviços de rede
{
  aula: "Aula 1 — Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Múltiplas Afirmativas",
  texto: "Ao configurar os serviços de rede de uma empresa, um administrador precisa garantir que os protocolos corretos estejam habilitados para cada tipo de comunicação utilizada pelos funcionários, incluindo navegação, envio de mensagens e transferência de documentos.",
  question: "Sobre os protocolos e serviços de rede apresentados na disciplina, avalie as afirmativas a seguir.",
  assertions: [
    "I. O ==proc==HTTP== é o principal protocolo associado ao serviço Web, permitindo o acesso a páginas compostas por textos, imagens, áudio e vídeo.",
    "II. O FTP é o protocolo indicado para a transferência de arquivos, sendo utilizado tanto para download quanto para upload.",
    "III. O SMTP, o POP e o IMAP estão relacionados ao serviço de correio eletrônico, permitindo o envio e o recebimento de mensagens digitais.",
    "IV. O DNS é o protocolo responsável por dividir grandes arquivos em pacotes menores antes de serem transmitidos pela rede."
  ],
  options: [
    "I, II e III, apenas",
    "I e III, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa IV está incorreta, pois o **DNS** é o serviço responsável por traduzir nomes em endereços numéricos, e não por dividir arquivos em pacotes. As afirmativas I, II e III descrevem corretamente os protocolos associados aos serviços Web, de transferência de arquivos e de correio eletrônico."
},
// 11 - Nyquist x Shannon
{
  aula: "Aula 2 — Camadas físicas e de enlace",
  tipo: "Asserção + Justificativa",
  texto: "Um engenheiro de telecomunicações precisa calcular a taxa máxima de transmissão de dois enlaces diferentes: um laboratório de testes isolado, sem interferências externas, e um enlace real de campo, sujeito a ruído ambiental.",
  question: "Avalie as afirmações a seguir sobre os limites teóricos da taxa de dados estudados na disciplina.",
  assertions: [
    "I. O ==rule==Teorema de Nyquist== aplica-se a canais ideais, sem ruído, relacionando a taxa máxima de dados com a largura de banda e o número de níveis do sinal.",
    "PORQUE II. O Teorema de Shannon aplica-se a canais reais, com ruído, relacionando a capacidade máxima do canal com a largura de banda e a relação sinal-ruído."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 1,
  feedback: "Ambas as afirmativas estão corretas, mas descrevem dois teoremas independentes, aplicáveis a cenários distintos: o **Nyquist** trata de canais ideais sem ruído, enquanto o Shannon trata de canais reais com ruído. A segunda não é uma justificativa para a primeira, apenas uma informação complementar sobre outro teorema."
},

// 12 - Funções da camada de Enlace
{
  aula: "Aula 2 — Camadas físicas e de enlace",
  tipo: "Múltiplas Afirmativas",
  texto: "Um analista de redes está documentando as responsabilidades da camada de Enlace em um novo manual técnico da empresa, detalhando cada uma das funções que essa camada desempenha ao processar os dados recebidos da camada de Rede.",
  question: "Sobre as funções da camada de Enlace, avalie as afirmativas a seguir.",
  assertions: [
    "I. O ==proc==framing== divide o fluxo de bits recebido da camada de Rede em unidades gerenciáveis chamadas frames.",
    "II. O endereçamento consiste em adicionar ao frame um cabeçalho contendo os endereços do emissor e do receptor.",
    "III. O controle de fluxo tem como objetivo evitar que o receptor seja sobrecarregado por dados enviados em velocidade maior do que ele consegue processar.",
    "IV. O controle de acesso ao meio é responsável por adicionar bits redundantes que permitem corrigir erros sem necessidade de retransmissão."
  ],
  options: [
    "I, II e III, apenas",
    "I e III, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa IV está incorreta, pois adicionar bits redundantes para corrigir erros sem retransmissão descreve o **FEC**, e não o controle de acesso ao meio, que é responsável por determinar qual dispositivo utiliza o meio compartilhado em cada momento."
},

// 13 - Sinais analógicos x digitais
{
  aula: "Aula 2 — Camadas físicas e de enlace",
  tipo: "Conceitual Contextualizada",
  texto: "Uma fabricante de equipamentos de telecomunicações está desenvolvendo um novo transceptor e precisa decidir se o sinal transportado internamente pelo dispositivo será representado por uma variação contínua de intensidade ou por um número limitado de valores discretos, normalmente 0 e 1.",
  question: "Com base nas características dos sinais estudadas na disciplina, qual alternativa descreve corretamente a diferença entre sinal analógico e sinal digital?",
  options: [
    "O sinal digital possui infinitos níveis possíveis e variação contínua, enquanto o sinal analógico possui número limitado de valores e variação discreta.",
    "Tanto o sinal analógico quanto o sinal digital possuem sempre a mesma quantidade de níveis possíveis, diferindo apenas na forma como são transmitidos pelo meio físico.",
    "O sinal analógico possui variação contínua e infinitos níveis de intensidade, enquanto o sinal digital possui variação discreta e número limitado de valores.",
    "O sinal digital é utilizado exclusivamente em transmissões de longa distância, enquanto o sinal analógico é utilizado apenas em redes locais de curto alcance."
  ],
  answer: 2,
  feedback: "O **sinal analógico** varia de forma contínua, podendo assumir infinitos valores de intensidade ao longo do tempo, enquanto o sinal digital varia de forma discreta, assumindo um número limitado de valores, normalmente representados por 0 e 1."
},

// 14 - Cálculo do tempo de transmissão
{
  aula: "Aula 2 — Camadas físicas e de enlace",
  tipo: "Análise Aplicada",
  texto: "Um administrador de redes precisa estimar quanto tempo um enlace levará para colocar uma mensagem completa no meio de transmissão, antes mesmo de considerar o tempo de propagação até o destino.",
  question: "Considerando uma mensagem de 2.000.000 bits transmitida por um enlace com largura de banda de 1.000.000 bps, e utilizando a fórmula Tempo de transmissão = Tamanho da mensagem / Largura de banda, qual é o tempo de transmissão desse enlace?",
  options: [
    "0,5 segundo",
    "1 segundo",
    "4 segundos",
    "2 segundos"
  ],
  answer: 3,
  feedback: "Aplicando a fórmula do **tempo de transmissão**, obtém-se 2.000.000 / 1.000.000 = 2 segundos, ou seja, o tempo necessário para o transmissor colocar todos os bits da mensagem no meio, sem considerar o tempo de propagação até o destino."
},

// 15 - Go-Back-N x Selective Repeat
{
  aula: "Aula 2 — Camadas físicas e de enlace",
  tipo: "Asserção + Justificativa",
  texto: "Uma equipe de desenvolvimento de protocolos de rede está comparando dois mecanismos de janela deslizante utilizados para controle de erros em canais com ruído, avaliando o comportamento de cada um diante da detecção de um frame corrompido.",
  question: "Avalie as afirmações a seguir sobre os protocolos de janela deslizante estudados na disciplina.",
  assertions: [
    "I. No ==proc==Go-Back-N ARQ==, quando o receptor detecta erro em um frame, ele descarta esse frame e também os frames seguintes, mesmo que tenham chegado corretamente.",
    "PORQUE II. No Selective Repeat ARQ, apenas os frames perdidos ou corrompidos são retransmitidos, sem necessidade de descartar os frames recebidos corretamente."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 1,
  feedback: "As duas afirmativas são verdadeiras, mas descrevem o comportamento de **protocolos diferentes**: a primeira trata do Go-Back-N, e a segunda, do Selective Repeat. Por serem informações independentes sobre mecanismos distintos, a segunda não justifica a primeira."
},

// 16 - Técnicas de detecção e correção de erros
{
  aula: "Aula 2 — Camadas físicas e de enlace",
  tipo: "Múltiplas Afirmativas",
  texto: "Ao revisar as técnicas de confiabilidade utilizadas na camada de Enlace, um instrutor solicita que os alunos analisem o funcionamento de diferentes mecanismos empregados para identificar ou corrigir erros ocorridos durante a transmissão.",
  question: "Sobre as técnicas de detecção e correção de erros apresentadas na disciplina, avalie as afirmativas a seguir.",
  assertions: [
    "I. O bit de paridade adiciona um único bit extra à mensagem, tornando a quantidade de bits 1 par ou ímpar, permitindo apenas detectar erros, e não corrigi-los.",
    "II. O checksum divide a mensagem em blocos, soma esses blocos e utiliza aritmética de complemento de 1 para gerar o valor enviado junto com a mensagem.",
    "III. No CRC, se o resto da divisão binária realizada pelo receptor for igual a zero, considera-se que ocorreu um erro na transmissão.",
    "IV. O Código de Hamming posiciona os bits de paridade em posições que são potências de 2 e, em sua versão clássica, é capaz de corrigir um erro de bit."
  ],
  options: [
    "I e III, apenas",
    "II e IV, apenas",
    "I, II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 2,
  feedback: "A afirmativa III está incorreta: no **CRC**, quando o resto da divisão realizada pelo receptor é igual a zero, considera-se que não houve erro na transmissão; um resto diferente de zero é que indica a presença de erro."
},

// 17 - Perdas na transmissão
{
  aula: "Aula 2 — Camadas físicas e de enlace",
  tipo: "Conceitual Contextualizada",
  texto: "Durante a instalação de um cabeamento de longa distância entre dois prédios, um técnico percebe que o sinal recebido na extremidade final apresenta intensidade significativamente menor do que a intensidade original enviada, mesmo sem alterações na forma da onda nem presença perceptível de interferências externas.",
  question: "Qual dos fenômenos estudados na disciplina melhor descreve a situação relatada pelo técnico?",
  options: [
    "Atenuação, que corresponde à perda de energia do sinal durante sua propagação pelo meio de transmissão.",
    "Distorção, que corresponde à alteração da forma original do sinal causada por diferentes velocidades ou atrasos entre suas componentes de frequência.",
    "Ruído, que corresponde a qualquer sinal indesejado que se mistura ao sinal transmitido, corrompendo a informação.",
    "Latência, que corresponde ao tempo total necessário para que uma mensagem inteira chegue ao seu destino."
  ],
  answer: 0,
  feedback: "A situação descrita — redução da intensidade do sinal sem alteração de forma ou presença de interferência — caracteriza a **atenuação**, que representa a perda de energia do sinal durante sua propagação pelo meio de transmissão."
},

// 18 - Cálculo de decibéis
{
  aula: "Aula 2 — Camadas físicas e de enlace",
  tipo: "Análise Aplicada",
  texto: "Um engenheiro de redes mede a potência de um sinal em dois pontos de um enlace para avaliar o desempenho do cabeamento instalado. No ponto de origem, a potência medida é de 20 mW; no ponto de destino, após percorrer o cabo, a potência medida é de 2 mW.",
  question: "Utilizando a fórmula dB = 10·log₁₀(P₂/P₁), qual é o valor aproximado em decibéis dessa variação de potência e o que ele indica sobre o sinal?",
  options: [
    "+10 dB, indicando que houve amplificação do sinal ao longo do enlace.",
    "0 dB, indicando que a potência do sinal permaneceu igual entre os dois pontos.",
    "-10 dB, indicando que houve atenuação do sinal ao longo do enlace.",
    "-20 dB, indicando que houve atenuação do sinal ao longo do enlace."
  ],
  answer: 2,
  feedback: "Calculando 10·log₁₀(2/20) = 10·log₁₀(0,1) = -10 dB. O valor negativo indica **atenuação**, ou seja, houve perda de potência do sinal entre o ponto de origem e o ponto de destino."
},

// 19 - Banda base x banda larga
{
  aula: "Aula 2 — Camadas físicas e de enlace",
  tipo: "Asserção + Justificativa",
  texto: "Uma empresa de telecomunicações está definindo a forma de transmissão a ser utilizada em dois cenários: a rede interna de um escritório, cabeada com Ethernet, e um enlace de longa distância baseado em fibra óptica, compartilhado entre diversos clientes.",
  question: "Avalie as afirmações a seguir sobre as formas de transmissão de sinais digitais estudadas na disciplina.",
  assertions: [
    "I. Na transmissão em ==term==banda base==, o sinal digital é transmitido diretamente, sem conversão para sinal analógico, sendo comum em redes locais como Ethernet.",
    "PORQUE II. Na transmissão em banda larga, o sinal digital é convertido em sinal analógico por meio de modulação, permitindo transmissão em meios compartilhados e a longas distâncias."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 1,
  feedback: "Ambas as afirmativas são corretas, mas descrevem duas formas de transmissão distintas e independentes: a **banda base** é usada diretamente em redes locais, enquanto a banda larga depende de modulação para meios compartilhados. A segunda não justifica a primeira, apenas complementa a comparação."
},

// 20 - Protocolos de controle de fluxo e erro
{
  aula: "Aula 2 — Camadas físicas e de enlace",
  tipo: "Múltiplas Afirmativas",
  texto: "Um pesquisador está comparando o comportamento de diferentes protocolos de controle de fluxo e erro utilizados na camada de Enlace, avaliando como cada um lida com a ausência de confirmações e com a detecção de frames corrompidos.",
  question: "Sobre os protocolos estudados na disciplina, avalie as afirmativas a seguir.",
  assertions: [
    "I. O protocolo mais simples possível, utilizado em canais sem ruído, não possui controle de fluxo nem controle de erros.",
    "II. O ==proc==Stop-and-Wait ARQ== numera os frames e utiliza um timer para detectar a ausência de ACK, retransmitindo o frame quando o tempo expira.",
    "III. O Go-Back-N ARQ permite que o transmissor envie até N frames sem esperar confirmação, retransmitindo a partir do frame em que ocorreu o erro.",
    "IV. O Selective Repeat ARQ, ao detectar um frame corrompido, descarta esse frame juntamente com todos os frames subsequentes já recebidos corretamente."
  ],
  options: [
    "II e IV, apenas",
    "I e III, apenas",
    "I, II e IV, apenas",
    "I, II e III, apenas"
  ],
  answer: 3,
  feedback: "A afirmativa IV está incorreta, pois descartar o frame corrompido junto com os subsequentes já recebidos corretamente é característica do **Go-Back-N ARQ**, e não do Selective Repeat, que retransmite apenas o frame com problema."
},
// 21 - LLC x MAC
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Asserção + Justificativa",
  texto: "Um instrutor de redes está explicando a um grupo de alunos como o Projeto IEEE 802 organizou a camada de Enlace em duas subcamadas distintas, cada uma com responsabilidades específicas dentro da comunicação em redes locais.",
  question: "Avalie as afirmações a seguir sobre a divisão da camada de Enlace proposta pelo Projeto IEEE 802.",
  assertions: [
    "I. A subcamada ==def==LLC== é independente do tipo de tecnologia de LAN utilizada, podendo ser empregada tanto em Ethernet quanto em Wi-Fi.",
    "PORQUE II. A subcamada MAC é específica para cada tecnologia de LAN, sendo responsável pelo acesso ao meio físico e pelo formato dos quadros de cada tecnologia."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 1,
  feedback: "As duas afirmativas estão corretas, mas descrevem características independentes de subcamadas diferentes: a **independência do LLC** em relação à tecnologia não decorre do fato de o MAC ser específico de cada tecnologia; são apenas duas propriedades complementares da divisão proposta pelo IEEE 802."
},

// 22 - CSMA/CD x CSMA/CA
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Múltiplas Afirmativas",
  texto: "Um técnico de suporte está comparando o comportamento de uma rede Ethernet cabeada tradicional com o de uma rede Wi-Fi instalada no mesmo escritório, avaliando como cada uma trata a possibilidade de colisões durante a transmissão de dados.",
  question: "Sobre os mecanismos de acesso ao meio utilizados por Ethernet e Wi-Fi, avalie as afirmativas a seguir.",
  assertions: [
    "I. O ==proc==CSMA/CD== é utilizado pela Ethernet tradicional e detecta colisões depois que elas ocorrem, interrompendo a transmissão e aguardando um tempo aleatório antes de tentar novamente.",
    "II. O CSMA/CA é utilizado pelo Wi-Fi e procura evitar colisões antes que ocorram, já que a estação não consegue detectar uma colisão enquanto transmite.",
    "III. Nas implementações Ethernet de altas velocidades, como 400 e 800 Gb/s, o CSMA/CD continua sendo essencial, pois o meio compartilhado torna as colisões ainda mais frequentes.",
    "IV. Em redes Ethernet operando em modo full-duplex, não ocorrem colisões, pois existem canais separados para envio e recebimento de dados."
  ],
  options: [
    "I, II e IV, apenas",
    "I e II, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa III está incorreta, pois nas implementações Ethernet de altas velocidades não há mais **CSMA/CD**: elas utilizam full-duplex e switching, o que elimina o compartilhamento do meio e, consequentemente, a possibilidade de colisões."
},

// 23 - BSS e ESS no Wi-Fi
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Conceitual Contextualizada",
  texto: "Uma empresa está expandindo sua rede Wi-Fi para cobrir todos os andares de um prédio comercial. Para isso, instala vários Access Points, cada um cobrindo uma área específica, todos conectados a um mesmo sistema de distribuição com fio.",
  question: "Considerando a arquitetura do IEEE 802.11 estudada na disciplina, como essa estrutura formada por vários Access Points interligados por um sistema de distribuição é classificada?",
  options: [
    "Como uma ESS, formada pela interligação de duas ou mais BSSs por meio de um sistema de distribuição, normalmente uma LAN com fio.",
    "Como uma BSS ad hoc, na qual as estações se comunicam diretamente entre si, sem a necessidade de um Access Point centralizando a comunicação.",
    "Como uma Piconet, formada por um dispositivo primário e até sete dispositivos secundários conectados sem fio.",
    "Como uma rede baseada exclusivamente em CSMA/CD, já que todos os Access Points compartilham o mesmo meio de transmissão físico."
  ],
  answer: 0,
  feedback: "A estrutura descrita corresponde a uma **ESS (Extended Service Set)**, formada pela interligação de duas ou mais BSSs, cada uma com seu próprio Access Point, através de um sistema de distribuição, geralmente uma LAN com fio como Ethernet."
},

// 24 - Cálculo de sub-redes
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Análise Aplicada",
  texto: "Uma empresa recebeu a rede 192.168.0.0/24 e precisa dividi-la em 8 sub-redes de tamanhos iguais para separar os diferentes setores administrativos, utilizando bits emprestados da parte originalmente destinada aos hosts.",
  question: "Utilizando a fórmula Quantidade de sub-redes = 2^m, onde m representa o número de bits emprestados da parte de host, quantos bits precisam ser emprestados para obter exatamente 8 sub-redes, e qual seria a nova máscara resultante?",
  options: [
    "2 bits emprestados, resultando na máscara /26.",
    "3 bits emprestados, resultando na máscara /27.",
    "4 bits emprestados, resultando na máscara /28.",
    "1 bit emprestado, resultando na máscara /25."
  ],
  answer: 1,
  feedback: "Como 2³ = 8, são necessários **3 bits** emprestados da parte de host para obter 8 sub-redes. Somando esses 3 bits ao prefixo original /24, chega-se à nova máscara /27, restando 5 bits para identificar os hosts em cada sub-rede."
},

// 25 - Estação oculta x estação exposta
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Asserção + Justificativa",
  texto: "Um pesquisador está estudando dois problemas clássicos de redes sem fio relacionados à percepção do estado do canal por diferentes estações, avaliando como cada situação afeta a eficiência da comunicação.",
  question: "Avalie as afirmações a seguir sobre os problemas de estação oculta e estação exposta no IEEE 802.11.",
  assertions: [
    "I. No problema da ==warn==estação oculta==, duas estações que não conseguem se enxergar diretamente podem transmitir simultaneamente para uma mesma estação de destino, provocando colisão.",
    "PORQUE II. O handshake RTS/CTS resolve completamente tanto o problema da estação oculta quanto o problema da estação exposta, eliminando toda possibilidade de colisão ou uso ineficiente do canal."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 2,
  feedback: "A primeira afirmativa está correta e descreve exatamente o problema da **estação oculta**. A segunda é falsa, pois o material indica que o RTS/CTS é apresentado como solução para a estação oculta, mas não resolve completamente o problema da estação exposta."
},

// 26 - Campos do frame Ethernet
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Múltiplas Afirmativas",
  texto: "Um analista de redes está capturando quadros Ethernet em um enlace corporativo para identificar a função de cada campo presente na estrutura do frame, com o objetivo de diagnosticar um problema de comunicação entre dois servidores.",
  question: "Sobre os campos do frame Ethernet apresentados na disciplina, avalie as afirmativas a seguir.",
  assertions: [
    "I. O campo ==term==Preâmbulo==, de 7 bytes, é utilizado para sincronizar transmissor e receptor, sendo adicionado pela camada física.",
    "II. O campo SFD, de 1 byte, indica o início do frame.",
    "III. O campo CRC/FCS, de 4 bytes, é responsável por definir o endereço MAC de destino da estação que deve receber o quadro.",
    "IV. O campo Dados (Payload) pode variar entre 46 e 1500 bytes, contendo as informações provenientes das camadas superiores."
  ],
  options: [
    "I, II e IV, apenas",
    "I e II, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa III está incorreta, pois o campo **CRC/FCS** é responsável pela verificação de erros no frame, e não pela definição do endereço de destino, que é indicado pelo campo Endereço de destino (DA), de 6 bytes."
},

// 27 - Piconet e Scatternet no Bluetooth
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Conceitual Contextualizada",
  texto: "Um usuário conecta seu smartphone a um fone de ouvido e a um smartwatch via Bluetooth, formando uma pequena rede com um dispositivo primário e dois dispositivos secundários. Ao mesmo tempo, o smartwatch também está conectado a um sensor de frequência cardíaca, atuando como dispositivo primário nessa segunda conexão.",
  question: "Com base na arquitetura Bluetooth estudada na disciplina, como essa estrutura formada pela interconexão das duas redes deve ser classificada?",
  options: [
    "Como uma Scatternet, formada pela interconexão de piconets, em que um dispositivo pode ser primário em uma piconet e secundário em outra.",
    "Como uma única Piconet, já que o número total de dispositivos envolvidos é inferior a 8, respeitando o limite máximo permitido.",
    "Como uma ESS, formada pela interligação de BSSs por meio de um sistema de distribuição com fio, semelhante ao Wi-Fi.",
    "Como uma rede baseada em CSMA/CD, já que todos os dispositivos compartilham o mesmo meio físico sem coordenação centralizada."
  ],
  answer: 0,
  feedback: "A estrutura descrita corresponde a uma **Scatternet**, formada pela interconexão de duas piconets, na qual o smartwatch atua como dispositivo secundário na primeira rede e como dispositivo primário na segunda, conforme apresentado na disciplina."
},

// 28 - Endereçamento MAC e tipos de entrega
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Análise Aplicada",
  texto: "Um administrador de redes configura um servidor para enviar uma mesma atualização de sistema simultaneamente para um grupo específico de dez computadores de um total de cem máquinas presentes na rede local, sem que os demais noventa dispositivos recebam essa transmissão.",
  question: "Considerando os tipos de endereçamento MAC apresentados na disciplina, qual tipo de entrega está sendo utilizado nessa situação?",
  options: [
    "Unicast, pois o pacote é destinado a um único computador da rede, que deve recebê-lo integralmente.",
    "Broadcast, pois o pacote é destinado a todos os computadores da rede, e cada um deve receber uma cópia.",
    "Multicast, pois o pacote é destinado a um subconjunto específico de computadores, e cada um desse grupo recebe uma cópia.",
    "Nenhuma das opções anteriores, pois o endereçamento MAC não é capaz de direcionar pacotes para grupos específicos de dispositivos."
  ],
  answer: 2,
  feedback: "A situação descrita caracteriza uma entrega do tipo **Multicast**, na qual o pacote é direcionado a um subconjunto específico de computadores da rede, e apenas os dispositivos pertencentes a esse grupo recebem uma cópia da transmissão."
},

// 29 - Quantidade de hosts válidos por sub-rede
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Asserção + Justificativa",
  texto: "Ao planejar a divisão de uma rede corporativa em sub-redes menores, um técnico de TI precisa calcular quantos endereços IP estarão disponíveis para os dispositivos finais em cada uma das sub-redes resultantes.",
  question: "Avalie as afirmações a seguir sobre o cálculo de hosts válidos em uma sub-rede.",
  assertions: [
    "I. A fórmula ==rule==Hosts válidos = 2^n − 2==, onde n é o número de bits restantes para hosts, é utilizada para calcular a quantidade de endereços disponíveis para dispositivos em uma sub-rede.",
    "PORQUE II. Dois endereços de cada sub-rede são reservados: um para identificar a própria rede e outro para o endereço de broadcast, não podendo ser atribuídos a dispositivos finais."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "Ambas as afirmativas estão corretas, e a segunda justifica a primeira: a subtração de 2 na fórmula dos **hosts válidos** existe exatamente porque o endereço de rede e o endereço de broadcast são reservados e não podem ser atribuídos a dispositivos finais."
},

// 30 - SCO x ACL no Bluetooth
{
  aula: "Aula 3 — Padrões IEEE e Redes locais (LANs)",
  tipo: "Múltiplas Afirmativas",
  texto: "Um desenvolvedor de aplicações Bluetooth precisa escolher o tipo de enlace adequado para dois cenários diferentes: uma chamada de voz em tempo real entre dois dispositivos e a transferência de um arquivo de fotos entre um smartphone e um notebook.",
  question: "Sobre os enlaces SCO e ACL apresentados na disciplina, avalie as afirmativas a seguir.",
  assertions: [
    "I. O enlace ==term==SCO== é orientado para voz, utiliza slots de tempo predeterminados e é indicado para aplicações que exigem baixa latência, como áudio em tempo real.",
    "II. O enlace ACL é orientado para dados, possui maior taxa de transmissão que o SCO e permite retransmissão de pacotes em caso de erro.",
    "III. A camada L2CAP é utilizada tanto em enlaces SCO quanto em enlaces ACL, sendo responsável pela multiplexação e segmentação dos pacotes em ambos os casos.",
    "IV. Para a transferência do arquivo de fotos, o enlace mais adequado é o ACL, enquanto para a chamada de voz em tempo real, o mais adequado é o SCO."
  ],
  options: [
    "I, II e IV, apenas",
    "I e IV, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa III está incorreta, pois a **L2CAP** é utilizada somente nos enlaces ACL, e não nos enlaces SCO, conforme apresentado na disciplina. As demais afirmativas descrevem corretamente as características e os usos adequados de cada tipo de enlace."
},
// 31 - Metro Ethernet x MPLS
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Asserção + Justificativa",
  texto: "Uma operadora de telecomunicações oferece a duas empresas clientes um serviço de interligação entre suas sedes utilizando conexões Ethernet simples, enquanto internamente transporta o tráfego de milhares de clientes por meio de uma técnica de comutação por rótulos em seu backbone.",
  question: "Avalie as afirmações a seguir sobre a relação entre Metro Ethernet e MPLS em uma MAN.",
  assertions: [
    "I. A ==def==Metro Ethernet== representa o serviço oferecido ao cliente, permitindo conectar duas sedes de forma tão simples quanto plugar um cabo em um switch.",
    "PORQUE II. Internamente, a operadora utiliza o MPLS para encaminhar os dados dentro do seu backbone, garantindo desempenho, escalabilidade, qualidade de serviço e confiabilidade."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "Ambas as afirmativas são verdadeiras e a segunda justifica a primeira: a simplicidade percebida pelo cliente na **Metro Ethernet** só é possível porque a complexidade do transporte de milhares de clientes é resolvida internamente pelo MPLS, que garante desempenho e confiabilidade no backbone da operadora."
},

// 32 - Funcionamento do MPLS
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Múltiplas Afirmativas",
  texto: "Um engenheiro de redes está estudando o funcionamento do MPLS em uma MAN Ethernet, analisando como um quadro enviado por um computador em uma filial chega até outro dispositivo localizado em uma sede distante, passando por diversos roteadores da operadora.",
  question: "Sobre o funcionamento do MPLS apresentado na disciplina, avalie as afirmativas a seguir.",
  assertions: [
    "I. O primeiro roteador MPLS adiciona um ==proc==Label== ao pacote, que identifica o caminho a ser seguido dentro da rede da operadora.",
    "II. Durante o percurso, os roteadores intermediários da rede MPLS analisam detalhadamente o endereço IP de destino do pacote antes de encaminhá-lo.",
    "III. O processo de substituição do rótulo por outro ao longo do caminho é conhecido como Label Swapping.",
    "IV. Ao chegar ao último roteador da rede MPLS, o Label é removido, e o quadro Ethernet é entregue normalmente à rede de destino."
  ],
  options: [
    "I, III e IV, apenas",
    "I e III, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa II está incorreta, pois no **MPLS** os roteadores intermediários não precisam analisar o endereço IP do pacote; eles observam apenas o Label, o que torna o encaminhamento mais rápido e eficiente."
},

// 33 - LAN, MAN e WAN
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Conceitual Contextualizada",
  texto: "Uma empresa possui três necessidades de conectividade distintas: interligar os computadores de um mesmo andar de seu escritório, conectar suas três filiais localizadas em diferentes bairros da mesma cidade, e comunicar-se com uma unidade parceira situada em outro país.",
  question: "Considerando a posição das MANs na hierarquia de redes apresentada na disciplina, qual alternativa descreve corretamente a abrangência de cada um desses cenários?",
  options: [
    "A rede do escritório corresponde a uma LAN, a interligação das filiais na mesma cidade corresponde a uma MAN, e a comunicação com a unidade em outro país corresponde a uma WAN.",
    "A rede do escritório corresponde a uma MAN, a interligação das filiais corresponde a uma WAN, e a comunicação internacional corresponde a uma LAN.",
    "Todos os três cenários devem ser classificados como MAN, já que essa é a única classificação capaz de suportar simultaneamente dados, voz e vídeo.",
    "A rede do escritório corresponde a uma WAN, e os demais cenários não possuem classificação definida na hierarquia apresentada."
  ],
  answer: 0,
  feedback: "Conforme a hierarquia apresentada, a **LAN** cobre a abrangência de um cômodo ou prédio, a MAN cobre o nível de uma cidade, interligando filiais distribuídas na mesma região metropolitana, e a WAN cobre distâncias regionais, nacionais ou globais, como a comunicação com uma unidade em outro país."
},

// 34 - Cálculo de capacidade CWDM x DWDM
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Análise Aplicada",
  texto: "Uma operadora de telecomunicações precisa decidir qual técnica de multiplexação óptica utilizar para atender a um backbone de longa distância que exige transmissão de dados em taxas superiores a 1 Terabit por segundo, aproveitando ao máximo a capacidade de um único par de fibra já instalado, mesmo que isso implique em maior custo de implantação.",
  question: "Com base na comparação entre as técnicas de multiplexação óptica apresentadas na disciplina, qual tecnologia é mais adequada para esse cenário, e por quê?",
  options: [
    "CWDM, pois seu espaçamento maior entre canais garante custo mais acessível, sendo indicado para redes metropolitanas de curto a médio alcance.",
    "DWDM, pois seu espaçamento muito denso entre canais permite transmitir mais de 80 canais em uma única fibra, atingindo taxas superiores a Tb/s, apesar do maior custo.",
    "RPR, pois sua arquitetura de anel duplo de fibra óptica é a única capaz de atingir taxas superiores a 1 Terabit por segundo em backbones de longa distância.",
    "WiMAX, pois sua cobertura de vários quilômetros e suporte a múltiplos usuários tornam essa tecnologia sem fio mais adequada para backbones de alta capacidade."
  ],
  answer: 1,
  feedback: "O **DWDM (Dense WDM)** é a tecnologia adequada para esse cenário, pois seu espaçamento muito denso entre canais permite transmitir mais de 80 canais em um único filamento de fibra, atingindo taxas superiores a Tb/s, sendo por isso indicado para backbones de operadoras e redes de longa distância, apesar do maior custo de implantação."
},

// 35 - Planta externa x equipamentos ativos
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Asserção + Justificativa",
  texto: "Um projetista de infraestrutura de telecomunicações está organizando a documentação técnica de uma MAN, separando os elementos da rede em duas categorias distintas, de acordo com a necessidade ou não de alimentação elétrica para seu funcionamento.",
  question: "Avalie as afirmações a seguir sobre a infraestrutura física e lógica de uma MAN.",
  assertions: [
    "I. A ==def==Planta Externa (Passiva)==, composta por elementos como fibra óptica monomodo e caixas de emenda, não necessita de energia elétrica para suportar ou conduzir o sinal óptico.",
    "PORQUE II. Os Equipamentos Ativos, como switches Metro Ethernet e amplificadores ópticos, necessitam de alimentação elétrica para processar, regenerar, amplificar ou encaminhar os sinais."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 1,
  feedback: "Ambas as afirmativas são corretas, mas descrevem categorias complementares e independentes: a natureza passiva da **Planta Externa** não decorre da necessidade de energia dos Equipamentos Ativos; são duas classificações distintas da infraestrutura, cada uma com suas próprias características."
},

// 36 - ERPS e autorrecuperação
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Múltiplas Afirmativas",
  texto: "Durante uma obra de escavação em uma via pública, um cabo de fibra óptica pertencente a uma MAN estruturada em anel é rompido acidentalmente. A operadora responsável monitora o incidente para avaliar o impacto sobre os serviços de seus clientes, incluindo bancos e hospitais da região.",
  question: "Sobre o mecanismo de autorrecuperação em anéis ópticos apresentado na disciplina, avalie as afirmativas a seguir.",
  assertions: [
    "I. O ==proc==ERPS== (Ethernet Ring Protection Switching) é o padrão moderno usado em redes Metro Ethernet para garantir proteção em anel sem depender do antigo SDH.",
    "II. Em condições normais de funcionamento, um link do anel permanece bloqueado de forma lógica para evitar que os dados fiquem em loop infinito.",
    "III. Quando ocorre o rompimento de um cabo, os switches das pontas do anel detectam a falha em um intervalo de tempo superior a 5 segundos.",
    "IV. Após a detecção da falha, o bloqueio lógico é liberado e os dados passam a fluir pelo caminho oposto do anel."
  ],
  options: [
    "I, II e IV, apenas",
    "I e II, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa III está incorreta, pois o material indica que a detecção da falha pelos switches das pontas ocorre em **menos de 50 milissegundos**, e não em um intervalo superior a 5 segundos, o que garante a rápida recuperação do serviço."
},

// 37 - WMAN e WiMAX
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Conceitual Contextualizada",
  texto: "Uma prefeitura deseja levar conectividade de banda larga a um distrito rural situado em uma região montanhosa, onde o lançamento de cabos de fibra óptica seria extremamente custoso devido aos obstáculos geográficos e à necessidade de implantação rápida do serviço.",
  question: "Considerando as tecnologias de rede metropolitana estudadas na disciplina, qual alternativa apresenta a solução mais adequada para esse cenário e sua justificativa?",
  options: [
    "DWDM, pois sua alta densidade de canais permite atender áreas rurais de difícil acesso sem a necessidade de infraestrutura de fibra óptica instalada.",
    "WMAN baseada em WiMAX, pois utiliza ondas de rádio para transmitir dados, sendo indicada quando o alto custo ou os obstáculos geográficos inviabilizam a instalação de fibra óptica.",
    "Metro Ethernet, pois sua extensão do protocolo Ethernet para distâncias metropolitanas de 10 a 50 km dispensa qualquer necessidade de infraestrutura física entre os pontos.",
    "SONET/SDH, pois essa tecnologia foi projetada especificamente para regiões de difícil acesso geográfico, substituindo integralmente o uso de fibra óptica em áreas rurais."
  ],
  answer: 1,
  feedback: "A **WMAN**, utilizando tecnologias como o WiMAX, é a solução mais adequada nesse cenário, pois emprega ondas de rádio em vez de cabos, sendo indicada justamente quando o alto custo, os obstáculos geográficos ou a necessidade de implantação rápida tornam a instalação de fibra óptica inviável."
},

// 38 - Vantagens e desvantagens da WMAN
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Análise Aplicada",
  texto: "Uma operadora regional está avaliando a substituição de parte de sua infraestrutura de fibra óptica metropolitana por enlaces sem fio baseados em WiMAX, em áreas onde a demanda de conectividade ainda é incerta e a implantação precisa ser rápida e de baixo custo inicial.",
  question: "Considerando as vantagens e desvantagens da WMAN apresentadas na disciplina, qual das situações a seguir representa corretamente um risco associado a essa substituição?",
  options: [
    "A WMAN apresenta maior estabilidade que a fibra óptica em qualquer condição climática, eliminando a necessidade de visada direta entre os equipamentos.",
    "A WMAN pode sofrer interferências causadas por obstáculos e condições climáticas, além de apresentar menor capacidade de transmissão em relação às redes ópticas.",
    "A WMAN exige necessariamente o lançamento de novos cabos de fibra óptica subterrânea, o que aumenta significativamente o custo de implantação em comparação à MAN tradicional.",
    "A WMAN não permite cobertura de grandes áreas geográficas, sendo indicada apenas para distâncias inferiores a cem metros entre estação base e cliente."
  ],
  answer: 1,
  feedback: "Entre as desvantagens da **WMAN** apresentadas na disciplina estão a menor estabilidade em comparação à fibra óptica, a suscetibilidade a interferências causadas por obstáculos e condições climáticas, e a menor capacidade de transmissão em relação às redes ópticas, riscos relevantes ao considerar essa substituição."
},

// 39 - SONET/SDH e sua substituição
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Asserção + Justificativa",
  texto: "Um historiador da área de telecomunicações está pesquisando por que tecnologias amplamente utilizadas em redes metropolitanas e de longa distância nas décadas de 1980 e 1990 foram gradualmente substituídas por outras abordagens nas décadas seguintes.",
  question: "Avalie as afirmações a seguir sobre a substituição do SONET/SDH nas redes metropolitanas.",
  assertions: [
    "I. As tecnologias ==def==SONET== e SDH foram a espinha dorsal de redes metropolitanas e de longa distância durante as décadas de 1980 e 1990.",
    "PORQUE II. Houve uma mudança drástica no perfil do tráfego de comunicação, saindo de um mundo focado em voz, com comutação de circuitos, para um mundo dominado por dados, com comutação de pacotes IP."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "Ambas as afirmativas são verdadeiras e a segunda justifica a primeira: o material aponta exatamente essa mudança de perfil de tráfego, da voz comutada por circuitos para os dados comutados por pacotes IP, como a **razão fundamental** para a substituição gradual do SONET/SDH por Metro Ethernet, MPLS e DWDM."
},

// 40 - Componentes da WMAN
{
  aula: "Aula 4 — Redes Metropolitanas (MANs)",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma operadora está implantando uma rede WMAN baseada em WiMAX para atender uma região metropolitana onde a instalação de fibra óptica seria muito custosa. A equipe técnica precisa identificar corretamente a função de cada componente físico envolvido nessa rede.",
  question: "Sobre os componentes de uma WMAN apresentados na disciplina, avalie as afirmativas a seguir.",
  assertions: [
    "I. As ==term==Estações Base== são os equipamentos responsáveis por transmitir e receber o sinal de rádio, atendendo uma determinada área da cidade.",
    "II. O CPE (Customer Premises Equipment) é o equipamento instalado no cliente, responsável por receber o sinal da estação base e conectá-lo à rede local.",
    "III. As antenas realizam a transmissão e recepção das ondas eletromagnéticas, podendo ser instaladas em torres, prédios, postes ou morros.",
    "IV. O backbone da operadora é substituído integralmente pelas estações base, eliminando qualquer necessidade de conexão entre elas e a infraestrutura da operadora."
  ],
  options: [
    "I, II e III, apenas",
    "I e III, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa IV está incorreta, pois o material indica que as **estações base** normalmente são conectadas ao backbone da operadora, e não que o substituem; o backbone continua sendo necessário para integrar as estações base à infraestrutura geral da rede."
},
// 41 - Redes celulares x redes ad hoc
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Asserção + Justificativa",
  texto: "Um pesquisador está comparando duas categorias de redes sem fio: uma baseada em estações rádio base e torres organizadas hierarquicamente, e outra na qual os próprios dispositivos se comunicam diretamente entre si, sem depender de uma infraestrutura fixa.",
  question: "Avalie as afirmações a seguir sobre as Redes Celulares Móveis e as Redes Ad-hoc Sem Fio.",
  assertions: [
    "I. As ==def==Redes Celulares Móveis== são baseadas em uma infraestrutura hierárquica e permitem mobilidade contínua entre células por meio do processo de handover.",
    "PORQUE II. Nas Redes Ad-hoc Sem Fio, cada nó atua simultaneamente como emissor, receptor e roteador, em uma estrutura descentralizada."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 1,
  feedback: "Ambas as afirmativas são verdadeiras, mas descrevem características de **categorias diferentes** de redes sem fio: a primeira trata das redes celulares baseadas em infraestrutura, e a segunda, das redes ad hoc descentralizadas. Por isso, a segunda não justifica a primeira, apenas complementa a comparação entre os dois modelos."
},

// 42 - Evolução das gerações de redes móveis
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Múltiplas Afirmativas",
  texto: "Um instrutor de telecomunicações apresenta a evolução histórica das gerações de redes móveis, desde a primeira geração analógica até a quinta geração, destacando as principais características técnicas de cada uma.",
  question: "Sobre a evolução das redes móveis apresentada na disciplina, avalie as afirmativas a seguir.",
  assertions: [
    "I. A primeira geração (1G) transmitia somente sinais analógicos de voz, utilizando a técnica ==proc==FDMA==.",
    "II. A segunda geração (2G), lançada em meados de 1991, trouxe comunicação digital, melhor qualidade de sinal e possibilidade de criptografia.",
    "III. A quarta geração (4G) é baseada em comutação de circuitos e não integra voz, dados e streaming multimídia em uma mesma infraestrutura.",
    "IV. A quinta geração (5G) oferece velocidades de até 10 Gbps, menor latência e suporte a um maior número de dispositivos conectados, como os utilizados em IoT."
  ],
  options: [
    "I, II e IV, apenas",
    "I e II, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa III está incorreta, pois o **4G** é baseado em IP, e não em comutação de circuitos, integrando justamente voz, dados e streaming multimídia em uma mesma infraestrutura, ao contrário do que a afirmativa descreve."
},

// 43 - Paging x Roaming
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Conceitual Contextualizada",
  texto: "Um usuário de celular está viajando para outro país e continua recebendo ligações normalmente em seu número original, graças a um acordo comercial entre sua operadora de origem e uma operadora parceira local. Em outro momento, esse mesmo usuário recebe uma chamada enquanto seu celular está ocioso, e a rede precisa descobrir em qual célula o aparelho está registrado antes de completar a chamada.",
  question: "Considerando os processos de gestão da mobilidade estudados na disciplina, qual alternativa associa corretamente cada situação descrita ao seu respectivo processo?",
  options: [
    "A primeira situação corresponde ao Roaming, que permite o uso da rede em outras regiões geográficas por meio de acordos entre operadoras; a segunda corresponde ao Paging, processo de localização do dispositivo quando há uma chamada a ser entregue.",
    "A primeira situação corresponde ao Paging, e a segunda corresponde ao Roaming, já que ambos os processos possuem exatamente a mesma função na gestão da mobilidade.",
    "Ambas as situações correspondem exclusivamente ao processo de Atualização de Localização, que substitui totalmente as funções de Paging e Roaming.",
    "A primeira situação corresponde ao Handoff, e a segunda corresponde ao Paging, sendo o Handoff responsável por permitir o uso da rede em outros países."
  ],
  answer: 0,
  feedback: "A primeira situação descreve o **Roaming**, que permite ao usuário utilizar a rede móvel fora de sua área de registro original graças a acordos entre operadoras, enquanto a segunda descreve o Paging, processo pelo qual a rede localiza o dispositivo ocioso para completar uma chamada recebida."
},

// 44 - Comparação de tecnologias WPAN/WLAN
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Análise Aplicada",
  texto: "Uma empresa de automação residencial precisa escolher a tecnologia sem fio mais adequada para conectar dezenas de sensores de segurança espalhados por uma casa de dois andares, priorizando baixíssimo consumo de energia das baterias dos sensores e um alcance superior ao do Bluetooth, mesmo que isso signifique velocidade de transmissão mais baixa.",
  question: "Com base na comparação entre tecnologias WPAN/WLAN apresentada na disciplina, qual tecnologia atende melhor a esse cenário?",
  options: [
    "Wi-Fi, pois sua velocidade muito alta garante o melhor desempenho para qualquer tipo de sensor, independentemente do consumo de energia.",
    "NFC, pois seu alcance de centímetros é ideal para cobrir uma casa de dois andares com o menor consumo de energia possível.",
    "ZigBee, pois oferece alcance de 100 metros e consumo muito baixo de energia, características adequadas para sensores alimentados por bateria em uma área residencial ampla.",
    "Bluetooth, pois seu alcance de 10 metros é suficiente para cobrir qualquer residência, com o menor consumo de energia entre todas as tecnologias apresentadas."
  ],
  answer: 2,
  feedback: "O **ZigBee** é a tecnologia mais adequada para esse cenário, pois oferece alcance de 100 metros, superior ao do Bluetooth, e consumo muito baixo de energia, características que atendem bem a redes de sensores espalhados por uma residência e alimentados por bateria."
},

// 45 - MANET e VANET
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Asserção + Justificativa",
  texto: "Uma equipe de pesquisa está desenvolvendo um sistema de comunicação entre veículos em uma rodovia, permitindo que os carros troquem informações entre si e com semáforos inteligentes, sem depender de uma infraestrutura de rede fixa instalada ao longo da via.",
  question: "Avalie as afirmações a seguir sobre as Redes Móveis Ad Hoc e suas especializações.",
  assertions: [
    "I. A ==def==MANET== é uma rede de dispositivos sem fio que se comunicam diretamente entre si, sem necessidade de infraestrutura fixa, na qual cada dispositivo pode funcionar como roteador.",
    "PORQUE II. As VANETs são uma especialização das MANETs aplicadas a veículos, permitindo comunicação entre carros e com a infraestrutura viária, como semáforos e sensores de trânsito."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 1,
  feedback: "Ambas as afirmativas estão corretas, mas a segunda não é uma justificativa para a primeira: a definição geral de **MANET** independe da existência das VANETs, que são apenas uma aplicação especializada desse conceito mais amplo voltada à comunicação veicular."
},

// 46 - Gerenciamento em redes ad hoc
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma equipe de engenharia está projetando os mecanismos de gerenciamento de uma rede ad hoc destinada a operações de resgate em áreas sem infraestrutura fixa, na qual os dispositivos devem se organizar, se proteger e se adaptar de forma autônoma.",
  question: "Sobre os tipos de gerenciamento em redes sem fio ad hoc apresentados na disciplina, avalie as afirmativas a seguir.",
  assertions: [
    "I. O ==proc==Autogerenciamento== inclui autoconfiguração, autoadaptação e autorreparo, permitindo que a rede se configure, se adapte e se recupere sozinha, sem intervenção humana.",
    "II. O Gerenciamento da Confiança utiliza mecanismos de reputação, nos quais nós que encaminham corretamente pacotes ganham confiança, enquanto os que atrapalham a transmissão perdem reputação.",
    "III. O Gerenciamento da Escalabilidade elimina completamente a necessidade de hierarquia de controle, tratando todos os nós da rede exatamente da mesma forma, independentemente do tamanho da rede.",
    "IV. O Gerenciamento de Recursos, em redes ad hoc, envolve economia de energia, gerenciamento de espectro e controle de tráfego."
  ],
  options: [
    "I, II e IV, apenas",
    "I e II, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa III está incorreta, pois o **Gerenciamento da Escalabilidade** aplica justamente mecanismos de clusterização e hierarquia de controle para manter a eficiência da rede à medida que o número de nós aumenta, e não elimina essa hierarquia."
},

// 47 - Segurança em redes móveis x redes ad hoc
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Conceitual Contextualizada",
  texto: "Um especialista em segurança de redes está analisando duas arquiteturas diferentes: uma rede celular tradicional, na qual existe uma operadora central responsável pela infraestrutura, e uma rede ad hoc, na qual não existe nenhum servidor central e cada dispositivo colabora no encaminhamento dos pacotes dos demais.",
  question: "Considerando as características de gerenciamento de segurança apresentadas na disciplina, qual alternativa descreve corretamente uma diferença relevante entre essas duas arquiteturas?",
  options: [
    "Na rede celular, a segurança é distribuída e cooperativa entre os nós; na rede ad hoc, a segurança depende exclusivamente do SIM card de cada usuário.",
    "Na rede celular, o gerenciamento de identidade se apoia em elementos como o cartão SIM para autenticação; na rede ad hoc, como não há estrutura central, a segurança é distribuída e cooperativa, exigindo avaliação da confiança entre os nós.",
    "Ambas as arquiteturas utilizam exatamente os mesmos mecanismos de segurança, já que a ausência de infraestrutura fixa não representa nenhuma diferença relevante para o gerenciamento de segurança.",
    "Na rede ad hoc, a segurança é sempre mais robusta que na rede celular, pois a inexistência de um servidor central elimina totalmente a possibilidade de ataques como negação de serviço."
  ],
  answer: 1,
  feedback: "Na **rede celular**, o gerenciamento de identidade utiliza elementos como o cartão SIM para autenticar o usuário, enquanto na rede ad hoc, por não haver uma estrutura central, a segurança é distribuída e cooperativa, exigindo que os nós avaliem o nível de confiança uns dos outros para evitar participantes maliciosos."
},

// 48 - Redes Mesh e Redes de Sensores
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Análise Aplicada",
  texto: "Uma prefeitura deseja implantar dois sistemas em uma cidade inteligente: um sistema de retransmissão de sinal Wi-Fi por diversos pontos da cidade, utilizando nós roteadores fixos que colaboram entre si, e um sistema de monitoramento autônomo de temperatura e umidade em praças públicas, com sensores interconectados que transmitem dados de forma independente.",
  question: "Com base nas categorias de redes ad hoc apresentadas na disciplina, quais tecnologias correspondem, respectivamente, a esses dois sistemas?",
  options: [
    "O primeiro sistema corresponde a uma WMN (Wireless Mesh Network), formada por nós roteadores que retransmitem o sinal; o segundo corresponde a uma WSN (Wireless Sensor Network), voltada ao monitoramento e coleta de dados.",
    "O primeiro sistema corresponde a uma WSN, e o segundo corresponde a uma WMN, já que sensores sempre formam redes mesh entre si.",
    "Ambos os sistemas correspondem exclusivamente a uma MANET, pois qualquer rede sem infraestrutura fixa é classificada dessa forma, independentemente de sua finalidade.",
    "O primeiro sistema corresponde a uma WPAN, pois nós roteadores fixos sempre operam em curtíssima distância, e o segundo corresponde a uma WMAN."
  ],
  answer: 0,
  feedback: "O sistema de retransmissão por nós roteadores fixos corresponde a uma **WMN (Wireless Mesh Network)**, na qual cada nó colabora para aumentar a confiabilidade e a cobertura da rede, enquanto o sistema de monitoramento com sensores interconectados corresponde a uma WSN, voltada à coleta autônoma de dados ambientais."
},

// 49 - Handoff e reutilização de frequência
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Asserção + Justificativa",
  texto: "Durante uma ligação telefônica em movimento, um usuário atravessa a fronteira entre duas células de cobertura de sua operadora, sem perceber qualquer interrupção na chamada, mesmo estando a rede dividida em diversas áreas cobertas por diferentes estações-base que reutilizam as mesmas faixas de frequência.",
  question: "Avalie as afirmações a seguir sobre a estrutura e o funcionamento das redes celulares móveis.",
  assertions: [
    "I. O processo de ==proc==handoff/handover== realiza a transferência da chamada entre células, mantendo a comunicação ativa mesmo quando o usuário se desloca entre diferentes áreas de cobertura.",
    "PORQUE II. As frequências de transmissão são reutilizadas entre células com mínima interferência, permitindo que a rede cubra grandes áreas divididas em células sem esgotar o espectro disponível."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 1,
  feedback: "Ambas as afirmativas são verdadeiras, mas descrevem mecanismos **complementares e independentes** das redes celulares: o handoff garante a continuidade da chamada durante o deslocamento, enquanto a reutilização de frequência é uma técnica separada para otimizar o uso do espectro entre as células, não havendo relação direta de causa entre as duas."
},

// 50 - Amazon Go e integração de tecnologias sem fio
{
  aula: "Aula 5 — Introdução a redes móveis e redes ad hoc",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma rede de varejo está estudando o modelo de loja inteligente utilizado pela Amazon Go como referência para implantar câmeras, balanças e sensores conectados por diferentes tecnologias sem fio, processando parte das informações localmente antes de sincronizá-las com a nuvem.",
  question: "Sobre a infraestrutura de rede descrita no exemplo do supermercado Amazon Go, avalie as afirmativas a seguir.",
  assertions: [
    "I. Câmeras, balanças e sensores da loja se conectam via ==term==Wi-Fi tradicional== e protocolos IoT, como Zigbee e Bluetooth Low Energy.",
    "II. Servidores de borda analisam imagens e sensores em tempo real, permitindo identificar quem pegou determinado item e quem saiu da loja.",
    "III. Todo o processamento dos dados da loja ocorre exclusivamente na nuvem da AWS, sem qualquer processamento local realizado dentro do estabelecimento.",
    "IV. As informações processadas localmente são sincronizadas com a nuvem da AWS, onde ocorre o aprendizado contínuo dos algoritmos de visão computacional."
  ],
  options: [
    "I, II e IV, apenas",
    "I e II, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa III está incorreta, pois parte do processamento dos dados é realizada **localmente**, dentro da própria loja, por meio de servidores de borda, justamente para reduzir o tempo de resposta, e não exclusivamente na nuvem."
},
// 51 - Vulnerabilidade, ameaça e ataque
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Asserção + Justificativa",
  texto: "Uma equipe de segurança da informação identifica que um servidor da empresa está executando uma versão de software desatualizada há vários meses. Pouco tempo depois, esse mesmo servidor é infectado por um vírus conhecido que se aproveita dessa falha para se instalar no sistema.",
  question: "Avalie as afirmações a seguir sobre os conceitos de vulnerabilidade, ameaça e ataque.",
  assertions: [
    "I. O software desatualizado representa uma ==def==vulnerabilidade==, ou seja, uma fraqueza presente no sistema que pode ser explorada.",
    "PORQUE II. A infecção causada pelo vírus, que se aproveitou da falha do software desatualizado, representa o ataque, em que a ameaça se materializa explorando a vulnerabilidade existente."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "Ambas as afirmativas estão corretas e a segunda justifica a primeira: o software desatualizado é a **vulnerabilidade** explorada, o vírus representa a ameaça, e a infecção efetiva do sistema caracteriza o ataque, no qual essa ameaça se concretiza sobre a fraqueza existente."
},

// 52 - Criptografia simétrica x assimétrica
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Múltiplas Afirmativas",
  texto: "Um analista de segurança está explicando a um novo colaborador as diferenças entre os dois principais tipos de criptografia utilizados na proteção de dados em trânsito e em repouso, destacando exemplos de algoritmos de cada categoria.",
  question: "Sobre os tipos de criptografia apresentados na disciplina, avalie as afirmativas a seguir.",
  assertions: [
    "I. Na criptografia ==proc==simétrica==, a mesma chave é utilizada tanto para criptografar quanto para descriptografar os dados, sendo o AES um exemplo desse tipo.",
    "II. Na criptografia assimétrica, é utilizado um par de chaves, sendo a chave pública usada para criptografar e a chave privada, para descriptografar.",
    "III. O algoritmo DES, apesar de historicamente relevante, é considerado inseguro atualmente devido ao tamanho pequeno de sua chave, facilmente quebrável por força bruta.",
    "IV. A criptografia de fluxo processa os dados sempre em blocos fixos de 128 bits, sendo o AES um exemplo típico desse funcionamento."
  ],
  options: [
    "I, II e III, apenas",
    "I e III, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa IV está incorreta, pois a criptografia de fluxo cifra os dados bit a bit ou byte a byte, e não em blocos fixos; o processamento em blocos, como o de 128 bits, é característico da **criptografia de bloco**, na qual se enquadra o AES."
},

// 53 - Tipos de ataques cibernéticos
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Conceitual Contextualizada",
  texto: "Um usuário recebe um e-mail que aparenta ter sido enviado pelo seu banco, solicitando que ele clique em um link e informe seus dados de acesso à conta para 'regularizar uma pendência'. Ao clicar no link, ele é direcionado a uma página muito semelhante à do banco real, mas que na verdade pertence ao atacante.",
  question: "Considerando os tipos de ataques cibernéticos estudados na disciplina, qual alternativa identifica corretamente a técnica utilizada nessa situação?",
  options: [
    "Phishing, uma técnica de engenharia social em que o atacante se passa por uma entidade confiável para enganar a vítima e obter informações confidenciais.",
    "Ataque de força bruta, pois o atacante tentou inúmeras combinações de senha até encontrar a correta para acessar a conta do usuário.",
    "SQL Injection, pois o atacante inseriu código malicioso em um campo de entrada do site do banco para manipular o banco de dados.",
    "Ataque de negação de serviço, pois o objetivo do atacante era sobrecarregar o servidor do banco com um grande volume de tráfego."
  ],
  answer: 0,
  feedback: "A situação descrita caracteriza um ataque de **Phishing**, técnica de engenharia social em que o atacante se passa por uma entidade confiável, como um banco, para enganar a vítima e obter informações confidenciais, como senhas e dados bancários."
},

// 54 - Cálculo de RSA
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Análise Aplicada",
  texto: "Um estudante está praticando o algoritmo RSA com números pequenos para fins didáticos. Ele escolhe os primos p = 3 e q = 11, calculando n = p × q e a função totiente de Euler φ(n) = (p-1)(q-1) para, em seguida, definir o expoente público e o expoente privado do sistema.",
  question: "Com base nas etapas de geração de chaves do algoritmo RSA apresentadas na disciplina, qual é o valor de n e de φ(n) para os primos escolhidos pelo estudante?",
  options: [
    "n = 33 e φ(n) = 20",
    "n = 14 e φ(n) = 30",
    "n = 33 e φ(n) = 33",
    "n = 30 e φ(n) = 14"
  ],
  answer: 0,
  feedback: "Aplicando as fórmulas do **RSA**: n = p × q = 3 × 11 = 33, e φ(n) = (p-1)(q-1) = (3-1)(11-1) = 2 × 10 = 20. Esses valores seriam utilizados nas etapas seguintes para determinar os expoentes público e privado."
},

// 55 - SSL/TLS, IPSec e SSH
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Asserção + Justificativa",
  texto: "Uma empresa está definindo quais protocolos de segurança utilizar em diferentes cenários: proteger o acesso de navegadores a seu site institucional, garantir a segurança de uma VPN corporativa entre duas filiais e permitir que administradores acessem remotamente os servidores da empresa.",
  question: "Avalie as afirmações a seguir sobre os protocolos seguros estudados na disciplina.",
  assertions: [
    "I. O ==def==SSL/TLS== atua na camada de transporte e garante a segurança das comunicações entre navegador e servidor, sendo utilizado em conexões HTTPS.",
    "PORQUE II. O IPSec atua na camada de rede e é amplamente usado em VPNs corporativas, podendo operar em modo transporte ou em modo túnel."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 1,
  feedback: "Ambas as afirmativas estão corretas, mas descrevem protocolos que atuam em **camadas diferentes** e para finalidades distintas: o SSL/TLS protege comunicações web na camada de transporte, enquanto o IPSec protege pacotes IP na camada de rede, sendo comum em VPNs. A segunda não justifica a primeira, apenas complementa a comparação entre os protocolos."
},

// 56 - Funções hash e assinaturas digitais
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Múltiplas Afirmativas",
  texto: "Um desenvolvedor está implementando um sistema de assinatura digital para garantir que documentos eletrônicos enviados por seus clientes não sejam alterados durante a transmissão e que seja possível identificar com segurança quem os assinou.",
  question: "Sobre funções hash e assinaturas digitais, avalie as afirmativas a seguir.",
  assertions: [
    "I. Uma função ==def==hash== é irreversível, ou seja, não é possível obter a entrada original a partir do hash gerado.",
    "II. Na criação de uma assinatura digital, o remetente criptografa o hash da mensagem usando sua chave privada, e esse resultado constitui a assinatura.",
    "III. Para verificar a assinatura, o destinatário decifra a assinatura digital utilizando a chave privada do remetente, obtendo o hash original.",
    "IV. Se o hash calculado localmente pelo destinatário for diferente do hash obtido a partir da assinatura, conclui-se que a mensagem foi alterada ou que a assinatura é falsa."
  ],
  options: [
    "I, II e IV, apenas",
    "I e II, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa III está incorreta, pois o destinatário decifra a assinatura digital utilizando a **chave pública** do remetente, e não a chave privada, que deve permanecer em sigilo com o próprio remetente."
},

// 57 - Firewall de software x hardware
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Conceitual Contextualizada",
  texto: "Uma empresa de médio porte precisa decidir entre instalar um programa de proteção individualmente em cada um de seus 50 computadores ou adquirir um único equipamento dedicado posicionado na entrada da rede, capaz de proteger toda a infraestrutura de uma só vez, mesmo que isso represente um investimento inicial mais alto.",
  question: "Considerando a comparação entre firewall de software e firewall de hardware apresentada na disciplina, qual alternativa descreve corretamente uma diferença relevante entre essas duas opções?",
  options: [
    "O firewall de hardware protege toda a rede a partir de um equipamento dedicado, com manutenção centralizada e alto desempenho, enquanto o firewall de software protege cada dispositivo individualmente e requer atualização em cada máquina.",
    "O firewall de software sempre oferece maior nível de proteção para toda a rede do que o firewall de hardware, já que é instalado diretamente em cada computador.",
    "O firewall de hardware não é capaz de realizar filtragem de pacotes, sendo utilizado apenas para funções de backup e recuperação de desastres.",
    "Não existe diferença relevante de custo, manutenção ou desempenho entre firewalls de software e de hardware, sendo a escolha uma questão puramente estética."
  ],
  answer: 0,
  feedback: "O **firewall de hardware** protege toda a rede a partir de um equipamento dedicado, com manutenção centralizada e alto desempenho, enquanto o firewall de software protege o dispositivo individual em que é instalado, exigindo atualização separada em cada máquina, conforme apresentado na comparação da disciplina."
},

// 58 - Tipos de hackers
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Análise Aplicada",
  texto: "Uma empresa contrata um profissional de segurança para tentar invadir seus próprios sistemas de forma autorizada, com o objetivo de identificar falhas antes que agentes maliciosos possam explorá-las. Esse profissional realiza os testes dentro do escopo definido em contrato, com total permissão dos proprietários dos sistemas.",
  question: "Considerando a classificação de hackers apresentada na disciplina, qual categoria melhor descreve o profissional contratado nessa situação?",
  options: [
    "Hacker White Hat, pois utiliza suas habilidades para proteger sistemas e encontrar falhas de segurança com a permissão dos proprietários.",
    "Hacker Black Hat, pois qualquer tentativa de invasão de sistemas, mesmo autorizada, é classificada como ilegal e maliciosa.",
    "Script Kiddie, pois qualquer profissional contratado para testes de invasão é, por definição, um amador sem conhecimento técnico profundo.",
    "Hacktivista, pois o profissional está motivado por uma causa política ao realizar os testes de invasão nos sistemas da empresa."
  ],
  answer: 0,
  feedback: "O profissional descrito se enquadra na categoria de **hacker White Hat**, também conhecido como hacker ético, pois utiliza suas habilidades técnicas para identificar falhas de segurança com a permissão explícita dos proprietários dos sistemas, diferentemente dos hackers Black Hat, que agem de forma ilegal ou maliciosa."
},

// 59 - Legislação brasileira sobre crimes cibernéticos
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Asserção + Justificativa",
  texto: "Um advogado especializado em direito digital está orientando uma empresa brasileira sobre as principais leis relacionadas à segurança de dados e a crimes cometidos por meios eletrônicos, considerando um caso de invasão de dispositivo informático e outro relacionado ao tratamento inadequado de dados pessoais de clientes.",
  question: "Avalie as afirmações a seguir sobre a legislação brasileira relacionada à segurança de redes e crimes cibernéticos.",
  assertions: [
    "I. A ==rule==Lei Carolina Dieckmann== (Lei nº 12.737/2012) introduziu no Código Penal o crime de invasão de dispositivo de informática.",
    "PORQUE II. A LGPD (Lei nº 13.709/2018) regula como os dados pessoais podem ser coletados, armazenados e compartilhados, garantindo a privacidade dos cidadãos."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 1,
  feedback: "Ambas as afirmativas estão corretas, mas tratam de **leis independentes**, voltadas a objetivos distintos: a Lei Carolina Dieckmann criminaliza a invasão de dispositivos, enquanto a LGPD regula o tratamento de dados pessoais. A segunda não justifica a primeira, pois não há relação de causa e efeito entre elas."
},

// 60 - WannaCry e vulnerabilidade EternalBlue
{
  aula: "Aula 6 — Introdução à Segurança de Redes",
  tipo: "Múltiplas Afirmativas",
  texto: "Um pesquisador de segurança está estudando o caso do ataque global de ransomware ocorrido em maio de 2017, que afetou centenas de milhares de computadores em diversos países, incluindo hospitais e órgãos públicos, explorando uma vulnerabilidade específica em um protocolo de compartilhamento de arquivos do Windows.",
  question: "Sobre o caso do WannaCry apresentado na disciplina, avalie as afirmativas a seguir.",
  assertions: [
    "I. O ==danger==WannaCry== é um ransomware que criptografava os arquivos dos computadores infectados e exigia pagamento em Bitcoin para liberar o acesso.",
    "II. O ataque se espalhou automaticamente explorando a vulnerabilidade EternalBlue, relacionada a uma falha no protocolo SMBv1 do Windows.",
    "III. A vulnerabilidade explorada pelo WannaCry havia sido descoberta pela NSA e vazou por meio de um grupo chamado Shadow Brokers.",
    "IV. O ataque do WannaCry ficou restrito a poucas dezenas de computadores em um único país, sem impacto relevante em hospitais ou órgãos públicos."
  ],
  options: [
    "I, II e III, apenas",
    "I e III, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A afirmativa IV está incorreta, pois o material indica que o **WannaCry** afetou mais de 200 mil computadores em mais de 150 países, incluindo hospitais, empresas e órgãos públicos, e não ficou restrito a poucas dezenas de máquinas em um único país."
},
  ],


  fixacao: [
    // 1 - Componentes de rede
{
  aula: "aula 1 - Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Direta",
  texto: "Toda rede possui elementos que desempenham papéis distintos na comunicação.",
  question: "Qual das opções abaixo é um exemplo de dispositivo de interconexão, e não de host?",
  options: [
    "Notebook",
    "Switch",
    "Impressora de rede",
    "Smartphone"
  ],
  answer: 1,
  feedback: "O switch é um dispositivo de interconexão, responsável por conectar hosts e organizar o encaminhamento dos dados; ele não gera nem consome dados diretamente como um host."
},

// 2 - Meios de transmissão
{
  aula: "aula 1 - Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Contexto",
  texto: "Uma empresa está reformando seu escritório e precisa decidir como interligar os computadores do setor financeiro a um servidor local.",
  question: "Se a empresa optar por instalar cabeamento físico entre os dispositivos, qual tipo de meio de transmissão estará sendo utilizado?",
  options: [
    "Meio não guiado, pois usa infraestrutura fixa",
    "Meio guiado, pois utiliza um meio físico para transportar o sinal",
    "Meio misto, pois combina cabo e satélite",
    "Meio sem fio, pois conecta pontos fixos"
  ],
  answer: 1,
  feedback: "Meios guiados utilizam um meio físico (como par trançado, coaxial ou fibra óptica) para transportar os sinais, diferente dos meios não guiados, como rádio e satélite."
},

// 3 - Tipos de rede
{
  aula: "aula 1 - Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Aplicação",
  texto: "Uma universidade possui campi em diferentes cidades do país e precisa que todos os laboratórios de informática consigam se comunicar entre si, independentemente da distância.",
  question: "Qual tipo de rede melhor descreve essa infraestrutura que conecta unidades em regiões distantes?",
  options: [
    "LAN, pois conecta apenas um prédio",
    "MAN, pois está limitada a uma cidade",
    "WAN, pois abrange áreas geográficas amplas",
    "P2P, pois todos os pontos têm o mesmo papel"
  ],
  answer: 2,
  feedback: "A WAN (Wide Area Network) é o tipo de rede com maior abrangência, capaz de conectar dispositivos localizados em diferentes regiões ou até países."
},

// 4 - Topologias de rede
{
  aula: "aula 1 - Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Direta",
  texto: "As topologias descrevem a forma como os dispositivos estão fisicamente ou logicamente organizados.",
  question: "Em qual topologia todos os dispositivos se conectam a um ponto central?",
  options: [
    "Anel",
    "Barramento",
    "Estrela",
    "Malha"
  ],
  answer: 2,
  feedback: "Na topologia estrela, os dispositivos ficam distribuídos ao redor de um elemento central, para onde convergem todas as conexões."
},

// 5 - Endereçamento IPv4 e IPv6
{
  aula: "aula 1 - Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Contexto",
  texto: "Um técnico de redes está configurando um novo servidor e precisa escolher entre atribuir um endereço no formato antigo ou no formato mais recente de endereçamento IP.",
  question: "Qual característica diferencia corretamente o IPv6 do IPv4?",
  options: [
    "O IPv6 usa 32 bits e representação decimal",
    "O IPv6 usa 128 bits e representação hexadecimal",
    "O IPv4 usa 128 bits e representação hexadecimal",
    "Ambos utilizam exatamente o mesmo número de bits"
  ],
  answer: 1,
  feedback: "O IPv6 possui 128 bits, representados em hexadecimal, o que amplia enormemente o espaço de endereçamento em relação ao IPv4, que possui 32 bits em formato decimal."
},

// 6 - Modelo cliente-servidor
{
  aula: "aula 1 - Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Aplicação",
  texto: "Em um sistema de e-commerce, os usuários acessam o site por meio de navegadores, enquanto todas as informações de produtos e pedidos ficam armazenadas e processadas em uma máquina central de alto desempenho.",
  question: "Esse cenário representa qual modelo de rede?",
  options: [
    "Modelo P2P, pois há vários usuários",
    "Modelo cliente-servidor, com administração centralizada",
    "Modelo P2P, pois não existe hierarquia entre os nós",
    "Modelo híbrido sem papéis definidos"
  ],
  answer: 1,
  feedback: "No modelo cliente-servidor, os clientes solicitam serviços e um servidor centralizado processa e responde às solicitações, característica marcada pela administração centralizada."
},

// 7 - Modelo P2P
{
  aula: "aula 1 - Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Direta",
  texto: "No modelo Peer-to-Peer, os dispositivos assumem papéis semelhantes na rede.",
  question: "Qual é uma desvantagem típica do modelo P2P em relação ao cliente-servidor?",
  options: [
    "Maior facilidade de gerenciamento",
    "Administração centralizada",
    "Maior dificuldade para garantir segurança",
    "Baixa escalabilidade"
  ],
  answer: 2,
  feedback: "Como não há um ponto central de controle no P2P, a administração é descentralizada, o que dificulta o gerenciamento e a garantia de segurança da rede."
},

// 8 - Camadas do modelo OSI
{
  aula: "aula 1 - Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Contexto",
  texto: "Durante uma comunicação de rede, uma das camadas do modelo OSI é responsável por criptografar e comprimir os dados antes de repassá-los para as camadas inferiores.",
  question: "A qual camada do modelo OSI essa função está associada?",
  options: [
    "Camada de Sessão",
    "Camada de Apresentação",
    "Camada de Transporte",
    "Camada de Enlace"
  ],
  answer: 1,
  feedback: "A camada de Apresentação do modelo OSI é responsável pela tradução dos dados, além de funções de criptografia e compressão."
},

// 9 - Comparação OSI x TCP/IP
{
  aula: "aula 1 - Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Direta",
  texto: "O modelo TCP/IP é mais enxuto que o modelo OSI em número de camadas.",
  question: "As funções de quais três camadas do OSI são agrupadas na camada de Aplicação do TCP/IP?",
  options: [
    "Física, Enlace e Rede",
    "Rede, Transporte e Sessão",
    "Aplicação, Apresentação e Sessão",
    "Transporte, Enlace e Física"
  ],
  answer: 2,
  feedback: "As camadas de Aplicação, Apresentação e Sessão do modelo OSI são reunidas em uma única camada de Aplicação no modelo TCP/IP."
},

// 10 - Encapsulamento de dados
{
  aula: "aula 1 - Apresentação da disciplina, ementa e metodologia. Revisão de conceitos básicos",
  tipo: "Aplicação",
  texto: "Ao enviar um e-mail, os dados gerados pela aplicação passam por diversas transformações até serem efetivamente transmitidos pelo meio físico da rede.",
  question: "Qual é a sequência correta desse processo de encapsulamento, do topo até o meio físico?",
  options: [
    "Dados → Quadro → Segmento → Pacote → Sinais",
    "Dados → Segmento/Datagrama → Pacote → Quadro → Sinais",
    "Dados → Pacote → Segmento → Sinais → Quadro",
    "Dados → Sinais → Quadro → Pacote → Segmento"
  ],
  answer: 1,
  feedback: "No encapsulamento, os dados da aplicação são transformados sucessivamente em segmento/datagrama, pacote, quadro e, por fim, em sinais transmitidos pelo meio físico."
},
// 11 - Camada Física
{
  aula: "aula 2 - Camadas físicas e de enlace",
  tipo: "Direta",
  texto: "A camada Física é a primeira camada do modelo OSI.",
  question: "Qual das opções abaixo é uma função da camada Física?",
  options: [
    "Detectar e corrigir erros em frames",
    "Converter bits em sinais elétricos, ópticos ou eletromagnéticos",
    "Controlar o acesso ao meio compartilhado",
    "Adicionar endereços de origem e destino ao quadro"
  ],
  answer: 1,
  feedback: "A camada Física é responsável por transmitir e receber bits, convertendo-os em sinais adequados à tecnologia utilizada, como sinais elétricos, ópticos ou eletromagnéticos."
},

// 12 - Sinais analógicos e digitais
{
  aula: "aula 2 - Camadas físicas e de enlace",
  tipo: "Contexto",
  texto: "Um engenheiro observa dois tipos de gráficos de sinal: um apresenta uma curva contínua e o outro apresenta degraus entre valores fixos.",
  question: "Como esses dois sinais podem ser classificados, respectivamente?",
  options: [
    "Digital e analógico",
    "Analógico e digital",
    "Ambos são digitais",
    "Ambos são analógicos"
  ],
  answer: 1,
  feedback: "O sinal com variação contínua, representado por uma curva, é analógico; o sinal com variação discreta, representado por degraus, é digital."
},

// 13 - Banda Base e Banda Larga
{
  aula: "aula 2 - Camadas físicas e de enlace",
  tipo: "Aplicação",
  texto: "Uma empresa de telecomunicações precisa transmitir um sinal digital por longas distâncias através de um meio compartilhado, convertendo-o previamente em sinal analógico por modulação.",
  question: "Essa forma de transmissão é chamada de:",
  options: [
    "Banda Base",
    "Banda Larga",
    "Transmissão Simplex",
    "Transmissão Half-duplex"
  ],
  answer: 1,
  feedback: "Na Banda Larga, o sinal digital é convertido em sinal analógico por meio de modulação, permitindo transmissão em meios compartilhados e por longas distâncias, como ocorre na Internet por fibra óptica."
},

// 14 - Perdas na transmissão
{
  aula: "aula 2 - Camadas físicas e de enlace",
  tipo: "Direta",
  texto: "Durante a propagação por um meio de transmissão, o sinal pode sofrer diferentes tipos de degradação.",
  question: "Qual termo descreve a perda de energia do sinal ao longo de sua propagação?",
  options: [
    "Distorção",
    "Ruído",
    "Atenuação",
    "Interferência de fase"
  ],
  answer: 2,
  feedback: "A atenuação é a perda de energia do sinal durante sua propagação pelo meio, já que parte dessa energia é gasta para superar a resistência do meio de transmissão."
},

// 15 - Teoremas de Nyquist e Shannon
{
  aula: "aula 2 - Camadas físicas e de enlace",
  tipo: "Contexto",
  texto: "Um professor pede que os alunos calculem a taxa máxima de transmissão de um canal, considerando que esse canal apresenta ruído significativo.",
  question: "Qual teorema deve ser utilizado nesse caso?",
  options: [
    "Teorema de Nyquist, pois se aplica a canais ideais",
    "Teorema de Shannon, pois considera a relação sinal/ruído",
    "Teorema de Hamming, pois trata de correção de erros",
    "Teorema de Fourier, pois decompõe sinais em senoides"
  ],
  answer: 1,
  feedback: "O Teorema de Shannon se aplica a canais reais, com ruído, relacionando a capacidade máxima do canal com a largura de banda e a relação sinal/ruído (SNR)."
},

// 16 - Desempenho de rede
{
  aula: "aula 2 - Camadas físicas e de enlace",
  tipo: "Direta",
  texto: "O desempenho de uma rede pode ser avaliado por diferentes métricas.",
  question: "Qual métrica representa a rapidez com que os dados são efetivamente transmitidos pela rede, na prática?",
  options: [
    "Throughput",
    "Amplitude",
    "Frequência",
    "Distância de Hamming"
  ],
  answer: 0,
  feedback: "O throughput representa a rapidez com que os dados podem ser realmente enviados pela rede, diferenciando-se da capacidade teórica máxima do canal."
},

// 17 - Funções da camada de Enlace
{
  aula: "aula 2 - Camadas físicas e de enlace",
  tipo: "Aplicação",
  texto: "Em uma rede local, vários dispositivos compartilham o mesmo meio de transmissão e é preciso decidir qual deles pode transmitir dados em um determinado momento.",
  question: "Essa função é atribuída a qual mecanismo da camada de Enlace?",
  options: [
    "Framing",
    "Controle de fluxo",
    "Controle de acesso ao meio",
    "Endereçamento físico"
  ],
  answer: 2,
  feedback: "O controle de acesso ao meio é responsável por determinar qual dispositivo terá o controle do meio de transmissão compartilhado em determinado momento."
},

// 18 - Bit de paridade e CRC
{
  aula: "aula 2 - Camadas físicas e de enlace",
  tipo: "Contexto",
  texto: "Um sistema de transmissão utiliza um método de verificação baseado em divisão binária com operações XOR, no qual o resto da divisão é anexado à mensagem original.",
  question: "Esse método de detecção de erros é conhecido como:",
  options: [
    "Bit de paridade",
    "Checksum",
    "CRC",
    "Código de Hamming"
  ],
  answer: 2,
  feedback: "O CRC (Cyclic Redundancy Check) utiliza divisão binária com operações XOR entre a mensagem e um polinômio gerador, sendo o resto dessa divisão anexado à mensagem como bits de verificação."
},

// 19 - Código de Hamming
{
  aula: "aula 2 - Camadas físicas e de enlace",
  tipo: "Direta",
  texto: "O Código de Hamming utiliza bits de paridade posicionados de forma específica dentro da mensagem.",
  question: "Em quais posições ficam os bits de paridade no Código de Hamming clássico?",
  options: [
    "Nas últimas posições da mensagem",
    "Em posições aleatórias definidas pelo receptor",
    "Em posições que são potências de 2, como 1, 2, 4, 8",
    "Sempre na primeira e na última posição"
  ],
  answer: 2,
  feedback: "No Código de Hamming, os bits de paridade ficam em posições que são potências de 2 (1, 2, 4, 8, 16...), enquanto as demais posições são ocupadas pelos bits de dados."
},

// 20 - Protocolos ARQ
{
  aula: "aula 2 - Camadas físicas e de enlace",
  tipo: "Aplicação",
  texto: "Durante a transmissão de uma sequência de frames em uma rede com ruído, o receptor detecta um erro no quarto frame, mas os frames seguintes chegam corretamente e podem ser aproveitados sem necessidade de reenvio.",
  question: "Esse comportamento é característico de qual protocolo ARQ?",
  options: [
    "Stop-and-Wait ARQ",
    "Go-Back-N ARQ",
    "Selective Repeat ARQ",
    "Protocolo mais simples possível"
  ],
  answer: 2,
  feedback: "No Selective Repeat ARQ, apenas os frames perdidos ou corrompidos são retransmitidos, enquanto os frames corretos, mesmo que recebidos fora de ordem, são aproveitados pelo receptor."
},
// 21 - Subcamadas LLC e MAC
{
  aula: "aula 3 - Padrões IEEE e Redes locais (LANs)",
  tipo: "Direta",
  texto: "O Projeto IEEE 802 dividiu a camada de Enlace em duas subcamadas.",
  question: "Qual característica diferencia a subcamada LLC da subcamada MAC?",
  options: [
    "O LLC é específico de cada tecnologia, enquanto o MAC é independente",
    "O LLC é independente do tipo de LAN, enquanto o MAC é específico de cada tecnologia",
    "Ambos são específicos de cada tecnologia de LAN",
    "Ambos são independentes da tecnologia de LAN"
  ],
  answer: 1,
  feedback: "O LLC é independente do tipo de LAN, podendo ser utilizado tanto em Ethernet quanto em Wi-Fi, enquanto o MAC é específico de cada tecnologia, definindo o método de acesso e o formato dos quadros."
},

// 22 - Frame Ethernet
{
  aula: "aula 3 - Padrões IEEE e Redes locais (LANs)",
  tipo: "Contexto",
  texto: "Um analista de redes está estudando o frame Ethernet e precisa identificar o campo responsável por verificar se os dados chegaram corrompidos.",
  question: "Qual campo do frame Ethernet cumpre essa função?",
  options: [
    "Preâmbulo",
    "SFD",
    "Comprimento/Tipo",
    "CRC/FCS"
  ],
  answer: 3,
  feedback: "O campo CRC/FCS é utilizado para verificação, permitindo detectar se os dados foram corrompidos durante a transmissão."
},

// 23 - CSMA/CD
{
  aula: "aula 3 - Padrões IEEE e Redes locais (LANs)",
  tipo: "Aplicação",
  texto: "Em uma rede Ethernet tradicional, duas estações transmitem simultaneamente pelo mesmo meio compartilhado, gerando uma colisão que precisa ser tratada.",
  question: "Qual mecanismo é utilizado pela Ethernet clássica para lidar com essa situação?",
  options: [
    "CSMA/CA, evitando a colisão antes que ela ocorra",
    "CSMA/CD, detectando a colisão após sua ocorrência",
    "RTS/CTS, reservando o canal previamente",
    "FHSS, alternando a frequência de transmissão"
  ],
  answer: 1,
  feedback: "A Ethernet tradicional utiliza CSMA/CD, que detecta a colisão depois que ela ocorre, interrompendo a transmissão e aguardando um tempo aleatório antes de retransmitir."
},

// 24 - Arquitetura Wi-Fi (BSS e ESS)
{
  aula: "aula 3 - Padrões IEEE e Redes locais (LANs)",
  tipo: "Direta",
  texto: "O IEEE 802.11 organiza a comunicação sem fio por meio de unidades básicas de rede.",
  question: "O que caracteriza uma ESS (Extended Service Set)?",
  options: [
    "Uma única estação transmitindo sem controle central",
    "Duas ou mais BSSs interligadas por um sistema de distribuição",
    "Um conjunto de dispositivos Bluetooth conectados a um mestre",
    "Uma rede formada exclusivamente por dispositivos ad hoc"
  ],
  answer: 1,
  feedback: "A ESS é formada por duas ou mais BSSs interligadas por um sistema de distribuição, normalmente uma LAN com fio, permitindo que os APs conectem as diferentes BSSs entre si."
},

// 25 - DCF, PCF e CSMA/CA
{
  aula: "aula 3 - Padrões IEEE e Redes locais (LANs)",
  tipo: "Contexto",
  texto: "Em uma rede Wi-Fi comercial, o mecanismo de acesso ao meio utilizado pela maioria dos dispositivos não depende de um coordenador central para conceder permissão de transmissão.",
  question: "Esse mecanismo, obrigatório em qualquer rede 802.11, é conhecido como:",
  options: [
    "PCF",
    "DCF",
    "TDMA",
    "FHSS"
  ],
  answer: 1,
  feedback: "A DCF (Distributed Coordination Function) é obrigatória em qualquer rede IEEE 802.11 e utiliza CSMA/CA, diferente da PCF, que é opcional e pouco utilizada na prática."
},

// 26 - Estação oculta e RTS/CTS
{
  aula: "aula 3 - Padrões IEEE e Redes locais (LANs)",
  tipo: "Aplicação",
  texto: "Em uma rede Wi-Fi, as estações B e C não conseguem se enxergar diretamente, mas ambas conseguem se comunicar com a estação A, o que gera colisões frequentes.",
  question: "Qual mecanismo é apresentado como solução para esse problema?",
  options: [
    "CSMA/CD",
    "Handshake RTS/CTS",
    "Fragmentação de frames",
    "FHSS"
  ],
  answer: 1,
  feedback: "O handshake RTS/CTS resolve o problema da estação oculta: ao enviar RTS e receber CTS, a estação informa a duração da transmissão, fazendo com que outras estações aguardem antes de transmitir."
},

// 27 - Arquitetura Bluetooth
{
  aula: "aula 3 - Padrões IEEE e Redes locais (LANs)",
  tipo: "Direta",
  texto: "O Bluetooth organiza seus dispositivos em pequenas redes locais.",
  question: "Quantos dispositivos, no máximo, podem compor uma Piconet, incluindo o dispositivo primário?",
  options: [
    "4",
    "6",
    "8",
    "10"
  ],
  answer: 2,
  feedback: "Uma Piconet é formada por até 8 dispositivos: 1 dispositivo primário (mestre) e até 7 dispositivos secundários (escravos)."
},

// 28 - Enlaces SCO e ACL
{
  aula: "aula 3 - Padrões IEEE e Redes locais (LANs)",
  tipo: "Contexto",
  texto: "Um fone de ouvido Bluetooth precisa transmitir áudio em tempo real com baixa latência, utilizando slots de tempo predeterminados.",
  question: "Qual tipo de enlace Bluetooth é utilizado nesse cenário?",
  options: [
    "ACL",
    "SCO",
    "L2CAP",
    "FHSS"
  ],
  answer: 1,
  feedback: "O enlace SCO (Synchronous Connection-Oriented) é orientado para voz e áudio em tempo real, utilizando slots de tempo predeterminados e apresentando baixa latência."
},

// 29 - Endereçamento MAC
{
  aula: "aula 3 - Padrões IEEE e Redes locais (LANs)",
  tipo: "Direta",
  texto: "O endereçamento MAC identifica exclusivamente a interface de rede de um dispositivo.",
  question: "Qual tipo de entrega MAC envia uma cópia do pacote para todos os computadores da rede?",
  options: [
    "Unicast",
    "Multicast",
    "Broadcast",
    "Anycast"
  ],
  answer: 2,
  feedback: "O endereçamento Broadcast corresponde a todos os computadores da rede, e cada um deles recebe uma cópia do pacote enviado."
},

// 30 - Cálculo de sub-redes
{
  aula: "aula 3 - Padrões IEEE e Redes locais (LANs)",
  tipo: "Aplicação",
  texto: "Uma empresa possui a rede 192.168.0.0/24 e precisa dividi-la em 4 sub-redes, uma para cada departamento, emprestando bits da parte de host.",
  question: "Considerando essa divisão, qual é a quantidade correta de hosts válidos em cada sub-rede resultante?",
  options: [
    "30 hosts válidos",
    "62 hosts válidos",
    "126 hosts válidos",
    "254 hosts válidos"
  ],
  answer: 1,
  feedback: "Ao emprestar 2 bits para criar 4 sub-redes (2² = 4), restam 6 bits para hosts. Aplicando a fórmula 2⁶ − 2, obtém-se 62 hosts válidos por sub-rede, descontando o endereço de rede e o de broadcast."
},
// 31 - Conceito de MAN
{
  aula: "aula 4 - Redes Metropolitanas (MANs)",
  tipo: "Direta",
  texto: "As MANs ocupam uma posição intermediária na hierarquia de redes de computadores.",
  question: "Qual é a principal característica de abrangência de uma MAN?",
  options: [
    "Cobertura limitada a um único prédio",
    "Cobertura em nível de cidade ou região metropolitana",
    "Cobertura regional, nacional ou global",
    "Cobertura restrita a um único cômodo"
  ],
  answer: 1,
  feedback: "A MAN (Metropolitan Area Network) é uma rede de alta velocidade que conecta diversas LANs distribuídas em uma mesma cidade ou região metropolitana."
},

// 32 - Metro Ethernet
{
  aula: "aula 4 - Redes Metropolitanas (MANs)",
  tipo: "Contexto",
  texto: "Uma empresa deseja conectar duas de suas sedes em uma mesma cidade sem precisar instalar roteadores industriais complexos, apenas conectando um cabo diretamente a um switch.",
  question: "Essa facilidade é característica de qual tecnologia de MAN?",
  options: [
    "MPLS",
    "Metro Ethernet",
    "SONET",
    "WiMAX"
  ],
  answer: 1,
  feedback: "O Metro Ethernet é a extensão do protocolo Ethernet para distâncias metropolitanas, permitindo que a conexão entre sedes seja tão simples quanto plugar um cabo em um switch, sem exigir adaptadores complexos do lado do cliente."
},

// 33 - MPLS
{
  aula: "aula 4 - Redes Metropolitanas (MANs)",
  tipo: "Aplicação",
  texto: "Uma operadora de telecomunicações precisa transportar o tráfego de milhares de clientes pela mesma infraestrutura, encaminhando pacotes rapidamente sem que os roteadores intermediários precisem analisar o endereço IP a cada salto.",
  question: "Qual tecnologia permite esse encaminhamento rápido baseado apenas em rótulos?",
  options: [
    "DWDM",
    "ERPS",
    "MPLS",
    "CWDM"
  ],
  answer: 2,
  feedback: "O MPLS (Multiprotocol Label Switching) adiciona um rótulo ao pacote ao entrar na rede, permitindo que os roteadores intermediários encaminhem os dados observando apenas o Label, em um processo chamado Label Swapping."
},

// 34 - Vantagens do MPLS
{
  aula: "aula 4 - Redes Metropolitanas (MANs)",
  tipo: "Direta",
  texto: "O uso do MPLS em MANs Ethernet traz benefícios tanto para operadoras quanto para clientes.",
  question: "Qual recurso do MPLS permite que diferentes empresas compartilhem a mesma infraestrutura física com isolamento lógico entre suas redes?",
  options: [
    "Label Swapping",
    "Engenharia de Tráfego",
    "VPNs MPLS",
    "Qualidade de Serviço"
  ],
  answer: 2,
  feedback: "As VPNs MPLS permitem criar redes privadas virtuais, possibilitando que diferentes empresas utilizem a mesma infraestrutura física da operadora com isolamento lógico entre suas redes."
},

// 35 - Anéis ópticos e resiliência
{
  aula: "aula 4 - Redes Metropolitanas (MANs)",
  tipo: "Aplicação",
  texto: "Em uma via pública de uma grande cidade, uma escavação rompe acidentalmente um cabo de fibra óptica que faz parte de um anel Metro Ethernet, mas os serviços de bancos e hospitais conectados continuam funcionando normalmente.",
  question: "Qual mecanismo é responsável por essa recuperação automática em poucos milissegundos?",
  options: [
    "CWDM",
    "ERPS (Ethernet Ring Protection Switching)",
    "WiMAX",
    "SONET"
  ],
  answer: 1,
  feedback: "O ERPS é o padrão moderno de proteção em anel usado em redes Metro Ethernet; quando ocorre um rompimento, os switches das pontas detectam a falha e liberam o bloqueio lógico, permitindo que os dados fluam pelo caminho oposto do anel em menos de 50 milissegundos."
},

// 36 - Infraestrutura física da MAN
{
  aula: "aula 4 - Redes Metropolitanas (MANs)",
  tipo: "Direta",
  texto: "A infraestrutura de uma MAN é dividida em elementos passivos e ativos.",
  question: "Qual dos itens abaixo é considerado parte da Planta Externa (Passiva) de uma MAN?",
  options: [
    "Switch Metro Ethernet",
    "Amplificador óptico (EDFA)",
    "Fibra Óptica Monomodo (SMF)",
    "Roteador MPLS"
  ],
  answer: 2,
  feedback: "A Fibra Óptica Monomodo (SMF) faz parte da Planta Externa (Passiva), pois não necessita de energia elétrica e tem a função de conduzir o sinal óptico com baixa atenuação em longas distâncias."
},

// 37 - CWDM x DWDM
{
  aula: "aula 4 - Redes Metropolitanas (MANs)",
  tipo: "Contexto",
  texto: "Um provedor de backbone de longa distância precisa transmitir mais de 80 canais em um único filamento de fibra óptica, atingindo taxas superiores a Terabits por segundo.",
  question: "Qual técnica de multiplexação óptica atende a essa necessidade?",
  options: [
    "CWDM",
    "DWDM",
    "MPLS",
    "ERPS"
  ],
  answer: 1,
  feedback: "O DWDM (Dense WDM) permite transmitir mais de 80 canais em um único filamento de fibra, atingindo taxas superiores a Terabits por segundo, sendo utilizado principalmente em backbones e redes de longa distância."
},

// 38 - WMAN
{
  aula: "aula 4 - Redes Metropolitanas (MANs)",
  tipo: "Aplicação",
  texto: "Uma operadora precisa levar conectividade a uma área rural de difícil acesso, onde a instalação de fibra óptica seria muito custosa e demorada.",
  question: "Qual solução é apresentada como alternativa nesse cenário?",
  options: [
    "SONET",
    "SDH",
    "WMAN, utilizando ondas de rádio",
    "DWDM ativo"
  ],
  answer: 2,
  feedback: "A WMAN (Wireless Metropolitan Area Network) utiliza ondas de rádio em vez de cabos, sendo indicada para locais onde a instalação de fibra óptica é inviável, como áreas rurais ou de difícil acesso."
},

// 39 - WiMAX
{
  aula: "aula 4 - Redes Metropolitanas (MANs)",
  tipo: "Direta",
  texto: "O IEEE 802.16 é o padrão mais conhecido para redes metropolitanas sem fio.",
  question: "Qual tecnologia corresponde a esse padrão?",
  options: [
    "Wi-Fi",
    "Bluetooth",
    "WiMAX",
    "Ethernet"
  ],
  answer: 2,
  feedback: "O WiMAX (IEEE 802.16) é a tecnologia mais conhecida para implementação de WMANs, oferecendo acesso em banda larga sem fio em áreas metropolitanas com cobertura de vários quilômetros."
},

// 40 - SONET/SDH e transição tecnológica
{
  aula: "aula 4 - Redes Metropolitanas (MANs)",
  tipo: "Contexto",
  texto: "Durante décadas, uma tecnologia foi a base das redes metropolitanas e de longa distância, mas acabou sendo substituída por soluções mais adequadas à comutação de pacotes IP.",
  question: "Qual foi a principal razão para a substituição do SONET/SDH por tecnologias como Metro Ethernet, MPLS e DWDM?",
  options: [
    "O alto custo de manutenção da fibra óptica monomodo",
    "A mudança do tráfego de voz por comutação de circuitos para dados por comutação de pacotes IP",
    "A proibição do uso de anéis ópticos em áreas urbanas",
    "A substituição total da fibra óptica por enlaces sem fio"
  ],
  answer: 1,
  feedback: "A razão fundamental para a substituição do SONET/SDH foi a mudança do perfil do tráfego, que passou de um mundo focado em voz com comutação de circuitos para um mundo dominado por dados com comutação de pacotes IP."
},
// 41 - Redes celulares x ad hoc
{
  aula: "aula 5 - Introdução a redes móveis e redes ad hoc",
  tipo: "Direta",
  texto: "As redes sem fio podem ser organizadas de formas bastante diferentes quanto à sua estrutura.",
  question: "Qual característica diferencia as Redes Ad-hoc Sem Fio das Redes Celulares Móveis?",
  options: [
    "As redes ad hoc dependem de estações rádio base fixas",
    "As redes ad hoc possuem estrutura descentralizada, com nós atuando como roteadores",
    "As redes celulares não permitem mobilidade entre células",
    "As redes celulares não utilizam ondas de rádio"
  ],
  answer: 1,
  feedback: "As redes ad hoc possuem estrutura descentralizada, na qual os dispositivos se comunicam diretamente entre si e cada nó atua como emissor, receptor e roteador, diferente das redes celulares, que dependem de infraestrutura hierárquica fixa."
},

// 42 - Evolução das gerações móveis
{
  aula: "aula 5 - Introdução a redes móveis e redes ad hoc",
  tipo: "Contexto",
  texto: "Um estudante está organizando uma linha do tempo das gerações de redes móveis e precisa identificar qual geração introduziu a comunicação totalmente digital, com maior qualidade de sinal e possibilidade de criptografia.",
  question: "A qual geração essa descrição corresponde?",
  options: [
    "1G",
    "2G",
    "3G",
    "5G"
  ],
  answer: 1,
  feedback: "A Segunda Geração (2G), lançada em meados de 1991, trouxe a comunicação digital, com melhor qualidade de sinal e a possibilidade de implementar medidas de segurança, como criptografia."
},

// 43 - Características do 5G
{
  aula: "aula 5 - Introdução a redes móveis e redes ad hoc",
  tipo: "Aplicação",
  texto: "Uma cidade inteligente deseja implantar milhares de sensores IoT conectados simultaneamente, exigindo baixíssima latência e alta velocidade de transmissão de dados.",
  question: "Qual geração de rede móvel é mais adequada para atender a essa demanda?",
  options: [
    "3G",
    "4G",
    "5G",
    "2G"
  ],
  answer: 2,
  feedback: "O 5G oferece velocidade de até 10 Gbps, menor latência, baixo consumo de energia e suporte a um maior número de dispositivos conectados, características essenciais para cenários de IoT em larga escala."
},

// 44 - Paging
{
  aula: "aula 5 - Introdução a redes móveis e redes ad hoc",
  tipo: "Contexto",
  texto: "Um celular está ocioso, sem tráfego de dados ou chamadas ativas, quando alguém tenta ligar para esse número. A rede precisa descobrir em qual célula o aparelho está registrado.",
  question: "Esse processo de localização do dispositivo para entrega da chamada é chamado de:",
  options: [
    "Roaming",
    "Handover",
    "Paging",
    "Atualização de localização"
  ],
  answer: 2,
  feedback: "O Paging é o processo pelo qual a rede envia mensagens por várias torres na área onde o dispositivo foi visto pela última vez, a fim de localizá-lo quando há uma chamada ou serviço a ser entregue."
},

// 45 - Roaming
{
  aula: "aula 5 - Introdução a redes móveis e redes ad hoc",
  tipo: "Direta",
  texto: "Ao viajar para outro país, um usuário consegue continuar usando seu número de celular normalmente, graças a acordos entre operadoras.",
  question: "Esse recurso é conhecido como:",
  options: [
    "Handoff",
    "Roaming",
    "Paging",
    "Clusterização"
  ],
  answer: 1,
  feedback: "O Roaming permite que o usuário utilize sua rede móvel fora da área de registro original, em outras regiões ou países, graças aos acordos de roaming firmados entre as operadoras."
},

// 46 - Gerenciamento de segurança em redes móveis
{
  aula: "aula 5 - Introdução a redes móveis e redes ad hoc",
  tipo: "Aplicação",
  texto: "Um atacante interfere intencionalmente na comunicação de uma rede sem fio, bloqueando o sinal e impedindo que os dispositivos se comuniquem corretamente.",
  question: "Esse tipo de ataque é conhecido como:",
  options: [
    "Jamming",
    "Replay",
    "Bisbilhotagem",
    "Sequestro de sessão"
  ],
  answer: 0,
  feedback: "O jamming é um ataque cibernético que interfere ou bloqueia intencionalmente a comunicação em redes sem fio, sendo um dos principais tipos de ataque citados no gerenciamento de segurança de redes móveis."
},

// 47 - Categorias de redes ad hoc
{
  aula: "aula 5 - Introdução a redes móveis e redes ad hoc",
  tipo: "Direta",
  texto: "As redes ad hoc sem fio se dividem em diversas categorias, cada uma com características específicas.",
  question: "Qual categoria de rede ad hoc é voltada especificamente para monitoramento e coleta de dados ambientais, como temperatura e umidade?",
  options: [
    "WMN",
    "WSN",
    "MANET",
    "VANET"
  ],
  answer: 1,
  feedback: "A WSN (Wireless Sensor Network) foi criada para monitoramento e coleta de dados, como temperatura, pressão e umidade, utilizando sensores interconectados que transmitem informações de forma autônoma."
},

// 48 - MANET e VANET
{
  aula: "aula 5 - Introdução a redes móveis e redes ad hoc",
  tipo: "Contexto",
  texto: "Em um evento temporário, sem qualquer infraestrutura de rede fixa disponível, um grupo de dispositivos consegue se comunicar diretamente entre si, com cada dispositivo funcionando também como roteador.",
  question: "Esse cenário descreve uma:",
  options: [
    "WLAN",
    "WMAN",
    "MANET",
    "WPAN"
  ],
  answer: 2,
  feedback: "A MANET (Mobile Ad Hoc Network) é uma rede de dispositivos sem fio que se comunicam diretamente entre si sem necessidade de infraestrutura fixa, muito usada em eventos temporários, operações militares e resgates."
},

// 49 - Tecnologias WPAN
{
  aula: "aula 5 - Introdução a redes móveis e redes ad hoc",
  tipo: "Aplicação",
  texto: "Uma empresa deseja implantar sensores de automação residencial com baixíssimo consumo de energia e alta confiabilidade em topologias mesh, cobrindo distâncias de até 100 metros.",
  question: "Qual tecnologia WPAN é mais adequada para esse cenário?",
  options: [
    "NFC",
    "Bluetooth",
    "ZigBee",
    "IrDA"
  ],
  answer: 2,
  feedback: "O ZigBee é voltado à automação residencial e industrial, apresentando baixo consumo de energia, alta confiabilidade em topologias mesh e alcance de aproximadamente 100 metros."
},

// 50 - Gerenciamento de confiança em redes ad hoc
{
  aula: "aula 5 - Introdução a redes móveis e redes ad hoc",
  tipo: "Direta",
  texto: "Como as redes ad hoc não possuem uma estrutura central, cada nó precisa avaliar o comportamento dos demais para decidir em quem confiar ao retransmitir mensagens.",
  question: "Esse mecanismo baseado na observação do comportamento dos nós é chamado de:",
  options: [
    "Handoff",
    "Clusterização",
    "Mecanismo de reputação",
    "Autoconfiguração"
  ],
  answer: 2,
  feedback: "No Gerenciamento da Confiança, são usados mecanismos de reputação, em que os nós observam o comportamento uns dos outros: quem encaminha corretamente os pacotes ganha confiança, enquanto quem atrapalha ou omite transmissões perde reputação."
},
// 51 - Vulnerabilidade x Ameaça x Ataque
{
  aula: "aula 6 - Introdução à Segurança de Redes",
  tipo: "Contexto",
  texto: "Um servidor corporativo está rodando um sistema operacional desatualizado há meses, e um vírus conhecido que explora justamente essa falha acaba infectando a máquina.",
  question: "Nesse cenário, o que representa o software desatualizado?",
  options: [
    "A ameaça",
    "A vulnerabilidade",
    "O ataque",
    "A mitigação"
  ],
  answer: 1,
  feedback: "O software desatualizado é a vulnerabilidade, ou seja, a fraqueza existente no sistema. O vírus representa a ameaça, e a infecção efetiva é o ataque, quando a ameaça explora a vulnerabilidade."
},

// 52 - Tipos de hackers
{
  aula: "aula 6 - Introdução à Segurança de Redes",
  tipo: "Direta",
  texto: "Existem diferentes categorias de hackers, de acordo com suas intenções e limites éticos.",
  question: "Qual tipo de hacker utiliza suas habilidades para encontrar falhas de segurança com a permissão dos proprietários dos sistemas?",
  options: [
    "Black Hat",
    "Grey Hat",
    "White Hat",
    "Script Kiddie"
  ],
  answer: 2,
  feedback: "Os hackers White Hat, também chamados de hackers éticos, utilizam suas habilidades para proteger sistemas e encontrar falhas de segurança com a permissão dos proprietários."
},

// 53 - Tipos de ataques
{
  aula: "aula 6 - Introdução à Segurança de Redes",
  tipo: "Aplicação",
  texto: "Um site de comércio eletrônico começa a receber um volume anormalmente alto de requisições vindas de diversos locais simultaneamente, tornando o serviço indisponível para os clientes legítimos.",
  question: "Esse cenário descreve qual tipo de ataque?",
  options: [
    "SQL Injection",
    "Ataque de Força Bruta",
    "Ataque de Negação de Serviço (DDoS)",
    "Man-in-the-Middle"
  ],
  answer: 2,
  feedback: "No ataque de Negação de Serviço (DDoS), o atacante sobrecarrega o servidor ou a rede com um grande volume de tráfego, tornando o serviço indisponível para usuários legítimos."
},

// 54 - Legislação brasileira
{
  aula: "aula 6 - Introdução à Segurança de Redes",
  tipo: "Direta",
  texto: "A legislação brasileira possui leis específicas relacionadas a crimes cibernéticos e proteção de dados.",
  question: "Qual lei introduziu no Código Penal o crime de invasão de dispositivo de informática?",
  options: [
    "LGPD",
    "Lei Carolina Dieckmann",
    "Lei nº 14.811/2024",
    "Lei nº 14.155/2021"
  ],
  answer: 1,
  feedback: "A Lei Carolina Dieckmann (Lei nº 12.737/2012) introduziu no Código Penal o crime de invasão de dispositivo de informática."
},

// 55 - WannaCry
{
  aula: "aula 6 - Introdução à Segurança de Redes",
  tipo: "Contexto",
  texto: "Em maio de 2017, um ataque cibernético global criptografou arquivos de centenas de milhares de computadores em diversos países, exigindo pagamento em criptomoeda para liberar o acesso.",
  question: "Qual vulnerabilidade específica foi explorada por esse ataque para se espalhar automaticamente?",
  options: [
    "Uma falha no protocolo HTTPS",
    "A vulnerabilidade EternalBlue no protocolo SMBv1 do Windows",
    "Uma falha de configuração em firewalls corporativos",
    "Uma vulnerabilidade no algoritmo RSA"
  ],
  answer: 1,
  feedback: "O WannaCry se espalhou explorando a vulnerabilidade EternalBlue, uma falha no protocolo SMBv1 do Windows, que havia sido descoberta pela NSA e vazado pelo grupo Shadow Brokers."
},

// 56 - Criptografia simétrica x assimétrica
{
  aula: "aula 6 - Introdução à Segurança de Redes",
  tipo: "Aplicação",
  texto: "Um servidor precisa enviar uma chave secreta para um cliente de forma segura pela internet, utilizando um par de chaves em que uma pode ser divulgada publicamente e a outra deve permanecer em sigilo.",
  question: "Esse mecanismo de troca de chaves está associado a qual tipo de criptografia?",
  options: [
    "Criptografia simétrica de bloco",
    "Criptografia simétrica de fluxo",
    "Criptografia assimétrica",
    "Função hash"
  ],
  answer: 2,
  feedback: "A criptografia assimétrica utiliza um par de chaves — uma pública e uma privada — permitindo que a chave pública seja compartilhada livremente, enquanto a chave privada permanece em sigilo, sendo comumente usada para trocar chaves simétricas com segurança."
},

// 57 - AES e DES
{
  aula: "aula 6 - Introdução à Segurança de Redes",
  tipo: "Direta",
  texto: "Diferentes algoritmos de criptografia simétrica de bloco foram desenvolvidos ao longo do tempo, com níveis distintos de segurança.",
  question: "Qual característica torna o DES considerado inseguro atualmente?",
  options: [
    "Ele não realiza permutação dos bits",
    "O tamanho pequeno da chave, facilmente quebrável por força bruta",
    "Ele não utiliza blocos de dados",
    "Ele depende exclusivamente de chaves assimétricas"
  ],
  answer: 1,
  feedback: "O DES é considerado inseguro hoje principalmente devido ao tamanho pequeno de sua chave (56 bits efetivos), o que o torna vulnerável a ataques de força bruta com o poder computacional atual."
},

// 58 - Funções hash e assinaturas digitais
{
  aula: "aula 6 - Introdução à Segurança de Redes",
  tipo: "Contexto",
  texto: "Um destinatário recebe uma mensagem assinada digitalmente e, ao recalcular o hash da mensagem recebida e compará-lo com o hash decifrado da assinatura, percebe que os valores são diferentes.",
  question: "O que essa diferença de hashes indica?",
  options: [
    "Que a mensagem é autêntica e íntegra",
    "Que a mensagem foi alterada ou a assinatura é falsa",
    "Que a chave pública do remetente expirou",
    "Que o algoritmo de hash utilizado é inválido"
  ],
  answer: 1,
  feedback: "Se os hashes não coincidirem, isso indica que a mensagem foi alterada durante a transmissão ou que a assinatura digital é falsa, comprometendo a integridade e a autenticidade da comunicação."
},

// 59 - Firewalls
{
  aula: "aula 6 - Introdução à Segurança de Redes",
  tipo: "Aplicação",
  texto: "Uma empresa deseja proteger toda a sua rede corporativa com um único equipamento dedicado, capaz de oferecer alto desempenho e manutenção centralizada, em vez de instalar proteção em cada computador individualmente.",
  question: "Qual tipo de firewall atende melhor a essa necessidade?",
  options: [
    "Firewall de software instalado em cada máquina",
    "Firewall de hardware",
    "Antivírus local",
    "Sistema de autenticação multifator"
  ],
  answer: 1,
  feedback: "O firewall de hardware é instalado em um equipamento dedicado e protege toda a rede, oferecendo alto desempenho e manutenção centralizada, diferente do firewall de software, que protege apenas o dispositivo individual."
},

// 60 - VPN e protocolos seguros
{
  aula: "aula 6 - Introdução à Segurança de Redes",
  tipo: "Direta",
  texto: "Diferentes protocolos garantem comunicação segura em camadas específicas do modelo OSI.",
  question: "Qual protocolo atua na camada de rede (Camada 3), protegendo diretamente os pacotes IP e sendo amplamente usado em VPNs corporativas?",
  options: [
    "SSL/TLS",
    "SSH",
    "IPSec",
    "HTTPS"
  ],
  answer: 2,
  feedback: "O IPSec (Internet Protocol Security) atua na camada de rede (Camada 3), protegendo diretamente os pacotes IP transmitidos entre hosts, roteadores ou gateways, sendo muito utilizado em VPNs corporativas."
}
  ],

  ava: [
    // aula: 

// 1 - Modos de operação em redes sem fio e asserções sobre mobilidade
{
  aula: "Revisão da Luzia",
  texto: "Redes sem fio podem operar em diferentes modos, como no modo infraestrutura, onde os dispositivos se comunicam através de um ponto de acesso (access point), ou o modo ad hoc, onde os dispositivos se comunicam diretamente entre si.\n\nFOROUZAN, Behrouz A. Comunicação de Dados e Redes de Computadores. 5. ed. Porto Alegre: AMGH, 2013.\n\nAvalie as asserções a seguir e a relação proposta entre elas.\n\nI. Em redes sem fio, a mobilidade dos usuários exige mecanismos de gerenciamento da conexão quando eles se deslocam entre diferentes pontos de acesso.\n\nPORQUE\n\nII. O meio de transmissão compartilhado (ar) permite que os bits sejam enviados sem qualquer risco de perda ou atenuação do sinal.",
  question: "A respeito dessas asserções, assinale a opção correta.",
  code: ``,
  options: [
    "As asserções I e II são proposições falsas.",
    "A asserção I é verdadeira, e a II é falsa.",
    "As asserções I e II são verdadeiras, e a II é uma justificativa correta da I.",
    "As asserções I e II são verdadeiras, mas a II não justifica a I."
  ],
  answer: 1,
  feedback: "A resposta correta é: A asserção I é verdadeira, e a II é falsa.",
  chips: []
},

// 2 - Divisão de sub-redes IPv4
{
  aula: "Revisão da Luzia",
  texto: "Uma empresa possui a rede IPv4 192.168.10.0/24 e precisa dividi-la em 4 sub-redes de mesmo tamanho, destinadas a diferentes setores da organização. Cada sub-rede deverá possuir a mesma quantidade de endereços IP.",
  question: "Considerando a divisão da rede 192.168.10.0/24 em 4 sub-redes, assinale a alternativa que apresenta corretamente a nova máscara de sub-rede e a quantidade de endereços IP válidos para hosts em cada sub-rede.",
  code: ``,
  options: [
    "Máscara /25 (255.255.255.128) e cada sub-rede contendo 126 IPs válidos.",
    "Máscara /26 (255.255.255.192) e cada sub-rede contendo 62 IPs válidos.",
    "Máscara /28 (255.255.255.240) e cada sub-rede contendo 14 IPs válidos.",
    "Máscara /27 (255.255.255.224) e cada sub-rede contendo 30 IPs válidos."
  ],
  answer: 1,
  feedback: "A resposta correta é: Máscara /26 (255.255.255.192) e cada sub-rede contendo 62 IPs válidos.",
  chips: []
},

// 3 - Localização do dispositivo em rede celular
{
  aula: "Revisão da Luzia",
  texto: "Um usuário possui um smartphone conectado a uma rede celular e recebe uma chamada enquanto está em deslocamento pela cidade. Para estabelecer a comunicação, a rede precisa identificar em qual área de cobertura o dispositivo está localizado, sem necessariamente conhecer sua posição exata.",
  question: "Nesse cenário, qual operação da rede celular é responsável por localizar o dispositivo para que a chamada possa ser encaminhada?",
  code: ``,
  options: [
    "Paging, que permite à rede localizar o dispositivo quando há uma chamada ou serviço a ser entregue.",
    "Roaming, que permite ao dispositivo utilizar redes de diferentes áreas geográficas.",
    "Handover, que consiste no cadastro permanente do dispositivo em uma nova área geográfica.",
    "Atualização da localização, que ocorre somente quando o dispositivo estabelece uma chamada."
  ],
  answer: 0,
  feedback: "A resposta correta é: Paging, que permite à rede localizar o dispositivo quando há uma chamada ou serviço a ser entregue.",
  chips: []
},

// 4 - Capacidade de transmissão do canal
{
  aula: "Revisão da Luzia",
  texto: "Uma organização pretende aumentar a capacidade de transmissão de dados de um enlace. Durante a análise, a equipe identifica que a capacidade do canal está relacionada à largura de banda disponível, aos níveis de sinal utilizados e à qualidade do canal. Também se considera a presença de ruídos durante a transmissão.",
  question: "Com base nessas características, assinale a alternativa correta.",
  code: ``,
  options: [
    "O ruído aumenta a capacidade máxima de transmissão porque adiciona informações ao sinal original.",
    "A taxa de transmissão depende exclusivamente do tipo de cabo utilizado, independentemente da largura de banda e do ruído.",
    "O aumento da quantidade de níveis de sinal pode permitir a transmissão de mais bits por símbolo, enquanto o aumento do ruído tende a reduzir a taxa máxima de transmissão.",
    "A largura de banda não possui relação com a quantidade de dados que pode ser transmitida pelo canal."
  ],
  answer: 2,
  feedback: "A resposta correta é: O aumento da quantidade de níveis de sinal pode permitir a transmissão de mais bits por símbolo, enquanto o aumento do ruído tende a reduzir a taxa máxima de transmissão.",
  chips: []
},

// 5 - Funcionamento do CRC no controle de erros
{
  aula: "Revisão da Luzia",
  texto: "Durante a transmissão de um quadro, alguns bits podem ser alterados em razão das imperfeições existentes no meio de comunicação. Para identificar se o quadro recebido sofreu alterações, o receptor utiliza um mecanismo de detecção de erros antes de confirmar o recebimento ao transmissor.",
  question: "Assinale a alternativa que descreve corretamente o funcionamento do CRC no processo de controle de erros.",
  code: ``,
  options: [
    "O CRC substitui os quadros de dados por sinais analógicos antes da transmissão.",
    "O CRC corrige automaticamente todos os bits alterados sem necessidade de nova transmissão.",
    "O CRC é utilizado para detectar possíveis erros no quadro recebido, permitindo que mecanismos de retransmissão sejam acionados quando necessário.",
    "O CRC controla exclusivamente a velocidade com que o transmissor envia os quadros."
  ],
  answer: 2,
  feedback: "A resposta correta é: O CRC é utilizado para detectar possíveis erros no quadro recebido, permitindo que mecanismos de retransmissão sejam acionados quando necessário.",
  chips: []
},

// 6 - Finalidade do checksum na Camada de Enlace
{
  aula: "Revisão da Luzia",
  texto: "Durante a transmissão de dados em uma rede de computadores, um quadro pode sofrer alterações devido a ruídos e outras interferências presentes no meio de transmissão. Para aumentar a confiabilidade da comunicação, o receptor pode utilizar mecanismos de detecção de erros para verificar se os dados recebidos correspondem aos dados enviados.",
  question: "Considerando o mecanismo de checksum da Camada de Enlace, assinale a alternativa que descreve corretamente sua finalidade.",
  code: ``,
  options: [
    "Determinar a largura de banda e a taxa máxima de transmissão do meio físico.",
    "Dividir os dados em partes, realizar operações matemáticas sobre elas e utilizar o resultado como informação de verificação para identificar possíveis erros na transmissão.",
    "Corrigir automaticamente qualquer bit alterado durante a transmissão, sem necessidade de retransmissão.",
    "Controlar a quantidade de quadros que o transmissor pode enviar antes de receber uma confirmação."
  ],
  answer: 1,
  feedback: "A resposta correta é: Dividir os dados em partes, realizar operações matemáticas sobre elas e utilizar o resultado como informação de verificação para identificar possíveis erros na transmissão.",
  chips: []
},

// 7 - Diferença entre Checksum e CRC
{
  aula: "Revisão da Luzia",
  texto: "Durante a transmissão de dados, podem ocorrer alterações nas informações devido a ruídos e interferências no meio físico. Para identificar possíveis erros, a camada de enlace pode utilizar mecanismos de detecção, como Checksum e CRC (Cyclic Redundancy Check).",
  question: "Considerando as características desses dois mecanismos, assinale a alternativa que apresenta uma diferença adequada entre eles.",
  code: ``,
  options: [
    "O Checksum corrige automaticamente os erros encontrados, enquanto o CRC apenas identifica a posição exata do bit incorreto.",
    "O Checksum e o CRC são mecanismos de correção de erros e, por isso, não necessitam de retransmissão quando um erro é detectado.",
    "O Checksum é utilizado para controle de fluxo, enquanto o CRC é utilizado para controle de congestionamento.",
    "O Checksum utiliza operações matemáticas sobre os dados para gerar um valor de verificação, enquanto o CRC utiliza operações baseadas em divisão polinomial para gerar informações de verificação."
  ],
  answer: 3,
  feedback: "A resposta correta é: O Checksum utiliza operações matemáticas sobre os dados para gerar um valor de verificação, enquanto o CRC utiliza operações baseadas em divisão polinomial para gerar informações de verificação.",
  chips: []
},

// 8 - Diferença operacional entre Hub e Switch
{
  aula: "Revisão da Luzia",
  texto: "Os equipamentos de interconexão são componentes fundamentais para estruturar a topologia de redes de computadores, permitindo a agregação física e o tráfego ordenado de informações entre estações terminais em ambientes corporativos e domésticos. Historicamente, a evolução de dispositivos de compartilhamento elétrico em barramentos compartilhados até soluções inteligentes baseadas em microprocessadores dedicados moldou a eficiência das redes locais cabeadas (LANs). Essa transição tecnológica permitiu o isolamento de domínios de colisão e maximizou a capacidade de transmissão de dados de forma simultânea sem sobrecarregar as interfaces físicas das estações adjacentes.\n\nFOROUZAN, Behrouz A.; MOSHARRAF, Firouz. Redes de computadores: uma abordagem top-down. AMGH Editora, 2013.",
  question: "Diante do contexto e da evolução dos dispositivos de conexão, a principal diferença operacional entre um Hub e um Switch consiste no fato de que o Hub:",
  code: ``,
  options: [
    "Encaminha quadros com base no endereço IP de destino.",
    "Opera exclusivamente na camada física de dados.",
    "Filtra e envia quadros diretamente para a porta do nó de destino.",
    "Repete o sinal elétrico recebido para todas as suas portas."
  ],
  answer: 3,
  feedback: "A resposta correta é: Repete o sinal elétrico recebido para todas as suas portas.",
  chips: []
},

// 9 - Tamanho do espaço de endereçamento IPv4 e IPv6
{
  aula: "Revisão da Luzia",
  texto: "O crescimento acelerado da Internet nas últimas décadas, impulsionado pela consolidação de tecnologias móveis e pelo surgimento da Internet das Coisas (IoT), causou um impacto direto na infraestrutura lógica global de conectividade. Esse avanço tecnológico evidenciou gargalos críticos de exaustão relacionados à quantidade de identificadores exclusivos atribuíveis a novos nós computacionais ativos em rede. Como resposta técnica definitiva para contornar essa escassez de espaço numérico e aprimorar a eficiência do processamento de pacotes por roteadores principais no núcleo da rede mundial, projetou-se uma evolução estrutural. O esgotamento dos endereços disponíveis na rede mundial motivou a concepção de uma nova versão para o protocolo IP.\n\nFOROUZAN, Behrouz A.; MOSHARRAF, Firouz. Redes de computadores: uma abordagem top-down. AMGH Editora, 2013.",
  question: "Com relação ao tamanho do espaço de endereçamento lógico do IPv4 e do IPv6, assinale a alternativa correta.",
  code: ``,
  options: [
    "O IPv4 utiliza 32 bits e o IPv6 utiliza 128 bits.",
    "O IPv4 utiliza 16 bits e o IPv6 utiliza 32 bits.",
    "O IPv4 utiliza 64 bits e o IPv6 utiliza 128 bits.",
    "O IPv4 utiliza 32 bits e o IPv6 utiliza 64 bits."
  ],
  answer: 0,
  feedback: "A resposta correta é: O IPv4 utiliza 32 bits e o IPv6 utiliza 128 bits.",
  chips: []
},

// 10 - Perda de potência do sinal com a distância
{
  aula: "Revisão da Luzia",
  texto: "Uma empresa identificou que os computadores de uma determinada rede apresentam perda de desempenho à medida que aumenta a distância entre o transmissor e o receptor. Em uma análise do meio físico, observou-se que o sinal chega ao destino com menor potência do que aquela apresentada na origem.",
  question: "Considerando os fenômenos que podem ocorrer durante a transmissão, a situação descrita está diretamente relacionada à",
  code: ``,
  options: [
    "modulação, pois o sinal precisa alterar sua frequência para compensar a distância.",
    "multiplexação, pois diferentes sinais passam a compartilhar o mesmo meio físico.",
    "atenuação, pois ocorre perda de energia do sinal durante sua propagação.",
    "distorção, pois diferentes componentes do sinal chegam ao destino em tempos diferentes."
  ],
  answer: 2,
  feedback: "A resposta correta é: atenuação, pois ocorre perda de energia do sinal durante sua propagação.",
  chips: []
},

// 11 - Mecanismo de detecção de erro em quadro Ethernet
{
  aula: "Revisão da Luzia",
  texto: "Durante a transmissão de um quadro Ethernet, o receptor utiliza um mecanismo baseado em um polinômio gerador previamente definido. O transmissor acrescenta bits ao final da mensagem e realiza uma divisão binária utilizando a operação XOR. No receptor, a mesma divisão é realizada novamente.",
  question: "Nesse contexto, o mecanismo descrito corresponde ao",
  code: ``,
  options: [
    "Código de Hamming.",
    "CRC.",
    "checksum.",
    "bit de paridade."
  ],
  answer: 1,
  feedback: "A resposta correta é: CRC.",
  chips: []
},

// 12 - Protocolo de retransmissão com quadros corrompidos
{
  aula: "Revisão da Luzia",
  texto: "Uma aplicação utiliza uma rede na qual determinados quadros podem ser corrompidos durante a transmissão. O protocolo empregado permite transmitir vários quadros antes da chegada das confirmações. Quando um quadro é identificado como incorreto, os quadros posteriores também são retransmitidos, mesmo que tenham chegado corretamente ao receptor.",
  question: "Considerando o comportamento descrito, o protocolo utilizado é o",
  code: ``,
  options: [
    "Go-Back-N ARQ.",
    "Selective Repeat ARQ.",
    "protocolo mais simples possível.",
    "Stop-and-Wait ARQ."
  ],
  answer: 0,
  feedback: "A resposta correta é: Go-Back-N ARQ.",
  chips: []
},

// 13 - Tecnologias de redes sem fio WLAN e WMAN
{
  aula: "Revisão da Luzia",
  texto: "Uma instituição pretende ampliar sua infraestrutura de comunicação sem fio para atender a duas necessidades distintas. A primeira é oferecer conectividade sem fio em uma área local, como salas de aula, laboratórios e setores administrativos. A segunda é estabelecer uma rede sem fio com cobertura mais ampla, capaz de atender uma região metropolitana.",
  question: "Considerando as classificações de redes sem fio e os padrões IEEE associados, assinale a alternativa que apresenta corretamente as tecnologias correspondentes às duas necessidades, respectivamente.",
  code: ``,
  options: [
    "WMAN, baseada no IEEE 802.11, e WLAN, associada ao IEEE 802.16.",
    "WLAN, baseada no IEEE 802.11, e WMAN, associada ao IEEE 802.16.",
    "WLAN, baseada no IEEE 802.16, e WMAN, associada ao IEEE 802.11.",
    "WMAN, baseada no IEEE 802.3, e WLAN, associada ao IEEE 802.15."
  ],
  answer: 1,
  feedback: "A resposta correta é: WLAN, baseada no IEEE 802.11, e WMAN, associada ao IEEE 802.16.",
  chips: []
},

// 14 - Mecanismo do IEEE 802.11 para reduzir colisões (estações ocultas)
{
  aula: "Revisão da Luzia",
  texto: "Em uma rede Wi-Fi de uma instituição de ensino, duas estações estão posicionadas de modo que não conseguem detectar diretamente as transmissões uma da outra. Ambas, entretanto, conseguem se comunicar com o mesmo roteador. Em determinado momento, as duas iniciam transmissões simultaneamente, provocando uma colisão.",
  question: "Para reduzir esse problema, o mecanismo estudado no IEEE 802.11 que pode ser utilizado é o",
  code: ``,
  options: [
    "CRC associado ao endereço IP.",
    "full-duplex associado ao endereço MAC.",
    "CSMA/CD associado ao uso de hubs.",
    "RTS/CTS associado ao CSMA/CA."
  ],
  answer: 3,
  feedback: "A resposta correta é: RTS/CTS associado ao CSMA/CA.",
  chips: []
},

// 15 - Uso do MPLS em infraestrutura metropolitana
{
  aula: "Revisão da Luzia",
  texto: "Uma operadora de telecomunicações possui diversas empresas clientes conectadas por uma infraestrutura metropolitana. Embora os clientes utilizem Ethernet, a operadora precisa transportar o tráfego de milhares de clientes pelo seu backbone, mantendo isolamento lógico entre diferentes redes.",
  question: "Nesse cenário, o uso do MPLS permite à operadora",
  code: ``,
  options: [
    "substituir todos os endereços IP dos clientes por endereços MAC.",
    "eliminar a necessidade de qualquer equipamento de camada de enlace.",
    "encaminhar os pacotes utilizando rótulos e estabelecer caminhos diferenciados dentro da infraestrutura da operadora.",
    "transformar automaticamente uma rede MAN em uma rede LAN sem fio."
  ],
  answer: 2,
  feedback: "A resposta correta é: encaminhar os pacotes utilizando rótulos e estabelecer caminhos diferenciados dentro da infraestrutura da operadora.",
  chips: []
},
  ]


};