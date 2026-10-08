// Arquivo: src/firebase.js
/* =============================================
   NEXUS STUDY — src/firebase.js
   FACHADA DE COMPATIBILIDADE (Fase 3).

   Todo o acesso ao Firestore agora vive em src/data/*:
     · src/data/firebase-app.js   — init do app, getDb, SDK
     · src/data/colecoes.js       — caminhos
     · src/data/usuarios-repo.js  — credenciais, configs, admin, pessoal
     · src/data/quiz-repo.js      — quiz, performance, evolução
     · src/data/sessoes-repo.js   — referências de sessões/uso

   Este arquivo mantém EXATAMENTE os mesmos exports de antes, para que
   nenhum consumidor (Home, Dashboard, Quiz, Admin, Áudio, Games, Atlas)
   precise mudar. Só uma coisa fica aqui:
     · login()/logout() — implementados em ./core/auth.js (Fase 5) e
       apenas reexportados daqui

   Fachada permanente (Games/Atlas e outros consumidores não podem ser
   verificados). Não importa mais ./global.js: o ciclo estático
   global.js ↔ firebase.js foi eliminado na Fase 5.
   ============================================= */

import { login, logout } from './core/auth.js';
import { hashPin } from './data/usuarios-repo.js';

/* As métricas [PERF] das leituras do quiz são registradas dentro de
   data/quiz-repo.js (Fase 8) — não há mais ligação a fazer aqui. */

export { getDb } from './data/firebase-app.js';

/* ── HASH SHA-256 ── */
export { hashPin };

/* ── LOGIN / LOGOUT (implementados em ./core/auth.js — Fase 5) ── */
export { login, logout };

/* ── GERAR HASH (utilitário de console) ── */
export async function gerarHash(pin) {
  const h = await hashPin(pin);
  console.log(`PIN: ${pin}  →  hash: ${h}`);
  return h;
}

/* ── USUÁRIOS / CONFIGS / ADMIN / ÁREA PESSOAL ── */
export {
  salvarConfigs, carregarConfigs,
  getUsuarios, criarUsuario, removerUsuario, resetarPin, salvarAvatar,
  salvarChecklistPessoal, carregarChecklistPessoal,
  salvarCategoriasPessoal, carregarCategoriasPessoal,
  salvarNotaPessoal, carregarNotaPessoal, carregarTudoPessoal,
} from './data/usuarios-repo.js';

/* ── QUIZ / PERFORMANCE / EVOLUÇÃO ── */
export {
  salvarRespostasQuiz, carregarRespostasQuiz, limparRespostasQuiz,
  salvarPerformanceQuiz, limparTodoQuizUsuario,
  listarPerformanceQuiz, listarQuizIds, listarEstadosQuizUsuario,
  carregarEvolutionSummary, carregarEvolutionDaily,
  carregarEvolutionWeekly, carregarEvolutionDailyRange,
  gravarConsolidacaoEvolucao,
} from './data/quiz-repo.js';