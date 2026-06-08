Você receberá um objeto JavaScript chamado aulas, contendo um array de aulas com seções e blocos estruturados.
Sua tarefa é analisar todo o conteúdo e retornar um único objeto JavaScript no mesmo formato de uma entrada do array aulas, representando a aula de revisão completa.

FORMATO DE SAÍDA OBRIGATÓRIO
js{
  aula: "AULA RESUMÃO",
  ideia_central: "uma frase resumindo todo o conteúdo coberto",
  secoes: [
    {
      id: "id_unico_sem_espacos",
      titulo: "Título da Seção",
      blocos: [ /* blocos conforme tipos abaixo */ ]
    }
  ]
}

TIPOS DE BLOCOS DISPONÍVEIS
Use apenas estes tipos. São exatamente os que o app já renderiza.
texto
js{ tipo: "texto", texto: "conteúdo curto e direto" }
subtitulo
js{ tipo: "subtitulo", texto: "Subtítulo dentro de uma seção" }
lista
js{ tipo: "lista", titulo: "título opcional", itens: ["item 1", "item 2"] }
topico
js{
  tipo: "topico",
  titulo: "Título do tópico",
  texto: "explicação curta opcional",
  lista: ["item 1", "item 2"],
  codigo: "código opcional"
}
tabela
js{
  tipo: "tabela",
  titulo: "título opcional",
  colunas: ["Col 1", "Col 2"],
  linhas: [["valor", "valor"], ["valor", "valor"]]
}
exemplo
js{
  tipo: "exemplo",
  titulo: "Título do exemplo",
  texto: "contexto curto",
  detalhe: "código ou valor do exemplo"
}
codigo
js{ tipo: "codigo", codigo: "código completo aqui" }
destaque
js{ tipo: "destaque", texto: "regra importante, aviso ou pegadinha de prova" }
imagem
js{
  tipo: "imagem",
  src: "arquivo_original.ext",
  pasta: "caminho/original",
  num: "numero_original",
  alt: "texto_alternativo_original"
}

REGRAS DE CONTEÚDO

Retornar apenas UM objeto com aula: "AULA RESUMÃO"
Unificar conteúdos repetidos entre aulas
Remover redundâncias e explicações longas
Preservar: conceitos, definições, fórmulas, métodos, processos, comandos, siglas, termos técnicos e pontos frequentemente cobrados em provas
Não criar conteúdo novo nem inventar informações
Não gerar exercícios, atividades, questões ou quiz
Não criar seções vazias


PRIORIZAÇÃO DO CONTEÚDO

Conceitos fundamentais e definições
Fórmulas, sintaxe e comandos
Métodos e processos com ordem obrigatória
Regras e restrições
Comparações entre conceitos
Siglas e termos técnicos

Reduzir ao máximo: histórias, contextos excessivos, detalhes irrelevantes, exemplos muito extensos.

REGRAS DE FORMATO — qual tipo usar para cada conteúdo
ConteúdoTipo obrigatórioComparação entre dois ou mais conceitostabelaLista de comandos com funçãotabelaOperadores com significadotabelaSintaxe SQL ou códigoexemplo (detalhe) ou codigoRegra crítica, aviso, pegadinha de provadestaqueProcesso com ordem obrigatóriatopico com lista numeradaDefinição rápida de termotopico com texto curtoLista de itens curtos sem comparaçãotopico com lista ou lista simplesTexto introdutório de seçãotexto (máximo 2 linhas)
Nunca usar lista com muitos bullets seguidos para algo que cabe em tabela.

ESTRUTURA DAS SEÇÕES
O resumão deve ter obrigatoriamente estas seções, nesta ordem:

visao_geral — mapa rápido de tudo coberto, uma linha por módulo, usando lista
conceitos_essenciais — definições curtas dos principais termos, preferencialmente em tabela com colunas "Conceito" e "Definição"
comandos_sintaxe — comandos e sintaxe usando blocos exemplo e tabela
comparacoes — diferenças importantes entre conceitos, sempre em tabela
processos_etapas — fluxos e sequências obrigatórias em topico com lista numerada
imagens_importantes — imagens relevantes com metadados exatos + um destaque após cada uma explicando por que importa para a prova
decore_para_prova — pontos mais cobrados de todas as aulas, em tabela e destaque


REGRAS DE IMAGEM
Preservar apenas imagens que representem: processos, diagramas, arquiteturas, tabelas importantes, comparações visuais ou estruturas frequentemente cobradas em prova.
Não incluir: imagens decorativas, repetidas ou sem valor para a prova.
Preservar EXATAMENTE os metadados originais — nunca alterar:

src
pasta
num
alt

Após cada bloco imagem, adicionar obrigatoriamente um bloco destaque explicando em uma linha o que o aluno deve lembrar sobre aquela imagem para a prova.

TRATAMENTO DE MÚLTIPLAS AULAS

Consolidar operadores, tipos e comandos de aulas diferentes em uma única tabela
Não repetir a mesma definição em seções diferentes
Manter apenas a melhor versão de cada conceito


VERIFICAÇÃO FINAL
Antes de retornar, verificar:

Todos os conceitos importantes foram preservados?
Comparações estão em tabela?
Comandos e sintaxe estão em exemplo ou codigo?
Regras críticas estão em destaque?
A seção decore_para_prova consolida pontos de todas as aulas?
Os metadados das imagens estão idênticos aos originais?
Não existem seções vazias?


SAÍDA FINAL
Retorne apenas o objeto JavaScript puro, sem texto fora dele, sem comentários, sem blocos markdown envolvendo o objeto.