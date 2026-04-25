/* =============================================
   NEXUS STUDY — resumo.js  (v9 — robust)
   ✦ imports dinâmicos para dependências opcionais
     (DISC_CORES e videos.js) — página nunca trava
   ✦ global.js continua como import estático
   ============================================= */

import {
  getSemestreAtual,
  getDisciplinaAtual,
  setDisciplina,
  getDisciplinasDeSemestre,
  setPagina,
  setSemestre,
  SEMESTRES,
} from '../src/global.js';

import { resolverSemestreDeURL, sincronizarSemNaURL } from '../shared/js/url.js';
import { criarSemestreSelect, preencherAnos } from '../shared/js/dom.js';
import { aplicarCoresDisciplina } from '../shared/js/theme.js';


/* ══════════════════════════════════════════════
   ESTADO
══════════════════════════════════════════════ */
const State = {
  disciplina:      null,
  semestre:        null,
  disciplinas:     [],
  aulas:           [],
  simplificado:    [],
  professor:       [],
  aulaAberta:      null,
  discVerificadas: new Set(),
  temConteudo:     null,
  modo:            'completo', // 'completo' | 'sintese' | 'professor'
  DISC_CORES:      {},         // preenchido via import dinâmico
  getVideos:       null,       // preenchido via import dinâmico
};

/* ══════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  setPagina('RESUMO');
  preencherAnos();

  // Imports opcionais — se falharem, o resto da página continua funcionando
  try {
    const mod = await import('../shared/js/cores.js');
    State.DISC_CORES = mod.DISC_CORES ?? {};
  } catch (_) { /* sem cores dinâmicas */ }

  try {
    const mod = await import('../conteudo_geral/resumo/videos.js');
    State.getVideos = mod.getVideos ?? null;
  } catch (_) { /* sem seção de vídeos */ }

  _resolverContexto();

  /* ── SELETOR DE SEMESTRE ─────────────────────────────────
     Colocado aqui, após _resolverContexto() (que já definiu
     State.semestre), dentro do DOMContentLoaded para garantir
     que o DOM e State.semestre estejam prontos.             */
  criarSemestreSelect('semestre-wrap-resumo', sem => {
    State.semestre     = sem;
    State.disciplinas  = getDisciplinasDeSemestre(sem);
    State.temConteudo  = null;
    State.aulas        = [];
    State.simplificado = [];
    State.professor    = [];
    State.modo         = 'completo';
    State.disciplina   = State.disciplinas[0] ?? null;
    if (State.disciplina) {
      setDisciplina(State.disciplina.id);
      aplicarCoresDisciplina(State.disciplina.arquivo, State.DISC_CORES);
    } else {
      setDisciplina(null);
    }
    _renderSidebar();
    _renderHeader();
    _carregarConteudo();
  }, State.semestre);

  _renderSidebar();
  _renderHeader();

  _bindModal();
  _bindMobileDropdown();
  _carregarConteudo();
});


/* ══════════════════════════════════════════════
   CONTEXTO
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   STATUS BADGE
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   SEÇÃO DE VÍDEOS
══════════════════════════════════════════════ */
function _renderVideosSection() {
  // Cria o container se não existir no HTML
  let el = document.getElementById('videos-section');
  if (!el) {
    el = document.createElement('div');
    el.id = 'videos-section';
    el.style.display = 'none';
    // Insere antes do mobile-toolbar ou antes do main
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

  /* ── Cole esta função dentro de _renderVideosSection(), substituindo o buildChip antigo ── */

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

/* ── Substitua também o ytSep por este ── */

const ytSep = yt.length ? `
  <div class="vstrip-yt-sep">
    <div class="vstrip-yt-sep__line"></div>
    <span class="vstrip-yt-sep__text">YT</span>
    <div class="vstrip-yt-sep__line"></div>
  </div>` : '';



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
  document.getElementById('videos-strip-wrap')?.classList.toggle('videos-strip--open');
});

  el.style.display = '';
}

