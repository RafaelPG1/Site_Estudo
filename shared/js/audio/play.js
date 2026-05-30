// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/play.js
   Dispatcher central de SFX
   Versão 2.0  ← sem unlock gate (AudioContext eager)

   MUDANÇAS v1.5 → v2.0
   ─────────────────────────────────────────────
   - Removido trusted-gesture gate (sfx.js v5.0 cria o AudioContext
     imediatamente no module scope)
   - isUnlocked() agora significa ctx.state === 'running', não mais
     "usuário já clicou". Janela suspended é < 50 ms no load inicial.
   - Guard mantido: sons descartados silenciosamente se ctx ainda
     não estiver running (transitório, imperceptível ao usuário).
   ============================================= */

import audioState from './audio-state.js';
import audio      from './sfx.js';

/* ─────────────────────────────────────────────
   DEBUG FLAG
   Setar DEBUG_AUDIO = true para ativar logs de diagnóstico.
   Em produção fica false — elimina micro-travadas com DevTools aberto.
───────────────────────────────────────────── */
const DEBUG_AUDIO = false;
const _dbg = DEBUG_AUDIO ? (...a) => console.log('[play]', ...a) : () => {};

/* ─────────────────────────────────────────────
   THROTTLE DE HOVER
   Mínimo de 40 ms entre disparos de 'hover'.
   Evita flood ao mover o mouse rapidamente sobre elementos,
   sem perder o primeiro disparo (comportamento imediato).
   Cada área tem seu próprio timer para não bloquear áreas diferentes.
───────────────────────────────────────────── */
const _hoverLastTs = new Map(); // key: area ?? '__global__' → timestamp

function _isHoverThrottled(area) {
  const key  = area ?? '__global__';
  const now  = Date.now();
  const last = _hoverLastTs.get(key) ?? 0;
  if (now - last < 40) return true;
  _hoverLastTs.set(key, now);
  return false;
}

/**
 * Toca o efeito sonoro mapeado para a ação informada,
 * respeitando o override da área/página quando fornecido.
 *
 * @param {string}      event — chave do SFX_MAP (ex: 'click', 'hover')
 * @param {string|null} [area] — identificador de área (ex: 'game', 'resumos')
 */
export function playSound(event, area = null) {
  // [DIAG] Entrada em playSound()
  console.log(`[DIAG:play] playSound("${event}", "${area}") ENTRADA`, {
    'audio.isUnlocked()': audio.isUnlocked(),
    'audioState.isReady()': audioState.isReady(),
    'timestamp': Date.now(),
  });

  // Guard primário: ctx ainda não está running (suspended logo após load da página).
  // Janela típica < 50 ms — o usuário não percebe. Hover silencioso nesse intervalo.
  if (!audio.isUnlocked()) {
    console.warn('[DIAG:play] BLOQUEADO — ctx não está running ainda');
    return;
  }

  // Throttle de hover: descarta chamadas excessivas sem enfileirar.
  if (event === 'hover' && _isHoverThrottled(area)) {
    console.log('[DIAG:play] BLOQUEADO em hover throttle', { area, 'timestamp': Date.now() });
    return;
  }

  // Se o SFX_MAP ainda não foi carregado do Firebase, enfileira o evento.
  // audio-state.js vai drená-los com os mapas corretos via _flushSfxQueue().
  if (!audioState.isReady()) {
    console.warn('[DIAG:play] BLOQUEADO — audioState não está ready, enfileirando', { event, area });
    audioState.enqueue(event, area);
    return;
  }

  const variantId = audioState.resolveVariant(event, area);

  // [DIAG] Variante resolvida — se undefined, silêncio aqui
  console.log(`[DIAG:play] resolveVariant("${event}", "${area}") →`, variantId ?? 'undefined ← SOM VAI MORRER AQUI');

  if (DEBUG_AUDIO) {
    if (area) {
      const areaMap     = audioState.getSfxAreaMap();
      const hasOverride = areaMap[area.toLowerCase()]?.[event];
      _dbg('playSound("' + event + '", "' + area + '") → variant="' + variantId + '"',
           hasOverride ? '(área override: "' + hasOverride + '")' : '(sem override — usando geral)');
    } else {
      _dbg('playSound("' + event + '") → variant="' + variantId + '" (geral)');
    }
  }

  if (!variantId) {
    console.warn(`[DIAG:play] BLOQUEADO — variantId undefined para evento="${event}" área="${area}"`);
    _dbg('evento "' + event + '"' + (area ? ' (área "' + area + '")' : '') + ' não encontrado no SFX_MAP.');
    return;
  }

  // [DIAG] Chegou até aqui — vai chamar a fn do catálogo
  console.log(`[DIAG:play] Chamando audio.sfx["${variantId}"]()`);
  audio.sfx[variantId]?.();
}