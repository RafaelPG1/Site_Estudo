/* ============================================================
   NEXUS STUDY — quiz/quiz_engine.js
   Motor principal do quiz. Renderiza questões e gerencia
   interações.

   Depende de:
     window.questoes      → objeto { tipo: [...] } ou array (legado)
     window.TIPO_QUIZ     → string 'questoes' | 'ava' | etc.
     window.NexusStorage  → exposto pelo template_init.js
   ============================================================ */

(function () {

  /* ── HELPER: lê o Storage sem importar o módulo ──────────
     O template_init.js (módulo ES6) expõe window.NexusStorage.
     Se por qualquer razão não estiver disponível, cai no
     localStorage com a chave crua como último recurso.
     Assim, se o PREFIX 'nexus_' mudar no storage.js, só lá
     precisa ser alterado — este arquivo não precisa mudar.
  ─────────────────────────────────────────────────────────── */
  function storageGet(key, fallback) {
    if (window.NexusStorage && typeof window.NexusStorage.get === 'function') {
      return window.NexusStorage.get(key, fallback);
    }
    // fallback de emergência (nunca deveria chegar aqui)
    try {
      var raw = localStorage.getItem('nexus_' + key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function initQuiz() {

    /* ── RESOLVE LISTA DE QUESTÕES ──────────────────────── */
    var tipo = window.TIPO_QUIZ || 'questoes';
    var listaQuestoes;

    if (Array.isArray(window.questoes)) {
      listaQuestoes = window.questoes;
    } else if (window.questoes && typeof window.questoes === 'object') {
      listaQuestoes = window.questoes[tipo];
    }

    /* ── VERIFICAÇÃO ────────────────────────────────────── */
    var container = document.getElementById('quiz-container');

    if (!listaQuestoes || !Array.isArray(listaQuestoes) || listaQuestoes.length === 0) {
      if (container) {
        container.innerHTML =
          '<div style="padding:2rem;text-align:center;color:#f87171;">' +
          '<p>⚠️ Nenhuma questão encontrada para o tipo <strong>"' + tipo + '"</strong>.<br>' +
          'Verifique se o arquivo de conteúdo está correto.</p>' +
          '</div>';
      }
      return;
    }

    var questoes  = listaQuestoes;
    var respostas = {};   // { index: indexAlternativaSelecionada }
    var revelado  = false;

    /* ── MODO STEP ──────────────────────────────────────── */
    var modoStep  = false;
    var stepAtual = 0;

    /* ── ATUALIZA CONTADOR ──────────────────────────────── */
    var metaTotal = document.getElementById('meta-total');
    if (metaTotal) {
      metaTotal.querySelector('span').textContent = questoes.length + ' questões';
    }

    /* ── RENDERIZA QUESTÕES ─────────────────────────────── */
    function renderizar() {
      container.innerHTML = '';

      questoes.forEach(function (q, qi) {
        var card = document.createElement('div');
        card.className = 'question-container';
        card.id = 'q-' + qi;

        /* Número */
        var num = document.createElement('div');
        num.className = 'question-number';
        num.textContent = 'Questão ' + (qi + 1);
        card.appendChild(num);

        /* Pergunta — suporta \n e blocos de código */
        var enunciado = document.createElement('div');
        enunciado.className = 'question-enunciado';

        var partes = q.pergunta.split(/```([\s\S]*?)```/);
        partes.forEach(function (parte, pi) {
          if (pi % 2 === 1) {
            var pre = document.createElement('pre');
            pre.className = 'code-block';
            pre.textContent = parte.trim();
            enunciado.appendChild(pre);
          } else {
            parte.split('\n').forEach(function (linha, li, arr) {
              enunciado.appendChild(document.createTextNode(linha));
              if (li < arr.length - 1) enunciado.appendChild(document.createElement('br'));
            });
          }
        });

        card.appendChild(enunciado);

        /* Alternativas */
        var opts = document.createElement('div');
        opts.className = 'options';

        q.alternativas.forEach(function (alt, ai) {
          var btn = document.createElement('button');
          btn.className = 'option';
          btn.type = 'button';
          btn.textContent = alt;
          btn.dataset.qi = qi;
          btn.dataset.ai = ai;

          if (respostas[qi] !== undefined) {
            aplicarEstado(btn, qi, ai);
          }

          btn.addEventListener('click', function () {
            if (revelado || respostas[qi] !== undefined) return;
            respostas[qi] = ai;
            atualizarOpcoes(qi);
            atualizarResultados();

            /* Auto-avança no modo step após 800 ms */
            if (modoStep && stepAtual < questoes.length - 1) {
              setTimeout(function () {
                stepAtual++;
                aplicarModoStep();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 800);
            }
          });

          opts.appendChild(btn);
        });

        card.appendChild(opts);
        container.appendChild(card);
      });

      /* Aplica step se já estava ativo (ex: após reiniciar) */
      if (modoStep) aplicarModoStep();
    }

    /* ── APLICA ESTADO VISUAL DE UMA OPÇÃO ─────────────── */
    function aplicarEstado(btn, qi, ai) {
      var correto = questoes[qi].correta;
      btn.classList.add('locked');
      if (ai === correto) {
        btn.classList.add('correct');
      } else if (ai === respostas[qi]) {
        btn.classList.add('incorrect');
      }
    }

    /* ── ATUALIZA OPÇÕES APÓS RESPOSTA ──────────────────── */
    function atualizarOpcoes(qi) {
      var card = document.getElementById('q-' + qi);
      if (!card) return;
      card.querySelectorAll('.option').forEach(function (btn) {
        aplicarEstado(btn, qi, parseInt(btn.dataset.ai));
      });
    }

    /* ── ATUALIZA PAINEL DE RESULTADOS ──────────────────── */
    function atualizarResultados() {
      var total       = questoes.length;
      var respondidas = Object.keys(respostas).length;
      var acertos     = 0;

      Object.keys(respostas).forEach(function (qi) {
        if (parseInt(respostas[qi]) === questoes[qi].correta) acertos++;
      });

      var resultsEl = document.getElementById('results');
      if (!resultsEl) return;

      if (respondidas === total) {
        var pct = Math.round((acertos / total) * 100);
        resultsEl.style.display = 'block';
        resultsEl.innerHTML =
          '<h2>Resultado Final</h2>' +
          '<p class="score">' + acertos + ' de ' + total + ' corretas</p>' +
          '<div class="percentage">' + pct + '%</div>' +
          '<p>' + (pct >= 70 ? '🎉 Bom trabalho!' : pct >= 50 ? '📚 Continue estudando!' : '💪 Revise o conteúdo e tente novamente.') + '</p>';

        var errorsBtn = document.getElementById('errors');
        if (errorsBtn && acertos < total) {
          errorsBtn.classList.add('visible');
        }
      }
    }

    /* ── BOTÃO REINICIAR ────────────────────────────────── */
    function reiniciar() {
      respostas = {};
      revelado  = false;
      stepAtual = 0;

      var resultsEl = document.getElementById('results');
      if (resultsEl) { resultsEl.style.display = 'none'; resultsEl.innerHTML = ''; }

      var errorsBtn = document.getElementById('errors');
      if (errorsBtn) errorsBtn.classList.remove('visible', 'active');

      renderizar(); // também chama aplicarModoStep() se modoStep === true
    }

    /* ── BOTÃO REVELAR ──────────────────────────────────── */
    function revelar() {
      revelado = true;
      questoes.forEach(function (q, qi) {
        respostas[qi] = q.correta;
        atualizarOpcoes(qi);
      });
      atualizarResultados();

      /* Mostra todas as questões ao revelar (sai do step visualmente) */
      if (modoStep) {
        container.querySelectorAll('.question-container').forEach(function (c) {
          c.style.display = '';
        });
        setStepNavVisivel(false);
        var toggle = document.getElementById('btn-toggle-modo');
        if (toggle) toggle.classList.remove('modo-step-active');
        modoStep = false;
      }
    }

    /* ── BOTÃO VER ERROS ────────────────────────────────── */
    function verErros() {
      var erros = [];
      Object.keys(respostas).forEach(function (qi) {
        if (parseInt(respostas[qi]) !== questoes[qi].correta) erros.push(parseInt(qi));
      });

      if (erros.length === 0) return;

      /* Sai do step mode antes de filtrar erros — evita conflito de display */
      if (modoStep) {
        modoStep = false;
        var toggle = document.getElementById('btn-toggle-modo');
        if (toggle) toggle.classList.remove('modo-step-active');
        setStepNavVisivel(false);
        container.querySelectorAll('.question-container').forEach(function (c) {
          c.style.display = '';
        });
      }

      var errorsBtn = document.getElementById('errors');
      if (!errorsBtn) return;

      if (errorsBtn.classList.contains('active')) {
        errorsBtn.classList.remove('active');
        document.querySelectorAll('.question-container').forEach(function (c) {
          c.style.display = '';
        });
      } else {
        errorsBtn.classList.add('active');
        questoes.forEach(function (q, qi) {
          var card = document.getElementById('q-' + qi);
          if (card) card.style.display = erros.includes(qi) ? '' : 'none';
        });
        var primeiro = document.getElementById('q-' + erros[0]);
        if (primeiro) primeiro.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    /* ── MODO STEP: helpers ─────────────────────────────── */

    /**
     * Exibe apenas a questão em `stepAtual` e atualiza
     * o estado disabled dos botões prev/next.
     */
    function aplicarModoStep() {
      container.querySelectorAll('.question-container').forEach(function (c, i) {
        c.style.display = i === stepAtual ? '' : 'none';
      });
      atualizarBotoesStep();
    }

    /** Habilita/desabilita prev e next conforme posição atual */
    function atualizarBotoesStep() {
      var prev = document.getElementById('btn-step-prev');
      var next = document.getElementById('btn-step-next');
      if (prev) prev.disabled = stepAtual === 0;
      if (next) next.disabled = stepAtual === questoes.length - 1;
    }

    /** Mostra ou oculta os botões de navegação step */
    function setStepNavVisivel(visivel) {
      var prev = document.getElementById('btn-step-prev');
      var next = document.getElementById('btn-step-next');
      var display = visivel ? '' : 'none';
      if (prev) prev.style.display = display;
      if (next) next.style.display = display;
    }

    /* ── NAV FLUTUANTE: topo / fim / voltar ─────────────── */
    var btnUp   = document.getElementById('btn-up');
    var btnDown = document.getElementById('btn-down');
    if (btnUp)   btnUp.addEventListener('click',   function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    if (btnDown) btnDown.addEventListener('click', function () { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); });

    /* ── BIND BOTÕES DE QUIZ ────────────────────────────── */
    ['restart', 'restartButton'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', reiniciar);
    });

    ['reveal', 'revealButton'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', revelar);
    });

    var errorsBtn = document.getElementById('errors');
    if (errorsBtn) errorsBtn.addEventListener('click', verErros);

    /* ── BOTÃO TOGGLE STEP MODE ─────────────────────────── */
    var btnToggle = document.getElementById('btn-toggle-modo');
    if (btnToggle) {
      btnToggle.addEventListener('click', function () {
        modoStep = !modoStep;
        btnToggle.classList.toggle('modo-step-active', modoStep);
        stepAtual = 0;

        setStepNavVisivel(modoStep);

        if (modoStep) {
          aplicarModoStep();
        } else {
          /* Volta ao modo normal: mostra tudo */
          container.querySelectorAll('.question-container').forEach(function (c) {
            c.style.display = '';
          });
        }
      });
    }

    /* ── BOTÕES PREV / NEXT STEP ────────────────────────── */
    var btnStepPrev = document.getElementById('btn-step-prev');
    var btnStepNext = document.getElementById('btn-step-next');

    if (btnStepPrev) {
      btnStepPrev.addEventListener('click', function () {
        if (!modoStep || stepAtual === 0) return;
        stepAtual--;
        aplicarModoStep();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    if (btnStepNext) {
      btnStepNext.addEventListener('click', function () {
        if (!modoStep || stepAtual >= questoes.length - 1) return;
        stepAtual++;
        aplicarModoStep();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ── NAVEGAÇÃO VOLTAR (dinâmica por Storage) ────────── */
    /* USA window.NexusStorage em vez de localStorage direto.
       Se o prefixo 'nexus_' mudar no storage.js, só lá precisa
       ser atualizado — esta linha continua funcionando. */
    var disc    = storageGet('disciplina', 'poo');
    var urlBack = '../disciplinas/' + disc + '.html';

    var backBtn = document.querySelector('.back-btn');
    if (backBtn) backBtn.setAttribute('href', urlBack);

    var btnLeft = document.getElementById('btn-left');
    if (btnLeft) {
      btnLeft.addEventListener('click', function () {
        window.location.href = urlBack;
      });
    }

    /* ── RENDER INICIAL ─────────────────────────────────── */
    renderizar();

  } // initQuiz

  /* ── EXECUTA: DOM já pronto ou aguarda ──────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
  } else {
    initQuiz();
  }

})();