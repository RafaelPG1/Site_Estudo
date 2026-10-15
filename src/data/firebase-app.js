// Arquivo: src/data/firebase-app.js
/* =============================================
   NEXUS STUDY — src/data/firebase-app.js
   ÚNICO ponto de inicialização do Firebase e único lugar
   onde a URL do SDK (CDN) é declarada para a camada de dados.

   Responsabilidades:
     · config do projeto + initializeApp (idempotente)
     · getDb()  → cliente Firestore (lazy, mesmo comportamento
                  anterior de src/firebase.js)
     · re-exportar as funções do SDK Firestore que os repositórios
       (e, quando migrarem, os demais módulos) precisam, para que a
       versão/URL do SDK exista em UM lugar.

   NÃO faz: regras de negócio, caminhos de coleções (colecoes.js),
            DOM, eventos de UI.

   Firebase Authentication (Etapa 4): o Auth é inicializado AQUI, no
   mesmo app do Firestore, de forma imediata (não lazy). Assim toda
   página que usa o Firestore (Home, Dashboard, Quiz, Admin, Games...)
   envia automaticamente o token do usuário logado, sem mudar código.

   IMPORTANTE: a URL do SDK abaixo é a MESMA usada pelos demais
   arquivos (10.12.0). O navegador resolve URL idêntica para a mesma
   instância de módulo, então não há SDK duplicado nem segunda
   inicialização. dashboard.html continua fazendo modulepreload
   dessas mesmas URLs.
   ============================================= */

import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { initializeFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

/* Re-export do SDK Auth (fonte única da URL) */
export { signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword };

/* ── Re-export do SDK Firestore (fonte única da URL) ── */
export {
  doc, getDoc, setDoc, deleteDoc,
  collection, getDocs, getDocsFromServer, addDoc,
  query, orderBy, limit, where, documentId,
  writeBatch, increment,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

/* ── CONFIG ─────────────────────────────────── */
const firebaseConfig = {
  apiKey:            'AIzaSyBWRSuyiPS9ez7TFm7K4j5pd7LbdSfPPMk',
  authDomain:        'estudo-site-85244.firebaseapp.com',
  projectId:         'estudo-site-85244',
  storageBucket:     'estudo-site-85244.firebasestorage.app',
  messagingSenderId: '529138252727',
  appId:             '1:529138252727:web:d866279f0c795b013e4632',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/* ── AUTH ───────────────────────────────────────────────────────
   getAuth(app) usa persistência local (IndexedDB/localStorage): a
   sessão sobrevive a recarregar a página e funciona offline. Chamado
   já aqui para o Firestore enxergar o Auth desde a primeira leitura. */
const _auth = getAuth(app);
export function getAuthInstance() { return _auth; }

/* Espera o Auth terminar de restaurar a sessão salva (leitura local, não depende de rede).
   Resolve com o usuário do Firebase ou null; se demorar mais que `timeoutMs`, resolve com
   undefined (= "não deu para saber": o chamador mantém o que já tinha). */
export function aguardarAuth(timeoutMs = 6000) {
  return new Promise(resolve => {
    let cancelar = null;
    const t = setTimeout(() => { try { cancelar && cancelar(); } catch (_) {} resolve(undefined); }, timeoutMs);
    cancelar = onAuthStateChanged(_auth, u => {
      clearTimeout(t);
      try { cancelar && cancelar(); } catch (_) {}
      resolve(u);
    });
  });
}

/* ── CLIENTE FIRESTORE ──────────────────────────────────────────
   experimentalAutoDetectLongPolling: mantém a auto-detecção de
   transporte configurada de forma explícita (em vez do
   getFirestore() implícito).
   NOTA (histórico, vindo de src/firebase.js): o warm-up de canal
   que existia no módulo foi removido; ele vive em um <script>
   clássico no <head> de cada HTML (ver dashboard.html). ────── */
let _db = null;
export function getDb() {
  if (!_db) {
    _db = initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    });
  }
  return _db;
}