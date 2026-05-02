/* ============================================================
   NEXUS STUDY — games/jogos/show_milhao/show_milhao.js

   Salvamento: 100% localStorage via storage_sm.js
   - salvarEstadoPartida()  →  chamado após CADA ação do usuário
   - carregarEstadoPartida() → ao iniciar, oferece retomar partida salva
   - salvarResultadoSM()    →  ao finalizar, grava histórico acumulado
   ============================================================ */

import { Shell, Timer, shuffle, lerParams }    from '../../template/game-shell.js';
import { DISC_CORES }                          from '../../../shared/js/cores.js';
import { aplicarCoresDisciplina }              from '../../../shared/js/theme.js';
import { getUsuario, getDisciplinasDeSemestre } from '../../../src/global.js';

import {
  salvarEstadoPartida,
  carregarEstadoPartida,
  limparEstadoPartida,
  carregarHistoricoSM,
  salvarResultadoSM,
  limparHistoricoSM,
  debugEstado,
  smLog, smWarn, smError,
} from './storage_sm.js';

/* ══════════════════════════════════════════════════════════
   CONFIGURAÇÃO
   ══════════════════════════════════════════════════════════ */

const CONFIG = {
  TEMPO_POR_QUESTAO: 30,
  MAX_QUESTOES:      10,
  PESO_NUNCA_VISTO:   3,
  PESO_MIN:           1,
  PESO_MAX:          10,
};

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
  pausado:        false,
  usuario:        null,
  discId:         null,
  sem:            null,
  historicoSM:    {},
  tempoInicio:    null,
  temErro:        false,
  indicePendente: null,
  premioPendente: null,
  _fallback:      null,
};

/* ══════════════════════════════════════════════════════════
   SALVAR ESTADO — chamado após CADA ação
   ══════════════════════════════════════════════════════════ */

function salvar() {
  return salvarEstadoPartida(estado);
}

/* ══════════════════════════════════════════════════════════
   DOM
   ══════════════════════════════════════════════════════════ */

const $ = id => document.getElementById(id);
const el = {};

/* ══════════════════════════════════════════════════════════
   SELEÇÃO PONDERADA
   ══════════════════════════════════════════════════════════ */

function calcularPeso(id, historico) {
  const h = historico[id];
  if (!h || h.tentativas === 0) return CONFIG.PESO_NUNCA_VISTO;
  const taxaErro = h.erros / h.tentativas;
  return Math.round(CONFIG.PESO_MIN + taxaErro * (CONFIG.PESO_MAX - CONFIG.PESO_MIN));
}

function sorteiarPonderado(candidatos, n) {
  const pool = [...candidatos];
  const sel  = [];
  while (sel.length < n && pool.length > 0) {
    const total = pool.reduce((a, c) => a + c.peso, 0);
    if (total <= 0) {
      const i = Math.floor(Math.random() * pool.length);
      sel.push(pool[i].item);
      pool.splice(i, 1);
      continue;
    }
    let rand = Math.random() * total;
    let hit  = false;
    for (let i = 0; i < pool.length; i++) {
      rand -= pool[i].peso;
      if (rand <= 0) {
        sel.push(pool[i].item);
        pool.splice(i, 1);
        hit = true;
        break;
      }
    }
    if (!hit && pool.length > 0) {
      sel.push(pool[pool.length - 1].item);
      pool.splice(pool.length - 1, 1);
    }
  }
  return sel;
}

function montarDeck(banco, historico) {
  const n     = Math.min(CONFIG.MAX_QUESTOES, banco.length);
  const cands = banco.map(q => ({ item: q, peso: calcularPeso(q.id, historico) }));
  return shuffle(sorteiarPonderado(cands, n));
}

/* ══════════════════════════════════════════════════════════
   TELAS
   ══════════════════════════════════════════════════════════ */

function mostrarTela(nome) {
  $('screen-loading')?.classList.add('hidden');
  el.screenIntro   ?.classList.add('hidden');
  el.screenQuestion?.classList.add('hidden');
  el.screenResult  ?.classList.add('hidden');
  el.screenEmpty   ?.classList.add('hidden');
  if (nome === 'intro')    el.screenIntro   ?.classList.remove('hidden');
  if (nome === 'question') el.screenQuestion?.classList.remove('hidden');
  if (nome === 'result')   el.screenResult  ?.classList.remove('hidden');
  if (nome === 'empty')    el.screenEmpty   ?.classList.remove('hidden');
  smLog(`Tela: ${nome}`);
}

