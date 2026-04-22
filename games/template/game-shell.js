/* ============================================================
   NEXUS STUDY — games/template/game-shell.js

   Módulo base compartilhado por todos os jogos.
   Cada jogo importa as funções que precisa:

     import { Shell, Timer } from '../../template/game-shell.js';

   O que este módulo fornece:
     • Shell   — inicialização do header (nome, disciplina, semestre)
     • Timer   — contador regressivo com callback de tick e fim
     • Utils   — shuffle, sleep, formatTime, lerParams

   O que NÃO está aqui (fica em cada jogo):
     • Sistema de pontuação
     • Mecânica de jogo
     • Conteúdo (perguntas/termos)

Como um jogo usa:
     import { Shell, Timer, Result, shuffle } from '../../template/game-shell.js';

const { disc, sem } = Shell.init({ icon: '🔤', nome: 'Forca' });
const timer = Timer.criar({ total: 60, onEnd: () => encerrarJogo() });
timer.start();
   ============================================================ */

import { DISC_CORES }            from '../../shared/cores.js';
import { getDisciplinasDeSemestre } from '../../global.js';

/* ══════════════════════════════════════════════════════════
   UTILS — helpers genéricos
   ══════════════════════════════════════════════════════════ */

/**
 * Lê os parâmetros da URL atual.
 * Retorna { disc, sem } — ex: { disc: 'poo', sem: '2026.2' }
 */
export function lerParams() {
  const p = new URLSearchParams(location.search);
  return {
    disc: p.get('disc') ?? '',
    sem:  p.get('sem')  ?? '',
  };
}

/**
 * Embaralha um array (Fisher-Yates) sem modificar o original.
 * @param {Array} arr
 * @returns {Array}
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Converte segundos em string "MM:SS".
 * @param {number} seg
 * @returns {string}
 */
