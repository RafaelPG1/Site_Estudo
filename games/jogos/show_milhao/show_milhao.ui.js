/* ============================================================
   NEXUS STUDY — games/jogos/show_milhao/show_milhao.ui.js  (v4.0)

   Responsabilidades deste arquivo:
     • Referências de DOM (el cache)
     • Renderização de questões, resultados, dots, prêmios
     • Feedback visual (correto / errado / timeout)
     • Badge de histórico por questão
     • Timer UI (número + arco SVG + barra de progresso)
     • Overlay de pausa (criação, show/hide, botões)
     • Banner de modo revisão
     • Tela "Revisão concluída"
     • Tela vazia (empty)
     • Tela de resultado e estatísticas por questão
     • Botões "Revisar erros" e "Continuar"
     • Atalhos de teclado
     • Visibilidade de telas

   Este arquivo NÃO contém:
     • Estado do jogo
     • Regras de negócio
     • Lógica de pontuação
     • Persistência
     • Controle de fluxo
   ============================================================ */

/* ══════════════════════════════════════════════════════════
   CONSTANTES LOCAIS
══════════════════════════════════════════════════════════ */

const CIRCUNFERENCIA = 276.46;

/* ══════════════════════════════════════════════════════════
   CACHE DE DOM
══════════════════════════════════════════════════════════ */

const $ = id => document.getElementById(id);

const el = {};

/* ══════════════════════════════════════════════════════════
   INIT — popula cache de DOM e conecta eventos básicos
══════════════════════════════════════════════════════════ */

/**
 * @param {{ onResponder, onIrAnterior, onIrProxima }} callbacks
 */
export function uiInit({ onResponder, onIrAnterior, onIrProxima }) {
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

  el.btnAnterior?.addEventListener('click', onIrAnterior);
  el.btnProxima?.addEventListener('click', onIrProxima);

  $('alternativas')?.addEventListener('click', e => {
    const btn = e.target.closest('.alt-btn');
    if (btn && !btn.disabled) onResponder(btn.dataset.letra);
  });
}

/* ══════════════════════════════════════════════════════════
   TELAS
══════════════════════════════════════════════════════════ */

/**
 * @param {'intro'|'question'|'result'|'empty'} nome
 * @param {boolean} modoRevisao
 * @param {number} totalQuestoes
 */
export function uiMostrarTela(nome, modoRevisao = false, totalQuestoes = 0) {
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
      const banner = document.createElement('div');
      banner.className = 'sm-revisao-banner';
      banner.setAttribute('role', 'alert');
      banner.setAttribute('aria-label', 'Modo revisão de erros ativo');
      banner.innerHTML = `
        <svg class="sm-revisao-banner__icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 4.5h1.5v4h-1.5v-4zm0 5h1.5v1.5h-1.5v-1.5z"/>
        </svg>
        <span class="sm-revisao-banner__label">Revisão de erros</span>
        <span class="sm-revisao-banner__count">${totalQuestoes} questão${totalQuestoes !== 1 ? 'ões' : ''}</span>
      `;
      questionScreen.insertBefore(banner, questionScreen.firstChild);
    }
  }

  document.body.classList.toggle('modo-revisao', !!modoRevisao);

  window.dispatchEvent(new Event('sm-tela-mudou'));
}

/* ══════════════════════════════════════════════════════════
   TELA VAZIA
══════════════════════════════════════════════════════════ */

/**
 * @param {{ semDisp, sem, disc }} opts
 */
export function uiMostrarTelaVazia({ semDisp, sem, disc }) {
  uiMostrarTela('empty', false, 0);

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
}

/* ══════════════════════════════════════════════════════════
   CONTADORES
══════════════════════════════════════════════════════════ */

export function uiAtualizarContadores(total) {
  if (el.scoreTotal) el.scoreTotal.textContent = total;
  const introTotal = $('intro-total-questoes');
  if (introTotal) introTotal.textContent = total;
}

/* ══════════════════════════════════════════════════════════
   DOTS DE PROGRESSO
══════════════════════════════════════════════════════════ */

/**
 * @param {Array} perguntas
 * @param {Array} respostas
 * @param {number} indice
 * @param {Function} onNavegar  callback(i)
 */
