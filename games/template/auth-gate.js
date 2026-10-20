/* ═══════════════════════════════════════════════════════════════
   NEXUS STUDY — games/template/auth-gate.js   (NOVO)

   Porta de autenticação dos jogos.

   POR QUE EXISTE
   ──────────────
   O site usa Firebase Authentication e as regras do Firestore só
   deixam o dono da conta (claim `nx`, sem `troca`) ler/gravar
   usuarios/{uid}/**. O `usuario` guardado no localStorage é apenas
   CACHE de interface: quem manda é a sessão do Firebase
   (src/global.js → `sessaoVerificada`).

   Antes, os jogos liam getUsuario() na hora e chamavam o Firestore
   sem esperar o Auth restaurar a sessão. Resultado: leitura/gravação
   recusada, erro engolido e progresso só no localStorage, sem aviso.

   O QUE FAZ
   ─────────
     resolverUid()            → Promise<string>
         uid da sessão VERIFICADA ou 'visitante'. É o único jeito de
         os jogos descobrirem "quem é o usuário" (nunca a URL).

     sessaoAutenticada(uid)   → Promise<boolean>
         true só se há sessão Firebase válida E o uid pedido é o do
         usuário logado agora. Usado antes de QUALQUER acesso ao
         Firestore. Visitante / sessão inválida / uid diferente → false
         (o jogo continua funcionando só com localStorage).

   NÃO faz: login, claims, regras, nem toca no Firestore.
   Não cria sessão nem promove ninguém: só LÊ o estado que
   src/global.js e src/data/firebase-app.js já mantêm.
═══════════════════════════════════════════════════════════════ */

import { getUsuario, sessaoVerificada } from '../../src/global.js';
import { getAuthInstance } from '../../src/data/firebase-app.js';

export const VISITANTE = 'visitante';

/* Resultado da verificação da sessão: 'ok' | 'sem-sessao' | 'nao-verificado'.
   Uma única espera (a promise de global.js já é compartilhada). */
let _status = null;
async function _esperarStatus() {
  if (_status !== null) return _status;
  try {
    _status = await sessaoVerificada;
  } catch (err) {
    console.warn('[auth-gate] Falha ao verificar a sessão:', err?.message);
    _status = 'nao-verificado';
  }
  return _status;
}

/**
 * uid a usar nos jogos.
 *  · sessão confirmada pelo Firebase        → uid do usuário
 *  · sem rede / Firebase não respondeu      → uid do cache (para o jogo
 *    funcionar offline com o progresso local; o Firestore continua
 *    bloqueado por sessaoAutenticada())
 *  · sem sessão / cache descartado          → 'visitante'
 */
export async function resolverUid() {
  const status = await _esperarStatus();
  if (status === 'sem-sessao') return VISITANTE;
  const uid = getUsuario()?.uid;
  return (typeof uid === 'string' && uid) ? uid : VISITANTE;
}

/**
 * Pode acessar o Firestore como este uid agora?
 * Confere a sessão VIVA do Firebase a cada chamada (se o usuário
 * saiu no meio do jogo, passa a devolver false).
 */
export async function sessaoAutenticada(uid) {
  if (!uid || uid === VISITANTE) return false;
  const status = await _esperarStatus();
  if (status === 'sem-sessao') return false;
  try {
    return getAuthInstance().currentUser?.uid === uid;
  } catch (_) {
    return false;
  }
}
