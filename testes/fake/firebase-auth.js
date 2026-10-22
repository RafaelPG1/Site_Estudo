/* SDK FALSO (só para testes): sessão restaurada com atraso configurável. */
const cfg = () => { try { return JSON.parse(localStorage.getItem('__fakeauth') || 'null') || {}; } catch (_) { return {}; } };
let _auth = null; const _ls = [];
function _mk(u){ return u ? { uid:u.uid, __claims:u.claims||{}, getIdToken: async()=>'tok-'+u.uid, getIdTokenResult: async()=>({ claims:u.claims||{} }) } : null; }
export function getAuth(){
  if (_auth) return _auth;
  const c = cfg(); let ok; const ready = new Promise(r=>ok=r);
  _auth = { currentUser:null, authStateReady:()=>ready, __ready:false };
  setTimeout(()=>{ _auth.currentUser=_mk(c.user); _auth.__ready=true; ok(); _ls.forEach(f=>f(_auth.currentUser)); }, c.delay||0);
  globalThis.__fakeSignOut = ()=>{ _auth.currentUser=null; _ls.forEach(f=>f(null)); };
  return _auth;
}
export function onAuthStateChanged(a, cb){ _ls.push(cb); if (a.__ready) queueMicrotask(()=>cb(a.currentUser)); return ()=>{ const i=_ls.indexOf(cb); if(i>=0)_ls.splice(i,1); }; }
export async function signInWithEmailAndPassword(){ throw Object.assign(new Error('fake'),{code:'auth/invalid-credential'}); }
export async function signOut(){ globalThis.__fakeSignOut && globalThis.__fakeSignOut(); }
export async function updatePassword(){}
