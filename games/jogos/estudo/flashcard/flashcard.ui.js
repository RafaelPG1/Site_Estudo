/* ═══════════════════════════════════════════════════════════════════
   NEXUS STUDY — games/jogos/flashcard/flashcard.ui.js  (v1.0)

   Camada visual do flashcard: templates HTML, render, atualizações
   de UI, atalhos de teclado e desfazer.

   Responsabilidades:
   • Templates HTML (_tplCena, _tplFinal, _tplWrapper, _tplRevisaoConcluida)
   • Render e animação de cards (_renderCard, _animarEntradaCard)
   • Atualizações de UI (_atualizarUI, _atualizarDots, _atualizarResultadoVisual,
     _atualizarBotoesDiff, _atualizarBadgeDiff)
   • Atalhos de teclado (_registrarAtalhos, _removerAtalhos)
   • Desfazer / toast (_mostrarToastUndo)

   Este módulo NÃO tem estado próprio — recebe e opera sobre o objeto
   de estado e as callbacks de ação exportados por flashcard.js.
   Toda mutação de estado passa pelas callbacks; este módulo só lê.

   API exportada:
   • criarUI(estado, ações, constantes) → { render, atualizarUI,
       registrarAtalhos, removerAtalhos, mostrarToastUndo,
       criarWrapperEl }
═══════════════════════════════════════════════════════════════════ */


/* ── UTILITÁRIO ─────────────────────────────────────────────────── */

/**
 * Sanitiza HTML da resposta permitindo apenas tags seguras:
 * strong, em, br, code, ul, ol, li.
 * Bloqueia scripts, eventos inline e qualquer outra tag.
 */
function _sanitizarRespostaHtml(html) {
  const ALLOWED_TAGS = /^(strong|em|br|code|ul|ol|li)$/i;
  const tmp = document.createElement('div');
  tmp.innerHTML = html;

  function limpar(node) {
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      const child = node.childNodes[i];
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (!ALLOWED_TAGS.test(child.tagName)) {
          node.replaceChild(document.createTextNode(child.textContent), child);
        } else {
          while (child.attributes.length > 0) {
            child.removeAttribute(child.attributes[0].name);
          }
          limpar(child);
        }
      }
    }
  }

  limpar(tmp);
  return tmp.innerHTML;
}

/**
 * _esc(str) — escapa texto puro para injeção segura em atributos e conteúdo
 * de texto via innerHTML. Use para qualquer valor que deva ser tratado como
 * texto literal (perguntas, categorias, dicas, etc.).
 *
 * NÃO use _esc() no verso do card: o verso pode conter HTML intencional
 * (strong, em, code, ul/li…). Nesses casos use _sanitizarRespostaHtml()
 * que mantém uma allowlist segura de tags.
 */
function _esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


/* ═════════════════════════════════════════════════════════════════
   TEMPLATES HTML
   ═════════════════════════════════════════════════════════════════ */

