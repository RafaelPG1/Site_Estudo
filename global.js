/* =============================================
   NEXUS STUDY — global.js
   Estado global + funções de controle
   ============================================= */

import Storage from './storage.js';

/* ─────────────────────────────────────────────
   MAPA DE PÁGINAS
   Cada entrada: { id, label, path, section }
   section → qual área do sistema
───────────────────────────────────────────── */
export const PAGINAS = {
  HOME:              { id: 'HOME',              label: 'Início',              path: '/index.html',                    section: 'root'    },

  // Área Pessoal
  PESSOAL:           { id: 'PESSOAL',           label: 'Área Pessoal',        path: '/area_pessoal/pessoal.html',     section: 'pessoal' },
  ANOTACOES:         { id: 'ANOTACOES',         label: 'Anotações',           path: '/area_pessoal/anotacoes/anotacoes.html', section: 'pessoal' },

  // Resumos
  RESUMO:            { id: 'RESUMO',            label: 'Resumos',             path: '/resumo/resumo.html',            section: 'resumo'  },

  // Quiz
  QUIZ:              { id: 'QUIZ',              label: 'Quiz',                path: '/quiz/quiz.html',                section: 'quiz'    },

  // Jogos
  JOGOS:             { id: 'JOGOS',             label: 'Jogos',               path: '/jogos/jogo.html',               section: 'jogos'   },
  JOGO_1:            { id: 'JOGO_1',            label: 'Jogo 1',              path: '/jogos/jogo_1/jogo1.html',       section: 'jogos'   },
  JOGO_2:            { id: 'JOGO_2',            label: 'Jogo 2',              path: '/jogos/jogo_2/jogo2.html',       section: 'jogos'   },
};

/* ─────────────────────────────────────────────
   MAPA DE DISCIPLINAS
   Organizado por semestre.
   id      → deve bater com o param ?disc= da URL
   nome    → nome completo para exibição no DOM
   arquivo → nome do arquivo JS de conteúdo em quiz/conteudo/
   emoji   → ícone exibido nos templates
───────────────────────────────────────────── */
export const DISCIPLINAS = {
  '2026.2': [
    { id: 'poo',         nome: 'Programação Orientada a Objetos', arquivo: 'poo',         emoji: '💻' },
    { id: 'redes',       nome: 'Redes de Computadores',           arquivo: 'redes',       emoji: '🌐' },
    { id: 'design',      nome: 'Design de Sistemas',              arquivo: 'design',      emoji: '🎨' },
    { id: 'banco_dados', nome: 'Fundamentos de Banco de Dados',   arquivo: 'banco_dados', emoji: '🗄️' },
  ],

  // Adicione futuros semestres aqui — nada mais precisa mudar no sistema:
  // '2027.1': [
  //   { id: 'calc',       nome: 'Cálculo I',           arquivo: 'calc',       emoji: '📐' },
  //   { id: 'estruturas', nome: 'Estrutura de Dados',  arquivo: 'estruturas', emoji: '🌲' },
  // ],
};

/* ─────────────────────────────────────────────
   SEMESTRES DISPONÍVEIS
───────────────────────────────────────────── */
export const SEMESTRES = Object.keys(DISCIPLINAS);

