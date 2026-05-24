/* =============================================
   NEXUS STUDY — global.js
   Estado global e utilitários compartilhados
   src/global.js

   v2.2 — Separação entre hidratação e persistência de configs
   ─────────────────────────────────────────────
   MUDANÇAS v2.1 → v2.2
   ─────────────────────────────────────────────
   FIX 3 — hydrateConfigs() adicionado para uso no login.
     Antes: index.js chamava setConfigs() para hidratar o estado após
     o merge com Firebase, o que disparava um write-back desnecessário
     no Firestore a cada login — lendo o dado e imediatamente salvando
     de volta.
     Agora: hydrateConfigs() atualiza memória, localStorage e UI
     SEM persistir no Firebase. setConfigs() continua sendo usado
     exclusivamente para mudanças intencionais do usuário (tema,
     animações, toggles, etc.).

   MANTIDO (inalterado de v2.1):
   ─────────────────────────────────────────────
   FIX 1 — setUsuario(null) limpa _estado.configs no logout.
   FIX 2 — setConfigs() exclui audioState do save no Firebase.
     - todos os getters/setters
     - lógica de semestre, disciplina, quiz
     - disparo de nexus:loginSuccess e nexus:logout
     - _aplicarConfigs (tema, animações)
   ============================================= */

import Storage from './storage.js';
import { salvarConfigs } from './firebase.js';
/* ── Expõe Storage para o quiz_engine (IIFE sem módulo) ── */
window.NexusStorage = Storage;

/* ══════════════════════════════════════════════════════════
   CONSTANTES
   ══════════════════════════════════════════════════════════ */

export const SEMESTRES = ['2026.2', '2026.1','2027.1' ];


/* ══════════════════════════════════════════════════════════
   DISCIPLINAS POR SEMESTRE
   ══════════════════════════════════════════════════════════ */

const _DISCIPLINAS = {

  '2026.2': [
    { id: 'poo',        nome: 'Programação Orientada a Objetos',  apelido: 'P.O.O.',            emoji: '☕',  arquivo: 'poo' },
    { id: 'redes',      nome: 'Redes de Computadores I',          apelido: 'Redes I',            emoji: '🌐', arquivo: 'redes' },
    { id: 'design',     nome: 'Design de Sistemas de Informação', apelido: 'Design de Sistemas', emoji: '🎨', arquivo: 'design' },
    { id: 'banco_dados',nome: 'Fundamentos de Banco de Dados',    apelido: 'Banco de dados',     emoji: '🗄️', arquivo: 'banco_dados' },
  ],

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
  semestre:   Storage.get('semestre_atual', SEMESTRES[0]),
  disciplina: null,
  usuario:    Storage.get('usuario', null),
  configs:    Storage.get('configs', _defaultConfigs()),
};

function _defaultConfigs() {
  return {
    tema:                 'dark',
    animacoes:            true,
    notificacoes:         false,
    salvarProgressoParcial: false,
    salvarProgresso:      true,
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
  _estado.semestre = s;
  Storage.set('semestre_atual', s);
}

/* ══════════════════════════════════════════════════════════
   GETTERS / SETTERS — disciplina
   ══════════════════════════════════════════════════════════ */

export function getDisciplinaAtual() { return _estado.disciplina; }

export function setDisciplina(id) {
  _estado.disciplina = id ?? null;
}

export function getDisciplinasDeSemestre(semestre) {
  return _DISCIPLINAS[semestre] ?? [];
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
 * O index.js dispara nexus:loginSuccess manualmente DEPOIS do merge
 * de configs para garantir que o audio-state leia o Firebase já com
 * o estado correto. O disparo interno aqui (via setTimeout) ocorre
 * antes do merge, então o index.js cancela o efeito colateral usando
 * o sistema de token do audio-state.js — comportamento esperado e seguro.
 * Nas demais páginas, este disparo aqui é o único necessário.
 */
export function setUsuario(usuario) {
  const anterior = _estado.usuario;
  _estado.usuario = usuario;

  if (usuario) {
    Storage.set('usuario', usuario);

    // Só dispara loginSuccess se realmente trocou de usuário
    // (evita disparo duplicado em atualizações de avatar/configs)
    if (anterior?.uid !== usuario.uid) {
      // Usa setTimeout(0) para garantir que qualquer código síncrono
      // após setUsuario() termine antes de o audio-btn reagir.
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('nexus:loginSuccess', {
          detail: { uid: usuario.uid },
        }));
      }, 0);
    }
  } else {
    Storage.remove('usuario');

    // FIX 1: Limpa configs em memória no logout.
    // Sem isso, getConfigs() retorna os dados do usuário que saiu,
    // e o próximo login herda audioState e outras configs via merge.
    // Nota: não chamamos salvarConfigs() aqui — não há usuário logado
    // para salvar. Apenas o estado em memória e o localStorage são limpos.
    _estado.configs = _defaultConfigs();
    Storage.set('configs', _estado.configs);
    _aplicarConfigs(_estado.configs);

    // Só dispara logout se havia um usuário logado antes.
    // Este é o ÚNICO lugar que deve disparar nexus:logout.
    // index.js NÃO deve disparar este evento manualmente.
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
 *
 * Por que existe:
 * setConfigs() sempre persiste no Firebase quando há usuário logado.
 * Durante o login, o index.js precisa aplicar as configs remotas sem
 * gerar um write-back desnecessário (ler do Firebase e imediatamente
 * salvar de volta é redundante e potencialmente conflitante).
 *
 * @param {object} novas — objeto parcial ou completo de configs
 */
export function hydrateConfigs(novas) {
  _estado.configs = { ..._estado.configs, ...novas };
  Storage.set('configs', _estado.configs);
  _aplicarConfigs(_estado.configs);
}

/**
 * Define novas configs, persiste no Firebase e aplica na UI.
 * Use SOMENTE para mudanças intencionais do usuário
 * (tema, animações, notificações, toggles de quiz, etc.).
 *
 * Para hidratação no login, use hydrateConfigs().
 */
export function setConfigs(novas) {
  _estado.configs = { ..._estado.configs, ...novas };
  Storage.set('configs', _estado.configs);
  _aplicarConfigs(_estado.configs);

  const u = _estado.usuario;
  if (u?.uid) {
    // FIX 2: Remove audioState do payload antes de salvar no Firebase.
    //
    // Por que: audioState é propriedade exclusiva do audio-state.js.
    // Se o salvarmos aqui, sobrescrevemos o valor correto que o
    // audio-state.js acabou de ler e salvar do Firebase deste usuário.
    // O audio-state.js gerencia seu próprio ciclo de persistência —
    // ele salva audioState mesclado com getConfigs() para evitar
    // apagar os outros campos. Se salvarmos audioState aqui também,
    // os dois sistemas pisam um no outro dependendo de quem chegar por
    // último no Firestore.
    //
    // Solução: global.js nunca escreve audioState. audio-state.js é o dono.
    const { audioState: _ignorar, ...payloadSemAudio } = _estado.configs;

    console.log('[global] setConfigs: enviando para Firebase →', payloadSemAudio);
    salvarConfigs(u.uid, payloadSemAudio).catch(() => {});
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

/* ══════════════════════════════════════════════════════════
   QUIZ — limpar dados
   ══════════════════════════════════════════════════════════ */

export function limparDadosQuiz() {
  Storage.clearAllQuizData();
}