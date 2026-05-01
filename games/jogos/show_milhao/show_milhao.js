/* =============================================
   SHOW DO MILHÃO — script.js
   ============================================= */

// ── Banco de perguntas ──
const PERGUNTAS = [
  {
    texto: "Qual é a capital do Brasil?",
    alternativas: { A: "São Paulo", B: "Brasília", C: "Rio de Janeiro", D: "Salvador" },
    correta: "B",
    nivel: "Fácil"
  },
  {
    texto: "Quantos planetas existem no Sistema Solar?",
    alternativas: { A: "7", B: "9", C: "8", D: "10" },
    correta: "C",
    nivel: "Fácil"
  },
  {
    texto: "Quem escreveu 'Dom Casmurro'?",
    alternativas: { A: "José de Alencar", B: "Machado de Assis", C: "Carlos Drummond", D: "Clarice Lispector" },
    correta: "B",
    nivel: "Médio"
  },
  {
    texto: "Em que ano o Brasil foi descoberto pelos portugueses?",
    alternativas: { A: "1492", B: "1510", C: "1500", D: "1498" },
    correta: "C",
    nivel: "Médio"
  },
  {
    texto: "Qual elemento químico tem o símbolo 'Au'?",
    alternativas: { A: "Prata", B: "Ouro", C: "Cobre", D: "Alumínio" },
    correta: "B",
    nivel: "Médio"
  },
  {
    texto: "Qual é o maior oceano do mundo?",
    alternativas: { A: "Atlântico", B: "Índico", C: "Ártico", D: "Pacífico" },
    correta: "D",
    nivel: "Fácil"
  },
  {
    texto: "Quem pintou a Mona Lisa?",
    alternativas: { A: "Michelangelo", B: "Rafael", C: "Leonardo da Vinci", D: "Donatello" },
    correta: "C",
    nivel: "Médio"
  },
  {
    texto: "Qual é o símbolo químico do sódio?",
    alternativas: { A: "So", B: "Sn", C: "Na", D: "Sd" },
    correta: "C",
    nivel: "Difícil"
  },
  {
    texto: "Em que continente fica o Egito?",
    alternativas: { A: "Ásia", B: "Europa", C: "África", D: "Oriente Médio" },
    correta: "C",
    nivel: "Fácil"
  },
  {
    texto: "Qual é a fórmula da água?",
    alternativas: { A: "CO₂", B: "H₂O", C: "O₂", D: "H₂O₂" },
    correta: "B",
    nivel: "Fácil"
  }
];

// ── Tabela de prêmios ──
const PREMIOS = [
  { valor: "R$ 1.000",     marco: false },
  { valor: "R$ 5.000",     marco: false },
  { valor: "R$ 10.000",    marco: false },
  { valor: "R$ 30.000",    marco: true  }, // marco de segurança
  { valor: "R$ 50.000",    marco: false },
  { valor: "R$ 100.000",   marco: false },
  { valor: "R$ 150.000",   marco: false },
  { valor: "R$ 300.000",   marco: true  }, // marco de segurança
  { valor: "R$ 500.000",   marco: false },
  { valor: "R$ 1.000.000", marco: false },
];

// ── Estado do jogo ──
let estado = {
  perguntaAtual: 0,
  pontuacao: 0,
  acertos: 0,
  respondeu: false,
  timer: null,
  tempoRestante: 30,
  perguntas: []
};

const TEMPO_LIMITE = 30;
const CIRCUNFERENCIA = 276.46;

// ── Iniciar jogo ──
function iniciarJogo() {
  estado.perguntas = embaralhar([...PERGUNTAS]);
  estado.perguntaAtual = 0;
  estado.pontuacao = 0;
  estado.acertos = 0;

  mostrarTela('tela-jogo');
  construirListaPremios();
  carregarPergunta();
}

