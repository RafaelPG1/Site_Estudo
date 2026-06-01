// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/ui/audio-btns.js
   Botões flutuantes de áudio — SFX + Música
   Versão 1.2 — botão Música espelha exatamente o botão SFX

   MUDANÇAS v1.1 → v1.2
   ─────────────────────────────────────────────
   PROBLEMA 1 CORRIGIDO — Visual não restaura após F5:
     _initMusicLogic renderizava com _musicCurrentMode (var local) na
     montagem, mas depois o subscribeMusicMode atualizava _musicCurrentMode
     localmente E chamava _renderMode. O bug era que _lastRenderedId ficava
     em null se o subscribe disparasse antes do primeiro render completar,
     ou que o render inicial usava _musicCurrentMode local enquanto o
     audio-state tinha o valor correto mas não notificava ainda.

     FIX: render inicial usa audioState.getMusicMode() diretamente,
     idêntico ao botão SFX que usa audioState.getMode().

   PROBLEMA 2 CORRIGIDO — MUTE não silencia a música:
     _musicApplyToEngine era chamado no subscribe E no click.
     Mas quando audio-state.js chamava _applyToEngine (no loginSuccess
     antigo), ele chamava audio.setMusicVolume(_volumes.music) sobrescrevendo
     o 0 do MUTE. Fix em audio-state.js (v1.6) remove essa sobrescrita.
     Aqui: garantimos que _musicApplyToEngine é a ÚNICA fonte de verdade
     para audio.setMusicVolume(). Nenhum outro módulo deve chamar isso.

   PROBLEMA 3 CORRIGIDO — _musicCurrentMode local dessincronizado:
     A variável local _musicCurrentMode duplicava o estado do audio-state,
     criando duas fontes de verdade. Agora ela é apenas um cache para o
     ciclo de clique — a fonte autoritativa é sempre audioState.getMusicMode().

   ARQUITETURA DO BOTÃO MÚSICA (= espelho do botão SFX):
   ─────────────────────────────────────────────
   SFX:    audioState.getMode()         → render inicial
           audioState.subscribe(fn)     → recebe updates externos
           audioState.setMode(next)     → no clique
   Música: audioState.getMusicMode()    → render inicial  ← FIX
           audioState.subscribeMusicMode(fn) → recebe updates externos
           audioState.setMusicMode(next) → no clique (via _musicSetMode)

   ============================================= */


/* ═══════════════════════════════════════════════
   SEÇÃO 1 — IMPORTS E DEPENDÊNCIAS
═══════════════════════════════════════════════ */

import audio      from '../engine/sfx.js';
import audioState from '../state/audio-state.js';


/* ═══════════════════════════════════════════════
   SEÇÃO 2 — ESTADOS VISUAIS
═══════════════════════════════════════════════ */

/* ── 2a. SFX ── */

const _SFX_STATES = [
  {
    id:     'normal',
    label:  'Volume ativado',
    stroke: '#00d4ff',
    glow:   'radial-gradient(circle,rgba(0,210,255,.26) 0%,transparent 70%)',
    ro:     'rgba(0,200,255,.18)',
    rm:     'rgba(0,200,255,.26)',
    bg:     'rgba(0,28,52,.88)',
    border: 'rgba(0,200,255,.42)',
    pulse:  'rgba(0,200,255,.3)',
    anim:   true,
    ic:     'iN',
  },
  {
    id:     'mute',
    label:  'Mudo',
    stroke: '#ff4d5e',
    glow:   'radial-gradient(circle,rgba(255,50,80,.2) 0%,transparent 70%)',
    ro:     'rgba(255,60,80,.13)',
    rm:     'rgba(255,60,80,.2)',
    bg:     'rgba(28,4,6,.9)',
    border: 'rgba(255,60,80,.36)',
    pulse:  'rgba(255,60,80,.25)',
    anim:   false,
    ic:     'iM',
  },
  {
    id:     'low',
    label:  'Volume reduzido',
    stroke: '#00e8be',
    glow:   'radial-gradient(circle,rgba(0,240,190,.16) 0%,transparent 70%)',
    ro:     'rgba(0,220,180,.14)',
    rm:     'rgba(0,220,180,.22)',
    bg:     'rgba(0,18,16,.88)',
    border: 'rgba(0,220,180,.34)',
    pulse:  'rgba(0,200,160,.22)',
    anim:   true,
    ic:     'iL',
  },
];

