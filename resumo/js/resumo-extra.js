/* =============================================
   NEXUS STUDY — resumo/js/resumo-extra.js
   Modo EXTRA: central de recursos complementares da
   disciplina (mapas mentais, vídeos, links, ...).

   NÃO é uma aula: nada aqui passa pelo Reader
   (abrirModal*). Os recursos são renderizados na própria
   Home, dentro de #extra-panel (ver renderGrid em
   resumo-ui.js), organizados por categoria.

   FONTE DE DADOS
   Mesmo arquivo `res_{arquivo}.js` que já entrega
   aulas/simplificado/resumao/professor. O Extra é só mais
   uma chave desse objeto:

     window.__nexusConteudo = {
       aulas: [...], simplificado: [...], resumao: [...], professor: [...],
       extra: {
         mapasMentais: [
           { titulo, descricao?, src, pasta?, miniatura? }
         ],
         videos: [
           // formato A — vídeo externo (sem `thumbnail`, sem preview):
           { titulo, descricao?, url, thumbnail? }
           // formato B — vídeo local, dentro de extra/ (sem `thumbnail`,
           // ganha capa automática = primeiro frame do próprio arquivo):
           { titulo, descricao?, pasta?, src, thumbnail? }
         ],
         links: [
           { titulo, descricao?, url }
         ],
         // arquivos: reservado (ainda não renderizado)
       }
     };

   DUAS PASTAS, DUAS RESPONSABILIDADES — SEPARAÇÃO ABSOLUTA
   `image/` pertence SOMENTE aos 4 modos de conteúdo já existentes
   (Resumo, Resumão, Síntese, Revisão do professor) — resolvida pelo
   Reader, em outro arquivo. NADA do Extra usa `image/`.

   `extra/` pertence SOMENTE ao modo Extra. `image/` e `extra/` são
   pastas IRMÃS (mesmo nível), dentro do mesmo ano/período/AP do
   semestre atual:

     content/resumo/<ano>/<periodo>[/<ap>]/image/...   (Reader — não usado aqui)
     content/resumo/<ano>/<periodo>[/<ap>]/extra/...    (Extra — mapasMentais e vídeo local)

   - `src` (mapa mental) e `src`/`pasta` (vídeo local, sem `url`):
     SÃO SEMPRE RECURSOS LOCAIS e são resolvidos dentro de `extra/` —
     em extra/<pasta>/ se `pasta` for informada, ou direto em extra/
     se `pasta` for omitida. `pasta` é relativa à raiz de `extra/`;
     não existe subpasta padrão por disciplina (isso é conceito do
     Reader/`image/`, não do Extra). `src` NUNCA é tratado como URL
     absoluta/externa — quem precisa apontar para fora do site usa o
     campo `url` (vídeo externo ou `links`), não `src`. Isso garante
     que todo recurso com botão "Baixar" seja de fato um arquivo do
     próprio domínio (o atributo `download` do navegador só funciona
     de verdade em recursos same-origin).
   - Vídeo por `url` (formato A) não passa por nenhuma resolução de
     pasta — é usado exatamente como escrito, igual a `links`, e NÃO
     é elegível a botão de download.
   - Item sem `titulo` é ignorado. Mapa sem `src`, link sem `url`,
     ou vídeo sem `url` E sem `src` também são ignorados (com aviso
     no console). Categoria sem itens válidos não aparece.
   - Para adicionar um tipo novo de recurso: uma entrada em
     CATEGORIAS abaixo.
   ============================================= */

import { playSound } from '../../shared/js/audio/audio-api.js';
import { State, esc, parseInline } from './resumo-utils.js';
import { extraBase, encodePath } from './media-config.js';

