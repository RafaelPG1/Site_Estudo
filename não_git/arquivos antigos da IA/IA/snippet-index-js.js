// ── Assistente Nexus ─────────────────────────────────────────
// Carregado o quanto antes — sem esperar Sound nem nada mais.
// Isso garante que o FAB da IA apareça junto com os botões de áudio.

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
 * Carrega os módulos da IA em ordem.
 *
 * Ordem obrigatória:
 *   1. core/text-utils.js   — utilitários de texto (sem dependências)
 *   2. core/loader.js       — carregamento de conteúdo
 *   3. core/worker.js       — comunicação com worker remoto
 *   4. core/ui.js           — renderização do painel
 *   5. resumo/search.js     — motor de busca de resumo
 *   6. resumo/assistant.js  — orquestrador do chat
 *   7. init.js              — detecta contexto e inicializa
 *
 * Páginas de resumo não carregam quiz/search.js nem quiz/assistant.js.
 */
function _carregarIA() {
  const BASE = 'shared/js/ia/';
  const deps = [
    BASE + 'core/text-utils.js',
    BASE + 'core/loader.js',
    BASE + 'core/worker.js',
    BASE + 'core/ui.js',
    BASE + 'resumo/search.js',
  ];

  // Carrega as 5 deps em paralelo, depois encadeia os 2 restantes em sequência
  Promise.all(deps.map(_loadScript))
    .then(() => _loadScript(BASE + 'resumo/assistant.js'))
    .then(() => _loadScript(BASE + 'init.js'))
    .catch(err => console.error(err));
}

_carregarIA();
// ─────────────────────────────────────────────────────────────
