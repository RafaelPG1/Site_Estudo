/* ═══════════════════════════════════════════════════════════════════
   NEXUS STUDY — games/jogos/flashcard/flashcard.js  (v6.5)

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

   CHANGELOG v6.5
   ──────────────
   [FIX-R1]  initCards: drain da fila SRS usa loop do/while comparando
             referência antes/depois do await, garantindo que tarefas
             enfileiradas DURANTE o drain (ex: _marcar em voo) sejam
             concluídas antes de _srCache ser substituído por
             carregarPerfisSRS. Previne divergência cache/remoto em
             trocas rápidas de disciplina.
   [FIX-R2]  _introAtualizarBotaoRevisar: token de versão incremental
             (_revisarTokenAtual) descarta respostas stale de
             carregarPerfisSRS quando o usuário troca de disciplina
             antes da promise resolver. Previne handler "Revisar" com
             cardsRevisao da disciplina anterior.
   [FIX-R3]  initCards: quando _sessaoNavParaFcEstado retorna null
             (cards removidos do conteúdo entre sessões), _limparSessao()
             é chamado para remover a sessão inválida do storage.
             Previne loop de "sessão zumbi" onde o botão Continuar
             reapparece indefinidamente com dados que nunca serão
             restauráveis.

   CHANGELOG v6.4
   ──────────────
   [FIX-C1]  _srAtualizar agora retorna a promise da fila serial; _marcar
             aguarda a persistência real antes de liberar _estado.marcando,
             eliminando o race condition de undo após gravação em voo.
   [FIX-C3]  _flipCard armazena o ID do timer em _estado._flipTimerId;
             destroyCards e _voltarParaIntro cancelam o timer pendente
             antes de destruir o DOM, prevenindo foco em elemento removido.
   [FIX-A1]  _estado.nomeUsuario é sempre normalizado para string UID via
             _resolverUid() no momento da inicialização em initCards(),
             eliminando divergência entre _resolverUid e _resolverUidFromUrl.
             _srAtualizar e _srPersistirUndo leem _estado.nomeUsuario
             diretamente (já é string), sem nova chamada a _resolverUid.
   [FIX-A2]  _atualizarBtnContinuar valida que o elemento root recuperado
             por ID no momento do clique não é null antes de chamar initCards.
   [FIX-A3]  _introAtualizarBotaoRevisar não substitui btn._fcRevisarHandler
             se o modal já estiver aberto (overlay visível).
   [FIX-A4]  destroyCards cancela o timer de flip pendente antes de remover
             o DOM (consequência direta do FIX-C3).
   [FIX-M1]  _embaralhar adiciona snapshot no histórico antes de reordenar,
             permitindo undo consistente.
   [FIX-M2]  _abrirModalRevisao possui guard defensivo para todos os
             elementos DOM necessários; retorna cedo com aviso se ausentes.
   [FIX-M3]  _salvarSessao envolve _nav.salvar em try/catch, prevenindo
             propagação de exceção que travaria _estado.marcando.
   [FIX-M4]  _sessaoNavParaFcEstado clampeia sessao.indice ao intervalo
             válido [0, cards.length - 1].
   [FIX-M6]  _autoInit detecta cardsData vazio após restauração e redireciona
             para a tela de intro em vez de travar na tela de game.
   [FIX-B2]  _irParaCard reseta _estado.flipped para false antes de renderizar.
   [FIX-B4]  _marcarDificuldade chama _salvarSessao() após mutar difficulty.

   REMOVIDO (código morto):
   [RM-M5]   _resolverLabelDisc (versão sem lista) removida — não era usada
             neste arquivo; estava documentada como compatibilidade mas não
             havia chamada interna. Arquivos externos devem usar
             _resolverLabelDiscDeLista ou chamar getDisciplinasDeSemestre
             diretamente.
   ──────────────────────────────────────────────────────────────────
   MANTIDO INTENCIONAL:
   [B1]      Reset manual de _estado.marcando = false em _desfazer é
             correto — o snapshot representa estado anterior à marcação.
             Não é bug.
   [B3]      console.warn em aliases depreciados é intencional para
             sinalizar migração. Mantido.
   [C2]      Singleton _estado é limitação arquitetural que exigiria
             refatoração ampla; o lock _initEmAndamento mitiga o risco
             principal. Não alterado.
   [D1]      _reiniciar possui guard _estado.marcando (FIX-D1) para
             prevenir corrupção de SRS quando reinício é disparado via
             atalho de teclado durante await de _srAtualizar em voo.
             Padrão idêntico ao guard existente em _desfazer().
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

/**
 * Resolve o label de exibição de uma disciplina a partir de uma lista
 * já carregada de disciplinas, evitando chamadas redundantes a
 * getDisciplinasDeSemestre(). [FIX-P9]
 *
 * @param {string}   discId
 * @param {object[]} disciplinas  — lista já resolvida por getDisciplinasDeSemestre
 * @param {string}   [fallback]   — valor caso não encontrado
 * @returns {string}
 */
function _resolverLabelDiscDeLista(discId, disciplinas, fallback) {
  const discObj = disciplinas?.find(d => d.id === discId);
  if (discObj?.apelido) return discObj.apelido;
  if (discObj?.nome)    return discObj.nome;
  return fallback ?? discId ?? '—';
}

/*
 * [RM-M5] _resolverLabelDisc (versão standalone) foi removida por ser
 * código morto — não havia chamada interna neste arquivo.
 * Se algum módulo externo a importava, deve migrar para chamar
 * getDisciplinasDeSemestre() e _resolverLabelDiscDeLista() diretamente,
 * ou manter uma cópia local.
 */

const DECK_SIZE                 = 10;
const ACERTOS_PARA_DOMINAR      = 3;
const MIN_TENTATIVAS_PENALIDADE = 4;

/** Constantes compartilhadas com a camada de UI. */
const CONSTANTES = { ACERTOS_PARA_DOMINAR, MIN_TENTATIVAS_PENALIDADE };

/**
 * Normaliza o usuário para uma string uid consistente.
 * getUsuario() pode retornar um objeto {uid, ...} ou uma string.
 *
 * @param {string|object|null} usuario
 * @returns {string}
 */
function _resolverUid(usuario) {
  if (!usuario) return 'visitante';
  if (typeof usuario === 'object') return usuario.uid ?? 'visitante';
  return usuario;
}

