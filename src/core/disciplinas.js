// Arquivo: src/core/disciplinas.js
/* =============================================
   NEXUS STUDY — src/core/disciplinas.js
   Catálogo de semestres e disciplinas (Fase 5).

   Conteúdo movido SEM alteração de lógica de src/global.js:
   SEMESTRES, SEMESTRE_PADRAO, ícones SVG, resolveIcone,
   disciplinas por semestre, getDisciplinasDeSemestre, parseSemestre
   e a normalização de casing do semestre.

   Módulo PURO: sem estado, sem DOM, sem Storage, sem Firebase e sem
   efeitos ao importar. src/global.js reexporta estes nomes, então os
   consumidores existentes continuam importando de global.js.
   ============================================= */

/* ══════════════════════════════════════════════════════════
   NORMALIZAÇÃO DE SEMESTRE
   ══════════════════════════════════════════════════════════

   Converte qualquer variação de casing para maiúsculo na
   parte do AP. Ex: "2026.1-ap2" → "2026.1-AP2".

   Por que é necessário:
     SEMESTRES[] usa maiúsculas ("2026.1-AP2").
     Os diretórios físicos no servidor também.
     Mas a URL pode chegar com qualquer casing.
     parseSemestre() preserva o casing que recebe —
     então "2026.1-ap2" gera ap="ap2" e o caminho
     resultante .../ap2/ques_*.js não é encontrado.
   ══════════════════════════════════════════════════════════ */
export function normalizarSemestre(s) {
  if (!s) return s;
  // Normaliza apenas a parte após o hífen, preservando o formato YYYY.N
  return String(s).replace(/-(.+)$/, (_, ap) => '-' + ap.toUpperCase());
}


export const SEMESTRES = [
  '2026.2-AP1',
  '2026.1-AP2',
  '2026.1-AP1'
];

/* Semestre padrão — usado quando não há `semestre_atual` salvo no
   localStorage desta origem (ex.: primeiro acesso, ou acesso a
   partir de uma origem diferente da usada em testes locais, como
   GitHub Pages vs Live Server — localStorage não é compartilhado
   entre origens).

   IMPORTANTE: este valor é INDEPENDENTE da ordem de SEMESTRES[].
   Antes, o fallback usava `SEMESTRES[0]` — ou seja, o padrão
   mudava silenciosamente toda vez que a lista era reordenada ou
   um semestre novo era adicionado no topo (foi exatamente isso
   que fez o fallback virar "2026.2-AP2" ao adicionar esse
   semestre à lista, mesmo sem nenhum checklist_data.js configurado
   para ele ainda). Ajuste este valor manualmente quando o
   semestre corrente do curso mudar. */
export const SEMESTRE_PADRAO = '2026.1-AP2';



/* ══════════════════════════════════════════════════════════
   ÍCONES SVG — disciplinas
   ══════════════════════════════════════════════════════════

   Ícones de interface (não-emoji), estilo outline, viewBox
   24x24, `stroke="currentColor"` — a cor é herdada via CSS
   (color: ...) no elemento que renderizar o SVG.

   Centralizados aqui como fonte única, para que disciplinas
   com o mesmo conceito visual reaproveitem o mesmo ícone
   (ex.: Redes I e Redes II usam `_ICONES.network`).

   Consumo previsto (etapa futura, NÃO feita agora):
     disciplina.icone
     getDisciplinaAtual().icone
   Os consumidores atuais (quiz, resumo, Atlas, dashboard etc.)
   ainda não foram alterados para ler este campo.
   ══════════════════════════════════════════════════════════ */

