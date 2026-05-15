/* ═══════════════════════════════════════════════════════════════════
   NEXUS STUDY — games/jogos/flashcard/flashcard.js  (v6.0)

   Orquestrador principal do flashcard.
   Responsabilidades: SRS engine, estado da sessão, bridge de SessionNav,
   anti-flash, ações do usuário, API pública e auto-init da página.

   A camada visual (templates, render, UI updates, atalhos, undo)
   vive em flashcard.ui.js e é acessada via a instância retornada
   por criarUI().

   Seções:
     1.  IMPORTS & CONSTANTES
     2.  ENGINE DE SPACED REPETITION (SRS)
     3.  ESTADO DA SESSÃO
     4.  FC-NAV BRIDGE — adapta SessionNav ao esquema do flashcard
     5.  FC ANTI-FLASH  — controla visibilidade das telas
     6.  AÇÕES DO USUÁRIO
     7.  API PÚBLICA  →  initCards / destroyCards
     8.  INTRO         →  preenchimento, botões, modal
     9.  AUTO-INIT
═══════════════════════════════════════════════════════════════════ */

/* ── 1. IMPORTS & CONSTANTES ──────────────────────────────────── */

import { SessionNav }                           from '../../template/session-nav.js';
import { getCardsData }                         from '../../../content/game/flashcards/cards_data.js';
import { carregarPerfisSRS, salvarPerfilSRS }   from './storage.js';
import { Shell, lerParams }                     from '../../template/game-shell.js';
import { getUsuario, getDisciplinasDeSemestre } from '../../../src/global.js';
import { DISC_CORES }                           from '../../../shared/js/cores.js';
import { aplicarCoresDisciplina }               from '../../../shared/js/theme.js';
import { criarUI }                              from './flashcard.ui.js';

/*
 * ANTI-FLASH SÍNCRONO
 * Deve ser chamado o mais cedo possível no carregamento do módulo,
 * antes de qualquer await.
 */
SessionNav.prepararAntiFlash();

const DISC_LABEL = {
  design:      'Design',
  banco_dados: 'Banco de Dados',
  redes:       'Redes',
  poo:         'POO',
};

const DECK_SIZE                 = 10;
const ACERTOS_PARA_DOMINAR      = 3;
const MIN_TENTATIVAS_PENALIDADE = 4;

/** Constantes compartilhadas com a camada de UI. */
const CONSTANTES = { DISC_LABEL, ACERTOS_PARA_DOMINAR, MIN_TENTATIVAS_PENALIDADE };


