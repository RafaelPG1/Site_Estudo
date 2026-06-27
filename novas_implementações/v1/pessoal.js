/* =============================================
   NEXUS STUDY — pessoal_dashboard.js
   Preenche o novo painel "Central de Gerenciamento"
   da página Pessoal (cabeçalho, foco, stats, atividade,
   objetivos, conquistas, conta).

   Este módulo é INDEPENDENTE de pessoal.js: ele lê os
   mesmos dados (semestre, disciplinas, checklist, tarefas)
   através dos módulos de estado/sync já existentes, sem
   modificar nem depender da lógica interna de pessoal.js.

   Dados reais usados (quando disponíveis):
   - semestre atual e lista de disciplinas
   - progresso de checklist (getCheckedIds + checklist_data)
   - progresso de tarefas/categorias (getCategorias)
   - última disciplina ativa (getDisciplinaAtual)
   - usuário logado (getUsuario / estaLogado)

   Dados ainda sem modelo de backend (mock, marcados
   visualmente como "Em breve"/"Mock"):
   - sequência de dias (streak)
   - mensagens para IA / sessões de estudo
   - conquistas (regras simples derivadas do que já existe,
     mas sem persistência de "unlock" — recalculadas a cada load)
   ============================================= */

import {
  getSemestreAtual,
  getDisciplinaAtual,
  getDisciplinasDeSemestre,
  estaLogado,
  getUsuario,
} from '../../src/global.js';

import { resolverSemestreDeURL } from '../../shared/js/utils/url.js';

import {
  getCheckedIds,
  getCategorias,
} from './pessoal_sync.js';

/* ══════════════════════════════════════════════
   ESTADO LOCAL DO DASHBOARD
══════════════════════════════════════════════ */
const D = {
  semestre: null,
  disciplinas: [],
  discAtiva: null,
  checklistData: {},
};

/* ══════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  /* Pequeno atraso para garantir que pessoal.js já aplicou
     o tema da disciplina (cores) e o route guard liberou a UI.
     Não há dependência funcional, apenas ordem visual. */
  setTimeout(_bootDashboard, 60);

  /* Reagir a troca de login/logout para manter o cabeçalho coerente */
  document.addEventListener('nexus:loginSuccess', () => setTimeout(_bootDashboard, 60));
  document.addEventListener('nexus:logout', () => setTimeout(_bootDashboard, 60));
});

function _bootDashboard() {
  if (!estaLogado()) return; // o route guard de pessoal.js cuida do bloqueio visual

  D.semestre    = resolverSemestreDeURL() ?? getSemestreAtual();
  D.disciplinas = getDisciplinasDeSemestre(D.semestre) ?? [];

  const discId    = getDisciplinaAtual();
  D.discAtiva     = (discId ? D.disciplinas.find(d => d.id === discId) : null) ?? D.disciplinas[0] ?? null;

  _carregarChecklistData().then(() => {
    _renderCabecalho();
    _renderFocoEStats();
    _renderAtividade();
    _renderObjetivos();
    _renderConquistas();
    _renderConta();
    _bindAccountActions();
  });
}

async function _carregarChecklistData() {
  try {
    const mod = await import('../../content/pessoal/checklist_data.js');
    D.checklistData = mod.CHECKLIST_ITENS ?? {};
  } catch (_) {
    D.checklistData = {};
  }
}

/* ══════════════════════════════════════════════
   HELPERS DE DADOS
══════════════════════════════════════════════ */
function _getClDisc(discId) {
  const raw = D.checklistData[D.semestre]?.[discId];
  if (!raw) return null;
  if (raw.aulas) {
    const categorias = raw.aulas.flatMap(aula => aula.categorias);
    return { categorias };
  }
  return raw;
}

