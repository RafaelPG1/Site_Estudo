/* ═══════════════════════════════════════════════════════════════════
   NEXUS STUDY — games/jogos/flashcard/flashcard.js  (v3.3)

   Seções:
     1. IMPORTS & CONSTANTES
     2. ENGINE DE SPACED REPETITION (SRS)
     3. ESTADO DA SESSÃO
     4. ATALHOS DE TECLADO
     5. DESFAZER (UNDO)
     6. TEMPLATES HTML
     7. RENDER
     8. ATUALIZAÇÕES DE UI
     9. AÇÕES DO USUÁRIO
    10. API PÚBLICA  →  initCards / destroyCards
═══════════════════════════════════════════════════════════════════ */

/* ── 1. IMPORTS & CONSTANTES ──────────────────────────────────── */

import { getCardsData }                      from '../../../content/game/flashcards/cards_data.js';
import { carregarPerfisSRS, salvarPerfilSRS } from './storage.js';
import { Shell, lerParams }                  from '../../template/game-shell.js';
import { getUsuario }                        from '../../../src/global.js';

import { DISC_CORES }             from '../../../shared/js/cores.js';
import { aplicarCoresDisciplina } from '../../../shared/js/theme.js';

// Rótulos legíveis por disciplina
const DISC_LABEL = {
  design:      'Design',
  banco_dados: 'Banco de Dados',
  redes:       'Redes',
  poo:         'POO',
};

const DECK_SIZE                 = 10;
const ACERTOS_PARA_DOMINAR      = 5;
const MIN_TENTATIVAS_PENALIDADE = 4;

/* ═════════════════════════════════════════════════════════════════
   2. ENGINE DE SPACED REPETITION (SRS)
   Todas as funções SRS usam _estado.cardsData — nunca uma variável
   global — para garantir isolamento por semestre.
   ═════════════════════════════════════════════════════════════════ */

let _srCache = {};

function _srPerfil(cardId) {
  return _srCache[cardId] ?? {
    intervalo:           1,
    proximaVez:          0,
    acertos:             0,
    erros:               0,
    diffMarcada:         null,
    tentativas:          0,
    acertosConsecutivos: 0,
    dominado:            false,
  };
}

async function _srAtualizar(cardId, acertou, diffMarcada) {
  const p = { ..._srPerfil(cardId) };

  p.tentativas++;

  if (acertou) {
    const multBase = { easy: 2.5, medium: 2.0, hard: 1.5 }[diffMarcada] ?? 2.0;

    let fatorConfianca = 1.0;
    const tentativasAnteriores = p.tentativas - 1;
    if (tentativasAnteriores >= MIN_TENTATIVAS_PENALIDADE) {
      const taxaAcerto = tentativasAnteriores > 0 ? p.acertos / tentativasAnteriores : 1.0;
      if (taxaAcerto < 0.40) fatorConfianca = 0.75;
      else if (taxaAcerto < 0.60) fatorConfianca = 0.85;
    }

    p.intervalo           = Math.min(Math.round(p.intervalo * multBase * fatorConfianca), 60);
    p.acertos            += 1;
    p.acertosConsecutivos += 1;

    if (p.acertosConsecutivos >= ACERTOS_PARA_DOMINAR) p.dominado = true;

  } else {
    p.intervalo           = 1;
    p.erros              += 1;
    p.acertosConsecutivos = 0;
    p.dominado            = false;
  }

  p.proximaVez  = Date.now() + p.intervalo * 24 * 60 * 60 * 1000;
  p.diffMarcada = diffMarcada || p.diffMarcada;

  _srCache[cardId] = p;

  try {
    const uid = typeof _estado.nomeUsuario === 'object'
      ? _estado.nomeUsuario.uid
      : _estado.nomeUsuario;
    await salvarPerfilSRS(uid, cardId, p, _estado.discId, _estado.semestre);
  } catch (err) {
    console.error('[flashcard.js] Erro ao salvar SRS:', err);
  }
}

