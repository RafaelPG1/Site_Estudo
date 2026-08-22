/* =============================================
   NEXUS STUDY — resumo/resumo.js  (v13 — área 'resumos' em todos os playSound)
   ============================================= */

import {
  getSemestreAtual,
  getDisciplinaAtual,
  setDisciplina,
  getDisciplinasDeSemestre,
  setPagina,
  setSemestre,
  SEMESTRES,
  parseSemestre,
} from '../src/global.js';

import { resolverSemestreDeURL, sincronizarSemNaURL } from '../shared/js/utils/url.js';
import { criarSemestreSelect, preencherAnos } from '../shared/js/utils/dom.js';
import { aplicarCoresDisciplina } from '../shared/js/themes/theme.js';

import { injetarLogo } from '../shared/js/utils/logo.js';

import { Sound, playSound } from '../shared/js/audio/audio-api.js';

import '../src/session-tracker.js';

injetarLogo('#header-logo-wrap');

const State = {
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

function _carregarIA() {
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

_carregarIA();

document.addEventListener('DOMContentLoaded', async () => {
  setPagina('RESUMO');
  preencherAnos();

  if (typeof window.__nexusPageEnter === 'function') {
    window.__nexusPageEnter(location.pathname);
  }

  Sound.init();

  try {
    const mod = await import('../shared/js/themes/cores.js');
    State.DISC_CORES = mod.DISC_CORES ?? {};
  } catch (_) {}

  try {
    const mod = await import('../content/resumo/videos.js');
    State.getVideos = mod.getVideos ?? null;
  } catch (_) {}

  _resolverContexto();

  _renderSemestreBadge();

  _renderHeader();
  _renderSidebar();

  _bindModal();
  _bindTocChrome();
  _initProgressBar();
  _carregarConteudo();

  document.getElementById('btn-back')?.addEventListener('mouseenter', () => playSound('hover', 'resumos'));
  document.getElementById('btn-back')?.addEventListener('click',      () => playSound('click', 'resumos'));
});

function _initProgressBar() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;
  document.addEventListener('scroll', () => {
    bar.classList.remove('reading-progress--visible');
  });
}

/* _smoothScrollTo agora tem um ciclo de vida explícito: quem chama
   pode saber quando a animação termina de verdade (onComplete) ou é
   interrompida por um input manual do usuário (onCancel) — em vez de
   um "atire e esqueça" que só o próprio scroll sabia quando acabava.
   Isso é o que permite ao chamador (navigateTo, abaixo) devolver o
   controle da seleção ao scroll-spy no momento certo, sem depender de
   um setTimeout com tempo fixo.
   Retorna uma função `stop(silent)`: quem chamou pode interromper a
   animação de fora (ex.: uma nova navegação que substitui a anterior).
   Com silent=true, nem onCancel é disparado — usado só quando uma
   navegação mais nova está tomando o controle de propósito, não uma
   interrupção real do usuário. */
function _smoothScrollTo(scrollEl, targetTop, { onComplete, onCancel } = {}) {
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
   SISTEMA DE LEITURA — arquitetura de autoridade
   Duas fontes tentavam decidir a seção ativa ao
   mesmo tempo: o scroll-spy (posição real do
   scroll) e o clique no índice (que só empurrava o
   scroll e torcia para o spy "concordar" no fim).
   Como o spy reage à posição a cada frame, uma
   viagem longa (ex.: índice 3 → índice 24) o fazia
   ativar cada seção pela qual o scroll passava no
   caminho — o clique nunca tinha a palavra final.

   Esta versão dá ao clique autoridade EXPLÍCITA e
   temporária: `programmatic` fica true do momento do
   clique até a animação terminar (por conclusão OU
   por interrupção manual — nunca por um temporizador
   fixo, ver _smoothScrollTo). Enquanto isso, update()
   simplesmente não recalcula a seção ativa a partir
   da posição — a seleção já foi fixada no clique. Ao
   terminar, o controle volta ao scroll-spy, que
   resincroniza com a posição real (o que também
   corrige a seleção se o usuário interrompeu no meio
   do caminho).
══════════════════════════════════════════════ */
function _initReadingScrollSystem(scrollEl) {
  if (!scrollEl) return null;
  const bar   = document.getElementById('read-modal-panel');
  const fill  = document.getElementById('reader-progress-fill');
  const label = document.getElementById('rm-active-section-label');

  const getSections = () => Array.from(document.querySelectorAll('.rm-collapse'));

  let lastTop   = scrollEl.scrollTop;
  let ticking   = false;
  let activeIdx = -1;

  // Autoridade da seleção: true = um clique no índice está no controle
  // (scroll-spy suspenso); false = o scroll manual decide normalmente.
  let programmatic = false;
  // Função para interromper a animação em curso, se houver — usada
  // quando uma nova navegação substitui uma anterior ainda ativa.
  let stopCurrentScroll = null;

  const refLine = () => scrollEl.getBoundingClientRect().top + 24;

  function setActive(idx) {
    if (idx === activeIdx) return;
    activeIdx = idx;
    const sections = getSections();
    const current = sections[idx];

    document.querySelectorAll('.rm-toc__item').forEach(li => {
      li.classList.toggle('rm-toc__item--active', Number(li.dataset.sec) === idx);
    });
    sections.forEach(sec => sec.classList.toggle('rm-collapse--current', sec === current));

    const titulo = current?.querySelector('.rm-collapse__trigger .rm-toc__title, .rm-collapse__trigger span')?.textContent;
    if (label) {
      label.style.opacity = '0';
      setTimeout(() => {
        label.textContent = titulo ?? '';
        requestAnimationFrame(() => { label.style.opacity = '1'; });
      }, 90);
    }

    document.querySelector(`.rm-toc__item[data-sec="${idx}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }

  // Única fonte de verdade do scroll-spy: qual seção está sob a linha
  // de referência agora. Usada tanto pelo listener de scroll normal
  // quanto para resincronizar assim que uma navegação programática
  // devolve o controle.
  function recomputeActiveFromPosition() {
    const sections = getSections();
    if (!sections.length) return;
    const line = refLine();
    let idx = 0;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= line) idx = i;
      else break;
    }
    setActive(idx);
  }

  function update() {
    ticking = false;
    const top = scrollEl.scrollTop;
    const goingDown = top > lastTop + 2;
    const goingUp   = top < lastTop - 2;
    lastTop = top;

    if (fill) {
      const total = scrollEl.scrollHeight - scrollEl.clientHeight;
      fill.style.width = (total > 0 ? Math.min(100, (top / total) * 100) : 0) + '%';
    }

    // O header cheio/compacto continua reagindo à posição do scroll
    // mesmo durante navegação programática — isso é intencional e
    // preserva o comportamento já corrigido do header inteligente.
    if (bar) {
      if (top < 32) bar.classList.remove('reader__bar--compact');
      else if (goingDown && top > 140) bar.classList.add('reader__bar--compact');
      else if (goingUp) bar.classList.remove('reader__bar--compact');
    }

    // Só a SELEÇÃO (qual item do índice está ativo) fica suspensa
    // durante a navegação programática — o resto do sistema de scroll
    // roda normalmente.
    if (programmatic) return;

    recomputeActiveFromPosition();
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  scrollEl.addEventListener('scroll', onScroll, { passive: true });
  update();

  // API pública: navegar para uma seção por clique no índice. O
  // clique manda IMEDIATAMENTE (a seleção muda antes mesmo do scroll
  // começar) e continua mandando até a animação terminar de verdade
  // ou ser interrompida por um input manual do usuário.
  function navigateTo(idx) {
    const sections = getSections();
    const target = sections[idx];
    if (!target) return;

    // Uma navegação nova sempre vence uma anterior ainda em curso.
    // Encerra a anterior silenciosamente (sem disparar seu onCancel,
    // que devolveria o controle por um instante síncrono antes de
    // tomarmos ele de volta de novo na linha seguinte) — evita os
    // dois sistemas disputando o scrollTop ao mesmo tempo.
    stopCurrentScroll?.(true);

    programmatic = true;
    setActive(idx);

    document.getElementById('read-modal-panel')?.classList.remove('reader__bar--compact');
    _fecharTocSheet();

    const body = target.querySelector('.rm-collapse__body');
    const wasClosed = !target.classList.contains('rm-collapse--open');

    if (wasClosed) {
      // Abre sem transição e força um reflow síncrono antes de medir
      // a posição — evita que a animação do accordion (max-height)
      // ainda em curso desloque o alvo do scroll no meio do caminho.
      body?.classList.add('rm-collapse__body--instant');
      target.classList.add('rm-collapse--open');
      target.querySelector('.rm-collapse__trigger')?.setAttribute('aria-expanded', 'true');
      void target.offsetHeight;
    }

    const targetTop = target.getBoundingClientRect().top
      - scrollEl.getBoundingClientRect().top
      + scrollEl.scrollTop
      - 16;

    const releaseControl = () => {
      programmatic = false;
      stopCurrentScroll = null;
      // Resincroniza com a posição real: é um no-op se chegamos ao
      // alvo, e corrige a seleção se o usuário interrompeu o scroll
      // no meio do caminho (a posição real passa a mandar de novo).
      recomputeActiveFromPosition();
    };

    stopCurrentScroll = _smoothScrollTo(scrollEl, Math.max(0, targetTop), {
      onComplete: releaseControl,
      onCancel:   releaseControl,
    });

    if (wasClosed) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => body?.classList.remove('rm-collapse__body--instant'));
      });
    }
  }

  return {
    navigateTo,
    cleanup() {
      scrollEl.removeEventListener('scroll', onScroll);
      stopCurrentScroll?.(true);
      if (fill) fill.style.width = '0%';
      bar?.classList.remove('reader__bar--compact');
      activeIdx = -1;
      programmatic = false;
    },
  };
}

function _buildTOC(secoes) {
  const items = (secoes ?? []).map((sec, i) => `
    <li class="rm-toc__item" data-sec="${i}">
      <button class="rm-toc__link" data-sec="${i}">
        <span class="rm-toc__num">${String(i + 1).padStart(2, '0')}</span>
        <span class="rm-toc__title">${_esc(sec.titulo)}</span>
      </button>
    </li>`).join('');

  const listDesktop = document.getElementById('rm-toc-list');
  const listMobile  = document.getElementById('rm-toc-list-mobile');
  if (listDesktop) listDesktop.innerHTML = items;
  if (listMobile)  listMobile.innerHTML  = items;

  document.querySelectorAll('.rm-toc__link').forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('select', 'resumos');
      // Toda a lógica de navegação (fixar seleção, abrir seção,
      // rolar, e devolver o controle ao scroll-spy no fim) vive em
      // _readerScroll.navigateTo — única fonte de verdade, para não
      // haver duas implementações de scroll competindo pelo controle.
      _readerScroll?.navigateTo(Number(btn.dataset.sec));
    });
  });
}

function _abrirTocSheet() {
  document.getElementById('rm-toc-sheet')?.classList.add('rm-toc-sheet--open');
  document.getElementById('rm-toc-trigger')?.setAttribute('aria-expanded', 'true');
}
function _fecharTocSheet() {
  document.getElementById('rm-toc-sheet')?.classList.remove('rm-toc-sheet--open');
  document.getElementById('rm-toc-trigger')?.setAttribute('aria-expanded', 'false');
}

function _collapseAllSections() {
  const sections = document.querySelectorAll('.rm-collapse');
  if (!sections.length) return;
  playSound('select', 'resumos');
  sections.forEach(sec => {
    sec.classList.remove('rm-collapse--open');
    sec.querySelector('.rm-collapse__trigger')?.setAttribute('aria-expanded', 'false');
  });
  const aulaLabel = document.getElementById('rm-aula-label');
  if (aulaLabel && aulaLabel.textContent) {
    const disc = State.disciplina?.id ?? 'unknown';
    const sem  = State.semestre       ?? 'unknown';
    const safe = String(aulaLabel.textContent).replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    try {
      const estado = {};
      sections.forEach(sec => { if (sec.dataset.sec !== undefined) estado[sec.dataset.sec] = false; });
      localStorage.setItem(`nexus_accordion__${sem}__${disc}__${safe}`, JSON.stringify(estado));
    } catch (_) {}
  }
}

function _bindTocChrome() {
  document.getElementById('rm-toc-trigger')?.addEventListener('click', () => {
    playSound('click', 'resumos');
    _abrirTocSheet();
  });
  document.getElementById('rm-toc-sheet-backdrop')?.addEventListener('click', _fecharTocSheet);
  document.getElementById('rm-toc-top')?.addEventListener('click', () => {
    playSound('click', 'resumos');
    document.getElementById('read-modal-panel')?.classList.remove('reader__bar--compact');
    _smoothScrollTo(document.getElementById('rm-body-wrapper'), 0);
  });
  document.getElementById('rm-toc-collapse-all')?.addEventListener('click', _collapseAllSections);
  document.getElementById('rm-toc-collapse-all-mobile')?.addEventListener('click', _collapseAllSections);
}

function _resolverContexto() {
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

function _atualizarStatusBadge() {
  const discBadge   = document.getElementById('disc-badge');
  const statusBadge = document.getElementById('header-status-badge');
  if (!discBadge || !statusBadge) return;

  if (State.disciplinas.length === 0) {
    discBadge.style.display   = 'none';
    discBadge.innerHTML       = '';
    statusBadge.style.display = '';
    statusBadge.innerHTML     = `<span style="flex-shrink:0">📭</span><span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;min-width:0">Vazio</span>`;
    statusBadge.className     = 'status-badge status-badge--empty';
  } else {
    statusBadge.style.display = 'none';
    statusBadge.innerHTML     = '';
  }
}

function _renderSemestreBadge() {
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

    _renderHeader();
    _renderSidebar();
    _carregarConteudo();

    playSound('select', 'resumos');
    document.dispatchEvent(new CustomEvent('nexus:semestreChanged', { detail: sem }));
  });
}

function _renderVideosSection() {
  let el = document.getElementById('videos-section');
  if (!el) {
    el = document.createElement('div');
    el.id = 'videos-section';
    el.style.display = 'none';
    const anchor = document.getElementById('mobile-toolbar') ?? document.getElementById('main-content');
    if (anchor) anchor.insertAdjacentElement('beforebegin', el);
    else return;
  }

  const disc = State.disciplina;
  if (!disc || !State.getVideos) { el.style.display = 'none'; return; }

  const videos = State.getVideos(State.semestre, disc.id);
  if (!videos.length) { el.style.display = 'none'; return; }

  const drive = videos.filter(v => v.tipo !== 'youtube');
  const yt    = videos.filter(v => v.tipo === 'youtube');
  const total = videos.length;

const buildChip = (v) => {
  const isGeral = v.label.toLowerCase().includes('geral');
  const isYT    = v.tipo === 'youtube';
  const isPlaylist = v.label.toLowerCase().includes('playlist') || v.label.toLowerCase().includes('curso');

  const cls = ['vchip', isGeral ? 'vchip--geral' : '', isYT ? 'vchip--yt' : '']
                .filter(Boolean).join(' ');

  const playIcon = isYT
    ? `<svg width="12" height="9" viewBox="0 0 20 14" fill="none">
         <rect width="20" height="14" rx="3" fill="rgba(255,60,60,0.65)"/>
         <path d="M8 4l6 3-6 3V4z" fill="white"/>
       </svg>`
    : `<svg width="9" height="10" viewBox="0 0 9 12" fill="currentColor">
         <path d="M0.5 1.5L8 6L0.5 10.5V1.5Z"/>
       </svg>`;

  const badgeClass = isYT ? 'vchip__badge--yt' : 'vchip__badge--drive';
  const badgeText  = isYT ? (isPlaylist ? 'Playlist' : 'YouTube') : 'Drive';

  return `
    <a href="${_esc(v.url)}" target="_blank" rel="noopener noreferrer" class="${cls}">
      <div class="vchip__top">
        <span class="vchip__play">${playIcon}</span>
        <span class="vchip__badge ${badgeClass}">${badgeText}</span>
      </div>
      <span class="vchip__label">${_esc(v.label)}</span>
    </a>`;
};

el.innerHTML = `
  <div class="videos-strip" id="videos-strip-wrap">
    <div class="videos-strip__head" id="videos-strip-toggle">
      <span class="videos-strip__head-icon">
        <svg width="9" height="10" viewBox="0 0 9 12" fill="currentColor"><path d="M0.5 1.5L8 6L0.5 10.5V1.5Z"/></svg>
      </span>
      <span class="videos-strip__head-label">Vídeos das Aulas</span>
      <span class="videos-strip__head-count">${total} vídeo${total !== 1 ? 's' : ''}</span>
      <div class="videos-strip__toggle-btn">
        <span class="videos-strip__toggle-label"></span>
        <svg class="videos-strip__chevron" width="11" height="11" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
    <div class="videos-strip__body">
      <div class="videos-strip__body-inner">
        <div class="videos-strip__row">
          ${drive.map(v => buildChip(v)).join('')}
        </div>
        ${yt.length ? `
          <div class="videos-strip__yt-label">
            <svg width="11" height="8" viewBox="0 0 20 14" fill="none">
              <rect width="20" height="14" rx="3" fill="rgba(255,60,60,0.55)"/>
              <path d="M8 4l6 3-6 3V4z" fill="white"/>
            </svg>
            YouTube
          </div>
          <div class="videos-strip__row">
            ${yt.map(v => buildChip(v)).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  </div>`;

document.getElementById('videos-strip-toggle')?.addEventListener('click', () => {
  playSound('click', 'resumos');
  document.getElementById('videos-strip-wrap')?.classList.toggle('videos-strip--open');
});

  el.style.display = '';
}

function _carregarConteudo() {
  _mostrarEstado('loading');
  _renderVideosSection();
  State.temConteudo  = null;
  State.aulas        = [];
  State.simplificado = [];
  State.resumao      = [];
  _atualizarStatusBadge();
  _removerScriptAnterior();
  window.__nexusConteudo = null;

  const disc = State.disciplina;
  if (!disc) {
    State.temConteudo = false;
    _atualizarStatusBadge();
    _renderHeroStats(0);
    _mostrarEstadoSemConteudo();
    return;
  }

const { ano, periodo, ap } = parseSemestre(State.semestre ?? '2026.1');
const apPath = ap ? `/${ap}` : '';
const src = `../content/resumo/${ano}/${periodo}${apPath}/res_${disc.arquivo}.js`;

  const script = document.createElement('script');
  script.src = src;
  script.id  = 'nexus-conteudo-script';

  script.onload = () => {
    if (State.disciplina?.id !== disc.id) return;

    const dados = _lerDados();
    State.discVerificadas.add(disc.id);
    State.aulas        = dados.aulas;
    State.simplificado = dados.simplificado;
    State.resumao      = dados.resumao;
    State.temConteudo  = dados.aulas.length > 0;
    State.modo         = 'completo';

    _marcarStatusConteudo(disc.id, State.temConteudo);

    if (!State.temConteudo) {
      _renderHeroStats(0);
      _mostrarEstadoSemConteudo();
      return;
    }

    _renderHeroStats(dados.aulas.length);
    _renderGrid();
    _mostrarEstado('grid');
  };

  script.onerror = () => {
    if (State.disciplina?.id !== disc.id) return;
    State.discVerificadas.add(disc.id);
    State.temConteudo = false;
    _marcarStatusConteudo(disc.id, false);
    _renderHeroStats(0);
    _mostrarEstadoSemConteudo();
  };

  document.head.appendChild(script);
}

function _removerScriptAnterior() {
  document.getElementById('nexus-conteudo-script')?.remove();
}

function _lerDados() {
  const raw = window.__nexusConteudo ?? null;
  if (!raw) return { aulas: [], simplificado: [] };

  return {
    aulas:        Array.isArray(raw.aulas)        ? raw.aulas        : [],
    simplificado: Array.isArray(raw.simplificado) ? raw.simplificado : [],
    resumao:      Array.isArray(raw.resumao)       ? raw.resumao      : [],
  };
}

function _temSimplificado() { return State.simplificado.length > 0; }
function _temResumao()      { return State.resumao.length > 0; }

function _buildToggleHtml() {
  if (!_temSimplificado() && !_temResumao()) return '';

  const btnCompleto = `<button class="mode-btn${State.modo === 'completo' ? ' mode-btn--active' : ''}" data-modo="completo">Resumo completo</button>`;
  const btnSintese  = _temSimplificado()
    ? `<button class="mode-btn${State.modo === 'sintese'  ? ' mode-btn--active' : ''}" data-modo="sintese">Síntese rápida</button>`
    : '';
  const btnResumao  = _temResumao()
    ? `<button class="mode-btn${State.modo === 'resumao'  ? ' mode-btn--active' : ''}" data-modo="resumao">Resumão</button>`
    : '';

  return `<div class="mode-toggle" id="mode-toggle">${btnCompleto}${btnSintese}${btnResumao}</div>`;
}

function _setModo(modo) {
  if (State.modo === modo) return;
  playSound('select', 'resumos');
  State.modo = modo;
  document.querySelectorAll('[data-modo]').forEach(btn => {
    btn.classList.toggle('mode-btn--active', btn.dataset.modo === modo);
  });
  _renderGrid();
  _mostrarEstado('grid');
}

function _mostrarEstado(estado) {
  document.getElementById('state-loading').style.display    = estado === 'loading'    ? 'flex' : 'none';
  document.getElementById('state-no-content').style.display = estado === 'no-content' ? 'flex' : 'none';
  document.getElementById('state-empty').style.display      = estado === 'empty'      ? 'flex' : 'none';
  document.getElementById('resumos-grid').style.display     = estado === 'grid'       ? 'grid' : 'none';
}

function _mostrarEstadoSemConteudo() {
  const disc = State.disciplina;
  const eEl  = document.getElementById('state-disc-emoji');
  const nEl  = document.getElementById('state-disc-name');
  if (eEl) eEl.textContent = disc?.emoji ?? '';
  if (nEl) nEl.textContent  = disc?.nome  ?? '';
  _mostrarEstado('no-content');
}

function _renderHeroStats(total) {
  const c    = document.getElementById('hero-stats');
  const sub  = document.getElementById('hero-sub');
  const disc = State.disciplina;
  if (!c) return;

  const toggleHtml = total > 0 ? _buildToggleHtml() : '';
  c.innerHTML = disc
    ? `<div class="stat-pill">${disc.emoji} ${disc.nome}</div>${toggleHtml}`
    : '';

  if (total > 0 && toggleHtml) {
    document.getElementById('mode-toggle')?.addEventListener('click', e => {
      const btn = e.target.closest('[data-modo]');
      if (!btn) return;
      _setModo(btn.dataset.modo);
    });
  }

  if (sub) sub.textContent = total === 0
    ? `Nenhum resumo disponível para ${disc?.nome ?? 'esta disciplina'} ainda.`
    : `${total} aula${total !== 1 ? 's' : ''} disponíve${total !== 1 ? 'is' : 'l'} — ${disc?.nome ?? ''}.`;
}

function _renderGrid() {
  const grid = document.getElementById('resumos-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (State.modo === 'sintese') {
    State.aulas.forEach((aula, idx) => {
      const sint = State.simplificado[idx] ?? null;
      const temSint = !!(sint && (sint.ideia_central || (sint.secoes ?? []).length > 0));
      if (!temSint) return;
      const card = _criarCardSintese(aula, idx);
      grid.appendChild(card);
    });
  } else if (State.modo === 'resumao') {
    State.resumao.forEach((res, idx) => {
      if (!res) return;
      const temRes = !!(res.ideia_central || (res.secoes ?? []).length > 0);
      if (!temRes) return;
      const card = _criarCardResumao(res, idx);
      grid.appendChild(card);
    });
  } else {
    State.aulas.forEach((aula, idx) => {
      grid.appendChild(_criarCard(aula, idx));
    });
  }
}

function _profChip(nomeProf) {
  if (!nomeProf) return '';
  const icones = { Bruno: '🧑‍🏫', Wagner: '👨‍💻', Raul: '📐' };
  const icone  = icones[nomeProf] ?? '👤';
  return `<span class="card-prof-chip">${icone} ${_esc(nomeProf)}</span>`;
}

function _estimarTempo(aula) {
  const secoes = aula.secoes ?? [];
  let blocos = 0;
  secoes.forEach(s => { blocos += (s.blocos ?? []).length; });
  const minutos = Math.max(2, Math.round((secoes.length * 1.5 + blocos * 0.5)));
  return `~${minutos} min`;
}

function _nivelAula(secoes) {
  if (secoes >= 5) return { label: 'Avançado', color: 'var(--rose)' };
  if (secoes >= 3) return { label: 'Intermediário', color: 'var(--amber)' };
  return { label: 'Introdutório', color: 'var(--teal)' };
}

function _bindCardHover(card) {
  card.addEventListener('mouseenter', () => playSound('hover', 'resumos'));
}

const _ARROW_SVG = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
  </svg>`;

/* ══════════════════════════════════════════════
   LINHA NÚMERO + TÍTULO + SETA (cards)
   Grid de 3 colunas (auto | minmax(0,1fr) | auto):
   número e seta ficam em colunas fixas, o título
   ocupa a coluna elástica do meio e quebra dentro
   dela — nunca sob a seta, e a continuação alinha
   com o início do título, não com o número (é o
   próprio grid quem garante isso, não um cálculo
   manual de padding). Reaproveitada pelos 3 tipos
   de card para não divergirem visualmente.
══════════════════════════════════════════════ */
function _buildCardTitleRow(numPad, aulaLabelHtml, tituloHtml) {
  return `
    <div class="resumo-card__row">
      <span class="resumo-card__num">${numPad}</span>
      <div class="resumo-card__title-col">
        ${aulaLabelHtml}
        ${tituloHtml}
      </div>
      <span class="resumo-card__arrow">${_ARROW_SVG}</span>
    </div>`;
}

function _criarCard(aula, idx) {
  const secoes  = aula.secoes ?? [];
  const aulaStr = _esc(aula.aula ?? '');
  const m       = aulaStr.match(/^(Aula\s*[\d\/]+)\s*[—–-]\s*(.+)$/i);
  const aulaNum = m ? m[1] : aulaStr;
  const aulaTit = m ? m[2] : '';
  const numPad  = String(idx + 1).padStart(2, '0');

  // Título real do card: "Aula N — Título" vira Título; sem esse
  // prefixo, o texto inteiro já é o título.
  const tituloCard = aulaTit || aulaStr;
  // A etiqueta de contexto (.resumo-card__aula) só existe quando traz
  // informação real e distinta do título — ex.: "Aula 3" acima de
  // "Ponteiros e Referências". Quando aulaNum é apenas o título
  // inteiro de novo (fallback do regex, sem prefixo "Aula N —"), ela
  // é pura redundância e é omitida — o título assume sozinho a cor
  // de identidade (.resumo-card__titulo--identity, ver CSS).
  const aulaLabelCard = (aulaNum && aulaNum !== tituloCard) ? aulaNum : null;

  const card = document.createElement('article');
  card.className = 'resumo-card';
  card.dataset.tipo = 'completo';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Abrir: ${aula.aula}`);
  card.innerHTML = `
    <div class="resumo-card__stripe"></div>
    <div class="resumo-card__body">
      ${_buildCardTitleRow(
        numPad,
        aulaLabelCard ? `<div class="resumo-card__aula">${aulaLabelCard}</div>` : '',
        `<div class="resumo-card__titulo${aulaLabelCard ? '' : ' resumo-card__titulo--identity'}">${tituloCard}</div>`
      )}
      ${aula.ideia_central
        ? `<div class="resumo-card__desc">${_parseInline(aula.ideia_central)}</div>`
        : ''}
      <div class="resumo-card__meta">
        <span class="resumo-card__tag">
          <span class="resumo-card__tag-dot"></span>
          ${secoes.length} seç${secoes.length !== 1 ? 'ões' : 'ão'}
        </span>
        ${aula.professor ? `<span class="resumo-card__tag" style="opacity:.6">👤 ${_esc(aula.professor)}</span>` : ''}
      </div>
    </div>`;

  _bindCardHover(card);
  card.addEventListener('click', () => _abrirModal(aula));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _abrirModal(aula); }
  });
  return card;
}

function _criarCardSintese(aula, idx) {
  const aulaStr = _esc(aula.aula ?? '');
  const m       = aulaStr.match(/^(Aula\s*[\d\/]+)\s*[—–-]\s*(.+)$/i);
  const aulaNum = m ? m[1] : aulaStr;
  const aulaTit = m ? m[2] : '';
  const sint    = State.simplificado[idx] ?? null;
  const temSint = !!(sint && (sint.ideia_central || (sint.secoes ?? []).length > 0));
  const preview = sint?.ideia_central ?? null;
  const numSec  = (sint?.secoes ?? []).length;
  const numPad  = String(idx + 1).padStart(2, '0');

  const card = document.createElement('article');
  card.className = 'resumo-card';
  card.dataset.tipo = 'sintese';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Síntese: ${aula.aula}`);
  card.innerHTML = `
    <div class="resumo-card__stripe"></div>
    <div class="resumo-card__body">
      ${_buildCardTitleRow(
        numPad,
        `<div class="resumo-card__aula">${aulaNum} · Síntese</div>`,
        `<div class="resumo-card__titulo">${aulaTit || aulaStr}</div>`
      )}
      ${preview
        ? `<div class="resumo-card__desc">${_parseInline(preview)}</div>`
        : `<div class="resumo-card__desc" style="font-style:italic;opacity:0.5">Síntese não disponível ainda.</div>`}
      <div class="resumo-card__meta">
        <span class="resumo-card__tag">
          <span class="resumo-card__tag-dot"></span>
          ${numSec} seç${numSec !== 1 ? 'ões' : 'ão'}
        </span>
      </div>
    </div>`;

  _bindCardHover(card);
  card.addEventListener('click', () => { if (temSint) _abrirModal(sint); });
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (temSint) _abrirModal(sint); }
  });
  return card;
}

