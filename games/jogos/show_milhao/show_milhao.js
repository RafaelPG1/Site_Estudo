/* ============================================================
   NEXUS STUDY — games/jogos/show_milhao/show_milhao.js

   Arquitetura idêntica ao vdd_falso.js:
   - import dinâmico de dados por ano do semestre
   - storage separado (storage_sm.js) com Firestore + localStorage
   - seleção ponderada por histórico de desempenho
   - timer via game-shell Timer (+ fallback nativo)
   - telas: intro | question | result | empty
   - pausa, atalhos de teclado
   ============================================================ */

import { Shell, Timer, shuffle, lerParams }    from '../../template/game-shell.js';
import { DISC_CORES }                          from '../../../shared/js/cores.js';
import { aplicarCoresDisciplina }              from '../../../shared/js/theme.js';
import { carregarHistoricoSM, salvarResultadoSM } from './storage_sm.js';
import { getUsuario, getDisciplinasDeSemestre } from '../../../src/global.js';

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

// Tabela de prêmios — 10 níveis
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
   ESTADO
   ══════════════════════════════════════════════════════════ */

const estado = {
  perguntas:   [],
  banco:       [],
  indice:      0,
  // acertos: quantidade de prêmios efetivamente conquistados (pontuação real)
  acertos:     0,
  // respostas[i] = 'A'|'B'|'C'|'D' | null (tempo) | undefined (não respondeu)
  respostas:   [],
  tempos:      [],
  timer:       null,
  pausado:     false,
  usuario:     null,
  discId:      null,
  sem:         null,
  historicoSM: {},
  tempoInicio: null,
  // Sistema de erro pendente:
  // temErro: true se há um prêmio travado aguardando resolução
  // indicePendente: índice da pergunta que gerou o erro (nível vermelho)
  // premioPendente: valor (índice em PREMIOS) que será liberado ao acertar
  temErro:        false,
  indicePendente: null,
  premioPendente: null,
};

/* ══════════════════════════════════════════════════════════
   DOM
   ══════════════════════════════════════════════════════════ */

const $ = id => document.getElementById(id);
const el = {};

/* ══════════════════════════════════════════════════════════
   SELEÇÃO PONDERADA (idêntica ao vdd_falso)
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
  const n    = Math.min(CONFIG.MAX_QUESTOES, banco.length);
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
    const correto    = respondida && resp === p.correta;
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
   LISTA DE PRÊMIOS LATERAL
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
  // Amarelo congelado no erro enquanto temErro=true; avanca so apos resolver
  const nivelAtual   = estado.temErro ? estado.indicePendente : estado.acertos;

  document.querySelectorAll('.premio-item').forEach((elItem, i) => {
    // Lista renderizada de tras pra frente (maior premio no topo)
    const pregIdx = PREMIOS.length - 1 - i;
    elItem.classList.remove('atual', 'conquistado', 'pendente');

    if (pregIdx === idxPendente) {
      // Vermelho: travado por erro pendente
      elItem.classList.add('pendente');
    } else if (pregIdx < conquistados) {
      // Verde: ja conquistado
      elItem.classList.add('conquistado');
    } else if (pregIdx === nivelAtual && !estado.temErro) {
      // Amarelo: proximo nivel a ganhar (congelado se ha erro pendente)
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
  const el_num = $('timer-numero');
  if (el_num) el_num.textContent = restante;

  const offset = CIRCUNFERENCIA * (1 - restante / CONFIG.TEMPO_POR_QUESTAO);
  const arco   = $('timer-arco');
  if (arco) arco.style.strokeDashoffset = offset;

  const pct = (restante / CONFIG.TEMPO_POR_QUESTAO) * 100;
  document.documentElement.style.setProperty('--timer-pct', pct + '%');
  aplicarCorBarra(pct);

  const timerContainer = document.querySelector('.timer-container');
  if (timerContainer) {
    timerContainer.classList.toggle('timer-urgente', restante <= 5);
  }
}

/* ══════════════════════════════════════════════════════════
   FLUXO
   ══════════════════════════════════════════════════════════ */

