// Arquivo: shared/js/ia/carregar-ia.js
/* =============================================
   NEXUS STUDY — shared/js/ia/carregar-ia.js
   Cadeia de scripts clássicos da IA (Nexus Assistente), antes copiada em
   resumo-utils.js, quiz.js e disciplinas_init.js.

   Ordem preservada: dependências em paralelo (context, text-utils, history,
   loader, worker, ui, search_resumo) → assistant_resumo.js →
   NexusAssistant.initUI() + NexusAssistant.init().

   Os caminhos são resolvidos a partir deste arquivo (import.meta.url),
   portanto valem para qualquer página. Cada página continua definindo o
   próprio window.__NEXUS_CONTEXT__ ANTES de chamar carregarIA().
   ============================================= */

const BASE = new URL('./', import.meta.url).href;

const DEPS = [
  'core/context.js',
  'core/text-utils.js',
  'core/history.js',
  'core/loader.js',
  'core/worker.js',
  'core/ui.js',
  'resumo/search_resumo.js',
];
const ASSISTENTE = 'resumo/assistant_resumo.js';

function _carregarScript(src) {
  return new Promise((resolve, reject) => {
    /* Compara pelo src RESOLVIDO: pega também scripts já presentes no HTML
       com caminho relativo. */
    if (Array.from(document.scripts).some((s) => s.src === src)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`[Nexus IA] Falha ao carregar: ${src}`));
    (document.head ?? document.documentElement).appendChild(s);
  });
}

export function carregarIA(rotulo = 'Nexus IA') {
  Promise.all(DEPS.map((d) => _carregarScript(BASE + d)))
    .then(() => _carregarScript(BASE + ASSISTENTE))
    .then(() => {
      if (window.NexusAssistant) {
        window.NexusAssistant.initUI();
        window.NexusAssistant.init();
      }
    })
    .catch((err) => console.error(`[${rotulo}] Falha ao carregar IA:`, err));
}
