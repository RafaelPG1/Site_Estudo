/* ============================================================
   NEXUS STUDY — quiz/quiz_engine.js  (v2)

   Funcionalidades:
     • Suporte ao formato de questão v1 (texto, assertions, code,
       question, options, answer, feedback) — usado em todas as
       questões estilo ENADE com contexto, código e afirmativas.
     • Highlight de sintaxe Java inline (com placeholder seguro).
     • Renderização de afirmativas romanas com suporte a [PORQUE].
     • Inline code via backticks no campo question.
     • Formatação de feedback (negrito + quebras).
     • selectOption com feedback imediato por questão.
     • revelar / reiniciar (embaralha alternativas a cada restart).
     • Ver erros: filtra questões incorretas, mostra contador,
       alterna entre "só erros" e "tudo".
     • Modo Step: uma questão por vez, barra de progresso, dots
       de navegação, botões Voltar / Avançar.
     • Scroll suave com cancelamento por input do usuário.
     • Nav-float: topo, fim, voltar, reiniciar, revelar, step.

   Formato dos dados (window.questoes):
     Array plano  → modo 'questoes'
     Objeto       → { questoes: [...], ava: [...] }

   Cada questão aceita os seguintes campos (todos opcionais
   exceto options/answer):
     texto          string   — parágrafo de contexto (barra lateral)
     miniEnunciado  string   — texto itálico antes do enunciado
     code           string   — bloco de código Java
     assertions     string[] — afirmativas I, II, III... (prefixo
                               [PORQUE] para inserir conector)
     question       string   — enunciado principal (suporta `backtick`)
     options        string[] — alternativas (embaralhadas no restart)
     answer         number   — índice da alternativa correta
     feedback       string   — explicação (suporta "Por que está certa:")
     image          string   — URL de imagem opcional
     questionContinuation string — texto extra após afirmativas

   CORREÇÕES:
     [BUG 1] verErros() sem erros → exibe "Sem erros! ✓" no botão.
     [FIX 3] warn quando array plano + modo != 'questoes'.
     [FIX 5] engine não toca mais no .back-btn.
     [FIX 7] consome window.NEXUS_URL_BACK sem recalcular.
     [FIX 8] highlightJava usa placeholders — sem vazamento de HTML.
     [FIX 9] _extrairPorQueEstaCerta: usa feedback inteiro como fallback.
     [FIX 10] _sincronizarAlturaStep com reflow forçado.
     [FIX 11] selectOption chama _sincronizarAlturaStep após feedback.
     [FIX 12] btn-toggle-modo: oculta/mostra ao entrar/sair do step.
   ============================================================ */

