/* ============================================================
   NEXUS STUDY — games/jogos/vdd_falso/vdd_falso.js  (v7.0)

   Novidades v7.0 (refatoração de persistência):
   ─────────────────────────────────────────────
   • Substitui salvarSessao / carregarSessaoSalva / limparSessao
     pelo módulo SessionNav (../../template/session-nav.js).
   • Anti-flash nativo: o módulo injeta um <style> que esconde
     todas as telas antes do primeiro render; ao restaurar a
     sessão correta, o style é removido — sem piscar, sem passar
     pela home.
   • Detecção automática de reload vs. saída real: a sessão é
     restaurada SOMENTE em reload da mesma aba. Ao sair para
     outra rota, a sessão é limpada automaticamente pelo
     listener beforeunload/popstate do SessionNav.
   • salvarSessão throttled no onTick do timer (500 ms) em vez
     de a cada 5 s, eliminando potencial de perda de estado.
   • _configurarBtnContinuar usa nav.lerSessao() (independente
     de reload), mantendo o botão "Continuar" visível após
     voltar da tela de questões para a intro.
   • Todos os pontos de saída consciente (Sair, Começar,
     Finalizar) chamam nav.limpar() explicitamente.

   Demais funcionalidades idênticas à v6.4.
   ============================================================ */

import { Shell, Timer, Result, shuffle, lerParams } from '../../template/game-shell.js';
import { calcularPeso, sorteiarPonderado }          from '../../template/deck.js';
import { DISC_CORES }                               from '../../../shared/js/cores.js';
import { aplicarCoresDisciplina }                   from '../../../shared/js/theme.js';
import { carregarHistoricoVF, salvarResultadoVF }  from './storage_vf.js';
import { getUsuario, getDisciplinasDeSemestre }    from '../../../src/global.js';
import { SessionNav }                              from '../../template/session-nav.js';

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
  SESSAO_TTL_MS:     24 * 60 * 60 * 1000,  // 24 h
  SESSAO_THROTTLE_MS: 500,
};

/* ══════════════════════════════════════════════════════════
   ESTADO
   ══════════════════════════════════════════════════════════ */

const estado = {
  perguntas:    [],
  banco:        [],
  indice:       0,
  pontos:       0,
  acertos:      0,
  erros:        0,
  respostas:    [],
  tempos:       [],
  timer:        null,
  pausado:      false,
  usuario:      null,
  discId:       null,
  sem:          null,
  historicoVF:  {},
  modoRevisao:  false,
  cardsRevisao: null,
  tempoInicio:  null,

  // Instância do SessionNav — criada no init()
  _nav:         null,
};

/* ══════════════════════════════════════════════════════════
   HELPERS DE SESSÃO (delegam ao SessionNav)
   ══════════════════════════════════════════════════════════ */

/** Captura o snapshot que o SessionNav precisa para salvar.
 *  @param {'question'|'intro'} [tela='question'] - Tela ativa no momento do save.
 *  Controla se o próximo reload vai restaurar automaticamente (question)
 *  ou apenas mostrar o botão Continuar na intro (intro).
 */
