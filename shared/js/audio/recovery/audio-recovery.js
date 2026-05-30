// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/recovery/audio-recovery.js
   Recuperação automática do AudioContext entre páginas
   Versão 2.1 — remove parâmetro `full` inerte de _tryResume

   BUGS CORRIGIDOS v1.0 → v2.0
   ─────────────────────────────────────────────
   1. FLOOD DE ERROS: pointermove disparava _tryResume() a cada pixel
      movido (dezenas/segundo), cada um gerando "AudioContext was not
      allowed to start" no console — centenas de erros acumulados.

      Fix: _inflight lock — apenas UMA tentativa de resume por vez.
      Enquanto a Promise está pendente, novos eventos são descartados.

   2. _hoverFallbackInstalled não protegia contra re-entradas async:
      o flag era setado mas a Promise de 200ms permitia overlap.

      Fix: _inflight flag separado do _hoverFallbackInstalled.

   MUDANÇA v2.0 → v2.1
   ─────────────────────────────────────────────
   Removido o parâmetro `full` de _tryResume(). Uma versão anterior
   documentava dois caminhos distintos (full/light) referenciando
   audio.getCtxForRecovery(), mas esse método nunca existiu em sfx.js.
   Ambos os ramos sempre chamavam audio.resumeCtx(). O parâmetro era
   inerte e gerava confusão. _tryResume() agora recebe apenas `audio`.
   ============================================= */

/** Flag de instalação por instância de módulo (uma por página). */
let _installed = false;

/**
 * Lock de inflight — impede que múltiplas tentativas de resume rodem
 * simultaneamente. Um único resume em andamento é suficiente.
 */
let _resumeInflight = false;

/**
 * Timestamp da última tentativa de resume — throttle de 500 ms.
 * Evita flood mesmo se o lock fosse burlado de alguma forma.
 */
let _lastResumeAttempt = 0;
const _RESUME_THROTTLE_MS = 500;

/**
 * Tenta resumir o AudioContext de forma silenciosa.
 * Possui lock de inflight e throttle para evitar flood de erros.
 * Retorna Promise<boolean> — true se ctx ficou running.
 *
 * Sempre chama audio.resumeCtx(), que é idempotente nos gain nodes:
 * recria-os apenas se estiverem null (o que ocorre após bfcache restore),
 * e reinstala o listener de gesto. O custo extra no hover fallback é
 * desprezível porque o throttle de 500 ms garante no máximo 2 chamadas/s.
 *
 * Nota: o parâmetro `full` foi removido. Uma versão anterior documentava
 * um caminho "leve" via audio.getCtxForRecovery() para o hover fallback,
 * mas esse método nunca existiu em sfx.js. Ambos os ramos chamavam
 * audio.resumeCtx() de qualquer forma, tornando o parâmetro inerte.
 * A API foi simplificada para refletir o comportamento real.
 *
 * @param {object} audio — instância exportada de sfx.js
 */
async function _tryResume(audio) {
  if (audio.isUnlocked()) return true;

  const now = Date.now();
  if (_resumeInflight)                              return false;
  if (now - _lastResumeAttempt < _RESUME_THROTTLE_MS) return false;

  _resumeInflight    = true;
  _lastResumeAttempt = now;

  try {
    audio.resumeCtx();    // reset gains (se null) + ctx.resume() + reinstala listener de gesto
    // Aguarda até 300 ms para o ctx sair de 'suspended'
    await new Promise(resolve => setTimeout(resolve, 300));
    return audio.isUnlocked();
  } catch (_) {
    return false;
  } finally {
    _resumeInflight = false;
  }
}

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
     (que fica órfão no bfcache) e força um resume().
  ────────────────────────────────────────────────────────── */
  window.addEventListener('pageshow', async (e) => {
    if (!e.persisted) return;
    console.log('[audio-recovery] pageshow persisted — reinit');
    Sound.reinit();                    // recria botão + audio.resumeCtx() interno
    await _tryResume(audio);
    _installHoverFallback(audio);
  });

  /* ── 2. Visibilidade — aba voltando ao foco ──────────────
     Browsers suspendem AudioContext de tabs em segundo plano.
  ────────────────────────────────────────────────────────── */
  document.addEventListener('visibilitychange', async () => {
    if (document.hidden) return;
    console.log('[audio-recovery] visibilitychange visible — tentando resume');
    const ok = await _tryResume(audio);
    if (!ok) _installHoverFallback(audio);
  });

  /* ── 3. popstate — navegação por history API ─────────────
     Captura history.back() / history.forward() sem bfcache.
  ────────────────────────────────────────────────────────── */
  window.addEventListener('popstate', async () => {
    console.log('[audio-recovery] popstate — tentando resume');
    const ok = await _tryResume(audio);
    if (!ok) _installHoverFallback(audio);
  });

  /* ── 4. Window focus ─────────────────────────────────────
     Alt+Tab de volta ao browser ou toque na aba.
  ────────────────────────────────────────────────────────── */
  window.addEventListener('focus', async () => {
    if (audio.isUnlocked()) return;
    console.log('[audio-recovery] window focus — tentando resume');
    const ok = await _tryResume(audio);
    if (!ok) _installHoverFallback(audio);
  });

  /* ── Verificação inicial ─────────────────────────────────
     Página carregou com ctx suspended — instala hover fallback.
  ────────────────────────────────────────────────────────── */
  if (!audio.isUnlocked()) {
    _installHoverFallback(audio);
  }
}

/* ── Hover fallback (hover-only pages) ──────────────────────
   Aguarda o primeiro pointermove para tentar resume().
   O lock _resumeInflight + throttle _RESUME_THROTTLE_MS garantem
   que não importa quantos pixels o mouse percorra — apenas uma
   tentativa por 500 ms chega até o AudioContext.

   Comportamento:
   - Instala-se apenas uma vez (_hoverFallbackInstalled).
   - Remove-se sozinho no primeiro resume() bem-sucedido.
   - Remove-se sozinho após 30 s (touch devices: o click do sfx.js
     cuida do resume, não precisa de pointermove).
─────────────────────────────────────────────────────────── */

let _hoverFallbackInstalled = false;
let _hoverFallbackTimer     = null;

function _installHoverFallback(audio) {
  if (_hoverFallbackInstalled) return;
  if (audio.isUnlocked())      return;

  _hoverFallbackInstalled = true;
  console.log('[audio-recovery] hover fallback instalado');

  async function _onMove() {
    if (audio.isUnlocked()) {
      // ctx já está running (provavelmente unlock veio de outro evento)
      _cleanup();
      return;
    }
    // _tryResume tem throttle interno — chamadas em excesso são no-ops baratos
    const ok = await _tryResume(audio);
    if (ok) {
      console.log('[audio-recovery] ctx resumido via pointermove');
      _cleanup();
    }
  }

  function _cleanup() {
    document.removeEventListener('pointermove', _onMove, { capture: true });
    if (_hoverFallbackTimer) {
      clearTimeout(_hoverFallbackTimer);
      _hoverFallbackTimer = null;
    }
    _hoverFallbackInstalled = false;
  }

  document.addEventListener('pointermove', _onMove, { capture: true, passive: true });

  // Timeout de segurança: remove após 30 s (touch devices)
  _hoverFallbackTimer = setTimeout(_cleanup, 30_000);
}