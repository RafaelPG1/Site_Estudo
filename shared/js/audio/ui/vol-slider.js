/* =============================================
   NEXUS STUDY — shared/js/audio/ui/vol-slider.js
   Módulo de Volume — v3.2 (bugfix de arraste dentro de modal escalado)

   MUDANÇA v3.1 → v3.2
   ─────────────────────────────────────────────
   O fix da v3.1 (pxToValue como inversa de usablePx) resolvia o
   desalinhamento causado pelo drag nativo do <input type=range>, mas
   um segundo bug — maior — ficou escondido: quando o slider está
   dentro de um ancestral com `transform: scale(...)` (ex.: o modal de
   áudio, visto em produção com `transform: matrix(0.98,0,0,0.98,0,16)`
   + mais algum scale adicional em ancestral acima dele, escala total
   medida ≈0.83), existem DOIS espaços de coordenadas diferentes:

     • espaço de LAYOUT (input.offsetWidth) — nunca afetado por
       transform; é o espaço em que thumb.style.left/fill.style.width
       são interpretados ANTES do transform do ancestral ser aplicado.
     • espaço RENDERIZADO (input.getBoundingClientRect()) — já com
       todos os transforms de ancestrais aplicados; é o espaço em que
       clientX de um PointerEvent chega.

   layout() estava usando getBoundingClientRect() (espaço renderizado)
   para calcular o valor de `left`/`width` — só que essas são
   propriedades de LAYOUT, então o browser as escala DE NOVO,
   automaticamente, pelo transform do ancestral. Resultado: a escala
   era aplicada duas vezes, deslocando o thumb proporcionalmente ao
   quanto o ancestral escala (medido: ~49px de erro com scale≈0.83,
   bem maior que os "~5px" originais — o relato inicial deve ter sido
   num ponto/escala onde o erro proporcional aparecia menor).

   CORREÇÃO (duas partes, cada função no seu espaço correto):
     1. layout() agora usa input.offsetWidth (espaço de layout) com
        THUMB_PX puro — o transform do ancestral escala o resultado
        sozinho, automaticamente, então não pré-escalamos nada aqui.
     2. _applyPointerX() continua em getBoundingClientRect() (espaço
        renderizado, correto pra clientX) — mas agora corrige THUMB_PX
        pela escala real via effectiveThumbPx(), já que ali thumbPx
        precisa estar no MESMO espaço (renderizado) que px/trackW.

   MUDANÇA v3.0 → v3.1
   ─────────────────────────────────────────────
   O arraste do mouse/touch estava ~5px fora de posição em relação ao
   cursor. Causa: o valor era decidido pelo algoritmo NATIVO do
   <input type="range"> durante o drag, que assume a largura de thumb
   que o CSS do browser enxerga — podendo divergir do THUMB_PX usado
   aqui no JS para desenhar o thumb/fill customizados. Agora o próprio
   módulo calcula o valor a partir da posição do ponteiro (pxToValue,
   inversa exata de usablePx), então clique/arraste e desenho nunca
   mais podem divergir. Ver pxToValue() e handlePointerDown/Move/Up.
   ─────────────────────────────────────────────
   O arraste do mouse/touch estava ~5px fora de posição em relação ao
   cursor. Causa: o valor era decidido pelo algoritmo NATIVO do
   <input type="range"> durante o drag, que assume a largura de thumb
   que o CSS do browser enxerga — podendo divergir do THUMB_PX usado
   aqui no JS para desenhar o thumb/fill customizados. Agora o próprio
   módulo calcula o valor a partir da posição do ponteiro (pxToValue,
   inversa exata de usablePx), então clique/arraste e desenho nunca
   mais podem divergir. Ver pxToValue() e handlePointerDown/Move/Up.

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
function usablePx(val, trackW, thumbPx = THUMB_PX) {
  if (trackW <= thumbPx) return trackW / 2;
  return (val / SLIDER_MAX) * (trackW - thumbPx) + thumbPx / 2;
}

/**
 * pxToValue(px, trackW)
 * ─────────────────────────────────────────────
 * Inversa exata de usablePx(). Convertemos a posição do ponteiro
 * (relativa à track) diretamente para um valor do slider, usando a
 * MESMA fórmula usada para desenhar o thumb/fill.
 *
 * BUG CORRIGIDO (v3 → v3.1)
 * ─────────────────────────────────────────────
 * Antes, o arraste era feito pelo próprio <input type="range"> nativo:
 * o browser calcula o valor a partir do clique usando a largura do
 * thumb QUE ELE PRÓPRIO enxerga (via CSS ::-webkit-slider-thumb /
 * -moz-range-thumb), que não é necessariamente igual a THUMB_PX usado
 * aqui no JS para desenhar o thumb/fill customizados. Qualquer
 * diferença entre os dois gera um desalinhamento sistemático entre o
 * ponto clicado e a posição visual do thumb (relatado como "~5px para
 * a esquerda"), que cresce em direção às bordas da track.
 *
 * A correção: o valor passa a ser calculado por NÓS, com a mesma
 * fórmula usada para desenhar, então clique/arraste e desenho nunca
 * podem divergir — não importa o que o CSS do thumb nativo diga.
 *
 * @param {number} px      — posição do ponteiro relativa à borda esquerda da track, em px
 * @param {number} trackW  — largura RENDERIZADA do <input> em px (getBoundingClientRect)
 * @param {number} [thumbPx] — largura EFETIVA do thumb no mesmo espaço de px de trackW
 *                              (default: THUMB_PX, sem nenhum scale aplicado)
 * @returns {number} valor inteiro do slider (0–150), já clampado
 */
