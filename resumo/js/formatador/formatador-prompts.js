/* =============================================
   NEXUS STUDY — resumo/js/formatador/formatador-prompts.js
   Modelos de prompt do Formatador. NÃO são modos do sistema:
   são textos prontos que preenchem o campo de Prompt, que o
   usuário pode editar, copiar ou substituir pelo próprio.

   Cada modelo já é o prompt COMPLETO: instruções + regras +
   estrutura de saída do Nexus. O modelo escolhido também define o
   formato (Resumo, Resumão, Síntese…) que o botão "Formatar texto" aplica.

   Somente texto: a estrutura oferece apenas os tipos de bloco de
   conteúdo textual (texto, subtitulo, lista, topico, tabela,
   exemplo, codigo, destaque, citacao; a Síntese usa só topico e
   lista). Não existe tipo de bloco para imagens.

   Organização deste arquivo:
   - BLOCOS COMPARTILHADOS (REGRA_OURO, PROIBICAO_BASE, SOMENTE_TEXTO,
     SEM_TEORIA, CAMPOS_OBJETO, FORMATACAO, EXEMPLO_*, estruturaNexus…):
     uma correção num bloco vale para todos os prompts que o usam.
   - ESTRUTURA_PADRAO: montada com os mesmos blocos, para nunca
     divergir dos modelos.
   - MODELOS_PROMPT: os textos finais, montados a partir dos blocos.
   Se o leitor ganhar um tipo de bloco/campo novo (resumo-reader.js:
   _buildReaderBody/_renderBloco), atualize os blocos aqui — é o único lugar.

   Atenção: crases e \\ dentro dos textos precisam estar escapados.
   ============================================= */

// =====================================================================
// BLOCOS COMPARTILHADOS
// =====================================================================

const REGRA_OURO = `## Regra de Ouro (Fidelidade)
Use **exclusivamente** o conteúdo fornecido. É proibido:
- Inventar informações, exemplos, números, títulos ou referências.
- Complementar ou corrigir o conteúdo com conhecimento externo.
- Alterar o significado de conceitos, fórmulas, comandos ou dados.
Na dúvida sobre uma informação, **omita**.`;

const PROIBICAO_BASE = `Esta regra tem prioridade sobre "completude" e "fidelidade". Nenhuma questão, exercício, simulado, alternativa (A/B/C/D, a/b/c/d, I/II/III), gabarito ou justificativa de resposta do material original pode aparecer no resultado, em nenhuma forma ou disfarce — nem parafraseada, nem como "exemplo", "destaque" ou "dica de prova", mesmo que isso deixe de fora um dado que só existia dentro de uma questão.
- Sinais de questão: enunciados que pedem para escolher/calcular/assinalar/julgar, "V ou F", "qual das alternativas", "é correto afirmar", itens numerados com frase interrogativa ou imperativa, gabaritos e respostas comentadas.
- Na dúvida se um trecho é questão ou teoria: trate como questão e não inclua.
- Se um trecho misto tiver teoria fora do bloco de questão, aproveite só a teoria.
- Antes de responder, releia o que você escreveu e remova qualquer alternativa rotulada, comando de resposta ou gabarito disfarçado.
- Também é proibido **você criar** perguntas, quiz, "teste-se", flashcards ou exercícios próprios, e usar perguntas retóricas nos textos ("O que é X?"). Escreva sempre em forma de afirmação.`;

const SOMENTE_TEXTO = `## Somente texto
O resultado é composto exclusivamente por texto. Quando uma informação do material estiver apresentada de forma visual (tabela, quadro, gráfico, esquema, fluxograma, diagrama, captura de tela) e for possível identificá-la com segurança, converta-a em texto:
- tabela → bloco \`tabela\` fiel aos dados; quadro → \`texto\` ou \`tabela\`;
- gráfico → descrição ou dados em texto (\`tabela\`/\`lista\`), quando os valores estiverem disponíveis;
- esquema → \`topico\` com \`lista\`; fluxograma → \`topico\` com \`lista\` numerada (etapas); diagrama → explicação textual em \`topico\` (2 a 4 frases curtas).
- Se a informação só existir na parte visual e não puder ser convertida com segurança (ilegível, ambígua ou incompleta), **não invente**: omita.
- Elementos puramente decorativos (ícones, marcas d'água, capas sem informação) são simplesmente ignorados.
- Ao descrever um elemento visual em texto, use como título o título/legenda ORIGINAL copiado palavra por palavra (sem parafrasear ou traduzir); se não houver título escrito, uma descrição objetiva curta. Nunca invente número de figura e nunca descreva algo que só é citado mas não aparece no material.`;

const SEM_TEORIA = `## Se não houver conteúdo aproveitável
Se, depois de descartar questões, exercícios e elementos decorativos, não restar conteúdo teórico suficiente, **não invente**. Retorne um objeto com \`aula: "Sem conteúdo aproveitável"\`, \`ideia_central: "O material fornecido não traz conteúdo teórico aproveitável para este modelo."\` e uma única seção (\`id: "aviso"\`, \`titulo: "Aviso"\`) com um bloco \`texto\` de uma frase explicando isso.`;

const CAMPOS_OBJETO = `### Campos do objeto
- \`aula\` — OBRIGATÓRIO. Título do conteúdo, em texto puro. Se o material for numerado, use "Aula N — Título"; caso contrário, apenas o título.
- \`ideia_central\` — OBRIGATÓRIO. Uma frase com a essência do conteúdo (aparece no card e no topo da leitura).
- \`secoes\` — OBRIGATÓRIO, com ao menos 1 seção. Cada seção tem:
  - \`id\` — OBRIGATÓRIO. Único, em snake_case, sem espaços nem acentos (não é exibido, mas faz parte do padrão dos arquivos).
  - \`titulo\` — OBRIGATÓRIO. Texto puro.
  - \`blocos\` — OBRIGATÓRIO, com ao menos 1 bloco. Seção sem blocos aparece vazia: nunca crie seções vazias.`;

const FORMATACAO = `### Formatação dentro dos textos
- Só existem dois recursos inline: **negrito** (termos-chave) e \`código\` (comandos, siglas, protocolos, tecnologias). Não use HTML, títulos em Markdown, "-" para listas nem tabelas em Markdown dentro dos textos.
- Cada campo de texto é UM parágrafo: quebras de linha são ignoradas na tela. Para separar ideias, use blocos diferentes. Única exceção: o campo \`codigo\`, onde \\n separa as linhas.
- \`aula\`, \`titulo\` de seção, \`titulo\` de bloco (\`topico\`, \`lista\`, \`tabela\`, \`exemplo\`) e os nomes em \`colunas\` da tabela são texto puro (sem ** nem crases).`;

// Definição do bloco "exemplo": duas variantes.
// MATERIAL    -> só exemplos que já estão no conteúdo (Resumo, Resumão, etc.)
// ILUSTRATIVO -> permite exemplos criados, sempre rotulados no título
const EXEMPLO_MATERIAL = `**exemplo** — exemplo prático já presente no conteúdo.
{ tipo: "exemplo", titulo: "Título do exemplo", texto: "contexto curto", detalhe: "código ou valor do exemplo" }
Obrigatórios: \`titulo\` e \`texto\`. Opcional: \`detalhe\`.`;

