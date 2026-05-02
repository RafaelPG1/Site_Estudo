/* ═══════════════════════════════════════════════════════════════
   NEXUS STUDY — show_milhao/storage_sm.js
   Persistência: localStorage (partida em curso) + Firebase (histórico)

   Segue o mesmo padrão do storage_vf.js que já funciona:
     • Histórico → Firestore com setDoc + merge:true (igual ao VF)
     • Carregamento → Firestore como fonte de verdade, localStorage como fallback
     • Estado da partida → apenas localStorage, chave inclui uid para isolar usuários

   Estrutura Firestore:
     /usuarios/{uid}/sm_historico/{discId}__{sem}
       { [questionId]: { tentativas, acertos, erros, ultimaVez, acertosConsecutivos } }

   Chaves localStorage:
     sm_estado__{uid}__{discId}__{sem}   ← estado da partida em curso
═══════════════════════════════════════════════════════════════ */

import { doc, getDoc, setDoc, deleteDoc, arrayUnion, updateDoc }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getDb } from '../../../src/firebase.js';

const VERSAO_SAVE = 4; // Incrementado — zera saves antigos automaticamente

/* ── Helpers de chave ─────────────────────────────────────── */
const _chaveLocal  = (uid, discId, sem) => `sm_historico__${uid}__${discId}__${sem}`;
const _chaveEstado = (uid, discId, sem) => `sm_estado__${uid}__${discId}__${sem}`;

const _docRef = (uid, discId, sem) =>
  doc(getDb(), 'usuarios', uid, 'sm_historico', `${discId}__${sem}`);

const _docRefPont = (uid, discId, sem) =>
  doc(getDb(), 'usuarios', uid, 'sm_pontuacoes', `${discId}__${sem}`);

/* ════════════════════════════════════════════════════════════
   DEBUG
════════════════════════════════════════════════════════════ */
export function smLog(...args)   { console.log('[SM-Storage]',    ...args); }
export function smWarn(...args)  { console.warn('[SM-Storage ⚠]', ...args); }
export function smError(...args) { console.error('[SM-Storage ✖]',...args); }

/* ════════════════════════════════════════════════════════════
   HELPERS — localStorage (interno)
════════════════════════════════════════════════════════════ */

function _ler(chave) {
  try {
    const raw = localStorage.getItem(chave);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    smWarn(`Erro ao ler "${chave}":`, err.message);
    return null;
  }
}

function _escrever(chave, dados) {
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
    return true;
  } catch (err) {
    smError(`Erro ao escrever "${chave}":`, err.message);
    return false;
  }
}

/* ════════════════════════════════════════════════════════════
   HISTÓRICO — carregar
   Mesmo padrão do carregarHistoricoVF:
   1. Tenta Firestore (fonte de verdade)
   2. Fallback: localStorage
   3. Visitante: só localStorage
════════════════════════════════════════════════════════════ */

export async function carregarHistoricoSM(usuario, discId, sem) {
  if (!usuario || usuario === 'visitante') {
    return _lerLocal(usuario, discId, sem);
  }

  try {
    const snap = await getDoc(_docRef(usuario, discId, sem));
    if (snap.exists()) {
      const dados = snap.data();
      // Atualiza cache local (igual ao storage_vf.js)
      localStorage.setItem(
        _chaveLocal(usuario, discId, sem),
        JSON.stringify(dados),
      );
      smLog(`Histórico carregado do Firestore: ${usuario}/${discId}__${sem}`);
      return dados;
    }
    // Firestore retornou vazio (doc não existe ou foi apagado pelo admin)
    // → zera o cache local para ficar em sincronia e retorna vazio
    localStorage.removeItem(_chaveLocal(usuario, discId, sem));
    smLog(`Firestore vazio → cache local zerado: ${usuario}/${discId}__${sem}`);
    return {};
  } catch (err) {
    // Só usa localStorage como fallback em caso de falha de rede
    smWarn('Firestore indisponível, usando localStorage:', err.message);
    return _lerLocal(usuario, discId, sem);
  }
}

/* ════════════════════════════════════════════════════════════
   HISTÓRICO — salvar resultado de uma rodada
   Mesmo padrão do salvarResultadoVF:
   1. Atualiza localStorage imediatamente
   2. Sincroniza Firestore com setDoc + merge:true
   Questões com resp === null (timeout) são ignoradas.
════════════════════════════════════════════════════════════ */

