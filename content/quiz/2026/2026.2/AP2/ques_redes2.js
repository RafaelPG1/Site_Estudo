// ============================================================
// NEXUS STUDY — quiz/conteudo/2026.2/AP1/redes2.js
// ============================================================
window.questoes = {

  // Questões de Banco de dados 
  questoes: [


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


// aula 7
// 1 - Categorias multimídia
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Explicativa",
  texto: "Os serviços multimídia na Internet se dividem em três categorias. No streaming de conteúdo armazenado, o arquivo já está gravado no servidor e o usuário pede a reprodução sob demanda. No streaming ao vivo, o áudio e o vídeo são transmitidos enquanto o evento acontece, com pequeno atraso. Já no áudio e vídeo interativos, os participantes enviam e recebem dados ao mesmo tempo, nos dois sentidos, e a baixa latência é essencial.",
  question: "Uma videoconferência em que todos os participantes falam e ouvem simultaneamente pertence a qual categoria?",
  options: [
    "Streaming de conteúdo armazenado, pois o vídeo é gravado antes.",
    "Streaming de conteúdo ao vivo, pois só há um emissor e vários espectadores.",
    "Áudio e vídeo interativos, pois a comunicação é nos dois sentidos e com baixa latência.",
    "Download tradicional, pois o arquivo completo é baixado antes da reprodução."
  ],
  answer: 2,
  feedback: "A comunicação bidirecional com baixa latência é a marca do áudio e vídeo interativos, como videoconferências, chamadas de vídeo e aulas síncronas."
},

// 2 - Digitalização
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Explicativa",
  texto: "Antes de trafegar pela rede, o som captado por um microfone, que é um sinal analógico e varia continuamente no tempo, precisa virar dados digitais. Isso acontece em três etapas. Primeiro, a amostragem coleta valores do sinal em intervalos regulares. Depois, a quantização aproxima cada valor coletado para um nível discreto. Por fim, a codificação representa esses níveis como sequências de bits.",
  question: "Qual etapa da digitalização aproxima os valores amostrados para níveis discretos?",
  options: [
    "Amostragem",
    "Quantização",
    "Codificação",
    "Compressão sem perdas"
  ],
  answer: 1,
  feedback: "A quantização transforma os valores coletados na amostragem em níveis discretos. Só depois a codificação os escreve em bits."
},

// 3 - Tipos de compressão
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Contextualizada",
  texto: "A digitalização gera muitos dados, e por isso áudio e vídeo são comprimidos para economizar largura de banda, espaço de armazenamento e tempo de transmissão. Na compressão sem perdas (lossless), é possível recuperar exatamente os dados originais. Na compressão com perdas (lossy), informações consideradas menos relevantes são descartadas para reduzir ainda mais o tamanho, e o original não pode ser reconstruído por completo. Formatos como MP3 e o vídeo H.264 usam esse segundo tipo de compressão.",
  question: "Por que a compressão com perdas costuma ser escolhida para streaming de vídeo, mesmo sem recuperar o conteúdo original por completo?",
  options: [
    "Porque ela reduz mais o tamanho dos dados, descartando informações menos relevantes.",
    "Porque ela garante a recuperação exata de cada pixel transmitido.",
    "Porque ela elimina a necessidade de digitalizar o sinal.",
    "Porque ela aumenta o consumo de largura de banda para melhorar a qualidade."
  ],
  answer: 0,
  feedback: "A compressão com perdas troca fidelidade perfeita por arquivos bem menores, o que poupa banda e tempo de transmissão."
},

// 4 - Compressão MPEG
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Explicativa",
  texto: "Um vídeo é uma sequência de quadros (frames) exibidos rapidamente para dar a sensação de movimento. Os padrões MPEG aproveitam dois tipos de redundância. A compressão espacial reduz os dados dentro de cada quadro, explorando a semelhança entre pixels vizinhos. A compressão temporal reduz os dados entre quadros consecutivos, explorando o fato de que um quadro costuma ser muito parecido com o seguinte.",
  question: "Em uma cena em que apenas um personagem se move e o cenário de fundo permanece igual, qual compressão aproveita melhor a semelhança entre quadros seguidos?",
  options: [
    "Compressão espacial, pois trata cada quadro isoladamente.",
    "Compressão por amostragem, pois coleta valores em intervalos regulares.",
    "Compressão temporal, pois reduz os dados repetidos entre quadros consecutivos.",
    "Nenhuma, pois o MPEG só comprime áudio."
  ],
  answer: 2,
  feedback: "A compressão temporal usa as semelhanças entre quadros consecutivos, como um fundo que não muda. A espacial atua dentro de um único quadro."
},

// 5 - Métodos de download
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Contextualizada",
  texto: "No 1º método de download, o navegador baixa o arquivo por HTTP e só começa a reproduzir depois de receber tudo. No 2º método, o servidor Web guarda também um metafile, um pequeno arquivo com informações sobre o conteúdo de áudio ou vídeo, e o media player acessa o servidor para obter os dados. No 3º método, o metafile traz a URL de um media server (servidor de mídia). O media player usa essa URL para pedir o conteúdo diretamente a ele, e o fluxo pode seguir por protocolos baseados em UDP, o que permite começar a reproduzir antes de ter o arquivo inteiro.",
  question: "No método com media server, qual é a função da URL contida no metafile?",
  options: [
    "Compactar o arquivo de áudio e vídeo antes do envio.",
    "Impedir que pacotes sejam perdidos durante a transmissão.",
    "Substituir o navegador na exibição da página Web.",
    "Indicar ao media player onde está o media server do qual o conteúdo deve ser baixado."
  ],
  answer: 3,
  feedback: "O navegador entrega o metafile ao media player, e este usa a URL nele contida para acessar o media server e receber o conteúdo por streaming."
},

// 6 - RTSP
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Aplicação",
  texto: "O RTSP (Real-Time Streaming Protocol) é um protocolo de controle da reprodução. Ele usa um canal separado do fluxo de mídia e oferece comandos como PLAY, para iniciar ou retomar, PAUSE, para pausar, e TEARDOWN, para encerrar a sessão. O áudio e o vídeo em si trafegam por outros protocolos de transporte. Por isso o RTSP não é mais rápido que os demais nem elimina perdas de pacotes.",
  question: "Em uma plataforma de streaming, Ana clica no botão de pausar e depois no de encerrar a sessão. Quais comandos RTSP a aplicação envia, e esses comandos transportam o vídeo?",
  options: [
    "PAUSE e TEARDOWN. O RTSP só controla a sessão, e o vídeo trafega por outros protocolos.",
    "PLAY e PAUSE. O RTSP transporta o vídeo em seu próprio canal de dados.",
    "TEARDOWN e PLAY. O RTSP garante a entrega sem perdas dos pacotes de vídeo.",
    "PAUSE e PLAY. O RTSP acelera a transmissão do vídeo."
  ],
  answer: 0,
  feedback: "PAUSE pausa e TEARDOWN encerra a sessão. O RTSP é só o controle remoto da reprodução, e o vídeo vai por outros protocolos."
},