const EXEMPLO_ILUSTRATIVO = `**exemplo** — exemplo ou aplicação prática. O \`titulo\` SEMPRE começa com "Exemplo do material:" (quando o exemplo já está no conteúdo) ou "Exemplo ilustrativo:" (quando foi criado por você só para ilustrar).
{ tipo: "exemplo", titulo: "Exemplo ilustrativo: nome", texto: "situação ou contexto curto", detalhe: "como o conceito se aplica, código ou valor" }
Obrigatórios: \`titulo\` e \`texto\`. Opcional: \`detalhe\`.`;

const estruturaNexus = (entrega, exemplo = EXEMPLO_MATERIAL) => `## ESTRUTURA DE SAÍDA DO NEXUS

Esta é a estrutura EXATA que o leitor do Nexus consome. O conteúdo que você produzir será colocado num arquivo de conteúdo do Nexus; qualquer campo, tipo de bloco ou formato fora do descrito aqui quebra a exibição.

### Formato de entrega
${entrega}
- A saída é um objeto JavaScript (não JSON): chaves SEM aspas (como nos exemplos), textos entre aspas duplas, aspas duplas internas escapadas como \\", vírgula entre os itens.
- Retorne apenas o que este prompt pede — sem texto antes ou depois, sem explicações. (Se a sua interface exibir a resposta dentro de um bloco de código, tudo bem; o que não pode existir é conversa fora dele.)

### Esqueleto
{
  aula: "Título do conteúdo",
  ideia_central: "Uma frase resumindo todo o conteúdo.",
  secoes: [
    {
      id: "id_unico_sem_espacos",
      titulo: "Título da Seção",
      blocos: [ /* blocos, conforme os tipos abaixo */ ]
    }
  ]
}

${CAMPOS_OBJETO}

### Tipos de bloco (use SOMENTE estes — um tipo desconhecido simplesmente não aparece na tela)

**texto** — parágrafo curto e direto.
{ tipo: "texto", texto: "..." }
Obrigatório: \`texto\`.

**subtitulo** — pequeno título dentro de uma seção.
{ tipo: "subtitulo", texto: "..." }
Obrigatório: \`texto\`.

**lista** — enumeração de itens curtos sem subtítulo próprio.
{ tipo: "lista", titulo: "opcional", itens: ["item 1", "item 2"] }
Obrigatório: \`itens\` (array de textos). Opcional: \`titulo\`.

**topico** — um assunto com subtítulo (definição, processo, conceito).
{ tipo: "topico", titulo: "...", texto: "explicação curta opcional", lista: ["item 1", "item 2"], codigo: "código opcional" }
Obrigatório: \`titulo\`. Opcionais: \`texto\`, \`lista\`, \`codigo\` (inclua ao menos um deles). Aparecem nessa ordem: título, texto, lista, código.

**tabela** — comparações, comandos com função, operadores, dados.
{ tipo: "tabela", titulo: "opcional", colunas: ["Col 1", "Col 2"], linhas: [["valor", "valor"], ["valor", "valor"]] }
Obrigatórios: \`colunas\` e \`linhas\` (array de arrays). Toda linha deve ter EXATAMENTE o mesmo número de células que \`colunas\`.

${exemplo}

**codigo** — código, sintaxe ou fórmula completa em bloco.
{ tipo: "codigo", codigo: "linha 1\\nlinha 2" }
Obrigatório: \`codigo\`.

**destaque** — regra importante, aviso ou pegadinha de prova.
{ tipo: "destaque", texto: "..." }
Obrigatório: \`texto\`.

**citacao** — SOMENTE quando o conteúdo já trouxer uma fala/trecho literal atribuído a alguém; nunca invente uma citação.
{ tipo: "citacao", texto: "trecho literal", autor: "opcional" }
Obrigatório: \`texto\`.

${FORMATACAO}`;

const ENTREGA_OBJETO = `Retorne apenas o objeto abaixo, sem envolvê-lo em array e sem nada fora dele.`;

const CHECK_ESTRUTURA = `- [ ] Toda seção com \`id\`, \`titulo\` e blocos; toda \`tabela\` com linhas do tamanho de \`colunas\`?
- [ ] Só os tipos de bloco listados; só **negrito**/\`código\` como formatação inline?
- [ ] Nenhuma pergunta, quiz, "teste-se" ou pergunta retórica escrita por você?
- [ ] Sem conteúdo teórico aproveitável: retornou o objeto de aviso em vez de inventar?
- [ ] A resposta contém apenas o objeto JavaScript?`;

// =====================================================================
// ESTRUTURA PADRÃO E MARCADOR
// =====================================================================

/* Frase-chave presente em toda estrutura. formatador.js a usa para saber
   se o prompt do campo já traz a estrutura (modelos sim; prompt livre não). */
export const MARCADOR = "ESTRUTURA DE SAÍDA DO NEXUS";

/* Estrutura genérica — anexada automaticamente ao copiar um prompt
   escrito do zero (sem a estrutura). Montada com os mesmos blocos dos
   modelos, para nunca divergir deles. */
export const ESTRUTURA_PADRAO = `${estruturaNexus('Retorne apenas UM objeto JavaScript, sem envolvê-lo em array e sem nada fora dele.')}

${SOMENTE_TEXTO}`;

// =====================================================================
// MODELOS
// =====================================================================

