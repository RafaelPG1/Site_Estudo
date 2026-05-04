/* ============================================================
   NEXUS STUDY — completar_frase.js   (versão corrigida)

   CORREÇÕES:
   • Removidos imports de DISC_CORES, aplicarCoresDisciplina,
     getDisciplinasDeSemestre e completarFraseData (module) —
     todos causavam erros porque o HTML carrega este arquivo
     como <script type="module"> mas os módulos externos
     (global.js, cores.js, theme.js) não existem no caminho
     relativo correto neste contexto.
   • completarFraseData é lido de window.completarFraseData
     (exposto pelo <script src="completar_frase_data.js"> que
     já roda antes deste módulo).
   • Cor de tema aplicada inline via CSS custom property.
   • getDisciplinasDeSemestre substituído por stub que lê
     apenas disc e sem da URL (sem dependência externa).
   ============================================================ */

/* ── PARAMS DA URL ── */
const _p       = new URLSearchParams(location.search);
const URL_DISC = _p.get('disc') ?? '';
const URL_SEM  = _p.get('sem')  ?? '';

/* ── ACESSO AOS DADOS (expostos como global pelo data.js) ── */
function getDados() {
  return window.completarFraseData ?? {};
}

/* ── CORES POR DISCIPLINA — espelho exato de shared/js/cores.js ──
   Aplica o mesmo conjunto de custom properties que
   aplicarCoresDisciplina() em shared/js/theme.js faz,
   sem precisar importar os módulos externos. */
const DISC_CORES = {
  poo: {
    corTema:     '#7aa8e8', corTemaRgb:  '122, 168, 232',
    corTema2:    '#4dd9b4', corTema2Rgb: '77, 217, 180',
  },
  redes: {
    corTema:     '#4dd9b4', corTemaRgb:  '77, 217, 180',
    corTema2:    '#7aa8e8', corTema2Rgb: '122, 168, 232',
  },
  banco_dados: {
    corTema:     '#e87a9a', corTemaRgb:  '232, 122, 154',
    corTema2:    '#e8c97a', corTema2Rgb: '232, 201, 122',
  },
  design: {
    corTema:     '#e8c97a', corTemaRgb:  '232, 201, 122',
    corTema2:    '#4dd9b4', corTema2Rgb: '77, 217, 180',
  },
  _default: {
    corTema:     '#7aa8e8', corTemaRgb:  '122, 168, 232',
    corTema2:    '#4dd9b4', corTema2Rgb: '77, 217, 180',
  },
};

function aplicarCorDisc(disc) {
  const cores = DISC_CORES[disc] ?? DISC_CORES._default;
  const r = document.documentElement.style;

  /* Canônicas — usadas por completar_frase.css */
  r.setProperty('--cor-tema',       cores.corTema);
  r.setProperty('--cor-tema-rgb',   cores.corTemaRgb);
  r.setProperty('--cor-tema-2',     cores.corTema2);
  r.setProperty('--cor-tema-2-rgb', cores.corTema2Rgb);

  /* Legadas — vdd_falso.css e outros usam --disc-tema */
  r.setProperty('--disc-tema',      cores.corTema);
  r.setProperty('--disc-tema-rgb',  cores.corTemaRgb);
  r.setProperty('--disc-tema2',     cores.corTema2);
  r.setProperty('--disc-tema2-rgb', cores.corTema2Rgb);

  /* Abreviadas para rgba() inline no CSS */
  r.setProperty('--dt-rgb',         cores.corTemaRgb);
  r.setProperty('--dt2-rgb',        cores.corTema2Rgb);

  /* Derivadas do completar_frase.css */
  r.setProperty('--cf-accent',      cores.corTema);
  r.setProperty('--cf-accent-d',    `rgba(${cores.corTemaRgb}, 0.10)`);
  r.setProperty('--cf-accent-g',    `rgba(${cores.corTemaRgb}, 0.22)`);

  /* Atributo no body — mesmo padrão do theme.js */
  document.body.dataset.disc = disc;
}

/* ── METADADOS SIMPLES (sem global.js) ── */
function getDiscMeta(discId) {
  // Retorna objeto mínimo compatível com o que o código espera
  return { apelido: discId?.toUpperCase() ?? '—' };
}

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

