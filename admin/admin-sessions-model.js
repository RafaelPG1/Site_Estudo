/* =============================================
   NEXUS STUDY — admin-sessions-model.js
   Painel de Administração — Seção Sessões (lógica pura)
   admin/admin-sessions-model.js

   Este módulo NÃO tem DOM, NÃO importa Firebase e NÃO tem
   efeitos colaterais: só recebe dados crus de documentos de
   sessão e devolve objetos normalizados / textos formatados.
   Isso permite testar toda a regra de tempo fora do navegador.

   ── FORMATOS DE DOCUMENTO SUPORTADOS ──────────────────────
   usuarios/{uid}/sessoes/{sessionId}

   ATUAL (src/session-tracker.js v8+):
     startedAt : ms (epoch)          início
     endedAt   : ms (epoch)          última gravação (heartbeat 30 s)
     duracao   : SEGUNDOS            tempo ATIVO (pausa em ociosidade)
     deviceType, pages, navigation, hourHeatmap, semestre, dataKey
     _encerradaComoZumbi (opcional)

   LEGADO (shared/js/utils/session-tracker.js):
     entrada   : ms (epoch)          início
     saida     : ms (epoch) | null   última gravação (heartbeat 60 s)
     duracao   : MILISSEGUNDOS       relógio corrido (saida − entrada)
     encerramento: 'ativo' | 'normal' | 'beforeunload' | 'timeout'
     nome, avatar, uid

   ── PRINCÍPIOS ────────────────────────────────────────────
   • Todos os timestamps são instantes (epoch ms). Nenhuma
     compensação de fuso é feita: a exibição usa o fuso do
     navegador de quem está vendo (ou o informado nos testes).
   • Internamente TUDO é milissegundos. A conversão de
     `duracao` (segundos no formato atual) acontece uma única
     vez, em normalizarSessao().
   • Privacidade por construção: normalizarSessao() devolve
     apenas o que o Admin precisa. Rotas, query strings, nomes
     de página, nome/avatar gravados na sessão e qualquer outro
     campo NÃO saem daqui — só contagens agregadas.
   ============================================= */

export const CONFIG = Object.freeze({
  HEARTBEAT_NOVO_MS:   30_000,      // src/session-tracker.js  → HEARTBEAT_INTERVAL
  HEARTBEAT_LEGADO_MS: 60_000,      // tracker legado          → HEARTBEAT_MS
  FATOR_ATIVA:         3,           // "Ativa" = até 3 heartbeats sem gravação
  TOLERANCIA_MS:       5 * 60_000,  // mesmo limite de "zumbi" do tracker atual
  JANELA_DIAS:         30,          // histórico carregado
  MODAL_DIAS:          7,           // logs detalhados por usuário
});

export const MS_DIA = 86_400_000;

export const STATUS = Object.freeze({
  ATIVA:     'ativa',
  AUSENTE:   'ausente',
  ENCERRADA: 'encerrada',
});

export const STATUS_INFO = Object.freeze({
  ativa:     { label: 'Ativa',     cls: 'badge--teal',  dot: true  },
  ausente:   { label: 'Ausente',   cls: 'badge--amber', dot: false },
  encerrada: { label: 'Encerrada', cls: 'badge--grey',  dot: false },
});

/* Qualquer timestamp anterior a 2000-01-01 é tratado como inválido
   (protege contra 0, segundos no lugar de ms, lixo etc.). */
const MS_MIN_VALIDO = 946_684_800_000;

const ENC_LEGADO_VALIDOS = new Set(['ativo', 'normal', 'beforeunload', 'timeout']);

/* ══════════════════════════════════════════════
   LEITURA SEGURA DE CAMPOS
══════════════════════════════════════════════ */

function _ts(v) {
  if (v && typeof v.toMillis === 'function') v = v.toMillis();   // Timestamp do Firestore, se existir
  return (typeof v === 'number' && Number.isFinite(v) && v >= MS_MIN_VALIDO) ? v : null;
}

