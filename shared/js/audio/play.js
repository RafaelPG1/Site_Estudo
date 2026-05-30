// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/play.js
   Dispatcher central de SFX
   Versão 2.1  ← log corrigido (sfx + master)

   MUDANÇAS v2.0 → v2.1
   ─────────────────────────────────────────────
   - Log agora exibe sfxVolume e masterVolume separadamente,
     evitando leitura enganosa do vol=1.00 (que era só o master).
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

  const sfx = audio.getSfxVolume();
  console.log(`[sfx] ${variantId} | sfx=${sfx.toFixed(2)}`);
  audio.sfx[variantId]?.();
}