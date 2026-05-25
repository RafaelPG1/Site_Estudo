// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/sfx.js
   Engine central de áudio do projeto
   Versão 4.0 — engine de áudio pura

   MUDANÇAS v3.0 → v4.0
   ─────────────────────────────────────────────
   REMOVIDO:
     - createAudioSettings() — widget DOM de configuração de som
     - createToggle()        — botão toggle legado
     - _injectAudioSettingsStyle() — injeção de CSS no document.head
     - _AUDIO_SETTINGS_STYLE_ID   — constante de ID do style tag
     - _AUDIO_MODES               — array de modos visuais (mudo/50%/normal)
     - ICON_ON / ICON_OFF         — SVGs inline para o toggle legado
     - syncFromConfigs(cfg)       — método que conhecia schema externo de config

   POR QUÊ?
   ─────────────────────────────────────────────
   sfx.js é uma engine de áudio — não um gerenciador de UI.
   Criar elementos DOM, injetar CSS e entender schemas de config
   externos são responsabilidades do audio-btn.js.

   O audio-btn.js já gerencia:
     - os três modos (on / low / muted)
     - a interface visual do botão
     - a persistência via Firebase
     - a sincronização de estado por usuário

   Para aplicar estado, o audio-btn chama diretamente:
     audio.setMasterVolume(valor)
     audio.mute()
     audio.unmute()

   Não é necessário que o sfx.js conheça o schema { sounds, masterVolume, ... }.

   MANTIDO (inalterado):
     - toda a engine de áudio (AudioContext, GainNodes, osciladores)
     - _tone, _seq, _bgmEngine
     - API pública completa (sfx, music, playEvent)
     - setMasterVolume / setSfxVolume / setMusicVolume e getters
     - mute / unmute / isMuted / setEnabled / isEnabled
     - fadeOut / fadeIn / stopAll
     - resetToDefaults / getState
     - catálogo completo
   ============================================= */

/* ═══════════════════════════════════════════════
   1. ESTADO GLOBAL — somente em memória
   Não lê localStorage na inicialização.
   Não lê getUsuario() na inicialização.
   Valores aplicados via API pública (audio-btn chama setMasterVolume etc.)
═══════════════════════════════════════════════ */

const _DEFAULT_SFX_STATE = {
  enabled:      true,
  muted:        false,
  masterVolume: 0.7,
  sfxVolume:    0.8,
  musicVolume:  0.4,
};

// Estado em memória — sempre começa do padrão.
// Será sobrescrito pelo audio-btn após o login via Firebase.
const _state = { ..._DEFAULT_SFX_STATE };

// _persist() e _sfxStorageKey() REMOVIDOS intencionalmente (v3.0).
// O audio-btn.js é responsável pela persistência de estado por usuário.

// Listeners de nexus:loginSuccess e nexus:logout REMOVIDOS intencionalmente (v3.0).
// audio-btn.js já escuta esses eventos e chama a API pública do sfx
// (setMasterVolume, mute, unmute) com os valores corretos do Firebase.

/* ═══════════════════════════════════════════════
   2. CONTEXTO DE ÁUDIO (lazy)
═══════════════════════════════════════════════ */

let _ctx = null;

function _getCtx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

/* ═══════════════════════════════════════════════
   3. NÓS DE GANHO (gain nodes por canal)
═══════════════════════════════════════════════ */

let _masterGain = null;
let _sfxGain    = null;
let _musicGain  = null;

function _getGains() {
  const ctx = _getCtx();

  if (!_masterGain) {
    _masterGain = ctx.createGain();
    _sfxGain    = ctx.createGain();
    _musicGain  = ctx.createGain();

    _sfxGain.connect(_masterGain);
    _musicGain.connect(_masterGain);
    _masterGain.connect(ctx.destination);

    _syncGains();
  }

  return { master: _masterGain, sfx: _sfxGain, music: _musicGain };
}

function _syncGains() {
  if (!_masterGain) return;
  const muted = _state.muted || !_state.enabled;
  _masterGain.gain.value = muted ? 0 : _state.masterVolume;
  _sfxGain.gain.value    = _state.sfxVolume;
  _musicGain.gain.value  = _state.musicVolume;
}

/* ═══════════════════════════════════════════════
   4. PRIMITIVAS DE SOM
═══════════════════════════════════════════════ */

function _tone({
  freq,
  freqEnd,
  duration,
  attack  = 0.005,
  decay,
  sustain = 0,
  type    = 'sine',
  volume  = 1,
}) {
  if (!_state.enabled || _state.muted) return;

  const ctx    = _getCtx();
  const gains  = _getGains();
  const decayT = decay ?? duration * 0.3;
  const t      = ctx.currentTime;

  const osc      = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(gains.sfx);

  osc.type            = type;
  osc.frequency.value = freq;

  if (freqEnd !== undefined && freqEnd !== freq) {
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.linearRampToValueAtTime(freqEnd, t + duration);
  }

  gainNode.gain.setValueAtTime(0, t);
  gainNode.gain.linearRampToValueAtTime(volume, t + attack);
  gainNode.gain.linearRampToValueAtTime(sustain * volume, t + attack + decayT);
  gainNode.gain.linearRampToValueAtTime(0, t + duration);

  osc.start(t);
  osc.stop(t + duration + 0.01);
}

function _seq(notes) {
  if (!_state.enabled || _state.muted) return;
  notes.forEach(({ delay = 0, ...rest }) => {
    setTimeout(() => _tone(rest), delay * 1000);
  });
}

/* ═══════════════════════════════════════════════
   5. SISTEMA DE MÚSICA / BGM
═══════════════════════════════════════════════ */

let _currentBgm = null;

const _bgmEngine = {
  stop(fadeTime = 0.5) {
    if (!_currentBgm) return;
    const { nodes } = _currentBgm;

    if (fadeTime > 0 && _musicGain) {
      const ctx = _getCtx();
      const t   = ctx.currentTime;
      _musicGain.gain.setValueAtTime(_musicGain.gain.value, t);
      _musicGain.gain.linearRampToValueAtTime(0, t + fadeTime);
      setTimeout(() => {
        nodes.forEach(n => { try { n.stop(); } catch (_) {} });
        _musicGain.gain.value = _state.musicVolume;
        _currentBgm = null;
      }, fadeTime * 1000 + 50);
    } else {
      nodes.forEach(n => { try { n.stop(); } catch (_) {} });
      _currentBgm = null;
    }
  },

  play(id, buildFn) {
    if (!_state.enabled || _state.muted) return;
    if (_currentBgm?.id === id) return;

    this.stop(0.3);

    setTimeout(() => {
      _getGains();
      const nodes = buildFn(_getCtx(), _musicGain);
      _currentBgm = { id, nodes: Array.isArray(nodes) ? nodes : [nodes] };
    }, _currentBgm ? 350 : 0);
  },

  playUrl(id, url) {
    if (!_state.enabled || _state.muted) return;
    if (_currentBgm?.id === id) return;

    this.stop(0.3);

    setTimeout(() => {
      const el = new Audio(url);
      el.loop   = true;
      el.volume = _state.musicVolume * _state.masterVolume;
      el.play().catch(() => {});

      _currentBgm = {
        id,
        nodes: [],
        _el: el,
        stop: () => { el.pause(); el.currentTime = 0; },
      };
    }, _currentBgm ? 350 : 0);
  },

  currentId() {
    return _currentBgm?.id ?? null;
  },
};