function _tplCena(card, tagCls, estado, constantes) {
  const { ACERTOS_PARA_DOMINAR, MIN_TENTATIVAS_PENALIDADE } = constantes;
  const { discId, srPerfil } = estado;

  const perfil     = srPerfil(card.id);
  const tentativas = perfil.tentativas;
  const dominado   = perfil.dominado;

  const perguntaTxt  = card.frente ?? card.pergunta ?? '';
  const respostaTxt  = card.verso  ?? card.resposta ?? '';
  // Categoria resolvida pelo domínio (card.categoria) com fallback para discId.
  // O label de disciplina legível é responsabilidade do domínio, não da UI.
  const categoriaTxt = card.categoria ?? discId ?? '';

  const badgeViz = tentativas > 0
    ? `<div class="cards-viz-badge ${dominado ? 'viz-dominado' : ''}" aria-label="${tentativas} visualizações">
         <i class="fas fa-eye" aria-hidden="true"></i>
         <span>${tentativas}</span>
       </div>`
    : '';

  const badgeDom = dominado
    ? `<div class="cards-dominado-badge" title="Card dominado" aria-label="Card dominado">
         <i class="fas fa-star" aria-hidden="true"></i>
       </div>`
    : '';

  let badgePenalidade = '';
  if (tentativas >= MIN_TENTATIVAS_PENALIDADE) {
    const taxaAcerto = tentativas > 0 ? perfil.acertos / tentativas : 1.0;
    const pct        = Math.round(taxaAcerto * 100);

    if (taxaAcerto < 0.40) {
      badgePenalidade = `
        <div class="cards-penalidade-badge" role="img" aria-label="Card difícil: ${pct}% de acerto">
          <i class="fas fa-triangle-exclamation" aria-hidden="true"></i>
          <div class="cards-tooltip" role="tooltip">
            <div class="cards-tooltip-title" style="color:#f87171;">
              <i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Card difícil pra você
            </div>
            <div class="cards-tooltip-body">
              Você acertou este card só <strong style="color:#f87171">${pct}%</strong> das vezes.<br>
              Por isso ele aparece <strong>com mais frequência</strong>.
            </div>
          </div>
        </div>`;
    } else if (taxaAcerto < 0.60) {
      badgePenalidade = `
        <div class="cards-penalidade-badge penalidade-leve" role="img" aria-label="Reforço automático: ${pct}% de acerto">
          <i class="fas fa-circle-exclamation" aria-hidden="true"></i>
          <div class="cards-tooltip" role="tooltip">
            <div class="cards-tooltip-title" style="color:#fbbf24;">
              <i class="fas fa-circle-exclamation" aria-hidden="true"></i> Reforço automático
            </div>
            <div class="cards-tooltip-body">
              Acertado em <strong style="color:#fbbf24">${pct}%</strong> das tentativas.<br>
              Aparece <strong>um pouco mais cedo</strong> pra reforçar.
            </div>
          </div>
        </div>`;
    }
  }

  const dicaHtml = card.dica
    ? `<div class="cards-dica-wrap">
         <button class="cards-dica-btn" type="button" aria-label="Ver dica" aria-expanded="false" data-dica-btn>
           <i class="fas fa-lightbulb" aria-hidden="true"></i>
           <span class="cards-dica-btn__label">Dica</span>
         </button>
         <div class="cards-dica cards-dica--oculta" data-dica-texto aria-live="polite">
           <i class="fas fa-lightbulb" aria-hidden="true"></i>
           ${_esc(card.dica)}
         </div>
       </div>`
    : '';

  return `
    <div class="cards-scene" id="cards-scene" role="button"
         tabindex="0" aria-label="Card: clique para virar">
      <div class="cards-flipper" id="cards-flipper">

        <!-- FRENTE -->
        <div class="cards-face cards-front" aria-hidden="false">
          ${badgeViz}
          ${badgeDom}
          <span class="cards-tag ${tagCls}" id="cards-tag-front">${_esc(categoriaTxt)}</span>
          <p class="cards-question" id="cards-question">${_esc(perguntaTxt)}</p>
          ${dicaHtml}
          <span class="cards-hint" id="cards-hint" aria-hidden="true">
            <i class="fas fa-hand-pointer" aria-hidden="true"></i> Clique para ver a resposta
          </span>
          <div class="cards-result-badge" id="cards-result-badge-front" aria-live="polite"></div>
        </div>

        <!-- VERSO -->
        <div class="cards-face cards-back" aria-hidden="true">
          <div class="cards-back-inner">
            <span class="cards-tag ${tagCls}" id="cards-tag-back">${_esc(categoriaTxt)}</span>
            <div class="cards-answer" id="cards-answer">${_sanitizarRespostaHtml(respostaTxt)}</div>

            <div class="cards-diff-badge-wrap" id="cards-diff-badge-wrap">
              <span class="cards-diff-badge" id="cards-diff-badge"></span>
            </div>

            <div class="cards-difficulty">
              <span class="cards-diff-label">Como foi pra você?</span>
              <button class="cards-diff-btn easy"   data-diff="easy"   type="button">Fácil <span class="cards-diff-kbd-hint">[1]</span></button>
              <button class="cards-diff-btn medium" data-diff="medium" type="button">Médio <span class="cards-diff-kbd-hint">[2]</span></button>
              <button class="cards-diff-btn hard"   data-diff="hard"   type="button">Difícil <span class="cards-diff-kbd-hint">[3]</span></button>
            </div>
          </div>
        </div>

      </div>
      ${badgePenalidade}
    </div>
  `;
}