export const MODELOS_PROMPT = [
  // ------------------------------------------------------------------
  // NEXUS: RESUMO
  // ------------------------------------------------------------------
  {
    id: 'resumo',
    grupo: 'nexus',
    nome: 'Resumo',
    desc: 'Transforma o material em um resumo completo e detalhado. Use para estudar um assunto a fundo.',
    texto: `# Prompt: Resumo Didático Completo e Detalhado

## Papel
Você é um assistente especializado em transformar materiais acadêmicos (PDF, slides, anotações, transcrições) em resumos **didáticos, completos, detalhados e fiéis** ao material original. O objetivo é aprendizado profundo e material de consulta — útil para provas, mas não limitado a elas.
O material vem logo abaixo destas instruções (texto colado) e/ou em anexo (arquivo). Leia tudo antes de escrever.

## Nível de detalhamento esperado
Este NÃO é um resumo superficial. O resultado deve ser **extenso e aprofundado**, cobrindo:
- **Conteúdo essencial**: definições, conceitos centrais, classificações, fórmulas, processos.
- **Conteúdo complementar relevante**: detalhes, nuances, exceções, observações, exemplos secundários, comparações adicionais e contexto explicativo que o material apresenta — mesmo que não seja o "básico" cobrado em prova. Se está no material e agrega valor ao entendimento, inclua.
- Prefira um resumo mais longo e completo a um curto que capture só o superficial. A meta: quem ler apenas o resumo entende o assunto com a mesma profundidade de quem leu o material inteiro, de forma mais organizada e didática.

${REGRA_OURO}
Fidelidade não significa simplificar: dentro do que o material traz, seja completo. Se houver dúvida sobre um elemento visual, **omita** — é preferível não mencionar do que inventar.

## PROIBIÇÃO ABSOLUTA E INEGOCIÁVEL: Questões e Exercícios
${PROIBICAO_BASE}
Além disso, é proibido:
- Resolver, responder, comentar ou dar gabarito de qualquer questão.
- Criar seção "Questões", "Exercícios", "Fixação" ou "Revisão em formato de pergunta", ou incluir "perguntas de revisão" no fim — nem as que você mesmo formule.
- Reescrever uma questão como afirmação declarativa ("a alternativa correta era que X é maior que Y").
- Usar o enunciado de uma questão como "exemplo explicativo".
Se uma página for majoritariamente de questões, extraia só a teoria que porventura esteja nela. Elementos visuais que pertencem a uma questão só entram (em texto) se tiverem valor teórico independente, sem mencionar a questão.
**Varredura final obrigatória** (no texto que VOCÊ escreveu, não no material): (1) há alguma alternativa rotulada? (2) alguma frase pede para "assinalar", "julgar", "responder" ou "calcular"? (3) algum trecho só faz sentido como pergunta de prova? (4) algum "gabarito" disfarçado de explicação? Se achar, remova e refaça a varredura.

## Processo de análise
1. Leia o material por completo antes de escrever.
2. Identifique a estrutura geral (temas, ordem, hierarquia).
3. Classifique mentalmente cada trecho como "conteúdo teórico" ou "questão/exercício" ANTES de usá-lo.
4. Analise cada elemento visual (tabela, gráfico, diagrama, fluxograma, esquema, mapa conceitual) individualmente, para convertê-lo em texto.

${SOMENTE_TEXTO}
Elementos visuais que ajudam a compreender, organizar ou memorizar o conteúdo devem ser aproveitados em texto (a ausência de número ou legenda nunca é motivo para ignorar um elemento relevante). Explique em 2 a 4 frases curtas, indo direto ao conteúdo, sem "esta figura mostra".

## Estrutura do resumo (seções)
Use, **nesta ordem**, as seções abaixo — apenas as que tiverem conteúdo no material (omita as demais por inteiro):
1. \`visao_geral\` — panorama dos assuntos e de como se relacionam (\`texto\` curto + \`lista\`).
2. \`conceitos_principais\` — definições, classificações, comparações, vantagens/desvantagens e processos, **na ordem do material**. Pode ser dividida em várias seções, uma por tema (ex.: \`conceitos_1_nome_do_tema\`). O que veio de elementos visuais entra aqui, em texto, junto do conteúdo relacionado.
3. \`formulas_metodos\` — fórmulas, significado das variáveis, procedimentos e quando/como usar (só o que o material explicar).
4. \`exemplos_explicativos\` — apenas exemplos teóricos que JÁ existam no material, explicados didaticamente; nunca enunciados de questões.
5. \`revisao_rapida\` — pontos-chave para memorização, **em afirmações** (\`lista\`, \`destaque\`), nunca em perguntas.

## Qual bloco usar para cada conteúdo
| Conteúdo | Bloco |
|---|---|
| Definição de termo | \`topico\` (com \`texto\`) |
| Comparação entre conceitos, comandos/operadores com função | \`tabela\` |
| Processo com ordem obrigatória | \`topico\` com \`lista\` numerada ("1. ...", "2. ...") |
| Sintaxe, código, fórmula | \`codigo\` ou \`exemplo\` (campo \`detalhe\`) |
| Regra crítica, aviso, pegadinha que o material destaca | \`destaque\` |
| Enumeração curta sem comparação | \`lista\` |
| Introdução de seção | \`texto\` (até 2 linhas) |
Nunca use uma \`lista\` longa para algo que cabe melhor em \`tabela\`. Explique termos técnicos, conecte conceitos e destaque diferenças — sempre dentro do que o material apresenta. O objetivo é ensinar, não transcrever.

## Materiais extensos
Se não couber numa única resposta, divida em partes, cada uma como um objeto completo e válido (\`aula: "Título — Parte 1"\`, \`aula: "Título — Parte 2"\`...), sem repetir conteúdo já coberto.

${estruturaNexus('Retorne `aulas: [ ... ]` com UMA entrada para o material (ou uma por aula, se o material trouxer várias aulas claramente separadas), sem nada fora disso.')}

## Checklist final (verifique antes de responder)
- [ ] Varredura final da proibição feita no texto escrito? Nenhuma questão, alternativa, gabarito ou "pergunta de revisão" em nenhum formato?
- [ ] O resumo está detalhado e completo (essencial + complementar), sem informação externa?
- [ ] Todos os elementos visuais relevantes foram convertidos em texto (\`tabela\`/\`topico\`/\`lista\`), com títulos idênticos ao original, sem inventar o que não pôde ser lido?
- [ ] Comparações em \`tabela\`, sintaxe em \`codigo\`/\`exemplo\`, regras críticas em \`destaque\`?
- [ ] Toda seção tem \`id\`, \`titulo\` e ao menos um bloco; toda \`tabela\` tem linhas com o mesmo número de colunas?
- [ ] Só existem os tipos de bloco listados e só **negrito**/\`código\` como formatação inline?
- [ ] A resposta contém apenas \`aulas: [ ... ]\`, sem texto fora?`,
  },

  // ------------------------------------------------------------------
  // NEXUS: RESUMÃO
  // ------------------------------------------------------------------
  {
    id: 'resumao',
    grupo: 'nexus',
    nome: 'Resumão',
    desc: 'Reúne várias aulas em uma única revisão geral. Use para revisar um módulo ou uma matéria inteira de uma vez.',
    texto: `# Prompt: Resumão (Consolidação de Múltiplas Aulas)

## Papel
Você receberá o conteúdo de várias aulas ou materiais (texto colado abaixo destas instruções e/ou em anexo — pode vir como texto corrido, resumos prontos ou até objetos JavaScript de aulas — nesse caso, aproveite apenas o conteúdo textual). Analise **todo** o conteúdo e retorne um **único objeto** JavaScript, representando a aula de revisão consolidada ("Resumão").

## PROIBIÇÃO ABSOLUTA: Exercícios, Atividades e Questões
${PROIBICAO_BASE}
Se um bloco de alguma aula for, na verdade, uma questão/exercício/quiz, ele é ignorado por completo ao consolidar, mesmo que pareça didático.

## Regras de Ouro (Fidelidade)
- Não criar conteúdo novo nem inventar informações: tudo vem do conteúdo fornecido.
- Não alterar o significado de conceitos, fórmulas, comandos ou dados ao consolidar.
- Reduzir ao máximo: histórias, contextos excessivos, detalhes irrelevantes, exemplos muito extensos.
- Preservar: conceitos, definições, fórmulas, métodos, processos, comandos, siglas, termos técnicos e pontos frequentemente cobrados em prova.

## Regras de conteúdo
- Retorne apenas **um** objeto, com \`aula: "AULA RESUMÃO"\`.
- Unifique conteúdos repetidos entre aulas diferentes — mantenha só a melhor/mais completa versão de cada conceito (a mais clara, não necessariamente a mais longa).
- Não repita a mesma definição em seções diferentes. Consolide operadores, tipos e comandos de aulas diferentes numa única tabela.
- Se houver blocos \`citacao\` no conteúdo: preserve-os fielmente; duas citações diferentes de fontes diferentes sobre o mesmo tema podem ficar, a mesma citação repetida vira uma só.

## Priorização do conteúdo
1. Conceitos fundamentais e definições
2. Fórmulas, sintaxe e comandos
3. Métodos e processos com ordem obrigatória
4. Regras e restrições
5. Comparações entre conceitos
6. Siglas e termos técnicos

## Qual bloco usar para cada conteúdo
| Conteúdo | Bloco obrigatório |
|---|---|
| Comparação entre conceitos | \`tabela\` |
| Lista de comandos com função / operadores com significado | \`tabela\` |
| Sintaxe SQL ou código | \`exemplo\` (campo \`detalhe\`) ou \`codigo\` |
| Regra crítica, aviso, pegadinha de prova | \`destaque\` |
| Processo com ordem obrigatória | \`topico\` com \`lista\` numerada |
| Definição rápida de termo | \`topico\` com \`texto\` curto |
| Lista de itens curtos sem comparação | \`topico\` com \`lista\`, ou \`lista\` simples |
| Texto introdutório de seção | \`texto\` (máximo 2 linhas) |
Nunca use \`lista\` com muitos itens seguidos para algo que cabe melhor em \`tabela\`.

## Estrutura das seções
O Resumão segue, **nesta ordem**, as seções abaixo — mas **apenas as que tiverem conteúdo aplicável** (o \`id\` de cada seção é o nome abaixo):
1. \`visao_geral\` — mapa rápido de tudo coberto, uma linha por módulo/aula, em \`lista\`.
2. \`conceitos_essenciais\` — definições curtas dos principais termos, preferencialmente em \`tabela\` com colunas "Conceito" e "Definição".
3. \`comandos_sintaxe\` — comandos e sintaxe, em \`exemplo\` e \`tabela\`.
4. \`comparacoes\` — diferenças importantes entre conceitos, sempre em \`tabela\`.
5. \`processos_etapas\` — fluxos e sequências obrigatórias, em \`topico\` com \`lista\` numerada.
6. \`decore_para_prova\` — pontos mais cobrados de todas as aulas, em \`tabela\` e \`destaque\`.
**Ordem fixa × "sem seção vazia":** a ordem acima vale entre as seções que existirem. Se não houver conteúdo para uma delas (ex.: nada técnico → sem \`comandos_sintaxe\`), **omita a seção inteira**, sem bloco genérico do tipo "não há conteúdo". \`visao_geral\`, \`conceitos_essenciais\` e \`decore_para_prova\` são praticamente sempre presentes.

${SOMENTE_TEXTO}

${estruturaNexus('Retorne o objeto do Resumão (uma única entrada, com `aula: "AULA RESUMÃO"`), sem envolvê-lo em array e sem nada fora dele.')}

## Verificação final (antes de retornar)
- [ ] Nenhuma questão/exercício/alternativa/gabarito de nenhuma aula, em qualquer disfarce?
- [ ] Todos os conceitos importantes foram preservados, sem invenção?
- [ ] Comparações em \`tabela\`; comandos em \`exemplo\`/\`codigo\`; regras críticas em \`destaque\`?
- [ ] \`decore_para_prova\` consolida pontos de todas as aulas?
- [ ] Sem seções vazias, na ordem correta entre as existentes?
- [ ] Toda informação que estava em forma visual foi convertida em texto (ou omitida quando não era possível, sem invenção)?
- [ ] Só os tipos de bloco listados; toda \`tabela\` com linhas do tamanho de \`colunas\`?
- [ ] O retorno é apenas o objeto JavaScript, sem texto fora dele?`,
  },

  // ------------------------------------------------------------------
  // NEXUS: SÍNTESE
  // ------------------------------------------------------------------
  {
    id: 'sintese',
    grupo: 'nexus',
    nome: 'Síntese',
    desc: 'Condensa cada aula nos pontos e conceitos essenciais. Use para uma revisão rápida.',
    texto: `# Prompt: Síntese (Resumo Condensado por Aula)

## Papel
Você receberá um conteúdo de estudo (resumo, aula, PDF ou texto — colado abaixo destas instruções e/ou em anexo). Transforme esse conteúdo **exclusivamente** na estrutura \`simplificado[]\` — um resumo condensado, próximo do original, sem introduções, conclusões ou comentários fora do formato pedido.

## Regras absolutas de saída
- NÃO gerar \`aulas[]\` (é outro formato).
- NÃO escrever introduções, conclusões nem explicações sobre o que foi feito.
- NÃO adicionar comentários além dos exigidos em "Comentários obrigatórios".
- NÃO retornar Markdown fora da estrutura, nem criar quiz, botões ou qualquer elemento de interface.
- NÃO criar blocos além de \`topico\` e \`lista\`.
- Retornar **somente** o bloco \`simplificado: [...]\`.

## PROIBIÇÃO ABSOLUTA: Questões e Exercícios
${PROIBICAO_BASE}
Não transforme uma questão em \`topico\`, \`lista\` ou qualquer outro bloco; se o trecho for questão, ignore-o e extraia apenas a teoria que existir fora dela.

${REGRA_OURO}

## Regras de conteúdo
- Cada aula do conteúdo recebido vira **uma** entrada no array \`simplificado\` (se o conteúdo for uma aula só, uma entrada). Nenhuma aula pode ser omitida.
- Preserve todos os conceitos importantes; o objetivo é um resumo condensado sem perder informação relevante, suficiente para revisão rápida antes de provas.
- Cada item é uma **frase curta**. Nunca escreva parágrafos nem explicações longas.
- Priorize definições, conceitos, fórmulas, métodos, processos e relações importantes. Remova redundâncias e unifique explicações repetidas.
- Preserve siglas, nomes técnicos e terminologia original, sem traduzir nem simplificar o termo em si.
- \`**negrito**\` para termos-chave; \`\` \`backtick\` \`\` para códigos, comandos, protocolos, siglas ou tecnologias, quando fizer sentido.
- \`ideia_central\`: a essência da aula em uma única frase.

## Organização das seções
- Crie entre **1 e 3 seções** por aula, agrupando conteúdos semelhantes, cada uma um agrupamento lógico e coerente.
- Não crie seções vazias: sem conteúdo para a 2ª ou 3ª, use só 1.
- Não repita o mesmo conceito em seções diferentes da mesma aula.

## Regras dos blocos
- **\`topico\`**: quando há subtítulo/assunto identificável na seção; formato obrigatório \`{ tipo: "topico", titulo: "Nome", lista: [ "..." ] }\`; cada item da \`lista\` com uma única informação relevante.
- **\`lista\`**: para enumerações sem subtítulo claro; formato obrigatório \`{ tipo: "lista", itens: [ "..." ] }\`; cada item com um único conceito.

## Somente texto
O resultado é composto exclusivamente por texto. Quando uma informação do material estiver apresentada de forma visual (tabela, quadro, gráfico, esquema, fluxograma, diagrama, captura de tela) e for possível identificá-la com segurança, converta-a em texto:
- tabela ou quadro → \`topico\` com \`lista\` ("**Coluna** → valor");
- gráfico → item de \`lista\` com os dados, quando disponíveis;
- esquema → \`topico\` com \`lista\`; fluxograma → \`topico\` com \`lista\` numerada (etapas); diagrama → itens curtos de \`lista\`.
- Se a informação só existir na parte visual e não puder ser convertida com segurança (ilegível, ambígua ou incompleta), **não invente**: omita.
- Elementos puramente decorativos (ícones, marcas d'água, capas sem informação) são simplesmente ignorados.
- Ao descrever um elemento visual em texto, use como título o título/legenda ORIGINAL copiado palavra por palavra (sem parafrasear ou traduzir); se não houver título escrito, uma descrição objetiva curta. Nunca invente número de figura e nunca descreva algo que só é citado mas não aparece no material.

## Comentários obrigatórios
No início de cada aula: \`// aula: [nome da aula]\`
Antes de cada bloco dentro de \`blocos\`: \`// [número] - [assunto resumido]\`
- Numeração sequencial, **reiniciando em 1 a cada aula**.
- Assunto resumido de 1 a 3 palavras, representando o tema principal daquele bloco.
- Esses comentários não alteram a estrutura — apenas ficam acima dos itens.

## ESTRUTURA DE SAÍDA DO NEXUS

Esta é a estrutura EXATA que o leitor do Nexus consome. O conteúdo que você produzir será colocado num arquivo de conteúdo do Nexus; qualquer campo, tipo de bloco ou formato fora do descrito aqui quebra a exibição.

### Formato de entrega
Retorne **exatamente** \`simplificado: [...]\`, com os comentários obrigatórios, sem nenhum texto, explicação ou marcação fora dessa estrutura. Cada entrada do array usa os campos abaixo.
- A saída é um objeto JavaScript (não JSON): chaves SEM aspas (como nos exemplos), textos entre aspas duplas, aspas duplas internas escapadas como \\", vírgula entre os itens.

### Esqueleto
simplificado: [
  // aula: Título da aula

  // 1 - assunto resumido
  {
    aula: "Título",
    ideia_central: "Uma frase que resume o conceito mais importante da aula.",
    secoes: [
      {
        id: "id-unico",
        titulo: "Nome da Seção",
        blocos: [
          { tipo: "topico", titulo: "Subtítulo do tópico", lista: ["**Termo** → explicação curta"] },
          { tipo: "lista", itens: ["Ponto direto", "Outro ponto importante"] }
        ]
      }
    ]
  }
]

${CAMPOS_OBJETO}

### Tipos de bloco (nesta estrutura existem APENAS dois — nada além deles)

**topico** — quando há um subtítulo ou assunto claramente identificável na seção.
{ tipo: "topico", titulo: "Nome", lista: ["**Termo** → explicação curta", "**Conceito** → definição direta"] }
Obrigatórios: \`titulo\` e \`lista\`. Cada item da lista traz UMA informação relevante.

**lista** — enumerações ou informações sem subtítulo claro.
{ tipo: "lista", itens: ["Ponto direto", "Outro ponto importante", "\`codigo\` quando necessário"] }
Obrigatório: \`itens\`. Cada item traz UM conceito ou informação.

${FORMATACAO}

## Qualidade final (verifique antes de responder)
- [ ] Nenhuma questão/exercício/alternativa/gabarito em nenhum bloco?
- [ ] Todos os conceitos importantes preservados, todos os itens em frases curtas, sem parágrafos?
- [ ] Sem repetição de conceito entre seções; 1 a 3 seções por aula, nenhuma vazia?
- [ ] Só \`topico\` e \`lista\`? Informação visual convertida em texto (ou omitida, sem invenção)?
- [ ] Comentários \`// aula:\` e \`// N - assunto\` presentes, reiniciando a numeração a cada aula?
- [ ] Nada fora de \`simplificado: [...]\`?`,
  },

  // ------------------------------------------------------------------
  // OUTROS: REVISÃO (versão completa, para rever com calma)
  // ------------------------------------------------------------------
  {
    id: 'revisao',
    grupo: 'outros',
    nome: 'Revisão',
    desc: 'Reorganiza toda a matéria por tema, com explicação curta, para rever com calma. Para o último olhar antes da prova, use a Revisão pré-prova.',
    texto: `# Prompt: Revisão

## Papel
Você é um assistente que prepara material de **revisão organizada** a partir do conteúdo fornecido: completo o bastante para rever a matéria com calma, mas mais enxuto que um resumo detalhado.
O conteúdo vem logo abaixo destas instruções (texto colado) e/ou em anexo. Leia tudo antes de escrever.

## Objetivo e foco
Cubra **todos os conceitos importantes** do material, agrupados por tema, cada um com definição e explicação curta (1 a 3 frases) — o suficiente para relembrar o assunto sem reler o material inteiro.
- Comece pela ideia central. Priorize definições, fórmulas, processos e regras.
- Destaque pegadinhas, exceções e diferenças confundíveis **quando o próprio material as apresentar**.
- Encerre com uma seção de memorização em afirmações (nunca em perguntas).
- Esta revisão não é só uma lista de lembretes soltos (isso é a Revisão pré-prova) nem um texto longo e aprofundado (isso é o Resumo): fica no meio-termo, cobrindo tudo de forma clara e curta.

${REGRA_OURO}

## PROIBIÇÃO ABSOLUTA: Questões e Exercícios do material
${PROIBICAO_BASE}

${SOMENTE_TEXTO}

## Qual bloco usar
| Conteúdo | Bloco |
|---|---|
| Definição de termo | \`topico\` com \`texto\` curto |
| Comparação, comandos, operadores | \`tabela\` |
| Processo com ordem obrigatória | \`topico\` com \`lista\` numerada |
| Regra crítica, exceção, pegadinha | \`destaque\` |
| Sintaxe, fórmula | \`codigo\` ou \`exemplo\` |

## Organização das seções
Use, nesta ordem, as que tiverem conteúdo: \`essencial\` (conceitos e definições), \`formulas_processos\`, \`comparacoes\`, \`atencao\` (exceções e pegadinhas, em \`destaque\`), \`decore_para_prova\` (pontos-chave em \`lista\`/\`tabela\`, em afirmações). Defina \`aula\` como "Revisão — [tema]".
Não crie seções vazias, não repita o mesmo conceito em seções diferentes e preserve siglas, nomes técnicos e terminologia original. Retorne apenas **um** objeto.

${SEM_TEORIA}

${estruturaNexus(ENTREGA_OBJETO)}

## Checklist final (verifique antes de responder)
- [ ] Só conteúdo do material; nenhuma informação externa, nenhuma questão/alternativa/gabarito copiada?
- [ ] Todos os conceitos importantes cobertos, cada um com explicação curta?
${CHECK_ESTRUTURA}`,
  },

  // ------------------------------------------------------------------
  // OUTROS: TÓPICOS
  // ------------------------------------------------------------------
  {
    id: 'topicos',
    grupo: 'outros',
    nome: 'Tópicos',
    desc: 'Organiza o conteúdo em tópicos e subtópicos. Use quando quiser um material fácil de consultar.',
    texto: `# Prompt: Tópicos Objetivos

## Papel
Você é um assistente que reescreve conteúdo de estudo em **tópicos curtos e objetivos**, agrupados por assunto, para leitura rápida.
O conteúdo vem logo abaixo destas instruções (texto colado) e/ou em anexo. Leia tudo antes de escrever.

## Objetivo e foco
- Cada item é uma frase curta (até cerca de 20 palavras) com UMA informação. Nada de parágrafos.
- Preserve todos os conceitos importantes, unifique repetições e agrupe o que é semelhante.
- Use \`**negrito**\` nos termos-chave.

${REGRA_OURO}

## PROIBIÇÃO ABSOLUTA: Questões e Exercícios do material
${PROIBICAO_BASE}

${SOMENTE_TEXTO}

## Qual bloco usar
| Conteúdo | Bloco |
|---|---|
| Assunto com subtítulo claro | \`topico\` com \`lista\` ("**Termo** → explicação curta") |
| Enumeração sem subtítulo | \`lista\` |
| Comparação entre conceitos | \`tabela\` |
| Subdivisão dentro de uma seção | \`subtitulo\` |
| Regra que não pode ser esquecida | \`destaque\` (no máximo 1 por seção) |

## Organização das seções
Crie de 2 a 6 seções no total, cada uma com título específico e ao menos um \`topico\` ou \`lista\`. Use no máximo 1 \`destaque\` por seção.
Não crie seções vazias, não repita o mesmo conceito em seções diferentes e preserve siglas, nomes técnicos e terminologia original. Retorne apenas **um** objeto.

${SEM_TEORIA}

${estruturaNexus(ENTREGA_OBJETO)}

## Checklist final (verifique antes de responder)
- [ ] Só conteúdo do material; nenhuma informação externa, nenhuma questão/alternativa/gabarito copiada?
- [ ] Todos os conceitos importantes cobertos, cada item com uma frase curta (sem parágrafos)?
- [ ] Entre 2 e 6 seções, com no máximo 1 \`destaque\` por seção?
${CHECK_ESTRUTURA}`,
  },

  // ------------------------------------------------------------------
  // OUTROS: EXPLICAÇÃO SIMPLIFICADA
  // ------------------------------------------------------------------
  {
    id: 'simplificada',
    grupo: 'outros',
    nome: 'Explicação simplificada',
    desc: 'Explica conteúdos difíceis com linguagem mais simples. Use quando o assunto parecer complicado.',
    texto: `# Prompt: Explicação Simplificada

## Papel
Você é um professor paciente que **explica o conteúdo fornecido com linguagem simples**, para quem está vendo o assunto pela primeira vez.
O conteúdo vem logo abaixo destas instruções (texto colado) e/ou em anexo. Leia tudo antes de escrever.

## Objetivo e foco
Explique cada conceito difícil com palavras do dia a dia, sem perder a precisão: primeiro o que é, depois por que importa, depois como funciona. Mantenha os termos técnicos e explique-os na primeira vez que aparecerem.
- **Só explique o que o material traz.** Se o material não dá o motivo ou a importância de um conceito, ou não define um termo técnico, não preencha com conhecimento externo: mantenha o termo como está e explique apenas o que o material diz sobre ele.
- Você pode usar analogias e exemplos práticos do cotidiano para ajudar, desde que (a) não contradigam nem alterem o conteúdo, (b) venham no bloco \`exemplo\`, com título começando por "Exemplo ilustrativo:" (assim ficam identificados como ilustração; se o exemplo já estava no material, o título começa com "Exemplo do material:"), e (c) todo fato, dado ou regra continue vindo apenas do material.

${REGRA_OURO}

## PROIBIÇÃO ABSOLUTA: Questões e Exercícios do material
${PROIBICAO_BASE}

${SOMENTE_TEXTO}

## Qual bloco usar
| Conteúdo | Bloco |
|---|---|
| Conceito explicado (o que é / por que importa) | \`topico\` com \`texto\` curto e, se ajudar, \`lista\` |
| Analogia ou exemplo prático | \`exemplo\` (título "Exemplo ilustrativo: …"; \`texto\` = situação; \`detalhe\` = ligação com o conceito) |
| Passo a passo | \`topico\` com \`lista\` numerada |
| Ideia que precisa ficar na cabeça | \`destaque\` |
| Comparação | \`tabela\` |

## Organização das seções
Comece com \`texto\` curto de contexto na primeira seção e siga a ordem lógica do assunto (do mais básico ao mais avançado). Uma seção por tema; cada \`texto\` com no máximo 3 frases curtas.
Não crie seções vazias, não repita o mesmo conceito em seções diferentes e preserve siglas, nomes técnicos e terminologia original. Retorne apenas **um** objeto.

${SEM_TEORIA}

${estruturaNexus(ENTREGA_OBJETO, EXEMPLO_ILUSTRATIVO)}

## Checklist final (verifique antes de responder)
- [ ] Só conteúdo do material (analogias à parte); nenhuma informação externa, nenhuma questão/alternativa/gabarito copiada?
- [ ] Nenhum termo foi explicado além do que o material diz sobre ele?
- [ ] Toda analogia ou exemplo criado por você está em \`exemplo\`, com título "Exemplo ilustrativo: …"?
${CHECK_ESTRUTURA}`,
  },

  // ------------------------------------------------------------------
  // OUTROS: GLOSSÁRIO
  // ------------------------------------------------------------------
  {
    id: 'glossario',
    grupo: 'outros',
    nome: 'Glossário',
    desc: 'Termos e conceitos principais, cada um com explicação clara e objetiva.',
    texto: `# Prompt: Glossário

## Papel
Você é um assistente que **organiza os principais termos e conceitos** do conteúdo fornecido em um glossário claro, com cada termo acompanhado de uma explicação objetiva.
O conteúdo vem logo abaixo destas instruções (texto colado) e/ou em anexo. Leia tudo antes de escrever.

## Objetivo e foco
Identifique os termos técnicos, conceitos, classificações e siglas relevantes que o material apresenta e explica. Cada termo recebe uma explicação clara, em 1 a 2 frases curtas, baseada no que o material diz — sem copiar trechos longos e sem acrescentar nada de fora.
- Inclua apenas termos que o material realmente explica ou define. Termo só citado, sem explicação no material, fica de fora.
- Quando o termo for uma sigla, mantenha a sigla e, se o material trouxer o significado, indique-o.
- Agrupe os termos por tema, na ordem em que os temas aparecem no material; dentro de cada grupo, siga a ordem do material.
- Se dois termos forem facilmente confundidos e o material os diferenciar, registre a diferença.
- O glossário não é conjunto de perguntas e respostas: cada entrada é um termo seguido de sua explicação.

${REGRA_OURO}

## PROIBIÇÃO ABSOLUTA: Questões e Exercícios do material
${PROIBICAO_BASE}

${SOMENTE_TEXTO}

## Qual bloco usar
| Conteúdo | Bloco |
|---|---|
| Vários termos com definição curta | \`tabela\` com colunas "Termo" e "Definição" |
| Termo que exige mais explicação (processo, tipos, etapas) | \`topico\` com \`texto\` e, se ajudar, \`lista\` |
| Diferença entre termos confundíveis | \`tabela\` ou \`destaque\` |
| Fórmula ou sintaxe ligada ao termo | \`codigo\` ou \`exemplo\` (campo \`detalhe\`) |
| Introdução curta do grupo | \`texto\` (1 linha) |
Prefira \`tabela\` sempre que houver 3 ou mais termos de definição curta no mesmo grupo.

## Organização das seções
Crie uma seção por tema ou agrupamento de termos (2 a 6 seções), com título específico e \`id\` como \`glossario_nome_do_tema\`. Se o material trouxer várias siglas, elas podem formar uma seção própria (\`siglas\`). Defina \`aula\` como "Glossário — [tema]".
Não crie seções vazias, não repita o mesmo termo em seções diferentes e preserve siglas, nomes técnicos e terminologia original. Retorne apenas **um** objeto.

${SEM_TEORIA}

${estruturaNexus(ENTREGA_OBJETO)}

## Checklist final (verifique antes de responder)
- [ ] Só conteúdo do material; nenhuma informação externa, nenhuma questão/alternativa/gabarito copiada?
- [ ] Todos os termos que o material explica estão presentes, cada um com explicação clara e objetiva?
${CHECK_ESTRUTURA}`,
  },

  // ------------------------------------------------------------------
  // OUTROS: REVISÃO PRÉ-PROVA
  // ------------------------------------------------------------------
  {
    id: 'revisao_pre_prova',
    grupo: 'outros',
    nome: 'Revisão pré-prova',
    desc: 'O que mais vale lembrar na revisão final, em pontos curtos e sem perguntas.',
    texto: `# Prompt: Revisão Pré-Prova

## Papel
Você é um assistente que reorganiza o conteúdo fornecido como **material de revisão final antes da prova**, destacando o que é mais importante lembrar.
O conteúdo vem logo abaixo destas instruções (texto colado) e/ou em anexo. Leia tudo antes de escrever.

## Objetivo e foco
Este material é para a última leitura antes da prova: pouca explicação, muito lembrete. Selecione e destaque o que mais vale guardar — definições-chave, fórmulas, regras, etapas em ordem, diferenças confundíveis, exceções e valores que o material apresenta — sempre em afirmações curtas e diretas.
- Priorize o que o próprio material sinaliza como importante, recorrente ou fácil de errar.
- Não transforme o conteúdo em questões: nada de perguntas, "teste-se", "V ou F", flashcards, simulados ou quiz. Tudo é escrito como afirmação.
- Corte contexto, histórico e detalhes que não ajudem a lembrar; mantenha o que sustenta a compreensão de cada ponto.
- Cada item traz UMA informação. Use \`**negrito**\` nos termos-chave.

${REGRA_OURO}

## PROIBIÇÃO ABSOLUTA: Questões e Exercícios do material
${PROIBICAO_BASE}

${SOMENTE_TEXTO}

## Qual bloco usar
| Conteúdo | Bloco |
|---|---|
| Ponto-chave para lembrar | \`lista\` |
| Definição para fixar | \`topico\` com \`texto\` curto |
| Diferença entre conceitos, comandos, operadores | \`tabela\` |
| Etapas com ordem obrigatória | \`topico\` com \`lista\` numerada |
| Exceção, pegadinha ou regra crítica que o material destaca | \`destaque\` |
| Fórmula ou sintaxe | \`codigo\` ou \`exemplo\` |

## Organização das seções
Use, nesta ordem, as seções que tiverem conteúdo: \`essencial_para_lembrar\` (os pontos mais importantes, em \`lista\`), \`definicoes_para_fixar\`, \`formulas_e_regras\`, \`diferencas_confundiveis\`, \`ordem_e_etapas\`, \`excecoes_e_atencao\` (em \`destaque\`) e \`ultima_checagem\` (afirmações finais de memorização, nunca perguntas). Defina \`aula\` como "Revisão pré-prova — [tema]".
Não crie seções vazias, não repita o mesmo conceito em seções diferentes e preserve siglas, nomes técnicos e terminologia original. Retorne apenas **um** objeto.

${SEM_TEORIA}

${estruturaNexus(ENTREGA_OBJETO)}

## Checklist final (verifique antes de responder)
- [ ] Só conteúdo do material; nenhuma informação externa, nenhuma questão/alternativa/gabarito copiada?
- [ ] Todos os conceitos importantes cobertos, tudo escrito em afirmações curtas?
${CHECK_ESTRUTURA}`,
  },

  // ------------------------------------------------------------------
  // OUTROS: EXEMPLOS PRÁTICOS
  // ------------------------------------------------------------------
  {
    id: 'exemplos_praticos',
    grupo: 'outros',
    nome: 'Exemplos práticos',
    desc: 'Conteúdo completo com explicação e exemplos, aplicações e situações práticas.',
    texto: `# Prompt: Exemplos Práticos

## Papel
Você é um professor que **mantém os conceitos e conteúdos importantes** do material fornecido e **complementa a explicação com exemplos práticos, aplicações e situações** que mostram como o assunto funciona na prática.
O conteúdo vem logo abaixo destas instruções (texto colado) e/ou em anexo. Leia tudo antes de escrever.

## Objetivo e foco
O resultado é conteúdo + explicação + exemplos. Não é uma lista de exemplos: os conceitos, definições, regras e processos importantes do material continuam presentes, cada um seguido de um exemplo ou aplicação que ajude a entender seu funcionamento.
- Para cada conceito relevante: primeiro o que é e como funciona (conforme o material), depois um exemplo ou situação prática.
- Exemplos que já existem no material têm prioridade e devem ser preservados com fidelidade, no bloco \`exemplo\` com \`titulo\` começando por "Exemplo do material:".
- Você pode acrescentar exemplos e situações de aplicação curtos e realistas, desde que (a) ilustrem o conceito sem contradizer nem alterar o material, (b) venham no bloco \`exemplo\` com \`titulo\` começando por "Exemplo ilustrativo:" — assim o leitor distingue o que é do material do que é ilustração —, e (c) todo fato, dado ou regra continue vindo apenas do material. Valores simples usados só para ilustrar nunca devem ser apresentados como dados do material.
- Exemplos são escritos como demonstração em forma declarativa (situação, aplicação, resultado). Nunca como enunciado de questão: sem "calcule", "determine", "assinale", sem alternativas e sem gabarito.
- Se o material não permitir um exemplo seguro para um conceito, apresente o conceito sem exemplo, em vez de forçar.

## Regra de Ouro (Fidelidade)
Todo fato, definição, fórmula, regra e dado vem **exclusivamente** do conteúdo fornecido. É proibido:
- Inventar informações, números, títulos ou referências como se fossem do material.
- Complementar ou corrigir o conteúdo com conhecimento externo.
- Alterar o significado de conceitos, fórmulas, comandos ou dados.
A única liberdade é a de ilustrar: exemplos e situações de aplicação novos são permitidos apenas nos termos da seção "Objetivo e foco".
Na dúvida sobre uma informação do material, **omita**.

## PROIBIÇÃO ABSOLUTA: Questões e Exercícios do material
${PROIBICAO_BASE}

${SOMENTE_TEXTO}

## Qual bloco usar
| Conteúdo | Bloco |
|---|---|
| Conceito, definição ou regra do material | \`topico\` com \`texto\` curto e, se ajudar, \`lista\` |
| Exemplo ou aplicação prática | \`exemplo\` (título "Exemplo do material: …" ou "Exemplo ilustrativo: …"; \`texto\` = situação; \`detalhe\` = como o conceito se aplica ou o resultado) |
| Processo com ordem obrigatória | \`topico\` com \`lista\` numerada |
| Comparação entre conceitos | \`tabela\` |
| Regra crítica ou erro comum que o material destaca | \`destaque\` |
| Sintaxe, código, fórmula | \`codigo\` ou \`exemplo\` (campo \`detalhe\`) |
| Introdução de seção | \`texto\` (até 2 linhas) |

## Organização das seções
Siga a ordem do material, com uma seção por tema (\`id\` como \`tema_nome_do_tema\`). Dentro de cada seção, alterne: \`topico\` com o conceito e, logo depois, o \`exemplo\` que o ilustra. Defina \`aula\` como "[tema] — com exemplos práticos".
Não crie seções vazias, não repita o mesmo conceito em seções diferentes e preserve siglas, nomes técnicos e terminologia original. Retorne apenas **um** objeto.

${SEM_TEORIA}

${estruturaNexus(ENTREGA_OBJETO, EXEMPLO_ILUSTRATIVO)}

## Checklist final (verifique antes de responder)
- [ ] Todo fato, dado e regra vem do material (só os exemplos ilustrativos são novos), sem questão/alternativa/gabarito copiada?
- [ ] Os conceitos importantes continuam presentes, cada um com explicação e exemplo/aplicação?
- [ ] Todo exemplo está em \`exemplo\` com título "Exemplo do material: …" ou "Exemplo ilustrativo: …", e nenhum está escrito como questão?
${CHECK_ESTRUTURA}`,
  },

  // ------------------------------------------------------------------
  // OUTROS: MAPA DE CONCEITOS
  // ------------------------------------------------------------------
  {
    id: 'mapa_conceitos',
    grupo: 'outros',
    nome: 'Mapa de conceitos',
    desc: 'Estrutura textual dos conceitos, suas características e como se conectam.',
    texto: `# Prompt: Mapa de Conceitos (textual)

## Papel
Você é um assistente que **reorganiza o conteúdo fornecido como um mapa de conceitos em forma de texto**: os principais conceitos, suas características e as relações entre eles.
O conteúdo vem logo abaixo destas instruções (texto colado) e/ou em anexo. Leia tudo antes de escrever.

## Objetivo e foco
O objetivo é deixar claro como os conceitos se conectam e dependem uns dos outros. O resultado é uma estrutura textual organizada — não uma imagem, não um mapa mental visual, não um diagrama desenhado com caracteres, setas ASCII ou código Mermaid.
- Comece pelo conceito central e siga para os principais conceitos e seus subconceitos, do mais geral ao mais específico.
- Para cada conceito: definição breve e principais características, conforme o material.
- Expresse as relações com verbos explícitos. Na tabela de relações, use três colunas: "Conceito", "Relação" e "Conceito relacionado". Em listas de hierarquia, use "**Conceito** → subconceito ou característica". O símbolo → é apenas um separador dentro da frase, nunca um desenho de diagrama.
- Relações possíveis, quando o material as sustentar: faz parte de, é um tipo de, depende de, resulta em, precede, contrasta com, usa, é necessário para.
- Registre dependências e ordem quando existirem (o que precisa vir antes de quê).
- Só registre relações que o material sustenta. Se a ligação entre dois conceitos não estiver clara no material, não a invente.

${REGRA_OURO}

## PROIBIÇÃO ABSOLUTA: Questões e Exercícios do material
${PROIBICAO_BASE}

${SOMENTE_TEXTO}

## Qual bloco usar
| Conteúdo | Bloco |
|---|---|
| Conceito com definição e características | \`topico\` com \`texto\` curto e \`lista\` |
| Relações entre conceitos | \`tabela\` com colunas "Conceito", "Relação" e "Conceito relacionado" |
| Conceitos e subconceitos em hierarquia | \`topico\` com \`lista\` ("**Conceito** → subconceito ou característica") |
| Dependência ou ordem obrigatória | \`topico\` com \`lista\` numerada |
| Comparação entre conceitos parecidos | \`tabela\` |
| Conexão ou regra crítica que o material destaca | \`destaque\` |

## Organização das seções
Use, nesta ordem, as seções que tiverem conteúdo: \`conceito_central\` (\`texto\` curto e \`lista\` dos principais conceitos), \`conceitos_e_caracteristicas\` (um \`topico\` por conceito; pode ser dividida por tema), \`relacoes\` (\`tabela\` de relações), \`dependencias_e_ordem\` e \`visao_das_conexoes\` (\`texto\` curto e \`lista\` mostrando como tudo se liga). Defina \`aula\` como "Mapa de conceitos — [tema]".
Não crie seções vazias, não repita o mesmo conceito em seções diferentes e preserve siglas, nomes técnicos e terminologia original. Retorne apenas **um** objeto.

${SEM_TEORIA}

${estruturaNexus(ENTREGA_OBJETO)}

## Checklist final (verifique antes de responder)
- [ ] Só conteúdo do material; nenhuma informação externa, nenhuma questão/alternativa/gabarito copiada?
- [ ] Todos os conceitos importantes cobertos, com as relações entre eles explícitas?
- [ ] Nenhuma relação inventada, e nenhuma imagem, diagrama desenhado, seta ASCII ou Mermaid?
${CHECK_ESTRUTURA}`,
  },
];

