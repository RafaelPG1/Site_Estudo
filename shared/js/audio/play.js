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
  if (!audio.isUnlocked()) return;
  if (event === 'hover' && _isHoverThrottled(area)) return;
  if (!audioState.isReady()) { audioState.enqueue(event, area); return; }

  const variantId = audioState.resolveVariant(event, area);
  if (!variantId) return;

  const vol = audio.getMasterVolume();
  console.log(`[sfx] ${variantId} | vol=${vol.toFixed(2)}`);
  audio.sfx[variantId]?.();
}