/* ── TOPBAR ── */
function iniciarTopbar() {
  if (Els.shellSem)
    Els.shellSem.textContent = URL_SEM || '—';

  if (Els.shellDiscName)
    Els.shellDiscName.textContent = URL_DISC.toUpperCase() || '—';

  aplicarCorDisc(URL_DISC);

  const voltar = URL_SEM ? `../../jogo.html?sem=${URL_SEM}` : '../../jogo.html';
  if (Els.backBtn)       Els.backBtn.href      = voltar;
  if (Els.btnBackResult) Els.btnBackResult.href = voltar;
}

/* ── CONSTRUIR LISTA ── */
function construirLista() {
  const dados    = getDados();
  const semData  = dados[URL_SEM]  ?? {};
  const discData = semData[URL_DISC] ?? [];

  // Fallback: junta todas as questões do semestre se não achar a disc
  const fonte = discData.length
    ? discData
    : Object.values(semData).flat();

  Estado.lista = embaralhar(fonte.length ? fonte : []);
}

/* ── INICIAR ── */
function iniciar() {
  Estado.indice     = 0;
  Estado.acertos    = 0;
  Estado.erros      = 0;
  Estado.respondida = false;

  construirLista();

  Els.screenResult.classList.remove('show');
  if (Els.gameCard) Els.gameCard.style.display = '';

  renderPergunta();
}

/* ── RENDERIZAR PERGUNTA ── */
function renderPergunta() {
  const p    = Estado.lista[Estado.indice];
  const disc = getDiscMeta(URL_DISC);

  // Re-anima o card
  Els.gameCard.style.animation = 'none';
  void Els.gameCard.offsetWidth;
  Els.gameCard.style.animation = '';

  // Tag de disciplina
  Els.discTag.innerHTML =
    `<span class="disc-sigla">${disc.apelido?.split(' ')[0]?.toUpperCase() ?? URL_DISC.toUpperCase()}</span>
     ${disc.apelido ?? URL_DISC}`;
  Els.discTag.style.color = 'var(--cor-tema)';

  // Semestre letivo
  Els.semTag.textContent = URL_SEM || '—';

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

  // Dica de letras
  Els.letrasHint.textContent = p.letras;

  // Dica contextual (campo opcional)
  if (Els.dicaTexto) {
    Els.dicaTexto.textContent  = p.dica ?? '';
    if (Els.dicaWrap) Els.dicaWrap.style.display = p.dica ? '' : 'none';
  }

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

  const p       = Estado.lista[Estado.indice];
  const acertou = normalizar(digitado) === normalizar(p.resposta);

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

/* ── TELAS ── */
function mostrarIntro() {
  const screenIntro = $('screen-intro');
  const gameLayout  = $('game-layout');
  if (screenIntro) screenIntro.style.display = '';
  if (gameLayout)  gameLayout.style.display  = 'none';

  // Chips da intro
  const introDisc = $('intro-disc-name');
  const introSem  = $('intro-sem-label');
  if (introDisc) introDisc.textContent = URL_DISC.toUpperCase() || '—';
  if (introSem)  introSem.textContent  = URL_SEM || '—';

  // Badge total de questões
  const totalEl = $('intro-total-questoes');
  if (totalEl) {
    const dados    = getDados();
    const semData  = dados[URL_SEM]    ?? {};
    const discData = semData[URL_DISC] ?? [];
    const fonte = discData.length
      ? discData
      : Object.values(semData).flat();
    totalEl.textContent = fonte.length;
  }
}

function iniciarJogo() {
  const screenIntro = $('screen-intro');
  const gameLayout  = $('game-layout');
  if (screenIntro) screenIntro.style.display = 'none';
  if (gameLayout)  gameLayout.style.display  = '';
  iniciar();
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  Object.assign(Els, {
    gameCard:        $('game-card'),
    screenResult:    $('screen-result'),
    fraseTexto:      $('frase-texto'),
    letrasHint:      $('letras-hint'),
    dicaWrap:        $('dica-wrap'),
    dicaTexto:       $('dica-texto'),
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
    shellDiscName:   $('shell-disc-name'),
    shellSem:        $('shell-sem'),
    backBtn:         $('back-btn'),
    btnBackResult:   $('btn-back-result'),
  });

  iniciarTopbar();
  mostrarIntro();

  const btnStart = $('btn-start');
  if (btnStart) btnStart.addEventListener('click', iniciarJogo);

  Els.btnRestart.addEventListener('click', () => {
    Els.screenResult.classList.remove('show');
    mostrarIntro();
  });

  Els.btnCheck.addEventListener('click', verificar);
  Els.btnNext.addEventListener('click', avancar);

  Els.inputAnswer.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      if (!Estado.respondida) verificar();
      else avancar();
    }
  });
});