export const GRUPOS_MODELO = [
  { id: 'nexus',  rotulo: 'Formatos do Nexus' },
  { id: 'outros', rotulo: 'Outros modelos' },
];

// =====================================================================
// FUNÇÕES AUXILIARES
// =====================================================================

/* Garante que o texto a copiar leve a estrutura do Nexus.
   Modelo (ou prompt editado que manteve a estrutura): devolve igual.
   Prompt escrito do zero: anexa a estrutura ao final. */
export function garantirEstrutura(texto) {
  const t = (texto ?? '').trim();
  if (t.includes(MARCADOR)) return { texto: t, adicionou: false };
  return { texto: `${t}\n\n${ESTRUTURA_PADRAO}\n\nO conteúdo a ser transformado vem logo depois destas instruções.`, adicionou: true };
}

/* Extrai SOMENTE a estrutura de saída do Nexus (a seção que começa em
   "## ESTRUTURA DE SAÍDA DO NEXUS" e vai até o próximo título de nível 2).
   Usa o texto atual do campo, então reflete edições do usuário. Se o prompt
   não trouxer a estrutura (escrito do zero), devolve a estrutura padrão. */
export function extrairEstrutura(texto) {
  const corta = base => {
    const i = base.indexOf(MARCADOR);
    if (i < 0) return null;
    const ini = base.lastIndexOf('\n', i) + 1;
    const fim = base.indexOf('\n## ', ini + 1);
    return base.slice(ini, fim < 0 ? undefined : fim).trim();
  };
  return corta((texto ?? '').replace(/\r\n/g, '\n')) ?? corta(ESTRUTURA_PADRAO);
}