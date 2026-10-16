// Arquivo: src/core/auth.js
/* =============================================
   NEXUS STUDY — src/core/auth.js
   Entrada e saída com FIREBASE AUTHENTICATION (Etapa 4).

   · Login por USUÁRIO + SENHA. O Firebase exige um e-mail, então o
     usuário vira um "alias" interno `<id>@nexus-study.invalid` (nunca
     aparece na tela e não recebe e-mail). aliasEmail() PRECISA ser
     idêntico à função do Worker (há teste de igualdade).
   · uid do Firebase = ID do documento usuarios/{id} (definido pelo Worker
     ao criar a conta), então subcoleções e dados continuam no mesmo lugar.
   · `admin` e "conta autorizada" vêm de CLAIMS do token, gravadas só pelo
     servidor (Worker). Nada de admin vindo do localStorage ou do Firestore.
   · Troca obrigatória no 1º acesso: enquanto a claim `troca` existir, a
     sessão NÃO é publicada (setUsuario não é chamado). A troca usa
     updatePassword (a senha nova NÃO passa pelo Worker) e depois o Worker
     CONFERE no Firebase que a senha mudou antes de liberar.
   ============================================= */

import { setUsuario } from '../global.js';
import { carregarPerfilUsuario } from '../data/usuarios-repo.js';
import {
  getAuthInstance, aguardarAuth, signInWithEmailAndPassword, signOut, updatePassword,
} from '../data/firebase-app.js';
import { chamarWorker } from '../data/admin-api.js';

export const SENHA_MIN = 6;
export const SENHA_MAX = 30;
const ALIAS_DOMINIO = 'nexus-study.invalid';
/* Contas migradas do sistema de PIN foram criadas com senha = PIN antigo + "000".
   Quem digita só o PIN antigo entra mesmo assim, mas SOMENTE se a conta ainda estiver
   com a troca de senha obrigatória pendente (veja login()). */
const SUFIXO_MIGRACAO = '000';
const PIN_ANTIGO_MAX = 9;   // o PIN do "admin" tinha até 9 caracteres; os demais, 3

/* ── ALIAS DE E-MAIL (igual ao do Worker) ── */
export async function aliasEmail(id) {
  const s = String(id).normalize('NFC');
  const simples = /^[a-z0-9._-]{1,40}$/.test(s) && !/^[.-]|[.-]$|\.\./.test(s);
  if (simples) return s + '@' + ALIAS_DOMINIO;
  const dig = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
  let hex = '';
  for (const b of dig) hex += b.toString(16).padStart(2, '0');
  return 'x-' + hex.slice(0, 40) + '@' + ALIAS_DOMINIO;
}

/* ── Validação da senha nova (6–30). Devolve texto de erro ou null. ── */
export function validarSenhaNova(nova, anterior = null) {
  if (typeof nova !== 'string' || nova.length < SENHA_MIN || nova.length > SENHA_MAX) {
    return `A senha deve ter de ${SENHA_MIN} a ${SENHA_MAX} caracteres.`;
  }
  if (anterior && nova === anterior) return 'A nova senha precisa ser diferente da senha provisória.';
  return null;
}

const _credencialInvalida = (err) => ['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password'].includes(err && err.code);

function _erroLogin(err) {
  switch (err && err.code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-email':
      return 'Usuário ou senha incorretos.';
    case 'auth/user-disabled':          return 'Esta conta está desativada.';
    case 'auth/too-many-requests':      return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
    case 'auth/network-request-failed': return 'Erro de conexão. Tente novamente.';
    default:                            return 'Não foi possível entrar. Tente novamente.';
  }
}

/* Troca pendente nesta aba (só em memória). senhaAnterior: a senha provisória digitada. */
let _pendente = null;

async function _concluirSessao(user, tk, id) {
  const p = await carregarPerfilUsuario(id);
  if (!p.ok) { await signOut(getAuthInstance()).catch(() => {}); return { ok: false, erro: p.erro }; }
  const usuario = {
    uid:    id,
    nome:   p.perfil.nome,
    avatar: p.perfil.avatar,
    foto:   p.perfil.foto,
    admin:  tk.claims.admin === true,
  };
  setUsuario(usuario);
  return { ok: true, usuario };
}

/* ── LOGIN ──
   Devolve { ok:true, usuario } | { ok:true, trocaSenha:true } | { ok:false, erro } */