function _tplFinal(estado, constantes) {
  const { ACERTOS_PARA_DOMINAR, MIN_TENTATIVAS_PENALIDADE } = constantes;
  const { discId, cards, stats, difficulty, modoRevisao, cardsRevisao, resultado, srPerfil, srEstatisticas } = estado;

  const total   = cards.length;
  const acertos = stats.correct;
  const erros   = stats.wrong;
  const pct     = total > 0 ? Math.round((acertos / total) * 100) : 0;

  const diffCount  = { easy: 0, medium: 0, hard: 0 };
  Object.values(difficulty).forEach(d => { if (d in diffCount) diffCount[d]++; });
  const diffLabels = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' };
  const diffHTML   = Object.entries(diffCount)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `<span class="finish-diff-item ${k}">${diffLabels[k]} ×${v}</span>`)
    .join('');

  const sr         = srEstatisticas(discId);
  const proximoTxt = sr.vencidos > 0
    ? `${sr.vencidos} card${sr.vencidos > 1 ? 's' : ''} para revisar`
    : sr.novos > 0
      ? `${sr.novos} card${sr.novos > 1 ? 's' : ''} novo${sr.novos > 1 ? 's' : ''} aguardando`
      : 'Em dia! Volte amanhã.';

  const dominadosNaSessao = cards.filter(c => srPerfil(c.id).dominado).length;
  const cardsPenalizados  = cards.filter(c => {
    const p = srPerfil(c.id);
    return p.tentativas >= MIN_TENTATIVAS_PENALIDADE && (p.acertos / p.tentativas) < 0.60;
  }).length;

  const msgDominados  = dominadosNaSessao > 0
    ? `<div class="finish-chip dominado"><i class="fas fa-star" aria-hidden="true"></i> ${dominadosNaSessao} dominado${dominadosNaSessao > 1 ? 's' : ''}</div>`
    : '';
  const msgPenalidade = cardsPenalizados > 0
    ? `<div class="finish-chip penalidade"><i class="fas fa-triangle-exclamation" aria-hidden="true"></i> ${cardsPenalizados} com revisão antecipada</div>`
    : '';

  const icon = pct >= 70 ? '🎯' : pct >= 50 ? '📊' : '📚';
  const msg  = pct >= 70 ? 'Ótimo desempenho!' : pct >= 50 ? 'Bom trabalho!' : 'Continue praticando!';

  const badgeRevisao = modoRevisao
    ? `<div class="finish-revisao-badge"><i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Revisão de erros</div>`
    : '';

  const cardsAindaComErro = modoRevisao
    ? (cardsRevisao ?? []).filter(card => {
        const p = srPerfil(card.id);
        return p.erros > 0 && p.acertosConsecutivos === 0;
      }).length
    : 0;

  const restartLabel = modoRevisao
    ? `<i class="fas fa-rotate-left" aria-hidden="true"></i> Repetir revisão${cardsAindaComErro > 0 ? ` <span class="finish-restart-count">${cardsAindaComErro}</span>` : ''}`
    : `<i class="fas fa-rotate-left" aria-hidden="true"></i> Novo deck`;

  return `
    <div class="cards-finish-scene">
      <div class="cards-finish-card${modoRevisao ? ' cards-finish-card--revisao' : ''}">
        <div>
          ${badgeRevisao}
          <span class="finish-icon" aria-hidden="true">${icon}</span>
          <div class="finish-title">Deck concluído!</div>
          <div class="finish-subtitle">${msg}</div>
        </div>

        <div class="finish-stats">
          <div class="finish-chip correct"><i class="fas fa-check" aria-hidden="true"></i> ${acertos} acerto${acertos !== 1 ? 's' : ''}</div>
          <div class="finish-chip wrong"><i class="fas fa-xmark" aria-hidden="true"></i> ${erros} erro${erros !== 1 ? 's' : ''}</div>
          <div class="finish-chip total">${pct}% de aproveitamento</div>
          ${msgDominados}
          ${msgPenalidade}
        </div>

        ${diffHTML ? `
        <div class="finish-diff-section">
          <span class="finish-diff-label">Dificuldade por card</span>
          <div class="finish-diff-row">${diffHTML}</div>
        </div>` : ''}

        <div class="finish-sr-status">
          <i class="fas fa-brain" aria-hidden="true"></i>
          <span>${sr.dominados} de ${sr.total} cards dominados</span>
          <span class="finish-sr-next">${proximoTxt}</span>
        </div>

        <div class="finish-progress-section">
          <div class="finish-progress-label">
            <i class="fas fa-chart-line" aria-hidden="true"></i>
            Progresso por card
          </div>
          <div class="finish-progress-list">
            ${cards.map(card => {
              const p      = srPerfil(card.id);
              const pctBar = p.dominado ? 100 : Math.min(Math.round((p.acertosConsecutivos / ACERTOS_PARA_DOMINAR) * 100), 99);
              const cls    = p.dominado ? 'prog-dominado' : pctBar >= 66 ? 'prog-quase' : pctBar >= 33 ? 'prog-meio' : 'prog-inicio';
              const resStr = resultado[card.id] === 'correct' ? 'correct' : resultado[card.id] === 'wrong' ? 'wrong' : '';
              const iconRes = resStr === 'correct'
                ? '<i class="fas fa-check prog-icon-correct" aria-hidden="true"></i>'
                : resStr === 'wrong'
                  ? '<i class="fas fa-xmark prog-icon-wrong" aria-hidden="true"></i>'
                  : '';
              const pergunta      = _esc((card.frente ?? card.pergunta ?? '').slice(0, 48)) + ((card.frente ?? card.pergunta ?? '').length > 48 ? '…' : '');
              const dominadoBadge = p.dominado
                ? '<span class="prog-star" title="Dominado" aria-label="Card dominado"><i class="fas fa-star"></i></span>'
                : '';
              return `
                <div class="finish-prog-row">
                  <div class="finish-prog-meta">
                    ${iconRes}
                    <span class="finish-prog-text">${pergunta}</span>
                    ${dominadoBadge}
                  </div>
                  <div class="finish-prog-bar-bg" title="${p.acertosConsecutivos} de ${ACERTOS_PARA_DOMINAR} acertos consecutivos">
                    <div class="finish-prog-bar-fill ${cls}" style="width:${pctBar}%"></div>
                  </div>
                  <span class="finish-prog-pct">${p.dominado ? '✓' : `${p.acertosConsecutivos}/${ACERTOS_PARA_DOMINAR}`}</span>
                </div>`;
            }).join('')}
          </div>
        </div>

        <button class="finish-restart-btn${modoRevisao ? ' finish-restart-btn--revisao' : ''}" id="cards-finish-restart" type="button">
          ${restartLabel}
        </button>
      </div>
    </div>
  `;
}

