/* ═══════════════════════════════════════════════════════════════
   NEXUS STUDY — games/template/storage-base.js

   Base de persistência compartilhada por todos os jogos.
   Encapsula o padrão: Firestore (fonte de verdade) + localStorage (fallback/cache).

   COMO USAR num jogo específico:
   ──────────────────────────────
     import { criarStorage } from '../../template/storage-base.js';

     const Storage = criarStorage({
       colecaoFirestore: 'vf_historico',    // subcoleção em /usuarios/{uid}/
       prefixoLocal:     'nexus_vf',        // prefixo da chave localStorage
       nomeSistema:      'storage_vf',      // label nos logs
     });

     const historico = await Storage.carregar(usuario, discId, sem);
     await Storage.salvarMerge(usuario, discId, sem, patch);
     await Storage.limpar(usuario, discId, sem);

   FUNÇÕES EXPORTADAS
   ──────────────────
     criarStorage(config)  →  { carregar, salvarMerge, limpar }
     lerLocal(chave)       →  objeto | {} (helper genérico)
     escreverLocal(chave, dados)  →  boolean

   NOTAS
   ─────
   • O padrão de "carregar-do-Firestore-e-zerar-local-se-vazio" está
     centralizado aqui para evitar que cada storage_*.js repita os
     mesmos if/try/catch. O VF já documentava esse comportamento
     explicitamente — agora ele é a implementação canônica.
   • storage.js (SRS do flashcard) e storage_vf.js / storage_sm.js
     permanecem como wrappers específicos que chamam esta base,
     adicionando apenas a lógica de domínio (ex: acumular tentativas).

   v2.0 — INTEGRAÇÃO COM AUTH + REGRAS DO FIRESTORE
   ────────────────────────────────────────────────
   • O Firestore só é tocado quando há sessão Firebase VÁLIDA e o uid
     pedido é o do usuário logado (template/auth-gate.js). Visitante,
     sessão inválida ou uid diferente → só localStorage (sem erro).
   • SDK e getDb agora vêm de src/data/firebase-app.js (fonte única
     da URL do SDK e do init), em vez de import dinâmico do CDN.
   • "Pendente de sincronização": se a gravação no Firestore não pôde
     ser feita (sem rede/sessão), o patch fica guardado em
     <chave>__pend e é enviado na próxima carga/gravação autenticada.
     Antes, a próxima carga sobrescrevia o cache local com o remoto e
     o progresso feito offline sumia.
   • salvarMerge() agora devolve true/false (true = chegou ao Firestore).
═══════════════════════════════════════════════════════════════ */

import { getDb, doc, getDoc, setDoc, deleteDoc } from '../../src/data/firebase-app.js';
import { sessaoAutenticada } from './auth-gate.js';



/* ══════════════════════════════════════════════════════════
   HELPERS GENÉRICOS DE localStorage
   ══════════════════════════════════════════════════════════ */

/**
 * Lê e desserializa uma chave do localStorage.
 * Retorna {} em caso de chave inexistente ou JSON inválido.
 */
export function lerLocal(chave) {
  try {
    const raw = localStorage.getItem(chave);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn(`[storage-base] Erro ao ler "${chave}":`, err.message);
    return {};
  }
}

/**
 * Serializa e salva um valor no localStorage.
 * Retorna true em caso de sucesso, false se der erro (ex: quota cheia).
 */
export function escreverLocal(chave, dados) {
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
    return true;
  } catch (err) {
    console.error(`[storage-base] Erro ao escrever "${chave}":`, err.message);
    return false;
  }
}

/* ══════════════════════════════════════════════════════════
   FÁBRICA DE STORAGE
   ══════════════════════════════════════════════════════════ */

/* Garante um objeto simples e serializável (Firestore rejeita `undefined`). */
const _limpo = (obj) => JSON.parse(JSON.stringify(obj ?? {}));

const _ehVisitante = (usuario) => !usuario || usuario === 'visitante';

/**
 * Cria um objeto de storage para uma coleção específica no Firestore.
 *
 * @param {object} config
 * @param {string} config.colecaoFirestore  — subcoleção do Firestore (ex: 'vf_historico')
 * @param {string} config.prefixoLocal      — prefixo da chave localStorage (ex: 'nexus_vf')
 * @param {string} [config.nomeSistema]     — label nos logs (ex: 'storage_vf')
 * @param {string} [config.separador]       — separador usado no ID do doc e chave local (default: '_')
 *
 * @returns {{ carregar, salvarMerge, limpar }}
 */
