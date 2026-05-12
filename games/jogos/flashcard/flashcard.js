/* ═══════════════════════════════════════════════════════════════════
   NEXUS STUDY — games/jogos/flashcard/flashcard.js  (v5.0)

   REFATORAÇÃO v5.0 — Integração com session-nav.js
   ──────────────────────────────────────────────────
   • SessionManager (seção 4) e SessionGuard (seção 5) REMOVIDOS.
     Toda a responsabilidade de persistência, anti-flash, detecção
     de reload e limpeza de sessão agora pertence ao SessionNav
     importado de ../../template/session-nav.js.

   • FcNavBridge (seção 4-nova) faz a ponte entre o contrato do
     SessionNav (voltado a jogos VF) e o esquema de dados do
     flashcard (cards[], resultado{}, difficulty{}, stats{}).

   • FcAntiFlash (seção 5-nova) encapsula a lógica de visibilidade
     de telas intro/game que antes estava no script bloqueante do
     HTML e no inline do flashcard.

   CONTRATO DE USO DO SESSION-NAV PARA FLASHCARD
   ──────────────────────────────────────────────
   O SessionNav foi projetado para jogos VF; o flashcard tem um
   esquema diferente. A estratégia adotada é:
     • Mapeamos o estado do flashcard para os campos do SessionNav
       no momento de salvar (fcEstadoParaSessaoNav).
     • Ao restaurar, fazemos o caminho inverso (sessaoNavParaFcEstado).
     • O campo `tela` do SessionNav é usado para distinguir
       'game' (sessão em andamento) de 'intro' (pausado).
     • pegarRestauravel() retorna apenas quando `tela === 'question'`
       E houver pendentes — mesmo semântica de antes.

   Seções:
     1.  IMPORTS & CONSTANTES
     2.  ENGINE DE SPACED REPETITION (SRS)
     3.  ESTADO DA SESSÃO
     4.  FC-NAV BRIDGE — adapta SessionNav ao esquema do flashcard
     5.  FC ANTI-FLASH  — controla visibilidade das telas
     6.  ATALHOS DE TECLADO
     7.  DESFAZER (UNDO)
     8.  TEMPLATES HTML
     9.  RENDER
    10.  ATUALIZAÇÕES DE UI
    11.  AÇÕES DO USUÁRIO
    12.  API PÚBLICA  →  initCards / destroyCards
    13.  INTRO         →  preenchimento, botões, modal
    14.  AUTO-INIT
═══════════════════════════════════════════════════════════════════ */

/* ── 1. IMPORTS & CONSTANTES ──────────────────────────────────── */

import { SessionNav }                          from '../../template/session-nav.js';
import { getCardsData }                        from '../../../content/game/flashcards/cards_data.js';
import { carregarPerfisSRS, salvarPerfilSRS }  from './storage.js';
import { Shell, lerParams }                    from '../../template/game-shell.js';
import { getUsuario, getDisciplinasDeSemestre } from '../../../src/global.js';
import { DISC_CORES }                          from '../../../shared/js/cores.js';
import { aplicarCoresDisciplina }              from '../../../shared/js/theme.js';

/*
 * ANTI-FLASH SÍNCRONO
 * Deve ser chamado o mais cedo possível no carregamento do módulo,
 * antes de qualquer await, para que o CSS de ocultação seja injetado
 * antes do primeiro paint do browser.
 * SessionNav.criar() também chama isso, mas se houver awaits antes
 * dele, o browser pode já ter renderizado. Chamamos aqui para garantia.
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
   • pontos     → serialização compacta de difficulty{}
                  (JSON stringificado, armazenado como número 0 pois
                   SessionNav valida pontos >= 0; usamos campo `tempos`
                   para carregar difficulty de volta)
   • tela       → 'question' durante o jogo, 'intro' na tela de inicio

   NOTA: O campo `tempos` é reutilizado para transportar as
   dificuldades por card. É um array do mesmo tamanho que `perguntas`,
   onde cada posição contém a dificuldade marcada para aquele card
   (ou null se não marcada). Isso permite restauração fiel.
   ═════════════════════════════════════════════════════════════════ */