// [M2] Centraliza a resolução de UID a partir da URL + fallback getUsuario().
function _resolverUidFromUrl() {
  return new URLSearchParams(location.search).get('user')
      ?? getUsuario()?.uid
      ?? 'visitante';
}


/* ═════════════════════════════════════════════════════════════════
   2. ENGINE DE SPACED REPETITION (SRS)
   ═════════════════════════════════════════════════════════════════ */

let _srCache = {};

/*
 * Fila serial assíncrona para persistência SRS.
 * Todas as gravações (respostas e undo) passam por _enqueueSrPersist(),
 * garantindo ordem consistente e evitando race conditions em undos rápidos.
 */
let _srQueue = Promise.resolve();

function _enqueueSrPersist(task) {
  _srQueue = _srQueue.then(task).catch(console.error);
  return _srQueue;
}

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

/*
 * [FIX-C1] _srAtualizar agora RETORNA a promise da fila serial.
 * Antes, _enqueueSrPersist era chamado mas seu retorno era descartado,
 * fazendo o `await _srAtualizar(...)` em _marcar resolver imediatamente
 * (enfileirou a tarefa) em vez de aguardar a persistência real.
 * Com a correção, _marcar aguarda a gravação completa antes de liberar
 * _estado.marcando, eliminando o race condition com undo rápido.
 */