/* ═══════════════════════════════════════════════
   6. CATÁLOGO GLOBAL
═══════════════════════════════════════════════ */

export const catalog = [
    /* ── Feedback ────────────────────────────── */

    /* Botões de acertos */
    {
    id: 'correct4',
    event: 'correct',
    label: 'correct 4',
    category: 'feedback',
    type: 'sfx',
    variant: 'success',
    volume: 0.5,
    description: 'Acertou — ping limpo, dois sines ascendentes',
    fn() {
        _seq([
        { freq: 520, duration: 0.12, attack: 0.005, volume: this.volume },
        { freq: 780, duration: 0.12, attack: 0.005, delay: 0.1, volume: this.volume },
        ]);
    },
    },
    {
    id: 'correct5',
    event: 'correct',
    label: 'correct 5',
    category: 'feedback',
    type: 'sfx',
    variant: 'success',
    volume: 0.4,
    description: 'Acertou — chime suave, três notas sine com fade lento',
    fn() {
        _seq([
        { freq: 440, duration: 0.28, attack: 0.008, volume: this.volume },
        { freq: 554, duration: 0.28, attack: 0.008, delay: 0.09, volume: this.volume },
        { freq: 659, duration: 0.28, attack: 0.008, delay: 0.18, volume: this.volume },
        ]);
    },
    },
    {
    id: 'correct6',
    event: 'correct',
    label: 'correct 6',
    category: 'feedback',
    type: 'sfx',
    variant: 'success',
    volume: 0.25,
    description: 'Acertou — retro beep, square dois tons estilo 8-bit',
    fn() {
        _seq([
        { freq: 660, duration: 0.07, attack: 0.003, type: 'square', volume: this.volume },
        { freq: 880, duration: 0.07, attack: 0.003, type: 'square', delay: 0.08, volume: this.volume },
        ]);
    },
    },
    {
    id: 'correct7',
    event: 'correct',
    label: 'correct 7',
    category: 'feedback',
    type: 'sfx',
    variant: 'success',
    volume: 0.38,
    description: 'Acertou — arpejo rápido, quatro notas sine ascendentes',
    fn() {
        _seq([
        { freq: 523,  duration: 0.09, attack: 0.004, volume: this.volume },
        { freq: 659,  duration: 0.09, attack: 0.004, delay: 0.06, volume: this.volume },
        { freq: 784,  duration: 0.09, attack: 0.004, delay: 0.12, volume: this.volume },
        { freq: 1047, duration: 0.09, attack: 0.004, delay: 0.18, volume: this.volume },
        ]);
    },
    },
    {
    id: 'correct8',
    event: 'correct',
    label: 'correct 8',
    category: 'feedback',
    type: 'sfx',
    variant: 'success',
    volume: 0.35,
    description: 'Acertou — tick + shimmer, sine seco com harmônico alto',
    fn() {
        _seq([
        { freq: 800,  duration: 0.06, attack: 0.004, volume: this.volume },
        { freq: 1600, duration: 0.04, attack: 0.004, volume: this.volume * 0.5 },
        { freq: 1200, duration: 0.08, attack: 0.004, delay: 0.07, volume: this.volume * 0.6 },
        ]);
    },
    },

    /* botões de Erros*/
    {
    id: 'wrong', event: 'wrong', label: 'wrong',
    category: 'feedback', type: 'sfx', variant: 'danger', volume: 0.35,
    description: 'Errou — buzz square descendente',
    fn() { _tone({ freq: 280, freqEnd: 160, duration: 0.22, type: 'square', volume: this.volume }); },
    },
    {
    id: 'wrong2', event: 'wrong', label: 'wrong 2',
    category: 'feedback', type: 'sfx', variant: 'danger', volume: 0.38,
    description: 'Errou — dois pulsos square graves',
    fn() {
        _seq([
        { freq: 220, duration: 0.12, type: 'square', volume: this.volume },
        { freq: 180, duration: 0.12, delay: 0.14, type: 'square', volume: this.volume - 0.05 },
        ]);
    },
    },
    {
    id: 'wrong3', event: 'wrong', label: 'wrong 3',
    category: 'feedback', type: 'sfx', variant: 'danger', volume: 0.3,
    description: 'Errou — queda sawtooth seca, interface com erro, falha de leitura',
    fn() { _tone({ freq: 160, freqEnd: 70, duration: 0.28, type: 'sawtooth', volume: this.volume }); },
    },
    {
    id: 'wrong4', event: 'wrong', label: 'wrong 4',
    category: 'feedback', type: 'sfx', variant: 'danger', volume: 0.28,
    description: 'Errou — três micro-pulsos square descendentes, glitch digital',
    fn() {
        _seq([
        { freq: 320, duration: 0.055, type: 'square', volume: this.volume },
        { freq: 200, duration: 0.055, delay: 0.07, type: 'square', volume: this.volume },
        { freq: 140, duration: 0.055, delay: 0.13, type: 'square', volume: this.volume - 0.05 },
        ]);
    },
    },
    {
    id: 'wrong5', event: 'wrong', label: 'wrong 5',
    category: 'feedback', type: 'sfx', variant: 'danger', volume: 0.33,
    description: 'Errou — burst sawtooth com queda rápida, choque elétrico',
    fn() {
        _seq([
        { freq: 600, freqEnd: 200, duration: 0.09, type: 'sawtooth', volume: this.volume },
        { freq: 300, freqEnd: 100, duration: 0.14, delay: 0.1, type: 'sawtooth', volume: this.volume },
        ]);
    },
    },
    {
    id: 'wrong6', event: 'wrong', label: 'wrong 6',
    category: 'feedback', type: 'sfx', variant: 'danger', volume: 0.36,
    description: 'Errou — dois beeps sine descendentes em cascata',
    fn() {
        _seq([
        { freq: 500, freqEnd: 350, duration: 0.12, type: 'sine', volume: this.volume },
        { freq: 350, freqEnd: 220, duration: 0.12, delay: 0.16, type: 'sine', volume: this.volume - 0.05 },
        ]);
    },
    },

    /* Timer */
    {
    id: 'timeout', event: 'timeout', label: 'timeout',
    category: 'alerts', type: 'sfx', variant: 'danger', volume: 0.45,
    description: 'Tempo esgotado — alarme duplo sine descendente',
    fn() {
        _seq([
        { freq: 660, freqEnd: 440, duration: 0.18, type: 'sine', volume: this.volume },
        { freq: 550, freqEnd: 330, duration: 0.18, delay: 0.22, type: 'sine', volume: this.volume - 0.05 },
        ]);
    },
    },
    {
    id: 'timeout2', event: 'timeout', label: 'timeout 2',
    category: 'alerts', type: 'sfx', variant: 'danger', volume: 0.42,
    description: 'Tempo esgotado — três bipes sine descendentes em sequência',
    fn() {
        _seq([
        { freq: 700, duration: 0.1, type: 'sine', volume: this.volume },
        { freq: 560, duration: 0.1, delay: 0.14, type: 'sine', volume: this.volume },
        { freq: 420, duration: 0.1, delay: 0.28, type: 'sine', volume: this.volume - 0.05 },
        ]);
    },
    },
    {
    id: 'timeout3', event: 'timeout', label: 'timeout 3',
    category: 'alerts', type: 'sfx', variant: 'warning', volume: 0.38,
    description: 'Tempo esgotado — triangle suave com fade lento, fim elegante',
    fn() { _tone({ freq: 520, freqEnd: 280, duration: 0.5, attack: 0.01, type: 'triangle', volume: this.volume }); },
    },
    {
    id: 'timeout4', event: 'timeout', label: 'timeout 4',
    category: 'alerts', type: 'sfx', variant: 'danger', volume: 0.4,
    description: 'Tempo esgotado — quatro notas sine descendentes, campainha de fim de round',
    fn() {
        _seq([
        { freq: 880,  duration: 0.18, type: 'sine', volume: this.volume },
        { freq: 698,  duration: 0.18, delay: 0.1,  type: 'sine', volume: this.volume },
        { freq: 523,  duration: 0.18, delay: 0.2,  type: 'sine', volume: this.volume },
        { freq: 392,  duration: 0.18, delay: 0.3,  type: 'sine', volume: this.volume - 0.05 },
        ]);
    },
    },

    /* Clique */
    {
    id: 'click', event: null, label: 'click',
    category: 'click', type: 'sfx', variant: '', volume: 0.28,
    description: 'Click — blip suave triangle, ultra discreto',
    fn() {
        const ctx = _getCtx(); const gains = _getGains();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'triangle'; o.frequency.setValueAtTime(1100, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.045);
        g.gain.setValueAtTime(this.volume, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
        o.connect(g); g.connect(gains.sfx); o.start(); o.stop(ctx.currentTime + 0.05);
    },
    },
    {
    id: 'click2', event: null, label: 'click 2',
    category: 'click', type: 'sfx', variant: '', volume: 0.45,
    description: 'Click — tap leve sine com decay exponencial, mobile-first',
    fn() {
        const ctx = _getCtx(); const gains = _getGains();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(500, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.07);
        g.gain.setValueAtTime(this.volume, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
        o.connect(g); g.connect(gains.sfx); o.start(); o.stop(ctx.currentTime + 0.08);
    },
    },
    {
    id: 'click3', event: null, label: 'click 3',
    category: 'click', type: 'sfx', variant: '', volume: 0.25,
    description: 'Click — pluck sintético sawtooth, orgânico e digital',
    fn() {
        const ctx = _getCtx(); const gains = _getGains();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(440, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.12);
        g.gain.setValueAtTime(this.volume, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        o.connect(g); g.connect(gains.sfx); o.start(); o.stop(ctx.currentTime + 0.13);
    },
    },
    {
    id: 'click4', event: null, label: 'click 4',
    category: 'click', type: 'sfx', variant: '', volume: 0.5,
    description: 'Click — double tap dois tocks graves rápidos',
    fn() {
        const ctx = _getCtx(); const gains = _getGains();
        [0, 70].forEach(ms => {
        setTimeout(() => {
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'sine'; o.frequency.setValueAtTime(300, ctx.currentTime);
            o.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.055);
            g.gain.setValueAtTime(this.volume, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.055);
            o.connect(g); g.connect(gains.sfx); o.start(); o.stop(ctx.currentTime + 0.06);
        }, ms);
        });
    },
    },
    {
    id: 'click5', event: null, label: 'click 5',
    category: 'click', type: 'sfx', variant: '', volume: 0.22,
    description: 'Click — micro ping sine alto curtíssimo, notificação silenciosa',
    fn() {
        const ctx = _getCtx(); const gains = _getGains();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = 1400;
        g.gain.setValueAtTime(this.volume, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.055);
        o.connect(g); g.connect(gains.sfx); o.start(); o.stop(ctx.currentTime + 0.06);
    },
    },
    {
    id: 'click6', event: null, label: 'click 6',
    category: 'click', type: 'sfx', variant: '', volume: 0.7,
    description: 'Click — thud sólido sine sub-grave, botão com peso',
    fn() {
        const ctx = _getCtx(); const gains = _getGains();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(140, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
        g.gain.setValueAtTime(this.volume, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        o.connect(g); g.connect(gains.sfx); o.start(); o.stop(ctx.currentTime + 0.11);
    },
    },

    /* Hover */
    {
    id: 'hover', event: null, label: 'hover',
    category: 'hover', type: 'sfx', variant: '', volume: 0.1,
    description: 'Hover — breath sine suavíssimo, presença quase inaudível',
    fn() {
        const ctx = _getCtx(); const gains = _getGains();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = 960;
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + 0.025);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.07);
        o.connect(g); g.connect(gains.sfx); o.start(); o.stop(ctx.currentTime + 0.08);
    },
    },
    {
    id: 'hover2', event: null, label: 'hover 2',
    category: 'hover', type: 'sfx', variant: '', volume: 0.12,
    description: 'Hover — whisper alto sine aéreo com sweep descendente',
    fn() {
        const ctx = _getCtx(); const gains = _getGains();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(2200, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.06);
        g.gain.setValueAtTime(this.volume, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        o.connect(g); g.connect(gains.sfx); o.start(); o.stop(ctx.currentTime + 0.07);
    },
    },
    {
    id: 'hover3', event: null, label: 'hover 3',
    category: 'hover', type: 'sfx', variant: '', volume: 0.13,
    description: 'Hover — drip leve sine descendente, gota delicada',
    fn() {
        const ctx = _getCtx(); const gains = _getGains();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(1400, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.055);
        g.gain.setValueAtTime(this.volume, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.055);
        o.connect(g); g.connect(gains.sfx); o.start(); o.stop(ctx.currentTime + 0.065);
    },
    },
    {
    id: 'hover4', event: null, label: 'hover 4',
    category: 'hover', type: 'sfx', variant: '', volume: 0.18,
    description: 'Hover — tap suave sine grave curtíssimo, quase tátil',
    fn() {
        const ctx = _getCtx(); const gains = _getGains();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(340, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);
        g.gain.setValueAtTime(this.volume, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        o.connect(g); g.connect(gains.sfx); o.start(); o.stop(ctx.currentTime + 0.06);
    },
    },
    {
    id: 'hover5', event: null, label: 'hover 5',
    category: 'hover', type: 'sfx', variant: '', volume: 0.11,
    description: 'Hover — blip neutro triangle flat, presença subliminar',
    fn() {
        const ctx = _getCtx(); const gains = _getGains();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'triangle'; o.frequency.value = 1050;
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + 0.008);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.038);
        o.connect(g); g.connect(gains.sfx); o.start(); o.stop(ctx.currentTime + 0.04);
    },
    },
    {
    id: 'hover6', event: null, label: 'hover 6',
    category: 'hover', type: 'sfx', variant: '', volume: 0.13,
    description: 'Hover — glide sci-fi sine ascendente, interface holográfica',
    fn() {
        const ctx = _getCtx(); const gains = _getGains();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(500, ctx.currentTime);
        o.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.07);
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + 0.015);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.07);
        o.connect(g); g.connect(gains.sfx); o.start(); o.stop(ctx.currentTime + 0.08);
    },
    },
    {
    id: 'hover7', event: null, label: 'hover 7',
    category: 'hover', type: 'sfx', variant: '', volume: 0.09,
    description: 'Hover — tick micro square retrô quase inaudível, pura textura',
    fn() {
        const ctx = _getCtx(); const gains = _getGains();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'square'; o.frequency.setValueAtTime(600, ctx.currentTime);
        o.frequency.linearRampToValueAtTime(420, ctx.currentTime + 0.03);
        g.gain.setValueAtTime(this.volume, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.03);
        o.connect(g); g.connect(gains.sfx); o.start(); o.stop(ctx.currentTime + 0.035);
    },
    },
    {
    id: 'hover8', event: null, label: 'hover 8',
    category: 'hover', type: 'sfx', variant: '', volume: 0.1,
    description: 'Hover — hiss suave triangle alto com fade simétrico, UI premium',
    fn() {
        const ctx = _getCtx(); const gains = _getGains();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'triangle'; o.frequency.setValueAtTime(1800, ctx.currentTime);
        o.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.08);
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + 0.02);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
        o.connect(g); g.connect(gains.sfx); o.start(); o.stop(ctx.currentTime + 0.09);
    },
    },

    /* Select */
    {
      id: 'select', event: 'select', label: 'select 1',
      category: 'select', type: 'sfx', variant: '', volume: 0.35,
      description: 'Select — tick ascendente, dois sines subindo, leve e confirmativo',
      fn() {
        _seq([
          { freq: 600, freqEnd: 750, duration: 0.07, attack: 0.005, volume: this.volume },
          { freq: 750, freqEnd: 900, duration: 0.07, attack: 0.005, delay: 0.08, volume: this.volume },
        ]);
      },
    },
    {
      id: 'select2', event: 'select', label: 'select 2',
      category: 'select', type: 'sfx', variant: '', volume: 0.38,
      description: 'Select — pluck triangle com decay suave, orgânico, lista de papel',
      fn() {
        _tone({ freq: 880, freqEnd: 660, duration: 0.18, attack: 0.004, type: 'triangle', volume: this.volume });
      },
    },
    {
      id: 'select3', event: 'select', label: 'select 3',
      category: 'select', type: 'sfx', variant: '', volume: 0.22,
      description: 'Select — beep square curto estilo 8-bit, familiar e responsivo',
      fn() {
        _tone({ freq: 740, duration: 0.07, attack: 0.003, type: 'square', volume: this.volume });
      },
    },
    {
      id: 'select4', event: 'select', label: 'select 4',
      category: 'select', type: 'sfx', variant: '', volume: 0.28,
      description: 'Select — chime três notas sine ascendentes, elegante, interface premium',
      fn() {
        _seq([
          { freq: 523, duration: 0.22, attack: 0.01, volume: this.volume },
          { freq: 659, duration: 0.22, attack: 0.01, delay: 0.06, volume: this.volume },
          { freq: 784, duration: 0.22, attack: 0.01, delay: 0.12, volume: this.volume },
        ]);
      },
    },
    {
      id: 'select5', event: 'select', label: 'select 5',
      category: 'select', type: 'sfx', variant: '', volume: 0.32,
      description: 'Select — sweep sine ascendente com fade simétrico, sci-fi, holográfico',
      fn() {
        _tone({ freq: 400, freqEnd: 900, duration: 0.1, attack: 0.02, type: 'sine', volume: this.volume });
      },
    },
    {
      id: 'select6', event: 'select', label: 'select 6',
      category: 'select', type: 'sfx', variant: '', volume: 0.3,
      description: 'Select — double tap, dois taps sine com subida, sensação de checkbox tátil',
      fn() {
        _seq([
          { freq: 560, freqEnd: 620, duration: 0.06, attack: 0.003, volume: this.volume },
          { freq: 700, freqEnd: 840, duration: 0.06, attack: 0.003, delay: 0.09, volume: this.volume },
        ]);
      },
    },
    {
      id: 'select7', event: 'select', label: 'select 7',
      category: 'select', type: 'sfx', variant: '', volume: 0.3,
      description: 'Select — ping triangle cristalino com decay lento, limpo como vidro',
      fn() {
        _tone({ freq: 1320, duration: 0.2, attack: 0.004, decay: 0.19, type: 'triangle', volume: this.volume });
      },
    },
    {
      id: 'select8', event: 'select', label: 'select 8',
      category: 'select', type: 'sfx', variant: '', volume: 0.28,
      description: 'Select — thock mecânico, square grave com harmônico alto simultâneo, satisfatório',
      fn() {
        _seq([
          { freq: 280, freqEnd: 280, duration: 0.09, attack: 0.003, type: 'square', volume: this.volume },
          { freq: 1100, freqEnd: 900, duration: 0.04, attack: 0.003, type: 'square', volume: this.volume * 0.5 },
        ]);
      },
    },
    {
      id: 'select9', event: 'select', label: 'select 9',
      category: 'select', type: 'sfx', variant: '', volume: 0.18,
      description: 'Select — shimmer etéreo, dois sines em terça com fade lento, seleção mágica',
      fn() {
        _seq([
          { freq: 660, duration: 0.28, attack: 0.015, volume: this.volume },
          { freq: 825, duration: 0.28, attack: 0.015, volume: this.volume },
        ]);
      },
    },
    {
      id: 'select10', event: 'select', label: 'select 10',
      category: 'select', type: 'sfx', variant: '', volume: 0.22,
      description: 'Select — micro-whoosh sawtooth com sweep rápido, dinâmico, drag and drop',
      fn() {
        _tone({ freq: 300, freqEnd: 700, duration: 0.08, attack: 0.01, type: 'sawtooth', volume: this.volume });
      },
    },

    /* Open Modal */
    {
      id: 'openModal', event: 'openModal', label: 'openModal 1',
      category: 'openModal', type: 'sfx', variant: '', volume: 0.22,
      description: 'openModal — chime de entrada, dois sines em quinta simultâneos, cortina abrindo',
      fn() {
        _seq([
          { freq: 440, duration: 0.3, attack: 0.015, volume: this.volume },
          { freq: 660, duration: 0.3, attack: 0.015, volume: this.volume },
        ]);
      },
    },
    {
      id: 'openModal2', event: 'openModal', label: 'openModal 2',
      category: 'openModal', type: 'sfx', variant: '', volume: 0.22,
      description: 'openModal — sweep ascendente suave, dois sines sobem juntos, abertura aérea',
      fn() {
        _seq([
          { freq: 330, freqEnd: 500, duration: 0.25, attack: 0.02, volume: this.volume },
          { freq: 495, freqEnd: 750, duration: 0.25, attack: 0.02, volume: this.volume * 0.82 },
        ]);
      },
    },
    {
      id: 'openModal3', event: 'openModal', label: 'openModal 3',
      category: 'openModal', type: 'sfx', variant: '', volume: 0.2,
      description: 'openModal — chime cristalino triangle, dois harmônicos simultâneos, vidro abrindo',
      fn() {
        _seq([
          { freq: 880,  duration: 0.32, attack: 0.006, decay: 0.28, type: 'triangle', volume: this.volume },
          { freq: 1320, duration: 0.32, attack: 0.006, decay: 0.28, type: 'triangle', volume: this.volume * 0.7 },
        ]);
      },
    },

    /* Close Modal */
    {
      id: 'closeModal', event: 'closeModal', label: 'closeModal 1',
      category: 'closeModal', type: 'sfx', variant: '', volume: 0.2,
      description: 'closeModal — sweep descendente suave, dois sines descem juntos, fechamento aéreo',
      fn() {
        _seq([
          { freq: 500, freqEnd: 330, duration: 0.2, attack: 0.01, volume: this.volume },
          { freq: 750, freqEnd: 495, duration: 0.2, attack: 0.01, volume: this.volume * 0.8 },
        ]);
      },
    },
    {
      id: 'closeModal2', event: 'closeModal', label: 'closeModal 2',
      category: 'closeModal', type: 'sfx', variant: '', volume: 0.18,
      description: 'closeModal — sci-fi collapse, sweep duplo caindo em oitava, portal fechando',
      fn() {
        _seq([
          { freq: 700,  freqEnd: 300, duration: 0.16, attack: 0.01, volume: this.volume },
          { freq: 1400, freqEnd: 600, duration: 0.16, attack: 0.01, volume: this.volume * 0.61 },
        ]);
      },
    },
    {
      id: 'closeModal3', event: 'closeModal', label: 'closeModal 3',
      category: 'closeModal', type: 'sfx', variant: '', volume: 0.18,
      description: 'closeModal — retro dismiss, sine descendente + square grave curto, game indie',
      fn() {
        _seq([
          { freq: 990, freqEnd: 660, duration: 0.22, attack: 0.008, decay: 0.2, type: 'sine',   volume: this.volume },
          { freq: 220, duration: 0.05, attack: 0.003, delay: 0.18,  type: 'square', volume: this.volume * 0.89 },
        ]);
      },
    },

    /* Pause */
    {
      id: 'pause1', event: 'pause', label: 'pause 1',
      category: 'pause', type: 'sfx', variant: '', volume: 0.38,
      description: 'pause — dois tons descendentes suaves sine, sensação de desacelerar',
      fn() {
        _seq([
          { freq: 500, duration: 0.08, volume: this.volume },
          { freq: 380, duration: 0.08, delay: 0.09, volume: this.volume },
        ]);
      },
    },
    {
      id: 'pause2', event: 'pause', label: 'pause 2',
      category: 'pause', type: 'sfx', variant: '', volume: 0.32,
      description: 'pause — fade out sine único, nota longa que some devagar, o mundo desacelerando',
      fn() {
        _seq([
          { freq: 420, freqEnd: 380, duration: 0.45, attack: 0.01, decay: 0.42, volume: this.volume },
        ]);
      },
    },
    {
      id: 'pause3', event: 'pause', label: 'pause 3',
      category: 'pause', type: 'sfx', variant: '', volume: 0.3,
      description: 'pause — thud suave grave + shimmer triangle alto sumindo, pausa com peso',
      fn() {
        _seq([
          { freq: 200, freqEnd: 140, duration: 0.09, attack: 0.004, volume: this.volume },
          { freq: 900, duration: 0.28, attack: 0.01, decay: 0.26, type: 'triangle', volume: this.volume * 0.47 },
        ]);
      },
    },
    {
      id: 'pause4', event: 'pause', label: 'pause 4',
      category: 'pause', type: 'sfx', variant: '', volume: 0.32,
      description: 'pause — tock seco imediato + drone triangle longo sumindo, tudo congelando',
      fn() {
        _seq([
          { freq: 300, freqEnd: 80,  duration: 0.06, attack: 0.002, volume: this.volume },
          { freq: 220, duration: 0.5, attack: 0.01, decay: 0.46, type: 'triangle', volume: this.volume * 0.47 },
        ]);
      },
    },

    /* Timer Warning */
    {
      id: 'timerWarning1', event: 'timerWarning', label: 'timerWarning 1',
      category: 'timerWarning', type: 'sfx', variant: 'warning', volume: 0.36,
      description: 'timerWarning — três beeps triangle crescentes, urgência escalando',
      fn() {
        _seq([
          { freq: 660, duration: 0.5, attack: 0.005, decay: 0.45, type: 'triangle', delay: 0,    volume: this.volume * 0.78 },
          { freq: 740, duration: 0.5, attack: 0.005, decay: 0.45, type: 'triangle', delay: 0.22, volume: this.volume * 0.89 },
          { freq: 830, duration: 0.5, attack: 0.005, decay: 0.45, type: 'triangle', delay: 0.44, volume: this.volume },
        ]);
      },
    },
    {
      id: 'timerWarning2', event: 'timerWarning', label: 'timerWarning 2',
      category: 'timerWarning', type: 'sfx', variant: 'warning', volume: 0.36,
      description: 'timerWarning — quatro pulsos triangle alternados, dois pares, coração acelerado',
      fn() {
        _seq([
          { freq: 700, duration: 0.45, attack: 0.005, decay: 0.4, type: 'triangle', delay: 0,   volume: this.volume * 0.83 },
          { freq: 800, duration: 0.45, attack: 0.005, decay: 0.4, type: 'triangle', delay: 0.2, volume: this.volume * 0.94 },
          { freq: 700, duration: 0.45, attack: 0.005, decay: 0.4, type: 'triangle', delay: 0.7, volume: this.volume * 0.92 },
          { freq: 800, duration: 0.45, attack: 0.005, decay: 0.4, type: 'triangle', delay: 0.9, volume: this.volume },
        ]);
      },
    },
    {
      id: 'timerWarning3', event: 'timerWarning', label: 'timerWarning 3',
      category: 'timerWarning', type: 'sfx', variant: 'warning', volume: 0.36,
      description: 'timerWarning — dois pares triangle rápidos, duplo alerta nervoso',
      fn() {
        _seq([
          { freq: 720, duration: 0.4, attack: 0.004, decay: 0.36, type: 'triangle', delay: 0,    volume: this.volume * 0.89 },
          { freq: 850, duration: 0.4, attack: 0.004, decay: 0.36, type: 'triangle', delay: 0.15, volume: this.volume * 0.97 },
          { freq: 720, duration: 0.4, attack: 0.004, decay: 0.36, type: 'triangle', delay: 0.55, volume: this.volume * 0.94 },
          { freq: 850, duration: 0.4, attack: 0.004, decay: 0.36, type: 'triangle', delay: 0.7,  volume: this.volume },
        ]);
      },
    },
    {
      id: 'timerWarning4', event: 'timerWarning', label: 'timerWarning 4',
      category: 'timerWarning', type: 'sfx', variant: 'warning', volume: 0.36,
      description: 'timerWarning — cinco pulsos triangle acelerando, conta regressiva visceral',
      fn() {
        _seq([
          { freq: 760, duration: 0.42, attack: 0.005, decay: 0.38, type: 'triangle', delay: 0,    volume: this.volume * 0.78 },
          { freq: 780, duration: 0.42, attack: 0.005, decay: 0.38, type: 'triangle', delay: 0.38, volume: this.volume * 0.83 },
          { freq: 800, duration: 0.42, attack: 0.005, decay: 0.38, type: 'triangle', delay: 0.72, volume: this.volume * 0.89 },
          { freq: 820, duration: 0.42, attack: 0.005, decay: 0.38, type: 'triangle', delay: 1.02, volume: this.volume * 0.94 },
          { freq: 860, duration: 0.42, attack: 0.005, decay: 0.38, type: 'triangle', delay: 1.28, volume: this.volume },
        ]);
      },
    },

    /* Música / BGM */
    {
      id: 'music-menu', event: null, label: 'menu', category: 'music', type: 'music',
      variant: 'info', volume: 0.4, loop: true, description: 'BGM do menu principal — atmosfera ambient',
      fn() {
        _bgmEngine.play('music-menu', (ctx, dest) => {
          const nodes = [];
          const drone = ctx.createOscillator();
          const droneGain = ctx.createGain();
          drone.type = 'sine'; drone.frequency.value = 110; droneGain.gain.value = 0.12;
          drone.connect(droneGain); droneGain.connect(dest); drone.start(); nodes.push(drone);
          const harm = ctx.createOscillator();
          const harmGain = ctx.createGain();
          harm.type = 'sine'; harm.frequency.value = 220; harmGain.gain.value = 0.06;
          harm.connect(harmGain); harmGain.connect(dest); harm.start(); nodes.push(harm);
          const notes = [330, 392, 440, 523, 440, 392];
          let i = 0;
          const arpGain = ctx.createGain(); arpGain.gain.value = 0.08; arpGain.connect(dest);
          function playArpNote() {
            if (!_currentBgm || _currentBgm.id !== 'music-menu') return;
            const osc = ctx.createOscillator(); const g = ctx.createGain();
            osc.connect(g); g.connect(arpGain); osc.type = 'sine';
            osc.frequency.value = notes[i % notes.length];
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.85);
            i++; setTimeout(playArpNote, 900);
          }
          setTimeout(playArpNote, 500);
          return nodes;
        });
      },
    },
    {
      id: 'music-game', event: null, label: 'game', category: 'music', type: 'music',
      variant: 'info', volume: 0.4, loop: true, description: 'BGM game — perfil futurista, arpejo sci-fi, pulse rítmico',
      fn() {
        _bgmEngine.play('music-game', (ctx, dest) => {
          const nodes = [];
          const dr = ctx.createOscillator(), drg = ctx.createGain();
          dr.type = 'sine'; dr.frequency.value = 55; drg.gain.value = 0.13;
          dr.connect(drg); drg.connect(dest); dr.start(); nodes.push(dr);
          const dr2 = ctx.createOscillator(), dr2g = ctx.createGain();
          dr2.type = 'sine'; dr2.frequency.value = 110; dr2g.gain.value = 0.06;
          dr2.connect(dr2g); dr2g.connect(dest); dr2.start(); nodes.push(dr2);
          const arpPhrases = [
            [330, 440, 523, 659, 784, 659, 523, 440],
            [349, 466, 587, 698, 784, 698, 587, 466],
            [330, 415, 523, 622, 784, 622, 523, 415],
          ];
          let ai = 0, aphrase = 0, acount = 0;
          const ag = ctx.createGain(); ag.gain.value = 0.08; ag.connect(dest);
          function arp() {
            if (!_currentBgm || _currentBgm.id !== 'music-game') return;
            const sc = arpPhrases[aphrase];
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'square'; o.frequency.value = sc[ai % sc.length];
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 0.015);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.12);
            o.connect(g); g.connect(ag); o.start(); o.stop(ctx.currentTime + 0.13);
            ai++; acount++;
            if (acount % 16 === 0) { aphrase = (aphrase + 1) % arpPhrases.length; }
            const gap = [120, 150, 100, 140, 160][ai % 5];
            setTimeout(arp, gap);
          }
          setTimeout(arp, 300);
          let pi = 0;
          const pulseG = ctx.createGain(); pulseG.gain.value = 0.06; pulseG.connect(dest);
          const pSeq = [110, 110, 138, 110, 82, 110, 138, 165];
          function pulse() {
            if (!_currentBgm || _currentBgm.id !== 'music-game') return;
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'triangle'; o.frequency.value = pSeq[pi % pSeq.length];
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.02);
            g.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.08);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
            o.connect(g); g.connect(pulseG); o.start(); o.stop(ctx.currentTime + 0.35);
            pi++; setTimeout(pulse, 600);
          }
          setTimeout(pulse, 0);
          let si = 0;
          const shimG = ctx.createGain(); shimG.gain.value = 0.025; shimG.connect(dest);
          const shimNotes = [784, 880, 1047, 1174, 1047, 880];
          function shim() {
            if (!_currentBgm || _currentBgm.id !== 'music-game') return;
            si++;
            if (si % 7 === 0) {
              shimNotes.forEach((f, i) => {
                setTimeout(() => {
                  if (!_currentBgm || _currentBgm.id !== 'music-game') return;
                  const o = ctx.createOscillator(), g = ctx.createGain();
                  o.type = 'sine'; o.frequency.value = f;
                  g.gain.setValueAtTime(0, ctx.currentTime);
                  g.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.04);
                  g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.45);
                  o.connect(g); g.connect(shimG); o.start(); o.stop(ctx.currentTime + 0.5);
                }, i * 90);
              });
            }
            setTimeout(shim, 700);
          }
          setTimeout(shim, 2000);
          return nodes;
        });
      },
    },
    {
      id: 'music-quiz', event: null, label: 'quiz', category: 'music', type: 'music',
      variant: 'info', volume: 0.4, loop: true, description: 'BGM seleção quiz — emocional, acolhedora, foco e aprendizado',
      fn() {
        _bgmEngine.play('music-quiz', (ctx, dest) => {
          const nodes = [];
          const root = ctx.createOscillator(), rootg = ctx.createGain();
          root.type = 'sine'; root.frequency.value = 98; rootg.gain.value = 0.14;
          root.connect(rootg); rootg.connect(dest); root.start(); nodes.push(root);
          const fifth = ctx.createOscillator(), fifthg = ctx.createGain();
          fifth.type = 'sine'; fifth.frequency.value = 146; fifthg.gain.value = 0.07;
          fifth.connect(fifthg); fifthg.connect(dest); fifth.start(); nodes.push(fifth);
          const oct = ctx.createOscillator(), octg = ctx.createGain();
          oct.type = 'sine'; oct.frequency.value = 196; octg.gain.value = 0.04;
          oct.connect(octg); octg.connect(dest); oct.start(); nodes.push(oct);
          const warm = [196, 146, 220, 146];
          let wi = 0;
          const wg = ctx.createGain(); wg.gain.value = 0.055; wg.connect(dest);
          function doWarm() {
            if (!_currentBgm || _currentBgm.id !== 'music-quiz') return;
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.connect(g); g.connect(wg); o.type = 'triangle';
            o.frequency.value = warm[wi % warm.length];
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.25);
            g.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.9);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.8);
            o.start(ctx.currentTime); o.stop(ctx.currentTime + 1.9);
            wi++; setTimeout(doWarm, 2200);
          }
          setTimeout(doWarm, 600);
          const melody = [392, 440, 392, 349, 329, 349, 392, 440, 494, 440];
          let mi = 0;
          const melg = ctx.createGain(); melg.gain.value = 0.075; melg.connect(dest);
          function doMel() {
            if (!_currentBgm || _currentBgm.id !== 'music-quiz') return;
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.connect(g); g.connect(melg); o.type = 'sine';
            o.frequency.value = melody[mi % melody.length];
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.1);
            g.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.5);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.1);
            o.start(ctx.currentTime); o.stop(ctx.currentTime + 1.2);
            mi++; setTimeout(doMel, 1300);
          }
          setTimeout(doMel, 1800);
          return nodes;
        });
      },
    },
    {
      id: 'music-results', event: null, label: 'results', category: 'music', type: 'music',
      variant: 'info', volume: 0.4, loop: true, description: 'BGM resultados — resumo relaxante, lo-fi digital, missão concluída',
      fn() {
        _bgmEngine.play('music-results', (ctx, dest) => {
          const nodes = [];
          const b1 = ctx.createOscillator(), bg1 = ctx.createGain();
          b1.type = 'sine'; b1.frequency.value = 82; bg1.gain.value = 0.12;
          b1.connect(bg1); bg1.connect(dest); b1.start(); nodes.push(b1);
          const b2 = ctx.createOscillator(), bg2 = ctx.createGain();
          b2.type = 'sine'; b2.frequency.value = 110; bg2.gain.value = 0.06;
          b2.connect(bg2); bg2.connect(dest); b2.start(); nodes.push(b2);
          const padFreqs = [164, 196, 246];
          const pg = ctx.createGain(); pg.gain.value = 0.035; pg.connect(dest);
          padFreqs.forEach(f => {
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'triangle'; o.frequency.value = f;
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(1, ctx.currentTime + 3);
            o.connect(g); g.connect(pg); o.start(); nodes.push(o);
          });
          const scales = [
            [261, 293, 329, 392, 440, 392, 329, 293],
            [261, 311, 349, 392, 440, 392, 349, 311],
            [261, 293, 349, 392, 466, 392, 349, 293],
          ];
          let si = 0, scaleIdx = 0, phraseCount = 0;
          const mg = ctx.createGain(); mg.gain.value = 0.065; mg.connect(dest);
          function mel() {
            if (!_currentBgm || _currentBgm.id !== 'music-results') return;
            const scale = scales[scaleIdx];
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.connect(g); g.connect(mg); o.type = 'sine';
            o.frequency.value = scale[si % scale.length];
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.15);
            g.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.7);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
            o.start(ctx.currentTime); o.stop(ctx.currentTime + 1.6);
            si++; phraseCount++;
            if (phraseCount % 8 === 0) scaleIdx = (scaleIdx + 1) % scales.length;
            setTimeout(mel, 1700);
          }
          setTimeout(mel, 1000);
          const bassSeq = [82, 82, 98, 82, 73, 82, 98, 110];
          let bi = 0;
          const bassG = ctx.createGain(); bassG.gain.value = 0.05; bassG.connect(dest);
          function bass() {
            if (!_currentBgm || _currentBgm.id !== 'music-results') return;
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.connect(g); g.connect(bassG); o.type = 'sine';
            o.frequency.value = bassSeq[bi % bassSeq.length];
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.55);
            o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.6);
            bi++; setTimeout(bass, 800);
          }
          setTimeout(bass, 400);
          let shimmerTimer = 0;
          const shimG = ctx.createGain(); shimG.gain.value = 0.03; shimG.connect(dest);
          function shimmer() {
            if (!_currentBgm || _currentBgm.id !== 'music-results') return;
            shimmerTimer++;
            if (shimmerTimer % 5 === 0) {
              [523, 659, 784, 659].forEach((f, i) => {
                setTimeout(() => {
                  if (!_currentBgm || _currentBgm.id !== 'music-results') return;
                  const o = ctx.createOscillator(), g = ctx.createGain();
                  o.connect(g); g.connect(shimG); o.type = 'triangle';
                  o.frequency.value = f;
                  g.gain.setValueAtTime(0, ctx.currentTime);
                  g.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05);
                  g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
                  o.connect(g); g.connect(shimG); o.start(); o.stop(ctx.currentTime + 0.65);
                }, i * 180);
              });
            }
            setTimeout(shimmer, 900);
          }
          setTimeout(shimmer, 3200);
          return nodes;
        });
      },
    },
    {
      id: 'music-profile', event: null, label: 'profile', category: 'music', type: 'music',
      variant: 'info', volume: 0.4, loop: true, description: 'BGM área pessoal — jornada do jogador, emocional e motivadora',
      fn() {
        _bgmEngine.play('music-profile', (ctx, dest) => {
          const nodes = [];
          const dr = ctx.createOscillator(), drg = ctx.createGain();
          dr.type = 'sine'; dr.frequency.value = 98; drg.gain.value = 0.12;
          dr.connect(drg); drg.connect(dest); dr.start(); nodes.push(dr);
          const dr5 = ctx.createOscillator(), dr5g = ctx.createGain();
          dr5.type = 'sine'; dr5.frequency.value = 147; dr5g.gain.value = 0.06;
          dr5.connect(dr5g); dr5g.connect(dest); dr5.start(); nodes.push(dr5);
          const padFreqs = [196, 246, 294];
          const pg = ctx.createGain(); pg.gain.value = 0.04; pg.connect(dest);
          padFreqs.forEach(f => {
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'triangle'; o.frequency.value = f;
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(1, ctx.currentTime + 5);
            o.connect(g); g.connect(pg); o.start(); nodes.push(o);
          });
          const melPhrases = [
            [392, 440, 494, 523, 494, 440, 392, 349, 329, 349, 392, 440],
            [392, 466, 523, 587, 523, 466, 392, 349, 392, 440, 466, 440],
            [349, 392, 440, 494, 523, 494, 440, 392, 349, 329, 349, 392],
          ];
          let mi = 0, mphrase = 0, mcount = 0;
          const mg = ctx.createGain(); mg.gain.value = 0.072; mg.connect(dest);
          function mel() {
            if (!_currentBgm || _currentBgm.id !== 'music-profile') return;
            const sc = melPhrases[mphrase];
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'sine'; o.frequency.value = sc[mi % sc.length];
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.12);
            g.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.6);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
            o.connect(g); g.connect(mg); o.start(); o.stop(ctx.currentTime + 1.3);
            mi++; mcount++;
            if (mcount % 12 === 0) { mphrase = (mphrase + 1) % melPhrases.length; mi = 0; }
            const nxt = [1300, 1400, 1200, 1500, 1350][mi % 5];
            setTimeout(mel, nxt);
          }
          setTimeout(mel, 1000);
          let bi = 0;
          const bassSeq = [98, 98, 110, 98, 82, 98, 110, 123];
          const bassG = ctx.createGain(); bassG.gain.value = 0.06; bassG.connect(dest);
          function bass() {
            if (!_currentBgm || _currentBgm.id !== 'music-profile') return;
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'sine'; o.frequency.value = bassSeq[bi % bassSeq.length];
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.55);
            o.connect(g); g.connect(bassG); o.start(); o.stop(ctx.currentTime + 0.6);
            bi++; setTimeout(bass, [850, 950, 800, 900, 1000][bi % 5]);
          }
          setTimeout(bass, 500);
          let scnt = 0;
          const shimG = ctx.createGain(); shimG.gain.value = 0.03; shimG.connect(dest);
          const shimNotes = [523, 659, 784, 880, 784, 659];
          function shim() {
            if (!_currentBgm || _currentBgm.id !== 'music-profile') return;
            scnt++;
            if (scnt % 6 === 0) {
              shimNotes.forEach((f, i) => {
                setTimeout(() => {
                  if (!_currentBgm || _currentBgm.id !== 'music-profile') return;
                  const o = ctx.createOscillator(), g = ctx.createGain();
                  o.type = 'triangle'; o.frequency.value = f;
                  g.gain.setValueAtTime(0, ctx.currentTime);
                  g.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.06);
                  g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.7);
                  o.connect(g); g.connect(shimG); o.start(); o.stop(ctx.currentTime + 0.75);
                }, i * 130);
              });
            }
            setTimeout(shim, 1000);
          }
          setTimeout(shim, 3500);
          return nodes;
        });
      },
    },

];

