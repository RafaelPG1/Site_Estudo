// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/ui/audio-btns.js
   Botões flutuantes de áudio — SFX + Música
   Versão 1.0 — arquivo unificado

   ORIGINOU DE:
     audio-btn.js  → botão de volume SFX global
     music-btn.js  → botão de controle de música BGM

   ARQUITETURA
   ─────────────────────────────────────────────
   audio-state.js  →  fonte única de verdade (SFX + music mode)
   audio-btns.js   →  interface visual dos dois botões
   sfx.js          →  engine de áudio (sfx + music)
   sound.js        →  importa mountAudioBtn / mountMusicBtn

   RESPONSABILIDADES
   ─────────────────────────────────────────────
   ✅ Construir e montar #audio-btn-global (SFX)
   ✅ Construir e montar #music-btn-global (Música)
   ✅ Ouvir cliques e ciclar modos
   ✅ Receber atualizações de audio-state e atualizar visuais
   ✅ Hint de desbloqueio do AudioContext
   ✅ Persistir modo de música via audioState.setMusicMode()
   ✅ Reagir a nexus:loginSuccess e nexus:logout (modo música)
   ✅ Sincronizar musicVolume na engine via audio.setMusicVolume()

   ❌ NÃO acessa Firebase diretamente
   ❌ NÃO sabe quem está logado
   ❌ NÃO controla persistência de SFX (audio-state cuida disso)
   ❌ NÃO gerencia engine de áudio diretamente (só via audioState)

   ESTRUTURA
   ─────────────────────────────────────────────
   SEÇÃO 1 — IMPORTS E DEPENDÊNCIAS
   SEÇÃO 2 — ESTADOS VISUAIS (SFX + Música)
   SEÇÃO 3 — BOTÃO SFX (construção + lógica + hint)
   SEÇÃO 4 — BOTÃO MÚSICA (construção + lógica + persistência)
   SEÇÃO 5 — MONTAGEM (ambos)
   SEÇÃO 6 — API EXPORTADA (mount/destroy dos dois)
   ============================================= */


/* ═══════════════════════════════════════════════
   SEÇÃO 1 — IMPORTS E DEPENDÊNCIAS
═══════════════════════════════════════════════ */

import audio      from '../engine/sfx.js';
import audioState from '../state/audio-state.js';


/* ═══════════════════════════════════════════════
   SEÇÃO 2 — ESTADOS VISUAIS
   ─────────────────────────────────────────────
   Cada bloco mapeia modeIds para suas propriedades
   visuais. Paleta intencional:
     SFX   → azul-ciano  (consistente com a UI geral)
     Música → âmbar/dourado (distingue os dois botões)
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

/** Ordem de rotação ao clicar: normal → mute → low → normal */
const _SFX_CYCLE = ['normal', 'mute', 'low'];

/** Lookup rápido por id. */
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

/** Ordem de rotação ao clicar: normal → mute → low → normal */
const _MUSIC_CYCLE = ['normal', 'mute', 'low'];

/** Lookup rápido por id. */
const _musicById = Object.fromEntries(_MUSIC_STATES.map(s => [s.id, s]));


/* ═══════════════════════════════════════════════
   SEÇÃO 3 — BOTÃO SFX
   ─────────────────────────────────────────────
   Delega todo o estado e persistência ao audio-state.
   Este bloco é responsável apenas pelo visual e pelo
   hint de desbloqueio do AudioContext.
═══════════════════════════════════════════════ */

/* ── 3a. SVGs do botão SFX ── */
// Os três ícones SVG são injetados diretamente no innerHTML
// do botão para manter zero dependências externas de assets.

/* ── 3b. Construção do DOM SFX ── */

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