function pxToValue(px, trackW, thumbPx = THUMB_PX) {
  if (trackW <= thumbPx) return 0;
  const ratio = (px - thumbPx / 2) / (trackW - thumbPx);
  const clamped = Math.max(0, Math.min(1, ratio));
  return Math.round(clamped * SLIDER_MAX);
}

/**
 * effectiveThumbPx(trackW, layoutW)
 * ─────────────────────────────────────────────
 * Usado só por _applyPointerX(): converte o THUMB_PX (tamanho
 * declarado, espaço de layout) pro mesmo espaço RENDERIZADO em que
 * clientX/getBoundingClientRect operam. layout() NÃO precisa disso —
 * ele trabalha inteiramente em espaço de layout (offsetWidth), onde
 * THUMB_PX já bate direto, sem conversão.
 *
 * Mede a escala real em tempo de execução comparando a largura
 * renderizada (trackW) com a largura de LAYOUT do próprio input
 * (offsetWidth, que nunca é afetado por transform) e aplica essa
 * razão a THUMB_PX. Não importa de onde vem o scale (modal, body,
 * html, ou combinação de vários níveis) — a razão captura o efeito
 * total automaticamente, sem precisar rastrear cada ancestral.
 *
 * @param {number} trackW  — largura renderizada (getBoundingClientRect().width)
 * @param {number} layoutW — largura de layout (offsetWidth), sem scale
 * @returns {number} THUMB_PX convertido pro espaço de px de trackW
 */
function effectiveThumbPx(trackW, layoutW) {
  if (!layoutW) return THUMB_PX;
  const scale = trackW / layoutW;
  return THUMB_PX * scale;
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
    // IMPORTANTE: trackW aqui precisa ser a largura de LAYOUT
    // (offsetWidth), NÃO a renderizada (getBoundingClientRect).
    // thumb.style.left / fill.style.width são propriedades de CSS que
    // vivem no espaço de LAYOUT — se o slider estiver dentro de um
    // ancestral com transform:scale(...) (ex.: o modal de áudio,
    // visto em produção com scale~0.83 total), o browser escala esses
    // valores de left/width automaticamente, por conta própria, junto
    // com tudo mais na composição. Usar a largura RENDERIZADA aqui
    // aplicaria a escala DUAS vezes (uma explícita no cálculo, outra
    // implícita pelo transform), deslocando o thumb proporcionalmente
    // ao quanto o ancestral escala — medido em produção: ~49px de erro
    // com um scale total de ~0.83. THUMB_PX permanece sem correção
    // aqui de propósito: já está em espaço de layout, igual trackW.
    const trackW = input.offsetWidth;
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

  // Aplica um valor calculado a partir da posição do ponteiro (px
  // relativo à track) e dispara o mesmo caminho do handleInput normal
  // — mantém snap, callbacks e o layout todos consistentes.
  function _applyPointerX(clientX) {
    const rect    = input.getBoundingClientRect();
    const thumbPx = effectiveThumbPx(rect.width, input.offsetWidth);
    const val     = pxToValue(clientX - rect.left, rect.width, thumbPx);
    if (parseInt(input.value, 10) !== val) {
      input.value = val;
      handleInput();
    }
  }

  let _pointerId = null;

  function handlePointerDown(e) {
    isDragging = true;
    wrap.classList.add('is-dragging');
    _pointerId = e.pointerId;
    // Captura o ponteiro no próprio input: o pointermove continua
    // chegando aqui mesmo se o cursor sair da track durante o arraste.
    input.setPointerCapture?.(e.pointerId);
    _applyPointerX(e.clientX);
    // Impede o browser de também mover o thumb nativo pelo seu próprio
    // cálculo (que é a causa do desalinhamento) — a partir daqui,
    // *nós* somos a única fonte de verdade da posição.
    e.preventDefault();
  }

  function handlePointerMove(e) {
    if (!isDragging || (_pointerId !== null && e.pointerId !== _pointerId)) return;
    _applyPointerX(e.clientX);
  }

  function handlePointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    wrap.classList.remove('is-dragging');
    if (_pointerId !== null) {
      input.releasePointerCapture?.(_pointerId);
      _pointerId = null;
    }
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

  // 'input' continua ativo para navegação por teclado (setas do range
  // nativo não sofrem do bug — só o arraste por ponteiro sofria).
  input.addEventListener('input',       handleInput);
  input.addEventListener('pointerdown', handlePointerDown);
  input.addEventListener('pointermove', handlePointerMove);
  input.addEventListener('pointerup',   handlePointerUp);
  input.addEventListener('pointercancel', handlePointerUp);
  input.addEventListener('wheel',       handleWheel, { passive: false });

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
    input.removeEventListener('input',       handleInput);
    input.removeEventListener('pointerdown', handlePointerDown);
    input.removeEventListener('pointermove', handlePointerMove);
    input.removeEventListener('pointerup',   handlePointerUp);
    input.removeEventListener('pointercancel', handlePointerUp);
    input.removeEventListener('wheel',       handleWheel);
    ro.disconnect();
    if (rafId) cancelAnimationFrame(rafId);
  }

  return { setValue, destroy, layout };
}

export default makeVolumeSlider;
export { usablePx, pxToValue, effectiveThumbPx, SLIDER_MAX, THUMB_PX, SNAP_POINTS };