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
═══════════════════════════════════════════════════════════════ */

const _base = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? ''
  : '/Site_Estudo';
const { getDb } = await import(`${_base}/src/firebase.js`);
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

  /* Referência ao documento Firestore: /usuarios/{uid}/{colecao}/{sem}_{discId} */
  const _docRef = (usuario, discId, sem) =>
    doc(getDb(), 'usuarios', usuario, colecaoFirestore, `${sem}${separador}${discId}`);

  /* ── CARREGAR ── */
  async function carregar(usuario, discId, sem) {
    if (!usuario || usuario === 'visitante') {
      return lerLocal(_chaveLocal(usuario, discId, sem));
    }

    try {
      const snap = await getDoc(_docRef(usuario, discId, sem));

      if (snap.exists()) {
        const dados = snap.data();
        // Atualiza o cache local com os dados do Firestore
        escreverLocal(_chaveLocal(usuario, discId, sem), dados);
        console.log(`${tag} Carregado do Firestore: ${usuario}/${sem}${separador}${discId}`);
        return dados;
      }

      // Documento não existe no Firestore → zera o cache local para
      // ficar em sincronia (evita "ressuscitar" dados obsoletos locais)
      localStorage.removeItem(_chaveLocal(usuario, discId, sem));
      console.log(`${tag} Firestore vazio → cache local zerado: ${usuario}/${sem}${separador}${discId}`);
      return {};

    } catch (err) {
      // Falha de rede → usa localStorage como fallback
      console.warn(`${tag} Firestore indisponível, usando localStorage:`, err.message);
      return lerLocal(_chaveLocal(usuario, discId, sem));
    }
  }

  /* ── SALVAR (merge) ── */
  /**
   * Salva um patch no localStorage (imediato) e faz merge no Firestore.
   * O localStorage é sempre atualizado primeiro para garantir que o dado
   * não se perde caso o Firestore esteja indisponível.
   *
   * @param {string} usuario
   * @param {string} discId
   * @param {string} sem
   * @param {object} patch   — objeto parcial a fazer merge { [id]: { ... } }
   */
  async function salvarMerge(usuario, discId, sem, patch) {
    if (!patch || Object.keys(patch).length === 0) return;

    const chave = _chaveLocal(usuario, discId, sem);
    const atual = lerLocal(chave);

    // Merge local
    Object.assign(atual, patch);
    escreverLocal(chave, atual);

    if (!usuario || usuario === 'visitante') return;

    try {
      await setDoc(_docRef(usuario, discId, sem), patch, { merge: true });
    } catch (err) {
      console.warn(`${tag} Erro ao salvar no Firestore (dado salvo localmente):`, err.message);
    }
  }

  /* ── LIMPAR ── */
  /**
   * Para usuários autenticados: apaga o Firestore PRIMEIRO.
   * O localStorage só é removido após confirmação — se o deleteDoc falhar,
   * o cache local permanece e não "ressuscita" dados obsoletos na próxima carga.
   *
   * Para visitantes: remove apenas o localStorage.
   */
  async function limpar(usuario, discId, sem) {
    if (!usuario || usuario === 'visitante') {
      localStorage.removeItem(_chaveLocal(usuario, discId, sem));
      return;
    }

    try {
      await deleteDoc(_docRef(usuario, discId, sem));
      console.log(`${tag} Apagado no Firestore: ${usuario}/${sem}${separador}${discId}`);
    } catch (err) {
      console.warn(`${tag} Erro ao apagar no Firestore — localStorage mantido:`, err.message);
      return; // aborta: não apaga o local se o Firestore falhou
    }

    localStorage.removeItem(_chaveLocal(usuario, discId, sem));
  }

  return { carregar, salvarMerge, limpar };
}