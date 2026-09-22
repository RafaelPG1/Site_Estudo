/* =============================================
   NEXUS STUDY — src/global.js
   Estado global e utilitários compartilhados
   src/global.js

   v2.4 — disciplinas passam a usar ícones SVG em vez de emoji
   ─────────────────────────────────────────────
   MUDANÇAS v2.3 → v2.4
   ─────────────────────────────────────────────
   FIX 5 — Substituído `emoji` por `icone` (SVG) em _DISCIPLINAS.

     Etapa 1 de uma mudança estrutural maior: os emojis usados como
     ícone de cada disciplina foram substituídos por ícones SVG de
     interface (estilo outline, `currentColor`, 24x24), centralizados
     em `_ICONES` e referenciados a partir de `_DISCIPLINAS`.

     Nada além da fonte de dados foi alterado nesta etapa. Nenhum
     consumidor (quiz.js, quiz_starter_modal.js, páginas de resumo,
     Atlas, dashboard, etc.) foi tocado — eles continuam recebendo o
     objeto de disciplina normalmente através de
     getDisciplinasDeSemestre() / getDisciplinaAtual(), só que agora
     com `icone` (string SVG) no lugar de `emoji`. A migração desses
     consumidores para `disciplina.icone` fica para uma etapa futura.

   MANTIDO (inalterado de v2.3):
   ─────────────────────────────────────────────
   FIX 4 — Removido `configs` do detail de nexus:loginSuccess
     nos disparos do global.js (setUsuario + bootstrap).

     Problema: o localStorage armazena tema, animações, etc., mas NÃO
     armazena o campo `volumes` — esse campo é gerenciado exclusivamente
     pelo audio-state.js e salvo direto no Firebase.
     Quando o detail.configs chegava sem `volumes`, o audio-state.js
     interpretava savedVolumes = null e resetava master/sfx/music para
     1.0, ignorando os valores salvos pelo usuário no modal de áudio.

     Solução: não incluir configs no detail nesses disparos. O
     audio-state.js cai no branch do _fetchFromFirebase, que lê o
     documento completo — incluindo `volumes` — e aplica corretamente.

     O index.js continua podendo passar configs no detail quando quiser
     (ele faz o merge completo incluindo volumes antes de disparar).

   MANTIDO (inalterado de v2.2):
   ─────────────────────────────────────────────
   FIX 1 — setUsuario(null) limpa _estado.configs no logout.
   FIX 2 — setConfigs() exclui audioState do save no Firebase.
   FIX 3 — hydrateConfigs() sem write-back no Firebase.
   ============================================= */

import Storage from './storage.js';
import { salvarConfigs } from './firebase.js';

// Importação lazy do audio-state para evitar ciclo de módulos.
// Usada em setConfigs() para incluir sfxAreaMap no payload do Firebase.
let _audioState = null;
async function _getAudioState() {
  if (!_audioState) {
    try {
      const mod = await import('../shared/js/audio/state/audio-state.js');
      _audioState = mod.default;
    } catch (_) { /* se não disponível, ignora */ }
  }
  return _audioState;
}
/* ── Expõe Storage para o quiz_engine (IIFE sem módulo) ── */
window.NexusStorage = Storage;

/* ══════════════════════════════════════════════════════════
   CONSTANTES
   ══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════
   NORMALIZAÇÃO DE SEMESTRE
   ══════════════════════════════════════════════════════════

   Converte qualquer variação de casing para maiúsculo na
   parte do AP. Ex: "2026.1-ap2" → "2026.1-AP2".

   Por que é necessário:
     SEMESTRES[] usa maiúsculas ("2026.1-AP2").
     Os diretórios físicos no servidor também.
     Mas a URL pode chegar com qualquer casing.
     parseSemestre() preserva o casing que recebe —
     então "2026.1-ap2" gera ap="ap2" e o caminho
     resultante .../ap2/ques_*.js não é encontrado.
   ══════════════════════════════════════════════════════════ */
function _normalizarSemestre(s) {
  if (!s) return s;
  // Normaliza apenas a parte após o hífen, preservando o formato YYYY.N
  return String(s).replace(/-(.+)$/, (_, ap) => '-' + ap.toUpperCase());
}


export const SEMESTRES = [
  '2026.2-AP1',
  '2026.1-AP2',
  '2026.1-AP1'
];

