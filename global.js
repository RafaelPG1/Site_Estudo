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

export const SEMESTRES = [
  '2026.2', '2026.1',
  '2025.2', '2025.1',
  '2024.2', '2024.1',
];

export const PAGINAS = {
  HOME:    { path: '/index.html' },
  PESSOAL: { path: '/area_pessoal/pessoal.html' },
  RESUMO:  { path: '/resumos/resumos.html' },
  QUIZ:    { path: '/quiz/quiz.html' },
  JOGOS:   { path: '/jogos/jogos.html' },
};

/* ══════════════════════════════════════════════════════════
   DISCIPLINAS POR SEMESTRE

   Cada disciplina tem:
     id       → chave usada na URL (?disc=poo)
     nome     → nome de exibição completo
     arquivo  → nome do arquivo JS de conteúdo (sem .js)
     emoji    → ícone exibido no header do quiz

   Para adicionar um novo semestre ou disciplina,
   basta incluir uma entrada aqui — nenhum outro arquivo muda.
   ══════════════════════════════════════════════════════════ */

const _DISCIPLINAS = {
// global.js — dentro de _DISCIPLINAS

'2026.2': [
  { id: 'poo',         nome: 'Programação Orientada a Objetos', arquivo: 'poo',         emoji: '☕' },
  { id: 'banco_dados', nome: 'Banco de Dados',                  arquivo: 'banco_dados', emoji: '🗄️' },
  { id: 'redes',       nome: 'Redes de Computadores',           arquivo: 'redes',       emoji: '🌐' },
  { id: 'design',      nome: 'Design de Sistemas',              arquivo: 'design',      emoji: '🎨' }, // ← ADICIONAR
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
    salvarProgresso: true,   /* toggle "salvar quiz finalizado" */
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

/**
 * Retorna a lista de disciplinas de um semestre.
 * Se o semestre não tiver uma lista própria, retorna o do
 * semestre mais recente (primeiro de SEMESTRES) como fallback.
 */
export function getDisciplinasDeSemestre(semestre) {
  return (
    _DISCIPLINAS[semestre] ??
    _DISCIPLINAS[SEMESTRES[0]] ??
    []
  );
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

/**
 * Remove todos os dados de quiz (progress, smap, leftat).
 * Configs e demais dados do sistema não são afetados.
 */
export function limparDadosQuiz() {
  Storage.clearAllQuizData();
}