/**
 * NEXUS STUDY — games/jogo.js   (v3 — nova central de jogos)
 * Módulo ES — importa global.js e shared/
 *
 * Catálogo em duas categorias:
 *   · estudo          → jogos ligados às disciplinas (pasta jogos/estudo/)
 *   · entretenimento  → jogos comuns, sem disciplina   (pasta jogos/entretenimento/)
 *
 * COMO ADICIONAR UM JOGO
 *   1. Crie a pasta  jogos/<categoria>/<id>/  com  <id>.html  (ou informe `rota`).
 *   2. Acrescente um objeto em JOGOS abaixo (ou chame
 *      window.NexusStudy.Jogos.addGame(...)). Nada mais precisa mudar:
 *      a seção, o card e a navegação são montados a partir do catálogo.
 */

import {
  SEMESTRES,
  getSemestreAtual,
  setSemestre,
  getDisciplinasDeSemestre,
  resolveIcone,
} from '../src/global.js';

import { sincronizarSemNaURL } from '../shared/js/utils/url.js';
import { preencherAnos, criarSemestreSelect } from '../shared/js/utils/dom.js';
import { injetarLogo }         from '../shared/js/utils/logo.js';
import '../src/session-tracker.js';   // tempo de estudo do dashboard (mesmo mecanismo do Resumo/Quiz; sobe sozinho, sem contador novo)
import { iniciarIAJogos }      from './template/ia-games.js';
import { arteSvg, ICONE }      from './jogo-arte.js';
import {
  Sound,
  audio,
  installAudioRecovery,
  playSound,
} from '../shared/js/audio/audio-api.js';

// ── Assistente Nexus (IA) ─────────────────────────────────────
// Chat em modo livre na central de jogos; cada jogo registra o próprio banco.
iniciarIAJogos();

'use strict';

/* ═══════════════════════════════════════════
   1. CATÁLOGO
═══════════════════════════════════════════ */

const CATEGORIAS = [
  {
    id: 'estudo',
    titulo: 'Jogos de estudo',
    descricao: 'Fixe o conteúdo das disciplinas jogando.',
    usaDisciplina: true,
  },
  {
    id: 'entretenimento',
    titulo: 'Jogos de entretenimento',
    descricao: 'Para fazer uma pausa entre uma sessão de estudo e outra.',
    usaDisciplina: false,
    /* subcategorias (pastas dentro de jogos/entretenimento/); hue = cor dos cards */
    subs: [
      { id: 'arcade',     nome: 'Arcade',         hue: 320 },
      { id: 'puzzle',     nome: 'Quebra-cabeças', hue: 190 },
      { id: 'classicos',  nome: 'Clássicos',      hue: 42  },
      { id: 'estrategia', nome: 'Estratégia',     hue: 150 },
      { id: 'casual',     nome: 'Casual',         hue: 12  },
    ],
    vazio: {
      titulo: 'Nenhum jogo por aqui ainda',
      texto: 'Os jogos de entretenimento vão aparecer nesta seção assim que forem lançados.',
    },
  },
];

/* Campos: id, nome, categoria, descricao, duracao, arte (chave de jogo-arte.js),
   cor/rgb (cor do jogo), status ('disponível' | 'em breve'),
   rota (opcional; padrão `${id}/${id}.html` dentro da pasta da categoria). */
