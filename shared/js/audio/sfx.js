/* =============================================
   NEXUS STUDY — shared/js/utils/sfx.js
   Engine central de áudio do projeto
   Versão 2.0 — fonte única de verdade
   Zero dependências · Zero arquivos externos
   ============================================= */

/**
 * USO RÁPIDO:
 *
 *   import audio from './shared/js/sfx.js';
 *
 *   // Efeitos
 *   audio.sfx.click()
 *   audio.sfx.correct()
 *   audio.sfx.wrong()
 *
 *   // Música
 *   audio.music.menu()
 *   audio.music.quiz()
 *   audio.music.stop()
 *
 *   // Controles globais
 *   audio.setMasterVolume(0.5)
 *   audio.setSfxVolume(0.8)
 *   audio.setMusicVolume(0.4)
 *   audio.setEnabled(true)
 *   audio.mute()
 *   audio.unmute()
 *   audio.stopAll()
 *   audio.fadeOut(1.5)
 *
 *   // Toggle UI (substitui sfx-toggle.js)
 *   audio.createToggle('#meu-container')
 *   audio.createToggle('#meu-container', { showVolume: true })
 *
 *   // Catálogo (para o playground)
 *   audio.catalog   → array com todos os sons registrados
 */

/* ═══════════════════════════════════════════════
   1. ESTADO GLOBAL
═══════════════════════════════════════════════ */

const STORAGE_KEY = 'nexus_audio_v2';

const _state = (() => {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch (_) {}
  return {
    enabled:      true,
    muted:        false,
    masterVolume: 0.7,
    sfxVolume:    0.8,
    musicVolume:  0.4,
  };
})();

function _persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_state)); } catch (_) {}
}

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

/**
 * Toca um oscilador com envelope ADSR simplificado.
 */
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

/**
 * Toca múltiplos tons em sequência.
 */
function _seq(notes) {
  if (!_state.enabled || _state.muted) return;
  notes.forEach(({ delay = 0, ...rest }) => {
    setTimeout(() => _tone(rest), delay * 1000);
  });
}

/* ═══════════════════════════════════════════════
   5. SISTEMA DE MÚSICA / BGM
═══════════════════════════════════════════════ */

let _currentBgm = null;   // { nodes, stop, id }