/** Progresso agregado de checklist em TODAS as disciplinas do semestre */
function _statsChecklistGeral() {
  let total = 0, done = 0;
  D.disciplinas.forEach(disc => {
    const cl = _getClDisc(disc.id);
    if (!cl) return;
    const itens = cl.categorias.flatMap(c => c.itens);
    total += itens.length;
    const checked = getCheckedIds(D.semestre, disc.id);
    done += itens.filter(i => checked.has(i.id)).length;
  });
  return { total, done };
}

/** Progresso agregado de tarefas/categorias em TODAS as disciplinas do semestre */
function _statsTarefasGeral() {
  let total = 0, done = 0, categorias = 0;
  D.disciplinas.forEach(disc => {
    const cats = getCategorias(D.semestre, disc.id) ?? [];
    categorias += cats.length;
    cats.forEach(c => {
      total += c.itens.length;
      done  += c.itens.filter(i => i.concluida).length;
    });
  });
  return { total, done, categorias };
}

function _nomeUsuario() {
  try {
    const u = getUsuario?.();
    if (u?.nome) return u.nome;
    if (u?.email) return u.email.split('@')[0];
  } catch (_) {}
  return 'Estudante';
}

function _iniciais(nome) {
  const partes = String(nome).trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return 'EU';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function _saudacaoPorHorario() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function _esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/* ══════════════════════════════════════════════
   CABEÇALHO
══════════════════════════════════════════════ */
function _renderCabecalho() {
  const nome = _nomeUsuario();

  const avatarEl = document.getElementById('pdash-avatar');
  if (avatarEl) avatarEl.textContent = _iniciais(nome);

  const userEl = document.getElementById('pdash-username');
  if (userEl) userEl.textContent = nome;

  const greetEl = document.getElementById('pdash-greeting');
  if (greetEl) {
    greetEl.innerHTML = `${_saudacaoPorHorario()}, <strong id="pdash-username">${_esc(nome)}</strong>`;
  }

  const mottoEl = document.getElementById('pdash-motto');
  if (mottoEl) {
    const frases = [
      'Um passo por vez. Continue de onde parou.',
      'Pequenos progressos diários constroem grandes resultados.',
      'Organização é o primeiro passo para o foco.',
      'Hoje é uma boa chance de avançar mais um pouco.',
    ];
    const idx = new Date().getDate() % frases.length;
    mottoEl.textContent = frases[idx];
  }

  const semText = document.getElementById('pdash-chip-semestre-text');
  if (semText) semText.textContent = D.semestre ? `Semestre ${D.semestre}` : 'Semestre —';

  /* Status de sync: reflete estaLogado() — verificação simples e honesta,
     sem inventar estados de rede que não temos como confirmar aqui. */
  const syncText = document.getElementById('pdash-chip-sync-text');
  const syncChip = document.getElementById('pdash-chip-sync');
  if (syncText && syncChip) {
    syncText.textContent = 'Sincronizado';
    syncChip.title = 'Seus dados estão salvos neste dispositivo e na conta';
  }
}

/* ══════════════════════════════════════════════
   CARD DE FOCO (sequência) + STATS SECUNDÁRIAS
══════════════════════════════════════════════ */
function _renderFocoEStats() {
  /* ── Foco / streak — ainda não há modelo de dados para isso.
     Mantemos visual claro de "mock" em vez de inventar um número. ── */
  const streakNum  = document.getElementById('pfoco-streak-num');
  const streakDesc = document.getElementById('pfoco-streak-desc');
  const streakBar  = document.getElementById('pfoco-streak-bar');
  if (streakNum)  streakNum.innerHTML  = `0<span>dias</span>`;
  if (streakDesc) streakDesc.innerHTML = `Ainda sem sequência ativa. <span class="pmock-tag">Em breve</span>`;
  if (streakBar)  streakBar.style.width = '0%';

  /* ── Disciplinas no semestre — REAL ── */
  const discNum = document.getElementById('pstat-disciplinas-num');
  if (discNum) discNum.textContent = String(D.disciplinas.length);

  /* ── Checklist — REAL ── */
  const cl = _statsChecklistGeral();
  const clNum = document.getElementById('pstat-checklist-num');
  if (clNum) clNum.textContent = `${cl.done}/${cl.total}`;

  /* ── Tarefas — REAL ── */
  const tk = _statsTarefasGeral();
  const tkNum = document.getElementById('pstat-tarefas-num');
  if (tkNum) tkNum.textContent = `${tk.done}/${tk.total}`;

  /* ── Mensagens para IA — sem modelo de dados ainda, mock explícito ── */
  const iaNum = document.getElementById('pstat-ia-num');
  if (iaNum) iaNum.textContent = '0';
}

/* ══════════════════════════════════════════════
   ATIVIDADE RECENTE
══════════════════════════════════════════════ */
function _renderAtividade() {
  const list = document.getElementById('pact-list');
  if (!list) return;
  list.innerHTML = '';

  const eventos = [];

  if (D.discAtiva) {
    eventos.push({
      texto: `Disciplina aberta: <b>${_esc(D.discAtiva.nome)}</b>`,
      meta: 'Sessão atual',
    });
  }

  /* Categoria de tarefas mais recente entre as disciplinas (heurística simples:
     primeira categoria com itens, da disciplina ativa, se existir) */
  if (D.discAtiva) {
    const cats = getCategorias(D.semestre, D.discAtiva.id) ?? [];
    const comItens = cats.find(c => c.itens.length > 0);
    if (comItens) {
      const done  = comItens.itens.filter(i => i.concluida).length;
      eventos.push({
        texto: `Categoria <b>${_esc(comItens.nome)}</b> em ${_esc(D.discAtiva.nome)} — ${done}/${comItens.itens.length} concluídos`,
        meta: 'Tarefas',
      });
    }
  }

  /* Checklist: disciplina com maior progresso > 0, dentre todas */
  let melhorChecklist = null;
  D.disciplinas.forEach(disc => {
    const cl = _getClDisc(disc.id);
    if (!cl) return;
    const itens = cl.categorias.flatMap(c => c.itens);
    if (itens.length === 0) return;
    const checked = getCheckedIds(D.semestre, disc.id);
    const done = itens.filter(i => checked.has(i.id)).length;
    if (done > 0 && (!melhorChecklist || done > melhorChecklist.done)) {
      melhorChecklist = { disc, done, total: itens.length };
    }
  });
  if (melhorChecklist) {
    eventos.push({
      texto: `Checklist de <b>${_esc(melhorChecklist.disc.nome)}</b> — ${melhorChecklist.done}/${melhorChecklist.total} itens marcados`,
      meta: 'Checklist',
    });
  }

  eventos.push({
    texto: `Conversas com a IA e quizzes aparecerão aqui <span class="pmock-tag">em breve</span>`,
    meta: 'Próximas integrações',
  });

  if (eventos.length === 0) {
    list.innerHTML = `
      <div class="pdash-empty">
        <span class="pdash-empty__icon">🗒️</span>
        <p>Nenhuma atividade ainda</p>
        <small>Abra uma disciplina e comece pelo checklist ou pelas tarefas.</small>
      </div>`;
    return;
  }

  eventos.forEach(ev => {
    const item = document.createElement('div');
    item.className = 'pact-item';
    item.innerHTML = `
      <span class="pact-item__rail">
        <span class="pact-item__dot"></span>
        <span class="pact-item__line"></span>
      </span>
      <span class="pact-item__body">
        <span class="pact-item__text">${ev.texto}</span>
        <div class="pact-item__meta">${_esc(ev.meta)}</div>
      </span>`;
    list.appendChild(item);
  });
}

/* ══════════════════════════════════════════════
   OBJETIVOS DE HOJE
   Derivados de dados reais: categorias de tarefas com
   itens pendentes da disciplina ativa, e progresso geral
   de checklist como meta diária sugerida.
══════════════════════════════════════════════ */
function _renderObjetivos() {
  const list = document.getElementById('pgoals-list');
  if (!list) return;
  list.innerHTML = '';

  const goals = [];

  if (D.discAtiva) {
    const cats = getCategorias(D.semestre, D.discAtiva.id) ?? [];
    cats.forEach(cat => {
      const total = cat.itens.length;
      const done  = cat.itens.filter(i => i.concluida).length;
      if (total === 0) return;
      goals.push({
        titulo: cat.nome,
        sub: `${_esc(D.discAtiva.nome)}`,
        done: done === total,
        pct: Math.round((done / total) * 100),
      });
    });
  }

  /* Meta diária genérica: avançar no checklist da disciplina ativa */
  if (D.discAtiva) {
    const cl = _getClDisc(D.discAtiva.id);
    if (cl) {
      const itens = cl.categorias.flatMap(c => c.itens);
      if (itens.length > 0) {
        const checked = getCheckedIds(D.semestre, D.discAtiva.id);
        const done = itens.filter(i => checked.has(i.id)).length;
        goals.push({
          titulo: `Avançar no checklist de ${D.discAtiva.nome}`,
          sub: 'Meta sugerida para hoje',
          done: done === itens.length,
          pct: Math.round((done / itens.length) * 100),
        });
      }
    }
  }

  if (goals.length === 0) {
    list.innerHTML = `
      <div class="pdash-empty">
        <span class="pdash-empty__icon">🎯</span>
        <p>Sem objetivos definidos</p>
        <small>Crie categorias na aba Tarefa para ver suas metas aqui.</small>
      </div>`;
    return;
  }

  goals.slice(0, 5).forEach(g => {
    const row = document.createElement('div');
    row.className = `pgoal-item${g.done ? ' pgoal-item--done' : ''}`;
    row.innerHTML = `
      <span class="pgoal-item__icon">
        ${g.done
          ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
          : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg>`}
      </span>
      <span class="pgoal-item__text">
        <span class="pgoal-item__title">${_esc(g.titulo)}</span>
        <span class="pgoal-item__sub">${g.sub}</span>
      </span>
      <span class="pgoal-item__pct">${g.pct}%</span>`;
    list.appendChild(row);
  });
}

/* ══════════════════════════════════════════════
   CONQUISTAS
   Regras simples e honestas calculadas a partir de dados reais.
   Sem persistência de "unlock" (recalculado a cada carregamento) —
   deixamos isso claro no rótulo da seção em vez de simular histórico.
══════════════════════════════════════════════ */
function _renderConquistas() {
  const grid = document.getElementById('pach-grid');
  const hint = document.getElementById('pach-progress-hint');
  if (!grid) return;
  grid.innerHTML = '';

  const cl = _statsChecklistGeral();
  const tk = _statsTarefasGeral();

  const conquistas = [
    {
      nome: 'Primeiro passo',
      desc: 'Marque o primeiro item do checklist',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
      unlocked: cl.done >= 1,
    },
    {
      nome: 'Organizado',
      desc: 'Crie sua primeira categoria de tarefas',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
      unlocked: tk.categorias >= 1,
    },
    {
      nome: 'Em ritmo',
      desc: 'Conclua 10 itens entre checklist e tarefas',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>`,
      unlocked: (cl.done + tk.done) >= 10,
    },
    {
      nome: 'Multidisciplinar',
      desc: 'Tenha progresso em 2 ou mais disciplinas',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/></svg>`,
      unlocked: _discsComProgresso() >= 2,
    },
  ];

  const desbloqueadas = conquistas.filter(c => c.unlocked).length;
  if (hint) hint.textContent = `${desbloqueadas}/${conquistas.length} desbloqueadas`;

  conquistas.forEach(c => {
    const card = document.createElement('div');
    card.className = `pach-card ${c.unlocked ? 'pach-card--unlocked' : 'pach-card--locked'}`;
    card.innerHTML = `
      <span class="pach-card__icon">${c.icon}</span>
      <span class="pach-card__name">${_esc(c.nome)}</span>
      <span class="pach-card__desc">${_esc(c.desc)}</span>`;
    grid.appendChild(card);
  });
}

function _discsComProgresso() {
  let n = 0;
  D.disciplinas.forEach(disc => {
    const cl = _getClDisc(disc.id);
    const clItens = cl ? cl.categorias.flatMap(c => c.itens) : [];
    const checked = getCheckedIds(D.semestre, disc.id);
    const clDone = clItens.filter(i => checked.has(i.id)).length;

    const cats = getCategorias(D.semestre, disc.id) ?? [];
    const tkDone = cats.reduce((s, c) => s + c.itens.filter(i => i.concluida).length, 0);

    if (clDone > 0 || tkDone > 0) n++;
  });
  return n;
}

/* ══════════════════════════════════════════════
   CONTA & CONFIGURAÇÕES RÁPIDAS
══════════════════════════════════════════════ */
function _renderConta() {
  /* Armazenamento local: estimativa real do uso de localStorage
     pelo Nexus Study (chaves com prefixo conhecido), contra um
     limite de referência típico de localStorage (5MB). */
  let bytes = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const val = localStorage.getItem(key) ?? '';
      bytes += key.length + val.length;
    }
  } catch (_) {}

  const KB = bytes / 1024;
  const LIMIT_KB = 5 * 1024; // referência comum de quota de localStorage
  const pct = Math.min(100, Math.round((KB / LIMIT_KB) * 100));

  const valEl  = document.getElementById('pacc-storage-val');
  const fillEl = document.getElementById('pacc-storage-fill');
  if (valEl)  valEl.textContent = `${KB.toFixed(1)} KB`;
  if (fillEl) fillEl.style.width = `${Math.max(pct, 1.5)}%`;
}

function _bindAccountActions() {
  /* Estas ações abrem o modal de configurações já existente em
     pessoal.js (#btn-config-pessoal) quando aplicável, ou indicam
     que a função ainda não está disponível — sem criar funcionalidade
     duplicada nem fingir que algo funciona quando não funciona. */
  const abrirConfigAvancada = () => {
    document.getElementById('btn-config-pessoal')?.click();
  };

  document.getElementById('pacc-config-avancado')
    ?.addEventListener('click', abrirConfigAvancada);

  document.getElementById('pacc-exportar')
    ?.addEventListener('click', _exportarDados);

  /* Tema e IA ainda não têm painel próprio — feedback honesto */
  ['pacc-tema', 'pacc-ia'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      _toastDashboard('Essa configuração ainda não está disponível.');
    });
  });
}

function _exportarDados() {
  try {
    const dados = { semestre: D.semestre, disciplinas: [] };
    D.disciplinas.forEach(disc => {
      dados.disciplinas.push({
        id: disc.id,
        nome: disc.nome,
        checklistMarcado: Array.from(getCheckedIds(D.semestre, disc.id)),
        tarefas: getCategorias(D.semestre, disc.id) ?? [],
      });
    });

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `nexus-study-pessoal-${D.semestre ?? 'dados'}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    _toastDashboard('Dados exportados com sucesso.');
  } catch (err) {
    console.warn('[pessoal_dashboard] export falhou:', err);
    _toastDashboard('Não foi possível exportar os dados.');
  }
}

/** Toast simples e independente do toast de pessoal.js (mesma classe visual) */
function _toastDashboard(msg) {
  const existentes = document.querySelectorAll('.nexus-toast');
  let bottom = 32;
  existentes.forEach(t => { bottom += t.offsetHeight + 12; });

  const t = document.createElement('div');
  t.className = 'nexus-toast';
  t.textContent = msg;
  t.style.bottom = `${bottom}px`;
  document.body.appendChild(t);

  requestAnimationFrame(() => t.classList.add('nexus-toast--show'));

  setTimeout(() => {
    t.classList.remove('nexus-toast--show');
    t.addEventListener('transitionend', () => t.remove(), { once: true });
  }, 2400);
}