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

   v2.5 — Fase 5 (Core), sem mudança de lógica:
   · catálogo de semestres/disciplinas/ícones movido para
     src/core/disciplinas.js e reexportado aqui (API idêntica);
   · salvarConfigs vem direto de data/usuarios-repo.js (elimina o
     ciclo estático global.js ↔ firebase.js);
   · login()/logout() ficam em src/core/auth.js.
   ============================================= */

import Storage from './storage.js';
import { salvarConfigs } from './data/usuarios-repo.js';
import {
  SEMESTRES, SEMESTRE_PADRAO, resolveIcone,
  getDisciplinasDeSemestre, parseSemestre, normalizarSemestre,
} from './core/disciplinas.js';

/* Catálogo reexportado: mesma API pública de antes. */
export { SEMESTRES, SEMESTRE_PADRAO, resolveIcone, getDisciplinasDeSemestre, parseSemestre };

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
   CATÁLOGO (semestres, disciplinas, ícones)
   Vive em src/core/disciplinas.js (Fase 5) e é reexportado
   acima — os consumidores continuam importando de global.js.
   ══════════════════════════════════════════════════════════ */







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
    const raw = normalizarSemestre(Storage.get('semestre_atual') || '');
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
  const normalizado = normalizarSemestre(s);
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
 * login (core/auth.js → login() chama setUsuario; reexportado por
 * firebase.js) e logout (core/auth.js → logout() chama setUsuario(null)).
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