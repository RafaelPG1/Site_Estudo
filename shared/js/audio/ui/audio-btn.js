// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/ui/audio-btn.js
   Botão de volume global — autoexecutável
   <script type="module" src="/shared/js/audio/audio-btn.js"></script>

   v7.0 — UI pura, delegando estado ao audio-state.js
   ─────────────────────────────────────────────
   MUDANÇAS v6.0 → v7.0
   ─────────────────────────────────────────────
   REMOVIDO deste arquivo:
     - import de carregarConfigs / salvarConfigs (Firebase)
     - import de getUsuario
     - _fetchFromFirebase()
     - _persistToFirebase()
     - listeners de nexus:loginSuccess e nexus:logout
     - _applyToAudioEngine() — agora é responsabilidade do audio-state
     - lógica de _memState / _idxById / _defaultIdx / _currentIdx

   ADICIONADO:
     - import audioState from '../state/audio-state.js'
     - audioState.subscribe(callback) para receber atualizações de modo
     - _renderMode(modeId) — única função que traduz modeId em visual

   ARQUITETURA ATUAL
   ─────────────────────────────────────────────
   audio-state.js  →  fonte única de verdade de estado + Firebase + auth
   audio-btn.js    →  interface visual exclusivamente
   sfx.js          →  engine de áudio exclusivamente

   RESPONSABILIDADES DESTE ARQUIVO
   ─────────────────────────────────────────────
   ✅ criar o botão e seus elementos visuais
   ✅ ouvir clique do usuário
   ✅ chamar audioState.setMode() no clique
   ✅ receber novo modeId via subscribe e atualizar visual
   ✅ animar ícones e ripple

   ❌ NÃO acessa Firebase
   ❌ NÃO sabe quem está logado
   ❌ NÃO controla persistência
   ❌ NÃO aplica volume na engine diretamente
   ============================================= */

import audioState from '../state/audio-state.js';

/* ═══════════════════════════════════════════════
   1. DEFINIÇÃO DOS ESTADOS VISUAIS
   Cada entrada mapeia um modeId do audio-state
   para suas propriedades visuais e de interação.
═══════════════════════════════════════════════ */

const VISUAL_STATES = [
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
    sfx:    'click',
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
    sfx:    'click',
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
    sfx:    'click',
  },
];

/** Ordem de rotação ao clicar: normal → mute → low → normal */
const CYCLE_ORDER = ['normal', 'mute', 'low'];

/** Lookup rápido por id. */
const _visualById = Object.fromEntries(VISUAL_STATES.map(s => [s.id, s]));

/* ═══════════════════════════════════════════════
   2. CONSTRUÇÃO DO BOTÃO
═══════════════════════════════════════════════ */

function _createBtn() {
  const btn = document.createElement('button');
  btn.className = 'abtn';
  btn.id = 'audio-btn-global';
  btn.setAttribute('aria-label', _visualById['normal'].label);
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

/* ═══════════════════════════════════════════════
   3. LÓGICA DO BOTÃO
═══════════════════════════════════════════════ */

function _initLogic(btn) {
  const glow  = btn.querySelector('.glow');
  const ro    = btn.querySelector('.ro');
  const rm    = btn.querySelector('.rm');
  const bd    = btn.querySelector('.body');
  const pu    = btn.querySelector('.pulse');
  const ri    = btn.querySelector('.ripple');
  const icons = {};
  btn.querySelectorAll('[data-ic]').forEach(el => { icons[el.dataset.ic] = el; });

  /* ─────────────────────────────────────────────
     RENDERIZAÇÃO VISUAL
     Recebe um modeId e atualiza todos os elementos
     visuais do botão. É a única função que toca DOM.
  ───────────────────────────────────────────── */

  let _lastRenderedId = null;

  function _renderMode(modeId) {
    const s = _visualById[modeId] ?? _visualById['normal'];

    // Troca de ícone com animação (se modo realmente mudou)
    if (_lastRenderedId && _lastRenderedId !== modeId) {
      const fromIc = _visualById[_lastRenderedId]?.ic;
      const toIc   = s.ic;
      if (fromIc && fromIc !== toIc) {
        icons[fromIc].classList.remove('on');
        icons[fromIc].classList.add('out');
        setTimeout(() => {
          icons[fromIc].classList.remove('out');
          icons[toIc].classList.add('on');
        }, 170);
      }
    } else if (!_lastRenderedId) {
      // Primeira renderização — sem animação
      icons[s.ic].classList.add('on');
    }

    // Propriedades visuais
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

  /* ─────────────────────────────────────────────
     ESTADO INICIAL
     Renderiza o modo atual do audio-state
     (que já foi inicializado com o padrão).
  ───────────────────────────────────────────── */

  _renderMode(audioState.getMode());

  /* ─────────────────────────────────────────────
     SUBSCRIBE — recebe updates do audio-state
     Qualquer mudança de modo (login, logout, clique
     em outro lugar) chega aqui e atualiza o visual.
  ───────────────────────────────────────────── */

  audioState.subscribe(_renderMode);

  /* ─────────────────────────────────────────────
     CLIQUE DO USUÁRIO
     Calcula o próximo modo na sequência de rotação
     e delega para o audio-state, que aplica na
     engine e persiste no Firebase.
  ───────────────────────────────────────────── */

  btn.addEventListener('click', () => {
    const currentMode = audioState.getMode();
    const currentIdx  = CYCLE_ORDER.indexOf(currentMode);
    const nextMode    = CYCLE_ORDER[(currentIdx + 1) % CYCLE_ORDER.length];

    // Delega tudo ao audio-state (aplica engine + Firebase + notify)
    audioState.setMode(nextMode);

    // Efeito de ripple — puramente visual, responsabilidade deste arquivo
    ri.style.animation = 'none';
    void ri.offsetWidth;
    ri.style.animation = 'abtn-ripple .5s ease-out forwards';
  });
}

/* ═══════════════════════════════════════════════
   4. MONTAGEM
═══════════════════════════════════════════════ */

function _mount() {
  if (document.getElementById('audio-btn-global')) return;
  const btn = _createBtn();
  _initLogic(btn);
  document.body.appendChild(btn);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _mount);
} else {
  _mount();
}

/* ═══════════════════════════════════════════════
   5. API EXPORTADA — para uso por sound.js
   Permite que Sound.init() / Sound.reinit() montem
   e destruam o botão sem duplicar código.
═══════════════════════════════════════════════ */

/**
 * Monta o botão flutuante se ainda não existir.
 * Idempotente: chamadas repetidas são no-ops.
 */
export function mountAudioBtn() {
  _mount();
}

/**
 * Remove o botão flutuante do DOM.
 * Usado por Sound.reinit() antes de recriar o botão.
 */
export function destroyAudioBtn() {
  document.getElementById('audio-btn-global')?.remove();
}