export function uiRenderDots(perguntas, respostas, indice, onNavegar) {
  const container = $('sm-dots');
  if (!container) return;
  container.innerHTML = '';

  perguntas.forEach((p, i) => {
    const resp       = respostas[i];
    const respondida = resp !== undefined;
    const correto    = respondida && resp !== null && resp === p.correta;
    const atual      = i === indice;

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Questão ${i + 1}`);
    dot.className = 'sm-dot ' + (
      atual       ? 'sm-dot--current' :
      !respondida ? 'sm-dot--pending' :
      correto     ? 'sm-dot--correct' : 'sm-dot--wrong'
    );
    dot.addEventListener('click', () => onNavegar(i));
    container.appendChild(dot);
  });
}

/* ══════════════════════════════════════════════════════════
   LISTA DE PRÊMIOS
══════════════════════════════════════════════════════════ */

export function uiConstruirListaPremios(PREMIOS) {
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
}

/**
 * @param {Array}  PREMIOS
 * @param {number} acertos
 * @param {number|null} indicePendente
 * @param {boolean} temErro
 */
export function uiAtualizarPremios(PREMIOS, acertos, indicePendente, temErro) {
  const nivelAtual = temErro ? indicePendente : acertos;

  document.querySelectorAll('.premio-item').forEach((elItem, i) => {
    const pregIdx = PREMIOS.length - 1 - i;
    elItem.classList.remove('atual', 'conquistado', 'pendente');

    if (pregIdx === indicePendente) {
      elItem.classList.add('pendente');
    } else if (pregIdx < acertos) {
      elItem.classList.add('conquistado');
    } else if (pregIdx === nivelAtual && !temErro) {
      elItem.classList.add('atual');
    }
  });
}

/* ══════════════════════════════════════════════════════════
   TIMER UI
══════════════════════════════════════════════════════════ */

export function uiAplicarCorBarra(pct) {
  const bar = el.timerBar ?? document.querySelector('.game-timer-bar');
  if (!bar) return;
  bar.classList.remove('game-timer-bar--green', 'game-timer-bar--mid', 'game-timer-bar--danger');
  if      (pct <= 34) bar.classList.add('game-timer-bar--danger');
  else if (pct <= 67) bar.classList.add('game-timer-bar--mid');
  else                bar.classList.add('game-timer-bar--green');
}

/**
 * @param {number} restante     segundos restantes
 * @param {number} total        total de segundos da questão
 */
export function uiAtualizarTimerUI(restante, total) {
  const elNum = $('timer-numero');
  if (elNum) elNum.textContent = restante;

  const offset = CIRCUNFERENCIA * (1 - restante / total);
  const arco   = $('timer-arco');
  if (arco) arco.style.strokeDashoffset = offset;

  const pct = (restante / total) * 100;
  document.documentElement.style.setProperty('--timer-pct', pct + '%');
  uiAplicarCorBarra(pct);

  const timerContainer = document.querySelector('.timer-container');
  timerContainer?.classList.toggle('timer-urgente', restante <= 5);
}

/* ══════════════════════════════════════════════════════════
   BADGE DE HISTÓRICO POR QUESTÃO
══════════════════════════════════════════════════════════ */

function _renderizarBadgeHistorico(questaoId, histDados) {
  const badge    = $('sm-hist-badge');
  const elTent   = $('sm-hist-tentativas');
  const elTaxa   = $('sm-hist-taxa');
  const elStatus = $('sm-hist-status');
  if (!badge) return;

  if (!histDados || histDados.tentativas === 0) {
    badge.hidden    = true;
    badge.className = 'sm-hist-badge';
    return;
  }

  const { tentativas, acertos } = histDados;
  const taxa = Math.round((acertos / tentativas) * 100);
  let statusMod  = '';
  let statusText = '';

  if (histDados.erros > acertos || (tentativas >= 3 && taxa < 50)) {
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
  void badge.offsetWidth; // força reflow para re-disparar animação
  badge.hidden = false;
}

/* ══════════════════════════════════════════════════════════
   BOTÕES DE NAVEGAÇÃO
══════════════════════════════════════════════════════════ */

function _atualizarBotoesNav(indice, total, respostas) {
  const btnAnterior = el.btnAnterior ?? $('btn-anterior');
  const btnProxima  = el.btnProxima  ?? $('btn-proxima');

  const ultimo    = indice === total - 1;
  const jaResp    = respostas[indice] !== undefined;
  const todasResp = respostas.every(r => r !== undefined);

  if (btnAnterior) btnAnterior.disabled = indice === 0;

  if (btnProxima) {
    const isFinish = ultimo && todasResp;
    btnProxima.disabled = !jaResp;
    btnProxima.classList.toggle('sm-nav-btn--finish', isFinish);
    btnProxima.innerHTML = isFinish
      ? 'Finalizar <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M2 8l4 4 8-8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : 'Próxima <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M6 3l6 5-6 5V3z"/></svg>';
  }
}

/* ══════════════════════════════════════════════════════════
   FEEDBACK
══════════════════════════════════════════════════════════ */

function _mostrarFeedback({ correto, tempoAcabou, pergunta, acertos, indice, total, PREMIOS }) {
  const fb    = $('feedback-box');
  const icone = $('feedback-icone');
  const msg   = $('feedback-msg');
  const resp  = $('feedback-resposta');

  const isUltima = indice >= total - 1;

  if (tempoAcabou) {
    if (icone) icone.textContent = '⏰';
    if (msg)   { msg.textContent = 'Tempo Esgotado!'; msg.style.color = '#ff9800'; }
    if (resp)  resp.textContent  = `A resposta correta era: ${pergunta.correta} — ${pergunta.alternativas[pergunta.correta]}`;

  } else if (correto) {
    if (icone) icone.textContent = isUltima ? '🏆' : '✅';
    if (msg) {
      msg.textContent = isUltima ? '🏆 Você é o Milionário!' : 'Correto! Excelente!';
      msg.style.color = '#00e676';
    }
    if (resp) resp.textContent = `Você ganhou: ${PREMIOS[acertos - 1]?.valor || 'R$ 0'}`;

  } else {
    if (icone) icone.textContent = '❌';
    if (msg)   { msg.textContent = 'Resposta Errada! Prêmio travado 🔴'; msg.style.color = '#ff1744'; }
    if (resp)  resp.textContent  = `A correta era: ${pergunta.correta} — ${pergunta.alternativas[pergunta.correta]} · Acerte a próxima para ganhar ${PREMIOS[indice]?.valor}`;
  }

  fb?.classList.add('visivel');
}

/* ══════════════════════════════════════════════════════════
   RENDERIZAR QUESTÃO
══════════════════════════════════════════════════════════ */

/**
 * Recebe todos os dados necessários vindos do arquivo principal.
 * Não lê nenhum estado global — apenas renderiza.
 */
export function uiRenderizarQuestao({
  pergunta, resp, correto, jaRespondeu,
  isUltima, todasResp,
  histDados, num, total, acertos, valorAtual,
  PREMIOS, respostas, perguntas, indice,
}) {
  _renderizarBadgeHistorico(pergunta.id, histDados);

  if (el.numPergunta)   el.numPergunta.textContent  = `${num}/${total}`;
  if (el.perguntaNivel) el.perguntaNivel.textContent = `Nível ${num} — ${pergunta.nivel ?? ''}`;
  if (el.perguntaTexto) el.perguntaTexto.textContent = pergunta.texto;
  if (el.progressFill)  el.progressFill.style.width  = `${(num / total) * 100}%`;
  if (el.pontuacaoHud)  el.pontuacaoHud.textContent  = valorAtual;

  // Renderiza alternativas
  ['a', 'b', 'c', 'd'].forEach(l => {
    const btn = $(`alt-${l}`);
    const txt = $(`texto-${l}`);
    if (btn) {
      btn.className = 'alt-btn';
      btn.disabled  = jaRespondeu;
      btn.style.opacity = '1';
    }
    if (txt) txt.textContent = pergunta.alternativas[l.toUpperCase()] ?? '';
  });

  // Marca alternativas respondidas
  if (jaRespondeu) {
    if (resp !== null) {
      $(`alt-${resp.toLowerCase()}`)?.classList.add(correto ? 'correta' : 'errada');
    }
    if (!correto && resp !== null) {
      $(`alt-${pergunta.correta.toLowerCase()}`)?.classList.add('revelada');
    }
    _mostrarFeedback({
      correto,
      tempoAcabou: resp === null,
      pergunta,
      acertos,
      indice,
      total,
      PREMIOS,
    });
  } else {
    $('feedback-box')?.classList.remove('visivel');
  }

  _atualizarBotoesNav(indice, total, respostas);
}

/* ══════════════════════════════════════════════════════════
   BOTÃO "REVISAR ERROS"
══════════════════════════════════════════════════════════ */

/**
 * @param {Array}    erradas          questões com erro
 * @param {Function} onIniciarRevisao callback(erradas)
 */
export function uiAtualizarBtnRevisarErros(erradas, onIniciarRevisao) {
  const ids = [
    { btn: 'sm-btn-revisar-erros', count: 'sm-revisar-count' },
  ];

  for (const { btn: btnId } of ids) {
    const btn = $(btnId);
    if (!btn) continue;

    if (!erradas || erradas.length === 0) {
      btn.classList.add('hidden');
      if (btnId === 'sm-btn-revisar-erros') {
        const wrapper = $('sm-revisar-wrapper');
        if (wrapper) wrapper.style.display = 'none';
      }
      continue;
    }

    const countEl = btn.querySelector('.sm-revisar-badge');
    if (countEl) countEl.textContent = erradas.length;

    if (btnId === 'sm-btn-revisar-erros') {
      const wrapper = $('sm-revisar-wrapper');
      if (wrapper) wrapper.style.display = 'flex';
    }

    // Substitui o nó para limpar listeners anteriores
    const novo = btn.cloneNode(true);
    btn.parentNode.replaceChild(novo, btn);
    novo.classList.remove('hidden');
    novo.addEventListener('click', () => onIniciarRevisao(erradas));
  }
}

/* ══════════════════════════════════════════════════════════
   BOTÃO "CONTINUAR" na intro
══════════════════════════════════════════════════════════ */

/**
 * @param {object|null}   sessao        dados da sessão salva (ou null para esconder)
 * @param {Function|null} onContinuar   callback(sessao)
 */
export function uiConfigurarBtnContinuar(sessao, onContinuar) {
  const bloco  = $('intro-continuar');
  const btn    = $('btn-continuar');
  const infoEl = $('continuar-info');

  if (!sessao || !bloco || !btn) {
    if (bloco) bloco.style.display = 'none';
    return;
  }

  const pendentes = sessao.respostas.filter(r => r === undefined).length;

  if (pendentes === 0) {
    bloco.style.display = 'none';
    return;
  }

  bloco.style.display = 'flex';

  if (infoEl) {
    const respondidas = sessao.respostas.filter(r => r !== undefined).length;
    const label       = sessao.modoRevisao ? 'Revisão' : 'Partida';
  }

  // Substitui o nó para limpar listeners anteriores
  const novo = btn.cloneNode(true);
  btn.parentNode.replaceChild(novo, btn);
  novo.addEventListener('click', () => onContinuar(sessao));
}

/* ══════════════════════════════════════════════════════════
   TELA DE RESULTADO
══════════════════════════════════════════════════════════ */

/**
 * @param {{
 *   acertos, respondidas, pct, valorFinal, totalSeg,
 *   modoRevisao, todosCorretos,
 *   melhor, acumDados,
 *   perguntas, respostas, historicoSM,
 *   onSair, onRejogo, onRevisarErros, erradas
 * }} dados
 */
export function uiRenderizarResultado(dados) {
  const {
    acertos, respondidas, pct, valorFinal, totalSeg,
    modoRevisao, todosCorretos, melhor, acumDados,
    perguntas, respostas, historicoSM,
    onSair, onRejogo, onRevisarErros, erradas,
  } = dados;

  let emoji, titulo;
  if      (pct >= 80) { emoji = '🏆'; titulo = todosCorretos && !modoRevisao ? 'MILIONÁRIO!' : 'Excelente!'; }
  else if (pct >= 50) { emoji = '🌟'; titulo = 'Muito bem!'; }
  else                { emoji = '📚'; titulo = 'Pode melhorar!'; }

  // Badge de modo revisão
  const resultCard = document.querySelector('.resultado-nucleo');
  if (resultCard) {
    resultCard.querySelector('.sm-finish-revisao-badge')?.remove();
    if (modoRevisao) {
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

  // Preenche os elementos de resultado
  const set = (id, val) => { const e = $(id); if (e) e.textContent = val; };
  set('resultado-simbolo',  emoji);
  set('resultado-titulo',   titulo);
  set('resultado-valor',    modoRevisao ? '— revisão —' : valorFinal);
  set('resultado-acertos',  acertos);
  set('resultado-erros',    respondidas - acertos);
  set('resultado-precisao', `${pct}%`);

  const mm = Math.floor(totalSeg / 60);
  const ss = String(totalSeg % 60).padStart(2, '0');
  set('resultado-tempo', `${mm}:${ss}`);

  // Melhor pontuação / acumulado
  const elMelhor = $('resultado-melhor');
  if (elMelhor) {
    if (!modoRevisao && melhor) {
      const valorNum = parseInt(valorFinal.replace(/\D/g, ''), 10) || 0;
      const ehNovo   = melhor.valorNum === valorNum && melhor.acertos === acertos;
      const linhas   = [];
      linhas.push(`${ehNovo ? '🎉 Novo recorde!' : '🏅 Melhor:'} ${melhor.valor} (${melhor.acertos} acertos · ${melhor.precisao}%)`);
      if (acumDados?.acumulado > 0) {
        const acumFmt = 'R$ ' + acumDados.acumulado.toLocaleString('pt-BR');
        linhas.push(`💰 Acumulado: ${acumFmt} em ${acumDados.totalPartidas} partida${acumDados.totalPartidas !== 1 ? 's' : ''}`);
      }
      elMelhor.innerHTML = linhas.join('<br>');
      elMelhor.style.display = 'block';
    } else {
      elMelhor.style.display = 'none';
    }
  }

  // Botão "Sair → intro"
  const elSair = $('resultado-btn-sair');
  if (elSair) {
    elSair.removeAttribute('href');
    const novoSair = elSair.cloneNode(true);
    elSair.parentNode.replaceChild(novoSair, elSair);
    novoSair.addEventListener('click', e => { e.preventDefault(); onSair(); });
  }

  // Botão "Jogar novamente / Repetir revisão"
  const elRejogo = $('resultado-btn-rejogo');
  if (elRejogo) {
    const novoRejogo = elRejogo.cloneNode(true);
    elRejogo.parentNode.replaceChild(novoRejogo, elRejogo);

    if (modoRevisao) {
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

    novoRejogo.addEventListener('click', onRejogo);
  }

  // Botão "Revisar erros" no resultado
  uiAtualizarBtnRevisarErros(erradas, onRevisarErros);


}

/* ══════════════════════════════════════════════════════════
   ESTATÍSTICAS POR QUESTÃO (detalhe no resultado)
══════════════════════════════════════════════════════════ */

function _renderEstatisticasQuestoes({ perguntas, respostas, historicoSM, modoRevisao }) {
  const resultCard = document.querySelector('.resultado-nucleo');
  if (!resultCard) return;
  resultCard.querySelector('.sm-stats-questoes')?.remove();

  const temDados = perguntas.some(q => historicoSM[q.id ?? '']);
  if (!temDados) return;

  const painel = document.createElement('details');
  painel.className = 'sm-stats-questoes';
  painel.open = true;
  painel.innerHTML = `<summary><span class="sm-sq-summary-icon">📊</span>Progresso por questão<span class="sm-sq-chevron">▾</span></summary>`;

  const lista = document.createElement('div');
  lista.className = 'sm-sq-lista';

  for (const q of perguntas) {
    const h           = historicoSM[q.id ?? ''];
    const idx         = perguntas.indexOf(q);
    const respAtual   = respostas[idx];
    const acertouAgora = respAtual !== null && respAtual !== undefined && respAtual === q.correta;
    const errouAgora   = respAtual !== null && respAtual !== undefined && respAtual !== q.correta;

    const row  = document.createElement('div');
    row.className = 'sm-sq-row sm-sq-row--prog';
    const enun = (q.texto ?? '').length > 52 ? q.texto.slice(0, 52) + '…' : (q.texto ?? '');

    if (modoRevisao) {
      const icone   = acertouAgora ? '✓' : errouAgora ? '✗' : '–';
      const iconCor = acertouAgora ? '#34d399' : errouAgora ? '#f87171' : '#94a3b8';
      const barCls  = acertouAgora ? 'sm-sq-bar-fill--ok' : 'sm-sq-bar-fill--critico';
      const barPct  = acertouAgora ? 100 : 0;
      const label   = acertouAgora ? 'Acertou' : errouAgora ? 'Errou' : '–';
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
          <span class="sm-sq-stat" style="color:${cor}">${tentativas > 0 ? acertos + '/' + tentativas : '—'}</span>
        </div>`;
    }

    lista.appendChild(row);
  }

  painel.appendChild(lista);
  resultCard.appendChild(painel);
}

