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

   Preparação para segurança (NÃO implementada nesta fase):
   quando houver Firebase Auth / custom token, o ponto de entrada
   será aqui (getAuth/signIn), sem tocar nos repositórios.

   IMPORTANTE: a URL do SDK abaixo é a MESMA usada pelos demais
   arquivos (10.12.0). O navegador resolve URL idêntica para a mesma
   instância de módulo, então não há SDK duplicado nem segunda
   inicialização. dashboard.html continua fazendo modulepreload
   dessas mesmas URLs.
   ============================================= */

import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { initializeFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

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