Perfeito! Aqui está o prompt de análise:

Você receberá duas entradas:

RESUMO ORIGINAL — o conteúdo da aula em texto puro
OBJETO JS GERADO — o objeto JavaScript estruturado gerado a partir desse resumo

Sua tarefa é comparar as duas entradas e verificar se o objeto JS preservou fielmente TODO o conteúdo do resumo original.
═══════════════════ O QUE ANALISAR ═══════════════════
Percorra o resumo original de cima a baixo e verifique, para cada trecho:

Conteúdo omitido — algum conceito, definição, exemplo, método, etapa, item de lista ou observação que existe no resumo mas NÃO aparece no objeto JS?
Conteúdo reduzido — algum trecho foi simplificado demais, perdendo precisão técnica ou detalhes importantes?
Conteúdo distorcido — alguma informação foi parafraseada de forma incorreta, alterando o significado original?
Conteúdo mal alocado — alguma informação foi colocada no tipo de bloco errado (ex: um exemplo tratado como texto simples, uma lista transformada em parágrafo)?

═══════════════════ FORMATO DO RELATÓRIO ═══════════════════
Gere primeiro o relatório, depois o objeto JS corrigido.
Estrutura do relatório:

📊 SCORE DE FIDELIDADE: XX/100
📋 RESUMO DA ANÁLISE:
[1 a 3 frases descrevendo o estado geral do objeto JS]
🔴 PROBLEMAS CRÍTICOS (conteúdo perdido ou distorcido):
— [Trecho original] → [Problema encontrado]
— ...
🟡 PROBLEMAS MENORES (reduções ou alocações inadequadas):
— [Trecho original] → [Problema encontrado]
— ...
✅ SEM PROBLEMAS:
[Liste as seções que estão corretas e completas]
Regras do relatório:

Se não houver problemas críticos, escreva: 🔴 Nenhum problema crítico encontrado.
Se não houver problemas menores, escreva: 🟡 Nenhum problema menor encontrado.
Seja específico: cite o trecho exato do resumo que foi perdido ou alterado
NÃO invente problemas — aponte apenas divergências reais entre as duas entradas

═══════════════════ OBJETO JS CORRIGIDO ═══════════════════
Após o relatório, gere o objeto JS completo e corrigido, aplicando todos os ajustes identificados:

Reinsira todo conteúdo omitido no bloco e seção adequados
Restaure detalhes que foram reduzidos
Corrija distorções de significado usando as palavras do resumo original
Realoque blocos que estavam no tipo errado

Regras da saída:

NÃO envolva o objeto em blocos de código markdown (não use ```)
NÃO escreva nada após o objeto JS
NÃO retorne aulas: [...] — retorne APENAS o objeto { }
Se o objeto original já estiver 100% correto, retorne-o sem alterações e escreva antes: ✅ Objeto JS sem alterações necessárias.

═══════════════════ ESTRUTURA DA SUA RESPOSTA ═══════════════════
Sua resposta deve seguir exatamente esta ordem:

O relatório completo (conforme modelo acima)
Uma linha separadora: ════════════════════════════════
O objeto JS corrigido (ou o original, se não houver correções)

═══════════════════ COMO USAR ESTE PROMPT ═══════════════════
Cole sua entrada neste formato:

RESUMO ORIGINAL:
[cole aqui o texto do resumo]
OBJETO JS GERADO:
[cole aqui o objeto JS]