function _srMontarDeck(discId) {
  // Usa _estado.cardsData — isolado por semestre
  const todos = _estado.cardsData[discId] || [];
  const agora = Date.now();

  const vencidos  = [];
  const novos     = [];
  const cedo      = [];
  const dominados = [];

  todos.forEach(card => {
    const p     = _srPerfil(card.id);
    const visto = p.tentativas > 0;

    if (p.dominado)                 dominados.push({ card, p });
    else if (!visto)                novos.push({ card, p });
    else if (p.proximaVez <= agora) vencidos.push({ card, p });
    else                            cedo.push({ card, p });
  });

  vencidos.sort((a, b) =>
    b.p.erros !== a.p.erros           ? b.p.erros - a.p.erros :
    b.p.tentativas !== a.p.tentativas ? b.p.tentativas - a.p.tentativas :
    a.p.proximaVez - b.p.proximaVez
  );

  cedo.sort((a, b) => a.p.proximaVez - b.p.proximaVez);
  dominados.sort((a, b) => a.p.proximaVez - b.p.proximaVez);

  const selecionados = [];
  const add = lista => {
    for (const item of lista) {
      if (selecionados.length >= DECK_SIZE) break;
      selecionados.push(item.card);
    }
  };

  add(vencidos);
  add(novos);
  add(cedo);
  add(dominados);

  return _shuffle(selecionados);
}

function _srEstatisticas(discId) {
  // Usa _estado.cardsData — isolado por semestre
  const todos = _estado.cardsData[discId] || [];
  const agora = Date.now();
  let dominados = 0, vencidos = 0, novos = 0;

  todos.forEach(card => {
    const p     = _srPerfil(card.id);
    const visto = p.tentativas > 0;

    if (!visto)                                  novos++;
    else if (p.dominado || p.proximaVez > agora) dominados++;
    else                                         vencidos++;
  });

  return { total: todos.length, dominados, vencidos, novos };
}

/* ═════════════════════════════════════════════════════════════════
   3. ESTADO DA SESSÃO
   ═════════════════════════════════════════════════════════════════ */

const ESTADO_INICIAL = () => ({
  discId:      null,
  semestre:    null,
  nomeUsuario: null,
  cardsData:   {},   // mapa { discId: cards[] } do semestre atual
  cards:       [],
  current:     0,
  flipped:     false,
  marcando:    false,
  stats:       { correct: 0, wrong: 0 },
  difficulty:  {},
  resultado:   {},
  historico:   [],
  panelEl:     null,
});

let _estado = ESTADO_INICIAL();

function _shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Salva apenas IDs dos cards (não os objetos completos) para evitar
// mismatch ao restaurar a sessão após F5
function _salvarSessao() {
  window.flashcardSessao?.salvar({
    ..._estado,
    cards:     _estado.cards.map(c => c.id),
    cardsData: undefined, // não serializa o mapa completo — é grande e desnecessário
    panelEl:   undefined, // não serializa o DOM
    historico: undefined, // historico tem objetos SRS — descarta ao salvar
  });
}

function _limparSessao() { window.flashcardSessao?.limpar(_estado.discId); }

/* ═════════════════════════════════════════════════════════════════
   4. ATALHOS DE TECLADO
   ═════════════════════════════════════════════════════════════════ */

let _keyHandlerFn = null;

function _registrarAtalhos() {
  _removerAtalhos();

  _keyHandlerFn = e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    const { cards, current, flipped, marcando } = _estado;
    if (!cards[current]) return;

    switch (e.key) {
      case ' ': case 'Spacebar':
        e.preventDefault(); _flipCard(); break;
      case 'ArrowRight': case 'ArrowDown':
        e.preventDefault(); _proximo(); break;
      case 'ArrowLeft': case 'ArrowUp':
        e.preventDefault(); _anterior(); break;
      case 'a': case 'A':
        if (!marcando) _marcar(true); break;
      case 'e': case 'E':
        if (!marcando) _marcar(false); break;
      case 'z': case 'Z':
        _desfazer(); break;
      case '1': if (flipped) _marcarDificuldade('easy');   break;
      case '2': if (flipped) _marcarDificuldade('medium'); break;
      case '3': if (flipped) _marcarDificuldade('hard');   break;
    }
  };

  document.addEventListener('keydown', _keyHandlerFn);
}