/* ── 3c. Lógica do botão SFX ── */

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

    // Troca de ícone com animação (somente quando o modo realmente mudou)
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

  // Renderiza o modo atual do audio-state na montagem
  _renderMode(audioState.getMode());

  // Recebe atualizações de modo vindas do audio-state
  // (login, logout, mudança externa, reset de configs)
  audioState.subscribe(_renderMode);

  btn.addEventListener('click', () => {
    // Se o hint de desbloqueio ainda estava visível, este clique
    // apenas ativa o AudioContext — não cicla o modo.
    if (document.getElementById('abtn-unlock-hint')) return;

    const currentMode = audioState.getMode();
    const currentIdx  = _SFX_CYCLE.indexOf(currentMode);
    const nextMode    = _SFX_CYCLE[(currentIdx + 1) % _SFX_CYCLE.length];

    // Delega ao audio-state: aplica engine + Firebase + notify
    audioState.setMode(nextMode);

    ri.style.animation = 'none';
    void ri.offsetWidth;
    ri.style.animation = 'abtn-ripple .5s ease-out forwards';
  });
}

/* ── 3d. Hint de desbloqueio do AudioContext ──
   O browser bloqueia o AudioContext até o primeiro
   gesto do usuário (política de autoplay).
   Badge discreto visível até então, some ao clicar.
   CSS em shared/css/audio/audio-btns.css, seção 2.   */

function _installUnlockHint() {
  if (audio.isUnlocked()) return;

  const hint = document.createElement('div');
  hint.id = 'abtn-unlock-hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.innerHTML = `<span id="abtn-unlock-hint__dot"></span>clique em qualquer lugar para ativar o som`;
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
  }

  document.addEventListener('click',       _onUnlock, { capture: true, passive: true });
  document.addEventListener('pointerdown', _onUnlock, { capture: true, passive: true });
  document.addEventListener('touchstart',  _onUnlock, { capture: true, passive: true });
}


/* ═══════════════════════════════════════════════
   SEÇÃO 4 — BOTÃO MÚSICA
   ─────────────────────────────────────────────
   Integra com audio-state para persistir o modo
   de música no Firebase e sincronizar o volume
   na engine via audio.setMusicVolume().

   Ciclo: normal → mute → low → normal

   PERSISTÊNCIA
   ─────────────────────────────────────────────
   O modo de música agora é salvo e carregado pelo
   audio-state junto com o resto das configs de áudio.
   audio-state expõe getMusicMode / setMusicMode / subscribeMusicMode
   que este botão usa — localStorage deixa de ser necessário.

   FALLBACK
   ─────────────────────────────────────────────
   Quando audioState não expõe a API de música
   (versões antigas ou teste isolado), o botão cai
   de volta para localStorage como antes.
═══════════════════════════════════════════════ */

/* ── 4a. SVGs do botão Música ── */
// viewBox 44×44 idêntico ao SFX para proporções perfeitas no .iw 22px.

const _SVG_MUSIC_iN = `
  <svg class="ic on" data-ic="iN" width="22" height="22" viewBox="0 0 44 44"
       fill="none" stroke-linecap="round" stroke-linejoin="round">
    <!-- Nota dupla — corpo -->
    <ellipse cx="14.5" cy="31" rx="4" ry="2.8" stroke-width="1.7"/>
    <ellipse cx="28.5" cy="27" rx="4" ry="2.8" stroke-width="1.7"/>
    <!-- Hastes -->
    <line x1="18.5" y1="31" x2="18.5" y2="14" stroke-width="1.7"/>
    <line x1="32.5" y1="27" x2="32.5" y2="10" stroke-width="1.7"/>
    <!-- Ligadura (beam) entre as duas notas -->
    <path d="M18.5 14 C22 11.5, 28 10.5, 32.5 10" stroke-width="1.7" fill="none"/>
    <!-- Segunda ligadura paralela -->
    <path d="M18.5 17.5 C22 15, 28 14, 32.5 13.5" stroke-width="1.7" fill="none"/>
  </svg>`;

const _SVG_MUSIC_iM = `
  <svg class="ic" data-ic="iM" width="22" height="22" viewBox="0 0 44 44"
       fill="none" stroke-linecap="round" stroke-linejoin="round">
    <!-- Nota simples — opacidade reduzida -->
    <ellipse cx="15" cy="31" rx="4" ry="2.8" stroke-width="1.7" opacity=".55"/>
    <line x1="19" y1="31" x2="19" y2="14" stroke-width="1.7" opacity=".55"/>
    <path d="M19 14 C22.5 12, 27 11, 31 11" stroke-width="1.7" fill="none" opacity=".55"/>
    <!-- X de corte — sinal visual de mudo -->
    <line x1="25" y1="18" x2="35" y2="28" stroke-width="2.1"/>
    <line x1="35" y1="18" x2="25" y2="28" stroke-width="2.1"/>
  </svg>`;