// ── Embaralhar array ──
function embaralhar(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Mostrar tela ──
function mostrarTela(id) {
  document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
  const tela = document.getElementById(id);
  tela.classList.add('ativa');
}

// ── Construir lista de prêmios ──
function construirListaPremios() {
  const lista = document.getElementById('lista-premios');
  lista.innerHTML = '';
  // Exibir em ordem decrescente
  for (let i = PREMIOS.length - 1; i >= 0; i--) {
    const div = document.createElement('div');
    div.className = 'premio-item' + (PREMIOS[i].marco ? ' marco' : '');
    div.id = `premio-${i}`;
    div.innerHTML = `<span>${i + 1}</span><span>${PREMIOS[i].valor}</span>`;
    lista.appendChild(div);
  }
  atualizarPremios();
}

// ── Atualizar destaque na lista de prêmios ──
function atualizarPremios() {
  const idx = estado.perguntaAtual;
  document.querySelectorAll('.premio-item').forEach((el, i) => {
    // i vai de 0 (último prêmio) a 9 (primeiro prêmio na exibição invertida)
    const pregIdx = PREMIOS.length - 1 - i; // índice real da pergunta
    el.classList.remove('atual', 'conquistado');
    if (pregIdx < idx) {
      el.classList.add('conquistado');
    } else if (pregIdx === idx) {
      el.classList.add('atual');
    }
  });
}

// ── Carregar pergunta ──
function carregarPergunta() {
  estado.respondeu = false;
  const p = estado.perguntas[estado.perguntaAtual];

  // HUD
  document.getElementById('num-pergunta').textContent =
    `${estado.perguntaAtual + 1}/${estado.perguntas.length}`;
  document.getElementById('pontuacao-hud').textContent =
    estado.pontuacao > 0 ? PREMIOS[estado.perguntaAtual - 1]?.valor || 'R$ 0' : 'R$ 0';
  document.getElementById('pergunta-nivel').textContent = `Nível ${estado.perguntaAtual + 1} — ${p.nivel}`;
  document.getElementById('pergunta-texto').textContent = p.texto;

  // Alternativas
  ['A','B','C','D'].forEach(letra => {
    const btn = document.getElementById(`alt-${letra.toLowerCase()}`);
    btn.classList.remove('correta', 'errada', 'revelada');
    btn.disabled = false;
    btn.style.opacity = '1';
    document.getElementById(`texto-${letra.toLowerCase()}`).textContent = p.alternativas[letra];
  });

  // Esconder feedback
  const fb = document.getElementById('feedback-box');
  fb.classList.remove('visivel');

  // Atualizar prêmios
  atualizarPremios();

  // Iniciar timer
  iniciarTimer();
}

// ── Timer ──
function iniciarTimer() {
  clearInterval(estado.timer);
  estado.tempoRestante = TEMPO_LIMITE;
  atualizarTimerUI();

  const timerContainer = document.querySelector('.timer-container');
  timerContainer.classList.remove('timer-urgente');

  estado.timer = setInterval(() => {
    estado.tempoRestante--;
    atualizarTimerUI();

    if (estado.tempoRestante <= 5) {
      timerContainer.classList.add('timer-urgente');
    }

    if (estado.tempoRestante <= 0) {
      clearInterval(estado.timer);
      tempoEsgotado();
    }
  }, 1000);
}

function atualizarTimerUI() {
  const t = estado.tempoRestante;
  document.getElementById('timer-numero').textContent = t;

  const progresso = t / TEMPO_LIMITE;
  const offset = CIRCUNFERENCIA * (1 - progresso);
  document.getElementById('timer-arco').style.strokeDashoffset = offset;
}

// ── Tempo esgotado ──
function tempoEsgotado() {
  if (estado.respondeu) return;
  estado.respondeu = true;

  // Desabilitar alternativas
  ['A','B','C','D'].forEach(letra => {
    document.getElementById(`alt-${letra.toLowerCase()}`).disabled = true;
  });

  // Revelar resposta correta
  const p = estado.perguntas[estado.perguntaAtual];
  document.getElementById(`alt-${p.correta.toLowerCase()}`).classList.add('revelada');

  // Feedback
  mostrarFeedback(false, true);
}

// ── Responder ──
function responder(letra) {
  if (estado.respondeu) return;
  estado.respondeu = true;
  clearInterval(estado.timer);

  const p = estado.perguntas[estado.perguntaAtual];
  const correta = letra === p.correta;

  // Desabilitar todos
  ['A','B','C','D'].forEach(l => {
    document.getElementById(`alt-${l.toLowerCase()}`).disabled = true;
  });

  // Marcar selecionada e correta
  const btnSelecionado = document.getElementById(`alt-${letra.toLowerCase()}`);
  btnSelecionado.classList.add(correta ? 'correta' : 'errada');

  if (!correta) {
    document.getElementById(`alt-${p.correta.toLowerCase()}`).classList.add('revelada');
  }

  if (correta) {
    estado.acertos++;
    estado.pontuacao = estado.perguntaAtual + 1;
  }

  mostrarFeedback(correta, false);
}

// ── Mostrar feedback ──
function mostrarFeedback(correta, tempoAcabou) {
  const fb = document.getElementById('feedback-box');
  const icone = document.getElementById('feedback-icone');
  const msg   = document.getElementById('feedback-msg');
  const resp  = document.getElementById('feedback-resposta');
  const btnProx = document.getElementById('btn-proxima');

  const p = estado.perguntas[estado.perguntaAtual];
  const isUltima = estado.perguntaAtual >= estado.perguntas.length - 1;

  if (tempoAcabou) {
    icone.textContent = '⏰';
    msg.textContent = 'Tempo Esgotado!';
    msg.style.color = '#ff9800';
    resp.textContent = `A resposta correta era: ${p.correta} — ${p.alternativas[p.correta]}`;
  } else if (correta) {
    icone.textContent = '✅';
    msg.textContent = isUltima ? '🏆 Você é o Milionário!' : 'Correto! Excelente!';
    msg.style.color = '#00e676';
    resp.textContent = `Você ganhou: ${PREMIOS[estado.perguntaAtual].valor}`;
  } else {
    icone.textContent = '❌';
    msg.textContent = 'Resposta Errada!';
    msg.style.color = '#ff1744';
    resp.textContent = `A correta era: ${p.correta} — ${p.alternativas[p.correta]}`;
  }

  btnProx.textContent = isUltima ? 'VER RESULTADO →' : 'PRÓXIMA →';
  fb.classList.add('visivel');

  // Se errou ou tempo acabou, vai pro resultado com pouca demora permitida
  if (!correta || tempoAcabou) {
    btnProx.textContent = 'VER RESULTADO →';
    // Marca como última para ir ao fim
    estado.perguntaAtual = estado.perguntas.length; // força ir ao fim
  }
}

// ── Próxima pergunta ──
function proximaPergunta() {
  // Se for a última ou errou, vai para o fim
  if (estado.perguntaAtual >= estado.perguntas.length) {
    mostrarFim();
    return;
  }

  estado.perguntaAtual++;

  if (estado.perguntaAtual >= estado.perguntas.length) {
    mostrarFim();
    return;
  }

  // Limpar feedback
  document.getElementById('feedback-box').classList.remove('visivel');
  carregarPergunta();
}

// ── Tela final ──
function mostrarFim() {
  clearInterval(estado.timer);
  const valorFinal = estado.acertos > 0 ? PREMIOS[estado.acertos - 1].valor : 'R$ 0';
  const todosCorretos = estado.acertos === estado.perguntas.length;

  document.getElementById('fim-icone').textContent = todosCorretos ? '🏆' : estado.acertos >= 5 ? '🌟' : '😔';
  document.getElementById('fim-titulo').textContent =
    todosCorretos ? 'MILIONÁRIO!' : estado.acertos >= 7 ? 'Muito bem!' : estado.acertos >= 4 ? 'Bom jogo!' : 'Não foi dessa vez...';
  document.getElementById('fim-msg').textContent =
    todosCorretos
      ? 'Incrível! Você acertou todas as perguntas!'
      : `Você acertou ${estado.acertos} de ${estado.perguntas.length} perguntas.`;
  document.getElementById('fim-valor').textContent = valorFinal;
  document.getElementById('fim-acertos').textContent = `${estado.acertos} de ${estado.perguntas.length} corretas`;

  mostrarTela('tela-fim');
}

// ── Reiniciar ──
function reiniciar() {
  clearInterval(estado.timer);
  mostrarTela('tela-inicio');
}