function _removerAtalhos() {
  if (_keyHandlerFn) {
    document.removeEventListener('keydown', _keyHandlerFn);
    _keyHandlerFn = null;
  }
}

/* ═════════════════════════════════════════════════════════════════
   5. DESFAZER (UNDO)
   ═════════════════════════════════════════════════════════════════ */

function _desfazer() {
  if (_estado.historico.length === 0) return;

  const snapshot = _estado.historico.pop();

  _estado.current    = snapshot.current;
  _estado.stats      = { ...snapshot.stats };
  _estado.resultado  = { ...snapshot.resultado };
  _estado.difficulty = { ...snapshot.difficulty };
  _estado.flipped    = false;
  _estado.marcando   = false;

  if (snapshot.srPerfilAnterior) {
    _srCache[snapshot.srPerfilAnterior.cardId] = snapshot.srPerfilAnterior.perfil;
  }

  _salvarSessao();
  _renderCard();
  _mostrarToastUndo();
}

function _mostrarToastUndo() {
  const panelEl = _estado.panelEl;
  if (!panelEl) return;

  let toast = panelEl.querySelector('.cards-undo-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'cards-undo-toast';
    toast.innerHTML = '<i class="fas fa-rotate-left" aria-hidden="true"></i> Resposta desfeita';
    panelEl.appendChild(toast);
  }

  toast.classList.remove('undo-toast-visible');
  void toast.offsetWidth;
  toast.classList.add('undo-toast-visible');
}

/* ═════════════════════════════════════════════════════════════════
   6. TEMPLATES HTML
   ═════════════════════════════════════════════════════════════════ */

function _esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function _tplCena(card, tagCls) {
  const perfil     = _srPerfil(card.id);
  const tentativas = perfil.tentativas;
  const dominado   = perfil.dominado;

  const perguntaTxt  = card.frente ?? card.pergunta ?? '';
  const respostaTxt  = card.verso  ?? card.resposta ?? '';
  const categoriaTxt = card.categoria ?? DISC_LABEL[_estado.discId] ?? _estado.discId ?? '';

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
    ? `<div class="cards-dica" aria-label="Dica">
         <i class="fas fa-lightbulb" aria-hidden="true"></i>
         ${_esc(card.dica)}
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
            <div class="cards-answer" id="cards-answer">${respostaTxt}</div>

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

function _tplFinal() {
  const { discId, cards, stats, difficulty } = _estado;
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

  const sr         = _srEstatisticas(discId);
  const proximoTxt = sr.vencidos > 0
    ? `${sr.vencidos} card${sr.vencidos > 1 ? 's' : ''} para revisar`
    : sr.novos > 0
      ? `${sr.novos} card${sr.novos > 1 ? 's' : ''} novo${sr.novos > 1 ? 's' : ''} aguardando`
      : 'Em dia! Volte amanhã.';

  const dominadosNaSessao = cards.filter(c => _srPerfil(c.id).dominado).length;
  const cardsPenalizados  = cards.filter(c => {
    const p = _srPerfil(c.id);
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

  return `
    <div class="cards-finish-scene">
      <div class="cards-finish-card">
        <div>
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

        <button class="finish-restart-btn" id="cards-finish-restart" type="button">
          <i class="fas fa-rotate-left" aria-hidden="true"></i> Novo deck
        </button>
      </div>
    </div>
  `;
}

function _tplWrapper(discId, cards) {
  const discLabel = DISC_LABEL[discId] ?? discId ?? '';
  const { semestre } = _estado;

  return `
    <div class="cards-game-header">
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

/* ═════════════════════════════════════════════════════════════════
   7. RENDER
   ═════════════════════════════════════════════════════════════════ */

function _animarEntradaCard(sceneWrap, direcao = 'next') {
  const cena = sceneWrap.querySelector('#cards-scene');
  if (!cena) return;
  const cls = direcao === 'next' ? 'card-enter-next' : 'card-enter-prev';
  cena.classList.add(cls);
  cena.addEventListener('animationend', () => cena.classList.remove(cls), { once: true });
}

function _renderCard(direcaoAnimacao = 'next') {
  const { cards, current, discId, panelEl, resultado } = _estado;

  const todosRespondidos = cards.length > 0 && cards.every(c => resultado[c.id]);
  const isUltimo        = current >= cards.length || (current === cards.length && todosRespondidos);

  const wrap   = panelEl.querySelector('#cards-scene-wrap');
  const bottom = panelEl.querySelector('#cards-bottom');
  const tagCls = 'tag-disc';

  if (isUltimo && todosRespondidos) {
    wrap.innerHTML       = _tplFinal();
    bottom.style.display = 'none';
    _limparSessao();
    panelEl.querySelector('#cards-finish-restart')?.addEventListener('click', _reiniciar);
    _atualizarUI();
    return;
  }

  if (current >= cards.length) {
    const primeiro = cards.findIndex(c => !resultado[c.id]);
    _estado.current = primeiro >= 0 ? primeiro : cards.length - 1;
  }

  bottom.style.display = '';
  const card = cards[_estado.current];
  wrap.innerHTML = _tplCena(card, tagCls);

  _animarEntradaCard(wrap, direcaoAnimacao);

  wrap.querySelector('#cards-scene').addEventListener('click', _flipCard);
  wrap.querySelector('#cards-scene').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _flipCard(); }
  });

  wrap.querySelectorAll('.cards-diff-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); _marcarDificuldade(btn.dataset.diff); });
  });

  wrap.querySelectorAll('.cards-penalidade-badge').forEach(badge => {
    const tip = badge.querySelector('.cards-tooltip');
    badge.addEventListener('mouseenter', () => tip?.classList.add('tooltip-visible'));
    badge.addEventListener('mouseleave', () => tip?.classList.remove('tooltip-visible'));
    badge.addEventListener('click', e => e.stopPropagation());
  });

  _estado.flipped = false;
  _atualizarBotoesDiff(card.id);
  _atualizarBadgeDiff(card.id);
  _atualizarResultadoVisual(card.id);
  _atualizarUI();
}