/* ══════════════════════════════════════════════
   CARREGAR CONTEÚDO DINÂMICO
══════════════════════════════════════════════ */
function _carregarConteudo() {
  _mostrarEstado('loading');
  _renderVideosSection();
  State.temConteudo  = null;
  State.aulas        = [];
  State.simplificado = [];
  State.professor    = [];
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

  const [ano] = (State.semestre ?? '2026.1').split('.');
  const src = `../conteudo_geral/resumo/${ano}/${State.semestre}/res_${disc.arquivo}.js`;

  const script = document.createElement('script');
  script.src = src;
  script.id  = 'nexus-conteudo-script';

  script.onload = () => {
    if (State.disciplina?.id !== disc.id) return;

    const dados = _lerDados();
    State.discVerificadas.add(disc.id);
    State.aulas        = dados.aulas;
    State.simplificado = dados.simplificado;
    State.professor    = dados.professor;
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
  if (!raw) return { aulas: [], simplificado: [], professor: [] };

  return {
    aulas:        Array.isArray(raw.aulas)        ? raw.aulas        : [],
    simplificado: Array.isArray(raw.simplificado) ? raw.simplificado : [],
    professor:    Array.isArray(raw.professor)    ? raw.professor    : [],
  };
}



/* ══════════════════════════════════════════════
   TOGGLE DE MODO
══════════════════════════════════════════════ */
function _temSimplificado() { return State.simplificado.length > 0; }
function _temProfessor()    { return State.professor.length > 0; }

function _buildToggleHtml() {
  const temSint = _temSimplificado();
  const temProf = _temProfessor();
  if (!temSint && !temProf) return '';

  const btnCompleto = `<button class="mode-btn${State.modo === 'completo' ? ' mode-btn--active' : ''}" data-modo="completo">Resumo completo</button>`;
  let btnExtra = '';
  if (temSint) btnExtra += `<button class="mode-btn${State.modo === 'sintese'   ? ' mode-btn--active' : ''}" data-modo="sintese">Síntese rápida</button>`;
  if (temProf) btnExtra += `<button class="mode-btn${State.modo === 'professor' ? ' mode-btn--active' : ''}" data-modo="professor">Professor</button>`;

  return `<div class="mode-toggle" id="mode-toggle">${btnCompleto}${btnExtra}</div>`;
}

function _setModo(modo) {
  if (State.modo === modo) return;
  State.modo = modo;
  document.querySelectorAll('[data-modo]').forEach(btn => {
    btn.classList.toggle('mode-btn--active', btn.dataset.modo === modo);
  });
  _renderGrid();
  _mostrarEstado('grid');
}

/* ══════════════════════════════════════════════
   ESTADOS DA UI
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   HERO STATS
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   GRID
══════════════════════════════════════════════ */
function _renderGrid() {
  const grid = document.getElementById('resumos-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (State.modo === 'professor') {
    if (State.professor.length) grid.appendChild(_criarCardProfessor(State.professor[0]));
    return;
  }

  State.aulas.forEach((aula, idx) => {
    const card = State.modo === 'sintese'
      ? _criarCardSintese(aula, idx)
      : _criarCard(aula, idx);
    grid.appendChild(card);
  });
}

/* ══════════════════════════════════════════════
   CARDS
══════════════════════════════════════════════ */
function _criarCard(aula, idx) {
  const secoes  = aula.secoes ?? [];
  const aulaStr = _esc(aula.aula ?? '');
  const m       = aulaStr.match(/^(Aula\s*[\d\/]+)\s*[—–-]\s*(.+)$/i);
  const aulaNum = m ? m[1] : aulaStr;
  const aulaTit = m ? m[2] : '';

  const card = document.createElement('article');
  card.className = 'resumo-card resumo-card--nota';
  card.style.animationDelay = `${idx * 0.06}s`;
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Abrir: ${aula.aula}`);
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-num">${aulaNum}</div>
      <div class="card-title">${aulaTit || aulaStr}</div>
      <div class="card-divider"></div>
      ${aula.ideia_central ? `<p class="card-desc">${_parseInline(aula.ideia_central)}</p>` : ''}
      <div class="card-bottom">
        <div class="card-progress__track"><div class="card-progress__fill"></div></div>
        <div class="card-meta">
          <span class="card-meta__count">${secoes.length} seç${secoes.length !== 1 ? 'ões' : 'ão'}</span>
          <span class="card-meta__cta">
            Ver resumo
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
    </div>`;
  card.addEventListener('click', () => _abrirModal(aula));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _abrirModal(aula); } });
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

  const card = document.createElement('article');
  card.className = 'resumo-card resumo-card--nota resumo-card--sintese';
  card.style.animationDelay = `${idx * 0.06}s`;
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Síntese: ${aula.aula}`);
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-num-row">
        <div class="card-num">${aulaNum}</div>
        <span class="sint-badge">${temSint ? 'Síntese' : 'Sem síntese'}</span>
      </div>
      <div class="card-title">${aulaTit || aulaStr}</div>
      <div class="card-divider"></div>
      ${preview
        ? `<p class="card-desc">${_parseInline(preview)}</p>`
        : `<p class="card-desc" style="font-style:italic;opacity:0.55">Síntese não disponível ainda.</p>`}
      <div class="card-bottom">
        <div class="card-progress__track"><div class="card-progress__fill"></div></div>
        <div class="card-meta">
          <span class="card-meta__count">${temSint ? `${numSec} seç${numSec !== 1 ? 'ões' : 'ão'}` : '—'}</span>
          ${temSint ? `
          <span class="card-meta__cta">
            Ver síntese
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
            </svg>
          </span>` : ''}
        </div>
      </div>
    </div>`;
  card.addEventListener('click', () => { if (temSint) _abrirModal(sint); });
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (temSint) _abrirModal(sint); } });
  return card;
}