// 7 - Jitter e buffer
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Aplicação",
  texto: "Em streaming em tempo real, os pacotes saem do servidor com intervalos regulares, mas na rede nem todos sofrem o mesmo atraso. A variação desse atraso de chegada se chama jitter e pode deixar o receptor sem dados para continuar a reprodução. O buffer de reprodução é uma área de memória que guarda temporariamente os dados recebidos. Ele só começa a reproduzir quando há dados suficientes, absorvendo variações curtas de atraso.",
  question: "Três pacotes enviados em 00:00:00, 00:00:10 e 00:00:20 chegam em 00:00:01, 00:00:15 e 00:00:27, e o áudio sai picotado. Qual é o problema e qual mecanismo ajuda a atenuá-lo?",
  options: [
    "Congestionamento no servidor, resolvido pela retransmissão TCP.",
    "Jitter, pois os atrasos variam, atenuado pelo buffer de reprodução.",
    "Perda de pacotes, resolvida pelo RTSP.",
    "Compressão excessiva, resolvida pelo multicast."
  ],
  answer: 1,
  feedback: "Os atrasos de 1 s, 5 s e 7 s são diferentes, o que caracteriza jitter. O buffer guarda dados antes de reproduzir e suaviza essa variação."
},

// 8 - Timestamp e sequência
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Contextualizada",
  texto: "Duas informações ajudam o receptor a organizar um fluxo multimídia. O timestamp (marca temporal) indica a referência de tempo dos dados dentro do fluxo e permite reproduzi-los no ritmo certo. O número de sequência identifica a posição de cada pacote e permite verificar a ordem de chegada e perceber lacunas. O timestamp reconstrói o tempo, mas sozinho não elimina o jitter, e para isso se usa também o buffer.",
  question: "O receptor notou que, entre os pacotes recebidos, faltam os de número 8 e 9 na sequência. Qual informação permitiu perceber a perda, e qual outra informação cuida do ritmo da reprodução?",
  options: [
    "O timestamp percebeu a perda, e o número de sequência cuida do ritmo.",
    "O número de sequência percebeu a perda, e o timestamp cuida do ritmo.",
    "O buffer percebeu a perda, e o multicast cuida do ritmo.",
    "O metafile percebeu a perda, e o RTSP cuida do ritmo."
  ],
  answer: 1,
  feedback: "O número de sequência revela lacunas e a ordem dos pacotes, enquanto o timestamp indica quando cada dado deve ser reproduzido."
},

// 9 - TCP, UDP e RTP
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Explicativa",
  texto: "O TCP entrega os dados em ordem e retransmite segmentos perdidos, o que é ótimo para confiabilidade, mas as retransmissões podem aumentar o atraso. O UDP tem menos sobrecarga e não retransmite automaticamente, e por isso serve para aplicações que priorizam a entrega no momento certo, mesmo perdendo alguns pacotes. O RTP costuma ser usado sobre o UDP e acrescenta informações de tempo, numeração de sequência e identificação do fluxo. O RTCP o complementa monitorando a qualidade da transmissão.",
  question: "Por que o UDP costuma ser preferido ao TCP em uma chamada de voz interativa?",
  options: [
    "Porque o UDP garante a entrega ordenada de todos os pacotes.",
    "Porque o UDP não retransmite pacotes perdidos, evitando atrasos que prejudicariam a conversa em tempo real.",
    "Porque o UDP criptografa a voz automaticamente.",
    "Porque o UDP substitui o RTP e o RTCP."
  ],
  answer: 1,
  feedback: "Na comunicação em tempo real, a baixa latência importa mais que a entrega perfeita. Retransmitir um pacote antigo só atrasaria a conversa."
},

// 10 - VoIP e QoS
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Aplicação",
  texto: "O VoIP transmite a voz digitalizada em pacotes por redes IP, e a qualidade da chamada depende das condições da rede. Os principais fatores são a latência (tempo de chegada dos pacotes), o jitter (variação dessa chegada), a perda de pacotes e o congestionamento. Para reduzir esses problemas usam-se técnicas de QoS, como priorizar os pacotes de voz, gerenciar o congestionamento, dimensionar a largura de banda e monitorar a rede. Elas ajudam, mas não eliminam problemas que ocorrem fora da rede administrada.",
  question: "Em uma empresa, as chamadas VoIP ficam entrecortadas sempre que muitos funcionários baixam arquivos grandes ao mesmo tempo. Qual medida é mais adequada?",
  options: [
    "Aplicar QoS para priorizar os pacotes de voz e dimensionar a largura de banda.",
    "Trocar o VoIP por um serviço de download por servidor Web.",
    "Desativar a criptografia TLS das chamadas.",
    "Usar apenas o protocolo TCP para a voz, sem qualquer priorização."
  ],
  answer: 0,
  feedback: "O congestionamento prejudica a voz, e por isso a solução é priorizar seus pacotes e dimensionar a banda. As demais opções não resolvem o problema, e retirar o TLS ainda piora a segurança."
},


// aula 8

// 1 - Definição de gerenciamento
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Explicativa",
  texto: "Gerenciar uma rede é testar, monitorar, configurar e resolver problemas dos seus componentes para atender aos requisitos definidos por uma organização. Esses requisitos incluem uma operação regular e eficiente e a qualidade de serviço prometida aos usuários. Para isso, um sistema de gerenciamento usa hardware, software e pessoas. O objetivo principal é que a rede funcione de forma eficiente, segura e confiável, suportando o tráfego de dados e as necessidades de usuários e sistemas.",
  question: "Qual alternativa descreve melhor o objetivo principal do gerenciamento de redes?",
  options: [
    "Eliminar todo o tráfego de dados que não for de uso interno.",
    "Garantir que a rede opere de forma eficiente, segura e confiável, atendendo usuários e sistemas.",
    "Substituir os administradores por software de monitoramento.",
    "Aumentar o número de equipamentos independentemente da demanda."
  ],
  answer: 1,
  feedback: "O gerenciamento combina hardware, software e pessoas para manter a rede eficiente, segura e confiável conforme os requisitos da organização."
},

// 2 - Gerenciamento de configuração
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Explicativa",
  texto: "A ISO define cinco áreas de gerenciamento: configuração, falhas, desempenho, segurança e contabilização. O gerenciamento de configuração cuida do estado de cada entidade e do seu relacionamento com as demais. Ele envolve a configuração inicial, as reconfigurações de hardware, de software e de contas de usuário e a documentação. A configuração original e cada alteração posterior devem ser registradas com cuidado, em mapas e especificações dos equipamentos, nas versões e licenças dos programas e nas contas de usuário.",
  question: "Anotar o número de série, o fornecedor, a data de compra e a garantia de cada roteador é uma atividade de qual área e de qual tipo de registro?",
  options: [
    "Gerenciamento de segurança, registrando a confidencialidade.",
    "Gerenciamento de contabilização, registrando tarifas de uso.",
    "Gerenciamento de desempenho, registrando a vazão.",
    "Gerenciamento de configuração, na documentação de hardware."
  ],
  answer: 3,
  feedback: "Registrar especificações dos equipamentos, como número de série, fornecedor, compra e garantia, faz parte da documentação de hardware do gerenciamento de configuração."
},