/* ═════════════════════════════════════════════════════════════════
   2. ENGINE DE SPACED REPETITION (SRS)
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

/** Monta deck SRS a partir de _estado.cardsData (isolado por semestre). */
function _srMontarDeck(discId, cardsData = _estado.cardsData) {
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

function _srEstatisticas(discId) {
  const todos = _estado.cardsData[discId] || [];
  const agora = Date.now();
  let dominados = 0, vencidos = 0, novos = 0;

  todos.forEach(card => {
    const p     = _srPerfil(card.id);
    const visto = p.tentativas > 0;
    if (!visto)          novos++;
    else if (p.dominado) dominados++;
    else if (p.proximaVez <= agora) vencidos++;
  });

  return { total: todos.length, dominados, vencidos, novos };
}


/* ═════════════════════════════════════════════════════════════════
   3. ESTADO DA SESSÃO
   ═════════════════════════════════════════════════════════════════ */

const ESTADO_INICIAL = () => ({
  discId:        null,
  semestre:      null,
  nomeUsuario:   null,
  cardsData:     {},
  cards:         [],
  current:       0,
  flipped:       false,
  marcando:      false,
  stats:         { correct: 0, wrong: 0 },
  difficulty:    {},
  resultado:     {},
  historico:     [],
  panelEl:       null,
  modoRevisao:   false,
  cardsRevisao:  null,
  // Funções do SRS expostas para a camada de UI (sem acoplamento circular)
  srPerfil:      _srPerfil,
  srEstatisticas: _srEstatisticas,
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

/** Instância da camada de UI — recriada em cada initCards(). */
let _ui = null;


/* ═════════════════════════════════════════════════════════════════
   4. FC-NAV BRIDGE
   ──────────────────────────────────────────────────────────────────
   Adapta o contrato do SessionNav (projetado para jogos VF) ao
   esquema de dados do flashcard.

   MAPEAMENTO DE CAMPOS
   ──────────────────────
   SessionNav.salvar() espera:
     { perguntas, respostas, tempos, indice, pontos,
       acertos, erros, modoRevisao, tela }

   Flashcard usa:
     { cards[], resultado{}, difficulty{}, stats{},
       current, modoRevisao, cardsRevisao }

   Estratégia:
   • perguntas  → IDs dos cards (array de strings)
   • respostas  → array paralelo a perguntas; undefined = pendente,
                  true = correct, false = wrong
   • indice     → current (índice corrente)
   • acertos    → stats.correct
   • erros      → stats.wrong
   • tempos     → array de dificuldades (easy/medium/hard/null)
   • tela       → 'question' durante o jogo, 'intro' na tela de inicio
   ═════════════════════════════════════════════════════════════════ */

let _nav = null;

function _navInicializar(uid, discId, sem) {
  _nav?.destruir();
  _nav = SessionNav.criar({
    uid,
    discId,
    sem,
    ttlMs:      24 * 60 * 60 * 1000,
    throttleMs: 150,
  });
}

function _fcEstadoParaSessaoNav(tela = 'question') {
  const { cards, resultado, difficulty, stats, current, modoRevisao } = _estado;

  const perguntas = cards.map(c => c.id);
  const respostas = cards.map(c => {
    const r = resultado[c.id];
    if (r === 'correct') return true;
    if (r === 'wrong')   return false;
    return undefined;
  });
  const tempos = cards.map(c => difficulty[c.id] ?? null);

  return {
    perguntas,
    respostas,
    tempos,
    indice:      current,
    pontos:      0,
    acertos:     stats.correct,
    erros:       stats.wrong,
    modoRevisao: modoRevisao ?? false,
    tela,
  };
}

function _sessaoNavParaFcEstado(sessao, cardsData, discId) {
  if (!sessao?.perguntas?.length) return null;

  const todosDaDisc = cardsData[discId] ?? [];
  const cardsById   = Object.fromEntries(todosDaDisc.map(c => [c.id, c]));

  const cards = sessao.perguntas
    .map(id => cardsById[id])
    .filter(Boolean);

  if (cards.length !== sessao.perguntas.length) {
    console.warn('[flashcard] Sessão descartada: cards não encontrados no deck atual.');
    return null;
  }

  const resultado = {};
  sessao.respostas?.forEach((r, i) => {
    const id = sessao.perguntas[i];
    if (r === true)       resultado[id] = 'correct';
    else if (r === false) resultado[id] = 'wrong';
  });

  const difficulty = {};
  sessao.tempos?.forEach((diff, i) => {
    if (diff) difficulty[sessao.perguntas[i]] = diff;
  });

  return {
    cards,
    current:     sessao.indice  ?? 0,
    stats:       { correct: sessao.acertos ?? 0, wrong: sessao.erros ?? 0 },
    resultado,
    difficulty,
    modoRevisao: sessao.modoRevisao ?? false,
  };
}

/* ── Wrappers de persistência ──────────────────────────────────── */

function _salvarSessao(imediato = false) {
  if (!_nav) return;
  const payload = _fcEstadoParaSessaoNav('question');
  if (imediato) {
    _nav.salvar(payload);
  } else {
    _nav.salvarThrottled(payload);
  }
}

function _limparSessao() {
  _nav?.limpar();
}

function _sairParaRota() {
  _nav?.sairParaRota();
}

function _sessaoAtiva() {
  if (!_nav) return null;

  const sessao = _nav.lerSessao();
  if (!sessao?.perguntas?.length) return null;

  const pendentes   = sessao.respostas?.filter(r => r === undefined).length ?? 0;
  const respondidos = sessao.perguntas.length - pendentes;

  if (pendentes <= 0) return null;

  return { sessao, pendentes, respondidos, total: sessao.perguntas.length };
}


/* ═════════════════════════════════════════════════════════════════
   5. FC ANTI-FLASH
   ──────────────────────────────────────────────────────────────────
   Controla a visibilidade das telas intro/game sem causar flash
   visual ao recarregar ou restaurar sessão.
   ═════════════════════════════════════════════════════════════════ */

const FcAntiFlash = {
  mostrarTela(tela) {
    const introRoot = document.getElementById('intro-root');
    const cardRoot  = document.getElementById('card-root');

    if (tela === 'game') {
      if (introRoot) introRoot.style.display = 'none';
      if (cardRoot)  cardRoot.style.display  = '';
      document.documentElement.setAttribute('data-fc-restore', 'game');
    } else {
      if (cardRoot)  cardRoot.style.display  = 'none';
      if (introRoot) introRoot.style.display = '';
      document.documentElement.removeAttribute('data-fc-restore');
    }
  },

  pronto() {
    _nav?.pronto();
  },
};


/* ═════════════════════════════════════════════════════════════════
   6. AÇÕES DO USUÁRIO
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
  _ui?.atualizarBotoesDiff(card.id);
  _ui?.atualizarBadgeDiff(card.id);
}

function _marcar(acertou) {
  const { cards, current } = _estado;
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

  _ui?.atualizarResultadoVisual(card.id);

  _estado.marcando = false;
  _salvarSessao(/* imediato */ true);
  _ui?.atualizarUI();
}

function _proximo() {
  const { cards, current, resultado } = _estado;
  const cardAtual = cards[current];
  if (cardAtual && !resultado[cardAtual.id]) return;
  if (current < cards.length) { _estado.current++; _salvarSessao(); _ui?.render('next'); }
}

function _anterior() {
  if (_estado.current > 0) { _estado.current--; _salvarSessao(); _ui?.render('prev'); }
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
  _ui?.render('next');
}

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
  _ui?.render();
  _ui?.mostrarToastUndo();
}

