// Arquivo: src/data/usuarios-repo.js
/* =============================================
   NEXUS STUDY — src/data/usuarios-repo.js
   Repositório de USUÁRIOS: credenciais, perfil, configs, administração
   de contas e Área Pessoal (usuarios/{uid}/pessoal/*).

   Regras desta camada:
     · SEM DOM, SEM eventos de UI, SEM import de core/global.
     · uid é SEMPRE parâmetro (nunca lido de estado global).
     · Credenciais (hash do PIN) só são lidas/escritas AQUI.
     · Contratos de retorno idênticos aos que src/firebase.js tinha.

   Preparação para segurança (NÃO implementada): quando existir
   Auth/regras, a verificação de PIN sai de autenticarUsuario()
   para um backend/custom token sem alterar quem a chama.
   ============================================= */

import {
  getDb, doc, getDoc, setDoc, deleteDoc, collection, getDocs,
} from './firebase-app.js';
import * as C from './colecoes.js';

/* ── HASH SHA-256 ── */
export async function hashPin(pin) {
  const encoded = new TextEncoder().encode(String(pin));
  const buffer  = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/* ── AUTENTICAÇÃO (somente dados; NÃO atualiza estado global) ──
   Devolve { ok:true, usuario } ou { ok:false, erro }.
   Quem decide guardar a sessão do usuário (setUsuario) é o chamador. */
export async function autenticarUsuario(nome, pin) {
  if (!nome || !pin) return { ok: false, erro: 'Preencha nome e PIN.' };

  const id = nome.trim().toLowerCase();

  try {
    const snap = await getDoc(doc(getDb(), ...C.usuario(id)));

    if (!snap.exists()) return { ok: false, erro: 'Usuário não encontrado.' };

    const dados   = snap.data();
    const hashDig = await hashPin(pin);

    if (hashDig !== dados.pin) return { ok: false, erro: 'PIN incorreto.' };

    const usuario = {
      uid:    id,
      nome:   dados.nome ?? nome,
      avatar: dados.avatar ?? '🎓',
      foto:   dados.foto   ?? null,
      admin:  dados.admin  ?? false,
    };
    return { ok: true, usuario };

  } catch (err) {
    console.error('[usuarios-repo] Erro no login:', err);
    return { ok: false, erro: 'Erro de conexão. Tente novamente.' };
  }
}

/* ── CONFIGS DO USUÁRIO ── */
export async function salvarConfigs(uid, configs) {
  try {
    await setDoc(doc(getDb(), ...C.usuario(uid)), { configs }, { merge: true });
    console.log('[firebase] salvarConfigs: salvo com sucesso para', uid, '→', configs);
    return { ok: true };
  } catch (err) {
    console.error('[firebase.js] Erro ao salvar configs:', err);
    return { ok: false };
  }
}

export async function carregarConfigs(uid) {
  try {
    const snap = await getDoc(doc(getDb(), ...C.usuario(uid)));
    if (!snap.exists()) {
      console.warn('[firebase] carregarConfigs: documento não encontrado para', uid);
      return null;
    }
    const configs = snap.data().configs ?? null;
    console.log('[firebase] carregarConfigs: campo configs →', configs);
    return configs;
  } catch (err) {
    console.error('[firebase.js] Erro ao carregar configs:', err);
    return null;
  }
}

/* ── ADMIN: LISTAR / CRIAR / ATUALIZAR / REMOVER ── */
export async function getUsuarios() {
  try {
    const snap = await getDocs(collection(getDb(), ...C.usuarios()));
    return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
  } catch (err) {
    console.error('[firebase] getUsuarios erro:', err);
    return [];
  }
}

export async function criarUsuario(uid, nome, pinHash, avatar) {
  try {
    const ref  = doc(getDb(), ...C.usuario(uid));
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return { ok: false, erro: `Usuário "${uid}" já existe.` };
    }

    await setDoc(ref, {
      nome:   nome,
      pin:    pinHash,
      avatar: avatar ?? '🎓',
      admin:  false,
    });

    console.log('[firebase] criarUsuario ok →', uid);
    return { ok: true };
  } catch (err) {
    console.error('[firebase] criarUsuario erro:', err);
    return { ok: false, erro: err.message };
  }
}

/* Atualiza nome/avatar (merge). LANÇA erro em caso de falha — mesmo
   comportamento do setDoc direto que o painel admin fazia antes. */
export async function atualizarPerfilUsuario(uid, { nome, avatar }) {
  await setDoc(doc(getDb(), ...C.usuario(uid)), { nome, avatar }, { merge: true });
}

/* Grava SÓ o avatar (merge). Chamada pelo modal de perfil da Home
   (index.js, via import dinâmico de src/firebase.js). Retorna { ok }. */
export async function salvarAvatar(uid, avatar) {
  if (!uid || typeof avatar !== 'string' || !avatar) return { ok: false };
  try {
    await setDoc(doc(getDb(), ...C.usuario(uid)), { avatar }, { merge: true });
    return { ok: true };
  } catch (err) {
    console.error('[usuarios-repo] salvarAvatar erro:', err);
    return { ok: false };
  }
}

