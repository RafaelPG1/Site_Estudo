# Prompt 1: Estrutura de Mapa Mental (Mindmap Textual)

## Papel
Você receberá um conteúdo de estudo (texto, resumo, aula, PDF, código ou qualquer material) sobre **qualquer área do conhecimento**. Sua tarefa é transformar **todo o conteúdo relevante** em uma estrutura de **mapa mental textual (mindmap)**, que será usada posteriormente para gerar a imagem do mapa mental (em um segundo prompt separado).

## Regras Absolutas
- **Não** crie a imagem ainda — apenas a estrutura textual.
- **Não** gere código de nenhum tipo (isso não é sobre programar, é sobre organizar conteúdo).
- **Não** altere o conteúdo original.
- **Não** invente informações.
- **Não** deixe de fora conceitos importantes.
- **Não** inclua questões, exercícios, alternativas ou gabaritos presentes no material — se o conteúdo original tiver questões, ignore-as e extraia só o conteúdo teórico.
- Analise o conteúdo **completo** antes de montar a estrutura — não comece a estruturar antes de entender o todo.
- Organize as informações por **hierarquia e relação** entre os conceitos, não pela ordem literal em que aparecem no material.

---

## Estrutura Obrigatória

1. **Tema central** — o assunto principal do conteúdo.
2. **Ramos principais** — os grandes assuntos relacionados ao tema central.
3. **Subramos** — conceitos, características, classificações, etapas, exemplos, relações, etc.
4. **Subsubramos** — apenas quando houver informações que realmente precisem de mais um nível de organização (não force esse nível se não for necessário).

## Priorizar
- conceitos fundamentais;
- definições;
- classificações;
- características;
- processos e etapas;
- relações entre conceitos;
- exemplos importantes;
- diferenças e comparações;
- fórmulas ou regras, caso existam;
- palavras-chave importantes.

## Estilo
- Estrutura hierárquica, curta e objetiva — palavras-chave e frases curtas, **nunca** parágrafos.
- **Não** transforme o mapa em um resumo corrido — se um item virar uma frase longa, é sinal de que deveria ser quebrado em mais de um ramo/subramo.

## Formato de Saída

```
TEMA CENTRAL
├── RAMO PRINCIPAL 1
│   ├── Subramo 1
│   │   ├── Subsubramo
│   │   └── Subsubramo
│   └── Subramo 2
│
├── RAMO PRINCIPAL 2
│   ├── Subramo 1
│   └── Subramo 2
│
└── RAMO PRINCIPAL 3
    ├── Subramo 1
    └── Subramo 2
```

---

## Checklist Final (antes de entregar)
- [ ] O conteúdo completo foi analisado antes de montar a estrutura?
- [ ] Nenhum conceito importante do material foi omitido?
- [ ] Nenhuma questão/exercício/alternativa foi incluída?
- [ ] Nenhuma informação foi inventada ou alterada em relação ao original?
- [ ] A estrutura está organizada por hierarquia/relação entre conceitos, não como resumo corrido?
- [ ] Cada item é uma palavra-chave ou frase curta, sem parágrafos?
- [ ] Subsubramos só aparecem onde realmente necessário?
- [ ] A estrutura foi conferida contra o conteúdo original para garantir que nada relevante ficou de fora?

## Saída Final
Entregue **somente** a estrutura completa do mapa mental, no formato em árvore acima — sem introdução, sem explicação sobre o que foi feito, sem comentários fora da estrutura.