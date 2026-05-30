/* =============================================
   NEXUS STUDY — shared/js/audio/ui/vol-slider.js
   Módulo de Volume Refatorado — v2.0

   RESPONSABILIDADE
   ─────────────────────────────────────────────
   Exporta makeVolumeSlider(opts) — fábrica que
   instancia e gerencia UM slider de volume com:
     • posicionamento pixel-perfect do thumb
     • snap points com zona de atração
     • badge de snap animado
     • marcadores de snap alinhados
     • ResizeObserver para layout reativo
     • eventos hover / drag sem janking
     • callbacks onInput / onSnap / onRelease

   USO EM sound.js
   ─────────────────────────────────────────────
   import makeVolumeSlider from './vol-slider.js';

   // Cria os dois sliders após o DOM do modal existir:
   const musicSlider = makeVolumeSlider({
     wrapId:   'snd-sliderGroupMusic',
     inputId:  'snd-musicSlider',
     thumbId:  'snd-musicThumb',
     fillId:   'snd-musicFill',
     valId:    'snd-musicValDisplay',
     badgeId:  'snd-musicBadge',
     markIds: ['snd-musicMark50', 'snd-musicMark100', 'snd-musicMark150'],
     onInput:  v => audioState.setVolume('music', v),
   });

   // Ao abrir o modal, sincroniza valor externo:
   musicSlider.setValue(audioState.getVolumes().music);

   // Ao resetar:
   musicSlider.setValue(0.5);

   // Ao desmontar (cleanup):
   musicSlider.destroy();
   ============================================= */

/* ── Constantes ── */

const SLIDER_MAX  = 150;      // input[max]  → valor real = val/100
const THUMB_PX    = 22;       // largura do .vol-thumb em px (deve bater com o CSS)
const SNAP_POINTS = [50, 100, 150];  // valores inteiros (0–150)
const SNAP_ZONE   = 4;        // px de atração (±4 unidades do slider)

const SNAP_LABELS = {
  50:  '0.5×',
  100: '1.0×',
  150: '1.5×',
};

/**
 * thumbOffsetPx(val, trackW)
 * ─────────────────────────────────────────────
 * Calcula a posição em px do CENTRO do thumb para
 * um dado valor, compensando as margens que o
 * browser reserva nas extremidades da trilha.
 *
 * O browser comprime o percurso real do thumb para:
 *   [THUMB_PX/2 … trackW - THUMB_PX/2]
 *
 * Portanto:
 *   px = (val / MAX) * (trackW - THUMB_PX) + THUMB_PX / 2
 *
 * Essa fórmula garante alinhamento pixel-perfect
 * entre o thumb visual e o thumb nativo (invisible).
 *
 * @param {number} val    — valor inteiro do slider (0–150)
 * @param {number} trackW — largura total do <input> em px
 * @returns {number} posição em px (left do centro do thumb)
 */
function thumbOffsetPx(val, trackW) {
  return (val / SLIDER_MAX) * (trackW - THUMB_PX) + THUMB_PX / 2;
}

/**
 * makeVolumeSlider(opts)
 * ─────────────────────────────────────────────
 * Fábrica de slider de volume. Retorna { setValue, destroy }.
 *
 * @param {object}   opts
 * @param {string}   opts.wrapId   — id do .vol-track-wrap (recebe classes CSS)
 * @param {string}   opts.inputId  — id do <input type="range">
 * @param {string}   opts.thumbId  — id do .vol-thumb (div visual)
 * @param {string}   opts.fillId   — id do .vol-track-fill
 * @param {string}   opts.valId    — id do display de valor (ex: "0.50")
 * @param {string}   opts.badgeId  — id do .vol-badge (SNAP label)
 * @param {string[]} opts.markIds  — ids dos 3 .vol-snap-mark, na ordem de SNAP_POINTS
 * @param {Function} [opts.onInput]   — cb(realValue: 0–1.5) chamado a cada input
 * @param {Function} [opts.onSnap]    — cb(realValue) chamado quando encaixa num snap point
 * @param {Function} [opts.onRelease] — cb(realValue) chamado no mouseup/touchend
 */
