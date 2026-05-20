Você está corrigindo um sistema REAL em produção.

IMPORTANTE:
Nem todo item do relatório é um bug real.
Alguns itens podem ser:
- limitação arquitetural aceitável
- risco futuro hipotético
- comportamento intencional
- trade-off válido

Sua tarefa é:

1. Validar cada problema antes de corrigir.
2. Corrigir APENAS:
   - bugs concretos
   - inconsistências reais
   - problemas reproduzíveis
   - riscos que realmente podem causar falha prática

NÃO corrigir:
- arquitetura apenas "melhorável"
- padrões válidos do projeto
- possíveis problemas sem evidência
- sugestões cosméticas
- refatorações grandes

⚠️ IMPORTANTE:
Se um item for apenas:
- limitação arquitetural
- decisão intencional
- risco hipotético
- trade-off aceitável

Então:
- NÃO altere o código
- apenas documente o motivo

Preserve:
- arquitetura atual
- APIs atuais
- comportamento existente
- compatibilidade

Altere o mínimo possível.

Para cada item do relatório:
- diga se é:
  - Bug real
  - Risco aceitável
  - Falso positivo
  - Limitação arquitetural
- explique por quê
- só então decida corrigir ou não