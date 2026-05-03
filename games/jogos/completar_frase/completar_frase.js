/* ============================================================
   NEXUS STUDY — completar_frase.js
   Disciplina e semestre letivo vêm EXCLUSIVAMENTE da URL:
     ?disc=poo&sem=2026.2  (passados pelo jogo.js)
   Sem filtros internos — o jogo.js já fez a seleção.
   ============================================================ */

/* ── IMPORTS DE TEMA ── */
import { DISC_CORES }              from '../../../shared/js/cores.js';
import { aplicarCoresDisciplina }  from '../../../shared/js/theme.js';

/* ── PARAMS DA URL ── */
const _p       = new URLSearchParams(location.search);
const URL_DISC = _p.get('disc') ?? '';
const URL_SEM  = _p.get('sem')  ?? '';

/* ── ESTADO ── */
const Estado = {
  lista:      [],
  indice:     0,
  acertos:    0,
  erros:      0,
  respondida: false,
};

/* ── SELETORES ── */
const $ = id => document.getElementById(id);

// Els é preenchido no DOMContentLoaded (como o VDD faz),
// garantindo que todos os getElementById encontrem o DOM pronto.
const Els = {};

/* ── UTILS ── */
function embaralhar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizar(txt) {
  return txt.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9/]/g, '')
    .trim();
}

/* ── APLICAR COR DA DISCIPLINA ── */
function aplicarCorDisc(disc) {
  aplicarCoresDisciplina(disc, DISC_CORES);
}

/* ── TOPBAR: exibe disciplina e semestre da URL ── */
function iniciarTopbar() {
  if (Els.shellSem)
    Els.shellSem.textContent = URL_SEM || '—';

  if (Els.shellDiscName) {
    const disc = DISCIPLINAS[URL_DISC];
    Els.shellDiscName.textContent = disc
      ? `${disc.emoji ?? ''} ${disc.apelido}`.trim()
      : URL_DISC || '—';
  }

  aplicarCorDisc(URL_DISC);

  const voltar = URL_SEM ? `../../jogo.html?sem=${URL_SEM}` : '../../jogo.html';
  if (Els.backBtn)       Els.backBtn.href       = voltar;
  if (Els.btnBackResult) Els.btnBackResult.href  = voltar;
}

/* ── CONSTRUIR LISTA ── */
function construirLista() {
  // Filtra apenas pela disciplina da URL
  const fonte = (URL_DISC && URL_DISC !== 'all')
    ? perguntas.filter(p => p.disciplina === URL_DISC)
    : perguntas;

  // Fallback: se disc não bater com nenhuma pergunta, usa tudo
  Estado.lista = embaralhar(fonte.length ? fonte : perguntas);
}

/* ── INICIAR ── */
function iniciar() {
  Estado.indice     = 0;
  Estado.acertos    = 0;
  Estado.erros      = 0;
  Estado.respondida = false;

  construirLista();

  Els.screenResult.classList.remove('show');
  Els.gameCard.style.display = '';

  renderPergunta();
}

/* ── RENDERIZAR PERGUNTA ── */
function renderPergunta() {
  const p = Estado.lista[Estado.indice];

  // Re-anima o card
  Els.gameCard.style.animation = 'none';
  void Els.gameCard.offsetWidth;
  Els.gameCard.style.animation = '';

  // Disciplina tag no card
  const disc = DISCIPLINAS[p.disciplina] ?? {};
  Els.discTag.innerHTML =
    `<span class="disc-sigla">${disc.sigla ?? p.disciplina.toUpperCase()}</span>
     ${disc.apelido ?? p.disciplina}`;
  Els.discTag.style.color = 'var(--cor-tema)';

  // Semestre das questões (1º, 2º…)
  Els.semTag.textContent = SEMESTRES[p.semestre] ?? `${p.semestre}º Sem.`;

  // Nível
  const nk = normalizar(p.nivel);
  Els.nivelTag.textContent = p.nivel;
  Els.nivelTag.className   = `nivel-tag ${nk === 'facil' ? 'facil' : nk === 'medio' ? 'medio' : 'dificil'}`;

  // Número da questão
  Els.questionNum.textContent = `QUESTÃO ${String(Estado.indice + 1).padStart(2, '0')}`;

  // Frase com lacuna destacada
  Els.fraseTexto.innerHTML = p.frase.replace(
    '______',
    '<span class="lacuna">______</span>'
  );

  // Dica
  Els.letrasHint.textContent = p.letras;

  // Reset input
  Els.inputAnswer.value     = '';
  Els.inputAnswer.className = 'input-answer';
  Els.inputAnswer.disabled  = false;
  Els.inputAnswer.focus();

  // Reset controles
  Els.btnCheck.disabled      = false;
  Els.feedbackLine.className = 'feedback-line';
  Els.btnNext.className      = 'btn-next';

  atualizarMeta();
  Estado.respondida = false;
}

