/* =============================================
   NEXUS STUDY — resumo/js/pdf/resumo-pdf-viewer.js
   Janela de VISUALIZAÇÃO do PDF já gerado: tela de
   carregamento ("Gerando PDF…"), a própria página do
   visualizador (PDF.js, documento contínuo com todas as
   páginas, zoom PRÓPRIO — área 'resumo_pdf', independente
   do zoom do Resumo normal —, desenho, impressão,
   download) e o helper que navega uma aba já aberta para
   o HTML desses documentos via Blob URL.

   Extraído de resumo-pdf.js — este módulo não gera o PDF
   nem conhece a seleção do modal; recebe só o nome do
   arquivo, o Blob URL do PDF pronto e o zoom inicial, e
   devolve o HTML pronto para a aba navegar.

   Detecção de "é mobile?" e o atalho de download direto
   (sem abrir aba) também vivem aqui, por serem parte da
   mesma decisão de COMO entregar o PDF ao usuário — nada
   disso mudou de comportamento nesta extração.
   ============================================= */

import { esc } from '../resumo-utils.js';

// PDF.js — usado só para RENDERIZAR o PDF já gerado dentro do
// visualizador desktop (zoom, página, rolagem contínua etc.
// controláveis por JS de verdade, ao contrário do plugin nativo de
// PDF do navegador). Carregado sob demanda via CDN, mesma técnica que
// resumo-pdf-document.js usa para o pdfmake.
const PDFJS_VERSION = '3.11.174';
const PDFJS_BASE = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/`;

export function _buildLoadingHTML() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Gerando PDF…</title>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{
    background:
      radial-gradient(circle at 50% 32%, rgba(127,203,160,0.16), transparent 60%),
      #0c0f22;
    color:#ada698;
    font-family:system-ui,-apple-system,"Segoe UI",sans-serif;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:1.4rem; text-align:center; padding:1.5rem;
  }
  .pdf-loader{ width:60px; height:60px; position:relative; display:flex; align-items:center; justify-content:center; }
  .pdf-loader svg{ width:30px; height:30px; color:#7fcba0; }
  .pdf-loader__ring{
    position:absolute; inset:0; border-radius:50%;
    border:3px solid rgba(127,203,160,0.15);
    border-top-color:#7fcba0;
    animation:pdf-spin .9s linear infinite;
  }
  @keyframes pdf-spin{ to{ transform:rotate(360deg); } }
  h1{ font-size:1.05rem; font-weight:700; color:#f0ead8; letter-spacing:.02em; }
  h1 #pdf-dots{ display:inline-block; width:1.4ch; text-align:left; }
  p{ font-size:.8rem; color:#8a8478; max-width:280px; line-height:1.5; }
</style>
</head>
<body>
  <div class="pdf-loader">
    <div class="pdf-loader__ring"></div>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path d="M14 2v6h6"/>
    </svg>
  </div>
  <h1>Gerando PDF<span id="pdf-dots"></span></h1>
  <p>Isso pode levar alguns segundos — não feche esta aba.</p>
  <script>
    (function () {
      var el = document.getElementById('pdf-dots');
      var i = 0;
      setInterval(function () {
        i = (i + 1) % 4;
        el.textContent = '.'.repeat(i);
      }, 400);
    })();
  </script>
</body>
</html>`;
}

/* O visualizador renderiza o PDF ele mesmo, com PDF.js (carregado sob
   demanda — ver PDFJS_BASE) em vez de depender do plugin nativo de
   PDF do navegador. É isso que torna zoom, navegação de página e
   desenho controles REAIS (não decorativos): o plugin nativo do
   navegador não expõe nenhuma API pro nosso JS controlar.

   EXIBIÇÃO: documento contínuo, com todas as páginas empilhadas
   verticalmente dentro de #pdfview-pages e uma única barra de
   rolagem (#viewer-scroll) — não é mais "uma página por vez com
   setas". Cada página nasce como um placeholder do tamanho certo
   (para a barra de rolagem já ter a altura final do documento) e só
   ganha um <canvas> de verdade — e só então é desenhada pelo PDF.js —
   quando entra na tela (ou perto dela), via IntersectionObserver; ao
   sair da tela o canvas é removido de novo. Isso evita alocar, de
   uma vez, centenas de canvases em memória num PDF com muitas
   páginas (ex.: 232). As setas ‹ › e o campo de página continuam
   existindo, mas agora rolam até a página (scrollIntoView) em vez de
   trocar um único canvas; o indicador "N / total" é atualizado a
   partir da posição de rolagem.

   ZOOM: tem sua PRÓPRIA área, `resumo_pdf` — completamente separada
   da área `resumos` (Resumo normal). O zoom INICIAL desta aba vem de
   `zoom.js::getZoomResumoPdf()`, chamado na aba do Nexus Study — ver
   `_onGenerate` em resumo-pdf.js — e recebido aqui via `zoomInicial`.
   Ajustes feitos aqui com os botões `− / +` (ou pelos atalhos "Ajustar
   à largura"/"Ajustar à página" do menu ⋮) são gravados de volta no
   MESMO storage que `shared/js/utils/zoom.js` usa (`nexus_zoom_por_area`),
   só que na área `resumo_pdf` — NUNCA na área `resumos`. Isso é o que
   garante que calibrar o zoom do visualizador de PDF nunca altera (e
   nunca é alterado por) o zoom do Resumo normal, e vice-versa.

   TEXTO SELECIONÁVEL: cada página desenhada no <canvas> (só pixels)
   ganha, por cima, uma camada de texto real feita pelo próprio PDF.js
   (`pdfjsLib.renderTextLayer`, já disponível no pdf.min.js carregado
   via CDN — nenhuma biblioteca nova) — um <span> transparente por
   trecho de texto, posicionado sobre o mesmo viewport do canvas. É
   essa camada (ver `renderPageEntry`/`liberarPageEntry`) que permite
   selecionar com o mouse, copiar com Ctrl+C, usar "Copiar" pelo menu
   de contexto do navegador e pesquisar com Ctrl+F — sem alterar em
   nada o desenho do canvas (zoom, nitidez, paginação) nem o PDF
   original. Ela nasce e morre junto com o canvas de cada página (lazy
   render/liberação por IntersectionObserver, ver comentário abaixo).

   Esta aba não importa zoom.js como módulo (é um <script> solto dentro
   de um documento HTML autocontido, aberto via Blob URL) — por isso
   duplica aqui a leitura/gravação no mesmo formato de storage que
   zoom.js usa, só que mirando exclusivamente a chave `resumo_pdf`,
   nunca `resumos`. `zoom.js::getZoomResumoPdf()/setZoomResumoPdf()`
   são o par de funções que o RESTO do site usa para ler/gravar esse
   mesmo valor (ex.: o cálculo de `zoomInicial` em `_onGenerate`).

   O botão "Baixar PDF" continua sendo o único caminho de download que
   este código controla, e continua usando o MESMO blobUrl (o arquivo
   original, sem qualquer alteração) e o MESMO nomeArquivo vindo de
   _buildNomeArquivo (resumo-pdf.js) — nada disso muda com o renderer.

   Sobre o `blobUrl`: ele foi criado com URL.createObjectURL() na aba
   Resumos (quem chama _onGenerate), não nesta aba. Pela spec, um Blob
   URL continua válido, acessível de qualquer aba mesma-origem,
   ENQUANTO o documento que o criou continuar vivo — só é invalidado
   quando essa aba de origem fecha/recarrega, ou por revokeObjectURL
   manual. Por isso este arquivo NÃO revoga o blobUrl no 'pagehide'
   desta aba (pagehide também dispara com um F5, o que destruiria o
   PDF bem na hora em que o F5 precisaria dele de novo). */
