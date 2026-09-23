/* ============================================================
   NEXUS STUDY — quiz/js/quiz_starter_modal.js  v8.2

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
            - Clique em "Filtrar aulas" → chama NexusFilter.open();
              escuta nexus:filtroAlterado e conclui ao aplicar.
            - Clique em "Todas as aulas" → conclui direto
       4. _completarBoot():
          → seta __NSM_AGUARDANDO__ = false
          → chama _carregarEngine() (idempotente)
          → remove .quiz-aguardando do container

   INTEGRAÇÃO COM filter.js:
     filter.js é carregado ANTES deste modal (ordem garantida pelo
     template.html). Portanto window.NexusFilter já existe quando
     qualquer interação do usuário ocorre. O modal chama apenas:
       NexusFilter.open()
     Sem polling. Sem espera. Sem dependência circular.

   QUIZ COM UMA ÚNICA AULA — v8.2:
     Se o conteúdo tem menos de 2 aulas, não há o que filtrar:
     o modal mostra apenas um botão "Iniciar quiz" (sem "Todas as
     aulas" / "Filtrar aulas" e sem a nota do rodapé sobre filtro).
     Para saber a contagem, o modal aguarda __nexusPreCarregarConteudo()
     antes de montar — o mesmo carregamento que o engine reutiliza,
     então não há custo extra. Se NexusFilter.contarAulas não existir
     ou o conteúdo falhar de um jeito inesperado, cai no comportamento
     anterior (duas opções).

   CONTEXTO VISUAL (Disciplina / Modo) — v8.1:
     O modal agora exibe, entre o título e o subtítulo, dois
     chips discretos com a disciplina e o modo do quiz atual.

     - O MODO usa o mesmo texto já adotado pelo breadcrumb de
       template_init.js (AVA / Questões / ENADE / Fixação),
       replicado aqui como um mapa mínimo (_MODO_LABELS) — não
       há acesso direto a MODOS_CONFIG porque ele não é exportado
       por template_init.js. Modos desconhecidos caem num
       fallback que apenas capitaliza a primeira letra.

     - A DISCIPLINA é resolvida via import() dinâmico de
       ../../src/global.js, reaproveitando getDisciplinasDeSemestre()
       — a MESMA fonte de dados que template_init.js já usa para
       resolver o nome oficial da disciplina. Nenhuma lista nova
       é criada. Como o módulo já foi carregado/avaliado antes
       (por template_init.js), esse import é praticamente
       instantâneo (cache de módulo do navegador).

     - Resolução é assíncrona: o chip de disciplina nasce com o
       id cru (ex.: "estruturas_dados") e é substituído pelo nome
       oficial assim que a promise resolve — sem bloquear a
       abertura do modal.

     - Nenhum outro dado (semestre, AP, progresso, contagem de
       questões/aulas) é exibido — apenas disciplina e modo.

   DEPENDÊNCIAS:
     window.__NEXUS_QUIZ_DISC__      — definido por template_init.js
     window.__NEXUS_QUIZ_MODO__      — definido por template_init.js
     window.__NEXUS_QUIZ_SEMESTRE__  — definido por template_init.js
     window.NexusStorage             — definido por template_init.js
     window.__nexusCarregarQuiz      — definido por template_init.js
     window.__NSM_AGUARDANDO__       — definido por template.html (inline, no head)
     window.NexusFilter              — definido por filter.js (carregado antes)
   ============================================================ */