/** Instância singleton do SessionNav para o flashcard atual. */
let _nav = null;

/**
 * Inicializa (ou reinicializa) o SessionNav com os parâmetros
 * da disciplina e usuário atuais.
 * Deve ser chamado uma única vez por sessão de página.
 *
 * @param {string} uid     - ID do usuário
 * @param {string} discId  - ID da disciplina
 * @param {string} sem     - Semestre
 */
function _navInicializar(uid, discId, sem) {
  // Destrói instância anterior se existir (evita listeners duplicados).
  _nav?.destruir();

  /*
   * A chave do SessionNav usa uid+discId+sem para isolamento total.
   * O prefixo padrão do SessionNav é 'nexus_vf_sessao_'; mantemos
   * isso como está — é uma chave de armazenamento interna.
   */
  _nav = SessionNav.criar({
    uid,
    discId,
    sem,
    ttlMs:      24 * 60 * 60 * 1000,
    throttleMs: 150,
  });
}

/**
 * Converte o estado interno do flashcard para o formato esperado
 * pelo SessionNav.salvar().
 *
 * @param {string} tela - 'question' | 'intro' | 'result'
 */
function _fcEstadoParaSessaoNav(tela = 'question') {
  const { cards, resultado, difficulty, stats, current, modoRevisao } = _estado;

  // IDs dos cards como "perguntas"
  const perguntas = cards.map(c => c.id);

  // Respostas: undefined = não respondido, true = acertei, false = errei
  const respostas = cards.map(c => {
    const r = resultado[c.id];
    if (r === 'correct') return true;
    if (r === 'wrong')   return false;
    return undefined;
  });

  // Dificuldades paralelas — reutilizamos o campo `tempos`
  const tempos = cards.map(c => difficulty[c.id] ?? null);

  return {
    perguntas,
    respostas,
    tempos,
    indice:      current,
    pontos:      0,               // não usado pelo flashcard
    acertos:     stats.correct,
    erros:       stats.wrong,
    modoRevisao: modoRevisao ?? false,
    tela,                         // 'question' permite restauração automática
  };
}

/**
 * Reconstrói o estado parcial do flashcard a partir de uma sessão
 * lida pelo SessionNav.
 * Retorna null se a sessão for inválida ou incompleta.
 *
 * @param {object}   sessao    - Sessão retornada por lerSessao() ou pegarRestauravel()
 * @param {object}   cardsData - Dados completos dos cards da disciplina
 * @param {string}   discId
 * @returns {{ cards, current, stats, resultado, difficulty } | null}
 */
function _sessaoNavParaFcEstado(sessao, cardsData, discId) {
  if (!sessao?.perguntas?.length) return null;

  const todosDaDisc = cardsData[discId] ?? [];
  const cardsById   = Object.fromEntries(todosDaDisc.map(c => [c.id, c]));

  // Reconstrói objetos de card a partir dos IDs salvos
  const cards = sessao.perguntas
    .map(id => cardsById[id])
    .filter(Boolean);

  // Se algum ID não foi encontrado nos dados atuais, a sessão está corrompida
  if (cards.length !== sessao.perguntas.length) {
    console.warn('[flashcard] Sessão descartada: cards não encontrados no deck atual.');
    return null;
  }

  // Reconstrói resultado{}
  const resultado = {};
  sessao.respostas?.forEach((r, i) => {
    const id = sessao.perguntas[i];
    if (r === true)       resultado[id] = 'correct';
    else if (r === false) resultado[id] = 'wrong';
    // undefined = pendente → não inclui no resultado
  });

  // Reconstrói difficulty{} a partir de tempos[]
  const difficulty = {};
  sessao.tempos?.forEach((diff, i) => {
    if (diff) difficulty[sessao.perguntas[i]] = diff;
  });

  return {
    cards,
    current:    sessao.indice  ?? 0,
    stats:      { correct: sessao.acertos ?? 0, wrong: sessao.erros ?? 0 },
    resultado,
    difficulty,
    modoRevisao: sessao.modoRevisao ?? false,
  };
}

