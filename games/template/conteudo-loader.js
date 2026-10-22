/* ═══════════════════════════════════════════════════════════════
   NEXUS STUDY — games/template/conteudo-loader.js   (NOVO)

   Carregador ÚNICO e validado do conteúdo dos jogos de estudo.

   ESTRUTURA DE PASTAS (usa "/", nunca "\")
     content/games/<jogo>/<semestre>/<avaliação>/<arquivo>.js
     ex.: content/games/completar_frase/2026.2/AP1/completar_frase_data.js

   DE ONDE VÊM OS VALORES
   O site já identifica o semestre com a avaliação junto: ?sem=2026.2-AP1
   (é o valor do seletor de semestre do hub). O carregador separa:
       2026.2-AP1  →  semestre "2026.2"  +  avaliação "AP1"
   Também aceita ?ap=AP1 explícito (tem prioridade). Assim o hub NÃO
   precisou de parâmetro novo: ele já enviava a avaliação dentro de sem.
   A disciplina (?disc=) continua sendo uma chave DENTRO do arquivo,
   porque cada jogo guarda todas as disciplinas do semestre/AP juntas.

   SEGURANÇA DO CAMINHO
   semestre, avaliação e jogo são validados por regex/lista ANTES de
   entrar no import() — nada vindo da URL vira caminho sem validação.

   RESULTADO  (nunca lança erro)
     { ok:true,  banco, dados, disc, semestre, avaliacao, caminho, teste }
     { ok:false, codigo, titulo, mensagem, semestre, avaliacao, caminho }
   `codigo`: 'parametros' | 'sem-avaliacao' | 'sem-arquivo' |
             'formato' | 'sem-disciplina' | 'vazio'
   Nunca devolve banco vazio "em silêncio": quem chama mostra
   `titulo`/`mensagem` na tela.

   Conteúdo de teste: o arquivo exporta CONTEUDO_TESTE = true (ou a
   função flashcard devolve .teste); o jogo pode exibir o aviso.
═══════════════════════════════════════════════════════════════ */

const JOGOS = {
  show_milhao:     { pasta: 'show_milhao',     arquivo: 'show_milhao_data.js',     exporta: 'SHOW_MILHAO_DATA',     tipo: 'lista' },
  vdd_falso:       { pasta: 'vdd_falso',       arquivo: 'vdd_falso_data.js',       exporta: 'VDD_FALSO_DATA',       tipo: 'lista' },
  completar_frase: { pasta: 'completar_frase', arquivo: 'completar_frase_data.js', exporta: 'COMPLETAR_FRASE_DATA', tipo: 'lista' },
  flashcard:       { pasta: 'flashcards',      arquivo: 'cards_data.js',           exporta: 'getCardsData',         tipo: 'funcao' },
  associacao:      { pasta: 'associacao',      arquivo: 'associacao_data.js',      exporta: 'ASSOCIACAO_DATA',      tipo: 'rodadas' },
};

const RE_SEMESTRE  = /^\d{4}\.[1-9]$/;
const RE_AVALIACAO = /^AP[1-9]$/;
const RE_DISC      = /^[a-z0-9_]{1,40}$/i;

/** "2026.2-AP1" → { semestre:'2026.2', avaliacao:'AP1' } (ap explícito prevalece). */
export function separarSemestre(semParam, apParam) {
  const m = String(semParam ?? '').trim().match(/^(\d{4}\.\d+)(?:-([A-Za-z0-9]+))?$/);
  const semestre  = m ? m[1] : '';
  const avaliacao = String(apParam || (m && m[2]) || '').toUpperCase();
  return { semestre, avaliacao };
}

function erro(codigo, titulo, mensagem, extra = {}) {
  return { ok: false, codigo, titulo, mensagem, banco: [], dados: null, ...extra };
}

/**
 * @param {object} p
 * @param {'show_milhao'|'vdd_falso'|'completar_frase'|'flashcard'|'associacao'} p.jogo
 * @param {string} p.sem   valor de ?sem= (ex.: '2026.2-AP1')
 * @param {string} [p.ap]  valor de ?ap= (opcional)
 * @param {string} p.disc  valor de ?disc=
 */