/* ══════════════════════════════════════════════════════════
   TELA "REVISÃO CONCLUÍDA"
══════════════════════════════════════════════════════════ */

export function uiMostrarTelaRevisaoConcluida(onVoltar) {
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

  uiMostrarTela('result', false, 0);
  $('revisao-concluida-voltar')?.addEventListener('click', onVoltar);
}

/* ══════════════════════════════════════════════════════════
   OVERLAY DE PAUSA
══════════════════════════════════════════════════════════ */

/**
 * @param {{
 *   onTogglePausa:   () => boolean   retorna o novo estado pausado
 *   onVoltarIntro:   () => void
 *   isPausado:       () => boolean
 *   isQuestaoAtiva:  () => boolean   true se a questão atual ainda não foi respondida
 * }} opts
 */
export function uiSetupPausa({ onTogglePausa, onVoltarIntro, isPausado, isQuestaoAtiva }) {
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

  function _handleToggle() {
    // Não pausa se a tela de questões não estiver visível
    if (el.screenQuestion?.classList.contains('hidden')) return;
    // Não pausa se a questão já foi respondida
    if (!isQuestaoAtiva()) return;
    const novoPausado = onTogglePausa();
    _aplicarEstadoPausa(novoPausado);
  }

  btnPause?.addEventListener('click', _handleToggle);
  pauseOverlay.addEventListener('click', e => {
    if (e.target.closest('#btn-retomar')) _handleToggle();
  });

  btnVoltarIntro?.addEventListener('click', async () => {
    // Garante que o overlay está fechado antes de voltar
    _aplicarEstadoPausa(false);
    uiAtualizarTimerUI(30, 30);
    uiAplicarCorBarra(100);
    await onVoltarIntro();
  });

  // Expõe o aplicador de estado para uso externo (ex: atalho Espaço)
  uiSetupPausa._aplicarEstadoPausa = _aplicarEstadoPausa;
}

