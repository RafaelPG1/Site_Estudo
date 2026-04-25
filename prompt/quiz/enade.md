Você receberá um conteúdo como entrada (texto, resumo, aula ou PDF) de QUALQUER ÁREA do conhecimento.

Sua tarefa é gerar questões no estilo ENADE, seguindo rigorosamente os padrões abaixo:

🎯 OBJETIVO

Criar questões que avaliem:

interpretação
análise
aplicação prática dos conceitos

Evite memorização simples.

📚 ESTRUTURA OBRIGATÓRIA DAS QUESTÕES

Cada questão deve conter:

1. Contexto aplicado
Situação real ou profissional
Adaptado à área (TI, saúde, direito, engenharia, educação, etc.)
Cenários realistas (empresas, sistemas, hospitais, pesquisas, etc.)
2. Base teórica integrada
Conceitos explicados dentro do texto
NÃO fazer perguntas diretas sem contexto
3. Comando claro

Exemplos:

"Avalie as afirmações a seguir"
"Assinale a alternativa correta"
"Analise as asserções e a relação proposta entre elas"
🧩 TIPOS DE QUESTÕES (OBRIGATÓRIO VARIAR)

Distribua de forma equilibrada:

1. Asserção + Justificativa

Formato:
I. afirmativa
PORQUE
II. justificativa

Alternativas:
A) I e II são verdadeiras, e II justifica I
B) I e II são verdadeiras, mas II não justifica I
C) I verdadeira e II falsa
D) I falsa e II verdadeira

2. Múltiplas afirmativas

I.
II.
III.
IV.

Alternativas:
A) I, II e III, apenas
B) I e III, apenas
C) II e IV, apenas
D) I, II, III e IV

3. Conceitual contextualizada
Contexto + pergunta
4 alternativas plausíveis
4. Análise aplicada
Situação-problema
Pode incluir código (se for técnico)
Caso contrário: interpretação de cenário, dados ou decisão
⚠️ REGRAS IMPORTANTES
Todas as alternativas devem ser plausíveis
Evite respostas óbvias
Use pegadinhas conceituais sutis
Misture conceitos relacionados
Priorize raciocínio
NÃO dependa de conhecimento externo (quando possível)
📊 DISTRIBUIÇÃO
Total: 12 questões
Pelo menos 1 de cada tipo
Evitar repetição de estrutura
🧠 NÍVEL
Médio a difícil
Padrão ENADE real
🎨 SISTEMA DE MARCAÇÕES INLINE (ATUALIZADO)

📌 IMPORTANTE:
O campo texto NUNCA deve ter marcações.

🧩 Chips semânticos

Formato:

==categoria==TERMO==
📊 Tabela de categorias (expandida e unificada)
Categoria	Equivalente	Cor	Quando usar
==ddl==	==def==	Azul	Definições, estruturas, conceitos formais
==dml==	==proc==	Verde	Processos, ações, comandos, procedimentos
==key==	==rule==	Âmbar	Regras, restrições, princípios, leis
==type==	==term==	Lilás	Classificações, tipos, categorias técnicas
==danger==	==warn==	Vermelho	Erros comuns, armadilhas, operações críticas
==mark==	==mark==	Acento	Destaque genérico de termos importantes
⚠️ REGRA IMPORTANTE (CRÍTICA)

Use apenas UM padrão por questão:

Se o conteúdo for técnico (ex: SQL, programação) → use:
==ddl==, ==dml==, ==key==, ==type==, ==danger==
Se for conceitual (outras áreas) → use:
==def==, ==proc==, ==rule==, ==term==, ==warn==

🚫 NUNCA misturar os dois padrões na mesma questão

✍️ Sintaxe complementar
backtick → código inline
negrito → conceito principal (somente no feedback)
//itálico// → observações
⚠️ REGRAS DE CONTENÇÃO (mantidas)
Máximo 1 chip por afirmativa
Máximo 2 chips por feedback
NÃO usar chips nas alternativas
NÃO misturar categorias na mesma frase
Prefira texto limpo quando possível
📦 FORMATO DE SAÍDA (OBRIGATÓRIO)

Gerar diretamente em JavaScript válido:

[
{
  tipo: "Asserção + Justificativa",

  texto: "Contexto limpo, sem marcações.",

  question: "Enunciado com possível uso de ==mark==termo==.",

  assertions: [
    "Afirmativa I com no máximo 1 chip.",
    "[PORQUE] Afirmativa II."
  ],

  questionContinuation: "Se necessário.",

  code: `// apenas se necessário`,

  options: [
    "Alternativa A",
    "Alternativa B",
    "Alternativa C",
    "Alternativa D"
  ],

  answer: 0,

  feedback: "Correto: A. Explicação com **conceito central** e no máximo 2 chips."
}
]
🚨 VALIDAÇÃO FINAL (OBRIGATÓRIA)

Antes de finalizar, verifique:

Existem exatamente 12 questões
Está dentro de um array []
Nenhum texto fora do código
Todas possuem:
texto
question
options (4)
answer (0–3)
feedback
tipo
Campos opcionais só aparecem quando necessário
NÃO há erro de sintaxe JS
NÃO há padrão repetitivo
Respostas distribuídas (A, B, C, D equilibradas)
🔥 DIFERENCIAL (ESSA PARTE FAZ MUITA DIFERENÇA)
Varie o tipo de raciocínio:
interpretação
comparação
causa e efeito
análise de erro
Evite repetir estruturas de frase
Use linguagem natural (não robótica)
▶️ INSTRUÇÃO FINAL

Agora gere as questões com base no conteúdo fornecido.

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