const JOGOS = [
  {
    id: 'flashcard', nome: 'Flashcard', categoria: 'estudo', status: 'disponível',
    descricao: 'Revise conceitos com cartões de frente e verso e repetição espaçada.',
    duracao: '5–15 min', arte: 'flashcard', cor: '#4ade96', rgb: '74,222,150',
  },
  {
    id: 'verdadeiro-falso', nome: 'Verdadeiro ou Falso', categoria: 'estudo', status: 'disponível',
    descricao: 'Decida se cada afirmação sobre a disciplina é verdadeira ou falsa.',
    duracao: '3–5 min', arte: 'vdd_falso', cor: '#b39dfa', rgb: '179,157,250',
    rota: 'vdd_falso/vdd_falso.html',
  },
  {
    id: 'completar_frase', nome: 'Complete a Frase', categoria: 'estudo', status: 'disponível',
    descricao: 'Preencha a lacuna da frase com o termo certo da disciplina.',
    duracao: '4–7 min', arte: 'completar_frase', cor: '#6aa8ff', rgb: '106,168,255',
  },
  {
    id: 'show_milhao', nome: 'Show do Milhão', categoria: 'estudo', status: 'disponível',
    descricao: 'Responda 15 perguntas com ajudas disponíveis e chegue ao topo.',
    duracao: '10–20 min', arte: 'show_milhao', cor: '#ffb04d', rgb: '255,176,77',
  },
  {
    id: 'associacao', nome: 'Associação', categoria: 'estudo', status: 'disponível',
    descricao: 'Ligue cada conceito à sua definição, par a par.',
    duracao: '4–8 min', arte: 'associacao', cor: '#ff7ab8', rgb: '255,122,184',
  },

  /* ── Entretenimento: cor e miniatura vêm da subcategoria (`sub`) ── */
  { id: 'flappy_bird', nome: 'Flappy Bird', categoria: 'entretenimento', sub: 'arcade', status: 'disponível',
    descricao: 'Voe entre os canos sem encostar. Toque no momento certo.',
    arte: 'flappy_bird', rota: 'arcade/flappy_bird/flappy_bird.html' },
  { id: 'jumpy', nome: 'Pulo Alto', categoria: 'entretenimento', sub: 'arcade', status: 'disponível',
    descricao: 'Pule de plataforma em plataforma e suba o mais alto que conseguir.',
    arte: 'jumpy', rota: 'arcade/jumpy/jumpy.html' },
  { id: 'tetris', nome: 'Tetris', categoria: 'entretenimento', sub: 'arcade', status: 'disponível',
    descricao: 'Encaixe as peças, complete linhas e aguente o ritmo.',
    arte: 'tetris', rota: 'arcade/tetris/tetris.html' },
  { id: 'breakout', nome: 'Quebra-Blocos', categoria: 'entretenimento', sub: 'arcade', status: 'disponível',
    descricao: 'Rebata a bola com a raquete e quebre todos os blocos.',
    arte: 'breakout', rota: 'arcade/breakout/breakout.html' },
  { id: 'stack_tower', nome: 'Torre de Blocos', categoria: 'entretenimento', sub: 'arcade', status: 'disponível',
    descricao: 'Empilhe os blocos no tempo certo e construa a torre mais alta.',
    arte: 'stack_tower', rota: 'arcade/stack_tower/stack_tower.html' },
  { id: 'piano_tap', nome: 'Piano Tap', categoria: 'entretenimento', sub: 'arcade', status: 'disponível',
    descricao: 'Toque nas teclas no ritmo, antes que elas passem.',
    arte: 'piano_tap', rota: 'arcade/piano_tap/piano_tap.html' },
  { id: 'pac_man', nome: 'Pac-Man', categoria: 'entretenimento', sub: 'arcade', status: 'disponível',
    descricao: 'Coma todos os pontos do labirinto e fuja dos fantasmas.',
    arte: 'pac_man', rota: 'arcade/pac_man/pac_man.html' },
  { id: 'snake', nome: 'Cobrinha', categoria: 'entretenimento', sub: 'classicos', status: 'disponível',
    descricao: 'Guie a cobrinha, coma e cresça sem bater em nada.',
    arte: 'snake', rota: 'classicos/snake/snake.html' },
  { id: 'jogo_velha', nome: 'Jogo da Velha', categoria: 'entretenimento', sub: 'classicos', status: 'disponível',
    descricao: 'Alinhe três símbolos antes do adversário.',
    arte: 'jogo_velha', rota: 'classicos/jogo_velha/jogo_velha.html' },
  { id: 'memory_match', nome: 'Jogo da Memória', categoria: 'entretenimento', sub: 'puzzle', status: 'disponível',
    descricao: 'Encontre todos os pares virando duas cartas por vez.',
    arte: 'memory_match', rota: 'puzzle/memory_match/memory_match.html' },
  { id: 'slide_puzzle', nome: 'Quebra-Cabeça Deslizante', categoria: 'entretenimento', sub: 'puzzle', status: 'disponível',
    descricao: 'Deslize as peças até montar a imagem.',
    arte: 'slide_puzzle', rota: 'puzzle/slide_puzzle/slide_puzzle.html' },
  { id: 'water_sort', nome: 'Tubos de Cores', categoria: 'entretenimento', sub: 'puzzle', status: 'disponível',
    descricao: 'Separe os líquidos até cada tubo ter uma única cor.',
    arte: 'water_sort', rota: 'puzzle/water_sort/water_sort.html' },
  { id: 'campo_minado', nome: 'Campo Minado', categoria: 'entretenimento', sub: 'puzzle', status: 'disponível',
    descricao: 'Abra o campo sem acionar nenhuma mina.',
    arte: 'campo_minado', rota: 'puzzle/campo_minado/campo_minado.html' },
  { id: 'sokoban', nome: 'Sokoban', categoria: 'entretenimento', sub: 'puzzle', status: 'disponível',
    descricao: 'Empurre as caixas até os alvos, sem travar o caminho.',
    arte: 'sokoban', rota: 'puzzle/sokoban/sokoban.html' },
  { id: 'batalha_naval', nome: 'Batalha Naval', categoria: 'entretenimento', sub: 'estrategia', status: 'disponível',
    descricao: 'Afunde a frota inimiga antes que ela afunde a sua.',
    arte: 'batalha_naval', rota: 'estrategia/batalha_naval/batalha_naval.html' },
  { id: 'solitario', nome: 'Paciência', categoria: 'entretenimento', sub: 'casual', status: 'disponível',
    descricao: 'Organize as cartas em ordem e complete as fundações.',
    arte: 'solitario', rota: 'casual/solitario/solitario.html' },
];