/* Semestre padrão — usado quando não há `semestre_atual` salvo no
   localStorage desta origem (ex.: primeiro acesso, ou acesso a
   partir de uma origem diferente da usada em testes locais, como
   GitHub Pages vs Live Server — localStorage não é compartilhado
   entre origens).

   IMPORTANTE: este valor é INDEPENDENTE da ordem de SEMESTRES[].
   Antes, o fallback usava `SEMESTRES[0]` — ou seja, o padrão
   mudava silenciosamente toda vez que a lista era reordenada ou
   um semestre novo era adicionado no topo (foi exatamente isso
   que fez o fallback virar "2026.2-AP2" ao adicionar esse
   semestre à lista, mesmo sem nenhum checklist_data.js configurado
   para ele ainda). Ajuste este valor manualmente quando o
   semestre corrente do curso mudar. */
export const SEMESTRE_PADRAO = '2026.1-AP2';




/* ══════════════════════════════════════════════════════════
   ÍCONES SVG — disciplinas
   ══════════════════════════════════════════════════════════

   Ícones de interface (não-emoji), estilo outline, viewBox
   24x24, `stroke="currentColor"` — a cor é herdada via CSS
   (color: ...) no elemento que renderizar o SVG.

   Centralizados aqui como fonte única, para que disciplinas
   com o mesmo conceito visual reaproveitem o mesmo ícone
   (ex.: Redes I e Redes II usam `_ICONES.network`).

   Consumo previsto (etapa futura, NÃO feita agora):
     disciplina.icone
     getDisciplinaAtual().icone
   Os consumidores atuais (quiz, resumo, Atlas, dashboard etc.)
   ainda não foram alterados para ler este campo.
   ══════════════════════════════════════════════════════════ */

