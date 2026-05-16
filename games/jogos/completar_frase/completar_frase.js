/* ============================================================
   NEXUS STUDY — completar_frase.js  (v4 — arquitetura MVC)

   RESPONSABILIDADES DESTE ARQUIVO
   ────────────────────────────────
   • Estado global da partida
   • Lógica do jogo (verificar, avançar, construir lista)
   • Persistência (sessão + histórico de revisão)
   • Inicialização e fluxo principal
   • Integração com Shell, SessionNav, Storage
   • Comunicação para UI via callbacks / parâmetros

   NÃO está aqui:
   • Manipulação direta de DOM
   • Animações / classes visuais
   • Renderização de HTML

   DEPENDÊNCIAS
   ────────────
   • completar_frase.ui.js  — renderização / eventos / overlays
   • template/game-shell.js — Shell, Timer, shuffle, lerParams
   • template/session-nav.js — SessionNav
   • template/storage-base.js — criarStorage
   • shared/js/cores.js — DISC_CORES
   • src/global.js — getDisciplinasDeSemestre
   ============================================================ */

import { Shell, lerParams, shuffle }                    from '../../template/game-shell.js';
import { SessionNav }                                   from '../../template/session-nav.js';
import { carregarHistoricoCF, salvarResultadoCF }       from './storage_cf.js';
import { getUsuario }                                   from '../../../src/global.js';
import * as UI                                          from './completar_frase.ui.js';

/* ══════════════════════════════════════════════════════════
   PARAMS DA URL
   ══════════════════════════════════════════════════════════ */
const { disc: URL_DISC, sem: URL_SEM } = lerParams();

/* ══════════════════════════════════════════════════════════
   ACESSO AOS DADOS  (expostos como global pelo data.js)
   ══════════════════════════════════════════════════════════ */
function getDados() {
  return window.completarFraseData ?? {};
}

/* ══════════════════════════════════════════════════════════
   CONSTANTES
   ══════════════════════════════════════════════════════════ */
export const MAX_QUESTOES  = 6;
const TIMER_TOTAL  = 30;
const TIMER_WARN   = 10;
const TIMER_DANGER = 5;

/* ══════════════════════════════════════════════════════════
   ESTADO
   ══════════════════════════════════════════════════════════ */
export const Estado = {
  lista:             [],   // questões da partida atual
  banco:             [],   // todas as questões da disciplina
  indice:            0,
  acertos:           0,
  erros:             0,
  respondida:        false,
  historico:         [],   // [{digitado, acertou}] por índice da sessão
  historicoRevisao:  {},   // {[id]: {tentativas, acertos, erros, acertosConsecutivos}} — Firestore + localStorage
  modoRevisao:       false,
  cardsRevisao:      null,

  // Referências para sistemas externos — preenchidas no init
  _nav:              null,
  usuario:           'visitante',
  discId:            null,
  sem:               null,
};

/* ══════════════════════════════════════════════════════════
   TIMER INTERNO
   Gerenciado por este arquivo; UI só recebe valores via callbacks.
   ══════════════════════════════════════════════════════════ */
let _timerInterval = null;
let _timerRestante = TIMER_TOTAL;
let _pausado       = false;

// Flag: usuário está na tela intro?
// Evita sobrescrever sessão com tela='question' ao dar F5 na intro.
let _naIntro = true;

function _timerStart() {
  _timerClear();
  _timerRestante = TIMER_TOTAL;
  UI.renderTimer(_timerRestante, TIMER_TOTAL, TIMER_WARN, TIMER_DANGER);

  _timerInterval = setInterval(() => {
    _timerRestante--;
    UI.renderTimer(_timerRestante, TIMER_TOTAL, TIMER_WARN, TIMER_DANGER);
    _salvarSessaoThrottled();
    if (_timerRestante <= 0) {
      _timerClear();
      _timerExpirou();
    }
  }, 1000);
}

function _timerClear() {
  if (_timerInterval) { clearInterval(_timerInterval); _timerInterval = null; }
}

function _timerExpirou() {
  if (Estado.respondida) return;

  Estado.respondida = true;
  UI.renderTimerExpirou();

  const p = Estado.lista[Estado.indice];
  if (!Estado.historico[Estado.indice]) {
    Estado.erros++;
    Estado.historico[Estado.indice] = { digitado: '', acertou: false };
    const questaoId = p?.id;
    if (questaoId) _registrarNoHistorico(questaoId, false);
  }

  _atualizarMeta();

  const ultima = Estado.indice >= Estado.lista.length - 1;
  UI.renderBtnNextLabel(ultima);
  UI.setBtnNextEnabled(true);
}

