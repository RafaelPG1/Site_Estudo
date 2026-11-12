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
}


  ],

enade: [// 51 - Vulnerabilidade, ameaça e ataque
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

};