/* ══════════════════════════════════════════════════════════
   ATALHOS DE TECLADO
══════════════════════════════════════════════════════════ */

/**
 * @param {{
 *   onResponder, onIrProxima, onIrAnterior, onTogglePausa,
 *   isPausado, isQuestaoAtiva, getIndice, getRespostas
 * }} opts
 */
export function uiRegistrarAtalhos({
  onResponder, onIrProxima, onIrAnterior, onTogglePausa,
  isPausado, isQuestaoAtiva, getIndice, getRespostas,
}) {
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    // Espaço → pausa (em qualquer estado da questão ativa)
    if (e.code === 'Space') {
      if (el.screenQuestion?.classList.contains('hidden')) return;
      if (document.activeElement?.id === 'btn-retomar') return;
      if (!isQuestaoAtiva()) return;
      e.preventDefault();
      const novoPausado = onTogglePausa();
      uiSetupPausa._aplicarEstadoPausa?.(novoPausado);
      return;
    }

    // Demais atalhos — bloqueados durante pausa ou fora da tela de questão
    if (isPausado()) return;
    if (!el.screenQuestion || el.screenQuestion.classList.contains('hidden')) return;

    const jaResp = getRespostas()[getIndice()] !== undefined;

    switch (e.key) {
      case '1': case 'a': case 'A': if (!jaResp) { e.preventDefault(); onResponder('A'); } break;
      case '2': case 'b': case 'B': if (!jaResp) { e.preventDefault(); onResponder('B'); } break;
      case '3': case 'c': case 'C': if (!jaResp) { e.preventDefault(); onResponder('C'); } break;
      case '4': case 'd': case 'D': if (!jaResp) { e.preventDefault(); onResponder('D'); } break;
      case 'ArrowRight': case 'Enter': if (jaResp) { e.preventDefault(); onIrProxima(); }  break;
      case 'ArrowLeft':                              e.preventDefault(); onIrAnterior();    break;
    }
  });
}