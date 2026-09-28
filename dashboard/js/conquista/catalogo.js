/* dashboard\js\conquista\catalogo.js
   Conquistas — CATÁLOGO (dados/textos). Arquivo para EDITAR quando
   quiser adicionar, remover ou renomear uma conquista, mudar
   descrição, emoji, categoria ou raridade (tag).

   ATENÇÃO: adicionar uma conquista aqui só a faz aparecer como
   "bloqueada". Para ela ser DESBLOQUEADA / ter barra de progresso,
   crie também a regra correspondente em regras.js (mesmo `id`).

   Movido de conquistas.js (bloco "Catálogo" + mapas + abas) sem
   alterar nenhum valor — só ganhou `export`.
   ═══════════════════════════════════════════════════════════ */

/* ── Catálogo de conquistas — fonte única de verdade, inalterado
   em relação à versão anterior (mesmos ids, mesmas descrições).
   `categoria` e `tag` são traduzidos para o vocabulário da V2
   pelos mapas logo abaixo (CATEGORIA_MAP / TAG_RARIDADE_MAP). ── */
export const CONQUISTAS_CATALOGO = [
  { id: 'primeiroPasso',      categoria: 'estudo',         emoji: '🌱', nome: 'Primeiro Passo',          desc: 'Concluiu o primeiro quiz',                               tag: 'Bronze' },
  { id: 'tentativas10',       categoria: 'estudo',         emoji: '📝', nome: '10 Tentativas',          desc: 'Completou 10 quizzes na plataforma',                      tag: 'Bronze' },
  { id: 'tentativas50',       categoria: 'estudo',         emoji: '📝', nome: '50 Tentativas',          desc: 'Completou 50 quizzes na plataforma',                      tag: 'Prata'  },
  { id: 'tentativas100',      categoria: 'estudo',         emoji: '📝', nome: '100 Tentativas',         desc: 'Completou 100 quizzes na plataforma',                     tag: 'Prata'  },
  { id: 'tentativas500',      categoria: 'estudo',         emoji: '📚', nome: '500 Tentativas',         desc: 'Completou 500 quizzes na plataforma',                     tag: 'Ouro'   },

  { id: 'questoes100',        categoria: 'conhecimento',   emoji: '⚡', nome: '100 Questões',           desc: 'Respondeu 100 questões',                                  tag: 'Bronze' },
  { id: 'questoes500',        categoria: 'conhecimento',   emoji: '⚡', nome: '500 Questões',           desc: 'Respondeu 500 questões',                                  tag: 'Prata'  },
  { id: 'questoesMil',        categoria: 'conhecimento',   emoji: '⚡', nome: 'Mil Questões',           desc: 'Respondeu mais de 1.000 questões',                         tag: 'Ouro'   },
  { id: 'questoes5000',       categoria: 'conhecimento',   emoji: '⚡', nome: '5 Mil Questões',         desc: 'Respondeu mais de 5.000 questões',                         tag: 'Diamante' },

  { id: 'sequencia3',         categoria: 'sequencias',     emoji: '🔥', nome: 'Sequência de 3 dias',    desc: 'Estudou por 3 dias consecutivos',                          tag: 'Bronze' },
  { id: 'sequencia7',         categoria: 'sequencias',     emoji: '🔥', nome: 'Sequência de 7 dias',    desc: 'Estudou por 7 dias consecutivos',                          tag: 'Prata'  },
  { id: 'sequencia15',        categoria: 'sequencias',     emoji: '🔥', nome: 'Sequência de 15 dias',   desc: 'Estudou por 15 dias consecutivos',                         tag: 'Ouro'   },
  { id: 'sequencia30',        categoria: 'sequencias',     emoji: '🔥', nome: 'Sequência de 30 dias',   desc: 'Estudou por 30 dias consecutivos',                         tag: 'Ouro'   },
  { id: 'sequencia100',       categoria: 'sequencias',     emoji: '🔥', nome: 'Sequência de 100 dias',  desc: 'Estudou por 100 dias consecutivos',                        tag: 'Diamante' },

  { id: 'tempo1h',            categoria: 'tempo',          emoji: '⏱️', nome: '1 Hora',                 desc: 'Acumulou 1 hora de estudo',                                tag: 'Bronze' },
  { id: 'tempo10h',           categoria: 'tempo',          emoji: '⏱️', nome: '10 Horas',               desc: 'Acumulou 10 horas de estudo',                              tag: 'Prata'  },
  { id: 'tempo50h',           categoria: 'tempo',          emoji: '⏱️', nome: '50 Horas',               desc: 'Acumulou 50 horas de estudo',                              tag: 'Ouro'   },
  { id: 'tempo100h',          categoria: 'tempo',          emoji: '🏅', nome: '100 Horas',              desc: 'Acumulou 100 horas de estudo',                             tag: 'Diamante' },
  { id: 'maratonista',        categoria: 'tempo',          emoji: '🏆', nome: 'Maratonista',            desc: 'Estudou mais de 5 horas em um único dia',                  tag: 'Ouro'   },

  { id: 'scoreIntermediario', categoria: 'desempenho',     emoji: '🎯', nome: 'Score Intermediário',    desc: 'Atingiu nível Intermediário',                              tag: 'Prata'  },
  { id: 'scoreAvancado',      categoria: 'desempenho',     emoji: '🎯', nome: 'Score Avançado',         desc: 'Atingiu nível Avançado',                                   tag: 'Ouro'   },
  { id: 'scoreElite',         categoria: 'desempenho',     emoji: '👑', nome: 'Score Elite',            desc: 'Atingiu o maior nível de desempenho',                      tag: 'Diamante' },
  { id: 'miraAfiada',         categoria: 'desempenho',     emoji: '🎯', nome: 'Mira Afiada',            desc: 'Mais de 75% de acertos na média geral',                    tag: 'Ouro'   },
  { id: 'precisao90',         categoria: 'desempenho',     emoji: '🎯', nome: 'Precisão Máxima',        desc: 'Alcançou 90% de acertos',                                  tag: 'Diamante' },

  { id: 'emEvolucao',         categoria: 'desempenho',     emoji: '📈', nome: 'Em Evolução',            desc: 'O sistema detectou melhora constante',                     tag: 'Prata'  },
  { id: 'superacao',          categoria: 'desempenho',     emoji: '🚀', nome: 'Superação',              desc: 'Melhorou significativamente seu desempenho',               tag: 'Ouro'   },
  { id: 'semQuedas',          categoria: 'consistencia',   emoji: '✅', nome: 'Sem Quedas',             desc: 'Nenhuma disciplina em queda',                              tag: 'Prata'  },
  { id: 'equilibrado',        categoria: 'consistencia',   emoji: '⚖️', nome: 'Equilibrado',            desc: 'Todas as disciplinas possuem bom desempenho',              tag: 'Ouro'   },

  { id: 'sessoes10',          categoria: 'consistencia',   emoji: '📅', nome: '10 Sessões',             desc: 'Realizou 10 sessões de estudo',                            tag: 'Bronze' },
  { id: 'sessoes50',          categoria: 'consistencia',   emoji: '🏆', nome: '50 Sessões',             desc: 'Realizou 50 sessões de estudo',                            tag: 'Ouro'   },
  { id: 'sessoes100',         categoria: 'consistencia',   emoji: '🏆', nome: '100 Sessões',            desc: 'Realizou 100 sessões de estudo',                           tag: 'Diamante' },

  { id: 'explorador',         categoria: 'plataforma',     emoji: '🧭', nome: 'Explorador',             desc: 'Visitou todas as áreas da plataforma',                     tag: 'Bronze' },
  { id: 'organizado',         categoria: 'plataforma',     emoji: '📂', nome: 'Organizado',             desc: 'Criou sua primeira disciplina',                            tag: 'Bronze' },
  { id: 'dedicado',           categoria: 'plataforma',     emoji: '📖', nome: 'Dedicado',               desc: 'Leu 100 conteúdos',                                        tag: 'Prata'  },
  { id: 'curioso',            categoria: 'plataforma',     emoji: '🔎', nome: 'Curioso',                desc: 'Pesquisou diversos conteúdos na plataforma',               tag: 'Bronze' },

  { id: 'madrugador',         categoria: 'habitos',        emoji: '🌅', nome: 'Madrugador',             desc: 'Estudou antes das 6h da manhã',                            tag: 'Prata'  },
  { id: 'noturno',            categoria: 'habitos',        emoji: '🌙', nome: 'Coruja',                 desc: 'Estudou após as 23h',                                      tag: 'Prata'  },
  { id: 'pontual',            categoria: 'habitos',        emoji: '⏰', nome: 'Pontual',                desc: 'Estudou no horário planejado por 7 dias',                  tag: 'Ouro'   },

  { id: 'focoTotal',          categoria: 'habitos',        emoji: '🧠', nome: 'Foco Total',             desc: 'Concluiu uma sessão sem interrupções',                     tag: 'Bronze' },
  { id: 'incansavel',         categoria: 'habitos',        emoji: '💪', nome: 'Incansável',             desc: 'Completou 10 dias com mais de 2 horas de estudo',          tag: 'Ouro'   },

  { id: 'colecionador',       categoria: 'especial',       emoji: '🏅', nome: 'Colecionador',           desc: 'Desbloqueou 10 conquistas',                                tag: 'Prata'  },
  { id: 'veterano',           categoria: 'especial',       emoji: '🎖️', nome: 'Veterano',              desc: 'Desbloqueou 25 conquistas',                                tag: 'Ouro'   },
  { id: 'lendario',           categoria: 'especial',       emoji: '👑', nome: 'Lendário',               desc: 'Desbloqueou 50 conquistas',                                tag: 'Diamante' },

  { id: 'persistente',        categoria: 'especial',       emoji: '🛡️', nome: 'Persistente',            desc: 'Nunca desistiu de um quiz iniciado',                       tag: 'Ouro'   },
  { id: 'estrela',            categoria: 'especial',       emoji: '⭐', nome: 'Estrela',                 desc: 'Recebeu destaque em desempenho',                           tag: 'Ouro'   },
  { id: 'genio',              categoria: 'especial',       emoji: '🧠', nome: 'Gênio',                  desc: 'Acertou 100 questões consecutivas',                        tag: 'Diamante' },
  { id: 'invencivel',         categoria: 'especial',       emoji: '💎', nome: 'Invencível',             desc: 'Manteve desempenho excelente por um mês',                  tag: 'Diamante' },
  { id: 'nexusMaster',        categoria: 'especial',       emoji: '🌌', nome: 'Nexus Master',           desc: 'Alcançou o nível máximo da plataforma',                    tag: 'Diamante' },
];