const _SVG_MUSIC_iL = `
  <svg class="ic" data-ic="iL" width="22" height="22" viewBox="0 0 44 44"
       fill="none" stroke-linecap="round" stroke-linejoin="round">
    <!-- Nota simples — indicador de volume baixo -->
    <ellipse cx="16" cy="31" rx="4" ry="2.8" stroke-width="1.7"/>
    <line x1="20" y1="31" x2="20" y2="15" stroke-width="1.7"/>
    <path d="M20 15 C23.5 13, 28 12, 32 12" stroke-width="1.7" fill="none"/>
    <!-- Pequeno arco à direita — indica som baixo, não silêncio -->
    <path d="M28 21 C30 22.5, 30 25.5, 28 27" stroke-width="1.8"/>
  </svg>`;

/* ── 4b. Estado interno do botão Música ──
   Tentamos usar audio-state como fonte primária.
   Se não estiver disponível, caímos para localStorage. */

const _MUSIC_STORAGE_KEY = 'nexus_music_mode';

/** Lê o modo de música — audio-state primeiro, localStorage como fallback. */
function _musicLoadMode() {
  if (typeof audioState.getMusicMode === 'function') {
    return audioState.getMusicMode();
  }
  try { return localStorage.getItem(_MUSIC_STORAGE_KEY) || 'normal'; } catch { return 'normal'; }
}

/** Persiste o modo de música — via audio-state (Firebase) ou localStorage. */
function _musicSaveMode(id) {
  if (typeof audioState.setMusicMode === 'function') {
    audioState.setMusicMode(id);  // audio-state persiste no Firebase
    return;
  }
  try { localStorage.setItem(_MUSIC_STORAGE_KEY, id); } catch { /* noop */ }
}

let _musicCurrentMode = _musicLoadMode();
if (!_musicById[_musicCurrentMode]) _musicCurrentMode = 'normal';

/** Subscribers internos para mudanças de modo de música. */
const _musicSubscribers = new Set();

function _musicNotify(modeId) {
  _musicSubscribers.forEach(fn => { try { fn(modeId); } catch { /* noop */ } });
}

/** Aplica o volume de música na engine de áudio. */
function _musicApplyToEngine(modeId) {
  const s = _musicById[modeId];
  if (!s) return;
  audio.setMusicVolume(s.musicVolume);
}

/** Muda o modo de música, aplica na engine, persiste e notifica. */
function _musicSetMode(modeId) {
  if (!_musicById[modeId]) return;
  _musicCurrentMode = modeId;
  _musicApplyToEngine(modeId);
  _musicSaveMode(modeId);
  _musicNotify(modeId);
}

/* ── 4c. Construção do DOM Música ── */

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

/* ── 4d. Lógica do botão Música ── */

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
      icons[s.ic].classList.add('on');
    }

    glow.style.background = s.glow;
    glow.style.opacity    = '1';
    ro.style.borderColor  = s.ro;
    rm.style.borderColor  = s.rm;
    bd.style.background   = s.bg;
    bd.style.borderColor  = s.border;

    // Pinta stroke de TODOS os paths/lines/ellipses de todos os ícones
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

  // Renderiza o modo persistido na montagem
  _renderMode(_musicCurrentMode);

  // Subscribe: recebe updates do audio-state (login, logout, reset externo)
  if (typeof audioState.subscribeMusicMode === 'function') {
    audioState.subscribeMusicMode(modeId => {
      _musicCurrentMode = modeId;
      _renderMode(modeId);
    });
  }

  // Subscribe interno — permite que outros módulos chamem setMusicMode()
  // e o botão reaja visualmente sem precisar de audio-state
  _musicSubscribers.add(_renderMode);

  btn.addEventListener('click', () => {
    const currentIdx = _MUSIC_CYCLE.indexOf(_musicCurrentMode);
    const nextMode   = _MUSIC_CYCLE[(currentIdx + 1) % _MUSIC_CYCLE.length];
    _musicSetMode(nextMode);

    ri.style.animation = 'none';
    void ri.offsetWidth;
    ri.style.animation = 'abtn-ripple .5s ease-out forwards';
  });
}