/* Cor do jogo a partir do tom (hue) da subcategoria. */
function _hslParaRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
}
function _corDaSub(cat, subId) {
  const sub = cat.subs?.find((x) => x.id === subId);
  if (!sub) return null;
  const [r, g, b] = _hslParaRgb(sub.hue, 85, 68);
  return { cor: `rgb(${r},${g},${b})`, rgb: `${r},${g},${b}`, nome: sub.nome };
}


/* ═══════════════════════════════════════════
   2. ESTADO E ELEMENTOS
═══════════════════════════════════════════ */

const $ = (id) => document.getElementById(id);
const state = { jogoAberto: null };

const _esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ═══════════════════════════════════════════
   3. CATÁLOGO NA TELA
═══════════════════════════════════════════ */

function construirCard(game, indice) {
  const breve = game.status === 'em breve';
  const cat = categoriaDe(game);
  const tom = game.sub ? _corDaSub(cat, game.sub) : null;
  if (tom) { game.cor = tom.cor; game.rgb = tom.rgb; }
  const card = document.createElement('article');
  card.className = 'card' + (breve ? ' card--breve' : '');
  card.dataset.id = game.id;
  card.style.setProperty('--c',  game.cor ?? '#4dd9b4');
  card.style.setProperty('--cr', game.rgb ?? '77,217,180');
  card.style.animationDelay = `${Math.min(indice, 8) * 45}ms`;
  if (!breve) {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Jogar ${game.nome}`);
  } else {
    card.setAttribute('aria-label', `${game.nome} (em breve)`);
  }

  card.innerHTML = `
    <div class="card__arte">
      ${arteSvg(game.arte, game.sub)}
      ${breve ? '<span class="card__etiqueta">Em breve</span>' : (tom ? `<span class="card__etiqueta">${_esc(tom.nome)}</span>` : '')}
    </div>
    <div class="card__col">
      <div class="card__corpo">
        <h3 class="card__nome">${_esc(game.nome)}</h3>
        <p class="card__desc">${_esc(game.descricao)}</p>
      </div>
      <div class="card__rodape">
        <span class="card__duracao">${game.duracao ? `${ICONE.relogio}${_esc(game.duracao)}` : ''}</span>
        <span class="card__jogar">${breve ? 'Em breve' : `${ICONE.play}Jogar`}</span>
      </div>
    </div>`;

  if (!breve) {
    const abrir = () => { playSound('click', 'jogo'); iniciarJogo(game); };
    card.addEventListener('mouseenter', () => playSound('hover', 'jogo'));
    card.addEventListener('click', abrir);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); }
    });
  }
  return card;
}

function preencherGrade(grade, cat, filtro) {
  grade.innerHTML = '';
  JOGOS.filter((g) => g.categoria === cat.id && (!filtro || filtro === 'todos' || g.sub === filtro))
    .forEach((g, i) => grade.appendChild(construirCard(g, i)));
}

function construirSecao(cat, jogos) {
  const sec = document.createElement('section');
  sec.className = 'secao';
  sec.dataset.categoria = cat.id;
  sec.setAttribute('aria-labelledby', `sec-${cat.id}`);
  sec.innerHTML = `
    <div class="secao__cab">
      <h2 class="secao__titulo" id="sec-${cat.id}">${_esc(cat.titulo)}</h2>
      <p class="secao__desc">${_esc(cat.descricao)}</p>
    </div>`;

  if (jogos.length === 0) {
    const v = cat.vazio ?? { titulo: 'Nenhum jogo por aqui ainda', texto: '' };
    const caixa = document.createElement('div');
    caixa.className = 'vazio';
    caixa.innerHTML = `
      <div class="vazio__ico">${ICONE.gamepad}</div>
      <div>
        <p class="vazio__titulo">${_esc(v.titulo)}</p>
        <p class="vazio__texto">${_esc(v.texto)}</p>
      </div>`;
    sec.appendChild(caixa);
    return sec;
  }

  const grade = document.createElement('div');
  grade.className = 'grade';

  /* Filtro por subcategoria: só aparece quando a categoria tem subcategorias com jogos. */
  const subsUsadas = (cat.subs ?? []).filter((x) => jogos.some((g) => g.sub === x.id));
  if (subsUsadas.length > 1) {
    const chips = document.createElement('div');
    chips.className = 'chips';
    chips.setAttribute('role', 'group');
    chips.setAttribute('aria-label', `Filtrar ${cat.titulo.toLowerCase()}`);
    chips.innerHTML = [{ id: 'todos', nome: 'Todos' }, ...subsUsadas]
      .map((x, i) => `<button type="button" class="chip" data-filtro="${x.id}" aria-pressed="${i === 0}">${_esc(x.nome)}</button>`).join('');
    chips.addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b) return;
      playSound('select', 'jogo');
      chips.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
      preencherGrade(grade, cat, b.dataset.filtro);
    });
    sec.appendChild(chips);
  }

  preencherGrade(grade, cat, 'todos');
  sec.appendChild(grade);
  return sec;
}

function render() {
  const raiz = $('catalogo');
  raiz.innerHTML = '';
  CATEGORIAS.forEach((cat) => {
    raiz.appendChild(construirSecao(cat, JOGOS.filter((g) => g.categoria === cat.id)));
  });
}

/* ═══════════════════════════════════════════
   4. ABRIR UM JOGO
═══════════════════════════════════════════ */

function categoriaDe(game) {
  return CATEGORIAS.find((c) => c.id === game.categoria) ?? CATEGORIAS[0];
}

/** Caminho do jogo a partir da pasta games/ (ex.: jogos/estudo/flashcard/flashcard.html). */
function resolverRota(game) {
  return `jogos/${game.categoria}/${game.rota ?? `${game.id}/${game.id}.html`}`;
}

function navegar(game, disciplinaArquivo, semestre) {
  const q = new URLSearchParams();
  if (disciplinaArquivo) q.set('disc', disciplinaArquivo);
  if (semestre) q.set('sem', semestre);
  const qs = q.toString();
  window.location.href = resolverRota(game) + (qs ? `?${qs}` : '');
}

function iniciarJogo(game) {
  if (categoriaDe(game).usaDisciplina) abrirSeletor(game);
  else navegar(game, null, null);
}

/* ═══════════════════════════════════════════
   5. ESCOLHA DE DISCIPLINA
═══════════════════════════════════════════ */

function abrirSeletor(game) {
  const dlg = $('seletor');
  const sem = getSemestreAtual();
  const discs = getDisciplinasDeSemestre(sem);
  state.jogoAberto = game;

  const caixa = $('seletor-caixa');
  caixa.style.setProperty('--c',  game.cor ?? '#4dd9b4');
  caixa.style.setProperty('--cr', game.rgb ?? '77,217,180');
  $('seletor-arte').innerHTML = arteSvg(game.arte);
  $('seletor-titulo').textContent = game.nome;
  $('seletor-desc').textContent = game.descricao;
  $('seletor-fechar').innerHTML = ICONE.fechar;

  const lista = $('seletor-lista');
  const rotulo = $('seletor-rotulo');
  lista.innerHTML = '';

  if (!discs.length) {
    rotulo.classList.add('hidden');
    lista.innerHTML = `<p class="seletor__vazio">Ainda não há disciplinas cadastradas para <strong>${_esc(sem)}</strong>. Troque o semestre no topo da página.</p>`;
  } else {
    rotulo.classList.remove('hidden');
    discs.forEach((d) => {
      const arquivo = d.arquivo ?? d.id;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'disc';
      b.innerHTML = `
        <span class="disc__ico" aria-hidden="true">${resolveIcone(d.icone)}</span>
        <span class="disc__nome">${_esc(d.apelido ?? d.nome)}</span>
        <span class="disc__seta" aria-hidden="true">${ICONE.play}</span>`;
      b.title = d.nome;
      b.addEventListener('mouseenter', () => playSound('hover', 'jogo'));
      b.addEventListener('click', () => { playSound('click', 'jogo'); navegar(game, arquivo, sem); });
      lista.appendChild(b);
    });
  }

  playSound('openModal', 'jogo');
  dlg.classList.remove('saindo');
  if (!dlg.open) dlg.showModal();
  /* foco na primeira disciplina (ou no fechar, se não houver) */
  (lista.querySelector('.disc') ?? $('seletor-fechar')).focus();
}

function fecharSeletor() {
  const dlg = $('seletor');
  if (!dlg.open || dlg.classList.contains('saindo')) return;
  playSound('closeModal', 'jogo');
  dlg.classList.add('saindo');
  setTimeout(() => { dlg.close(); dlg.classList.remove('saindo'); }, 150);
}

function configurarSeletor() {
  const dlg = $('seletor');
  $('seletor-fechar').addEventListener('click', fecharSeletor);
  /* clique no fundo escuro (fora da caixa) fecha */
  dlg.addEventListener('click', (e) => { if (e.target === dlg) fecharSeletor(); });
  /* Esc: usa a animação de saída em vez do corte seco */
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); fecharSeletor(); });
}

/* ═══════════════════════════════════════════
   6. SELETOR DE SEMESTRE — topbar
═══════════════════════════════════════════ */

function setupSemestreSelect() {
  const semParam = new URLSearchParams(location.search).get('sem');
  if (semParam && SEMESTRES.includes(semParam)) setSemestre(semParam);

  sincronizarSemNaURL(getSemestreAtual());

  criarSemestreSelect('semestre-wrap', sem => {
    playSound('select', 'jogo');
    setSemestre(sem);
    sincronizarSemNaURL(sem, 'push');
    /* a escolha de disciplina lê getSemestreAtual() ao abrir — nada mais a fazer */
  });

  requestAnimationFrame(() => {
    const sel = document.querySelector('#semestre-wrap select');
    if (sel) sel.addEventListener('mousedown', () => playSound('click', 'jogo'));
  });
}

/* ═══════════════════════════════════════════
   7. MODAL CONFIG — Jogos (Flashcard SRS)
═══════════════════════════════════════════ */

function _mostrarToastJogos(msg) {
  const OFFSET   = 12;
  const DURATION = 2800;
  const existentes = document.querySelectorAll('.nexus-toast');
  let nextBottom   = 32;
  existentes.forEach(t => { nextBottom += t.offsetHeight + OFFSET; });

  const t = document.createElement('div');
  t.className   = 'nexus-toast';
  t.textContent = msg;
  t.style.bottom = `${nextBottom}px`;
  document.body.appendChild(t);

  requestAnimationFrame(() => t.classList.add('nexus-toast--show'));
  setTimeout(() => {
    t.classList.remove('nexus-toast--show');
    t.addEventListener('transitionend', () => t.remove(), { once: true });
  }, DURATION);
}

function _confirmarJogos(btn, callback) {
  if (btn.dataset.confirmando === 'true') {
    btn.dataset.confirmando = 'false';
    btn.textContent = btn.dataset.textoOriginal;
    btn.classList.remove('modal-btn--danger');
    callback();
    return;
  }
  btn.dataset.textoOriginal = btn.textContent;
  btn.dataset.confirmando   = 'true';
  btn.textContent = 'Tem certeza?';
  btn.classList.add('modal-btn--danger');

  setTimeout(() => {
    if (!document.body.contains(btn)) return;
    if (btn.dataset.confirmando === 'true') {
      btn.dataset.confirmando = 'false';
      btn.textContent = btn.dataset.textoOriginal;
      btn.classList.remove('modal-btn--danger');
    }
  }, 3000);
}

function _abrirModalConfigJogos() {
  playSound('openModal', 'jogo');
  document.querySelector('#jcfg-overlay')?.remove();

  const sem         = getSemestreAtual();
  const disciplinas = getDisciplinasDeSemestre(sem);

  const overlay = document.createElement('div');
  overlay.id        = 'jcfg-overlay';
  overlay.className = 'jcfg-overlay';

  overlay.innerHTML = `
    <div class="jcfg-box" role="dialog" aria-modal="true" aria-labelledby="jcfg-title">

      <div class="jcfg-header">
        <h2 class="jcfg-title">
          ${ICONE.engrenagem}
          Jogos — Configurações
        </h2>
        <button class="jcfg-close" id="jcfg-close" aria-label="Fechar">${ICONE.fechar}</button>
      </div>

      <div class="jcfg-body">

        <div class="jcfg-section">
          <p class="jcfg-section-title">Flashcard</p>

          <div class="jcfg-row">
            <div class="jcfg-row__label">
              Limpar disciplina
              <small class="jcfg-row__hint">
                Zera o progresso de repetição espaçada de uma disciplina específica.
              </small>
            </div>
            <div class="jcfg-disc-btns" id="jcfg-disc-btns"></div>
          </div>

          <div class="jcfg-row">
            <div class="jcfg-row__label">
              Limpar tudo
              <small class="jcfg-row__hint">
                Zera o SRS de todas as disciplinas do semestre atual.
              </small>
            </div>
            <button class="jcfg-btn jcfg-btn--danger" id="jcfg-btn-limpar-tudo">Limpar tudo</button>
          </div>
        </div>

      </div>

      <div class="jcfg-footer">
        <button class="jcfg-btn jcfg-btn--ghost" id="jcfg-btn-fechar">Fechar</button>
      </div>

    </div>`;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('jcfg--open'));

  /* ── Resetar SRS ── */
  async function _resetarSRS(discId) {
    try {
      const mod = await import('./jogos/estudo/flashcard/flashcard.js');
      mod?.invalidarCacheSRS?.(discId ?? null);
    } catch (err) {
      console.warn('[SRS] flashcard.js não encontrado:', err?.message);
    }
  }

  /* ── Botões por disciplina ── */
  const discBtns = overlay.querySelector('#jcfg-disc-btns');
  disciplinas.forEach(disc => {
    const btn = document.createElement('button');
    btn.className   = 'jcfg-btn jcfg-btn--ghost';
    btn.textContent = disc.apelido;
    btn.title       = `Limpar SRS de ${disc.nome}`;
    btn.addEventListener('click', () => {
      _confirmarJogos(btn, async () => {
        await _resetarSRS(disc.id);
        _mostrarToastJogos(`SRS de ${disc.apelido} apagado.`);
      });
    });
    discBtns?.appendChild(btn);
  });

  /* ── Limpar tudo ── */
  overlay.querySelector('#jcfg-btn-limpar-tudo')?.addEventListener('click', function () {
    _confirmarJogos(this, async () => {
      await _resetarSRS(null);
      _mostrarToastJogos('SRS de todas as disciplinas apagado.');
    });
  });

  /* ── Fechar ── */
  function _fechar() {
    playSound('closeModal', 'jogo');
    overlay.classList.add('jcfg--closing');
    overlay.classList.remove('jcfg--open');
    setTimeout(() => overlay.remove(), 220);
  }

  overlay.querySelector('#jcfg-close')?.addEventListener('click', _fechar);
  overlay.querySelector('#jcfg-btn-fechar')?.addEventListener('click', () => {
    playSound('click', 'jogo'); _fechar();
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) _fechar(); });
  document.addEventListener('keydown', function _esc(e) {
    if (e.key === 'Escape') { _fechar(); document.removeEventListener('keydown', _esc); }
  }, { once: true });
}

function _injetarBtnConfigJogos() {
  // Injeta na topbar, ao lado do semestre-wrap
  const topbarRight = document.querySelector('.topbar__right');
  if (!topbarRight) return;

  const btn = document.createElement('button');
  btn.className = 'jogo-cfg-btn';
  btn.id        = 'btn-jogos-config';
  btn.title     = 'Configurações dos Jogos';
  btn.setAttribute('aria-label', 'Configurações dos Jogos');
  btn.innerHTML = ICONE.engrenagem;

  btn.addEventListener('mouseenter', () => playSound('hover', 'jogo'));
  btn.addEventListener('click', () => {
    playSound('click', 'jogo');
    _abrirModalConfigJogos();
  });

  topbarRight.appendChild(btn);
}


/* ═══════════════════════════════════════════
   8. INIT
═══════════════════════════════════════════ */

function init() {
  Sound.init();
  installAudioRecovery({ Sound, audio });

  injetarLogo({
    destino:  '#sidebar-logo-wrap',
    tamanho:  36,
    layout:   'stacked',
    srcBase:  '../shared/img/logo.png',
    linkHref: '../index.html',
    playSound,
  });
  setupSemestreSelect();
  render();
  configurarSeletor();
  _injetarBtnConfigJogos();
  preencherAnos(); // preenche footer-year se existir
}

init();

/* ═══════════════════════════════════════════
   9. API PÚBLICA
═══════════════════════════════════════════ */

window.NexusStudy = window.NexusStudy || {};
window.NexusStudy.Jogos = {
  /** Acrescenta um jogo ao catálogo (use `categoria: 'estudo' | 'entretenimento'`). */
  addGame(game)            { JOGOS.push({ categoria: 'estudo', status: 'disponível', ...game }); render(); },
  updateStatus(id, status) { const g = JOGOS.find(j => j.id === id); if (g) { g.status = status; render(); } },
  getFiltered()            { return [...JOGOS]; },
};
