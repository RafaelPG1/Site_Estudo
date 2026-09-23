/* =============================================
   NEXUS STUDY — resumo/js/resumo-reader.js
   Tudo relacionado ao modo de leitura (reader):
   índice de seções (TOC), sistema de scroll-spy +
   navegação programática, persistência do accordion,
   construção do corpo do reader, abrir/fechar o
   modal e copiar aula para clipboard.
   ============================================= */

import { parseSemestre } from '../../src/global.js';
import { playSound } from '../../shared/js/audio/audio-api.js';
import { State, esc, parseInline, smoothScrollTo } from './resumo-utils.js';

/* Instância ativa do sistema de leitura (scroll-spy + navegação
   programática) — ver initReadingScrollSystem. Usada só dentro deste
   módulo (buildTOC lê para navegar, abrirModal/abrirModalResumao/
   fecharModal criam e limpam), por isso fica local aqui em vez de
   exportada como estado global. */
let _readerScroll = null;

/* ══════════════════════════════════════════════
   TOC — ÍNDICE DE SEÇÕES
══════════════════════════════════════════════ */
export function buildTOC(secoes) {
  const items = (secoes ?? []).map((sec, i) => `
    <li class="rm-toc__item" data-sec="${i}">
      <button class="rm-toc__link" data-sec="${i}">
        <span class="rm-toc__num">${String(i + 1).padStart(2, '0')}</span>
        <span class="rm-toc__title">${esc(sec.titulo)}</span>
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

export function bindTocChrome() {
  document.getElementById('rm-toc-trigger')?.addEventListener('click', () => {
    playSound('click', 'resumos');
    _abrirTocSheet();
  });
  document.getElementById('rm-toc-sheet-backdrop')?.addEventListener('click', _fecharTocSheet);
  document.getElementById('rm-toc-top')?.addEventListener('click', () => {
    playSound('click', 'resumos');
    document.getElementById('read-modal-panel')?.classList.remove('reader__bar--compact');
    smoothScrollTo(document.getElementById('rm-body-wrapper'), 0);
  });
  document.getElementById('rm-toc-collapse-all')?.addEventListener('click', _collapseAllSections);
  document.getElementById('rm-toc-collapse-all-mobile')?.addEventListener('click', _collapseAllSections);
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
   fixo, ver smoothScrollTo). Enquanto isso, update()
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

  // Escolhe a seção com maior ÁREA VISÍVEL dentro do viewport do
  // container de leitura (interseção do retângulo da seção com o
  // retângulo do scroll), não a "primeira que cruzou uma linha" —
  // é o que faz uma seção que domina a tela vencer uma que só
  // aparece numa fatia no topo/fim do viewport.
  function recomputeActiveFromPosition() {
    const sections = getSections();
    if (!sections.length) return;

    const viewTop    = scrollEl.getBoundingClientRect().top;
    const viewBottom = scrollEl.getBoundingClientRect().bottom;

    const visibilities = sections.map(sec => {
      const r = sec.getBoundingClientRect();
      const visibleTop    = Math.max(r.top, viewTop);
      const visibleBottom = Math.min(r.bottom, viewBottom);
      return Math.max(0, visibleBottom - visibleTop);
    });

    let bestIdx = 0;
    let bestVisible = -1;
    visibilities.forEach((v, i) => {
      if (v > bestVisible) { bestVisible = v; bestIdx = i; }
    });

    // Histerese: só troca de seção ativa quando a candidata tem
    // presença visual claramente maior (>=15%) que a seção ativa
    // atual — evita a sidebar "piscando" entre duas seções durante
    // a transição de rolagem, quando as áreas visíveis ficam
    // próximas uma da outra.
    if (activeIdx !== -1 && bestIdx !== activeIdx) {
      const currentVisible = visibilities[activeIdx] ?? 0;
      if (bestVisible < currentVisible * 1.15) return;
    }

    setActive(bestIdx);
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

    stopCurrentScroll = smoothScrollTo(scrollEl, Math.max(0, targetTop), {
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

/* ══════════════════════════════════════════════
   ACCORDION — persistência do estado das seções
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   CORPO DO READER — hero + seções + blocos
══════════════════════════════════════════════ */
function _buildReaderBody(aula, idx) {
  const secoes  = aula.secoes ?? [];
  const aulaStr = aula.aula ?? '';
  const m       = aulaStr.match(/^(Aula\s*[\d\/]+)\s*[—–-]\s*(.+)$/i);
  const aulaNum = m ? m[1] : aulaStr;
  const aulaTit = m ? m[2] : '';
  // Fallback: quando o título não traz "Aula N —" (regex não casa),
  // usa a posição real da aula na lista (idx) em vez de deixar o
  // número grande simplesmente sumir. Number.isInteger(idx) cobre o
  // caso de _buildReaderBody ser chamado sem idx (compatibilidade).
  const aulaNumero = aulaNum.replace(/\D/g, '') || (Number.isInteger(idx) ? String(idx + 1) : '');

  // Título do resumo — conteúdo principal desta tela.
  const tituloResumo = aulaTit || aulaStr;
  // Disciplina — o contexto. Vem direto do estado real da aplicação
  // (State.disciplina), nunca hardcoded: se a disciplina mudar, o
  // eyebrow muda junto.
  const discNome = State.disciplina?.nome ?? '';
  // "Aula N" deixou de ser o eyebrow (isso duplicava o título quando
  // o dado não tinha o prefixo "Aula N — "). Quando é informação real
  // e distinta do título, vira um chip de metadado junto de "seções"
  // e "professor" — não mais um segundo título competindo com o
  // principal.
  const aulaNumLabel = (aulaNum && aulaNum !== tituloResumo) ? aulaNum : null;

  let html = `
    <div class="reader__hero">
      ${aulaNumero ? `<div class="reader__hero-number">${esc(aulaNumero)}</div>` : ''}
      ${discNome ? `<div class="reader__hero-eyebrow">${esc(discNome)}</div>` : ''}
      <h1 class="reader__hero-title">${esc(tituloResumo)}</h1>
      <div class="hero-divider"></div>
      <div class="reader__hero-meta">
        ${aulaNumLabel ? `<span class="reader__hero-chip reader__hero-chip--num">${esc(aulaNumLabel)}</span>` : ''}
        <span class="reader__hero-chip">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          ${secoes.length} seç${secoes.length !== 1 ? 'ões' : 'ão'}
        </span>
        ${aula.professor ? `<span class="reader__hero-chip">👤 ${esc(aula.professor)}</span>` : ''}
      </div>
    </div>`;

  if (aula.ideia_central) {
    html += `<div class="reader__ideia rm-ideia-central">
      <span class="rm-ideia-icon">💡</span>
      <span>${parseInline(aula.ideia_central)}</span>
    </div>`;
  }

  secoes.forEach((sec, i) => {
    html += `
      <div class="rm-collapse" data-sec="${i}">
        <button class="rm-collapse__trigger" aria-expanded="false">
          <span class="rm-collapse__icon">${String(i + 1).padStart(2,'0')}</span>
          <span style="flex:1;text-align:left;font-size:0.9rem;font-weight:600;color:inherit;line-height:1.35">${esc(sec.titulo)}</span>
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
      html += `<div class="rm-topico__titulo">${parseInline(b.titulo ?? '')}</div>`;
      if (b.texto)  html += `<p class="rm-topico__texto">${parseInline(b.texto)}</p>`;
      if (b.imagem) html += `
        <figure class="rm-topico__fig">
          <img class="rm-topico__img" src="${esc(base + b.imagem.src)}" alt="${esc(b.imagem.alt)}" loading="lazy" />
          <figcaption class="rm-topico__fig-caption">${esc(b.imagem.alt)}</figcaption>
        </figure>`;
      if (b.lista)  html += `<ul class="rm-lista">${b.lista.map(i => `<li><span>${parseInline(i)}</span></li>`).join('')}</ul>`;
      if (b.codigo) html += `<pre class="rm-codigo"><code>${esc(b.codigo)}</code></pre>`;
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
          ${num}
          <img class="rm-fig__img" src="${esc(base + b.src)}" alt="${esc(b.alt ?? '')}" loading="lazy" />
          <figcaption class="rm-fig__caption"><span class="rm-fig__caption-text">${esc(b.alt ?? '')}</span></figcaption>
        </figure>`;
    }
    case 'lista': {
      let html = '';
      if (b.titulo) html += `<p class="rm-lista-titulo">${parseInline(b.titulo)}</p>`;
      html += `<ul class="rm-lista">${(b.itens ?? []).map(i => `<li><span>${parseInline(i)}</span></li>`).join('')}</ul>`;
      return html;
    }
    case 'texto':
      return `<p class="rm-topico__texto" style="margin-bottom:0.85rem">${parseInline(b.texto ?? '')}</p>`;
    case 'subtitulo':
      return `<div class="rm-subtitulo">${parseInline(b.texto ?? '')}</div>`;
    case 'exemplo':
      return `<div class="rm-exemplo">
        <p class="rm-exemplo__texto">${parseInline(b.texto ?? '')}</p>
        ${b.detalhe ? `<span class="rm-exemplo__detalhe">${parseInline(b.detalhe)}</span>` : ''}
        <div class="rm-exemplo__titulo">${esc(b.titulo ?? '')}</div>
      </div>`;
    case 'tabela': {
      const cols = b.colunas ?? [];
      const rows = b.linhas  ?? [];
      return `
        ${b.titulo ? `<div class="rm-topico__titulo">${parseInline(b.titulo)}</div>` : ''}
        <div class="rm-tabela-wrap">
          <table class="rm-tabela">
            <thead><tr>${cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
            <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${parseInline(c)}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>`;
    }
    case 'codigo':
      return `<pre class="rm-codigo"><code>${esc(b.codigo ?? '')}</code></pre>`;
    case 'destaque':
      return `<div class="rm-destaque">${parseInline(b.texto ?? '')}</div>`;
    case 'citacao':
      return `<div class="rm-citacao"><span class="rm-citacao__texto">${parseInline(b.texto ?? '')}</span>${b.autor ? `<span class="rm-citacao__autor">${parseInline(b.autor)}</span>` : ''}</div>`;
    default:
      return '';
  }
}

/* ══════════════════════════════════════════════
   MODAL — abrir/fechar o modo de leitura
══════════════════════════════════════════════ */
export function abrirModalResumao(res, idx) {
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
  if (body) body.innerHTML = _buildReaderBody(res, idx);

  const _accordionKey = _storageKeyAccordion((res.aula ?? String(Date.now())) + '__resumao');
  _bindReaderAccordion(_accordionKey);
  buildTOC(res.secoes ?? []);

  document.getElementById('read-modal').classList.add('read-modal--open');
  document.body.style.overflow = 'hidden';
  document.getElementById('read-modal-panel')?.focus();

  _readerScroll?.cleanup();
  const scrollEl = document.getElementById('rm-body-wrapper');
  _readerScroll = _initReadingScrollSystem(scrollEl);
}

export function abrirModalProfessor(prof, idx) {
  playSound('click', 'resumos');
  playSound('openModal', 'resumos');

  // Mesma lógica de abrirModal/abrirModalResumao (ver comentário lá).
  document.body.classList.add('reader-open');

  const discLabel = document.getElementById('rm-disc-label');
  if (discLabel) discLabel.textContent = State.disciplina?.nome ?? '';

  const aulaLabel = document.getElementById('rm-aula-label');
  if (aulaLabel) aulaLabel.textContent = prof.aula ?? '';

  const badge = document.getElementById('rm-tipo-badge');
  if (badge) {
    badge.textContent = 'Nota do Professor';
    badge.className   = 'reader__bar-badge badge--professor';
  }

  const body = document.getElementById('rm-body');
  if (body) body.innerHTML = _buildReaderBody(prof, idx);

  const _accordionKey = _storageKeyAccordion((prof.aula ?? String(Date.now())) + '__professor');
  _bindReaderAccordion(_accordionKey);
  buildTOC(prof.secoes ?? []);

  document.getElementById('read-modal').classList.add('read-modal--open');
  document.body.style.overflow = 'hidden';
  document.getElementById('read-modal-panel')?.focus();

  _readerScroll?.cleanup();
  const scrollEl = document.getElementById('rm-body-wrapper');
  _readerScroll = _initReadingScrollSystem(scrollEl);
}

export function bindModal() {
  document.getElementById('read-modal-close')?.addEventListener('click', () => {
    playSound('closeModal', 'resumos');
    fecharModal();
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
      fecharModal();
    }
  });
}

export function fecharModal() {
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

export function buildModalBody(aula, idx) { return _buildReaderBody(aula, idx); }
export function ativarSecao() {}

export function abrirModal(aula, idx) {
  playSound('click', 'resumos');
  playSound('openModal', 'resumos');

  // Modo de leitura aberto: mesma lógica de abrirModalResumao acima
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
  if (body) body.innerHTML = _buildReaderBody(aula, idx);

  const _accordionKey = _storageKeyAccordion(aula.aula ?? aula.id ?? String(Date.now()));
  _bindReaderAccordion(_accordionKey);
  buildTOC(aula.secoes ?? []);

  document.getElementById('read-modal').classList.add('read-modal--open');
  document.body.style.overflow = 'hidden';
  document.getElementById('read-modal-panel')?.focus();

  _readerScroll?.cleanup();
  const scrollEl = document.getElementById('rm-body-wrapper');
  _readerScroll = _initReadingScrollSystem(scrollEl);
}

/* ══════════════════════════════════════════════
   COPIAR AULA INTEIRA — extrai só o texto real do
   conteúdo (#rm-body), nunca sidebar/header/índice/
   botões. Pseudo-elementos (::before/::after) nunca
   entram aqui porque não existem no DOM. Ícones
   decorativos com texto real (chip de número da
   seção, emoji da ideia central) são removidos
   explicitamente antes de extrair o texto.
══════════════════════════════════════════════ */
function _cleanInlineText(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('svg, .rm-collapse__icon, .rm-ideia-icon').forEach(n => n.remove());
  return clone.textContent.replace(/\s+/g, ' ').trim();
}

function _extractAulaText() {
  const root = document.getElementById('rm-body');
  if (!root) return '';

  const SELECTOR = [
    '.reader__hero-eyebrow', '.reader__hero-title', '.reader__hero-chip',
    '.rm-ideia-central',
    '.rm-collapse__trigger',
    '.rm-subtitulo',
    '.rm-topico__titulo', '.rm-topico__texto', '.rm-topico__fig-caption',
    '.rm-lista-titulo', '.rm-lista li',
    '.rm-exemplo__titulo', '.rm-exemplo__texto', '.rm-exemplo__detalhe',
    '.rm-destaque',
    '.rm-citacao__texto', '.rm-citacao__autor',
    '.rm-fig__num', '.rm-fig__caption-text',
    '.rm-codigo code',
    '.rm-tabela',
  ].join(', ');

  const linhas = [];
  root.querySelectorAll(SELECTOR).forEach(el => {
    if (el.tagName === 'CODE') {
      const codigo = el.textContent.replace(/\n+$/, '');
      if (codigo.trim()) linhas.push(codigo);
      return;
    }
    if (el.classList.contains('rm-tabela')) {
      const rows = Array.from(el.querySelectorAll('tr'))
        .map(tr => Array.from(tr.children).map(c => _cleanInlineText(c)).join(' | '));
      if (rows.length) linhas.push(rows.join('\n'));
      return;
    }
    if (el.classList.contains('rm-collapse__trigger')) {
      const texto = _cleanInlineText(el);
      if (texto) linhas.push(`## ${texto}`);
      return;
    }
    if (el.classList.contains('reader__hero-title')) {
      const texto = _cleanInlineText(el);
      if (texto) linhas.push(`# ${texto}`);
      return;
    }
    const texto = _cleanInlineText(el);
    if (texto) linhas.push(texto);
  });

  return linhas.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}

async function _copiarParaClipboard(texto) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch (_) { /* segue pro fallback abaixo */ }
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = texto;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch (_) {
    return false;
  }
}

export function bindCopyButton() {
  const btn   = document.getElementById('rm-copy-btn');
  const label = document.getElementById('rm-copy-btn-label');
  if (!btn || !label) return;

  let resetTimer = null;

  btn.addEventListener('click', async () => {
    playSound('click', 'resumos');
    const texto = _extractAulaText();
    if (!texto) return;

    const ok = await _copiarParaClipboard(texto);
    clearTimeout(resetTimer);

    btn.classList.toggle('reader__copy-btn--done', ok);
    label.textContent = ok ? '✓ Aula copiada' : 'Não foi possível copiar';

    resetTimer = setTimeout(() => {
      btn.classList.remove('reader__copy-btn--done');
      label.textContent = 'Copiar aula';
    }, 2200);
  });
}