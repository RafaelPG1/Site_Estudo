// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/engine/sfx.js
   Ponto de entrada da engine de áudio
   ─────────────────────────────────────────────
   Combina sfx-core.js (engine) + sfx-catalog.js (sons).

   IMPORTAÇÃO PÚBLICA
   ─────────────────────────────────────────────
   import audio from './engine/sfx.js';
   // → idêntico ao sfx.js original

   DIVISÃO INTERNA
   ─────────────────────────────────────────────
   sfx-core.js    → AudioContext, gain nodes, primitivas,
                    BGM engine, API pública
   sfx-catalog.js → Todos os sons SFX + BGM
   ============================================= */

import audio from './sfx-core.js';
import { catalog } from './sfx-catalog.js';

// Registra o catálogo no core e constrói os Proxies de sfx / music / playEvent
audio.init(catalog);

export { catalog };
export default audio;