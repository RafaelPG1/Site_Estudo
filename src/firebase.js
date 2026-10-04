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
   precise mudar. Só duas coisas ficam aqui por dependerem de estado
   global/UI do app:
     · login()/logout() — chamam setUsuario() de ./global.js
     · ligação do perf_logger às leituras do quiz-repo

   Será reduzido/removido quando existir src/core/auth.js (Fase 5).
   ============================================= */

import { setUsuario } from './global.js';
import { logFirestore } from './perf_logger.js';
import { autenticarUsuario, hashPin } from './data/usuarios-repo.js';
import { definirObservadorLeitura } from './data/quiz-repo.js';

/* Mantém as mesmas métricas [PERF] das leituras do quiz. */
definirObservadorLeitura(logFirestore);

export { getDb } from './data/firebase-app.js';

/* ── HASH SHA-256 ── */
export { hashPin };

/* ── LOGIN ── */
export async function login(nome, pin) {
  const res = await autenticarUsuario(nome, pin);
  if (res.ok) setUsuario(res.usuario);
  return res;
}

/* ── LOGOUT ── */
export function logout() {
  setUsuario(null);
}

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