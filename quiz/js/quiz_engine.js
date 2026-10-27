/* ============================================================
   NEXUS STUDY — quiz/js/quiz_engine.js
   Lógica de FLUXO do quiz — depende de quiz_ui.js

   RESPONSABILIDADE ÚNICA: orquestrar o fluxo do quiz.
     ✔ Renderizar questões
     ✔ Registrar respostas do usuário
     ✔ Controlar navegação (Modo Step, scroll, botões)
     ✔ Restaurar/persistir progresso (localStorage + Firebase)
     ✔ Disparar nexus:quizFinalizado com payload BRUTO

   PROIBIÇÕES ABSOLUTAS (delegadas a quiz_intelligence.js):
     ✗ Cálculo de acertos / taxa de acerto
     ✗ Tempo médio por questão / métricas de performance
     ✗ Análise de tendência, nível, consistência
     ✗ Consolidação de histórico de aprendizado
     ✗ Qualquer escrita direta em performance/* do Firebase

   INTEGRAÇÃO COM QUIZ-INTELLIGENCE:
     O engine coleta SOMENTE os dados brutos que ele já possui
     sem custo extra (respostas[], questoes[], timestamps de
     início/fim, modo, semestre, disc, revelado) e os despacha
     via CustomEvent 'nexus:quizFinalizado'. O intelligence.js
     escuta esse evento e assume TODA a responsabilidade de
     cálculo e persistência de performance.

   INTEGRAÇÃO COM O QUIZ-ASSISTANT:
     Após cada renderização, o engine:
       1. Grava window.__NEXUS_QUESTOES_VISUAIS__ com o snapshot
          imutável da lista atual de questões.
       2. Na primeira inicialização, dispara 'nexus:quizPronto'
          e seta window.__NEXUS_QUIZ_PRONTO__ = true.
     O engine NUNCA chama diretamente funções do assistant.

   v10 — sem lógica de performance interna. O payload do evento
   nexus:quizFinalizado inclui os dados brutos completos para
   que quiz_intelligence.js faça todo o processamento.

   v11 — CORREÇÃO: _registrarSaida() agora distingue saída real
   (pagehide) de mera perda de foco (visibilitychange/hidden).
   Antes, qualquer perda de foco consumia _tentativaFinalizada
   permanentemente, travando o registro de performance no
   primeiro estado parcial capturado. Ver comentário completo
   junto a _registrarSaida() logo abaixo.
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
    window.__NEXUS_QUESTOES_VISUAIS__ = (lista || []).slice();

    if (!_snapshotDisparado) {
      _snapshotDisparado = true;
      window.__NEXUS_QUIZ_PRONTO__ = true;
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

    function _uid() {
      var u = _Storage ? _Storage.get('usuario', null) : null;
      return (u && u.uid) ? u.uid : 'guest';
    }

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

    function _respostasParaStr(resps, total) {
      var arr = [];
      for (var i = 0; i < total; i++) {
        arr.push(resps[i] !== undefined ? String(resps[i]) : 'null');
      }
      return arr.join(',');
    }

    function _strParaRespostas(str) {
      var resps = {};
      /* '' (documento de reset), 'null' e qualquer valor não numérico = sem
         resposta. Antes, '' virava NaN e marcava a questão 1 como respondida
         em TODA abertura depois de um "Reiniciar". */
      str.split(',').forEach(function (v, i) {
        var n = parseInt(v, 10);
        if (v !== 'null' && v !== '' && !isNaN(n)) resps[i] = n;
      });
      return resps;
    }

    function _salvarFirebase(finalizado) {
      if (!window.NexusFirebase || !_disc) return;
      var usuario = _Storage ? _Storage.get('usuario', null) : null;
      if (!usuario || !usuario.uid) return;

      var str = _respostasParaStr(respostas, questoesBase.length);

      /* shuffleMap acompanha a mesma gravação: hoje ele só existe no
         localStorage (_smapKey()), então restaurar respostas a partir
         do Firebase sem ele reembaralharia as questões e aplicaria os
         índices salvos às questões erradas. Enviado como string (mesmo
         padrão de `respostas`) para não introduzir um objeto aninhado
         novo no documento. */
      var smapStr;
      try { smapStr = JSON.stringify(shuffleMap); } catch (_) { smapStr = undefined; }

      window.NexusFirebase.salvarRespostasQuiz(
        usuario.uid, _semestre, _modo, _disc, str, revelado, finalizado, smapStr
      ).catch(function () {});
    }

    /* ══════════════════════════════════════════════════════════
       2. EXPIRAÇÃO (20s / 10min)
    ══════════════════════════════════════════════════════════ */

    var EXPIRY_FINALIZADO_MS = 20000;
    var EXPIRY_PARCIAL_MS    = 600000;

    function _leftAtKey() {
      return 'quiz_leftat_' + _uid() + '_' + _disc + '_' + _modo + '_' + _semestre;
    }

    /* saidaReal distingue duas situações que hoje eram tratadas como
       idênticas:
         · pagehide  → a página está sendo genuinamente descartada
           (navegação, fechamento de aba, recarregamento). A instância
           atual do módulo morre logo em seguida — é seguro e correto
           disparar o payload de "tentativa abandonada" aqui, pois não
           há mais nenhuma chance de completar a tentativa nesta mesma
           execução.
         · visibilitychange (hidden)  → só significa perda de foco
           (trocar de aba, minimizar, abrir DevTools, notificação do
           SO). A MESMA instância do módulo continua viva e o usuário
           pode voltar e seguir respondendo normalmente. Disparar
           _dispararFinalizacao() aqui consumia _tentativaFinalizada
           permanentemente (guarda de disparo único) mesmo sem a
           tentativa ter realmente terminado — travando o registro de
           performance no primeiro estado parcial capturado e
           impedindo qualquer atualização posterior, inclusive a
           conclusão real do quiz.
       Por isso, o payload de abandono só é disparado em saída real
       (pagehide). visibilitychange continua fazendo apenas o
       bookkeeping de localStorage (_leftAtKey), usado por
       _verificarRetorno() para expirar progresso — comportamento
       inalterado. */
    function _registrarSaida(saidaReal) {
      if (!_disc || !_Storage) return;

      var temRespostasReais = Object.keys(_respostasReais).length > 0;
      if (saidaReal && temRespostasReais && !_tentativaFinalizada && _tentativaStartedAt) {
        _dispararFinalizacao(false);
      }

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

    window.addEventListener('pagehide', function () { _registrarSaida(true); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) _registrarSaida(false);
    });

    /* Rede de segurança para bfcache (Firefox/Safari podem restaurar a
       página do cache de navegação sem reexecutar o script — inclusive
       após um pagehide que já tenha disparado o payload de abandono).
       Nesse caso específico, e SOMENTE nesse caso (event.persisted),
       a mesma instância do módulo é reaproveitada com
       _tentativaFinalizada ainda true. Reabrir apenas essa trava
       permite que a tentativa seja corretamente finalizada mais tarde
       (conclusão natural ou "revelar"), sem reiniciar _respostasReais,
       respostas[] ou _tentativaStartedAt — nada do progresso é tocado. */
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) _tentativaFinalizada = false;
    });

    /* ── Questões ─────────────────────────────────────────── */

    var _listaCompleta;
    if (Array.isArray(window.questoes)) {
      _listaCompleta = window.questoes;
    } else if (window.questoes && typeof window.questoes === 'object') {
      _listaCompleta = window.questoes[tipo];
    }

    var container = document.getElementById('quiz-container');

    if (!_listaCompleta || !Array.isArray(_listaCompleta) || _listaCompleta.length === 0) {
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

    /* ══════════════════════════════════════════════════════════
       FILTRO DE AULAS
       Consulta NexusFilter (API pública de filter.js).
    ══════════════════════════════════════════════════════════ */

    function _buildBaseQuestoes() {
      var NF = window.NexusFilter;
      if (!NF || !NF.hasFilter()) return _listaCompleta;

      var selected = NF.getSelectedLessons();
      if (!selected || selected.size === 0) return _listaCompleta;

      var filtrada = _listaCompleta.filter(function (q) {
        var aula = q.aula !== undefined ? q.aula : null;
        return aula !== null && selected.has(aula);
      });

      return filtrada.length > 0 ? filtrada : _listaCompleta;
    }

    var questoesBase = _buildBaseQuestoes();

    /* ══════════════════════════════════════════════════════════
       3. EMBARALHAMENTO (por grupo de aula)
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

    /* ── 4. ESTADO E RESTAURAÇÃO ──────────────────────────── */

var respostas        = {};
    /* _respostasReais é o espelho imutável de respostas[]:
       recebe entrada SOMENTE em selectOption(), nunca em revelar().
       É a única fonte usada por _dispararFinalizacao() para montar
       respostasBrutas — garantindo que revelar() não contamina o payload. */
    var _respostasReais  = {};
    var revelado         = false;
    var modoStep         = false;
    var stepAtual        = 0;
    var stepWrapper      = null;
    var mostrandoSoErros = false;
    var aulaGrupos           = [];
    var _stepAulaBannerTimer = null;

    /* ── TIMESTAMPS BRUTOS para o payload de finalização ─── */
    /* O engine registra APENAS quando a tentativa começou e
       terminou. Todo o CÁLCULO com esses dados (taxa, tempo
       médio, nível) é exclusividade do quiz_intelligence.js. */
    var _tentativaStartedAt  = null;
    var _tentativaFinalizada = false;

    function _registrarInicioTentativa() {
      _tentativaStartedAt  = Date.now();
      _tentativaFinalizada = false;
    }

    /* ── DISPARAR EVENTO DE FINALIZAÇÃO ─────────────────────
       O engine coleta apenas o que ele já possui GRATUITAMENTE
       (respostas brutas, questões, timestamps, contexto).
       Todo o resto é responsabilidade do intelligence.js.
    ────────────────────────────────────────────────────────── */
function _dispararFinalizacao(reveladoPorBotao) {
  if (_tentativaFinalizada) return;
  _tentativaFinalizada = true;

  var endedAt = Date.now();

  /* Reconciliação de consistência — rede de segurança, não uma nova
     fonte de verdade. Neste ponto exato da execução, `revelado` ainda
     é false nos dois caminhos que chegam aqui: conclusão natural via
     selectOption, ou clique em "revelar" (que só marca revelado = true
     DEPOIS de chamar esta função). Logo, respostas[] neste instante só
     pode conter respostas reais do usuário — nunca valores de
     auto-preenchimento. Qualquer entrada presente em respostas[] e
     ausente em _respostasReais (ex.: progresso restaurado que por
     algum motivo não tenha passado pela sincronização de _restaurar())
     é copiada para o espelho antes de montar o payload, garantindo que
     respostasBrutas sempre reflita TODAS as respostas da tentativa —
     não apenas as dadas após o último carregamento da página.
     _respostasReais continua sendo a única fonte usada logo abaixo. */
  Object.keys(respostas).forEach(function (qi) {
    if (_respostasReais[qi] === undefined && respostas[qi] !== undefined) {
      _respostasReais[qi] = respostas[qi];
    }
  });

  /* Coleta APENAS as respostas que o usuário efetivamente escolheu
     ANTES de qualquer revelação. O snapshot é feito sobre
     _respostasReais, que nunca é tocado por revelar(). */
  var respostasBrutas = {};
  /* v12: só entram as aulas ATIVAS (as desativadas não fazem parte desta sessão). */
  Object.keys(_respostasReais).forEach(function (qi) {
    if (_ativaPos(parseInt(qi))) respostasBrutas[parseInt(qi)] = _respostasReais[qi];
  });
  /* Gabarito bruto: índice da alternativa correta por questão.
     O intelligence.js cruzará respostasBrutas x gabarito. */
  var gabarito = {};
  questoes.forEach(function (q, qi) {
    if (_ativaPos(qi)) gabarito[qi] = q.answer;
  });

  var payload = {
    /* Contexto */
    disc:          _disc,
    modo:          _modo,
    semestre:      _semestre,
    /* Dados brutos — apenas o que o usuário respondeu */
    totalQuestoes:   Object.keys(gabarito).length,
    respostasBrutas: respostasBrutas,
    gabarito:        gabarito,
    /* Timestamps */
    startedAt:  _tentativaStartedAt || endedAt,
    endedAt:    endedAt,
    /* Flag de modo */
    revealed:   !!reveladoPorBotao,
  };

  try {
    window.dispatchEvent(new CustomEvent('nexus:quizFinalizado', { detail: payload }));
    console.log('[quiz_engine] nexus:quizFinalizado disparado —',
      Object.keys(gabarito).length + ' questões | respondidas=' +
      Object.keys(respostasBrutas).length + ' | revealed=' + payload.revealed);
  } catch (e) {
    console.warn('[quiz_engine] falha ao disparar nexus:quizFinalizado:', e);
  }
}

    function _restaurar() {
      if (!_disc || !_Storage) return null;

      var salvoLocal = _Storage.loadProgress(_discUid(), _modo, _semestre);
      var fbDados    = window.__NEXUS_FIREBASE_RESPOSTAS__ || null;
      var salvo      = salvoLocal;

      if (fbDados && fbDados._limpo) fbDados = null;   /* reset intencional: não há progresso a restaurar */

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

          /* O shuffleMap do Firebase só é aplicado junto com o "pacote"
             de respostas que ele acompanha (tsFB > tsLocal acima) — nunca
             isoladamente. Se local venceu, o smap local (já correto para
             essas respostas locais) é preservado sem alteração abaixo. */
          if (fbDados.shuffleMap) {
            try {
              var fbShuffleMap = JSON.parse(fbDados.shuffleMap);
              _Storage.set(_smapKey(), fbShuffleMap);
            } catch (e) {
              console.warn('[quiz_engine] shuffleMap do Firebase inválido, ignorando:', e);
            }
          }
        }
      }

