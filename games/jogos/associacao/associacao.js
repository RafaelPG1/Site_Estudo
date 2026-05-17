/* ════════════════════════════════════════════════════════════════
   NEXUS STUDY — Associação
   associacao.js  (v3.0)

   Arquitetura alinhada ao padrão do Flashcard (v6.0):
     • Disciplinas, labels e emojis vêm de global.js
     • Cores aplicadas por theme.js (inline style no :root)
     • Semestre derivado da URL (?sem=), nunca hardcodado
     • Nenhum map local de cores, labels ou emojis

   Imports externos:
     • getDisciplinasDeSemestre  ← src/global.js
     • aplicarCoresDisciplina    ← shared/js/theme.js
     • DISC_CORES                ← shared/js/cores.js

   Estrutura:
     • CONFIG — constantes do jogo (sem semestre hardcodado)
     • ESTADO — estado global centralizado (inclui discObj)
     • TELAS — gerenciamento de telas (Screen Manager)
     • TEMA — delega inteiramente ao theme.js
     • DOM — cache de elementos
     • TIMER — controle próprio de tempo
     • TOAST — sistema de notificações
     • STORAGE — persistência de rodadas
     • INTRO — lógica da tela de introdução
     • JOGO — renderização e lógica da rodada
     • DRAG/DROP — arrastar e soltar (HTML5 + touch)
     • VERIFICAÇÃO — correção e feedback
     • RESULTADO — tela final com métricas
     • PAUSA — overlay de pausa
     • PONTUAÇÃO — sistema de pontos
     • INIT — inicialização
════════════════════════════════════════════════════════════════ */