function _reiniciar() {
  _limparSessao();

  let novasCards;
  if (_estado.modoRevisao) {
    const todosRevisao = _estado.cardsRevisao ?? [];
    const aindaComErro = todosRevisao.filter(card => {
      const p = _srPerfil(card.id);
      return p.erros > 0 && p.acertosConsecutivos === 0;
    });

    if (aindaComErro.length === 0) {
      _estado.cards      = [];
      _estado.current    = 0;
      _estado.stats      = { correct: 0, wrong: 0 };
      _estado.difficulty = {};
      _estado.resultado  = {};
      _estado.marcando   = false;
      _estado.historico  = [];
      _ui?.renderRevisaoConcluida(_voltarParaIntro);
      return;
    }

    _estado.cardsRevisao = aindaComErro;
    novasCards = _shuffle(aindaComErro.slice(0, DECK_SIZE));
  } else {
    novasCards = _srMontarDeck(_estado.discId);
  }

  _estado.cards      = novasCards;
  _estado.current    = 0;
  _estado.stats      = { correct: 0, wrong: 0 };
  _estado.difficulty = {};
  _estado.resultado  = {};
  _estado.marcando   = false;
  _estado.historico  = [];

  const panelEl = _estado.panelEl;
  panelEl.querySelector('.panel-cards')?.remove();
  const wrap = _ui.criarWrapperEl(_estado.discId, _estado.cards);
  panelEl.appendChild(wrap);
  _ui.render('next');
}

/**
 * Volta para a tela de intro de forma padronizada.
 * Persiste tela='intro' para que pegarRestauravel() retorne null
 * ao recarregar, mas lerSessao() ainda retorne para "Continuar".
 */
function _voltarParaIntro() {
  FcAntiFlash.mostrarTela('intro');
  document.body.classList.remove('modo-revisao');

  if (_nav) {
    _nav.salvar(_fcEstadoParaSessaoNav('intro'));
  }

  const hbadge = document.getElementById('header-game-badge');
  if (hbadge) hbadge.style.display = 'none';

  _atualizarBtnContinuar(_estado.discId, document.getElementById('card-root'), _estado.nomeUsuario);
}

/**
 * Objeto de ações passado para criarUI() — todas as mutações de
 * estado do domínio passam por aqui.
 */