/* ══════════════════════════════════════════════
   CATEGORIAS — ordem = ordem na tela
   tipo 'mapa' → abre o visualizador próprio (imagem)
   tipo 'link' → abre a URL em nova aba (vídeo externo e link)
   (vídeo LOCAL não é nem 'mapa' nem simples 'link': tem card
   próprio — _cardVideoLocal — por precisar do botão de Baixar)

   BOTÃO "BAIXAR": só em mapasMentais e vídeo local (arquivo
   dentro de extra/, mesmo domínio do site — download real).
   Vídeo por `url` e `links` não ganham esse botão.
══════════════════════════════════════════════ */
const CATEGORIAS = [
  { chave: 'mapasMentais', icone: '🧠', titulo: 'Mapas Mentais', singular: 'Mapa mental', acao: 'Visualizar', tipo: 'mapa' },
  { chave: 'videos',       icone: '🎥', titulo: 'Vídeos',        singular: 'Vídeo',       acao: 'Assistir',   tipo: 'link' },
  { chave: 'links',        icone: '🔗', titulo: 'Links',         singular: 'Link',        acao: 'Acessar',    tipo: 'link' },
];

const _ARROW_SVG = `
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
  </svg>`;

const _PLAY_SVG = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.14v13.72c0 .84.92 1.34 1.61.87l10.28-6.86a1 1 0 0 0 0-1.74L9.61 4.27C8.92 3.8 8 4.3 8 5.14z"/>
  </svg>`;

const _DOWNLOAD_SVG = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 3v12"/><path d="M7.5 10.5L12 15l4.5-4.5"/><path d="M4 19h16"/>
  </svg>`;

/* ══════════════════════════════════════════════
   DADOS
══════════════════════════════════════════════ */
function _perigosa(url) {
  return /^\s*(javascript|vbscript):/i.test(String(url));
}

function _campoPrincipal(cat) { return cat.tipo === 'mapa' ? 'src' : 'url'; }

/* 'videos' aceita dois formatos (ver header): `url` (externo) OU
   `src`/`pasta` (arquivo local em extra/). Os demais tipos mantêm um
   único campo obrigatório, como já era. */
function _valorPrincipal(cat, it) {
  if (cat.chave === 'videos') return it.url || it.src || null;
  return it[_campoPrincipal(cat)];
}

function _itens(cat, avisar = false) {
  const lista = State.extra?.[cat.chave];
  if (!Array.isArray(lista)) return [];
  return lista.filter(it => {
    const valor = it && typeof it === 'object' ? _valorPrincipal(cat, it) : null;
    const ok = !!(it && typeof it === 'object' && it.titulo && valor && !_perigosa(valor));
    if (!ok && avisar) console.warn(`[Extra] Item inválido ignorado em "${cat.chave}":`, it);
    return ok;
  });
}

/* Usado pela sidebar (resumo-ui.js): o botão "Extra" só aparece
   quando a disciplina tem ao menos um recurso válido. */
export function temExtra() {
  return CATEGORIAS.some(cat => _itens(cat).length > 0);
}

/* Raiz de TODO conteúdo do Extra (mapasMentais e vídeo local): `extra/`
   é IRMÃ de `image/` (mesmo nível), dentro do mesmo ano/período/AP do
   semestre atual — NUNCA dentro de `image/`. `pasta` é relativa à raiz
   de `extra/`; se omitida, o arquivo é lido direto de extra/.

   `item.src` é SEMPRE um nome/caminho de arquivo LOCAL dentro de
   extra/ — nunca uma URL externa. Diferente da versão anterior desta
   função, não existe mais um "atalho" que deixa passar `src`
   absoluto (http(s):, ou começando com / ou ../) sem resolver: isso
   fazia o card de mapa/vídeo local exibir um botão "Baixar" que
   apontava para fora do domínio, onde o atributo `download` do
   navegador é ignorado (o clique simplesmente navegava para o
   recurso externo em vez de baixá-lo). Quem precisa de um recurso
   externo usa o campo `url` (vídeo externo ou `links`), que nunca
   passa por esta função e nunca ganha botão de download. */
function _resolverExtra(item) {
  const src   = String(item.src);
  const pasta = item.pasta ? `${encodePath(item.pasta)}/` : '';
  return extraBase(State.semestre) + pasta + encodePath(src);
}

/* ══════════════════════════════════════════════
   CARDS
══════════════════════════════════════════════ */
/* extraAcaoHtml: segunda ação do card (hoje só "Baixar", ver
   _botaoDownload) — some quando não informada, card fica igual a antes. */