const _bgmEngine = {
  /**
   * Para a música atual com fade opcional.
   * @param {number} fadeTime segundos para fade out (0 = imediato)
   */
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

  /**
   * Toca uma BGM procedural com loop.
   * @param {string} id identificador único da música
   * @param {Function} buildFn função que cria e retorna os nós de áudio
   */
  play(id, buildFn) {
    if (!_state.enabled || _state.muted) return;
    if (_currentBgm?.id === id) return; // já tocando

    this.stop(0.3);

    setTimeout(() => {
      _getGains(); // garante que os gains existem
      const nodes = buildFn(_getCtx(), _musicGain);
      _currentBgm = { id, nodes: Array.isArray(nodes) ? nodes : [nodes] };
    }, _currentBgm ? 350 : 0);
  },

  /**
   * Toca um arquivo de áudio via URL com loop.
   * @param {string} id
   * @param {string} url
   */
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
   ─────────────────────────────────────────────
   ESTRUTURA DE CADA ENTRADA:
   {
     id:          string  — identificador único
     label:       string  — nome exibido no playground
     category:    string  — 'ui' | 'feedback' | 'alerts' | 'music' | 'ambient'
     type:        string  — 'sfx' | 'music'
     variant:     string  — '' | 'success' | 'danger' | 'warning' | 'info'
     volume:      number  — volume relativo (0–1)
     loop:        boolean — faz loop? (usado para music)
     description: string  — descrição curta (opcional)
     fn:          Function — função que toca o som
   }

   ─────────────────────────────────────────────
   PARA ADICIONAR UM SOM NOVO:
   Basta adicionar um objeto aqui embaixo.
   O playground detecta e gera o botão automaticamente.
   ─────────────────────────────────────────────
═══════════════════════════════════════════════ */

export const catalog = [

  /* ─── UI ──────────────────────────────────── */
  {
    id: 'click',
    label: 'click',
    category: 'ui',
    type: 'sfx',
    variant: '',
    volume: 0.5,
    loop: false,
    description: 'Tick digital curto — botões, links',
    fn() { _tone({ freq: 1200, freqEnd: 900, duration: 0.06, type: 'sine', volume: this.volume }); },
  },
  {
    id: 'hover',
    label: 'hover',
    category: 'ui',
    type: 'sfx',
    variant: '',
    volume: 0.18,
    loop: false,
    description: 'Toque ultra-suave — hover desktop',
    fn() { _tone({ freq: 800, duration: 0.04, attack: 0.002, type: 'sine', volume: this.volume }); },
  },
  {
    id: 'select',
    label: 'select',
    category: 'ui',
    type: 'sfx',
    variant: '',
    volume: 0.35,
    loop: false,
    description: 'Marcar/selecionar uma alternativa',
    fn() { _tone({ freq: 650, freqEnd: 750, duration: 0.07, attack: 0.003, type: 'sine', volume: this.volume }); },
  },
  {
    id: 'openModal',
    label: 'openModal',
    category: 'ui',
    type: 'sfx',
    variant: '',
    volume: 0.4,
    loop: false,
    description: 'Abrir modal ou menu',
    fn() { _tone({ freq: 600, freqEnd: 400, duration: 0.1, type: 'sine', volume: this.volume }); },
  },
  {
    id: 'pause',
    label: 'pause',
    category: 'ui',
    type: 'sfx',
    variant: '',
    volume: 0.4,
    loop: false,
    description: 'Dois tons suaves — pausar',
    fn() {
      _seq([
        { freq: 500, duration: 0.08, volume: this.volume },
        { freq: 380, duration: 0.08, delay: 0.09, volume: this.volume },
      ]);
    },
  },
  {
    id: 'notification',
    label: 'notification',
    category: 'ui',
    type: 'sfx',
    variant: 'info',
    volume: 0.45,
    loop: false,
    description: 'Notificação chegou',
    fn() {
      _seq([
        { freq: 1000, duration: 0.07, volume: this.volume },
        { freq: 1200, duration: 0.1, delay: 0.09, volume: this.volume },
      ]);
    },
  },

  /* ─── Feedback ────────────────────────────── */
  {
    id: 'correct',
    label: 'correct',
    category: 'feedback',
    type: 'sfx',
    variant: 'success',
    volume: 0.6,
    loop: false,
    description: 'Acertou — dois tons ascendentes',
    fn() {
      _seq([
        { freq: 520, duration: 0.1,  volume: this.volume },
        { freq: 780, duration: 0.15, delay: 0.1, volume: this.volume },
      ]);
    },
  },
  {
    id: 'correct2',
    label: 'correct 2',
    category: 'feedback',
    type: 'sfx',
    variant: 'success',
    volume: 0.55,
    loop: false,
    description: 'Acertou — três notas, mais dinâmico',
    fn() {
      _seq([
        { freq: 440, duration: 0.08, volume: this.volume },
        { freq: 660, duration: 0.08, delay: 0.09, volume: this.volume },
        { freq: 880, duration: 0.12, delay: 0.18, volume: this.volume + 0.05 },
      ]);
    },
  },
  {
    id: 'correct3',
    label: 'correct 3',
    category: 'feedback',
    type: 'sfx',
    variant: 'success',
    volume: 0.5,
    loop: false,
    description: 'Acertou — sweep suave ascendente',
    fn() { _tone({ freq: 900, freqEnd: 1100, duration: 0.18, attack: 0.01, type: 'sine', volume: this.volume }); },
  },
  {
    id: 'streak',
    label: 'streak',
    category: 'feedback',
    type: 'sfx',
    variant: 'success',
    volume: 0.6,
    loop: false,
    description: 'Sequência de acertos — fanfarra rápida',
    fn() {
      _seq([
        { freq: 392,  duration: 0.07, delay: 0,    volume: this.volume - 0.1 },
        { freq: 523,  duration: 0.07, delay: 0.08, volume: this.volume - 0.05 },
        { freq: 659,  duration: 0.07, delay: 0.16, volume: this.volume },
        { freq: 880,  duration: 0.07, delay: 0.24, volume: this.volume + 0.05 },
        { freq: 1047, duration: 0.15, delay: 0.32, volume: this.volume + 0.1 },
      ]);
    },
  },
  {
    id: 'wrong',
    label: 'wrong',
    category: 'feedback',
    type: 'sfx',
    variant: 'danger',
    volume: 0.35,
    loop: false,
    description: 'Errou — buzz descendente',
    fn() { _tone({ freq: 280, freqEnd: 160, duration: 0.22, type: 'square', volume: this.volume }); },
  },
  {
    id: 'wrong2',
    label: 'wrong 2',
    category: 'feedback',
    type: 'sfx',
    variant: 'danger',
    volume: 0.4,
    loop: false,
    description: 'Errou — dois tons graves',
    fn() {
      _seq([
        { freq: 220, duration: 0.12, type: 'square', volume: this.volume },
        { freq: 180, duration: 0.18, delay: 0.13, type: 'square', volume: this.volume - 0.05 },
      ]);
    },
  },
  {
    id: 'wrong3',
    label: 'wrong 3',
    category: 'feedback',
    type: 'sfx',
    variant: 'danger',
    volume: 0.3,
    loop: false,
    description: 'Errou — sawtooth descendente, seco',
    fn() { _tone({ freq: 160, freqEnd: 80, duration: 0.28, type: 'sawtooth', volume: this.volume }); },
  },

  /* ─── Alerts ──────────────────────────────── */
  {
    id: 'warning',
    label: 'warning',
    category: 'alerts',
    type: 'sfx',
    variant: 'warning',
    volume: 0.45,
    loop: false,
    description: 'Alerta — beep suave (repita nos últimos ~5s)',
    fn() { _tone({ freq: 880, duration: 0.08, attack: 0.003, type: 'sine', volume: this.volume }); },
  },
  {
    id: 'countdown',
    label: 'countdown',
    category: 'alerts',
    type: 'sfx',
    variant: 'warning',
    volume: 0.4,
    loop: false,
    description: 'Contagem regressiva — tick grave',
    fn() { _tone({ freq: 440, duration: 0.06, attack: 0.002, type: 'sine', volume: this.volume }); },
  },
  {
    id: 'timeout',
    label: 'timeout',
    category: 'alerts',
    type: 'sfx',
    variant: 'danger',
    volume: 0.5,
    loop: false,
    description: 'Tempo esgotado — buzz seco + queda',
    fn() {
      _seq([
        { freq: 300, freqEnd: 120, duration: 0.18, type: 'square', volume: this.volume },
        { freq: 120, duration: 0.25, delay: 0.2,  type: 'square', volume: this.volume - 0.15 },
      ]);
    },
  },

  /* ─── Progressão ──────────────────────────── */
  {
    id: 'win',
    label: 'win',
    category: 'feedback',
    type: 'sfx',
    variant: 'info',
    volume: 0.6,
    loop: false,
    description: 'Vitória / quiz concluído — mini fanfarra',
    fn() {
      _seq([
        { freq: 392, duration: 0.1,  delay: 0,    volume: this.volume - 0.05 },
        { freq: 523, duration: 0.1,  delay: 0.11, volume: this.volume - 0.05 },
        { freq: 659, duration: 0.1,  delay: 0.22, volume: this.volume - 0.05 },
        { freq: 784, duration: 0.22, delay: 0.33, volume: this.volume + 0.05 },
      ]);
    },
  },
  {
    id: 'levelUp',
    label: 'levelUp',
    category: 'feedback',
    type: 'sfx',
    variant: 'info',
    volume: 0.65,
    loop: false,
    description: 'Subiu de nível — seis notas ascendentes',
    fn() {
      _seq([
        { freq: 330,  duration: 0.08, delay: 0,    volume: this.volume - 0.15 },
        { freq: 415,  duration: 0.08, delay: 0.09, volume: this.volume - 0.1  },
        { freq: 523,  duration: 0.08, delay: 0.18, volume: this.volume - 0.05 },
        { freq: 659,  duration: 0.08, delay: 0.27, volume: this.volume        },
        { freq: 784,  duration: 0.08, delay: 0.36, volume: this.volume + 0.05 },
        { freq: 1047, duration: 0.25, delay: 0.45, volume: this.volume + 0.1  },
      ]);
    },
  },

  /* ─── Música / BGM ────────────────────────────
     type: 'music' — o playground mostra controles de play/stop/loop
     fn() deve chamar _bgmEngine.play(id, buildFn)

     Para adicionar uma BGM nova:
       1. Crie uma entrada com type: 'music'
       2. Em fn(), chame _bgmEngine.play('meu-id', (ctx, dest) => { ... })
       3. buildFn deve retornar o(s) nó(s) de oscilador criados
          (para o engine poder parar depois)

     Exemplo mínimo de BGM procedural:
       fn() {
         _bgmEngine.play('minha-bgm', (ctx, dest) => {
           const osc = ctx.createOscillator();
           osc.connect(dest);
           osc.frequency.value = 220;
           osc.start();
           return osc;
         });
       }

     Para usar arquivo mp3/url no futuro:
       fn() { _bgmEngine.playUrl('menu', '/audio/menu.mp3'); }
  ─────────────────────────────────────────────── */
  {
    id: 'music-menu',
    label: 'menu',
    category: 'music',
    type: 'music',
    variant: 'info',
    volume: 0.4,
    loop: true,
    description: 'BGM do menu principal — atmosfera ambient',
    fn() {
      _bgmEngine.play('music-menu', (ctx, dest) => {
        const nodes = [];

        // Drone base
        const drone = ctx.createOscillator();
        const droneGain = ctx.createGain();
        drone.type = 'sine';
        drone.frequency.value = 110;
        droneGain.gain.value  = 0.12;
        drone.connect(droneGain);
        droneGain.connect(dest);
        drone.start();
        nodes.push(drone);

        // Harmônico suave
        const harm = ctx.createOscillator();
        const harmGain = ctx.createGain();
        harm.type = 'sine';
        harm.frequency.value = 220;
        harmGain.gain.value  = 0.06;
        harm.connect(harmGain);
        harmGain.connect(dest);
        harm.start();
        nodes.push(harm);

        // Arpejo lento em loop
        const notes = [330, 392, 440, 523, 440, 392];
        let i = 0;
        const arpGain = ctx.createGain();
        arpGain.gain.value = 0.08;
        arpGain.connect(dest);

        function playArpNote() {
          if (!_currentBgm || _currentBgm.id !== 'music-menu') return;
          const osc = ctx.createOscillator();
          const g   = ctx.createGain();
          osc.connect(g);
          g.connect(arpGain);
          osc.type = 'sine';
          osc.frequency.value = notes[i % notes.length];
          g.gain.setValueAtTime(0, ctx.currentTime);
          g.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05);
          g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.85);
          i++;
          setTimeout(playArpNote, 900);
        }
        setTimeout(playArpNote, 500);

        return nodes;
      });
    },
  },
  {
    id: 'music-quiz',
    label: 'quiz',
    category: 'music',
    type: 'music',
    variant: 'warning',
    volume: 0.35,
    loop: true,
    description: 'BGM do quiz — tensão leve, foco',
    fn() {
      _bgmEngine.play('music-quiz', (ctx, dest) => {
        const nodes = [];

        // Pulso de baixo
        const bass = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bass.type = 'square';
        bass.frequency.value = 55;
        bassGain.gain.value  = 0.06;
        bass.connect(bassGain);
        bassGain.connect(dest);
        bass.start();
        nodes.push(bass);

        // Melodia de tensão
        const melody = [440, 466, 440, 415, 440, 466, 494, 440];
        let mi = 0;

        function playMelNote() {
          if (!_currentBgm || _currentBgm.id !== 'music-quiz') return;
          const osc = ctx.createOscillator();
          const g   = ctx.createGain();
          osc.connect(g);
          g.connect(dest);
          osc.type = 'triangle';
          osc.frequency.value = melody[mi % melody.length];
          g.gain.setValueAtTime(0, ctx.currentTime);
          g.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.03);
          g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.4);
          mi++;
          setTimeout(playMelNote, 380);
        }
        setTimeout(playMelNote, 200);

        return nodes;
      });
    },
  },
  {
    id: 'music-game',
    label: 'game',
    category: 'music',
    type: 'music',
    variant: 'success',
    volume: 0.4,
    loop: true,
    description: 'BGM do jogo — ritmo animado',
    fn() {
      _bgmEngine.play('music-game', (ctx, dest) => {
        const nodes = [];

        // Baixo rítmico
        const bassFreqs = [110, 110, 138, 110, 123, 110, 138, 146];
        let bi = 0;

        function playBass() {
          if (!_currentBgm || _currentBgm.id !== 'music-game') return;
          const osc = ctx.createOscillator();
          const g   = ctx.createGain();
          osc.connect(g);
          g.connect(dest);
          osc.type = 'sawtooth';
          osc.frequency.value = bassFreqs[bi % bassFreqs.length];
          g.gain.setValueAtTime(0, ctx.currentTime);
          g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
          g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.18);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.2);
          bi++;
          setTimeout(playBass, 200);
        }
        playBass();

        // Melodia animada
        const melFreqs = [523, 659, 784, 659, 523, 440, 523, 659];
        let mi = 0;

        function playMel() {
          if (!_currentBgm || _currentBgm.id !== 'music-game') return;
          const osc = ctx.createOscillator();
          const g   = ctx.createGain();
          osc.connect(g);
          g.connect(dest);
          osc.type = 'square';
          osc.frequency.value = melFreqs[mi % melFreqs.length];
          g.gain.setValueAtTime(0, ctx.currentTime);
          g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
          g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.4);
          mi++;
          setTimeout(playMel, 400);
        }
        setTimeout(playMel, 100);

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
    // Tenta pelo id completo ou pelo label
    const entry =
      _musicMap[key] ||
      _musicMap[`music-${key}`] ||
      Object.values(_musicMap).find(e => e.label === key);
    if (entry) return () => entry.fn.call(entry);
    return undefined;
  },
});

