// @ts-nocheck
/* ═══════════════════════════════════════════════════════════
   NEXUS STUDY — quiz/quiz.js  (redesign completo)
   Lógica de interação da tela de seleção de disciplinas.
   ═══════════════════════════════════════════════════════════ */

import {
  getSemestreAtual,
  setSemestre,
  getDisciplinasDeSemestre,
  getConfigs,
  setConfigs,
  limparDadosQuiz,
  resolveIcone,
} from '../src/global.js';

import { DISC_CORES }                       from '../shared/js/themes/cores.js';
import { sincronizarSemNaURL }              from '../shared/js/utils/url.js';
import { criarSemestreSelect, preencherAnos } from '../shared/js/utils/dom.js';
import { injetarLogo }                      from '../shared/js/utils/logo.js';
import { Sound, audio, installAudioRecovery, playSound } from '../shared/js/audio/audio-api.js';

/* NAVIGATION ANALYTICS — importa o tracker para garantir que
   window.__nexusPageEnter seja registrado nesta página.
   O tracker inicializa automaticamente via auto-boot interno. */
import '../src/session-tracker.js';

/* Rótulos dos modos: fonte única em quiz/disciplinas/modos.js. */
import { getModo, getModosOrdenados } from './disciplinas/modos.js';
import { carregarIA } from '../shared/js/ia/carregar-ia.js';