function _criarCardResumao(res, idx) {
  const aulaStr = _esc(res.aula ?? '');
  const m       = aulaStr.match(/^(Aula\s*[\d\/]+)\s*[—–-]\s*(.+)$/i);
  const aulaNum = m ? m[1] : aulaStr;
  const aulaTit = m ? m[2] : '';
  const preview = res.ideia_central ?? null;
  const numSec  = (res.secoes ?? []).length;
  const numPad  = String(idx + 1).padStart(2, '0');

  const card = document.createElement('article');
  card.className = 'resumo-card';
  card.dataset.tipo = 'resumao';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Resumão: ${res.aula}`);
  card.innerHTML = `
    <div class="resumo-card__stripe"></div>
    <div class="resumo-card__body">
      ${_buildCardTitleRow(
        numPad,
        `<div class="resumo-card__aula">${aulaNum} · Resumão</div>`,
        `<div class="resumo-card__titulo">${aulaTit || aulaStr}</div>`
      )}
      ${preview
        ? `<div class="resumo-card__desc">${_parseInline(preview)}</div>`
        : `<div class="resumo-card__desc" style="font-style:italic;opacity:0.5">Resumão não disponível ainda.</div>`}
      <div class="resumo-card__meta">
        <span class="resumo-card__tag">
          <span class="resumo-card__tag-dot"></span>
          ${numSec} seç${numSec !== 1 ? 'ões' : 'ão'}
        </span>
      </div>
    </div>`;

  _bindCardHover(card);
  card.addEventListener('click', () => _abrirModalResumao(res));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _abrirModalResumao(res); }
  });
  return card;
}

function _abrirModalResumao(res) {
  playSound('click', 'resumos');
  playSound('openModal', 'resumos');

  // Modo de leitura aberto: o botão de 3 barras (abre a sidebar
  // principal) não deve competir com o botão de voltar do reader.
  // A regra que esconde ".sidebar-toggle" quando esta classe está
  // presente vive em css/sidebar.css — aqui só avisamos o estado.
  document.body.classList.add('reader-open');

  const discLabel = document.getElementById('rm-disc-label');
  if (discLabel) discLabel.textContent = State.disciplina?.nome ?? '';

  const aulaLabel = document.getElementById('rm-aula-label');
  if (aulaLabel) aulaLabel.textContent = res.aula ?? '';

  const badge = document.getElementById('rm-tipo-badge');
  if (badge) {
    badge.textContent = 'Resumão';
    badge.className   = 'reader__bar-badge badge--resumao';
  }

  const body = document.getElementById('rm-body');
  if (body) body.innerHTML = _buildReaderBody(res);

  const _accordionKey = _storageKeyAccordion((res.aula ?? String(Date.now())) + '__resumao');
  _bindReaderAccordion(_accordionKey);
  _buildTOC(res.secoes ?? []);

  document.getElementById('read-modal').classList.add('read-modal--open');
  document.body.style.overflow = 'hidden';
  document.getElementById('read-modal-panel')?.focus();

  _readerScroll?.cleanup();
  const scrollEl = document.getElementById('rm-body-wrapper');
  _readerScroll = _initReadingScrollSystem(scrollEl);
}

function _bindModal() {
  document.getElementById('read-modal-close')?.addEventListener('click', () => {
    playSound('closeModal', 'resumos');
    _fecharModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (document.getElementById('rm-toc-sheet')?.classList.contains('rm-toc-sheet--open')) {
        _fecharTocSheet();
        return;
      }
      if (document.getElementById('read-modal')?.classList.contains('read-modal--open')) {
        playSound('closeModal', 'resumos');
      }
      _fecharModal();
    }
  });
}

// Instância ativa do sistema de leitura (scroll-spy + navegação
// programática) — ver _initReadingScrollSystem. `_readerScroll` é lida
// dentro do closure do clique no índice em _buildTOC.
let _readerScroll = null;

function _fecharModal() {
  document.getElementById('read-modal')?.classList.remove('read-modal--open');
  document.body.style.overflow = '';
  // Devolve o botão de 3 barras da sidebar principal ao estado normal.
  document.body.classList.remove('reader-open');
  _fecharTocSheet();
  document.getElementById('read-modal-panel')?.classList.remove('reader__bar--compact');
  if (_readerScroll) {
    _readerScroll.cleanup();
    _readerScroll = null;
  }
}

function _buildModalBody(aula) { return _buildReaderBody(aula); }
function _ativarSecao() {}

function _abrirModal(aula) {
  playSound('click', 'resumos');
  playSound('openModal', 'resumos');

  // Modo de leitura aberto: mesma lógica de _abrirModalResumao acima
  // (ver comentário lá) — mantém as duas entradas do reader consistentes.
  document.body.classList.add('reader-open');

  const discLabel = document.getElementById('rm-disc-label');
  if (discLabel) discLabel.textContent = State.disciplina?.nome ?? '';

  const aulaLabel = document.getElementById('rm-aula-label');
  if (aulaLabel) aulaLabel.textContent = aula.aula ?? '';

  const badge = document.getElementById('rm-tipo-badge');
  if (badge) {
    const isSintese = State.modo === 'sintese';
    badge.textContent = isSintese ? 'Síntese' : 'Resumo';
    badge.className   = 'reader__bar-badge badge--conceito';
  }

  const body = document.getElementById('rm-body');
  if (body) body.innerHTML = _buildReaderBody(aula);

  const _accordionKey = _storageKeyAccordion(aula.aula ?? aula.id ?? String(Date.now()));
  _bindReaderAccordion(_accordionKey);
  _buildTOC(aula.secoes ?? []);

  document.getElementById('read-modal').classList.add('read-modal--open');
  document.body.style.overflow = 'hidden';
  document.getElementById('read-modal-panel')?.focus();

  _readerScroll?.cleanup();
  const scrollEl = document.getElementById('rm-body-wrapper');
  _readerScroll = _initReadingScrollSystem(scrollEl);
}

function _storageKeyAccordion(aulaId) {
  const disc = State.disciplina?.id ?? 'unknown';
  const sem  = State.semestre    ?? 'unknown';
  const safe = String(aulaId).replace(/[^a-zA-Z0-9_\-\.]/g, '_');
  return `nexus_accordion__${sem}__${disc}__${safe}`;
}

function _lerEstadoAccordion(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function _salvarEstadoAccordion(key) {
  try {
    const estado = {};
    document.querySelectorAll('.rm-collapse').forEach(sec => {
      const idx = sec.dataset.sec;
      if (idx !== undefined) {
        estado[idx] = sec.classList.contains('rm-collapse--open');
      }
    });
    localStorage.setItem(key, JSON.stringify(estado));
  } catch (_) {}
}

function _restaurarEstadoAccordion(key) {
  const estado = _lerEstadoAccordion(key);
  if (!estado) return;
  document.querySelectorAll('.rm-collapse').forEach(sec => {
    const idx = sec.dataset.sec;
    if (idx !== undefined && estado[idx] !== undefined) {
      sec.classList.toggle('rm-collapse--open', estado[idx]);
      const trigger = sec.querySelector('.rm-collapse__trigger');
      if (trigger) trigger.setAttribute('aria-expanded', String(estado[idx]));
    }
  });
}

function _bindReaderAccordion(storageKey) {
  _restaurarEstadoAccordion(storageKey);

  document.querySelectorAll('.rm-collapse__trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.closest('.rm-collapse');
      if (!section) return;
      const isOpen = section.classList.contains('rm-collapse--open');
      section.classList.toggle('rm-collapse--open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      playSound('select', 'resumos');
      _salvarEstadoAccordion(storageKey);
    });
  });
}

function _buildReaderBody(aula) {
  const secoes  = aula.secoes ?? [];
  const aulaStr = aula.aula ?? '';
  const m       = aulaStr.match(/^(Aula\s*[\d\/]+)\s*[—–-]\s*(.+)$/i);
  const aulaNum = m ? m[1] : aulaStr;
  const aulaTit = m ? m[2] : '';
  const aulaNumero = aulaNum.replace(/\D/g, '');

  // Título do resumo — conteúdo principal desta tela.
  const tituloResumo = aulaTit || aulaStr;
  // Disciplina — o contexto. Vem direto do estado real da aplicação
  // (State.disciplina), nunca hardcoded: se a disciplina mudar, o
  // eyebrow muda junto (ver 10. ANALISE OS DADOS REAIS no pedido).
  const discNome = State.disciplina?.nome ?? '';
  // "Aula N" deixou de ser o eyebrow (isso duplicava o título quando
  // o dado não tinha o prefixo "Aula N — "). Quando é informação real
  // e distinta do título, vira um chip de metadado junto de "seções"
  // e "professor" — não mais um segundo título competindo com o
  // principal.
  const aulaNumLabel = (aulaNum && aulaNum !== tituloResumo) ? aulaNum : null;

  let html = `
    <div class="reader__hero">
      ${aulaNumero ? `<div class="reader__hero-number">${_esc(aulaNumero)}</div>` : ''}
      ${discNome ? `<div class="reader__hero-eyebrow">${_esc(discNome)}</div>` : ''}
      <h1 class="reader__hero-title">${_esc(tituloResumo)}</h1>
      <div class="hero-divider"></div>
      <div class="reader__hero-meta">
        ${aulaNumLabel ? `<span class="reader__hero-chip reader__hero-chip--num">${_esc(aulaNumLabel)}</span>` : ''}
        <span class="reader__hero-chip">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          ${secoes.length} seç${secoes.length !== 1 ? 'ões' : 'ão'}
        </span>
        ${aula.professor ? `<span class="reader__hero-chip">👤 ${_esc(aula.professor)}</span>` : ''}
      </div>
    </div>`;

  if (aula.ideia_central) {
    html += `<div class="reader__ideia rm-ideia-central">
      <span class="rm-ideia-icon">💡</span>
      <span>${_parseInline(aula.ideia_central)}</span>
    </div>`;
  }

  secoes.forEach((sec, i) => {
    html += `
      <div class="rm-collapse" data-sec="${i}">
        <button class="rm-collapse__trigger" aria-expanded="false">
          <span class="rm-collapse__icon">${String(i + 1).padStart(2,'0')}</span>
          <span style="flex:1;text-align:left;font-size:0.9rem;font-weight:600;color:inherit;line-height:1.35">${_esc(sec.titulo)}</span>
          <svg class="rm-collapse__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="rm-collapse__body">
          <div class="rm-collapse__body-inner">
            <div class="rm-collapse__body-content">
              ${(sec.blocos ?? []).map(b => _renderBloco(b)).join('')}
            </div>
          </div>
        </div>
      </div>`;
  });

  return html;
}

function _imgBase() {
  const { ano, periodo, ap } = parseSemestre(State.semestre ?? '2026.1');
  const apPath = ap ? `/${ap}` : '';
  const disc   = State.disciplina;
  return disc
    ? `../content/resumo/${ano}/${periodo}${apPath}/image/imagens_${disc.arquivo}/`
    : `../content/resumo/${ano}/${periodo}${apPath}/image/`;
}

function _renderBloco(b) {
  switch (b.tipo) {
    case 'topico': {
      const base = _imgBase();
      let html = `<div class="rm-topico">`;
      html += `<div class="rm-topico__titulo">${_parseInline(b.titulo ?? '')}</div>`;
      if (b.texto)  html += `<p class="rm-topico__texto">${_parseInline(b.texto)}</p>`;
      if (b.imagem) html += `
        <figure class="rm-topico__fig">
          <img class="rm-topico__img" src="${_esc(base + b.imagem.src)}" alt="${_esc(b.imagem.alt)}" loading="lazy" />
          <figcaption class="rm-topico__fig-caption">${_esc(b.imagem.alt)}</figcaption>
        </figure>`;
      if (b.lista)  html += `<ul class="rm-lista">${b.lista.map(i => `<li><span>${_parseInline(i)}</span></li>`).join('')}</ul>`;
      if (b.codigo) html += `<pre class="rm-codigo"><code>${_esc(b.codigo)}</code></pre>`;
      html += `</div>`;
      return html;
    }
    case 'imagem': {
      const { ano, periodo, ap } = parseSemestre(State.semestre ?? '2026.1');
      const apPath = ap ? `/${ap}` : '';
      const base = b.pasta
        ? `../content/resumo/${ano}/${periodo}${apPath}/image/${b.pasta}/`
        : _imgBase();
      const num  = b.num ? `<span class="rm-fig__num">Figura ${b.num}</span>` : '';
      return `
        <figure class="rm-fig">
          <img class="rm-fig__img" src="${_esc(base + b.src)}" alt="${_esc(b.alt ?? '')}" loading="lazy" />
          <figcaption class="rm-fig__caption">${num}<span class="rm-fig__caption-text">${_esc(b.alt ?? '')}</span></figcaption>
        </figure>`;
    }
    case 'lista': {
      let html = '';
      if (b.titulo) html += `<p class="rm-lista-titulo">${_parseInline(b.titulo)}</p>`;
      html += `<ul class="rm-lista">${(b.itens ?? []).map(i => `<li><span>${_parseInline(i)}</span></li>`).join('')}</ul>`;
      return html;
    }
    case 'texto':
      return `<p class="rm-topico__texto" style="margin-bottom:0.85rem">${_parseInline(b.texto ?? '')}</p>`;
    case 'subtitulo':
      return `<div class="rm-subtitulo">${_parseInline(b.texto ?? '')}</div>`;
    case 'exemplo':
      return `<div class="rm-exemplo">
        <div class="rm-exemplo__titulo">${_esc(b.titulo ?? '')}</div>
        <p class="rm-exemplo__texto">${_parseInline(b.texto ?? '')}</p>
        ${b.detalhe ? `<span class="rm-exemplo__detalhe">${_parseInline(b.detalhe)}</span>` : ''}
      </div>`;
    case 'tabela': {
      const cols = b.colunas ?? [];
      const rows = b.linhas  ?? [];
      return `
        ${b.titulo ? `<div class="rm-topico__titulo">${_parseInline(b.titulo)}</div>` : ''}
        <div class="rm-tabela-wrap">
          <table class="rm-tabela">
            <thead><tr>${cols.map(c => `<th>${_esc(c)}</th>`).join('')}</tr></thead>
            <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${_parseInline(c)}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>`;
    }
    case 'codigo':
      return `<pre class="rm-codigo"><code>${_esc(b.codigo ?? '')}</code></pre>`;
    case 'destaque':
      return `<div class="rm-destaque">${_parseInline(b.texto ?? '')}</div>`;
    default:
      return '';
  }
}

function _marcarStatusConteudo(discId, tem) {
  const el = document.getElementById(`disc-status-${discId}`);
  if (el) {
    el.textContent = tem ? 'Disponível' : 'Sem conteúdo';
    el.className   = `disc-item__status disc-item__status--${tem ? 'ok' : 'empty'}`;
  }
}

function _trocarDisciplina(disc) {
  if (disc.id === State.disciplina?.id) return;
  playSound('click', 'resumos');
  State.disciplina   = disc;
  State.temConteudo  = null;
  State.aulas        = [];
  State.simplificado = [];
  State.resumao      = [];
  State.modo         = 'completo';
  setDisciplina(disc.id);

  sincronizarSemNaURL(State.semestre, 'push');
  const url = new URL(window.location.href);
  url.searchParams.set('disc', disc.id);
  window.history.pushState({}, '', url);

  _renderHeader();
  aplicarCoresDisciplina(disc.arquivo, State.DISC_CORES);
  _renderSidebar();
  _carregarConteudo();
}

/* ══════════════════════════════════════════════════════════
   SIDEBAR — conteúdo real
   ══════════════════════════════════════════════════════════
   Preenche #sidebar-semestre e #disc-list a partir de
   State.semestre / State.disciplinas / State.disciplina, que já
   são carregados com dados reais (src/global.js) por
   _resolverContexto() e _renderSemestreBadge(). Não mexe em
   nada da mecânica do drawer mobile (isso continua 100% nos
   scripts inline de resumo.html — sidebar-toggle/overlay/
   animação/transform/z-index).
   ══════════════════════════════════════════════════════════ */
function _renderSidebar() {
  const semEl = document.getElementById('sidebar-semestre');
  if (semEl) semEl.textContent = State.semestre ?? '—';

  const lista = document.getElementById('disc-list');
  if (!lista) return;

  if (!State.disciplinas.length) {
    lista.innerHTML = `
      <div style="padding:2rem 1rem;text-align:center;color:var(--rs-text-3,var(--text-3));font-size:0.78rem;line-height:1.6;">
        <span style="display:block;font-size:1.4rem;margin-bottom:0.4rem;">📭</span>
        Nenhuma disciplina<br>neste semestre
      </div>`;
    return;
  }

  lista.innerHTML = State.disciplinas.map(disc => {
    const ativo = disc.id === State.disciplina?.id;
    const label = disc.apelido ?? disc.nome;
    return `
      <button class="disc-item${ativo ? ' disc-item--active' : ''}"
              data-disc-id="${_esc(disc.id)}"
              aria-current="${ativo ? 'page' : 'false'}"
              title="${_esc(disc.nome)}">
        <span class="disc-item__emoji">${disc.emoji ?? ''}</span>
        <span class="disc-item__info">
          <span class="disc-item__nome">${_esc(label)}</span>
        </span>
        <svg class="disc-item__chevron" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>`;
  }).join('');

  lista.querySelectorAll('.disc-item').forEach(btn => {
    const disc = State.disciplinas.find(d => d.id === btn.dataset.discId);
    if (!disc) return;
    btn.addEventListener('mouseenter', () => playSound('hover', 'resumos'));
    btn.addEventListener('click', () => {
      _trocarDisciplina(disc);
    });
  });
}

function _renderHeader() {
  const disc = State.disciplina;

  const bc = document.getElementById('header-breadcrumb');
  if (bc) bc.innerHTML = disc ? `Resumos <span>· ${disc.nome}</span>` : 'Resumos';

  const badge = document.getElementById('disc-badge');
  if (badge) {
    if (disc && State.disciplinas.length > 0) {
      const label = disc.apelido ?? disc.nome;
      badge.style.display = '';
      badge.innerHTML = `
        <span style="flex-shrink:0">${disc.emoji}</span>
        <span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;min-width:0">${label}</span>`;
    } else {
      badge.style.display = 'none';
      badge.innerHTML = '';
    }
  }

  const ey = document.getElementById('hero-eyebrow-text');
  if (ey) ey.textContent = disc?.nome ?? 'Resumos';

  document.title = disc ? `Resumos — ${disc.nome} · Nexus Study` : 'Resumos · Nexus Study';
  _atualizarStatusBadge();
}

function _esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function _parseInline(str) {
  if (!str) return '';
  return _esc(str)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}