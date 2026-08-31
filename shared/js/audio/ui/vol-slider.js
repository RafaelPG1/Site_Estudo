/* =============================================
   NEXUS STUDY — shared/js/audio/ui/vol-slider.js
   Módulo de Volume — v3.0 (redesign)

   RESPONSABILIDADE
   ─────────────────────────────────────────────
   Exporta makeVolumeSlider(opts) — fábrica que
   instancia e gerencia UM slider de volume com:
     • posicionamento pixel-perfect do thumb E do fill
     • snap points com zona de atração
     • badge de snap animado
     • marcadores de snap alinhados
     • ResizeObserver para layout reativo (resize/DPI-safe)
     • eventos hover / drag / teclado / wheel sem jank
     • callbacks onInput / onSnap / onRelease

   O QUE MUDOU NA v3 (bugfix + redesign)
   ─────────────────────────────────────────────
   O bug visual do slider antigo NÃO estava na posição do thumb
   (thumbOffsetPx já compensava corretamente o raio do thumb).
   Estava no PREENCHIMENTO (.vol-track-fill), que usava uma
   percentagem simples da largura TOTAL da track:

       fill.width = (val / MAX) * 100%          ← ERRADO

   Isso faz o fill terminar no fim físico da track, enquanto o
   centro do thumb pára meio thumb-width ANTES disso (porque o
   navegador reserva THUMB_PX/2 de margem em cada ponta para o
   thumb não "vazar" da trilha). Resultado: nos extremos, a borda
   do preenchimento e o centro do thumb ficam ~11px desalinhados.

   A correção usa a MESMA fórmula (mesma "usable width") para o
   fill e para o thumb, então os dois são sempre consistentes:

       usableWidth = trackW - THUMB_PX
       thumbCenterPx = (val / MAX) * usableWidth + THUMB_PX / 2
       fill.width    = thumbCenterPx                ← CORRETO
                        (o preenchimento sempre termina
                         exatamente no centro do thumb)

   USO EM sound.js
   ─────────────────────────────────────────────
   import makeVolumeSlider from './vol-slider.js';

   const sfxSlider = makeVolumeSlider({
     wrapId:   'asx-vol-wrap',
     inputId:  'asx-vol-input',
     thumbId:  'asx-vol-thumb',
     fillId:   'asx-vol-fill',
     valId:    'asx-vol-value',
     badgeId:  'asx-vol-badge',
     markIds: ['asx-vol-mark-50', 'asx-vol-mark-100', 'asx-vol-mark-150'],
     onInput:  v => audioState.setVolume('sfx', v),
   });

   sfxSlider.setValue(audioState.getVolumes().sfx);
   sfxSlider.destroy();
   ============================================= */

/* ── Constantes ── */

const SLIDER_MAX  = 150;      // input[max]  → valor real = val/100
const THUMB_PX     = 16;       // largura do .asx-vol-thumb em px (deve bater com o CSS)
const SNAP_POINTS  = [50, 100, 150];  // valores inteiros (0–150)
const SNAP_ZONE    = 4;        // px de atração (±4 unidades do slider)
const WHEEL_STEP    = 2;       // unidades por "tick" de scroll

const SNAP_LABELS = {
  50:  '0.5×',
  100: '1.0×',
  150: '1.5×',
};

/**
 * usablePx(val, trackW)
 * ─────────────────────────────────────────────
 * Calcula a posição em px do CENTRO do thumb (e, por extensão,
 * o fim correto do preenchimento) para um dado valor.
 *
 * O percurso real do centro do thumb é comprimido para:
 *   [THUMB_PX/2 … trackW - THUMB_PX/2]
 *
 * Portanto:
 *   px = (val / MAX) * (trackW - THUMB_PX) + THUMB_PX / 2
 *
 * Esta é a ÚNICA fórmula de posicionamento do módulo. Thumb,
 * fill e marks usam exatamente esta função — é isso que garante
 * que nunca fiquem visualmente dessincronizados entre si.
 *
 * @param {number} val    — valor inteiro do slider (0–150)
 * @param {number} trackW — largura total do <input> em px
 * @returns {number} posição em px (centro do thumb / fim do fill)
 */
function usablePx(val, trackW) {
  if (trackW <= THUMB_PX) return trackW / 2;
  return (val / SLIDER_MAX) * (trackW - THUMB_PX) + THUMB_PX / 2;
}

/**
 * makeVolumeSlider(opts)
 * ─────────────────────────────────────────────
 * Fábrica de slider de volume. Retorna { setValue, destroy, layout }.
 */
