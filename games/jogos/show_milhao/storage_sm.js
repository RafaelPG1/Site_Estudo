/* ═══════════════════════════════════════════════════════════════
   NEXUS STUDY — games/jogos/show_milhao/storage_sm.js  (v5.1)

   Persistência: localStorage (partida em curso) + Firestore (histórico)

   REFATORAÇÃO v5.0
   ────────────────
   Usa criarStorage() de ../../template/storage-base.js para a
   plombing de Firestore+localStorage do histórico.
   A lógica de domínio específica do Show do Milhão — estado da
   partida em curso e pontuações — permanece aqui.

   Estrutura Firestore:
     /usuarios/{uid}/sm_historico/{discId}__{sem}
       { [questionId]: { tentativas, acertos, erros, ultimaVez, acertosConsecutivos } }
     /usuarios/{uid}/sm_pontuacoes/{discId}__{sem}
       { melhor, acumulado, totalPartidas, historico[] }

   Chaves localStorage:
     sm_historico__{uid}__{discId}__{sem}   ← cache do histórico
     sm_estado__{uid}__{discId}__{sem}      ← estado da partida em curso
     sm_pontuacoes__{uid}__{discId}__{sem}  ← cache das pontuações
═══════════════════════════════════════════════════════════════ */

/* v5.1 — integração com Auth/regras: getDb/doc/getDoc/setDoc vêm de
   src/data/firebase-app.js (fonte única do SDK). `arrayUnion` não é
   reexportado ali, então continua importado da MESMA URL do SDK
   (10.12.0 — o navegador resolve para o mesmo módulo, sem SDK duplicado).
   Todo acesso ao Firestore passa por sessaoAutenticada() (auth-gate). */
import { getDb, doc, getDoc, setDoc } from '../../../src/data/firebase-app.js';
import { arrayUnion }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { criarStorage, lerLocal, escreverLocal } from '../../template/storage-base.js';
import { sessaoAutenticada } from '../../template/auth-gate.js';

const VERSAO_SAVE = 4; // Zera saves antigos automaticamente

/* ── Storage base para histórico ── */
const _baseHist = criarStorage({
  colecaoFirestore: 'sm_historico',
  prefixoLocal:     'sm_historico',
  nomeSistema:      'storage_sm',
  separador:        '__',
});

/* ── Helpers de chave locais ── */
const _chaveEstado = (uid, discId, sem) => `sm_estado__${uid}__${discId}__${sem}`;
const _chavePont   = (uid, discId, sem) => `sm_pontuacoes__${uid}__${discId}__${sem}`;
/* Pontuações ainda não enviadas ao Firestore (lista de entradas) */
const _chavePontPend = (uid, discId, sem) => `${_chavePont(uid, discId, sem)}__pend`;

const _docRefPont = (uid, discId, sem) =>
  doc(getDb(), 'usuarios', uid, 'sm_pontuacoes', `${discId}__${sem}`);

/* ── Logs identificados ── */
export const smLog   = (...a) => console.log('[SM-Storage]',    ...a);
export const smWarn  = (...a) => console.warn('[SM-Storage ⚠]', ...a);
export const smError = (...a) => console.error('[SM-Storage ✖]',...a);

/* ════════════════════════════════════════════════════════════
   HISTÓRICO — carregar / salvar / limpar
════════════════════════════════════════════════════════════ */

export async function carregarHistoricoSM(usuario, discId, sem) {
  return _baseHist.carregar(usuario, discId, sem);
}

export async function salvarResultadoSM(usuario, discId, sem, resultados) {
  const validos = (resultados ?? []).filter(
    r => r.resp !== null && r.resp !== undefined,
  );

  if (validos.length === 0) {
    smLog('salvarResultadoSM: apenas timeouts ou lista vazia — histórico não alterado.');
    return false;
  }

  /* Atualiza cache local de forma incremental */
  const chave = `sm_historico__${usuario ?? '_local'}__${discId}__${sem}`;
  const atual = lerLocal(chave);

  for (const { id, acertou } of validos) {
    if (!id) { smWarn('Questão sem id ignorada.'); continue; }
    const entrada = atual[id] ?? {
      tentativas: 0, acertos: 0, erros: 0,
      ultimaVez: 0, acertosConsecutivos: 0,
    };
    entrada.tentativas++;
    if (acertou) {
      entrada.acertos++;
      entrada.acertosConsecutivos = (entrada.acertosConsecutivos ?? 0) + 1;
    } else {
      entrada.erros++;
      entrada.acertosConsecutivos = 0;
    }
    entrada.ultimaVez = Date.now();
    atual[id] = entrada;
  }

  escreverLocal(chave, atual);
  smLog(`localStorage atualizado: ${validos.length} resultado(s).`);

  /* Monta patch e delega Firestore ao base */
  const patch = {};
  for (const { id } of validos) { if (id) patch[id] = atual[id]; }

  try {
    const enviado = await _baseHist.salvarMerge(usuario, discId, sem, patch);
    if (enviado) smLog(`✅ Histórico salvo no Firestore! uid="${usuario}" | ${discId}__${sem}`);
    else         smWarn(`Histórico salvo só localmente (visitante, sem sessão ou sem rede) | ${discId}__${sem}`);
    return enviado;
  } catch (err) {
    smError('Falha ao salvar no Firestore!', err.message);
    return false;
  }
}

