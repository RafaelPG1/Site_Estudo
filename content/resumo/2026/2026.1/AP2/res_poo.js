window.__nexusConteudo = {

  aulas: [

    // Aula 12 — Introdução ao JavaFX
    {
      aula: "Aula 12 — Introdução ao JavaFX",
      professor: "Bruno",
      ideia_central: "JavaFX permite criar interfaces modernas e organizadas, aplicando conceitos de POO com separação clara entre interface, lógica e dados.",
      secoes: [
        {
          id: "visao",
          titulo: "🧭 Visão Geral do Conteúdo",
          blocos: [
            {
              tipo: "texto",
              texto: "A aula apresenta o **JavaFX**, um framework moderno para construção de interfaces gráficas em Java, destacando sua estrutura, funcionamento e boas práticas."
            },
            {
              tipo: "lista",
              titulo: "Principais pontos abordados:",
              itens: [
                "O que é **JavaFX** e sua importância",
                "Estrutura básica: **Stage, Scene e Nodes**",
                "Organização de interface com **layouts**",
                "Arquitetura **MVC**",
                "Uso de **FXML**",
                "Tratamento de **eventos**",
                "Aplicação de conceitos de **Programação Orientada a Objetos (POO)**"
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
              titulo: "O que é JavaFX",
              lista: [
                "Framework moderno para criação de **interfaces gráficas (GUI) em Java**",
                "Substituto mais atual do **Swing**",
                "Permite criar aplicações **interativas e visualmente atraentes**",
                "Suporte a **CSS** → estilização",
                "Suporte a **FXML** → separação entre interface e lógica"
              ]
            },
            {
              tipo: "destaque",
              texto: "JavaFX combina **interface moderna + organização + princípios de POO**"
            },
            {
              tipo: "topico",
              titulo: "Estrutura Básica do JavaFX",
              texto: "A aplicação é composta por 3 elementos principais: **Stage** (janela principal), **Scene** (conteúdo da janela) e **Nodes** (elementos visuais).",
              lista: [
                "**Stage** → janela principal",
                "**Scene** → conteúdo da janela",
                "**Nodes** → elementos visuais"
              ]
            },
            {
              tipo: "subtitulo",
              texto: "Hierarquia: Stage → Scene → Nodes"
            },
            {
              tipo: "topico",
              titulo: "Stage (Janela)",
              lista: [
                "Representa a **janela da aplicação**",
                "Pode ter: título, tamanho e ícone",
                "Só pode ter **uma Scene ativa por vez**",
                "Exemplos: tela de login, tela principal, alertas"
              ]
            },
            {
              tipo: "topico",
              titulo: "Scene (Conteúdo)",
              lista: [
                "Área onde os elementos são exibidos",
                "Define o **tamanho da interface**",
                "Pode ser **trocada dinamicamente**",
                "Exemplos: formulários, listagens, configurações"
              ]
            },
            {
              tipo: "topico",
              titulo: "Nodes (Componentes)",
              lista: [
                "Tudo que aparece na tela é um **Node**",
                "Exemplos: `Button`, `Label`, `TextField`, `ImageView`",
                "Todos herdam da classe **Node**"
              ]
            },
            {
              tipo: "topico",
              titulo: "Layouts",
              texto: "Organizam automaticamente os elementos na tela.",
              lista: [
                "**VBox** → vertical",
                "**HBox** → horizontal",
                "**BorderPane** → 5 regiões",
                "**GridPane** → tabela"
              ]
            },
            {
              tipo: "destaque",
              texto: "⚠️ Boa prática: Evitar posicionamento com coordenadas fixas (X, Y)"
            },
            {
              tipo: "topico",
              titulo: "Arquitetura MVC",
              texto: "Divide a aplicação em três camadas:",
              lista: [
                "**Model** → dados e regras",
                "**View** → interface gráfica",
                "**Controller** → controle das ações"
              ]
            },
            {
              tipo: "lista",
              titulo: "Vantagens do MVC:",
              itens: [
                "Melhor organização",
                "Baixo acoplamento",
                "Facilidade de manutenção e testes"
              ]
            },
            {
              tipo: "topico",
              titulo: "FXML",
              lista: [
                "Arquivo baseado em **XML**",
                "Define a interface gráfica",
                "Permite usar ferramentas visuais como o Scene Builder",
                "Vantagem: **separação entre design e código**"
              ]
            },
            {
              tipo: "topico",
              titulo: "Eventos",
              texto: "Permitem interação com o usuário. Exemplos: clique, digitação, seleção.",
              lista: [
                "No JavaFX, eventos usam **expressões lambda**"
              ]
            },
            {
              tipo: "topico",
              titulo: "JavaFX + POO",
              lista: [
                "Cada tela pode ser uma **classe**",
                "Componentes são **objetos**",
                "Usa: Herança, Encapsulamento e Polimorfismo",
                "Facilita aplicação de **SOLID**"
              ]
            }
          ]
        },
        {
          id: "metodos",
          titulo: "⚙️ Fórmulas e Métodos",
          blocos: [
            {
              tipo: "subtitulo",
              texto: "Estrutura básica de aplicação JavaFX"
            },
            {
              tipo: "topico",
              titulo: "Classe principal",
              codigo: `public class HelloFX extends Application {
    @Override
    public void start(Stage stage) {
        Label label = new Label("Olá, JavaFX!");
        Scene scene = new Scene(label, 300, 200);

        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}`
            },
            {
              tipo: "lista",
              titulo: "Fluxo de execução:",
              itens: [
                "`launch()` inicia a aplicação",
                "`start()` cria a interface",
                "`Stage` exibe a `Scene`"
              ]
            },
            {
              tipo: "subtitulo",
              texto: "Exemplo com Layout VBox"
            },
            {
              tipo: "topico",
              titulo: "Código VBox",
              codigo: `VBox layout = new VBox(15);
layout.setAlignment(Pos.CENTER);
layout.getChildren().addAll(
    new Label("Nome:"),
    new TextField(),
    new Button("Enviar")
);`
            },
            {
              tipo: "lista",
              titulo: "Resultado:",
              itens: [
                "Elementos organizados verticalmente",
                "Centralizados na tela"
              ]
            },
            {
              tipo: "subtitulo",
              texto: "Evento (ação de botão)"
            },
            {
              tipo: "topico",
              titulo: "Lambda de evento",
              codigo: `btn.setOnAction(e -> {
    System.out.println("Botão clicado!");
});`
            }
          ]
        },
        {
          id: "exemplos",
          titulo: "💡 Exemplos Explicativos",
          blocos: [
            {
              tipo: "exemplo",
              titulo: "Exemplo 1 – Hello World",
              texto: "Janela simples com um texto. Demonstra a estrutura básica do JavaFX."
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 – Formulário com VBox",
              texto: "Label + campo + botão organizados automaticamente de forma vertical."
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 – Evento de clique",
              texto: "Usuário clica → sistema responde. Demonstra o uso de expressões lambda para eventos."
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 – FXML",
              texto: "Interface definida em arquivo FXML, separada do código Java.",
              detalhe: `<VBox spacing="15" alignment="CENTER">
  <Label text="Login"/>
  <TextField promptText="Usuário"/>
  <PasswordField promptText="Senha"/>
  <Button text="Entrar" onAction="#handleLogin"/>
</VBox>`
            }
          ]
        },
        {
          id: "revisao",
          titulo: "🧾 Resumo Final para Revisão Rápida",
          blocos: [
            {
              tipo: "lista",
              titulo: "Pontos-chave:",
              itens: [
                "**JavaFX** → framework moderno para GUI em Java",
                "**Stage** → janela | **Scene** → conteúdo | **Nodes** → elementos",
                "**Layouts** → organizam automaticamente (VBox, HBox, BorderPane, GridPane)",
                "**MVC** → separa responsabilidades (Model, View, Controller)",
                "**FXML** → separa design do código",
                "**Eventos** → interação do usuário via expressões lambda",
                "**POO + JavaFX** → código organizado e escalável"
              ]
            },
            {
              tipo: "destaque",
              texto: "🎯 JavaFX permite criar interfaces modernas e organizadas, aplicando conceitos de POO com separação clara entre interface, lógica e dados."
            }
          ]
        }
      ]
    },

    //Aula 13 — JavaFX Avançado

    {
      aula: "Aula 13 — JavaFX Avançado",
      professor: "Bruno",
      ideia_central: "JavaFX avançado foca em separar interface, lógica e dados usando MVC, eventos e binding para criar aplicações organizadas, reativas e eficientes.",
      secoes: [
        {
          id: "visao",
          titulo: "🧭 Visão Geral do Conteúdo",
          blocos: [
            {
              tipo: "texto",
              texto: "A aula aprofunda o uso do **JavaFX**, focando na construção prática de aplicações organizadas e interativas, com ênfase na separação entre interface e lógica."
            },
            {
              tipo: "lista",
              titulo: "Principais objetivos:",
              itens: [
                "Entender o uso prático do **JavaFX**",
                "Separar **interface (View)** e **lógica (Controller)**",
                "Trabalhar com **eventos**",
                "Aplicar **Binding** (vinculação automática)",
                "Integrar com **Programação Orientada a Objetos (Model)**"
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
              titulo: "JavaFX",
              lista: [
                "Framework para criação de **interfaces gráficas em Java**",
                "Usado para aplicações **desktop**",
                "Baseado em **eventos**",
                "Permite interfaces modernas e interativas"
              ]
            },
            {
              tipo: "topico",
              titulo: "FXML",
              lista: [
                "Linguagem baseada em **XML**",
                "Define a **estrutura da interface**",
                "Não contém lógica de programação",
                "Funciona como o **HTML da aplicação**"
              ]
            },
            {
              tipo: "destaque",
              texto: "Vantagem do FXML: permite separar interface do código Java"
            },
            {
              tipo: "topico",
              titulo: "Controller",
              lista: [
                "Responsável por **controlar a interação**",
                "Recebe eventos",
                "Processa dados",
                "Atualiza a interface",
                "Papel central na comunicação entre interface e lógica"
              ]
            },
            {
              tipo: "topico",
              titulo: "Eventos",
              lista: [
                "Representam ações do usuário: clique, digitação",
                "São capturados pelo Controller"
              ]
            },
            {
              tipo: "subtitulo",
              texto: "Fluxo básico: Usuário → Evento → Sistema"
            },
            {
              tipo: "topico",
              titulo: "Binding",
              lista: [
                "Ligação automática entre **dados e interface**",
                "Atualiza valores automaticamente",
                "Reduz necessidade de código manual",
                "Menos código + atualização em tempo real"
              ]
            },
            {
              tipo: "topico",
              titulo: "Arquitetura MVC",
              texto: "Divide o sistema em três camadas:",
              lista: [
                "**Model** → dados",
                "**View** → interface (FXML)",
                "**Controller** → lógica"
              ]
            },
            {
              tipo: "subtitulo",
              texto: "Fluxo MVC: View → Controller → Model"
            },
            {
              tipo: "lista",
              titulo: "Vantagens do MVC:",
              itens: [
                "Organização",
                "Separação de responsabilidades",
                "Facilidade de manutenção"
              ]
            },
            {
              tipo: "topico",
              titulo: "Model",
              lista: [
                "Representa os **dados do sistema**",
                "Exemplo: classe `Usuario` com atributos e métodos",
                "Responsável pela lógica de dados"
              ]
            }
          ]
        },
        {
          id: "metodos",
          titulo: "⚙️ Métodos e Estrutura",
          blocos: [
            {
              tipo: "subtitulo",
              texto: "Estrutura do Projeto (MVC)"
            },
            {
              tipo: "topico",
              titulo: "Organização de pastas",
              codigo: `src/
 ├── Main.java
 ├── view/main.fxml
 ├── controller/MainController.java
 └── model/Usuario.java`
            },
            {
              tipo: "subtitulo",
              texto: "Classe Principal (Main.java)"
            },
            {
              tipo: "topico",
              titulo: "Carregando o FXML",
              codigo: `FXMLLoader loader = new FXMLLoader(
    getClass().getResource("/view/main.fxml")
);
Scene scene = new Scene(loader.load());
stage.setScene(scene);
stage.show();`
            },
            {
              tipo: "lista",
              titulo: "Função:",
              itens: [
                "Carrega o FXML",
                "Cria a cena",
                "Exibe a interface"
              ]
            },
            {
              tipo: "subtitulo",
              texto: "Exemplo de FXML"
            },
            {
              tipo: "topico",
              titulo: "Arquivo main.fxml",
              codigo: `<VBox spacing="10" alignment="CENTER"
      fx:controller="controller.MainController">
    <TextField fx:id="txtNome"/>
    <TextField fx:id="txtEmail"/>
    <Button text="Salvar" onAction="#salvar"/>
    <Label fx:id="lblMensagem"/>
</VBox>`
            },
            {
              tipo: "subtitulo",
              texto: "Controller (Lógica)"
            },
            {
              tipo: "topico",
              titulo: "MainController.java",
              codigo: `@FXML private TextField txtNome;
@FXML private Label lblMensagem;

@FXML
private void salvar() {
    String nome = txtNome.getText();
    if (nome.isEmpty()) {
        lblMensagem.setText("Erro!");
        return;
    }
    lblMensagem.setText("OK!");
}`
            },
            {
              tipo: "lista",
              titulo: "Responsável por:",
              itens: [
                "Validar dados",
                "Responder eventos"
              ]
            },
            {
              tipo: "subtitulo",
              texto: "Binding"
            },
            {
              tipo: "topico",
              titulo: "Vincular label ao campo de texto",
              codigo: `lblMensagem.textProperty()
    .bind(txtNome.textProperty());`
            },
            {
              tipo: "topico",
              titulo: "Desabilitar botão com Binding",
              codigo: `btnSalvar.disableProperty().bind(
    txtNome.textProperty().isEmpty()
);`
            },
            {
              tipo: "destaque",
              texto: "Botão desativa automaticamente se o campo estiver vazio — sem código manual adicional."
            },
            {
              tipo: "subtitulo",
              texto: "Classe Model"
            },
            {
              tipo: "topico",
              titulo: "Usuario.java",
              codigo: `public class Usuario {
    private String nome;

    public Usuario(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }
}`
            }
          ]
        },
        {
          id: "exemplos",
          titulo: "💡 Exemplos Explicativos",
          blocos: [
            {
              tipo: "exemplo",
              titulo: "Exemplo 1 – Sistema de Cadastro",
              texto: "Campos de nome e email + botão salvar que exibe mensagem de sucesso ou erro.",
              detalhe: "Demonstra integração completa: Interface + Controller + Model"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 2 – Validação de Campo",
              texto: "Se nome vazio → exibe erro. Se preenchido → exibe sucesso.",
              detalhe: "Mostra tratamento de eventos no Controller"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 3 – Binding",
              texto: "Label atualiza automaticamente conforme o usuário digita no campo.",
              detalhe: "Elimina código manual de atualização da interface"
            },
            {
              tipo: "exemplo",
              titulo: "Exemplo 4 – Botão Inteligente",
              texto: "Botão fica desabilitado enquanto o campo está vazio, habilitando automaticamente ao digitar.",
              detalhe: "Melhora a usabilidade sem lógica adicional no Controller"
            }
          ]
        },
        {
          id: "revisao",
          titulo: "🧾 Resumo Final para Revisão Rápida",
          blocos: [
            {
              tipo: "lista",
              titulo: "Pontos-chave:",
              itens: [
                "**JavaFX** → framework de interface gráfica baseado em eventos",
                "**FXML** → define interface (sem lógica)",
                "**Controller** → controla eventos e lógica",
                "**Model** → representa dados",
                "**MVC**: View → interface | Controller → controle | Model → dados",
                "**Eventos** → interação do usuário",
                "**Binding** → atualização automática",
                "**Boas práticas**: separar responsabilidades, validar dados, usar binding"
              ]
            },
            {
              tipo: "destaque",
              texto: "🎯 JavaFX avançado foca em separar interface, lógica e dados usando MVC, eventos e binding para criar aplicações organizadas, reativas e eficientes."
            }
          ]
        }
      ]
    },

    // Aula 15 - JSON + JavaFX
    {
      aula: "Aula 15 - JSON + JavaFX",
      professor: "Bruno",
      ideia_central: "Integrar persistência de dados em formato JSON com interfaces gráficas JavaFX, seguindo o padrão MVC com as camadas Model, DAO, View (FXML) e Controller.",
      secoes: [
        {
          id: "visao_geral",
          titulo: "Visão Geral do Conteúdo",
          blocos: [
            {
              tipo: "texto",
              texto: "A aula aborda a integração entre **persistência de dados**, **JSON** e **JavaFX** em aplicações Java. O objetivo é mostrar como salvar dados de objetos em arquivos, ler informações armazenadas, utilizar o formato JSON e conectar essa persistência com interfaces gráficas JavaFX."
            },
            {
              tipo: "lista",
              titulo: "Objetivos da aula",
              itens: [
                "Salvar dados de objetos em arquivos",
                "Ler informações previamente armazenadas",
                "Utilizar o formato JSON como meio de persistência",
                "Conectar a persistência de dados com interfaces gráficas JavaFX"
              ]
            },
            {
              tipo: "tabela",
              titulo: "Estrutura do projeto",
              colunas: ["Camada", "Responsabilidade"],
              linhas: [
                ["Model", "Representação dos dados"],
                ["DAO", "Manipulação do armazenamento"],
                ["View (FXML)", "Interface gráfica"],
                ["Controller", "Controle das ações da interface"]
              ]
            }
          ]
        },
        {
          id: "persistencia",
          titulo: "Persistência de Dados",
          blocos: [
            {
              tipo: "texto",
              texto: "**Persistência** é o processo de armazenar dados para uso posterior. Sem persistência, os dados existem apenas durante a execução do programa — ao fechar o sistema, todas as informações são perdidas."
            },
            {
              tipo: "destaque",
              texto: "Sem persistência, os dados são perdidos ao encerrar o programa. A persistência garante que as informações sobrevivam entre execuções."
            },
            {
              tipo: "tabela",
              titulo: "Formas comuns de persistência",
              colunas: ["Forma", "Descrição"],
              linhas: [
                ["Arquivos", "Dados armazenados em arquivos locais no sistema de arquivos"],
                ["Banco de dados", "Dados organizados em sistemas gerenciadores (SGBD)"],
                ["JSON", "Estrutura textual leve usada para armazenamento e transporte de dados"]
              ]
            }
          ]
        },
        {
          id: "json",
          titulo: "JSON (JavaScript Object Notation)",
          blocos: [
            {
              tipo: "texto",
              texto: "**JSON** (JavaScript Object Notation) é um formato textual usado para armazenar e transportar dados. É amplamente utilizado em APIs e aplicações modernas por ser leve, simples e legível por humanos."
            },
            {
              tipo: "lista",
              titulo: "Características do JSON",
              itens: [
                "Leve — ocupa pouco espaço",
                "Simples — fácil de escrever e entender",
                "Legível — texto puro, interpretável por humanos",
                "Muito utilizado em APIs e aplicações modernas"
              ]
            },
            {
              tipo: "topico",
              titulo: "Estrutura do JSON",
              lista: [
                "Baseado em pares **chave → valor**",
                "Suporta objetos (agrupamentos de pares chave-valor)",
                "Suporta listas (arrays de valores ou objetos)"
              ]
            },
            {
              tipo: "imagem",
              src: "fig_json_exemplo_usuario.png",
              alt: "Estrutura básica de um objeto JSON com pares chave-valor (nome e email)",
              pasta: "imagens_poo/aula_15",
              num: 1
            }
          ]
        },
        {
          id: "model",
          titulo: "Classe de Modelo (Model)",
          blocos: [
            {
              tipo: "texto",
              texto: "A classe `Usuario` representa uma entidade da aplicação. Sua única responsabilidade é **armazenar os dados do usuário**, sem conter lógica de interface ou lógica de persistência. Isso segue o princípio de separação de responsabilidades do padrão MVC."
            },
            {
              tipo: "lista",
              titulo: "Atributos da classe Usuario",
              itens: [
                "`nome` — nome do usuário",
                "`email` — email do usuário"
              ]
            },
            {
              tipo: "tabela",
              titulo: "Conceitos de POO envolvidos no Model",
              colunas: ["Conceito", "Explicação"],
              linhas: [
                ["Encapsulamento", "Atributos declarados como privados (private)"],
                ["Construtor", "Inicializa os dados do objeto no momento da criação"],
                ["Getters", "Permitem acesso controlado aos atributos privados"]
              ]
            },
            {
              tipo: "imagem",
              src: "fig_model_usuario_classe.png",
              alt: "Classe Usuario com atributos privados, construtor e getters",
              pasta: "imagens_poo/aula_15",
              num: 2
            }
          ]
        },
        {
          id: "dao",
          titulo: "DAO (Data Access Object)",
          blocos: [
            {
              tipo: "texto",
              texto: "O padrão **DAO** (Data Access Object) é utilizado para separar a lógica de negócio da persistência de dados. Toda operação de leitura, escrita, atualização e remoção de dados é centralizada no DAO, evitando que essas responsabilidades se misturem com o Controller ou o Model."
            },
            {
              tipo: "lista",
              titulo: "Responsabilidades do DAO",
              itens: [
                "Salvar dados",
                "Ler dados",
                "Atualizar dados",
                "Remover dados"
              ]
            },
            {
              tipo: "topico",
              titulo: "UsuarioDAO na aula",
              texto: "A classe `UsuarioDAO` é responsável por salvar os dados do usuário em formato JSON e também por realizar a leitura do arquivo JSON, reconstruindo o objeto `Usuario`."
            },
            {
              tipo: "destaque",
              texto: "O padrão DAO isola o acesso aos dados, facilitando futuras mudanças de tecnologia de persistência (ex: trocar arquivo JSON por banco de dados) sem afetar o restante da aplicação."
            }
          ]
        },
        {
          id: "salvamento_json",
          titulo: "Salvando Dados em JSON",
          blocos: [
            {
              tipo: "texto",
              texto: "O processo de salvamento converte um objeto Java em um arquivo JSON. Isso envolve criar um `JSONObject`, populá-lo com os dados do Model e gravá-lo em disco usando `FileWriter`."
            },
            {
              tipo: "lista",
              titulo: "Etapas do salvamento",
              itens: [
                "1. Criar um `JSONObject`",
                "2. Adicionar os dados com `put(chave, valor)`",
                "3. Converter para texto com `toJSONString()`",
                "4. Gravar no arquivo usando `FileWriter`"
              ]
            },
            {
              tipo: "tabela",
              titulo: "Elementos do processo de salvamento",
              colunas: ["Elemento", "Função"],
              linhas: [
                ["`JSONObject`", "Estrutura que representa o objeto JSON em memória"],
                ["`FileWriter`", "Responsável por escrever texto em um arquivo"],
                ["`put()`", "Adiciona pares chave-valor ao JSONObject"],
                ["`toJSONString()`", "Converte o JSONObject para texto no formato JSON"]
              ]
            },
            {
              tipo: "exemplo",
              titulo: "Fluxo de salvamento",
              texto: "Objeto Java → JSONObject → Arquivo JSON",
              detalhe: "O objeto Usuario é transformado em JSONObject, convertido para String JSON via toJSONString() e gravado no arquivo via FileWriter."
            },
            {
              tipo: "imagem",
              src: "fig_json_salvar_arquivo.png",
              alt: "Código de criação de JSONObject, adição de atributos com put() e gravação com FileWriter",
              pasta: "imagens_poo/aula_15",
              num: 3
            }
          ]
        },
        {
          id: "leitura_json",
          titulo: "Lendo Dados de JSON",
          blocos: [
            {
              tipo: "texto",
              texto: "A leitura realiza o caminho inverso do salvamento: o arquivo JSON é aberto, o conteúdo é interpretado pelo `JSONParser`, os valores são recuperados com `get()` e um novo objeto Java é reconstruído com esses dados."
            },
            {
              tipo: "lista",
              titulo: "Etapas da leitura",
              itens: [
                "1. Abrir o arquivo com `FileReader`",
                "2. Interpretar o conteúdo com `JSONParser`",
                "3. Recuperar valores com `get(chave)`",
                "4. Reconstruir o objeto Java (`Usuario`)"
              ]
            },
            {
              tipo: "tabela",
              titulo: "Elementos do processo de leitura",
              colunas: ["Elemento", "Função"],
              linhas: [
                ["`FileReader`", "Abre e lê o conteúdo do arquivo em disco"],
                ["`JSONParser`", "Interpreta o texto JSON e converte em estrutura navegável"],
                ["`get()`", "Recupera valores pelo nome da chave no JSONObject"]
              ]
            },
            {
              tipo: "exemplo",
              titulo: "Fluxo de leitura",
              texto: "Arquivo JSON → JSONParser → Objeto Java",
              detalhe: "O FileReader lê o arquivo, o JSONParser interpreta o conteúdo, os valores são obtidos via get() e um novo objeto Usuario é criado."
            },
            {
              tipo: "imagem",
              src: "fig_json_leitura_arquivo.png",
              alt: "Código de leitura do arquivo JSON com FileReader e JSONParser, extração via get() e reconstrução do Usuario",
              pasta: "imagens_poo/aula_15",
              num: 4
            }
          ]
        },
        {
          id: "javafx",
          titulo: "JavaFX e FXML",
          blocos: [
            {
              tipo: "texto",
              texto: "**JavaFX** é um framework para criação de interfaces gráficas em Java. Permite construir janelas, formulários e interações com o usuário por meio de componentes visuais como campos de texto, botões e labels."
            },
            {
              tipo: "texto",
              texto: "**FXML** é uma linguagem baseada em XML usada para definir a interface gráfica JavaFX de forma declarativa. Ela separa a estrutura da tela (FXML) da lógica de comportamento (Controller), facilitando manutenção e organização."
            },
            {
              tipo: "lista",
              titulo: "Vantagens do FXML",
              itens: [
                "Separa a interface da lógica de negócio",
                "Facilita a manutenção e modificação visual",
                "Melhora a organização geral do projeto",
                "Permite uso de ferramentas visuais (ex: Scene Builder)"
              ]
            },
            {
              tipo: "tabela",
              titulo: "Componentes JavaFX/FXML apresentados",
              colunas: ["Componente", "Função"],
              linhas: [
                ["`VBox`", "Organiza elementos verticalmente, um abaixo do outro"],
                ["`TextField`", "Campo de entrada de texto para o usuário digitar"],
                ["`Button`", "Botão que dispara eventos ao ser clicado"],
                ["`Label`", "Exibe mensagens ou textos na interface"]
              ]
            },
            {
              tipo: "imagem",
              src: "fig_fxml_interface_usuario.png",
              alt: "Estrutura da interface JavaFX em FXML com VBox, TextField, Button e Label",
              pasta: "imagens_poo/aula_15",
              num: 5
            }
          ]
        },
        {
          id: "controller",
          titulo: "Controller",
          blocos: [
            {
              tipo: "texto",
              texto: "O **Controller** é a peça central que conecta a interface gráfica (FXML), as regras da aplicação e a persistência (DAO). Ele captura as ações do usuário, aciona o DAO e atualiza a interface com o resultado."
            },
            {
              tipo: "lista",
              titulo: "Funções do Controller",
              itens: [
                "Salvar dados digitados pelo usuário",
                "Carregar dados do arquivo e exibir na interface"
              ]
            },
            {
              tipo: "exemplo",
              titulo: "Fluxo de salvamento via Controller",
              texto: "1. Usuário digita nome e email nos campos TextField\n2. Clica no botão Salvar\n3. Controller obtém os textos com getText()\n4. Cria um objeto Usuario\n5. Chama UsuarioDAO para salvar\n6. Interface exibe confirmação via Label com setText()"
            },
            {
              tipo: "exemplo",
              titulo: "Fluxo de carregamento via Controller",
              texto: "1. Usuário clica no botão Carregar\n2. Controller chama UsuarioDAO para leitura\n3. DAO lê o arquivo JSON e reconstrói o objeto Usuario\n4. Controller preenche os campos TextField com setText()"
            }
          ]
        },
        {
          id: "metodos",
          titulo: "Métodos Importantes",
          blocos: [
            {
              tipo: "tabela",
              titulo: "Métodos utilizados na aula",
              colunas: ["Método", "Objetivo"],
              linhas: [
                ["`put(chave, valor)`", "Adiciona dados ao JSONObject"],
                ["`get(chave)`", "Recupera um valor do JSONObject pela chave"],
                ["`toJSONString()`", "Converte o JSONObject em texto no formato JSON"],
                ["`parse(reader)`", "Interpreta o conteúdo JSON lido pelo FileReader"],
                ["`setText(texto)`", "Define o texto exibido em um componente JavaFX"],
                ["`getText()`", "Obtém o texto digitado em um TextField da interface"]
              ]
            }
          ]
        },
        {
          id: "integracao_mvc",
          titulo: "Integração Completa — Padrão MVC",
          blocos: [
            {
              tipo: "texto",
              texto: "A aula demonstra a integração entre todas as camadas da aplicação seguindo o padrão **MVC** (Model-View-Controller), onde cada parte tem uma responsabilidade bem definida e não interfere nas demais."
            },
            {
              tipo: "tabela",
              titulo: "Responsabilidades das camadas MVC",
              colunas: ["Camada", "Responsabilidade"],
              linhas: [
                ["Model (`Usuario`)", "Representar e armazenar os dados da entidade"],
                ["DAO (`UsuarioDAO`)", "Salvar e ler os dados no arquivo JSON"],
                ["View (`FXML`)", "Definir a interface gráfica apresentada ao usuário"],
                ["Controller", "Conectar a interface com o DAO e o Model, tratando eventos"]
              ]
            },
            {
              tipo: "destaque",
              texto: "O padrão MVC evita que lógica de interface, dados e persistência se misturem, tornando o código mais organizado, manutenível e escalável."
            }
          ]
        },
        {
          id: "dependencia_maven",
          titulo: "Dependência Maven — json-simple",
          blocos: [
            {
              tipo: "texto",
              texto: "A biblioteca utilizada para manipular JSON na aula foi a **`json-simple`**. O **Maven** é utilizado para gerenciar dependências do projeto, baixando automaticamente as bibliotecas necessárias ao declarar no arquivo `pom.xml`."
            },
            {
              tipo: "lista",
              titulo: "Por que usar Maven",
              itens: [
                "Automatiza o download de bibliotecas externas",
                "Garante que a versão correta da dependência seja usada",
                "Elimina a necessidade de adicionar JARs manualmente ao projeto"
              ]
            },
            {
              tipo: "destaque",
              texto: "A dependência `json-simple` deve ser declarada no `pom.xml` do projeto Maven para estar disponível em tempo de compilação e execução."
            }
          ]
        },
        {
          id: "boas_praticas",
          titulo: "Boas Práticas",
          blocos: [
            {
              tipo: "topico",
              titulo: "Separação MVC",
              texto: "Evita a mistura entre interface, dados e persistência. Cada camada tem uma única responsabilidade, tornando o sistema mais fácil de manter, testar e evoluir."
            },
            {
              tipo: "topico",
              titulo: "Tratamento de erros",
              texto: "O uso de blocos `try/catch` é fundamental para evitar falhas inesperadas durante operações de leitura e escrita de arquivos, que são propensas a erros de I/O."
            },
            {
              tipo: "topico",
              titulo: "Validação de dados",
              lista: [
                "Evitar campos inválidos ou vazios antes de salvar",
                "Impedir que dados incorretos sejam persistidos",
                "Melhorar a segurança e confiabilidade da aplicação"
              ]
            }
          ]
        },
        {
          id: "revisao_rapida",
          titulo: "Resumo Final — Revisão Rápida",
          blocos: [
            {
              tipo: "lista",
              titulo: "Pontos-chave para prova",
              itens: [
                "**Persistência** salva dados para uso futuro; sem ela, os dados são perdidos ao fechar o programa",
                "**JSON** é um formato leve baseado em pares chave-valor, amplamente usado em APIs",
                "**JavaFX** é o framework para criação de interfaces gráficas em Java",
                "**FXML** separa a definição da interface da lógica de comportamento (Controller)",
                "**DAO** centraliza todo o acesso aos dados, isolando a persistência do restante",
                "**Model** representa os dados, sem lógica de interface ou persistência",
                "**Controller** conecta interface, Model e DAO, tratando eventos do usuário",
                "Fluxo de salvamento: `Objeto Java → JSONObject → toJSONString() → FileWriter → arquivo`",
                "Fluxo de leitura: `arquivo → FileReader → JSONParser → get() → Objeto Java`",
                "Biblioteca utilizada: `json-simple` (adicionada via Maven no `pom.xml`)",
                "Boas práticas: separação MVC, `try/catch` para I/O, validação de dados antes de salvar"
              ]
            },
            {
              tipo: "tabela",
              titulo: "Componentes e seus papéis",
              colunas: ["Componente", "Papel"],
              linhas: [
                ["`Usuario`", "Model — armazena nome e email"],
                ["`UsuarioDAO`", "DAO — salva e lê o JSON"],
                ["`usuario.fxml`", "View — define a interface com VBox, TextField, Button, Label"],
                ["`UsuarioController`", "Controller — conecta interface e persistência"],
                ["`json-simple`", "Biblioteca para criar e ler JSONObjects"],
                ["Maven / `pom.xml`", "Gerenciador de dependências do projeto"]
              ]
            }
          ]
        }
      ]
    },

  ],

  simplificado: []

};