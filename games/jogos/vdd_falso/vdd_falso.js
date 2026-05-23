/* ============================================================
   NEXUS STUDY — games/jogos/vdd_falso/vdd_falso.js  (v9.0)

   CORREÇÕES v9.0 — Timer persistente por questão
   ─────────────────────────────────────────────────────────
   PROBLEMA RESOLVIDO:
   • Ao navegar Q2 → Q1 → Q2, o timer da Q2 recomeçava em 30s
   • Causa: _iniciarTimerQuestaoAtual() sempre usava o tempo
     total, nunca o tempo restante real daquela questão

   SOLUÇÃO — QuestionTimerMap:
   • Cada questão tem sua própria entrada: { restante, tsInicio }
   • Ao SAIR de uma questão → snapshot do tempo real é salvo
   • Ao ENTRAR numa questão → tempo é restaurado do snapshot
   • sessionStorage persiste tudo entre F5 e recargas
   • Um único setInterval vivo por vez (sem duplicatas)
   • Sem drift: tempo calculado por Date.now() - tsInicio

   Exporta CONFIG (usado pelo módulo de UI).
   Importa toda a camada visual de ./vdd_falso.ui.js.
============================================================ */

import { Shell, shuffle }                                  from '../../template/game-shell.js';
import { calcularPeso, sorteiarPonderado }                 from '../../template/deck.js';
import { aplicarCoresDisciplina }                          from '../../../shared/js/themes/theme.js';
import { carregarHistoricoVF, salvarResultadoVF }          from './storage_vf.js';
import { getUsuario, getDisciplinasDeSemestre }            from '../../../src/global.js';
import { SessionNav }                                      from '../../template/session-nav.js';

import {
  $, el, initEl,
  mostrarTela, setInfoStrip, aplicarCorBarra, mostrarFeedback,
  renderDots, renderizarBadgeHistorico, renderizarQuestao,
  atualizarBotoesNav, atualizarContadores,
  atualizarBtnRevisarErros, configurarBtnContinuar,
  setupPausa, registrarAtalhos,
  renderizarResultado, mostrarTelaRevisaoConcluida,
  atualizarProgressoRespondidas,
} from './vdd_falso.ui.js';

/* ══════════════════════════════════════════════════════════
   CONFIGURAÇÃO  (exportada para vdd_falso.ui.js)
══════════════════════════════════════════════════════════ */

export const CONFIG = Object.freeze({
  TEMPO_POR_QUESTAO:   30,
  PONTOS_ACERTO:       10,
  PONTOS_ERRO:          5,
  MAX_QUESTOES:         8,
  PESO_NUNCA_VISTA:     3,
  PESO_MIN:             1,
  PESO_MAX:            10,
  SESSAO_TTL_MS:       24 * 60 * 60 * 1000,
  SESSAO_THROTTLE_MS:  500,
});

/* ══════════════════════════════════════════════════════════
   QUESTION TIMER MAP — persistente por questão, sem drift
   ──────────────────────────────────────────────────────
   Arquitetura:
     questionTimers = {
       0: { restante: 25.3, tsInicio: 1700000000000 },
       1: { restante: 20.1, tsInicio: null },   ← pausado/parado
       2: { restante: 30,   tsInicio: null },   ← não iniciado
     }

   Regras de ciclo de vida:
   • tsInicio !== null  → timer correndo
   • tsInicio === null  → timer parado/pausado
   • restante === 0     → questão expirou (não reinicia)
   • entrada ausente    → questão nunca iniciada (usa TEMPO_POR_QUESTAO)

   Persistência:
   • sessionStorage key: 'vf_qtimers'
   • salvo a cada tick e a cada mudança de questão
   • restaurado no boot com recálculo de tempo decorrido real
══════════════════════════════════════════════════════════ */

const QTM_KEY = 'vf_qtimers';