/* ═══════════════════════════════════════════════
   7. API PÚBLICA — sfx (efeitos)
═══════════════════════════════════════════════ */

const _sfxMap = {};
catalog
  .filter(e => e.type === 'sfx')
  .forEach(e => { _sfxMap[e.id] = e; });

const sfxApi = new Proxy({}, {
  get(_, id) {
    const entry = _sfxMap[id];
    if (entry) return () => entry.fn.call(entry);
    return undefined;
  },
});

/* ═══════════════════════════════════════════════
   8. API PÚBLICA — music (bgm)
═══════════════════════════════════════════════ */

const _musicMap = {};
catalog
  .filter(e => e.type === 'music')
  .forEach(e => { _musicMap[e.id] = e; });

const musicApi = new Proxy({
  stop:      (fade) => _bgmEngine.stop(fade),
  currentId: ()     => _bgmEngine.currentId(),
}, {
  get(target, key) {
    if (key in target) return target[key];
    const entry =
      _musicMap[key] ||
      _musicMap[`music-${key}`] ||
      Object.values(_musicMap).find(e => e.label === key);
    if (entry) return () => entry.fn.call(entry);
    return undefined;
  },
});

/* ═══════════════════════════════════════════════
   8b. ÍNDICE DE EVENTOS
═══════════════════════════════════════════════ */