function makeVolumeSlider(opts) {
  const {
    wrapId, inputId, thumbId, fillId, valId, badgeId, markIds = [],
    onInput, onSnap, onRelease,
  } = opts;

  /* ── Referências ao DOM ── */
  const wrap  = document.getElementById(wrapId);
  const input = document.getElementById(inputId);
  const thumb = document.getElementById(thumbId);
  const fill  = document.getElementById(fillId);
  const valEl = document.getElementById(valId);
  const badge = badgeId ? document.getElementById(badgeId) : null;

  const marks = markIds.map((id, i) => ({
    el:      document.getElementById(id),
    snapVal: SNAP_POINTS[i],
  }));

  if (!wrap || !input || !thumb || !fill || !valEl) {
    console.warn('[vol-slider] makeVolumeSlider: elementos do DOM não encontrados', opts);
    return { setValue: () => {}, destroy: () => {}, layout: () => {} };
  }

  /* ── Estado interno ── */
  let rafId      = null;
  let isDragging = false;

  /* ── Layout (posiciona thumb + fill + marks) ── */

  function layout() {
    const trackW = input.getBoundingClientRect().width;
    if (trackW === 0) return; // ainda não visível (ex.: modal fechado)

    const raw = parseInt(input.value, 10);
    const px  = usablePx(raw, trackW);

    // Thumb: left = centro exato (sem transition de posição — via rAF)
    thumb.style.left = px + 'px';

    // Fill: termina exatamente onde o thumb termina (mesma fórmula)
    fill.style.width = px + 'px';

    // Valor
    const real = raw / 100;
    valEl.textContent = real.toFixed(2) + '×';
    input.setAttribute('aria-valuetext', real.toFixed(2) + 'x');

    // Snap state
    const snapped = SNAP_POINTS.includes(raw);
    wrap.classList.toggle('is-snapped', snapped);

    if (badge) {
      badge.classList.toggle('is-visible', snapped);
      if (snapped) badge.textContent = SNAP_LABELS[raw] ?? 'SNAP';
    }

    // Marks: posição exata (mesma fórmula) + classe de proximidade
    marks.forEach(({ el, snapVal }) => {
      if (!el) return;
      const mPx  = usablePx(snapVal, trackW);
      const dist = Math.abs(raw - snapVal);
      el.style.left = mPx + 'px';
      el.classList.toggle('is-active', dist === 0);
      el.classList.toggle('is-near',   dist > 0 && dist <= SNAP_ZONE * 3);
    });
  }

  function scheduleLayout() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => { rafId = null; layout(); });
  }

  /* ── Snap: atrai o slider para pontos fixos ── */

  function applySnap() {
    let val = parseInt(input.value, 10);
    for (const sp of SNAP_POINTS) {
      if (Math.abs(val - sp) <= SNAP_ZONE) {
        val = sp;
        input.value = val;
        break;
      }
    }
    return val;
  }

  /* ── Event listeners ── */

  function handleInput() {
    const val     = applySnap();
    const realVal = val / 100;
    scheduleLayout();
    onInput?.(realVal);
    if (SNAP_POINTS.includes(val)) onSnap?.(realVal);
  }

  function handlePointerDown() {
    isDragging = true;
    wrap.classList.add('is-dragging');
  }

  function handleUp() {
    if (!isDragging) return;
    isDragging = false;
    wrap.classList.remove('is-dragging');
    const realVal = parseInt(input.value, 10) / 100;
    onRelease?.(realVal);
  }

  // Scroll do mouse ajusta o volume em pequenos incrementos.
  function handleWheel(e) {
    e.preventDefault();
    const dir = e.deltaY > 0 ? -1 : 1;
    let val = parseInt(input.value, 10) + dir * WHEEL_STEP;
    val = Math.max(0, Math.min(SLIDER_MAX, val));
    input.value = val;
    handleInput();
    onRelease?.(val / 100);
  }

  input.addEventListener('input',      handleInput);
  input.addEventListener('mousedown',  handlePointerDown);
  input.addEventListener('touchstart', handlePointerDown, { passive: true });
  input.addEventListener('wheel',      handleWheel,        { passive: false });
  window.addEventListener('mouseup',   handleUp);
  window.addEventListener('touchend',  handleUp);

  /* ── ResizeObserver: reposiciona ao redimensionar / mudar DPI ── */

  const ro = new ResizeObserver(scheduleLayout);
  ro.observe(input);

  /* ── Layout inicial ── */
  // rAF garante que o browser já calculou dimensões após inserção no DOM
  requestAnimationFrame(scheduleLayout);

  /* ── API pública ── */

  /**
   * setValue(realValue)
   * Define o valor do slider a partir do valor real (0.0 – 1.5).
   */
  function setValue(realValue) {
    const clamped = Math.max(0, Math.min(1.5, realValue));
    input.value = Math.round(clamped * 100);
    scheduleLayout();
  }

  /**
   * destroy()
   * Remove listeners e desconecta o ResizeObserver.
   */
  function destroy() {
    input.removeEventListener('input',      handleInput);
    input.removeEventListener('mousedown',  handlePointerDown);
    input.removeEventListener('touchstart', handlePointerDown);
    input.removeEventListener('wheel',      handleWheel);
    window.removeEventListener('mouseup',   handleUp);
    window.removeEventListener('touchend',  handleUp);
    ro.disconnect();
    if (rafId) cancelAnimationFrame(rafId);
  }

  return { setValue, destroy, layout };
}

export default makeVolumeSlider;
export { usablePx, SLIDER_MAX, THUMB_PX, SNAP_POINTS };