/* Tradução das categorias antigas para as 6 abas do protótipo V2.
   Puramente de apresentação — não muda `categoria` no catálogo. */
export const CATEGORIA_MAP = {
  estudo:       'desempenho',
  conhecimento: 'conhecimento',
  sequencias:   'sequencias',
  tempo:        'tempo',
  desempenho:   'desempenho',
  consistencia: 'consistencia',
  plataforma:   'exploracao',
  habitos:      'exploracao',
  especial:     'exploracao',
};

/* Tradução da tag antiga (Bronze/Prata/Ouro/Diamante) para a
   escala de raridade de 5 níveis do protótipo V2. "Épica" fica
   sem uso direto do catálogo atual — não é obrigatório usar as 5
   raridades, e nenhuma conquista existente perde informação com
   este mapeamento 1:1. */
export const TAG_RARIDADE_MAP = { Bronze: 'comum', Prata: 'incomum', Ouro: 'rara', Diamante: 'lendaria' };
export const RARIDADE_PESO    = { comum: 0, incomum: 1, rara: 2, epica: 3, lendaria: 4 };
export const RARITY_LABEL     = { comum: 'Comum', incomum: 'Incomum', rara: 'Rara', epica: 'Épica', lendaria: 'Lendária' };

export const ACH_CATS = [
  { id: 'todas',        label: 'Todas',         icon: null },
  { id: 'desempenho',   label: 'Desempenho',    icon: 'trending' },
  { id: 'consistencia', label: 'Consistência',  icon: 'calendar' },
  { id: 'sequencias',   label: 'Sequências',    icon: 'flame' },
  { id: 'tempo',        label: 'Tempo de estudo', icon: 'clock' },
  { id: 'conhecimento', label: 'Conhecimento',  icon: 'book' },
  { id: 'exploracao',   label: 'Exploração',    icon: 'compass' },
];

export const ACH_PAGE_SIZE = 20;