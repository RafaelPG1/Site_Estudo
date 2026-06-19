/* ============================================================
   NEXUS STUDY — quiz/quiz_engine.js
   Lógica de estado do quiz — depende de quiz_ui.js

   ÍNDICE:
     1. Contexto e configuração ........... L.95
     2. Expiração (20s) ................... L.140
     3. Embaralhamento ..................... L.190
     4. Estado e restauração .............. L.240
     5. Feedback e corpo .................. L.300
     6. Resultado por aula ................ L.350
     7. Renderização ...................... L.410
     8. Interação do usuário .............. L.510
     9. Resultado global .................. L.590
    10. Ver erros ......................... L.640
    11. Modo Step ......................... L.720
    12. Binds e boot ...................... L.930
    13. Filtro de aulas ................... L.980

   v9 — filtro de aulas:
     Novo botão na nav-float para o usuário escolher
     quais aulas exibir. Painel lateral com checkboxes.
     aulasFiltradas=null → todas; Set<string> → filtradas.

   v8 — embaralhamento por grupo de aula:
     Questões são embaralhadas DENTRO de cada aula, preservando
     a ordem das aulas. Isso garante que subject-title e
     subject-result apareçam corretamente para todas as aulas,
     independente de quantas aulas a disciplina tiver.

   INTEGRAÇÃO COM O QUIZ-ASSISTANT:
     Após cada renderização, o engine:
       1. Grava window.__NEXUS_QUESTOES_VISUAIS__ com o snapshot imutável
          da lista atual de questões (alternativas já embaralhadas).
       2. Na primeira inicialização, dispara o evento 'nexus:quizPronto'
          e seta window.__NEXUS_QUIZ_PRONTO__ = true como flag de fallback.

     O Quiz-Assistant lê o snapshot e escuta o evento.
     O engine NUNCA chama diretamente funções do assistant.
     Sem polling, sem dependência cruzada de módulos.
   ============================================================ */