function _cardInner(cat, item, previewHtml, extraAcaoHtml = '') {
  return `
    <div class="extra-card__stripe"></div>
    ${previewHtml}
    <div class="extra-card__body">
      <div class="extra-card__tipo"><span aria-hidden="true">${cat.icone}</span>${esc(cat.singular)}</div>
      <div class="extra-card__titulo">${esc(item.titulo)}</div>
      ${item.descricao ? `<div class="extra-card__desc">${parseInline(item.descricao)}</div>` : ''}
      <div class="extra-card__acoes">
        <span class="extra-card__acao">${esc(cat.acao)} ${_ARROW_SVG}</span>
        ${extraAcaoHtml}
      </div>
    </div>`;
}

/* Botão "Baixar" — SÓ para arquivo local em extra/ (mapasMentais e
   vídeo local): é a mesma URL resolvida por _resolverExtra, sempre no
   mesmo domínio do site, então o atributo `download` funciona de
   verdade (força o download em vez de navegar). Vídeo por `url` e
   `links` não ganham esse botão — são de outro domínio, o navegador
   ignoraria o `download` e abriria a página normalmente. */
function _botaoDownload(url, titulo) {
  return `
    <a class="extra-card__download" href="${esc(url)}" download
       aria-label="Baixar: ${esc(titulo)}" title="Baixar arquivo">
      ${_DOWNLOAD_SVG}
    </a>`;
}

function _preview(url, alt) {
  return url
    ? `<div class="extra-card__preview"><img src="${esc(url)}" alt="${esc(alt)}" loading="lazy" draggable="false" /></div>`
    : '';
}

/* Capa automática de vídeo local sem `thumbnail`: usa o próprio arquivo
   como preview — o navegador desenha o primeiro frame como capa, sem
   precisar gerar/enviar uma imagem separada (preload="metadata", sem
   controls nem autoplay — não é um player, só a imagem de capa).
   Ícone de play sobreposto para deixar claro que é vídeo. */
function _previewVideoLocal(url) {
  return `
    <div class="extra-card__preview extra-card__preview--video">
      <video src="${esc(url)}" muted playsinline preload="metadata" tabindex="-1"></video>
      <span class="extra-card__preview-play" aria-hidden="true">${_PLAY_SVG}</span>
    </div>`;
}

function _cardMapa(cat, item, idx, urlDownload) {
  const thumb = _resolverExtra({ ...item, src: item.miniatura ?? item.src });
  return `
    <article class="extra-card extra-card--mapa" data-mapa="${idx}" tabindex="0" role="button"
             aria-label="${esc(cat.acao)}: ${esc(item.titulo)}">
      ${_cardInner(cat, item, _preview(thumb, ''), _botaoDownload(urlDownload, item.titulo))}
    </article>`;
}

function _cardLink(cat, item) {
  // Link (chave 'links') e vídeo EXTERNO (chave 'videos' com `url`):
  // sempre têm `url` de destino, card simples de uma ação só. Vídeo
  // LOCAL tem card próprio (_cardVideoLocal) — precisa de uma 2ª ação
  // (Baixar) que não cabe dentro de um único <a>.
  const thumb = cat.chave === 'videos' && item.thumbnail ? _preview(item.thumbnail, '') : '';
  return `
    <a class="extra-card extra-card--link" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"
       aria-label="${esc(cat.acao)}: ${esc(item.titulo)} (abre em nova aba)">
      ${_cardInner(cat, item, thumb)}
    </a>`;
}

/* Vídeo LOCAL (pasta/src, sem `url`): precisa de duas ações (Assistir
   + Baixar), então não pode ser um único <a> como o vídeo externo —
   dois <a> um dentro do outro é HTML inválido. Vira <article
   role="button">, igual ao mapa mental: clique abre o vídeo numa nova
   aba (a "ação principal" continua sendo abrir/assistir), e o botão
   "Baixar" é um <a download> de verdade dentro do card (com guarda no
   binding pra não também abrir a aba — ver renderExtra). */
function _cardVideoLocal(cat, item) {
  const url = _resolverExtra(item);
  const thumb = item.thumbnail ? _preview(item.thumbnail, '') : _previewVideoLocal(url);
  return `
    <article class="extra-card extra-card--video-local" data-href="${esc(url)}" tabindex="0" role="button"
             aria-label="${esc(cat.acao)}: ${esc(item.titulo)}">
      ${_cardInner(cat, item, thumb, _botaoDownload(url, item.titulo))}
    </article>`;
}

