// Arquivo: src/data/sessoes-repo.js
/* =============================================
   NEXUS STUDY — src/data/sessoes-repo.js
   Acesso ao Firestore relativo a SESSÕES e USO:
     usuarios/{uid}/sessoes/{sid}
     usuarios/{uid}/historico_diario/{YYYY-MM | YYYY-MM-DD(legado)}
     usuarios/{uid}/perfil_uso/global
     usuarios/{uid} (contadores totalSessoes/tempoTotalGeral/ultimaAtividade)

   O rastreador oficial continua sendo src/session-tracker.js (estado,
   timers, lock multi-aba, heartbeat). Este repositório só fornece as
   REFERÊNCIAS (caminhos) usadas por ele e a leitura da última sessão.
   A lógica de gravação (setDoc/batch com increment) permanece no
   tracker nesta fase, para não alterar o comportamento nem a ordem das
   escritas.

   Fase 4: também contém as rotinas de inventário/cópia/validação das
   sessões no formato antigo (ver bloco no fim do arquivo).

   Sem DOM, sem eventos, sem import de core/global.
   ============================================= */

import {
  getDb, doc, getDoc, collection, getDocs, query, orderBy, limit, writeBatch,
} from './firebase-app.js';
import * as C from './colecoes.js';

export const refSessao          = (uid, sid)   => doc(getDb(), ...C.sessao(uid, sid));
export const refUsuarioContador = (uid)        => doc(getDb(), ...C.usuario(uid));
/* Diário ANTIGO (por dia): só leitura de fallback — não recebe gravação. */
export const refDiarioDia       = (uid, dia)   => doc(getDb(), ...C.historicoDiario(uid, dia));
/* Diário NOVO (por mês): fonte primária de gravação e leitura. */
export const refDiarioMes       = (uid, mes)   => doc(getDb(), ...C.historicoDiario(uid, mes));
export const refPerfilUso       = (uid)        => doc(getDb(), ...C.perfilUsoGlobal(uid));

/* Última sessão persistida (maior startedAt). Devolve { id, ...dados } ou
   null. NÃO captura erros: o chamador decide log/fallback (como antes). */
export async function buscarUltimaSessao(uid) {
  if (!uid) return null;
  const snap = await getDocs(query(
    collection(getDb(), ...C.sessoes(uid)),
    orderBy('startedAt', 'desc'),
    limit(1),
  ));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

/* ═══════════════════════════════════════════════════════════════
   FASE 4 — SESSÕES NO FORMATO ANTIGO (entrada/saida)

   Documentos de usuarios/{uid}/sessoes SEM `startedAt` numérico foram
   criados pelo antigo session-manager.js (removido na Fase 2). Aqui:
     · inventariarLegadoUsuario()  → só leitura
     · copiarSessoesLegado()       → COPIA para usuarios/{uid}/sessoes_legado
                                     (mesmo ID, dados idênticos, sem campos
                                     extras) e valida por releitura
     · validarSessoesLegado()      → só leitura (confere a cópia)
   NENHUMA função daqui apaga, move ou altera os originais em `sessoes`.
   Estas rotinas NÃO rodam sozinhas: são chamadas por quem as autorizar
   (rotina temporária do Admin).
   ═══════════════════════════════════════════════════════════════ */

const _INATIVIDADE_MIN_MS = 10 * 60 * 1000;   // só copia o que parou de ser gravado há > 10 min
const _LOTE_MAX = 400;

function _canon(v) {
  if (v === undefined) return 'u';
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(_canon).join(',') + ']';
  if (typeof v.toMillis === 'function') return 'T' + v.toMillis();
  return '{' + Object.keys(v).filter(k => v[k] !== undefined).sort()
    .map(k => JSON.stringify(k) + ':' + _canon(v[k])).join(',') + '}';
}
const _iguais = (a, b) => _canon(a) === _canon(b);

/* Mesmo critério do inventário e do painel: sem `startedAt` numérico = antigo. */
export const ehSessaoLegada = (dados) => typeof dados?.startedAt !== 'number';

function _ultimaGravacaoMs(id, d) {
  const n = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
  const doId = Number(String(id).split('_')[0]);
  return Math.max(n(d?.saida), n(d?.entrada), Number.isFinite(doId) ? doId : 0);
}

/* Cada leitura é independente: se o Firestore negar uma (regras), o
   relatório diz QUAL caminho e continua com as demais. Só leitura. */
async function _lerIsolado(rel, caminho, fn) {
  try { return await fn(); }
  catch (err) {
    rel.erros.push({ caminho, codigo: String(err?.code ?? err?.name ?? 'erro'), mensagem: String(err?.message ?? err) });
    return null;
  }
}

export async function inventariarLegadoUsuario(uid) {
  const rel = { uid, sessoes: { total: 0, novas: 0, legado: 0 }, sessoesLegadoColecao: 0,
                historicoDiario: { mensais: 0, diariosLegados: 0, legacyCheck: null }, erros: [] };
  const db = getDb();
  const [sSes, sLeg, sHist, sUser] = await Promise.all([
    _lerIsolado(rel, `usuarios/${uid}/sessoes`,          () => getDocs(collection(db, ...C.sessoes(uid)))),
    _lerIsolado(rel, `usuarios/${uid}/sessoes_legado`,   () => getDocs(collection(db, ...C.sessoesLegado(uid)))),
    _lerIsolado(rel, `usuarios/${uid}/historico_diario`, () => getDocs(collection(db, ...C.historicoDiarioColecao(uid)))),
    _lerIsolado(rel, `usuarios/${uid}`,                  () => getDoc(doc(db, ...C.usuario(uid)))),
  ]);
  for (const d of (sSes?.docs ?? [])) {
    rel.sessoes.total++;
    if (ehSessaoLegada(d.data())) rel.sessoes.legado++; else rel.sessoes.novas++;
  }
  rel.sessoesLegadoColecao = sLeg?.size ?? 0;
  for (const d of (sHist?.docs ?? [])) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(d.id)) rel.historicoDiario.diariosLegados++;
    else if (/^\d{4}-\d{2}$/.test(d.id))  rel.historicoDiario.mensais++;
  }
  const lc = sUser?.exists() ? sUser.data()?.legacyCheck : null;
  if (lc) rel.historicoDiario.legacyCheck = {
    verificado: !!lc.verificado, possuiDadosLegados: !!lc.possuiDadosLegados,
    datas: Array.isArray(lc.datasComDados) ? lc.datasComDados.length : 0,
  };
  return rel;
}

