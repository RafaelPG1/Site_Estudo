// Arquivo: src/data/colecoes.js
/* =============================================
   NEXUS STUDY — src/data/colecoes.js
   Fonte única dos CAMINHOS do Firestore usados hoje.
   Módulo PURO: sem SDK, sem DOM, sem I/O. Cada função devolve o
   array de segmentos, para uso como doc(db, ...seg) / collection(db, ...seg).

   Regra: nenhum outro arquivo da camada de dados escreve nomes de
   coleção como string solta. Os caminhos abaixo são EXATAMENTE os que
   já existiam no código (nada novo, nada renomeado).

   Modelo-alvo para segurança futura: todo dado de usuário está sob
   usuarios/{uid}/**. A única exceção atual é quiz_evolution/{uid}/**
   (migração prevista na Fase 4 — não alterada aqui).
   ============================================= */

export const COLECOES = Object.freeze({
  USUARIOS:            'usuarios',
  QUIZ_RESPOSTAS:      'quiz_respostas',
  PERFORMANCE:         'performance',
  SESSOES:             'sessoes',
  HISTORICO_DIARIO:    'historico_diario',
  PERFIL_USO:          'perfil_uso',
  PESSOAL:             'pessoal',
  CHECKLIST_PROGRESSO: 'checklist_progresso',
  TAREFAS_LISTAS:      'tarefas_listas',
  /* raiz (fora de usuarios/) — Fase 4 decide o destino */
  QUIZ_EVOLUTION:      'quiz_evolution',
});

/* Subcoleções apagadas pelo admin ao remover um usuário, na ORDEM
   original. Inclui nomes de módulos fora do escopo atual (Games) só
   porque o admin já os apagava — mantidos para não deixar dados órfãos. */
export const SUBCOLECOES_REMOCAO_ADMIN = Object.freeze([
  'quiz_respostas', 'srs_perfis',
  'sm_historico', 'sm_pontuacoes',
  'assoc_historico',
  'sessoes',
]);

/* ── usuarios ── */
export const usuarios        = ()          => [COLECOES.USUARIOS];
export const usuario         = (uid)       => [COLECOES.USUARIOS, uid];

/* ── quiz ── */
export const quizId          = (semestre, modo, disc) => `${semestre}_${modo}_${disc}`;
export const quizRespostas   = (uid)       => [COLECOES.USUARIOS, uid, COLECOES.QUIZ_RESPOSTAS];
export const quizResposta    = (uid, id)   => [COLECOES.USUARIOS, uid, COLECOES.QUIZ_RESPOSTAS, id];
export const quizPerformance = (uid, id)   => [COLECOES.USUARIOS, uid, COLECOES.QUIZ_RESPOSTAS, id, COLECOES.PERFORMANCE];

/* ── evolução do quiz (raiz; Fase 4) ── */
export const evolucaoDiaria  = (uid, dateKey) => [COLECOES.QUIZ_EVOLUTION, uid, 'daily',   dateKey];
export const evolucaoSemanal = (uid, weekKey) => [COLECOES.QUIZ_EVOLUTION, uid, 'weekly',  weekKey];
export const evolucaoResumo  = (uid)          => [COLECOES.QUIZ_EVOLUTION, uid, 'summary', 'main'];

/* ── sessões / uso ── */
export const sessoes         = (uid)       => [COLECOES.USUARIOS, uid, COLECOES.SESSOES];
export const sessao          = (uid, sid)  => [COLECOES.USUARIOS, uid, COLECOES.SESSOES, sid];
export const historicoDiario = (uid, chave)=> [COLECOES.USUARIOS, uid, COLECOES.HISTORICO_DIARIO, chave];
export const perfilUsoGlobal = (uid)       => [COLECOES.USUARIOS, uid, COLECOES.PERFIL_USO, 'global'];

/* ── área pessoal ── */
export const pessoalColecao  = (uid)                    => [COLECOES.USUARIOS, uid, COLECOES.PESSOAL];
export const pessoalDoc      = (uid, semestre, discId)  => [COLECOES.USUARIOS, uid, COLECOES.PESSOAL, `${semestre}_${discId}`];

/* ── dashboard (ainda acessados direto pelos módulos de storage) ── */
export const checklistProgresso = (uid, semestre) => [COLECOES.USUARIOS, uid, COLECOES.CHECKLIST_PROGRESSO, semestre];
export const tarefasListas      = (uid)           => [COLECOES.USUARIOS, uid, COLECOES.TAREFAS_LISTAS];
export const tarefaLista        = (uid, id)       => [COLECOES.USUARIOS, uid, COLECOES.TAREFAS_LISTAS, id];