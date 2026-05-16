/* ─── ASSOCIAÇÃO — lógica principal (drag-and-drop reescrito) ─────────────── */

import { ASSOCIACAO_DATA } from './associacao_data.js';
import { saveRound, loadRound, clearRound } from './storage_a.js';

(function () {
  'use strict';

  const ITEMS_PER_ROUND = 4;

  /* ══════════════════════════════════════════════════════
     HELPERS
  ══════════════════════════════════════════════════════ */

  function getAllItems() {
    const all = [];
    const sem = ASSOCIACAO_DATA['2026.2'];
    Object.values(sem).forEach(function (disc) {
      disc.forEach(function (item) { all.push(item); });
    });
    return all;
  }

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

  /* ══════════════════════════════════════════════════════
     ESTADO GLOBAL — seed & rodada
  ══════════════════════════════════════════════════════ */

  let allItems;
  const savedSeed = sessionStorage.getItem('assoc_seed');
  if (savedSeed) {
    const base  = getAllItems();
    const order = JSON.parse(savedSeed);
    allItems = order.map(function (id) {
      return base.find(function (x) { return x.id === id; });
    }).filter(Boolean);
  } else {
    allItems = shuffle(getAllItems());
    sessionStorage.setItem('assoc_seed', JSON.stringify(allItems.map(function (x) { return x.id; })));
  }

  const totalRounds = Math.ceil(allItems.length / ITEMS_PER_ROUND);
  let currentRound  = parseInt(sessionStorage.getItem('assoc_round') || '0', 10);
  let roundItems    = [];
  let verified      = false;

  /* ══════════════════════════════════════════════════════
     SELETORES DOM
  ══════════════════════════════════════════════════════ */

  const matchGrid    = document.getElementById('match-grid');
  const poolGrid     = document.getElementById('pool-grid');
  const trashZone    = document.getElementById('trash-zone');
  const filledCount  = document.getElementById('filled-count');
  const qCount       = document.getElementById('q-count');
  const roundCur     = document.getElementById('round-current');
  const roundTot     = document.getElementById('round-total');
  const progressFill = document.getElementById('progress-fill');
  const progressPct  = document.getElementById('progress-pct');
  const timerVal     = document.getElementById('timer-val');
  const btnVoltar    = document.getElementById('btn-voltar');
  const btnReset     = document.getElementById('btn-reset');
  const btnVerif     = document.getElementById('btn-verificar');
  const btnVerifLbl  = document.getElementById('btn-verificar-label');
  const btnVerifIcon = document.getElementById('btn-verificar-icon');
  const toast        = document.getElementById('toast');

  /* ══════════════════════════════════════════════════════
     TIMER
  ══════════════════════════════════════════════════════ */

  let timerSecs = 0, timerInterval = null;

  function startTimer() {
    clearInterval(timerInterval);
    timerSecs = 0;
    timerInterval = setInterval(function () {
      timerSecs++;
      const m = String(Math.floor(timerSecs / 60)).padStart(2, '0');
      const s = String(timerSecs % 60).padStart(2, '0');
      timerVal.textContent = m + ':' + s;
    }, 1000);
  }

  /* ══════════════════════════════════════════════════════
     TOAST
  ══════════════════════════════════════════════════════ */

  function showToast(msg, color) {
    color = color || 'var(--cyan)';
    toast.textContent = msg;
    toast.style.color = color;
    toast.style.borderColor = color === 'var(--gold)'
      ? 'rgba(245,200,66,0.35)'
      : color === '#ff8080'
        ? 'rgba(255,128,128,0.35)'
        : 'rgba(0,229,200,0.30)';
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toast.classList.remove('show'); }, 2400);
  }

  /* ══════════════════════════════════════════════════════
     PROGRESS
  ══════════════════════════════════════════════════════ */

  function updateProgress() {
    const pct = Math.round((currentRound / totalRounds) * 100);
    progressFill.style.width = pct + '%';
    progressPct.textContent  = pct + '%';
    roundCur.textContent     = currentRound + 1;
    roundTot.textContent     = totalRounds;
  }

  function updateCount() {
    const zones  = matchGrid.querySelectorAll('.drop-zone');
    const filled = [...zones].filter(function (z) { return z.querySelector('.a-card'); }).length;
    filledCount.textContent = filled + ' / ' + zones.length;
  }

  /* ══════════════════════════════════════════════════════
     CARD FACTORY
     Cria o elemento .a-card que FISICAMENTE se move
     entre pool-grid e drop-zones.
  ══════════════════════════════════════════════════════ */

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
      /* X button — only shown via CSS on desktop for cards in-zone */
      '<button class="card-remove-btn" tabindex="-1" aria-label="Remover resposta">' +
        '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round">' +
          '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
        '</svg>' +
      '</button>';

    /* X button click handler */
    card.querySelector('.card-remove-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      if (verified) return;
      if (card.closest('.drop-zone')) {
        returnCardToPool(card);
        saveCurrentState();
        updateCount();
        showToast('Resposta devolvida ao banco');
      }
    });

    /* ── Eventos drag HTML5 ── */
    card.addEventListener('dragstart', onCardDragStart);
    card.addEventListener('dragend',   onCardDragEnd);

    /* ── Eventos touch ── */
    card.addEventListener('touchstart', onCardTouchStart, { passive: false });

    return card;
  }

  /* ══════════════════════════════════════════════════════
     RENDER ROUND
     Reconstrói toda a grade para a rodada corrente.
  ══════════════════════════════════════════════════════ */

  function renderRound(restoredState) {
    verified   = false;
    const start = currentRound * ITEMS_PER_ROUND;
    roundItems  = allItems.slice(start, start + ITEMS_PER_ROUND);

    sessionStorage.setItem('assoc_round', currentRound);
    updateProgress();
    qCount.textContent = roundItems.length + ' itens';

    /* Ordem do pool (embaralhada ou restaurada) */
    let poolOrder;
    if (restoredState) {
      /* IDs já colocados em slots */
      const placedIds = new Set((restoredState.placements || []).map(function (p) { return p.answerId; }));
      /* poolOrder salvo, mas garantindo que nenhum item do round seja perdido */
      const savedPoolIds = (restoredState.poolOrder || []);
      /* Itens que deveriam estar no pool mas não estão em nenhum dos dois lados → fallback */
      const allRoundIds  = roundItems.map(function (x) { return x.id; });
      const accountedIds = new Set([...placedIds, ...savedPoolIds]);
      const missingIds   = allRoundIds.filter(function (id) { return !accountedIds.has(id); });
      const finalPoolIds = savedPoolIds.concat(missingIds);
      poolOrder = finalPoolIds.map(function (id) {
        return roundItems.find(function (x) { return x.id === id; });
      }).filter(Boolean);
    } else {
      poolOrder = shuffle(roundItems.slice());
    }

    /* ── match-grid: perguntas + drop-zones vazias ── */
    matchGrid.innerHTML = '';
    roundItems.forEach(function (item, i) {
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

      /* Eventos de zona (HTML5) */
      zone.addEventListener('dragenter', onZoneDragEnter);
      zone.addEventListener('dragover',  onZoneDragOver);
      zone.addEventListener('dragleave', onZoneDragLeave);
      zone.addEventListener('drop',      onZoneDrop);

      row.appendChild(qCell);
      row.appendChild(zone);
      matchGrid.appendChild(row);
    });

    /* ── pool-grid: respostas disponíveis ── */
    poolGrid.innerHTML = '';
    /* Remove listeners antigos antes de adicionar novos (evita acúmulo) */
    poolGrid.removeEventListener('dragenter', onPoolDragEnter);
    poolGrid.removeEventListener('dragover',  onPoolDragOver);
    poolGrid.removeEventListener('dragleave', onPoolDragLeave);
    poolGrid.removeEventListener('drop',      onPoolDrop);
    poolGrid.addEventListener('dragenter', onPoolDragEnter);
    poolGrid.addEventListener('dragover',  onPoolDragOver);
    poolGrid.addEventListener('dragleave', onPoolDragLeave);
    poolGrid.addEventListener('drop',      onPoolDrop);

    /* Trash zone events (bound once on first render, won't duplicate) */
    if (!trashZone._bound) {
      trashZone._bound = true;
      trashZone.addEventListener('dragenter', onTrashDragEnter);
      trashZone.addEventListener('dragover',  onTrashDragOver);
      trashZone.addEventListener('dragleave', onTrashDragLeave);
      trashZone.addEventListener('drop',      onTrashDrop);
    }

    poolOrder.forEach(function (item) {
      poolGrid.appendChild(makeCard(item.id, item.resposta));
    });

    setVerifyState('verify');

    if (restoredState) {
      restoreState(restoredState);
    } else {
      updateCount();
      startTimer();
    }
  }

  /* ══════════════════════════════════════════════════════
     RESTAURAR ESTADO SALVO
  ══════════════════════════════════════════════════════ */

  function restoreState(state) {
    state.placements.forEach(function (p) {
      const zone = matchGrid.querySelector('.drop-zone[data-question-id="' + p.questionId + '"]');
      const card = poolGrid.querySelector('.a-card[data-answer-id="' + p.answerId + '"]');
      if (!zone || !card) return;
      placeCardInZone(zone, card);
    });
    updateCount();
    if (state.verified) {
      verified = true;
      clearInterval(timerInterval);
      applyVerifyFeedback();
      setVerifyState(currentRound >= totalRounds - 1 ? 'finish' : 'next');
      /* Bloquear drag após verificação */
      lockAllCards();
    } else {
      startTimer();
    }
  }

  /* ══════════════════════════════════════════════════════
     OPERAÇÕES FÍSICAS DE ZONA
     Cards se movem fisicamente no DOM.
  ══════════════════════════════════════════════════════ */

  /**
   * Move um card para dentro de uma zona.
   * Remove o .drop-hint e aplica classe .filled.
   */
  function placeCardInZone(zone, card) {
    const hint = zone.querySelector('.drop-hint');
    if (hint) hint.style.display = 'none'; /* oculta, mantém no DOM */

    zone.classList.add('filled');
    zone.classList.remove('drag-over', 'drag-over-swap', 'droppable');
    zone.appendChild(card);
    card.classList.remove('in-pool', 'dragging');
    card.classList.add('in-zone');
  }

  /**
   * Remove o card de uma zona e devolve ao pool.
   * Restaura o .drop-hint e remove classe .filled.
   */
  function returnCardToPool(card) {
    const hint = card.closest('.drop-zone') &&
                 card.closest('.drop-zone').querySelector('.drop-hint');
    if (hint) hint.style.display = '';

    const zone = card.closest('.drop-zone');
    if (zone) {
      zone.classList.remove('filled', 'drag-over', 'drag-over-swap', 'correct', 'wrong');
    }

    card.classList.remove('in-zone', 'dragging');
    card.classList.add('in-pool');
    poolGrid.appendChild(card);
  }

  /**
   * Extrai o card de onde está (zona ou pool) sem destruí-lo.
   * Retorna o card. Se estava em uma zona, limpa a zona.
   */
  function detachCard(card) {
    const zone = card.closest('.drop-zone');
    if (zone) {
      const hint = zone.querySelector('.drop-hint');
      if (hint) hint.style.display = '';
      zone.classList.remove('filled', 'drag-over', 'drag-over-swap');
    }
    card.classList.remove('in-zone', 'in-pool', 'dragging');
    /* Remove do pai sem destruir */
    if (card.parentNode) card.parentNode.removeChild(card);
    return card;
  }

  function lockAllCards() {
    document.querySelectorAll('.a-card').forEach(function (c) {
      c.setAttribute('draggable', 'false');
      c.style.cursor = 'default';
    });
  }

  /* ══════════════════════════════════════════════════════
     ESTADO DO DRAG
  ══════════════════════════════════════════════════════ */

  /* dragState guarda referência ao card sendo arrastado */
  let dragState = null;

  /* ghostEl: imagem customizada para o drag nativo */
  let ghostEl = null;

  function createGhost(text) {
    if (ghostEl) ghostEl.remove();
    ghostEl = document.createElement('div');
    ghostEl.className = 'drag-ghost';
    ghostEl.textContent = text;
    document.body.appendChild(ghostEl);
    return ghostEl;
  }

  /* ══════════════════════════════════════════════════════
     DRAG HTML5 — CARDS
  ══════════════════════════════════════════════════════ */

  function onCardDragStart(e) {
    if (verified) { e.preventDefault(); return; }
    const card = e.currentTarget;
    /* Registra a origem no momento exato do dragstart (antes de qualquer DOM change) */
    const fromZone = card.closest('.drop-zone') || null;
    dragState  = { card: card, dropped: false, fromZone: fromZone };

    card.classList.add('dragging');

    /* Ilumina todas as zonas como alvos */
    matchGrid.querySelectorAll('.drop-zone').forEach(function (z) {
      z.classList.add('droppable');
    });

    /* Mostra lixeira somente se o card está em uma zona (não se já está no pool) */
    if (fromZone) {
      showTrash();
    }

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
      const fromZone = dragState.fromZone; /* origem registrada no dragstart */
      card.classList.remove('dragging');

      /* Se o card não foi dropado em nenhum alvo válido */
      if (!dragState.dropped) {
        if (fromZone) {
          /* Veio de uma zona e soltou fora → devolve ao pool */
          returnCardToPool(card);
          saveCurrentState();
          updateCount();
          showToast('Resposta devolvida');
        } else if (!card.parentNode) {
          /* Segurança: card sem pai → reinsere no pool */
          poolGrid.appendChild(card);
          card.classList.add('in-pool');
          saveCurrentState();
          updateCount();
        }
        /* Se veio do pool e soltou fora → permanece no pool (não faz nada) */
      }
      dragState = null;
    }

    matchGrid.querySelectorAll('.drop-zone').forEach(function (z) {
      z.classList.remove('droppable', 'drag-over', 'drag-over-swap');
    });
    poolGrid.classList.remove('drag-over-pool');
  }

  /* ══════════════════════════════════════════════════════
     DRAG HTML5 — DROP ZONES
  ══════════════════════════════════════════════════════ */

  function onZoneDragEnter(e) {
    e.preventDefault();
    if (!dragState || verified) return;
    const zone = e.currentTarget;

    /* Se a zona já tem um card diferente do que estamos arrastando → swap */
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
    if (dragState && !verified) e.dataTransfer.dropEffect = 'move';
  }

  function onZoneDragLeave(e) {
    const zone = e.currentTarget;
    if (!zone.contains(e.relatedTarget)) {
      zone.classList.remove('drag-over', 'drag-over-swap');
    }
  }

  function onZoneDrop(e) {
    e.preventDefault();
    if (!dragState || verified) { endDrag(); return; }

    const targetZone = e.currentTarget;
    const card       = dragState.card;

    /* Card já está nesta mesma zona → ignora */
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

  /* ══════════════════════════════════════════════════════
     DRAG HTML5 — POOL (área de devolução)
  ══════════════════════════════════════════════════════ */

  function onPoolDragEnter(e) {
    e.preventDefault();
    if (!dragState || verified) return;
    /* Só faz sentido se o card vem de uma zona */
    if (dragState.fromZone) {
      poolGrid.classList.add('drag-over-pool');
    }
  }

  function onPoolDragOver(e) {
    e.preventDefault();
    if (dragState && !verified) e.dataTransfer.dropEffect = 'move';
  }

  function onPoolDragLeave(e) {
    if (!poolGrid.contains(e.relatedTarget)) {
      poolGrid.classList.remove('drag-over-pool');
    }
  }

  function onPoolDrop(e) {
    e.preventDefault();
    poolGrid.classList.remove('drag-over-pool');
    if (!dragState || verified) { endDrag(); return; }

    const card = dragState.card;

    /* Se card já está no pool, não faz nada */
    if (card.closest('#pool-grid')) {
      dragState.dropped = true;
      endDrag();
      return;
    }

    /* Card estava em uma zona → devolve ao pool */
    detachCard(card);
    card.classList.add('in-pool');
    poolGrid.appendChild(card);

    dragState.dropped = true;
    saveCurrentState();
    updateCount();
    endDrag();
  }

  function endDrag() {
    matchGrid.querySelectorAll('.drop-zone').forEach(function (z) {
      z.classList.remove('droppable', 'drag-over', 'drag-over-swap');
    });
    poolGrid.classList.remove('drag-over-pool');
    dragState = null;
  }

  /* ══════════════════════════════════════════════════════
     LIXEIRA — helpers e eventos
  ══════════════════════════════════════════════════════ */

  function showTrash() {
    trashZone.classList.add('visible');
    trashZone.classList.remove('drag-over-trash');
  }

  function hideTrash() {
    trashZone.classList.remove('visible', 'drag-over-trash');
  }

  function triggerTrashPulse() {
    trashZone.classList.remove('pulse');
    /* Force reflow to restart animation */
    void trashZone.offsetWidth;
    trashZone.classList.add('pulse');
    setTimeout(function () { trashZone.classList.remove('pulse'); }, 600);
  }

  function onTrashDragEnter(e) {
    e.preventDefault();
    if (!dragState || verified) return;
    /* Only allow trash if card is coming from a zone */
    if (dragState.fromZone) {
      trashZone.classList.add('drag-over-trash');
    }
  }

  function onTrashDragOver(e) {
    e.preventDefault();
    if (dragState && !verified && dragState.fromZone) {
      e.dataTransfer.dropEffect = 'move';
    }
  }

  function onTrashDragLeave(e) {
    if (!trashZone.contains(e.relatedTarget)) {
      trashZone.classList.remove('drag-over-trash');
    }
  }

  function onTrashDrop(e) {
    e.preventDefault();
    trashZone.classList.remove('drag-over-trash');
    if (!dragState || verified) { endDrag(); return; }

    const card = dragState.card;

    /* Only accept cards from zones */
    if (!dragState.fromZone) {
      dragState.dropped = true;
      endDrag();
      return;
    }

    returnCardToPool(card);
    triggerTrashPulse();
    dragState.dropped = true;
    saveCurrentState();
    updateCount();
    showToast('Resposta devolvida ao banco');
    hideTrash();
    endDrag();
  }

  /* ══════════════════════════════════════════════════════
     LÓGICA DE DROP CENTRAL
  ══════════════════════════════════════════════════════ */

  function performDrop(targetZone, card) {
    const existingCard = targetZone.querySelector('.a-card');
    const fromZone     = card.closest('.drop-zone');   /* pode ser null (vem do pool) */

    if (existingCard && existingCard !== card) {
      /* ── SWAP / TROCA ──────────────────────────────────
         O destino já tem um card diferente.
         Se o card arrastado vem de uma zona → swap entre as duas zonas.
         Se vem do pool → devolve o existente ao pool e coloca o novo.
      ──────────────────────────────────────────────────── */
      if (fromZone) {
        /* Swap: retira ambos, troca de posição */
        detachCard(card);
        detachCard(existingCard);
        placeCardInZone(targetZone, card);
        placeCardInZone(fromZone,   existingCard);
        animateZone(targetZone);
        animateZone(fromZone);
      } else {
        /* Pool → zona ocupada: existingCard volta ao pool */
        detachCard(card);          /* garante que não tem parentNode duplicado */
        detachCard(existingCard);
        existingCard.classList.add('in-pool');
        poolGrid.appendChild(existingCard);
        placeCardInZone(targetZone, card);
        animateZone(targetZone);
      }
    } else {
      /* ── ZONA VAZIA (ou mesmo card) ───────────────────
         Move o card direto para a zona destino.
      ──────────────────────────────────────────────────── */
      detachCard(card);
      placeCardInZone(targetZone, card);
      animateZone(targetZone);
    }

    saveCurrentState();
    updateCount();
  }

  function animateZone(zone) {
    zone.animate(
      [{ transform: 'scale(1.03)' }, { transform: 'scale(1)' }],
      { duration: 180, easing: 'ease-out' }
    );
  }

  /* ══════════════════════════════════════════════════════
     TOUCH DRAG & DROP
  ══════════════════════════════════════════════════════ */

  let touchGhost    = null;
  let touchOffsetX  = 0;
  let touchOffsetY  = 0;
  let lastTouchZone = null;
  let touchCard     = null;

  function onCardTouchStart(e) {
    if (verified) return;
    e.preventDefault();

    touchCard = e.currentTarget;
    const touch = e.touches[0];
    const rect  = touchCard.getBoundingClientRect();
    touchOffsetX = touch.clientX - rect.left;
    touchOffsetY = touch.clientY - rect.top;

    /* Registra origem no momento do touchstart */
    const fromZone = touchCard.closest('.drop-zone') || null;
    dragState = { card: touchCard, dropped: false, fromZone: fromZone };
    touchCard.classList.add('dragging');

    /* Show trash if card is in a zone */
    if (fromZone) {
      showTrash();
    }

    /* Ghost visual */
    touchGhost = touchCard.cloneNode(true);
    touchGhost.classList.add('touch-ghost');
    touchGhost.style.width = rect.width + 'px';
    document.body.appendChild(touchGhost);
    moveTouchGhost(touch.clientX, touch.clientY);

    matchGrid.querySelectorAll('.drop-zone').forEach(function (z) {
      z.classList.add('droppable');
    });

    document.addEventListener('touchmove',   onTouchMove,   { passive: false });
    document.addEventListener('touchend',    onTouchEnd,    { once: true });
    document.addEventListener('touchcancel', onTouchCancel, { once: true });
  }

  function onTouchMove(e) {
    if (!dragState) return;
    e.preventDefault();
    const touch = e.touches[0];
    moveTouchGhost(touch.clientX, touch.clientY);

    touchGhost.style.visibility = 'hidden';
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    touchGhost.style.visibility = '';

    const zone  = el ? el.closest('.drop-zone') : null;
    const pool  = el ? el.closest('#pool-grid') : null;
    const trash = el ? el.closest('#trash-zone') : null;

    /* Atualiza highlights de zona */
    if (zone !== lastTouchZone) {
      if (lastTouchZone) lastTouchZone.classList.remove('drag-over', 'drag-over-swap');
      if (zone) {
        const existing = zone.querySelector('.a-card');
        if (existing && existing !== dragState.card) {
          zone.classList.add('drag-over-swap');
        } else {
          zone.classList.add('drag-over');
        }
      }
      lastTouchZone = zone;
    }

    /* Pool highlight */
    if (pool) {
      poolGrid.classList.add('drag-over-pool');
    } else {
      poolGrid.classList.remove('drag-over-pool');
    }

    /* Trash highlight (only for cards from zones) */
    if (dragState.fromZone) {
      if (trash) {
        trashZone.classList.add('drag-over-trash');
      } else {
        trashZone.classList.remove('drag-over-trash');
      }
    }
  }

  function onTouchEnd(e) {
    if (!dragState) return;
    document.removeEventListener('touchmove', onTouchMove);

    const touch = (e.changedTouches || e.touches)[0];
    touchGhost.style.visibility = 'hidden';
    const el   = document.elementFromPoint(touch.clientX, touch.clientY);
    touchGhost.style.visibility = '';

    const targetZone  = el ? el.closest('.drop-zone') : null;
    const targetPool  = el ? el.closest('#pool-grid') : null;
    const targetTrash = el ? el.closest('#trash-zone') : null;

    const fromZone = dragState.fromZone; /* origem registrada no touchstart */

    if (targetTrash && fromZone && !verified) {
      /* Dropped on trash — return to pool */
      returnCardToPool(touchCard);
      triggerTrashPulse();
      saveCurrentState();
      updateCount();
      showToast('Resposta devolvida ao banco');
    } else if (targetZone && !verified) {
      /* Não fazer nada se soltou na zona de origem */
      if (targetZone !== fromZone) {
        performDrop(targetZone, touchCard);
      }
    } else if (targetPool && fromZone) {
      /* Devolver ao pool explicitamente */
      detachCard(touchCard);
      touchCard.classList.add('in-pool');
      poolGrid.appendChild(touchCard);
      saveCurrentState();
      updateCount();
    } else if (!targetZone && !targetPool && fromZone && !verified) {
      /* Dropped outside any valid area — return card to pool */
      returnCardToPool(touchCard);
      saveCurrentState();
      updateCount();
      showToast('Resposta devolvida');
    }
    /* Se veio do pool e soltou fora de zona → permanece no pool */

    endTouchDrag();
  }

  function onTouchCancel() {
    document.removeEventListener('touchmove', onTouchMove);
    endTouchDrag();
  }

  function endTouchDrag() {
    if (touchGhost) { touchGhost.remove(); touchGhost = null; }
    if (touchCard)  { touchCard.classList.remove('dragging'); touchCard = null; }
    if (lastTouchZone) { lastTouchZone.classList.remove('drag-over', 'drag-over-swap'); lastTouchZone = null; }
    matchGrid.querySelectorAll('.drop-zone').forEach(function (z) {
      z.classList.remove('droppable', 'drag-over', 'drag-over-swap');
    });
    poolGrid.classList.remove('drag-over-pool');
    hideTrash();
    dragState = null;
  }

  function moveTouchGhost(x, y) {
    if (!touchGhost) return;
    touchGhost.style.left = (x - touchOffsetX) + 'px';
    touchGhost.style.top  = (y - touchOffsetY)  + 'px';
  }

  /* ══════════════════════════════════════════════════════
     PERSISTÊNCIA
  ══════════════════════════════════════════════════════ */

  function saveCurrentState(isVerified) {
    /* Coleta placements: cards dentro de drop-zones */
    const zones = [...matchGrid.querySelectorAll('.drop-zone')];
    const placements = zones
      .filter(function (z) { return z.querySelector('.a-card'); })
      .map(function (z) {
        const card = z.querySelector('.a-card');
        return {
          questionId : z.dataset.questionId,
          answerId   : card.dataset.answerId,
          text       : card.querySelector('.a-text').textContent
        };
      });

    /* Ordem do pool: cards ainda no pool-grid */
    const poolOrder = [...poolGrid.querySelectorAll('.a-card')]
      .map(function (c) { return c.dataset.answerId; });

    saveRound(currentRound, { placements, poolOrder, verified: !!isVerified });
  }

  /* ══════════════════════════════════════════════════════
     VERIFICAÇÃO
  ══════════════════════════════════════════════════════ */

  function doVerify() {
    const zones  = [...matchGrid.querySelectorAll('.drop-zone')];
    const filled = zones.filter(function (z) { return z.querySelector('.a-card'); }).length;
    if (filled < zones.length) {
      showToast('Preencha todas as respostas antes de verificar!', '#ff8080');
      return;
    }
    verified = true;
    clearInterval(timerInterval);
    lockAllCards();
    const acertos = applyVerifyFeedback();
    saveCurrentState(true);
    const total  = zones.length;
    const isLast = currentRound >= totalRounds - 1;
    if (acertos === total) {
      showToast('🎯 Perfeito! ' + acertos + ' de ' + total + ' corretas!', 'var(--gold)');
    } else if (acertos > 0) {
      showToast('👍 ' + acertos + ' de ' + total + ' corretas', 'var(--cyan)');
    } else {
      showToast('😅 Nenhuma correta — veja as respostas', '#ff8080');
    }
    setVerifyState(isLast ? 'finish' : 'next');
  }

  function applyVerifyFeedback() {
    const zones = [...matchGrid.querySelectorAll('.drop-zone')];
    let acertos = 0;
    zones.forEach(function (zone) {
      const correct = zone.dataset.correct;
      const card    = zone.querySelector('.a-card');
      const placed  = card ? card.querySelector('.a-text').textContent.trim() : '';
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

  function setVerifyState(state) {
    if (state === 'verify') {
      btnVerifLbl.textContent = 'Verificar';
      btnVerifIcon.innerHTML  = '<polyline points="20 6 9 17 4 12"/>';
      btnVerif.onclick = doVerify;
    } else if (state === 'next') {
      btnVerifLbl.textContent = 'Próxima rodada';
      btnVerifIcon.innerHTML  = '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>';
      btnVerif.onclick = function () {
        currentRound++;
        renderRound(loadValidRound(currentRound));
      };
    } else if (state === 'finish') {
      btnVerifLbl.textContent = 'Finalizar';
      btnVerifIcon.innerHTML  = '<polyline points="20 6 9 17 4 12"/>';
      btnVerif.onclick = function () {
        showToast('🎉 Jogo finalizado!', 'var(--gold)');
      };
    }
  }

  /* ══════════════════════════════════════════════════════
     BOTÕES FOOTER
  ══════════════════════════════════════════════════════ */

  btnVoltar.addEventListener('click', function () {
    if (currentRound === 0) { showToast('Já estás na primeira rodada', '#ff8080'); return; }
    currentRound--;
    renderRound(loadValidRound(currentRound));
  });

  btnReset.addEventListener('click', function () {
    if (verified) { showToast('Já verificado — avance ou volte para outra rodada', '#ff8080'); return; }

    /* Devolve todos os cards que estão nas zonas de volta ao pool */
    matchGrid.querySelectorAll('.drop-zone').forEach(function (zone) {
      const card = zone.querySelector('.a-card');
      if (card) {
        detachCard(card);
        card.classList.add('in-pool');
        poolGrid.appendChild(card);
      }
      zone.classList.remove('filled', 'drag-over', 'drag-over-swap', 'droppable', 'correct', 'wrong');
      zone.title = '';
      const hint = zone.querySelector('.drop-hint');
      if (hint) hint.style.display = '';
      const ca = zone.querySelector('.correct-answer');
      if (ca) ca.remove();
    });

    clearRound(currentRound);
    updateCount();
    showToast('Rodada reiniciada');
  });

  /* ══════════════════════════════════════════════════════
     CSS DINÂMICO para pool em drag-over
  ══════════════════════════════════════════════════════ */

  (function injectPoolDragStyle() {
    const style = document.createElement('style');
    style.textContent =
      '#pool-grid.drag-over-pool {' +
        'outline: 2px dashed rgba(0,229,200,0.45);' +
        'outline-offset: 4px;' +
        'background: rgba(0,229,200,0.04);' +
        'border-radius: 10px;' +
      '}' +
      /* Card dentro de zona: visual compacto integrado */
      '.drop-zone .a-card {' +
        'width: 100%; margin: 0;' +
        'background: transparent;' +
        'border: none;' +
        'padding: 0;' +
        'box-shadow: none;' +
        'cursor: grab;' +
      '}' +
      '.drop-zone.filled .a-card {' +
        'pointer-events: auto;' +
      '}' +
      /* Zona filled com card dentro: layout */
      '.drop-zone.filled {' +
        'justify-content: flex-start;' +
        'text-align: left;' +
        'cursor: default;' +
      '}' +
      /* Remove hover vermelho antigo — remoção só por lixeira/X/drag-out */
      '.drop-zone.filled:hover {' +
        'border-color: rgba(0,229,200,0.50);' +
        'background: rgba(0,229,200,0.09);' +
      '}' +
      '.drop-zone.filled:hover .drop-hint { color: var(--white); }' +
      /* Card em zona herda visual do pool mas integrado */
      '.drop-zone .a-card .a-text {' +
        'font-size: 12.5px;' +
        'font-weight: 400;' +
        'color: var(--white-dim);' +
        'line-height: 1.45;' +
      '}' +
      '.drop-zone .a-card:hover {' +
        'border: none;' +
        'box-shadow: none;' +
        'opacity: 1;' +
      '}' +
      /* Indicador de que pode ser arrastado */
      '.drop-zone .a-card .drag-icon {' +
        'color: var(--cyan);' +
        'opacity: 0.7;' +
      '}';
    document.head.appendChild(style);
  })();

  /* ══════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════ */

  /* Valida o estado salvo antes de usá-lo — descarta se corrompido */
  function loadValidRound(roundIndex) {
    const state = loadRound(roundIndex);
    if (!state) return null;
    /* Verifica se todos os IDs do round estão contabilizados */
    const start = roundIndex * ITEMS_PER_ROUND;
    const items = allItems.slice(start, start + ITEMS_PER_ROUND);
    const roundIds = new Set(items.map(function (x) { return x.id; }));
    const placedIds  = (state.placements || []).map(function (p) { return p.answerId; });
    const poolIds    = (state.poolOrder  || []);
    const allSaved   = new Set([...placedIds, ...poolIds]);
    /* Se algum ID da rodada não está em nenhum dos dois lados, o estado está inconsistente */
    const isValid = [...roundIds].every(function (id) { return allSaved.has(id); });
    if (!isValid) {
      console.warn('[associacao] Estado corrompido para rodada', roundIndex, '— descartando');
      clearRound(roundIndex);
      return null;
    }
    return state;
  }

  renderRound(loadValidRound(currentRound));

})();