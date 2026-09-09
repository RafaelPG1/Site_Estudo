// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/ui/audio-btns.js
   Botão flutuante de áudio — SFX
   Versão 1.5 — cor por estado migrada para CSS var
   (--abtn-rgb via [data-state]), identidade roxa própria
   em vez do ciano da IA; lógica de estado/click preservada
   integralmente — ver seção 4

   ============================================= */


/* ═══════════════════════════════════════════════
   SEÇÃO 1 — IMPORTS E DEPENDÊNCIAS
═══════════════════════════════════════════════ */

import audio      from '../engine/sfx.js';
import audioState from '../state/audio-state.js';


/* ═══════════════════════════════════════════════
   SEÇÃO 2 — ESTADOS VISUAIS
═══════════════════════════════════════════════ */

/* A cor de cada estado (roxo/vermelho/verde-água) vive só no CSS,
   via [data-state] + --abtn-rgb (ver audio-btns.css, seção 0).
   Aqui só ficam os dados que realmente pertencem à lógica: id,
   texto acessível e qual ícone mostrar. */
const _SFX_STATES = [
  { id: 'normal', label: 'Efeito Sonoro — ativado', ic: 'iN' },
  { id: 'mute',   label: 'Efeito Sonoro — mudo',     ic: 'iM' },
  { id: 'low',    label: 'Efeito Sonoro — reduzido', ic: 'iL' },
];

const _SFX_CYCLE = ['normal', 'mute', 'low'];
const _sfxById = Object.fromEntries(_SFX_STATES.map(s => [s.id, s]));


/* ═══════════════════════════════════════════════
   SEÇÃO 3 — BOTÃO SFX (markup)
═══════════════════════════════════════════════ */

function _createSfxBtn() {
  const btn = document.createElement('button');
  btn.className = 'abtn';
  btn.id = 'audio-btn-global';
  btn.type = 'button';
  btn.dataset.state = 'normal'; // evita flash sem cor antes do primeiro _renderMode
  btn.setAttribute('aria-label', _sfxById['normal'].label);
  btn.innerHTML = `
    <div class="ro" aria-hidden="true"></div>
    <div class="glow" aria-hidden="true"></div>
    <div class="ripple" aria-hidden="true"></div>
    <div class="body">
      <div class="iw">
        <svg class="ic on" data-ic="iN" width="20" height="20" viewBox="0 0 44 44" stroke="currentColor">
          <path d="M14 17H10a1 1 0 00-1 1v8a1 1 0 001 1h4l7 6V11l-7 6z" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M25 16.5C27.5 18 29 20 29 22s-1.5 5.5-4 6.5"           fill="none" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M28.5 13.5C32.5 16 35 19 35 22s-2.5 6-6.5 8.5"         fill="none" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M32 10.5C37.5 14 41 18 41 22s-3.5 8-9 11.5"            fill="none" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <svg class="ic" data-ic="iM" width="20" height="20" viewBox="0 0 44 44" stroke="currentColor">
          <path d="M14 17H10a1 1 0 00-1 1v8a1 1 0 001 1h4l7 6V11l-7 6z" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="26" y1="17" x2="36" y2="27" stroke-width="2" stroke-linecap="round"/>
          <line x1="36" y1="17" x2="26" y2="27" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <svg class="ic" data-ic="iL" width="20" height="20" viewBox="0 0 44 44" stroke="currentColor">
          <path d="M14 17H10a1 1 0 00-1 1v8a1 1 0 001 1h4l7 6V11l-7 6z" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M25 16.5C27.5 18 29 20 29 22s-1.5 5.5-4 6.5"          fill="none" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
    <span class="abtn-label" aria-hidden="true">Efeito Sonoro</span>
  `;
  return btn;
}


/* ═══════════════════════════════════════════════
   SEÇÃO 4 — LÓGICA (click/estado — inalterada em relação
   à v1.3; apenas os seletores de nós DOM foram ajustados
   ao novo markup: .rm e .pulse deixaram de existir)
═══════════════════════════════════════════════ */

function _initSfxLogic(btn) {
  const ri    = btn.querySelector('.ripple');
  const icons = {};
  btn.querySelectorAll('[data-ic]').forEach(el => { icons[el.dataset.ic] = el; });

  let _lastRenderedId = null;
  let _iconTimer      = null;

  function _renderMode(modeId) {
    const s = _sfxById[modeId] ?? _sfxById['normal'];

    if (_lastRenderedId && _lastRenderedId !== modeId) {
      const fromIc = _sfxById[_lastRenderedId]?.ic;
      const toIc   = s.ic;
      if (fromIc && fromIc !== toIc) {
        clearTimeout(_iconTimer);
        Object.values(icons).forEach(el => el.classList.remove('on', 'out'));
        icons[fromIc].classList.add('out');
        _iconTimer = setTimeout(() => {
          Object.values(icons).forEach(el => el.classList.remove('on', 'out'));
          icons[toIc].classList.add('on');
          _iconTimer = null;
        }, 170);
      }
    } else {
      // mesmo modo ou primeiro render — garante ícone correto
      Object.values(icons).forEach(el => el.classList.remove('on', 'out'));
      icons[s.ic].classList.add('on');
    }

    // Cor (anel/glow/borda/sombra/ícone/tooltip) é 100% CSS a partir
    // daqui — ver .abtn[data-state="..."] { --abtn-rgb: ... } em
    // audio-btns.css. O JS só decide QUAL estado está ativo.
    btn.setAttribute('aria-label', s.label);
    btn.dataset.state = s.id;

    _lastRenderedId = modeId;
  }

  // Render inicial — usa audioState como fonte autoritativa
  _renderMode(audioState.getMode());

  // Subscribe — recebe updates de login, logout, reset externo
  audioState.subscribe(_renderMode);

  btn.addEventListener('click', () => {
    if (btn.disabled || btn.classList.contains('abtn--disabled')) return;

    const currentMode = audioState.getMode();
    const currentIdx  = _SFX_CYCLE.indexOf(currentMode);
    const nextMode    = _SFX_CYCLE[(currentIdx + 1) % _SFX_CYCLE.length];
    audioState.setMode(nextMode);

    ri.style.animation = 'none';
    void ri.offsetWidth;
    ri.style.animation = 'abtn-ripple .5s ease-out forwards';
  });
}

