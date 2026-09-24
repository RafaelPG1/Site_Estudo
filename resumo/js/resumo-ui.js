/* =============================================
   NEXUS STUDY — resumo/js/resumo-ui.js
   Renderização e interface da tela de listagem:
   header, sidebar, faixa de vídeos, estados vazios/
   loading, modo de leitura (completo/síntese/
   resumão), cards do grid e carregamento de
   conteúdo de uma disciplina.
   ============================================= */

import { resolveIcone, parseSemestre } from '../../src/global.js';
import { playSound } from '../../shared/js/audio/audio-api.js';
import { State, esc, parseInline } from './resumo-utils.js';
import { abrirModal, abrirModalResumao, abrirModalProfessor } from './resumo-reader.js';
import { renderExtra, temExtra } from './resumo-extra.js';

/* ══════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════ */
export function atualizarStatusBadge() {
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

export function renderHeader() {
  const disc = State.disciplina;

  const bc = document.getElementById('header-breadcrumb');
  if (bc) bc.innerHTML = disc ? `Resumos <span>· ${disc.nome}</span>` : 'Resumos';

  const badge = document.getElementById('disc-badge');
  if (badge) {
    if (disc && State.disciplinas.length > 0) {
      const label = disc.apelido ?? disc.nome;
      badge.style.display = '';
      badge.innerHTML = `
        <span style="flex-shrink:0">${resolveIcone(disc.icone)}</span>
        <span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;min-width:0">${label}</span>`;
    } else {
      badge.style.display = 'none';
      badge.innerHTML = '';
    }
  }

  const ey = document.getElementById('hero-eyebrow-text');
  if (ey) ey.textContent = disc?.nome ?? 'Resumos';

  document.title = disc ? `Resumos — ${disc.nome} · Nexus Study` : 'Resumos · Nexus Study';
  atualizarStatusBadge();
}

/* ══════════════════════════════════════════════
   SIDEBAR — lista de disciplinas
══════════════════════════════════════════════ */
export function renderSidebar(onSelect) {
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
    // Cor própria de CADA disciplina da lista — não a --cor-tema
    // global (essa reflete só a disciplina ativa). Sobrescrita local
    // via inline style para o SVG do ícone (var(--cor-tema,...))
    // resolver para a cor certa item a item.
    const corIcone = State.DISC_CORES?.[disc.arquivo]?.corTema ?? null;
    return `
      <button class="disc-item${ativo ? ' disc-item--active' : ''}"
              data-disc-id="${esc(disc.id)}"
              aria-current="${ativo ? 'page' : 'false'}"
              title="${esc(disc.nome)}">
        <span class="disc-item__emoji"${corIcone ? ` style="--cor-tema:${corIcone}"` : ''}>${disc.icone ? resolveIcone(disc.icone) : ''}</span>
        <span class="disc-item__info">
          <span class="disc-item__nome">${esc(label)}</span>
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
      onSelect?.(disc);
    });
  });
}

/* ══════════════════════════════════════════════
   VÍDEOS DAS AULAS
══════════════════════════════════════════════ */
export function renderVideosSection() {
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
  if (!disc || !State.getVideos) { el.style.display = 'none'; el.dataset.temVideos = ''; return; }

  const videos = State.getVideos(State.semestre, disc.id);
  if (!videos.length) { el.style.display = 'none'; el.dataset.temVideos = ''; return; }

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
      <a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer" class="${cls}">
        <div class="vchip__top">
          <span class="vchip__play">${playIcon}</span>
          <span class="vchip__badge ${badgeClass}">${badgeText}</span>
        </div>
        <span class="vchip__label">${esc(v.label)}</span>
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

  el.dataset.temVideos = '1';
  // A visibilidade real (mostrar/escoder) fica com mostrarEstado(): a
  // strip existe ('temVideos'), mas some enquanto o modo Extra estiver
  // ativo, pra não duplicar visualmente a categoria "Vídeos" do Extra
  // (ver CATEGORIAS em resumo-extra.js). Fora do modo Extra, continua
  // exatamente como antes.
  el.style.display = State.modo === 'extra' ? 'none' : '';
}

/* ══════════════════════════════════════════════
   ESTADOS VISUAIS — loading/sem conteúdo/vazio/grid
══════════════════════════════════════════════ */
export function mostrarEstado(estado) {
  document.getElementById('state-loading').style.display    = estado === 'loading'    ? 'flex' : 'none';
  document.getElementById('state-no-content').style.display = estado === 'no-content' ? 'flex' : 'none';
  document.getElementById('state-empty').style.display      = estado === 'empty'      ? 'flex' : 'none';
  document.getElementById('resumos-grid').style.display     = estado === 'grid'       ? 'grid' : 'none';
  // Modo Extra: central de recursos (js/resumo-extra.js) — container próprio, fora do grid de aulas.
  const extraEl = document.getElementById('extra-panel');
  if (extraEl) extraEl.style.display                        = estado === 'extra'      ? ''     : 'none';

  // "Vídeos das Aulas" (strip antiga, js/resumo-ui.js#renderVideosSection)
  // fica FORA de #main-content, então não é substituída pelo grid/extra
  // acima — sem isso ela continuaria visível por cima do modo Extra,
  // duplicando a categoria "Vídeos" que o Extra já mostra (ver
  // CATEGORIAS em resumo-extra.js). Some só enquanto o Extra estiver
  // aberto; nos outros modos, volta a aparecer exatamente como antes
  // (dataset.temVideos é setado por renderVideosSection).
  const videosEl = document.getElementById('videos-section');
  if (videosEl) videosEl.style.display = (estado === 'extra' || videosEl.dataset.temVideos !== '1') ? 'none' : '';
}

export function mostrarEstadoSemConteudo() {
  const disc = State.disciplina;
  const eEl  = document.getElementById('state-disc-emoji');
  const nEl  = document.getElementById('state-disc-name');
  if (eEl) eEl.innerHTML = disc?.icone ? resolveIcone(disc.icone) : '';
  if (nEl) nEl.textContent  = disc?.nome  ?? '';
  mostrarEstado('no-content');
}

/* ══════════════════════════════════════════════
   MODO DE LEITURA — completo/síntese/resumão/professor
   Os modos são escolhidos SOMENTE pela sidebar ("Tipo de
   Conteúdo"); a área principal não os exibe mais — ela é
   dedicada à busca (ver resumo-busca.js).
══════════════════════════════════════════════ */
function _temSimplificado() { return State.simplificado.length > 0; }
function _temResumao()      { return State.resumao.length > 0; }
function _temProfessor()    { return State.professor.length > 0; }

/* Mantém a UI alinhada a State.modo: destaque do botão na sidebar e a
   classe do <body> usada pelo CSS do modo Extra. Também é chamada ao
   carregar uma disciplina (State.modo volta para 'completo' — sem isso o
   botão da sidebar continuava destacado no modo anterior). */
function _sincronizarModoUI() {
  document.querySelectorAll('[data-modo]').forEach(btn => {
    btn.classList.toggle('mode-btn--active', btn.dataset.modo === State.modo);
  });
  document.body.classList.toggle('modo-extra', State.modo === 'extra');
}

export function setModo(modo) {
  if (State.modo === modo) return;
  playSound('select', 'resumos');
  State.modo = modo;
  _sincronizarModoUI();
  renderProfessorSidebar();   // o filtro de professor não se aplica ao Extra
  renderGrid();
}

/* ══════════════════════════════════════════════
   SIDEBAR — Tipo de Conteúdo (Resumo/Resumão/Síntese)
   Mesmo critério de disponibilidade do toggle do topo
   (_temSimplificado/_temResumao): some o botão de um
   modo que a disciplina não tem, e some a seção inteira
   quando sobra só 1 modo (nada para alternar).
══════════════════════════════════════════════ */
function _atualizarModoSidebar() {
  const nav    = document.getElementById('modo-list');
  const header = document.getElementById('modo-header');
  if (!nav || !header) return;

  const disponibilidade = {
    completo:  State.aulas.length > 0,
    resumao:   _temResumao(),
    sintese:   _temSimplificado(),
    professor: _temProfessor(),
    extra:     temExtra(),
  };

  let visiveis = 0;
  nav.querySelectorAll('[data-modo]').forEach(btn => {
    const ok = !!disponibilidade[btn.dataset.modo];
    btn.classList.toggle('disc-item--hidden', !ok);
    if (ok) visiveis++;
  });

  const mostrarSecao = visiveis > 1;
  header.style.display = mostrarSecao ? '' : 'none';
  nav.style.display    = mostrarSecao ? '' : 'none';
}

/* ══════════════════════════════════════════════
   SIDEBAR — Professor
   Mesma estrutura visual do "Tipo de Conteúdo"
   (.disc-list--modo), só que montada dinamicamente: os
   botões são os professores distintos encontrados em
   State.aulas (campo aula.professor — mesmo campo já
   usado no chip do card, ver _profChip). Some a seção
   inteira quando a disciplina tem só um professor (ou
   nenhum), mesma lógica do "só 1 modo" acima.
══════════════════════════════════════════════ */
const _PROF_ICONES = { Bruno: '🧑‍🏫', Wagner: '👨‍💻', Raul: '📐' };

function _professoresDisponiveis() {
  return [...new Set(State.aulas.map(a => a.professor).filter(Boolean))];
}

export function renderProfessorSidebar() {
  const nav    = document.getElementById('professor-list');
  const header = document.getElementById('professor-header');
  if (!nav || !header) return;

  const professores = _professoresDisponiveis();

  if (professores.length <= 1) {
    header.style.display  = 'none';
    nav.style.display     = 'none';
    nav.innerHTML          = '';
    State.professorFiltro = null;
    return;
  }

  // Em "Extra" não há aulas na tela, então o filtro de professor fica
  // oculto (sem perder o filtro escolhido — ele volta nos outros modos).
  const oculto = State.modo === 'extra';
  header.style.display = oculto ? 'none' : '';
  nav.style.display    = oculto ? 'none' : '';

  const btnTodos = `
    <button class="disc-item${State.professorFiltro === null ? ' mode-btn--active' : ''}" data-professor="" type="button">
      <span class="disc-item__emoji">👥</span>
      <span class="disc-item__info">
        <span class="disc-item__nome">Todos</span>
      </span>
    </button>`;

  const btnsProf = professores.map(nome => {
    const ativo = State.professorFiltro === nome;
    const icone = _PROF_ICONES[nome] ?? '👤';
    return `
      <button class="disc-item${ativo ? ' mode-btn--active' : ''}" data-professor="${esc(nome)}" type="button">
        <span class="disc-item__emoji">${icone}</span>
        <span class="disc-item__info">
          <span class="disc-item__nome">${esc(nome)}</span>
        </span>
      </button>`;
  }).join('');

  nav.innerHTML = btnTodos + btnsProf;

  nav.querySelectorAll('[data-professor]').forEach(btn => {
    btn.addEventListener('mouseenter', () => playSound('hover', 'resumos'));
  });
}

export function setProfessorFiltro(nome) {
  const valor = nome || null;
  if (State.professorFiltro === valor) return;
  playSound('select', 'resumos');
  State.professorFiltro = valor;
  document.querySelectorAll('#professor-list [data-professor]').forEach(btn => {
    btn.classList.toggle('mode-btn--active', (btn.dataset.professor || null) === valor);
  });
  renderGrid();
}

export function renderHeroStats(total) {
  const c    = document.getElementById('hero-stats');
  const sub  = document.getElementById('hero-sub');
  const disc = State.disciplina;
  if (!c) return;

  // "Copiar tudo": copia todas as aulas do modo ativo (State.modo). O
  // clique é tratado por delegação em #hero-stats — ver
  // _bindCopyAllButton() em resumo-reader.js.
  const copyAllHtml = total > 0 ? `
    <button class="hero-copy-btn" type="button" data-copy-all aria-label="Copiar todas as aulas do modo atual">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M8 6h11a2 2 0 0 1 2 2v11"/>
        <rect x="3" y="9" width="13" height="12" rx="2"/>
        <path d="M7 14h5M7 17.5h5"/>
      </svg>
      <span class="hero-copy-btn__label">Copiar tudo</span>
    </button>` : '';
  c.innerHTML = disc
    ? `<div class="stat-pill">${resolveIcone(disc.icone)} ${disc.nome}</div>${copyAllHtml}`
    : '';

  if (sub) sub.textContent = total === 0
    ? `Nenhum resumo disponível para ${disc?.nome ?? 'esta disciplina'} ainda.`
    : `${total} aula${total !== 1 ? 's' : ''} disponíve${total !== 1 ? 'is' : 'l'} — ${disc?.nome ?? ''}.`;
}

/* ══════════════════════════════════════════════
   CARDS DO GRID
══════════════════════════════════════════════ */
function _profChip(nomeProf) {
  if (!nomeProf) return '';
  const icones = { Bruno: '🧑‍🏫', Wagner: '👨‍💻', Raul: '📐' };
  const icone  = icones[nomeProf] ?? '👤';
  return `<span class="card-prof-chip">${icone} ${esc(nomeProf)}</span>`;
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
  const aulaStr = esc(aula.aula ?? '');
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
        ? `<div class="resumo-card__desc">${parseInline(aula.ideia_central)}</div>`
        : ''}
      <div class="resumo-card__meta">
        <span class="resumo-card__tag">
          <span class="resumo-card__tag-dot"></span>
          ${secoes.length} seç${secoes.length !== 1 ? 'ões' : 'ão'}
        </span>
        ${aula.professor ? `<span class="resumo-card__tag" style="opacity:.6">👤 ${esc(aula.professor)}</span>` : ''}
      </div>
    </div>`;

  _bindCardHover(card);
  card.addEventListener('click', () => abrirModal(aula, idx));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirModal(aula, idx); }
  });
  return card;
}