/* ═════════════════════════════════════════════════════════════════
   8. ATUALIZAÇÕES DE UI
   ═════════════════════════════════════════════════════════════════ */

function _atualizarResultadoVisual(cardId) {
  const { panelEl, resultado } = _estado;
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

function _atualizarBotoesDiff(cardId) {
  const saved = _estado.difficulty[cardId];
  _estado.panelEl.querySelectorAll('.cards-diff-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.diff === saved);
  });
}

function _atualizarBadgeDiff(cardId) {
  const saved = _estado.difficulty[cardId];
  const badge = _estado.panelEl.querySelector('#cards-diff-badge');
  const wrap  = _estado.panelEl.querySelector('#cards-diff-badge-wrap');
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

function _atualizarUI() {
  const { cards, current, resultado, stats, panelEl, historico } = _estado;
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

  _atualizarDots();
}

function _atualizarDots() {
  const { cards, current, resultado, panelEl } = _estado;
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
      const cardAlvo = cards[i];
      if (i > _estado.current && cardAlvo && !_estado.resultado[cardAlvo.id]) return;
      const dir = i > _estado.current ? 'next' : 'prev';
      _estado.current = i;
      _renderCard(dir);
    });

    dotsRow.appendChild(btn);
  }
}

/* ═════════════════════════════════════════════════════════════════
   9. AÇÕES DO USUÁRIO
   ═════════════════════════════════════════════════════════════════ */

function _flipCard() {
  _estado.flipped = !_estado.flipped;
  const flipper = _estado.panelEl.querySelector('#cards-flipper');
  const back    = _estado.panelEl.querySelector('.cards-back');
  const front   = _estado.panelEl.querySelector('.cards-front');
  flipper?.classList.toggle('flipped', _estado.flipped);
  if (front) front.setAttribute('aria-hidden', _estado.flipped ? 'true' : 'false');
  if (back)  back.setAttribute('aria-hidden',  _estado.flipped ? 'false' : 'true');
}

function _marcarDificuldade(diff) {
  const card = _estado.cards[_estado.current];
  if (!card) return;
  _estado.difficulty[card.id] = diff;
  _atualizarBotoesDiff(card.id);
  _atualizarBadgeDiff(card.id);
}

