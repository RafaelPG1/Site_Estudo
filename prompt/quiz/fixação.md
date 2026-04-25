
Você receberá um conteúdo como entrada (texto, resumo, aula ou PDF) de QUALQUER ÁREA do conhecimento.
Sua tarefa é gerar 12 questões objetivas, claras, variadas e bem distribuídas em nível de dificuldade.
🎯 OBJETIVO
Criar questões que:

Avaliem compreensão do conteúdo
Misturem reconhecimento, interpretação e aplicação
Sejam mais diretas que o estilo ENADE, mas sem serem superficiais 📚 TIPOS DE QUESTÕES (OBRIGATÓRIO VARIAR) Distribua entre:
Questões diretas (curtas)

Pergunta objetiva
Sem contexto ou com contexto mínimo Ex: "Qual é a função de X?"
Questões com pequeno contexto

1 a 3 linhas de introdução
Situação simples
Questões com contexto aplicado

Pequeno cenário (empresa, sistema, situação real)
Mais interpretação
Questões com código (se aplicável)

Apenas se o conteúdo envolver programação
Perguntar sobre comportamento, erro ou saída
⚠️ REGRA IMPORTANTE (OBRIGATÓRIA)

TODAS as questões devem ter um campo texto
Porém:
 
Pode ser curto (1 linha)
Pode ser explicativo
Pode ser quase vazio, mas nunca ausente ✔ Ou seja: sempre existe contexto, mesmo que mínimo 🧠 NÍVEL

Fácil a médio
Misturar:
 
Conceito básico
Interpretação
Aplicação simples ⚖️ DISTRIBUIÇÃO

Total: 12 questões
Misturar:
Curtas
Médias
Com contexto
Evitar padrão repetitivo
⚠️ REGRAS IMPORTANTES

4 alternativas por questão
Apenas 1 correta
Alternativas plausíveis (sem absurdos)
Evitar:
respostas óbvias demais
alternativas muito longas comparadas às outras
Não repetir estrutura de pergunta 📦 FORMATO DE SAÍDA (OBRIGATÓRIO) Gerar diretamente em JavaScript válido:
[
{
  tipo: "Direta", // ou: "Curta", "Contexto", "Código"

  texto: "Contexto curto ou mínimo (sempre presente).",

  question: "Pergunta objetiva.",

  code: `// usar apenas se necessário`,

  options: [
    "Alternativa A",
    "Alternativa B",
    "Alternativa C",
    "Alternativa D"
  ],

  answer: 0,

  feedback: "Explicação breve da resposta correta."
}
]
🏷️ TIPOS POSSÍVEIS (campo tipo)
Use variação:

"Curta"
"Direta"
"Contexto"
"Aplicação"
"Código" (se houver) 
🚨 VALIDAÇÃO FINAL (OBRIGATÓRIA)
Antes de finalizar, verifique:

Existem exatamente 12 questões
Está dentro de um array []
Nenhum texto fora do código
Todas possuem:
texto (mesmo que curto)
question
options (4)
answer (0–3)
feedback
tipo
Campo code só quando necessário
Sem erro de sintaxe JS
Sem repetição de padrão
Respostas distribuídas (A, B, C, D equilibradas) 
🔥 DIFERENCIAL (QUALIDADE)

Misture níveis:
reconhecimento
entendimento
aplicação
Use linguagem natural (não robótica)
Evite copiar frases do conteúdo literalmente ▶️ INSTRUÇÃO FINAL Agora gere as questões com base no conteúdo fornecido. " enade: documento 