// 3 - Falhas reativo e proativo
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Contextualizada",
  texto: "O gerenciamento de falhas lida com interrupções no sistema e pode ser reativo ou proativo. O reativo detecta, isola, corrige e registra a falha, mas só age depois que ela acontece. O proativo busca prever e prevenir a falha antes que afete o desempenho ou cause interrupção, identificando sinais antecipados de problemas potenciais para corrigir a causa antes que ela se torne crítica.",
  question: "Um administrador percebe que um disco de servidor apresenta erros crescentes e o substitui antes que ele pare. Que tipo de gerenciamento de falhas isso representa e por quê?",
  options: [
    "Reativo, pois a falha já havia causado a interrupção do serviço.",
    "Proativo, pois agiu sobre sinais antecipados antes que a falha causasse interrupção.",
    "Gerenciamento de contabilização, pois envolve custos de hardware.",
    "Gerenciamento de segurança, pois envolve controle de acesso."
  ],
  answer: 1,
  feedback: "Agir sobre sinais antecipados, antes da interrupção, é gerenciamento proativo. O reativo só trata a falha depois que ela ocorre."
},

// 4 - Gerenciamento de desempenho
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Aplicação",
  texto: "O gerenciamento de desempenho monitora e controla a rede para que funcione do modo mais eficiente possível, quantificando o desempenho por quatro aspectos. A capacidade é a quantidade máxima de dados que a rede transmite eficientemente em um período. O tráfego é a transferência de pacotes, interna ou externa. A vazão é a taxa efetiva de transferência de dados. O tempo de resposta é o tempo entre o usuário requisitar um serviço e o serviço ser concedido.",
  question: "Um usuário clica em um relatório do sistema interno e só recebe a página 8 segundos depois. Qual métrica de desempenho esse atraso mede?",
  options: [
    "Capacidade da rede.",
    "Vazão efetiva.",
    "Tempo de resposta.",
    "Tráfego externo."
  ],
  answer: 2,
  feedback: "O tempo entre a requisição do usuário e a concessão do serviço é o tempo de resposta. A vazão mede a taxa efetiva de dados, e a capacidade, o máximo possível."
},

// 5 - Pilares de segurança
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Explicativa",
  texto: "O gerenciamento de segurança controla o acesso à rede segundo uma política predefinida e se apoia em seis pilares. A confidencialidade garante que só pessoas autorizadas acessem a informação. A integridade impede alterações não autorizadas ou acidentais. A disponibilidade garante o acesso quando necessário. A autenticidade assegura que as partes e as informações sejam legítimas. A conformidade é o cumprimento da política de segurança e dos padrões do setor. O não-repúdio, ou irretratabilidade, garante que uma ação não possa ser negada depois.",
  question: "Qual pilar impede que um usuário que realizou uma transação negue depois tê-la feito?",
  options: [
    "Não-repúdio (irretratabilidade).",
    "Disponibilidade.",
    "Confidencialidade.",
    "Conformidade."
  ],
  answer: 0,
  feedback: "O não-repúdio garante que uma ação não possa ser negada posteriormente. A confidencialidade, por sua vez, trata de quem pode ver a informação."
},

// 6 - Contabilização
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Aplicação",
  texto: "O gerenciamento de contabilização controla o acesso dos usuários aos recursos de rede por meio de tarifas. Ele impede que usuários monopolizem os recursos limitados e que usem o sistema de forma ineficiente. Além disso, fornece dados de demanda de uso que permitem aos gerentes planejar a rede no curto e no longo prazo.",
  question: "Um departamento de uma empresa passa o dia fazendo downloads enormes e deixa a rede lenta para os demais. Que área de gerenciamento ajuda a controlar esse uso por meio de tarifas e do registro da demanda?",
  options: [
    "Gerenciamento de falhas.",
    "Gerenciamento de contabilização.",
    "Gerenciamento de configuração.",
    "Gerenciamento de segurança."
  ],
  answer: 1,
  feedback: "A contabilização controla o acesso aos recursos por tarifas, evita monopólio e gera dados de demanda para o planejamento."
},

// 7 - Gerente e agente SNMP
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Contextualizada",
  texto: "O SNMP (Simple Network Management Protocol) é uma estrutura de gerenciamento de dispositivos que usa a camada de aplicação do TCP/IP. Ele funciona com os papéis de gerente e agente. O gerente é um host que executa o programa-servidor SNMP, e o agente é uma estação gerenciada, como um roteador, que executa o programa-cliente. O gerente inspeciona o agente pedindo informações, pode forçá-lo a executar uma tarefa reinicializando valores em sua base de dados, e o agente pode alertar o gerente sobre situações incomuns.",
  question: "Um roteador percebe uma situação incomum e avisa a estação de gerenciamento por conta própria. Quem tomou a iniciativa e qual papel ele exerce?",
  options: [
    "O gerente, que executa o programa-servidor SNMP.",
    "A MIB, que executa o programa-cliente SNMP.",
    "O agente, que contribui com o gerenciamento por meio de alertas ao gerente.",
    "A SMI, que codifica o alerta em hexadecimal."
  ],
  answer: 2,
  feedback: "O agente (o roteador) é a estação gerenciada e pode alertar o gerente sobre situações incomuns, enquanto o gerente faz as consultas e as ordens."
},

// 8 - PDUs do SNMP
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Aplicação",
  texto: "O SNMPv3 define oito tipos de PDU. GetRequest pede o valor de variáveis específicas. GetNextRequest pede o próximo valor na MIB, o que permite percorrê-la item por item. GetBulkRequest recupera muitos dados de uma vez, e SetRequest modifica valores no dispositivo. Response responde a uma solicitação. Trap notifica o gerente de eventos importantes de forma assíncrona. InformRequest é uma notificação com confirmação entre gerentes. Report relata erros internos do protocolo.",
  question: "Uma porta de um switch cai, e o switch precisa avisar o gerente imediatamente, sem esperar ser consultado. Qual PDU ele usa?",
  options: [
    "GetNextRequest",
    "SetRequest",
    "GetBulkRequest",
    "Trap"
  ],
  answer: 3,
  feedback: "O Trap é a notificação assíncrona de eventos importantes enviada pelo agente. As operações Get e Set partem do gerente."
},