async function _srAtualizar(cardId, acertou, diffMarcada) {
  const p = { ..._srPerfil(cardId) };

  p.tentativas++;

  if (acertou) {
    const multBase = { easy: 2.5, medium: 2.0, hard: 1.5 }[diffMarcada] ?? 2.0;

    // [M4] fatorPenalidadeTaxaAcerto penaliza intervalos quando
    // a taxa de acerto histórica é baixa (indica memorização superficial).
    let fatorPenalidadeTaxaAcerto = 1.0;
    const tentativasAnteriores = p.tentativas - 1;
    if (tentativasAnteriores >= MIN_TENTATIVAS_PENALIDADE) {
      const taxaAcerto = tentativasAnteriores > 0 ? p.acertos / tentativasAnteriores : 1.0;
      if (taxaAcerto < 0.40) fatorPenalidadeTaxaAcerto = 0.75;
      else if (taxaAcerto < 0.60) fatorPenalidadeTaxaAcerto = 0.85;
    }

    p.intervalo           = Math.min(Math.round(p.intervalo * multBase * fatorPenalidadeTaxaAcerto), 60);
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

  /*
   * [FIX-C1] Captura uid/discId/sem/perfil no momento da chamada (não na
   * closure assíncrona) — padrão [C1] original preservado.
   * Retorna a promise da fila para que o caller possa aguardar a
   * persistência real, não apenas o enfileiramento.
   *
   * [FIX-A1] _estado.nomeUsuario já é uma string UID normalizada desde
   * initCards() — leitura direta sem _resolverUid() redundante.
   */
  const uid    = _estado.nomeUsuario;
  const discId = _estado.discId;
  const sem    = _estado.semestre;
  const perfil = { ...p };

  return _enqueueSrPersist(async () => {
    try {
      await salvarPerfilSRS(uid, cardId, perfil, discId, sem);
    } catch (err) {
      console.error('[flashcard.js] Erro ao salvar SRS:', err);
    }
  });
}

/**
 * Persiste o perfil SRS revertido pelo undo na fila serial,
 * garantindo que esta gravação ocorra após qualquer gravação anterior em voo.
 *
 * [FIX-A1] _estado.nomeUsuario já é string UID — leitura direta.
 */
function _srPersistirUndo(cardId, perfilAnterior) {
  // [C1] Captura contexto no momento síncrono (antes de qualquer await).
  const uid    = _estado.nomeUsuario;
  const discId = _estado.discId;
  const sem    = _estado.semestre;
  const perfil = { ...perfilAnterior };

  _enqueueSrPersist(async () => {
    try {
      await salvarPerfilSRS(uid, cardId, perfil, discId, sem);
    } catch (err) {
      console.error('[flashcard.js] Erro ao persistir undo SRS:', err);
    }
  });
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
  // [A4] Bucket 'cedo' para cards revisados mas com revisão futura.
  let dominados = 0, vencidos = 0, novos = 0, cedo = 0;

  todos.forEach(card => {
    const p     = _srPerfil(card.id);
    const visto = p.tentativas > 0;
    if (!visto)                          novos++;
    else if (p.dominado)                 dominados++;
    else if (p.proximaVez <= agora)      vencidos++;
    else                                 cedo++;
  });

  return { total: todos.length, dominados, vencidos, novos, cedo };
}


/* ═════════════════════════════════════════════════════════════════
   3. ESTADO DA SESSÃO
   ═════════════════════════════════════════════════════════════════ */

const ESTADO_INICIAL = () => ({
  discId:        null,
  semestre:      null,
  nomeUsuario:   null,  // sempre string UID após initCards() — ver [FIX-A1]
  cardsData:     {},
  cards:         [],
  current:       0,
  flipped:       false,
  marcando:      false,
  // [C1] Lock separado para undo.
  desfazendo:    false,
  stats:         { correct: 0, wrong: 0 },
  difficulty:    {},
  resultado:     {},
  historico:     [],
  panelEl:       null,
  modoRevisao:   false,
  cardsRevisao:  null,
  // [FIX-C3] ID do setTimeout do flip — cancelado em destroyCards/_voltarParaIntro.
  _flipTimerId:  null,
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

/*
 * [FIX-M4] sessao.indice é clampleado ao intervalo válido [0, cards.length - 1].
 * Antes, um índice salvo com cards que foram removidos do deck entre sessões
 * resultava em _estado.current apontando para posição inexistente.
 */
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

  // [FIX-M4] Garante que current nunca aponte para índice out-of-bounds.
  const indiceRaw = sessao.indice ?? 0;
  const current   = cards.length > 0
    ? Math.min(Math.max(0, indiceRaw), cards.length - 1)
    : 0;

  return {
    cards,
    current,
    stats:       { correct: sessao.acertos ?? 0, wrong: sessao.erros ?? 0 },
    resultado,
    difficulty,
    modoRevisao: sessao.modoRevisao ?? false,
  };
}

/* ── Wrappers de persistência ──────────────────────────────────── */

/*
 * [FIX-M3] _salvarSessao envolve _nav.salvar em try/catch.
 * Antes, uma exceção síncrona de _nav.salvar (ex: SessionStorage cheio)
 * propagava para o caller e podia travar _estado.marcando indefinidamente.
 */
function _salvarSessao(imediato = false) {
  if (!_nav) return;
  const payload = _fcEstadoParaSessaoNav('question');
  try {
    if (imediato) {
      _nav.salvar(payload);
    } else {
      _nav.salvarThrottled(payload);
    }
  } catch (err) {
    console.error('[flashcard] Erro ao salvar sessão:', err);
  }
}

function _limparSessao() {
  _nav?.limpar();
}

function _sairParaRota() {
  _nav?.sairParaRota();
}

/**
 * Retorna true para qualquer valor que represente "card pendente":
 *   • undefined  — serialização antiga do SessionNav
 *   • null       — variante de inicialização
 *   • { v: '__p__' } — formato atual do SessionNav
 *
 * ATENÇÃO: deve permanecer sincronizado com o script anti-flash
 * bloqueante no HTML (que usa `r && r.v === '__p__'`).
 */
function _ehPendente(r) {
  if (r === undefined || r === null) return true;
  if (typeof r === 'object' && r.v === '__p__') return true;
  return false;
}

function _sessaoAtiva() {
  if (!_nav) return null;

  const sessao = _nav.lerSessao();
  if (!sessao?.perguntas?.length) return null;

  const pendentes   = sessao.respostas?.filter(_ehPendente).length ?? 0;
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

/*
 * [FIX-C3] _flipCard armazena o ID do timer em _estado._flipTimerId.
 * destroyCards e _voltarParaIntro cancelam o timer antes de remover o DOM,
 * prevenindo que o foco seja movido para um elemento já removido.
 * Antes, o timer era criado sem rastreamento e não havia forma de cancelá-lo.
 */
function _flipCard() {
  _estado.flipped = !_estado.flipped;
  const flipper = _estado.panelEl.querySelector('#cards-flipper');
  const back    = _estado.panelEl.querySelector('.cards-back');
  const front   = _estado.panelEl.querySelector('.cards-front');
  flipper?.classList.toggle('flipped', _estado.flipped);
  if (front) front.setAttribute('aria-hidden', _estado.flipped ? 'true' : 'false');
  if (back)  back.setAttribute('aria-hidden',  _estado.flipped ? 'false' : 'true');

  // [FIX-P11] + [FIX-C3] Acessibilidade: move foco para o primeiro botão
  // de resposta apenas se o usuário não preferir movimento reduzido.
  // O ID do timer é rastreado em _estado._flipTimerId para cancelamento
  // seguro em destroyCards/_voltarParaIntro.
  if (_estado.flipped) {
    const btnRight  = _estado.panelEl.querySelector('#cards-btn-right');
    const prefersRM = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (prefersRM) {
      // Com movimento reduzido a animação pode ser instantânea;
      // o foco pode ser movido imediatamente sem risco de desorientação.
      btnRight?.focus({ preventScroll: true });
    } else {
      // Cancela timer anterior ainda pendente (ex: flip duplo rápido).
      if (_estado._flipTimerId !== null) {
        clearTimeout(_estado._flipTimerId);
        _estado._flipTimerId = null;
      }
      // Aguarda o fim da transição CSS antes de mover o foco.
      // O valor 320ms cobre a duração padrão do flip (deve ser mantido
      // em sincronia com a variável CSS --fc-flip-duration se existir).
      _estado._flipTimerId = setTimeout(() => {
        _estado._flipTimerId = null;
        // [FIX-C3] Verifica se o elemento ainda está no DOM antes de focar,
        // prevenindo foco em elemento removido caso destroyCards tenha sido
        // chamado durante o timeout.
        if (btnRight && document.contains(btnRight)) {
          btnRight.focus({ preventScroll: true });
        }
      }, 320);
    }
  }
}

function _marcarDificuldade(diff) {
  const card = _estado.cards[_estado.current];
  if (!card) return;
  _estado.difficulty[card.id] = diff;
  _ui?.atualizarBotoesDiff(card.id);
  _ui?.atualizarBadgeDiff(card.id);
  // [FIX-B4] Persiste a dificuldade marcada na sessão.
  // Antes, um reload após marcar dificuldade (sem responder) perdia a marcação.
  _salvarSessao();
}

async function _marcar(acertou) {
  const { cards, current } = _estado;
  if (current >= cards.length || _estado.marcando) return;
  _estado.marcando = true;

  const card     = cards[current];
  const anterior = _estado.resultado[card.id];

  /*
   * [FIX-M1] O snapshot do histórico agora inclui a ordem atual de _estado.cards,
   * permitindo que _desfazer reverta também um embaralhamento anterior.
   * Antes, _embaralhar não adicionava snapshot, fazendo o undo reverter a resposta
   * mas manter a ordem embaralhada — comportamento confuso para o usuário.
   * Nota: o snapshot de cards é uma cópia rasa do array (referências aos objetos
   * de card são imutáveis no fluxo atual), o que é suficiente para restauração.
   */
  _estado.historico.push({
    current,
    cards:      [..._estado.cards],
    stats:      { ..._estado.stats },
    resultado:  { ..._estado.resultado },
    difficulty: { ..._estado.difficulty },
    srPerfilAnterior: { cardId: card.id, perfil: { ..._srPerfil(card.id) } },
  });

  _estado.resultado[card.id] = acertou ? 'correct' : 'wrong';

  if (anterior === 'correct') _estado.stats.correct = Math.max(0, _estado.stats.correct - 1);
  if (anterior === 'wrong')   _estado.stats.wrong   = Math.max(0, _estado.stats.wrong   - 1);
  acertou ? _estado.stats.correct++ : _estado.stats.wrong++;

  /*
   * [FIX-C1] Aguarda a promise retornada por _srAtualizar, que agora propaga
   * a promise da fila serial (_enqueueSrPersist). Isso garante que a persistência
   * no Firestore esteja completa antes de liberar _estado.marcando, eliminando
   * o race condition onde undo rápido revertia _srCache antes da gravação terminar.
   */
  await _srAtualizar(card.id, acertou, _estado.difficulty[card.id] || null);

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

/*
 * [FIX-M1] _embaralhar adiciona snapshot no histórico ANTES de reordenar.
 * O snapshot inclui a ordem atual de cards, stats, resultado e difficulty,
 * permitindo que _desfazer reverta tanto a resposta quanto o embaralhamento.
 *
 * NOTA SOBRE INTERAÇÃO COM _marcar:
 * O snapshot de _embaralhar não inclui srPerfilAnterior, pois _embaralhar
 * não muta o SRS. _desfazer verifica srPerfilAnterior antes de reverter o SRS.
 */
function _embaralhar() {
  // Snapshot do estado atual antes do embaralhamento.
  _estado.historico.push({
    current:    _estado.current,
    cards:      [..._estado.cards],
    stats:      { ..._estado.stats },
    resultado:  { ..._estado.resultado },
    difficulty: { ..._estado.difficulty },
    srPerfilAnterior: null,  // embaralhar não muta SRS
  });

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

/*
 * _desfazer agora restaura também _estado.cards do snapshot quando disponível,
 * revertendo um embaralhamento anterior se esse foi o último item do histórico.
 */
function _desfazer() {
  // [FIX-P6] Verifica também _estado.marcando: não permite undo enquanto
  // _srAtualizar está em voo, evitando que _srCache seja revertido antes
  // de a gravação anterior ser concluída e enfileirada corretamente.
  // [C1] Lock separado para undo: evita undos rápidos simultâneos.
  if (_estado.historico.length === 0 || _estado.desfazendo || _estado.marcando) return;
  _estado.desfazendo = true;

  const snapshot = _estado.historico.pop();

  _estado.current    = snapshot.current;
  _estado.stats      = { ...snapshot.stats };
  _estado.resultado  = { ...snapshot.resultado };
  _estado.difficulty = { ...snapshot.difficulty };
  _estado.flipped    = false;
  _estado.marcando   = false;

  // [FIX-M1] Restaura a ordem dos cards se o snapshot a inclui.
  // Snapshots de _embaralhar e _marcar (v6.4+) sempre incluem cards[].
  // Snapshots legados (antes de v6.4) podem não ter — guard necessário.
  if (Array.isArray(snapshot.cards)) {
    _estado.cards = [...snapshot.cards];
  }

  if (snapshot.srPerfilAnterior) {
    const { cardId, perfil } = snapshot.srPerfilAnterior;
    // [C1] Atualiza _srCache de forma síncrona ANTES de enfileirar a persistência.
    _srCache[cardId] = { ...perfil };
    _srPersistirUndo(cardId, perfil);
  }

  _salvarSessao();
  _ui?.render();
  _ui?.mostrarToastUndo();

  // Libera o lock apenas após enfileirar todas as operações.
  _estado.desfazendo = false;
}

function _reiniciar() {
  // [FIX-D1] Guard contra reinício durante marcação em voo.
  // _marcar faz await _srAtualizar (operação de rede); se _reiniciar
  // for disparado via atalho de teclado nessa janela, _estado.cards/
  // resultado/stats serão mutados antes da gravação SRS completar,
  // gravando o perfil do card anterior em um deck já substituído.
  // Padrão idêntico ao guard existente em _desfazer().
  if (_estado.marcando) return;

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
      _estado.flipped    = false;
      _estado.stats      = { correct: 0, wrong: 0 };
      _estado.difficulty = {};
      _estado.resultado  = {};
      _estado.marcando   = false;
      _estado.desfazendo = false;
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
  _estado.flipped    = false;
  _estado.stats      = { correct: 0, wrong: 0 };
  _estado.difficulty = {};
  _estado.resultado  = {};
  _estado.marcando   = false;
  _estado.desfazendo = false;
  _estado.historico  = [];

  _montarUINoPanel(_estado.panelEl, _estado.discId, _estado.cards, 'next');

  // [FIX-P7] Persiste o início da nova rodada imediatamente após remontar
  // a UI, garantindo que um reload logo após reiniciar em modoRevisao
  // encontre uma sessão válida em vez de cair no deck SRS normal.
  _salvarSessao(/* imediato */ true);
}

/**
 * Volta para a tela de intro de forma padronizada.
 * Persiste tela='intro' para que pegarRestauravel() retorne null
 * ao recarregar, mas lerSessao() ainda retorne para "Continuar".
 *
 * [FIX-P3] Remove a UI e reseta flags críticos de _estado ANTES de
 * retornar à intro, prevenindo que atalhos de teclado orphaned da
 * sessão anterior continuem ativos e mutando estado stale.
 *
 * [FIX-C3] Cancela o timer de flip pendente antes de destruir o DOM.
 */
function _voltarParaIntro() {
  // [FIX-C3] Cancela timer de flip antes de destruir referências DOM.
  if (_estado._flipTimerId !== null) {
    clearTimeout(_estado._flipTimerId);
    _estado._flipTimerId = null;
  }

  // Desregistra atalhos e limpa a referência de UI antes de qualquer
  // manipulação de DOM ou persistência. Se _ui for null (já destruída),
  // as chamadas são no-ops seguros.
  _ui?.removerAtalhos();
  _ui = null;

  // Reseta flags de operação para evitar leituras de estado stale
  // caso algum evento assíncrono pendente tente checar esses valores.
  _estado.marcando   = false;
  _estado.desfazendo = false;

  FcAntiFlash.mostrarTela('intro');
  document.body.classList.remove('modo-revisao');

  if (_nav) {
    _nav.salvar(_fcEstadoParaSessaoNav('intro'));
  }

  _atualizarBtnContinuar(_estado.discId, document.getElementById('card-root'), _estado.nomeUsuario);
}

/**
 * Navega diretamente para o card de índice i.
 * A UI não deve mutar estado.current diretamente — usa esta ação.
 * Valida que cards futuros não-respondidos não sejam acessíveis.
 *
 * [FIX-B2] Reseta _estado.flipped para false ao navegar.
 * Antes, navegar com o card virado deixava flipped=true no card destino,
 * podendo fazê-lo renderizar já na face de resposta dependendo da UI.
 */
function _irParaCard(i) {
  const { cards, resultado, current } = _estado;
  const cardAlvo = cards[i];
  if (i > current && cardAlvo && !resultado[cardAlvo.id]) return;
  const dir = i > current ? 'next' : 'prev';
  _estado.current = i;
  _estado.flipped = false;  // [FIX-B2] Garante que o card destino inicie não-virado.
  _salvarSessao();
  _ui?.render(dir);
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
  irParaCard:       _irParaCard,
};


/* ═════════════════════════════════════════════════════════════════
   7. API PÚBLICA
   ═════════════════════════════════════════════════════════════════ */

/**
 * [FIX-P2] Lock que previne chamadas concorrentes a initCards().
 * Sem este lock, double-tap em mobile ou cliques rápidos em
 * "Novo Deck" + "Continuar" poderiam correr em paralelo,
 * corrompendo _estado e duplicando o DOM.
 */
let _initEmAndamento = false;

/*
 * [FIX-A1] initCards normaliza nomeUsuario para string UID via _resolverUid()
 * ANTES de gravar em _estado. Isso garante que _estado.nomeUsuario seja
 * sempre uma string consistente, eliminando a divergência entre
 * _resolverUid(_estado.nomeUsuario) e _resolverUidFromUrl() que podia
 * causar gravações SRS com UID errado.
 *
 * A partir deste ponto, _srAtualizar e _srPersistirUndo leem
 * _estado.nomeUsuario diretamente sem nova resolução.
 */
export async function initCards(discId, panelEl, nomeUsuario, opcoes = {}) {
  // [FIX-P2] Rejeita chamadas concorrentes silenciosamente.
  if (_initEmAndamento) return;
  _initEmAndamento = true;

  try {
    // Remove UI anterior ANTES de qualquer await,
    // garantindo que a tela nunca fique travada em loading.
    destroyCards(panelEl);

    // [FIX-R1] Drena a fila SRS pendente antes de reiniciar.
    // Captura a referência ANTES do await — se _enqueueSrPersist enfileirar
    // uma nova tarefa durante o drain (ex: _marcar em voo), _srQueue terá
    // nova referência. O loop garante que todas as tarefas enfileiradas até
    // este ponto sejam concluídas antes de _srCache ser substituído.
    let filaAntes;
    do {
      filaAntes = _srQueue;
      await filaAntes;
    } while (_srQueue !== filaAntes);
    _srQueue = Promise.resolve();

    // Reexibe o skeleton de loading para feedback visual durante o carregamento.
    const skeletonEl = document.getElementById('card-skeleton');
    if (skeletonEl) skeletonEl.style.display = '';

    const { sem } = lerParams();

    Shell.init({ icon: '🃏', nome: 'Flashcards' });
    aplicarCoresDisciplina(discId, DISC_CORES);
    document.body.dataset.disc = discId;

    // Carrega dados dos cards — se falhar, exibe mensagem e aborta.
    let cardsData;
    try {
      cardsData = getCardsData(sem);
    } catch (err) {
      console.error('[flashcard] Erro ao carregar cards:', err);
      if (skeletonEl) skeletonEl.style.display = 'none';
      panelEl.innerHTML = `
        <div class="panel-cards">
          <div class="cards-empty">
            <i class="fas fa-circle-exclamation" aria-hidden="true"></i>
            <p>Não foi possível carregar os cards. Tente recarregar a página.</p>
          </div>
        </div>`;
      return;
    }

    if (!cardsData[discId]?.length) {
      if (skeletonEl) skeletonEl.style.display = 'none';
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

    // [FIX-A1] Normaliza para string UID UMA VEZ aqui.
    // Todo o restante do módulo lê _estado.nomeUsuario como string diretamente.
    const uid = _resolverUid(nomeUsuario);

    // [FIX-P1] Rastreia se o SRS carregou com sucesso para decidir
    // se a restauração de sessão é segura. Com _srCache vazio (fallback),
    // os perfis dos cards estão ausentes e a sessão restaurada montaria
    // um deck errado na próxima chamada a _srMontarDeck().
    let srsCarregouComFallback = false;
    try {
      _srCache = await carregarPerfisSRS(uid, discId, sem);
    } catch (err) {
      console.warn('[flashcard] Falha ao carregar SRS, usando cache vazio:', err);
      _srCache = {};
      srsCarregouComFallback = true;
    }

    // Oculta o skeleton após todos os awaits — o conteúdo real está pronto.
    if (skeletonEl) skeletonEl.style.display = 'none';

    // [FIX-P1] Só tenta restaurar sessão se o SRS carregou corretamente.
    // Com fallback vazio, restaurar a sessão causaria leituras de _srPerfil()
    // inconsistentes até o próximo carregamento bem-sucedido.
    const sessaoInfo = (!opcoes.modoRevisao && !srsCarregouComFallback)
      ? _sessaoAtiva()
      : null;

    let cards, estado;

    if (sessaoInfo) {
      const restaurado = _sessaoNavParaFcEstado(sessaoInfo.sessao, cardsData, discId);
      if (restaurado) {
        cards  = restaurado.cards;
        estado = {
          ...ESTADO_INICIAL(),
          discId,
          semestre:    sem,
          nomeUsuario: uid,  // [FIX-A1] sempre string UID normalizada
          cardsData,
          ...restaurado,
          panelEl,
        };
      } else {
        // [FIX-R3] Sessão descartada (cards removidos do conteúdo entre sessões):
        // limpa o storage para evitar que _sessaoAtiva() a reapresente no
        // próximo reload, criando um loop de "sessão zumbi" onde o botão
        // Continuar aparece indefinidamente com dados nunca restauráveis.
        _limparSessao();
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
        nomeUsuario:  uid,  // [FIX-A1] sempre string UID normalizada
        cardsData,
        cards,
        panelEl,
        modoRevisao:  opcoes.modoRevisao  ?? false,
        cardsRevisao: opcoes.cardsRevisao ?? null,
      };
    }

    _estado = estado;

    // Monta a UI sem destruir novamente (destroyCards já foi chamado no início).
    _montarUINoPanel(panelEl, discId, cards, 'next', /* destruir */ false);

  } finally {
    // [FIX-P2] Libera o lock em qualquer caso (sucesso ou erro),
    // garantindo que o botão de iniciar volte a funcionar corretamente.
    _initEmAndamento = false;
  }
}

/**
 * Monta (ou remonta) a instância de UI e o wrapper no painel.
 * Compartilhado por initCards() e _reiniciar() para evitar duplicação.
 *
 * @param {HTMLElement} panelEl
 * @param {string}      discId
 * @param {object[]}    cards
 * @param {string}      [direcao='next']  direção da animação de entrada
 * @param {boolean}     [destruir=true]   se true, chama destroyCards antes de montar
 */
function _montarUINoPanel(panelEl, discId, cards, direcao = 'next', destruir = true) {
  if (destruir) destroyCards(panelEl);
  _ui = criarUI(_estado, _ações, CONSTANTES);
  const wrap = _ui.criarWrapperEl(discId, cards);
  panelEl.appendChild(wrap);
  _ui.render(direcao);
  _ui.registrarAtalhos();
}

/*
 * [FIX-C3] / [FIX-A4] destroyCards cancela o timer de flip pendente
 * antes de remover o DOM. Antes, o setTimeout de 320ms em _flipCard
 * continuava rodando após destroyCards, tentando focar um elemento
 * já removido do documento.
 */
export function destroyCards(panelEl) {
  // [FIX-C3] Cancela timer de flip pendente antes de remover o DOM.
  if (_estado._flipTimerId !== null) {
    clearTimeout(_estado._flipTimerId);
    _estado._flipTimerId = null;
  }
  panelEl?.querySelector('.panel-cards')?.remove();
  _ui?.removerAtalhos();
  _ui = null;
  /*
   * NÃO destruímos o _nav aqui porque destroyCards é chamado no
   * início de initCards para limpar o DOM anterior — o _nav tem
   * ciclo de vida atrelado à página, não ao componente de cards.
   */
}

/*
 * Aliases de compatibilidade retroativa.
 * [B4] console.warn intencional para sinalizar migração.
 * Serão removidos em versão futura após migração de chamadas externas.
 */
export function exibirCards(...args) {
  console.warn('[flashcard] exibirCards() está depreciado. Use initCards().');
  return initCards(...args);
}
export function removerCards(...args) {
  console.warn('[flashcard] removerCards() está depreciado. Use destroyCards().');
  return destroyCards(...args);
}

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

/**
 * [FIX-P9] getDisciplinasDeSemestre é chamada UMA ÚNICA VEZ por invocação
 * de _introPreencherDados. O resultado é reutilizado em todos os locais
 * que precisam de dados de disciplina, eliminando a chamada redundante
 * que existia tanto aqui quanto dentro de _resolverLabelDisc.
 */
async function _introPreencherDados(disc, sem) {
  aplicarCoresDisciplina(disc, DISC_CORES);
  document.body.dataset.disc = disc;

  // [FIX-P9] Carrega disciplinas uma única vez e reutiliza abaixo.
  let disciplinas = [];
  try { disciplinas = getDisciplinasDeSemestre(sem) ?? []; } catch (_) {}
  const discObj = disciplinas.find(d => d.id === disc);

  // Resolve o label usando a lista já carregada (sem nova chamada a getDisciplinasDeSemestre).
  const label = _resolverLabelDiscDeLista(disc, disciplinas, disc ?? '—');

  const discLabelEl = document.getElementById('intro-disc-label');
  if (discLabelEl) discLabelEl.textContent = label;

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

  if (hdisc) hdisc.textContent = discObj?.apelido ?? discObj?.nome ?? disc ?? '—';
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
    // Idempotente: registra o listener apenas uma vez.
    if (!backBtn.dataset.fcBackListener) {
      backBtn.dataset.fcBackListener = '1';
      backBtn.addEventListener('click', () => {
        // [FIX-P12] Tenta navegar via SessionNav; se _nav for null
        // (carregamento parcial), usa fallback direto de URL para garantir
        // que o botão back sempre funcione.
        if (_nav) {
          _sairParaRota();
          _limparSessao();
        } else {
          const { sem: semAtual } = lerParams();
          location.href = `../../jogo.html${semAtual ? `?sem=${semAtual}` : ''}`;
        }
      });
    }
  }

  _introAtualizarBotaoRevisar(disc, sem, cardsData).catch(err => {
    console.warn('[flashcard] _introAtualizarBotaoRevisar falhou silenciosamente:', err);
  });
}

/**
 * [FIX-P5] + [FIX-A2] Valores de disc/root/usuario são armazenados em
 * data attributes no botão e lidos no momento do clique, evitando closures
 * stale quando _atualizarBtnContinuar for chamada múltiplas vezes.
 *
 * [FIX-A2] O elemento root é recuperado por ID no momento do clique —
 * se não existir no DOM, a chamada a initCards é abortada com aviso.
 */
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

  // [FIX-P5] Atualiza data attributes a cada chamada para que o handler
  // sempre leia os valores mais recentes, independente de quando foi registrado.
  btn.dataset.fcDisc    = disc;
  // root pode ser um elemento DOM — armazenamos o ID para recuperá-lo no click.
  btn.dataset.fcRootId  = root?.id ?? 'card-root';
  btn.dataset.fcUsuario = typeof usuario === 'string' ? usuario : (usuario?.uid ?? 'visitante');

  // Idempotente: registra o listener apenas uma vez.
  if (!btn.dataset.fcListener) {
    btn.dataset.fcListener = '1';
    btn.addEventListener('click', () => {
      // [FIX-P5] Lê os valores atuais dos data attributes (não da closure original).
      const d      = btn.dataset.fcDisc;
      const rootId = btn.dataset.fcRootId ?? 'card-root';
      // [FIX-A2] Valida que o elemento existe antes de chamar initCards.
      const rootEl = document.getElementById(rootId);
      if (!rootEl) {
        console.error(`[flashcard] _atualizarBtnContinuar: elemento #${rootId} não encontrado no DOM.`);
        return;
      }
      const usuario = btn.dataset.fcUsuario;
      FcAntiFlash.mostrarTela('game');
      initCards(d, rootEl, usuario);
    });
  }
}

/*
 * [FIX-R2] Token de versão incremental por chamada de _introAtualizarBotaoRevisar.
 * Incrementado a cada invocação; _atualizarBotaoComPerfis verifica se o token
 * ainda é o atual antes de atualizar o DOM, descartando respostas stale de
 * carregarPerfisSRS quando o usuário troca de disciplina antes da promise resolver.
 *
 * [FIX-A3] _introAtualizarBotaoRevisar não substitui btn._fcRevisarHandler
 * se o modal de revisão já estiver aberto (overlay visível).
 * Antes, a chegada dos dados remotos substituía o handler e, em seguida,
 * o fechar() do modal aberto tentava operar sobre novoOverlay correto, mas
 * o próximo clique em "Revisar" usaria dados do cache remoto enquanto o modal
 * exibido tinha dados do cache local — inconsistência visual.
 */
let _revisarTokenAtual = 0;

async function _introAtualizarBotaoRevisar(disc, sem, cardsData) {
  const btn     = document.getElementById('intro-revisar-btn');
  const countEl = document.getElementById('intro-revisar-count');
  if (!btn) return;

  // [FIX-R2] Captura o token no início desta invocação.
  // Se _introAtualizarBotaoRevisar for chamada novamente (troca de disciplina)
  // antes de carregarPerfisSRS resolver, _revisarTokenAtual será incrementado
  // e meuToken !== _revisarTokenAtual descartará a resposta stale.
  const meuToken = ++_revisarTokenAtual;

  try {
    const todos = cardsData[disc] ?? [];
    if (todos.length === 0) return;

    const uid = _resolverUidFromUrl();

    // Exibição imediata usando cache local (_srCache) — sem aguardar Firestore.
    const _atualizarBotaoComPerfis = (perfis) => {
      // [FIX-R2] Descarta resposta se a disciplina ativa mudou desde esta chamada.
      if (meuToken !== _revisarTokenAtual) return;

      // [FIX-A3] Não atualiza o handler se o modal já estiver aberto,
      // prevenindo inconsistência entre os dados exibidos no modal e
      // o handler que seria registrado com dados mais recentes.
      const overlay = document.getElementById('fc-modal-overlay');
      const modalAberto = overlay && !overlay.classList.contains('hidden');
      if (modalAberto) return;

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

      // Remove listener anterior antes de adicionar o novo,
      // evitando acúmulo de handlers ao reabrir ou atualizar dados remotos.
      if (btn._fcRevisarHandler) {
        btn.removeEventListener('click', btn._fcRevisarHandler);
      }
      btn._fcRevisarHandler = () => _abrirModalRevisao(comErro, perfis, disc, sem);
      btn.addEventListener('click', btn._fcRevisarHandler);
    };

    // Passo 1: renderiza imediatamente com cache local (sem delay visual).
    if (Object.keys(_srCache).length > 0) {
      _atualizarBotaoComPerfis(_srCache);
    }

    // Passo 2: atualiza silenciosamente com dados remotos quando disponíveis.
    const perfisRemoto = await carregarPerfisSRS(uid, disc, sem).catch(() => null);
    if (perfisRemoto) {
      _atualizarBotaoComPerfis(perfisRemoto);
    }

  } catch (err) {
    console.warn('[flashcard] Erro ao verificar cards com erro:', err.message);
  }
}

/*
 * [FIX-M2] Guard defensivo para todos os elementos DOM necessários.
 * Antes, a ausência de qualquer elemento (ex: HTML parcialmente carregado
 * ou ID renomeado) causava TypeError em tempo de execução sem mensagem útil.
 */
function _abrirModalRevisao(comErro, perfis, disc, sem) {
  const overlay  = document.getElementById('fc-modal-overlay');
  const lista    = document.getElementById('fc-modal-list');
  const btnStart = document.getElementById('fc-modal-start');
  const btnClose = document.getElementById('fc-modal-close');
  const btnCancel= document.getElementById('fc-modal-cancel');

  // [FIX-M2] Verifica todos os elementos necessários antes de operar.
  if (!overlay || !lista || !btnStart || !btnClose || !btnCancel) {
    console.warn('[flashcard] _abrirModalRevisao: elementos do modal ausentes no DOM.', {
      overlay: !!overlay, lista: !!lista, btnStart: !!btnStart,
      btnClose: !!btnClose, btnCancel: !!btnCancel,
    });
    return;
  }

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

    // [C2] Whitelist explícita de valores de cor e ícone.
    const COR_OK    = '#34d399';
    const COR_MED   = '#facc15';
    const COR_RUIM  = '#f87171';
    const ICONE_OK  = 'fa-check';
    const ICONE_MED = 'fa-minus';
    const ICONE_RUIM= 'fa-xmark';
    const cor   = taxa >= 70 ? COR_OK   : taxa >= 40 ? COR_MED   : COR_RUIM;
    const icone = taxa >= 70 ? ICONE_OK : taxa >= 40 ? ICONE_MED : ICONE_RUIM;

    const frente = card.frente ?? card.pergunta ?? '';
    const trecho = frente.length > 72 ? frente.slice(0, 72) + '…' : frente;

    // [C2] Criação explícita de elementos DOM (sem innerHTML com dados externos).
    const row = document.createElement('div');
    row.className = 'fc-modal-row';
    row.setAttribute('role', 'listitem');

    const spanIcon = document.createElement('span');
    spanIcon.className = 'fc-modal-row__icon';
    spanIcon.style.color = cor;
    const iEl = document.createElement('i');
    iEl.className = `fas ${icone}`;
    iEl.setAttribute('aria-hidden', 'true');
    spanIcon.appendChild(iEl);

    const spanText = document.createElement('span');
    spanText.className = 'fc-modal-row__text';
    spanText.textContent = trecho;

    const spanStat = document.createElement('span');
    spanStat.className = 'fc-modal-row__stat';
    spanStat.style.color = cor;
    spanStat.textContent = `${p.acertos}/${p.tentativas} `;
    const spanPct = document.createElement('span');
    spanPct.className = 'fc-modal-row__pct';
    spanPct.textContent = `${taxa}%`;
    spanStat.appendChild(spanPct);

    row.appendChild(spanIcon);
    row.appendChild(spanText);
    row.appendChild(spanStat);
    lista.appendChild(row);
  }

  // Clona para evitar acúmulo de listeners ao reabrir o modal.
  const novoClose  = btnClose.cloneNode(true);
  btnClose.parentNode.replaceChild(novoClose, btnClose);

  const novoCancel = btnCancel.cloneNode(true);
  btnCancel.parentNode.replaceChild(novoCancel, btnCancel);

  // Clona overlay para limpar listener de clique-fora acumulado.
  // IMPORTANTE: novoOverlay deve ser criado ANTES de fechar() ser definido,
  // pois fechar() precisa referenciar novoOverlay (não o overlay original removido).
  const novoOverlay = overlay.cloneNode(false);
  while (overlay.firstChild) novoOverlay.appendChild(overlay.firstChild);
  overlay.parentNode.replaceChild(novoOverlay, overlay);

  // [A2] Clona o btnStart APÓS o novoOverlay estar no DOM.
  // { once: true } no handler de start impede double-init por clique duplo.
  const novoStart = btnStart.cloneNode(true);
  btnStart.parentNode.replaceChild(novoStart, btnStart);

  // Focus trap — impede navegação via TAB para fora do modal.
  const FOCUSABLE = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const modalEl   = novoOverlay.querySelector('#fc-modal');

  // [B2] Atributos ARIA para leitores de tela.
  if (modalEl) {
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    const titulo = modalEl.querySelector('h2, h3, [id$="-title"]');
    if (titulo) {
      if (!titulo.id) titulo.id = 'fc-modal-title';
      modalEl.setAttribute('aria-labelledby', titulo.id);
    }
  }

  let _trapFn = null;

  // fechar() opera sobre novoOverlay (o nó atual no DOM).
  // [M1] try/finally garante que overflow e listeners sejam sempre restaurados.
  function fechar() {
    try {
      novoOverlay.classList.add('hidden');
    } finally {
      document.body.style.overflow = '';
      if (_trapFn) document.removeEventListener('keydown', _trapFn);
      document.removeEventListener('keydown', _escapeFn);
    }
  }

  novoOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // [A2] { once: true } no handler de start: garante que clique duplo rápido
  // não dispare dois initCards() concorrentes.
  // [FIX-P2] O lock _initEmAndamento em initCards() também protege este caso,
  // mas { once: true } mantém como camada de defesa adicional.
  novoStart.addEventListener('click', () => {
    fechar();
    FcAntiFlash.mostrarTela('game');
    const usuario = _resolverUidFromUrl();
    initCards(disc, document.getElementById('card-root'), usuario, { modoRevisao: true, cardsRevisao: ordenados });
  }, { once: true });

  novoClose .addEventListener('click', fechar,  { once: true });
  novoCancel.addEventListener('click', fechar,  { once: true });
  novoOverlay.addEventListener('click', e => { if (e.target === novoOverlay) fechar(); }, { once: true });

  if (modalEl) {
    const getFocusaveis = () => [...modalEl.querySelectorAll(FOCUSABLE)];
    getFocusaveis()[0]?.focus();

    _trapFn = e => {
      if (e.key !== 'Tab') return;
      const els   = getFocusaveis();
      if (!els.length) return;
      const first = els[0];
      const last  = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', _trapFn);
  }

  // Fecha com Escape. { once: true } garante auto-limpeza.
  const _escapeFn = e => { if (e.key === 'Escape') fechar(); };
  document.addEventListener('keydown', _escapeFn, { once: true });
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

   [FIX-P10] A IIFE é executada somente quando o documento está pronto,
   prevenindo side effects em imports fora do contexto de página
   (ex: testes unitários, outros bundles).
   ═════════════════════════════════════════════════════════════════ */

/**
 * [FIX-P4] Versão async do auto-init para permitir await em
 * _introPreencherDados() no caminho de restauração de sessão,
 * evitando que FcAntiFlash.pronto() seja chamado antes que o
 * DOM da intro esteja totalmente preenchido.
 *
 * [FIX-M6] Após restauração, verifica se cardsData[disc] está vazio.
 * Se sim, redireciona para a intro em vez de travar na tela de game
 * sem opção de saída visível.
 */
async function _autoInit() {
  const root = document.getElementById('card-root');
  if (!root) return;

  const { disc, sem } = lerParams();
  if (!disc) return;

  const uid = _resolverUidFromUrl();

  _navInicializar(uid, disc, sem);

  const sessaoRestauravel = _nav.pegarRestauravel();

  if (sessaoRestauravel) {
    // [FIX-M6] Verifica antecipadamente se há cards disponíveis para a disciplina.
    // Se não houver, a tela de game exibiria a mensagem de "vazio" sem botão de saída.
    // Neste caso, redireciona para a intro onde o usuário tem contexto e ação clara.
    let cardsDisponiveis = false;
    try {
      const cardsData = getCardsData(sem);
      cardsDisponiveis = (cardsData[disc]?.length ?? 0) > 0;
    } catch (_) {}

    if (!cardsDisponiveis) {
      // Deck ficou vazio (conteúdo removido) — descarta a sessão salva e vai para intro.
      _nav.limpar();
      document.documentElement.removeAttribute('data-fc-restore');
      // Continua para o caminho normal da intro abaixo.
    } else {
      // [FIX-P4] Aguarda o preenchimento da intro ANTES de chamar pronto(),
      // garantindo que não haja flash de conteúdo vazio na tela intro
      // caso o usuário volte para ela logo após a restauração.
      await _introPreencherDados(disc, sem);
      FcAntiFlash.mostrarTela('game');
      initCards(disc, root, uid);
      FcAntiFlash.pronto();
      return;
    }
  }

  const sessaoPausada = _sessaoAtiva();

  if (!sessaoPausada) {
    _nav.limpar();
    document.documentElement.removeAttribute('data-fc-restore');
  }

  // No caminho normal (sem restauração), _introPreencherDados pode rodar
  // sem await pois FcAntiFlash.pronto() não depende do seu resultado aqui.
  _introPreencherDados(disc, sem).catch(err =>
    console.warn('[flashcard] _introPreencherDados falhou silenciosamente:', err)
  );
  _atualizarBtnContinuar(disc, root, uid);

  const startBtn = document.getElementById('intro-start-btn');
  if (startBtn && !startBtn.dataset.fcListener) {
    startBtn.dataset.fcListener = '1';
    startBtn.addEventListener('click', () => {
      _nav.limpar();
      document.getElementById('intro-fc-btn-continuar')?.classList.add('hidden');
      FcAntiFlash.mostrarTela('game');
      initCards(disc, root, uid);
    });
  }

  FcAntiFlash.pronto();
}

// [FIX-P10] Executa _autoInit somente em contexto de página real.
// Se o módulo for importado em testes ou outros bundles sem DOM de página,
// a IIFE original rodaria imediatamente causando side effects indesejados.
if (typeof document !== 'undefined' && document.getElementById('card-root')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => _autoInit().catch(console.error));
  } else {
    _autoInit().catch(console.error);
  }
}