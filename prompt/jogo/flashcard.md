Crie flashcards de estudo com base no conteúdo abaixo.

Formato obrigatório (JSON):


   Estrutura:
     {
       [semestre]: {
         [discId]: [
           {
             id:         string,   — identificador único (discId_aula_N)
             aula:       number,   — número da aula de origem
             enunciado:  string,
             resposta:   true|false,
             explicacao: string
           }
         ]
       }
     }


Regras:

* Criar EXATAMENTE 10 flashcards
* As perguntas devem ser claras e diretas (estilo prova)
* Evitar perguntas vagas ou muito genéricas
* Respostas devem ser objetivas e destacar palavras-chave com <strong>
* Dicas devem ser curtas e úteis (tipo memória rápida)
* Não repetir conteúdo
* Cobrir os pontos mais importantes da aula
* Não explicar demais

Importante:

* Foco em prova
* Priorizar conceitos, definições, diferenças e aplicações

Conteúdo:
[COLE AQUI]

Adicione comentários na saída seguindo estas regras:

* No topo do conteúdo, adicionar:
  // aula: [nome da aula]

* Para cada item gerado (independente da estrutura), adicionar um comentário imediatamente antes contendo:
  // [número] - [assunto resumido]

Regras:

* O número deve ser sequencial (1, 2, 3...)
* O assunto resumido deve ter de 1 a 3 palavras
* O assunto deve representar o tema principal do item
* NÃO alterar a estrutura original solicitada
* NÃO transformar o formato (JSON, array, objeto, etc.)
* Apenas inserir os comentários acima de cada item

Exemplo genérico:

// aula: exemplo

// 1 - conceito chave
{ ... },

// 2 - definição
{ ... }