/* ══════════════════════════════════════════════
   RENDER — #extra-panel
══════════════════════════════════════════════ */
let _mapas = [];   // mapas da renderização atual, indexados por data-mapa

export function renderExtra() {
  const panel = document.getElementById('extra-panel');
  if (!panel) return;

  _mapas = [];
  const secoes = CATEGORIAS.map(cat => {
    const itens = _itens(cat, true);
    if (!itens.length) return '';          // sem seção vazia

    let cards;
    if (cat.tipo === 'mapa') {
      cards = itens.map(it => {
        const url = _resolverExtra(it);
        _mapas.push({ ...it, _url: url });
        return _cardMapa(cat, it, _mapas.length - 1, url);
      }).join('');
    } else if (cat.chave === 'videos') {
      // Vídeo local (sem `url`) ganha card próprio com botão de Baixar;
      // vídeo externo (com `url`) continua igual a link, sem download.
      cards = itens.map(it => (it.url ? _cardLink(cat, it) : _cardVideoLocal(cat, it))).join('');
    } else {
      cards = itens.map(it => _cardLink(cat, it)).join('');
    }

    return `
      <section class="extra-sec" data-cat="${esc(cat.chave)}" aria-label="${esc(cat.titulo)}">
        <h3 class="extra-sec__head">
          <span class="extra-sec__ico" aria-hidden="true">${cat.icone}</span>
          <span class="extra-sec__nome">${esc(cat.titulo)}</span>
          <span class="extra-sec__count">${itens.length}</span>
        </h3>
        <div class="extra-grid">${cards}</div>
      </section>`;
  }).join('');

  const nomeDisc = State.disciplina?.nome;
  panel.innerHTML = `
    <header class="extra__head">
      <h2 class="extra__titulo">Extra</h2>
      <p class="extra__sub">Recursos complementares${nomeDisc ? ` — ${esc(nomeDisc)}` : ' para esta disciplina'}</p>
    </header>
    ${secoes || `
      <div class="state-empty">
        <span class="state-empty__icon">🧩</span>
        <p>Nenhum recurso extra disponível.</p>
      </div>`}`;

  panel.querySelectorAll('.extra-card').forEach(card => {
    card.addEventListener('mouseenter', () => playSound('hover', 'resumos'));
  });
  panel.querySelectorAll('.extra-card--link').forEach(a => {
    a.addEventListener('click', () => playSound('click', 'resumos'));
  });
  // Botão "Baixar": some do meio do caminho antes de chegar na ação
  // principal do card (abrir viewer / abrir vídeo em nova aba) — os dois
  // bindings abaixo ignoram o clique/tecla quando o alvo é este botão.
  const _cliqueNoDownload = e => !!e.target.closest('.extra-card__download');
  panel.querySelectorAll('.extra-card--mapa').forEach(card => {
    const abrir = () => _abrirViewer(_mapas[Number(card.dataset.mapa)], card);
    card.addEventListener('click', e => { if (_cliqueNoDownload(e)) return; abrir(); });
    card.addEventListener('keydown', e => {
      if (_cliqueNoDownload(e)) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); }
    });
  });
  panel.querySelectorAll('.extra-card--video-local').forEach(card => {
    const abrir = () => { playSound('click', 'resumos'); window.open(card.dataset.href, '_blank', 'noopener,noreferrer'); };
    card.addEventListener('click', e => { if (_cliqueNoDownload(e)) return; abrir(); });
    card.addEventListener('keydown', e => {
      if (_cliqueNoDownload(e)) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); }
    });
  });
  panel.querySelectorAll('.extra-card__download').forEach(a => {
    a.addEventListener('click', () => playSound('click', 'resumos'));
  });
  // Miniatura que falhou ao carregar: mantém o card, só troca por um placeholder.
  panel.querySelectorAll('.extra-card__preview img').forEach(img => {
    img.addEventListener('error', () => img.parentElement.classList.add('extra-card__preview--erro'), { once: true });
  });
  // Mesmo tratamento pra capa automática de vídeo local (primeiro frame).
  panel.querySelectorAll('.extra-card__preview video').forEach(v => {
    v.addEventListener('error', () => v.parentElement.classList.add('extra-card__preview--erro'), { once: true });
  });
}