function _tplWrapper(discId, cards, modoRevisao) {
  const bannerRevisao = modoRevisao ? `
    <div class="cards-revisao-banner" role="alert" aria-label="Modo revisão de erros ativo">
      <i class="fas fa-triangle-exclamation" aria-hidden="true"></i>
      <span class="cards-revisao-banner__label">Revisão de erros</span>
      <span class="cards-revisao-banner__count">${cards.length} card${cards.length !== 1 ? 's' : ''}</span>
    </div>` : '';

  return `
    ${bannerRevisao}
    <div class="cards-game-header${modoRevisao ? ' cards-game-header--revisao' : ''}">
      <div class="cards-game-header__left">
        <div class="cards-stats">
          <div class="cards-stat-chip correct" aria-label="Acertos">
            <div class="cards-stat-dot" aria-hidden="true"></div>
            <span id="cards-stat-correct">0 acertos</span>
          </div>
          <div class="cards-stat-chip wrong" aria-label="Erros">
            <div class="cards-stat-dot" aria-hidden="true"></div>
            <span id="cards-stat-wrong">0 erros</span>
          </div>
        </div>
      </div>
      <div class="cards-game-header__right">
        <div class="cards-actions">
          <button class="cards-ctrl-btn" id="cards-btn-undo" title="Desfazer (Z)" type="button" aria-label="Desfazer">
            <i class="fas fa-rotate-left" aria-hidden="true"></i>
          </button>
          <button class="cards-ctrl-btn" id="cards-btn-shuffle" title="Embaralhar" type="button" aria-label="Embaralhar">
            <i class="fas fa-shuffle" aria-hidden="true"></i>
          </button>
          <button class="cards-ctrl-btn cards-ctrl-btn--kbd" id="cards-btn-kbd" title="Atalhos" type="button" aria-label="Atalhos de teclado" aria-expanded="false">
            <i class="fas fa-keyboard" aria-hidden="true"></i>
          </button>
          <button class="cards-ctrl-btn cards-ctrl-btn--inicio" id="cards-btn-inicio" title="Voltar ao início" type="button" aria-label="Voltar ao início">
            <i class="fas fa-house" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="cards-progress-wrap">
      <div class="cards-progress-top">
        <span class="cards-progress-label" id="cards-progress-label">0 de ${cards.length} respondidos</span>
        <span class="cards-progress-counter" id="cards-nav-counter">1 / ${cards.length}</span>
      </div>
      <div class="cards-progress-bar-bg" role="progressbar"
           aria-valuemin="0" aria-valuemax="${cards.length}" aria-valuenow="0">
        <div class="cards-progress-bar-fill" id="cards-progress-fill" style="width:0%"></div>
      </div>
      <div class="cards-dots-row" id="cards-dots-row" role="tablist" aria-label="Navegação por card"></div>
    </div>

    <div id="cards-scene-wrap"></div>

    <div class="cards-bottom" id="cards-bottom">
      <div class="cards-result-btns">
        <button class="cards-result-btn cards-btn-wrong" id="cards-btn-wrong" type="button" aria-label="Errei [E]">
          <span class="btn-icon-wrap" aria-hidden="true">
            <i class="fas fa-xmark"></i>
          </span>
          <span class="btn-label">Errei <span class="cards-diff-kbd-hint">[E]</span></span>
        </button>
        <button class="cards-result-btn cards-btn-right" id="cards-btn-right" type="button" aria-label="Acertei [A]">
          <span class="btn-icon-wrap" aria-hidden="true">
            <i class="fas fa-check"></i>
          </span>
          <span class="btn-label">Acertei <span class="cards-diff-kbd-hint">[A]</span></span>
        </button>
      </div>
      <div class="cards-nav">
        <button class="cards-nav-btn" id="cards-btn-prev" type="button">
          <i class="fas fa-chevron-left" aria-hidden="true"></i> Anterior
        </button>
        <div class="cards-nav-counter" id="cards-nav-pos" aria-live="polite">1 / ${cards.length}</div>
        <button class="cards-nav-btn" id="cards-btn-next" type="button">
          Próximo <i class="fas fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <div class="cards-kbd-panel" id="cards-kbd-panel" hidden aria-label="Atalhos de teclado">
      <div class="kbd-panel-inner">
        <div class="kbd-panel-title"><i class="fas fa-keyboard" aria-hidden="true"></i> Atalhos de teclado</div>
        <div class="kbd-grid">
          <div class="kbd-row"><kbd>Espaço</kbd><span>Virar card</span></div>
          <div class="kbd-row"><kbd>A</kbd><span>Acertei</span></div>
          <div class="kbd-row"><kbd>E</kbd><span>Errei</span></div>
          <div class="kbd-row"><kbd>Z</kbd><span>Desfazer</span></div>
          <div class="kbd-row"><kbd>→</kbd><span>Próximo</span></div>
          <div class="kbd-row"><kbd>←</kbd><span>Anterior</span></div>
          <div class="kbd-row"><kbd>1</kbd><span>Fácil</span></div>
          <div class="kbd-row"><kbd>2</kbd><span>Médio</span></div>
          <div class="kbd-row"><kbd>3</kbd><span>Difícil</span></div>
        </div>
      </div>
    </div>
  `;
}