// 9 - SNMP, SMI e MIB
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Contextualizada",
  texto: "O gerenciamento usa três componentes que cooperam. O SNMP define o formato dos pacotes trocados entre gerente e agente. A SMI define as regras para nomear objetos, os tipos de dados e a codificação. A MIB é a coleção de objetos nomeados, seus tipos e relacionamentos, e fica no agente. No exemplo em que o gerente quer saber quantos datagramas UDP o agente recebeu, a MIB encontra o objeto correspondente, a SMI codifica o nome do objeto e o SNMP cria e encapsula a mensagem GetRequest.",
  question: "No exemplo do número de datagramas UDP recebidos, qual componente é responsável por criar a mensagem GetRequest e encapsular o nome codificado?",
  options: [
    "A SMI, pois define os tipos de dados.",
    "A MIB, pois guarda os objetos no agente.",
    "O SNMP, pois define o formato das mensagens trocadas entre gerente e agente.",
    "O BER, pois nomeia os objetos globalmente."
  ],
  answer: 2,
  feedback: "A MIB acha o objeto e a SMI codifica seu nome, mas é o SNMP que monta a mensagem GetRequest e a encapsula."
},

// 10 - OID e codificação BER
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Explicativa",
  texto: "Para nomear objetos globalmente, a SMI usa identificadores de objeto (OID) em uma árvore que começa em uma raiz sem nome. O caminho iso.org.dod.internet.mgmt.mib-2 corresponde a 1.3.6.1.2.1, e o SNMP usa a forma com números. Na codificação BER, cada dado é uma tripla: rótulo (1 byte, que define o tipo), comprimento e valor. O rótulo 02, por exemplo, indica INTEGER. A sequência 0x02, 0x04, 0x00, 0x00, 0x00, 0x0E representa um INTEGER de 4 bytes cujo valor é 14, pois 0x0E em hexadecimal é 14.",
  question: "Na sequência 0x02 0x04 0x00 0x00 0x00 0x0E, o que representam os dois primeiros bytes?",
  options: [
    "Valor 2 e valor 4 do inteiro.",
    "Endereço IP e máscara de rede do agente.",
    "Rótulo INTEGER e comprimento de 4 bytes do campo valor.",
    "Os grupos sys e if da mib-2."
  ],
  answer: 2,
  feedback: "No BER, o primeiro byte é o rótulo (02 = INTEGER) e o segundo é o comprimento (4 bytes). O restante é o valor, no caso 14."
},

  ],

  fixacao: [

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
},