function _numNaoNegativo(v) {
  return (typeof v === 'number' && Number.isFinite(v) && v >= 0) ? v : null;
}

/* IDs de sessão começam com o timestamp de início nos dois formatos:
   legado → "1758000000000"; atual → "1758000000000_ab12cd3". */
function _tsDoId(id) {
  return _ts(Number(String(id ?? '').split('_')[0]));
}

/* Conta caminhos DISTINTOS (sem query string nem hash). Só o número sai
   daqui — os caminhos em si nunca chegam à interface. */
function _contarPaginas(pages) {
  if (!pages || typeof pages !== 'object' || Array.isArray(pages)) return null;
  const caminhos = new Set();
  for (const chave of Object.keys(pages)) {
    caminhos.add(String(chave).split('?')[0].split('#')[0]);
  }
  return caminhos.size;
}

/* ══════════════════════════════════════════════
   NORMALIZAÇÃO
══════════════════════════════════════════════ */

/**
 * Converte um documento de sessão (qualquer formato) no modelo interno.
 * Retorna null se não for possível determinar o início.
 *
 * Modelo devolvido (tudo em ms):
 *   id, formato ('novo'|'legado'), inicio, ultimaAtividade,
 *   tempoAtivoMs (null se não medido), dispositivo ('mobile'|'desktop'|null),
 *   paginas (contagem|null), navegacoes (contagem|null),
 *   encLegado (string|null), zumbi (boolean)
 */
export function normalizarSessao(id, data) {
  const d = (data && typeof data === 'object') ? data : {};

  const inicioNovo = _ts(d.startedAt);
  const formato    = inicioNovo !== null ? 'novo' : 'legado';
  const inicio     = inicioNovo ?? _ts(d.entrada) ?? _tsDoId(id);
  if (inicio === null) return null;

  const fimBruto = formato === 'novo' ? _ts(d.endedAt) : _ts(d.saida);
  const ultimaAtividade = (fimBruto !== null && fimBruto >= inicio) ? fimBruto : inicio;

  /* Tempo ativo:
       formato atual → `duracao` em SEGUNDOS (activeSeconds do tracker) → ms.
       legado        → `duracao` era relógio corrido, não tempo ativo; não é
                       medida de atividade, então fica null. O intervalo do
                       legado aparece na "janela", calculada pelos timestamps. */
  let tempoAtivoMs = null;
  if (formato === 'novo') {
    const seg = _numNaoNegativo(d.duracao);
    if (seg !== null) tempoAtivoMs = Math.round(seg * 1000);
  }

  return Object.freeze({
    id:              String(id ?? ''),
    formato,
    inicio,
    ultimaAtividade,
    tempoAtivoMs,
    dispositivo:     (d.deviceType === 'mobile' || d.deviceType === 'desktop') ? d.deviceType : null,
    paginas:         formato === 'novo' ? _contarPaginas(d.pages) : null,
    navegacoes:      (formato === 'novo' && Array.isArray(d.navigation)) ? d.navigation.length : null,
    encLegado:       (formato === 'legado' && ENC_LEGADO_VALIDOS.has(d.encerramento)) ? d.encerramento : null,
    zumbi:           d._encerradaComoZumbi === true,
  });
}

/** Início da sessão (ms) ou null. Usado pela limpeza de sessões antigas. */
export function inicioDaSessao(id, data) {
  return normalizarSessao(id, data)?.inicio ?? null;
}

/* ══════════════════════════════════════════════
   STATUS E DERIVADOS
══════════════════════════════════════════════ */

/**
 * Status baseado no que o tracker realmente grava:
 *   Ativa     → última gravação dentro de 3 heartbeats.
 *   Ausente   → passou disso, mas ainda dentro da tolerância (5 min).
 *   Encerrada → passou da tolerância, marcada como zumbi, ou (legado) 'normal'/'timeout'.
 *
 * O formato atual não tem campo de status: nada aqui depende de campo antigo.
 * Relógio do aluno adiantado (última atividade "no futuro") conta como idade 0.
 */