/* ══════════════════════════════════════════════
   VISUALIZADOR (mapa mental) — modal próprio, criado sob
   demanda. Independente do Reader (#read-modal).
   Zoom por botões/teclado (+ − 0), clique na imagem alterna
   ajustar↔200%, arrastar para navegar quando ampliado.
══════════════════════════════════════════════ */
const ZOOMS = [0, 150, 200, 300, 400];   // 0 = ajustar à tela (% da largura da área)
let _v = null;
let _zoomIdx = 0;
let _retornoFoco = null;
let _overflowAntes = '';

function _criarViewer() {
  const root = document.createElement('div');
  root.className = 'extra-viewer';
  root.id = 'extra-viewer';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Visualizador de mapa mental');
  root.innerHTML = `
    <div class="extra-viewer__backdrop" data-fechar></div>
    <div class="extra-viewer__panel" tabindex="-1">
      <header class="extra-viewer__bar">
        <div class="extra-viewer__info">
          <span class="extra-viewer__titulo"></span>
          <span class="extra-viewer__desc"></span>
        </div>
        <div class="extra-viewer__tools">
          <button type="button" class="extra-viewer__btn" data-acao="menos" aria-label="Diminuir zoom" title="Diminuir (−)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg>
          </button>
          <button type="button" class="extra-viewer__zoom" data-acao="ajustar" aria-label="Ajustar à tela" title="Ajustar à tela (0)">—</button>
          <button type="button" class="extra-viewer__btn" data-acao="mais" aria-label="Aumentar zoom" title="Aumentar (+)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          </button>
          <a class="extra-viewer__btn extra-viewer__abrir" target="_blank" rel="noopener noreferrer"
             aria-label="Abrir imagem em nova aba" title="Abrir em nova aba">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>
          </a>
          <a class="extra-viewer__btn extra-viewer__baixar" download
             aria-label="Baixar imagem" title="Baixar (mesmo arquivo)">
            ${_DOWNLOAD_SVG}
          </a>
          <button type="button" class="extra-viewer__btn" data-fechar aria-label="Fechar" title="Fechar (Esc)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </header>
      <div class="extra-viewer__stage" data-estado="carregando">
        <img class="extra-viewer__img" alt="" draggable="false" />
        <div class="extra-viewer__msg"></div>
      </div>
    </div>`;
  document.body.appendChild(root);

  _v = {
    root,
    panel:  root.querySelector('.extra-viewer__panel'),
    stage:  root.querySelector('.extra-viewer__stage'),
    img:    root.querySelector('.extra-viewer__img'),
    msg:    root.querySelector('.extra-viewer__msg'),
    titulo: root.querySelector('.extra-viewer__titulo'),
    desc:   root.querySelector('.extra-viewer__desc'),
    zoom:   root.querySelector('.extra-viewer__zoom'),
    abrir:  root.querySelector('.extra-viewer__abrir'),
    baixar: root.querySelector('.extra-viewer__baixar'),
  };

  root.addEventListener('click', e => {
    if (e.target.closest('[data-fechar]')) { _fecharViewer(); return; }
    const btn = e.target.closest('[data-acao]');
    if (!btn) return;
    if (btn.dataset.acao === 'mais')    _zoomPara(_zoomIdx + 1);
    if (btn.dataset.acao === 'menos')   _zoomPara(_zoomIdx - 1);
    if (btn.dataset.acao === 'ajustar') _zoomPara(0);
  });

  _v.img.addEventListener('load', () => {
    _v.stage.dataset.estado = 'pronto';
    _atualizarRotuloZoom();
  });
  _v.img.addEventListener('error', () => {
    _v.stage.dataset.estado = 'erro';
    _v.msg.textContent = 'Não foi possível carregar a imagem.';
    _v.zoom.textContent = '—';
  });

  // Arrastar para navegar (só quando ampliado). Movimento > 4px não conta como clique.
  let drag = null;
  let moveu = false;
  _v.stage.addEventListener('pointerdown', e => {
    if (e.button !== 0 || !_v.stage.classList.contains('extra-viewer__stage--zoom')) return;
    drag = { x: e.clientX, y: e.clientY, sl: _v.stage.scrollLeft, st: _v.stage.scrollTop };
    moveu = false;
    _v.stage.setPointerCapture(e.pointerId);
    _v.stage.classList.add('extra-viewer__stage--arrastando');
  });
  _v.stage.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) moveu = true;
    _v.stage.scrollLeft = drag.sl - dx;
    _v.stage.scrollTop  = drag.st - dy;
  });
  const fimDrag = () => {
    drag = null;
    _v.stage.classList.remove('extra-viewer__stage--arrastando');
  };
  _v.stage.addEventListener('pointerup', fimDrag);
  _v.stage.addEventListener('pointercancel', fimDrag);

  // Clique (sem arrastar) na imagem: alterna ajustar ↔ 200%.
  _v.img.addEventListener('click', () => {
    if (moveu) { moveu = false; return; }
    _zoomPara(_zoomIdx === 0 ? 2 : 0);
  });
}

