/* =============================================
   NEXUS STUDY — res_poo.js
   Disciplina: Programação Orientada a Objetos
   ============================================= */

window.__nexusConteudo = {
  aulas: [

    /* ─────────────────────────────────────────
       AULA 01
    ───────────────────────────────────────── */
    {
      aula: "Aula 01 — Fundamentos da POO e Anatomia de Classes",
      ideia_central: "A POO surge como solução para a complexidade procedural, unificando dados e funções em unidades coesas chamadas objetos, organizados por atributos (estado) e métodos (comportamento).",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Paradigma POO** como evolução do modelo procedural",
                "**Objetos**: unificação de dados e funções em unidades coesas",
                "**Atributos**: representam o estado interno do objeto",
                "**Métodos**: representam o comportamento e serviços do objeto",
                "**Abstração**: isolar características essenciais para um contexto",
                "**Nomenclatura Java**: PascalCase para classes · camelCase para membros"
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
              titulo: "🔹 O Paradigma POO",
              texto: "A POO surge como solução para a **complexidade procedural**, unificando dados e funções em unidades coesas chamadas **objetos**. Em vez de separar dados de funções, o objeto encapsula tudo que precisa para funcionar de forma autônoma."
            },

            {
              tipo: "subtitulo",
              texto: "Anatomia de uma Classe"
            },

            {
              tipo: "topico",
              titulo: "📌 Atributos",
              lista: [
                "Representam o **estado interno** do objeto",
                "Respondem à pergunta: **o que o objeto conhece?**",
                "Ex: nome, idade, saldo — dados que descrevem o objeto"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Métodos",
              lista: [
                "Representam o **comportamento** ou serviços do objeto",
                "Respondem à pergunta: **o que o objeto faz?**",
                "Ex: depositar(), sacar(), calcularImposto()"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Princípios Fundamentais"
            },

            {
              tipo: "topico",
              titulo: "📌 Abstração",
              lista: [
                "Processo de isolar apenas as **características essenciais** para um contexto",
                "Ignora detalhes irrelevantes para **reduzir a carga cognitiva**",
                "Ex: para um sistema bancário, Pessoa tem nome e CPF — não importa sua cor de cabelo"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Nomenclatura Java",
              lista: [
                "**PascalCase** → nomes de classes: `ContaBancaria`, `ClienteVip`",
                "**camelCase** → atributos e métodos: `nomeCliente`, `calcularSaldo()`",
                "Convenção padronizada para **legibilidade e manutenção** do código"
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
              titulo: "Exemplo 1 — Objeto como unidade coesa",
              texto: "Uma classe `Carro` une atributos (modelo, cor, velocidade) com métodos (acelerar(), frear()).",
              detalhe: "👉 Dados + comportamento juntos → objeto autônomo"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Abstração",
              texto: "Para um sistema de RH, `Funcionario` precisa de salário e cargo — não de cor favorita.",
              detalhe: "👉 Abstrair = selecionar o que importa para o contexto"
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
                "**POO** = paradigma que une dados e funções em **objetos**",
                "**Atributos** = estado interno (o que o objeto conhece)",
                "**Métodos** = comportamento (o que o objeto faz)",
                "**Abstração** = isolar características essenciais, ignorar irrelevantes",
                "**PascalCase** para classes · **camelCase** para membros"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: Classe é o molde (forma); objeto é a instância criada a partir desse molde. Atributos definem estado; métodos definem comportamento."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 02
    ───────────────────────────────────────── */
    {
      aula: "Aula 02 — Sintaxe, Tipagem e Memória",
      ideia_central: "Java usa tipagem forte com declaração explícita de tipos; objetos residem no Heap enquanto referências vivem na Stack, e Strings são imutáveis gerenciadas em um pool especial.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Tipagem forte**: declaração obrigatória de tipos em Java",
                "**Tipos primitivos**: int, long, double, boolean, char",
                "**Inferência de tipo**: palavra-chave `var` (Java 10+)",
                "**Gestão de memória**: Stack (pilha) e Heap (monte)",
                "**Strings**: imutabilidade e String Pool",
                "**Comparação de Strings**: `.equals()` vs `==`"
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
              titulo: "🔹 Tipagem Forte",
              texto: "Java exige a **declaração explícita de tipos**. O compilador verifica os tipos em tempo de compilação, evitando erros em tempo de execução."
            },

            {
              tipo: "subtitulo",
              texto: "Tipos e Inferência"
            },

            {
              tipo: "topico",
              titulo: "📌 Tipos Primitivos",
              lista: [
                "**`int`** → números inteiros",
                "**`long`** → inteiros grandes",
                "**`double`** → números decimais",
                "**`boolean`** → verdadeiro ou falso",
                "**`char`** → um único caractere"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Inferência com `var`",
              lista: [
                "Disponível a partir do **Java 10**",
                "O compilador **deduz o tipo** com base no valor atribuído",
                "Ex: `var nome = \"João\"` → compilador infere `String`",
                "⚠️ Só funciona em variáveis locais com valor inicial"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Gestão de Memória"
            },

            {
              tipo: "topico",
              titulo: "📌 Stack (Pilha)",
              lista: [
                "Memória **rápida e organizada**",
                "Armazena **variáveis locais** e **referências** para objetos",
                "Gerenciada automaticamente — liberada ao sair do escopo"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Heap (Monte)",
              lista: [
                "Onde residem **todos os objetos** criados com `new`",
                "Gerenciado pelo **Garbage Collector**",
                "Acesso mais lento que a Stack"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Strings"
            },

            {
              tipo: "topico",
              titulo: "📌 Imutabilidade e String Pool",
              lista: [
                "Strings são **imutáveis** — não podem ser alteradas após criação",
                "Gerenciadas em um **String Pool** para reuso e eficiência de memória",
                "**`.equals()`** → compara o **conteúdo** das strings",
                "**`==`** → compara a **referência** (endereço de memória) — quase sempre errado para Strings"
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
              titulo: "Exemplo 1 — Stack vs Heap",
              texto: "`int x = 5` fica na Stack. `Pessoa p = new Pessoa()` — a referência `p` fica na Stack, o objeto vai para o Heap.",
              detalhe: "👉 Referência (Stack) aponta para o objeto real (Heap)"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Comparação de Strings",
              texto: "`\"abc\" == \"abc\"` pode retornar `false` se forem objetos diferentes. `\"abc\".equals(\"abc\")` sempre retorna `true`.",
              detalhe: "👉 Sempre use `.equals()` para comparar conteúdo de Strings"
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
                "**Tipagem forte**: tipos devem ser declarados explicitamente",
                "Primitivos: **int · long · double · boolean · char**",
                "**`var`** (Java 10+): compilador infere o tipo automaticamente",
                "**Stack**: variáveis locais e referências — memória rápida",
                "**Heap**: objetos criados com `new` — gerenciado pelo GC",
                "**Strings imutáveis** → use `.equals()` para comparar conteúdo, nunca `==`"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: Stack guarda referências; Heap guarda objetos. Strings vivem no String Pool e são imutáveis — compare conteúdo com .equals(), jamais com ==."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 03
    ───────────────────────────────────────── */
    {
      aula: "Aula 03 — Métodos e Comportamento",
      ideia_central: "Métodos encapsulam lógica reutilizável seguindo o princípio DRY; a passagem de parâmetros é sempre por valor em Java, e a sobrecarga permite múltiplas versões do mesmo método.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Princípio DRY**: não repetir lógica com uso de métodos",
                "**Passagem de parâmetros**: sempre por valor em Java",
                "**Comportamento com primitivos**: variável original não muda",
                "**Comportamento com objetos**: estado do objeto pode mudar via referência",
                "**Sobrecarga (Overloading)**: múltiplos métodos com mesmo nome"
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
              titulo: "🔹 Princípio DRY",
              texto: "**Don't Repeat Yourself** — métodos evitam a repetição de lógica. Se um bloco de código aparece mais de uma vez, ele deve virar um método. Facilita manutenção e reduz erros."
            },

            {
              tipo: "subtitulo",
              texto: "Passagem de Parâmetros"
            },

            {
              tipo: "topico",
              titulo: "📌 Sempre por Valor",
              lista: [
                "Java **sempre passa uma cópia** — nunca a variável original",
                "**Para primitivos**: a variável original **não é alterada**",
                "**Para objetos**: a cópia da referência permite **alterar o estado** do objeto original",
                "⚠️ Mesmo com objetos, a referência original não pode ser redirecionada"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Sobrecarga"
            },

            {
              tipo: "topico",
              titulo: "📌 Overloading",
              lista: [
                "Capacidade de definir **múltiplos métodos com o mesmo nome** na mesma classe",
                "Diferenciados pela **assinatura**: número, tipo ou ordem dos parâmetros",
                "O compilador escolhe o método correto automaticamente",
                "Ex: `calcular(int a)` e `calcular(double a, double b)`"
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
              titulo: "Exemplo 1 — Passagem por valor (primitivo)",
              texto: "`int x = 5; metodo(x);` — dentro do método, alterar o parâmetro não afeta `x` fora.",
              detalhe: "👉 Uma cópia do valor é passada — original intocável"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Passagem por valor (objeto)",
              texto: "`metodo(pessoa)` — o método recebe cópia da referência, mas pode chamar `pessoa.setNome()` e alterar o objeto real.",
              detalhe: "👉 A referência é copiada, mas o objeto no Heap é o mesmo"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Sobrecarga",
              texto: "`somar(int a, int b)` e `somar(double a, double b)` — mesmo nome, parâmetros diferentes.",
              detalhe: "👉 Compilador escolhe a versão correta conforme os argumentos passados"
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
                "**DRY**: evite repetição — use métodos para encapsular lógica reutilizável",
                "Passagem de parâmetros: **sempre por valor** (cópia)",
                "**Primitivos**: original não muda · **Objetos**: estado pode mudar via referência copiada",
                "**Overloading**: mesmo nome, assinaturas diferentes — compilador resolve automaticamente"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: Java passa tudo por valor. Para primitivos, o original nunca muda. Para objetos, a referência é copiada — mas o objeto no Heap pode ser modificado."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 04
    ───────────────────────────────────────── */
    {
      aula: "Aula 04 — Encapsulamento e Modificadores",
      ideia_central: "O encapsulamento protege o estado do objeto contra modificações externas imprevistas, controlando o acesso via modificadores public, private e protected, com getters e setters como guardiões.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Encapsulamento**: proteção do estado interno do objeto",
                "**Modificadores de acesso**: public · private · protected",
                "**Getters e Setters**: acesso controlado a atributos privados",
                "**Palavra-chave `this`**: referência à instância atual"
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
              titulo: "🔹 Encapsulamento",
              texto: "Protege o estado do objeto contra **modificações externas imprevistas e valores inválidos**. O objeto controla como seus dados podem ser lidos e alterados."
            },

            {
              tipo: "subtitulo",
              texto: "Modificadores de Acesso"
            },

            {
              tipo: "topico",
              titulo: "📌 `public`",
              lista: [
                "Acesso **total** por qualquer classe",
                "Usado em métodos da interface pública do objeto"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 `private`",
              lista: [
                "Acesso **apenas dentro da própria classe**",
                "Padrão recomendado para **atributos** — base do encapsulamento"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 `protected`",
              lista: [
                "Acesso pela **classe, subclasses e classes do mesmo pacote**",
                "Usado quando a herança precisa acessar membros da superclasse"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Getters, Setters e this"
            },

            {
              tipo: "topico",
              titulo: "📌 Getters e Setters",
              lista: [
                "Métodos **guardiões** que controlam leitura e escrita de atributos privados",
                "**Getter**: retorna o valor do atributo — `getNome()`",
                "**Setter**: valida e altera o valor — `setIdade(int idade)` pode rejeitar negativos",
                "Permitem adicionar **validação** sem expor o atributo diretamente"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Palavra-chave `this`",
              lista: [
                "Refere-se à **instância atual** do objeto",
                "Útil para **diferenciar atributos de variáveis locais** com mesmo nome",
                "Ex: `this.nome = nome` — `this.nome` é o atributo; `nome` é o parâmetro"
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
              titulo: "Exemplo 1 — Encapsulamento",
              texto: "Atributo `saldo` é `private`. Só pode ser alterado via `depositar()` ou `sacar()`, que validam o valor.",
              detalhe: "👉 Nenhum código externo coloca saldo negativo diretamente"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Setter com validação",
              texto: "`setIdade(int idade)` verifica se `idade > 0` antes de atribuir — impede valores inválidos.",
              detalhe: "👉 Setter é o guardião que protege a integridade do estado"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — `this`",
              texto: "No construtor: `this.nome = nome` — distingue o atributo da classe do parâmetro recebido.",
              detalhe: "👉 `this` elimina ambiguidade entre atributo e variável local"
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
                "**Encapsulamento** = proteger estado com atributos `private` + acesso via métodos",
                "**`public`** → qualquer classe · **`private`** → só a própria classe · **`protected`** → classe + subclasses + pacote",
                "**Getters/Setters** = acesso controlado com possibilidade de validação",
                "**`this`** = referência à instância atual — resolve ambiguidade de nomes"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: Encapsule sempre com private nos atributos. Use getters e setters para controlar o acesso e adicionar validação. `this` aponta para o próprio objeto."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 05
    ───────────────────────────────────────── */
    {
      aula: "Aula 05 — Construtores e Membros Estáticos",
      ideia_central: "Construtores garantem que objetos nasçam com estado válido; membros static pertencem à classe e não à instância, sendo compartilhados entre todos os objetos.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Construtores**: inicialização obrigatória com estado válido",
                "**Sintaxe**: mesmo nome da classe, sem tipo de retorno",
                "**Membros `static`**: pertencem à classe, não à instância",
                "**Variáveis estáticas**: compartilhadas entre todos os objetos",
                "**Métodos estáticos**: não acessam membros de instância diretamente"
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
              titulo: "🔹 Construtores",
              texto: "Métodos especiais que garantem que um objeto **nasça com um estado válido**. Executados automaticamente no momento do `new`. Devem ter o **mesmo nome da classe** e **não possuem tipo de retorno**."
            },

            {
              tipo: "topico",
              titulo: "📌 Características dos Construtores",
              lista: [
                "Mesmo nome da classe · Sem tipo de retorno (nem `void`)",
                "Podem ser sobrecarregados (**múltiplos construtores**)",
                "Se não definido, Java cria um **construtor padrão** vazio automaticamente",
                "Uso do `this()` para chamar outro construtor da mesma classe"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Membros Estáticos"
            },

            {
              tipo: "topico",
              titulo: "📌 `static` — O que significa?",
              lista: [
                "Pertencem à **classe (forma)** — não à instância (objeto)",
                "Existem **antes de qualquer objeto** ser criado",
                "Acessados diretamente pela classe: `NomeClasse.membro`"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Variáveis Estáticas",
              lista: [
                "**Compartilhadas** entre todos os objetos da classe",
                "Alterar em um objeto altera para todos",
                "Ex: contador de instâncias criadas"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Métodos Estáticos",
              lista: [
                "Não podem acessar **membros de instância** diretamente (sem `this`)",
                "Úteis para **utilitários** independentes de estado: `Math.sqrt()`, `Collections.sort()`",
                "Só acessam outros membros `static` da classe"
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
              titulo: "Exemplo 1 — Construtor",
              texto: "`new Conta(\"João\", 1000.0)` chama o construtor que inicializa titular e saldo — objeto nasce válido.",
              detalhe: "👉 Sem construtor adequado, objeto pode nascer com estado inconsistente"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Variável estática",
              texto: "`static int totalContas` é incrementado a cada `new Conta()` — todos os objetos compartilham esse contador.",
              detalhe: "👉 Variável da classe, não do objeto — uma única cópia para todos"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Método estático",
              texto: "`Math.sqrt(16)` não precisa de instância — é um utilitário puro da classe `Math`.",
              detalhe: "👉 Métodos estáticos são chamados na classe, não no objeto"
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
                "**Construtor** = mesmo nome da classe · sem retorno · garante estado válido no `new`",
                "Construtores podem ser **sobrecarregados** para diferentes formas de inicialização",
                "**`static`** = pertence à **classe**, não à instância",
                "**Variável estática** = compartilhada entre todos os objetos",
                "**Método estático** = não acessa membros de instância · útil para utilitários"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: Construtores garantem estado válido ao nascer. Membros static são da classe (não do objeto) e podem ser usados sem criar instância."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 06
    ───────────────────────────────────────── */
    {
      aula: "Aula 06 — Herança e Polimorfismo",
      ideia_central: "Herança permite reuso e especialização de classes via relação 'É-UM'; o polimorfismo permite que diferentes objetos respondam ao mesmo método de formas distintas, tornando o código flexível e extensível.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Herança (`extends`)**: relação É-UM e reuso de código",
                "**Herança simples**: Java não permite herança múltipla de classes",
                "**Sobrescrita (`@Override`)**: redefinição de método herdado",
                "**Palavra-chave `super`**: acesso à superclasse",
                "**Polimorfismo**: diferentes objetos, mesmo método, comportamentos distintos"
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
              titulo: "🔹 Herança",
              texto: "Relação **\"É-UM\"** que permite o reuso de código e a especialização de classes. A subclasse herda todos os membros públicos e protegidos da superclasse. Java **não permite herança múltipla** de classes."
            },

            {
              tipo: "topico",
              titulo: "📌 `extends`",
              lista: [
                "Palavra-chave para declarar herança: `class Cachorro extends Animal`",
                "Subclasse **herda** atributos e métodos da superclasse",
                "Subclasse pode **adicionar** novos membros e **sobrescrever** existentes"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Sobrescrita e super"
            },

            {
              tipo: "topico",
              titulo: "📌 `@Override`",
              lista: [
                "Anotação que indica **redefinição** de um método herdado",
                "Fornece comportamento **mais específico** na subclasse",
                "Compilador verifica se o método realmente existe na superclasse",
                "Ex: `Animal.emitirSom()` → `Cachorro.emitirSom()` retorna \"Au!\""
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Palavra-chave `super`",
              lista: [
                "Referencia o **construtor ou métodos da superclasse**",
                "**`super()`** → chama o construtor pai (deve ser a primeira instrução)",
                "**`super.metodo()`** → chama a versão do método na superclasse"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Polimorfismo"
            },

            {
              tipo: "topico",
              titulo: "🔹 Polimorfismo",
              lista: [
                "Capacidade de diferentes objetos **responderem ao mesmo método** de formas distintas",
                "Permite tratar **subclasses como sua classe base**",
                "Ex: `Animal a = new Cachorro()` → `a.emitirSom()` chama o método do Cachorro",
                "**Ligação dinâmica (late binding)**: Java decide qual método chamar em tempo de execução"
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
              titulo: "Exemplo 1 — Herança",
              texto: "`Funcionario` tem nome e salário. `Gerente extends Funcionario` herda tudo e adiciona `bonus`.",
              detalhe: "👉 Reutiliza código sem duplicar — especializa o que for necessário"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Polimorfismo",
              texto: "Lista de `Animal[]` com Cão, Gato e Pássaro — `animal.emitirSom()` chama o método correto de cada um.",
              detalhe: "👉 Mesmo método, comportamentos diferentes — código genérico e extensível"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — `super`",
              texto: "Construtor de `Gerente` chama `super(nome, salario)` para inicializar a parte `Funcionario` antes do bonus.",
              detalhe: "👉 super() reutiliza a inicialização já feita pela superclasse"
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
                "**Herança** (`extends`) = relação É-UM · reuso e especialização de código",
                "Java: **herança simples** apenas — sem múltipla herança de classes",
                "**`@Override`** = redefinição de método da superclasse na subclasse",
                "**`super`** = acessa construtor e métodos da superclasse",
                "**Polimorfismo** = mesmo método, diferentes comportamentos por ligação dinâmica"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: Herança é É-UM. Polimorfismo é 'mesmo método, comportamentos diferentes'. @Override redefine; super reutiliza. Java só permite herança simples."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 07
    ───────────────────────────────────────── */
    {
      aula: "Aula 07 — Abstração Avançada e Interfaces",
      ideia_central: "Classes abstratas são modelos incompletos que não podem ser instanciados; interfaces definem contratos de comportamento obrigatório e permitem que uma classe implemente múltiplos contratos simultaneamente.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Classes abstratas**: modelos que não podem ser instanciados",
                "**Métodos abstratos**: obrigam subclasses a implementar comportamento",
                "**Interfaces**: contratos de comportamentos obrigatórios",
                "**`implements`**: como uma classe assina um contrato",
                "**Múltiplas interfaces**: uma classe pode implementar várias",
                "**Desacoplamento**: vantagem das interfaces no design de software"
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
              titulo: "🔹 Classes Abstratas",
              texto: "**Modelos incompletos** que não podem ser instanciados diretamente. Servem como **base obrigatória** para outras classes, definindo estrutura comum e forçando implementação de comportamentos específicos."
            },

            {
              tipo: "topico",
              titulo: "📌 Características",
              lista: [
                "Declaradas com `abstract class`",
                "**Não podem ser instanciadas** com `new`",
                "Podem ter métodos concretos (com implementação) e abstratos (sem)",
                "**Método abstrato**: declarado sem corpo — subclasse obrigatoriamente implementa",
                "Ex: `abstract class Forma { abstract double calcularArea(); }`"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Interfaces"
            },

            {
              tipo: "topico",
              titulo: "📌 O que é uma Interface?",
              lista: [
                "Define **contratos de software** — comportamentos obrigatórios",
                "Declara métodos sem implementação (por padrão)",
                "Uma classe **implementa** com `implements`",
                "**Uma classe pode implementar múltiplas interfaces** — diferente da herança"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Vantagens das Interfaces",
              lista: [
                "**Desacoplamento**: código depende do contrato, não da implementação",
                "**Flexibilidade**: diferentes classes podem implementar o mesmo contrato",
                "**Testabilidade**: fácil substituição por mocks em testes",
                "Ex: `Pagavel`, `Serializavel`, `Comparavel` — comportamentos independentes"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Classe Abstrata vs Interface",
              lista: [
                "**Classe abstrata**: usa `extends` · uma só · pode ter estado e código concreto",
                "**Interface**: usa `implements` · múltiplas · define apenas contratos",
                "Use classe abstrata quando há **código e estado compartilhados**",
                "Use interface quando precisa de **múltiplos contratos independentes**"
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
              titulo: "Exemplo 1 — Classe Abstrata",
              texto: "`abstract class Animal` define `emitirSom()` abstrato. `Cachorro` e `Gato` obrigatoriamente implementam cada um do seu jeito.",
              detalhe: "👉 Animal não pode ser instanciado — é apenas o modelo base"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Interface",
              texto: "`class ContaBancaria implements Pagavel, Exportavel` — assina dois contratos diferentes.",
              detalhe: "👉 Múltiplos contratos com implements — impossível com extends"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — Desacoplamento",
              texto: "Código depende da interface `Repositorio`, não da classe `RepositorioSQL` — trocar para `RepositorioMongo` não quebra nada.",
              detalhe: "👉 Programa para a interface, não para a implementação"
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
                "**Classe abstrata** = modelo incompleto · não instanciável · base obrigatória",
                "**Método abstrato** = sem implementação · obriga subclasse a implementar",
                "**Interface** = contrato de comportamentos · usa `implements`",
                "**Múltiplas interfaces** permitidas · herança múltipla de classes não",
                "**Desacoplamento** = código depende do contrato, não da implementação concreta"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: Classe abstrata é base com código compartilhado (extends, uma só). Interface é contrato puro (implements, várias). Prefira interfaces para desacoplar."
            }
          ]
        }

      ]
    },

    /* ─────────────────────────────────────────
       AULA 08
    ───────────────────────────────────────── */
    {
      aula: "Aula 08 — Tratamento de Exceções",
      ideia_central: "Exceções são erros em tempo de execução tratados com try-catch-finally; checked exigem tratamento obrigatório em compilação, unchecked são erros de lógica, e throw/throws permitem lançar e declarar exceções.",
      secoes: [

        {
          id: "visao",
          titulo: "📖 Visão Geral",
          blocos: [
            {
              tipo: "lista",
              titulo: "A aula aborda:",
              itens: [
                "**Exceções**: erros em tempo de execução que interrompem o fluxo normal",
                "**Estrutura try-catch-finally**: captura e tratamento de falhas",
                "**Checked Exceptions**: verificadas na compilação — tratamento obrigatório",
                "**Unchecked Exceptions**: erros de lógica ou execução — não obrigatório tratar",
                "**`throw`**: lança uma exceção manualmente",
                "**`throws`**: declara na assinatura que o método pode gerar exceção"
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
              titulo: "🔹 O que são Exceções?",
              texto: "**Erros em tempo de execução** que interrompem o fluxo normal do programa. Java usa um mecanismo estruturado para capturar e tratar esses erros sem travar a aplicação."
            },

            {
              tipo: "subtitulo",
              texto: "Estrutura try-catch-finally"
            },

            {
              tipo: "topico",
              titulo: "📌 `try`",
              lista: [
                "Bloco que **envolve o código que pode gerar erro**",
                "Se uma exceção ocorrer, a execução pula para o `catch`"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 `catch`",
              lista: [
                "**Captura e trata** a exceção lançada",
                "Pode haver múltiplos `catch` para diferentes tipos de exceção",
                "Recebe o objeto de exceção com informações do erro"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 `finally`",
              lista: [
                "Bloco que **sempre executa** — com ou sem exceção",
                "**Ideal para fechar recursos**: conexões, arquivos, streams",
                "Garante limpeza independente de sucesso ou falha"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "Tipos de Exceção"
            },

            {
              tipo: "topico",
              titulo: "📌 Checked (Checadas)",
              lista: [
                "**Verificadas em tempo de compilação**",
                "O tratamento é **obrigatório** — compila só com try-catch ou throws",
                "Ex: `IOException`, `SQLException`"
              ]
            },

            {
              tipo: "topico",
              titulo: "📌 Unchecked (Não Checadas)",
              lista: [
                "**Erros de lógica** ou de execução — compilador não exige tratamento",
                "Indicam **bugs no código** que devem ser corrigidos",
                "Ex: `ArithmeticException` (divisão por zero), `NullPointerException`, `ArrayIndexOutOfBoundsException`"
              ]
            },

            {
              tipo: "subtitulo",
              texto: "throw e throws"
            },

            {
              tipo: "topico",
              titulo: "📌 `throw` vs `throws`",
              lista: [
                "**`throw`** → **dispara** uma exceção manualmente no código",
                "**`throws`** → **declara** na assinatura do método que ele pode lançar uma exceção",
                "Ex: `throw new IllegalArgumentException(\"Valor inválido\")` dentro do método",
                "Ex: `void salvar() throws IOException` na assinatura"
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
              titulo: "Exemplo 1 — try-catch-finally",
              texto: "Abrir arquivo com `try`, capturar `IOException` com `catch`, fechar o arquivo no `finally`.",
              detalhe: "👉 finally garante fechamento do arquivo mesmo se der erro"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 — Checked vs Unchecked",
              texto: "`IOException` (checked): compilador exige tratamento. `NullPointerException` (unchecked): indica bug — deve ser corrigido no código.",
              detalhe: "👉 Checked = tratar · Unchecked = corrigir o bug"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 — throw",
              texto: "Setter valida: `if (idade < 0) throw new IllegalArgumentException(\"Idade inválida\")` — lança exceção manualmente.",
              detalhe: "👉 throw força tratamento pelo chamador quando dados são inválidos"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 — throws",
              texto: "`void lerArquivo() throws IOException` avisa o chamador: este método pode lançar IOException — trate ou propague.",
              detalhe: "👉 throws delega a responsabilidade de tratamento para quem chama"
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
                "**Exceções** = erros em tempo de execução tratados estruturadamente",
                "**`try`** = código arriscado · **`catch`** = trata o erro · **`finally`** = sempre executa",
                "**Checked** = compilador exige tratamento · **Unchecked** = bugs de lógica",
                "**`throw`** = lança exceção manualmente · **`throws`** = declara na assinatura",
                "**`finally`** ideal para fechar recursos (arquivos, conexões, streams)"
              ]
            },
            {
              tipo: "destaque",
              texto: "📌 Ideia-chave para prova: try-catch-finally é a estrutura. Checked = obrigatório tratar (compilação). Unchecked = bug (corrigir). throw lança; throws declara."
            }
          ]
        }

      ]
    }

  ]
};