function _criarCardProfessor(prof) {
  const secoes = prof.secoes ?? [];
  const card = document.createElement('article');
  card.className = 'resumo-card resumo-card--nota';
  card.style.animationDelay = '0s';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', 'Abrir: Resumo do Professor');
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-num">📋 Professor</div>
      <div class="card-title">${_esc(prof.aula ?? 'Resumo do Professor')}</div>
      <div class="card-divider"></div>
      ${prof.ideia_central ? `<p class="card-desc">${_parseInline(prof.ideia_central)}</p>` : ''}
      <div class="card-bottom">
        <div class="card-progress__track"><div class="card-progress__fill"></div></div>
        <div class="card-meta">
          <span class="card-meta__count">${secoes.length} seç${secoes.length !== 1 ? 'ões' : 'ão'}</span>
          <span class="card-meta__cta">
            Ver resumo
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
    </div>`;
  card.addEventListener('click', () => _abrirModal(prof));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _abrirModal(prof); } });
  return card;
}

/* ══════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════ */
function _bindModal() {
  document.getElementById('read-modal-overlay')?.addEventListener('click', _fecharModal);
  document.getElementById('read-modal-close')?.addEventListener('click', _fecharModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') _fecharModal(); });
}

function _abrirModal(aula) {
  document.getElementById('rm-aula-label').textContent = aula.aula ?? '';
  const badge = document.getElementById('rm-tipo-badge');
  badge.textContent = 'Resumo';
  badge.className   = 'read-modal__badge badge--conceito';
  document.getElementById('rm-body').innerHTML = _buildModalBody(aula);
  document.getElementById('read-modal').classList.add('read-modal--open');
  document.body.style.overflow = 'hidden';
  document.getElementById('read-modal-panel')?.focus();
  _bindModalTabs();
}

function _fecharModal() {
  document.getElementById('read-modal')?.classList.remove('read-modal--open');
  document.body.style.overflow = '';
}

function _buildModalBody(aula) {
  const secoes = aula.secoes ?? [];
  let html = '';
  if (aula.ideia_central) {
    html += `<div class="rm-ideia-central">
      <span class="rm-ideia-icon">💡</span>
      <span>${_parseInline(aula.ideia_central)}</span>
    </div>`;
  }
  if (secoes.length > 1) {
    html += `<div class="rm-tabs" id="rm-tabs">
      ${secoes.map((s, i) => `<button class="rm-tab${i === 0 ? ' rm-tab--active' : ''}" data-sec="${i}">${s.titulo}</button>`).join('')}
    </div>`;
  }
  secoes.forEach((sec, i) => {
    html += `<div class="rm-secao${i === 0 ? ' rm-secao--active' : ''}" data-sec="${i}">
      <h3 class="rm-secao-titulo">${_esc(sec.titulo)}</h3>
      ${(sec.blocos ?? []).map(b => _renderBloco(b)).join('')}
    </div>`;
  });
  return html;
}

function _bindModalTabs() {
  document.getElementById('rm-tabs')?.addEventListener('click', e => {
    const btn = e.target.closest('.rm-tab');
    if (!btn) return;
    const idx = parseInt(btn.dataset.sec);
    document.querySelectorAll('.rm-tab').forEach(b => b.classList.remove('rm-tab--active'));
    document.querySelectorAll('.rm-secao').forEach(s => s.classList.remove('rm-secao--active'));
    btn.classList.add('rm-tab--active');
    document.querySelector(`.rm-secao[data-sec="${idx}"]`)?.classList.add('rm-secao--active');
  });
}

/* ══════════════════════════════════════════════
   RENDERIZADOR DE BLOCOS
══════════════════════════════════════════════ */
function _renderBloco(b) {
  switch (b.tipo) {
    case 'topico': {
      const [ano] = (State.semestre ?? '2026.1').split('.');
      const imgBase = `conteudo/${ano}/${State.semestre}/`;
      let html = `<div class="rm-topico">`;
      html += `<div class="rm-topico__titulo">${_parseInline(b.titulo ?? '')}</div>`;
      if (b.texto)  html += `<p class="rm-topico__texto">${_parseInline(b.texto)}</p>`;
      if (b.imagem) html += `
        <figure class="rm-topico__fig">
          <img class="rm-topico__img" src="${_esc(imgBase + b.imagem.src)}" alt="${_esc(b.imagem.alt)}" loading="lazy" />
          <figcaption class="rm-topico__fig-caption">${_esc(b.imagem.alt)}</figcaption>
        </figure>`;
      if (b.lista)  html += `<ul class="rm-lista">${b.lista.map(i => `<li><span>${_parseInline(i)}</span></li>`).join('')}</ul>`;
      if (b.codigo) html += `<pre class="rm-codigo"><code>${_esc(b.codigo)}</code></pre>`;
      html += `</div>`;
      return html;
    }
    case 'lista': {
      let html = '';
      if (b.titulo) html += `<p class="rm-lista-titulo">${_parseInline(b.titulo)}</p>`;
      html += `<ul class="rm-lista">${(b.itens ?? []).map(i => `<li><span>${_parseInline(i)}</span></li>`).join('')}</ul>`;
      return html;
    }
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
            <tbody>${rows.map(r => `<tr>${r.map(c => `<td><code>${_esc(c)}</code></td>`).join('')}</tr>`).join('')}</tbody>
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

/* ══════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════ */
function _renderSidebar() {
  const semLabel = document.getElementById('sidebar-semestre');
  if (semLabel) semLabel.textContent = State.semestre ?? '—';

  const list = document.getElementById('disc-list');
  if (!list) return;
  list.innerHTML = '';

  if (!State.disciplinas.length) {
    list.innerHTML = `
      <div style="padding:1.5rem 0.75rem;text-align:center;color:var(--text-3);font-size:0.72rem;letter-spacing:0.06em;line-height:1.7;">
        <div style="font-size:1.4rem;margin-bottom:0.5rem;">📭</div>
        Nenhuma disciplina<br>neste semestre
      </div>`;
    _mostrarEstado('no-content');
    return;
  }

  State.disciplinas.forEach(disc => {
    const isAtivo = disc.id === State.disciplina?.id;
    const item    = document.createElement('button');
    item.className      = `disc-item${isAtivo ? ' disc-item--active' : ''}`;
    item.dataset.discId = disc.id;
    item.setAttribute('aria-current', isAtivo ? 'page' : 'false');
    item.title = disc.nome;
    item.innerHTML = `
      <span class="disc-item__emoji">${disc.emoji}</span>
      <span class="disc-item__info">
        <span class="disc-item__nome">${disc.nome}</span>
        <span class="disc-item__status disc-item__status--hint" id="disc-status-${disc.id}">Clique</span>
      </span>
      <svg class="disc-item__chevron" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>`;
    item.addEventListener('click', () => _trocarDisciplina(disc));
    list.appendChild(item);
  });
}

function _atualizarSidebarAtivo(discId) {
  document.querySelectorAll('.disc-item').forEach(el => {
    const a = el.dataset.discId === discId;
    el.classList.toggle('disc-item--active', a);
    el.setAttribute('aria-current', a ? 'page' : 'false');
  });
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
  State.disciplina   = disc;
  State.temConteudo  = null;
  State.aulas        = [];
  State.simplificado = [];
  State.professor    = [];
  State.modo         = 'completo';
  setDisciplina(disc.id);

  sincronizarSemNaURL(State.semestre, 'push'); // push = cria entrada no histórico
const url = new URL(window.location.href);
url.searchParams.set('disc', disc.id);
window.history.pushState({}, '', url);

  _atualizarSidebarAtivo(disc.id);
  _renderHeader();
  _fecharMobileDropdown();
  aplicarCoresDisciplina(disc.arquivo, State.DISC_CORES);
  _carregarConteudo();
}

/* ══════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════ */
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

  const ml = document.getElementById('mobile-disc-label');
  if (ml) ml.textContent = disc ? `${disc.emoji} ${disc.apelido ?? _nomeCurto(disc.nome, 20)}` : 'Disciplina';

  document.title = disc ? `Resumos — ${disc.nome} · Nexus Study` : 'Resumos · Nexus Study';
  _atualizarStatusBadge();
}

function _nomeCurto(nome, max = 18) {
  return nome.length > max ? nome.slice(0, max - 2) + '…' : nome;
}

/* ══════════════════════════════════════════════
   MOBILE DROPDOWN
══════════════════════════════════════════════ */
function _bindMobileDropdown() {
  document.getElementById('mobile-disc-btn')?.addEventListener('click', _abrirMobileDropdown);
  document.getElementById('mobile-dropdown-backdrop')?.addEventListener('click', _fecharMobileDropdown);
}

function _abrirMobileDropdown() {
  const dd   = document.getElementById('mobile-dropdown');
  const list = document.getElementById('mobile-dropdown-list');
  if (!dd || !list) return;
  list.innerHTML = '';
  State.disciplinas.forEach(disc => {
    const isAtivo = disc.id === State.disciplina?.id;
    const btn = document.createElement('button');
    btn.className = `disc-item${isAtivo ? ' disc-item--active' : ''}`;
    btn.innerHTML = `
      <span class="disc-item__emoji">${disc.emoji}</span>
      <span class="disc-item__info"><span class="disc-item__nome">${disc.nome}</span></span>`;
    btn.addEventListener('click', () => _trocarDisciplina(disc));
    list.appendChild(btn);
  });
  dd.classList.add('mobile-dropdown--open');
  document.body.style.overflow = 'hidden';
}

function _fecharMobileDropdown() {
  document.getElementById('mobile-dropdown')?.classList.remove('mobile-dropdown--open');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════
   UTILITÁRIOS
══════════════════════════════════════════════ */
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