import { ASSOCIACAO_DATA }                       from './associacao_data.js';
import { saveRound, loadRound, clearRound, clearAll } from './storage_a.js';
import { getDisciplinasDeSemestre }                  from '../../../src/global.js';
import { aplicarCoresDisciplina }                    from '../../../shared/js/theme.js';
import { DISC_CORES }                                from '../../../shared/js/cores.js';

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════
     CONFIG
  ══════════════════════════════════════════════════════════════ */

  const CONFIG = Object.freeze({
    ITEMS_PER_ROUND:   4,
    PONTOS_ACERTO:    10,
    PONTOS_ERRO:       3,
    /*
     * SEMESTRE_ATIVO removido — o semestre é sempre derivado da URL (?sem=)
     * via carregarItens(), igual ao Flashcard. Nunca hardcoded aqui.
     */
    SESSION_KEY_SEED: 'assoc_seed',
    SESSION_KEY_ROUND:'assoc_round',
  });

  /*
   * LABELS E EMOJIS — derivados de global.js/getDisciplinasDeSemestre()
   * NÃO declarar aqui. Usados via estado.discObj (objeto disciplina completo).
   * Acesse: estado.discObj.apelido  → label  (ex: 'Design de Sistemas')
   *         estado.discObj.emoji    → emoji  (ex: '🎨')
   */

  /* ══════════════════════════════════════════════════════════════
     ESTADO GLOBAL — único ponto de verdade
  ══════════════════════════════════════════════════════════════ */

  const estado = {
    /* Dados */
    allItems:     [],
    discId:       null,
    discObj:      null,   /* objeto completo da disciplina (global.js) */
    semestre:     null,   /* lido da URL (?sem=) ou fallback do global.js */

    /* Rodada */
    currentRound: 0,
    totalRounds:  0,
    roundItems:   [],
    verified:     false,

    /* Pontuação acumulada */
    totalAcertos: 0,
    totalErros:   0,
    totalPontos:  0,

    /* Timer */
    timerSecs:    0,
    timerRef:     null,
    pausado:      false,

    /* Controle de tela */
    telaAtual:    'loading',
  };

  /* ══════════════════════════════════════════════════════════════
     HELPERS
  ══════════════════════════════════════════════════════════════ */

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function formatTime(secs) {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return m + ':' + s;
  }

  /* ══════════════════════════════════════════════════════════════
     DOM CACHE
  ══════════════════════════════════════════════════════════════ */

  const $ = id => document.getElementById(id);

  const el = {};

  function initDOM() {
    Object.assign(el, {
      /* Telas */
      screenLoading: $('screen-loading'),
      screenIntro:   $('screen-intro'),
      screenGame:    $('screen-game'),
      screenResult:  $('screen-result'),
      screenEmpty:   $('screen-empty'),

      /* Header global */
      topbarDisc:    $('topbar-disc'),
      topbarSem:     $('topbar-sem'),
      /* topbarIcon: removido — ícone 🔗 é fixo no HTML, não precisa de JS */
      timerVal:      $('timer-val'),
      progressFill:  $('progress-bar-fill'),

      /* Intro */
      introDisc:       $('intro-disc'),
      introSem:        $('intro-sem'),
      introIcon:       $('intro-icon'),
      introTotalPares: $('intro-total-pares'),
      introTotalRods:  $('intro-total-rodadas'),
      btnStart:        $('btn-start'),
      btnContinuar:    $('btn-continuar'),
      continuarProg:   $('intro-continuar-prog'),

      /* Jogo */
      roundCur:        $('round-current'),
      roundTot:        $('round-total'),
      matchGrid:       $('match-grid'),
      poolGrid:        $('pool-grid'),
      qCount:          $('q-count'),
      filledCount:     $('filled-count'),

      /* Botões de jogo */
      btnVoltar:       $('btn-voltar'),
      btnReset:        $('btn-reset'),
      btnVerif:        $('btn-verificar'),
      btnVerifLbl:     $('btn-verificar-label'),
      btnVerifIcon:    $('btn-verificar-icon'),
      btnPause:        $('btn-pause'),
      btnRetomar:      $('btn-retomar'),
      pauseIcon:       $('pause-icon'),
      pauseLabel:      $('pause-label'),
      btnVoltarIntro:  $('btn-voltar-intro'),

      /* Resultado */
      resultTrophy:    $('result-trophy'),
      resultTitle:     $('result-title'),
      resultSubtitle:  $('result-subtitle'),
      resultPontos:    $('result-pontos'),
      resultAcertos:   $('result-acertos'),
      resultErros:     $('result-erros'),
      resultPct:       $('result-pct'),
      resultTempo:     $('result-tempo'),
      resultFeedback:  $('result-feedback'),
      resultFeedIcon:  $('result-feedback-icon'),
      resultFeedText:  $('result-feedback-text'),
      btnRejogo:       $('btn-rejogo'),
      btnMenu:         $('btn-menu'),

      /* Pausa */
      pauseOverlay:    $('pause-overlay'),
      pauseRodada:     $('pause-rodada'),
      pauseTempo:      $('pause-tempo'),
      pausePct:        $('pause-pct'),
      btnPauseMenu:    $('btn-pause-menu'),

      /* Toast + lixeira */
      toast:           $('toast'),
      trashZone:       $('trash-zone'),

      /* Botão voltar global */
      btnBack:         $('btn-back'),
    });
  }

  /* ══════════════════════════════════════════════════════════════
     TEMA DINÂMICO
  ══════════════════════════════════════════════════════════════ */

  /*
   * TEMA — delega inteiramente ao theme.js (igual ao Flashcard).
   * Escreve --cor-tema, --cor-tema-rgb, --disc-tema, --disc-tema-rgb etc.
   * no inline style do documentElement (especificidade máxima).
   * Também seta body.dataset.disc para seletores CSS de fallback.
   */
  function aplicarTema(discId) {
    aplicarCoresDisciplina(discId, DISC_CORES);
  }

  /* ══════════════════════════════════════════════════════════════
     SCREEN MANAGER — controle de telas
  ══════════════════════════════════════════════════════════════ */

  const TELAS = ['screenLoading', 'screenIntro', 'screenGame', 'screenResult', 'screenEmpty'];

  function mostrarTela(nome) {
    TELAS.forEach(function (k) {
      if (el[k]) el[k].classList.add('hidden');
    });
    const alvo = el[nome];
    if (alvo) {
      alvo.classList.remove('hidden');
      /* Reaplica animação */
      alvo.classList.remove('assoc-screen');
      void alvo.offsetWidth;
      alvo.classList.add('assoc-screen');
    }
    estado.telaAtual = nome;

    /* Mostra/oculta header de progresso apenas no jogo */
    const isGame = nome === 'screenGame';
    if (el.progressFill) {
      el.progressFill.closest('.assoc-progress-bar').style.opacity = isGame ? '1' : '0';
    }
  }

  /* ══════════════════════════════════════════════════════════════
     TIMER
  ══════════════════════════════════════════════════════════════ */

  function startTimer() {
    clearInterval(estado.timerRef);
    estado.timerSecs = 0;
    _tickTimer();
    estado.timerRef = setInterval(_tickTimer, 1000);
  }

  function pausarTimer() {
    clearInterval(estado.timerRef);
    estado.timerRef = null;
  }

  function retornarTimer() {
    if (!estado.timerRef) {
      estado.timerRef = setInterval(_tickTimer, 1000);
    }
  }

  function pararTimer() {
    clearInterval(estado.timerRef);
    estado.timerRef = null;
  }

  function _tickTimer() {
    if (estado.pausado) return;
    estado.timerSecs++;
    const txt = formatTime(estado.timerSecs);
    if (el.timerVal) el.timerVal.textContent = txt;
    if (el.pauseTempo) el.pauseTempo.textContent = txt;
  }

  /* ══════════════════════════════════════════════════════════════
     TOAST
  ══════════════════════════════════════════════════════════════ */

  function showToast(msg, tipo) {
    if (!el.toast) return;
    const cores = {
      sucesso: { cor: 'var(--assoc-cyan)',  bdr: 'rgba(0,229,200,0.30)' },
      erro:    { cor: '#ff8080',            bdr: 'rgba(255,128,128,0.30)' },
      ouro:    { cor: 'var(--assoc-gold)',  bdr: 'rgba(245,200,66,0.30)' },
      info:    { cor: 'var(--assoc-text-dim)', bdr: 'var(--assoc-border-mid)' },
    };
    const c = cores[tipo || 'sucesso'] || cores.sucesso;
    el.toast.textContent = msg;
    el.toast.style.color = c.cor;
    el.toast.style.borderColor = c.bdr;
    el.toast.classList.add('show');
    clearTimeout(el.toast._t);
    el.toast._t = setTimeout(function () { el.toast.classList.remove('show'); }, 2600);
  }

  /* ══════════════════════════════════════════════════════════════
     PROGRESSO GLOBAL
  ══════════════════════════════════════════════════════════════ */

  function atualizarProgressoGlobal() {
    const pct = Math.round((estado.currentRound / estado.totalRounds) * 100);
    if (el.progressFill) el.progressFill.style.width = pct + '%';
    if (el.roundCur) el.roundCur.textContent = estado.currentRound + 1;
    if (el.roundTot) el.roundTot.textContent = estado.totalRounds;
    /* Pausa: rodada + % */
    if (el.pauseRodada) el.pauseRodada.textContent = (estado.currentRound + 1) + '/' + estado.totalRounds;
    if (el.pausePct) el.pausePct.textContent = pct + '%';

    sessionStorage.setItem(CONFIG.SESSION_KEY_ROUND, estado.currentRound);
  }

  function atualizarContadorFilled() {
    const zones  = el.matchGrid ? el.matchGrid.querySelectorAll('.drop-zone') : [];
    const filled = [...zones].filter(function (z) { return z.querySelector('.a-card'); }).length;
    if (el.filledCount) el.filledCount.textContent = filled + ' / ' + zones.length;
  }

  /* ══════════════════════════════════════════════════════════════
     DADOS — carregar e organizar itens
  ══════════════════════════════════════════════════════════════ */

  function carregarItens() {
    /* ── 1. Derivar semestre e disciplina da URL (igual ao Flashcard) ── */
    const params   = new URLSearchParams(window.location.search);
    const semParam = params.get('sem');
    const discParam= params.get('disc');

    /*
     * Semestre: URL (?sem=) > fallback para a primeira chave de ASSOCIACAO_DATA.
     * Nunca hardcodado aqui — a fonte de verdade é a URL ou os dados.
     */
    const semestresDisponiveis = Object.keys(ASSOCIACAO_DATA);
    if (semestresDisponiveis.length === 0) return false;
    estado.semestre = (semParam && ASSOCIACAO_DATA[semParam]) ? semParam : semestresDisponiveis[0];

    const semData = ASSOCIACAO_DATA[estado.semestre] || {};

    /* ── 2. Resolver objeto da disciplina via global.js ── */
    /*
     * getDisciplinasDeSemestre() retorna o array de disciplinas definido
     * em global.js — com id, nome, apelido, emoji, arquivo.
     * Nunca duplicamos esses dados aqui.
     */
    const disciplinas = getDisciplinasDeSemestre(estado.semestre);

    /* Seleciona: URL (?disc=) > primeira disciplina com dados disponíveis */
    let discObj = null;
    if (discParam) {
      discObj = disciplinas.find(function (d) {
        return (d.id === discParam || d.arquivo === discParam) && semData[d.arquivo ?? d.id];
      });
    }
    if (!discObj) {
      discObj = disciplinas.find(function (d) {
        return semData[d.arquivo ?? d.id];
      });
    }

    if (!discObj) return false;

    /* arquivo é a chave em ASSOCIACAO_DATA; fallback para id */
    const discChave = discObj.arquivo ?? discObj.id;
    const items     = semData[discChave] || [];
    if (items.length === 0) return false;

    /* Persiste no estado — acesse sempre via estado.discObj */
    estado.discId  = discChave;
    estado.discObj = discObj;

    /* ── 3. Montar deck com seed persistida ── */
    const savedSeed = sessionStorage.getItem(CONFIG.SESSION_KEY_SEED);
    if (savedSeed) {
      try {
        const order = JSON.parse(savedSeed);
        estado.allItems = order
          .map(function (id) { return items.find(function (x) { return x.id === id; }); })
          .filter(Boolean);
        /* Adiciona itens novos que não estavam no seed */
        const knownIds = new Set(order);
        items.forEach(function (item) { if (!knownIds.has(item.id)) estado.allItems.push(item); });
      } catch (e) {
        estado.allItems = shuffle(items);
        _salvarSeed();
      }
    } else {
      estado.allItems = shuffle(items);
      _salvarSeed();
    }

    estado.totalRounds  = Math.ceil(estado.allItems.length / CONFIG.ITEMS_PER_ROUND);
    estado.currentRound = parseInt(sessionStorage.getItem(CONFIG.SESSION_KEY_ROUND) || '0', 10);
    if (estado.currentRound >= estado.totalRounds) estado.currentRound = 0;

    return true;
  }

  function _salvarSeed() {
    sessionStorage.setItem(CONFIG.SESSION_KEY_SEED, JSON.stringify(estado.allItems.map(x => x.id)));
  }

  /* ══════════════════════════════════════════════════════════════
     INTRO — preencher e exibir
  ══════════════════════════════════════════════════════════════ */

  function mostrarIntro() {
    /*
     * Labels e emoji vêm do objeto disciplina (global.js) — nunca de maps locais.
     * apelido  → label curto exibido na UI  (ex: 'Design de Sistemas')
     * emoji    → ícone da disciplina        (ex: '🎨')
     */
    const discObj  = estado.discObj || {};
    const discLabel= discObj.apelido ?? discObj.nome ?? estado.discId;
    const discEmoji= discObj.emoji   ?? '🃏';

    /* Preencher header */
    if (el.topbarDisc) el.topbarDisc.textContent = discLabel;
    if (el.topbarSem)  el.topbarSem.textContent  = estado.semestre;

    /* Preencher card da intro */
    if (el.introDisc)       el.introDisc.textContent       = discLabel;
    if (el.introSem)        el.introSem.textContent         = estado.semestre;
    if (el.introIcon)       el.introIcon.textContent        = discEmoji;
    if (el.introTotalPares) el.introTotalPares.textContent  = estado.allItems.length;
    if (el.introTotalRods)  el.introTotalRods.textContent   = estado.totalRounds;

    /* Preencher contador de deck */
    const deckLbl = document.getElementById('intro-deck-label');
    if (deckLbl) deckLbl.textContent = estado.allItems.length + ' pares no deck';

    /* Botão continuar: só aparece se há rodada parcialmente feita */
    const savedRound = loadValidRound(estado.currentRound);
    const temProgresso = estado.currentRound > 0 || savedRound;
    if (temProgresso && el.btnContinuar) {
      el.btnContinuar.classList.remove('hidden');
      if (el.continuarProg) {
        el.continuarProg.textContent =
          'Rodada ' + (estado.currentRound + 1) + '/' + estado.totalRounds;
      }
    }

    mostrarTela('screenIntro');
  }

  /* ══════════════════════════════════════════════════════════════
     CARD FACTORY
  ══════════════════════════════════════════════════════════════ */

  function makeCard(id, text) {
    const card = document.createElement('div');
    card.className = 'a-card';
    card.dataset.answerId = id;
    card.setAttribute('draggable', 'true');
    card.innerHTML =
      '<svg class="drag-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"' +
      ' stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="9"  cy="5"  r="1"/><circle cx="9"  cy="12" r="1"/><circle cx="9"  cy="19" r="1"/>' +
        '<circle cx="15" cy="5"  r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>' +
      '</svg>' +
      '<span class="a-text">' + escHtml(text) + '</span>' +
      '<button class="card-remove-btn" tabindex="-1" aria-label="Remover resposta">' +
        '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
        ' stroke-width="2.8" stroke-linecap="round">' +
          '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
        '</svg>' +
      '</button>';

    card.querySelector('.card-remove-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      if (estado.verified) return;
      if (card.closest('.drop-zone')) {
        returnCardToPool(card);
        saveCurrentState();
        atualizarContadorFilled();
        showToast('Resposta devolvida ao banco', 'info');
      }
    });

    card.addEventListener('dragstart', onCardDragStart);
    card.addEventListener('dragend',   onCardDragEnd);
    card.addEventListener('touchstart', onCardTouchStart, { passive: false });

    return card;
  }

  /* ══════════════════════════════════════════════════════════════
     RENDER ROUND
  ══════════════════════════════════════════════════════════════ */

  function renderRound(restoredState) {
    estado.verified  = false;
    const start      = estado.currentRound * CONFIG.ITEMS_PER_ROUND;
    estado.roundItems = estado.allItems.slice(start, start + CONFIG.ITEMS_PER_ROUND);

    atualizarProgressoGlobal();
    if (el.qCount) el.qCount.textContent = estado.roundItems.length + ' questões';

    /* Ordem do pool */
    let poolOrder;
    if (restoredState) {
      const placedIds   = new Set((restoredState.placements || []).map(p => p.answerId));
      const savedPoolIds = restoredState.poolOrder || [];
      const allRoundIds  = estado.roundItems.map(x => x.id);
      const accountedIds = new Set([...placedIds, ...savedPoolIds]);
      const missingIds   = allRoundIds.filter(id => !accountedIds.has(id));
      const finalPoolIds = savedPoolIds.concat(missingIds);
      poolOrder = finalPoolIds.map(id => estado.roundItems.find(x => x.id === id)).filter(Boolean);
    } else {
      poolOrder = shuffle(estado.roundItems.slice());
    }

    /* Limpa grids */
    if (el.matchGrid) el.matchGrid.innerHTML = '';
    if (el.poolGrid)  el.poolGrid.innerHTML  = '';

    /* Constrói grid de perguntas + zonas */
    estado.roundItems.forEach(function (item, i) {
      const row = document.createElement('div');
      row.className = 'match-row';

      const qCell = document.createElement('div');
      qCell.className = 'q-cell';
      qCell.innerHTML =
        '<div class="q-num">' + (i + 1) + '</div>' +
        '<div class="q-text">' + escHtml(item.pergunta) + '</div>';

      const zone = document.createElement('div');
      zone.className = 'drop-zone';
      zone.dataset.questionId = item.id;
      zone.dataset.correct    = item.resposta;
      zone.innerHTML = '<span class="drop-hint">Solte aqui</span>';

      zone.addEventListener('dragenter', onZoneDragEnter);
      zone.addEventListener('dragover',  onZoneDragOver);
      zone.addEventListener('dragleave', onZoneDragLeave);
      zone.addEventListener('drop',      onZoneDrop);

      row.appendChild(qCell);
      row.appendChild(zone);
      if (el.matchGrid) el.matchGrid.appendChild(row);
    });

    /* Pool de respostas */
    if (el.poolGrid) {
      el.poolGrid.removeEventListener('dragenter', onPoolDragEnter);
      el.poolGrid.removeEventListener('dragover',  onPoolDragOver);
      el.poolGrid.removeEventListener('dragleave', onPoolDragLeave);
      el.poolGrid.removeEventListener('drop',      onPoolDrop);
      el.poolGrid.addEventListener('dragenter', onPoolDragEnter);
      el.poolGrid.addEventListener('dragover',  onPoolDragOver);
      el.poolGrid.addEventListener('dragleave', onPoolDragLeave);
      el.poolGrid.addEventListener('drop',      onPoolDrop);
    }

    if (el.trashZone && !el.trashZone._bound) {
      el.trashZone._bound = true;
      el.trashZone.addEventListener('dragenter', onTrashDragEnter);
      el.trashZone.addEventListener('dragover',  onTrashDragOver);
      el.trashZone.addEventListener('dragleave', onTrashDragLeave);
      el.trashZone.addEventListener('drop',      onTrashDrop);
    }

    poolOrder.forEach(function (item) {
      if (el.poolGrid) el.poolGrid.appendChild(makeCard(item.id, item.resposta));
    });

    setVerifyState('verify');
    mostrarTela('screenGame');

    if (restoredState) {
      restoreState(restoredState);
    } else {
      atualizarContadorFilled();
      startTimer();
    }
  }

  /* ══════════════════════════════════════════════════════════════
     RESTAURAR ESTADO SALVO
  ══════════════════════════════════════════════════════════════ */

  function restoreState(state) {
    (state.placements || []).forEach(function (p) {
      const zone = el.matchGrid && el.matchGrid.querySelector('.drop-zone[data-question-id="' + p.questionId + '"]');
      const card = el.poolGrid  && el.poolGrid.querySelector('.a-card[data-answer-id="' + p.answerId + '"]');
      if (zone && card) placeCardInZone(zone, card);
    });
    atualizarContadorFilled();
    if (state.verified) {
      estado.verified = true;
      pararTimer();
      applyVerifyFeedback();
      setVerifyState(estado.currentRound >= estado.totalRounds - 1 ? 'finish' : 'next');
      lockAllCards();
    } else {
      startTimer();
    }
  }

  /* ══════════════════════════════════════════════════════════════
     OPERAÇÕES FÍSICAS DOM — mover cards
  ══════════════════════════════════════════════════════════════ */

  function placeCardInZone(zone, card) {
    const hint = zone.querySelector('.drop-hint');
    if (hint) hint.style.display = 'none';
    zone.classList.add('filled');
    zone.classList.remove('drag-over', 'drag-over-swap', 'droppable');
    zone.appendChild(card);
    card.classList.remove('in-pool', 'dragging');
    card.classList.add('in-zone');
  }

  function returnCardToPool(card) {
    const zone = card.closest('.drop-zone');
    if (zone) {
      const hint = zone.querySelector('.drop-hint');
      if (hint) hint.style.display = '';
      zone.classList.remove('filled', 'drag-over', 'drag-over-swap', 'correct', 'wrong');
      const ca = zone.querySelector('.correct-answer');
      if (ca) ca.remove();
    }
    card.classList.remove('in-zone', 'dragging');
    card.classList.add('in-pool');
    if (el.poolGrid) el.poolGrid.appendChild(card);
  }

  function detachCard(card) {
    const zone = card.closest('.drop-zone');
    if (zone) {
      const hint = zone.querySelector('.drop-hint');
      if (hint) hint.style.display = '';
      zone.classList.remove('filled', 'drag-over', 'drag-over-swap');
    }
    card.classList.remove('in-zone', 'in-pool', 'dragging');
    if (card.parentNode) card.parentNode.removeChild(card);
    return card;
  }

  function lockAllCards() {
    document.querySelectorAll('.a-card').forEach(function (c) {
      c.setAttribute('draggable', 'false');
      c.style.cursor = 'default';
    });
  }

  function animateZone(zone) {
    zone.animate(
      [{ transform: 'scale(1.03)' }, { transform: 'scale(1)' }],
      { duration: 180, easing: 'ease-out' }
    );
  }

  /* ══════════════════════════════════════════════════════════════
     PERSISTÊNCIA
  ══════════════════════════════════════════════════════════════ */

  function saveCurrentState(isVerified) {
    if (!el.matchGrid || !el.poolGrid) return;
    const zones = [...el.matchGrid.querySelectorAll('.drop-zone')];
    const placements = zones
      .filter(z => z.querySelector('.a-card'))
      .map(z => ({
        questionId: z.dataset.questionId,
        answerId:   z.querySelector('.a-card').dataset.answerId,
        text:       z.querySelector('.a-text').textContent,
      }));
    const poolOrder = [...el.poolGrid.querySelectorAll('.a-card')]
      .map(c => c.dataset.answerId);
    saveRound(estado.currentRound, { placements, poolOrder, verified: !!isVerified });
  }

  function loadValidRound(roundIndex) {
    const state = loadRound(roundIndex);
    if (!state) return null;
    const start    = roundIndex * CONFIG.ITEMS_PER_ROUND;
    const items    = estado.allItems.slice(start, start + CONFIG.ITEMS_PER_ROUND);
    const roundIds = new Set(items.map(x => x.id));
    const placedIds  = (state.placements || []).map(p => p.answerId);
    const poolIds    = state.poolOrder || [];
    const allSaved   = new Set([...placedIds, ...poolIds]);
    const isValid    = [...roundIds].every(id => allSaved.has(id));
    if (!isValid) {
      console.warn('[associacao] Estado corrompido na rodada', roundIndex, '— descartando');
      clearRound(roundIndex);
      return null;
    }
    return state;
  }

  /* ══════════════════════════════════════════════════════════════
     VERIFICAÇÃO
  ══════════════════════════════════════════════════════════════ */

  function doVerify() {
    if (!el.matchGrid) return;
    const zones  = [...el.matchGrid.querySelectorAll('.drop-zone')];
    const filled = zones.filter(z => z.querySelector('.a-card')).length;
    if (filled < zones.length) {
      showToast('Preencha todas as respostas antes de verificar!', 'erro');
      return;
    }

    estado.verified = true;
    pararTimer();
    lockAllCards();

    const acertos = applyVerifyFeedback();
    const total   = zones.length;
    const erros   = total - acertos;

    /* Acumular pontuação */
    estado.totalAcertos += acertos;
    estado.totalErros   += erros;
    estado.totalPontos  += (acertos * CONFIG.PONTOS_ACERTO) - (erros * CONFIG.PONTOS_ERRO);
    if (estado.totalPontos < 0) estado.totalPontos = 0;

    saveCurrentState(true);

    if (acertos === total) {
      showToast('🎯 Perfeito! ' + acertos + ' de ' + total, 'ouro');
    } else if (acertos > 0) {
      showToast('👍 ' + acertos + ' de ' + total + ' corretas', 'sucesso');
    } else {
      showToast('😅 Nenhuma correta — veja as respostas', 'erro');
    }

    const isLast = estado.currentRound >= estado.totalRounds - 1;
    setVerifyState(isLast ? 'finish' : 'next');
  }

  function applyVerifyFeedback() {
    if (!el.matchGrid) return 0;
    const zones = [...el.matchGrid.querySelectorAll('.drop-zone')];
    let acertos = 0;
    zones.forEach(function (zone) {
      const correct  = zone.dataset.correct;
      const card     = zone.querySelector('.a-card');
      const placed   = card ? card.querySelector('.a-text').textContent.trim() : '';
      zone.classList.remove('correct', 'wrong');
      const oldCa = zone.querySelector('.correct-answer');
      if (oldCa) oldCa.remove();

      if (placed === correct) {
        acertos++;
        zone.classList.add('correct');
      } else {
        zone.classList.add('wrong');
        const correctEl = document.createElement('span');
        correctEl.className = 'correct-answer';
        correctEl.textContent = '✓ ' + correct;
        zone.appendChild(correctEl);
      }
    });
    return acertos;
  }

  /* ══════════════════════════════════════════════════════════════
     ESTADOS DO BOTÃO VERIFICAR
  ══════════════════════════════════════════════════════════════ */

  function setVerifyState(state) {
    if (!el.btnVerif) return;
    if (state === 'verify') {
      el.btnVerifLbl.textContent = 'Verificar';
      el.btnVerifIcon.innerHTML  = '<polyline points="20 6 9 17 4 12"/>';
      el.btnVerif.onclick = doVerify;
    } else if (state === 'next') {
      el.btnVerifLbl.textContent = 'Próxima rodada';
      el.btnVerifIcon.innerHTML  = '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>';
      el.btnVerif.onclick = function () {
        estado.currentRound++;
        renderRound(loadValidRound(estado.currentRound));
      };
    } else if (state === 'finish') {
      el.btnVerifLbl.textContent = 'Ver resultado';
      el.btnVerifIcon.innerHTML  = '<polyline points="20 6 9 17 4 12"/>';
      el.btnVerif.onclick = mostrarResultado;
    }
  }

  /* ══════════════════════════════════════════════════════════════
     RESULTADO
  ══════════════════════════════════════════════════════════════ */

  function mostrarResultado() {
    pararTimer();
    const total = estado.totalAcertos + estado.totalErros;
    const pct   = total > 0 ? Math.round((estado.totalAcertos / total) * 100) : 0;

    /* Trofeu + título */
    let trophy = '🏆', title = 'Excelente!', subtit = 'Todas as rodadas concluídas';
    if (pct === 100) { trophy = '🌟'; title = 'Perfeito!'; }
    else if (pct >= 80) { trophy = '🏆'; title = 'Muito bem!'; }
    else if (pct >= 60) { trophy = '👍'; title = 'Bom trabalho!'; }
    else { trophy = '📚'; title = 'Continue praticando!'; subtit = 'A prática leva à perfeição'; }

    if (el.resultTrophy)   el.resultTrophy.textContent   = trophy;
    if (el.resultTitle)    el.resultTitle.textContent     = title;
    if (el.resultSubtitle) el.resultSubtitle.textContent  = subtit;
    if (el.resultPontos)   el.resultPontos.textContent    = estado.totalPontos;
    if (el.resultAcertos)  el.resultAcertos.textContent   = estado.totalAcertos;
    if (el.resultErros)    el.resultErros.textContent     = estado.totalErros;
    if (el.resultPct)      el.resultPct.textContent       = pct + '%';
    if (el.resultTempo)    el.resultTempo.textContent     = formatTime(estado.timerSecs);

    /* Feedback textual */
    if (el.resultFeedback) {
      el.resultFeedback.classList.remove('hidden');
      el.resultFeedback.className = 'assoc-result__feedback';
      let feedTipo, feedIcon, feedText;
      if (pct === 100) {
        feedTipo = 'assoc-result__feedback--perfeito'; feedIcon = '⭐'; feedText = 'Pontuação máxima — perfeito!';
      } else if (pct >= 80) {
        feedTipo = 'assoc-result__feedback--otimo';    feedIcon = '🎯'; feedText = 'Excelente desempenho!';
      } else if (pct >= 60) {
        feedTipo = 'assoc-result__feedback--bom';      feedIcon = '💪'; feedText = 'Bom resultado, continue assim!';
      } else {
        feedTipo = 'assoc-result__feedback--treinar';  feedIcon = '📖'; feedText = 'Revise o conteúdo e tente novamente';
      }
      el.resultFeedback.classList.add(feedTipo);
      if (el.resultFeedIcon) el.resultFeedIcon.textContent = feedIcon;
      if (el.resultFeedText) el.resultFeedText.textContent = feedText;
    }

    mostrarTela('screenResult');
  }

  /* ══════════════════════════════════════════════════════════════
     PAUSA
  ══════════════════════════════════════════════════════════════ */

  function pausar() {
    estado.pausado = true;
    pausarTimer();
    if (el.pauseOverlay) el.pauseOverlay.classList.remove('hidden');
    /* Atualiza stats no overlay */
    if (el.pauseTempo) el.pauseTempo.textContent = formatTime(estado.timerSecs);
    /* Altera ícone do botão */
    if (el.pauseIcon)  el.pauseIcon.innerHTML  = '<polygon points="5 3 19 12 5 21 5 3"/>';
    if (el.pauseLabel) el.pauseLabel.textContent = 'Retomar';
  }

  function retomar() {
    estado.pausado = false;
    retornarTimer();
    if (el.pauseOverlay) el.pauseOverlay.classList.add('hidden');
    if (el.pauseIcon)  el.pauseIcon.innerHTML  =
      '<rect x="3" y="2" width="3.5" height="12" rx="1"/>' +
      '<rect x="9.5" y="2" width="3.5" height="12" rx="1"/>';
    if (el.pauseLabel) el.pauseLabel.textContent = 'Pausar';
  }

  /* ══════════════════════════════════════════════════════════════
     NOVO JOGO — reiniciar do zero
  ══════════════════════════════════════════════════════════════ */

  function novoJogo() {
    clearAll();
    estado.currentRound  = 0;
    estado.totalAcertos  = 0;
    estado.totalErros    = 0;
    estado.totalPontos   = 0;
    estado.timerSecs     = 0;
    estado.pausado       = false;
    /* Regera seed */
    /* Usa estado.semestre (derivado da URL) — nunca valor hardcodado */
    const semData = ASSOCIACAO_DATA[estado.semestre] || {};
    const items   = semData[estado.discId] || [];
    estado.allItems    = shuffle(items);
    estado.totalRounds = Math.ceil(estado.allItems.length / CONFIG.ITEMS_PER_ROUND);
    _salvarSeed();
    mostrarIntro();
  }

  /* ══════════════════════════════════════════════════════════════
     DRAG HTML5 — CARDS
  ══════════════════════════════════════════════════════════════ */

  let dragState = null;
  let ghostEl   = null;

  function createGhost(text) {
    if (ghostEl) ghostEl.remove();
    ghostEl = document.createElement('div');
    ghostEl.className = 'drag-ghost';
    ghostEl.textContent = text;
    document.body.appendChild(ghostEl);
    return ghostEl;
  }

  function onCardDragStart(e) {
    if (estado.verified || estado.pausado) { e.preventDefault(); return; }
    const card     = e.currentTarget;
    const fromZone = card.closest('.drop-zone') || null;
    dragState = { card: card, dropped: false, fromZone: fromZone };
    card.classList.add('dragging');
    if (el.matchGrid) {
      el.matchGrid.querySelectorAll('.drop-zone').forEach(z => z.classList.add('droppable'));
    }
    if (fromZone) showTrash();
    const text  = card.querySelector('.a-text').textContent;
    const ghost = createGhost(text);
    e.dataTransfer.setDragImage(ghost, 28, 24);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.dataset.answerId);
  }

  function onCardDragEnd() {
    if (ghostEl) { ghostEl.remove(); ghostEl = null; }
    hideTrash();
    if (dragState) {
      const card     = dragState.card;
      const fromZone = dragState.fromZone;
      card.classList.remove('dragging');
      if (!dragState.dropped) {
        if (fromZone) {
          returnCardToPool(card);
          saveCurrentState();
          atualizarContadorFilled();
          showToast('Resposta devolvida', 'info');
        } else if (!card.parentNode) {
          if (el.poolGrid) el.poolGrid.appendChild(card);
          card.classList.add('in-pool');
          saveCurrentState();
          atualizarContadorFilled();
        }
      }
      dragState = null;
    }
    if (el.matchGrid) {
      el.matchGrid.querySelectorAll('.drop-zone').forEach(z =>
        z.classList.remove('droppable', 'drag-over', 'drag-over-swap')
      );
    }
    if (el.poolGrid) el.poolGrid.classList.remove('drag-over-pool');
  }

  /* ── DROP ZONES ── */

  function onZoneDragEnter(e) {
    e.preventDefault();
    if (!dragState || estado.verified) return;
    const zone     = e.currentTarget;
    const existing = zone.querySelector('.a-card');
    if (existing && existing !== dragState.card) {
      zone.classList.remove('drag-over');
      zone.classList.add('drag-over-swap');
    } else {
      zone.classList.remove('drag-over-swap');
      zone.classList.add('drag-over');
    }
  }

  function onZoneDragOver(e) {
    e.preventDefault();
    if (dragState && !estado.verified) e.dataTransfer.dropEffect = 'move';
  }

  function onZoneDragLeave(e) {
    const zone = e.currentTarget;
    if (!zone.contains(e.relatedTarget)) {
      zone.classList.remove('drag-over', 'drag-over-swap');
    }
  }

  function onZoneDrop(e) {
    e.preventDefault();
    if (!dragState || estado.verified) { endDrag(); return; }
    const targetZone = e.currentTarget;
    const card       = dragState.card;
    if (targetZone === card.closest('.drop-zone')) {
      targetZone.classList.remove('drag-over', 'drag-over-swap');
      dragState.dropped = true;
      endDrag();
      return;
    }
    performDrop(targetZone, card);
    dragState.dropped = true;
    endDrag();
  }

  /* ── POOL ── */

  function onPoolDragEnter(e) {
    e.preventDefault();
    if (!dragState || estado.verified) return;
    if (dragState.fromZone && el.poolGrid) el.poolGrid.classList.add('drag-over-pool');
  }

  function onPoolDragOver(e) {
    e.preventDefault();
    if (dragState && !estado.verified) e.dataTransfer.dropEffect = 'move';
  }

  function onPoolDragLeave(e) {
    if (el.poolGrid && !el.poolGrid.contains(e.relatedTarget)) {
      el.poolGrid.classList.remove('drag-over-pool');
    }
  }

  function onPoolDrop(e) {
    e.preventDefault();
    if (el.poolGrid) el.poolGrid.classList.remove('drag-over-pool');
    if (!dragState || estado.verified) { endDrag(); return; }
    const card = dragState.card;
    if (card.closest('#pool-grid')) { dragState.dropped = true; endDrag(); return; }
    detachCard(card);
    card.classList.add('in-pool');
    if (el.poolGrid) el.poolGrid.appendChild(card);
    dragState.dropped = true;
    saveCurrentState();
    atualizarContadorFilled();
    endDrag();
  }

  function endDrag() {
    if (el.matchGrid) {
      el.matchGrid.querySelectorAll('.drop-zone').forEach(z =>
        z.classList.remove('droppable', 'drag-over', 'drag-over-swap')
      );
    }
    if (el.poolGrid) el.poolGrid.classList.remove('drag-over-pool');
    dragState = null;
  }

  /* ── LIXEIRA ── */

  function showTrash() { if (el.trashZone) el.trashZone.classList.add('visible'); }
  function hideTrash() { if (el.trashZone) el.trashZone.classList.remove('visible', 'drag-over-trash'); }

  function triggerTrashPulse() {
    if (!el.trashZone) return;
    el.trashZone.classList.remove('pulse');
    void el.trashZone.offsetWidth;
    el.trashZone.classList.add('pulse');
    setTimeout(function () { el.trashZone.classList.remove('pulse'); }, 600);
  }

  function onTrashDragEnter(e) {
    e.preventDefault();
    if (!dragState || estado.verified || !dragState.fromZone) return;
    if (el.trashZone) el.trashZone.classList.add('drag-over-trash');
  }

  function onTrashDragOver(e) {
    e.preventDefault();
    if (dragState && !estado.verified && dragState.fromZone) e.dataTransfer.dropEffect = 'move';
  }

  function onTrashDragLeave(e) {
    if (el.trashZone && !el.trashZone.contains(e.relatedTarget)) {
      el.trashZone.classList.remove('drag-over-trash');
    }
  }

  function onTrashDrop(e) {
    e.preventDefault();
    if (el.trashZone) el.trashZone.classList.remove('drag-over-trash');
    if (!dragState || estado.verified || !dragState.fromZone) { endDrag(); return; }
    returnCardToPool(dragState.card);
    triggerTrashPulse();
    dragState.dropped = true;
    saveCurrentState();
    atualizarContadorFilled();
    showToast('Resposta devolvida ao banco', 'info');
    hideTrash();
    endDrag();
  }

  /* ── DROP CENTRAL ── */

  function performDrop(targetZone, card) {
    const existingCard = targetZone.querySelector('.a-card');
    const fromZone     = card.closest('.drop-zone');
    if (existingCard && existingCard !== card) {
      if (fromZone) {
        detachCard(card);
        detachCard(existingCard);
        placeCardInZone(targetZone, card);
        placeCardInZone(fromZone,   existingCard);
        animateZone(targetZone);
        animateZone(fromZone);
      } else {
        detachCard(card);
        detachCard(existingCard);
        existingCard.classList.add('in-pool');
        if (el.poolGrid) el.poolGrid.appendChild(existingCard);
        placeCardInZone(targetZone, card);
        animateZone(targetZone);
      }
    } else {
      detachCard(card);
      placeCardInZone(targetZone, card);
      animateZone(targetZone);
    }
    saveCurrentState();
    atualizarContadorFilled();
  }

  /* ══════════════════════════════════════════════════════════════
     TOUCH DRAG & DROP
  ══════════════════════════════════════════════════════════════ */

  let touchGhost    = null;
  let touchOffsetX  = 0;
  let touchOffsetY  = 0;
  let lastTouchZone = null;
  let touchCard     = null;

  function onCardTouchStart(e) {
    if (estado.verified || estado.pausado) return;
    e.preventDefault();
    touchCard = e.currentTarget;
    const touch  = e.touches[0];
    const rect   = touchCard.getBoundingClientRect();
    touchOffsetX = touch.clientX - rect.left;
    touchOffsetY = touch.clientY - rect.top;
    const fromZone = touchCard.closest('.drop-zone') || null;
    dragState = { card: touchCard, dropped: false, fromZone: fromZone };
    touchCard.classList.add('dragging');

    /* Clona como ghost */
    touchGhost = touchCard.cloneNode(true);
    touchGhost.classList.add('touch-ghost');
    touchGhost.style.width  = touchCard.offsetWidth + 'px';
    touchGhost.style.left   = (touch.clientX - touchOffsetX) + 'px';
    touchGhost.style.top    = (touch.clientY - touchOffsetY)  + 'px';
    document.body.appendChild(touchGhost);

    if (fromZone) showTrash();
    if (el.matchGrid) {
      el.matchGrid.querySelectorAll('.drop-zone').forEach(z => z.classList.add('droppable'));
    }

    document.addEventListener('touchmove',   onTouchMove,   { passive: false });
    document.addEventListener('touchend',    onTouchEnd,    { passive: false });
    document.addEventListener('touchcancel', onTouchCancel, { passive: false });
  }

  function onTouchMove(e) {
    e.preventDefault();
    if (!dragState) return;
    const touch = e.touches[0];
    moveTouchGhost(touch.clientX, touch.clientY);

    touchGhost.style.visibility = 'hidden';
    const el2 = document.elementFromPoint(touch.clientX, touch.clientY);
    touchGhost.style.visibility = '';

    const zone  = el2 ? el2.closest('.drop-zone') : null;
    const trash = el2 ? el2.closest('#trash-zone') : null;

    /* Atualiza highlight */
    if (lastTouchZone && lastTouchZone !== zone) {
      lastTouchZone.classList.remove('drag-over', 'drag-over-swap');
    }
    if (zone && !estado.verified) {
      const existing = zone.querySelector('.a-card');
      if (existing && existing !== touchCard) {
        zone.classList.add('drag-over-swap');
      } else {
        zone.classList.add('drag-over');
      }
      lastTouchZone = zone;
    }

    if (el.poolGrid) {
      const pool = el2 ? el2.closest('#pool-grid') : null;
      el.poolGrid.classList.toggle('drag-over-pool', !!(pool && dragState.fromZone));
    }

    if (dragState.fromZone && el.trashZone) {
      el.trashZone.classList.toggle('drag-over-trash', !!trash);
    }
  }

  function onTouchEnd(e) {
    if (!dragState) return;
    document.removeEventListener('touchmove',   onTouchMove);
    document.removeEventListener('touchend',    onTouchEnd);
    document.removeEventListener('touchcancel', onTouchCancel);

    const touch = (e.changedTouches || e.touches)[0];
    touchGhost.style.visibility = 'hidden';
    const elAt = document.elementFromPoint(touch.clientX, touch.clientY);
    touchGhost.style.visibility = '';

    const targetZone  = elAt ? elAt.closest('.drop-zone') : null;
    const targetPool  = elAt ? elAt.closest('#pool-grid') : null;
    const targetTrash = elAt ? elAt.closest('#trash-zone') : null;
    const fromZone    = dragState.fromZone;

    if (targetTrash && fromZone && !estado.verified) {
      returnCardToPool(touchCard);
      triggerTrashPulse();
      saveCurrentState();
      atualizarContadorFilled();
      showToast('Resposta devolvida ao banco', 'info');
    } else if (targetZone && !estado.verified) {
      if (targetZone !== fromZone) performDrop(targetZone, touchCard);
    } else if (targetPool && fromZone) {
      detachCard(touchCard);
      touchCard.classList.add('in-pool');
      if (el.poolGrid) el.poolGrid.appendChild(touchCard);
      saveCurrentState();
      atualizarContadorFilled();
    } else if (!targetZone && !targetPool && fromZone && !estado.verified) {
      returnCardToPool(touchCard);
      saveCurrentState();
      atualizarContadorFilled();
      showToast('Resposta devolvida', 'info');
    }

    endTouchDrag();
  }

  function onTouchCancel() {
    document.removeEventListener('touchmove',   onTouchMove);
    document.removeEventListener('touchend',    onTouchEnd);
    document.removeEventListener('touchcancel', onTouchCancel);
    endTouchDrag();
  }

  function endTouchDrag() {
    if (touchGhost) { touchGhost.remove(); touchGhost = null; }
    if (touchCard)  { touchCard.classList.remove('dragging'); touchCard = null; }
    if (lastTouchZone) { lastTouchZone.classList.remove('drag-over', 'drag-over-swap'); lastTouchZone = null; }
    if (el.matchGrid) {
      el.matchGrid.querySelectorAll('.drop-zone').forEach(z =>
        z.classList.remove('droppable', 'drag-over', 'drag-over-swap')
      );
    }
    if (el.poolGrid) el.poolGrid.classList.remove('drag-over-pool');
    hideTrash();
    dragState = null;
  }

  function moveTouchGhost(x, y) {
    if (!touchGhost) return;
    touchGhost.style.left = (x - touchOffsetX) + 'px';
    touchGhost.style.top  = (y - touchOffsetY) + 'px';
  }

  /* ══════════════════════════════════════════════════════════════
     EVENTOS DE BOTÕES
  ══════════════════════════════════════════════════════════════ */

  function bindEvents() {
    /* Voltar (header) */
    if (el.btnBack) {
      el.btnBack.addEventListener('click', function (e) {
        e.preventDefault();
        if (estado.telaAtual === 'screenGame') {
          mostrarIntro();
        } else {
          /* Em outros contextos, tenta navegar para a página anterior */
          history.back();
        }
      });
    }

    /* Intro: Começar */
    if (el.btnStart) {
      el.btnStart.addEventListener('click', function () {
        estado.totalAcertos = 0;
        estado.totalErros   = 0;
        estado.totalPontos  = 0;
        estado.currentRound = 0;
        renderRound(null);
      });
    }

    /* Intro: Continuar */
    if (el.btnContinuar) {
      el.btnContinuar.addEventListener('click', function () {
        renderRound(loadValidRound(estado.currentRound));
      });
    }

    /* Jogo: Voltar rodada */
    if (el.btnVoltar) {
      el.btnVoltar.addEventListener('click', function () {
        if (estado.currentRound === 0) {
          showToast('Já estás na primeira rodada', 'erro');
          return;
        }
        estado.currentRound--;
        renderRound(loadValidRound(estado.currentRound));
      });
    }

    /* Jogo: Desfazer tudo */
    if (el.btnReset) {
      el.btnReset.addEventListener('click', function () {
        if (estado.verified) {
          showToast('Já verificado — avance ou volte para outra rodada', 'erro');
          return;
        }
        if (!el.matchGrid) return;
        el.matchGrid.querySelectorAll('.drop-zone').forEach(function (zone) {
          const card = zone.querySelector('.a-card');
          if (card) {
            detachCard(card);
            card.classList.add('in-pool');
            if (el.poolGrid) el.poolGrid.appendChild(card);
          }
          zone.classList.remove('filled', 'drag-over', 'drag-over-swap', 'droppable', 'correct', 'wrong');
          zone.title = '';
          const hint = zone.querySelector('.drop-hint');
          if (hint) hint.style.display = '';
          const ca = zone.querySelector('.correct-answer');
          if (ca) ca.remove();
        });
        clearRound(estado.currentRound);
        atualizarContadorFilled();
        showToast('Rodada reiniciada', 'info');
      });
    }

    /* Jogo: Pausa / Retomar */
    if (el.btnPause) {
      el.btnPause.addEventListener('click', function () {
        if (!estado.pausado) pausar();
        else retomar();
      });
    }

    if (el.btnRetomar) {
      el.btnRetomar.addEventListener('click', retomar);
    }

    /* Jogo: Ir para intro */
    if (el.btnVoltarIntro) {
      el.btnVoltarIntro.addEventListener('click', function () {
        pararTimer();
        mostrarIntro();
      });
    }

    /* Pausa: menu */
    if (el.btnPauseMenu) {
      el.btnPauseMenu.addEventListener('click', function () {
        retomar();
        pararTimer();
        mostrarIntro();
      });
    }

    /* Resultado: jogar novamente */
    if (el.btnRejogo) {
      el.btnRejogo.addEventListener('click', novoJogo);
    }

    /* Resultado: menu */
    if (el.btnMenu) {
      el.btnMenu.addEventListener('click', function () {
        novoJogo();
        mostrarIntro();
      });
    }

    /* Empty: voltar */
    const btnEmptyBack = $('btn-empty-back');
    if (btnEmptyBack) {
      btnEmptyBack.addEventListener('click', function () {
        history.back();
      });
    }
  }

  /* ══════════════════════════════════════════════════════════════
     IDENTIDADE SEM DADOS
     Resolve disciplina e semestre da URL mesmo quando não há
     questões, para preencher o cabeçalho na tela empty.
  ══════════════════════════════════════════════════════════════ */

  function _resolverIdentidadeSemDados() {
    try {
      const params    = new URLSearchParams(window.location.search);
      const semParam  = params.get('sem');
      const discParam = params.get('disc');

      /* Semestre: URL > primeira chave de ASSOCIACAO_DATA > fallback */
      const semestresDisponiveis = Object.keys(ASSOCIACAO_DATA);
      estado.semestre = (semParam) ? semParam
        : (semestresDisponiveis.length ? semestresDisponiveis[0] : '—');

      /* Disciplina: tenta via global.js */
      const disciplinas = getDisciplinasDeSemestre(estado.semestre);
      let discObj = null;

      if (discParam && disciplinas) {
        discObj = disciplinas.find(function (d) {
          return d.id === discParam || d.arquivo === discParam;
        });
      }
      if (!discObj && disciplinas && disciplinas.length) {
        discObj = disciplinas[0];
      }

      if (discObj) {
        estado.discObj = discObj;
        estado.discId  = discObj.arquivo ?? discObj.id;
      }

      /* Aplica tema e preenche topbar */
      if (estado.discId) aplicarTema(estado.discId);

      const label = (estado.discObj && (estado.discObj.apelido ?? estado.discObj.nome))
        || estado.discId || '—';

      if (el.topbarDisc) el.topbarDisc.textContent = label;
      if (el.topbarSem)  el.topbarSem.textContent  = estado.semestre || '—';

    } catch (e) {
      /* Se global.js falhar, deixa cabeçalho vazio mas não quebra */
      console.warn('[assoc] _resolverIdentidadeSemDados falhou:', e);
    }
  }

  /* ══════════════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════════════ */

  document.addEventListener('DOMContentLoaded', function () {
    initDOM();
    bindEvents();

    /* Pequeno delay para a tela de loading aparecer */
    setTimeout(function () {
      const ok = carregarItens();
      if (!ok) {
        /* Mesmo sem questões, resolve disciplina/semestre da URL
           para preencher o cabeçalho corretamente. */
        _resolverIdentidadeSemDados();
        mostrarTela('screenEmpty');
        return;
      }
      aplicarTema(estado.discId);
      mostrarIntro();
    }, 300);
  });

})();