/* ── Wrappers de persistência ──────────────────────────────────── */

/** Persiste o estado atual como sessão em andamento. */
function _salvarSessao(imediato = false) {
  if (!_nav) return;
  const payload = _fcEstadoParaSessaoNav('question');
  if (imediato) {
    _nav.salvar(payload);
  } else {
    _nav.salvarThrottled(payload);
  }
}

/** Remove a sessão e reseta cache. Chame ao finalizar ou ao voltar. */
function _limparSessao() {
  _nav?.limpar();
}

/**
 * Sinaliza saída real da página (ex: botão Voltar do header).
 * O beforeunload do SessionNav não irá setar o stay-flag,
 * garantindo que a próxima visita não restaure automaticamente.
 * Sempre use junto com _limparSessao():
 *   _sairParaRota();
 *   _limparSessao();
 */
function _sairParaRota() {
  _nav?.sairParaRota();
}

/**
 * Verifica se existe sessão válida em andamento (cards pendentes).
 * Não depende de reload-flag — útil para o botão "Continuar".
 * @returns {{ sessao, pendentes, respondidos, total } | null}
 */
function _sessaoAtiva() {
  if (!_nav) return null;

  const sessao = _nav.lerSessao();
  if (!sessao?.perguntas?.length) return null;

  // Conta pendentes: respostas undefined
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

   O SessionNav injeta CSS que oculta os elementos de tela genéricos
   (#screen-intro, #screen-question etc.). Para o flashcard, que usa
   IDs próprios (#intro-root, #card-root), mantemos o atributo
   data-fc-restore no <html> como mecanismo complementar — o CSS
   bloqueante no HTML já trata esse atributo antes do primeiro paint.

   Responsabilidades:
   • mostrarTela()   — exibe uma tela e oculta a outra
   • pronto()        — sinaliza ao SessionNav que a tela correta
                       foi exibida (remove anti-flash + consome flag)
   ═════════════════════════════════════════════════════════════════ */

const FcAntiFlash = {
  /**
   * Exibe a tela alvo e oculta a outra.
   * @param {'intro' | 'game'} tela
   */
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

  /**
   * Remove o anti-flash e consome o reload-flag.
   * Deve ser chamado APÓS mostrarTela() para que o primeiro frame
   * pintado já seja o frame correto.
   */
  pronto() {
    _nav?.pronto();
  },
};

/* ═════════════════════════════════════════════════════════════════
   6. ATALHOS DE TECLADO
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
   7. DESFAZER (UNDO)
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
   8. TEMPLATES HTML
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
    ? `<div class="cards-dica-wrap">
         <button class="cards-dica-btn" type="button" aria-label="Ver dica" aria-expanded="false" id="cards-dica-btn">
           <i class="fas fa-lightbulb" aria-hidden="true"></i>
           <span class="cards-dica-btn__label">Dica</span>
         </button>
         <div class="cards-dica cards-dica--oculta" id="cards-dica-texto" aria-live="polite">
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
  const { discId, cards, stats, difficulty, modoRevisao } = _estado;
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

  const badgeRevisao = modoRevisao
    ? `<div class="finish-revisao-badge"><i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Revisão de erros</div>`
    : '';

  const cardsAindaComErro = modoRevisao
    ? (_estado.cardsRevisao ?? []).filter(card => {
        const p = _srPerfil(card.id);
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
              const p   = _srPerfil(card.id);
              const pct = p.dominado ? 100 : Math.min(Math.round((p.acertosConsecutivos / ACERTOS_PARA_DOMINAR) * 100), 99);
              const cls = p.dominado ? 'prog-dominado' : pct >= 66 ? 'prog-quase' : pct >= 33 ? 'prog-meio' : 'prog-inicio';
              const resStr = _estado.resultado[card.id] === 'correct' ? 'correct' : _estado.resultado[card.id] === 'wrong' ? 'wrong' : '';
              const iconRes = resStr === 'correct'
                ? '<i class="fas fa-check prog-icon-correct" aria-hidden="true"></i>'
                : resStr === 'wrong'
                  ? '<i class="fas fa-xmark prog-icon-wrong" aria-hidden="true"></i>'
                  : '';
              const pergunta = _esc((card.frente ?? card.pergunta ?? '').slice(0, 48)) + ((card.frente ?? card.pergunta ?? '').length > 48 ? '…' : '');
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
                    <div class="finish-prog-bar-fill ${cls}" style="width:${pct}%"></div>
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

function _tplWrapper(discId, cards) {
  const { modoRevisao } = _estado;

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
   9. RENDER
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
    // Sessão concluída — limpa para não restaurar na próxima visita.
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

  const dicaBtn = wrap.querySelector('#cards-dica-btn');
  const dicaTxt = wrap.querySelector('#cards-dica-texto');
  if (dicaBtn && dicaTxt) {
    dicaBtn.addEventListener('click', e => {
      e.stopPropagation();
      const aberta = dicaTxt.classList.toggle('cards-dica--visivel');
      dicaTxt.classList.toggle('cards-dica--oculta', !aberta);
      dicaBtn.classList.toggle('cards-dica-btn--ativa', aberta);
      dicaBtn.setAttribute('aria-expanded', String(aberta));
    });
  }

  _estado.flipped = false;
  _atualizarBotoesDiff(card.id);
  _atualizarBadgeDiff(card.id);
  _atualizarResultadoVisual(card.id);
  _atualizarUI();
}

/* ═════════════════════════════════════════════════════════════════
   10. ATUALIZAÇÕES DE UI
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
   11. AÇÕES DO USUÁRIO
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

  _atualizarResultadoVisual(card.id);

  _estado.marcando = false;

  // Salva imediatamente após marcar — é a ação mais crítica para persistência.
  _salvarSessao(/* imediato */ true);
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

  let novasCards;
  if (_estado.modoRevisao) {
    const todosRevisao = _estado.cardsRevisao ?? [];
    const aindaComErro = todosRevisao.filter(card => {
      const p = _srPerfil(card.id);
      return p.erros > 0 && p.acertosConsecutivos === 0;
    });

    if (aindaComErro.length === 0) {
      _estado.cards     = [];
      _estado.current   = 0;
      _estado.stats     = { correct: 0, wrong: 0 };
      _estado.difficulty= {};
      _estado.resultado = {};
      _estado.marcando  = false;
      _estado.historico = [];
      const panelEl = _estado.panelEl;
      panelEl.querySelector('.panel-cards')?.remove();
      const wrap = document.createElement('div');
      wrap.className = 'panel-cards';
      wrap.dataset.disc = _estado.discId;
      wrap.dataset.revisao = 'true';
      wrap.innerHTML = _tplRevisaoConcluida();
      panelEl.appendChild(wrap);
      wrap.querySelector('#revisao-concluida-voltar')?.addEventListener('click', () => {
        _voltarParaIntro();
      });
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
  const wrap = _criarWrapperEl(_estado.discId, _estado.cards);
  panelEl.appendChild(wrap);
  _renderCard('next');
}

/**
 * Volta para a tela de intro de forma padronizada.
 *
 * • Persiste tela='intro' para que pegarRestauravel() retorne null
 *   ao recarregar (o usuário não estava no jogo), mas lerSessao()
 *   ainda retorne a sessão para o botão "Continuar".
 * • Remove o atributo data-fc-restore para liberar o CSS bloqueante.
 * • NÃO chama sairParaRota() — a sessão deve continuar recuperável.
 */
function _voltarParaIntro() {
  FcAntiFlash.mostrarTela('intro');
  document.body.classList.remove('modo-revisao');

  /*
   * Persiste o estado como 'intro' (não 'question').
   * Isso faz pegarRestauravel() retornar null no próximo reload
   * (evita restauração automática), mas a sessão continua no
   * localStorage para o botão "Continuar".
   */
  if (_nav) {
    _nav.salvar(_fcEstadoParaSessaoNav('intro'));
  }

  // Oculta o badge do header ao voltar para o início.
  const hbadge = document.getElementById('header-game-badge');
  if (hbadge) hbadge.style.display = 'none';

  // Reconfigurar o botão Continuar sem recriar o nó — apenas atualiza o estado.
  _atualizarBtnContinuar(_estado.discId, document.getElementById('card-root'), _estado.nomeUsuario);
}

function _criarWrapperEl(discId, cards) {
  const wrap = document.createElement('div');
  wrap.className    = 'panel-cards';
  wrap.dataset.disc = discId;
  if (_estado.modoRevisao) wrap.dataset.revisao = 'true';
  wrap.innerHTML    = _tplWrapper(discId, cards);

  document.body.classList.toggle('modo-revisao', !!_estado.modoRevisao);

  wrap.querySelector('#cards-btn-wrong')  ?.addEventListener('click', () => _marcar(false));
  wrap.querySelector('#cards-btn-right')  ?.addEventListener('click', () => _marcar(true));
  wrap.querySelector('#cards-btn-prev')   ?.addEventListener('click', _anterior);
  wrap.querySelector('#cards-btn-next')   ?.addEventListener('click', _proximo);
  wrap.querySelector('#cards-btn-shuffle')?.addEventListener('click', _embaralhar);
  wrap.querySelector('#cards-btn-undo')   ?.addEventListener('click', _desfazer);

  wrap.querySelector('#cards-btn-inicio')?.addEventListener('click', _voltarParaIntro);

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
   12. API PÚBLICA
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

  // Tenta restaurar sessão salva, exceto em modo revisão
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
      semestre: sem,
      nomeUsuario,
      cardsData,
      cards,
      panelEl,
      modoRevisao:  opcoes.modoRevisao  ?? false,
      cardsRevisao: opcoes.cardsRevisao ?? null,
    };
  }

  _estado = estado;

  const wrap = _criarWrapperEl(discId, cards);
  panelEl.appendChild(wrap);
  _renderCard();
  _registrarAtalhos();

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
  _removerAtalhos();
  /*
   * NÃO destruímos o _nav aqui porque destroyCards é chamado no
   * início de initCards para limpar o DOM anterior — o _nav é
   * criado/destruído em _navInicializar(), que tem ciclo de vida
   * atrelado à página completa, não ao componente de cards.
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
   13. INTRO — preenchimento de dados, botões e modal
   ═════════════════════════════════════════════════════════════════ */

/** Preenche os dados da tela de intro. */
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
      /*
       * SAÍDA REAL: o usuário está saindo do fluxo de flashcards.
       * 1. sairParaRota() → beforeunload não seta stay-flag.
       * 2. limpar()       → remove sessão do localStorage.
       * Resultado: próxima visita abre tela inicial, não questões antigas.
       */
      _sairParaRota();
      _limparSessao();
    }, { once: true });
  }

  _introAtualizarBotaoRevisar(disc, sem, cardsData);
}