function _criarCardSintese(aula, idx) {
  const aulaStr = esc(aula.aula ?? '');
  const m       = aulaStr.match(/^(Aula\s*[\d\/]+)\s*[—–-]\s*(.+)$/i);
  const aulaNum = m ? m[1] : aulaStr;
  const aulaTit = m ? m[2] : '';
  const sint    = State.simplificado[idx] ?? null;
  const temSint = !!(sint && (sint.ideia_central || (sint.secoes ?? []).length > 0));
  const preview = sint?.ideia_central ?? null;
  const numSec  = (sint?.secoes ?? []).length;
  const numPad  = String(idx + 1).padStart(2, '0');

  // Título real do card; a etiqueta "Aula N · Síntese" só aparece
  // quando traz informação distinta do título — evita repetir o
  // mesmo texto duas vezes quando não há prefixo "Aula N —".
  const tituloCard    = aulaTit || aulaStr;
  const aulaLabelCard = (aulaNum && aulaNum !== tituloCard) ? `${aulaNum} · Síntese` : null;

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
        aulaLabelCard ? `<div class="resumo-card__aula">${aulaLabelCard}</div>` : '',
        `<div class="resumo-card__titulo${aulaLabelCard ? '' : ' resumo-card__titulo--identity'}">${tituloCard}</div>`
      )}
      ${preview
        ? `<div class="resumo-card__desc">${parseInline(preview)}</div>`
        : `<div class="resumo-card__desc" style="font-style:italic;opacity:0.5">Síntese não disponível ainda.</div>`}
      <div class="resumo-card__meta">
        <span class="resumo-card__tag">
          <span class="resumo-card__tag-dot"></span>
          ${numSec} seç${numSec !== 1 ? 'ões' : 'ão'}
        </span>
      </div>
    </div>`;

  _bindCardHover(card);
  card.addEventListener('click', () => { if (temSint) abrirModal(sint, idx); });
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (temSint) abrirModal(sint, idx); }
  });
  return card;
}

function _criarCardResumao(res, idx) {
  const aulaStr = esc(res.aula ?? '');
  const m       = aulaStr.match(/^(Aula\s*[\d\/]+)\s*[—–-]\s*(.+)$/i);
  const aulaNum = m ? m[1] : aulaStr;
  const aulaTit = m ? m[2] : '';
  const preview = res.ideia_central ?? null;
  const numSec  = (res.secoes ?? []).length;
  const numPad  = String(idx + 1).padStart(2, '0');

  const tituloCard    = aulaTit || aulaStr;
  const aulaLabelCard = (aulaNum && aulaNum !== tituloCard) ? `${aulaNum} · Resumão` : null;

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
        aulaLabelCard ? `<div class="resumo-card__aula">${aulaLabelCard}</div>` : '',
        `<div class="resumo-card__titulo${aulaLabelCard ? '' : ' resumo-card__titulo--identity'}">${tituloCard}</div>`
      )}
      ${preview
        ? `<div class="resumo-card__desc">${parseInline(preview)}</div>`
        : `<div class="resumo-card__desc" style="font-style:italic;opacity:0.5">Resumão não disponível ainda.</div>`}
      <div class="resumo-card__meta">
        <span class="resumo-card__tag">
          <span class="resumo-card__tag-dot"></span>
          ${numSec} seç${numSec !== 1 ? 'ões' : 'ão'}
        </span>
      </div>
    </div>`;

  _bindCardHover(card);
  card.addEventListener('click', () => abrirModalResumao(res, idx));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirModalResumao(res, idx); }
  });
  return card;
}