(function () {
  'use strict';

  /* ── UTILITÁRIOS DE SCROLL ──────────────────────────────── */

  var _scrollCancelled = false;

  function cancelScroll() { _scrollCancelled = true; }

  function smoothScrollTo(targetPosition, duration) {
    duration = duration || 800;
    _scrollCancelled = false;
    var start     = window.scrollY;
    var change    = targetPosition - start;
    var startTime = performance.now();

    function animateScroll(currentTime) {
      if (_scrollCancelled) return;
      var elapsed  = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + change * progress);
      if (progress < 1) requestAnimationFrame(animateScroll);
    }
    requestAnimationFrame(animateScroll);
  }

  function smoothScrollToTop() { smoothScrollTo(0, 800); }

  window.addEventListener('wheel',     cancelScroll, { passive: true });
  window.addEventListener('touchmove', cancelScroll, { passive: true });
  window.addEventListener('keydown',   cancelScroll, { passive: true });

  /* ══════════════════════════════════════════════════════════
     INÍCIO DO ENGINE
     ══════════════════════════════════════════════════════════ */

  function initQuiz() {

    /* ── RESOLVE LISTA DE QUESTÕES ──────────────────────── */
    var tipo = window.TIPO_QUIZ
      || new URLSearchParams(location.search).get('modo')
      || 'questoes';

    var listaQuestoes;

    if (Array.isArray(window.questoes)) {
      if (tipo !== 'questoes') {
        console.warn(
          '[quiz_engine] window.questoes é um array plano.' +
          ' O modo "' + tipo + '" está sendo ignorado.' +
          ' Para suportar múltiplos modos, defina window.questoes' +
          ' como objeto: { questoes: [...], ava: [...] }.'
        );
      }
      listaQuestoes = window.questoes;
    } else if (window.questoes && typeof window.questoes === 'object') {
      listaQuestoes = window.questoes[tipo];
    }

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

    /* ── ESTADO ─────────────────────────────────────────── */
    var questoesBase = listaQuestoes;
    var questoes     = criarCopiaEmbaralhada(questoesBase);
    var respostas    = {};
    var revelado     = false;

    /* ── MODO STEP ──────────────────────────────────────── */
    var modoStep    = false;
    var stepAtual   = 0;
    var stepWrapper = null;

    /* ── MODO VER ERROS ─────────────────────────────────── */
    var mostrandoSoErros = false;

    /* ── ATUALIZA CONTADOR ──────────────────────────────── */
    var metaTotal = document.getElementById('meta-total');
    if (metaTotal) {
      var span = metaTotal.querySelector('span');
      if (span) span.textContent = questoes.length + ' questões';
    }

    /* ══════════════════════════════════════════════════════
       EMBARALHAMENTO
       ══════════════════════════════════════════════════════ */

    function shuffleArray(arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
      }
      return a;
    }

    function criarCopiaEmbaralhada(base) {
      return base.map(function (q) {
        var indices       = q.options.map(function (_, i) { return i; });
        var shuffled      = shuffleArray(indices);
        var newOptions    = shuffled.map(function (i) { return q.options[i]; });
        var newAnswer     = shuffled.indexOf(q.answer);
        var correctLetter = String.fromCharCode(65 + newAnswer);
        var originalOpt   = q.options[q.answer];

        var feedbackBase = _extrairPorQueEstaCerta(q.feedback || '');
        var newFeedback  =
          '✓ Resposta correta: ' + correctLetter + ') ' + originalOpt +
          (feedbackBase ? '\n\nPor que está certa: ' + feedbackBase : '');

        return Object.assign({}, q, {
          options:  newOptions,
          answer:   newAnswer,
          feedback: newFeedback
        });
      });
    }

    /* [FIX 9] Usa o feedback inteiro se não tiver o prefixo */
    function _extrairPorQueEstaCerta(feedback) {
      var match = feedback.match(/Por que está certa:([\s\S]*)/);
      if (match) return match[1].trim();
      return feedback.trim();
    }

    /* ══════════════════════════════════════════════════════
       FORMATAÇÃO E EXIBIÇÃO
       ══════════════════════════════════════════════════════ */

    function formatFeedback(feedback) {
      if (!feedback) return '';
      return feedback
        .replace(/\n/g, '<br>')
        .replace(/(✓ Resposta correta:)/g, '<strong>$1</strong>')
        .replace(/(<br>)*(Por que está certa:)(<br>)*/g,
          '<br><br><strong>Por que está certa:</strong> ');
    }

    /* [FIX 8] Placeholder seguro para strings antes dos outros regexes */
    function highlightJava(raw) {
      var code = raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      var strings = [];
      code = code.replace(/"([^"]*)"/g, function (match) {
        strings.push(match);
        return '\x00STR' + (strings.length - 1) + '\x00';
      });

      code = code.replace(/(@\w+)/g,
        '<span class="jk-annotation">$1</span>');

      code = code.replace(
        /\b(public|private|protected|class|interface|extends|implements|return|void|double|int|long|float|boolean|char|byte|short|String|new|this|super|static|final|abstract|null|true|false|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|import|package)\b/g,
        '<span class="jk-keyword">$1</span>'
      );

      code = code.replace(/(\/\/.*)$/gm,
        '<span class="jk-comment">$1</span>');

      code = code.replace(/\x00STR(\d+)\x00/g, function (_, i) {
        return '<span class="jk-string">' + strings[+i] + '</span>';
      });

      return code;
    }

    function renderCodeBlock(code) {
      if (!code) return '';
      return '<div class="code-block"><pre>' + highlightJava(code) + '</pre></div>';
    }

    /* Inline code via backticks */
    function renderInlineCode(text) {
      return text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    }

    function renderAssertions(assertions) {
      if (!assertions || assertions.length === 0) return '';
      var romanos = ['I', 'II', 'III', 'IV', 'V', 'VI'];

      var items = assertions.map(function (text, idx) {
        var isPorque  = text.indexOf('[PORQUE]') === 0;
        var cleanText = text.replace('[PORQUE]', '').trim();
        var num       = romanos[idx] || String(idx + 1);

        if (isPorque) {
          return (
            '<div class="assertion-connector">' +
              '<span class="connector-label">PORQUE</span>' +
            '</div>' +
            '<div class="assertion">' +
              '<span class="assertion-num">' + num + '.</span>' +
              '<span>' + cleanText + '</span>' +
            '</div>'
          );
        }

        return (
          '<div class="assertion">' +
            '<span class="assertion-num">' + num + '.</span>' +
            '<span>' + cleanText + '</span>' +
          '</div>'
        );
      }).join('');

      return '<div class="assertions">' + items + '</div>';
    }

    function buildQuestionBody(q) {
      var html = '';

      if (q.texto) {
        html += '<div class="question-texto">' +
          q.texto.replace(/\n/g, '<br>') +
        '</div>';
      }

      if (q.miniEnunciado) {
        html += '<div class="question-mini-enunciado">' + q.miniEnunciado + '</div>';
      }

      if (q.code) {
        html += renderCodeBlock(q.code);
      }

      if (q.assertions && q.assertions.length > 0) {
        html += renderAssertions(q.assertions);
      }

      if (q.image) {
        html += '<div class="question-image">' +
          '<img src="' + q.image + '" alt="Imagem da questão">' +
        '</div>';
      }

      if (q.questionContinuation) {
        html += '<div class="question-text">' + renderInlineCode(q.questionContinuation) + '</div>';
      }

      if (q.question) {
        html += '<div class="question-enunciado">' + renderInlineCode(q.question) + '</div>';
      }

      return html;
    }

    /* ══════════════════════════════════════════════════════
       RENDERIZAÇÃO
       ══════════════════════════════════════════════════════ */

    function renderizar() {
      if (modoStep) _sairModoStep();
      container.innerHTML = '';
      mostrandoSoErros = false;

      questoes.forEach(function (q, qi) {
        var card = document.createElement('div');
        card.className = 'question-container';
        card.id = 'q-' + qi;

        var num = document.createElement('div');
        num.className = 'question-number';
        num.textContent = 'Questão ' + (qi + 1);
        card.appendChild(num);

        var body = document.createElement('div');
        body.innerHTML = buildQuestionBody(q);
        card.appendChild(body);

        var opts = document.createElement('div');
        opts.className = 'options';

        q.options.forEach(function (alt, ai) {
          var btn = document.createElement('button');
          btn.className = 'option';
          btn.type = 'button';
          btn.textContent = String.fromCharCode(65 + ai) + ') ' + alt;
          btn.dataset.qi = qi;
          btn.dataset.ai = ai;

          if (respostas[qi] !== undefined) {
            _aplicarEstadoOpcao(btn, qi, ai);
          }

          btn.addEventListener('click', function () {
            selectOption(qi, ai);
          });

          opts.appendChild(btn);
        });

        card.appendChild(opts);

        if (respostas[qi] !== undefined) {
          card.appendChild(_criarFeedbackEl(qi));
        }

        container.appendChild(card);
      });
    }

    /* ── Estado visual de opções ─────────────────────── */
    function _aplicarEstadoOpcao(btn, qi, ai) {
      var correto = questoes[qi].answer;
      btn.classList.add('locked');
      if (ai === correto)            btn.classList.add('correct');
      else if (ai === respostas[qi]) btn.classList.add('incorrect');
    }

    function _atualizarOpcoes(qi) {
      var card = document.getElementById('q-' + qi);
      if (!card) return;
      card.querySelectorAll('.option').forEach(function (btn) {
        _aplicarEstadoOpcao(btn, qi, parseInt(btn.dataset.ai));
      });
    }

    function _criarFeedbackEl(qi) {
      var isCorrect = parseInt(respostas[qi]) === questoes[qi].answer;
      var fb = document.createElement('div');
      fb.className = 'feedback ' + (isCorrect ? 'correct-feedback' : 'incorrect-feedback');
      fb.innerHTML = formatFeedback(questoes[qi].feedback || '');
      return fb;
    }

    /* ══════════════════════════════════════════════════════
       INTERAÇÃO DO USUÁRIO
       ══════════════════════════════════════════════════════ */

    function selectOption(qi, oi) {
      if (revelado || respostas[qi] !== undefined) return;
      respostas[qi] = oi;

      _atualizarOpcoes(qi);

      var card = document.getElementById('q-' + qi);
      if (card && !card.querySelector('.feedback')) {
        card.appendChild(_criarFeedbackEl(qi));
        /* [FIX 11] Ressincroniza altura após feedback aparecer */
        if (modoStep) setTimeout(_sincronizarAlturaStep, 50);
      }

      atualizarResultados();


    }

    function revelar() {
      revelado = true;

      questoes.forEach(function (q, qi) {
        if (respostas[qi] === undefined) respostas[qi] = q.answer;
        _atualizarOpcoes(qi);
        var card = document.getElementById('q-' + qi);
        if (card && !card.querySelector('.feedback')) {
          card.appendChild(_criarFeedbackEl(qi));
        }
      });

      if (modoStep) {
        _sairModoStep();
        renderizar();
      }

      atualizarResultados();
      smoothScrollToTop();
    }

    function reiniciar() {
      respostas        = {};
      revelado         = false;
      mostrandoSoErros = false;
      stepAtual        = 0;
      questoes         = criarCopiaEmbaralhada(questoesBase);

      var resultsEl = document.getElementById('results');
      if (resultsEl) { resultsEl.style.display = 'none'; resultsEl.innerHTML = ''; }

      _resetarBotaoErros();
      renderizar();
      smoothScrollToTop();
    }

    /* ══════════════════════════════════════════════════════
       RESULTADO GLOBAL
       ══════════════════════════════════════════════════════ */

    function atualizarResultados() {
      var total       = questoes.length;
      var respondidas = Object.keys(respostas).length;
      var acertos     = 0;

      Object.keys(respostas).forEach(function (qi) {
        if (parseInt(respostas[qi]) === questoes[qi].answer) acertos++;
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
          '<p>' + (
            pct >= 70 ? '🎉 Bom trabalho!' :
            pct >= 50 ? '📚 Continue estudando!' :
            '💪 Revise o conteúdo e tente novamente.'
          ) + '</p>';
      }

      _atualizarBotaoErros();
    }

    /* ══════════════════════════════════════════════════════
       VER ERROS
       ══════════════════════════════════════════════════════ */

    function _contarErros() {
      var count = 0;
      Object.keys(respostas).forEach(function (qi) {
        if (parseInt(respostas[qi]) !== questoes[qi].answer) count++;
      });
      return count;
    }

    function _atualizarBotaoErros() {
      var errorsBtn = document.getElementById('errors');
      if (!errorsBtn) return;

      var total       = questoes.length;
      var respondidas = Object.keys(respostas).length;

      if (respondidas < total) {
        errorsBtn.classList.remove('visible', 'active');
        return;
      }

      var erros = _contarErros();
      errorsBtn.classList.add('visible');

      if (erros === 0) {
        var s = errorsBtn.querySelector('span');
        if (s) s.textContent = 'Sem erros!';
        errorsBtn.disabled = true;
        errorsBtn.classList.remove('active');
      } else {
        var s2 = errorsBtn.querySelector('span');
        if (s2) s2.textContent = 'Ver erros (' + erros + ')';
        errorsBtn.disabled = false;
      }
    }

    function _resetarBotaoErros() {
      var errorsBtn = document.getElementById('errors');
      if (!errorsBtn) return;
      errorsBtn.classList.remove('visible', 'active');
      errorsBtn.disabled = false;
      var s = errorsBtn.querySelector('span');
      if (s) s.textContent = 'Ver erros';
    }

    /* [BUG 1] feedback quando não há erros */
    function verErros() {
      var erros = [];
      Object.keys(respostas).forEach(function (qi) {
        if (parseInt(respostas[qi]) !== questoes[qi].answer) erros.push(parseInt(qi));
      });

      var errorsBtn = document.getElementById('errors');

      if (erros.length === 0) {
        if (errorsBtn) {
          var s = errorsBtn.querySelector('span');
          var orig = s ? s.textContent : 'Ver erros';
          if (s) s.textContent = 'Sem erros! ✓';
          errorsBtn.disabled = true;
          setTimeout(function () {
            if (s) s.textContent = orig;
            errorsBtn.disabled = false;
          }, 1500);
        }
        return;
      }

      if (!errorsBtn) return;

      if (errorsBtn.classList.contains('active')) {
        mostrandoSoErros = false;
        errorsBtn.classList.remove('active');
        var s2 = errorsBtn.querySelector('span');
        if (s2) s2.textContent = 'Ver erros (' + erros.length + ')';
        document.querySelectorAll('.question-container').forEach(function (c) {
          c.style.display = '';
        });
      } else {
        mostrandoSoErros = true;
        errorsBtn.classList.add('active');
        var s3 = errorsBtn.querySelector('span');
        if (s3) s3.textContent = 'Ver completo';
        questoes.forEach(function (q, qi) {
          var card = document.getElementById('q-' + qi);
          if (card) card.style.display = erros.indexOf(qi) !== -1 ? '' : 'none';
        });
        var primeiro = document.getElementById('q-' + erros[0]);
        if (primeiro) primeiro.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    /* ══════════════════════════════════════════════════════
       MODO STEP
       ══════════════════════════════════════════════════════ */

    /* [FIX 10] Força reflow antes de medir altura */
function _sincronizarAlturaStep() {
  if (!modoStep || !stepWrapper) return;
  var cards = stepWrapper.querySelectorAll('.question-container');
  var atual = cards[stepAtual];
  if (!atual) return;

  stepWrapper.style.height = 'auto';
  container.style.height   = 'auto';

  void atual.offsetHeight; // força reflow

  var h = atual.getBoundingClientRect().height;
  stepWrapper.style.height = h + 'px';
  container.style.height   = h + 'px';
}
    function _getDotsRange(current, total, maxVisible) {
      if (total <= maxVisible) {
        var r = [];
        for (var i = 0; i < total; i++) r.push(i);
        return r;
      }
      var half  = Math.floor(maxVisible / 2);
      var start = Math.max(0, current - half);
      var end   = start + maxVisible;
      if (end > total) { end = total; start = end - maxVisible; }
      var out = [];
      for (var j = start; j < end; j++) out.push(j);
      return out;
    }

    function _atualizarControlesStep() {
      var total = questoes.length;
      var gi    = stepAtual;

      var counter = document.getElementById('step-counter');
      if (counter) counter.textContent = (gi + 1) + ' / ' + total;

      var fill = document.getElementById('step-progress-fill');
      if (fill) fill.style.width = (((gi + 1) / total) * 100) + '%';

      var badges = document.getElementById('step-score-badges');
      if (badges) {
        var acertos = 0, erros = 0;
        Object.keys(respostas).forEach(function (idx) {
          if (parseInt(respostas[idx]) === questoes[idx].answer) acertos++;
          else erros++;
        });
        badges.innerHTML =
          '<span class="step-badge step-badge-correct"><i class="fas fa-check"></i> ' + acertos + '</span>' +
          '<span class="step-badge step-badge-incorrect"><i class="fas fa-times"></i> ' + erros + '</span>';
      }

      var dotsEl = document.getElementById('step-dots');
      if (dotsEl) {
        var range = _getDotsRange(gi, total, 9);
        dotsEl.innerHTML = range.map(function (idx) {
          var cls = 'step-dot';
          if (idx === gi) {
            cls += ' step-dot-active';
          } else if (respostas[idx] !== undefined) {
            cls += parseInt(respostas[idx]) === questoes[idx].answer
              ? ' step-dot-correct'
              : ' step-dot-wrong';
          }
          return '<button class="' + cls + '" data-goto="' + idx +
            '" title="Questão ' + (idx + 1) + '"></button>';
        }).join('');

        dotsEl.querySelectorAll('.step-dot').forEach(function (dot) {
          dot.addEventListener('click', function () {
            irParaQuestao(parseInt(dot.dataset.goto));
          });
        });
      }

      var prevBtn = document.getElementById('step-prev');
      if (prevBtn) prevBtn.disabled = gi === 0;

      var nextBtn = document.getElementById('step-next');
      if (nextBtn) {
        var isLast = gi === total - 1;
        if (isLast) {
          nextBtn.innerHTML = '<i class="fas fa-flag-checkered"></i> Finalizar';
          nextBtn.dataset.finalize = '1';
        } else {
          nextBtn.innerHTML = 'Avançar <i class="fas fa-arrow-right"></i>';
          nextBtn.dataset.finalize = '0';
        }
        nextBtn.disabled = false;
      }
    }

function _aplicarModoStep(direcao) {
  if (!stepWrapper) return;

  var cards = stepWrapper.querySelectorAll('.question-container');
  cards.forEach(function (c) {
    c.classList.remove('step-active', 'step-slide-left', 'step-slide-right');
  });

  var card = cards[stepAtual];
  if (card) {
    card.classList.add('step-active');
    if (direcao === 'back') {
      card.classList.add('step-slide-left');
    } else if (direcao !== 'none') {
      card.classList.add('step-slide-right');
    }
  }

  _atualizarControlesStep();

  /* ── CORREÇÃO: ressincroniza altura ao navegar ── */
  setTimeout(_sincronizarAlturaStep, 50);
}

    function _montarShellHTML() {
      var existeHeader = document.getElementById('step-shell-header');
      var existeFooter = document.getElementById('step-shell-footer');
      if (existeHeader) existeHeader.remove();
      if (existeFooter) existeFooter.remove();

      var header = document.createElement('div');
      header.id = 'step-shell-header';
      header.innerHTML =
        '<div class="step-header">' +
          '<div class="step-progress-wrapper">' +
            '<div class="step-counter" id="step-counter"></div>' +
            '<div class="step-progress-bar">' +
              '<div class="step-progress-fill" id="step-progress-fill"></div>' +
            '</div>' +
            '<div class="step-score-badges" id="step-score-badges"></div>' +
          '</div>' +
        '</div>';
      container.parentNode.insertBefore(header, container);

      var footer = document.createElement('div');
      footer.id = 'step-shell-footer';
      footer.innerHTML =
        '<div class="step-footer">' +
          '<button class="step-btn step-btn-secondary" id="step-prev">' +
            '<i class="fas fa-arrow-left"></i> Voltar' +
          '</button>' +
          '<div class="step-dots" id="step-dots"></div>' +
          '<button class="step-btn step-btn-primary" id="step-next">' +
            'Avançar <i class="fas fa-arrow-right"></i>' +
          '</button>' +
        '</div>';
      container.parentNode.insertBefore(footer, container.nextSibling);

      document.getElementById('step-prev').addEventListener('click', questaoAnterior);

      document.getElementById('step-next').addEventListener('click', function () {
        var btn = document.getElementById('step-next');
        if (btn && btn.dataset.finalize === '1') {
          _sairModoStep();
          renderizar();
          atualizarResultados();
          setTimeout(function () { smoothScrollTo(document.body.scrollHeight, 800); }, 150);
        } else {
          proximaQuestao();
        }
      });
    }

    function _entrarModoStep() {
      modoStep = true;

      if (!container.querySelector('.question-container')) renderizar();

      ['.quiz-header', '.page-header', '.submit-container', '#results', '.page-footer']
        .forEach(function (sel) {
          var el = document.querySelector(sel);
          if (el) el.classList.add('step-hidden');
        });

      if (!container.querySelector('.step-quiz-wrapper')) {
        var wrapper = document.createElement('div');
        wrapper.className = 'step-quiz-wrapper';

        container.querySelectorAll('.subject-title, .subject-result').forEach(function (el) {
          el.classList.add('step-structural-hidden');
        });

        Array.from(container.querySelectorAll('.question-container')).forEach(function (q) {
          wrapper.appendChild(q);
        });

        container.insertBefore(wrapper, container.firstChild);
        stepWrapper = wrapper;
      } else {
        stepWrapper = container.querySelector('.step-quiz-wrapper');
      }

      container.classList.add('modo-step');
      _montarShellHTML();

      stepWrapper.style.transition = 'none';
      _aplicarModoStep('none');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (stepWrapper) {
            stepWrapper.style.transition = 'transform 0.38s cubic-bezier(0.4,0,0.2,1)';
          }
        });
      });

