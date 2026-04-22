/* ============================================================
   NEXUS STUDY — games/flashcard/flashcard.js

   Mecânica do jogo de Flashcards com revisão adaptativa.

   Fluxo:
     1. Carrega deck da disciplina (via ?disc= na URL)
     2. Embaralha e exibe card por card
     3. Usuário vira o card → vê a resposta
     4. Marca "Já sei" → card removido do deck (vai para done[])
     5. Marca "Rever depois" → card re-inserido no deck embaralhado
     6. Quando todos os cards são "Já sei" → tela de resultado

   Rodadas:
     - Cada vez que o deck se esgota e ainda há cards "Rever",
       uma nova rodada começa com esses cards.
     - O badge "Rodada X" no topo reflete isso.

   Atalhos de teclado:
     Espaço / Enter → virar card
     ← (ArrowLeft)  → Rever depois (após virar)
     → (ArrowRight) → Já sei (após virar)
   ============================================================ */

import { Shell, Result, shuffle } from '../../template/game-shell.js';
import { DECKS }                  from '../../conteudo/flashcards/flashcards.js';

/* ══════════════════════════════════════════════════════════
   INIT — lê URL e configura Shell
   ══════════════════════════════════════════════════════════ */

const { disc, sem } = Shell.init({ icon: '🃏', nome: 'Flashcards' });

/* ══════════════════════════════════════════════════════════
   DOM
   ══════════════════════════════════════════════════════════ */

const $ = (id) => document.getElementById(id);

const DOM = {
  loading:     $('fc-loading'),
  error:       $('fc-error'),
  errorBack:   $('fc-error-back'),
  game:        $('fc-game'),
  scene:       $('fc-scene'),
  card:        $('fc-card'),
  frente:      $('fc-frente'),
  verso:       $('fc-verso'),
  dicaWrap:    $('fc-dica-wrap'),
  dica:        $('fc-dica'),
  progressBar: $('fc-progress-bar'),
  hdAtual:     $('hd-atual'),
  hdTotal:     $('hd-total'),
  countSei:    $('fc-count-sei'),
  countRever:  $('fc-count-rever'),
  roundBadge:  $('fc-round-badge'),
  hintText:    $('fc-hint-text'),
  btnSei:      $('btn-sei'),
  btnRever:    $('btn-rever'),
};

/* ══════════════════════════════════════════════════════════
   ESTADO
   ══════════════════════════════════════════════════════════ */

const state = {
  deck:       [],   // cartas restantes nesta rodada
  done:       [],   // cartas "já sei" (removidas permanentemente)
  rever:      [],   // cartas "rever depois" (volta na próxima rodada)
  atual:      null, // carta exibida no momento
  virado:     false,
  rodada:     1,
  totalCards: 0,    // total original do deck (não muda)
  processando: false, // evita double-click
};

/* ══════════════════════════════════════════════════════════
   INICIAR / REINICIAR
   ══════════════════════════════════════════════════════════ */

function iniciar() {
  const deckData = DECKS[disc];

  // Se não tiver deck, usa cards de demonstração
  const cardsDemo = [
    {
      id: 1,
      frente: 'Card de exemplo — frente',
      verso: 'Card de exemplo — verso',
      dica: 'Esta disciplina ainda não tem flashcards. Adicione em conteudo/flashcards/flashcards.js',
    },
    {
      id: 2,
      frente: 'Como adicionar meu conteúdo?',
      verso: 'Abra conteudo/flashcards/flashcards.js e adicione uma chave com o id desta disciplina.',
    },
  ];

  const cards = deckData?.cards?.length ? deckData.cards : cardsDemo;

  // Reseta estado
  state.deck        = shuffle([...cards]);
  state.done        = [];
  state.rever       = [];
  state.atual       = null;
  state.virado      = false;
  state.rodada      = 1;
  state.totalCards  = cards.length;
  state.processando = false;

  // UI
  DOM.loading.classList.add('hidden');
  DOM.game.classList.remove('hidden');
  DOM.hdTotal.textContent    = state.totalCards;
  DOM.countSei.textContent   = '0';
  DOM.countRever.textContent = '0';
  atualizarRoundBadge();
  atualizarProgressBar();
  proximoCard();
}

/* ══════════════════════════════════════════════════════════
   NAVEGAR CARDS
   ══════════════════════════════════════════════════════════ */

function proximoCard(animDelay = 0) {
  /* Deck atual vazio — verifica se há cards para rever */
  if (state.deck.length === 0) {
    if (state.rever.length === 0) {
      /* Fim do jogo — todos os cards dominados! */
      encerrar();
      return;
    }

    /* Nova rodada com os cards "rever" */
    state.rodada++;
    state.deck  = shuffle([...state.rever]);
    state.rever = [];
    atualizarRoundBadge();
  }

  state.atual  = state.deck.shift();
  state.virado = false;
  state.processando = false;

  renderizarCard(animDelay);
}

/* ══════════════════════════════════════════════════════════
   RENDERIZAR CARD
   ══════════════════════════════════════════════════════════ */