const QuestionTimerMap = (() => {
  // Mapa em memória: índice → { restante: number, tsInicio: number|null }
  let _mapa      = {};
  let _intervalId = null;
  let _indiceAtivo = -1;           // qual questão está com o interval rodando
  let _pausadoGlobal = false;      // pausa de tela (overlay)
  let _onTick    = null;           // (restante: number) => void
  let _onEnd     = null;           // () => void

  /* ── Storage ── */

  function _lerStorage() {
    try {
      const raw = sessionStorage.getItem(QTM_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) { return {}; }
  }

  function _salvarStorage() {
    try {
      // Antes de salvar, congela o restante real da questão ativa
      if (_indiceAtivo >= 0 && _mapa[_indiceAtivo]?.tsInicio !== null) {
        const agora     = Date.now();
        const decorrido = (agora - _mapa[_indiceAtivo].tsInicio) / 1000;
        _mapa[_indiceAtivo] = {
          restante: Math.max(0, _mapa[_indiceAtivo].restante - decorrido),
          tsInicio: agora,   // renova o checkpoint
        };
      }
      sessionStorage.setItem(QTM_KEY, JSON.stringify(_mapa));
    } catch (_) {}
  }

  /* ── Interval único ── */

  function _limparInterval() {
    if (_intervalId !== null) {
      clearInterval(_intervalId);
      _intervalId = null;
    }
  }

  function _tick() {
    if (_indiceAtivo < 0 || _pausadoGlobal) return;

    const entrada = _mapa[_indiceAtivo];
    if (!entrada || entrada.tsInicio === null) return;

    // Calcula em tempo real — sem drift acumulado
    const decorrido    = (Date.now() - entrada.tsInicio) / 1000;
    const restanteReal = Math.max(0, entrada.restante - decorrido);

    _onTick?.(restanteReal);
    _salvarStorage();

    if (restanteReal <= 0) {
      // Questão expirou: marca como esgotada e para o interval
      _mapa[_indiceAtivo] = { restante: 0, tsInicio: null };
      _salvarStorage();
      _limparInterval();
      _indiceAtivo = -1;
      _onEnd?.();
    }
  }

  /* ── API pública ── */

  return {
    /**
     * Inicializa o mapa com N questões.
     * Chamado apenas ao COMEÇAR um jogo novo (não ao restaurar).
     * @param {number} n - total de questões
     */
    inicializarJogo(n) {
      _limparInterval();
      _mapa          = {};
      _indiceAtivo   = -1;
      _pausadoGlobal = false;
      // Pré-popula todas as questões como "não iniciadas"
      for (let i = 0; i < n; i++) {
        _mapa[i] = { restante: CONFIG.TEMPO_POR_QUESTAO, tsInicio: null };
      }
      _salvarStorage();
    },

    /**
     * Restaura o mapa do sessionStorage ao recarregar a página.
     * Recalcula o tempo real decorrido desde o último checkpoint.
     * @param {number} n - total de questões (para validar o mapa)
     * @returns {boolean} true se havia estado válido para restaurar
     */
    restaurarDoStorage(n) {
      const salvo = _lerStorage();
      if (!salvo || Object.keys(salvo).length === 0) return false;

      const agora = Date.now();
      _mapa = {};

      for (let i = 0; i < n; i++) {
        const s = salvo[i];
        if (!s) {
          // Questão sem entrada — não iniciada
          _mapa[i] = { restante: CONFIG.TEMPO_POR_QUESTAO, tsInicio: null };
          continue;
        }

        if (s.tsInicio !== null && s.restante > 0) {
          // Estava correndo: recalcula tempo real decorrido
          const decorrido    = (agora - s.tsInicio) / 1000;
          const restanteReal = Math.max(0, s.restante - decorrido);
          // Congela: armazena o restante real, tsInicio null (será retomado ao ativar)
          _mapa[i] = { restante: restanteReal, tsInicio: null };
        } else {
          // Estava parado ou já expirado
          _mapa[i] = { restante: s.restante, tsInicio: null };
        }
      }

      _salvarStorage();
      return true;
    },

    /**
     * Restaura o mapa a partir de um snapshot salvo na sessão do SessionNav
     * (usado quando há tempos salvos no objeto sessao.questionTimers).
     */
    restaurarDeSnapshot(snapshotTimers, n) {
      if (!snapshotTimers) return false;
      const agora = Date.now();
      _mapa = {};

      for (let i = 0; i < n; i++) {
        const s = snapshotTimers[i];
        if (!s) {
          _mapa[i] = { restante: CONFIG.TEMPO_POR_QUESTAO, tsInicio: null };
          continue;
        }
        if (s.tsInicio !== null && s.restante > 0) {
          const decorrido    = (agora - s.tsInicio) / 1000;
          const restanteReal = Math.max(0, s.restante - decorrido);
          _mapa[i] = { restante: restanteReal, tsInicio: null };
        } else {
          _mapa[i] = { restante: s.restante ?? 0, tsInicio: null };
        }
      }

      _salvarStorage();
      return true;
    },

    /**
     * Congela o restante real da questão indicada e para o interval.
     * Chamado ao SAIR de uma questão por navegação.
     * NÃO zera o restante — ele será restaurado quando a questão for reativada.
     * @param {number} indice - índice da questão que está sendo abandonada
     */
    salvarQuestaoAtual(indice) {
      // Para o interval antes de qualquer coisa — evita tick fantasma
      _limparInterval();

      if (indice < 0 || !_mapa[indice]) {
        _indiceAtivo = -1;
        return;
      }

      if (_mapa[indice].tsInicio !== null) {
        // Congela o restante real calculado até agora
        const decorrido = (Date.now() - _mapa[indice].tsInicio) / 1000;
        _mapa[indice] = {
          restante: Math.max(0, _mapa[indice].restante - decorrido),
          tsInicio: null,   // null = parado; será retomado em ativar()
        };
      }

      _indiceAtivo = -1;   // nenhuma questão ativa no momento
      _salvarStorage();
    },

    /**
     * Ativa o timer de uma questão específica.
     * Restaura exatamente o tempo que havia quando ela foi salva.
     * Questões já respondidas (restante === 0 controlado fora) não devem ser ativadas.
     * @param {number} indice
     * @param {{ onTick, onEnd }} callbacks
     */
    ativar(indice, { onTick, onEnd } = {}) {
      // 1. Para o interval anterior sem perder o estado da questão anterior
      //    (o salvamento já foi feito por salvarQuestaoAtual antes de chegar aqui)
      _limparInterval();

      _onTick      = onTick ?? _onTick;
      _onEnd       = onEnd  ?? _onEnd;
      _indiceAtivo = indice;

      const entrada = _mapa[indice];
      if (!entrada) return;
      if (entrada.restante <= 0) return; // já expirou — não inicia

      // 2. Marca o novo tsInicio para esta questão
      _mapa[indice] = { restante: entrada.restante, tsInicio: Date.now() };
      _salvarStorage();

      // 3. Dispara imediatamente um tick para atualizar a UI antes do primeiro intervalo
      const restanteImediato = Math.max(0, _mapa[indice].restante);
      _onTick?.(restanteImediato);

      // 4. Sobe o interval
      _intervalId = setInterval(_tick, 250); // 250ms = display mais suave no mobile
    },

    /**
     * Zera o slot de uma questão específica por índice.
     * Usado quando a questão está respondida e precisamos garantir
     * que restante=0 independente do _indiceAtivo atual.
     * @param {number} indice
     */
    zerarSlot(indice) {
      if (indice < 0 || !_mapa[indice]) return;
      _mapa[indice] = { restante: 0, tsInicio: null };
      _salvarStorage();
    },

    /**
     * Para o interval ativo e descarta o slot SOMENTE quando a questão
     * foi respondida (caller passa respondida=true).
     *
     * Separar "parar interval" de "zerar restante" é a correção central:
     * navegar entre questões para o interval mas NÃO zera o restante das
     * questões que ainda não foram respondidas.
     *
     * @param {boolean} [zerarRestante=false]
     *   true  → questão foi respondida/expirou: zera o slot no mapa
     *   false → apenas para o interval (navegação); o restante é preservado
     */
    pararAtivo(zerarRestante = false) {
      _limparInterval();
      if (zerarRestante && _indiceAtivo >= 0 && _mapa[_indiceAtivo]) {
        _mapa[_indiceAtivo] = { restante: 0, tsInicio: null };
        _salvarStorage();
      }
      _indiceAtivo = -1;
    },

    pausar() {
      if (_pausadoGlobal) return;
      _pausadoGlobal = true;
      // Congela o restante real da questão ativa
      if (_indiceAtivo >= 0 && _mapa[_indiceAtivo]?.tsInicio !== null) {
        const decorrido = (Date.now() - _mapa[_indiceAtivo].tsInicio) / 1000;
        _mapa[_indiceAtivo] = {
          restante: Math.max(0, _mapa[_indiceAtivo].restante - decorrido),
          tsInicio: null,
        };
      }
      _limparInterval();
      _salvarStorage();
    },

    retomar() {
      if (!_pausadoGlobal) return;
      _pausadoGlobal = false;
      if (_indiceAtivo >= 0 && _mapa[_indiceAtivo]) {
        const entrada = _mapa[_indiceAtivo];
        if (entrada.restante > 0) {
          _mapa[_indiceAtivo] = { restante: entrada.restante, tsInicio: Date.now() };
          _salvarStorage();
          _limparInterval();
          _intervalId = setInterval(_tick, 250);
        }
      }
    },

    /**
     * Retorna o tempo restante real de uma questão (leitura).
     * Não modifica estado.
     */
    restanteDe(indice) {
      const entrada = _mapa[indice];
      if (!entrada) return CONFIG.TEMPO_POR_QUESTAO;
      if (entrada.tsInicio === null) return entrada.restante;
      const decorrido = (Date.now() - entrada.tsInicio) / 1000;
      return Math.max(0, entrada.restante - decorrido);
    },

    /**
     * Retorna uma cópia do mapa para persistência no SessionNav snapshot.
     * Congela o restante real sem alterar o estado interno.
     */
    snapshotParaSessao() {
      const copia  = {};
      const agora  = Date.now();
      for (const idx of Object.keys(_mapa)) {
        const e = _mapa[idx];
        if (e.tsInicio !== null) {
          const decorrido = (agora - e.tsInicio) / 1000;
          copia[idx] = { restante: Math.max(0, e.restante - decorrido), tsInicio: agora };
        } else {
          copia[idx] = { ...e };
        }
      }
      return copia;
    },

    /** Limpa tudo — fim de jogo ou início de novo round. */
    limpar() {
      _limparInterval();
      _mapa          = {};
      _indiceAtivo   = -1;
      _pausadoGlobal = false;
      try { sessionStorage.removeItem(QTM_KEY); } catch (_) {}
    },

    get pausado()    { return _pausadoGlobal; },
    get indiceAtivo(){ return _indiceAtivo; },
  };
})();

/* ══════════════════════════════════════════════════════════
   ESTADO GLOBAL
══════════════════════════════════════════════════════════ */

const estado = {
  perguntas:    [],
  banco:        [],
  indice:       0,
  pontos:       0,
  acertos:      0,
  erros:        0,
  respostas:    [],
  modoRevisao:  false,
  cardsRevisao: null,
  tempoInicio:  null,
  usuario:      null,
  discId:       null,
  sem:          null,
  historicoVF:  {},
  _nav:         null,
  _pausado:     false,
};

/* ══════════════════════════════════════════════════════════
   HELPERS DE SESSÃO
══════════════════════════════════════════════════════════ */

function _snapshotEstado(tela = 'question') {
  return {
    perguntas:      estado.perguntas,
    respostas:      estado.respostas,
    indice:         estado.indice,
    pontos:         estado.pontos,
    acertos:        estado.acertos,
    erros:          estado.erros,
    modoRevisao:    estado.modoRevisao,
    tela,
    progressoMax:   _calcProgressoRespondidas(),
    questionTimers: QuestionTimerMap.snapshotParaSessao(), // ← salva tempos por questão
  };
}

function salvarSessao(tela = 'question') {
  estado._nav?.salvar(_snapshotEstado(tela));
}

function salvarSessaoThrottled() {
  estado._nav?.salvarThrottled(_snapshotEstado('question'));
}

function limparSessao() {
  estado._nav?.limpar();
  QuestionTimerMap.limpar();
}

/* ══════════════════════════════════════════════════════════
   PROGRESSO — baseado em respondidas, nunca regride
══════════════════════════════════════════════════════════ */

function _calcProgressoRespondidas() {
  if (!estado.perguntas.length) return 0;
  const respondidas = estado.respostas.filter(r => r !== undefined).length;
  return Math.round((respondidas / estado.perguntas.length) * 100);
}

let _progressoAtual = 0;
function _atualizarProgressoBarra() {
  const novo = _calcProgressoRespondidas();
  _progressoAtual = Math.max(_progressoAtual, novo);
  atualizarProgressoRespondidas(_progressoAtual);
}

/* ══════════════════════════════════════════════════════════
   LOOP VISUAL rAF — pintura da barra a ~60fps
   ──────────────────────────────────────────────────────
   SEPARAÇÃO DE RESPONSABILIDADES:
   • setInterval (250ms) → lógica: salvar estado, detectar fim
   • requestAnimationFrame (~60fps) → visual: pintar a barra

   O rAF lê QuestionTimerMap.restanteDe() a cada frame,
   calculando o tempo real com Date.now() — sem depender do
   tick do interval para atualizar a UI.

   EASING VISUAL PERCEPTUAL (v9.1):
   ──────────────────────────────────────────────────────
   PROBLEMA: barras longas parecem "rápidas demais" no início
   porque o olho humano percebe movimento linear como acelerado
   quando há muito espaço sobrando. A percepção do movimento é
   proporcional à largura relativa, não ao delta absoluto.

   SOLUÇÃO — transformação de curva perceptual:
   • O valor REAL (pct) continua sendo calculado pelo timer
   • A barra exibe pctVisual = f(pct), onde f é uma curva suave
   • A curva compensa a percepção: início visualmente mais lento,
     meio mais uniforme, final sem diferença (converge para pct)
   • Garantia: pctVisual === pct quando pct === 0 (fim exato)
   • Garantia: pctVisual === pct quando pct === 100 (início exato)

   FÓRMULA:
     t = pct / 100                       (normaliza para [0,1])
     tVisual = t ^ CURVA_EXP             (aplica easing em potência)
     pctVisual = tVisual * 100

   CURVA_EXP = 0.75:
   • t=1.00 → tVisual=1.00  (100% — idêntico, sem diferença)
   • t=0.90 → tVisual=0.924 (barra visual ligeiramente maior)
   • t=0.67 → tVisual=0.725 (início do laranja parece mais tarde)
   • t=0.34 → tVisual=0.410 (início do vermelho parece mais tarde)
   • t=0.00 → tVisual=0.000 (0% — idêntico, termina junto)

   CORES: aplicadas sempre pelo valor real (pct), nunca pelo visual.
   Isso garante que as mudanças de cor ocorrem nos momentos corretos.

   SMOOTHING RESIDUAL:
   • _pctVisualAtual rastreia o valor pintado no frame anterior
   • Suaviza saltos bruscos ao RESTAURAR uma questão com tempo já
     decorrido (ex: volta da pausa, troca de questão)
   • Fator SMOOTH_FACTOR = 0.18: rápido o suficiente para não
     atrasar visivelmente, suave o suficiente para evitar saltos
   • Bypass: quando |gap| < 0.5%, aplica direto (sem smoothing)
     evita que a barra fique "presa" nos últimos pixels
══════════════════════════════════════════════════════════ */

const CURVA_EXP    = 0.75;  // < 1 = início visual mais lento, final idêntico
const SMOOTH_FATOR = 0.18;  // interpolação para suavizar restaurações bruscas

let _rafBarId        = null;   // handle do rAF ativo
let _rafBarAtivo     = false;  // flag de controle do loop
let _ultimaPctBarra  = -1;     // última % pintada — evita escritas redundantes
let _ultimaCorBarra  = '';     // última classe de cor — evita troca desnecessária
let _pctVisualAtual  = -1;     // valor visual corrente para smoothing entre frames

/**
 * Aplica a curva de percepção visual ao valor real da barra.
 * Entrada e saída ambas em [0, 100].
 * Garante pctVisual === 0 quando pct === 0 (fim exato sincronizado).
 * Garante pctVisual === 100 quando pct === 100 (início idêntico).
 *
 * @param {number} pct - valor real [0, 100]
 * @returns {number} valor visual [0, 100]
 */
function _curvaPerceptual(pct) {
  if (pct <= 0)   return 0;
  if (pct >= 100) return 100;
  const t = pct / 100;
  return Math.pow(t, CURVA_EXP) * 100;
}

/**
 * Inicia o loop rAF de pintura da barra.
 * Chamado ao ativar uma questão. Para automaticamente
 * quando _rafBarAtivo = false.
 */
function _iniciarLoopBarraVisual() {
  _rafBarAtivo = true;

  function _frame() {
    if (!_rafBarAtivo) return; // loop encerrado externamente

    const restante = QuestionTimerMap.restanteDe(estado.indice);
    const pct      = Math.max(0, Math.min(100, (restante / CONFIG.TEMPO_POR_QUESTAO) * 100));

    // Calcula o alvo visual com a curva perceptual
    const pctAlvo = _curvaPerceptual(pct);

    // Smoothing residual: suaviza saltos ao restaurar questão
    // Bypass quando próximo do alvo ou no limite inferior (evita barra presa)
    let pctVisual;
    if (_pctVisualAtual < 0 || pct <= 0) {
      // Primeiro frame ou fim exato: sem interpolação
      pctVisual = pctAlvo;
    } else {
      const gap = pctAlvo - _pctVisualAtual;
      pctVisual = Math.abs(gap) < 0.5
        ? pctAlvo                                         // já convergiram — aplica direto
        : _pctVisualAtual + gap * SMOOTH_FATOR;           // interpola suavemente
    }

    // Clamp de segurança: visual nunca ultrapassa o real nem vai negativo
    pctVisual = Math.max(0, Math.min(pct, pctVisual));
    _pctVisualAtual = pctVisual;

    // Só escreve no DOM se o valor visual mudou (evita layout thrashing)
    if (Math.abs(pctVisual - _ultimaPctBarra) > 0.01) {
      _ultimaPctBarra = pctVisual;
      const fill = document.querySelector('.game-timer-bar__fill');
      if (fill) fill.style.transform = `scaleX(${pctVisual / 100})`;

      // Cor aplica sempre pelo valor REAL (pct), nunca pelo visual
      // Garante que as mudanças de cor ocorrem nos momentos corretos
      const novaCor = pct <= 34 ? 'danger' : pct <= 67 ? 'mid' : 'green';
      if (novaCor !== _ultimaCorBarra) {
        _ultimaCorBarra = novaCor;
        aplicarCorBarra(pct);
      }
    }

    _rafBarId = requestAnimationFrame(_frame);
  }

  // Cancela frame anterior se existir, então inicia
  if (_rafBarId !== null) cancelAnimationFrame(_rafBarId);
  _pctVisualAtual = -1; // reseta o smoothing a cada nova questão
  _rafBarId = requestAnimationFrame(_frame);
}

/**
 * Para o loop rAF de pintura. Não toca no estado do timer.
 * @param {number|null} pctFinal - se fornecido, pinta este valor final antes de parar
 */
function _pararLoopBarraVisual(pctFinal = null) {
  _rafBarAtivo    = false;
  _pctVisualAtual = -1; // reseta para o próximo início limpo
  if (_rafBarId !== null) {
    cancelAnimationFrame(_rafBarId);
    _rafBarId = null;
  }
  if (pctFinal !== null) {
    _ultimaPctBarra = pctFinal;
    const fill = document.querySelector('.game-timer-bar__fill');
    if (fill) fill.style.transform = `scaleX(${pctFinal / 100})`;
    aplicarCorBarra(pctFinal);
  }
}

/* ── Callbacks do setInterval (lógica apenas, sem pintura de barra) ── */

function _onTimerTick(restante) {
  // Apenas lógica: salvar sessão e atualizar o display de texto do relógio
  // A barra é pintada pelo loop rAF acima, não aqui.
  salvarSessaoThrottled();

  const display = $('shell-timer-display');
  if (display) {
    const seg = Math.ceil(restante);
    const mm  = String(Math.floor(seg / 60)).padStart(2, '0');
    const ss  = String(seg % 60).padStart(2, '0');
    display.textContent = `${mm}:${ss}`;
    display.classList.toggle('game-timer-display--danger', restante <= 10);
    display.classList.toggle('game-timer-display--mid',    restante > 10 && restante <= 20);
  }
}

function _onTimerEnd() {
  _pararLoopBarraVisual(0); // garante barra zerada ao fim
  if (estado.respostas[estado.indice] === undefined) {
    _registrarResposta(null);
  }
}

/* ══════════════════════════════════════════════════════════
   LÓGICA DO DECK
══════════════════════════════════════════════════════════ */

function questoesComErro(banco, historico) {
  return banco
    .filter(q => {
      const h = historico[q.id];
      return h && h.erros > 0 && (h.acertosConsecutivos ?? 0) === 0;
    })
    .sort((a, b) => {
      const taxaA = historico[a.id].erros / historico[a.id].tentativas;
      const taxaB = historico[b.id].erros / historico[b.id].tentativas;
      return taxaB - taxaA;
    });
}

function montarDeck(banco, historico) {
  const n       = Math.min(CONFIG.MAX_QUESTOES, banco.length);
  const porAula = {};
  for (const q of banco) {
    const a = q.aula ?? 0;
    if (!porAula[a]) porAula[a] = [];
    porAula[a].push(q);
  }

  const sel = new Set();
  for (const aula of Object.keys(porAula)) {
    if (sel.size >= n) break;
    const cands = porAula[aula]
      .filter(q => !sel.has(q.id))
      .map(q => ({
        item: q,
        peso: calcularPeso(q.id, historico, {
          pesoNuncaVisto: CONFIG.PESO_NUNCA_VISTA,
          pesoMin:        CONFIG.PESO_MIN,
          pesoMax:        CONFIG.PESO_MAX,
        }),
      }));
    const esc = sorteiarPonderado(cands, 1);
    if (esc[0]) sel.add(esc[0].id);
  }

  const rest = banco
    .filter(q => !sel.has(q.id))
    .map(q => ({
      item: q,
      peso: calcularPeso(q.id, historico, {
        pesoNuncaVisto: CONFIG.PESO_NUNCA_VISTA,
        pesoMin:        CONFIG.PESO_MIN,
        pesoMax:        CONFIG.PESO_MAX,
      }),
    }));
  sorteiarPonderado(rest, n - sel.size).forEach(q => sel.add(q.id));

  return shuffle(banco.filter(q => sel.has(q.id)));
}

/* ══════════════════════════════════════════════════════════
   RENDERIZAÇÃO
══════════════════════════════════════════════════════════ */

function _renderizarQuestaoAtual() {
  renderizarQuestao({
    perguntas:     estado.perguntas,
    respostas:     estado.respostas,
    indice:        estado.indice,
    historicoVF:   estado.historicoVF,
    timerRestante: QuestionTimerMap.restanteDe(estado.indice),
    onNavegar:     _navegarPara,
  });
  _atualizarProgressoBarra();
}

/* ══════════════════════════════════════════════════════════
   ATIVAR TIMER DA QUESTÃO ATUAL
   ──────────────────────────────────────────────────────
   Ponto único de entrada para iniciar/restaurar o timer.
   Chamado APÓS atualizar estado.indice.
══════════════════════════════════════════════════════════ */

function _ativarTimerQuestaoAtual() {
  const jaRespondeu = estado.respostas[estado.indice] !== undefined;

  if (jaRespondeu) {
    QuestionTimerMap.zerarSlot(estado.indice);
    _pararLoopBarraVisual(0);
    _exibirTimerZerado();
    return;
  }

  const restante = QuestionTimerMap.restanteDe(estado.indice);

  if (restante <= 0) {
    QuestionTimerMap.zerarSlot(estado.indice);
    _pararLoopBarraVisual(0);
    _exibirTimerZerado();
    _registrarResposta(null);
    return;
  }

  // Ativa o timer de lógica (setInterval) — salva estado e detecta fim
  QuestionTimerMap.ativar(estado.indice, {
    onTick: _onTimerTick,
    onEnd:  _onTimerEnd,
  });

  // Inicia o loop visual rAF — pinta a barra a ~60fps independentemente
  _ultimaPctBarra = -1; // força repintura imediata no primeiro frame
  _ultimaCorBarra = '';
  _iniciarLoopBarraVisual();
}

function _exibirTimerZerado() {
  _pararLoopBarraVisual(0);
  const display = $('shell-timer-display');
  if (display) {
    display.textContent = '00:00';
    display.classList.remove('game-timer-display--danger', 'game-timer-display--mid');
  }
}

/* ══════════════════════════════════════════════════════════
   FLUXO PRINCIPAL
══════════════════════════════════════════════════════════ */

function iniciarJogo(modoRevisao = false) {
  estado.modoRevisao = modoRevisao;
  _progressoAtual    = 0;

  if (modoRevisao) {
    if (!estado.cardsRevisao || estado.cardsRevisao.length === 0) {
      estado.cardsRevisao = questoesComErro(estado.banco, estado.historicoVF);
    }
    estado.perguntas = shuffle(estado.cardsRevisao.slice(0, CONFIG.MAX_QUESTOES));
  } else {
    estado.cardsRevisao = null;
    estado.perguntas    = montarDeck(estado.banco, estado.historicoVF);
  }

  estado.indice      = 0;
  estado.pontos      = 0;
  estado.acertos     = 0;
  estado.erros       = 0;
  estado.tempoInicio = Date.now();
  estado.respostas   = new Array(estado.perguntas.length); // slots undefined
  estado._pausado    = false;

  // Inicializa o mapa de timers com todos os slots a 30s
  QuestionTimerMap.inicializarJogo(estado.perguntas.length);

  if (el.scoreCorrect) el.scoreCorrect.textContent = 0;
  mostrarFeedback(null);
  atualizarContadores(estado.perguntas.length);
  mostrarTela('question', estado.modoRevisao);
  _renderizarQuestaoAtual();
  _ativarTimerQuestaoAtual();
}

/* ──────────────── Resposta ──────────────── */

function responder(valor) {
  if (estado._pausado) return;
  if (estado.respostas[estado.indice] !== undefined) return;
  // Para o interval e zera o slot — questão respondida, nunca mais vai rodar
  QuestionTimerMap.salvarQuestaoAtual(estado.indice); // para o interval
  QuestionTimerMap.zerarSlot(estado.indice);          // marca como encerrada
  _registrarResposta(valor);
}

function _registrarResposta(resp) {
  const pergunta = estado.perguntas[estado.indice];
  const correto  = resp === pergunta.resposta;

  estado.respostas[estado.indice] = resp;

  if (resp !== null) {
    if (correto) {
      estado.pontos  += CONFIG.PONTOS_ACERTO;
      estado.acertos += 1;
    } else {
      estado.pontos   = Math.max(0, estado.pontos - CONFIG.PONTOS_ERRO);
      estado.erros   += 1;
    }

    salvarResultadoVF(estado.usuario, estado.discId, estado.sem, [{ id: pergunta.id, resp, acertou: correto }])
      .then(historicoAtualizado => {
        if (historicoAtualizado) estado.historicoVF = historicoAtualizado;
      })
      .catch(err => console.warn('[vdd_falso] Erro ao salvar resposta:', err));
  }

  if (el.scoreCorrect) el.scoreCorrect.textContent = estado.acertos;
  _renderizarQuestaoAtual();
  salvarSessao();
}

/* ──────────────── Navegação ──────────────── */

function _navegarPara(i) {
  if (i < 0 || i >= estado.perguntas.length) return;

  // ① Para o loop visual rAF da questão atual antes de trocar
  _pararLoopBarraVisual();

  // ② Para o interval de lógica e congela o restante da questão ATUAL
  //    (NÃO zera o restante — ela será restaurada ao voltar)
  QuestionTimerMap.salvarQuestaoAtual(estado.indice);

  // ③ Troca o índice
  estado.indice = i;
  _renderizarQuestaoAtual();
  salvarSessao();

  // ④ Ativa o timer da NOVA questão retomando exatamente de onde estava
  //    (inclui reiniciar o loop rAF via _ativarTimerQuestaoAtual)
  _ativarTimerQuestaoAtual();
}

function irAnterior() {
  if (estado.indice > 0) _navegarPara(estado.indice - 1);
}

function irProxima() {
  const ultimo    = estado.indice === estado.perguntas.length - 1;
  const todasResp = estado.respostas.every(r => r !== undefined);

  if (ultimo && todasResp) { finalizarJogo(); return; }

  if (estado.indice < estado.perguntas.length - 1) {
    _navegarPara(estado.indice + 1);
    return;
  }

  const primeiraPendente = estado.respostas.findIndex(r => r === undefined);
  if (primeiraPendente !== -1) _navegarPara(primeiraPendente);
}

/* ──────────────── Finalizar ──────────────── */

async function finalizarJogo() {
  _pararLoopBarraVisual(0);
  QuestionTimerMap.limpar();
  limparSessao();

  mostrarTela('result', false);
  estado._nav?.sairParaRota();

  renderizarResultado(
    {
      acertos:     estado.acertos,
      erros:       estado.erros,
      pontos:      estado.pontos,
      tempoInicio: estado.tempoInicio,
      modoRevisao: estado.modoRevisao,
    },
    {
      onSair:   _aoSair,
      onRejogo: _aoRejogo,
    },
  );

  atualizarBtnRevisarErros(
    questoesComErro(estado.banco, estado.historicoVF),
    () => iniciarJogo(true),
  );
}

async function _aoSair() {
  limparSessao();
  $('btn-continuar')?.classList.add('hidden');
  estado.modoRevisao  = false;
  estado.cardsRevisao = null;
  estado.perguntas    = montarDeck(estado.banco, estado.historicoVF);
  _progressoAtual     = 0;
  atualizarBtnRevisarErros(
    questoesComErro(estado.banco, estado.historicoVF),
    () => iniciarJogo(true),
  );
  atualizarContadores(estado.perguntas.length);
  mostrarTela('intro', false);
}

async function _aoRejogo() {
  const perguntasRound = [...estado.perguntas];
  const respostasRound = [...estado.respostas];
  const eraRevisao     = estado.modoRevisao;

  const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
  estado.historicoVF = historico;

  if (eraRevisao) {
    const erradasAgora = perguntasRound.filter((q, idx) => {
      const resp = respostasRound[idx];
      return resp === null || resp !== q.resposta;
    });
    if (erradasAgora.length === 0) {
      mostrarTelaRevisaoConcluida(_voltarParaIntro);
      return;
    }
    estado.cardsRevisao = erradasAgora;
    estado.perguntas    = shuffle(erradasAgora.slice(0, CONFIG.MAX_QUESTOES));
    atualizarContadores(estado.perguntas.length);
    iniciarJogo(true);
    return;
  }

  estado.modoRevisao  = false;
  estado.cardsRevisao = null;
  estado.perguntas    = montarDeck(estado.banco, historico);
  if (estado.perguntas.length === 0) { mostrarTela('empty', false); return; }
  atualizarContadores(estado.perguntas.length);
  iniciarJogo();
}

async function _voltarParaIntro() {
  const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
  estado.historicoVF  = historico;
  estado.modoRevisao  = false;
  estado.cardsRevisao = null;
  estado.perguntas    = montarDeck(estado.banco, historico);
  _progressoAtual     = 0;
  atualizarContadores(estado.perguntas.length);
  atualizarBtnRevisarErros(
    questoesComErro(estado.banco, historico),
    () => iniciarJogo(true),
  );
  mostrarTela('intro', false);
}

/* ──────────────── Voltar ao início (da pausa) ──────────────── */

async function _aoVoltarIntro() {
  _pararLoopBarraVisual(100); // para rAF e reseta barra para cheia
  QuestionTimerMap.limpar();
  estado._pausado = false;
  _progressoAtual = 0;

  salvarSessao('intro');

  estado.modoRevisao  = false;
  estado.cardsRevisao = null;

  const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
  estado.historicoVF = historico;
  estado.perguntas   = montarDeck(estado.banco, historico);

  atualizarBtnRevisarErros(
    questoesComErro(estado.banco, historico),
    () => iniciarJogo(true),
  );

  const sessaoParaContinuar = estado._nav?.lerSessao();
  if (sessaoParaContinuar?.perguntas?.length > 0) {
    configurarBtnContinuar(sessaoParaContinuar, continuarSessao);
  }

  if (estado.perguntas.length === 0) { mostrarTela('empty', false); return; }
  atualizarContadores(estado.perguntas.length);

  // Display do relógio resetado para 30s
  const t  = CONFIG.TEMPO_POR_QUESTAO;
  const mm = String(Math.floor(t / 60)).padStart(2, '0');
  const ss = String(t % 60).padStart(2, '0');
  const display = $('shell-timer-display');
  if (display) {
    display.textContent = `${mm}:${ss}`;
    display.classList.remove('game-timer-display--danger', 'game-timer-display--mid');
  }
  // Barra já foi resetada para 100% por _pararLoopBarraVisual(100) acima

  mostrarTela('intro', false);
}

/* ──────────────── Restaurar sessão ──────────────── */

function continuarSessao(sessao) {
  estado.perguntas   = sessao.perguntas;
  estado.respostas   = sessao.respostas;
  estado.indice      = sessao.indice  ?? 0;
  estado.pontos      = sessao.pontos  ?? 0;
  estado.acertos     = sessao.acertos ?? 0;
  estado.erros       = sessao.erros   ?? 0;
  estado.modoRevisao = sessao.modoRevisao ?? false;
  estado.tempoInicio = Date.now();
  estado._pausado    = false;

  _progressoAtual = sessao.progressoMax ?? 0;

  const n = estado.perguntas.length;

  // Tenta restaurar timers nesta ordem de prioridade:
  // 1. Snapshot do SessionNav (mais preciso — tem tsInicio real)
  // 2. sessionStorage do QuestionTimerMap (segunda chance)
  // 3. Fallback: inicializa do zero
  const restauradoDeSnapshot = QuestionTimerMap.restaurarDeSnapshot(sessao.questionTimers, n);
  if (!restauradoDeSnapshot) {
    const restauradoDeStorage = QuestionTimerMap.restaurarDoStorage(n);
    if (!restauradoDeStorage) {
      QuestionTimerMap.inicializarJogo(n);
    }
  }

  // Questões já respondidas têm restante zerado no mapa
  // (o pararAtivo delas já foi feito quando foram respondidas)

  if (el.scoreCorrect) el.scoreCorrect.textContent = estado.acertos;
  atualizarContadores(n);
  mostrarTela('question', estado.modoRevisao);
  _renderizarQuestaoAtual();

  // Ativa o timer da questão restaurada com o tempo real que restava
  _ativarTimerQuestaoAtual();
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */

async function init() {
  initEl();
  const { disc, sem } = Shell.init({ icon: '⚖️', nome: 'Verdadeiro ou Falso' });

  const _listaDisciplinas = getDisciplinasDeSemestre(sem);
  const disciplina = _listaDisciplinas.find(d => d.id === disc || d.arquivo === disc) ?? null;

  _preencherHeaderDisciplina(disc, sem, disciplina);

  const ano = sem ? sem.split('.')[0] : null;
  let banco   = [];
  let semDisp = null;

  if (ano) {
    try {
      const modulo = await import(`../../../content/game/vdd_falso/${ano}/vdd_falso_data.js`);
      semDisp = modulo.VDD_FALSO_DATA?.[sem] ?? null;
      banco   = semDisp?.[disc] ?? [];
    } catch (err) {
      console.warn(`[vdd_falso] Arquivo de dados não encontrado para o ano ${ano}:`, err.message);
    }
  }

  estado.banco = banco;

  if (banco.length === 0) {
    mostrarTela('empty', false);
    estado._nav?.pronto();
    _configurarTelaVazia(disc, sem, semDisp);
    return;
  }

  const usuarioObj   = getUsuario();
  estado.usuario     = usuarioObj?.uid ?? 'visitante';
  estado.discId      = disc;
  estado.sem         = sem;

  const nav = SessionNav.criar({
    uid:        estado.usuario,
    discId:     disc,
    sem,
    ttlMs:      CONFIG.SESSAO_TTL_MS,
    throttleMs: CONFIG.SESSAO_THROTTLE_MS,
  });
  estado._nav = nav;

  const historico    = await carregarHistoricoVF(estado.usuario, disc, sem).catch(() => ({}));
  estado.historicoVF = historico;
  estado.perguntas   = montarDeck(banco, historico);

  if (estado.perguntas.length === 0) {
    mostrarTela('empty', false);
    nav.pronto();
    _configurarTelaVazia(disc, sem, semDisp);
    return;
  }

  atualizarContadores(estado.perguntas.length);
  aplicarCorBarra(100);

  el.btnTrue    ?.addEventListener('click', () => responder(true));
  el.btnFalse   ?.addEventListener('click', () => responder(false));
  el.btnAnterior?.addEventListener('click', irAnterior);
  el.btnProxima ?.addEventListener('click', irProxima);

  const erradas = questoesComErro(banco, historico);
  if (erradas.length > 0 && el.btnRevisarErros) {
    atualizarBtnRevisarErros(erradas, () => iniciarJogo(true));
  }

  setupPausa({
    pausarTimer:    () => { QuestionTimerMap.pausar(); _pararLoopBarraVisual(); },
    retomarTimer:   () => { QuestionTimerMap.retomar(); _iniciarLoopBarraVisual(); },
    isPausado:      () => estado._pausado,
    setPausado:     v  => { estado._pausado = v; },
    isQuestaoAtual: () => estado.respostas[estado.indice] === undefined,
    onVoltarIntro:  _aoVoltarIntro,
  });

  registrarAtalhos({
    isPausado:            () => estado._pausado,
    isQuestaoSemResposta: () => estado.respostas[estado.indice] === undefined,
    onResponder: responder,
    onProxima:   irProxima,
    onAnterior:  irAnterior,
  });

  document.getElementById('shell-back-btn')?.addEventListener('click', () => {
    // Salva o tempo da questão atual antes de sair
    QuestionTimerMap.salvarQuestaoAtual(estado.indice);
    salvarSessao('intro');
    nav.sairParaRota();
  });

  el.btnStart?.addEventListener('click', () => {
    limparSessao();
    $('btn-continuar')?.classList.add('hidden');
    iniciarJogo(false);
  });

  const sessaoRestauravel = nav.pegarRestauravel();

  if (sessaoRestauravel) {
    continuarSessao(sessaoRestauravel);
    nav.pronto();
  } else {
    const sessaoSalva = nav.lerSessao();
    if (sessaoSalva?.perguntas?.length > 0) {
      configurarBtnContinuar(sessaoSalva, continuarSessao);
    }
    mostrarTela('intro', false);
    nav.pronto();
  }
}

/* ══════════════════════════════════════════════════════════
   HELPERS INTERNOS DE INIT
══════════════════════════════════════════════════════════ */

function _preencherHeaderDisciplina(disc, sem, disciplina) {
  const shellDiscEl = document.getElementById('shell-disc-name');
  if (shellDiscEl && disciplina) shellDiscEl.textContent = disciplina.apelido ?? disciplina.nome ?? disc;

  const discLblPill = $('vf-disc-label');
  if (discLblPill && disciplina) {
    discLblPill.textContent = `${disciplina.emoji ?? ''} ${disciplina.apelido ?? disciplina.nome ?? disc}`.trim();
  }

  const discPill = $('vf-disc-tag-pill');
  if (discPill) { const svg = discPill.querySelector('svg'); if (svg) svg.remove(); }

  const introDiscName = $('intro-disc-name');
  const introSemLabel = $('intro-sem-label');
  if (introDiscName) introDiscName.textContent = disciplina?.apelido ?? disciplina?.nome ?? disc ?? '—';
  if (introSemLabel) introSemLabel.textContent = sem || '—';

  const introDiscChip = document.querySelector('.vf-intro-card__chip--disc');
  if (introDiscChip) {
    const chipSvg = introDiscChip.querySelector('svg');
    if (chipSvg && disciplina?.emoji) {
      const emojiSpan = document.createElement('span');
      emojiSpan.textContent = disciplina.emoji;
      emojiSpan.style.cssText = 'font-size:13px; line-height:1; display:inline-flex; align-items:center;';
      chipSvg.replaceWith(emojiSpan);
    }
  }
}

function _configurarTelaVazia(disc, sem, semDisp) {
  const btnBack = $('btn-empty-back');
  if (btnBack) btnBack.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;

  const emptyTitle = $('empty-title');
  const emptyDesc  = $('empty-desc');

  if (!semDisp || Object.keys(semDisp).length === 0) {
    if (emptyTitle) emptyTitle.textContent = 'Indisponível neste semestre';
    if (emptyDesc)  emptyDesc.innerHTML =
      `O jogo <strong>Verdadeiro ou Falso</strong> ainda não está disponível para o semestre <strong>${sem || '—'}</strong>.<br>
       Selecione outro semestre ou aguarde novas adições!`;
  } else {
    if (emptyTitle) emptyTitle.textContent = 'Sem perguntas';
    if (emptyDesc)  emptyDesc.innerHTML =
      'Não encontramos questões para esta disciplina ainda.<br>Tente outra ou aguarde novas adições!';
  }
}

/* ══════════════════════════════════════════════════════════
   BOOTSTRAP
══════════════════════════════════════════════════════════ */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}