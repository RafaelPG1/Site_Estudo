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
   usuarios/{uid}/**. Fase 4: a evolução do quiz passou para esse modelo;
   quiz_evolution/{uid}/** permanece só como LEGADO (compatibilidade).
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
  /* Fase 4 — evolução do quiz sob usuarios/{uid} (estrutura NOVA) */
  QUIZ_EVOLUCAO_DIARIA:  'quiz_evolucao_diaria',
  QUIZ_EVOLUCAO_SEMANAL: 'quiz_evolucao_semanal',
  QUIZ_EVOLUCAO_RESUMO:  'quiz_evolucao_resumo',
  /* Fase 4 — cópia literal das sessões no formato antigo (entrada/saida) */
  SESSOES_LEGADO:        'sessoes_legado',
  /* LEGADO — raiz (fora de usuarios/). Mantido intacto; só leitura de
     compatibilidade e origem da cópia da Fase 4. NUNCA apagado pelo código. */
  QUIZ_EVOLUTION:      'quiz_evolution',
});

/* Marcador gravado em usuarios/{uid}.migracoes.<chave> quando a cópia do
   usuário foi concluída E validada. */
export const MARCADOR_MIGRACAO_EVOLUCAO = 'quiz_evolucao_v2';

/* Subcoleções apagadas pelo admin ao remover um usuário, na ORDEM
   original. Inclui nomes de módulos fora do escopo atual (Games) só
   porque o admin já os apagava — mantidos para não deixar dados órfãos.
   Fase 4: acrescentadas (no FIM) as coleções novas sob usuarios/{uid};
   elas não existiam antes, então nada que já era apagado mudou.
   O legado raiz quiz_evolution/{uid} continua fora desta lista (como
   sempre esteve): sua remoção é decisão separada, com sua aprovação. */
export const SUBCOLECOES_REMOCAO_ADMIN = Object.freeze([
  'quiz_respostas', 'srs_perfis',
  'sm_historico', 'sm_pontuacoes',
  'assoc_historico',
  'sessoes',
  'quiz_evolucao_diaria', 'quiz_evolucao_semanal', 'quiz_evolucao_resumo',
  'sessoes_legado',
]);

/* ── usuarios ── */
export const usuarios        = ()          => [COLECOES.USUARIOS];
export const usuario         = (uid)       => [COLECOES.USUARIOS, uid];

/* ── quiz ── */
export const quizId          = (semestre, modo, disc) => `${semestre}_${modo}_${disc}`;
export const quizRespostas   = (uid)       => [COLECOES.USUARIOS, uid, COLECOES.QUIZ_RESPOSTAS];
export const quizResposta    = (uid, id)   => [COLECOES.USUARIOS, uid, COLECOES.QUIZ_RESPOSTAS, id];
export const quizPerformance = (uid, id)   => [COLECOES.USUARIOS, uid, COLECOES.QUIZ_RESPOSTAS, id, COLECOES.PERFORMANCE];

/* ── evolução do quiz — NOVA estrutura (Fase 4): mesmos IDs e dados ── */
export const evolucaoDiaria         = (uid, dateKey) => [COLECOES.USUARIOS, uid, COLECOES.QUIZ_EVOLUCAO_DIARIA,  dateKey];
export const evolucaoSemanal        = (uid, weekKey) => [COLECOES.USUARIOS, uid, COLECOES.QUIZ_EVOLUCAO_SEMANAL, weekKey];
export const evolucaoResumo         = (uid)          => [COLECOES.USUARIOS, uid, COLECOES.QUIZ_EVOLUCAO_RESUMO,  'main'];
export const evolucaoDiariaColecao  = (uid)          => [COLECOES.USUARIOS, uid, COLECOES.QUIZ_EVOLUCAO_DIARIA];
export const evolucaoSemanalColecao = (uid)          => [COLECOES.USUARIOS, uid, COLECOES.QUIZ_EVOLUCAO_SEMANAL];

/* ── evolução do quiz — LEGADO (raiz; era o caminho até a Fase 3) ── */
export const evolucaoDiariaLegado         = (uid, dateKey) => [COLECOES.QUIZ_EVOLUTION, uid, 'daily',   dateKey];
export const evolucaoSemanalLegado        = (uid, weekKey) => [COLECOES.QUIZ_EVOLUTION, uid, 'weekly',  weekKey];
export const evolucaoResumoLegado         = (uid)          => [COLECOES.QUIZ_EVOLUTION, uid, 'summary', 'main'];
export const evolucaoDiariaColecaoLegado  = (uid)          => [COLECOES.QUIZ_EVOLUTION, uid, 'daily'];
export const evolucaoSemanalColecaoLegado = (uid)          => [COLECOES.QUIZ_EVOLUTION, uid, 'weekly'];

/* ── sessões / uso ── */
export const sessoes         = (uid)       => [COLECOES.USUARIOS, uid, COLECOES.SESSOES];
export const sessao          = (uid, sid)  => [COLECOES.USUARIOS, uid, COLECOES.SESSOES, sid];
export const sessoesLegado   = (uid)       => [COLECOES.USUARIOS, uid, COLECOES.SESSOES_LEGADO];
export const sessaoLegado    = (uid, sid)  => [COLECOES.USUARIOS, uid, COLECOES.SESSOES_LEGADO, sid];
export const historicoDiario = (uid, chave)=> [COLECOES.USUARIOS, uid, COLECOES.HISTORICO_DIARIO, chave];
export const historicoDiarioColecao = (uid) => [COLECOES.USUARIOS, uid, COLECOES.HISTORICO_DIARIO];
export const perfilUsoGlobal = (uid)       => [COLECOES.USUARIOS, uid, COLECOES.PERFIL_USO, 'global'];

/* ── área pessoal ── */
export const pessoalColecao  = (uid)                    => [COLECOES.USUARIOS, uid, COLECOES.PESSOAL];
export const pessoalDoc      = (uid, semestre, discId)  => [COLECOES.USUARIOS, uid, COLECOES.PESSOAL, `${semestre}_${discId}`];

/* ── dashboard (ainda acessados direto pelos módulos de storage) ── */
export const checklistProgresso = (uid, semestre) => [COLECOES.USUARIOS, uid, COLECOES.CHECKLIST_PROGRESSO, semestre];
export const tarefasListas      = (uid)           => [COLECOES.USUARIOS, uid, COLECOES.TAREFAS_LISTAS];
export const tarefaLista        = (uid, id)       => [COLECOES.USUARIOS, uid, COLECOES.TAREFAS_LISTAS, id];