/* ═══════════════════════════════════════════════
   9. TOGGLE UI (substitui sfx-toggle.js)
═══════════════════════════════════════════════ */

const ICON_ON  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
</svg>`;

const ICON_OFF = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
  <line x1="23" y1="9" x2="17" y2="15"/>
  <line x1="17" y1="9" x2="23" y2="15"/>
</svg>`;

function createToggle(destino, { showVolume = false, className = 'nav-btn nav-btn--icon' } = {}) {
  const container = typeof destino === 'string'
    ? document.querySelector(destino)
    : destino;

  if (!container) {
    console.warn('[audio] createToggle: destino não encontrado:', destino);
    return null;
  }

  const btn = document.createElement('button');
  btn.className = className;
  btn.id        = 'btn-sfx-toggle';

  function _updateBtn() {
    const on      = _state.enabled && !_state.muted;
    btn.innerHTML = on ? ICON_ON : ICON_OFF;
    btn.title     = on ? 'Som ligado' : 'Som desligado';
  }

  _updateBtn();

  btn.addEventListener('click', () => {
    const novoEstado = !(_state.enabled && !_state.muted);
    _state.enabled = novoEstado;
    _state.muted   = false;
    _syncGains();
    _persist();
    _updateBtn();
    if (novoEstado) sfxApi.click?.();
    if (slider) slider.disabled = !novoEstado;
  });

  container.appendChild(btn);

  let slider = null;

  if (showVolume) {
    const wrap = document.createElement('div');
    wrap.className = 'sfx-volume-wrap';
    wrap.style.cssText = 'display:flex;align-items:center;gap:0.5rem;margin-top:0.5rem;';

    slider = document.createElement('input');
    slider.type      = 'range';
    slider.min       = '0';
    slider.max       = '1';
    slider.step      = '0.05';
    slider.value     = _state.masterVolume;
    slider.disabled  = !_state.enabled;
    slider.className = 'sfx-volume-slider';
    slider.style.cssText = 'flex:1;accent-color:var(--teal,#4dd9b4);cursor:pointer;';

    const label = document.createElement('span');
    label.style.cssText = 'font-size:0.75rem;color:var(--text-2,#a8a49c);min-width:2.5rem;';
    label.textContent   = `${Math.round(_state.masterVolume * 100)}%`;

    slider.addEventListener('input', () => {
      _state.masterVolume = parseFloat(slider.value);
      label.textContent   = `${Math.round(_state.masterVolume * 100)}%`;
      _syncGains();
      _persist();
    });

    wrap.appendChild(slider);
    wrap.appendChild(label);
    container.appendChild(wrap);
  }

  return { btn, slider, update: _updateBtn };
}

