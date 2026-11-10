/* =============================================
   NEXUS STUDY — redes2.js
   Disciplina: Redes 2
   ============================================= */

window.__nexusConteudo = {

   aulas: [
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

    // aula 7
    {
  aula: "Serviços Multimídia em Redes de Computadores",
  ideia_central: "Os serviços multimídia na Internet (streaming de conteúdo armazenado, streaming ao vivo e áudio/vídeo interativos) dependem da digitalização e compressão de áudio e vídeo, de métodos de distribuição de conteúdo e de mecanismos de tempo real (timestamp, buffer, numeração de sequência) apoiados por protocolos como TCP, UDP, RTP, RTCP e RTSP, tendo o VoIP como aplicação interativa de voz com desafios de QoS e segurança.",
  secoes: [
    {
      id: "objetivos_introducao",
      titulo: "Objetivos e Introdução",
      blocos: [
        { tipo: "texto", texto: "Redes de computadores II – Profª Luzia Nogueira" },
        { tipo: "lista", titulo: "Objetivos de aprendizagem", itens: [
          "Classificar serviços multimídia, diferenciando streaming de conteúdo armazenado, streaming ao vivo e comunicação interativa.",
          "Comparar mecanismos de distribuição de conteúdo, incluindo download tradicional, streaming com servidor de mídia e controle de reprodução com RTSP.",
          "Analisar os desafios da transmissão em tempo real, explicando latência, jitter, perda de pacotes, buffer de reprodução e mecanismos de temporização.",
          "Diferenciar os protocolos de comunicação multimídia, especialmente TCP, UDP, RTP e RTCP, reconhecendo suas responsabilidades.",
          "Entender o funcionamento dos aplicativos VoIP"
        ] },
        { tipo: "texto", texto: "Os avanços das tecnologias de comunicação e da Internet transformaram a maneira como as pessoas consomem e compartilham conteúdos de áudio e vídeo." },
        { tipo: "texto", texto: "Antigamente, os principais meios de comunicação multimídia eram o rádio e a televisão, enquanto a rede telefônica era utilizada predominantemente para a comunicação interativa por voz." },
        { tipo: "texto", texto: "Com a evolução das redes de computadores, a Internet passou a oferecer diversos serviços multimídia, permitindo a transmissão de áudio e vídeo sob demanda, a realização de transmissões ao vivo e a comunicação interativa em tempo real." },
        { tipo: "texto", texto: "Os serviços multimídia podem ser divididos em três categorias principais:" },
        { tipo: "imagem", src: "figura_1_categorias_servicos_multimidia.png", pasta: "imagens_redes2/aula_07", alt: "Diagrama em árvore: 'Áudio/vídeo na Internet' se divide em três categorias: 'Streaming de áudio/vídeo armazenado', 'Streaming de áudio/vídeo em tempo real' e 'Áudio/vídeo interativo'.", num: 1 },
        { tipo: "destaque", texto: "Obs: Streaming é uma técnica de transmissão que permite reproduzir áudio ou vídeo enquanto os dados continuam sendo recebidos pela rede, sem exigir que o arquivo completo seja baixado antes do início da reprodução" },
        { tipo: "topico", titulo: "Streaming de conteúdo armazenado", texto: "O conteúdo está previamente gravado e armazenado em um servidor. O usuário pode iniciar a reprodução antes de o arquivo inteiro ser baixado. Exemplos: Netflix, Spotify e vídeos do YouTube já publicados." },
        { tipo: "topico", titulo: "Streaming de conteúdo ao vivo", texto: "O áudio ou vídeo é produzido e transmitido enquanto o evento acontece. O usuário recebe o conteúdo com um pequeno atraso em relação à origem. Exemplos: transmissões esportivas ao vivo e lives." },
        { tipo: "topico", titulo: "Áudio e vídeo interativos", texto: "Os participantes enviam e recebem informações, permitindo uma comunicação nos dois sentidos, geralmente com baixa latência. Exemplos: videoconferências, chamadas de vídeo e aulas síncronas." }
      ]
    },
    {
      id: "digitalizacao_audio_video",
      titulo: "Digitalização de Áudio e Vídeo",
      blocos: [
        { tipo: "texto", texto: "Antes de serem transmitidos pela Internet, os sinais de áudio e vídeo capturados do mundo real precisam ser convertidos para uma representação digital." },
        { tipo: "topico", titulo: "Sinal analógico", texto: "varia continuamente ao longo do tempo, como o som captado por um microfone." },
        { tipo: "topico", titulo: "Sinal digital", texto: "representa a informação por meio de valores discretos, codificados em bits." },
        { tipo: "topico", titulo: "Digitalização", texto: "processo de conversão de um sinal analógico em dados digitais que podem ser processados, armazenados e transmitidos por dispositivos computacionais." },
        { tipo: "texto", texto: "O processo de digitalização envolve principalmente:" },
        { tipo: "lista", itens: [
          "1. Amostragem: coleta de valores do sinal em intervalos regulares de tempo.",
          "2. Quantização: aproximação dos valores amostrados para níveis discretos.",
          "3. Codificação: representação dos valores quantizados em sequências de bits."
        ] },
        { tipo: "subtitulo", texto: "Por que precisamos comprimir áudio e vídeo?" },
        { tipo: "texto", texto: "A digitalização pode gerar grandes quantidades de dados. Para reduzir o consumo de largura de banda, o espaço de armazenamento e o tempo de transmissão, utilizamos técnicas de compressão." },
        { tipo: "texto", texto: "A compressão pode ser dividida em duas categorias:" },
        { tipo: "topico", titulo: "Compressão sem perdas (lossless)", texto: "permite recuperar exatamente os dados originais." },
        { tipo: "topico", titulo: "Compressão com perdas (lossy)", texto: "elimina informações consideradas menos relevantes para reduzir ainda mais o tamanho dos dados." },
        { tipo: "texto", texto: "A Figura 29.4 – Transformação DCT aplicada a uma imagem uniforme no processo de compressão JPEG: a informação dos pixels é concentrada no coeficiente DC, enquanto os coeficientes AC são nulos devido à ausência de variações espaciais. Essa transformação prepara os dados para as etapas posteriores de compressão, incluindo a quantização, na qual podem ocorrer perdas de informação." },
        { tipo: "imagem", src: "figura_2_transformacao_dct_jpeg.png", pasta: "imagens_redes2/aula_07", alt: "Figura 29.4 – Caso 1: escala de cinza uniforme. Uma imagem é convertida na matriz de pixels P(x,y), com todos os valores 20, e a transformação gera a matriz T(m,n), com 160 no primeiro coeficiente (DC) e 0 nos demais (AC).", num: 2 },
        { tipo: "subtitulo", texto: "Compressão de Vídeo: MPEG" },
        { tipo: "texto", texto: "O MPEG (Moving Picture Experts Group) é uma família de padrões utilizada para a compressão de áudio e vídeo digital, permitindo reduzir o volume de dados necessário para armazenar e transmitir conteúdos multimídia. Um vídeo é formado por uma sequência ordenada de quadros (frames), exibidos rapidamente para produzir a sensação de movimento." },
        { tipo: "texto", texto: "A compressão de vídeo explora duas formas principais de redundância:" },
        { tipo: "topico", titulo: "Compressão espacial", texto: "reduz a quantidade de dados dentro de cada quadro, considerando as semelhanças entre os pixels de uma mesma imagem." },
        { tipo: "topico", titulo: "Compressão temporal", texto: "reduz a quantidade de dados transmitidos entre quadros consecutivos, aproveitando as semelhanças entre eles." },
        { tipo: "subtitulo", texto: "Onde o MPEG é utilizado?" },
        { tipo: "topico", titulo: "MP4 (MPEG-4 Part 14)", texto: "É o formato de vídeo mais popular da internet. É usado pelo YouTube, redes sociais, smartphones e serviços de streaming para armazenar e reproduzir vídeos." },
        { tipo: "topico", titulo: "MP3 (MPEG-1 Audio Layer III)", texto: "Apesar de antigo, continua sendo o formato de áudio universal para músicas, podcasts e arquivos de som devido à sua compatibilidade com praticamente qualquer dispositivo." },
        { tipo: "topico", titulo: "AVC / H.264 (MPEG-4 Part 10)", texto: "É o codec de compressão de vídeo mais utilizado no mundo hoje. Ele está presente na transmissão de canais de TV digital, em videochamadas (Zoom, Teams) e em plataformas de streaming (Netflix, Prime Video)." },
        { tipo: "topico", titulo: "HEVC / H.265 (MPEG-H Part 2)", texto: "O sucessor do H.264, usado para compactar vídeos em 4K e 8K, reduzindo o tamanho dos arquivos pela metade sem perder qualidade. É o padrão em iPhones modernos e transmissões UHD." }
      ]
    },
    {
      id: "streaming_conteudo_armazenado",
      titulo: "Streaming de conteúdo armazenado",
      blocos: [
        { tipo: "texto", texto: "Baixar arquivos armazenados de um servidor Web pode ser muito diferente de baixar outros tipos de arquivos. Veremos quatro métodos de downloading:" },
        { tipo: "lista", itens: [
          "1º método: utilização de um servidor Web",
          "2º Método: Uso de um Servidor Web com Metafile",
          "3º método: utilização de um Media Server",
          "4º método: Media Server e RTSP"
        ] },
        { tipo: "topico", titulo: "1º método: utilização de um servidor Web", texto: "Nesse método, o arquivo de áudio ou vídeo comprimido é baixado por meio do protocolo HTTP/HTTPs, utilizando uma requisição GET. O navegador recebe o arquivo e, somente após o download completo, inicia sua reprodução em um player de mídia." },
        { tipo: "destaque", texto: "Principal desvantagem: como arquivos multimídia podem ser grandes, o usuário precisa esperar o término do download para começar a assistir ou ouvir o conteúdo. Esse método não utiliza streaming contínuo durante a reprodução." },
        { tipo: "imagem", src: "figura_3_metodo_1_servidor_web.png", pasta: "imagens_redes2/aula_07", alt: "Uso de um servidor Web: (1) o Browser do cliente envia GET arquivo de áudio/vídeo ao Servidor Web; (2) o servidor envia a RESPOSTA; (3) o arquivo de áudio/vídeo é repassado ao Media player.", num: 3 },
        { tipo: "topico", titulo: "2º Método: Uso de um Servidor Web com Metafile", texto: "Neste método, o media player acessa diretamente o servidor Web para fazer download do arquivo de áudio/vídeo. O servidor Web armazena dois arquivos: um arquivo com o áudio/vídeo real e um metafile que armazena informações específicas sobre o arquivo de áudio/vídeo." },
        { tipo: "imagem", src: "figura_4_metodo_2_servidor_web_metafile.png", pasta: "imagens_redes2/aula_07", alt: "Uso de um servidor Web com metafile: (1) o Browser envia GET metafile ao Servidor Web; (2) o servidor envia a RESPOSTA; (3) o metafile é repassado ao Media player; (4) o Media player envia GET arquivo de áudio/vídeo ao Servidor Web; (5) o servidor envia a RESPOSTA.", num: 4 },
        { tipo: "topico", titulo: "3º método: utilização de um Media Server", texto: "O Media Server (servidor de mídia) é utilizado para transmitir áudio e vídeo por streaming, permitindo que a reprodução comece antes do recebimento completo do arquivo." },
        { tipo: "lista", itens: [
          "Diferentemente do servidor Web tradicional, ele pode utilizar protocolos específicos de mídia e, em determinados sistemas, o UDP, que não realiza retransmissões de segmentos perdidos como o TCP. Isso reduz atrasos, favorecendo a reprodução em tempo real, embora possa ocorrer perda de dados.",
          "Exemplo: durante a transmissão de um vídeo, alguns pacotes podem ser perdidos, mas a reprodução continua sem precisar aguardar a retransmissão.",
          "Importante: o TCP também pode ser utilizado em streaming, dependendo da aplicação e dos protocolos adotados. O UDP é uma alternativa quando a baixa latência é prioritária."
        ] },
        { tipo: "lista", titulo: "3º método: utilização de um Media Server", itens: [
          "1. O cliente HTTP acessa o servidor Web enviando uma mensagem GET.",
          "2. As informações do metafile vêm junto com a resposta",
          "3. O metafile é repassado para o media player.",
          "4. O media player usa a URL contida no arquivo de metafile para acessar o media server e baixar o arquivo. O download pode ser realizado por qualquer protocolo que use o UDP.",
          "5. O media server responde."
        ] },
        { tipo: "imagem", src: "figura_5_metodo_3_media_server.png", pasta: "imagens_redes2/aula_07", alt: "Uso de um media server: (1) o Browser envia GET metafile ao Servidor Web; (2) RESPOSTA; (3) o metafile é repassado ao Media player; (4) o Media player envia GET arquivo de áudio/vídeo ao Media server; (5) o Media server envia RESPONSE.", num: 5 },
        { tipo: "topico", titulo: "4º método: Media Server e RTSP", texto: "O RTSP (Real-Time Streaming Protocol) é um protocolo de controle que permite gerenciar a reprodução de conteúdos multimídia transmitidos por um Media Server." },
        { tipo: "texto", texto: "Ele possibilita controlar ações como:" },
        { tipo: "lista", itens: [
          "PLAY: iniciar ou retomar a reprodução.",
          "PAUSE: pausar a reprodução.",
          "TEARDOWN: encerrar a sessão de streaming."
        ] },
        { tipo: "texto", texto: "O RTSP utiliza um canal de controle separado do fluxo de dados multimídia (out-of-band), permitindo controlar a reprodução sem transportar diretamente o conteúdo de áudio e vídeo nesse canal." },
        { tipo: "destaque", texto: "Importante: o RTSP controla a sessão de reprodução, enquanto outros protocolos são responsáveis pelo transporte do áudio e vídeo. O RTSP, por si só, não garante maior velocidade nem elimina perdas de pacotes." },
        { tipo: "lista", titulo: "4º método: Media Server e RTSP", itens: [
          "1. O cliente HTTP acessa o servidor Web enviando uma mensagem GET.",
          "2. As informações do metafile vêm junto com a resposta do servidor.",
          "3. O metafile é repassado para o media player.",
          "4. O media player envia uma mensagem de SETUP para estabelecer uma conexão com o media server.",
          "5.O media server responde.",
          "6.O media player envia uma mensagem PLAY para iniciar a reprodução (download).",
          "7.O arquivo de áudio/vídeo é baixado usando um outro protocolo que suporte o UDP",
          "8.A conexão é encerrada enviando-se a mensagem TEARDOWN.",
          "9.O media server responde"
        ] },
        { tipo: "imagem", src: "figura_6_metodo_4_media_server_rtsp.png", pasta: "imagens_redes2/aula_07", alt: "Media Server e RTSP: (1) GET metafile do Browser ao Servidor Web; (2) RESPOSTA; (3) metafile repassado ao Media player; (4) ESTABELECIMENTO DA CONEXÃO entre Media player e Media server; (5) RESPOSTA; (6) PLAY; (7) RESPOSTA, seguida do streaming de áudio e vídeo; (8) ENCERRAMENTO DA CONEXÃO; (9) RESPOSTA.", num: 6 }
      ]
    },
    {
      id: "streaming_tempo_real",
      titulo: "Streaming de áudio e vídeo em tempo real",
      blocos: [
        { tipo: "texto", texto: "O streaming em tempo real permite transmitir áudio e vídeo pela Internet à medida que o conteúdo é produzido, de forma semelhante às transmissões de rádio e televisão." },
        { tipo: "texto", texto: "Principais características:" },
        { tipo: "lista", itens: [
          "Transmissão contínua de áudio e vídeo.",
          "Reprodução próxima ao momento da captura.",
          "Sensibilidade a atrasos e variações no tempo de entrega dos pacotes.",
          "Necessidade de manter a continuidade da reprodução."
        ] },
        { tipo: "texto", texto: "Exemplos: transmissões esportivas ao vivo, lives, eventos online..." },
        { tipo: "subtitulo", texto: "Streaming armazenado × streaming em tempo real" },
        { tipo: "lista", titulo: "Streaming de conteúdo armazenado", itens: [
          "O conteúdo já está gravado.",
          "O usuário solicita a reprodução sob demanda.",
          "Pode utilizar unicast, com uma transmissão destinada a cada cliente.",
          "É possível armazenar dados em buffer antes e durante a reprodução."
        ] },
        { tipo: "lista", titulo: "Streaming em tempo real", itens: [
          "O conteúdo é transmitido enquanto é produzido.",
          "A reprodução ocorre próxima ao momento da captura.",
          "Pode utilizar unicast ou multicast, dependendo da arquitetura.",
          "Atrasos e variações na entrega prejudicam a experiência."
        ] },
        { tipo: "destaque", texto: "Obs: unicast é a comunicação de um emissor para um receptor específico; multicast permite distribuir um fluxo para um grupo de receptores interessados. Embora o multicast seja eficiente para distribuir conteúdo ao vivo a muitos usuários, muitas aplicações atuais utilizam múltiplas transmissões unicast." }
      ]
    },
    {
      id: "caracteristicas_comunicacao_tempo_real",
      titulo: "Características da comunicação multimídia em tempo real",
      blocos: [
        { tipo: "texto", texto: "A comunicação de áudio e vídeo em tempo real exige mecanismos que permitam transmitir, receber e reproduzir dados de maneira contínua, mesmo quando a rede apresenta atrasos ou perdas de pacotes." },
        { tipo: "texto", texto: "As principais características são:" },
        { tipo: "lista", itens: [
          "1. Relação temporal entre os pacotes.",
          "2. Timestamp (marca temporal).",
          "3. Buffer de reprodução.",
          "4. Numeração de sequência dos pacotes (Ordem dos Pacotes).",
          "5. Multicasting.",
          "6. Tradução ou transcodificação.",
          "7. Mixagem.",
          "8. Suporte dos protocolos da camada de transporte."
        ] },
        { tipo: "topico", titulo: "Relação temporal entre os pacotes", texto: "A relação temporal corresponde à preservação dos intervalos de tempo entre os dados transmitidos, para que o áudio e o vídeo sejam reproduzidos na sequência e no ritmo adequados. Se todos os pacotes sofrerem o mesmo atraso na rede, o receptor poderá reproduzi-los mantendo os intervalos originais." },
        { tipo: "imagem", src: "figura_7_relacao_temporal_pacotes.png", pasta: "imagens_redes2/aula_07", alt: "Relação de tempo: três pacotes transmitidos pelo servidor em 00.00.00, 00.00.10 e 00.00.20 chegam ao cliente em 00.00.01, 00.00.11 e 00.00.21 (e 00.00.31 ao final), todos com o mesmo atraso, preservando os intervalos originais (30 s).", num: 7 },
        { tipo: "texto", texto: "Problema: se os pacotes chegarem com atrasos diferentes, o receptor poderá ficar sem dados para continuar a reprodução. Esse problema está relacionado ao jitter, que representa a variação do atraso de chegada dos pacotes." },
        { tipo: "imagem", src: "figura_8_jitter.png", pasta: "imagens_redes2/aula_07", alt: "Jitter: os pacotes transmitidos em 00.00.00, 00.00.10 e 00.00.20 chegam ao cliente em 00.00.01, 00.00.15 e 00.00.27 (e 00.00.37 ao final), com atrasos diferentes, alterando os intervalos entre os pacotes.", num: 8 },
        { tipo: "topico", titulo: "Timestamp (marca temporal)", texto: "O timestamp é uma informação associada aos dados multimídia que indica sua referência temporal dentro do fluxo. Ele permite que o receptor determine quando os dados devem ser reproduzidos, preservando o ritmo do áudio e do vídeo." },
        { tipo: "texto", texto: "Importância: o timestamp auxilia na reconstrução temporal do fluxo, mas não elimina sozinho o jitter. É necessário considerar os atrasos de chegada e, geralmente, utilizar um buffer de reprodução." },
        { tipo: "imagem", src: "figura_9_timestamp.png", pasta: "imagens_redes2/aula_07", alt: "Timestamp: pacotes com timestamps 0, 10 e 20 transmitidos pelo servidor chegam ao cliente em 00.00.01, 00.00.15 e 00.00.27 (e 00.00.37 ao final); a escala 'Tempo de reprodução' à esquerda marca 00.00.08, 00.00.18, 00.00.28 e 00.00.38.", num: 9 },
        { tipo: "topico", titulo: "Buffer de reprodução", texto: "O buffer de reprodução é uma área de memória utilizada para armazenar temporariamente os dados recebidos antes de serem reproduzidos. Seu objetivo é compensar as variações no tempo de chegada dos pacotes, permitindo que o conteúdo seja reproduzido em um ritmo mais constante." },
        { tipo: "texto", texto: "Funcionamento:" },
        { tipo: "lista", itens: [
          "1. O receptor começa a receber os pacotes.",
          "2. Os dados são armazenados no buffer.",
          "3. A reprodução aguarda até que uma quantidade suficiente de dados esteja disponível.",
          "4. O conteúdo é reproduzido continuamente enquanto novos pacotes chegam."
        ] },
        { tipo: "texto", texto: "Exemplo: se a reprodução for configurada para começar sete segundos após o início do recebimento, esse intervalo poderá ajudar a absorver atrasos variáveis de curta duração." },
        { tipo: "imagem", src: "figura_10_buffer_reproducao.png", pasta: "imagens_redes2/aula_07", alt: "Buffer de reprodução: três momentos do buffer entre 'Chegada' e 'Reprodução'. No instante 00:00:08 o buffer contém 7 segundos de dados; no instante 00:00:18, 3; no instante 00:00:28, 1.", num: 10 },
        { tipo: "topico", titulo: "Numeração de sequência dos pacotes", texto: "A numeração de sequência identifica a posição de cada pacote no fluxo transmitido. Ela permite ao receptor verificar a ordem de chegada e identificar possíveis lacunas na sequência." },
        { tipo: "texto", texto: "Importância: o timestamp informa a referência temporal dos dados, enquanto o número de sequência auxilia na identificação de perdas e na ordenação dos pacotes." },
        { tipo: "topico", titulo: "Multicasting", texto: "Multicast é um método de comunicação em que um fluxo de dados é enviado a um grupo de receptores interessados." },
        { tipo: "lista", itens: [
          "Em vez de transmitir uma cópia individual para cada usuário em todos os trechos da rede, os pacotes podem ser replicados nos pontos em que os caminhos dos receptores se dividem.",
          "Exemplo: uma universidade transmite uma palestra ao vivo para vários laboratórios conectados à mesma infraestrutura de rede.",
          "Limitação: depende do suporte e da configuração do multicast na infraestrutura de rede. Muitas plataformas comerciais de streaming utilizam unicast, em vez de multicast IP."
        ] },
        { tipo: "topico", titulo: "Tradução ou transcodificação", texto: "A tradução, no contexto da multimídia, corresponde à adaptação de um fluxo de áudio ou vídeo para atender às condições do receptor ou da rede." },
        { tipo: "lista", itens: [
          "Isso pode envolver a alteração da resolução, da taxa de bits, do codec ou de outros parâmetros de codificação.",
          "Exemplo: um servidor recebe um vídeo codificado para transmissão a 5 Mbps, mas o destinatário possui uma conexão capaz de suportar menos de 1 Mbps. O servidor pode gerar uma versão de menor qualidade, com taxa de bits mais baixa."
        ] },
        { tipo: "topico", titulo: "Suporte dos protocolos da camada de transporte", texto: "As aplicações multimídia precisam de mecanismos para transportar os pacotes, identificar sua ordem, interpretar sua temporização e lidar com perdas e atrasos. Principais protocolos utilizados:" },
        { tipo: "lista", itens: [
          "TCP (Transmission Control Protocol): garante a entrega ordenada dos dados, retransmitindo segmentos perdidos. Isso é útil para transferências que exigem confiabilidade, mas as retransmissões podem aumentar o atraso.",
          "UDP (User Datagram Protocol): possui menor sobrecarga e não realiza retransmissões automaticamente. Por isso, é adequado a aplicações que priorizam a entrega no momento certo, mesmo que alguns pacotes sejam perdidos.",
          "RTP (Real Time Streaming Protocol): adiciona informações temporais, numeração de sequência e identificação do fluxo, sendo normalmente utilizado sobre UDP em aplicações multimídia interativas."
        ] },
        { tipo: "topico", titulo: "RTCP (Real-time Transport Control Protocol)", texto: "é um protocolo complementar ao RTP, utilizado em aplicações de áudio e vídeo em tempo real, como videoconferências, chamadas VoIP e transmissões multimídia. Função principal é monitorar a qualidade da transmissão e fornecer informações sobre o desempenho da comunicação em tempo real." },
        { tipo: "imagem", src: "figura_11_mensagens_rtcp.png", pasta: "imagens_redes2/aula_07", alt: "Tipos de mensagens TCP (RTCP): Sender report (200), Receiver report (201), Source description message (202), Bye message (203) e Application-specific message (204).", num: 11 },
        { tipo: "lista", titulo: "RTCP (Real-time Transport Control Protocol)", itens: [
          "Sender Report (SR): Envia periodicamente estatísticas sobre a transmissão e a recepção de pacotes RTP.",
          "Receiver Report (RR): Informa sobre a qualidade da rede, incluindo o desempenho da recepção dos pacotes.",
          "Source Description (SDES): Fornece informações sobre a fonte, como nome e dados de contato.",
          "BYE: Informa que uma fonte está deixando ou encerrando sua participação na sessão multimídia.",
          "APP: Permite enviar mensagens específicas de uma aplicação, definidas para finalidades não previstas no padrão RTCP."
        ] }
      ]
    },
    {
      id: "audio_video_interativos",
      titulo: "Áudio e vídeo interativos",
      blocos: [
        { tipo: "texto", texto: "Áudio e vídeo interativos são formas de comunicação multimídia em que os participantes enviam e recebem áudio e/ou vídeo simultaneamente, permitindo uma conversa nos dois sentidos, geralmente com baixa latência (pouco atraso)." },
        { tipo: "lista", itens: [
          "Por exemplo, em uma videoconferência, uma pessoa fala e sua voz e imagem são transmitidas aos demais participantes. Ao mesmo tempo, ela recebe o áudio e o vídeo deles, permitindo uma conversa natural.",
          "Aplicativos VoIP são outro exemplos de sistemas que possibilitam áudio interativo."
        ] }
      ]
    },
    {
      id: "servico_voip",
      titulo: "Serviço VoIP",
      blocos: [
        { tipo: "texto", texto: "A Voz sobre IP (Voice over Internet Protocol – VoIP) é uma tecnologia que permite realizar chamadas de voz utilizando redes IP, como a Internet ou redes locais, em vez de depender exclusivamente da rede telefônica tradicional." },
        { tipo: "texto", texto: "Na telefonia convencional, a comunicação pode utilizar comutação de circuitos, enquanto a tecnologia VoIP transmite a voz digitalizada em pacotes de dados pela rede." },
        { tipo: "texto", texto: "Principais características:" },
        { tipo: "lista", itens: [
          "Transmissão de voz por redes IP.",
          "Digitalização e codificação do sinal de voz.",
          "Transmissão de áudio em pacotes de dados.",
          "Possibilidade de integração com vídeo e outros serviços multimídia.",
          "Utilização de protocolos específicos para estabelecer, controlar e encerrar chamadas."
        ] },
        { tipo: "subtitulo", texto: "Vantagens" },
        { tipo: "topico", titulo: "Redução de Custos", texto: "pois, as chamadas VoIP são mais baratas que as chamadas tradicionais, especialmente em longas distâncias." },
        { tipo: "topico", titulo: "Flexibilidade", texto: "é possível fazer e receber chamadas de qualquer lugar, basta possui acesso à internet." },
        { tipo: "topico", titulo: "Recursos Avançados", texto: "Oferece funcionalidades como correio de voz, chamadas em conferência, gravação de chamadas, e muito mais" },
        { tipo: "texto", texto: "Principais aplicativos VoIP:" },
        { tipo: "lista", itens: [
          "WhatsApp",
          "Skype (desuso)",
          "Microsoft Teams",
          "Google Meet",
          "Telegram",
          "Facebook Messenger",
          "Discord"
        ] }
      ]
    },
    {
      id: "voip_desafios",
      titulo: "Serviço VoIP: Desafios",
      blocos: [
        { tipo: "texto", texto: "Embora a tecnologia VoIP (Voice over Internet Protocol) ofereça vantagens como redução de custos, flexibilidade e mobilidade, sua utilização também apresenta desafios relacionados à qualidade da comunicação e à segurança das informações transmitidas." },
        { tipo: "topico", titulo: "Qualidade de Serviço (QoS)", texto: "A qualidade das chamadas VoIP depende diretamente das condições da rede utilizada para transmitir voz em tempo real. Diferentemente de uma comunicação tradicional por telefonia, o VoIP utiliza redes IP, que podem apresentar congestionamentos, atrasos e perdas de pacotes, comprometendo a experiência dos usuários." },
        { tipo: "topico", titulo: "Segurança", texto: "A segurança é outro desafio importante para o VoIP, pois a comunicação ocorre por meio de redes IP e pode estar exposta a ameaças cibernéticas. Caso não sejam adotadas medidas de proteção adequadas, atacantes podem tentar interceptar conversas, utilizar contas indevidamente ou comprometer a disponibilidade dos serviços." },
        { tipo: "subtitulo", texto: "Serviço VoIP: Desafios QoS" },
        { tipo: "texto", texto: "Entre os principais fatores que afetam a qualidade das chamadas, destacam-se:" },
        { tipo: "topico", titulo: "Latência", texto: "corresponde ao tempo que os pacotes de voz levam para chegar ao destino. Atrasos elevados podem dificultar a comunicação e provocar interrupções na conversa." },
        { tipo: "topico", titulo: "Jitter", texto: "representa a variação do tempo de chegada dos pacotes. Quando essa variação é elevada, o áudio pode apresentar falhas, cortes ou distorções." },
        { tipo: "topico", titulo: "Perda de pacotes", texto: "ocorre quando parte dos dados transmitidos não chega ao destinatário, causando trechos de áudio ausentes ou prejudicando a compreensão da fala." },
        { tipo: "topico", titulo: "Congestionamento da rede", texto: "acontece quando muitos dispositivos compartilham os mesmos recursos de comunicação, reduzindo a disponibilidade de banda para as chamadas." },
        { tipo: "texto", texto: "Para minimizar esses problemas, podem ser utilizadas técnicas de QoS (Quality of Service), como priorização dos pacotes de voz, gerenciamento de congestionamento, dimensionamento adequado da largura de banda e monitoramento contínuo da rede." },
        { tipo: "texto", texto: "Essas medidas ajudam a manter a comunicação mais estável, embora não eliminem todos os problemas, especialmente aqueles que ocorrem fora da rede administrada." },
        { tipo: "subtitulo", texto: "Serviço VoIP: Desafios segurança" },
        { tipo: "texto", texto: "Entre as principais ameaças, destacam-se:" },
        { tipo: "topico", titulo: "Interceptação de chamadas", texto: "ocorre quando um invasor consegue capturar o tráfego de voz e, caso ele não esteja adequadamente protegido por criptografia, pode obter acesso ao conteúdo das conversas." },
        { tipo: "topico", titulo: "Fraudes telefônicas", texto: "envolvem o uso indevido de contas, credenciais ou sistemas VoIP para realizar chamadas não autorizadas, podendo gerar custos financeiros para usuários e organizações." },
        { tipo: "topico", titulo: "Roubo de credenciais", texto: "senhas fracas ou comprometidas podem permitir que terceiros se autentiquem como usuários legítimos e utilizem seus serviços." },
        { tipo: "topico", titulo: "Falsificação de identidade (spoofing)", texto: "ocorre quando um atacante manipula informações de identificação para se passar por outro usuário ou serviço, facilitando tentativas de fraude e engenharia social." },
        { tipo: "texto", texto: "Para reduzir esses riscos, é recomendável utilizar mecanismos de criptografia, como TLS, além de implementar autenticação forte, políticas de senhas seguras, atualização dos sistemas, controle de acesso e monitoramento de atividades suspeitas. Também é importante configurar corretamente os equipamentos de rede e os servidores VoIP para reduzir a exposição a ataques." }
      ]
    },
    {
      id: "servidores_voip_locais",
      titulo: "Servidores VoIP locais para comunicação interna",
      blocos: [
        { tipo: "texto", texto: "Um servidor VoIP local é um equipamento ou computador que executa um sistema de telefonia IP dentro de uma empresa, escola ou laboratório. Ele permite que os usuários façam chamadas de voz entre ramais utilizando a rede local (LAN), sem depender necessariamente de uma operadora telefônica ou da Internet." },
        { tipo: "texto", texto: "Opções de servidores VoIP:" },
        { tipo: "lista", itens: [
          "Asterisk",
          "FreePBX"
        ] },
        { tipo: "destaque", texto: "Obs: Um sistema de comunicação VoIP local pode manter a comunicação interna durante uma queda da Internet, desde que a rede local continue funcionando." }
      ]
    }
  ]
    },

    // aula 8

    {
      aula: "Gerenciamento de redes de computadores",
      ideia_central: "O gerenciamento de redes consiste em testar, monitorar, configurar e resolver problemas dos componentes de rede para garantir operação eficiente, segura e confiável. Organiza-se em cinco áreas definidas pela ISO (configuração, falhas, desempenho, segurança e contabilização) e usa o protocolo SNMP, apoiado pela SMI e pela MIB, com ferramentas como Zabbix, Nagios e Cacti.",
      secoes: [
        {
          id: "objetivos_introducao",
          titulo: "Objetivos e Introdução",
          blocos: [
            { tipo: "texto", texto: "Redes de computadores II – Profª Luzia Nogueira" },
            { tipo: "lista", titulo: "Objetivos de aprendizagem", itens: [
              "Compreender os conceitos fundamentais e a importância do gerenciamento de redes de computadores.",
              "Conhecer os protocolos de gerenciamento de redes.",
              "Reconhecer problemas comuns de conectividade e desempenho em redes de computadores.",
              "Compreender estratégias de gerenciamento e manutenção que contribuam para a disponibilidade, a segurança e a confiabilidade das redes."
            ] }
          ]
        },
        {
          id: "introducao_gerenciamento_redes",
          titulo: "Introdução ao gerenciamento de redes",
          blocos: [
            { tipo: "subtitulo", texto: "O que é gerenciamento de redes?" },
            { tipo: "citacao", texto: "Podemos definir o gerenciamento de redes como a tarefa de testar, monitorar, configurar e resolver problemas dos componentes de rede com o objetivo de atender um conjunto de requisitos definidos por uma organização. Esses requisitos incluem a operação regular e eficiente da rede, proporcionando a qualidade de serviço predefinida para os usuários. Para realizar essa tarefa, um sistema de gerenciamento de rede usa hardware, software e seres humanos.", autor: "Forouzan e Mosharraf (2013, p. 693)" },
            { tipo: "destaque", texto: "Multimídia: Introdução ao Gerenciamento de Redes - parte 1 (vídeo)." },
            { tipo: "subtitulo", texto: "E qual o objetivo do gerenciamento de redes?" },
            { tipo: "texto", texto: "O objetivo principal é garantir que a rede opere de maneira eficiente, segura e confiável, suportando o tráfego de dados e as necessidades dos usuários e sistemas." },
            { tipo: "imagem", src: "figura_1_ilustracao_rede_gerenciamento.png", pasta: "imagens_redes2/aula_08", alt: "Ilustração de uma rede com roteadores, computadores, servidores e nuvens, com vários pontos de interrogação em vermelho. Fonte: https://docentes.ifrn.edu.br/alexfurtunato/disciplinas/gerencia-de-redes/aula-1-introducao-ao-gerenciamento-de-rede", num: 1 },
            { tipo: "texto", texto: "Fonte: https://docentes.ifrn.edu.br/alexfurtunato/disciplinas/gerencia-de-redes/aula-1-introducao-ao-gerenciamento-de-rede" },
            { tipo: "texto", texto: "A Organização Internacional de Padronização (ISO – International Organization for Standardization) define cinco áreas de gerenciamento de redes" },
            { tipo: "imagem", src: "figura_2_areas_gerenciamento_iso.png", pasta: "imagens_redes2/aula_08", alt: "Diagrama em árvore: 'Gerenciamento de redes' se divide em cinco áreas: Gerenciamento de configuração, Gerenciamento de falhas, Gerenciamento de desempenho, Gerenciamento de segurança e Gerenciamento de contabilização. Fonte: Forouzan e Mosharraf (2013, p. 694)", num: 2 }
          ]
        },
        {
          id: "gerenciamento_configuracao",
          titulo: "Gerenciamento de configuração",
          blocos: [
            { tipo: "topico", titulo: "Gerenciamento de configuração", texto: "está relacionado com o estado de cada entidade e o seu relacionamento com outras entidades." },
            { tipo: "lista", itens: [
              "Configuração inicial",
              "Reconfiguração: A reconfiguração de redes refere-se ao processo de modificar a estrutura, topologia, parâmetros ou configurações de uma rede de computadores para atender a novas necessidades, corrigir problemas ou melhorar o desempenho",
              "Documentação: A configuração de rede original e cada alteração posterior devem ser registradas meticulosamente. Isto significa que deve haver documentações específicas para hardware, software e contas de usuário."
            ] },
            { tipo: "subtitulo", texto: "Configuração/Reconfiguração" },
            { tipo: "topico", titulo: "De hardware (manualmente)", texto: "envolve todas as alterações no hardware." },
            { tipo: "topico", titulo: "De software (pode ser automatizada)", texto: "envolve todas as alterações no software." },
            { tipo: "topico", titulo: "De conta de usuário", texto: "envolve adicionar e excluir usuários a um sistema e configurar as permissões de acesso do usuário, tanto como indivíduo quanto como membro de um grupo." },
            { tipo: "subtitulo", texto: "Documentação" },
            { tipo: "subtitulo", texto: "Documentação de hardware" },
            { tipo: "topico", titulo: "Mapas", texto: "para rastreiam cada equipamento de hardware e sua conexão com a rede, podendo haver um mapa geral que mostre as relações lógicas entre sub-redes e um segundo mapa geral que mostre a localização física de cada sub-rede." },
            { tipo: "topico", titulo: "Especificações", texto: "cada equipamento deve ter suas especificações documentadas, incluindo informações como tipo de hardware, número de série, fornecedor (endereço e número de telefone), momento da compra e garantia." },
            { tipo: "topico", titulo: "Documentação de software", texto: "Todo software deve possuir uma documentação que inclui informações como o tipo de software, versão, instante de instalação e contrato de licença." },
            { tipo: "topico", titulo: "Documentação de conta de usuário", texto: "geralmente os SO possui um aplicativo que permite a documentação de conta de usuário e o gerenciamento deve se certificar de que os arquivos com essas informações sejam atualizados e protegidos em particular." }
          ]
        },
        {
          id: "gerenciamento_falhas",
          titulo: "Gerenciamento de falhas",
          blocos: [
            { tipo: "topico", titulo: "Gerenciamento de falhas", texto: "é a área do gerenciamento de redes que lida com questões relacionadas a interrupções no sistema." },
            { tipo: "topico", titulo: "Gerenciamento de falhas reativo", texto: "um sistema de gerenciamento de falhas reativo é responsável por detectar, isolar, corrigir e registrar falhas. Ele espera a falha ocorrer para trata-lá" },
            { tipo: "topico", titulo: "Gerenciamento de falhas proativo", texto: "busca prever e prevenir as falhas antes que eles afetem o desempenho ou causem interrupções. O gerenciamento proativo se concentra na identificação de sinais antecipados de falhas potenciais, de modo que ações corretivas possam ser implementadas antes que o problema se torne crítico." }
          ]
        },
        {
          id: "gerenciamento_desempenho",
          titulo: "Gerenciamento de desempenho",
          blocos: [
            { tipo: "topico", titulo: "Gerenciamento de desempenho", texto: "busca monitorar e controlar a rede para garantir que ela funcione da maneira mais eficiente possível. Para isso, busca quantificar o desempenho através dos seguintes aspectos:" },
            { tipo: "topico", titulo: "Capacidade", texto: "refere-se à quantidade máxima de dados que uma rede pode transmitir de forma eficiente em um determinado período de tempo" },
            { tipo: "topico", titulo: "Tráfego", texto: "transferência de pacotes. O tráfego interno é medido pelo número de pacotes (ou bytes) que são transmitidos no interior da rede. O tráfego externo é medido pela troca de pacotes (ou bytes) com entidades fora da rede." },
            { tipo: "topico", titulo: "Vazão", texto: "refere-se à taxa efetiva de transferência de dados em uma rede." },
            { tipo: "topico", titulo: "Tempo de respostas", texto: "tempo total do momento em que um usuário requisita um serviço ao momento em que o serviço é concedido." }
          ]
        },
        {
          id: "gerenciamento_seguranca",
          titulo: "Gerenciamento de segurança",
          blocos: [
            { tipo: "topico", titulo: "Gerenciamento de segurança", texto: "é responsável por controlar o acesso à rede com base em uma política predefinida." },
            { tipo: "imagem", src: "figura_3_pilares_seguranca_informacao.png", pasta: "imagens_redes2/aula_08", alt: "Diagrama com um círculo central 'Segurança da Informação' e seis setas apontando para ele, vindas de: Integridade, Disponibilidade, Irretratabilidade ou Não Repúdio, Conformidade, Autenticidade e Confidencialidade.", num: 3 },
            { tipo: "topico", titulo: "Confidencialidade", texto: "garantia de que as informações só sejam acessíveis a pessoas autorizadas." },
            { tipo: "topico", titulo: "Integridade", texto: "garante que os dados permaneçam precisos e confiáveis ao longo do tempo. Os dados não devem ser modificados de maneira não autorizada ou acidental." },
            { tipo: "topico", titulo: "Disponibilidade", texto: "diz respeito à capacidade de acessar informações quando necessário ( por pessoas autorizadas)." },
            { tipo: "topico", titulo: "Autenticidade", texto: "A autenticidade está relacionada à garantia de que as informações e as partes envolvidas em uma transação ou comunicação sejam legítimas." },
            { tipo: "topico", titulo: "Conformidade", texto: "é o cumprimento da política de segurança da empresa e dos padrões da indústria a que ela pertence" },
            { tipo: "topico", titulo: "Não-repúdio", texto: "O não-repúdio, também conhecido como irretratabilidade, é o pilar que garante que uma ação não pode ser negada posteriormente." }
          ]
        },
        {
          id: "gerenciamento_contabilizacao",
          titulo: "Gerenciamento de contabilização",
          blocos: [
            { tipo: "topico", titulo: "Gerenciamento de contabilização", texto: "consiste em controlar o acesso dos usuários aos recursos de rede por meio de tarifas." },
            { tipo: "lista", itens: [
              "Ele impede que os usuários monopolizem os limitados recursos da rede.",
              "Ele impede que os usuários utilizem o sistema de forma ineficiente.",
              "Os gerentes de rede podem fazer planejamento de curto e longo prazo com base na demanda de uso da rede"
            ] }
          ]
        },
        {
          id: "protocolo_snmp",
          titulo: "Protocolo de Gerencia de Redes SNMP",
          blocos: [
            { tipo: "subtitulo", texto: "O que é o Simple Network Management Protocol (SNMP)?" },
            { tipo: "destaque", texto: "Multimídia: Introdução ao Gerenciamento de Redes - parte 4 - SNMP (vídeo)." },
            { tipo: "texto", texto: "O SNMP é uma estrutura para o gerenciamento de dispositivos em uma internet que use a camada de aplicação da pilha de protocolos TCP/IP. Ele fornece um conjunto de operações fundamentais para o monitoramento e a manutenção de uma internet." },
            { tipo: "subtitulo", texto: "Versões do SNMP" },
            { tipo: "lista", itens: [
              "SNMPv1: Limitações e introdução ao padrão.",
              "SNMPv2: Melhorias e novas funcionalidades.",
              "SNMPv3: Foco em segurança, autenticação e privacidade."
            ] },
            { tipo: "texto", texto: "O SNMP usa o conceito de gerente e agente, onde algumas poucas estações gerentes controlam um conjunto de agentes" },
            { tipo: "imagem", src: "figura_4_gerentes_e_agentes.png", pasta: "imagens_redes2/aula_08", alt: "Diagrama de rede com uma estação Gerente, roteadores e uma estação Agente conectados por dispositivos de rede; três pontos rotulados 'Agente' e uma 'Variável dos agentes' ligada a um roteador. Fonte: Forouzan e Mosharraf (2013, p. 698)", num: 4 },
            { tipo: "subtitulo", texto: "Gerentes e agentes" },
            { tipo: "topico", titulo: "Gerente", texto: "é um host que executa o programa-servidor SNMP." },
            { tipo: "topico", titulo: "Agente", texto: "é uma estação gerenciada, um roteador (ou uma estação) que executa o programa-cliente SNMP." },
            { tipo: "texto", texto: "O gerenciamento é obtido por meio da simples interação entre um gerente e um agente." }
          ]
        },
        {
          id: "pdus_snmp",
          titulo: "PDUs e operações SNMP",
          blocos: [
            { tipo: "texto", texto: "O SNMPv3 define oito tipos de Unidades de Dados de Protocolo (PDUs – Protocol Data Units):" },
            { tipo: "lista", itens: [
              "GetRequest,",
              "GetNext-Request,",
              "GetBulkRequest,",
              "SetRequest,",
              "Response,",
              "Trap,",
              "InformRequest,",
              "Report."
            ] },
            { tipo: "imagem", src: "figura_5_pdus_snmp.png", pasta: "imagens_redes2/aula_08", alt: "Diagrama entre 'Gerente SNMP' e 'Agente SNMP' com setas: GetRequest, GetNextRequest, GetBulkRequest e SetRequest do gerente ao agente; Response e Trap do agente ao gerente; InformRequest e Report 'Para outro gerente'. Fonte: Forouzan e Mosharraf (2013, p. 710)", num: 5 },
            { tipo: "subtitulo", texto: "Operações SNMP" },
            { tipo: "tabela", titulo: "Tabela 9.3 Tipos de PDU. Fonte: Forouzan e Mosharraf (2013, p. 712)", colunas: ["Tipo", "Rótulo (Hex)", "Tipo", "Rótulo (Hex)"], linhas: [
              ["GetRequest", "A0", "GetBulkRequest", "A5"],
              ["GetNextRequest", "A1", "InformRequest", "A6"],
              ["Response", "A2", "Trap (SNMPv2)", "A7"],
              ["SetRequest", "A3", "Report", "A8"]
            ] },
            { tipo: "subtitulo", texto: "Operações SNMP" },
            { tipo: "topico", titulo: "GetRequest", texto: "Solicita o valor de variáveis específicas. Exemplo: o gerente pede ao roteador o valor da variável que indica o uso atual da CPU." },
            { tipo: "topico", titulo: "GetNextRequest", texto: "Solicita o próximo valor na MIB. A MIB é o “catálogo” de informações que o SNMP usa para gerenciar dispositivos. Ela guarda valores como status, contadores e configurações, e o GetNextRequest permite percorrer esses dados item por item." },
            { tipo: "topico", titulo: "GetBulkRequest", texto: "Recupera grandes quantidades de dados de uma vez." },
            { tipo: "topico", titulo: "SetRequest", texto: "Modifica o valor de variáveis em um dispositivo. Exemplo: o gerente altera a configuração de um roteador, mudando o IP de uma interface." },
            { tipo: "subtitulo", texto: "Operações SNMP" },
            { tipo: "topico", titulo: "Response", texto: "Responde a uma solicitação de um gerente." },
            { tipo: "topico", titulo: "Trap", texto: "Notifica o gerente de eventos importantes de forma assíncrona. Exemplo: um switch envia um Trap quando uma porta cai ou um link falha." },
            { tipo: "topico", titulo: "InformRequest", texto: "Notificação com confirmação entre gerentes. Exemplo: Um gerente regional informa o gerente central sobre uma falha, e recebe confirmação." },
            { tipo: "topico", titulo: "Report", texto: "Relata erros ou problemas internos do protocolo SNMPv3." },
            { tipo: "subtitulo", texto: "Operações de erros SNMP" },
            { tipo: "tabela", titulo: "Tabela 9.4 Tipos de erros. Fonte: Forouzan e Mosharraf (2013, p. 712)", colunas: ["Estado", "Nome", "Significado"], linhas: [
              ["0", "noError", "Nenhum erro"],
              ["1", "tooBig", "Resposta é grande demais para caber em uma só mensagem"],
              ["2", "noSuchName", "Variável não existe"],
              ["3", "badValue", "O valor a ser armazenado é inválido"],
              ["4", "readOnly", "O valor não pode ser modificado"],
              ["5", "genErr", "Outros erros"]
            ] },
            { tipo: "subtitulo", texto: "Como funciona o gerenciamento no SNMP?" },
            { tipo: "lista", itens: [
              "Um gerente inspeciona um agente por meio de uma solicitação de informações que refletem no comportamento do agente.",
              "Um gerente força um agente a executar uma tarefa por meio da reinicialização de valores na base de dados daquele agente.",
              "Um agente contribui com o processo de gerenciamento por meio de alertas, avisando o gerente de uma situação incomum."
            ] }
          ]
        },
        {
          id: "componentes_gerenciamento",
          titulo: "Componentes de gerenciamento",
          blocos: [
            { tipo: "lista", itens: [
              "Protocolo Simples de Gerenciamento de Redes (SNMP - Simple Network Management Protocol )",
              "Estrutura de Gerenciamento da Informação (SMI – Structure of Management Information)",
              "Base de Informações de Gerenciamento (MIB – Management Information Base)",
              "Localizada no agente e consultada pelo gerente"
            ] },
            { tipo: "imagem", src: "figura_6_componentes_gerenciamento.png", pasta: "imagens_redes2/aula_08", alt: "Diagrama: um retângulo 'Gerenciamento' contendo três blocos: SNMP (em cima), SMI e MIB (embaixo). Fonte: Forouzan e Mosharraf (2013, p. 699)", num: 6 },
            { tipo: "texto", texto: "Fonte: Forouzan e Mosharraf (2013, p. 699)" },
            { tipo: "subtitulo", texto: "Papel do SNMP" },
            { tipo: "lista", itens: [
              "Define o formato do pacote a ser enviado de um gerente para um agente e vice-versa",
              "Interpreta o resultado e cria estatísticas (muitas vezes com a ajuda de outro software de gerenciamento)"
            ] },
            { tipo: "subtitulo", texto: "Papel da SMI" },
            { tipo: "lista", itens: [
              "SMI define as regras gerais para nomear objetos, definir os tipos de objetos (incluindo a faixa de valores e seu comprimento) e mostrar como codificar objetos e valores."
            ] },
            { tipo: "subtitulo", texto: "Papel da MIB" },
            { tipo: "lista", itens: [
              "A MIB cria uma coleção de objetos nomeados, seus tipos e os relacionamentos entre eles em uma entidade a ser gerenciada."
            ] },
            { tipo: "texto", texto: "Imagine uma estação-gerente que deseja enviar uma mensagem para uma estação--agente com o objetivo de determinar o número de datagramas de usuário UDP recebidos pelo agente." },
            { tipo: "lista", itens: [
              "A MIB é responsável por encontrar o objeto que contém o número de datagramas de usuário UDP recebidos.",
              "A SMI, com a ajuda de outro protocolo a ela incorporado, é responsável por codificar o nome do objeto.",
              "O SNMP é responsável por criar uma mensagem, conhecida como “GetRequest”, e por encapsular a mensagem codificada."
            ] },
            { tipo: "imagem", src: "figura_7_exemplo_getrequest.png", pasta: "imagens_redes2/aula_08", alt: "Diagrama de sequência entre Gerente, Internet e Agente: (1) Requisição 'Desejo saber o número de datagramas de usuário UDP recebidos?'; (2) SMI: 'Valores inteiros são definidos usando três atributos'; (3) MIB: 'O objetivo tem um valor inteiro e é denominado udpInDatagrama com id 1.3.6.1.2.1.7.1.0'; SNMP: 'Encapsula o pedido em uma mensagem SNMP do tipo GetRequest'; (4) Pacote SNMP GetRequest ao Agente; (5) Pacote SNMP Resposta; (6) Resposta 'Seis datagramas de usuário recebidos'. Fonte: Forouzan e Mosharraf (2013, p. 702)", num: 7 },
            { tipo: "texto", texto: "Fonte: Forouzan e Mosharraf (2013, p. 702)" }
          ]
        },
        {
          id: "smi",
          titulo: "Estrutura de Gerenciamento da Informação (SMI)",
          blocos: [
            { tipo: "texto", texto: "A Estrutura de Gerenciamento de Informação (SMI) é uma diretriz usada pelo SNMP para define os três atributos de tratamento de um objeto: nome, tipo de dados e método de codificação." },
            { tipo: "lista", itens: [
              "Os objetos nomeados pelo SMI referem-se a informações ou variáveis que podem ser gerenciadas e monitoradas dentro de um dispositivo de rede.",
              "Os objeto gerenciado (como interfaces de rede, status de dispositivos, contadores de tráfego, etc.) tem um identificador único, conhecido como OID (Object Identifier)."
            ] },
            { tipo: "subtitulo", texto: "Estrutura hierárquica do SMI" },
            { tipo: "lista", itens: [
              "Para nomear objetos globalmente, a SMI usa um identificador de objeto, que consiste em um identificador hierárquico baseado em uma estrutura em árvore.",
              "A estrutura da árvore começa com uma raiz sem nome. Cada objeto pode ser definido usando uma sequência de inteiros separados por pontos. A estrutura da árvore também pode definir um objeto usando uma sequência de nomes textuais separados por pontos. A representação inteiro-ponto é usada pelo SNMP. A notação nomes-ponto é usada por pessoas."
            ] },
            { tipo: "imagem", src: "figura_8_identificador_de_objeto.png", pasta: "imagens_redes2/aula_08", alt: "Figura 9.6 – Identificador de objeto na SMI: árvore com 'raiz' e ramos itu-t (0), iso (1) e iso-itu-u (2); descendo de iso: org (3), dod (6), internet (1) = 1.3.6.1 (iso.org.dod.internet), mgmt (2) e mib-2 (1) = 1.3.6.1.2.1 (iso.org.dod.internet.mgmt.mib-2). Abaixo: iso.org.dod.internet.mgmt.mib-2 ↔ 1.3.6.1.2.1", num: 8 },
            { tipo: "texto", texto: "Fonte: Forouzan e Mosharraf (2013, p. 703)" },
            { tipo: "subtitulo", texto: "Suas funções são:" },
            { tipo: "topico", titulo: "Nomear objetos", texto: "Para nomear objetos globalmente, a SMI usa um identificador de objeto, que consiste em um identificador hierárquico baseado em uma estrutura em árvore" },
            { tipo: "topico", titulo: "Definir o tipo de dado que pode ser armazenado dentro de um objeto", texto: "Para definir o tipo de dados, a SMI usa as definições da Notação Sintática Abstrata Um (ASN.1 – Abstract Syntax Notation One). Categorias de tipos de dados: simples e estruturada." },
            { tipo: "topico", titulo: "Mostrar como codificar dados para transmissão através da rede", texto: "" },
            { tipo: "subtitulo", texto: "Tipos de dados simples" },
            { tipo: "tabela", titulo: "Tabela 9.1 Tipos de dados. Fonte: Forouzan e Mosharraf (2013, p. 704)", colunas: ["Tipo", "Tamanho", "Descrição"], linhas: [
              ["INTEGER", "4 bytes", "Um inteiro com valor entre –2^31 e 2^31 –1"],
              ["Integer32", "4 bytes", "Igual ao INTEGER"],
              ["Unsigned32", "4 bytes", "Inteiro sem sinal com valor entre 0 e 2^32 –1"],
              ["OCTET STRING", "Variável", "Sequência de bytes com até 65.535 bytes de comprimento"],
              ["OBJECT IDENTIFIER", "Variável", "Um identificador de objeto"],
              ["IPAddress", "4 bytes", "Um endereço IP composto por quatro inteiros"],
              ["Counter32", "4 bytes", "Um contador na forma de um inteiro cujo valor pode ser incrementado de zero até 2^32; quando ele atinge seu valor máximo, volta a valer zero"],
              ["Counter64", "8 bytes", "Um contador de 64 bits, valendo de zero a 2^64"],
              ["Gauge32", "4 bytes", "Equivalente ao Counter32, mas quando ele atinge seu valor máximo, não retorna a zero; ele permanece nesse valor até ser reiniciado"],
              ["TimeTicks", "4 bytes", "Um valor de contagem incrementado em intervalos 1/100 segundos"],
              ["BITS", "Variável", "Uma sequência de bits"],
              ["Opaque", "Variável", "O tipo opaco consiste em uma sequência de bits não interpretada"]
            ] },
            { tipo: "subtitulo", texto: "Tipos de dados estruturados" },
            { tipo: "topico", titulo: "Sequência", texto: "um tipo de dados de sequência consiste em uma combinação de tipos de dados simples, não necessariamente do mesmo tipo." },
            { tipo: "topico", titulo: "Sequência de", texto: "um tipo de dados denominado “sequência de” é uma combinação de tipos de dados simples, todos do mesmo tipo." },
            { tipo: "subtitulo", texto: "Método de codificação" },
            { tipo: "lista", itens: [
              "Regras Básicas de Codificação (BER – Basic Encoding Rules), para codificar os dados a serem transmitidos pela rede.",
              "O BER especifica que cada dado seja codificado como uma tripla: rótulo, comprimento e valor (tag-length-value, ou TLV)."
            ] },
            { tipo: "imagem", src: "figura_9_formato_codificacao_ber.png", pasta: "imagens_redes2/aula_08", alt: "Formato da codificação BER: um bloco com três campos, Rótulo (um byte), Comprimento (um ou mais bytes) e Valor (tamanho variável); o campo Comprimento é detalhado: se o primeiro bit é 0, os demais bits indicam o comprimento do campo valor; se é 1, os demais bits indicam n, e os próximos n bytes definem o comprimento do campo valor.", num: 9 },
            { tipo: "texto", texto: "Fonte: Forouzan e Mosharraf (2013, p. 705)" },
            { tipo: "imagem", src: "figura_10_rotulo_comprimento_valor.png", pasta: "imagens_redes2/aula_08", alt: "Composição com chamadas: 'Rótulo é um campo de 1 byte que define o tipo dos dados' (com a tabela de rótulos), o formato Rótulo/Comprimento/Valor, a Tabela 9.1 (INTEGER e Integer32), o Exemplo 9.1 com os bytes 0x02, 0x04, 0x00, 0x00, 0x00, 0x0E e a chamada 'O campo de valor codifica o valor dos dados de acordo com as regras definidas no BER', junto da legenda 'Números em hexadecimal: 10 - A, 11 - B, 12 - C, 13 - D, 14 - E, 15 - F'.", num: 10 },
            { tipo: "texto", texto: "Rótulo é um campo de 1 byte que define o tipo dos dados." },
            { tipo: "tabela", titulo: "Rótulos dos tipos de dados. Fonte: Forouzan e Mosharraf (2013, p. 705)", colunas: ["Tipo de dado", "Rótulo (Hex)", "Tipo de dado", "Rótulo (Hex)"], linhas: [
              ["INTEGER", "02", "IPAddress", "40"],
              ["OCTET STRING", "04", "Counter", "41"],
              ["OBJECT IDENTIFIER", "06", "Gauge", "42"],
              ["NULL", "05", "TimeTicks", "43"],
              ["SEQUÊNCIA, SEQUÊNCIA DE", "30", "Opaque", "44"]
            ] },
            { tipo: "texto", texto: "O campo de valor codifica o valor dos dados de acordo com as regras definidas no BER." },
            { tipo: "exemplo", titulo: "Exemplo 9.1", texto: "A Figura 9.9 mostra como definir um inteiro (INTEGER) de valor 14. O tamanho do campo de comprimento é dado na Tabela 9.1. Bytes: 0x02 (Rótulo – INTEGER), 0x04 (Comprimento – 4 bytes), 0x00, 0x00, 0x00, 0x0E (Valor – 14)." },
            { tipo: "texto", texto: "Números em hexadecimal: 10 - A; 11 - B; 12 - C; 13 - D; 14 - E; 15 - F" }
          ]
        },
        {
          id: "mib",
          titulo: "Base de Informações de Gerenciamento (MIB)",
          blocos: [
            { tipo: "texto", texto: "A Base de Informações de Gerenciamento versão 2 (MIB2) é o segundo componente utilizado no gerenciamento de redes. Cada agente tem sua própria MIB2, que é uma coleção de todos os objetos que o gerente pode gerenciar." },
            { tipo: "texto", texto: "Os objetos na mib-2 são categorizados em vários grupos: sistema, interface, tradução de endereços, ip, icmp, tcp, udp, egp, transmissão e snmp (note que o grupo 9 é obsoleto). Esses grupos estão abaixo do objeto mib-2 na árvore de identificadores de objeto." },
            { tipo: "imagem", src: "figura_11_arvore_mib2.png", pasta: "imagens_redes2/aula_08", alt: "Duas árvores: a primeira, a árvore de identificadores de objeto (raiz, itu-t 0, iso 1, iso-itu-u 2, org 3, dod 6, internet 1 = 1.3.6.1, mgmt 2, mib-2 1 = 1.3.6.1.2.1). A segunda, abaixo de mib-2 (1.3.6.1.2.1), os grupos: sys 1, if 2, at 3, ip 4, icmp 5, tcp 6, udp 7, egp 8, trans 10 e snmp 11. Fontes: Forouzan e Mosharraf (2013, p. 703 e p. 707)", num: 11 },
            { tipo: "texto", texto: "Fonte: Forouzan e Mosharraf (2013, p. 703)" },
            { tipo: "texto", texto: "Fonte: Forouzan e Mosharraf (2013, p. 707)" },
            { tipo: "lista", itens: [
              "`sys` Objeto (system, ou sistema) que define informações gerais sobre o nó (sistema), como nome, localização e tempo de vida.",
              "`if` Objeto (interface) que define informações sobre todas as interfaces do nó, incluindo o número de interface, endereço físico e endereço IP.",
              "`at` Objeto (address translation, ou tradução de endereços) que define informações sobre a tabela ARP.",
              "`ip` Objeto que define informações relacionadas ao IP, como a tabela de roteamento e o endereço IP.",
              "`icmp` Objeto que define informações relacionadas ao ICMP, como o número de pacotes enviados e recebidos e o número total de erros criados.",
              "`tcp` Objeto que define informações gerais relacionadas ao TCP, como a tabela de conexões, o valor do tempo-limite, os números de portas e o número de pacotes enviados e recebidos.",
              "`udp` Objeto que define informações gerais relacionadas ao UDP, como os números de portas e o número de pacotes enviados e recebidos.",
              "`egp` Objetos relacionados à operação do EGP.",
              "`trans` Objetos relacionados ao método específico de transmissão (reservado para uso futuro).",
              "`snmp` Objeto que define informações gerais relacionadas ao próprio SNMP."
            ] },
            { tipo: "destaque", texto: "Obs: Uma tabela ARP (Protocolo de Resolução de Endereços) é um registro em uma rede local que armazena o mapeamento entre endereços IP e seus endereços MAC correspondentes. O Exterior Gateway Protocol (EGP) é um protocolo de roteamento utilizado para trocar informações de acessibilidade de rede entre diferentes sistemas autônomos (SAs) na internet. ICMP (Protocolo de Mensagens de Controle da Internet) é um protocolo de rede usado para enviar mensagens de controle e de erro." },
            { tipo: "texto", texto: "Fonte: Forouzan e Mosharraf (2013, p. 707)" }
          ]
        },
        {
          id: "ferramentas_gerenciamento",
          titulo: "Ferramentas para o gerenciamento de Redes de Computadores",
          blocos: [
            { tipo: "destaque", texto: "Multimídia: Introdução ao Gerenciamento de Redes - parte 5 - Ferramentas de Monitoramento (vídeo)." },
            { tipo: "subtitulo", texto: "Ferramentas Populares" },
            { tipo: "lista", itens: [
              "Zabbix",
              "Nagios",
              "Cacti"
            ] }
          ]
        }
      ]
    },

   ],

};