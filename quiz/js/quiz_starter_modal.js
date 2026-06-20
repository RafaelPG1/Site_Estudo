/* ============================================================
   NEXUS STUDY — quiz/js/quiz_starter_modal.js  v6.3

   REGRA ÚNICA:
     Tem progresso salvo (≥ 1 resposta)? → entra direto no quiz.
     Não tem?                             → exibe modal.

   CONTROLE DE FLUXO (v6.3):
     Este script é o ÚNICO ponto que dispara o carregamento
     do quiz. O template_init.js deliberadamente NÃO chama
     _carregarQuiz() — ele expõe window.__nexusCarregarQuiz
     e aguarda este modal chamar quando pronto.

     window.__NSM_AGUARDANDO__ é sinalizado como `true` num
     script inline no <head> do template.html — ANTES de
     qualquer script defer. Isso é necessário porque este
     próprio modal também é defer, assim como o engine; sem
     a sinalização antecipada e síncrona no head, a ordem real
     de execução entre os defers não teria garantia absoluta,
     e o engine poderia (em certos cenários de cache/reload)
     renderizar antes deste modal decidir o fluxo.

     Fluxo garantido:
       1. Página carrega → <head> sinaliza __NSM_AGUARDANDO__ = true
          → template_init monta visual leve (header, tema, nav)
          mas NÃO carrega engine/conteúdo
       2. Este modal roda (defer, mas a flag já estava true antes
          dele mesmo existir)
       3. Modal detecta progresso:
          - Tem progresso → _pularModal() → chama _completarBoot()
          - Sem progresso → exibe modal → usuário confirma → _completarBoot()
       4. _completarBoot():
          → seta __NSM_AGUARDANDO__ = false
          → chama window.__nexusCarregarQuiz() (Firebase + engine)
          → remove .quiz-aguardando do container

     Resultado: engine NUNCA carrega antes do modal decidir.
     Não existe janela onde questões possam aparecer antes do modal.

   DEPENDÊNCIAS:
     window.__NEXUS_QUIZ_DISC__      — definido por template_init.js
     window.__NEXUS_QUIZ_MODO__      — definido por template_init.js
     window.__NEXUS_QUIZ_SEMESTRE__  — definido por template_init.js
     window.NexusStorage             — definido por template_init.js
     window.__nexusCarregarQuiz      — definido por template_init.js
     window.NexusFiltroAulas         — definido por quiz_engine.js
     window.__NSM_AGUARDANDO__       — definido por template.html (inline, no head)
   ============================================================ */