/* [FIX 12] Muda ícone do toggle para "lista" (não oculta mais) */
var toggle = document.getElementById('btn-toggle-modo');
if (toggle) {
  toggle.classList.add('modo-step-active');
  toggle.style.display = '';           // ← REMOVA o display:none
  toggle.title = 'Ver lista completa';
  var iToggle = toggle.querySelector('i');
  if (iToggle) iToggle.className = 'fas fa-list';
}


      smoothScrollToTop();
    }

function _sairModoStep() {
  modoStep = false;

  if (stepWrapper && stepWrapper.parentNode === container) {
    stepWrapper.style.transition = 'none';
    stepWrapper.style.transform  = 'translateX(0)';
    stepWrapper.style.height     = '';
    Array.from(stepWrapper.children).forEach(function (filho) {
      container.appendChild(filho);
    });
    stepWrapper.remove();
  }
  stepWrapper = null;

  container.classList.remove('modo-step');
  container.style.height = '';


      container.querySelectorAll('.step-structural-hidden').forEach(function (el) {
        el.classList.remove('step-structural-hidden');
      });

      var shHeader = document.getElementById('step-shell-header');
      var shFooter = document.getElementById('step-shell-footer');
      if (shHeader) shHeader.remove();
      if (shFooter) shFooter.remove();

      ['.quiz-header', '.page-header', '.submit-container', '#results', '.page-footer']
        .forEach(function (sel) {
          var el = document.querySelector(sel);
          if (el) el.classList.remove('step-hidden');
        });

/* [FIX 12] Restaura ícone e título do toggle */
var toggle = document.getElementById('btn-toggle-modo');
if (toggle) {
  toggle.classList.remove('modo-step-active');
  toggle.style.display = '';
  toggle.title = 'Modo Step (uma questão por vez)';
  var iToggle = toggle.querySelector('i');
  if (iToggle) iToggle.className = 'fas fa-layer-group';
}


    }

    function toggleModo() {
      if (modoStep) {
        _sairModoStep();
        renderizar();
        atualizarResultados();
        smoothScrollToTop();
      } else {
        _entrarModoStep();
      }
    }

