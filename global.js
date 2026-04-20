/* =============================================
   NEXUS STUDY — global.js
   Estado global e utilitários compartilhados
   ============================================= */

import Storage from './storage.js';

/* ── Expõe Storage para o quiz_engine (IIFE sem módulo) ── */
window.NexusStorage = Storage;

/* ══════════════════════════════════════════════════════════
   CONSTANTES
   ══════════════════════════════════════════════════════════ */

export const SEMESTRES = ['2027.1','2026.2', '2026.1' ];


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
    tema:            'dark',
    animacoes:       true,
    notificacoes:    false,
    salvarProgresso: true,
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

export function setUsuario(usuario) {
  _estado.usuario = usuario;
  if (usuario) Storage.set('usuario', usuario);
  else         Storage.remove('usuario');
}

/* ══════════════════════════════════════════════════════════
   GETTERS / SETTERS — configs
   ══════════════════════════════════════════════════════════ */

export function getConfigs() { return { ..._estado.configs }; }

export function setConfigs(novas) {
  _estado.configs = { ..._estado.configs, ...novas };
  Storage.set('configs', _estado.configs);
  _aplicarConfigs(_estado.configs);
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