function _snapshotEstado(tela = 'question') {
  return {
    perguntas:   estado.perguntas,
    respostas:   estado.respostas,
    tempos:      estado.tempos,
    indice:      estado.indice,
    pontos:      estado.pontos,
    acertos:     estado.acertos,
    erros:       estado.erros,
    modoRevisao: estado.modoRevisao,
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
   DOM
   ══════════════════════════════════════════════════════════ */

const $ = id => document.getElementById(id);
const el = {};

const INFO_STRIP_DEFAULT = 'Após sua escolha, a resposta aparecerá automaticamente.';

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
    const dot        = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Questão ${i + 1}`);
    dot.className = 'vf-dot ' + (
      atual       ? 'vf-dot--current'  :
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
  const screenLoading = document.getElementById('screen-loading');
  screenLoading?.classList.add('hidden');

  el.screenIntro   ?.classList.add('hidden');
  el.screenQuestion?.classList.add('hidden');
  el.screenEmpty   ?.classList.add('hidden');
  el.screenResult  ?.classList.add('hidden');

  if (nome === 'intro')    el.screenIntro   ?.classList.remove('hidden');
  if (nome === 'question') el.screenQuestion?.classList.remove('hidden');
  if (nome === 'empty')    el.screenEmpty   ?.classList.remove('hidden');
  if (nome === 'result')   el.screenResult  ?.classList.remove('hidden');

  // Tema revisão
  const emRevisao = !!estado.modoRevisao;
  document.body.classList.toggle('modo-revisao', emRevisao);
  el.screenQuestion?.dataset && (el.screenQuestion.dataset.revisao = emRevisao ? 'true' : 'false');

  // Banner de revisão
  const mainArea = el.screenQuestion?.querySelector('.vf-main-area');
  if (mainArea) {
    mainArea.querySelector('.vf-revisao-banner')?.remove();
    if (emRevisao && nome === 'question') {
      const total = estado.perguntas?.length ?? 0;
      const banner = document.createElement('div');
      banner.className = 'vf-revisao-banner';
      banner.setAttribute('role', 'alert');
      banner.setAttribute('aria-label', 'Modo revisão de erros ativo');
      banner.innerHTML = `
        <i class="fas fa-triangle-exclamation vf-revisao-banner__icon" aria-hidden="true"></i>
        <span class="vf-revisao-banner__label">Revisão de erros</span>
        <span class="vf-revisao-banner__count">${total} questão${total !== 1 ? 'ões' : ''}</span>
      `;
      mainArea.insertBefore(banner, mainArea.firstChild);
    }
  }
}

/* ══════════════════════════════════════════════════════════
   FLUXO
   ══════════════════════════════════════════════════════════ */

function iniciarJogo(modoRevisao = false) {
  estado.modoRevisao = modoRevisao;

  if (modoRevisao) {
    if (!estado.cardsRevisao || estado.cardsRevisao.length === 0) {
      const erradas = questoesComErro(estado.banco, estado.historicoVF);
      estado.cardsRevisao = erradas;
      estado.perguntas = shuffle(erradas.slice(0, CONFIG.MAX_QUESTOES));
    }
  } else {
    estado.cardsRevisao = null;
    estado.perguntas = montarDeck(estado.banco, estado.historicoVF);
  }

  estado.indice      = 0;
  estado.pontos      = 0;
  estado.acertos     = 0;
  estado.erros       = 0;
  estado.tempoInicio = Date.now();
  estado.respostas   = new Array(estado.perguntas.length);
  estado.tempos      = new Array(estado.perguntas.length).fill(CONFIG.TEMPO_POR_QUESTAO);
  estado.pausado     = false;

  if (el.scoreCorrect) el.scoreCorrect.textContent = 0;
  atualizarContadores();
  mostrarTela('question');
  renderizarQuestao();
}

function criarTimer(totalInicial) {
  return Timer.criar({
    total:  totalInicial ?? CONFIG.TEMPO_POR_QUESTAO,
    onTick: (restante) => {
      estado.tempos[estado.indice] = restante;

      // Throttled: no máximo 1 write a cada 500 ms durante o tick
      salvarSessaoThrottled();

      const pctReal = (restante / CONFIG.TEMPO_POR_QUESTAO) * 100;
      document.documentElement.style.setProperty('--timer-pct', pctReal + '%');
      aplicarCorBarra(pctReal);
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
   BADGE DE HISTÓRICO POR QUESTÃO
   ══════════════════════════════════════════════════════════ */

function renderizarBadgeHistorico(questaoId) {
  const badge    = $('vf-hist-badge');
  const elTent   = $('vf-hist-tentativas');
  const elTaxa   = $('vf-hist-taxa');
  const elStatus = $('vf-hist-status');
  if (!badge) return;

  const h = estado.historicoVF[questaoId];
  if (!h || h.tentativas === 0) {
    badge.hidden    = true;
    badge.className = 'vf-hist-badge';
    return;
  }

  const { tentativas, acertos, erros } = h;
  const taxa = Math.round((acertos / tentativas) * 100);
  let statusMod  = '';
  let statusText = '';
  const maisErros = erros > acertos;

  if (maisErros || (tentativas >= 3 && taxa < 50)) {
    statusMod  = 'vf-hist-badge--critico';
    statusText = 'crítico';
  } else if (tentativas >= 3 && taxa >= 80) {
    statusMod  = 'vf-hist-badge--dominado';
    statusText = 'dominado';
  } else if (taxa >= 50) {
    statusMod  = 'vf-hist-badge--ok';
    statusText = 'ok';
  }

  if (elTent)   elTent.textContent   = tentativas;
  if (elTaxa)   elTaxa.textContent   = `${taxa}%`;
  if (elStatus) elStatus.textContent = statusText;

  badge.className = `vf-hist-badge${statusMod ? ' ' + statusMod : ''}`;
  void badge.offsetWidth;
  badge.hidden = false;
}

/* ══════════════════════════════════════════════════════════
   RENDERIZAR QUESTÃO
   ══════════════════════════════════════════════════════════ */

function renderizarQuestao() {
  const pergunta   = estado.perguntas[estado.indice];
  const jaRespondeu = estado.respostas[estado.indice] !== undefined;
  const resposta   = estado.respostas[estado.indice];
  const correto    = jaRespondeu && resposta === pergunta.resposta;

  if (el.qCurrent) el.qCurrent.textContent = estado.indice + 1;
  if (el.qTotal)   el.qTotal.textContent   = estado.perguntas.length;

  const pct = ((estado.indice + 1) / estado.perguntas.length) * 100;
  if (el.progressFill) el.progressFill.style.width = pct + '%';

  if (el.questionText) el.questionText.textContent = pergunta.enunciado;

  // Limpa estado visual dos botões
  if (el.btnTrue)  { el.btnTrue.classList.remove('vf-btn--selected', 'vf-btn--correct', 'vf-btn--wrong'); }
  if (el.btnFalse) { el.btnFalse.classList.remove('vf-btn--selected', 'vf-btn--correct', 'vf-btn--wrong'); }

  if (jaRespondeu) {
    const btnResposta = resposta === true ? el.btnTrue : el.btnFalse;
    if (btnResposta) {
      btnResposta.classList.add('vf-btn--selected');
      btnResposta.classList.add(correto ? 'vf-btn--correct' : 'vf-btn--wrong');
    }
    // Mostra botão correto
    const btnCorreto = pergunta.resposta === true ? el.btnTrue : el.btnFalse;
    if (btnCorreto && !correto) btnCorreto.classList.add('vf-btn--correct');

    setInfoStrip(pergunta.explicacao ?? null);
  } else {
    setInfoStrip(null);
  }

  renderizarBadgeHistorico(pergunta.id);
  atualizarBotoesNav();
  renderDots();

  // Timer
  if (estado.timer) {
    estado.timer.stop();
    estado.timer = null;
  }

  if (!jaRespondeu) {
    const tempoRestante = estado.tempos[estado.indice] ?? CONFIG.TEMPO_POR_QUESTAO;
    const pctInicial    = (tempoRestante / CONFIG.TEMPO_POR_QUESTAO) * 100;
    estado.timer = criarTimer(tempoRestante);
    estado.timer.start();
    aplicarCorBarra(pctInicial);
    document.documentElement.style.setProperty('--timer-pct', pctInicial + '%');
  }
}

function atualizarBotoesNav() {
  const total       = estado.perguntas.length;
  const ultimo      = estado.indice === total - 1;
  const jaRespondeu = estado.respostas[estado.indice] !== undefined;
  const todasResp   = estado.respostas.every(r => r !== undefined);

  if (el.btnAnterior) el.btnAnterior.disabled = estado.indice === 0;

  if (el.btnProxima) {
    const isFinish = ultimo && todasResp;
    el.btnProxima.disabled = !jaRespondeu;
    el.btnProxima.classList.toggle('vf-nav-btn--finish', isFinish);
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

  if (resp !== null) {
    if (correto) {
      estado.pontos  += CONFIG.PONTOS_ACERTO;
      estado.acertos += 1;
    } else {
      estado.pontos   = Math.max(0, estado.pontos - CONFIG.PONTOS_ERRO);
      estado.erros   += 1;
    }

    const resultado = [{ id: pergunta.id, resp, acertou: correto }];
    salvarResultadoVF(estado.usuario, estado.discId, estado.sem, resultado)
      .then(() => {
        const entrada = estado.historicoVF[pergunta.id] ?? {
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
        entrada.ultimaVez = Date.now();
        estado.historicoVF[pergunta.id] = entrada;
      })
      .catch(err => console.warn('[vdd_falso] Erro ao salvar resposta:', err));
  }

  if (el.scoreCorrect) el.scoreCorrect.textContent = estado.acertos;
  renderizarQuestao();
  salvarSessao(); // salvamento imediato após resposta
}

/* ══════════════════════════════════════════════════════════
   NAVEGAÇÃO
   ══════════════════════════════════════════════════════════ */

function navegarPara(i) {
  if (i < 0 || i >= estado.perguntas.length) return;
  estado.indice = i;
  renderizarQuestao();
  salvarSessao();
}

function irAnterior() {
  if (estado.indice > 0) {
    estado.timer?.stop();
    navegarPara(estado.indice - 1);
  }
}

function irProxima() {
  const ultimo    = estado.indice === estado.perguntas.length - 1;
  const todasResp = estado.respostas.every(r => r !== undefined);

  if (ultimo && todasResp) { finalizarJogo(); return; }

  if (estado.indice < estado.perguntas.length - 1) {
    navegarPara(estado.indice + 1);
    return;
  }

  const primeiraPendente = estado.respostas.findIndex(r => r === undefined);
  if (primeiraPendente !== -1) navegarPara(primeiraPendente);
}

/* ══════════════════════════════════════════════════════════
   FINALIZAR
   ══════════════════════════════════════════════════════════ */

async function finalizarJogo() {
  estado.timer?.stop();
  limparSessao();             // rodada concluída — descarta ponto de retorno
  estado._nav?.sairParaRota(); // beforeunload não deve sinalizar reload desta saída

  const respondidas = estado.respostas.filter(r => r !== null && r !== undefined).length;
  const pct         = respondidas > 0 ? Math.round((estado.acertos / respondidas) * 100) : 0;

  let emoji, titulo;
  if      (pct >= 80) { emoji = '🏆'; titulo = 'Excelente!';     }
  else if (pct >= 50) { emoji = '👍'; titulo = 'Bom trabalho!';  }
  else                { emoji = '📚'; titulo = 'Pode melhorar!'; }

  const elSimb     = $('resultado-simbolo');
  const elTitulo   = $('resultado-titulo');
  const elPontos   = $('resultado-pontos');
  const elAcertos  = $('resultado-acertos');
  const elErros    = $('resultado-erros');
  const elPrecisao = $('resultado-precisao');
  const elTempo    = $('resultado-tempo');
  const elSair     = $('resultado-btn-sair');
  const elRejogo   = $('resultado-btn-rejogo');

  const resultadoNucleo = document.querySelector('.resultado-nucleo');
  if (resultadoNucleo) {
    resultadoNucleo.querySelector('.vf-finish-revisao-badge')?.remove();
    if (estado.modoRevisao) {
      const badge = document.createElement('div');
      badge.className = 'vf-finish-revisao-badge';
      badge.innerHTML = `<i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Revisão de erros`;
      resultadoNucleo.insertBefore(badge, resultadoNucleo.firstChild);
    }
  }

  if (elRejogo && estado.modoRevisao) elRejogo.classList.add('resultado-btn--repetir-revisao');

  if (elSimb)    elSimb.textContent    = emoji;
  if (elTitulo)  elTitulo.textContent  = titulo;
  if (elPontos)  elPontos.textContent  = estado.pontos;
  if (elAcertos) elAcertos.textContent = estado.acertos;
  if (elErros)   elErros.textContent   = estado.erros;
  if (elPrecisao) elPrecisao.textContent = pct + '%';

  if (elTempo) {
    const totalSeg = Math.round((Date.now() - (estado.tempoInicio ?? Date.now())) / 1000);
    const mm = Math.floor(totalSeg / 60);
    const ss = String(totalSeg % 60).padStart(2, '0');
    elTempo.textContent = `${mm}:${ss}`;
  }

  // Botão Sair → volta para intro conscientemente
  if (elSair) {
    elSair.removeAttribute('href');
    elSair.style.cursor = 'pointer';
    const novoSair = elSair.cloneNode(true);
    elSair.parentNode.replaceChild(novoSair, elSair);
    novoSair.addEventListener('click', async (e) => {
      e.preventDefault();
      limparSessao();
      document.getElementById('btn-continuar')?.classList.add('hidden');
      estado.modoRevisao  = false;
      estado.cardsRevisao = null;
      estado.perguntas    = montarDeck(estado.banco, estado.historicoVF);
      atualizarBtnRevisarErros(estado.banco, estado.historicoVF);
      atualizarContadores();
      mostrarTela('intro');
    });
  }

  // Botão jogar novamente
  if (elRejogo) {
    const novoRejogo = elRejogo.cloneNode(true);
    elRejogo.parentNode.replaceChild(novoRejogo, elRejogo);

    if (estado.modoRevisao) {
      novoRejogo.textContent = '';
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

    novoRejogo.addEventListener('click', async () => {
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
        if (erradasAgora.length === 0) { mostrarTelaRevisaoConcluida(); return; }
        estado.cardsRevisao = erradasAgora;
        estado.perguntas    = shuffle(erradasAgora.slice(0, CONFIG.MAX_QUESTOES));
        atualizarContadores();
        iniciarJogo(true);
        return;
      }

      estado.modoRevisao  = false;
      estado.cardsRevisao = null;
      estado.perguntas    = montarDeck(estado.banco, historico);
      if (estado.perguntas.length === 0) { mostrarTela('empty'); return; }
      atualizarContadores();
      iniciarJogo();
    });
  }

  mostrarTela('result');
  renderEstatisticasQuestoes(estado.historicoVF, estado.perguntas, estado.modoRevisao);
  atualizarBtnRevisarErros(estado.banco, estado.historicoVF);
}

/* ══════════════════════════════════════════════════════════
   TELA DE REVISÃO CONCLUÍDA
   ══════════════════════════════════════════════════════════ */

function mostrarTelaRevisaoConcluida() {
  const resultCard = document.querySelector('.resultado-nucleo');
  if (!resultCard) { mostrarTela('intro'); return; }

  resultCard.innerHTML = `
    <div class="vf-finish-revisao-badge">
      <i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Revisão de erros
    </div>
    <div class="resultado-topo">
      <div class="resultado-simbolo">🏆</div>
      <h2 class="resultado-titulo">Revisão concluída!</h2>
    </div>
    <div class="resultado-divisor">
      <span class="resultado-divisor__linha"></span>
      <span class="resultado-divisor__ponto"></span>
      <span class="resultado-divisor__linha"></span>
    </div>
    <p class="vf-revisao-concluida-msg">
      Você superou todos os erros desta sessão de revisão! 🎉
    </p>
    <div class="resultado-acoes">
      <button class="resultado-btn resultado-btn--primario" id="revisao-concluida-voltar">
        Voltar ao início
        <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
          <path d="M5 3l8 5-8 5V3z"/>
        </svg>
      </button>
    </div>
  `;

  mostrarTela('result');

  $('revisao-concluida-voltar')?.addEventListener('click', async () => {
    const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
    estado.historicoVF  = historico;
    estado.modoRevisao  = false;
    estado.cardsRevisao = null;
    estado.perguntas    = montarDeck(estado.banco, historico);
    atualizarContadores();
    atualizarBtnRevisarErros(estado.banco, historico);
    mostrarTela('intro');
  });
}

/* ══════════════════════════════════════════════════════════
   ESTATÍSTICAS POR QUESTÃO
   ══════════════════════════════════════════════════════════ */

function renderEstatisticasQuestoes(historico, perguntas, modoRevisao = false) {
  const resultCard = document.querySelector('.game-result__card') ?? document.querySelector('.resultado-nucleo');
  if (!resultCard) return;
  resultCard.querySelector('.vf-stats-questoes')?.remove();
  const temDados = perguntas.some(q => historico[q.id]);
  if (!temDados) return;

  const painel = document.createElement('details');
  painel.className = 'vf-stats-questoes';
  painel.open = true;
  painel.innerHTML = `<summary><span class="vf-sq-summary-icon">📊</span>Progresso por questão<span class="vf-sq-chevron">▾</span></summary>`;

  const lista = document.createElement('div');
  lista.className = 'vf-sq-lista';

  for (const q of perguntas) {
    const h    = historico[q.id];
    const resp = estado.respostas[estado.perguntas.indexOf(q)];
    const acertouAgora = resp !== null && resp !== undefined && resp === q.resposta;
    const errouAgora   = resp !== null && resp !== undefined && resp !== q.resposta;
    const enun = q.enunciado.length > 52 ? q.enunciado.slice(0, 52) + '…' : q.enunciado;
    let rowHtml;

    if (modoRevisao) {
      const icone   = acertouAgora ? '✓' : errouAgora ? '✗' : '–';
      const iconCor = acertouAgora ? '#34d399' : errouAgora ? '#f87171' : '#94a3b8';
      const barCls  = acertouAgora ? 'vf-prog-bar--ok' : 'vf-prog-bar--critico';
      const barPct  = acertouAgora ? 100 : 0;
      const label   = acertouAgora ? 'Acertou' : errouAgora ? 'Errou' : '–';
      rowHtml = `
        <div class="vf-sq-meta">
          <span class="vf-sq-icone" style="color:${iconCor}">${icone}</span>
          <span class="vf-sq-enun">${enun}</span>
          ${acertouAgora ? '<span class="vf-sq-superada" title="Acertou nesta rodada">⭐</span>' : ''}
        </div>
        <div class="vf-sq-prog-row">
          <div class="vf-prog-bar ${barCls}" style="width:${barPct}%"></div>
          <span class="vf-sq-pct">${label}</span>
        </div>`;
    } else {
      if (!h) continue;
      const { tentativas, acertos, erros } = h;
      const taxa    = Math.round((acertos / tentativas) * 100);
      const barCls  = taxa >= 80 ? 'vf-prog-bar--ok' : taxa >= 50 ? 'vf-prog-bar--med' : 'vf-prog-bar--critico';
      const icone   = acertouAgora ? '✓' : errouAgora ? '✗' : '–';
      const iconCor = acertouAgora ? '#34d399' : errouAgora ? '#f87171' : '#94a3b8';
      rowHtml = `
        <div class="vf-sq-meta">
          <span class="vf-sq-icone" style="color:${iconCor}">${icone}</span>
          <span class="vf-sq-enun">${enun}</span>
          ${acertouAgora && tentativas >= 3 && taxa >= 80 ? '<span class="vf-sq-superada" title="Dominada">⭐</span>' : ''}
        </div>
        <div class="vf-sq-prog-row">
          <div class="vf-prog-bar ${barCls}" style="width:${taxa}%"></div>
          <span class="vf-sq-pct">${taxa}%</span>
        </div>
        <div class="vf-sq-detalhe">${acertos} acerto${acertos !== 1 ? 's' : ''} / ${tentativas} tentativa${tentativas !== 1 ? 's' : ''}</div>`;
    }

    const row = document.createElement('div');
    row.className = 'vf-sq-row';
    row.innerHTML = rowHtml;
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
  const pauseOverlay   = $('pause-overlay') ?? (() => {
    const el = document.createElement('div');
    el.id        = 'pause-overlay';
    el.className = 'vf-pause-overlay hidden';
    el.innerHTML = `
      <div class="vf-pause-card">
        <p class="vf-pause-title">Pausado</p>
        <button class="game-btn" id="btn-retomar">Retomar</button>
      </div>`;
    document.querySelector('.game-shell')?.appendChild(el);
    return el;
  })();

  function togglePausa() {
    if (el.screenQuestion?.classList.contains('hidden')) return;
    if (estado.respostas[estado.indice] !== undefined)   return;
    estado.pausado = !estado.pausado;

    const btnPauseEl   = $('btn-pause');
    const pauseIconEl  = $('pause-icon');
    const pauseLabelEl = $('pause-label');

    if (estado.pausado) {
      estado.timer?.pause();
      pauseOverlay.classList.remove('hidden');
      btnPauseEl?.classList.add('vf-ctrl-btn--paused');
      if (pauseIconEl)  { pauseIconEl.innerHTML = `<path d="M14 8l40 24L14 56V8z"/>`; pauseIconEl.setAttribute('viewBox', '0 0 64 64'); }
      if (pauseLabelEl)   pauseLabelEl.textContent = 'Retomar';
    } else {
      estado.timer?.resume();
      pauseOverlay.classList.add('hidden');
      btnPauseEl?.classList.remove('vf-ctrl-btn--paused');
      if (pauseIconEl)  { pauseIconEl.innerHTML = `<rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/>`; pauseIconEl.setAttribute('viewBox', '0 0 16 16'); }
      if (pauseLabelEl)   pauseLabelEl.textContent = 'Pausar';
    }
  }

  btnPause?.addEventListener('click', togglePausa);
  pauseOverlay.addEventListener('click', e => { if (e.target.closest('#btn-retomar')) togglePausa(); });

  // Botão "Voltar ao início" — salva sessão para o botão Continuar
  btnVoltarIntro?.addEventListener('click', async () => {
    estado.timer?.stop();
    estado.timer   = null;
    estado.pausado = false;

    salvarSessao('intro'); // persiste antes de sair da tela de questões

    pauseOverlay.classList.add('hidden');
    const btnPauseEl   = $('btn-pause');
    const pauseIconEl  = $('pause-icon');
    const pauseLabelEl = $('pause-label');
    btnPauseEl?.classList.remove('vf-ctrl-btn--paused');
    if (pauseIconEl)  { pauseIconEl.innerHTML = `<rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/>`; pauseIconEl.setAttribute('viewBox', '0 0 16 16'); }
    if (pauseLabelEl)   pauseLabelEl.textContent = 'Pausar';

    document.documentElement.style.setProperty('--timer-pct', '100%');
    aplicarCorBarra(100);

    const timerDisplay = $('shell-timer-display');
    if (timerDisplay) {
      const t  = CONFIG.TEMPO_POR_QUESTAO;
      const mm = String(Math.floor(t / 60)).padStart(2, '0');
      const ss = String(t % 60).padStart(2, '0');
      timerDisplay.textContent = `${mm}:${ss}`;
      timerDisplay.classList.remove('game-timer-display--danger', 'game-timer-display--mid');
    }

    estado.modoRevisao  = false;
    estado.cardsRevisao = null;
    estado.tempos       = [];

    const historico = await carregarHistoricoVF(estado.usuario, estado.discId, estado.sem).catch(() => ({}));
    estado.historicoVF = historico;
    estado.perguntas   = montarDeck(estado.banco, historico);

    atualizarBtnRevisarErros(estado.banco, historico);

    // Reconfigura botão Continuar com a sessão acabada de salvar
    const sessaoParaContinuar = estado._nav?.lerSessao();
    if (sessaoParaContinuar?.perguntas?.length > 0) {
      _configurarBtnContinuar(sessaoParaContinuar);
    }

    if (estado.perguntas.length === 0) { mostrarTela('empty'); return; }
    atualizarContadores();
    mostrarTela('intro');
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
        e.preventDefault();
        estado.timer?.stop();
        irAnterior();
        break;
    }
  });
}

/* ══════════════════════════════════════════════════════════
   BOTÃO "REVISAR ERROS"
   ══════════════════════════════════════════════════════════ */

function atualizarBtnRevisarErros(banco, historico) {
  const btn = el.btnRevisarErros ?? $('btn-revisar-erros');
  if (!btn) return;

  const erradas = questoesComErro(banco, historico);
  if (erradas.length === 0) { btn.classList.add('hidden'); return; }

  const countEl = btn.querySelector('#vf-revisar-count') ?? $('vf-revisar-count');
  if (countEl) countEl.textContent = erradas.length;

  const novo = btn.cloneNode(true);
  btn.parentNode.replaceChild(novo, btn);
  el.btnRevisarErros = novo;
  novo.classList.remove('hidden');
  novo.addEventListener('click', () => iniciarJogo(true));
}

function atualizarContadores() {
  const n = estado.perguntas.length;
  if (el.scoreTotal) el.scoreTotal.textContent = n;
  if (el.qTotal)     el.qTotal.textContent     = n;
  const introTotal = $('intro-total-questoes');
  if (introTotal)    introTotal.textContent    = n;
}

/* ══════════════════════════════════════════════════════════
   BOTÃO "CONTINUAR"
   ══════════════════════════════════════════════════════════ */

function _configurarBtnContinuar(sessao) {
  const btn = document.getElementById('btn-continuar');
  if (!btn) return;

  const respondidas = sessao.respostas.filter(r => r !== undefined).length;
  const total       = sessao.perguntas.length;
  const pendentes   = sessao.respostas.filter(r => r === undefined).length;

  if (pendentes === 0) { btn.classList.add('hidden'); return; }

  const novo = btn.cloneNode(true);
  btn.parentNode.replaceChild(novo, btn);
  novo.classList.remove('hidden');

  const countEl = document.getElementById('continuar-progress');
  if (countEl) countEl.textContent = `${respondidas}/${total}`;

  novo.addEventListener('click', () => continuarSessao(sessao));
}

function continuarSessao(sessao) {
  estado.perguntas   = sessao.perguntas;
  estado.respostas   = sessao.respostas;
  estado.indice      = sessao.indice  ?? 0;
  estado.pontos      = sessao.pontos  ?? 0;
  estado.acertos     = sessao.acertos ?? 0;
  estado.erros       = sessao.erros   ?? 0;
  estado.modoRevisao = sessao.modoRevisao ?? false;
  estado.tempoInicio = Date.now();
  estado.pausado     = false;

  const temposRestaurados = sessao.tempos
    ? [...sessao.tempos]
    : new Array(sessao.perguntas.length).fill(CONFIG.TEMPO_POR_QUESTAO);

  // Reseta timer da questão onde parou (a ser justo)
  if (estado.respostas[estado.indice] === undefined) {
    temposRestaurados[estado.indice] = CONFIG.TEMPO_POR_QUESTAO;
  }
  estado.tempos = temposRestaurados;

  if (el.scoreCorrect) el.scoreCorrect.textContent = estado.acertos;
  atualizarContadores();
  mostrarTela('question');
  renderizarQuestao();
}

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */

async function init() {
  // ── 1. Captura parâmetros e inicializa shell ──────────────
  Object.assign(el, {
    screenIntro:    $('screen-intro'),
    screenQuestion: $('screen-question'),
    screenEmpty:    $('screen-empty'),
    screenResult:   $('screen-result'),
    btnStart:       $('btn-start'),
    btnRevisarErros:$('btn-revisar-erros'),
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

  const { disc, sem } = Shell.init({ icon: '⚖️', nome: 'Verdadeiro ou Falso' });

  const _listaDisciplinas = getDisciplinasDeSemestre(sem);
  const disciplina = _listaDisciplinas.find(d => d.id === disc || d.arquivo === disc) ?? null;

  // Preenche header
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

  // ── 2. Import dinâmico por ano ────────────────────────────
  const ano   = sem ? sem.split('.')[0] : null;
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
    // Remove anti-flash antes de mostrar tela vazia
    mostrarTela('empty');
    estado._nav?.pronto();

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
    return;
  }

  const usuarioObj   = getUsuario();
  estado.usuario     = usuarioObj?.uid ?? 'visitante';
  estado.discId      = disc;
  estado.sem         = sem;

  // ── 3. Cria instância do SessionNav (anti-flash já foi injetado no topo) ──
  const nav     = SessionNav.criar({
    uid:         estado.usuario,
    discId:      disc,
    sem,
    ttlMs:       CONFIG.SESSAO_TTL_MS,
    throttleMs:  CONFIG.SESSAO_THROTTLE_MS,
  });
  estado._nav = nav;

  // ── 4. Carrega histórico ──────────────────────────────────
  const historico    = await carregarHistoricoVF(estado.usuario, disc, sem).catch(() => ({}));
  estado.historicoVF = historico;
  estado.perguntas   = montarDeck(banco, historico);

  if (estado.perguntas.length === 0) {
    mostrarTela('empty');
    nav.pronto();
    const btnBack = $('btn-empty-back');
    if (btnBack) btnBack.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;
    return;
  }

  atualizarContadores();
  aplicarCorBarra(100);

  el.btnTrue     ?.addEventListener('click', () => responder(true));
  el.btnFalse    ?.addEventListener('click', () => responder(false));
  el.btnAnterior ?.addEventListener('click', irAnterior);
  el.btnProxima  ?.addEventListener('click', irProxima);

  // Botão "Revisar erros"
  const erradas = questoesComErro(banco, historico);
  if (erradas.length > 0 && el.btnRevisarErros) {
    el.btnRevisarErros.classList.remove('hidden');
    const countEl = $('vf-revisar-count');
    if (countEl) countEl.textContent = erradas.length;
    el.btnRevisarErros.addEventListener('click', () => iniciarJogo(true));
  }

  setupPausa();
  registrarAtalhos();

  // Botão Voltar do header: saída real para outra rota.
  // Salva o estado atual e marca saída intencional — o beforeunload NÃO
  // setará o stay-flag, então a próxima visita será tratada como entrada
  // nova (sem restauração automática). A sessão permanece no localStorage
  // para que o botão "Continuar" apareça ao retornar.
  const shellBackBtn = document.getElementById('shell-back-btn');
  if (shellBackBtn) {
    shellBackBtn.addEventListener('click', () => {
      salvarSessao('intro'); // persiste o estado; tela='intro' impede restauração automática
      nav.sairParaRota();    // beforeunload não setará stay-flag
    });
  }

  // Botão "Começar": descarta sessão e inicia nova partida
  el.btnStart?.addEventListener('click', () => {
    limparSessao();
    document.getElementById('btn-continuar')?.classList.add('hidden');
    iniciarJogo(false);
  });

  // ── 5. Lógica de restauração / intro ─────────────────────
  //
  // pegarRestauravel() retorna a sessão SOMENTE se foi um reload.
  // lerSessao() retorna a sessão para o botão Continuar (independente).
  //
  const sessaoRestauravel = nav.pegarRestauravel();

  if (sessaoRestauravel) {
    // RELOAD com sessão válida → restaura diretamente na questão correta
    // (sem passar pela intro, sem flash)
    continuarSessao(sessaoRestauravel);
    nav.pronto(); // remove anti-flash APÓS renderizarQuestao() ter rodado
  } else {
    // Navegação nova (ou sem sessão) → mostra intro
    const sessaoSalva = nav.lerSessao();
    if (sessaoSalva?.perguntas?.length > 0) {
      _configurarBtnContinuar(sessaoSalva);
    }
    mostrarTela('intro');
    nav.pronto(); // remove anti-flash
  }
}

// type="module" é sempre defer — verifica readyState para segurança
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}