export function _buildVisualizadorHTML(nomeArquivo, blobUrl, zoomInicial) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${esc(nomeArquivo)}</title>
<script src="${PDFJS_BASE}pdf.min.js"></script>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;background:#3b3e42;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}

  .pdfview-bar{
    position:fixed;top:0;left:0;right:0;height:52px;z-index:3;
    display:flex;align-items:center;gap:.5rem;
    padding:0 .7rem;background:#0c0f22;border-bottom:1px solid rgba(127,203,160,0.25);
    color:#ada698;font-size:.8rem;
  }
  .pdfview-bar__nome{
    flex:0 1 220px;min-width:0;color:#f0ead8;font-size:.8rem;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  }
  .pdfview-bar__sep{ width:1px;align-self:stretch;margin:10px .3rem;background:rgba(255,255,255,0.12); }
  .pdfview-bar__center{ display:flex;align-items:center;gap:.35rem;flex:1;justify-content:center;min-width:0; }
  .pdfview-bar__right{ display:flex;align-items:center;gap:.4rem;margin-left:auto; }

  .tb-btn{
    display:inline-flex;align-items:center;justify-content:center;gap:.3rem;
    background:transparent;color:#ada698;border:none;border-radius:6px;
    font:600 .78rem/1 system-ui,sans-serif;width:30px;height:30px;cursor:pointer;
  }
  .tb-btn:hover{ background:rgba(255,255,255,0.08); color:#f0ead8; }
  .tb-btn:disabled{ opacity:.35;cursor:default; }
  .tb-btn:disabled:hover{ background:transparent; }
  .tb-btn--active{ background:#7fcba0;color:#0c0f22; }
  .tb-btn--active:hover{ background:#7fcba0;color:#0c0f22; }

  .tb-page-input{
    width:40px;background:#1a1e33;border:1px solid rgba(255,255,255,0.12);border-radius:5px;
    color:#f0ead8;font-size:.78rem;text-align:center;padding:.3rem 0;
  }
  .tb-zoom-label{ min-width:42px;text-align:center;font-size:.78rem;color:#ada698; }

  .pdfview-bar__btn{
    display:inline-flex;align-items:center;gap:.4rem;
    background:#7fcba0;color:#0c0f22;border:none;border-radius:8px;
    font:600 .82rem/1 system-ui,-apple-system,sans-serif;
    padding:.5rem .8rem;cursor:pointer;white-space:nowrap;
  }
  .pdfview-bar__btn:active{ opacity:.8; }
  .pdfview-bar__btn--ghost{ background:transparent;color:#ada698;border:1px solid rgba(255,255,255,0.16); }
  .pdfview-bar__btn--ghost:hover{ color:#f0ead8;border-color:rgba(255,255,255,0.3); }

  .tb-menu{ position:relative; }
  .tb-menu__dropdown{
    display:none;position:absolute;top:38px;right:0;background:#171a2b;
    border:1px solid rgba(255,255,255,0.12);border-radius:8px;overflow:hidden;
    min-width:170px;z-index:5;
  }
  .tb-menu__dropdown.open{ display:block; }
  .tb-menu__dropdown button{
    display:block;width:100%;text-align:left;background:none;border:none;
    color:#ada698;font-size:.8rem;padding:.6rem .8rem;cursor:pointer;
  }
  .tb-menu__dropdown button:hover{ background:rgba(255,255,255,0.06);color:#f0ead8; }

  .pdfview-scroll{
    position:fixed;top:52px;left:0;right:0;bottom:0;overflow:auto;
  }
  .pdfview-pages{
    display:flex;flex-direction:column;align-items:center;gap:20px;
    padding:24px 0;min-height:100%;
  }
  .pdfview-pagewrap{ position:relative;background:#fdfbf6;box-shadow:0 4px 18px rgba(0,0,0,.4);flex:none; }
  .pdfview-pagewrap canvas{ display:block; }
  .draw-canvas{ position:absolute;inset:0;pointer-events:none;touch-action:none; }
  #pdfview-pages.draw-mode .draw-canvas{ pointer-events:auto; }

  /* Camada de TEXTO real do PDF (PDF.js) — um <span> transparente por
     trecho de texto, posicionado exatamente sobre o desenho já feito
     no <canvas> (mesmo viewport dos dois — ver renderPageEntry). É
     isso (não o canvas, que é só pixel) que permite selecionar com o
     mouse, copiar com Ctrl+C e usar o menu de contexto do navegador;
     a busca (Ctrl+F) do próprio navegador também passa a enxergar o
     texto. Fica ENTRE o canvas (fundo) e o .draw-canvas (desenho, por
     cima) na ordem do DOM — ver montagem em renderPageEntry — então o
     desenho continua por cima de tudo, e a seleção de texto só fica
     desativada enquanto o modo de desenho estiver ligado (ver regra
     de .draw-mode abaixo), pra não brigar com o lápis. Zero impacto
     visual: o texto em si é transparente, só a marcação de seleção
     (::selection) aparece, do mesmo jeito que em qualquer leitor de
     PDF. */
  .pdfview-textlayer{
    position:absolute; inset:0; overflow:hidden;
    line-height:1; text-align:initial;
    -webkit-user-select:text; user-select:text;
  }
  .pdfview-textlayer span, .pdfview-textlayer br{
    color:transparent; position:absolute; white-space:pre;
    cursor:text; transform-origin:0% 0%;
  }
  .pdfview-textlayer ::selection{ background:rgba(127,203,160,0.35); }
  .pdfview-textlayer .endOfContent{
    display:block; position:absolute; inset:100% 0 0; z-index:-1;
    cursor:default; user-select:none;
  }
  .pdfview-textlayer .endOfContent.active{ top:0; }
  #pdfview-pages.draw-mode .pdfview-textlayer{ pointer-events:none; }

  .pdfview-msg{ color:#ada698;padding:2rem;text-align:center;max-width:420px;margin:0 auto;line-height:1.6; }

  /* Barra de busca própria (Ctrl+F) — substitui a busca nativa do
     navegador, que só enxerga texto das páginas atualmente
     renderizadas (ver comentário grande sobre indexação, mais abaixo
     no <script>). Fica fixa, abaixo da barra de ferramentas. */
  .pdfview-findbar{
    position:fixed; top:60px; right:12px; z-index:6;
    display:flex; align-items:center; gap:.4rem;
    background:#171a2b; border:1px solid rgba(255,255,255,0.14);
    border-radius:8px; padding:.4rem .5rem;
    box-shadow:0 6px 20px rgba(0,0,0,.35);
  }
  .pdfview-findbar[hidden]{ display:none; }
  .pdfview-findbar__input{
    background:#0c0f22; border:1px solid rgba(255,255,255,0.14); border-radius:5px;
    color:#f0ead8; font-size:.8rem; padding:.35rem .5rem; width:170px;
  }
  .pdfview-findbar__input:focus{ outline:none; border-color:#7fcba0; }
  .pdfview-findbar__input--empty{ border-color:#e0475c; }
  .pdfview-findbar__count{
    font-size:.72rem; color:#8a8478; min-width:88px; text-align:center; white-space:nowrap;
  }

  /* Marcação da ocorrência: caixa posicionada por cima da página, nas
     coordenadas reais do texto (ver drawHighlightsForPage) — funciona
     esteja a página renderizada há tempos ou tenha acabado de ser
     forçada a renderizar para exibir o resultado. */
  .pdfview-hl{
    position:absolute; pointer-events:none; border-radius:2px;
    background:rgba(255,224,102,.55);
  }
  .pdfview-hl--active{
    background:rgba(255,150,50,.75);
    box-shadow:0 0 0 2px rgba(255,150,50,.9);
  }
</style>
</head>
<body>
  <div class="pdfview-bar">
    <span class="pdfview-bar__nome" title="${esc(nomeArquivo)}">📄 ${esc(nomeArquivo)}</span>
    <div class="pdfview-bar__sep"></div>

    <div class="pdfview-bar__center">
      <button class="tb-btn" id="btn-prev" title="Página anterior">‹</button>
      <input class="tb-page-input" id="input-page" value="1" inputmode="numeric">
      <span>/ <span id="total-pages">…</span></span>
      <button class="tb-btn" id="btn-next" title="Próxima página">›</button>

      <div class="pdfview-bar__sep"></div>

      <button class="tb-btn" id="btn-zoom-out" title="Diminuir zoom">−</button>
      <span class="tb-zoom-label" id="zoom-label">…</span>
      <button class="tb-btn" id="btn-zoom-in" title="Aumentar zoom">+</button>

      <div class="pdfview-bar__sep"></div>

      <button class="tb-btn" id="btn-draw" title="Desenhar">✏️</button>
      <button class="tb-btn" id="btn-undo" title="Desfazer">↶</button>
      <button class="tb-btn" id="btn-redo" title="Refazer">↷</button>
    </div>

    <div class="pdfview-bar__right">
      <button class="pdfview-bar__btn pdfview-bar__btn--ghost" id="btn-print" type="button">Imprimir</button>
      <button class="pdfview-bar__btn" id="btn-baixar-pdf" type="button">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Baixar PDF
      </button>
      <div class="tb-menu">
        <button class="tb-btn" id="btn-menu" title="Mais opções">⋮</button>
        <div class="tb-menu__dropdown" id="menu-dropdown">
          <button data-fit="width">Ajustar à largura</button>
          <button data-fit="page">Ajustar à página</button>
        </div>
      </div>
    </div>
  </div>

  <div class="pdfview-findbar" id="findbar" hidden>
    <input type="text" class="pdfview-findbar__input" id="find-input" placeholder="Localizar no documento" autocomplete="off" spellcheck="false">
    <span class="pdfview-findbar__count" id="find-count"></span>
    <button class="tb-btn" id="find-prev" title="Anterior (Shift+Enter)">‹</button>
    <button class="tb-btn" id="find-next" title="Próximo (Enter)">›</button>
    <button class="tb-btn" id="find-close" title="Fechar (Esc)">✕</button>
  </div>

  <div class="pdfview-scroll" id="viewer-scroll">
    <div class="pdfview-pages" id="pdfview-pages"></div>
  </div>

  <script>
    (function () {
    try {
      var blobUrl = ${JSON.stringify(blobUrl)};
      var nomeArquivo = ${JSON.stringify(nomeArquivo)};
      var zoomInicial = ${JSON.stringify(zoomInicial)};

      pdfjsLib.GlobalWorkerOptions.workerSrc = ${JSON.stringify(PDFJS_BASE + 'pdf.worker.min.js')};

      /* ── Zoom próprio do visualizador (área 'resumo_pdf') ─────
         Mesma chave/formato de localStorage que
         shared/js/utils/zoom.js usa (\`nexus_zoom_por_area\`, um
         objeto com uma entrada por área) — mas SEMPRE na área
         'resumo_pdf', nunca 'resumos'. O valor INICIAL vem de
         zoom.js::getZoomResumoPdf() — chamado na aba do Nexus Study,
         antes de abrir esta janela (ver _onGenerate) — então a
         LEITURA usa a mesma fonte de verdade do resto do site, sem
         duplicá-la aqui. Ajustes de zoom feitos NESTA aba (± ou pelos
         atalhos do menu) são gravados de volta nesta MESMA área, para
         nunca haver duas fontes de verdade divergentes sobre o zoom
         de "resumo_pdf" — e, mais importante, para NUNCA tocar na
         área "resumos" (Resumo normal), que é gravada/lida só por
         zoom.js::getZoomAtual()/setZoomAtual(). */
      var ZOOM_STORAGE_KEY = 'nexus_zoom_por_area';
      var ZOOM_AREA = 'resumo_pdf';
      function salvarZoomSite(valor) {
        try {
          var raw = localStorage.getItem(ZOOM_STORAGE_KEY);
          var obj = raw ? JSON.parse(raw) : null;
          if (!obj || typeof obj !== 'object' || Array.isArray(obj)) obj = {};
          obj[ZOOM_AREA] = valor;
          localStorage.setItem(ZOOM_STORAGE_KEY, JSON.stringify(obj));
        } catch (_) {}
      }

      var pdfDoc = null, numPages = 0, scale = 1, baseViewport1 = null;
      var currentPage = 1;
      var pages = []; // { num, wrapper, canvas, textLayerDiv, textLayerTask, dcanvas, dctx, rendered, rendering, pdfPage }

      var viewerScroll = document.getElementById('viewer-scroll');
      var pagesContainer = document.getElementById('pdfview-pages');

      var strokesByPage = new Map();
      var undoStack = [], redoStack = [];
      var drawMode = false, drawing = false, currentStroke = null;

      /* ── Estado da busca (Ctrl+F) — ver bloco "Busca" mais abaixo,
         perto da Navegação/Zoom, por depender de renderPageEntry,
         scrollToPage e pdfDoc já existirem. Declarado aqui, junto do
         resto do estado do visualizador, só para ficar num único
         lugar fácil de achar. */
      var pageTextCache = [];       // pageTextCache[i] = { items, text, offsets } da página i+1 (getTextContent, independente do canvas)
      var indexingStarted = false;
      var indexDone = false;
      var findState = { query: '', matches: [], current: -1 }; // matches: [{page, start, end}]
      var activeHighlightEls = [];
      var findDebounceTimer = null;

      function mostrarFallback() {
        var podeVoltar = !!(window.opener && !window.opener.closed);
        viewerScroll.innerHTML =
          '<div>' +
          '<p class="pdfview-msg">Não foi possível carregar esta visualização.<br>' +
          (podeVoltar
            ? 'Volte para a aba do Nexus Study e gere o PDF novamente.'
            : 'Feche esta aba e gere o PDF novamente a partir do Nexus Study.') +
          '</p></div>';
        if (podeVoltar) {
          var btn = document.createElement('button');
          btn.className = 'pdfview-bar__btn pdfview-bar__btn--ghost';
          btn.style.margin = '0 auto';
          btn.style.display = 'block';
          btn.textContent = 'Voltar para o Nexus Study';
          btn.addEventListener('click', function () { window.opener.focus(); });
          var msg = viewerScroll.querySelector('.pdfview-msg');
          if (msg) msg.insertAdjacentElement('afterend', btn);
        }
      }

      /* ── Desenho (por página) ─────────────────────────────── */
      function redrawStrokes(entry) {
        if (!entry.dctx) return;
        entry.dctx.clearRect(0, 0, entry.dcanvas.width, entry.dcanvas.height);
        (strokesByPage.get(entry.num) || []).forEach(function (s) { paintStroke(entry.dctx, s); });
      }
      function paintStroke(ctx, stroke) {
        if (!stroke.points.length) return;
        ctx.strokeStyle = '#e0475c'; ctx.lineWidth = 2.5;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (var i = 1; i < stroke.points.length; i++) ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        ctx.stroke();
      }
      function setupDrawEvents(entry) {
        entry.dcanvas.addEventListener('pointerdown', function (e) {
          if (!drawMode) return;
          drawing = true;
          var r = entry.dcanvas.getBoundingClientRect();
          currentStroke = { page: entry.num, points: [{ x: e.clientX - r.left, y: e.clientY - r.top }] };
        });
        entry.dcanvas.addEventListener('pointermove', function (e) {
          if (!drawing || !currentStroke || currentStroke.page !== entry.num) return;
          var r = entry.dcanvas.getBoundingClientRect();
          currentStroke.points.push({ x: e.clientX - r.left, y: e.clientY - r.top });
          redrawStrokes(entry);
          paintStroke(entry.dctx, currentStroke);
        });
      }
      window.addEventListener('pointerup', function () {
        if (!drawing) return;
        drawing = false;
        if (currentStroke && currentStroke.points.length > 1) {
          var arr = strokesByPage.get(currentStroke.page) || [];
          arr.push(currentStroke);
          strokesByPage.set(currentStroke.page, arr);
          undoStack.push(currentStroke);
          redoStack = [];
        }
        currentStroke = null;
      });
      document.getElementById('btn-draw').addEventListener('click', function () {
        drawMode = !drawMode;
        this.classList.toggle('tb-btn--active', drawMode);
        pagesContainer.classList.toggle('draw-mode', drawMode);
      });
      document.getElementById('btn-undo').addEventListener('click', function () {
        var last = undoStack.pop();
        if (!last) return;
        var arr = strokesByPage.get(last.page) || [];
        var idx = arr.lastIndexOf(last);
        if (idx > -1) arr.splice(idx, 1);
        redoStack.push(last);
        var entry = pages[last.page - 1];
        if (entry && entry.rendered) redrawStrokes(entry);
      });
      document.getElementById('btn-redo').addEventListener('click', function () {
        var s = redoStack.pop();
        if (!s) return;
        var arr = strokesByPage.get(s.page) || [];
        arr.push(s);
        strokesByPage.set(s.page, arr);
        undoStack.push(s);
        var entry = pages[s.page - 1];
        if (entry && entry.rendered) redrawStrokes(entry);
      });

      /* ── Renderização das páginas (documento contínuo) ───────
         Todas as páginas ganham um placeholder (do tamanho certo) na
         montagem inicial, para a barra de rolagem já ter a altura
         total do documento — mas só viram <canvas> de verdade (e só
         então são desenhadas pelo PDF.js) quando entram na tela (ou
         perto dela), via IntersectionObserver. Ao sair da tela, o
         canvas é removido de novo (liberarPageEntry) para não
         acumular memória em documentos com muitas páginas. */
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (obsEntry) {
          var num = parseInt(obsEntry.target.dataset.page, 10);
          var entry = pages[num - 1];
          if (!entry) return;
          if (obsEntry.isIntersecting) renderPageEntry(entry);
          else liberarPageEntry(entry);
        });
        updateCurrentPageFromScroll();
      }, { root: viewerScroll, rootMargin: '600px 0px', threshold: 0.01 });

      function renderPageEntry(entry) {
        if (entry.rendered) return Promise.resolve();
        if (entry.rendering) return entry.renderingPromise || Promise.resolve();
        entry.rendering = true;
        var getPagina = entry.pdfPage ? Promise.resolve(entry.pdfPage) : pdfDoc.getPage(entry.num);
        entry.renderingPromise = getPagina.then(function (page) {
          entry.pdfPage = page;
          var viewport = page.getViewport({ scale: scale });
          entry.wrapper.style.width = viewport.width + 'px';
          entry.wrapper.style.height = viewport.height + 'px';
          if (!entry.canvas) {
            entry.canvas = document.createElement('canvas');
            // Camada de texto — nasce ENTRE o canvas e o .draw-canvas
            // (ver ordem dos appendChild abaixo), pra ficar por cima
            // do desenho da página mas por baixo do desenho a lápis.
            entry.textLayerDiv = document.createElement('div');
            entry.textLayerDiv.className = 'pdfview-textlayer';
            entry.dcanvas = document.createElement('canvas');
            entry.dcanvas.className = 'draw-canvas';
            entry.wrapper.appendChild(entry.canvas);
            entry.wrapper.appendChild(entry.textLayerDiv);
            entry.wrapper.appendChild(entry.dcanvas);
            entry.dctx = entry.dcanvas.getContext('2d');
            setupDrawEvents(entry);
          }
          entry.canvas.width = viewport.width; entry.canvas.height = viewport.height;
          entry.dcanvas.width = viewport.width; entry.dcanvas.height = viewport.height;
          entry.textLayerDiv.style.width = viewport.width + 'px';
          entry.textLayerDiv.style.height = viewport.height + 'px';
          entry.textLayerDiv.innerHTML = ''; // caso o entry esteja sendo reaproveitado após um erro
          var ctx = entry.canvas.getContext('2d');

          // Texto real (PDF.js), no MESMO viewport do canvas — roda em
          // paralelo ao desenho do canvas (não depende dele), e é o
          // que torna o texto selecionável/pesquisável. Uma falha
          // aqui (raríssima) nunca derruba o desenho da página: só a
          // seleção de texto ficaria indisponível naquela página.
          entry.textLayerTask = pdfjsLib.renderTextLayer({
            textContentSource: page.streamTextContent(),
            container: entry.textLayerDiv,
            viewport: viewport,
          });

          return Promise.all([
            page.render({ canvasContext: ctx, viewport: viewport }).promise,
            entry.textLayerTask.promise.catch(function (err) {
              console.error('[Resumo PDF] Falha ao montar camada de texto:', entry.num, err);
            }),
          ]);
        }).then(function () {
          entry.rendering = false;
          entry.rendered = true;
          entry.renderingPromise = null;
          redrawStrokes(entry);
        }).catch(function (err) {
          entry.rendering = false;
          entry.renderingPromise = null;
          console.error('[Resumo PDF] Falha ao renderizar página:', entry.num, err);
        });
        return entry.renderingPromise;
      }

      function liberarPageEntry(entry) {
        if (!entry.rendered) return;
        if (entry.textLayerTask) { entry.textLayerTask.cancel(); entry.textLayerTask = null; }
        if (entry.canvas) { entry.canvas.remove(); entry.canvas = null; }
        if (entry.textLayerDiv) { entry.textLayerDiv.remove(); entry.textLayerDiv = null; }
        if (entry.dcanvas) { entry.dcanvas.remove(); entry.dcanvas = null; entry.dctx = null; }
        // Marcações de busca (ver drawHighlightsForPage) não pertencem
        // ao ciclo de vida do canvas, mas não fazem sentido sobreviver
        // sozinhas numa página que saiu de tela — evita resíduo visual
        // se o usuário rolar para longe sem navegar entre ocorrências.
        var hls = entry.wrapper.querySelectorAll('.pdfview-hl');
        if (hls.length) {
          hls.forEach(function (el) { el.remove(); });
          activeHighlightEls = activeHighlightEls.filter(function (el) { return el.isConnected; });
        }
        entry.rendered = false;
      }

      function forcarRenderVisiveis() {
        var top = viewerScroll.scrollTop, bottom = top + viewerScroll.clientHeight;
        pages.forEach(function (entry) {
          var elTop = entry.wrapper.offsetTop, elBottom = elTop + entry.wrapper.offsetHeight;
          if (elBottom > top - 600 && elTop < bottom + 600) renderPageEntry(entry);
        });
      }

      function montarPaginas(page1) {
        pagesContainer.innerHTML = '';
        pages = [];
        var w = baseViewport1.width * scale, h = baseViewport1.height * scale;
        for (var i = 1; i <= numPages; i++) {
          var wrapper = document.createElement('div');
          wrapper.className = 'pdfview-pagewrap';
          wrapper.dataset.page = i;
          wrapper.style.width = w + 'px';
          wrapper.style.height = h + 'px';
          pagesContainer.appendChild(wrapper);
          var entry = { num: i, wrapper: wrapper, canvas: null, textLayerDiv: null, textLayerTask: null, dcanvas: null, dctx: null, rendered: false, rendering: false, pdfPage: (i === 1 ? page1 : null) };
          pages.push(entry);
          observer.observe(wrapper);
        }
        forcarRenderVisiveis();
      }

      /* ── Navegação ────────────────────────────────────────── */
      function scrollToPage(num) {
        var entry = pages[num - 1];
        if (!entry) return;
        entry.wrapper.scrollIntoView({ block: 'start' });
      }
      function goTo(n) {
        n = Math.max(1, Math.min(numPages || 1, n || 1));
        currentPage = n;
        scrollToPage(n);
        document.getElementById('input-page').value = n;
      }
      var scrollTicking = false;
      viewerScroll.addEventListener('scroll', function () {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(function () { updateCurrentPageFromScroll(); scrollTicking = false; });
      });
      function updateCurrentPageFromScroll() {
        var pos = viewerScroll.scrollTop + 40;
        var atual = 1;
        for (var i = 0; i < pages.length; i++) {
          if (pages[i].wrapper.offsetTop <= pos) atual = pages[i].num; else break;
        }
        if (atual !== currentPage) {
          currentPage = atual;
          document.getElementById('input-page').value = atual;
        }
      }
      document.getElementById('btn-prev').addEventListener('click', function () { goTo(currentPage - 1); });
      document.getElementById('btn-next').addEventListener('click', function () { goTo(currentPage + 1); });
      var pageInput = document.getElementById('input-page');
      pageInput.addEventListener('change', function () { goTo(parseInt(pageInput.value, 10)); });
      pageInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') pageInput.blur(); });

      /* ── Zoom ─────────────────────────────────────────────── */
      function applyScale(novaEscala) {
        scale = Math.max(0.25, Math.min(4, novaEscala));
        var w = baseViewport1.width * scale, h = baseViewport1.height * scale;
        pages.forEach(function (entry) {
          entry.wrapper.style.width = w + 'px';
          entry.wrapper.style.height = h + 'px';
          if (entry.rendered) liberarPageEntry(entry);
        });
        clearHighlights();
        document.getElementById('zoom-label').textContent = Math.round(scale * 100) + '%';
        salvarZoomSite(Math.round(scale * 100));
        requestAnimationFrame(function () {
          scrollToPage(currentPage);
          forcarRenderVisiveis();
        });
      }
      document.getElementById('btn-zoom-in').addEventListener('click', function () { applyScale(scale + 0.1); });
      document.getElementById('btn-zoom-out').addEventListener('click', function () { applyScale(scale - 0.1); });

      function fitWidth() {
        applyScale((viewerScroll.clientWidth - 48) / baseViewport1.width);
      }
      function fitPage() {
        var wScale = (viewerScroll.clientWidth - 48) / baseViewport1.width;
        var hScale = (viewerScroll.clientHeight - 48) / baseViewport1.height;
        applyScale(Math.min(wScale, hScale));
      }

      var menuDropdown = document.getElementById('menu-dropdown');
      document.getElementById('btn-menu').addEventListener('click', function (e) {
        e.stopPropagation();
        menuDropdown.classList.toggle('open');
      });
      document.addEventListener('click', function () { menuDropdown.classList.remove('open'); });
      menuDropdown.querySelectorAll('[data-fit]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.dataset.fit === 'width') fitWidth(); else fitPage();
          menuDropdown.classList.remove('open');
        });
      });

      /* ── Busca (Ctrl+F) ───────────────────────────────────────
         POR QUE a busca nativa do navegador (Ctrl+F) não funcionava
         direito aqui: o documento tem texto real e selecionável (a
         camada de texto do PDF.js — ver .pdfview-textlayer acima —
         monta um <span> por trecho com pdfjsLib.renderTextLayer), só
         que essa camada só existe nas páginas ATUALMENTE renderizadas
         (perto da tela, ver IntersectionObserver/renderPageEntry
         acima): páginas longe da posição de rolagem são só um
         placeholder vazio, sem nenhum texto no DOM. Como o Ctrl+F do
         navegador só enxerga o que já está no DOM, ele só achava
         ocorrências nas poucas páginas próximas da rolagem atual, e
         não tinha como "ir até" uma ocorrência em outra página (nem
         sabia que ela existia).

         Por isso a solução usa o PRÓPRIO PDF.js (nenhuma lib nova),
         mas por outro caminho: em vez de depender da camada de texto
         renderizada, cada página tem seu texto extraído uma única vez
         com page.getTextContent() — API leve, que não desenha nada,
         só devolve os textos e as posições (item.transform) — e
         guardado em pageTextCache. Isso roda em segundo plano para
         TODAS as páginas assim que o PDF abre (indexAllPages), em
         paralelo ao desenho normal das páginas visíveis, e é
         bem mais barato que renderizar canvas — por isso continua
         viável mesmo em documentos com muitas páginas (ver ponto 8 do
         pedido). A busca em si roda sobre esse texto já em memória
         (uma página sem cache ainda é simplesmente pulada e entra na
         nova vez que o índice avançar — ver onIndexProgress).

         Ao navegar até uma ocorrência que caiu numa página fora de
         tela, a própria página é forçada a renderizar
         (renderPageEntry, que agora devolve a Promise do render — ver
         acima) antes de rolar até ela, e a marcação da ocorrência é
         desenhada como uma caixinha posicionada nas coordenadas reais
         do texto (via item.transform + viewport, mesmo cálculo que o
         PDF.js usa para posicionar a camada de texto) — funciona
         mesmo a página nunca tendo sido desenhada antes. */

      function ensurePageObj(num) {
        var entry = pages[num - 1];
        if (entry && entry.pdfPage) return Promise.resolve(entry.pdfPage);
        return pdfDoc.getPage(num).then(function (page) {
          if (entry) entry.pdfPage = page;
          return page;
        });
      }

      function ensurePageTextCached(num) {
        if (pageTextCache[num - 1]) return Promise.resolve(pageTextCache[num - 1]);
        return ensurePageObj(num).then(function (page) {
          return page.getTextContent().then(function (tc) {
            var text = '', offsets = [];
            tc.items.forEach(function (item, idx) {
              if (!item.str) return;
              offsets.push({ idx: idx, start: text.length, end: text.length + item.str.length });
              text += item.str;
              if (item.hasEOL) text += '\\n';
            });
            var cache = { items: tc.items, text: text, offsets: offsets };
            pageTextCache[num - 1] = cache;
            return cache;
          });
        });
      }

      // Indexa página por página, em ordem, sem travar a UI (cada
      // passo só continua depois que o anterior resolve — texto é
      // leve, mas evitamos disparar centenas de chamadas simultâneas
      // ao worker do PDF.js de uma vez). Uma falha isolada numa
      // página não interrompe as demais.
      function indexAllPages() {
        if (indexingStarted) return;
        indexingStarted = true;
        var n = 1;
        (function proximo() {
          if (n > numPages) { indexDone = true; onIndexProgress(); return; }
          var atual = n++;
          ensurePageTextCached(atual).then(onIndexProgress, onIndexProgress).then(proximo);
        })();
      }

      function onIndexProgress() {
        if (findbarEl.hidden || !findState.query) return;
        var semResultadoAntes = findState.matches.length === 0;
        recomputeMatches(true);
        if (semResultadoAntes && findState.matches.length) goToMatch(0);
      }

      function normalizarBusca(s) { return (s || '').toLocaleLowerCase('pt-BR'); }

      // Recalcula as ocorrências em TODAS as páginas já indexadas até
      // agora (não só a visível). manterAtual=true tenta continuar
      // apontando para a mesma ocorrência de antes (comparando
      // página+posição), usado quando o índice avança em segundo
      // plano e não deve "pular" a visão do usuário.
      function recomputeMatches(manterAtual) {
        var q = normalizarBusca(findState.query);
        var matches = [];
        if (q) {
          for (var p = 1; p <= numPages; p++) {
            var cache = pageTextCache[p - 1];
            if (!cache) continue;
            var hay = normalizarBusca(cache.text);
            var from = 0, found;
            while ((found = hay.indexOf(q, from)) !== -1) {
              matches.push({ page: p, start: found, end: found + q.length });
              from = found + q.length;
            }
          }
        }
        var anterior = manterAtual ? findState.matches[findState.current] : null;
        findState.matches = matches;
        if (!matches.length) {
          findState.current = -1;
        } else if (anterior) {
          var idx = matches.findIndex(function (m) { return m.page === anterior.page && m.start === anterior.start; });
          findState.current = idx !== -1 ? idx : 0;
        } else {
          findState.current = 0;
        }
        updateFindBarUI();
      }

      function updateFindBarUI() {
        var countEl = document.getElementById('find-count');
        var input = document.getElementById('find-input');
        if (!findState.query) { countEl.textContent = ''; input.classList.remove('pdfview-findbar__input--empty'); return; }
        if (!findState.matches.length) {
          countEl.textContent = indexDone ? 'Nenhum resultado' : 'Buscando…';
          input.classList.add('pdfview-findbar__input--empty');
        } else {
          countEl.textContent = (findState.current + 1) + ' de ' + findState.matches.length + (indexDone ? '' : '+');
          input.classList.remove('pdfview-findbar__input--empty');
        }
      }

      function clearHighlights() {
        activeHighlightEls.forEach(function (el) { el.remove(); });
        activeHighlightEls = [];
      }

      // Desenha a(s) caixa(s) de destaque de TODAS as ocorrências da
      // página indicada (a atual em cor mais forte), nas coordenadas
      // reais do texto — mesmo cálculo (viewport.transform combinado
      // com item.transform) que o PDF.js usa para posicionar a
      // própria camada de texto, então funciona independentemente da
      // página já ter sido desenhada antes ou não.
      function drawHighlightsForPage(pageNum) {
        clearHighlights();
        var entry = pages[pageNum - 1];
        var cache = pageTextCache[pageNum - 1];
        if (!entry || !entry.pdfPage || !cache) return;
        var viewport = entry.pdfPage.getViewport({ scale: scale });
        findState.matches.forEach(function (m, i) {
          if (m.page !== pageNum) return;
          var ativo = i === findState.current;
          cache.offsets.forEach(function (o) {
            var s = Math.max(o.start, m.start), e = Math.min(o.end, m.end);
            if (s >= e) return;
            var item = cache.items[o.idx];
            if (!item || !item.str) return;
            var tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
            var alturaPx = Math.hypot(tx[2], tx[3]);
            // item.width vem em unidades do PDF, na MESMA escala que
            // viewport.scale=1 (é o valor que o próprio PDF.js usa
            // como "canvasWidth" ao montar a camada de texto — ver
            // appendText/layout em src/display/text_layer.js). O
            // pixel final é, portanto, item.width * viewport.scale.
            // Usar aqui um fator tirado de tx (que já embute o
            // tamanho da fonte, via item.transform) multiplicava a
            // largura duas vezes e gerava destaques enormes,
            // cobrindo bem mais que a palavra encontrada.
            var larguraTotalPx = item.width ? item.width * viewport.scale : item.str.length * alturaPx * 0.5;
            var tamanhoItem = item.str.length || 1;
            var razaoIni = (s - o.start) / tamanhoItem;
            var razaoFim = (e - o.start) / tamanhoItem;

            var hl = document.createElement('div');
            hl.className = 'pdfview-hl' + (ativo ? ' pdfview-hl--active' : '');
            hl.style.left = (tx[4] + razaoIni * larguraTotalPx) + 'px';
            hl.style.top = (tx[5] - alturaPx) + 'px';
            hl.style.width = Math.max(2, (razaoFim - razaoIni) * larguraTotalPx) + 'px';
            hl.style.height = alturaPx + 'px';
            entry.wrapper.appendChild(hl);
            activeHighlightEls.push(hl);
          });
        });
      }

      function goToMatch(index) {
        if (!findState.matches.length) return;
        var n = findState.matches.length;
        findState.current = ((index % n) + n) % n;
        updateFindBarUI();
        var m = findState.matches[findState.current];
        var entry = pages[m.page - 1];
        renderPageEntry(entry).then(function () {
          drawHighlightsForPage(m.page);
          var ativo = entry.wrapper.querySelector('.pdfview-hl--active');
          if (ativo) ativo.scrollIntoView({ block: 'center', inline: 'center' });
          else scrollToPage(m.page);
          currentPage = m.page;
          document.getElementById('input-page').value = m.page;
        });
      }

      function onSearchChanged() {
        recomputeMatches(false);
        if (findState.matches.length) goToMatch(0);
        else { clearHighlights(); updateFindBarUI(); }
      }

      var findbarEl = document.getElementById('findbar');
      var findInput = document.getElementById('find-input');

      function abrirFindbar() {
        findbarEl.hidden = false;
        indexAllPages();
        findInput.focus();
        findInput.select();
      }
      function fecharFindbar() {
        findbarEl.hidden = true;
        clearHighlights();
        findState.query = '';
        findState.matches = [];
        findState.current = -1;
        findInput.value = '';
        updateFindBarUI();
      }

      // Ctrl+F (ou Cmd+F no Mac) abre a busca PRÓPRIA em vez de
      // deixar o navegador abrir a dele (que não enxergaria as
      // páginas fora de tela — ver comentário grande acima).
      document.addEventListener('keydown', function (e) {
        var atalhoBusca = (e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'f' || e.key === 'F');
        if (atalhoBusca) {
          e.preventDefault();
          if (findbarEl.hidden) abrirFindbar();
          else { findInput.focus(); findInput.select(); }
          return;
        }
        if (e.key === 'Escape' && !findbarEl.hidden) {
          e.preventDefault();
          fecharFindbar();
        }
      });

      findInput.addEventListener('input', function () {
        findState.query = findInput.value;
        clearTimeout(findDebounceTimer);
        findDebounceTimer = setTimeout(onSearchChanged, 120);
      });
      findInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (findState.matches.length) goToMatch(findState.current + (e.shiftKey ? -1 : 1));
        }
      });
      document.getElementById('find-prev').addEventListener('click', function () { goToMatch(findState.current - 1); });
      document.getElementById('find-next').addEventListener('click', function () { goToMatch(findState.current + 1); });
      document.getElementById('find-close').addEventListener('click', fecharFindbar);

      // Impressão real (PDF vetorial), via iframe oculto separado —
      // não é o mesmo canvas do visualizador, é o arquivo original.
      document.getElementById('btn-print').addEventListener('click', function () {
        var f = document.getElementById('print-frame');
        if (!f) {
          f = document.createElement('iframe');
          f.id = 'print-frame';
          f.style.display = 'none';
          f.src = blobUrl;
          document.body.appendChild(f);
        }
        function doPrint() {
          try { f.contentWindow.focus(); f.contentWindow.print(); }
          catch (err) { window.open(blobUrl, '_blank'); }
        }
        if (f.dataset.loaded === '1') doPrint();
        else f.addEventListener('load', function () { f.dataset.loaded = '1'; doPrint(); }, { once: true });
      });

      // Download — inalterado: mesmo blob original, mesmo nome vindo
      // de _buildNomeArquivo(grupos).
      document.getElementById('btn-baixar-pdf').addEventListener('click', function () {
        var a = document.createElement('a');
        a.href = blobUrl;
        a.download = nomeArquivo;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });

      pdfjsLib.getDocument({ url: blobUrl }).promise.then(function (doc) {
        pdfDoc = doc;
        numPages = doc.numPages;
        document.getElementById('total-pages').textContent = numPages;
        // Em segundo plano, não bloqueia a primeira página aparecer.
        indexAllPages();
        return doc.getPage(1);
      }).then(function (page1) {
        baseViewport1 = page1.getViewport({ scale: 1 });
        // Zoom inicial = área própria 'resumo_pdf' (ver comentário
        // sobre ZOOM_STORAGE_KEY/ZOOM_AREA acima) — nunca a área
        // 'resumos' do Resumo normal, e nunca um "ajustar à tela"
        // calculado à parte.
        scale = Math.max(0.25, Math.min(4, (zoomInicial || 100) / 100));
        document.getElementById('zoom-label').textContent = Math.round(scale * 100) + '%';
        montarPaginas(page1);
      }).catch(function (err) {
        console.error('[Resumo PDF] Falha ao carregar visualizador:', err);
        mostrarFallback();
      });

      window.addEventListener('error', function () { mostrarFallback(); });
    } catch (err) {
      console.error('[Resumo PDF] Erro no bootstrap do visualizador:', err);
      try {
        var scrollWrap = document.getElementById('viewer-scroll');
        if (scrollWrap) {
          scrollWrap.innerHTML = '<p class="pdfview-msg">Não foi possível carregar o visualizador. Feche esta aba e tente novamente a partir do Nexus Study.</p>';
        }
      } catch (_) {}
    }
    })();
  </script>
</body>
</html>`;
}

/* ══════════════════════════════════════════════
   MOBILE — detecção + download direto
   O fluxo de "abrir aba nova com o PDF renderizado"
   (ver _buildVisualizadorHTML) é pensado para
   navegador de DESKTOP. No mobile, esse mesmo fluxo é
   desnecessário e menos confiável — lá, o mobile pula
   direto para o download do Blob, na mesma aba.
══════════════════════════════════════════════ */
export function _isMobileDevice() {
  if (typeof navigator === 'undefined') return false;

  // API moderna (Chromium): quando existe, é a fonte mais confiável.
  if (navigator.userAgentData && typeof navigator.userAgentData.mobile === 'boolean') {
    return navigator.userAgentData.mobile;
  }

  const ua = navigator.userAgent || '';
  if (/Android|iPhone|iPod|Mobile|Windows Phone|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return true;

  // iPadOS moderno se identifica como "Macintosh" no userAgent — o que
  // diferencia de um Mac de verdade é ter tela sensível ao toque.
  if (/iPad/i.test(ua)) return true;
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return true;

  return false;
}

export function _baixarBlobDireto(blob, nomeArquivo) {
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = nomeArquivo;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoga depois de um tempo, não na hora — alguns navegadores mobile
  // iniciam o download de forma assíncrona; revogar cedo demais
  // derrubaria o download antes dele realmente começar.
  setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
}

/* ══════════════════════════════════════════════
   ABRIR VISUALIZADOR — navega uma aba já aberta
   (window.open('', '_blank'), síncrono, no clique — ver
   _onGenerate em resumo-pdf.js) para uma Blob URL
   contendo o HTML do visualizador, nunca com
   document.write/data:.

   document.write deixava o conteúdo "grudado" num documento
   about:blank sem URL nenhuma pra recarregar: um F5 nessa aba
   voltava para o about:blank genuinamente vazio (tela branca).

   Uma navegação para uma data: URL RESOLVERIA o problema do F5,
   mas navegadores baseados em Chromium (Chrome/Edge/Brave)
   BLOQUEIAM navegação de nível superior para data: URLs por
   política de segurança desde 2019 — a aba fica em about:blank
   e nada é carregado, sem nenhum erro visível no JS.

   Por isso o HTML do visualizador (não o PDF, o HTML da PÁGINA
   do visualizador) também vira um Blob (type: text/html) e a
   aba navega para o Blob URL desse HTML. Blob URLs não sofrem
   esse bloqueio de navegação, e — pela mesma regra do blobUrl do
   PDF — continuam válidas enquanto a aba Resumos (que as criou)
   continuar aberta, o que é exatamente o que permite ao F5
   funcionar.
══════════════════════════════════════════════ */
export function _abrirVisualizador(win, html) {
  const htmlBlob = new Blob([html], { type: 'text/html' });
  const htmlUrl = URL.createObjectURL(htmlBlob);
  win.location.href = htmlUrl;
}