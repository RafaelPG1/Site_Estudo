/* =============================================
   NEXUS STUDY — global.js
   Estado global + funções de controle
   ============================================= */

import Storage from './storage.js';

/* ─────────────────────────────────────────────
   MAPA DE PÁGINAS
───────────────────────────────────────────── */
export const PAGINAS = {
  HOME:              { id: 'HOME',              label: 'Início',              path: '/index.html',                    section: 'root'    },
  PESSOAL:           { id: 'PESSOAL',           label: 'Área Pessoal',        path: '/area_pessoal/pessoal.html',     section: 'pessoal' },
  ANOTACOES:         { id: 'ANOTACOES',         label: 'Anotações',           path: '/area_pessoal/anotacoes/anotacoes.html', section: 'pessoal' },
  RESUMO:            { id: 'RESUMO',            label: 'Resumos',             path: '/resumo/resumo.html',            section: 'resumo'  },
  QUIZ:              { id: 'QUIZ',              label: 'Quiz',                path: '/quiz/quiz.html',                section: 'quiz'    },
  JOGOS:             { id: 'JOGOS',             label: 'Jogos',               path: '/jogos/jogo.html',               section: 'jogos'   },
  JOGO_1:            { id: 'JOGO_1',            label: 'Jogo 1',              path: '/jogos/jogo_1/jogo1.html',       section: 'jogos'   },
  JOGO_2:            { id: 'JOGO_2',            label: 'Jogo 2',              path: '/jogos/jogo_2/jogo2.html',       section: 'jogos'   },
};

/* ─────────────────────────────────────────────
   MAPA DE DISCIPLINAS
───────────────────────────────────────────── */
export const DISCIPLINAS = {
  '2026.2': [
    { id: 'poo',         nome: 'Programação Orientada a Objetos', arquivo: 'poo',         emoji: '💻' },
    { id: 'redes',       nome: 'Redes de Computadores',           arquivo: 'redes',       emoji: '🌐' },
    { id: 'design',      nome: 'Design de Sistemas',              arquivo: 'design',      emoji: '🎨' },
    { id: 'banco_dados', nome: 'Fundamentos de Banco de Dados',   arquivo: 'banco_dados', emoji: '🗄️' },
  ],
};

/* ─────────────────────────────────────────────
   SEMESTRES DISPONÍVEIS
───────────────────────────────────────────── */
export const SEMESTRES = Object.keys(DISCIPLINAS);

/* ─────────────────────────────────────────────
   CONFIG PADRÃO
───────────────────────────────────────────── */
const CONFIG_PADRAO = {
  tema:             'dark',
  idioma:           'pt-BR',
  notificacoes:     true,
  animacoes:        true,
  salvarProgresso:  true,
};

/* ─────────────────────────────────────────────
   ESTADO INTERNO
───────────────────────────────────────────── */
let _estado = {
  usuario:         Storage.get('usuario',         null),
  disciplinaAtual: Storage.get('disciplinaAtual', null),
  semestreAtual:   Storage.get('semestreAtual',   '2026.2'),
  paginaAtual:     Storage.get('paginaAtual',     'HOME'),
  modoVisitante:   Storage.get('modoVisitante',   true),
  configs:         Storage.get('configs',         { ...CONFIG_PADRAO }),
};

/* ─────────────────────────────────────────────
   FUNÇÕES — ESTADO GERAL
───────────────────────────────────────────── */
export function getEstado() {
  return { ..._estado };
}

/* ─────────────────────────────────────────────
   FUNÇÕES — USUÁRIO
───────────────────────────────────────────── */
export function setUsuario(usuario) {
  _estado.usuario       = usuario;
  _estado.modoVisitante = usuario === null;
  Storage.set('usuario',       usuario);
  Storage.set('modoVisitante', _estado.modoVisitante);
}

export function getUsuario() {
  return _estado.usuario;
}

export function estaLogado() {
  return _estado.usuario !== null;
}

/* ─────────────────────────────────────────────
   FUNÇÕES — NAVEGAÇÃO
───────────────────────────────────────────── */
export function setPagina(paginaId) {
  if (!PAGINAS[paginaId]) {
    console.warn(`[Global] Página desconhecida: "${paginaId}"`);
    return;
  }
  _estado.paginaAtual = paginaId;
  Storage.set('paginaAtual', paginaId);
}

export function getPaginaAtual() {
  return _estado.paginaAtual;
}

export function getPaginaInfo() {
  return PAGINAS[_estado.paginaAtual] ?? null;
}

/* ─────────────────────────────────────────────
   FUNÇÕES — DISCIPLINA / ESTUDO
───────────────────────────────────────────── */
export function setDisciplina(disciplinaId) {
  if (disciplinaId !== null) {
    const semestre = _estado.semestreAtual;
    const lista    = DISCIPLINAS[semestre] ?? [];
    const existe   = lista.some(d => d.id === disciplinaId);

    if (!existe) {
      console.warn(`[Global] Disciplina "${disciplinaId}" não existe em ${semestre}`);
      const fallback = lista[0]?.id ?? null;
      if (fallback) {
        console.warn(`[Global] Usando fallback: "${fallback}"`);
        disciplinaId = fallback;
      } else {
        return;
      }
    }
  }
  _estado.disciplinaAtual = disciplinaId;
  Storage.set('disciplinaAtual', disciplinaId);
}

export function getDisciplinaAtual() {
  return _estado.disciplinaAtual;
}

export function getDisciplinaInfo() {
  const lista = DISCIPLINAS[_estado.semestreAtual] ?? [];
  return lista.find(d => d.id === _estado.disciplinaAtual) ?? null;
}

export function setSemestre(semestre) {
  if (!DISCIPLINAS[semestre]) {
    console.warn(`[Global] Semestre "${semestre}" não cadastrado`);
    return;
  }
  _estado.semestreAtual   = semestre;
  _estado.disciplinaAtual = null;
  Storage.set('semestreAtual',   semestre);
  Storage.set('disciplinaAtual', null);
}

export function getSemestreAtual() {
  return _estado.semestreAtual;
}

export function getDisciplinasDeSemestre(semestre = null) {
  const s = semestre ?? _estado.semestreAtual;
  return DISCIPLINAS[s] ?? [];
}

/* ─────────────────────────────────────────────
   FUNÇÕES — CONFIGURAÇÕES
───────────────────────────────────────────── */
export function setConfigs(novasConfigs) {
  _estado.configs = { ..._estado.configs, ...novasConfigs };
  Storage.set('configs', _estado.configs);
}

export function getConfigs() {
  return { ..._estado.configs };
}

export function resetConfigs() {
  _estado.configs = { ...CONFIG_PADRAO };
  Storage.set('configs', _estado.configs);
}

/* ─────────────────────────────────────────────
   FUNÇÕES — QUIZ
───────────────────────────────────────────── */

/**
 * Remove todas as chaves nexus_quiz_* do localStorage.
 * Configs, usuário e o resto do sistema são preservados.
 */
export function limparDadosQuiz() {
  Storage.clearAllQuizData();
}