const _ICONES = {
  // POO — programação / código
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--cor-tema, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 6 22 12 16 18"/><polyline points="8 6 2 12 8 18"/></svg>`,

  // Redes I e II — nós conectados
  network: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--cor-tema, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,

  // Design de Sistemas — layout / grade
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--cor-tema, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,

  // Banco de Dados — cilindro clássico
  database: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--cor-tema, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>`,

  // Análise e Projeto de Sistemas — camadas / arquitetura
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--cor-tema, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,

  // Estruturas de Dados — árvore / nós hierárquicos
  tree: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--cor-tema, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="19" r="2.5"/><line x1="12" y1="7.5" x2="6" y2="16.5"/><line x1="12" y1="7.5" x2="18" y2="16.5"/></svg>`,

  // Legislação — balança estilizada
  scale: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--cor-tema, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><line x1="5" y1="7" x2="19" y2="7"/><path d="M5 7l-3 7a3 3 0 0 0 6 0L5 7z"/><path d="M19 7l-3 7a3 3 0 0 0 6 0L19 7z"/><line x1="8" y1="21" x2="16" y2="21"/></svg>`,

  // Psicologia Organizacional — pessoas / organização
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--cor-tema, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
};

/**
 * Resolve uma chave semântica de ícone (ex.: 'network') para o
 * markup SVG correspondente em `_ICONES`.
 *
 * Por que existe:
 *   `disciplina.icone` passou a armazenar apenas a CHAVE (string),
 *   não o SVG resolvido. Isso mantém `_DISCIPLINAS` legível, evita
 *   duplicar markup SVG em cada consumidor, e permite identificar
 *   facilmente quais disciplinas compartilham o mesmo ícone (basta
 *   comparar a chave, não o SVG inteiro).
 *
 * Uso previsto pelos consumidores (etapa futura, NÃO feita agora):
 *   resolveIcone(disciplina.icone)
 *   resolveIcone(getDisciplinaAtual().icone)
 *
 * @param {string} chave     - chave em _ICONES (ex.: 'network', 'code').
 * @param {string} [fallback]- SVG usado caso a chave não exista em
 *                              _ICONES (ex.: chave inválida ou ícone
 *                              ainda não cadastrado). Default: _ICONES.code.
 * @returns {string} markup SVG correspondente.
 */
export function resolveIcone(chave, fallback = _ICONES.code) {
  return _ICONES[chave] ?? fallback;
}

/* ══════════════════════════════════════════════════════════
   DISCIPLINAS POR SEMESTRE
   ══════════════════════════════════════════════════════════ */

const _DISCIPLINAS = {
  '2026.1': [
    { id: 'poo',        nome: 'Programação Orientada a Objetos',  apelido: 'P.O.O.',            icone: 'code',     arquivo: 'poo' },
    { id: 'redes',      nome: 'Redes de Computadores I',          apelido: 'Redes I',            icone: 'network',  arquivo: 'redes' },
    { id: 'design',     nome: 'Design de Sistemas de Informação', apelido: 'Design de Sistemas', icone: 'grid',     arquivo: 'design' },
    { id: 'banco_dados',nome: 'Fundamentos de Banco de Dados',    apelido: 'Banco de dados',     icone: 'database', arquivo: 'banco_dados' },
  ],
  
  '2026.2': [
    { id: 'analise_projeto',          nome: 'Análise e Projeto de Sistemas I',      apelido: 'APS I',                    icone: 'layers', arquivo: 'analise_projeto' },
    { id: 'estruturas_dados',         nome: 'Estruturas de Dados',                  apelido: 'Estruturas de Dados',      icone: 'tree',   arquivo: 'estruturas_dados' },
    { id: 'legislacao',               nome: 'Legislação Empresarial e Trabalhista', apelido: 'Legislação',              icone: 'scale',  arquivo: 'legislacao' },
    { id: 'psicologia_organizacional',nome: 'Psicologia Organizacional',            apelido: 'Psicologia Org.',         icone: 'users',  arquivo: 'psicologia_organizacional' },
    { id: 'redes2',                   nome: 'Redes de Computadores II',             apelido: 'Redes II',                icone: 'network',arquivo: 'redes2' },
  ],


};

/* ══════════════════════════════════════════════════════════
   PADRÕES DE ÁUDIO — fonte única de verdade
   Importado por audio-state.js para eliminar valores
   hardcoded espalhados. Qualquer padrão de áudio muda
   APENAS aqui.
   ══════════════════════════════════════════════════════════ */

export const AUDIO_DEFAULTS = {
  sfxMode:         'normal',
  sfxBtnEnabled:   true,
  volumes: {
    master: 1.0,
    sfx:    0.5,
  },
  sfxMap: {
    click:        'click',
    hover:        'hover2',
    openModal:    'openModal2',
    closeModal:   'closeModal',
    select:       'select',
    correct:      'correct',
    wrong:        'wrong6',
    timeout:      'timeout4',
    pause:        'pause',
    timerWarning: 'timerWarning',
  },
};

function _defaultConfigs() {
  return {
    tema:                   'dark',
    animacoes:              true,
    notificacoes:           false,
    salvarProgressoParcial: true,
    salvarProgresso:        false,
    sfxBtnEnabled:          AUDIO_DEFAULTS.sfxBtnEnabled,
  };
}

/* ══════════════════════════════════════════════════════════
   ESTADO INTERNO
   ══════════════════════════════════════════════════════════ */

let _estado = {
  pagina:     'HOME',
  semestre: (() => {
    const raw = _normalizarSemestre(Storage.get('semestre_atual') || '');
    return SEMESTRES.includes(raw) ? raw : SEMESTRE_PADRAO;
  })(),
  disciplina: null,
  usuario:    Storage.get('usuario', null),
  configs:    Storage.get('configs', _defaultConfigs()),
};

/* ══════════════════════════════════════════════════════════
   GETTERS / SETTERS — página
   ══════════════════════════════════════════════════════════ */

export function getEstado()        { return { ..._estado }; }
export function setPagina(pagina)  { _estado.pagina = pagina; }

/* ══════════════════════════════════════════════════════════
   GETTERS / SETTERS — semestre
   ══════════════════════════════════════════════════════════ */

export function getSemestreAtual() { return _estado.semestre; }

export function setSemestre(s) {
  /* Normaliza para maiúsculo antes de salvar.
     Garante que "2026.1-ap2" vire "2026.1-AP2", igual ao padrão
     de SEMESTRES[] e dos diretórios físicos no servidor.
     Sem essa normalização, parseSemestre() extrairia ap="ap2"
     e o caminho gerado seria .../ap2/ques_*.js — não encontrado
     em servidores Linux case-sensitive onde o diretório é AP2/. */
  const normalizado = _normalizarSemestre(s);
  _estado.semestre = normalizado;
  Storage.set('semestre_atual', normalizado);
}

/* ══════════════════════════════════════════════════════════
   GETTERS / SETTERS — disciplina
   ══════════════════════════════════════════════════════════ */

export function getDisciplinaAtual() { return _estado.disciplina; }

export function setDisciplina(id) {
  _estado.disciplina = id ?? null;
}

export function getDisciplinasDeSemestre(semestre) {
  const { periodo } = parseSemestre(semestre);
  return _DISCIPLINAS[periodo] ?? _DISCIPLINAS[semestre] ?? [];
  // fallback _DISCIPLINAS[semestre] garante compatibilidade com semestres
  // futuros que usem a chave direta (ex: '2027.1')
}
/**
 * Decompõe um semestre no formato 'YYYY.N-APX' ou 'YYYY.N'.
 *
 * Exemplos:
 *   parseSemestre('2026.1-AP2') → { ano: '2026', periodo: '2026.1', ap: 'AP2' }
 *   parseSemestre('2026.1-AP1') → { ano: '2026', periodo: '2026.1', ap: 'AP1' }
 *   parseSemestre('2027.1')     → { ano: '2027', periodo: '2027.1', ap: null  }
 */
export function parseSemestre(sem) {
  const match = String(sem).match(/^(\d{4})(\.\d+)(?:-(.+))?$/);
  if (!match) return { ano: '', periodo: sem, ap: null };
  return {
    ano:     match[1],
    periodo: match[1] + match[2],   // ex: '2026.1'
    ap:      match[3] ?? null,      // ex: 'AP2' | null
  };
}

/* ══════════════════════════════════════════════════════════
   GETTERS / SETTERS — usuário
   ══════════════════════════════════════════════════════════ */

export function getUsuario()  { return _estado.usuario; }
export function estaLogado()  { return _estado.usuario !== null; }

/**
 * Atualiza o usuário logado e dispara os eventos globais de áudio.
 *
 * Por que aqui?
 * setUsuario() é o único ponto chamado por TODAS as páginas ao fazer
 * login (firebase.js → login() chama setUsuario) e logout
 * (firebase.js → logout() chama setUsuario(null)).
 * Disparando os eventos aqui, audio-btn.js e sfx.js funcionam
 * corretamente em qualquer página — quiz, resumo, jogo, etc. —
 * sem precisar de código extra em cada uma delas.
 *
 * FIX 4: NÃO incluímos configs no detail aqui.
 * O localStorage não armazena `volumes` (gerenciado pelo audio-state.js),
 * então passar configs do localStorage faria o audio-state resetar os
 * volumes para 1.0 a cada login. Sem configs no detail, o audio-state
 * executa _fetchFromFirebase e lê o documento completo com `volumes`.
 */
export function setUsuario(usuario) {
  const anterior = _estado.usuario;
  _estado.usuario = usuario;

  if (usuario) {
    Storage.set('usuario', usuario);

    // Só dispara loginSuccess se realmente trocou de usuário
    // (evita disparo duplicado em atualizações de avatar/configs)
    if (anterior?.uid !== usuario.uid) {
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('nexus:loginSuccess', {
          detail: { uid: usuario.uid },
          // FIX 4: sem configs — audio-state busca do Firebase
          // e lê `volumes` corretamente.
        }));
      }, 0);
    }
  } else {
    Storage.remove('usuario');

    // FIX 1: Limpa configs em memória no logout.
    _estado.configs = _defaultConfigs();
    Storage.set('configs', _estado.configs);
    _aplicarConfigs(_estado.configs);

    if (anterior !== null) {
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('nexus:logout'));
      }, 0);
    }
  }
}

/* ══════════════════════════════════════════════════════════
   GETTERS / SETTERS — configs
   ══════════════════════════════════════════════════════════ */

export function getConfigs() { return { ..._estado.configs }; }

/**
 * Hidrata o estado de configs em memória e localStorage
 * SEM persistir no Firebase.
 *
 * Use para: login, inicialização, restore de estado remoto.
 * NÃO use para mudanças intencionais do usuário — use setConfigs().
 */
export function hydrateConfigs(novas) {
  _estado.configs = { ..._estado.configs, ...novas };
  Storage.set('configs', _estado.configs);
  _aplicarConfigs(_estado.configs, { syncAudio: true });
}

/**
 * Define novas configs, persiste no Firebase e aplica na UI.
 * Use SOMENTE para mudanças intencionais do usuário.
 */
export function setConfigs(novas) {
  _estado.configs = { ..._estado.configs, ...novas };
  Storage.set('configs', _estado.configs);
  _aplicarConfigs(_estado.configs, { syncAudio: true });

  const u = _estado.usuario;
  if (u?.uid) {
    const { audioState: _d1, sfxMap: _d2, sfxAreaMap: _d3, sfxBtnEnabled: _d4, ...restConfigs } = _estado.configs;

    _getAudioState().then(as => {
      const audioPayload = as?.getAudioPayload?.() ?? {};
      const payload = { ...restConfigs, ...audioPayload };
      console.log('[global] setConfigs: enviando para Firebase →', payload);
      salvarConfigs(u.uid, payload).catch(() => {});
    }).catch(() => {
      const payload = { ...restConfigs };
      console.log('[global] setConfigs (fallback): enviando para Firebase →', payload);
      salvarConfigs(u.uid, payload).catch(() => {});
    });
  } else {
    console.log('[global] setConfigs: usuário não logado, só localStorage');
  }
}

export function resetConfigs() {
  _estado.configs = _defaultConfigs();
  Storage.set('configs', _estado.configs);
  _aplicarConfigs(_estado.configs);
}

function _aplicarConfigs(cfg, { syncAudio = false } = {}) {
  document.documentElement.dataset.tema = cfg.tema ?? 'dark';
  if (!cfg.animacoes) {
    document.documentElement.classList.add('sem-animacoes');
  } else {
    document.documentElement.classList.remove('sem-animacoes');
  }

  // ── Botão flutuante de áudio (Efeitos) ──────────────────
  // Sincroniza o toggle "Efeitos sonoros" SOMENTE quando
  // syncAudio=true (mudança intencional do usuário via
  // setConfigs ou hydrateConfigs pós-Firebase).
  //
  // NÃO sincroniza na inicialização do módulo (_aplicarConfigs chamado
  // com syncAudio=false, o padrão), porque nesse momento os valores em
  // localStorage podem ser o default e ainda não refletem o que está
  // no Firebase. Sincronizar aqui causaria:
  //   1. setSfxBtnEnabled(false) → _persistAllToFirebase() → sobrescreve Firebase com false
  //   2. Ao navegar → lê Firebase → false → botão some
  if (syncAudio) {
    _getAudioState().then(as => {
      if (!as) return;
      if (typeof cfg.sfxBtnEnabled === 'boolean') {
        as.setSfxBtnEnabled(cfg.sfxBtnEnabled);
      }
    }).catch(() => { /* audio-state ainda não disponível — ignora */ });
  }
}

/* ── Aplica configs salvas na inicialização ── */
_aplicarConfigs(_estado.configs);

/* ── Bootstrap loginSuccess — navegação entre páginas ──────
   Quando o usuário navega entre páginas, o JS é destruído e
   recriado do zero. Este disparo garante que audio-state.js
   receba nexus:loginSuccess em qualquer página secundária.

   FIX 4: NÃO passamos configs no detail — sem `volumes` no
   localStorage, isso causava reset dos volumes para 1.0.
   O audio-state.js executa _fetchFromFirebase e lê o documento
   completo incluindo `volumes`.
   ─────────────────────────────────────────────────────────── */
if (_estado.usuario?.uid) {
  console.log('[global] bootstrap loginSuccess:', _estado.usuario.uid);
  setTimeout(() => {
    document.dispatchEvent(new CustomEvent('nexus:loginSuccess', {
      detail: { uid: _estado.usuario.uid },
      // FIX 4: sem configs — audio-state busca do Firebase.
    }));
  }, 0);
}

/* ══════════════════════════════════════════════════════════
   QUIZ — limpar dados
   ══════════════════════════════════════════════════════════ */

export function limparDadosQuiz() {
  Storage.clearAllQuizData();
}

window.__nexusCtx = {
  getSemestre:        getSemestreAtual,
  getDisciplinas:     getDisciplinasDeSemestre,
  parseSemestre:      parseSemestre,
  getDisciplinaAtual: getDisciplinaAtual,  // null na home, id nas páginas de conteúdo
};

/* ─────────────────────────────────────────────────────────────
   __NEXUS_CONTEXT__ — contrato explícito de tipo de página
   ─────────────────────────────────────────────────────────────
   Definido aqui apenas como valor padrão (array vazio = nenhum
   domínio de IA ativo). Cada página de conteúdo sobrescreve com
   os tipos corretos ANTES de carregar os módulos de IA:

     window.__NEXUS_CONTEXT__ = { tipos: ['resumo'] };
     window.__NEXUS_CONTEXT__ = { tipos: ['quiz'] };
     window.__NEXUS_CONTEXT__ = { tipos: ['resumo', 'quiz'] };
     window.__NEXUS_CONTEXT__ = { tipos: ['games'] };
     // etc.

   NÃO inclui disciplina, semestre, ano ou qualquer estado
   dinâmico — esses continuam em suas próprias fontes de verdade.
   ─────────────────────────────────────────────────────────────
   Páginas que ainda não declararam __NEXUS_CONTEXT__ são tratadas
   com fallback automático em core/context.js (detecção legada).
──────────────────────────────────────────────────────────── */
if (typeof window.__NEXUS_CONTEXT__ === 'undefined') {
  window.__NEXUS_CONTEXT__ = { tipos: [] };
}