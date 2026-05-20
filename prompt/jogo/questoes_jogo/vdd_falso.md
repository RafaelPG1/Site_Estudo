Crie afirmações de Verdadeiro ou Falso com base no conteúdo abaixo.

Formato obrigatório (JSON):


{
           id:        string,          — identificador único (discId_aula_N)
           aula:      number,          — número da aula de origem
           enunciado: string,
           resposta:  true|false,
           explicacao: string
         }


Regras:

* Criar EXATAMENTE 10 itens
* Usar APENAS afirmações (NÃO fazer perguntas)
* Misturar entre verdadeiro e falso
* As falsas devem ser plausíveis (parecer corretas, mas conter erro conceitual)
* Explicações devem ser curtas e objetivas
* Cobrir os pontos mais importantes da aula
* Evitar frases óbvias ou genéricas

Importante:

* Foco total em prova
* Não inventar conteúdo fora do texto
* Ser direto e técnico

Substitua "topico" pelo nome do conteúdo (ex: design, banco_dados, poo, etc)

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

QUERO SOMENTE DIGITADO, NADA DE CRIAR UM QUIZ INTERATIVO SOMENTE TEXTO DIGITADO. nada de clipboard