if (!salvo || !salvo.respostas) return null;

      Object.keys(salvo.respostas).forEach(function (qi) {
        var idx = parseInt(qi);
        /* ignora lixo de progresso antigo (null/NaN/fora do intervalo) em vez
           de marcar a questão como respondida */
        var val = salvo.respostas[qi];
        if (isNaN(idx) || idx < 0 || val === null || val === undefined || isNaN(parseInt(val))) return;
        salvo.respostas[qi] = parseInt(val);
        respostas[idx] = salvo.respostas[qi];

        /* Sincroniza o espelho imutável com o progresso restaurado.
           Só quando a tentativa salva NÃO estava revelada — se estivesse,
           respostas[] poderia conter valores de auto-preenchimento
           (revelar() grava a resposta correta nas questões não
           respondidas), que nunca devem ser tratados como resposta real
           do usuário. Sem esta sincronização, uma tentativa iniciada
           antes de um reload perdia suas respostas reais do payload de
           finalização (nexus:quizFinalizado), pois _respostasReais
           sempre começava vazio a cada carregamento de página — mesmo
           com respostas[] corretamente restaurado. */
        if (!salvo.revelado) {
          _respostasReais[idx] = salvo.respostas[qi];
        }
      });
      if (salvo.revelado) revelado = true;

      return _Storage.get(_smapKey(), null);
    }

    function _salvarShuffleMap() {
      if (_disc && _Storage) _Storage.set(_smapKey(), shuffleMap);
    }

    /* ── Inicialização ── */
    _verificarRetorno(function () {});

    var savedShuffleMap = _restaurar();

    /* ══════════════════════════════════════════════════════════
       SESSÃO POR AULA (v12) — aulas ATIVAS escolhidas livremente

       `questoesTodas` é a lista COMPLETA, embaralhada exatamente
       como antes (mesmas posições, mesmo shuffleMap salvo) e
       `questoes` aponta SEMPRE para ela inteira: nenhuma posição
       muda nunca, então as respostas salvas (local e Firestore,
       indexadas pela posição) continuam válidas e não há como
       duplicar questão.
       O que muda é só QUAIS aulas aparecem: `sessaoAtivos[gi]`.
       Aula desativada fica escondida (as respostas dela ficam
       guardadas); ativar de novo mostra como estava.
       Os modos com 1 grupo (ex.: Revisão) não têm esse controle.
    ══════════════════════════════════════════════════════════ */
    var questoesTodas   = criarCopiaEmbaralhada(questoesBase, savedShuffleMap);
    var questoes        = questoesTodas;
    var sessaoGrupos    = [];   /* [{ aula, ini, fim }] sobre questoesTodas */
    var sessaoAtivos    = [];   /* [bool] por grupo: aula ativa (visível)  */
    var _giPos          = [];   /* posição da questão -> índice do grupo   */

    function _libKey() {
      return 'quiz_lib_' + _uid() + '_' + _disc + '_' + _modo + '_' + _semestre;
    }

    function _calcularSessaoGrupos() {
      sessaoGrupos = [];
      _giPos = [];
      var ultima;
      questoesTodas.forEach(function (q, qi) {
        var a = q.aula !== undefined ? q.aula : null;
        if (qi === 0 || a !== ultima) {
          sessaoGrupos.push({ aula: a, ini: qi, fim: qi + 1 });
          ultima = a;
        } else {
          sessaoGrupos[sessaoGrupos.length - 1].fim = qi + 1;
        }
        _giPos[qi] = sessaoGrupos.length - 1;
      });
    }

    function _progressivo()    { return sessaoGrupos.length >= 2; }
    function _ativaPos(qi)     { return !_progressivo() || sessaoAtivos[_giPos[qi]] !== false; }
    function _todasAtivas()    {
      for (var i = 0; i < sessaoAtivos.length; i++) if (!sessaoAtivos[i]) return false;
      return true;
    }
    function _qtdAtivas() {
      var n = 0;
      for (var qi = 0; qi < questoes.length; qi++) if (_ativaPos(qi)) n++;
      return n;
    }
    function _respAtivas() {
      var n = 0;
      Object.keys(respostas).forEach(function (k) {
        var qi = parseInt(k);
        if (qi >= 0 && qi < questoes.length && _ativaPos(qi)) n++;
      });
      return n;
    }
    /* Próxima/anterior posição ATIVA a partir de `de` (ou -1). */
    function _posAtivaDepois(de) {
      for (var qi = de + 1; qi < questoes.length; qi++) if (_ativaPos(qi)) return qi;
      return -1;
    }
    function _posAtivaAntes(de) {
      for (var qi = de - 1; qi >= 0; qi--) if (_ativaPos(qi)) return qi;
      return -1;
    }

    function _aplicarAtivos(arr) {
      sessaoAtivos = sessaoGrupos.map(function (_, gi) { return arr[gi] !== false && !!arr[gi]; });
      if (sessaoGrupos.length && !sessaoAtivos.some(Boolean)) sessaoAtivos[0] = true;
      if (_disc && _Storage) {
        if (_progressivo()) {
          var lista = [];
          sessaoAtivos.forEach(function (v, gi) { if (v) lista.push(gi); });
          _Storage.set(_libKey(), lista);
        } else {
          _Storage.remove(_libKey());
        }
      }
      _atualizarMetaTotal();
    }

    /* Quais aulas ficam ativas ao abrir: exatamente as que o aluno deixou ativas
       neste aparelho; sem isso (outro aparelho, progresso antigo) derivam-se das
       respostas existentes, e sem respostas fica só a Aula 1. */
    function _ativosIniciais() {
      var n = sessaoGrupos.length || 1;
      var ativos = [];
      for (var i = 0; i < n; i++) ativos.push(!_progressivo());
      if (!_progressivo()) return ativos;
      Object.keys(respostas).forEach(function (k) {
        var gi = _giPos[parseInt(k)];
        if (gi !== undefined) ativos[gi] = true;
      });
      var salvo = _Storage ? _Storage.get(_libKey(), null) : null;
      if (Array.isArray(salvo)) {
        var so = [];
        for (var k = 0; k < n; k++) so.push(false);
        salvo.forEach(function (gi) { if (gi >= 0 && gi < n) so[gi] = true; });
        if (so.some(Boolean)) return so;
      } else if (salvo && parseInt(salvo) > 0) {            /* formato antigo (v10): aulas 1..n */
        for (var j = 0; j < Math.min(parseInt(salvo), n); j++) ativos[j] = true;
      }
      if (!ativos.some(Boolean)) ativos[0] = true;
      return ativos;
    }

    function _atualizarMetaTotal() {
      var metaTotal = document.getElementById('meta-total');
      if (!metaTotal) return;
      var span = metaTotal.querySelector('span');
      if (!span) return;
      span.textContent = (_progressivo() && !_todasAtivas())
        ? _qtdAtivas() + ' de ' + questoesTodas.length + ' questões'
        : questoes.length + ' questões';
    }

    /* Troca a lista completa (reiniciar / novo filtro) e volta à 1ª aula. */
    function _definirQuestoesTodas(lista) {
      questoesTodas = lista;
      questoes = questoesTodas;
      _calcularSessaoGrupos();
      if (_disc && _Storage) _Storage.remove(_libKey());
      var ini = sessaoGrupos.map(function (_, gi) { return gi === 0 || !_progressivo(); });
      _aplicarAtivos(ini);
    }

    _calcularSessaoGrupos();
    _aplicarAtivos(_ativosIniciais());

    if (savedShuffleMap === null && _disc && _Storage) {
      _salvarShuffleMap();
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

    /* ── NOTA: o resultado por aula usa respostas[] vs questoes[].answer
       localmente para UI imediata (progresso visual). Isso é diferente
       de "calcular performance" — é apenas renderização de feedback
       imediato para o usuário saber quantas questões respondeu por aula.
       A análise real de desempenho (taxa global, tendência, nível) é
       responsabilidade exclusiva do quiz_intelligence.js. ── */

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
        el.className = 'subject-result subject-result--progress' + (_progressivo() && !sessaoAtivos[gi] ? ' aula-off' : '');
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

        el.className = 'subject-result subject-result--progress' + (_progressivo() && !sessaoAtivos[gi] ? ' aula-off' : '');
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

    /* ══════════════════════════════════════════════════════════
       INTERFACE DA SESSÃO PROGRESSIVA (v10)
       Barra de aulas (progresso por aula + total) no topo da lista
       e painel "Próxima aula" depois da última aula liberada.
       Só existe quando o modo tem 2+ grupos (aulas/atividades).
    ══════════════════════════════════════════════════════════ */

    var _SESSAO_CSS =
      '.sessao-ui{font-family:var(--font-body,inherit);color:var(--text-1,#e8e6f0)}' +
      '#sessao-nav{margin:0 0 1rem;padding:.9rem 1rem;border:1px solid var(--border,rgba(255,255,255,.08));' +
        'border-radius:var(--radius-card,16px);background:var(--surface,rgba(255,255,255,.035))}' +
      '.sessao-resumo{font-size:.82rem;color:var(--text-2,#acaac2);margin-bottom:.6rem;line-height:1.4}' +
      '.sessao-resumo strong{color:var(--text-1,#e8e6f0)}' +
      '.sessao-chips{display:flex;flex-wrap:wrap;gap:.45rem}' +
      '.sessao-chip{display:inline-flex;align-items:center;gap:.4rem;min-height:36px;padding:.35rem .7rem;' +
        'border-radius:999px;border:1px solid var(--border,rgba(255,255,255,.12));background:transparent;' +
        'color:var(--text-1,#e8e6f0);font:600 .76rem var(--font-body,inherit);cursor:pointer;transition:border-color .2s,background .2s}' +
      '.sessao-chip small{font-weight:500;opacity:.75}' +
      '.sessao-chip:hover:not(:disabled){border-color:rgba(var(--accent-rgb,108,99,255),.6)}' +
      '.sessao-chip--atual{border-color:rgba(var(--accent-rgb,108,99,255),.7);background:rgba(var(--accent-rgb,108,99,255),.14)}' +
      '.sessao-chip--done{border-color:rgba(74,222,128,.45)}' +
      '.sessao-chip--off{border-style:dashed;color:var(--text-3,#5a5775)}' +
      '.sessao-chip--off:hover{color:var(--text-1,#e8e6f0)}' +
      '.sessao-chip--tudo{border-style:solid;background:rgba(var(--accent-rgb,108,99,255),.08);color:var(--text-2,#acaac2)}' +
      '.sessao-dica{margin-top:.55rem;font-size:.72rem;color:var(--text-3,#7c7a95);line-height:1.4}' +
      '.aula-off{display:none!important}' +
      '#sessao-proxima{margin:1.2rem 0 .4rem;padding:1.1rem 1.2rem;border:1px solid rgba(var(--accent-rgb,108,99,255),.3);' +
        'border-radius:var(--radius-card,16px);background:rgba(var(--accent-rgb,108,99,255),.07);' +
        'display:flex;flex-wrap:wrap;align-items:center;gap:.8rem 1rem;justify-content:space-between}' +
      '#sessao-proxima .sessao-txt{flex:1 1 220px;font-size:.9rem;line-height:1.45}' +
      '#sessao-proxima .sessao-txt small{display:block;color:var(--text-2,#acaac2);font-size:.78rem;margin-top:.15rem}' +
      '.sessao-acoes{display:flex;flex-wrap:wrap;gap:.5rem}' +
      '.sessao-btn{min-height:44px;padding:.55rem 1.1rem;border-radius:var(--radius-btn,10px);' +
        'border:1px solid rgba(var(--accent-rgb,108,99,255),.5);background:rgba(var(--accent-rgb,108,99,255),.18);' +
        'color:var(--text-1,#fff);font:700 .85rem var(--font-body,inherit);cursor:pointer}' +
      '.sessao-btn:hover:not(:disabled){background:rgba(var(--accent-rgb,108,99,255),.3)}' +
      '.sessao-btn:disabled{opacity:.4;cursor:not-allowed}' +
      '.sessao-btn--sec{background:transparent;border-color:var(--border-mid,rgba(255,255,255,.18))}' +
      '@media (max-width:480px){#sessao-proxima{padding:1rem}.sessao-btn{flex:1 1 100%}}';

    function _injetarCssSessao() {
      if (document.getElementById('nx-sessao-css')) return;
      var st = document.createElement('style');
      st.id = 'nx-sessao-css';
      st.textContent = _SESSAO_CSS;
      document.head.appendChild(st);
    }

    function _rotuloCurto(aula, gi) {
      if (aula === null || aula === undefined) return 'Parte ' + (gi + 1);
      var t = String(aula).trim();
      var m = t.match(/^(.*?)\s+(?:[—–-]\s|:\s)/);
      var c = m ? m[1] : t;
      return c.length > 26 ? c.slice(0, 25) + '…' : c;
    }

    /* Rótulo do botão conforme o conteúdo REAL do próximo grupo
       (Aula / Capítulo / Atividade) — sem forçar "aula" onde não é aula. */
    function _rotuloProximo(aula) {
      var t = String(aula === null || aula === undefined ? '' : aula).toLowerCase();
      if (/^cap[ií]tulo/.test(t)) return { botao: 'Próximo capítulo', nome: 'capítulo' };
      if (/^atividade/.test(t))   return { botao: 'Próxima atividade', nome: 'atividade' };
      if (/^aula/.test(t))        return { botao: 'Próxima aula', nome: 'aula' };
      return { botao: 'Próxima parte', nome: 'parte' };
    }

    function _statGrupo(gi) {
      var g = sessaoGrupos[gi], resp = 0, ac = 0;
      for (var qi = g.ini; qi < g.fim; qi++) {
        if (respostas[qi] !== undefined) {
          resp++;
          if (parseInt(respostas[qi]) === questoesTodas[qi].answer) ac++;
        }
      }
      return { total: g.fim - g.ini, resp: resp, ac: ac, ativo: !!sessaoAtivos[gi] };
    }

    /* Primeira aula desativada depois da última ativa (senão a primeira desativada). */
    function _proximoGrupoInativo() {
      var ult = -1;
      sessaoAtivos.forEach(function (v, gi) { if (v) ult = gi; });
      for (var gi = ult + 1; gi < sessaoGrupos.length; gi++) if (!sessaoAtivos[gi]) return gi;
      for (var g2 = 0; g2 < sessaoGrupos.length; g2++) if (!sessaoAtivos[g2]) return g2;
      return -1;
    }

    function _montarSessaoUI() {
      var antigoNav = document.getElementById('sessao-nav');
      var antigoBox = document.getElementById('sessao-proxima');
      if (antigoNav) antigoNav.remove();
      if (antigoBox) antigoBox.remove();
      if (!_progressivo()) return;
      _injetarCssSessao();

      var nav = document.createElement('div');
      nav.id = 'sessao-nav';
      nav.className = 'sessao-ui';
      container.insertBefore(nav, container.firstChild);

      var box = document.createElement('div');
      box.id = 'sessao-proxima';
      box.className = 'sessao-ui';
      container.appendChild(box);
    }

    function _irParaGrupo(gi) {
      var g = sessaoGrupos[gi];
      if (!g || !sessaoAtivos[gi]) return;
      if (modoStep) { irParaQuestao(g.ini); return; }
      var alvo = document.getElementById('aula-titulo-' + gi) || document.getElementById('q-' + g.ini);
      if (alvo && alvo.scrollIntoView) alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function _atualizarSessaoUI() {
      var nav = document.getElementById('sessao-nav');
      var box = document.getElementById('sessao-proxima');
      if (!_progressivo() || !nav || !box) return;
      /* No Modo Step o contador e o botão dependem das aulas ativas. */
      if (modoStep && stepWrapper) _atualizarControlesStep();

      var respondidas = _respAtivas();
      var nAtivas = sessaoAtivos.filter(Boolean).length;
      var todas = _todasAtivas();
      nav.innerHTML =
        '<div class="sessao-resumo"><strong>Aulas ativas: ' + nAtivas + ' de ' + sessaoGrupos.length + '</strong> · ' +
        _qtdAtivas() + ' de ' + questoesTodas.length + ' questões · ' +
        respondidas + ' respondidas</div>' +
        '<div class="sessao-chips" role="group" aria-label="Aulas"></div>' +
        '<div class="sessao-dica">Toque numa aula para ativar ou desativar. As respostas ficam salvas.</div>';
      var chips = nav.querySelector('.sessao-chips');
      sessaoGrupos.forEach(function (g, gi) {
        var st = _statGrupo(gi);
        var b = document.createElement('button');
        b.type = 'button';
        b.dataset.gi = gi;
        b.setAttribute('aria-pressed', st.ativo ? 'true' : 'false');
        var cls = 'sessao-chip';
        var info;
        if (!st.ativo) {
          cls += ' sessao-chip--off';
          info = st.resp ? st.resp + '/' + st.total + ' · off' : 'desativada';
          b.title = 'Ativar ' + _rotuloCurto(g.aula, gi);
        } else if (st.resp === st.total) {
          cls += ' sessao-chip--done'; info = '✓ ' + st.ac + '/' + st.total;
          b.title = 'Desativar ' + _rotuloCurto(g.aula, gi);
        } else {
          cls += ' sessao-chip--atual'; info = st.resp + '/' + st.total;
          b.title = 'Desativar ' + _rotuloCurto(g.aula, gi);
        }
        b.className = cls;
        b.innerHTML = _rotuloCurto(g.aula, gi) + ' <small>' + info + '</small>';
        b.addEventListener('click', function () { _alternarGrupo(gi); });
        chips.appendChild(b);
      });
      if (!todas) {
        var bt = document.createElement('button');
        bt.type = 'button';
        bt.className = 'sessao-chip sessao-chip--tudo';
        bt.id = 'sessao-ativar-todas';
        bt.textContent = 'Ativar todas';
        bt.addEventListener('click', function () { _definirAtivos(sessaoGrupos.map(function () { return true; })); });
        chips.appendChild(bt);
      }

      /* Painel de baixo */
      var gi2 = _proximoGrupoInativo();
      var totalResp = Object.keys(respostas).length;
      if (gi2 !== -1) {
        var prox = sessaoGrupos[gi2];
        var rot  = _rotuloProximo(prox.aula);
        var nNovas = prox.fim - prox.ini;
        box.innerHTML =
          '<div class="sessao-txt">' +
            '<strong>' + rot.botao + ': ' + _rotuloCurto(prox.aula, gi2) + '</strong>' +
            '<small>+' + nNovas + ' questões. Você pode ativar quando quiser — não precisa terminar a anterior.</small>' +
          '</div>' +
          '<div class="sessao-acoes"><button type="button" class="sessao-btn" id="sessao-proxima-btn">' +
            rot.botao + '</button></div>';
        var btn = document.getElementById('sessao-proxima-btn');
        if (btn) btn.addEventListener('click', _avancarAula);
        box.style.display = '';
      } else if (totalResp === questoes.length) {
        var erros = _contarErros();
        box.innerHTML =
          '<div class="sessao-txt"><strong>Sessão concluída.</strong>' +
          '<small>' + questoes.length + ' questões respondidas em ' + sessaoGrupos.length + ' partes.</small></div>' +
          '<div class="sessao-acoes">' +
            '<button type="button" class="sessao-btn" id="sessao-resultado-btn">Ver resultado final</button>' +
            '<button type="button" class="sessao-btn sessao-btn--sec" id="sessao-erros-btn"' +
              (erros === 0 ? ' disabled aria-disabled="true"' : '') + '>' +
              (erros === 0 ? 'Sem erros!' : 'Revisar erros (' + erros + ')') + '</button>' +
          '</div>';
        var rb = document.getElementById('sessao-resultado-btn');
        if (rb) rb.addEventListener('click', function () {
          var r = document.getElementById('results');
          if (r && r.scrollIntoView) r.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        var eb = document.getElementById('sessao-erros-btn');
        if (eb) eb.addEventListener('click', function () {
          var e = document.getElementById('errors');
          if (e && !e.classList.contains('active')) verErros();
        });
        box.style.display = '';
      } else {
        box.innerHTML = '';
        box.style.display = 'none';
      }
    }

    /* Aplica um novo conjunto de aulas ativas SEM tocar nas respostas:
       só muda o que aparece. A tentativa continua a mesma. */
    function _definirAtivos(arr, irPara) {
      if (!_progressivo()) return;
      var estavaStep = modoStep;
      var _y = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (estavaStep) _sairModoStep();

      _aplicarAtivos(arr);

      /* tentativa já revelada: a aula recém-ativada aparece revelada também */
      if (revelado) {
        questoes.forEach(function (q, qi) {
          if (_ativaPos(qi) && respostas[qi] === undefined) respostas[qi] = q.answer;
        });
        if (_disc && _Storage) {
          var _tudo2 = Object.keys(respostas).length === questoes.length;
          _Storage.saveProgress(_discUid(), _modo, _semestre, respostas, true, _tudo2);
          _salvarFirebase(_tudo2);
        }
      }

      var errBtn = document.getElementById('errors');
      mostrandoSoErros = false;
      if (errBtn) errBtn.classList.remove('active');

      renderizar({ manterTentativa: true });
      atualizarResultados();

      if (estavaStep) {
        _entrarModoStep();
      } else {
        /* só libera/oculta a aula: a tela fica onde o aluno estava */
        var _volta = function () { window.scrollTo(0, _y); };
        _volta();
        requestAnimationFrame(function () { _volta(); setTimeout(_volta, 80); setTimeout(_volta, 300); });
      }
    }

    /* Clique numa aula: ativa se estava desativada, desativa se estava ativa
       (sempre sobra pelo menos uma aula ativa). */
    function _alternarGrupo(gi) {
      var novo = sessaoAtivos.slice();
      if (novo[gi]) {
        if (novo.filter(Boolean).length <= 1) return;     /* a única ativa não desativa */
        novo[gi] = false;
        _definirAtivos(novo);
      } else {
        novo[gi] = true;
        _definirAtivos(novo, gi);
      }
    }

    /* "Próxima aula": ativa a próxima aula desativada. */
    function _avancarAula() {
      if (!_progressivo()) return;
      var gi = _proximoGrupoInativo();
      if (gi === -1) return;
      var novo = sessaoAtivos.slice();
      novo[gi] = true;
      _definirAtivos(novo, gi);
    }

    /* ── 7. RENDERIZAÇÃO ──────────────────────────────────── */

    function renderizar(opts) {
      /* Registra início da nova tentativa — timestamp bruto, sem cálculo.
         v10: ao liberar a próxima aula (ou revelar tudo) a MESMA tentativa
         continua — não se reinicia o relógio nem a trava de finalização. */
      if (!(opts && opts.manterTentativa)) _registrarInicioTentativa();

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
            titleEl.id          = 'aula-titulo-' + (aulaGrupos.length - 1);
            titleEl.textContent = aulaAtual.toUpperCase();
            if (!_ativaPos(qi)) titleEl.classList.add('aula-off');
            container.appendChild(titleEl);
          }
        }

        if (aulaGrupos.length > 0) {
          aulaGrupos[aulaGrupos.length - 1].indices.push(qi);
        }

        var card = document.createElement('div');
        card.className = 'question-container' + (_ativaPos(qi) ? '' : ' aula-off');
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
          resultEl.className = 'subject-result subject-result--progress' + (_ativaPos(qi) ? '' : ' aula-off');
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

      _montarSessaoUI();
      _atualizarSessaoUI();

      container.querySelectorAll('.assertion-chk').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var s = (parseInt(btn.dataset.chk) + 1) % 3;
          btn.dataset.chk = s;
          btn.className   = 'assertion-chk' + (s === 1 ? ' chk-wrong' : s === 2 ? ' chk-right' : '');
          btn.textContent = s === 1 ? '✕' : s === 2 ? '✓' : '';
        });
      });

      _publicarSnapshot(questoes);

      /* Zoom exclusivo do conteúdo das questões — escopado a
         #quiz-container, nunca no documentElement. Reaplica a
         cada renderização para conteúdo recriado dinamicamente. */
      if (window.NexusZoom && typeof window.NexusZoom.aplicarZoomQuestoes === 'function') {
        window.NexusZoom.aplicarZoomQuestoes(container);
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
      respostas[qi]       = oi;
      _respostasReais[qi] = oi;  /* espelho imutável — nunca tocado por revelar() */

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
        /* "finalizado" só quando a lista INTEIRA foi respondida (todas as aulas,
           ativas ou não) — terminar a Aula 1 de 3 não finaliza a sessão. */
        var finalizado  = respondidas === total;
        _Storage.saveProgress(_discUid(), _modo, _semestre, respostas, revelado, finalizado);
        _salvarShuffleMap();
        _salvarFirebase(finalizado);

        /* Ao completar TODAS as questões por resposta manual,
           dispara o evento de finalização com dados brutos. */
        if (finalizado) {
          _dispararFinalizacao(false);
        }
      }
    }

    /* ── Mini modal "Revelar respostas?" (substitui o window.confirm) ── */
    var _RV_CSS =
      '.nx-rv{position:fixed;inset:0;z-index:9600;opacity:0;transition:opacity .2s ease}' +
      '.nx-rv.nx-rv--on{opacity:1}' +
      '.nx-rv__fundo{position:absolute;inset:0;background:transparent}' +   /* sem escurecer: só captura o clique fora */
      '.nx-rv__caixa{position:fixed;left:50%;top:50%;width:min(360px,calc(100vw - 24px));box-sizing:border-box;padding:1.2rem 1.15rem 1.1rem;border-radius:18px;' +
        'border:1px solid rgba(var(--accent-rgb,108,99,255),.4);' +
        'background:linear-gradient(180deg,rgba(var(--accent-rgb,108,99,255),.12),rgba(12,18,40,.98) 120px),var(--ink-2,#0c1228);' +
        'box-shadow:0 18px 60px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.04);color:var(--text-1,#e8e6f0);font-family:var(--font-body,inherit);' +
        'transform:translateX(10px) scale(.97);transition:transform .22s cubic-bezier(.22,1,.36,1)}' +
      '.nx-rv--on .nx-rv__caixa{transform:none}' +
      '.nx-rv__icone{width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;' +
        'background:rgba(var(--accent-rgb,108,99,255),.16);color:rgb(var(--accent-rgb,108,99,255));border:1px solid rgba(255,255,255,.08);margin-bottom:.9rem}' +
      '.nx-rv__titulo{font:600 1.2rem var(--font-display,inherit);margin:0 0 .45rem}' +
      '.nx-rv__txt{font-size:.88rem;line-height:1.5;color:var(--text-2,#acaac2);margin:0}' +
      '.nx-rv__aviso{margin:.8rem 0 0;padding:.6rem .75rem;border-radius:10px;font-size:.78rem;line-height:1.45;' +
        'background:rgba(247,201,72,.08);border:1px solid rgba(247,201,72,.25);color:#f7c948}' +
      '.nx-rv__acoes{display:flex;gap:.6rem;margin-top:1.2rem}' +
      '.nx-rv__btn{flex:1;min-height:46px;padding:.6rem 1rem;border-radius:12px;font:700 .88rem var(--font-body,inherit);cursor:pointer;' +
        'border:1px solid var(--border-mid,rgba(255,255,255,.18));background:transparent;color:var(--text-1,#e8e6f0);transition:border-color .2s,background .2s,transform .15s}' +
      '.nx-rv__btn:hover,.nx-rv__btn:focus-visible{border-color:rgba(var(--accent-rgb,108,99,255),.8);outline:none}' +
      '.nx-rv__btn--ok{background:rgba(var(--accent-rgb,108,99,255),.22);border-color:rgba(var(--accent-rgb,108,99,255),.6)}' +
      '.nx-rv__btn--ok:hover,.nx-rv__btn--ok:focus-visible{background:rgba(var(--accent-rgb,108,99,255),.34)}' +
      '.nx-rv--perigo .nx-rv__caixa{border-color:rgba(255,107,138,.45);background:linear-gradient(180deg,rgba(255,107,138,.12),rgba(12,18,40,.98) 120px),var(--ink-2,#0c1228)}' +
      '.nx-rv--perigo .nx-rv__icone{background:rgba(255,107,138,.16);color:#ff6b8a}' +
      '.nx-rv--perigo .nx-rv__btn--ok{background:rgba(255,107,138,.2);border-color:rgba(255,107,138,.6)}' +
      '.nx-rv--perigo .nx-rv__btn--ok:hover,.nx-rv--perigo .nx-rv__btn--ok:focus-visible{background:rgba(255,107,138,.34)}' +
      '.nx-rv__btn:active{transform:scale(.98)}' +
      '@media (max-width:360px){.nx-rv__acoes{flex-direction:column-reverse}}' +
      '@media (prefers-reduced-motion:reduce){.nx-rv,.nx-rv__caixa{transition:none}}';

    var _rvAberto = null;
    var _ancoraModal = null;   /* botão que abriu o modal */

    /* Mini modal de confirmação (Revelar / Reiniciar). Não escurece a tela. */
    /* Coloca a caixa encostada no botão que a abriu (à esquerda dele, pois a barra
       de atalhos fica na lateral direita); se não couber, à direita; sempre dentro da tela. */
    function _posicionarPerto(caixa, ancora) {
      if (!caixa) return;
      var vw = window.innerWidth, vh = window.innerHeight, M = 10, G = 12;
      /* mede sem a animação de entrada; `z` corrige páginas com zoom CSS
         (as coordenadas de getBoundingClientRect vêm em pixels de tela) */
      var tr = caixa.style.transition;
      caixa.style.transition = 'none'; caixa.style.transform = 'none';
      var cr = caixa.getBoundingClientRect();
      var z = caixa.offsetWidth ? cr.width / caixa.offsetWidth : 1;
      if (!z || !isFinite(z)) z = 1;
      var w = cr.width, h = cr.height, left, top;
      if (ancora && ancora.getBoundingClientRect) {
        var r = ancora.getBoundingClientRect();
        if (r.width || r.height) {
          left = r.left - G - w;
          if (left < M) left = r.right + G;
          if (left + w > vw - M) left = Math.max(M, Math.min(vw - w - M, r.left + r.width / 2 - w / 2));
          top = r.top + r.height / 2 - h / 2;
          if (left + w > r.left - 1 && left < r.right + 1) top = r.bottom + G;   /* sem espaço ao lado: abaixo do botão */
        }
      }
      if (left === undefined) { left = (vw - w) / 2; top = (vh - h) / 2; }
      top = Math.max(M, Math.min(vh - h - M, top));
      caixa.style.left = Math.round(left / z) + 'px';
      caixa.style.top  = Math.round(top / z) + 'px';
      void caixa.offsetWidth;
      caixa.style.transform = ''; caixa.style.transition = tr;
    }

    function _confirmarAcao(cfg, aoConfirmar) {
      if (_rvAberto) return;
      if (!document.getElementById('nx-rv-css')) {
        var st = document.createElement('style');
        st.id = 'nx-rv-css'; st.textContent = _RV_CSS;
        document.head.appendChild(st);
      }
      var focoAntes = document.activeElement;
      var el = document.createElement('div');
      el.className = 'nx-rv' + (cfg.perigo ? ' nx-rv--perigo' : '');
      el.innerHTML =
        '<div class="nx-rv__fundo" data-rv="cancelar"></div>' +
        '<div class="nx-rv__caixa" role="alertdialog" aria-modal="true" aria-labelledby="nx-rv-t" aria-describedby="nx-rv-d">' +
          '<div class="nx-rv__icone" aria-hidden="true"><i class="fas ' + cfg.icone + '"></i></div>' +
          '<h2 class="nx-rv__titulo" id="nx-rv-t">' + cfg.titulo + '</h2>' +
          '<p class="nx-rv__txt" id="nx-rv-d">' + cfg.texto + '</p>' +
          (cfg.aviso ? '<p class="nx-rv__aviso">' + cfg.aviso + '</p>' : '') +
          '<div class="nx-rv__acoes">' +
            '<button type="button" class="nx-rv__btn" data-rv="cancelar">Cancelar</button>' +
            '<button type="button" class="nx-rv__btn nx-rv__btn--ok" data-rv="ok">' + cfg.ok + '</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(el);
      _rvAberto = el;
      _posicionarPerto(el.querySelector('.nx-rv__caixa'), cfg.ancora);

      function fechar(confirmou) {
        document.removeEventListener('keydown', onKey, true);
        _rvAberto = null;
        el.classList.remove('nx-rv--on');
        setTimeout(function () { el.remove(); }, 200);
        if (confirmou) aoConfirmar();
        else if (focoAntes && focoAntes.focus) focoAntes.focus();
      }
      function onKey(e) {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); fechar(false); return; }
        if (e.key === 'Tab') {
          var f = el.querySelectorAll('button');
          var p = f[0], u = f[f.length - 1];
          if (e.shiftKey && document.activeElement === p) { e.preventDefault(); u.focus(); }
          else if (!e.shiftKey && document.activeElement === u) { e.preventDefault(); p.focus(); }
        }
      }
      document.addEventListener('keydown', onKey, true);
      el.addEventListener('click', function (e) {
        var alvo = e.target.closest('[data-rv]');
        if (!alvo) return;
        var snd = window.__nexusPlaySound;
        if (typeof snd === 'function') snd('click', 'quiz');
        fechar(alvo.dataset.rv === 'ok');
      });
      requestAnimationFrame(function () {
        el.classList.add('nx-rv--on');
        var cancelar = el.querySelector('[data-rv="cancelar"].nx-rv__btn');
        if (cancelar) cancelar.focus({ preventScroll: true });   /* foco no seguro: Enter não revela sem querer */
      });
    }

    function revelar() {
      if (revelado) { _executarRevelar(); return; }
      var inativas = _progressivo() && !_todasAtivas();
      _confirmarAcao({
        ancora: _ancoraModal,
        icone: 'fa-eye',
        titulo: 'Revelar as respostas?',
        texto: inativas
          ? 'As respostas e os comentários das aulas ATIVAS vão aparecer. Esta tentativa será encerrada e as questões que você não respondeu ficam sem contar.'
          : 'Todas as respostas corretas e os comentários vão aparecer. Esta tentativa será encerrada e as questões que você não respondeu ficam sem contar.',
        aviso: inativas ? 'As aulas desativadas continuam escondidas. Se você ativar uma depois, ela já aparece revelada.' : '',
        ok: 'Revelar respostas'
      }, _executarRevelar);
    }

    /* "Reiniciar" SEMPRE pede confirmação (mesmo sem respostas, ele
       embaralha as questões de novo e limpa o progresso salvo). */
    function pedirReiniciar() {
      var temResp = Object.keys(respostas).length > 0 || revelado;
      _confirmarAcao({
        ancora: _ancoraModal,
        icone: 'fa-rotate-right',
        titulo: 'Reiniciar o quiz?',
        texto: temResp
          ? 'Todas as respostas serão apagadas, o progresso salvo será limpo e as questões serão embaralhadas de novo. Não dá para desfazer.'
          : 'As questões serão embaralhadas de novo e o progresso salvo será limpo. Não dá para desfazer.',
        aviso: '',
        ok: 'Reiniciar',
        perigo: true
      }, reiniciar);
    }

    function _executarRevelar() {
      /* _dispararFinalizacao deve ser chamada ANTES de qualquer mutação
         visual em respostas[], para que o payload capture apenas o que
         o usuário realmente respondeu até este momento. */
      if (_disc && _Storage) {
        _dispararFinalizacao(true);
      }

      /* v14: "Revelar" revela só as aulas ATIVAS — aulas desativadas continuam
         escondidas (e, se o aluno ativar uma depois, ela já aparece revelada).
         Só revela tudo se o aluno tiver ativado todas as aulas. */
      revelado = true;

      /* A partir daqui, respostas[] recebe as respostas corretas apenas
         para fins visuais (UI, feedback, resultado por aula).
         _respostasReais[] permanece intocado — foi snapshot antes. */
      questoes.forEach(function (q, qi) {
        if (!_ativaPos(qi)) return;
        if (respostas[qi] === undefined) respostas[qi] = q.answer;
        _atualizarOpcoes(qi);
        var card = document.getElementById('q-' + qi);
        if (card && !card.querySelector('.feedback')) card.appendChild(_criarFeedbackEl(qi));
      });

      if (modoStep) { _sairModoStep(); renderizar(); }

      if (_disc && _Storage) {
        var _tudo = Object.keys(respostas).length === questoes.length;
        _Storage.saveProgress(_discUid(), _modo, _semestre, respostas, true, _tudo);
        _salvarShuffleMap();
        _salvarFirebase(_tudo);
      }

      _atualizarTodosResultadosAula();
      atualizarResultados();
      smoothScrollToTop();
    }

    function reiniciar() {
      respostas        = {};
      _respostasReais  = {};  /* limpa o espelho junto com respostas[] */
      revelado         = false;
      mostrandoSoErros = false;
      stepAtual        = 0;
      /* Reseta controle de tentativa — a próxima renderização
         registra um novo _tentativaStartedAt. */
      _tentativaStartedAt  = null;
      _tentativaFinalizada = false;

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

      var _ativosAntes = sessaoAtivos.slice();
      _definirQuestoesTodas(criarCopiaEmbaralhada(questoesBase));
      if (_ativosAntes.length === sessaoGrupos.length) _aplicarAtivos(_ativosAntes);   /* mantém as aulas que estavam ativas */
      if (_disc && _Storage) _salvarShuffleMap();

      var resultsEl = document.getElementById('results');
      if (resultsEl) { resultsEl.style.display = 'none'; resultsEl.innerHTML = ''; }

      _resetarBotaoErros();
      renderizar();
      smoothScrollToTop();
    }

    /* ══════════════════════════════════════════════════════════
       REINICIAR COM NOVA BASE (para mudança de filtro)
    ══════════════════════════════════════════════════════════ */

    function reiniciarComFiltro() {
      respostas        = {};
      _respostasReais  = {};  /* limpa o espelho junto com respostas[] */
      revelado         = false;
      mostrandoSoErros = false;
      stepAtual        = 0;
      _tentativaStartedAt  = null;
      _tentativaFinalizada = false;

      if (_disc && _Storage) {
        _Storage.clearProgress(_discUid(), _modo, _semestre);
        _Storage.remove(_smapKey());
        _limparEstadoStep();
      }

      if (window.NexusFirebase && _disc) {
        var usuario = _Storage ? _Storage.get('usuario', null) : null;
        if (usuario && usuario.uid) {
          window.NexusFirebase.limparRespostasQuiz(
            usuario.uid, _semestre, _modo, _disc
          ).catch(function () {});
        }
      }

      questoesBase = _buildBaseQuestoes();
      if (questoesBase.length === 0) questoesBase = _listaCompleta;

      _definirQuestoesTodas(criarCopiaEmbaralhada(questoesBase));
      if (_disc && _Storage) _salvarShuffleMap();

      var resultsEl = document.getElementById('results');
      if (resultsEl) { resultsEl.style.display = 'none'; resultsEl.innerHTML = ''; }

      _resetarBotaoErros();
      renderizar();
      smoothScrollToTop();
    }

    window.addEventListener('nexus:filtroAlterado', function () {
      reiniciarComFiltro();
    });

    /* ── 9. RESULTADO GLOBAL ──────────────────────────────── */

    function atualizarResultados() {
      var total       = questoes.length;
      var respondidas = Object.keys(respostas).length;
      var acertos     = 0;

      /* Este cálculo local serve APENAS para exibição imediata
         de UI (placar final na tela). Não é armazenado, não é
         enviado ao Firebase, não alimenta analytics. A fonte de
         verdade de performance é quiz_intelligence.js, que calcula
         a partir do payload bruto de nexus:quizFinalizado. */
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
      _atualizarSessaoUI();
    }

    /* ── 10. VER ERROS ────────────────────────────────────── */

    function _contarErros() {
      var count = 0;
      Object.keys(respostas).forEach(function (qi) {
        if (_ativaPos(parseInt(qi)) && parseInt(respostas[qi]) !== questoes[qi].answer) count++;
      });
      return count;
    }

    function _atualizarBotaoErros() {
      var errorsBtn = document.getElementById('errors');
      if (!errorsBtn) return;
      var respondidas = _respAtivas();
      if (respondidas < _qtdAtivas()) {
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
        if (_ativaPos(parseInt(qi)) && parseInt(respostas[qi]) !== questoes[qi].answer) erros.push(parseInt(qi));
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
        document.querySelectorAll('.question-container').forEach(function (c) { c.style.display = ''; });  /* aulas desativadas continuam escondidas pela classe .aula-off */
        document.querySelectorAll('[id^="aula-result-"]').forEach(function (el) { el.style.display = ''; });
        document.querySelectorAll('.subject-title').forEach(function (el) { el.style.display = ''; });
        document.querySelectorAll('.sessao-ui').forEach(function (el) { el.style.display = ''; });
        _atualizarSessaoUI();
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
        document.querySelectorAll('.sessao-ui').forEach(function (el) { el.style.display = 'none'; });

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
      /* v14: a questão do Modo Step aparece INTEIRA (sem barra de rolagem
         interna): nada de altura fixa — a página rola normalmente. */
      if (!modoStep || !stepWrapper) return;
      stepWrapper.style.height = '';
      container.style.height   = '';
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
      /* v12: o Step percorre só as questões das aulas ATIVAS. `ativos` guarda
         as posições reais (as respostas continuam indexadas pela posição). */
      var ativos = [];
      for (var p = 0; p < questoes.length; p++) if (_ativaPos(p)) ativos.push(p);
      var total = ativos.length;
      var gi    = stepAtual;
      var ordem = ativos.indexOf(gi);               /* posição entre as ativas */
      if (ordem < 0) ordem = 0;

      var counter = document.getElementById('step-counter');
      if (counter) {
        var _giAula = _progressivo() ? _grupoDeQuestao(gi) : -1;
        counter.textContent = (_giAula >= 0 ? 'Aula ' + (_giAula + 1) + '/' + sessaoGrupos.length + ' · ' : '') +
                              (ordem + 1) + ' / ' + total;
      }

      var fill = document.getElementById('step-progress-fill');
      if (fill) fill.style.width = (total ? (((ordem + 1) / total) * 100) : 0) + '%';

      var badges = document.getElementById('step-score-badges');
      if (badges) {
        var acertos = 0, erros = 0;
        Object.keys(respostas).forEach(function (idx) {
          if (!_ativaPos(parseInt(idx))) return;
          if (parseInt(respostas[idx]) === questoes[idx].answer) acertos++; else erros++;
        });
        badges.innerHTML =
          '<span class="step-badge step-badge-correct"><i class="fas fa-check"></i> ' + acertos + '</span>' +
          '<span class="step-badge step-badge-incorrect"><i class="fas fa-times"></i> ' + erros + '</span>';
      }

      var dotsEl = document.getElementById('step-dots');
      if (dotsEl) {
        var range = _getDotsRange(ordem, total, 9).map(function (o) { return ativos[o]; });
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
      if (prevBtn) prevBtn.disabled = _posAtivaAntes(gi) === -1;

      var nextBtn = document.getElementById('step-next');
      if (nextBtn) {
        var isLast = _posAtivaDepois(gi) === -1;
        /* Na última questão das aulas ativas, se ainda há aula desativada, o
           botão ativa a próxima e o Modo Step continua (sem exigir terminar a aula). */
        var _prox = (isLast && _progressivo()) ? _proximoGrupoInativo() : -1;
        var _avanca = _prox !== -1;
        nextBtn.innerHTML    = _avanca
          ? _rotuloProximo(sessaoGrupos[_prox].aula).botao + ' <i class="fas fa-arrow-right"></i>'
          : isLast
            ? '<i class="fas fa-flag-checkered"></i> Finalizar'
            : 'Avançar <i class="fas fa-arrow-right"></i>';
        nextBtn.dataset.finalize = _avanca ? '2' : (isLast ? '1' : '0');
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
        if (btn && btn.dataset.finalize === '2') {
          _avancarAula();
        } else if (btn && btn.dataset.finalize === '1') {
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

      var primeiraSemResposta = -1, ultimaAtiva = 0;
      for (var i = 0; i < questoes.length; i++) {
        if (!_ativaPos(i)) continue;
        ultimaAtiva = i;
        if (respostas[i] === undefined) { primeiraSemResposta = i; break; }
      }
      stepAtual = primeiraSemResposta !== -1 ? primeiraSemResposta : ultimaAtiva;

      if (!container.querySelector('.question-container')) renderizar();

      ['.quiz-header', '.page-header', '.submit-container', '#results', '.page-footer']
        .forEach(function (sel) {
          var el = document.querySelector(sel);
          if (el) el.classList.add('step-hidden');
        });

      if (!container.querySelector('.step-quiz-wrapper')) {
        var wrapper = document.createElement('div');
        wrapper.className = 'step-quiz-wrapper';

        container.querySelectorAll('.subject-title, .subject-result, [id^="aula-result-"], #sessao-nav, #sessao-proxima')
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
      if (index < 0 || index >= questoes.length || !_ativaPos(index)) return;
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

    function proximaQuestao()  { var p = _posAtivaDepois(stepAtual); if (p !== -1) irParaQuestao(p); }
    function questaoAnterior() { var p = _posAtivaAntes(stepAtual);  if (p !== -1) irParaQuestao(p); }

    /* ── 12. BINDS E INICIALIZAÇÃO ────────────────────────── */

    var btnUp   = document.getElementById('btn-up');
    var btnDown = document.getElementById('btn-down');
    if (btnUp)   btnUp.addEventListener('click', function () { smoothScrollToTop(); });
    if (btnDown) btnDown.addEventListener('click', function () {
      smoothScrollTo(document.body.scrollHeight, 1000);
    });

    ['restart', 'restartButton'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', function (e) { _ancoraModal = e.currentTarget; pedirReiniciar(); });
    });

    ['reveal', 'revealButton'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', function (e) { _ancoraModal = e.currentTarget; revelar(); });
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

    if (!window.__NSM_AGUARDANDO__) {
      _renderizarERestaurar();
    }

    function _renderizarERestaurar() {
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