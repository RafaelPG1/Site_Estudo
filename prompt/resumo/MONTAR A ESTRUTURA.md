Você receberá o conteúdo completo de UMA aula.
Sua tarefa é organizar esse conteúdo EXATAMENTE na estrutura JavaScript de objeto de aula mostrada abaixo.

═══════════════════ PASSO 0 — VARREDURA COMPLETA DE IMAGENS (OBRIGATÓRIO, ANTES DE QUALQUER OUTRA COISA) ═══════════════════

Esta etapa é uma **varredura exaustiva**, não uma busca que para na primeira referência encontrada. O erro mais comum é identificar só a primeira imagem e ignorar as demais — por isso siga o processo abaixo à risca.

### Como identificar
1. Percorra o conteúdo **do início ao fim, sem pular nenhuma parte**, procurando por QUALQUER referência visual:
   - menção explícita a "Figura X", "Imagem X", nome de arquivo;
   - legendas de imagem;
   - representações visuais descritas no texto (ex: "quadro comparativo com ícones", "diagrama de fluxo", "esquema visual"), mesmo sem número ou nome de arquivo formal;
   - qualquer trecho do material que já descreva algo como sendo uma ilustração, figura ou representação visual — inclusive dentro de seções como "Imagens, gráficos e diagramas importantes", se o material já vier resumido.
2. **Não pare na primeira encontrada.** Continue a varredura até o fim do conteúdo, mesmo depois de já ter identificado uma ou mais imagens.
3. Ignore apenas o que o próprio material já sinaliza como **puramente decorativo** (ex: ícones estéticos, clip-arts sem conteúdo informativo) — mas isso deve ser uma exclusão consciente, não um esquecimento.
4. Não conte como imagem o que já virou **tabela de dados** (`tipo: "tabela"`) — se o conteúdo de um quadro/tabela já está totalmente reproduzido como dados tabulares, ele não duplica como bloco de imagem.

### Critério: quando NÃO criar bloco de imagem (evitar redundância)
Não crie um bloco `tipo: "imagem"` — nem conte a referência como "imagem pendente" no Passo 0 — se o conteúdo dessa referência visual já está **totalmente representado em texto** em outro bloco (`tabela`, `lista`, `texto`). Exemplos:
- Uma tabela de dados que apareceu como imagem/print no material, mas cujo conteúdo já virou um bloco `tipo: "tabela"` completo → **não** peça a imagem também. O bloco `tabela` já é suficiente; pedir a imagem seria redundante, pois nada de informação seria perdido ao não tê-la.
- Um texto fotografado cujo conteúdo integral já virou um bloco `tipo: "texto"` ou `tipo: "lista"` → mesma lógica, não peça a imagem.

**Só crie bloco de imagem (e só conte como "imagem pendente" no Passo 0) quando a informação depende de estrutura visual/espacial que nenhum bloco de texto consegue capturar sozinho** — diagramas, fluxogramas, arquiteturas, mapas conceituais, ilustrações, fotos, esquemas com setas/conexões/hierarquia visual. Nesses casos, a organização espacial *é* a informação, e perdê-la significa perder conteúdo.

**Pergunta prática antes de decidir:** "se eu não tiver a imagem, só o(s) bloco(s) de texto que já escrevi, alguma informação se perde?"
- Se **não** perde nada → não crie bloco de imagem, não peça pasta para essa referência.
- Se **perde** (relação visual, fluxo, hierarquia gráfica, posição) → crie o bloco de imagem normalmente.

### Antes de perguntar ao usuário
Monte uma lista interna com **todas** as imagens relevantes encontradas, contendo para cada uma:
- posição/local no material (página, seção ou trecho onde aparece);
- descrição breve do que ela representa;
- se possui nome de arquivo, número de figura ou título explícito no material.

Revise essa lista **uma segunda vez antes de perguntar**, conferindo se não ficou nenhuma referência visual para trás em partes do conteúdo que você já leu.

### O que perguntar ao usuário
- Se **houver** uma ou mais imagens relevantes identificadas:
  - **PARE** e **não gere o objeto ainda**.
  - Liste **todas** as imagens encontradas (não apenas a primeira), numeradas, cada uma com sua breve descrição e localização.
  - Pergunte o valor exato do campo `pasta` a ser usado (padrão `"imagens_<disciplina>/aula_<N>"`) — normalmente uma pasta única vale para todas as imagens da aula, mas confirme com o usuário se alguma imagem deve usar uma pasta diferente.
  - Só prossiga para gerar o objeto da aula depois que o usuário responder.