function irParaQuestao(index) {
  if (index < 0 || index >= questoes.length) return;
  var direcao = index > stepAtual ? 'forward' : 'back';
  stepAtual = index;
  _aplicarModoStep(direcao);
  smoothScrollToTop();
}

    function proximaQuestao()  { irParaQuestao(stepAtual + 1); }
    function questaoAnterior() { irParaQuestao(stepAtual - 1); }

    /* ══════════════════════════════════════════════════════
       NAV-FLOAT E BINDS
       ══════════════════════════════════════════════════════ */

    var btnUp   = document.getElementById('btn-up');
    var btnDown = document.getElementById('btn-down');
    if (btnUp)   btnUp.addEventListener('click', function () { smoothScrollToTop(); });
    if (btnDown) btnDown.addEventListener('click', function () {
      smoothScrollTo(document.body.scrollHeight, 1000);
    });

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

    var btnToggle = document.getElementById('btn-toggle-modo');
    if (btnToggle) btnToggle.addEventListener('click', toggleModo);


    /* [FIX 7] Voltar */
/* [FIX 7] Voltar / Questão anterior (contexto-aware) */
var btnLeft = document.getElementById('btn-left');
if (btnLeft) {
  var urlBack = window.NEXUS_URL_BACK || null;

btnLeft.addEventListener('click', function () {
  if (urlBack) {
    window.location.href = urlBack;
  }
});
  if (!urlBack) {
    btnLeft.disabled = true;
    console.warn('[quiz_engine] window.NEXUS_URL_BACK não definido. #btn-left desativado.');
  }
}

    /* ── RENDER INICIAL ─────────────────────────────── */
    renderizar();

  } // initQuiz

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
  } else {
    initQuiz();
  }

})();