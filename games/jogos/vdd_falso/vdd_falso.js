/* ============================================================
   NEXUS STUDY — games/jogos/vdd_falso/vdd_falso.js  (v2)

   Mecânica do jogo Verdadeiro ou Falso.
   Padrão idêntico ao flashcard.js:
     • Lê ?disc=&sem= da URL via lerParams()
     • Inicializa o Shell (header + cores da disciplina)
     • Usa Timer do game-shell.js para o contador regressivo
     • Usa Result do game-shell.js para a tela final
   ============================================================ */

import { Shell, Timer, Result, shuffle, lerParams } from '../../template/game-shell.js';
import { VDD_FALSO_DATA }                           from '../../conteudo/vdd_falso/vdd_falso_data.js';

/* ══════════════════════════════════════════════════════════
   CONFIGURAÇÃO
   ══════════════════════════════════════════════════════════ */

const CONFIG = {
  TEMPO_POR_QUESTAO: 30,   // segundos por pergunta
  PONTOS_ACERTO:     10,
  PONTOS_ERRO:        5,   // desconto (aplicado como subtração)
  MAX_QUESTOES:       8,
  DELAY_PROXIMA:   1500,   // ms antes de avançar para a próxima
};

/* ══════════════════════════════════════════════════════════
   ESTADO
   ══════════════════════════════════════════════════════════ */

const estado = {
  perguntas:   [],
  indice:      0,
  pontos:      0,
  acertos:     0,
  erros:       0,
  respondido:  false,
  timer:       null,
};

/* ══════════════════════════════════════════════════════════
   ATALHOS DE DOM
   ══════════════════════════════════════════════════════════ */

const $ = id => document.getElementById(id);

const el = {
  screenIntro:    $('screen-intro'),
  screenQuestion: $('screen-question'),
  screenEmpty:    $('screen-empty'),

  btnStart:       $('btn-start'),
  btnTrue:        $('btn-true'),
  btnFalse:       $('btn-false'),

  qCurrent:       $('q-current'),
  qTotal:         $('q-total'),
  qBadge:         $('q-badge'),
  questionText:   $('question-text'),
  questionCard:   $('question-card'),
  progressFill:   $('progress-fill'),

  feedbackArea:   $('feedback-area'),
  feedbackMsg:    $('feedback-msg'),
  feedbackExp:    $('feedback-explicacao'),

  scoreCorrect:   $('score-correct'),
  scoreTotal:     $('score-total'),
};

/* ══════════════════════════════════════════════════════════
   HELPERS DE TELA
   ══════════════════════════════════════════════════════════ */

function mostrarTela(nome) {
  el.screenIntro   ?.classList.add('hidden');
  el.screenQuestion?.classList.add('hidden');
  el.screenEmpty   ?.classList.add('hidden');

  if (nome === 'intro')    el.screenIntro   ?.classList.remove('hidden');
  if (nome === 'question') el.screenQuestion?.classList.remove('hidden');
  if (nome === 'empty')    el.screenEmpty   ?.classList.remove('hidden');
}

/* ══════════════════════════════════════════════════════════
   FLUXO DO JOGO
   ══════════════════════════════════════════════════════════ */

function iniciarJogo() {
  estado.indice     = 0;
  estado.pontos     = 0;
  estado.acertos    = 0;
  estado.erros      = 0;
  estado.respondido = false;

  if (el.scoreCorrect) el.scoreCorrect.textContent = 0;

  mostrarTela('question');
  carregarQuestao();
}

function carregarQuestao() {
  const pergunta = estado.perguntas[estado.indice];
  estado.respondido = false;

  const num = estado.indice + 1;
  if (el.qCurrent)     el.qCurrent.textContent     = num;
  if (el.qBadge)       el.qBadge.textContent        = `Q${num}`;
  if (el.questionText) el.questionText.textContent  = pergunta.enunciado;

  // Barra de progresso
  const pct = (estado.indice / estado.perguntas.length) * 100;
  if (el.progressFill) el.progressFill.style.width = pct + '%';

  // Limpa estado visual anterior
  if (el.questionCard) {
    el.questionCard.className = 'vf-question-card game-card-base';
    void el.questionCard.offsetWidth; // force reflow para re-triggar animação CSS
    el.questionCard.classList.add('vf-question-card--enter');
  }

  if (el.btnTrue)  { el.btnTrue.className  = 'vf-btn vf-btn--true';  el.btnTrue.disabled  = false; }
  if (el.btnFalse) { el.btnFalse.className = 'vf-btn vf-btn--false'; el.btnFalse.disabled = false; }
  if (el.feedbackArea) el.feedbackArea.classList.add('hidden');

  // Cria timer da questão
  if (estado.timer) estado.timer.stop();

  estado.timer = Timer.criar({
    total: CONFIG.TEMPO_POR_QUESTAO,
    onEnd: () => {
      if (!estado.respondido) processarResposta(null); // tempo esgotado
    },
  });

  estado.timer.start();
}

function responder(valor) {
  if (estado.respondido) return;
  estado.timer?.stop();
  processarResposta(valor);
}