/**
 * Atualiza o botão "Continuar" de forma idempotente — sem clonar nós.
 * Usa um atributo data- para rastrear se o listener já foi registrado.
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

  // Atualiza o contador.
  if (countEl) countEl.textContent = `${info.respondidos}/${info.total}`;
  btn.classList.remove('hidden');

  // Registra o listener apenas uma vez (guarda pela flag data-fc-listener).
  if (!btn.dataset.fcListener) {
    btn.dataset.fcListener = '1';
    btn.addEventListener('click', () => {
      FcAntiFlash.mostrarTela('game');
      initCards(disc, root, usuario);
    });
  }
}

/** Carrega o SRS e exibe/oculta o botão de revisão com a contagem correta. */
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

    // Idempotente: registra o listener apenas uma vez.
    if (!btn.dataset.fcListener) {
      btn.dataset.fcListener = '1';
      btn.addEventListener('click', () => _abrirModalRevisao(comErro, perfis, disc, sem));
    }

  } catch (err) {
    console.warn('[flashcard] Erro ao verificar cards com erro:', err.message);
  }
}

/** Modal de revisão de erros. */
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

  // Cria cópias limpas dos botões para evitar acúmulo de listeners.
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
   14. AUTO-INIT STANDALONE
   ──────────────────────────────────────────────────────────────────
   Fluxo de inicialização da página integrado ao SessionNav:

   1. Deriva uid/disc/sem da URL.
   2. Inicializa o SessionNav com _navInicializar() (cria instância,
      injeta anti-flash).
   3. Chama pegarRestauravel() — verifica reload-flag + sessão válida.
      • Se retornar sessão com tela='question': restaura diretamente.
      • Caso contrário: verifica se existe sessão pausada (tela='intro')
        para exibir botão "Continuar", ou abre tela limpa.
   4. Chama FcAntiFlash.pronto() para remover CSS de ocultação e
      consumir o reload-flag.

   FALLBACK DE SEGURANÇA
   ──────────────────────
   Se o estado salvo estiver corrompido (_sessaoNavParaFcEstado
   retornar null), a sessão é descartada e o fluxo continua
   normalmente pela intro, sem abrir questões antigas.
   ═════════════════════════════════════════════════════════════════ */