- Se **não houver** nenhuma menção a imagem/figura relevante no conteúdo:
  - Prossiga normalmente, sem usar o bloco `tipo: "imagem"` e sem perguntar nada sobre pasta.

⚠️ Nunca invente, estime ou deixe um valor padrão/placeholder para o campo `pasta`. Esse dado deve vir sempre do usuário.
⚠️ Nunca informe "1 imagem identificada" se houver mais de uma no material — a lista deve refletir o total real encontrado na varredura completa.

═══════════════════ CONTRATO DE SAÍDA (MAIS IMPORTANTE DE TUDO) ═══════════════════
⚠️ Isto se aplica à resposta final, DEPOIS que o Passo 0 (se aplicável) já tiver sido resolvido.
⚠️ O PRIMEIRO CARACTERE da sua resposta final DEVE ser `{`.
⚠️ NÃO escreva NADA antes do `{` — nem saudação, nem "Aqui está", nem comentário, nem quebra de linha, nem espaço.
⚠️ O ÚLTIMO CARACTERE da sua resposta DEVE ser `}` (o fechamento do objeto da aula).
⚠️ NÃO escreva NADA depois do `}` — nem explicações, nem observações finais.
⚠️ NÃO use blocos de código markdown (nada de ``` no início ou no fim).
⚠️ NÃO escreva "aulas: [ ... ]" — apenas o objeto único { }, pronto para ser colado dentro do array aulas[] já existente.
⚠️ NÃO escreva `const aula = ` nem qualquer atribuição de variável — apenas o objeto puro.
Se você perceber que está prestes a escrever qualquer texto fora dessas regras, PARE e corrija antes de responder.

═══════════════════ REGRAS ABSOLUTAS DE FIDELIDADE ═══════════════════
TRANSCREVA o conteúdo integralmente — cada conceito, definição, exemplo, método, detalhe.
NÃO resuma, NÃO simplifique, NÃO reduza, NÃO omita NADA.
Se o conteúdo original tem 10 pontos, o objeto final deve ter 10 pontos.
NÃO parafraseie de forma que perca precisão técnica — use as palavras originais quando necessário.
NÃO crie novos campos além dos mostrados abaixo.
NÃO copie textos do exemplo (como "id-unico", "Nome da Seção") — eles são apenas ilustrativos.

═══════════════════ COMO PREENCHER ═══════════════════
aula → título da aula extraído ou inferido do conteúdo
ideia_central → 1 frase objetiva que resume a ideia principal da aula
secoes → dividir o conteúdo em partes lógicas, cobrindo TODO o material recebido

Para cada seção:
id → identificador curto baseado no tema (ex: "visao", "conceitos", "metodos")
titulo → nome real da seção
blocos → organizar TODO o conteúdo nos tipos abaixo, sem deixar nada de fora

═══════════════════ TIPOS DE BLOCOS ═══════════════════
texto — para parágrafos explicativos completos:
{
  tipo: "texto",
  texto: "explicação completa, mantendo todos os detalhes originais"
}

lista — para conjuntos de itens:
{
  tipo: "lista",
  titulo: "opcional",
  itens: [
    "item completo com todo seu conteúdo original",
    "outro item completo"
  ]
}

topico — para subtópicos com explicação ou lista:
{
  tipo: "topico",
  titulo: "subtítulo",
  texto: "explicação completa"
}
ou
{
  tipo: "topico",
  titulo: "subtítulo",
  lista: [
    "ponto 1 completo",
    "ponto 2 completo"
  ]
}

subtitulo — para separar subseções:
{
  tipo: "subtitulo",
  texto: "texto curto"
}

exemplo — para exemplos, casos e ilustrações:
{
  tipo: "exemplo",
  titulo: "nome do exemplo",
  texto: "explicação completa",
  detalhe: "opcional — informação adicional do exemplo"
}

tabela — para dados em formato tabular:
{
  tipo: "tabela",
  titulo: "nome",
  colunas: ["col1", "col2"],
  linhas: [
    ["valor1", "valor2"]
  ]
}

destaque — para informações marcadas como importantes (não é uma citação literal — é uma frase-síntese, um aviso do tipo "atenção" ou "ponto-chave para a prova", que pode ser sua própria redação enfatizando algo crucial do conteúdo):
{
  tipo: "destaque",
  texto: "informação importante para prova"
}

citacao — use APENAS quando o conteúdo original trouxer uma fala/trecho LITERAL atribuído a uma pessoa, autor, obra ou fonte (ex.: uma frase entre aspas no PDF, um depoimento, uma epígrafe, uma citação de autor citada pelo material). NÃO invente citações e NÃO transforme uma frase comum do texto em citação só para preencher o campo — se não houver uma citação literal com fonte identificável no material, não use este bloco. O campo "autor" deve conter exatamente o nome da pessoa/fonte como aparece no material (ex.: "Wellington Wagner F. Sarmento", "Kent Beck", "Manifesto Ágil, 2001"); omita o campo "autor" apenas se o material não identificar a fonte:
{
  tipo: "citacao",
  texto: "trecho citado literalmente, palavra por palavra, como aparece no material",
  autor: "opcional — nome da pessoa/fonte exatamente como identificada no material"
}

imagem — use APENAS quando o conteúdo mencionar explicitamente uma figura/imagem relevante, E APENAS depois de o usuário ter informado a pasta no Passo 0:
{
  tipo: "imagem",
  id: "identificador_unico_em_snake_case",
  src: "nome_do_arquivo.png",
  pasta: "imagens_<disciplina>/aula_<N>",
  alt: "descrição da imagem",
  num: 1
}
- O campo `id` é obrigatório em todo bloco de imagem, mesmo quando a figura não tem número ou título formal no material. Deve ser único, curto, em snake_case, baseado no número/título original quando existir, ou na descrição objetiva quando não existir (ex: `figura_1_modelo_cascata`, `imagem_comparacao_requisitos_funcionais_nao_funcionais`).
- O campo `pasta` SEMPRE deve seguir o padrão "imagens_<disciplina>/aula_<N>" (ex: "imagens_design/aula_12") e deve ser exatamente o valor informado pelo usuário no Passo 0 — nunca inventado.
- `num` é o número sequencial da figura dentro da aula (1, 2, 3…), na ordem em que aparecem no conteúdo — não pule números nem repita.

═══════════════════ REGRAS DE CONTEÚDO ═══════════════════
✅ OBRIGATÓRIO preservar:
Todos os conceitos e definições, com suas explicações completas
Todos os exemplos, com seus detalhes e contexto
Todos os métodos e procedimentos, passo a passo
Todos os termos técnicos, fórmulas, nomes e nomenclaturas
Todas as listas, com cada item completo
Todas as observações, notas, ressalvas e destaques
A estrutura lógica e sequência do conteúdo original
Usar negrito para termos importantes e backticks para trechos de código dentro dos textos

❌ PROIBIDO:
Resumir parágrafos longos em frases curtas
Fundir itens distintos em um único item
Cortar exemplos ou simplificá-los
Omitir qualquer parte do conteúdo recebido
Transformar explicações detalhadas em tópicos vagos

═══════════════════ VERIFICAÇÃO ANTES DE RESPONDER ═══════════════════
Antes de gerar a saída, confirme mentalmente:
0. Refiz a varredura completa do conteúdo (do início ao fim) e tenho certeza de que identifiquei TODAS as imagens que realmente precisam de bloco `imagem` (informação visual/espacial não capturável em texto), sem contar as que já viraram tabela/lista/texto completos? Se havia imagem(ns) pendente(s), já perguntei e recebi a pasta do usuário antes de gerar o objeto?
0.1. Cada bloco de imagem tem um `id` único preenchido?
1. Todo parágrafo do conteúdo original foi mapeado para algum bloco?
2. Todos os exemplos foram incluídos com seus detalhes?
3. Todas as listas estão completas, com todos os itens?
4. Nenhum conceito ou definição foi omitido ou reduzido?
5. Minha resposta vai começar exatamente com `{` e terminar exatamente com `}`, sem nenhum caractere antes ou depois?

Se a resposta a qualquer uma dessas perguntas for "não", corrija antes de responder.

═══════════════════ FORMATO FINAL EXATO (repetindo o mais importante) ═══════════════════
Depois de resolvido o Passo 0 (se aplicável), retorne SOMENTE o objeto abaixo. A resposta inteira deve ser este objeto, começando em `{` e terminando em `}` — nenhum caractere, palavra, comentário ou marcação antes ou depois:
{
  aula: "...",
  ideia_central: "...",
  secoes: [ ... ]
}