export function calcularStatus(s, agora) {
  if (s.zumbi) return STATUS.ENCERRADA;
  if (s.encLegado === 'normal' || s.encLegado === 'timeout') return STATUS.ENCERRADA;

  const idade = Math.max(0, agora - s.ultimaAtividade);
  const heartbeat = s.formato === 'novo' ? CONFIG.HEARTBEAT_NOVO_MS : CONFIG.HEARTBEAT_LEGADO_MS;

  /* Legado 'beforeunload' = a aba foi descarregada (pode ser só um F5).
     Se voltasse, o heartbeat regravaria 'ativo'; então nunca é "Ativa". */
  const podeSerAtiva = s.encLegado !== 'beforeunload';

  if (podeSerAtiva && idade <= CONFIG.FATOR_ATIVA * heartbeat) return STATUS.ATIVA;
  if (idade <= CONFIG.TOLERANCIA_MS) return STATUS.AUSENTE;
  return STATUS.ENCERRADA;
}

/**
 * Acrescenta ao modelo os campos que dependem de "agora":
 *   status, janelaMs, tempoAtivoExibidoMs, encerramentoEm.
 *
 * Janela:
 *   Ativa            → início → agora
 *   Ausente/Encerrada → início → última atividade registrada
 * Tempo ativo nunca excede a janela (proteção contra o contador local do
 * tracker, que é compartilhado entre abas via localStorage).
 */
export function derivarSessao(s, agora) {
  const status = calcularStatus(s, agora);
  const fim = status === STATUS.ATIVA ? Math.max(agora, s.ultimaAtividade) : s.ultimaAtividade;
  const janelaMs = Math.max(0, fim - s.inicio);

  let tempoAtivoExibidoMs = s.tempoAtivoMs;
  if (tempoAtivoExibidoMs !== null && tempoAtivoExibidoMs > janelaMs) tempoAtivoExibidoMs = janelaMs;

  return {
    ...s,
    status,
    janelaMs,
    tempoAtivoExibidoMs,
    encerramentoEm: status === STATUS.ENCERRADA ? s.ultimaAtividade : null,
  };
}

/** Sessão que representa o usuário na tabela: ativa mais recente → ausente mais recente → mais recente. */
export function escolherSessaoDoUsuario(derivadas) {
  if (!derivadas.length) return null;
  const ordenadas = [...derivadas].sort((a, b) => b.inicio - a.inicio);
  return ordenadas.find(s => s.status === STATUS.ATIVA)
      ?? ordenadas.find(s => s.status === STATUS.AUSENTE)
      ?? ordenadas[0];
}

/* ══════════════════════════════════════════════
   INDICADORES E ORDENAÇÃO
══════════════════════════════════════════════ */

/** Indicadores agregados. `itens` = sessões derivadas (com `uid` opcional). */
export function resumir(itens) {
  const r = {
    total: itens.length,
    ativas: 0, ausentes: 0, encerradas: 0,
    usuariosAtivos: 0,
    tempoAtivoMedioMs: null, amostraTempo: 0,
    mobile: 0, desktop: 0, semDispositivo: 0,
  };
  const uidsAtivos = new Set();
  let somaTempo = 0;

  for (const s of itens) {
    if (s.status === STATUS.ATIVA)          { r.ativas++;     if (s.uid != null) uidsAtivos.add(s.uid); }
    else if (s.status === STATUS.AUSENTE)   { r.ausentes++; }
    else                                    { r.encerradas++; }

    if (s.dispositivo === 'mobile')       r.mobile++;
    else if (s.dispositivo === 'desktop') r.desktop++;
    else                                  r.semDispositivo++;

    /* Média só sobre sessões com tempo ativo efetivamente medido (> 0). */
    if (s.tempoAtivoExibidoMs !== null && s.tempoAtivoExibidoMs > 0) {
      somaTempo += s.tempoAtivoExibidoMs;
      r.amostraTempo++;
    }
  }

  r.usuariosAtivos = uidsAtivos.size;
  if (r.amostraTempo > 0) r.tempoAtivoMedioMs = Math.round(somaTempo / r.amostraTempo);
  return r;
}