const _ações = {
  flipCard:         _flipCard,
  marcar:           _marcar,
  marcarDificuldade: _marcarDificuldade,
  proximo:          _proximo,
  anterior:         _anterior,
  embaralhar:       _embaralhar,
  desfazer:         _desfazer,
  voltarParaIntro:  _voltarParaIntro,
  reiniciar:        _reiniciar,
  limparSessao:     _limparSessao,
};


/* ═════════════════════════════════════════════════════════════════
   7. API PÚBLICA
   ═════════════════════════════════════════════════════════════════ */

export async function initCards(discId, panelEl, nomeUsuario, opcoes = {}) {
  destroyCards(panelEl);

  const { sem } = lerParams();

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

  // Tenta restaurar sessão salva, exceto em modo revisão.
  const sessaoInfo = !opcoes.modoRevisao ? _sessaoAtiva() : null;
  let cards, estado;

  if (sessaoInfo) {
    const restaurado = _sessaoNavParaFcEstado(sessaoInfo.sessao, cardsData, discId);
    if (restaurado) {
      cards  = restaurado.cards;
      estado = {
        ...ESTADO_INICIAL(),
        discId,
        semestre:    sem,
        nomeUsuario,
        cardsData,
        ...restaurado,
        panelEl,
      };
    }
  }

  if (!estado) {
    if (opcoes.modoRevisao && opcoes.cardsRevisao?.length) {
      cards = _shuffle(opcoes.cardsRevisao.slice(0, DECK_SIZE));
    } else {
      cards = _srMontarDeck(discId, cardsData);
    }
    estado = {
      ...ESTADO_INICIAL(),
      discId,
      semestre:     sem,
      nomeUsuario,
      cardsData,
      cards,
      panelEl,
      modoRevisao:  opcoes.modoRevisao  ?? false,
      cardsRevisao: opcoes.cardsRevisao ?? null,
    };
  }

  _estado = estado;

  // Cria a instância de UI com referência ao estado e às ações.
  _ui = criarUI(_estado, _ações, CONSTANTES);

  const wrap = _ui.criarWrapperEl(discId, cards);
  panelEl.appendChild(wrap);
  _ui.render();
  _ui.registrarAtalhos();

  // Badge no header da página.
  const hbadge = document.getElementById('header-game-badge');
  if (hbadge) {
    const hdisc = document.getElementById('header-game-disc');
    const hsem  = document.getElementById('header-game-sem');
    const hdot  = document.getElementById('header-game-dot');
    if (hdisc) hdisc.textContent = DISC_LABEL[discId] ?? discId ?? '';
    if (hsem)  hsem.textContent  = sem ?? '';
    if (hdot)  hdot.style.display = sem ? '' : 'none';
    hbadge.style.display = '';
    const hicon = hbadge.querySelector('.header-game-icon');
    if (hicon) hicon.dataset.disc = discId;
  }
}

export function destroyCards(panelEl) {
  panelEl?.querySelector('.panel-cards')?.remove();
  _ui?.removerAtalhos();
  _ui = null;
  /*
   * NÃO destruímos o _nav aqui porque destroyCards é chamado no
   * início de initCards para limpar o DOM anterior — o _nav tem
   * ciclo de vida atrelado à página, não ao componente de cards.
   */
}

export const exibirCards  = initCards;
export const removerCards = destroyCards;

/** Invalida o cache SRS em memória (chamado após reset externo). */
export function invalidarCacheSRS(discId) {
  if (!discId) {
    _srCache = {};
  } else {
    const ids = (_estado.cardsData?.[discId] ?? []).map(c => c.id);
    ids.forEach(id => { delete _srCache[id]; });
  }
}


/* ═════════════════════════════════════════════════════════════════
   8. INTRO — preenchimento de dados, botões e modal
   ═════════════════════════════════════════════════════════════════ */