function _marcar(acertou) {
  const { cards, current, panelEl } = _estado;
  if (current >= cards.length || _estado.marcando) return;
  _estado.marcando = true;

  const card     = cards[current];
  const anterior = _estado.resultado[card.id];

  _estado.historico.push({
    current,
    stats:      { ..._estado.stats },
    resultado:  { ..._estado.resultado },
    difficulty: { ..._estado.difficulty },
    srPerfilAnterior: { cardId: card.id, perfil: { ..._srPerfil(card.id) } },
  });

  _estado.resultado[card.id] = acertou ? 'correct' : 'wrong';

  if (anterior === 'correct') _estado.stats.correct = Math.max(0, _estado.stats.correct - 1);
  if (anterior === 'wrong')   _estado.stats.wrong   = Math.max(0, _estado.stats.wrong   - 1);
  acertou ? _estado.stats.correct++ : _estado.stats.wrong++;

  _srAtualizar(card.id, acertou, _estado.difficulty[card.id] || null);

  _atualizarResultadoVisual(card.id);

  // Não avança automaticamente — usuário usa o botão Próximo
  _estado.marcando = false;
  _salvarSessao();
  _atualizarUI();
}

function _proximo() {
  const { cards, current, resultado } = _estado;
  const cardAtual = cards[current];
  if (cardAtual && !resultado[cardAtual.id]) return;
  if (current < cards.length) { _estado.current++; _salvarSessao(); _renderCard('next'); }
}

function _anterior() {
  if (_estado.current > 0) { _estado.current--; _salvarSessao(); _renderCard('prev'); }
}

function _embaralhar() {
  const { cards, resultado } = _estado;
  const idxNaoRespondidos = cards.reduce((acc, c, i) => { if (!resultado[c.id]) acc.push(i); return acc; }, []);
  const embaralhados = _shuffle(idxNaoRespondidos.map(i => cards[i]));
  const novoCards    = [...cards];
  idxNaoRespondidos.forEach((pos, i) => { novoCards[pos] = embaralhados[i]; });
  _estado.cards = novoCards;
  const primeiroPendente = novoCards.findIndex(c => !resultado[c.id]);
  _estado.current = primeiroPendente >= 0 ? primeiroPendente : _estado.current;
  _salvarSessao();
  _renderCard('next');
}

function _reiniciar() {
  _limparSessao();
  _estado.cards      = _srMontarDeck(_estado.discId);
  _estado.current    = 0;
  _estado.stats      = { correct: 0, wrong: 0 };
  _estado.difficulty = {};
  _estado.resultado  = {};
  _estado.marcando   = false;
  _estado.historico  = [];

  const panelEl = _estado.panelEl;
  panelEl.querySelector('.panel-cards')?.remove();
  const wrap = _criarWrapperEl(_estado.discId, _estado.cards);
  panelEl.appendChild(wrap);
  _renderCard('next');
}

