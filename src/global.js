/* =============================================
   NEXUS STUDY — src/global.js
   Estado global e utilitários compartilhados
   src/global.js

   v2.3 — volumes não resetam para 1.0 ao navegar entre páginas
   ─────────────────────────────────────────────
   MUDANÇAS v2.2 → v2.3
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
      const mod = await import('../shared/js/audio/audio-state.js');
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

export const SEMESTRES = ['2026.1-AP2', '2026.1-AP1','2027.1' ];


/* ══════════════════════════════════════════════════════════
   DISCIPLINAS POR SEMESTRE
   ══════════════════════════════════════════════════════════ */

const _DISCIPLINAS = {
  '2026.1': [
    { id: 'poo',        nome: 'Programação Orientada a Objetos',  apelido: 'P.O.O.',            emoji: '☕',  arquivo: 'poo' },
    { id: 'redes',      nome: 'Redes de Computadores I',          apelido: 'Redes I',            emoji: '🌐', arquivo: 'redes' },
    { id: 'design',     nome: 'Design de Sistemas de Informação', apelido: 'Design de Sistemas', emoji: '🎨', arquivo: 'design' },
    { id: 'banco_dados',nome: 'Fundamentos de Banco de Dados',    apelido: 'Banco de dados',     emoji: '🗄️', arquivo: 'banco_dados' },
  ],
};

/* ══════════════════════════════════════════════════════════
   ESTADO INTERNO
   ══════════════════════════════════════════════════════════ */

let _estado = {
  pagina:     'HOME',
  semestre: (() => {
    const raw = _normalizarSemestre(Storage.get('semestre_atual') || '');
    return SEMESTRES.includes(raw) ? raw : SEMESTRES[0];
  })(),
  disciplina: null,
  usuario:    Storage.get('usuario', null),
  configs:    Storage.get('configs', _defaultConfigs()),
};

function _defaultConfigs() {
  return {
    tema:                 'dark',
    animacoes:            true,
    notificacoes:         false,
    salvarProgressoParcial: true,
    salvarProgresso:      false,
  };
}

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
  _aplicarConfigs(_estado.configs);
}

/**
 * Define novas configs, persiste no Firebase e aplica na UI.
 * Use SOMENTE para mudanças intencionais do usuário.
 */
export function setConfigs(novas) {
  _estado.configs = { ..._estado.configs, ...novas };
  Storage.set('configs', _estado.configs);
  _aplicarConfigs(_estado.configs);

  const u = _estado.usuario;
  if (u?.uid) {
    const { audioState: _d1, sfxMap: _d2, sfxAreaMap: _d3, ...restConfigs } = _estado.configs;

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

function _aplicarConfigs(cfg) {
  document.documentElement.dataset.tema = cfg.tema ?? 'dark';
  if (!cfg.animacoes) {
    document.documentElement.classList.add('sem-animacoes');
  } else {
    document.documentElement.classList.remove('sem-animacoes');
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