async function _introPreencherDados(disc, sem) {
  const breadcrumb = document.getElementById('breadcrumb-disc');
  if (breadcrumb) breadcrumb.textContent = DISC_LABEL[disc] ?? disc ?? '—';

  aplicarCoresDisciplina(disc, DISC_CORES);
  document.body.dataset.disc = disc;

  const discLabel = document.getElementById('intro-disc-label');
  if (discLabel) discLabel.textContent = DISC_LABEL[disc] ?? disc ?? '—';

  const semLabel = document.getElementById('intro-sem-label');
  if (semLabel) semLabel.textContent = sem || '—';

  let cardsData = {};
  try {
    cardsData     = getCardsData(sem);
    const total   = cardsData[disc]?.length ?? 0;
    const countEl = document.getElementById('intro-card-count');
    if (countEl) countEl.textContent = total > 0 ? String(total) : '—';
  } catch (err) {
    console.warn('[flashcard] Não foi possível carregar contagem de cards:', err.message);
  }

  const hdisc = document.getElementById('header-disc-name');
  const hsem  = document.getElementById('header-sem');

  const disciplinas = getDisciplinasDeSemestre(sem);
  const discObj     = disciplinas.find(d => d.id === disc);
  if (hdisc) hdisc.textContent = discObj?.apelido ?? DISC_LABEL[disc] ?? disc ?? '—';
  if (hsem)  hsem.textContent  = sem || '—';

  const chipDisc = document.getElementById('intro-chip-disc');
  if (chipDisc) {
    const iconEl = chipDisc.querySelector('i');
    const emoji  = discObj?.emoji;
    if (emoji && iconEl) {
      const span = document.createElement('span');
      span.textContent = emoji;
      span.setAttribute('aria-hidden', 'true');
      iconEl.replaceWith(span);
    }
  }

  const backBtn = document.getElementById('shell-back-btn');
  if (backBtn) {
    backBtn.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;
    backBtn.addEventListener('click', () => {
      _sairParaRota();
      _limparSessao();
    }, { once: true });
  }

  _introAtualizarBotaoRevisar(disc, sem, cardsData);
}

function _atualizarBtnContinuar(disc, root, usuario) {
  const btn     = document.getElementById('intro-fc-btn-continuar');
  const countEl = document.getElementById('fc-continuar-progress');
  if (!btn) return;

  const info = _sessaoAtiva();

  if (!info) {
    btn.classList.add('hidden');
    return;
  }

  if (countEl) countEl.textContent = `${info.respondidos}/${info.total}`;
  btn.classList.remove('hidden');

  // Idempotente: registra o listener apenas uma vez.
  if (!btn.dataset.fcListener) {
    btn.dataset.fcListener = '1';
    btn.addEventListener('click', () => {
      FcAntiFlash.mostrarTela('game');
      initCards(disc, root, usuario);
    });
  }
}

async function _introAtualizarBotaoRevisar(disc, sem, cardsData) {
  const btn     = document.getElementById('intro-revisar-btn');
  const countEl = document.getElementById('intro-revisar-count');
  if (!btn) return;

  try {
    const todos = cardsData[disc] ?? [];
    if (todos.length === 0) return;

    const uid    = new URLSearchParams(location.search).get('user') ?? getUsuario()?.uid ?? 'visitante';
    const perfis = await carregarPerfisSRS(uid, disc, sem).catch(() => ({}));

    const comErro = todos.filter(c => {
      const p = perfis[c.id];
      return p && p.erros > 0;
    });

    if (comErro.length === 0) {
      btn.classList.add('hidden');
      return;
    }

    if (countEl) countEl.textContent = comErro.length;
    btn.classList.remove('hidden');

    if (!btn.dataset.fcListener) {
      btn.dataset.fcListener = '1';
      btn.addEventListener('click', () => _abrirModalRevisao(comErro, perfis, disc, sem));
    }

  } catch (err) {
    console.warn('[flashcard] Erro ao verificar cards com erro:', err.message);
  }
}