function _tplRevisaoConcluida() {
  return `
    <div class="cards-finish-scene">
      <div class="cards-finish-card cards-finish-card--revisao cards-finish-card--zerada">
        <div class="finish-revisao-badge">
          <i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Revisão de erros
        </div>
        <span class="finish-icon" aria-hidden="true">🏆</span>
        <div class="finish-title">Revisão concluída!</div>
        <div class="finish-subtitle">Você zerou todos os erros desta sessão</div>

        <div class="finish-stats">
          <div class="finish-chip correct">
            <i class="fas fa-check" aria-hidden="true"></i> Nenhum card pendente
          </div>
        </div>

        <div class="finish-sr-status" style="max-width:320px">
          <i class="fas fa-star" aria-hidden="true"></i>
          <span>Todos os cards foram superados</span>
          <span class="finish-sr-next">Continue praticando no deck normal</span>
        </div>

        <button class="finish-restart-btn finish-restart-btn--revisao" id="revisao-concluida-voltar" type="button">
          <i class="fas fa-house" aria-hidden="true"></i> Voltar ao início
        </button>
      </div>
    </div>
  `;
}


/* ═════════════════════════════════════════════════════════════════
   FACTORY PRINCIPAL — criarUI()
   ═════════════════════════════════════════════════════════════════ */

/**
 * Cria e retorna a API de UI para uma sessão de flashcards.
 *
 * @param {object} estado      - Referência ao objeto de estado (lida a cada call).
 * @param {object} ações       - Callbacks de domínio: { flipCard, marcar,
 *                               marcarDificuldade, proximo, anterior,
 *                               embaralhar, desfazer, voltarParaIntro,
 *                               reiniciar, limparSessao }
 * @param {object} constantes  - { DISC_LABEL, ACERTOS_PARA_DOMINAR,
 *                               MIN_TENTATIVAS_PENALIDADE }
 * @returns {object} API de UI
 */
