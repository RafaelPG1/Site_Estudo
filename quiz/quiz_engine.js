/* ============================================================
   NEXUS STUDY — quiz/quiz_engine.js
   Motor principal do quiz. Renderiza questões e gerencia
   interações.

   Depende de:
     window.questoes  → objeto { tipo: [...] } ou array (legado)
     window.TIPO_QUIZ → string 'questoes' | 'ava' | etc.
   ============================================================ */

(function () {

  function initQuiz() {

    /* ── RESOLVE LISTA DE QUESTÕES ──────────────────────── */
    var tipo = window.TIPO_QUIZ || 'questoes';
    var listaQuestoes;

    if (Array.isArray(window.questoes)) {
      // Compatibilidade com formato antigo (array direto)
      listaQuestoes = window.questoes;
    } else if (window.questoes && typeof window.questoes === 'object') {
      // Novo formato: { questoes: [...], ava: [...], ... }
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
    var respostas = {}; // { index: indexAlternativaSelecionada }
    var revelado  = false;

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

        /* Pergunta — suporta \n como quebra de linha e blocos de código */
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
          });

          opts.appendChild(btn);
        });

        card.appendChild(opts);
        container.appendChild(card);
      });
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
      var resultsEl = document.getElementById('results');
      if (resultsEl) { resultsEl.style.display = 'none'; resultsEl.innerHTML = ''; }
      var errorsBtn = document.getElementById('errors');
      if (errorsBtn) errorsBtn.classList.remove('visible', 'active');
      renderizar();
    }

    /* ── BOTÃO REVELAR ──────────────────────────────────── */
    function revelar() {
      revelado = true;
      questoes.forEach(function (q, qi) {
        respostas[qi] = q.correta;
        atualizarOpcoes(qi);
      });
      atualizarResultados();
    }

    /* ── BOTÃO VER ERROS ────────────────────────────────── */
    function verErros() {
      var erros = [];
      Object.keys(respostas).forEach(function (qi) {
        if (parseInt(respostas[qi]) !== questoes[qi].correta) erros.push(parseInt(qi));
      });

      if (erros.length === 0) return;

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

    /* ── NAV FLUTUANTE: topo / fim ──────────────────────── */
    var btnUp   = document.getElementById('btn-up');
    var btnDown = document.getElementById('btn-down');
    if (btnUp)   btnUp.addEventListener('click',   function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    if (btnDown) btnDown.addEventListener('click', function () { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); });

    /* ── BIND BOTÕES ────────────────────────────────────── */
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

    /* ── MODO STEP (uma questão por vez) ────────────────── */
    var modoStep  = false;
    var stepAtual = 0;

    var btnToggle = document.getElementById('btn-toggle-modo');
    if (btnToggle) {
      btnToggle.addEventListener('click', function () {
        modoStep = !modoStep;
        btnToggle.classList.toggle('modo-step-active', modoStep);
        renderizar();
        if (modoStep) ativarModoStep();
      });
    }

    function ativarModoStep() {
      container.querySelectorAll('.question-container').forEach(function (c, i) {
        if (i !== stepAtual) c.style.display = 'none';
      });
    }

    /* ── RENDER INICIAL ─────────────────────────────────── */
    renderizar();

    /* ── NAVEGAÇÃO VOLTAR (dinâmica por localStorage) ────── */
    var disc    = localStorage.getItem('disciplina') || 'poo';
    var urlBack = '../disciplinas/' + disc + '.html';

    var backBtn = document.querySelector('.back-btn');
    if (backBtn) backBtn.setAttribute('href', urlBack);

    var btnLeft = document.getElementById('btn-left');
    if (btnLeft) {
      btnLeft.addEventListener('click', function () {
        window.location.href = urlBack;
      });
    }

  } // initQuiz

  /* ── EXECUTA: DOM já pronto (injeção dinâmica) ou aguarda ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
  } else {
    initQuiz();
  }

})();