export function formatTime(seg) {
  const m = Math.floor(seg / 60).toString().padStart(2, '0');
  const s = (seg % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Promise que resolve após `ms` milissegundos.
 * Útil para pausas entre estados de jogo.
 * @param {number} ms
 */
export function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Seleciona N itens aleatórios de um array.
 * @param {Array}  arr
 * @param {number} n
 * @returns {Array}
 */
export function sample(arr, n) {
  return shuffle(arr).slice(0, n);
}

/* ══════════════════════════════════════════════════════════
   SHELL — inicialização do header e cores da disciplina
   ══════════════════════════════════════════════════════════ */

export const Shell = {

  /**
   * Inicializa o header do jogo e aplica as cores da disciplina.
   *
   * Lê ?disc=&sem= da URL, aplica CSS custom properties de cor no :root,
   * e preenche os elementos do header declarados no HTML do jogo.
   *
   * IDs esperados no HTML (todos opcionais — ignora se ausente):
   *   #shell-icon       → emoji do jogo  (passado como config)
   *   #shell-game-name  → nome do jogo   (passado como config)
   *   #shell-disc-name  → apelido da disciplina
   *   #shell-sem        → semestre
   *   #shell-back-btn   → botão voltar   → href para jogo.html?sem=...
   *
   * @param {{ icon: string, nome: string }} config  — dados do jogo
   * @returns {{ disc: string, sem: string, cores: object, disciplina: object|null }}
   *
   * Exemplo (forca.js):
   *   const { disc, sem } = Shell.init({ icon: '🔤', nome: 'Forca' });
   */
  init(config = {}) {
    const { disc, sem } = lerParams();

    /* ── Cores da disciplina ── */
    const cores = DISC_CORES[disc] ?? DISC_CORES['design'];
    _aplicarCores(cores);

    /* ── Info da disciplina via global.js ── */
    const disciplina = _resolverDisciplina(disc, sem);

    /* ── Preenche header ── */
    _set('shell-icon',      config.icon ?? '🎮');
    _set('shell-game-name', config.nome ?? 'Jogo');
    _set('shell-disc-name', disciplina?.apelido ?? disc);
    _set('shell-sem',       sem || '—');

    /* ── Botão voltar ── */
    const backBtn = document.getElementById('shell-back-btn');
    if (backBtn) {
      backBtn.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;
    }

    return { disc, sem, cores, disciplina };
  },

};

/* ── Helpers privados do Shell ── */

function _aplicarCores(cores) {
  const r = document.documentElement.style;
  r.setProperty('--disc-tema',      cores.corTema);
  r.setProperty('--disc-tema-rgb',  cores.corTemaRgb);
  r.setProperty('--disc-tema2',     cores.corTema2);
  r.setProperty('--disc-tema2-rgb', cores.corTema2Rgb);
}

function _resolverDisciplina(disc, sem) {
  try {
    const lista = getDisciplinasDeSemestre(sem);
    return lista.find(d => d.id === disc || d.arquivo === disc) ?? null;
  } catch (_) {
    return null;
  }
}

function _set(id, texto) {
  const el = document.getElementById(id);
  if (el) el.textContent = texto;
}

/* ══════════════════════════════════════════════════════════
   TIMER — contador regressivo
   ══════════════════════════════════════════════════════════ */

/**
 * Cria e controla um timer regressivo.
 *
 * O timer atualiza:
 *   • CSS custom property --timer-pct (0–100) no :root
 *   • Elemento #shell-timer-display  (texto "MM:SS") se existir
 *   • Classe .game-timer-bar--danger na .game-timer-bar quando < 25%
 *
 * @param {object} opts
 * @param {number}   opts.total       — duração total em segundos
 * @param {Function} [opts.onTick]    — callback(restante, pct) a cada segundo
 * @param {Function} [opts.onEnd]     — callback() quando chega a 0
 *
 * @returns {{ start, pause, resume, stop, getRestante }}
 *
 * Exemplo (quiz-tempo.js):
 *   const timer = Timer.criar({
 *     total: 60,
 *     onTick: (rest, pct) => console.log(rest),
 *     onEnd:  () => encerrarJogo(),
 *   });
 *   timer.start();
 */
export const Timer = {

  criar({ total, onTick, onEnd } = {}) {
    let restante = total;
    let intervalo = null;
    let rodando   = false;

    const timerBar     = document.querySelector('.game-timer-bar');
    const timerDisplay = document.getElementById('shell-timer-display');

    function _atualizar() {
      const pct = Math.max(0, (restante / total) * 100);

      /* CSS var para a barra */
      document.documentElement.style.setProperty('--timer-pct', pct + '%');

      /* Display numérico */
      if (timerDisplay) timerDisplay.textContent = formatTime(restante);

      /* Danger quando < 25% */
      if (timerBar) {
        timerBar.classList.toggle('game-timer-bar--danger', pct < 25);
        if (timerDisplay) timerDisplay.classList.toggle('game-timer-display--danger', pct < 25);
      }

      onTick?.(restante, pct);
    }

    function start() {
      if (rodando) return;
      rodando = true;
      _atualizar();
      intervalo = setInterval(() => {
        restante--;
        _atualizar();
        if (restante <= 0) {
          stop();
          onEnd?.();
        }
      }, 1000);
    }

    function pause() {
      clearInterval(intervalo);
      rodando = false;
    }

    function resume() {
      if (!rodando && restante > 0) start();
    }

    function stop() {
      clearInterval(intervalo);
      rodando = false;
    }

    function reset(novoTotal) {
      stop();
      restante = novoTotal ?? total;
      total    = restante;
      _atualizar();
    }

    function getRestante() { return restante; }

    return { start, pause, resume, stop, reset, getRestante };
  },

};

/* ══════════════════════════════════════════════════════════
   RESULT — tela de resultado final
   ══════════════════════════════════════════════════════════ */

/**
 * Exibe a tela de resultado final.
 *
 * Espera um elemento #game-result no HTML com a estrutura
 * definida em game-shell.css (.game-result__card, etc.).
 *
 * @param {object} opts
 * @param {string}   opts.emoji      — ex: '🏆' ou '😅'
 * @param {string}   opts.titulo     — ex: 'Parabéns!'
 * @param {string}   opts.subtitulo  — mensagem de apoio
 * @param {Array<{ label: string, valor: string|number }>} opts.stats
 * @param {Function} [opts.onRejogo] — callback do botão "Jogar de novo"
 *
 * Exemplo (forca.js):
 *   Result.mostrar({
 *     emoji: '🏆', titulo: 'Você venceu!',
 *     subtitulo: 'Acertou todas as letras.',
 *     stats: [{ label: 'Erros', valor: 2 }, { label: 'Palavra', valor: 'Herança' }],
 *     onRejogo: () => iniciarJogo(),
 *   });
 */
export const Result = {

  mostrar({ emoji, titulo, subtitulo, stats = [], onRejogo } = {}) {
    const overlay = document.getElementById('game-result');
    if (!overlay) return;

    _set('result-emoji',    emoji    ?? '🎮');
    _set('result-title',    titulo   ?? 'Fim de jogo!');
    _set('result-subtitle', subtitulo ?? '');

    /* Stats dinâmicas */
    const statsEl = document.getElementById('result-stats');
    if (statsEl) {
      statsEl.innerHTML = stats.map(s => `
        <div class="game-result__stat">
          <span class="game-result__stat-value">${s.valor}</span>
          <span class="game-result__stat-label">${s.label}</span>
        </div>
      `).join('');
    }

    /* Botão rejogo */
    const btnRejogo = document.getElementById('result-btn-rejogo');
    if (btnRejogo && onRejogo) {
      btnRejogo.onclick = () => {
        overlay.classList.add('hidden');
        onRejogo();
      };
    }

    /* Botão sair */
    const { disc, sem } = lerParams();
    const btnSair = document.getElementById('result-btn-sair');
    if (btnSair) {
      btnSair.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;
    }

    overlay.classList.remove('hidden');
  },

  esconder() {
    document.getElementById('game-result')?.classList.add('hidden');
  },

};