/* ══════════════════════════════════════════════════════════
   BOLINHAS DE PROGRESSO
   ══════════════════════════════════════════════════════════ */

function renderDots() {
  const container = $('sm-dots');
  if (!container) return;
  container.innerHTML = '';

  // Garante que perguntas e respostas têm o mesmo comprimento antes de renderizar
  // Isso evita o bug onde um deck reordenado causa p.correta errado
  if (estado.perguntas.length !== estado.respostas.length) {
    smWarn(`renderDots: perguntas(${estado.perguntas.length}) ≠ respostas(${estado.respostas.length}) — deck dessincronizado!`);
  }

  estado.perguntas.forEach((p, i) => {
    const resp       = estado.respostas[i];
    const respondida = resp !== undefined;
    // Compara com a CORRETA da pergunta que está nesse índice do deck atual
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

  smLog(`Dots: [${estado.respostas.map((r, i) => {
    if (r === undefined) return '?';
    if (r === null) return '⏰';
    return r === estado.perguntas[i]?.correta ? '✓' : '✗';
  }).join('')}]`);
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
   FLUXO — INICIAR JOGO
   ══════════════════════════════════════════════════════════ */

function iniciarJogo(retomando = false) {
  if (!retomando) {
    // Nova partida: limpa save anterior e monta deck novo
    limparEstadoPartida(estado.discId, estado.sem);
    estado.perguntas      = montarDeck(estado.banco, estado.historicoSM);
    estado.indice         = 0;
    estado.acertos        = 0;
    estado.tempoInicio    = Date.now();
    estado.respostas      = new Array(estado.perguntas.length); // undefined
    estado.tempos         = new Array(estado.perguntas.length).fill(CONFIG.TEMPO_POR_QUESTAO);
    estado.temErro        = false;
    estado.indicePendente = null;
    estado.premioPendente = null;
    estado.pausado        = false;
    smLog('Nova partida iniciada.', `Deck: ${estado.perguntas.length} questões.`);
  } else {
    smLog('Partida retomada do save.', `Q${estado.indice + 1}/${estado.perguntas.length}`);
  }

  // Salva imediatamente o estado inicial
  salvar();

  atualizarContadores();
  construirListaPremios();
  mostrarTela('question');
  renderizarQuestao();
}

/* ══════════════════════════════════════════════════════════
   TIMER
   ══════════════════════════════════════════════════════════ */

function criarTimer(totalInicial) {
  return Timer.criar({
    total: totalInicial ?? CONFIG.TEMPO_POR_QUESTAO,
    onTick: (restante) => {
      estado.tempos[estado.indice] = restante;
      atualizarTimerUI(restante);
      // Salva o tempo restante a cada tick para não perder progresso
      salvar();
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
    `| temErro: ${estado.temErro}`);

  if (el.numPergunta)  el.numPergunta.textContent  = `${num}/${estado.perguntas.length}`;
  if (el.perguntaNivel) el.perguntaNivel.textContent = `Nível ${num} — ${pergunta.nivel ?? ''}`;
  if (el.perguntaTexto) el.perguntaTexto.textContent = pergunta.texto;
  if (el.progressFill) el.progressFill.style.width  = (num / estado.perguntas.length * 100) + '%';
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
    if (!correto) {
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
  if (estado.timer) {
    try { estado.timer.stop(); } catch (_) {}
    estado.timer = null;
  }
  if (estado._fallback) {
    clearInterval(estado._fallback);
    estado._fallback = null;
  }

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
        salvar(); // salva a cada segundo no fallback também
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
   RESPONDER
   ══════════════════════════════════════════════════════════ */

function responder(letra) {
  if (estado.pausado) return;
  if (estado.respostas[estado.indice] !== undefined) return;

  try { estado.timer?.stop(); } catch (_) {}
  if (estado._fallback) { clearInterval(estado._fallback); estado._fallback = null; }

  smLog(`Q${estado.indice + 1}: usuário escolheu "${letra}".`);
  registrarResposta(letra);
}

function registrarResposta(resp) {
  const pergunta = estado.perguntas[estado.indice];
  const correto  = resp === pergunta.correta;

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
    smLog(`Q${estado.indice + 1}: ACERTO ✓ | acertos agora: ${estado.acertos} → ${PREMIOS[estado.acertos - 1]?.valor}`);

  } else {
    if (!estado.temErro) {
      estado.indicePendente = estado.indice;
      estado.premioPendente = estado.indice;
    }
    estado.temErro = true;
    smLog(`Q${estado.indice + 1}: ERRO ✗ | prêmio travado em ${PREMIOS[estado.indice]?.valor}`);
  }

  // ── SALVA IMEDIATAMENTE após registrar a resposta ──
  salvar();

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
  const btnProx = $('btn-proxima');

  const p         = estado.perguntas[estado.indice];
  const isUltima  = estado.indice >= estado.perguntas.length - 1;
  const todasResp = estado.respostas.every(r => r !== undefined);

  if (tempoAcabou) {
    if (icone) icone.textContent = '⏰';
    if (msg)   { msg.textContent = 'Tempo Esgotado!'; msg.style.color = '#ff9800'; }
    if (resp)  resp.textContent  = `A resposta correta era: ${p.correta} — ${p.alternativas[p.correta]}`;

  } else if (correto) {
    const resolveupendente = estado.acertos <= estado.indice;
    if (icone) icone.textContent = isUltima ? '🏆' : '✅';
    if (msg) {
      msg.textContent = resolveupendente
        ? '✅ Prêmio pendente conquistado!'
        : (isUltima ? '🏆 Você é o Milionário!' : 'Correto! Excelente!');
      msg.style.color = '#00e676';
    }
    if (resp) resp.textContent = `Você ganhou: ${PREMIOS[estado.acertos - 1]?.valor || 'R$ 0'}`;

  } else {
    if (icone) icone.textContent = '❌';
    if (msg)   { msg.textContent = 'Resposta Errada! Prêmio travado 🔴'; msg.style.color = '#ff1744'; }
    if (resp)  resp.textContent  = `A correta era: ${p.correta} — ${p.alternativas[p.correta]} · Acerte a próxima para ganhar ${PREMIOS[estado.indice]?.valor}`;
  }

  if (btnProx) {
    const isFinish = (isUltima && todasResp) || !correto || tempoAcabou;
    btnProx.textContent = isFinish ? 'VER RESULTADO →' : 'PRÓXIMA →';
  }

  fb?.classList.add('visivel');
}

/* ══════════════════════════════════════════════════════════
   NAVEGAÇÃO
   ══════════════════════════════════════════════════════════ */

function navegarPara(i) {
  if (i < 0 || i >= estado.perguntas.length) return;
  try { estado.timer?.stop(); } catch (_) {}
  if (estado._fallback) { clearInterval(estado._fallback); estado._fallback = null; }

  smLog(`Navegando Q${estado.indice + 1} → Q${i + 1}`);
  estado.indice = i;

  // Salva mudança de índice
  salvar();

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

function finalizarJogo() {
  try { estado.timer?.stop(); } catch (_) {}
  if (estado._fallback) { clearInterval(estado._fallback); estado._fallback = null; }

  smLog('Jogo finalizado. Salvando histórico...');
  debugEstado(estado.discId, estado.sem);

  const resultados = estado.perguntas.map((p, i) => ({
    id:      p.id ?? `q${i}`,
    resp:    estado.respostas[i],
    acertou: estado.respostas[i] === p.correta,
  })).filter(r => r.resp !== null && r.resp !== undefined);

  // Salva histórico acumulado
  salvarResultadoSM(estado.usuario, estado.discId, estado.sem, resultados);

  // Apaga o save de partida em curso (partida concluída)
  limparEstadoPartida(estado.discId, estado.sem);

  // Atualiza cache em memória
  for (const { id, acertou, resp } of resultados) {
    if (resp === null || resp === undefined) continue;
    const entrada = estado.historicoSM[id] ?? {
      tentativas: 0, acertos: 0, erros: 0, ultimaVez: 0, acertosConsecutivos: 0,
    };
    entrada.tentativas++;
    if (acertou) { entrada.acertos++; entrada.acertosConsecutivos = (entrada.acertosConsecutivos ?? 0) + 1; }
    else         { entrada.erros++;   entrada.acertosConsecutivos = 0; }
    entrada.ultimaVez     = Date.now();
    estado.historicoSM[id] = entrada;
  }

  // Monta tela de resultado
  const valorFinal    = estado.acertos > 0 ? PREMIOS[estado.acertos - 1].valor : 'R$ 0';
  const respondidas   = estado.respostas.filter(r => r !== null && r !== undefined).length;
  const pct           = respondidas > 0 ? Math.round((estado.acertos / respondidas) * 100) : 0;
  const todosCorretos = estado.acertos === estado.perguntas.length;

  smLog(`Resultado final: ${estado.acertos} acertos / ${respondidas} respondidas → ${pct}% → ${valorFinal}`);

  let emoji, titulo;
  if      (pct >= 80) { emoji = '🏆'; titulo = todosCorretos ? 'MILIONÁRIO!' : 'Excelente!'; }
  else if (pct >= 50) { emoji = '🌟'; titulo = 'Muito bem!'; }
  else                { emoji = '📚'; titulo = 'Pode melhorar!'; }

  const elSimb     = $('resultado-simbolo');
  const elTitulo   = $('resultado-titulo');
  const elValor    = $('resultado-valor');
  const elAcertos  = $('resultado-acertos');
  const elErros    = $('resultado-erros');
  const elPrecisao = $('resultado-precisao');
  const elTempo    = $('resultado-tempo');
  const elSair     = $('resultado-btn-sair');
  const elRejogo   = $('resultado-btn-rejogo');

  if (elSimb)    elSimb.textContent    = emoji;
  if (elTitulo)  elTitulo.textContent  = titulo;
  if (elValor)   elValor.textContent   = valorFinal;
  if (elAcertos) elAcertos.textContent = estado.acertos;
  if (elErros)   elErros.textContent   = respondidas - estado.acertos;
  if (elPrecisao) elPrecisao.textContent = pct + '%';

  if (elTempo) {
    const totalSeg = Math.round((Date.now() - (estado.tempoInicio ?? Date.now())) / 1000);
    const mm = Math.floor(totalSeg / 60);
    const ss = String(totalSeg % 60).padStart(2, '0');
    elTempo.textContent = `${mm}:${ss}`;
  }

  if (elSair) {
    elSair.removeAttribute('href');
    const novoSair = elSair.cloneNode(true);
    elSair.parentNode.replaceChild(novoSair, elSair);
    novoSair.addEventListener('click', async (e) => {
      e.preventDefault();
      estado.historicoSM = carregarHistoricoSM(estado.usuario, estado.discId, estado.sem);
      estado.perguntas   = montarDeck(estado.banco, estado.historicoSM);
      atualizarContadores();
      mostrarTela('intro');
    });
  }

  if (elRejogo) {
    const novoRejogo = elRejogo.cloneNode(true);
    elRejogo.parentNode.replaceChild(novoRejogo, elRejogo);
    novoRejogo.addEventListener('click', () => {
      estado.historicoSM = carregarHistoricoSM(estado.usuario, estado.discId, estado.sem);
      estado.perguntas   = montarDeck(estado.banco, estado.historicoSM);
      if (estado.perguntas.length === 0) { mostrarTela('empty'); return; }
      atualizarContadores();
      iniciarJogo(false);
    });
  }

  renderEstatisticasQuestoes(estado.historicoSM, estado.perguntas);
  mostrarTela('result');
}

/* ══════════════════════════════════════════════════════════
   ESTATÍSTICAS POR QUESTÃO
   ══════════════════════════════════════════════════════════ */

function renderEstatisticasQuestoes(historico, perguntas) {
  const resultCard = document.querySelector('.resultado-nucleo');
  if (!resultCard) return;
  resultCard.querySelector('.sm-stats-questoes')?.remove();

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
    const idx         = estado.perguntas.indexOf(q);
    const respAtual   = estado.respostas[idx];
    const acertouAgora = respAtual !== null && respAtual !== undefined && respAtual === q.correta;
    const errouAgora   = respAtual !== null && respAtual !== undefined && respAtual !== q.correta;

    const acertos    = h ? h.acertos    : 0;
    const tentativas = h ? h.tentativas : 0;
    const taxa       = tentativas > 0 ? Math.round((acertos / tentativas) * 100) : 0;
    const barPct = Math.min(taxa, 100);
    const barCls = taxa >= 70 ? 'sm-prog-bar--ok' : taxa >= 40 ? 'sm-prog-bar--medio' : 'sm-prog-bar--critico';
    const cor    = taxa >= 70 ? '#34d399' : taxa >= 40 ? '#facc15' : '#f87171';
    const icone  = acertouAgora ? '✓' : errouAgora ? '✗' : (taxa >= 70 ? '✓' : taxa >= 40 ? '~' : '✗');
    const iconCor= acertouAgora ? '#34d399' : errouAgora ? '#f87171' : cor;
    const enun   = (q.texto ?? '').length > 52 ? q.texto.slice(0, 52) + '…' : (q.texto ?? '');

    const row = document.createElement('div');
    row.className = 'sm-sq-row sm-sq-row--prog';
    row.innerHTML = `
      <div class="sm-sq-meta">
        <span class="sm-sq-icone" style="color:${iconCor}">${icone}</span>
        <span class="sm-sq-enun">${enun}</span>
      </div>
      <div class="sm-sq-prog-row">
        <div class="sm-sq-bar-bg" title="${acertos}/${tentativas} acertos acumulados (${taxa}%)">
          <div class="sm-sq-bar-fill ${barCls}" style="width:${barPct}%"></div>
        </div>
        <span class="sm-sq-stat" style="color:${cor}">${tentativas > 0 ? acertos+'/'+tentativas : '—'}</span>
      </div>`;
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
    <button class="game-btn sm-pause-resume-btn" id="btn-retomar">
      <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><path d="M5 3l8 5-8 5V3z"/></svg>
      Retomar jogo
    </button>
    <p class="sm-pause-shortcut">ou pressione <kbd>Espaço</kbd></p>
  </div>`;
  document.body.appendChild(pauseOverlay);

  function togglePausa() {
    if (el.screenQuestion?.classList.contains('hidden')) return;
    if (estado.respostas[estado.indice] !== undefined) return;

    estado.pausado = !estado.pausado;
    const btnPauseEl   = $('btn-pause');
    const pauseIconEl  = $('pause-icon');
    const pauseLabelEl = $('pause-label');

    if (estado.pausado) {
      try { estado.timer?.pause(); } catch (_) {}
      pauseOverlay.classList.remove('hidden');
      btnPauseEl?.classList.add('sm-ctrl-btn--paused');
      if (pauseLabelEl) pauseLabelEl.textContent = 'Retomar';
      smLog('Jogo PAUSADO.');
    } else {
      try { estado.timer?.resume(); } catch (_) {}
      pauseOverlay.classList.add('hidden');
      btnPauseEl?.classList.remove('sm-ctrl-btn--paused');
      if (pauseLabelEl) pauseLabelEl.textContent = 'Pausar';
      smLog('Jogo RETOMADO.');
    }
  }

  btnPause?.addEventListener('click', togglePausa);
  pauseOverlay.addEventListener('click', e => {
    if (e.target.closest('#btn-retomar')) togglePausa();
  });

  btnVoltarIntro?.addEventListener('click', () => {
    try { estado.timer?.stop(); } catch (_) {}
    if (estado._fallback) { clearInterval(estado._fallback); estado._fallback = null; }
    estado.timer   = null;
    estado.pausado = false;
    pauseOverlay.classList.add('hidden');
    $('btn-pause')?.classList.remove('sm-ctrl-btn--paused');
    const pl = $('pause-label');
    if (pl) pl.textContent = 'Pausar';

    document.documentElement.style.setProperty('--timer-pct', '100%');
    aplicarCorBarra(100);

    // ── CRÍTICO: salva o estado ANTES de qualquer outra operação ──
    // Não remonta o deck aqui para não dessincronizar perguntas ↔ respostas
    salvar();
    smLog('Voltou ao menu — estado salvo para retomada posterior.',
      `Deck preservado: ${estado.perguntas.length} questões, respostas: [${estado.respostas.map(r => r ?? '—').join(', ')}]`);

    // Recarrega histórico em memória sem alterar o deck salvo
    estado.historicoSM = carregarHistoricoSM(estado.usuario, estado.discId, estado.sem);
    // NÃO recria o deck aqui — o deck correto está no save e será restaurado no modal
    atualizarContadores();
    mostrarTela('intro');
    // Atualiza botão continuar na intro (save ainda existe)
    el._atualizarBtnContinuar?.();
  });

  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !el.screenQuestion?.classList.contains('hidden') &&
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
   MODAL DE RETOMADA DE PARTIDA
   ══════════════════════════════════════════════════════════ */

function mostrarModalRetomada(saveData, onRetomar, onNova) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:200;
    background:rgba(0,0,0,.85);backdrop-filter:blur(8px);
    display:flex;align-items:center;justify-content:center;
  `;

  const q = saveData.perguntas.length;
  const respondidas = saveData.respostas.filter(r => r !== undefined).length;
  const idadeMin = Math.round((Date.now() - (saveData.salvoEm ?? saveData.tempoInicio ?? Date.now())) / 60000);

  overlay.innerHTML = `
    <div style="
      background:rgba(5,10,40,.95);border:1px solid rgba(255,215,0,.35);
      border-radius:12px;padding:32px 28px;max-width:380px;width:90%;
      text-align:center;display:flex;flex-direction:column;gap:16px;
    ">
      <div style="font-size:2.5rem">⏱️</div>
      <h2 style="font-family:'Cinzel',serif;color:#FFD700;font-size:1.3rem;">Partida em andamento</h2>
      <p style="color:rgba(255,255,255,.65);font-size:.9rem;line-height:1.5;">
        Você tem uma partida salva há <strong style="color:#FFD700">${idadeMin} min</strong>.
        <br>Questão <strong style="color:#FFD700">${saveData.indice + 1}/${q}</strong>
        · ${respondidas} respondida(s).
      </p>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px;">
        <button id="btn-retomar-save" style="
          font-family:'Cinzel',serif;font-size:1rem;font-weight:700;letter-spacing:2px;
          padding:14px 32px;background:linear-gradient(135deg,#B8860B,#FFD700);
          color:#0a0e2a;border:none;border-radius:4px;cursor:pointer;
        ">▶ CONTINUAR</button>
        <button id="btn-nova-save" style="
          font-family:'Cinzel',serif;font-size:.85rem;padding:10px 24px;
          background:rgba(255,255,255,.07);color:rgba(255,255,255,.55);
          border:1px solid rgba(255,255,255,.12);border-radius:4px;cursor:pointer;
        ">Ignorar e jogar novo</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  overlay.querySelector('#btn-retomar-save').addEventListener('click', () => {
    overlay.remove();
    onRetomar();
  });
  overlay.querySelector('#btn-nova-save').addEventListener('click', () => {
    overlay.remove();
    onNova();
  });
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

  smLog('Inicializando Show do Milhão...');

  const { disc, sem } = Shell.init({ icon: '⭐', nome: 'Show do Milhão' });

  const _listaDisciplinas = getDisciplinasDeSemestre(sem);
  const disciplina = _listaDisciplinas.find(d => d.id === disc || d.arquivo === disc) ?? null;

  const shellDiscEl = $('shell-disc-name');
  if (shellDiscEl && disciplina) shellDiscEl.textContent = disciplina.apelido ?? disciplina.nome ?? disc;
  // Aplica emoji da disciplina no ícone do header (sobrescreve o padrão do Shell.init)
  const shellIconEl = $('shell-icon');
  if (shellIconEl) shellIconEl.textContent = disciplina?.emoji ?? '⭐';

  const introDiscName = $('intro-disc-name');
  const introSemLabel = $('intro-sem-label');
  if (introDiscName) introDiscName.textContent = disciplina?.apelido ?? disciplina?.nome ?? disc ?? '—';
  if (introSemLabel) introSemLabel.textContent = sem || '—';

  const introDiscChip = document.querySelector('.sm-intro-card__chip--disc');
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

  /* ── Import dinâmico de dados ── */
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
    mostrarTela('empty');
    const btnBack = $('btn-empty-back');
    if (btnBack) btnBack.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;

    const emptyTitle = $('empty-title');
    const emptyDesc  = $('empty-desc');
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

  const usuarioObj = getUsuario();
  estado.usuario   = usuarioObj?.uid ?? 'visitante';
  estado.discId    = disc;
  estado.sem       = sem;

  // Carrega histórico do localStorage (síncrono, nunca falha)
  estado.historicoSM = carregarHistoricoSM(estado.usuario, disc, sem);

  // Verifica se há partida salva
  const saveData = carregarEstadoPartida(disc, sem);

  // ── Função que configura/atualiza o botão continuar na intro ──
  function atualizarBtnContinuar() {
    const save = carregarEstadoPartida(estado.discId, estado.sem);
    const blocoContinu = $('intro-continuar');
    const btnContinu   = $('btn-continuar');
    const infoCont     = $('continuar-info');

    if (save && blocoContinu) {
      const respondidas = save.respostas.filter(r => r !== '__vazio__' && r !== undefined).length;
      const idadeMin    = Math.round((Date.now() - (save.salvoEm ?? save.tempoInicio ?? Date.now())) / 60000);
      blocoContinu.style.display = 'flex';
      if (infoCont) infoCont.textContent = `Questão ${save.indice + 1}/${save.perguntas.length} · ${respondidas} respondida(s) · salva há ${idadeMin} min`;

      if (btnContinu && !btnContinu._bound) {
        btnContinu._bound = true;
        btnContinu.addEventListener('click', () => {
          const latestSave = carregarEstadoPartida(estado.discId, estado.sem);
          if (!latestSave) { atualizarBtnContinuar(); return; }

          const idsBanco = new Set(banco.map(q => q.id));
          const salvasValidas = latestSave.perguntas.filter(p => !p.id || idsBanco.has(p.id));
          if (salvasValidas.length === 0) {
            limparEstadoPartida(disc, sem);
            blocoContinu.style.display = 'none';
            return;
          }

          Object.assign(estado, {
            perguntas:      latestSave.perguntas,
            indice:         latestSave.indice,
            acertos:        latestSave.acertos,
            respostas:      Array.from(latestSave.respostas),
            tempos:         Array.from(latestSave.tempos),
            temErro:        latestSave.temErro,
            indicePendente: latestSave.indicePendente,
            premioPendente: latestSave.premioPendente,
            tempoInicio:    latestSave.tempoInicio,
          });

          atualizarContadores();
          aplicarCorBarra(100);
          iniciarJogo(true);
        });
      }
    } else if (blocoContinu) {
      blocoContinu.style.display = 'none';
    }
  }

  // ── Eventos fixos — registrados UMA única vez ──────────────────────
  el.btnAnterior?.addEventListener('click', irAnterior);
  el.btnProxima ?.addEventListener('click', irProxima);

  $('alternativas')?.addEventListener('click', e => {
    const btn = e.target.closest('.alt-btn');
    if (btn && !btn.disabled) responder(btn.dataset.letra);
  });

  el.btnStart?.addEventListener('click', () => {
    smLog('btnStart clicado | perguntas em memória:', estado.perguntas.length);
    limparEstadoPartida(estado.discId, estado.sem);
    const blocoContinu = $('intro-continuar');
    if (blocoContinu) blocoContinu.style.display = 'none';
    estado.historicoSM = carregarHistoricoSM(estado.usuario, estado.discId, estado.sem);
    estado.perguntas   = montarDeck(estado.banco, estado.historicoSM);
    if (estado.perguntas.length === 0) { mostrarTela('empty'); return; }
    iniciarJogo(false);
  });

  setupPausa();
  registrarAtalhos();

  // Monta deck inicial e atualiza botão continuar
  estado.perguntas = montarDeck(banco, estado.historicoSM);
  atualizarContadores();
  aplicarCorBarra(100);
  atualizarBtnContinuar();
  mostrarTela('intro');

  // Quando voltar ao menu, atualiza o botão continuar
  el._atualizarBtnContinuar = atualizarBtnContinuar;

  // Expõe debug global
  window.smDebugJogo = () => debugEstado(estado.discId, estado.sem);
  smLog('Init concluído. Use smDebugJogo() no console para inspecionar o estado.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}