export async function carregarConteudo({ jogo, sem, ap, disc }) {
  const cfg = JOGOS[jogo];
  if (!cfg) return erro('parametros', 'Jogo desconhecido', `O jogo "${jogo}" não está cadastrado no carregador de conteúdo.`);

  const { semestre, avaliacao } = separarSemestre(sem, ap);
  const ctx = { semestre, avaliacao };

  if (!RE_SEMESTRE.test(semestre)) {
    return erro('parametros', 'Semestre inválido',
      'Não foi possível identificar o semestre. Volte à central de jogos e escolha o semestre no topo.', ctx);
  }
  if (!avaliacao) {
    return erro('sem-avaliacao', 'Escolha a avaliação',
      `Este jogo precisa saber qual avaliação (AP1, AP2…) do semestre <strong>${semestre}</strong> você quer estudar. Volte à central de jogos e escolha o semestre com a avaliação.`, ctx);
  }
  if (!RE_AVALIACAO.test(avaliacao)) {
    return erro('parametros', 'Avaliação inválida',
      `A avaliação "${avaliacao.replace(/[<>&"]/g, '')}" não é válida. Use AP1, AP2…`, ctx);
  }

  const caminho = `content/games/${cfg.pasta}/${semestre}/${avaliacao}/${cfg.arquivo}`;
  ctx.caminho = caminho;

  let modulo;
  try {
    modulo = await import(`../../content/games/${cfg.pasta}/${semestre}/${avaliacao}/${cfg.arquivo}`);
  } catch (err) {
    console.warn(`[conteudo] ${caminho} não carregou:`, err?.message);
    return erro('sem-arquivo', 'Conteúdo ainda não disponível',
      `Ainda não há conteúdo deste jogo para <strong>${semestre} · ${avaliacao}</strong>.<br>Escolha outra avaliação/semestre no topo da central de jogos ou aguarde novas adições.`, ctx);
  }

  const bruto = modulo[cfg.exporta];
  let porSemestre;
  try {
    porSemestre = cfg.tipo === 'funcao' ? (typeof bruto === 'function' ? bruto(semestre) : null) : bruto?.[semestre];
  } catch { porSemestre = null; }
  if (!porSemestre || typeof porSemestre !== 'object') {
    return erro('formato', 'Conteúdo com formato inesperado',
      `O arquivo de <strong>${semestre} · ${avaliacao}</strong> existe, mas não traz o semestre "${semestre}" no formato esperado. Avise o responsável pelo conteúdo.`, ctx);
  }

  const teste = modulo.CONTEUDO_TESTE === true;
  const dados = porSemestre;

  if (!RE_DISC.test(String(disc ?? ''))) {
    return erro('sem-disciplina', 'Disciplina não informada',
      'Volte à central de jogos e escolha a disciplina.', { ...ctx, dados, teste });
  }
  const itens = dados[disc];
  const valido = cfg.tipo === 'rodadas'
    ? itens && typeof itens === 'object' && !Array.isArray(itens) && Object.keys(itens).length > 0
    : Array.isArray(itens) && itens.length > 0;
  if (!itens) {
    return erro('sem-disciplina', 'Sem conteúdo para esta disciplina',
      `Não há conteúdo desta disciplina em <strong>${semestre} · ${avaliacao}</strong> para este jogo. Escolha outra disciplina ou avaliação.`, { ...ctx, dados, teste });
  }
  if (!valido) {
    return erro('vazio', 'Conteúdo vazio',
      `A disciplina existe em <strong>${semestre} · ${avaliacao}</strong>, mas não tem itens para jogar.`, { ...ctx, dados, teste });
  }

  return { ok: true, banco: itens, dados, disc, semestre, avaliacao, caminho, teste };
}

/** Preenche a tela "vazia" de um jogo com a mensagem do carregador, se houver elementos #empty-title/#empty-desc. */
export function mostrarMensagemConteudo(carga) {
  if (!carga || carga.ok) return;
  const t = document.getElementById('empty-title');
  const d = document.getElementById('empty-desc');
  if (t) t.textContent = carga.titulo;
  if (d) d.innerHTML = carga.mensagem;
}
