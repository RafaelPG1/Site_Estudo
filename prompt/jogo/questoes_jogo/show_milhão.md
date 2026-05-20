Crie perguntas no estilo Show do Milhão com base no conteúdo fornecido.

📌 Formato obrigatório (JavaScript Object):
{
  id: string,
  aula: "digite a aula"
  texto: string,
  alternativas: {
    A: string,
    B: string,
    C: string,
    D: string
  },
  correta: 'A' | 'B' | 'C' | 'D',
  nivel: 'Fácil' | 'Médio' | 'Difícil'
}
📚 Estrutura de saída:
Organizar por disciplina (ex: poo, redes, design, banco_dados)
Cada disciplina deve conter um array de perguntas

Exemplo:

{
  poo: [ { ... } ],
  redes: [ { ... } ]
}
🔢 Quantidade obrigatória:
Criar EXATAMENTE 10 questões para CADA disciplina
Exemplo:
poo → 10 questões
redes → 10 questões
design → 10 questões
banco_dados → 10 questões
🎯 Sobre as perguntas:
Curtas
Diretas
Estilo prova
Apenas 1 alternativa correta
🧠 Distribuição de dificuldade (por disciplina):
4 → Fácil
4 → Médio
2 → Difícil
📌 Regras obrigatórias:
NÃO adicionar explicações
NÃO adicionar comentários
NÃO usar markdown
NÃO mudar os nomes dos campos
NÃO sair da estrutura
🚫 Restrições:
NÃO repetir perguntas
NÃO repetir alternativas
NÃO usar:
"todas estão corretas"
"nenhuma está correta"
📦 Saída esperada:
Apenas um objeto final contendo todas as disciplinas

coloque os enunciados de cada questão e separando aula
QUERO SOMENTE DIGITADO, NADA DE CRIAR UM QUIZ INTERATIVO SOMENTE TEXTO DIGITADO. nada de clipboard
