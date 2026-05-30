// @ts-nocheck
/* =============================================
   NEXUS STUDY — audio/index.js
   Ponto de entrada público do sistema de áudio
   ─────────────────────────────────────────────
   Reexporta tudo que o restante do app precisa
   importar. Manter os imports no código externo
   apontando para este arquivo garante isolamento
   total da estrutura interna de pastas.

   USO RECOMENDADO
   ─────────────────────────────────────────────
   import audio            from './audio/index.js'; // engine
   import audioState       from './audio/index.js'; // estado
   import { playSound }    from './audio/index.js'; // dispatcher
   import Sound            from './audio/index.js'; // modal UI
   import { installAudioRecovery } from './audio/index.js';

   OU com named imports:
   import { audio, audioState, playSound, Sound, installAudioRecovery }
     from './audio/index.js';
   ============================================= */

// Engine
export { default as audio }       from './engine/sfx.js';
export { catalog }                 from './engine/sfx.js';
export { playSound }               from './engine/play.js';

// Estado
export { default as audioState }  from './state/audio-state.js';

// UI
export { default as Sound }        from './ui/sound.js';
export { default as makeVolumeSlider } from './ui/vol-slider.js';

// Recovery
export { installAudioRecovery }    from './recovery/audio-recovery.js';

// Default export → engine (compatibilidade com import audio from './audio')
export { default } from './engine/sfx.js';