/* Apaga SÓ o documento principal (não toca nas subcoleções). */
export async function removerUsuario(uid) {
  try {
    await deleteDoc(doc(getDb(), ...C.usuario(uid)));
    console.log('[firebase] removerUsuario ok →', uid);
    return { ok: true };
  } catch (err) {
    console.error('[firebase] removerUsuario erro:', err);
    return { ok: false };
  }
}

export async function resetarPin(uid, novoPin) {
  try {
    const novoHash = await hashPin(novoPin);
    await setDoc(doc(getDb(), ...C.usuario(uid)), { pin: novoHash }, { merge: true });
    console.log('[firebase] resetarPin ok →', uid);
    return { ok: true };
  } catch (err) {
    console.error('[firebase] resetarPin erro:', err);
    return { ok: false };
  }
}

/* Remoção COMPLETA (subcoleções da lista oficial + doc principal).
   Movida de admin/admin.js sem mudança de lógica nem de ordem.
   `log` é opcional: o chamador (UI) pode receber as mensagens de
   progresso sem que o repositório conheça console/DOM do painel. */
export async function removerUsuarioCompleto(uid, log = console.log) {
  try {
    const db = getDb();

    for (const subCol of C.SUBCOLECOES_REMOCAO_ADMIN) {
      const snap = await getDocs(collection(db, ...C.usuario(uid), subCol));
      if (!snap.empty) {
        await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
        log(`[admin] Subcoleção "${subCol}" apagada (${snap.size} docs) — ${uid}`);
      }
    }

    await deleteDoc(doc(db, ...C.usuario(uid)));
    log('[admin] _removerUsuarioCompleto ok →', uid);
    return { ok: true };
  } catch (err) {
    console.error('[admin] _removerUsuarioCompleto erro:', err);
    return { ok: false, erro: err.message };
  }
}

/* ═══════════════ ÁREA PESSOAL — usuarios/{uid}/pessoal/{semestre}_{discId} ═══════════════ */

const _pessoalRef = (uid, semestre, discId) => doc(getDb(), ...C.pessoalDoc(uid, semestre, discId));

export async function salvarChecklistPessoal(uid, semestre, discId, checkedSet) {
  try {
    await setDoc(_pessoalRef(uid, semestre, discId), {
      checklist:   [...checkedSet],
      clUpdatedAt: Date.now(),
    }, { merge: true });
    return { ok: true };
  } catch (err) {
    console.error('[firebase] salvarChecklistPessoal:', err);
    return { ok: false };
  }
}

export async function carregarChecklistPessoal(uid, semestre, discId) {
  try {
    const snap = await getDoc(_pessoalRef(uid, semestre, discId));
    if (!snap.exists()) return null;
    const raw = snap.data().checklist;
    return Array.isArray(raw) ? raw : null;
  } catch (err) {
    console.error('[firebase] carregarChecklistPessoal:', err);
    return null;
  }
}

export async function salvarCategoriasPessoal(uid, semestre, discId, cats) {
  try {
    const clean = JSON.parse(JSON.stringify(cats));
    await setDoc(_pessoalRef(uid, semestre, discId), {
      categorias:    clean,
      catsUpdatedAt: Date.now(),
    }, { merge: true });
    return { ok: true };
  } catch (err) {
    console.error('[firebase] salvarCategoriasPessoal:', err);
    return { ok: false };
  }
}

export async function carregarCategoriasPessoal(uid, semestre, discId) {
  try {
    const snap = await getDoc(_pessoalRef(uid, semestre, discId));
    if (!snap.exists()) return null;
    const raw = snap.data().categorias;
    return Array.isArray(raw) ? raw : null;
  } catch (err) {
    console.error('[firebase] carregarCategoriasPessoal:', err);
    return null;
  }
}

export async function salvarNotaPessoal(uid, semestre, discId, nota) {
  try {
    await setDoc(_pessoalRef(uid, semestre, discId), {
      nota,
      notaUpdatedAt: Date.now(),
    }, { merge: true });
    return { ok: true };
  } catch (err) {
    console.error('[firebase] salvarNotaPessoal:', err);
    return { ok: false };
  }
}

export async function carregarNotaPessoal(uid, semestre, discId) {
  try {
    const snap = await getDoc(_pessoalRef(uid, semestre, discId));
    if (!snap.exists()) return null;
    const raw = snap.data().nota;
    return typeof raw === 'string' ? raw : null;
  } catch (err) {
    console.error('[firebase] carregarNotaPessoal:', err);
    return null;
  }
}

export async function carregarTudoPessoal(uid, semestre, discId) {
  try {
    const snap = await getDoc(_pessoalRef(uid, semestre, discId));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      checklist:  Array.isArray(d.checklist)  ? d.checklist  : null,
      categorias: Array.isArray(d.categorias) ? d.categorias : null,
      nota:       typeof d.nota === 'string'   ? d.nota       : null,
    };
  } catch (err) {
    console.error('[firebase] carregarTudoPessoal:', err);
    return null;
  }
}