(function _autoInit() {
  const root = document.getElementById('card-root');
  if (!root) return;

  const { disc, sem } = lerParams();
  if (!disc) return;

  const uid = new URLSearchParams(location.search).get('user')
           ?? getUsuario()?.uid
           ?? 'visitante';

  /*
   * PASSO 1: Inicializa o SessionNav.
   * Injeta anti-flash sincronamente e registra os listeners de ciclo
   * de vida (beforeunload, pagehide, popstate).
   */
  _navInicializar(uid, disc, sem);

  /*
   * PASSO 2: Verifica se é um reload com sessão restaurável.
   * pegarRestauravel() retorna a sessão apenas se:
   *   • Stay-flag presente (foi reload, não nova entrada)
   *   • Sessão com tela='question' (estava no jogo)
   *   • Há cards pendentes
   */
  const sessaoRestauravel = _nav.pegarRestauravel();

  if (sessaoRestauravel) {
    /*
     * RESTAURAÇÃO DIRETA: o CSS bloqueante no <html> já ocultou a intro
     * e exibiu o card-root antes do primeiro paint.
     * Aqui apenas preenchemos o header e iniciamos o jogo silenciosamente.
     */
    _introPreencherDados(disc, sem); // preenche header em segundo plano
    FcAntiFlash.mostrarTela('game');
    initCards(disc, root, uid);
    FcAntiFlash.pronto(); // remove anti-flash + consome reload-flag
    return;
  }

  /*
   * PASSO 3: Sem restauração automática.
   * Verifica se há sessão pausada (tela='intro') para o botão "Continuar".
   * Uma sessão é "pausada" quando o usuário clicou em "Voltar ao início"
   * enquanto havia progresso — ela fica no localStorage com tela='intro'.
   */
  const sessaoPausada = _sessaoAtiva();

  if (!sessaoPausada) {
    /*
     * Sem sessão de nenhum tipo: limpa qualquer resquício (ex: sessão
     * expirada que não passou pelo TTL check, chave antiga do esquema
     * anterior) e abre a intro limpa.
     */
    _nav.limpar();
    document.documentElement.removeAttribute('data-fc-restore');
  }

  /*
   * PASSO 4: Exibe a intro.
   * Preenche dados e configura botões. O botão "Continuar" só aparece
   * se sessaoPausada existir.
   */
  _introPreencherDados(disc, sem);
  _atualizarBtnContinuar(disc, root, uid);

  const startBtn = document.getElementById('intro-start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      /*
       * "Começar" nova sessão: descarta qualquer sessão anterior.
       * limpar() reseta o cache do SessionNav para que pegarRestauravel()
       * funcione corretamente na próxima verificação.
       */
      _nav.limpar();
      document.getElementById('intro-fc-btn-continuar')?.classList.add('hidden');
      FcAntiFlash.mostrarTela('game');
      initCards(disc, root, uid);
    });
  }

  /*
   * PASSO 5: Remove o anti-flash após definir a tela correta.
   * Deve ser o último passo para garantir zero flicker.
   */
  FcAntiFlash.pronto();
})();