/* ── VERIFICAR ── */
function verificar() {
  if (Estado.respondida) return;

  const digitado = Els.inputAnswer.value.trim();
  if (!digitado) {
    Els.inputAnswer.classList.add('shake');
    Els.inputAnswer.addEventListener('animationend',
      () => Els.inputAnswer.classList.remove('shake'), { once: true });
    return;
  }

  Estado.respondida        = true;
  Els.inputAnswer.disabled = true;
  Els.btnCheck.disabled    = true;

  const p        = Estado.lista[Estado.indice];
  const acertou  = normalizar(digitado) === normalizar(p.resposta);

  if (acertou) {
    Estado.acertos++;
    Els.inputAnswer.classList.add('state-ok');
    Els.feedbackLine.className = 'feedback-line ok show';
    Els.feedbackLine.innerHTML = `<span class="feedback-icon">✓</span> Resposta correta.`;
  } else {
    Estado.erros++;
    Els.inputAnswer.classList.add('state-err');
    Els.feedbackLine.className = 'feedback-line err show';
    Els.feedbackLine.innerHTML =
      `<span class="feedback-icon">✗</span> Resposta correta: <span class="fb-answer">${p.resposta}</span>`;
  }

  atualizarMeta();

  const ultima = Estado.indice >= Estado.lista.length - 1;
  Els.btnNext.innerHTML = ultima
    ? 'Ver resultado <span class="arrow">→</span>'
    : 'Próxima questão <span class="arrow">→</span>';
  Els.btnNext.classList.add('show');
}

/* ── AVANÇAR ── */
function avancar() {
  Estado.indice++;
  Estado.indice >= Estado.lista.length ? mostrarResultado() : renderPergunta();
}

/* ── META ── */
function atualizarMeta() {
  const total  = Estado.lista.length;
  const feitas = Estado.indice + (Estado.respondida ? 1 : 0);
  const pct    = total > 0 ? (feitas / total) * 100 : 0;

  Els.progressFill.style.width  = pct + '%';
  Els.progressLabel.textContent = `${feitas} / ${total}`;
  Els.progressPct.textContent   = Math.round(pct) + '%';
  Els.chipOk.textContent        = `✓ ${Estado.acertos}`;
  Els.chipErr.textContent       = `✗ ${Estado.erros}`;
}

/* ── RESULTADO ── */
function mostrarResultado() {
  Els.gameCard.style.display   = 'none';
  Els.progressFill.style.width = '100%';

  const total = Estado.lista.length;
  const pct   = total > 0 ? Math.round((Estado.acertos / total) * 100) : 0;

  Els.resultPct.textContent = pct + '%';

  const msgs = [
    [100, 'Domínio completo.',   'Todas as respostas corretas. Excelente performance.'],
    [80,  'Muito bom.',          'Desempenho acima da média. Continue assim.'],
    [60,  'Satisfatório.',       'Revise os conceitos com dificuldade.'],
    [40,  'Em desenvolvimento.', 'Retome o material das disciplinas.'],
    [0,   'Precisa revisar.',    'Dedique mais tempo ao conteúdo estudado.'],
  ];
  const [, titulo, sub] = msgs.find(([min]) => pct >= min);
  Els.resultTitle.textContent = titulo;
  Els.resultSub.textContent   = sub;
  Els.resultOk.textContent    = Estado.acertos;
  Els.resultErr.textContent   = Estado.erros;

  // Anel SVG animado
  const cor = pct >= 70 ? '#22d3a5' : pct >= 40 ? '#f59e0b' : '#f06060';
  const dashOffset = 339.3 * (1 - pct / 100);
  Els.ringFill.style.stroke = cor;
  Els.ringFill.style.filter = `drop-shadow(0 0 8px ${cor})`;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      Els.ringFill.style.strokeDashoffset = dashOffset;
    })
  );

  Els.screenResult.classList.add('show');
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  // Preenche Els aqui, com DOM garantido (padrão VDD)
  Object.assign(Els, {
    gameCard:        $('game-card'),
    screenResult:    $('screen-result'),
    fraseTexto:      $('frase-texto'),
    letrasHint:      $('letras-hint'),
    discTag:         $('disc-tag'),
    nivelTag:        $('nivel-tag'),
    semTag:          $('sem-tag'),
    questionNum:     $('question-num'),
    inputAnswer:     $('input-answer'),
    btnCheck:        $('btn-check'),
    feedbackLine:    $('feedback-line'),
    btnNext:         $('btn-next'),
    chipOk:          $('chip-ok'),
    chipErr:         $('chip-err'),
    progressFill:    $('progress-fill'),
    progressLabel:   $('progress-label'),
    progressPct:     $('progress-pct'),
    resultPct:       $('result-pct'),
    resultTitle:     $('result-title'),
    resultSub:       $('result-sub'),
    resultOk:        $('result-ok'),
    resultErr:       $('result-err'),
    btnRestart:      $('btn-restart'),
    ringFill:        $('ring-fill'),
    shellDiscName: $('shell-disc-name'),
shellSem:      $('shell-sem'),
    backBtn:         $('back-btn'),
    btnBackResult:   $('btn-back-result'),
  });

  iniciarTopbar();
  iniciar();

  Els.btnCheck.addEventListener('click', verificar);
  Els.btnNext.addEventListener('click', avancar);
  Els.btnRestart.addEventListener('click', iniciar);

  Els.inputAnswer.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      if (!Estado.respondida) verificar();
      else avancar();
    }
  });
});