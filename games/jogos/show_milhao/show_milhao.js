/* ============================================================
   NEXUS STUDY — games/jogos/show_milhao/show_milhao.js  (v3.0)

   REFATORAÇÃO v3.0
   ────────────────
   • Sistema "Continuar" via SessionNav (igual ao vdd_falso.js v7.0)
     – Abandona o modal ad-hoc e a chave sm_saiu_voluntario__*
     – Restauração automática em F5/reload via pegarRestauravel()
     – Botão na intro via lerSessao() + configurarBtnContinuar()
   • Sistema "Revisar Erros" (idêntico ao vdd_falso.js)
     – modoRevisao em estado global
     – questoesComErro() + filtro V/F
     – Banner de revisão na tela de jogo
     – Tela "Revisão concluída" após zerar todos os erros
     – Botão "Revisar erros" na tela de resultado
   • Persistência unificada via SessionNav (TTL 24 h, throttle 500 ms)
   • Estado salvo após cada ação; restaurado sem sobrescrita no carregamento
   • Compatível com storage_sm.js (histórico + pontuações Firestore)

   Estrutura de sessão (snapshot):
     { perguntas, respostas, tempos, indice, acertos, temErro,
       indicePendente, premioPendente, modoRevisao, tempoInicio, tela }
   ============================================================ */

import { Shell, Timer, shuffle }              from '../../template/game-shell.js';
import { calcularPeso, sorteiarPonderado }    from '../../template/deck.js';
import { DISC_CORES }                         from '../../../shared/js/cores.js';
import { aplicarCoresDisciplina }             from '../../../shared/js/theme.js';
import { getUsuario, getDisciplinasDeSemestre } from '../../../src/global.js';
import { SessionNav }                         from '../../template/session-nav.js';

import {
  salvarResultadoSM,
  carregarHistoricoSM,
  limparHistoricoSM,
  salvarPontuacaoSM,
  melhorPontuacaoLocalSM,
  acumuladoLocalSM,
  debugEstado,
  smLog, smWarn, smError,
} from './storage_sm.js';

/* ══════════════════════════════════════════════════════════
   CONFIGURAÇÃO
══════════════════════════════════════════════════════════ */

const CONFIG = Object.freeze({
  TEMPO_POR_QUESTAO: 30,
  MAX_QUESTOES:      10,
  PESO_NUNCA_VISTO:   3,
  PESO_MIN:           1,
  PESO_MAX:          10,
  SESSAO_TTL_MS:     24 * 60 * 60 * 1000,  // 24 h
  SESSAO_THROTTLE_MS: 500,
});

const PREMIOS = [
  { valor: 'R$ 1.000',     marco: false },
  { valor: 'R$ 5.000',     marco: false },
  { valor: 'R$ 10.000',    marco: false },
  { valor: 'R$ 30.000',    marco: true  },
  { valor: 'R$ 50.000',    marco: false },
  { valor: 'R$ 100.000',   marco: false },
  { valor: 'R$ 150.000',   marco: false },
  { valor: 'R$ 300.000',   marco: true  },
  { valor: 'R$ 500.000',   marco: false },
  { valor: 'R$ 1.000.000', marco: false },
];

const CIRCUNFERENCIA = 276.46;

/* ══════════════════════════════════════════════════════════
   ESTADO — fonte única de verdade
══════════════════════════════════════════════════════════ */

const estado = {
  perguntas:      [],
  banco:          [],
  indice:         0,
  acertos:        0,
  respostas:      [],   // undefined | null | 'A'|'B'|'C'|'D'
  tempos:         [],
  timer:          null,
  _fallback:      null,
  pausado:        false,
  usuario:        null,
  discId:         null,
  sem:            null,
  historicoSM:    {},
  modoRevisao:    false,
  cardsRevisao:   null,
  tempoInicio:    null,
  temErro:        false,
  indicePendente: null,
  premioPendente: null,
  _nav:           null,   // instância do SessionNav
};

/* ══════════════════════════════════════════════════════════
   DOM
══════════════════════════════════════════════════════════ */

const $ = id => document.getElementById(id);
const el = {};

/* ══════════════════════════════════════════════════════════
   HELPERS DE SESSÃO (delegam ao SessionNav — igual vdd_falso)
══════════════════════════════════════════════════════════ */