export async function limparHistoricoSM(usuario, discId, sem) {
  await _baseHist.limpar(usuario, discId, sem);
  smLog(`Histórico apagado: ${usuario}/${discId}__${sem}`);
}

/* ════════════════════════════════════════════════════════════
   ESTADO DA PARTIDA — somente localStorage
════════════════════════════════════════════════════════════ */

export function salvarEstadoPartida(estado) {
  const { discId, sem, usuario } = estado;

  if (!discId || !sem) {
    smWarn('salvarEstadoPartida: discId ou sem ausente — abortando.', { discId, sem });
    return false;
  }

  const uid = usuario ?? '_local';

  const payload = {
    versao:         VERSAO_SAVE,
    uid,
    indice:         estado.indice,
    acertos:        estado.acertos,
    respostas:      Array.from({ length: estado.respostas.length }, (_, i) =>
                      estado.respostas[i] === undefined ? '__vazio__' : estado.respostas[i]
                    ),
    tempos:         estado.tempos,
    temErro:        estado.temErro,
    indicePendente: estado.indicePendente,
    premioPendente: estado.premioPendente,
    tempoInicio:    estado.tempoInicio,
    perguntas:      estado.perguntas,
    discId,
    sem,
    salvoEm:        Date.now(),
  };

  const ok = escreverLocal(_chaveEstado(uid, discId, sem), payload);
  if (ok) smLog(`Estado salvo ✓ [Q${estado.indice + 1} | acertos:${estado.acertos}]`);
  return ok;
}

export function carregarEstadoPartida(uid, discId, sem) {
  const chave = _chaveEstado(uid ?? '_local', discId, sem);
  const dados  = lerLocal(chave);

  if (!dados || Object.keys(dados).length === 0) {
    smLog(`Sem partida salva para uid="${uid}" ${discId}/${sem}.`);
    return null;
  }

  if (dados.versao !== VERSAO_SAVE) {
    smWarn(`Save desatualizado (v${dados.versao} ≠ v${VERSAO_SAVE}) — descartando.`);
    localStorage.removeItem(chave);
    return null;
  }

  if (dados.uid && dados.uid !== (uid ?? '_local')) {
    smWarn(`Save pertence ao uid "${dados.uid}", mas logado é "${uid}" — descartando.`);
    localStorage.removeItem(chave);
    return null;
  }

  if (!dados.perguntas?.length) {
    smWarn('Save inválido (perguntas ausentes) — descartando.');
    localStorage.removeItem(chave);
    return null;
  }

  const idadeMin = Math.round((Date.now() - dados.salvoEm) / 60000);

  const LIMITE_MIN = 20;
  if (idadeMin > LIMITE_MIN) {
    smWarn(`Save expirado (salvo há ${idadeMin} min > ${LIMITE_MIN} min) — descartando.`);
    localStorage.removeItem(chave);
    return null;
  }

  smLog(`Partida salva encontrada ✓ (uid="${uid}" | salva há ${idadeMin} min | Q${dados.indice + 1}/${dados.perguntas.length})`);

  dados.respostas = dados.respostas.map(r => r === '__vazio__' ? undefined : r);
  return dados;
}

export function limparEstadoPartida(uid, discId, sem) {
  localStorage.removeItem(_chaveEstado(uid ?? '_local', discId, sem));
  smLog(`Estado de partida apagado.`);
}

/* ════════════════════════════════════════════════════════════
   PONTUAÇÃO
════════════════════════════════════════════════════════════ */

export async function salvarPontuacaoSM(usuario, discId, sem, entrada) {
  if (!entrada || entrada.valorNum === undefined) {
    smWarn('salvarPontuacaoSM: entrada inválida.', entrada);
    return false;
  }

  const uid    = usuario ?? '_local';
  const chave  = _chavePont(uid, discId, sem);
  const local  = lerLocal(chave) || { melhor: null, historico: [], acumulado: 0, totalPartidas: 0 };

  if (!local.melhor || entrada.valorNum > (local.melhor.valorNum ?? 0)) {
    local.melhor = { ...entrada };
  }
  local.acumulado     = (local.acumulado    ?? 0) + (entrada.valorNum ?? 0);
  local.totalPartidas = (local.totalPartidas ?? 0) + 1;
  local.historico     = [entrada, ...(local.historico ?? [])].slice(0, 20);

  escreverLocal(chave, local);
  smLog(`Pontuação salva localmente: ${entrada.valor} | acertos ${entrada.acertos}`);

  if (!usuario || usuario === 'visitante') return true;

  /* Fila de pendentes: a entrada só sai da fila depois de gravada no Firestore. */
  const chavePend = _chavePontPend(usuario, discId, sem);
  const pend = lerLocal(chavePend);
  const fila = Array.isArray(pend.fila) ? pend.fila : [];
  fila.push(JSON.parse(JSON.stringify(entrada)));
  escreverLocal(chavePend, { fila });

  if (!(await sessaoAutenticada(usuario))) {
    smWarn('Sem sessão válida — pontuação salva só localmente (será enviada depois).');
    return false;
  }
  return _enviarPontuacoesPendentes(usuario, discId, sem);
}