export async function salvarResultadoSM(usuario, discId, sem, resultados) {
  // Filtra timeouts (resp === null) — neutros, não vão ao histórico
  const validos = (resultados ?? []).filter(
    r => r.resp !== null && r.resp !== undefined,
  );

  if (validos.length === 0) {
    smLog('salvarResultadoSM: apenas timeouts ou lista vazia — histórico não alterado.');
    return false;
  }

  // 1. Atualiza localStorage (rápido, nunca falha)
  const atual = _lerLocal(usuario, discId, sem);

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

  try {
    localStorage.setItem(
      _chaveLocal(usuario, discId, sem),
      JSON.stringify(atual),
    );
    smLog(`localStorage atualizado: ${validos.length} resultado(s).`);
  } catch (err) {
    smError('Erro ao salvar localStorage:', err);
  }

  // 2. Sincroniza Firestore com merge:true (igual ao storage_vf.js)
  if (!usuario || usuario === 'visitante') return true;

  try {
    // Monta patch só com as questões desta rodada (merge não sobrescreve as outras)
    const patch = {};
    for (const { id } of validos) {
      if (id) patch[id] = atual[id];
    }
    await setDoc(_docRef(usuario, discId, sem), patch, { merge: true });
    smLog(`✅ Histórico salvo no Firestore! uid="${usuario}" | ${discId}__${sem} | ${validos.length} resultado(s).`);
    return true;
  } catch (err) {
    smError('Falha ao salvar no Firestore!');
    smError('  uid:', usuario, '| discId:', discId, '| sem:', sem);
    smError('  Código:', err.code ?? '(sem código)', '| Mensagem:', err.message);
    return false;
  }
}

/* ════════════════════════════════════════════════════════════
   HISTÓRICO — limpar disciplina
   Mesmo padrão do limparHistoricoVF
════════════════════════════════════════════════════════════ */

export async function limparHistoricoSM(usuario, discId, sem) {
  if (!usuario || usuario === 'visitante') {
    localStorage.removeItem(_chaveLocal(usuario, discId, sem));
    return;
  }

  try {
    await deleteDoc(_docRef(usuario, discId, sem));
    smLog(`Histórico apagado no Firestore: ${usuario}/${discId}__${sem}`);
  } catch (err) {
    smWarn('Erro ao apagar no Firestore:', err.message);
    return;
  }

  localStorage.removeItem(_chaveLocal(usuario, discId, sem));
}

/* ════════════════════════════════════════════════════════════
   ESTADO DA PARTIDA EM CURSO — apenas localStorage
   Chave inclui uid para isolar saves entre usuários
   no mesmo browser.
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

  const ok = _escrever(_chaveEstado(uid, discId, sem), payload);
  if (ok) smLog(`Estado salvo ✓ [Q${estado.indice + 1} | acertos:${estado.acertos} | erros:${estado.temErro}]`);
  return ok;
}

export function carregarEstadoPartida(uid, discId, sem) {
  const chave = _chaveEstado(uid ?? '_local', discId, sem);
  const dados = _ler(chave);

  if (!dados) {
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

  if (!dados.perguntas || !Array.isArray(dados.perguntas) || dados.perguntas.length === 0) {
    smWarn('Save inválido (perguntas ausentes) — descartando.');
    localStorage.removeItem(chave);
    return null;
  }

  const idadeMin = Math.round((Date.now() - dados.salvoEm) / 60000);
  smLog(`Partida salva encontrada ✓ (uid="${uid}" | salva há ${idadeMin} min | Q${dados.indice + 1}/${dados.perguntas.length})`);

  dados.respostas = dados.respostas.map(r => r === '__vazio__' ? undefined : r);
  return dados;
}

export function limparEstadoPartida(uid, discId, sem) {
  const chave = _chaveEstado(uid ?? '_local', discId, sem);
  localStorage.removeItem(chave);
  smLog(`Estado de partida apagado: ${chave}`);
}

/* ════════════════════════════════════════════════════════════
   HELPERS INTERNOS — localStorage
════════════════════════════════════════════════════════════ */

function _lerLocal(usuario, discId, sem) {
  try {
    const salvo = localStorage.getItem(_chaveLocal(usuario, discId, sem));
    return salvo ? JSON.parse(salvo) : {};
  } catch {
    return {};
  }
}

/* ════════════════════════════════════════════════════════════
   PONTUAÇÃO — salvar resultado de uma partida
   Estrutura Firestore:
     /usuarios/{uid}/sm_pontuacoes/{discId}__{sem}
       {
         melhor:    { valor, acertos, precisao, tempo, data },
         historico: [ ...últimas 20 partidas ]
       }
   Chave localStorage:
     sm_pontuacoes__{uid}__{discId}__{sem}
════════════════════════════════════════════════════════════ */

const _chavePont = (uid, discId, sem) => `sm_pontuacoes__${uid}__${discId}__${sem}`;