function _snapshotEstado(tela = 'question') {
  return {
    perguntas:      estado.perguntas,
    respostas:      estado.respostas,
    tempos:         estado.tempos,
    indice:         estado.indice,
    acertos:        estado.acertos,
    temErro:        estado.temErro,
    indicePendente: estado.indicePendente,
    premioPendente: estado.premioPendente,
    modoRevisao:    estado.modoRevisao,
    tempoInicio:    estado.tempoInicio,
    tela,
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
}

/* ══════════════════════════════════════════════════════════
   LÓGICA DO DECK
══════════════════════════════════════════════════════════ */

function montarDeck(banco, historico) {
  const n     = Math.min(CONFIG.MAX_QUESTOES, banco.length);
  const cands = banco.map(q => ({
    item: q,
    peso: calcularPeso(q.id, historico, {
      pesoNuncaVisto: CONFIG.PESO_NUNCA_VISTO,
      pesoMin:        CONFIG.PESO_MIN,
      pesoMax:        CONFIG.PESO_MAX,
    }),
  }));
  return shuffle(sorteiarPonderado(cands, n));
}

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

/* ══════════════════════════════════════════════════════════
   TELAS
══════════════════════════════════════════════════════════ */

function mostrarTela(nome, modoRevisao = false) {
  $('screen-loading')?.classList.add('hidden');
  el.screenIntro   ?.classList.add('hidden');
  el.screenQuestion?.classList.add('hidden');
  el.screenResult  ?.classList.add('hidden');
  el.screenEmpty   ?.classList.add('hidden');

  if (nome === 'intro')    el.screenIntro   ?.classList.remove('hidden');
  if (nome === 'question') el.screenQuestion?.classList.remove('hidden');
  if (nome === 'result')   el.screenResult  ?.classList.remove('hidden');
  if (nome === 'empty')    el.screenEmpty   ?.classList.remove('hidden');

  // Botões Pausar / Menu só aparecem durante as questões
  const headerControls = $('header-controls');
  if (headerControls) {
    headerControls.classList.toggle('game-header__controls--visible', nome === 'question');
  }

  // Banner de revisão
  const questionScreen = el.screenQuestion;
  if (questionScreen) {
    questionScreen.querySelector('.sm-revisao-banner')?.remove();
    if (modoRevisao && nome === 'question') {
      const total  = estado.perguntas.length;
      const banner = document.createElement('div');
      banner.className = 'sm-revisao-banner';
      banner.setAttribute('role', 'alert');
      banner.setAttribute('aria-label', 'Modo revisão de erros ativo');
      banner.innerHTML = `
        <svg class="sm-revisao-banner__icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 4.5h1.5v4h-1.5v-4zm0 5h1.5v1.5h-1.5v-1.5z"/>
        </svg>
        <span class="sm-revisao-banner__label">Revisão de erros</span>
        <span class="sm-revisao-banner__count">${total} questão${total !== 1 ? 'ões' : ''}</span>
      `;
      questionScreen.insertBefore(banner, questionScreen.firstChild);
    }
  }

  document.body.classList.toggle('modo-revisao', !!modoRevisao);
  smLog(`Tela: ${nome}${modoRevisao ? ' [revisão]' : ''}`);
}

/* ══════════════════════════════════════════════════════════
   BOLINHAS DE PROGRESSO
══════════════════════════════════════════════════════════ */

function renderDots() {
  const container = $('sm-dots');
  if (!container) return;
  container.innerHTML = '';

  estado.perguntas.forEach((p, i) => {
    const resp       = estado.respostas[i];
    const respondida = resp !== undefined;
    const correto    = respondida && resp !== null && resp === p.correta;
    const atual      = i === estado.indice;

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Questão ${i + 1}`);
    dot.className = 'sm-dot ' + (
      atual       ? 'sm-dot--current' :
      !respondida ? 'sm-dot--pending' :
      correto     ? 'sm-dot--correct' : 'sm-dot--wrong'
    );
    dot.addEventListener('click', () => navegarPara(i));
    container.appendChild(dot);
  });
}

/* ══════════════════════════════════════════════════════════
   LISTA DE PRÊMIOS
══════════════════════════════════════════════════════════ */

function construirListaPremios() {
  const lista = $('lista-premios');
  if (!lista) return;
  lista.innerHTML = '';
  for (let i = PREMIOS.length - 1; i >= 0; i--) {
    const div = document.createElement('div');
    div.className = 'premio-item' + (PREMIOS[i].marco ? ' marco' : '');
    div.id = `premio-${i}`;
    div.innerHTML = `<span>${i + 1}</span><span>${PREMIOS[i].valor}</span>`;
    lista.appendChild(div);
  }
  atualizarPremios();
}

function atualizarPremios() {
  const conquistados = estado.acertos;
  const idxPendente  = estado.indicePendente;
  const nivelAtual   = estado.temErro ? estado.indicePendente : estado.acertos;

  document.querySelectorAll('.premio-item').forEach((elItem, i) => {
    const pregIdx = PREMIOS.length - 1 - i;
    elItem.classList.remove('atual', 'conquistado', 'pendente');

    if (pregIdx === idxPendente) {
      elItem.classList.add('pendente');
    } else if (pregIdx < conquistados) {
      elItem.classList.add('conquistado');
    } else if (pregIdx === nivelAtual && !estado.temErro) {
      elItem.classList.add('atual');
    }
  });
}

/* ══════════════════════════════════════════════════════════
   BARRA DE TIMER
══════════════════════════════════════════════════════════ */

function aplicarCorBarra(pct) {
  const bar = el.timerBar;
  if (!bar) return;
  bar.classList.remove('game-timer-bar--green', 'game-timer-bar--mid', 'game-timer-bar--danger');
  if      (pct <= 34) bar.classList.add('game-timer-bar--danger');
  else if (pct <= 67) bar.classList.add('game-timer-bar--mid');
  else                bar.classList.add('game-timer-bar--green');
}

function atualizarTimerUI(restante) {
  const elNum = $('timer-numero');
  if (elNum) elNum.textContent = restante;

  const offset = CIRCUNFERENCIA * (1 - restante / CONFIG.TEMPO_POR_QUESTAO);
  const arco   = $('timer-arco');
  if (arco) arco.style.strokeDashoffset = offset;

  const pct = (restante / CONFIG.TEMPO_POR_QUESTAO) * 100;
  document.documentElement.style.setProperty('--timer-pct', pct + '%');
  aplicarCorBarra(pct);

  const timerContainer = document.querySelector('.timer-container');
  timerContainer?.classList.toggle('timer-urgente', restante <= 5);
}

/* ══════════════════════════════════════════════════════════
   BADGE DE HISTÓRICO POR QUESTÃO
══════════════════════════════════════════════════════════ */

function renderizarBadgeHistorico(questaoId) {
  const badge    = $('sm-hist-badge');
  const elTent   = $('sm-hist-tentativas');
  const elTaxa   = $('sm-hist-taxa');
  const elStatus = $('sm-hist-status');
  if (!badge) return;

  const h = estado.historicoSM[questaoId];
  if (!h || h.tentativas === 0) {
    badge.hidden    = true;
    badge.className = 'sm-hist-badge';
    return;
  }

  const { tentativas, acertos, erros } = h;
  const taxa = Math.round((acertos / tentativas) * 100);
  let statusMod  = '';
  let statusText = '';

  if (erros > acertos || (tentativas >= 3 && taxa < 50)) {
    statusMod  = 'sm-hist-badge--critico';
    statusText = 'crítico';
  } else if (tentativas >= 3 && taxa >= 80) {
    statusMod  = 'sm-hist-badge--dominado';
    statusText = 'dominado';
  } else if (taxa >= 50) {
    statusMod  = 'sm-hist-badge--ok';
    statusText = 'ok';
  }

  if (elTent)   elTent.textContent   = tentativas;
  if (elTaxa)   elTaxa.textContent   = `${taxa}%`;
  if (elStatus) elStatus.textContent = statusText;

  badge.className = `sm-hist-badge${statusMod ? ' ' + statusMod : ''}`;
  void badge.offsetWidth;
  badge.hidden = false;
}

/* ══════════════════════════════════════════════════════════
   TIMER
══════════════════════════════════════════════════════════ */

function _pararTimers() {
  try { estado.timer?.stop(); } catch (_) {}
  if (estado._fallback) { clearInterval(estado._fallback); estado._fallback = null; }
  estado.timer = null;
}

function criarTimer(totalInicial) {
  return Timer.criar({
    total: totalInicial ?? CONFIG.TEMPO_POR_QUESTAO,
    onTick: (restante) => {
      estado.tempos[estado.indice] = restante;
      atualizarTimerUI(restante);
      salvarSessaoThrottled();
    },
    onEnd: () => {
      if (estado.respostas[estado.indice] === undefined) {
        estado.tempos[estado.indice] = 0;
        smLog(`Q${estado.indice + 1}: TIMEOUT — resposta nula registrada.`);
        registrarResposta(null);
      }
    },
  });
}

/* ══════════════════════════════════════════════════════════
   RENDERIZAR QUESTÃO
══════════════════════════════════════════════════════════ */

function renderizarQuestao() {
  const pergunta    = estado.perguntas[estado.indice];
  const resp        = estado.respostas[estado.indice];
  const jaRespondeu = resp !== undefined;
  const correto     = jaRespondeu && resp === pergunta.correta;
  const num         = estado.indice + 1;

  smLog(`Renderizando Q${num}/${estado.perguntas.length}`,
    `| resp: ${resp ?? 'pendente'}`,
    `| acertos: ${estado.acertos}`,
    `| modoRevisao: ${estado.modoRevisao}`);

  renderizarBadgeHistorico(pergunta.id);

  if (el.numPergunta)   el.numPergunta.textContent  = `${num}/${estado.perguntas.length}`;
  if (el.perguntaNivel) el.perguntaNivel.textContent = `Nível ${num} — ${pergunta.nivel ?? ''}`;
  if (el.perguntaTexto) el.perguntaTexto.textContent = pergunta.texto;
  if (el.progressFill)  el.progressFill.style.width  = (num / estado.perguntas.length * 100) + '%';
  if (el.pontuacaoHud) {
    el.pontuacaoHud.textContent = estado.acertos > 0
      ? PREMIOS[estado.acertos - 1]?.valor || 'R$ 0'
      : 'R$ 0';
  }

  ['a','b','c','d'].forEach(l => {
    const btn = $(`alt-${l}`);
    const txt = $(`texto-${l}`);
    if (btn) {
      btn.className = 'alt-btn';
      btn.disabled  = jaRespondeu;
      btn.style.opacity = '1';
    }
    if (txt) txt.textContent = pergunta.alternativas[l.toUpperCase()] ?? '';
  });

  if (jaRespondeu) {
    if (resp !== null) {
      $(`alt-${resp.toLowerCase()}`)?.classList.add(correto ? 'correta' : 'errada');
    }
    if (!correto && resp !== null) {
      $(`alt-${pergunta.correta.toLowerCase()}`)?.classList.add('revelada');
    }
    mostrarFeedback(correto, resp === null);
  } else {
    $('feedback-box')?.classList.remove('visivel');
  }

  atualizarBotoesNav();
  atualizarPremios();
  renderDots();

  // Para timer anterior
  _pararTimers();

  if (!jaRespondeu) {
    const tempoRestante = estado.tempos[estado.indice] ?? CONFIG.TEMPO_POR_QUESTAO;
    atualizarTimerUI(tempoRestante);
    try {
      estado.timer = criarTimer(tempoRestante);
      estado.timer.start();
    } catch (_) {
      // Fallback setInterval
      let t = tempoRestante;
      estado._fallback = setInterval(() => {
        t--;
        estado.tempos[estado.indice] = t;
        atualizarTimerUI(t);
        salvarSessaoThrottled();
        if (t <= 0) {
          clearInterval(estado._fallback);
          estado._fallback = null;
          if (estado.respostas[estado.indice] === undefined) registrarResposta(null);
        }
      }, 1000);
    }
  }
}

function atualizarBotoesNav() {
  const total     = estado.perguntas.length;
  const ultimo    = estado.indice === total - 1;
  const jaResp    = estado.respostas[estado.indice] !== undefined;
  const todasResp = estado.respostas.every(r => r !== undefined);

  if (el.btnAnterior) el.btnAnterior.disabled = estado.indice === 0;

  if (el.btnProxima) {
    const isFinish = ultimo && todasResp;
    el.btnProxima.disabled = !jaResp;
    el.btnProxima.classList.toggle('sm-nav-btn--finish', isFinish);
    el.btnProxima.innerHTML = isFinish
      ? 'Finalizar <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M2 8l4 4 8-8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : 'Próxima <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M6 3l6 5-6 5V3z"/></svg>';
  }
}

/* ══════════════════════════════════════════════════════════
   FLUXO PRINCIPAL — iniciarJogo
══════════════════════════════════════════════════════════ */

function iniciarJogo(modoRevisao = false) {
  estado.modoRevisao = modoRevisao;

  if (modoRevisao) {
    if (!estado.cardsRevisao || estado.cardsRevisao.length === 0) {
      estado.cardsRevisao = questoesComErro(estado.banco, estado.historicoSM);
    }
    estado.perguntas = shuffle(estado.cardsRevisao.slice(0, CONFIG.MAX_QUESTOES));
  } else {
    estado.cardsRevisao = null;
    estado.perguntas    = montarDeck(estado.banco, estado.historicoSM);
  }

  estado.indice         = 0;
  estado.acertos        = 0;
  estado.tempoInicio    = Date.now();
  estado.respostas      = new Array(estado.perguntas.length);
  estado.tempos         = new Array(estado.perguntas.length).fill(CONFIG.TEMPO_POR_QUESTAO);
  estado.temErro        = false;
  estado.indicePendente = null;
  estado.premioPendente = null;
  estado.pausado        = false;

  smLog(`${modoRevisao ? 'Revisão' : 'Nova partida'} iniciada. Deck: ${estado.perguntas.length} questões.`);

  atualizarContadores();
  construirListaPremios();
  mostrarTela('question', modoRevisao);
  renderizarQuestao();
}

/* ══════════════════════════════════════════════════════════
   RESPONDER
══════════════════════════════════════════════════════════ */

function responder(letra) {
  if (estado.pausado) return;
  if (estado.respostas[estado.indice] !== undefined) return;

  _pararTimers();
  smLog(`Q${estado.indice + 1}: usuário escolheu "${letra}".`);
  registrarResposta(letra);
}

function registrarResposta(resp) {
  const pergunta = estado.perguntas[estado.indice];
  const correto  = resp !== null && resp === pergunta.correta;

  estado.respostas[estado.indice] = resp;

  if (resp === null) {
    smLog(`Q${estado.indice + 1}: TIMEOUT — neutro.`);

  } else if (correto) {
    if (estado.temErro) {
      smLog(`Q${estado.indice + 1}: ACERTO → resolve erro pendente.`);
      estado.temErro        = false;
      estado.indicePendente = null;
      estado.premioPendente = null;
    }
    estado.acertos++;
    smLog(`Q${estado.indice + 1}: ACERTO ✓ | acertos: ${estado.acertos} → ${PREMIOS[estado.acertos - 1]?.valor}`);

  } else {
    if (!estado.temErro) {
      estado.indicePendente = estado.indice;
      estado.premioPendente = estado.indice;
    }
    estado.temErro = true;
    smLog(`Q${estado.indice + 1}: ERRO ✗ | prêmio travado`);
  }

  // Persiste resposta e atualiza cache em memória
  if (resp !== null) {
    salvarResultadoSM(estado.usuario, estado.discId, estado.sem, [
      { id: pergunta.id ?? `q${estado.indice}`, resp, acertou: correto },
    ]).then(() => {
      const entrada = estado.historicoSM[pergunta.id] ?? {
        tentativas: 0, acertos: 0, erros: 0, ultimaVez: 0, acertosConsecutivos: 0,
      };
      entrada.tentativas++;
      if (correto) {
        entrada.acertos++;
        entrada.acertosConsecutivos = (entrada.acertosConsecutivos ?? 0) + 1;
      } else {
        entrada.erros++;
        entrada.acertosConsecutivos = 0;
      }
      entrada.ultimaVez            = Date.now();
      estado.historicoSM[pergunta.id] = entrada;
    }).catch(err => smWarn('Erro ao salvar resposta:', err));
  }

  salvarSessao();    // salvamento imediato após resposta
  renderizarQuestao();
}

/* ══════════════════════════════════════════════════════════
   FEEDBACK
══════════════════════════════════════════════════════════ */

function mostrarFeedback(correto, tempoAcabou) {
  const fb      = $('feedback-box');
  const icone   = $('feedback-icone');
  const msg     = $('feedback-msg');
  const resp    = $('feedback-resposta');

  const p         = estado.perguntas[estado.indice];
  const isUltima  = estado.indice >= estado.perguntas.length - 1;
  const todasResp = estado.respostas.every(r => r !== undefined);

  if (tempoAcabou) {
    if (icone) icone.textContent = '⏰';
    if (msg)   { msg.textContent = 'Tempo Esgotado!'; msg.style.color = '#ff9800'; }
    if (resp)  resp.textContent  = `A resposta correta era: ${p.correta} — ${p.alternativas[p.correta]}`;

  } else if (correto) {
    if (icone) icone.textContent = isUltima ? '🏆' : '✅';
    if (msg) {
      msg.textContent = isUltima ? '🏆 Você é o Milionário!' : 'Correto! Excelente!';
      msg.style.color = '#00e676';
    }
    if (resp) resp.textContent = `Você ganhou: ${PREMIOS[estado.acertos - 1]?.valor || 'R$ 0'}`;

  } else {
    if (icone) icone.textContent = '❌';
    if (msg)   { msg.textContent = 'Resposta Errada! Prêmio travado 🔴'; msg.style.color = '#ff1744'; }
    if (resp)  resp.textContent  = `A correta era: ${p.correta} — ${p.alternativas[p.correta]} · Acerte a próxima para ganhar ${PREMIOS[estado.indice]?.valor}`;
  }

  fb?.classList.add('visivel');
}

/* ══════════════════════════════════════════════════════════
   NAVEGAÇÃO
══════════════════════════════════════════════════════════ */

function navegarPara(i) {
  if (i < 0 || i >= estado.perguntas.length) return;
  _pararTimers();
  smLog(`Navegando Q${estado.indice + 1} → Q${i + 1}`);
  estado.indice = i;
  salvarSessao();
  renderizarQuestao();
}

function irAnterior() {
  if (estado.indice > 0) navegarPara(estado.indice - 1);
}

function irProxima() {
  const ultimo    = estado.indice === estado.perguntas.length - 1;
  const todasResp = estado.respostas.every(r => r !== undefined);

  if (ultimo && todasResp) { finalizarJogo(); return; }
  if (estado.indice < estado.perguntas.length - 1) { navegarPara(estado.indice + 1); return; }

  const primeiraPendente = estado.respostas.findIndex(r => r === undefined);
  if (primeiraPendente !== -1) navegarPara(primeiraPendente);
}

/* ══════════════════════════════════════════════════════════
   FINALIZAR
══════════════════════════════════════════════════════════ */

async function finalizarJogo() {
  _pararTimers();
  limparSessao();
  estado._nav?.sairParaRota();

  smLog('Jogo finalizado. Salvando histórico...');

  const resultados = estado.perguntas.map((p, i) => ({
    id:      p.id ?? `q${i}`,
    resp:    estado.respostas[i],
    acertou: estado.respostas[i] === p.correta,
  })).filter(r => r.resp !== null && r.resp !== undefined);

  // Em modo revisão apenas salva histórico (sem pontuação de prêmio)
  await salvarResultadoSM(estado.usuario, estado.discId, estado.sem, resultados);

  if (!estado.modoRevisao) {
    // Salva pontuação apenas em partidas normais
    const totalSeg     = Math.round((Date.now() - (estado.tempoInicio ?? Date.now())) / 1000);
    const mm           = Math.floor(totalSeg / 60);
    const ss           = String(totalSeg % 60).padStart(2, '0');
    const respondidos  = estado.respostas.filter(r => r !== null && r !== undefined).length;
    const pct          = respondidos > 0 ? Math.round((estado.acertos / respondidos) * 100) : 0;
    const valorStr     = estado.acertos > 0 ? PREMIOS[estado.acertos - 1].valor : 'R$ 0';
    const valorNum     = parseInt(valorStr.replace(/\D/g, ''), 10) || 0;

    await salvarPontuacaoSM(estado.usuario, estado.discId, estado.sem, {
      valor: valorStr, valorNum,
      acertos: estado.acertos,
      erros:   respondidos - estado.acertos,
      precisao: pct,
      tempo:   `${mm}:${ss}`,
      data:    Date.now(),
    });
    smLog(`Pontuação registrada: ${valorStr} | ${estado.acertos} acertos | ${pct}%`);
  }

  _renderizarTelaResultado();
}

/* ══════════════════════════════════════════════════════════
   TELA DE RESULTADO
══════════════════════════════════════════════════════════ */

function _renderizarTelaResultado() {
  const respondidas   = estado.respostas.filter(r => r !== null && r !== undefined).length;
  const pct           = respondidas > 0 ? Math.round((estado.acertos / respondidas) * 100) : 0;
  const valorFinal    = estado.acertos > 0 ? PREMIOS[estado.acertos - 1].valor : 'R$ 0';
  const todosCorretos = estado.acertos === estado.perguntas.length;

  smLog(`Resultado final: ${estado.acertos} acertos / ${respondidas} respondidas → ${pct}% → ${valorFinal}`);

  let emoji, titulo;
  if      (pct >= 80) { emoji = '🏆'; titulo = todosCorretos && !estado.modoRevisao ? 'MILIONÁRIO!' : 'Excelente!'; }
  else if (pct >= 50) { emoji = '🌟'; titulo = 'Muito bem!'; }
  else                { emoji = '📚'; titulo = 'Pode melhorar!'; }

  // Badge de modo revisão
  const resultCard = document.querySelector('.resultado-nucleo');
  if (resultCard) {
    resultCard.querySelector('.sm-finish-revisao-badge')?.remove();
    if (estado.modoRevisao) {
      const badge = document.createElement('div');
      badge.className = 'sm-finish-revisao-badge';
      badge.innerHTML = `
        <svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13" aria-hidden="true">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 4.5h1.5v4h-1.5v-4zm0 5h1.5v1.5h-1.5v-1.5z"/>
        </svg>
        Revisão de erros`;
      resultCard.insertBefore(badge, resultCard.firstChild);
    }
  }

  const elSimb     = $('resultado-simbolo');
  const elTitulo   = $('resultado-titulo');
  const elValor    = $('resultado-valor');
  const elAcertos  = $('resultado-acertos');
  const elErros    = $('resultado-erros');
  const elPrecisao = $('resultado-precisao');
  const elTempo    = $('resultado-tempo');
  const elMelhor   = $('resultado-melhor');

  if (elSimb)    elSimb.textContent    = emoji;
  if (elTitulo)  elTitulo.textContent  = titulo;
  if (elValor)   elValor.textContent   = estado.modoRevisao ? '— revisão —' : valorFinal;
  if (elAcertos) elAcertos.textContent = estado.acertos;
  if (elErros)   elErros.textContent   = respondidas - estado.acertos;
  if (elPrecisao) elPrecisao.textContent = pct + '%';

  if (elTempo) {
    const totalSeg = Math.round((Date.now() - (estado.tempoInicio ?? Date.now())) / 1000);
    const mm = Math.floor(totalSeg / 60);
    const ss = String(totalSeg % 60).padStart(2, '0');
    elTempo.textContent = `${mm}:${ss}`;
  }

  if (elMelhor && !estado.modoRevisao) {
    const melhor    = melhorPontuacaoLocalSM(estado.usuario, estado.discId, estado.sem);
    const acumDados = acumuladoLocalSM(estado.usuario, estado.discId, estado.sem);
    const linhas = [];

    if (melhor) {
      const ehNovo = melhor.valorNum === (parseInt(valorFinal.replace(/\D/g, ''), 10) || 0) &&
                     melhor.acertos  === estado.acertos;
      linhas.push(`${ehNovo ? '🎉 Novo recorde!' : '🏅 Melhor:'} ${melhor.valor} (${melhor.acertos} acertos · ${melhor.precisao}%)`);
    }
    if (acumDados && acumDados.acumulado > 0) {
      const acumFmt = 'R$ ' + acumDados.acumulado.toLocaleString('pt-BR');
      linhas.push(`💰 Acumulado: ${acumFmt} em ${acumDados.totalPartidas} partida${acumDados.totalPartidas !== 1 ? 's' : ''}`);
    }
    if (linhas.length > 0) {
      elMelhor.innerHTML = linhas.join('<br>');
      elMelhor.style.display = 'block';
    }
  } else if (elMelhor && estado.modoRevisao) {
    elMelhor.style.display = 'none';
  }

  // Botão "Sair → intro"
  const elSair = $('resultado-btn-sair');
  if (elSair) {
    elSair.removeAttribute('href');
    const novoSair = elSair.cloneNode(true);
    elSair.parentNode.replaceChild(novoSair, elSair);
    novoSair.addEventListener('click', e => { e.preventDefault(); _aoSair(); });
  }

  // Botão "Jogar novamente / Repetir revisão"
  const elRejogo = $('resultado-btn-rejogo');
  if (elRejogo) {
    const novoRejogo = elRejogo.cloneNode(true);
    elRejogo.parentNode.replaceChild(novoRejogo, elRejogo);

    if (estado.modoRevisao) {
      novoRejogo.innerHTML = '';
      const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      iconSvg.setAttribute('viewBox', '0 0 16 16');
      iconSvg.setAttribute('fill', 'none');
      iconSvg.setAttribute('stroke', 'currentColor');
      iconSvg.setAttribute('stroke-width', '1.6');
      iconSvg.setAttribute('width', '16');
      iconSvg.setAttribute('height', '16');
      iconSvg.innerHTML = '<path d="M13.5 2.5v3.5h-3.5"/><path d="M13.3 6A6 6 0 1 0 12 12"/>';
      novoRejogo.appendChild(iconSvg);
      novoRejogo.appendChild(document.createTextNode(' Repetir revisão'));
    }

    novoRejogo.addEventListener('click', _aoRejogo);
  }

  // Botão "Revisar erros" no resultado
  _atualizarBtnRevisarErros();

  renderEstatisticasQuestoes();
  mostrarTela('result', false);
}

/* ══════════════════════════════════════════════════════════
   BOTÃO "REVISAR ERROS"
══════════════════════════════════════════════════════════ */

function _atualizarBtnRevisarErros() {
  const erradas = questoesComErro(estado.banco, estado.historicoSM);

  // Configura os dois botões (intro e resultado) com IDs distintos
  const ids = [
    { btn: 'sm-btn-revisar-erros',           count: 'sm-revisar-count' },
    { btn: 'sm-btn-revisar-erros-resultado',  count: 'sm-revisar-count-resultado' },
  ];

  for (const { btn: btnId, count: countId } of ids) {
    const btn = $(btnId);
    if (!btn) continue;

    if (erradas.length === 0) {
      btn.classList.add('hidden');
      // Mostra/oculta o wrapper da intro
      if (btnId === 'sm-btn-revisar-erros') {
        const wrapper = $('sm-revisar-wrapper');
        if (wrapper) wrapper.style.display = 'none';
      }
      continue;
    }

    const countEl = btn.querySelector(`#${countId}`) ?? btn.querySelector('.sm-revisar-badge');
    if (countEl) countEl.textContent = erradas.length;

    // Mostra o wrapper da intro
    if (btnId === 'sm-btn-revisar-erros') {
      const wrapper = $('sm-revisar-wrapper');
      if (wrapper) wrapper.style.display = 'flex';
    }

    // Substitui o nó para limpar listeners anteriores
    const novo = btn.cloneNode(true);
    btn.parentNode.replaceChild(novo, btn);
    novo.classList.remove('hidden');
    novo.addEventListener('click', () => {
      estado.cardsRevisao = erradas;
      iniciarJogo(true);
    });
  }
}

/* ══════════════════════════════════════════════════════════
   BOTÃO "CONTINUAR" na intro
══════════════════════════════════════════════════════════ */

function configurarBtnContinuar(sessao, onContinuar) {
  const bloco    = $('intro-continuar');
  const btn      = $('btn-continuar');
  const infoEl   = $('continuar-info');

  if (!sessao || !bloco || !btn) return;

  const respondidas = sessao.respostas.filter(r => r !== undefined).length;
  const total       = sessao.perguntas.length;
  const pendentes   = sessao.respostas.filter(r => r === undefined).length;

  if (pendentes === 0) {
    bloco.style.display = 'none';
    return;
  }

  bloco.style.display = 'flex';
  if (infoEl) {
    const label = sessao.modoRevisao ? 'Revisão' : 'Partida';
   
  }

  // Substitui o nó para limpar listeners anteriores
  const novo = btn.cloneNode(true);
  btn.parentNode.replaceChild(novo, btn);
  novo.addEventListener('click', () => onContinuar(sessao));
}

/* ══════════════════════════════════════════════════════════
   CALLBACKS DE FLUXO
══════════════════════════════════════════════════════════ */

async function _aoSair() {
  limparSessao();
  const bloco = $('intro-continuar');
  if (bloco) bloco.style.display = 'none';

  estado.modoRevisao  = false;
  estado.cardsRevisao = null;

  const historico = await carregarHistoricoSM(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
  estado.historicoSM = historico;
  estado.perguntas   = montarDeck(estado.banco, historico);
  atualizarContadores();
  _atualizarBtnRevisarErros();
  mostrarTela('intro', false);
}

async function _aoRejogo() {
  const perguntasRound = [...estado.perguntas];
  const respostasRound = [...estado.respostas];
  const eraRevisao     = estado.modoRevisao;

  const historico = await carregarHistoricoSM(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
  estado.historicoSM = historico;

  if (eraRevisao) {
    const erradasAgora = perguntasRound.filter((q, idx) => {
      const resp = respostasRound[idx];
      return resp === null || resp !== q.correta;
    });
    if (erradasAgora.length === 0) {
      _mostrarTelaRevisaoConcluida(_voltarParaIntro);
      return;
    }
    estado.cardsRevisao = erradasAgora;
    estado.perguntas    = shuffle(erradasAgora.slice(0, CONFIG.MAX_QUESTOES));
    atualizarContadores();
    iniciarJogo(true);
    return;
  }

  estado.modoRevisao  = false;
  estado.cardsRevisao = null;
  estado.perguntas    = montarDeck(estado.banco, historico);
  if (estado.perguntas.length === 0) { mostrarTela('empty', false); return; }
  atualizarContadores();
  iniciarJogo(false);
}

async function _voltarParaIntro() {
  const historico = await carregarHistoricoSM(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
  estado.historicoSM  = historico;
  estado.modoRevisao  = false;
  estado.cardsRevisao = null;
  estado.perguntas    = montarDeck(estado.banco, historico);
  atualizarContadores();
  _atualizarBtnRevisarErros();

  // Limpa botão continuar (sessão já foi limpa ao finalizar)
  const bloco = $('intro-continuar');
  if (bloco) bloco.style.display = 'none';

  mostrarTela('intro', false);
}

/* Volta ao início a partir da pausa */
async function _aoVoltarIntro() {
  _pararTimers();
  estado.pausado = false;

  // Salva o estado atual como sessão para restauração posterior
  salvarSessao('intro');

  const historico = await carregarHistoricoSM(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
  estado.historicoSM = historico;

  // Atualiza botão revisar na intro (não remonta deck — preserva o salvo)
  _atualizarBtnRevisarErros();

  // Configura botão continuar com a sessão salva
  const sessaoSalva = estado._nav?.lerSessao();
  if (sessaoSalva?.perguntas?.length > 0) {
    configurarBtnContinuar(sessaoSalva, continuarSessao);
  } else {
    const bloco = $('intro-continuar');
    if (bloco) bloco.style.display = 'none';
  }

  atualizarContadores();
  mostrarTela('intro', false);
}

/* ══════════════════════════════════════════════════════════
   RESTAURAR SESSÃO (botão Continuar / F5)
══════════════════════════════════════════════════════════ */

function continuarSessao(sessao) {
  estado.perguntas      = sessao.perguntas;
  estado.respostas      = sessao.respostas;
  estado.indice         = sessao.indice         ?? 0;
  estado.acertos        = sessao.acertos        ?? 0;
  estado.modoRevisao    = sessao.modoRevisao    ?? false;
  estado.temErro        = sessao.temErro        ?? false;
  estado.indicePendente = sessao.indicePendente ?? null;
  estado.premioPendente = sessao.premioPendente ?? null;
  estado.tempoInicio    = Date.now();
  estado.pausado        = false;

  // Restaura tempos — reseta o timer da questão onde parou (sem resposta)
  const temposRestaurados = sessao.tempos
    ? [...sessao.tempos]
    : new Array(sessao.perguntas.length).fill(CONFIG.TEMPO_POR_QUESTAO);

  if (estado.respostas[estado.indice] === undefined) {
    temposRestaurados[estado.indice] = CONFIG.TEMPO_POR_QUESTAO;
  }
  estado.tempos = temposRestaurados;

  atualizarContadores();
  construirListaPremios();
  mostrarTela('question', estado.modoRevisao);
  renderizarQuestao();
}

/* ══════════════════════════════════════════════════════════
   TELA "REVISÃO CONCLUÍDA"
══════════════════════════════════════════════════════════ */

function _mostrarTelaRevisaoConcluida(onVoltar) {
  const resultCard = document.querySelector('.resultado-nucleo');
  if (!resultCard) { onVoltar(); return; }

  resultCard.innerHTML = `
    <div class="sm-finish-revisao-badge">
      <svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13" aria-hidden="true">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 4.5h1.5v4h-1.5v-4zm0 5h1.5v1.5h-1.5v-1.5z"/>
      </svg>
      Revisão de erros
    </div>
    <div class="fim-icone">🏆</div>
    <h2 class="fim-titulo">Revisão concluída!</h2>
    <p class="sm-revisao-concluida-msg">
      Você superou todos os erros desta sessão de revisão! 🎉
    </p>
    <div class="sm-result-btns">
      <button class="btn-jogar" id="revisao-concluida-voltar">
        Voltar ao início
        <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
          <path d="M5 3l8 5-8 5V3z"/>
        </svg>
      </button>
    </div>
  `;

  mostrarTela('result', false);
  $('revisao-concluida-voltar')?.addEventListener('click', onVoltar);
}

/* ══════════════════════════════════════════════════════════
   ESTATÍSTICAS POR QUESTÃO
══════════════════════════════════════════════════════════ */

function renderEstatisticasQuestoes() {
  const resultCard = document.querySelector('.resultado-nucleo');
  if (!resultCard) return;
  resultCard.querySelector('.sm-stats-questoes')?.remove();

  const historico  = estado.historicoSM;
  const perguntas  = estado.perguntas;
  const respostas  = estado.respostas;
  const modoRevisao = estado.modoRevisao;

  const temDados = perguntas.some(q => historico[q.id ?? '']);
  if (!temDados) return;

  const painel = document.createElement('details');
  painel.className = 'sm-stats-questoes';
  painel.open = true;
  painel.innerHTML = `<summary><span class="sm-sq-summary-icon">📊</span>Progresso por questão<span class="sm-sq-chevron">▾</span></summary>`;

  const lista = document.createElement('div');
  lista.className = 'sm-sq-lista';

  for (const q of perguntas) {
    const h           = historico[q.id ?? ''];
    const idx         = perguntas.indexOf(q);
    const respAtual   = respostas[idx];
    const acertouAgora = respAtual !== null && respAtual !== undefined && respAtual === q.correta;
    const errouAgora   = respAtual !== null && respAtual !== undefined && respAtual !== q.correta;

    const row = document.createElement('div');
    row.className = 'sm-sq-row sm-sq-row--prog';

    if (modoRevisao) {
      const icone   = acertouAgora ? '✓' : errouAgora ? '✗' : '–';
      const iconCor = acertouAgora ? '#34d399' : errouAgora ? '#f87171' : '#94a3b8';
      const barCls  = acertouAgora ? 'sm-sq-bar-fill--ok' : 'sm-sq-bar-fill--critico';
      const barPct  = acertouAgora ? 100 : 0;
      const label   = acertouAgora ? 'Acertou' : errouAgora ? 'Errou' : '–';
      const enun    = (q.texto ?? '').length > 52 ? q.texto.slice(0, 52) + '…' : (q.texto ?? '');
      row.innerHTML = `
        <div class="sm-sq-meta">
          <span class="sm-sq-icone" style="color:${iconCor}">${icone}</span>
          <span class="sm-sq-enun">${enun}</span>
          ${acertouAgora ? '<span class="sm-sq-superada" title="Acertou nesta rodada">⭐</span>' : ''}
        </div>
        <div class="sm-sq-prog-row">
          <div class="sm-sq-bar-bg">
            <div class="sm-sq-bar-fill ${barCls}" style="width:${barPct}%"></div>
          </div>
          <span class="sm-sq-stat" style="color:${iconCor}">${label}</span>
        </div>`;
    } else {
      const acertos    = h ? h.acertos    : 0;
      const tentativas = h ? h.tentativas : 0;
      const taxa       = tentativas > 0 ? Math.round((acertos / tentativas) * 100) : 0;
      const barPct     = Math.min(taxa, 100);
      const barCls     = taxa >= 70 ? 'sm-sq-bar-fill--ok' : taxa >= 40 ? 'sm-sq-bar-fill--medio' : 'sm-sq-bar-fill--critico';
      const cor        = taxa >= 70 ? '#34d399' : taxa >= 40 ? '#facc15' : '#f87171';
      const icone      = acertouAgora ? '✓' : errouAgora ? '✗' : (taxa >= 70 ? '✓' : taxa >= 40 ? '~' : '✗');
      const iconCor    = acertouAgora ? '#34d399' : errouAgora ? '#f87171' : cor;
      const enun       = (q.texto ?? '').length > 52 ? q.texto.slice(0, 52) + '…' : (q.texto ?? '');
      row.innerHTML = `
        <div class="sm-sq-meta">
          <span class="sm-sq-icone" style="color:${iconCor}">${icone}</span>
          <span class="sm-sq-enun">${enun}</span>
          ${acertouAgora && tentativas >= 3 && taxa >= 80 ? '<span class="sm-sq-superada" title="Dominada">⭐</span>' : ''}
        </div>
        <div class="sm-sq-prog-row">
          <div class="sm-sq-bar-bg" title="${acertos}/${tentativas} acertos acumulados (${taxa}%)">
            <div class="sm-sq-bar-fill ${barCls}" style="width:${barPct}%"></div>
          </div>
          <span class="sm-sq-stat" style="color:${cor}">${tentativas > 0 ? acertos+'/'+tentativas : '—'}</span>
        </div>`;
    }

    lista.appendChild(row);
  }

  painel.appendChild(lista);
  resultCard.appendChild(painel);
}

/* ══════════════════════════════════════════════════════════
   PAUSA
══════════════════════════════════════════════════════════ */

function setupPausa() {
  const btnPause       = $('btn-pause');
  const btnVoltarIntro = $('btn-voltar-intro');

  const pauseOverlay = document.createElement('div');
  pauseOverlay.id        = 'pause-overlay';
  pauseOverlay.className = 'sm-pause-overlay hidden';
  pauseOverlay.innerHTML = `
  <div class="sm-pause-card">
    <div class="sm-pause-header">
      <div class="sm-pause-icon-ring">
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
          <rect x="5" y="3" width="4" height="18" rx="2"/>
          <rect x="15" y="3" width="4" height="18" rx="2"/>
        </svg>
      </div>
      <div>
        <p class="sm-pause-title">Jogo pausado</p>
        <p class="sm-pause-hint">O tempo está congelado</p>
      </div>
    </div>
    <div class="sm-pause-divider"></div>
    <div class="sm-pause-tip">
      <span class="sm-pause-tip__icon">💡</span>
      <span>Use o tempo para revisar sua estratégia antes de continuar.</span>
    </div>
    <button class="btn-proxima sm-pause-resume-btn" id="btn-retomar">
      <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><path d="M5 3l8 5-8 5V3z"/></svg>
      Retomar jogo
    </button>
    <p class="sm-pause-shortcut">ou pressione <kbd>Espaço</kbd></p>
  </div>`;
  document.body.appendChild(pauseOverlay);

  function _aplicarEstadoPausa(pausado) {
    const btnPauseEl   = $('btn-pause');
    const pauseLabelEl = $('pause-label');
    if (pausado) {
      pauseOverlay.classList.remove('hidden');
      btnPauseEl?.classList.add('sm-ctrl-btn--paused');
      if (pauseLabelEl) pauseLabelEl.textContent = 'Retomar';
    } else {
      pauseOverlay.classList.add('hidden');
      btnPauseEl?.classList.remove('sm-ctrl-btn--paused');
      if (pauseLabelEl) pauseLabelEl.textContent = 'Pausar';
    }
  }

  function togglePausa() {
    if (el.screenQuestion?.classList.contains('hidden')) return;
    if (estado.respostas[estado.indice] !== undefined) return;

    estado.pausado = !estado.pausado;
    if (estado.pausado) {
      try { estado.timer?.pause(); } catch (_) {}
      smLog('Jogo PAUSADO.');
    } else {
      try { estado.timer?.resume(); } catch (_) {}
      smLog('Jogo RETOMADO.');
    }
    _aplicarEstadoPausa(estado.pausado);
  }

  btnPause?.addEventListener('click', togglePausa);
  pauseOverlay.addEventListener('click', e => {
    if (e.target.closest('#btn-retomar')) togglePausa();
  });

  btnVoltarIntro?.addEventListener('click', async () => {
    _pararTimers();
    estado.pausado = false;
    _aplicarEstadoPausa(false);

    document.documentElement.style.setProperty('--timer-pct', '100%');
    aplicarCorBarra(100);

    await _aoVoltarIntro();
  });

  document.addEventListener('keydown', e => {
    if (e.code === 'Space' &&
        !el.screenQuestion?.classList.contains('hidden') &&
        estado.respostas[estado.indice] === undefined) {
      if (document.activeElement?.id === 'btn-retomar') return;
      e.preventDefault();
      togglePausa();
    }
  });
}

/* ══════════════════════════════════════════════════════════
   ATALHOS DE TECLADO
══════════════════════════════════════════════════════════ */

function registrarAtalhos() {
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (estado.pausado) return;
    if (!el.screenQuestion || el.screenQuestion.classList.contains('hidden')) return;

    const jaResp = estado.respostas[estado.indice] !== undefined;
    switch (e.key) {
      case '1': case 'a': case 'A': if (!jaResp) { e.preventDefault(); responder('A'); } break;
      case '2': case 'b': case 'B': if (!jaResp) { e.preventDefault(); responder('B'); } break;
      case '3': case 'c': case 'C': if (!jaResp) { e.preventDefault(); responder('C'); } break;
      case '4': case 'd': case 'D': if (!jaResp) { e.preventDefault(); responder('D'); } break;
      case 'ArrowRight': case 'Enter': if (jaResp) { e.preventDefault(); irProxima(); } break;
      case 'ArrowLeft': e.preventDefault(); irAnterior(); break;
    }
  });
}

/* ══════════════════════════════════════════════════════════
   CONTADORES
══════════════════════════════════════════════════════════ */

function atualizarContadores() {
  const n = estado.perguntas.length;
  if (el.scoreTotal) el.scoreTotal.textContent = n;
  const introTotal = $('intro-total-questoes');
  if (introTotal) introTotal.textContent = n;
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */

async function init() {
  Object.assign(el, {
    screenIntro:    $('screen-intro'),
    screenQuestion: $('screen-question'),
    screenResult:   $('screen-result'),
    screenEmpty:    $('screen-empty'),
    btnStart:       $('btn-start'),
    btnAnterior:    $('btn-anterior'),
    btnProxima:     $('btn-proxima'),
    numPergunta:    $('num-pergunta'),
    perguntaNivel:  $('pergunta-nivel'),
    perguntaTexto:  $('pergunta-texto'),
    progressFill:   $('progress-fill'),
    pontuacaoHud:   $('pontuacao-hud'),
    scoreTotal:     $('score-total'),
    timerBar:       document.querySelector('.game-timer-bar'),
  });

  smLog('Inicializando Show do Milhão v3.0...');

  const { disc, sem } = Shell.init({ icon: '🃏', nome: 'Show do Milhão' });

  // Garante que Pausar/Menu ficam ocultos até a tela de questões
  $('header-controls')?.classList.remove('game-header__controls--visible');

  const _listaDisciplinas = getDisciplinasDeSemestre(sem);
  const disciplina = _listaDisciplinas.find(d => d.id === disc || d.arquivo === disc) ?? null;

  const shellDiscEl = $('shell-disc-name');
  if (shellDiscEl && disciplina) shellDiscEl.textContent = disciplina.apelido ?? disciplina.nome ?? disc;
  $('shell-icon') && ($('shell-icon').textContent = '🃏');

  const introDiscName = $('intro-disc-name');
  const introSemLabel = $('intro-sem-label');
  if (introDiscName) introDiscName.textContent = disciplina?.apelido ?? disciplina?.nome ?? disc ?? '—';
  if (introSemLabel) introSemLabel.textContent = sem || '—';

  const introDiscChip = document.querySelector('.sm-chip--disc');
  if (introDiscChip && disciplina?.emoji) {
    const chipSvg = introDiscChip.querySelector('svg');
    if (chipSvg) {
      const emojiSpan = document.createElement('span');
      emojiSpan.textContent = disciplina.emoji;
      emojiSpan.style.cssText = 'font-size:13px;line-height:1;display:inline-flex;align-items:center;';
      chipSvg.replaceWith(emojiSpan);
    }
  }

  try { aplicarCoresDisciplina(disc, DISC_CORES); } catch (_) {}

  // ── Import dinâmico de dados ──
  const ano = sem ? sem.split('.')[0] : null;
  let banco   = [];
  let semDisp = null;

  if (ano) {
    try {
      const modulo = await import(`../../../content/game/show_milhao/${ano}/show_milhao_data.js`);
      semDisp = modulo.SHOW_MILHAO_DATA?.[sem] ?? null;
      banco   = semDisp?.[disc] ?? [];
    } catch (err) {
      smWarn(`Arquivo de dados não encontrado para o ano ${ano}:`, err.message);
    }
  }

  estado.banco = banco;
  smLog(`Banco carregado: ${banco.length} questão(ões) para ${disc}/${sem}`);

  if (banco.length === 0) {
    mostrarTela('empty', false);
    const btnBack    = $('btn-empty-back');
    const emptyTitle = $('empty-title');
    const emptyDesc  = $('empty-desc');
    if (btnBack) btnBack.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;
    if (!semDisp || Object.keys(semDisp).length === 0) {
      if (emptyTitle) emptyTitle.textContent = 'Indisponível neste semestre';
      if (emptyDesc)  emptyDesc.innerHTML =
        `O jogo <strong>Show do Milhão</strong> ainda não está disponível para o semestre <strong>${sem || '—'}</strong>.<br>
         Selecione outro semestre ou aguarde novas adições!`;
    } else {
      if (emptyTitle) emptyTitle.textContent = 'Sem perguntas';
      if (emptyDesc)  emptyDesc.innerHTML =
        'Não encontramos questões para esta disciplina ainda.<br>Tente outra ou aguarde novas adições!';
    }
    return;
  }

  // ── Usuário e SessionNav ──
  const usuarioObj = getUsuario();
  estado.usuario   = usuarioObj?.uid ?? 'visitante';
  estado.discId    = disc;
  estado.sem       = sem;

  const nav = SessionNav.criar({
    uid:        estado.usuario,
    discId:     disc,
    sem,
    ttlMs:      CONFIG.SESSAO_TTL_MS,
    throttleMs: CONFIG.SESSAO_THROTTLE_MS,
  });
  estado._nav = nav;

  // ── Histórico e deck inicial ──
  estado.historicoSM = await carregarHistoricoSM(estado.usuario, disc, sem).catch(() => ({}));
  estado.perguntas   = montarDeck(banco, estado.historicoSM);

  atualizarContadores();
  aplicarCorBarra(100);

  // ── Botão Revisar Erros na intro ──
  const erradasInit = questoesComErro(banco, estado.historicoSM);
  if (erradasInit.length > 0) _atualizarBtnRevisarErros();

  // ── Eventos dos botões de jogo ──
  el.btnAnterior?.addEventListener('click', irAnterior);
  el.btnProxima?.addEventListener('click', irProxima);

  $('alternativas')?.addEventListener('click', e => {
    const btn = e.target.closest('.alt-btn');
    if (btn && !btn.disabled) responder(btn.dataset.letra);
  });

  el.btnStart?.addEventListener('click', () => {
    limparSessao();
    const bloco = $('intro-continuar');
    if (bloco) bloco.style.display = 'none';
    iniciarJogo(false);
  });

  // Botão Voltar do header
  document.getElementById('shell-back-btn')?.addEventListener('click', () => {
    salvarSessao('intro');
    nav.sairParaRota();
  });

  setupPausa();
  registrarAtalhos();

  // ── Restauração de sessão / intro ──
  const sessaoRestauravel = nav.pegarRestauravel();

  if (sessaoRestauravel) {
    // F5 durante o jogo → restaura direto na questão
    continuarSessao(sessaoRestauravel);
    nav.pronto();
  } else {
    // Navegação nova → intro (com botão continuar se houver save)
    const sessaoSalva = nav.lerSessao();
    if (sessaoSalva?.perguntas?.length > 0) {
      configurarBtnContinuar(sessaoSalva, continuarSessao);
    }
    mostrarTela('intro', false);
    nav.pronto();
  }

  // Expõe debug global
  window.smDebugJogo = () => debugEstado(estado.usuario, estado.discId, estado.sem);
  smLog('Init concluído. Use smDebugJogo() para inspecionar o estado.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}