export async function login(nome, senha) {
  if (!nome || !senha) return { ok: false, erro: 'Preencha usuário e senha.' };
  const id = String(nome).trim().toLowerCase();
  const auth = getAuthInstance();

  const email = await aliasEmail(id);
  const tentar = (s) => signInWithEmailAndPassword(auth, email, s);
  let cred, senhaUsada = senha, viaPinAntigo = false;
  try {
    if (senha.length < SENHA_MIN) {
      // Curta demais para ser uma senha pessoal (mínimo 6): só pode ser o PIN antigo → completa com "000".
      senhaUsada = senha + SUFIXO_MIGRACAO; viaPinAntigo = true;
      cred = await tentar(senhaUsada);
    } else {
      try { cred = await tentar(senha); }
      catch (err) {
        if (!_credencialInvalida(err) || senha.length > PIN_ANTIGO_MAX || senha.endsWith(SUFIXO_MIGRACAO)) throw err;
        senhaUsada = senha + SUFIXO_MIGRACAO; viaPinAntigo = true;   // PIN antigo de 6 a 9 caracteres (ex.: o do admin)
        cred = await tentar(senhaUsada);
      }
    }
  } catch (err) {
    return { ok: false, erro: _erroLogin(err) };
  }
  const user = cred.user;

  try {
    // O uid precisa ser exatamente o ID do perfil (garantido pelo Worker); senão, recusa.
    if (user.uid !== id) { await signOut(auth); return { ok: false, erro: 'Conta inválida. Procure o administrador.' }; }

    let tk = await user.getIdTokenResult();
    if (tk.claims.nx !== true) { await signOut(auth); return { ok: false, erro: 'Esta conta não está autorizada.' }; }

    // O atalho "PIN antigo + 000" só vale para conta que ainda precisa trocar a senha; quem já tem
    // senha pessoal (que por acaso termine em 000) não entra digitando só o começo dela.
    if (viaPinAntigo && tk.claims.troca !== true) { await signOut(auth); return { ok: false, erro: 'Usuário ou senha incorretos.' }; }

    if (tk.claims.troca === true) {
      // Recuperação: se a senha já foi trocada mas a liberação não terminou, o Worker libera agora.
      const lib = await chamarWorker('/auth/senha-definida', {}, { forcar: true });
      if (lib.ok) tk = await user.getIdTokenResult(true);
      if (tk.claims.troca === true) {
        _pendente = { uid: id, senhaAnterior: senhaUsada, senhaJaTrocada: false };
        return { ok: true, trocaSenha: true };
      }
    }
    return await _concluirSessao(user, tk, id);
  } catch (err) {
    console.error('[auth] erro no login:', err);
    return { ok: false, erro: 'Erro de conexão. Tente novamente.' };
  }
}

/* ── TROCA OBRIGATÓRIA DE SENHA ── */
export function trocaSenhaPendente() { return _pendente !== null; }

/* Ao abrir o site: há sessão do Firebase com troca pendente (ex.: o aluno fechou a aba no meio)? */
export async function detectarTrocaPendente() {
  const user = await aguardarAuth();
  if (!user) return false;
  try {
    const tk = await user.getIdTokenResult();
    if (tk.claims.nx === true && tk.claims.troca === true) {
      _pendente = { uid: user.uid, senhaAnterior: null, senhaJaTrocada: false };
      return true;
    }
  } catch (_) { /* offline: não dá para saber */ }
  return false;
}

export async function trocarSenhaInicial(nova) {
  if (!_pendente) return { ok: false, erro: 'A troca expirou. Entre novamente.' };
  const auth = getAuthInstance();
  const user = auth.currentUser;
  if (!user || user.uid !== _pendente.uid) { _pendente = null; return { ok: false, erro: 'Sessão expirada. Entre novamente.' }; }

  if (!_pendente.senhaJaTrocada) {
    const erroVal = validarSenhaNova(nova, _pendente.senhaAnterior);
    if (erroVal) return { ok: false, erro: erroVal };
    try {
      await updatePassword(user, nova);
    } catch (err) {
      switch (err && err.code) {
        case 'auth/requires-recent-login':
          _pendente = null; await signOut(auth).catch(() => {});
          return { ok: false, erro: 'Por segurança, entre novamente com a senha provisória.', encerrar: true };
        case 'auth/weak-password':
          return { ok: false, erro: `A senha deve ter de ${SENHA_MIN} a ${SENHA_MAX} caracteres.` };
        case 'auth/password-does-not-meet-requirements':
          return { ok: false, erro: 'Esta senha não atende à política de senha configurada no projeto (Firebase → Authentication → Configurações → Política de senha).' };
        case 'auth/network-request-failed':
          return { ok: false, erro: 'Erro de conexão. Tente novamente.' };
        default:
          return { ok: false, erro: 'Não foi possível trocar a senha. Tente novamente.' };
      }
    }
    _pendente.senhaJaTrocada = true;
    _pendente.senhaAnterior = nova;
  }

  // Token novo (emitido depois da troca) + confirmação do servidor.
  const r = await chamarWorker('/auth/senha-definida', {}, { forcar: true });
  if (!r.ok) return { ok: false, erro: 'Senha trocada, mas não deu para concluir agora. Clique em Salvar de novo.' };

  try {
    const tk = await user.getIdTokenResult(true);
    if (tk.claims.troca === true) return { ok: false, erro: 'Não foi possível concluir a troca. Entre novamente.' };
    const id = _pendente.uid;
    _pendente = null;
    return await _concluirSessao(user, tk, id);
  } catch (_) {
    return { ok: false, erro: 'Erro de conexão. Tente novamente.' };
  }
}

/* ── LOGOUT ──
   Limpa o estado do app NA HORA e encerra a sessão do Firebase.
   Devolve a promise do signOut (quem for navegar para outra página deve aguardá-la). */
export function logout() {
  _pendente = null;
  setUsuario(null);
  return signOut(getAuthInstance()).catch(() => {});
}
