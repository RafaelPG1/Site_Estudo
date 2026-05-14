/* ============================================================
   NEXUS STUDY — completar_frase.js  (v3)

   MUDANÇAS v3:
   • Jogo limitado a MAX_QUESTOES (6) questões por partida
   • Progresso, bolinhas e resultado sincronizados com 6 questões
   • Botão "Dica" opera exclusivamente nos tips[] da questão atual
   • Anti-repeat: não repete a mesma dica consecutivamente
   • Animação da dica re-triggerada via classe CSS a cada clique
   • Reset completo de dica (texto + classe + índice) ao trocar questão
   • Removida atribuição duplicada de fraseTexto.innerHTML
   • Intro badge exibe MAX_QUESTOES (não o total do deck)

   DEPENDÊNCIAS:
   • DISC_CORES importado de shared/js/cores.js
   • completarFraseData lido de window.completarFraseData
     (exposto pelo <script src="completar_frase_data.js"> que
     já roda antes deste módulo).
   ============================================================ */

/* ── PARAMS DA URL ── */
const _p       = new URLSearchParams(location.search);
const URL_DISC = _p.get('disc') ?? '';
const URL_SEM  = _p.get('sem')  ?? '';

/* ── ACESSO AOS DADOS (expostos como global pelo data.js) ── */
function getDados() {
  return window.completarFraseData ?? {};
}

import { DISC_CORES }                from '../../../shared/js/cores.js';
import { getDisciplinasDeSemestre } from '../../../src/global.js';

/* ── SESSION NAV INLINE ─────────────────────────────────────────
   Substitui o import de SessionNav por implementação local robusta.
   Usa sessionStorage para sobreviver a F5/Ctrl+R na mesma aba
   e localStorage para persistência entre sessões (botão Continuar).

   Estratégia anti-loop:
   • Ao salvar, grava também um flag de "reload esperado" em
     sessionStorage com timestamp. Se o próximo load ocorrer dentro
     de 5 s E o flag existir, é considerado reload → restaura.
   • beforeunload seta o flag; pagehide confirma.
   • sairParaRota() remove o flag → próximo load é entrada nova.
   ─────────────────────────────────────────────────────────── */