/* ══════════════════════════════════════════════════════════
   UTILS
   ══════════════════════════════════════════════════════════ */
export function normalizar(txt) {
  return (txt ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9/]/g, '')
    .trim();
}

export function contarLetras(resposta) {
  return normalizar(resposta).length;
}

export function gerarUnderscores(resposta) {
  return Array(contarLetras(resposta)).fill('_').join(' ');
}

/* ══════════════════════════════════════════════════════════
   HISTÓRICO DE REVISÃO — storage_cf (Firestore + localStorage)
   ══════════════════════════════════════════════════════════ */

/**
 * Registra o resultado de uma questão no storage_cf.
 * Atualiza também Estado.historicoRevisao em memória para
 * que questoesComErro() funcione sem precisar recarregar.
 */
async function _registrarNoHistorico(questaoId, acertou) {
  // 1. Atualiza memória imediatamente (UI reativa)
  const hist    = Estado.historicoRevisao;
  const entrada = hist[questaoId] ?? {
    tentativas: 0, acertos: 0, erros: 0,
    ultimaVez: 0, acertosConsecutivos: 0,
  };
  entrada.tentativas++;
  if (acertou) {
    entrada.acertos++;
    entrada.acertosConsecutivos = (entrada.acertosConsecutivos ?? 0) + 1;
  } else {
    entrada.erros++;
    entrada.acertosConsecutivos = 0;
  }
  entrada.ultimaVez = Date.now();
  hist[questaoId] = entrada;

  // 2. Persiste no storage_cf (Firestore + localStorage) de forma assíncrona
  salvarResultadoCF(Estado.usuario, Estado.discId, Estado.sem, [{ id: questaoId, acertou }])
    .catch(err => console.warn('[cf] Erro ao salvar histórico:', err));
}

export function questoesComErro(banco, historico) {
  return banco
    .filter(q => {
      const h = historico[q.id];
      return h && h.erros > 0 && (h.acertosConsecutivos ?? 0) === 0;
    })
    .sort((a, b) => {
      const tA = historico[a.id].erros / historico[a.id].tentativas;
      const tB = historico[b.id].erros / historico[b.id].tentativas;
      return tB - tA;
    });
}

/* ══════════════════════════════════════════════════════════
   SESSÃO — SessionNav
   ══════════════════════════════════════════════════════════ */

/**
 * Monta o snapshot do estado para persistência.
 * O SessionNav espera os campos perguntas[] e respostas[].
 */
function _snapshotEstado(tela = 'question') {
  // O SessionNav espera 'perguntas' e 'respostas' (array paralelo).
  // Preservamos também 'lista' e 'historico' para continuarSessao() reconstruir
  // o estado sem depender da deserialização do SessionNav.
  const respostas = Estado.lista.map((_, i) => Estado.historico[i]);
  // ^ undefined nas posições não respondidas — o SessionNav serializa como '__p__'
  //   e desserializa de volta para undefined em lerSessao()

  return {
    // Campos esperados pelo SessionNav
    perguntas:    Estado.lista,
    respostas,
    // Campos extras para continuarSessao() funcionar diretamente
    lista:        Estado.lista,
    historico:    Estado.historico,
    indice:       Estado.indice,
    acertos:      Estado.acertos,
    erros:        Estado.erros,
    modoRevisao:  Estado.modoRevisao,
    cardsRevisao: Estado.cardsRevisao,
    tela,
  };
}

function _salvarSessao(tela = 'question') {
  const snap = _snapshotEstado(tela);
  if (!snap.lista?.length) return;
  Estado._nav?.salvar(snap);
}

function _salvarSessaoThrottled() {
  if (!Estado._nav) return;
  Estado._nav.salvarThrottled(_snapshotEstado('question'));
}

function _limparSessao() {
  Estado._nav?.limpar();
}

function _lerSessao() {
  return Estado._nav?.lerSessao() ?? null;
}

/* ══════════════════════════════════════════════════════════
   CONSTRUIR LISTA DE QUESTÕES
   ══════════════════════════════════════════════════════════ */
function _construirLista() {
  const dados    = getDados();
  const semData  = dados[URL_SEM]    ?? {};
  const discData = semData[URL_DISC] ?? [];

  const fonte = discData.length
    ? discData
    : Object.values(semData).flat();

  Estado.banco = fonte.length ? fonte : [];

  if (Estado.modoRevisao && Estado.cardsRevisao?.length > 0) {
    Estado.lista = shuffle(Estado.cardsRevisao).slice(0, MAX_QUESTOES);
  } else {
    Estado.lista = shuffle(Estado.banco).slice(0, MAX_QUESTOES);
  }
}