export function criarUI(estado, ações, constantes) {

  /* ── ATALHOS DE TECLADO ─────────────────────────────────────── */

  let _keyHandlerFn = null;

  function registrarAtalhos() {
    removerAtalhos();

    _keyHandlerFn = e => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const { cards, current, flipped, marcando } = estado;
      if (!cards[current]) return;

      switch (e.key) {
        case ' ': case 'Spacebar':
          e.preventDefault(); ações.flipCard(); break;
        case 'ArrowRight': case 'ArrowDown':
          e.preventDefault(); ações.proximo(); break;
        case 'ArrowLeft': case 'ArrowUp':
          e.preventDefault(); ações.anterior(); break;
        case 'a': case 'A':
          if (!marcando && flipped) ações.marcar(true); break;
        case 'e': case 'E':
          if (!marcando && flipped) ações.marcar(false); break;
        case 'z': case 'Z':
          ações.desfazer(); break;
        case '1': if (flipped) ações.marcarDificuldade('easy');   break;
        case '2': if (flipped) ações.marcarDificuldade('medium'); break;
        case '3': if (flipped) ações.marcarDificuldade('hard');   break;
      }
    };

    document.addEventListener('keydown', _keyHandlerFn);
  }

  function removerAtalhos() {
    if (_keyHandlerFn) {
      document.removeEventListener('keydown', _keyHandlerFn);
      _keyHandlerFn = null;
    }
  }

  /* ── TOAST DE DESFAZER ──────────────────────────────────────── */

  function mostrarToastUndo() {
    const panelEl = estado.panelEl;
    if (!panelEl) return;

    let toast = panelEl.querySelector('.cards-undo-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'cards-undo-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = '<i class="fas fa-rotate-left" aria-hidden="true"></i> Resposta desfeita';
      panelEl.appendChild(toast);
    }

    toast.classList.remove('undo-toast-visible');
    void toast.offsetWidth;
    toast.classList.add('undo-toast-visible');
  }

  /* ── ATUALIZAÇÕES DE UI ─────────────────────────────────────── */

  function atualizarResultadoVisual(cardId) {
    const { panelEl, resultado } = estado;
    const res        = resultado[cardId];
    const badgeFront = panelEl.querySelector('#cards-result-badge-front');
    const scene      = panelEl.querySelector('#cards-scene');
    const btnWrong   = panelEl.querySelector('#cards-btn-wrong');
    const btnRight   = panelEl.querySelector('#cards-btn-right');
    const hint       = panelEl.querySelector('#cards-hint');

    scene?.classList.remove('card-answered-correct', 'card-answered-wrong');

    if (res === 'correct') {
      if (badgeFront) { badgeFront.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Acertei'; badgeFront.className = 'cards-result-badge result-correct'; badgeFront.style.display = 'flex'; }
      scene?.classList.add('card-answered-correct');
      if (hint) hint.style.opacity = '0.35';
      btnWrong?.classList.remove('btn-selected-wrong');
      btnRight?.classList.add('btn-selected-right');

    } else if (res === 'wrong') {
      if (badgeFront) { badgeFront.innerHTML = '<i class="fas fa-xmark" aria-hidden="true"></i> Errei'; badgeFront.className = 'cards-result-badge result-wrong'; badgeFront.style.display = 'flex'; }
      scene?.classList.add('card-answered-wrong');
      if (hint) hint.style.opacity = '0.35';
      btnRight?.classList.remove('btn-selected-right');
      btnWrong?.classList.add('btn-selected-wrong');

    } else {
      if (badgeFront) badgeFront.style.display = 'none';
      if (hint) hint.style.opacity = '';
      btnWrong?.classList.remove('btn-selected-wrong');
      btnRight?.classList.remove('btn-selected-right');
    }
  }

  function atualizarBotoesDiff(cardId) {
    const saved = estado.difficulty[cardId];
    estado.panelEl.querySelectorAll('.cards-diff-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.diff === saved);
    });
  }

  function atualizarBadgeDiff(cardId) {
    const saved = estado.difficulty[cardId];
    const badge = estado.panelEl.querySelector('#cards-diff-badge');
    const wrap  = estado.panelEl.querySelector('#cards-diff-badge-wrap');
    if (!badge || !wrap) return;

    if (saved) {
      const cfg = { easy: { label: 'Fácil', cls: 'badge-easy' }, medium: { label: 'Médio', cls: 'badge-medium' }, hard: { label: 'Difícil', cls: 'badge-hard' } };
      badge.textContent  = cfg[saved].label;
      badge.className    = `cards-diff-badge ${cfg[saved].cls}`;
      wrap.style.display = 'flex';
    } else {
      wrap.style.display = 'none';
    }
  }

  function atualizarDots() {
    const { cards, current, resultado, panelEl } = estado;
    const total   = cards.length;
    const dotsRow = panelEl.querySelector('#cards-dots-row');
    if (!dotsRow) return;

    const MAX_VISIBLE = 12;
    let start = 0, end = total;
    if (total > MAX_VISIBLE) {
      const half = Math.floor(MAX_VISIBLE / 2);
      start = Math.max(0, current - half);
      end   = start + MAX_VISIBLE;
      if (end > total) { end = total; start = end - MAX_VISIBLE; }
    }

    dotsRow.innerHTML = '';
    for (let i = start; i < end; i++) {
      const btn = document.createElement('button');
      btn.className = 'cards-dot';
      btn.type = 'button';
      btn.setAttribute('role', 'tab');

      const res = resultado[cards[i]?.id];
      if (i === current)          btn.classList.add('dot-active');
      else if (res === 'correct') btn.classList.add('dot-correct');
      else if (res === 'wrong')   btn.classList.add('dot-wrong');

      btn.title = `Card ${i + 1}`;
      btn.setAttribute('aria-label', `Card ${i + 1}${res ? ` — ${res === 'correct' ? 'acertado' : 'errado'}` : ''}`);
      btn.setAttribute('aria-selected', i === current ? 'true' : 'false');

      btn.addEventListener('click', () => {
        ações.irParaCard(i);
      });

      dotsRow.appendChild(btn);
    }
  }

  function atualizarUI() {
    const { cards, current, resultado, stats, panelEl, historico } = estado;
    const total       = cards.length;
    const respondidos = Object.keys(resultado).length;
    const pct         = total ? Math.round((respondidos / total) * 100) : 0;

    const q = id => panelEl.querySelector(id);

    const fill = q('#cards-progress-fill');
    if (fill) { fill.style.width = `${pct}%`; fill.closest('[role=progressbar]')?.setAttribute('aria-valuenow', respondidos); }

    const lbl = q('#cards-progress-label');
    if (lbl) lbl.textContent = `${respondidos} de ${total} respondidos`;

    const ctrTop = q('#cards-nav-counter');
    if (ctrTop) ctrTop.textContent = current >= total ? `Fim · ${total} cards` : `${current + 1} / ${total}`;

    const ctrNav = q('#cards-nav-pos');
    if (ctrNav) ctrNav.textContent = current >= total ? 'Fim' : `${current + 1} / ${total}`;

    const sc = q('#cards-stat-correct');
    if (sc) sc.textContent = `${stats.correct} acerto${stats.correct !== 1 ? 's' : ''}`;
    const sw = q('#cards-stat-wrong');
    if (sw) sw.textContent = `${stats.wrong} erro${stats.wrong !== 1 ? 's' : ''}`;

    const prev = q('#cards-btn-prev');
    if (prev) prev.disabled = current === 0;

    const cardAtual  = cards[current];
    const respondido = cardAtual ? !!resultado[cardAtual.id] : true;
    const next = q('#cards-btn-next');
    if (next) next.disabled = current >= total || !respondido;

    const undo = q('#cards-btn-undo');
    if (undo) undo.disabled = historico.length === 0;

    atualizarDots();
  }

  /* ── RENDER ─────────────────────────────────────────────────── */

  function animarEntradaCard(sceneWrap, direcao = 'next') {
    const cena = sceneWrap.querySelector('#cards-scene');
    if (!cena) return;
    const cls = direcao === 'next' ? 'card-enter-next' : 'card-enter-prev';
    cena.classList.add(cls);
    cena.addEventListener('animationend', () => cena.classList.remove(cls), { once: true });
  }

  function renderCard(direcaoAnimacao = 'next') {
    const { cards, current, discId, panelEl, resultado } = estado;

    const todosRespondidos = cards.length > 0 && cards.every(c => resultado[c.id]);
    const isUltimo        = current >= cards.length && todosRespondidos;

    const wrap   = panelEl.querySelector('#cards-scene-wrap');
    const bottom = panelEl.querySelector('#cards-bottom');
    const tagCls = 'tag-disc';

    if (isUltimo && todosRespondidos) {
      wrap.innerHTML       = _tplFinal(estado, constantes);
      bottom.style.display = 'none';
      // Sessão concluída — limpa para não restaurar na próxima visita.
      ações.limparSessao();
      panelEl.querySelector('#cards-finish-restart')?.addEventListener('click', ações.reiniciar);
      atualizarUI();
      return;
    }

    if (current >= cards.length) {
      const primeiro = cards.findIndex(c => !resultado[c.id]);
      // Delega ao domínio — UI não deve mutar estado.current diretamente.
      ações.irParaCard(primeiro >= 0 ? primeiro : cards.length - 1);
      return;
    }

    bottom.style.display = '';
    const card = cards[estado.current];
    wrap.innerHTML = _tplCena(card, tagCls, estado, constantes);

    animarEntradaCard(wrap, direcaoAnimacao);

    wrap.querySelector('#cards-scene').addEventListener('click', ações.flipCard);
    wrap.querySelector('#cards-scene').addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ações.flipCard(); }
    });

    wrap.querySelectorAll('.cards-diff-btn').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); ações.marcarDificuldade(btn.dataset.diff); });
    });

    wrap.querySelectorAll('.cards-penalidade-badge').forEach(badge => {
      const tip = badge.querySelector('.cards-tooltip');
      badge.addEventListener('mouseenter', () => tip?.classList.add('tooltip-visible'));
      badge.addEventListener('mouseleave', () => tip?.classList.remove('tooltip-visible'));
      // Suporte touch: toggle ao tocar (mobile).
      badge.addEventListener('touchend', e => {
        e.stopPropagation();
        const visivel = tip?.classList.toggle('tooltip-visible');
        // Fecha ao tocar em qualquer outro lugar.
        if (visivel) {
          const fecharTip = ev => {
            if (!badge.contains(ev.target)) {
              tip?.classList.remove('tooltip-visible');
              document.removeEventListener('touchend', fecharTip);
            }
          };
          document.addEventListener('touchend', fecharTip);
        }
      });
      badge.addEventListener('click', e => e.stopPropagation());
    });

    const dicaBtn = wrap.querySelector('[data-dica-btn]');
    const dicaTxt = wrap.querySelector('[data-dica-texto]');
    if (dicaBtn && dicaTxt) {
      dicaBtn.addEventListener('click', e => {
        e.stopPropagation();
        const aberta = dicaTxt.classList.toggle('cards-dica--visivel');
        dicaTxt.classList.toggle('cards-dica--oculta', !aberta);
        dicaBtn.classList.toggle('cards-dica-btn--ativa', aberta);
        dicaBtn.setAttribute('aria-expanded', String(aberta));
      });
    }

    estado.flipped = false;
    atualizarBotoesDiff(card.id);
    atualizarBadgeDiff(card.id);
    atualizarResultadoVisual(card.id);
    atualizarUI();
  }

  /* ── WRAPPER DO JOGO ────────────────────────────────────────── */

  /**
   * Cria o elemento wrapper do jogo, injeta o HTML e registra todos
   * os event listeners dos controles.
   *
   * @param {string}   discId
   * @param {object[]} cards
   * @returns {HTMLElement}
   */
  function criarWrapperEl(discId, cards) {
    const wrap = document.createElement('div');
    wrap.className    = 'panel-cards';
    wrap.dataset.disc = discId;
    if (estado.modoRevisao) wrap.dataset.revisao = 'true';
    wrap.innerHTML = _tplWrapper(discId, cards, estado.modoRevisao);

    document.body.classList.toggle('modo-revisao', !!estado.modoRevisao);

    wrap.querySelector('#cards-btn-wrong')  ?.addEventListener('click', () => ações.marcar(false));
    wrap.querySelector('#cards-btn-right')  ?.addEventListener('click', () => ações.marcar(true));
    wrap.querySelector('#cards-btn-prev')   ?.addEventListener('click', ações.anterior);
    wrap.querySelector('#cards-btn-next')   ?.addEventListener('click', ações.proximo);
    wrap.querySelector('#cards-btn-shuffle')?.addEventListener('click', ações.embaralhar);
    wrap.querySelector('#cards-btn-undo')   ?.addEventListener('click', ações.desfazer);
    wrap.querySelector('#cards-btn-inicio') ?.addEventListener('click', ações.voltarParaIntro);

    wrap.querySelector('#cards-btn-kbd')?.addEventListener('click', () => {
      const kbdPanel = wrap.querySelector('#cards-kbd-panel');
      const kbdBtn   = wrap.querySelector('#cards-btn-kbd');
      const aberto   = !kbdPanel.hidden;
      kbdPanel.hidden = aberto;
      kbdBtn.classList.toggle('active', !aberto);
      kbdBtn.setAttribute('aria-expanded', String(!aberto));
    });

    return wrap;
  }

  /* ── TELA DE REVISÃO CONCLUÍDA ──────────────────────────────── */

  function renderRevisaoConcluida(onVoltar) {
    const panelEl = estado.panelEl;
    panelEl.querySelector('.panel-cards')?.remove();
    const wrap = document.createElement('div');
    wrap.className = 'panel-cards';
    wrap.dataset.disc = estado.discId;
    wrap.dataset.revisao = 'true';
    wrap.innerHTML = _tplRevisaoConcluida();
    panelEl.appendChild(wrap);
    wrap.querySelector('#revisao-concluida-voltar')?.addEventListener('click', onVoltar);
  }

  /* ── API PÚBLICA DA UI ──────────────────────────────────────── */
  return {
    render:               renderCard,
    atualizarUI,
    atualizarResultadoVisual,
    atualizarBotoesDiff,
    atualizarBadgeDiff,
    registrarAtalhos,
    removerAtalhos,
    mostrarToastUndo,
    criarWrapperEl,
    renderRevisaoConcluida,
  };
}