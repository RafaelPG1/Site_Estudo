/* =============================================
   NEXUS STUDY — res_redes.js
   Disciplina: Redes de Computadores I
   ============================================= */

window.__nexusConteudo = {
  aulas: [

    /* ─────────────────────────────────────────
       AULA 01/02
    ───────────────────────────────────────── */
    {
      aula: "Aula 01/02 — Introdução a Redes de Computadores",
      ideia_central: "Redes permitem compartilhar dados e recursos entre computadores autônomos interconectados, impactando empresas, pessoas e a sociedade.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Era da Informação** e convergência tecnológica no século XXI",
                "**Definição técnica** de redes de computadores e sistemas distribuídos",
                "**Aplicações comerciais e domésticas** das redes",
                "**Modelos de comunicação**: cliente-servidor, P2P, IoT",
                "**Hardware de rede**: classificação por tecnologia e escala (PAN, LAN, MAN, WAN)",
                "**Questões sociais e éticas** relacionadas às redes"
              ]
            }
          ]
        },

        {
          id: "conceitos",
          titulo: "🧠 Conceitos Principais",
          blocos: [

            {
              tipo: "topico",
              titulo: "🔹 Era da Informação",
              lista: [
                "Avanço do séc. XX: **Aquisição · Processamento · Armazenamento · Distribuição** de dados",
                "Séc. XXI: **convergência tecnológica** — integração total entre computação e comunicação",
                "Resultado: surgimento de redes globais e crescimento da indústria da informática"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 O que é uma Rede de Computadores?",
              texto: "Conjunto de computadores **autônomos** interconectados por uma tecnologia, capazes de trocar informações. A comunicação pode ocorrer via cabos (cobre), fibra óptica ou ondas eletromagnéticas (Wi-Fi, satélite)."
            },

            {
              tipo: "subtitulo",
              texto: "Redes vs Sistemas Distribuídos"
            },

            {
              tipo: "topico",
              titulo: "📌 Diferença Principal",
              lista: [
                "**Rede**: usuário vê várias máquinas distintas — baixa transparência",
                "**Sistema Distribuído**: usuário vê um único sistema — alta transparência",
                "**Middleware**: software que cria a ilusão de sistema único (obrigatório em sist. distribuídos)"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Aplicações e Modelos"
            },

            {
              tipo: "topico",
              titulo: "📌 Modelo Cliente-Servidor",
              lista: [
                "**Servidor** → fornece serviços ou dados",
                "**Cliente** → solicita serviços",
                "Comunicação baseada em requisições · Alta **escalabilidade**"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Comunicação Peer-to-Peer (P2P)",
              lista: [
                "Sem hierarquia fixa — todos podem ser cliente e servidor",
                "**Descentralização** · Compartilhamento direto",
                "Exemplos: BitTorrent, redes sociais"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Computação Ubíqua (IoT)",
              lista: [
                "Integração de dispositivos do cotidiano com a internet",
                "**Sensores inteligentes**: monitoramento em tempo real",
                "**RFID**: identifica objetos por radiofrequência — substitui códigos de barras",
                "Aplicações: segurança, saúde, monitoramento remoto"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Classificação por Escala"
            },

            {
              tipo: "topico",
              titulo: "📌 PAN → WAN",
              lista: [
                "**PAN** (~1 m): Bluetooth, RFID, smartcards — periféricos pessoais",
                "**LAN** (até 1 km): Ethernet/Wi-Fi, alta velocidade (100 Mbps–10 Gbps)",
                "**MAN** (~10 km): TV a cabo, WiMAX — cobertura urbana",
                "**WAN** (países/continentes): roteadores, backbone, sub-redes"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Lei de Metcalfe",
              texto: "O **valor de uma rede** cresce proporcionalmente ao **quadrado do número de usuários** — quanto mais pessoas conectadas, mais valiosa a rede se torna."
            },

            {
              tipo: "topico",
              titulo: "🔹 Questões Sociais e Éticas",
              lista: [
                "**Privacidade** → uso de cookies e rastreamento",
                "**Segurança** → Phishing (mensagens falsas), Vírus (malware autorreplicante), Botnets (redes de dispositivos infectados)",
                "**Neutralidade da rede** → debate sobre tratamento igual de dados",
                "**Anonimato vs Responsabilidade** → liberdade vs controle"
              ]
            }

          ]
        },

        {
          id: "metodos",
          titulo: "📊 Métodos e Princípios",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Tecnologias de Transmissão",
              lista: [
                "**Broadcast**: canal único compartilhado — todos recebem a mensagem",
                "**Unicast**: um transmissor para um receptor",
                "**Multicast**: um transmissor para um grupo",
                "**Ponto a Ponto**: conexão direta com roteamento — maior eficiência"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Comunicação Empresarial",
              lista: [
                "**VPN** → conecta redes separadas como se fossem uma só",
                "**VoIP** → ligações pela internet",
                "**Videoconferência** → comunicação visual em tempo real",
                "**E-commerce** → comércio eletrônico"
              ]
            }
          ]
        },

        {
          id: "exemplos",
          titulo: "💡 Exemplos Explicativos",
          blocos: [
            {
              tipo: "exemplo",
              titulo: "Exemplo 1 — Rede vs Sistema Distribuído",
              texto: "Numa rede, o usuário percebe que está acessando uma máquina remota.",
              detalhe: "👉 Ex: acesso via FTP a um servidor de arquivos"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Sistema Distribuído",
              texto: "O usuário interage como se fosse um único sistema, sem perceber os nós internos.",
              detalhe: "👉 Ex: Google Drive (vários servidores, uma interface)"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Lei de Metcalfe",
              texto: "Um telefone sozinho não tem utilidade; com 2 já há conexão; com milhões, o valor é imensurável.",
              detalhe: "👉 Valor ∝ n² de usuários"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — P2P",
              texto: "Compartilhamento de arquivos sem servidor central.",
              detalhe: "👉 Ex: BitTorrent — cada peer serve e consome ao mesmo tempo"
            }
          ]
        },

        {
          id: "resumo",
          titulo: "🧾 Resumo Final para Revisão Rápida",
          blocos: [
            {
              tipo: "lista",
              itens: [
                "**Rede**: computadores autônomos interconectados para trocar informações",
                "**Convergência tecnológica**: integração entre computação e comunicação",
                "Modelos: **cliente-servidor** (hierárquico) · **P2P** (descentralizado)",
                "Escala: **PAN → LAN → MAN → WAN**",
                "**Broadcast vs Ponto a Ponto**: formas de endereçamento na transmissão",
                "**RFID, IoT**: computação ubíqua — objetos conectados à internet",
                "Riscos: Phishing · Vírus · Botnets · Violação de privacidade"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: A internet é uma rede de redes — classificada por escala (PAN→WAN) e tecnologia (broadcast vs ponto a ponto)."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 03/04
    ───────────────────────────────────────── */
    {
      aula: "Aula 03/04 — Meios de Transmissão e Dispositivos de Rede",
      ideia_central: "A camada física é responsável por transmitir bits através de meios guiados (cabos) ou não guiados (sem fio), com diferentes dispositivos para encaminhar e conectar redes.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Camada física** e transmissão de bits (0 e 1)",
                "**Meios guiados**: fio de cobre e fibra óptica",
                "**Meios não guiados**: rádio, Wi-Fi, redes celulares e satélites",
                "**Dispositivos de rede**: modem, AP, switch, roteador, gateway",
                "**Modos de transmissão**: simplex, half-duplex e full-duplex",
                "**Modelos de referência** e arquitetura em camadas"
              ]
            }
          ]
        },

        {
          id: "conceitos",
          titulo: "🧠 Conceitos Principais",
          blocos: [

            {
              tipo: "topico",
              titulo: "🔹 Camada Física",
              lista: [
                "Responsável por transmitir **bits puros (0 e 1)** pelo meio de comunicação",
                "Trabalha com sinais elétricos ou ópticos · Não interpreta dados",
                "Elementos: representação digital (níveis de tensão) · interfaces mecânicas · transmissão bruta"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Meios Guiados (Com Fio)"
            },

            {
              tipo: "topico",
              titulo: "📌 Fio de Cobre",
              lista: [
                "Muito usado em LANs — tecnologia madura",
                "Limitação por **atenuação** (perda gradual de intensidade do sinal com a distância)",
                "**Ethernet clássica**: cabo compartilhado em broadcast",
                "**DSL**: usa linha telefônica para dados de internet"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Fibra Óptica",
              lista: [
                "Usa **luz** para transmitir dados — altíssima velocidade",
                "**FTTH** (Fiber to the Home): fibra diretamente na residência",
                "**Backbones de Internet**: conectam grandes redes globais",
                "✔ Imune a interferências eletromagnéticas · Baixíssima latência · Alta largura de banda (Mbps → Gbps)"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Meios Não Guiados (Sem Fio)"
            },

            {
              tipo: "topico",
              titulo: "📌 Rádio e Wi-Fi",
              lista: [
                "Usa **frequências de rádio** — comunicação compartilhada",
                "**Wi-Fi (IEEE 802.11)**: redes locais sem fio",
                "✔ Mobilidade e flexibilidade"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Satélites de Comunicação",
              lista: [
                "Comunicação via satélite em órbita — tipo **broadcast**",
                "Cobertura de grandes áreas geográficas",
                "Uso: regiões remotas e redes globais"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Dispositivos de Rede"
            },

            {
              tipo: "topico",
              titulo: "📌 Modem",
              lista: [
                "Converte **sinal digital ↔ analógico**",
                "**DSL**: usa linha telefônica · **Cabo**: usa rede de TV · **Dial-up**: conexão antiga (até 56 kbps)"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Access Point (AP)",
              lista: [
                "Atua como **estação-base Wi-Fi**",
                "Modo **Infraestrutura**: com AP central",
                "Modo **Ad hoc**: P2P direto, sem AP"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Switch (Camada 2)",
              lista: [
                "Encaminha pacotes para o **destino correto** usando endereço de destino",
                "Conexões ponto a ponto · Escalável"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Roteador (Camada 3)",
              lista: [
                "**Conecta redes diferentes** e escolhe o melhor caminho",
                "Usa tabelas de roteamento · Evita colisões",
                "Interliga LANs e WANs"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Gateway",
              lista: [
                "Conecta **redes incompatíveis**",
                "Realiza tradução de protocolos e conversão de hardware/software"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Modos de Transmissão"
            },

            {
              tipo: "topico",
              titulo: "🔹 Simplex (Unidirecional)",
              lista: [
                "Fluxo em **apenas um sentido** — receptor não responde",
                "Exemplos: teclado/mouse → PC · rádio/TV aberta · sensores de alarme"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Half-Duplex (Bidirecional Alternada)",
              lista: [
                "Dois sentidos, mas **apenas um de cada vez** — colisão se ambos transmitirem juntos",
                "Exemplos: walkie-talkie · Wi-Fi 802.11 · hubs de rede"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Full-Duplex (Bidirecional Simultânea)",
              lista: [
                "Dados nos dois sentidos **ao mesmo tempo** — modo mais eficiente",
                "Exemplos: telefonia celular · Ethernet (cabo) · videochamadas (Zoom/Meet)"
              ]
            }

          ]
        },

        {
          id: "metodos",
          titulo: "📊 Comparativo dos Modos de Transmissão",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Simplex vs Half-Duplex vs Full-Duplex",
              lista: [
                "**Simplex** → unidirecional · não simultâneo · baixa eficiência · ex: teclado",
                "**Half-Duplex** → bidirecional · alternado · eficiência média · ex: walkie-talkie",
                "**Full-Duplex** → bidirecional · simultâneo · alta eficiência · ex: smartphone"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Cobre vs Fibra",
              lista: [
                "**Cobre**: custo menor, atenuação maior, distância limitada",
                "**Fibra**: custo maior, imune a interferências, altíssima velocidade e distância"
              ]
            }
          ]
        },

        {
          id: "exemplos",
          titulo: "💡 Exemplos Explicativos",
          blocos: [
            {
              tipo: "exemplo",
              titulo: "Exemplo 1 — Simplex",
              texto: "A torre de TV transmite o sinal para todos os aparelhos — nenhum aparelho envia de volta.",
              detalhe: "👉 Unidirecional puro: transmissor fixo, receptor fixo"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Half-Duplex",
              texto: "No walkie-talkie, é preciso soltar o botão e dizer 'câmbio' para ouvir.",
              detalhe: "👉 Apenas um fala de cada vez — canal único compartilhado"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Full-Duplex",
              texto: "Em uma ligação telefônica, você fala e ouve ao mesmo tempo.",
              detalhe: "👉 Dois canais separados (TX e RX) simultâneos"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Switch vs Roteador",
              texto: "O switch conecta dispositivos dentro da mesma rede (LAN). O roteador interliga redes diferentes.",
              detalhe: "👉 Switch = camada 2 (endereço MAC) · Roteador = camada 3 (endereço IP)"
            }
          ]
        },

        {
          id: "resumo",
          titulo: "🧾 Resumo Final para Revisão Rápida",
          blocos: [
            {
              tipo: "lista",
              itens: [
                "**Camada física**: transmite bits puros — não interpreta dados",
                "**Meios guiados**: cobre (DSL, Ethernet) e fibra óptica (FTTH, backbone)",
                "**Meios não guiados**: rádio, Wi-Fi, celular, satélite",
                "Dispositivos: **Modem** (converte sinal) · **AP** (base Wi-Fi) · **Switch** (camada 2) · **Roteador** (camada 3) · **Gateway** (traduz protocolos)",
                "Modos: **Simplex** (1 direção) · **Half-Duplex** (alternado) · **Full-Duplex** (simultâneo)"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: A fibra óptica usa luz e é imune a interferências; o roteador (camada 3) conecta redes diferentes enquanto o switch (camada 2) opera dentro da mesma rede."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 05
    ───────────────────────────────────────── */
    {
      aula: "Aula 05 — Topologias de Rede e Métricas de Desempenho",
      ideia_central: "A topologia define como os dispositivos estão organizados; as métricas de desempenho (vazão, latência, QoS) determinam a qualidade da comunicação; padrões garantem interoperabilidade global.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Topologias de rede**: barramento, ponto a ponto, estrela, anel, árvore e malha",
                "**Métricas de desempenho**: vazão, atraso, congestionamento e QoS",
                "**Multiplexação estatística**: compartilhamento dinâmico de canal",
                "**Padronização**: ISO, IEEE, IETF e RFCs",
                "**Métricas de erro**: detecção, correção e retransmissão"
              ]
            }
          ]
        },

        {
          id: "conceitos",
          titulo: "🧠 Conceitos Principais",
          blocos: [

            {
              tipo: "topico",
              titulo: "🔹 O que é Topologia de Rede?",
              texto: "Define como os dispositivos (computadores, switches, roteadores) estão organizados **física e logicamente**. Impacta diretamente: escalabilidade, custo e tolerância a falhas."
            },

            {
              tipo: "subtitulo",
              texto: "Topologias"
            },

            {
              tipo: "topico",
              titulo: "📌 Barramento",
              lista: [
                "Todos compartilham **um único cabo central (backbone)**",
                "Comunicação em broadcast — só o destino processa",
                "⚠️ **Ponto único de falha** → se o cabo quebra, toda a rede cai",
                "Uso histórico: Ethernet antiga"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Ponto a Ponto",
              lista: [
                "Conexão direta entre **dois dispositivos apenas**",
                "Comunicação exclusiva (unicast) · Sem colisões",
                "Base das redes WAN (ex: redes SONET entre cidades)"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Estrela",
              lista: [
                "Todos conectados a um **nó central (switch)**",
                "✔ Isolamento de falhas · Fácil expansão",
                "Topologia mais usada em LANs modernas"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Anel",
              lista: [
                "Dispositivos formando um **circuito fechado**",
                "Dados circulam em um único sentido · Cada nó é um repetidor",
                "Usa **token** para controle de acesso · Latência previsível",
                "Ideal para sistemas de **tempo real**"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Árvore",
              lista: [
                "Estrutura **hierárquica** baseada na estrela",
                "Switches conectados em níveis (cascata)",
                "✔ Organização por setores (departamentos) · Permite segmentação",
                "⚠️ Muitos níveis → aumento da latência"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Malha (Mesh)",
              lista: [
                "Dispositivos com **múltiplas conexões redundantes**",
                "Dados podem seguir vários caminhos · Roteamento dinâmico",
                "✔ Alta disponibilidade · Base da Internet",
                "❌ Alto custo e complexidade"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Métricas de Desempenho"
            },

            {
              tipo: "topico",
              titulo: "🔹 Vazão (Throughput)",
              lista: [
                "Quantidade de dados transmitidos por unidade de tempo",
                "Unidades: Mbps (10⁶ bits/s) · Gbps (10⁹ bits/s)",
                "Redes cabeadas > redes sem fio (em desempenho geral)"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Atraso (Delay / Latência)",
              lista: [
                "Tempo que os dados levam para chegar ao destino",
                "**Atraso de propagação**: tempo no meio físico",
                "**Atraso de processamento**: tempo em roteadores",
                "Crítico para: jogos online · streaming · chamadas de vídeo"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Congestionamento e Perda de Dados",
              lista: [
                "Ocorre quando a rede não suporta o volume de tráfego",
                "**Gargalos**: caminhos sobrecarregados · **Buffers cheios**: descarte de pacotes",
                "Solução: sistemas reduzem envio automaticamente"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 QoS — Qualidade de Serviço",
              lista: [
                "Mecanismos que **priorizam determinados tipos de tráfego**",
                "**Jitter**: variação no tempo de atraso (medido em ms)",
                "Voz e vídeo precisam de **baixa latência** · Downloads precisam de **alta vazão**"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Multiplexação Estatística",
              lista: [
                "Compartilhamento **dinâmico** do canal de comunicação",
                "**Estática**: recursos fixos (ineficiente) · **Dinâmica**: uso sob demanda (eficiente)",
                "Evita desperdício de banda"
              ]
            }

          ]
        },

        {
          id: "metodos",
          titulo: "📊 Padronização de Redes",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Por que padronizar?",
              lista: [
                "Garante **interoperabilidade** entre dispositivos de fabricantes diferentes",
                "Permite **compatibilidade** e evolução tecnológica"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Principais Organizações",
              lista: [
                "**ISO** → criou o modelo OSI · Foco em modelos teóricos",
                "**IEEE** → hardware e redes locais: 802.3 (Ethernet) · 802.11 (Wi-Fi)",
                "**IETF** → define padrões da Internet via **RFCs** (documentos oficiais dos protocolos: TCP, IP)",
                "Desenvolvimento **aberto e colaborativo**"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Métricas de Erro (Confiabilidade)",
              lista: [
                "Transmissão pode sofrer: **ruído elétrico · alteração de bits**",
                "**Detecção de erros** → identifica falhas",
                "**Correção de erros** → recupera dados",
                "**Retransmissão** → reenvio quando necessário"
              ]
            }
          ]
        },

        {
          id: "exemplos",
          titulo: "💡 Exemplos Explicativos",
          blocos: [
            {
              tipo: "exemplo",
              titulo: "Exemplo 1 — Topologia Estrela",
              texto: "Se um cabo de um computador quebra, apenas aquele PC perde conexão.",
              detalhe: "👉 Isolamento de falhas — os outros continuam funcionando normalmente"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Topologia Malha (Internet)",
              texto: "Se um roteador cai, os pacotes encontram outro caminho automaticamente.",
              detalhe: "👉 Redundância de caminhos = alta disponibilidade"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — QoS na Prática",
              texto: "Em uma videoconferência, a voz é priorizada sobre um download em andamento.",
              detalhe: "👉 QoS garante baixa latência para tráfego crítico"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — Jitter",
              texto: "Pacotes de áudio chegam com atrasos variáveis, causando 'engasgos' na voz.",
              detalhe: "👉 Jitter alto = variação de latência = má qualidade em VoIP"
            }
          ]
        },

        {
          id: "resumo",
          titulo: "🧾 Resumo Final para Revisão Rápida",
          blocos: [
            {
              tipo: "lista",
              itens: [
                "**Topologias** definem estrutura da rede: Barramento · Estrela · Anel · Árvore · Malha",
                "**Estrela**: mais usada em LANs — isolamento de falhas e fácil expansão",
                "**Malha**: base da Internet — alta disponibilidade com múltiplos caminhos",
                "**Vazão + Latência + Congestionamento** = métricas chave de desempenho",
                "**QoS**: prioriza voz/vídeo (baixa latência) sobre downloads (alta vazão)",
                "**Padronização**: ISO (OSI) · IEEE (Ethernet/Wi-Fi) · IETF (TCP/IP via RFCs)"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: A topologia malha é a mais resiliente (base da internet), mas a mais cara. A estrela é a mais usada em LANs por isolar falhas."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 06
    ───────────────────────────────────────── */
    {
      aula: "Aula 06 — Representação de Dados e Deficiências na Transmissão",
      ideia_central: "Todo tipo de informação (texto, imagem, áudio, vídeo) é convertido em bits (0 e 1) para ser transmitido, mas sinais podem sofrer atenuação, distorção e ruído durante o percurso.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Representação de dados**: como texto, imagem, áudio e vídeo viram bits",
                "**Codificação de texto**: ASCII (7 bits) e Unicode (até 32 bits)",
                "**Digitalização de imagens**: pixels, resolução, RGB e profundidade de cor",
                "**Áudio e vídeo**: amostragem e taxa de quadros (FPS)",
                "**Fluxo de dados**: simplex, half-duplex e full-duplex",
                "**Deficiências na transmissão**: atenuação, distorção, ruído e SNR"
              ]
            }
          ]
        },

        {
          id: "conceitos",
          titulo: "🧠 Conceitos Principais",
          blocos: [

            {
              tipo: "topico",
              titulo: "🔹 Representação Digital",
              texto: "Toda informação é convertida em **bits (0 e 1)**. Computadores trabalham apenas com dois estados: **ligado (1)** e **desligado (0)**. Isso permite transmitir texto, imagem, áudio e vídeo no mesmo sistema."
            },

            {
              tipo: "subtitulo",
              texto: "Codificação de Dados"
            },

            {
              tipo: "topico",
              titulo: "📌 Texto",
              lista: [
                "**ASCII**: 7 bits → 128 símbolos (letras, números, caracteres básicos)",
                "**Unicode**: até 32 bits → suporta praticamente todos os idiomas do mundo",
                "Números são convertidos diretamente para binário · Ex: 6 → **110**"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Imagens",
              lista: [
                "Representadas por uma **matriz de pixels**",
                "**Pixel**: menor unidade da imagem — define a resolução",
                "**Monocromático**: 1 bit por pixel (preto ou branco)",
                "**Colorido**: sistema **RGB** — combinação de vermelho, verde e azul",
                "**Profundidade de cor**: número de bits por pixel — define a quantidade de cores possíveis"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Áudio",
              lista: [
                "Sinal contínuo (analógico) que precisa ser convertido para digital",
                "Processo: Captura (analógico) → **Amostragem** → Conversão para binário",
                "Cada amostra representa o valor do som em um instante de tempo"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Vídeo",
              lista: [
                "Sequência de imagens (**frames**) reproduzidas em alta velocidade",
                "**24 FPS** → Cinema · **30 FPS** → TV · **60 FPS** → Alta fluidez"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Deficiências na Transmissão"
            },

            {
              tipo: "topico",
              titulo: "🔹 Atenuação",
              lista: [
                "**Perda de energia do sinal** ao longo do meio físico",
                "Solução: uso de **amplificadores** no percurso"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Distorção",
              lista: [
                "**Alteração na forma do sinal**",
                "Ocorre quando diferentes frequências chegam em tempos diferentes"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 Ruído",
              lista: [
                "**Interferência externa** que altera o sinal",
                "Tipos: **Térmico** · **Induzido** · **Crosstalk** · **Impulso**"
              ]
            },

            {
              tipo: "topico",
              titulo: "🔹 SNR — Relação Sinal-Ruído",
              lista: [
                "Define a **qualidade da comunicação**",
                "**SNR Alta** → sinal limpo, boa qualidade",
                "**SNR Baixa** → sinal distorcido, má qualidade"
              ]
            }

          ]
        },

        {
          id: "metodos",
          titulo: "📊 Métodos e Princípios",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Analogia: Alfabeto de Dois Símbolos",
              lista: [
                "Toda informação pode ser reduzida a **dois estados: 0 e 1**",
                "Analogia: **piscar de lanterna** — padrões de piscadas formam mensagens",
                "**Unificação**: todos os dados viram bits · **Eficiência**: permite compressão de dados"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Fluxo de Dados",
              lista: [
                "**Simplex** → uma direção, não simultâneo",
                "**Half-Duplex** → duas direções, alternado (não simultâneo)",
                "**Full-Duplex** → duas direções, simultâneo"
              ]
            }
          ]
        },

        {
          id: "exemplos",
          titulo: "💡 Exemplos Explicativos",
          blocos: [
            {
              tipo: "exemplo",
              titulo: "Exemplo 1 — ASCII vs Unicode",
              texto: "ASCII representa 'A' com 7 bits (1000001). Unicode representa caracteres como 'ã' ou emojis que o ASCII não suporta.",
              detalhe: "👉 Unicode = extensão internacional do ASCII"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Pixel e Resolução",
              texto: "Uma imagem 1920×1080 possui mais de 2 milhões de pixels — quanto mais pixels, mais detalhe e mais dados.",
              detalhe: "👉 Resolução maior = arquivo maior = mais bits"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Atenuação",
              texto: "Um sinal Wi-Fi perde força conforme a distância do roteador aumenta.",
              detalhe: "👉 Atenuação: energia diminui com a distância — solução: amplificadores ou repetidores"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — SNR",
              texto: "Uma ligação com muito chiado possui baixo SNR — o ruído é quase tão intenso quanto a voz.",
              detalhe: "👉 SNR alta = comunicação limpa · SNR baixa = comunicação degradada"
            }
          ]
        },

        {
          id: "resumo",
          titulo: "🧾 Resumo Final para Revisão Rápida",
          blocos: [
            {
              tipo: "lista",
              itens: [
                "**Toda informação → bits**: texto (ASCII/Unicode) · imagem (pixels/RGB) · áudio (amostras) · vídeo (frames)",
                "**ASCII**: 7 bits, 128 símbolos · **Unicode**: até 32 bits, todos os idiomas",
                "**Pixel**: menor unidade da imagem — define resolução e profundidade de cor (RGB)",
                "**Amostragem**: conversão de sinal analógico (áudio) para digital",
                "**Atenuação** (perda de energia) · **Distorção** (forma alterada) · **Ruído** (interferência externa)",
                "**SNR alta** = boa qualidade · **SNR baixa** = sinal degradado"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: Toda informação digital são apenas bits. Os três inimigos da transmissão são atenuação, distorção e ruído — combatidos com amplificadores, equalização e SNR adequada."
            }
          ]
        }

      ]
    }

  ],

professor: [
    {
      aula: "Resumo do Professor",
      ideia_central: "Conexões essenciais entre os conceitos de redes — nível prova.",
      secoes: [

        {
          id: "modelos-conceitos",
          titulo: "1️⃣ Modelos e Conceitos Gerais",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Protocolos (visão aprofundada)",
              lista: [
                "Protocolos definem 3 pilares: **Sintaxe** → formato dos dados · **Semântica** → significado dos campos · **Temporização** → ordem e controle de envio",
                "No `TCP`: numeração de sequência · confirmação (`ACK`) · controle de fluxo",
                "**Insight prova**: dois dispositivos podem estar conectados fisicamente e ainda assim não se comunicar se não compartilharem o mesmo protocolo"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Encapsulamento (nível detalhado)",
              lista: [
                "Cada camada adiciona **Header** (cabeçalho) → controle · e às vezes **Trailer** → verificação de erro",
                "**Aplicação** → Dados · **Transporte** → [TCP/UDP + porta] · **Rede** → [IP origem/destino] · **Enlace** → [MAC origem/destino + FCS] · **Física** → Bits",
                "**Detalhe prova**: o endereço **IP muda a cada rede** · o **MAC muda a cada salto** (hop)"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 PDU por camada",
              lista: [
                "**Física** → Bits → Sinal elétrico/luz",
                "**Enlace** → Frame → Comunicação local",
                "**Rede** → Pacote → Roteamento",
                "**Transporte** → Segmento → Controle fim a fim",
                "**Pegadinha**: UDP também usa 'datagrama' · `TCP` ≠ `UDP` (confiabilidade vs velocidade)"
              ]
            }
          ]
        },

        {
          id: "endereçamento",
          titulo: "2️⃣ Endereçamento",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 IPv4 vs IPv6",
              lista: [
                "**IPv4**: escassez de IPs · usa **NAT** → vários dispositivos compartilham 1 IP público (muito usado em roteadores domésticos)",
                "**IPv6**: elimina NAT · melhor desempenho em roteamento · suporte nativo a segurança (`IPsec`)",
                "**IPv4** → Decimal · Broadcast · NAT necessário",
                "**IPv6** → Hexadecimal · Multicast · NAT desnecessário"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 IP vs MAC",
              lista: [
                "**IP** → Lógico, mutável → **localização** (onde está)",
                "**MAC** → Físico, fixo → **identidade** (quem é)"
              ]
            }
          ]
        },

        {
          id: "arquiteturas",
          titulo: "3️⃣ Arquiteturas de Rede",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Cliente-Servidor",
              lista: [
                "**Centralização** → controle maior · escalabilidade limitada",
                "Problema: **ponto único de falha**"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 P2P (nível avançado)",
              lista: [
                "Cada nó **contribui com recursos** — quanto mais usuários → mais rápido (ex: torrent)",
                "Problemas: **segurança** e **controle de dados**"
              ]
            }
          ]
        },

        {
          id: "comutacao",
          titulo: "4️⃣ Comutação",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Pacotes (Internet)",
              lista: [
                "Não há caminho fixo — roteadores **decidem dinamicamente**",
                "Pode ter: **atraso · perda · desordem**",
                "Solução: `TCP` reorganiza os dados"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Circuito",
              lista: [
                "3 fases: **Estabelecimento → Transmissão → Encerramento**",
                "**Latência inicial alta** → depois fluxo contínuo"
              ]
            }
          ]
        },

        {
          id: "metricas",
          titulo: "5️⃣ Métricas (ESSENCIAL PRA PROVA)",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Latência (Delay)",
              lista: [
                "Tempo total composto por: **processamento · fila · transmissão · propagação**"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Jitter",
              lista: [
                "**Jitter** = variação da latência",
                "Afeta: chamadas e vídeos"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Bandwidth vs Throughput",
              lista: [
                "**Throughput = Bandwidth – perdas**",
                "Perdas causadas por: congestionamento · erro · retransmissão"
              ]
            }
          ]
        },

        {
          id: "dispositivos",
          titulo: "6️⃣ Dispositivos de Rede",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Switch",
              lista: [
                "Tabela **MAC (CAM Table)** — aprende automaticamente",
                "Inteligente: envia **só para o destino correto**"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Roteador",
              lista: [
                "Usa **tabela de roteamento** — escolhe melhor caminho",
                "Pode usar: `RIP` · `OSPF` · `BGP` (Internet)"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Extras importantes",
              lista: [
                "**Hub** → obsoleto, gera colisão",
                "**AP (Wi-Fi)** → conecta rede sem fio",
                "**Firewall** → segurança",
                "**Gateway** → traduz redes diferentes"
              ]
            }
          ]
        },

        {
          id: "transmissao-topologias",
          titulo: "7️⃣ Modos de Transmissão e Topologias",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Modos de Transmissão",
              lista: [
                "**Simplex** → TV",
                "**Half-Duplex** → Rádio",
                "**Full-Duplex** → Internet moderna"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Topologias",
              lista: [
                "**Estrela** (mais usada) → fácil manutenção · depende do switch",
                "**Malha (Mesh)** → alta confiabilidade · usada em backbone e redes críticas"
              ]
            }
          ]
        },

        {
          id: "meios-transmissao",
          titulo: "8️⃣ Meios de Transmissão",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Guiados",
              lista: [
                "**Par trançado** → barato",
                "**Coaxial** → TV",
                "**Fibra** → alta performance"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Fibra Óptica",
              lista: [
                "**Monomodo** → longa distância · **Multimodo** → curta distância",
                "Não sofre interferência · altíssima velocidade"
              ]
            },
            {
              tipo: "topico",
              titulo: "🔹 Não Guiados",
              lista: [
                "Exemplos: **Wi-Fi · Bluetooth · Satélite**",
                "Problemas: interferência · segurança"
              ]
            }
          ]
        },

        {
          id: "conexoes-macete",
          titulo: "🔗 Conexões Importantes + Macete Final",
          blocos: [
            {
              tipo: "topico",
              titulo: "🔹 Conexões para prova",
              lista: [
                "**Encapsulamento** → permite comunicação entre camadas",
                "`TCP` → resolve problemas da comutação de pacotes",
                "**IPv6** → resolve limitação do IPv4",
                "**Switch (MAC) + Roteador (IP)** → funcionamento da internet",
                "**Jitter + Latência** → qualidade de rede"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 **MAC** → local (LAN) · **IP** → global (Internet) · **`TCP`** → confiável · **`UDP`** → rápido · **Fibra** → melhor meio · **Pacotes** → Internet"
            }
          ]
        }

      ]
    }
  ]

};