/* ══════════════════════════════════════════════════════════
   META / PROGRESSO
   ══════════════════════════════════════════════════════════ */
function _atualizarMeta() {
  const total  = Estado.lista.length;
  const feitas = Estado.indice + (Estado.respondida ? 1 : 0);
  const pct    = total > 0 ? (feitas / total) * 100 : 0;

  UI.renderMeta({
    feitas,
    total,
    pct,
    acertos: Estado.acertos,
    erros:   Estado.erros,
  });
  UI.renderDots(Estado.lista, Estado.historico, Estado.indice, (i) => {
    // Callback de clique nas bolinhas
    if (i === Estado.indice) return;
    _timerClear();
    Estado.indice = i;
    renderPergunta();
    _salvarSessao('question');
  });
}

/* ══════════════════════════════════════════════════════════
   RENDER PERGUNTA
   ══════════════════════════════════════════════════════════ */
export function renderPergunta() {
  const p    = Estado.lista[Estado.indice];
  const hist = Estado.historico[Estado.indice];

  UI.renderPergunta({
    questao:      p,
    indice:       Estado.indice,
    totalQuestoes: Estado.lista.length,
    disc:         URL_DISC,
    sem:          URL_SEM,
    historico:    hist,
    normalizar,
    contarLetras,
    gerarUnderscores,
  });

  if (!hist) {
    // Questão nova — inicia timer
    Estado.respondida = false;
    _timerStart();
  } else {
    // Questão já respondida — exibe estado anterior
    Estado.respondida = true;
    _timerClear();
    UI.renderTimer(0, TIMER_TOTAL, TIMER_WARN, TIMER_DANGER);

    const ultima = Estado.indice >= Estado.lista.length - 1;
    UI.renderBtnNextLabel(ultima);
    UI.setBtnNextEnabled(true);
  }

  _atualizarMeta();
}

/* ══════════════════════════════════════════════════════════
   VERIFICAR RESPOSTA
   ══════════════════════════════════════════════════════════ */
export function verificar() {
  if (Estado.respondida) return;

  const p       = Estado.lista[Estado.indice];
  const digitado = UI.getInputValue().trim();

  if (!digitado) {
    UI.shakeInput();
    return;
  }

  Estado.respondida = true;
  _timerClear();

  const acertou = normalizar(digitado) === normalizar(p.resposta);

  // Só incrementa contadores na primeira resposta
  if (!Estado.historico[Estado.indice]) {
    if (acertou) Estado.acertos++;
    else         Estado.erros++;
  }

  Estado.historico[Estado.indice] = { digitado, acertou };

  // Registra no histórico de revisão (persiste entre sessões)
  const questaoId = p?.id;
  if (questaoId) _registrarNoHistorico(questaoId, acertou);

  UI.renderFeedback(acertou, p.resposta);
  UI.setInputResultado(digitado, acertou);

  _salvarSessao('question');
  _atualizarMeta();

  const ultima = Estado.indice >= Estado.lista.length - 1;
  UI.renderBtnNextLabel(ultima);
  UI.setBtnNextEnabled(true);
}

/* ══════════════════════════════════════════════════════════
   AVANÇAR
   ══════════════════════════════════════════════════════════ */
export function avancar() {
  Estado.indice++;
  if (Estado.indice >= Estado.lista.length) {
    mostrarResultado();
  } else {
    renderPergunta();
  }
}

/* ══════════════════════════════════════════════════════════
   INICIAR JOGO
   ══════════════════════════════════════════════════════════ */
function _iniciar(modoRevisao = false) {
  Estado.modoRevisao = modoRevisao;
  if (!modoRevisao) Estado.cardsRevisao = null;

  Estado.indice     = 0;
  Estado.acertos    = 0;
  Estado.erros      = 0;
  Estado.respondida = false;
  Estado.historico  = [];
  _pausado = false;

  _limparSessao();
  _construirLista();

  UI.mostrarGameLayout();
  UI.esconderResultado();
  UI.atualizarBannerRevisao(Estado.modoRevisao, Estado.lista.length);

  renderPergunta();
  _atualizarMeta();
}

export function iniciarJogo(modoRevisao = false) {
  _naIntro = false;
  _iniciar(modoRevisao);
}

/* ══════════════════════════════════════════════════════════
   CONTINUAR SESSÃO SALVA
   ══════════════════════════════════════════════════════════ */