function _criarWrapperEl(discId, cards) {
  const wrap = document.createElement('div');
  wrap.className    = 'panel-cards';
  wrap.dataset.disc = discId;
  wrap.innerHTML    = _tplWrapper(discId, cards);

  wrap.querySelector('#cards-btn-wrong')  ?.addEventListener('click', () => _marcar(false));
  wrap.querySelector('#cards-btn-right')  ?.addEventListener('click', () => _marcar(true));
  wrap.querySelector('#cards-btn-prev')   ?.addEventListener('click', _anterior);
  wrap.querySelector('#cards-btn-next')   ?.addEventListener('click', _proximo);
  wrap.querySelector('#cards-btn-shuffle')?.addEventListener('click', _embaralhar);
  wrap.querySelector('#cards-btn-undo')   ?.addEventListener('click', _desfazer);

  wrap.querySelector('#cards-btn-inicio')?.addEventListener('click', () => {
    const cardRoot  = document.getElementById('card-root');
    const introRoot = document.getElementById('intro-root');
    if (cardRoot)  cardRoot.style.display  = 'none';
    if (introRoot) introRoot.style.display = '';
    _limparSessao();
    // Oculta o badge do header ao voltar para o início
    const hbadge = document.getElementById('header-game-badge');
    if (hbadge) hbadge.style.display = 'none';
  });

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

/* ═════════════════════════════════════════════════════════════════
   10. API PÚBLICA
   ═════════════════════════════════════════════════════════════════ */

export async function initCards(discId, panelEl, nomeUsuario) {
  destroyCards(panelEl);

  const { sem } = lerParams();

  /* CORREÇÃO BUG 1: Shell.init já chama aplicarCoresDisciplina internamente.
     Aplicamos as cores manualmente DEPOIS com o discId correto (parâmetro),
     sobrescrevendo o que Shell fez com lerParams().disc — garante consistência
     quando discId != lerParams().disc (ex: chamada externa). */
  Shell.init({ icon: '🃏', nome: 'Flashcards' });
  aplicarCoresDisciplina(discId, DISC_CORES);
  document.body.dataset.disc = discId;

  const cardsData = getCardsData(sem);

  const breadcrumb = document.getElementById('breadcrumb-disc');
  if (breadcrumb) breadcrumb.textContent = DISC_LABEL[discId] ?? discId;

  document.getElementById('card-skeleton')?.remove();

  if (!cardsData[discId]?.length) {
    const vazio = document.createElement('div');
    vazio.className    = 'panel-cards';
    vazio.dataset.disc = discId;
    vazio.innerHTML    = `
      <div class="cards-empty">
        <i class="fas fa-layer-group" aria-hidden="true"></i>
        <p>Nenhum card disponível para esta disciplina ainda.</p>
      </div>`;
    panelEl.appendChild(vazio);
    return;
  }

  const uid = typeof nomeUsuario === 'object' ? nomeUsuario.uid : nomeUsuario;
  _srCache = await carregarPerfisSRS(uid, discId, sem);

  const sessaoSalva = window.flashcardSessao?.carregar(discId);
  let cards, estado;

  const mesmoDia = sessaoSalva?.ts &&
    new Date(sessaoSalva.ts).toDateString() === new Date().toDateString();

  if (sessaoSalva?.cards?.length && mesmoDia) {
    cards = sessaoSalva.cards
      .map(id => cardsData[discId].find(c => c.id === id))
      .filter(Boolean);

    if (cards.length !== sessaoSalva.cards.length) {
      cards  = null;
      estado = null;
    } else {
      estado = {
        ...ESTADO_INICIAL(),
        discId,
        semestre:   sem,
        nomeUsuario,
        cardsData,
        cards,
        current:    sessaoSalva.current    ?? 0,
        stats:      sessaoSalva.stats      ?? { correct: 0, wrong: 0 },
        difficulty: sessaoSalva.difficulty ?? {},
        resultado:  sessaoSalva.resultado  ?? {},
        panelEl,
      };
    }
  }

  if (!estado) {
    cards  = _srMontarDeck_com(cardsData, discId);
    estado = {
      ...ESTADO_INICIAL(),
      discId,
      semestre: sem,
      nomeUsuario,
      cardsData,
      cards,
      panelEl,
    };
  }

  _estado = estado;

  const wrap = _criarWrapperEl(discId, cards);
  panelEl.appendChild(wrap);
  _renderCard();
  _registrarAtalhos();

  // Exibe o badge no header da página com disciplina e semestre
  const hbadge = document.getElementById('header-game-badge');
  if (hbadge) {
    const discLabel = DISC_LABEL[discId] ?? discId ?? '';
    const hdisc = document.getElementById('header-game-disc');
    const hsem  = document.getElementById('header-game-sem');
    const hdot  = document.getElementById('header-game-dot');
    if (hdisc) hdisc.textContent = discLabel;
    if (hsem)  hsem.textContent  = sem ?? '';
    if (hdot)  hdot.style.display = sem ? '' : 'none';
    hbadge.style.display = '';
    // aplica cor da disciplina ao ícone
    const hicon = hbadge.querySelector('.header-game-icon');
    if (hicon) hicon.dataset.disc = discId;
  }
}

function _srMontarDeck_com(cardsData, discId) {
  const todos = cardsData[discId] || [];
  const agora = Date.now();

  const vencidos = [], novos = [], cedo = [], dominados = [];

  todos.forEach(card => {
    const p     = _srPerfil(card.id);
    const visto = p.tentativas > 0;
    if (p.dominado)                 dominados.push({ card, p });
    else if (!visto)                novos.push({ card, p });
    else if (p.proximaVez <= agora) vencidos.push({ card, p });
    else                            cedo.push({ card, p });
  });

  vencidos.sort((a, b) =>
    b.p.erros !== a.p.erros           ? b.p.erros - a.p.erros :
    b.p.tentativas !== a.p.tentativas ? b.p.tentativas - a.p.tentativas :
    a.p.proximaVez - b.p.proximaVez
  );
  cedo.sort((a, b) => a.p.proximaVez - b.p.proximaVez);
  dominados.sort((a, b) => a.p.proximaVez - b.p.proximaVez);

  const selecionados = [];
  const add = lista => {
    for (const item of lista) {
      if (selecionados.length >= DECK_SIZE) break;
      selecionados.push(item.card);
    }
  };
  add(vencidos); add(novos); add(cedo); add(dominados);
  return _shuffle(selecionados);
}

export function destroyCards(panelEl) {
  panelEl?.querySelector('.panel-cards')?.remove();
  _removerAtalhos();
}

export const exibirCards  = initCards;
export const removerCards = destroyCards;

/* ── Invalida o cache em memória (chamado após reset externo) ── */
export function invalidarCacheSRS(discId) {
  if (!discId) {
    _srCache = {};
  } else {
    const ids = (_estado.cardsData?.[discId] ?? []).map(c => c.id);
    ids.forEach(id => { delete _srCache[id]; });
  }
}

/* ── Auto-init standalone ── */
(function _autoInit() {
  const root = document.getElementById('card-root');
  if (!root) return;

  const { disc, sem } = lerParams();
  const usuario = new URLSearchParams(location.search).get('user')
             ?? getUsuario()
             ?? 'visitante';

  if (!disc) return;

  /* Aguarda o primeiro frame para garantir que o DOM está pintado */
  requestAnimationFrame(() => {
    _introPreencherDados(disc, sem);
  });

  /* Ao clicar em Começar: oculta intro, exibe jogo e inicia */
  const startBtn = document.getElementById('intro-start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const introRoot = document.getElementById('intro-root');
      if (introRoot) introRoot.style.display = 'none';
      root.style.display = '';
      initCards(disc, root, usuario);
    });
  }
})();

