// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/engine/sfx-catalog.js
   Catálogo completo de sons (SFX)
   ─────────────────────────────────────────────
   Responsabilidade exclusiva:
   ✅ Definir todas as entradas de som (type: 'sfx')
   ✅ Usar as primitivas importadas de sfx-core.js

   ❌ Lógica de engine, gain nodes, estado, Firebase, UI
   ─────────────────────────────────────────────
   Os alias abaixo tornam o corpo de cada fn() idêntico
   ao original do sfx.js — zero alteração de lógica.
   ============================================= */

import {
  tone        as _tone,
  seq         as _seq,
  isCtxReady  as _isCtxReady,
  getCtx,
  getGains    as _getGains,
} from './sfx-core.js';

// Proxy transparente para que "const ctx = _ctx" funcione nas funções inline.
// _ctx.createOscillator() → getCtx().createOscillator()
const _ctx = new Proxy({}, {
  get(_, prop) {
    const real = getCtx();
    if (!real) return undefined;
    const val = real[prop];
    return typeof val === 'function' ? val.bind(real) : val;
  },
});

export const catalog = [
    /* ── Feedback ────────────────────────────── */

    /* Botões de acertos */
    {
    id: 'correct',
    event: 'correct',
    label: 'correct',
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
    id: 'correct2',
    event: 'correct',
    label: 'correct 2',
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
    id: 'correct3',
    event: 'correct',
    label: 'correct 3',
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
    id: 'correct4',
    event: 'correct',
    label: 'correct 4',
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
    id: 'correct5',
    event: 'correct',
    label: 'correct 5',
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
        if (!_isCtxReady()) return; const ctx = _ctx; const gains = _getGains();
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
        if (!_isCtxReady()) return; const ctx = _ctx; const gains = _getGains();
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
        if (!_isCtxReady()) return; const ctx = _ctx; const gains = _getGains();
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
        if (!_isCtxReady()) return; const ctx = _ctx; const gains = _getGains();
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
        if (!_isCtxReady()) return; const ctx = _ctx; const gains = _getGains();
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
        if (!_isCtxReady()) return; const ctx = _ctx; const gains = _getGains();
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
        if (!_isCtxReady()) return; const ctx = _ctx; const gains = _getGains();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = 960;
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + 0.005);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.07);
        o.connect(g); g.connect(gains.sfx); o.start(); o.stop(ctx.currentTime + 0.08);
    },
    },
    {
    id: 'hover2', event: null, label: 'hover 2',
    category: 'hover', type: 'sfx', variant: '', volume: 0.12,
    description: 'Hover — whisper alto sine aéreo com sweep descendente',
    fn() {
        if (!_isCtxReady()) return; const ctx = _ctx; const gains = _getGains();
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
        if (!_isCtxReady()) return; const ctx = _ctx; const gains = _getGains();
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
        if (!_isCtxReady()) return; const ctx = _ctx; const gains = _getGains();
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
        if (!_isCtxReady()) return; const ctx = _ctx; const gains = _getGains();
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
        if (!_isCtxReady()) return; const ctx = _ctx; const gains = _getGains();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(500, ctx.currentTime);
        o.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.07);
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + 0.005);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.07);
        o.connect(g); g.connect(gains.sfx); o.start(); o.stop(ctx.currentTime + 0.08);
    },
    },
    {
    id: 'hover7', event: null, label: 'hover 7',
    category: 'hover', type: 'sfx', variant: '', volume: 0.09,
    description: 'Hover — tick micro square retrô quase inaudível, pura textura',
    fn() {
        if (!_isCtxReady()) return; const ctx = _ctx; const gains = _getGains();
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
        if (!_isCtxReady()) return; const ctx = _ctx; const gains = _getGains();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'triangle'; o.frequency.setValueAtTime(1800, ctx.currentTime);
        o.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.08);
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + 0.005);
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
      id: 'pause', event: 'pause', label: 'pause',
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
      id: 'timerWarning', event: 'timerWarning', label: 'timerWarning',
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

];