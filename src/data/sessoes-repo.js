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

   Sem DOM, sem eventos, sem import de core/global.
   ============================================= */

import {
  getDb, doc, collection, getDocs, query, orderBy, limit,
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