/* ── Hint de desbloqueio do AudioContext ── */

function _installUnlockHint() {
  if (audio.isUnlocked()) return;

  const hint = document.createElement('div');
  hint.id = 'abtn-unlock-hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.innerHTML = `<span id="abtn-unlock-hint__dot"></span><span>clique em qualquer lugar<br>para ativar o som</span>`;
  document.body.appendChild(hint);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hint.classList.add('is-visible');
    });
  });

  function _onUnlock() {
    hint.classList.replace('is-visible', 'is-hiding');
    hint.addEventListener('transitionend', () => hint.remove(), { once: true });
    setTimeout(() => hint.remove(), 400);
    document.removeEventListener('click',       _onUnlock, { capture: true });
    document.removeEventListener('pointerdown', _onUnlock, { capture: true });
    document.removeEventListener('touchstart',  _onUnlock, { capture: true });

    // Desbloqueio = apenas permite reprodução. NÃO altera modo nem volume.
    // O nexus:audioUnlocked notifica o app de que o AudioContext está pronto.
    function _dispatch() {
      document.dispatchEvent(new CustomEvent('nexus:audioUnlocked'));
    }

    if (audio.isUnlocked()) {
      _dispatch();
    } else {
      const _poll = setInterval(() => {
        if (audio.isUnlocked()) {
          clearInterval(_poll);
          _dispatch();
        }
      }, 20);
      setTimeout(() => { clearInterval(_poll); _dispatch(); }, 500);
    }
  }

  document.addEventListener('click',       _onUnlock, { capture: true, passive: true });
  document.addEventListener('pointerdown', _onUnlock, { capture: true, passive: true });
  document.addEventListener('touchstart',  _onUnlock, { capture: true, passive: true });
}


/* ═══════════════════════════════════════════════
   SEÇÃO 5 — MONTAGEM
═══════════════════════════════════════════════ */

function _mountSfxBtn() {
  if (document.getElementById('audio-btn-global')) return;
  if (!audioState.getSfxBtnEnabled()) return; // usuário desativou nas Configurações
  const btn = _createSfxBtn();
  _initSfxLogic(btn);
  document.body.appendChild(btn);
  _installUnlockHint();
}

function _destroySfxBtn() {
  document.getElementById('audio-btn-global')?.remove();
  document.getElementById('abtn-unlock-hint')?.remove();
}

// ── Aplica o estado inicial de habilitação (silencia o canal
//    correspondente caso o usuário tenha desativado nas Configurações) ──
audioState.setSfxBtnEnabled(audioState.getSfxBtnEnabled());

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    _mountSfxBtn();
  });
} else {
  _mountSfxBtn();
}

// ── Reage a alterações em tempo real (toggles em Configurações) ──
audioState.subscribeSfxBtnEnabled(enabled => {
  if (enabled) {
    _mountSfxBtn();
  } else {
    _destroySfxBtn();
  }
});


/* ═══════════════════════════════════════════════
   SEÇÃO 6 — API EXPORTADA
═══════════════════════════════════════════════ */

export function mountAudioBtn() {
  _mountSfxBtn();
}

export function destroyAudioBtn() {
  document.getElementById('audio-btn-global')?.remove();
}

/* ── 6b. Visibilidade do botão (SFX) ──
   Wrapper fino sobre audioState, fonte única de verdade. */

export function getSfxBtnEnabled() {
  return audioState.getSfxBtnEnabled();
}

export function setSfxBtnEnabled(enabled) {
  audioState.setSfxBtnEnabled(enabled);
}

export function subscribeSfxBtnEnabled(fn) {
  audioState.subscribeSfxBtnEnabled(fn);
}

export function unsubscribeSfxBtnEnabled(fn) {
  audioState.unsubscribeSfxBtnEnabled(fn);
}

/* ── 6c. Estado disabled (novo — visual apenas; nenhum
   fluxo existente chama isto ainda, disponível para uso futuro) ── */

export function setSfxBtnDisabled(disabled) {
  const btn = document.getElementById('audio-btn-global');
  if (!btn) return;
  btn.disabled = !!disabled;
  btn.classList.toggle('abtn--disabled', !!disabled);
}