// ===== AULA 7 =====
// 1 - Conceito de streaming
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Direta",
  texto: "Os serviços multimídia da Internet dependem de uma técnica que evita esperar o arquivo inteiro.",
  question: "O que caracteriza o streaming de áudio e vídeo?",
  options: [
    "Baixar o arquivo completo antes de iniciar a reprodução.",
    "Reproduzir o conteúdo enquanto os dados ainda estão sendo recebidos.",
    "Converter um sinal analógico em sinal digital.",
    "Transmitir apenas conteúdo produzido ao vivo."
  ],
  answer: 1,
  feedback: "No streaming a reprodução começa antes de o arquivo chegar por completo. Isso vale para conteúdo armazenado e para conteúdo ao vivo."
},
// 2 - Quantização
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Direta",
  texto: "A digitalização de áudio e vídeo tem três etapas: amostragem, quantização e codificação.",
  question: "Qual etapa aproxima os valores amostrados para níveis discretos?",
  options: [
    "Amostragem.",
    "Codificação.",
    "Quantização.",
    "Compressão."
  ],
  answer: 2,
  feedback: "A amostragem coleta valores em intervalos regulares, a quantização os aproxima para níveis discretos e a codificação os transforma em bits."
},
// 3 - TEARDOWN
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Direta",
  texto: "O RTSP é um protocolo de controle da reprodução, com comandos como PLAY e PAUSE.",
  question: "Qual comando do RTSP encerra a sessão de streaming?",
  options: [
    "SETUP.",
    "PLAY.",
    "PAUSE.",
    "TEARDOWN."
  ],
  answer: 3,
  feedback: "SETUP estabelece a conexão, PLAY inicia ou retoma, PAUSE pausa e TEARDOWN encerra a sessão."
},
// 4 - Jitter
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Direta",
  texto: "Em transmissões em tempo real, os pacotes podem não chegar com o mesmo atraso.",
  question: "O que é o jitter?",
  options: [
    "A variação do atraso de chegada dos pacotes.",
    "A perda total de pacotes na rede.",
    "A taxa máxima de transmissão do enlace.",
    "O tempo de resposta de um servidor Web."
  ],
  answer: 0,
  feedback: "Com jitter, os intervalos originais entre os pacotes se alteram, e o receptor pode ficar sem dados para continuar a reprodução."
},
// 5 - Método 1
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Contexto",
  texto: "Em um site, o navegador baixa um vídeo grande por HTTP com uma requisição GET e só abre o player de mídia quando o download termina.",
  question: "Qual é a principal desvantagem desse método?",
  options: [
    "O vídeo não pode ser comprimido.",
    "O usuário precisa esperar o fim do download para começar a assistir.",
    "O servidor precisa usar obrigatoriamente o UDP.",
    "O player não consegue pausar o vídeo."
  ],
  answer: 1,
  feedback: "No 1º método (servidor Web), o arquivo é baixado por completo antes da reprodução, o que não é streaming contínuo."
},
// 6 - Buffer
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Contexto",
  texto: "Uma plataforma configura o player para começar a reproduzir sete segundos após o início do recebimento dos pacotes.",
  question: "Qual é a finalidade desse intervalo?",
  options: [
    "Aumentar a taxa de bits do vídeo.",
    "Criptografar os pacotes recebidos.",
    "Absorver variações curtas no atraso dos pacotes.",
    "Eliminar a necessidade de numerar os pacotes."
  ],
  answer: 2,
  feedback: "O buffer de reprodução armazena dados antes de tocá-los, o que compensa o jitter e deixa a reprodução mais constante."
},
// 7 - UDP
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Contexto",
  texto: "Em uma videoconferência, o mais importante é que os dados cheguem no momento certo, mesmo que alguns pacotes se percam.",
  question: "Qual protocolo de transporte é mais adequado a essa prioridade?",
  options: [
    "UDP, por ter menor sobrecarga e não retransmitir pacotes.",
    "TCP, porque retransmite sempre os segmentos perdidos.",
    "RTSP, porque entrega o áudio e o vídeo.",
    "HTTP, porque usa requisições GET."
  ],
  answer: 0,
  feedback: "As retransmissões do TCP aumentam o atraso. O RTSP controla a sessão e não transporta o conteúdo."
},
// 8 - Transcodificação
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Aplicação",
  texto: "Um servidor recebe um vídeo codificado para 5 Mbps, mas o destinatário tem uma conexão que suporta menos de 1 Mbps.",
  question: "Que recurso o servidor deve usar para gerar uma versão de menor taxa de bits?",
  options: [
    "Mixagem.",
    "Multicasting.",
    "Numeração de sequência.",
    "Tradução ou transcodificação."
  ],
  answer: 3,
  feedback: "A transcodificação adapta o fluxo às condições do receptor, alterando resolução, taxa de bits ou codec."
},
// 9 - RTCP
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Aplicação",
  texto: "Um administrador quer acompanhar a qualidade da rede durante uma videoconferência, como o desempenho da recepção dos pacotes RTP.",
  question: "Qual mensagem do RTCP informa sobre a qualidade da recepção?",
  options: [
    "Sender Report (SR).",
    "Receiver Report (RR).",
    "Source Description (SDES).",
    "BYE."
  ],
  answer: 1,
  feedback: "O RR informa sobre a qualidade da recepção. O SR traz estatísticas de envio, o SDES descreve a fonte e o BYE indica a saída da sessão."
},
// 10 - Servidor VoIP local
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Aplicação",
  texto: "Uma escola quer que seus ramais continuem se falando mesmo se a Internet cair, desde que a rede local funcione.",
  question: "Que solução atende a essa necessidade?",
  options: [
    "Um servidor Web com metafile.",
    "Streaming de conteúdo armazenado.",
    "Um servidor VoIP local, como o Asterisk.",
    "Transmissão ao vivo por multicast IP."
  ],
  answer: 2,
  feedback: "Um servidor VoIP local, como Asterisk ou FreePBX, conecta ramais pela LAN sem depender da operadora ou da Internet."
},
// ===== AULA 8 =====
// 1 - Áreas da ISO
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Direta",
  texto: "A ISO define cinco áreas de gerenciamento de redes.",
  question: "Qual alternativa NÃO é uma das áreas definidas pela ISO?",
  options: [
    "Gerenciamento de configuração.",
    "Gerenciamento de falhas.",
    "Gerenciamento de segurança.",
    "Gerenciamento de roteamento."
  ],
  answer: 3,
  feedback: "As áreas são configuração, falhas, desempenho, segurança e contabilização."
},
// 2 - GetRequest
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Direta",
  texto: "O SNMPv3 define oito tipos de PDUs, cada um com uma operação.",
  question: "Qual PDU solicita ao agente o valor de variáveis específicas?",
  options: [
    "GetRequest.",
    "SetRequest.",
    "Trap.",
    "Report."
  ],
  answer: 0,
  feedback: "O SetRequest modifica valores, o Trap é uma notificação assíncrona do agente e o Report relata erros internos do SNMPv3."
},
// 3 - SMI
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Direta",
  texto: "O gerenciamento SNMP se apoia em três componentes: SNMP, SMI e MIB.",
  question: "Qual componente define as regras para nomear objetos, definir seus tipos e codificar valores?",
  options: [
    "MIB.",
    "SMI.",
    "BER.",
    "OID."
  ],
  answer: 1,
  feedback: "A SMI define nome, tipo de dados e método de codificação. A MIB é a coleção dos objetos gerenciáveis."
},
// 4 - MIB
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Direta",
  texto: "Cada agente mantém uma base com os objetos que o gerente pode consultar.",
  question: "O que é a MIB?",
  options: [
    "Um protocolo de transporte usado pelo SNMP.",
    "Uma regra de codificação de dados em TLV.",
    "Uma coleção de objetos do agente, consultada pelo gerente.",
    "Uma ferramenta de monitoramento de redes."
  ],
  answer: 2,
  feedback: "A MIB cria uma coleção de objetos nomeados, seus tipos e as relações entre eles na entidade gerenciada."
},
// 5 - Falhas proativo
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Contexto",
  texto: "Uma equipe monitora sinais antecipados de problemas nos equipamentos e age antes que eles causem interrupção na rede.",
  question: "Que abordagem de gerenciamento de falhas isso representa?",
  options: [
    "Reativa.",
    "De contabilização.",
    "De configuração.",
    "Proativa."
  ],
  answer: 3,
  feedback: "O gerenciamento proativo previne falhas, enquanto o reativo espera a falha ocorrer para detectar, isolar, corrigir e registrar."
},
// 6 - Integridade
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Contexto",
  texto: "Após um incidente, a empresa descobriu que registros importantes foram alterados sem autorização.",
  question: "Qual pilar da segurança da informação foi comprometido?",
  options: [
    "Integridade.",
    "Disponibilidade.",
    "Confidencialidade.",
    "Não-repúdio."
  ],
  answer: 0,
  feedback: "A integridade garante que os dados não sejam modificados de forma não autorizada ou acidental."
},
// 7 - GetNextRequest
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Contexto",
  texto: "Um gerente quer percorrer os dados da MIB de um agente item por item, sem conhecer todos os identificadores.",
  question: "Qual PDU permite essa navegação?",
  options: [
    "InformRequest.",
    "Response.",
    "GetNextRequest.",
    "SetRequest."
  ],
  answer: 2,
  feedback: "O GetNextRequest solicita o próximo valor na MIB, o que permite percorrê-la sequencialmente."
},
// 8 - Trap
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Aplicação",
  texto: "Um switch precisa avisar o gerente, sem esperar ser consultado, que uma de suas portas caiu.",
  question: "Que PDU o agente deve usar?",
  options: [
    "GetBulkRequest.",
    "Trap.",
    "GetRequest.",
    "InformRequest."
  ],
  answer: 1,
  feedback: "O Trap notifica o gerente de eventos importantes de forma assíncrona. O InformRequest é a notificação com confirmação entre gerentes."
},
// 9 - OID
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Aplicação",
  texto: "Na árvore de identificadores, iso vale 1, org vale 3, dod vale 6, internet vale 1, mgmt vale 2 e mib-2 vale 1.",
  question: "Qual notação numérica representa iso.org.dod.internet.mgmt.mib-2?",
  options: [
    "1.3.6.1.2.1",
    "1.3.6.2.1.1",
    "3.1.6.1.2.1",
    "1.6.3.1.2.1"
  ],
  answer: 0,
  feedback: "Cada nível da árvore vira um inteiro separado por pontos: 1.3.6.1.2.1. O SNMP usa a forma numérica, e as pessoas usam os nomes."
},
// 10 - BER
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Aplicação",
  texto: "Um dado foi codificado em BER com os bytes 0x02, 0x04, 0x00, 0x00, 0x00, 0x0E (rótulo, comprimento e valor).",
  question: "O que esses bytes representam?",
  options: [
    "Uma OCTET STRING de 2 bytes.",
    "Um IPAddress de valor 14.",
    "Um Counter32 de valor 4.",
    "Um INTEGER de valor 14."
  ],
  answer: 3,
  feedback: "0x02 é o rótulo de INTEGER, 0x04 indica 4 bytes de valor e 0x0E é 14 em decimal."
},
  ],

