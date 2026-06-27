// ── Assistente Nexus (quiz) ───────────────────────────────────
// Versão para páginas de quiz.
// Inclui quiz/search.js e quiz/assistant.js além dos módulos base.
//
// IMPORTANTE: template_init.js deve definir
//   window.__NEXUS_QUIZ_TOKEN__ e window.__NEXUS_QUIZ_MODO__
//   ANTES desta função ser chamada (ou antes do DOMContentLoaded)
//   para que init.js detecte o contexto de quiz corretamente.

function _loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`[Nexus IA] Falha ao carregar: ${src}`));
    document.body.appendChild(s);
  });
}

/**
 * Carrega os módulos da IA em ordem para páginas de quiz.
 *
 * Ordem obrigatória:
 *   1. core/text-utils.js   — utilitários de texto
 *   2. core/loader.js       — carregamento de conteúdo
 *   3. core/worker.js       — comunicação com worker remoto
 *   4. core/ui.js           — renderização do painel
 *   5. resumo/search.js     — motor de busca de resumo
 *   6. quiz/search.js       — motor de busca de quiz
 *   7. resumo/assistant.js  — orquestrador do chat (inclui ponto de interceptação)
 *   8. quiz/assistant.js    — lógica de quiz (token, purge, serialização)
 *   9. init.js              — detecta contexto e autoriza quiz
 */
function _carregarIA() {
  const BASE = 'shared/js/ia/';   // ajuste o caminho relativo conforme a página

  // Etapa 1: deps base em paralelo (sem dependências entre si)
  const depsBase = [
    BASE + 'core/text-utils.js',
    BASE + 'core/loader.js',
    BASE + 'core/worker.js',
    BASE + 'core/ui.js',
  ];

  Promise.all(depsBase.map(_loadScript))
    // Etapa 2: os dois módulos de search podem carregar em paralelo
    .then(() => Promise.all([
      _loadScript(BASE + 'resumo/search.js'),
      _loadScript(BASE + 'quiz/search.js'),
    ]))
    // Etapa 3: assistant de resumo (precisa dos dois search acima)
    .then(() => _loadScript(BASE + 'resumo/assistant.js'))
    // Etapa 4: assistant de quiz (intercepta o resumo/assistant)
    .then(() => _loadScript(BASE + 'quiz/assistant.js'))
    // Etapa 5: init — detecta contexto, autoriza quiz
    .then(() => _loadScript(BASE + 'init.js'))
    .catch(err => console.error(err));
}

_carregarIA();
// ─────────────────────────────────────────────────────────────