/* ─────────────────────────────────────────────
   CONFIG PADRÃO
───────────────────────────────────────────── */
const CONFIG_PADRAO = {
  tema:          'dark',
  idioma:        'pt-BR',
  notificacoes:  true,
  animacoes:     true,
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

/** Retorna cópia do estado completo */
export function getEstado() {
  return { ..._estado };
}

/* ─────────────────────────────────────────────
   FUNÇÕES — USUÁRIO
───────────────────────────────────────────── */

/**
 * Define o usuário logado.
 * @param {object|null} usuario - { uid, nome, email, foto } ou null para logout
 */
export function setUsuario(usuario) {
  _estado.usuario       = usuario;
  _estado.modoVisitante = usuario === null;
  Storage.set('usuario',       usuario);
  Storage.set('modoVisitante', _estado.modoVisitante);
}

/** Retorna o usuário atual */
export function getUsuario() {
  return _estado.usuario;
}

/** Verifica se há usuário logado */
export function estaLogado() {
  return _estado.usuario !== null;
}

/* ─────────────────────────────────────────────
   FUNÇÕES — NAVEGAÇÃO
───────────────────────────────────────────── */

/**
 * Define a página atual pelo ID (chave de PAGINAS).
 * @param {string} paginaId - ex: 'HOME', 'QUIZ', 'RESUMO'
 */
export function setPagina(paginaId) {
  if (!PAGINAS[paginaId]) {
    console.warn(`[Global] Página desconhecida: "${paginaId}"`);
    return;
  }
  _estado.paginaAtual = paginaId;
  Storage.set('paginaAtual', paginaId);
}

/** Retorna o ID da página atual */
export function getPaginaAtual() {
  return _estado.paginaAtual;
}

/** Retorna o objeto completo da página atual */
export function getPaginaInfo() {
  return PAGINAS[_estado.paginaAtual] ?? null;
}

/* ─────────────────────────────────────────────
   FUNÇÕES — DISCIPLINA / ESTUDO
───────────────────────────────────────────── */

/**
 * Define a disciplina atual pelo ID.
 * O id deve existir em DISCIPLINAS[semestreAtual].
 * @param {string|null} disciplinaId - ex: 'poo', 'redes' ou null
 */

export function setDisciplina(disciplinaId) {
  if (disciplinaId !== null) {
    const semestre = _estado.semestreAtual;
    const lista    = DISCIPLINAS[semestre] ?? [];
    const existe   = lista.some(d => d.id === disciplinaId);

    if (!existe) {
      console.warn(`[Global] Disciplina "${disciplinaId}" não existe em ${semestre}`);
      
      // ✅ Em vez de abandonar, usa a primeira disponível
      const fallback = lista[0]?.id ?? null;
      if (fallback) {
        console.warn(`[Global] Usando fallback: "${fallback}"`);
        disciplinaId = fallback;           // continua com o fallback
      } else {
        return;                            // lista vazia — não há o que fazer
      }
    }
  }

  _estado.disciplinaAtual = disciplinaId;
  Storage.set('disciplinaAtual', disciplinaId);
}

/** Retorna o ID da disciplina atual */
export function getDisciplinaAtual() {
  return _estado.disciplinaAtual;
}

/** Retorna o objeto completo da disciplina atual */
export function getDisciplinaInfo() {
  const lista = DISCIPLINAS[_estado.semestreAtual] ?? [];
  return lista.find(d => d.id === _estado.disciplinaAtual) ?? null;
}

/**
 * Define o semestre ativo.
 * Reseta a disciplina atual ao trocar de semestre.
 * @param {string} semestre - ex: '2026.2', '2027.1'
 */
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

/** Retorna o semestre atual */
export function getSemestreAtual() {
  return _estado.semestreAtual;
}

/** Retorna lista de disciplinas do semestre informado (ou do atual) */
export function getDisciplinasDeSemestre(semestre = null) {
  const s = semestre ?? _estado.semestreAtual;
  return DISCIPLINAS[s] ?? [];
}

/* ─────────────────────────────────────────────
   FUNÇÕES — CONFIGURAÇÕES
───────────────────────────────────────────── */

/**
 * Atualiza as configs (merge com as atuais).
 * @param {object} novasConfigs - parcial ou total
 */
export function setConfigs(novasConfigs) {
  _estado.configs = { ..._estado.configs, ...novasConfigs };
  Storage.set('configs', _estado.configs);
}

/** Retorna as configs atuais */
export function getConfigs() {
  return { ..._estado.configs };
}

/** Reseta as configs para o padrão */
export function resetConfigs() {
  _estado.configs = { ...CONFIG_PADRAO };
  Storage.set('configs', _estado.configs);
}