function _abrirModalRevisao(comErro, perfis, disc, sem) {
  const overlay  = document.getElementById('fc-modal-overlay');
  const lista    = document.getElementById('fc-modal-list');
  const btnStart = document.getElementById('fc-modal-start');
  const btnClose = document.getElementById('fc-modal-close');
  const btnCancel= document.getElementById('fc-modal-cancel');
  if (!overlay || !lista) return;

  const ordenados = [...comErro].sort((a, b) => {
    const pa = perfis[a.id] ?? { erros: 0, tentativas: 0 };
    const pb = perfis[b.id] ?? { erros: 0, tentativas: 0 };
    const taxaA = pa.tentativas > 0 ? pa.erros / pa.tentativas : 0;
    const taxaB = pb.tentativas > 0 ? pb.erros / pb.tentativas : 0;
    return taxaB - taxaA;
  });

  lista.innerHTML = '';
  for (const card of ordenados) {
    const p      = perfis[card.id] ?? { erros: 0, acertos: 0, tentativas: 0 };
    const taxa   = p.tentativas > 0 ? Math.round((p.acertos / p.tentativas) * 100) : 0;
    const cor    = taxa >= 70 ? '#34d399' : taxa >= 40 ? '#facc15' : '#f87171';
    const icone  = taxa >= 70 ? 'fa-check' : taxa >= 40 ? 'fa-minus' : 'fa-xmark';
    const frente = card.frente ?? card.pergunta ?? '';
    const trecho = frente.length > 72 ? frente.slice(0, 72) + '…' : frente;

    const row = document.createElement('div');
    row.className = 'fc-modal-row';
    row.setAttribute('role', 'listitem');
    row.innerHTML = `
      <span class="fc-modal-row__icon" style="color:${cor}">
        <i class="fas ${icone}" aria-hidden="true"></i>
      </span>
      <span class="fc-modal-row__text">${trecho}</span>
      <span class="fc-modal-row__stat" style="color:${cor}">
        ${p.acertos}/${p.tentativas}
        <span class="fc-modal-row__pct">${taxa}%</span>
      </span>`;
    lista.appendChild(row);
  }

  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  function fechar() {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // Clona para evitar acúmulo de listeners.
  const novoStart = btnStart.cloneNode(true);
  btnStart.parentNode.replaceChild(novoStart, btnStart);
  novoStart.addEventListener('click', () => {
    fechar();
    FcAntiFlash.mostrarTela('game');
    const usuario = new URLSearchParams(location.search).get('user') ?? getUsuario() ?? 'visitante';
    initCards(disc, document.getElementById('card-root'), usuario, { modoRevisao: true, cardsRevisao: ordenados });
  });

  btnClose ?.addEventListener('click', fechar, { once: true });
  btnCancel?.addEventListener('click', fechar, { once: true });
  overlay   .addEventListener('click', e => { if (e.target === overlay) fechar(); }, { once: true });
}


/* ═════════════════════════════════════════════════════════════════
   9. AUTO-INIT STANDALONE
   ──────────────────────────────────────────────────────────────────
   Fluxo de inicialização da página:

   1. Deriva uid/disc/sem da URL.
   2. Inicializa o SessionNav com _navInicializar().
   3. Chama pegarRestauravel() — verifica reload-flag + sessão válida.
      • Sessão com tela='question': restaura diretamente.
      • Caso contrário: verifica sessão pausada para "Continuar".
   4. Chama FcAntiFlash.pronto() para remover CSS de ocultação.
   ═════════════════════════════════════════════════════════════════ */
(function _autoInit() {
  const root = document.getElementById('card-root');
  if (!root) return;

  const { disc, sem } = lerParams();
  if (!disc) return;

  const uid = new URLSearchParams(location.search).get('user')
           ?? getUsuario()?.uid
           ?? 'visitante';

  _navInicializar(uid, disc, sem);

  const sessaoRestauravel = _nav.pegarRestauravel();

  if (sessaoRestauravel) {
    _introPreencherDados(disc, sem);
    FcAntiFlash.mostrarTela('game');
    initCards(disc, root, uid);
    FcAntiFlash.pronto();
    return;
  }

  const sessaoPausada = _sessaoAtiva();

  if (!sessaoPausada) {
    _nav.limpar();
    document.documentElement.removeAttribute('data-fc-restore');
  }

  _introPreencherDados(disc, sem);
  _atualizarBtnContinuar(disc, root, uid);

  const startBtn = document.getElementById('intro-start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      _nav.limpar();
      document.getElementById('intro-fc-btn-continuar')?.classList.add('hidden');
      FcAntiFlash.mostrarTela('game');
      initCards(disc, root, uid);
    });
  }

  FcAntiFlash.pronto();
})();