function processarResposta(resposta) {
  estado.respondido = true;

  const pergunta = estado.perguntas[estado.indice];
  const correto  = resposta === pergunta.resposta;

  // Destaca botão selecionado
  if (resposta !== null) {
    const btnSel = resposta ? el.btnTrue : el.btnFalse;
    btnSel?.classList.add(correto ? 'vf-btn--selected-correct' : 'vf-btn--selected-wrong');
  }

  // Revela a resposta correta se errou ou tempo esgotou
  if (!correto) {
    const btnCorreto = pergunta.resposta ? el.btnTrue : el.btnFalse;
    btnCorreto?.classList.add('vf-btn--reveal-correct');
  }

  if (el.btnTrue)  el.btnTrue.disabled  = true;
  if (el.btnFalse) el.btnFalse.disabled = true;

  // Feedback visual no card
  if (el.questionCard) {
    el.questionCard.classList.add(correto ? 'vf-question-card--correct' : 'vf-question-card--wrong');
    if (!correto) {
      void el.questionCard.offsetWidth;
      el.questionCard.classList.add('vf-question-card--shake');
    }
  }

  // Mensagem de feedback
  const sufTempo = resposta === null ? ' (tempo esgotado)' : '';
  if (el.feedbackMsg) {
    el.feedbackMsg.className = `game-feedback ${correto ? 'game-feedback--correct' : 'game-feedback--wrong'}`;
    el.feedbackMsg.textContent = correto
      ? `✓ Correto! +${CONFIG.PONTOS_ACERTO} pontos`
      : `✗ Incorreto${sufTempo}! -${CONFIG.PONTOS_ERRO} pontos`;
  }
  if (el.feedbackExp) el.feedbackExp.textContent = pergunta.explicacao;
  el.feedbackArea?.classList.remove('hidden');

  // Atualiza placar
  if (correto) {
    estado.pontos  += CONFIG.PONTOS_ACERTO;
    estado.acertos += 1;
  } else {
    estado.pontos  -= CONFIG.PONTOS_ERRO;
    estado.erros   += 1;
  }
  if (estado.pontos < 0) estado.pontos = 0;

  if (el.scoreCorrect) el.scoreCorrect.textContent = estado.acertos;

  // Avança ou finaliza
  setTimeout(() => {
    estado.indice++;
    if (estado.indice < estado.perguntas.length) {
      carregarQuestao();
    } else {
      finalizarJogo();
    }
  }, CONFIG.DELAY_PROXIMA);
}

function finalizarJogo() {
  const total = estado.perguntas.length;
  const pct   = Math.round((estado.acertos / total) * 100);

  let emoji, titulo, subtitulo;

  if (pct >= 80) {
    emoji     = '🏆';
    titulo    = 'Excelente!';
    subtitulo = 'Você domina este conteúdo. Continue assim!';
  } else if (pct >= 50) {
    emoji     = '👍';
    titulo    = 'Bom trabalho!';
    subtitulo = 'Você está no caminho certo. Revise os erros e tente novamente.';
  } else {
    emoji     = '📚';
    titulo    = 'Pode melhorar!';
    subtitulo = 'Não desanime — revise o material e tente de novo!';
  }

  Result.mostrar({
    emoji,
    titulo,
    subtitulo,
    stats: [
      { label: 'Pontos',   valor: estado.pontos  },
      { label: 'Acertos',  valor: estado.acertos },
      { label: 'Erros',    valor: estado.erros   },
      { label: 'Precisão', valor: pct + '%'       },
    ],
    onRejogo: () => {
      const { disc } = lerParams();
      const banco = VDD_FALSO_DATA[disc] ?? [];
      estado.perguntas = shuffle(banco).slice(0, CONFIG.MAX_QUESTOES);
      iniciarJogo();
    },
  });
}

/* ══════════════════════════════════════════════════════════
   ATALHOS DE TECLADO
   V / 1 → Verdadeiro    F / 2 → Falso
   ══════════════════════════════════════════════════════════ */

function registrarAtalhos() {
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (estado.respondido) return;

    switch (e.key) {
      case 'v': case 'V': case '1':
        e.preventDefault(); responder(true);  break;
      case 'f': case 'F': case '2':
        e.preventDefault(); responder(false); break;
    }
  });
}

/* ══════════════════════════════════════════════════════════
   INICIALIZAÇÃO — padrão idêntico ao flashcard
   ══════════════════════════════════════════════════════════ */

function init() {
  // Shell lê ?disc=&sem= e aplica cores + preenche header
  Shell.init({ icon: '⚡', nome: 'Verdadeiro ou Falso' });

  const { disc } = lerParams();
  const banco = VDD_FALSO_DATA[disc] ?? [];

  if (banco.length === 0) {
    mostrarTela('empty');
    const { sem } = lerParams();
    const btnBack = $('btn-empty-back');
    if (btnBack) btnBack.href = `../../jogo.html${sem ? `?sem=${sem}` : ''}`;
    return;
  }

  // Monta deck embaralhado
  estado.perguntas = shuffle(banco).slice(0, CONFIG.MAX_QUESTOES);

  if (el.scoreTotal) el.scoreTotal.textContent = estado.perguntas.length;
  if (el.qTotal)     el.qTotal.textContent     = estado.perguntas.length;

  // Eventos
  el.btnStart?.addEventListener('click', iniciarJogo);
  el.btnTrue ?.addEventListener('click', () => responder(true));
  el.btnFalse?.addEventListener('click', () => responder(false));

  registrarAtalhos();
}

// Boot: aguarda DOM pronto (padrão do flashcard)
document.addEventListener('DOMContentLoaded', init);