const _SN = (() => {
  let _uid = '', _discId = '', _sem = '';

  const _lsKey  = () => `nexus_cf_sess_${_discId}_${_sem}`;
  const _ssKey  = () => `nexus_cf_snap_${_discId}_${_sem}`;
  const _flgKey = () => `nexus_cf_reload_${_discId}_${_sem}`;

  function criar({ uid = 'visitante', discId = '', sem = '' } = {}) {
    _uid    = uid;
    _discId = discId;
    _sem    = sem;
    return api;
  }

  /** Persiste snapshot no sessionStorage (reload-safe) e localStorage (cross-session). */
  function salvar(snap) {
    const payload = JSON.stringify({ ...snap, ts: Date.now() });
    try { sessionStorage.setItem(_ssKey(), payload); } catch {}
    try { localStorage.setItem(_lsKey(), payload);   } catch {}
  }

  let _throttleTimer = null;
  function salvarThrottled(snap) {
    if (_throttleTimer) return;
    _throttleTimer = setTimeout(() => {
      salvar(snap);
      _throttleTimer = null;
    }, 800);
  }

  function limpar() {
    try { sessionStorage.removeItem(_ssKey()); } catch {}
    try { localStorage.removeItem(_lsKey());   } catch {}
    try { sessionStorage.removeItem(_flgKey()); } catch {}
  }

  /** Lê sessão do localStorage (botão "Continuar", cross-session). */
  function lerSessao() {
    try {
      const raw = localStorage.getItem(_lsKey());
      if (!raw) return null;
      const obj = JSON.parse(raw);
      // TTL 24 h
      if (Date.now() - (obj.ts ?? 0) > 86_400_000) { limpar(); return null; }
      return obj;
    } catch { return null; }
  }

  /** Retorna snapshot restaurável APENAS se for reload da mesma aba.
      Detecta reload pela presença de sessionStorage + flag de reload. */
  function pegarRestauravel() {
    try {
      // Flag de reload: setado em beforeunload/pagehide
      const flgRaw = sessionStorage.getItem(_flgKey());
      if (!flgRaw) return null;
      const flg = JSON.parse(flgRaw);
      // Flag válido por 10 s (tempo mais que suficiente para o browser recarregar)
      if (Date.now() - (flg.ts ?? 0) > 10_000) {
        sessionStorage.removeItem(_flgKey());
        return null;
      }
      // Consome o flag imediatamente para não restaurar em cargas futuras
      sessionStorage.removeItem(_flgKey());

      // Lê snapshot do sessionStorage (mais fresco que localStorage)
      const raw = sessionStorage.getItem(_ssKey())
               ?? localStorage.getItem(_lsKey());
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }

  /** Marca que a PRÓXIMA carga desta aba deve ser tratada como reload. */
  function _setReloadFlag() {
    try {
      sessionStorage.setItem(_flgKey(), JSON.stringify({ ts: Date.now() }));
    } catch {}
  }

  /** Chamado ao sair para outra rota (não reload). Remove flag para que
      o próximo load seja tratado como entrada nova. */
  function sairParaRota() {
    try { sessionStorage.removeItem(_flgKey()); } catch {}
  }

  /** Chamado após a inicialização — noop nesta implementação. */
  function pronto() {}

  const api = { criar, salvar, salvarThrottled, limpar, lerSessao,
                pegarRestauravel, sairParaRota, pronto, _setReloadFlag };
  return api;
})();


function aplicarCorDisc(disc) {
  const cores = DISC_CORES[disc] ?? DISC_CORES._default;
  const r = document.documentElement.style;

  r.setProperty('--cor-tema',       cores.corTema);
  r.setProperty('--cor-tema-rgb',   cores.corTemaRgb);
  r.setProperty('--cor-tema-2',     cores.corTema2);
  r.setProperty('--cor-tema-2-rgb', cores.corTema2Rgb);

  r.setProperty('--disc-tema',      cores.corTema);
  r.setProperty('--disc-tema-rgb',  cores.corTemaRgb);
  r.setProperty('--disc-tema2',     cores.corTema2);
  r.setProperty('--disc-tema2-rgb', cores.corTema2Rgb);

  r.setProperty('--dt-rgb',         cores.corTemaRgb);
  r.setProperty('--dt2-rgb',        cores.corTema2Rgb);

  r.setProperty('--cf-accent',      cores.corTema);
  r.setProperty('--cf-accent-d',    `rgba(${cores.corTemaRgb}, 0.10)`);
  r.setProperty('--cf-accent-g',    `rgba(${cores.corTemaRgb}, 0.22)`);

  document.body.dataset.disc = disc;
}

/* ── SEMESTRES CONHECIDOS ── */
const _SEMESTRES_CONHECIDOS = ['2026.2', '2026.1', '2027.1'];

/* ── METADADOS DA DISCIPLINA ── */
function getDiscMeta(discId) {
  const semestres = [URL_SEM, ..._SEMESTRES_CONHECIDOS.filter(s => s !== URL_SEM)];
  for (const sem of semestres) {
    const lista = getDisciplinasDeSemestre(sem);
    const found = lista.find(d => d.id === discId);
    if (found) return found;
  }
  return { apelido: discId?.toUpperCase() ?? '—', emoji: '' };
}

/* ── TIMER ── */
const TIMER_TOTAL  = 30;
const TIMER_WARN   = 10;
const TIMER_DANGER = 5;

let _timerInterval = null;
let _timerRestante = TIMER_TOTAL;

function timerStart() {
  timerClear();
  _timerRestante = TIMER_TOTAL;
  timerRender(_timerRestante);

  _timerInterval = setInterval(() => {
    _timerRestante--;
    timerRender(_timerRestante);
    salvarSessaoThrottled(); // salva progresso a cada tick (throttled)
    if (_timerRestante <= 0) {
      timerClear();
      timerExpirou();
    }
  }, 1000);
}

function timerClear() {
  if (_timerInterval) { clearInterval(_timerInterval); _timerInterval = null; }
}

function timerRender(seg) {
  const fill = document.getElementById('timer-bar-fill');
  const num  = document.getElementById('timer-num');
  if (!fill || !num) return;

  fill.style.width = (seg / TIMER_TOTAL * 100) + '%';
  num.textContent  = seg;

  const warn   = seg <= TIMER_WARN   && seg > TIMER_DANGER;
  const danger = seg <= TIMER_DANGER;

  fill.classList.toggle('timer--warn',   warn);
  fill.classList.toggle('timer--danger', danger);
  num.classList.toggle('timer--warn',    warn);
  num.classList.toggle('timer--danger',  danger);
}

function timerExpirou() {
  if (Estado.respondida) return;

  Estado.respondida        = true;
  Els.inputAnswer.disabled = true;
  Els.btnCheck.disabled    = true;

  const p = Estado.lista[Estado.indice];
  Els.inputAnswer.value = 'null';
  Els.inputAnswer.classList.add('state-err');
  Els.feedbackLine.className = 'feedback-line err show';
  Els.feedbackLine.innerHTML =
    `<span class="feedback-icon">⏱</span> Tempo esgotado — resposta: <span class="fb-answer">${p.resposta}</span>`;

  if (!Estado.historico[Estado.indice]) {
    Estado.erros++;
    Estado.historico[Estado.indice] = { digitado: '', acertou: false };
    // Registra timeout como erro no histórico de revisão
    const questaoId = Estado.lista[Estado.indice]?.id;
    if (questaoId) registrarNoHistorico(questaoId, false);
  }

  atualizarMeta();

  Els.btnNext.innerHTML = Estado.indice >= Estado.lista.length - 1
    ? 'Ver resultado <span class="arrow">→</span>'
    : 'Próxima <span class="arrow">→</span>';
  Els.btnNext.disabled = false;
}


/* ── PAUSA ── */
let _pausado = false;

/* ── FLAG: usuário está na tela de intro ──
   Setado true pelo botão Home e mostrarIntro().
   Setado false ao iniciar/continuar jogo.
   Usado pelo beforeunload para NÃO sobrescrever
   a sessão com tela='question' quando o F5 é
   dado enquanto o usuário está na intro. */
let _naIntro = true;

function pausar() {
  if (_pausado || Estado.respondida) return;
  _pausado = true;
  timerClear();
  const overlay  = document.getElementById('pause-overlay');
  const btnPause = document.getElementById('btn-pause');
  if (overlay)  overlay.classList.remove('hidden');
  if (btnPause) btnPause.classList.add('btn-icon-ctrl--active');
}

function retomar() {
  if (!_pausado) return;
  _pausado = false;
  const overlay  = document.getElementById('pause-overlay');
  const btnPause = document.getElementById('btn-pause');
  if (overlay)  overlay.classList.add('hidden');
  if (btnPause) btnPause.classList.remove('btn-icon-ctrl--active');
  // Retoma o timer somente se a questão não foi respondida
  if (!Estado.respondida) {
    _timerInterval = setInterval(() => {
      _timerRestante--;
      timerRender(_timerRestante);
      salvarSessaoThrottled();
      if (_timerRestante <= 0) {
        timerClear();
        timerExpirou();
      }
    }, 1000);
  }
}

/* ── ESTADO ── */
const Estado = {
  lista:        [],
  banco:        [],      // banco completo da disciplina (para revisar erros)
  indice:       0,
  acertos:      0,
  erros:        0,
  respondida:   false,
  historico:    [],      // [{digitado, acertou}] por índice da sessão atual
  historicoRevisao: {}, // {[id]: {tentativas, acertos, erros, acertosConsecutivos}} persistido em localStorage
  modoRevisao:  false,
  cardsRevisao: null,

  _nav: null,   // instância do SessionNav — criada no DOMContentLoaded
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

/* ── HISTORICO DE REVISÃO (localStorage) ────────────────────
   Persiste {[questaoId]: {tentativas, acertos, erros, acertosConsecutivos}}
   usando localStorage — sobrevive a fechamento de aba, voltar/avançar,
   reload e qualquer navegação. É a única fonte de verdade para
   o botão "Revisar erros".
   ─────────────────────────────────────────────────────────── */
const _HIST_KEY    = () => `nexus_cf_${URL_DISC}_${URL_SEM}`;

/* ── SESSÃO "CONTINUAR" (sessionStorage) ─────────────────────
   Armazena o progresso da partida atual para permitir continuar
   após reload ou navegação dentro da mesma aba.

   Chave isolada por módulo + disc + sem para não colidir com
   o V/F ou outros módulos.

   TTL: 24 h — sessões expiradas são descartadas silenciosamente.
   ─────────────────────────────────────────────────────────── */

/** Captura o snapshot completo do estado atual da partida. */
function _snapshotEstado(tela = 'question') {
  // O SessionNav exige 'perguntas' e 'respostas' (array paralelo ao perguntas[]).
  // Mapeamos lista→perguntas e historico→respostas para compatibilidade.
  const respostas = Estado.lista.map((_, i) => {
    const h = Estado.historico[i];
    return h === undefined ? undefined : h;   // undefined = não respondida
  });

  return {
    perguntas:    Estado.lista,      // nav verifica perguntas.length
    respostas,                       // nav verifica respostas com undefined
    lista:        Estado.lista,      // mantido para continuarSessao()
    historico:    Estado.historico,
    indice:       Estado.indice,
    acertos:      Estado.acertos,
    erros:        Estado.erros,
    modoRevisao:  Estado.modoRevisao,
    cardsRevisao: Estado.cardsRevisao,
    tela,
  };
}
/** Persiste sessão no sessionStorage (mesma aba, sobrevive a reload). */


let _sessThrottleTimer = null;


function salvarSessao(tela = 'question') {
  const snap = _snapshotEstado(tela);
  if (!snap.lista?.length) return;
  Estado._nav?.salvar(snap);
}

function salvarSessaoThrottled() {
  if (!Estado._nav) return;
  Estado._nav.salvarThrottled(_snapshotEstado('question'));
}

function limparSessao() {
  Estado._nav?.limpar();
}

function lerSessao() {
  return Estado._nav?.lerSessao() ?? null;
}


function lerHistoricoRevisao() {
  try {
    const raw = localStorage.getItem(_HIST_KEY());
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function salvarHistoricoRevisao(hist) {
  try { localStorage.setItem(_HIST_KEY(), JSON.stringify(hist)); } catch {}
}

function registrarNoHistorico(questaoId, acertou) {
  const hist = Estado.historicoRevisao;
  const entrada = hist[questaoId] ?? {
    tentativas: 0, acertos: 0, erros: 0, acertosConsecutivos: 0,
  };
  entrada.tentativas++;
  if (acertou) {
    entrada.acertos++;
    entrada.acertosConsecutivos = (entrada.acertosConsecutivos ?? 0) + 1;
  } else {
    entrada.erros++;
    entrada.acertosConsecutivos = 0;
  }
  hist[questaoId] = entrada;
  salvarHistoricoRevisao(hist);
}

/* Questões com erro: erros > 0 e acertosConsecutivos === 0 */
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

/* Atualiza visibilidade do botão "Revisar erros" na intro */
function atualizarBtnRevisarErros() {
  const btn = document.getElementById('btn-revisar-erros');
  if (!btn) return;
  const erradas = questoesComErro(Estado.banco, Estado.historicoRevisao);
  if (erradas.length === 0) {
    btn.classList.add('hidden');
    return;
  }
  const countEl = document.getElementById('cf-revisar-count');
  if (countEl) countEl.textContent = erradas.length;
  btn.classList.remove('hidden');
}


/* ── CONTAGEM DE LETRAS ──────────────────────────────────────
   Conta APENAS os caracteres alfabéticos/numéricos da resposta,
   ignorando espaços e acentos após normalização.
   Isso garante que o número exibido em "Letras: X" coincida
   exatamente com quantos campos o usuário precisa preencher.
   ─────────────────────────────────────────────────────────── */
function contarLetras(resposta) {
  return normalizar(resposta).length;
}

/* ── GERAR UNDERSCORES ───────────────────────────────────────
   Cria a sequência "_ _ _ _" com exatamente o mesmo número
   de underscores retornado por contarLetras().
   Ambos usam a mesma base (normalizar), então NUNCA divergem.
   ─────────────────────────────────────────────────────────── */
function gerarUnderscores(resposta) {
  const n = contarLetras(resposta);
  return Array(n).fill('_').join(' ');
}

/* ── TOPBAR ── */
function iniciarTopbar() {
  if (Els.shellSem)
    Els.shellSem.textContent = URL_SEM || '—';

  if (Els.shellDiscName) {
    const meta = getDiscMeta(URL_DISC);
    Els.shellDiscName.textContent = meta.apelido || URL_DISC.toUpperCase() || '—';
  }

  aplicarCorDisc(URL_DISC);

  const voltar = URL_SEM ? `../../jogo.html?sem=${URL_SEM}` : '../../jogo.html';
  if (Els.backBtn) {
    Els.backBtn.href = voltar;
    Els.backBtn.addEventListener('click', () => {
      salvarSessao('intro');           // preserva sessão para botão "Continuar"
      Estado._nav?.sairParaRota();     // beforeunload NÃO seta reload-flag
    });
  }

  // Botão "Voltar" na tela de resultado → volta para a intro do jogo
  if (Els.btnBackResult) {
    Els.btnBackResult.removeAttribute('href');
    Els.btnBackResult.addEventListener('click', e => {
      e.preventDefault();
      timerClear();
      limparSessao();
      Els.screenResult.classList.remove('show');
      document.body.classList.remove('modo-revisao');
      Estado.modoRevisao  = false;
      Estado.cardsRevisao = null;
      if (Els.navBar)    Els.navBar.classList.remove('hidden');
      if (Els.gameCard)  Els.gameCard.style.display = '';
      mostrarIntro();
    });
  }
}

/* ── CONSTRUIR LISTA ─────────────────────────────────────────
   Embaralha o banco completo e fatia as primeiras MAX_QUESTOES.
   Variedade a cada partida sem percorrer o deck inteiro.
   ─────────────────────────────────────────────────────────── */
const MAX_QUESTOES = 6;

function construirLista() {
  const dados    = getDados();
  const semData  = dados[URL_SEM]    ?? {};
  const discData = semData[URL_DISC] ?? [];

  const fonte = discData.length
    ? discData
    : Object.values(semData).flat();

  // Banco completo para poder calcular revisão de erros
  Estado.banco = fonte.length ? fonte : [];

  if (Estado.modoRevisao && Estado.cardsRevisao?.length > 0) {
    // Modo revisão: usa as questões erradas já calculadas
    const embaralhada = embaralhar(Estado.cardsRevisao);
    Estado.lista = embaralhada.slice(0, MAX_QUESTOES);
  } else {
    const embaralhada = embaralhar(Estado.banco);
    Estado.lista = embaralhada.slice(0, MAX_QUESTOES);
  }
}

/* ── INICIAR ── */
function iniciar(modoRevisao = false) {
  Estado.modoRevisao = modoRevisao;

  if (!modoRevisao) {
    Estado.cardsRevisao = null;
  }

  Estado.indice     = 0;
  Estado.acertos    = 0;
  Estado.erros      = 0;
  Estado.respondida = false;
  Estado.historico  = [];
  _pausado = false;

  // Limpa sessão antiga — novo jogo, novo começo
  limparSessao();

  construirLista();

  Els.screenResult.classList.remove('show');
  if (Els.gameCard) Els.gameCard.style.display = '';

  // Banner de revisão
  _atualizarBannerRevisao();

  // Aplica classe no body para estilização
  document.body.classList.toggle('modo-revisao', modoRevisao);

  renderPergunta();
  renderDots();
}

/* ── BANNER DE REVISÃO ──────────────────────────────────────
   Injeta/remove o banner "Revisão de erros" no topo do game card.
   ─────────────────────────────────────────────────────────── */
function _atualizarBannerRevisao() {
  const gameLayout = document.getElementById('game-layout');
  if (!gameLayout) return;

  gameLayout.querySelector('.cf-revisao-banner')?.remove();

  if (Estado.modoRevisao) {
    const total = Estado.lista?.length ?? 0;
    const banner = document.createElement('div');
    banner.className = 'cf-revisao-banner';
    banner.setAttribute('role', 'alert');
    banner.innerHTML = `
      <span class="cf-revisao-banner__icon">⚠</span>
      <span class="cf-revisao-banner__label">Revisão de erros</span>
      <span class="cf-revisao-banner__count">${total} questão${total !== 1 ? 'ões' : ''}</span>
    `;
    // Insere antes do game-card
    const card = document.getElementById('game-card');
    if (card) gameLayout.insertBefore(banner, card);
    else gameLayout.prepend(banner);
  }
}

/* ── RENDERIZAR PERGUNTA ── */
function renderPergunta() {
  const p    = Estado.lista[Estado.indice];
  const disc = getDiscMeta(URL_DISC);

  Els.gameCard.style.animation = 'none';
  void Els.gameCard.offsetWidth;
  Els.gameCard.style.animation = '';

  Els.discTag.innerHTML =
    `${disc.emoji
      ? `<span class="disc-emoji">${disc.emoji}</span>`
      : `<span class="disc-sigla">${disc.apelido?.split(' ')[0]?.toUpperCase() ?? URL_DISC.toUpperCase()}</span>`}
     ${disc.apelido ?? URL_DISC}`;
  Els.discTag.style.color = 'var(--cor-tema)';

  Els.semTag.textContent = URL_SEM || '—';

  const nk = normalizar(p.nivel);
  Els.nivelTag.textContent = p.nivel;
  Els.nivelTag.className   = `nivel-tag ${nk === 'facil' ? 'facil' : nk === 'medio' ? 'medio' : 'dificil'}`;

  Els.questionNum.textContent = `QUESTÃO ${String(Estado.indice + 1).padStart(2, '0')}`;

  /* ── LETRAS: contador + underscores sincronizados ──────────
     contarLetras() e gerarUnderscores() usam a mesma base
     (normalizar), então o número e os "_" NUNCA divergem.
     ─────────────────────────────────────────────────────── */
  const numLetras = contarLetras(p.resposta);
  if (Els.letrasCount) {
    Els.letrasCount.textContent = numLetras;
  }

  Els.fraseTexto.innerHTML = p.frase.replace(
    '______',
    `<span class="lacuna">${gerarUnderscores(p.resposta)}</span>`
  );

  /* ── RESET DO PAINEL DE DICA ─────────────────────────────
     Executado a cada troca de questão:
     1. Limpa texto e oculta o painel (sem resíduo da questão anterior)
     2. Remove classe de animação para não vazar entre questões
     3. Mostra/oculta botão conforme a questão ter tip ou não
     ─────────────────────────────────────────────────────── */
  if (Els.dicaPanel) {
    Els.dicaPanel.style.display = 'none';
    Els.dicaPanel.textContent   = '';
    Els.dicaPanel.classList.remove('dica-panel--animando');
  }
  if (Els.btnShowDica) {
    const temDicas = Array.isArray(p.tips) && p.tips.length > 0;
    Els.btnShowDica.style.display = temDicas ? '' : 'none';
    Els.btnShowDica.classList.remove('btn-show-dica--aberta');
  }

  Els.inputAnswer.value     = '';
  Els.inputAnswer.className = 'input-answer';
  Els.inputAnswer.disabled  = false;
  Els.inputAnswer.focus();

  Els.btnCheck.disabled      = false;
  Els.feedbackLine.className = 'feedback-line';

  Els.btnNext.disabled = true;
  Els.btnNext.innerHTML = Estado.indice >= Estado.lista.length - 1
    ? 'Ver resultado <span class="arrow">→</span>'
    : 'Próxima <span class="arrow">→</span>';
  if (Els.btnPrev) Els.btnPrev.disabled = Estado.indice === 0;

  const hist = Estado.historico[Estado.indice];

  // Timer só inicia se a questão ainda não foi respondida
  if (!hist) {
    timerStart();
  } else {
    timerClear();
    timerRender(0);
  }

  if (hist) {
    Estado.respondida        = true;
    Els.inputAnswer.value    = hist.digitado;
    Els.inputAnswer.disabled = true;
    Els.btnCheck.disabled    = true;
    Els.btnNext.disabled     = false;

    if (hist.acertou) {
      Els.inputAnswer.classList.add('state-ok');
      Els.feedbackLine.className = 'feedback-line ok show';
      Els.feedbackLine.innerHTML = `<span class="feedback-icon">✓</span> Resposta correta.`;
    } else {
      Els.inputAnswer.classList.add('state-err');
      Els.feedbackLine.className = 'feedback-line err show';
      Els.feedbackLine.innerHTML =
        `<span class="feedback-icon">✗</span> Resposta correta: <span class="fb-answer">${p.resposta}</span>`;
    }
  } else {
    Estado.respondida = false;
  }

  atualizarMeta();
}

/* ── MOSTRAR DICA ────────────────────────────────────────────
   Exibe o único tip da questão atual. A cada clique re-anima
   o painel via remoção + reinserção da classe CSS.
   ─────────────────────────────────────────────────────────── */
function mostrarDicaAleatoria() {
  const p = Estado.lista[Estado.indice];
  if (!p || !Array.isArray(p.tips) || p.tips.length === 0) return;

  if (!Els.dicaPanel) return;

  Els.dicaPanel.textContent = p.tips[0];

  Els.dicaPanel.classList.remove('dica-panel--animando');
  void Els.dicaPanel.offsetWidth; // reflow intencional
  Els.dicaPanel.classList.add('dica-panel--animando');
  Els.dicaPanel.style.display = 'block';
}

/* ── VERIFICAR ── */
function verificar() {
  if (Estado.respondida) return;

  const p       = Estado.lista[Estado.indice];
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

  timerClear();

  const acertou = normalizar(digitado) === normalizar(p.resposta);

  if (!Estado.historico[Estado.indice]) {
    if (acertou) Estado.acertos++;
    else         Estado.erros++;
  }

  if (acertou) {
    Els.inputAnswer.classList.add('state-ok');
    Els.feedbackLine.className = 'feedback-line ok show';
    Els.feedbackLine.innerHTML = `<span class="feedback-icon">✓</span> Resposta correta.`;
  } else {
    Els.inputAnswer.classList.add('state-err');
    Els.feedbackLine.className = 'feedback-line err show';
    Els.feedbackLine.innerHTML =
      `<span class="feedback-icon">✗</span> Resposta correta: <span class="fb-answer">${p.resposta}</span>`;
  }

  Estado.historico[Estado.indice] = { digitado, acertou };

  // Registra no histórico de revisão (persiste em localStorage)
  const questaoId = Estado.lista[Estado.indice]?.id;
  if (questaoId) registrarNoHistorico(questaoId, acertou);

  // Persiste progresso para o botão "Continuar"
  salvarSessao('question');

  atualizarMeta();

  const ultima = Estado.indice >= Estado.lista.length - 1;
  Els.btnNext.innerHTML = ultima
    ? 'Ver resultado <span class="arrow">→</span>'
    : 'Próxima <span class="arrow">→</span>';
  Els.btnNext.disabled = false;
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

  if (Els.progressFill) Els.progressFill.style.width  = pct + '%';
  Els.progressLabel.textContent = `${feitas} / ${total}`;
  Els.progressPct.textContent   = Math.round(pct) + '%';
  Els.chipOk.textContent        = `✓ ${Estado.acertos}`;
  Els.chipErr.textContent       = `✗ ${Estado.erros}`;
  renderDots();
}

/* ── BOLINHAS ── */
function renderDots() {
  const container = document.getElementById('cf-dots');
  if (!container) return;
  container.innerHTML = '';

  Estado.lista.forEach((_, i) => {
    const hist       = Estado.historico[i];
    const respondida = hist !== undefined;
    const acertou    = respondida && hist.acertou;
    const atual      = i === Estado.indice;

    const dot = document.createElement('button');
    dot.type      = 'button';
    dot.className = 'cf-dot ' + (
      atual       ? 'cf-dot--current' :
      !respondida ? ''                :
      acertou     ? 'cf-dot--correct' : 'cf-dot--wrong'
    );
    dot.setAttribute('aria-label', `Ir para questão ${i + 1}`);
    dot.title = `Questão ${i + 1}`;

    /* ── NAVEGAÇÃO CLICÁVEL ──────────────────────────────────────
       Ao clicar numa bolinha:
       1. Para o timer da questão atual (sem registrar erro)
       2. Atualiza Estado.indice para o índice clicado
       3. Chama renderPergunta() — que restaura o estado salvo
          no historico[] se a questão já foi respondida, ou inicia
          nova questão (com timer) se ainda não foi respondida.
       4. Salva a sessão imediatamente para manter sincronia com
          sessionStorage (botão "Continuar" e reload seguro).
       Proteção: não faz nada se já estamos na questão clicada,
       evitando re-renderizações desnecessárias.
       ─────────────────────────────────────────────────────────── */
    dot.addEventListener('click', () => {
      // Proteção: já estamos nesta questão → noop
      if (i === Estado.indice) return;

      // Para o timer da questão atual sem penalizar o usuário
      timerClear();

      // Navega para a questão clicada
      Estado.indice = i;

      // renderPergunta() cuida de tudo:
      // • restaura resposta/feedback se já respondida (hist existe)
      // • reseta e inicia timer se ainda não respondida
      // • atualiza letras, frase, dica, barra de progresso e dots
      renderPergunta();

      // Persiste a posição atual na sessão para reload seguro
      salvarSessao('question');
    });

    container.appendChild(dot);
  });
}

/* ── RESULTADO ── */
function mostrarResultado() {
  timerClear();
  // Jogo concluído — limpa sessão para não mostrar "Continuar" desnecessariamente
  limparSessao();
  Els.gameCard.style.display = 'none';
  if (Els.navBar) Els.navBar.classList.add('hidden');
  Els.progressFill.style.width = '100%';

  // Remove banner de revisão
  document.getElementById('game-layout')?.querySelector('.cf-revisao-banner')?.remove();

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
  Els.resultTitle.textContent = Estado.modoRevisao ? 'Revisão concluída' : titulo;
  Els.resultSub.textContent   = sub;
  Els.resultOk.textContent    = Estado.acertos;
  Els.resultErr.textContent   = Estado.erros;

  const cor        = pct >= 70 ? '#10D9A0' : pct >= 40 ? '#FFC857' : '#FF5F7E';
  const dashOffset = 339.3 * (1 - pct / 100);
  Els.ringFill.style.stroke = cor;
  Els.ringFill.style.filter = `drop-shadow(0 0 8px ${cor})`;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      Els.ringFill.style.strokeDashoffset = dashOffset;
    })
  );

  // Badge de revisão no topo do resultado
  const resultCard = Els.screenResult.querySelector('.cf-result-inner') ?? Els.screenResult;
  resultCard.querySelector('.cf-finish-revisao-badge')?.remove();
  if (Estado.modoRevisao) {
    const badge = document.createElement('div');
    badge.className = 'cf-finish-revisao-badge';
    badge.innerHTML = `<span>⚠</span> Revisão de erros`;
    resultCard.insertBefore(badge, resultCard.firstChild);
  }

  // Atualiza botão "Jogar novamente" para "Repetir revisão" em modo revisão
  const btnRestart = document.getElementById('btn-restart');
  if (btnRestart) {
    // Clona para remover listeners antigos
    const novo = btnRestart.cloneNode(true);
    btnRestart.parentNode.replaceChild(novo, btnRestart);
    Els.btnRestart = novo;

    if (Estado.modoRevisao) {
      novo.innerHTML = `
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" width="14" height="14">
          <path d="M13.5 2.5v3.5h-3.5"/>
          <path d="M13.3 6A6 6 0 1 0 12 12"/>
        </svg>
        Repetir revisão
      `;
      novo.classList.add('btn-restart--revisao');
      novo.addEventListener('click', () => {
        Els.screenResult.classList.remove('show');
        document.body.classList.remove('modo-revisao');
        if (Els.navBar) Els.navBar.classList.remove('hidden');

        // Verifica se ainda há erros nesta rodada
        const erradasAgora = Estado.lista.filter((q, idx) => {
          const h = Estado.historico[idx];
          return !h || !h.acertou;
        });

        if (erradasAgora.length === 0) {
          // Todas acertadas — revisão concluída!
          _mostrarRevisaoConcluida();
          return;
        }

        Estado.cardsRevisao = erradasAgora;
        if (Els.gameCard) Els.gameCard.style.display = '';
        iniciar(true);
      });
    } else {
      novo.innerHTML = '↺ Jogar novamente';
      novo.classList.remove('btn-restart--revisao');
      novo.addEventListener('click', () => {
        Els.screenResult.classList.remove('show');
        document.body.classList.remove('modo-revisao');
        if (Els.navBar) Els.navBar.classList.remove('hidden');
        if (Els.gameCard) Els.gameCard.style.display = '';
        mostrarIntro();
      });
    }
  }

  // Painel de estatísticas por questão
  _renderEstatisticasQuestoes();

  // Atualiza btn revisar erros na intro (será visto ao voltar)
  atualizarBtnRevisarErros();

  Els.screenResult.classList.add('show');
}

/* ── ESTATÍSTICAS POR QUESTÃO (tela resultado) ───────────── */
function _renderEstatisticasQuestoes() {
  const resultCard = Els.screenResult.querySelector('.cf-result-inner') ?? Els.screenResult;
  resultCard.querySelector('.cf-stats-questoes')?.remove();

  const hist = Estado.historicoRevisao;
  const temDados = Estado.lista.some(q => hist[q.id]);
  if (!temDados && !Estado.modoRevisao) return;

  const painel = document.createElement('details');
  painel.className = 'cf-stats-questoes';
  painel.open = true;
  painel.innerHTML = `<summary><span class="cf-sq-summary-icon">📊</span><span class="cf-sq-summary-text">Progresso por questão</span><span class="cf-sq-chevron"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6l4 4 4-4"/></svg></span></summary>`;

  const lista = document.createElement('div');
  lista.className = 'cf-sq-lista';

  for (const [idx, q] of Estado.lista.entries()) {
    const h             = hist[q.id];
    const histSessao    = Estado.historico[idx];
    const acertouAgora  = histSessao?.acertou === true;
    const errouAgora    = histSessao !== undefined && !histSessao.acertou;
    const enun = (q.frase ?? '').replace('______', '___').slice(0, 52) +
                 ((q.frase ?? '').length > 52 ? '…' : '');

    let rowHtml;

    let rowCls = '';
    if (Estado.modoRevisao) {
      const icone   = acertouAgora ? '✓' : errouAgora ? '✗' : '–';
      rowCls        = acertouAgora ? 'cf-sq-row--ok' : errouAgora ? 'cf-sq-row--err' : '';
      const barCls  = acertouAgora ? 'cf-prog-bar--ok' : 'cf-prog-bar--critico';
      const barPct  = acertouAgora ? 100 : 0;
      const label   = acertouAgora ? '100%' : errouAgora ? '0%' : '–';
      rowHtml = `
        <span class="cf-sq-icone">${icone}</span>
        <div class="cf-sq-body">
          <span class="cf-sq-enun">${enun}${acertouAgora ? ' <span class="cf-sq-superada" title="Acertou nesta rodada">⭐</span>' : ''}</span>
          <div class="cf-sq-prog-row">
            <div class="cf-prog-track"><div class="cf-prog-bar ${barCls}" style="width:${barPct}%"></div></div>
            <span class="cf-sq-pct">${label}</span>
          </div>
        </div>`;
    } else {
      if (!h) continue;
      const { tentativas, acertos, erros } = h;
      const taxa    = Math.round((acertos / tentativas) * 100);
      const barCls  = taxa >= 80 ? 'cf-prog-bar--ok' : taxa >= 50 ? 'cf-prog-bar--med' : 'cf-prog-bar--critico';
      const icone   = acertouAgora ? '✓' : errouAgora ? '✗' : '–';
      rowCls        = acertouAgora ? 'cf-sq-row--ok' : errouAgora ? 'cf-sq-row--err' : '';
      rowHtml = `
        <span class="cf-sq-icone">${icone}</span>
        <div class="cf-sq-body">
          <span class="cf-sq-enun">${enun}</span>
          <div class="cf-sq-prog-row">
            <div class="cf-prog-track"><div class="cf-prog-bar ${barCls}" style="width:${taxa}%"></div></div>
            <span class="cf-sq-pct">${taxa}%</span>
          </div>
          <span class="cf-sq-detalhe">${acertos} acerto${acertos !== 1 ? 's' : ''} / ${tentativas} tentativa${tentativas !== 1 ? 's' : ''}</span>
        </div>`;
    }

    const row = document.createElement('div');
    row.className = `cf-sq-row ${rowCls}`.trim();
    row.innerHTML = rowHtml;
    lista.appendChild(row);
  }

  painel.appendChild(lista);
  resultCard.appendChild(painel);
}

/* ── REVISÃO CONCLUÍDA ───────────────────────────────────── */
function _mostrarRevisaoConcluida() {
  const screenResult = Els.screenResult;
  if (!screenResult) return;

  const inner = screenResult.querySelector('.cf-result-inner') ?? screenResult;
  const scoreRingWrap = inner.querySelector('.score-ring-wrap');
  const resultActions = inner.querySelector('.result-actions');

  // Substitui o conteúdo de ações e título
  if (scoreRingWrap) {
    scoreRingWrap.innerHTML = `<div class="cf-revisao-concluida-emoji">🏆</div>`;
  }

  const titleEl = inner.querySelector('.result-title');
  const subEl   = inner.querySelector('.result-sub');
  if (titleEl) titleEl.textContent = 'Revisão concluída!';
  if (subEl)   subEl.textContent   = 'Você superou todos os erros desta sessão! 🎉';

  if (resultActions) {
    resultActions.innerHTML = `
      <button class="btn-restart" id="btn-revisao-concluida-voltar">← Voltar ao início</button>
    `;
    document.getElementById('btn-revisao-concluida-voltar')?.addEventListener('click', () => {
      screenResult.classList.remove('show');
      document.body.classList.remove('modo-revisao');
      Estado.modoRevisao  = false;
      Estado.cardsRevisao = null;
      if (Els.navBar) Els.navBar.classList.remove('hidden');
      if (Els.gameCard) Els.gameCard.style.display = '';
      atualizarBtnRevisarErros();
      mostrarIntro();
    });
  }

  screenResult.classList.add('show');
}

/* ── CONTINUAR SESSÃO ────────────────────────────────────────
   Restaura o estado completo de uma sessão salva.
   Chamado tanto pelo botão "Continuar" quanto automaticamente
   em reload (quando tela === 'question').
   ─────────────────────────────────────────────────────────── */
function continuarSessao(sessao) {
  _naIntro = false;
  Estado.lista        = sessao.lista;
  Estado.historico    = sessao.historico  ?? [];
  Estado.indice       = sessao.indice     ?? 0;
  Estado.acertos      = sessao.acertos    ?? 0;
  Estado.erros        = sessao.erros      ?? 0;
  Estado.modoRevisao  = sessao.modoRevisao  ?? false;
  Estado.cardsRevisao = sessao.cardsRevisao ?? null;
  _pausado = false;

  // Garante que o índice não aponte para uma questão além da lista
  if (Estado.indice >= Estado.lista.length) {
    Estado.indice = Estado.lista.length - 1;
  }

  const screenIntro = $('screen-intro');
  const gameLayout  = $('game-layout');
  if (screenIntro) screenIntro.style.display = 'none';
  if (gameLayout)  gameLayout.style.display  = '';

  Els.screenResult.classList.remove('show');
  if (Els.gameCard) Els.gameCard.style.display = '';
  if (Els.navBar) Els.navBar.classList.remove('hidden');

  _atualizarBannerRevisao();
  document.body.classList.toggle('modo-revisao', Estado.modoRevisao);

  renderPergunta();
  renderDots();
  atualizarMeta();
}

/* ── BOTÃO "CONTINUAR" ───────────────────────────────────────
   Configura visibilidade e handler do botão na intro.
   ─────────────────────────────────────────────────────────── */
function _configurarBtnContinuar(sessao) {
  const btn = $('btn-continuar');
  if (!btn) return;

  // Verifica se há questões pendentes (não respondidas)
  const pendentes = (sessao.historico ?? []).filter(h => h !== undefined).length;
  const total     = sessao.lista?.length ?? 0;

  // Não mostra se sessão já finalizada (todas respondidas)
  if (pendentes >= total && total > 0) {
    btn.classList.add('hidden');
    return;
  }

  // Não mostra se não há progresso nenhum
  if (pendentes === 0 && total === 0) {
    btn.classList.add('hidden');
    return;
  }

  // Clona para remover listeners antigos
  const novo = btn.cloneNode(true);
  btn.parentNode.replaceChild(novo, btn);
  novo.classList.remove('hidden');

  const progressEl = $('continuar-progress');
  if (progressEl) progressEl.textContent = `${pendentes}/${total}`;

  novo.addEventListener('click', () => {
    continuarSessao(sessao);
  });
}

/* ── TELAS ── */
function mostrarIntro() {
  _naIntro = true;
  timerClear();

  // Banco já foi populado no DOMContentLoaded — só garante fallback
  // caso construirLista() ainda não tenha rodado (primeira visita)
  if (Estado.banco.length === 0) {
    const dados    = getDados();
    const semData  = dados[URL_SEM]    ?? {};
    const discData = semData[URL_DISC] ?? [];
    Estado.banco = discData.length ? discData : Object.values(semData).flat();
  }

  // SEMPRE relê do localStorage — garante que erros de sessões
  // anteriores (incluindo após voltar pelo histórico do browser)
  // apareçam corretamente no botão "Revisar erros".
  Estado.historicoRevisao = lerHistoricoRevisao();

  const screenIntro = $('screen-intro');
  const gameLayout  = $('game-layout');
  if (screenIntro) screenIntro.style.display = '';
  if (gameLayout)  gameLayout.style.display  = 'none';

  // Remove banner de revisão ao voltar à intro
  gameLayout?.querySelector('.cf-revisao-banner')?.remove();
  document.body.classList.remove('modo-revisao');

  const introSem = $('intro-sem-label');
  const meta = getDiscMeta(URL_DISC);

  const chipDisc = document.querySelector('.cf-intro-card__chip--disc');
  if (chipDisc) {
    chipDisc.innerHTML = meta.emoji
      ? `<span style="font-size:1em;line-height:1">${meta.emoji}</span>
         <span id="intro-disc-name">${meta.apelido || URL_DISC.toUpperCase() || '—'}</span>`
      : `<svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" style="opacity:.75">
           <path d="M2 3h12v1H2zm0 3h8v1H2zm0 3h10v1H2zm0 3h6v1H2z"/>
         </svg>
         <span id="intro-disc-name">${meta.apelido || URL_DISC.toUpperCase() || '—'}</span>`;
  }

  if (introSem) introSem.textContent = URL_SEM || '—';

  const totalEl = $('intro-total-questoes');
  if (totalEl) {
    totalEl.textContent = MAX_QUESTOES;
  }

  // Atualiza botão "Revisar erros"
  atualizarBtnRevisarErros();

  // ── Detecta sessão salva para o botão "Continuar" ───────
  const sessaoSalva = lerSessao();
  if (sessaoSalva?.lista?.length > 0) {
    _configurarBtnContinuar(sessaoSalva);
  } else {
    const btnContinuar = $('btn-continuar');
    if (btnContinuar) btnContinuar.classList.add('hidden');
  }
}

function iniciarJogo(modoRevisao = false) {
  _naIntro = false;
  const screenIntro = $('screen-intro');
  const gameLayout  = $('game-layout');
  if (screenIntro) screenIntro.style.display = 'none';
  if (gameLayout)  gameLayout.style.display  = '';
  iniciar(modoRevisao);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  Object.assign(Els, {
    gameCard:      $('game-card'),
    screenResult:  $('screen-result'),
    fraseTexto:    $('frase-texto'),
    /* letras — novo sistema */
    letrasCount:   $('letras-count'),   // <span> com o número
    dicaPanel:     $('dica-panel'),     // <span> ou <p> onde a dica aparece
    btnShowDica:   $('btn-show-dica'),  // botão "Mostrar dica"
    discTag:       $('disc-tag'),
    nivelTag:      $('nivel-tag'),
    semTag:        $('sem-tag'),
    questionNum:   $('question-num'),
    inputAnswer:   $('input-answer'),
    btnCheck:      $('btn-check'),
    feedbackLine:  $('feedback-line'),
    btnNext:       $('btn-next'),
    chipOk:        $('chip-ok'),
    chipErr:       $('chip-err'),
    progressFill:  $('progress-fill'),
    progressLabel: $('progress-label'),
    progressPct:   $('progress-pct'),
    resultPct:     $('result-pct'),
    resultTitle:   $('result-title'),
    resultSub:     $('result-sub'),
    resultOk:      $('result-ok'),
    resultErr:     $('result-err'),
    btnPrev:       $('btn-prev'),
    navBar:        $('nav-bar'),
    btnRestart:    $('btn-restart'),
    ringFill:      $('ring-fill'),
    shellDiscName: $('shell-disc-name'),
    shellSem:      $('shell-sem'),
    backBtn:       $('back-btn'),
    btnBackResult: $('btn-back-result'),
    btnHome:       $('btn-home'),
  });

  // ── Popula banco IMEDIATAMENTE (antes de qualquer render) ──
  // Isso garante que Estado.banco esteja pronto na intro mesmo
  // após voltar do histórico do browser ou recarregar a página.
  {
    const dados    = getDados();
    const semData  = dados[URL_SEM]    ?? {};
    const discData = semData[URL_DISC] ?? [];
    Estado.banco = discData.length ? discData : Object.values(semData).flat();
  }

  // ── Carrega histórico de revisão do localStorage ────────────
  // localStorage persiste entre sessões, abas fechadas, reloads
  // e navegação pelo histórico do browser.
  Estado.historicoRevisao = lerHistoricoRevisao();

  // ── Cria instância do SessionNav inline ──
  Estado._nav = _SN.criar({
    uid:    'visitante',
    discId: URL_DISC,
    sem:    URL_SEM,
  });
  iniciarTopbar();

  // Seta flag de reload em QUALQUER unload (F5, Ctrl+R, fechar aba, navegar).
  // sairParaRota() remove o flag quando a saída é intencional (botão Voltar).
  window.addEventListener('beforeunload', () => {
    Estado._nav?._setReloadFlag();
    // Só salva como 'question' se o jogo estiver ativo (não na intro)
    if (!_naIntro && Estado.lista.length > 0) {
      salvarSessao('question');
    }
  });

  window.addEventListener('pagehide', () => {
    Estado._nav?._setReloadFlag();
    if (!_naIntro && Estado.lista.length > 0) salvarSessao('question');
  });


  // ── Lógica de restauração ────────────────────────────────────
  // pegarRestauravel() retorna sessão apenas em reload da mesma aba.
  // Em entrada nova (ou saída real), retorna null → vai para a intro.
  const _sessaoRestauravel = Estado._nav.pegarRestauravel();

  const _podeRestaurar = (s) =>
    s?.lista?.length > 0 && s?.indice >= 0 && s?.tela === 'question';

  if (_podeRestaurar(_sessaoRestauravel)) {
    continuarSessao(_sessaoRestauravel);
  } else {
    // Sem restauração automática → exibe intro mas configura botão Continuar
    const _sessaoSalva = Estado._nav.lerSessao();
    if (_sessaoSalva?.lista?.length > 0) {
      _configurarBtnContinuar(_sessaoSalva);
    }
    mostrarIntro();
  }

  // Remove anti-flash e consome o flag _snav_stay do sessionStorage
  Estado._nav.pronto();

  // Botão pausar
  const btnPauseEl = $('btn-pause');
  if (btnPauseEl) btnPauseEl.addEventListener('click', pausar);

  // Botão retomar (dentro do modal)
  const btnResumeEl = $('btn-resume');
  if (btnResumeEl) btnResumeEl.addEventListener('click', retomar);

  // Atalho de teclado Espaço / Escape
  document.addEventListener('keydown', e => {
    if (e.key === ' ' && document.activeElement !== Els.inputAnswer) {
      e.preventDefault();
      if (_pausado) retomar(); else pausar();
    }
    if (e.key === 'Escape' && _pausado) retomar();
  });

  // Começar (modo normal)
  const btnStart = $('btn-start');
  if (btnStart) btnStart.addEventListener('click', () => {
    Estado.modoRevisao  = false;
    Estado.cardsRevisao = null;
    limparSessao(); // descarta sessão anterior
    $('btn-continuar')?.classList.add('hidden');
    iniciarJogo(false);
  });

  // Revisar erros
  const btnRevisarErros = $('btn-revisar-erros');
  if (btnRevisarErros) {
    btnRevisarErros.addEventListener('click', () => {
      const erradas = questoesComErro(Estado.banco, Estado.historicoRevisao);
      if (erradas.length === 0) return;
      Estado.cardsRevisao = erradas;
      iniciarJogo(true);
    });
  }

  // Botão Home — volta para a intro
  if (Els.btnHome) {
    Els.btnHome.addEventListener('click', () => {
      timerClear();
      // Salva progresso com tela='intro' para exibir botão Continuar
      // mas não restaurar automaticamente (evita pular a intro)
      if (Estado.lista.length > 0) salvarSessao('intro');
      Els.screenResult.classList.remove('show');
      document.body.classList.remove('modo-revisao');
      Estado.modoRevisao  = false;
      Estado.cardsRevisao = null;
      if (Els.navBar) Els.navBar.classList.remove('hidden');
      if (Els.gameCard) Els.gameCard.style.display = '';
      mostrarIntro();
    });
  }

  // Reiniciar (da tela de resultado) — delegado ao handler dinâmico em mostrarResultado
  // O botão btn-restart é clonado a cada resultado, então não bindamos aqui.

  Els.btnCheck.addEventListener('click', verificar);
  Els.btnNext.addEventListener('click', avancar);

  if (Els.btnPrev) {
    Els.btnPrev.addEventListener('click', () => {
      if (Estado.indice > 0) {
        Estado.indice--;
        renderPergunta();
      }
    });
  }

  Els.inputAnswer.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      if (!Estado.respondida) verificar();
      else avancar();
    }
  });

  /* ── BOTÃO "Mostrar dica" ──────────────────────────────────
     Usa delegação no card para não precisar re-bindar a cada
     questão. O botão é re-exibido/ocultado dentro de
     renderPergunta() conforme a questão tiver tips ou não.
     ─────────────────────────────────────────────────────── */
  if (Els.btnShowDica) {
    /* Toggle: 1 clique abre, 1 clique fecha. */
    Els.btnShowDica.addEventListener('click', () => {
      const aberta = Els.btnShowDica.classList.contains('btn-show-dica--aberta');
      if (aberta) {
        Els.dicaPanel.style.display = 'none';
        Els.dicaPanel.textContent   = '';
        Els.dicaPanel.classList.remove('dica-panel--animando');
        Els.btnShowDica.classList.remove('btn-show-dica--aberta');
      } else {
        mostrarDicaAleatoria();
        Els.btnShowDica.classList.add('btn-show-dica--aberta');
      }
    });
  }
});