function _atualizarRotuloZoom() {
  if (!_v) return;
  const { img, zoom } = _v;
  requestAnimationFrame(() => {
    const w = img.getBoundingClientRect().width;
    zoom.textContent = (img.naturalWidth && w)
      ? `${Math.round((w / img.naturalWidth) * 100)}%`
      : '—';
  });
}

function _zoomPara(idx) {
  if (!_v) return;
  _zoomIdx = Math.max(0, Math.min(ZOOMS.length - 1, idx));
  const z = ZOOMS[_zoomIdx];
  _v.stage.classList.toggle('extra-viewer__stage--zoom', z > 0);
  _v.img.style.width = z ? `${z}%` : '';
  if (!z) { _v.stage.scrollLeft = 0; _v.stage.scrollTop = 0; }
  _atualizarRotuloZoom();
}

function _onKeydownViewer(e) {
  if (e.key === 'Escape') { e.preventDefault(); _fecharViewer(); return; }
  if (e.key === '+' || e.key === '=') { e.preventDefault(); _zoomPara(_zoomIdx + 1); return; }
  if (e.key === '-' || e.key === '_') { e.preventDefault(); _zoomPara(_zoomIdx - 1); return; }
  if (e.key === '0')                  { e.preventDefault(); _zoomPara(0); return; }
  if (e.key === 'Tab') {                 // mantém o foco dentro do modal
    const foc = [..._v.root.querySelectorAll('button, a[href]')];
    if (!foc.length) return;
    const primeiro = foc[0], ultimo = foc[foc.length - 1];
    if (e.shiftKey && (document.activeElement === primeiro || document.activeElement === _v.panel)) {
      e.preventDefault(); ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault(); primeiro.focus();
    }
  }
}

function _abrirViewer(mapa, gatilho) {
  if (!mapa) return;
  if (!_v) _criarViewer();
  playSound('click', 'resumos');
  playSound('openModal', 'resumos');

  _retornoFoco = gatilho ?? document.activeElement;
  _v.titulo.textContent = mapa.titulo ?? '';
  _v.desc.textContent   = mapa.descricao ?? '';
  _v.desc.hidden        = !mapa.descricao;
  _v.abrir.href         = mapa._url;
  _v.baixar.href        = mapa._url;
  _v.img.alt            = mapa.titulo ?? '';

  _v.stage.dataset.estado = 'carregando';
  _v.msg.textContent = 'Carregando…';
  _v.img.removeAttribute('src');
  _zoomPara(0);
  _v.img.src = mapa._url;

  _overflowAntes = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  _v.root.classList.add('extra-viewer--open');
  document.addEventListener('keydown', _onKeydownViewer);
  _v.panel.focus();
}

function _fecharViewer() {
  if (!_v || !_v.root.classList.contains('extra-viewer--open')) return;
  playSound('click', 'resumos');
  _v.root.classList.remove('extra-viewer--open');
  _v.img.removeAttribute('src');
  document.body.style.overflow = _overflowAntes;
  document.removeEventListener('keydown', _onKeydownViewer);
  _retornoFoco?.focus?.();
  _retornoFoco = null;
}