function _criarCardProfessor(prof, idx) {
  const aulaStr = esc(prof.aula ?? '');
  const m       = aulaStr.match(/^(Aula\s*[\d\/]+)\s*[—–-]\s*(.+)$/i);
  const aulaNum = m ? m[1] : aulaStr;
  const aulaTit = m ? m[2] : '';
  const preview = prof.ideia_central ?? null;
  const numSec  = (prof.secoes ?? []).length;
  const numPad  = String(idx + 1).padStart(2, '0');

  const tituloCard    = aulaTit || aulaStr;
  const aulaLabelCard = (aulaNum && aulaNum !== tituloCard) ? `${aulaNum} · Revisão do Professor` : null;

  const card = document.createElement('article');
  card.className = 'resumo-card';
  card.dataset.tipo = 'professor';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Revisão do Professor: ${prof.aula}`);
  card.innerHTML = `
    <div class="resumo-card__stripe"></div>
    <div class="resumo-card__body">
      ${_buildCardTitleRow(
        numPad,
        aulaLabelCard ? `<div class="resumo-card__aula">${aulaLabelCard}</div>` : '',
        `<div class="resumo-card__titulo${aulaLabelCard ? '' : ' resumo-card__titulo--identity'}">${tituloCard}</div>`
      )}
      ${preview
        ? `<div class="resumo-card__desc">${parseInline(preview)}</div>`
        : `<div class="resumo-card__desc" style="font-style:italic;opacity:0.5">Revisão do Professor não disponível ainda.</div>`}
      <div class="resumo-card__meta">
        <span class="resumo-card__tag">
          <span class="resumo-card__tag-dot"></span>
          ${numSec} seç${numSec !== 1 ? 'ões' : 'ão'}
        </span>
      </div>
    </div>`;

  _bindCardHover(card);
  card.addEventListener('click', () => abrirModalProfessor(prof, idx));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirModalProfessor(prof, idx); }
  });
  return card;
}

export function renderGrid() {
  const grid = document.getElementById('resumos-grid');
  if (!grid) return;
  grid.innerHTML = '';

  // Extra NÃO é aula: renderiza a central de recursos na própria Home e
  // nunca chama abrirModal*() (Reader).
  if (State.modo === 'extra') {
    renderExtra();
    mostrarEstado('extra');
    return;
  }

  // Filtro de professor: aplicado pelo índice da aula em State.aulas —
  // válido nos 4 modos, já que State.simplificado/State.resumao/
  // State.professor são arrays alinhados por índice com State.aulas
  // (ver _criarCardSintese/_criarCardResumao/_criarCardProfessor, que
  // já usam esse mesmo idx).
  const passaFiltroProfessor = idx =>
    !State.professorFiltro || State.aulas[idx]?.professor === State.professorFiltro;

  if (State.modo === 'sintese') {
    State.aulas.forEach((aula, idx) => {
      if (!passaFiltroProfessor(idx)) return;
      const sint = State.simplificado[idx] ?? null;
      const temSint = !!(sint && (sint.ideia_central || (sint.secoes ?? []).length > 0));
      if (!temSint) return;
      const card = _criarCardSintese(aula, idx);
      grid.appendChild(card);
    });
  } else if (State.modo === 'resumao') {
    State.resumao.forEach((res, idx) => {
      if (!passaFiltroProfessor(idx)) return;
      if (!res) return;
      const temRes = !!(res.ideia_central || (res.secoes ?? []).length > 0);
      if (!temRes) return;
      const card = _criarCardResumao(res, idx);
      grid.appendChild(card);
    });
  } else if (State.modo === 'professor') {
    State.professor.forEach((prof, idx) => {
      if (!passaFiltroProfessor(idx)) return;
      if (!prof) return;
      const temProf = !!(prof.ideia_central || (prof.secoes ?? []).length > 0);
      if (!temProf) return;
      const card = _criarCardProfessor(prof, idx);
      grid.appendChild(card);
    });
  } else {
    State.aulas.forEach((aula, idx) => {
      if (!passaFiltroProfessor(idx)) return;
      grid.appendChild(_criarCard(aula, idx));
    });
  }

  // Grid vazio só por causa do filtro de professor (havia conteúdo,
  // o filtro que zerou) → reaproveita o estado "sem resultado" que já
  // existe para busca/filtro, em vez de um grid em branco.
  mostrarEstado(grid.children.length ? 'grid' : 'empty');
}

/* ══════════════════════════════════════════════
   CARREGAMENTO DE CONTEÚDO DE UMA DISCIPLINA
══════════════════════════════════════════════ */
function _marcarStatusConteudo(discId, tem) {
  const el = document.getElementById(`disc-status-${discId}`);
  if (el) {
    el.textContent = tem ? 'Disponível' : 'Sem conteúdo';
    el.className   = `disc-item__status disc-item__status--${tem ? 'ok' : 'empty'}`;
  }
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
    professor:    Array.isArray(raw.professor)     ? raw.professor    : [],
    extra:        (raw.extra && typeof raw.extra === 'object' && !Array.isArray(raw.extra)) ? raw.extra : {},
  };
}

export function carregarConteudo() {
  mostrarEstado('loading');
  renderVideosSection();
  State.temConteudo  = null;
  State.aulas        = [];
  State.simplificado = [];
  State.resumao      = [];
  State.professor    = [];
  State.extra        = {};
  State.modo         = 'completo';
  _sincronizarModoUI();
  atualizarStatusBadge();
  _removerScriptAnterior();
  window.__nexusConteudo = null;

  const disc = State.disciplina;
  if (!disc) {
    State.temConteudo = false;
    atualizarStatusBadge();
    renderHeroStats(0);
    mostrarEstadoSemConteudo();
    _atualizarModoSidebar();
    renderProfessorSidebar();
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
    State.professor    = dados.professor;
    State.extra        = dados.extra;
    State.temConteudo  = dados.aulas.length > 0;
    State.modo         = 'completo';

    _marcarStatusConteudo(disc.id, State.temConteudo);

    if (!State.temConteudo) {
      renderHeroStats(0);
      mostrarEstadoSemConteudo();
      _atualizarModoSidebar();
      renderProfessorSidebar();
      return;
    }

    renderHeroStats(dados.aulas.length);
    _atualizarModoSidebar();
    renderProfessorSidebar();
    renderGrid();
  };

  script.onerror = () => {
    if (State.disciplina?.id !== disc.id) return;
    State.discVerificadas.add(disc.id);
    State.temConteudo = false;
    _marcarStatusConteudo(disc.id, false);
    renderHeroStats(0);
    mostrarEstadoSemConteudo();
    _atualizarModoSidebar();
    renderProfessorSidebar();
  };

  document.head.appendChild(script);
}