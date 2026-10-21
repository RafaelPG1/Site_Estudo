/* ═══════════════════════════════════════════════════════════════
   NEXUS STUDY — games/template/ia-games.js   (NOVO)

   Ponto ÚNICO que liga a IA do Nexus a uma página de jogos.
   Antes, cada página tinha (ou não tinha) a sua própria cópia de um
   carregador incompleto: faltavam core/context.js e core/history.js,
   o tipo 'games' nunca era declarado e o chat nunca era iniciado —
   por isso a IA dos jogos não funcionava. Agora hub e jogos usam
   este módulo, que segue a mesma ordem de shared/js/ia/carregar-ia.js.

   USO
     import { iniciarIAJogos, registrarContextoJogo } from '../../../template/ia-games.js';
     iniciarIAJogos();                                   // no carregamento da página
     registrarContextoJogo({ jogo, nomeJogo, discId, sem, banco });   // quando o banco carregar

   Segurança: não toca em token nem no Worker. As chamadas à IA passam
   por NexusWorker (core/worker.js), que exige login do Firebase.
═══════════════════════════════════════════════════════════════ */

const _IA = new URL('../../shared/js/ia/', import.meta.url).href;
const _CSS = new URL('../../shared/css/ia/ia.css', import.meta.url).href;

const _DEPS = [
  'core/context.js',
  'core/text-utils.js',
  'core/history.js',
  'core/worker.js',
  'core/ui.js',
];
const _ASSISTENTE = 'games/assistant_games.js';

function _carregarScript(src) {
  return new Promise((resolve, reject) => {
    /* Compara pelo src RESOLVIDO (pega também scripts já presentes no HTML). */
    if (Array.from(document.scripts).some((s) => s.src === src)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`[Nexus IA Jogos] Falha ao carregar: ${src}`));
    (document.head ?? document.documentElement).appendChild(s);
  });
}

function _garantirCss() {
  if (Array.from(document.styleSheets).some((s) => s.href === _CSS)) return;
  if (document.querySelector(`link[href="${_CSS}"]`)) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = _CSS;
  document.head.appendChild(l);
}

let _pronta = null;

/**
 * Carrega a IA e inicia o chat do domínio "games". Idempotente.
 * @returns {Promise<boolean>} true se o assistente foi iniciado
 */
export function iniciarIAJogos() {
  if (_pronta) return _pronta;

  /* Contrato de core/context.js: a página declara o tipo ANTES de carregar a IA.
     Mantém tipos já declarados e acrescenta 'games'. */
  const atual = window.__NEXUS_CONTEXT__;
  const tipos = Array.isArray(atual?.tipos) ? atual.tipos.slice() : [];
  if (!tipos.includes('games')) tipos.push('games');
  window.__NEXUS_CONTEXT__ = { ...(atual || {}), tipos };

  _garantirCss();

  _pronta = Promise.all(_DEPS.map((d) => _carregarScript(_IA + d)))
    .then(() => _carregarScript(_IA + _ASSISTENTE))
    .then(() => {
      if (!window.NexusGamesAssistant) throw new Error('NexusGamesAssistant não foi definido.');
      window.NexusGamesAssistant.init();
      return true;
    })
    .catch((err) => {
      console.warn('[Nexus IA Jogos]', err.message);
      return false;
    });
  return _pronta;
}

/**
 * Informa à IA qual jogo/disciplina está ativo e o banco de itens.
 * Espera a IA terminar de carregar; se ela não carregar, não faz nada.
 */
export async function registrarContextoJogo(ctx) {
  if (!ctx || !ctx.jogo || !Array.isArray(ctx.banco) || ctx.banco.length === 0) return false;
  const ok = await iniciarIAJogos();
  if (!ok) return false;
  window.NexusGamesAssistant.registrarContexto(ctx);
  return true;
}

/** Remove o contexto do jogo (ao sair definitivamente do jogo). */
export function limparContextoJogo() {
  try { window.NexusGamesAssistant?.purgar(); } catch (_) { /* sem IA: nada a fazer */ }
}
