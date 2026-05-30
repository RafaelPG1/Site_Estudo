// @ts-nocheck
/* =============================================
   NEXUS STUDY — audio/audio-api.js
   Ponto de entrada público do sistema de áudio
   ─────────────────────────────────────────────
   Reexporta tudo que o restante do app precisa
   importar. Manter os imports no código externo
   apontando para este arquivo garante isolamento
   total da estrutura interna de pastas.

   USO RECOMENDADO
   ─────────────────────────────────────────────
   import audio            from './audio/audio-api.js'; // engine
   import audioState       from './audio/audio-api.js'; // estado
   import { playSound }    from './audio/audio-api.js'; // dispatcher
   import Sound            from './audio/audio-api.js'; // modal UI
   import { installAudioRecovery } from './audio/audio-api.js';

   OU com named imports:
   import { audio, audioState, playSound, Sound,
            mountAudioBtn, destroyAudioBtn,
            installAudioRecovery }
     from './audio/audio-api.js';
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
export { mountAudioBtn, destroyAudioBtn } from './ui/audio-btn.js';

// Recovery
export { installAudioRecovery }    from './recovery/audio-recovery.js';

// Default export → engine (compatibilidade com import audio from './audio')
export { default } from './engine/sfx.js';