enade: [
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

// ===== AULA 7 =====
// 1 - Streaming armazenado
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Asserção + Justificativa",
  texto: "Uma plataforma de cursos online mantém aulas gravadas em um servidor. Ao clicar em uma aula, o aluno percebe que o vídeo começa a tocar poucos segundos depois, mesmo sem que o arquivo inteiro tenha sido baixado.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "No ==def==streaming== de conteúdo armazenado, o usuário pode iniciar a reprodução antes de o arquivo completo ser baixado.",
    "PORQUE o conteúdo continua sendo recebido pela rede enquanto a parte já recebida é reproduzida."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "As duas asserções são verdadeiras e a II explica a I: o **streaming** reproduz os dados enquanto eles ainda chegam, sem exigir o download completo. É diferente do 1º método (servidor Web), em que a reprodução só começa após o ==warn==término do download==."
},
// 2 - Métodos de distribuição
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma empresa de treinamento compara quatro formas de entregar vídeos aos alunos: baixar o arquivo por um servidor Web, usar um servidor Web com metafile, usar um Media Server e usar um Media Server com RTSP.",
  question: "Avalie as afirmações a seguir sobre esses métodos e assinale a alternativa correta.",
  assertions: [
    "No 1º método, o arquivo é obtido por HTTP com uma requisição GET, e a reprodução só começa depois do download completo.",
    "No uso de servidor Web com metafile, o player recebe o ==term==metafile== e, a partir dele, requisita o arquivo de áudio e vídeo ao servidor Web.",
    "No uso de Media Server com RTSP, o próprio RTSP transporta o áudio e o vídeo, o que elimina as perdas de pacotes.",
    "No 4º método, o player envia SETUP para estabelecer a conexão, PLAY para iniciar a reprodução e TEARDOWN para encerrá-la."
  ],
  options: [
    "I, II e III, apenas",
    "I, II e IV, apenas",
    "II, III e IV, apenas",
    "I, III e IV, apenas"
  ],
  answer: 1,
  feedback: "A afirmativa III é falsa: o **RTSP** controla a sessão de reprodução (canal de controle separado), e o transporte do áudio e do vídeo fica a cargo de outros protocolos. O RTSP, por si só, não elimina perdas de pacotes."
},
// 3 - UDP em videoconferência
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Asserção + Justificativa",
  texto: "Em uma videoconferência entre filiais, o gestor de TI precisa decidir qual protocolo de transporte priorizar para o áudio e o vídeo, sabendo que a entrega no momento certo importa mais do que a entrega perfeita de todos os dados.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "Em aplicações interativas, o ==term==UDP== costuma ser preferido ao TCP para o transporte de áudio e vídeo.",
    "PORQUE o UDP retransmite automaticamente os segmentos perdidos, garantindo a entrega ordenada dos dados."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 2,
  feedback: "A asserção I é verdadeira: o UDP tem menor sobrecarga e não retransmite, o que favorece a baixa latência. A II é falsa, pois retransmitir segmentos perdidos e garantir a entrega ordenada são características do **TCP**, e essas retransmissões podem aumentar o atraso."
},
// 4 - Buffer e jitter
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Conceitual Contextualizada",
  texto: "Um serviço de aulas ao vivo percebe que, embora os pacotes de vídeo saiam do servidor em intervalos regulares, eles chegam aos alunos em intervalos irregulares, e a reprodução trava com frequência.",
  question: "Qual medida no receptor atende melhor a esse problema?",
  options: [
    "Aumentar a numeração de sequência dos pacotes para que todos cheguem no mesmo instante ao receptor.",
    "Guardar os pacotes em um buffer de reprodução e iniciar a exibição só após acumular dados suficientes.",
    "Trocar o timestamp por mensagens BYE do RTCP, para que as sessões mais lentas sejam encerradas logo.",
    "Enviar os pacotes pelo canal de controle do RTSP, para que sejam retransmitidos quando houver atraso."
  ],
  answer: 1,
  feedback: "O problema descrito é o ==def==jitter==, a variação do atraso de chegada dos pacotes. O **buffer de reprodução** compensa essa variação ao permitir que o conteúdo seja tocado em ritmo mais constante. O timestamp ajuda a reconstruir o tempo do fluxo, mas não elimina o jitter sozinho."
},
// 5 - Timestamp e atraso
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Análise Aplicada",
  texto: "Um servidor envia três pacotes de vídeo, com timestamps 0, 10 e 20 segundos, nos instantes 00:00:00, 00:00:10 e 00:00:20. Eles chegam ao cliente em 00:00:01, 00:00:15 e 00:00:27. O player foi configurado para iniciar a reprodução em 00:00:08 e tocar cada pacote no instante 08 mais o seu timestamp.",
  question: "Com base nesses dados, assinale a alternativa correta.",
  options: [
    "O segundo pacote chega depois do seu instante de reprodução e causa uma pausa.",
    "Os atrasos de 1, 5 e 7 segundos indicam que não há jitter, pois todos os pacotes chegaram.",
    "Todos os pacotes chegam antes do seu instante de reprodução, apesar do jitter, graças ao início em 00:00:08.",
    "O terceiro pacote chega depois de 00:00:28, o que exigiria um buffer maior."
  ],
  answer: 2,
  feedback: "Os instantes de reprodução são 00:00:08, 00:00:18 e 00:00:28, e as chegadas (1, 15 e 27) ocorrem antes de cada um. Os atrasos são 1, 5 e 7 segundos, ou seja, há ==def==jitter==, mas o **buffer** de 8 segundos o absorveu, ainda que com margem de apenas 1 segundo no último pacote."
},
// 6 - RTP e RTCP
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma equipe de redes analisa o tráfego de uma videoconferência que usa RTP e RTCP sobre UDP.",
  question: "Avalie as afirmações a seguir e assinale a alternativa correta.",
  assertions: [
    "O RTP acrescenta aos dados multimídia informações temporais, numeração de sequência e identificação do fluxo.",
    "O RTCP é complementar ao RTP e monitora a qualidade da transmissão, e o ==term==Receiver Report== informa o desempenho da recepção.",
    "A numeração de sequência permite ao receptor ordenar os pacotes e identificar lacunas, enquanto o timestamp indica a referência temporal dos dados.",
    "A mensagem BYE do RTCP descreve a fonte, informando seu nome e seus dados de contato."
  ],
  options: [
    "I, II e III, apenas",
    "I, II e IV, apenas",
    "II, III e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 0,
  feedback: "A IV é falsa: quem descreve a fonte, com nome e contato, é a mensagem **SDES**. A BYE apenas informa que uma fonte está deixando a sessão. Em ==proc==ordenar e detectar perdas== usa-se o número de sequência, e em reconstruir o tempo, o timestamp."
},
// 7 - Sequência x timestamp
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Asserção + Justificativa",
  texto: "Um engenheiro de uma emissora de TV pela Internet discute se a numeração de sequência dos pacotes é suficiente para controlar a reprodução do vídeo ao vivo no receptor.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "A ==term==numeração de sequência== dispensa o uso de timestamp, pois informa sozinha quando cada dado deve ser reproduzido.",
    "PORQUE o número de sequência auxilia na ordenação dos pacotes e na identificação de perdas."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 3,
  feedback: "A asserção I é falsa: quem informa a referência temporal é o **timestamp**, e o número de sequência não diz quando reproduzir. A II é verdadeira, mas descreve outra função da numeração: ordenar pacotes e perceber lacunas."
},
// 8 - Congestionamento VoIP
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Conceitual Contextualizada",
  texto: "Uma clínica adotou chamadas de voz por IP entre suas unidades. Os funcionários relatam cortes na voz nos horários de maior movimento, quando muitos dispositivos usam a mesma conexão.",
  question: "Qual fator de QoS descreve melhor a causa mais provável do problema?",
  options: [
    "Falsificação de identidade (spoofing) nas chamadas.",
    "Congestionamento da rede, que reduz a banda para as chamadas.",
    "Digitalização incorreta do sinal analógico de voz.",
    "Uso de compressão sem perdas nos pacotes de voz."
  ],
  answer: 1,
  feedback: "Quando muitos dispositivos disputam os mesmos recursos, a banda disponível cai e surgem atraso, jitter e perda de pacotes. Esse é o ==def==congestionamento== da rede, e técnicas de **QoS**, como a priorização dos pacotes de voz, ajudam a reduzi-lo."
},
// 9 - Segurança VoIP
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma empresa quer ampliar o uso de VoIP e pede à equipe de segurança uma avaliação das ameaças ao serviço.",
  question: "Avalie as afirmações a seguir e assinale a alternativa correta.",
  assertions: [
    "Se o tráfego de voz não estiver protegido por criptografia, um invasor que o capture pode ter acesso ao conteúdo das conversas.",
    "Senhas fracas ou comprometidas podem permitir que terceiros se autentiquem como usuários legítimos e usem o serviço.",
    "Em um servidor VoIP local, o risco de ataques deixa de existir, pois nenhuma ameaça atua dentro da rede local.",
    "O uso de ==proc==TLS==, de autenticação forte e de monitoramento de atividades suspeitas ajuda a reduzir os riscos."
  ],
  options: [
    "I e II, apenas",
    "I, II e III, apenas",
    "I, II e IV, apenas",
    "II, III e IV, apenas"
  ],
  answer: 2,
  feedback: "A afirmativa III é falsa: mesmo em redes locais é preciso configurar corretamente equipamentos e servidores e adotar **medidas de proteção**. As demais descrevem ameaças reais, como interceptação e roubo de credenciais, e os mecanismos para reduzi-las."
},
// 10 - Multicast
{
  aula: "Aula 7 - Serviços Multimídia em Redes de Computadores",
  tipo: "Análise Aplicada",
  texto: "Uma universidade vai transmitir uma palestra ao vivo para vários laboratórios conectados à mesma infraestrutura de rede e quer evitar o envio de uma cópia individual do fluxo, por todo o caminho, para cada laboratório.",
  question: "Qual alternativa descreve corretamente a solução adequada e sua limitação?",
  options: [
    "Unicast, porque envia o fluxo de um emissor a um grupo de receptores sem depender da infraestrutura.",
    "Transcodificação, porque replica o fluxo nos pontos em que os caminhos dos receptores se dividem.",
    "Mixagem, porque entrega o mesmo fluxo ao grupo sem nenhuma configuração adicional na rede.",
    "Multicast, porque replica os pacotes onde os caminhos se dividem, mas depende do suporte da infraestrutura."
  ],
  answer: 3,
  feedback: "No ==def==multicast==, um fluxo é enviado a um grupo de receptores interessados e replicado nas divisões do caminho. A **limitação** é depender do suporte e da configuração na rede, e por isso muitas plataformas comerciais usam várias transmissões unicast."
},
// ===== AULA 8 =====
// 1 - Falhas proativo
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Asserção + Justificativa",
  texto: "O setor de TI de um provedor regional percebe que os roteadores de um bairro apresentam aumento gradual de erros e de temperatura nas semanas que antecedem cada queda de serviço. A equipe decide agir antes da próxima interrupção.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "Nessa situação, o ==def==gerenciamento de falhas proativo== é a abordagem mais adequada.",
    "PORQUE ele busca identificar sinais antecipados de falhas potenciais para agir antes que o problema se torne crítico."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 0,
  feedback: "As duas são verdadeiras e a II justifica a I. O **gerenciamento proativo** previne falhas, enquanto o ==warn==reativo== só detecta, isola, corrige e registra depois que a falha ocorre."
},
// 2 - Áreas ISO
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Múltiplas Afirmativas",
  texto: "Um gerente de redes de uma universidade organiza as atividades do seu setor segundo as cinco áreas de gerenciamento definidas pela ISO.",
  question: "Avalie as afirmações a seguir sobre essas áreas e assinale a alternativa correta.",
  assertions: [
    "O gerenciamento de ==def==configuração== envolve a configuração inicial, a reconfiguração e a documentação de hardware, software e contas de usuário.",
    "O gerenciamento de desempenho quantifica a rede por aspectos como capacidade, tráfego, vazão e tempo de resposta.",
    "O gerenciamento de segurança controla o acesso à rede com base em uma política predefinida.",
    "O gerenciamento de contabilização controla o acesso dos usuários aos recursos por meio de tarifas, evitando que monopolizem recursos limitados."
  ],
  options: [
    "I, II e III, apenas",
    "I e III, apenas",
    "II e IV, apenas",
    "I, II, III e IV"
  ],
  answer: 3,
  feedback: "Todas as afirmativas descrevem corretamente as áreas da ISO. A **contabilização** também permite planejamento de curto e longo prazo com base na demanda, e a ==term==documentação== deve registrar cada alteração feita."
},
// 3 - Vazão e tempo de resposta
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Asserção + Justificativa",
  texto: "Um analista compara dois enlaces de mesma capacidade nominal e percebe que um deles transfere dados efetivamente a uma taxa menor, além de demorar mais para atender às requisições dos usuários.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "A ==def==vazão== refere-se à taxa efetiva de transferência de dados em uma rede.",
    "PORQUE o tempo de resposta corresponde ao tempo entre o momento em que o usuário requisita um serviço e o momento em que ele é concedido."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 1,
  feedback: "Ambas estão corretas, mas a II não explica a I: são **métricas distintas** do gerenciamento de desempenho. A vazão mede a taxa efetiva de transferência, e o tempo de resposta mede o intervalo até a concessão do serviço."
},
// 4 - Não-repúdio
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Conceitual Contextualizada",
  texto: "Um banco precisa garantir que, depois de uma transferência eletrônica, o cliente não possa negar que realizou a operação.",
  question: "Qual pilar da segurança da informação atende diretamente a essa necessidade?",
  options: [
    "Confidencialidade, pois só pessoas autorizadas acessam a informação.",
    "Autenticidade, pois confirma que as partes envolvidas são legítimas.",
    "Não-repúdio, pois impede que uma ação seja negada posteriormente.",
    "Disponibilidade, pois permite acessar a informação quando necessário."
  ],
  answer: 2,
  feedback: "O **não-repúdio** (irretratabilidade) garante que uma ação não possa ser negada depois. A ==term==autenticidade== confirma a legitimidade das partes, mas, por si só, não impede a negação posterior."
},
// 5 - Papéis de SNMP, SMI e MIB
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Análise Aplicada",
  texto: "Um gerente SNMP precisa saber quantos datagramas de usuário UDP um agente recebeu. O objeto que guarda essa informação se chama udpInDatagrama e tem o identificador 1.3.6.1.2.1.7.1.0. O agente respondeu que recebeu seis datagramas.",
  question: "Considerando os papéis de SNMP, SMI e MIB nessa consulta, assinale a alternativa correta.",
  options: [
    "A MIB localiza o objeto, a SMI codifica o seu nome e o SNMP cria a mensagem GetRequest.",
    "A SMI localiza o objeto, a MIB codifica o seu nome e o SNMP envia a resposta ao gerente.",
    "O SNMP define o nome do objeto, a MIB cria o GetRequest e a SMI localiza o valor.",
    "O agente envia um SetRequest ao gerente, e a MIB codifica o valor seis."
  ],
  answer: 0,
  feedback: "A **MIB** contém os objetos e permite encontrar o que guarda o número de datagramas UDP. A ==def==SMI== define regras de nomeação e codificação, e o SNMP monta e encapsula a mensagem GetRequest."
},
// 6 - PDUs do SNMPv3
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Múltiplas Afirmativas",
  texto: "Uma equipe configura uma ferramenta de monitoramento baseada em SNMPv3 para uma rede com vários gerentes regionais.",
  question: "Avalie as afirmações a seguir sobre as PDUs e assinale a alternativa correta.",
  assertions: [
    "O Trap é uma PDU enviada pelo gerente ao agente para solicitar o valor de variáveis.",
    "O ==term==InformRequest== é uma notificação com confirmação trocada entre gerentes.",
    "O SetRequest permite modificar o valor de variáveis em um dispositivo, como o IP de uma interface.",
    "O Report relata erros ou problemas internos do protocolo SNMPv3."
  ],
  options: [
    "I, II e III, apenas",
    "I e IV, apenas",
    "I, III e IV, apenas",
    "II, III e IV, apenas"
  ],
  answer: 3,
  feedback: "A afirmativa I é falsa: o **Trap** parte do agente e notifica o gerente, de forma assíncrona, sobre eventos importantes. Quem solicita valores é o GetRequest, e o GetNextRequest percorre a ==def==MIB== item por item."
},
// 7 - Identificador de objeto
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Asserção + Justificativa",
  texto: "Ao estudar como o SNMP nomeia as variáveis dos dispositivos, uma aluna observa que cada objeto gerenciado possui um identificador único, organizado em uma árvore que começa em uma raiz sem nome.",
  question: "Analise as asserções a seguir e a relação proposta entre elas.",
  assertions: [
    "Para nomear objetos globalmente, a SMI usa um ==term==identificador de objeto== hierárquico, baseado em uma estrutura em árvore.",
    "PORQUE o SNMP usa a notação de nomes textuais separados por pontos, enquanto as pessoas usam a notação inteiro-ponto."
  ],
  options: [
    "I e II são verdadeiras, e II justifica I",
    "I e II são verdadeiras, mas II não justifica I",
    "I é verdadeira e II é falsa",
    "I é falsa e II é verdadeira"
  ],
  answer: 2,
  feedback: "A I é verdadeira. A II inverte as notações: o **SNMP** usa a representação inteiro-ponto, como 1.3.6.1.2.1, e as pessoas usam os nomes, como iso.org.dod.internet.mgmt.mib-2."
},
// 8 - Grupos da mib-2
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Conceitual Contextualizada",
  texto: "Um administrador quer consultar, via SNMP, informações sobre a tabela ARP de um nó e, em outra consulta, sobre os números de portas e a quantidade de pacotes enviados e recebidos por UDP.",
  question: "Em quais grupos da mib-2 essas informações se encontram, respectivamente?",
  options: [
    "Grupos ip e tcp.",
    "Grupos at e udp.",
    "Grupos if e icmp.",
    "Grupos sys e snmp."
  ],
  answer: 1,
  feedback: "O grupo **at** (address translation) trata da tabela ARP, e o grupo **udp** reúne portas e contadores de pacotes UDP. O grupo ==def==ip== trata da tabela de roteamento e do endereço IP."
},
// 9 - Codificação BER
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Análise Aplicada",
  texto: "Um analista examina a captura de uma mensagem SNMP e encontra o trecho 0x04, 0x03, 0x53, 0x57, 0x31, codificado em BER na ordem rótulo, comprimento e valor. Pela tabela de rótulos, ele sabe que 04 indica o tipo OCTET STRING.",
  question: "Qual interpretação do trecho é correta?",
  options: [
    "Um INTEGER de 4 bytes, cujo valor é 3.",
    "Uma OCTET STRING de 4 bytes, com os dados 0x03, 0x53, 0x57 e 0x31.",
    "Um IPAddress com três campos de valor.",
    "Uma OCTET STRING de comprimento 3, com valor formado por 0x53, 0x57 e 0x31."
  ],
  answer: 3,
  feedback: "No ==def==BER==, cada dado é uma tripla rótulo-comprimento-valor. O rótulo 0x04 indica **OCTET STRING**, o comprimento 0x03 indica três bytes de valor, e esses bytes são 0x53, 0x57 e 0x31."
},
// 10 - Counter e Gauge
{
  aula: "Aula 8 - Gerenciamento de redes de computadores",
  tipo: "Análise Aplicada",
  texto: "Ao projetar um monitoramento, um analista precisa escolher o tipo de dado para um contador de pacotes que, ao atingir o valor máximo, deve voltar a zero, e para outra medida que, ao atingir o máximo, deve permanecer nesse valor até ser reiniciada.",
  question: "Que tipos de dados da SMI atendem a cada caso, respectivamente?",
  options: [
    "Counter32 no primeiro caso e Gauge32 no segundo.",
    "Gauge32 no primeiro caso e Counter32 no segundo.",
    "TimeTicks no primeiro caso e Counter64 no segundo.",
    "Integer32 no primeiro caso e OCTET STRING no segundo."
  ],
  answer: 0,
  feedback: "O **Counter32** volta a zero ao atingir o valor máximo, e o ==def==Gauge32== permanece no máximo até ser reiniciado. O TimeTicks conta em intervalos de 1/100 de segundo."
},


],

};