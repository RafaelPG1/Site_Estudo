// Arquivo: src/core/auth.js
/* =============================================
   NEXUS STUDY — src/core/auth.js
   Orquestração de entrada e saída (Fase 5).

   login()/logout() — antes na fachada src/firebase.js — copiados SEM
   alteração de comportamento:
     · login: valida credenciais via data/usuarios-repo e, se ok,
       publica o usuário no estado (global.js → setUsuario, que grava
       no Storage e dispara nexus:loginSuccess).
     · logout: setUsuario(null) (limpa Storage, reseta configs e
       dispara nexus:logout).

   As credenciais (hash/verificação de PIN) continuam SOMENTE em
   data/usuarios-repo.js; aqui só há orquestração.
   src/firebase.js reexporta login/logout (API pública inalterada).
   ============================================= */

import { setUsuario } from '../global.js';
import { autenticarUsuario } from '../data/usuarios-repo.js';

/* ── LOGIN ── */
export async function login(nome, pin) {
  const res = await autenticarUsuario(nome, pin);
  if (res.ok) setUsuario(res.usuario);
  return res;
}

/* ── LOGOUT ── */
export function logout() {
  setUsuario(null);
}