const _eventMap = {};
catalog
  .filter(e => e.type === 'sfx' && e.event)
  .forEach(e => {
    if (!_eventMap[e.event]) _eventMap[e.event] = [];
    _eventMap[e.event].push(e);
  });

function playEvent(eventName, { variant } = {}) {
  const entries = _eventMap[eventName];
  if (!entries || entries.length === 0) {
    console.warn(`[audio] playEvent: evento "${eventName}" não encontrado no catálogo.`);
    return;
  }

  let entry;
  if (variant) {
    entry = entries.find(e => e.id === variant) ?? entries[Math.floor(Math.random() * entries.length)];
  } else {
    entry = entries[Math.floor(Math.random() * entries.length)];
  }
  entry.fn.call(entry);
}

/* ═══════════════════════════════════════════════
   9. API PRINCIPAL (export default)
═══════════════════════════════════════════════ */

const audio = {

  catalog,

  sfx: sfxApi,

  music: musicApi,

  playEvent,

  setMasterVolume(val) {
    _state.masterVolume = Math.min(1, Math.max(0, Number(val) || 0));
    _syncGains();
  },

  setSfxVolume(val) {
    _state.sfxVolume = Math.min(1, Math.max(0, Number(val) || 0));
    _syncGains();
  },

  setMusicVolume(val) {
    _state.musicVolume = Math.min(1, Math.max(0, Number(val) || 0));
    _syncGains();
  },

  getMasterVolume() { return _state.masterVolume; },
  getSfxVolume()    { return _state.sfxVolume; },
  getMusicVolume()  { return _state.musicVolume; },

  setEnabled(bool) {
    _state.enabled = !!bool;
    _syncGains();
  },

  isEnabled() { return _state.enabled; },

  mute() {
    _state.muted = true;
    _syncGains();
  },

  unmute() {
    _state.muted = false;
    _syncGains();
  },

  isMuted() { return _state.muted; },

  stopAll() { _bgmEngine.stop(0); },

  fadeOut(duration = 1) {
    if (!_masterGain) return;
    const ctx = _getCtx(); const t = ctx.currentTime;
    _masterGain.gain.setValueAtTime(_masterGain.gain.value, t);
    _masterGain.gain.linearRampToValueAtTime(0, t + duration);
  },

  fadeIn(duration = 1) {
    if (!_masterGain) return;
    const ctx = _getCtx(); const t = ctx.currentTime;
    _masterGain.gain.setValueAtTime(0, t);
    _masterGain.gain.linearRampToValueAtTime(_state.masterVolume, t + duration);
  },

  /**
   * Reseta o estado de áudio para os valores padrão.
   * Chamado pelo audio-btn no logout para garantir estado limpo.
   * Não persiste — audio-btn gerencia o ciclo de vida de persistência.
   */
  resetToDefaults() {
    Object.assign(_state, { ..._DEFAULT_SFX_STATE });
    _syncGains();
  },

  getState() { return { ..._state }; },
};

export default audio;