function renderizarCard(animDelay = 0) {
  const c = state.atual;

  /* Textos */
  DOM.frente.textContent = c.frente;
  DOM.verso.textContent  = c.verso;

  /* Dica (opcional) */
  if (c.dica) {
    DOM.dica.textContent = c.dica;
    DOM.dicaWrap.classList.remove('hidden');
  } else {
    DOM.dicaWrap.classList.add('hidden');
  }

  /* Garante frente visível */
  DOM.card.classList.remove('fc-card--flipped');

  /* Desativa botões */
  DOM.btnSei.disabled   = true;
  DOM.btnRever.disabled = true;
  DOM.hintText.textContent = 'Clique no card para revelar a resposta';

  /* Animação de entrada */
  DOM.card.classList.remove('fc-card--entering');
  void DOM.card.offsetWidth; // reflow para reiniciar animação
  setTimeout(() => DOM.card.classList.add('fc-card--entering'), animDelay);

  /* Acessibilidade */
  DOM.scene.setAttribute('aria-label', `Pergunta: ${c.frente}. Clique para revelar.`);

  atualizarContador();
  atualizarProgressBar();
}

/* ══════════════════════════════════════════════════════════
   VIRAR CARD
   ══════════════════════════════════════════════════════════ */

function virar() {
  if (state.virado || state.processando) return;

  state.virado = true;
  DOM.card.classList.add('fc-card--flipped');
  DOM.btnSei.disabled   = false;
  DOM.btnRever.disabled = false;
  DOM.hintText.textContent = '← Rever depois      Já sei! →';

  DOM.scene.setAttribute('aria-label',
    `Resposta: ${state.atual.verso}. Pressione ← para rever depois ou → para marcar como que já sabe.`
  );
}

/* ══════════════════════════════════════════════════════════
   AÇÕES DO USUÁRIO
   ══════════════════════════════════════════════════════════ */

function marcarSei() {
  if (!state.virado || state.processando) return;
  state.processando = true;

  state.done.push(state.atual);

  DOM.countSei.textContent  = state.done.length;

  /* Feedback visual rápido */
  flashCard('sei');
  setTimeout(() => proximoCard(), 320);
}

function marcarRever() {
  if (!state.virado || state.processando) return;
  state.processando = true;

  /* Re-insere em posição aleatória no deck */
  const pos = Math.floor(Math.random() * (state.deck.length + 1));
  state.rever.push(state.atual);   // conta para o badge
  state.deck.splice(pos, 0, state.atual);

  DOM.countRever.textContent = state.rever.length;

  /* Sem animação especial — só avança */
  flashCard('rever');
  setTimeout(() => proximoCard(), 320);
}

/* Flash de cor no card antes de avançar */
function flashCard(tipo) {
  const cor = tipo === 'sei'
    ? 'rgba(52,211,153,.18)'
    : 'rgba(251,146,60,.18)';

  DOM.card.style.transition = 'background .15s';
  DOM.card.style.background = cor;
  setTimeout(() => {
    DOM.card.style.background = '';
    DOM.card.style.transition = '';
  }, 300);
}

/* ══════════════════════════════════════════════════════════
   ATUALIZAR UI
   ══════════════════════════════════════════════════════════ */

function atualizarContador() {
  /* "atual" = quantos já passaram + 1 */
  const passados = state.done.length + 1;
  DOM.hdAtual.textContent = passados;
  DOM.hdTotal.textContent = state.totalCards;
}

function atualizarProgressBar() {
  const pct = state.totalCards > 0
    ? (state.done.length / state.totalCards) * 100
    : 0;
  DOM.progressBar.style.width = pct + '%';
}

function atualizarRoundBadge() {
  DOM.roundBadge.textContent = `Rodada ${state.rodada}`;
}

/* ══════════════════════════════════════════════════════════
   ENCERRAR JOGO
   ══════════════════════════════════════════════════════════ */

function encerrar() {
  const pct = Math.round((state.done.length / state.totalCards) * 100);

  Result.mostrar({
    emoji:     pct === 100 ? '🏆' : pct >= 70 ? '🎯' : '📖',
    titulo:    pct === 100 ? 'Deck dominado!'  : 'Bom progresso!',
    subtitulo: pct === 100
      ? 'Você acertou todos os cards. Ótimo trabalho!'
      : `Você dominou ${pct}% do deck. Continue revisando!`,
    stats: [
      { label: 'Sei',      valor: state.done.length },
      { label: 'Rodadas',  valor: state.rodada },
      { label: 'Acerto',   valor: pct + '%' },
    ],
    onRejogo: iniciar,
  });
}

/* ══════════════════════════════════════════════════════════
   ERRO (deck não encontrado)
   ══════════════════════════════════════════════════════════ */

function mostrarErro() {
  DOM.loading.classList.add('hidden');
  DOM.error.classList.remove('hidden');

  const { sem: s } = { sem };
  DOM.errorBack.href = `../../jogo.html${s ? `?sem=${s}` : ''}`;
}

/* ══════════════════════════════════════════════════════════
   EVENTOS
   ══════════════════════════════════════════════════════════ */

/* Virar ao clicar no card */
DOM.scene.addEventListener('click', () => {
  if (!state.virado) virar();
});

/* Botões de ação */
DOM.btnSei.addEventListener('click',   marcarSei);
DOM.btnRever.addEventListener('click', marcarRever);

/* Teclado */
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'BUTTON' && e.key === ' ') return; // evita duplo disparo

  switch (e.key) {
    case ' ':
    case 'Enter':
      e.preventDefault();
      if (!state.virado) virar();
      break;
    case 'ArrowRight':
      e.preventDefault();
      marcarSei();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      marcarRever();
      break;
  }
});

/* ══════════════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════════════ */

iniciar();