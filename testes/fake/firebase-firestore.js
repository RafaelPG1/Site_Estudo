/* SDK FALSO (só para testes): Firestore em memória + SIMULAÇÃO das regras do firestore.rules
   (dono ativo = claim nx e sem troca; coleções de jogos; <=500 campos). Registra cada operação em __fslog. */
import { getAuth } from './firebase-auth.js';
const JOGOS = ['sm_historico','sm_pontuacoes','cf_historico','srs_perfis','vf_historico','assoc_historico'];
const LOG = (globalThis.__fslog ||= []);
const load = () => { try { return JSON.parse(localStorage.getItem('__fakefs')||'{}'); } catch(_) { return {}; } };
const save = (d) => localStorage.setItem('__fakefs', JSON.stringify(d));
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
const denied = () => Object.assign(new Error('Missing or insufficient permissions.'), { code:'permission-denied' });
function allow(op, segs, result){
  const a = getAuth().currentUser; const cl = (a&&a.__claims)||{};
  const ativo = !!a && cl.nx===true && cl.troca!==true;
  const dono = (u)=>ativo && a.uid===u; const adm = ativo && cl.admin===true;
  if (segs[0]!=='usuarios') return false;
  const uid = segs[1];
  if (segs.length===2) return op==='read' ? (dono(uid)||adm) : op==='write' ? dono(uid) : adm;
  const col = segs[2];
  if (JOGOS.includes(col) && segs.length===4){
    if (op==='read') return dono(uid)||adm;
    if (op==='delete') return dono(uid)||adm;
    return dono(uid) && Object.keys(result||{}).length<=500;
  }
  return dono(uid)||(op==='read'&&adm);   /* demais subcoleções: aproximação (não são o alvo do teste) */
}
const isSent = (v,k)=>v&&typeof v==='object'&&v.__sent===k;
export function initializeFirestore(){ return { fake:true }; }
export function doc(db,...p){ return { __p:p, id:p[p.length-1], path:p.join('/') }; }
export function collection(db,...p){ return { __c:p, path:p.join('/') }; }
export function arrayUnion(...v){ return { __sent:'union', v }; }
export function increment(n){ return { __sent:'inc', n }; }
export const query=(c)=>c, orderBy=()=>0, limit=()=>0, where=()=>0, documentId=()=>0;
function checkUndef(v,path){ if(v===undefined) throw new Error('Function setDoc() called with invalid data. Unsupported field value: undefined (found in field '+path+')');
  if(v&&typeof v==='object'&&!Array.isArray(v)&&!v.__sent) for(const k of Object.keys(v)) checkUndef(v[k],path+'.'+k);
  if(Array.isArray(v)) v.forEach((x,i)=>checkUndef(x,path+'['+i+']')); if(isSent(v,'union')) v.v.forEach((x,i)=>checkUndef(x,path+'.arrayUnion['+i+']')); }
function merge(dst,src){ const o={...(dst||{})}; for(const k of Object.keys(src)){ const v=src[k];
  if(isSent(v,'union')){ const cur=Array.isArray(o[k])?o[k]:[]; const add=v.v.filter(x=>!cur.some(y=>JSON.stringify(y)===JSON.stringify(x))); o[k]=[...cur,...JSON.parse(JSON.stringify(add))]; }
  else if(isSent(v,'inc')) o[k]=(o[k]||0)+v.n;
  else if(v&&typeof v==='object'&&!Array.isArray(v)&&o[k]&&typeof o[k]==='object'&&!Array.isArray(o[k])) o[k]=merge(o[k],v);
  else o[k]=JSON.parse(JSON.stringify(v)); } return o; }
async function net(op,path){ await sleep(3); if(globalThis.__fsOffline||localStorage.getItem('__fsoffline')==='1'){ LOG.push({op,path,ok:false,err:'unavailable'}); throw Object.assign(new Error('Failed to get document because the client is offline.'),{code:'unavailable'}); } }
export async function getDoc(ref){ const path=ref.path; await net('get',path);
  if(!allow('read',ref.__p)){ LOG.push({op:'get',path,ok:false,err:'permission-denied'}); throw denied(); }
  const d=load()[path]; LOG.push({op:'get',path,ok:true,exists:d!==undefined});
  return { id:ref.id, exists:()=>d!==undefined, data:()=>d===undefined?undefined:JSON.parse(JSON.stringify(d)) }; }
export async function setDoc(ref,data,opt){ const path=ref.path; await net('set',path); checkUndef(data,'');
  const db=load(); const res=opt&&opt.merge ? merge(db[path],data) : merge({},data);
  if(!allow('write',ref.__p,res)){ LOG.push({op:'set',path,ok:false,err:'permission-denied',keys:Object.keys(data)}); throw denied(); }
  db[path]=res; save(db); LOG.push({op:'set',path,ok:true,merge:!!(opt&&opt.merge),keys:Object.keys(data)}); }
export async function deleteDoc(ref){ const path=ref.path; await net('delete',path);
  if(!allow('delete',ref.__p)){ LOG.push({op:'delete',path,ok:false,err:'permission-denied'}); throw denied(); }
  const db=load(); delete db[path]; save(db); LOG.push({op:'delete',path,ok:true}); }
export async function getDocs(c){ const p=c.path+'/'; await net('list',c.path); const db=load();
  if(!allow('read',[...c.__c,'x'])){ LOG.push({op:'list',path:c.path,ok:false,err:'permission-denied'}); throw denied(); }
  const docs=Object.keys(db).filter(k=>k.startsWith(p)&&!k.slice(p.length).includes('/')).map(k=>({id:k.slice(p.length),data:()=>db[k],exists:()=>true}));
  LOG.push({op:'list',path:c.path,ok:true,n:docs.length}); return { docs, size:docs.length, empty:!docs.length, forEach:(f)=>docs.forEach(f) }; }
export const getDocsFromServer=getDocs;
export async function addDoc(){ throw denied(); }
export function writeBatch(){ return { set(){return this}, update(){return this}, delete(){return this}, commit: async()=>{} }; }
