// @ts-nocheck
/* ============================================================
   NEXUS STUDY — quiz/disciplinas/modos.js  v1.0

   FONTE ÚNICA de configuração dos MODOS de estudo
   (Revisão, AVA, Questões, ENADE, Fixação, ...).

   Por que este arquivo existe:
     Antes, a configuração visual de cada modo (SVG, título,
     descrição, cssClass, ordem) estava duplicada em 3 lugares:
       • catalog.json (chave global `_modos`)
       • disciplinas_init.js (`_MODOS_FALLBACK` + `_ICONES_MODO`)
       • quiz_starter_modal.js (`_MODO_LABELS` + `_ICONES_MODO`,
         cópia manual dos SVGs)
     Isso obrigava a editar 3 arquivos para criar/ajustar um modo,
     e já tinha causado divergência real entre eles (ex.: o modo
     "Revisão" foi cadastrado aqui mas não em template_init.js).

   Este arquivo passa a ser a ÚNICA fonte. Ninguém mais deve
   declarar um SVG de modo ou um título de modo em nenhum outro
   arquivo — todos devem importar daqui.

   CONSUMIDORES:
     • quiz/disciplinas/disciplinas_init.js
         import estático — mesma pasta ('./modos.js').
         Usa MODOS_QUIZ / getModosOrdenados() / getIconeModo()
         para montar os cards de modo (Passo 8) e resolver o
         redirecionamento direto via ?modo= (Passo 3.7).

     • quiz/template/template_init.js
         import estático ('../disciplinas/modos.js').
         Usa getModo(modo) para resolver breadcrumb/h1/label do
         modo atual (título da página, header, footer).

     • quiz/js/quiz_starter_modal.js
         import() DINÂMICO ('../disciplinas/modos.js'), no mesmo
         padrão que esse arquivo já usa para importar
         src/global.js. NÃO pode ser import estático de
         disciplinas_init.js, pois aquele arquivo tem efeitos
         colaterais próprios da página de disciplinas (fetch de
         catalog.json, inicialização da IA, manipulação de
         #disciplines-container) que não fazem sentido rodar
         dentro do template do quiz.
         Usa getIconeModo(modo) / getLabelModo(modo) para montar
         o chip de "Modo" no modal inicial — sem cadastrar SVG
         nenhum manualmente.

   catalog.json NÃO guarda mais nada visual — ele continua
   responsável apenas pela DISPONIBILIDADE de cada modo por
   disciplina/semestre (catalog[sem][disc][modoId] === true).
   A chave global `_modos` que existia em catalog.json deve ser
   REMOVIDA — este arquivo a substitui integralmente.

   COMO ADICIONAR UM MODO NOVO (único lugar a mexer em JS):
     1. Acrescente um objeto no array MODOS_QUIZ abaixo, com:
          id, titulo, descricao, cssClass, ordem, icone (SVG),
          breadcrumb, h1, label.
     2. Garanta que `cssClass` já exista como estilo em
        quiz/disciplinas/disciplinas_global.css
        (.disc-card--suaClasse) — se ainda não existir, crie a
        regra lá seguindo o mesmo padrão dos outros temas de card
        (ex.: .disc-card--revisao). Nenhum CSS existente precisa
        ser alterado para isso.
     3. Habilite a disponibilidade em catalog.json:
          catalog[semestre][disciplina][id] = true
     Nenhum outro arquivo JS precisa ser tocado — nem
     disciplinas_init.js, nem template_init.js, nem
     quiz_starter_modal.js.
   ============================================================ */

export var MODOS_QUIZ = [
  {
    id: 'revisao',
    titulo: 'Revisão',
    descricao: 'Questões de revisão dos Professores(as).',
    cssClass: 'disc-card--revisao',
    ordem: 1,
    /* Usados por template_init.js para montar header/título da
       página do quiz quando este é o modo ativo. */
    breadcrumb: 'Revisão',
    h1: 'Questões de <em>Revisão</em>',
    label: 'Revisão',
    /* Mesmo padrão visual dos ícones de disciplina (outline,
       stroke="currentColor", viewBox 0 0 24 24). */
    icone:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
        '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>' +
        '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>' +
        '<path d="m9 14 2 2 4-4"/>' +
      '</svg>',
  },
  {
    id: 'ava',
    titulo: 'AVA',
    descricao: 'Questões extraídas das atividades do AVA',
    cssClass: 'disc-card--ava',
    ordem: 2,
    breadcrumb: 'AVA',
    h1: 'Avaliação <em>AVA</em>',
    label: 'Avaliação AVA',
    icone:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>' +
        '<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' +
      '</svg>',
  },
  {
    id: 'questoes',
    titulo: 'Questões',
    descricao: 'Questões adaptativas criadas por IA com feedback explicativo.',
    cssClass: 'disc-card--quiz',
    ordem: 3,
    breadcrumb: 'Questões',
    h1: 'Questões <em>Práticas</em>',
    label: 'Questões Práticas',
    icone:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="12" r="10"/>' +
        '<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>' +
        '<line x1="12" y1="17" x2="12.01" y2="17"/>' +
      '</svg>',
  },
  {
    id: 'enade',
    titulo: 'ENADE',
    descricao: 'Questões estilo ENADE com contexto aplicado, asserções e análise crítica.',
    cssClass: 'disc-card--enade',
    ordem: 4,
    breadcrumb: 'ENADE',
    h1: 'Questões <em>ENADE</em>',
    label: 'Questões ENADE',
    icone:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
        '<line x1="3" y1="22" x2="21" y2="22"/>' +
        '<line x1="6" y1="18" x2="6" y2="11"/>' +
        '<line x1="10" y1="18" x2="10" y2="11"/>' +
        '<line x1="14" y1="18" x2="14" y2="11"/>' +
        '<line x1="18" y1="18" x2="18" y2="11"/>' +
        '<polygon points="12 2 20 7 4 7"/>' +
      '</svg>',
  },
  {
    id: 'fixacao',
    titulo: 'Fixação',
    descricao: 'Questões de revisão para consolidar o conteúdo estudado.',
    cssClass: 'disc-card--fixacao',
    ordem: 5,
    breadcrumb: 'Fixação',
    h1: 'Questões de <em>Fixação</em>',
    label: 'Fixação',
    icone:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M12 17v5"/>' +
        '<path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>' +
      '</svg>',
  },
];

/* ── Helpers ─────────────────────────────────────────────── */

/* Retorna o objeto de configuração do modo, ou null se o id
   não for reconhecido. */
export function getModo(id) {
  return MODOS_QUIZ.find(function (m) { return m.id === id; }) || null;
}

/* Retorna todos os modos, na ordem de exibição (campo `ordem`).
   Usado por disciplinas_init.js para renderizar os cards e para
   validar ?modo= no redirecionamento direto (Passo 3.7). */
export function getModosOrdenados() {
  return MODOS_QUIZ.slice().sort(function (a, b) {
    return (a.ordem || 0) - (b.ordem || 0);
  });
}

/* Retorna o SVG do modo, ou string vazia se desconhecido. */
export function getIconeModo(id) {
  var m = getModo(id);
  return m ? m.icone : '';
}

/* Retorna o label amigável do modo (ex.: "Revisão"). Se o modo
   não for reconhecido, cai num fallback que apenas capitaliza a
   primeira letra do id — mesmo comportamento que já existia
   antes em quiz_starter_modal.js. */
export function getLabelModo(id) {
  var m = getModo(id);
  if (m) return m.label;
  if (!id) return '';
  try {
    return id.charAt(0).toUpperCase() + id.slice(1);
  } catch (e) {
    return id;
  }
}