/* ── 4e. Sincronização com nexus:loginSuccess e nexus:logout ──
   audio-state já repassa o modo de SFX para o botão SFX via subscribe.
   Aqui fazemos o mesmo para o botão de música: quando o usuário faz
   login, carregamos o musicMode que veio do Firebase (se audio-state
   o expuser); no logout, voltamos ao padrão 'normal'.             */

document.addEventListener('nexus:loginSuccess', ({ detail }) => {
  // Se audio-state já expõe getMusicMode, ele foi atualizado pelo
  // evento de login — apenas sincronizamos o visual.
  if (typeof audioState.getMusicMode === 'function') {
    const loaded = audioState.getMusicMode();
    if (_musicById[loaded] && loaded !== _musicCurrentMode) {
      _musicCurrentMode = loaded;
      _musicApplyToEngine(loaded);
      _musicNotify(loaded);
    }
    return;
  }

  // Fallback: audio-state não conhece musicMode — tenta ler do detail
  const savedMode = detail?.configs?.musicMode;
  if (savedMode && _musicById[savedMode]) {
    _musicCurrentMode = savedMode;
    _musicApplyToEngine(savedMode);
    _musicNotify(savedMode);
  }
});

document.addEventListener('nexus:logout', () => {
  _musicCurrentMode = 'normal';
  _musicApplyToEngine('normal');
  _musicNotify('normal');
});

// Aplica o volume do modo persistido imediatamente ao carregar o módulo
_musicApplyToEngine(_musicCurrentMode);


/* ═══════════════════════════════════════════════
   SEÇÃO 5 — MONTAGEM
   ─────────────────────────────────────────────
   Cada botão é montado de forma independente e
   idempotente — chamadas repetidas são no-ops.
   Ambos são adicionados ao body por padrão;
   posicionamento é controlado pelo CSS.
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

// Auto-montagem ao carregar o módulo
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
   ─────────────────────────────────────────────
   Espelha exatamente os contratos públicos dos
   dois arquivos originais, mais métodos adicionais
   para controlar o modo de música externamente.

   Compatibilidade com sound.js:
     mountAudioBtn()   → idêntico ao original
     destroyAudioBtn() → idêntico ao original
     mountMusicBtn()   → idêntico ao original
     destroyMusicBtn() → idêntico ao original
═══════════════════════════════════════════════ */

/**
 * Monta o botão de SFX se ainda não existir.
 * Idempotente: chamadas repetidas são no-ops.
 */
export function mountAudioBtn() {
  _mountSfxBtn();
}

/**
 * Remove o botão de SFX do DOM.
 * Usado por Sound.reinit() antes de recriar o botão.
 */
export function destroyAudioBtn() {
  document.getElementById('audio-btn-global')?.remove();
}

/**
 * Monta o botão de música se ainda não existir.
 * Idempotente: chamadas repetidas são no-ops.
 */
export function mountMusicBtn() {
  _mountMusicBtn();
}

/**
 * Remove o botão de música do DOM.
 * Usado por Sound.reinit() antes de recriar os botões.
 */
export function destroyMusicBtn() {
  document.getElementById('music-btn-global')?.remove();
}

/**
 * Retorna o modo atual de música: 'normal' | 'mute' | 'low'
 */
export function getMusicMode() {
  return _musicCurrentMode;
}

/**
 * Define o modo de música programaticamente.
 * Aplica na engine, persiste e notifica o visual.
 * @param {'normal'|'mute'|'low'} modeId
 */
export function setMusicMode(modeId) {
  _musicSetMode(modeId);
}

/**
 * Registra um subscriber chamado ao mudar o modo de música.
 * @param {function(string): void} fn
 */
export function subscribeMusicMode(fn) {
  _musicSubscribers.add(fn);
}

/**
 * Remove um subscriber registrado.
 * @param {function} fn
 */
export function unsubscribeMusicMode(fn) {
  _musicSubscribers.delete(fn);
}