// Arquivo: src/data/admin-api.js
/* =============================================
   NEXUS STUDY — src/data/admin-api.js
   Cliente das rotas de ADMINISTRAÇÃO/AUTH do Cloudflare Worker
   (/admin/* e /auth/*). É separado do cliente da IA
   (shared/js/ia/core/worker.js), que NÃO foi alterado.

   Envia o ID token do Firebase (Authorization: Bearer). Nenhum segredo
   existe neste arquivo: quem autoriza é o Worker, verificando o token.

   chamarWorker(rota, corpo, { forcar }) → { ok, status, json, erro }
     · forcar: pede um token novo ao Firebase (usado na troca de senha).
     · 401 com token em cache → tenta uma vez com token renovado.
   ============================================= */

import { getAuthInstance } from './firebase-app.js';

export const WORKER_BASE_URL = 'https://site-estudo.rafaelpeixoto475.workers.dev';
const TIMEOUT_MS = 20000;

async function _enviar(rota, corpo, token) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(WORKER_BASE_URL + rota, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(corpo ?? {}),
      signal: ctrl.signal,
    });
    let json = null;
    try { json = await resp.json(); } catch (_) { /* corpo não-JSON */ }
    return { ok: resp.ok, status: resp.status, json, erro: resp.ok ? null : (json && json.erro) || 'Erro ao falar com o servidor.' };
  } catch (_) {
    return { ok: false, status: 0, json: null, erro: 'Sem conexão com o servidor. Tente novamente.' };
  } finally {
    clearTimeout(t);
  }
}

export async function chamarWorker(rota, corpo = {}, { forcar = false } = {}) {
  const user = getAuthInstance().currentUser;
  if (!user) return { ok: false, status: 401, json: null, erro: 'Sessão expirada. Entre novamente.' };

  let token;
  try { token = await user.getIdToken(forcar); }
  catch (_) { return { ok: false, status: 0, json: null, erro: 'Não foi possível validar a sessão. Tente novamente.' }; }

  let res = await _enviar(rota, corpo, token);
  if (res.status === 401 && !forcar) {
    try { token = await user.getIdToken(true); res = await _enviar(rota, corpo, token); } catch (_) { /* mantém o 401 */ }
  }
  return res;
}