export async function salvarPontuacaoSM(usuario, discId, sem, entrada) {
  /*
    entrada: {
      valor:    string  — ex.: 'R$ 100.000'
      valorNum: number  — valor numérico para comparação, ex.: 100000
      acertos:  number,
      precisao: number  — 0-100,
      tempo:    string  — ex.: '2:34',
      data:     number  — Date.now()
    }
  */
  if (!entrada || entrada.valorNum === undefined) {
    smWarn('salvarPontuacaoSM: entrada inválida.', entrada);
    return false;
  }

  const uid = usuario ?? '_local';
  const chave = _chavePont(uid, discId, sem);

  // 1. Lê estado atual do localStorage (cache local)
  let local = null;
  try {
    const raw = localStorage.getItem(chave);
    local = raw ? JSON.parse(raw) : null;
  } catch (_) {}
  if (!local) local = { melhor: null, historico: [] };

  // Atualiza melhor pontuação
  if (!local.melhor || entrada.valorNum > (local.melhor.valorNum ?? 0)) {
    local.melhor = { ...entrada };
  }

  // Adiciona ao histórico (mantém últimas 20 partidas)
  local.historico = [entrada, ...(local.historico ?? [])].slice(0, 20);

  try {
    localStorage.setItem(chave, JSON.stringify(local));
    smLog(`Pontuação salva no localStorage: ${entrada.valor} | acertos ${entrada.acertos} | ${entrada.precisao}%`);
  } catch (err) {
    smError('Erro ao salvar pontuação no localStorage:', err);
  }

  // 2. Sincroniza com Firestore (somente usuários logados)
  if (!usuario || usuario === 'visitante') return true;

  try {
    const ref  = _docRefPont(usuario, discId, sem);
    const snap = await getDoc(ref);
    const remoto = snap.exists() ? snap.data() : { melhor: null, historico: [] };

    const novaMelhor = !remoto.melhor || entrada.valorNum > (remoto.melhor.valorNum ?? 0)
      ? { ...entrada }
      : remoto.melhor;

    await setDoc(ref, {
      melhor:    novaMelhor,
      historico: arrayUnion(entrada),   // Firestore não garante ordem, mas evita reescrever tudo
    }, { merge: true });

    smLog(`✅ Pontuação salva no Firestore! uid="${usuario}" | ${discId}__${sem} | ${entrada.valor}`);
    return true;
  } catch (err) {
    smError('Falha ao salvar pontuação no Firestore!');
    smError('  uid:', usuario, '| discId:', discId, '| sem:', sem);
    smError('  Código:', err.code ?? '(sem código)', '| Mensagem:', err.message);
    return false;
  }
}

/* ════════════════════════════════════════════════════════════
   PONTUAÇÃO — carregar melhor pontuação e histórico
   Fonte de verdade: Firestore → fallback localStorage
════════════════════════════════════════════════════════════ */

export async function carregarPontuacoesSM(usuario, discId, sem) {
  const uid = usuario ?? '_local';
  const chave = _chavePont(uid, discId, sem);

  // Visitante — apenas localStorage
  if (!usuario || usuario === 'visitante') {
    try {
      const raw = localStorage.getItem(chave);
      return raw ? JSON.parse(raw) : { melhor: null, historico: [] };
    } catch (_) {
      return { melhor: null, historico: [] };
    }
  }

  try {
    const snap = await getDoc(_docRefPont(usuario, discId, sem));
    if (snap.exists()) {
      const dados = snap.data();
      // Atualiza cache local
      try { localStorage.setItem(chave, JSON.stringify(dados)); } catch (_) {}
      smLog(`Pontuações carregadas do Firestore: ${usuario}/${discId}__${sem}`);
      return dados;
    }
    return { melhor: null, historico: [] };
  } catch (err) {
    smWarn('Firestore indisponível ao carregar pontuações, usando localStorage:', err.message);
    try {
      const raw = localStorage.getItem(chave);
      return raw ? JSON.parse(raw) : { melhor: null, historico: [] };
    } catch (_) {
      return { melhor: null, historico: [] };
    }
  }
}

/* Utilitário rápido — retorna só a melhor pontuação (síncrono, apenas localStorage) */
export function melhorPontuacaoLocalSM(usuario, discId, sem) {
  try {
    const raw = localStorage.getItem(_chavePont(usuario ?? '_local', discId, sem));
    if (!raw) return null;
    return JSON.parse(raw)?.melhor ?? null;
  } catch (_) {
    return null;
  }
}

/* ════════════════════════════════════════════════════════════
   DEBUG / UTILITÁRIOS
════════════════════════════════════════════════════════════ */

export function debugEstado(uid, discId, sem) {
  console.groupCollapsed('[SM-Debug] Estado completo');
  const estado = discId && sem ? _ler(_chaveEstado(uid ?? '_local', discId, sem)) : null;
  console.log('▶ Estado da partida (localStorage):', estado ?? '(nenhum)');
  const hist = discId && sem ? _lerLocal(uid, discId, sem) : null;
  console.log('▶ Histórico cache local:', hist);
  console.groupEnd();
}

export function listarChavesSM() {
  const chaves = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith('sm_')) chaves.push(k);
  }
  const hist  = chaves.filter(k => k.startsWith('sm_historico'));
  const pont  = chaves.filter(k => k.startsWith('sm_pontuacoes'));
  const estado = chaves.filter(k => k.startsWith('sm_estado'));
  smLog(`Chaves SM: ${chaves.length} total | ${hist.length} histórico | ${pont.length} pontuações | ${estado.length} estado`);
  if (chaves.length > 0) smLog('Lista:', chaves);
  return chaves;
}

if (typeof window !== 'undefined') {
  window.smDebug  = debugEstado;
  window.smChaves = listarChavesSM;
}