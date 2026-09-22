/* =============================================
   NEXUS STUDY — resumo/js/resumo-utils.js
   Estado global da página, helpers puros (escape/
   parse de texto, scroll suave), carregamento
   assíncrono da IA e resolução de contexto
   (semestre/disciplina a partir da URL + picker de
   semestre no header).
   ============================================= */

import {
  getDisciplinaAtual,
  setDisciplina,
  getDisciplinasDeSemestre,
  setSemestre,
} from '../../src/global.js';
import { resolverSemestreDeURL, sincronizarSemNaURL } from '../../shared/js/utils/url.js';
import { criarSemestreSelect } from '../../shared/js/utils/dom.js';
import { aplicarCoresDisciplina } from '../../shared/js/themes/theme.js';
import { playSound } from '../../shared/js/audio/audio-api.js';

/* ══════════════════════════════════════════════
   ESTADO GLOBAL
══════════════════════════════════════════════ */
export const State = {
  disciplina:      null,
  semestre:        null,
  disciplinas:     [],
  aulas:           [],
  simplificado:    [],
  resumao:         [],
  aulaAberta:      null,
  discVerificadas: new Set(),
  temConteudo:     null,
  modo:            'completo',
  DISC_CORES:      {},
  getVideos:       null,
  _tocObserver:    null,
};

window.__nexusState = State;

/* ══════════════════════════════════════════════
   CARREGAMENTO DA IA
══════════════════════════════════════════════ */
function _loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`[Nexus IA] Falha ao carregar: ${src}`));
    (document.head ?? document.documentElement).appendChild(s);
  });
}

window.__NEXUS_CONTEXT__ = { tipos: ['resumo'] };

export function carregarIA() {
  const BASE = '../shared/js/ia/';
  const deps = [
    BASE + 'core/context.js',
    BASE + 'core/text-utils.js',
    BASE + 'core/history.js',
    BASE + 'core/loader.js',
    BASE + 'core/worker.js',
    BASE + 'core/ui.js',
    BASE + 'resumo/search.js',
  ];

  Promise.all(deps.map(_loadScript))
    .then(() => _loadScript(BASE + 'resumo/assistant.js'))
    .then(() => {
      if (window.NexusAssistant) {
        window.NexusAssistant.initUI();
        window.NexusAssistant.init();
      }
    })
    .catch(err => console.error('[Resumo] Falha ao carregar IA:', err));
}

/* ══════════════════════════════════════════════
   HELPERS — escape/parse de texto, scroll suave
══════════════════════════════════════════════ */
export function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

export function parseInline(str) {
  if (!str) return '';
  return esc(str)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

/* smoothScrollTo tem um ciclo de vida explícito: quem chama pode
   saber quando a animação termina de verdade (onComplete) ou é
   interrompida por um input manual do usuário (onCancel) — em vez de
   um "atire e esqueça" que só o próprio scroll sabia quando acabava.
   Retorna uma função `stop(silent)`: quem chamou pode interromper a
   animação de fora (ex.: uma nova navegação que substitui a anterior).
   Com silent=true, nem onCancel é disparado — usado só quando uma
   navegação mais nova está tomando o controle de propósito, não uma
   interrupção real do usuário. */
export function smoothScrollTo(scrollEl, targetTop, { onComplete, onCancel } = {}) {
  if (!scrollEl) { onComplete?.(); return () => {}; }
  const startTop  = scrollEl.scrollTop;
  const distance  = targetTop - startTop;
  if (Math.abs(distance) < 2) { onComplete?.(); return () => {}; }

  const duration = Math.min(700, Math.max(280, Math.abs(distance) * 0.5));
  const startTime = performance.now();
  let cancelled = false;

  const stop = (silent) => {
    if (cancelled) return;
    cancelled = true;
    cleanup();
    if (!silent) onCancel?.();
  };
  const cancelKeys = new Set(['PageUp','PageDown','ArrowUp','ArrowDown','Home','End',' ']);
  const onKeydown = e => { if (cancelKeys.has(e.key)) stop(); };
  const opts = { passive: true, once: true };
  scrollEl.addEventListener('wheel', stop, opts);
  scrollEl.addEventListener('touchstart', stop, opts);
  scrollEl.addEventListener('pointerdown', stop, opts);
  document.addEventListener('keydown', onKeydown, opts);
  const cleanup = () => {
    scrollEl.removeEventListener('wheel', stop);
    scrollEl.removeEventListener('touchstart', stop);
    scrollEl.removeEventListener('pointerdown', stop);
    document.removeEventListener('keydown', onKeydown);
  };

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  function step(now) {
    if (cancelled) return;
    const t = Math.min(1, (now - startTime) / duration);
    scrollEl.scrollTop = startTop + distance * easeOutCubic(t);
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      cleanup();
      onComplete?.();
    }
  }
  requestAnimationFrame(step);
  return stop;
}

/* ══════════════════════════════════════════════
   CONTEXTO — semestre/disciplina da URL + picker
══════════════════════════════════════════════ */
export function resolverContexto() {
  const semestre = resolverSemestreDeURL();
  const lista       = getDisciplinasDeSemestre(semestre);
  State.semestre    = semestre;
  State.disciplinas = lista;

  if (!lista.length) {
    State.disciplina = null;
    setDisciplina(null);
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const discId = params.get('disc') ?? getDisciplinaAtual();
  const disc   = (discId ? lista.find(d => d.id === discId) : null) ?? lista[0] ?? null;
  State.disciplina = disc;
  if (disc) setDisciplina(disc.id);
  if (disc) aplicarCoresDisciplina(disc.arquivo, State.DISC_CORES);
}

/* onChange(sem) é chamado logo depois do estado ser atualizado — o
   mesmo ponto em que o código original chamava _renderHeader(),
   _renderSidebar() e _carregarConteudo() diretamente. Quem orquestra
   essas três chamadas é resumo.js (ver init), para este módulo não
   precisar importar resumo-ui.js. */
export function renderSemestreBadge({ onChange } = {}) {
  const wrap = document.getElementById('semestre-wrap-resumo');
  if (!wrap) return;

  criarSemestreSelect('semestre-wrap-resumo', sem => {
    setSemestre(sem);
    sincronizarSemNaURL(sem);

    const lista       = getDisciplinasDeSemestre(sem);
    State.semestre    = sem;
    State.disciplinas = lista;
    State.disciplina  = lista[0] ?? null;
    if (State.disciplina) setDisciplina(State.disciplina.id);
    if (State.disciplina) aplicarCoresDisciplina(State.disciplina.arquivo, State.DISC_CORES);

    onChange?.(sem);

    playSound('select', 'resumos');
    document.dispatchEvent(new CustomEvent('nexus:semestreChanged', { detail: sem }));
  });
}