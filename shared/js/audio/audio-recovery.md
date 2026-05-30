/* =============================================
   NEXUS STUDY — audio-recovery — GUIA DE USO
   Como integrar em cada página do projeto
   =============================================

   INSTALAÇÃO ÚNICA (por página)
   ─────────────────────────────────────────────
   Adicione as duas linhas marcadas com ← NOVO em cada arquivo de página.
   Substitui o bloco `window.addEventListener('pageshow', ...)` manual
   que existia em algumas páginas (ex: disciplinas_init.js).

   ─────────────────────────────────────────────
   EXEMPLO: disciplinas_init.js (antes / depois)
   ─────────────────────────────────────────────

   // ANTES — tratamento manual e incompleto:
   import Sound from '../../shared/js/audio/sound.js';
   import { playSound } from '../../shared/js/audio/play.js';

   document.addEventListener('DOMContentLoaded', async () => {
     Sound.init();
     await Sound.waitUntilReady();
     // ...
   });

   window.addEventListener('pageshow', e => {
     if (e.persisted) Sound.reinit();   // ← só cobria bfcache
   });

   // DEPOIS — cobertura completa com audio-recovery:
   import Sound from '../../shared/js/audio/sound.js';
   import audio from '../../shared/js/audio/sfx.js';                  // ← NOVO
   import { installAudioRecovery } from '../../shared/js/audio/audio-recovery.js'; // ← NOVO
   import { playSound } from '../../shared/js/audio/play.js';

   document.addEventListener('DOMContentLoaded', async () => {
     Sound.init();
     installAudioRecovery({ Sound, audio });                          // ← NOVO (substitui pageshow manual)
     await Sound.waitUntilReady();
     // ... resto da init
   });

   // Remova o bloco window.addEventListener('pageshow', ...) manual — agora está dentro do recovery.

   ─────────────────────────────────────────────
   EXEMPLO: index.js (página inicial)
   ─────────────────────────────────────────────

   import Sound from './shared/js/audio/sound.js';
   import audio from './shared/js/audio/sfx.js';                     // ← NOVO
   import { installAudioRecovery } from './shared/js/audio/audio-recovery.js'; // ← NOVO
   import { playSound } from './shared/js/audio/play.js';

   async function init() {
     Sound.init();
     installAudioRecovery({ Sound, audio });                         // ← NOVO
     // ... resto igual
   }

   ─────────────────────────────────────────────
   COBERTURA DE CENÁRIOS
   ─────────────────────────────────────────────

   Cenário                           | Evento tratado        | Resultado
   ──────────────────────────────────┼───────────────────────┼──────────────────────
   Clicar na logo → voltar (bfcache) | pageshow persisted    | reinit() + resumeCtx()
   history.back() sem bfcache        | popstate              | resumeCtx()
   Alt+Tab de volta ao browser       | focus + visibility    | resumeCtx()
   Aba em segundo plano → foco       | visibilitychange      | resumeCtx()
   Página hover-only (sem click)     | pointermove fallback  | resumeCtx() no 1º hover
   Reload normal                     | sfx.js eager ctx      | comportamento existente

   ─────────────────────────────────────────────
   PÁGINAS QUE PRECISAM DA ATUALIZAÇÃO
   ─────────────────────────────────────────────

   Busque por arquivos que contenham:
     Sound.init()
   e adicione as duas linhas de installAudioRecovery() logo após.

   Páginas identificadas no projeto:
   - index.js
   - quiz/disciplinas/disciplinas_init.js
   - quiz/quiz.html (script inline, se houver)
   - resumo/resumo_init.js (verificar)
   - games/jogo_init.js (verificar)
   - area_pessoal/pessoal_init.js (verificar)

   ─────────────────────────────────────────────
   POR QUE pointermove E NÃO mousemove?
   ─────────────────────────────────────────────

   pointermove funciona tanto em desktop (mouse) quanto em dispositivos
   touch (dedo/stylus), enquanto mousemove só dispara em desktop.
   O { passive: true } garante que não há penalidade de scroll.
   ============================================= */