(function () {
  'use strict';

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
     PULAR MODAL
  ══════════════════════════════════════════════════════════ */

  function _pularModal() {
    window.__NSM_AGUARDANDO__ = false;
    _completarBoot();
  }

  /* ══════════════════════════════════════════════════════════
     CARREGAR ENGINE
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
     COMPLETAR BOOT
  ══════════════════════════════════════════════════════════ */

  var _bootConcluido = false;

  function _completarBoot() {
    if (_bootConcluido) return;
    _bootConcluido = true;

    _carregarEngine();

    var main = document.getElementById('main-content');
    if (main) {
      main.classList.remove('quiz-aguardando');
    }
  }

  /* ══════════════════════════════════════════════════════════
     CONTEXTO — DISCIPLINA / MODO (v8.1)
  ══════════════════════════════════════════════════════════ */

  /* Mesmo texto já usado no breadcrumb de MODOS_CONFIG em
     template_init.js. Pequeno mapa local porque MODOS_CONFIG
     não é exportado por aquele módulo — evita import só por isso. */
  var _MODO_LABELS = {
    ava:      'AVA',
    questoes: 'Questões',
    enade:    'ENADE',
    fixacao:  'Fixação',
  };

  /* Ícones SVG dos modos — mesma fonte visual de _ICONES_MODO em
     disciplinas_init.js. Cópia local para não importar aquele módulo
     inteiro (ele tem side effects ao carregar). */
  var _ICONES_MODO = {
    ava:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>' +
        '<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' +
      '</svg>',
    questoes:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="12" r="10"/>' +
        '<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>' +
        '<line x1="12" y1="17" x2="12.01" y2="17"/>' +
      '</svg>',
    enade:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
        '<line x1="3" y1="22" x2="21" y2="22"/>' +
        '<line x1="6" y1="18" x2="6" y2="11"/>' +
        '<line x1="10" y1="18" x2="10" y2="11"/>' +
        '<line x1="14" y1="18" x2="14" y2="11"/>' +
        '<line x1="18" y1="18" x2="18" y2="11"/>' +
        '<polygon points="12 2 20 7 4 7"/>' +
      '</svg>',
    fixacao:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M12 17v5"/>' +
        '<path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>' +
      '</svg>',
  };

  function _resolverModoLabel(modo) {
    if (!modo) return '';
    if (_MODO_LABELS[modo]) return _MODO_LABELS[modo];
    try {
      return modo.charAt(0).toUpperCase() + modo.slice(1);
    } catch (e) {
      return modo;
    }
  }

  /* Resolve nome + emoji oficiais da disciplina reaproveitando a MESMA
     fonte de dados que template_init.js (info.emoji → #disc-emoji) e
     quiz.js (disc.emoji nos cards) já usam: getDisciplinasDeSemestre()
     em src/global.js, via import() dinâmico — sem duplicar lista
     nenhuma nem inventar novo mapa de ícones. Cacheado numa promise
     para não reimportar à toa. */
  var _infoDisciplinaPromise = null;

  function _resolverInfoDisciplina(disc, semestre) {
    if (_infoDisciplinaPromise) return _infoDisciplinaPromise;

    _infoDisciplinaPromise = import('../../src/global.js')
      .then(function (mod) {
        if (!semestre || typeof mod.getDisciplinasDeSemestre !== 'function') return null;
        var lista = mod.getDisciplinasDeSemestre(semestre);
        var info  = lista && lista.find(function (d) { return d.id === disc; });
        if (!info) return null;

        var icone = (typeof mod.resolveIcone === 'function')
          ? mod.resolveIcone(info.icone)
          : null;

        return { nome: info.nome, icone: icone };
      })
      .catch(function () { return null; });

    return _infoDisciplinaPromise;
  }

  /* Monta o bloco de chips (Disciplina / Modo). Retorna null se
     não houver disc nem modo definidos (nunca deve acontecer em
     uso normal, mas evita quebrar o modal). */
  function _construirContexto() {
    var disc = window.__NEXUS_QUIZ_DISC__     || '';
    var modo = window.__NEXUS_QUIZ_MODO__     || '';
    var sem  = window.__NEXUS_QUIZ_SEMESTRE__ || '';

    if (!disc && !modo) return null;

    var wrap = _el('div', { id: 'nsm-context' });

    /* Cores: reaproveita as CSS custom properties já aplicadas por
       template_init.js (_aplicarTema → aplicarCoresDisciplina), que
       define --accent/--accent-rgb (cor primária da disciplina atual)
       e os tokens --cor-tema-2/--cor-tema-2-rgb (cor secundária) já
       existentes em template.css. Nenhuma cor nova é criada aqui —
       o chip de disciplina usa a primária, o de modo usa a secundária,
       ambas já resolvidas automaticamente para a disciplina em questão. */

    if (disc) {
      var chipDisc = _el('div', { class: 'nsm-ctx-chip nsm-ctx-chip--disc' });
      var iconDisc = _el('div', { class: 'nsm-ctx-icon' });
      // placeholder até o resolveIcone() chegar
      iconDisc.innerHTML = '';
      var bodyDisc  = _el('div', { class: 'nsm-ctx-body' });
      var labelDisc = _el('span', { class: 'nsm-ctx-label' }, 'Disciplina');
      var valorDisc = _el('span', { class: 'nsm-ctx-value' }, disc);

      bodyDisc.appendChild(labelDisc);
      bodyDisc.appendChild(valorDisc);
      chipDisc.appendChild(iconDisc);
      chipDisc.appendChild(bodyDisc);
      wrap.appendChild(chipDisc);

      _resolverInfoDisciplina(disc, sem).then(function (info) {
        if (!info) return;
        if (info.nome)  valorDisc.textContent = info.nome;
        if (info.icone) iconDisc.innerHTML = info.icone;
      });
    }

    if (modo) {
      var chipModo = _el('div', { class: 'nsm-ctx-chip nsm-ctx-chip--modo' });
      var iconModo = _el('div', { class: 'nsm-ctx-icon' });
      iconModo.innerHTML = _ICONES_MODO[modo] || '';
      var bodyModo  = _el('div', { class: 'nsm-ctx-body' });
      var labelModo = _el('span', { class: 'nsm-ctx-label' }, 'Modo');
      var valorModo = _el('span', { class: 'nsm-ctx-value' }, _resolverModoLabel(modo));

      bodyModo.appendChild(labelModo);
      bodyModo.appendChild(valorModo);
      chipModo.appendChild(iconModo);
      chipModo.appendChild(bodyModo);
      wrap.appendChild(chipModo);
    }

    return wrap;
  }

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */

  function _injetarCSS() {
    if (document.getElementById('nsm-css')) return;
    var style = document.createElement('style');
    style.id  = 'nsm-css';
    style.textContent = [

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

      '#nsm-card::before{',
        'content:"";display:block;height:2px;',
        'background:linear-gradient(90deg,transparent 0%,rgba(var(--accent-rgb,122,168,232),.6) 30%,rgba(var(--accent-rgb,122,168,232),.9) 50%,rgba(var(--accent-rgb,122,168,232),.6) 70%,transparent 100%);',
      '}',

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

      /* ── Chips de contexto (Disciplina / Modo) ─────────────
         Ficam entre o título e o subtítulo. Cada chip usa a cor
         já resolvida para a disciplina atual (--accent / --accent-rgb,
         aplicadas por template_init.js) e a cor secundária do tema
         (--cor-tema-2 / --cor-tema-2-rgb, já definidas em template.css) —
         nenhuma cor nova é criada, e o resultado muda automaticamente
         por disciplina. */
      '#nsm-context{',
        'display:grid;grid-template-columns:1fr 1fr;gap:.65rem;',
        'margin:0 0 1.1rem;',
      '}',
      '.nsm-ctx-chip{',
        'display:flex;align-items:center;gap:.65rem;',
        'padding:.75rem .8rem;text-align:left;',
        'border-radius:13px;border:1px solid rgba(255,255,255,.08);',
        'background:rgba(255,255,255,.025);',
        'box-shadow:0 4px 16px rgba(0,0,0,.22);',
      '}',
      '.nsm-ctx-chip--disc{',
        'border-color:rgba(var(--accent-rgb,122,168,232),.35);',
        'border-left:3px solid var(--accent,#7aa8e8);',
        'background:linear-gradient(160deg,rgba(var(--accent-rgb,122,168,232),.16) 0%,rgba(255,255,255,.02) 100%);',
      '}',
      '.nsm-ctx-chip--modo{',
        'border-color:rgba(var(--cor-tema-2-rgb,61,217,194),.35);',
        'border-left:3px solid var(--cor-tema-2,#3dd9c2);',
        'background:linear-gradient(160deg,rgba(var(--cor-tema-2-rgb,61,217,194),.16) 0%,rgba(255,255,255,.02) 100%);',
      '}',
      '.nsm-ctx-icon{',
        'flex-shrink:0;width:36px;height:36px;border-radius:10px;',
        'display:flex;align-items:center;justify-content:center;font-size:.92rem;',
      '}',
      '.nsm-ctx-icon svg{width:18px;height:18px;display:block;}',
      '.nsm-ctx-chip--disc .nsm-ctx-icon{',
        'background:rgba(var(--accent-rgb,122,168,232),.2);color:var(--accent,#7aa8e8);',
      '}',
      '.nsm-ctx-chip--modo .nsm-ctx-icon{',
        'background:rgba(var(--cor-tema-2-rgb,61,217,194),.2);color:var(--cor-tema-2,#3dd9c2);',
      '}',
      '.nsm-ctx-body{min-width:0;flex:1;}',
      '.nsm-ctx-label{',
        'display:block;font-size:.58rem;font-weight:700;',
        'letter-spacing:.13em;text-transform:uppercase;',
        'color:var(--text-2,#8b8878);margin-bottom:.22rem;',
      '}',
      '.nsm-ctx-value{',
        'display:block;font-size:.92rem;font-weight:700;',
        'color:var(--text-1,#f7f5f0);line-height:1.25;letter-spacing:-.01em;',
        'white-space:normal;word-break:break-word;',
      '}',
      '@media (max-width:420px){',
        '#nsm-context{grid-template-columns:1fr;}',
      '}',

      '.nsm-tela{transition:opacity .2s ease,transform .2s ease;}',
      '.nsm-tela--entrando{opacity:0;transform:translateY(6px);pointer-events:none;}',
      '.nsm-tela--visivel{opacity:1;transform:translateY(0);}',
      '.nsm-tela--saindo{opacity:0;transform:translateY(-6px);pointer-events:none;}',

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
        'color:var(--accent,#7aa8e8);',
        'transition:background .2s,border-color .2s,transform .18s;',
      '}',
      '.nsm-option__icon svg{width:20px;height:20px;display:block;color:currentColor;}',
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

      /* ── Botão único "Iniciar quiz" (quiz com uma só aula) ── */
      '#nsm-tela1-btns.nsm-tela1-btns--unico{padding-bottom:1.6rem;}',
      '.nsm-start{',
        'display:flex;align-items:center;justify-content:center;gap:.65rem;',
        'width:100%;padding:1.05rem 1.2rem;',
        'background:linear-gradient(135deg,rgba(var(--accent-rgb,122,168,232),.34) 0%,rgba(var(--accent-rgb,122,168,232),.14) 100%);',
        'border:1px solid rgba(var(--accent-rgb,122,168,232),.5);',
        'border-radius:14px;cursor:pointer;',
        'color:var(--text-1,#f0ede6);font-size:.98rem;font-weight:700;letter-spacing:.01em;',
        'transition:background .2s,border-color .2s,transform .18s,box-shadow .2s;',
        'touch-action:manipulation;',
      '}',
      '.nsm-start svg{width:18px;height:18px;display:block;flex-shrink:0;color:var(--accent,#7aa8e8);transition:transform .2s;}',
      '.nsm-start:hover{',
        'border-color:rgba(var(--accent-rgb,122,168,232),.75);',
        'transform:translateY(-1px);',
        'box-shadow:0 8px 24px rgba(0,0,0,.35),0 0 0 1px rgba(var(--accent-rgb,122,168,232),.18) inset;',
      '}',
      '.nsm-start:hover svg{transform:translateX(2px);}',
      '.nsm-start:active{transform:translateY(0) scale(.99);}',

      '#nsm-tela1-footer{padding:.5rem 1.6rem 1.4rem;text-align:center;}',
      '#nsm-tela1-footer p{font-size:.7rem;color:var(--text-2,#6e6a62);line-height:1.5;margin:0;}',
      '#nsm-tela1-footer i{color:rgba(var(--accent-rgb,122,168,232),.5);}',
      '#nsm-tela1-footer strong{color:var(--text-2,#a8a49c);font-weight:600;}',

    ].join('');
    document.head.appendChild(style);
  }

  /* ══════════════════════════════════════════════════════════
     UTILITÁRIO
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
     CONSTRUIR MODAL (somente tela 1)
  ══════════════════════════════════════════════════════════ */

  function _construirModal(multiplasAulas) {
    var bd = _el('div', { id: 'nsm-backdrop' });
    var card = _el('div', { id: 'nsm-card' });

    var head      = _el('div', { id: 'nsm-head' });
    var eyebrow   = _el('div', { id: 'nsm-eyebrow' });
    eyebrow.innerHTML = '<i class="fas fa-rocket" aria-hidden="true"></i> Preparar Quiz';
    var titulo    = _el('h2', { id: 'nsm-titulo'    }, 'Iniciar Quiz');
    var subtitulo = _el('p',  { id: 'nsm-subtitulo' },
      multiplasAulas ? 'Escolha como deseja iniciar' : 'Tudo pronto para começar');

    head.appendChild(eyebrow);
    head.appendChild(titulo);

    /* Chips de contexto: Disciplina / Modo — entre o título e o
       subtítulo, exatamente como no layout de referência. */
    var contexto = _construirContexto();
    if (contexto) head.appendChild(contexto);

    head.appendChild(subtitulo);
    card.appendChild(head);

    /* Tela 1 */
    var tela1  = _el('div', { id: 'nsm-tela1', class: 'nsm-tela nsm-tela--entrando' });
    var t1Btns = _el('div', { id: 'nsm-tela1-btns' });

    var btnContinuar, btnFiltrar;

    if (!multiplasAulas) {
      /* Uma única aula: nada para filtrar — só um botão de iniciar. */
      t1Btns.classList.add('nsm-tela1-btns--unico');

      btnContinuar = _el('button', { type: 'button', class: 'nsm-start' });
      btnContinuar.innerHTML =
        '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<polygon points="6 4 20 12 6 20 6 4"/>' +
        '</svg>' +
        '<span>Iniciar quiz</span>';

      t1Btns.appendChild(btnContinuar);
      tela1.appendChild(t1Btns);
      card.appendChild(tela1);
    } else {
      btnContinuar = _el('button', { type: 'button', class: 'nsm-option' });
      btnContinuar.innerHTML =
        '<div class="nsm-option__icon">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
          'stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>' +
            '<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' +
          '</svg>' +
        '</div>' +
        '<div class="nsm-option__body">' +
          '<span class="nsm-option__label">Todas as aulas</span>' +
          '<span class="nsm-option__desc">Iniciar com todas as aulas disponíveis.</span>' +
        '</div>' + _SETA;

      btnFiltrar = _el('button', { type: 'button', class: 'nsm-option' });
      btnFiltrar.innerHTML =
        '<div class="nsm-option__icon">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
          'stroke-linecap="round" stroke-linejoin="round">' +
            '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>' +
          '</svg>' +
        '</div>' +
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
    }

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

    return { bd: bd, btnContinuar: btnContinuar, btnFiltrar: btnFiltrar || null };
  }

  /* ══════════════════════════════════════════════════════════
     EXIBIR MODAL
  ══════════════════════════════════════════════════════════ */

  /* Quantas aulas distintas o quiz atual tem. Só é confiável depois
     que o conteúdo (window.questoes) foi carregado. Sem a API do
     filtro, assume "várias" (comportamento anterior). */
  function _temMultiplasAulas() {
    try {
      var NF = window.NexusFilter;
      if (NF && typeof NF.contarAulas === 'function') return NF.contarAulas() >= 2;
    } catch (e) {}
    return true;
  }

  function _exibirModal() {
    var pronto = (typeof window.__nexusPreCarregarConteudo === 'function')
      ? window.__nexusPreCarregarConteudo()
      : Promise.resolve();

    pronto.then(function () {
      _montarEVincularModal(_temMultiplasAulas());
    });
  }

  function _montarEVincularModal(multiplasAulas) {
    var ui = _construirModal(multiplasAulas);

    /* "Todas as aulas" / "Iniciar quiz" — remove qualquer filtro ativo e conclui */
    ui.btnContinuar.addEventListener('click', function () {
      if (window.NexusFilter) window.NexusFilter.clear();
      _concluir(ui.bd);
    });

    /* Uma única aula: não há botão de filtro. */
    if (!ui.btnFiltrar) return;

    /* "Filtrar aulas" — NexusFilter já existe (filter.js carregado antes).
       Escuta nexus:filtroAlterado (disparado quando o usuário aplica o filtro)
       e conclui o modal. O listener é registrado antes de abrir o painel
       para não perder o evento. */
    ui.btnFiltrar.addEventListener('click', function () {
      function _onFiltro() {
        window.removeEventListener('nexus:filtroAlterado', _onFiltro);
        setTimeout(function () { _concluir(ui.bd); }, 320);
      }
      window.addEventListener('nexus:filtroAlterado', _onFiltro);

      var pronto = (typeof window.__nexusPreCarregarConteudo === 'function')
        ? window.__nexusPreCarregarConteudo()
        : Promise.resolve();

      pronto.then(function () {
        window.NexusFilter.open();
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     CONCLUIR
  ══════════════════════════════════════════════════════════ */

  function _concluir(bd) {
    window.__NSM_AGUARDANDO__ = false;

    _fechar(bd, function () {
      _completarBoot();
    });
  }

  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  function _boot() {
    _injetarCSS();

    if (typeof window.__nexusPreCarregarConteudo === 'function') {
      window.__nexusPreCarregarConteudo();
    }

    if (_temProgresso()) {
      _pularModal();
    } else {
      _exibirModal();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _boot);
  } else {
    _boot();
  }

})();