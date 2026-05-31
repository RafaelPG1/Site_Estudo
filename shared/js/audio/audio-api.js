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
   import { audio, audioState, playSound, Sound,
            mountAudioBtn, destroyAudioBtn,
            mountMusicBtn, destroyMusicBtn,
            setMusicMode, getMusicMode,
            installAudioRecovery }
     from './audio/audio-api.js';
   ============================================= */

// Engine
export { default as audio }           from './engine/sfx.js';
export { catalog }                     from './engine/sfx.js';
export { playSound }                   from './engine/play.js';

// Estado
export { default as audioState }      from './state/audio-state.js';

// UI — botões flutuantes (SFX + Música unificados)
export { default as Sound }            from './ui/sound.js';
export { default as makeVolumeSlider } from './ui/vol-slider.js';
export {
  mountAudioBtn,
  destroyAudioBtn,
  mountMusicBtn,
  destroyMusicBtn,
  getMusicMode,
  setMusicMode,
  subscribeMusicMode,
  unsubscribeMusicMode,
} from './ui/audio-btns.js';

// Recovery
export { installAudioRecovery }        from './recovery/audio-recovery.js';

// Default export → engine (compatibilidade com import audio from './audio')
export { default }                     from './engine/sfx.js';