const _PRIORIDADE = { ativa: 0, ausente: 1, encerrada: 2 };

/** linhas: [{ usuario:{nome}, principal }]  criterio: 'recentes' | 'tempo' | 'nome' */
export function ordenarLinhas(linhas, criterio) {
  const copia = [...linhas];
  const porRecencia = (a, b) => b.principal.ultimaAtividade - a.principal.ultimaAtividade;

  if (criterio === 'nome') {
    return copia.sort((a, b) => String(a.usuario.nome).localeCompare(String(b.usuario.nome), 'pt-BR'));
  }
  if (criterio === 'tempo') {
    return copia.sort((a, b) =>
      (b.principal.tempoAtivoExibidoMs ?? -1) - (a.principal.tempoAtivoExibidoMs ?? -1) || porRecencia(a, b));
  }
  return copia.sort((a, b) =>
    _PRIORIDADE[a.principal.status] - _PRIORIDADE[b.principal.status] || porRecencia(a, b));
}

/* ══════════════════════════════════════════════
   FORMATAÇÃO
══════════════════════════════════════════════ */

/** ms → "1h42min" | "45min" | "30s" | "—". */
export function formatarDuracao(ms) {
  if (typeof ms !== 'number' || !Number.isFinite(ms) || ms < 0) return '—';
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h${String(m).padStart(2, '0')}min`;
  if (m > 0) return `${m}min`;
  return `${s}s`;
}

/** Tempo decorrido desde a última atividade: "agora" | "há 3min". */
export function formatarRelativo(ms) {
  if (typeof ms !== 'number' || !Number.isFinite(ms)) return '—';
  const idade = Math.max(0, ms);
  return idade < 45_000 ? 'agora' : `há ${formatarDuracao(idade)}`;
}

function _opts(timeZone) { return timeZone ? { timeZone } : {}; }

function _diaChave(ms, timeZone) {
  return new Date(ms).toLocaleDateString('pt-BR', {
    ..._opts(timeZone), day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

export function formatarHora(ms, timeZone) {
  if (!Number.isFinite(ms)) return '—';
  return new Date(ms).toLocaleTimeString('pt-BR', {
    ..._opts(timeZone), hour: '2-digit', minute: '2-digit',
  });
}

export function mesmoDia(a, b, timeZone) {
  return _diaChave(a, timeZone) === _diaChave(b, timeZone);
}

/** "hoje 19:30" | "ontem 19:30" | "22/09 19:30" | "22/09/25 19:30" (ano só se diferente). */
export function formatarDataHora(ms, agora, timeZone) {
  if (!Number.isFinite(ms)) return '—';
  const hora = formatarHora(ms, timeZone);
  if (mesmoDia(ms, agora, timeZone))            return `hoje ${hora}`;
  if (mesmoDia(ms, agora - MS_DIA, timeZone))   return `ontem ${hora}`;

  const anoDiferente = new Date(ms).toLocaleDateString('pt-BR', { ..._opts(timeZone), year: 'numeric' })
                    !== new Date(agora).toLocaleDateString('pt-BR', { ..._opts(timeZone), year: 'numeric' });
  const data = new Date(ms).toLocaleDateString('pt-BR', {
    ..._opts(timeZone), day: '2-digit', month: '2-digit', ...(anoDiferente ? { year: '2-digit' } : {}),
  });
  return `${data} ${hora}`;
}

/** Fim de um intervalo: só a hora se for no mesmo dia do início, senão data + hora. */
export function formatarFim(inicio, fim, agora, timeZone) {
  return mesmoDia(inicio, fim, timeZone) ? formatarHora(fim, timeZone) : formatarDataHora(fim, agora, timeZone);
}

/** Escapa texto para inserção segura em HTML (conteúdo e atributos). */
export function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}