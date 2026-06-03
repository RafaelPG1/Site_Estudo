/* ============================================================
   NEXUS STUDY — quiz/quiz_engine.js  (v8)
   Lógica de estado do quiz — depende de quiz_ui.js

   ÍNDICE:
     1. Contexto e configuração .... L.25
     2. Expiração (20s) ............ L.55
     3. Embaralhamento ............. L.100
     4. Estado e restauração ....... L.140
     5. Feedback e corpo ........... L.190
     6. Resultado por aula ......... L.240
     7. Renderização ............... L.295
     8. Interação do usuário ....... L.385
     9. Resultado global ........... L.455
    10. Ver erros .................. L.490
    11. Modo Step .................. L.560
    12. Binds e boot ............... L.760

   v8 — embaralhamento por grupo de aula:
     Questões são embaralhadas DENTRO de cada aula, preservando
     a ordem das aulas. Isso garante que subject-title e
     subject-result apareçam corretamente para todas as aulas,
     independente de quantas aulas a disciplina tiver.
   ============================================================ */

(function () {
  'use strict';

  /* ── Aliases de quiz_ui.js ─────────────────────────────── */
  var smoothScrollTo    = window.QuizUI.smoothScrollTo;
  var smoothScrollToTop = window.QuizUI.smoothScrollToTop;
  var renderMarkup      = window.QuizUI.renderMarkup;
  var renderCodeBlock   = window.QuizUI.renderCodeBlock;

  /* ══════════════════════════════════════════════════════════
     INIT QUIZ
     ══════════════════════════════════════════════════════════ */

  function initQuiz() {

    /* ── 1. CONTEXTO E CONFIGURAÇÃO ───────────────────────── */

    var tipo = window.TIPO_QUIZ
      || new URLSearchParams(location.search).get('modo')
      || 'questoes';

    var _disc     = window.__NEXUS_QUIZ_DISC__     || null;
    var _modo     = window.__NEXUS_QUIZ_MODO__     || tipo;
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

    function _salvarFinalizadoAtivo() {
      if (!_Storage) return false;
      try {
        var configs = _Storage.get('configs', {});
        return configs.salvarProgresso !== false;
      } catch (e) { return false; }
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

       Regra: o timer conta apenas o tempo FORA da página.

       Fluxo:
         SAÍDA  → salva timestamp no localStorage
         VOLTA  → calcula tempoFora, remove timestamp SEMPRE
                  se >= 20s → limpa progresso e reinicia
                  se <  20s → não faz nada

       Isso garante:
         - Sem acúmulo entre saídas
         - F5 é tratado via pagehide + verificação no boot
         - Sem setTimeout/setInterval
       ══════════════════════════════════════════════════════════ */

    var EXPIRY_FINALIZADO_MS = 20000;    // 20s  — salvarProgresso OFF
    var EXPIRY_PARCIAL_MS    = 120000;   // 2min — salvarProgressoParcial OFF

    function _leftAtKey() {
      return 'quiz_leftat_' + _uid() + '_' + _disc + '_' + _modo + '_' + _semestre;
    }

    function _registrarSaida() {
      if (!_disc || !_Storage) {
        console.log('[quiz_engine] _registrarSaida: abortou — _disc:', _disc, '_Storage:', !!_Storage);
        return;
      }

      var salvo = _Storage.loadProgress(_discUid(), _modo, _semestre);
      if (!salvo) {
        console.log('[quiz_engine] _registrarSaida: sem progresso salvo, nada a fazer');
        return;
      }

      var configs = _Storage.get('configs', {});
      console.log('[quiz_engine] _registrarSaida: finalizado?', salvo.finalizado,
                  '| salvarProgresso:', configs.salvarProgresso,
                  '| salvarProgressoParcial:', configs.salvarProgressoParcial);

      if (salvo.finalizado && configs.salvarProgresso === false) {
        _Storage.set(_leftAtKey(), JSON.stringify({ ts: Date.now(), tipo: 'finalizado' }));
        console.log('[quiz_engine] _registrarSaida: gravou timestamp FINALIZADO');
        return;
      }

      if (!salvo.finalizado && configs.salvarProgressoParcial === false) {
        _Storage.set(_leftAtKey(), JSON.stringify({ ts: Date.now(), tipo: 'parcial' }));
        console.log('[quiz_engine] _registrarSaida: gravou timestamp PARCIAL');
        return;
      }

      console.log('[quiz_engine] _registrarSaida: nenhuma regra de expiração ativa, timestamp não gravado');
    }

    function _verificarRetorno(aoExpirar) {
      if (!_disc || !_Storage) {
        console.log('[quiz_engine] _verificarRetorno: abortou — _disc:', _disc, '_Storage:', !!_Storage);
        return;
      }

      var raw = _Storage.get(_leftAtKey(), null);
      console.log('[quiz_engine] _verificarRetorno: raw:', raw, '| typeof:', typeof raw);

      if (raw === null) {
        console.log('[quiz_engine] _verificarRetorno: nenhum timestamp encontrado');
        return;
      }

      _Storage.remove(_leftAtKey());

      // Storage pode retornar string ou objeto — normaliza os dois casos
      var payload;
      try {
        payload = typeof raw === 'string' ? JSON.parse(raw) : raw;
      } catch (e) {
        console.warn('[quiz_engine] _verificarRetorno: falha ao parsear payload:', raw);
        return;
      }

      var tempoFora = Date.now() - payload.ts;
      var limite    = payload.tipo === 'parcial' ? EXPIRY_PARCIAL_MS : EXPIRY_FINALIZADO_MS;

      console.log('[quiz_engine] _verificarRetorno: tipo:', payload.tipo,
                  '| ts:', payload.ts,
                  '| tempoFora:', Math.round(tempoFora / 1000) + 's',
                  '| limite:', Math.round(limite / 1000) + 's',
                  '| expirou?', tempoFora >= limite);

      if (tempoFora >= limite) {
        _Storage.clearProgress(_discUid(), _modo, _semestre);
        _Storage.remove(_smapKey());
        console.info('[quiz_engine] Progresso APAGADO. Tipo:', payload.tipo, '| tempo fora:', Math.round(tempoFora / 1000) + 's');
        if (typeof aoExpirar === 'function') aoExpirar();
      }
    }

    /* ── Listeners ─────────────────────────────────────────── */

    /* pagehide: cobre F5, fechar aba e navegação para outra página */
    window.addEventListener('pagehide', _registrarSaida);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        /* Usuário saiu (troca de aba, minimizou, etc.) */
        _registrarSaida();
      } else {
        /* Usuário voltou — passa reiniciar() como callback de expiração.
           reiniciar() só existe após o boot, mas visibilitychange
           só dispara depois que a página já carregou, então é seguro. */
        _verificarRetorno(reiniciar);
      }
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
          '<div style="padding:2rem;text-align:center;color:#f87171;">' +
          '<p>⚠️ Nenhuma questão encontrada para o tipo <strong>"' + tipo + '"</strong>.<br>' +
          'Verifique se o arquivo de conteúdo está correto.</p>' +
          '</div>';
      }
      return;
    }

    var questoesBase = listaQuestoes;

    /* ══════════════════════════════════════════════════════════
       3. EMBARALHAMENTO

       v8: embaralha DENTRO de cada grupo de aula, preservando
       a ordem das aulas. Assim subject-title e subject-result
       aparecem corretamente para todas as aulas da disciplina.
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

      /* ── Agrupa índices por aula, preservando ordem de aparição ── */
      var gruposAula   = [];   // [{ aula, indices[] }, ...]
      var aulaParaGrupo = {};  // aula → índice em gruposAula

      base.forEach(function (q, qi) {
        var aula = q.aula !== undefined ? q.aula : '__sem_aula__';
        if (aulaParaGrupo[aula] === undefined) {
          aulaParaGrupo[aula] = gruposAula.length;
          gruposAula.push({ aula: aula, indices: [] });
        }
        gruposAula[aulaParaGrupo[aula]].indices.push(qi);
      });

      /* ── Embaralha os índices DENTRO de cada aula ── */
      var ordemFinal = [];
      gruposAula.forEach(function (grupo) {
        var indicesOriginais = grupo.indices;

        /* Se há mapa fixo salvo, usa os índices de embaralhamento já definidos */
        var indicesEmbaralhados;
        if (mapaFixo && mapaFixo['__grupo__' + grupo.aula]) {
          indicesEmbaralhados = mapaFixo['__grupo__' + grupo.aula];
        } else {
          indicesEmbaralhados = shuffleArray(indicesOriginais);
        }

        novoMapa['__grupo__' + grupo.aula] = indicesEmbaralhados;
        indicesEmbaralhados.forEach(function (qi) { ordemFinal.push(qi); });
      });

      /* ── Monta cópia embaralhada respeitando a nova ordem ── */
      var result = ordemFinal.map(function (qi) {
        var q = base[qi];

        /* Embaralha opções da questão */
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
          options:  newOptions,
          answer:   newAnswer,
          feedback: newFeedback,
          __qiOriginal__: qi,   // guarda índice original para saveProgress
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

    /* ── 4. ESTADO E RESTAURAÇÃO ──────────────────────────── */

    var respostas        = {};
    var revelado         = false;
    var modoStep         = false;
    var stepAtual        = 0;
    var stepWrapper      = null;
    var mostrandoSoErros = false;
    var aulaGrupos           = [];
    var _stepAulaBannerTimer = null;

    function _restaurar() {
      if (!_disc || !_Storage) return null;

      var salvoLocal = _Storage.loadProgress(_discUid(), _modo, _semestre);
      var fbDados    = window.__NEXUS_FIREBASE_RESPOSTAS__ || null;

      // Determina qual fonte usar: Firebase ganha se savedAt for maior
      var salvo = salvoLocal;

      if (fbDados) {
        var tsLocal = salvoLocal ? (salvoLocal.savedAt || 0) : 0;
        var tsFB    = fbDados.savedAt || 0;

        console.log('[quiz_engine] _restaurar — local savedAt:', tsLocal, '| firebase savedAt:', tsFB);

        if (tsFB > tsLocal) {
          console.log('[quiz_engine] _restaurar — usando Firebase (mais recente)');
          var fbRespostas = _strParaRespostas(fbDados.respostas || '');
          salvo = {
            respostas:  fbRespostas,
            revelado:   fbDados.revelado   || false,
            finalizado: fbDados.finalizado || false,
            savedAt:    tsFB,
          };
          // Sincroniza de volta pro localStorage
          _Storage.saveProgress(_discUid(), _modo, _semestre, fbRespostas, salvo.revelado, salvo.finalizado);
        } else {
          console.log('[quiz_engine] _restaurar — usando localStorage (mais recente ou igual)');
        }
      }

      if (!salvo || !salvo.respostas) return null;

      Object.keys(salvo.respostas).forEach(function (qi) {
        respostas[parseInt(qi)] = salvo.respostas[qi];
      });
      if (salvo.revelado) revelado = true;

      console.info('[quiz_engine] Progresso restaurado:', Object.keys(respostas).length, 'respostas');
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
          return '<strong>Por que está certa:</strong> ' + renderMarkup(line.replace('Por que está certa:', '').trim());
        }
        return renderMarkup(line);
      }).join('<br>');
    }

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
            '<div class="assertion-connector"><span class="connector-label">PORQUE</span></div>' +
            '<div class="assertion"><span class="assertion-num">' + num + '.</span><span>' + rendered + '</span></div>'
          );
        }
        return '<div class="assertion"><span class="assertion-num">' + num + '.</span><span>' + rendered + '</span></div>';
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
      if (q.texto)                html += '<div class="question-texto">'         + renderMarkup(q.texto)                + '</div>';
      if (q.miniEnunciado)        html += '<div class="question-mini-enunciado">' + renderMarkup(q.miniEnunciado)        + '</div>';
      if (q.code)                 html += renderCodeBlock(q.code);
      if (q.assertions && q.assertions.length > 0) html += renderAssertions(q.assertions);
      if (q.image)                html += '<div class="question-image"><img src="' + q.image + '" alt="Imagem da questão"></div>';
      if (q.questionContinuation) html += '<div class="question-text">'           + renderMarkup(q.questionContinuation) + '</div>';
      if (q.question)             html += '<div class="question-enunciado">'      + renderMarkup(q.question)             + '</div>';
      return html;
    }

    /* ── 6. RESULTADO POR AULA ────────────────────────────── */

    /* Paleta azul fixa — independente da disciplina ou modo */
    var _AZUL_BG       = '#183a5c';
    var _AZUL_BORDER   = '#2a5a8a';
    var _AZUL_ICON_BG  = '#1e4f80';
    var _AZUL_ICON_BD  = '#3370aa';
    var _AZUL_EYEBROW  = '#7ab8f0';
    var _AZUL_SCORE    = '#a8cef0';
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
  /* ── Card de PROGRESSO ── */
  el.className = 'subject-result subject-result--progress';
  el.innerHTML = `
    <div style="width:42px; height:42px; border-radius:12px; flex-shrink:0; 
                background: ${ _AZUL_BG }; border: 1px solid ${ _AZUL_ICON_BD }; 
                display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow: inset 0 0 10px rgba(0,0,0,0.1);">
      📋
    </div>
    <div style="flex:1; display:flex; flex-direction:column; gap:0.5rem;">
      <div style="font-size:0.65rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color: ${ _AZUL_EYEBROW }; opacity: 0.8;">
        Progresso da aula
      </div>
      <div class="sr-progress-bar">
        <div class="sr-progress-fill" style="width:${pct}%; background: linear-gradient(90deg, ${ _AZUL_BAR_FROM }, ${ _AZUL_BAR_TO }); height:100%;"></div>
      </div>
      <div style="font-size:0.75rem; color: #fff; opacity: 0.7;">
        <strong>${r.respondidas}</strong> de ${r.total} questões respondidas
      </div>
    </div>
    <div style="text-align: right; min-width: 60px;">
      <div style="font-size:1.5rem; font-weight:800; color: ${ _AZUL_PCT }; font-variant-numeric: tabular-nums;">
        ${pct}<span style="font-size: 0.9rem; margin-left: 2px;">%</span>
      </div>
    </div>`;

} else {
  /* ── Card de RESULTADO (Concluído) ── */
  var pctA = r.total > 0 ? Math.round((r.acertos / r.total) * 100) : 0;
  // Cor verde para sucesso (exemplo de lógica visual)
  const successColor = pctA >= 70 ? '#4ADE80' : '#FACC15'; 
  
  el.className = 'subject-result subject-result--progress';
  el.innerHTML = `
    <div style="width:42px; height:42px; border-radius:12px; flex-shrink:0; 
                background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.2); 
                display:flex; align-items:center; justify-content:center; font-size:18px;">
      🎯
    </div>
    <div style="flex:1; display:flex; flex-direction:column; gap:0.2rem;">
      <div style="font-size:0.65rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color: #4ADE80;">
        Concluído
      </div>
      <div style="font-size:0.85rem; color: #fff;">
        Você acertou <strong>${r.acertos}</strong> de ${r.total}
      </div>
    </div>
    <div style="text-align: right;">
      <div style="font-size:1.75rem; font-weight:800; color: ${successColor};">
        ${pctA}%
      </div>
    </div>`;
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

      /* ── CORREÇÃO: usa null para questões sem aula,
         permitindo detecção correta de mudança de grupo ── */
      var ultimaAula = undefined; // undefined ≠ null, garante que o primeiro grupo sempre é criado

      questoes.forEach(function (q, qi) {

        /* Normaliza: undefined → null para questões sem campo aula */
        var aulaAtual = q.aula !== undefined ? q.aula : null;

        if (aulaAtual !== ultimaAula) {
          ultimaAula = aulaAtual;
          aulaGrupos.push({ aula: aulaAtual, indices: [] });

          /* Só renderiza o título se a aula tem nome */
          if (aulaAtual !== null) {
            var titleEl = document.createElement('div');
            titleEl.className = 'subject-title';
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
          if (respostas[qi] !== undefined) _aplicarEstadoOpcao(btn, qi, ai);
          btn.addEventListener('click', function () { selectOption(qi, ai); });
          opts.appendChild(btn);
        });

        card.appendChild(opts);
        if (respostas[qi] !== undefined) card.appendChild(_criarFeedbackEl(qi));
        container.appendChild(card);

        /* ── CORREÇÃO: normaliza aula da próxima questão também ── */
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

      /* Fallback: lista vazia ou nenhum grupo criado */
      if (aulaGrupos.length === 0 && questoes.length > 0) {
        aulaGrupos.push({ aula: null, indices: questoes.map(function (_, i) { return i; }) });
        var resultEl = document.createElement('div');
        resultEl.id        = 'aula-result-0';
        resultEl.className = 'subject-result subject-result--progress';
        container.appendChild(resultEl);
        if (!modoStep) _atualizarResultadoAula(0);
      }
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

  /* ── SOM DE ACERTO / ERRO ── */
  var _playSound = window.__nexusPlaySound;
  if (typeof _playSound === 'function') {
    var acertou = oi === questoes[qi].answer;
    _playSound(acertou ? 'correct' : 'wrong', 'quiz');
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

      // Limpa no Firebase também
      if (window.NexusFirebase && _disc) {
        var usuario = _Storage ? _Storage.get('usuario', null) : null;
        if (usuario && usuario.uid) {
          window.NexusFirebase.limparRespostasQuiz(usuario.uid, _semestre, _modo, _disc).catch(function () {});
        }
      }

      questoes = criarCopiaEmbaralhada(questoesBase);
      if (_disc && _Storage) _salvarShuffleMap();

      var resultsEl = document.getElementById('results');
      if (resultsEl) { resultsEl.style.display = 'none'; resultsEl.innerHTML = ''; }

      _resetarBotaoErros();
      renderizar();
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
        /* ── Restaurar visualização completa ── */
        mostrandoSoErros = false;
        errorsBtn.classList.remove('active');
        var s2 = errorsBtn.querySelector('span');
        if (s2) s2.textContent = 'Ver erros (' + erros.length + ')';
        document.querySelectorAll('.question-container').forEach(function (c) { c.style.display = ''; });
        document.querySelectorAll('[id^="aula-result-"]').forEach(function (el) { el.style.display = ''; });
        document.querySelectorAll('.subject-title').forEach(function (el) { el.style.display = ''; });
      } else {
        /* ── Mostrar só erros ── */
        mostrandoSoErros = true;
        errorsBtn.classList.add('active');
        var s3 = errorsBtn.querySelector('span');
        if (s3) s3.textContent = 'Ver completo';

        /* Descobre quais grupos (aulas) têm pelo menos um erro */
        var gruposComErro = {};
        erros.forEach(function (qi) {
          var gi = _grupoDeQuestao(qi);
          if (gi !== -1) gruposComErro[gi] = true;
        });

        /* Mostra/esconde cards de questão */
        questoes.forEach(function (q, qi) {
          var card = document.getElementById('q-' + qi);
          if (card) card.style.display = erros.indexOf(qi) !== -1 ? '' : 'none';
        });

        /* Esconde aula-result de todos os grupos */
        document.querySelectorAll('[id^="aula-result-"]').forEach(function (el) {
          el.style.display = 'none';
        });

        /* Mostra/esconde subject-title por grupo */
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
            cls += parseInt(respostas[idx]) === questoes[idx].answer ? ' step-dot-correct' : ' step-dot-wrong';
          }
          return '<button class="' + cls + '" data-goto="' + idx + '" title="Questão ' + (idx + 1) + '"></button>';
        }).join('');

        dotsEl.querySelectorAll('.step-dot').forEach(function (dot) {
          dot.addEventListener('click', function () { irParaQuestao(parseInt(dot.dataset.goto)); });
        });
      }

      var prevBtn = document.getElementById('step-prev');
      if (prevBtn) prevBtn.disabled = gi === 0;

      var nextBtn = document.getElementById('step-next');
      if (nextBtn) {
        var isLast = gi === total - 1;
        nextBtn.innerHTML = isLast
          ? '<i class="fas fa-flag-checkered"></i> Finalizar'
          : 'Avançar <i class="fas fa-arrow-right"></i>';
        nextBtn.dataset.finalize = isLast ? '1' : '0';
        nextBtn.disabled = false;
      }
    }

    function _aplicarModoStep(direcao) {
      if (!stepWrapper) return;
      var cards = stepWrapper.querySelectorAll('.question-container');
      cards.forEach(function (c) { c.classList.remove('step-active', 'step-slide-left', 'step-slide-right'); });

      var card = cards[stepAtual];
      if (card) {
        card.classList.add('step-active');
        if (direcao === 'back')        card.classList.add('step-slide-left');
        else if (direcao !== 'none')   card.classList.add('step-slide-right');
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
            '<div class="step-progress-bar"><div class="step-progress-fill" id="step-progress-fill"></div></div>' +
            '<div class="step-score-badges" id="step-score-badges"></div>' +
          '</div>' +
        '</div>';
      container.parentNode.insertBefore(header, container);

      var footer = document.createElement('div');
      footer.id = 'step-shell-footer';
      footer.innerHTML =
        '<div class="step-footer">' +
          '<button class="step-btn step-btn-secondary" id="step-prev"><i class="fas fa-arrow-left"></i> Voltar</button>' +
          '<div class="step-dots" id="step-dots"></div>' +
          '<button class="step-btn step-btn-primary" id="step-next">Avançar <i class="fas fa-arrow-right"></i></button>' +
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

        container.querySelectorAll('.subject-title, .subject-result, [id^="aula-result-"]').forEach(function (el) {
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
          if (stepWrapper) stepWrapper.style.transition = 'transform 0.38s cubic-bezier(0.4,0,0.2,1)';
        });
      });

      var toggle = document.getElementById('btn-toggle-modo');
      if (toggle) {
        toggle.classList.add('modo-step-active');
        toggle.title = 'Ver lista completa';
        var iToggle = toggle.querySelector('i');
        if (iToggle) iToggle.className = 'fas fa-list';
      }

      smoothScrollToTop();
      _salvarEstadoStep();
    }

    function _sairModoStep() {
      modoStep = false;

      /* Limpa banner de aula pendente */
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
        var iToggle = toggle.querySelector('i');
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

      /* Remove banner anterior imediatamente */
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
      /* Banner fica visível até a próxima navegação — sem auto-dismiss */
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

      /* Ao avançar: detecta mudança de aula */
      if (direcao === 'forward' && aulaGrupos.length > 1) {
        var aulaAtual = _aulaDeQuestao(stepAtual);
        var aulaNova  = _aulaDeQuestao(index);
        if (aulaNova && aulaNova !== aulaAtual) {
          _mostrarBannerAula(aulaNova);
        } else {
          _removerBannerAula(); /* mesma aula — remove banner se havia um */
        }
      } else {
        _removerBannerAula(); /* voltando — remove sempre */
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
    if (btnDown) btnDown.addEventListener('click', function () { smoothScrollTo(document.body.scrollHeight, 1000); });

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

    /* ── NAVEGAÇÃO POR SETAS DO TECLADO (apenas no modo step) ── */
    document.addEventListener('keydown', function (e) {
      if (!modoStep) return;

      /* Ignora se o foco estiver num input/textarea para não interferir com digitação */
      var tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        proximaQuestao();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        questaoAnterior();
      }
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

    renderizar();

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