const _SFX_CYCLE = ['normal', 'mute', 'low'];
const _sfxById = Object.fromEntries(_SFX_STATES.map(s => [s.id, s]));


/* ── 2b. Música ── */

const _MUSIC_STATES = [
  {
    id:          'normal',
    label:       'Música ativada',
    musicVolume: 1.0,
    stroke:      '#ffc857',
    glow:        'radial-gradient(circle,rgba(255,200,80,.28) 0%,transparent 70%)',
    ro:          'rgba(255,190,60,.18)',
    rm:          'rgba(255,190,60,.28)',
    bg:          'rgba(28,18,0,.88)',
    border:      'rgba(255,190,60,.45)',
    pulse:       'rgba(255,180,50,.3)',
    anim:        true,
    ic:          'iN',
  },
  {
    id:          'mute',
    label:       'Música muda',
    musicVolume: 0,
    stroke:      '#ff4d5e',
    glow:        'radial-gradient(circle,rgba(255,50,80,.2) 0%,transparent 70%)',
    ro:          'rgba(255,60,80,.13)',
    rm:          'rgba(255,60,80,.2)',
    bg:          'rgba(28,4,6,.9)',
    border:      'rgba(255,60,80,.36)',
    pulse:       'rgba(255,60,80,.25)',
    anim:        false,
    ic:          'iM',
  },
  {
    id:          'low',
    label:       'Música reduzida',
    musicVolume: 0.25,
    stroke:      '#e8b84b',
    glow:        'radial-gradient(circle,rgba(232,184,75,.18) 0%,transparent 70%)',
    ro:          'rgba(220,168,55,.14)',
    rm:          'rgba(220,168,55,.22)',
    bg:          'rgba(20,14,0,.88)',
    border:      'rgba(220,168,55,.35)',
    pulse:       'rgba(200,150,40,.22)',
    anim:        true,
    ic:          'iL',
  },
];

const _MUSIC_CYCLE = ['normal', 'mute', 'low'];
const _musicById = Object.fromEntries(_MUSIC_STATES.map(s => [s.id, s]));


/* ═══════════════════════════════════════════════
   SEÇÃO 3 — BOTÃO SFX
   (sem alterações em relação à v1.1)
═══════════════════════════════════════════════ */

function _createSfxBtn() {
  const btn = document.createElement('button');
  btn.className = 'abtn';
  btn.id = 'audio-btn-global';
  btn.setAttribute('aria-label', _sfxById['normal'].label);
  btn.innerHTML = `
    <div class="glow"></div>
    <div class="ro"></div>
    <div class="rm"></div>
    <div class="pulse"></div>
    <div class="ripple"></div>
    <div class="body">
      <div class="iw">
        <svg class="ic on" data-ic="iN" width="22" height="22" viewBox="0 0 44 44">
          <path d="M14 17H10a1 1 0 00-1 1v8a1 1 0 001 1h4l7 6V11l-7 6z" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M25 16.5C27.5 18 29 20 29 22s-1.5 5.5-4 6.5"           fill="none" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M28.5 13.5C32.5 16 35 19 35 22s-2.5 6-6.5 8.5"         fill="none" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M32 10.5C37.5 14 41 18 41 22s-3.5 8-9 11.5"            fill="none" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <svg class="ic" data-ic="iM" width="22" height="22" viewBox="0 0 44 44">
          <path d="M14 17H10a1 1 0 00-1 1v8a1 1 0 001 1h4l7 6V11l-7 6z" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="26" y1="17" x2="36" y2="27" stroke-width="2" stroke-linecap="round"/>
          <line x1="36" y1="17" x2="26" y2="27" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <svg class="ic" data-ic="iL" width="22" height="22" viewBox="0 0 44 44">
          <path d="M14 17H10a1 1 0 00-1 1v8a1 1 0 001 1h4l7 6V11l-7 6z" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M25 16.5C27.5 18 29 20 29 22s-1.5 5.5-4 6.5"          fill="none" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
  `;
  return btn;
}