/* ═══════════════════════════════════════════════
   10. API PRINCIPAL (export default)
═══════════════════════════════════════════════ */

const audio = {

  /** Catálogo completo — lido pelo sfx-playground */
  catalog,

  /** Efeitos sonoros: audio.sfx.click(), audio.sfx.correct(), etc. */
  sfx: sfxApi,

  /** Música: audio.music.menu(), audio.music.quiz(), audio.music.stop() */
  music: musicApi,

  /* ── Controles de volume ───────────────────── */

  setMasterVolume(val) {
    _state.masterVolume = Math.min(1, Math.max(0, Number(val) || 0));
    _syncGains();
    _persist();
  },

  setSfxVolume(val) {
    _state.sfxVolume = Math.min(1, Math.max(0, Number(val) || 0));
    _syncGains();
    _persist();
  },

  setMusicVolume(val) {
    _state.musicVolume = Math.min(1, Math.max(0, Number(val) || 0));
    _syncGains();
    _persist();
  },

  getMasterVolume() { return _state.masterVolume; },
  getSfxVolume()    { return _state.sfxVolume; },
  getMusicVolume()  { return _state.musicVolume; },

  /* ── Enable / disable ──────────────────────── */

  setEnabled(bool) {
    _state.enabled = !!bool;
    _syncGains();
    _persist();
  },

  isEnabled() { return _state.enabled; },

  /* ── Mute / unmute ─────────────────────────── */

  mute() {
    _state.muted = true;
    _syncGains();
    _persist();
  },

  unmute() {
    _state.muted = false;
    _syncGains();
    _persist();
  },

  isMuted() { return _state.muted; },

  /* ── Stop all ──────────────────────────────── */

  stopAll() {
    _bgmEngine.stop(0);
  },

  /* ── Fade global ───────────────────────────── */

  fadeOut(duration = 1) {
    if (!_masterGain) return;
    const ctx = _getCtx();
    const t   = ctx.currentTime;
    _masterGain.gain.setValueAtTime(_masterGain.gain.value, t);
    _masterGain.gain.linearRampToValueAtTime(0, t + duration);
  },

  fadeIn(duration = 1) {
    if (!_masterGain) return;
    const ctx = _getCtx();
    const t   = ctx.currentTime;
    _masterGain.gain.setValueAtTime(0, t);
    _masterGain.gain.linearRampToValueAtTime(_state.masterVolume, t + duration);
  },

  /* ── Sync com Firebase/global.js ───────────── */

  syncFromConfigs(cfg) {
    if (cfg == null) return;
    if (typeof cfg.sounds       === 'boolean') this.setEnabled(cfg.sounds);
    if (typeof cfg.masterVolume === 'number')  this.setMasterVolume(cfg.masterVolume);
    if (typeof cfg.sfxVolume    === 'number')  this.setSfxVolume(cfg.sfxVolume);
    if (typeof cfg.musicVolume  === 'number')  this.setMusicVolume(cfg.musicVolume);
  },

  /* ── Toggle UI (substitui sfx-toggle.js) ───── */

  createToggle,

  /* ── Estado completo (para debug/playground) ── */

  getState() {
    return { ..._state };
  },
};

export default audio;