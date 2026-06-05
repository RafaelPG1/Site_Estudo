// ============================================================
// NEXUS STUDY — quiz/conteudo/2026/AP2/redes.js
// Questões de Redes de Computadores
// ============================================================

window.questoes = {

  questoes: [
 
  // ============================================================
  // PARTE 1 — Camada de Aplicação e Socket (10 questões)
  // ============================================================
  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Explicativa",
    texto: "A Camada de Aplicação é a 5ª camada da pilha TCP/IP e representa a interface direta entre o usuário e a rede. Uma característica fundamental que a diferencia das demais é que ela ==rule==NÃO fornece serviços para outras camadas== — ela apenas consome serviços da camada de transporte. Isso torna essa camada extremamente flexível: novos protocolos podem ser criados ou removidos sem impactar as camadas inferiores.",
    question: "Qual é a característica que torna a Camada de Aplicação única em relação às demais camadas da pilha TCP/IP?",
    options: [
      "É a única camada que fornece serviços para todas as outras camadas da pilha.",
      "É a única camada que não fornece serviços para outras camadas — apenas consome serviços da camada de transporte.",
      "É a única camada que se comunica diretamente com o hardware de rede.",
      "É a única camada que utiliza endereços IP para identificar processos."
    ],
    answer: 1,
    feedback: "==rule==A Camada de Aplicação só consome serviços== (da camada de transporte) e nunca os fornece para camadas inferiores, o que garante sua flexibilidade para criar e remover protocolos livremente."
  },
  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Contextualizada",
    texto: "Imagine que você é um desenvolvedor criando um aplicativo de chat. Para que seu app se comunique pela rede, você precisa de uma API que abstraia toda a complexidade física da transmissão. A Interface Socket faz exatamente isso: ela permite enviar e receber dados como se você estivesse lendo e escrevendo em um arquivo comum. Um socket é identificado de forma única pela combinação de ==def==Endereço IP== (identifica a máquina) e ==def==Número de Porta== (identifica o processo específico).",
    question: "Um programador precisa identificar unicamente o processo do servidor de e-mail em uma máquina na rede. Qual par de informações forma essa identificação única?",
    options: [
      "Nome do domínio + protocolo de transporte.",
      "Endereço MAC + número de porta.",
      "Endereço IP + número de porta.",
      "Endereço IP + nome do sistema operacional."
    ],
    answer: 2,
    feedback: "O socket é identificado pela combinação de ==def==Endereço IP== (32 bits no IPv4, identifica a máquina) e ==def==número de porta== (16 bits, identifica o processo). Juntos, eles apontam para um processo específico em uma máquina específica na rede."
  },
  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Explicativa",
    texto: "A Camada de Aplicação na pilha TCP/IP ocupa a posição mais próxima do usuário. Ela utiliza os serviços oferecidos pela Camada de Transporte (TCP ou UDP) para estabelecer comunicação entre processos em máquinas diferentes. Os protocolos que residem nessa camada incluem HTTP, FTP, SMTP, DNS e SSH.",
    question: "Qual camada da pilha TCP/IP fornece serviços diretamente à Camada de Aplicação?",
    options: [
      "Camada de Rede.",
      "Camada de Enlace.",
      "Camada de Transporte.",
      "Camada Física."
    ],
    answer: 2,
    feedback: "A ==rule==Camada de Transporte== é a única que fornece serviços à Camada de Aplicação. Ela oferece dois protocolos principais: TCP (confiável, orientado à conexão) e UDP (não confiável, sem conexão), que a aplicação escolhe conforme sua necessidade."
  },
  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Aplicação",
    texto: "Portas de rede são divididas em categorias pelo IANA: portas bem conhecidas (0–1023), reservadas para serviços padrão do sistema; portas registradas (1024–49151), para aplicações específicas; e portas dinâmicas/efêmeras (49152–65535), usadas temporariamente por clientes. Por exemplo, HTTP usa a porta ==def==80==, HTTPS usa ==def==443==, e SSH usa ==def==22==.",
    question: "Um servidor web padrão (HTTP) está aguardando conexões. Em qual porta ele tipicamente escuta?",
    options: [
      "Porta 21.",
      "Porta 25.",
      "Porta 80.",
      "Porta 443."
    ],
    answer: 2,
    feedback: "O protocolo HTTP usa a ==def==porta 80== por padrão. A porta 443 é reservada ao HTTPS (HTTP seguro), a porta 21 ao FTP e a porta 25 ao SMTP. Essas são portas bem conhecidas (0–1023), controladas pelo IANA."
  },
  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Contextualizada",
    texto: "Dois modelos de comunicação são utilizados na Camada de Aplicação: o ==def==modelo cliente-servidor== e o ==def==modelo P2P (peer-to-peer)==. No modelo cliente-servidor, existe um servidor sempre ativo com IP fixo que atende requisições de múltiplos clientes. No modelo P2P, não há servidor central: os próprios peers se comunicam diretamente, o que garante maior escalabilidade e resiliência.",
    question: "Uma startup quer construir um serviço de streaming de vídeo que escale facilmente sem necessitar de servidores centrais caros. Qual modelo arquitetural da Camada de Aplicação seria mais adequado?",
    options: [
      "Modelo cliente-servidor tradicional, pois garante maior controle sobre os dados.",
      "Modelo P2P, pois distribui a carga entre os próprios usuários, escalando naturalmente.",
      "Modelo híbrido DNS, pois usa servidores de nome para balancear o tráfego.",
      "Modelo de camada única, pois elimina a necessidade de transporte."
    ],
    answer: 1,
    feedback: "O ==def==modelo P2P== distribui a carga entre os participantes da rede, permitindo que cada usuário seja simultaneamente cliente e servidor. Isso elimina a dependência de infraestrutura central e permite escalabilidade orgânica — ideal para streaming colaborativo."
  },
  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Explicativa",
    texto: "A Interface Socket é a ==def==API (Application Programming Interface)== que separa a Camada de Aplicação da Camada de Transporte. Ela abstrai os detalhes da transmissão de dados: o desenvolvedor trabalha com operações simples de leitura e escrita, enquanto a pilha de protocolos cuida de segmentação, roteamento e entrega. O socket é criado pelo sistema operacional e gerenciado em espaço de kernel.",
    question: "Qual é o papel principal da Interface Socket no contexto da Camada de Aplicação?",
    options: [
      "Criptografar todos os dados antes de enviá-los pela rede.",
      "Servir como API que abstrai a complexidade da transmissão, permitindo ao desenvolvedor tratar a rede como leitura/escrita de arquivo.",
      "Gerenciar o roteamento de pacotes entre redes diferentes.",
      "Converter endereços IP em nomes de domínio legíveis."
    ],
    answer: 1,
    feedback: "A ==def==Interface Socket== é a fronteira entre o código da aplicação e a pilha de protocolos. Ela expõe operações simples (send, recv, bind, listen, accept) que escondem toda a complexidade de TCP/IP, permitindo que o programador foque na lógica da aplicação."
  },
  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Aplicação",
    texto: "Ao desenvolver um socket TCP, o servidor precisa executar uma sequência de chamadas de sistema: criar o socket, fazer o ==proc==bind== (associar ao endereço e porta), colocar em modo ==proc==listen== (aguardar conexões) e chamar ==proc==accept== (aceitar uma conexão de cliente). Já o cliente cria o socket e chama ==proc==connect== diretamente para o endereço do servidor.",
    question: "Em uma aplicação cliente-servidor TCP, qual chamada de sistema o servidor deve executar para associar seu socket a um endereço IP e porta específicos?",
    options: [
      "connect()",
      "accept()",
      "bind()",
      "listen()"
    ],
    answer: 2,
    feedback: "A chamada ==proc==bind()== é responsável por associar o socket a um endereço IP e número de porta locais. Sem ela, o sistema operacional não sabe em qual porta o servidor deve escutar as conexões entrantes. Somente após o bind o servidor pode chamar listen() e depois accept()."
  },
  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Contextualizada",
    texto: "O ==def==número de porta== é um inteiro de 16 bits, o que permite valores de 0 a 65535. Isso significa que um único computador pode executar até 65536 processos diferentes, cada um identificado por uma porta única. Quando um cliente abre uma conexão, o sistema operacional atribui automaticamente uma ==def==porta efêmera== (normalmente acima de 49151) para identificar aquela conversa específica.",
    question: "Por que o sistema operacional atribui automaticamente uma porta efêmera ao cliente quando ele abre uma conexão TCP?",
    options: [
      "Para evitar que o servidor saiba qual porta o cliente está usando.",
      "Para identificar unicamente aquela conexão no lado do cliente, permitindo múltiplas conexões simultâneas ao mesmo servidor.",
      "Para garantir que o cliente use sempre a mesma porta em todas as conexões.",
      "Para reservar as portas baixas ao uso exclusivo do servidor."
    ],
    answer: 1,
    feedback: "A ==def==porta efêmera== permite que o sistema operacional diferencie múltiplas conexões simultâneas do mesmo cliente para o mesmo servidor. Sem ela, seria impossível distinguir, por exemplo, 10 abas do navegador abertas no mesmo site — todas iriam para a porta 80 do servidor, mas cada uma tem sua porta efêmera distinta."
  },
  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Explicativa",
    texto: "A Camada de Aplicação pode escolher entre dois protocolos de transporte: ==def==TCP== e ==def==UDP==. O TCP oferece entrega garantida, controle de fluxo, controle de congestionamento e ordenação de pacotes — ao custo de maior overhead e latência. O UDP é mais simples e rápido, sem garantias de entrega, sendo preferido por aplicações que toleram perdas mas exigem baixa latência, como videoconferências e jogos online.",
    question: "Uma aplicação de videoconferência em tempo real precisa de baixa latência e pode tolerar perda ocasional de pacotes. Qual protocolo de transporte é mais indicado?",
    options: [
      "TCP, pois garante a entrega ordenada de todos os pacotes.",
      "UDP, pois oferece menor overhead e latência sem retransmissões.",
      "HTTP, pois é o protocolo padrão para comunicação em tempo real.",
      "FTP, pois é otimizado para transmissão contínua de dados."
    ],
    answer: 1,
    feedback: "O ==def==UDP== é preferido para videoconferência porque elimina o overhead de estabelecimento de conexão e retransmissões do TCP. Uma pequena perda de pacote resulta apenas em um breve artefato visual — muito melhor do que o atraso causado pela retransmissão TCP, que tornaria a conversa ininteligível."
  },
  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Aplicação",
    texto: "No modelo cliente-servidor, o servidor é caracterizado por ter um ==rule==endereço IP fixo e bem conhecido== e por estar ==rule==sempre ativo==, aguardando conexões. Os clientes podem ter IPs dinâmicos e se conectam ao servidor sob demanda. Clientes não se comunicam diretamente entre si nesse modelo — toda comunicação passa pelo servidor.",
    question: "Qual das seguintes afirmações descreve corretamente uma característica obrigatória de um servidor no modelo cliente-servidor?",
    options: [
      "O servidor pode estar offline quando não há requisições, ligando-se automaticamente ao receber uma conexão.",
      "O servidor deve ter endereço IP fixo e estar sempre ativo para que os clientes possam encontrá-lo.",
      "O servidor pode usar IP dinâmico, desde que notifique os clientes a cada mudança.",
      "O servidor só aceita um cliente por vez para evitar concorrência de dados."
    ],
    answer: 1,
    feedback: "No modelo cliente-servidor, o servidor precisa de ==rule==IP fixo e disponibilidade contínua==. Se o IP mudasse ou o servidor ficasse offline, os clientes não conseguiriam localizá-lo. Essa é a principal diferença em relação ao P2P, onde não existe esse ponto central de dependência."
  },
 
  // ============================================================
  // PARTE 2 — HTTP e Cookies (10 questões)
  // ============================================================
  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Aplicação",
    texto: "Ao carregar uma página web com 10 imagens usando HTTP não persistente, o navegador precisa abrir e fechar uma conexão TCP para cada objeto (a página HTML + cada imagem). Cada conexão exige 1 RTT para o handshake TCP e mais 1 RTT para a requisição HTTP, totalizando 2 RTT por objeto. Já com HTTP persistente (padrão do HTTP/1.1), o handshake é feito uma única vez e os demais objetos reutilizam a mesma conexão.",
    question: "Usando HTTP não persistente, quantos RTTs são necessários para baixar uma página HTML mais 3 imagens separadas (considerando apenas RTTs de handshake e requisição)?",
    options: [
      "4 RTTs no total.",
      "8 RTTs no total.",
      "6 RTTs no total.",
      "2 RTTs no total."
    ],
    answer: 1,
    feedback: "Com HTTP não persistente, cada objeto exige 2 RTTs (1 para handshake TCP + 1 para a requisição HTTP). Com 4 objetos (1 HTML + 3 imagens): 4 × 2 = ==mark==8 RTTs no total==. O HTTP persistente reduziria drasticamente esse número."
  },
  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Explicativa",
    texto: "O protocolo HTTP é classificado como ==term==stateless== (sem estado): o servidor não guarda nenhuma informação sobre requisições anteriores do cliente. Para contornar essa limitação — por exemplo, para manter um carrinho de compras ativo entre páginas — foi criado o mecanismo de Cookies. O servidor envia um cabeçalho `Set-Cookie` na resposta; o navegador armazena esse valor e o reenvia automaticamente em cada requisição futura ao mesmo servidor.",
    question: "Por que os Cookies foram criados para uso no protocolo HTTP?",
    options: [
      "Para criptografar as mensagens HTTP e garantir segurança na transmissão.",
      "Para comprimir os dados e reduzir o tempo de carregamento das páginas.",
      "Para compensar a natureza stateless do HTTP, permitindo que o servidor identifique e lembre o cliente entre requisições.",
      "Para substituir o mecanismo de conexões persistentes no HTTP/1.1."
    ],
    answer: 2,
    feedback: "O HTTP é ==term==stateless== por definição. Os Cookies adicionam estado à comunicação, permitindo que o servidor reconheça o cliente em visitas futuras — essencial para sessões de login, carrinhos de compra e personalização."
  },
  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Explicativa",
    texto: "O HTTP é um protocolo da Camada de Aplicação que funciona sobre TCP. Ele define o formato das mensagens de requisição e resposta entre clientes (navegadores) e servidores web. Uma mensagem de requisição HTTP contém: ==def==método== (GET, POST, PUT, DELETE), ==def==URL do recurso==, versão do protocolo e cabeçalhos opcionais. A resposta contém um ==def==código de status== (como 200 OK, 404 Not Found, 500 Internal Server Error).",
    question: "Qual método HTTP é tipicamente usado para solicitar a leitura de um recurso do servidor sem modificar nenhum dado?",
    options: [
      "POST",
      "PUT",
      "DELETE",
      "GET"
    ],
    answer: 3,
    feedback: "O método ==def==GET== é usado para requisitar dados do servidor sem alterá-los. É considerado um método 'seguro' e 'idempotente'. O POST envia dados para criar/alterar recursos; PUT atualiza um recurso existente; DELETE remove um recurso."
  },
  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Contextualizada",
    texto: "O ==def==Web Cache (Proxy)== é um servidor intermediário que armazena cópias de respostas HTTP recentes. Quando um cliente solicita um recurso, o cache verifica se tem uma cópia válida: se sim, responde diretamente (==term==cache hit==), sem contatar o servidor de origem. Isso reduz a latência percebida pelo usuário e diminui o tráfego na rede. O servidor original pode controlar o tempo de validade do cache com o cabeçalho `Cache-Control`.",
    question: "Uma empresa deseja reduzir o tempo de carregamento de páginas web para seus funcionários e diminuir o consumo de banda. Qual tecnologia HTTP seria mais indicada?",
    options: [
      "HTTP não persistente, pois abre conexões novas e mais rápidas para cada objeto.",
      "Web Cache (Proxy), pois armazena respostas localmente e as serve sem contatar o servidor de origem.",
      "Cookies, pois mantêm o estado da sessão e evitam requisições repetidas.",
      "HTTPS, pois criptografa os dados e elimina reenvios desnecessários."
    ],
    answer: 1,
    feedback: "O ==def==Web Cache (Proxy)== armazena respostas localmente. Quando um funcionário acessa um recurso já em cache, a resposta vem do proxy local — muito mais rápido do que atravessar a internet até o servidor de origem. Além disso, reduz o consumo de banda da conexão externa da empresa."
  },
  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Aplicação",
    texto: "No HTTP persistente com ==proc==pipelining==, o cliente pode enviar múltiplas requisições sem esperar pela resposta de cada uma. Isso reduz o tempo total de transferência, especialmente em páginas com muitos objetos. Sem pipelining, mesmo com conexão persistente, o cliente precisa aguardar a resposta de um objeto antes de requisitar o próximo.",
    question: "Qual é a vantagem do HTTP persistente com pipelining em comparação ao HTTP persistente sem pipelining?",
    options: [
      "Permite usar UDP em vez de TCP, reduzindo overhead.",
      "Elimina completamente a necessidade de handshake TCP.",
      "Permite enviar múltiplas requisições sem aguardar cada resposta, reduzindo o tempo total de carregamento.",
      "Aumenta o tamanho máximo de cada resposta HTTP."
    ],
    answer: 2,
    feedback: "Com ==proc==pipelining==, o cliente envia todas as requisições de objetos em sequência sem esperar as respostas intermediárias. O servidor responde na mesma ordem. Isso reduz drasticamente os tempos ociosos da conexão, especialmente em redes com alta latência."
  },
  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Explicativa",
    texto: "Os códigos de status HTTP são agrupados por faixa. Códigos ==def==2xx== indicam sucesso (ex: 200 OK). Códigos ==def==3xx== indicam redirecionamento (ex: 301 Moved Permanently). Códigos ==def==4xx== indicam erros do cliente (ex: 404 Not Found, 403 Forbidden). Códigos ==def==5xx== indicam erros do servidor (ex: 500 Internal Server Error, 503 Service Unavailable).",
    question: "Um usuário tenta acessar uma página que foi permanentemente movida para outro endereço. Qual código de status HTTP o servidor deve retornar?",
    options: [
      "200 OK",
      "404 Not Found",
      "301 Moved Permanently",
      "500 Internal Server Error"
    ],
    answer: 2,
    feedback: "O código ==def==301 Moved Permanently== informa ao navegador que o recurso foi movido definitivamente para uma nova URL, incluída no cabeçalho `Location` da resposta. O navegador então faz uma nova requisição automaticamente para o novo endereço e pode atualizar seus favoritos."
  },
  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Contextualizada",
    texto: "Cookies são compostos por quatro elementos principais: ==def==nome==, ==def==valor==, ==def==domínio== (para qual site se aplica) e ==def==data de expiração==. Cookies de sessão não têm data de expiração e são apagados quando o navegador fecha. Cookies persistentes têm data de expiração e sobrevivem ao fechamento do navegador, sendo usados para 'lembrar' o usuário em visitas futuras.",
    question: "Um e-commerce quer manter o usuário logado por 30 dias mesmo que ele feche o navegador. Qual tipo de cookie deve ser utilizado?",
    options: [
      "Cookie de sessão, pois é apagado e recriado a cada visita.",
      "Cookie persistente, pois possui data de expiração futura e sobrevive ao fechamento do navegador.",
      "Cookie de terceiros, pois é gerenciado por servidores externos.",
      "Cookie seguro, pois utiliza criptografia para armazenar as credenciais."
    ],
    answer: 1,
    feedback: "Um ==def==cookie persistente== com data de expiração definida para 30 dias é armazenado em disco pelo navegador. Mesmo após fechar e reabrir o navegador, o cookie ainda existe e é reenviado ao servidor, mantendo a sessão ativa sem que o usuário precise fazer login novamente."
  },
  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Aplicação",
    texto: "O ==def==HTTP/2== trouxe melhorias significativas sobre o HTTP/1.1: multiplexação de streams (múltiplas requisições em paralelo na mesma conexão TCP), compressão de cabeçalhos com HPACK, e server push (o servidor pode enviar recursos proativamente antes de serem solicitados). O HTTP/2 é binário, ao contrário do HTTP/1.1 que é baseado em texto.",
    question: "Qual característica do HTTP/2 resolve o problema de bloqueio de cabeça de fila (head-of-line blocking) presente no HTTP/1.1 com pipelining?",
    options: [
      "Compressão de cabeçalhos com HPACK.",
      "Multiplexação de streams, que permite múltiplas requisições/respostas independentes em paralelo na mesma conexão.",
      "Server push, que antecipa o envio de recursos.",
      "Formato binário, que é processado mais rapidamente pelo servidor."
    ],
    answer: 1,
    feedback: "A ==def==multiplexação de streams== do HTTP/2 atribui um ID a cada requisição, permitindo que respostas cheguem em qualquer ordem na mesma conexão. No HTTP/1.1 com pipelining, uma resposta lenta bloqueava todas as posteriores. Com multiplexação, isso não acontece — cada stream é independente."
  },
  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Contextualizada",
    texto: "A diferença entre ==term==HTTP== e ==term==HTTPS== é a adição de uma camada de segurança TLS (Transport Layer Security) entre a Camada de Aplicação e a Camada de Transporte no HTTPS. O TLS garante: ==rule==confidencialidade== (criptografia dos dados), ==rule==integridade== (os dados não foram alterados em trânsito) e ==rule==autenticidade== (o servidor é quem diz ser, via certificado digital).",
    question: "Um usuário precisa inserir dados do cartão de crédito em um site. Qual protocolo garante que essas informações não serão interceptadas e lidas por terceiros?",
    options: [
      "HTTP, pois é o protocolo padrão da web.",
      "FTP, pois é mais eficiente para transmissão de dados sensíveis.",
      "HTTPS, pois utiliza TLS para criptografar a comunicação.",
      "DNS, pois resolve o endereço do servidor de forma segura."
    ],
    answer: 2,
    feedback: "O ==term==HTTPS== adiciona TLS ao HTTP, criptografando toda a comunicação. Mesmo que um atacante intercepte os pacotes, não conseguirá ler os dados do cartão de crédito. O cadeado exibido pelo navegador indica que o certificado do servidor foi validado e a comunicação está criptografada."
  },
  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Explicativa",
    texto: "No HTTP não persistente, cada requisição abre e fecha uma nova conexão TCP. Isso é ineficiente porque: (1) o handshake TCP consome 1 RTT antes de qualquer dado ser transmitido; (2) o algoritmo de slow start do TCP limita a velocidade inicial de cada nova conexão; (3) o overhead de estabelecer e encerrar conexões consome recursos no servidor. O HTTP persistente (padrão HTTP/1.1) resolve esses problemas ao reutilizar a mesma conexão.",
    question: "Além do custo extra em RTTs, qual outro problema o HTTP não persistente impõe em termos de desempenho do TCP?",
    options: [
      "Ele impede o uso de compressão de dados no cabeçalho HTTP.",
      "Cada nova conexão começa no slow start do TCP, limitando a velocidade de transferência nas conexões curtas.",
      "Ele obriga o uso de UDP em vez de TCP para conexões rápidas.",
      "Ele exige que o servidor mantenha logs de todas as conexões abertas simultaneamente."
    ],
    answer: 1,
    feedback: "O algoritmo de ==term==slow start== do TCP começa com uma janela de congestionamento pequena e a aumenta gradualmente. Em conexões curtas do HTTP não persistente, a conexão termina antes de atingir a velocidade ótima. O HTTP persistente evita esse problema ao reutilizar a conexão já 'aquecida'."
  },
 
  // ============================================================
  // PARTE 3 — FTP e E-mail (10 questões)
  // ============================================================
  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Contextualizada",
    texto: "O protocolo FTP (File Transfer Protocol) resolve o problema de transferir arquivos entre sistemas operacionais heterogêneos. Sua arquitetura é peculiar: utiliza ==rule==duas conexões TCP separadas==. A primeira, pela porta 21, é usada exclusivamente para comandos e autenticação (conexão de controle). A segunda, pela porta 20, é aberta dinamicamente apenas durante a transferência real do arquivo (conexão de dados). Atenção: o FTP transmite senhas em texto às claras, sendo considerado inseguro.",
    question: "Um administrador de sistemas percebe que senhas de FTP estão sendo capturadas na rede. Qual característica do FTP explica essa vulnerabilidade, e qual alternativa segura ele deveria adotar?",
    options: [
      "O FTP usa UDP, que não garante entrega. A solução é mudar para TCP manualmente.",
      "O FTP transmite credenciais em texto às claras. A solução é usar SSL-FTP ou SFTP, que criptografam a comunicação.",
      "O FTP usa a porta 80, facilmente interceptável. A solução é trocar para a porta 443.",
      "O FTP não autentica usuários. A solução é adicionar um firewall na porta 21."
    ],
    answer: 1,
    feedback: "==warn==O FTP envia senhas em texto às claras== pela conexão de controle (porta 21), tornando-o vulnerável a interceptação. O SSL-FTP ou SFTP (FTP sobre SSH) são as alternativas que adicionam criptografia ao processo."
  },
  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Aplicação",
    texto: "O fluxo de um e-mail envolve três agentes distintos. O Agente de Usuário (UA) é o programa com o qual você compõe e lê mensagens (ex: Outlook). O Agente de Transferência (MTA) é o servidor responsável por mover a mensagem entre domínios via SMTP. O Agente de Acesso (MAA) permite que o destinatário recupere suas mensagens usando POP ou IMAP. Uma diferença crítica entre POP e IMAP: ==rule==POP remove as mensagens do servidor== após o download, enquanto ==rule==IMAP mantém as mensagens sincronizadas no servidor==.",
    question: "Maria usa seu smartphone e seu notebook para acessar o mesmo e-mail. Qual protocolo de acesso ela deve configurar para que as mensagens fiquem disponíveis e sincronizadas nos dois dispositivos?",
    options: [
      "SMTP, pois é o protocolo de recebimento mais moderno.",
      "POP3, pois baixa as mensagens de forma eficiente para cada dispositivo.",
      "IMAP, pois mantém as mensagens no servidor, sincronizando o estado em todos os dispositivos.",
      "FTP, pois permite transferir arquivos de e-mail entre dispositivos."
    ],
    answer: 2,
    feedback: "==rule==IMAP mantém as mensagens no servidor==, sincronizando leitura, exclusão e organização entre todos os dispositivos. O POP3 removeria as mensagens do servidor após o primeiro download, impedindo o acesso pelo segundo dispositivo."
  },
  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Explicativa",
    texto: "O FTP opera com duas conexões TCP simultâneas. A ==def==conexão de controle== (porta 21) é persistente durante toda a sessão: por ela trafegam comandos como USER, PASS, LIST, RETR e STOR. A ==def==conexão de dados== (porta 20) é efêmera: é criada apenas quando necessário para transferir um arquivo ou listar um diretório, e encerrada logo após. Essa separação é chamada de 'out-of-band control'.",
    question: "Por que o FTP usa duas conexões TCP separadas em vez de uma única conexão para tudo?",
    options: [
      "Para dobrar a velocidade de transferência usando as duas conexões em paralelo.",
      "Para separar o canal de comandos (controle) do canal de dados, permitindo enviar comandos enquanto uma transferência está em andamento.",
      "Para criptografar a conexão de dados enquanto mantém o controle em texto.",
      "Para suportar simultaneamente os protocolos TCP e UDP."
    ],
    answer: 1,
    feedback: "A separação em ==def==conexão de controle== e ==def==conexão de dados== permite que comandos sejam enviados ao servidor (ex: cancelar, pausar) mesmo durante uma transferência ativa. Isso é referido como controle 'out-of-band' — o canal de gerenciamento é independente do canal de dados."
  },
  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Contextualizada",
    texto: "O protocolo SMTP (Simple Mail Transfer Protocol) é responsável pelo envio de e-mails entre servidores de correio. Ele opera na porta ==def==25== e usa conexões TCP. O SMTP é um protocolo ==term==push==: quem envia a mensagem (cliente SMTP) inicia a conexão e empurra o e-mail para o servidor destinatário. Isso contrasta com POP e IMAP, que são protocolos de ==term==pull== — o cliente puxa as mensagens do servidor.",
    question: "Qual é a principal função do protocolo SMTP no sistema de e-mail?",
    options: [
      "Permitir que o usuário leia e organize suas mensagens recebidas no servidor.",
      "Criptografar as mensagens de e-mail antes de enviá-las.",
      "Transferir mensagens de e-mail do servidor do remetente para o servidor do destinatário.",
      "Sincronizar a caixa de entrada entre múltiplos dispositivos do usuário."
    ],
    answer: 2,
    feedback: "O ==term==SMTP== é o protocolo de envio: ele transporta a mensagem do servidor de e-mail do remetente até o servidor do destinatário. Após a entrega ao servidor destino, o destinatário usa POP ou IMAP para recuperar suas mensagens. SMTP é 'push'; POP/IMAP são 'pull'."
  },
  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Explicativa",
    texto: "O formato das mensagens de e-mail é definido pelo RFC 5322. Uma mensagem possui duas partes: o ==def==cabeçalho (header)== e o ==def==corpo (body)==, separados por uma linha em branco. O cabeçalho contém campos como `From`, `To`, `Subject`, `Date` e `Message-ID`. O corpo contém o conteúdo da mensagem. Para suportar anexos e diferentes tipos de conteúdo (imagens, HTML), foi criada a extensão ==def==MIME (Multipurpose Internet Mail Extensions)==.",
    question: "Qual extensão do protocolo de e-mail permite enviar anexos (imagens, PDFs) e conteúdo HTML em mensagens?",
    options: [
      "SMTP, que suporta nativamente todos os tipos de arquivo.",
      "IMAP, que converte arquivos binários para texto automaticamente.",
      "MIME, que define como codificar e incluir diferentes tipos de conteúdo em mensagens de e-mail.",
      "POP3, que descomprime os anexos ao fazer o download."
    ],
    answer: 2,
    feedback: "O ==def==MIME== estende o formato básico de e-mail para suportar tipos de conteúdo além de texto ASCII simples. Ele define cabeçalhos como `Content-Type` e `Content-Transfer-Encoding`, e usa codificação Base64 para representar dados binários (imagens, PDFs) como texto, compatível com o protocolo SMTP."
  },
  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Aplicação",
    texto: "No FTP, existem dois modos de operação para a conexão de dados: ==proc==modo ativo== e ==proc==modo passivo==. No modo ativo, o servidor inicia a conexão de dados de volta ao cliente (porta 20 do servidor → porta aleatória do cliente). No modo passivo, o cliente inicia ambas as conexões — ideal quando o cliente está atrás de um firewall ou NAT que bloqueia conexões entrantes.",
    question: "Um usuário atrás de um firewall corporativo não consegue receber a conexão de dados do servidor FTP no modo ativo. Qual solução resolve esse problema?",
    options: [
      "Trocar o protocolo de transporte de TCP para UDP.",
      "Usar o modo passivo do FTP, onde o cliente inicia a conexão de dados, evitando bloqueios do firewall.",
      "Aumentar o tempo limite (timeout) da conexão de controle.",
      "Usar a porta 80 em vez da porta 20 para a conexão de dados."
    ],
    answer: 1,
    feedback: "No ==proc==modo passivo==, o servidor abre uma porta aleatória e informa ao cliente, que então inicia a conexão de dados. Como é o cliente (atrás do firewall) quem inicia ambas as conexões, o firewall permite o tráfego de saída normalmente — sem precisar abrir portas para conexões entrantes."
  },
  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Contextualizada",
    texto: "O POP3 (Post Office Protocol v3) opera na porta 110 e permite ao usuário baixar e-mails do servidor. Por padrão, após o download, as mensagens são ==rule==removidas do servidor==. Isso significa que as mensagens ficam apenas no dispositivo que as baixou. O POP3 é simples e adequado para usuários com um único dispositivo de acesso ou com conexão intermitente à internet.",
    question: "João só acessa seu e-mail do computador de casa e quer guardar todas as mensagens localmente por questões de espaço no servidor. Qual protocolo é mais indicado para ele?",
    options: [
      "IMAP, pois mantém tudo no servidor e sincroniza entre dispositivos.",
      "SMTP, pois é o protocolo padrão de recebimento de mensagens.",
      "POP3, pois baixa as mensagens para o dispositivo local e as remove do servidor.",
      "FTP, pois é otimizado para transferência de arquivos grandes como caixas de e-mail."
    ],
    answer: 2,
    feedback: "Para o caso de João — um único dispositivo, sem necessidade de sincronização e com foco em armazenamento local — o ==rule==POP3== é ideal. Ele baixa as mensagens para o HD local e as remove do servidor, liberando espaço de armazenamento e mantendo o acesso offline."
  },
  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Explicativa",
    texto: "O caminho de uma mensagem de e-mail envolve múltiplos saltos. O remetente usa seu ==def==Agente de Usuário (UA)== para compor a mensagem. O UA a envia via SMTP para o ==def==servidor de e-mail do remetente (MTA)==. Esse MTA consulta o DNS (registro MX) para descobrir o servidor de e-mail do destinatário e entrega a mensagem via SMTP. Por fim, o destinatário usa POP ou IMAP via seu UA para recuperar a mensagem do seu MTA.",
    question: "Qual tipo de registro DNS um servidor de e-mail consulta para descobrir o servidor responsável por receber mensagens de um determinado domínio?",
    options: [
      "Registro A, que mapeia domínios a endereços IP.",
      "Registro CNAME, que define apelidos de domínio.",
      "Registro MX (Mail Exchanger), que indica o servidor de e-mail do domínio destinatário.",
      "Registro NS, que aponta os servidores de nome do domínio."
    ],
    answer: 2,
    feedback: "O ==def==registro MX (Mail Exchanger)== é consultado no DNS para descobrir qual servidor é responsável por receber e-mails de um domínio. Por exemplo, para entregar um e-mail para `usuario@empresa.com`, o MTA do remetente consulta o registro MX de `empresa.com` e obtém o endereço do servidor de destino."
  },
  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Aplicação",
    texto: "O IMAP (Internet Message Access Protocol) opera na porta 143 (ou 993 com TLS) e oferece funcionalidades avançadas em relação ao POP3: organização em pastas no servidor, marcação de mensagens como lidas/não lidas, busca no lado do servidor e sincronização do estado entre múltiplos clientes. O cliente IMAP trabalha com as mensagens diretamente no servidor, baixando apenas o que for necessário.",
    question: "Qual funcionalidade exclusiva do IMAP permite economizar banda ao trabalhar com caixas de e-mail grandes?",
    options: [
      "Baixar todas as mensagens de uma vez para armazenamento local.",
      "Permitir que o servidor execute buscas e filtragens sem precisar baixar todas as mensagens para o cliente.",
      "Compactar automaticamente os anexos antes do download.",
      "Remover mensagens duplicadas do servidor automaticamente."
    ],
    answer: 1,
    feedback: "O ==rule==IMAP== permite que o cliente execute buscas e filtragens diretamente no servidor. Ao procurar uma mensagem específica em uma caixa com milhares de e-mails, apenas o resultado é enviado ao cliente — não a caixa inteira. Isso reduz drasticamente o consumo de banda, especialmente em dispositivos móveis."
  },
  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Contextualizada",
    texto: "O FTP é classificado como ==term==stateful== (com estado) — o servidor mantém informações sobre o estado da sessão do cliente, como o diretório corrente e as credenciais autenticadas. Isso contrasta com o HTTP, que é ==term==stateless==. O FTP usa o estado para interpretar comandos relativos, como `CD pasta_filha` (que depende de saber qual é o diretório atual do cliente).",
    question: "Por que o FTP precisa manter estado entre comandos, ao contrário do HTTP?",
    options: [
      "Porque o FTP usa UDP e precisa simular confiabilidade via estado.",
      "Porque o FTP precisa lembrar o diretório atual e as credenciais do cliente para interpretar comandos relativos durante a sessão.",
      "Porque o FTP transfere arquivos maiores que o HTTP e precisa controlar os pedaços baixados.",
      "Porque o FTP usa criptografia e o estado guarda as chaves de sessão."
    ],
    answer: 1,
    feedback: "O FTP é ==term==stateful==: o servidor armazena o contexto da sessão — usuário autenticado, diretório atual, modo de transferência etc. Um comando como `LIST` lista o diretório *atual*, que o servidor só conhece porque manteve o estado desde o `CD` anterior. Sem estado, cada comando precisaria incluir o caminho completo."
  },
 
  // ============================================================
  // PARTE 4 — DNS e P2P (10 questões)
  // ============================================================
  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Explicativa",
    texto: "O DNS (Domain Name System) funciona como a 'lista telefônica' da Internet: converte nomes amigáveis como `www.google.com` em endereços IP numéricos. Existem dois tipos principais de resolução. Na ==proc==resolução recursiva==, o servidor DNS local assume toda a responsabilidade: consulta outros servidores até obter o IP final e devolve a resposta pronta ao cliente. Na ==proc==resolução iterativa==, cada servidor responde apenas com o endereço do próximo servidor a ser consultado, e o cliente é responsável por fazer cada nova consulta.",
    question: "Em qual tipo de resolução DNS o servidor local 'faz todo o trabalho' pelo cliente, consultando a hierarquia inteira e retornando apenas o resultado final?",
    options: [
      "Resolução iterativa, pois o servidor itera por todos os nós da hierarquia.",
      "Resolução por cache, pois o servidor já tem o resultado armazenado localmente.",
      "Resolução recursiva, pois o servidor assume a responsabilidade de resolver toda a consulta.",
      "Resolução autoritativa, pois o servidor tem autoridade sobre todos os domínios."
    ],
    answer: 2,
    feedback: "Na ==proc==resolução recursiva==, o servidor DNS local consulta toda a hierarquia (raiz → TLD → autoritativo) e retorna apenas o IP final ao cliente. Na iterativa, o servidor apenas 'aponta o caminho' e o cliente faz cada consulta por conta própria."
  },
  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Contextualizada",
    texto: "O BitTorrent é um protocolo P2P projetado para compartilhamento eficiente de arquivos grandes. O arquivo é dividido em pequenos pedaços (chunks), e os peers os trocam entre si. O mecanismo ==rule==Tit-for-tat== garante equidade na rede: um peer só fornece pedaços para aqueles que também lhe enviam dados, desincentivando o comportamento 'parasita' (receber sem contribuir). Peers com o arquivo completo são chamados de Seeds; os que ainda estão baixando são chamados de Leeches.",
    question: "No BitTorrent, por que um peer que nunca envia dados para outros tende a receber poucos pedaços do arquivo?",
    options: [
      "Porque o Tracker bloqueia peers inativos automaticamente.",
      "Porque o mecanismo Tit-for-tat faz com que peers só compartilhem com quem também compartilha com eles.",
      "Porque Seeds têm prioridade absoluta sobre Leeches na distribuição de pedaços.",
      "Porque o DHT não consegue localizar peers que não possuem nenhum pedaço do arquivo."
    ],
    answer: 1,
    feedback: "==rule==Tit-for-tat== é a estratégia de reciprocidade do BitTorrent: 'só te dou se você também me der.' Isso desincentiva peers parasitas e garante que quem contribui com a rede seja recompensado com velocidades maiores de download."
  },
  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Explicativa",
    texto: "A hierarquia do DNS é composta por três níveis. Os ==def==servidores raiz (root)==, no topo, conhecem os endereços de todos os servidores TLD. Os ==def==servidores TLD (Top-Level Domain)== são responsáveis por domínios de alto nível como `.com`, `.br`, `.org`. Os ==def==servidores autoritativos== armazenam os registros DNS definitivos de um domínio específico (ex: `google.com`). No fundo da hierarquia, cada organização mantém seu servidor autoritativo.",
    question: "Qual servidor DNS é responsável por armazenar os registros definitivos (autoritativos) de um domínio como 'empresa.com.br'?",
    options: [
      "Servidor DNS raiz, pois conhece todos os domínios.",
      "Servidor TLD .br, pois gerencia todos os domínios brasileiros.",
      "Servidor DNS local do cliente, pois tem o cache mais atualizado.",
      "Servidor DNS autoritativo da empresa, pois contém os registros definitivos do domínio."
    ],
    answer: 3,
    feedback: "O ==def==servidor autoritativo== é a fonte de verdade para os registros de um domínio. Ele contém os mapeamentos definitivos (nome → IP) configurados pelo administrador do domínio. Os servidores raiz e TLD apenas apontam o caminho até ele; o servidor local apenas armazena em cache as respostas autoritativas."
  },
  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Aplicação",
    texto: "O DNS utiliza ==def==cache== agressivamente para reduzir a carga nos servidores e a latência das consultas. Cada resposta DNS inclui um valor ==def==TTL (Time To Live)== que indica por quanto tempo a resposta pode ser armazenada em cache. Quando o TTL expira, o servidor local deve descartar a entrada e consultar novamente. Isso permite que mudanças de IP se propaguem pela internet, embora com algum atraso.",
    question: "Uma empresa troca o servidor de seu site para um novo endereço IP. Por que alguns usuários ainda acessam o servidor antigo por algumas horas após a mudança?",
    options: [
      "Porque o DNS raiz não foi notificado da mudança.",
      "Porque os servidores DNS locais ainda têm o IP antigo em cache e o TTL ainda não expirou.",
      "Porque o protocolo TCP mantém conexões abertas com o servidor antigo indefinidamente.",
      "Porque os navegadores não atualizam entradas DNS durante uma sessão ativa."
    ],
    answer: 1,
    feedback: "Servidores DNS ao redor do mundo têm o IP antigo em ==def==cache==, com TTL configurado pelo administrador do domínio. Até que esse TTL expire e cada servidor realize uma nova consulta autoritativa, eles continuarão respondendo com o IP antigo. Por isso, mudanças de DNS levam horas (ou até 48h) para se propagar globalmente."
  },
  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Contextualizada",
    texto: "No BitTorrent, o ==def==Tracker== é um servidor centralizado que mantém o registro de quais peers participam de um torrent. Quando um novo peer inicia o download, ele contata o Tracker para obter uma lista de peers ativos. Porém, o Tracker é um ponto único de falha. Para eliminar essa dependência, foi criado o ==def==DHT (Distributed Hash Table)==, que distribui o registro de peers entre os próprios participantes, tornando a rede totalmente descentralizada.",
    question: "Qual é a principal vantagem do DHT em relação ao Tracker centralizado no BitTorrent?",
    options: [
      "O DHT aumenta a velocidade de download por compactar os pedaços do arquivo.",
      "O DHT elimina o ponto único de falha do Tracker, distribuindo o registro de peers entre os próprios participantes.",
      "O DHT criptografa a comunicação entre peers, tornando o BitTorrent mais seguro.",
      "O DHT reduz o número de pedaços necessários para completar o download."
    ],
    answer: 1,
    feedback: "O ==def==DHT== distribui a função do Tracker entre todos os peers. Cada peer é responsável por armazenar informações sobre um subconjunto de torrents. Isso elimina o ponto único de falha: mesmo que vários peers saiam, a rede continua funcionando — ao contrário do modelo com Tracker centralizado."
  },
  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Aplicação",
    texto: "O DNS suporta múltiplos tipos de registros. O ==def==registro A== mapeia um nome de domínio a um endereço IPv4. O ==def==registro AAAA== mapeia a um endereço IPv6. O ==def==registro CNAME== define um apelido (alias) para outro nome canônico. O ==def==registro MX== indica o servidor de e-mail de um domínio. O ==def==registro NS== aponta os servidores DNS autoritativos de um domínio.",
    question: "Um administrador precisa que `www.empresa.com` aponte para o mesmo IP que `empresa.com`, sem duplicar o registro A. Qual tipo de registro DNS deve ser criado?",
    options: [
      "Registro MX, para redirecionar requisições web para o servidor de e-mail.",
      "Registro NS, para apontar para o servidor de nome correto.",
      "Registro CNAME, que cria um apelido de `www.empresa.com` para `empresa.com`.",
      "Registro AAAA, para suportar IPv6 no subdomínio www."
    ],
    answer: 2,
    feedback: "O ==def==registro CNAME== cria um alias: `www.empresa.com CNAME empresa.com` faz com que qualquer consulta a `www.empresa.com` seja resolvida como `empresa.com`, sem precisar duplicar o registro A. Se o IP mudar, basta atualizar o registro A de `empresa.com` — o CNAME é atualizado automaticamente."
  },
  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Explicativa",
    texto: "No BitTorrent, o arquivo é dividido em ==def==chunks== de tamanho fixo (tipicamente 256 KB). A estratégia de seleção de pedaços usa o princípio ==proc==rarest first== (mais raro primeiro): o peer prioriza baixar os pedaços que existem em menos cópias na rede. Isso aumenta a disponibilidade geral do conteúdo, evitando que pedaços raros se tornem um gargalo.",
    question: "Por que o BitTorrent usa a estratégia 'rarest first' para selecionar quais pedaços baixar primeiro?",
    options: [
      "Porque pedaços raros são os maiores e precisam de mais tempo para ser baixados.",
      "Para aumentar a diversidade de pedaços na rede, evitando que fragmentos escassos desapareçam se os poucos peers que os têm ficarem offline.",
      "Para priorizar o início e o fim do arquivo, permitindo a reprodução antes do download completo.",
      "Porque pedaços raros têm menor latência de transferência entre peers."
    ],
    answer: 1,
    feedback: "A estratégia ==proc==rarest first== garante que pedaços com poucas cópias sejam rapidamente replicados para mais peers. Isso protege a disponibilidade do torrent: se um pedaço raro só existe em um peer que sai da rede, todo o arquivo pode se tornar incompleto para todos. Baixar o mais raro primeiro mitiga esse risco."
  },
  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Contextualizada",
    texto: "O DNS usa ==def==UDP== para a maioria das consultas, pois são pequenas (geralmente abaixo de 512 bytes) e a velocidade é mais importante que a confiabilidade. Se a resposta for muito grande ou se o UDP falhar, o DNS pode usar TCP. O servidor DNS local escuta na porta ==def==53== tanto para UDP quanto para TCP.",
    question: "Por que o DNS usa UDP por padrão em vez de TCP para suas consultas?",
    options: [
      "Porque UDP é o único protocolo suportado pelos servidores DNS raiz.",
      "Porque as consultas DNS são pequenas e a latência do handshake TCP seria desproporcional para uma troca rápida de pergunta e resposta.",
      "Porque UDP garante entrega ordenada de respostas DNS, necessária para a hierarquia funcionar.",
      "Porque TCP não suporta respostas com múltiplos registros DNS."
    ],
    answer: 1,
    feedback: "Uma consulta DNS típica é uma pequena troca de mensagens (pergunta + resposta). O handshake TCP adicionaria 1 RTT extra, mais que dobrando a latência para algo tão simples. O ==def==UDP== é muito mais eficiente aqui: a requisição e resposta cabem em um único datagrama, e se o pacote se perder, o cliente simplesmente tenta novamente."
  },
  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Aplicação",
    texto: "A comparação entre distribuição de arquivo em modo ==def==cliente-servidor== e modo ==def==P2P== revela diferenças importantes de escalabilidade. No modelo cliente-servidor, o tempo de distribuição cresce linearmente com o número de clientes (N), pois o servidor precisa enviar uma cópia para cada um. No modelo P2P, o tempo cresce muito mais devagar: cada novo peer que recebe o arquivo também passa a distribuí-lo, aumentando a capacidade total da rede.",
    question: "Uma empresa precisa distribuir um arquivo de atualização de 1 GB para 10.000 computadores. Qual abordagem resulta em menor tempo total de distribuição?",
    options: [
      "Modelo cliente-servidor com um único servidor central de alta capacidade.",
      "Modelo P2P, pois cada computador que recebe o arquivo ajuda a distribuí-lo para os demais.",
      "Envio por e-mail com anexo, pois o servidor de e-mail faz o balanceamento automaticamente.",
      "FTP com múltiplas conexões paralelas do servidor para cada cliente."
    ],
    answer: 1,
    feedback: "No ==def==modelo P2P==, cada peer que completa o download imediatamente começa a fazer upload para outros peers. Assim, a capacidade de distribuição cresce com o número de participantes. Para 10.000 computadores, o modelo P2P pode ser ordens de magnitude mais rápido que um único servidor FTP tentando servir todos sequencialmente."
  },
  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Explicativa",
    texto: "O DNS é um banco de dados ==def==hierárquico== e ==def==distribuído==. Hierárquico porque os domínios são organizados em árvore (raiz → TLD → domínio → subdomínio). Distribuído porque nenhum servidor único armazena todos os registros — cada nível da hierarquia é gerenciado por servidores diferentes. Essa distribuição garante escalabilidade e resiliência: falhas em partes do sistema não derrubam todo o DNS.",
    question: "Por que o DNS foi projetado como um sistema distribuído em vez de um único banco de dados centralizado?",
    options: [
      "Para permitir que cada usuário tenha seu próprio servidor DNS local exclusivo.",
      "Para garantir escalabilidade e resiliência: um banco centralizado seria um gargalo global e ponto único de falha para toda a Internet.",
      "Porque os protocolos TCP/IP não suportam consultas a servidores centralizados.",
      "Para que cada domínio possa usar um formato diferente de endereçamento IP."
    ],
    answer: 1,
    feedback: "Um DNS centralizado único teria que responder a bilhões de consultas por segundo de todo o mundo — tecnicamente inviável e com ponto único de falha catastrófico. A arquitetura ==def==distribuída e hierárquica== divide a carga: cada servidor é responsável apenas por sua zona, e falhas são localizadas, sem afetar o sistema como um todo."
  },
 
  // ============================================================
  // PARTE 5 — SSH, TELNET e Modelos OSI/TCP (10 questões)
  // ============================================================
  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Aplicação",
    texto: "O TELNET permite acesso remoto a computadores resolvendo diferenças entre sistemas operacionais via NVT (Terminal Virtual de Rede). Porém, sua fatal vulnerabilidade é que transmite todas as informações — incluindo usuário e senha — em ==warn==texto às claras==. O SSH surgiu como substituto seguro: utiliza criptografia para proteger a comunicação. Além disso, o componente SSH-CONN permite criar ==proc==túneis (port forwarding)==, que encapsulam protocolos inseguros (como FTP ou SMTP) dentro de uma conexão SSH criptografada.",
    question: "Um engenheiro precisa usar FTP para transferir arquivos sensíveis, mas o FTP é inseguro. Qual recurso do SSH permite proteger esse tráfego sem abandonar o FTP?",
    options: [
      "SSH-AUTH, que adiciona autenticação de dois fatores ao protocolo FTP.",
      "SSH-TRANS, que substitui o protocolo FTP por um mais seguro automaticamente.",
      "SSH-CONN (Port Forwarding), que cria um túnel criptografado pelo qual o tráfego FTP trafega com segurança.",
      "NVT, que converte os dados FTP para um formato criptografado universalmente aceito."
    ],
    answer: 2,
    feedback: "==proc==SSH-CONN (Port Forwarding)== cria um túnel seguro entre cliente e servidor SSH. O tráfego do FTP é encaminhado por dentro desse túnel criptografado, protegendo credenciais e dados sem necessidade de substituir o FTP."
  },
  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Explicativa",
    texto: "Os modelos OSI e TCP/IP servem como referência para entender como as redes funcionam em camadas. O modelo OSI possui 7 camadas e é considerado um modelo ==term==teórico==: suas camadas de Sessão e Apresentação frequentemente ficam vazias na prática, sem implementação real. O modelo TCP/IP possui 5 camadas e é ==term==prático==: absorve as funções de Sessão e Apresentação diretamente na Camada de Aplicação. Por isso, o TCP/IP é o modelo efetivamente usado na Internet.",
    question: "Por que o modelo TCP/IP possui 5 camadas enquanto o OSI possui 7, mesmo cobrindo funcionalidades equivalentes?",
    options: [
      "Porque o TCP/IP eliminou as camadas Física e de Enlace por considerá-las desnecessárias.",
      "Porque o TCP/IP incorpora as funções das camadas de Sessão e Apresentação do OSI diretamente na sua Camada de Aplicação.",
      "Porque o OSI adicionou camadas extras para suportar protocolos de roteamento avançados.",
      "Porque o TCP/IP separa a camada de Transporte em duas subcamadas distintas."
    ],
    answer: 1,
    feedback: "O ==term==modelo TCP/IP== é pragmático: como as camadas de Sessão e Apresentação do OSI raramente tinham implementação independente na prática, o TCP/IP as absorveu dentro da Camada de Aplicação, resultando em 5 camadas mais enxutas e funcionais."
  },
  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Explicativa",
    texto: "O SSH é estruturado em três camadas de protocolo: ==def==SSH-TRANS== (camada de transporte seguro, responsável por estabelecer a criptografia e autenticar o servidor), ==def==SSH-AUTH== (camada de autenticação do usuário, suportando senha, chave pública e outros métodos) e ==def==SSH-CONN== (camada de conexão, que multiplexa múltiplos canais lógicos — shell, port forwarding, execução de comandos — sobre um único túnel SSH).",
    question: "Qual subcamada do SSH é responsável por estabelecer a criptografia e autenticar o servidor remoto?",
    options: [
      "SSH-AUTH",
      "SSH-CONN",
      "SSH-TRANS",
      "NVT"
    ],
    answer: 2,
    feedback: "O ==def==SSH-TRANS== é a base da pilha SSH: ele negocia os algoritmos de criptografia, troca chaves (Diffie-Hellman) e autentica o servidor usando sua chave pública. Só após o SSH-TRANS estabelecer um canal seguro é que o SSH-AUTH entra em cena para autenticar o usuário."
  },
  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Contextualizada",
    texto: "O NVT (Network Virtual Terminal) do TELNET é um padrão que representa um terminal genérico: define um conjunto mínimo de funções (teclado e impressora) que qualquer sistema deve suportar. Isso resolve o problema de heterogeneidade: um cliente Windows pode se conectar a um servidor Unix porque ambos 'falam' NVT. Contudo, o NVT não oferece nenhum tipo de criptografia — toda a sessão é transmitida em claro.",
    question: "Qual problema específico o NVT (Network Virtual Terminal) do TELNET foi criado para resolver?",
    options: [
      "Criptografar as sessões de acesso remoto para proteger as credenciais.",
      "Comprimir o tráfego de terminal para reduzir o consumo de banda.",
      "Padronizar a comunicação entre sistemas operacionais diferentes, permitindo que clientes e servidores heterogêneos se entendam.",
      "Autenticar o servidor remoto antes de estabelecer a conexão."
    ],
    answer: 2,
    feedback: "O ==def==NVT== define uma representação de terminal 'mínimo denominador comum': todos os sistemas mapeiam suas características locais para NVT ao enviar e de NVT ao receber. Isso permite que um terminal Windows e um servidor Linux se comuniquem sem precisar conhecer os detalhes específicos um do outro."
  },
  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Aplicação",
    texto: "O modelo OSI define sete camadas: Física, Enlace de Dados, Rede, Transporte, Sessão, Apresentação e Aplicação. A ==def==Camada de Sessão== gerencia o estabelecimento, manutenção e encerramento de sessões entre aplicações. A ==def==Camada de Apresentação== trata da representação dos dados: criptografia, compressão e conversão de formatos (ex: ASCII para EBCDIC). No TCP/IP, essas funções são implementadas diretamente no código da aplicação.",
    question: "No modelo OSI, qual camada seria responsável por converter dados de um formato de codificação para outro (ex: UTF-8 para ASCII)?",
    options: [
      "Camada de Sessão",
      "Camada de Transporte",
      "Camada de Apresentação",
      "Camada de Rede"
    ],
    answer: 2,
    feedback: "A ==def==Camada de Apresentação== (camada 6 do OSI) é responsável pela sintaxe e semântica dos dados: conversão de formatos, criptografia/decriptografia e compressão. Ela garante que os dados enviados por um sistema em um formato sejam compreendidos por outro sistema com representação diferente."
  },
  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Contextualizada",
    texto: "O SSH suporta múltiplos métodos de autenticação via SSH-AUTH. O mais seguro é a ==proc==autenticação por chave pública==: o cliente gera um par de chaves (pública e privada), registra a chave pública no servidor, e durante a autenticação prova que possui a chave privada sem nunca a transmitir. Isso é muito mais seguro que senha, pois a chave privada nunca trafega pela rede.",
    question: "Por que a autenticação SSH por chave pública é considerada mais segura que a autenticação por senha?",
    options: [
      "Porque a chave pública é criptografada durante a transmissão, ao contrário da senha.",
      "Porque a chave privada nunca é transmitida pela rede — o servidor verifica a identidade do cliente através de um desafio criptográfico.",
      "Porque chaves SSH são renovadas automaticamente a cada sessão, impedindo reutilização.",
      "Porque a autenticação por chave usa UDP, que é mais difícil de interceptar."
    ],
    answer: 1,
    feedback: "Na ==proc==autenticação por chave pública==, o servidor envia um desafio (número aleatório) que o cliente assina com sua chave privada. O servidor verifica a assinatura com a chave pública já registrada. A chave privada nunca sai do cliente — se a rede for interceptada, não há credencial para roubar."
  },
  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Explicativa",
    texto: "No modelo TCP/IP, cada camada adiciona um ==def==cabeçalho (header)== ao dado recebido da camada superior — processo chamado de ==proc==encapsulamento==. Na recepção, o processo inverso (==proc==desencapsulamento==) remove os cabeçalhos camada a camada. Um pacote HTTP, por exemplo, é encapsulado em um segmento TCP, que é encapsulado em um pacote IP, que é encapsulado em um quadro Ethernet.",
    question: "Qual é o processo pelo qual cada camada da pilha TCP/IP adiciona suas informações de controle ao dado recebido da camada superior?",
    options: [
      "Fragmentação",
      "Multiplexação",
      "Encapsulamento",
      "Roteamento"
    ],
    answer: 2,
    feedback: "O ==proc==encapsulamento== é o processo de adicionar cabeçalhos (e às vezes trailers) de cada camada ao dado. Cada camada trata o conteúdo recebido como dados opacos e adiciona sua própria informação de controle. Na recepção, o ==proc==desencapsulamento== remove esses cabeçalhos na ordem inversa, entregando os dados à camada superior."
  },
  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Aplicação",
    texto: "O TELNET opera na porta ==def==23== usando TCP. Apesar de obsoleto em ambientes de produção, ainda é usado para testes rápidos de conectividade de portas: um administrador pode usar `telnet servidor 80` para verificar se a porta 80 está aberta e o servidor está respondendo, independentemente de ter um cliente HTTP disponível.",
    question: "Um administrador quer verificar rapidamente se a porta 443 de um servidor web está acessível. Como ele pode usar o TELNET para esse teste?",
    options: [
      "Executar `telnet servidor 23` e verificar se a página HTTPS é exibida.",
      "Executar `telnet servidor 443` — se a conexão for estabelecida, a porta está aberta e acessível.",
      "Executar `telnet servidor 80` e redirecionar a saída para a porta 443.",
      "O TELNET não pode ser usado para testar portas diferentes da 23."
    ],
    answer: 1,
    feedback: "O comando `telnet servidor 443` tenta estabelecer uma conexão TCP com o servidor na porta 443. Se a conexão for aceita (mesmo que o TELNET não entenda HTTPS), isso confirma que a porta está aberta e o servidor está respondendo. É uma técnica clássica de diagnóstico de conectividade TCP."
  },
  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Contextualizada",
    texto: "Uma comparação direta entre TELNET e SSH revela por que o primeiro foi amplamente abandonado. Ambos oferecem acesso remoto a terminal, mas diferem criticamente em segurança. O TELNET transmite tudo em ==warn==texto às claras==, incluindo senhas. O SSH usa criptografia assimétrica para autenticação e simétrica para a sessão, protegendo todo o tráfego. Em redes modernas, o uso de TELNET é considerado uma vulnerabilidade crítica.",
    question: "Em um audit de segurança, a equipe encontra um servidor de produção com TELNET habilitado. Qual é o principal risco imediato e a ação recomendada?",
    options: [
      "O risco é que o TELNET usa UDP não confiável. A solução é migrar para FTP.",
      "O risco é que qualquer pessoa na rede pode interceptar credenciais em texto às claras. A solução é desabilitar o TELNET e habilitar o SSH.",
      "O risco é que o TELNET não suporta autenticação. A solução é adicionar um certificado SSL.",
      "O risco é que o TELNET consome muita banda. A solução é limitar o número de sessões simultâneas."
    ],
    answer: 1,
    feedback: "O ==warn==TELNET transmite senhas em texto às claras==. Qualquer atacante com acesso à rede (ou um sniffer como Wireshark) pode capturar as credenciais de administrador do servidor em segundos. A ação imediata é desabilitar o TELNET (porta 23) e substituí-lo pelo SSH (porta 22), que criptografa toda a comunicação."
  },
  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Explicativa",
    texto: "O modelo OSI foi desenvolvido pela ISO como um ==term==modelo de referência teórico== para padronizar a comunicação em redes. Apesar de nunca ter sido implementado completo em nenhum sistema real, ele é valioso como ==rule==ferramenta educacional e de diagnóstico==: ao identificar em qual camada um problema ocorre (ex: 'problema na camada 3' = problema de roteamento/IP), profissionais de rede podem isolar e resolver falhas mais eficientemente.",
    question: "Qual é o principal valor prático do modelo OSI, considerando que ele nunca foi implementado completamente em sistemas reais?",
    options: [
      "Ele define os algoritmos de roteamento usados na Internet.",
      "Ele serve como linguagem comum e ferramenta de diagnóstico: identificar em qual camada um problema ocorre ajuda a isolar e resolver falhas de rede.",
      "Ele especifica os protocolos exatos que devem ser usados em cada camada.",
      "Ele define o tamanho máximo dos pacotes em cada camada da rede."
    ],
    answer: 1,
    feedback: "O ==term==modelo OSI== é uma ==rule==ferramenta de referência==. Quando um engenheiro diz 'o problema está na camada 2', todos entendem que é um problema de Enlace (MAC, switches). Isso cria uma linguagem comum e um framework sistemático para diagnóstico — independentemente dos protocolos específicos usados. Esse valor educacional e de comunicação é o legado real do OSI."
  }
  ],

  enade: [

  // ─── PARTE 1: Camada de Aplicação e Socket (Q1–Q10) ──────────────────────

  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Asserção + Justificativa",
    texto: "A Camada de Aplicação ocupa uma posição peculiar na pilha TCP/IP em relação às demais camadas.",
    question: "Analise as afirmativas sobre a ==def==Camada de Aplicação== na pilha TCP/IP:",
    assertions: [
      "A Camada de Aplicação é a única que não fornece serviços para nenhuma outra camada da pilha.",
      "[PORQUE] Ela se posiciona no topo da hierarquia e apenas consome os serviços oferecidos pela camada de transporte."
    ],
    options: [
      "As duas afirmativas são verdadeiras, e a segunda justifica corretamente a primeira.",
      "As duas afirmativas são verdadeiras, mas a segunda não justifica a primeira.",
      "A primeira afirmativa é verdadeira, mas a segunda é falsa.",
      "A primeira afirmativa é falsa, pois a Camada de Aplicação serve indiretamente à camada de apresentação no modelo TCP/IP."
    ],
    answer: 0,
    feedback: "Correto: A. A Camada de Aplicação é o ==def==topo da pilha TCP/IP== e, por isso, não há camada superior para servir — ela somente consome serviços da camada de transporte. Isso lhe confere flexibilidade para criar e remover protocolos sem impacto nas camadas inferiores."
  },

  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Conceitual contextualizada",
    texto: "Uma empresa deseja que um desenvolvedor junior implemente a comunicação entre dois processos em máquinas diferentes. O desenvolvedor não quer lidar diretamente com os detalhes de empacotamento TCP ou endereçamento IP.",
    question: "Qual abstração da Camada de Aplicação permite ao desenvolvedor tratar a comunicação de rede como operações simples de leitura e escrita, análogas ao acesso a arquivos?",
    options: [
      "Interface Socket, identificada pelo par Endereço IP + Porta",
      "Protocolo HTTP, que abstrai as conexões TCP subjacentes",
      "Agente de Transferência de Mensagens (MTA), que encapsula a comunicação",
      "Servidor DNS, que traduz nomes para endereços antes da transmissão"
    ],
    answer: 0,
    feedback: "Correto: A. A ==def==Interface Socket== é a API padrão que permite ao programador enviar e receber dados como se operasse um arquivo ou teclado, sem lidar com os detalhes físicos da rede. Um socket é identificado unicamente por IP (host) + Porta (processo)."
  },

  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Múltiplas afirmativas",
    texto: "Considere as características da Interface Socket no contexto da programação de redes.",
    question: "Quais das afirmativas abaixo estão ==rule==corretas== sobre a Interface Socket?",
    assertions: [
      "I. Um socket é identificado unicamente pela combinação de endereço IP e número de porta.",
      "II. O endereço IPv4 possui 32 bits, enquanto o número de porta possui 16 bits.",
      "III. A interface socket fornece serviços diretamente à camada de enlace para otimizar a transmissão.",
      "IV. Do ponto de vista do programador, o socket se comporta como uma abstração de entrada/saída semelhante a um arquivo."
    ],
    options: [
      "Apenas I, II e IV estão corretas.",
      "Apenas I e II estão corretas.",
      "Apenas II, III e IV estão corretas.",
      "Todas as afirmativas estão corretas."
    ],
    answer: 0,
    feedback: "Correto: A. As afirmativas I, II e IV descrevem corretamente o socket. A afirmativa III está ==warn==errada==: o socket é uma interface entre a Camada de Aplicação e a de Transporte, não interagindo diretamente com a camada de enlace."
  },

  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Análise aplicada",
    texto: "Durante o desenvolvimento de um sistema distribuído, um arquiteto precisa escolher entre o paradigma Cliente-Servidor e o Peer-to-Peer (P2P) para um serviço de compartilhamento de arquivos com milhões de usuários simultâneos.",
    question: "Qual característica do paradigma ==term==P2P== representa sua maior vantagem em relação ao modelo Cliente-Servidor para esse cenário de alta escala?",
    options: [
      "A responsabilidade é distribuída entre os nós, que agem simultaneamente como clientes e servidores, eliminando o gargalo de um servidor central.",
      "O paradigma P2P utiliza servidores sempre ativos que garantem disponibilidade contínua do serviço.",
      "No P2P, a latência é sempre menor porque a comunicação ocorre diretamente entre dois peers sem nenhuma intermediação.",
      "O P2P oferece maior segurança por padrão, pois não há ponto central vulnerável a ataques."
    ],
    answer: 0,
    feedback: "Correto: A. A principal vantagem do ==term==P2P== em alta escala é a descentralização: cada peer pode agir como cliente e servidor simultaneamente, distribuindo a carga. O modelo Cliente-Servidor cria gargalo no servidor central conforme o número de clientes cresce."
  },

  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Asserção + Justificativa",
    texto: "O Skype clássico era citado como exemplo de paradigma misto de comunicação.",
    question: "Analise as afirmativas sobre o ==term==paradigma misto== de comunicação:",
    assertions: [
      "No paradigma misto, um servidor centralizado é utilizado para localizar o endereço de um par, mas a troca de dados ocorre diretamente entre os peers.",
      "[PORQUE] Esse modelo combina a confiabilidade do servidor central para descoberta com a eficiência da comunicação direta P2P para transferência de dados."
    ],
    options: [
      "As duas afirmativas são verdadeiras, e a segunda justifica corretamente a primeira.",
      "As duas afirmativas são verdadeiras, mas a segunda não justifica a primeira.",
      "A primeira afirmativa é verdadeira, mas a segunda é falsa.",
      "Ambas são falsas: no paradigma misto, toda a comunicação passa pelo servidor central."
    ],
    answer: 0,
    feedback: "Correto: A. O ==term==paradigma misto== utiliza um servidor para a fase de descoberta (encontrar o endereço do peer) e depois estabelece comunicação direta entre os peers. Isso une a facilidade de localização centralizada com a eficiência da transferência direta."
  },

  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Conceitual contextualizada",
    texto: "Um estudante afirma que a Camada de Aplicação do modelo TCP/IP é equivalente à soma das camadas de Sessão, Apresentação e Aplicação do modelo OSI.",
    question: "Essa afirmação está correta? Qual é a relação mais precisa entre os dois modelos?",
    options: [
      "Sim, a Camada de Aplicação TCP/IP absorve funcionalmente as três camadas superiores do OSI, que na prática frequentemente ficam vazias.",
      "Não, a Camada de Aplicação TCP/IP corresponde apenas à Camada de Aplicação OSI; Sessão e Apresentação são implementadas na camada de transporte.",
      "Sim, mas somente porque o modelo TCP/IP foi criado posteriormente e corrigiu as falhas do OSI comprimindo camadas redundantes.",
      "Não, os dois modelos são incompatíveis e não possuem correspondência direta entre suas camadas."
    ],
    answer: 0,
    feedback: "Correto: A. No modelo TCP/IP (5 camadas), a Camada de Aplicação ==rule==absorve as funções de Sessão, Apresentação e Aplicação do OSI==. Na prática, as camadas de Sessão e Apresentação do OSI frequentemente ficam vazias, tornando o TCP/IP mais pragmático."
  },

  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Análise aplicada",
    texto: "Um programador precisa que seu processo servidor seja identificado de forma única na rede para receber conexões de múltiplos clientes simultaneamente.",
    question: "Para que um processo servidor seja ==key==identificado unicamente== em toda a Internet, qual combinação de informações é necessária?",
    options: [
      "Endereço IP da máquina host combinado com o número da porta do processo.",
      "Apenas o endereço IP da máquina, pois ele já identifica o processo por ser único globalmente.",
      "Nome de domínio DNS combinado com o protocolo de transporte utilizado.",
      "Número da porta combinado com o protocolo HTTP, que define o processo por padrão."
    ],
    answer: 0,
    feedback: "Correto: A. O ==key==socket== identifica unicamente um processo na rede pela combinação de Endereço IP (identifica a máquina) + Número de Porta (identifica o processo naquela máquina). Somente o IP não basta, pois várias aplicações rodam no mesmo host."
  },

  // NOVA
  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Conceitual contextualizada",
    texto: "No modelo Cliente-Servidor, o servidor precisa estar permanentemente disponível para atender requisições, ao contrário do cliente, que pode iniciar e encerrar a comunicação a qualquer momento.",
    question: "Qual característica fundamental do modelo ==term==Cliente-Servidor== o diferencia estruturalmente do modelo P2P?",
    options: [
      "O servidor deve estar sempre ativo e com endereço IP permanente; os clientes podem ter endereços IP dinâmicos e iniciar a comunicação quando necessário.",
      "No modelo Cliente-Servidor, o cliente também deve estar sempre ativo para receber respostas do servidor em tempo real.",
      "O servidor no modelo Cliente-Servidor nunca se comunica diretamente com o cliente — ele usa intermediários (proxies) para isso.",
      "Clientes no modelo Cliente-Servidor nunca se comunicam entre si, enquanto no P2P toda comunicação passa por um servidor central."
    ],
    answer: 0,
    feedback: "Correto: A. No ==term==Cliente-Servidor==, o servidor deve estar ==rule==sempre ativo== com endereço IP permanente e conhecido, pois os clientes precisam localizá-lo. Os clientes têm IP possivelmente dinâmico e iniciam a comunicação sob demanda. No P2P, essa assimetria desaparece — qualquer nó pode assumir ambos os papéis."
  },

  // NOVA
  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Múltiplas afirmativas",
    texto: "A Camada de Aplicação possui flexibilidade para a criação e remoção de protocolos em comparação com as demais camadas da pilha TCP/IP.",
    question: "Quais afirmativas explicam corretamente o motivo dessa ==rule==flexibilidade==?",
    assertions: [
      "I. Por estar no topo da pilha, modificar ou criar protocolos de aplicação não exige alterações nas camadas inferiores.",
      "II. Protocolos de aplicação como HTTP e DNS podem ser adicionados sem impacto na camada de transporte ou rede.",
      "III. A flexibilidade da Camada de Aplicação se deve ao fato de ela controlar diretamente o hardware de rede.",
      "IV. A Camada de Aplicação fornece uma interface padronizada (socket) que isola as aplicações dos detalhes de transporte."
    ],
    options: [
      "Apenas I, II e IV estão corretas.",
      "Apenas I e II estão corretas.",
      "Apenas II, III e IV estão corretas.",
      "Todas as afirmativas estão corretas."
    ],
    answer: 0,
    feedback: "Correto: A. A afirmativa III está ==warn==errada==: a Camada de Aplicação não controla hardware — quem faz isso são as camadas de Enlace e Física. A flexibilidade vem justamente do isolamento: como a Camada de Aplicação só consome serviços da camada de transporte via socket (IV), criar novos protocolos (I e II) não afeta as camadas inferiores."
  },

  // NOVA
  {
    aula: "Aula 15 - Parte 1: Camada de Aplicação e Socket",
    tipo: "Análise aplicada",
    texto: "Um desenvolvedor precisa determinar o número máximo teórico de portas disponíveis em uma máquina para identificar processos distintos.",
    question: "Dado que o número de porta possui ==rule==16 bits==, qual é o número máximo de portas distintas que podem ser usadas em um único host?",
    options: [
      "65.535 portas, pois 2^16 = 65.536 combinações possíveis (valores de 0 a 65.535).",
      "32.767 portas, pois metade dos bits é reservada para controle de fluxo TCP.",
      "256 portas, pois os 8 bits superiores identificam o protocolo e apenas os 8 inferiores identificam o processo.",
      "1.024 portas, que é o limite imposto pelo sistema operacional para aplicações de usuário."
    ],
    answer: 0,
    feedback: "Correto: A. Com ==rule==16 bits==, o número de porta pode assumir valores de 0 a 65.535 — ou seja, 65.536 combinações (2^16). Na prática, as portas 0–1023 são reservadas para serviços conhecidos (well-known ports), as 1024–49151 são registradas, e as 49152–65535 são efêmeras (usadas por clientes)."
  },

  // ─── PARTE 2: HTTP e Cookies (Q1–Q10) ────────────────────────────────────

  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Análise aplicada",
    texto: "Uma página web moderna carrega 1 arquivo HTML principal, 5 imagens e 3 scripts externos — totalizando 9 objetos. O servidor usa HTTP/1.0 (não persistente).",
    question: "Quantos RTTs são consumidos apenas nas conexões TCP (handshakes) para buscar todos os objetos dessa página usando HTTP ==proc==não persistente==?",
    options: [
      "9 RTTs — um handshake TCP por objeto solicitado.",
      "1 RTT — pois o handshake é feito uma única vez para toda a sessão.",
      "18 RTTs — pois cada objeto exige 2 RTTs (handshake + requisição).",
      "4 RTTs — correspondentes ao número de conexões paralelas permitidas."
    ],
    answer: 0,
    feedback: "Correto: A. No HTTP ==proc==não persistente==, cada objeto exige uma nova conexão TCP — portanto, 1 RTT de handshake por objeto = 9 RTTs apenas para handshakes. No total, cada objeto custa 2 RTTs (handshake + requisição), mas a questão pede apenas os handshakes."
  },

  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Múltiplas afirmativas",
    texto: "Considere as características do protocolo HTTP e seus mecanismos de funcionamento.",
    question: "Analise as afirmativas abaixo sobre o ==term==protocolo HTTP==:",
    assertions: [
      "I. O HTTP utiliza a porta 80 e opera sobre o protocolo TCP.",
      "II. O HTTP é um protocolo com estado (stateful), armazenando informações de sessão entre requisições.",
      "III. No HTTP persistente (padrão 1.1), a conexão TCP é mantida aberta após o envio da resposta.",
      "IV. Uma única transação HTTP pode gerar múltiplas sub-requisições para buscar objetos embutidos na página."
    ],
    options: [
      "Apenas I, III e IV estão corretas.",
      "Apenas I e III estão corretas.",
      "Apenas II, III e IV estão corretas.",
      "Todas as afirmativas estão corretas."
    ],
    answer: 0,
    feedback: "Correto: A. A afirmativa II está ==warn==errada==: HTTP é por definição ==term==stateless== (sem estado). Os cookies são o mecanismo externo que simula estado. As demais (I, III, IV) estão corretas — especialmente a IV, que explica por que carregar uma página pode gerar dezenas de requisições HTTP."
  },

  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Conceitual contextualizada",
    texto: "Um e-commerce exibe produtos personalizados com base no histórico do usuário, mantém um carrinho de compras entre sessões e registra preferências de idioma — tudo sem exigir login.",
    question: "Qual mecanismo do HTTP viabiliza esse comportamento, dado que o protocolo é originalmente sem estado?",
    options: [
      "Cookies, que permitem ao servidor enviar e recuperar informações entre requisições por meio do cabeçalho Set-Cookie.",
      "HTTP Persistente, que mantém a conexão TCP aberta e, com ela, o estado da sessão do usuário.",
      "Servidor Proxy, que armazena as preferências do usuário localmente no cache do provedor.",
      "Método POST, que transmite os dados de estado do cliente em cada nova requisição."
    ],
    answer: 0,
    feedback: "Correto: A. Os ==def==Cookies== são o mecanismo padrão para adicionar estado ao HTTP stateless. O servidor envia um `Set-Cookie` na resposta; o navegador armazena e reenvia esse valor em requisições futuras, permitindo personalização, carrinhos e sessões."
  },

  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Análise aplicada",
    texto: "Um desenvolvedor precisa criar um endpoint que permita ao cliente enviar dados de um formulário ao servidor para processamento, sem recuperar nenhum documento.",
    question: "Qual método HTTP é mais adequado para esse caso e qual é a diferença fundamental em relação ao método GET?",
    options: [
      "POST — enquanto GET recupera um recurso, POST envia dados ao servidor para processamento, podendo alterar seu estado.",
      "PUT — pois é o método projetado especificamente para envio de formulários, ao contrário do GET que é somente leitura.",
      "HEAD — pois ele solicita informações sobre o recurso sem transmitir dados desnecessários ao servidor.",
      "TRACE — pois ecoa os dados enviados, permitindo que o servidor confirme o recebimento antes de processá-los."
    ],
    answer: 0,
    feedback: "Correto: A. O método ==proc==POST== envia dados ao servidor para processamento (ex: formulários), podendo causar efeitos colaterais no servidor. O GET apenas solicita um recurso. O PUT envia um documento completo para substituição — diferente do POST que processa entradas."
  },

  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Asserção + Justificativa",
    texto: "Um servidor retorna o código de estado 301 para uma requisição HTTP.",
    question: "Analise as afirmativas sobre o código ==term==301 Moved Permanently==:",
    assertions: [
      "O código 301 indica que o recurso solicitado foi movido permanentemente para um novo endereço.",
      "[PORQUE] Nesse caso, o cliente deve atualizar seus registros e usar o novo URL em todas as requisições futuras, já que o recurso não retornará ao endereço original."
    ],
    options: [
      "As duas afirmativas são verdadeiras, e a segunda justifica corretamente a primeira.",
      "As duas afirmativas são verdadeiras, mas a segunda não justifica a primeira.",
      "A primeira afirmativa é verdadeira, mas a segunda é falsa — o cliente deve continuar usando o URL original.",
      "A primeira é falsa: o código 301 indica erro de autenticação, não redirecionamento."
    ],
    answer: 0,
    feedback: "Correto: A. O código ==term==301== indica redirecionamento permanente. O cabeçalho `Location` na resposta informa o novo endereço. O cliente (e navegadores/caches) deve atualizar para o novo URL em requisições futuras — diferente do 302 (temporário), onde o URL original deve ser preservado."
  },

  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Conceitual contextualizada",
    texto: "Uma organização instala um servidor intermediário em sua rede local para otimizar o acesso à Internet de seus funcionários.",
    question: "Ao instalar um ==def==Servidor Proxy==, qual é o duplo papel que ele desempenha na comunicação entre o cliente interno e o servidor web externo?",
    options: [
      "Atua como servidor para o cliente interno e como cliente para o servidor web de destino, mantendo cópias em cache das respostas.",
      "Atua como roteador para o cliente e como firewall para o servidor, bloqueando conteúdo malicioso.",
      "Atua como servidor DNS para o cliente e como servidor HTTP para o destino, traduzindo protocolos.",
      "Atua como cliente tanto para o usuário interno quanto para o servidor externo, centralizando as autenticações."
    ],
    answer: 0,
    feedback: "Correto: A. O ==def==Proxy== tem duplo papel: é ==rule==servidor para quem faz a requisição== e ==rule==cliente para o servidor de destino==. Ao armazenar respostas em cache, reduz tráfego na rede externa, diminui a carga no servidor de origem e melhora a latência para os clientes internos."
  },

  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Múltiplas afirmativas",
    texto: "Analise o cenário de privacidade relacionado ao uso de cookies em navegadores web.",
    question: "Quais afirmativas descrevem corretamente implicações do uso de ==term==cookies==?",
    assertions: [
      "I. Cookies de terceiros permitem que agências de publicidade rastreiem o comportamento do usuário em diferentes sites.",
      "II. O servidor não pode controlar quanto tempo um cookie permanece no navegador do usuário.",
      "III. Cookies são o mecanismo que adiciona estado a um protocolo originalmente stateless.",
      "IV. O cabeçalho HTTP responsável por criar um cookie no cliente é o Set-Cookie."
    ],
    options: [
      "Apenas I, III e IV estão corretas.",
      "Apenas I e IV estão corretas.",
      "Apenas II e III estão corretas.",
      "Todas as afirmativas estão corretas."
    ],
    answer: 0,
    feedback: "Correto: A. A afirmativa II está ==warn==errada==: o servidor pode definir a validade do cookie com o atributo `Expires` ou `Max-Age`. As afirmativas I, III e IV são corretas e representam o comportamento padrão e as implicações de privacidade dos ==term==cookies==."
  },

  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Análise aplicada",
    texto: "Um engenheiro analisa o tráfego de rede e observa uma resposta HTTP com o cabeçalho: 'HTTP/1.1 500 Internal Server Error'.",
    question: "O que esse código de estado indica sobre a transação HTTP e quem é o responsável pelo problema?",
    options: [
      "Indica um erro no lado do servidor; o cliente fez uma requisição válida, mas o servidor falhou ao processá-la.",
      "Indica um erro no lado do cliente; a requisição continha sintaxe inválida ou dados corrompidos.",
      "Indica que o recurso foi encontrado, mas o servidor exige autenticação antes de enviá-lo.",
      "Indica que o servidor está temporariamente indisponível por sobrecarga, sendo um erro transitório."
    ],
    answer: 0,
    feedback: "Correto: A. Códigos 5xx indicam ==warn==erros do lado do servidor==. O 500 (Internal Server Error) significa que o servidor encontrou uma condição inesperada que o impediu de atender à requisição — a falha está no servidor, não no cliente, ao contrário dos erros 4xx (ex: 404 Not Found, erro do cliente)."
  },

  // NOVA
  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Conceitual contextualizada",
    texto: "Uma página web estática contém apenas texto e não possui imagens, scripts ou estilos externos. O servidor usa HTTP/1.1 com conexão persistente.",
    question: "Qual é o número mínimo de RTTs necessários para que o navegador receba o conteúdo completo dessa página, contando a partir do momento em que a conexão TCP ainda não foi estabelecida?",
    options: [
      "2 RTTs — 1 para o handshake TCP e 1 para a requisição e resposta HTTP.",
      "1 RTT — pois no HTTP persistente o handshake e a requisição ocorrem simultaneamente.",
      "3 RTTs — 1 para DNS, 1 para handshake TCP e 1 para a requisição HTTP.",
      "4 RTTs — pois o HTTP/1.1 exige confirmação adicional antes de transmitir o conteúdo."
    ],
    answer: 0,
    feedback: "Correto: A. Com conexão ==proc==persistente==, o custo mínimo é ==rule==2 RTTs==: 1 RTT para estabelecer a conexão TCP (handshake SYN/SYN-ACK) e 1 RTT para a requisição HTTP e resposta. A resolução DNS pode adicionar RTTs adicionais, mas a questão parte do momento em que a conexão TCP ainda não foi estabelecida — sem mencionar DNS como variável."
  },

  // NOVA
  {
    aula: "Aula 15 - Parte 2: HTTP e Cookies",
    tipo: "Asserção + Justificativa",
    texto: "O método HEAD é menos utilizado por usuários finais, mas possui aplicações importantes em sistemas automatizados.",
    question: "Analise as afirmativas sobre o método ==term==HEAD==:",
    assertions: [
      "O método HEAD solicita ao servidor apenas os cabeçalhos da resposta, sem transmitir o corpo do documento.",
      "[PORQUE] Isso permite verificar metadados de um recurso — como data de modificação ou tamanho — sem o custo de baixar o conteúdo completo, sendo útil para caches e validadores."
    ],
    options: [
      "As duas afirmativas são verdadeiras, e a segunda justifica corretamente a primeira.",
      "As duas afirmativas são verdadeiras, mas a segunda não justifica a primeira.",
      "A primeira afirmativa é verdadeira, mas a segunda é falsa.",
      "A primeira é falsa: o método HEAD retorna apenas o código de estado, sem nenhum cabeçalho adicional."
    ],
    answer: 0,
    feedback: "Correto: A. O ==term==HEAD== é idêntico ao GET, mas o servidor ==rule==omite o corpo da resposta==. Isso é útil para verificar se um recurso existe (código 200 vs 404), checar sua data de modificação (`Last-Modified`) ou tamanho (`Content-Length`) sem o custo de transferir o conteúdo — exatamente o que a segunda afirmativa descreve."
  },

  // ─── PARTE 3: FTP e E-mail (Q1–Q10) ──────────────────────────────────────

  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Análise aplicada",
    texto: "Um administrador de sistemas precisa implementar transferência de arquivos entre dois servidores e está comparando FTP com alternativas seguras.",
    question: "Qual é a principal vulnerabilidade de segurança do ==term==FTP== clássico que deve motivar a adoção de uma alternativa como SFTP ou SSL-FTP?",
    options: [
      "O FTP transmite credenciais de autenticação (usuário e senha) em texto às claras, tornando-as vulneráveis a interceptação.",
      "O FTP utiliza apenas uma conexão TCP para controle e dados, criando um gargalo que pode ser explorado por ataques de negação de serviço.",
      "O FTP não suporta a transferência de arquivos binários, sendo restrito a arquivos de texto — o que o torna inapropriado para ambientes modernos.",
      "O FTP opera na porta 80, a mesma do HTTP, causando conflitos que permitem ataques de injeção de comandos."
    ],
    answer: 0,
    feedback: "Correto: A. O FTP clássico transmite usuário e senha em ==warn==texto às claras== — qualquer sniffing de rede pode capturar essas credenciais. Por isso, recomenda-se SSL-FTP (FTPS) ou SFTP (que usa o túnel SSH). O FTP também usa duas conexões (porta 21 para controle, porta 20 para dados) — não uma."
  },

  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Asserção + Justificativa",
    texto: "O protocolo FTP possui uma arquitetura de conexão diferente da maioria dos protocolos da camada de aplicação.",
    question: "Analise as afirmativas sobre a ==proc==arquitetura de conexão do FTP==:",
    assertions: [
      "O FTP utiliza duas conexões TCP simultâneas: uma na porta 21 para comandos e outra na porta 20 para a transferência efetiva dos dados.",
      "[PORQUE] Separar controle e dados em conexões distintas permite que os comandos de gerenciamento da sessão trafeguem de forma independente da transferência, tornando o protocolo mais eficiente e flexível."
    ],
    options: [
      "As duas afirmativas são verdadeiras, e a segunda justifica corretamente a primeira.",
      "As duas afirmativas são verdadeiras, mas a segunda não justifica a primeira.",
      "A primeira afirmativa é verdadeira, mas a segunda é falsa.",
      "A primeira afirmativa é falsa: o FTP usa apenas uma conexão TCP para controle e multiplexia os dados nela."
    ],
    answer: 0,
    feedback: "Correto: A. O FTP usa ==proc==duas conexões TCP==: porta 21 (controle/comandos/autenticação) e porta 20 (dados/arquivos). Essa separação é intencional — permite que a sessão de controle permaneça ativa enquanto transferências ocorrem, e que múltiplas transferências possam ser gerenciadas pela mesma sessão de controle."
  },

  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Múltiplas afirmativas",
    texto: "O sistema de e-mail envolve diferentes agentes com funções distintas no fluxo de entrega de uma mensagem.",
    question: "Quais afirmativas descrevem corretamente os agentes do ==term==sistema de e-mail==?",
    assertions: [
      "I. O Agente de Usuário (UA) é a interface do usuário para ler e compor e-mails (ex: Outlook).",
      "II. O Agente de Transferência (MTA) é responsável por transferir a mensagem entre servidores usando SMTP.",
      "III. O Agente de Acesso (MAA) empurra a mensagem do servidor de origem para o servidor destino.",
      "IV. O protocolo POP3 é um exemplo de protocolo usado pelo Agente de Acesso para que o destinatário recupere suas mensagens."
    ],
    options: [
      "Apenas I, II e IV estão corretas.",
      "Apenas I e II estão corretas.",
      "Apenas II, III e IV estão corretas.",
      "Todas as afirmativas estão corretas."
    ],
    answer: 0,
    feedback: "Correto: A. A afirmativa III está ==warn==errada==: o MAA é um ==proc==agente pull== (POP/IMAP) — ele permite ao destinatário puxar mensagens do servidor. Quem empurra (push) é o MTA via SMTP. As afirmativas I, II e IV descrevem corretamente os três agentes do sistema de e-mail."
  },

  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Conceitual contextualizada",
    texto: "Uma empresa implementa um sistema de e-mail onde os funcionários acessam suas mensagens de múltiplos dispositivos (celular, notebook e desktop) e precisam que a caixa de entrada esteja sempre sincronizada entre todos eles.",
    question: "Qual protocolo de acesso a e-mail é mais adequado para esse cenário e por quê?",
    options: [
      "IMAP, pois mantém as mensagens armazenadas no servidor e sincronizadas entre todos os dispositivos.",
      "POP3, pois baixa e remove as mensagens do servidor, garantindo que cada dispositivo tenha acesso exclusivo.",
      "SMTP, pois além de enviar e-mails, também gerencia a sincronização entre servidores de diferentes provedores.",
      "MIME, pois é o protocolo responsável por garantir a compatibilidade das mensagens em diferentes sistemas operacionais."
    ],
    answer: 0,
    feedback: "Correto: A. O ==def==IMAP (porta 143)== mantém as mensagens no servidor e sincroniza o estado (lida/não lida, pastas) entre múltiplos dispositivos. O POP3 baixa e remove as mensagens — inadequado para múltiplos dispositivos. O SMTP é apenas para envio, e MIME é uma extensão de formato, não protocolo de acesso."
  },

  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Análise aplicada",
    texto: "Um usuário tenta enviar um e-mail com uma foto de viagem como anexo. O servidor de e-mail destino aceita apenas mensagens em formato NVT ASCII de 7 bits.",
    question: "Qual mecanismo permite o envio desse anexo binário por um sistema que só suporta ==rule==ASCII de 7 bits==?",
    options: [
      "MIME com codificação Base64, que converte os bytes binários da imagem em caracteres ASCII transmissíveis.",
      "SMTP com modo binário, que ativa automaticamente ao detectar conteúdo não-ASCII no corpo da mensagem.",
      "POP3 com compressão, que reduz o tamanho do binário até ele se encaixar nos limites ASCII.",
      "NVT ASCII estendido de 8 bits, que já suporta conteúdo binário e é utilizado por padrão em servidores modernos."
    ],
    answer: 0,
    feedback: "Correto: A. O ==def==MIME== (Multipurpose Internet Mail Extensions) resolve a limitação do sistema de e-mail original. A codificação ==proc==Base64== converte cada 3 bytes de dados binários em 4 caracteres ASCII de 8 bits, introduzindo overhead de ~33%, mas tornando o binário transmissível por sistemas 7-bit."
  },

  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Asserção + Justificativa",
    texto: "O protocolo SMTP é classificado como um protocolo 'push', enquanto POP3 e IMAP são classificados como 'pull'.",
    question: "Analise as afirmativas sobre a ==proc==direção de comunicação== dos protocolos de e-mail:",
    assertions: [
      "O SMTP empurra (push) a mensagem do cliente de e-mail ou servidor de origem para o servidor destino.",
      "[PORQUE] O e-mail é uma comunicação assíncrona de mão única: o remetente inicia a transferência sem que o destinatário precise estar online, exigindo um mecanismo de push para depositar a mensagem no servidor intermediário."
    ],
    options: [
      "As duas afirmativas são verdadeiras, e a segunda justifica corretamente a primeira.",
      "As duas afirmativas são verdadeiras, mas a segunda não justifica a primeira.",
      "A primeira afirmativa é verdadeira, mas a segunda é falsa.",
      "A primeira é falsa: o SMTP também pode funcionar como pull quando o servidor destinatário solicita mensagens."
    ],
    answer: 0,
    feedback: "Correto: A. O ==proc==SMTP== é push porque o remetente inicia e controla a entrega. Como o e-mail é assíncrono — o destinatário pode estar offline — é necessário depositar a mensagem num servidor intermediário (push). Depois, o destinatário usa POP3 ou IMAP (pull) para buscar as mensagens quando conveniente."
  },

  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Conceitual contextualizada",
    texto: "Mensagens de e-mail frequentemente contêm caracteres especiais como acentos (á, ç, ñ) ou símbolos de moedas, que estão fora do conjunto ASCII básico de 7 bits.",
    question: "Qual codificação MIME é mais eficiente para uma mensagem predominantemente em texto em português (com poucos caracteres acentuados) em comparação com o Base64?",
    options: [
      "Quoted-Printable, que converte apenas os caracteres não-ASCII para sua representação hexadecimal, mantendo o restante como texto legível.",
      "Base64, que é sempre mais eficiente por converter todo o conteúdo uniformemente, independentemente da proporção de caracteres especiais.",
      "NVT ASCII puro, que suporta acentos nativamente através de um modo de compatibilidade bidirecional.",
      "UTF-16, que é o padrão MIME moderno e substitui completamente Quoted-Printable e Base64."
    ],
    answer: 0,
    feedback: "Correto: A. O ==proc==Quoted-Printable== é ideal para textos majoritariamente ASCII com poucos caracteres especiais: apenas os caracteres fora do ASCII são convertidos para `=XX` (hexadecimal). O Base64 codifica tudo — incluindo o que já é ASCII — gerando ~33% de overhead mesmo em texto simples."
  },

  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Múltiplas afirmativas",
    texto: "Considere as portas e protocolos de transporte utilizados pelos principais protocolos de e-mail.",
    question: "Quais afirmativas sobre ==rule==portas e protocolos de e-mail== estão corretas?",
    assertions: [
      "I. O SMTP opera na porta 25 usando TCP.",
      "II. O POP3 opera na porta 110 e remove as mensagens do servidor após o download.",
      "III. O IMAP opera na porta 143 e mantém as mensagens no servidor, permitindo sincronização.",
      "IV. O SMTP pode operar sobre UDP para maior velocidade em redes de alta latência."
    ],
    options: [
      "Apenas I, II e III estão corretas.",
      "Apenas I e II estão corretas.",
      "Apenas II, III e IV estão corretas.",
      "Todas as afirmativas estão corretas."
    ],
    answer: 0,
    feedback: "Correto: A. A afirmativa IV está ==warn==errada==: o SMTP opera exclusivamente sobre ==rule==TCP== (não UDP), pois a entrega confiável de e-mails exige a garantia de entrega da camada de transporte. I, II e III descrevem corretamente as portas e comportamentos do SMTP (25), POP3 (110) e IMAP (143)."
  },

  // NOVA
  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Análise aplicada",
    texto: "Uma empresa deseja migrar sua infraestrutura de e-mail e precisa entender as diferenças práticas entre POP3 e IMAP para decidir qual protocolo de acesso adotar.",
    question: "Qual é a diferença operacional fundamental entre ==term==POP3== e ==term==IMAP== do ponto de vista do armazenamento das mensagens?",
    options: [
      "POP3 baixa as mensagens para o cliente e as remove do servidor; IMAP mantém as mensagens no servidor, permitindo acesso e sincronização de múltiplos dispositivos.",
      "POP3 mantém cópias no servidor por 30 dias por padrão; IMAP exclui imediatamente após o download.",
      "Ambos mantêm as mensagens no servidor, mas o IMAP exige autenticação de dois fatores enquanto o POP3 não.",
      "POP3 é usado exclusivamente para leitura; IMAP também gerencia o envio de respostas ao servidor SMTP."
    ],
    answer: 0,
    feedback: "Correto: A. O ==term==POP3== foi projetado para ambientes com um único dispositivo: baixa e remove as mensagens do servidor. O ==term==IMAP== mantém tudo no servidor e sincroniza o estado (lida, marcada, pasta) entre todos os clientes — fundamental em ambientes corporativos com múltiplos dispositivos por usuário."
  },

  // NOVA
  {
    aula: "Aula 15 - Parte 3: FTP e E-mail",
    tipo: "Conceitual contextualizada",
    texto: "Um sistema de e-mail legado foi projetado para transmitir apenas texto simples em ASCII de 7 bits. Um usuário tenta enviar um arquivo executável (.exe) como anexo.",
    question: "Qual é o overhead introduzido pela codificação ==proc==Base64== ao converter um arquivo binário para transmissão por e-mail?",
    options: [
      "Aproximadamente 33%, pois cada 3 bytes de dados binários são convertidos em 4 caracteres ASCII.",
      "Aproximadamente 10%, pois o Base64 apenas adiciona cabeçalhos de controle ao redor do conteúdo binário.",
      "Nenhum overhead, pois o Base64 comprime os dados antes de codificá-los em ASCII.",
      "Aproximadamente 50%, pois cada byte binário (8 bits) é mapeado em dois caracteres ASCII de 8 bits."
    ],
    answer: 0,
    feedback: "Correto: A. O ==proc==Base64== converte grupos de 3 bytes (24 bits) em 4 caracteres ASCII (32 bits), introduzindo um overhead de ==rule==33%== no tamanho do arquivo. Ou seja, um arquivo de 3 MB torna-se aproximadamente 4 MB após a codificação. Esse é o custo para tornar dados binários transmissíveis por sistemas ASCII de 7 bits."
  },

  // ─── PARTE 4: DNS e P2P (Q1–Q10) ──────────────────────────────────────────

  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Análise aplicada",
    texto: "Um usuário digita 'www.unicatolicaquixada.edu.br' no navegador. O DNS local não possui o registro em cache.",
    question: "Na resolução DNS ==proc==recursiva==, qual é o papel assumido pelo servidor DNS local durante esse processo?",
    options: [
      "O servidor local assume toda a responsabilidade pela resolução: consulta o servidor raiz, depois o TLD e depois o autoritativo, retornando o IP final ao cliente.",
      "O servidor local repassa ao cliente o endereço do servidor raiz para que o próprio cliente faça as consultas subsequentes.",
      "O servidor local consulta apenas o servidor raiz e repassa o resultado diretamente ao cliente, sem consultar o servidor autoritativo.",
      "O servidor local envia uma requisição broadcast para todos os servidores DNS conhecidos e usa a primeira resposta recebida."
    ],
    answer: 0,
    feedback: "Correto: A. Na resolução ==proc==recursiva==, o servidor DNS local é o agente ativo: ele consulta o servidor raiz → TLD → autoritativo e devolve o IP final ao cliente. O cliente faz apenas uma consulta. Na iterativa, seria o contrário: o servidor apenas indica o próximo passo e o cliente faz cada consulta."
  },

  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Comparação",
    texto: "Em um exame, um aluno confundiu resolução DNS recursiva com iterativa e perdeu pontos ao descrever incorretamente quem realiza as consultas.",
    question: "Qual é a diferença fundamental entre resolução DNS ==term==recursiva== e ==term==iterativa==?",
    options: [
      "Na recursiva, o servidor consultado resolve completamente e retorna a resposta final; na iterativa, cada servidor indica o próximo a ser consultado e o cliente faz cada consulta.",
      "Na recursiva, o cliente realiza todas as consultas; na iterativa, um servidor centralizado resolve tudo por delegação.",
      "A resolução recursiva é usada apenas para domínios internacionais; a iterativa, para domínios nacionais como '.br'.",
      "Ambas têm o mesmo resultado, diferindo apenas no uso de cache: a recursiva usa cache, a iterativa não."
    ],
    answer: 0,
    feedback: "Correto: A. ==proc==Recursiva==: o servidor DNS local faz todo o trabalho e devolve a resposta pronta ao cliente (como um assistente que pesquisa tudo por você). ==proc==Iterativa==: cada servidor responde 'não sei, mas pergunte a fulano' e o cliente faz a próxima consulta (como um mapa de pistas). Ambas usam cache."
  },

  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Múltiplas afirmativas",
    texto: "O DNS é descrito como um sistema de banco de dados distribuído e hierárquico.",
    question: "Quais afirmativas descrevem corretamente as ==rule==características do DNS==?",
    assertions: [
      "I. O espaço de nomes DNS é organizado em árvore invertida com até 128 níveis hierárquicos.",
      "II. Cada nó da árvore DNS pode ter um rótulo de até 63 caracteres.",
      "III. As zonas DNS são partes contíguas da árvore sob a autoridade de um único servidor.",
      "IV. O servidor DNS primário armazena o arquivo de zona em memória RAM, enquanto o secundário o mantém em disco."
    ],
    options: [
      "Apenas I, II e III estão corretas.",
      "Apenas I e III estão corretas.",
      "Apenas II e IV estão corretas.",
      "Todas as afirmativas estão corretas."
    ],
    answer: 0,
    feedback: "Correto: A. A afirmativa IV está ==warn==invertida==: é o servidor ==rule==primário== que mantém o arquivo de zona em **disco** e serve como fonte autoritativa; o secundário copia os dados do primário. As afirmativas I, II e III descrevem corretamente a estrutura hierárquica, os tamanhos de rótulo e o conceito de zonas."
  },

  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Conceitual contextualizada",
    texto: "Um engenheiro de redes observa que consultas DNS repetidas para o mesmo domínio respondem muito mais rápido do que a primeira consulta.",
    question: "O que explica essa diferença de velocidade e como as respostas em cache são identificadas quanto à sua confiabilidade?",
    options: [
      "As consultas subsequentes são atendidas pelo cache do servidor DNS local, e as respostas cacheadas são marcadas como não autoritativas.",
      "As consultas repetidas são redirecionadas ao servidor raiz que mantém um cache global, retornando respostas autoritativas mais rapidamente.",
      "O cliente armazena os resultados localmente e não consulta o DNS novamente, tornando todas as respostas subsequentes autoritativas.",
      "O protocolo DNS usa UDP para consultas repetidas e TCP para a primeira, o que explica a diferença de velocidade."
    ],
    answer: 0,
    feedback: "Correto: A. O ==proc==caching DNS== armazena mapeamentos recentes no servidor local para acelerar consultas futuras. Essas respostas são marcadas como ==rule==não autoritativas== porque vieram de um intermediário, não do servidor de zona responsável. O TTL (Time to Live) controla por quanto tempo o cache é válido."
  },

  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Análise aplicada",
    texto: "Em uma rede P2P estruturada com DHT, o arquivo 'AlgoritmosAvançados.pdf' tem sua chave calculada como hash('AlgoritmosAvançados.pdf') = 22. Os nós existentes no anel têm IDs: N5, N14, N20, N28, N35.",
    question: "De acordo com o princípio do ==proc==DHT==, qual nó será responsável por armazenar a referência para esse arquivo?",
    options: [
      "N28, pois é o sucessor mais próximo da chave 22 no anel (menor ID maior que 22).",
      "N20, pois é o nó com ID mais próximo numericamente da chave 22.",
      "N14, pois é o predecessor imediato da chave 22 e assume a responsabilidade por proximidade.",
      "N5, pois em DHT o nó com menor ID sempre armazena as chaves maiores que o último nó do anel."
    ],
    answer: 0,
    feedback: "Correto: A. No ==proc==DHT==, o nó responsável pela chave K é o ==rule==sucessor== de K — o nó com o menor ID que seja maior ou igual a K. Para a chave 22, o sucessor é N28 (o menor ID acima de 22). N20 é anterior a 22, portanto não é o responsável."
  },

  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Asserção + Justificativa",
    texto: "O algoritmo Chord utiliza tabelas de derivação (finger tables) para roteamento em redes DHT.",
    question: "Analise as afirmativas sobre a eficiência do ==term==algoritmo Chord==:",
    assertions: [
      "Com o Chord, qualquer busca em uma rede com N nós pode ser resolvida em tempo O(log N) com apenas m entradas na finger table de cada nó.",
      "[PORQUE] Cada entrada na finger table aponta para um nó estrategicamente distante no anel, permitindo que cada salto elimine metade dos candidatos restantes, análogo a uma busca binária."
    ],
    options: [
      "As duas afirmativas são verdadeiras, e a segunda justifica corretamente a primeira.",
      "As duas afirmativas são verdadeiras, mas a segunda não justifica a primeira.",
      "A primeira afirmativa é verdadeira, mas a segunda é falsa.",
      "A primeira é falsa: o Chord requer O(N) saltos pois cada nó conhece apenas seu sucessor imediato."
    ],
    answer: 0,
    feedback: "Correto: A. O ==term==Chord== atinge O(log N) porque cada nó mantém m entradas na finger table, onde a i-ésima entrada aponta para o sucessor de (n + 2^i) mod 2^m. Isso permite que cada salto cubra metade do espaço restante, análogo à busca binária — justificando a complexidade logarítmica."
  },

  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Conceitual contextualizada",
    texto: "No BitTorrent, um peer que acabou de entrar no enxame possui apenas os primeiros 3 pedaços de um arquivo de 20 pedaços e tenta obter mais partes.",
    question: "Qual mecanismo do BitTorrent determina quais peers irão colaborar com esse novo participante?",
    options: [
      "Tit-for-tat: o novo peer só receberá pedaços de outros peers que também estiverem recebendo pedaços dele; sua contribuição determina o acesso.",
      "O Tracker central decide democraticamente quais peers devem colaborar com os novos participantes, priorizando quem tem menos partes.",
      "Seeds (peers com arquivo completo) têm obrigação protocolar de enviar pedaços a qualquer leeche que solicitar, independente de reciprocidade.",
      "O sistema DHT do BitTorrent distribui automaticamente os pedaços para o novo peer sem exigir nenhuma contribuição prévia."
    ],
    answer: 0,
    feedback: "Correto: A. O ==proc==Tit-for-tat== é a estratégia de equidade do BitTorrent: um peer fornece pedaços principalmente a quem também lhe fornece. Isso incentiva a contribuição e desencoraja free-riders (quem só baixa sem contribuir). Novos peers recebem um período inicial de 'otimismo' para entrar no swarm."
  },

  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Múltiplas afirmativas",
    texto: "O BitTorrent passou por uma evolução arquitetural significativa ao longo dos anos.",
    question: "Quais afirmativas sobre a ==term==evolução do BitTorrent== estão corretas?",
    assertions: [
      "I. O Tracker é a entidade que monitora o enxame e fornece a lista de vizinhos a novos peers.",
      "II. Seeds são peers que possuem o arquivo completo; Leeches são peers ainda obtendo partes.",
      "III. Versões modernas do BitTorrent eliminaram completamente o Tracker usando DHT.",
      "IV. O enxame (Swarm) refere-se apenas aos Leeches — os Seeds são tratados como servidores externos ao enxame."
    ],
    options: [
      "Apenas I, II e III estão corretas.",
      "Apenas I e II estão corretas.",
      "Apenas II e III estão corretas.",
      "Todas as afirmativas estão corretas."
    ],
    answer: 0,
    feedback: "Correto: A. A afirmativa IV está ==warn==errada==: o ==term==Swarm== inclui todos os peers, tanto Seeds quanto Leeches. Seeds fazem parte do enxame. As afirmativas I, II e III descrevem corretamente o Tracker, as categorias de peers e a evolução para DHT sem tracker central."
  },

  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Análise aplicada",
    texto: "Um pesquisador compara a resiliência de sistemas DNS com redes P2P baseadas em DHT sob o critério de tolerância a falhas e pontos únicos de falha.",
    question: "Por que o ==def==DNS distribuído== e o ==def==DHT== compartilham o mesmo princípio arquitetural de resiliência?",
    options: [
      "Ambos eliminam pontos únicos de falha ao distribuir a base de dados: o DNS pela hierarquia de servidores autoritativos e o DHT pelo espalhamento de referências pelo anel de peers.",
      "Ambos usam servidores centrais de backup que assumem automaticamente quando o servidor primário falha.",
      "Ambos replicam todos os dados em todos os nós, garantindo que qualquer falha individual não cause perda de informação.",
      "Ambos dependem de um coordenador central que monitora a disponibilidade e redistribui dados em caso de falha."
    ],
    answer: 0,
    feedback: "Correto: A. Tanto o ==def==DNS== quanto o ==def==DHT== eliminam pontos únicos de falha pela ==rule==distribuição==: o DNS usa uma hierarquia de servidores onde cada zona tem primário e secundários; o DHT distribui referências pelo anel de peers. Se um nó cai, outros assumem suas responsabilidades. Ambos evitam o modelo centralizado frágil."
  },

  // NOVA
  {
    aula: "Aula 15 - Parte 4: DNS e P2P",
    tipo: "Conceitual contextualizada",
    texto: "Em uma rede DHT com m = 5, o espaço de endereços tem 32 posições (2^5). Os nós presentes são N3, N7, N12, N20 e N28. Um arquivo tem sua chave calculada como hash(nome) = 28.",
    question: "Qual nó armazena a referência para esse arquivo, e o que acontece se a chave fosse 30 — valor maior que o maior ID (N28) do anel?",
    options: [
      "Chave 28 → N28 (é o próprio sucessor). Chave 30 → N3, pois o anel é circular e N3 é o próximo sucessor após N28.",
      "Chave 28 → N28. Chave 30 → N28, pois o nó com maior ID absorve todas as chaves excedentes.",
      "Chave 28 → N20, pois o sucessor deve ser estritamente maior que a chave. Chave 30 → N28.",
      "Chave 28 → N28. Chave 30 → nenhum nó — a chave fica pendente até um novo nó com ID 30 entrar no anel."
    ],
    answer: 0,
    feedback: "Correto: A. No ==proc==DHT==, o anel é ==rule==circular==. Para a chave 28, o sucessor é N28 (o próprio nó com ID igual). Para a chave 30, não existe nó com ID ≥ 30 antes de completar o círculo — então o sucessor é N3 (o menor ID do anel). Isso demonstra a natureza circular do espaço de endereços DHT."
  },

  // ─── PARTE 5: SSH, TELNET e Modelos OSI/TCP (Q1–Q10) ─────────────────────

  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Análise aplicada",
    texto: "Um administrador de sistemas precisa acessar remotamente um servidor Linux em produção para executar comandos de manutenção. A rede pela qual a comunicação passa não é confiável.",
    question: "Por que ==term==SSH== é preferível ao TELNET nesse cenário, considerando especificamente os riscos de segurança do TELNET?",
    options: [
      "TELNET transmite usuário, senha e todos os dados em texto às claras, permitindo interceptação; SSH criptografa toda a comunicação através do componente SSH-TRANS.",
      "TELNET não suporta autenticação de qualquer tipo, enquanto SSH exige certificados digitais obrigatórios para conexão.",
      "TELNET opera sobre UDP e é vulnerável a perdas de pacotes; SSH opera sobre TCP e garante entrega confiável.",
      "TELNET limita os comandos executáveis remotamente; SSH remove essa restrição e permite controle total do servidor."
    ],
    answer: 0,
    feedback: "Correto: A. O ==term==TELNET== transmite tudo — incluindo usuário e senha — em ==warn==texto às claras==. Qualquer sniffing de rede pode capturar as credenciais. O ==term==SSH== usa o componente SSH-TRANS para criar um canal criptografado sobre TCP, garantindo privacidade e integridade. Ambos operam sobre TCP."
  },

  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Múltiplas afirmativas",
    texto: "O SSH é composto por três componentes principais, cada um com uma função específica na comunicação segura.",
    question: "Quais afirmativas sobre os ==term==componentes do SSH== estão corretas?",
    assertions: [
      "I. O SSH-TRANS cria um canal seguro sobre TCP, garantindo privacidade e integridade das mensagens.",
      "II. O SSH-AUTH autentica o cliente em relação ao servidor usando métodos similares ao SSL.",
      "III. O SSH-CONN (Port Forwarding) cria túneis para proteger outros protocolos inseguros como FTP e SMTP.",
      "IV. O SSH-TRANS substitui completamente o protocolo TCP, criando sua própria camada de transporte segura."
    ],
    options: [
      "Apenas I, II e III estão corretas.",
      "Apenas I e II estão corretas.",
      "Apenas II, III e IV estão corretas.",
      "Todas as afirmativas estão corretas."
    ],
    answer: 0,
    feedback: "Correto: A. A afirmativa IV está ==warn==errada==: o ==term==SSH-TRANS== opera **sobre** TCP, não o substitui — ele adiciona uma camada de segurança sobre a conexão TCP existente. As afirmativas I, II e III descrevem corretamente os três componentes: SSH-TRANS (canal seguro), SSH-AUTH (autenticação) e SSH-CONN (tunelamento)."
  },

  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Conceitual contextualizada",
    texto: "Uma equipe usa FTP internamente, mas os dados trafegam por uma rede corporativa compartilhada onde o tráfego pode ser monitorado. Substituir o FTP por SFTP não é viável no curto prazo.",
    question: "Como o componente ==term==SSH-CONN== (Port Forwarding) pode proteger o tráfego FTP sem substituir o protocolo?",
    options: [
      "Criando um túnel SSH que encapsula o tráfego FTP, fazendo os dados trafegarem criptografados por dentro da conexão SSH.",
      "Substituindo as portas 20 e 21 do FTP pelas portas SSH equivalentes, tornando o protocolo compatível com criptografia.",
      "Comprimindo os pacotes FTP antes do envio, tornando-os ilegíveis para observadores externos sem chave de descompressão.",
      "Encaminhando as credenciais FTP para o servidor SSH, que as verifica antes de permitir a conexão com o servidor FTP."
    ],
    answer: 0,
    feedback: "Correto: A. O ==term==SSH-CONN== (Port Forwarding / tunelamento) encapsula protocolos inseguros dentro de um túnel SSH. O tráfego FTP trafega criptografado por dentro da conexão SSH — o observador vê apenas tráfego SSH, não as credenciais ou dados FTP. É uma solução de curto prazo até migrar para SFTP."
  },

  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Asserção + Justificativa",
    texto: "O NVT (Terminal Virtual de Rede) é um componente central do protocolo TELNET.",
    question: "Analise as afirmativas sobre o ==def==NVT no TELNET==:",
    assertions: [
      "O NVT resolve o problema de heterogeneidade entre sistemas operacionais ao definir um conjunto universal de caracteres ASCII de 8 bits para transmissão.",
      "[PORQUE] Diferentes sistemas operacionais usam representações distintas para os mesmos caracteres e comandos de controle, e o NVT atua como um tradutor intermediário comum entre os dois lados da comunicação."
    ],
    options: [
      "As duas afirmativas são verdadeiras, e a segunda justifica corretamente a primeira.",
      "As duas afirmativas são verdadeiras, mas a segunda não justifica a primeira.",
      "A primeira afirmativa é verdadeira, mas a segunda é falsa.",
      "A primeira é falsa: o NVT usa apenas ASCII de 7 bits e não resolve problemas de heterogeneidade."
    ],
    answer: 0,
    feedback: "Correto: A. O ==def==NVT== usa ASCII de 8 bits e serve como representação intermediária universal. Antes de transmitir, cada lado converte seus dados para NVT; ao receber, converte de NVT para seu formato nativo. Isso resolve a incompatibilidade entre sistemas como DOS e UNIX sem exigir que cada par conheça o formato do outro."
  },

  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Comparação",
    texto: "Professores de redes frequentemente debatem as vantagens e limitações dos modelos OSI e TCP/IP como referências para o ensino e para a implementação de protocolos.",
    question: "Qual afirmativa descreve com mais precisão a diferença fundamental entre o ==term==modelo OSI== e o ==term==modelo TCP/IP==?",
    options: [
      "OSI é um modelo teórico e normativo com 7 camadas (incluindo Sessão e Apresentação que frequentemente ficam vazias); TCP/IP é um modelo prático com 5 camadas onde a Aplicação absorve essas funções.",
      "OSI é usado exclusivamente em redes corporativas enquanto TCP/IP é usado na Internet; ambos possuem o mesmo número de camadas mas com nomes diferentes.",
      "TCP/IP é mais teórico e foi criado antes do OSI como modelo de referência; o OSI é a implementação prática usada na Internet moderna.",
      "OSI possui 5 camadas e TCP/IP possui 7 camadas; a diferença está na granularidade das camadas de transporte e enlace."
    ],
    answer: 0,
    feedback: "Correto: A. O ==term==OSI (7 camadas)== é um modelo teórico/normativo onde as camadas de Sessão e Apresentação frequentemente ficam vazias na prática. O ==term==TCP/IP (5 camadas)== é pragmático e incorpora as funções dessas camadas na Camada de Aplicação. A crítica ao TCP/IP é que não distingue claramente serviço, interface e protocolo."
  },

  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Análise aplicada",
    texto: "Um estudante lista as camadas do modelo TCP/IP de cima para baixo como: Aplicação, Transporte, Rede, Enlace, Física. Em seguida, afirma que a Camada de Aplicação do TCP/IP é equivalente apenas à Camada de Aplicação do modelo OSI.",
    question: "Por que essa equivalência está ==warn==incorreta== e qual é a relação correta entre as camadas superiores dos dois modelos?",
    options: [
      "A Camada de Aplicação TCP/IP incorpora as funções das camadas de Aplicação, Apresentação e Sessão do OSI, que no modelo prático foram unificadas.",
      "A equivalência está incorreta porque a Camada de Aplicação TCP/IP corresponde apenas às camadas de Apresentação e Sessão do OSI, não incluindo a Aplicação.",
      "A equivalência está incorreta porque o TCP/IP possui uma camada adicional de 'Interface de Rede' que não tem equivalente no OSI.",
      "A equivalência está incorreta somente em termos históricos: o OSI foi criado depois do TCP/IP e adicionou camadas redundantes sem correspondência real."
    ],
    answer: 0,
    feedback: "Correto: A. A ==rule==Camada de Aplicação TCP/IP== absorve as funções das três camadas superiores do OSI: ==term==Aplicação (7)== + ==term==Apresentação (6)== + ==term==Sessão (5)==. Na prática, as camadas de Sessão e Apresentação do OSI raramente têm implementações independentes, sendo suas funções realizadas diretamente pelas aplicações."
  },

  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Múltiplas afirmativas",
    texto: "Considere a tabela de protocolos, portas e protocolos de transporte da camada de aplicação.",
    question: "Quais associações entre ==rule==protocolo, porta e função== estão corretas?",
    assertions: [
      "I. SSH usa a porta 22 sobre TCP para acesso remoto seguro.",
      "II. DNS usa exclusivamente a porta 53 sobre TCP para todas as consultas.",
      "III. HTTPS usa a porta 443 sobre TCP para web segura.",
      "IV. TELNET usa a porta 23 sobre TCP para acesso remoto sem criptografia."
    ],
    options: [
      "Apenas I, III e IV estão corretas.",
      "Apenas I e III estão corretas.",
      "Apenas II, III e IV estão corretas.",
      "Todas as afirmativas estão corretas."
    ],
    answer: 0,
    feedback: "Correto: A. A afirmativa II está ==warn==parcialmente errada==: o DNS usa a porta 53 mas pode operar sobre ==rule==UDP ou TCP==. UDP é o padrão para consultas comuns (mais leve); TCP é usado quando as respostas excedem 512 bytes ou para transferências de zona entre servidores. As demais (I, III, IV) estão corretas."
  },

  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Análise aplicada",
    texto: "Um desenvolvedor está projetando uma aplicação de streaming de vídeo em tempo real e outra de transferência de arquivos críticos para um sistema bancário. Ele precisa definir os protocolos de transporte adequados para cada caso.",
    question: "Considerando os paradigmas da Camada de Aplicação, qual afirmativa descreve corretamente a decisão de protocolo de transporte para cada aplicação?",
    options: [
      "Streaming pode usar UDP (aceita perdas em favor da velocidade); transferência bancária deve usar TCP (garantia de entrega e ordem).",
      "Ambas devem usar TCP, pois a Camada de Aplicação não pode compensar perdas de pacotes causadas pelo UDP.",
      "Streaming deve usar TCP para evitar artefatos visuais; transferência bancária pode usar UDP pois os dados são pequenos e raramente se perdem.",
      "A escolha do protocolo de transporte é irrelevante, pois a Camada de Aplicação implementa suas próprias garantias de entrega independentemente."
    ],
    answer: 0,
    feedback: "Correto: A. O ==rule==UDP== é adequado para streaming (latência baixa importa mais que perfeição — perder um frame é aceitável). O ==rule==TCP== é obrigatório para transferências bancárias (integridade e ordem são críticas — um bit errado pode ser catastrófico). A Camada de Aplicação consome os serviços de transporte, não os substitui."
  },

  // NOVA
  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Conceitual contextualizada",
    texto: "Um analista de segurança está auditando uma infraestrutura legada que ainda utiliza TELNET para acesso remoto a equipamentos de rede.",
    question: "Além da transmissão de credenciais em texto às claras, qual outra limitação do ==term==TELNET== justifica sua substituição pelo SSH em ambientes modernos?",
    options: [
      "O TELNET não oferece integridade dos dados — um atacante na rota pode modificar os comandos transmitidos sem que o cliente ou servidor perceba.",
      "O TELNET opera sobre UDP, tornando as conexões instáveis em redes com alta taxa de perda de pacotes.",
      "O TELNET só permite autenticação por certificado digital, o que é incompatível com a maioria dos sistemas legados.",
      "O TELNET não suporta múltiplas sessões simultâneas, limitando o administrador a apenas uma conexão por vez."
    ],
    answer: 0,
    feedback: "Correto: A. Além de expor credenciais, o ==term==TELNET== não garante ==warn==integridade== — sem criptografia, um atacante em posição de homem-no-meio pode alterar os comandos em trânsito (ex: modificar 'show config' para 'reset factory'). O ==term==SSH== resolve ambos os problemas: criptografia garante confidencialidade e autenticação de mensagem garante integridade."
  },

  // NOVA
  {
    aula: "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
    tipo: "Asserção + Justificativa",
    texto: "O modelo OSI é frequentemente criticado apesar de ser mais completo e detalhado que o modelo TCP/IP.",
    question: "Analise as afirmativas sobre as ==term==críticas ao modelo OSI==:",
    assertions: [
      "O modelo OSI é criticado por incluir camadas como Sessão e Apresentação que frequentemente ficam vazias na prática, sem implementações reais.",
      "[PORQUE] Na prática de desenvolvimento de protocolos, as funções de sessão e apresentação são incorporadas diretamente nas aplicações, tornando essas camadas redundantes no modelo TCP/IP."
    ],
    options: [
      "As duas afirmativas são verdadeiras, e a segunda justifica corretamente a primeira.",
      "As duas afirmativas são verdadeiras, mas a segunda não justifica a primeira.",
      "A primeira afirmativa é verdadeira, mas a segunda é falsa.",
      "Ambas são falsas: as camadas de Sessão e Apresentação são amplamente implementadas em protocolos modernos."
    ],
    answer: 0,
    feedback: "Correto: A. O ==term==OSI== propôs camadas de Sessão e Apresentação com funções bem definidas, mas na prática essas responsabilidades foram absorvidas pela camada de Aplicação. O modelo ==term==TCP/IP== se mostrou mais pragmático ao unificar essas funções, pois os desenvolvedores de aplicações implementam diretamente o que precisam, sem depender de uma camada intermediária formal."
  },

  ],


  fixacao: [

    // ═══════════════════════════════════════════════════════
    // PARTE 1 — Camada de Aplicação e Socket (10 questões ✅)
    // ═══════════════════════════════════════════════════════

    {
      "aula": "Aula 15 - Parte 1: Camada de Aplicação e Socket",
      "tipo": "Direta",
      "texto": "A Camada de Aplicação ocupa uma posição específica na pilha TCP/IP.",
      "question": "Qual é a posição da Camada de Aplicação na pilha TCP/IP?",
      "options": [
        "1ª camada (mais baixa)",
        "3ª camada (intermediária)",
        "5ª camada (mais alta)",
        "4ª camada (transporte)"
      ],
      "answer": 2,
      "feedback": "A Camada de Aplicação é a 5ª e mais alta camada da pilha TCP/IP, sendo a interface direta com o usuário."
    },
    {
      "aula": "Aula 15 - Parte 1: Camada de Aplicação e Socket",
      "tipo": "Curta",
      "texto": "A Camada de Aplicação tem um papel único em relação às outras camadas.",
      "question": "O que diferencia a Camada de Aplicação das demais camadas da pilha TCP/IP?",
      "options": [
        "É a única que usa endereços IP",
        "É a única que não fornece serviços para outras camadas",
        "É a única que trabalha com protocolos UDP",
        "É a única que realiza roteamento de pacotes"
      ],
      "answer": 1,
      "feedback": "A Camada de Aplicação é a única que não serve às camadas inferiores — ela apenas consome serviços da camada de transporte."
    },
    {
      "aula": "Aula 15 - Parte 1: Camada de Aplicação e Socket",
      "tipo": "Contexto",
      "texto": "Um programador precisa criar um programa que envie dados pela rede sem se preocupar com os detalhes físicos da comunicação.",
      "question": "Qual é a API mais comum que permite essa abstração na comunicação em rede?",
      "options": [
        "Interface REST",
        "Interface Socket",
        "Interface MIME",
        "Interface FTP"
      ],
      "answer": 1,
      "feedback": "A Interface Socket é a API mais comum, permitindo enviar e receber dados como se fossem operações simples de leitura e escrita em arquivo."
    },
    {
      "aula": "Aula 15 - Parte 1: Camada de Aplicação e Socket",
      "tipo": "Direta",
      "texto": "Um socket é identificado por dois elementos combinados.",
      "question": "Quais são os dois componentes que identificam unicamente um socket?",
      "options": [
        "Nome de domínio e protocolo",
        "Endereço MAC e número de porta",
        "Endereço IP e número de porta",
        "Endereço IP e endereço MAC"
      ],
      "answer": 2,
      "feedback": "Um socket é identificado pelo Endereço IP (identifica a máquina) combinado com o Número de Porta (identifica o processo)."
    },
    {
      "aula": "Aula 15 - Parte 1: Camada de Aplicação e Socket",
      "tipo": "Curta",
      "texto": "O número de porta tem um tamanho fixo em bits.",
      "question": "Quantos bits possui o número de porta em um socket IPv4?",
      "options": [
        "8 bits",
        "32 bits",
        "16 bits",
        "64 bits"
      ],
      "answer": 2,
      "feedback": "O número de porta possui 16 bits, permitindo até 65.535 portas distintas."
    },
    {
      "aula": "Aula 15 - Parte 1: Camada de Aplicação e Socket",
      "tipo": "Contexto",
      "texto": "No paradigma Cliente-Servidor, cada lado tem comportamentos bem definidos.",
      "question": "Qual das afirmações abaixo descreve corretamente o papel do servidor nesse paradigma?",
      "options": [
        "O servidor inicia a comunicação e pode ficar offline",
        "O servidor deve estar sempre ativo, aguardando solicitações",
        "O servidor só se comunica com um único cliente por vez",
        "O servidor e o cliente têm responsabilidades iguais"
      ],
      "answer": 1,
      "feedback": "No paradigma Cliente-Servidor, o servidor deve estar sempre ativo aguardando solicitações, enquanto o cliente inicia a comunicação apenas quando necessário."
    },
    {
      "aula": "Aula 15 - Parte 1: Camada de Aplicação e Socket",
      "tipo": "Aplicação",
      "texto": "Um aplicativo de troca de mensagens usa servidores apenas para localizar os usuários; depois, os usuários trocam dados diretamente entre si.",
      "question": "Esse modelo de comunicação se enquadra em qual paradigma?",
      "options": [
        "Cliente-Servidor puro",
        "Peer-to-Peer puro",
        "Paradigma Misto",
        "Modelo OSI"
      ],
      "answer": 2,
      "feedback": "O Paradigma Misto usa servidores para encontrar o endereço de um par e realiza a troca de dados diretamente entre peers — exemplo clássico: o Skype antigo."
    },
    {
      "aula": "Aula 15 - Parte 1: Camada de Aplicação e Socket",
      "tipo": "Direta",
      "texto": "O Peer-to-Peer é uma arquitetura descentralizada.",
      "question": "No paradigma P2P, como os nós participantes são chamados?",
      "options": [
        "Clientes",
        "Servidores",
        "Peers",
        "Proxies"
      ],
      "answer": 2,
      "feedback": "Os participantes de uma rede P2P são chamados de peers (pares), e podem agir como clientes e servidores simultaneamente."
    },
    {
      "aula": "Aula 15 - Parte 1: Camada de Aplicação e Socket",
      "tipo": "Curta",
      "texto": "Protocolos da Camada de Aplicação incluem exemplos amplamente conhecidos.",
      "question": "Quais dos protocolos abaixo pertencem à Camada de Aplicação?",
      "options": [
        "IP, TCP e UDP",
        "HTTP, SMTP e DNS",
        "Ethernet e Wi-Fi",
        "BGP e OSPF"
      ],
      "answer": 1,
      "feedback": "HTTP, SMTP e DNS são protocolos da Camada de Aplicação, normalmente integrados ao sistema operacional."
    },
    {
      "aula": "Aula 15 - Parte 1: Camada de Aplicação e Socket",
      "tipo": "Aplicação",
      "texto": "Um desenvolvedor descreve o socket como sendo semelhante a trabalhar com um arquivo no disco.",
      "question": "Por que essa analogia é válida?",
      "options": [
        "Porque ambos usam endereços IP para localização",
        "Porque o socket permite enviar e receber dados com comandos simples de leitura e escrita",
        "Porque arquivos e sockets usam a mesma porta de comunicação",
        "Porque tanto o socket quanto o arquivo dependem do protocolo TCP"
      ],
      "answer": 1,
      "feedback": "A analogia é válida porque o socket abstrai a rede, permitindo ao programador simplesmente 'ler' e 'escrever' dados, sem se preocupar com os detalhes físicos da comunicação."
    },

    // ═══════════════════════════════════════════════════════
    // PARTE 2 — HTTP e Cookies (11 → 10 questões: removida 1)
    // Removida: "servidor proxy duplo papel" — conceito já
    // coberto pela questão de aplicação do proxy (última da parte).
    // ═══════════════════════════════════════════════════════

    {
      "aula": "Aula 15 - Parte 2: HTTP e Cookies",
      "tipo": "Direta",
      "texto": "O protocolo HTTP opera sobre uma porta padrão bem definida.",
      "question": "Qual é a porta padrão utilizada pelo protocolo HTTP?",
      "options": [
        "Porta 443",
        "Porta 21",
        "Porta 80",
        "Porta 25"
      ],
      "answer": 2,
      "feedback": "HTTP utiliza a porta 80 sobre TCP como porta padrão de comunicação."
    },
    {
      "aula": "Aula 15 - Parte 2: HTTP e Cookies",
      "tipo": "Contexto",
      "texto": "Em HTTP não persistente, cada objeto de uma página web exige uma nova conexão TCP.",
      "question": "Quantos RTTs são necessários para obter um único objeto via HTTP não persistente?",
      "options": [
        "Zero RTTs",
        "1 RTT",
        "2 RTTs",
        "3 RTTs"
      ],
      "answer": 2,
      "feedback": "São necessários 2 RTTs por objeto: 1 RTT para o handshake TCP e 1 RTT para a requisição HTTP em si."
    },
    {
      "aula": "Aula 15 - Parte 2: HTTP e Cookies",
      "tipo": "Curta",
      "texto": "O HTTP/1.1 introduziu um modo de conexão mais eficiente.",
      "question": "Qual é a principal vantagem da conexão HTTP persistente em relação à não persistente?",
      "options": [
        "Usa menos largura de banda por objeto",
        "Reutiliza a conexão TCP, economizando RTTs e buffers no servidor",
        "Criptografa os dados automaticamente",
        "Elimina a necessidade de cabeçalhos HTTP"
      ],
      "answer": 1,
      "feedback": "A conexão persistente mantém a conexão TCP aberta após enviar a resposta, evitando novos handshakes e economizando RTT e buffers no servidor."
    },
    {
      "aula": "Aula 15 - Parte 2: HTTP e Cookies",
      "tipo": "Direta",
      "texto": "Mensagens HTTP de requisição seguem um formato específico.",
      "question": "Qual é o primeiro elemento de uma linha de solicitação em uma mensagem HTTP de pedido?",
      "options": [
        "Versão HTTP",
        "URL do recurso",
        "Método HTTP",
        "Código de estado"
      ],
      "answer": 2,
      "feedback": "A linha de solicitação é composta por: Método + URL + Versão HTTP, nessa ordem."
    },
    {
      "aula": "Aula 15 - Parte 2: HTTP e Cookies",
      "tipo": "Aplicação",
      "texto": "Um desenvolvedor precisa enviar dados de um formulário HTML para processamento no servidor.",
      "question": "Qual método HTTP é mais adequado para essa operação?",
      "options": [
        "GET",
        "HEAD",
        "DELETE",
        "POST"
      ],
      "answer": 3,
      "feedback": "O método POST é usado para enviar informações do cliente para o servidor para processamento, como dados de formulários."
    },
    {
      "aula": "Aula 15 - Parte 2: HTTP e Cookies",
      "tipo": "Curta",
      "texto": "Os métodos HTTP têm funções bastante distintas.",
      "question": "Qual método HTTP solicita apenas informações sobre um documento, sem retornar o conteúdo do documento em si?",
      "options": [
        "GET",
        "HEAD",
        "OPTIONS",
        "TRACE"
      ],
      "answer": 1,
      "feedback": "O método HEAD solicita informações (cabeçalhos) sobre um documento, mas não retorna o corpo do documento."
    },
    {
      "aula": "Aula 15 - Parte 2: HTTP e Cookies",
      "tipo": "Direta",
      "texto": "Códigos de estado HTTP comunicam o resultado de uma requisição.",
      "question": "O que indica o código de estado HTTP 404?",
      "options": [
        "Requisição bem-sucedida",
        "Recurso movido permanentemente",
        "Erro interno do servidor",
        "Recurso não encontrado"
      ],
      "answer": 3,
      "feedback": "O código 404 (Not Found) indica que o recurso solicitado não foi encontrado no servidor."
    },
    {
      "aula": "Aula 15 - Parte 2: HTTP e Cookies",
      "tipo": "Contexto",
      "texto": "Um site de e-commerce precisa lembrar os itens que o usuário adicionou ao carrinho, mesmo sem o usuário fazer login.",
      "question": "Qual mecanismo do HTTP é usado para armazenar essa informação entre requisições?",
      "options": [
        "Cabeçalho Content-Type",
        "Método PUT",
        "Cookies",
        "Servidor Proxy"
      ],
      "answer": 2,
      "feedback": "Cookies são usados para adicionar estado ao HTTP (que é stateless por padrão), permitindo que o servidor 'lembre' informações entre requisições, como itens de carrinho."
    },
    {
      "aula": "Aula 15 - Parte 2: HTTP e Cookies",
      "tipo": "Curta",
      "texto": "HTTP tem uma característica fundamental em relação ao estado das conexões.",
      "question": "Como é chamada a característica do HTTP que significa que ele não guarda estado entre requisições?",
      "options": [
        "Sem sessão",
        "Stateless",
        "Connectionless",
        "Non-persistent"
      ],
      "answer": 1,
      "feedback": "HTTP é um protocolo stateless (sem estado) — por padrão, não guarda informações entre requisições. Os cookies foram criados para contornar essa limitação."
    },
    {
      "aula": "Aula 15 - Parte 2: HTTP e Cookies",
      "tipo": "Aplicação",
      "texto": "Uma empresa configura um servidor intermediário na rede local para armazenar cópias de páginas frequentemente acessadas.",
      "question": "Qual é o nome desse tipo de servidor e qual é seu principal benefício?",
      "options": [
        "Servidor DNS; resolve nomes de domínio",
        "Servidor SMTP; envia e-mails mais rápido",
        "Servidor Proxy; reduz tráfego e melhora latência",
        "Servidor FTP; transfere arquivos com segurança"
      ],
      "answer": 2,
      "feedback": "O Servidor Proxy (Cache Web) armazena cópias de respostas recentes, reduzindo a carga no servidor original, diminuindo tráfego de rede e melhorando a latência. Ele age como servidor para o cliente e como cliente para o servidor Web de destino."
    },

    // ═══════════════════════════════════════════════════════
    // PARTE 3 — FTP e E-mail (10 questões ✅ — sem alteração)
    // ═══════════════════════════════════════════════════════

    {
      "aula": "Aula 15 - Parte 3: FTP e E-mail",
      "tipo": "Direta",
      "texto": "O FTP utiliza duas conexões TCP distintas para operar.",
      "question": "Quais são as portas utilizadas pelo FTP para suas duas conexões?",
      "options": [
        "Porta 80 (controle) e porta 443 (dados)",
        "Porta 21 (controle) e porta 20 (dados)",
        "Porta 25 (controle) e porta 110 (dados)",
        "Porta 22 (controle) e porta 23 (dados)"
      ],
      "answer": 1,
      "feedback": "O FTP usa a porta 21 para controle (comandos e autenticação) e a porta 20 para a transferência real de dados."
    },
    {
      "aula": "Aula 15 - Parte 3: FTP e E-mail",
      "tipo": "Curta",
      "texto": "O FTP possui uma vulnerabilidade de segurança importante.",
      "question": "Qual é a principal vulnerabilidade de segurança do FTP tradicional?",
      "options": [
        "Não suporta transferência de arquivos binários",
        "Envia senhas em texto às claras",
        "Usa apenas a porta 80, causando conflitos com HTTP",
        "Não consegue lidar com sistemas operacionais diferentes"
      ],
      "answer": 1,
      "feedback": "O FTP envia senhas em texto às claras (sem criptografia), sendo recomendado o uso de SSL-FTP para conexões seguras."
    },
    {
      "aula": "Aula 15 - Parte 3: FTP e E-mail",
      "tipo": "Aplicação",
      "texto": "Alice quer enviar um e-mail para Bob. Bob não está online no momento do envio.",
      "question": "Por que o e-mail ainda assim chega ao destino, mesmo Bob estando offline?",
      "options": [
        "Porque o HTTP mantém a conexão persistente",
        "Porque servidores intermediários (MTAs) armazenam a mensagem até Bob recuperá-la",
        "Porque o protocolo DNS guarda a mensagem temporariamente",
        "Porque o socket do remetente mantém a conexão aberta"
      ],
      "answer": 1,
      "feedback": "O e-mail usa Agentes de Transferência (MTAs) como servidores intermediários que armazenam e encaminham a mensagem, não exigindo que remetente e destinatário estejam online simultaneamente."
    },
    {
      "aula": "Aula 15 - Parte 3: FTP e E-mail",
      "tipo": "Direta",
      "texto": "Os três agentes de e-mail têm funções distintas.",
      "question": "Qual agente é responsável pela interface com o usuário para ler e compor e-mails?",
      "options": [
        "MTA (Agente de Transferência)",
        "MAA (Agente de Acesso)",
        "UA (Agente de Usuário)",
        "DNS (Sistema de Nomes)"
      ],
      "answer": 2,
      "feedback": "O UA (User Agent) é o Agente de Usuário, responsável pela interface com o usuário para ler e compor e-mails. Exemplos: Outlook, Thunderbird."
    },
    {
      "aula": "Aula 15 - Parte 3: FTP e E-mail",
      "tipo": "Contexto",
      "texto": "O protocolo SMTP tem uma característica de direção no envio de mensagens.",
      "question": "Por que o SMTP é classificado como um protocolo 'push'?",
      "options": [
        "Porque exige que o receptor solicite as mensagens",
        "Porque empurra a mensagem do cliente para o servidor",
        "Porque usa a porta 110 para comunicação",
        "Porque mantém as mensagens sincronizadas no servidor"
      ],
      "answer": 1,
      "feedback": "SMTP é push porque 'empurra' a mensagem do cliente para o servidor, sem que o servidor precise solicitar. Opera na porta 25."
    },
    {
      "aula": "Aula 15 - Parte 3: FTP e E-mail",
      "tipo": "Curta",
      "texto": "POP e IMAP são protocolos de acesso a e-mail com comportamentos distintos.",
      "question": "Qual é a principal diferença entre o protocolo POP e o IMAP?",
      "options": [
        "POP usa UDP; IMAP usa TCP",
        "POP remove mensagens do servidor após download; IMAP mantém as mensagens sincronizadas no servidor",
        "POP é seguro; IMAP não possui criptografia",
        "POP opera na porta 143; IMAP opera na porta 110"
      ],
      "answer": 1,
      "feedback": "POP (porta 110) baixa e remove as mensagens do servidor. IMAP (porta 143) mantém as mensagens no servidor, permitindo sincronização entre múltiplos dispositivos."
    },
    {
      "aula": "Aula 15 - Parte 3: FTP e E-mail",
      "tipo": "Aplicação",
      "texto": "Um usuário precisa acessar seu e-mail de diferentes dispositivos (computador, celular e tablet) e quer que todas as mensagens apareçam em todos os dispositivos.",
      "question": "Qual protocolo de acesso a e-mail é mais adequado para essa situação?",
      "options": [
        "SMTP",
        "POP",
        "IMAP",
        "FTP"
      ],
      "answer": 2,
      "feedback": "O IMAP é ideal pois mantém as mensagens no servidor e sincroniza o estado entre todos os dispositivos, ao contrário do POP que remove as mensagens após o download."
    },
    {
      "aula": "Aula 15 - Parte 3: FTP e E-mail",
      "tipo": "Contexto",
      "texto": "O sistema de e-mail original foi projetado para texto simples, mas os usuários precisam enviar imagens e arquivos.",
      "question": "Qual extensão foi criada para permitir o envio de dados não-ASCII (imagens, vídeos, acentos) por e-mail?",
      "options": [
        "SSL",
        "MIME",
        "IMAP",
        "SSH"
      ],
      "answer": 1,
      "feedback": "MIME (Multipurpose Internet Mail Extensions) permite enviar dados não-ASCII convertendo binários para NVT ASCII no remetente e realizando o processo inverso no receptor."
    },
    {
      "aula": "Aula 15 - Parte 3: FTP e E-mail",
      "tipo": "Direta",
      "texto": "A codificação Base64 usada pelo MIME gera um overhead de tamanho.",
      "question": "Qual é o overhead gerado pela codificação Base64 do MIME?",
      "options": [
        "10% de aumento no tamanho",
        "50% de aumento no tamanho",
        "33% de aumento no tamanho",
        "5% de aumento no tamanho"
      ],
      "answer": 2,
      "feedback": "A codificação Base64 converte cada 3 bytes (24 bits) em 4 caracteres ASCII (32 bits), gerando um overhead de aproximadamente 33% no tamanho do arquivo."
    },
    {
      "aula": "Aula 15 - Parte 3: FTP e E-mail",
      "tipo": "Curta",
      "texto": "O MIME oferece diferentes estratégias de codificação.",
      "question": "Quando a codificação Quoted-Printable do MIME é mais indicada?",
      "options": [
        "Para arquivos puramente binários como imagens e vídeos",
        "Para mensagens majoritariamente ASCII com poucos caracteres especiais, como acentos",
        "Para compactar arquivos grandes antes do envio",
        "Para criptografar o conteúdo do e-mail"
      ],
      "answer": 1,
      "feedback": "Quoted-Printable é ideal para mensagens predominantemente ASCII com poucos caracteres especiais (como acentos), convertendo apenas esses caracteres para hexadecimal."
    },

    // ═══════════════════════════════════════════════════════
    // PARTE 4 — DNS e P2P (12 → 10 questões: removidas 2)
    // Removidas:
    //   - "DNS caching não autoritativo" — coberto implicitamente
    //     nas questões de resolução recursiva/iterativa
    //   - "BitTorrent Tit-for-tat" — conceito repetido; já
    //     abordado na questão "Seeds" e "DHT/trackers"
    // ═══════════════════════════════════════════════════════

    {
      "aula": "Aula 15 - Parte 4: DNS e P2P",
      "tipo": "Direta",
      "texto": "O DNS tem uma função fundamental na navegação na internet.",
      "question": "Qual é a função principal do DNS?",
      "options": [
        "Transferir arquivos entre servidores",
        "Mapear nomes de domínio para endereços IP",
        "Enviar e receber e-mails",
        "Controlar o acesso a páginas web"
      ],
      "answer": 1,
      "feedback": "O DNS (Domain Name System) mapeia nomes de domínio amigáveis (como www.google.com) para endereços IP numéricos exigidos pela pilha TCP/IP."
    },
    {
      "aula": "Aula 15 - Parte 4: DNS e P2P",
      "tipo": "Curta",
      "texto": "O DNS é organizado como uma estrutura hierárquica.",
      "question": "Como é organizado o espaço de nomes do DNS?",
      "options": [
        "Lista plana e centralizada",
        "Tabela hash distribuída sem hierarquia",
        "Árvore invertida hierárquica com até 128 níveis",
        "Grafo circular com servidores distribuídos uniformemente"
      ],
      "answer": 2,
      "feedback": "O DNS é organizado como uma árvore invertida hierárquica com até 128 níveis, onde cada nó tem um rótulo (label) de até 63 caracteres."
    },
    {
      "aula": "Aula 15 - Parte 4: DNS e P2P",
      "tipo": "Aplicação",
      "texto": "Ao acessar www.unicatolicaquixada.edu.br, o computador precisa descobrir o endereço IP correspondente.",
      "question": "Na resolução DNS recursiva, quem assume a responsabilidade de consultar todos os servidores até obter o IP final?",
      "options": [
        "O navegador do usuário",
        "O computador do usuário",
        "O servidor DNS local",
        "O servidor raiz"
      ],
      "answer": 2,
      "feedback": "Na resolução recursiva, o servidor DNS local assume toda a responsabilidade, consultando servidores raiz, TLD e autoritativo, retornando o IP final ao cliente."
    },
    {
      "aula": "Aula 15 - Parte 4: DNS e P2P",
      "tipo": "Contexto",
      "texto": "Existem dois tipos principais de resolução DNS com comportamentos muito distintos.",
      "question": "Na resolução DNS iterativa, o que o servidor retorna ao solicitante quando não conhece a resposta?",
      "options": [
        "O endereço IP final diretamente",
        "Uma mensagem de erro solicitando nova tentativa",
        "O endereço do próximo servidor que pode saber a resposta",
        "Uma cópia em cache da última resposta conhecida"
      ],
      "answer": 2,
      "feedback": "Na resolução iterativa, o servidor não resolve por conta própria — ele retorna o endereço do próximo servidor que pode saber a resposta, e o cliente faz a nova consulta ele mesmo."
    },
    {
      "aula": "Aula 15 - Parte 4: DNS e P2P",
      "tipo": "Curta",
      "texto": "As DHTs são usadas em redes P2P estruturadas para localizar arquivos.",
      "question": "Qual função de hash é utilizada para gerar os IDs de nós e chaves de arquivos em um anel DHT?",
      "options": [
        "MD5",
        "SHA-1",
        "AES",
        "Base64"
      ],
      "answer": 1,
      "feedback": "A função SHA-1 é utilizada para gerar o ID do nó a partir do seu IP e a chave do arquivo a partir do nome do arquivo no anel DHT."
    },
    {
      "aula": "Aula 15 - Parte 4: DNS e P2P",
      "tipo": "Contexto",
      "texto": "Em uma DHT com m=5, o arquivo 'Liberdade' tem hash(nome) = 14.",
      "question": "Se os nós disponíveis são N5, N17 e N28, qual nó armazenará a referência para esse arquivo?",
      "options": [
        "N5, por ser o menor ID",
        "N17, por ser o sucessor mais próximo da chave 14",
        "N28, por ser o maior ID",
        "Qualquer nó, pois o armazenamento é aleatório"
      ],
      "answer": 1,
      "feedback": "Na DHT, o nó responsável é o sucessor mais próximo da chave — o nó cujo ID é o menor valor maior ou igual à chave. Para chave 14, o sucessor é N17."
    },
    {
      "aula": "Aula 15 - Parte 4: DNS e P2P",
      "tipo": "Direta",
      "texto": "O algoritmo Chord implementa uma forma eficiente de roteamento em DHTs.",
      "question": "Qual é a complexidade de busca no algoritmo Chord com N nós?",
      "options": [
        "O(N) — linear",
        "O(N²) — quadrática",
        "O(log N) — logarítmica",
        "O(1) — constante"
      ],
      "answer": 2,
      "feedback": "O Chord utiliza Tabelas de Derivação (finger tables) que permitem resolver qualquer busca em tempo logarítmico O(log N), onde N é o número de nós."
    },
    {
      "aula": "Aula 15 - Parte 4: DNS e P2P",
      "tipo": "Aplicação",
      "texto": "No BitTorrent, usuários com o arquivo completo têm um papel especial.",
      "question": "Como são chamados os peers que possuem o arquivo completo no BitTorrent?",
      "options": [
        "Trackers",
        "Leeches",
        "Seeds",
        "Swarms"
      ],
      "answer": 2,
      "feedback": "Seeds são os peers que possuem o arquivo completo. Leeches são os peers que ainda estão obtendo partes do arquivo."
    },
    {
      "aula": "Aula 15 - Parte 4: DNS e P2P",
      "tipo": "Curta",
      "texto": "O BitTorrent evoluiu para eliminar um ponto central de controle.",
      "question": "Como versões modernas do BitTorrent eliminaram a dependência de trackers centrais?",
      "options": [
        "Usando servidores proxy hierárquicos",
        "Usando DHT para localização descentralizada de arquivos",
        "Usando DNS privado para cada enxame",
        "Usando SMTP para troca de metadados"
      ],
      "answer": 1,
      "feedback": "Versões modernas do BitTorrent usam DHT para eliminar trackers centrais, tornando o sistema totalmente descentralizado."
    },
    {
      "aula": "Aula 15 - Parte 4: DNS e P2P",
      "tipo": "Contexto",
      "texto": "O BitTorrent divide os arquivos em pedaços pequenos para facilitar a distribuição colaborativa entre peers.",
      "question": "Como o BitTorrent garante que todos os peers contribuam com o envio de dados e não apenas consumam?",
      "options": [
        "O tracker central controla quem pode baixar com base em seu histórico",
        "O peer só pode baixar de peers que também lhe enviam dados (Tit-for-tat)",
        "O seed distribui os pedaços igualmente para todos os leeches",
        "O DNS do enxame bloqueia peers que não compartilham"
      ],
      "answer": 1,
      "feedback": "A estratégia Tit-for-tat garante equidade: um peer fornece pedaços apenas para quem também lhe envia dados, incentivando a colaboração mútua e evitando comportamentos parasitas."
    },

    // ═══════════════════════════════════════════════════════
    // PARTE 5 — SSH, TELNET e Modelos OSI/TCP (12 → 10: removidas 2)
    // Removidas:
    //   - "SSH-AUTH autentica o cliente" — conceito repetido;
    //     já coberto pela questão "SSH-TRANS cria canal seguro"
    //     e pela questão de aplicação do SSH
    //   - "IMAP porta 143" — fora do foco da Parte 5
    //     (porta e protocolo de e-mail pertencem à Parte 3)
    // ═══════════════════════════════════════════════════════

    {
      "aula": "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
      "tipo": "Direta",
      "texto": "O TELNET foi um dos primeiros protocolos de acesso remoto.",
      "question": "Qual é a principal vulnerabilidade de segurança do TELNET?",
      "options": [
        "Não suporta autenticação de usuários",
        "Transmite usuário e senha em texto às claras",
        "Só funciona em redes locais",
        "Não suporta caracteres especiais"
      ],
      "answer": 1,
      "feedback": "O TELNET envia usuário e senha em texto às claras, sem qualquer criptografia, sendo considerado inseguro e substituído pelo SSH."
    },
    {
      "aula": "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
      "tipo": "Curta",
      "texto": "O TELNET resolve um problema de heterogeneidade entre sistemas operacionais.",
      "question": "Qual mecanismo o TELNET usa para resolver as diferenças entre terminais de diferentes sistemas operacionais?",
      "options": [
        "Proxy universal",
        "Socket bidirecional",
        "NVT (Terminal Virtual de Rede)",
        "MIME de terminal"
      ],
      "answer": 2,
      "feedback": "O TELNET usa o NVT (Network Virtual Terminal), um conjunto universal de 8 bits para dados e controle, resolvendo as diferenças entre sistemas operacionais."
    },
    {
      "aula": "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
      "tipo": "Aplicação",
      "texto": "Um administrador de sistemas precisa acessar remotamente um servidor de forma segura.",
      "question": "Qual protocolo deve ser usado no lugar do TELNET para garantir segurança na conexão?",
      "options": [
        "FTP",
        "HTTP",
        "SSH",
        "SMTP"
      ],
      "answer": 2,
      "feedback": "O SSH (Secure Shell) substitui o TELNET fornecendo conexão segura com autenticação e criptografia sobre uma rede insegura, operando na porta 22."
    },
    {
      "aula": "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
      "tipo": "Contexto",
      "texto": "O SSH é composto por três componentes com funções bem definidas.",
      "question": "Qual componente do SSH é responsável por criar o canal seguro sobre TCP?",
      "options": [
        "SSH-AUTH",
        "SSH-CONN",
        "SSH-TRANS",
        "SSH-NVT"
      ],
      "answer": 2,
      "feedback": "SSH-TRANS é o componente que cria o canal seguro sobre TCP, garantindo privacidade e integridade das mensagens transmitidas."
    },
    {
      "aula": "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
      "tipo": "Aplicação",
      "texto": "Um administrador precisa usar FTP (que transmite dados sem criptografia) de forma segura em uma rede insegura.",
      "question": "Qual recurso do SSH permite proteger o tráfego FTP sem modificar o protocolo FTP em si?",
      "options": [
        "SSH-AUTH com certificado digital",
        "SSH-CONN com Port Forwarding (tunelamento)",
        "SSH-TRANS com compressão de dados",
        "SSH-NVT com codificação Base64"
      ],
      "answer": 1,
      "feedback": "SSH-CONN com Port Forwarding cria um túnel seguro que protege outros protocolos vulneráveis (como FTP, SMTP) transportando seu tráfego de forma criptografada."
    },
    {
      "aula": "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
      "tipo": "Curta",
      "texto": "O modelo OSI e o modelo TCP/IP têm número diferente de camadas.",
      "question": "Quantas camadas possui o modelo OSI e quantas possui o modelo TCP/IP?",
      "options": [
        "OSI: 5 camadas; TCP/IP: 7 camadas",
        "OSI: 4 camadas; TCP/IP: 7 camadas",
        "OSI: 7 camadas; TCP/IP: 5 camadas",
        "OSI: 7 camadas; TCP/IP: 4 camadas"
      ],
      "answer": 2,
      "feedback": "O modelo OSI possui 7 camadas (incluindo Sessão e Apresentação), enquanto o modelo TCP/IP possui 5 camadas, incorporando as funções de topo na Camada de Aplicação."
    },
    {
      "aula": "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
      "tipo": "Contexto",
      "texto": "O modelo OSI é considerado teórico, enquanto o TCP/IP é prático.",
      "question": "Quais duas camadas do OSI são consideradas frequentemente vazias na prática e são absorvidas pela Camada de Aplicação no TCP/IP?",
      "options": [
        "Física e Enlace",
        "Rede e Transporte",
        "Sessão e Apresentação",
        "Transporte e Sessão"
      ],
      "answer": 2,
      "feedback": "As camadas de Sessão e Apresentação do OSI são frequentemente vazias na prática. No TCP/IP, suas funções são incorporadas diretamente na Camada de Aplicação."
    },
    {
      "aula": "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
      "tipo": "Direta",
      "texto": "O modelo TCP/IP recebe críticas em relação à separação de conceitos.",
      "question": "Qual é uma crítica comum feita ao modelo TCP/IP em comparação ao OSI?",
      "options": [
        "Possui camadas demais, tornando-o complexo",
        "Não distingue claramente serviço, interface e protocolo",
        "Não suporta protocolos modernos como HTTP/2",
        "Não é compatível com redes sem fio"
      ],
      "answer": 1,
      "feedback": "Uma crítica ao TCP/IP é que ele não distingue claramente serviço, interface e protocolo, ao contrário do OSI que é mais rigoroso nessa separação."
    },
    {
      "aula": "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
      "tipo": "Aplicação",
      "texto": "Um estudante precisa memorizar as portas dos principais protocolos para uma prova.",
      "question": "Qual das combinações protocolo-porta abaixo está CORRETA?",
      "options": [
        "SSH porta 23; TELNET porta 22",
        "SMTP porta 110; POP3 porta 25",
        "DNS porta 53; HTTPS porta 443",
        "IMAP porta 25; FTP controle porta 20"
      ],
      "answer": 2,
      "feedback": "DNS usa a porta 53 (UDP/TCP) e HTTPS usa a porta 443 (TCP). As demais opções têm as portas trocadas ou incorretas."
    },
    {
      "aula": "Aula 15 - Parte 5: SSH, TELNET e Modelos OSI/TCP",
      "tipo": "Direta",
      "texto": "O DNS usa um protocolo de transporte específico.",
      "question": "Qual(is) protocolo(s) de transporte o DNS pode utilizar?",
      "options": [
        "Apenas TCP",
        "Apenas UDP",
        "UDP e TCP",
        "Apenas ICMP"
      ],
      "answer": 2,
      "feedback": "O DNS opera na porta 53 e pode usar tanto UDP (para consultas rápidas) quanto TCP (para transferências de zona ou respostas grandes)."
    }

  ],

};