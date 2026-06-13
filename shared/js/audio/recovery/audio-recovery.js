// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/recovery/audio-recovery.js
   Recuperação automática do AudioContext entre páginas
   Versão 3.0

   MUDANÇA v2.x → v3.0
   ─────────────────────────────────────────────
   Removida toda tentativa de chamar ctx.resume() fora de gestos
   válidos (click, pointerdown, touchstart, keydown).

   Anteriormente, _tryResume() era chamado em:
   - pointermove (hover fallback) → NÃO é gesto válido para o Chrome
   - visibilitychange              → NÃO é gesto válido
   - popstate                      → NÃO é gesto válido
   - focus                         → NÃO é gesto válido

   Essas chamadas geravam "AudioContext was not allowed to start"
   no console porque o browser rejeita resume() fora de gestos reais.

   Novo comportamento:
   - Nenhum desses eventos tenta mais chamar ctx.resume().
   - Todos chamam apenas audio.resumeCtx(), que reinstala o listener
     de gesto válido em sfx-core.js (click/pointerdown/touchstart/keydown).
   - O resume efetivo acontece apenas no próximo gesto real do usuário.
   ============================================= */

/** Flag de instalação por instância de módulo (uma por página). */
let _installed = false;

/**
 * Instala todos os listeners de recuperação de áudio para a página atual.
 *
 * @param {{ Sound: object, audio: object }} deps
 *   Sound — export default de sound.js
 *   audio — export default de sfx.js
 */
export function installAudioRecovery({ Sound, audio }) {
  if (_installed) return;
  _installed = true;

  /* ── 1. bfcache restore ──────────────────────────────────
     pageshow com persisted=true é o evento mais confiável para
     detectar restauração do cache. Reinit recria o botão flutuante
     (que fica órfão no bfcache) e reinstala o listener de gesto.
  ────────────────────────────────────────────────────────── */
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    Sound.reinit();
    // Reinstala o listener de gesto — o resume ocorrerá no próximo gesto real.
    audio.resumeCtx();
    // Agenda a retomada da música para depois do primeiro gesto.
    _scheduleResumeMusicOnGesture(audio);
  });

  /* ── 2. Visibilidade — aba voltando ao foco ──────────────
     Apenas reinstala o listener de gesto. Não tenta resume() diretamente.
  ────────────────────────────────────────────────────────── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    if (!audio.isUnlocked()) audio.resumeCtx();
  });

  /* ── 3. popstate — navegação por history API ─────────────
     Apenas reinstala o listener de gesto.
  ────────────────────────────────────────────────────────── */
  window.addEventListener('popstate', () => {
    if (!audio.isUnlocked()) audio.resumeCtx();
  });

  /* ── 4. Window focus ─────────────────────────────────────
     Apenas reinstala o listener de gesto.
  ────────────────────────────────────────────────────────── */
  window.addEventListener('focus', () => {
    if (!audio.isUnlocked()) audio.resumeCtx();
  });

  /* ── 5. Unlock via nexus:audioUnlocked ──────────────────
     Quando o ctx finalmente desbloquear (pelo gesto real),
     retoma a última música salva.
  ────────────────────────────────────────────────────────── */
  document.addEventListener('nexus:audioUnlocked', () => {
    _resumeLastTrack(audio);
  }, { once: true });
}

/**
 * Agenda a retomada da música para o próximo evento nexus:audioUnlocked.
 * Chamado após bfcache restore, onde o ctx ainda está suspended.
 */
function _scheduleResumeMusicOnGesture(audio) {
  document.addEventListener('nexus:audioUnlocked', () => {
    _resumeLastTrack(audio);
  }, { once: true });
}

/**
 * Retoma a última faixa salva no localStorage, se houver.
 */
function _resumeLastTrack(audio) {
  try {
    const track = localStorage.getItem('nexus_last_track');
    const mode  = localStorage.getItem('nexus_music_mode') || 'normal';
    if (track && mode !== 'mute') {
      audio.music[track]?.();
    }
  } catch (_) {}
}