function makeVolumeSlider(opts) {
  const {
    wrapId, inputId, thumbId, fillId, valId, badgeId, markIds,
    onInput, onSnap, onRelease,
  } = opts;

  /* ── Referências ao DOM ── */
  const wrap  = document.getElementById(wrapId);
  const input = document.getElementById(inputId);
  const thumb = document.getElementById(thumbId);
  const fill  = document.getElementById(fillId);
  const valEl = document.getElementById(valId);
  const badge = document.getElementById(badgeId);

  const marks = markIds.map((id, i) => ({
    el:      document.getElementById(id),
    snapVal: SNAP_POINTS[i],
  }));

  if (!wrap || !input || !thumb || !fill || !valEl) {
    console.warn('[vol-slider] makeVolumeSlider: elementos do DOM não encontrados', opts);
    return { setValue: () => {}, destroy: () => {} };
  }

  /* ── Estado interno ── */
  let rafId    = null;
  let isDragging = false;

  /* ── Layout (coloca thumb + fill + marks) ── */

  function layout() {
    const trackW = input.getBoundingClientRect().width;
    if (trackW === 0) return;   // ainda não visível

    const raw = parseInt(input.value, 10);
    const px  = thumbOffsetPx(raw, trackW);

    // Thumb: só atualiza left (sem transition — motion é via CSS will-change)
    thumb.style.left = px + 'px';

    // Fill: percentagem simples (não precisa compensar thumb)
    fill.style.width = (raw / SLIDER_MAX * 100).toFixed(3) + '%';

    // Valor
    valEl.textContent = (raw / 100).toFixed(2);

    // Snap state
    const snapped = SNAP_POINTS.includes(raw);
    wrap.classList.toggle('snapped', snapped);

    if (badge) {
      badge.classList.toggle('visible', snapped);
      if (snapped) badge.textContent = SNAP_LABELS[raw] ?? 'SNAP';
    }

    // Marks: posição exata + classe de proximidade
    marks.forEach(({ el, snapVal }) => {
      if (!el) return;
      const mPx  = thumbOffsetPx(snapVal, trackW);
      const dist = Math.abs(raw - snapVal);
      el.style.left = mPx + 'px';
      el.classList.toggle('active', dist === 0);
      el.classList.toggle('near',   dist > 0 && dist <= SNAP_ZONE * 3);
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

  function handleMousedown() {
    isDragging = true;
    wrap.classList.add('dragging');
  }

  function handleUp() {
    if (!isDragging) return;
    isDragging = false;
    wrap.classList.remove('dragging');
    const realVal = parseInt(input.value, 10) / 100;
    onRelease?.(realVal);
  }

  input.addEventListener('input',      handleInput);
  input.addEventListener('mousedown',  handleMousedown);
  input.addEventListener('touchstart', handleMousedown, { passive: true });
  window.addEventListener('mouseup',   handleUp);
  window.addEventListener('touchend',  handleUp);

  /* ── ResizeObserver: reposiciona ao redimensionar ── */

  const ro = new ResizeObserver(scheduleLayout);
  ro.observe(input);

  /* ── Layout inicial ── */
  // rAF garante que o browser calculou dimensões após inserção no DOM
  requestAnimationFrame(scheduleLayout);

  /* ── API pública ── */

  /**
   * setValue(realValue)
   * Define o valor do slider a partir do valor real (0.0 – 1.5).
   * Ex.: setValue(0.5) → slider em 50 (ponto padrão).
   *
   * @param {number} realValue — volume real (0.0 a 1.5)
   */
  function setValue(realValue) {
    const clamped = Math.max(0, Math.min(1.5, realValue));
    input.value = Math.round(clamped * 100);
    scheduleLayout();
  }

  /**
   * destroy()
   * Remove listeners e desconecta o ResizeObserver.
   * Chame ao desmontar o modal definitivamente.
   */
  function destroy() {
    input.removeEventListener('input',      handleInput);
    input.removeEventListener('mousedown',  handleMousedown);
    input.removeEventListener('touchstart', handleMousedown);
    window.removeEventListener('mouseup',   handleUp);
    window.removeEventListener('touchend',  handleUp);
    ro.disconnect();
    if (rafId) cancelAnimationFrame(rafId);
  }

  return { setValue, destroy, layout };
}

export default makeVolumeSlider;