/* ── Preenche os dados da tela de intro ── */
function _introPreencherDados(disc, sem) {
  /* Breadcrumb */
  const breadcrumb = document.getElementById('breadcrumb-disc');
  if (breadcrumb) breadcrumb.textContent = DISC_LABEL[disc] ?? disc ?? '—';

  /* CORREÇÃO BUG 3/4: Aplicar cores e data-disc ANTES do primeiro frame.
     O rAF garante que o DOM está pronto, mas setProperty no :root é
     síncrono e já vale para qualquer elemento que existir neste ponto. */
  aplicarCoresDisciplina(disc, DISC_CORES);
  document.body.dataset.disc = disc;

  const discLabel = document.getElementById('intro-disc-label');
  if (discLabel) discLabel.textContent = DISC_LABEL[disc] ?? disc ?? '—';

  /* Chip semestre */
  const semLabel = document.getElementById('intro-sem-label');
  if (semLabel) semLabel.textContent = sem || '—';

  /* Contagem real de cards disponíveis */
  try {
    const cardsData = getCardsData(sem);
    const total     = cardsData[disc]?.length ?? 0;
    const countEl   = document.getElementById('intro-card-count');
    if (countEl) countEl.textContent = total > 0 ? String(total) : '—';
  } catch (err) {
    console.warn('[flashcard] Não foi possível carregar contagem de cards:', err.message);
  }

  /* Header — disc e semestre (visível já na intro) */
  const hdisc = document.getElementById('header-disc-name');
  const hsem  = document.getElementById('header-sem');
  if (hdisc) hdisc.textContent = DISC_LABEL[disc] ?? disc ?? '—';
  if (hsem)  hsem.textContent  = sem || '—';

  /* Botão Voltar */
  const backBtn = document.getElementById('shell-back-btn');
  if (backBtn) backBtn.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;
}