function _initSfxLogic(btn) {
  const glow  = btn.querySelector('.glow');
  const ro    = btn.querySelector('.ro');
  const rm    = btn.querySelector('.rm');
  const bd    = btn.querySelector('.body');
  const pu    = btn.querySelector('.pulse');
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
    } else if (!_lastRenderedId) {
      Object.values(icons).forEach(el => el.classList.remove('on', 'out'));
      icons[s.ic].classList.add('on');
    }

    glow.style.background = s.glow;
    glow.style.opacity    = '1';
    ro.style.borderColor  = s.ro;
    rm.style.borderColor  = s.rm;
    bd.style.background   = s.bg;
    bd.style.borderColor  = s.border;
    Object.values(icons).forEach(el =>
      el.querySelectorAll('path, line').forEach(p => p.style.stroke = s.stroke)
    );
    pu.style.borderColor = s.pulse;
    pu.style.animation   = 'none';
    if (s.anim) { void pu.offsetWidth; pu.style.animation = 'abtn-pulse 1.9s ease-out infinite'; }
    btn.setAttribute('aria-label', s.label);
    btn.dataset.state = s.id;

    _lastRenderedId = modeId;
  }

  // Render inicial — usa audioState como fonte autoritativa
  _renderMode(audioState.getMode());

  // Subscribe — recebe updates de login, logout, reset externo
  audioState.subscribe(_renderMode);

  btn.addEventListener('click', () => {
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
    // O nexus:audioUnlocked notifica o app para iniciar música se cabível,
    // mas não muda nenhuma configuração.
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
   SEÇÃO 4 — BOTÃO MÚSICA
   ─────────────────────────────────────────────
   ARQUITETURA IDÊNTICA AO BOTÃO SFX:

   SFX:
     render inicial → audioState.getMode()
     updates        → audioState.subscribe(fn)
     clique         → audioState.setMode(next)

   Música:
     render inicial → audioState.getMusicMode()    ← mesma estrutura
     updates        → audioState.subscribeMusicMode(fn)
     clique         → audioState.setMusicMode(next) (via _musicSetMode)

   _musicApplyToEngine é a ÚNICA função que chama audio.setMusicVolume().
   Nenhum outro módulo deve chamar audio.setMusicVolume() diretamente,
   assim como nenhum outro módulo chama audio.setMasterVolume() ignorando
   o modo SFX. Isso garante que MUTE sempre silencia a música.
═══════════════════════════════════════════════ */

/* ── 4a. SVGs do botão Música ── */

const _SVG_MUSIC_iN = `
  <svg class="ic on" data-ic="iN" width="22" height="22" viewBox="0 0 44 44"
       fill="none" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="14.5" cy="31" rx="4" ry="2.8" stroke-width="1.7"/>
    <ellipse cx="28.5" cy="27" rx="4" ry="2.8" stroke-width="1.7"/>
    <line x1="18.5" y1="31" x2="18.5" y2="14" stroke-width="1.7"/>
    <line x1="32.5" y1="27" x2="32.5" y2="10" stroke-width="1.7"/>
    <path d="M18.5 14 C22 11.5, 28 10.5, 32.5 10" stroke-width="1.7" fill="none"/>
    <path d="M18.5 17.5 C22 15, 28 14, 32.5 13.5" stroke-width="1.7" fill="none"/>
  </svg>`;

const _SVG_MUSIC_iM = `
  <svg class="ic" data-ic="iM" width="22" height="22" viewBox="0 0 44 44"
       fill="none" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="15" cy="31" rx="4" ry="2.8" stroke-width="1.7" opacity=".55"/>
    <line x1="19" y1="31" x2="19" y2="14" stroke-width="1.7" opacity=".55"/>
    <path d="M19 14 C22.5 12, 27 11, 31 11" stroke-width="1.7" fill="none" opacity=".55"/>
    <line x1="25" y1="18" x2="35" y2="28" stroke-width="2.1"/>
    <line x1="35" y1="18" x2="25" y2="28" stroke-width="2.1"/>
  </svg>`;

const _SVG_MUSIC_iL = `
  <svg class="ic" data-ic="iL" width="22" height="22" viewBox="0 0 44 44"
       fill="none" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="16" cy="31" rx="4" ry="2.8" stroke-width="1.7"/>
    <line x1="20" y1="31" x2="20" y2="15" stroke-width="1.7"/>
    <path d="M20 15 C23.5 13, 28 12, 32 12" stroke-width="1.7" fill="none"/>
    <path d="M28 21 C30 22.5, 30 25.5, 28 27" stroke-width="1.8"/>
  </svg>`;

/* ── 4b. _musicApplyToEngine ──
   ÚNICA função que chama audio.setMusicVolume().
   Chamada em:
     - render inicial (montagem do botão)
     - clique no botão (via _musicSetMode)
     - subscribe do audioState.subscribeMusicMode (login, logout, reset)
   NÃO chamada por nenhum outro módulo. */

function _musicApplyToEngine(modeId) {
  const s = _musicById[modeId];
  if (!s) return;
  audio.setMusicVolume(s.musicVolume);
}

/* ── 4c. _musicSetMode ──
   Espelha o fluxo do clique SFX:
     SFX:    audioState.setMode(next)   → aplica engine + Firebase + notify
     Música: audioState.setMusicMode(next) → persiste Firebase + notify subscribers
             + _musicApplyToEngine(next)   → aplica engine imediatamente */

function _musicSetMode(modeId) {
  if (!_musicById[modeId]) return;
  // Aplica na engine imediatamente (sem esperar Firebase)
  _musicApplyToEngine(modeId);
  // Persiste + notifica subscribers (inclui o próprio botão via subscribeMusicMode)
  audioState.setMusicMode(modeId);
}

/* ── 4d. Construção do DOM Música ── */

function _createMusicBtn() {
  const btn = document.createElement('button');
  btn.className = 'abtn mbtn';
  btn.id = 'music-btn-global';
  btn.setAttribute('aria-label', _musicById['normal'].label);
  btn.innerHTML = `
    <div class="glow"></div>
    <div class="ro"></div>
    <div class="rm"></div>
    <div class="pulse"></div>
    <div class="ripple"></div>
    <div class="body">
      <div class="iw">
        ${_SVG_MUSIC_iN}
        ${_SVG_MUSIC_iM}
        ${_SVG_MUSIC_iL}
      </div>
    </div>
  `;
  return btn;
}

/* ── 4e. Lógica do botão Música ──
   Espelha _initSfxLogic LINHA A LINHA, substituindo:
     _sfxById        → _musicById
     audioState.getMode()     → audioState.getMusicMode()
     audioState.subscribe()   → audioState.subscribeMusicMode()
     audioState.setMode(next) → _musicSetMode(next)
     _SFX_CYCLE               → _MUSIC_CYCLE
   Além de:
     - subscribe também chama _musicApplyToEngine para atualizar o volume
     - seletor de stroke inclui 'ellipse' (ícones de nota musical)        */

function _initMusicLogic(btn) {
  const glow  = btn.querySelector('.glow');
  const ro    = btn.querySelector('.ro');
  const rm    = btn.querySelector('.rm');
  const bd    = btn.querySelector('.body');
  const pu    = btn.querySelector('.pulse');
  const ri    = btn.querySelector('.ripple');
  const icons = {};
  btn.querySelectorAll('[data-ic]').forEach(el => { icons[el.dataset.ic] = el; });

  let _lastRenderedId = null;
  let _iconTimer      = null;

  function _renderMode(modeId) {
    const s = _musicById[modeId] ?? _musicById['normal'];

    if (_lastRenderedId && _lastRenderedId !== modeId) {
      const fromIc = _musicById[_lastRenderedId]?.ic;
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
    } else if (!_lastRenderedId) {
      Object.values(icons).forEach(el => el.classList.remove('on', 'out'));
      icons[s.ic].classList.add('on');
    }

    glow.style.background = s.glow;
    glow.style.opacity    = '1';
    ro.style.borderColor  = s.ro;
    rm.style.borderColor  = s.rm;
    bd.style.background   = s.bg;
    bd.style.borderColor  = s.border;

    // Música usa ellipse nos SVGs, SFX usa path/line
    Object.values(icons).forEach(el =>
      el.querySelectorAll('path, line, ellipse').forEach(p => p.style.stroke = s.stroke)
    );

    pu.style.borderColor = s.pulse;
    pu.style.animation   = 'none';
    if (s.anim) { void pu.offsetWidth; pu.style.animation = 'abtn-pulse 1.9s ease-out infinite'; }
    btn.setAttribute('aria-label', s.label);
    btn.dataset.state = s.id;

    _lastRenderedId = modeId;
  }

  // FIX: render inicial usa audioState.getMusicMode() como fonte autoritativa,
  // idêntico ao SFX que usa audioState.getMode().
  // Isso garante que F5 restaura o visual correto (LOW, MUTE, NORMAL)
  // porque audioState já leu o localStorage ao inicializar.
  const initialMode = audioState.getMusicMode();
  _renderMode(initialMode);
  // Aplica o volume na engine conforme o modo persistido
  _musicApplyToEngine(initialMode);

  // Subscribe: espelha audioState.subscribe(_renderMode) do botão SFX.
  // Quando o Firebase responder (loginSuccess), audioState notifica via
  // subscribeMusicMode → atualizamos visual E volume.
  audioState.subscribeMusicMode(modeId => {
    // FIX: apenas atualiza visual e aplica volume.
    // NÃO chama _musicSetMode (evita loop: subscribe → setMusicMode → notify → subscribe).
    _musicApplyToEngine(modeId);
    _renderMode(modeId);
  });

  btn.addEventListener('click', () => {
    const currentMode = audioState.getMusicMode(); // fonte autoritativa
    const currentIdx  = _MUSIC_CYCLE.indexOf(currentMode);
    const nextMode    = _MUSIC_CYCLE[(currentIdx + 1) % _MUSIC_CYCLE.length];

    // Espelha o clique SFX: delega ao audioState (persiste + notifica)
    // + aplica na engine imediatamente via _musicSetMode
    _musicSetMode(nextMode);

    ri.style.animation = 'none';
    void ri.offsetWidth;
    ri.style.animation = 'abtn-ripple .5s ease-out forwards';
  });
}


/* ═══════════════════════════════════════════════
   SEÇÃO 5 — MONTAGEM
═══════════════════════════════════════════════ */

function _mountSfxBtn() {
  if (document.getElementById('audio-btn-global')) return;
  const btn = _createSfxBtn();
  _initSfxLogic(btn);
  document.body.appendChild(btn);
  _installUnlockHint();
}

function _mountMusicBtn() {
  if (document.getElementById('music-btn-global')) return;
  const btn = _createMusicBtn();
  _initMusicLogic(btn);
  document.body.appendChild(btn);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    _mountSfxBtn();
    _mountMusicBtn();
  });
} else {
  _mountSfxBtn();
  _mountMusicBtn();
}


/* ═══════════════════════════════════════════════
   SEÇÃO 6 — API EXPORTADA
═══════════════════════════════════════════════ */

export function mountAudioBtn() {
  _mountSfxBtn();
}

export function destroyAudioBtn() {
  document.getElementById('audio-btn-global')?.remove();
}

export function mountMusicBtn() {
  _mountMusicBtn();
}

export function destroyMusicBtn() {
  document.getElementById('music-btn-global')?.remove();
}

export function getMusicMode() {
  return audioState.getMusicMode();
}

export function setMusicMode(modeId) {
  _musicSetMode(modeId);
}

export function subscribeMusicMode(fn) {
  audioState.subscribeMusicMode(fn);
}

export function unsubscribeMusicMode(fn) {
  audioState.unsubscribeMusicMode(fn);
}