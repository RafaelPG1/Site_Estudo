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
    
  ],

  simplificado: []

};