export function criarStorage({ colecaoFirestore, prefixoLocal, nomeSistema = 'storage', separador = '_' }) {
  const tag = `[${nomeSistema}]`;

  /* Monta a chave localStorage: nexus_vf_{usuario}_{discId}_{sem} */
  const _chaveLocal = (usuario, discId, sem) =>
    `${prefixoLocal}${separador}${usuario}${separador}${discId}${separador}${sem}`;

  /* Patch ainda não enviado ao Firestore (ver "Pendente de sincronização") */
  const _chavePend = (usuario, discId, sem) => `${_chaveLocal(usuario, discId, sem)}__pend`;

  /* Referência ao documento Firestore: /usuarios/{uid}/{colecao}/{sem}_{discId} */
  const _docRef = (usuario, discId, sem) =>
    doc(getDb(), 'usuarios', usuario, colecaoFirestore, `${sem}${separador}${discId}`);

  /* Envia o patch pendente (se houver). true = nada pendente / enviado. */
  async function _enviarPendente(usuario, discId, sem) {
    const chavePend = _chavePend(usuario, discId, sem);
    const pend = lerLocal(chavePend);
    if (Object.keys(pend).length === 0) return true;
    try {
      await setDoc(_docRef(usuario, discId, sem), pend, { merge: true });
      localStorage.removeItem(chavePend);
      console.log(`${tag} Pendências enviadas ao Firestore: ${usuario}/${sem}${separador}${discId}`);
      return true;
    } catch (err) {
      console.warn(`${tag} Não foi possível enviar pendências (ficam guardadas):`, err.message);
      return false;
    }
  }

  /* ── CARREGAR ── */
  async function carregar(usuario, discId, sem) {
    const chave = _chaveLocal(usuario, discId, sem);

    if (_ehVisitante(usuario) || !(await sessaoAutenticada(usuario))) {
      return lerLocal(chave);
    }

    try {
      const enviou = await _enviarPendente(usuario, discId, sem);
      const pend   = enviou ? {} : lerLocal(_chavePend(usuario, discId, sem));
      const snap   = await getDoc(_docRef(usuario, discId, sem));

      if (snap.exists()) {
        // Remoto + (o que ainda não conseguiu subir): nada feito offline se perde.
        const dados = { ...snap.data(), ...pend };
        escreverLocal(chave, dados);
        console.log(`${tag} Carregado do Firestore: ${usuario}/${sem}${separador}${discId}`);
        return dados;
      }

      if (Object.keys(pend).length > 0) {
        // Documento ainda não existe, mas há progresso pendente: mantém o local.
        return lerLocal(chave);
      }

      // Documento não existe no Firestore → zera o cache local para
      // ficar em sincronia (evita "ressuscitar" dados obsoletos locais)
      localStorage.removeItem(chave);
      console.log(`${tag} Firestore vazio → cache local zerado: ${usuario}/${sem}${separador}${discId}`);
      return {};

    } catch (err) {
      // Falha de rede/permissão → usa localStorage como fallback
      console.warn(`${tag} Firestore indisponível, usando localStorage:`, err.message);
      return lerLocal(chave);
    }
  }

  /* ── SALVAR (merge) ── */
  /**
   * Salva um patch no localStorage (imediato) e faz merge no Firestore.
   * O localStorage é sempre atualizado primeiro para garantir que o dado
   * não se perde caso o Firestore esteja indisponível.
   *
   * @returns {Promise<boolean>} true se o patch chegou ao Firestore
   */
  async function salvarMerge(usuario, discId, sem, patch) {
    if (!patch || Object.keys(patch).length === 0) return true;
    const limpo = _limpo(patch);

    const chave = _chaveLocal(usuario, discId, sem);
    const atual = lerLocal(chave);

    // Merge local
    Object.assign(atual, limpo);
    escreverLocal(chave, atual);

    if (_ehVisitante(usuario)) return false;

    // Acumula no pendente ANTES de tentar: se a aba fechar no meio, nada se perde.
    const chavePend = _chavePend(usuario, discId, sem);
    const pend = lerLocal(chavePend);
    Object.assign(pend, limpo);
    escreverLocal(chavePend, pend);

    if (!(await sessaoAutenticada(usuario))) {
      console.warn(`${tag} Sem sessão válida — dado salvo só localmente (será enviado depois).`);
      return false;
    }

    try {
      await setDoc(_docRef(usuario, discId, sem), pend, { merge: true });
      localStorage.removeItem(chavePend);
      return true;
    } catch (err) {
      console.warn(`${tag} Erro ao salvar no Firestore (dado salvo localmente e pendente):`, err.message);
      return false;
    }
  }

  /* ── LIMPAR ── */
  /**
   * Para usuários autenticados: apaga o Firestore PRIMEIRO.
   * O localStorage só é removido após confirmação — se o deleteDoc falhar,
   * o cache local permanece e não "ressuscita" dados obsoletos na próxima carga.
   *
   * Para visitantes: remove apenas o localStorage.
   * Usuário sem sessão válida: não dá para apagar o remoto → nada é apagado.
   */
  async function limpar(usuario, discId, sem) {
    const chave = _chaveLocal(usuario, discId, sem);

    if (_ehVisitante(usuario)) {
      localStorage.removeItem(chave);
      return;
    }

    if (!(await sessaoAutenticada(usuario))) {
      console.warn(`${tag} Sem sessão válida — nada foi apagado (nem local, nem Firestore).`);
      return;
    }

    try {
      await deleteDoc(_docRef(usuario, discId, sem));
      console.log(`${tag} Apagado no Firestore: ${usuario}/${sem}${separador}${discId}`);
    } catch (err) {
      console.warn(`${tag} Erro ao apagar no Firestore — localStorage mantido:`, err.message);
      return; // aborta: não apaga o local se o Firestore falhou
    }

    localStorage.removeItem(chave);
    localStorage.removeItem(_chavePend(usuario, discId, sem));
  }

  return { carregar, salvarMerge, limpar };
}