(function () {

  /* ══════════════════════════════════════════════
     IA (RESUMO) — mesmo padrão do index.js
  ══════════════════════════════════════════════ */
  window.__NEXUS_CONTEXT__ = { tipos: ['resumo'] };


  /* ══════════════════════════════════════════════
     ÍCONES DE DISCIPLINA (SVG) — ajuste de estilo

     Antes, `.disc-card__icon` recebia um emoji (texto) e seu
     tamanho/alinhamento era controlado inteiramente via
     font-size/line-height no CSS do card.

     Agora `.disc-card__icon` recebe um <svg> (resolveIcone()).
     Para que o ícone SVG ocupe o mesmo espaço visual do emoji
     anterior — sem precisar tocar no arquivo CSS do projeto —
     injetamos aqui uma regra mínima e específica ao contexto
     (`.disc-card__icon svg`) que:
       • dimensiona o SVG em `em`, herdando o font-size já
         definido para `.disc-card__icon` (mesmo tamanho do
         emoji antigo);
       • usa `color: currentColor` implícito via `stroke`/`fill`
         no próprio SVG (definidos em _ICONES no global.js),
         herdando a cor do elemento pai — preservando as cores
         já aplicadas por `--card-accent` etc.;
       • mantém alinhamento vertical equivalente ao de um
         glifo de texto (emoji) centralizado no bloco.
     Nenhuma outra regra do projeto é alterada.
  ══════════════════════════════════════════════ */
  function _injetarEstiloIconeDisciplina() {
    if (document.getElementById('disc-icon-svg-style')) return;
    const style = document.createElement('style');
    style.id = 'disc-icon-svg-style';
    style.textContent = `
      .disc-card__icon {
        color: var(--card-accent, currentColor);
      }
      .disc-card__icon svg {
        width: 1em;
        height: 1em;
        display: block;
        vertical-align: middle;
      }
    `;
    document.head.appendChild(style);
  }

  /* ══════════════════════════════════════════════
     CANVAS DE FUNDO — partículas geométricas
  ══════════════════════════════════════════════ */
  function _initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [], animId;

    const PARTICLE_COUNT = window.innerWidth < 600 ? 40 : 70;
    const COLORS = ['rgba(108,99,255,', 'rgba(61,217,194,', 'rgba(247,201,72,', 'rgba(255,107,138,'];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function createParticle() {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x:     Math.random() * W,
        y:     Math.random() * H,
        // Partículas menores e mais lentas — menos flickering visual
        size:  Math.random() * 1.2 + 0.3,
        vx:    (Math.random() - 0.5) * 0.15,
        vy:    (Math.random() - 0.5) * 0.15,
        // Alpha fixo por partícula — sem variação dinâmica que cause shimmer
        alpha: Math.random() * 0.3 + 0.08,
        color,
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Grid de linhas sutis
      ctx.strokeStyle = 'rgba(255,255,255,0.018)';
      ctx.lineWidth = 0.5;
      const GRID = 80;
      for (let x = 0; x < W; x += GRID) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += GRID) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Partículas — simples pontos com alpha fixo, sem variação por frame
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        // Wraparound
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
        if (p.y < -5) p.y = H + 5;
        if (p.y > H + 5) p.y = -5;
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();

    window.addEventListener('resize', () => { resize(); });

    // Pausa quando aba não é visível (economiza CPU)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(animId); }
      else { draw(); }
    });
  }

  /* ══════════════════════════════════════════════
     HOME — dados reais (Firebase via quiz_intelligence.js)
     Nenhum dado mockado: tudo vem de window.NexusQuizIntelligence,
     que já é a fonte oficial usada pelo Dashboard (Camada 4,
     somente leitura, mesmo cache/lógica já existentes).
  ══════════════════════════════════════════════ */

  /* Rótulo = `titulo` do modo em modos.js (Questões, Revisão, AVA, ENADE,
     Fixação). Modo desconhecido (ex.: 'simulado' legado) mantém o fallback
     anterior: primeira letra maiúscula. */
  function _formatarModo(modo) {
    if (!modo) return 'Quiz em andamento';
    const cfg = getModo(modo);
    return cfg ? cfg.titulo : (modo.charAt(0).toUpperCase() + modo.slice(1));
  }

  function _uidAtual() {
    try {
      const raw = window.NexusStorage ? window.NexusStorage.get('usuario', null) : null;
      return raw && raw.uid ? raw.uid : null;
    } catch (_) {
      return null;
    }
  }

  function _buscarDisc(sem, arquivo) {
    const lista = getDisciplinasDeSemestre(sem) || [];
    return lista.find(d => d.arquivo === arquivo) || null;
  }

  function _nomeDisciplina(sem, arquivo) {
    const d = _buscarDisc(sem, arquivo);
    return d ? (d.apelido ?? d.nome) : arquivo;
  }

  /* v11: sem dados de disponibilidade, o card inicia direto em Questões
     (não depende mais de disciplinas/disciplina.html). */
  function _hrefDisciplina(sem, arquivo) {
    return _hrefModo(sem, arquivo, 'questoes');
  }

  /* Formata um timestamp real (endedAt, vindo do Firestore) como "dd/mm" */
  function _formatarDataCurta(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}`;
  }

  async function _renderContinuarEstudando(sem) {
    const section = document.getElementById('continue-section');
    const row = document.getElementById('continue-row');
    if (!section || !row) return;

    section.style.display = '';
    row.innerHTML = `<p class="continue-row__empty">Carregando…</p>`;

    const uid = _uidAtual();
    const QI = window.NexusQuizIntelligence;

    if (!uid || !QI) {
      row.innerHTML = `<p class="continue-row__empty">Faça login para ver seu progresso real.</p>`;
      return;
    }

    // Fonte: estado real de retomada (usuarios/{uid}/quiz_respostas/{quizId}),
    // NÃO o histórico de performance. Um registro de performance é uma
    // fotografia imutável que pode sobreviver a um reset (reiniciar()) da
    // tentativa que ele descreve, então "respondidas < totalQuestoes" ali
    // não significa que exista algo para restaurar agora. QI.listarTentativasRetomaveis
    // já filtra por isso — só devolve o que o próprio documento de estado
    // confirma como uma tentativa em aberto.
    let tentativas = [];
    try {
      tentativas = await QI.listarTentativasRetomaveis(uid, sem);
    } catch (e) {
      console.warn('[quiz] falha ao buscar listarTentativasRetomaveis:', e);
    }

    // tentativa retomável mais recente por disciplina (já vem ordenado desc por savedAt)
    const maisRecentePorDisc = {};
    tentativas.forEach(t => {
      if (!maisRecentePorDisc[t.disc]) maisRecentePorDisc[t.disc] = t;
    });

    const emAndamento = Object.values(maisRecentePorDisc)
      .sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0))
      .slice(0, 3);

    if (!emAndamento.length) {
      row.innerHTML = `<p class="continue-row__empty">Você ainda não começou nenhum estudo.</p>`;
      return;
    }

    row.innerHTML = '';

    emAndamento.forEach((t, idx) => {
      const discMeta = _buscarDisc(sem, t.disc);
      if (!discMeta) return;

      const cor = _resolverCorCard(discMeta.arquivo, idx);
      const nome = discMeta.apelido ?? discMeta.nome;
      const icone = resolveIcone(discMeta.icone);
      const pct = Math.round((t.respondidas / t.totalQuestoes) * 100);
      // Leva o modo junto: é o que permite ao engine (quiz_engine.js lê
      // window.__NEXUS_QUIZ_MODO__ || URLSearchParams(location.search).get('modo'))
      // restaurar a MESMA tentativa em vez de simplesmente reabrir a
      // disciplina do zero na Etapa 2.
      // v11: vai direto ao quiz (antes passava por disciplina.html só para ser redirecionado)
      const href = _hrefModo(sem, discMeta.arquivo, t.modo);
      const dataUltima = _formatarDataCurta(t.savedAt);

      const a = document.createElement('a');
      a.href = href;
      a.className = 'continue-card';
      // Mesmas variáveis de cor usadas nos cards de "Todas as Disciplinas",
      // para manter a identidade visual (ícone com fundo tonalizado na
      // cor da disciplina, brilho no hover, etc.).
      a.style.setProperty('--card-accent',     cor.hex);
      a.style.setProperty('--card-accent-rgb', cor.rgb);
      a.style.setProperty('--card-accent-d',   `rgba(${cor.rgb},0.12)`);
      a.style.setProperty('--card-glow',       `rgba(${cor.rgb},0.22)`);
      a.style.animationDelay = `${0.06 + idx * 0.06}s`;

      a.innerHTML = `
        <div class="continue-card__head">
          <div class="continue-card__icon" aria-hidden="true">${icone}</div>
          <div class="continue-card__heading">
            <h3 class="continue-card__title">${nome}</h3>
            <span class="continue-card__subtitle">${_formatarModo(t.modo)}</span>
          </div>
        </div>
        <div class="continue-card__progress">
          <div class="continue-card__bar">
            <div class="continue-card__bar-fill" style="width:${pct}%;"></div>
          </div>
          <span class="continue-card__pct">${pct}%</span>
        </div>
        <div class="continue-card__footer">
          <span class="continue-card__meta">${dataUltima ? `Última tentativa em ${dataUltima} · ${t.respondidas}/${t.totalQuestoes} questões` : ''}</span>
          <span class="continue-card__arrow-wrap" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      `;

      a.addEventListener('mouseenter', () => playSound('hover', 'quiz'));
      a.addEventListener('click', () => playSound('click', 'quiz'));

      row.appendChild(a);
    });
  }

  function _renderHomeExtras(sem) {
    _renderContinuarEstudando(sem);
  }

  /* ══════════════════════════════════════════════
     CARDS
  ══════════════════════════════════════════════ */

  // Cores de fallback sequenciais para disciplinas sem entrada em cores.js
  // Valores espelham os tokens globais da página (--violet, --cyan, --amber, --rose, --sage)
  const FALLBACK_CORES = [
    { hex: '#6c63ff', rgb: '108,99,255'  },
    { hex: '#3dd9c2', rgb: '61,217,194'  },
    { hex: '#f7c948', rgb: '247,201,72'  },
    { hex: '#ff6b8a', rgb: '255,107,138' },
    { hex: '#5de8a0', rgb: '93,232,160'  },
  ];

  /**
   * Retorna { hex, rgb } para a cor principal de uma disciplina.
   * Prioridade: cores.js (corTema / corTemaRgb) → fallback sequencial.
   */
  function _resolverCorCard(discArquivo, idx) {
    const cores = DISC_CORES?.[discArquivo];
    if (cores?.corTema && cores?.corTemaRgb) {
      return { hex: cores.corTema, rgb: cores.corTemaRgb };
    }
    return FALLBACK_CORES[idx % FALLBACK_CORES.length];
  }

  function _resolverPeriodo(sem) {
    return sem.includes('-') ? sem.split('-')[0] : sem;
  }

  /* ══════════════════════════════════════════════
     DISPONIBILIDADE REAL DOS MODOS (v10)

     Fonte principal: disciplinas/disponibilidade.json, gerado a
     partir dos arquivos de conteúdo reais (ques_*.js) por
     ferramentas/quiz_disponibilidade.py — contém quantas questões
     UTILIZÁVEIS cada modo tem por semestre/disciplina.
     Fallback: catalog.json (booleanos cadastrados à mão).
     Sem nenhuma das duas fontes, o card volta a ser um link para
     a página da disciplina (navegação anterior, inalterada).
  ══════════════════════════════════════════════ */
  let _dispPromise = null;

  function _carregarDisponibilidade() {
    if (_dispPromise) return _dispPromise;
    const buscar = (url) => {
      const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const t = setTimeout(() => ctl && ctl.abort(), 4000);
      return fetch(url, ctl ? { signal: ctl.signal } : undefined)
        .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .finally(() => clearTimeout(t));
    };
    _dispPromise = buscar(new URL('./disciplinas/disponibilidade.json', import.meta.url).href)
      .then(d => ({ fonte: 'contagem', dados: d }))
      .catch(() => buscar(new URL('./disciplinas/catalog.json', import.meta.url).href)
        .then(d => ({ fonte: 'catalogo', dados: d })))
      .catch(() => ({ fonte: 'nenhuma', dados: null }));
    return _dispPromise;
  }

  /* Lista de modos da disciplina: [{ modo, titulo, icone, n, ok, motivo }] */
  function _modosDaDisciplina(disp, sem, arquivo) {
    const todos = getModosOrdenados();
    const entrada = disp && disp.dados && disp.dados[sem] ? disp.dados[sem][arquivo] : null;
    return todos.map(m => {
      let n = null, ok = false, motivo = '';
      if (!entrada) {
        motivo = 'Conteúdo ainda não publicado';
      } else if (disp.fonte === 'contagem') {
        n = Number(entrada[m.id]) || 0;
        ok = n > 0;
        if (!ok) motivo = 'Sem questões neste semestre';
      } else {
        ok = entrada[m.id] === true;
        if (!ok) motivo = 'Sem questões neste semestre';
      }
      return { modo: m.id, titulo: m.titulo, icone: m.icone, n, ok, motivo };
    });
  }

  function _hrefModo(sem, arquivo, modo) {
    return `template/template.html?disc=${encodeURIComponent(arquivo)}` +
           `&modo=${encodeURIComponent(modo)}&sem=${encodeURIComponent(sem)}`;
  }

  const _SETA_SVG = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
    </svg>`;
  const _CHEVRON_SVG = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9"/>
    </svg>`;

  /* ══════════════════════════════════════════════
     PAINEL DE MODOS (v11)
     Janela (computador) / folha inferior (celular) com um bloco
     por modo. Disponível = link direto para o quiz. Indisponível =
     bloco apagado, tracejado, sem link e com o motivo escrito.
  ══════════════════════════════════════════════ */
  let _painelEl = null;
  let _painelOrigem = null;
  let _painelKey = null;

  function _fecharPainelModos({ restaurarFoco = true } = {}) {
    if (!_painelEl) return;
    const el = _painelEl;
    _painelEl = null;
    el.classList.remove('mp--aberto');
    document.body.classList.remove('mp-aberto');
    document.removeEventListener('keydown', _painelKey, true);
    // tira ?disc= da URL (atualizar a página não reabre o painel)
    try {
      const u = new URL(location.href);
      if (u.searchParams.has('disc')) { u.searchParams.delete('disc'); history.replaceState(null, '', u); }
    } catch (_) {}
    setTimeout(() => el.remove(), 220);
    if (restaurarFoco && _painelOrigem && _painelOrigem.focus) _painelOrigem.focus();
  }

  function abrirPainelModos({ sem, disc, label, cor, icone, modos, origem }) {
    if (_painelEl) _fecharPainelModos({ restaurarFoco: false });
    _painelOrigem = origem || null;

    const el = document.createElement('div');
    el.className = 'mp';
    el.style.setProperty('--card-accent',     cor.hex);
    el.style.setProperty('--card-accent-rgb', cor.rgb);
    el.style.setProperty('--card-accent-d',   `rgba(${cor.rgb},0.14)`);
    const dispN = modos.filter(m => m.ok).length;
    el.innerHTML = `
      <div class="mp__fundo" data-fechar></div>
      <div class="mp__caixa" role="dialog" aria-modal="true" aria-labelledby="mp-titulo">
        <span class="mp__alca" aria-hidden="true"></span>
        <header class="mp__topo">
          <span class="mp__icone" aria-hidden="true">${icone}</span>
          <div class="mp__titulos">
            <h2 class="mp__titulo" id="mp-titulo">${label}</h2>
            <p class="mp__sub">${disc.nome} · ${dispN} de ${modos.length} modos disponíveis</p>
          </div>
          <button type="button" class="mp__fechar" data-fechar aria-label="Fechar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </header>
        <p class="mp__dica">Escolha o modo de estudo</p>
        <ul class="mp__grade"></ul>
      </div>`;
    const grade = el.querySelector('.mp__grade');
    modos.forEach(m => {
      const cfg = getModo(m.modo);
      const desc = cfg && cfg.descricao ? cfg.descricao : '';
      const li = document.createElement('li');
      const corpo = `
        <span class="mp-modo__icone" aria-hidden="true">${m.icone}</span>
        <span class="mp-modo__texto">
          <span class="mp-modo__nome">${m.titulo}</span>
          <span class="mp-modo__desc">${desc}</span>
          <span class="mp-modo__info">${m.ok ? (m.n ? `${m.n} questões` : 'Disponível') : m.motivo}</span>
        </span>
        ${m.ok ? `<span class="mp-modo__ir" aria-hidden="true">${_SETA_SVG}</span>` : ''}`;
      if (m.ok) {
        const a = document.createElement('a');
        a.className = 'mp-modo';
        a.href = _hrefModo(sem, disc.arquivo, m.modo);
        a.dataset.modo = m.modo;
        a.innerHTML = corpo;
        a.addEventListener('mouseenter', () => playSound('hover', 'quiz'));
        a.addEventListener('click', () => playSound('click', 'quiz'));
        li.appendChild(a);
      } else {
        const d = document.createElement('div');
        d.className = 'mp-modo mp-modo--off';
        d.dataset.modo = m.modo;
        d.setAttribute('aria-disabled', 'true');
        d.innerHTML = corpo;
        li.appendChild(d);
      }
      grade.appendChild(li);
    });

    el.addEventListener('click', e => { if (e.target.closest('[data-fechar]')) { playSound('click', 'quiz'); _fecharPainelModos(); } });
    _painelKey = function (e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); _fecharPainelModos(); return; }
      if (e.key === 'Tab') {  // mantém o foco dentro do painel
        const f = [...el.querySelectorAll('a[href], button')].filter(x => !x.disabled);
        if (!f.length) return;
        const p = f[0], u = f[f.length - 1];
        if (e.shiftKey && document.activeElement === p) { e.preventDefault(); u.focus(); }
        else if (!e.shiftKey && document.activeElement === u) { e.preventDefault(); p.focus(); }
      }
    };
    document.addEventListener('keydown', _painelKey, true);
    document.body.appendChild(el);
    document.body.classList.add('mp-aberto');
    _painelEl = el;
    requestAnimationFrame(() => {
      el.classList.add('mp--aberto');
      const primeiro = el.querySelector('a.mp-modo') || el.querySelector('.mp__fechar');
      if (primeiro) primeiro.focus({ preventScroll: true });
    });
  }

  /* Volta de uma sessão (ou link antigo): quiz.html?sem=X&disc=Y abre o
     painel da disciplina Y; se ela não tem painel (1 modo / sem conteúdo),
     apenas rola até o card e o destaca. */
  function _aplicarDeepLinkDisciplina() {
    let alvo;
    try { alvo = new URL(location.href).searchParams.get('disc'); } catch (_) { return; }
    if (!alvo) return;
    const card = [...document.querySelectorAll('.disc-card')].find(c => c.dataset.arquivo === alvo);
    if (!card) return;
    if (card._abrirPainel) card._abrirPainel();
    else { card.classList.add('disc-card--destaque'); card.scrollIntoView({ block: 'center' }); }
    try { const u = new URL(location.href); u.searchParams.delete('disc'); history.replaceState(null, '', u); } catch (_) {}
  }

  let _cardsGeracao = 0;

  async function gerarCards(sem) {
    const geracao = ++_cardsGeracao;
    const grid    = document.getElementById('disciplines-grid');
    const msgEl   = document.getElementById('disciplines-empty');
    const discs   = getDisciplinasDeSemestre(sem);

    // Remove cards antigos
    grid.querySelectorAll('.disc-card').forEach(c => c.remove());

    if (!discs.length) {
      msgEl.textContent  = `Nenhuma disciplina cadastrada para o período ${sem}.`;
      msgEl.style.display = 'block';
      return;
    }

    msgEl.style.display = 'none';

    const disp = await _carregarDisponibilidade();
    if (geracao !== _cardsGeracao) return;        // semestre trocado enquanto carregava
    grid.querySelectorAll('.disc-card').forEach(c => c.remove());

    discs.forEach((disc, idx) => {
      const href  = _hrefDisciplina(sem, disc.arquivo);
      const cor   = _resolverCorCard(disc.arquivo, idx);
      const label = disc.apelido ?? disc.nome;
      const num   = String(idx + 1).padStart(2, '0');
      const icone = resolveIcone(disc.icone);

      const semDados  = disp.fonte === 'nenhuma';
      const modos     = semDados ? [] : _modosDaDisciplina(disp, sem, disc.arquivo);
      const disponiveis = modos.filter(m => m.ok);

      /* Três situações:
         · sem dados (fetch falhou)  → inicia direto em Questões
         · 0 modos disponíveis       → card desabilitado ("Em breve")
         · 1 modo                    → início direto (1 clique)
         · 2+ modos                  → botão que expande a lista de modos */
      let tipo = 'lista';
      if (semDados) tipo = 'legado';
      else if (disponiveis.length === 0) tipo = 'vazio';
      else if (disponiveis.length === 1) tipo = 'direto';

      const card = document.createElement('div');
      card.className = 'disc-card disc-card--' + tipo;
      card.dataset.arquivo = disc.arquivo; // usado pela Home para destacar o card certo
      card.dataset.tipo = tipo;
      // Aplica as variáveis de cor do card via inline style — fonte única: cores.js
      card.style.setProperty('--card-accent',     cor.hex);
      card.style.setProperty('--card-accent-rgb', cor.rgb);
      card.style.setProperty('--card-accent-d',   `rgba(${cor.rgb},0.12)`);
      card.style.setProperty('--card-glow',       `rgba(${cor.rgb},0.22)`);
      card.setAttribute('role', 'listitem');

      let rotulo, mainTag;
      const mainAttrs = {};
      if (tipo === 'legado') {
        mainTag = 'a'; mainAttrs.href = href; rotulo = 'Iniciar quiz';
      } else if (tipo === 'vazio') {
        mainTag = 'div'; mainAttrs['aria-disabled'] = 'true'; rotulo = 'Em breve';
      } else if (tipo === 'direto') {
        const m = disponiveis[0];
        mainTag = 'a';
        mainAttrs.href = _hrefModo(sem, disc.arquivo, m.modo);
        mainAttrs['data-modo'] = m.modo;
        rotulo = `Iniciar ${m.titulo}` + (m.n ? ` · ${m.n} questões` : '');
      } else {
        mainTag = 'button';
        mainAttrs.type = 'button';
        rotulo = 'Escolher modo';
      }

      const seta = tipo === 'vazio' ? '' : _SETA_SVG;
      const miniIcones = tipo === 'lista'
        ? `<span class="disc-card__mini" aria-hidden="true">${disponiveis.map(m => `<span data-modo="${m.modo}" title="${m.titulo}">${m.icone}</span>`).join('')}</span>`
        : '';

      const main = document.createElement(mainTag);
      main.className = 'disc-card__main';
      main.innerHTML = `
        <div class="disc-card__inner">
          <span class="disc-card__num">${num}</span>
          <div class="disc-card__icon" aria-hidden="true">${icone}</div>
          <div class="disc-card__body">
            <h2 class="disc-card__title">${label}</h2>
            <p class="disc-card__desc">${disc.nome}</p>
          </div>
          <div class="disc-card__footer">
            <span class="disc-card__tag">${rotulo}</span>
            ${miniIcones}
            <div class="disc-card__arrow-wrap" aria-hidden="true">${seta}</div>
          </div>
        </div>`;
      Object.keys(mainAttrs).forEach(k => main.setAttribute(k, mainAttrs[k]));
      main.setAttribute('aria-label', tipo === 'vazio' ? `${disc.nome} — em breve` : disc.nome);
      card.appendChild(main);

      if (tipo === 'lista') {
        /* v11: o card não se expande mais — abre o painel de modos
           (janela no computador / folha inferior no celular). */
        main.setAttribute('aria-haspopup', 'dialog');
        main.addEventListener('click', () => abrirPainelModos({ sem, disc, label, cor, icone, modos, origem: main }));
        card._abrirPainel = () => abrirPainelModos({ sem, disc, label, cor, icone, modos, origem: main });
      }

      if (tipo !== 'vazio') {
        main.addEventListener('mouseenter', () => playSound('hover', 'quiz'));
        main.addEventListener('click',      () => playSound('click', 'quiz'));
      }

      grid.insertBefore(card, msgEl);
    });

    _aplicarDeepLinkDisciplina();
  }

  /* ══════════════════════════════════════════════
     SELECT DE SEMESTRE
  ══════════════════════════════════════════════ */
  function _montarSelect() {
    const wrap = document.getElementById('semestre-wrap');
    if (!wrap) return;

    criarSemestreSelect('semestre-wrap', sem => {
      setSemestre(sem);
      gerarCards(sem);
      _renderHomeExtras(sem);
      sincronizarSemNaURL(sem);
      playSound('select', 'quiz');
    });

    requestAnimationFrame(() => {
      const sel = wrap.querySelector('select');
      if (sel) sel.addEventListener('mousedown', () => playSound('click', 'quiz'));
    });
  }

  /* ══════════════════════════════════════════════
     UTILITÁRIOS DE MODAL / TOAST
  ══════════════════════════════════════════════ */
  function _criarModal(id) {
    const el = document.createElement('div');
    el.className = 'modal';
    el.id = `modal-${id}`;
    return el;
  }

  function _fecharModal(modal) {
    modal.classList.remove('modal--open');
    modal.addEventListener('transitionend', () => modal.remove(), { once: true });
  }

  function _toast(msg) {
    const OFFSET = 12, DURATION = 2800;
    const existentes = document.querySelectorAll('.nexus-toast');
    let nextBottom = 32;
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

  function _confirmar(btn, callback) {
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

  /* ══════════════════════════════════════════════
     MODAL DE CONFIGURAÇÕES
  ══════════════════════════════════════════════ */
  function _abrirModalConfig() {
    playSound('openModal', 'quiz');
    const cfg   = getConfigs();
    const modal = _criarModal('config-quiz');

    modal.innerHTML = `
      <div class="modal__overlay" id="modal-overlay-cfg"></div>
      <div class="modal__box" role="dialog" aria-modal="true" aria-label="Configurações do Quiz">

        <div class="modal__header">
          <h2 class="modal__title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06
                       a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09
                       A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83
                       l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09
                       A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83
                       l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09
                       a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83
                       l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09
                       a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Configurações do Quiz
          </h2>
          <button class="modal__close" id="cfg-close" aria-label="Fechar">✕</button>
        </div>

        <div class="modal__body-scroll">
          <div class="modal__section">
            <div class="modal__section-title">Progresso</div>
            <div class="config-row">
              <label for="cfg-parcial">
                Salvar progresso
                <small style="display:block;font-weight:400;opacity:0.55;font-size:0.7em;margin-top:3px;">
                  Salva seu progresso parcial enquanto responde.
                </small>
              </label>
              <label class="toggle">
                <input type="checkbox" id="cfg-parcial"
                  ${cfg.salvarProgressoParcial !== false ? 'checked' : ''} />
                <span class="toggle__track"></span>
              </label>
            </div>
            <div class="config-row">
              <label for="cfg-concluir">
                Salvar ao concluir
                <small style="display:block;font-weight:400;opacity:0.55;font-size:0.7em;margin-top:3px;">
                  Guarda o resultado permanentemente ao terminar.
                </small>
              </label>
              <label class="toggle">
                <input type="checkbox" id="cfg-concluir"
                  ${cfg.salvarProgresso !== false ? 'checked' : ''} />
                <span class="toggle__track"></span>
              </label>
            </div>
          </div>

          <div class="modal__section">
            <div class="modal__section-title">Dados</div>
            <div class="config-row">
              <label>
                Limpar dados
                <small style="display:block;font-weight:400;opacity:0.55;font-size:0.7em;margin-top:3px;">
                  Remove todo progresso salvo de todos os quizzes.
                </small>
              </label>
              <button class="modal-btn modal-btn--danger" id="cfg-btn-limpar">Limpar</button>
            </div>
          </div>
        </div>

        <div class="modal__footer">
          <button class="modal-btn modal-btn--ghost" id="cfg-btn-cancelar">Cancelar</button>
          <button class="modal-btn modal-btn--primary" id="cfg-btn-salvar">Salvar</button>
        </div>
      </div>`;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('modal--open'));

    const chkParcial  = document.getElementById('cfg-parcial');
    const chkConcluir = document.getElementById('cfg-concluir');

    function _sync() {
      if (!chkParcial.checked) {
        chkConcluir.checked  = false;
        chkConcluir.disabled = true;
      } else {
        chkConcluir.disabled = false;
      }
    }

    _sync();
    chkParcial.addEventListener('change', _sync);

    document.getElementById('cfg-btn-limpar')?.addEventListener('click', function () {
      _confirmar(this, () => {
        limparDadosQuiz();
        window.__nexusQuizNotifyCleared?.();
        _toast('Dados do quiz apagados.');
      });
    });

    function _fechar() {
      playSound('closeModal', 'quiz');
      _fecharModal(modal);
    }

    document.getElementById('modal-overlay-cfg')?.addEventListener('click', _fechar);
    document.getElementById('cfg-close')?.addEventListener('click', _fechar);
    document.getElementById('cfg-btn-cancelar')?.addEventListener('click', () => {
      playSound('click', 'quiz');
      _fechar();
    });

    document.getElementById('cfg-btn-salvar')?.addEventListener('click', () => {
      playSound('click', 'quiz');
      setConfigs({
        salvarProgressoParcial: chkParcial.checked,
        salvarProgresso:        chkConcluir.checked,
      });
      _fecharModal(modal);
      _toast('Configurações salvas!');
    });
  }

  /* ══════════════════════════════════════════════
     INICIALIZAÇÃO
  ══════════════════════════════════════════════ */

  // Lê ?sem= da URL antes do DOMContentLoaded
  const semParam = new URLSearchParams(location.search).get('sem');
  if (semParam) setSemestre(semParam);

  let semAtual = getSemestreAtual();

  document.addEventListener('DOMContentLoaded', async () => {

    // Áudio
    Sound.init();
    installAudioRecovery({ Sound, audio });
    await Sound.waitUntilReady();

    // Logo
    injetarLogo('#header-logo-wrap');

    /* NAVIGATION ANALYTICS — registra entrada na página de quiz */
    if (typeof window.__nexusPageEnter === 'function') {
      window.__nexusPageEnter(location.pathname);
    }

    // Botão voltar
    document.querySelector('.nav-back')
      ?.addEventListener('click', () => playSound('click', 'quiz'));

    // Select de semestre
    _montarSelect();

    // Botão de config
    document.getElementById('btn-quiz-config')
      ?.addEventListener('click', _abrirModalConfig);

    // Estilo dos ícones SVG das disciplinas (ver _injetarEstiloIconeDisciplina)
    _injetarEstiloIconeDisciplina();

    // Cards (tela de seleção original)
    gerarCards(semAtual);
    sincronizarSemNaURL(semAtual);

    // Home real: continuar estudando (somente leitura via inteligência)
    _renderHomeExtras(semAtual);

    // Footer
    preencherAnos(['footer-year']);

    // Canvas de fundo
    _initCanvas();

    // IA (não bloqueia renderização)
    carregarIA('Quiz');

  });

}());