function iniciarJogo() {
  estado.perguntas      = montarDeck(estado.banco, estado.historicoSM);
  estado.indice         = 0;
  estado.acertos        = 0;
  estado.tempoInicio    = Date.now();
  estado.respostas      = new Array(estado.perguntas.length); // undefined
  estado.tempos         = new Array(estado.perguntas.length).fill(CONFIG.TEMPO_POR_QUESTAO);
  estado.pausado        = false;
  estado.temErro        = false;
  estado.indicePendente = null;
  estado.premioPendente = null;

  atualizarContadores();
  construirListaPremios();
  mostrarTela('question');
  renderizarQuestao();
}

function criarTimer(totalInicial) {
  return Timer.criar({
    total: totalInicial ?? CONFIG.TEMPO_POR_QUESTAO,
    onTick: (restante) => {
      estado.tempos[estado.indice] = restante;
      atualizarTimerUI(restante);
    },
    onEnd: () => {
      if (estado.respostas[estado.indice] === undefined) {
        estado.tempos[estado.indice] = 0;
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

  // Texto e nível
  if (el.numPergunta) el.numPergunta.textContent = `${num}/${estado.perguntas.length}`;
  if (el.perguntaNivel) el.perguntaNivel.textContent = `Nível ${num} — ${pergunta.nivel ?? ''}`;
  if (el.perguntaTexto) el.perguntaTexto.textContent = pergunta.texto;
  if (el.progressFill) el.progressFill.style.width = (num / estado.perguntas.length * 100) + '%';
  if (el.pontuacaoHud) {
    el.pontuacaoHud.textContent = estado.acertos > 0
      ? PREMIOS[estado.acertos - 1]?.valor || 'R$ 0'
      : 'R$ 0';
  }

  // Reset alternativas
  ['a','b','c','d'].forEach(l => {
    const btn  = $(`alt-${l}`);
    const txt  = $(`texto-${l}`);
    if (btn) {
      btn.className = 'alt-btn';
      btn.disabled  = jaRespondeu;
      btn.style.opacity = '1';
    }
    if (txt) txt.textContent = pergunta.alternativas[l.toUpperCase()] ?? '';
  });

  // Estados pós-resposta
  if (jaRespondeu) {
    if (resp !== null) {
      const letraEscolhida = resp.toLowerCase();
      $(`alt-${letraEscolhida}`)?.classList.add(correto ? 'correta' : 'errada');
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

  // Timer
  if (estado.timer) {
    try { estado.timer.stop(); } catch (_) {}
    estado.timer = null;
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
        if (t <= 0) {
          clearInterval(estado._fallback);
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
  clearInterval(estado._fallback);
  registrarResposta(letra);
}

function registrarResposta(resp) {
  const pergunta = estado.perguntas[estado.indice];
  const correto  = resp === pergunta.correta;

  estado.respostas[estado.indice] = resp;

  if (resp === null) {
    // Tempo esgotado: neutro, nao altera pontuacao nem pendente

  } else if (correto) {
    // Acerto: SEMPRE sobe exatamente 1 nivel a partir do valor atual.
    // Nunca deriva de estado.indice para nao pular niveis.
    if (estado.temErro) {
      // Tinha erro pendente: resolve o vermelho, depois sobe 1
      estado.temErro        = false;
      estado.indicePendente = null;
      estado.premioPendente = null;
    }
    // Sobe 1 -- identico nos dois casos (com ou sem erro pendente)
    estado.acertos++;

  } else {
    // Erro: trava o nivel atual como vermelho, NAO sobe
    // Primeiro erro define o pendente; erros seguintes nao sobrescrevem
    if (!estado.temErro) {
      estado.indicePendente = estado.indice;
      estado.premioPendente = estado.indice;
    }
    estado.temErro = true;
    // estado.acertos permanece intocado
  }

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

  const p       = estado.perguntas[estado.indice];
  const isUltima = estado.indice >= estado.perguntas.length - 1;
  const todasResp = estado.respostas.every(r => r !== undefined);

  if (tempoAcabou) {
    if (icone) icone.textContent = '⏰';
    if (msg)   { msg.textContent = 'Tempo Esgotado!'; msg.style.color = '#ff9800'; }
    if (resp)  resp.textContent  = `A resposta correta era: ${p.correta} — ${p.alternativas[p.correta]}`;

  } else if (correto) {
    // Detecta se este acerto resolveu um erro pendente:
    // após registrarResposta, temErro já foi zerado se havia pendente
    // Usamos o fato de que acertos === indice significa que o acerto liberou um nivel anterior
    const resolveupendente = estado.acertos <= estado.indice; // acertos nao chegou ao indice+1

    if (icone) icone.textContent = isUltima ? '🏆' : '✅';
    if (msg) {
      if (resolveupendente) {
        msg.textContent = '✅ Prêmio pendente conquistado!';
      } else {
        msg.textContent = isUltima ? '🏆 Você é o Milionário!' : 'Correto! Excelente!';
      }
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
  clearInterval(estado._fallback);
  estado.indice = i;
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
  try { estado.timer?.stop(); } catch (_) {}
  clearInterval(estado._fallback);

  // Filtra respostas válidas (exclui null = tempo esgotado)
  const resultados = estado.perguntas
    .map((p, i) => ({
      id:     p.id ?? `q${i}`,
      resp:   estado.respostas[i],
      acertou: estado.respostas[i] === p.correta,
    }))
    .filter(r => r.resp !== null && r.resp !== undefined);

  try {
    await salvarResultadoSM(estado.usuario, estado.discId, estado.sem, resultados);
  } catch (err) {
    console.warn('[show_milhao] Erro ao salvar:', err);
  }

  // Atualiza cache em memória sem depender do Firestore
  for (const { id, acertou, resp } of resultados) {
    if (resp === null || resp === undefined) continue;
    const entrada = estado.historicoSM[id] ?? {
      tentativas: 0, acertos: 0, erros: 0, ultimaVez: 0, acertosConsecutivos: 0,
    };
    entrada.tentativas++;
    if (acertou) { entrada.acertos++; entrada.acertosConsecutivos = (entrada.acertosConsecutivos ?? 0) + 1; }
    else         { entrada.erros++;   entrada.acertosConsecutivos = 0; }
    entrada.ultimaVez = Date.now();
    estado.historicoSM[id] = entrada;
  }

  // Monta tela de resultado
  const valorFinal    = estado.acertos > 0 ? PREMIOS[estado.acertos - 1].valor : 'R$ 0';
  const respondidas   = estado.respostas.filter(r => r !== null && r !== undefined).length;
  const pct           = respondidas > 0 ? Math.round((estado.acertos / respondidas) * 100) : 0;
  const todosCorretos = estado.acertos === estado.perguntas.length;

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

  // Botão Sair → tela intro
  if (elSair) {
    elSair.removeAttribute('href');
    const novoSair = elSair.cloneNode(true);
    elSair.parentNode.replaceChild(novoSair, elSair);
    novoSair.addEventListener('click', async (e) => {
      e.preventDefault();
      estado.perguntas = montarDeck(estado.banco, estado.historicoSM);
      atualizarContadores();
      mostrarTela('intro');
    });
  }

  // Botão Jogar novamente
  if (elRejogo) {
    const novoRejogo = elRejogo.cloneNode(true);
    elRejogo.parentNode.replaceChild(novoRejogo, elRejogo);
    novoRejogo.addEventListener('click', async () => {
      const historico = await carregarHistoricoSM(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
      estado.historicoSM = historico;
      estado.perguntas   = montarDeck(estado.banco, historico);
      if (estado.perguntas.length === 0) { mostrarTela('empty'); return; }
      atualizarContadores();
      iniciarJogo();
    });
  }

  renderEstatisticasQuestoes(estado.historicoSM, estado.perguntas);
  mostrarTela('result');
}

/* ══════════════════════════════════════════════════════════
   ESTATÍSTICAS POR QUESTÃO (tela de resultado)
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
    const h          = historico[q.id ?? ''];
    const idx        = estado.perguntas.indexOf(q);
    const respAtual  = estado.respostas[idx];
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

    const enun = (q.texto ?? '').length > 52 ? q.texto.slice(0, 52) + '…' : (q.texto ?? '');

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
    } else {
      try { estado.timer?.resume(); } catch (_) {}
      pauseOverlay.classList.add('hidden');
      btnPauseEl?.classList.remove('sm-ctrl-btn--paused');
      if (pauseLabelEl) pauseLabelEl.textContent = 'Pausar';
    }
  }

  btnPause?.addEventListener('click', togglePausa);
  pauseOverlay.addEventListener('click', e => {
    if (e.target.closest('#btn-retomar')) togglePausa();
  });

  btnVoltarIntro?.addEventListener('click', async () => {
    try { estado.timer?.stop(); } catch (_) {}
    clearInterval(estado._fallback);
    estado.timer   = null;
    estado.pausado = false;
    pauseOverlay.classList.add('hidden');
    $('btn-pause')?.classList.remove('sm-ctrl-btn--paused');
    const pl = $('pause-label');
    if (pl) pl.textContent = 'Pausar';

    document.documentElement.style.setProperty('--timer-pct', '100%');
    aplicarCorBarra(100);

    const historico = await carregarHistoricoSM(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
    estado.historicoSM = historico;
    estado.perguntas   = montarDeck(estado.banco, historico);
    atualizarContadores();
    mostrarTela('intro');
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
   ATALHOS
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
      case 'ArrowLeft':
        e.preventDefault();
        irAnterior();
        break;
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

  const { disc, sem } = Shell.init({ icon: '⭐', nome: 'Show do Milhão' });

  const _listaDisciplinas = getDisciplinasDeSemestre(sem);
  const disciplina = _listaDisciplinas.find(d => d.id === disc || d.arquivo === disc) ?? null;

  // Preenche header
  const shellDiscEl = $('shell-disc-name');
  if (shellDiscEl && disciplina) shellDiscEl.textContent = disciplina.apelido ?? disciplina.nome ?? disc;
  const shellIconEl = $('shell-icon');
  if (shellIconEl && disciplina?.emoji) shellIconEl.textContent = disciplina.emoji;

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
      emojiSpan.style.cssText = 'font-size:13px; line-height:1; display:inline-flex; align-items:center;';
      chipSvg.replaceWith(emojiSpan);
    }
  }

  // Aplicar cores da disciplina
  try { aplicarCoresDisciplina(disc, DISC_CORES); } catch (_) {}

  /* ── Import dinâmico por ano ────────────────────────────── */
  const ano    = sem ? sem.split('.')[0] : null;
  let banco    = [];
  let semDisp  = null;

  if (ano) {
    try {
      const modulo = await import(`../../../content/game/show_milhao/${ano}/show_milhao_data.js`);
      semDisp = modulo.SHOW_MILHAO_DATA?.[sem] ?? null;
      banco   = semDisp?.[disc] ?? [];
    } catch (err) {
      console.warn(`[show_milhao] Arquivo de dados não encontrado para o ano ${ano}:`, err.message);
    }
  }

  estado.banco = banco;

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

  const usuarioObj   = getUsuario();
  estado.usuario     = usuarioObj?.uid ?? 'visitante';
  estado.discId      = disc;
  estado.sem         = sem;

  const historico    = await carregarHistoricoSM(estado.usuario, disc, sem).catch(() => ({}));
  estado.historicoSM = historico;
  estado.perguntas   = montarDeck(banco, historico);

  if (estado.perguntas.length === 0) {
    mostrarTela('empty');
    return;
  }

  atualizarContadores();
  aplicarCorBarra(100);

  el.btnStart   ?.addEventListener('click', () => iniciarJogo());
  el.btnAnterior?.addEventListener('click', irAnterior);
  el.btnProxima ?.addEventListener('click', irProxima);

  // Delegação de clique nas alternativas
  $('alternativas')?.addEventListener('click', e => {
    const btn = e.target.closest('.alt-btn');
    if (btn && !btn.disabled) responder(btn.dataset.letra);
  });

  setupPausa();
  registrarAtalhos();
  mostrarTela('intro');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}