/* Lê as sessões antigas elegíveis (inativas há > 10 min) e o destino. */
async function _lerLegadoEDestino(uid, agora) {
  const db = getDb();
  const [sSes, sDest] = await Promise.all([
    getDocs(collection(db, ...C.sessoes(uid))),
    getDocs(collection(db, ...C.sessoesLegado(uid))),
  ]);
  const destino = new Map(sDest.docs.map(d => [d.id, d.data()]));
  const elegiveis = []; let recentes = 0, totalLegadas = 0;
  for (const d of sSes.docs) {
    const dados = d.data();
    if (!ehSessaoLegada(dados)) continue;
    totalLegadas++;
    if (agora - _ultimaGravacaoMs(d.id, dados) < _INATIVIDADE_MIN_MS) { recentes++; continue; }
    elegiveis.push({ id: d.id, dados });
  }
  return { elegiveis, destino, recentes, totalLegadas };
}

export async function copiarSessoesLegado(uid, { dryRun = false, agora = Date.now() } = {}) {
  const rel = { uid, dryRun, ok: false, erro: null, legadas: 0, ignoradasRecentes: 0,
                aCopiar: 0, jaExistiamIguais: 0, conflitos: [], copiadas: 0, divergencias: [] };
  if (!uid) { rel.erro = 'uid_vazio'; return rel; }
  try {
    const { elegiveis, destino, recentes, totalLegadas } = await _lerLegadoEDestino(uid, agora);
    rel.legadas = totalLegadas; rel.ignoradasRecentes = recentes;

    const escritas = [];
    for (const { id, dados } of elegiveis) {
      const dst = destino.get(id);
      if (dst === undefined) escritas.push({ id, dados });
      else if (_iguais(dados, dst)) rel.jaExistiamIguais++;
      else rel.conflitos.push(id);      // nunca sobrescreve: só relata
    }
    rel.aCopiar = escritas.length;
    if (dryRun) { rel.ok = rel.conflitos.length === 0; return rel; }

    const db = getDb();
    for (let i = 0; i < escritas.length; i += _LOTE_MAX) {
      const batch = writeBatch(db);
      for (const e of escritas.slice(i, i + _LOTE_MAX)) batch.set(doc(db, ...C.sessaoLegado(uid, e.id)), e.dados);
      await batch.commit();
    }
    rel.copiadas = escritas.length;

    for (const e of escritas) {
      const snap = await getDoc(doc(db, ...C.sessaoLegado(uid, e.id)));
      if (!snap.exists() || !_iguais(snap.data(), e.dados)) rel.divergencias.push(e.id);
    }
    rel.ok = rel.divergencias.length === 0 && rel.conflitos.length === 0;
    return rel;
  } catch (err) {
    console.warn('[sessoes-repo] copiarSessoesLegado erro:', err);
    rel.erro = String(err?.message ?? err);
    return rel;
  }
}

/* Só leitura: toda sessão antiga elegível tem cópia idêntica? */
export async function validarSessoesLegado(uid, { agora = Date.now() } = {}) {
  const rel = { uid, ok: false, erro: null, legadas: 0, elegiveis: 0, ignoradasRecentes: 0,
                faltando: [], diferentes: [], extrasNoDestino: 0 };
  try {
    const { elegiveis, destino, recentes, totalLegadas } = await _lerLegadoEDestino(uid, agora);
    rel.legadas = totalLegadas; rel.elegiveis = elegiveis.length; rel.ignoradasRecentes = recentes;
    const ids = new Set(elegiveis.map(e => e.id));
    for (const { id, dados } of elegiveis) {
      const dst = destino.get(id);
      if (dst === undefined) rel.faltando.push(id);
      else if (!_iguais(dados, dst)) rel.diferentes.push(id);
    }
    for (const id of destino.keys()) if (!ids.has(id)) rel.extrasNoDestino++;
    rel.ok = rel.faltando.length === 0 && rel.diferentes.length === 0;
    return rel;
  } catch (err) {
    rel.erro = String(err?.message ?? err);
    return rel;
  }
}