export function continuarSessao(sessao) {
  _naIntro = false;

  // Suporta dois formatos:
  //   • snapshot direto: { lista, historico, indice, … }
  //   • SessionNav.lerSessao(): { perguntas, respostas, indice, … }
  const lista = sessao.lista ?? sessao.perguntas ?? [];

  // Reconstrói historico[] a partir de respostas[] (formato SessionNav)
  // respostas[i] === undefined → questão não respondida
  // respostas[i] === { digitado, acertou } → já respondida
  let historico = sessao.historico ?? [];
  if (!historico.length && sessao.respostas?.length) {
    historico = sessao.respostas.map(r => (r === undefined ? undefined : r));
  }

  Estado.lista        = lista;
  Estado.historico    = historico;
  Estado.indice       = sessao.indice       ?? 0;
  Estado.acertos      = sessao.acertos      ?? 0;
  Estado.erros        = sessao.erros        ?? 0;
  Estado.modoRevisao  = sessao.modoRevisao  ?? false;
  Estado.cardsRevisao = sessao.cardsRevisao ?? null;
  _pausado = false;

  // Segurança: índice nunca além do fim da lista
  if (Estado.indice >= Estado.lista.length) {
    Estado.indice = Math.max(0, Estado.lista.length - 1);
  }

  UI.mostrarGameLayout();
  UI.esconderResultado();
  UI.atualizarBannerRevisao(Estado.modoRevisao, Estado.lista.length);

  renderPergunta();
  _atualizarMeta();
}

/* ══════════════════════════════════════════════════════════
   MOSTRAR RESULTADO
   ══════════════════════════════════════════════════════════ */
export function mostrarResultado() {
  _timerClear();
  _limparSessao();

  UI.mostrarResultado({
    lista:       Estado.lista,
    historico:   Estado.historico,
    historicoRevisao: Estado.historicoRevisao,
    acertos:     Estado.acertos,
    erros:       Estado.erros,
    modoRevisao: Estado.modoRevisao,

    onReiniciar: () => {
      if (Estado.modoRevisao) {
        // Modo revisão: verifica se ainda há erros desta rodada
        const erradasAgora = Estado.lista.filter((_, idx) => {
          const h = Estado.historico[idx];
          return !h || !h.acertou;
        });
        if (erradasAgora.length === 0) {
          _mostrarRevisaoConcluida();
          return;
        }
        Estado.cardsRevisao = erradasAgora;
        _iniciar(true);
      } else {
        mostrarIntro();
      }
    },

    onVoltar: () => {
      _timerClear();
      _limparSessao();
      mostrarIntro();
    },
  });

  UI.atualizarBtnRevisarErros(questoesComErro(Estado.banco, Estado.historicoRevisao).length);
}

/* ══════════════════════════════════════════════════════════
   REVISÃO CONCLUÍDA
   ══════════════════════════════════════════════════════════ */
function _mostrarRevisaoConcluida() {
  UI.mostrarRevisaoConcluida(() => {
    UI.esconderResultado();
    Estado.modoRevisao  = false;
    Estado.cardsRevisao = null;
    UI.atualizarBtnRevisarErros(questoesComErro(Estado.banco, Estado.historicoRevisao).length);
    mostrarIntro();
  });
}

/* ══════════════════════════════════════════════════════════
   MOSTRAR INTRO
   ══════════════════════════════════════════════════════════ */
export function mostrarIntro() {
  _naIntro = true;
  _timerClear();

  // Garante banco populado
  if (Estado.banco.length === 0) {
    const dados    = getDados();
    const semData  = dados[URL_SEM]    ?? {};
    const discData = semData[URL_DISC] ?? [];
    Estado.banco = discData.length ? discData : Object.values(semData).flat();
  }

  // historicoRevisao já está em memória (carregado do Firestore no init).
  // Recarregar do Firestore aqui causaria delay visual desnecessário.
  // A memória é atualizada em _registrarNoHistorico() a cada resposta.

  const sessaoSalva = _lerSessao();

  UI.mostrarIntro({
    disc:          URL_DISC,
    sem:           URL_SEM,
    totalQuestoes: MAX_QUESTOES,
    sessaoSalva,
    errasCount:    questoesComErro(Estado.banco, Estado.historicoRevisao).length,
    onContinuar:   (sessao) => continuarSessao(sessao),
  });
}

/* ══════════════════════════════════════════════════════════
   PAUSA
   ══════════════════════════════════════════════════════════ */
export function pausar() {
  if (_pausado || Estado.respondida) return;
  _pausado = true;
  _timerClear();
  UI.mostrarPausa();
}

