/* ============================================================
   NEXUS STUDY — quiz/js/quiz_starter_modal.js  v7.0

   REGRA ÚNICA:
     Tem progresso salvo (≥ 1 resposta)? → entra direto no quiz.
     Não tem?                             → exibe modal.

   CONTROLE DE FLUXO:
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

     SEM TIMEOUT DE DESISTÊNCIA: _aguardarEngine() espera
     indefinidamente, sem prazo. O usuário pode demorar qualquer
     tempo para decidir algo no modal — quando decidir, o quiz
     precisa aparecer, sempre.

     Fluxo garantido:
       1. Página carrega → <head> sinaliza __NSM_AGUARDANDO__ = true
          → template_init monta visual leve (header, tema, nav)
          mas NÃO carrega engine/conteúdo
       2. Este modal roda (defer, mas a flag já estava true antes
          dele mesmo existir)
       3. Modal detecta progresso:
          - Tem progresso → _pularModal() → chama _completarBoot()
          - Sem progresso → exibe modal:
            - Clique em "Filtrar aulas" → vai para a tela 2
              (estrutura visual apenas — sem lógica de filtro)
            - Clique em "Todas as aulas" → conclui direto
            - Clique em "Iniciar Quiz" (tela 2) → conclui
       4. _completarBoot():
          → seta __NSM_AGUARDANDO__ = false
          → chama _carregarEngine() (idempotente)
          → remove .quiz-aguardando do container

   NOTA — TELA 2 ("Filtrar aulas"):
     A tela 2 deste modal preserva integralmente sua estrutura
     visual (HTML, CSS, animações e navegação tela1↔tela2), mas
     não contém mais nenhuma lógica de filtro. Não carrega lista
     de aulas, não coleta seleção, não persiste nem comunica nada
     a um engine de filtro. O corpo da tela 2 exibe um placeholder
     estático. O botão "Iniciar Quiz" da tela 2 simplesmente conclui
     o fluxo, da mesma forma que "Todas as aulas" na tela 1.

   DEPENDÊNCIAS:
     window.__NEXUS_QUIZ_DISC__      — definido por template_init.js
     window.__NEXUS_QUIZ_MODO__      — definido por template_init.js
     window.__NEXUS_QUIZ_SEMESTRE__  — definido por template_init.js
     window.NexusStorage             — definido por template_init.js
     window.__nexusCarregarQuiz      — definido por template_init.js
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
    _completarBoot();
  }

  /* ══════════════════════════════════════════════════════════
     CARREGAR ENGINE — ponto único de disparo do carregamento.

     Idempotente: chamadas subsequentes são ignoradas.
  ══════════════════════════════════════════════════════════ */

  var _engineCarregando = false;

  function _carregarEngine() {
    if (_engineCarregando) return;
    _engineCarregando = true;

    if (typeof window.__nexusCarregarQuiz === 'function') {
      window.__nexusCarregarQuiz();
    }
  }

  /* ══════════════════════════════════════════════════════════
     COMPLETAR BOOT — ponto único de decisão concluída pelo
     usuário (ou progresso já salvo).

     Responsabilidades (nesta ordem):
       1. Garante que o carregamento do quiz foi disparado.
       2. Revela o <main> (remove quiz-aguardando).

     Idempotente: chamadas subsequentes são ignoradas.
  ══════════════════════════════════════════════════════════ */

  var _bootConcluido = false;

  function _completarBoot() {
    if (_bootConcluido) return;
    _bootConcluido = true;

    /* 1. Garante o carregamento do quiz (idempotente) */
    _carregarEngine();

    /* 2. Revela o main — ainda sem questões, sem flash */
    var main = document.getElementById('main-content');
    if (main) {
      main.classList.remove('quiz-aguardando');
    }
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

      /* Tela 2 — estrutura visual preservada */
      '#nsm-btn-voltar{',
        'display:inline-flex;align-items:center;gap:.4rem;',
        'background:none;border:none;',
        'color:var(--text-2,#a8a49c);font-size:.8rem;font-weight:600;',
        'cursor:pointer;padding:.3rem 0;margin:1rem 1.6rem .2rem;',
        'transition:color .18s;touch-action:manipulation;',
      '}',
      '#nsm-btn-voltar:hover{color:var(--accent,#7aa8e8);}',

      '#nsm-body{padding:.8rem 1.6rem 1rem;}',

      /* Placeholder estático da tela 2 (sem lógica de filtro) */
      '#nsm-placeholder{text-align:center;padding:2.5rem 1rem;color:var(--text-3,#6e6a62);font-size:.82rem;line-height:1.6;}',
      '#nsm-placeholder i{font-size:1.4rem;color:rgba(var(--accent-rgb,122,168,232),.5);margin-bottom:.6rem;display:block;}',

      /* Footer tela 2 */
      '#nsm-footer{',
        'display:flex;align-items:center;justify-content:flex-end;',
        'padding:1rem 1.6rem 1.4rem;',
        'border-top:1px solid rgba(255,255,255,.055);',
        'gap:1rem;',
      '}',
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

    /* Tela 2 — estrutura visual preservada, sem lógica de filtro */
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

    var body = _el('div', { id: 'nsm-body' });
    var placeholder = _el('div', { id: 'nsm-placeholder' });
    placeholder.innerHTML =
      '<i class="fas fa-filter" aria-hidden="true"></i>' +
      '<div>Seleção de aulas em breve.</div>';
    body.appendChild(placeholder);
    tela2.appendChild(body);

    var footer = _el('div', { id: 'nsm-footer' });

    var btnIniciar = _el('button', { id: 'nsm-btn-iniciar', type: 'button' });
    btnIniciar.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<polygon points="5 3 19 12 5 21 5 3"/></svg> Iniciar Quiz';

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

    return { bd: bd, btnIniciar: btnIniciar, btnContinuar: btnContinuar, btnFiltrar: btnFiltrar };
  }

  /* ══════════════════════════════════════════════════════════
     EXIBIR MODAL
  ══════════════════════════════════════════════════════════ */

  function _exibirModal() {
    var ui = _construirModal();

    /* "Todas as aulas" (tela 1) — conclui o fluxo */
    ui.btnContinuar.addEventListener('click', function () {
      _concluir(ui.bd);
    });

    /* "Iniciar Quiz" (tela 2) — conclui o fluxo */
    ui.btnIniciar.addEventListener('click', function () {
      _concluir(ui.bd);
    });
  }

  /* ══════════════════════════════════════════════════════════
     CONCLUIR — fecha modal e dispara carregamento
  ══════════════════════════════════════════════════════════ */

  function _concluir(bd) {
    window.__NSM_AGUARDANDO__ = false;

    _fechar(bd, function () {
      _completarBoot();
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