/* Envia (em ordem) as pontuações pendentes. true = fila vazia ao final. */
async function _enviarPontuacoesPendentes(usuario, discId, sem) {
  const chavePend = _chavePontPend(usuario, discId, sem);
  let fila = lerLocal(chavePend).fila;
  if (!Array.isArray(fila) || fila.length === 0) return true;

  try {
    const ref = _docRefPont(usuario, discId, sem);
    while (fila.length > 0) {
      const entrada = fila[0];
      const snap   = await getDoc(ref);
      const remoto = snap.exists() ? snap.data() : { melhor: null, historico: [] };

      const novaMelhor = !remoto.melhor || entrada.valorNum > (remoto.melhor.valorNum ?? 0)
        ? { ...entrada }
        : remoto.melhor;

      await setDoc(ref, {
        melhor:        novaMelhor,
        acumulado:     (remoto.acumulado    ?? 0) + (entrada.valorNum ?? 0),
        totalPartidas: (remoto.totalPartidas ?? 0) + 1,
        historico:     arrayUnion(entrada),
      }, { merge: true });

      fila = fila.slice(1);
      if (fila.length > 0) escreverLocal(chavePend, { fila });
      else localStorage.removeItem(chavePend);
      smLog(`✅ Pontuação salva no Firestore! uid="${usuario}" | ${discId}__${sem} | ${entrada.valor}`);
    }
    return true;
  } catch (err) {
    smError('Falha ao salvar pontuação no Firestore (fica pendente)!', err.message);
    return false;
  }
}

export async function carregarPontuacoesSM(usuario, discId, sem) {
  const uid   = usuario ?? '_local';
  const chave = _chavePont(uid, discId, sem);

  if (!usuario || usuario === 'visitante' || !(await sessaoAutenticada(usuario))) {
    return lerLocal(chave) || { melhor: null, historico: [] };
  }

  try {
    /* Pontuações feitas offline/sem sessão sobem antes de ler o remoto;
       se ainda não der, mantém o local (que já as contém). */
    const enviou = await _enviarPontuacoesPendentes(usuario, discId, sem);
    if (!enviou) return lerLocal(chave) || { melhor: null, historico: [] };

    const snap = await getDoc(_docRefPont(usuario, discId, sem));
    if (snap.exists()) {
      const dados = snap.data();
      escreverLocal(chave, dados);
      smLog(`Pontuações carregadas do Firestore: ${usuario}/${discId}__${sem}`);
      return dados;
    }
    return { melhor: null, historico: [] };
  } catch (err) {
    smWarn('Firestore indisponível ao carregar pontuações, usando localStorage:', err.message);
    return lerLocal(chave) || { melhor: null, historico: [] };
  }
}

export function melhorPontuacaoLocalSM(usuario, discId, sem) {
  return lerLocal(_chavePont(usuario ?? '_local', discId, sem))?.melhor ?? null;
}

export function acumuladoLocalSM(usuario, discId, sem) {
  const dados = lerLocal(_chavePont(usuario ?? '_local', discId, sem));
  if (!dados || Object.keys(dados).length === 0) return null;
  return { acumulado: dados.acumulado ?? 0, totalPartidas: dados.totalPartidas ?? 0 };
}

/* ════════════════════════════════════════════════════════════
   DEBUG / UTILITÁRIOS
════════════════════════════════════════════════════════════ */

export function debugEstado(uid, discId, sem) {
  console.groupCollapsed('[SM-Debug] Estado completo');
  const chaveE = _chaveEstado(uid ?? '_local', discId, sem);
  console.log('▶ Estado da partida:', lerLocal(chaveE));
  const chaveH = `sm_historico__${uid ?? '_local'}__${discId}__${sem}`;
  console.log('▶ Histórico cache local:', lerLocal(chaveH));
  console.groupEnd();
}

export function listarChavesSM() {
  const chaves = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith('sm_')) chaves.push(k);
  }
  smLog(`Chaves SM: ${chaves.length} total`);
  if (chaves.length > 0) smLog('Lista:', chaves);
  return chaves;
}