const _ICONES = {
  // POO — programação / código
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--cor-tema, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 6 22 12 16 18"/><polyline points="8 6 2 12 8 18"/></svg>`,

  // Redes I e II — nós conectados
  network: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--cor-tema, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,

  // Design de Sistemas — layout / grade
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--cor-tema, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,

  // Banco de Dados — cilindro clássico
  database: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--cor-tema, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>`,

  // Análise e Projeto de Sistemas — camadas / arquitetura
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--cor-tema, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,

  // Estruturas de Dados — árvore / nós hierárquicos
  tree: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--cor-tema, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="19" r="2.5"/><line x1="12" y1="7.5" x2="6" y2="16.5"/><line x1="12" y1="7.5" x2="18" y2="16.5"/></svg>`,

  // Legislação — balança estilizada
  scale: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--cor-tema, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><line x1="5" y1="7" x2="19" y2="7"/><path d="M5 7l-3 7a3 3 0 0 0 6 0L5 7z"/><path d="M19 7l-3 7a3 3 0 0 0 6 0L19 7z"/><line x1="8" y1="21" x2="16" y2="21"/></svg>`,

  // Psicologia Organizacional — pessoas / organização
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--cor-tema, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
};

/**
 * Resolve uma chave semântica de ícone (ex.: 'network') para o
 * markup SVG correspondente em `_ICONES`.
 *
 * Por que existe:
 *   `disciplina.icone` passou a armazenar apenas a CHAVE (string),
 *   não o SVG resolvido. Isso mantém `_DISCIPLINAS` legível, evita
 *   duplicar markup SVG em cada consumidor, e permite identificar
 *   facilmente quais disciplinas compartilham o mesmo ícone (basta
 *   comparar a chave, não o SVG inteiro).
 *
 * Uso previsto pelos consumidores (etapa futura, NÃO feita agora):
 *   resolveIcone(disciplina.icone)
 *   resolveIcone(getDisciplinaAtual().icone)
 *
 * @param {string} chave     - chave em _ICONES (ex.: 'network', 'code').
 * @param {string} [fallback]- SVG usado caso a chave não exista em
 *                              _ICONES (ex.: chave inválida ou ícone
 *                              ainda não cadastrado). Default: _ICONES.code.
 * @returns {string} markup SVG correspondente.
 */
export function resolveIcone(chave, fallback = _ICONES.code) {
  return _ICONES[chave] ?? fallback;
}

/* ══════════════════════════════════════════════════════════
   DISCIPLINAS POR SEMESTRE
   ══════════════════════════════════════════════════════════ */

const _DISCIPLINAS = {
  '2026.1': [
    { id: 'poo',        nome: 'Programação Orientada a Objetos',  apelido: 'P.O.O.',            icone: 'code',     arquivo: 'poo' },
    { id: 'redes',      nome: 'Redes de Computadores I',          apelido: 'Redes I',            icone: 'network',  arquivo: 'redes' },
    { id: 'design',     nome: 'Design de Sistemas de Informação', apelido: 'Design de Sistemas', icone: 'grid',     arquivo: 'design' },
    { id: 'banco_dados',nome: 'Fundamentos de Banco de Dados',    apelido: 'Banco de dados',     icone: 'database', arquivo: 'banco_dados' },
  ],
  
  '2026.2': [
    { id: 'analise_projeto',          nome: 'Análise e Projeto de Sistemas I',      apelido: 'APS I',                    icone: 'layers', arquivo: 'analise_projeto' },
    { id: 'estruturas_dados',         nome: 'Estruturas de Dados',                  apelido: 'Estruturas de Dados',      icone: 'tree',   arquivo: 'estruturas_dados' },
    { id: 'legislacao',               nome: 'Legislação Empresarial e Trabalhista', apelido: 'Legislação',              icone: 'scale',  arquivo: 'legislacao' },
    { id: 'psicologia_organizacional',nome: 'Psicologia Organizacional',            apelido: 'Psicologia Org.',         icone: 'users',  arquivo: 'psicologia_organizacional' },
    { id: 'redes2',                   nome: 'Redes de Computadores II',             apelido: 'Redes II',                icone: 'network',arquivo: 'redes2' },
  ],


};


export function getDisciplinasDeSemestre(semestre) {
  const { periodo } = parseSemestre(semestre);
  return _DISCIPLINAS[periodo] ?? _DISCIPLINAS[semestre] ?? [];
  // fallback _DISCIPLINAS[semestre] garante compatibilidade com semestres
  // futuros que usem a chave direta (ex: '2027.1')
}
/**
 * Decompõe um semestre no formato 'YYYY.N-APX' ou 'YYYY.N'.
 *
 * Exemplos:
 *   parseSemestre('2026.1-AP2') → { ano: '2026', periodo: '2026.1', ap: 'AP2' }
 *   parseSemestre('2026.1-AP1') → { ano: '2026', periodo: '2026.1', ap: 'AP1' }
 *   parseSemestre('2027.1')     → { ano: '2027', periodo: '2027.1', ap: null  }
 */
export function parseSemestre(sem) {
  const match = String(sem).match(/^(\d{4})(\.\d+)(?:-(.+))?$/);
  if (!match) return { ano: '', periodo: sem, ap: null };
  return {
    ano:     match[1],
    periodo: match[1] + match[2],   // ex: '2026.1'
    ap:      match[3] ?? null,      // ex: 'AP2' | null
  };
}