(function () {
  'use strict';

  /* ── Aliases de quiz_ui.js ─────────────────────────────── */
  var smoothScrollTo    = window.QuizUI.smoothScrollTo;
  var smoothScrollToTop = window.QuizUI.smoothScrollToTop;
  var renderMarkup      = window.QuizUI.renderMarkup;
  var renderCodeBlock   = window.QuizUI.renderCodeBlock;

  /* ══════════════════════════════════════════════════════════
     SNAPSHOT VISUAL
     Único ponto de escrita de __NEXUS_QUESTOES_VISUAIS__.
     Chamado APENAS pelo engine, em eventos bem definidos.
     Dispara nexus:quizPronto na primeira vez.
  ══════════════════════════════════════════════════════════ */

  var _snapshotDisparado = false;

  function _publicarSnapshot(lista) {
    // Snapshot imutável: cópia rasa da lista atual
    window.__NEXUS_QUESTOES_VISUAIS__ = (lista || []).slice();

    if (!_snapshotDisparado) {
      _snapshotDisparado = true;
      // Flag de fallback: se o assistant carregar DEPOIS do evento, usa este flag
      window.__NEXUS_QUIZ_PRONTO__ = true;
      // Evento principal: assistant escuta e inicializa
      try {
        window.dispatchEvent(new CustomEvent('nexus:quizPronto'));
      } catch (e) {
        console.warn('[quiz_engine] falha ao disparar nexus:quizPronto:', e);
      }
      console.log('[quiz_engine] nexus:quizPronto disparado —',
                  window.__NEXUS_QUESTOES_VISUAIS__.length, 'questões no snapshot.');
    }
  }

  /* ══════════════════════════════════════════════════════════
     INIT QUIZ
     ══════════════════════════════════════════════════════════ */

  function initQuiz() {

    /* ── 1. CONTEXTO E CONFIGURAÇÃO ───────────────────────── */

    var _disc     = window.__NEXUS_QUIZ_DISC__     || null;
    var _modo     = window.__NEXUS_QUIZ_MODO__
      || new URLSearchParams(location.search).get('modo')
      || 'questoes';
    var tipo      = _modo;
    var _semestre = window.__NEXUS_QUIZ_SEMESTRE__ || '';
    var _Storage  = window.NexusStorage            || null;

    /* ── UID do usuário logado (isola dados por pessoa) ── */
    function _uid() {
      var u = _Storage ? _Storage.get('usuario', null) : null;
      return (u && u.uid) ? u.uid : 'guest';
    }

    /* ── Prefixo de disco isolado por usuário ── */
    function _discUid() {
      return _uid() + '_' + _disc;
    }

    function _smapKey() {
      return 'quiz_smap_' + _uid() + '_' + _disc + '_' + _modo + '_' + _semestre;
    }

    function _stepStateKey() {
      return 'quiz_step_' + _uid() + '_' + _disc + '_' + _modo + '_' + _semestre;
    }

    function _salvarEstadoStep() {
      if (!_Storage) return;
      _Storage.set(_stepStateKey(), { ativo: modoStep, atual: stepAtual });
    }

    function _limparEstadoStep() {
      if (!_Storage) return;
      _Storage.remove(_stepStateKey());
    }

    /* ── Converte respostas {qi: ai} → string compacta ── */
    function _respostasParaStr(resps, total) {
      var arr = [];
      for (var i = 0; i < total; i++) {
        arr.push(resps[i] !== undefined ? String(resps[i]) : 'null');
      }
      return arr.join(',');
    }

    /* ── Converte string compacta → respostas {qi: ai} ── */
    function _strParaRespostas(str) {
      var resps = {};
      str.split(',').forEach(function (v, i) {
        if (v !== 'null') resps[i] = parseInt(v);
      });
      return resps;
    }

    /* ── Salva no Firebase (fire-and-forget) ── */
    function _salvarFirebase(finalizado) {
      if (!window.NexusFirebase || !_disc) return;
      var usuario = _Storage ? _Storage.get('usuario', null) : null;
      if (!usuario || !usuario.uid) return;

      var str = _respostasParaStr(respostas, questoesBase.length);
      window.NexusFirebase.salvarRespostasQuiz(
        usuario.uid, _semestre, _modo, _disc, str, revelado, finalizado
      ).catch(function () {});
    }

    /* ══════════════════════════════════════════════════════════
       2. EXPIRAÇÃO (20s)
       ══════════════════════════════════════════════════════════ */

    var EXPIRY_FINALIZADO_MS = 20000;
    var EXPIRY_PARCIAL_MS    = 600000;

    function _leftAtKey() {
      return 'quiz_leftat_' + _uid() + '_' + _disc + '_' + _modo + '_' + _semestre;
    }

    function _registrarSaida() {
      if (!_disc || !_Storage) return;
      var salvo = _Storage.loadProgress(_discUid(), _modo, _semestre);
      if (!salvo) return;
      var configs = _Storage.get('configs', {});

      if (salvo.finalizado && configs.salvarProgresso === false) {
        _Storage.set(_leftAtKey(), JSON.stringify({ ts: Date.now(), tipo: 'finalizado' }));
        return;
      }
      if (!salvo.finalizado && configs.salvarProgressoParcial === false) {
        _Storage.set(_leftAtKey(), JSON.stringify({ ts: Date.now(), tipo: 'parcial' }));
      }
    }

    function _verificarRetorno(aoExpirar) {
      if (!_disc || !_Storage) return;
      var raw = _Storage.get(_leftAtKey(), null);
      if (raw === null) return;

      _Storage.remove(_leftAtKey());

      var payload;
      try {
        payload = typeof raw === 'string' ? JSON.parse(raw) : raw;
      } catch (e) { return; }

      var tempoFora = Date.now() - payload.ts;
      var limite    = payload.tipo === 'parcial' ? EXPIRY_PARCIAL_MS : EXPIRY_FINALIZADO_MS;

      if (tempoFora >= limite) {
        _Storage.clearProgress(_discUid(), _modo, _semestre);
        _Storage.remove(_smapKey());
        console.info('[quiz_engine] Progresso expirado. Tipo:', payload.tipo,
                     '| tempo fora:', Math.round(tempoFora / 1000) + 's');
        if (typeof aoExpirar === 'function') aoExpirar();
      }
    }

    /* ── Listeners de saída ─────────────────────────────────── */
    window.addEventListener('pagehide', _registrarSaida);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) _registrarSaida();
    });

    /* ── Questões ─────────────────────────────────────────── */

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
          '<div style="padding:3rem 2rem;text-align:center;color:var(--text-2,#a8a49c);">' +
          '<div style="font-size:2.5rem;margin-bottom:1rem;">📭</div>' +
          '<p style="font-size:1rem;margin-bottom:0.5rem;">Nenhum conteúdo disponível para ' +
          '<strong style="color:var(--text-1,#f0ede6);">' + tipo.toUpperCase() + '</strong>' +
          ' neste semestre.</p>' +
          '<p style="font-size:0.85rem;opacity:0.6;">As questões serão adicionadas em breve.</p>' +
          '</div>';
      }
      return;
    }

    var questoesBase = listaQuestoes;

    /* ══════════════════════════════════════════════════════════
       3. EMBARALHAMENTO (v8 — por grupo de aula)
       ══════════════════════════════════════════════════════════ */

    function shuffleArray(arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
      }
      return a;
    }

    var shuffleMap = {};

    function criarCopiaEmbaralhada(base, mapaFixo) {
      var novoMapa = {};

      var gruposAula    = [];
      var aulaParaGrupo = {};

      base.forEach(function (q, qi) {
        var aula = q.aula !== undefined ? q.aula : '__sem_aula__';
        if (aulaParaGrupo[aula] === undefined) {
          aulaParaGrupo[aula] = gruposAula.length;
          gruposAula.push({ aula: aula, indices: [] });
        }
        gruposAula[aulaParaGrupo[aula]].indices.push(qi);
      });

      var ordemFinal = [];
      gruposAula.forEach(function (grupo) {
        var indicesOriginais   = grupo.indices;
        var indicesEmbaralhados;
        if (mapaFixo && mapaFixo['__grupo__' + grupo.aula]) {
          indicesEmbaralhados = mapaFixo['__grupo__' + grupo.aula];
        } else {
          indicesEmbaralhados = shuffleArray(indicesOriginais);
        }
        novoMapa['__grupo__' + grupo.aula] = indicesEmbaralhados;
        indicesEmbaralhados.forEach(function (qi) { ordemFinal.push(qi); });
      });

      var result = ordemFinal.map(function (qi) {
        var q = base[qi];

        var indices = (mapaFixo && mapaFixo[qi])
          ? mapaFixo[qi]
          : shuffleArray(q.options.map(function (_, i) { return i; }));

        novoMapa[qi] = indices;

        var newOptions    = indices.map(function (i) { return q.options[i]; });
        var newAnswer     = indices.indexOf(q.answer);
        var correctLetter = String.fromCharCode(65 + newAnswer);
        var originalOpt   = q.options[q.answer];
        var feedbackBase  = _extrairPorQueEstaCerta(q.feedback || '');
        var newFeedback   =
          '✓ Resposta correta: ' + correctLetter + ') ' + originalOpt +
          (feedbackBase ? '\n\nPor que está certa: ' + feedbackBase : '');

        return Object.assign({}, q, {
          options:       newOptions,
          answer:        newAnswer,
          feedback:      newFeedback,
          __qiOriginal__: qi,
        });
      });

      shuffleMap = novoMapa;
      return result;
    }

    function _extrairPorQueEstaCerta(feedback) {
      var match = feedback.match(/Por que está certa:([\s\S]*)/);
      if (match) return match[1].trim();
      return feedback.trim();
    }

    /* ── FILTRO DE AULAS — helpers ────────────────────────── */

    function _todasAsAulas() {
      var vistas = {};
      var lista  = [];
      questoesBase.forEach(function (q) {
        var aula = q.aula !== undefined ? q.aula : null;
        if (aula !== null && !vistas[aula]) {
          vistas[aula] = true;
          lista.push(aula);
        }
      });
      return lista;
    }

    function _atualizarBadgeFiltro() {
      var btn = document.getElementById('btn-filtro-aulas');
      if (!btn) return;
      var todasAulas = _todasAsAulas();
      var ativo = aulasFiltradas !== null && aulasFiltradas.size < todasAulas.length;
      btn.classList.toggle('filtro-ativo', ativo);
      var badge = btn.querySelector('.filtro-badge');
      if (badge) badge.remove();
      if (ativo) {
        var b = document.createElement('span');
        b.className   = 'filtro-badge';
        b.textContent = aulasFiltradas.size;
        btn.appendChild(b);
      }
    }

    function _aplicarFiltro() {
      var base = aulasFiltradas === null
        ? questoesBase
        : questoesBase.filter(function (q) {
            var aula = q.aula !== undefined ? q.aula : null;
            return aulasFiltradas.has(aula);
          });

      if (base.length === 0) base = questoesBase;

      respostas        = {};
      revelado         = false;
      mostrandoSoErros = false;
      stepAtual        = 0;

      questoes = criarCopiaEmbaralhada(base, null);

      // Atualiza snapshot após filtro
      _publicarSnapshot(questoes);

      var resultsEl = document.getElementById('results');
      if (resultsEl) { resultsEl.style.display = 'none'; resultsEl.innerHTML = ''; }

      _resetarBotaoErros();
      renderizar();
      atualizarResultados();
      smoothScrollToTop();
      _atualizarBadgeFiltro();
    }

    /* ── 4. ESTADO E RESTAURAÇÃO ──────────────────────────── */

    var respostas        = {};
    var revelado         = false;
    var modoStep         = false;
    var stepAtual        = 0;
    var stepWrapper      = null;
    var mostrandoSoErros = false;
    var aulaGrupos           = [];
    var _stepAulaBannerTimer = null;
    var aulasFiltradas        = null;

    function _restaurar() {
      if (!_disc || !_Storage) return null;

      var salvoLocal = _Storage.loadProgress(_discUid(), _modo, _semestre);
      var fbDados    = window.__NEXUS_FIREBASE_RESPOSTAS__ || null;
      var salvo      = salvoLocal;

      if (fbDados) {
        var tsLocal = salvoLocal ? (salvoLocal.savedAt || 0) : 0;
        var tsFB    = fbDados.savedAt || 0;

        if (tsFB > tsLocal) {
          var fbRespostas = _strParaRespostas(fbDados.respostas || '');
          salvo = {
            respostas:  fbRespostas,
            revelado:   fbDados.revelado   || false,
            finalizado: fbDados.finalizado || false,
            savedAt:    tsFB,
          };
          _Storage.saveProgress(_discUid(), _modo, _semestre,
                                fbRespostas, salvo.revelado, salvo.finalizado);
        }
      }

      if (!salvo || !salvo.respostas) return null;

      Object.keys(salvo.respostas).forEach(function (qi) {
        respostas[parseInt(qi)] = salvo.respostas[qi];
      });
      if (salvo.revelado) revelado = true;

      return _Storage.get(_smapKey(), null);
    }

    function _salvarShuffleMap() {
      if (_disc && _Storage) _Storage.set(_smapKey(), shuffleMap);
    }

    /* ── Inicialização ── */
    _verificarRetorno(null);
    var savedShuffleMap = _restaurar();
    var questoes = criarCopiaEmbaralhada(questoesBase, savedShuffleMap);

    if (savedShuffleMap === null && _disc && _Storage) {
      _salvarShuffleMap();
    }

    var metaTotal = document.getElementById('meta-total');
    if (metaTotal) {
      var span = metaTotal.querySelector('span');
      if (span) span.textContent = questoes.length + ' questões';
    }

    /* ── 5. FEEDBACK E CORPO DA QUESTÃO ───────────────────── */

    function formatFeedback(feedback) {
      if (!feedback) return '';
      var lines = feedback.split('\n');
      return lines.map(function (line) {
        if (line.indexOf('✓ Resposta correta:') === 0) {
          return '<strong>' + renderMarkup(line) + '</strong>';
        }
        if (line.indexOf('Por que está certa:') === 0) {
          return '<strong>Por que está certa:</strong> ' +
                 renderMarkup(line.replace('Por que está certa:', '').trim());
        }
        return renderMarkup(line);
      }).join('<br>');
    }

    function renderAssertions(assertions, tipo) {
      if (!assertions || assertions.length === 0) return '';
      var romanos = ['I', 'II', 'III', 'IV', 'V', 'VI'];
      var comChk  = tipo !== 'Asserção + Justificativa' && tipo !== 'Asserção';

      var items = assertions.map(function (text, idx) {
        var isPorque  = text.indexOf('[PORQUE]') === 0;
        var cleanText = text.replace('[PORQUE]', '').trim();
        var num       = romanos[idx] || String(idx + 1);
        var rendered  = renderMarkup(cleanText);

        var chkBtn = (comChk && !isPorque)
          ? '<button class="assertion-chk" data-chk="0" aria-label="Marcar assertiva ' +
            num + '" type="button"></button>'
          : '';

        if (isPorque) {
          return '<div class="assertion-connector"><span class="connector-label">PORQUE</span></div>' +
                 '<div class="assertion"><span class="assertion-num">' + num + '.</span>' +
                 '<span>' + rendered + '</span></div>';
        }
        return '<div class="assertion"><span class="assertion-num">' + num + '.</span>' +
               '<span>' + rendered + '</span>' + chkBtn + '</div>';
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
      if (q.texto)                html += '<div class="question-texto">'          + renderMarkup(q.texto)                + '</div>';
      if (q.miniEnunciado)        html += '<div class="question-mini-enunciado">' + renderMarkup(q.miniEnunciado)        + '</div>';
      if (q.code)                 html += renderCodeBlock(q.code);
      if (q.assertions && q.assertions.length > 0) html += renderAssertions(q.assertions, q.tipo);
      if (q.image)                html += '<div class="question-image"><img src="' + q.image + '" alt="Imagem da questão"></div>';
      if (q.questionContinuation) html += '<div class="question-text">'           + renderMarkup(q.questionContinuation) + '</div>';
      if (q.question)             html += '<div class="question-enunciado">'      + renderMarkup(q.question)             + '</div>';
      return html;
    }

    /* ── 6. RESULTADO POR AULA ────────────────────────────── */

    var _AZUL_BG       = '#183a5c';
    var _AZUL_ICON_BD  = '#3370aa';
    var _AZUL_EYEBROW  = '#7ab8f0';
    var _AZUL_PCT      = '#7ab8f0';
    var _AZUL_BAR_FROM = '#4a90d9';
    var _AZUL_BAR_TO   = '#7ab8f0';

    function _calcularResultadoAula(indices) {
      var total = indices.length, respondidas = 0, acertos = 0;
      indices.forEach(function (qi) {
        if (respostas[qi] !== undefined) {
          respondidas++;
          if (parseInt(respostas[qi]) === questoes[qi].answer) acertos++;
        }
      });
      return { total: total, respondidas: respondidas, acertos: acertos };
    }

    function _atualizarResultadoAula(gi) {
      var grupo = aulaGrupos[gi];
      if (!grupo) return;
      var el = document.getElementById('aula-result-' + gi);
      if (!el) return;

      var r   = _calcularResultadoAula(grupo.indices);
      var pct = r.total > 0 ? Math.round((r.respondidas / r.total) * 100) : 0;

      if (r.respondidas < r.total) {
        el.className = 'subject-result subject-result--progress';
        el.innerHTML =
          '<div style="width:42px;height:42px;border-radius:12px;flex-shrink:0;' +
          'background:' + _AZUL_BG + ';border:1px solid ' + _AZUL_ICON_BD + ';' +
          'display:flex;align-items:center;justify-content:center;font-size:18px;' +
          'box-shadow:inset 0 0 10px rgba(0,0,0,0.1);">📋</div>' +
          '<div style="flex:1;display:flex;flex-direction:column;gap:0.5rem;">' +
          '<div style="font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;' +
          'color:' + _AZUL_EYEBROW + ';opacity:0.8;">Progresso da aula</div>' +
          '<div class="sr-progress-bar"><div class="sr-progress-fill" style="width:' + pct +
          '%;background:linear-gradient(90deg,' + _AZUL_BAR_FROM + ',' + _AZUL_BAR_TO + ');height:100%;"></div></div>' +
          '<div style="font-size:0.75rem;color:#fff;opacity:0.7;">' +
          '<strong>' + r.respondidas + '</strong> de ' + r.total + ' questões respondidas</div></div>' +
          '<div style="text-align:right;min-width:60px;">' +
          '<div style="font-size:1.5rem;font-weight:800;color:' + _AZUL_PCT + ';font-variant-numeric:tabular-nums;">' +
          pct + '<span style="font-size:0.9rem;margin-left:2px;">%</span></div></div>';
      } else {
        var pctA        = r.total > 0 ? Math.round((r.acertos / r.total) * 100) : 0;
        var successColor = pctA >= 70 ? '#4ADE80' : '#FACC15';

        el.className = 'subject-result subject-result--progress';
        el.innerHTML =
          '<div style="width:42px;height:42px;border-radius:12px;flex-shrink:0;' +
          'background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.2);' +
          'display:flex;align-items:center;justify-content:center;font-size:18px;">🎯</div>' +
          '<div style="flex:1;display:flex;flex-direction:column;gap:0.2rem;">' +
          '<div style="font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#4ADE80;">Concluído</div>' +
          '<div style="font-size:0.85rem;color:#fff;">Você acertou <strong>' + r.acertos + '</strong> de ' + r.total + '</div></div>' +
          '<div style="text-align:right;">' +
          '<div style="font-size:1.75rem;font-weight:800;color:' + successColor + ';">' + pctA + '%</div></div>';
      }
    }

    function _atualizarTodosResultadosAula() {
      aulaGrupos.forEach(function (_, gi) { _atualizarResultadoAula(gi); });
    }

    function _grupoDeQuestao(qi) {
      for (var gi = 0; gi < aulaGrupos.length; gi++) {
        if (aulaGrupos[gi].indices.indexOf(qi) !== -1) return gi;
      }
      return -1;
    }

    /* ── 7. RENDERIZAÇÃO ──────────────────────────────────── */

    function renderizar() {
      if (modoStep) _sairModoStep();
      container.innerHTML = '';
      mostrandoSoErros = false;
      aulaGrupos = [];

      var ultimaAula = undefined;

      questoes.forEach(function (q, qi) {
        var aulaAtual = q.aula !== undefined ? q.aula : null;

        if (aulaAtual !== ultimaAula) {
          ultimaAula = aulaAtual;
          aulaGrupos.push({ aula: aulaAtual, indices: [] });
          if (aulaAtual !== null) {
            var titleEl = document.createElement('div');
            titleEl.className   = 'subject-title';
            titleEl.textContent = aulaAtual.toUpperCase();
            container.appendChild(titleEl);
          }
        }

        if (aulaGrupos.length > 0) {
          aulaGrupos[aulaGrupos.length - 1].indices.push(qi);
        }

        var card = document.createElement('div');
        card.className = 'question-container';
        card.id = 'q-' + qi;

        var num = document.createElement('div');
        num.className   = 'question-number';
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
          btn.type      = 'button';
          btn.innerHTML = String.fromCharCode(65 + ai) + ') ' + renderMarkup(alt);
          btn.dataset.qi = qi;
          btn.dataset.ai = ai;
          if (respostas[qi] !== undefined) _aplicarEstadoOpcao(btn, qi, ai);
          btn.addEventListener('click', function () { selectOption(qi, ai); });
          opts.appendChild(btn);
        });

        card.appendChild(opts);
        if (respostas[qi] !== undefined) card.appendChild(_criarFeedbackEl(qi));
        container.appendChild(card);

        var proxQ    = questoes[qi + 1];
        var aulaProx = proxQ ? (proxQ.aula !== undefined ? proxQ.aula : null) : null;
        var isUltimoDoGrupo = !proxQ || aulaProx !== aulaAtual;

        if (isUltimoDoGrupo && aulaGrupos.length > 0) {
          var gi = aulaGrupos.length - 1;
          var resultEl = document.createElement('div');
          resultEl.id        = 'aula-result-' + gi;
          resultEl.className = 'subject-result subject-result--progress';
          container.appendChild(resultEl);
          if (!modoStep) _atualizarResultadoAula(gi);
        }
      });

      if (aulaGrupos.length === 0 && questoes.length > 0) {
        aulaGrupos.push({ aula: null, indices: questoes.map(function (_, i) { return i; }) });
        var resultEl2 = document.createElement('div');
        resultEl2.id        = 'aula-result-0';
        resultEl2.className = 'subject-result subject-result--progress';
        container.appendChild(resultEl2);
        if (!modoStep) _atualizarResultadoAula(0);
      }

      container.querySelectorAll('.assertion-chk').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var s = (parseInt(btn.dataset.chk) + 1) % 3;
          btn.dataset.chk = s;
          btn.className   = 'assertion-chk' + (s === 1 ? ' chk-wrong' : s === 2 ? ' chk-right' : '');
          btn.textContent = s === 1 ? '✕' : s === 2 ? '✓' : '';
        });
      });

      // Publica snapshot APÓS renderização completa
      // Na primeira chamada, dispara nexus:quizPronto
      _publicarSnapshot(questoes);
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

    /* ── 8. INTERAÇÃO DO USUÁRIO ──────────────────────────── */

    function selectOption(qi, oi) {
      if (revelado || respostas[qi] !== undefined) return;
      respostas[qi] = oi;

      var _playSound = window.__nexusPlaySound;
      if (typeof _playSound === 'function') {
        _playSound(oi === questoes[qi].answer ? 'correct' : 'wrong', 'quiz');
      }

      _atualizarOpcoes(qi);

      var card = document.getElementById('q-' + qi);
      if (card && !card.querySelector('.feedback')) {
        card.appendChild(_criarFeedbackEl(qi));
        if (modoStep) setTimeout(_sincronizarAlturaStep, 50);
      }

      var gi = _grupoDeQuestao(qi);
      if (gi !== -1 && !modoStep) _atualizarResultadoAula(gi);

      atualizarResultados();

      if (_disc && _Storage) {
        var total       = questoes.length;
        var respondidas = Object.keys(respostas).length;
        var finalizado  = respondidas === total;
        _Storage.saveProgress(_discUid(), _modo, _semestre, respostas, revelado, finalizado);
        _salvarShuffleMap();
        _salvarFirebase(finalizado);
      }
    }

    function revelar() {
      revelado = true;

      questoes.forEach(function (q, qi) {
        if (respostas[qi] === undefined) respostas[qi] = q.answer;
        _atualizarOpcoes(qi);
        var card = document.getElementById('q-' + qi);
        if (card && !card.querySelector('.feedback')) card.appendChild(_criarFeedbackEl(qi));
      });

      if (modoStep) { _sairModoStep(); renderizar(); }

      if (_disc && _Storage) {
        _Storage.saveProgress(_discUid(), _modo, _semestre, respostas, true, true);
        _salvarShuffleMap();
        _salvarFirebase(true);
      }

      _atualizarTodosResultadosAula();
      atualizarResultados();
      smoothScrollToTop();
    }

    function reiniciar() {
      respostas        = {};
      revelado         = false;
      mostrandoSoErros = false;
      stepAtual        = 0;

      if (_disc && _Storage) {
        _Storage.clearProgress(_discUid(), _modo, _semestre);
        _Storage.remove(_smapKey());
      }

      if (window.NexusFirebase && _disc) {
        var usuario = _Storage ? _Storage.get('usuario', null) : null;
        if (usuario && usuario.uid) {
          window.NexusFirebase.limparRespostasQuiz(
            usuario.uid, _semestre, _modo, _disc
          ).catch(function () {});
        }
      }

      questoes = criarCopiaEmbaralhada(questoesBase);
      if (_disc && _Storage) _salvarShuffleMap();

      var resultsEl = document.getElementById('results');
      if (resultsEl) { resultsEl.style.display = 'none'; resultsEl.innerHTML = ''; }

      _resetarBotaoErros();
      renderizar();   // _publicarSnapshot é chamado dentro de renderizar()
      smoothScrollToTop();
    }

    /* ── 9. RESULTADO GLOBAL ──────────────────────────────── */

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
        var msg = pct >= 90 ? 'Parabéns! Excelente desempenho.'
                : pct >= 70 ? 'Bom trabalho! Continue assim.'
                : pct >= 50 ? 'Continue estudando, você está no caminho.'
                :             'Revise o conteúdo e tente novamente.';

        resultsEl.style.display = 'block';
        resultsEl.innerHTML =
          '<h2>Resultado Final</h2>' +
          '<p class="score">Você acertou ' + acertos + ' de ' + total + ' questões</p>' +
          '<div class="percentage">' + pct + '%</div>' +
          '<p>' + msg + '</p>';
      }

      _atualizarBotaoErros();
      if (!modoStep) _atualizarTodosResultadosAula();
    }

    /* ── 10. VER ERROS ────────────────────────────────────── */

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
      var respondidas = Object.keys(respostas).length;
      if (respondidas < questoes.length) {
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
          setTimeout(function () { if (s) s.textContent = orig; errorsBtn.disabled = false; }, 1500);
        }
        return;
      }

      if (!errorsBtn) return;

      if (errorsBtn.classList.contains('active')) {
        mostrandoSoErros = false;
        errorsBtn.classList.remove('active');
        var s2 = errorsBtn.querySelector('span');
        if (s2) s2.textContent = 'Ver erros (' + erros.length + ')';
        document.querySelectorAll('.question-container').forEach(function (c) { c.style.display = ''; });
        document.querySelectorAll('[id^="aula-result-"]').forEach(function (el) { el.style.display = ''; });
        document.querySelectorAll('.subject-title').forEach(function (el) { el.style.display = ''; });
      } else {
        mostrandoSoErros = true;
        errorsBtn.classList.add('active');
        var s3 = errorsBtn.querySelector('span');
        if (s3) s3.textContent = 'Ver completo';

        var gruposComErro = {};
        erros.forEach(function (qi) {
          var gi = _grupoDeQuestao(qi);
          if (gi !== -1) gruposComErro[gi] = true;
        });

        questoes.forEach(function (q, qi) {
          var card = document.getElementById('q-' + qi);
          if (card) card.style.display = erros.indexOf(qi) !== -1 ? '' : 'none';
        });

        document.querySelectorAll('[id^="aula-result-"]').forEach(function (el) {
          el.style.display = 'none';
        });

        var titleEls = document.querySelectorAll('.subject-title');
        titleEls.forEach(function (el, idx) {
          el.style.display = gruposComErro[idx] ? '' : 'none';
        });

        var primeiro = document.getElementById('q-' + erros[0]);
        if (primeiro) primeiro.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    /* ── 11. MODO STEP ────────────────────────────────────── */

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
          if (parseInt(respostas[idx]) === questoes[idx].answer) acertos++; else erros++;
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
              ? ' step-dot-correct' : ' step-dot-wrong';
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
        nextBtn.innerHTML    = isLast
          ? '<i class="fas fa-flag-checkered"></i> Finalizar'
          : 'Avançar <i class="fas fa-arrow-right"></i>';
        nextBtn.dataset.finalize = isLast ? '1' : '0';
        nextBtn.disabled         = false;
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
        if (direcao === 'back')      card.classList.add('step-slide-left');
        else if (direcao !== 'none') card.classList.add('step-slide-right');
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
        '<div class="step-header"><div class="step-progress-wrapper">' +
        '<div class="step-counter" id="step-counter"></div>' +
        '<div class="step-progress-bar"><div class="step-progress-fill" id="step-progress-fill"></div></div>' +
        '<div class="step-score-badges" id="step-score-badges"></div>' +
        '</div></div>';
      container.parentNode.insertBefore(header, container);

      var footer = document.createElement('div');
      footer.id = 'step-shell-footer';
      footer.innerHTML =
        '<div class="step-footer">' +
        '<button class="step-btn step-btn-secondary" id="step-prev">' +
        '<i class="fas fa-arrow-left"></i> Voltar</button>' +
        '<div class="step-dots" id="step-dots"></div>' +
        '<button class="step-btn step-btn-primary" id="step-next">' +
        'Avançar <i class="fas fa-arrow-right"></i></button></div>';
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

      var primeiraSemResposta = 0;
      for (var i = 0; i < questoes.length; i++) {
        if (respostas[i] === undefined) { primeiraSemResposta = i; break; }
        primeiraSemResposta = questoes.length - 1;
      }
      stepAtual = primeiraSemResposta;

      if (!container.querySelector('.question-container')) renderizar();

      ['.quiz-header', '.page-header', '.submit-container', '#results', '.page-footer']
        .forEach(function (sel) {
          var el = document.querySelector(sel);
          if (el) el.classList.add('step-hidden');
        });

      if (!container.querySelector('.step-quiz-wrapper')) {
        var wrapper = document.createElement('div');
        wrapper.className = 'step-quiz-wrapper';

        container.querySelectorAll('.subject-title, .subject-result, [id^="aula-result-"]')
          .forEach(function (el) { el.classList.add('step-structural-hidden'); });

        Array.from(container.querySelectorAll('.question-container'))
          .forEach(function (q) { wrapper.appendChild(q); });

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
          if (stepWrapper) stepWrapper.style.transition = 'transform 0.38s cubic-bezier(0.4,0,0.2,1)';
        });
      });

      var toggle = document.getElementById('btn-toggle-modo');
      if (toggle) {
        toggle.classList.add('modo-step-active');
        toggle.title = 'Ver lista completa';
        var iToggle  = toggle.querySelector('i');
        if (iToggle) iToggle.className = 'fas fa-list';
      }

      smoothScrollToTop();
      _salvarEstadoStep();
    }

    function _sairModoStep() {
      modoStep = false;

      if (_stepAulaBannerTimer) { clearTimeout(_stepAulaBannerTimer); _stepAulaBannerTimer = null; }

      if (stepWrapper && stepWrapper.parentNode === container) {
        stepWrapper.style.transition = 'none';
        stepWrapper.style.transform  = 'translateX(0)';
        stepWrapper.style.height     = '';
        Array.from(stepWrapper.children).forEach(function (filho) { container.appendChild(filho); });
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
        toggle.title = 'Modo Step (uma questão por vez)';
        var iToggle  = toggle.querySelector('i');
        if (iToggle) iToggle.className = 'fas fa-layer-group';
      }
      _limparEstadoStep();
    }

    function toggleModo() {
      if (modoStep) { _sairModoStep(); renderizar(); atualizarResultados(); smoothScrollToTop(); }
      else          { _entrarModoStep(); }
    }

    function _aulaDeQuestao(qi) {
      var grupo = aulaGrupos[_grupoDeQuestao(qi)];
      return grupo ? grupo.aula : null;
    }

    function _mostrarBannerAula(nomeAula) {
      if (!nomeAula) return;
      var headerEl = document.getElementById('step-shell-header');
      if (!headerEl) return;
      var antigo = headerEl.querySelector('.step-aula-banner');
      if (antigo) antigo.remove();

      var banner = document.createElement('div');
      banner.className = 'step-aula-banner';
      banner.setAttribute('aria-live', 'polite');
      banner.innerHTML =
        '<span class="step-aula-banner__icon"><i class="fas fa-layer-group" aria-hidden="true"></i></span>' +
        '<span class="step-aula-banner__label">Nova aula</span>' +
        '<span class="step-aula-banner__nome">' + nomeAula + '</span>' +
        '<span class="step-aula-banner__pill">▸</span>';
      headerEl.appendChild(banner);
    }

    function _removerBannerAula() {
      var headerEl = document.getElementById('step-shell-header');
      if (!headerEl) return;
      var banner = headerEl.querySelector('.step-aula-banner');
      if (!banner) return;
      banner.classList.add('step-aula-out');
      banner.addEventListener('animationend', function () { banner.remove(); }, { once: true });
    }

    function irParaQuestao(index) {
      if (index < 0 || index >= questoes.length) return;
      var direcao = index > stepAtual ? 'forward' : 'back';

      if (direcao === 'forward' && aulaGrupos.length > 1) {
        var aulaAtual = _aulaDeQuestao(stepAtual);
        var aulaNova  = _aulaDeQuestao(index);
        if (aulaNova && aulaNova !== aulaAtual) { _mostrarBannerAula(aulaNova); }
        else                                    { _removerBannerAula(); }
      } else {
        _removerBannerAula();
      }

      stepAtual = index;
      _aplicarModoStep(direcao);
      smoothScrollToTop();
      _salvarEstadoStep();
    }

    function proximaQuestao()  { irParaQuestao(stepAtual + 1); }
    function questaoAnterior() { irParaQuestao(stepAtual - 1); }

    /* ── 12. BINDS E INICIALIZAÇÃO ────────────────────────── */

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

    document.addEventListener('keydown', function (e) {
      if (!modoStep) return;
      var tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); proximaQuestao(); }
      else if (e.key === 'ArrowLeft')  { e.preventDefault(); questaoAnterior(); }
    });

    var btnLeft = document.getElementById('btn-left');
    var urlBack = window.NEXUS_URL_BACK || null;
    if (btnLeft) {
      btnLeft.addEventListener('click', function () { if (urlBack) window.location.href = urlBack; });
      if (!urlBack) {
        btnLeft.disabled = true;
        console.warn('[quiz_engine] window.NEXUS_URL_BACK não definido. #btn-left desativado.');
      }
    }

    /* ── 13. FILTRO DE AULAS ──────────────────────────────── */

    function _iniciarFiltroAulas() {
      var btnFiltro = document.getElementById('btn-filtro-aulas');
      if (!btnFiltro) return;

      var overlay = document.createElement('div');
      overlay.id        = 'filtro-overlay';
      overlay.className = 'filtro-overlay';
      document.body.appendChild(overlay);

      var painel = document.createElement('div');
      painel.id        = 'filtro-painel';
      painel.className = 'filtro-painel';
      painel.setAttribute('role', 'dialog');
      painel.setAttribute('aria-label', 'Filtrar aulas');
      document.body.appendChild(painel);

      function _abrirPainel() {
        var aulas = _todasAsAulas();
        if (aulas.length <= 1) return;

        var totalAulas = aulas.length;
        var marcadas   = aulasFiltradas === null ? new Set(aulas) : new Set(aulasFiltradas);

        painel.innerHTML =
          '<div class="filtro-header">' +
          '<div class="filtro-eyebrow"><i class="fas fa-filter" aria-hidden="true"></i> Filtrar Aulas</div>' +
          '<h2 class="filtro-titulo">Selecionar Aulas</h2>' +
          '<p class="filtro-subtitulo">Escolha quais aulas deseja estudar</p>' +
          '<button class="filtro-close" id="filtro-close-btn" type="button" aria-label="Fechar">×</button>' +
          '</div>' +
          '<div class="filtro-body">' +
          '<div class="filtro-acoes">' +
          '<button class="filtro-acao-btn" id="filtro-todas"   type="button">Todas</button>' +
          '<button class="filtro-acao-btn" id="filtro-nenhuma" type="button">Nenhuma</button>' +
          '</div>' +
          '<ul class="filtro-lista" id="filtro-lista" role="group" aria-label="Aulas disponíveis"></ul>' +
          '</div>' +
          '<div class="filtro-footer">' +
          '<div class="filtro-contador" id="filtro-contador"></div>' +
          '<button class="filtro-aplicar" id="filtro-aplicar-btn" type="button">' +
          '<i class="fas fa-check" aria-hidden="true"></i> Aplicar</button>' +
          '</div>';

        var lista    = painel.querySelector('#filtro-lista');
        var contador = painel.querySelector('#filtro-contador');
        var itens    = [];

        aulas.forEach(function (aula) {
          var checked = marcadas.has(aula);
          var li = document.createElement('li');
          li.className = 'filtro-item' + (checked ? ' filtro-marcado' : '');
          li.setAttribute('role', 'checkbox');
          li.setAttribute('aria-checked', checked ? 'true' : 'false');
          li.setAttribute('tabindex', '0');
          li.innerHTML =
            '<div class="filtro-chk-box" aria-hidden="true">' +
            '<svg class="filtro-chk-icon" viewBox="0 0 12 12" aria-hidden="true">' +
            '<polyline points="1.5 6 4.5 9.5 10.5 2.5"/></svg></div>' +
            '<span class="filtro-aula-txt"></span>';
          li.querySelector('.filtro-aula-txt').textContent = aula;
          lista.appendChild(li);
          itens.push({ el: li, aula: aula });

          function _toggle() {
            if (marcadas.has(aula)) {
              marcadas.delete(aula);
              li.classList.remove('filtro-marcado');
              li.setAttribute('aria-checked', 'false');
            } else {
              marcadas.add(aula);
              li.classList.add('filtro-marcado');
              li.setAttribute('aria-checked', 'true');
            }
            _atualizarContador();
          }
          li.addEventListener('click', _toggle);
          li.addEventListener('keydown', function (e) {
            if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); _toggle(); }
          });
        });

        function _atualizarContador() {
          var n = marcadas.size;
          contador.innerHTML =
            '<strong>' + n + '</strong> de ' + totalAulas +
            ' aula' + (totalAulas !== 1 ? 's' : '') +
            ' selecionada' + (totalAulas !== 1 ? 's' : '');
        }
        _atualizarContador();

        painel.querySelector('#filtro-todas').addEventListener('click', function () {
          itens.forEach(function (it) {
            marcadas.add(it.aula);
            it.el.classList.add('filtro-marcado');
            it.el.setAttribute('aria-checked', 'true');
          });
          _atualizarContador();
        });

        painel.querySelector('#filtro-nenhuma').addEventListener('click', function () {
          marcadas.clear();
          itens.forEach(function (it) {
            it.el.classList.remove('filtro-marcado');
            it.el.setAttribute('aria-checked', 'false');
          });
          _atualizarContador();
        });

        painel.querySelector('#filtro-close-btn').addEventListener('click', _fecharPainel);

        painel.querySelector('#filtro-aplicar-btn').addEventListener('click', function () {
          aulasFiltradas = (marcadas.size === 0 || marcadas.size === totalAulas)
            ? null : new Set(marcadas);
          _fecharPainel();
          _aplicarFiltro();
        });

        overlay.classList.add('filtro-show');
        painel.classList.add('filtro-show');
        btnFiltro.classList.add('nlg-active');
      }

      function _fecharPainel() {
        overlay.classList.remove('filtro-show');
        painel.classList.remove('filtro-show');
        btnFiltro.classList.remove('nlg-active');
      }

      btnFiltro.addEventListener('click', function () {
        painel.classList.contains('filtro-show') ? _fecharPainel() : _abrirPainel();
      });
      overlay.addEventListener('click', _fecharPainel);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && painel.classList.contains('filtro-show')) _fecharPainel();
      });

      window.NexusFiltroAulas = { abrir: _abrirPainel, fechar: _fecharPainel };
    }

    _iniciarFiltroAulas();

    window.NexusFiltroAulas.listarAulas = _todasAsAulas;

    window.NexusFiltroAulas.iniciar = function (aulasSelecionadas) {
      aulasFiltradas = aulasSelecionadas;
      if (aulasSelecionadas === null) { _renderizarERestaurar(); }
      else                            { _aplicarFiltro(); }
    };

    if (!window.__NSM_AGUARDANDO__) {
      _renderizarERestaurar();
    }

    function _renderizarERestaurar() {
      renderizar();   // → chama _publicarSnapshot → dispara nexus:quizPronto na 1ª vez

      if (_Storage) {
        var _stepSalvo = _Storage.get(_stepStateKey(), null);
        if (_stepSalvo && _stepSalvo.ativo) {
          stepAtual = _stepSalvo.atual || 0;
          _entrarModoStep();
        }
      }

      if (Object.keys(respostas).length === questoes.length) {
        atualizarResultados();
      }
    }

  } /* fim initQuiz */

  /* ══════════════════════════════════════════════════════════
     BOOT
     ══════════════════════════════════════════════════════════ */

  function boot() {
    window.QuizUI.initLegendaModal();
    initQuiz();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();