export function retomar() {
  if (!_pausado) return;
  _pausado = false;
  UI.esconderPausa();

  if (!Estado.respondida) {
    // Retoma timer do ponto onde parou
    _timerInterval = setInterval(() => {
      _timerRestante--;
      UI.renderTimer(_timerRestante, TIMER_TOTAL, TIMER_WARN, TIMER_DANGER);
      _salvarSessaoThrottled();
      if (_timerRestante <= 0) {
        _timerClear();
        _timerExpirou();
      }
    }, 1000);
  }
}

/* ══════════════════════════════════════════════════════════
   DICA
   ══════════════════════════════════════════════════════════ */
export function mostrarDicaAleatoria() {
  const p = Estado.lista[Estado.indice];
  if (!p || !Array.isArray(p.tips) || p.tips.length === 0) return;
  UI.renderDica(p.tips[0]);
}

/* ══════════════════════════════════════════════════════════
   INIT — DOMContentLoaded
   ══════════════════════════════════════════════════════════ */

async function _init() {

  /* ── 1. Shell (header + cores) ─────────────────────────── */
  Shell.init({ icon: '✏️', nome: 'Complete a Frase' });

  /* ── 2. Popula banco imediatamente ─────────────────────── */
  {
    const dados    = getDados();
    const semData  = dados[URL_SEM]    ?? {};
    const discData = semData[URL_DISC] ?? [];
    Estado.banco = discData.length ? discData : Object.values(semData).flat();
  }

  /* ── 3. Usuário ─────────────────────────────────────────── */
  const usuarioObj  = getUsuario();
  Estado.usuario    = usuarioObj?.uid ?? 'visitante';
  Estado.discId     = URL_DISC;
  Estado.sem        = URL_SEM;

  /* ── 4. SessionNav ─────────────────────────────────────── */
  Estado._nav = SessionNav.criar({
    uid:    Estado.usuario,
    discId: URL_DISC,
    sem:    URL_SEM,
  });

  /* ── 5. Inicializa UI (binds de eventos) ───────────────── */
  UI.init({
    onVerificar:   verificar,
    onAvancar:     avancar,
    onAnterior:    () => {
      if (Estado.indice > 0) {
        Estado.indice--;
        renderPergunta();
      }
    },
    onPausar:      pausar,
    onRetomar:     retomar,
    onMostrarDica: mostrarDicaAleatoria,

    onBtnStart: () => {
      Estado.modoRevisao  = false;
      Estado.cardsRevisao = null;
      _limparSessao();
      iniciarJogo(false);
    },

    onBtnRevisarErros: () => {
      const erradas = questoesComErro(Estado.banco, Estado.historicoRevisao);
      if (erradas.length === 0) return;
      Estado.cardsRevisao = erradas;
      iniciarJogo(true);
    },

    onBtnHome: () => {
      _timerClear();
      if (Estado.lista.length > 0) _salvarSessao('intro');
      mostrarIntro();
    },

    onBtnBack: () => {
      _salvarSessao('intro');
      Estado._nav?.sairParaRota();
    },
  });

  /* ── 6. Listeners de ciclo de vida (reload / F5) ───────── */
  window.addEventListener('beforeunload', () => {
    if (!_naIntro && Estado.lista.length > 0) _salvarSessao('question');
  });

  window.addEventListener('pagehide', () => {
    if (!_naIntro && Estado.lista.length > 0) _salvarSessao('question');
  });

  /* ── 7. Atalhos de teclado ─────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === ' ' && document.activeElement?.id !== 'input-answer') {
      e.preventDefault();
      if (_pausado) retomar(); else pausar();
    }
    if (e.key === 'Escape' && _pausado) retomar();
  });

  /* ── 8. Carrega histórico do Firestore (com fallback localStorage) ── */
  // Feito APÓS criar o SessionNav para que pegarRestauravel() não
  // seja afetado pelo await (o reload-flag precisa ser lido antes).
  const _sessaoRestauravel = Estado._nav.pegarRestauravel();

  Estado.historicoRevisao = await carregarHistoricoCF(
    Estado.usuario, URL_DISC, URL_SEM,
  ).catch(() => ({}));

  /* ── 9. Lógica de restauração ──────────────────────────── */
  const _podeRestaurar = (s) => {
    const lista = s?.lista ?? s?.perguntas ?? [];
    return lista.length > 0 && s?.indice >= 0 && s?.tela === 'question';
  };

  if (_podeRestaurar(_sessaoRestauravel)) {
    continuarSessao(_sessaoRestauravel);
  } else {
    mostrarIntro();
  }

  /* ── 10. Remove anti-flash (após decidir a tela) ────────── */
  Estado._nav.pronto();
}

// type="module" é sempre defer — verificação de segurança igual ao VF
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _init);
} else {
  _init();
}