/* ============================================================
   NEXUS STUDY — quiz/quiz_engine.js  (v3)
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
     SISTEMA DE MARCAÇÕES INLINE
     ══════════════════════════════════════════════════════════ */

  function renderMarkup(text) {
    if (!text) return '';

    var s = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    s = s.replace(/==([a-z]+)==([^=]+)==/g, function (_, cat, content) {
      var classMap = {
        def:    'chip chip-ddl',
        proc:   'chip chip-dml',
        rule:   'chip chip-key',
        term:   'chip chip-type',
        warn:   'chip chip-danger',
        mark:   'chip chip-mark',
        ddl:    'chip chip-ddl',
        dml:    'chip chip-dml',
        key:    'chip chip-key',
        type:   'chip chip-type',
        danger: 'chip chip-danger',
      };
      var cls = classMap[cat] || 'chip chip-mark';
      return '<span class="' + cls + '">' + content + '</span>';
    });

    s = s.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\/\/([^/]+)\/\//g, '<em>$1</em>');

    return s;
  }

  /* ══════════════════════════════════════════════════════════
     HIGHLIGHT DE CÓDIGO (SQL + Java + Python)
     ══════════════════════════════════════════════════════════ */

  function detectLang(raw) {
    if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE|FOREIGN\s+KEY|PRIMARY\s+KEY|REFERENCES|VARCHAR|INTEGER|NOT\s+NULL)\b/i.test(raw)) return 'sql';
    if (/\b(def |class |import |from |print\(|elif |lambda )\b/.test(raw)) return 'python';
    return 'java';
  }

  function highlightSQL(raw) {
    var code = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    var strings = [];
    code = code.replace(/'([^']*)'/g, function (m) {
      strings.push(m);
      return '\x00STR' + (strings.length - 1) + '\x00';
    });

    code = code.replace(/(--[^\n]*)/g, '<span class="jk-comment">$1</span>');

    code = code.replace(
      /\b(SELECT|INSERT\s+INTO|INSERT|UPDATE|DELETE|CREATE\s+TABLE|CREATE|ALTER\s+TABLE|ALTER|DROP\s+TABLE|DROP|TRUNCATE|FROM|WHERE|JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|INNER\s+JOIN|OUTER\s+JOIN|ON|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|AS|SET|VALUES|INTO|AND|OR|NOT|IN|EXISTS|LIKE|BETWEEN|IS\s+NULL|IS\s+NOT\s+NULL|IS|NULL|PRIMARY\s+KEY|FOREIGN\s+KEY|REFERENCES|UNIQUE|CHECK|DEFAULT|NOT\s+NULL|CONSTRAINT|INDEX|CASCADE|RESTRICT|NO\s+ACTION|ON\s+DELETE|ON\s+UPDATE|AUTO_INCREMENT|SERIAL)\b/gi,
      '<span class="jk-keyword">$1</span>'
    );

    code = code.replace(
      /\b(INTEGER|INT|BIGINT|SMALLINT|TINYINT|FLOAT|DOUBLE|DECIMAL|NUMERIC|REAL|CHAR|VARCHAR|TEXT|NVARCHAR|BLOB|CLOB|DATE|TIME|DATETIME|TIMESTAMP|BOOLEAN|BOOL|SERIAL|BYTEA|UUID|JSON|JSONB|ARRAY)\b/gi,
      '<span class="jk-type">$1</span>'
    );

    code = code.replace(/\b(TRUE|FALSE|NULL)\b/gi, '<span class="jk-literal">$1</span>');
    code = code.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="jk-number">$1</span>');

    code = code.replace(/\x00STR(\d+)\x00/g, function (_, i) {
      return '<span class="jk-string">' + strings[+i] + '</span>';
    });

    return code;
  }

  function highlightJava(raw) {
    var code = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    var strings = [];
    code = code.replace(/"([^"]*)"/g, function (m) {
      strings.push(m);
      return '\x00STR' + (strings.length - 1) + '\x00';
    });

    code = code.replace(/(@\w+)/g, '<span class="jk-annotation">$1</span>');

    code = code.replace(
      /\b(public|private|protected|class|interface|extends|implements|return|void|double|int|long|float|boolean|char|byte|short|String|new|this|super|static|final|abstract|null|true|false|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|import|package)\b/g,
      '<span class="jk-keyword">$1</span>'
    );

    code = code.replace(/(\/\/[^\n]*)/g, '<span class="jk-comment">$1</span>');

    code = code.replace(/\x00STR(\d+)\x00/g, function (_, i) {
      return '<span class="jk-string">' + strings[+i] + '</span>';
    });

    return code;
  }

  function highlightPython(raw) {
    var code = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    var strings = [];
    code = code.replace(/"""([\s\S]*?)"""|'''([\s\S]*?)'''|"([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'/g, function (m) {
      strings.push(m);
      return '\x00STR' + (strings.length - 1) + '\x00';
    });

    code = code.replace(/(#[^\n]*)/g, '<span class="jk-comment">$1</span>');
    code = code.replace(/@(\w+)/g, '<span class="jk-decorator">@$1</span>');

    code = code.replace(
      /\b(def|class|return|import|from|as|if|elif|else|for|while|in|not|and|or|is|lambda|pass|break|continue|try|except|finally|raise|with|yield|global|nonlocal|del|assert|True|False|None|print|len|range|type|str|int|float|list|dict|tuple|set|bool)\b/g,
      '<span class="jk-keyword">$1</span>'
    );

    code = code.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="jk-number">$1</span>');

    code = code.replace(/\x00STR(\d+)\x00/g, function (_, i) {
      return '<span class="jk-string">' + strings[+i] + '</span>';
    });

    return code;
  }

  function highlightCode(raw) {
    var lang = detectLang(raw);
    if (lang === 'sql')    return highlightSQL(raw);
    if (lang === 'python') return highlightPython(raw);
    return highlightJava(raw);
  }

  function renderCodeBlock(code) {
    if (!code) return '';
    return '<div class="code-block"><pre>' + highlightCode(code) + '</pre></div>';
  }

  /* ══════════════════════════════════════════════════════════
     INÍCIO DO ENGINE
     ══════════════════════════════════════════════════════════ */

  function initQuiz() {

    var tipo = window.TIPO_QUIZ
      || new URLSearchParams(location.search).get('modo')
      || 'questoes';

    var listaQuestoes;

    if (Array.isArray(window.questoes)) {
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

    var questoesBase = listaQuestoes;
    var questoes     = criarCopiaEmbaralhada(questoesBase);
    var respostas    = {};
    var revelado     = false;

    var modoStep    = false;
    var stepAtual   = 0;
    var stepWrapper = null;

    var mostrandoSoErros = false;

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

    function _extrairPorQueEstaCerta(feedback) {
      var match = feedback.match(/Por que está certa:([\s\S]*)/);
      if (match) return match[1].trim();
      return feedback.trim();
    }

    /* ══════════════════════════════════════════════════════
       FORMATAÇÃO DE FEEDBACK
       ══════════════════════════════════════════════════════ */

    function formatFeedback(feedback) {
      if (!feedback) return '';

      var lines = feedback.split('\n');
      var out   = lines.map(function (line) {
        if (line.indexOf('✓ Resposta correta:') === 0) {
          return '<strong>' + renderMarkup(line) + '</strong>';
        }
        if (line.indexOf('Por que está certa:') === 0) {
          var rest = line.replace('Por que está certa:', '').trim();
          return '<strong>Por que está certa:</strong> ' + renderMarkup(rest);
        }
        return renderMarkup(line);
      });

      return out.join('<br>');
    }

    /* ══════════════════════════════════════════════════════
       CONSTRUÇÃO DO CORPO DA QUESTÃO
       ══════════════════════════════════════════════════════ */

    function renderAssertions(assertions) {
      if (!assertions || assertions.length === 0) return '';
      var romanos = ['I', 'II', 'III', 'IV', 'V', 'VI'];

      var items = assertions.map(function (text, idx) {
        var isPorque  = text.indexOf('[PORQUE]') === 0;
        var cleanText = text.replace('[PORQUE]', '').trim();
        var num       = romanos[idx] || String(idx + 1);
        var rendered  = renderMarkup(cleanText);

        if (isPorque) {
          return (
            '<div class="assertion-connector">' +
              '<span class="connector-label">PORQUE</span>' +
            '</div>' +
            '<div class="assertion">' +
              '<span class="assertion-num">' + num + '.</span>' +
              '<span>' + rendered + '</span>' +
            '</div>'
          );
        }

        return (
          '<div class="assertion">' +
            '<span class="assertion-num">' + num + '.</span>' +
            '<span>' + rendered + '</span>' +
          '</div>'
        );
      }).join('');

      return '<div class="assertions">' + items + '</div>';
    }

    function buildQuestionBody(q) {
      var html = '';

      if (q.tipo) {
        html += '<div class="question-type-eyebrow">' +
          q.tipo.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') +
        '</div>';
      }

      if (q.texto) {
        html += '<div class="question-texto">' + renderMarkup(q.texto.replace(/\n/g, '\n')) + '</div>';
      }

      if (q.miniEnunciado) {
        html += '<div class="question-mini-enunciado">' + renderMarkup(q.miniEnunciado) + '</div>';
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
        html += '<div class="question-text">' + renderMarkup(q.questionContinuation) + '</div>';
      }

      if (q.question) {
        html += '<div class="question-enunciado">' + renderMarkup(q.question) + '</div>';
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
          btn.innerHTML = String.fromCharCode(65 + ai) + ') ' + renderMarkup(alt);
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

    function _sincronizarAlturaStep() {
      if (!modoStep || !stepWrapper) return;
      var cards = stepWrapper.querySelectorAll('.question-container');
      var atual = cards[stepAtual];
      if (!atual) return;

      stepWrapper.style.height = 'auto';
      container.style.height   = 'auto';
      void atual.offsetHeight;
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

      var toggle = document.getElementById('btn-toggle-modo');
      if (toggle) {
        toggle.classList.add('modo-step-active');
        toggle.style.display = '';
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

    var btnLeft  = document.getElementById('btn-left');
    var urlBack  = window.NEXUS_URL_BACK || null;
    if (btnLeft) {
      btnLeft.addEventListener('click', function () {
        if (urlBack) window.location.href = urlBack;
      });
      if (!urlBack) {
        btnLeft.disabled = true;
        console.warn('[quiz_engine] window.NEXUS_URL_BACK não definido. #btn-left desativado.');
      }
    }

    /* ══════════════════════════════════════════════════════
       MODAL DE LEGENDA — redesign v2
       ══════════════════════════════════════════════════════ */

    (function _initLegendaModal() {

      /* ── 1. CSS REDESENHADO ────────────────────────────── */
      var style = document.createElement('style');
      style.id  = 'nexus-legenda-styles';
      style.textContent =

        /* Overlay: totalmente transparente — quiz continua visível */
        '#nexus-legenda-overlay{' +
          'position:fixed;inset:0;' +
          'background:transparent;' +
          'z-index:998;opacity:0;pointer-events:none;' +
          'transition:opacity 0.2s ease;' +
        '}' +
        '#nexus-legenda-overlay.nlg-show{opacity:1;pointer-events:all;}' +

        /* Modal principal */
        '#nexus-legenda-modal{' +
          'position:fixed;right:60px;top:50%;' +
          'transform:translateY(-50%) translateX(10px) scale(0.97);' +
          'width:300px;' +
          'background:rgba(10,15,26,0.97);' +
          'border:1px solid rgba(255,255,255,0.10);' +
          'border-top:1px solid rgba(255,255,255,0.16);' +
          'border-radius:16px;' +
          'box-shadow:' +
            '0 0 0 1px rgba(var(--accent-rgb),0.08),' +
            '0 24px 48px rgba(0,0,0,0.55),' +
            '0 4px 16px rgba(0,0,0,0.4),' +
            'inset 0 1px 0 rgba(255,255,255,0.06);' +
          'z-index:999;opacity:0;pointer-events:none;' +
          'transition:opacity 0.2s ease,transform 0.25s cubic-bezier(0.34,1.15,0.64,1);' +
          'overflow:hidden;' +
          'font-family:var(--font-body,"DM Sans",system-ui,sans-serif);' +
          'backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);' +
        '}' +
        '#nexus-legenda-modal.nlg-show{' +
          'opacity:1;pointer-events:all;' +
          'transform:translateY(-50%) translateX(0) scale(1);' +
        '}' +

        /* Botão legenda na nav */
        '.btn-legenda{' +
          'background:rgba(var(--accent-rgb),0.06)!important;' +
          'border-color:rgba(var(--accent-rgb),0.18)!important;' +
          'color:rgba(var(--accent-rgb),0.5)!important;' +
        '}' +
        '.btn-legenda:hover{' +
          'background:rgba(var(--accent-rgb),0.14)!important;' +
          'border-color:rgba(var(--accent-rgb),0.4)!important;' +
          'color:var(--accent)!important;' +
        '}' +
        '#btn-legenda.nlg-active{' +
          'background:rgba(var(--accent-rgb),0.18)!important;' +
          'border-color:rgba(var(--accent-rgb),0.55)!important;' +
          'color:var(--accent)!important;' +
          'box-shadow:0 0 0 2px rgba(var(--accent-rgb),0.12);' +
        '}' +

        /* Header do modal */
        '.nlg-header{' +
          'padding:0.9rem 1rem 0.75rem;' +
          'display:flex;align-items:center;justify-content:space-between;' +
          'border-bottom:1px solid rgba(255,255,255,0.06);' +
          'background:linear-gradient(180deg,rgba(var(--accent-rgb),0.05) 0%,transparent 100%);' +
        '}' +
        '.nlg-header-left{display:flex;flex-direction:column;gap:0.1rem;}' +
        '.nlg-eyebrow{' +
          'font-size:0.52rem;font-weight:700;letter-spacing:0.22em;' +
          'text-transform:uppercase;color:var(--accent);opacity:0.55;' +
        '}' +
        '.nlg-title{' +
          'font-size:0.88rem;font-weight:600;color:#f0ede6;letter-spacing:-0.015em;' +
        '}' +
        '.nlg-close{' +
          'width:24px;height:24px;' +
          'background:rgba(255,255,255,0.04);' +
          'border:1px solid rgba(255,255,255,0.07);' +
          'border-radius:6px;color:#6e6a62;cursor:pointer;' +
          'display:flex;align-items:center;justify-content:center;' +
          'font-size:0.65rem;flex-shrink:0;' +
          'transition:all 0.18s;line-height:1;' +
        '}' +
        '.nlg-close:hover{' +
          'background:rgba(248,113,113,0.1);' +
          'border-color:rgba(248,113,113,0.28);color:#fca5a5;' +
        '}' +

        /* Body */
        '.nlg-body{' +
          'padding:0.65rem 0.85rem;' +
          'display:flex;flex-direction:column;gap:0.5rem;' +
          'max-height:68vh;overflow-y:auto;' +
        '}' +
        '.nlg-body::-webkit-scrollbar{width:2px;}' +
        '.nlg-body::-webkit-scrollbar-thumb{' +
          'background:rgba(var(--accent-rgb),0.2);border-radius:2px;' +
        '}' +

        /* Label de seção */
        '.nlg-section-label{' +
          'display:flex;align-items:center;gap:0.5rem;' +
          'font-size:0.5rem;font-weight:700;letter-spacing:0.22em;' +
          'text-transform:uppercase;color:rgba(255,255,255,0.2);' +
          'margin-bottom:0.2rem;' +
        '}' +
        '.nlg-section-label::after{' +
          'content:"";flex:1;height:1px;' +
          'background:rgba(255,255,255,0.05);' +
        '}' +

        '.nlg-divider{height:1px;background:rgba(255,255,255,0.05);margin:0.1rem 0;}' +

        /* Linhas de tipo de questão */
        '.nlg-tipo-row{' +
          'display:flex;align-items:center;gap:0.6rem;' +
          'padding:0.45rem 0.6rem;' +
          'background:rgba(255,255,255,0.02);' +
          'border:1px solid rgba(255,255,255,0.05);' +
          'border-radius:10px;' +
          'transition:all 0.15s;cursor:default;' +
        '}' +
        '.nlg-tipo-row:hover{' +
          'background:rgba(255,255,255,0.04);' +
          'border-color:rgba(255,255,255,0.09);' +
        '}' +

        /* Ícone do tipo */
        '.nlg-tipo-icon{' +
          'width:30px;height:30px;border-radius:8px;' +
          'display:flex;align-items:center;justify-content:center;' +
          'font-size:0.55rem;font-weight:800;letter-spacing:-0.03em;' +
          'flex-shrink:0;' +
          'font-family:var(--font-mono,"JetBrains Mono",monospace);' +
        '}' +
        '.nlg-icon-aj {' +
          'background:linear-gradient(135deg,rgba(122,168,232,0.18),rgba(122,168,232,0.08));' +
          'color:#93c5fd;border:1px solid rgba(122,168,232,0.22);' +
        '}' +
        '.nlg-icon-ma {' +
          'background:linear-gradient(135deg,rgba(77,217,180,0.15),rgba(77,217,180,0.07));' +
          'color:#5eead4;border:1px solid rgba(77,217,180,0.2);' +
        '}' +
        '.nlg-icon-con{' +
          'background:linear-gradient(135deg,rgba(251,191,36,0.15),rgba(251,191,36,0.07));' +
          'color:#fbbf24;border:1px solid rgba(251,191,36,0.2);' +
        '}' +
        '.nlg-icon-cod{' +
          'background:linear-gradient(135deg,rgba(167,139,250,0.18),rgba(167,139,250,0.08));' +
          'color:#c4b5fd;border:1px solid rgba(167,139,250,0.22);' +
          'font-size:0.6rem;letter-spacing:-0.05em;' +
        '}' +
        '.nlg-icon-ap {' +
          'background:linear-gradient(135deg,rgba(248,113,113,0.15),rgba(248,113,113,0.07));' +
          'color:#fca5a5;border:1px solid rgba(248,113,113,0.2);' +
        '}' +

        /* Info do tipo */
        '.nlg-tipo-info{display:flex;flex-direction:column;gap:1px;min-width:0;}' +
        '.nlg-tipo-nome{' +
          'font-size:0.74rem;font-weight:500;color:#e8e4dc;' +
          'line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;' +
        '}' +
        '.nlg-tipo-desc{font-size:0.62rem;color:#4e4a43;line-height:1.35;}' +

        /* Linhas de chip */
        '.nlg-chip-row{' +
          'display:flex;align-items:center;gap:0.55rem;' +
          'padding:0.38rem 0.6rem;' +
          'background:rgba(255,255,255,0.015);' +
          'border:1px solid rgba(255,255,255,0.045);' +
          'border-radius:8px;transition:all 0.15s;cursor:default;' +
        '}' +
        '.nlg-chip-row:hover{' +
          'background:rgba(255,255,255,0.035);' +
          'border-color:rgba(255,255,255,0.08);' +
        '}' +

        /* Chip demo */
        '.nlg-chip{' +
          'font-family:var(--font-mono,"JetBrains Mono",monospace);' +
          'font-size:0.58rem;font-weight:700;letter-spacing:0.02em;' +
          'padding:2px 6px;border-radius:4px;' +
          'white-space:nowrap;flex-shrink:0;' +
          'min-width:72px;text-align:center;' +
        '}' +
        '.nlg-ddl   {background:rgba(122,168,232,0.12);color:#93c5fd;border:1px solid rgba(122,168,232,0.25);}' +
        '.nlg-dml   {background:rgba(77,217,180,0.10);color:#5eead4;border:1px solid rgba(77,217,180,0.22);}' +
        '.nlg-key   {background:rgba(251,191,36,0.10);color:#fbbf24;border:1px solid rgba(251,191,36,0.22);}' +
        '.nlg-type  {background:rgba(167,139,250,0.10);color:#c4b5fd;border:1px solid rgba(167,139,250,0.22);}' +
        '.nlg-danger{background:rgba(248,113,113,0.10);color:#fca5a5;border:1px solid rgba(248,113,113,0.22);}' +
        '.nlg-mark  {background:rgba(var(--accent-rgb),0.10);color:var(--accent);border:1px solid rgba(var(--accent-rgb),0.22);}' +

        /* Desc ao lado do chip */
        '.nlg-desc{display:flex;flex-direction:column;gap:0;min-width:0;}' +
        '.nlg-desc-main{font-size:0.72rem;font-weight:500;color:#ccc9c0;line-height:1.3;}' +
        '.nlg-desc-sub{font-size:0.6rem;color:#4e4a43;line-height:1.3;}' +

        /* Bloco de descrição de modo */
        '.nlg-enade-block{' +
          'padding:0.55rem 0.7rem;' +
          'background:linear-gradient(135deg,rgba(var(--accent-rgb),0.07),rgba(var(--accent-rgb),0.03));' +
          'border:1px solid rgba(var(--accent-rgb),0.14);' +
          'border-radius:10px;' +
          'display:flex;gap:0.55rem;align-items:flex-start;' +
        '}' +
        '.nlg-enade-icon{' +
          'font-size:0.85rem;line-height:1;flex-shrink:0;margin-top:1px;' +
        '}' +
        '.nlg-enade-text{display:flex;flex-direction:column;gap:0.15rem;}' +
        '.nlg-enade-label{' +
          'font-size:0.52rem;font-weight:700;letter-spacing:0.18em;' +
          'text-transform:uppercase;color:var(--accent);opacity:0.7;' +
        '}' +
        '.nlg-enade-desc{' +
          'font-size:0.68rem;color:#8a8680;line-height:1.5;' +
        '}' +

        /* Footer */
        '.nlg-footer{' +
          'padding:0.5rem 0.85rem;' +
          'border-top:1px solid rgba(255,255,255,0.05);' +
          'display:flex;align-items:center;gap:0.35rem;' +
          'background:rgba(0,0,0,0.15);' +
        '}' +
        '.nlg-footer-dot{' +
          'width:4px;height:4px;border-radius:50%;' +
          'background:var(--accent);opacity:0.35;flex-shrink:0;' +
        '}' +
        '.nlg-footer-text{' +
          'font-size:0.58rem;color:#3a3730;letter-spacing:0.02em;line-height:1.4;' +
        '}';

      document.head.appendChild(style);

      /* ── 2. HELPERS DOM ────────────────────────────────── */

      function _el(tag, cls, txt) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (txt !== undefined) e.textContent = txt;
        return e;
      }

      function _tipoRow(iconCls, iconTxt, nome, desc) {
        var row  = _el('div', 'nlg-tipo-row');
        var icon = _el('div', 'nlg-tipo-icon ' + iconCls, iconTxt);
        var info = _el('div', 'nlg-tipo-info');
        info.appendChild(_el('span', 'nlg-tipo-nome', nome));
        info.appendChild(_el('span', 'nlg-tipo-desc', desc));
        row.appendChild(icon);
        row.appendChild(info);
        return row;
      }

      function _chipRow(chipCls, label, main, sub) {
        var row  = _el('div', 'nlg-chip-row');
        var chip = _el('span', 'nlg-chip ' + chipCls, label);
        var desc = _el('div', 'nlg-desc');
        desc.appendChild(_el('span', 'nlg-desc-main', main));
        desc.appendChild(_el('span', 'nlg-desc-sub', sub));
        row.appendChild(chip);
        row.appendChild(desc);
        return row;
      }

      function _secao(labelTxt) {
        var wrap = _el('div');
        var lbl  = _el('div', 'nlg-section-label', labelTxt);
        wrap.appendChild(lbl);
        var list = _el('div');
        list.style.cssText = 'display:flex;flex-direction:column;gap:0.22rem;';
        wrap.appendChild(list);
        return { wrap: wrap, list: list };
      }

      /* ── 3. OVERLAY + MODAL ────────────────────────────── */
      var overlay = _el('div');
      overlay.id = 'nexus-legenda-overlay';
      document.body.appendChild(overlay);

      var modal = _el('div');
      modal.id = 'nexus-legenda-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Guia de marcações e tipos de questão');

      /* header */
      var header   = _el('div', 'nlg-header');
      var hLeft    = _el('div', 'nlg-header-left');
      hLeft.appendChild(_el('span', 'nlg-eyebrow', 'Nexus Study'));
      hLeft.appendChild(_el('span', 'nlg-title',   'Guia de Marcações'));
      var closeBtn = _el('button', 'nlg-close', '\u00d7');
      closeBtn.id = 'nlg-close-btn';
      closeBtn.setAttribute('aria-label', 'Fechar guia');
      header.appendChild(hLeft);
      header.appendChild(closeBtn);
      modal.appendChild(header);

      /* ── CONTEXTO: disciplina e modo ──────────────────────
         template_init.js injeta:
           document.body.dataset.disciplina  (ex: 'design', 'poo')
           document.body.dataset.modo        (ex: 'enade', 'questoes', 'ava')
      ──────────────────────────────────────────────────── */
      var _disc  = document.body.dataset.disciplina || '';
      var _modo  = document.body.dataset.modo       || '';

      /* Disciplinas que usam código (SQL / Java / Python) */
      var _CODE_DISC = ['poo', 'banco_dados', 'redes'];
      var _hasCode   = _CODE_DISC.indexOf(_disc) !== -1;

      /* body */
      var body = _el('div', 'nlg-body');

      /* ── Bloco de modo (contextual — aparece em todos os modos) ── */
      var _modoCfg = null;
      if      (_modo === 'enade')    _modoCfg = {
        icon:  '🎓',
        label: 'Estilo ENADE',
        desc:  'Questões elaboradas no formato ENADE: enunciados contextualizados, ' +
               'afirmativas para análise crítica e alternativas plausíveis.'
      };
      else if (_modo === 'ava')      _modoCfg = {
        icon:  '📋',
        label: 'Questões AVA',
        desc:  'Questões extraídas ou adaptadas das atividades acadêmicas, ' +
               'elaboradas e aplicadas pelos professores no AVA.'
      };
      else if (_modo === 'questoes') _modoCfg = {
        icon:  '🤖',
        label: 'Geradas por IA',
        desc:  'Questões geradas por Inteligência Artificial com base no conteúdo ' +
               'da disciplina — diretas, variadas e progressivas em dificuldade.'
      };

      if (_modoCfg) {
        var modoBlock = _el('div', 'nlg-enade-block');
        var modoIcon  = _el('div', 'nlg-enade-icon', _modoCfg.icon);
        var modoTxt   = _el('div', 'nlg-enade-text');
        modoTxt.appendChild(_el('span', 'nlg-enade-label', _modoCfg.label));
        modoTxt.appendChild(_el('span', 'nlg-enade-desc',  _modoCfg.desc));
        modoBlock.appendChild(modoIcon);
        modoBlock.appendChild(modoTxt);
        body.appendChild(modoBlock);
        body.appendChild(_el('div', 'nlg-divider'));
      }

      /* ── Seção tipos de questão ──────────────────────── */
      var sTipos = _secao('Tipos de questão');

      if (_modo === 'enade') {
        /* Tipos exclusivos do formato ENADE */
        sTipos.list.appendChild(_tipoRow('nlg-icon-aj',  'A+J',  'Asserção + Justificativa', 'Duas afirmativas com PORQUE'));
        sTipos.list.appendChild(_tipoRow('nlg-icon-ma',  'I–IV', 'Múltiplas afirmativas',    'Identifique as corretas'));
        sTipos.list.appendChild(_tipoRow('nlg-icon-con', 'CON',  'Conceitual',               'Contexto + pergunta direta'));
        if (_hasCode) {
          sTipos.list.appendChild(_tipoRow('nlg-icon-cod', '</>', 'Análise de código', 'Script ou trecho — avalie afirmativas'));
        }
        sTipos.list.appendChild(_tipoRow('nlg-icon-ap', 'APL', 'Análise aplicada', 'Situação-problema real'));
      } else {
        /* ava e questoes: mesmos tipos (professor / IA) */
        sTipos.list.appendChild(_tipoRow('nlg-icon-con', 'CUR', 'Curta',     'Pergunta objetiva, sem contexto extenso'));
        sTipos.list.appendChild(_tipoRow('nlg-icon-aj',  'DIR', 'Direta',    'Pergunta com contexto mínimo'));
        sTipos.list.appendChild(_tipoRow('nlg-icon-ma',  'CTX', 'Contexto',  'Cenário simples com interpretação'));
        sTipos.list.appendChild(_tipoRow('nlg-icon-ap',  'APL', 'Aplicação', 'Situação-problema com maior análise'));
        if (_hasCode) {
          sTipos.list.appendChild(_tipoRow('nlg-icon-cod', '</>', 'Código', 'Trecho de código — avalie comportamento'));
        }
      }

      body.appendChild(sTipos.wrap);

      body.appendChild(_el('div', 'nlg-divider'));

      /* ── Seção chips — semântica por disciplina ──────── */
      var sChips = _secao('Cores dos chips');

      if (_hasCode) {
        /* Disciplinas com código: SQL / programação */
        sChips.list.appendChild(_chipRow('nlg-ddl',    'DDL / def',     'Azul — Estrutura',      'CREATE, ALTER, DROP'));
        sChips.list.appendChild(_chipRow('nlg-dml',    'DML / proc',    'Verde — Processo',      'SELECT, INSERT, UPDATE'));
        sChips.list.appendChild(_chipRow('nlg-key',    'KEY / rule',    'Âmbar — Regra',         'PRIMARY KEY, FOREIGN KEY'));
        sChips.list.appendChild(_chipRow('nlg-type',   'TYPE / term',   'Lilás — Tipo',          'VARCHAR, INTEGER, DATE'));
        sChips.list.appendChild(_chipRow('nlg-danger', 'DANGER / warn', 'Vermelho — Perigo',     'DROP TABLE, erros comuns'));
        sChips.list.appendChild(_chipRow('nlg-mark',   'MARK',          'Acento — Destaque',     'Termos sem categoria fixa'));
      } else {
        /* Disciplinas conceituais: design, gestão, etc. */
        sChips.list.appendChild(_chipRow('nlg-ddl',    'def',  'Azul — Definição',      'Conceitos e estruturas formais'));
        sChips.list.appendChild(_chipRow('nlg-dml',    'proc', 'Verde — Processo',      'Ações, etapas e fluxos'));
        sChips.list.appendChild(_chipRow('nlg-key',    'rule', 'Âmbar — Regra',         'Princípios, leis e restrições'));
        sChips.list.appendChild(_chipRow('nlg-type',   'term', 'Lilás — Termo técnico', 'Classificações e tipologias'));
        sChips.list.appendChild(_chipRow('nlg-danger', 'warn', 'Vermelho — Atenção',    'Erros comuns e armadilhas'));
        sChips.list.appendChild(_chipRow('nlg-mark',   'mark', 'Acento — Destaque',     'Termos sem categoria fixa'));
      }

      body.appendChild(sChips.wrap);

      modal.appendChild(body);

      /* footer */
      var footer = _el('div', 'nlg-footer');
      footer.appendChild(_el('div', 'nlg-footer-dot'));
      footer.appendChild(_el('span', 'nlg-footer-text',
        'Chips aparecem em questões, afirmativas e feedbacks'
      ));
      modal.appendChild(footer);

      document.body.appendChild(modal);

      /* ── 4. OPEN / CLOSE ───────────────────────────────── */
      function _open() {
        modal.classList.add('nlg-show');
        overlay.classList.add('nlg-show');
        var b = document.getElementById('btn-legenda');
        if (b) b.classList.add('nlg-active');
      }

      function _close() {
        modal.classList.remove('nlg-show');
        overlay.classList.remove('nlg-show');
        var b = document.getElementById('btn-legenda');
        if (b) b.classList.remove('nlg-active');
      }

      function _toggle() {
        modal.classList.contains('nlg-show') ? _close() : _open();
      }

      /* ── 5. BINDS ──────────────────────────────────────── */
      var btnLegenda = document.getElementById('btn-legenda');
      if (btnLegenda) btnLegenda.addEventListener('click', _toggle);

      closeBtn.addEventListener('click', _close);
      overlay.addEventListener('click', _close);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') _close();
      });

    })(); /* fim _initLegendaModal */

    renderizar();

  } // initQuiz

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
  } else {
    initQuiz();
  }

})();