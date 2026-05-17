Crie pares de associação para o jogo Nexus Study com base no conteúdo abaixo.

Formato obrigatório (JavaScript Object):

{
  id: string,        // identificador único (ex: discId_questao_letra)
  pergunta: string,  // termo, conceito ou palavra-chave (curto, 1 a 5 palavras)
  resposta: string   // definição ou explicação objetiva (1 linha, sem ponto final)
}

Estrutura de saída obrigatória:

[discId]: {
  questao_1: [ { id, pergunta, resposta }, ... ],  // exatamente 4 pares
  questao_2: [ ... ],
  questao_3: [ ... ],
  questao_4: [ ... ],
  questao_5: [ ... ],
  questao_6: [ ... ],
}

Exemplo real (para referência de estilo):

design: {
  questao_1: [
    { id: 'design_1a', pergunta: 'UX',          resposta: 'Disciplina focada em como o usuário interage e se sente ao usar o produto' },
    { id: 'design_1b', pergunta: 'UI',          resposta: 'Conjunto de elementos visuais e interativos com os quais o usuário opera' },
    { id: 'design_1c', pergunta: 'Usabilidade', resposta: 'Facilidade com que o usuário consegue atingir seus objetivos no produto' },
    { id: 'design_1d', pergunta: 'Acessibilidade', resposta: 'Prática de projetar produtos utilizáveis por pessoas com diferentes habilidades' },
  ],
  ...
}

Regras obrigatórias:

* Criar EXATAMENTE 6 questões (questao_1 até questao_6)
* Cada questão deve ter EXATAMENTE 4 pares
* Total: 6 × 4 = 24 pares por disciplina
* Cada questão deve ter um tema coeso (ex: "Conceitos básicos", "Comandos SQL", "Pilares da POO")
* A PERGUNTA deve ser curta: termo, conceito, palavra-chave, comando ou nome (máximo 6 palavras)
* A RESPOSTA deve ser uma definição objetiva de 1 linha (máximo 15 palavras)
* As 4 respostas de cada questão devem ser claramente distintas entre si
* Os IDs devem seguir o padrão: [discId]_[N][letra] — ex: poo_1a, poo_1b, poo_1c, poo_1d
* NÃO repetir pares entre questões
* NÃO usar respostas vagas ou genéricas demais
* NÃO inventar conteúdo fora do material fornecido

Restrições:

* NÃO adicionar explicações fora do objeto
* NÃO usar markdown
* NÃO mudar os nomes dos campos (id, pergunta, resposta)
* NÃO sair da estrutura

Saída esperada:

Apenas o objeto JavaScript da disciplina, pronto para colar no associacao_data.js.

QUERO SOMENTE O OBJETO DIGITADO, NADA DE CRIAR UM QUIZ INTERATIVO, SOMENTE TEXTO DIGITADO.

Disciplina (discId): [NOME DA DISCIPLINA — ex: poo, design, redes, banco_dados]

Conteúdo:
