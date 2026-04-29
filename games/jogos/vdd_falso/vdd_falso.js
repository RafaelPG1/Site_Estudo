/* ============================================================
   NEXUS STUDY — games/jogos/vdd_falso/vdd_falso.js  (v6.3)

   Novidades v6.3:
   - [FEATURE] Badge de histórico por questão (vf-hist-badge):
     exibido no canto superior direito do card, mostra o número
     de tentativas anteriores e a taxa de acerto da questão.
     Inclui modificadores visuais: crítico (< 50% ou mais erros
     que acertos), ok (50–79%), dominado (≥ 80% com 3+ tent.).
     Animação de entrada dispara a cada troca de questão.
   - [FEATURE] estado.historicoVF: cache do histórico carregado
     em memória para evitar leitura assíncrona a cada render.
     Atualizado em init(), btnVoltarIntro e onRejogo.
   ============================================================ */

import { Shell, Timer, Result, shuffle, lerParams } from '../../template/game-shell.js';
import { VDD_FALSO_DATA }                           from '../../../content/game/vdd_falso/2026/vdd_falso_data.js';
import { DISC_CORES }                               from '../../../shared/js/cores.js';
import { aplicarCoresDisciplina }                   from '../../../shared/js/theme.js';
import { carregarHistoricoVF, salvarResultadoVF }  from './storage_vf.js';
import { getUsuario }                              from '../../../src/global.js';

/* ══════════════════════════════════════════════════════════
   CONFIGURAÇÃO
   ══════════════════════════════════════════════════════════ */

const CONFIG = {
  TEMPO_POR_QUESTAO: 30,
  PONTOS_ACERTO:     10,
  PONTOS_ERRO:        5,
  MAX_QUESTOES:       8,
  PESO_NUNCA_VISTA:   3,
  PESO_MIN:           1,
  PESO_MAX:          10,
};

/* ══════════════════════════════════════════════════════════
   ESTADO
   ══════════════════════════════════════════════════════════ */

const estado = {
  perguntas:  [],
  indice:     0,
  pontos:     0,
  acertos:    0,
  erros:      0,
  // respostas[i] = true | false | null (null = tempo esgotado — neutro)
  // undefined = questão ainda não respondida
  respostas:  [],
  // tempos[i] = segundos restantes da questão i (persistido ao navegar)
  // Inicializado com CONFIG.TEMPO_POR_QUESTAO e decrementado pelo timer
  tempos:     [],
  timer:      null,
  pausado:    false,
  usuario:    null,
  discId:     null,
  sem:        null,
  // Cache do histórico de desempenho por questão
  // (carregado em init() e mantido sincronizado após salvarResultadoVF)
  historicoVF: {},
};

/* ══════════════════════════════════════════════════════════
   DOM
   ══════════════════════════════════════════════════════════ */

const $ = id => document.getElementById(id);
const el = {};

/* Texto padrão da info-strip */
const INFO_STRIP_DEFAULT = 'Após sua escolha, a resposta aparecerá automaticamente.';

/* Helper: atualiza a info-strip com explicação ou texto padrão */
function setInfoStrip(texto) {
  const strip     = $('vf-info-strip');
  const stripText = $('vf-info-strip-text');
  const stripIcon = strip ? strip.querySelector('svg') : null;

  if (!stripText) return;

  if (texto) {
    stripText.innerHTML = '<span class="vf-resposta-label">Resposta:</span> ' + texto;
    if (stripIcon) stripIcon.style.display = 'none';
    strip?.classList.add('vf-info-strip--explicacao');
  } else {
    stripText.textContent = INFO_STRIP_DEFAULT;
    if (stripIcon) stripIcon.style.display = '';
    strip?.classList.remove('vf-info-strip--explicacao');
  }
}

/* ══════════════════════════════════════════════════════════
   SELEÇÃO PONDERADA
   ══════════════════════════════════════════════════════════ */

function calcularPeso(id, historico) {
  const h = historico[id];
  if (!h || h.tentativas === 0) return CONFIG.PESO_NUNCA_VISTA;
  const taxaErro = h.erros / h.tentativas;
  return Math.round(CONFIG.PESO_MIN + taxaErro * (CONFIG.PESO_MAX - CONFIG.PESO_MIN));
}

// [BUG CRÍTICO CORRIGIDO] Adicionado fallback: se rand expirar sem
// dar break (arredondamento de ponto flutuante), seleciona o último
// elemento do pool em vez de deixar o while rodar infinitamente.
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
    // Fallback: rand chegou a exatamente zero após subtrair todos os
    // pesos (arredondamento FP) — seleciona o último elemento restante.
    if (!hit && pool.length > 0) {
      sel.push(pool[pool.length - 1].item);
      pool.splice(pool.length - 1, 1);
    }
  }
  return sel;
}

function montarDeck(banco, historico) {
  const n = Math.min(CONFIG.MAX_QUESTOES, banco.length);
  const porAula = {};
  for (const q of banco) {
    const a = q.aula ?? 0;
    if (!porAula[a]) porAula[a] = [];
    porAula[a].push(q);
  }
  const sel = new Set();
  for (const aula of Object.keys(porAula)) {
    if (sel.size >= n) break;
    const cands = porAula[aula].filter(q => !sel.has(q.id)).map(q => ({ item: q, peso: calcularPeso(q.id, historico) }));
    const esc = sorteiarPonderado(cands, 1);
    if (esc[0]) sel.add(esc[0].id);
  }
  const rest = banco.filter(q => !sel.has(q.id)).map(q => ({ item: q, peso: calcularPeso(q.id, historico) }));
  sorteiarPonderado(rest, n - sel.size).forEach(q => sel.add(q.id));
  return shuffle(banco.filter(q => sel.has(q.id)));
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

/* ══════════════════════════════════════════════════════════
   BOLINHAS DE PROGRESSO (clicáveis)
   ══════════════════════════════════════════════════════════ */

function renderDots() {
  const container = $('vf-dots');
  if (!container) return;
  container.innerHTML = '';
  estado.perguntas.forEach((p, i) => {
    const resp       = estado.respostas[i];
    const respondida = resp !== undefined;
    const correto    = respondida && resp === p.resposta;
    const atual      = i === estado.indice;

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Questão ${i + 1}`);
    dot.className = 'vf-dot ' + (
      atual      ? 'vf-dot--current'  :
      !respondida ? 'vf-dot--pending'  :
      correto     ? 'vf-dot--correct'  : 'vf-dot--wrong'
    );
    dot.addEventListener('click', () => navegarPara(i));
    container.appendChild(dot);
  });
}

/* ══════════════════════════════════════════════════════════
   TELAS
   ══════════════════════════════════════════════════════════ */

function mostrarTela(nome) {
  el.screenIntro   ?.classList.add('hidden');
  el.screenQuestion?.classList.add('hidden');
  el.screenEmpty   ?.classList.add('hidden');
  el.screenResult  ?.classList.add('hidden');
  if (nome === 'intro')    el.screenIntro   ?.classList.remove('hidden');
  if (nome === 'question') el.screenQuestion?.classList.remove('hidden');
  if (nome === 'empty')    el.screenEmpty   ?.classList.remove('hidden');
  if (nome === 'result')   el.screenResult  ?.classList.remove('hidden');
}

/* ══════════════════════════════════════════════════════════
   FLUXO
   ══════════════════════════════════════════════════════════ */

function iniciarJogo() {
  estado.indice    = 0;
  estado.pontos    = 0;
  estado.acertos   = 0;
  estado.erros     = 0;
  estado.tempoInicio = Date.now();
  estado.respostas = new Array(estado.perguntas.length); // tudo undefined
  // Cada questão começa com o tempo total disponível
  estado.tempos    = new Array(estado.perguntas.length).fill(CONFIG.TEMPO_POR_QUESTAO);
  estado.pausado   = false;
  if (el.scoreCorrect) el.scoreCorrect.textContent = 0;
  atualizarContadores();
  mostrarTela('question');
  renderizarQuestao();
}

function criarTimer(totalInicial) {
  return Timer.criar({
    // O Timer conta regressivamente a partir do tempo restante real da questão.
    total: totalInicial ?? CONFIG.TEMPO_POR_QUESTAO,
    onTick: (restante) => {
      // Persiste o tempo restante a cada tick para que, ao navegar,
      // o valor salvo seja sempre o mais recente possível.
      estado.tempos[estado.indice] = restante;

      // A barra SEMPRE deve refletir restante / tempo_total_fixo (30s).
      // Setamos --timer-pct explicitamente para garantir que nenhum
      // cálculo interno do Timer sobrescreva com valor errado.
      const pctReal = (restante / CONFIG.TEMPO_POR_QUESTAO) * 100;
      document.documentElement.style.setProperty('--timer-pct', pctReal + '%');
      aplicarCorBarra(pctReal);
    },
    onEnd:  () => {
      if (estado.respostas[estado.indice] === undefined) {
        estado.tempos[estado.indice] = 0;
        registrarResposta(null);
      }
    },
  });
}

/* ══════════════════════════════════════════════════════════
   BADGE DE HISTÓRICO POR QUESTÃO
   Chamada dentro de renderizarQuestao() a cada troca de card.
   ══════════════════════════════════════════════════════════ */

function renderizarBadgeHistorico(questaoId) {
  const badge    = $('vf-hist-badge');
  const elTent   = $('vf-hist-tentativas');
  const elTaxa   = $('vf-hist-taxa');
  const elStatus = $('vf-hist-status');

  if (!badge) return;

  const h = estado.historicoVF[questaoId];

  // Sem histórico ainda → oculta o badge completamente
  if (!h || h.tentativas === 0) {
    badge.hidden = true;
    badge.className = 'vf-hist-badge';
    return;
  }

  const { tentativas, acertos, erros } = h;
  const taxa = Math.round((acertos / tentativas) * 100);

  // ── Determinar status ──
  // Crítico: visto 3+ vezes E taxa < 50%, OU mais erros que acertos
  // Ok:      taxa entre 50–79%
  // Dominado: taxa ≥ 80% com pelo menos 3 tentativas
  let statusMod  = '';
  let statusText = '';

  const maisErrosQueAcertos = erros > acertos;

  if (maisErrosQueAcertos || (tentativas >= 3 && taxa < 50)) {
    statusMod  = 'vf-hist-badge--critico';
    statusText = 'crítico';
  } else if (tentativas >= 3 && taxa >= 80) {
    statusMod  = 'vf-hist-badge--dominado';
    statusText = 'dominado';
  } else if (taxa >= 50) {
    statusMod  = 'vf-hist-badge--ok';
    statusText = 'ok';
  }
  // Se não se encaixa em nenhum (ex: 1 tentativa, 100%) → badge neutro sem status

  // ── Atualizar DOM ──
  if (elTent)   elTent.textContent   = tentativas;
  if (elTaxa)   elTaxa.textContent   = `${taxa}%`;
  if (elStatus) elStatus.textContent = statusText;

  // Reinicia a animação (remove e reinsere a classe de animação)
  badge.className = `vf-hist-badge${statusMod ? ' ' + statusMod : ''}`;
  void badge.offsetWidth; // força reflow para restartar a animação CSS
  badge.hidden = false;
}

/* ══════════════════════════════════════════════════════════
   RENDERIZAR QUESTÃO ATUAL
   ══════════════════════════════════════════════════════════ */

function renderizarQuestao() {
  const pergunta    = estado.perguntas[estado.indice];
  const resp        = estado.respostas[estado.indice];
  const jaRespondeu = resp !== undefined;
  const correto     = jaRespondeu && resp === pergunta.resposta;
  const num         = estado.indice + 1;

  // ← Atualiza/oculta o badge de histórico desta questão
  renderizarBadgeHistorico(pergunta.id);

  // Texto
  if (el.qCurrent)     el.qCurrent.textContent    = num;
  if (el.qBadge)       el.qBadge.textContent       = `Q${num}`;
  if (el.questionText) el.questionText.textContent = pergunta.enunciado;

  // Barra linear
  if (el.progressFill) el.progressFill.style.width = (num / estado.perguntas.length * 100) + '%';

  // Card
  if (el.questionCard) {
    el.questionCard.className = 'vf-question-card game-card-base';
    void el.questionCard.offsetWidth;
    el.questionCard.classList.add('vf-question-card--enter');
    if (jaRespondeu) el.questionCard.classList.add(correto ? 'vf-question-card--correct' : 'vf-question-card--wrong');
  }

  // Botões V/F
  if (el.btnTrue)  { el.btnTrue.className  = 'vf-btn vf-btn--true';  el.btnTrue.disabled  = jaRespondeu; }
  if (el.btnFalse) { el.btnFalse.className = 'vf-btn vf-btn--false'; el.btnFalse.disabled = jaRespondeu; }

  if (jaRespondeu) {
    // Mostra qual foi marcada (se não foi tempo esgotado)
    if (resp !== null) {
      const btnSel = resp ? el.btnTrue : el.btnFalse;
      btnSel?.classList.add(correto ? 'vf-btn--selected-correct' : 'vf-btn--selected-wrong');
    }
    // Se errou ou tempo esgotado, mostra qual seria a correta
    if (!correto) {
      const btnCerto = pergunta.resposta ? el.btnTrue : el.btnFalse;
      btnCerto?.classList.add('vf-btn--reveal-correct');
    }

    // Feedback
    if (el.feedbackMsg) {
      if (resp === null) {
        el.feedbackMsg.className   = 'game-feedback game-feedback--wrong';
        el.feedbackMsg.textContent = '⏱ Tempo esgotado! Sem pontos.';
      } else {
        el.feedbackMsg.className   = `game-feedback ${correto ? 'game-feedback--correct' : 'game-feedback--wrong'}`;
        el.feedbackMsg.textContent = correto
          ? `✓ Correto! +${CONFIG.PONTOS_ACERTO} pontos`
          : `✗ Incorreto! -${CONFIG.PONTOS_ERRO} pontos`;
      }
    }
    el.feedbackArea?.classList.remove('hidden');

    // ── EXPLICAÇÃO → info-strip ──
    setInfoStrip(pergunta.explicacao ?? '');

    // Shake se errou ou tempo esgotado
    if (!correto && el.questionCard) {
      void el.questionCard.offsetWidth;
      el.questionCard.classList.add('vf-question-card--shake');
    }
  } else {
    el.feedbackArea?.classList.add('hidden');
    // Reset da info-strip para texto padrão
    setInfoStrip(null);
  }

  // Navegação
  atualizarBotoesNav();
  renderDots();

  // Timer
  // Salva o tempo restante da questão anterior ANTES de parar o timer.
  // Isso garante que, ao voltar para essa questão, o timer continue
  // de onde parou em vez de reiniciar do zero.
  if (estado.timer) {
    // A última leitura já foi feita pelo onTick; paramos sem descartar.
    estado.timer.stop();
    estado.timer = null;
  }

  if (!jaRespondeu) {
    // Recupera o tempo salvo para esta questão (pode ser < 30s se o
    // usuário já havia visitado a questão antes e voltado).
    const tempoRestante = estado.tempos[estado.indice] ?? CONFIG.TEMPO_POR_QUESTAO;
    const pctInicial    = (tempoRestante / CONFIG.TEMPO_POR_QUESTAO) * 100;

    estado.timer = criarTimer(tempoRestante);
    estado.timer.start();
    aplicarCorBarra(pctInicial);
    // Atualiza a variável CSS para que a barra reflita o tempo correto
    // imediatamente, antes do primeiro onTick.
    document.documentElement.style.setProperty('--timer-pct', pctInicial + '%');
  }
}

function atualizarBotoesNav() {
  const total         = estado.perguntas.length;
  const ultimo        = estado.indice === total - 1;
  const jaRespondeu   = estado.respostas[estado.indice] !== undefined;
  const todasResp     = estado.respostas.every(r => r !== undefined);

  if (el.btnAnterior) {
    el.btnAnterior.disabled = estado.indice === 0;
  }

  if (el.btnProxima) {
    const isFinish = ultimo && todasResp;
    el.btnProxima.disabled = !jaRespondeu;
    el.btnProxima.classList.toggle('vf-nav-btn--finish', isFinish);
    // [CORREÇÃO] Atualiza apenas o conteúdo textual/SVG sem destruir
    // listeners externos — comportamento idêntico ao original, mas
    // documentado como padrão frágil.
    el.btnProxima.innerHTML = isFinish
      ? 'Finalizar <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M2 8l4 4 8-8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : 'Próxima <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M6 3l6 5-6 5V3z"/></svg>';
  }
}

/* ══════════════════════════════════════════════════════════
   RESPONDER
   ══════════════════════════════════════════════════════════ */

function responder(valor) {
  if (estado.pausado) return;
  if (estado.respostas[estado.indice] !== undefined) return;
  estado.timer?.stop();
  registrarResposta(valor);
}

function registrarResposta(resp) {
  const pergunta = estado.perguntas[estado.indice];
  const correto  = resp === pergunta.resposta;

  estado.respostas[estado.indice] = resp;

  // resp === null (tempo esgotado) é neutro —
  // não conta como acerto nem como erro, não altera pontuação.
  if (resp !== null) {
    if (correto) {
      estado.pontos  += CONFIG.PONTOS_ACERTO;
      estado.acertos += 1;
    } else {
      estado.pontos   = Math.max(0, estado.pontos - CONFIG.PONTOS_ERRO);
      estado.erros   += 1;
    }
  }

  if (el.scoreCorrect) el.scoreCorrect.textContent = estado.acertos;

  renderizarQuestao();
}

/* ══════════════════════════════════════════════════════════
   NAVEGAÇÃO
   ══════════════════════════════════════════════════════════ */

function navegarPara(i) {
  if (i < 0 || i >= estado.perguntas.length) return;
  estado.indice = i;
  renderizarQuestao();
}

function irAnterior() {
  if (estado.indice > 0) {
    // [POTENCIAL CORRIGIDO] Para o timer explicitamente antes de
    // navegar para evitar race condition de 1 frame onde onEnd
    // da questão abandonada ainda poderia disparar.
    estado.timer?.stop();
    navegarPara(estado.indice - 1);
  }
}

// [BUG 2 CORRIGIDO] Quando está na última questão mas nem todas foram
// respondidas, avança para a primeira questão ainda pendente em vez
// de travar silenciosamente.
function irProxima() {
  const ultimo    = estado.indice === estado.perguntas.length - 1;
  const todasResp = estado.respostas.every(r => r !== undefined);

  if (ultimo && todasResp) {
    finalizarJogo();
    return;
  }

  if (estado.indice < estado.perguntas.length - 1) {
    navegarPara(estado.indice + 1);
    return;
  }

  // Está na última questão mas existem pendentes anteriores:
  // vai para a primeira questão sem resposta.
  const primeiraPendente = estado.respostas.findIndex(r => r === undefined);
  if (primeiraPendente !== -1) {
    navegarPara(primeiraPendente);
  }
}

/* ══════════════════════════════════════════════════════════
   FINALIZAR
   ══════════════════════════════════════════════════════════ */

async function finalizarJogo() {
  estado.timer?.stop();

  // Questões com tempo esgotado (resp === null) são excluídas do histórico
  const resultados = estado.perguntas
    .map((p, i) => ({
      id:     p.id,
      resp:   estado.respostas[i],
      acertou: estado.respostas[i] === p.resposta,
    }))
    .filter(r => r.resp !== null && r.resp !== undefined);

  try {
    await salvarResultadoVF(estado.usuario, estado.discId, estado.sem, resultados);
  } catch (err) {
    console.warn('[vdd_falso] Erro ao salvar:', err);
  }

  const respondidas = estado.respostas.filter(r => r !== null && r !== undefined).length;
  const pct         = respondidas > 0
    ? Math.round((estado.acertos / respondidas) * 100)
    : 0;

  let emoji, titulo;
  if      (pct >= 80) { emoji = '🏆'; titulo = 'Excelente!';    }
  else if (pct >= 50) { emoji = '👍'; titulo = 'Bom trabalho!'; }
  else                { emoji = '📚'; titulo = 'Pode melhorar!'; }

  const elSimb      = document.getElementById('resultado-simbolo');
  const elTitulo    = document.getElementById('resultado-titulo');
  const elPontos    = document.getElementById('resultado-pontos');
  const elAcertos   = document.getElementById('resultado-acertos');
  const elErros     = document.getElementById('resultado-erros');
  const elPrecisao  = document.getElementById('resultado-precisao');
  const elTempo     = document.getElementById('resultado-tempo');
  const elSair      = document.getElementById('resultado-btn-sair');
  const elRejogo    = document.getElementById('resultado-btn-rejogo');

  if (elSimb)    elSimb.textContent    = emoji;
  if (elTitulo)  elTitulo.textContent  = titulo;
  if (elPontos)  elPontos.textContent  = estado.pontos;
  if (elAcertos) elAcertos.textContent = estado.acertos;
  if (elErros)   elErros.textContent   = estado.erros;
  if (elPrecisao) elPrecisao.textContent = pct + '%';

  // Calcula e exibe o tempo total da sessão
  if (elTempo) {
    const totalSeg = Math.round((Date.now() - (estado.tempoInicio ?? Date.now())) / 1000);
    const mm = Math.floor(totalSeg / 60);
    const ss = String(totalSeg % 60).padStart(2, '0');
    elTempo.textContent = `${mm}:${ss}`;
  }

  // Link de saída (para a tela de jogos) com semestre preservado
  const sem = estado.sem;
  if (elSair) elSair.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;

  // Botão jogar novamente
  if (elRejogo) {
    // Remove listeners anteriores clonando o elemento
    const novoRejogo = elRejogo.cloneNode(true);
    elRejogo.parentNode.replaceChild(novoRejogo, elRejogo);
    novoRejogo.addEventListener('click', async () => {
      const banco     = VDD_FALSO_DATA[estado.discId] ?? [];
      const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
      estado.historicoVF = historico;
      estado.perguntas   = montarDeck(banco, historico);
      if (estado.perguntas.length === 0) {
        mostrarTela('empty');
        return;
      }
      atualizarContadores();
      iniciarJogo();
    });
  }

  // Exibe a tela de resultado e esconde as demais
  mostrarTela('result');

  // Atualiza cache do histórico pós-save (sem precisar re-renderizar stats)
  const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
  estado.historicoVF = historico;
}

/* ══════════════════════════════════════════════════════════
   ESTATÍSTICAS POR QUESTÃO
   ══════════════════════════════════════════════════════════ */

function renderEstatisticasQuestoes(historico, perguntas) {
  const resultCard = document.querySelector('.game-result__card');
  if (!resultCard) return;
  resultCard.querySelector('.vf-stats-questoes')?.remove();
  const temDados = perguntas.some(q => historico[q.id]);
  if (!temDados) return;

  const painel = document.createElement('details');
  painel.className = 'vf-stats-questoes';
  painel.innerHTML = `<summary><span class="vf-sq-summary-icon">📊</span>Desempenho por questão<span class="vf-sq-chevron">▾</span></summary>`;

  const lista = document.createElement('div');
  lista.className = 'vf-sq-lista';
  for (const q of perguntas) {
    const h = historico[q.id];
    if (!h) continue;
    const taxa  = h.tentativas > 0 ? Math.round((h.acertos / h.tentativas) * 100) : 0;
    const cor   = taxa >= 70 ? '#34d399' : taxa >= 40 ? '#facc15' : '#f87171';
    const icone = taxa >= 70 ? '✓' : taxa >= 40 ? '~' : '✗';
    const enun  = q.enunciado.length > 58 ? q.enunciado.slice(0, 58) + '…' : q.enunciado;
    const row = document.createElement('div');
    row.className = 'vf-sq-row';
    const si = document.createElement('span'); si.className = 'vf-sq-icone'; si.style.color = cor; si.textContent = icone;
    const se = document.createElement('span'); se.className = 'vf-sq-enun'; se.textContent = enun;
    const ss = document.createElement('span'); ss.className = 'vf-sq-stat'; ss.style.color = cor; ss.textContent = `${h.acertos}/${h.tentativas}`;
    row.append(si, se, ss);
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
  pauseOverlay.className = 'vf-pause-overlay hidden';
  pauseOverlay.innerHTML = `
  <div class="vf-pause-card">
    <div class="vf-pause-header">
      <div class="vf-pause-icon-ring">
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
          <rect x="5" y="3" width="4" height="18" rx="2"/>
          <rect x="15" y="3" width="4" height="18" rx="2"/>
        </svg>
      </div>
      <div>
        <p class="vf-pause-title">Jogo pausado</p>
        <p class="vf-pause-hint">O tempo está congelado</p>
      </div>
    </div>
    <div class="vf-pause-divider"></div>
    <div class="vf-pause-tip">
      <span class="vf-pause-tip__icon">💡</span>
      <span>Use o tempo para revisar sua estratégia antes de continuar.</span>
    </div>
    <button class="game-btn vf-pause-resume-btn" id="btn-retomar">
      <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><path d="M5 3l8 5-8 5V3z"/></svg>
      Retomar jogo
    </button>
    <p class="vf-pause-shortcut">ou pressione <kbd>Espaço</kbd></p>
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
      estado.timer?.pause();
      pauseOverlay.classList.remove('hidden');
      btnPauseEl?.classList.add('vf-ctrl-btn--paused');
      if (pauseIconEl) { pauseIconEl.innerHTML = `<path d="M14 8l40 24L14 56V8z"/>`; pauseIconEl.setAttribute('viewBox', '0 0 64 64'); }
      if (pauseLabelEl) pauseLabelEl.textContent = 'Retomar';
    } else {
      estado.timer?.resume();
      pauseOverlay.classList.add('hidden');
      btnPauseEl?.classList.remove('vf-ctrl-btn--paused');
      if (pauseIconEl) { pauseIconEl.innerHTML = `<rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/>`; pauseIconEl.setAttribute('viewBox', '0 0 16 16'); }
      if (pauseLabelEl) pauseLabelEl.textContent = 'Pausar';
    }
  }

  btnPause?.addEventListener('click', togglePausa);
  pauseOverlay.addEventListener('click', e => { if (e.target.closest('#btn-retomar')) togglePausa(); });

  btnVoltarIntro?.addEventListener('click', async () => {
    estado.timer?.stop();
    estado.timer = null; estado.pausado = false;
    // Reseta todos os tempos para que, ao iniciar novo jogo, cada
    // questão comece com o tempo total (30s).
    estado.tempos = [];
    pauseOverlay.classList.add('hidden');
    const btnPauseEl = $('btn-pause'); const pauseIconEl = $('pause-icon'); const pauseLabelEl = $('pause-label');
    btnPauseEl?.classList.remove('vf-ctrl-btn--paused');
    if (pauseIconEl) { pauseIconEl.innerHTML = `<rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/>`; pauseIconEl.setAttribute('viewBox', '0 0 16 16'); }
    if (pauseLabelEl) pauseLabelEl.textContent = 'Pausar';
    document.documentElement.style.setProperty('--timer-pct', '100%');
    aplicarCorBarra(100);
    // Reseta o texto do display para o tempo total (ex: "00:30"),
    // pois o onTick não será mais chamado depois que o timer parou.
    const timerDisplay = document.getElementById('shell-timer-display');
    if (timerDisplay) {
      const t = CONFIG.TEMPO_POR_QUESTAO;
      const mm = String(Math.floor(t / 60)).padStart(2, '0');
      const ss = String(t % 60).padStart(2, '0');
      timerDisplay.textContent = `${mm}:${ss}`;
      timerDisplay.classList.remove('game-timer-display--danger', 'game-timer-display--mid');
    }
    const banco     = VDD_FALSO_DATA[estado.discId] ?? [];
    const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
    estado.historicoVF = historico;                        // ← atualiza cache
    estado.perguntas = montarDeck(banco, historico);
    // [POTENCIAL CORRIGIDO] Valida deck não vazio antes de voltar para intro
    if (estado.perguntas.length === 0) {
      mostrarTela('empty');
      return;
    }
    atualizarContadores();
    mostrarTela('intro');
  });

  // [POTENCIAL CORRIGIDO] Guard contra Space duplo quando #btn-retomar
  // está focado, evitando toggle imediato pausa → despausa.
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !el.screenQuestion?.classList.contains('hidden') &&
        estado.respostas[estado.indice] === undefined) {
      // Se o foco está no btn-retomar, o Space naturalmente ativaria o
      // clique no botão, que já chama togglePausa — não chamar de novo.
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
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (estado.pausado) return;
    if (!el.screenQuestion || el.screenQuestion.classList.contains('hidden')) return;

    const jaResp = estado.respostas[estado.indice] !== undefined;
    switch (e.key) {
      case 'v': case 'V': case '1': if (!jaResp) { e.preventDefault(); responder(true);  } break;
      case 'f': case 'F': case '2': if (!jaResp) { e.preventDefault(); responder(false); } break;
      case 'ArrowRight': case 'Enter': if (jaResp) { e.preventDefault(); irProxima(); } break;
      case 'ArrowLeft':
        // [POTENCIAL CORRIGIDO] Para o timer explicitamente antes de
        // navegar para evitar race condition de 1 frame.
        e.preventDefault();
        estado.timer?.stop();
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
  if (el.qTotal)     el.qTotal.textContent     = n;
  const introTotal = $('intro-total-questoes');
  if (introTotal)    introTotal.textContent    = n;
}

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */

async function init() {
  Object.assign(el, {
    screenIntro:    $('screen-intro'),
    screenQuestion: $('screen-question'),
    screenEmpty:    $('screen-empty'),
    screenResult:   $('screen-result'),
    btnStart:       $('btn-start'),
    btnTrue:        $('btn-true'),
    btnFalse:       $('btn-false'),
    btnAnterior:    $('btn-anterior'),
    btnProxima:     $('btn-proxima'),
    qCurrent:       $('q-current'),
    qTotal:         $('q-total'),
    qBadge:         $('q-badge'),
    questionText:   $('question-text'),
    questionCard:   $('question-card'),
    progressFill:   $('progress-fill'),
    feedbackArea:   $('feedback-area'),
    feedbackMsg:    $('feedback-msg'),
    feedbackExp:    null,
    scoreCorrect:   $('score-correct'),
    scoreTotal:     $('score-total'),
    timerBar:       document.querySelector('.game-timer-bar'),
  });

  const { disc, sem, disciplina } = Shell.init({ icon: '⚖️', nome: 'Verdadeiro ou Falso' });

  // Preenche o pill de disciplina no footer do card com emoji + nome
  const discLblPill = document.getElementById('vf-disc-label');
  if (discLblPill && disciplina) {
    discLblPill.textContent = `${disciplina.emoji ?? ''} ${disciplina.apelido ?? disciplina.nome ?? disc}`.trim();
  }

  // Remove o SVG genérico do pill (substituído pelo emoji da disciplina)
  const discPill = document.getElementById('vf-disc-tag-pill');
  if (discPill) {
    const svg = discPill.querySelector('svg');
    if (svg) svg.remove();
  }

  // Substitui o SVG genérico do chip de disciplina na tela intro
  // pelo emoji específico da disciplina vindo do global.js
  const introDiscChip = document.querySelector('.vf-intro-card__chip--disc');
  if (introDiscChip && disciplina?.emoji) {
    const chipSvg = introDiscChip.querySelector('svg');
    if (chipSvg) {
      const emojiSpan = document.createElement('span');
      emojiSpan.textContent = disciplina.emoji;
      emojiSpan.style.cssText = 'font-size:13px; line-height:1; display:inline-flex; align-items:center;';
      chipSvg.replaceWith(emojiSpan);
    }
  }

  const banco = VDD_FALSO_DATA[disc] ?? [];

  if (banco.length === 0) {
    mostrarTela('empty');
    const btnBack = $('btn-empty-back');
    if (btnBack) btnBack.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;
    return;
  }

  const usuarioObj   = getUsuario();
  estado.usuario     = usuarioObj?.uid ?? 'visitante';
  estado.discId      = disc;
  estado.sem         = sem;

  const historico    = await carregarHistoricoVF(estado.usuario, disc, sem).catch(() => ({}));
  estado.historicoVF = historico;                          // ← armazena cache no estado
  estado.perguntas   = montarDeck(banco, historico);

  // [POTENCIAL CORRIGIDO] Valida deck não vazio após montagem
  if (estado.perguntas.length === 0) {
    mostrarTela('empty');
    const btnBack = $('btn-empty-back');
    if (btnBack) btnBack.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;
    return;
  }

  atualizarContadores();
  aplicarCorBarra(100);

  el.btnStart    ?.addEventListener('click', iniciarJogo);
  el.btnTrue     ?.addEventListener('click', () => responder(true));
  el.btnFalse    ?.addEventListener('click', () => responder(false));
  el.btnAnterior ?.addEventListener('click', irAnterior);
  el.btnProxima  ?.addEventListener('click', irProxima);

  setupPausa();
  registrarAtalhos();
  mostrarTela('intro');
}

// [POTENCIAL CORRIGIDO] type="module" é sempre defer — quando o módulo
// executa, DOMContentLoaded pode já ter disparado em cenários de
// history.back() ou navegação rápida com cache. A verificação de
// readyState garante que init() seja chamado em qualquer caso.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}