(function () {
  'use strict';

  /* ── window.__NSM_AGUARDANDO__ já foi sinalizado como true
     pelo script inline no <head> do template.html, antes de
     qualquer script defer (incluindo este e o engine). Isso
     garante que o engine NUNCA vê a flag indefinida na sua
     primeira checagem, independente da ordem de resolução dos
     defers. Este script é responsável apenas por setá-la de
     volta para false quando o fluxo for decidido. ──────────── */

  /* ══════════════════════════════════════════════════════════
     DETECÇÃO DE PROGRESSO
  ══════════════════════════════════════════════════════════ */

  function _temProgresso() {
    try {
      var disc = window.__NEXUS_QUIZ_DISC__     || '';
      var modo = window.__NEXUS_QUIZ_MODO__     || '';
      var sem  = window.__NEXUS_QUIZ_SEMESTRE__ || '';
      if (!disc || !modo || !sem) return false;

      var S = window.NexusStorage;
      if (!S || typeof S.loadProgress !== 'function') return false;

      var uid = 'guest';
      try {
        var u = S.get('usuario', null);
        if (u && u.uid) uid = u.uid;
      } catch (e) {}

      var discUid = uid + '_' + disc;
      var salvo   = S.loadProgress(discUid, modo, sem);

      if (!salvo || !salvo.respostas) return false;
      return Object.keys(salvo.respostas).length > 0;

    } catch (e) {
      return false;
    }
  }

  /* ══════════════════════════════════════════════════════════
     PULAR MODAL — entra direto no quiz (tem progresso salvo)
  ══════════════════════════════════════════════════════════ */

  function _pularModal() {
    window.__NSM_AGUARDANDO__ = false;
    /* Dispara o carregamento ANTES de aguardar o engine,
       pois agora o engine só existe após __nexusCarregarQuiz.
       _aguardarEngine faz polling e chama cb quando pronto. */
    _completarBoot();
    _aguardarEngine(function () {
      window.NexusFiltroAulas.iniciar(null);
    });
  }

  /* ══════════════════════════════════════════════════════════
     COMPLETAR BOOT — ponto único de decisão concluída.

     Responsabilidades (nesta ordem):
       1. Dispara o carregamento do quiz (conteúdo + UI + engine)
          que o template_init.js deliberadamente segurou.
       2. Revela o <main> (remove quiz-aguardando).

     Idempotente: chamadas subsequentes são ignoradas.
     O carregamento em (1) é assíncrono — o engine só vai
     renderizar depois de carregar. A revelação em (2) acontece
     junto, mas o container ainda estará vazio nesse momento,
     então não há flash de conteúdo parcial.
  ══════════════════════════════════════════════════════════ */

  var _bootConcluido = false;

  function _completarBoot() {
    if (_bootConcluido) return;
    _bootConcluido = true;

    /* 1. Dispara carga do quiz (Firebase + conteúdo + UI + engine) */
    if (typeof window.__nexusCarregarQuiz === 'function') {
      window.__nexusCarregarQuiz();
    }

    /* 2. Revela o main — ainda sem questões, sem flash */
    var main = document.getElementById('main-content');
    if (main) {
      main.classList.remove('quiz-aguardando');
    }
  }

  /* ══════════════════════════════════════════════════════════
     AGUARDAR ENGINE
  ══════════════════════════════════════════════════════════ */

  function _aguardarEngine(cb) {
    var elapsed = 0;
    var id = setInterval(function () {
      elapsed += 50;
      if (window.NexusFiltroAulas &&
          typeof window.NexusFiltroAulas.iniciar === 'function') {
        clearInterval(id);
        cb();
        return;
      }
      if (elapsed >= 8000) {
        clearInterval(id);
        console.warn('[NexusStarterModal] Engine não disponível após 8s.');
        _completarBoot(); /* Libera a UI mesmo assim */
      }
    }, 50);
  }

  /* ══════════════════════════════════════════════════════════
     CSS — injetado inline
  ══════════════════════════════════════════════════════════ */

  function _injetarCSS() {
    if (document.getElementById('nsm-css')) return;
    var style = document.createElement('style');
    style.id  = 'nsm-css';
    style.textContent = [

      /* Backdrop */
      '#nsm-backdrop{',
        'position:fixed;inset:0;z-index:15;',
        'display:flex;flex-direction:column;',
        'align-items:center;justify-content:flex-start;',
        'padding-top:max(5.5rem,10vh);',
        'padding-left:1.5rem;padding-right:1.5rem;padding-bottom:1.5rem;',
        'background:var(--bg,#070b14);',
        'overflow-y:auto;',
        'opacity:0;transition:opacity .3s ease;',
      '}',
      '#nsm-backdrop.nsm-visivel{opacity:1;}',
      '#nsm-backdrop.nsm-saindo{opacity:0;pointer-events:none;transition:opacity .25s ease;}',

      /* Card */
      '#nsm-card{',
        'width:100%;max-width:480px;',
        'background:rgba(14,20,34,.98);',
        'border:1px solid rgba(255,255,255,.09);',
        'border-radius:24px;',
        'box-shadow:0 0 0 1px rgba(255,255,255,.04) inset,0 40px 100px rgba(0,0,0,.7),0 12px 40px rgba(0,0,0,.5);',
        'overflow:hidden;',
        'transform:translateY(18px);',
        'transition:transform .38s cubic-bezier(.34,1.38,.64,1);',
      '}',
      '#nsm-backdrop.nsm-visivel #nsm-card{transform:translateY(0);}',
      '#nsm-backdrop.nsm-saindo  #nsm-card{transform:translateY(10px) scale(.98);transition:transform .22s ease;}',

      /* Linha decorativa no topo do card */
      '#nsm-card::before{',
        'content:"";display:block;height:2px;',
        'background:linear-gradient(90deg,transparent 0%,rgba(var(--accent-rgb,122,168,232),.6) 30%,rgba(var(--accent-rgb,122,168,232),.9) 50%,rgba(var(--accent-rgb,122,168,232),.6) 70%,transparent 100%);',
      '}',

      /* Header */
      '#nsm-head{',
        'padding:2.2rem 2.2rem 1.5rem;text-align:center;',
        'background:linear-gradient(160deg,rgba(var(--accent-rgb,122,168,232),.055) 0%,transparent 55%);',
        'border-bottom:1px solid rgba(255,255,255,.055);',
      '}',
      '#nsm-eyebrow{',
        'display:inline-flex;align-items:center;gap:.4rem;',
        'font-size:.58rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;',
        'color:var(--accent,#7aa8e8);',
        'background:rgba(var(--accent-rgb,122,168,232),.1);',
        'border:1px solid rgba(var(--accent-rgb,122,168,232),.2);',
        'padding:.26rem .8rem;border-radius:99px;margin-bottom:1.1rem;',
      '}',
      '#nsm-titulo{',
        'font-family:var(--font-display,"Cormorant Garamond",Georgia,serif);',
        'font-size:2rem;font-weight:600;',
        'color:var(--text-1,#f0ede6);',
        'line-height:1.2;letter-spacing:-.025em;margin:0 0 .5rem;',
      '}',
      '#nsm-subtitulo{font-size:.82rem;color:var(--text-2,#a8a49c);line-height:1.55;margin:0;}',

      /* Telas */
      '.nsm-tela{transition:opacity .2s ease,transform .2s ease;}',
      '.nsm-tela--entrando{opacity:0;transform:translateY(6px);pointer-events:none;}',
      '.nsm-tela--visivel{opacity:1;transform:translateY(0);}',
      '.nsm-tela--saindo{opacity:0;transform:translateY(-6px);pointer-events:none;}',

      /* Tela 1 — botões de opção */
      '#nsm-tela1-btns{display:flex;flex-direction:column;gap:.6rem;padding:1.4rem 1.6rem .8rem;}',

      '.nsm-option{',
        'display:flex;align-items:center;gap:1rem;',
        'width:100%;padding:1rem 1.1rem;',
        'background:rgba(255,255,255,.03);',
        'border:1px solid rgba(255,255,255,.08);',
        'border-radius:14px;cursor:pointer;text-align:left;',
        'color:var(--text-1,#f0ede6);',
        'transition:background .2s,border-color .2s,transform .18s,box-shadow .2s;',
        'touch-action:manipulation;',
      '}',
      '.nsm-option:hover{',
        'background:rgba(var(--accent-rgb,122,168,232),.07);',
        'border-color:rgba(var(--accent-rgb,122,168,232),.28);',
        'transform:translateY(-1px);',
        'box-shadow:0 6px 20px rgba(0,0,0,.3),0 0 0 1px rgba(var(--accent-rgb,122,168,232),.12) inset;',
      '}',
      '.nsm-option:active{transform:translateY(0) scale(.99);}',
      '.nsm-option__icon{',
        'font-size:1.65rem;line-height:1;flex-shrink:0;',
        'width:44px;height:44px;display:flex;align-items:center;justify-content:center;',
        'background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:12px;',
        'transition:background .2s,border-color .2s,transform .18s;',
      '}',
      '.nsm-option:hover .nsm-option__icon{',
        'background:rgba(var(--accent-rgb,122,168,232),.1);',
        'border-color:rgba(var(--accent-rgb,122,168,232),.25);',
        'transform:scale(1.06) rotate(-2deg);',
      '}',
      '.nsm-option__body{flex:1;display:flex;flex-direction:column;gap:.2rem;min-width:0;}',
      '.nsm-option__label{font-size:.92rem;font-weight:600;color:var(--text-1,#f0ede6);line-height:1.3;}',
      '.nsm-option__desc{font-size:.75rem;color:var(--text-2,#a8a49c);line-height:1.45;}',
      '.nsm-option__arrow{flex-shrink:0;color:rgba(255,255,255,.2);transition:color .2s,transform .2s;}',
      '.nsm-option:hover .nsm-option__arrow{color:var(--accent,#7aa8e8);transform:translateX(3px);}',

      /* Rodapé tela 1 */
      '#nsm-tela1-footer{padding:.5rem 1.6rem 1.4rem;text-align:center;}',
      '#nsm-tela1-footer p{font-size:.7rem;color:var(--text-3,#6e6a62);line-height:1.5;margin:0;}',
      '#nsm-tela1-footer i{color:rgba(var(--accent-rgb,122,168,232),.5);}',
      '#nsm-tela1-footer strong{color:var(--text-2,#a8a49c);font-weight:600;}',

      /* Tela 2 — lista de aulas */
      '#nsm-btn-voltar{',
        'display:inline-flex;align-items:center;gap:.4rem;',
        'background:none;border:none;',
        'color:var(--text-2,#a8a49c);font-size:.8rem;font-weight:600;',
        'cursor:pointer;padding:.3rem 0;margin:1rem 1.6rem .2rem;',
        'transition:color .18s;touch-action:manipulation;',
      '}',
      '#nsm-btn-voltar:hover{color:var(--accent,#7aa8e8);}',

      '#nsm-body{padding:.8rem 1.6rem 1rem;}',

      '#nsm-loading{text-align:center;padding:2.5rem 0;color:var(--text-3,#6e6a62);font-size:.82rem;}',
      '#nsm-loading-dot{',
        'display:inline-block;width:6px;height:6px;border-radius:50%;',
        'background:var(--accent,#7aa8e8);opacity:.5;',
        'animation:nsm-pulse 1.2s ease-in-out infinite;margin-bottom:.7rem;',
      '}',
      '@keyframes nsm-pulse{0%,100%{opacity:.2;transform:scale(.8);}50%{opacity:.8;transform:scale(1.2);}}',

      '#nsm-acoes{display:flex;gap:.55rem;margin-bottom:1rem;}',
      '.nsm-acao-btn{',
        'flex:1;padding:.48rem .5rem;',
        'background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);',
        'border-radius:10px;color:var(--text-2,#a8a49c);',
        'font-size:.78rem;font-weight:600;letter-spacing:.03em;',
        'cursor:pointer;transition:background .18s,border-color .18s,color .18s;',
        'touch-action:manipulation;',
      '}',
      '.nsm-acao-btn:hover{',
        'background:rgba(var(--accent-rgb,122,168,232),.1);',
        'border-color:rgba(var(--accent-rgb,122,168,232),.25);',
        'color:var(--accent,#7aa8e8);',
      '}',

      '#nsm-lista{',
        'list-style:none;margin:0;padding:0;',
        'display:flex;flex-direction:column;gap:.45rem;',
        'max-height:38vh;overflow-y:auto;padding-right:2px;',
      '}',
      '#nsm-lista::-webkit-scrollbar{width:4px;}',
      '#nsm-lista::-webkit-scrollbar-track{background:transparent;}',
      '#nsm-lista::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px;}',

      '.nsm-item{',
        'display:flex;align-items:center;gap:.85rem;',
        'padding:.75rem .95rem;',
        'background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);',
        'border-radius:12px;cursor:pointer;',
        'transition:background .18s,border-color .18s,transform .16s;',
        'touch-action:manipulation;user-select:none;',
      '}',
      '.nsm-item:hover{',
        'background:rgba(var(--accent-rgb,122,168,232),.07);',
        'border-color:rgba(var(--accent-rgb,122,168,232),.2);',
        'transform:translateX(2px);',
      '}',
      '.nsm-chk-box{',
        'width:20px;height:20px;flex-shrink:0;',
        'border:2px solid rgba(255,255,255,.2);border-radius:6px;',
        'display:flex;align-items:center;justify-content:center;',
        'transition:background .18s,border-color .18s;',
      '}',
      '.nsm-item.nsm-marcado .nsm-chk-box{',
        'background:var(--accent,#7aa8e8);border-color:var(--accent,#7aa8e8);',
      '}',
      '.nsm-chk-icon{',
        'width:12px;height:12px;stroke:var(--bg,#070b14);',
        'stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;',
        'opacity:0;transition:opacity .15s;',
      '}',
      '.nsm-item.nsm-marcado .nsm-chk-icon{opacity:1;}',
      '.nsm-aula-txt{font-size:.85rem;color:var(--text-1,#f0ede6);line-height:1.35;}',
      '.nsm-item.nsm-marcado .nsm-aula-txt{color:var(--text-1,#f0ede6);}',

      /* Footer tela 2 */
      '#nsm-footer{',
        'display:flex;align-items:center;justify-content:space-between;',
        'padding:1rem 1.6rem 1.4rem;',
        'border-top:1px solid rgba(255,255,255,.055);',
        'gap:1rem;',
      '}',
      '#nsm-contador{font-size:.78rem;color:var(--text-2,#a8a49c);flex-shrink:0;}',
      '#nsm-contador strong{color:var(--text-1,#f0ede6);}',
      '#nsm-btn-iniciar{',
        'display:inline-flex;align-items:center;gap:.55rem;',
        'padding:.65rem 1.4rem;',
        'background:var(--accent,#7aa8e8);border:none;border-radius:12px;',
        'color:#070b14;font-size:.88rem;font-weight:700;',
        'cursor:pointer;transition:opacity .18s,transform .18s,box-shadow .18s;',
        'touch-action:manipulation;white-space:nowrap;',
      '}',
      '#nsm-btn-iniciar:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,0,0,.3);}',
      '#nsm-btn-iniciar:active{transform:translateY(0);}',
      '#nsm-btn-iniciar:disabled{opacity:.35;cursor:not-allowed;transform:none;}',

    ].join('');
    document.head.appendChild(style);
  }

  /* ══════════════════════════════════════════════════════════
     UTILITÁRIO — criar elemento
  ══════════════════════════════════════════════════════════ */

  var _SETA =
    '<svg class="nsm-option__arrow" width="16" height="16" viewBox="0 0 24 24"' +
    ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"' +
    ' stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>';

  function _el(tag, attrs, texto) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') el.className = attrs[k];
      else el.setAttribute(k, attrs[k]);
    });
    if (texto) el.textContent = texto;
    return el;
  }

  /* ══════════════════════════════════════════════════════════
     FECHAR MODAL
  ══════════════════════════════════════════════════════════ */

  function _fechar(bd, cb) {
    bd.classList.add('nsm-saindo');
    setTimeout(function () {
      if (bd.parentNode) bd.parentNode.removeChild(bd);
      if (typeof cb === 'function') cb();
    }, 280);
  }

  /* ══════════════════════════════════════════════════════════
     CONSTRUIR MODAL
  ══════════════════════════════════════════════════════════ */

  function _construirModal() {
    var bd = _el('div', { id: 'nsm-backdrop' });

    var card = _el('div', { id: 'nsm-card' });

    var head      = _el('div', { id: 'nsm-head' });
    var eyebrow   = _el('div', { id: 'nsm-eyebrow' });
    eyebrow.innerHTML = '<i class="fas fa-rocket" aria-hidden="true"></i> Preparar Quiz';
    var titulo    = _el('h2', { id: 'nsm-titulo'    }, 'Iniciar Quiz');
    var subtitulo = _el('p',  { id: 'nsm-subtitulo' }, 'Escolha como deseja iniciar');

    head.appendChild(eyebrow);
    head.appendChild(titulo);
    head.appendChild(subtitulo);
    card.appendChild(head);

    /* Tela 1 */
    var tela1   = _el('div', { id: 'nsm-tela1', class: 'nsm-tela nsm-tela--entrando' });
    var t1Btns  = _el('div', { id: 'nsm-tela1-btns' });

    var btnContinuar = _el('button', { type: 'button', class: 'nsm-option' });
    btnContinuar.innerHTML =
      '<div class="nsm-option__icon">📚</div>' +
      '<div class="nsm-option__body">' +
        '<span class="nsm-option__label">Todas as aulas</span>' +
        '<span class="nsm-option__desc">Iniciar com todas as aulas disponíveis.</span>' +
      '</div>' + _SETA;

    var btnFiltrar = _el('button', { type: 'button', class: 'nsm-option' });
    btnFiltrar.innerHTML =
      '<div class="nsm-option__icon">🎯</div>' +
      '<div class="nsm-option__body">' +
        '<span class="nsm-option__label">Filtrar aulas</span>' +
        '<span class="nsm-option__desc">Selecionar apenas algumas aulas antes de iniciar.</span>' +
      '</div>' + _SETA;

    t1Btns.appendChild(btnContinuar);
    t1Btns.appendChild(btnFiltrar);
    tela1.appendChild(t1Btns);

    var t1Footer = _el('div', { id: 'nsm-tela1-footer' });
    t1Footer.innerHTML =
      '<p>' +
        '<i class="fas fa-circle-info"></i>' +
        ' Você pode alterar as aulas a qualquer momento pelo botão <strong>Filtrar aulas</strong>.' +
      '</p>';
    tela1.appendChild(t1Footer);
    card.appendChild(tela1);

    /* Tela 2 */
    var tela2 = _el('div', { id: 'nsm-tela2', class: 'nsm-tela nsm-tela--entrando' });
    tela2.style.display = 'none';

    var t2WrapVoltar = _el('div');
    var btnVoltar    = _el('button', { type: 'button', id: 'nsm-btn-voltar' });
    btnVoltar.innerHTML =
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<polyline points="15 18 9 12 15 6"/></svg> Voltar';
    t2WrapVoltar.appendChild(btnVoltar);
    tela2.appendChild(t2WrapVoltar);

    var body    = _el('div', { id: 'nsm-body' });
    var loading = _el('div', { id: 'nsm-loading' });
    loading.innerHTML = '<div id="nsm-loading-dot"></div><div>Carregando aulas...</div>';
    body.appendChild(loading);
    tela2.appendChild(body);

    var footer   = _el('div', { id: 'nsm-footer' });
    var contador = _el('div', { id: 'nsm-contador' });
    contador.innerHTML = '<strong>0</strong> de 0 aulas selecionadas';

    var btnIniciar = _el('button', { id: 'nsm-btn-iniciar', type: 'button' });
    btnIniciar.disabled = true;
    btnIniciar.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<polygon points="5 3 19 12 5 21 5 3"/></svg> Iniciar Quiz';

    footer.appendChild(contador);
    footer.appendChild(btnIniciar);
    tela2.appendChild(footer);

    card.appendChild(tela2);
    bd.appendChild(card);
    document.body.appendChild(bd);

    /* Animação de entrada */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        bd.classList.add('nsm-visivel');
        tela1.classList.remove('nsm-tela--entrando');
        tela1.classList.add('nsm-tela--visivel');
      });
    });

    /* Navegação Tela1 ↔ Tela2 */
    function _irTela2() {
      tela1.classList.add('nsm-tela--saindo');
      setTimeout(function () {
        tela1.style.display = 'none';
        tela1.classList.remove('nsm-tela--saindo', 'nsm-tela--visivel');
        subtitulo.textContent = 'Selecione as aulas que deseja estudar';
        tela2.style.display = 'block';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            tela2.classList.remove('nsm-tela--entrando');
            tela2.classList.add('nsm-tela--visivel');
          });
        });
      }, 200);
    }

    function _irTela1() {
      tela2.classList.add('nsm-tela--saindo');
      setTimeout(function () {
        tela2.style.display = 'none';
        tela2.classList.remove('nsm-tela--saindo', 'nsm-tela--visivel');
        subtitulo.textContent = 'Escolha como deseja iniciar';
        tela1.style.display = 'block';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            tela1.classList.remove('nsm-tela--entrando');
            tela1.classList.add('nsm-tela--visivel');
          });
        });
      }, 200);
    }

    btnFiltrar.addEventListener('click', _irTela2);
    btnVoltar.addEventListener('click',  _irTela1);

    return { bd: bd, body: body, loading: loading, contador: contador, btnIniciar: btnIniciar, btnContinuar: btnContinuar };
  }

  /* ══════════════════════════════════════════════════════════
     PREENCHER LISTA DE AULAS (tela 2)
  ══════════════════════════════════════════════════════════ */

  function _preencherLista(body, loading, contador, btnIniciar, aulas) {
    if (loading.parentNode) loading.parentNode.removeChild(loading);

    var totalAulas = aulas.length;
    var marcadas   = new Set(aulas);

    var acoes      = _el('div', { id: 'nsm-acoes' });
    var btnTodas   = _el('button', { class: 'nsm-acao-btn', type: 'button' }, 'Todas');
    var btnNenhuma = _el('button', { class: 'nsm-acao-btn', type: 'button' }, 'Nenhuma');
    acoes.appendChild(btnTodas);
    acoes.appendChild(btnNenhuma);
    body.appendChild(acoes);

    var lista = _el('ul', { id: 'nsm-lista', role: 'group', 'aria-label': 'Aulas disponíveis' });
    var itens  = [];

    aulas.forEach(function (aula) {
      var li = _el('li', { class: 'nsm-item nsm-marcado', role: 'checkbox',
                            'aria-checked': 'true', tabindex: '0' });
      var chkBox = _el('div', { class: 'nsm-chk-box', 'aria-hidden': 'true' });
      chkBox.innerHTML =
        '<svg class="nsm-chk-icon" viewBox="0 0 12 12" aria-hidden="true">' +
          '<polyline points="1.5 6 4.5 9.5 10.5 2.5"/>' +
        '</svg>';
      var txt = _el('span', { class: 'nsm-aula-txt' }, aula);
      li.appendChild(chkBox);
      li.appendChild(txt);
      lista.appendChild(li);
      itens.push({ el: li, aula: aula });

      function _toggle() {
        if (marcadas.has(aula)) {
          marcadas.delete(aula);
          li.classList.remove('nsm-marcado');
          li.setAttribute('aria-checked', 'false');
        } else {
          marcadas.add(aula);
          li.classList.add('nsm-marcado');
          li.setAttribute('aria-checked', 'true');
        }
        _atualizarContador();
      }

      li.addEventListener('click', _toggle);
      li.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); _toggle(); }
      });
    });

    body.appendChild(lista);

    function _atualizarContador() {
      var n = marcadas.size;
      contador.innerHTML =
        '<strong>' + n + '</strong> de ' + totalAulas +
        ' aula' + (totalAulas !== 1 ? 's' : '') +
        ' selecionada' + (totalAulas !== 1 ? 's' : '');
      btnIniciar.disabled = (n === 0);
    }
    _atualizarContador();

    btnTodas.addEventListener('click', function () {
      itens.forEach(function (it) {
        marcadas.add(it.aula);
        it.el.classList.add('nsm-marcado');
        it.el.setAttribute('aria-checked', 'true');
      });
      _atualizarContador();
    });

    btnNenhuma.addEventListener('click', function () {
      marcadas.clear();
      itens.forEach(function (it) {
        it.el.classList.remove('nsm-marcado');
        it.el.setAttribute('aria-checked', 'false');
      });
      _atualizarContador();
    });

    return function getMarcadas() {
      if (marcadas.size === 0 || marcadas.size === totalAulas) return null;
      return new Set(marcadas);
    };
  }

  /* ══════════════════════════════════════════════════════════
     EXIBIR MODAL
  ══════════════════════════════════════════════════════════ */

  function _exibirModal() {
    var ui          = _construirModal();
    var getMarcadas = null;

    _aguardarEngine(function () {
      var aulas = window.NexusFiltroAulas.listarAulas
        ? window.NexusFiltroAulas.listarAulas()
        : [];

      if (aulas.length <= 1) {
        var ultimoBtn = ui.btnContinuar.parentNode &&
          ui.btnContinuar.parentNode.lastElementChild;
        if (ultimoBtn && ultimoBtn !== ui.btnContinuar) {
          ultimoBtn.style.display = 'none';
        }
      }

      getMarcadas = _preencherLista(
        ui.body, ui.loading, ui.contador, ui.btnIniciar, aulas
      );
    });

    /* "Todas as aulas" — sem filtro */
    ui.btnContinuar.addEventListener('click', function () {
      _concluir(ui.bd, null);
    });

    /* "Iniciar Quiz" (tela 2) */
    ui.btnIniciar.addEventListener('click', function () {
      var sel = getMarcadas ? getMarcadas() : null;
      _concluir(ui.bd, sel);
    });
  }

  /* ══════════════════════════════════════════════════════════
     CONCLUIR — fecha modal, dispara carregamento e aplica filtro
  ══════════════════════════════════════════════════════════ */

  function _concluir(bd, aulasSelecionadas) {
    window.__NSM_AGUARDANDO__ = false;

    _fechar(bd, function () {
      /* Dispara carregamento do quiz e revela container.
         Quando o engine carregar, verá __NSM_AGUARDANDO__ = false
         e renderizará automaticamente — EXCETO se houver filtro
         de aulas específico, que precisa ser aplicado via iniciar(). */
      _completarBoot();

      if (aulasSelecionadas !== null) {
        /* Com filtro: aguarda engine e aplica seleção */
        _aguardarEngine(function () {
          if (window.NexusFiltroAulas &&
              typeof window.NexusFiltroAulas.iniciar === 'function') {
            window.NexusFiltroAulas.iniciar(aulasSelecionadas);
          }
        });
      }
      /* Sem filtro (null): engine renderiza tudo sozinho */
    });
  }

  /* ══════════════════════════════════════════════════════════
     BOOT — ponto de entrada
  ══════════════════════════════════════════════════════════ */

  function _boot() {
    _injetarCSS();

    if (_temProgresso()) {
      /* Tem progresso → entra direto */
      _pularModal();
    } else {
      /* Sem progresso → exibe modal */
      _exibirModal();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _boot);
  } else {
    _boot();
  }

})();